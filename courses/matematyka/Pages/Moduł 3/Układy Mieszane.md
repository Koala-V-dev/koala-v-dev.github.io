# Układy Mieszane: Intersekcja Linii i Krzywej

Pamiętać o dziedzinie dla równań, bo w układach równań padło S=D ale nigdy nie mówiono o dziedzinie tak jak to było w równaniu liniowym i równaniu kwadratowym

W poprzednich lekcjach rozwiązywałeś konflikty między dwoma liniowymi kontraktami ($2 \times$ stopień 1) lub diagnozowałeś nieliniowy stan pojedynczego równania ($1 \times$ stopień 2).

W rzeczywistych systemach często dochodzi do **interakcji mieszanej**: liniowy sygnał sterujący musi „dogadać się” z nieliniowym procesem fizycznym. To świat **Układów Mieszanych**.

$$\begin{cases} y = ax + b \\ y = ax^2 + bx + c \end{cases}$$

---

## 🧠 Intuicja: Kolizja i Intersekcja

Z perspektywy geometrycznej układ mieszany to zapytanie o punkty styku **Linii** i **Paraboli**.

W **Game Development** (np. w systemach fizyki) to absolutna podstawa. Wyobraź sobie promień lasera (linia) i tarczę energetyczną w kształcie sfery (którą w przekroju opisuje równanie kwadratowe). Rozwiązanie układu powie Ci:
1.  **Chybiłeś** ($\Delta < 0$): Brak punktów wspólnych.
2.  **Otarłeś się** ($\Delta = 0$): Linia jest styczna do paraboli (jeden punkt styku).
3.  **Trafiłeś** ($\Delta > 0$): Linia przebija parabolę (dwa punkty: wejścia i wyjścia).

---

## ⚙️ Strategia: Iniekcja Stanu (Podstawianie)

Najskuteczniejszą metodą rozwiązywania układów mieszanych jest **Podstawianie**. Ponieważ oba równania zazwyczaj definiują tę samą zmienną wyjściową ($y$), możemy je do siebie porównać.

### Algorytm Rozwiązywania:
1.  **Porównanie**: Przyrównaj prawe strony obu równań ($ax + b = ax^2 + bx + c$).
2.  **Redukcja**: Przenieś wszystko na jedną stronę, aby uzyskać klasyczne równanie kwadratowe równe zero.
3.  **Diagnoza ($\Delta$)**: Oblicz deltę, aby sprawdzić liczbę punktów styku.
4.  **Finalizacja**: Wyznacz $x_{1,2}$ i wróć do równania liniowego, aby odzyskać odpowiadające im wartości $y_{1,2}$.

#### Przykład:
$$\begin{cases} y = x + 1 \\ y = x^2 - 1 \end{cases}$$

Porównujemy:
$$x^2 - 1 = x + 1 \implies x^2 - x - 2 = 0$$
$$\Delta = 1 - 4(1)(-2) = 9 \implies \sqrt{\Delta} = 3$$
$$x_1 = \frac{1+3}{2} = 2 \implies y_1 = 2+1 = 3$$
$$x_2 = \frac{1-3}{2} = -1 \implies y_2 = -1+1 = 0$$

Punkty konsensusu: $S = \{(2, 3), (-1, 0)\}$.

---

## 🪤 Sandbox: Detekcja Kolizji

Rozwiąż układ, aby wyznaczyć punkty, w których linia przecina nieliniowy obszar.

<data-gate>
<data-math-sandbox level="equations" data-label="Układ mieszany: $\begin{cases} y = 2x + 1 \\ y = x^2 + 1 \end{cases}$">
  <div 
    data-step="1" 
    data-expected="x^2 - 2x = 0" 
    data-label="Krok 1: Przyrównaj równania i przenieś wszystko na lewą stronę ($ax^2 + bx + c = 0$):"
    data-hints='{"FORM_MISMATCH": "💡 x² + 1 = 2x + 1 \implies x² - 2x = 0."}'>
  </div>
  <div 
    data-step="2" 
    data-expected="x_1 = 0, x_2 = 2" 
    data-label="Krok 2: Wyznacz wartości $x$ (podpowiedź: wyciągnij x przed nawias):"
    data-hints='{"VARIABLE_MISMATCH": "💡 x(x - 2) = 0, czyli x = 0 lub x = 2."}'>
  </div>
  <div 
    data-step="3" 
    data-expected="S = \{(0, 1), (2, 5)\}" 
    data-label="Krok 3: Wyznacz wartości $y$ i podaj zbiór punktów $S = \{(x_1, y_1), (x_2, y_2)\}$:"
    data-hints='{"SET_MISMATCH": "💡 Podstaw x do y = 2x + 1. Dla x=0, y=1. Dla x=2, y=5."}'>
  </div>
</data-math-sandbox>
</data-gate>

---

Opanowałeś łączenie różnych światów matematycznych. To najwyższy stopień wtajemniczenia w analizie punktowej. W następnej, ostatniej lekcji tego modułu, zajmiemy się **Nierównościami**, gdzie zamiast szukać punktów, będziemy wyznaczać **Bezpieczne Zakresy** dla całych systemów. 🚀🛡️
