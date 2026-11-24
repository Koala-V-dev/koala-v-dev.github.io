# Enkapsulacja i jednostki danych PDU

Program w pamięci komputera operuje na ciągłym bloku bajtów. Gdy ten blok opuszcza aplikację, sieć nie wie jeszcze, do którego procesu u odbiorcy ma trafić, którędy go skierować ani czy na przewodzie nie uległ przekłamaniu.

Każda kolejna warstwa stosu dokłada przed danymi własny nagłówek sterujący (**enkapsulacja**). Po drugiej stronie połączenia stos zdejmuje te nagłówki od dołu do góry i przekazuje czysty blok bajtów do programu docelowego (**dekapsulacja**).

---

## 📦 Jednostki danych PDU w stosie TCP/IP

Na każdym piętrze stosu ta sama porcja danych zyskuje kolejny nagłówek i zmienia swoją nazwę techniczną (**PDU**, *Protocol Data Unit*):

![Enkapsulacja i jednostki PDU w stosie sieciowym](/public/courses/podstawy-sieci-komputerowych/Images/enkapsulacja-pdu-wedrowka.svg)

- **Aplikacja (`Dane`):** surowy ładunek programu przed przekazaniem do jądra systemu.
- **Transport (`Segment` / `Datagram`):** warstwa dokleja nagłówek wskazujący konkretny proces docelowy.
- **Internet (`Pakiet`):** warstwa dokleja nagłówek adresacji między sieciami.
- **Dostęp do sieci (`Ramka` → `Bity`):** karta sieciowa dokleja nagłówek łącza oraz ogon kontrolny na końcu, po czym zamienia całość na bity.

**Jak rośnie rozmiar porcji danych w trakcie enkapsulacji (przykład dla $100\text{ B}$ ładunku):**
- `100 B` (`Dane`) → `+ 20 B` nagłówka Transportu = `120 B` (`Segment`) → `+ 20 B` nagłówka Internet = `140 B` (`Pakiet`) → `+ 18 B` nagłówka i ogona Dostępu do sieci = **`158 B` (`Ramka`)**.

---

## 🔄 Warsztat enkapsulacji PDU i wędrówki przez sieć

Złóż stos enkapsulacji od środka na zewnątrz i prześledź, jak urządzenia sieciowe zaglądają wyłącznie do swojej warstwy:

<data-gate>
<data-pdu-workshop></data-pdu-workshop>
</data-gate>

> [!NOTE]
> **Dlaczego suma `FCS` (CRC-32) leży na samym końcu ramki, a nie w nagłówku?**
> Karta sieciowa liczy sumę kontrolną w locie podczas wysyłania kolejnych bitów i dopisuje wynik jako ostatnie $4\text{ B}$ ramki. Dzięki temu nie musi buforować całej ramki w pamięci przed startem transmisji, a przy odbiorze odrzuca uszkodzone ramki sprzętowo bez budzenia procesora.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Kolejność bajtów (Big Endian / BSWAP), narzut nagłówków i algorytm Nagle'a</span>
<span class="deep-dive-badge">C &amp; ASEMBLER x86 &amp; WYDAJNOŚĆ</span>
</summary>
<div class="deep-dive-content">

### 1. Dlaczego w C nie można wysłać struktury prosto z pamięci x86? (<code>htons</code> / <code>BSWAP</code>)

Procesory **x86/x64** zapisują liczby wielobajtowe w pamięci w kolejności **Little Endian** (najmłodszy bajt pod najniższym adresem). Wszystkie nagłówki sieciowe (Ethernet, IP, TCP, UDP) wymagają kolejności **Big Endian** (*Network Byte Order*).

Gdy w C wpisujesz numer portu `443` (`0x01BB`) do nagłówka TCP, w pamięci x86 leży on jako `BB 01`. Przed wysłaniem musisz wywołać `htons(443)` (*Host To Network Short*):

```c
uint16_t port_net = htons(443); // zamienia 0xBB01 -> 0x01BB
```

W asemblerze x86 kompilator tłumaczy `htons` i `htonl` na pojedyncze instrukcje sprzętowe `ROL AX, 8` lub `BSWAP EAX`. Kosztuje to 1 cykl procesora. Bez tej zamiany router lub serwer odczyta port `443` jako `47873` (`0xBB01`).

### 2. Narzut enkapsulacji i algorytm Nagle'a

Każda warstwa zabiera część przepustowości łącza na swój nagłówek:
- **Ethernet II (L2):** $14\text{ B}$ nagłówka + $4\text{ B}$ sumy `FCS` = **$18\text{ B}$** (oraz $8\text{ B}$ preambuły i $12\text{ B}$ przerwy międzyramkowej w L1).
- **IPv4 (L3):** minimum **$20\text{ B}$**.
- **TCP (L4):** minimum **$20\text{ B}$**.

Przy maksymalnym ładunku Ethernetu (**MTU = 1500 B**) nagłówki L2–L4 zajmują $58\text{ B}$, więc sprawność przesyłu wynosi około **$96\%$**. Gdy jednak aplikacja wysyła pojedyncze bajty (np. naciśnięcie klawisza w sesji SSH = $1\text{ B}$ danych), narzut wynosi $58\text{ B}$ na $1\text{ B}$ ładunku. Ponad **$98\%$ pasma marnuje się na nagłówki**.

Stos TCP rozwiązuje ten problem **algorytmem Nagle'a**, który skleja małe porcje danych w jeden większy segment, dopóki nie wróci potwierdzenie `ACK` dla poprzedniego. W grach sieciowych i SSH wyłącza się go flagą `TCP_NODELAY`, aby uzyskać minimalne opóźnienie kosztem większego narzutu.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Kolejne jednostki **PDU** to: *Dane* (L7–L5), *Segment/Datagram* (L4), *Pakiet* (L3), *Ramka* (L2) oraz *Bity* (L1).
- **Enkapsulacja** dokleja nagłówki od warstw wyższych do niższych, a **dekapsulacja** zdejmuje je u odbiorcy od dołu do góry.
- **Switch (L2)** analizuje tylko zewnętrzną ramkę L2, natomiast **Router (L3)** zdejmuje L2, sprawdza adres IP w L3 i zakłada nową ramkę L2 na kolejny odcinek drogi.
