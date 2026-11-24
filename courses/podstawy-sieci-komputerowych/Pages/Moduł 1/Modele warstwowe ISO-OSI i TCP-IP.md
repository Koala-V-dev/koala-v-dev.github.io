# Modele warstwowe ISO-OSI i TCP-IP

Gdy przełączasz laptopa z kabla Ethernet na Wi-Fi, przeglądarka i aktywne połączenia działają dalej bez przepisywania kodu aplikacji. Dzieje się tak dlatego, że komunikację sieciową podzielono na niezależne **warstwy**: program rozmawia tylko ze stosem w systemie operacyjnym, a system przekazuje dane aktualnie używanej karcie sieciowej.

W praktyce spotkasz dwa modele opisujące te warstwy:
- **ISO/OSI (7 warstw):** wspólny język techniczny i diagnostyczny inżynierów (mówimy np. „awaria warstwy 2” albo „routing w warstwie 3”). Na tym podziale opierają się kolejne moduły tego kursu.
- **TCP/IP (4 warstwy):** rzeczywista implementacja działająca w kodzie Windows, Linux i sprzętu sieciowego.

---

## 🏛️ Zestawienie warstw: ISO/OSI a TCP/IP

| Poziom | Warstwa ISO/OSI                  | Odpowiednik TCP/IP  | Gdzie działa w komputerze | Za co odpowiada                                                  |
| :----- | :------------------------------- | :------------------ | :------------------------ | :--------------------------------------------------------------- |
| **L7** | **Aplikacji** (*Application*)    | **Aplikacja**       | *User Space* (programy)   | Protokoły usług: HTTP, DNS, SSH, DHCP                            |
| **L6** | **Prezentacji** (*Presentation*) | **Aplikacja**       | *User Space* (biblioteki) | Szyfrowanie TLS, kodowanie znaków (UTF-8), formaty (JSON)        |
| **L5** | **Sesji** (*Session*)            | **Aplikacja**       | *User Space* (biblioteki) | Utrzymywanie stanu sesji i wznawianie połączeń                   |
| **L4** | **Transportowa** (*Transport*)   | **Transportowa**    | *Kernel Space* (jądro OS) | Rozdzielanie ruchu między programy (porty TCP/UDP), niezawodność |
| **L3** | **Sieciowa** (*Network*)         | **Internet**        | *Kernel Space* (jądro OS) | Logiczne adresy IPv4/IPv6 i wybór trasy między sieciami          |
| **L2** | **Łącza danych** (*Data Link*)   | **Dostęp do sieci** | *Karta NIC (ASIC)*        | Fizyczne adresy MAC, ramki Ethernet, wykrywanie błędów CRC-32    |
| **L1** | **Fizyczna** (*Physical*)        | **Dostęp do sieci** | *Karta NIC (PHY) / Kabel* | Zamiana bitów na napięcia, impulsy światła lub fale radiowe      |

> [!NOTE]
> Warstwy **L5, L6 i L7** modelu OSI są w systemie operacyjnym połączone w jedną warstwę aplikacji. Jądro systemu nie szyfruje ruchu TLS ani nie parsuje HTML. Robią to biblioteki samego programu w *User Space*.

---

## 🔌 Jak głęboko w stos zaglądają urządzenia i kto definiuje standardy

Sprzęt sieciowy nie analizuje wszystkich 7 warstw. Im niżej kończy się dekodowanie, tym mniejsze opóźnienie i prostszy układ scalony, ale też węższy zakres decyzji:

| Urządzenie | Warstwa graniczna     | Co odczytuje i przetwarza                                                                                                                         | Konsekwencja w działaniu sieci                                                                                                                |
| :--------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hub**    | **L1** (Fizyczna)     | Powiela surowy sygnał elektryczny na wszystkie pozostałe porty bez dekodowania bitów.                                                             | Nie izoluje ruchu: każdy host odbiera ruch innych (łatwy podsłuch) i współdzieli domenę kolizyjną.                                            |
| **Switch** | **L2** (Łącza danych) | Odczytuje nagłówek **MAC** i dopasowuje port wyjściowy w sprzętowej tablicy **CAM** (układ ASIC). Nie parsuje nagłówka IP.                        | Przekazuje ramki z pełną prędkością łącza w obrębie jednej sieci lokalnej, ale nie potrafi wyznaczyć trasy między różnymi podsieciami.        |
| **Router** | **L3** (Sieciowa)     | Zdejmuje ramkę L2, odczytuje docelowe **IP**, szuka wpisu w tablicy routingu, zmniejsza `TTL` i buduje **nową ramkę L2** dla kolejnego przeskoku. | Łączy różne sieci IP. Adres IP źródła i celu pozostaje stały w całej trasie, natomiast adresy MAC zmieniają się na każdym routerze po drodze. |

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 16px 0;">
  <figure style="margin: 0; text-align: center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/koncentrator-hub.jpg" alt="4-portowy koncentrator Ethernet Hub Netgear EN104TP (L1)" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
    <figcaption style="font-size: 0.85em; opacity: 0.85; margin-top: 6px;"><strong>Hub (L1):</strong> powielacz sygnału elektrycznego</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/switch-ethernet.jpg" alt="24-portowy przełącznik sieciowy D-Link DGS-1224T Gigabit Ethernet Switch (L2)" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
    <figcaption style="font-size: 0.85em; opacity: 0.85; margin-top: 6px;"><strong>Switch (L2):</strong> przełącznik ramek po adresach MAC</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/router-sieciowy.jpg" alt="Router sieciowy z portami WAN, LAN i SFP (L3)" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
    <figcaption style="font-size: 0.85em; opacity: 0.85; margin-top: 6px;"><strong>Router (L3):</strong> wyznaczanie tras między sieciami IP</figcaption>
  </figure>
</div>

Ta sama granica warstw dzieli odpowiedzialność organizacji tworzących standardy sieciowe. Kliknij organizację lub warstwę na grafie, aby zobaczyć rozwinięcie skrótów i zakres odpowiedzialności (albo przełącz się na tryb **Sprawdź skojarzenia**):

<data-standards-stack></data-standards-stack>

---

## 📬 Przypisanie warstw w systemie i przepływ przez urządzenia

Przypisz mechanizmy sieciowe do właściwych obszarów systemu (*User Space*, *Kernel Space*, *Karta NIC*), a następnie zobacz drogę pakietu przez stosy sieciowe Switch-a L2 i Router-a L3:

<data-gate>
<data-system-stack-lab></data-system-stack-lab>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Kiedy warstwy przestają być niezależne (pseudo-nagłówek TCP w C i pułapka MTU)</span>
<span class="deep-dive-badge">C &amp; PROTOKÓŁ &amp; DIAGNOSTYKA</span>
</summary>
<div class="deep-dive-content">

W modelu ISO/OSI każda warstwa działa w izolacji od sąsiadów. W prawdziwym systemie operacyjnym warstwy wymieniają dane na skróty, co ma bezpośredni wpływ na działanie sieci i diagnozowanie awarii.

### 1. Warstwa L4 musi czytać warstwę L3 (<span class="color-blue">pseudo-nagłówek TCP</span>)

Gdy jądro systemu liczy sumę kontrolną segmentu **TCP (L4)**, nie bierze pod uwagę wyłącznie danych warstwy transportowej. Do obliczeń wciąga również adresy IP z warstwy **L3** za pomocą tzw. pseudo-nagłówka w C:

```c
struct tcp_pseudo_hdr {
    uint32_t src_ip;   // pobrane z nagłówka L3 (IPv4)
    uint32_t dst_ip;   // pobrane z nagłówka L3 (IPv4)
    uint8_t  zero;
    uint8_t  proto;    // 6 dla TCP
    uint16_t tcp_len;  // długość segmentu L4
};
```

**Co z tego wynika:**
- Odbiorca wykryje sytuację, w której router po drodze błędnie zmodyfikował adres IP, bo suma kontrolna L4 przestanie się zgadzać.
- Każdy router wykonujący **NAT** (podmieniający `src_ip` w L3) musi jednocześnie otworzyć nagłówek **L4** i przeliczyć sumę kontrolną TCP/UDP. Gdy router tego nie zrobi, pakiety są odrzucane mimo poprawnego IP.

### 2. Limit warstwy L2 zawiesza aplikację w L7 (<span class="color-blue">MTU Black Hole</span>)

Standard Ethernet (**L2**) ogranicza rozmiar danych w jednej ramce do $1500\text{ B}$ (`MTU`). Aby uniknąć dzielenia pakietów po drodze, warstwa transportowa **L4** przy otwieraniu połączenia TCP wylicza maksymalny rozmiar segmentu (`MSS`):

$$MSS = 1500\text{ B (MTU L2)} - 20\text{ B (IPv4 L3)} - 20\text{ B (TCP L4)} = 1460\text{ B}$$

**Jak psuje się sieć, gdy warstwy się nie dogadają:**
1. Twój komputer wysyła segmenty o rozmiarze $1460\text{ B}$ (cały pakiet ma $1500\text{ B}$).
2. Po drodze znajduje się tunel VPN, którego łącze ma mniejszy limit (`MTU = 1420 B`), oraz zapora blokująca komunikaty ICMP (*Fragmentation Needed*).
3. Małe pakiety (DNS, handshake TCP/TLS) mieszczą się w $1420\text{ B}$ i przechodzą poprawnie. Duże pakiety z treścią strony lub plikiem są po cichu odrzucane.

Efekt widoczny dla użytkownika to połączenie, które otwiera się natychmiast, a następnie zawiesza przy przesyłaniu danych. Przyczyną nie jest błąd przeglądarki (L7), lecz niezgodność limitu rozmiaru między L2 a L4.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **ISO/OSI (7 warstw)** to mapa pojęciowa do projektowania i diagnostyki (struktura kolejnych modułów kursu), a **TCP/IP (4 warstwy)** to rzeczywisty kod w systemie operacyjnym.
- W komputerze szyfrowanie i protokoły aplikacji (L5–L7) działają w *User Space*, transport i routing (L4–L3) w jądrze systemu, a budowa ramek i nadawanie bitów (L2–L1) w karcie sieciowej.
- **Hub** działa na L1, **Switch** sięga do L2 (MAC), a **Router** analizuje L3 (IP).
- **IEEE** tworzy standardy L1/L2 (`802.3`, `802.11`), **IETF** publikuje protokoły w **RFC**, a **IANA/ICANN** zarządza pulami IP, portów i domen głównych.
