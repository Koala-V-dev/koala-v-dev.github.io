# Dzielenie z Resztą i Operacja Modulo

Dzielenie całkowite oraz operacja wyznaczania reszty (**modulo: `%`**) to fundamenty logiki obliczeniowej w kwalifikacjach **INF.02**, **INF.03** oraz **INF.04**.

Procesor realizując dzielenie na liczbach całkowitych, wyznacza równolegle dwie odrębne wartości:
1. **Iloraz całkowity (`/`)**: liczbę pełnych wielokrotności dzielnika mieszczących się w dzielnej (część ułamkowa zostaje odcięta bez zaokrąglania).
2. **Resztę z dzielenia (`%`)**: wartość, która pozostała po wydzieleniu wszystkich pełnych grup.

Na tej parze wyników bazuje konwersja systemów liczbowych, algorytmy badania parzystości, obsługa buforów cyklicznych oraz rozbijanie liczb na pojedyncze cyfry.

---

## ➗ Struktura relacji: Iloraz całkowity i Reszta

Dla dowolnej liczby całkowitej $a$ (dzielnej) oraz niezerowej liczby naturalnej $b$ (dzielnika) istnieje dokładnie jedna para liczb całkowitych: iloraz $q$ oraz reszta $r$, spełniająca zależność:

$$a = q \cdot b + r \qquad \text{gdzie} \quad 0 \le r < b$$

W architekturze komputerowej i językach programowania wyniki te obsługują dwa odrębne operatory:
- **Dzielenie całkowite (`/`)**: zwraca iloraz $q = \lfloor a / b \rfloor$ (część ułamkowa zostaje odcięta w kierunku zera).
- **Operator Modulo (`%`)**: odczytuje resztę $r$, czyli resztkową wartość niepodzielną przez dzielnik.

Przykładowo dla operacji $22 \div 5$:
- Iloraz: $22 \ / \ 5 = \mathbf{4}$
- Reszta: $22 \ \% \ 5 = \mathbf{2}$
- Zależność: $4 \cdot 5 + 2 = 22$

---

## 🎯 Praktyczne zastosowania operatora Modulo (%)

W inżynierii oprogramowania i algorytmice niskopoziomowej reszta z dzielenia jest jednym z najczęściej wykorzystywanych mechanizmów sterujących:

### 1. Test parzystości i podzielności
Weryfikacja najmłodszego bitu lub reszty z dzielenia przez $2$:
```cpp
if (wartosc % 2 == 0) {
    // Liczba parzysta: brak reszty
}
```

### 2. Arytmetyka modularna i bufory kołowe (<span class="color-blue">Ring Buffers</span>)
Operator modulo umożliwia zamykanie indeksów w skończonym przedziale cyklicznym $[0, N-1]$. Po osiągnięciu końca bufora indeks automatycznie wraca do pozycji początkowej:
```cpp
// Przesunięcie wskaźnika w buforze cyklicznym o rozmiarze CAPACITY:
headIndex = (headIndex + 1) % CAPACITY;
```

### 3. Odwzorowanie przestrzeni wielowymiarowych w pamięci liniowej (1D ↔ 2D)
Pamięć RAM jest jednowymiarową magistralą adresową. Współrzędne siatki o szerokości $W$ wyznacza się z indeksu liniowego za pomocą pary operacji:
- Kolumna: $X = \text{indeks} \ \% \ W$
- Wiersz: $Y = \text{indeks} \ / \ W$

---

## ⚠️ Liczby ujemne w operacji Modulo: C++ vs Python

Jedną z najczęstszych pułapek w programowaniu systemowym jest różnica w implementacji reszty dla ujemnej dzielnej:

| Język / Standard | Operacja `-7 / 3` | Operacja `-7 % 3` | Typ podziału |
| :--- | :---: | :---: | :--- |
| **C / C++ / Rust / Java** | **-2** | **-1** | Obcięcie w stronę zera (*Truncating Division*) |
| **Python / Ruby** | **-3** | **+2** | Zaokrąglenie w dół (*Floored Division*) |

W standardzie C99 i C++11 wprowadzono regułę obcięcia w stronę zera (*truncation toward zero*), co oznacza, że znak reszty jest zawsze zgodny ze znakiem dzielnej:
$$(-7) = (-2) \cdot 3 + (-1)$$

W matematyce i kryptografii reszta z definicji musi być nieujemna ($0 \le r < b$). Aby w języku C++ uzyskać matematyczne modulo z liczby o dowolnym znaku, stosuje się formułę ochronną:
```cpp
int mod = ((x % b) + b) % b;
```

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Rejestry EDX:EAX, koszt IDIV i optymalizacja Invariant Division</span>
<span class="deep-dive-badge">ARCHITEKTURA x86 & KOMPILATORY</span>
</summary>
<div class="deep-dive-content">

#### Sprzętowa natura operacji IDIV (para rejestrów EDX:EAX)

W architekturze procesora operacje dzielenia całkowitego oraz wyznaczania reszty wykonuje ten sam fizyczny moduł wykonawczy (Divider):

```cpp
int iloraz = a / b;
int reszta = a % b;
```

Dla powyższego kodu kompilator nie emituje dwóch odrębnych operacji maszynowych. W architekturze x86 instrukcja `IDIV` (oraz jej bezznakowy wariant `DIV`) operuje na połączonej parze rejestrów:

1. **Przygotowanie podwójnej szerokości bitowej**: Dzielna ładowana jest do rejestru `EAX`. Instrukcja `CDQ` (*Convert Doubleword to Quadword*) kopiuje bit znaku z `EAX` na wszystkie bity rejestru `EDX`, tworząc 64-bitową parę `EDX:EAX`.
2. **Wykonanie dzielenia**: Rozkaz `idiv ecx` wykonuje dzielenie 64-bitowej pary `EDX:EAX` przez 32-bitowy dzielnik znajdujący się w `ECX`.
3. **Pobranie wyników ze sprzętu**:
   - `EAX` otrzymuje iloraz całkowity ($a / b$),
   - `EDX` otrzymuje resztę z dzielenia ($a \% b$).

Ponieważ oba wyniki powstają jednocześnie w ramach jednego cyklu wykonawczego jednostki dzielącej, pobranie reszty bezpośrednio obok ilorazu jest operacją bezkosztową.

#### Koszt sprzętowy dzielnika i optymalizacje binarne

Instrukcja `IDIV` jest jedną z najwolniejszych operacji arytmetycznych w architekturze CPU. Podczas gdy dodawanie (`ADD`) lub przesunięcie bitowe zajmuje 1 cykl zegara, a mnożenie (`IMUL`) około 3-4 cykli, sprzętowe dzielenie `IDIV` blokuje potok wykonawczy na 20 do nawet 45 cykli zegara.

Z tego powodu optymalizatory kompilatorów eliminują instrukcję `IDIV`, gdy tylko dzielnik jest znany na etapie kompilacji.

#### 1. Dzielenie przez potęgi dwójki (przesunięcia i maskowanie)

Gdy dzielnik jest potęgą dwójki ($d = 2^k$):

- **Dla liczb bez znaku (unsigned)**:
  - Dzielenie to pojedyncze logiczne przesunięcie w prawo: `n >> k` (instrukcja `SHR`, 1 cykl).
  - Reszta modulo to wymaskowanie najmłodszych $k$ bitów: `n & (2^k - 1)` (instrukcja `AND`, 1 cykl).
  ```cpp
  uint32_t iloraz = n / 8; // kompilowane do: n >> 3
  uint32_t reszta = n % 8; // kompilowane do: n & 0x07 (0000 0111 w binarnym)
  ```

- **Dla liczb ze znakiem (signed U2)**:
  Samo arytmetyczne przesunięcie `SAR` zaokrągla w dół (w stronę $-\infty$), podczas gdy standard C++ wymaga zaokrąglenia w stronę zera (*truncation toward zero*). Kompilator dodaje więc warunkową korektę (*bias*) przed wykonaniem przesunięcia:
  ```asm
  mov  edx, eax
  sar  edx, 31          ; edx otrzymuje same 1 jeśli liczba jest ujemna, lub same 0 jeśli dodatnia
  and  edx, 7           ; edx = 7 (dla liczb ujemnych) lub 0 (dla dodatnich)
  add  eax, edx         ; dodanie korekty do dzielnej
  sar  eax, 3           ; arytmetyczne przesunięcie w prawo (iloraz n / 8)
  ```

#### 2. Dzielenie przez dowolną stałą: Invariant Division (magiczne liczby)

Gdy dzielnik $d$ nie jest potęgą dwójki (np. $d = 3, 5, 10$), kompilatory stosują algorytm Granlunda-Montgomery'ego (*Invariant Division*). Zastępuje on dzielenie mnożeniem przez stałoprzecinkową odwrotność $\frac{1}{d}$ zwaną **liczbą magiczną** $M$:

$$\frac{n}{d} = \frac{n \times M}{2^{32 + s}} = (n \times M) \gg (32 + s)$$

gdzie $M = \left\lceil \frac{2^{32 + s}}{d} \right\rceil$, a $s$ to dodatkowe przesunięcie bitowe.

Rozważmy dzielenie przez $5$ (`n / 5`) dla zmiennej `uint32_t`:
- Liczba magiczna wynosi $M = \text{0xCCCCCCCD}$ (reprezentuje ułamek $\frac{4}{5} \times 2^{32}$).
- Wynik mnożenia 32-bitowego `n * M` to słowo 64-bitowe. Starsze 32 bity tego iloczynu trafiają bezpośrednio do rejestru `EDX`, co sprzętowo oznacza darmowe podzielenie przez $2^{32}$.
- Pozostaje przesunięcie o $s = 2$ pozycje w prawo:

```asm
; Obliczenie n / 5 dla zmiennej uint32_t:
mov  eax, edi         ; edi = dzielna n
mov  edx, 0xCCCCCCCD  ; edx = magiczna liczba M
mul  edx              ; iloczyn 64-bitowy w parze EDX:EAX (EDX = (n * M) >> 32)
shr  edx, 2           ; EDX = ostateczny iloraz q (koszt: ok. 4 cykle zegara zamiast 40)
```

Wyznaczenie reszty (`n % 5`) nie wymaga już żadnych operacji dzielenia. Kompilator wykorzystuje wyliczony iloraz $q$ i stosuje tożsamość $r = n - (q \times d)$:

```asm
; Obliczenie reszty n % 5 mając iloraz q w EDX:
lea  eax, [edx + edx * 4] ; eax = q * 5 (szybkie mnożenie w 1 cyklu instrukcją LEA)
sub  edi, eax             ; edi = n - (q * 5), czyli poszukiwana reszta
```

Dzięki temu całe dzielenie całkowite wraz z operacją modulo wykonuje się w 4-5 cykli zegara, bez angażowania powolnej jednostki `IDIV`.

</div>
</details>

---

## 🔒 Weryfikacja: Dzielenie całkowite i modulo

<data-gate>
  <data-connection-matcher title="Dzielenie Całkowite i Operacja Modulo">
    <item left="Dzielenie całkowite: `22 / 5`" right="Iloraz: wartość 4 (pełne grupy)"></item>
    <item left="Operacja modulo: `22 % 5`" right="Reszta: wartość 2 (to co zostało)"></item>
    <item left="Test parzystości liczby: `n % 2`" right="Wynik 0 (parzysta) lub 1 (nieparzysta)"></item>
    <item left="Obrót zegara: `(20 + 8) % 24`" right="Godzina 4 rano (zamknięcie w cyklu)"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Dzielenie euklidesowe rozkłada liczbę na iloraz całkowity $q$ oraz resztę $r$ spełniającą relację $a = q \cdot b + r$.
- Operator modulo (`%`) odczytuje resztę z dzielenia, stanowiąc podstawę implementacji buforów kołowych, tablic mieszających oraz mapowania pamięci wielowymiarowej.
- Standardy C/C++ realizują dzielenie z obcięciem do zera (*truncating division*), w którym znak reszty jest tożsamy ze znakiem dzielnej.
- W architekturze x86 instrukcja `IDIV` zwraca jednocześnie iloraz w rejestrze `EAX` oraz resztę w rejestrze `EDX`.
