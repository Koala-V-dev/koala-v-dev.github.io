# Topologie logiczne i transmisja sygnału

Nawet gdy wszystkie komputery są wpięte kablami w kształt gwiazdy, wewnątrz sieci mogą działać jak na jednym wspólnym przewodzie albo jak na niezależnych łączach punkt-punkt. To, którędy naprawdę płyną bity i kto w danym momencie ma prawo nadawać, zależy od topologii logicznej, trybu dupleksu i zasad dostępu do medium.

---

## 🧠 Topologie logiczne i transmisja sygnału

Topologia logiczna opisuje rzeczywistą ścieżkę przepływu danych między nadawcą a odbiorcą oraz zasady dostępu do nośnika, niezależnie od fizycznego ułożenia kabli w budynku:

- <b>Punkt-Punkt (Point-to-Point):</b> Dedykowany kanał łączący bezpośrednio dwa węzły, bez rywalizacji i bez kolizji.
- <b>Wielodostęp (Multiaccess):</b> Wspólne medium dla wielu stacji, w którym jednoczesne nadawanie wywołuje kolizję sygnałów.
- <b>Pierścień (Token Ring):</b> Zamknięta pętla z przekazywaniem żetonu, w której prawo do transmisji ma tylko jedna stacja w danej chwili.

<data-logical-topology></data-logical-topology>

### 🧩 Trzy modele logicznego przepływu danych

<data-tabs>
  <tabs>
    <b>🎯 Punkt-Punkt (Point-to-Point)</b>
    <b>📢 Wielodostęp (Multiaccess)</b>
    <b>🔄 Pierścień (Token Passing)</b>
  </tabs>
  <div>

Dedykowany, zamknięty kanał łączący bezpośrednio dwa węzły:
- <b>Brak rywalizacji:</b> Łącze na wyłączność. Cokolwiek wyśle węzeł A, trafia wyłącznie do węzła B.
- <b>Brak kolizji:</b> Brak stacji trzecich eliminuje **_kolizje_** i konieczność walki o dostęp do nośnika.
- <b>Adresowanie:</b> Nie wymaga adresowania pośredniego.
- <b>Zastosowania:</b> Łącza światłowodowe między routerami dostawców internetu (*WAN*), bezpośrednie połączenie portu przełącznika z hostem oraz połączenie serwera z macierzą dyskową.

  </div>
  <div>

Wszystkie hosty współdzielą to samo medium transmisyjne:
- <b>Wspólny nośnik:</b> Sygnał nadany przez jedną stację dociera fizycznie do wszystkich kart sieciowych w danym segmencie (*Broadcast*).
- <b>Filtracja adresów MAC:</b> Każda karta odczytuje nagłówek ramki. Jeśli docelowy adres MAC nie należy do niej ani nie jest adresem rozgłoszeniowym, karta ignoruje dane.
- <b>Ryzyko kolizji:</b> Jednoczesne nadawanie przez dwie stacje nakłada sygnały i niszczy bity (**_kolizja_**). Wymaga procedur arbitrażu *CSMA/CD* lub *CSMA/CA*.
- <b>Zastosowania:</b> Sieci bezprzewodowe Wi-Fi, historyczny Ethernet na kablu koncentrycznym lub koncentratorze (*Hub*).

  </div>
  <div>

Dane krążą w zamkniętej pętli sekwencyjnie od węzła do węzła:
- <b>Kontrola żetonem:</b> Po sieci krąży specjalna ramka kontrolna zwana **żetonem** (*Token*). Stacja ma prawo nadawać wyłącznie po przechwyceniu wolnego żetonu.
- <b>Determinizm czasowy:</b> Z góry wiadomo, ile milisekund dana stacja czeka na swoją kolej. Brak jakichkolwiek kolizji.
- <b>Zastosowania:</b> Sieci przemysłowe czasu rzeczywistego (*Profibus* na liniach produkcyjnych), historyczne standardy Token Ring (*IBM*) oraz FDDI.

  </div>
</data-tabs>

---

## 🚦 Tryby transmisji: Simplex, Half-Duplex i Full-Duplex

Zdolność łącza do jednoczesnej wymiany informacji w obu kierunkach określa tryb dupleksu:

<data-duplex-simulator></data-duplex-simulator>

### 📊 Porównanie trybów pracy łącza

| Tryb transmisji |                                  Kierunek przepływu                                  | Jednoczesność       | Ryzyko kolizji                 | Fizyczna realizacja        | Przykłady w IT                                   |
| :-------------- | :----------------------------------------------------------------------------------: | :------------------ | :----------------------------- | :------------------------- | :----------------------------------------------- |
| **Simplex**     |        Jeden kierunek <br><span style="text-wrap: nowrap;">($A \to B$)</span>        | Jednokierunkowy     | **Brak** (brak toru zwrotnego) | Jeden tor nadawczy         | Telewizja DVB-T, radio FM, telemetria IoT        |
| **Half-Duplex** | W obie strony <br><span style="text-wrap: nowrap;">($A \to B$ oraz $B \to A$)</span> | **_Naprzemiennie_** | **_Ryzyko czołowej kolizji_**  | Jeden współdzielony tor    | Koncentrator (*Hub*), kabel koncentryczny, Wi-Fi |
| **Full-Duplex** | W obie strony <br><span style="text-wrap: nowrap;">($A \to B$ oraz $B \to A$)</span> | **Jednocześnie**    | **Zero kolizji**               | Odseparowane linie Tx i Rx | Przełącznik (*Switch*), światłowód               |

- <b>Simplex</b>
  - Brak toru zwrotnego uniemożliwia odbiornikowi (*Rx*) przesłanie potwierdzenia odbioru (*ACK*) oraz zgłoszenie błędu sumy kontrolnej.
- <b>Half-Duplex</b>
  - W danej chwili jedna stacja nadaje (*Tx*), a pozostałe wyłącznie odbierają (*Rx*).
  - Jednoczesna emisja powoduje superpozycję fal elektrycznych, niszczącą sumę kontrolną FCS/CRC odebranej ramki.
- <b>Full-Duplex</b>
  - Tory *Tx* i *Rx* działają na osobnych parach miedzianych (np. w skrętce kat. 5e/6) lub osobnych włóknach światłowodowych w trybie punkt-punkt.
  - Interfejs $1\text{ Gb/s}$ jednocześnie wysyła $1\text{ Gb/s}$ w kanale Tx i odbiera $1\text{ Gb/s}$ w kanale Rx, co daje łączną przepustowość sumaryczną $2\text{ Gb/s}$.

---

## ⚔️ Kontrola dostępu do medium: CSMA/CD a CSMA/CA

Gdy wiele urządzeń współdzieli jeden tor pracujący w trybie półdupleksu (*Half-Duplex*), potrzebny jest protokół rozstrzygający prawo do nadawania:

<data-csmacd-simulator></data-csmacd-simulator>

> [!IMPORTANT]
> Na współczesnych przełącznikach (*Switch*) pracujących w trybie **Full-Duplex** algorytm **CSMA/CD** jest sprzętowo wyłączony, ponieważ odseparowane tory Tx i Rx fizycznie uniemożliwiają powstanie kolizji.

### 📡 Dlaczego Wi-Fi (IEEE 802.11) używa CSMA/CA zamiast CSMA/CD
- <b>Oślepienie odbiornika:</b> Własny nadajnik stacji generuje sygnał radiowy tysiące razy silniejszy niż fale docierające z zewnątrz, więc w trakcie nadawania karta nie jest w stanie wykryć kolizji.
- <b>Problem ukrytego węzła:</b> Stacje w zasięgu tego samego punktu dostępowego (<b>AP</b>) często nie słyszą się nawzajem przez przeszkody lub odległość, dlatego przed transmisją wymagana jest rezerwacja kanału (RTS/CTS).
- <b>Obowiązkowe potwierdzenia ACK:</b> Ze względu na losowe zakłócenia w eterze każda poprawnie odebrana ramka danych w Wi-Fi musi zostać potwierdzona ramką ACK, a jej brak wymusza retransmisję.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Matematyka algorytmu Truncated Binary Exponential Backoff</span>
<span class="deep-dive-badge">HARDWARE & MAC</span>
</summary>
<div class="deep-dive-content">

Gdy kontroler Ethernetu wykryje kolizję, losuje czas oczekiwania w oparciu o jednostkę zwaną **szczeliną czasową** (*Slot Time*).

1. <b>Wartość szczeliny czasowej:</b>  
   Dla sieci $10\text{ Mb/s}$ szczelina odpowiada czasowi przesłania minimalnej dozwolonej ramki Ethernetu ($512$ bitów = $64$ bajty):
   $$\text{Slot Time} = \frac{512\text{ bitów}}{10\times 10^6\text{ b/s}} = 51.2\ \mu\text{s}$$
   Jest to maksymalny czas potrzebny na dotarcie sygnału na drugi koniec najdłuższego dopuszczalnego segmentu kabla i powrót sygnału kolizji (Round-Trip Propagation Time).

2. <b>Wzór losowania okna kolizyjnego:</b>  
   Po $n$-tej kolejnej kolizji kontroler losuje liczbę całkowitą $r$ z przedziału:
   $$0 \le r < 2^k, \quad \text{gdzie } k = \min(n, 10)$$
   Czas oczekiwania wynosi:
   $$T_{\text{wait}} = r \times \text{Slot Time}$$
   - Przy 1. kolizji ($n=1$): $r \in \{0, 1\}$ (czas oczekiwania $0$ lub $51.2\ \mu\text{s}$).
   - Przy 2. kolizji ($n=2$): $r \in \{0, 1, 2, 3\}$.
   - Przy 10. kolizji ($n=10$): $r \in \{0, 1, \dots, 1023\}$ (maksymalne okno $52.4\text{ ms}$).
   - Od 11 do 15 kolizji: okno pozostaje obcięte do $1023$ (stąd nazwa *Truncated*).

3. <b>Limit 16 kolizji:</b>  
   Jeśli po 16 kolejnych próbach ramka nadal ulega zderzeniu, kontroler MAC odrzuca ją i zgłasza błąd sprzętowy **_Excessive Collision Error_**.

</div>
</details>

---

## 🔒 Weryfikacja: Topologie logiczne i metody dostępu do medium

Dopasuj pojęcie lub mechanizm do jego właściwości inżynieryjnej:

<data-gate>
  <data-connection-matcher title="Topologie logiczne i metody arbitrażu medium">
    <item left="Topologia logiczna" right="Faktyczna ścieżka danych i reguły uzyskiwania dostępu do łącza"></item>
    <item left="Tryb Full-Duplex" right="Jednoczesna transmisja w obu kierunkach bez kolizji dzięki rozdzielonym torom Tx i Rx"></item>
    <item left="Tryb Half-Duplex" right="Transmisja naprzemienna, stacje rywalizują o wspólne pasmo"></item>
    <item left="CSMA/CD (Ethernet)" right="Wykrywa kolizję skokiem napięcia, wysyła sygnał JAM i losuje czas wycofania"></item>
    <item left="CSMA/CA (Wi-Fi)" right="Unika kolizji rezerwacją eteru ramkami RTS/CTS i wymaga potwierdzeń ACK"></item>
    <item left="Problem ukrytego węzła" right="Stacje widzą ten sam punkt dostępowy, lecz wzajemnie się nie słyszą"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wygląd fizyczny kabli (gwiazda na switchu lub hubie) może różnić się od logiki transmisji danych (pełny dupleks bez kolizji na switchu vs wspólna magistrala kolizyjna na hubie).
- Tryb Full-Duplex eliminuje kolizje i podwaja przepustowość użytkową dzięki fizycznemu rozdzieleniu toru nadawczego (Tx) i odbiorczego (Rx).
- W Ethernecie kablowym kolizję wykrywa się pomiarem napięcia (CSMA/CD), po czym stacje wysyłają sygnał JAM i losują czas wycofania.
- W Wi-Fi własny nadajnik zagłusza odbiornik, a stacje mogą się wzajemnie nie słyszeć (ukryty węzeł), dlatego kolizjom zapobiega się (CSMA/CA) przez rezerwację eteru ramkami RTS/CTS oraz obowiązkowe potwierdzenia ACK.
