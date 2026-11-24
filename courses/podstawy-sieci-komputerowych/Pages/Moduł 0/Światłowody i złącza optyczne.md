# Światłowody i złącza optyczne

Światłowód przesyła informacje jako impulsy fotonów uwięzione w rdzeniu ze szkła kwarcowego ($SiO_2$) dzięki zjawisku **całkowitego wewnętrznego odbicia**. Szkło jest dielektrykiem (nie przewodzi prądu), co zapewnia pełną izolację galwaniczną oraz stuprocentową odporność na zakłócenia elektromagnetyczne (*0 EMI*).

---

## 🔬 Jednomodowy (SMF) a wielomodowy (MMF)

Podział wynika ze stosunku średnicy rdzenia do długości fali światła:

![Porównanie światłowodu jednomodowego i wielomodowego](/public/courses/podstawy-sieci-komputerowych/Images/swiatlowod-smf-mmf.svg)

- **Jednomodowy** (*SMF - 9 µm*): Rdzeń ma średnicę $9\ \mu\text{m}$. Promień lasera biegnie wyłącznie w linii prostej w osi włókna. Brak odbić kątowych oznacza **brak dyspersji modalnej** (impulsy nie rozmywają się w czasie), umożliwiając zasięgi od $10\text{ km}$ do ponad $80\text{ km}$.
- **Wielomodowy** (*MMF - 50 µm*): Szeroki rdzeń $50\ \mu\text{m}$ pozwala diodzie LED lub laserowi VCSEL wprowadzać światło pod różnymi kątami. Promienie odbijają się od ścianek i docierają do odbiornika w różnym czasie (**dyspersja modalna**), co ogranicza zasięg do $300 - 550\text{ m}$.

Popularne złącza światłowodowe:
- <b>LC:</b> Małe złącze zatrzaskowe stosowane we wkładkach *SFP / SFP+*.
- <b>SC:</b> Kwadratowe złącze Push-Pull stosowane w zakończeniach abonenckich.
- <b>ST:</b> Okrągłe złącze z zamkiem bagnetowym spotykane w starszych instalacjach.

<div style="display:flex; flex-wrap:wrap; gap:16px; justify-content:center; margin: 14px 0;">
  <figure style="margin:0; text-align:center; max-width:260px;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/swiatlowod-zlacza-real.jpg" alt="Patchcord światłowodowy OM3 z wtykami LC i ST" style="width:100%; border-radius:8px; border:1px solid var(--border-color);" />
    <figcaption style="font-size:0.85em; color:var(--text-muted); margin-top:4px;">Patchcord OM3 (turkusowy) z wtykami <b>LC</b> (góra) i <b>ST</b> (dół)</figcaption>
  </figure>
  <figure style="margin:0; text-align:center; max-width:340px;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/spawarka-swiatlowodowa-real.jpg" alt="Spawarka światłowodowa podczas łączenia włókien" style="width:100%; border-radius:8px; border:1px solid var(--border-color);" />
    <figcaption style="font-size:0.85em; color:var(--text-muted); margin-top:4px;"><b>Spawarka światłowodowa:</b> łączenie włókien łukiem elektrycznym to precyzyjna praca pod kontrolą mikroskopu i kamer osiujących</figcaption>
  </figure>
</div>

---

## 🎨 Rozpoznawanie powłok patchcordów w serwerowni

W serwerowni rodzaj włókna rozpoznaje się po kolorze zewnętrznego płaszcza kabla:

![Kodowanie kolorami powłok kabli światłowodowych w serwerowni](/public/courses/podstawy-sieci-komputerowych/Images/swiatlowod-kolory-powlok.svg)

- <b>Żółty:</b> Światłowód **jednomodowy** (*SMF - OS1/OS2*, rdzeń $9\ \mu\text{m}$) do połączeń dalekosiężnych ($10 - 80+\text{ km}$).
- <b>Turkusowy (Aqua):</b> Światłowód wielomodowy **OM3** (rdzeń $50\ \mu\text{m}$, laser VCSEL, $10\text{ Gb/s}$ do $300\text{ m}$).
- <b>Fioletowy (Erika Violet):</b> Światłowód wielomodowy **OM4** (rdzeń $50\ \mu\text{m}$, $10\text{ Gb/s}$ do $550\text{ m}$).
- <b>Limonkowy (Lime Green):</b> Światłowód wielomodowy **OM5** (szerokopasmowy, wspiera SWDM4, centra danych do $400\text{ Gb/s}$).

---

## 🔍 Szlif ferruli: UPC (niebieski) a APC (zielony)

W miejscu złączenia dwóch włókien część światła odbija się od granicy ośrodków. Kąt zeszlifowania ceramicznej ferruli decyduje o kierunku fali odbitej:

![Porównanie szlifu czoła złącza UPC i APC](/public/courses/podstawy-sieci-komputerowych/Images/swiatlowod-upc-vs-apc.svg)

- <b>UPC (Ultra Physical Contact) - kolor NIEBIESKI:</b>  
  Czoło wtyku jest płaskie ($0^\circ$). Odbity promień wraca prosto w rdzeń do lasera. Tłumienność odbiciowa wynosi co najmniej $50\text{ dB}$. Wraca tylko ok. $0{,}001\%$ mocy (stąd zapis $-50\text{ dB}$).
- <b>APC (Angled Physical Contact) - kolor ZIELONY:</b>  
  Czoło wtyku jest ścięte pod kątem **$8^\circ$**. Odbity promień trafia w płaszcz (*cladding*) i tam wygasa. Tłumienność odbiciowa wynosi co najmniej $60\text{ dB}$ (zapis $\le -60\text{ dB}$). Do lasera wraca ponad 10 razy mniej światła niż w UPC. Jest to standard w sieciach **FTTH** i telewizji kablowej.

> [!CAUTION]
> <b>ZAKAZ ŁĄCZENIA: Nigdy nie łącz wtyku niebieskiego (UPC) ze złączem zielonym (APC)!</b>  
> Zderzenie płaskiej powierzchni $0^\circ$ ze ściętą $8^\circ$ oznacza kontakt wyłącznie w jednym ostrym punkcie krawędzi. Silny docisk sprężyny w adapterze **_trwale kruszy i rysuje ceramiczną ferrulę obu złączy_**, bezpowrotnie niszcząc kabel i gniazdo.

---

## 🧪 Stanowisko praktyczne: Spawanie światłowodu (Fusion Splicer)

Wykonaj pełną procedurę spawania dwóch włókien metodą **Drag & Drop** (od wsunięcia osłonki termokurczliwej i zdjęcia izolacji, przez czyszczenie IPA i cięcie gilotyną, aż po spawanie łukiem, wygrzanie w piecyku i odłożenie na tackę chłodzącą), aby odblokować kolejną lekcję:

<data-gate>
<data-fiber-lab></data-fiber-lab>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Falowód LP01, lasery DFB i wiele kanałów na jednym włóknie (DWDM)</span>
<span class="deep-dive-badge">OPTYKA FALOWA & DWDM</span>
</summary>
<div class="deep-dive-content">

### 1. Dlaczego $9\ \mu\text{m}$ w SMF nie jest „zwykłą cienką rurką”?

W światłowodzie wielomodowym ($50\ \mu\text{m}$) światło zachowuje się jeszcze niemal jak promienie z optyki geometrycznej, które odbijają się pod różnymi kątami. Gdy jednak zmniejszymy średnicę rdzenia do $9\ \mu\text{m}$, staje się ona porównywalna z długością fali światła podczerwonego ($1310\text{ nm}$ i $1550\text{ nm}$).

Z równań Maxwella dla falowodu cylindrycznego wynika, że poniżej pewnej wartości parametru znormalizowanej częstotliwości ($V < 2{,}405$) w rdzeniu może rozchodzić się **wyłącznie jeden mod elektromagnetyczny ($LP_{01}$)**. Dlatego światło nie ma fizycznie możliwości odbijania się pod innymi kątami i znika dyspersja modalna.

### 2. Matematyka tłumienności odbiciowej i lasery DFB

Tłumienność odbiciową (*Return Loss*) wyraża się jako:
$$RL = 10 \log_{10}\left(\frac{P_{\text{nadana}}}{P_{\text{odbita}}}\right)\ [\text{dB}]$$
Dla $RL = 50\text{ dB}$ (UPC) stosunek mocy wynosi $10^5$, czyli wraca $10^{-5}$ ($0{,}001\%$) mocy. Dla $RL = 60\text{ dB}$ (APC) wraca $10^{-6}$ ($0{,}0001\%$), czyli ponad $10\times$ mniej. W szybkich laserach **DFB (*Distributed Feedback*)** stosowanych w sieciach FTTH i dalekosiężnych odbita fala wracająca do wnęki lasera destabilizuje jego częstotliwość i wywołuje błędy bitowe.

### 3. Jedno włókno zamiast dziesiątek kabli (DWDM)

W sieciach szkieletowych nie ciągnie się osobnego włókna dla każdego łącza. Technologia **DWDM (*Dense Wavelength-Division Multiplexing*)** wpuszcza w jedno włókno SMF jednocześnie ponad $80$ wiązek laserowych o minimalnie różnych długościach fal (barwach w okolicach $1550\text{ nm}$). Ponieważ fale elektromagnetyczne o różnych częstotliwościach nie zakłócają się nawzajem w liniowym ośrodku szklanym, jedno cienkie włókno przenosi dziesiątki niezależnych kanałów $100\text{ Gb/s}$ naraz.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Światłowód jednomodowy (SMF)** ma rdzeń $9\ \mu\text{m}$, żółty płaszcz, brak dyspersji modalnej i służy do tras dalekosiężnych ($10 - 80+\text{ km}$).
- **Światłowód wielomodowy (MMF)** ma rdzeń $50\ \mu\text{m}$ (OM3 turkusowy do $300\text{ m}$, OM4 fioletowy do $550\text{ m}$ przy $10\text{ Gb/s}$) i służy do połączeń wewnątrz serwerowni.
- **Spawanie światłowodów** wymaga precyzyjnego wyrównania włókien pod mikroskopem i kamerami osiującymi w spawarce łukowej.
- **Złącza zielone APC ($8^\circ$)** kierują odbicie w płaszcz ($RL \ge 60\text{ dB}$) i pod żadnym pozorem nie wolno ich łączyć ze złączami niebieskimi **UPC ($0^\circ$)**, bo prowadzi to do mechanicznego pokruszenia ferruli.

---

<details>
<summary>📚 Źródła zdjęć użytych w lekcji (Wikimedia Commons)</summary>

- **Patchcord światłowodowy OM3 (LC / ST):** [Wikimedia Commons (MMF_optical.jpg)](https://commons.wikimedia.org/wiki/File:MMF_optical.jpg)
- **Spawarka światłowodowa:** [Wikimedia Commons (Optical_fiber_fusion_splicing_-_USDA.jpg)](https://commons.wikimedia.org/wiki/File:Optical_fiber_fusion_splicing_-_USDA.jpg)

</details>
