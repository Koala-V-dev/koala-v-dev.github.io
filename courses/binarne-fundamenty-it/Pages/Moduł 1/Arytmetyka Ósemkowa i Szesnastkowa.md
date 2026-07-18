# 🎱💎 Arytmetyka Ósemkowa i Szesnastkowa

Znasz już arytmetykę binarną — dodawanie, odejmowanie, mnożenie i dzielenie na zerach i jedynkach. Teraz czas zastosować **te same reguły** w systemach, które informatycy używają na co dzień: **ósemkowym (Octal)** i **szesnastkowym (Hexadecimal)**.

Zasada jest uniwersalna: zmienia się tylko **pojemność licznika**, przy której następuje **Przeładowanie** (gdy suma jest zbyt duża) lub zapotrzebowanie na **Cofnięcie licznika** (gdy od mniejszej cyfry odejmujemy większą).

| System | Cyfry | Limit Licznika | Przeładowanie (koszt z sumy) | Zapożyczenie i Koszt Przrótu (z długu) |
| :--- | :---: | :---: | :---: | :---: |
| Binarny | 0-1 | 1 | $-2$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |
| **Ósemkowy** | 0-7 | 7 | $-8$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |
| **Szesnastkowy** | 0-F | 15 (F) | $-16$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |

## 🎱 System Ósemkowy (Octal)

System ósemkowy był popularny w erze 12-bitowych i 36-bitowych maszyn. Dziś spotkasz go głównie w uprawnieniach systemów Linux (`chmod 755`). Jedna cyfra ósemkowa to **dokładnie 3 bity**.

### ➕ Dodawanie Ósemkowe

System wykorzystuje cyfry $0$-$7$. Gdy suma przekroczy $7$, licznik ulega **Przeładowaniu** (oddajesz $8$ z sumy) i przenosi $1$ do kolejnej kolumny.

**Przykład ($37_8 + 25_8$):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Suma 3 + 2 = 5, plus 1 z przeładowania z prawej kolumny daje 6. To mieści się w naszym liczniku ($< 8$), więc nie ma kolejnego przeładowania.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="7 + 5 = 12. Suma wykracza poza licznik (maks 7). Oddajesz z sumy jedno pełne przeładowanie (-8), co pozostawia Ci cyfrę 4 w wyniku. Powstało przeładowanie licznika, więc przenosisz 1 w lewo.">←</span> |
| :--- | :---: | :---: |
| **Składnik A** | $3$ | $7$ |
| **Składnik B** | $2$ | $5$ |
| **Wynik** | **$6$** | **$4$** |

Analiza kolumn (od prawej):
- **Jedności**: $7 + 5 = 12$. Ponieważ to więcej niż pomieści licznik: oddajemy $8$ za jedno pełne przeładowanie. Wynik to $12 - 8 = 4$. **Przeładowanie (1)** idzie do kolumny po lewej.
- **Ósemki**: $3 + 2 + 1_{\text{przeładowanie}} = 6$. Ponieważ $6 < 8$, brak kolejnego przeładowania.

Wynik: $64_8$ (sprawdzenie: $31_{10} + 21_{10} = 52_{10}$ = $64_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>
</data-gate>

### ➖ Odejmowanie Ósemkowe

System wykorzystuje **Regułę Niwelowania i Cofania**. Różnica względem układu dziesiętnego polega tylko na tym, że po cofnięciu licznik staje na pozycji **$7$**.

**Przykład ($52_8 - 37_8$):**

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Tu stoisz by operować 5 - 3. Sprawdzasz jednak, że na Twoim obiekcie spoczywa dług 1 wleczony z przeskoku prawej krawędzi. Spłacasz go na starcie pomniejszając górny stan (5 - 1 = 4). Zostajesz z przeliczoną jednością 4. Z czystym kątem na zrzuconej 4 rozliczasz bazowe zadanie przez odjemnik - więc na sam koniec odejmujesz widniejące niżej 3 (4 - 3). Notujesz finalny opad warty 1. Koniec zmartwień o generowanie nadmiernych obciążeń dla sąsiadów z lewej.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Tu od mniejszej cyfry odciągasz 7. Większe od mniejszego u podstawy, więc musi nastąpić ujęcie długu wprawionego w środowisku lewym (lewy sąsiad przejmuje na siebie próg 1 długu wyrównawczego). Zaciągnąwszy u niego pożyczkę bezkarnie cofasz u bazy swój licznik. Określamy w głowie realny wymiar długu niwelując do zera wspólną część (ujemne 7 uszczuplone po spłaceniu górnym 2 to zadłużenie dające 5 długu). Sam bezwarunkowy akt obracania licznika wstecz poniżej bariery 0 na próg maksymalny systemu (czyli cyfrę 7) niweluje i spłaca automatyczną część z całego wygenerowanego długu za to przewrócenie (dług zostaje uszczuplony 5 - 1 = 4). Pamiętając o zadłużeniu 4 zdejmujesz je z wymiaru spoczywającego na cofniętym obwodzie (7), tak po ściągnięciu (7 - 4) zostaje legalnie odzyskana i wpisana cyfra o wariancie 3. W lewą drogę wysłany został jeden proces długu.">✅</span> |
| :--- | :---: | :---: |
| **Odjemna** | $5$ | $2$ |
| **Odjemnik** | $3$ | $7$ |
| **Wynik** | **$1$** | **$3$** |

Analiza kolumn (od prawej):
- **Jedności**: $2 - 7$. **Niwelujemy** nasze $2$, co zostawia nam *$5$ długu*. Ratujemy się pożyczką, więc sąsiad bierze $1$ na swój rachunek, co z kolei pozwala nam cofnąć licznik pod zero na pozycję **$7$**. Przewrót ten kosztuje nas zawsze $1$ długu. Reszta długu wynosi więc $5 - 1 = 4$. Od aktualnej pozycji licznika ($7$) odejmujemy te $4$. Wynik: _**$3$**_.
- **Ósemki**: Masz na liczniku $5$, ale wisi na Tobie dług z tytułu pożyczki ($1$). Spłacasz go: $5 - 1 = 4$. Teraz na czysto od tego $4$ odejmujesz docelowe $3$. Wynik: _**$1$**_.

Wynik: $13_8$ (sprawdzenie: $42_{10} - 31_{10} = 11_{10}$ = $13_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="-"></data-arithmetic-challenge>
</data-gate>

### 🛡️ Symulator Ósemkowy

Przetestuj dowolne operacje. Zwróć uwagę, jak carry i borrow zachowują się z progiem 8:

<data-binary-arithmetic base="8" digits="6" u2="false"></data-binary-arithmetic>

### ✖️ Mnożenie Ósemkowe

Mnożenie w każdym systemie to proces sumowania wielokrotności liczby oraz poślizgu w lewo (Shift) o pozycję cyfry. Gdy operacji mnożenia podlega zestaw cyfr ($0-7$), należy pilnować momentów przeładowań dla potęgi $8$. 

**Przykład ($25_8 \cdot 14_8$):**
Mnożymy dokładnie tak, jak pod kreską w systemie dziesiętnym, decydując jedynie ile pełnych "pudełek z 8 elementami" możemy spakować.

**Krok 1:** Mnożenie przez pozycję jedności ($4$)
- $4 \cdot 5 = 20_{(decymalnie)}$. Dzieląc to przez limit $8$, mamy $2$ pełne ósemki i pozostaje nam reszta $4$. Przeładowanie (carry) = $2$. Wynik zapisu: **4**.
- $4 \cdot 2 = 8_{(dec)}$. Dodajemy zapisany przelew z poprzedniej pozycji ($+2$). Suma to $10_{(dec)}$.
- $10_{(dec)} \div 8$ = $1$ pełna ósemka i $2$ reszty. Przeładowanie (carry) = $1$. Wynik zapisu: **2**.
- Wynik I cyklu: **$124_8$**

**Krok 2:** Mnożenie przez pozycję ósemek ($1$) + obowiązkowe Puste Przesunięcie (Shift by 1)
- Ogon uzupełniamy o $0$.
- $1 \cdot 5 = 5_{(dec)}$. Poniżej 8, brak paczki. Przeładowanie = 0.
- $1 \cdot 2 = 2_{(dec)}$.
- Wynik II cyklu: **$250_8$**

**Krok 3:** Dodawanie Ósemkowe pod kreską:

|| | | |
|---|---|---|---|
| | $1$ | $2$ | $4$ |
| + | $2$ | $5$ | $0$ |
|<hr>|<hr>|<hr>|<hr>|
| | **$3$** | **$7$** | **$4_8$**|

$( 25_8 \cdot 14_8 = 374_8 \rightarrow 21_{10} \cdot 12_{10} = 252_{10})$

### ➗ Dzielenie Ósemkowe

Dzielenie to procedura "przymierzania mniejszego pudełka do większego", identycznie jak badanie Reguły Przewagi w arytmetyce Binarnej.

**Przykład ($124_8 \div 4_8$):**
- Bierzemy głowę liczby `1` - czwórka się nie mieści (wynik 0). 
- Bierzemy `12_8` do przymiarki. Skoro to ósemki, musisz pamiętać, że `12_8` odpowiada wymiarze dziesiętnemu $1 \cdot 8^1 + 2 = 10_{(10)}$. Ile wpadów `4` zmieścisz w wartości matematycznej 10? Zmieścisz dokładnie dwa rzuty ($2 \cdot 4 = 8_8$).
- Zapisujesz **$2$** jako pierwszą cześć wyniku podzielenia. 
- Odejmujesz: `12_8` - $8_8$. Według zasad cofania z odejmowania: spadek o dwie pozycje w dół. Reszta to `2`.
- Zrzucasz kolejną cyfrę wiersza z góry (`4`) i stykasz do reszty: Przymierzasz dzielnik `4` do liczby `24_8`.
- Wersja matematyczna tej wartości to $2 \cdot 8 + 4 = 20_{(10)}$. Wartość 20 na matematyce mieści `4` perfekcyjnie równe 5 razy ($4 \cdot 5 = 20_{10}$). Twoje dzielenie dziesiętne zamyka wynik resztą u zera, więc konwertujesz wyłowione równe wycinki. Zapisujesz ostatecznie jako dół wyniku: **$5$**.
- Otrzymujesz poprawny wymiar końcowy cykli 1 i 2 -> Wynikiem jest cyfra $2$, potem dopisano $5$: **$25_8$**. To ten sam przypadek co w powyższym mnożeniu!

## 💎 System Szesnastkowy (Hexadecimal)

System szesnastkowy to **absolutny król informatyki**. Znajdziesz go wszędzie: kody kolorów CSS (`#FF5733`), adresy pamięci, instrukcje procesora, hashe kryptograficzne. Ma 16 cyfr: `0-9` oraz `A-F`.

| Znak Hex | A | B | C | D | E | F |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Wartość** | 10 | 11 | 12 | 13 | 14 | 15 |

Jeden znak Hex to **dokładnie 4 bity** (nibble). Dwie cyfry = pełny bajt:
- `00` = $0$, `FF` = $255$, `7F` = $127$

### ➕ Dodawanie Szesnastkowe

Licznik w Hex mieści wartości od $0$ do $15$ (`F`). Gdy suma dobije do $16$, licznik robi pełne **Przeładowanie** i przenosi zsumowane $16$ bajtów jako $1$ do starszej kolumny.

**Przykład ($3A_{16} + 2F_{16}$):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="3 + 2 = 5, doliczamy punkt przeładowania z prawej i mamy 6. Wynik spokojnie mieści się w liczniku.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="A(10) + F(15) = 25. Zdecydowanie przekracza pojemność licznika (maks 15). Koszt pełnego przeładowania to -16 bajtów, zostaje Ci 9! Przenosisz 1 w lewo.">←</span> |
| :--- | :---: | :---: |
| **Składnik A** | $3$ | $A$ |
| **Składnik B** | $2$ | $F$ |
| **Wynik** | **$6$** | **$9$** |

Analiza kolumn (od prawej):
- **Jedności**: $A (10) + F (15) = 25$. Pożera to całkowitą pojemność licznika, więc oddajemy $16$ za jedno pełne **przeładowanie**. W wyniku zostaje reszta: $25 - 16 = 9$. Ślemy **1** do sąsiada.
- **Szesnastki**: $3 + 2 + 1_{\text{przeładowanie}} = 6$. Brak kolejnego przeładowania.

Wynik: $69_{16}$ (sprawdzenie: $58_{10} + 47_{10} = 105_{10}$ = $69_{16}$ ✅)

> [!TIP]
> Gdy litery Cię mylą, po prostu zamień je na wartości dziesiętne ($A=10, B=11...$), wykonaj operację i zamień wynik z powrotem na Hex. Uważaj, by nie popełnić błędu przy cofaniu!

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>
</data-gate>

### ➖ Odejmowanie Szesnastkowe

System operuje dokładnie tą samą logiką powszechną. Jedyna subtelność polega na tym, że po cofnięciu pod 0, licznik ląduje na maksymalnej pozycji: **$F (15)$**.

**Przykład ($B3_{16} - 4E_{16}$):**

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Operujesz bieżącym zakresem pierwszej kolumny z lewej strony, gdzie od rzędu B (czyli równego w matematyce dziesiętnej 11) odejmowane bazowo będzie cyfra 4. Zobacz jednak precyzyjnie jak z prawej trasy ugięć wkroczył wcześniej doliczony próg do wyrównania (wędrujący dług kwoty 1 po sąsiedzku). Dysponowane przez Ciebie i gotowe z góry 11 naturalnie spłaca twój nieskończony ciąg wymiarów dziesiętnych o wartość jeden i staje się w tym kroku wyzerowanym z zaległości układem naturalnym stojącym na punkcie wymiary 10 (co literowo utożsamia się w powłoce szesnastek literą A). Jesteś czysty przed zapożyczeniami z obwodu prawego i lewego, więc czas przeprowadzić operację pierwotnie bazową. Z punktu 10 zrzucasz w dół do odjęcia podane u spodu dolne 4 jedności, a matematyczny obrachunek owocuje natywną i czystą cyrkulacją wymiaru: u dołu zapisujesz wynikającą na poczet bazy 6, nie wymuszając przy tym dodatkowej awarii zadłużeń.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Dokonujesz bezceremonialnego odjęcia potężnej u progu litery E (wartości w systemie natywnym: 14) od ułomnego u dołu, górnego składnika 3. Wobec deficytu wymuszasz roszadę i generujesz jawny ciężar długu względem lewego sąsiada w postaci kwoty jeden (lekką ręką oddalając wymogi długu u lewej strefy modułu). Rozliczamy ten zawiły problem do wyrównania oceniając wytyczne - niwelujesz wspólną część dozwolonej wartości trójki i oszacowujesz, że ze skali bazy po odliczeniu owych posiadanych trzech sztuk zaległość spada i wynosi aktualnie wycinek o masie 11 na zaciągnięty rosnący układ. Z racji, że wziąłeś dług z lewej strony, wolno ci dokonać przeskoku pętli: cofasz bębny pod spód progu u zera twardo osadzając na maksymalnym punkcie domeny F (w rozliczeniu to punktu równy 15). Fakt samego cofnięcia jest nagradzany - pętla pochłania część zadłużenia mianowicie jeden element, zbijając Twój zaległy wymiar ze zdania na pułap natywnych 10. Przeprowadzenie tej części operacji wymusza zdjęcie zadziwiających zaległości: od punktu licznika (litera F = 15) ubywamy spłacając to pozostałe opóźnienie w kwocie 10. Cykliczny obrót 15 - 10 zrzuca 5, więc zapisujemy i pozostawiamy rozwiązanie 5 na tym ujętym module, wynosząc próg jednego pożądanego długu do uregulowania obok.">✅</span> |
| :--- | :---: | :---: |
| **Odjemna** | $B$ | $3$ |
| **Odjemnik** | $4$ | $E$ |
| **Wynik** | **$6$** | **$5$** |

Analiza kolumn (od prawej):
- **Jedności**: $3 - E (14)$. **Niwelujemy** skromne $3$, co zostawia nam koszmarne *$11$ długu*. Wymmuszamy pożyczkę od sąsiada na lewo (sąsiad łapie $1$ długu). To ratuje nas prawem cofnięcia licznika na maksymalną pozycję **$15$**, ale ten przewrót kosztuje nas odpis z długu ($1$). Z $11$ robi się resztka $10$ długu. Odejmujemy resztę od stanu licznika ($15 - 10$) i w wyniku ląduje urocze _**$5$**_.
- **Szesnastki**: Na starcie masz $B (11)$, ale wisisz sąsiadowi ten 1 punkt długu za pożyczkę: $11 - 1 = 10 (A)$. Jesteśmy na czysto jako czyste dziesięć, od którego odejmujemy dolną pozycję: $10 - 4 = 6$. Zostaje _**$6$**_.

Wynik: $65_{16}$ (sprawdzenie: $179_{10} - 78_{10} = 101_{10}$ = $65_{16}$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>
</data-gate>

### 🛡️ Symulator Szesnastkowy

Poczuj się jak programista niskopoziomowy. 4 cyfry Hex = idealnie 16 bitów ($16^4 = 2^{16}$):

<data-binary-arithmetic base="16" digits="4" u2="false"></data-binary-arithmetic>

> [!TIP]
> Spójrz na elegancję: każda cyfra Hex odpowiada dokładnie 4 bitom (półbajtowi). Ta matematyczna czystość sprawiła, że Hex wyparł Octal w nowoczesnym programowaniu.

### ✖️ Mnożenie i ➗ Dzielenie Szesnastkowe

System operacji pozostaje ten sam co we wszystkich innych - różnicą są tu wymiar potęg na przeładowania (mod 16 - carry overflow).

**Mnożenie przykładowe ($2A_{16} \cdot B_{16}$)**
Przeliczając litery na stan liczbowy w głowie: Mnożysz $42_{(10)} \cdot 11_{(10)} = 462_{(10)}$.

**Jak się to odbywa manualnie?**
Bierzesz pierwszą część ($B \cdot A$): Wartość to $11 \cdot 10 = 110$ w Dec. 
Dzielisz na paczki Szesnastki: Co składa się w limitze paczek szesnastnicy? Mieścisz tam równo 6 szesnastek ($6 \cdot 16 = 96$). 
Reszta zostająca do zapisu to $14$ - więc zapisujesz literę bazową Hex: **`E`**. Pamiętasz że pod "skrzydłami z boku" wisi paczka 6 pudeł z carry.

Druga fraza to ($B \cdot 2$): $11 \cdot 2 = 22$. 
Doklejasz z puli te zapamiętałe na boku 6 pudeł sumy: $22 + 6 = 28$.
$28$ w limitach pudełek 16 to zaledwie jedno pudełko całej wielkości, z resztkami $12_{(10)}$. Resztka z $12$ to znak **`C`**. 
Przebicie za pełne jedno pudełko zsuwasz w dół jako finalny opusz: **`1`**.
Wynikiem tej partii dodawaniowo-mnożniczej było zatem złożone rozwiązanie bitowe: **`1CE`**

Dzielenie ułamkowe odbywa się dosłownie tą samą zrzutową regułą słupków. Dopasowujesz pozycję (Head i Ogon) największym możliwym mnożnikiem dopasowanym o maskę wartościową z zachowaniem rzeki - wiersz za wierszem ściągając na dół po szczeplach operacyjnych reszt. 

W informatyce i przy tak masowych systemowych rozlokowywaniach - procesory nie operują z zębatek Hexadecymalnych – dekompresują te zapytania na rejestry natychmiastowe Bitów jako poślizgi mnożnicze. Przesunięcie i Suma (Shift and Sum). Wynika to z zasady elegancji i oszczędności nanosekund architektury hardware, na której wszystko i wszyscy stoją.

## 🏁 Wielki Finał: Wyzwania Arytmetyczne

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
> Hex dodawanie? Dziecinna igraszka! 💎

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Świat niskopoziomowych operacji stoi przed Tobą otworem! 👑

</data-gate>
