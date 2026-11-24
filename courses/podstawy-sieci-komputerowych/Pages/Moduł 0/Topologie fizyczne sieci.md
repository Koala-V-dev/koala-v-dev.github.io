# Topologie fizyczne sieci

Projektując sieć komputerową, musisz dopasować dwa elementy: **zasięg geograficzny** oraz **fizyczny układ połączeń (topologię)**. To od nich zależy koszt okablowania, łatwość rozbudowy oraz to, czy awaria jednego kabla odetnie tylko jedno stanowisko, czy całą firmę.

---

## 🌍 Zasięg geograficzny sieci teleinformatycznych (od PAN do WAN)

Skala przestrzenna decyduje o doborze technologii, kosztach budowy oraz o tym, czy infrastruktura jest własnością prywatną organizacji, czy usługą dzierżawioną od operatora telekomunikacyjnego:

![Klasyfikacja zasięgów sieci teleinformatycznych od PAN do WAN](/public/courses/podstawy-sieci-komputerowych/Images/zasiegi-sieci-pan-wan.svg)

| Typ sieci                                                             | Zasięg przestrzenny                                                      | Własność infrastruktury                              | Przykłady technologii                                                                                                 |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------------- | :--------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| **PAN** (*Personal Area Network*)                                     | Promień do $10\text{ m}$ wokół osoby.                                    | Własność prywatna użytkownika.                       | Bluetooth LE, NFC, Zigbee (smartwatch, słuchawki, telefon).                                                           |
| **LAN / WLAN** (*Local Area Network* / *Wireless Local Area Network*) | Pomieszczenie, biuro lub budynek (do $100\text{ m}$).                    | W $100\%$ prywatna własność organizacji.             | Skrętka miedziana Cat 6/6A, przełączniki, Access Pointy Wi-Fi 6/7 (*w panelach routerów często jako* _**Wireless**_). |
| **CAN** (*Campus Area Network*)                                       | Kompleks budynków (kampus uczelni, fabryka, szpital, $1 - 5\text{ km}$). | Prywatna infrastruktura danej instytucji.            | Własne trakty światłowodowe w ziemi łączące poszczególne budynki.                                                     |
| **MAN** (*Metropolitan Area Network*)                                 | Obszar miasta lub aglomeracji ($5 - 50\text{ km}$).                      | Operatorzy miejscy lub konsorcja miejskie.           | Miejskie ringi światłowodowe, sieci CCTV monitoringu, DOCSIS telewizji kablowej.                                      |
| **WAN** (*Wide Area Network*)                                         | Kraj, kontynent, połączenia transoceaniczne.                             | Dzierżawa od operatorów tranzytowych (*Tier 1 ISP*). | Kable podmorskie, łącza satelitarne, routery szkieletowe BGP. **Internet to największa sieć WAN.**                    |

---

## 📐 Cztery topologie fizyczne

Topologia fizyczna określa geometrię ułożenia kabli i węzłów w przestrzeni budynku lub pomiędzy serwerowniami:

<data-tabs>
  <tabs>
    <b>⭐ 1. Gwiazda (Star)</b>
    <b>🚌 2. Magistrala (Bus)</b>
    <b>⭕ 3. Pierścień (Ring)</b>
    <b>🕸️ 4. Siatka (Mesh)</b>
  </tabs>
  <div>

![Topologia fizyczna: Gwiazda](/public/courses/podstawy-sieci-komputerowych/Images/topologia-gwiazda.svg)

- <b>Punkt centralny:</b> W sieciach lokalnych rolę węzła centralnego pełni najczęściej przełącznik (**Switch**) lub domowy **Router** (z wbudowanym przełącznikiem). W rozległych sieciach szkieletowych routery łączą się natomiast w siatkę.
- <b>Izolacja awarii kabla:</b> Uszkodzenie pojedynczego przewodu końcowego odcina tylko stację podpiętą do tego konkretnego portu, nie zakłócając pracy pozostałych urządzeń.
- **_Pojedynczy punkt awarii (SPoF, Single Point of Failure):_** Element infrastruktury, którego usterka unieruchamia całą sieć. W topologii gwiazdy takim punktem jest centralny przełącznik lub router.

<div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:12px 0;">
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/switch-ethernet.jpg" alt="24-portowy przełącznik sieciowy D-Link DGS-1224T Gigabit Ethernet Switch" style="max-width:440px; width:100%; height:auto; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">24-portowy przełącznik sieciowy (Switch) z widocznymi portami RJ-45 oraz SFP</figcaption>
  </figure>
</div>

#### Przykład pozornej gwiazdy (koncentrator Hub)

Komputery wpięte do koncentratora (*Hub*) tworzą w pokoju fizyczną **gwiazdę**. Wewnątrz Hub jest jednak prostym rozgałęźnikiem elektrycznym, który zwiera wszystkie gniazda (stąd dioda **Col** sygnalizująca kolizję na panelu przednim). Logicznie taka sieć działa jak **jedna wspólna magistrala** w trybie wielodostępowym: każda stacja słyszy transmisję pozostałych, a jednoczesne nadawanie wywołuje **_kolizję_**.

<div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:12px 0;">
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/koncentrator-hub.jpg" alt="4-portowy koncentrator Ethernet Hub Netgear EN104TP z widoczną diodą kolizji Col" style="max-width:300px; width:100%; height:auto; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">Koncentrator Ethernet Hub (widoczna dioda kolizji Col)</figcaption>
  </figure>
</div>

  </div>
  <div>

![Topologia fizyczna: Magistrala](/public/courses/podstawy-sieci-komputerowych/Images/topologia-magistrala.svg)

Historyczny Ethernet 10BASE2 na cienkim kablu koncentrycznym:
- <b>Kabel koncentryczny (RG-58):</b> Przewód zbudowany z pojedynczej centralnej żyły miedzianej otoczonej warstwą izolatora, ekranem z oplotu oraz zewnętrznym płaszczem. Wszystkie stacje wpięte są do jednego wspólnego kabla za pomocą trójników BNC.
- <b>Rola terminatorów $50\ \Omega$:</b> Na obu fizycznych końcach kabla muszą znajdować się rezystory pochłaniace falę elektryczną. Brak terminatora wywołuje odbicie fali, które natychmiast paraliżuje całą komunikację.
- **_Brak odporności:_** Fizyczne przerwanie kabla w dowolnym miejscu przerywa obwód i powoduje śmierć całej sieci.

![Osprzęt magistrali 10BASE2: trójnik BNC i terminator 50 omów](/public/courses/podstawy-sieci-komputerowych/Images/bnc-trojnik-terminator.svg)

<div style="display:flex; gap:14px; flex-wrap:wrap; justify-content:center; margin:12px 0;">
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/kabel-koncentryczny.png" alt="Kabel koncentryczny RG-58 zakończony wtykiem BNC" style="max-width:220px; width:100%; height:160px; object-fit:cover; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">Kabel koncentryczny RG-58 (BNC)</figcaption>
  </figure>
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/bnc-trojnik-real.jpg" alt="Prawdziwy trójnik BNC do kabla koncentrycznego" style="max-width:220px; width:100%; height:160px; object-fit:cover; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">Trójnik BNC</figcaption>
  </figure>
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/bnc-terminator-real.jpg" alt="Prawdziwy terminator 50 omów ze złączem BNC" style="max-width:220px; width:100%; height:160px; object-fit:cover; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">Terminator 50 Ω (BNC)</figcaption>
  </figure>
</div>

  </div>
  <div>

![Topologia fizyczna: Pierścień](/public/courses/podstawy-sieci-komputerowych/Images/topologia-pierscien.svg)

Zamknięta pętla stosowana w standardach FDDI, Token Ring oraz sieciach przemysłowych:
- Każdy węzeł połączony jest fizycznie z dwoma bezpośrednimi sąsiadami.
- <b>Wymagania sprzętowe (NIC i MAU):</b> W bezpośredniej pętli (np. FDDI lub przemysłowy EtherCAT) każdy host potrzebuje dwóch portów (IN oraz OUT), czyli **dwuportowej karty sieciowej** albo dwóch osobnych kart NIC. W historycznym **IBM Token Ring** stacje miały jednoportową kartę podpiętą do urządzenia **MAU** (*Multistation Access Unit*), które dopiero wewnątrz spinało porty w pętlę i automatycznie omijało wyłączone stacje.
- <b>Kabel prosty czy krosowany:</b> Przy bezpośrednim spinaniu dwóch kart NIC w starszym sprzęcie 10/100 Mb/s bez funkcji *Auto-MDI/MDI-X* wymagana była **skrętka krosowana** (zamiana par nadawczej i odbiorczej). Współczesne interfejsy Gigabit Ethernet rozpoznają kierunek automatycznie i działają na kablu prostym.
- <b>Regeneracja sygnału:</b> Sygnał jest odbierany, regenerowany i przesyłany dalej przez każdą kolejną kartę na trasie.
- **_Podatność na przerwanie obwodu:_** W pojedynczym pierścieniu awaria jednej stacji lub kabla przerywa obwód pętli (standard FDDI rozwiązywał to za pomocą podwójnego przeciwbieżnego pierścienia światłowodowego).

<div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin:12px 0;">
  <figure style="margin:0; text-align:center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/token-ring-mau.jpg" alt="Koncentrator IBM 8228 MAU z portami RI (Ring In) i RO (Ring Out)" style="max-width:360px; width:100%; height:auto; border-radius:8px;">
    <figcaption style="font-size:0.85em; margin-top:4px;">IBM 8228 MAU (porty RI: Ring In oraz RO: Ring Out)</figcaption>
  </figure>
</div>

  </div>
  <div>

![Topologia fizyczna: Pełna siatka](/public/courses/podstawy-sieci-komputerowych/Images/topologia-siatka.svg)

Układ o maksymalnej odporności na awarie stosowany w szkieletach WAN (między **routerami**) oraz w centrach danych:
- <b>Pełna siatka (Full Mesh):</b> Każdy węzeł posiada fizyczne połączenie z każdym innym węzłem. Brak pojedynczego punktu awarii (SPoF). Liczbę wymaganych kabli określa wzór:
  $$L = \frac{N(N - 1)}{2}$$
  Dla 4 węzłów potrzeba 6 kabli, lecz dla 10 węzłów już 45 połączeń, co drastycznie podnosi koszt.
- <b>Częściowa siatka (Partial Mesh):</b> Bezpośrednie zapasowe (redundantne) łącza zestawia się wyłącznie między najważniejszymi routerami rdzeniowymi, a węzły brzegowe podpina tylko wybranymi połączeniami.

![Topologia fizyczna: Częściowa siatka (Partial Mesh)](/public/courses/podstawy-sieci-komputerowych/Images/topologia-siatka-czesciowa.svg)

  </div>
</data-tabs>

---

## 📊 Porównanie i dobór topologii w praktyce

W prawdziwych budynkach i sieciach operatorów niemal nigdy nie stosuje się jednego „czystego” wzorca w całej firmie. Zamiast tego łączy się topologie warstwowo:

| Topologia               | Liczba kabli dla $N$ hostów | Skutek przerwania 1 kabla                  | Główny słaby punkt (SPoF)                          | Gdzie spotkasz ją dzisiaj?                                  |
| :---------------------- | :-------------------------: | :----------------------------------------- | :------------------------------------------------- | :---------------------------------------------------------- |
| **Gwiazda (Star)**      |             $N$             | Odcięty jest tylko 1 host.                 | Centralny switch lub router.                       | Niemal wszystkie sieci biurowe i domowe LAN.                |
| **Magistrala (Bus)**    |      $1$ wspólna szyna      | Pada cała sieć (przerwany obwód).          | Główny kabel i brak terminatora $50\ \Omega$.      | Rozwiązanie historyczne (10BASE2) oraz szyny przemysłowe.   |
| **Pierścień (Ring)**    |    $N$ (pętla zamknięta)    | W pojedynczym pierścieniu pada cała pętla. | Przerwanie obwodu (chyba że działa podwójny ring). | Miejskie sieci światłowodowe MAN i automatyka przemysłowa.  |
| **Pełna siatka (Mesh)** |     $\frac{N(N-1)}{2}$      | Ruch płynie natychmiast trasą zapasową.    | Brak pojedynczego punktu awarii.                   | Szkielet Internetu (WAN) oraz połączenia w centrach danych. |

- **Rozszerzona gwiazda (Extended Star / Hierarchiczna):** W dużych szkołach i biurowcach switche piętrowe łączą się z głównym switchem rdzeniowym w serwerowni, tworząc drzewo gwiazd.
- **Siatka w rdzeniu, gwiazda na brzegu:** Routery brzegowe lub switche dostępowe łączą się ze sobą w siatkę (często częściową), aby awaria jednej linii światłowodowej nie odcięła całego oddziału.

---

## 🧪 Symulator awarii i odporności topologii

Przetestuj każdą topologię w praktyce. Klikaj przewody, stacje robocze, przełącznik lub terminatory $50\ \Omega$, aby zobaczyć, jak awaria zmienia osiągalność hostów:

<data-gate>
<data-physical-topology></data-physical-topology>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Teoria grafów, k-spójność i dlaczego gwiazda nie znosi pętli</span>
<span class="deep-dive-badge">TEORIA GRAFÓW & INŻYNIERIA L2</span>
</summary>
<div class="deep-dive-content">

Dla inżyniera sieci topologia fizyczna to po prostu graf nieskierowany $G = (V, E)$, gdzie $V$ to węzły (urządzenia), a $E$ to fizyczne kable. Właściwości tego grafu bezpośrednio przekładają się na koszty i niezawodność.

### 1. Dlaczego Full Mesh skaluje się kwadratowo ($O(N^2)$)?

W pełnej siatce każdy z $N$ routerów potrzebuje $N - 1$ portów i osobnych kabli. Ponieważ kabel między $A$ i $B$ jest tym samym kablem co między $B$ i $A$, dzielimy wynik przez $2$:
$$|E| = \frac{N(N - 1)}{2}$$
Dla $4$ routerów to tylko $6$ kabli. Dla $50$ routerów potrzeba już $\frac{50 \cdot 49}{2} = 1225$ łączy i $49$ wolnych portów w każdym routerze. Dlatego w sieciach WAN powyżej kilkunastu węzłów stosuje się **Partial Mesh** lub architekturę **Spine-Leaf** w centrach danych.

### 2. Odporność jako $k$-spójność krawędziowa grafu

Miarą odporności sieci na przecięcie kabla jest **spójność krawędziowa** $\lambda(G)$ (lambda(G) minimalna liczba krawędzi, które trzeba usunąć, aby rozdzielić graf na dwie nieskomunikowane części):
- **Gwiazda (drzewo):** $\lambda(G) = 1$. Usunięcie dowolnej krawędzi odcina co najmniej jeden węzeł.
- **Pojedynczy pierścień:** jako graf nieskierowany ma $\lambda(G) = 2$ (traktując go dwukierunkowo), lecz klasyczny jednokierunkowy Token Ring wymaga zamkniętej pętli, więc spada do odporności $1$.
- **Pełna siatka ($K_N$):** $\lambda(G) = N - 1$. Dopiero jednoczesne przecięcie $N - 1$ kabli izoluje jeden węzeł od reszty sieci.

### 3. Pułapka zapasowego kabla w warstwie 2 (Broadcast Storm)

Jeśli w topologii gwiazdy z dwoma switchami wepniesz drugi kabel „na zapas” między tymi samymi switchami, utworzysz fizyczną pętlę. Ponieważ przełączniki L2 rozsyłają ramki rozgłoszeniowe (*Broadcast*) na wszystkie porty poza źródłowym, jedna ramka ARP zacznie krążyć w pętli w nieskończoność, wysycając $100\%$ pasma w ułamku sekundy (**Broadcast Storm**). Aby bezpiecznie łączyć zalety siatki i gwiazdy na poziomie L2, switche uruchamiają protokół **STP (*Spanning Tree Protocol*)**, który programowo blokuje nadmiarową ścieżkę i odblokowuje ją dopiero po awarii głównego kabla.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Sieci klasyfikuje się według zasięgu na **PAN** (do $10\text{ m}$), **LAN/WLAN** (do $100\text{ m}$), **CAN** (kampus), **MAN** (miasto) i **WAN** (kraj/świat, np. Internet).
- **Topologia gwiazdy** ze switchem jest dziś standardem w sieciach LAN, ponieważ awaria pojedynczego kabla stacji nie wpływa na pozostałe komputery, a jedynym SPoF pozostaje sam przełącznik.
- **Magistrala (10BASE2)** wymaga obu terminatorów $50\ \Omega$, ponieważ brak terminatora wywołuje odbicie fali i paraliż całej sieci.
- **Pełna siatka (Full Mesh)** eliminuje pojedynczy punkt awarii kosztem liczby kabli rosnącej według wzoru $L = \frac{N(N-1)}{2}$.

---

<details>
<summary>📚 Źródła zdjęć użytych w lekcji (Wikimedia Commons)</summary>

- **Przełącznik D-Link DGS-1224T:** [Wikimedia Commons (D-Link_DGS-1224T.jpg)](https://commons.wikimedia.org/wiki/File:D-Link_DGS-1224T.jpg)
- **Koncentrator Netgear EN104TP (Hub):** [Wikimedia Commons (4_port_netgear_ethernet_hub.jpg)](https://commons.wikimedia.org/wiki/File:4_port_netgear_ethernet_hub.jpg)
- **Kabel koncentryczny RG-58:** [Wikimedia Commons (10base2_cable.png)](https://commons.wikimedia.org/wiki/File:10base2_cable.png)
- **Trójnik BNC:** [Wikimedia Commons (BNC-T.jpg)](https://commons.wikimedia.org/wiki/File:BNC-T.jpg)
- **Terminator BNC 50 Ω:** [Wikimedia Commons (10base2_BNC_Terminator.jpg)](https://commons.wikimedia.org/wiki/File:10base2_BNC_Terminator.jpg)
- **IBM 8228 MAU (Token Ring):** [Wikimedia Commons (IBM_8228_Multistation_Access_Unit.JPG)](https://commons.wikimedia.org/wiki/File:IBM_8228_Multistation_Access_Unit.JPG)

</details>
