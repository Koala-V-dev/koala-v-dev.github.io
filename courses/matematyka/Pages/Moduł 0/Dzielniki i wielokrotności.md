# Dzielniki i wielokrotności: Algorytmy Synchronizacji

Często w inżynierii szukamy „wspólnego mianownika”... lub momentu, w którym dwa niezależne procesy w końcu się spotkają. To właśnie tutaj wchodzą nasze kluczowe narzędzia: **NWD** (Największy Wspólny Dzielnik) oraz **NWW** (Najmniejsza Wspólna Wielokrotność). 🦾🐨

---

## 🏗️ NWD: Największy Wspólny Dzielnik (Aspect Ratio)

Masz przed sobą ekran o rozdzielczości $1920 \times 1080$ pikseli. Intuicyjnie czujesz, że to proporcja **$16:9$**, ale skąd właściwie bierze się ta liczba? 

Aby poznać najprostszy stosunek boków (*Aspect Ratio*), musimy znaleźć największą możliwą liczbę, przez którą dzielą się obie te wartości — czyli właśnie **NWD**. Jest to „największa wspólna miara”, która pozwala uprościć wymiary do ich bazowej, eleganckiej postaci.

### 🔍 Metoda 1: Wypisywanie Dzielników (Intuicja)

Zanim użyjemy ciężkiego sprzętu (algorytmów), sprawdźmy prostszy przykład: **rozdzielczość $800 \times 600$**. Jakie to proporcje?

1.  Dzielniki **$800$**: $\{1, 2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 100, 160, \mathbf{200}, 400, 800\}$
2.  Dzielniki **$600$**: $\{1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 25, 30, 40, 50, 60, 75, 100, 120, 150, \mathbf{200}, 300, 600\}$
3.  **Część wspólna**: największą liczbą w obu zbiorach jest **$200$**.

Wynik: $\text{NWD}(800, 600) = 200$. Oznacza to, że proporcje systemu to **$4:3$** (bo $800 \div 200 = 4$ oraz $600 \div 200 = 3$).

To podejście świetnie buduje intuicję, ale dla dużych liczb (jak rozdzielczości 4K czy klucze szyfrujące) staje się uciążliwe. Potrzebujemy czegoś szybszego.

### ⚙️ Metoda 2: Algorytm Euklidesa (Proces Redukcji)

Ręczne wypisywanie dzielników dla ekranu *Full HD* ($1920$) byłoby stratą czasu. Euklides wymyślił genialny skrót logiczny:

> Jeśli liczba $k$ dzieli wartości $a$ i $b$, to musi ona również dzielić ich **różnicę** ($a - b$).

Poprzez cykliczne odejmowanie mniejszej wartości od większej, redukujemy problem aż do momentu, w którym obie liczby się zrównają. Ten stan końcowy to nasze NWD.

### ⚡ Algorytm Euklidesa (Odejmowanie)

<data-gate>
<data-euclid-algorithm a="1920" b="1080"></data-euclid-algorithm>
</data-gate>

---

### ⚙️ Metoda 3: Zastosowanie Modulo

W nowoczesnych systemach obliczeniowych proces odejmowania zastępujemy operacją **dzielenia z resztą (Modulo)**. Zamiast wielokrotnie odejmować tę samą wartość, sprawdzamy „co zostanie” po jednym dużym dzieleniu.
Przykładowo $17 \pmod{5} =\textcolor{#ff0002}{2}$, bo $17 = 5 \cdot 3 + \textcolor{#ff0002}{2}$.

> [!IMPORTANT]
> **Operator `%` (Modulo):** To fundament programowania. Zapis `10 % 3` mówi nam, że po pełnym podziale $10$ na części po $3$, pozostaje **$1$** reszty.

Zastosowanie Modulo drastycznie przyspiesza Algorytm Euklidesa, co jest krytyczne np. w kryptografii asymetrycznej (RSA).

### ⚡ Zoptymalizowany Euklides Modulo

<data-gate>
<data-euclid-modern a="100" b="30"></data-euclid-modern>
</data-gate>

---

## 🔃 NWW: Synchronizacja Procesów

**Najmniejsza Wspólna Wielokrotność (NWW)** określa najwcześniejszy punkt, w którym dwa niezależne procesy o charakterystyce okresowej wejdą w stan synchronizacji.

Wyobraź sobie dwa logery systemowe:
*   **Loger A**: wykonuje wpis co **$4$ sekundy**.
*   **Loger B**: wykonuje wpis co **$6$ sekund**.

Kiedy po raz pierwszy oba logi pojawią się w tej samej milisekundzie?

### 🔍 Metoda 1: Analiza Interwałów

Wypiszmy sekundy, w których działają procesy:
*   **Proces A** ($4s$): $4, 8, \mathbf{12}, 16, 20, \mathbf{24} \dots$
*   **Proces B** ($6s$): $6, \mathbf{12}, 18, \mathbf{24} \dots$

Pierwszą wspólną wartością jest **$12$**. Zatem $\text{NWW}(4, 6) = 12$.

### ⚙️ Metoda 2: Wielokrotność Większej

To najszybszy sposób na obliczenie NWW w pamięci. Bierzemy **większą** liczbę i sprawdzamy jej kolejne wielokrotności:

1.  Większa to **$6$**. Czy dzieli się przez $4$? Nie.
2.  Kolejna wielokrotność to **$12$** ($6 \cdot 2$). Czy dzieli się przez $4$? **Tak!**

> [!TIP]
> NWW wykorzystasz, gdy będziesz chciał dodać ułamki (np. $$\frac{1}{4} + \frac{1}{6}$$). To właśnie liczba **$12$** stanie się ich wspólnym mianownikiem. 😉

---

## 🔬 Złoty Wzór: Relacja NWD i NWW

Istnieje elegancka matematyczna „nić”, która łączy obie te wartości:

$$\text{NWW}(a, b) = \frac{a \cdot b}{\text{NWD}(a, b)}$$

Skąd się bierze ten wzór? 🤔 Aby go **wyprowadzić od podstaw**, potrzebujemy narzędzi algebraicznych, których jeszcze nie wprowadziliśmy. Gdy tylko opanujemy przekształcanie wyrażeń, wrócimy tutaj i pokażę Ci jego pełną genezę. 

Na razie potraktuj go jako niezawodny skrót. Spójrzmy na przykład: Synchronizacja interwałów **$15$ms** i **$20$ms**.

1.  Wyznaczamy $\text{NWD}(15, 20) = 5$.
2.  Obliczamy $$ \text{NWW} = \frac{15 \cdot 20}{5} = \frac{300}{5} = 300 \div 5 = \mathbf{60} $$.

Synchronizacja stanów nastąpi co **$60$ms**.

---

## 🚀 Stacja Treningowa: Analiza Podzielności

<data-gate>
<data-math-worksheet type="nwd-nww" count="1" difficulty="easy" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
<data-math-worksheet type="nwd-nww" count="2" difficulty="medium" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
<data-math-worksheet type="nwd-nww" count="3" difficulty="hard" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

## 💻 Implementacja: NWD/NWW w architekturze IT

1.  **Systemy Grid i Flexbox:** NWD pozwala na wyznaczanie bazowych jednostek (rem/px), które gwarantują brak błędów zaokrągleń przy skalowaniu layoutu.
2.  **Kryptografia RSA:** Bezpieczeństwo Twoich haseł opiera się na analizie podzielności ogromnych liczb pierwszych.
3.  **Scheduling i Watchdogi:** NWW jest niezbędne do projektowania harmonogramów zadań (Cron), aby unikać jednoczesnego przeciążenia procesora przez wiele procesów o określonym interwale.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- NWD to największa wspólna miara dwóch liczb — fundament upraszczania proporcji,  
- NWW to najwcześniejszy punkt synchronizacji dwóch procesów okresowych,  
- wypisywanie dzielników buduje intuicję, ale jest nieefektywne dla dużych liczb,  
- Algorytm Euklidesa redukuje problem do prostych kroków (odejmowanie lub modulo),  
- operator `%` (Modulo) to kluczowy mechanizm w programowaniu i kryptografii,  
- NWW i NWD są ze sobą powiązane eleganckim wzorem: $$\text{NWW} = \frac{a \cdot b}{\text{NWD}}$$,  
- podzielność to narzędzie inżynierskie — od layoutów CSS po RSA i scheduling.

---

Teraz, gdy panujesz nad podzielnością, operacje na ułamkach w kolejnej lekcji będą dla Ciebie formalnością. 😉