# Kodowanie sygnału i media warstwy fizycznej

Karta sieciowa otrzymała z warstwy L2 ciąg bitów (`0` i `1`). Aby przesłać je przez kabel miedziany, światłowód lub powietrze, warstwa fizyczna (**L1**) zamienia bity na zmiany napięcia, światła albo fal radiowych.

---

## ⚡ 1. Oscyloskop L1: <code>10101010</code> vs <code>00000000</code> i zakłócenia EMI

Warstwa fizyczna (**L1**) przesyła wyłącznie zmiany napięcia lub światła. Na górnej linii oscyloskopu biegnie zmienny ciąg `10101010`, a na dolnej ciąg samych zer `00000000`. Obie linie przechodzą przez strefę zakłóceń **EMI** w środku. Przełączaj kodowanie i medium, żeby zobaczyć różnicę na własne oczy:

<data-line-coding-lab></data-line-coding-lab>

- **Przepływność (`bps`) vs Szybkość modulacji (`Baud`):** w **Manchesterze** każdy bit wymusza zmianę napięcia w połowie taktu ($10\text{ Mb/s} = 20\text{ MBaud}$). W **PAM5** (`1000BASE-T`) $5$ poziomów napięcia przenosi $2\text{ bity}$ na takt na każdej z $4$ par ($1000\text{ Mb/s} = 125\text{ MBaud}$).
- **Czas transmisji vs opóźnienie propagacji:** szybsze łącze skraca czas nadania ramki, ale impuls w miedzi i szkle zawsze biegnie z prędkością ok. $200\,000\text{ km/s}$.

---

## 📡 2. Fale Wi-Fi (2.4 / 5 / 6 GHz) i nakładanie się kanałów

Przetestuj na żywo, jak ściany żelbetowe tłumią fale `2.4 GHz`, `5 GHz` i `6 GHz` oraz dlaczego w zatłoczonym paśmie `2.4 GHz` tylko kanały `1`, `6` i `11` nie kolidują ze sobą:

<data-wifi-spectrum-lab></data-wifi-spectrum-lab>

| Pasmo       | Przenikanie przez ściany       | Kanały i tłok w eterze                                                         | Typowe zastosowanie                       |
| :---------- | :----------------------------- | :----------------------------------------------------------------------------- | :---------------------------------------- |
| **2.4 GHz** | Najlepsze (duży zasięg).       | Tylko **3** niepokrywające się kanały w Europie (`1, 6, 11`). Duże zakłócenia. | Czujniki IoT, zasięg za kilkoma ścianami. |
| **5 GHz**   | Średnie (ściany mocno tłumią). | Ponad 19 niepokrywających się kanałów.                                         | Laptopy, telefony, biuro i dom.           |
| **6 GHz**   | Najsłabsze (zwykle 1 pokój).   | Szerokie kanały ($160\text{--}320\text{ MHz}$) dla Wi-Fi 6E / 7.               | Najwyższa prędkość na krótkim dystansie.  |

> [!CAUTION]
> **Unikaj kanałów pośrednich w paśmie `2.4 GHz` (np. `2, 3, 4, 5`).**
> Kanał Wi-Fi ma szerokość $20\text{ MHz}$, a numery kanałów leżą co $5\text{ MHz}$. Ustawienie routera na kanale `3` nakłada sygnał na kanał `1` oraz `6` naraz. W paśmie `2.4 GHz` używaj wyłącznie kanałów **`1`, `6` lub `11`**.

Siłę sygnału podaje się w **dBm**: **`-45 dBm`** to bardzo silny sygnał przy routerze, **`-70 dBm`** to granica stabilnej pracy, a poniżej **`-80 dBm`** połączenie zrywa.

---

## 🔌 3. Osprzęt L1 w szafie rack, PoE i zarabianie modułu Keystone

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 16px 0;">
  <figure style="margin: 0; text-align: center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/patch-panel-keystone.jpg" alt="24-portowy patch panel Cat6 w szafie rack z przewodami krosowymi" style="width: 100%; height: 155px; object-fit: cover; border-radius: 8px;">
    <figcaption style="font-size: 0.85em; opacity: 0.85; margin-top: 6px;"><strong>Patch panel (L1):</strong> zakończenie stałego okablowania w ścianach</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/media-konwerter.jpg" alt="Gigabitowy media konwerter ze złączem RJ45 i wkładką światłowodową SFP" style="width: 100%; height: 155px; object-fit: cover; border-radius: 8px;">
    <figcaption style="font-size: 0.85em; opacity: 0.85; margin-top: 6px;"><strong>Media konwerter (L1):</strong> zamiana prądu (RJ-45) na światło (SFP)</figcaption>
  </figure>
</div>

- **Patch panel i gniazdo keystone:** stałe kable w ścianach (drut) kończy się gniazdami żeńskimi i wpina krótkie patchcordy (linka) do switcha.
- **Media konwerter:** zamienia sygnał elektryczny ze skrętki na impulsy światła w światłowodzie bez czytania adresów MAC ani IP.
- **Auto-MDI/MDIX:** współczesne porty same zamieniają pary `TX` z `RX`, więc nie trzeba już używać kabli krosowanych.
- **PoE (*Power over Ethernet*):** przesyłanie zasilania $48\text{ V}$ po skrętce razem z danymi do kamer IP, telefonów i punktów dostępowych Wi-Fi.

> [!CAUTION]
> **Aktywne PoE (`802.3af/at`) a pasywne PoE (`24 V`):**
> Standardowe PoE najpierw negocjuje zasilanie przed podaniem napięcia $48\text{ V}$, więc jest bezpieczne dla zwykłej karty sieciowej. Tanie zasilacze **Passive PoE** podają napięcie na sztywno bez pytania i potrafią uszkodzić port urządzenia, które nie obsługuje zasilania po skrętce.

### 🔨 Stanowisko praktyczne: Zarabianie patch panelu i modułu Keystone (T568B)

Zdejmij izolację z kabla UTP, przeciągnij 8 żył do właściwych noży szczelinowych IDC w dwóch rzędach zgodnie z nadrukiem T568B, dobij każdą nożem uderzeniowym Krone i zamknij klapkę:

<data-gate>
<data-keystone-punch-lab></data-keystone-punch-lab>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Fizyczny sufit prędkości kabla (twierdzenie Nyquista i Shannona-Hartleya)</span>
<span class="deep-dive-badge">FIZYKA &amp; MATEMATYKA L1</span>
</summary>
<div class="deep-dive-content">

Żaden protokół z warstw L2–L7 nie wyciśnie z przewodu lub pasma radiowego więcej danych, niż pozwala na to fizyka sygnału. Granicę tę opisują dwa prawa teorii informacji.

### 1. Granica pasma bez szumu (Nyquist)

Jeśli kanał ma szerokość pasma $B$ (w hercach) i używa $M$ różnych poziomów napięcia (symboli), maksymalna teoretyczna przepływność wynosi:

$$C = 2 \cdot B \cdot \log_2(M)$$

Zwiększanie liczby poziomów napięcia ($M$) pozwala upchnąć więcej bitów w jednym takcie. Ma to jednak cenę: im gęściej upakowane poziomy napięcia, tym łatwiej zakłócenie z zewnątrz zamieni jeden symbol w sąsiedni.

### 2. Granica w obecności szumu (Shannon-Hartley)

W prawdziwym kablu lub powietrzu zawsze występuje szum cieplny i zakłócenia. Claude Shannon wyznaczył twardy limit pojemności kanału ($C$ w bitach na sekundę):

$$C = B \cdot \log_2\left(1 + \frac{S}{N}\right)$$

gdzie $B$ to szerokość pasma w $\text{Hz}$, a $\frac{S}{N}$ (*Signal-to-Noise Ratio*, SNR) to stosunek mocy sygnału do mocy szumu.

**Przykład liczbowy dla kanału głosowego lub wąskiego łącza:**
- Szerokość pasma: $B = 3000\text{ Hz}$
- Stosunek sygnału do szumu: $\text{SNR} = 1000$ (ok. $30\text{ dB}$)

$$C = 3000 \cdot \log_2(1 + 1000) \approx 3000 \cdot 9{,}97 \approx 29\,900\text{ b/s} \approx 30\text{ kb/s}$$

**Co z tego wynika dla inżyniera:**
1. Aby przyspieszyć sieć w L1, trzeba albo **poszerzyć pasmo $B$** (dlatego skrętka Cat6A przenosi $500\text{ MHz}$ zamiast $100\text{ MHz}$, a Wi-Fi 7 używa kanałów $320\text{ MHz}$), albo **poprawić stosunek sygnału do szumu $\text{SNR}$** (ekranowanie S/FTP lub F/UTP, krótsze kable, światłowód odporny na pole elektromagnetyczne).
2. Gdy $\text{SNR}$ spada przez zakłócenia, karta sieciowa automatycznie obniża modulację (np. z `1000BASE-T` na `100BASE-TX`), aby zachować bezbłędny odczyt bitów.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Warstwa L1 używa **kodowania liniowego** (Manchester, 4B5B, PAM5), aby odbiornik nie stracił synchronizacji zegara przy długich ciągach zer.
- W Wi-Fi pasmo **2.4 GHz** daje większy zasięg przy tylko 3 niepokrywających się kanałach (`1, 6, 11`), natomiast **5 GHz** i **6 GHz** oferują większą przepustowość na krótszym dystansie.
- **Media konwertery**, **patch panele**, **Auto-MDI/MDIX** oraz **PoE** działają na poziomie fizycznego sygnału i okablowania bez zaglądania w nagłówki L2–L7.
- Maksymalną prędkość łącza ogranicza fizyka medium (szerokość pasma $B$ oraz stosunek sygnału do szumu $\text{SNR}$).
