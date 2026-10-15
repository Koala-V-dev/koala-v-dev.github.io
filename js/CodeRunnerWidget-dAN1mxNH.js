const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["css/monaco.css"])))=>i.map(i=>d[i]);
import{_ as H}from"./monaco-CMNtKCUQ.js";import"./MonacoSetup-DjItL_5q.js";import{s as I}from"./MonacoPhpSupport-B3kW99Ie.js";import{B as N}from"./BaseWidget-C_r974-e.js";import{U as a}from"./UIFacade-CIzljsMz.js";import{a as W}from"./ScrollManager-BCam3L0h.js";import"./WidgetAccessibility-B_z9ddCY.js";import"./CourseHealthManager-DMheK9Hv.js";import"./katex-XbL3y5x-.js";import"./markdown-BDRwxJm4.js";class Z{constructor(e="",r="javascript",t=[],n={}){this.code=e,this.language=r.toLowerCase(),this.requirements=t.map(o=>({...o,passed:!1,actual:null})),this.consoleLogs=[],this.testResults=[],this.queryResultRows=[],this.htmlOutput="",this.executionError=null,this.options=n}updateCode(e){this.code=e}async evaluate(e={}){this.consoleLogs=[],this.testResults=[],this.queryResultRows=[],this.htmlOutput="",this.executionError=null;const r=this.code.trim();this.language==="php"&&this.simulatePhpExecution(r);for(const t of this.requirements)try{t.passed=await this._checkRequirement(t,r,e)}catch(n){console.error(`[CodeRunnerModel] Błąd testu "${t.id}":`,n),t.passed=!1,t.actual=n.message}return this.requirements}simulatePhpExecution(e){if(this.htmlOutput="",!(!e||!e.trim()))try{let r="";const t=(...l)=>{r+=l.join("")},n={imie:"Anna Nowak",nazwa:"Produkt testowy",cena:"49.99",...this.options.post},o={id:"1",...this.options.get},i={licznik_wizyt:"2",odwiedziny:"tak",...this.options.cookies},c={zdjecie:{name:"fotografia.jpg",type:"image/jpeg",size:1048576,tmp_name:"/tmp/php8f92a",error:0},fotografia:{name:"portret.png",type:"image/png",size:524288,tmp_name:"/tmp/phpa411b",error:0},...this.options.files},b=0,p="extension",u=[[1,"Wędka spinningowa teleskopowa",189.5],[2,"Kołowrotek karpiowy z wolnym biegiem",249],[3,"Żyłka nylonowa 0.25mm 150m",28.9],[4,"Podbierak składany duży",75],[5,"Zestaw spławików rzecznych",34.5]],g=[[1,"Włochy - Rzym i Watykan"],[2,"Hiszpania - Costa Brava"],[3,"Grecja - Kreta i Santorini"],[4,"Chorwacja - Dalmacja"],[5,"Islandia - Złoty Krąg"]],v={status:"connected"},d=()=>({status:"connected"}),x=()=>!0,w=(l,m)=>String(m||"").replace(/'/g,"\\'"),T=(l,m)=>{const k=String(m||"").toLowerCase();let P=u;return k.includes("wycieczki")&&(P=g),{rows:P.map(z=>[...z]),assocRows:P.map(z=>({id:z[0],nazwa:z[1],cena:z[2],cel:z[1]})),pointer:0}},B=l=>!l||!l.rows||l.pointer>=l.rows.length?null:l.rows[l.pointer++],q=l=>!l||!l.assocRows||l.pointer>=l.assocRows.length?null:l.assocRows[l.pointer++],L=(l,m=0,k=".",P=",")=>{const z=isFinite(+l)?+l:0,M=isFinite(+m)?Math.abs(m):0,C=(M?((K,O)=>{const D=Math.pow(10,O);return""+(Math.round(K*D)/D).toFixed(O)})(z,M):""+Math.round(z)).split(".");return C[0].length>3&&(C[0]=C[0].replace(/\B(?=(?:\d{3})+(?!\d))/g,P)),(C[1]||"").length<M&&(C[1]=C[1]||"",C[1]+=new Array(M-C[1].length+1).join("0")),C.join(k)},j=(l,m)=>(i[l]=String(m),!0),R=()=>Math.floor(Date.now()/1e3),$=l=>String(l||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),S=l=>String(l||"").split("/").pop().split("\\").pop(),f=l=>{const m=String(l||"").split(".");return m.length>1?m.pop():""},y=l=>String(l||"").toLowerCase(),_=l=>String(l||"").trim(),h=()=>!0;let s=e.replace(/<\?php|<\?|\?>/g,"");s=s.replace(/\(int\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"parseInt($1, 10)"),s=s.replace(/\(float\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"parseFloat($1)"),s=s.replace(/\(string\)\s*(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)/g,"String($1)"),s=s.replace(/!empty\s*\(([^)]+)\)/g,"Boolean($1)"),s=s.replace(/empty\s*\(([^)]+)\)/g,"(!$1)"),s=s.replace(/isset\s*\(([^)]+)\)/g,"($1 !== undefined && $1 !== null)"),s=s.replace(/([$'"`\w)\]])\s*\.\s*([$'"`\w(\[])/g,"$1 + $2"),s=s.replace(/\becho\s+([^;]+);/g,(l,m)=>`__echo(${m});`),s=s.replace(/\bprint\s+([^;]+);/g,(l,m)=>`__echo(${m});`);const E=s.match(/\$[a-zA-Z0-9_]+/g)||[],F=Array.from(new Set(E)).filter(l=>!["$_POST","$_GET","$_COOKIE","$_FILES","$conn"].includes(l)).map(l=>`let ${l} = null;`).join(`
`);new Function("__echo","$_POST","$_GET","$_COOKIE","$_FILES","$conn","UPLOAD_ERR_OK","PATHINFO_EXTENSION","mysqli_connect","mysqli_close","mysqli_query","mysqli_fetch_row","mysqli_fetch_assoc","mysqli_real_escape_string","number_format","setcookie","time","htmlspecialchars","basename","pathinfo","strtolower","trim","move_uploaded_file",`"use strict";
${F}
${s}`)(t,n,o,i,c,v,b,p,d,x,T,B,q,w,L,j,R,$,S,f,y,_,h),s=s.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g,(l,m)=>{if(!m.includes("$"))return l;let k=m.replace(/\{(\$[a-zA-Z0-9_]+(?:\[[^\]]+\])?)\}/g,"${$1}");return k=k.replace(/(\$[a-zA-Z0-9_]+\[[^\]]+\])/g,"${$1}"),k=k.replace(/(\$[a-zA-Z0-9_]+)/g,"${$1}"),`\`${k}\``}),this.htmlOutput=r}catch(r){console.warn("[CodeRunnerModel] Błąd symulacji PHP:",r.message),this.htmlOutput=`<div class="php-error-box"><div class="error-head">⚠️ Błąd parsera PHP:</div><div class="error-body"><code>${r.message}</code></div></div>`}}isAllPassed(){return this.requirements.length>0&&this.requirements.every(e=>e.passed)}_stripComments(e){if(!e)return"";let r=e.replace(/\/\*[\s\S]*?\*\//g,"");return r=r.replace(/(?:^|[^\\])(?:\/\/[^\r\n]*|#[^\r\n]*|--[^\r\n]*)/g,""),r.trim()}async _checkRequirement(e,r,t){const n=this._stripComments(r);switch(e.type){case"test-case":return await this._runTestCase(e,r);case"sql-execute":return await this._runSqlExecute(e,r);case"contains":return this.language==="sql"?n.toLowerCase().includes(e.pattern.toLowerCase()):n.includes(e.pattern);case"not-contains":return this.language==="sql"?!n.toLowerCase().includes(e.pattern.toLowerCase()):!n.includes(e.pattern);case"regex":{let o=e.flags||"m";return this.language==="sql"&&!o.includes("i")&&(o+="i"),new RegExp(e.pattern,o).test(n)}case"console-output":return this.consoleLogs.some(o=>String(o).includes(e.pattern));default:return!1}}async _runTestCase(e,r){if(!e.functionName||!e.input)return!1;try{const t=`
                ${r};
                if (typeof ${e.functionName} !== 'function') {
                    throw new Error("Funkcja '${e.functionName}' nie została zdefiniowana!");
                }
                return Promise.resolve(${e.functionName}.apply(null, ${JSON.stringify(e.input)}));
            `,o=await new Function(t)();e.actual=o;const i=this._deepEqual(o,e.expected);return this.testResults.push({name:e.text,input:e.input,expected:e.expected,actual:o,passed:i}),i}catch(t){return e.actual=`Błąd wykonania: ${t.message}`,this.testResults.push({name:e.text,input:e.input,expected:e.expected,actual:t.message,passed:!1}),!1}}async _getSqlJs(){if(this._SQL)return this._SQL;if(typeof globalThis.TextDecoder>"u"||typeof globalThis.TextEncoder>"u")try{const e=await H(()=>import("./__vite-browser-external-D7Ct-6yo.js").then(r=>r._),[]);typeof globalThis.TextDecoder>"u"&&(globalThis.TextDecoder=e.TextDecoder),typeof globalThis.TextEncoder>"u"&&(globalThis.TextEncoder=e.TextEncoder)}catch{}if(typeof window<"u"&&window.initSqlJs)return this._SQL=await window.initSqlJs(),this._SQL;try{const e=await H(()=>import("./sql-asm-BYFb6QVd.js").then(t=>t.s),[]),r=e.default||e;return this._SQL=await r(),this._SQL}catch(e){return console.warn("[CodeRunnerModel] sql.js init fallback:",e.message),null}}async _runSqlExecute(e,r){const t=await this._getSqlJs();if(t)try{const o=new t.Database;e.schema&&o.run(e.schema);const i=o.exec(r);if(o.close(),!i||i.length===0)return this.queryResultRows=[],e.actual="Zapytanie wykonane (0 wierszy wyniku).",e.expectedCount===0;const c=i[0],b=c.columns||[],p=c.values||[];if(this.queryResultRows=p.map(u=>{const g={};return b.forEach((v,d)=>{g[v]=u[d]}),g}),typeof e.expectedCount=="number"&&this.queryResultRows.length!==e.expectedCount)return e.actual=`Zwrócono ${this.queryResultRows.length} wierszy (oczekiwano ${e.expectedCount})`,!1;if(Array.isArray(e.expectedColumns)){const u=b.map(v=>v.toLowerCase()),g=e.expectedColumns.filter(v=>!u.includes(v.toLowerCase()));if(g.length>0)return e.actual=`Brakujące kolumny w wyniku: ${g.join(", ")}`,!1}return e.actual=`Zwrócono ${this.queryResultRows.length} wierszy (${b.join(", ")})`,!0}catch(o){return this.queryResultRows=[],this.executionError=o.message,e.actual=`Błąd SQL: ${o.message}`,!1}return r.toUpperCase().includes("SELECT")?(this.queryResultRows=[{status:"Zapytanie poprawne syntaktycznie"}],e.actual="Zapytanie zweryfikowane syntaktycznie",!0):(e.actual="Brak klauzuli SELECT",!1)}async inspectSchema(e){if(!e)return[];const r=await this._getSqlJs();if(!r)return[];try{const t=new r.Database;t.run(e);const n=t.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");if(!n||n.length===0)return t.close(),[];const o=n[0].values.map(c=>c[0]),i=[];for(const c of o){const b=t.exec(`PRAGMA table_info("${c}");`),p=b&&b.length>0?b[0].values.map(d=>({cid:d[0],name:d[1],type:d[2]||"TEXT",notnull:d[3]===1,pk:d[5]===1})):[];let u=[];try{const d=t.exec(`PRAGMA foreign_key_list("${c}");`);d&&d.length>0&&(u=d[0].values.map(x=>({from:x[3],toTable:x[2],toColumn:x[4]})))}catch{}const g=t.exec(`SELECT * FROM "${c}" LIMIT 6;`),v=g&&g.length>0?g[0].values:[];i.push({table:c,columns:p,foreignKeys:u,rows:v})}return t.close(),i}catch(t){return console.warn("[CodeRunnerModel] inspectSchema error:",t),[]}}_deepEqual(e,r){if(e===r)return!0;if(e&&r&&typeof e=="object"&&typeof r=="object"){if(e.constructor!==r.constructor)return!1;if(Array.isArray(e)){if(e.length!==r.length)return!1;for(let o=0;o<e.length;o++)if(!this._deepEqual(e[o],r[o]))return!1;return!0}const t=Object.keys(e),n=Object.keys(r);if(t.length!==n.length)return!1;for(const o of t)if(!Object.prototype.hasOwnProperty.call(r,o)||!this._deepEqual(e[o],r[o]))return!1;return!0}return!1}}class V extends N{static async create(e,r={}){const t=new V(e,r);return await t.mount(),t}constructor(e,r={}){super(e,r),this.model=null,this.editor=null,this.monaco=null,this.isUnlocked=!1,this.themeListener=null,this.keyListener=null,this.resizeObserver=null,this.isFullscreen=!1,this.activeTabId=null,this.tabButtons={},this.tabPanels={},this.canvas=null,this.canvasCtx=null,this.hasCanvas=!1,this.domHtml="",this.hasDom=!1,this.domViewport=null}dispose(){super.dispose(),this.isFullscreen&&(document.body.classList.remove("code-runner-lock-scroll"),this.placeholder&&this.placeholder.parentNode&&(this.placeholder.parentNode.insertBefore(this.container,this.placeholder),this.placeholder.remove(),this.placeholder=null)),this.editor&&typeof this.editor.dispose=="function"&&(this.editor.dispose(),this.editor=null),this.themeListener&&(W.off("theme:changed",this.themeListener),this.themeListener=null),this.keyListener&&(window.removeEventListener("keydown",this.keyListener),this.keyListener=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null)}async mount(){const e=this.container.getAttribute("language")||"javascript",r=this.container.getAttribute("title")||`Silnik Testowy (${e.toUpperCase()})`,t=this.container.getAttribute("sandbox")||"";this.hasCanvas=t==="canvas"||this.container.hasAttribute("data-canvas");const n=this.container.querySelector('template[data-type="code"]')||this.container.querySelector('template:not([data-type="requirements"]):not([data-type="html"])'),o=this.container.querySelector('template[data-type="requirements"]'),i=this.container.querySelector('template[data-type="html"]'),c=h=>{const s=atob(h),E=Uint8Array.from(s,A=>A.charCodeAt(0));return new TextDecoder().decode(E)},b=this.container.getAttribute("data-code"),p=this.container.getAttribute("data-requirements"),u=this.container.getAttribute("data-html"),g=b?c(b):n?n.textContent.trim():"";this.domHtml=u?c(u):i?i.textContent.trim():"",this.hasDom=!!this.domHtml||t==="dom"||t==="html"||this.container.hasAttribute("data-dom");let v=[];try{const h=p?c(p):o?o.textContent.trim():"";v=h?JSON.parse(h):[]}catch(h){console.error("[CodeRunnerWidget] Błąd parsowania wymagań:",h)}this.model=new Z(g,e,v),this._injectStyles();const d=a.create("div",{class:"code-runner-container"}),x=a.create("div",{class:"code-runner-header"}),w=a.create("div",{class:"code-runner-title"});w.innerHTML=`⚡ <strong>${r}</strong>`;const T=a.create("div",{class:`code-runner-lang-badge lang-${this.model.language}`});T.textContent=this.model.language.toUpperCase();const B=a.create("div",{class:"code-runner-status"});B.textContent="Status: Oczekiwanie ⏳",this.fullscreenBtn=a.create("button",{class:"code-runner-btn-fullscreen",type:"button",title:"Przełącz tryb pełnoekranowy (Esc aby wyjść)"}),this.fullscreenBtn.innerHTML="⛶ <span>Pełny ekran</span>",this.fullscreenBtn.addEventListener("click",()=>this.toggleFullscreen()),x.appendChild(w),x.appendChild(T),x.appendChild(B),x.appendChild(this.fullscreenBtn),d.appendChild(x);const q=a.create("div",{class:"code-runner-body"}),L=a.create("div",{class:"code-runner-left"}),j=a.create("div",{class:"column-title"});j.textContent="Edytor Kodu Source",L.appendChild(j);const R=a.create("div",{class:"code-runner-editor"});L.appendChild(R);const $=a.create("div",{class:"code-runner-controls"});this.runBtn=a.create("button",{class:"btn-run-code",type:"button"}),this.runBtn.textContent="▶ Uruchom Kod i Wykonaj Asercje",$.appendChild(this.runBtn),this.fsControlBtn=a.create("button",{class:"btn-runner-expand",type:"button",title:"Wyrwij do pełnego ekranu (Esc aby wyjść)"}),this.fsControlBtn.innerHTML="⛶ <span>Pełny ekran</span>",this.fsControlBtn.addEventListener("click",()=>this.toggleFullscreen()),$.appendChild(this.fsControlBtn),L.appendChild($),q.appendChild(L);const S=a.create("div",{class:"code-runner-right"}),f=a.create("div",{class:"code-runner-tabs-bar",role:"tablist"});S.appendChild(f);const y=a.create("div",{class:"code-runner-panels-container"});S.appendChild(y),q.appendChild(S),d.appendChild(q),this.successBanner=a.create("div",{class:"code-runner-success-banner hidden"}),this.successBanner.style.display="none",this.successBanner.hidden=!0,this.successBanner.innerHTML="🏆 <strong>Sukces!</strong> Wszystkie testy wyjścia zostały zaliczone. Brama odblokowana!",d.appendChild(this.successBanner);let _=[];if(this.model.language==="sql"){const h=v.find(E=>E.type==="sql-execute"&&E.schema),s=h?h.schema:this.container.getAttribute("data-schema")||"";s&&(_=await this.model.inspectSchema(s)),_&&_.length>0&&this._registerTab("db-schema",`🗄️ Baza Danych i Krotki (${_.length})`,f,y,()=>this._createSchemaExplorerView(_))}if(this._registerTab("test-output","📊 Wyniki & Kryteria",f,y,()=>this._createResultsView()),this.model.language==="javascript"&&(this.hasCanvas||this.model.code.includes("canvas"))&&this._registerTab("js-canvas","🎨 Canvas Sandbox",f,y,()=>this._createCanvasView()),this.model.language==="php"&&this._registerTab("php-preview","🌐 Render Przeglądarki (PHP)",f,y,()=>this._createPhpPreviewView()),this.hasDom){let h="🌐 Interaktywny Podgląd DOM";const s=r.toLowerCase();s.includes("kanban")||s.includes("drag")?h="🌐 Podgląd DOM (Kanban)":s.includes("kółko")||s.includes("krzyżyk")||s.includes("tury")?h="🎮 Interaktywna Plansza Gry":s.includes("naświetlan")||s.includes("filtr")||s.includes("laborator")?h="🖼️ Podgląd Na Żywo (Filtry CSS)":(s.includes("kolejk")||s.includes("list"))&&(h="📋 Interaktywna Kolejka Zgłoszeń"),this._registerTab("dom-preview",h,f,y,()=>this._createDomPreviewView(this.domHtml)),this._registerTab("dom-html-readonly","📄 Struktura HTML (Podgląd)",f,y,()=>this._createHtmlReadonlyView(this.domHtml))}this.model.language==="sql"&&_.length>0?this._switchTab("db-schema"):this.hasDom?this._switchTab("dom-preview"):this._switchTab("test-output"),this.container.replaceWith(d),this.container=d,await this._initMonaco(R),this.runBtn.addEventListener("click",async()=>await this._executeCode()),this.hasDom&&this.domViewport&&this._bindDomEvents(),this._renderChecklist(this.model.requirements),this.themeListener=h=>{const s=h==="dark"?"vs-dark":"vs-light";this.editor&&this.monaco&&this.monaco.editor.setTheme(s)},W.on("theme:changed",this.themeListener),this.keyListener=h=>{h.key==="Escape"&&this.isFullscreen&&this.toggleFullscreen()},window.addEventListener("keydown",this.keyListener)}_registerTab(e,r,t,n,o){const i=a.create("button",{class:"code-runner-tab-btn",type:"button",role:"tab","data-tab-id":e});i.textContent=r,i.addEventListener("click",()=>this._switchTab(e)),t.appendChild(i),this.tabButtons[e]=i;const c=a.create("div",{class:"code-runner-tab-panel",role:"tabpanel","data-tab-panel":e});c.hidden=!0,c.style.display="none";const b=o();c.appendChild(b),n.appendChild(c),this.tabPanels[e]=c}_switchTab(e){this.tabPanels[e]&&(this.activeTabId=e,Object.keys(this.tabButtons).forEach(r=>{const t=this.tabButtons[r],n=r===e;t.classList.toggle("active",n),t.setAttribute("aria-selected",n?"true":"false")}),Object.keys(this.tabPanels).forEach(r=>{const t=this.tabPanels[r],n=r===e;t.classList.toggle("active",n),t.hidden=!n,t.style.display=n?"flex":"none"}))}toggleFullscreen(){if(this.isFullscreen=!this.isFullscreen,this.isFullscreen){this.placeholder||(this.placeholder=document.createElement("div"),this.placeholder.className="code-runner-placeholder",this.placeholder.style.display="none",this.container.parentNode&&this.container.parentNode.insertBefore(this.placeholder,this.container)),document.body.appendChild(this.container),this.container.classList.add("code-runner-fullscreen"),document.body.classList.add("code-runner-lock-scroll");const e="🗗 <span>Zwiń</span>",r="Zwiń do widoku lekcji (Esc)";this.fullscreenBtn&&(this.fullscreenBtn.innerHTML=e,this.fullscreenBtn.title=r),this.fsControlBtn&&(this.fsControlBtn.innerHTML=e,this.fsControlBtn.title=r)}else{this.placeholder&&this.placeholder.parentNode&&(this.placeholder.parentNode.insertBefore(this.container,this.placeholder),this.placeholder.remove(),this.placeholder=null),this.container.classList.remove("code-runner-fullscreen"),document.body.classList.remove("code-runner-lock-scroll");const e="⛶ <span>Pełny ekran</span>",r="Wyrwij do pełnego ekranu (Esc)";this.fullscreenBtn&&(this.fullscreenBtn.innerHTML=e,this.fullscreenBtn.title=r),this.fsControlBtn&&(this.fsControlBtn.innerHTML=e,this.fsControlBtn.title=r)}requestAnimationFrame(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()}),setTimeout(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()},60),setTimeout(()=>{this.editor&&typeof this.editor.layout=="function"&&this.editor.layout()},200)}_createSchemaExplorerView(e){const r=a.create("div",{class:"schema-explorer-view viewport-scroll-y"}),t=a.create("div",{class:"schema-view-intro"});t.innerHTML="Poniżej znajduje się struktura tabel oraz załadowane krotki (rekordy) w bazie in-memory:",r.appendChild(t);const n=a.create("div",{class:"schema-tables-list"});return e.forEach(o=>{const i=a.create("div",{class:"schema-table-card"}),c=a.create("div",{class:"schema-card-head"});c.innerHTML=`
                <div class="schema-badge-wrap">
                    <span class="schema-badge">TABELA</span>
                    <strong class="schema-table-name">${o.table}</strong>
                </div>
                <span class="schema-row-count">${o.rows?o.rows.length:0} krotek</span>
            `,i.appendChild(c);const b=a.create("div",{class:"schema-cols-bar"});if(o.columns.forEach(p=>{const u=a.create("span",{class:`schema-col-pill ${p.pk?"is-pk":""}`});u.innerHTML=`${p.pk?"🔑 ":""}<strong>${p.name}</strong> <span class="col-type">(${p.type}${p.pk?", PK":""})</span>`,b.appendChild(u)}),i.appendChild(b),o.foreignKeys&&o.foreignKeys.length>0){const p=a.create("div",{class:"schema-relations-bar"});o.foreignKeys.forEach(u=>{const g=a.create("span",{class:"schema-rel-pill"});g.innerHTML=`🔗 <strong>Relacja:</strong> <code>${o.table}.${u.from}</code> → <code>${u.toTable}.${u.toColumn}</code>`,p.appendChild(g)}),i.appendChild(p)}if(o.rows&&o.rows.length>0){const p=a.create("div",{class:"schema-tuples-container"}),u=a.create("div",{class:"schema-tuples-title"});u.innerHTML=`📋 <strong>Krotki w tabeli <code>${o.table}</code>:</strong>`,p.appendChild(u);const g=a.create("div",{class:"schema-table-scroll viewport-scroll-y"}),v=a.create("table",{class:"schema-tuples-table"}),d="<thead><tr>"+o.columns.map(w=>`<th>${w.name} <small>(${w.type})</small></th>`).join("")+"</tr></thead>",x="<tbody>"+o.rows.map(w=>"<tr>"+w.map(T=>`<td>${T===null?"<em>NULL</em>":T}</td>`).join("")+"</tr>").join("")+"</tbody>";v.innerHTML=d+x,g.appendChild(v),p.appendChild(g),i.appendChild(p)}n.appendChild(i)}),r.appendChild(n),r}_createResultsView(){const e=a.create("div",{class:"results-view viewport-scroll-y"});this.outputWindow=a.create("div",{class:"code-runner-output-window viewport-scroll-y"}),this.outputWindow.innerHTML='<div class="console-placeholder">Wpisz kod i kliknij "▶ Uruchom Kod" aby wykonać zapytanie na żywo.</div>',e.appendChild(this.outputWindow);const r=a.create("div",{class:"code-runner-requirements"}),t=a.create("h4");return t.textContent="Kryteria Zaliczenia:",r.appendChild(t),this.reqList=a.create("ul",{class:"code-runner-req-list"}),r.appendChild(this.reqList),e.appendChild(r),e}_createCanvasView(){const e=a.create("div",{class:"canvas-sandbox-view"}),r=a.create("div",{class:"canvas-title"});r.innerHTML="🎨 <strong>Interaktywne Płótno Canvas 2D</strong>",e.appendChild(r);const t=a.create("div",{class:"canvas-box"});this.canvas=a.create("canvas",{class:"code-runner-canvas",width:"460",height:"300"}),this.canvasCtx=this.canvas.getContext("2d"),t.appendChild(this.canvas),e.appendChild(t);const n=a.create("div",{class:"canvas-toolbar"}),o=a.create("button",{class:"btn-canvas-clear",type:"button"});return o.textContent="🧹 Wyczyść Płótno",o.addEventListener("click",()=>{this.canvasCtx&&this.canvasCtx.clearRect(0,0,this.canvas.width,this.canvas.height)}),n.appendChild(o),e.appendChild(n),e}_createPhpPreviewView(){const e=a.create("div",{class:"php-browser-preview-view viewport-scroll-y"}),r=a.create("div",{class:"php-browser-container"}),t=a.create("div",{class:"php-browser-bar"}),n=a.create("div",{class:"browser-dots"});n.appendChild(a.create("span",{class:"dot dot-red"})),n.appendChild(a.create("span",{class:"dot dot-yellow"})),n.appendChild(a.create("span",{class:"dot dot-green"})),t.appendChild(n);const o=a.create("div",{class:"browser-address-bar"});o.innerHTML='<span class="browser-protocol">http://</span>localhost:80/skrypt.php',t.appendChild(o);const i=a.create("button",{class:"browser-refresh-btn",type:"button",title:"Odśwież stronę w przeglądarce"});return i.innerHTML="🔄",i.addEventListener("click",async()=>{await this._executeCode(),this._switchTab("php-preview")}),t.appendChild(i),r.appendChild(t),this.phpPreviewViewport=a.create("div",{class:"php-browser-viewport viewport-scroll-y"}),this.phpPreviewViewport.innerHTML=`
            <div class="php-preview-placeholder">
                <div class="php-placeholder-icon">🌐</div>
                <div class="php-placeholder-title">Wirtualna Przeglądarka PHP</div>
                <div class="php-placeholder-desc">Uzupełnij kod w edytorze po lewej i kliknij <strong>▶ Uruchom Kod i Wykonaj Asercje</strong>, aby wygenerować stronę i podejrzeć efekt w przeglądarce.</div>
            </div>
        `,r.appendChild(this.phpPreviewViewport),e.appendChild(r),e}_createDomPreviewView(e){const r=a.create("div",{class:"dom-browser-preview-view viewport-scroll-y"}),t=a.create("div",{class:"dom-preview-toolbar"}),n=a.create("div",{class:"dom-preview-title"});n.innerHTML="🎯 <strong>Interaktywny Podgląd DOM</strong> — przetestuj działanie kodu przeciągając elementy myszką:",t.appendChild(n);const o=a.create("button",{class:"dom-preview-reset-btn",type:"button",title:"Przywróć stan początkowy elementów DOM"});return o.innerHTML="↺ <span>Zresetuj elementy</span>",o.addEventListener("click",()=>{this._resetDomSandbox(),this._bindDomEvents()}),t.appendChild(o),r.appendChild(t),this.domViewport=a.create("div",{class:"dom-preview-viewport native-html-preview"}),this.domViewport.innerHTML=e||"",r.appendChild(this.domViewport),r}_createHtmlReadonlyView(e){const r=a.create("div",{class:"dom-browser-preview-view viewport-scroll-y"}),t=a.create("div",{class:"dom-preview-toolbar"}),n=a.create("div",{class:"dom-preview-title"});n.innerHTML="📄 <strong>Makieta HTML (Tylko do odczytu)</strong> — zbadaj nazwy klas, identyfikatory i hierarchię znaczników:",t.appendChild(n),r.appendChild(t);const o=a.create("div",{class:"dom-html-readonly-container"}),i=a.create("pre",{class:"dom-html-readonly-pre"}),c=a.create("code",{class:"language-html"});return c.textContent=e||"<!-- Brak szablonu HTML -->",i.appendChild(c),o.appendChild(i),r.appendChild(o),r}_resetDomSandbox(){this.domViewport&&(this.domViewport.innerHTML=this.domHtml||"")}_bindDomEvents(){if(!(!this.domViewport||!this.model.code))try{const e={querySelector:t=>this.domViewport.querySelector(t),querySelectorAll:t=>this.domViewport.querySelectorAll(t),getElementById:t=>this.domViewport.querySelector(`#${t}`),addEventListener:(...t)=>document.addEventListener(...t),removeEventListener:(...t)=>document.removeEventListener(...t),createElement:(...t)=>document.createElement(...t)};new Function("document","window","container",`
                try {
                    ${this.model.code}
                } catch (e) {
                    console.warn('[DOM Sandbox Execution Error]:', e);
                }
            `)(e,window,this.domViewport)}catch(e){console.warn("[CodeRunnerWidget] Błąd wiązania zdarzeń DOM:",e)}}async _initMonaco(e){try{const r=await H(()=>import("./monaco-CMNtKCUQ.js").then(o=>o.e),__vite__mapDeps([0]));this.monaco=r,I(r);let t="javascript";this.model.language==="php"?t="php":this.model.language==="sql"&&(t="sql");const n=r.editor.createModel(this.model.code,t);this.editor=r.editor.create(e,{model:n,theme:document.documentElement.getAttribute("data-theme")==="dark"?"vs-dark":"vs-light",minimap:{enabled:!1},fontSize:13,fontFamily:'Consolas, "Courier New", monospace',automaticLayout:!0,tabSize:2,wordWrap:"on"}),this.editor.onDidChangeModelContent(()=>{this.model.code=this.editor.getValue()}),this.editor.addCommand(r.KeyMod.CtrlCmd|r.KeyCode.Enter,()=>{this._executeCode()})}catch(r){console.warn("[CodeRunnerWidget] Monaco fallback to textarea:",r);const t=a.create("textarea",{class:"code-runner-textarea"});t.value=this.model.code,e.appendChild(t),t.addEventListener("input",n=>{this.model.code=n.target.value}),this.editor={getValue:()=>t.value,layout:()=>{}}}}async _executeCode(){if(this.editor&&typeof this.editor.getValue=="function"&&(this.model.code=this.editor.getValue()),this.tabPanels["test-output"]&&this.activeTabId!=="php-preview"&&this.activeTabId!=="dom-preview"&&this._switchTab("test-output"),a.clear(this.outputWindow),this.model.requirements.length===0){this.outputWindow.innerHTML='<div class="console-error-box"><div class="error-head">⚠️ Błąd:</div><div class="error-body">Brak poprawnie wczytanych kryteriów zadania.</div></div>';return}const e=await this.model.evaluate();if(this.model.language==="php"&&this.phpPreviewViewport){const r=(this.model.htmlOutput||"").trim(),t=r.replace(/<[^>]*>/g,"").trim(),n=/<li\b/i.test(r),o=/<td\b/i.test(r),i=/<option\b/i.test(r),c=r.includes("<ul")&&!n||r.includes("<table")&&!o||r.includes("<select")&&!i;if(r&&!c&&(t.length>0||/<(img|canvas|iframe|svg)\b/i.test(r)))this.phpPreviewViewport.innerHTML=r;else if(c){const b=r.replace(/</g,"&lt;").replace(/>/g,"&gt;");this.phpPreviewViewport.innerHTML=`
                    <div class="php-preview-placeholder">
                        <div class="php-placeholder-icon">⏳</div>
                        <div class="php-placeholder-title">Wygenerowano pusty kontener HTML: <code>${b}</code></div>
                        <div class="php-placeholder-desc">
                            Twój skrypt PHP wygenerował znacznik kontenera, lecz nie zawiera on jeszcze żadnych danych wewnątrz.<br>
                            Uzupełnij kod w edytorze po lewej (np. pętlę <code>while</code> z elementami <code>&lt;li&gt;</code>) i kliknij <strong>▶ Uruchom Kod</strong>, aby zobaczyć wyrenderowaną listę.
                        </div>
                    </div>
                `}else r?this.phpPreviewViewport.innerHTML=r:this.phpPreviewViewport.innerHTML=`
                    <div class="php-preview-placeholder">
                        <div class="php-placeholder-icon">💡</div>
                        <div class="php-placeholder-title">Brak danych wyjściowych HTML</div>
                        <div class="php-placeholder-desc">Napisz kod generujący treść za pomocą <code>echo</code> i kliknij <strong>▶ Uruchom Kod</strong>.</div>
                    </div>
                `}if(this.model.language==="sql")if(this.model.executionError){const r=a.create("div",{class:"console-error-box"});r.innerHTML=`
                    <div class="error-head">⚠️ Błąd wykonania zapytania SQL:</div>
                    <div class="error-body"><code>${this.model.executionError}</code></div>
                    <div class="error-advice">🔍 Przełącz na zakładkę <strong>Baza Danych</strong>, aby sprawdzić dokładne nazwy kolumn i krotek.</div>
                `,this.outputWindow.appendChild(r)}else if(this.model.queryResultRows&&this.model.queryResultRows.length>0){const r=a.create("div",{class:"sql-table-output"});let t=`<div class="sql-title">📊 Wynik Wykonania Zapytania SQL (${this.model.queryResultRows.length} ${this.model.queryResultRows.length===1?"wiersz":"wiersze/wierszy"}):</div><div class="sql-table-wrap viewport-scroll-y"><table class="sql-table"><thead><tr>`;const n=Object.keys(this.model.queryResultRows[0]);n.forEach(o=>t+=`<th>${o}</th>`),t+="</tr></thead><tbody>",this.model.queryResultRows.forEach(o=>{t+="<tr>",n.forEach(i=>t+=`<td>${o[i]===null?"<em>NULL</em>":o[i]}</td>`),t+="</tr>"}),t+="</tbody></table></div>",r.innerHTML=t,this.outputWindow.appendChild(r)}else this.model.isAllPassed()?this.outputWindow.innerHTML='<div class="console-success">✔ Zapytanie wykonane pomyślnie.</div>':this.outputWindow.innerHTML='<div class="console-warning">⚠️ Zapytanie wykonane, lecz nie zwróciło żadnych krotek spełniających kryteria.</div>';else{if(this.model.testResults.length>0){const r=a.create("div",{class:"test-suite-results"});this.model.testResults.forEach((t,n)=>{const o=a.create("div",{class:`test-row ${t.passed?"test-passed":"test-failed"}`});o.innerHTML=`
                        <div class="test-status-icon">${t.passed?"✔":"✖"}</div>
                        <div class="test-details">
                            <div class="test-name">Test Algorytmu #${n+1}: ${t.name}</div>
                            <div class="test-values">
                                <span class="test-input">Input: <code>${JSON.stringify(t.input)}</code></span> | 
                                <span class="test-expected">Oczekiwano: <code>${JSON.stringify(t.expected)}</code></span> | 
                                <span class="test-actual">Zwrócono: <code>${JSON.stringify(t.actual)}</code></span>
                            </div>
                        </div>
                    `,r.appendChild(o)}),this.outputWindow.appendChild(r)}else this.model.isAllPassed()?this.outputWindow.innerHTML='<div class="console-success">Kod zweryfikowany pomyślnie.</div>':this.outputWindow.innerHTML='<div class="console-warning">Nie wszystkie kryteria zostały zaliczone.</div>';if(this.model.language==="php"){const r=a.create("div",{class:"php-preview-hint"});r.innerHTML="🌐 Wynik wygenerowanego HTML możesz podejrzeć w zakładce <strong>🌐 Render Przeglądarki (PHP)</strong>.",this.outputWindow.appendChild(r)}if(this.canvas&&this.canvasCtx)try{new Function("canvas","ctx",this.model.code)(this.canvas,this.canvasCtx)}catch(r){console.warn("[CodeRunnerWidget] Canvas execution error:",r)}this.hasDom&&this.domViewport&&(this._resetDomSandbox(),this._bindDomEvents())}this._renderChecklist(e),this.model.isAllPassed()&&!this.isUnlocked&&(this.isUnlocked=!0,this._handleSuccess())}_renderChecklist(e){a.clear(this.reqList),e.forEach(r=>{const t=a.create("li",{class:`req-item ${r.passed?"passed":"failed"}`}),n=a.create("span",{class:"req-icon"});n.textContent=r.passed?"✔":"✖";const o=a.create("div",{class:"req-content"}),i=a.create("span",{class:"req-text"});if(i.textContent=r.text,o.appendChild(i),!r.passed&&r.actual){const c=a.create("div",{class:"req-hint"});c.textContent=`↳ ${r.actual}`,o.appendChild(c)}t.appendChild(n),t.appendChild(o),this.reqList.appendChild(t)})}_handleSuccess(){const e=this.container.querySelector(".code-runner-status");e&&(e.textContent="Zaliczone! 🏆",e.classList.add("unlocked")),this.successBanner.classList.remove("hidden"),this.successBanner.classList.add("show"),this.successBanner.style.display="block",this.successBanner.hidden=!1;const r=new CustomEvent("unlocked",{bubbles:!0});this.container.dispatchEvent(r)}_injectStyles(){let e=document.getElementById("code-runner-styles");e||(e=a.create("style",{id:"code-runner-styles"}),document.head.appendChild(e)),e.textContent=`
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
        `,document.getElementById("code-runner-styles")||document.head.appendChild(e)}}export{V as default};
