# Enkapsulacja i jednostki PDU - wędrówka danych

Gdy aplikacja wysyła żądanie do serwera, każda kolejna warstwa stosu sieciowego dokleja do danych własny nagłówek sterujący. Ten proces nazywamy **enkapsulacją**, a zdejmowanie nagłówków po stronie odbiorcy **dekapsulacją**.

---

## 📦 Jednostki danych PDU (Standard INF.02)

Na każdej warstwie przesyłana porcja danych nosi inną nazwę techniczną (**PDU** - *Protocol Data Unit*):

| Warstwa | Nazwa PDU | Co dokleja warstwa | Kluczowe pola |
| :--- | :--- | :--- | :--- |
| **L7 Aplikacji** | **Dane** (*Data*) | Treść protokołu | Zapytanie HTTP, plik, dane DNS |
| **L4 Transportowa** | **Segment** (TCP) / **Datagram** (UDP) | Nagłówek L4 | Port źródłowy i docelowy |
| **L3 Sieciowa** | **Pakiet** (*Packet*) | Nagłówek IP | Adres IP źródła i celu, licznik `TTL` |
| **L2 Łącza danych** | **Ramka** (*Frame*) | Nagłówek + ogon `FCS` | Adresy MAC, typ protokołu, suma CRC-32 |
| **L1 Fizyczna** | **Bity** (*Bits*) | Brak | Impulsy elektryczne, świetlne lub fale radiowe |

---

## 🔄 Adresy IP (End-to-End) a adresy MAC (Hop-by-Hop)

Podczas przejścia ruchu przez sieć nagłówki warstw 2 i 3 zachowują się zupełnie inaczej:
- **Adresy IP (L3) działają w skali globalnej (*End-to-End*):** Wskazują pierwotnego nadawcę i końcowy serwer. Bez udziału NAT pozostają niezmienne na całej trasie.
- **Adresy MAC (L2) działają lokalnie (*Hop-by-Hop*):** Obowiązują tylko między dwoma sąsiednimi urządzeniami na jednym kablu. Router L3 zdejmuje starą ramkę Ethernet, zmniejsza `TTL` o 1 i tworzy nową ramkę L2 z własnym adresem MAC jako źródłem.

Prześledź budowę stosu PDU, wymianę adresów MAC oraz spadek `TTL` na kolejnych routerach podczas ładowania strony głównej YouTube:

<data-encapsulation-simulator></data-encapsulation-simulator>

> [!NOTE] Jak Twoje żądanie trafia dziś do YouTube (CDN i Anycast)
> W dużych usługach takich jak YouTube nie łączysz się dziś z jednym konkretnym serwerem pod jednym stałym adresem IP. Po wpisaniu `youtube.com` Twój ruch wchodzi do infrastruktury Google i dzięki mechanizmowi **Anycast** oraz sieciom **CDN** (*Content Delivery Network*) jest kierowany do **najbliższego serwera lustrzanego (węzła brzegowego)**, np. w Warszawie lub we Frankfurcie zamiast w Kalifornii. Dzięki temu pakiet pokonuje mniej routerów (mniejszy spadek `TTL`) i strona ładuje się znacznie szybciej.

---

## 🔍 Dlaczego suma kontrolna FCS jest na końcu ramki

![Mechanizm sprzętowy NIC: Weryfikacja ogona ramki FCS CRC-32](/public/courses/podstawy-sieci-komputerowych/Images/dekapsulacja-odrzucanie-fcs.svg)

Ethernet dopisuje 4-bajtową sumę kontrolną **FCS** (*Frame Check Sequence*) na samym końcu ramki:
1. **Nadawanie w locie:** Karta sieciowa wysyła bity strumieniowo i na bieżąco liczy sumę CRC-32, dopisując ją na końcu bez buforowania całej ramki.
2. **Odrzucanie uszkodzeń bez CPU:** Jeśli zakłócenia na kablu zmienią choć jeden bit, układ ASIC karty natychmiast odrzuca ramkę sprzętowo, nie przerywając pracy procesora.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Narzut protokołów (Overhead) i wydajność MTU</span>
<span class="deep-dive-badge">MATEMATYKA SIECI & WYDAJNOŚĆ</span>
</summary>
<div class="deep-dive-content">

Każdy nagłówek zabiera część pasma łącza:
- **Ethernet II:** 14 B nagłówka + 4 B FCS = **18 B** (plus 8 B preambuły i 12 B przerwy międzyramkowej na warstwie L1).
- **IPv4:** minimum **20 B**.
- **TCP:** minimum **20 B**.

Przy maksymalnym ładunku Ethernetu (**MTU = 1500 B**) nagłówki L2-L4 zajmują 58 B, więc sprawność przesyłu wynosi około **96%**. Jeśli jednak aplikacja wysyła pojedyncze bajty (np. naciśnięcie klawisza w sesji SSH = 1 B danych), narzut wynosi 58 B na 1 B ładunku - ponad **98% przepustowości marnuje się na nagłówki**.

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Kolejność operacji na routerze L3

<data-gate>
  <data-sortable-list title="Ułóż w prawidłowej kolejności etapy obsługi pakietu przez router L3">
    <item data-correct="3">Zmniejszenie licznika TTL o 1 i przeliczenie sumy nagłówka IPv4</item>
    <item data-correct="1">Weryfikacja sumy kontrolnej FCS odebranej ramki w układzie NIC</item>
    <item data-correct="4">Utworzenie nowej ramki Ethernet L2 dla łącza wyjściowego i wyliczenie nowego FCS</item>
    <item data-correct="2">Zdjęcie starego nagłówka Ethernet L2 i odczyt docelowego IP w tablicy routingu</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Nazwy **PDU** na egzamin INF.02: *Dane* (L7), *Segment/Datagram* (L4), *Pakiet* (L3), *Ramka* (L2), *Bity* (L1).
- Adresy **IP** wskazują końcowych uczestników (*End-to-End*), natomiast adresy **MAC** zmieniają się na każdym routerze (*Hop-by-Hop*).
- Umieszczenie sumy **FCS** na końcu ramki pozwala karcie sieciowej obliczać CRC-32 w locie i odrzucać uszkodzone ramki sprzętowo bez obciążania CPU.
