# Nierówności: Safety Guards i Przedziały Bezpieczeństwa

Równanie to kontrakt punktowy (precyzyjny). Nierówność to coś znacznie częstszego w inżynierii: **Definicja Przedziału Stabilności**. 

W systemach operacyjnych rzadko pytasz: „Czy obciążenie CPU wynosi dokładnie 80%?”. Pytasz: „Czy obciążenie jest **w granicach normy** (Safe Zone)?”. 
Nierówności to Twoje **Safety Guards**, które definiują warunki brzegowe systemu:
- `if (memoryUsed < capacity)` $\rightarrow$ Stan bezpieczny.
- `if (packetSize > maxMTU)` $\rightarrow$ Przepełnienie bufora.
- `if (voltage >= threshold)` $\rightarrow$ Aktywacja zabezpieczeń.

W tej lekcji nauczymy się wyznaczać te granice i zarządzać nimi z matematyczną precyzją.

---

## 🧱 Operatory Porównania (Stan Granicy)

Nierówność definiuje nie tylko to, co jest „większe/mniejsze”, ale też status samej granicy. To różnica między „stój przed linią” a „możesz stanąć na linii”.

| Symbol | Nazwa | Status Granicy | Analogia IT |
| :---: | :--- | :--- | :--- |
| **$<$** | Mniejsze niż | **Otwarta** (Wykluczona) | `x < limit` |
| **$>$** | Większe niż | **Otwarta** (Wykluczona) | `x > threshold` |
| **$\le$** | Mniejsze lub równe | **Zamknięta** (Włączona) | `x <= capacity` |
| **$\ge$** | Większe lub równe | **Zamknięta** (Włączona) | `x >= minVersion` |

> [!TIP]
> W notacji przedziałowej używamy nawiasów okrągłych $($ $)$ dla granic otwartych i ostrych $\langle$ $\rangle$ (lub kwadratowych $[$ $]$) dla zamkniętych. Pamiętaj: nieskończoność ($\pm\infty$) jest zawsze otwarta, bo nigdy nie możesz jej „dotknąć”.

---

## ⚠️ Reguła Krytyczna: Odwrócenie Fazy (Sign Flip)

Izolowanie $\textcolor{#ff0001}{x}$ w nierówności liniowej przebiega niemal identycznie jak w równaniu, z jednym wyjątkiem, który decyduje o stabilności całego Twojego wywodu.

> [!CAUTION]
> **Inwersja Fazy (Sign Flip)**: Gdy mnożysz lub dzielisz obie strony przez **liczbę ujemną**, musisz **odwrócić kierunek** operatora.
>
> $$\textcolor{#ff0002}{-2x < 6} \quad \textcolor{#ff0002}{\| \div (-2)}$$
> $$\textcolor{#ff0001}{x > -3}$$
>
> **Intuicja**: Liczby ujemne działają jak lustro. Mnożenie przez ujemne „wzmocnienie” odwraca orientację całego układu na osi liczbowej. Jeśli pominiesz ten krok, Twój *Safety Guard* zadziała dokładnie odwrotnie (np. zablokuje legalnych użytkowników, a wpuści atak).

---

## 🛠️ Punkt Kontrolny: Diagnostyka Znaku

Zanim przejdziesz dalej, sprawdź, czy Twój „kompilator logiczny” wykrywa zmianę orientacji.

<data-gate>
<data-quiz>
  <question>Mamy warunek $-3x \ge 12$. Jaki jest stan końcowy po podzieleniu przez $-3$?</question>
  <options>
    <option>$x \ge -4$</option>
    <option correct>$x \le -4$</option>
    <option>$x \le 4$</option>
  </options>
  <div data-hint="success">Doskonale. Dzielenie przez liczbę ujemną wymusza zmianę orientacji operatora: $\ge$ staje się $\le$.</div>
  <div data-hint="error">Uwaga: Dzielisz przez -3. To ujemne „wzmocnienie”, które odwraca fazę sygnału. Znak musi się obrócić.</div>
</data-quiz>
</data-gate>

---

## 🎢 Nierówności Kwadratowe: Mapa Sygnału

Rozwiązywanie nierówności kwadratowej (np. $\textcolor{#ff0002}{x^2 - 4x + 3 > 0}$) to proces dwuetapowy. Nie wystarczy wyliczyć pierwiastków — musisz znać **mapę przebiegu funkcji**.

### Algorytm „Paraboli”:
1. **Wyznacz Punkty Krytyczne**: Rozwiąż równanie $\textcolor{#ff0002}{ax^2 + bx + c = 0}$ (użyj Delty). To Twoje granice stref.
2. **Określ Kierunek (Współczynnik $a$)**:
   - $\textcolor{#ff0002}{a > 0}$: Ramiona w górę (System stabilny poza pierwiastkami).
   - $\textcolor{#ff0002}{a < 0}$: Ramiona w dół (System stabilny między pierwiastkami).
3. **Odczytaj Przedziały**: Spójrz na wykres i wybierz te części, które spełniają warunek ($>0$ to góra, $<0$ to dół).

### Przykład: $x^2 - 4 \le 0$
- Pierwiastki: $x = 2, x = -2$.
- $a=1$ (dodatnie), więc parabola jest „uśmiechnięta”.
- Szukamy wartości $\le 0$ (pod osią).
- Wynik: $\textcolor{#ff0001}{x \in \langle -2, 2 \rangle}$.

---

## 🪤 Sandbox: Wyznaczanie Strefy Bezpieczeństwa

Rozwiąż nierówność, wyznaczając przedział, w którym system pracuje poprawnie.

<data-gate>
<data-math-sandbox level="equations" data-label="Nierówność: $-2x + 10 > 4$">
  <div 
    data-step="1" 
    data-expected="-2x > -6" 
    data-label="Krok 1: Usuń stałą (odejmij 10 od obu stron) (L=P):"
    data-hints='{"VARIABLE_MISMATCH": "💡 \\(-2x > 4 - 10 \implies -2x > -6\\)."}'>
  </div>
  <div 
    data-step="2" 
    data-expected="x < 3" 
    data-label="Krok 2: Podziel przez -2 (Pamiętaj o odwróceniu znaku!) (L=P):"
    data-hints='{"LOGIC_ERROR": "💡 Krytyczny punkt! Dzielisz przez -2, więc > zmienia się w <. \\(-6 / -2 = 3\\)."}'>
  </div>
  <div 
    data-step="3" 
    data-expected="x \in (-\infty, 3)" 
    data-label="Krok 3: Zapisz wynik w notacji przedziałowej:"
    data-hints='{"SET_MISMATCH": "💡 Wszystkie liczby mniejsze od 3 (bez 3). Zapisz: \\(x \in (-\infty, 3)\\). Użyj przecinka jako separatora."}'>
  </div>
</data-math-sandbox>
</data-gate>

---

## 🔗 Nierówności Złożone: Logika AND / OR

W Module 1 poznałeś operatory logiczne $\land$ (AND) oraz $\lor$ (OR). W nierównościach służą one do budowania złożonych polityk bezpieczeństwa.

### 1. Koniunkcja (AND / $\land$ / $\cap$)
Wymaga, aby system spełniał **wszystkie warunki jednocześnie**. 
- Przykład: $x \ge 0 \land x \le 100$ (Wartość musi być wewnątrz zakresu operacyjnego).
- Geometrycznie: Szukamy **części wspólnej** przedziałów.

### 2. Alternatywa (OR / $\lor$ / $\cup$)
Wystarczy, że spełniony jest **choć jeden** z warunków. Zazwyczaj definiuje to "strefy błędu".
- Przykład: $x < -10 \lor x > 10$ (Wartość jest niebezpieczna, jeśli jest zbyt niska LUB zbyt wysoka).
- Geometrycznie: Wynik to **suma zbiorów**.

---

## 💻 IT Context: Rate Limiting i Firewalle

W nowoczesnych systemach nierówności to podstawa ochrony przed atakami:
- **Rate Limiter**: `if (requestsPerMinute > 1000) { block_ip(); }`
- **Walidacja Bufferów**: `if (inputLength >= MAX_BUFFER) { throw Overrun; }`
- **Cloud Auto-scaling**: `if (cpuUsage > 80%) { add_node(); }`

Nierówność to nie jest tylko matematyka — to Twój **Firewall**, który pilnuje stabilności systemu w świecie niepewnych danych wejściowych.

---

Opanowałeś właśnie mechanizmy wyznaczania granic. Wiesz, jak chronić system i jak zarządzać zakresami. Moduł 3 uzbroił Cię w narzędzia do precyzyjnego modelowania i zabezpieczania systemów.

## 🎉 Milestone: Moduł 3 — Mistrz Równowagi i Granic!

Gratulacje. Przeszedłeś przez fundamenty wyznaczania stanów układu.

### ⚙️ Twój nowy stos technologiczny:
1.  ✅ **Równania Liniowe**: Potrafisz wyizolować przyczynę błędu w systemie liniowym, szanując symetrię kontraktu $L=P$.
2.  ✅ **Układy Równań**: Rozumiesz, jak godzić sprzeczne interesy wielu serwisów i jak diagnozować blokady typu Deadlock.
3.  ✅ **Równania Kwadratowe**: Nie boisz się nieliniowości. Delta to Twój diagnostyk, a wzory Viète'a to suma kontrolna poprawności Twoich obliczeń.
4.  ✅ **Układy Mieszane**: Potrafisz znaleźć punkty styku systemów o różnej charakterystyce.
5.  ✅ **Nierówności**: Projektujesz systemy odporne na błędy, wyznaczając im bezpieczne zakresy pracy i „firewalle” na wejściu.

> [!TIP]
> **Fundamenty ustabilizowane.** Masz już system opisywania obiektów (M0), logikę relacji (M1), rygor dowodzenia (M2) i narzędzia do rozwiązywania stanów (M3). Czas nadać tym strukturom **dynamikę**.

---

Jesteś gotowy na **Moduł 4 — Relacje i Funkcje**. Przechodzimy od wyznaczania konkretnych wartości do opisywania **całych zachowań systemów** — ich wzrostu, malenia, granic i ekstremów. Witaj w świecie funkcji. 🚀📈
