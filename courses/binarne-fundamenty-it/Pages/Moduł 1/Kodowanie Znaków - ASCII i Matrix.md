# 🧩 Kodowanie Znaków: ASCII i Matrix

Wiesz już, jak procesor liczy, jak radzi sobie z minusami i jak operuje w różnych systemach liczbowych. Ale komputer wyświetla litery, emoji i filmy. Jak to możliwe? Odpowiedź brzmi: **Mapowanie** – każdy znak to po prostu **liczba** przypisana do symbolu.

---

## 🚪 Brama Konwersji: Oct i Hex

Zanim pójdziemy dalej, sprawdźmy Twoje umiejętności szybkiego przełączania się między systemami. Rozwiąż te dwa zamki, aby odblokować lekcję o znakach.

<data-gate>
  <data-number-system target="16, 47, 9, 19" base="8" digits="3">
    > [!NOTE]
    > To jest system ósemkowy. Aby uzyskać $16_{10}$, musisz wpisać $20_8$ ($2 \cdot 8 = 16$).
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system target="23, 13, 10, 25" base="16" digits="2">
    > [!NOTE]
    > To jest system szesnastkowy. Podpowiedź: $2 \cdot 16 = 32$. Ile brakuje do $47$? Brakuje $15$. A $15$ w Hex to... ?
  </data-number-system>
</data-gate>

---

## 📜 Tablica ASCII

Informatycy po prostu umówili się, że konkretna liczba oznacza konkretny znak. Ten standard nazywa się **ASCII** (American Standard Code for Information Interchange). Podstawowa tablica ma 7 bitów (128 znaków), ale my używamy wersji 8-bitowej (1 Bajt = 256 znaków).

### Znaki sterujące (0-31)

Pierwsze 32 pozycje to **niewidoczne znaki sterujące** - sygnały dla maszyn, nie dla ludzi:

| Dec | Hex | Nazwa | Co robi? |
| :---: | :---: | :--- | :--- |
| 0 | `00` | `NUL` | Pusty bajt – koniec tekstu w C/C++ |
| 9 | `09` | `TAB` | Tabulacja (wcięcie) |
| 10 | `0A` | `LF` | Nowa linia (Linux/Mac) |
| 13 | `0D` | `CR` | Powrót karetki (Windows: CR+LF) |
| 27 | `1B` | `ESC` | Escape – kolory w terminalu |

> [!TIP]
> Dlaczego Windows używa dwóch znaków na nową linię (`\r\n` = CR+LF), a Linux jednego (`\n` = LF)? To spadek po maszynach do pisania – "Carriage Return" cofał głowicę, "Line Feed" przesuwał papier.

### Znaki drukowalne (32-126)

| Zakres | Dec | Hex | Znaki | Wzorzec |
| :--- | :---: | :---: | :--- | :--- |
| Spacja | 32 | `20` | ` ` |  |
| Cyfry | 48-57 | `30`-`39` | `0`-`9` | Wartość = Dec $-\text{ }48$ |
| Wielkie litery | 65-90 | `41`-`5A` | `A`-`Z` | 26 liter po kolei |
| Małe litery | 97-122 | `61`-`7A` | `a`-`z` | 26 liter po kolei |
| Znaki specjalne | reszta | reszta | `!`, `@`, `#`, `+`, `=`... | Interpunkcja i operatory |

**Pełna tabela najważniejszych znaków:**

| Znak | Dec | Bin | Hex |
| :---: | :---: | :---: | :---: |
| Spacja | 32 | `0010 0000` | `20` |
| `0` | 48 | `0011 0000` | `30` |
| `9` | 57 | `0011 1001` | `39` |
| **A** | 65 | `0100 0001` | `41` |
| **B** | 66 | `0100 0010` | `42` |
| **Z** | 90 | `0101 1010` | `5A` |
| **a** | 97 | `0110 0001` | `61` |
| **b** | 98 | `0110 0010` | `62` |
| **z** | 122 | `0111 1010` | `7A` |

---

## 🕵️ Wzorce Bitowe: Ukryte Reguły

Tablica ASCII nie jest losowa - kryje w sobie eleganckie wzorce bitowe:

### Bit 5: Wielka vs Mała litera

Zauważ, że wielkie **A** ($65$) i małe **a** ($97$) różnią się dokładnie o **$32$**. A $32 = 2^5$, czyli **jeden bit**:

| Litera | Dec | Bin |
| :---: | :---: | :---: |
| **A** | 65 | `0`**`1`**`00 0001` |
| **a** | 97 | `0`**`1`**`10 0001` |

**Bit nr 5** (licząc od $0$ z prawej) działa jak **przełącznik wielkości**:
- Bit 5 = `0` - wielka litera
- Bit 5 = `1` - mała litera

> [!IMPORTANT]
> To nie przypadek! Projektanci ASCII celowo tak ułożyli tablicę, aby zamiana wielkości litery wymagała zmiany **jednego bita**. Procesor robi to jedną instrukcją XOR.

### Cyfry: Zamaskowane wartości

Cyfra `0` ma kod $48$ (`0011 0000`), a `9` ma $57$ (`0011 1001`). Aby uzyskać wartość liczbową cyfry, wystarczy **zamaskować górne 4 bity** (ustawić na `0000`):

| Znak | Bin | Dolne 4 bity | Wartość |
| :---: | :---: | :---: | :---: |
| `0` | `0011` **`0000`** | `0000` | $0$ |
| `5` | `0011` **`0101`** | `0101` | $5$ |
| `9` | `0011` **`1001`** | `1001` | $9$ |

---

## 🕶️ Czytanie Matrixa

Kiedy patrzysz na kod binarny lub szesnastkowy, Twój mózg może zacząć widzieć ukryte słowa. Spróbuj:

<data-gate>
  <data-quiz>
    <question>
Otrzymałeś od serwera ciąg bajtów w systemie szesnastkowym: `42 41 42 41`. Korzystając z powyższej tabelki ASCII, jakie słowo wyświetli komputer?
    </question>
    <options>
      <option correct>BABA</option>
      <option>ABBA</option>
      <option>AAAA</option>
    </options>
    <div data-hint="error">
      Spójrz na tabelkę: `41` (Hex) to 'A', a `42` (Hex) to 'B'. Teraz po prostu przeczytaj te cztery bajty po kolei.
    </div>
  </data-quiz>
</data-gate>

---

<data-gate>
  <data-quiz>
    <question>
Bajt `0100 1000` w ASCII to litera 'H'. Jaki bajt reprezentuje małe 'h'?
    </question>
    <options>
      <option correct>`0110 1000`</option>
      <option>`0100 1001`</option>
      <option>`1100 1000`</option>
    </options>
    <div data-hint="error">
      Przypomnij sobie regułę bitu $5$: aby zamienić wielką literę na małą, ustaw bit $5$ (szósty od prawej) na $1$. `0100 1000` → `0110 1000`.
    </div>
    <div data-hint="success">
      Brawo! Zmiana jednego bita - to właśnie elegancja projektowania ASCII. 🎯
    </div>
  </data-quiz>
</data-gate>

---

## 🗣️ Profesjonalny żargon: Prefixy

Na koniec nauczymy się, jak profesjonaliści zapisują systemy w kodzie, aby się nie pomylić. Zamiast pisać "10 w systemie szesnastkowym", używamy **Przedrostków (Prefixów)**:

| System | Prefix | Przykład | Wartość |
| :--- | :---: | :--- | :---: |
| Binarny | `0b` | `0b10` | $2$ |
| ósemkowy | `0o` | `0o10` | $8$ |
| Szesnastkowy | `0x` | `0x10` | $16$ |

> [!TIP]
> Zapamiętaj `0x`. To najczęstszy zapis w programowaniu, oznaczający system szesnastkowy.

---

## 🌐 Co dalej? Unicode i UTF-8

ASCII obsługuje tylko **128 znaków** - wystarczy dla angielskiego, ale co z polskimi `ą, ć, ę`? Japońskimi kanji? Emoji 🚀?

Standard **Unicode** przypisał numery **ponad 150 000 znakom** ze wszystkich języków świata. A **UTF-8** to sprytny sposób ich kodowania:

| Zakres znaków | Bajty | Przykład |
| :--- | :---: | :--- |
| ASCII (0-127) | 1 bajt | `A` = `0x41` |
| Polskie znaki | 2 bajty | `ą` = `0xC4 0x85` |
| Emoji | 4 bajty | 🎮 = `0xF0 0x9F 0x8E 0xAE` |

> [!NOTE]
> UTF-8 jest **wstecznie kompatybilny** z ASCII - każdy plik ASCII jest jednocześnie poprawnym plikiem UTF-8. To dlatego UTF-8 zdominował internet (ponad 98% stron).

## 📋 Pełne Tabele Kodowania (Ściąga)

<details>
<summary><b>Rozwiń: Zestawienie Podstawowe ASCII (0-127)</b></summary>
Poniżej znajdziesz pocięte dla czytelności bloki całkowitych, oficjalnych znaków natywnych komputerów przyporządkowanych od wartości 0 do 127.

<details>
<summary>Znaki Sterujące (0 - 31)</summary>
Niewidoczne komendy służące historycznie do sterowania dalekopisami i formowaniem druku.

| DEC | HEX | Skrót | Znaczenie |
|---|---|---|---|
| 0 | 00 | NUL | Znak pusty (Null) |
| 1 | 01 | SOH | Początek nagłówka |
| 2 | 02 | STX | Początek tekstu |
| 3 | 03 | ETX | Koniec tekstu |
| 4 | 04 | EOT | Koniec transmisji |
| 5 | 05 | ENQ | Zapytanie |
| 6 | 06 | ACK | Potwierdzenie |
| 7 | 07 | BEL | Dzwonek (Sygnał dźwiękowy) |
| 8 | 08 | BS | Backspace (Cofnięcie) |
| 9 | 09 | HT | Tabulacja pozioma |
| 10 | 0A | LF | Znak nowej linii (Line Feed) |
| 11 | 0B | VT | Tabulacja pionowa |
| 12 | 0C | FF | Nowa strona (Form Feed) |
| 13 | 0D | CR | Powrót karetki (Carriage Return) |
| 14 | 0E | SO | Przesunięcie wyjścia (Shift Out) |
| 15 | 0F | SI | Przesunięcie wejścia (Shift In) |
| 16 | 10 | DLE | Ucieczka łącza danych (Data Link Escape) |
| 17 | 11 | DC1 | Sterowanie urządzeniem 1 (XON) |
| 18 | 12 | DC2 | Sterowanie urządzeniem 2 |
| 19 | 13 | DC3 | Sterowanie urządzeniem 3 (XOFF) |
| 20 | 14 | DC4 | Sterowanie urządzeniem 4 |
| 21 | 15 | NAK | Negatywne potwierdzenie |
| 22 | 16 | SYN | Oczekiwanie synchroniczne |
| 23 | 17 | ETB | Koniec bloku transmisji |
| 24 | 18 | CAN | Anuluj |
| 25 | 19 | EM | Koniec nośnika |
| 26 | 1A | SUB | Zastąpienie |
| 27 | 1B | ESC | Escape (Ucieczka) |
| 28 | 1C | FS | Separator pliku |
| 29 | 1D | GS | Separator grupy |
| 30 | 1E | RS | Separator rekordu |
| 31 | 1F | US | Separator jednostki |
| 127 | 7F | DEL | Usuń (Delete) |
</details>

<details>
<summary>Znaki Specjalne i Interpunkcja</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 32 | 20 | | Spacja |
| 33 | 21 | ! | Wykrzyknik |
| 34 | 22 | " | Cudzysłów |
| 35 | 23 | # | Hashtag (Krzyżyk) |
| 36 | 24 | $ | Znak dolara |
| 37 | 25 | % | Znak procentu |
| 38 | 26 | & | Ampersand (And) |
| 39 | 27 | ' | Apostrof |
| 40 | 28 | ( | Nawias okrągły otwierający |
| 41 | 29 | ) | Nawias okrągły zamykający |
| 42 | 2A | * | Gwiazdka |
| 43 | 2B | + | Znak plus |
| 44 | 2C | , | Przecinek |
| 45 | 2D | - | Łącznik (Minus) |
| 46 | 2E | . | Kropka |
| 47 | 2F | / | Ukośnik (Slash) |
| 58 | 3A | : | Dwukropek |
| 59 | 3B | ; | Średnik |
| 60 | 3C | < | Znak mniejszości |
| 61 | 3D | = | Znak równości |
| 62 | 3E | > | Znak większości |
| 63 | 3F | ? | Znak zapytania |
| 64 | 40 | @ | Małpa (At) |
| 91 | 5B | [ | Nawias kwadratowy otwierający |
| 92 | 5C | \ | Ukośnik odwrotny (Backslash) |
| 93 | 5D | ] | Nawias kwadratowy zamykający |
| 94 | 5E | ^ | Daszek (Potęga) |
| 95 | 5F | _ | Podkreślenie |
| 96 | 60 | ` | Akcent słaby (Backtick) |
| 123 | 7B | { | Nawias klamrowy otwierający |
| 124 | 7C | \| | Pionowa kreska (Pipe) |
| 125 | 7D | } | Nawias klamrowy zamykający |
| 126 | 7E | ~ | Tylda |
</details>

<details>
<summary>Cyfry (48 - 57)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 48 | 30 | 0 | Cyfra Zero |
| 49 | 31 | 1 | Cyfra Jeden |
| 50 | 32 | 2 | Cyfra Dwa |
| 51 | 33 | 3 | Cyfra Trzy |
| 52 | 34 | 4 | Cyfra Cztery |
| 53 | 35 | 5 | Cyfra Pięć |
| 54 | 36 | 6 | Cyfra Sześć |
| 55 | 37 | 7 | Cyfra Siedem |
| 56 | 38 | 8 | Cyfra Osiem |
| 57 | 39 | 9 | Cyfra Dziewięć |
</details>

<details>
<summary>Litery Wielkie (65 - 90)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 65 | 41 | A | Wielka litera A |
| 66 | 42 | B | Wielka litera B |
| 67 | 43 | C | Wielka litera C |
| 68 | 44 | D | Wielka litera D |
| 69 | 45 | E | Wielka litera E |
| 70 | 46 | F | Wielka litera F |
| 71 | 47 | G | Wielka litera G |
| 72 | 48 | H | Wielka litera H |
| 73 | 49 | I | Wielka litera I |
| 74 | 4A | J | Wielka litera J |
| 75 | 4B | K | Wielka litera K |
| 76 | 4C | L | Wielka litera L |
| 77 | 4D | M | Wielka litera M |
| 78 | 4E | N | Wielka litera N |
| 79 | 4F | O | Wielka litera O |
| 80 | 50 | P | Wielka litera P |
| 81 | 51 | Q | Wielka litera Q |
| 82 | 52 | R | Wielka litera R |
| 83 | 53 | S | Wielka litera S |
| 84 | 54 | T | Wielka litera T |
| 85 | 55 | U | Wielka litera U |
| 86 | 56 | V | Wielka litera V |
| 87 | 57 | W | Wielka litera W |
| 88 | 58 | X | Wielka litera X |
| 89 | 59 | Y | Wielka litera Y |
| 90 | 5A | Z | Wielka litera Z |
</details>

<details>
<summary>Litery Małe (97 - 122)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 97 | 61 | a | Mała litera a |
| 98 | 62 | b | Mała litera b |
| 99 | 63 | c | Mała litera c |
| 100 | 64 | d | Mała litera d |
| 101 | 65 | e | Mała litera e |
| 102 | 66 | f | Mała litera f |
| 103 | 67 | g | Mała litera g |
| 104 | 68 | h | Mała litera h |
| 105 | 69 | i | Mała litera i |
| 106 | 6A | j | Mała litera j |
| 107 | 6B | k | Mała litera k |
| 108 | 6C | l | Mała litera l |
| 109 | 6D | m | Mała litera m |
| 110 | 6E | n | Mała litera n |
| 111 | 6F | o | Mała litera o |
| 112 | 70 | p | Mała litera p |
| 113 | 71 | q | Mała litera q |
| 114 | 72 | r | Mała litera r |
| 115 | 73 | s | Mała litera s |
| 116 | 74 | t | Mała litera t |
| 117 | 75 | u | Mała litera u |
| 118 | 76 | v | Mała litera v |
| 119 | 77 | w | Mała litera w |
| 120 | 78 | x | Mała litera x |
| 121 | 79 | y | Mała litera y |
| 122 | 7A | z | Mała litera z |
</details>
</details>

<details>
<summary><b>Rozwiń: Zestawienie Polskie (Windows-1250)</b></summary>
Zestawienie tzw. polskich ogonków rozszerzenia tabeli ASCII. 

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 165 | A5 | Ą | Wielka litera A z ogonkiem |
| 185 | B9 | ą | Mała litera a z ogonkiem |
| 198 | C6 | Ć | Wielka litera C z kreską (akcentem ostrym) |
| 230 | E6 | ć | Mała litera c z kreską |
| 202 | CA | Ę | Wielka litera E z ogonkiem |
| 234 | EA | ę | Mała litera e z ogonkiem |
| 163 | A3 | Ł | Wielka litera L z przekreśleniem |
| 179 | B3 | ł | Mała litera l z przekreśleniem |
| 209 | D1 | Ń | Wielka litera N z kreską |
| 241 | F1 | ń | Mała litera n z kreską |
| 211 | D3 | Ó | Wielka litera O z kreską |
| 243 | F3 | ó | Mała litera o z kreską |
| 140 | 8C | Ś | Wielka litera S z kreską |
| 156 | 9C | ś | Mała litera s z kreską |
| 143 | 8F | Ź | Wielka litera Z z kreską |
| 159 | 9F | ź | Mała litera z z kreską |
| 175 | AF | Ż | Wielka litera Z z kropką |
| 191 | BF | ż | Mała litera z z kropką |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Niemieckie (Iso / UTF-8)</b></summary>
Umlauty (przegłosy) i specjalna ligatura używane w języku niemieckim.

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 196 | C4 | Ä | Wielkie A z umlautem (przegłosem) |
| 228 | E4 | ä | Małe a z umlautem |
| 214 | D6 | Ö | Wielkie O z umlautem |
| 246 | F6 | ö | Małe o z umlautem |
| 220 | DC | Ü | Wielkie U z umlautem |
| 252 | FC | ü | Małe u z umlautem |
| 223 | DF | ß | Mała litera Eszett (ostre S) |
| 7838 | 1E9E | ẞ | Wielka litera Eszett (dodana w normie znacznie później) |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Hiszpańskie (Iso / UTF-8)</b></summary>
Znaki akcentowane oraz odwrócona interpunkcja specyficzne dla j. Hiszpańskiego.

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 193 | C1 | Á | Wielka litera A z akcentem |
| 225 | E1 | á | Mała litera a z akcentem |
| 201 | C9 | É | Wielka litera E z akcentem |
| 233 | E9 | é | Mała litera e z akcentem |
| 205 | CD | Í | Wielka litera I z akcentem |
| 237 | ED | í | Mała litera i z akcentem |
| 211 | D3 | Ó | Wielka litera O z akcentem |
| 243 | F3 | ó | Mała litera o z akcentem |
| 218 | DA | Ú | Wielka litera U z akcentem |
| 250 | FA | ú | Mała litera u z akcentem |
| 209 | D1 | Ñ | Wielka litera N z tyldą |
| 241 | F1 | ñ | Mała litera n z tyldą |
| 161 | A1 | ¡ | Odwrócony wykrzyknik |
| 191 | BF | ¿ | Odwrócony znak zapytania |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Japońskie Hiragana / Kanji (Unicode UTF-8)</b></summary>
Skromny wycinek znaków japońskich jako ciekawostka udowadniająca ogromną rozpiętość standardu UTF-8, używanego by móc pokazać każdy alfabet świata na Twoim ekranie używając wielobajtowego zapisu.

| DEC | HEX | Znak | Opis (Romaji) | Typ |
|---|---|:---:|---|---|
| 12354 | 3042 | あ | Litera *A* | Hiragana |
| 12356 | 3044 | い | Litera *I* | Hiragana |
| 12358 | 3046 | う | Litera *U* | Hiragana |
| 12360 | 3048 | え | Litera *E* | Hiragana |
| 12362 | 304A | お | Litera *O* | Hiragana |
| 12363 | 304B | か | Znak *Ka* | Hiragana |
| 12365 | 304D | き | Znak *Ki* | Hiragana |
| 12367 | 304F | く | Znak *Ku* | Hiragana |
| 26085 | 65E5 | 日 | *Dzień / Słońce* (Nichi) | Kanji |
| 26412 | 672C | 本 | *Książka / Korzeń* (Hon) | Kanji |
| 20154 | 4EBA | 人 | *Człowiek* (Hito) | Kanji |
| 26408 | 6728 | 木 | *Drzewo* (Ki) | Kanji |
| 35211 | 898B | 見 | *Widzieć* (Mi) | Kanji |
| 27700 | 6C34 | 水 | *Woda* (Mizu) | Kanji |
| 28779 | 706B | 火 | *Ogień* (Hi) | Kanji |
</details>

<data-ascii-converter></data-ascii-converter>
