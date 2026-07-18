import{B as f}from"./BaseWidget-BNBMDKUj.js";import"./WidgetAccessibility-B8qhtE-O.js";import"./SessionWatchdog-Dr3fwHaz.js";import"./ScrollManager-Bvu4jb_g.js";import"./markdown-CUzkdAAO.js";import"./monaco-CMNtKCUQ.js";class k{constructor(t){this.fileType=t.fileType??"file",this.fileName=t.fileName??"plik.txt",this.ownerName=t.ownerName??"właściciel",this.groupName=t.groupName??"grupa",this.showSpecial=t.showSpecial??!1,this.identities=t.identities??[{id:"owner",label:`${this.ownerName} (właściciel)`},{id:"group",label:`użytkownik z grupy ${this.groupName}`},{id:"other",label:"inny użytkownik"}],this.goal=t.goal??null,this.bits=this._cloneBits(t.initial??{}),this._activeIdentity="owner",this._activeAction="read",this._subscribers=[],this._unlocked=!1,this._hasInteracted=!1}_cloneBits(t){return{suid:t.suid??!1,sgid:t.sgid??!1,sticky:t.sticky??!1,owner:{r:t.owner?.r??!1,w:t.owner?.w??!1,x:t.owner?.x??!1},group:{r:t.group?.r??!1,w:t.group?.w??!1,x:t.group?.x??!1},other:{r:t.other?.r??!1,w:t.other?.w??!1,x:t.other?.x??!1}}}_bitsEqual(t,e){if(!t||!e)return!1;const i=["owner","group","other"];for(const s of i)if(t[s]?.r!==e[s]?.r||t[s]?.w!==e[s]?.w||t[s]?.x!==e[s]?.x)return!1;return!(t.suid!==void 0&&t.suid!==e.suid||t.sgid!==void 0&&t.sgid!==e.sgid||t.sticky!==void 0&&t.sticky!==e.sticky)}toggleBit(t,e){!this.bits[t]||!["r","w","x"].includes(e)||(this.bits[t][e]=!this.bits[t][e],this._hasInteracted=!0,this._notify())}toggleSpecial(t){["suid","sgid","sticky"].includes(t)&&(this.bits[t]=!this.bits[t],this._hasInteracted=!0,this._notify())}setIdentity(t){this.identities.find(e=>e.id===t)&&(this._activeIdentity=t,this._notify())}setAction(t){["read","write","execute"].includes(t)&&(this._activeAction=t,this._notify())}getSymbolic(){const t=this.bits,e=this.fileType==="dir"?"d":"-",i=t.suid?t.owner.x?"s":"S":t.owner.x?"x":"-",s=t.sgid?t.group.x?"s":"S":t.group.x?"x":"-",a=t.sticky?t.other.x?"t":"T":t.other.x?"x":"-";return e+(t.owner.r?"r":"-")+(t.owner.w?"w":"-")+i+(t.group.r?"r":"-")+(t.group.w?"w":"-")+s+(t.other.r?"r":"-")+(t.other.w?"w":"-")+a}getOctal(){const t=this.bits,e=(t.suid?4:0)+(t.sgid?2:0)+(t.sticky?1:0),i=(t.owner.r?4:0)+(t.owner.w?2:0)+(t.owner.x?1:0),s=(t.group.r?4:0)+(t.group.w?2:0)+(t.group.x?1:0),a=(t.other.r?4:0)+(t.other.w?2:0)+(t.other.x?1:0);return`${e}${i}${s}${a}`}getLsEntry(){const t=this.getSymbolic(),e=this.fileName,i=this.ownerName,s=this.groupName;return`${t}  1 ${i.padEnd(10)} ${s.padEnd(10)} 1024 lip 16 10:15 ${e}`}get activeIdentity(){return this._activeIdentity}get activeAction(){return this._activeAction}get isUnlocked(){return this._unlocked}testAccess(t=this._activeIdentity,e=this._activeAction){const i=this.bits,s=this.fileType==="dir",l={read:"r",write:"w",execute:"x"}[e];let r,o;switch(t){case"owner":r=i.owner,o="właściciela";break;case"group":r=i.group,o="grupy";break;default:r=i.other,o="pozostałych";break}const n=!!r[l],u={read:s?"listowania zawartości (`ls`)":"odczytu",write:s?"tworzenia/usuwania plików w katalogu":"zapisu",execute:s?"wejścia do katalogu (`cd`)":"uruchomienia"}[e];let c;n?c=`Bit \`${l}\` wiersza **${o}** jest ustawiony → dostęp przyznany.`:c=`Bit \`${l}\` wiersza **${o}** nie jest ustawiony → dostęp odmówiony.`;let p="";return e==="execute"&&this.bits.suid&&this.fileType!=="dir"&&(p=" Plik ma ustawiony SUID — po uruchomieniu działa z prawami **właściciela**, nie twojimi."),e==="execute"&&this.bits.sticky&&this.fileType==="dir"&&(p=" Katalog ma Sticky Bit — możesz wchodzić, ale usuniesz tylko własne pliki."),{allowed:n,actionLabel:u,mechanic:c+p}}checkGoal(){return!this.goal||!this._hasInteracted?!1:this._bitsEqual(this.bits,this.goal.bits)}markUnlocked(){return this._unlocked?!1:(this._unlocked=!0,!0)}getState(){return{bits:this.bits,symbolic:this.getSymbolic(),octal:this.getOctal(),lsEntry:this.getLsEntry(),fileType:this.fileType,fileName:this.fileName,ownerName:this.ownerName,groupName:this.groupName,showSpecial:this.showSpecial,identities:this.identities,activeIdentity:this._activeIdentity,activeAction:this._activeAction,goal:this.goal,goalMet:this.goal?this._bitsEqual(this.bits,this.goal.bits):!1,unlocked:this._unlocked,testResult:this.testAccess()}}subscribe(t){this._subscribers.push(t)}_notify(){const t=this.getState();this._subscribers.forEach(e=>e(t))}}class v{static async fromUrl(t){const e=await fetch(t);if(!e.ok)throw new Error(`[PermissionLabScenarioParser] Nie można załadować scenariusza: ${t} (${e.status})`);const i=await e.text();return this.parse(i)}static parse(t){const i=new DOMParser().parseFromString(t,"text/html"),s=i.querySelector("data-permission-scenario");if(!s)throw new Error("[PermissionLabScenarioParser] Brak elementu <data-permission-scenario>.");const a=s.getAttribute("file-type")??"file",l=s.getAttribute("file-name")??"plik.txt",r=s.getAttribute("owner-name")??"Jan",o=s.getAttribute("group-name")??"pracownicy",n=s.getAttribute("title")??"Lab uprawnień",b=s.getAttribute("show-special")==="true",u=Array.from(i.querySelectorAll("identity")),c=u.length>0?u.map(d=>({id:d.getAttribute("id"),label:d.getAttribute("label")??d.getAttribute("id")})):[{id:"owner",label:`${r} (właściciel)`},{id:"group",label:`użytkownik z grupy ${o}`},{id:"other",label:"inny użytkownik"}],p=i.querySelector("initial"),y=this._parseBits(p,"initial"),g=i.querySelector("goal");let w=null;if(g){const d=i.querySelector("goal expect")??i.querySelector("expect"),m=this._parseBits(d,"expect");w={label:g.getAttribute("label")??"Osiągnij wymagany stan uprawnień.",bits:m}}return{fileType:a,fileName:l,ownerName:r,groupName:o,title:n,showSpecial:b,identities:c,initial:y,goal:w}}static _parseBits(t,e=""){if(!t)return console.warn(`[PermissionLabScenarioParser] Element <${e}> nie został znaleziony w scenariuszu.`),{suid:!1,sgid:!1,sticky:!1,owner:{r:!1,w:!1,x:!1},group:{r:!1,w:!1,x:!1},other:{r:!1,w:!1,x:!1}};const i=s=>t.getAttribute(s)==="true";return{suid:i("suid"),sgid:i("sgid"),sticky:i("sticky"),owner:{r:i("owner-r"),w:i("owner-w"),x:i("owner-x")},group:{r:i("group-r"),w:i("group-w"),x:i("group-x")},other:{r:i("other-r"),w:i("other-w"),x:i("other-x")}}}}class L extends f{async mount(){this.escapeParagraphWrapper();const t=this.container.getAttribute("src")||this.options.src;if(!t){this.container.textContent="[permission-lab] Brak atrybutu src.";return}const e=await v.fromUrl(t);this._title=e.title,this._fileType=e.fileType,this.model=new k(e),this.model.subscribe(i=>this._update(i)),this._completionEmitted=!1,this._render()}_xLabel(){return this._fileType==="dir"?"wejście cd":"uruchom"}_render(){const t=Math.random().toString(36).slice(2,8);this._uid=t;const e=document.createElement("section");e.className="plab-widget",e.setAttribute("aria-label",this._title),e.innerHTML=`
            <header class="plab-header">
                <p class="plab-kicker">Lab uprawnień</p>
                <h3 class="plab-title" id="plab-title-${t}">${this._title}</h3>
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

                        ${this._rowHTML("owner","Właściciel",t)}
                        ${this._rowHTML("group","Grupa",t)}
                        ${this._rowHTML("other","Pozostali",t)}
                    </div>

                    <!-- Bity specjalne (SUID/SGID/Sticky) — ukryte domyślnie -->
                    <div class="plab-special-row js-special-row" role="group" aria-label="Bity specjalne" hidden>
                        <p class="plab-special-intro">Bity specjalne:</p>
                        <div class="plab-special-buttons">
                            ${this._specialBitHTML("suid","SUID","plik jako właściciel",t)}
                            ${this._specialBitHTML("sgid","SGID","dziedziczenie grupy",t)}
                            ${this._specialBitHTML("sticky","Sticky","blokada usuwania pliku",t)}
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
                            ${this._actionBtnHTML("read","Odczytaj",t)}
                            ${this._actionBtnHTML("write","Zapisz",t)}
                            ${this._actionBtnHTML("execute",this._xLabel(),t)}
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
        `,this.container.replaceChildren(e),this.widgetElement=e,this._bindEvents(e),this._update(this.model.getState()),this.enableApplicationMode(e,{labelledBy:`plab-title-${t}`})}_rowHTML(t,e,i){return`
            <div class="plab-grid-row" data-who="${t}" role="group" aria-label="${e}">
                <span class="plab-cell plab-cell--label">${e}</span>
                ${["r","w","x"].map(a=>`
                    <span class="plab-cell plab-cell--bit">
                        <button
                            class="plab-bit"
                            data-who="${t}"
                            data-bit="${a}"
                            id="plab-${t}-${a}-${i}"
                            role="switch"
                            aria-checked="false"
                            aria-label="${e}: ${a==="r"?"odczyt":a==="w"?"zapis":this._xLabel()}"
                        >–</button>
                    </span>
                `).join("")}
            </div>
        `}_specialBitHTML(t,e,i,s){return`
            <button
                class="plab-special-bit"
                data-bit="${t}"
                id="plab-special-${t}-${s}"
                role="switch"
                aria-checked="false"
                aria-label="Bit specjalny: ${e} — ${i}"
                title="${i}"
            >
                <span class="plab-special-name">${e}</span>
                <small class="plab-special-desc">${i}</small>
            </button>
        `}_actionBtnHTML(t,e,i){return`
            <button
                class="plab-action-btn"
                data-action="${t}"
                id="plab-action-${t}-${i}"
                aria-pressed="false"
            >${e}</button>
        `}_bindEvents(t){t.querySelectorAll(".plab-bit").forEach(e=>{e.addEventListener("click",()=>{this.model.toggleBit(e.dataset.who,e.dataset.bit)})}),t.querySelectorAll(".plab-special-bit").forEach(e=>{e.addEventListener("click",()=>{this.model.toggleSpecial(e.dataset.bit)})}),t.querySelector(".js-identity-buttons").addEventListener("click",e=>{const i=e.target.closest("[data-identity]");i&&this.model.setIdentity(i.dataset.identity)}),t.querySelectorAll(".plab-action-btn").forEach(e=>{e.addEventListener("click",()=>{this.model.setAction(e.dataset.action)})})}_update(t){const e=this.widgetElement;if(!e)return;e.querySelector(".js-file-glyph").textContent=this._fileGlyph(t.fileType),e.querySelector(".js-file-name").textContent=t.fileName,e.querySelector(".js-symbolic").textContent=t.symbolic,e.querySelector(".js-octal").textContent=`chmod ${t.octal}`;const i=t.bits;["owner","group","other"].forEach(a=>{["r","w","x"].forEach(l=>{const r=e.querySelector(`.plab-bit[data-who="${a}"][data-bit="${l}"]`);if(!r)return;const o=i[a][l];r.setAttribute("aria-checked",String(o)),r.classList.toggle("is-on",o),r.classList.toggle("is-off",!o),r.textContent=o?l:"–"})});const s=e.querySelector(".js-special-row");s.hidden=!t.showSpecial,t.showSpecial&&["suid","sgid","sticky"].forEach(a=>{const l=e.querySelector(`.plab-special-bit[data-bit="${a}"]`);if(!l)return;const r=i[a];l.setAttribute("aria-checked",String(r)),l.classList.toggle("is-on",r)}),this._updateIdentityButtons(e,t),e.querySelectorAll(".plab-action-btn").forEach(a=>{const l=a.dataset.action===t.activeAction;a.setAttribute("aria-pressed",String(l)),a.classList.toggle("is-active",l)}),this._updateResult(e,t),this._updateGoal(e,t),e.classList.toggle("is-complete",t.goalMet),t.goalMet&&this.model.markUnlocked()&&this._emitCompletion()}_updateIdentityButtons(t,e){const i=t.querySelector(".js-identity-buttons");i.children.length!==e.identities.length?i.innerHTML=e.identities.map(s=>`
                <button
                    class="plab-identity-btn"
                    data-identity="${s.id}"
                    aria-pressed="${String(s.id===e.activeIdentity)}"
                >${s.label}</button>
            `).join(""):i.querySelectorAll(".plab-identity-btn").forEach(s=>{const a=s.dataset.identity===e.activeIdentity;s.setAttribute("aria-pressed",String(a)),s.classList.toggle("is-active",a)})}_updateResult(t,e){const i=t.querySelector(".js-result"),s=i.querySelector(".plab-result-hint"),a=i.querySelector(".js-result-answer"),l=i.querySelector(".js-result-icon"),r=i.querySelector(".js-result-verdict"),o=i.querySelector(".js-result-mechanic");s&&(s.hidden=!0),a.hidden=!1,o.hidden=!1;const n=e.testResult;l.textContent=n.allowed?"✅":"❌",r.textContent=n.allowed?`Dozwolono — ${n.actionLabel}`:`Odmowa — brak prawa do ${n.actionLabel}`,o.textContent=n.mechanic.replace(/\*\*/g,"").replace(/`/g,""),i.className=`plab-result js-result ${n.allowed?"is-allowed":"is-denied"}`}_updateGoal(t,e){const i=t.querySelector(".js-goal"),s=t.querySelector(".js-goal-label"),a=t.querySelector(".js-goal-status"),l=t.querySelector(".js-goal-badge");if(!e.goal){i.hidden=!0;return}i.hidden=!1,s.textContent=e.goal.label,e.goalMet?(i.classList.add("is-met"),l.textContent="✓ Sukces",a.textContent="Cel osiągnięty! Kliknij dalej w bramce poniżej."):(i.classList.remove("is-met"),l.textContent="Zadanie",a.textContent="Dostosuj uprawnienia w siatce, aby spełnić warunki.")}_fileGlyph(t){return t==="dir"?"📁":t==="executable"?"⚙️":"📄"}_emitCompletion(){this._completionEmitted||(this._completionEmitted=!0,this.container.dispatchEvent(new CustomEvent("complete",{bubbles:!0,detail:{widget:"data-permission-lab"}})),this.container.dispatchEvent(new CustomEvent("unlocked",{bubbles:!0})))}}export{L as default};
