# Arytmetyka binarna

Matematyka, której uczysz się w szkole, jest nieskończona. Zawsze możesz dodać kolejną cyfrę z lewej strony w postaci zer wiodących. Technologia komputerowa jest jednak skończona i deterministyczna. Procesor operuje na rejestrach o sztywnym rozmiarze, które mają swoje nieprzekraczalne limity.

W tym module skupimy się na standardzie *16-bitowym* (typ `short` stosowany np. w języku C++). Mieści on dokładnie $2^{16} = 65\ 536$ kombinacji. Jest to limit przestrzeni liczbowej dla tego typu danych.

---

## ➕ Dodawanie z mechanizmem przeniesienia

Dodawanie binarne opiera się na prostych regułach:

| Działanie |  Wynik  |
| :-------: | :-----: |
|  $0 + 0$  | **$0$** |
|  $0 + 1$  | **$1$** |
|  $1 + 0$  | **$1$** |

Problem pojawia się wtedy, gdy suma jedynek w kolumnie wynosi $2$ lub $3$. Wtedy następuje _**przeniesienie**_ (ang. *carry*) do kolejnej pozycji po lewej stronie, analogicznie do dodawania pisemnego w systemie dziesiętnym, gdy suma cyfr w kolumnie przekracza $9$.

| Suma w kolumnie                   |  Wynik  |          Nowe przeniesienie           |
| :-------------------------------- | :-----: | :-----------------------------------: |
| $1 + 1$                           | **$0$** | **$1$** dla kolejnej kolumny po lewej |
| $1 + 1 +$ *$1$ (z przeniesienia)* | **$1$** | **$1$** dla kolejnej kolumny po lewej |
| $0 + 1 +$ *$1$ (z przeniesienia)* | **$0$** | **$1$** dla kolejnej kolumny po lewej |

---

**Przykład dodawania ($3 + 1$):**

| Przeniesienie             | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Dodajemy 0 i 0 oraz przeniesienie 1 z poprzedniej kolumny. Wynik wynosi 1, nie generując kolejnego przeniesienia." aria-label="Dodajemy 0 i 0 oraz przeniesienie 1 z poprzedniej kolumny. Wynik wynosi 1, nie generując kolejnego przeniesienia.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Mamy cyfry 1 i 0 oraz przeniesienie 1 z poprzedniej kolumny. Ich suma wynosi 2 (binarnie 10). Wpisujemy 0 w wyniku, a nową 1 przenosimy dalej w lewo." aria-label="Mamy cyfry 1 i 0 oraz przeniesienie 1 z poprzedniej kolumny. Ich suma wynosi 2 (binarnie 10). Wpisujemy 0 w wyniku, a nową 1 przenosimy dalej w lewo.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Suma w tej kolumnie wynosi 2 (binarnie 10). Wpisujemy 0 w wyniku, a 1 przenosimy do kolejnej kolumny po lewej." aria-label="Suma w tej kolumnie wynosi 2 (binarnie 10). Wpisujemy 0 w wyniku, a 1 przenosimy do kolejnej kolumny po lewej.">←</span> |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Składnik A $(3)_{10}$** |                                                                                                                                                                              $0$                                                                                                                                                                               |                                                                                                                                                                                                                  $1$                                                                                                                                                                                                                   |                                                                                                                                                                          $1$                                                                                                                                                                           |
| **Składnik B $(1)_{10}$** |                                                                                                                                                                              $0$                                                                                                                                                                               |                                                                                                                                                                                                                  $0$                                                                                                                                                                                                                   |                                                                                                                                                                          $1$                                                                                                                                                                           |
| **Wynik $(4)_{10}$**      |                                                                                                                                                                            **$1$**                                                                                                                                                                             |                                                                                                                                                                                                                **$0$**                                                                                                                                                                                                                 |                                                                                                                                                                        **$0$**                                                                                                                                                                         |

<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>
</data-gate>

---

## ➖ Odejmowanie: reguła „niwelowania i cofania”

Odejmowanie w dowolnym pozycyjnym systemie liczbowym o bazie $B$, podobnie jak w systemie dziesiętnym, opiera się na pożyczaniu wartości od lewego sąsiada. Najwygodniejszym i uniwersalnym sposobem na zrozumienie tego procesu jest _**reguła niwelowania i cofania**_. Działa ona niezależnie od bazy systemu (dwójkowej, ósemkowej, dziesiętnej czy szesnastkowej) i eliminuje potrzebę skomplikowanego dodawania bazy w pamięci.

> [!IMPORTANT]
> Mechanizm pożyczki uruchamia się **_wyłącznie wtedy, gdy od cyfry mniejszej odejmujesz większą ($y < x$)_**.
> Jeśli cyfra odjemnej jest większa lub równa cyfrze odjemnika ($y \ge x$), odejmowanie wykonujemy bezpośrednio bez generowania długu.

### 💡 Ogólna zasada działania reguły

Każdą pozycję liczbową możemy traktować jak *licznik* o ograniczonym zestawie znaków (od $0$ do $B - 1$, gdzie $B$ to baza systemu). Gdy od cyfry $y$ odejmujemy większą cyfrę $x$:

1. **Niwelowanie**: Sprowadzasz cyfrę na danej pozycji do $0$, zużywając część odejmowanej wartości. Pozostała część tworzy Twój lokalny dług: $d = x - y$.
2. **Cofanie (Pożyczka)**: Aby spłacić dług $d$, pożyczasz $1$ od sąsiada po lewej stronie (co pomniejszy jego wartość o $1$). Ta pożyczka powoduje cofnięcie („przekręcenie”) Twojego lokalnego licznika wstecz — z $0$ na maksymalny znak w danym systemie ($B - 1$).
3. **Koszt przeskoku (Paradoks pożyczki)**: Przejście licznika wstecz z $0$ na $B - 1$ odpowiada wykonaniu dokładnie jednego kroku wstecz. Ten krok zmniejsza Twój lokalny dług o $1$. Pozostały dług do spłacenia to teraz: $d_{pozostały} = d - 1$.
4. **Wynik pozycji**: Ostateczną cyfrą wyniku na tej pozycji jest maksymalny znak systemu pomniejszony o pozostały dług: $(B - 1) - d_{pozostały}$.

---

### 🔟 Przykład A: System dziesiętny (Baza $B=10$, znaki $0$-$9$)

Rozważmy odejmowanie $125 - 7$:

1. **Jedności ($5 - 7$)**: Ponieważ $5 < 7$, niwelujemy część wspólną ($5$), co daje nam dług $d = 7 - 5 = 2$.
2. **Pożyczka (Cofanie)**: Pożyczamy $1$ od dziesiątek. Nasz lokalny licznik cofa się z $0$ na maksymalną cyfrę $9$.
3. **Koszt przeskoku**: Cofnięcie na $9$ spłaca $1$ jednostkę długu. Pozostały dług wynosi $2 - 1 = 1$.
4. **Wynik jedności**: Od ustawionego licznika ($9$) odejmujemy pozostały dług ($1$): $9 - 1 = \mathbf{8}$.
5. **Dziesiątki**: Początkowa cyfra dziesiątek ($2$) została pomniejszona o udzieloną pożyczkę ($2 - 1 = 1$). Odejmujemy: $1 - 0 = \mathbf{1}$.
6. **Setki**: Pozostają bez zmian: $1 - 0 = \mathbf{1}$.
7. **Wynik końcowy**: $118$.

---

### 🎨 Przykład B: System szesnastkowy (Baza $B=16$, znaki $0$-$F$)

Rozważmy odejmowanie $\text{A}5_{16} - \text{D}_{16}$ (gdzie $\text{A}_{16} = 10_{10}$, $\text{D}_{16} = 13_{10}$, a maksymalny znak to $\text{F}_{16} = 15_{10}$):

1. **Pozycja 0 ($5 - \text{D}$)**: Ponieważ $5 < 13$, niwelujemy część wspólną ($5$), co daje nam dług $d = 13 - 5 = 8$.
2. **Pożyczka (Cofanie)**: Pożyczamy $1$ od lewego sąsiada (znak $\text{A}$ staje się $9$). Nasz lokalny licznik cofa się z $0$ na maksymalny znak $\text{F}$.
3. **Koszt przeskoku**: Cofnięcie na $\text{F}$ spłaca $1$ jednostkę długu. Pozostały dług wynosi $8 - 1 = 7$.
4. **Wynik pozycji 0**: Od znaku $\text{F}$ ($15_{10}$) odejmujemy pozostały dług ($7$): $15 - 7 = 8 \rightarrow \mathbf{8}$.
5. **Pozycja 1**: Cyfra $\text{A}$ po udzieleniu pożyczki to teraz $9$. Odejmujemy: $9 - 0 = \mathbf{9}$.
6. **Wynik końcowy**: $98_{16}$.

---

### 💾 Przykład C: System binarny (Baza $B=2$, znaki $0$-$1$)

W systemie dwójkowym zasada jest identyczna. Cofnięcie licznika wstecz z $0$ na maksymalną cyfrę $1$ zawsze spłaca dokładnie $1$ jednostkę długu.

**Reguły bezpośrednie (bez pożyczania):**
| Działanie |  Wynik  |
| :-------: | :-----: |
|  $0 - 0$  | **$0$** |
|  $1 - 1$  | **$0$** |
|  $1 - 0$  | **$1$** |

**Działanie z długiem ($0 - 1$):**
Niwelujemy $0$, co daje dług $d = 1$. Pożyczka od sąsiada z lewej cofa nasz licznik na $1$. Koszt przeskoku wynosi $1$, co spłaca nasz dług w całości ($1 - 1 = 0$ pozostałego długu). Wynik na tej pozycji to **$1$**, a sąsiad z lewej otrzymuje dług do spłacenia.

**Reguły dla kolumny, która otrzymała przychodzący dług z prawej strony:**
Najpierw spłacamy przychodzący dług, a potem wykonujemy właściwe odejmowanie:

| Działanie                                                          | Wynik | Czy tworzy nowy dług dla lewego sąsiada?                                                                                                                               |
| :----------------------------------------------------------------- | :---: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span style="text-wrap:nowrap">$0$ - $0$ _**(- dług $1$)**_</span> | *$1$* | **TAK** (Wykonujemy $0 - 1$. Dług wynosi $1$. Pożyczamy od sąsiada, cofa licznik na 1. Dług spłacony. Wynik 1)                                                         |
| <span style="text-wrap:nowrap">$1$ - $0$ _**(- dług $1$)**_</span> | *$0$* | **_NIE_** (Mamy $1$ i spłacamy dług $1$. Wynik 0)                                                                                                                      |
| <span style="text-wrap:nowrap">$0$ - $1$ _**(- dług $1$)**_</span> | *$0$* | **TAK** (Niwelujemy $0$, spłacamy przychodzący dług $1$. Zostaje do odjęcia dolne 1. Dług wynosi 1. Pożyczamy, licznik cofa się na 1. Odejmujemy dolne $1$: wynik $0$) |
| <span style="text-wrap:nowrap">$1$ - $1$ _**(- dług $1$)**_</span> | *$1$* | **TAK** (Lokalne $1$ spłaca dług $1$. Zostaje odjęcie dolnego 1 od 0. Wykonujemy $0 - 1$. Wynik 1, generuje dług w lewo)                                               |

> [!TIP]
> _**Ściąga dla długu w systemie binarnym**_
> - Jeśli masz *0* i musisz odjąć *1* $\rightarrow$ bierzesz pożyczkę $\rightarrow$ wynik **1**, dług idzie w lewo.
> - Jeśli masz *1* i przychodzi dług (*1*) $\rightarrow$ spłacasz go $\rightarrow$ wynik **0**, dług wygasa.
> - Jeśli masz *0* i przychodzi dług (*1*) $\rightarrow$ pożyczasz od sąsiada, aby spłacić dług $\rightarrow$ wynik **1**, dług idzie w lewo.

### ⚠️ Przepełnienie przy wynikach ujemnych

Opisane reguły działają idealnie, dopóki po lewej stronie znajduje się pozycja, z której można zapożyczyć wartość. W przypadku próby wykonania działania dającego wynik ujemny (np. $2 - 3$), ostatni dług po lewej stronie nie ma skąd zostać spłacony. W skończonej architekturze procesora prowadzi to do przepełnienia i wejścia w obszar liczb ujemnych (zapis U2), o czym powiemy w kolejnej lekcji.

---

**Przykład odejmowania ($4 - 1$):**

| Stan długu       | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Mamy 1 - 0, ale spłacamy przychodzący dług 1. Wykonujemy 1 - 1 = 0. Brak nowego długu, wynik: 0.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Mamy 0 - 0, ale spłacamy przychodzący dług 1. Działanie to 0 - 1. Dług wynosi 1. Pożyczamy od sąsiada (generujemy dług w lewo), co przekręca licznik do 1. Koszt przeskoku spłaca dług. Wynik: 1.">✅</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Odejmujemy 1 od 0. Dług wynosi 1. Pożyczamy od sąsiada (generujemy dług w lewo), co przekręca nasz licznik do 1. Koszt przeskoku spłaca dług (1 - 1 = 0 pozostałego długu). Wynik: 1.">✅</span> |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Odjemna (4)**  |                                                                                                       1                                                                                                        |                                                                                                                                                        0                                                                                                                                                        |                                                                                                                                                  0                                                                                                                                                  |
| **Odjemnik (1)** |                                                                                                       0                                                                                                        |                                                                                                                                                        0                                                                                                                                                        |                                                                                                                                                  1                                                                                                                                                  |
| **Wynik (3)**    |                                                                                                     **0**                                                                                                      |                                                                                                                                                      **1**                                                                                                                                                      |                                                                                                                                                **1**                                                                                                                                                |

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>
</data-gate>

---

## ✖️ Mnożenie: przesunięcie bitowe i sumowanie

Mnożenie w procesorze opiera się na dwóch głównych regułach: podstawowych zasadach mnożenia pojedynczych bitów oraz regule przesunięcia bitowego w lewo (ang. *bit-shift*) wraz z sumowaniem częściowych wyników.

### 1️⃣ Pierwsza reguła: mnożenie pojedynczych bitów

Mnożenie pojedynczych bitów jest bardzo proste i działa identycznie jak w systemie dziesiętnym:

|  Działanie   |  Wynik  |
| :----------: | :-----: |
| $0 \times 0$ | **$0$** |
| $0 \times 1$ | **$0$** |
| $1 \times 0$ | **$0$** |
| $1 \times 1$ | **$1$** |

### 2️⃣ Druga reguła: przesunięcie bitowe (Shift Rule)

Mnożenie większych liczb w procesorze opiera się na operacjach przesunięcia bitowego w lewo. Cała logika bazuje na _**indeksie pozycji**_ bitów mnożnika (liczonym od $0$ z prawej strony).

Spójrz na dolną liczbę (mnożnik). Numer pozycji, na której znajduje się cyfra $1$, określa dokładnie, ile zer dopisujesz na końcu liczby górnej (mnożnej).

| Pozycja                    |   7   |   6   |   5   |    4    |   3   |    2    |    1    |    0    |
| :------------------------- | :---: | :---: | :---: | :-----: | :---: | :-----: | :-----: | :-----: |
| **Zapis binarny mnożnej**  |  `0`  |  `0`  |  `0`  |   `1`   |  `1`  |   `0`   |   `1`   |   `1`   |
| **Zapis binarny mnożnika** |  `0`  |  `0`  |  `0`  | **`1`** |  `0`  | **`1`** | **`1`** | **`1`** |

**Wizualizacja przesunięcia (mnożna `11011`):**
Mechanicznie mnożenie polega na przesuwaniu liczby w lewo i dopisywaniu zer na jej końcu:
- Dla bitu na pozycji $0$ (mnożenie przez $2^0 = 1$): brak przesunięcia $\rightarrow$ `11011`
- Dla bitu na pozycji $1$ (mnożenie przez $2^1 = 2$): przesunięcie o 1 miejsce $\rightarrow$ `110110`
- Dla bitu na pozycji $2$ (mnożenie przez $2^2 = 4$): przesunięcie o 2 miejsca $\rightarrow$ `1101100`

---

Przeanalizujmy pomnożenie liczb `0001 1011` przez `0001 0111`. W mnożniku jedynki występują na pozycjach $0$, $1$, $2$ oraz $4$. Generuje to cztery przesunięte wartości pośrednie:

| Pozycja | Wartość mnożnika |      Operacja przesunięcia       |    Wynik pośredni    |
| :-----: | :--------------: | :------------------------------: | :------------------: |
|   $0$   |       `1`        |   `0001 1011` bez przesunięcia   |   **`0001 1011`**    |
|   $1$   |       `1`        |   `0001 1011` przesunięte o 1    |   **`0011 0110`**    |
|   $2$   |       `1`        |   `0001 1011` przesunięte o 2    |   **`0110 1100`**    |
|   $3$   |       `0`        | brak operacji (mnożenie przez 0) |     `0000 0000`      |
|   $4$   |       `1`        |   `0001 1011` przesunięte o 4    | **`0001 1011 0000`** |

Wyniki zerowe pomijamy w sumowaniu. Ostateczny wynik otrzymujemy przez zsumowanie czterech wartości pośrednich:

1. _**$0001\text{ }1011$**_ + *$0011\text{ }0110$* = `0101 0001`

|      |         |           |           |           |           |           |         |         |
| ---- | ------- | --------- | --------- | --------- | --------- | --------- | ------- | ------- |
|      |         | **_`1`_** | **_`1`_** | **_`1`_** | **_`1`_** | **_`1`_** |         |         |
|      | **`0`** | **`0`**   | **`0`**   | **`1`**   | **`1`**   | **`0`**   | **`1`** | **`1`** |
| +    | _`0`_   | _`0`_     | _`1`_     | _`1`_     | _`0`_     | _`1`_     | _`1`_   | _`0`_   |
| <hr> | <hr>    | <hr>      | <hr>      | <hr>      | <hr>      | <hr>      | <hr>    | <hr>    |
|      | `0`     | `1`       | `0`       | `1`       | `0`       | `0`       | `0`     | `1`     |

2. Wynik poprzedniej operacji dodawania → _**$0101\text{ }0001$**_ + *$0110\text{ }1100$* = `1011 1101`

|      |           |         |         |         |         |         |         |         |
| ---- | --------- | ------- | ------- | ------- | ------- | ------- | ------- | ------- |
|      | **_`1`_** |         |         |         |         |         |         |         |
|      | **`0`**   | **`1`** | **`0`** | **`1`** | **`0`** | **`0`** | **`0`** | **`1`** |
| +    | _`0`_     | _`1`_   | _`1`_   | _`0`_   | _`1`_   | _`1`_   | _`0`_   | _`0`_   |
| <hr> | <hr>      | <hr>    | <hr>    | <hr>    | <hr>    | <hr>    | <hr>    | <hr>    |
|      | `1`       | `0`     | `1`     | `1`     | `1`     | `1`     | `0`     | `1`     |

3. Wynik poprzedniej operacji dodawania → _**$1011\text{ }1101$**_ + *$0001\text{ }1011\text{ }0000$* = `0010 0110 1101`
 
|      |           |           |         |           |           |         |         |         |         |         |
| ---- | --------- | --------- | ------- | --------- | --------- | ------- | ------- | ------- | ------- | ------- |
|      | **_`1`_** | **_`1`_** |         | **_`1`_** | **_`1`_** |         |         |         |         |         |
|      |           |           | **`1`** | **`0`**   | **`1`**   | **`1`** | **`1`** | **`1`** | **`0`** | **`1`** |
| +    |           | _`1`_     | _`1`_   | _`0`_     | _`1`_     | _`1`_   | _`0`_   | _`0`_   | _`0`_   | _`0`_   |
| <hr> | <hr>      | <hr>      | <hr>    | <hr>      | <hr>      | <hr>    | <hr>    | <hr>    | <hr>    | <hr>    |
|      | `1`       | `0`       | `0`     | `1`       | `1`       | `0`     | `1`     | `1`     | `0`     | `1`     |

---

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

---

### 💡 Alternatywna metoda konwersji

Alternatywnie, skoro komputer aby coś obliczyć musi to przekonwertować pierw na zapis binarny i potem wynik zwrócić człowiekowi w zapisie dziesiętnym to Ty możesz zrobić podobnie.

Mając do pomnożenia liczby binarne `0001 1011` i `0001 0111`, dokonaj pierw konwersji i przeprowadź operację mnożenia w systemie dziesiętnym by na koniec wynik z powrotem przekonwertować na zapis binarny.

- `0001 1011` $\rightarrow$ $27_{10}$
- `0001 0111` $\rightarrow$ $23_{10}$
- $27 \times 23 = 621_{10}$
- Konwersja $621_{10}$ na postać binarną daje wynik: `0010 0110 1101`

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

---

## ➗ Dzielenie: skanowanie po indeksach

Dzielenie binarne polega na sprawdzaniu, które przesunięcia dzielnika mieszczą się w dzielnej. Dzielnik służy jako _**szablon**_ (stempel), który przesuwamy nad dzielną w poszukiwaniu miejsca na kolejne odejmowanie.

### 🎯 Reguła przewagi (Czy szablon pasuje?)

Zanim zaczniesz wycinać, procesor mechanicznie sprawdza, czy dzielna w danym przedziale ma przewagę nad dzielnikiem:
1. **Długość**: Liczba z większą liczbą cyfr (bez zer wiodących) zawsze wygrywa (np. `101` > `11`).
2. **Pierwszy różny bit**: Jeśli długości są równe, o zwycięstwie decyduje pierwszy różniący się bit od lewej strony ($1 > 0$).

> [!TIP]
> _**Głowa i Ogon**_
> Inżynierowie systemowi stosują nazewnictwo, w którym skrajnie lewy znak w fragmencie to _**Głowa**_ (*head*), a skrajnie prawy to _**Ogon**_ (*tail*). Pozycja, na której ląduje _**Ogon**_ szablonu pod dzielną, wskazuje dokładnie indeks bitu wyniku, który w danej chwili wyliczasz.

### ✂️ Przykład dzielenia ($22 \div 5$)

Dzielimy liczbę $22$ (`10110`) przez $5$ (`101`). Nasz szablon to `101`. Sprawdzamy wszystkie pozycje, zaczynając od największego możliwego przesunięcia:

#### Krok 1: Pierwsza przymiarka
Kładziemy szablon tak, aby jego _**Głowa**_ była maksymalnie po lewej stronie pod dzielną. Widzimy, że _**Ogon**_ szablonu znajduje się na _**indeksie $2$**_.

| Indeksy     |    4    |    3    |    2    |   1   |   0   | Opis                                                        |
| :---------- | :-----: | :-----: | :-----: | :---: | :---: | :---------------------------------------------------------- |
| **Dzielna** |   `1`   |   `0`   |   `1`   |  `1`  |  `0`  | Wartość początkowa                                          |
| **Szablon** | **`1`** | **`0`** | **`1`** | _`0`_ | _`0`_ | **Ogon na indeksie $2$** (szablon przesunięty o $2$ w lewo) |
| <hr>        |  <hr>   |  <hr>   |  <hr>   | <hr>  | <hr>  | <hr>                                                        |
| **Wynik**   |   `0`   |   `0`   |   `1`   |  `?`  |  `?`  | Aktualny wynik na tym etapie                                |

Dopisane na końcu zera w szablonie wynikają z przesunięcia go o dwa miejsca w lewo.
- *Decyzja*: Czy dzielna ma przewagę nad przesuniętym szablonem (`10110` $\ge$ `10100`)? **TAK**.
- **Wynik**: Na indeksie $2$ (gdzie leży ogon szablonu) wpisujemy **$1$**.
- **_Nowa reszta_**: Odejmujemy `10110` - `10100` = `00010`. To nasz cel w kolejnym kroku.

#### Krok 2: Druga przymiarka
Przesuwamy szablon o jedno miejsce w prawo. Teraz jego _**Ogon**_ ląduje na _**indeksie $1$**_.

| Indeksy     |   4   |    3    |    2    |    1    |   0   | Opis                                                        |
| :---------- | :---: | :-----: | :-----: | :-----: | :---: | :---------------------------------------------------------- |
| **Reszta**  |       |   `0`   |   `0`   |   `1`   |  `0`  | Reszta z poprzedniego kroku                                 |
| **Szablon** |       | **`1`** | **`0`** | **`1`** | _`0`_ | **Ogon na indeksie $1$** (szablon przesunięty o $1$ w lewo) |
| <hr>        | <hr>  |  <hr>   |  <hr>   |  <hr>   | <hr>  | <hr>                                                        |
| **Wynik**   |  `0`  |   `0`   |   `1`   |   `0`   |  `?`  | Aktualny wynik na tym etapie                                |

- *Decyzja*: Czy reszta (`0010`) ma przewagę nad przesuniętym szablonem (`1010`)? **_NIE_**.
- **Wynik**: Na indeksie $1$ wyniku wpisujemy **$0$**.
- **_Nowa reszta_**: Pozostaje bez zmian (`10`).

#### Krok 3: Trzecia przymiarka
Kładziemy szablon na ostatnim możliwym miejscu. _**Ogon**_ ląduje na _**indeksie $0$**_.

| Indeksy     |   4   |   3   |    2    |    1    |    0    | Opis                                                |
| :---------- | :---: | :---: | :-----: | :-----: | :-----: | :-------------------------------------------------- |
| **Reszta**  |       |       |   `0`   |   `1`   |   `0`   | Reszta z poprzedniego kroku                         |
| **Szablon** |       |       | **`1`** | **`0`** | **`1`** | **Ogon na indeksie $0$** (szablon bez przesunięcia) |
| <hr>        | <hr>  | <hr>  |  <hr>   |  <hr>   |  <hr>   | <hr>                                                |
| **Wynik**   |  `0`  |  `0`  |   `1`   |   `0`   |   `0`   | Ostateczny wynik działania                          |

- *Decyzja*: Czy reszta (`0010`) ma przewagę nad przesuniętym szablonem (`101`)? **_NIE_**.
- **Wynik**: Na indeksie $0$ wyniku wpisujemy **$0$**.

---

**Wynik końcowy:**
- **Iloraz**: `100` (czyli **$4_{10}$**)
- **Reszta (operacja modulo %)**: `10` (czyli **$2_{10}$**)

> [!IMPORTANT]
> Dzielenie to powtarzalna mechanika: skanujesz kolejne pozycje od lewej do prawej, dopasowując szablon, i na podstawie relacji wielkości (góra $\ge$ dół) decydujesz o wpisaniu kolejnego bitu wyniku (na indeksie, w którym leży ogon szablonu).

_**Algorytm dzielenia w $4$ krokach:**_
1. *Ustaw szablon* (dzielnik) maksymalnie po lewej stronie pod dzielną.
2. *Sprawdź przewagę*: Jeśli góra $\ge$ dół $\rightarrow$ wpisz **$1$** w wyniku na pozycji ogona szablonu i odejmij wartości.
3. *Brak przewagi?*: Wpisz **$0$** w wyniku na pozycji ogona.
4. *Przesuń szablon* o $1$ w prawo i powtarzaj proces, aż ogon szablonu osiągnie indeks $0$.

<data-gate>
  <data-arithmetic-challenge base="2" operation="/"></data-arithmetic-challenge>
</data-gate>

---

## 🕹️ Symulator arytmetyki binarnej

Poniżej znajduje się interaktywne narzędzie, w którym możesz przetestować operacje arytmetyczne na dwóch liczbach szesnastobitowych:

<data-binary-arithmetic digits="16" base="2" u2="false"></data-binary-arithmetic>

---

## 🔒 Operacje arytmetyczne w systemie binarnym

Czas na podsumowanie i sprawdzenie wiedzy w praktyce.

<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Dodawać już umiesz. 🙂

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Odejmowanie to dla ciebie nie jest problem. 😎

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>

> [!TIP]
> Oby tak dalej z pomnażaniem. 🤑

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="/"></data-arithmetic-challenge>

> [!TIP]
> Dziel i rządź! 👑

</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Dodawanie binarne opiera się na przeniesieniu (carry) wartości do kolejnej kolumny, gdy suma w danej kolumnie wynosi co najmniej $2$.
- Odejmowanie binarne realizujemy za pomocą uniwersalnej reguły niwelowania i cofania (pożyczania), w której pożyczka od lewego sąsiada cofa licznik na pozycję $B - 1$, zmniejszając lokalny dług o $1$.
- Mnożenie binarne realizowane jest przez przesunięcia bitowe w lewo o indeks pozycji mnożnika i sumowanie wyników częściowych.
- Dzielenie binarne to proces sekwencyjnego porównywania fragmentów dzielnej z dzielnikiem (szablonem) i zapisywania bitu wyniku na pozycji ogona szablonu.
