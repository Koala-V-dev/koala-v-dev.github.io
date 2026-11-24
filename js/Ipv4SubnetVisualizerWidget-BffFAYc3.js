import{B as p}from"./BaseWidget-B7_ZohqD.js";import{U as t}from"./CourseHealthManager-BrI3ZEnZ.js";import{I as c}from"./Ipv4Engine-DQKdp7JR.js";import"./monaco-CMNtKCUQ.js";import"./ScrollManager-B3Qlvkl3.js";import"./markdown-BDRwxJm4.js";import"./katex-XbL3y5x-.js";class d{constructor(i={}){this.ip=i.ip||"192.168.1.15",this.cidr=i.cidr!==void 0?i.cidr:24,this.compareIp=i.compareIp||"192.168.1.50",this.activeTab=i.activeTab||"calculator",this.listeners=[]}subscribe(i){return typeof i=="function"&&this.listeners.push(i),()=>{this.listeners=this.listeners.filter(e=>e!==i)}}notify(i="change",e={}){const a=this.getState();for(const s of this.listeners)s({type:i,...a,...e})}getState(){const i=c.calculate(this.ip,this.cidr),e=c.isValidIp(this.compareIp)?c.compareSubnet(this.ip,this.compareIp,this.cidr):null;return{ip:this.ip,cidr:this.cidr,compareIp:this.compareIp,activeTab:this.activeTab,...i,comparison:e}}setIp(i){if(!c.isValidIp(i))throw new Error(`Niepoprawny format adresu IP: ${i}`);this.ip=i.trim(),this.notify("ip_change")}setCidr(i){const e=parseInt(i,10);if(isNaN(e)||e<1||e>30)throw new Error(`CIDR musi być w zakresie 1-30: ${i}`);this.cidr=e,this.notify("cidr_change")}setCompareIp(i){if(!c.isValidIp(i))throw new Error(`Niepoprawny format adresu IP porównywanego: ${i}`);this.compareIp=i.trim(),this.notify("compare_change")}setActiveTab(i){if(!["calculator","bitwise_and","comparison"].includes(i))throw new Error(`Nieznana zakładka: ${i}`);this.activeTab=i,this.notify("tab_change")}}class n extends p{static counter=0;static async create(i,e={}){const a=new n(i,e);return await a.mount(),a}constructor(i,e={}){super(i,e),this.id=`ipv4-subnet-visualizer-${++n.counter}`;const a=this.getOption("ip","192.168.1.15"),s=parseInt(this.getOption("cidr","24"),10);this.model=new d({ip:a,cidr:s}),this.unsubscribe=null}async mount(){this.escapeParagraphWrapper(),this.widgetElement=t.create("section",{class:"ipv4-subnet-widget",id:this.id,"aria-label":"Interaktywny kalkulator i symulator binarny adresacji IPv4 i CIDR","data-tab":this.model.activeTab});const i=t.create("div",{class:"ipv4-header"}),e=t.create("div",{class:"ipv4-title-group"});e.append(t.create("h4",{class:"ipv4-title",text:"🔢 Interaktywny symulator binarny IPv4 i masek CIDR"}),t.create("p",{class:"ipv4-subtitle",text:"Zrozum relację między prefiksem CIDR, 32-bitowym wektorem binarnym a operacją logiczną AND wyznaczającą adres sieci."})),this.tabSelector=t.create("div",{class:"ipv4-tabs-selector",role:"tablist","aria-label":"Wybór trybu analizy"}),this.tabCalc=this._createTabBtn("calculator","📊 Podsumowanie podsieci","Kalkulator parametrów"),this.tabBitwise=this._createTabBtn("bitwise_and","⚡ Operacja bitowa AND","Logika sprzętowa"),this.tabCompare=this._createTabBtn("comparison","⚖️ Test lokalności","LAN vs Brama"),this.tabSelector.append(this.tabCalc,this.tabBitwise,this.tabCompare),i.append(e,this.tabSelector),this.inputBar=t.create("div",{class:"ipv4-input-bar"}),this._buildInputBar(),this.binaryVectorSection=t.create("div",{class:"ipv4-vector-section"}),this._buildBinaryVectorSection(),this.tabViewContainer=t.create("div",{class:"ipv4-tab-views"}),this.viewCalc=t.create("div",{class:"ipv4-view ipv4-view-calc"}),this.viewBitwise=t.create("div",{class:"ipv4-view ipv4-view-bitwise"}),this.viewCompare=t.create("div",{class:"ipv4-view ipv4-view-compare"}),this.tabViewContainer.append(this.viewCalc,this.viewBitwise,this.viewCompare),this.infoPanel=t.create("div",{class:"ipv4-info-panel"}),this.examCallout=t.create("div",{class:"ipv4-exam-callout"}),this.infoPanel.append(this.examCallout),this.widgetElement.append(i,this.inputBar,this.binaryVectorSection,this.tabViewContainer,this.infoPanel),this.container.appendChild(this.widgetElement),this._attachEventListeners(),this.unsubscribe=this.model.subscribe(()=>{this._render()}),this._render()}_createTabBtn(i,e,a){const s=this.model.activeTab===i,r=t.create("button",{class:`ipv4-tab-btn ${s?"active":""}`,role:"tab","aria-selected":s?"true":"false",type:"button"});return r.append(t.create("span",{class:"ipv4-tab-title",text:e}),t.create("span",{class:"ipv4-tab-sub",text:a})),r.addEventListener("click",()=>{this.model.setActiveTab(i)}),r}_buildInputBar(){const i=t.create("div",{class:"ipv4-input-group"});i.append(t.create("label",{class:"ipv4-label",text:"Adres IPv4:",for:`${this.id}-ip-input`})),this.ipInput=t.create("input",{class:"ipv4-text-input",id:`${this.id}-ip-input`,type:"text",value:this.model.ip,"aria-label":"Wprowadź adres IPv4"}),i.append(this.ipInput);const e=t.create("div",{class:"ipv4-cidr-group"}),a=t.create("div",{class:"ipv4-cidr-header"});a.append(t.create("label",{class:"ipv4-label",text:"Maska CIDR:"}),this.cidrBadge=t.create("span",{class:"ipv4-cidr-badge",text:`/${this.model.cidr}`})),this.cidrSlider=t.create("input",{class:"ipv4-cidr-slider",type:"range",min:"8",max:"30",step:"1",value:String(this.model.cidr),"aria-label":"Suwak prefiksu CIDR"}),e.append(a,this.cidrSlider),this.inputBar.append(i,e)}_buildBinaryVectorSection(){const i=t.create("div",{class:"ipv4-vector-header"});i.append(t.create("span",{class:"ipv4-vector-title",text:"🧬 32-bitowy wektor binarny (Podział NetID vs HostID):"}),t.create("div",{class:"ipv4-vector-legend"},[t.create("span",{class:"legend-net",text:"■ Część sieci (NetID)"}),t.create("span",{class:"legend-host",text:"■ Część hosta (HostID)"})])),this.bitVectorDisplay=t.create("div",{class:"ipv4-bits-display","aria-live":"polite"}),this.binaryVectorSection.append(i,this.bitVectorDisplay)}_attachEventListeners(){this.ipInput.addEventListener("change",()=>{try{this.model.setIp(this.ipInput.value),this.ipInput.classList.remove("error")}catch{this.ipInput.classList.add("error")}}),this.cidrSlider.addEventListener("input",()=>{this.model.setCidr(this.cidrSlider.value)})}_render(){const i=this.model.getState();this.widgetElement.setAttribute("data-tab",i.activeTab),[{btn:this.tabCalc,key:"calculator",view:this.viewCalc},{btn:this.tabBitwise,key:"bitwise_and",view:this.viewBitwise},{btn:this.tabCompare,key:"comparison",view:this.viewCompare}].forEach(e=>{const a=i.activeTab===e.key;e.btn.classList.toggle("active",a),e.btn.setAttribute("aria-selected",a?"true":"false"),e.view.style.display=a?"block":"none"}),this.cidrBadge.textContent=`/${i.cidr} (${i.maskStr})`,this.cidrSlider.value=String(i.cidr),this._renderBitVector(i),i.activeTab==="calculator"?this._renderCalculatorView(i):i.activeTab==="bitwise_and"?this._renderBitwiseView(i):i.activeTab==="comparison"&&this._renderComparisonView(i),this._renderExamCallout(i)}_renderBitVector(i){this.bitVectorDisplay.innerHTML="";const e=i.ipBinary,a=i.cidr;for(let s=0;s<32;s++){if(s>0&&s%8===0){const l=t.create("span",{class:"ipv4-bit-dot",text:"."});this.bitVectorDisplay.append(l)}const r=s<a,o=t.create("span",{class:`ipv4-bit ${r?"bit-net":"bit-host"} ${s===a-1?"bit-split":""}`,text:e[s],title:`Bit ${s+1}: ${r?"Część sieci (NetID)":"Część hosta (HostID)"}`});this.bitVectorDisplay.append(o)}}_renderCalculatorView(i){this.viewCalc.innerHTML=`
            <div class="ipv4-summary-grid">
                <div class="ipv4-metric-card">
                    <span class="metric-label">Adres Sieci (Network ID)</span>
                    <strong class="metric-val highlight-cyan">${i.networkStr} /${i.cidr}</strong>
                    <span class="metric-sub">Identyfikator całej podsieci</span>
                </div>
                <div class="ipv4-metric-card">
                    <span class="metric-label">Maska podsieci</span>
                    <strong class="metric-val">${i.maskStr}</strong>
                    <span class="metric-sub">Wildcard: ${i.wildcardStr}</span>
                </div>
                <div class="ipv4-metric-card">
                    <span class="metric-label">Adres Rozgłoszeniowy (Broadcast)</span>
                    <strong class="metric-val highlight-amber">${i.broadcastStr}</strong>
                    <span class="metric-sub">Pakiety rozsyłane do wszystkich hostów</span>
                </div>
                <div class="ipv4-metric-card">
                    <span class="metric-label">Zakres użytecznych hostów</span>
                    <strong class="metric-val highlight-green">${i.firstHostStr} — ${i.lastHostStr}</strong>
                    <span class="metric-sub">Liczba użytecznych adresów: <strong>${i.usableHosts.toLocaleString()}</strong> (z ${i.totalHosts.toLocaleString()})</span>
                </div>
                <div class="ipv4-metric-card">
                    <span class="metric-label">Klasa historyczna</span>
                    <strong class="metric-val">Klasa ${i.classType}</strong>
                    <span class="metric-sub">Zgodnie z wartością 1. oktetu</span>
                </div>
                <div class="ipv4-metric-card">
                    <span class="metric-label">Przeznaczenie i zakres (RFC)</span>
                    <strong class="metric-val">${i.scopeType}</strong>
                    <span class="metric-sub">Status w architekturze sieci</span>
                </div>
            </div>
        `}_renderBitwiseView(i){this.viewBitwise.innerHTML=`
            <div class="ipv4-bitwise-container">
                <div class="bitwise-explanation">
                    Karta sieciowa lub procesor routera L3 wyznacza adres sieci sprzętowo w jednym takcie zegara, wykonując operację iloczynu logicznego <strong>Bitwise AND</strong>:
                </div>
                <div class="bitwise-table">
                    <div class="bitwise-row">
                        <span class="bitwise-label">Adres IP hosta:</span>
                        <code class="bitwise-code">${c.formatBinaryWithDots(i.ipBinary)}</code>
                        <span class="bitwise-dec">(${i.ip})</span>
                    </div>
                    <div class="bitwise-row bitwise-op">
                        <span class="bitwise-label">Maska podsieci:</span>
                        <code class="bitwise-code">${c.formatBinaryWithDots(i.maskBinary)}</code>
                        <span class="bitwise-dec">(${i.maskStr}) <strong>[ AND & ]</strong></span>
                    </div>
                    <div class="bitwise-divider"></div>
                    <div class="bitwise-row bitwise-result">
                        <span class="bitwise-label">Adres Sieci (NetID):</span>
                        <code class="bitwise-code highlight-cyan">${c.formatBinaryWithDots(i.networkBinary)}</code>
                        <span class="bitwise-dec highlight-cyan">(${i.networkStr})</span>
                    </div>
                </div>
                <div class="bitwise-rule-box">
                    <strong>Reguła logiczna AND:</strong> $1 land 1 = 1$, $1 land 0 = 0$, $0 land 0 = 0$. Wszędzie tam, gdzie w masce jest jedynka, bity IP przechodzą bez zmian. Gdzie w masce są zera, bity są zerowane, dając czysty adres sieci!
                </div>
            </div>
        `}_renderComparisonView(i){this.viewCompare.innerHTML="";const e=t.create("div",{class:"ipv4-compare-inputs"}),a=t.create("div",{class:"ipv4-input-group"});a.append(t.create("label",{class:"ipv4-label",text:"Porównaj z adresem docelowym (Host B):"}),this.compareInput=t.create("input",{class:"ipv4-text-input",type:"text",value:i.compareIp,"aria-label":"Drugi adres IP do porównania"})),e.append(a),this.compareInput.addEventListener("change",()=>{try{this.model.setCompareIp(this.compareInput.value)}catch{}});const s=i.comparison,r=t.create("div",{class:`ipv4-verdict-box ${s&&s.isSame?"verdict-same":"verdict-diff"}`});s&&(r.innerHTML=`
                <div class="verdict-header">
                    <strong>${s.isSame?"✅ TA SAMA PODSIEC LOKALNA (Local Subnet)":"⚠️ RÓŻNE PODSIECI (Remote Subnet)"}</strong>
                </div>
                <div class="verdict-details">
                    <div>Host A (${s.ipA}): Sieć <code>${s.netAStr} /${s.cidr}</code></div>
                    <div>Host B (${s.ipB}): Sieć <code>${s.netBStr} /${s.cidr}</code></div>
                </div>
                <div class="verdict-decision">
                    <strong>Decyzja stosu TCP/IP:</strong> ${s.deliveryMethod}
                </div>
            `),this.viewCompare.append(e,r)}_renderExamCallout(i){this.examCallout.innerHTML=`
            <strong>💡 Klucz do egzaminu INF.02 (Wzory i pułapki obliczeniowe):</strong>
            <ul>
                <li>Liczba wszystkich adresów w podsieci o prefiksie $/n$: $N = 2^{32-n}$.</li>
                <li>Liczba użytecznych hostów: $N_{host} = 2^{32-n} - 2$ (odejmujemy adres sieci – same zera na części hosta, oraz adres rozgłoszeniowy – same jedynki).</li>
                <li>Dla łączy punkt-punkt między routerami standardowo stosuje się prefiks <strong>/30</strong> ($2^{32-30} - 2 = 2$ hosty) z maską <code>255.255.255.252</code>.</li>
            </ul>
        `}destroy(){typeof this.unsubscribe=="function"&&(this.unsubscribe(),this.unsubscribe=null),super.destroy()}}export{n as default};
