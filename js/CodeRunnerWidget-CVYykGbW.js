const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["css/monaco.css"])))=>i.map(i=>d[i]);
import{_ as H}from"./monaco-CMNtKCUQ.js";import"./MonacoSetup-DjItL_5q.js";import{s as I}from"./MonacoPhpSupport-B3kW99Ie.js";import{B as N}from"./BaseWidget-DjUe-9aH.js";import{U as a}from"./UIFacade-DLGXQ0X5.js";import{a as W}from"./ScrollManager-BCam3L0h.js";import"./WidgetAccessibility-B00NlGOv.js";import"./CourseHealthManager-9Ok2uGSU.js";import"./katex-XbL3y5x-.js";import"./markdown-BDRwxJm4.js";class Z{constructor(e="",t="javascript",r=[],n={}){this.code=e,this.language=t.toLowerCase(),this.requirements=r.map(o=>({...o,passed:!1,actual:null})),this.consoleLogs=[],this.testResults=[],this.queryResultRows=[],this.htmlOutput="",this.executionError=null,this.options=n}updateCode(e){this.code=e}async evaluate(e={}){this.consoleLogs=[],this.testResults=[],this.queryResultRows=[],this.htmlOutput="",this.executionError=null;const t=this.code.trim();this.language==="php"&&this.simulatePhpExecution(t);for(const r of this.requirements)try{r.passed=await this._checkRequirement(r,t,e)}catch(n){console.error(`[CodeRunnerModel] Błąd testu "${r.id}":`,n),r.passed=!1,r.actual=n.message}return this.requirements}simulatePhpExecution(e){if(this.htmlOutput="",!(!e||!e.trim()))try{let t="";const r=(...c)=>{t+=c.join("")},n={imie:"Anna Nowak",nazwa:"Produkt testowy",cena:"49.99",...this.options.post},o={id:"1",...this.options.get},i={licznik_wizyt:"2",odwiedziny:"tak",...this.options.cookies},d={zdjecie:{name:"fotografia.jpg",type:"image/jpeg",size:1048576,tmp_name:"/tmp/php8f92a",error:0},fotografia:{name:"portret.png",type:"image/png",size:524288,tmp_name:"/tmp/phpa411b",error:0},...this.options.files},m=0,b="extension",s=[[1,"Wędka spinningowa teleskopowa",189.5],[2,"Kołowrotek karpiowy z wolnym biegiem",249],[3,"Żyłka nylonowa 0.25mm 150m",28.9],[4,"Podbierak składany duży",75],[5,"Zestaw spławików rzecznych",34.5]],p=[[1,"Włochy - Rzym i Watykan"],[2,"Hiszpania - Costa Brava"],[3,"Grecja - Kreta i Santorini"],[4,"Chorwacja - Dalmacja"],[5,"Islandia - Złoty Krąg"]],h={status:"connected"},u=()=>({status:"connected"}),x=()=>!0,w=(c,v)=>String(v||"").replace(/'/g,"\\'"),f=(c,v)=>{const z=String(v||"").toLowerCase();let q=s;return z.includes("wycieczki")&&(q=p),{rows:q.map(C=>[...C]),assocRows:q.map(C=>({id:C[0],nazwa:C[1],cena:C[2],cel:C[1]})),pointer:0}},T=c=>!c||!c.rows||c.pointer>=c.rows.length?null:c.rows[c.pointer++],S=c=>!c||!c.assocRows||c.pointer>=c.assocRows.length?null:c.assocRows[c.pointer++],E=(c,v=0,z=".",q=",")=>{const C=isFinite(+c)?+c:0,M=isFinite(+v)?Math.abs(v):0,_=(M?((K,A)=>{const D=Math.pow(10,A);return""+(Math.round(K*D)/D).toFixed(A)})(C,M):""+Math.round(C)).split(".");return _[0].length>3&&(_[0]=_[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,q)),(_[1]||"").length<M&&(_[1]=_[1]||"",_[1]+=new Array(M-_[1].length+1).join("0")),_.join(z)},P=(c,v)=>(i[c]=String(v),!0),B=()=>Math.floor(Date.now()/1e3),R=c=>String(c||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),j=c=>String(c||"").split("/").pop().split("\\").pop(),y=c=>{const v=String(c||"").split(".");return v.length>1?v.pop():""},k=c=>String(c||"").toLowerCase(),L=c=>String(c||"").trim(),g=()=>!0;let l=e.replace(/<\?php|<\?|\?>/g,"");l=l.replace(/\(int\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"parseInt($1, 10)"),l=l.replace(/\(float\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"parseFloat($1)"),l=l.replace(/\(string\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"String($1)"),l=l.replace(/!empty\s*\(([^)]+)\)/g,"Boolean($1)"),l=l.replace(/empty\s*\(([^)]+)\)/g,"(!$1)"),l=l.replace(/isset\s*\(([^)]+)\)/g,"($1 !== undefined && $1 !== null)"),l=l.replace(/([$'"`\w)\]])\s*\.\s*([$'"`\w(\[])/g,"$1 + $2"),l=l.replace(/\becho\s+([^;]+);/g,(c,v)=>`__echo(${v});`),l=l.replace(/\bprint\s+([^;]+);/g,(c,v)=>`__echo(${v});`);const $=l.match(/\$[a-zA-Z0-9_]+/g)||[],V=Array.from(new Set($)).filter(c=>!["$_POST","$_GET","$_COOKIE","$_FILES","$conn"].includes(c)).map(c=>`let ${c} = null;`).join(`
`);new Function("__echo","$_POST","$_GET","$_COOKIE","$_FILES","$conn","UPLOAD_ERR_OK","PATHINFO_EXTENSION","mysqli_connect","mysqli_close","mysqli_query","mysqli_fetch_row","mysqli_fetch_assoc","mysqli_real_escape_string","number_format","setcookie","time","htmlspecialchars","basename","pathinfo","strtolower","trim","move_uploaded_file",`"use strict";
${V}
${l}`)(r,n,o,i,d,h,m,b,u,x,f,T,S,w,E,P,B,R,j,y,k,L,g),l=l.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g,(c,v)=>{if(!v.includes("$"))return c;let z=v.replace(/\{(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)\}/g,"${$1}");return z=z.replace(/(\$[a-zA-Z0-9_]+\[[^\]]+\])/g,"${$1}"),z=z.replace(/(\$[a-zA-Z0-9_]+)/g,"${$1}"),`\`${z}\``}),this.htmlOutput=t}catch(t){console.warn("[CodeRunnerModel] Błąd symulacji PHP:",t.message),this.htmlOutput=`<div class="php-error-box"><div class="error-head">⚠️ Błąd parsera PHP:</div><div class="error-body"><code>${t.message}</code></div></div>`}}isAllPassed(){return this.requirements.length>0&&this.requirements.every(e=>e.passed)}_stripComments(e){if(!e)return"";let t=e.replace(/\/\*[\s\S]*?\*\//g,"");return t=t.replace(/(?:^|[^\\])(?:\/\/[^\r\n]*|#[^\r\n]*|--[^\r\n]*)/g,""),t.trim()}async _checkRequirement(e,t,r){const n=this._stripComments(t);switch(e.type){case"test-case":return await this._runTestCase(e,t);case"sql-execute":return await this._runSqlExecute(e,t);case"contains":return this.language==="sql"?n.toLowerCase().includes(e.pattern.toLowerCase()):n.includes(e.pattern);case"not-contains":return this.language==="sql"?!n.toLowerCase().includes(e.pattern.toLowerCase()):!n.includes(e.pattern);case"regex":{let o=e.flags||"m";return this.language==="sql"&&!o.includes("i")&&(o+="i"),new RegExp(e.pattern,o).test(n)}case"console-output":return this.consoleLogs.some(o=>String(o).includes(e.pattern));default:return!1}}async _runTestCase(e,t){if(!e.functionName||!e.input)return!1;try{const r=`
                ${t};
                if (typeof ${e.functionName} !== 'function') {
                    throw new Error("Funkcja '${e.functionName}' nie została zdefiniowana!");
                }
                return Promise.resolve(${e.functionName}.apply(null, ${JSON.stringify(e.input)}));
            `,o=await new Function(r)();e.actual=o;const i=this._deepEqual(o,e.expected);return this.testResults.push({name:e.text,input:e.input,expected:e.expected,actual:o,passed:i}),i}catch(r){return e.actual=`Błąd wykonania: ${r.message}`,this.testResults.push({name:e.text,input:e.input,expected:e.expected,actual:r.message,passed:!1}),!1}}async _getSqlJs(){if(this._SQL)return this._SQL;if(typeof globalThis.TextDecoder>"u"||typeof globalThis.TextEncoder>"u")try{const e=await H(()=>import("./__vite-browser-external-D7Ct-6yo.js").then(t=>t._),[]);typeof globalThis.TextDecoder>"u"&&(globalThis.TextDecoder=e.TextDecoder),typeof globalThis.TextEncoder>"u"&&(globalThis.TextEncoder=e.TextEncoder)}catch{}if(typeof window<"u"&&window.initSqlJs)return this._SQL=await window.initSqlJs(),this._SQL;try{const e=await H(()=>import("./sql-asm-BYFb6QVd.js").then(r=>r.s),[]),t=e.default||e;return this._SQL=await t(),this._SQL}catch(e){return console.warn("[CodeRunnerModel] sql.js init fallback:",e.message),null}}async _runSqlExecute(e,t){const r=await this._getSqlJs();if(r){let o=null;try{o=new r.Database,e.schema&&o.run(e.schema);const i=o.exec(t);if(e.assertQuery){const s=o.exec(e.assertQuery);if(s&&s.length>0&&s[0].values&&s[0].values.length>0){const p=s[0].values[0][0];if(e.assertExpected!==void 0&&String(p)!==String(e.assertExpected))return e.actual=e.assertMessage||`Nieoczekiwany stan bazy danych (wartość: ${p}, oczekiwano: ${e.assertExpected})`,!1}else if(e.assertExpected!==void 0)return e.actual=e.assertMessage||"Brak danych weryfikacyjnych w bazie danych",!1}if(e.expectedIndex){const s=o.exec(`SELECT name FROM sqlite_master WHERE type='index' AND name='${e.expectedIndex}';`);if(!s||s.length===0||!s[0].values||s[0].values.length===0)return e.actual=`Indeks '${e.expectedIndex}' nie został utworzony w bazie danych`,!1}if(!i||i.length===0)return this.queryResultRows=[],e.actual="Zapytanie wykonane (0 wierszy wyniku).",e.expectedCount===0;const d=i[i.length-1],m=d.columns||[],b=d.values||[];if(this.queryResultRows=b.map(s=>{const p={};return m.forEach((h,u)=>{p[h]=s[u]}),p}),typeof e.expectedCount=="number"&&this.queryResultRows.length!==e.expectedCount)return e.actual=`Zwrócono ${this.queryResultRows.length} wierszy (oczekiwano ${e.expectedCount})`,!1;if(Array.isArray(e.expectedColumns)){const s=m.map(h=>h.toLowerCase()),p=e.expectedColumns.filter(h=>!s.includes(h.toLowerCase()));if(p.length>0)return e.actual=`Brakujące kolumny w wyniku: ${p.join(", ")}`,!1}if(Array.isArray(e.expectedRows)){if(e.exactOrder)for(let s=0;s<e.expectedRows.length;s++){const p=e.expectedRows[s],h=this.queryResultRows[s];if(!h)return e.actual=`Brak wiersza na pozycji ${s+1}`,!1;if(!Object.entries(p).every(([x,w])=>{const f=Object.keys(h).find(T=>T.toLowerCase()===x.toLowerCase());return f?String(h[f]).trim()===String(w).trim():!1}))return e.actual=`Wiersz ${s+1} nie odpowiada oczekiwanej kolejności lub zawartości`,!1}else for(const s of e.expectedRows)if(!this.queryResultRows.some(h=>Object.entries(s).every(([u,x])=>{const w=Object.keys(h).find(f=>f.toLowerCase()===u.toLowerCase());return w?String(h[w]).trim()===String(x).trim():!1})))return e.actual=`Wynik nie zawiera oczekiwanego rekordu: ${JSON.stringify(s)}`,!1}return e.actual=`Zwrócono ${this.queryResultRows.length} wierszy (${m.join(", ")})`,!0}catch(i){return this.queryResultRows=[],this.executionError=i.message,e.actual=`Błąd SQL: ${i.message}`,!1}finally{if(o)try{o.close()}catch{}}}return t.toUpperCase().includes("SELECT")?(this.queryResultRows=[{status:"Zapytanie poprawne syntaktycznie"}],e.actual="Zapytanie zweryfikowane syntaktycznie",!0):(e.actual="Brak klauzuli SELECT",!1)}async inspectSchema(e){if(!e)return[];const t=await this._getSqlJs();if(!t)return[];try{const r=new t.Database;r.run(e);const n=r.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");if(!n||n.length===0)return r.close(),[];const o=n[0].values.map(d=>d[0]),i=[];for(const d of o){const m=r.exec(`PRAGMA table_info("${d}");`),b=m&&m.length>0?m[0].values.map(u=>({cid:u[0],name:u[1],type:u[2]||"TEXT",notnull:u[3]===1,pk:u[5]===1})):[];let s=[];try{const u=r.exec(`PRAGMA foreign_key_list("${d}");`);u&&u.length>0&&(s=u[0].values.map(x=>({from:x[3],toTable:x[2],toColumn:x[4]})))}catch{}const p=r.exec(`SELECT * FROM "${d}" LIMIT 6;`),h=p&&p.length>0?p[0].values:[];i.push({table:d,columns:b,foreignKeys:s,rows:h})}return r.close(),i}catch(r){return console.warn("[CodeRunnerModel] inspectSchema error:",r),[]}}_deepEqual(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;if(Array.isArray(e)){if(e.length!==t.length)return!1;for(let o=0;o<e.length;o++)if(!this._deepEqual(e[o],t[o]))return!1;return!0}const r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(const o of r)if(!Object.prototype.hasOwnProperty.call(t,o)||!this._deepEqual(e[o],t[o]))return!1;return!0}return!1}}class F extends N{static async create(e,t={}){const r=new F(e,t);return await r.mount(),r}constructor(e,t={}){super(e,t),this.model=null,this.editor=null,this.monaco=null,this.isUnlocked=!1,this.themeListener=null,this.keyListener=null,this.resizeObserver=null,this.isFullscreen=!1,this.activeTabId=null,this.tabButtons={},this.tabPanels={},this.canvas=null,this.canvasCtx=null,this.hasCanvas=!1,this.domHtml="",this.hasDom=!1,this.domViewport=null}dispose(){super.dispose(),this.isFullscreen&&(document.body.classList.remove("code-runner-lock-scroll"),this.placeholder&&this.placeholder.parentNode&&(this.placeholder.parentNode.insertBefore(this.container,this.placeholder),this.placeholder.remove(),this.placeholder=null)),this.editor&&typeof this.editor.dispose=="function"&&(this.editor.dispose(),this.editor=null),this.themeListener&&(W.off("theme:changed",this.themeListener),this.themeListener=null),this.keyListener&&(window.removeEventListener("keydown",this.keyListener),this.keyListener=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}async mount(){const e=this.container.getAttribute("language")||"javascript",t=this.container.getAttribute("title")||`Silnik Testowy (${e.toUpperCase()})`,r=this.container.getAttribute("sandbox")||"";this.hasCanvas=r==="canvas"||this.container.hasAttribute("data-canvas");const n=this.container.querySelector('template[data-type="code"]')||this.container.querySelector('template:not([data-type="requirements"]):not([data-type="html"])'),o=this.container.querySelector('template[data-type="requirements"]'),i=this.container.querySelector('template[data-type="html"]'),d=g=>{const l=atob(g),$=Uint8Array.from(l,O=>O.charCodeAt(0));return new TextDecoder().decode($)},m=this.container.getAttribute("data-code"),b=this.container.getAttribute("data-requirements"),s=this.container.getAttribute("data-html"),p=m?d(m):n?n.textContent.trim():"";this.domHtml=s?d(s):i?i.textContent.trim():"",this.hasDom=!!this.domHtml||r==="dom"||r==="html"||this.container.hasAttribute("data-dom");let h=[];try{const g=b?d(b):o?o.textContent.trim():"";h=g?JSON.parse(g):[]}catch(g){console.error("[CodeRunnerWidget] Błąd parsowania wymagań:",g)}this.model=new Z(p,e,h),this._injectStyles();const u=a.create("div",{class:"code-runner-container"}),x=a.create("div",{class:"code-runner-header"}),w=a.create("div",{class:"code-runner-title"});w.innerHTML=`⚡ <strong>${t}</strong>`;const f=a.create("div",{class:`code-runner-lang-badge lang-${this.model.language}`});f.textContent=this.model.language.toUpperCase();const T=a.create("div",{class:"code-runner-status"});T.textContent="Status: Oczekiwanie ⏳",this.fullscreenBtn=a.create("button",{class:"code-runner-btn-fullscreen",type:"button",title:"Przełącz tryb pełnoekranowy (Esc aby wyjść)"}),this.fullscreenBtn.innerHTML="⛶ <span>Pełny ekran</span>",this.fullscreenBtn.addEventListener("click",()=>this.toggleFullscreen()),x.appendChild(w),x.appendChild(f),x.appendChild(T),x.appendChild(this.fullscreenBtn),u.appendChild(x);const S=a.create("div",{class:"code-runner-body"}),E=a.create("div",{class:"code-runner-left"}),P=a.create("div",{class:"column-title"});P.textContent="Edytor Kodu Source",E.appendChild(P);const B=a.create("div",{class:"code-runner-editor"});E.appendChild(B);const R=a.create("div",{class:"code-runner-controls"});this.runBtn=a.create("button",{class:"btn-run-code",type:"button"}),this.runBtn.textContent="▶ Uruchom Kod i Wykonaj Asercje",R.appendChild(this.runBtn),this.fsControlBtn=a.create("button",{class:"btn-runner-expand",type:"button",title:"Wyrwij do pełnego ekranu (Esc aby wyjść)"}),this.fsControlBtn.innerHTML="⛶ <span>Pełny ekran</span>",this.fsControlBtn.addEventListener("click",()=>this.toggleFullscreen()),R.appendChild(this.fsControlBtn),E.appendChild(R),S.appendChild(E);const j=a.create("div",{class:"code-runner-right"}),y=a.create("div",{class:"code-runner-tabs-bar",role:"tablist"});j.appendChild(y);const k=a.create("div",{class:"code-runner-panels-container"});j.appendChild(k),S.appendChild(j),u.appendChild(S),this.successBanner=a.create("div",{class:"code-runner-success-banner hidden"}),this.successBanner.style.display="none",this.successBanner.hidden=!0,this.successBanner.innerHTML="🏆 <strong>Sukces!</strong> Wszystkie testy wyjścia zostały zaliczone. Brama odblokowana!",u.appendChild(this.successBanner);let L=[];if(this.model.language==="sql"){const g=h.find($=>$.type==="sql-execute"&&$.schema),l=g?g.schema:this.container.getAttribute("data-schema")||"";l&&(L=await this.model.inspectSchema(l)),L&&L.length>0&&this._registerTab("db-schema",`🗄️ Baza Danych i Krotki (${L.length})`,y,k,()=>this._createSchemaExplorerView(L))}if(this._registerTab("test-output","📊 Wyniki & Kryteria",y,k,()=>this._createResultsView()),this.model.language==="javascript"&&(this.hasCanvas||this.model.code.includes("canvas"))&&this._registerTab("js-canvas","🎨 Canvas Sandbox",y,k,()=>this._createCanvasView()),this.model.language==="php"&&this._registerTab("php-preview","🌐 Render Przeglądarki (PHP)",y,k,()=>this._createPhpPreviewView()),this.hasDom){let g="🌐 Interaktywny Podgląd DOM";const l=t.toLowerCase();l.includes("kanban")||l.includes("drag")?g="🌐 Podgląd DOM (Kanban)":l.includes("kółko")||l.includes("krzyżyk")||l.includes("tury")?g="🎮 Interaktywna Plansza Gry":l.includes("naświetlan")||l.includes("filtr")||l.includes("laborator")?g="🖼️ Podgląd Na Żywo (Filtry CSS)":(l.includes("kolejk")||l.includes("list"))&&(g="📋 Interaktywna Kolejka Zgłoszeń"),this._registerTab("dom-preview",g,y,k,()=>this._createDomPreviewView(this.domHtml)),this._registerTab("dom-html-readonly","📄 Struktura HTML (Podgląd)",y,k,()=>this._createHtmlReadonlyView(this.domHtml))}this.model.language==="sql"&&L.length>0?this._switchTab("db-schema"):this.hasDom?this._switchTab("dom-preview"):this._switchTab("test-output"),this.container.replaceWith(u),this.container=u,await this._initMonaco(B),this.runBtn.addEventListener("click",async()=>await this._executeCode()),this.hasDom&&this.domViewport&&this._bindDomEvents(),this._renderChecklist(this.model.requirements),this.themeListener=g=>{const l=g==="dark"?"vs-dark":"vs-light";this.editor&&this.monaco&&this.monaco.editor.setTheme(l)},W.on("theme:changed",this.themeListener),this.keyListener=g=>{g.key==="Escape"&&this.isFullscreen&&this.toggleFullscreen()},window.addEventListener("keydown",this.keyListener)}_registerTab(e,t,r,n,o){const i=a.create("button",{class:"code-runner-tab-btn",type:"button",role:"tab","data-tab-id":e});i.textContent=t,i.addEventListener("click",()=>this._switchTab(e)),r.appendChild(i),this.tabButtons[e]=i;const d=a.create("div",{class:"code-runner-tab-panel",role:"tabpanel","data-tab-panel":e});d.hidden=!0,d.style.display="none";const m=o();d.appendChild(m),n.appendChild(d),this.tabPanels[e]=d}_switchTab(e){this.tabPanels[e]&&(this.activeTabId=e,Object.keys(this.tabButtons).forEach(t=>{const r=this.tabButtons[t],n=t===e;r.classList.toggle("active",n),r.setAttribute("aria-selected",n?"true":"false")}),Object.keys(this.tabPanels).forEach(t=>{const r=this.tabPanels[t],n=t===e;r.classList.toggle("active",n),r.hidden=!n,r.style.display=n?"flex":"none"}))}toggleFullscreen(){if(this.isFullscreen=!this.isFullscreen,this.isFullscreen){this.placeholder||(this.placeholder=document.createElement("div"),this.placeholder.className="code-runner-placeholder",this.placeholder.style.display="none",this.container.parentNode&&this.container.parentNode.insertBefore(this.placeholder,this.container)),document.body.appendChild(this.container),this.container.classList.add("code-runner-fullscreen"),document.body.classList.add("code-runner-lock-scroll");const e="🗗 <span>Zwiń</span>",t="Zwiń do widoku lekcji (Esc)";this.fullscreenBtn&&(this.fullscreenBtn.innerHTML=e,this.fullscreenBtn.title=t),this.fsControlBtn&&(this.fsControlBtn.innerHTML=e,this.fsControlBtn.title=t)}else{this.placeholder&&this.placeholder.parentNode&&(this.placeholder.parentNode.insertBefore(this.container,this.placeholder),this.placeholder.remove(),this.placeholder=null),this.container.classList.remove("code-runner-fullscreen"),document.body.classList.remove("code-runner-lock-scroll");const e="⛶ <span>Pełny ekran</span>",t="Wyrwij do pełnego ekranu (Esc)";this.fullscreenBtn&&(this.fullscreenBtn.innerHTML=e,this.fullscreenBtn.title=t),this.fsControlBtn&&(this.fsControlBtn.innerHTML=e,this.fsControlBtn.title=t)}requestAnimationFrame(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()}),setTimeout(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()},60),setTimeout(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()},200)}_createSchemaExplorerView(e){const t=a.create("div",{class:"schema-explorer-view viewport-scroll-y"}),r=a.create("div",{class:"schema-view-intro"});r.innerHTML="Poniżej znajduje się struktura tabel oraz załadowane krotki (rekordy) w bazie in-memory:",t.appendChild(r);const n=a.create("div",{class:"schema-tables-list"});return e.forEach(o=>{const i=a.create("div",{class:"schema-table-card"}),d=a.create("div",{class:"schema-card-head"});d.innerHTML=`
                <div class="schema-badge-wrap">
                    <span class="schema-badge">TABELA</span>
                    <strong class="schema-table-name">${o.table}</strong>
                </div>
                <span class="schema-row-count">${o.rows?o.rows.length:0} krotek</span>
            `,i.appendChild(d);const m=a.create("div",{class:"schema-cols-bar"});if(o.columns.forEach(b=>{const s=a.create("span",{class:`schema-col-pill ${b.pk?"is-pk":""}`});s.innerHTML=`${b.pk?"🔑 ":""}<strong>${b.name}</strong> <span class="col-type">(${b.type}${b.pk?", PK":""})</span>`,m.appendChild(s)}),i.appendChild(m),o.foreignKeys&&o.foreignKeys.length>0){const b=a.create("div",{class:"schema-relations-bar"});o.foreignKeys.forEach(s=>{const p=a.create("span",{class:"schema-rel-pill"});p.innerHTML=`🔗 <strong>Relacja:</strong> <code>${o.table}.${s.from}</code> → <code>${s.toTable}.${s.toColumn}</code>`,b.appendChild(p)}),i.appendChild(b)}if(o.rows&&o.rows.length>0){const b=a.create("div",{class:"schema-tuples-container"}),s=a.create("div",{class:"schema-tuples-title"});s.innerHTML=`📋 <strong>Krotki w tabeli <code>${o.table}</code>:</strong>`,b.appendChild(s);const p=a.create("div",{class:"schema-table-scroll viewport-scroll-y"}),h=a.create("table",{class:"schema-tuples-table"}),u="<thead><tr>"+o.columns.map(w=>`<th>${w.name} <small>(${w.type})</small></th>`).join("")+"</tr></thead>",x="<tbody>"+o.rows.map(w=>"<tr>"+w.map(f=>`<td>${f===null?"<em>NULL</em>":f}</td>`).join("")+"</tr>").join("")+"</tbody>";h.innerHTML=u+x,p.appendChild(h),b.appendChild(p),i.appendChild(b)}n.appendChild(i)}),t.appendChild(n),t}_createResultsView(){const e=a.create("div",{class:"results-view viewport-scroll-y"});this.outputWindow=a.create("div",{class:"code-runner-output-window viewport-scroll-y"}),this.outputWindow.innerHTML='<div class="console-placeholder">Wpisz kod i kliknij "▶ Uruchom Kod" aby wykonać zapytanie na żywo.</div>',e.appendChild(this.outputWindow);const t=a.create("div",{class:"code-runner-requirements"}),r=a.create("h4");return r.textContent="Kryteria Zaliczenia:",t.appendChild(r),this.reqList=a.create("ul",{class:"code-runner-req-list"}),t.appendChild(this.reqList),e.appendChild(t),e}_createCanvasView(){const e=a.create("div",{class:"canvas-sandbox-view"}),t=a.create("div",{class:"canvas-title"});t.innerHTML="🎨 <strong>Interaktywne Płótno Canvas 2D</strong>",e.appendChild(t);const r=a.create("div",{class:"canvas-box"});this.canvas=a.create("canvas",{class:"code-runner-canvas",width:"460",height:"300"}),this.canvasCtx=this.canvas.getContext("2d"),r.appendChild(this.canvas),e.appendChild(r);const n=a.create("div",{class:"canvas-toolbar"}),o=a.create("button",{class:"btn-canvas-clear",type:"button"});return o.textContent="🧹 Wyczyść Płótno",o.addEventListener("click",()=>{this.canvasCtx&&this.canvasCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}),n.appendChild(o),e.appendChild(n),e}_createPhpPreviewView(){const e=a.create("div",{class:"php-browser-preview-view viewport-scroll-y"}),t=a.create("div",{class:"php-browser-container"}),r=a.create("div",{class:"php-browser-bar"}),n=a.create("div",{class:"browser-dots"});n.appendChild(a.create("span",{class:"dot dot-red"})),n.appendChild(a.create("span",{class:"dot dot-yellow"})),n.appendChild(a.create("span",{class:"dot dot-green"})),r.appendChild(n);const o=a.create("div",{class:"browser-address-bar"});o.innerHTML='<span class="browser-protocol">http://</span>localhost:80/skrypt.php',r.appendChild(o);const i=a.create("button",{class:"browser-refresh-btn",type:"button",title:"Odśwież stronę w przeglądarce"});return i.innerHTML="🔄",i.addEventListener("click",async()=>{await this._executeCode(),this._switchTab("php-preview")}),r.appendChild(i),t.appendChild(r),this.phpPreviewViewport=a.create("div",{class:"php-browser-viewport viewport-scroll-y"}),this.phpPreviewViewport.innerHTML=`
            <div class="php-preview-placeholder">
                <div class="php-placeholder-icon">🌐</div>
                <div class="php-placeholder-title">Wirtualna Przeglądarka PHP</div>
                <div class="php-placeholder-desc">Uzupełnij kod w edytorze po lewej i kliknij <strong>▶ Uruchom Kod i Wykonaj Asercje</strong>, aby wygenerować stronę i podejrzeć efekt w przeglądarce.</div>
            </div>
        `,t.appendChild(this.phpPreviewViewport),e.appendChild(t),e}_createDomPreviewView(e){const t=a.create("div",{class:"dom-browser-preview-view viewport-scroll-y"}),r=a.create("div",{class:"dom-preview-toolbar"}),n=a.create("div",{class:"dom-preview-title"});n.innerHTML="🎯 <strong>Interaktywny Podgląd DOM</strong> — przetestuj działanie kodu przeciągając elementy myszką:",r.appendChild(n);const o=a.create("button",{class:"dom-preview-reset-btn",type:"button",title:"Przywróć stan początkowy elementów DOM"});return o.innerHTML="↺ <span>Zresetuj elementy</span>",o.addEventListener("click",()=>{this._resetDomSandbox(),this._bindDomEvents()}),r.appendChild(o),t.appendChild(r),this.domViewport=a.create("div",{class:"dom-preview-viewport native-html-preview"}),this.domViewport.innerHTML=e||"",t.appendChild(this.domViewport),t}_createHtmlReadonlyView(e){const t=a.create("div",{class:"dom-browser-preview-view viewport-scroll-y"}),r=a.create("div",{class:"dom-preview-toolbar"}),n=a.create("div",{class:"dom-preview-title"});n.innerHTML="📄 <strong>Makieta HTML (Tylko do odczytu)</strong> — zbadaj nazwy klas, identyfikatory i hierarchię znaczników:",r.appendChild(n),t.appendChild(r);const o=a.create("div",{class:"dom-html-readonly-container"}),i=a.create("pre",{class:"dom-html-readonly-pre"}),d=a.create("code",{class:"language-html"});return d.textContent=e||"<!-- Brak szablonu HTML -->",i.appendChild(d),o.appendChild(i),t.appendChild(o),t}_resetDomSandbox(){this.domViewport&&(this.domViewport.innerHTML=this.domHtml||"")}_bindDomEvents(){if(!(!this.domViewport||!this.model.code))try{const e={querySelector:r=>this.domViewport.querySelector(r),querySelectorAll:r=>this.domViewport.querySelectorAll(r),getElementById:r=>this.domViewport.querySelector(`#${r}`),addEventListener:(...r)=>document.addEventListener(...r),removeEventListener:(...r)=>document.removeEventListener(...r),createElement:(...r)=>document.createElement(...r)};new Function("document","window","container",`
                try {
                    ${this.model.code}
                } catch (e) {
                    console.warn('[DOM Sandbox Execution Error]:', e);
                }
            `)(e,window,this.domViewport)}catch(e){console.warn("[CodeRunnerWidget] Błąd wiązania zdarzeń DOM:",e)}}async _initMonaco(e){try{const t=await H(()=>import("./monaco-CMNtKCUQ.js").then(o=>o.e),__vite__mapDeps([0]));this.monaco=t,I(t);let r="javascript";this.model.language==="php"?r="php":this.model.language==="sql"&&(r="sql");const n=t.editor.createModel(this.model.code,r);this.editor=t.editor.create(e,{model:n,theme:document.documentElement.getAttribute("data-theme")==="dark"?"vs-dark":"vs-light",minimap:{enabled:!1},fontSize:13,fontFamily:'Consolas, "Courier New", monospace',automaticLayout:!0,tabSize:2,wordWrap:"on"}),this.editor.onDidChangeModelContent(()=>{this.model.code=this.editor.getValue()}),this.editor.addCommand(t.KeyMod.CtrlCmd|t.KeyCode.Enter,()=>{this._executeCode()})}catch(t){console.warn("[CodeRunnerWidget] Monaco fallback to textarea:",t);const r=a.create("textarea",{class:"code-runner-textarea"});r.value=this.model.code,e.appendChild(r),r.addEventListener("input",n=>{this.model.code=n.target.value}),this.editor={getValue:()=>r.value,layout:()=>{}}}}async _executeCode(){if(this.editor&&typeof this.editor.getValue=="function"&&(this.model.code=this.editor.getValue()),this.tabPanels["test-output"]&&this.activeTabId!=="php-preview"&&this.activeTabId!=="dom-preview"&&this._switchTab("test-output"),a.clear(this.outputWindow),this.model.requirements.length===0){this.outputWindow.innerHTML='<div class="console-error-box"><div class="error-head">⚠️ Błąd:</div><div class="error-body">Brak poprawnie wczytanych kryteriów zadania.</div></div>';return}const e=await this.model.evaluate();if(this.model.language==="php"&&this.phpPreviewViewport){const t=(this.model.htmlOutput||"").trim(),r=t.replace(/<[^>]*>/g,"").trim(),n=/<li\b/i.test(t),o=/<td\b/i.test(t),i=/<option\b/i.test(t),d=t.includes("<ul")&&!n||t.includes("<table")&&!o||t.includes("<select")&&!i;if(t&&!d&&(r.length>0||/<(img|canvas|iframe|svg)\b/i.test(t)))this.phpPreviewViewport.innerHTML=t;else if(d){const m=t.replace(/</g,"&lt;").replace(/>/g,"&gt;");this.phpPreviewViewport.innerHTML=`
                    <div class="php-preview-placeholder">
                        <div class="php-placeholder-icon">⏳</div>
                        <div class="php-placeholder-title">Wygenerowano pusty kontener HTML: <code>${m}</code></div>
                        <div class="php-placeholder-desc">
                            Twój skrypt PHP wygenerował znacznik kontenera, lecz nie zawiera on jeszcze żadnych danych wewnątrz.<br>
                            Uzupełnij kod w edytorze po lewej (np. pętlę <code>while</code> z elementami <code>&lt;li&gt;</code>) i kliknij <strong>▶ Uruchom Kod</strong>, aby zobaczyć wyrenderowaną listę.
                        </div>
                    </div>
                `}else t?this.phpPreviewViewport.innerHTML=t:this.phpPreviewViewport.innerHTML=`
                    <div class="php-preview-placeholder">
                        <div class="php-placeholder-icon">💡</div>
                        <div class="php-placeholder-title">Brak danych wyjściowych HTML</div>
                        <div class="php-placeholder-desc">Napisz kod generujący treść za pomocą <code>echo</code> i kliknij <strong>▶ Uruchom Kod</strong>.</div>
                    </div>
                `}if(this.model.language==="sql")if(this.model.executionError){const t=a.create("div",{class:"console-error-box"});t.innerHTML=`
                    <div class="error-head">⚠️ Błąd wykonania zapytania SQL:</div>
                    <div class="error-body"><code>${this.model.executionError}</code></div>
                    <div class="error-advice">🔍 Przełącz na zakładkę <strong>Baza Danych</strong>, aby sprawdzić dokładne nazwy kolumn i krotek.</div>
                `,this.outputWindow.appendChild(t)}else if(this.model.queryResultRows&&this.model.queryResultRows.length>0){const t=a.create("div",{class:"sql-table-output"});let r=`<div class="sql-title">📊 Wynik Wykonania Zapytania SQL (${this.model.queryResultRows.length} ${this.model.queryResultRows.length===1?"wiersz":"wiersze/wierszy"}):</div><div class="sql-table-wrap viewport-scroll-y"><table class="sql-table"><thead><tr>`;const n=Object.keys(this.model.queryResultRows[0]);n.forEach(o=>r+=`<th>${o}</th>`),r+="</tr></thead><tbody>",this.model.queryResultRows.forEach(o=>{r+="<tr>",n.forEach(i=>r+=`<td>${o[i]===null?"<em>NULL</em>":o[i]}</td>`),r+="</tr>"}),r+="</tbody></table></div>",t.innerHTML=r,this.outputWindow.appendChild(t)}else this.model.isAllPassed()?this.outputWindow.innerHTML='<div class="console-success">✔ Zapytanie wykonane pomyślnie.</div>':this.outputWindow.innerHTML='<div class="console-warning">⚠️ Zapytanie wykonane, lecz nie zwróciło żadnych krotek spełniających kryteria.</div>';else{if(this.model.testResults.length>0){const t=a.create("div",{class:"test-suite-results"});this.model.testResults.forEach((r,n)=>{const o=a.create("div",{class:`test-row ${r.passed?"test-passed":"test-failed"}`});o.innerHTML=`
                        <div class="test-status-icon">${r.passed?"✔":"✖"}</div>
                        <div class="test-details">
                            <div class="test-name">Test Algorytmu #${n+1}: ${r.name}</div>
                            <div class="test-values">
                                <span class="test-input">Input: <code>${JSON.stringify(r.input)}</code></span> | 
                                <span class="test-expected">Oczekiwano: <code>${JSON.stringify(r.expected)}</code></span> | 
                                <span class="test-actual">Zwrócono: <code>${JSON.stringify(r.actual)}</code></span>
                            </div>
                        </div>
                    `,t.appendChild(o)}),this.outputWindow.appendChild(t)}else this.model.isAllPassed()?this.outputWindow.innerHTML='<div class="console-success">Kod zweryfikowany pomyślnie.</div>':this.outputWindow.innerHTML='<div class="console-warning">Nie wszystkie kryteria zostały zaliczone.</div>';if(this.model.language==="php"){const t=a.create("div",{class:"php-preview-hint"});t.innerHTML="🌐 Wynik wygenerowanego HTML możesz podejrzeć w zakładce <strong>🌐 Render Przeglądarki (PHP)</strong>.",this.outputWindow.appendChild(t)}if(this.canvas&&this.canvasCtx)try{new Function("canvas","ctx",this.model.code)(this.canvas,this.canvasCtx)}catch(t){console.warn("[CodeRunnerWidget] Canvas execution error:",t)}this.hasDom&&this.domViewport&&(this._resetDomSandbox(),this._bindDomEvents())}this._renderChecklist(e),this.model.isAllPassed()&&!this.isUnlocked&&(this.isUnlocked=!0,this._handleSuccess())}_renderChecklist(e){a.clear(this.reqList),e.forEach(t=>{const r=a.create("li",{class:`req-item ${t.passed?"passed":"failed"}`}),n=a.create("span",{class:"req-icon"});n.textContent=t.passed?"✔":"✖";const o=a.create("div",{class:"req-content"}),i=a.create("span",{class:"req-text"});if(i.textContent=t.text,o.appendChild(i),!t.passed&&t.actual){const d=a.create("div",{class:"req-hint"});d.textContent=`↳ ${t.actual}`,o.appendChild(d)}r.appendChild(n),r.appendChild(o),this.reqList.appendChild(r)})}_handleSuccess(){const e=this.container.querySelector(".code-runner-status");e&&(e.textContent="Zaliczone! 🏆",e.classList.add("unlocked")),this.successBanner.classList.remove("hidden"),this.successBanner.classList.add("show"),this.successBanner.style.display="block",this.successBanner.hidden=!1;const t=new CustomEvent("unlocked",{bubbles:!0});this.container.dispatchEvent(t)}_injectStyles(){let e=document.getElementById("code-runner-styles");e||(e=a.create("style",{id:"code-runner-styles"}),document.head.appendChild(e)),e.textContent=`
            .code-runner-container,
            .code-runner-container *,
            .code-runner-fullscreen,
            .code-runner-fullscreen * {
                text-shadow: none !important;
            }
            .code-runner-container {
                background: var(--bg-layer-2);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                overflow: hidden;
                margin: 24px 0;
                box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--text-color) 12%, transparent);
                transition: all 0.2s ease;
                position: relative;
            }
            .code-runner-header {
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--bg-layer-1);
                padding: 12px 18px;
                border-bottom: 1px solid var(--border-color);
            }
            .code-runner-title {
                font-size: 14px;
                font-weight: 700;
                color: var(--text-color);
            }
            .code-runner-lang-badge {
                font-size: 11px;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 4px;
                text-transform: uppercase;
                background: var(--accent-color);
                color: #ffffff;
            }
            .code-runner-lang-badge.lang-php { background: var(--accent-purple, #6c5ce7); color: #ffffff; }
            .code-runner-lang-badge.lang-laravel { background: var(--button-bg-quaternary, #991825); color: #ffffff; }
            .code-runner-lang-badge.lang-sql { background: var(--progress-warning-color, #ffab00); color: #000000; }
            :root[data-theme="light"] .code-runner-lang-badge.lang-sql { background: #d97706; color: #ffffff; }
            .code-runner-lang-badge.lang-react { background: var(--accent-color); color: #ffffff; }
            .code-runner-status {
                margin-left: auto;
                font-size: 12px;
                font-weight: 600;
                background: var(--bg-layer-3);
                border: 1px solid var(--border-color);
                padding: 4px 10px;
                border-radius: 4px;
                color: var(--text-muted);
            }
            .code-runner-status.unlocked {
                background: var(--quiz-correct-color, #16a34a);
                color: #ffffff;
                border-color: transparent;
            }

            /* Przycisk Pełnego Ekranu */
            .code-runner-btn-fullscreen {
                background: var(--button-bg-secondary);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                padding: 5px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
            }
            .code-runner-btn-fullscreen:hover { background: var(--button-bg-hover-secondary); }
            .code-runner-btn-fullscreen:active { transform: scale(0.97); }

            /* Tryb Pełnoekranowy (Wyrwany do <body> z najwyższym z-index) */
            .code-runner-fullscreen {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 2147483647 !important;
                margin: 0 !important;
                border-radius: 0 !important;
                border: none !important;
                display: flex !important;
                flex-direction: column !important;
                box-shadow: none !important;
                background: var(--bg-layer-2) !important;
            }
            .code-runner-fullscreen .code-runner-body {
                flex-grow: 1 !important;
                height: calc(100vh - 56px) !important;
                min-height: 0 !important;
                display: grid !important;
                grid-template-columns: 1.1fr 1fr !important;
            }
            .code-runner-fullscreen .code-runner-left,
            .code-runner-fullscreen .code-runner-right {
                height: 100% !important;
                min-height: 0 !important;
                overflow: hidden !important;
            }
            .code-runner-fullscreen .code-runner-editor {
                flex-grow: 1 !important;
                height: calc(100% - 60px) !important;
                min-height: 0 !important;
            }
            .code-runner-fullscreen .code-runner-panels-container {
                flex-grow: 1 !important;
                height: calc(100% - 50px) !important;
                min-height: 0 !important;
            }
            .code-runner-fullscreen .schema-tables-list { max-height: calc(100vh - 140px) !important; }
            .code-runner-fullscreen .schema-table-scroll { max-height: 380px !important; }
            .code-runner-fullscreen .code-runner-output-window { max-height: calc(100vh - 320px) !important; }
            .code-runner-lock-scroll { overflow: hidden !important; }

            /* Body Grid & Left Column */
            .code-runner-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1px;
                background: var(--border-color);
                min-height: 480px;
            }
            @media (max-width: 900px) { .code-runner-body { grid-template-columns: 1fr; } }
            .code-runner-left, .code-runner-right {
                background: var(--bg-layer-2);
                color: var(--text-color);
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                overflow: hidden;
            }
            .column-title {
                font-size: 11.5px;
                font-weight: 700;
                text-transform: uppercase;
                color: var(--text-muted);
                letter-spacing: 0.5px;
            }
            .code-runner-editor {
                border: 1px solid var(--border-color);
                border-radius: 6px;
                overflow: hidden;
                flex-grow: 1;
                min-height: 320px;
                background: var(--input-bg-color);
            }
            .code-runner-controls { display: flex; gap: 8px; align-items: center; }
            .btn-run-code {
                background: var(--button-bg-primary);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                padding: 10px 18px;
                font-weight: 700;
                font-size: 13px;
                border-radius: 6px;
                cursor: pointer;
                transition: background 0.2s ease, transform 0.1s ease;
                flex-grow: 1;
                box-shadow: 0 4px 12px color-mix(in srgb, var(--button-bg-primary) 30%, transparent);
            }
            :root[data-theme="dark"] .btn-run-code { color: #ffffff; }
            :root[data-theme="light"] .btn-run-code { color: #061d38; font-weight: 700; }
            .btn-run-code:hover { background: var(--button-bg-hover-primary); }
            .btn-run-code:active { transform: scale(0.99); }
            .btn-runner-expand {
                background: var(--button-bg-secondary);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                padding: 10px 14px;
                font-weight: 600;
                font-size: 12.5px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
                transition: background 0.15s ease;
            }
            .btn-runner-expand:hover { background: var(--button-bg-hover-secondary); }
            .btn-runner-expand:active { transform: scale(0.97); }

            /* Pasek Zakładek (Tabs Bar) */
            .code-runner-tabs-bar {
                display: flex;
                gap: 8px;
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
                margin-bottom: 8px;
                flex-shrink: 0;
            }
            .code-runner-tab-btn {
                background: var(--bg-layer-1);
                border: 1px solid var(--border-color);
                color: var(--text-muted);
                padding: 6px 14px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.15s ease;
                white-space: nowrap;
            }
            .code-runner-tab-btn:hover {
                color: var(--text-color);
                background: var(--bg-layer-3);
            }
            .code-runner-tab-btn.active {
                background: var(--button-bg-primary);
                border-color: var(--accent-color);
                box-shadow: 0 2px 8px color-mix(in srgb, var(--accent-color) 25%, transparent);
            }
            :root[data-theme="dark"] .code-runner-tab-btn.active { color: #ffffff; }
            :root[data-theme="light"] .code-runner-tab-btn.active { color: #061d38; font-weight: 700; }

            /* Kontener i Panele Zakładek */
            .code-runner-panels-container { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; height: 100%; min-height: 0; }
            .code-runner-tab-panel { display: none !important; flex-grow: 1; flex-direction: column; overflow: hidden; height: 100%; min-height: 0; }
            .code-runner-tab-panel.active { display: flex !important; }
            .code-runner-tab-panel[hidden] { display: none !important; }

            /* Uniwersalny Viewport Scroll Y */
            .viewport-scroll-y {
                overflow-y: auto !important;
                overflow-x: hidden;
                scrollbar-width: thin;
                scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
            }
            .viewport-scroll-y::-webkit-scrollbar { width: 6px; height: 6px; }
            .viewport-scroll-y::-webkit-scrollbar-track { background: var(--scrollbar-track); }
            .viewport-scroll-y::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 3px; }
            .viewport-scroll-y::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }

            /* Eksplorator Bazy Danych i Krotek */
            .schema-explorer-view { display: flex; flex-direction: column; gap: 14px; height: 100%; padding-right: 6px; padding-bottom: 24px; }
            .schema-view-intro { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
            .schema-tables-list { display: flex; flex-direction: column; gap: 14px; padding-right: 4px; }
            .schema-table-card {
                background: var(--bg-layer-1);
                border: 1px solid var(--border-color);
                border-left: 4px solid var(--progress-warning-color, #f59e0b);
                border-radius: 8px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .schema-card-head { display: flex; align-items: center; justify-content: space-between; }
            .schema-badge-wrap { display: flex; align-items: center; gap: 8px; }
            .schema-badge {
                font-size: 10px;
                font-weight: 700;
                background: var(--progress-warning-color, #f59e0b);
                color: #000000;
                padding: 2px 6px;
                border-radius: 4px;
            }
            .schema-table-name {
                font-family: Consolas, monospace;
                font-size: 14px;
                font-weight: 700;
                color: var(--text-color);
            }
            .schema-row-count {
                font-size: 11px;
                color: var(--text-muted);
                background: var(--bg-layer-3);
                border: 1px solid var(--border-color);
                padding: 2px 8px;
                border-radius: 12px;
            }
            .schema-cols-bar { display: flex; flex-wrap: wrap; gap: 6px; }
            .schema-col-pill {
                font-size: 11.5px;
                background: var(--bg-layer-2);
                border: 1px solid var(--border-color);
                padding: 3px 8px;
                border-radius: 4px;
                color: var(--text-color);
            }
            .schema-col-pill.is-pk {
                border-color: var(--progress-warning-color, #f59e0b);
                color: var(--progress-warning-color, #f59e0b);
                background: color-mix(in srgb, var(--progress-warning-color, #f59e0b) 15%, transparent);
                font-weight: 600;
            }
            .schema-col-pill .col-type { color: var(--text-muted); font-size: 10.5px; }
            .schema-relations-bar { display: flex; flex-wrap: wrap; gap: 6px; }
            .schema-rel-pill {
                font-size: 11px;
                background: color-mix(in srgb, var(--accent-color) 15%, transparent);
                border: 1px solid var(--accent-color);
                color: var(--accent-color);
                padding: 2px 8px;
                border-radius: 4px;
            }
            .schema-tuples-container { margin-top: 4px; }
            .schema-tuples-title { font-size: 11.5px; color: var(--text-muted); margin-bottom: 6px; }
            .schema-table-scroll { max-height: 220px; border: 1px solid var(--table-border-color); border-radius: 6px; overflow-x: auto; }
            .schema-tuples-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                font-family: Consolas, monospace;
                background: var(--table-row-bg-color);
                color: var(--text-color);
            }
            .schema-tuples-table th, .schema-tuples-table td {
                padding: 6px 10px;
                border: 1px solid var(--table-border-color);
                color: var(--text-color);
                text-align: left;
            }
            .schema-tuples-table th {
                background: var(--table-header-bg-color);
                color: var(--text-color);
                font-weight: 700;
                position: sticky;
                top: 0;
                z-index: 2;
            }
            .schema-tuples-table tr:nth-child(even) { background: var(--table-all-row-hover-bg-color); }

            /* Konsola Wyników i Asercji */
            .results-view { display: flex; flex-direction: column; gap: 16px; height: 100%; padding-right: 6px; padding-bottom: 30px; }
            .code-runner-output-window {
                background: var(--task-code-bg-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px 18px;
                min-height: 140px;
                max-height: 280px;
                font-size: 12.5px;
                color: var(--task-code-text-color);
                flex-shrink: 0;
            }
            .console-placeholder { color: var(--text-muted); font-style: italic; }
            .console-success {
                color: var(--progress-success-color);
                font-weight: 600;
                padding: 10px 14px;
                background: var(--hint-success-background-color);
                border-left: 4px solid var(--quiz-correct-color);
                border-radius: 4px;
            }
            .console-warning {
                color: var(--progress-warning-color);
                padding: 10px 14px;
                background: var(--hint-warning-background-color);
                border-left: 4px solid var(--progress-warning-color);
                border-radius: 4px;
            }
            .console-error-box {
                background: var(--hint-danger-background-color);
                border: 1px solid var(--hint-danger-border-color);
                border-radius: 8px;
                padding: 12px 16px;
                color: var(--text-color);
            }
            .console-error-box .error-head { font-weight: 700; color: var(--quiz-incorrect-color); margin-bottom: 6px; font-size: 13px; }
            .console-error-box .error-body code {
                color: var(--task-code-text-color);
                background: var(--task-code-bg-color);
                border: 1px solid var(--border-color);
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                display: inline-block;
                word-break: break-all;
            }
            .console-error-box .error-advice { color: var(--text-muted); font-size: 11.5px; margin-top: 8px; }

            /* SQL Table Output */
            .sql-table-output { font-size: 12px; }
            .sql-title { font-weight: bold; margin-bottom: 8px; color: var(--accent-color); font-size: 13px; }
            .sql-table-wrap { max-height: 200px; border: 1px solid var(--table-border-color); border-radius: 6px; overflow-x: auto; }
            .sql-table { width: 100%; border-collapse: collapse; background: var(--table-row-bg-color); color: var(--text-color); font-size: 11.5px; }
            .sql-table th, .sql-table td { padding: 6px 12px; border: 1px solid var(--table-border-color); color: var(--text-color); text-align: left; }
            .sql-table th { background: var(--table-header-bg-color); color: var(--text-color); font-size: 11px; font-weight: 700; position: sticky; top: 0; }

            /* Kryteria Zaliczenia */
            .code-runner-requirements {
                background: var(--bg-layer-1);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px 18px;
                flex-shrink: 0;
                margin-top: 4px;
            }
            .code-runner-requirements h4 {
                margin: 0 0 12px 0;
                font-size: 12px;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 700;
            }
            .code-runner-req-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
            .req-item { display: flex; gap: 10px; font-size: 12.5px; color: var(--text-color); align-items: flex-start; }
            .req-icon { font-weight: bold; line-height: 1.4; font-size: 14px; }
            .req-item.passed .req-icon { color: var(--quiz-correct-color); }
            .req-item.failed .req-icon { color: var(--quiz-incorrect-color); }
            .req-item.passed .req-text { text-decoration: line-through; color: var(--text-muted); }
            .req-content { display: flex; flex-direction: column; gap: 4px; }
            .req-hint {
                font-size: 11.5px;
                color: var(--progress-danger-color);
                font-family: Consolas, monospace;
                background: var(--hint-danger-background-color);
                border: 1px solid var(--hint-danger-border-color);
                padding: 3px 8px;
                border-radius: 4px;
                display: inline-block;
                width: fit-content;
            }

            /* Algorytmiczne testy JS */
            .test-suite-results { display: flex; flex-direction: column; gap: 8px; }
            .test-row { display: flex; gap: 10px; padding: 8px 12px; border-radius: 6px; background: var(--bg-layer-1); border: 1px solid var(--border-color); color: var(--text-color); }
            .test-row.test-passed { border-left: 4px solid var(--quiz-correct-color); }
            .test-row.test-failed { border-left: 4px solid var(--quiz-incorrect-color); }
            .test-status-icon { font-weight: bold; }
            .test-passed .test-status-icon { color: var(--quiz-correct-color); }
            .test-failed .test-status-icon { color: var(--quiz-incorrect-color); }
            .test-name { font-weight: 600; color: var(--text-color); }
            .test-values { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
            .test-values code { background: var(--task-code-bg-color); border: 1px solid var(--border-color); padding: 1px 4px; border-radius: 3px; color: var(--task-code-text-color); }

            /* Canvas Sandbox */
            .canvas-sandbox-view { display: flex; flex-direction: column; gap: 10px; align-items: center; justify-content: center; height: 100%; }
            .canvas-title { font-size: 12px; color: var(--text-muted); align-self: flex-start; }
            .canvas-box { border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: var(--background-color); box-shadow: 0 4px 15px color-mix(in srgb, var(--text-color) 12%, transparent); }
            .code-runner-canvas { display: block; max-width: 100%; height: auto; }
            .btn-canvas-clear { background: var(--button-bg-secondary); color: var(--text-color); border: 1px solid var(--border-color); padding: 6px 12px; border-radius: 4px; font-size: 11.5px; cursor: pointer; transition: background 0.15s ease; }
            .btn-canvas-clear:hover { background: var(--button-bg-hover-secondary); }

            /* PHP Browser Preview Tab */
            .php-browser-preview-view { display: flex; flex-direction: column; height: 100%; min-height: 0; padding-right: 4px; padding-bottom: 24px; }
            .php-browser-container {
                background: var(--bg-layer-1);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 380px;
                box-shadow: 0 4px 15px color-mix(in srgb, var(--text-color) 8%, transparent);
            }
            .php-browser-bar {
                display: flex;
                align-items: center;
                gap: 10px;
                background: var(--bg-layer-2);
                padding: 8px 12px;
                border-bottom: 1px solid var(--border-color);
                flex-shrink: 0;
            }
            .browser-dots { display: flex; gap: 6px; }
            .browser-dots .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
            .dot.dot-red { background: #ef4444; }
            .dot.dot-yellow { background: #f59e0b; }
            .dot.dot-green { background: #10b981; }
            .browser-address-bar {
                flex-grow: 1;
                background: var(--input-bg-color);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 4px 10px;
                font-family: Consolas, monospace;
                font-size: 11.5px;
                color: var(--text-color);
                display: flex;
                align-items: center;
            }
            .browser-protocol { color: var(--text-muted); margin-right: 2px; }
            .browser-refresh-btn {
                background: transparent;
                border: none;
                color: var(--text-muted);
                font-size: 13px;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px;
                transition: color 0.15s ease, background 0.15s ease;
            }
            .browser-refresh-btn:hover { color: var(--text-color); background: var(--bg-layer-3); }
            .php-preview-placeholder {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 40px 20px;
                background: var(--bg-layer-1);
                border: 2px dashed var(--border-color);
                border-radius: 8px;
                margin: 20px auto;
                max-width: 500px;
                color: var(--text-muted);
            }
            .php-placeholder-icon { font-size: 36px; margin-bottom: 10px; }
            .php-placeholder-title { font-size: 15px; font-weight: 700; color: var(--text-color); margin-bottom: 8px; }
            .php-placeholder-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.6; }
            .php-placeholder-desc code {
                background: var(--task-code-bg-color);
                color: var(--task-code-text-color);
                border: 1px solid var(--border-color);
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 11.5px;
                font-family: Consolas, monospace;
            }

            /* Elementy renderowane przez PHP w podglądzie przeglądarki */
            .php-browser-viewport {
                background: var(--background-color);
                color: var(--text-color);
                padding: 16px 20px;
                flex-grow: 1;
            }
            .php-browser-viewport * { color: inherit; }
            .php-browser-viewport ul, .php-browser-viewport ol { margin: 10px 0; padding-left: 24px; color: var(--text-color); }
            .php-browser-viewport li { margin-bottom: 6px; color: var(--text-color); font-weight: 500; }
            .php-browser-viewport p { color: var(--text-color); margin: 8px 0; }
            .php-browser-viewport table {
                width: 100%;
                border-collapse: collapse;
                margin: 12px 0;
                font-size: 13px;
                background: var(--table-row-bg-color);
                color: var(--text-color);
            }
            .php-browser-viewport th, .php-browser-viewport td {
                border: 1px solid var(--table-border-color);
                padding: 8px 12px;
                text-align: left;
                color: var(--text-color);
            }
            .php-browser-viewport th {
                background: var(--table-header-bg-color);
                color: var(--text-color);
                font-weight: 700;
            }
            .php-browser-viewport tr:nth-child(even) { background: var(--table-all-row-hover-bg-color); }
            .php-browser-viewport tr.drogi, .php-browser-viewport tr.przeciazenie, .php-browser-viewport tr.czerwony {
                background-color: var(--hint-danger-background-color) !important;
                color: var(--progress-danger-color) !important;
                font-weight: 600;
            }
            .php-browser-viewport tr.tani, .php-browser-viewport tr.norma, .php-browser-viewport tr.zielony {
                background-color: var(--hint-success-background-color) !important;
                color: var(--progress-success-color) !important;
            }
            .php-browser-viewport select {
                padding: 6px 12px;
                border-radius: 6px;
                border: 1px solid var(--border-color);
                background: var(--input-bg-color);
                color: var(--text-color);
                font-size: 14px;
                min-width: 200px;
            }
            .php-browser-viewport .cookie-alert, .php-browser-viewport .sukces, .php-browser-viewport .upload-success {
                background: var(--hint-success-background-color);
                border: 1px solid var(--hint-success-border-color);
                color: var(--progress-success-color);
                padding: 12px 16px;
                border-radius: 6px;
                margin: 10px 0;
                font-weight: 600;
            }
            .php-browser-viewport p.suma { font-size: 16px; font-weight: bold; margin-top: 14px; color: var(--accent-color); }
            .php-error-box {
                background: var(--hint-danger-background-color);
                border: 1px solid var(--hint-danger-border-color);
                border-radius: 6px;
                padding: 12px 14px;
                color: var(--progress-danger-color);
                font-family: monospace;
                font-size: 12.5px;
            }
            .php-error-box .error-head { font-weight: bold; margin-bottom: 6px; color: var(--quiz-incorrect-color); }
            .php-preview-hint {
                font-size: 12px;
                color: var(--accent-color);
                background: var(--hint-info-background-color);
                border: 1px solid var(--hint-info-border-color);
                padding: 8px 12px;
                border-radius: 6px;
                margin-top: 12px;
            }
            /* DOM Sandbox Preview (np. Kanban / Drag and Drop) */
            .dom-browser-preview-view {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 380px;
                background: var(--bg-layer-1);
            }
            .dom-preview-toolbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: var(--bg-layer-2);
                border-bottom: 1px solid var(--border-color);
                font-size: 13px;
                color: var(--text-color);
            }
            .dom-preview-title {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12.5px;
            }
            .dom-preview-reset-btn {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                font-size: 12px;
                font-weight: 600;
                background: var(--button-bg-secondary);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.15s ease, border-color 0.15s ease;
                white-space: nowrap;
            }
            .dom-preview-reset-btn:hover {
                background: var(--button-bg-hover-secondary);
            }
            .dom-preview-viewport {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
            }

            /* --- Kanban Board & Drag and Drop Styling --- */
            .dom-preview-viewport .kanban-preview-wrapper {
                display: flex;
                flex-direction: column;
                gap: 12px;
                width: 100%;
            }
            .dom-preview-viewport .kanban-status-banner {
                padding: 10px 14px;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 8px;
                background: var(--hint-info-background-color);
                border: 1px solid var(--hint-info-border-color);
                color: var(--text-color);
                transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }
            .dom-preview-viewport .kanban-status-banner.status-success {
                background: var(--hint-success-background-color);
                border-color: var(--hint-success-border-color);
                color: var(--progress-success-color);
                font-weight: 600;
            }
            .dom-preview-viewport .kanban-status-banner.status-blocked {
                background: var(--hint-danger-background-color);
                border-color: var(--hint-danger-border-color);
                color: var(--progress-danger-color);
                font-weight: 600;
            }
            .dom-preview-viewport .kanban-board {
                display: flex;
                gap: 18px;
                width: 100%;
                min-height: 290px;
            }
            .dom-preview-viewport .drop-zone {
                flex: 1;
                background: var(--bg-layer-2);
                border: 2px dashed var(--border-color);
                border-radius: 8px;
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-height: 250px;
                transition: border-color 0.2s ease, background-color 0.2s ease;
            }
            .dom-preview-viewport .drop-zone-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 4px;
            }
            .dom-preview-viewport .drop-zone h2 {
                font-size: 14px;
                margin: 0;
                color: var(--text-color);
                font-weight: 700;
            }
            .dom-preview-viewport .column-count {
                font-size: 11px;
                padding: 2px 7px;
                border-radius: 10px;
                background: var(--bg-layer-3);
                color: var(--text-muted);
                font-weight: 700;
            }
            .dom-preview-viewport .drop-zone.drag-over {
                border-color: var(--quiz-correct-color, #16a34a);
                background: var(--hint-success-background-color);
            }
            .dom-preview-viewport .task-card {
                background: var(--bg-layer-1);
                border: 1.5px solid var(--border-color);
                border-radius: 8px;
                padding: 10px 12px;
                cursor: grab;
                user-select: none;
                display: flex;
                gap: 10px;
                align-items: flex-start;
                box-shadow: 0 2px 5px rgba(0,0,0,0.06);
                transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
            }
            .dom-preview-viewport .task-card:hover {
                transform: translateY(-2px);
                border-color: var(--accent-color);
                box-shadow: 0 5px 12px rgba(0,0,0,0.12);
            }
            .dom-preview-viewport .task-card:active {
                cursor: grabbing;
            }
            .dom-preview-viewport .task-card.is-dragging {
                opacity: 0.35;
                transform: scale(0.98);
            }
            .dom-preview-viewport .task-card.is-locked {
                border-style: dashed;
                border-color: var(--progress-danger-color);
                background: var(--hint-danger-background-color);
            }
            .dom-preview-viewport .card-handle {
                color: var(--text-muted);
                font-size: 15px;
                line-height: 1.2;
                user-select: none;
                cursor: grab;
                opacity: 0.7;
            }
            .dom-preview-viewport .card-content {
                flex: 1;
            }
            .dom-preview-viewport .task-card p {
                margin: 0 0 6px 0;
                font-size: 13px;
                color: var(--text-color);
                font-weight: 600;
                line-height: 1.4;
            }
            .dom-preview-viewport .badge {
                display: inline-block;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                background: var(--button-bg-primary);
                color: #ffffff;
            }
            .dom-preview-viewport .badge-urgent { background: #ef4444; }
            .dom-preview-viewport .badge-normal { background: #3b82f6; }
            .dom-preview-viewport .badge-success { background: #10b981; }
            .dom-preview-viewport .badge-locked { background: #f97316; }

            /* --- Tic-Tac-Toe Game Board Styling --- */
            .dom-preview-viewport .tictactoe-board-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 16px;
                padding: 12px;
            }
            .dom-preview-viewport .tictactoe-status {
                font-size: 14px;
                font-weight: 700;
                color: var(--text-color);
                padding: 8px 16px;
                background: var(--bg-layer-2);
                border: 1px solid var(--border-color);
                border-radius: 20px;
            }
            .dom-preview-viewport .tictactoe-grid {
                display: grid;
                grid-template-columns: repeat(3, 76px);
                grid-gap: 10px;
                background: var(--bg-layer-3);
                padding: 10px;
                border-radius: 12px;
                border: 1px solid var(--border-color);
            }
            .dom-preview-viewport .tictactoe-cell {
                width: 76px;
                height: 76px;
                background: var(--bg-layer-1);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-size: 32px;
                font-weight: 800;
                color: var(--text-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
                user-select: none;
            }
            .dom-preview-viewport .tictactoe-cell:hover:not(.taken) {
                background: var(--button-bg-hover-secondary);
                transform: scale(1.04);
                border-color: var(--accent-color);
            }
            .dom-preview-viewport .tictactoe-cell.cell-o { color: #3b82f6; }
            .dom-preview-viewport .tictactoe-cell.cell-x { color: #ef4444; }
            .dom-preview-viewport .tictactoe-cell.cell-error {
                animation: shake 0.3s ease;
                border-color: #ef4444;
            }

            /* --- Photo Lab Filters Styling --- */
            .dom-preview-viewport .photo-lab-container {
                display: flex;
                flex-direction: column;
                gap: 14px;
                max-width: 520px;
                margin: 0 auto;
            }
            .dom-preview-viewport .photo-lab-frame {
                border-radius: 10px;
                border: 2px solid var(--border-color);
                overflow: hidden;
                background: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 200px;
            }
            .dom-preview-viewport .photo-lab-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: filter 0.1s ease;
            }
            .dom-preview-viewport .photo-lab-controls {
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: var(--bg-layer-2);
                padding: 14px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
            }
            .dom-preview-viewport .photo-lab-control-group {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .dom-preview-viewport .photo-lab-label {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                font-weight: 600;
                color: var(--text-color);
            }
            .dom-preview-viewport .photo-lab-code-output {
                font-family: Consolas, monospace;
                font-size: 12px;
                padding: 8px 12px;
                background: var(--task-code-bg-color);
                color: var(--task-code-text-color);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                text-align: center;
            }

            /* --- Dynamic Queue Styling --- */
            .dom-preview-viewport .queue-lab-container {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .dom-preview-viewport .queue-toolbar {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            .dom-preview-viewport .queue-input {
                flex-grow: 1;
                min-width: 180px;
                padding: 6px 12px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                background: var(--input-bg-color);
                color: var(--text-color);
                font-size: 13px;
            }
            /* Wyłączenie globalnych pseudo-elementów (np. button::before z _button.scss), które przejmują kliknięcia */
            .dom-preview-viewport button::before,
            .dom-preview-viewport button::after,
            .native-html-preview button::before,
            .native-html-preview button::after,
            .dom-preview-viewport *::before,
            .dom-preview-viewport *::after {
                content: none !important;
                display: none !important;
                pointer-events: none !important;
            }
            .dom-preview-viewport button {
                position: relative !important;
            }

            .dom-preview-viewport .queue-btn {
                position: relative;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12.5px;
                font-weight: 600;
                cursor: pointer;
                border: 1px solid var(--border-color);
                background: var(--button-bg-secondary);
                color: var(--text-color);
                transition: background 0.15s ease;
            }
            .dom-preview-viewport .queue-btn-primary {
                background: var(--button-bg-primary);
                color: #ffffff;
                border-color: var(--button-bg-primary);
            }
            .dom-preview-viewport .queue-btn:hover {
                background: var(--button-bg-hover-secondary);
            }
            .dom-preview-viewport .queue-btn-primary:hover {
                background: var(--button-bg-hover-primary);
            }
            .dom-preview-viewport .queue-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .dom-preview-viewport .queue-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 14px;
                background: var(--bg-layer-2);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 13px;
                color: var(--text-color);
            }
            .dom-preview-viewport .queue-empty-msg {
                text-align: center;
                padding: 24px;
                color: var(--text-muted);
                font-style: italic;
                font-size: 13px;
            }

            /* Podgląd struktury HTML (Tylko do odczytu) */
            .dom-html-readonly-container {
                padding: 16px;
                background: var(--bg-layer-1);
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: auto;
            }
            .dom-html-readonly-pre {
                margin: 0;
                padding: 16px;
                background: var(--task-code-bg-color, #1e1e1e);
                color: var(--task-code-text-color, #d4d4d4);
                border-radius: 8px;
                border: 1px solid var(--border-color);
                font-family: Consolas, "Fira Code", monospace;
                font-size: 13px;
                line-height: 1.6;
                white-space: pre-wrap;
                word-break: break-all;
            }

            /* Banner Sukcesu */
            .code-runner-success-banner {
                background: var(--quiz-correct-color, #16a34a);
                color: #ffffff;
                padding: 12px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
            }
            .code-runner-success-banner.hidden,
            .code-runner-success-banner[hidden] {
                display: none !important;
            }
            .code-runner-success-banner.show {
                display: block !important;
            }
        `,document.getElementById("code-runner-styles")||document.head.appendChild(e)}}export{F as default};
