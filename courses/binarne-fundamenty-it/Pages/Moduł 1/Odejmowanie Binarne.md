# Odejmowanie Binarne

## ➖ Reguła pożyczki i cofania licznika

W architekturze komputerowej każdą kolumnę traktuje się jak licznik obrotowy o skończonym alfabecie znaków od $0$ do wartości maksymalnej $B - 1$ (gdzie $B$ to baza systemu: $1$ dla binarnego, $7$ dla ósemkowego, $9$ dla dziesiętnego, $\text{F}$ dla szesnastkowego).

Gdy w danej kolumnie odejmujemy odjemnik $B$ od odjemnej $A$ ($A - B$), wykonujemy następujący pięcio-krokowy algorytm:

1. **Warunek uruchomienia długu**: Sprawdzamy, czy $A < B$. 
     - Jeśli $A \ge B$, odejmujemy bezpośrednio ($A - B$) bez zaciągania długu i kolejnych kroków algorytmu. 
     - Gdy $A < B$, wyznaczamy początkowy dług: $\text{dług} = B - A$ (lub $|A - B|$).
2. **Pożyczka od sąsiada**: Zaciągamy pożyczkę z kolumny po lewej stronie, więc sąsiad otrzymuje dług: $-1$.
3. **Cofnięcie licznika na maksimum**: Licznik bieżącej kolumny cofa się o $1$ krok wstecz (z $0$ na maksymalną wartość bazy: $B - 1$). W systemie binarnym jest to $1$, w dziesiętnym $9$, a w szesnastkowym $\text{F}$ ($15$).
4. **Rozliczenie obrotu licznika**: Wykonany skok wstecz spłaca $1$ jednostkę początkowego długu: $\text{aktualny dług} = \text{dług} - 1$.
5. **Wyznaczenie wyniku kolumny**: Od ustawionej wartości maksymalnej odejmujemy pozostały dług: $\text{wynik} = (B - 1) - \text{aktualny dług}$.

<data-binary-process mode="carry-borrow" base="2" operation="-" a="4" b="1"></data-binary-process>

#### Kroki powyższego procesu ($4 - 1 = 3_{10}$, czyli $100_2 - 001_2$):
1. **Kolumna 1 (od prawej, $0 - 1$)**:
   - $0 < 1 \to$ brakuje $1$ (początkowy $\text{dług} = 1 - 0 = 1$).
   - Pożyczka od sąsiada z lewej (kolumna 2 otrzymuje dług $-1$).
   - Licznik cofa się na maksymalną wartość $1$ (`↺1`).
   - Spłacenie długu przez obrót: $\text{pozostały dług} = 1 - 1 = 0$.
   - Wynik kolumny: $1\text{ (licznik)} - \text{dług}(1 - 1) = 1 - 0 = \mathbf{1}$.
2. **Kolumna 2 ($0 - 0$ z przychodzącym długiem $-1$)**:
   - Pełne działanie: $0 - 0 - 1\text{ (dług)} = -1 < 0 \to$ brakuje $1$ na spłatę długu!
   - Nowa pożyczka od sąsiada z lewej (kolumna 3 otrzymuje dług $-1$).
   - Licznik cofa się na maksymalną wartość $1$ (`↺1`).
   - Spłacenie długu przez obrót: $\text{pozostały dług} = 1 - 1 = 0$.
   - Wynik kolumny: $1\text{ (licznik)} - \text{dług}(1 - 1) = 1 - 0 = \mathbf{1}$.
3. **Kolumna 3 ($1 - 0$ z przychodzącym długiem $-1$)**:
   - Pełne działanie: $1 - 0 - 1\text{ (dług)} = 0 \ge 0$.
   - Cyfra $1$ bezpośrednio spłaca przychodzący dług, brak nowej pożyczki.
   - Wynik kolumny: $\mathbf{0}$.
4. **Wynik**: Zestawienie kolumn daje liczbę _**$011_2$**_ ($3_{10}$).

#### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Kaskada przez zera (1000 - 1)</b><b>Baza 10 (125 - 7)</b><b>Baza 16 (A5 - D)</b></tabs>
<div>

Odejmowanie $1000_2 - 0001_2$ ($8 - 1 = 7_{10}$) na 4 bitach:
- **Kolumna 1 (od prawej, $0 - 1$)**: $0 < 1 \to$ brakuje $1$ ($\text{dług} = 1$). Pożyczka z kolumny 2 (dla niej $-1$). Licznik cofa się na $1$. Obrót spłaca dług ($1 - 1 = 0$). Wynik: $1 - 0 = \mathbf{1}$.
- **Kolumna 2 ($0 - 0$ z długiem $-1$)**: $0 - 0 - 1 = -1 < 0 \to$ brakuje $1$. Pożyczka z kolumny 3 (dla niej $-1$). Licznik cofa się na $1$. Obrót spłaca dług ($1 - 1 = 0$). Wynik: $1 - 0 = \mathbf{1}$.
- **Kolumna 3 ($0 - 0$ z długiem $-1$)**: $0 - 0 - 1 = -1 < 0 \to$ brakuje $1$. Pożyczka z kolumny 4 (dla niej $-1$). Licznik cofa się na $1$. Obrót spłaca dług ($1 - 1 = 0$). Wynik: $1 - 0 = \mathbf{1}$.
- **Kolumna 4 ($1 - 0$ z długiem $-1$)**: $1 - 0 - 1 = 0 \ge 0 \to$ brak nowej pożyczki. Wynik: $\mathbf{0}$.
- **Wynik sprzętowy**: $\mathbf{0111_2}$ ($7_{10}$).

</div>
<div>

Ta sama reguła 5 kroków w systemie dziesiętnym ($B=10$, licznik $0-9$, max = $9$):
- Działanie: $125 - 7$ ($125 - 007$).
- **Kolumna jedności ($5 - 7$)**:
  1. $5 < 7 \to$ początkowy $\text{dług} = 7 - 5 = 2$.
  2. Pożyczka od rzędu dziesiątek (dziesiątki otrzymują dług $-1$).
  3. Licznik cofa się z $0$ na maksymalną cyfrę $9$.
  4. Obrót spłacił $1$ jednostkę: $\text{aktualny dług} = 2 - 1 = 1$.
  5. Wynik jedności: $9\text{ (licznik)} - \text{dług}(2 - 1) = 9 - 1 = \mathbf{8}$.
- **Kolumna dziesiątek ($2 - 0$ z długiem $-1$)**:
  - $2 - 0 - 1\text{ (dług)} = 1 \ge 0 \to$ brak nowej pożyczki $\to$ wynik: $\mathbf{1}$.
- **Kolumna setek ($1 - 0$)**:
  - $1 - 0 = 1 \ge 0 \to$ wynik: $\mathbf{1}$.
- **Wynik**: $\mathbf{118_{10}}$.

</div>
<div>

Ta sama reguła 5 kroków w systemie szesnastkowym ($B=16$, licznik $0-\text{F}$, max = $15_{10} = \text{F}$):
- Działanie: $\text{A}5_{16} - \text{D}_{16}$ (czyli $\text{A}5_{16} - 0\text{D}_{16}$, gdzie $\text{A}=10$, $\text{D}=13$).
- **Pozycja 0 (najmłodsza, $5 - 13$)**:
  1. $5 < 13 \to$ początkowy $\text{dług} = 13 - 5 = 8$.
  2. Pożyczka od pozycji starszej (pozycja 1 otrzymuje dług $-1$).
  3. Licznik cofa się z $0$ na maksymalny znak $\text{F}$ ($15_{10}$).
  4. Obrót spłacił $1$ jednostkę: $\text{aktualny dług} = 8 - 1 = 7$.
  5. Wynik pozycji 0: $15\text{ (licznik)} - \text{dług}(8 - 1) = 15 - 7 = \mathbf{8}_{16}$.
- **Pozycja 1 ($\text{A} - 0$ z długiem $-1$)**:
  - $10 - 0 - 1\text{ (dług)} = 9 \ge 0 \to$ brak nowej pożyczki $\to$ wynik: $\mathbf{9}_{16}$.
- **Wynik**: $\mathbf{98_{16}}$ ($165 - 13 = 152_{10}$).

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Układy Half-Subtractor i Full-Subtractor w krzemie</span>
<span class="deep-dive-badge">LOGIKA CYFROWA & ALU</span>
</summary>
<div class="deep-dive-content">

Podobnie jak przy dodawaniu budowaliśmy sumatory, bezpośrednią realizacją sprzętowego odejmowania w logice cyfrowej są **odjemniki**: **Półodjemnik** (*Half-Subtractor*) oraz **Pełny odjemnik** (*Full-Subtractor*).

W każdej kolumnie odejmowania w słupku operujemy na trzech wartościach: odjemnej $A$, odjemniku $B$ oraz ewentualnej pożyczce zaciągniętej przez młodszą kolumnę ($B_{in}$).

### 1. Półodjemnik (Half-Subtractor): odejmowanie dwóch bitów

Półodjemnik oblicza wynik odejmowania $A - B$ dla pojedynczej kolumny bez wcześniejszej pożyczki (np. dla najmłodszego bitu $2^0$).

Składa się z dwóch bramek logicznych:
- **Bit różnicy ($D$, Difference):** Bramka `XOR` ($A \oplus B$) (*zauważ, że to dokładnie ta sama bramka, która wyznacza sumę w półsumatorze!*). Wynik wynosi $1$, gdy bity się różnią ($1 - 0 = 1$ oraz $0 - 1 = 1$ z pożyczką).
- **Bit pożyczki ($B_{out}$, Borrow):** Bramka `AND` z zanegowanym wejściem $A$ ($\overline{A} \cdot B$), gdzie kółko negacji (inwerter NOT na wejściu $A$) sprawia, że sygnał pożyczki $B_{out} = 1$ pojawia się **wyłącznie wtedy, gdy $A = 0$ i $B = 1$** (czyli gdy brakuje nam $1$ i musimy pożyczyć od sąsiada!).

<data-logic-circuit type="half-subtractor"></data-logic-circuit>

Kliknij wejścia $A$ i $B$ w powyższym obwodzie:
- Ustaw $A = 1, B = 0 \to$ Różnica $D = 1$, Pożyczka $B_{out} = 0$ ($1 - 0 = 1$).
- Ustaw $A = 0, B = 1 \to$ Zaświeci się pożyczka $B_{out} = 1$ oraz różnica $D = 1$ (dokładnie tak jak w naszym algorytmie: pożyczamy ze starszej wagi $2$, więc $2 - 1 = 1$).

### 2. Pełny odjemnik (Full-Subtractor): odejmowanie z pożyczką przychodzącą

Gdy młodsza kolumna zaciągnęła u nas dług, musimy odjąć nie tylko $B$, ale również przychodzącą pożyczkę: $A - B - B_{in}$.

W architekturze cyfrowej realizuje się to przez połączenie **dwóch Półodjemników** i jednej bramki **OR**:

<data-logic-circuit type="full-subtractor"></data-logic-circuit>

Przepływ sygnałów w pełnym odjemniku:
1. **Pierwszy półodjemnik (HS 1)** odejmuje $A - B$, zwracając różnicę częściową $D_1$ oraz ewentualną pierwszą pożyczkę $B_1$.
2. **Drugi półodjemnik (HS 2)** odejmuje od częściowej różnicy $D_1$ przychodzącą pożyczkę $B_{in}$, wyznaczając ostateczny bit różnicy $D$. Jeśli brakuje jednostki, generuje drugą pożyczkę $B_2$.
3. **Bramka OR** decyduje o pożyczce ze starszej kolumny ($B_{out}$): jeśli *którykolwiek* z dwóch półodjemników musiał pożyczyć ($B_1 = 1$ lub $B_2 = 1$), nowa pożyczka $B_{out} = 1$ wędruje do sąsiada z lewej.

Wypróbuj w widgecie przypadek $A = 0, B = 0, B_{in} = 1$ (dokładnie sytuacja z kolumny 2 w naszym przykładzie $4 - 1$):
- HS 1: $0 - 0 \to D_1 = 0, B_1 = 0$.
- HS 2: $D_1 - B_{in} = 0 - 1 \to$ generuje $D = 1$ oraz pożyczkę $B_2 = 1$!
- Bramka OR: przekazuje pożyczkę $B_2$ dalej jako $B_{out} = 1$.
- Wynik: $D = 1, B_{out} = 1$, dokładnie tak jak w słupku!

---

#### 💡 Redukcja sprzętowa: realizacja odejmowania za pomocą sumatora (kod U2)

Struktura blokowa układu *Full-Subtractor* jest topologicznie tożsama z układem *Full-Adder* (dwa bloki połówkowe połączone bramką OR).

W jednostkach arytmetyczno-logicznych (ALU) współczesnych procesorów nie implementuje się fizycznie osobnych układów odjemników. Operację odejmowania $A - B$ sprowadza się do operacji sumowania z wykorzystaniem zapisu w kodzie uzupełnienia do dwóch (kod U2):

$$A - B = A + (\neg B + 1)$$

Dzięki temu ten sam wielobitowy sumator sprzętowy wykonuje zarówno dodawanie, jak i odejmowanie. Wystarczy zanegować wejściowy wektor bitów $B$ inwerterami oraz podać stały stan **$1$** na wejście przeniesienia początkowego ($C_{in} = 1$) najmłodszej kolumny.

</div>
</details>

<data-gate>
  <data-arithmetic-challenge base="2" operation="-" count="2"></data-arithmetic-challenge>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Odejmowanie binarne** opiera się na mechanizmie pożyczki (*borrow*): przy braku jednostki w kolumnie następuje zaciągnięcie długu ze starszej pozycji o wadze podstawy $B=2$.
- **Półodjemnik (*Half-Subtractor*)** wyznacza bit różnicy $D = A \oplus B$ oraz sygnał pożyczki $B_{out} = \neg A \cdot B$.
- **Pełny odjemnik (*Full-Subtractor*)** łączy dwa półodjemniki i bramkę OR, odejmując odjemnik $B$ oraz pożyczkę przychodzącą $B_{in}$ od odjemnej $A$.
- W fizycznych procesorach odejmowanie realizuje się bezpośrednio sumatorami za pomocą negacji bitowej i dodania jedynki ($A + \neg B + 1$).
