# Pakiet IPv4 - budowa nagłówka i czas życia (TTL)

Ramka Ethernet odpowiada za przekazanie danych wyłącznie do sąsiedniego urządzenia na tym samym kablu. Aby pakiet mógł pokonać kilkanaście węzłów operatorskich w drodze do zdalnego serwera, potrzebuje globalnej koperty warstwy 3 opisanej w dokumencie *RFC 791*.

Analiza pól 20-bajtowego nagłówka IPv4 pozwala odczytać z polecenia `ping` system operacyjny serwera oraz zrozumieć mechanizm zapobiegający zapętleniu ruchu w sieci.

---

## 📐 Struktura 20-bajtowego nagłówka IPv4 (RFC 791)

Nagłówek składa się ze słów 32-bitowych (4 bajty w wierszu). Standardowy nagłówek bez pól opcjonalnych zajmuje 5 wierszy, czyli dokładnie 20 bajtów:

![Anatomia nagłówka pakietu IPv4 (Standard RFC 791)](/public/courses/podstawy-sieci-komputerowych/Images/naglowek-ipv4-anatomia.svg)

### 📋 Szczegółowe znaczenie pól nagłówka

| Nazwa pola | Rozmiar | Znaczenie inżynieryjne |
| :--- | :--- | :--- |
| **Wersja (*Version*)** | 4 bity | Wersja protokołu; dla IPv4 przyjmuje wartość `0100` ($4$). |
| **IHL (*Internet Header Length*)** | 4 bity | Długość nagłówka w słowach 32-bitowych (minimum `5`, czyli $20\text{ B}$). |
| **Typ usługi (*DSCP / ECN*)** | 8 bitów | Priorytetyzacja ruchu (*QoS*) i sygnalizacja zatorów (*ECN*). |
| **Długość całkowita** | 16 bitów | Rozmiar całego pakietu (nagłówek IP + ładunek); maksimum wynosi $65\,535\text{ B}$. |
| **Identyfikacja** | 16 bitów | Numer nadany przez nadawcę do scalenia pofragmentowanych części pakietu. |
| **Flagi (*Flags*)** | 3 bity | Flagi sterujące podziałem: *DF* (zakaz fragmentacji) oraz *MF* (kolejne fragmenty). |
| **Przesunięcie fragmentu** | 13 bitów | Położenie danego fragmentu w pierwotnym pakiecie w wielokrotnościach 8 bajtów. |
| **Czas życia (*TTL*)** | 8 bitów | Licznik skoków ograniczający czas krążenia pakietu w sieci. |
| **Protokół (*Protocol*)** | 8 bitów | Kod protokołu warstwy wyższej odbierającej ładunek (ICMP, TCP lub UDP). |
| **Suma kontrolna nagłówka** | 16 bitów | Weryfikuje integralność wyłącznie samego nagłówka IP. |
| **Source IP / Destination IP** | po 32 bity | Logiczne adresy IPv4 nadawcy oraz odbiorcy docelowego. |

---

## 🧪 Laboratorium nagłówka IPv4, fragmentacji MTU i TTL

Kliknij dowolne pole 20-bajtowego nagłówka RFC 791, zmień MTU łącza lub ustaw flagę `DF` i obserwuj podział na fragmenty oraz wygasanie TTL w routerach:

<data-ipv4-packet-lab></data-ipv4-packet-lab>

---

## ⏳ Licznik TTL (Time to Live)

Pole *TTL* jest 8-bitowym licznikiem o zakresie od $0$ do $255$. Mimo słowa „Time” w nazwie, współcześnie nie mierzy sekund, lecz maksymalną dopuszczalną liczbę przejść przez routery (*Hop Count*).

### 🔁 1. Przetwarzanie TTL w routerze

Każdy router przekazujący pakiet do kolejnej sieci wykonuje stałą procedurę:
1. Odczytuje wartość *TTL* i zmniejsza ją o 1 ($\mathbf{TTL_{\text{nowe}} = TTL_{\text{stare}} - 1}$).
2. Ponieważ zmiana *TTL* modyfikuje zawartość nagłówka, router przelicza na nowo 16-bitową sumę kontrolną nagłówka IP (*Header Checksum*).
3. Jeśli po zmniejszeniu $\mathbf{TTL = 0}$, router **odrzuca pakiet** i wysyła do nadawcy komunikat *ICMP Typ 11 Kod 0* (*Time-to-Live Exceeded in Transit*).

> [!IMPORTANT]
> **Ochrona przed pętlami routingu:**  
> Błąd konfiguracji tras może sprawić, że Router A wyśle pakiet do Routera B, a Router B z powrotem do Routera A. Bez licznika *TTL* takie pakiety krążyłyby w nieskończoność, nasycając łącza do 100% zajętości.

### 💻 2. Domyślne wartości TTL systemów operacyjnych

Różne systemy operacyjne nadają pakiety wychodzące o odmiennej wartości startowej *TTL*, co pomaga oszacować system odbiorcy:
- **Linux, macOS, Android:** początkowy $TTL = 64$.
- **Windows:** początkowy $TTL = 128$.
- **Sprzęt sieciowy Cisco / routery operatorskie:** początkowy $TTL = 255$.

Jeżeli zapytanie `ping` do serwera linuksowego zwraca $TTL = 52$, pakiet przeszedł po drodze dokładnie przez $64 - 52 = 12$ routerów pośrednich.

---

## 🔢 Pole Protokół (Protocol) w diagnostyce INF.02

Ośmiobitowe pole *Protokół* informuje jądro systemu docelowego, do którego modułu przekazać dane po odcięciu nagłówka IPv4:

| Wartość dziesiętna | Wartość szesnastkowa | Protokół | Przeznaczenie |
| :---: | :---: | :--- | :--- |
| `1` | `0x01` | **ICMP** | Komunikaty diagnostyczne (`ping`, `traceroute`). |
| `6` | `0x06` | **TCP** | Niezawodna transmisja połączeniowa (HTTP, HTTPS, SSH). |
| `17` | `0x11` | **UDP** | Szybka transmisja bezpołączeniowa (DNS, DHCP, transmisja strumieniowa). |

---

## 🔒 Sprawdzenie wiedzy: Kody nagłówka IPv4 i wartości TTL

<data-gate>
  <data-connection-matcher title="Połącz pole lub wartość nagłówka IPv4 z jego znaczeniem w systemie">
    <div class="cmw-item" data-left="Protocol = 1 (0x01)" data-right="Komunikaty diagnostyczne ICMP (ping / traceroute)"></div>
    <div class="cmw-item" data-left="Protocol = 6 (0x06)" data-right="Połączeniowy protokół TCP"></div>
    <div class="cmw-item" data-left="Protocol = 17 (0x11)" data-right="Bezpołączeniowy protokół UDP"></div>
    <div class="cmw-item" data-left="TTL start = 128" data-right="Domyślna wartość startowa systemu Windows"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Standardowy nagłówek pakietu IPv4 bez opcji ma długość **20 bajtów** (pole *IHL* = `5`).
- Pole *TTL* ogranicza liczbę przeskoków pakietu przez routery i przerywa pętle routingu komunikatem *ICMP Time Exceeded* po osiągnięciu wartości `0`.
- Domyślne wartości początkowe *TTL* wynoszą `64` (Linux/macOS), `128` (Windows) oraz `255` (sprzęt sieciowy).
- Kod w polu *Protokół* identyfikuje warstwę transportową lub sterującą ładunku: `1` oznacza *ICMP*, `6` oznacza *TCP*, a `17` wskazuje *UDP*.
