# Pętle L2, protokół STP i agregacja łączy LACP

Pojedynczy kabel między dwoma przełącznikami stanowi pojedynczy punkt awarii. Gdy administrator dla redundancji spina przełączniki drugim przewodem lub łączy trzy switche w trójkąt, bez odpowiednich zabezpieczeń sieć przestaje działać w ciągu ułamka sekundy.

Ramka Ethernet II **nie ma pola czasu życia (TTL)**, które w warstwie 3 chroni pakiety IP przed nieskończonym krążeniem. Każdą ramkę rozgłoszeniową (`FF:FF:FF:FF:FF:FF`) przełącznik powiela w kółko bez końca.

---

## ⚡ 1. Burza rozgłoszeniowa i niestabilność tablicy CAM

Gdy w topologii warstwy 2 istnieje zamknięta pętla fizyczna i wyłączony jest protokół STP:

1. **Burza rozgłoszeniowa (*Broadcast Storm*):** pojedyncze zapytanie ARP krąży w trójkącie przełączników, podwajając się przy każdym obiegu, aż wysyca $100\%$ przepustowości łączy i mocy CPU przełączników.
2. **Niestabilność tablicy CAM (*MAC Table Flapping*):** ten sam adres źródłowy `Source MAC` wpada do switcha na przemian przez dwa różne porty, więc tablica CAM nieustannie nadpisuje wpisy.

---

## 🌳 2. Protokół STP (IEEE 802.1D) i RSTP (IEEE 802.1w)

Protokół **STP** (*Spanning Tree Protocol*) logicznie rozcina pętle fizyczne, blokując wybrane porty zapasowe, ale zachowując je w gotowości na wypadek awarii kabla głównego. Przełączniki wymieniają w tym celu specjalne ramki kontrolne **BPDU** (*Bridge Protocol Data Unit*) co $2\text{ sekundy}$.

### 👑 Krok 1: Elekcja Root Bridge

Wszystkie przełączniki wybierają jeden wspólny punkt centralny drzewa: **Root Bridge**. Wygrywa przełącznik o **najniższym identyfikatorze Bridge ID (BID)**, który składa się z:

$$\text{Bridge ID} = \text{Priorytet (domyślnie } 32768\text{)} + \text{Adres MAC przełącznika}$$

- Jeśli wszystkie switche mają domyślny priorytet `32768`, Root Bridgem zostaje urządzenie o **najniższym adresie MAC**.
- Administrator obniża priorytet (np. na `4096`) na głównym przełączniku szkieletowym, aby wymusić optymalną ścieżkę ruchu.

### 🚦 Krok 2: Role portów i stany STP

Po wyłonieniu Root Bridge każdy przełącznik przypisuje swoim portom jedną z ról:

| Rola portu | Gdzie występuje | Zachowanie w ruchu danych |
| :--- | :--- | :--- |
| **Root Port (`RP`)** | Po jednym na każdym przełączniku poza Root Bridge | Port o **najniższym koszcie ścieżki** do Root Bridge (przekazuje ruch) |
| **Designated Port (`DP`)** | Wszystkie porty Root Bridge oraz po jednym porcie na każdym segmencie | Przekazuje ruch w stronę sieci oddalonych od Root Bridge |
| **Blocked / Alternate (`BLK`)** | Pozostałe porty tworzące pętlę | **Blokuje ruch danych** (przyjmuje tylko ramki BPDU na wypadek awarii) |

> [!TIP]
> **Koszt ścieżki STP (IEEE 802.1D / 802.1w) zależy od prędkości portu:**
> Im szybsze łącze, tym mniejszy koszt: `10 Gbps = 2`, `1 Gbps = 4`, `100 Mbps = 19`. Szybsza odmiana **RSTP (802.1w)** skraca czas przełączenia po awarii z $30\text{--}50\text{ s}$ (klasyczne STP) do poniżej $2\text{ sekund}$.

---

## 🧪 Laboratorium: Burza rozgłoszeniowa, elekcja STP i agregacja LACP

Uruchom transmisję Broadcast na `PC-A` przy wyłączonym STP, zatrzymaj pętlę tarczą `STP` lub przecięciem kabla, zmień priorytet wybranego przełącznika na `4096` oraz zepnij łącze `LACP Po1`:

<data-gate>
<data-stp-lacp-lab></data-stp-lacp-lab>
</data-gate>

---

## 🔗 3. Agregacja łączy LACP i EtherChannel (IEEE 802.3ad)

STP rozwiązuje problem pętli, ale ma jedną wadę: **marnuje przepustowość** drugiego kabla między dwoma przełącznikami, ustawiając go w stanie `BLK`.

Protokół **LACP** (*Link Aggregation Control Protocol*, IEEE 802.3ad / 802.1AX) łączy od 2 do 8 fizycznych kabli między dwoma urządzeniami w jeden logiczny interfejs **Port-Channel (`Po1`)**:
- STP widzi `Po1` jako **pojedyncze łącze** o niższym koszcie, więc nie blokuje żadnego z przewodów.
- Ruch rozkłada się równolegle na wszystkie aktywne kable (np. $2 \times 1\text{ Gbps} = 2\text{ Gbps}$).
- Jeśli jeden przewód ulegnie uszkodzeniu, ruch natychmiast przejmuje drugi bez przeliczania drzewa STP.

---

## 🛡️ 4. PortFast i BPDU Guard na portach dostępowych

Port, do którego podpięty jest zwykły komputer (nie switch), nie powinien czekać $30\text{ sekund}$ na przejście przez stany STP przed otrzymaniem adresu z DHCP.

- **PortFast (`spanning-tree portfast`):** przenosi port komputerowy od razu w stan przekazywania (*Forwarding*).
- **BPDU Guard (`spanning-tree bpduguard enable`):** natychmiast blokuje port (`err-disable`), jeśli podpięte urządzenie wyśle ramkę BPDU (np. uczeń wepnie w gniazdko mały switch i przypadkowo utworzy pętlę pod biurkiem).

---

## 🛠️ Samodzielna próba: Projekt drzewa STP i diagnoza pętli

Masz trzy przełączniki połączone w trójkąt łączami `1 Gbps`:
- `SW-Core`: priorytet `4096`, MAC `00:11:22:33:44:10`
- `SW-A`: priorytet `32768`, MAC `00:11:22:33:44:20`
- `SW-B`: priorytet `32768`, MAC `00:11:22:33:44:30`

1. Wskaż, który przełącznik zostanie **Root Bridgem** i uzasadnij dlaczego.
2. Na łączu między `SW-A` i `SW-B` wskaż, który z nich otrzyma rolę **Blocked (`BLK`)**, a który **Designated (`DP`)**.
3. Wyjaśnij, co się stanie, gdy na porcie `Fa0/5` przełącznika `SW-A` (z włączonym `PortFast` i `BPDU Guard`) ktoś podepnie niezarządzalny switch spięty dwoma kablami.

Kryteria ukończenia:
- Poprawne wyznaczenie Root Bridge na podstawie Bridge ID.
- Wskazanie portu zablokowanego między `SW-A` i `SW-B` na podstawie niższego MAC.
- Wskazanie przejścia portu `Fa0/5` w stan `err-disable`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

1. **Root Bridge:** zostanie nim **`SW-Core`**, ponieważ ma najniższy priorytet (`4096 < 32768`), a tym samym najniższy identyfikator Bridge ID.
2. **Łącze `SW-A` ↔ `SW-B`:** oba przełączniki mają ten sam koszt dotarcia do `SW-Core` (po jednym skoku `1 Gbps` = koszt `4`) i ten sam priorytet `32768`. Rozstrzyga niższy adres MAC: `SW-A` (`...:20`) wygrywa i jego port zostaje **Designated (`DP`)**, natomiast port na `SW-B` (`...:30`) przechodzi w stan **Blocked (`BLK`)**.
3. **PortFast + BPDU Guard:** po odebraniu pierwszej ramki BPDU na porcie `Fa0/5` mechanizm **BPDU Guard** natychmiast wyłączy port w stan `err-disable`, chroniąc całą sieć przed pętlą i zmianą topologii STP.

</details>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Ramka BPDU (01:80:C2:00:00:00), stany RSTP oraz haszowanie ruchu w LACP</span>
<span class="deep-dive-badge">IEEE 802.1w &amp; 802.3ad</span>
</summary>
<div class="deep-dive-content">

### 📡 1. Adres Multicast ramek BPDU i stany portów RSTP

Przełączniki wysyłają ramki BPDU w formacie IEEE 802.3 + LLC na specjalny adres Multicast **`01:80:C2:00:00:00`**. Adres ten jest zarezerwowany dla warstwy L2 i nigdy nie jest przekazywany dalej przez inne switche (trafia wyłącznie do bezpośredniego sąsiada na końcu kabla).

W klasycznym **STP (802.1D)** port przechodzi przez 5 stanów (`Disabled` → `Blocking` → `Listening` → `Learning` → `Forwarding`), co trwa nawet $50\text{ sekund}$. W **RSTP (802.1w)** uproszczono je do 3 stanów (`Discarding`, `Learning`, `Forwarding`) i wprowadzono natychmiastową negocjację *Proposal/Agreement* między sąsiadami.

### ⚖️ 2. Dlaczego jedno połączenie TCP w LACP nie przekroczy prędkości jednego kabla?

Gdy dwa switche spinają dwa kable `1 Gbps` w `Port-Channel 2 Gbps`, kontroler nie rozbija pojedynczej sesji na pół po jednym bajcie na kabel, ponieważ wywołałoby to dotarcie ramek w złej kolejności (*Out-of-Order Delivery*) i gwałtowny spadek wydajności TCP.

Zamiast tego LACP liczy funkcję skrótu (XOR) z adresów `src-dst-mac` lub `src-dst-ip`:
- Cały strumień między Hostem A i Serwerem 1 idzie zawsze kablem nr 1 (maks. `1 Gbps`).
- Równoległy strumień między Hostem B i Serwerem 2 idzie kablem nr 2 (kolejne `1 Gbps`).
Sumaryczna przepustowość całej grupy wynosi `2 Gbps`, ale pojedynczy transfer zamyka się w paśmie jednego fizycznego przewodu.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Ramka L2 nie ma pola **TTL**, dlatego fizyczna pętla między przełącznikami bez STP natychmiast wywołuje **burzę rozgłoszeniową** i migotanie tablicy CAM.
- **STP / RSTP** wybiera **Root Bridge** o najniższym **Bridge ID** (`Priorytet + MAC`), wyznacza porty **Root (`RP`)** i **Designated (`DP`)**, a nadmiarowe łącza ustawia w stan **Blocked (`BLK`)**.
- **LACP (802.3ad)** łączy równoległe przewody w jeden logiczny interfejs **Port-Channel**, sumując przepustowość i zapewniając odporność na awarię bez blokowania kabli przez STP.
- Na portach dostępowych dla komputerów stosuj **PortFast** wraz z **BPDU Guard**, aby przyspieszyć start połączenia i zablokować przypadkowe pętle.
