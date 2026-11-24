import{B as k}from"./BaseWidget-B7_ZohqD.js";import"./CourseHealthManager-BrI3ZEnZ.js";import"./monaco-CMNtKCUQ.js";import"./ScrollManager-B3Qlvkl3.js";import"./markdown-BDRwxJm4.js";import"./katex-XbL3y5x-.js";class h{constructor(e){this.fileType=e.fileType??"file",this.fileName=e.fileName??"plik.txt",this.ownerName=e.ownerName??"właściciel",this.groupName=e.groupName??"grupa",this.showSpecial=e.showSpecial??!1,this.identities=e.identities??[{id:"owner",label:`${this.ownerName} (właściciel)`},{id:"group",label:`użytkownik z grupy ${this.groupName}`},{id:"other",label:"inny użytkownik"}],this.goal=e.goal??null,this.initialBits=this._cloneBits(e.initial??{}),this.bits=this._cloneBits(e.initial??{}),this._activeIdentity="owner",this._activeAction="read",this._subscribers=[],this._unlocked=!1,this._hasInteracted=!1,e.randomize!==!1&&this.randomizeGoal()}static TASK_POOL=[{title:"Poufny raport (0600)",label:"Ustaw uprawnienia tak, aby tylko {owner} mógł czytać i modyfikować plik (rw-). Grupa ({group}) i pozostali nie powinni mieć żadnego dostępu (---).",bits:{owner:{r:!0,w:!0,x:!1},group:{r:!1,w:!1,x:!1},other:{r:!1,w:!1,x:!1}}},{title:"Plik konfiguracyjny usługi (0640)",label:"Zabezpiecz plik konfiguracyjny: {owner} ma pełny dostęp (rw-), {group} może go tylko odczytywać (r--), a pozostali nie mają żadnego dostępu (---).",bits:{owner:{r:!0,w:!0,x:!1},group:{r:!0,w:!1,x:!1},other:{r:!1,w:!1,x:!1}}},{title:"Dokument ogólnodostępny (0644)",label:"Udostępnij dokument dla każdego do odczytu: {owner} może go modyfikować (rw-), a {group} oraz pozostali mogą go wyłącznie czytać (r--).",bits:{owner:{r:!0,w:!0,x:!1},group:{r:!0,w:!1,x:!1},other:{r:!0,w:!1,x:!1}}},{title:"Skrypt serwisowy (0750)",label:"Skonfiguruj skrypt administracyjny: {owner} ma pełne prawa (rwx), {group} może go odczytywać i uruchamiać (r-x), a pozostali nie mają dostępu (---).",bits:{owner:{r:!0,w:!0,x:!0},group:{r:!0,w:!1,x:!0},other:{r:!1,w:!1,x:!1}}},{title:"Aplikacja ogólnodostępna (0755)",label:"Udostępnij skrypt systemowy: {owner} ma pełny dostęp (rwx), a {group} i pozostali użytkownicy mogą go odczytywać i uruchamiać (r-x).",bits:{owner:{r:!0,w:!0,x:!0},group:{r:!0,w:!1,x:!0},other:{r:!0,w:!1,x:!0}}},{title:"Ścisły klucz certyfikatu (0400)",label:"Zablokuj zapis klucza w trybie tylko do odczytu: {owner} ma wyłącznie prawo odczytu (r--), a grupa ({group}) i pozostali nie mają żadnych praw (---).",bits:{owner:{r:!0,w:!1,x:!1},group:{r:!1,w:!1,x:!1},other:{r:!1,w:!1,x:!1}}}];randomizeGoal(){const e=h.TASK_POOL.filter(a=>!this._bitsEqual(this.initialBits,a.bits)&&(!this.goal||a.label!==this.goal.label));if(e.length===0)return;const t=e[Math.floor(Math.random()*e.length)],i=t.label.replace(/{owner}/g,this.ownerName).replace(/{group}/g,this.groupName);this.goal={title:t.title,label:i,bits:this._cloneBits(t.bits)},this._hasInteracted=!1,this._unlocked=!1,this._notify()}_cloneBits(e){return{suid:e.suid??!1,sgid:e.sgid??!1,sticky:e.sticky??!1,owner:{r:e.owner?.r??!1,w:e.owner?.w??!1,x:e.owner?.x??!1},group:{r:e.group?.r??!1,w:e.group?.w??!1,x:e.group?.x??!1},other:{r:e.other?.r??!1,w:e.other?.w??!1,x:e.other?.x??!1}}}_bitsEqual(e,t){if(!e||!t)return!1;const i=["owner","group","other"];for(const a of i)if(e[a]?.r!==t[a]?.r||e[a]?.w!==t[a]?.w||e[a]?.x!==t[a]?.x)return!1;return!(e.suid!==void 0&&e.suid!==t.suid||e.sgid!==void 0&&e.sgid!==t.sgid||e.sticky!==void 0&&e.sticky!==t.sticky)}toggleBit(e,t){!this.bits[e]||!["r","w","x"].includes(t)||(this.bits[e][t]=!this.bits[e][t],this._hasInteracted=!0,this._notify())}toggleSpecial(e){["suid","sgid","sticky"].includes(e)&&(this.bits[e]=!this.bits[e],this._hasInteracted=!0,this._notify())}setIdentity(e){this.identities.find(t=>t.id===e)&&(this._activeIdentity=e,this._notify())}setAction(e){["read","write","execute"].includes(e)&&(this._activeAction=e,this._notify())}getSymbolic(){const e=this.bits,t=this.fileType==="dir"?"d":"-",i=e.suid?e.owner.x?"s":"S":e.owner.x?"x":"-",a=e.sgid?e.group.x?"s":"S":e.group.x?"x":"-",s=e.sticky?e.other.x?"t":"T":e.other.x?"x":"-";return t+(e.owner.r?"r":"-")+(e.owner.w?"w":"-")+i+(e.group.r?"r":"-")+(e.group.w?"w":"-")+a+(e.other.r?"r":"-")+(e.other.w?"w":"-")+s}getOctal(){const e=this.bits,t=(e.suid?4:0)+(e.sgid?2:0)+(e.sticky?1:0),i=(e.owner.r?4:0)+(e.owner.w?2:0)+(e.owner.x?1:0),a=(e.group.r?4:0)+(e.group.w?2:0)+(e.group.x?1:0),s=(e.other.r?4:0)+(e.other.w?2:0)+(e.other.x?1:0);return`${t}${i}${a}${s}`}getLsEntry(){const e=this.getSymbolic(),t=this.fileName,i=this.ownerName,a=this.groupName;return`${e}  1 ${i.padEnd(10)} ${a.padEnd(10)} 1024 lip 16 10:15 ${t}`}get activeIdentity(){return this._activeIdentity}get activeAction(){return this._activeAction}get isUnlocked(){return this._unlocked}testAccess(e=this._activeIdentity,t=this._activeAction){const i=this.bits,a=this.fileType==="dir",l={read:"r",write:"w",execute:"x"}[t];let r,o;switch(e){case"owner":r=i.owner,o="właściciela";break;case"group":r=i.group,o="grupy";break;default:r=i.other,o="pozostałych";break}const n=!!r[l],d={read:a?"listowania zawartości (`ls`)":"odczytu",write:a?"tworzenia/usuwania plików w katalogu":"zapisu",execute:a?"wejścia do katalogu (`cd`)":"uruchomienia"}[t];let c;n?c=`Bit \`${l}\` wiersza **${o}** jest ustawiony → dostęp przyznany.`:c=`Bit \`${l}\` wiersza **${o}** nie jest ustawiony → dostęp odmówiony.`;let u="";return t==="execute"&&this.bits.suid&&this.fileType!=="dir"&&(u=" Plik ma ustawiony SUID — po uruchomieniu działa z prawami **właściciela**, nie twojimi."),t==="execute"&&this.bits.sticky&&this.fileType==="dir"&&(u=" Katalog ma Sticky Bit — możesz wchodzić, ale usuniesz tylko własne pliki."),{allowed:n,actionLabel:d,mechanic:c+u}}checkGoal(){return!this.goal||!this._hasInteracted?!1:this._bitsEqual(this.bits,this.goal.bits)}markUnlocked(){return this._unlocked?!1:(this._unlocked=!0,!0)}getState(){return{bits:this.bits,symbolic:this.getSymbolic(),octal:this.getOctal(),lsEntry:this.getLsEntry(),fileType:this.fileType,fileName:this.fileName,ownerName:this.ownerName,groupName:this.groupName,showSpecial:this.showSpecial,identities:this.identities,activeIdentity:this._activeIdentity,activeAction:this._activeAction,goal:this.goal,goalMet:this.goal?this._bitsEqual(this.bits,this.goal.bits):!1,unlocked:this._unlocked,testResult:this.testAccess()}}subscribe(e){this._subscribers.push(e)}_notify(){const e=this.getState();this._subscribers.forEach(t=>t(e))}}class x{static async fromUrl(e){const t=e.startsWith("/public/")?e.replace(/^\/public/,""):e;let i=null;try{i=await fetch(t),!i.ok&&t!==e&&(i=await fetch(e))}catch(s){if(t!==e)i=await fetch(e);else throw s}if(!i||!i.ok)throw new Error(`[PermissionLabScenarioParser] Nie można załadować scenariusza: ${e} (${i?.status})`);const a=await i.text();return this.parse(a)}static parse(e){const i=new DOMParser().parseFromString(e,"text/html"),a=i.querySelector("data-permission-scenario");if(!a)throw new Error("[PermissionLabScenarioParser] Brak elementu <data-permission-scenario>.");const s=a.getAttribute("file-type")??"file",l=a.getAttribute("file-name")??"plik.txt",r=a.getAttribute("owner-name")??"Jan",o=a.getAttribute("group-name")??"pracownicy",n=a.getAttribute("title")??"Lab uprawnień",b=a.getAttribute("show-special")==="true",d=Array.from(i.querySelectorAll("identity")),c=d.length>0?d.map(p=>({id:p.getAttribute("id"),label:p.getAttribute("label")??p.getAttribute("id")})):[{id:"owner",label:`${r} (właściciel)`},{id:"group",label:`użytkownik z grupy ${o}`},{id:"other",label:"inny użytkownik"}],u=i.querySelector("initial"),f=this._parseBits(u,"initial"),w=i.querySelector("goal");let g=null;if(w){const p=i.querySelector("goal expect")??i.querySelector("expect"),m=this._parseBits(p,"expect");g={label:w.getAttribute("label")??"Osiągnij wymagany stan uprawnień.",bits:m}}return{fileType:s,fileName:l,ownerName:r,groupName:o,title:n,showSpecial:b,identities:c,initial:f,goal:g}}static _parseBits(e,t=""){if(!e)return console.warn(`[PermissionLabScenarioParser] Element <${t}> nie został znaleziony w scenariuszu.`),{suid:!1,sgid:!1,sticky:!1,owner:{r:!1,w:!1,x:!1},group:{r:!1,w:!1,x:!1},other:{r:!1,w:!1,x:!1}};const i=a=>e.getAttribute(a)==="true";return{suid:i("suid"),sgid:i("sgid"),sticky:i("sticky"),owner:{r:i("owner-r"),w:i("owner-w"),x:i("owner-x")},group:{r:i("group-r"),w:i("group-w"),x:i("group-x")},other:{r:i("other-r"),w:i("other-w"),x:i("other-x")}}}}class L extends k{async mount(){this.escapeParagraphWrapper();const e=this.container.getAttribute("src")||this.options.src;if(!e){this.container.textContent="[permission-lab] Brak atrybutu src.";return}const t=await x.fromUrl(e);this._title=t.title,this._fileType=t.fileType,this.model=new h(t),this.model.subscribe(i=>this._update(i)),this._completionEmitted=!1,this._render()}_xLabel(){return this._fileType==="dir"?"wejście cd":"uruchom"}_render(){const e=Math.random().toString(36).slice(2,8);this._uid=e;const t=document.createElement("section");t.className="plab-widget",t.setAttribute("aria-label",this._title),t.innerHTML=`
            <header class="plab-header">
                <p class="plab-kicker">Lab uprawnień</p>
                <h3 class="plab-title" id="plab-title-${e}">${this._title}</h3>
                <p class="plab-intro">
                    Klikaj pola w siatce (r/w/x), aby włączać i wyłączać prawa dostępu.
                    Wybierz tożsamość i akcję po prawej, aby sprawdzić ich rezultat.
                </p>
            </header>

            <!-- Cel scenariusza (Zadanie) — teraz na samej górze, kompaktowy alert-box -->
            <div class="plab-goal js-goal" hidden>
                <div class="plab-goal-badge js-goal-badge">Zadanie</div>
                <div class="plab-goal-content">
                    <p class="plab-goal-label js-goal-label"></p>
                    <p class="plab-goal-status js-goal-status"></p>
                </div>
                <button class="plab-random-btn js-random-btn" type="button" title="Wylosuj inne wyzwanie uprawnień">Losuj inne zadanie 🎲</button>
            </div>

            <div class="plab-main">

                <!-- ── LEWA KOLUMNA: Siatka uprawnień ── -->
                <div class="plab-permissions-col">
                    <p class="plab-col-title">Konfiguracja pliku</p>

                    <div class="plab-file-meta">
                        <span class="plab-file-glyph js-file-glyph"></span>
                        <span class="plab-file-name js-file-name"></span>
                    </div>

                    <div class="plab-grid" role="group" aria-label="Siatka bitów uprawnień">
                        <!-- Nagłówek kolumn -->
                        <div class="plab-grid-row plab-grid-header-row" aria-hidden="true">
                            <span class="plab-cell plab-cell--label"></span>
                            <span class="plab-cell plab-cell--head">
                                <strong>r</strong>
                                <small>odczyt</small>
                            </span>
                            <span class="plab-cell plab-cell--head">
                                <strong>w</strong>
                                <small>zapis</small>
                            </span>
                            <span class="plab-cell plab-cell--head js-x-head">
                                <strong>x</strong>
                                <small class="js-x-label">${this._xLabel()}</small>
                            </span>
                        </div>

                        ${this._rowHTML("owner","Właściciel",e)}
                        ${this._rowHTML("group","Grupa",e)}
                        ${this._rowHTML("other","Pozostali",e)}
                    </div>

                    <!-- Bity specjalne (SUID/SGID/Sticky) — ukryte domyślnie -->
                    <div class="plab-special-row js-special-row" role="group" aria-label="Bity specjalne" hidden>
                        <p class="plab-special-intro">Bity specjalne:</p>
                        <div class="plab-special-buttons">
                            ${this._specialBitHTML("suid","SUID","plik jako właściciel",e)}
                            ${this._specialBitHTML("sgid","SGID","dziedziczenie grupy",e)}
                            ${this._specialBitHTML("sticky","Sticky","blokada usuwania pliku",e)}
                        </div>
                    </div>

                    <!-- Live readout -->
                    <div class="plab-notation" aria-label="Notacja uprawnień">
                        <div class="plab-notation-item">
                            <span class="plab-notation-label">ls -la</span>
                            <code class="plab-symbolic js-symbolic"></code>
                        </div>
                        <div class="plab-notation-item">
                            <span class="plab-notation-label">chmod</span>
                            <code class="plab-octal js-octal"></code>
                        </div>
                    </div>
                </div>

                <!-- ── PRAWA KOLUMNA: Panel testu ── -->
                <div class="plab-test-col">
                    <p class="plab-col-title">Sprawdź dostęp</p>

                    <div class="plab-test-group" role="group" aria-label="Wybierz tożsamość">
                        <p class="plab-group-q">Kim jesteś?</p>
                        <div class="plab-identity-buttons js-identity-buttons"></div>
                    </div>

                    <div class="plab-test-group" role="group" aria-label="Wybierz akcję">
                        <p class="plab-group-q">Co chcesz zrobić?</p>
                        <div class="plab-action-buttons">
                            ${this._actionBtnHTML("read","Odczytaj",e)}
                            ${this._actionBtnHTML("write","Zapisz",e)}
                            ${this._actionBtnHTML("execute",this._xLabel(),e)}
                        </div>
                    </div>

                    <!-- Wynik testu -->
                    <div class="plab-result js-result" role="status" aria-live="polite" aria-atomic="true">
                        <div class="plab-result-answer js-result-answer">
                            <span class="plab-result-icon js-result-icon"></span>
                            <span class="plab-result-verdict js-result-verdict"></span>
                        </div>
                        <p class="plab-result-mechanic js-result-mechanic"></p>
                    </div>
                </div>

            </div>
        `,this.container.replaceChildren(t),this.widgetElement=t,this._bindEvents(t),this._update(this.model.getState()),this.enableApplicationMode(t,{labelledBy:`plab-title-${e}`})}_rowHTML(e,t,i){return`
            <div class="plab-grid-row" data-who="${e}" role="group" aria-label="${t}">
                <span class="plab-cell plab-cell--label">${t}</span>
                ${["r","w","x"].map(s=>`
                    <span class="plab-cell plab-cell--bit">
                        <button
                            class="plab-bit"
                            data-who="${e}"
                            data-bit="${s}"
                            id="plab-${e}-${s}-${i}"
                            role="switch"
                            aria-checked="false"
                            aria-label="${t}: ${s==="r"?"odczyt":s==="w"?"zapis":this._xLabel()}"
                        >–</button>
                    </span>
                `).join("")}
            </div>
        `}_specialBitHTML(e,t,i,a){return`
            <button
                class="plab-special-bit"
                data-bit="${e}"
                id="plab-special-${e}-${a}"
                role="switch"
                aria-checked="false"
                aria-label="Bit specjalny: ${t} — ${i}"
                title="${i}"
            >
                <span class="plab-special-name">${t}</span>
                <small class="plab-special-desc">${i}</small>
            </button>
        `}_actionBtnHTML(e,t,i){return`
            <button
                class="plab-action-btn"
                data-action="${e}"
                id="plab-action-${e}-${i}"
                aria-pressed="false"
            >${t}</button>
        `}_bindEvents(e){e.querySelectorAll(".plab-bit").forEach(i=>{i.addEventListener("click",()=>{this.model.toggleBit(i.dataset.who,i.dataset.bit)})}),e.querySelectorAll(".plab-special-bit").forEach(i=>{i.addEventListener("click",()=>{this.model.toggleSpecial(i.dataset.bit)})}),e.querySelector(".js-identity-buttons").addEventListener("click",i=>{const a=i.target.closest("[data-identity]");a&&this.model.setIdentity(a.dataset.identity)}),e.querySelectorAll(".plab-action-btn").forEach(i=>{i.addEventListener("click",()=>{this.model.setAction(i.dataset.action)})});const t=e.querySelector(".js-random-btn");t&&t.addEventListener("click",()=>{this.model.randomizeGoal()})}_update(e){const t=this.widgetElement;if(!t)return;t.querySelector(".js-file-glyph").textContent=this._fileGlyph(e.fileType),t.querySelector(".js-file-name").textContent=e.fileName,t.querySelector(".js-symbolic").textContent=e.symbolic,t.querySelector(".js-octal").textContent=`chmod ${e.octal}`;const i=e.bits;["owner","group","other"].forEach(s=>{["r","w","x"].forEach(l=>{const r=t.querySelector(`.plab-bit[data-who="${s}"][data-bit="${l}"]`);if(!r)return;const o=i[s][l];r.setAttribute("aria-checked",String(o)),r.classList.toggle("is-on",o),r.classList.toggle("is-off",!o),r.textContent=o?l:"–"})});const a=t.querySelector(".js-special-row");a.hidden=!e.showSpecial,e.showSpecial&&["suid","sgid","sticky"].forEach(s=>{const l=t.querySelector(`.plab-special-bit[data-bit="${s}"]`);if(!l)return;const r=i[s];l.setAttribute("aria-checked",String(r)),l.classList.toggle("is-on",r)}),this._updateIdentityButtons(t,e),t.querySelectorAll(".plab-action-btn").forEach(s=>{const l=s.dataset.action===e.activeAction;s.setAttribute("aria-pressed",String(l)),s.classList.toggle("is-active",l)}),this._updateResult(t,e),this._updateGoal(t,e),t.classList.toggle("is-complete",e.goalMet),e.goalMet&&this.model.markUnlocked()&&this._emitCompletion()}_updateIdentityButtons(e,t){const i=e.querySelector(".js-identity-buttons");i.children.length!==t.identities.length?i.innerHTML=t.identities.map(a=>`
                <button
                    class="plab-identity-btn"
                    data-identity="${a.id}"
                    aria-pressed="${String(a.id===t.activeIdentity)}"
                >${a.label}</button>
            `).join(""):i.querySelectorAll(".plab-identity-btn").forEach(a=>{const s=a.dataset.identity===t.activeIdentity;a.setAttribute("aria-pressed",String(s)),a.classList.toggle("is-active",s)})}_updateResult(e,t){const i=e.querySelector(".js-result"),a=i.querySelector(".plab-result-hint"),s=i.querySelector(".js-result-answer"),l=i.querySelector(".js-result-icon"),r=i.querySelector(".js-result-verdict"),o=i.querySelector(".js-result-mechanic");a&&(a.hidden=!0),s.hidden=!1,o.hidden=!1;const n=t.testResult;l.textContent=n.allowed?"✅":"❌",r.textContent=n.allowed?`Dozwolono — ${n.actionLabel}`:`Odmowa — brak prawa do ${n.actionLabel}`,o.textContent=n.mechanic.replace(/\*\*/g,"").replace(/`/g,""),i.className=`plab-result js-result ${n.allowed?"is-allowed":"is-denied"}`}_updateGoal(e,t){const i=e.querySelector(".js-goal"),a=e.querySelector(".js-goal-label"),s=e.querySelector(".js-goal-status"),l=e.querySelector(".js-goal-badge");if(!t.goal){i.hidden=!0;return}i.hidden=!1,a.textContent=t.goal.label,t.goalMet?(i.classList.add("is-met"),l.textContent="✓ Sukces",s.textContent="Cel osiągnięty! Kliknij dalej w bramce poniżej."):(i.classList.remove("is-met"),l.textContent="Zadanie",s.textContent="Dostosuj uprawnienia w siatce, aby spełnić warunki.")}_fileGlyph(e){return e==="dir"?"📁":e==="executable"?"⚙️":"📄"}_emitCompletion(){this._completionEmitted||(this._completionEmitted=!0,this.container.dispatchEvent(new CustomEvent("complete",{bubbles:!0,detail:{widget:"data-permission-lab"}})),this.container.dispatchEvent(new CustomEvent("unlocked",{bubbles:!0})))}}export{L as default};
