import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import sharp from 'sharp';
import * as markedModule from 'marked';
import { JSDOM } from 'jsdom';
import { extractCourseWidgets, updatePoligonDb } from './poligon-extractor.mjs';

// --- KONFIGURACJA ŚRODOWISKA ---
const projectRoot = path.resolve(process.cwd(), '.');
dotenv.config({ path: path.join(projectRoot, '.env') });

const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
const repoOwner = process.env.GITHUB_REPO_OWNER || 'Edu-Koala-V';
const repoName = process.env.GITHUB_REPO_NAME || 'Courses';
const githubBasePath = 'Courses'; // folder w repo

if (!githubToken) {
    console.error("❌ Brak GITHUB_TOKEN w pliku .env!");
    process.exit(1);
}

/** Wrzuca plik na GitHuba używając API REST */
async function uploadToGithub(filePath, contentBuffer, slug) {
    const fileName = path.basename(filePath);
    const githubPath = `${githubBasePath}/${slug}/Images/${fileName}`;
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${githubPath}`;

    let sha = null;
    try {
        const checkRes = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${githubToken}`,
                'User-Agent': 'Koala-V-Compiler',
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        if (checkRes.ok) {
            const data = await checkRes.json();
            sha = data.sha;
            console.log(`[GitHub] Plik ${fileName} już istnieje (SHA: ${sha}). Nadpisywanie/Pomijanie...`);
            return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${githubPath}`;
        }
    } catch (e) { }

    const base64Content = contentBuffer.toString('base64');

    const body = {
        message: `Wrzucanie zoptymalizowanego asetu ${fileName} [Auto-SSG]`,
        content: base64Content
    };
    if (sha) body.sha = sha;

    console.log(`[GitHub] Uploadowanie ${fileName}...`);
    const uploadRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${githubToken}`,
            'User-Agent': 'Koala-V-Compiler',
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        },
        body: JSON.stringify(body)
    });

    if (!uploadRes.ok) {
        console.error("❌ Błąd uploadu:", await uploadRes.text());
        throw new Error("GitHub API Error");
    }

    return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${githubPath}`;
}

async function processImagesInMarkdown(markdownContent, courseSourcePath, slug) {
    let localMarkdown = markdownContent;
    let prodMarkdown = markdownContent;

    const cachePath = path.join(courseSourcePath, '.image_cache.json');
    let cache = {};
    try {
        cache = JSON.parse(await fs.readFile(cachePath, 'utf8'));
    } catch (e) { }

    let allMatches = [];

    for (const match of markdownContent.matchAll(/!\[([^\]]*)\]\((?!http)(?!.*OLD__)([^()]+(?:\([^()]*\)[^()]*)*)\)/g)) {
        allMatches.push({
            type: 'markdown',
            fullTag: match[0],
            altText: match[1],
            localImgPath: match[2]
        });
    }

    for (const match of markdownContent.matchAll(/<img\s+([^>]+)>/gi)) {
        const attributes = match[1];
        const srcMatch = attributes.match(/src=["']((?!\s*http|OLD__)[^"']+)["']/i);
        if (srcMatch) {
            const altMatch = attributes.match(/alt=["']([^"']*)["']/i);
            allMatches.push({
                type: 'img',
                fullTag: match[0],
                altText: altMatch ? altMatch[1] : "",
                localImgPath: srcMatch[1]
            });
        }
    }

    for (const match of markdownContent.matchAll(/<data-hotspot\s+([^>]+)>/gi)) {
        const attributes = match[1];
        const imgMatch = attributes.match(/image=["']((?!\s*http|OLD__)[^"']+)["']/i);
        if (imgMatch) {
            allMatches.push({
                type: 'hotspot',
                fullTag: match[0],
                altText: "",
                localImgPath: imgMatch[1],
                rawImagePath: imgMatch[1]
            });
        }
    }

    for (const matchObj of allMatches) {
        const fullTag = matchObj.fullTag;
        const altText = matchObj.altText;
        let localImgPath = matchObj.localImgPath;

        if (localImgPath.includes('OLD__')) continue;

        let targetSlug = slug;
        let relativeImg = localImgPath;

        const coursesMatch = localImgPath.match(/^(?:\/public)?\/courses\/([^\/]+)\/(.*)/);
        if (coursesMatch) {
            targetSlug = coursesMatch[1];
            relativeImg = coursesMatch[2]; // np. Images/palce.png
        } else {
            if (relativeImg.includes('Images/')) {
                relativeImg = relativeImg.substring(relativeImg.indexOf('Images/'));
            } else if (relativeImg.includes('Audio/')) {
                relativeImg = relativeImg.substring(relativeImg.indexOf('Audio/'));
            }
        }

        // Zapożyczony plik z innego kursu -> Omijamy I/O i kompresję, generujemy finalne tagi od razu!
        if (targetSlug !== slug) {
            let finalFileName = relativeImg;
            if (finalFileName.endsWith('.png') || finalFileName.endsWith('.jpg') || finalFileName.endsWith('.jpeg')) {
                finalFileName = finalFileName.substring(0, finalFileName.lastIndexOf('.')) + '.webp';
            }

            const cleanFinalName = finalFileName.replace(/\\/g, '/');
            const githubRawUrl = `https://raw.githubusercontent.com/Edu-Koala-V/Courses/main/Courses/${targetSlug}/${cleanFinalName}`;

            // localMarkdown (widok z public)
            let newLocalTag;
            let newProdTag;
            if (matchObj.type === 'hotspot') {
                newLocalTag = matchObj.fullTag.replace(matchObj.rawImagePath, `/courses/${targetSlug}/${cleanFinalName}`);
                newProdTag = matchObj.fullTag.replace(matchObj.rawImagePath, githubRawUrl);
            } else if (matchObj.type === 'img') {
                newLocalTag = `<img src="/public/courses/${targetSlug}/${cleanFinalName}" alt="${altText}">`;
                newProdTag = `<img src="${githubRawUrl}" alt="${altText}" class="lazy-image" loading="lazy" decoding="async">`;
            } else {
                newLocalTag = `![${altText}](/public/courses/${targetSlug}/${cleanFinalName})`;
                newProdTag = `<img src="${githubRawUrl}" alt="${altText}" class="lazy-image" loading="lazy" decoding="async">`;
            }

            localMarkdown = localMarkdown.replace(fullTag, newLocalTag);
            prodMarkdown = prodMarkdown.replace(fullTag, newProdTag);
            continue;
        }

        let absoluteImgPath = path.resolve(courseSourcePath, relativeImg);

        try {
            let stat;
            try {
                stat = await fs.stat(absoluteImgPath);
            } catch (err) {
                if (err.code === 'ENOENT') {
                    const parsed = path.parse(absoluteImgPath);
                    const oldPath = path.join(parsed.dir, 'OLD__' + parsed.base);
                    try {
                        stat = await fs.stat(oldPath);
                        absoluteImgPath = oldPath; // Użyj starego obrazka jako źródła
                        console.log(`[AutoFix] Znaleziono starszą wersję z prefixem OLD__ dla obrazka: ${relativeImg}`);
                    } catch (errOld) {
                        throw err; // Zwróć oryginalny błąd jeśli stara kopia też nie istnieje
                    }
                } else {
                    throw err;
                }
            }

            const mtime = stat.mtimeMs;
            const parsedPath = path.parse(absoluteImgPath);
            const ext = parsedPath.ext.toLowerCase();
            const isWebp = ext === '.webp';
            const isSvg = ext === '.svg';

            let githubRawUrl, width, height, finalFileName;

            if (cache[relativeImg] && cache[relativeImg].mtime === mtime) {
                githubRawUrl = cache[relativeImg].githubUrl;
                width = cache[relativeImg].width;
                height = cache[relativeImg].height;
                finalFileName = cache[relativeImg].finalFileName || cache[relativeImg].finalWebpName;
                console.log(`[Cache] Pominięto kompresję/upload dla ${relativeImg}`);
            } else {
                const imgBuffer = await fs.readFile(absoluteImgPath);
                let uploadBuffer = imgBuffer;
                let uploadFilePath = absoluteImgPath;

                if (isSvg) {
                    finalFileName = parsedPath.base; // Zachowaj format SVG, aby nie utracić wektorowości i metadanych
                    uploadFilePath = path.join(parsedPath.dir, finalFileName);
                    try {
                        const metadata = await sharp(imgBuffer).metadata();
                        width = metadata.width || null;
                        height = metadata.height || null;
                    } catch (e) {
                        width = null;
                        height = null;
                    }
                } else if (isWebp) {
                    finalFileName = parsedPath.base;
                    const metadata = await sharp(imgBuffer).metadata();
                    width = metadata.width;
                    height = metadata.height;
                } else {
                    finalFileName = parsedPath.name + '.webp';
                    uploadFilePath = path.join(parsedPath.dir, finalFileName);
                    console.log(`🔄 Kompresja ${parsedPath.base} -> ${finalFileName} (w pamięci)...`);
                    uploadBuffer = await sharp(imgBuffer).webp({ quality: 80 }).toBuffer();
                    const metadata = await sharp(uploadBuffer).metadata();
                    width = metadata.width;
                    height = metadata.height;
                }

                githubRawUrl = await uploadToGithub(uploadFilePath, uploadBuffer, slug);

                cache[relativeImg] = { mtime, githubUrl: githubRawUrl, width, height, finalFileName, finalWebpName: finalFileName };
                await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
            }

            let newLocalTag;
            let newProdTag;
            const widthAttr = width ? ` width="${width}"` : '';
            const heightAttr = height ? ` height="${height}"` : '';

            if (matchObj.type === 'hotspot') {
                newLocalTag = matchObj.fullTag.replace(matchObj.rawImagePath, `/courses/${slug}/Images/${finalFileName}`);
                newProdTag = matchObj.fullTag.replace(matchObj.rawImagePath, githubRawUrl);
            } else if (matchObj.type === 'img') {
                newLocalTag = `<img src="/public/courses/${slug}/Images/${finalFileName}" alt="${altText}">`;
                newProdTag = `\n\n<img src="${githubRawUrl}" alt="${altText}"${widthAttr}${heightAttr} class="lazy-image" loading="lazy" decoding="async">\n\n`;
            } else {
                newLocalTag = `![${altText}](/public/courses/${slug}/Images/${finalFileName})`;
                newProdTag = `\n\n<img src="${githubRawUrl}" alt="${altText}"${widthAttr}${heightAttr} class="lazy-image" loading="lazy" decoding="async">\n\n`;
            }

            localMarkdown = localMarkdown.replace(fullTag, newLocalTag);
            prodMarkdown = prodMarkdown.replace(fullTag, newProdTag);

        } catch (err) {
            console.warn(`⚠️ Ominięto obrazek: ${localImgPath} (Błąd: ${err.message})`);
        }
    }

    return { localMarkdown, prodMarkdown };
}

function slugify(text) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıįjłľļńñòóôöõøōőœŕřśšşșťțùúûüūűųůẃýÿźžżæœß✔❌';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiijlllknnoooooooooccrrssssttuuuuuuuuwyyzzz__s_x';
    const p = new RegExp(a.split('').join('|'), 'g');

    return text.toString().toLowerCase()
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function extractKeywords(name, description, listText) {
    const combined = `${name} ${description} ${listText}`.toLowerCase();
    const keywords = [];

    if (combined.includes('windows filtering platform')) {
        keywords.push('Windows Filtering Platform');
    }
    if (combined.includes('wfp')) {
        keywords.push('WFP');
    }
    if (combined.includes('zapora') || combined.includes('firewall')) {
        if (!keywords.includes('firewall')) keywords.push('firewall');
        if (!keywords.includes('zapora')) keywords.push('zapora');
    }
    if (combined.includes('serwer') && (combined.includes('gry') || combined.includes('gracza'))) {
        keywords.push('serwer gry');
    }
    if (combined.includes('port')) {
        keywords.push('port');
    }
    if ((combined.includes('decyzja') || combined.includes('decyzyjny')) &&
        (combined.includes('sieć') || combined.includes('sieci') || combined.includes('sieciow'))) {
        keywords.push('decyzja sieciowa');
    }
    if (combined.includes('reguł')) {
        keywords.push('reguły bezpieczeństwa');
    }
    if (combined.includes('ipsec')) {
        keywords.push('IPsec');
    }
    if (combined.includes('bfe')) {
        keywords.push('BFE');
    }
    if (combined.includes('nla')) {
        keywords.push('NLA');
    }

    const words = combined.match(/[a-pr-uwy-zżółćęśąźń]{4,}/gi) || [];
    const stopWords = new Set([
        'przedstawia', 'proces', 'pokazuje', 'próbującego', 'połączyć', 'hostowanej', 'komputerze',
        'inicjuje', 'połączenie', 'punkt', 'który', 'sprawdza', 'dołącza', 'zostaje', 'odrzucony',
        'zielony', 'czerwony', 'kolory', 'oraz', 'tylko', 'jest', 'jego', 'dla', 'przez', 'lub'
    ]);

    for (const word of words) {
        if (stopWords.has(word)) continue;
        if (word === 'filtrowania' || word === 'filtrowanie') {
            if (!keywords.includes('filtrowanie')) keywords.push('filtrowanie');
        }
        if (word === 'ruch' || word === 'ruchu') {
            if (!keywords.includes('ruch sieciowy')) keywords.push('ruch sieciowy');
        }
    }

    if (keywords.length < 3) {
        const nameWords = name.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(w => w.length > 3);
        for (const w of nameWords) {
            if (keywords.length < 7 && !keywords.map(k => k.toLowerCase()).includes(w.toLowerCase())) {
                keywords.push(w);
            }
        }
    }

    return keywords.join(', ');
}

// --- GŁÓWNA LOGIKA CLI ---
function applyLessonSemanticSections(document) {
    const container = document.body;
    if (!container || container.querySelector(":scope > section[data-lesson-section]")) return;

    const directChildren = Array.from(container.childNodes);
    let currentSection = null;

    for (const node of directChildren) {
        const isSectionHeading = node.nodeType === 1 && node.matches?.("h2");

        if (isSectionHeading) {
            currentSection = document.createElement("section");
            currentSection.className = "lesson-section";
            currentSection.setAttribute("data-lesson-section", "true");
            container.insertBefore(currentSection, node);
        }

        if (currentSection) {
            currentSection.appendChild(node);
        }
    }
}

function hardenEmbeddedFrames(document) {
    for (const frame of document.querySelectorAll('iframe')) {
        frame.removeAttribute('srcdoc');
        for (const attr of Array.from(frame.attributes)) {
            if (/^on/i.test(attr.name)) {
                frame.removeAttribute(attr.name);
            }
        }

        const src = frame.getAttribute('src');
        if (src) {
            let trimmedSrc = src.trim();
            if (trimmedSrc.startsWith('/public/')) {
                trimmedSrc = trimmedSrc.replace(/^\/public/, '');
            }
            // Folder na dysku to "Resources" – GitHub Pages (Linux) rozróżnia wielkość liter.
            trimmedSrc = trimmedSrc.replace(/^\/resources\//i, '/Resources/');

            const isSafeRelative = trimmedSrc.startsWith('/') || trimmedSrc.startsWith('./') || trimmedSrc.startsWith('../');
            const isSafeAbsolute = /^https?:\/\//i.test(trimmedSrc);

            if (isSafeRelative || isSafeAbsolute) {
                frame.setAttribute('src', trimmedSrc);
            } else {
                frame.removeAttribute('src');
            }
        }

        const title = frame.getAttribute('title')?.trim();
        if (!title) {
            frame.setAttribute('title', 'Osadzona treść zewnętrzna');
        }

        if (!frame.hasAttribute('sandbox')) {
            frame.setAttribute('sandbox', '');
        }

        const sandboxTokens = (frame.getAttribute('sandbox') || '')
            .split(/\s+/)
            .map(token => token.trim())
            .filter(Boolean);
        
        const finalSrc = frame.getAttribute('src') || '';
        const isExternal = /^https?:\/\//i.test(finalSrc);
        if (isExternal && sandboxTokens.includes('allow-scripts') && sandboxTokens.includes('allow-same-origin')) {
            frame.setAttribute('sandbox', sandboxTokens.filter(token => token !== 'allow-same-origin').join(' '));
        }

        if (!frame.hasAttribute('referrerpolicy')) {
            frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        }

        if (!frame.hasAttribute('loading')) {
            frame.setAttribute('loading', 'lazy');
        }
    }
}

function normalizeAssetUrls(document) {
    const elements = document.querySelectorAll('video, audio, track, source, img, a, embed, object');
    for (const el of elements) {
        for (const attr of ['src', 'href']) {
            let val = el.getAttribute(attr);
            if (val) {
                let trimmed = val.trim();
                if (trimmed.startsWith('/public/')) {
                    trimmed = trimmed.replace(/^\/public/, '');
                }
                trimmed = trimmed.replace(/^\/resources\//i, '/Resources/');
                el.setAttribute(attr, trimmed);
            }
        }
    }
}


function _parseCourseStructure(markdown) {
    const lines = markdown.split("\n");
    const structure = [];
    let currentModule = null;
    let currentFolder = null;
    let moduleCount = 0;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const moduleMatch = trimmed.match(/^##\s+(.+)$/);
        if (moduleMatch) {
            currentModule = {
                type: 'module',
                title: moduleMatch[1].trim(),
                folderName: `Moduł ${moduleCount}`,
                items: []
            };
            structure.push(currentModule);
            currentFolder = null;
            moduleCount++;
            return;
        }

        const folderMatch = trimmed.match(/^###\s+(.+)$/);
        if (folderMatch && currentModule) {
            currentFolder = {
                type: 'folder',
                title: folderMatch[1].trim(),
                items: []
            };
            currentModule.items.push(currentFolder);
            return;
        }

        const lessonMatch = trimmed.match(/^#\s+(.+)$/);
        if (lessonMatch) {
            const title = lessonMatch[1].trim();
            if (currentModule) {
                currentModule.items.push({ type: 'lesson', title: title, path: `${currentModule.folderName}/${title}` });
            } else {
                structure.push({ type: 'lesson', title: title, path: title });
            }
            currentFolder = null;
            return;
        }

        const itemMatch = trimmed.match(/^-+\s+(.+)$/);
        if (itemMatch) {
            const title = itemMatch[1].trim();
            if (currentModule) {
                if (currentFolder) {
                    currentFolder.items.push({ type: 'lesson', title: title, path: `${currentModule.folderName}/${currentFolder.title}/${title}` });
                } else {
                    currentModule.items.push({ type: 'lesson', title: title, path: `${currentModule.folderName}/${title}` });
                }
            } else {
                structure.push({ type: 'lesson', title: title, path: title });
            }
        }
    });

    return structure;
}

function generateSidebarHtml(structure, courseSlug) {
    let html = '<nav class="module-menu drawer-left"><ul>';
    
    for (const item of structure) {
        if (item.type === 'module') {
            html += `<li class="module">${item.title}</li>`;
            for (const subItem of item.items) {
                if (subItem.type === 'folder') {
                    html += `<li class=""><details open><summary>${subItem.title}</summary><ul>`;
                    for (const lesson of subItem.items) {
                        const lessonHref = lesson.path.split('/').map(encodeURIComponent).join('/');
                        html += `<li class="lesson-item lesson" tabindex="0" data-path="${lesson.path}"><a class="lesson-link" href="/courses/${courseSlug}/Pages/${lessonHref}.html" data-pjax style="text-decoration: none; color: inherit; display: block; width: 100%;">${lesson.title}</a></li>`;
                    }
                    html += `</ul></details></li>`;
                } else {
                    const subItemHref = subItem.path.split('/').map(encodeURIComponent).join('/');
                    html += `<li class="lesson-item lesson" tabindex="0" data-path="${subItem.path}"><a class="lesson-link" href="/courses/${courseSlug}/Pages/${subItemHref}.html" data-pjax style="text-decoration: none; color: inherit; display: block; width: 100%;">${subItem.title}</a></li>`;
                }
            }
        } else {
            const itemHref = item.path.split('/').map(encodeURIComponent).join('/');
            html += `<li class="lesson-item lesson" tabindex="0" data-path="${item.path}"><a class="lesson-link" href="/courses/${courseSlug}/Pages/${itemHref}.html" data-pjax style="text-decoration: none; color: inherit; display: block; width: 100%;">${item.title}</a></li>`;
        }
    }
    html += '</ul></nav>';
    return html;
}

function generateHtmlShell(contentHtml, sidebarHtml, title, courseSlug) {
    return `<!DOCTYPE html>
<html lang="pl" data-theme="dark">
<head>
    <script>
      (function () {
        try {
          var c = document.cookie.split('; ').find(row => row.startsWith('theme='));
          var t = c ? c.split('=')[1] : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          document.documentElement.setAttribute('data-theme', t);
          if (t === 'dark') {
            document.write('<style>html, body { background-color: #0b0f19; color: #e1e1e1; }</style>');
          }
        } catch (e) {}
      })();
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Koala-V</title>
    <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
  <link rel="stylesheet" href="/css/course-style.css" />
    <script type="module" src="/js/course-app.js"></script>
</head>
<body class="browser-firefox">
    <div id="course-slug" style="display:none;">${courseSlug}</div>
    <header>
        <p class="site-logo medievalsharp-regular">
            <a href="/">
                <img src="/main-logo.svg" alt="" height="80" width="80" class="lazy-image lazy-image--loaded">
                <span class="logo-text">Koala-V</span>
            </a>
        </p>
        <div class="header-actions" id="header-actions">
           <!-- Zdublowany theme-switcher z html zostal usuniety. js zajmie sie dodaniem jednego! -->
        </div>

        <div class="course-mobile-header">
            <div class="header-left">
                <button class="btn btn-icon btn-drawer btn-modules" aria-label="Moduły" title="Moduły">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
            </div>
            <div class="header-right">
                <button class="btn btn-icon btn-drawer btn-toc" aria-label="Spis Treści" title="Spis Treści">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    </header>
    
    <div class="drawer-backdrop"></div>

    <main class="course-page fade-in" id="course-page-shell">
        <aside class="course-sidebar" id="course-lesson-content-nav-inner">
            ${sidebarHtml}
        </aside>
        
        <article id="course-lesson-content">
            ${contentHtml}
        </article>

        <!-- Puste miejsce na nawigację po nagłówkach -->
        <section id="course-lesson-content-nav" class="drawer-right"></section>
    </main>

    <footer>
      <p>
        <button class="important-font scroll-to-top-btn" aria-label="Wróć na górę" title="Wróć na górę">⬆</button>
        <span class="important-font">©</span> 2026 Koala-V
      </p>
      <p>kamil.zbrzezniak@teb.edu.pl</p>
    </footer>

</body>
</html>`;
}

async function compileCourse() {
    const args = process.argv.slice(2);
    const slug = args[0];

    if (!slug) {
        console.error("Użycie: node cli/build-course.mjs <nazwa-kursu>");
        process.exit(1);
    }

    const sourceDir = path.join(projectRoot, 'public', 'courses', slug);
    const outputDir = path.join(projectRoot, 'courses', slug);

    try {
        await fs.access(sourceDir);
    } catch {
        console.error(`❌ Katalog źródłowy nie istnieje: ${sourceDir}`);
        process.exit(1);
    }

    await fs.mkdir(path.join(outputDir, 'Pages'), { recursive: true });

    const pagesDir = path.join(sourceDir, 'Pages');
    const files = await fs.readdir(pagesDir, { recursive: true });

    const mdFiles = files.filter(f => f.endsWith('.md'));

    let courseStructure = [];
    let sidebarHtml = "";
    try {
        const indexMdContent = await fs.readFile(path.join(pagesDir, '_index.md'), 'utf8');
        courseStructure = _parseCourseStructure(indexMdContent);
        sidebarHtml = generateSidebarHtml(courseStructure, slug);
        console.log(`✅ Pomyślnie wygenerowano strukturę kursu ze spisem treści.`);
    } catch(e) {
        console.warn(`⚠️ Brak pliku _index.md dla kursu ${slug}. Spis treści będzie pusty.`);
    }

    const htmlFiles = files.filter(f => f.endsWith('.html'));

    // Kopiowanie surowych plików HTML (np. na potrzeby testów Playwright)
    for (const file of htmlFiles) {
        const fullSourcePath = path.join(pagesDir, file);
        const outHtmlPath = path.join(outputDir, 'Pages', file);

        await fs.mkdir(path.dirname(outHtmlPath), { recursive: true });
        console.log(`📋 Kopiowanie pliku HTML: ${file}...`);
        await fs.copyFile(fullSourcePath, outHtmlPath);
    }

    for (const file of mdFiles) {
        const fullSourcePath = path.join(pagesDir, file);
        const relativePath = file;
        const outHtmlPath = path.join(outputDir, 'Pages', relativePath.replace('.md', '.html'));
        const outMdPath = path.join(outputDir, 'Pages', relativePath);

        await fs.mkdir(path.dirname(outHtmlPath), { recursive: true });

        console.log(`\n📄 Przetwarzanie: ${relativePath}...`);
        let mdContent = await fs.readFile(fullSourcePath, 'utf8');

        // 1. FAZA DRAFTS (Optymalizacja + GitHub Upload)
        const processed = await processImagesInMarkdown(mdContent, sourceDir, slug);
        // Pomijamy nadpisywanie pliku źródłowego .md (processed.localMarkdown), aby zachować go w oryginalnym stanie.

        const prodMdContent = processed.prodMarkdown;

        
        if (relativePath.endsWith('_index.md')) {
            // Generate root index.html using the shell
            const rootIndexPath = path.join(outputDir, 'index.html');
            const rootHtml = generateHtmlShell('<h1>Witaj w kursie!</h1><p>Wybierz lekcję z menu po lewej stronie, aby rozpocząć.</p>', sidebarHtml, slug, slug);
            await fs.writeFile(rootIndexPath, rootHtml);
            console.log(`✅ Wygenerowano główny index.html (EntryPoint).`);
            continue;
        }
    

        // 2. FAZA PRODUKCJI (Kompilacja Markdown -> HTML z ROZSZERZENIAMI Z RenderMarkdown.js)
        const extensions = [];

        // Keep inline LaTeX opaque to marked so `_` remains a TeX subscript
        // operator instead of opening Markdown emphasis.
        extensions.push({
            name: 'inlineMath',
            level: 'inline',
            start(src) { return src.indexOf('$'); },
            tokenizer(src) {
                const match = /^\$(?!\$)(?:\\.|[^\\$\n])+\$/.exec(src);
                if (match) return { type: 'inlineMath', raw: match[0] };
            },
            renderer(token) { return token.raw; }
        });

        // Alert Extension (GitHub style)
        extensions.push({
            name: 'alert',
            level: 'block',
            start(src) { return src.match(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:> .*\n?)*)/i)?.index; },
            tokenizer(src, tokens) {
                const rule = /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n((?:> .*\n?)*)/i;
                const match = rule.exec(src);
                if (match) {
                    const text = match[2].replace(/^> /gm, '');
                    return {
                        type: 'alert',
                        raw: match[0],
                        alertType: match[1].toLowerCase(),
                        text,
                        tokens: this.lexer.blockTokens(text, [])
                    };
                }
            },
            renderer(token) {
                const ALERT_TYPES = {
                    note: { icon: '💬', label: 'Notatka' },
                    tip: { icon: '✨', label: 'Wskazówka' },
                    important: { icon: '📌', label: 'Ważny punkt' },
                    warning: { icon: '🚧', label: 'Uwaga' },
                    caution: { icon: '❗', label: 'Ostrożnie' }
                };
                const type = token.alertType;
                const { icon, label } = ALERT_TYPES[type] ?? { icon: 'ℹ', label: 'Informacja' };

                return `<div class="markdown-alert markdown-alert--${type}">
<p class="markdown-alert-title">
<span class="alert-icon">${icon}</span> ${label}
</p>
<div class="markdown-alert-content">
${this.parser.parse(token.tokens)}
</div>
</div>`;
            }
        });

        // Flag Icon Extension
        extensions.push({
            name: 'flagIcon',
            level: 'inline',
            start(src) { return src.match(/[\uD83C][\uDDE6-\uDDFF]/)?.index; },
            tokenizer(src, tokens) {
                const rule = /^([\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF])/;
                const match = rule.exec(src);
                if (match) {
                    const code = Array.from(match[1])
                        .map(char => String.fromCharCode(char.codePointAt(0) - 0x1F1E6 + 65))
                        .join('')
                        .toLowerCase();
                    return { type: 'flagIcon', raw: match[0], code: code };
                }
            },
            renderer(token) {
                return `<span class="flag-icon-premium flag-${token.code}"></span>`;
            }
        });

        // Non-breaking Hyphen Extension
        extensions.push({
            name: 'nonBreakingHyphen',
            level: 'inline',
            start(src) { return src.match(/[a-zA-Z0-9]-/)?.index; },
            tokenizer(src, tokens) {
                const rule = /^([a-zA-Z0-9]+)-([a-zA-Z0-9]+)/;
                const match = rule.exec(src);
                if (match) {
                    return { type: 'nonBreakingHyphen', raw: match[0], text: `${match[1]}&#8209;${match[2]}` };
                }
            },
            renderer(token) { return token.text; }
        });

        const Marked = markedModule.Marked || (markedModule.default && markedModule.default.Marked) || markedModule.default;
        const markedInstance = new Marked({
            gfm: true,
            breaks: true,
            extensions: extensions
        });

        const HEADING_OFFSET = 0; // Lekcja sama dostarcza h1, a h2 wyznaczaja sekcje artykulu.
        markedInstance.use({
            renderer: {
                heading(token) {
                    const { text, depth } = token;
                    const adjustedLevel = Math.min(6, depth + HEADING_OFFSET);
                    return `<h${adjustedLevel}>${text}</h${adjustedLevel}>\n`;
                },
                strong(token) {
                    const first = token.tokens?.[0];
                    if (token.tokens?.length === 1 && first?.type === 'em') {
                        return `<span class="color-red">${this.parser.parseInline(first.tokens)}</span>`;
                    }

                    return `<span class="color-green">${this.parser.parseInline(token.tokens)}</span>`;
                },
                em(token) {
                    const first = token.tokens?.[0];
                    if (token.tokens?.length === 1 && first?.type === 'strong') {
                        return `<span class="color-gold">${this.parser.parseInline(first.tokens)}</span>`;
                    }

                    return `<span class="color-blue">${this.parser.parseInline(token.tokens)}</span>`;
                }
            }
        });

        const macros = {
            'vone': '#ff0001',
            'vtwo': '#ff0002',
            'xone': '#ff0003',
            'xtwo': '#ff0004'
        };

        let preprocessed = prodMdContent;
        for (const [name, color] of Object.entries(macros)) {
            const regex = new RegExp(`\\\\${name}\\{(.*?)\\}`, 'g');
            preprocessed = preprocessed.replace(regex, `\\textcolor{${color}}{$1}`);
        }

        // Przetwarzanie bloków diagramów i schematów
        const usedIds = new Set();
        let diagramCounter = 1;
        preprocessed = preprocessed.replace(
            /(?:(<img\s+([^>]+)>)|(!\[([^\]]*)\]\(([^()]+)\)))\s*?:::diagram\s*\r?\n([\s\S]*?)\r?\n:::\s*?(?:\*?\*?Opis strukturalny diagramu\*?\*?:?\s*?\r?\n\s*?)?((?:\d+\.\s+.*\r?\n?)(?:[ \t]*\d+\.\s+.*\r?\n?|(?:[ \t]{2,}|\t)(?![#<!]|:::)\S.*\r?\n?)*)/gi,
            (match, imgTag, imgAttrs, mdImgTag, mdAlt, mdSrc, desc, list) => {
                const alt = imgTag
                    ? (imgTag.match(/alt="([^"]*)"/i)?.[1] || '')
                    : (mdAlt || '');

                const description = desc.trim();
                const acronymMatch = description.match(/\(([A-Z]{2,6})\)/);
                const acronym = acronymMatch ? acronymMatch[1].toLowerCase() : null;

                let id = acronym ? `diagram-${acronym}` : `diagram-${slugify(alt.slice(0, 25))}`;
                if (!id || id === 'diagram-') {
                    id = `diagram-${diagramCounter++}`;
                }
                while (usedIds.has(id)) {
                    id = `${id}-${diagramCounter++}`;
                }
                usedIds.add(id);

                const newImgTag = imgTag
                    ? imgTag.replace(/<img\s/i, `<img aria-describedby="${id}" `)
                    : `<img src="${mdSrc}" alt="${alt}" aria-describedby="${id}" class="lazy-image" loading="lazy" decoding="async">`;

                const normalizedList = list.split(/\r?\n/)
                    .map(line => {
                        const match = line.match(/^([ \t]+)([-*+]\s+|\d+\.\s+)/);
                        if (match) {
                            const indentLength = match[1].length;
                            const marker = match[2];
                            const content = line.slice(match[0].length);
                            if (indentLength >= 2 && indentLength <= 3) {
                                return '    ' + marker + content;
                            }
                            if (indentLength >= 4 && indentLength <= 6) {
                                return '        ' + marker + content;
                            }
                        }
                        return line;
                    })
                    .join('\n');

                const parsedListHtml = markedInstance.parse(normalizedList).trim();
                const parsedDescription = markedInstance.parseInline(description);

                const jsonLd = {
                    "@context": "https://schema.org",
                    "@type": "ImageObject",
                    "name": alt,
                    "description": description.replace(/\s+/g, ' '),
                    "keywords": extractKeywords(alt, description, list)
                };
                const jsonLdString = JSON.stringify(jsonLd, null, 2);

                return `<figure>
${newImgTag}
<figcaption id="${id}">
<details class="diagram-meta">
<summary>Opis obrazka</summary>
<p>${parsedDescription}</p>
<section aria-label="Opis strukturalny diagramu">
${parsedListHtml}
</section>
<script type="application/ld+json">
${jsonLdString}
</script>
</details>
</figcaption>
</figure>

`;

            }
        );

        const codeRunnerStore = [];
        preprocessed = preprocessed.replace(
            /<data-code-runner([^>]*)>([\s\S]*?)<\/data-code-runner>/gi,
            (match, attrs, innerContent) => {
                const codeMatch = innerContent.match(/<template\s+data-type=["']code["']>([\s\S]*?)<\/template>/i);
                const reqMatch = innerContent.match(/<template\s+data-type=["']requirements["']>([\s\S]*?)<\/template>/i);
                const htmlMatch = innerContent.match(/<template\s+data-type=["']html["']>([\s\S]*?)<\/template>/i);

                if (!codeMatch && !reqMatch) return match;

                const id = `__CODE_RUNNER_${codeRunnerStore.length}__`;
                codeRunnerStore.push({
                    attrs: attrs.trim(),
                    code: (codeMatch ? codeMatch[1] : '').trim(),
                    requirements: (reqMatch ? reqMatch[1] : '').trim(),
                    html: (htmlMatch ? htmlMatch[1] : '').trim()
                });
                return `<div data-code-runner-id="${id}"></div>`;
            }
        );

        const playgroundStore = [];
        preprocessed = preprocessed.replace(
            /<data-playground([^>]*)>([\s\S]*?)<\/data-playground>/gi,
            (match, attrs, code) => {
                const id = `__PLAYGROUND_${playgroundStore.length}__`;
                playgroundStore.push({ attrs: attrs.trim(), code: code });
                return `<div data-playground-id="${id}"></div>`;
            }
        );

        let finalHtml = markedInstance.parse(preprocessed);

        for (let i = 0; i < codeRunnerStore.length; i++) {
            const runner = codeRunnerStore[i];
            const codeBase64 = Buffer.from(runner.code, 'utf-8').toString('base64');
            const requirementsBase64 = Buffer.from(runner.requirements, 'utf-8').toString('base64');
            let runnerTag = `<data-code-runner ${runner.attrs} data-code="${codeBase64}" data-requirements="${requirementsBase64}"`;
            if (runner.html) {
                const htmlBase64 = Buffer.from(runner.html, 'utf-8').toString('base64');
                runnerTag += ` data-html="${htmlBase64}"`;
            }
            runnerTag += `></data-code-runner>`;
            finalHtml = finalHtml.replace(`<div data-code-runner-id="__CODE_RUNNER_${i}__"></div>`, runnerTag);
        }

        for (let i = 0; i < playgroundStore.length; i++) {
            const attrStr = playgroundStore[i].attrs;
            const code = playgroundStore[i].code;
            const bytes = Buffer.from(code, 'utf-8');
            const binBase64 = bytes.toString('base64');
            const pgTag = `<data-playground ${attrStr} data-code="${binBase64}"></data-playground>`;
            finalHtml = finalHtml.replace(`<div data-playground-id="__PLAYGROUND_${i}__"></div>`, pgTag);
        }

        // Post-procesowanie zagnieżdżonych struktur za pomocą JSDOM, aby poprawnie skompilować Markdown w elementach HTML
        const dom = new JSDOM(finalHtml);
        const document = dom.window.document;

        // Kompilacja Markdown wewnątrz data-tabs
        const dataTabs = document.querySelectorAll('data-tabs');
        for (const tabs of dataTabs) {
            const divs = Array.from(tabs.childNodes).filter(node => node.nodeName === 'DIV');
            for (const div of divs) {
                div.innerHTML = markedInstance.parse(div.innerHTML.trim());
            }
        }

        // Kompilacja Markdown wewnątrz data-quiz
        const dataQuizzes = document.querySelectorAll('data-quiz');
        for (const quiz of dataQuizzes) {
            const question = quiz.querySelector('question');
            if (question) {
                question.innerHTML = markedInstance.parseInline(question.textContent.trim());
            }
            const options = quiz.querySelectorAll('option, item');
            for (const option of options) {
                option.innerHTML = markedInstance.parseInline(option.textContent.trim());
            }
            const hints = quiz.querySelectorAll('div[data-hint]');
            for (const hint of hints) {
                hint.innerHTML = markedInstance.parse(hint.textContent.trim());
            }
        }

        applyLessonSemanticSections(document);
        hardenEmbeddedFrames(document);
        normalizeAssetUrls(document);
        finalHtml = document.body.innerHTML;

        
        const pageTitle = relativePath.replace('.md', '').split('/').pop();
        const fullPageHtml = generateHtmlShell(finalHtml, sidebarHtml, pageTitle, slug);
        await fs.writeFile(outHtmlPath, fullPageHtml);
    
        console.log(`🚀 Skompilowano ${relativePath.replace('.md', '.html')}`);
    }

    // 3. FAZA POLIGONU: odświeżenie wpisów tego kursu w public/poligon-db.json
    try {
        const courseWidgets = extractCourseWidgets(sourceDir, slug);
        const stats = updatePoligonDb(projectRoot, slug, courseWidgets);
        console.log(`🎯 Poligon: ${stats.fromCourse} widgetów z kursu "${slug}" (baza: ${stats.total}).`);
    } catch (e) {
        console.warn(`⚠️ Nie udało się zaktualizować poligonu: ${e.message}`);
    }

    console.log(`\n🎉 Sukces! Kompilacja zakończona dla kursu "${slug}".`);
}

compileCourse().catch(console.error);
