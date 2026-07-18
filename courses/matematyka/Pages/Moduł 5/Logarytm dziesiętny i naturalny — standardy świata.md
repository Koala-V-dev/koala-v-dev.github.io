# Logarytm dziesiętny i naturalny — standardy świata

Choć logarytm może mieć dowolną podstawę (dodatnią i różną od 1), dwa konkretne rodzaje logarytmów zdominowały naukę i inżynierię. Mają one swoje specjalne nazwy i uproszczone zapisy.

---

## 🔟 Logarytm Dziesiętny ($\log_{10}$)

Jeśli w książce lub na kalkulatorze widzisz napis $\log x$ bez żadnej liczby na dole, oznacza to niemal zawsze **logarytm o podstawie 10**.

$$\log{x} = \log_{10}{x}$$

### Dlaczego 10?
Bo nasz system liczbowy jest dziesiętny! Logarytm dziesiętny mówi nam wprost, **ile cyfr** (w przybliżeniu) ma dana liczba.
- $\log{10} = 1$
- $\log{100} = 2$
- $\log{1000} = 3$

> [!TIP]
> **Skala Decybelowa (dB):** To, jak słyszysz dźwięk, jest logarytmiczne! Zwiększenie głośności o 10 dB oznacza, że fala dźwiękowa ma 10 razy większą energię. Zwiększenie o 20 dB to moc 100 razy większa ($10^2$).

---

## 🌿 Logarytm Naturalny ($\ln$) i liczba $e$

To jest "król logarytmów". Jego podstawą jest tajemnicza liczba $e \approx 2,718$. Zapisujemy go jako $\ln x$ (od łac. *logarithmus naturalis*).

$$\ln{x} = \log_{e}{x}$$

### Liczba $e$ — skąd się wzięła?
Wyobraź sobie, że masz 1 zł na koncie, które oferuje 100% zysku rocznie. 
- Jeśli odsetki dopiszą raz na rok, masz 2 zł.
- Jeśli dopiszą co miesiąc, masz więcej.
- Jeśli odsetki dopisywałyby się **w każdej ułamku sekundy, bez przerwy**, to po roku miałbyś dokładnie... **$e$ złotych**.

Liczba $e$ to tempo **wzrostu ciągłego**. Jest fundamentem biologii, fizyki i zaawansowanej analizy danych.

---

## 🛠️ Stacja Kontrolna: Wielkie Porządki

Sprawdźmy, czy potrafisz odróżnić te standardy.

<data-gate>
<data-quiz>
  <question>Ile wynosi $\log{0.1}$?</question>
  <options>
    <option>0.1 (bo to dziesiętny)</option>
    <option correct>-1 (bo $10^{-1} = \frac{1}{10} = 0.1$)</option>
    <option>1 (bo jedna dziesiąta)</option>
  </options>
  <div data-hint="error">Pamiętaj: $\log$ to $\log_{10}$. Szukamy potęgi liczby 10, która da 0.1.</div>
  <div data-hint="success">Świetnie! Logarytmy dziesiętne z ułamków są ujemne. To podstawa skali pH w chemii!</div>
</data-quiz>
</data-gate>

---

## ⚠️ Pułapka Informatyczna!
W świecie **Computer Science**, gdy programista pisze $\log n$ (np. w opisie wydajności algorytmu), zazwyczaj ma na myśli **$\log_{2} n$**, a nie dziesiętny!

Dla informatyka najważniejszy jest bit (0 lub 1), więc podział na dwa jest standardem. Zawsze sprawdzaj kontekst:
- **Matematyka/Inżynieria:** $\log = \log_{10}$
- **Informatyka:** $\log = \log_{2}$
- **Analiza/Nauka:** $\ln = \log_{e}$

---

## 🏆 Egzamin końcowy Modułu 5

Czy czujesz się gotowy, aby zapanować nad wzrostem wykładniczym?

<data-gate>
<data-math-worksheet difficulty="medium">
    <item question="\log_{10}{0.01}" answer="-2" hint="10 do której potęgi to 0.01?" />
    <item question="\ln{1}" answer="0" hint="Każdy logarytm z 1 wynosi...?" />
    <item question="\log_{2}{32}" answer="5" hint="Ile razy musisz podwoić 1, aby mieć 32?" />
    <item question="\log_{3}{\frac{1}{9}}" answer="-2" hint="Odwrócenie i potęga 3^2." />
</data-math-worksheet>
</data-gate>
