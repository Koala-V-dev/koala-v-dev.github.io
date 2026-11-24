import{T as d,S as u}from"./ScrollManager-B3Qlvkl3.js";import{KeyboardNavigationManager as p}from"./KeyboardNavigationManager-BXxxnXVP.js";import"./markdown-BDRwxJm4.js";let r=[];document.addEventListener("DOMContentLoaded",async()=>{const t=document.getElementById("header-actions");t&&new d().inject(t),new u,await m(),document.body.classList.add("app-bootstrapped")});async function m(){const t=document.getElementById("home-courses-grid-mount");if(t)try{const e=await fetch("/courses/registry.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);r=((await e.json()).courses||[]).filter(a=>a.status==="published"&&a.kind!=="exam-sheets"),g(r,t)}catch(e){console.info("[Koala-V] Brak registry.json lub błąd pobierania.",e.message),t.innerHTML='<div class="courses-empty"><p>Kursy są w przygotowaniu — wkrótce tutaj!</p></div>'}}function g(t,e){if(!t.length){e.innerHTML='<div class="courses-empty"><p>Brak dostępnych kursów.</p></div>';return}e.innerHTML=`
        <div class="courses-filter-wrapper">
            <label for="search-input" class="sr-only">Szukaj kursu</label>
            <input type="text" class="form-control" id="search-input" placeholder="Szukaj kursu..." style="width: 100%; max-width: 600px;">
            <p id="courses-search-status" class="sr-only" aria-live="polite"></p>
        </div>
        <ul class="courses-list" id="courses-list" style="grid-template-columns: repeat(auto-fill, minmax(430px, 1fr));">
            ${l(t)}
        </ul>
        <div class="pagination-controls" style="display: flex; justify-content: center; gap: 10px; margin-top: 30px;"></div>
    `;const s=document.getElementById("search-input");s&&s.addEventListener("input",a=>h(a.target.value.trim())),o()}function o(){const t=document.getElementById("courses-list");t&&p.init(t,".course-card a.stretched-link")}function l(t){return t.map(e=>{const s=e.thumbnail||"/Resources/courses/default_course.webp";return`
        <li class="course-card-item" style="display: contents;">
            <div class="card course-card">
                <a class="stretched-link" href="/courses/${e.slug}" aria-label="Otwórz kurs: ${e.title}" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></a>
                <div class="card-img-container">
                    <img src="${s}" alt="" class="card-img-top lazy-image lazy-image--loaded" loading="lazy" width="199" height="141">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${e.title}</h3>
                </div>
            </div>
        </li>
        `}).join("")}function h(t){const e=document.getElementById("courses-list"),s=document.getElementById("courses-search-status");if(!e)return;const a=t.toLowerCase(),i=a?r.filter(n=>n.title?.toLowerCase().includes(a)||n.description?.toLowerCase().includes(a)||n.tags?.some(c=>c.toLowerCase().includes(a))):r;i.length?(e.innerHTML=l(i),s&&(s.textContent=a?`Znaleziono kursów: ${i.length}.`:""),o()):(e.innerHTML='<li style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">Brak kursów spełniających kryteria.</li>',s&&(s.textContent="Brak kursów spełniających kryteria."))}
