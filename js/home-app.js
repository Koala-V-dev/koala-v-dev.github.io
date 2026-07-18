import{T as l,S as c}from"./ScrollManager-Bvu4jb_g.js";import"./markdown-CUzkdAAO.js";let i=[];document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("header-actions");t&&new l().inject(t),new c,await d()});async function d(){const t=document.getElementById("home-courses-grid-mount");if(t)try{const e=await fetch("/courses/registry.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);i=((await e.json()).courses||[]).filter(r=>r.status==="published"),u(i,t)}catch(e){console.info("[Koala-V] Brak registry.json lub błąd pobierania.",e.message),t.innerHTML='<div class="courses-empty"><p>Kursy są w przygotowaniu — wkrótce tutaj!</p></div>'}}function u(t,e){if(!t.length){e.innerHTML='<div class="courses-empty"><p>Brak dostępnych kursów.</p></div>';return}e.innerHTML=`
        <div class="courses-filter-wrapper">
            <input type="text" class="form-control" id="search-input" placeholder="Szukaj kursu..." style="width: 100%; max-width: 600px;">
        </div>
        <ul class="courses-list" id="courses-list" style="grid-template-columns: repeat(auto-fill, minmax(430px, 1fr));">
            ${n(t)}
        </ul>
        <div class="pagination-controls" style="display: flex; justify-content: center; gap: 10px; margin-top: 30px;"></div>
    `;const s=document.getElementById("search-input");s&&s.addEventListener("input",r=>m(r.target.value.trim()))}function n(t){return t.map(e=>{const s=e.thumbnail||"/resources/courses/default_course.webp";return`
        <li class="course-card-item" style="display: contents;">
            <div class="card course-card" tabindex="-1">
                <a class="stretched-link" href="/courses/${e.slug}" aria-label="Otwórz kurs: ${e.title}" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" tabindex="-1" aria-hidden="true"></a>
                <div class="card-img-container">
                    <img src="${s}" alt="${e.title}" class="card-img-top lazy-image lazy-image--loaded" loading="lazy" width="199" height="141">
                </div>
                <div class="card-body">
                    <div class="card-title" role="text">${e.title}</div>
                </div>
            </div>
        </li>
        `}).join("")}function m(t){const e=document.getElementById("courses-list");if(!e)return;const s=t.toLowerCase(),r=s?i.filter(a=>a.title?.toLowerCase().includes(s)||a.description?.toLowerCase().includes(s)||a.tags?.some(o=>o.toLowerCase().includes(s))):i;r.length?e.innerHTML=n(r):e.innerHTML='<li style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">Brak kursów spełniających kryteria.</li>'}
