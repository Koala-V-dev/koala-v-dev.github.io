# Funkcja liniowa: Architektura Stałego Wzrostu

W poprzedniej lekcji poznałeś inżynierski ideał: **Bijekcję**. Funkcja liniowa (dla $a \neq 0$) to jej najprostszy, rzeczywisty przykład. Jest to mapowanie, które nie gubi informacji, nie tworzy kolizji i pozwala na idealne odwrócenie procesu. 

W informatyce i inżynierii funkcja liniowa to fundament skalowalności. Gdy mówimy, że system jest „liniowy”, mamy na myśli przewidywalność: jeśli podwoisz wysiłek, otrzymasz podwójny wynik.

---

## 🏗️ Budowa Systemu: Skąd bierze się $y = ax + b$?

Zamiast traktować ten wzór jako dogmat, zbudujmy go od zera, projektując prosty system pomiarowy. Załóżmy, że tworzysz oprogramowanie dla czujnika temperatury.

1.  **Stan Początkowy ($b$):** Gdy system startuje ($x = 0$), czujnik pokazuje jakąś wartość bazową. To jest nasze **$b$** (wyraz wolny). Na wykresie to punkt, w którym prosta przecina oś pionową OY.
2.  **Czułość Systemu ($a$):** Każdy wzrost temperatury o $1$ stopień ($x$) powoduje zmianę sygnału o stałą wartość. Tę stałą zmianę nazywamy **$a$** (współczynnik kierunkowy).

Logiczny ciąg zdarzeń:
- Dla $x = 0$ mamy $y = b$
- Dla $x = 1$ mamy $y = b + a$
- Dla $x = 2$ mamy $y = b + a + a = b + 2a$
- Dla dowolnego $x$ mamy: **$y = ax + b$**

Dzięki temu wzór przestaje być arbitralną regułą, a staje się logiczną konsekwencją stałego tempa wzrostu.

---


## 🪤 Sandbox: Projektowanie Wykresu

Zanim przejdziemy do obliczeń, zobacz jak parametry $a$ i $b$ budują geometrię prostej. Spróbuj tak dobrać wzór funkcji liniowej, aby prosta przecinała oś OY w wskazanym punkcie i miała współczynnik kierunkowy $a = 3$.

<data-gate>
<data-cartesian-sandbox 
    data-expected-pass-x="0" 
    data-expected-pass-y="2" 
    data-expected-slope="3" 
    data-instruction="Wpisz wzór funkcji:">
</data-cartesian-sandbox>
</data-gate>

---

## 🔍 Kalibracja: Wyznaczanie $a$ i $b$ z danych

Inżynier rzadko dostaje gotowy wzór. Częściej ma dwa odczyty z sensora i musi wyznaczyć parametry $a$ i $b$.

### Krok 1: Wyznaczenie czułości ($a$)
Jeśli w punkcie $x_1$ mamy wynik $y_1$, a w punkcie $x_2$ mamy $y_2$, to współczynnik $a$ to stosunek zmiany wyników do zmiany argumentów:

<div class="eq">
  $$ a = \frac{ \vtwo{y_2} - \vone{y_1} }{ \xtwo{x_2} - \xone{x_1} } $$
</div>




### Krok 2: Wyznaczenie punktu startowego ($b$)
Znając $a$ oraz dowolny punkt $(x_1, y_1)$, możemy wyliczyć przesunięcie:
$$b = \vone{y_1} - a \cdot \xone{x_1}$$

### 🪤 Sandbox: Kalibracja Procesu

Wyznacz wzór funkcji, która przechodzi przez punkty $(\xone{2}, \vone{7})$ oraz $(\xtwo{4}, \vtwo{11})$. 

<data-gate>
<data-math-sandbox level="algebra" data-steps="3">
  <div 
    data-step="1" 
    data-expected="a = 2" 
    data-label="Oblicz współczynnik $a$ (zmiana $y$ to $11-7=4$, zmiana $x$ to $4-2=2$):"
    data-hint-wrong="a = 4:Pamiętaj o podzieleniu zmiany $y$ przez zmianę $x$.">
  </div>
  <div 
    data-step="2" 
    data-expected="b = 3" 
    data-label="Podstaw $a = 2$ i punkt $(2, 7)$ do wzoru $b = 7 - a \cdot 2$:"
    data-hint-wrong="b = 5:Oblicz: $7 - (2 \cdot 2) = 3$.">
  </div>
  <div 
    data-step="3" 
    data-expected="2x + 3" 
    data-label="Zapisz pełny wzór funkcji $f(x)=\dots$">
  </div>
</data-math-sandbox>
</data-gate>

---

## 💻 IT: Potęga Skalowania $O(n)$

W informatyce funkcja liniowa to wzorzec **idealnej skalowalności**. Zapisujemy to jako **$O(n)$**. Oznacza to, że czas pracy algorytmu rośnie dokładnie tak samo szybko, jak ilość danych.

![Wykres notacji Big O — porównanie złożoności](/public/courses/matematyka/Images/notacja_dużego_O_z_wydajnością.webp)
*Tu pojawi się wykres porównujący O(1), O(n) i O(n^2)*

W notacji Big O interesuje nas trend przy ogromnych danych. Dlatego ignorujemy wyraz wolny $b$ oraz mnożniki. Dla informatyka funkcje $y = 2n + 100$ i $y = 1000n$ to ta sama klasa — **liniowa**. Przy miliardzie danych stały narzut ($+100$) staje się nieistotny.

---

### 🔗 Połącz Pary: Analiza Systemów Liniowych

Dopasuj opis inżynierski do odpowiadającego mu wzoru matematycznego.

<data-gate>
<data-connection-matcher title="Analiza parametrów systemu">
    <item left="Abonament 50zł + 2zł/GB" right="$y = 2x + 50$" />
    <item left="Szyfrowanie symetryczne (odwracalne)" right="Bijekcja ($a \neq 0$)" />
    <item left="Algorytm O(n) bez narzutu początkowego" right="$y = ax$" />
    <item left="Stały sygnał zepsutego czujnika" right="$y = b$ (brak iniekcji)" />
</data-connection-matcher>
</data-gate>

---

Ukończyłeś Moduł 4! Wiesz już, że funkcje to nie tylko wzory, ale **architektura przepływu danych**. W Module 5 przejdziemy do potężniejszych narzędzi — **Logarytmów i Funkcji Wykładniczych**, które pozwolą nam opisać procesy rosnące znacznie szybciej niż prosta linia. 🚀
