# Anatomia ramki Ethernet II i adresowanie fizyczne MAC

Karta sieciowa nie rozumie adresów IP. Aby wysłać dane po kablu, warstwa łącza danych (**L2**) pakuje je w ramkę **Ethernet II** z _**48-bitowym**_ adresem fizycznym **MAC** oraz 4-bajtową sumą kontrolną **FCS** (*Frame Check Sequence*, sprzętową sumą `CRC-32`, która odrzuca ***uszkodzone ramki*** zanim trafią do systemu).

Dlaczego właśnie **Ethernet II** i czy istnieje Ethernet 3 albo 4?
- **Ethernet I (1980):** pierwszy prototyp standardu DIX (firmy DEC, Intel, Xerox).
- **Ethernet II (1982, DIX 2.0):** dodał pole `EtherType` i stał się uniwersalnym formatem ramki używanym do dziś.
- **Brak „Ethernetu 3 ani 4”:** mimo skoku prędkości z $10\text{ Mb/s}$ do $100\text{ Gb/s}$ i więcej, format nagłówka Ethernet II pozostał bez zmian.

Warstwa L2 dzieli się na dwie podwarstwy:
- **LLC** (*Logical Link Control*, IEEE 802.2): spina L2 z warstwą sieciową (L3) przez pole `EtherType`.
- **MAC** (*Media Access Control*, IEEE 802.3 / 802.11): obsługuje adresy fizyczne, budowę ramki, sprawdzanie FCS oraz dostęp do medium (w Wi-Fi przez CSMA/CA z potwierdzeniami `ACK`).

---

## 🧩 1. Budowa adresu MAC, Unicast/Multicast/Broadcast i bity (I/G, U/L)

48-bitowy adres **MAC** zapisujemy jako _**12 znaków szesnastkowych**_ (np. `04:D4:C4:1A:2B:3C`). Pamiętaj, że $1\text{ znak hex} = 4\text{ bity}$, więc _**$12 \times 4 = 48\text{ bitów}$**_ ($6\text{ bajtów}$):

| Część adresu                                   | Rozmiar                                | Znaczenie                                  | Przykłady OUI producentów                                                                   |
| :--------------------------------------------- | :------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------ |
| **OUI** (*Organizationally Unique Identifier*) | Pierwsze $3\text{ B}$ ($6$ znaków hex) | Identyfikator producenta nadany przez IEEE | `04:D4:C4` (ASUS), `00:1B:54` (Cisco), `08:00:27` (Oracle VirtualBox), `00:15:5D` (Hyper-V) |
| **NIC** (*Network Interface Controller*)       | Ostatnie $3\text{ B}$ ($6$ znaków hex) | Unikalny numer seryjny karty z fabryki     | Nadawany kolejno przez producenta sprzętu                                                   |

<data-mac-address-lab></data-mac-address-lab>

Zanim wyślesz ramkę w sieć LAN, karta musi wiedzieć, do kogo trafia transmisja:
- **Unicast** (*1 do 1*): ramka dla jednej konkretnej karty sieciowej (np. Twój komputer -> router).
- *Multicast* (*1 do grupy*): ramka tylko dla urządzeń zapisanych do danej grupy (np. mDNS lub IPv6 NDP).
- ***Broadcast*** (*1 do wszystkich*): ramka `FF:FF:FF:FF:FF:FF` odbierana przez każdą kartę w sieci lokalnej (np. zapytanie ARP).

O tych właściwościach decydują dwa najmłodsze bity pierwszego bajtu adresu MAC (`b0` oraz `b1`). Przetestuj je na poniższym schemacie:



---

## 📐 2. Jak skleja się ramka Ethernet II w przestrzeni (3 warianty z kabla)

> [!REMINDER]
> **Przypomnienie z Modułu 1: czym jest PHY?**
> **PHY** (*Physical Layer*, warstwa L1) to fizyczny układ nadawczo-odbiorczy w karcie sieciowej, który zamienia bity na impulsy napięcia, światła lub fale radiowe. Dlatego `Preambuła + SFD` ($8\text{ B}$) lecą po kablu przed właściwą ramką tylko po to, aby zsynchronizować zegar **PHY**, i znikają zanim dane trafią do L2.

Zamiast suchej tabelki spójrz na fizyczny ciąg bajtów płynący z lewej do prawej strony kabla. Stały narzut L2 to $6 + 6 + 2 + 4 = 18\text{ B}$, a minimalna długość ramki L2 to _**$64\text{ B}$**_:

<data-ethernet-frame-lab mode="variants"></data-ethernet-frame-lab>
---

## 💻 3. Odczyt MAC i diagnostyka błędów w systemie

W systemie operacyjnym sprawdzisz adres **MAC** i licznik uszkodzonych ramek **FCS** poleceniami:
- **Windows:** `getmac /v /fo list` lub `ipconfig /all`
- **Linux:** `ip -s link show dev eth0`

Spójrz na poniższy zrzut z terminala Linuksa i sprawdź, co mówi o sprzęcie oraz kablu:

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 08:00:27:a4:19:01 brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped
        482190     612     47        0
```

- **OUI `08:00:27`:** pierwszy bajt `0x08` (`0000 1000`) ma `b0 = 0` (**Unicast**) i `b1 = 0` (_**Universal**_), czyli to wirtualna karta Oracle VirtualBox.
- ***Licznik `RX errors: 47`:*** 47 ramek nie przeszło sprzętowej sumy kontrolnej FCS (CRC-32) i zostało odrzuconych na wejściu przez kartę sieciową (zwykle winny jest ***uszkodzony przewód***, źle zaciśnięta wtyczka RJ-45 lub silne zakłócenia EMI).

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Skąd się wzięło 64 B, jak krzem liczy CRC-32 i jak działa Pierścień RX</span>
<span class="deep-dive-badge">FIZYKA &amp; KRZEM &amp; LINUX</span>
</summary>
<div class="deep-dive-content">

### ⏱️ 1. Dlaczego minimum ramki to dokładnie 64 bajty?
W pierwszych sieciach Ethernet (`10BASE5` na kablu koncentrycznym o długości do $2500\text{ m}$) sygnał potrzebował maksymalnie $51{,}2\ \mu\text{s}$ na przejście z jednego końca kabla na drugi i powrót (*Slot Time*). Przy prędkości $10\text{ Mb/s}$ nadajnik w $51{,}2\ \mu\text{s}$ wysyłał dokładnie $512\text{ bitów} = 64\text{ bajty}$. Gdyby ramka była krótsza, stacja skończyłaby nadawać zanim wróciłby do niej sygnał kolizji i nie wiedziałaby, że trzeba ją powtórzyć.

### 🧮 2. Jak karta sprawdza błędy CRC-32 w krzemie?
Układ MAC na karcie sieciowej przepuszcza przychodzące bity przez sprzętowy rejestr przesuwny *LFSR* (wielomian `0xEDB88320`). Dzieje się to z pełną prędkością kabla i bez obciążania procesora. Jeśli obliczona suma różni się choćby o jeden bit od 4 bajtów FCS na końcu ramki, karta wyrzuca ramkę i podbija licznik `RX errors`, zamiast budzić jądro systemu.

### ⚡ 3. Pierścień RX (DMA) i pętla NAPI
Przy łączu $10\text{ Gb/s}$ do komputera może wpadać kilkanaście milionów ramek na sekundę. Zamiast wywoływać przerwanie CPU dla każdej ramki osobno, karta kopiuje poprawne ramki przez **DMA** prosto do cyklicznego bufora w RAM (`RX Ring`), a mechanizm *NAPI* w jądrze Linuksa odbiera je hurtem w jednej partii.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Ethernet II** to standardowy format ramki L2 (od $10\text{ Mb/s}$ aż po $100\text{ Gb/s}+$), a **FCS** sprzętowo odrzuca uszkodzone ramki.
- Adres **MAC** ma _**$48\text{ bitów}$**_ ($12$ znaków hex, $1\text{ znak hex} = 4\text{ bity}$): $3\text{ B}$ **OUI** producenta + $3\text{ B}$ **NIC**.
- Pierwszy bajt określa typ ruchu (**b0 I/G**: **Unicast** / *Multicast* / ***Broadcast***) i pochodzenie (**b1 U/L**: _**Universal**_ / ***Local***).
- Ramka Ethernet II ma minimum _**$64\text{ bajty}$**_ ($18\text{ B}$ narzutu + min. $46\text{ B}$ ładunku z ewentualnym *Zero-Paddingiem*).
