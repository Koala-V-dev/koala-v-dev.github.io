# Czym jest funkcja?

W poprzedniej lekcji zdefiniowaliśmy relację formalnie jako podzbiór iloczynu kartezjańskiego:
$$R \subseteq A \times B$$
Relacja z natury dopuszcza dużą swobodę, jeden element $x$ może być powiązany z wieloma elementami $y$, albo z żadnym.

Matematyka i inżynieria oprogramowania potrzebują jednak czegoś silniejszego: **determinizmu**. Funkcja to relacja obarczona jednym rygorystycznym warunkiem.

---

## ⚙️ Jedna zasada, która wszystko zmienia

> [!IMPORTANT]
> **Zasada jednoznaczności:** Każdemu elementowi ze zbioru wejściowego $X$ przyporządkowany jest _**dokładnie jeden**_ element ze zbioru wyjściowego $Y$.
> 
> _**„Dokładnie jeden"**_ — nie zero, nie dwa. Ściśle jeden.

Formalnie, jeśli relacja $f \subseteq X \times Y$ jest funkcją, to dla każdego $x \in X$ istnieje dokładnie jedno $y \in Y$ takie, że para $(x, y) \in f$. Mówimy wtedy, że $y$ jest **wartością** funkcji $f$ w punkcie $x$ i zapisujemy:
$$f(x) = y$$

Zapis składni języka **`LaTeX`**: `f(x) = y`

### 🛠️ Punkt Kontrolny: Zasada jednoznaczności
<data-quiz>
    <question>Maszyna vendingowa (automat z napojami): wrzucasz monetę i wciskasz przycisk `A3`. Kiedy ta maszyna PRZESTAJE zachowywać się deterministycznie jak funkcja matematyczna?</question>
    <options>
        <option>Gdy kilka różnych przycisków wydaje ten sam produkt.</option>
        <option correct>Gdy wciśnięcie A3 raz wydaje colę, a innym razem wodę.</option>
        <option>Gdy przycisk A3 wydaje zawsze colę.</option>
    </options>
    <div data-hint="error">
    Deterministyczność musi być w „przód”, to samo wejście = zawsze ten sam wynik. Jednocześnie w „tył” deterministyczność nie musi być zachowana, różne wejścia mogą prowadzić do tego samego wyniku.
    </div>
    <div data-hint="success">
    Dokładnie. Naruszenie zasady jednoznaczności: to samo wejście (`A3`) daje różne wyniki.
    W programowaniu to odpowiednik funkcji z efektami ubocznymi — wynik zależy od ukrytego stanu, nie tylko od argumentu.
    </div>
</data-quiz>

---

## 🥊 Kiedy relacja NIE jest funkcją?

Dwie sytuacje wykluczają relację z bycia funkcją:

**1. Jeden $x$, dwa różne $y$ — brak jednoznaczności:**
$$R = \\{(1,2),(1,5),(2,3)\\}$$
Element $1$ wskazuje jednocześnie na $2$ i $5$ — warunek jednoznaczności złamany.

**2. Element $x$ ze zbioru wejściowego $X$ bez przypisanego $y$ — luka:**
$$R = \\{(1,2),(3,4)\\} \text{ na } X = \\{1,2,3\\}$$
Element $2 \in X$ nie pojawia się po lewej stronie żadnej pary — relacja nie pokrywa całego zbioru $X$, więc nie może być funkcją.

**Dozwolone — kilka $x$ wskazuje na ten sam $y$:**
$$f(2) = 4, \quad f(-2) = 4$$
To przykład $f(x) = x^2$ — poprawna funkcja. Determinizm „w przód" jest zachowany.

### 🔗 Połącz Pary: Funkcja czy relacja?
<data-connection-matcher title="Funkcja czy relacja? Dopasuj opis do oceny">
    <item left="$\{(1,3),(2,3),(3,3)\}$ na $X=\{1,2,3\}$" right="Funkcja — każdy $x$ z $X$ ma dokładnie jeden $y$ (choć wszystkie dają to samo)" />
    <item left="$\{(1,2),(1,4),(2,3)\}$ na $X=\{1,2\}$" right="Nie funkcja — element $1$ z $X$ ma dwa różne przypisania" />
    <item left="$\{(1,2),(3,4)\}$ na $X=\{1,2,3\}$" right="Nie funkcja — element $2$ z $X$ nie ma żadnego przypisanego $y$" />
    <item left="$\{(1,5),(2,3),(3,1)\}$ na $X=\{1,2,3\}$" right="Funkcja — każdy $x$ z $X$ ma dokładnie jeden $y$, wszystkie różne" />
</data-connection-matcher>

---

## 📝 Zapis i notacja

Funkcję zapisujemy jako:
$$f: X \to Y, \quad f(x) = \text{wyrażenie}$$

- $X$ — **zbiór wejściowy**: zbiór wszystkich dopuszczalnych wejść
- $Y$ — **zbiór wyjściowy**: zbiór, w którym szukamy wyjść
- $f(x)$ — wartość funkcji w punkcie $x$

Zapis $f: X \to Y$ to formalny odpowiednik sygnatury funkcji w programowaniu. W języku JavaScript wygląda to tak:

```javascript
// Sygnatura: f przyjmuje liczbę z X i zwraca liczbę do Y
const f = (x) => x * x;
```

Czysta funkcja (ang. *pure function*) w programowaniu to matematyczny ideał — wynik zależy wyłącznie od argumentu, nie od żadnego zewnętrznego stanu:

```javascript
// Czysta funkcja — to samo wejście zawsze daje ten sam wynik
const f = (x) => x * x;

// To NIE jest funkcja matematyczna — wynik zależy od stanu zewnętrznego
let bias = 5;
const g = (x) => x + bias;  // zmień bias, zwiększ "wynik" dla podanego x
```

### 🪤 Sandbox: Zbuduj funkcję

Zasada determinizmu oznacza, że dla każdego $x$ musisz podać jednoznaczny wzór. Wypróbuj to w nowej piaskownicy: wpisz wzór funkcji, która każdemu $x$ przypisuje wartość o $1$ mniejszą ($x - 1$).

<data-gate>
<data-cartesian-sandbox 
    data-range="5" 
    data-instruction="Wpisz wzór funkcji $f(x) = x - 1$:"
    data-expected-slope="1"
    data-expected-intercept="-1"
    data-hint-wrong="To nie jest wzór $x - 1$. Upewnij się, że poprawnie odejmujesz jedynkę od zmiennej $x$.">
</data-cartesian-sandbox>
</data-gate>

---

### 🛠️ Punkt Kontrolny: Kompletność definicji

<data-quiz>
    <question>Warunek, że każdemu elementowi $x \in X$ musi odpowiadać dokładnie jeden element $y \in Y$, jest fundamentem definicji funkcji. Które stwierdzenie trafnie opisuje praktyczną konsekwencję tej zasady?</question>
    <options>
        <option correct>Jeśli choćby jeden element zbioru wejściowego $X$ nie ma przypisania, relacja przestaje być funkcją.</option>
        <option>Jeśli dwa różne elementy $x_1, x_2 \in X$ dają ten sam wynik $y$, relacja przestaje być funkcją.</option>
        <option>Funkcja musi przypisywać elementy z $X$ do różnych elementów $Y$ — żadne dwa $x$ nie mogą wskazywać na to samo $y$.</option>
    </options>
    <div data-hint="error">Pamiętaj: warunek funkcji jest jednostronny. Determinizm „w przód" (każde $x$ ma dokładnie jedno $y$) jest obowiązkowy. Determinizm „w tył" (każde $y$ pochodzi z dokładnie jednego $x$) to już osobna właściwość — iniekcja, którą poznasz w kolejnej lekcji.</div>
    <div data-hint="success">Tak. Funkcja to deklaracja, że każdy element zbioru wejściowego zostaje obsłużony — bez wyjątków i bez niejasności.</div>
</data-quiz>

---

W następnej lekcji przyjrzymy się **granicom** funkcji: co może być wejściem, a co wyjściem — czyli **dziedzinie** i **zbiorowi wartości**. 🚀
