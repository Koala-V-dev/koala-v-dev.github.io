# ROADMAP: Logika i Algorytmy - Pseudokod

Ten dokument stanowi ostateczne repozytorium wiedzy i źródło prawdy dla rozwoju kursu. Nie skracamy, nie kompresujemy – każda z poniższych wytycznych to absolutny obowiązek do zrealizowania przed zakończeniem kursu.

**Główny Cel Kursu:** Przygotować ucznia na *każdy* prawdziwy język programowania (JS, C++, PHP, SQL). To fundament, który sprawi, że uczeń po tym kursie będzie gotowy na każdy język. Uczeń musi po nim wyjść z umiejętnością rozumienia kodu, a nie tylko jego "klepania".

## 🧠 Filozofia Dydaktyczna: "Zero Magii"

1. **Świadomość Maszyny:** Uczymy, jak kod wchodzi w fizyczną interakcję z komputerem (RAM, procesor).
2. **Kompilator w Mózgu:** Wymuszamy symulację algorytmów na kartce (Trace Table) *zanim* kod trafi do maszyny.
3. **Prawdziwe przykłady:** Używamy przykładów z informatyki i inżynierii (Bankomat, Pipeline GPU, Zupka Błyskawiczna). Nie ma dziecinnych anegdot.
4. **Zależność i Spójność:** Abstrakcja $\rightarrow$ Wizualizacja $\rightarrow$ Tekst $\rightarrow$ Architektura.

---

## 🏗️ Status Wdrożenia Merytoryki (Kompletny Plan Rozwoju)

Poniżej znajduje się bezkompromisowa lista wymogów, które muszą zostać odhaczone przed uznaniem modułów za gotowe. 

### Moduł 0: Fundamenty Maszyny (Zakończone)
- [x] **Brutalna dosłowność maszyn**
- [x] **Algorytm jako fundament**
- [x] **Sekwencja i stan**
- [x] **Błędy i ich warstwy**
- [x] **Dekompozycja**
- [x] **Optymalizacja**
- [x] **Wieże Hanoi jako test myślenia**
- [x] **Przejście do pseudokodu**
- [x] **Pierwsze struktury sterujące**
- [x] **Pętle i trace table**

---

### 🔥 Co MUSI znaleźć się w kursie pseudokodu przed wejściem w prawdziwe języki (Moduł 1: Logika i Teoria Struktur)

### 1. Typy danych (abstrakcyjne, nie językowe)
Uczeń musi zrozumieć:
- [x] liczby całkowite
- [x] liczby zmiennoprzecinkowe
- [x] tekst (string)
- [x] wartość logiczną (bool)
- [ ] tablice / listy
- [ ] rekordy / struktury (np. obiekt w JS, associative array w PHP)
*Bez tego w JS, PHP, SQL czy C++ uczeń będzie zgubiony.*

### 2. Operatory logiczne i matematyczne
To jest absolutny fundament. Uczeń musi umieć przewidzieć wynik działania operatorów **bez komputera**:
- [x] `>`, `<`, `>=`, `<=`, `==`, `!=`
- [x] `AND`, `OR`, `NOT`
- [x] `%` (modulo)
- [x] `+`, `-`, `*`, `/`

### 3. Instrukcje warunkowe – pełna architektura
Nie tylko `JEŻELI`, ale:
- [x] zagnieżdżone warunki
- [x] warunki złożone (`x > 5 AND y < 10`)
- [x] warunki wielokrotne (`ELSE IF`)
- [x] pułapki logiczne (kolejność sprawdzania)
*To jest krytyczne przed wejściem w JS, PHP, C++ i C#.*

### 4. Pętle – trzy rodzaje
W pseudokodzie muszą być wszystkie:
- [x] `DOPÓKI` (while)
- [x] `WYKONUJ ... DOPÓKI` (do-while / powtarzaj aż)
- [x] `DLA i OD ... DO ...` (for)

Uczeń musi rozumieć:
- [x] kiedy używać której,
- [x] jak działa licznik,
- [x] jak działa warunek stopu,
- [x] jak działa degradacja stanu.

### 5. Tablice i iteracja po tablicach
To jest absolutnie obowiązkowe przed JS, PHP, SQL, C++ i C#. Uczeń musi umieć:
- [x] stworzyć tablicę,
- [x] odczytać element,
- [x] zmodyfikować element,
- [x] przejść po tablicy pętlą,
- [x] policzyć sumę, minimum, maksimum, średnią.

### 6. Organizacja Kodu (Funkcje)
Fundament strukturalny przed wejściem w jakikolwiek język. Uczeń musi pojąć:
- [ ] definicja i wywoływanie funkcji
- [ ] parametry wejściowe (wstrzykiwanie danych)
- [ ] wartość zwracana (oddawanie wyniku)
- [ ] zasięg zmiennych (Scope Lokalny vs Globalny)
- [ ] stos wywołań (Call Stack)

### 7. Algorytmy, Złożoność i Rekurencja (Wizualnie)
Zamiast pisać złożone projekty w pseudokodzie, pokazujemy prawdziwe mechanizmy algorytmiczne przy użyciu dedykowanych wizualnych widgetów, potajemnie ucząc intuicyjnie Big O.
- [ ] Wyszukiwanie Liniowe vs Binarne
- [ ] Wizualizacja Złożoności Obliczeniowej (O(n) vs O(n^2))
- [ ] Wizualizacja Sortowania (Bubble Sort / Selection Sort)
- [ ] Rekurencja – wywoływanie samego siebie i stos wywołań
