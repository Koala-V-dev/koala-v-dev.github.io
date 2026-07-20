const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["css/monaco.css"])))=>i.map(i=>d[i]);
import{_ as O}from"./monaco-CMNtKCUQ.js";import"./MonacoSetup-DjItL_5q.js";import{B as $}from"./BaseWidget-em7dHyf3.js";import{U as o}from"./TouchGestureService-BSLjpyLt.js";import{a as W}from"./ScrollManager-QveMOUhZ.js";import"./WidgetAccessibility-BUt_cS0v.js";import"./katex-ClxlXyPc.js";import"./markdown-CUzkdAAO.js";class H{constructor(e="",s="",t=[],a={}){this.html=e,this.css=s,this.cssReadonly=a.cssReadonly||"",this.cssReadonly=a.cssReadonly||"",this.readonlyFiles=a.readonlyFiles||{},this.cssReadonly&&!this.readonlyFiles.css&&(this.readonlyFiles.css=this.cssReadonly),this.requirements=t.map(n=>({...n,passed:!1})),this.forbidden=a.forbidden||["!important"],this.hasForbidden=!1,this.forbiddenMatched=[]}updateCode(e,s){this.html=e,this.css=s}evaluate(e){this.hasForbidden=!1,this.forbiddenMatched=[];const s=this.css.replace(/\/\*[\s\S]*?\*\//g,"");for(const a of this.forbidden)s.includes(a)&&(this.hasForbidden=!0,this.forbiddenMatched.push(a));this.hasStyleOrScriptInHtml=!1;const t=this.html.replace(/<!--[\s\S]*?-->/g,"");return/<style|<script/i.test(t)&&(this.hasStyleOrScriptInHtml=!0),e?(this.requirements.forEach(a=>{try{a.passed=this._checkRequirement(a,e)}catch(n){console.error(`[WebChallengeModel] Błąd asercji dla "${a.id}":`,n),a.passed=!1}}),this.requirements):this.requirements}isAllPassed(){return!this.hasForbidden&&!this.hasStyleOrScriptInHtml&&this.requirements.length>0&&this.requirements.every(e=>e.passed)}_checkRequirement(e,s){switch(e.type){case"contains":{const t=e.target==="css"?this.css:this.html;return(e.target==="css"?t.replace(/\/\*[\s\S]*?\*\//g,""):t.replace(/<!--[\s\S]*?-->/g,"")).includes(e.pattern)}case"not-contains":{const t=e.target==="css"?this.css:this.html;return!(e.target==="css"?t.replace(/\/\*[\s\S]*?\*\//g,""):t.replace(/<!--[\s\S]*?-->/g,"")).includes(e.pattern)}case"selector-exists":return s.querySelector(e.selector)!==null;case"selector-css":{const t=s.querySelector(e.selector);if(!t)return!1;const a=window.getComputedStyle(t),n=e.property;let r=e.value;if(n==="all"){const d=this.css.replace(/\/\*[\s\S]*?\*\//g,""),c=e.selector.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");return new RegExp(c+"\\s*\\{[^}]*\\ball\\s*:\\s*"+r+"\\b","i").test(d)}let l=a[n]||a.getPropertyValue(n);if(!l)return!1;if(r==="inherit"){const d=t.parentElement;if(!d)return!1;const c=window.getComputedStyle(d),h=c[n]||c.getPropertyValue(n);return l===h}if(n.toLowerCase().includes("color")){const d=this._normalizeColor(r,s),c=this._normalizeColor(l,s);return d===c}const p=d=>d.replace(/[\s"']/g,"").toLowerCase();return p(l)===p(r)}case"wcag-contrast":{const t=s.querySelector(e.selector);if(!t)return!1;const a=window.getComputedStyle(t),n=a.color;let r=a.backgroundColor,l=t.parentElement;for(;(r==="rgba(0, 0, 0, 0)"||r==="transparent")&&l;)r=window.getComputedStyle(l).backgroundColor,l=l.parentElement;(r==="rgba(0, 0, 0, 0)"||r==="transparent")&&(r="rgb(255, 255, 255)");const p=this._calculateContrast(n,r),d=parseFloat(e.min||4.5);return p>=d}default:return!1}}_normalizeColor(e,s){if(!e)return"";try{const t=s.createElement("div");t.style.color=e,s.body.appendChild(t);const a=window.getComputedStyle(t).color;return s.body.removeChild(t),a}catch{return e}}_calculateContrast(e,s){const t=r=>{const l=r.match(/\d+(\.\d+)?/g);if(!l)return 0;const p=parseFloat(l[0])/255,d=parseFloat(l[1])/255,c=parseFloat(l[2])/255,h=m=>m<=.03928?m/12.92:Math.pow((m+.055)/1.055,2.4);return .2126*h(p)+.7152*h(d)+.0722*h(c)},a=t(e),n=t(s);return(Math.max(a,n)+.05)/(Math.min(a,n)+.05)}}class j extends ${static async create(e,s={}){const t=new j(e,s);return await t.mount(),t}constructor(e,s={}){super(e,s),this.model=null,this.editor=null,this.monaco=null,this.monacoModels={},this.activeTab="css",this.debounceTimeout=null,this.isUnlocked=!1,this.themeListener=null}dispose(){super.dispose(),this.editor&&(typeof this.editor.dispose=="function"&&this.editor.dispose(),this.editor=null),this.themeListener&&(W.off("theme:changed",this.themeListener),this.themeListener=null)}async mount(){const e=Array.from(this.container.querySelectorAll("template"));this.templateOrder=e.map(i=>({type:i.getAttribute("data-type"),content:i.innerHTML.trim()})).filter(i=>i.type&&i.type!=="requirements");const s=this.container.querySelector('template[data-type="html"]'),t=this.container.querySelector('template[data-type="css"]'),a=this.container.querySelectorAll('template[data-type$="-readonly"]'),n=this.container.querySelector('template[data-type="requirements"]'),r=s?s.innerHTML.trim():"",l=t?t.innerHTML.trim():"",p={};a.forEach(i=>{const x=(i.getAttribute("data-type")||"css-readonly").replace("-readonly","");p[x]=i.innerHTML.trim()});let d=[];try{d=n?JSON.parse(n.innerHTML.trim()):[]}catch(i){console.error("[WebChallengeWidget] Błąd parsowania wymagań:",i)}this.model=new H(r,l,d,{readonlyFiles:p}),this._injectStyles();const c=o.create("div",{class:"web-challenge-container"}),h=o.create("div",{class:"web-challenge-header"}),m=o.create("div",{class:"web-challenge-title"});m.textContent="🛠️ Praktyczne Wyzwanie Kodowania";const M=o.create("div",{class:"web-challenge-status"});M.textContent="Status: W toku ⏳",h.appendChild(m),h.appendChild(M),c.appendChild(h);const v=o.create("div",{class:"web-challenge-body"}),u=o.create("div",{class:"web-challenge-left"}),E=o.create("div",{class:"column-title"});E.textContent="Edytor",u.appendChild(E);const C=o.create("div",{class:"web-challenge-tabs-top"});if(this.topTabsList=[],l){const i=o.create("button",{class:"web-challenge-tab",type:"button","data-tab":"css"});i.textContent="CSS (Edytor)",C.appendChild(i),this.topTabsList.push(i)}if(r){const i=o.create("button",{class:"web-challenge-tab",type:"button","data-tab":"html"});i.textContent="HTML (Edytor)",C.appendChild(i),this.topTabsList.push(i)}this.bottomTabsList=[];const g=Object.keys(this.model.readonlyFiles);this.topTabsList.length>0?(this.topTabsList[0].classList.add("active"),this.activeTab=this.topTabsList[0].getAttribute("data-tab")):g.length>0?this.activeTab=`${g[0]}-readonly`:this.activeTab="css",u.appendChild(C);const _=o.create("div",{class:"web-challenge-editor"});if(u.appendChild(_),g.length>0){const i=o.create("div",{class:"web-challenge-tabs-bottom"});g.forEach(b=>{const x=`${b}-readonly`,w=o.create("button",{class:"web-challenge-tab",type:"button","data-tab":x});this.activeTab===x&&w.classList.add("active");const P=b.toUpperCase();w.textContent=`${P} (Podgląd)`,i.appendChild(w),this.bottomTabsList.push(w)}),u.appendChild(i)}v.appendChild(u);const f=o.create("div",{class:"web-challenge-right"}),z=o.create("div",{class:"column-title"});z.textContent="Podgląd",f.appendChild(z);const k=o.create("div",{class:"web-challenge-preview-container"}),T=o.create("div",{class:"web-challenge-browser-header"}),y=o.create("div",{class:"browser-dots"});y.appendChild(o.create("span",{class:"dot dot-red"})),y.appendChild(o.create("span",{class:"dot dot-yellow"})),y.appendChild(o.create("span",{class:"dot dot-green"})),T.appendChild(y);const F=o.create("div",{class:"browser-url"});F.textContent="localhost:3000/exercise.html",T.appendChild(F),k.appendChild(T);const q=o.create("div",{class:"web-challenge-preview"});this.iframe=o.create("iframe",{class:"web-challenge-iframe",title:"Podgląd na żywo",sandbox:"allow-same-origin allow-scripts"}),q.appendChild(this.iframe),k.appendChild(q),f.appendChild(k);const L=o.create("div",{class:"web-challenge-info-panel"}),S=o.create("div",{class:"web-challenge-requirements"}),A=o.create("h4");A.textContent="Kryteria zaliczenia zadania:",S.appendChild(A),this.reqList=o.create("ul",{class:"web-challenge-req-list"}),S.appendChild(this.reqList),L.appendChild(S),this.alertBanner=o.create("div",{class:"web-challenge-alert hidden"}),L.appendChild(this.alertBanner),f.appendChild(L),v.appendChild(f),c.appendChild(v),this.iframe.addEventListener("load",()=>{this._updatePreviewAndCheck()}),this.successBanner=o.create("div",{class:"web-challenge-success-banner hidden"}),this.successBanner.innerHTML="🏆 <strong>Gratulacje!</strong> Wszystkie wymagania zostały spełnione. Brama została odblokowana!",c.appendChild(this.successBanner),this.container.replaceWith(c),await this._initEditor(_);const B=[...this.topTabsList,...this.bottomTabsList].filter(Boolean);this.topTabsList.forEach(i=>{const b=i.getAttribute("data-tab");i.addEventListener("click",()=>this._switchTab(b,B))}),this.bottomTabsList.forEach(i=>{const b=i.getAttribute("data-tab");i.addEventListener("click",()=>this._switchTab(b,B))}),this._updatePreviewAndCheck(),this.themeListener=i=>{const b=i==="dark"?"vs-dark":"vs-light";this.editor&&this.monaco&&this.monaco.editor.setTheme(b),this._updatePreviewAndCheck()},W.on("theme:changed",this.themeListener)}async _initEditor(e){try{const s=await O(()=>import("./monaco-CMNtKCUQ.js").then(n=>n.e),__vite__mapDeps([0]));this.monaco=s,this.monacoModels.css=s.editor.createModel(this.model.css,"css"),this.monacoModels.html=s.editor.createModel(this.model.html,"html"),Object.keys(this.model.readonlyFiles).forEach(n=>{const r=n==="js"?"javascript":n;this.monacoModels[`${n}-readonly`]=s.editor.createModel(this.model.readonlyFiles[n],r)});const t=this.monacoModels[this.activeTab]||this.monacoModels.css||this.monacoModels.html,a=this.activeTab.endsWith("-readonly");this.editor=s.editor.create(e,{model:t,readOnly:a,domReadOnly:a,theme:document.documentElement.getAttribute("data-theme")==="dark"?"vs-dark":"vs-light",minimap:{enabled:!1},scrollBeyondLastLine:!1,fontSize:13,fontFamily:'Consolas, "Courier New", monospace',fontLigatures:!1,pixelRatio:window.devicePixelRatio||1,lineNumbers:"on",lineNumbersMinChars:3,glyphMargin:!1,folding:!1,lineDecorationsWidth:0,stickyScroll:{enabled:!1},renderLineHighlight:"none",automaticLayout:!0,tabSize:2,wordWrap:"on",scrollbar:{vertical:"auto",horizontal:"auto"}}),this.editor.addCommand(s.KeyMod.CtrlCmd|s.KeyCode.KeyS,()=>{}),this.monacoModels.css.onDidChangeContent(()=>this._onCodeChanged()),this.monacoModels.html.onDidChangeContent(()=>this._onCodeChanged())}catch(s){console.warn("[WebChallengeWidget] Monaco fallback to textarea:",s);const t=o.create("textarea",{class:"web-challenge-textarea"});t.value=this.model.css,e.appendChild(t),t.addEventListener("input",a=>{this.activeTab==="css"?this.model.css=a.target.value:this.activeTab==="html"&&(this.model.html=a.target.value),this._onCodeChanged()}),this.editor={getValue:()=>t.value,setValue:a=>{t.value=a}}}}_switchTab(e,s){if(this.activeTab!==e){if(this.activeTab=e,s.forEach(t=>{t.getAttribute("data-tab")===e?t.classList.add("active"):t.classList.remove("active")}),this.editor&&this.editor.setModel){this.editor.setModel(this.monacoModels[e]);const t=e.endsWith("-readonly");this.editor.updateOptions({readOnly:t,domReadOnly:t})}else if(this.editor){let t="";if(e==="css")t=this.model.css;else if(e==="html")t=this.model.html;else if(e.endsWith("-readonly")){const a=e.replace("-readonly","");t=this.model.readonlyFiles[a]}this.editor.setValue(t),this.editor.readOnly=e.endsWith("-readonly")}}}_onCodeChanged(){this.editor&&this.editor.setModel&&(this.model.css=this.monacoModels.css.getValue(),this.model.html=this.monacoModels.html.getValue()),clearTimeout(this.debounceTimeout),this.debounceTimeout=setTimeout(()=>{this._updatePreviewAndCheck()},200)}_updatePreviewAndCheck(){const e=this.iframe.contentDocument||this.iframe.contentWindow.document;if(!e)return;const s=document.documentElement.getAttribute("data-theme")==="dark",t=s?"#0f172a":"#ffffff",a=s?"#f8fafc":"#1e293b";let n="",r="",l="";this.templateOrder&&this.templateOrder.length>0?this.templateOrder.forEach(d=>{const c=d.type;if(c==="css")n+=`
`+this.model.css;else if(c==="html")r+=`
`+this.model.html;else if(c&&c.endsWith("-readonly")){const h=c.replace("-readonly",""),m=this.model.readonlyFiles[h]||"";h==="css"?n+=`
`+m:h==="html"?r+=`
`+m:(h==="js"||h==="javascript")&&(l+=`
<script>${m}<\/script>`)}}):(n=(this.model.readonlyFiles.css||"")+`
`+this.model.css,r=(this.model.readonlyFiles.html||"")+`
`+this.model.html,(this.model.readonlyFiles.js||this.model.readonlyFiles.javascript)&&(l=`<script>${this.model.readonlyFiles.js||this.model.readonlyFiles.javascript}<\/script>`)),e.open(),e.write(`
            <!DOCTYPE html>
            <html lang="pl">
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        margin: 12px;
                        font-family: system-ui, -apple-system, sans-serif;
                        background-color: ${t};
                        color: ${a};
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }
                    ${n}
                </style>
                ${l}
            </head>
            <body>
                ${r}
            </body>
            </html>
        `),e.close();const p=this.model.evaluate(e);this._renderChecklist(p),this.model.isAllPassed()&&!this.isUnlocked&&(this.isUnlocked=!0,this._handleSuccess())}_renderChecklist(e){o.clear(this.reqList),e.forEach(t=>{const a=t.type==="not-contains",n=e.some(h=>h.type!=="not-contains"&&h.passed);let r=t.passed?"passed":"failed",l=t.passed?"✔":"✖";a&&t.passed&&!n&&(r="neutral",l="•");const p=o.create("li",{class:`req-item ${r}`}),d=o.create("span",{class:"req-icon"});d.textContent=l;const c=o.create("span",{class:"req-text"});c.textContent=t.text,p.appendChild(d),p.appendChild(c),this.reqList.appendChild(p)});const s=[];this.model.hasForbidden&&s.push("Nie używaj <code>!important</code>"),this.model.hasStyleOrScriptInHtml&&s.push("Należy separować strukturę, styl i logikę do dedykowanych plików."),s.length>0&&this.alertBanner?(this.alertBanner.innerHTML=s.map(t=>`⚠️ ${t}`).join("<br>"),this.alertBanner.classList.remove("hidden")):this.alertBanner&&this.alertBanner.classList.add("hidden")}_handleSuccess(){const e=document.querySelector(".web-challenge-status");e&&(e.textContent="Zaliczone! 🏆",e.classList.add("unlocked")),this.successBanner.classList.remove("hidden"),this.successBanner.classList.add("show");const s=new CustomEvent("unlocked",{bubbles:!0});this.iframe.dispatchEvent(s)}_injectStyles(){if(document.getElementById("web-challenge-styles"))return;const e=o.create("style",{id:"web-challenge-styles"});e.textContent=`
            .web-challenge-container {
                display: flex;
                flex-direction: column;
                background: var(--bg-layer-2, #1e293b);
                border: 1px solid var(--border-color, #334155);
                border-radius: 12px;
                overflow: hidden;
                margin: 24px 0;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
            }
            .web-challenge-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-layer-1, #0f172a);
                padding: 12px 18px;
                border-bottom: 1px solid var(--border-color, #334155);
            }
            .web-challenge-title {
                font-size: 14px;
                font-weight: 700;
                color: var(--text-color, #f1f5f9);
            }
            .web-challenge-status {
                font-size: 12px;
                font-weight: 600;
                color: var(--text-color, #e2e8f0);
                background: var(--bg-layer-3, #334155);
                padding: 4px 10px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            .web-challenge-status.unlocked {
                background: #16a34a;
                color: #ffffff;
            }
            .web-challenge-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1px;
                background: var(--border-color, #334155);
                min-height: 580px;
            }
            .web-challenge-left {
                background: var(--bg-layer-2, #1e293b);
                padding: 18px;
                display: flex;
                flex-direction: column;
                gap: 14px;
                height: 100%;
            }
            .web-challenge-tabs-top {
                display: flex;
                gap: 6px;
                border-bottom: 1px solid var(--border-color, #334155);
                padding-bottom: 8px;
            }
            .web-challenge-tabs-bottom {
                display: flex;
                gap: 6px;
                border-top: 1px solid var(--border-color, #334155);
                padding-top: 8px;
            }
            .column-title {
                font-size: 11px;
                text-transform: uppercase;
                color: var(--text-muted, #94a3b8);
                font-weight: 700;
                letter-spacing: 1px;
                margin-bottom: 4px;
            }
            .web-challenge-tab {
                background: transparent;
                border: none;
                color: var(--text-muted, #94a3b8);
                font-size: 12px;
                font-weight: 600;
                padding: 6px 12px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            .web-challenge-tab.active {
                background: var(--accent-color, #3b82f6);
                color: #ffffff;
            }
            .web-challenge-editor {
                border: 1px solid var(--border-color, #334155);
                border-radius: 6px;
                overflow: hidden;
                flex-grow: 1;
                min-height: 480px;
                background: var(--input-bg-color, #1e1e1e);
            }
            .web-challenge-textarea {
                width: 100%;
                height: 100%;
                background: var(--input-bg-color, #1e1e1e);
                color: var(--text-color, #ffffff);
                font-family: monospace;
                font-size: 13px;
                padding: 10px;
                border: none;
                resize: none;
                outline: none;
            }
            .web-challenge-right {
                background: var(--bg-layer-1, #0f172a);
                display: flex;
                flex-direction: column;
                gap: 1px;
            }
            .web-challenge-preview-container {
                display: flex;
                flex-direction: column;
                background: var(--bg-layer-1, #0f172a);
            }
            .web-challenge-info-panel {
                background: var(--bg-layer-2, #1e293b);
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 14px;
                border-top: 1px solid var(--border-color, #334155);
            }
            .web-challenge-readonly-section {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .web-challenge-readonly-section .readonly-title {
                font-weight: bold;
                color: var(--text-muted, #94a3b8);
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .web-challenge-requirements {
                background: var(--bg-layer-1, #0f172a);
                border: 1px solid var(--border-color, #334155);
                border-radius: 8px;
                padding: 14px;
            }
            .web-challenge-requirements h4 {
                font-size: 12px;
                color: var(--text-muted, #94a3b8);
                text-transform: uppercase;
                margin-top: 0;
                margin-bottom: 8px;
                letter-spacing: 0.5px;
            }
            .web-challenge-req-list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .req-item {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                font-size: 12.5px;
                color: var(--text-color, #cbd5e1);
            }
            .req-icon {
                font-weight: bold;
                flex-shrink: 0;
                font-size: 12px;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            .req-item.passed .req-icon {
                color: #22c55e;
            }
            .req-item.failed .req-icon {
                color: #ef4444;
            }
            .req-item.passed .req-text {
                color: var(--text-muted, #94a3b8);
                text-decoration: line-through;
            }
            .web-challenge-browser-header {
                background: var(--bg-layer-2, #1e293b);
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid var(--border-color, #334155);
            }
            .browser-dots {
                display: flex;
                gap: 6px;
            }
            .browser-dots .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
            }
            .browser-dots .dot-red { background: #ef4444; }
            .browser-dots .dot-yellow { background: #facc15; }
            .browser-dots .dot-green { background: #22c55e; }
            .browser-url {
                flex-grow: 1;
                background: var(--input-bg-color, #0f172a);
                color: var(--text-muted, #64748b);
                font-size: 11px;
                font-family: monospace;
                padding: 3px 8px;
                border-radius: 4px;
                border: 1px solid var(--border-color, #334155);
                text-align: center;
            }
            .web-challenge-preview {
                flex-grow: 1;
                background: #ffffff;
                display: flex;
            }
            .web-challenge-iframe {
                width: 100%;
                height: 100%;
                min-height: 380px;
                border: none;
                background: #ffffff;
            }
            .web-challenge-success-banner {
                background: #16a34a;
                color: #ffffff;
                padding: 12px;
                text-align: center;
                font-size: 13px;
                transition: max-height 0.3s ease-out;
            }
            .web-challenge-success-banner.hidden {
                display: none;
            }
            @media (max-width: 768px) {
                .web-challenge-body {
                    grid-template-columns: 1fr;
                    min-height: auto;
                }
                .web-challenge-editor {
                    min-height: 250px;
                }
                .web-challenge-preview {
                    min-height: 350px;
                }
            }
            .req-item.neutral .req-icon {
                color: var(--text-muted, #94a3b8);
            }
            .iPadShowKeyboard,
            [widgetid="editor.contrib.ShowKeyboardWidget"] {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
            }
            .web-challenge-alert {
                background: #7f1d1d;
                border: 1px solid #f87171;
                color: #fca5a5;
                padding: 10px 14px;
                border-radius: 6px;
                font-size: 12.5px;
                font-weight: 600;
                margin-top: 12px;
            }
            .web-challenge-alert.hidden {
                display: none;
            }
            .web-challenge-alert code {
                background: rgba(0, 0, 0, 0.3);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
                color: #fecaca;
            }
        `,document.head.appendChild(e)}}export{j as default};
