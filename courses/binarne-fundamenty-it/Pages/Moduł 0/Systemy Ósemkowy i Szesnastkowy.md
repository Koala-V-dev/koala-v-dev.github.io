# Systemy ósemkowy i szesnastkowy


Zapis binarny jest idealny dla procesora, ale trudny do szybkiego odczytania przez człowieka. Zapisanie liczby $255$ jako ciągu ośmiu jedynek (`11111111`) bywa uciążliwe i sprzyja pomyłkom. Z tego powodu informatycy stosują dwa skróty: system ósemkowy (*oktalny*) oraz szesnastkowy (*heksadecymalny*).

---

## 8️⃣ System ósemkowy (oktalny)

System ósemkowy wykorzystuje cyfry od **$0$ do $7$**. Każda cyfra ósemkowa reprezentuje dokładnie **trzy bity** informacji.

### ⚙️ Jak działa przeliczanie dwójkowo-ósemkowe?

Ponieważ baza systemu ósemkowego ($8$) jest trzecią potęgą dwójki ($2^3 = 8$), konwersja między systemem binarnym a ósemkowym opiera się na prostym grupowaniu bitów po **trzy** (od prawej strony do lewej):

1. **Z systemu binarnego na ósemkowy**:
   Weźmy liczbę binarną `110101`. Dzielimy ją na grupy po 3 bity, licząc od prawej:
   - Prawa grupa: `101` (wartość dziesiętna: $1 \times 2^2 + 0 \times 2^1 + 1 \times 2^0 = 5$)
   - Lewa grupa: `110` (wartość dziesiętna: $1 \times 2^2 + 1 \times 2^1 + 0 \times 2^0 = 6$)
   Zapisujemy cyfry obok siebie i otrzymujemy: $65_8$.
  > Co gdy mamy wartość `11010`? Wtedy uzupełniamy zapis o zero wiodące, czyli `011010` i otrzymujemy $32_8$.

2. **Z systemu ósemkowego na binarny**:
   Każdą cyfrę ósemkową rozpisujemy niezależnie na 3 bity. Weźmy liczbę $73_8$:
   - Cyfra $7$ to binarnie `111`
   - Cyfra $3$ to binarnie `011` (pamiętamy o zachowaniu wiodącego zera, aby otrzymać dokładnie $3$ bity)
   Łączymy wyniki w jeden ciąg: $111011_2$.

### 🐧 Zastosowanie praktyczne: uprawnienia w systemie Linux

Gdy administrator systemu Linux wpisuje polecenie `chmod 755 plik.txt`, korzysta bezpośrednio z zapisu ósemkowego. Trzy cyfry określają uprawnienia kolejno dla: właściciela pliku, grupy użytkowników oraz pozostałych osób.

Każda cyfra to suma trzech niezależnych praw (bitów), które mogą być włączone ($1$) lub wyłączone ($0$):
- **Bit odczytu** (`r` — od ang. *read*) o wadze **$4$** ($2^2$ lub binarnie `100`).
- **Bit zapisu** (`w` — od ang. *write*) o wadze **$2$** ($2^1$ lub binarnie `010`).
- **Bit wykonania** (`x` — od ang. *execute*) o wadze **$1$** ($2^0$ lub binarnie `001`).

Suma tych uprawnień tworzy jedną cyfrę ósemkową:
- `7` ($4 + 2 + 1$) oznacza pełne prawa: odczyt, zapis i wykonanie (`rwx`, binarnie `111`).
- `5` ($4 + 0 + 1$) oznacza odczyt i wykonanie (`r-x`, binarnie `101`).

Dlatego `755` oznacza, że właściciel może wszystko a grupa i pozostali mogą go jedynie czytać i uruchamiać.

---

## 🧮 System szesnastkowy (heksadecymalny)

To najpopularniejszy system zapisu w informatyce. Korzysta z szesnastu znaków: cyfr od $0$ do $9$ oraz liter od $A$ do $F$, które odpowiadają wartościom dziesiętnym od $10$ do $15$:

- $A = 10$
- $B = 11$
- $C = 12$
- $D = 13$
- $E = 14$
- $F = 15$

Jeden znak szesnastkowy (nazywany skrótowo **HEX**) odpowiada dokładnie **czterem bitom** (półbajtowi, czyli nazywanym w żargonie *nibble*). Dzięki temu jeden bajt (osiem bitów) można zapisać za pomocą zaledwie dwóch cyfr szesnastkowych (np. zapis `FF` reprezentuje bajt o wartości `1111 1111`).

### ⚙️ Jak działa przeliczanie dwójkowo-szesnastkowe?

Baza systemu szesnastkowego ($16$) to czwarta potęga dwójki ($2^4 = 16$). Konwersja polega na grupowaniu bitów po **cztery** (od prawej do lewej):

1. **Z systemu binarnego na szesnastkowy**:
   Weźmy liczbę binarną `1110101`. Dzielimy ją na grupy po $4$ bity od prawej (w razie potrzeby dopełniając lewą stronę zerami wiodącymi):
   - Prawa grupa: `0101` (wartość dziesiętna: $5$)
   - Lewa grupa (uzupełniona zerem wiodącym): `0111` (wartość dziesiętna: $7$)
   Otrzymujemy zapis szesnastkowy: $75_{16}$.

2. **Z systemu szesnastkowego na binarny**:
   Każdą cyfrę szesnastkową rozpisujemy na $4$ bity. Przekonwertujmy liczbę $A3_{16}$:
   - Znak $A$ (wartość $10$) to binarnie `1010`
   - Cyfra $3$ (wartość $3$) to binarnie `0011` (zawsze pełne $4$ bity)
   Łączymy wyniki w jeden ciąg: $10100011_2$.

|  HEX  | Binarnie | Dziesiętnie |
| :---: | :------: | :---------: |
|  `1`  |  `0001`  |     $1$     |
|  `9`  |  `1001`  |     $9$     |
|  `A`  |  `1010`  |    $10$     |
|  `F`  |  `1111`  |    $15$     |

> [!CAUTION]
> Warto pamiętać, że znak `F` nie jest po prostu synonimem liczby piętnaście. Reprezentuje on wartość piętnaście w systemie dziesiętnym ($15_{10}$). Jeśli jednak przekonwertujemy `F` na system ósemkowy, otrzymamy zapis $17_8$. Każdy zapis liczbowy ma sens tylko w powiązaniu z bazą swojego systemu.

---

### 🎨 Kolory w formacie szesnastkowym

Najpopularniejszym miejscem codziennego kontaktu z zapisem szesnastkowym jest paleta kolorów <span class="color-box"><span class="R">R</span><span class="G">G</span><span class="B">B</span></span> (skrót od ang. **_Red_**, **Green**, *Blue*). Każda barwa na ekranie monitora powstaje z wymieszania trzech składowych o intensywności od $0$ do $255$ (co odpowiada dokładnie jednemu bajtowi zakresu dla każdej składowej).

Przykładowo, czysty kolor biały (maksymalna intensywność wszystkich trzech składowych) zapisujemy jako:
- RGB: `(255, 255, 255)`
- HEX: `#FFFFFF` (gdzie `FF` oznacza maksymalną wartość $255$ dla każdej z trzech składowych)

<data-gate>
  <data-quiz>
    <question>
Kolor czysty zielony w formacie HEX ma zapis `#00FF00`. Pierwsze dwa znaki określają barwę czerwoną, kolejne dwa zieloną, a dwa ostatnie niebieską. Ile bajtów zajmuje taki zapis w pamięci?
    </question>
    <options>
      <option correct>3 bajty. Po jednym bajcie dla każdej składowej.</option>
      <option>6 bajtów. Bo zapis składa się z 6 znaków.</option>
      <option>1 bajt. Ponieważ wszystkie składowe tworzą w efekcie jeden kolor.</option>
    </options>

<div data-hint="error">
  Pamiętaj, że jeden znak szesnastkowy to cztery bity. Dwa znaki (np. „FF” lub „00”) to osiem bitów, czyli dokładnie jeden bajt. Policz, ile par znaków składa się na zapis „#00FF00”.
</div>
  </data-quiz>
</data-gate>

---

## 🛠️ Rozwijanie liczb pozycyjnych w dowolnej bazie

Aby przeliczyć liczbę z systemu ósemkowego lub szesnastkowego bezpośrednio na system dziesiętny, stosujemy dokładnie tę samą zasadę sumowania wag pozycji, którą poznałeś w pierwszej lekcji. Jedyną różnicą jest podstawa potęgowania (baza).

Każdą cyfrę mnożymy przez bazę systemu podniesioną do potęgi odpowiadającej jej pozycji (licząc od prawej strony, zaczynając od zera).

### 🀄 Przykład 1: Konwersja z systemu ósemkowego (Base 8)

Przeliczmy liczbę $157_8$ na system dziesiętny. Zobaczmy, jak rozkładają się poszczególne pozycje:

| Pozycja (Indeks od prawej) |      2       |      1      |      0      |
| :------------------------- | :----------: | :---------: | :---------: |
| **Cyfra ósemkowa**         |    **1**     |    **5**    |    **7**    |
| **Waga pozycji (Mnożnik)** | $8^2$ ($64$) | $8^1$ ($8$) | $8^0$ ($1$) |

Teraz mnożymy każdą cyfrę przez jej mnożnik i sumujemy wyniki:

$$\textcolor{#ff0001}{\text{Wartość dziesiętna}} = (1 \times 8^2) + (5 \times 8^1) + (7 \times 8^0)$$
$$\textcolor{#ff0001}{\text{Wartość dziesiętna}} = (1 \times 64) + (5 \times 8) + (7 \times 1) = 64 + 40 + 7 = \textcolor{#ff0004}{111}$$

### 🃏 Przykład 2: Konwersja z systemu szesnastkowego (Base 16)

Przeliczmy liczbę $1\text{A}_{16}$ na system dziesiętny. Pamiętamy, że litera $\text{A}$ ma wartość $10$:

| Pozycja (Indeks od prawej)   |       1       |      0       |
| :--------------------------- | :-----------: | :----------: |
| **Znak szesnastkowy**        |     **1**     |    **A**     |
| **Wartość dziesiętna znaku** |      $1$      |     $10$     |
| **Waga pozycji (Mnożnik)**   | $16^1$ ($16$) | $16^0$ ($1$) |

Pomnóżmy wartości przez ich mnożniki i zsumujmy:

$$\textcolor{#ff0002}{\text{Wartość dziesiętna}} = (1 \times 16^1) + (10 \times 16^0)$$
$$\textcolor{#ff0002}{\text{Wartość dziesiętna}} = (1 \times 16) + (10 \times 1) = 16 + 10 = \textcolor{#ff0004}{26}$$

---

## 🚀 Stacja treningowa: konwersja systemów liczbowych

Przeanalizuj poniższe ćwiczenia i spróbuj samodzielnie dokonać konwersji podanych wartości:

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Czapki z głów! 🎓
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Ale ciśniesz! 😎
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już jest wyższa szkoła jazdy! 🚗
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Jest pompa! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Wchodzisz na wyższy level! 🚀
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Matematyczna poezja! ✨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Tak się robi robotę! 🔧🔥
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Elegancko to ogarniasz! 🎩
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Liczby tańczą jak im zagrasz! 💃🕺
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już prawie sztuka! 🎨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Jesteś jak liczbowy ninja! 🥷
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Mistrzostwo świata! 🏆
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Jednak dalej pamiętasz binarkę! 🤯
  </data-number-system>
</data-gate>

---

Opanowanie konwersji między systemami dwójkowym, ósemkowym i szesnastkowym to kluczowy krok w zrozumieniu, jak procesor komunikuje się z pamięcią. W kolejnych lekcjach przyjrzymy się bliżej strukturze danych i kolejnym operacjom bitowym.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- System ósemkowy (baza 8) grupuje bity po 3, a system szesnastkowy (baza 16) po 4.
- W systemie szesnastkowym wartości od $10$ do $15$ są reprezentowane literami od $A$ do $F$.
- Dwa znaki HEX odpowiadają dokładnie jednemu bajtowi ($8$ bitów), co czyni ten system idealnym m.in. do zapisu kolorów w formacie RGB lub adresów pamięci.
