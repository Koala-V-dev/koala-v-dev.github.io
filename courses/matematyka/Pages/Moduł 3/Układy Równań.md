# Układy Równań: Analiza Zależności Współbieżnych

W poprzedniej lekcji debugowałeś pojedynczy kontrakt liniowy. Jednak rzeczywiste systemy to rzadko izolowane procesy — to raczej **sieć zależności**. Najczęściej operujesz na wielu procesach, które muszą współdzielić te same zasoby ($\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y}$) i oba muszą osiągnąć stan równowagi jednocześnie.

Układ równań to nic innego jak **Koniunkcja ($AND$)** dwóch lub więcej kontraktów. Szukamy **Punktu Konsensusu** — stanu wejściowego, w którym wszystkie zdania logiczne układu stają się prawdą ($True$).

$$\begin{cases} \textcolor{#ff0001}{L_1} = \textcolor{#ff0003}{P_1} \\\\ \textcolor{#ff0002}{L_2} = \textcolor{#ff0003}{P_2} \end{cases}$$


---

## 🧠 Intuicja: Punkt Konsensusu (Intersection)

Z perspektywy geometrycznej każde równanie liniowe to prosta. Układ równań to zapytanie o **Punkt Konsensusu** — stan, w którym obie proste się przecinają.

- **Stabilny Konsensus**: Proste się przecinają — mamy jednoznaczny zestaw parametrów, czyli **Parę Uporządkowaną**:  
$$S = \\{(x, y)\\}$$.
- **Deadlock (Układ Sprzeczny)**: Proste są równoległe i nie pokrywające się. Systemy mają niemożliwe do pogodzenia warunki wejściowe: $S = \\emptyset$
- **Redundancja (Układ Tożsamościowy)**: Proste się pokrywają. Jeden z kontraktów jest całkowicie zbędny, bo nie wnosi żadnych nowych ograniczeń do systemu: $S = D$

> [!NOTE]
> _**Konsensus**_ (z łac. _consensus_ – zgoda): Oznacza stan, w którym wszystkie elementy systemu zgadzają się co do wartości poszczególnych parametrów. To stan równowagi i harmonii.
> _**Deadlock**_ (z ang. _dead_ – martwy, _lock_ – blokada): Oznacza stan, w którym system nie jest w stanie kontynuować pracy z powodu sprzecznych wymagań lub braku zasobów. To przestój w ciągłości.
> _**Redundancja**_ (z łac. _redundantia_ – nadmiar): Oznacza sytuację, w której system posiada nadmiarowe dane lub zasoby, które nie są wykorzystywane do prawidłowego funkcjonowania systemu. To strata potencjału.

## 📋 Protokół Zapisu: Para Uporządkowana

W układach równań nie szukamy już pojedynczej wartości, lecz **punktu w przestrzeni**. Dlatego wynik zapisujemy wewnątrz zbioru $S$ jako parę w nawiasach okrągłych.

> [!IMPORTANT]
> **Zasada Kolejności**: Obowiązuje standard alfabetyczny. Nawet jeśli Twoja logika obliczeń najpierw wypluła wartość $y$, w końcowym raporcie zawsze zachowujemy format ($\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y}$). 
> To Twoja suma kontrolna — dzięki temu każdy inny inżynier odczyta Twój wynik bez domysłów, która liczba przypisana jest do której osi.

## 🌐 Skalowanie Systemu: Wymiarowość i Symbole

Może Cię zastanawiać, czy system zawsze kończy się na dwóch zmiennych. Odpowiedź brzmi: **Absolutnie nie**.

1. **Złożoność (n-wymiarów)**: Układy mogą składać się z dowolnej liczby równań i zmiennych. W grafice 3D standardem są układy $3$ i $4$ zmiennych ($\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y}, \textcolor{#ff0003}{z}, \textcolor{#ff0004}{w}$ — gdzie $\textcolor{#ff0004}{w}$ w GameDev często służy do obliczeń rotacji w kwaternionach).

2. **Wymiary poza geometrią**: Możesz się zastanawiać, czy $5$. lub $100$. wymiar ma sens. W inżynierii danych **TAK**. Każdy wymiar to po prostu kolejna cecha (parametr). Punkt w $500$-wymiarowej przestrzeni może opisywać stan Twojego serwera (użycie RAM, CPU, temperatura, liczba zapytań, opóźnienie...). Szukanie rozwiązania układu takich równań to szukanie optymalnego punktu pracy systemu.

3. **Indeksowanie ($x_n$)**: Gdy brakuje alfabetu, inżynierowie przechodzą na indeksy. Zamiast ($\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y}, \textcolor{#ff0003}{z}, \textcolor{#ff0004}{w}, \dots$) piszemy $(x_1, x_2, x_3, \dots, x_n)$. To pozwala nam operować na układach o tysiącach zmiennych za pomocą pętli i macierzy. My skupiamy się na systemach $2 \times 2$, ponieważ stanowią one atomową jednostkę logiczną, którą najłatwiej zwizualizować.

4. **Dowolność Etykiet**: Zmienne $\textcolor{#ff0001}{x}$ i $\textcolor{#ff0002}{y}$ to tylko najczęstsza konwencja. System może operować na dowolnych symbolach, np. $\textcolor{#ff0003}{(a, b, c)}$ lub fizycznych parametrach $\textcolor{#ff0004}{(V, I, R)}$ (napięcie, prąd, opór). 

> [!NOTE]
> Niezależnie od wybranych literek, Twoim zadaniem jest zachowanie **spójnej kolejności w raporcie $S$**. Jeśli system operuje na $(a, y, \alpha)$, Twoja „krotka” wynikowa powinna zawsze trzymać się ustalonego na początku porządku (zazwyczaj alfabetycznego).

> [!NOTE]
> _**Krotka**_ (z łac. _captus_ – ujęty, schwytany): Zbiór wartości powiązanych ze sobą w uporządkowany sposób.




---

## 🛠️ Punkt Kontrolny: Logika Koniunkcji

<data-gate>
<data-quiz>
  <question>Kiedy układ dwóch równań uważa się za „rozwiązany”?</question>
  <options>
    <option>Gdy znajdziemy x i y spełniające dowolne z równań.</option>
    <option correct>Gdy para (x, y) czyni OBA równania prawdziwymi jednocześnie.</option>
    <option>Gdy suma wyników obu równań jest równa zero.</option>
  </options>
  <div data-hint="success">Słusznie. Klamra układu równań to graficzny odpowiednik operatora $\land$ (AND). System jest stabilny tylko w części wspólnej obu zbiorów rozwiązań.</div>
  <div data-hint="error">Pomyśl o tym jak o systemie uprawnień. Aby wejść do serwera, musisz mieć login ORAZ hasło. Poprawny login przy złym haśle to wciąż brak dostępu.</div>
</data-quiz>
</data-gate>

---

## ⚙️ Metoda 1: Podstawianie

To intuicyjna metoda polegająca na wykorzystaniu jednego równania jako „definicji” zmiennej, którą następnie wstawiamy do drugiego równania.

**Algorytm Podstawiania:**
1. **Izolacja**: Wybierz równanie, w którym najłatwiej wyznaczyć $\textcolor{#ff0001}{x}$ lub $\textcolor{#ff0002}{y}$ (szukaj współczynnika $1$ lub $-1$).
2. **Podstawienie**: Wstaw to wyrażenie w miejsce zmiennej w **drugim** równaniu.
3. **Redukcja**: Rozwiąż powstałe równanie z jedną zmienną.
4. **Finalizacja**: Wróć z wynikiem do punktu 1, aby odzyskać drugą zmienną.

#### Przykład:
$$\begin{cases} \textcolor{#ff0002}{y} = \textcolor{#ff0001}{2x} - \textcolor{#ff0004}{1} \\\\ \textcolor{#ff0001}{3x} + \textcolor{#ff0002}{y} = \textcolor{#ff0004}{14} \end{cases}$$

Zauważ, że pierwszy kontrakt już daje nam gotową definicję $\textcolor{#ff0002}{y}$. Wstrzykujemy ją do drugiego:
$$\textcolor{#ff0001}{3x} + \textcolor{#ff0002}{(2x - 1)} = \textcolor{#ff0004}{14} \implies \textcolor{#ff0003}{5x} = \textcolor{#ff0004}{15} \implies \textcolor{#ff0001}{x = 3}$$
Teraz wracamy do bazy: $\textcolor{#ff0002}{y} = \textcolor{#ff0001}{2(3)} - \textcolor{#ff0004}{1} = \textcolor{#ff0002}{5}$.

Punkt konsensusu: $S = \\{(\textcolor{#ff0001}{3}, \textcolor{#ff0002}{5})\\}$.

Zwróć uwagę na zapis $S = \\{(\textcolor{#ff0001}{3}, \textcolor{#ff0002}{5})\\}$. Zawiera on nawias okrągły $(\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y})$, czyli parę uporządkowaną.

---

### 🪤 Sandbox: Podstawianie w praktyce

Rozwiąż konflikt między dwoma serwisami, stosując metodę *iniekcji stanu*.

<data-gate>
<data-math-sandbox level="equations" data-label="Układ równań: $\begin{cases}\textcolor{#ff0002}{y} = \textcolor{#ff0001}{x} + \textcolor{#ff0004}{2}\\ \textcolor{#ff0001}{2x} + \textcolor{#ff0002}{y} = \textcolor{#ff0004}{11}\end{cases}$">
  <div 
    data-step="1" 
    data-expected="2x + (x + 2) = 11" 
    data-label="Wstrzyknij definicję sygnału $\textcolor{#ff0002}{y}$ do drugiego kontraktu ($L=P$):"
    data-hints='{"FORM_MISMATCH": "💡 Podstaw wyrażenie definiujące $\textcolor{#ff0002}{y}$ w odpowiednie miejsce. Pamiętaj o nawiasach dla zachowania integralności struktury.", "STRUCTURE_MISMATCH": "💡 Po iniekcji musisz uzyskać równanie z jedną zmienną ($\textcolor{#ff0001}{x}$). To klucz do izolacji danych."}'>
  </div>
  <div 
    data-step="2" 
    data-expected="x = 3" 
    data-label="Zredukuj układ i wyznacz wartość wejściową $\textcolor{#ff0001}{x}$:"
    data-hints='{"VARIABLE_MISMATCH": "💡 Błąd przy redukcji lub przenoszeniu stałych na drugą stronę kontraktu.", "CALCULATION_ERROR": "💡 Sprawdź sumowanie współczynników przy x oraz końcowe dzielenie sygnału."}'>
  </div>
  <div 
    data-step="3" 
    data-expected="y = 5" 
    data-label="Odzyskaj wartość $\textcolor{#ff0002}{y}$, wykorzystując wyznaczony stan $\textcolor{#ff0001}{x}$:"
    data-hints='{"FORM_MISMATCH": "💡 Podstaw wyliczone $\textcolor{#ff0001}{x}$ do dowolnego z pierwotnych kontraktów, aby otrzymać $\textcolor{#ff0002}{y}$."}'>
  </div>
  <div 
    data-step="4" 
    data-expected="S = \{(3, 5)\}" 
    data-label="Zdefiniuj werdykt końcowy (Punkt konsensusu):"
    data-hints='{"SET_MISMATCH": "💡 Użyj zapisu zbioru punktu w przestrzeni: S = \\{(x, y)\\}."}'>
  </div>
</data-math-sandbox>
</data-gate>

---

## ⚙️ Metoda 2: Redukcja Sygnału

Jeśli oba serwisy mają podobną strukturę, możemy je do siebie dodać lub odjąć, aby „wygasić” (wyeliminować) jedną ze zmiennych. To jak odejmowanie szumu od sygnału w przetwarzaniu dźwięku.

**Warunek**: Współczynniki przy jednej ze zmiennych muszą być przeciwne (np. $\textcolor{#ff0002}{2y}$ i $\textcolor{#ff0002}{-2y}$). Jeśli nie są — musisz **przeskalować** (poddać mutacji) jedno lub oba równania.

### 🧬 Case 1: Mutacja Jednostronna

Mnożymy tylko jedno równanie, aby dopasować je do drugiego.

<div>

$$\begin{cases} \textcolor{#ff0001}{3x} + \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} \\\\ \textcolor{#ff0001}{x} - \textcolor{#ff0002}{y} = \textcolor{#ff0004}{2} \quad \textcolor{#ff0003}{\| \cdot 2} \end{cases} \implies \begin{cases} \textcolor{#ff0001}{3x} + \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} \\\\ \textcolor{#ff0001}{2x} - \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{4} \end{cases}$$

</div>

Z nowego układu równań łączymy oba w jedno:

$$\textcolor{#ff0001}{3x} + \textcolor{#ff0001}{2x} + \textcolor{#ff0002}{2y} - \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} + \textcolor{#ff0004}{4}$$

Redukują nam się wyrazy z $\textcolor{#ff0002}{y}$ i wyliczamy wartość $\textcolor{#ff0001}{x}$:

$$\textcolor{#ff0001}{5x} = \textcolor{#ff0004}{20} \implies \textcolor{#ff0001}{x = 4}$$

Gdy znamy wartość niewiadomej $\textcolor{#ff0001}{x}$, to podstawiamy ją do jednego z pierwotnych równań i wyliczamy wartość dla $\textcolor{#ff0002}{y}$:

> $$\textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} - \textcolor{#ff0001}{3x} \implies \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} - \textcolor{#ff0001}{3(4)} \implies \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{16} - \textcolor{#ff0002}{12} \implies \textcolor{#ff0002}{2y} = \textcolor{#ff0004}{4} \implies \textcolor{#ff0002}{y = 2}$$

... lub

> $$\textcolor{#ff0001}{x} - \textcolor{#ff0004}{2} = \textcolor{#ff0002}{y} \implies \textcolor{#ff0001}{4} - \textcolor{#ff0004}{2} = \textcolor{#ff0002}{y} \implies \textcolor{#ff0002}{y} = \textcolor{#ff0002}{2}$$

Na koniec otrzymujemy: 

$$\textcolor{#ff0002}{y = 2}$$

Wynikiem dla tego układu równań jest para liczb (punkt konsensusu):  
$S = \\{(\textcolor{#ff0001}{4}, \textcolor{#ff0002}{2})\\}$.

### 🪤 Sandbox: Mutacja jednostronna

Zobaczmy jakie możliwości mutacji jednego równania będą najwygodniejsze do liczenia:

**Droga A (Eliminacja $\textcolor{#ff0001}{x}$):** Najmniej upierdliwa, używamy tylko liczb całkowitych.

$$\begin{cases} 2x + 3y = 7 \\\\ x - 2y = 0 \quad \| \cdot (-2) \end{cases} \implies \begin{cases} 2x + 3y = 7 \\\\ -2x + 4y = 0 \end{cases}$$

**Droga B (Eliminacja $\textcolor{#ff0002}{y}$):** Wchodzimy w ułamki dziesiętne, co zwiększa ryzyko błędu.

$$\begin{cases} 2x + 3y = 7 \\\\ x - 2y = 0 \quad \| \cdot (1.5) \end{cases} \implies \begin{cases} 2x + 3y = 7 \\\\ 1.5x - 3y = 0 \end{cases}$$

Wybieramy **Drogę A** jako najbardziej optymalny kontrakt obliczeniowy.


<data-gate>
<data-math-sandbox level="equations" data-label="Układ równań: $\begin{cases} 2x + 3y = 7 \\ x - 2y = 0 \end{cases}$">
  <div 
    data-step="1" 
    data-expected="7y = 7" 
    data-label="Zapisz równanie po zsumowaniu faz (redukcja sygnału $\textcolor{#ff0002}{x}$):"
    data-hints='{
      "CALCULATION_ERROR": "💡 Wskazówka: Po skalowaniu drugiego równania przez -2, zsumuj strony obu kontraktów, aby wyeliminować x.",
      "VARIABLE_MISMATCH": "💡 Sprawdź znaki przy y po wykonaniu mutacji."
    }'>
  </div>
  <div 
    data-step="2" 
    data-expected="y = 1" 
    data-label="Wyznacz czystą wartość sygnału $\textcolor{#ff0001}{y}$:"
    data-hints='{
      "CALCULATION_ERROR": "💡 Wykonaj końcowe dzielenie, aby odizolować y."
    }'>
  </div>
  <div 
    data-step="3" 
    data-expected="x = 2" 
    data-label="Odzyskaj wartość $\textcolor{#ff0002}{x}$ z dowolnego pierwotnego kontraktu:"
    data-hints='{
      "FORM_MISMATCH": "💡 Podstaw wyliczone y do jednego z równań, aby zamknąć pętlę i odzyskać x."
    }'>
  </div>
  <div 
    data-step="4" 
    data-expected="S = \{(2, 1)\}" 
    data-label="Zdefiniuj werdykt końcowy (Punkt konsensusu):"
    data-hints='{
      "SET_MISMATCH": "💡 Pamiętaj o kolejności (x, y) w zbiorze S."
    }'>
  </div>
</data-math-sandbox>
</data-gate>

### 🧬 Case 2: Mutacja Obustronna (NWW)

Kiedy współczynniki są „niewygodne” (np. 2 i 3), mnożymy oba równania, aby osiągnąć **Najmniejszą Wspólną Wielokrotność (NWW)**.

<div>

$$\begin{cases} \textcolor{#ff0002}{3x} + \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{10} \quad \textcolor{#ff0003}{\| \cdot 3} \\\\ \textcolor{#ff0002}{2x} + \textcolor{#ff0001}{3y} = \textcolor{#ff0004}{7} \quad \textcolor{#ff0003}{\| \cdot (-4)} \end{cases} \implies \begin{cases} \textcolor{#ff0002}{9x} + \textcolor{#ff0001}{12y} = \textcolor{#ff0004}{30} \\\\ \textcolor{#ff0002}{-8x} - \textcolor{#ff0001}{12y} = \textcolor{#ff0004}{-28} \end{cases}$$

</div>

Z nowego układu równań łączymy oba w jedno:

$$\textcolor{#ff0002}{9x} + \textcolor{#ff0002}{-8x} + \textcolor{#ff0001}{12y} - \textcolor{#ff0001}{12y} = \textcolor{#ff0004}{30} + \textcolor{#ff0004}{-28}$$

Redukują nam się wyrazy z $\textcolor{#ff0001}{y}$ i wyliczamy wartość $\textcolor{#ff0002}{x}$:  

$$\textcolor{#ff0002}{1x} = \textcolor{#ff0004}{2} \implies \textcolor{#ff0002}{x = 2}$$

Gdy znamy wartość niewiadomej $\textcolor{#ff0002}{x}$, to podstawiamy ją do jednego z pierwotnych równań i wyliczamy wartość dla $\textcolor{#ff0001}{y}$: 

$$\textcolor{#ff0002}{3x} + \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{10} \implies \textcolor{#ff0002}{3(2)} + \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{10} \implies \textcolor{#ff0002}{6} + \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{10} \implies \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{10} - \textcolor{#ff0002}{6} \implies \textcolor{#ff0001}{4y} = \textcolor{#ff0004}{4}$$

Na koniec otrzymujemy: 

$$\textcolor{#ff0001}{y = 1}$$

Punkt konsensusu dla tego systemu: $S = \\{(2, 1)\\}$.

### 🪤 Sandbox: Mutacja dwustronna (NWW)

Gdy przy zmiennych stoją liczby utrudniające prostą eliminację, znowu używamy $NWW$ (Moduł $0$) 😅. Zobaczmy, która droga mutacji wymaga najmniejszego nakładu sił:

**Droga A (Eliminacja $\textcolor{#ff0002}{x}$):** Szukamy $NWW(2, 3)$, czyli $6$. 

$$\begin{cases} 2x + 5y = 11 \quad \| \cdot (3) \\\\ 3x + 2y = 11 \quad \| \cdot (-2) \end{cases} \implies \begin{cases} 6x + 15y = 33 \\\\ -6x - 4y = -22 \end{cases}$$

**Droga B (Eliminacja $\textcolor{#ff0001}{y}$):** Szukamy $NWW(5, 2)$, czyli $10$.

$$\begin{cases} 2x + 5y = 11 \quad \| \cdot (2) \\\\ 3x + 2y = 11 \quad \| \cdot (-5) \end{cases} \implies \begin{cases} 4x + 10y = 22 \\\\ -15x - 10y = -55 \end{cases}$$

Wybieramy **Drogę A**, ponieważ zauważyłem że w **B** po zredukowaniu stronami pojawiają się ujemne wartości, co wymagałoby dodatkowego kroku przemnożenia przez $(-1)$.

<data-gate>
<data-math-sandbox level="equations" data-label="Układ równań: $\begin{cases} 2x + 5y = 11 \\ 3x + 2y = 11 \end{cases}$">
  <div 
    data-step="1" 
    data-expected="11y = 11" 
    data-label="Zredukuj sygnał $\textcolor{#ff0001}{x}$ poprzez skalowanie obu kontraktów (NWW):"
    data-hints='{
      "ASYMMETRY_ERROR": "💡 Pamiętaj, aby pomnożyć KAŻDY składnik obu równań przez odpowiednie współczynniki NWW.",
      "STRUCTURE_MISMATCH": "💡 Skalowanie: I * 3 oraz II * (-2). Po zsumowaniu x musi zostać wyeliminowane."
    }'>
  </div>
  <div 
    data-step="2" 
    data-expected="y = 1" 
    data-label="Wyznacz czystą wartość sygnału $\textcolor{#ff0002}{y}$:"
    data-hints='{
      "CALCULATION_ERROR": "💡 Sprawdź wynik dzielenia po zredukowaniu układu."
    }'>
  </div>
  <div 
    data-step="3" 
    data-expected="x = 3" 
    data-label="Odzyskaj wartość $\textcolor{#ff0001}{x}$, wykorzystując wyznaczony stan $\textcolor{#ff0002}{y}$:"
    data-hints='{
      "FORM_MISMATCH": "💡 Podstaw y=1 do pierwotnej postaci kontraktu, aby wyliczyć x.",
      "CALCULATION_ERROR": "💡 Sprawdź izolację: 2x + 5 = 11."
    }'>
  </div>
  <div 
    data-step="4" 
    data-expected="S = \{(3, 1)\}" 
    data-label="Zdefiniuj werdykt końcowy (Punkt konsensusu):"
    data-hints='{
      "SET_MISMATCH": "💡 S = \\{(x, y)\\} — zachowaj standardową kolejność krotki."
    }'>
  </div>
</data-math-sandbox>
</data-gate>

## 🔬 Stany Brzegowe: Diagnoza Logiczna Układu

Podobnie jak w równaniach z jedną zmienną, układy mogą wpadać w stany anomalne. Musisz umieć rozpoznać, czy system jest stabilny, czy znajduje się w stanie „zawieszenia” (**_deadlock_**).

### 🛑 Case 1: Sprzeczność (Deadlock)
Podczas redukcji obie zmienne $\textcolor{#ff0001}{x}$ i $\textcolor{#ff0002}{y}$ znikają, a zostaje kłamstwo logiczne (np. $0 = 7$).

- **Diagnoza**: Proste są równoległe i nie mają punktów wspólnych.
- **Wniosek formalny**: Brak takiej pary $(\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y})$, która spełniałaby oba warunki naraz.
- **Status**: $S = \emptyset$

||||
|:--:|:---:|:---:|
|$\begin{cases} x + y = 5 \\\\ x + y = 2 \end{cases}$|$\begin{cases} 2x - y = 4 \\\\ 4x - 2y = 10 \end{cases}$|$\begin{cases} y = x + 1 \\\\ y = x - 3 \end{cases}$|

> [!IMPORTANT]
> Może się zdarzyć że w wyniku mutacji jednostronnej lub w pierwotnym stanie układ równań ma identyczny zapis lewych stron i na prawych mamy dwie różne wartości. Wtedy również jest to sprzeczność.

### 🌐 Case 2: Tożsamość (Redundancja)
Zmienne znikają, ale zostaje prawda logiczna (np. $0 = 0$).

- **Diagnoza**: Oba równania opisują tę samą linię. System ma nieskończenie wiele rozwiązań.
- **Wniosek formalny**: Każda para $(\textcolor{#ff0001}{x}, \textcolor{#ff0002}{y})$ należąca do prostej spełnia układ.
- **Status**: $S = D$

||||
|:--:|:---:|:---:|
|$\begin{cases} x + y = 2 \\\\ 2x + 2y = 4 \end{cases}$|$\begin{cases} y = 2x - 1 \\\\ 4x - 2y = 2 \end{cases}$|$\begin{cases} 3x - y = 5 \\\\ 6x - 2y = 10 \end{cases}$|

> [!IMPORTANT]
> Podobnie jak w przypadku sprzeczności, może się zdarzyć że w wyniku mutacji jednostronnej lub w pierwotnym stanie układ równań ma identyczny zapis lewych stron i na prawych mamy te same wartości. Wtedy również jest to tożsamość.

---

## 🔗 Połącz Pary: Wybór Strategii Rozwiązania

Dobry inżynier nie wybiera metody losowo.  
Wybiera tę, która generuje najmniej upierdliwych obliczeń i minimalizuje ryzyko błędu. 😎

<data-gate>
<data-connection-matcher title="Analiza Struktury: Dobierz najbardziej optymalną strategię">
    <item left="$\begin{cases} y = 0.5x + 7 \\ 2x - 4y = 1 \end{cases}$" right="Iniekcja Stanu (wykorzystanie gotowej definicji sygnału $y$)"></item>
    <item left="$\begin{cases} 5x - 3y = 11 \\ 2x + 3y = 3 \end{cases}$" right="Redukcja Bezpośrednia (wykorzystanie przeciwnych faz sygnału $y$)"></item>
    <item left="$\begin{cases} 4x + 3y = 10 \\ 3x + 2y = 7 \end{cases}$" right="Mutacja NWW (pełne skalowanie obu linii dla eliminacji $x$)"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Punkt Konsensusu** to stan wejściowy $(x, y)$ spełniający wszystkie kontrakty układu jednocześnie,
- **Iniekcja Stanu (Podstawianie)** to metoda najskuteczniejsza, gdy jedna zmienna jest już odizolowana,
- **Redukcja Fazy (Przeciwne Współczynniki)** pozwala wyeliminować szum poprzez skalowanie NWW,
- **Deadlock i Redundancja** to anomalie logiczne układów sprzecznych i tożsamościowych,
- **Zasada Krotki** wymaga raportowania wyników w uporządkowanej parze $(x, y)$.

---

W następnym kroku wejdziemy w świat **Równań Kwadratowych**, gdzie nauczymy się diagnozować nieliniowe stany stabilności. Gotowy na skok w drugi stopień? 🚀📈
