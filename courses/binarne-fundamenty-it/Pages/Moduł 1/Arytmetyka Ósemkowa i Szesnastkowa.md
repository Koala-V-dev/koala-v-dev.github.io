# Arytmetyka ósemkowa i szesnastkowa

Znasz już arytmetykę binarną — dodawanie, odejmowanie, mnożenie i dzielenie na zerach i jedynkach. Teraz czas zastosować _**te same reguły**_ w systemach, które informatycy używają na co dzień: ósemkowym (*Octal*) i szesnastkowym (*Hexadecimal*).

Zasada jest uniwersalna: zmienia się tylko _**pojemność licznika**_, przy której następuje **Przeładowanie** (gdy suma jest zbyt duża) lub zapotrzebowanie na **_Cofnięcie licznika_** (gdy od mniejszej cyfry odejmujemy większą).

| System                                                                                                       |                                            Cyfry                                             |  Limit licznika   | Przeładowanie (koszt z sumy) |         Zapożyczenie i koszt przewrotu (dług)         |
| :----------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------: | :---------------: | :--------------------------: | :---------------------------------------------------: |
| **Binarny**                                                                                                  |                                            $0-1$                                             |        $1$        |             $-2$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| **Ósemkowy**                                                                                                 |                                            $0-7$                                             |        $7$        |             $-8$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| **Szesnastkowy**                                                                                             |                     <span style="text-wrap: nowrap;">$0-\text{F}$</span>                     | $15$ ($\text{F}$) |            $-16$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| _**Dziesiętny**_                                                                                             |                                            $0-9$                                             |        $9$        |            $-10$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| *Szóstkowy*                                                                                                  |                                            $0-5$                                             |        $5$        |             $-6$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| *Czwórkowy*                                                                                                  |                                            $0-3$                                             |        $3$        |             $-4$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| *Trójkowy*                                                                                                   |                                            $0-2$                                             |        $2$        |             $-3$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| *Dwunastkowy*                                                                                                |                                         $0-\text{B}$                                         |       $11$        |            $-12$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |
| <a href="https://pl.wikipedia.org/wiki/Sze%C5%9B%C4%87dziesi%C4%85tkowy_system_liczbowy">Sześćdziesiętny</a> | <a href="https://en.wikipedia.org/wiki/Sexagesimal#Babylonian_mathematics">Zapis klinowy</a> |       $59$        |            $-60$             | Sąsiad bierze $1$ długu, przewrót kosztuje $-1$ długu |

> [!NOTE]
> **Rachunki na papierze vs sprzęt procesora**  
> Przedstawione w tym rozdziale pisemne metody odejmowania (oparte na pożyczkach i długu) to tradycyjny sposób wykonywania obliczeń przez człowieka na papierze. W fizycznym procesorze odejmowanie realizowane jest inaczej - maszyna nie posiada osobnego układu odejmującego, lecz zamienia drugą liczbę na jej postać ujemną w kodzie U2 (metoda `Invert + 1`) i wykonuje zwykłe dodawanie binarne. Wynik jest następnie interpretowany w systemie ósemkowym lub szesnastkowym bezpośrednio z rejestru, bez potrzeby wykonywania skomplikowanych pożyczek.

---

## 🎱 System ósemkowy (Octal)

> [!REMINDER]
> System ósemkowy był popularny w erze 12-bitowych i 36-bitowych maszyn. Dziś spotkasz go głównie w uprawnieniach systemów Linux (`chmod 755`). Jedna cyfra ósemkowa to *dokładnie 3 bity*.

---

### ➕ Dodawanie ósemkowe

System wykorzystuje cyfry $0$-$7$. Gdy suma przekroczy $7$, licznik ulega _**przeładowaniu**_ (oddajesz $8$ z sumy) i przenosi $1$ do kolejnej kolumny.

**Przykład ($37_8 + 25_8$):**

| Przeniesienie  | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Suma 3 + 2 = 5, plus 1 z przeładowania z prawej kolumny daje 6. To mieści się w naszym liczniku ($< 8$), więc nie ma kolejnego przeładowania.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="7 + 5 = 12. Suma wykracza poza licznik (maks 7). Oddajesz z sumy jedno pełne przeładowanie (-8), co pozostawia Ci cyfrę 4 w wyniku. Powstało przeładowanie licznika, więc przenosisz 1 w lewo.">←</span> |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Składnik A** |                                                                                                                             $3$                                                                                                                             |                                                                                                                                                    $7$                                                                                                                                                     |
| **Składnik B** |                                                                                                                             $2$                                                                                                                             |                                                                                                                                                    $5$                                                                                                                                                     |
| **Wynik**      |                                                                                                                           **$6$**                                                                                                                           |                                                                                                                                                  **$4$**                                                                                                                                                   |

Analiza kolumn (od prawej):
- **Jedności**: $7 + 5 = 12$. Ponieważ to więcej niż pomieści licznik, oddajemy $8$ za jedno pełne przeładowanie. Wynik to $12 - 8 = 4$. **przeniesienie (1)** idzie do kolumny po lewej.
- **Ósemki**: $3 + 2 + 1_{\text{przeładowanie}} = 6$. Ponieważ $6 < 8$, brak kolejnego przeładowania.

Wynik: $64_8$ (sprawdzenie: $31_{10} + 21_{10} = 52_{10}$ = $64_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>
</data-gate>

---

### ➖ Odejmowanie ósemkowe

System wykorzystuje _**regułę niwelowania i cofania**_. Różnica względem układu dziesiętnego polega tylko na tym, że po cofnięciu licznik staje na pozycji *$7$*.

**Przykład ($52_8 - 37_8$):**

| Stan długu   | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Wykonujemy odejmowanie w lewej kolumnie: początkowe 5 pomniejszamy o pożyczkę 1 przekazaną w prawo, co daje 4. Następnie odejmujemy 3 (4 - 3 = 1). Brak nowego długu, wynik to 1.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Stosujemy regułę niwelowania i cofania dla 2 - 7: niwelujemy 2, co daje 5 długu. Pożyczamy 1 od sąsiada, co cofa licznik na 7 (koszt przeskoku to 1, zostaje 4 długu). Odejmujemy pozostały dług od licznika: 7 - 4 = 3. Przenosimy dług w lewo.">✅</span> |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Odjemna**  |                                                                                                                                               $5$                                                                                                                                               |                                                                                                                                                                              $2$                                                                                                                                                                               |
| **Odjemnik** |                                                                                                                                               $3$                                                                                                                                               |                                                                                                                                                                              $7$                                                                                                                                                                               |
| **Wynik**    |                                                                                                                                             **$1$**                                                                                                                                             |                                                                                                                                                                            **$3$**                                                                                                                                                                             |

Analiza kolumn (od prawej):
- **Jedności**: Odejmujemy $2_8 - 7_8$.
  1. *Niwelowanie*: Spłacamy część odejmowanej wartości za pomocą posiadanej $2$, co pozostawia nam $5$ długu ($7 - 2 = 5$).
  2. *Cofanie (pożyczka)*: Pożyczamy $1$ od lewego sąsiada, co pozwala nam cofnąć licznik z $0$ na maksymalną wartość $7_8$.
  3. *Koszt przeskoku*: Cofnięcie licznika wstecz o jeden pełny obrót spłaca $1$ jednostkę długu. Pozostały dług do spłacenia to teraz $4$ ($5 - 1 = 4$).
  4. *Wynik pozycji*: Odejmujemy pozostały dług od pozycji licznika: $7 - 4 = 3$. Zapisujemy w wyniku: _**$3$**_.
- **Ósemki**: Odejmujemy $5_8 - 3_8$.
  1. Uwzględniamy pożyczkę udzieloną kolumnie jedności: zmniejszamy stan licznika o $1$: $5_8 - 1 = 4_8$.
  2. Odejmujemy dolną cyfrę: $4_8 - 3_8 = 1_8$. Zapisujemy w wyniku: _**$1$**_.

Wynik: $13_8$ (sprawdzenie: $42_{10} - 31_{10} = 11_{10}$ = $13_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="-"></data-arithmetic-challenge>
</data-gate>

---

### 🕹️ Symulator ósemkowy

Przetestuj dowolne operacje. Zwróć uwagę, jak **carry** i **_borrow_** zachowują się z progiem $8$:

<data-binary-arithmetic base="8" digits="6" u2="true"></data-binary-arithmetic>

---

### ✖️ Mnożenie ósemkowe

Mnożenie w każdym systemie to proces sumowania wielokrotności liczby oraz przesunięcia bitowego w lewo (*Shift*) o pozycję cyfry. Gdy operacji mnożenia podlega zestaw cyfr ($0-7$), należy pilnować momentów przeładowań dla potęgi $8$.

**Przykład ($25_8 \cdot 14_8$):**
Mnożymy pisemnie, cyfra po cyfrze, dokładnie tak jak w systemie dziesiętnym, pamiętając jednak, że każda wartość $\ge 8$ musi zostać podzielona przez $8$ w celu wyznaczenia przeniesienia i reszty.

**Krok 1: Mnożenie przez cyfrę jedności ($4_8$)**
Mnożymy górną liczbę $25_8$ od prawej do lewej przez cyfrę $4$:
1. *Mnożymy $4 \cdot 5$*: Wynik dziesiętny to $20_{10}$. Sprawdzamy, ile ósemek mieści się w $20$: $20 \div 8 = 2$ reszty $4$. Zapisujemy pod kreską cyfrę reszty: **$4$**, a pełne ósemki przenosimy dalej: **carry** = **$2$**.
2. *Mnożymy $4 \cdot 2$*: Wynik dziesiętny to $8_{10}$. Dodajemy przeniesioną wcześniej wartość: $8 + 2 = 10_{10}$. Sprawdzamy, ile ósemek mieści się w $10$: $10 \div 8 = 1$ reszty $2$. Zapisujemy pod kreską cyfrę reszty: **$2$**, a pełną ósemkę przenosimy dalej: **carry** = **$1$**.
3. *Zapisujemy pozostałe przeniesienie*: Przeniesioną na koniec jedynkę dopisujemy na początku wiersza: **$1$**.
- Otrzymujemy pierwszy wynik częściowy: **$124_8$**.

**Krok 2: Mnożenie przez cyfrę ósemek ($1_8$)**
Mnożymy górną liczbę $25_8$ przez $1$, pamiętając o dopisaniu $0$ na końcu (przesunięcie o jedną pozycję w lewo):
1. Dopisujemy na końcu cyfrę przesunięcia: **$0$** (ogon).
2. *Mnożymy $1 \cdot 5$*: Wynik to $5$. Ponieważ $5 < 8$, nie ma przeniesienia. Zapisujemy: **$5$**.
3. *Mnożymy $1 \cdot 2$*: Wynik to $2$. Ponieważ $2 < 8$, nie ma przeniesienia. Zapisujemy: **$2$**.
- Otrzymujemy drugi wynik częściowy: **$250_8$**.

**Krok 3:** Dodawanie ósemkowe pod kreską:

|      |         |         |           |
| ---- | :-----: | :-----: | :-------: |
|      |   $1$   |   $2$   |    $4$    |
| +    |   $2$   |   $5$   |    $0$    |
| <hr> |  <hr>   |  <hr>   |   <hr>    |
|      | **$3$** | **$7$** | **$4_8$** |

$( 25_8 \cdot 14_8 = 374_8 \rightarrow 21_{10} \cdot 12_{10} = 252_{10})$

---

### ➗ Dzielenie ósemkowe

Dzielenie w systemie ósemkowym opiera się na dokładnie tej samej procedurze, którą znasz z systemu binarnego, to znaczy na _**skanowaniu po indeksach za pomocą szablonu**_ (dzielnika). Jedyna różnica polega na tym, że zamiast decydować czy wpisać $0$ czy $1$, sprawdzamy *ile razy* dzielnik mieści się w danej sekcji (od $0$ do $7$).

**Przykład ($124_8 \div 4_8$):**
Nasza dzielna to $124_8$ (indeksy pozycji od prawej: $2, 1, 0$), a szablon to $4_8$. Przymierzamy szablon, zaczynając od skrajnej lewej strony:

#### Krok 1: Pierwsza przymiarka
Kładziemy szablon (dzielnik `4`) tak, aby jego _**Głowa**_ znajdowała się pod skrajnie lewym indeksem ($2$). _**Ogon**_ szablonu leży na _**indeksie $2$**_.

| Indeksy     |    2    |   1   |   0   | Opis                                                        |
| :---------- | :-----: | :---: | :---: | :---------------------------------------------------------- |
| **Dzielna** |   `1`   |  `2`  |  `4`  | Wartość początkowa                                          |
| **Szablon** | **`4`** | _`0`_ | _`0`_ | **Ogon na indeksie $2$** (szablon przesunięty o $2$ w lewo) |
| <hr>        |  <hr>   | <hr>  | <hr>  | <hr>                                                        |
| **Wynik**   |   `0`   |  `?`  |  `?`  | Wynik na indeksie $2$ to $0$                                |

- *Decyzja*: Czy dzielna na indeksie $2$ ma przewagę nad szablonem ($1_8 \ge 4_8$)? **_NIE_**. Dzielnik się nie mieści.
- **Wynik**: Na indeksie $2$ wyniku wpisujemy **$0$**.

#### Krok 2: Druga przymiarka
Przesuwamy szablon o jedno miejsce w prawo. Teraz jego _**Ogon**_ ląduje na _**indeksie $1$**_. Badany fragment dzielnej to teraz $12_8$ (indeksy $2$ i $1$).

| Indeksy     |   2   |    1    |   0   | Opis                                                        |
| :---------- | :---: | :-----: | :---: | :---------------------------------------------------------- |
| **Dzielna** |  `1`  |   `2`   |  `4`  | Wartość początkowa                                          |
| **Szablon** |       | **`4`** | _`0`_ | **Ogon na indeksie $1$** (szablon przesunięty o $1$ w lewo) |
| <hr>        | <hr>  |  <hr>   | <hr>  | <hr>                                                        |
| **Wynik**   |  `0`  |   `2`   |  `?`  | Wynik na indeksie $1$ to $2$                                |

- *Decyzja*: Ile razy szablon $4_8$ mieści się w fragmencie $12_8$?
  - Przeliczamy fragment: $12_8 = (1 \cdot 8^1) + (2 \cdot 8^0) = 10_{10}$.
  - Sprawdzamy dziesiętnie: $10_{10} \div 4_{10} = 2$ i reszty $2$. Szablon mieści się dokładnie $2$ razy ($2 \cdot 4_8 = 10_8$).
- **Wynik**: Na indeksie $1$ wyniku wpisujemy **$2$**.
- **_Nowa reszta_**: Odejmujemy badany fragment: $12_8 - 10_8 = 2_8$. Ta reszta $2_8$ przechodzi do kolejnego kroku, tworząc z kolejną cyfrą fragment $24_8$ (na indeksach $1$ i $0$).

#### Krok 3: Trzecia przymiarka
Przesuwamy szablon na ostatnią pozycję. Jego _**Ogon**_ ląduje na _**indeksie $0$**_. Badany fragment to teraz nasza reszta wraz z ostatnią cyfrą dzielnej, czyli `24_8`.

| Indeksy     |   2   |   1   |    0    | Opis                                                |
| :---------- | :---: | :---: | :-----: | :-------------------------------------------------- |
| **Reszta**  |       |  `2`  |   `4`   | Stan z poprzedniego kroku (reszta + ostatnia cyfra) |
| **Szablon** |       |       | **`4`** | **Ogon na indeksie $0$** (szablon bez przesunięcia) |
| <hr>        | <hr>  | <hr>  |  <hr>   | <hr>                                                |
| **Wynik**   |  `0`  |  `2`  |   `5`   | Ostateczny wynik działania                          |

- *Decyzja*: Ile razy szablon $4_8$ mieści się w fragmencie $24_8$?
  - Przeliczamy fragment: $24_8 = (2 \cdot 8^1) + (4 \cdot 8^0) = 20_{10}$.
  - Sprawdzamy dziesiętnie: $20_{10} \div 4_{10} = 5$ i reszty $0$. Szablon mieści się dokładnie $5$ razy ($5 \cdot 4_8 = 24_8$).
- **Wynik**: Na indeksie $0$ wyniku wpisujemy **$5$**.
- **_Nowa reszta_**: Odejmujemy: $24_8 - 24_8 = 0_8$. Dzielenie skończone bez reszty.

Ostatecznym wynikiem dzielenia jest **$25_8$** (co idealnie pasuje do wyniku mnożenia $25_8 \cdot 14_8 = 374_8$).

---

## 💎 System szesnastkowy (Hexadecimal)

System szesnastkowy to absolutny król informatyki. Znajdziesz go wszędzie: kody kolorów CSS (`#FF5733`), adresy pamięci, instrukcje procesora, hashe kryptograficzne. Ma $16$ znaków: `0-9` oraz `A-F`.

| Znak Hex    | $\mathbf{A}$ | $\mathbf{B}$ | $\mathbf{C}$ | $\mathbf{D}$ | $\mathbf{E}$ | $\mathbf{F}$ |
| :---------- | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: |
| **Wartość** |     $10$     |     $11$     |     $12$     |     $13$     |     $14$     |     $15$     |

Jeden znak Hex to *dokładnie $4$ bity* (nibble). Dwie cyfry = pełny bajt:
- $00_{16} = 0_{10}$ 
- $\text{FF}_{16} = 255_{10}$ 
- $\text{7F}_{16} = 127_{10}$

---

### ➕ Dodawanie szesnastkowe

Licznik w Hex mieści wartości od $0_{10}$ do $15_{10}$ ($\text{F}_{16}$). Gdy suma dobije do $16_{10}$, licznik robi pełne _**przeładowanie**_ (przenosi $1$ do lewej kolumny, odejmując $16_{10}$ od sumy częściowej).

**Przykład ($3\text{A}_{16} + 2\text{F}_{16}$):**

| Przeniesienie  | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="3 + 2 = 5, doliczamy punkt przeładowania z prawej i mamy 6. Wynik spokojnie mieści się w liczniku.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="A(10) + F(15) = 25. Zdecydowanie przekracza pojemność licznika (maks 15). Koszt pełnego przeładowania to -16 bajtów, zostaje Ci 9! Przenosisz 1 w lewo.">←</span> |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Składnik A** |                                                                                                       $3$                                                                                                        |                                                                                                                                 $A$                                                                                                                                 |
| **Składnik B** |                                                                                                       $2$                                                                                                        |                                                                                                                                 $F$                                                                                                                                 |
| **Wynik**      |                                                                                                     **$6$**                                                                                                      |                                                                                                                               **$9$**                                                                                                                               |

Analiza kolumn (od prawej):
- **Jedności**: $\text{A}_{16} (10_{10}) + \text{F}_{16} (15_{10}) = 25_{10}$. Pożera to całkowitą pojemność licznika, więc oddajemy $16_{10}$ za jedno pełne **przeniesienie**. W wyniku zostaje reszta: $25_{10} - 16_{10} = 9_{10}$. Ślemy **$1$** do sąsiada.
- **Szesnastki**: $3_{16} + 2_{16} + 1_{\text{przeładowanie}} = 6_{10}$. Brak kolejnego przeładowania.

Wynik: $69_{16}$ (sprawdzenie: $58_{10} + 47_{10} = 105_{10}$ = $69_{16}$ ✅)

> [!TIP]
> Gdy litery Cię mylą, po prostu zamień je na wartości dziesiętne ($\text{A}_{16}=10_{10}, \text{B}_{16}=11_{10}, ...$), wykonaj operację i zamień wynik z powrotem na Hex. Uważaj, by nie popełnić błędu przy cofaniu!

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>
</data-gate>

---

### ➖ Odejmowanie szesnastkowe

System operuje dokładnie tą samą logiką powszechną. Jedyna subtelność polega na tym, że po cofnięciu pod $0$, licznik ląduje na maksymalnej pozycji: *$\text{F} (15)$*.

**Przykład ($\text{B}3_{16} - 4\text{E}_{16}$):**

| Stan długu   | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Wykonujemy odejmowanie w lewej kolumnie: początkowe B (11) pomniejszamy o pożyczkę 1 przekazaną w prawo, co daje A (10). Odejmujemy 4 (10 - 4 = 6). Brak nowego długu, wynik to 6.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Stosujemy regułę niwelowania i cofania dla 3 - E (14): niwelujemy 3, co daje 11 długu. Pożyczamy 1 od sąsiada, co cofa licznik na F (15), koszt przeskoku wynosi 1 (zostaje 10 długu). Odejmujemy pozostały dług od licznika: F (15) - 10 = 5. Przenosimy dług w lewo.">✅</span> |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Odjemna**  |                                                                                                                                               $B$                                                                                                                                                |                                                                                                                                                                                         $3$                                                                                                                                                                                          |
| **Odjemnik** |                                                                                                                                               $4$                                                                                                                                                |                                                                                                                                                                                         $E$                                                                                                                                                                                          |
| **Wynik**    |                                                                                                                                             **$6$**                                                                                                                                              |                                                                                                                                                                                       **$5$**                                                                                                                                                                                        |

Analiza kolumn (od prawej):
- **Jedności**: Odejmujemy $3_{16} - \text{E}_{16}$ (dziesiętnie $3_{10} - 14_{10}$).
  1. *Niwelowanie*: Spłacamy część odejmowanej wartości za pomocą posiadanej $3$, co pozostawia nam $11$ długu ($14 - 3 = 11$).
  2. *Cofanie (pożyczka)*: Pożyczamy $1$ od lewego sąsiada, co pozwala nam cofnąć licznik z $0$ na maksymalną wartość $\text{F}_{16}$ (czyli $15_{10}$).
  3. *Koszt przeskoku*: Cofnięcie licznika wstecz o jeden pełny obrót spłaca $1$ jednostkę długu. Pozostały dług do spłacenia to teraz $10_{10}$ ($11_{10} - 1_{10} = 10_{10}$).
  4. *Wynik pozycji*: Odejmujemy pozostały dług od pozycji licznika: $15_{10} - 10_{10} = 5_{10}$. Zapisujemy w wyniku: _**$5_{16}$**_.
- **Szesnastki**: Odejmujemy $\text{B}_{16} - 4_{16}$.
  1. Uwzględniamy pożyczkę udzieloną kolumnie jedności: zmniejszamy stan licznika o $1$: $\text{B}_{16} - 1 = \text{A}_{16}$ (czyli $10_{10}$). 
  2. Odejmujemy dolną cyfrę: $10_{10} - 4_{10} = 6_{10}$. Zapisujemy w wyniku: _**$6_{16}$**_.

Wynik: $65_{16}$ (sprawdzenie: $179_{10} - 78_{10} = 101_{10}$ = $65_{16}$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>
</data-gate>

---

### 🕹️ Symulator szesnastkowy

Poczuj się jak programista niskopoziomowy. $4$ cyfry Hex = idealnie 16 bitów ($16^4 = 2^{16}$):

<data-binary-arithmetic base="16" digits="4" u2="true"></data-binary-arithmetic>

> [!TIP]
> Spójrz na elegancję: *każda cyfra Hex odpowiada dokładnie $4$ bitom (półbajtowi)*. Ta matematyczna czystość sprawiła, że Hex wyparł Octal w nowoczesnym programowaniu.

---

### ✖️ Mnożenie szesnastkowe

Mnożenie w systemie szesnastkowym odbywa się pisemnie, analogicznie do systemu dziesiętnego, pamiętając jednak, że każda wartość $\ge 16_{10}$ musi zostać podzielona przez $16_{10}$ w celu wyznaczenia przeniesienia i reszty.

**Przykład ($2\text{A}_{16} \cdot \text{B}_{16}$):**
Przeliczając litery na wartości dziesiętne: wykonujemy działanie $42_{10} \cdot 11_{10} = 462_{10}$. 

Mnożymy górną liczbę $2\text{A}_{16}$ od prawej do lewej przez cyfrę $\text{B}_{16}$ ($11_{10}$):
1. *Mnożymy $\text{B} \cdot \text{A}$*: Wynik dziesiętny to $11 \cdot 10 = 110_{10}$.
   - Sprawdzamy, ile pełnych szesnastek mieści się w $110$: $110 \div 16 = 6$ i reszty $14$.
   - Zapisujemy pod kreską resztę: **$\text{E}$** (ponieważ $14_{10} = \text{E}_{16}$).
   - Przenosimy dalej pełne szesnastki: **carry** = **$6$**.
2. *Mnożymy $\text{B} \cdot 2$*: Wynik dziesiętny to $11 \cdot 2 = 22_{10}$.
   - Dodajemy przeniesioną wcześniej wartość: $22 + 6 = 28_{10}$.
   - Sprawdzamy, ile pełnych szesnastek mieści się w $28$: $28 \div 16 = 1$ i reszty $12$.
   - Zapisujemy pod kreską resztę: **$\text{C}$** (ponieważ $12_{10} = \text{C}_{16}$).
   - Przenosimy dalej pełną szesnastkę: **carry** = **$1$**.
3. *Zapisujemy pozostałe przeniesienie*: Przeniesioną na koniec jedynkę dopisujemy na początku wiersza: **$1$**.

Ostatecznym wynikiem mnożenia jest **$\text{1CE}_{16}$**.

---

### ➗ Dzielenie szesnastkowe

Dzielenie w systemie szesnastkowym wykonujemy metodą _**skanowania po indeksach za pomocą szablonu**_ (dzielnika).  
Szablon sprawdzamy pod kątem tego, *ile razy* mieści się w danej sekcji dzielnej od $0_{16}$ do $\text{F}_{16}$ ($0_{10} - 15_{10}$). 

**Przykład ($\text{1CE}_{16} \div \text{B}_{16}$):**
Nasza dzielna to $\text{1CE}_{16}$ (indeksy pozycji od prawej: $2, 1, 0$), a szablon to $\text{B}_{16}$ ($11_{10}$). Przymierzamy szablon od lewej strony:

#### Krok 1: Pierwsza przymiarka
Kładziemy szablon (dzielnik `B`) tak, aby jego _**Głowa**_ znajdowała się pod skrajnie lewym indeksem ($2$). _**Ogon**_ szablonu leży na _**indeksie $2$**_.

| Indeksy     |    2    |   1   |   0   | Opis                                                        |
| :---------- | :-----: | :---: | :---: | :---------------------------------------------------------- |
| **Dzielna** |   `1`   |  `C`  |  `E`  | Wartość początkowa                                          |
| **Szablon** | **`B`** | _`0`_ | _`0`_ | **Ogon na indeksie $2$** (szablon przesunięty o $2$ w lewo) |
| <hr>        |  <hr>   | <hr>  | <hr>  | <hr>                                                        |
| **Wynik**   |   `0`   |  `?`  |  `?`  | Wynik na indeksie $2$ to $0$                                |

- *Decyzja*: Czy dzielna na indeksie $2$ ma przewagę nad szablonem ($1_{16} \ge \text{B}_{16}$)? **_NIE_**. Dzielnik się nie mieści.
- **Wynik**: Na indeksie $2$ wpisujemy **$0$**.

#### Krok 2: Druga przymiarka
Przesuwamy szablon o jedno miejsce w prawo. Teraz jego _**Ogon**_ ląduje na _**indeksie $1$**_. Badany fragment dzielnej to $\text{1C}_{16}$ (indeksy 2 i 1).

| Indeksy     |   2   |    1    |   0   | Opis                                                        |
| :---------- | :---: | :-----: | :---: | :---------------------------------------------------------- |
| **Dzielna** |  `1`  |   `C`   |  `E`  | Wartość początkowa                                          |
| **Szablon** |       | **`B`** | _`0`_ | **Ogon na indeksie $1$** (szablon przesunięty o $1$ w lewo) |
| <hr>        | <hr>  |  <hr>   | <hr>  | <hr>                                                        |
| **Wynik**   |  `0`  |   `2`   |  `?`  | Wynik na indeksie $1$ to $2$                                |

- *Decyzja*: Ile razy szablon `B` mieści się w fragmencie `1C`?
  - Przeliczamy fragment: $\text{1C}_{16} = (1 \cdot 16^1) + 12_{10} = 16_{10} + 12_{10} = 28_{10}$.
  - Sprawdzamy dziesiętnie: $28_{10} \div 11_{10} = 2$ i reszty $6$. Szablon mieści się dokładnie $2$ razy ($2 \cdot \text{B}_{16} = 22_{10} = 16_{16}$).
- **Wynik**: Na indeksie $1$ wpisujemy **$2$**.
- **_Nowa reszta_**: Odejmujemy badany fragment: $\text{1C}_{16} - 16_{16} = 6_{16}$. Reszta $6_{16}$ przechodzi do kolejnego kroku, tworząc z kolejną cyfrą fragment $\text{6E}_{16}$ (na indeksach $1$ i $0$).

#### Krok 3: Trzecia przymiarka
Przesuwamy szablon na ostatnią pozycję. Jego _**Ogon**_ ląduje na _**indeksie $0$**_. Badany fragment to reszta wraz z ostatnią cyfrą dzielnej, czyli $\text{6E}_{16}$.

| Indeksy     |   2   |   1   |    0    | Opis                                                |
| :---------- | :---: | :---: | :-----: | :-------------------------------------------------- |
| **Reszta**  |       |  `6`  |   `E`   | Stan z poprzedniego kroku (reszta + ostatnia cyfra) |
| **Szablon** |       |       | **`B`** | **Ogon na indeksie $0$** (szablon bez przesunięcia) |
| <hr>        | <hr>  | <hr>  |  <hr>   | <hr>                                                |
| **Wynik**   |  `0`  |  `2`  |   `A`   | Ostateczny wynik działania                          |

- *Decyzja*: Ile razy szablon `B` mieści się w fragmencie `6E`?
  - Przeliczamy fragment: $\text{6E}_{16} = (6 \cdot 16^1) + 14_{10} = 96_{10} + 14_{10} = 110_{10}$.
  - Sprawdzamy dziesiętnie: $110_{10} \div 11_{10} = 10$ i reszty $0$. Szablon mieści się dokładnie $10$ razy. Ponieważ $10_{10} = \text{A}_{16}$, nasz mnożnik to $\text{A}$.
- **Wynik**: Na indeksie $0$ wpisujemy **$\text{A}$**.
- **_Nowa reszta_**: Odejmujemy: $\text{6E}_{16} - \text{6E}_{16} = 0_{16}$. Dzielenie zakończone bez reszty.

Ostatecznym wynikiem dzielenia jest **$2\text{A}_{16}$** (co jest dokładną odwrotnością mnożenia $2\text{A}_{16} \cdot \text{B}_{16} = 1\text{CE}_{16}$).

---

## ⚙️ Sprzętowa realizacja — dlaczego Hex i Octal są „darmowe”?

Możesz się zastanawiać: skoro komputer operuje wyłącznie na bitach ($0$ i $1$), to jak procesor radzi sobie z wykonywaniem działań w systemie ósemkowym czy szesnastkowym? 

Odpowiedź brzmi: **procesor o nich nie wie**. Z punktu widzenia krzemu te systemy nie istnieją. Wszystkie operacje arytmetyczne jednostka _**ALU**_ (*Arithmetic Logic Unit*) wykonuje wyłącznie na surowych danych binarnych.

Hex i Octal to jedynie nakładka interpretacyjna stworzona dla wygody ludzi. Mają one jednak unikalną cechę, która wyróżnia je na tle systemu dziesiętnego: <strong>_**sprzętowa konwersja między nimi a systemem binarnym ma zerowy koszt**_</strong>.

- **Grupowanie przewodów (szyn danych)**: Ponieważ $8 = 2^3$ oraz $16 = 2^4$, konwersja nie wymaga żadnych obliczeń ani cykli procesora. Polega ona wyłącznie na fizycznym grupowaniu ścieżek na płycie głównej lub wewnątrz układu scalonego. Cztery fizyczne przewody (bity) przesyłające sygnał są po prostu podpięte do jednego wspólnego dekodera.
- **Brak narzutu**: Zapisanie wartości w kodzie Hex nie spowalnia programu. Z punktu widzenia maszyny to wciąż te same stany napięciowe na tranzystorach. 

Dlatego właśnie system szesnastkowy wyparł dziesiętny wszędzie tam, gdzie programista musi kontrolować fizyczny stan pamięci lub rejestrów — pozwala on zapisać 8 bitów za pomocą zaledwie $2$ czytelnych znaków, nie obciążając przy tym sprzętu nawet o jedną nanosekundę.

---

## 🏁 Wielki finał: wyzwania arytmetyczne

Pokaż, że potrafisz liczyć w obu systemach. Pamiętaj: próg carry to **8** w OCT i **16** w HEX!

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Ósemkowe dodawanie opanowane! 🎱

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="8" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Pożyczanie ósemkowe nie ma przed Tobą tajemnic! 💪

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Dodawanie szesnastkowe opanowane! 💎

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Świat niskopoziomowych operacji stoi przed Tobą otworem! 👑

</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Arytmetyka w dowolnym systemie pozycyjnym opiera się na tych samych zasadach co w systemie dziesiętnym lub binarnym; zmienia się jedynie baza (dzielnik przeładowania i wartość pożyczki).
- W systemie ósemkowym (baza $8$) przeładowanie i przeniesienie następuje przy sumie równej $8$ lub większej, a pożyczka ma wartość $8$ (licznik cofa się na $7$).
- W systemie szesnastkowym (baza $16$) przeładowanie następuje przy sumie równej $16$ lub większej, a pożyczka ma wartość $16$ (licznik cofa się na $15$, czyli $F$).
- Pojedyncza cyfra ósemkowa reprezentuje dokładnie 3 bity (triadę), natomiast pojedyncza cyfra szesnastkowa reprezentuje dokładnie 4 bity (tetradę / półbajt).
- Programiści wolą system szesnastkowy (Hex) od ósemkowego (Octal), ponieważ dwie cyfry Hex idealnie kodują cały 8-bitowy bajt (`00` to $0$, a `FF` to $255$).
