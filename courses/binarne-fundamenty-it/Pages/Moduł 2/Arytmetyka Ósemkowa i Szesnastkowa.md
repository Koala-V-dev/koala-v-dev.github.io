# Arytmetyka ósemkowa i szesnastkowa

Zasady operacji arytmetycznych w systemach ósemkowym (baza 8) i szesnastkowym (baza 16) wynikają bezpośrednio z tych samych praw addytywnych i pożyczkowych co w systemie dwójkowym. Różnica polega wyłącznie na pojemności jednostkowej pozycji oraz progu wyznaczenia przeniesienia i pożyczki.

| Baza | Dozwolone symbole | Próg przeniesienia | Pożyczka (skok licznika) |
| :--- | :---: | :---: | :--- |
| **Baza 2 (BIN)** | $0 \dots 1$ | $\ge 2$ | Licznik przyjmuje stan **$1$**, starsza kolumna otrzymuje dług **$-1$** |
| **Baza 8 (OCT)** | $0 \dots 7$ | $\ge 8$ | Licznik przyjmuje stan **$7$**, starsza kolumna otrzymuje dług **$-1$** |
| **Baza 10 (DEC)** | $0 \dots 9$ | $\ge 10$ | Licznik przyjmuje stan **$9$**, starsza kolumna otrzymuje dług **$-1$** |
| **Baza 16 (HEX)** | $0 \dots \text{F}$ | $\ge 16$ | Licznik przyjmuje stan **$\text{F}$**, starsza kolumna otrzymuje dług **$-1$** |

---

## 🎱 System ósemkowy (baza 8): operacje z progiem 8

W bazie 8 alfabet cyfr obejmuje zakres od $0$ do $7$. Każda wartość równa $8$ lub większa powoduje przeniesienie nadmiaru do sąsiedniej, wyższej pozycji.

### ➕ Dodawanie w bazie 8 (37 + 25)

<data-binary-process mode="carry-borrow" base="8" operation="+" a="31" b="21"></data-binary-process>

#### Kroki procesu:
1. **Kolumna 0 (jedności)**: $7 + 5 = 12_{10}$. W bazie 8 mieści się jedna pełna baza ($8$) oraz reszta: $12 - 8 = 4$. Na pozycji wpisujemy cyfrę **$4$**, a przeniesienie **$+1$** przekazujemy do kolumny 1.
2. **Kolumna 1 (ósemki)**: $3 + 2 + 1\text{ (przeniesienie)} = 6$. Wartość mieści się w dopuszczalnym alfabecie ($6 < 8$), więc wpisujemy cyfrę **$6$** bez generowania kolejnego przeniesienia.
3. **Wynik**: _**$64_8$**_ (weryfikacja dziesiętna: $31 + 21 = 52_{10} = 64_8$).

### ➖ Odejmowanie w bazie 8 (52 - 37)

<data-binary-process mode="carry-borrow" base="8" operation="-" a="42" b="31"></data-binary-process>

#### Kroki procesu:
1. **Kolumna 0 ($2 - 7$)**: Ponieważ $2 < 7$, występuje lokalny deficyt $5$. Kolumna zaciąga pożyczkę od kolumny 1 (starszy stopień otrzymuje dług **$-1$**). Licznik pozycji cofa się z $0$ na maksymalną cyfrę bazy (**$7$**). Cofnięcie spłaca $1$ jednostkę długu, pozostawiając $4$ jednostki. Wynik pozycji wynosi $7 - 4 = \mathbf{3}$.
2. **Kolumna 1 ($5 - 3$ z długiem $-1$)**: Cyfra $5$ pomniejszona o pożyczkę wynosi $4$. Po odjęciu $3$ otrzymujemy $4 - 3 = \mathbf{1}$.
3. **Wynik**: _**$13_8$**_ (weryfikacja dziesiętna: $42 - 31 = 11_{10} = 13_8$).

### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Mnożenie ósemkowe</b><b>Dzielenie ósemkowe</b></tabs>
<div>

Mnożenie pisemne wykonuje się pozycja po pozycji. Iloczyny równe lub większe od $8$ rozdziela się na krotność bazy (przeniesienie) oraz resztę:
- Działanie: $25_8 \times 14_8$
- Mnożenie przez cyfrę 4:
  - $4 \times 5 = 20_{10} = 2 \times 8 + 4 \to$ wynik **$4$**, przeniesienie **$2$**
  - $4 \times 2 + 2 = 10_{10} = 1 \times 8 + 2 \to$ wynik **$2$**, przeniesienie **$1$**
  - Pierwszy wiersz częściowy: $124_8$
- Mnożenie przez cyfrę 1 (przesunięcie o 1 pozycję w lewo): $250_8$
- Suma wierszy częściowych: $124_8 + 250_8 = \mathbf{374_8}$

</div>
<div>

Dzielenie w systemie ósemkowym opiera się na porównywaniu fragmentu dzielnej z dzielnikiem:
- Działanie: $124_8 \div 4_8$

<details>
<summary>Rozpisanie toku myślenia krok po kroku (jak to policzyć w pamięci)</summary>

Tak jak w dzieleniu binarnym, nasz dzielnik czyli $4_8$ jest wzorcem (szablonem). Zaczynamy od lewej strony porównywać kolejne cyfry dzielnej $124_8$:
1. Cyfra **1**: nie mieści w sobie $4$, więc okno kontekstu musi się rozszerzyć do dwóch cyfr: **$12_8$**.
2. Mamy pierwsze działanie: **$12_8 \div 4_8$**. Aby nie pomylić się przy liczeniu w pamięci, rzutujemy to na dobrze znany system dziesiętny za pomocą szybkiego grupowania binarnego (pamiętasz paczki 3-bitowe?):
   - $1_8$ = `001`
   - $2_8$ = `010`
   - Sklejamy $1_8$ i $2_8$: otrzymujemy `001010_2`, co dziesiętnie daje dokładnie **$10_{10}$**.
   - Dzielnik $4_8$ to binarnie `100_2`, czyli dziesiętna **$4_{10}$**.
   - Dzielimy w dziesiętnym: $10_{10} \div 4_{10} = \mathbf{2_{10}}$ oraz **$2_{10}$ reszty**. Wynik $2_{10}$ to w ósemkowym po prostu **$2_8$**.
3. Do otrzymanej reszty $2$ dołączamy kolejną cyfrę dzielnej ($4$) i otrzymujemy liczbę **$24_8$**.
4. Teraz tę liczbę zamieniamy na system dziesiętny:
   - $2_8$ = `010`, $4_8$ = `100` $\to$ `010100_2` = **$20_{10}$** (lub z wag: $2 \times 8 + 4 = 20$).
   - Dzielimy: $20_{10} \div 4_{10} = \mathbf{5_{10}}$ (co w ósemkowym daje dokładnie **$5_8$**), reszta $0$.
5. Zestawiamy oba uzyskane wyniki ($2$ oraz $5$) i otrzymujemy ostateczny wynik: **$25_8$**.

</details>

- Krok 1: $12_8 \div 4_8 = 10_{10} \div 4_{10} = \mathbf{2}$ i reszta **$2$**
- Krok 2: do reszty $2$ dołączamy kolejną cyfrę $4$, uzyskując $24_8 = 20_{10}$
- Krok 3: $20_{10} \div 4_{10} = \mathbf{5}$
- Wynik końcowy: _**$25_8$**_

</div>
</data-tabs>

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>
</data-gate>

---

## 🧮 System szesnastkowy (baza 16): operacje ze znakami A-F

W systemie szesnastkowym litery od $\text{A}$ do $\text{F}$ reprezentują wartości dziesiętne od $10$ do $15$. Próg przeniesienia do kolejnej pozycji wynosi $16$.

### ➕ Dodawanie w bazie 16 (3A + 2F)

<data-binary-process mode="carry-borrow" base="16" operation="+" a="58" b="47"></data-binary-process>

#### Kroki procesu:
1. **Kolumna 0**: $\text{A}_{16} (10_{10}) + \text{F}_{16} (15_{10}) = 25_{10}$. Odejmujemy bazę: $25 - 16 = 9$. Na pozycji zapisujemy cyfrę **$9$**, a przeniesienie **$+1$** przekazujemy do kolumny 1.
2. **Kolumna 1**: $3 + 2 + 1\text{ (przeniesienie)} = 6$. Wartość mieści się w alfabecie szesnastkowym, wpisujemy cyfrę **$6$**.
3. **Wynik**: _**$69_{16}$**_ (weryfikacja dziesiętna: $58 + 47 = 105_{10} = 69_{16}$).

### ➖ Odejmowanie w bazie 16 (B3 - 4E)

<data-binary-process mode="carry-borrow" base="16" operation="-" a="179" b="78"></data-binary-process>

#### Kroki procesu:
1. **Kolumna 0 ($3 - \text{E}$)**: Ponieważ $3 < 14$, występuje deficyt $11$. Kolumna pobiera pożyczkę od kolumny 1 (starszy sąsiad otrzymuje dług **$-1$**). Licznik cofa się na maksymalną cyfrę bazy: **$\text{F}$** ($15_{10}$). Skok ten niweluje $1$ jednostkę długu, pozostawiając $10$. Wynik pozycji wynosi $15 - 10 = \mathbf{5}$.
2. **Kolumna 1 ($\text{B} - 4$ z długiem $-1$)**: Znak $\text{B}$ ($11_{10}$) po oddaniu długu ma wartość $10$ ($\text{A}_{16}$). Obliczamy: $10 - 4 = \mathbf{6}$.
3. **Wynik**: _**$65_{16}$**_ (weryfikacja dziesiętna: $179 - 78 = 101_{10} = 65_{16}$).

### ✖️ Mnożenie w bazie 16 (2A × B)

Mnożenie w systemie szesnastkowym ($2\text{A}_{16} \times \text{B}_{16}$):
- Wartości składników: $\text{A}_{16} = 10_{10}$, $\text{B}_{16} = 11_{10}$
- $\text{B} \times \text{A} = 11 \times 10 = 110_{10}$. Dzielimy przez bazę $16$: $110 = 6 \times 16 + 14 \to$ wpisujemy cyfrę **$\text{E}$** ($14$), a przeniesienie **$6$** wędruje do wyższej pozycji.
- $\text{B} \times 2 + 6 = 22 + 6 = 28_{10}$. Dzielimy przez bazę $16$: $28 = 1 \times 16 + 12 \to$ wpisujemy cyfrę **$\text{C}$** ($12$), a przeniesienie **$1$** zapisujemy na początku.
- Wynik końcowy: _**$1\text{CE}_{16}$**_ (weryfikacja dziesiętna: $42 \times 11 = 462_{10} = 1\text{CE}_{16}$).

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Adresowanie pamięci RAM, bufor 0x1000 i arytmetyka wskaźników</span>
<span class="deep-dive-badge">C++ & PAMIĘĆ SYSTEMOWA</span>
</summary>
<div class="deep-dive-content">

#### Model liniowej przestrzeni adresowej i przesunięcie (offset)

Pamięć operacyjna stanowi ciągłą przestrzeń adresowaną bajtowo. Każdy bajt posiada unikalny adres fizyczny zapisywany w systemie szesnastkowym, gdzie jeden bajt odpowiada dokładnie dwóm cyfrom HEX (`0x00` do `0xFF`).

Ciągły blok pamięci przydzielony procesowi wyznacza **adres bazowy** (*base address*, np. `0x1000`). Dowolną pozycję wewnątrz tego bloku określa **offset**, czyli przesunięcie w bajtach względem bazy:

$$\text{Adres docelowy} = \text{Adres bazowy} + \text{Offset}$$

Dla bufora o adresie bazowym `0x1000` odczyt danych z przesunięciem $32$ bajtów ($20_{16}$) stanowi bezpośrednie dodawanie w systemie szesnastkowym:

$$\text{0x1000} + \text{0x0020} = \mathbf{\text{0x1020}}$$

<data-memory-buffer-inspector base="0x1000" offset="0x0020" type="int32_t"></data-memory-buffer-inspector>

#### Arytmetyka wskaźników w językach systemowych C i C++

W asemblerze oraz językach C, C++ i Rust operacja dodawania do wskaźnika nie przesuwa adresu o pojedyncze bajty, lecz o wielokrotność rozmiaru wskazywanego typu danych:

$$\text{Adres} = \text{Base} + (\text{Index} \times \operatorname{sizeof}(T))$$

```cpp
#include <cstdint>

int32_t* ptr = reinterpret_cast<int32_t*>(0x1000);

// Inkrementacja o 1 przesuwa adres o sizeof(int32_t) = 4 bajty:
ptr = ptr + 1; // 0x1004

// Indeks 8 przesuwa adres o 8 * 4 = 32 bajty (0x20 w HEX):
ptr = ptr + 8; // 0x1020
```

#### Wyrównanie do granic słowa maszynowego (<span class="color-blue">Memory Alignment</span>)

Magistrala danych nowoczesnych procesorów 64-bitowych pobiera dane w słowach 8-bajtowych. Odczyt zmiennej 4-bajtowej z adresu wyrównanego do wielokrotności 4 (`adres & 0x3 == 0`, np. `0x1000`, `0x1004`, `0x1020`) wykonuje się w jednym cyklu magistrali pamięci.

Umieszczenie zmiennej pod adresem niewyrównanym (np. `0x1003`) przecina granicę dwóch słów maszynowych. Kontroler pamięci musi wykonać dwa odrębne odczyty magistrali, przesunąć bity w rejestrach i scalić wynik, co obniża przepustowość lub generuje sprzętowy wyjątek *Alignment Fault* na architekturach RISC/ARM.

#### Granice stron pamięci (<span class="color-blue">Page Boundaries</span>)

Jednostka zarządzania pamięcią (MMU) zarządza pamięcią w ramkach o rozmiarze $4\text{ KB}$ ($4096_{10} = 1000_{16}$ bajtów). W 32- i 64-bitowym adresie wirtualnym 3 najmłodsze cyfry szesnastkowe (`0x000` do `0xFFF`) stanowią bezpośredni offset wewnątrz strony, natomiast starsze pozycje identyfikują numer strony fizycznej.

</div>
</details>

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>
</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>
</data-gate>

---

## 🔒 Weryfikacja: Arytmetyka w bazach 8 i 16

<data-gate>
  <data-connection-matcher title="Granice i Odruchy Baz 8 i 16">
    <item left="Baza 8: dodanie $7_8 + 1_8$" right="Wynik $10_8$ (pozycja $0$, przeniesienie $1$)"></item>
    <item left="Baza 16: dodanie $\text{F}_{16} + 1_{16}$" right="Wynik $10_{16}$ (pozycja $0$, przeniesienie $1$)"></item>
    <item left="Baza 8: pożyczka przy $0 - 1$" right="Cofnięcie licznika na $7$ i spłata długu"></item>
    <item left="Baza 16: pożyczka przy $0 - 1$" right="Cofnięcie licznika na $\text{F}$ i spłata długu"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Arytmetyka w dowolnym systemie pozycyjnym podlega tym samym prawom algebry addytywnej: zmianie ulega wyłącznie stała podstawy bazy (próg przeniesienia i wartość pożyczki).
- W systemie ósemkowym (baza $8$) przeniesienie generuje suma równa $8$ lub większa, a pojedyncza pożyczka dostarcza $8$ jednostek (licznik cofa się na $7$).
- W systemie szesnastkowym (baza $16$) przeniesienie generuje suma równa $16$ lub większa, a pojedyncza pożyczka dostarcza $16$ jednostek (licznik cofa się na $\text{F}$).
- Pojedyncza cyfra ósemkowa reprezentuje dokładnie 3 bity (triadę), a pojedyncza cyfra szesnastkowa reprezentuje dokładnie 4 bity (tetradę / półbajt).
- Adresowanie pamięci w systemie szesnastkowym bezpośrednio odzwierciedla wyrównanie słów maszynowych oraz granice stron w architekturze sprzętowej.
