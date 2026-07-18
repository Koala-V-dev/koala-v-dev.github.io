# Ułamki, Proporcje i Procenty: Skalowanie Systemów

W poprzednich lekcjach nauczyliśmy się operować na stałych jednostkach i znajdować ich wspólne punkty (NWD i NWW). Jednak precyzyjne modelowanie rzeczywistości wymaga opisu stanów pośrednich. Proces dzielenia jednostki na mniejsze segmenty wprowadza nas do zbioru **Liczb Wymiernych** ($\mathbb{Q}$ — *rationale* **Zahlen**).

$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q}$$

*Każdy kolejny zbiór jest rozszerzeniem poprzedniego, zachowując jego prawa i dodając nową precyzję zapisu danych.*

<details>
<summary>Zbiory liczb z niemieckiego (Źródło Prawdy)</summary>

- $\mathbb{N}$ – *natürliche* **Zahlen** (liczby naturalne): $\\{ 0, 1, 2, 3, \ldots \\}$
- $\mathbb{Z}$ – *ganze* **Zahlen** (liczby całkowite): $\\{ \ldots, -3, -2, -1, 0, 1, 2, 3, \ldots \\}$
- $\mathbb{Q}$ – *rationale* **Zahlen** (liczby wymierne): $$\\{ \frac{a}{b} \text{ takich, że } a, b \in \mathbb{Z} \text{ i } b \neq 0 \\}$$
- $\mathbb{R}$ – *reelle* **Zahlen** (liczby rzeczywiste): $?$
- $\mathbb{C}$ – *komplexe* **Zahlen** (liczby zespolone): $?$

Reszty dowiesz się, gdy tylko będziemy ich potrzebować 😉.

</details>

---

## 🏗️ Ułamek: Instrukcja Podziału (Segmentacja)

Ułamek $$\frac{\textcolor{#ff0004}{a}}{\textcolor{#ff0003}{b}}$$ to w inżynierii coś więcej niż wynik dzielenia. To **instrukcja segmentacji**:
> *„Podziel jednostkę na $\textcolor{#ff0003}{b}$ równych segmentów i wybierz z nich $\textcolor{#ff0004}{a}$ części.”*

*   **LICZNIK** ($\textcolor{#ff0004}{a}$) — liczba wybranych segmentów.
*   _**MIANOWNIK**_ ($\textcolor{#ff0003}{b}$) — całkowita liczba części, na które podzielono jednostkę (rozdzielczość podziału).

W ułamku $$\frac{\textcolor{#ff0004}{5}}{\textcolor{#ff0003}{8}}$$ jednostka została podzielona na $\textcolor{#ff0003}{8}$ części (segmentów), z których posiadasz $\textcolor{#ff0004}{5}$.

> [!IMPORTANT]
> Mianownik **_NIGDY_** nie może wynosić **_$0$_**. Ponieważ ułamek to operacja dzielenia, a dzielenie przez zero psuje logiczną spójność całego systemu (brak jednoznacznego wyniku).

---

## 🔄 Kreska Ułamkowa: Operator Dzielenia

Kluczowym faktem jest to, że kreska ułamkowa jest matematycznie tożsama z operatorem dzielenia:
$$\frac{a}{b} = a \div b$$

Zapis $$\\frac{12}{4}$$ to po prostu żądanie: *„Rozdziel $12$ jednostek na $4$ równe grupy”*. Wynikiem jest liczba całkowita $3$.

## 🛠️ Punkt Kontrolny: Czytanie Ułamków

<data-gate>
<data-quiz>
  <question>Ustal wartość dla ułamka $$\frac{12}{4}$$:</question>
  <options>
    <option>$4$</option>
    <option correct>$3$</option>
    <option>$$\frac{3}{1}$$</option>
  </options>
  <div data-hint="error">Zastosuj instrukcję: $12 \div 4$. Ile wynosi wynik operacji?</div>
  <div data-hint="success">Poprawnie. Ułamek dający wynik całkowity to forma uproszczonego zapisu dzielenia.</div>
</data-quiz>
</data-gate>

---

## ✂️ Skracanie: Optymalizacja Zapisu (NWD)

Pamiętasz **NWD** (*Największy Wspólny Dzielnik*)? To Twoje główne narzędzie do **optymalizacji zapisu**. Jeśli licznik i mianownik mają wspólny dzielnik, możemy „skrócić” ułamek, nie zmieniając jego realnej wartości.

Przykład: $$\frac{200}{600}$$ 
Z lekcji o dzielnikach wiemy, że $\text{NWD}(200, 600) = 200$. 
Dzieląc obie części przez $200$, otrzymujemy najprostszą formę:  
$$\frac{200}{600} = \frac{\cancel{200}^{1}}{\cancel{600}_{3}} = \frac{1}{3}$$

---

## ⚙️ Dodawanie i Odejmowanie: Wspólny Mianownik (NWW)

Dodawanie ułamków o różnych mianownikach (np. $$\frac{1}{2} + \frac{1}{3}$$) wymaga sprowadzenia ich do tej samej skali. Przed wykonaniem operacji musimy przeprowadzić **synchronizację mianowników**.

Wykorzystujemy tu mechanizm **NWW** (Najmniejsza Wspólna Wielokrotność).  
Dla mianowników $2$ i $3$ najlepszą bazą (wspólną skalą) jest **$6$**.

### ⚡ Dodawanie Ułamków: Synchronizacja Skali

<data-fraction-add n1="1" d1="2" n2="1" d2="3"></data-fraction-add>

> [!IMPORTANT]
> **Zasada Balansu:** Rozszerzając mianownik, musisz w tym samym stopniu rozszerzyć licznik (pomnożyć przez tę samą wartość), aby zachować wartość ułamka.

---

## ⚙️ Mnożenie i Dzielenie: Inwersja i Skalowanie

**Mnożenie** ułamków to najbardziej bezpośrednia operacja — mnożymy liczniki oraz mianowniki niezależnie. Możesz to traktować jako „ułamek ułamka”.

### ⚡ Mnożenie Ułamków: Bezpośrednia Operacja

<data-fraction-multiply n1="2" d1="3" n2="4" d2="5"></data-fraction-multiply>

### ⚡ Dzielenie Ułamków: Mechanizm Odwrotności

**Dzielenie** natomiast wykonujemy przez operację **odwrotności (inwersji)**. Dzielenie przez ułamek to po prostu mnożenie przez jego odwróconą postać.

<data-fraction-divide n1="2" d1="3" n2="1" d2="2"></data-fraction-divide>

## 🛠️ Punkt Kontrolny: Mechanizm Odwrotności

<data-gate>
<data-quiz>
  <question>Wyznacz wynik operacji $$2 \div \frac{1}{3}$$ wykorzystując odwrotność:</question>
  <options>
    <option>$$\frac{2}{3}$$</option>
    <option correct>$6$</option>
    <option>$3$</option>
    <option>$$\frac{1}{6}$$</option>
  </options>
  <div data-hint="error">Pamiętaj: Dzielenie to mnożenie przez odwrotność. Odwróć ułamek $$\frac{1}{3}$$ i wykonaj mnożenie.</div>
  <div data-hint="success">Doskonale. $$2 \div \frac{1}{3} = 2 \cdot 3 = 6$$. Masz dwie jednostki i sprawdzasz, ile segmentów „jedna trzecia” się w nich mieści. To czysta logika!</div>
</data-quiz>
</data-gate>

---

## 🚀 Stacja Treningowa: Operacje Arytmetyczne

<data-gate>
<data-math-worksheet type="fractions-add" count="1" difficulty="easy" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
<data-math-worksheet type="fractions-add" count="2" difficulty="medium" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
<data-math-worksheet type="fractions-add" count="3" difficulty="hard" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

## ⚖️ Proporcja: Niezmienna Relacja

Proporcja to stwierdzenie, że stosunek dwóch wielkości jest **stały**. Pozwala to na skalowanie systemów (np. rozdzielczość ekranu, skala mapy czy dawkowanie zasobów).

$$\frac{\textcolor{#ff0001}{a}}{\textcolor{#ff0002}{b}} = \frac{\textcolor{#ff0003}{c}}{\textcolor{#ff0004}{d}} \quad \implies \quad \textcolor{#ff0001}{a} \cdot \textcolor{#ff0004}{d} = \textcolor{#ff0002}{b} \cdot \textcolor{#ff0003}{c}$$

## ⚡ Proporcja: Skalowanie „Na Krzyż”

<data-proportion-cross a="3" b="6" c="5" d="x"></data-proportion-cross>

*Przykład: Jeśli $3$ kg materiału kosztuje $6$ zł, to zachowując tę samą proporcję, $5$ kg będzie kosztować $10$ zł.*

$$\frac{3}{6} = \frac{5}{x} \quad \implies \quad 3 \cdot x = 6 \cdot 5$$

$$3x = 30 \quad \| \div 3$$ Podzielmy obie strony równania przez 3, by uzyskać wartość $x$.

$$x = 10$$

## 🛠️ Punkt Kontrolny: Analiza Relacji

<data-gate>
<data-quiz>
  <question>W klasie mamy $12$ uczniów i $3$ opiekunów. Jaki jest stosunek (proporcja) uczniów do opiekunów?</question>
  <options>
    <option>$3:12$</option>
    <option correct>$4:1$</option>
    <option>$12:15$</option>
  </options>
  <div data-hint="error">Skróć relację wykorzystując NWD (podziel obie strony przez $3$).</div>
  <div data-hint="success">Poprawnie. Relacja $12:3$ po skróceniu to $4:1$. Na jednego opiekuna przypada dokładnie $4$ uczniów.</div>
</data-quiz>
</data-gate>

---

## 💯 Procenty: Skala Stustopniowa

**PROCENT** to specjalny ułamek, w którym mianownik zawsze wynosi **$100$**. To uniwersalna skala, która ułatwia nam porównywanie danych z różnych źródeł.

$$x\\% = \frac{x}{100}$$

| Procent | Ułamek | Dziesiętnie | Opis |
| :---: | :---: | :---: | :--- |
| $100\\%$ | $$\frac{100}{100}$$ | $1,0$ | Całość |
| $50\\%$ | $$\frac{1}{2}$$ | $0,5$ | Połowa |
| $25\\%$ | $$\frac{1}{4}$$ | $0,25$ | Ćwierć |
| $10\\%$ | $$$\frac{1}{10}$$ | $0,1$ | Jedna dziesiąta |

> [!TIP]
> Co kraj to inny sposób zapisu.
> W Polsce stosujemy przecinek `,` oddzielający część całkowitą od ułamkowej.
> W anglosaskim i chińskim systemie matematycznym i informatycznym używa się do tego kropki `.`.
> Kanadyjczycy piszą jak im się podoba w zależności od regionu.
> No i jeszcze trzeci format z krajów arabskich gdzie używa się `٫` (momayyez).
> [Mapa świata z separatorami dziesiętnymi](https://en.wikipedia.org/wiki/Decimal_separator#Influence_of_calculators_and_computers)

## 🔗 Połącz Pary: Konwersja Formatu

<data-gate>
<data-connection-matcher>
    <item left="$20\%$" right='<span style="font-size:1.4rem">$\frac{1}{5}$</span>'></item>
    <item left="$75\%$" right='<span style="font-size:1.4rem">$\frac{3}{4}$</span>'></item>
    <item left="$200\%$" right="2 (dwie całości)"></item>
</data-connection-matcher>
</data-gate>

## 🛠️ Punkt Kontrolny: Obliczanie Procentów

<data-gate>
<data-quiz>
  <question>Dysk ma $500$ GB pojemności. Zajęte jest $60\%$. Ile to GB?</question>
  <options>
    <option>$60$ GB</option>
    <option>$200$ GB</option>
    <option correct>$300$ GB</option>
    <option>$440$ GB</option>
  </options>
  <div data-hint="error">Pomnóż: $$\frac{60}{100} \cdot 500$$.</div>
  <div data-hint="success">Zgadza się. $0,6 \cdot 500 = 300$ GB. Procent to po prostu współczynnik skali.</div>
</data-quiz>
</data-gate>

---

## 💻 Implementacja: Precyzja w IT

1.  **Layout (CSS):** Jednostki `%`, `vw`, `vh` to nic innego jak ułamki i procenty viewportu. Pozwalają na tworzenie interfejsów, które adaptują się do każdej rozdzielczości.
2.  **Statystyka i Logi:** Analiza obciążenia procesora (CPU Usage) czy zajętości pamięci RAM podawana jest w procentach, co pozwala na szybką diagnostykę stanu systemu.
3.  **Grafika Komputerowa:** Przezroczystość (Alpha Channel) to wartość od $0\\%$ (pełna przezroczystość) do $100\\%$ (pełne krycie).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- ułamek to instrukcja segmentacji jednostki na równe części,  
- mianownik określa rozdzielczość podziału i **_nigdy nie może być równy_** $\boldsymbol{0}$,  
- skracanie ułamków to optymalizacja zapisu przy użyciu NWD,  
- dodawanie i odejmowanie ułamków wymaga synchronizacji mianowników (NWW),  
- mnożenie ułamków to mnożenie liczników i mianowników,  
- dzielenie ułamków to mnożenie przez odwrotność,  
- proporcja to stała relacja skalująca system,  
- procent to ułamek o mianowniku $\boldsymbol{100}$ — uniwersalna skala porównawcza.

---

Opanowanie części całości (ułamki), relacji (proporcje) oraz skali (procenty) kończy naszą podróż przez podstawy liczb wymiernych ( $\mathbb{Q}$ — *rationale* **Zahlen**). W następnym kroku opanujemy potęgi i pierwiastki. 🚀
