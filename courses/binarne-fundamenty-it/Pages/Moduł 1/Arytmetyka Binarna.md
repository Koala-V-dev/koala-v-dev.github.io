# 🧮 Arytmetyka Binarna

Matematyka, której uczysz się w szkole, jest nieskończona — zawsze możesz dodać kolejną cyfrę, a z lewej strony masz nieskończoną ilość *zer wiodących*, których nie musimy zapisywać. Ale technologia komputerowa jest **deterministyczna i skończona**. Procesor operuje na **pudełkach o sztywnym rozmiarze**, które mają swoje nieprzekraczalne limity.

---

My skupimy się na standardzie **16-bitowym** (typ `short` stosowany np. w C++). Mieści on dokładnie $2^{16} = 65536$ kombinacji. To nasze maksimum, z którego liczby nie mogą uciec.

## ➕ Dodawanie z mechanizmem "Przeniesienia"

Dodawanie binarne opiera się na prostych regułach:

| Działanie | Wynik | 
| :---: | :---: |
| $0 + 0$ | **$0$** |
| $0 + 1$ | **$1$** |
| $1 + 0$ | **$1$** |

 Problem pojawia się wtedy, gdy suma jedynek w kolumnie wynosi $2$ lub $3$. Wtedy następuje **przeniesienie** do kolejnej pozycji, zupełnie jak w dodawaniu słupkowym, gdy suma przekracza $9$ dla systemu dziesiętnego (decymalnego).

| Suma w kolumnie | Wynik | Nowe Przeniesienie |
| :--- | :---: | :---: |
| $1 + 1$ | **$0$** | **$1$** dla kolejnej kolumny po lewej |
| $1 + 1 +$ *$1$ (z przeniesienia)* | **$1$** | **$1$** dla kolejnej kolumny po lewej |
| $0 + 1 +$ *$1$ (z przeniesienia)* | **$0$** | **$1$** dla kolejnej kolumny po lewej |

---

**Przykład (3 + 1):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Tu masz 1 z przeładowania w poprzedniej kolumnie po prawej. &#10;Patrzysz, czy tym razem też zajdzie przeładowanie. &#10;W tym przypadku kolumna nie zawiera choćby jednej jedynki, aby nastąpiło przeładowanie, więc skoro 0+0=0, to wystarczy przepisać jedynkę z poprzedniego przeładowania.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Tu masz 1 z przeładowania w poprzedniej kolumnie po prawej. &#10;Patrzysz, czy tym razem też zajdzie przeładowanie. &#10;Jak w tej kolumnie występuje jedynka, to masz kolejne przeładowanie i teraz to przeładowanie da ci operację 0 + druga wartość, która może być 0 albo 1 i ją przepisujesz jako wynik sumy. &#10;Poniżej widzisz, że zabierając jedynkę do przeładowania, masz ostateczne działanie 0+0, więc wynik to 0 i jedynka do przeniesienia, bo było przeładowanie.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Poniżej widzisz sumę 1 i 1, więc do kolejnej kolumny przenosisz przeładowaną wartość (1), a w wyniku zapisujesz zresetowany licznik (0)">←</span> |
| :--- | :---: | :---: | :---: |
| **Składnik A $(3)_{10}$** | $0$ | $1$ | $1$ |
| **Składnik B $(1)_{10}$** | $0$ | $0$ | $1$ |
| **Wynik $(4)_{10}$** | **$1$** | **$0$** | **$0$** |


<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>
</data-gate>


## ➖ Odejmowanie: Reguła "Niwelowania i Cofania"

Odejmowanie binarne, podobnie jak dziesiętne, opiera się na procesie pożyczania. Najskuteczniejszym sposobem na zrozumienie tego procesu jest **Reguła Niwelowania i Cofania**. 

> [!IMPORTANT]
> Mechanizm ten uruchamia się **wyłącznie wtedy, gdy od cyfry mniejszej odejmujesz większą ($y < x$)**. Jeśli $y \ge x$, odejmowanie jest bezpośrednie i nie generuje długu.

### Jak to działa? (Pełny proces obsługi długu)
Spójrzmy na mechanizm w systemie dziesiętnym, opierając się na zestawie znaków ($0$-$9$), czyli naszym **Liczniku**:

**Przykład A (_$125 - 7$_):**
1. **Jedności**: $5 - 7$. Ponieważ $5 < 7$, niwelujemy część wspólną ($5$), zostaje *$2$ długu*.
2. **Cofanie & Paradoks Pożyczki**: Aby spłacić to $2$, musimy "cofnąć" licznik o jedną pozycję (pożyczka od sąsiada). Sąsiad bierze "rachunek" za przeskok (1) na siebie. To paradoks: pożyczka od sąsiada **zmniejsza** nasz lokalny dług, bo opłaca koszt przeskoku z $0$ na $9$.
3. **Reszta długu**: Po opłaceniu kosztu przeskoku, nasz pozostały dług wynosi już tylko $1$ ($2 - 1 = 1$).
4. **Wynik jedności**: Licznik wskazuje $9$ (nowa pozycja). Odejmujemy resztę długu ($9 - 1$). Wynik: _**$8$**_.
5. **Dziesiątki**: Mieliśmy $2$. Spłacamy sąsiadowi koszt Vouchera za przeskok ($2 - 1$). Wynik: _**$1$**_.
6. **Rachunek końcowy**: _**118**_.

---

**Przykład B (_$48 - 19$_):**
1. **Jedności**: $8 - 9$. Niwelujemy część wspólną ($8$), zostaje *$1$ długu*.
2. **Cofanie & Paradoks**: Pożyczka od sąsiada (1) w całości opłaca koszt przeskoku licznika (1). 
3. **Reszta długu**: Cały dług spłacony ($1 - 1 = 0$).
4. **Wynik jedności**: Licznik po przeskoku wskazuje $9$. Brak reszty długu. Wynik: _**$9$**_.
5. **Dziesiątki**: Mamy $4$. Najpierw regulujemy zadłużenie za pożyczkę ("Voucher") dla jedności ($4 - 1 = 3$). Teraz odejmujemy cyfrę $1$ (z części dziesiętnej liczby $19$). Wynik: _**$2$**_.
6. **Rachunek końcowy**: _**29**_.

---

W systemie binarnym (zestaw znaków $0$-$1$) mechanizm jest identyczny. Cofnięcie licznika (przeskok z $0$ na $1$) zawsze spłaca dokładnie *$1$ długu*.

---

**Reguły bezpośrednie (Brak długu z prawej):**
| Działanie | Wynik | Komentarz |
| :--- | :---: | :--- |
| $0$ - $0$ | **$0$** | - |
| $1$ - $1$ | **$0$** | - |
| $1$ - $0$ | **$1$** | - |
| $0$ - $1$ | **$1$** | Niweluję $0$, zostaje $1$ długu. Licznik cofa się na $1$, co przenosi dług na sąsiada z lewej. |

---

A skoro w ostatnim przypadku ($0-1$) wygenerował się dług dla sąsiada, to popatrz na reguły gry dla zadłużonych. 

**Reguły z długiem (Gdy kolumna otrzymała dług z prawej):**
W tej tabeli najpierw spłacamy "dług przychodzący", a potem sprawdzamy, czy sami musimy pożyczyć od sąsiada z lewej.

| Działanie | Wynik | Czy tworzy nowy dług dla lewego sąsiada? |
| :--- | :---: | :--- |
| $0$ - $0$ **(- dług $1$)** | **$1$** | **TAK** (Cofam licznik na $1$, co spłaca dług) |
| $1$ - $0$ **(- dług $1$)** | **$0$** | **NIE** (1 niweluje dług 1, zostaje 0) |
| $0$ - $1$ **(- dług $1$)** | **$0$** | **TAK** (Niweluję 0, spłacam długu 1. Brakło na odejmowanie 1!) |
| $1$ - $1$ **(- dług $1$)** | **$1$** | **TAK** (1 niweluje 1. Zostaje dług 1. Cofam licznik na 1) |

> [!TIP]
> **W skrócie: Ściąga dla Długu**
> - Jeśli bit = **0** i musisz odjąć **1** → bierzesz pożyczkę → wynik **1**, dług idzie w lewo.
> - Jeśli bit = **1** i masz dług (1) → spłacasz go → wynik **0**, dług wygasa.
> - Jeśli bit = **0** i masz dług (1) → bierzesz pożyczkę, by spłacić dług → wynik **1**, dług idzie w lewo.

### Co gdy brakuje sąsiada? (Wynik Ujemny)
Zauważ, że opisane reguły działają idealnie, dopóki masz "kogoś po lewej", kto może opłacić Twój Voucher na skok w tył licznika. Ale co, gdy $2 - 3$ 🤔?

Wtedy ostatnia jedynka po lewej nie istnieje, by spłacić dług. Procesor musi "przekręcić" wszystkie licznik 🤯, co w świecie bitów oznacza wejście w obszar **liczb ujemnych** (U2). Ale o tym w następnej lekcji 😉.

---

**Przykład (4 − 1):**
Analiza operacji $100 - 001$ ($4 - 1$). Dług wędruje przez kolumny, aż trafi na jedynkę, która może go spłacić.

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Ostatnia faza. Tu dokonujesz odejmowania 1 - 0. Widzisz z poprzednich obliczeń, że twój prawy sąsiad zarzucił na ten róg dług wynoszący 1. Posiadasz jednak do dyspozycji natywne 1 na starcie. Twój zasób jest w stanie opłacić zadaną karę. Spłacasz kwotę długu 1 posiadając swój punkt 1, i pozostajesz z wartością 0 na koncie. Rozliczywszy się, kończysz działanie kolumny wedle wzoru: od Twojego zostawionego 0 schodzi dolne odjęcie równe 0, zejściem tego jest wymiar 0. Koniec długu.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Kolejna kolumna, w której robisz 0 - 0. Zauważasz jednak, że na kolumnie spoczywa też 1 przejętego długu, który zrzuciła wcześniejsza iteracja obok z prawej. Aby spłacić 1 nie mając własnego stanu na liczniku, ponownie zmuszony jesteś rzucić ten ciążący dług z wynoszącą kwotą 1, powielając ten stan w lewo. Sam rzut na kolejnego sąsiada pozwala na cofnięcie sprzętowo licznika do tyłu, wracając oknem cyklu z 0 na pozycję 1. Krok ujęty tą operacją usuwa wymiar Twojego pierwotnego długu wynoszącego okrągłe 1. Skoro zaległość została spłacona w całości u manewru - od odnowionego na 1 progu odejmujesz bazowe wskazywane na spodzie kolumny 0. Przerzucasz na dół wynik tego odcinka: 1.">✅</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Patrzysz na bieżącą kolumnę od prawej strony. Masz polecenie zrzucenia wartości 1 domyślnie startując na 0. Od mniejszej idziesz ku górze na mniejszą, czyli musisz ugiąć i cofnąć licznik. W tym celu bez wahania wymuszasz u następnego lewego sąsiada wygenerowanie przypisanego Ci długu o wymiarze 1. Zabieg ten uiszcza Ci pożądaną odgórną zgodę, i uwarunkowanie do wykonania pełnego cofnięcia we własnym liczniku na dół poniżej kółka podłoża, do cyfry 1. Przez odrzucenia wspólnego pułapu (0) Twoja wartość długu szacuje się na skromne 1. Dodatkowo sam zwrot licznika pod 0 niszczy z racjonalizacji zeszłą cząstkę wymiaru. Zostają z długów uległe okrągłe 0 do obsłużenia długu na czysto, tak wobec tego – od cofniętego licznika zatrzymanego za kółkiem na 1 zrzucasz opór 0. Ostateczny wynik zapisywany z ramienia w pierwszej kolumnie ląduje zrzutem 1.">✅</span> |
| :--- | :---: | :---: | :---: |
| **Odjemna (4)** | 1 | 0 | 0 |
| **Odjemnik (1)** | 0 | 0 | 1 |
| **Wynik (3)** | **0** | **1** | **1** |

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>
</data-gate>

## ✖️ Mnożenie: Reguła "Pozycja = Ilość Zer"

Mnożenie w procesorze to ściśle zdefiniowana procedura przesunięć. Cała logika opiera się na **Indeksie Pozycji** (liczonym od $0$ z prawej strony).

### Twarda Reguła (Shift Rule)
Spójrz na dolną liczbę (mnożnik). Numer pozycji, na której znajdziesz `1`, mówi Ci dokładnie, ile zer dopisujesz do liczby górnej (mnożnej). Pamiętaj – pozycje liczymy od zera, patrząc od prawej strony!

| Pozycja| 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Zapis binarny mnożnej | `0` | `0` | `0` | `1` | `1` | `0` | `1` | `1` |
| Zapis binarny mnożnika | `0` | `0` | `0` | **`1`** | `0` | **`1`** | **`1`** | **`1`** |

> [!IMPORTANT]
> Przesunięcie w mnożeniu opiera się na zdefiniowaniu ilości dopisywania zer do mnożnej względem pozycji, na której stoi jedynka w dolnej liczbie. 

👉 **Wizualizacja przesunięcia (Bit-Shift):**
Wyobraź sobie, że mnożenie to "popychanie" liczby w lewo — dopisujesz zera na końcu:

| Mnożna | Pozycja jedynki | Shift | Wynik |
| :---: | :---: | :---: | :---: |
| `11011` | $0$ | $\xleftarrow{0}$ | `11011` |
| `11011` | $1$ | $\xleftarrow{1}$ | `11011`**`0`** |
| `11011` | $2$ | $\xleftarrow{2}$ | `11011`**`00`** |

---

Dla powyższego przykładu patrzymy najpierw na mnożnik `0001 0111` i widzimy że jedynki występują na pozycjach $0, 1, 2$ i $4$. Zatem uzyskamy cztery przesunięcia i cztery wartości do zsumowania. 

| Pozycja | Wartość mnożnika | Operacja | Wynik mnożnej po przesunieciu do późniejszego zsumowania|
| :---: | :---: | :---: | :---: |
| $0$ | `1` | *__$0001\text{ }1011 \xleftarrow{0}$__* | **$0001\text{ }1011$** |
| $1$ | `1` | *__$0001\text{ }1011 \xleftarrow{1}$__* | **$0011\text{ }011$_$0$_** |
| $2$ | `1` | *__$0001\text{ }1011 \xleftarrow{2}$__* | **$0110\text{ }11$_$00$_** |
| $3$ | `0` | *__$0001\text{ }1011 \xleftarrow{3}$__* | *$0000\text{ }0000$* |
| $4$ | `1` | *__$0001\text{ }1011 \xleftarrow{4}$__* | **$0001\text{ }1011\text{ }$_$0000$_** |
| $5$ | `0` | *__$0001\text{ }1011 \xleftarrow{5}$__* | *$0000\text{ }0000$* |
| $6$ | `0` | *__$0001\text{ }1011 \xleftarrow{6}$__* | *$0000\text{ }0000$* |
| $7$ | `0` | *__$0001\text{ }1011 \xleftarrow{7}$__* | *$0000\text{ }0000$* |

W powyższej tabeli dokonaliśmy przesunięcia w lewo o ilość względem pozycji każdego bitu mnożnej.  
Dla wartości zerowych mnożnika chodź operacja przesunięcia występuje to jej wynik może zostać zignorowany ponieważ matematycznie mnożenie przez zero daje zero. 

Więc ostatecznie mamy cztery wartości do przeprowadzenia trzech operacji dodawania:

1. _**$0001\text{ }1011$**_ + *$0011\text{ }0110$* = `0101 0001`
|| | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| |**`0`** | **`0`** | **`0`** | **`1`** | **`1`** | **`0`** | **`1`** | **`1`**|
| + |_`0`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_|
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| |`0` | `1` | `0` | `1` | `0` | `0` | `0` | `1`|
2. Wynik poprzedniej opercaji dodawania → _**$0101\text{ }0001$**_ + *$0110\text{ }1100$* = `1011 1101`
|| | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| |**`0`** | **`1`** | **`0`** | **`1`** | **`0`** | **`0`** | **`0`** | **`1`**|
| + | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`0`_|
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| |`1` | `0` | `1` | `1` | `1` | `1` | `0` | `1`|
3. Wynik poprzedniej operacji dodawania → _**$1011\text{ }1101$**_ + *$0001\text{ }1011\text{ }0000$* = `0010 0110 1101`
|| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | **`1`** | **`0`** | **`1`** | **`1`** | **`1`** | **`1`** | **`0`** | **`1`** |
| + | | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`0`_ | _`0`_ | _`0`_ |
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| | `1` | `0` | `0` | `1` | `1` | `0` | `1` | `1` | `0` | `1` |

---

To podejście działa zawsze i dla każdej liczby. Procesor po prostu "skanuje" bity mnożnika i dla każdej jedynki generuje odpowiednio przesuniętą wersję liczby, a na końcu wszystko sumuje. ⚡

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

---

Alternatywnie, skoro komputer aby coś obliczyć musi to przekonwertować pierw na zapis binarny i potem wynik zwrócić człowiekowi w zapisie dziesiętnym to Ty możesz zrobić podobnie.

Mając do pomnożenia liczby binarne `0001 1011` i `0001 0111`, dokonaj pierw konwersji i przeprowadź operację mnożenia w systemie dziesiętnym by na koniec wynik spowrotem przekonwertować na zapis binarny.

- `0001 1011` to $27$
- `0001 0111` to $23$
- $27\cdot23 = 621$
- Przekonwertuj wynik spowrotem do zapisu binarnego czyli: `0010 0110 1101`

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

## ➗ Dzielenie: Skanowanie po Indeksach

Dzielenie binarne to proces sprawdzania, które przesunięcia dzielnika "mieszczą się" w naszej liczbie. Wyobraź sobie dzielnik jako **szablon** (stempel), który przesuwasz nad dzielną, szukając miejsca na kolejne "wycięcie" (odejmowanie).

### Reguła Przewagi (Czy szablon pasuje?)
Zanim zaczniesz wycinać, procesor mechanicznie sprawdza "czy góra ma przewagę":
1. **Długość**: Liczba z większą ilością cyfr (bez *zer wiodących*) zawsze wygrywa (np. `101` > `11`).
2. **Pierwszy różny bit**: Jeśli są równe, o zwycięstwie decyduje pierwsza różnica od lewej (**1** > **0**).

> [!TIP]
> **Głowa i Ogon**: W informatyce stosujemy nomenklaturę, że maksymalnie lewy znak w fragmencie tekstu to **Głowa** (_**head**_), a maksymalnie prawy znak w tym fragmencie to **Ogon** (_**tail**_). 😉 

### Przykład: Skanowanie krok po kroku (22 ÷ 5)
Dzielimy $22$ przez $5$. Nasz szablon to `101`. Sprawdzamy wszystkie pozycje, zaczynając od największej możliwej:

#### Krok 1: Pierwsza przymiarka
Kładziemy szablon tak, aby jego **Głowa** była maksymalnie na lewo pod dzielną i widzimy że **Ogon** jest na **indeksie $2$**. 

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Dzielna**| `1` | `0` | `1` | `1` | `0` | Wartość początkowa|
| **Szablon**| **`1`** | **`0`** | **`1`** | _`0`_ | _`0`_ | **Ogon na indeksie $2$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `?` | `?` | Aktualny wynik po poniższych operacjach. |

Zobacz na te zera w szablonie. Musimy je dopisać, bo przesunęliśmy nasz szablon o *2*.

- **Decyzja**: Czy Góra ma przewagę (`0001 0110` $\geq$ `0001 0100`)? **TAK**!
- **Wynik**: Na indeksie $2$ gdzie znajduje się ogon wpisujesz pod nim _**$1$**_.
- **Reszta**: Odejmujesz `0001 0110` $-$ `0001 0100` $=$ `0000 0010`. To Twój nowy cel dla kolejnych kroków.

#### Krok 2: Druga przymiarka
Przesuwamy szablon o jedno miejsce w prawo. Teraz jego **Ogon** ląduje na **indeksie $1$**.

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Reszta** |   | `0`  |  `0` | `1` | `0` | Reszta z poprzedniego odejmowania |
| **Szablon**|   | **`1`** | **`0`** | **`1`** | _`0`_ | **Ogon na indeksie $1$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `0` | `?` | Aktualny wynik po poniższych operacjach. |

- **Decyzja**: Czy Góra (reszta `0010`) ma przewagę nad Szablonem (`1010`)? **NIE**.
- **Wynik**: Na indeksie $1$ wyniku wpisujesz _**$0$**_.
- **Reszta**: Bez zmian, nadal masz **`10`**.

#### Krok 3: Trzecia przymiarka
Kładziemy szablon na ostatnim możliwym miejscu. **Ogon** na **indeksie $0$**.

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Reszta** |   |   | `0`  | `1` | `0` | Reszta z poprzedniego odejmowania |
| **Szablon**|   |   | **`1`** | **`0`** | **`1`** | **Ogon na indeksie $0$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `0` | `0` | Aktualny wynik po poniższych operacjach. |

- **Decyzja**: Czy Góra (`0010`) ma przewagę nad Szablonem (`101`)? **NIE**.
- **Wynik**: Na indeksie $0$ wyniku wpisujesz _**$0$**_.

---

**Wynik końcowy:**
- **Iloraz**: `100` (czyli **4**)
- **Reszta ( % - Modulo)**: `10` (czyli **2**)

> [!IMPORTANT]
> To jest czysta mechanika: skanujesz kolejne indeksy, przesuwasz szablon **Ogonem** do pozycji i decydujesz o jednym bicie wyniku.  
> Po każdym "trafieniu" (1) odejmujesz i pracujesz na mniejszej reszcie.

**Algorytm Dzielenia w 4 krokach:**
1. **Ustaw szablon** (dzielnik) maksymalnie w lewo pod dzielną.
2. **Sprawdź przewagę**: Jeśli góra $\ge$ dół → wpisz **1** w wyniku pod ogonem szablonu i odejmij.
3. **Brak przewagi?**: Wpisz **0** w wyniku.
4. **Przesuń szablon** o 1 w prawo i powtarzaj, aż dojdziesz ogonem do indeksu $0$.

<data-gate>
  <data-arithmetic-challenge base="2" operation="/"></data-arithmetic-challenge>
</data-gate>

## 🕹️ Symulator Arytmetyki Binarnej

Poniżej masz interaktywny element w którym możesz przetestować wszelkie kombinacje arytmetyczne dwóch liczb szesnastobitowych:

<data-binary-arithmetic digits="16" base="2" u2="false"></data-binary-arithmetic>

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
