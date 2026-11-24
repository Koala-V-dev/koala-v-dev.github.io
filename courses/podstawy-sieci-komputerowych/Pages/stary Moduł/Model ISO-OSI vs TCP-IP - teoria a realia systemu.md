# Model ISO-OSI vs TCP-IP - teoria a realia systemu

W diagnostyce sieciowej używa się pojęć z siedmiowarstwowego modelu teoretycznego **ISO/OSI** (np. awaria warstwy 2 lub 3). Systemy operacyjne (Windows, Linux) implementują natomiast w praktyce czterowarstwowy stos **TCP/IP**.

---

## 🏛️ Zestawienie warstw: ISO/OSI a TCP/IP (INF.02)

![Zestawienie modeli: 7 warstw ISO/OSI vs 4 warstwy TCP/IP](/public/courses/podstawy-sieci-komputerowych/Images/osi-vs-tcpip-mapowanie.svg)

| Poziom | Warstwa ISO/OSI | Odpowiednik TCP/IP | Kluczowe mechanizmy i protokoły |
| :--- | :--- | :--- | :--- |
| **L7** | **Aplikacji** (*Application*) | **Aplikacja** | HTTP, DNS, SSH, DHCP |
| **L6** | **Prezentacji** (*Presentation*) | **Aplikacja** | Szyfrowanie TLS, kodowanie UTF-8, JSON |
| **L5** | **Sesji** (*Session*) | **Aplikacja** | Utrzymywanie stanu połączenia, tokeny sesji |
| **L4** | **Transportowa** (*Transport*) | **Transportowa** | Porty TCP/UDP, flagi SYN/ACK |
| **L3** | **Sieciowa** (*Network*) | **Internet** | Adresy IPv4/IPv6, tablica routingu |
| **L2** | **Łącza danych** (*Data Link*) | **Dostęp do sieci** | Adresy MAC, ramki Ethernet, suma CRC-32 |
| **L1** | **Fizyczna** (*Physical*) | **Dostęp do sieci** | Napięcia na przewodzie, światło, fale radiowe |

> [!NOTE]
> Warstwy **L5 (Sesji)**, **L6 (Prezentacji)** i **L7 (Aplikacji)** modelu OSI są w stosie TCP/IP połączone w jedną warstwę aplikacji. Szyfrowanie TLS czy parsowanie danych wykonują biblioteki programów, a nie jądro systemu.

---

## ⚙️ Podział odpowiedzialności w komputerze i sprzęcie

![Stos sieciowy w systemie operacyjnym: User Space vs Kernel Space](/public/courses/podstawy-sieci-komputerowych/Images/stos-sieciowy-kernel-userspace.svg)

1. **Przestrzeń użytkownika (*User Space*, L7):** Programy takie jak przeglądarka czy klient SSH. Przekazują dane niżej wyłącznie przez gniazdo sieciowe (*Socket API*).
2. **Jądro systemu (*Kernel Space*, L4 i L3):** Stos TCP/IP systemu operacyjnego obsługuje numery portów, sesje TCP, adresy IP oraz tablicę routingu.
3. **Karta sieciowa (*Hardware* NIC, L2 i L1):** Układ sprzętowy buduje ramki Ethernet, wylicza sumę kontrolną CRC-32 oraz nadaje impulsy do kabla.

### 🔌 Urządzenia sieciowe a głębokość analizy (INF.02)

![Mechanizm działania urządzeń: Do której warstwy sięga logika?](/public/courses/podstawy-sieci-komputerowych/Images/urzadzenia-a-warstwy.svg)

- **Koncentrator / Hub (L1):** Powiela sygnał elektryczny na wszystkie gniazda bez odczytywania adresów.
- **Przełącznik / Switch (L2):** Analizuje wyłącznie nagłówek L2 (adres **MAC**) i kieruje ramkę na odpowiedni port z tablicy CAM.
- **Router (L3):** Zdejmuje ramkę L2, odczytuje docelowy adres **IP**, wybiera trasę w tablicy routingu, zmniejsza `TTL` i tworzy nową ramkę L2.

---

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Wywołanie send(), bufor sk_buff i kolejka TX Ring</span>
<span class="deep-dive-badge">KERNEL API & C</span>
</summary>
<div class="deep-dive-content">

Gdy proces w *User Space* wywołuje funkcję `send(sockfd, buf, len, 0)`, procesor wykonuje instrukcję `syscall` i przełącza uprawnienia z Ring 3 na Ring 0.

1. Jądro kopiuje dane użytkownika do struktury bufora jądra (`sk_buff` w Linuksie).
2. Moduł warstwy L4 dopisuje 20-bajtowy nagłówek TCP lub 8-bajtowy nagłówek UDP.
3. Moduł warstwy L3 dopisuje 20-bajtowy nagłówek IPv4 i sprawdza interfejs wyjściowy w tablicy routingu.
4. Sterownik karty sieciowej wpisuje wskaźnik do gotowego bufora w kolejce pierścieniowej TX (*TX Ring Buffer*), skąd kontroler DMA karty pobiera dane i wystawia na układ fizyczny PHY.

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Realia stosu TCP/IP

<data-gate>
  <data-connection-matcher title="Dopasuj warstwę lub urządzenie do właściwego poziomu analizy oraz strefy systemu">
    <div class="cmw-item" data-left="Switch L2 (układ ASIC)" data-right="Analizuje adresy MAC w warstwie łącza danych"></div>
    <div class="cmw-item" data-left="Router L3 (brama)" data-right="Wymienia nagłówek L2 i wyznacza trasę po IP"></div>
    <div class="cmw-item" data-left="Stos TCP/UDP w OS" data-right="Działa w Kernel Space (zarządza portami i buforami)"></div>
    <div class="cmw-item" data-left="Szyfrowanie TLS i HTTP" data-right="Działa w User Space (biblioteki i aplikacje)"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Siedmiowarstwowy model **ISO/OSI** jest językiem diagnostyki, a czterowarstwowy stos **TCP/IP** praktyczną implementacją w systemach operacyjnych.
- Warstwy L5, L6 i L7 modelu OSI łączą się w TCP/IP w jedną warstwę aplikacji (działającą w *User Space*).
- **Hub** działa na L1 (bity/sygnał), **Switch** na L2 (adresy MAC), a **Router** na L3 (adresy IP i wyznaczanie tras).
