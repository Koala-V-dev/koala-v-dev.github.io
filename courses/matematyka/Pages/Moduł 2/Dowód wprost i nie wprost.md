# Dowód wprost i nie wprost: Fundament Prawdy Obiektywnej

W poprzedniej lekcji nauczyliśmy się zapisywać kontrakty za pomocą kwantyfikatorów ($\forall, \exists$). Jednak w matematyce i wysokiej klasy inżynierii „zapisanie wymagań” to dopiero początek. Prawdziwym wyzwaniem jest **Weryfikacja Formalna**: wykazanie ponad wszelką wątpliwość, że dane twierdzenie jest prawdziwe w całej swojej dziedzinie.

W świecie inżynierii często polegamy na testach (empirii). Jednak testy sprawdzają tylko skończoną liczbę przypadków. Dowód matematyczny to proces **aprioryczny**: weryfikuje on całą nieskończoną przestrzeń wejściową za jednym zamachem, nie pozostawiając miejsca na przypadki brzegowe, których nie przewidziałeś.

---

## 🧱 Definicje formalne: Fundament Dowodzenia

Dowód nie operuje na intuicji ani potocznym rozumieniu słów. Każdy krok musi opierać się na **precyzyjnych definicjach algebraicznych**. Są one „atomowymi wzorcami”, które musisz bezbłędnie identyfikować:

- **Liczba parzysta ($n$):** $\exists k \in \mathbb{Z} : n = 2k$  
  *(Obiekt $n$ posiada cechę parzystości, jeśli da się go zapisać jako podwojoną liczbę całkowitą).*
- **Liczba nieparzysta ($n$):** $\exists k \in \mathbb{Z} : n = 2k+1$  
  *(Obiekt $n$ jest nieparzysty, jeśli po podziale na dwa zostaje mu „reszta” $1$).*

Zauważ rygor: stosując zapis $n = 2k$ w dowodzie, w rzeczywistości dokonujesz **instancji kwantyfikatora egzystencjalnego**. Deklarujesz istnienie pewnej liczby całkowitej $k$, która „obsługuje” strukturę Twojej liczby $n$.

<data-gate>
<data-connection-matcher title="Implementacja Interfejsów: Sprawdź zgodność">
    <item left="$8$" right="$2k$ (dla dodatnich)" />
    <item left="$7$" right="$2k+1$ (dla dodatnich)" />
    <item left="$-6$" right="$2k$ (dla ujemnych!)" />
    <item left="$-3$" right="$2k+1$ (dla ujemnych!)" />
</data-connection-matcher>
</data-gate>

---

## 🏗️ Metoda 1: Dowód wprost

Dowód wprost to liniowy proces dedukcyjny. Twoim celem jest wykazanie, że dla każdego elementu spełniającego założenie, teza wynika z niego w sposób konieczny.

$$\forall x: $$ _**$$\underbrace{P(x)}_{założenie}$$**_ *$\implies$* **$$\underbrace{Q(x)}_{teza}$$**

||||
|--:|:-:|:--|
|_**Założenie**_| to |*Stan Wejściowy*|
|**Teza**| to |*Stan Wyjściowy*|

Schemat jest prosty: wychodzisz od tego, co wiesz (_**Założenie**_), stosujesz definicje (Struktury) i poprzez *przekształcenia algebraiczne* (zgodne z zasadami arytmetyki) docierasz do tego, co chcesz wykazać (**Teza**).

> [!NOTE]
> **Aksjomaty** to Twoje bazowe prawdy (reguły systemu), których nie dowodzimy.
> **Reguły dedukcji** to mechanizmy (kompilator logiki), które gwarantują, że każdy krok wynika z poprzedniego.
> Symbol <span class="qed-symbol">∎</span> (lub **QED**) oznacza: „wykazano, co chciano" (*Quod Erat Demonstrandum*).

### Przykład: Suma dwóch liczb parzystych
**Kontrakt:** $\forall a, b \in \mathbb{Z} : \text{isEven}(a) \land \text{isEven}(b) \implies \text{isEven}(a+b)$

**Twierdzenie:** $\forall a, b \in \mathbb{Z} : (2 \mid a) \land (2 \mid b) \implies 2 \mid (a+b)$

> [!TIP]
> Symbol $\mid$ (*dzieli*) oznacza: liczba z prawej strony jest podzielna przez liczbę z lewej strony.
> Zapis $5 \mid 10$ jest prawdą, bo $10 \div 5 = 2$. 
> Zapis $10 \mid 5$ jest fałszywy, bo $5 \div 10 = 0.5 = \frac{1}{2}$, czyli nie daje całkowitego wyniku.

1. **Zastosowanie definicji:** Skoro $a$ i $b$ są parzyste, istnieją takie $k, m \in \mathbb{Z}$, że $a = 2k$ oraz $b = 2m$.
2. **Podstawienie i operacja:** $a + b = 2k + 2m$.
3. **Faktoryzacja:** Korzystając z rozdzielności mnożenia względem dodawania: $a + b = 2(k+m)$.
4. **Konkluzja:** Skoro $k+m$ jest liczbą całkowitą (suma liczb całkowitych jest całkowita), to wynik ma strukturę $2j$, co z definicji oznacza, że suma jest parzysta. <span class="qed-symbol">∎</span>

---

### 🪤 Sandbox: Suma dwóch nieparzystych

**Teza:** $\forall a, b \in \mathbb{Z}$: jeśli $a$ i $b$ nieparzyste, to $a+b=z$, gdzie $z$ jest liczbą parzystą.

<data-gate>
<data-math-sandbox level="algebra" data-steps="3" data-label="Dowód wprost: nieparzysta + nieparzysta = parzysta">
  <div data-step="1" data-expected="a + b = (2k+1) + (2m+1)" data-label="Wykorzystując zmienne $k, m$ podstaw definicje liczb nieparzystych i porównaj do sumy $a+b$ (Zapisz L=P):" 
    data-hint-wrong="a+b=2k+1+2m+1:💡 Prawie! Zastosuj nawiasy przy podstawianiu definicji liczb nieparzystych, aby zachować strukturę składników.|2k+1=2m+1:❌ To jest równanie dwóch liczb nieparzystych, a my szukamy ich sumy $a+b$.|2k+1+2m+1:💡 Dobrze podstawiłeś definicje, ale zapisz to jako pełne równanie: $a+b=...$|a+b=2k+2m:❌ Liczba nieparzysta ma postać $2k+1$. Sprawdź definicje w tekście powyżej.|a+b=2k+1:💡 Podstawiłeś tylko $a$. Pamiętaj, że $b$ to druga liczba nieparzysta (użyj innej zmiennej, np. $m$)."
    data-hints='{"FORM_MISMATCH": "💡 Przy podstawianiu definicji za $a$ i $b$ użyj nawiasów, aby wyraźnie oddzielić od siebie te dwa obiekty.", "STRUCTURE_MISMATCH": "💡 Lewa strona to suma $a+b$, a prawa to suma ich definicji algebraicznych.", "VARIABLE_MISMATCH": "💡 Użyj dwóch różnych zmiennych (np. $k$ i $m$), bo $a$ i $b$ to dwie niezależne liczby."}'></div>
  <div data-step="2" data-expected="a + b = 2k + 2m + 2" data-label="Usuń nawiasy i uprość sumę składników stałych (Zapisz L=P):" 
    data-hint-wrong="a+b=2k+2m+1:❌ Sumujesz dwie liczby nieparzyste — co się stało z obiema jedynkami z definicji?|2k+2m+2:💡 To poprawny wynik redukcji, ale dopisz na początku $a+b=$ aby utrzymać strukturę dowodu.|2k+2m+1:❌ Sprawdź sumę stałych: $1+1$ to nie $1$."
    data-hints='{"FORM_MISMATCH": "💡 Usuń nawiasy i zredukuj wyrazy podobne. Skup się zwłaszcza na zsumowaniu jedynek.", "STRUCTURE_MISMATCH": "💡 Zapisz wynik jako równanie $a+b = ...$ po wykonaniu dodawania stałych."}'></div>
  <div data-step="3" data-expected="a + b = 2(k+m+1)" data-label="Wyciągnij wspólny czynnik prawej strony przed nawias, aby wykazać parzystość wyniku (Zapisz L=P):" 
    data-hint-wrong="a+b=2(k+m)+2:💡 Prawie! Aby wykazać parzystość, liczba $2$ musi stać przed nawiasem obejmującym CAŁOŚĆ wyrażenia.|2(k+m)+2:💡 Prawie! Dopisz $a+b=$ i wyciągnij $2$ przed nawias z każdego składnika.|2(k+m):💡 Gdzie podziała się dwójka z końca? Pamiętaj, że $2 = 2 \cdot 1$."
    data-hints='{"FORM_MISMATCH": "💡 Wyciągnij wspólny czynnik $2$ przed nawias z całej prawej strony. Pamiętaj, że stała $2$ po wyciągnięciu $2$ zamienia się w $1$.", "STRUCTURE_MISMATCH": "💡 Twoim celem jest postać $2 \cdot (\dots)$, która w matematyce jest definicją parzystości."}'></div>
</data-math-sandbox>
</data-gate>

Wynik po całkowitym uproszczeniu $2(k+m+1)$ jest postaci $2j$, gdzie $j=k+m+1 \in \mathbb{Z}$. Suma **parzysta**. <span class="qed-symbol">∎</span>

---

### 🪤 Sandbox: Suma trzech kolejnych liczb — podzielność

Trzy kolejne liczby całkowite to $\textcolor{#ff0004}{n}$, $\textcolor{#ff0002}{n+1}$, $\textcolor{#ff0003}{n+2}$ dla dowolnego $n \in \mathbb{Z}$.

**Teza:** $\forall n \in \mathbb{Z}: 3 \mid \bigl(\textcolor{#ff0004}{n} + \textcolor{#ff0002}{n+1} + \textcolor{#ff0003}{n+2}\bigr)$

> [!NOTE]
> Symbol $a \mid b$ (czytamy: *„$a$ dzieli $b$"*) to skrócony zapis stwierdzenia że $b$ jest podzielne przez $a$. Pamiętasz z lekcji o Dzielnikach i wielokrotnościach?
> Formalnie: $a \mid b \iff \exists k \in \mathbb{Z}: b = a \cdot k \land a \neq 0$. 
> Czytamy: *$b$ jest podzielne przez $a$ i jest to równoważne z kwantyfikatorem szczegółowym takiego $k$ należącego do zbioru liczb całkowitych, dla którego zachodzi równość $b$ z iloczynem $a \cdot k$, gdzie $a$ nie jest zerem.* 

Definicja dla tego ćwiczenia: $3 \mid x \iff \exists k \in \mathbb{Z}: x = 3k \land a \neq 0$.

<data-gate>
<data-math-sandbox level="algebra" data-steps="2" data-label="Dowód wprost: podzielność sumy trzech kolejnych liczb całkowitych">
  <div data-step="1" data-expected="n + (n+1) + (n+2) = 3n+3" data-label="Po lewej stronie wprowadź wyjściową sumę $n+(n+1)+(n+2)$, a po prawej jej postać po redukcji wyrazów podobnych (Zapisz L=P):" 
    data-hint-wrong="n+(n+1)+(n+2)=3n+2:❌ Przelicz jeszcze raz stałe: $1+2$ to nie $2$.|3n+3:💡 Masz dobry wynik redukcji, ale dla formalności dowodu zapisz go jako $n+(n+1)+(n+2)=...$|3n+2:❌ Błąd w dodawaniu stałych: $1+2=3$."
    data-hints='{"FORM_MISMATCH": "💡 Po lewej stronie zapisz sumę trzech kolejnych liczb, a po prawej wynik ich uproszczenia (zsumuj zmienne $n$ i liczby).", "STRUCTURE_MISMATCH": "💡 Pamiętaj o zachowaniu struktury równania $L=P$."}'></div>
  <div data-step="2" data-expected="n + (n+1) + (n+2) = 3(n+1)" data-label="Wykaż podzielność przez 3: po prawej stronie wyciągnij wspólny czynnik przed nawias (Zapisz L=P):" 
    data-hint-wrong="3(n+1):💡 Dobry wynik, ale zachowaj zapis pełnego równania.|3(n+3):❌ Sprawdź dzielenie stałej: $3 : 3$ to nie $3$."
    data-hints='{"FORM_MISMATCH": "💡 Wyciągnij $3$ przed nawias z wyrażenia po prawej stronie. Co zostanie w środku?", "STRUCTURE_MISMATCH": "💡 Doprowadź do postaci $3 \cdot (\dots)$, aby udowodnić podzielność przez 3."}'></div>
</data-math-sandbox>
</data-gate>

Wynik po całkowitym uproszczeniu $3(n+1)$ jest w postaci $3j$, gdzie $j=n+1 \in \mathbb{Z}$. Suma jest więc podzielna przez $3$. **$QED$**

> [!NOTE]
> Ta sama technika zadziałała dla podzielności przez $3$ — nie tylko dla parzystości. Czynnik zmienił się z $2$ na $3$, a schemat jest wciąż identyczny: **zdefiniuj → podstaw → wyciągnij czynnik**, prawda? 😉

---

### 🪤 Sandbox: Kwadrat nieparzystej

**Teza:** $\forall n \in \mathbb{Z}$: jeśli $n$ jest nieparzyste, to $n^2$ też jest nieparzyste.

Skoro $n = 2k+1$, to dla $n^2$ mamy: $n \cdot n = (2k+1) \cdot (2k+1)$.  
Mnożymy każdy składnik pierwszego nawiasu przez każdy składnik drugiego:

$$($$*$$2k$$*$$+$$_**$$1$$**_$$)$$ $$(2k+1)=$$ *$$\underbrace{2k \cdot 2k}_{4k^2}$$* $+$ *$$\underbrace{2k \cdot 1}_{2k}$$* $+$ _**$$\underbrace{1 \cdot 2k}_{2k}$$**_ $+$ _**$$\underbrace{1 \cdot 1}_{1}$$**_ $$=$$ *$$4k^2$$* $$+$$ **$$4k$$** $$+$$ _**$$1$$**_

Teraz znasz wynik, a poniższe ćwiczenie z pytaniem „co z nim zrobić dalej” nie powinno dla Ciebie stanowić problemu:

<data-gate>
<data-math-sandbox level="algebra" data-steps="2" data-label="Dowód wprost: $n$ nieparzyste **→** $n^2$ nieparzyste">
  <div data-step="1" data-expected="n^2 = 4k^2+4k+1" data-label="Wykonaj mnożenie $(2k+1)(2k+1)$ i porównaj z $n^2$ (Zapisz L=P):" 
    data-hint-wrong="n^2=4k^2+1:❌ Zapomniałeś o tzw. podwojonym iloczynie (środkowym wyrazie) przy mnożeniu nawiasów.|4k^2+4k+1:💡 Wynik mnożenia jest poprawny, ale dopisz na początku $n^2 = ...$|n^2=2k^2+1:❌ Podnosząc $2k$ do kwadratu, musisz podnieść zarówno dwójkę, jak i $k$."
    data-hints='{"FORM_MISMATCH": "💡 Wymnóż oba nawiasy $(2k+1)(2k+1)$ – pamiętaj, że otrzymasz cztery składniki, które należy zredukować."}'></div>
  <div data-step="2" data-expected="n^2 = 2(2k^2+2k)+1" data-label="Wyciągnij czynnik $2$ przed nawias tak, aby uzyskać postać $2(\ldots)+1$ (Zapisz L=P):" 
    data-hint-wrong="2(2k^2+2k)+1:💡 Poprawna faktoryzacja, ale dopisz na początku $n^2 = ...$|2(2k^2+2k+1):❌ Jeśli wyciągniesz dwójkę również z jedynki, otrzymasz ułamek. Zostaw $+1$ na zewnątrz nawiasu."
    data-hints='{"FORM_MISMATCH": "💡 Wyciągnij dwójkę przed nawias tylko z tych składników, które się przez nią dzielą. Ostatnią jedynkę zostaw jako „resztę”."}'></div>
</data-math-sandbox>
</data-gate>

Wynik $2(2k^2 + 2k) +1$, czyli $2 \cdot (\text{coś}) +1$ to dokładnie znowu postać definicji liczby nieparzystej, czyli formalnie $2j+1$ dla pewnego $j \in \mathbb{Z}$, stąd $n^2$ jest nieparzyste. **$QED$** 😎🤙🏻

---

### 🛠️ Punkt Kontrolny: Dowód wprost o zbiorach

W module $1$ (Teoria zbiorów) pracowałeś z diagramami Venna i pojęciem **podzbioru**.  
Formalnie:
$$A \subseteq B \iff \forall x \in A: x \in B$$

Czytamy: „$A$ jest podzbiorem $B$” — czyli każdy element $A$ należy też do $B$. To jest zdanie z kwantyfikatorem $\forall$.

Aksjomat z teorii zbiorów mówi, że $\forall x$: jeśli $x \in A$ i $A \subseteq B$, to $x \in B$.

<data-quiz>
    <question>Masz $x \in A$ i $A \subseteq B$. Co z tego wynika?</question>
    <options>
        <option correct>$x \in B$ — każdy element $A$ jest w $B$.</option>
        <option>$x \in A \cup B$ — jest w sumie zbiorów.</option>
        <option>Nic pewnego — zależy od konkretnych zbiorów.</option>
    </options>
        <div data-hint="error">$A \subseteq B$ znaczy $\forall y \in A: y \in B$. Wstawiamy $y = x$ (skoro $x \in A$)...</div>
    <div data-hint="success">Tak. Kwantyfikator $\forall$ obejmuje każdy element $A$ — w tym $x$. Dowód wprost bez algebry. <span class="qed-symbol">∎</span></div>
</data-quiz>

---

> [!NOTE]
> Jeśli masz $A \subseteq B$, to z definicji: $\forall x (x \in A \Rightarrow x \in B)$. 
> Wstawiasz więc konkretny element $x \in A$ i natychmiast dostajesz $x \in B$. <span class="qed-symbol">∎</span>
> To cały dowód oparty tylko na definicji podzbioru. 
> 
> Czytamy: *„dla każdego elementu x, jeśli x jest w A, to x jest też w B”.*

---

## 🔄 Metoda 2: Dowód nie wprost (Reductio ad absurdum)

To Twoja „broń ostateczna”. Stosujesz ją, gdy bezpośredni atak (dowód wprost) kończy się odbiciem od ściany: na przykład, gdy musisz udowodnić, że coś *nie istnieje* lub że dana operacja jest *niemożliwa*.

**Logika „Błędu w Matrixie”:**
Zamiast budować dowód klocek po klocku, tworzysz chwilową, logiczną superpozycję. Wchodzisz do „świata na opak”, w którym zakładasz, że Twoja teza jest kłamstwem. Badasz ten alternatywny świat tak długo, aż znajdziesz w nim błąd tak absurdalny, że cała ta rzeczywistość musi zostać usunięta.

> [!TIP]
> **Analogia Schrödingera**: Chcesz udowodnić, że kot w pudełku żyje. Zamiast go szukać, zakładasz na chwilę:  
> *„Kot jest martwy”*.
> Ale martwy kot nie mruczy, a Ty słyszysz mruczenie 🤔. Masz _**sprzeczność**_. Skoro martwy kot nie mruczy, Twoje założenie o jego śmierci było błędem. Wniosek: kot żyje 😺. <span class="qed-symbol">∎</span>

### Algorytm Detekcji Sprzeczności
1. **Wprowadzenie Anomalii** (*Negacja*): Przyjmij, że Twoja teza jest fałszywa. Zapisz to jako nowe, „tymczasowe” założenie.
2. **Symulacja** (*Dedukcja*): Przeprowadź ciąg operacji algebraicznych w oparciu o tę anomalię.
3. **Detekcja Błędu** (*Sprzeczność*): Uderz w mur — znajdź wynik, który przeczy rzeczywistości lub aksjomatom (np. wyjdzie Ci, że liczba jest jednocześnie parzysta i nieparzysta).
4. **Przywrócenie Rzeczywistości** (*Wniosek*): Skoro anomalia niszczy logikę, musi być fałszywa $\implies$ Twoja oryginalna teza jest prawdą.

---

### 🔍 Analiza sprzeczności: Niewymierność $\sqrt{2}$
Pitagorejczycy dążyli do opisania świata za pomocą liczb wymiernych $\mathbb{Q}$ — ułamków $\frac{p}{q}$ ($p, q \in \mathbb{Z}$). Gdy odkryli $\sqrt{2}$, stanęli przed problemem, którego nie dało się rozwiązać empirycznie. Rozwiązali go za pomocą dowodu nie wprost.

**Teza:** $\sqrt{2} \notin \mathbb{Q}$ (liczba $\sqrt{2}$ jest niewymierna).

**Krok 1 & 2 (Założenie o wymierności):**
Zakładamy, że $\sqrt{2}$ jest liczbą wymierną. Oznacza to, że istnieją takie liczby całkowite $p$ i $q$, że $\sqrt{2} = \frac{p}{q}$. Co kluczowe, zakładamy, że ułamek ten jest **nieskracalny** (licznik i mianownik nie mają wspólnych dzielników poza jedynką).

<data-gate>
<data-math-sandbox level="algebra" data-steps="2" data-label="Analiza dowodu: Krok 1 — Własności licznika">
  <div data-step="1" data-expected="2 = p^2 / q^2" data-label="Podnieś równanie $\sqrt{2} = \frac{p}{q}$ do kwadratu (Zapisz L=P):" 
    data-hint-wrong="2 = p/q:Kwadrat ułamka to kwadrat licznika i mianownika. Podnieś p i q do potęgi 2.|4 = p^2/q^2:Podnosisz $\sqrt{2}$ do kwadratu, więc wynik to $2$, nie $4$."
    data-hints='{"FORM_MISMATCH": "💡 Podnieś obie strony do kwadratu: $(\\sqrt{2})^2 = (p/q)^2$."}'></div>
  <div data-step="2" data-expected="p^2 = 2q^2" data-label="Przekształć wzór, aby wyizolować $p^2$ (Zapisz L=P):" 
    data-hint-wrong="2q^2 = p:Zgubiłeś potęgę z p. Prawidłowy wynik to $p^2 = 2q^2$.|p^2 = q^2/2:Pomnóż obie strony przez $q^2$, aby pozbyć się ułamka."
    data-hints='{"FORM_MISMATCH": "💡 Pomnóż obie strony przez $q^2$, otrzymasz $p^2 = 2q^2$."}'></div>
</data-math-sandbox>
</data-gate>

**Wniosek 1:** Skoro $p^2 = 2q^2$, to $p^2$ jest liczbą parzystą. Z własności kwadratów liczb wynika, że samo **$p$ również musi być parzyste**. Możemy je więc zapisać jako $p = 2k$.

<data-gate>
<data-math-sandbox level="algebra" data-steps="3" data-label="Analiza dowodu: Krok 2 — Własności mianownika">
  <div data-step="1" data-expected="(2k)^2 = 2q^2" data-label="Podstaw $p = 2k$ do równania <em>$p^2 = 2q^2$</em> (Zapisz L=P, użyj nawiasów):" 
    data-hint-wrong="2k^2 = 2q^2:Musisz podnieść do kwadratu całe wyrażenie za p. Użyj (2k)^2.|2k=2q^2:Podstawienie za $p$ to $2k$, ale we wzorze jest $p^2$."
    data-hints='{"FORM_MISMATCH": "💡 Podstaw $2k$ w miejsce $p$ w równaniu $p^2=2q^2$."}'></div>
  <div data-step="2" data-expected="4k^2 = 2q^2" data-label="Podnieś lewą stronę do kwadratu (Zapisz L=P):" 
    data-hint-wrong="2k^2 = 2q^2:Pamiętaj, że $(2k)^2 = 4k^2$.|4k=2q^2:Pamiętaj o podniesieniu $k$ do kwadratu."
    data-hints='{"FORM_MISMATCH": "💡 Oblicz $(2k)^2$, czyli $4k^2$."}'></div>
  <div data-step="3" data-expected="2k^2 = q^2" data-label="Podziel obie strony równania przez 2 (Zapisz L=P):" 
    data-hint-wrong="4k^2 = 2q^2:Skróć czynniki, aby wyizolować $q^2$.|2k^2=2q^2:Podziel obie strony przez 2."
    data-hints='{"FORM_MISMATCH": "💡 Skróć równanie przez 2, otrzymasz $2k^2 = q^2$."}'></div>
</data-math-sandbox>
</data-gate>

**Wniosek 2:** Skoro $q^2 = 2k^2$, to $q^2$ jest parzyste, a zatem **$q$ również jest parzyste**.

_**Krok 4 (Zderzenie ze ścianą — Sprzeczność!):**_
Na samym początku założyliśmy twardo, że nasz ułamek $\frac{p}{q}$ jest **całkowicie nieskracalny**.
Tymczasem nasze algebraiczne manipulacje obnażyły prawdę: zarówno licznik $p$, jak i mianownik $q$ to liczby parzyste!  
> A skoro obie są parzyste, można je bez problemu podzielić (skrócić) przez $2$.

Ułamek nie może być jednocześnie całkowicie nieskracalny i skracalny. To logiczny absurd! 😖 
_**Wniosek:**_ Skoro założenie wywołało sprzeczność, $\sqrt{2}$ **nie da się** zapisać jako ułamek. Dowód zakończony. **$QED$**

---

## ⚖️ Metoda 3: Kontrapozycja (Logical Refactoring)

Stosujesz ją, gdy napotykasz „algebraiczną ścianę”. Często teza operuje na zaprzeczeniach (np. „nie jest równe”, „nie dzieli się”), co blokuje możliwość podstawienia definicji.

Wtedy stosujesz **Prawo Kontrapozycji** — potężne narzędzie „refaktoryzacji logicznej”, które pozwala zamienić trudne twierdzenie na jego prostszy, równoważny odpowiednik:

$$P \implies Q \quad \equiv \quad \neg Q \implies \neg P$$

> [!TIP]
> **Dlaczego to działa?** Wyobraź sobie regułę: „Jeśli pada deszcz ($P$), to asfalt jest mokry ($Q$)”. Jeśli wyjrzysz przez okno i zobaczysz, że asfalt jest suchy ($\neg Q$), to masz $100\\%$ pewności, że deszcz NIE PADA ($\neg P$). Te dwa zdania niosą dokładnie tę samą informację logiczną.

> [!CAUTION]
> Pamiętaj o notacji: w dowodach używamy grubego symbolu $\implies$. Zwykła strzałka $\to$ jest zarezerwowana dla granic lub rzutowania funkcji.

### 🧪 Trening: Mapowanie Logiczne

Zanim przejdziesz do obliczeń, musisz bezbłędnie „odwrócić kota ogonem 🐈”.  
Sprawdź, czy potrafisz przygotować tezę do refaktoryzacji.

**Twierdzenie:** „Jeśli $n^2$ NIE jest podzielne przez 5, to $n$ NIE jest podzielne przez 5”.

<data-quiz>
    <question>Jak brzmi poprawnie sformułowana kontrapozycja ($\neg Q \implies \neg P$) dla powyższego twierdzenia?</question>
    <options>
        <option>Jeśli $n^2$ jest podzielne przez 5, to $n$ jest podzielne przez 5.</option>
        <option correct>Jeśli $n$ jest podzielne przez 5, to $n^2$ jest podzielne przez 5.</option>
        <option>Jeśli $n$ nie jest podzielne przez 5, to $n^2$ nie jest podzielne przez 5.</option>
    </options>
    <div data-hint="error">Pamiętaj: zamieniamy strony ($P \iff Q$) ORAZ zaprzeczamy oba zdania.</div>
    <div data-hint="success">Doskonale! Teraz zamiast walczyć z „brakiem podzielności” i pierwiastkami, masz czystą definicję: $n = 5k$. Droga do dowodu stoi otworem. 😎</div>
</data-quiz>

---

### 🪤 Sandbox: Dlaczego Kontrapozycja to konieczność?

Wyobraź sobie, że próbujesz udowodnić oryginał **wprost** (walcząc z „brakiem podzielności”).  
Zobacz, jak drastycznie rośnie **złożoność** (liczba przypadków do sprawdzenia):

| Podzielność przez | Metoda Wprost (Brute Force) | Kontrapozycja (Refactoring) |
| :--- | :--- | :--- |
| **3** | 2 dowody ($3k+1, 3k+2$) | **1 dowód** ($3k$) |
| **5** | 4 dowody ($5k+1...5k+4$) | **1 dowód** ($5k$) |
| **11** | 10 dowodów | **1 dowód** ($11k$) |
| **$n$** | **$n-1$** dowodów | **1 dowód** ($nk$) |

Problem rośnie **liniowo**. Każda większa liczba to wyższa „ściana” i mozolne wnioskowanie. 🛑 

**Kontrapozycja „refaktoryzuje” ten problem.**  
Niezależnie od dzielnika, zawsze sprowadzasz dowód do _**jednego, eleganckiego przypadku**_. 

Przetestujmy to na skali $5k$:

<data-gate>
<data-math-sandbox level="algebra" data-steps="2" data-label="Dowód przez kontrapozycję: Skalowanie problemu (5k)">
  <div data-step="1" data-expected="n^2=25k^2" data-label="Wyznacz wartość **$n^2$** korzystając z założenia, że **$n = 5k$** (Zapisz L=P):" 
    data-hint-wrong="n^2=5k^2:Pamiętaj o podniesieniu liczby 5 do kwadratu: $5 \cdot 5 = 25$.|n^2=(5k)^2:Wykonaj potęgowanie, aby pozbyć się nawiasów.|25k^2:Podaj pełne równanie $n^2=...$"
    data-hints='{"FORM_MISMATCH": "💡 Podnieś $5k$ do kwadratu, otrzymasz $25k^2$."}'></div>
  <div data-step="2" data-expected="n^2=5(5k^2)" data-label="Wykaż, że otrzymany wynik jest wielokrotnością liczby **5** (Zapisz L=P):"
    data-hint-wrong="5(5k^2):Dobre wyciągnięcie czynnika, ale dopisz na początku $n^2 = ...$"
    data-hints='{"FORM_MISMATCH": "💡 Z wyrażenia $25k^2$ wyciągnij 5 przed nawias: $5 \\cdot (5k^2)$.", "STRUCTURE_MISMATCH": "💡 Wymagana forma: $n^2 = 5(5k^2)$"}'></div>
</data-math-sandbox>
</data-gate>

**Konkluzja:** Wykazaliśmy, że $n^2 = 5j$ (gdzie $j = 5k^2$). Dzięki kontrapozycji wiemy, że nasze pierwotne, trudne twierdzenie jest prawdziwe — i to bez sprawdzania 4 oddzielnych przypadków! <span class="qed-symbol">∎</span>

---

## 🔩 Dowody w inżynierii: Poza granice testowania

Zastanawiałeś się kiedyś, dlaczego systemy krytyczne (medyczne, lotnicze, bankowe) wymagają czegoś więcej niż „dobrego pokrycia testami”? Ponieważ testowanie (TDD, BDD) to empiria: sprawdza tylko te scenariusze, które programista zdołał przewidzieć. 

Dowód matematyczny to *ostateczna polisa ubezpieczeniowa*, dająca $100\\%$ gwarancji poprawności dla **każdej** możliwej konfiguracji danych wejściowych.

_**Matematyka w działaniu:**_
1. **Weryfikacja kompilatorów (np. Rust):** Mechanizm *Borrow Checker* w języku Rust to w rzeczywistości zautomatyzowany system dowodzenia nie wprost. Kompilator rygorystycznie weryfikuje, czy Twoje zarządzanie pamięcią nie prowadzi do sprzeczności logicznej (np. wyścigu danych). Jeśli nie potrafi dowieść bezpieczeństwa — odrzuci kod przed uruchomieniem.
2. **Zaawansowane systemy typów:** Systemy typów (TypeScript, Haskell) wykorzystują reguły logiki i teorii zbiorów z modułu $1$, aby wykazać błędy w Twoich założeniach na etapie kompilacji. To dowód wprost przeprowadzany przez maszynę na Twoim kodzie.
3. **Kryptografia:** Bezpieczeństwo protokołów takich jak RSA nie opiera się na „nadziei”, lecz na twardych dowodach matematycznych dotyczących trudności faktoryzacji dużych liczb. Złamanie szyfru oznaczałoby złamanie fundamentalnego twierdzenia matematycznego.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:


- dowód matematyczny to weryfikacja aprioryczna (obejmuje całą nieskończoną przestrzeń wejść),  
- definicje algebraiczne (np. $2k$ dla parzystych) to fundament, na którym budujesz logiczną dedukcję,  
- dowód wprost to liniowy proces od założenia do tezy poprzez przekształcenia struktur,  
- dowód nie wprost (*Reductio ad absurdum*) polega na szukaniu błędu w „alternatywnej rzeczywistości”,  
- kontrapozycja pozwala na „logiczny refaktoring” trudnych problemów do jednego, czystego przypadku,  
- w inżynierii dowody wspierają bezpieczeństwo systemów krytycznych (lotnictwo, kryptografia, Rust).

---

Przed Tobą wyzwanie ostateczne. W następnej lekcji opanujesz technikę **Indukcji Matematycznej**. To „efekt domina”, który pozwoli Ci udowadniać poprawność pętli i algorytmów operujących na nieskończonych zbiorach danych. Rozpracujemy tam wzór, którym straszono Cię od początku kursu: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$. 🚀
