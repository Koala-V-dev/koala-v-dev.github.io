# Dziedzina i zbiór wartości

Każda funkcja działa w ściśle zdefiniowanych granicach. W inżynierii oprogramowania nazywamy to **walidacją wejścia** (Input Validation) i **zakresem wyjściowym** (Output Range). W matematyce używamy pojęć **dziedzina** i **zbiór wartości**.

---

## 📐 Notacja przedziałowa — Alfabet granic

Zanim zaczniemy wyznaczać granice, musisz umieć je zapisać. Używamy do tego **przedziałów**.

1.  **Przedział domknięty** $\langle a; b \rangle$: Liczby $a$ i $b$ należą do zbioru. Na wykresie to „zamalowana kropka”.
2.  **Przedział otwarty** $(a; b)$: Liczby $a$ i $b$ są granicami, ale same nie należą do zbioru. Na wykresie to „pusta kropka”.
3.  **Nieskończoność** $\infty$: Gdy zbiór nie ma końca, używamy symbolu $+\infty$ lub $-\infty$. Przy nieskończoności przedział jest **zawsze otwarty**, np. $\langle 0; +\infty)$.

---

## 🛑 Dziedzina ($D_f$) — Strażnicy wejścia

**Dziedzina** to zbiór wszystkich $x$, dla których funkcja „nie wyrzuca błędu”. W liczbach rzeczywistych ($\mathbb{R}$) mamy dwóch głównych strażników:

*   **Mianownik $\neq 0$** (nie dzielimy przez zero).
*   **Wyrażenie pod pierwiastkiem $\geq 0$** (nie pierwiastkujemy liczb ujemnych).

### Przykład: Funkcja wymierna
Przyjrzyjmy się funkcji $f(x) = \frac{1}{x - 2}$. Mianownik nie może być zerem, co na wykresie oznacza „dziurę” w punkcie $x=2$.

<data-cartesian-worksheet data-range="6" data-formula="1/(x-2)" palette="interval" data-highlight-ox="(-inf; 2), (2; inf)">
    <step expected="x - 2 \neq 0" palette="comparison" >Jaki warunek musi spełniać mianownik tej funkcji?</step>
    <step expected="D = \mathbb{R} \setminus \{2\}" >Zapisz dziedzinę jako zbiór (użyj symbolu $\setminus$ oraz $\mathbb{R}$):</step>
</data-cartesian-worksheet>

---

Domena:  
$$D = \mathbb{R} \setminus \\{2\\}$$
co oznacza, że funkcja jest określona dla wszystkich liczb rzeczywistych oprócz $2$.
Równoważnie można zapisać 🧐:
$$D = (-\infty; 2) \cup (2; \infty)$$


## 🛡️ Strategia: Metoda „Wielu Strażników”

Gdy funkcja jest złożona, np. $f(x) = \dfrac{\sqrt{x}}{x - 3}$, musimy zadowolić wszystkich strażników naraz. 

1.  **Licznik**: $x$ musi być pod pierwiastkiem, więc $x \geq 0$.
2.  **Mianownik**: $x - 3$ nie może być zerem, więc $x \neq 3$.

<data-cartesian-worksheet data-range="8" data-formula="\dfrac{\sqrt{x+4}}{x - 5}" data-highlight-ox="\langle -4; 5), (5; inf)" palette="interval">
    <step expected="x + 4 \geq 0" palette="comparison">Co musi spełniać licznik $\sqrt{x+4}$?</step>
    <step expected="x \neq 5" palette="comparison">Co musi spełniać mianownik $x - 5$?</step>
    <step expected="\langle -4; 5) \cup (5; \infty)" >Podaj końcową dziedzinę jako sumę przedziałów (używaj średnika jako separatora):</step>
</data-cartesian-worksheet>

---

## 📤 Zbiór Wartości ($ZW_f$) — Co wychodzi z systemu?

**Zbiór wartości** to zestaw wszystkich wyników $y$, które funkcja może wyprodukować dla zadanej dziedziny. Jeśli Dziedzina to „co wolno włożyć”, to Zbiór Wartości to „co może wyjść”.

### Intuicja wizualna: Metoda Rzutu
Wyobraź sobie, że świecisz latarką z prawej (lub lewej) strony prosto na oś **OY**. Cień, który wykres rzuci na tę oś, to właśnie Twój zbiór wartości.

### Perspektywa Inżynierska: Output Constraints
W systemach fizycznych zbiór wartości to często **zakres roboczy urządzenia**.
- Przetwornik DAC 10-bitowy ma zbiór wartości $[0; 1023]$.
- Czujnik temperatury z wyjściem napięciowym może mieć $ZW = \langle 0V; 5V \rangle$.

### Jak wyznaczyć $ZW_f$ bez wykresu?
Musimy szukać ograniczeń wynikających z natury operacji:
1.  **Potęgi parzyste**: $x^2, x^4, \dots$ zawsze dają wyniki $\geq 0$.
2.  **Wartość bezwzględna**: $|x|$ zawsze daje wyniki $\geq 0$.
3.  **Pierwiastki stopnia parzystego**: $\sqrt{x}$ zawsze daje wyniki $\geq 0$.

### Przykład: Funkcja kwadratowa
Funkcja $f(x) = x^2$ przyjmuje dowolne $x \in \mathbb{R}$, ale niezależnie od tego, co podstawisz, wynik nigdy nie będzie ujemny.

<data-cartesian-worksheet data-range="6" data-formula="x^2" palette="interval" data-highlight-oy="\langle 0; inf)">
    <step expected="\langle 0; \infty)">Patrząc na wykres, jaki jest zbiór wartości tej funkcji? (Spójrz na podświetlenie osi OY)</step>
</data-cartesian-worksheet>

---

## 🛠️ Punkt Kontrolny: Debugowanie Systemu

Sprawdźmy Twoją intuicję inżynierską.

<data-quiz>
    <question>Funkcja $f(x) = |x| + 5$ przesuwa wykres wartości bezwzględnej o 5 jednostek w górę. Jaki jest jej zbiór wartości ($ZW_f$)?</question>
    <options>
        <option correct>$\langle 5; \infty)$</option>
        <option>$\langle 0; \infty)$</option>
        <option>$\mathbb{R}$</option>
    </options>
    <div data-hint="success">Doskonale! Zauważyłeś, że przesunięcie w górę (offset) bezpośrednio wpływa na zakres wyjściowy funkcji.</div>
    <div data-hint="error">Nie do końca. Zastanów się: moduł $|x|$ zawsze zwraca co najmniej 0. Jeśli dodasz do tego 5, to jaka będzie najmniejsza możliwa wartość?</div>
</data-quiz>

---

## 📝 Podsumowanie dla Inżyniera

| Pojęcie | Perspektywa Matematyczna | Perspektywa Programistyczna |
| :--- | :--- | :--- |
| **Argument ($x$)** | Zmienna niezależna | Parametr wejściowy (Input) |
| **Dziedzina ($D_f$)** | Zbiór dopuszczalnych $x$ | Walidacja / Typy wejściowe |
| **Wartość ($y$)** | Wynik operacji | Wynik (Return value) |
| **Zbiór Wartości ($ZW_f$)** | Zestaw wszystkich $y$ | Zakres wyjściowy (Output Range) |

---

## 🚀 Co dalej?

Wyznaczanie dziedziny i zbioru wartości to podstawa analizy algorytmów. W następnej lekcji dowiemy się, jak sprawdzić, czy funkcja jest „odwracalna” — czyli czy na podstawie wyniku możemy odtworzyć wejście. Poznamy **iniekcję i surjekcję**.
