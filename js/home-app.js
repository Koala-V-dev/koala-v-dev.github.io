import{T as l,S as o}from"./ScrollManager-Bvu4jb_g.js";import"./markdown-CUzkdAAO.js";let r=[];document.addEventListener("DOMContentLoaded",async()=>{const a=document.querySelector("header");if(a){let e=a.querySelector(".header-actions");e||(e=document.createElement("div"),e.className="header-actions",a.appendChild(e)),new l().inject(e)}new o,await d();const s=document.getElementById("search-input");s&&s.addEventListener("input",e=>u(e.target.value.trim()))});async function d(){const a=document.getElementById("home-courses-grid-mount");if(a)try{const s=await fetch("/courses/registry.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);r=((await s.json()).courses||[]).filter(t=>t.status==="published"),i(r,a)}catch(s){console.info("[Centrum Wiedzy] Brak registry.json lub brak opublikowanych kursów.",s.message),a.innerHTML=`
            <div class="courses-empty">
                <p>Kursy są w przygotowaniu — wkrótce tutaj!</p>
            </div>`}}function i(a,s){if(!a.length){s.innerHTML='<div class="courses-empty"><p>Brak kursów spełniających kryteria.</p></div>';return}s.innerHTML=a.map(e=>`
        <article class="course-card" role="listitem">
            <a href="/courses/${e.slug}/" class="course-card__link">
                ${e.thumbnail?`<img class="course-card__thumb" src="${e.thumbnail}" alt="${e.title}" loading="lazy" decoding="async" width="320" height="180" />`:'<div class="course-card__thumb course-card__thumb--placeholder" aria-hidden="true"></div>'}
                <div class="course-card__body">
                    <h3 class="course-card__title">${e.title}</h3>
                    ${e.description?`<p class="course-card__desc">${e.description}</p>`:""}
                    <div class="course-card__meta">
                        ${e.level?`<span class="badge badge--level">${e.level}</span>`:""}
                        ${e.lessons?`<span class="badge">${e.lessons} lekcji</span>`:""}
                        ${e.modules?`<span class="badge">${e.modules} modułów</span>`:""}
                    </div>
                    ${e.tags?.length?`<ul class="course-card__tags" aria-label="Tagi">
                               ${e.tags.map(t=>`<li class="tag">${t}</li>`).join("")}
                           </ul>`:""}
                </div>
            </a>
        </article>
    `).join("")}function u(a){const s=document.getElementById("home-courses-grid-mount");if(!s)return;const e=a.toLowerCase(),t=e?r.filter(n=>n.title?.toLowerCase().includes(e)||n.description?.toLowerCase().includes(e)||n.tags?.some(c=>c.toLowerCase().includes(e))):r;i(t,s)}
