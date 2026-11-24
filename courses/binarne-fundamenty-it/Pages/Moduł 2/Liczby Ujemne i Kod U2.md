# Liczby Ujemne i Kod U2

W architekturze komputerów liczby ujemne są niezbędne do modelowania zwrotu wektorów, ujemnych bilansów zasobów, różnic temperatur czy przesunięć wstecznych w strukturach danych.

W grafice 3D, silnikach fizycznych oraz modelowaniu przestrzennym odwrócenie zwrotu wektora (np. odbicie promienia światła od powierzchni czy zmiana zwrotu wektora prędkości) to inwersja znaków wszystkich jego współrzędnych: 
$$\vec{V} = [X, Y, Z] \to -\vec{V} = [-X, -Y, -Z]$$
Na poziomie rejestrów procesora realizuje to kod U2.

<data-vector-u2 x="4" y="5" z="3"></data-vector-u2>

W krzemie nie istnieje fizyczny znak minus ($-$). Rejestry procesora składają się z elementów, które działają jak miniaturowe przełączniki i mają tylko _**dwa stabilne stany**_ (stąd określenie *komórki bistabilne*). Albo płynie przez nie prąd i reprezentują stan wysoki (**$1$**), albo prąd nie płynie i reprezentują stan niski (**_$0$_**).

Nie ma w nich trzeciego stanu, kreski ani symbolu minusa. Aby procesor mógł operować na liczbach ujemnych, potrzebujemy jednoznacznej umowy matematycznej.

Standardem stosowanym w architekturze współczesnych procesorów jest **Kod U2 (Uzupełnienie do Dwóch, *Two's Complement*)**.

---

## 🎯 Koncepcja ujemnej wagi bitu najstarszego (MSB)

Czym różni się standardowy zapis binarny od zapisu liczb ze znakiem?

- **NKB** (_**Naturalny Kod Binarny**_): reprezentuje wyłącznie liczby nieujemne, czyli matematyczny zbiór liczb naturalnych $\mathbb{N}$ (od niem. *natürliche Zahlen*):
  $$\mathbb{N} = \{0, 1, 2, 3, \dots\}$$
  Każdy bit ma wagę dodatnią będącą kolejną potęgą dwójki: $1, 2, 4, 8, 16, 32, 64, 128\dots$

- **Kod U2** (zapis ze znakiem): rozszerza reprezentację o wartości ujemne, pokrywając zbiór liczb całkowitych $\mathbb{Z}$ (od niem. *ganze Zahlen*, skąd pochodzi oznaczenie $\mathbb{Z}$):
  $$\mathbb{Z} = \{\dots, -3, -2, -1, 0, 1, 2, 3, \dots\}$$

Przejście ze zbioru $\mathbb{N}$ do $\mathbb{Z}$ realizuje **MSB** (*Most Significant Bit*), czyli **najbardziej znaczący bit** na pierwszej pozycji po lewej stronie (o najwyższej potędze). To właśnie on decyduje o znaku liczby.

W kodzie U2 obowiązuje jedna kluczowa reguła: <strong>najstarszy bit (**MSB**) otrzymuje wagę ujemną (**_$-2^{N-1}$_**)</strong>. Wszystkie pozostałe bity po prawej stronie zachowują swoje standardowe wagi dodatnie.

Rozkład wag dla słowa 8-bitowego (bajt), gdzie najstarsza pozycja posiada wagę **_$-128$_**:

| Indeks pozycji   |    $7$     |  $6$   |  $5$   |  $4$   |  $3$  |  $2$  |  $1$  |  $0$  |
| :--------------- | :--------: | :----: | :----: | :----: | :---: | :---: | :---: | :---: |
| **Waga bitu**    | **_-128_** | **64** | **32** | **16** | **8** | **4** | **2** | **1** |
| **Wartość bitu** |  **_1_**   |   0    | **1**  |   0    |   0   |   0   |   0   |   0   |

Aby zapisać liczbę **$-96$**, aktywujemy wagę ujemną ($-128$) oraz dodajemy do niej wagę dodatnią $+32$:
$$-128 + 32 = -96$$

Zapis binarny liczby $-96$ w formacie $8$-bitowym przyjmuje postać: `1010 0000`.

---

## 🧩 Zagadka typowania: Semantyka wektora bitów

Dzięki ujemnej wadze najstarszego bitu ten sam rejestr może reprezentować liczby ze znakiem (*signed*) lub bez znaku (*unsigned*). Zmianie ulega dopuszczalny zakres:

| Format danych                | Typ w C / C++ / Rust | Zakres wartości ($8$ bitów) | Zakres wartości ($16$ bitów) |
| :--------------------------- | :------------------- | :-------------------------: | :--------------------------: |
| **Bez znaku (UNSIGNED)**     | `uint8_t` / `u8`     |        $0 \dots 255$        |      $0 \dots 65\,535$       |
| **Ze znakiem (U2 / SIGNED)** | `int8_t` / `i8`      |      $-128 \dots +127$      |  $-32\,768 \dots +32\,767$   |

> [!IMPORTANT]
> **Neutralność bitów w pamięci fizycznej:**  
> Pamięć RAM przechowuje wyłącznie ładunki elektrostatyczne. Same zera i jedynki nie informują same z siebie, czy dany ciąg bitów jest traktowany jako liczba dodatnia, czy ujemna.
> 
> Rozważmy wektor ośmiu jedynek: `1111 1111`.
> - Przy interpretacji **UNSIGNED**:  
>   $$128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = \mathbf{255}$$
> - Przy interpretacji w kodzie **U2 (SIGNED)**:  
>   $$-128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = \mathbf{-1}$$
> 
> Bity w pamięci są semantycznie neutralne. To kompilator i typ danych w kodzie źródłowym determinują, jakie instrukcje asemblera przetworzą dany rejestr.

---

## 🔄 Algorytm zmiany znaku: Inwersja i dodanie jedynki ($\neg A + 1$)

Wyznaczanie wartości przeciwnej w kodzie U2 odbywa się za pomocą reguły sprzętowej: **zaneguj wszystkie bity wektora i dodaj $1$**.

Wizualizacja procesu konwersji liczby $+5$ na liczbę przeciwną $-5$:

<data-binary-process mode="u2-invert" target="5"></data-binary-process>

#### Matematyczne uzasadnienie reguły $\neg A + 1$:
Gdy dokonamy negacji bitowej liczby $A$ (oznaczanej symbolem $\neg A$ lub `~A`), suma pierwotnego wektora oraz jego negacji da ciąg samych jedynek:
$$A + \neg A = \text{1111 1111} = -1$$

Dodając $1$ do obu stron równości algebraicznej, otrzymujemy:
$$A + (\neg A + 1) = 0 \implies -A = \neg A + 1$$

Ta tożsamość sprawia, że w krzemie zmiana znaku wymaga zaledwie jednorazowego przepuszczenia sygnału przez inwertery NOT i podania sygnału $C_{in} = 1$ na sumator.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Formalny wzór matematyczny U2 i symbol sumy Sigma</span>
<span class="deep-dive-badge">MATEMATYKA DYSKRETNA</span>
</summary>
<div class="deep-dive-content">

Formalna definicja matematyczna wartości liczby całkowitej w kodzie U2 dla słowa o długości $N$ bitów ma postać:

$$X_{U2} = -b_{N-1} \cdot 2^{N-1} + \sum_{i=0}^{N-2} b_i \cdot 2^i$$

Rozbijmy ten wzór na poszczególne składowe, aby zrozumieć realizowane przez niego operacje.

#### Składowe formuły U2

Wartość $X_{U2}$ jest sumą dwóch odrębnych członów:

1. **Weryfikacja najstarszego bitu (MSB)**: $-b_{N-1} \cdot 2^{N-1}$
   Sprawdza stan bitu na pozycji $N-1$. Jeśli $b_{N-1} = 0$, cały człon przyjmuje wartość $0$ (liczba nieujemna). Jeśli $b_{N-1} = 1$, do wyniku wchodzi ujemna waga o wartości $-2^{N-1}$ (dla $8$ bitów jest to $-128$).

2. **Sumowanie wag dodatnich (symbol Sigma)**: $\sum_{i=0}^{N-2} b_i \cdot 2^i$
   Oblicza sumę iloczynów wszystkich pozostałych, młodszych pozycji bitowych i ich dodatnich potęg dwójki.

#### Symbol Sigma jako algorytm pętli sumującej

Wielka grecka litera **$\Sigma$ (Sigma)** jest matematycznym zapisem algorytmu sumowania ciągu. Składa się z trzech podstawowych parametrów:
- **Wartość początkowa** (dolny indeks $i = 0$): punkt startowy iteracji.
- **Wartość końcowa** (górny indeks $N - 2$): warunek zakończenia iteracji na przedostatnim bicie.
- **Operacja pojedynczego kroku** ($b_i \cdot 2^i$): wymnożenie wartości bitu ($0$ lub $1$) przez wagę jego pozycji.

W kodzie C++ operator $\Sigma$ odpowiada klasycznej pętli for z akumulatorem sumy:

```cpp
// Odpowiednik członu Sigma w kodzie C++:
int sum = 0;
for (int i = 0; i <= N - 2; ++i) {
    sum += b[i] * (1 << i); // b[i] * 2^i
}

// Pełna wartość liczby U2 po uwzględnieniu bitu MSB:
int x_u2 = -(b[N - 1] * (1 << (N - 1))) + sum;
```

#### Przeliczenie krok po kroku dla słowa 4-bitowego (1011)

Dla słowa $4$-bitowego ($N=4$) o bitach $b_3=1$, $b_2=0$, $b_1=1$, $b_0=1$:

1. **Człon najstarszego bitu MSB ($i = N-1 = 3$):**
   $$-b_3 \cdot 2^3 = -1 \cdot 8 = \mathbf{-8}$$

2. **Pętla sumacyjna $\Sigma$ dla indeksów od $i=0$ do $i=2$:**
   - Krok $i=0$: $b_0 \cdot 2^0 = 1 \cdot 1 = 1$
   - Krok $i=1$: $b_1 \cdot 2^1 = 1 \cdot 2 = 2$
   - Krok $i=2$: $b_2 \cdot 2^2 = 0 \cdot 4 = 0$
   - Suma z pętli:
     $$\sum_{i=0}^{2} b_i \cdot 2^i = 1 + 2 + 0 = \mathbf{+3}$$

3. **Złożenie wyniku końcowego:**
   $$X_{U2} = -8 + (+3) = \mathbf{-5}$$

</div>
</details>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Konwersja rozmiaru rejestru i rozszerzanie znaku (Sign Extension)</span>
<span class="deep-dive-badge">ARCHITEKTURA x86 & ASEMBLER</span>
</summary>
<div class="deep-dive-content">

Podczas konwersji zmiennej do formatu o większej szerokości bitowej (np. z 8 bitów do 32 bitów) procesor musi zachować poprawność arytmetyczną wartości:

#### Rozszerzenie zerami (Zero Extension) dla typów unsigned

Gdy przepisujesz mniejszą zmienną do większego rejestru (np. z 8-bitowego bajtu do 32-bitowej liczby całkowitej `int32_t`):
- Dla liczb bez znaku (unsigned) nowe, puste bity po lewej stronie po prostu wypełnia się zerami.
- W architekturze x86-64 służy do tego rozkaz `MOVZX` (*Move with Zero-Extend*):
```asm
movzx eax, byte ptr [rsi]  ; Kopiuje 8-bitowy bajt do rejestru 32-bitowego EAX, a starsze 24 bity zeruje
```

#### Rozszerzenie znaku (Sign Extension) dla liczb ujemnych U2

Co się stanie, gdy liczbę ujemną $-5$ (8-bitowo: `1111 1011`) rozszerzymy do 16 bitów dopisując same zera?
Otrzymamy `0000 0000 1111 1011`, czyli dodatnią liczbę $+251$. Liczba ujemna nagle zmieniła znak i wartość.

Aby zachować wartość ujemną w szerszym rejestrze, procesor musi powielić najstarszy bit znaku (MSB) na wszystkie nowo dodane pozycje w lewo (*Sign Extension*):
- Liczba $+5$ (8 bitów): `0000 0101` $\to$ (16 bitów): `0000 0000 0000 0101` (powielamy bit 0)
- Liczba $-5$ (8 bitów): `1111 1011` $\to$ (16 bitów): `1111 1111 1111 1011` (powielamy bit 1)

W procesorach x86 odpowiada za to rozkaz **`MOVSX`** (*Move with Sign-Extend*) przy rozszerzaniu np. z 8 do 16 lub 32 bitów, oraz **`MOVSXD`** przy rozszerzaniu wartości 32-bitowej (`int` w C++) do rejestru 64-bitowego (`long long` / wskaźnik).

</div>
</details>

---

## 🔒 Weryfikacja: Połącz reprezentacje bitowe z wartościami

<data-gate>
  <data-connection-matcher title="Weryfikacja Notacji U2 i Typów">
    <item left="`1111 1111` w typie UNSIGNED" right="Wartość 255 (2^8 - 1)"></item>
    <item left="`1111 1111` w kodzie U2" right="Wartość -1 (-128 + 127)"></item>
    <item left="`1000 0000` w kodzie U2" right="Wartość -128 (dolny limit bajtu)"></item>
    <item left="Algorytm zmiany znaku w U2" right="Odwróć bity i dodaj 1 (~A + 1)"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W kodzie U2 najstarszy bit (MSB) ma wagę ujemną ($-2^{N-1}$), co pozwala na symetryczną realizację liczb dodatnich i ujemnych w jednym rejestrze.
- Rejestry pamięci fizycznej są semantycznie neutralne: o interpretacji wektora bitów decyduje typ danych zadeklarowany w kodzie programu.
- Wyznaczenie wartości przeciwnej w kodzie U2 opiera się na formule $\neg A + 1$ (inwersja bitów i dodanie jedynki).
- Zwiększanie szerokości bitowej liczb signed wymaga powielenia bitu znaku (*Sign Extension*, instrukcja `MOVSX`), zapobiegając zafałszowaniu wartości.
