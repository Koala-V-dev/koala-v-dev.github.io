# Dzielenie binarne

## ➗ Mechanizm skanowania szablonem

Dzielenie binarne polega na sekwencyjnym porównywaniu kolejnych okien dzielnej z dzielnikiem (szablonem):
- **Głowa `[G]`**: lewa granica aktualnego okna porównania.
- **Ogon `[O]`**: prawa granica okna, wskazująca dokładnie indeks obliczanego bitu ilorazu.

Przeanalizuj dzielenie $11_{10}$ (`1011`) przez $3_{10}$ (`11`):

<data-binary-process mode="template-divide" a="11" b="3"></data-binary-process>

#### Kroki powyższego procesu:
1. **Krok 1 (Ogon na indeksie 2)**: Okno dzielnej to `10`. Szablon `11` nie mieści się w oknie ($10_2 < 11_2$, czyli $2 < 3$). Na indeksie 2 ilorazu zapisujemy cyfrę $0$. **Kluczowa zasada**: gdy szablon się nie mieści, **rejestr roboczy pozostaje bez zmian** (`1011`), a w kolejnym kroku rozszerzamy okno kontekstu dzielnej o kolejny bit w prawo. Nie wykonujemy odejmowania, więc dzielenie nigdy nie generuje wartości ujemnych!
2. **Krok 2 (Ogon na indeksie 1)**: Okno obejmuje teraz `101`. Szablon `11` mieści się w oknie ($101_2 \ge 11_2$, czyli $5 \ge 3$). Na indeksie 1 ilorazu zapisujemy cyfrę $1$. Odejmujemy szablon od okna ($101 - 11 = 10$). W rejestrze roboczym pozostaje `0101`.
3. **Krok 3 (Ogon na indeksie 0)**: Okno to `101`. Szablon `11` mieści się w oknie ($101_2 \ge 11_2$). Na indeksie 0 ilorazu zapisujemy cyfrę $1$. Odejmujemy szablon od okna ($101 - 11 = 10$).
4. **Wynik końcowy**:
   - **Iloraz (część całkowita)**: $011_2 = 11_2$ ($3_{10}$).
   - **Reszta końcowa (modulo %)**: $10_2$ ($2_{10}$).
   - Sprawdzenie algebraiczne: $3 \cdot 3 + 2 = 11$.

#### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Dzielenie przez 2^k</b><b>Zależność algebraiczna</b></tabs>
<div>

Gdy dzielnikiem jest potęga dwójki $2^k$ (np. $2^3 = 8$), sprzętowo kosztowne dzielenie zastępujemy dwiema operacjami w 1 cyklu zegara:

- **Iloraz całkowity (`x >> k`)**: przesunięcie w prawo odcina $k$ najmłodszych bitów (np. `x >> 3` to dzielenie całkowite przez 8).
- **Reszta z dzielenia (`x & ((1 << k) - 1)`)**: wycięcie reszty za pomocą maski bitowej (np. `x & 7` to modulo 8).

##### Skąd bierze się maska <code>(1 << k) - 1</code> i jak działa filtr?
> <strong>Rozważmy dzielenie $x = 22_{10}$ przez **$8$** ($2^3$, czyli $k = 3$):</strong>
1. **Generowanie maski**: Przesunięcie `1 << 3` daje pojedynczą jedynkę o wadze $8$ ($1000_2$). Odjęcie $1$ zamienia tę jedynkę na kaskadę $3$ jedynek na niższych pozycjach:
   $$1000_2 - 1 = 0111_2 = 7_{10}$$
2. **Filtr reszty bramką AND (`&`)**: Bity od pozycji 3 w górę (wagi $8, 16, \dots$) to wielokrotności 8, więc dzielą się bez reszty. Resztę tworzą wyłącznie 3 najmłodsze bity ($4, 2, 1$), które maska $7$ (`0111₂`) przepuszcza bez zmian:

$$\begin{array}{rcc} x = 22_{10}: & 00010110_2 & (16 + 4 + 2) \\ \text{Maska } 7_{10}: & 00000111_2 & (\text{filtr 3 najmłodszych bitów}) \\ \hline x \ \& \ 7: & 00000110_2 & = 6_{10} \quad (\text{reszta: } 22 \pmod 8 = 6) \\ x \gg 3: & 00000010_2 & = 2_{10} \quad (\text{iloraz: } \lfloor 22 / 8 \rfloor = 2) \end{array}$$

Sprawdzenie: $2 \cdot 8 + 6 = 22_{10}$. Obie operacje (`>>` i `&`) procesor wykonuje w **dokładnie 1 cyklu zegara** zamiast kilkudziesięciu cykli instrukcji `div`.

</div>
<div>

W każdym pozycyjnym systemie liczbowym zachodzi fundamentalna relacja dzielenia całkowitego:

$$\text{Dzielna} = \text{Iloraz} \cdot \text{Dzielnik} + \text{Reszta}$$

Gdzie reszta spełnia warunek $0 \le \text{Reszta} < \text{Dzielnik}$. Gdy reszta wynosi zero, dzielna jest podzielna przez dzielnik.

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Koszt sprzętowy dzielenia i problem zbieżności działania odwrotnego</span>
<span class="deep-dive-badge">KRZEM & ARCHITEKTURA ALU</span>
</summary>
<div class="deep-dive-content">

#### Problem asymetrii i złożoności dzielenia w krzemie

W dodawaniu, odejmowaniu i mnożeniu operacje wykonujemy **od prawej do lewej** (od najmłodszego bitu do najstarszego). Sygnał elektryczny propaguje się w jedną stronę, a w mnożeniu wszystkie iloczyny cząstkowe można wyznaczyć jednocześnie i zsumować równolegle w drzewach sumatorów (1-3 cykle zegara).

Dzielenie działa w kierunku odwrotnym: w algorytmie dzielenia operujemy **od lewej do prawej** (od bitów najstarszych ku najmłodszym). Powstaje ścisła sekwencyjna zależność danych:
1. Nie można z góry określić cyfry ilorazu bez sprawdzenia, czy dzielnik mieści się w aktualnym oknie rejestru.
2. Układ wykonuje próbne odejmowanie. Jeśli powstanie pożyczka (wynik ujemny), odejmowanie trzeba natychmiast cofnąć i przywrócić poprzednią wartość rejestru (*Restoring Division*).
3. Dopiero po ustabilizowaniu się reszty z danego etapu można rozpocząć operację dla kolejnego bitu.

Z tego powodu dzielnika nie da się prosto zrównoleglić. Instrukcje dzielenia maszynowego (`div` / `idiv`) w architekturze x86-64 zajmują od 20 do nawet 40 cykli zegara.

---

#### Multiplekser 2:1 (MUX) jako przełącznik warunkowy

W algorytmie ręcznym przy każdym kroku podejmujemy decyzję:
- jeśli dzielnik mieści się w oknie: cyfra ilorazu wynosi 1, odejmujemy dzielnik od okna, a obliczona różnica staje się nową resztą,
- jeśli dzielnik się nie mieści: cyfra ilorazu wynosi 0, nie odejmujemy dzielnika (rejestr roboczy zachowuje poprzednią wartość), a okno rozszerza się w prawo o kolejny bit dla następnego kroku.

W układzie cyfrowym odpowiednikiem instrukcji `if/else` jest **Multiplekser 2:1 (MUX)**. Składa się z 4 bramek:
- 1 inwertera (NOT) negującego sygnał wyboru $S$,
- 2 bramek AND badających wejścia danych $D_1$ i $D_0$,
- 1 bramki OR łączącej sygnał: $Y = (D_1 \land S) \lor (D_0 \land \overline{S})$.

Gdy $S = 0$, aktywna jest dolna bramka AND i na wyjście trafia $D_0$. Gdy $S = 1$, wyjście przejmuje stan <span style="text-wrap: nowrap;">wejścia $D_1$.</span>

> [!CAUTION] MUX to układ scalony a nie zestaw bramek logicznych tak jak tu przedstawiono
> Dla celów dydaktycznych prezentuję logikę działania układu scalonego MUX przy użyciu bramek logicznych 

<data-logic-circuit type="mux-2to1"></data-logic-circuit>

W dzielniku sygnałem wyboru $S$ jest pożyczka (`Borrow`) z układu odejmującego:
- **Wejście $D_0$ (brak pożyczki, $S = 0$)**: przekazuje wyliczoną różnicę do nowej reszty, a zanegowana pożyczka ustala bit ilorazu $Q = 1$.
- **Wejście $D_1$ (powstała pożyczka, $S = 1$)**: przywraca pierwotną wartość dzielnej, a bit ilorazu wynosi $Q = 0$.

---

#### Kompletny 2-bitowy dzielnik sprzętowy (Restoring Divider)

<data-logic-circuit type="divider-2bit"></data-logic-circuit>

Układ łączy odjemniki i multipleksery w spójny potok obliczeniowy:
- **Wejścia układu**:
  - Bity dzielnej: $A_1$ (starszy) oraz $A_0$ (młodszy).
  - Bity dzielnika: $B_1$ (starszy) oraz $B_0$ (młodszy).
- **Pierwszy zestaw bramek (`ILORAZ Q1 & RESZTA 1`)**:
  - Bada starszy bit dzielnej: półodjemnik (XOR i AND) odejmuje dzielnik $B_0$ od bitu $A_1$.
  - Linia pożyczki łączy wyjście `Bout1` z wejściem wyboru $S$ multipleksera MUX 1:
    - gdy brak pożyczki (wyjście `Bout1 = 0`, wejście MUX $S = 0$): bit ilorazu wynosi $Q_1 = 1$, a MUX 1 zatwierdza różnicę $D_1$,
    - gdy wystąpi pożyczka (wyjście `Bout1 = 1`, wejście MUX $S = 1$): bit ilorazu wynosi $Q_1 = 0$, a MUX 1 przywraca stan początkowy $A_1$.
  - Wyjście MUX 1 tworzy resztę cząstkową `rem1` przekazywaną pionową magistralą do kolejnego kroku.
- **Drugi zestaw bramek (`ILORAZ Q0 & RESZTA (R1, R0)`)**:
  - Rozszerza okno w prawo o bit $A_0$, tworząc 2-bitową wartość roboczą (`rem1`, $A_0$).
  - Zestaw odjemników odejmuje pełny dzielnik ($B_1, B_0$) od utworzonej pary.
  - Wspólna linia pożyczki łączy wyjście `Bout2` z wejściami wyboru $S$ pary multiplekserów (MUX 2A dla $R_1$ i MUX 2B dla $R_0$):
    - gdy brak pożyczki (wyjście `Bout2 = 0`, wejście MUX $S = 0$): bit ilorazu wynosi $Q_0 = 1$, a MUX-y wyprowadzają wyliczoną różnicę jako ostateczną resztę ($R_1, R_0$),
    - gdy wystąpi pożyczka (wyjście `Bout2 = 1`, wejście MUX $S = 1$): bit ilorazu wynosi $Q_0 = 0$, a MUX-y przywracają poprzednie bity okna (`rem1`, $A_0$).
- **Karty wyjściowe**:
  - Rejestrują bity ilorazu ($Q_1 Q_0$) oraz reszty ($R_1 R_0$) z natychmiastowym przeliczeniem dziesiętnym.
  - Wbudowane inwertery NOT odwracają sygnały pożyczek na bity ilorazu ($Q = \overline{\text{Bout}}$).
- **_Bramka detekcji błędu (NOR)_**:
  - Sprzętowo bada obecność zer na dzielniku ($B_1 = 0 \land B_0 = 0$).
  - W przypadku dzielenia przez zero aktywuje czerwoną flagę błędu `ERR (DIV/0)`.

Przetestuj kluczowe przypadki na układzie:
- $3 \div 1$ ($A = 11_2, B = 01_2$): Iloraz $Q = 11_2$ ($3$), Reszta $R = 00_2$ ($0$).
- $3 \div 2$ ($A = 11_2, B = 10_2$): Iloraz $Q = 01_2$ ($1$), Reszta $R = 01_2$ ($1$).
- $2 \div 3$ ($A = 10_2, B = 11_2$): Iloraz $Q = 00_2$ ($0$), Reszta $R = 10_2$ ($2$).
- $B = 00_2$: sprzętowa blokada wyjścia przez bramkę NOR.

</div>
</details>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Eliminacja instrukcji DIV w kompilatorach (Algorytm Granlunda i Montgomery'ego)</span>
<span class="deep-dive-badge">C++ & WYDAJNOŚĆ ALU</span>
</summary>
<div class="deep-dive-content">

Skoro dzielenie sprzętowe jest tak powolne, inżynierowie szukali sposobu na wyeliminowanie instrukcji `div`, gdy dzielnik jest znany podczas kompilacji (np. `x / 5`). W <time datetime="1994">1994</time> roku Torbjörn Granlund i Peter L. Montgomery opublikowali przełomową pracę [Division by Invariant Integers using Multiplication (PDF)](https://gmplib.org/~tege/divcnst-pldi94.pdf), w której udowodnili, że dzielenie przez stałą można zastąpić szybkim mnożeniem i przesunięciem bitowym.

---

### 1. Zamiana dzielenia na iloczyn i przesunięcie

W matematyce dzielenie liczby $x$ przez dzielnik $d$ jest tożsame z mnożeniem przez odwrotność $\frac{1}{d}$:

$$x \div d = \frac{x}{d} = x \cdot \frac{1}{d}$$

Procesor w rejestrach całkowitych nie potrafi bezpośrednio pomnożyć przez ułamek $\frac{1}{d}$, ale potrafi błyskawicznie dzielić przez potęgę dwójki $2^N$ za pomocą przesunięcia bitowego w prawo (`>> N`) w 1 cyklu zegara.

Mnożymy ułamek $\frac{1}{d}$ przez formę jedynki $\frac{2^N}{2^N}$ (licznik i mianownik są równe, więc wartość wyrażenia pozostaje bez zmian):

$$x \cdot \frac{1}{d} = x \cdot \left( \frac{1}{d} \cdot \frac{2^N}{2^N} \right) = x \cdot \frac{1 \cdot 2^N}{d \cdot 2^N}$$

Ponieważ mnożenie w liczniku jest przemienne ($1 \cdot 2^N = 2^N \cdot 1$), możemy zamienić liczniki miejscami (dokładnie tak jak przy skracaniu ułamków na krzyż, np. $\frac{2}{3} \cdot \frac{1}{4} = \frac{1}{3} \cdot \frac{2}{4}$):

$$x \cdot \frac{1}{d} = x \cdot \left( \frac{2^N}{d} \cdot \frac{1}{2^N} \right) = x \cdot (2^N \div d) \cdot \frac{1}{2^N}$$

W tym momencie całe dzielenie zostało rozbite na dwa wyspecjalizowane człony:
- **Czynnik $2^N \div d$**: dzielnik $d$ jest znany kompilatorowi już na etapie budowania programu (np. w instrukcji `x / 5`). Kompilator dobiera odpowiednio dużą potęgę dwójki $2^N$ i oblicza stałą całkowitą z zaokrągleniem w górę:
  $$M = \left\lceil \frac{2^N}{d} \right\rceil$$
  Stała ta (nazywana w inżynierii kompilatorów *magicznym mnożnikiem*) wchłania dzielnik $d$, zamieniając dzielenie na pojedynczy iloczyn $x \cdot M$.
- **Czynnik $\cdot \frac{1}{2^N}$**: cofa wcześniejsze przeskalowanie przez $2^N$. Ponieważ jest to dzielenie przez potęgę dwójki, w krzemie odpowiada mu jedno przesunięcie bitowe w prawo (`>> N`).

W ten sposób kosztowna operacja dzielenia całkowitego przyjmuje postać:

$$\left\lfloor \frac{x}{d} \right\rfloor = \left\lfloor \frac{x \cdot M}{2^N} \right\rfloor = (x \cdot M) \gg N$$

---

#### Zrozumienie mechanizmu na małych liczbach (x = 9, d = 7)

Obliczmy dzielenie całkowite $9 \div 7 = 1$.

Dzielna $x = 9$ w zapisie binarnym to $1001_2$ (wymaga 4 bitów, ponieważ 3 bity mieszczą maksymalnie $2^3 - 1 = 7$). Wybieramy więc potęgę dwójki odpowiadającą temu 4-bitowemu rejestrowi: $N = 4$ ($2^4 = 16$):

1. Stała mnożnika:
   $$M = \left\lceil \frac{16}{7} \right\rceil = \lceil 2{,}285 \rceil = 3$$

> [!NOTE]
> **Nawiasy zaokrągleń w informatyce (sufit i podłoga):**
> - **Sufit $\lceil x \rceil$ (`ceil`)**: haczyki u góry oznaczają zaokrąglenie w górę do najbliższej liczby całkowitej, np. $\lceil 2{,}285 \rceil = 3$ lub $\lceil 5{,}3 \rceil = 6$.
> - **Podłoga $\lfloor x \rfloor$ (`floor`)**: haczyki na dole oznaczają zaokrąglenie w dół, czyli odcięcie części ułamkowej przy dzieleniu całkowitym, np. $\lfloor 27 / 16 \rfloor = \lfloor 1{,}6875 \rfloor = 1$.

2. Mnożenie wejścia przez $M$:
   $$9 \cdot 3 = 27$$
3. Przesunięcie bitowe w prawo o $N = 4$ pozycje (zamiast dzielenia przez 16):
   Liczba $27$ w systemie binarnym to `0001 1011₂`. Przesunięcie `>> 4` po prostu odrzuca 4 najmłodsze bity (`1011`), pozostawiając starszą część:
   $$0001\,1011_2 \gg 4 = \mathbf{0001_2} = \mathbf{1_{10}}$$

Dlaczego to rewolucja dla procesora?
Z ludzkiej perspektywy mogłoby się wydawać, że „zamieniliśmy dzielenie przez 7 na dzielenie przez 16”. Dla krzemu to jednak dwa zupełnie inne światy:
- Dzielenie przez dowolną liczbę (np. 7) wymaga uruchomienia powolnego układu dzielnika, blokując procesor na 20-40 cykli zegara (instrukcja `div`).
- Dzielenie przez potęgę dwójki $2^4$ w ogóle nie wymaga dzielenia. To przesunięcie bitowe rejestru (instrukcja `shr`), które procesor wykonuje w zaledwie **1 cyklu zegara**!

W ten sposób dzielenie $9 \div 7$ wykonujemy za pomocą jednego mnożenia ($9 \cdot 3$), które jest szybsze i jednego przesunięcia bitowego (`>> 4`), bez dotykania powolnego dzielnika sprzętowego.

---

#### Zastosowanie w kompilatorach (przykład x / 5 na x86-64)

Dokładnie ten sam trik stosują kompilatory C, C++ czy Rusta (GCC, Clang, MSVC), gdy optymalizują dzielenie przez stałą. Zobaczmy, co procesor robi z kodem `x / 5` dla 32-bitowej liczby całkowitej (`uint32_t`).

W typie 32-bitowym zmienna $x$ mieści się w zakresie od $0$ do ponad 4 miliardów ($2^{32} - 1$). Aby zaokrąglenie w górę zadziałało bezbłędnie dla każdej możliwej liczby z tego zakresu, kompilator dobiera potęgę dwójki o 2 bity większą od rejestru: $N = 32 + 2 = 34$ ($2^{34} = 17\,179\,869\,184$).

Kompilator wykonuje dwa proste kroki:

1. **Przeliczenie stałej $M$ podczas kompilacji (zanim program w ogóle wystartuje):**
   $$M = \left\lceil \frac{2^{34}}{5} \right\rceil = \left\lceil \frac{17\,179\,869\,184}{5} \right\rceil = 3\,435\,973\,837_{10} = \mathbf{\text{0xCCCCCCCD}_{16}}$$

2. **Wygenerowanie zaledwie dwóch instrukcji w asemblerze:**
   ```cpp
   uint32_t divideBy5(uint32_t x) {
       return x / 5;
   }
   ```
   Kompilator całkowicie pomija powolną instrukcję dzielenia `div`. Zamiast niej generuje:
   ```asm
   ; RDI = argument wejściowy x
   movabs  rcx, 0xCCCCCCCD       ; 1. Załaduj wyliczoną stałą M
   imul    rcx, rdi              ; 2. Szybkie mnożenie 64-bitowe (3 cykle)
   shr     rcx, 34               ; 3. Przesunięcie bitowe >> 34 (1 cykl)
   mov     eax, ecx              ; Zwróć wynik w rejestrze EAX
   ret
   ```

**Przetestujmy to w praktyce dla $x = 22$:**
- Dzielenie: $22 \div 5$
- Mnożenie: $22 \cdot \text{0xCCCCCCCD}_{16} = 75\,591\,424\,414$
- Przesunięcie o 34 bity w prawo: $75\,591\,424\,414 \gg 34 = \mathbf{4}$

**Bilans wydajności:**
- Klasyczne dzielenie (`div`): **20 - 40 cykli zegara**.
- Mnożenie i przesunięcie (`imul` + `shr`): zaledwie **4 cykle zegara**.
Zysk to niemal 10-krotne przyspieszenie każdej operacji dzielenia!

---

#### A jak kompilator oblicza resztę z dzielenia (operację modulo: x % 5)?

Gdy w kodzie C++ napiszesz `x % 5`, kompilator również nie uruchamia powolnej instrukcji dzielenia `div`.

Zamiast tego korzysta z podstawowej definicji dzielenia z resztą:
$$\text{reszta} = x - (\text{iloraz} \cdot d)$$

Skoro procesor wyznaczył już iloraz $q = 4$ w zaledwie 4 cyklach (za pomocą mnożenia i przesunięcia `>> 34`), do obliczenia reszty wystarczą mu dwie operacje:
1. Pomnożenie ilorazu przez dzielnik: $4 \cdot 5 = 20$. W architekturze x86 procesor wykonuje to w 1 cyklu (instrukcją `LEA` lub przesunięciem bitowym `(q << 2) + q`).
2. Szybkie odejmowanie:
   $$r = 22 - 20 = \mathbf{2}$$

W ten sposób procesor wyznaczył:
- **Iloraz całkowity:** $22 / 5 = \mathbf{4}$
- **Resztę z dzielenia (modulo):** $22 \% 5 = \mathbf{2}$

Obie wartości otrzymujemy w **5 cyklach zegara** bez dotykania układu dzielnika!

</div>
</details>

<data-gate>
  <data-arithmetic-challenge base="2" operation="/" count="2"></data-arithmetic-challenge>
</data-gate>


---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Dzielenie binarne** wykonuje się sekwencyjnie od lewej do prawej (*Restoring Division*), porównując okno rejestru z dzielnikiem i odcinając resztę.
- **Dzielenie przez potęgę dwójki ($2^k$)** redukuje się do przesunięcia w prawo (`x >> k`) dla ilorazu oraz maskowania bitowego (`x & ((1 << k) - 1)`) dla reszty modulo.
- **Multiplekser 2:1 (MUX)** stanowi sprzętowy przełącznik warunkowy (`if/else`), decydujący o zachowaniu reszty lub przywróceniu rejestru na podstawie sygnału pożyczki.
- **Optymalizacja stałych dzielników**: kompilatory zastępują powolną instrukcję `div` (20-40 cykli) mnożeniem przez stałą odwrotność $M$ i przesunięciem bitowym (4 cykle).
