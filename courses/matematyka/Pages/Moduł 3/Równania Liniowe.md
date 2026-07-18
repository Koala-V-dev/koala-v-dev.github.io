# Równania Liniowe: Analiza Stanów i Kontraktów

W Module $2$ operowałeś na **Wyrażeniach Algebraicznych** — statycznych szablonach (*Templates*), które optymalizowałeś pod kątem redukcji długu technicznego. Wtedy liczyła się **Struktura**.

Teraz przechodzimy do **Równań**. To moment, w którym Twoje szablony stają się częścią aktywnego układu. Równanie to **Kontrakt** między dwiema stronami ($L=P$), w którym szukamy konkretnego sygnału wejściowego (wartości $x$), przy którym system osiąga stan równowagi.

Jeśli w Module $1$ (Logika) operator `==` służył do porównywania gotowych stanów, to w Module $3$ równanie jest zapytaniem do systemu: *„Dla jakiego wejścia wynik porównania zwróci $1$ (**True**)?”*.

---

## 🧬 Wzór ogólny równania

Równanie liniowe ma następującą postać:

<figure role="math">

$$\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$$

<figcaption>Wzór ogólny równania liniowego</figcaption>
</figure>

Gdzie każda składowa pełni określoną rolę w systemie:

- Baza:
  - $\textcolor{#ff0001}{a}$ (**Wzmocnienie sygnału** / *Współczynnik*): Mnożnik lub dzielnik definiujący skalę transformacji zmiennej $\textcolor{#ff0004}{x}$.
  - $\textcolor{#ff0004}{x}$ (**Interface / Input** / *Zmienna*): Kontener na wartość wejściową, której poszukujemy.  
- Transformacja:
  - $\textcolor{#ff0002}{b}$ (**Bias / Offset** / *Wyraz wolny*): Stałe przesunięcie wyniku bazowego o określoną wartość.  
- Cel:
  - $\textcolor{#ff0003}{c}$ (**Target State** / *Wynik*): Docelowy stan systemu po transformacji.

Gdy zwiększysz potęgę $\textcolor{#ff0004}{x}$ o $1$, to równanie staje się kwadratowe, a gdy zwiększysz ją o $n$, to równanie będzie jeszcze wyższego stopnia.  
> Pamiętaj: stopień równania określa **maksymalną liczbę rozwiązań** w zbiorze liczb rzeczywistych.

$$\textcolor{#ff0001}{a}\textcolor{#ff0004}{x^n} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$$

> [!TIP]
> Równania też mogą mieć swoją skróconą postać gdy iloczyn czynnika $\textcolor{#ff0001}{a}$ jest równy $1$ to nie musisz tej jedynki zapisywać. Adekwatnie z $-1$, wtedy wystarczy dopisać znak minus przed zmienną $\textcolor{#ff0004}{x}$. Podobnie można zredukować wyraz wolny $\textcolor{#ff0002}{b}$ o przesunięcie przez $0$ dla dodawania i odejmowania, ponieważ żadna z tych operacji nie zmieni wyniku.

#### Przykłady zredukowanych równań liniowych:

- $\textcolor{#ff0001}{x} + \textcolor{#ff0002}{3} = \textcolor{#ff0003}{12} \implies x=9$
- $\textcolor{#ff0001}{-x} + \textcolor{#ff0002}{7} = \textcolor{#ff0003}{5} \implies -x = -2 \implies x=2$
- $\textcolor{#ff0001}{5x} = \textcolor{#ff0003}{15} \implies x=3$
- $\textcolor{#ff0001}{x} + \textcolor{#ff0003}{(-10)} = \textcolor{#ff0003}{5} \implies x=15$

## 🛡️ Firewall (Dziedzina) vs. Werdykt (Zbiór Rozwiązań)

W analizie kontraktów (równań) musisz odróżnić **zasady bezpieczeństwa** od **końcowego wyniku**. To dwa różne poziomy walidacji:

#### 1. Firewall: Dziedzina ($D$)
To Twoja walidacja wejścia (*Input Validation*). Określa, jaki zbiór wartości w ogóle wolno nam włożyć do systemu, aby nie spowodować awarii (np. dzielenia przez zero). 
- Zazwyczaj $D = \mathbb{R}$ (akceptujemy wszystkie liczby rzeczywiste).
- Jeśli istnieją wartości krytyczne np.: zmienna w mianowniku lub pod pierwiastkiem, nakładamy filtr:  
$D = \mathbb{R} \setminus \\{ \text{punkty awarii} \\}$.

#### 2. Werdykt: Zbiór Rozwiązań ($S$)
To wynik Twojego śledztwa. Zbiór konkretnych wartości, które spełniają kontrakt ($L=P$). Architektura równania narzuca nam **maksymalną liczebność** tego zbioru:

- Dla $\textcolor{#ff0002}{x^1}$ (liniowe): Zbiór $S$ ma maksymalnie **1** element.
  > $$\textcolor{#ff0001}{ax} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c} \implies x = \frac{\textcolor{#ff0003}{c}-\textcolor{#ff0002}{b}}{\textcolor{#ff0001}{a}}$$
- Dla $\textcolor{#ff0003}{x^2}$ (kwadratowe): Zbiór $S$ ma maksymalnie **2** elementy.
  > $$\textcolor{#ff0001}{ax^2} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c} \implies x = \pm\sqrt{\frac{\textcolor{#ff0003}{c}-\textcolor{#ff0002}{b}}{\textcolor{#ff0001}{a}}}\quad\quad$$ Symbol: `$\pm$` to skrót od plus lub minus.
- Dla $\textcolor{#ff0004}{x^n}$ (n-tego stopnia): Zbiór $S$ ma maksymalnie **$n$** elementów.
  > $$\textcolor{#ff0001}{ax^n} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c} \implies x = \sqrt[n]{\frac{\textcolor{#ff0003}{c}-\textcolor{#ff0002}{b}}{\textcolor{#ff0001}{a}}}$$

*Rozwiązanie Jednoelementowe ($S = \\{x_0\\}$)*  
  Standardowy, poprawny przypadek: system ma dokładnie jedną wartość wejściową, która prowadzi do oczekiwanego stanu wyjściowego.  
  **Single Source of Truth** — jedno wejście, jeden poprawny stan.
  > $$ 2x + 3 = 11 $$  
  > $$ x = 4 $$  
  > Jeśli $(4 \in D)$, to $(S = \\{4\\})$.

### Stany Wyjątkowe (Edge Cases):

Podczas analizy równań możesz trafić na specyficzne zachowania systemu. Każde z nich odpowiada innemu typowi błędu lub zachowania kontraktu.

---

### <em>Sprzeczność ($S = \emptyset$)</em>

  Kontrakt jest niemożliwy do spełnienia — lewa strona i prawa strona opisują dwa różne, niezgodne stany.  
  Logiczny **_deadlock_**: system nie ma prawa działać poprawnie dla żadnego wejścia.
  > $$ 2x - 1 = 2x - 4 $$  
  > $$ -1 = -4 \quad \text{(fałsz)} $$

---

### <strong>Tożsamość ($S = D$)</strong>

  Kontrakt jest spełniony dla każdego dopuszczalnego wejścia.  
  Pełna *redundancja* — test jednostkowy, który zawsze zwraca `true`.
  > $$ 3x + 6 = 3(x + 2) $$

---

### <strong><em>Błąd Walidacji (Domain Firewall Reject)</em></strong>  

  Obliczenia wskazują wartość, która **_nie przechodzi walidacji dziedzin_y**.  
  Firewall odrzuca wynik jeszcze przed wejściem do systemu.  
  Jeśli jedyne rozwiązanie wypada poza $D$, to *równanie liniowe nie ma rozwiązań*.
  > Dziedzina:  $(D = \mathbb{R} \setminus \\{2,4\\})$  
  > Równanie:  
  > $$ \frac{3x - 1}{(x - 2)(x - 4)} = 5 $$  
  > Jeśli z obliczeń wyjdzie $(x = 4)$, to zostaje odrzucone → $(S = \emptyset)$.


---

### <em><strong>Rozwiązanie Pozorne (Phantom Solution)</strong></em>

  Występuje, gdy algebraicznie otrzymujesz wartość, która *wydaje się* rozwiązaniem, ale po podstawieniu do równania okazuje się fałszywa.  
  Typowy efekt uboczny nielegalnych operacji (np. mnożenia przez wyrażenie, które może być zerem).
  > $$ x(x - 4) = 4(x - 4) $$  
  > Po podzieleniu przez $(x - 4)$ (**_niedozwolone!_**) dostajesz:  
  > $$ x = 4 $$  
  > Po podstawieniu:  
  > $$ 4(0) = 4(0) \quad \text{(prawda)} $$  
  > Ale **dzielenie przez zero było nielegalne**, więc _**$(x = 4)$ jest rozwiązaniem pozornym**_.  
  > Poprawna analiza:  
  > $$ (x - 4)(x - 4) = 0 \Rightarrow x = 4 $$  
  > Ale jeśli dziedzina wyklucza 4 → $(S = \emptyset)$.

---



> [!NOTE]
> *$D$* - **dziedzina** (*die Definitionsmenge* lub *Domain*): Zbiór dopuszczalnych wartości, które możesz użyć.
> *$S$* - **zbiór rozwiązań** (*die Lösungsmenge* lub *Solution set*): Zbiór wartości, które spełniają równanie.
> Zbiór rozwiązań możesz zapisać jako $L$ co oznacza **Lösungs** (*ang: solution*). Jednakże będę stosować $S$ gdyż lepiej kojarzy się z _**Set**_ i łatwiej zapamiętać że wynik to zbiór wartości zapisany w klamrach np. $S=\\{1, 2, 3\\}$.

| Stan | Co oznacza? | Odpowiednik w inżynierii |
| --- | --- | --- |
| $S = \\{x_0\\}$ | jedno rozwiązanie | single valid config |
| *$S = \emptyset$* | brak rozwiązań | deadlock / invalid state |
| **$S = D$** | nieskończenie wiele rozwiązań | redundant true |
| **_błąd walidacji_**| wynik poza domeną | firewall reject |
| _**rozwiązanie pozorne**_ | błąd algebraiczny | undefined behavior |

---

### 🛠️ Punkt Kontrolny: Równanie i możliwa dziedzina
<data-gate>
<data-quiz>
    <question>Wskaz zdanie fałszywe</question>
    <options>
        <option>$2x + 6 = 10, \quad S=\\{2\\}$</option>
        <option correct>$4x + 7 = 10, \quad S=\\{1\\}$</option>
        <option>$2x - 7 = -1, \quad S=\\{3\\}$</option>
    </options>
    <div data-hint="success">Brawo! Poprawnie zdiagnozowałeś fałszywy zbiór rozwiązań. <br>W równaniu $4x+7=10$ nie da się uzyskać wyniku $10$ gdy podstawisz $1$ pod $x$. <br>$4 \cdot 1 + 7 = 11 \neq 10$.</div>
    <div data-hint="error">Dokonaj analizy poprzez podstawienie wartości zbioru rozwiązań pod równanie i sprawdź poprawność $L=P$.</div>
</data-quiz>
</data-gate>

## 🧮 Algorytm Rozwiązywania (Izolacja Zmiennej)

Analiza równania to proces dążenia do stanu, w którym zmienna zostaje całkowicie odizolowana po jednej ze stron kontraktu. 

Przykład bazowy:
$$\textcolor{#ff0001}{2}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{6} = \textcolor{#ff0003}{16}$$

Choć inspekcja wzrokowa pozwala szybko podać wynik ($x=5$), kluczowa jest znajomość formalnej procedury, niezbędnej przy systemach o wysokiej złożoności:

1. **Inicjalizacja Firewalla ($D$):** Zakładamy $D = \mathbb{R}$, o ile struktura nie zawiera mianowników ze zmienną.
2. **Redukcja Biasu:** Usuwamy wyraz wolny $\textcolor{#ff0002}{b}$ poprzez wykonanie operacji przeciwnej na obu stronach równania (zachowanie symetrii).
3. **Cofnięcie Wzmocnienia:** Jeśli zmienna posiada współczynnik $\textcolor{#ff0001}{a} \neq 1$, dzielimy obie strony równania przez tę wartość, aby uzyskać czyste $\textcolor{#ff0004}{x}$.
4. **Weryfikacja Końcowa:** Sprawdzamy, czy wynik należy do dziedziny $D$ i definiujemy zbiór $S$.

---

Prześledźmy ten proces formalnie:

1. **Zredukujmy przesunięcie** (*offset*) **wyrazu wolnego.** 
    - Patrzymy czy znak przed wyrazem wolnym $\textcolor{#ff0002}{b}$ jest dodatni czy ujemny i odpowiednio dodajemy lub odejmujemy go od obu stron równania.
    - W naszym przypadku jest to liczba $\textcolor{#ff0002}{6}$, która jest dodatnia więc odejmujemy ją od obu stron równania.
    Otrzymamy wtedy:
    $$\textcolor{#ff0001}{2}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{6} = \textcolor{#ff0003}{16}\quad\ \quad|\quad\textcolor{#ff0002}{-6}$$
$$\textcolor{#ff0001}{2}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{6} - \textcolor{#ff0002}{6} = \textcolor{#ff0003}{16} - \textcolor{#ff0002}{6}$$
$$\textcolor{#ff0001}{2}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{10}$$
2. **Zredukujmy współczynnik niewiadomej $x$** (*cofamy transformację mutacji*).  
    - Patrzymy czy współczynnik $\textcolor{#ff0001}{a}$ jest w relacji iloczynu czy ilorazu do niewiadomej $\textcolor{#ff0004}{x}$ i odpowiednio wykorzystujemy jego wartość w odwrotnej operacji na całości równania (lewa strona i prawa strona). 
    - W naszym przypadku współczynnik $\textcolor{#ff0001}{2}$ jest w relacji iloczynu, więc dokonujemy operacji dzielenia.  
    Otrzymamy wtedy:
    $$\textcolor{#ff0001}{2}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{10} \quad  \quad \|\quad :\textcolor{#ff0001}{2}$$
$$\textcolor{#ff0004}{x} = \frac{\textcolor{#ff0003}{10}}{\textcolor{#ff0001}{2}}$$
$$\textcolor{#ff0004}{x} = \textcolor{#ff0003}{5}$$
3. **Stan końcowy** to **zbiór rozwiązań** dla tego równania: $$\textcolor{#ff0004}{S = \\{5\\}}$$


## 🪤 Sandbox: Debugowanie równania liniowego krok po kroku

Dobrze wiem że możesz poprawnie wskazać wynik $\textcolor{#ff0004}{S}$, ale pamiętaj liczy się proces. Wynik uzyskany bez przedstawienia kroków procesu jest nic nie warty.

<data-gate>
<data-math-sandbox level="equations" data-label="Równanie liniowe: $3x + 5 = 20$">
  <div 
    data-step="1" 
    data-expected="3x = 15" 
    data-label="Zdejmij offset ($+5$) odejmując go od obu stron (L=P):"
    data-hints='{"ASYMMETRY_ERROR": "💡 Symetria utracona! Wykonałeś operację na lewej stronie, ale zapomniałeś o prawej. Balans został utracony.", "ILLEGAL_MUTATION": "💡 Nielegalna mutacja! Próbujesz odjąć 5 tylko od x. Musisz odjąć od CAŁEJ strony (pamiętaj o nawiasach!)." }'>
  </div>
  <div 
    data-step="2" 
    data-expected="x = 5" 
    data-label="Cofnij transformację mutacji ($3x$) dzieląc obie strony przez współczynnik (L=P):"
    data-hints='{"ASYMMETRY_ERROR": "💡 Pamiętaj: dzielisz obie strony przez 3, aby zachować balans.", "STRUCTURE_MISMATCH": "💡 Cel osiągnięty: \\(x\\) musi być odizolowany."}'>
  </div>
</data-math-sandbox>
</data-gate>

---

## 🧠 Obserwacja i zdefiniowanie intuicji

Dlaczego jesteś w stanie przy równaniu liniowym poprawnie „zgadnąć” wartość dla $\textcolor{#ff0004}{x}$?  
Ponieważ widząc równanie liniowe $\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$ od razu dokonujesz przekształcenia by poznać niewiadomą $\textcolor{#ff0004}{x}$. Dobrze to obrazuje ten wzór: 

<figure role="math">

$$\textcolor{#ff0004}{x} = \frac{\textcolor{#ff0003}{c} - \textcolor{#ff0002}{b}}{\textcolor{#ff0001}{a}}$$

  <figcaption>Izolacja zmiennej: postać kanoniczna równania</figcaption>
</figure>

Podstawiasz wartości i masz wynik 😉.

Bardzo sprytnie wykonałeś dwa przekształcenia w jednym procesie myślowym 😏:
1. $$\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c} \quad \textcolor{#ff0002}{\| -b}$$
$$\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{c} - \textcolor{#ff0002}{b}$$
2. $\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{c} - \textcolor{#ff0002}{b} \quad \textcolor{#ff0002}{\| :a}$
$$\textcolor{#ff0004}{x} = \frac{\textcolor{#ff0003}{c} - \textcolor{#ff0002}{b}}{\textcolor{#ff0001}{a}}$$

To co uzyskałeś to przekształcenie równania liniowego na wyrażenie algebraiczne. Jak dobrze pamiętasz powyższy wzór jest bardzo ryzykowny. Co gdyby $\textcolor{#ff0001}{a} = 0$? Wtedy otrzymamy dzielenie przez zero, które jest niedozwoloną operacją. 

Jednakże to ryzyko w równaniach liniowych nie występuje, ponieważ gdyby $\textcolor{#ff0001}{a}=0$ to od razu mamy wynik $\textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$

## 🔬 Co gdy składowe równania są wyrażeniami algebraicznymi?

W przypadkach operowania na liczbach równania liniowe są wręcz trywialne w swoim rozwiązaniu. Inaczej jest gdy składowe równania są wyrażeniami algebraicznymi. Wtedy w grę wchodzi cała wcześniejsza procedura. 🧐

Dokonajmy analizy kontraktu: <figure role="math">

$$\frac{x + 2}{x - 1} = 2$$. 

  <figcaption>Równanie wymierne przekształcone do postaci kanonicznej</figcaption>
</figure>

To już nie wygląda Ci jak kanoniczy wzór równania liniowego $\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$ i technicznie rzecz biorąc masz rację. Jest to równanie wymierne ($\mathbb{Q}$). Jednakże czy to oznacza że nie ma zastosowania procedura analizy równania i przejścia do formy kanonicznej? 🤔

---

Wykorzystajmy poznaną już procedurę do rozwiązywania tego przypadku:

1. *Wyznacz dziedzinę ($D$):*  
Domyślnie zakładamy, że akceptujemy wszystkie liczby rzeczywiste ($D = \mathbb{R}$), a następnie nałożymy filtr zbioru wartości, dla których moglibyśmy dokonać operacji niedozwolonych.

2. *Określ stany brzegowe (Firewall):*  
Zastanówmy się, jakie $\textcolor{#ff0004}{x}$ spowodowałoby ryzyko dzielenia przez zero i wykluczmy te wartości z naszej dziedziny.  
Ułamek to ładniejsza forma zapisu dzielenia licznika przez mianownik, więc jaka wartość $\textcolor{#ff0004}{x}$ podstawiona w mianowniku da nam $0$? 😉  
W naszym przypadku jest to $\textcolor{#ff0004}{x}=1$ ($$x - 1 = 0 \to 1 - 1 = 0$$). Zatem odrzucamy tą wartość z naszej dziedziny:   
$$\textcolor{#ff0002}{D} = \mathbb{R}\setminus\\{1\\}$$

> [!WARNING]
> Pamiętaj że dziedzina to **zbiór** więc wykluczając wartości z dziedziny koniecznie musisz zapisać je w nawiasach klamrowych **$\\{\\}$**.

3. *Przekształć równanie do postaci kanonicznej* ($\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} = \textcolor{#ff0003}{c}$).

W formie kanonicznej nie mamy ułamka więc najprostszą operacją przekształcenia będzie obustronne pomnożenie przez mianownik, czyli $$x - 1$$. Oczywiście musimy dodać adnotację $$\textcolor{#ff0002}{D} = \mathbb{R} \setminus \\{1\\}$$

Zapisujemy:
$$\frac{x + 2}{x - 1} = 2 \quad \| \cdot (x - 1) \quad \quad \quad \quad \quad \quad \textcolor{#ff0002}{D} = \mathbb{R} \setminus \\{1\\}$$

Wykonujemy operację:
$$\frac{x + 2}{x - 1} \cdot (x - 1) = 2 \cdot (x - 1) \quad \quad \quad \textcolor{#ff0002}{D} = \mathbb{R} \setminus \\{1\\}$$

Uzyskujemy postać kanoniczną $x + 2 = 2(x - 1)$ gdzie:
- $L=$ $\textcolor{#ff0001}{a}\textcolor{#ff0004}{x} + \textcolor{#ff0002}{b} \implies (x + 2)$
- $P= $ $\textcolor{#ff0003}{c} \implies 2(x - 1)$

> [!NOTE]
> ## 🌊 Normalizacja Sygnału: NWW vs Ułamki
> 
> Ułamki w równaniu to „szum”, który utrudnia izolację danych. Najskuteczniejszą metodą jest **Normalizacja Sygnału** poprzez pomnożenie całego kontraktu przy pomocy **NWW** mianowników.
> 
> **Przykład:** <figure role="math">
> 
> $$\frac{\textcolor{#ff0004}{x}}{\textcolor{#ff0001}{2}} + \frac{\textcolor{#ff0004}{x}}{\textcolor{#ff0001}{3}} = \textcolor{#ff0003}{10} \quad \|\cdot 6$$
> 
> <figcaption>Normalizacja sygnału za pomocą NWW</figcaption>
> </figure>
> 
> $$6 \cdot \frac{\textcolor{#ff0004}{x}}{\textcolor{#ff0001}{2}} + 6 \cdot \frac{\textcolor{#ff0004}{x}}{\textcolor{#ff0001}{3}} = 6 \cdot \textcolor{#ff0003}{10} \implies \textcolor{#ff0001}{3}\textcolor{#ff0004}{x} + \textcolor{#ff0001}{2}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{60} \implies \textcolor{#ff0001}{5}\textcolor{#ff0004}{x} = \textcolor{#ff0003}{60} \implies \textcolor{#ff0004}{x} = \textcolor{#ff0003}{12}$$
> 
> > [!IMPORTANT]
> > Pamiętaj o pomnożeniu **każdego** składnika równania, w tym stałych (liczb stojących samodzielnie). Zapomnienie o stałej niszczy symetrię układu.

Teraz możemy przejść do klasycznego rozwiązywania równań:

Przemnażamy nawias w prawej stronie równania:
> $$x + 2 = 2(x - 1) \implies x + 2 = 2x - 2$$ 

Przenosimy składowe równania z zmianą znaku na przeciwny by uzyskać porównanie niewiadomych z liczbami:
> $$x + 2 = 2x - 2 \implies x - 2x = -2 -2$$ 

Szukamy $x$, a uzyskaliśmy $-x$, więc mnożymy całe równanie przez $-1$, bo jedynka nic nie zmieni, a para minusów w operacji daje nam plus:
> $$-x = -4 \quad \| \cdot (- 1) \quad \implies x = 4$$ 

Wiemy już że w równaniu liniowym mamy jedno albo zero rozwiązań. W rezultacie nasze rozważania dobiegły końca i pozostało nam tylko sprawdzić czy uzyskany wynik nie koliduje z którąś wartością ze zbioru dziedziny <span style="white-space: nowrap;">$\textcolor{#ff0002}{D} = \mathbb{R} \setminus \\{1\\}$.</span>

$$4 \neq 1 \quad \checkmark \iff 4 \in \mathbb{R} \setminus \\{1\\} \quad \checkmark$$


Podsumowanie:
Równanie wymierne $$\frac{x + 2}{x - 1} = 2$$ posiada dziedzinę: $\textcolor{#ff0002}{D=\\mathbb{R}\\setminus\\{1\\}}$ i zbiór rozwiązań: $\textcolor{#ff0004}{S=\\{4\\}}$




> [!NOTE]
> ### 🔴 Zbrodnia na Runtime
> Zanim podzielisz przez $\textcolor{#ff0001}{a}$, musisz mieć pewność, że $\textcolor{#ff0001}{a} \neq 0$. Dzielenie przez zero to prosta droga do zawieszenia logiki wywodu.
> 
> ### ✅ Weryfikacja: Unit Testing
> 
> Sprawdzenie wyniku to nic innego jak Dowód Wprost dla konkretnego przypadku. Jeśli Twój wynik to x=12, podstaw go do oryginalnego zapytania i sprawdź, czy relacja L=P jest prawdziwa. Brak weryfikacji to wypuszczenie kodu bez testów jednostkowych.
---


## 🔗 Połącz Pary: Równania Liniowe z zbiorem rozwiązania

<data-gate>
<data-connection-matcher>
    <item left="$5x+2=17$" right="$\textcolor{#ff0002}{D=\mathbb{R}},\quad \textcolor{#ff0004}{S=\{3\}}$"></item>
    <item left="$4x+5=69$" right="$\textcolor{#ff0002}{D=\mathbb{R}},\quad \textcolor{#ff0004}{S=\{16\}}$"></item>
    <item left='<span style="font-size:1.4rem">$\frac{x+5}{x-1}$</span> $= 4$' right="$\textcolor{#ff0002}{D=\mathbb{R}\setminus\{1\}},\quad \textcolor{#ff0004}{S=\{3\}}$"></item>
    <item left='<span style="font-size:1.4rem">$\frac{5x+3}{x}$</span> $= 5.5$' right="$\textcolor{#ff0002}{D=\mathbb{R}\setminus\{0\}},\quad \textcolor{#ff0004}{S=\{6\}}$"></item>
    <item left='$\sqrt{5x+1}=x+1$' right="$\textcolor{#ff0002}{D=\mathbb{R}},\quad \textcolor{#ff0004}{S=\{4\}}$"></item>
</data-connection-matcher>
</data-gate>

---

## 🔬 Stany Brzegowe: Diagnoza Logiczna

Nie każde zapytanie zwraca jeden punkt. Systemy mogą wpadać w stany anomalne, które musisz zdiagnozować jako inżynier, korzystając z pojęć **Modułu 1 (Logika)** oraz **Modułu 2 (Dowody)**.

### 🔴 Case 1: Sprzeczność
Podczas izolacji niewiadoma $\textcolor{#ff0004}{x}$ zostaje całkowicie zredukowana ($0 = 3$), a to, co zostaje, jest **kłamstwem logicznym** ($\bot$).

- **Diagnoza:** Zapytanie jest sprzeczne. Żaden stan wejściowy nie spełnia kontraktu.
- **Wniosek formalny:** $\forall {\textcolor{#ff0004}{x} \in \mathbb{R}}: \bot$ (Dla każdego $x$ otrzymujemy fałsz).
- **Zbiór rozwiązań:** $S = \emptyset$.

Wydedukuj stany po refaktoryzacji i zobacz sprzeczności:

||||||
|:--:|:---:|:---:|:---:|:---:|
|$2x + 5 = 2x + 4$|$x + 1 = x$|$3(x + 1) = 3x + 5$|$10 - x = 12 - x$|$2(x + 4) = 2x + 10$|

### 🟢 Case 2: Tożsamość
Zmienna $\textcolor{#ff0004}{x}$ znika, ale zostaje prawda logiczna (np. $\textcolor{#ff0001}{0 = 0}$, $\textcolor{#ff0004}{6 = 6}$, $\textcolor{#ff0002}{x = x}$).

- **Diagnoza:** Równanie jest **tautologią** ($\top$). Obie strony od początku opisywały ten sam stan.
- **Wniosek formalny:** $\forall {\textcolor{#ff0004}{x} \in D}: \top$ (Dla każdego $x$ należącego do dziedziny otrzymujemy prawdę).
- **Zbiór rozwiązań:** $S = D$ (Wszystkie liczby, które przepuścił Firewall).

Wydedukuj stany po refaktoryzacji i zobacz tożsamości:

||||||
|:--:|:---:|:---:|:---:|:---:|
|$2x + 4 = 2(x + 2)$|$x + x = 2x$|$3x + 5 - x = 2x + 5$|$x - x = 0$|$2(x - 3) = 2x - 6$|

---



## 🚀 Stacja Treningowa: Debugowanie Systemów Liniowych

Czas na ostateczny audyt Twoich kompetencji. Rozwiąż poniższe zadania, przechodząc przez pełny stos technologiczny: **Firewall** $\rightarrow$ **Normalizacja** $\rightarrow$ **Izolacja** $\rightarrow$ **Weryfikacja**.

### Poziom 1: Synchronizacja Klastrów (NWW + Pułapka znaku)
W tym zadaniu musisz znormalizować sygnał przy użyciu NWW i uniknąć błędu asymetrii przy stałych.

<data-gate>
<data-math-sandbox level="equations" data-label="Zadanie 1: $\frac{\textcolor{#ff0004}{x}+3}{2} - \frac{\textcolor{#ff0004}{x}-2}{3} = 2$">
  <div 
    data-step="1" 
    data-strict="false"
    data-expected="3(x+3) - 2(x-2) = 12" 
    data-label="Znormalizuj sygnał mnożąc obie strony przez $NWW(2,3)=6$ (zachowaj nawiasy):"
    data-hints='{
      "ASYMMETRY_ERROR": "💡 Balans utracony! Wykonałeś operację tylko na jednej stronie kontraktu. Pamiętaj, aby pomnożyć KAŻDY składnik równania (również stałe) przez 6.",
      "FORM_MISMATCH": "💡 Poprawna normalizacja. Jednak dla bezpieczeństwa zapisz postać z nawiasami. To chroni Cię przed błędną inwersją znaków w kolejnym kroku."
    }'>
  </div>
  <div 
    data-step="2" 
    data-strict="false"
    data-expected="3x + 9 - 2x + 4 = 12" 
    data-label="Pozbądź się nawiasów (uważaj na inwersję znaku przy $-2$):"
    data-hint-wrong="-2x-4:⚠️ Pułapka znaku! Sprawdź wynik mnożenia dwóch wartości ujemnych."
    data-hints='{
      "CALCULATION_ERROR": "💡 Sprawdź dystrybucję sygnału. Uważaj szczególnie na znaki przy wymnażaniu drugiego nawiasu.",
      "VARIABLE_MISMATCH": "💡 Pamiętaj o pomnożeniu współczynnika przez każdy element wewnątrz nawiasu."
    }'>
  </div>
  <div 
    data-step="3" 
    data-strict="false"
    data-expected="x + 13 = 12" 
    data-label="Zredukuj wyrazy podobne (refaktoryzacja lewej strony):"
    data-hints='{
      "CALCULATION_ERROR": "💡 Sprawdź sumowanie stałych oraz redukcję współczynników przy zmiennej.",
      "VARIABLE_MISMATCH": "💡 Sumuj kontenery tego samego typu: x do x, stałe do stałych."
    }'>
  </div>
  <div 
    data-step="4" 
    data-expected="x = -1" 
    data-label="Odizoluj niewiadomą $\textcolor{#ff0004}{x}$ (werdykt):"
    data-hints='{
      "VARIABLE_MISMATCH": "💡 Przenosząc stałą na drugą stronę kontraktu, musisz zmienić jej znak na przeciwny.",
      "CALCULATION_ERROR": "💡 Wykonaj końcowe odejmowanie, aby wyznaczyć stan wejściowy."
    }'>
  </div>
</data-math-sandbox>
</data-gate>

### Poziom 2: Logiczny Firewall (Krytyczna Walidacja)
Sprawdź, czy system jest stabilny, zanim zaakceptujesz wynik. Firewall to Twoja pierwsza linia obrony.

<data-gate>
<data-math-sandbox level="equations" data-label="Zadanie 2: $\frac{2\textcolor{#ff0004}{x}+4}{\textcolor{#ff0004}{x}+2} = 3$">
  <div 
    data-step="1" 
    data-expected="D = \mathbb{R} \setminus \{-2\}" 
    data-label="Zdefiniuj dziedzinę równania (Firewall):"
    data-hints='{
      "SET_MISMATCH": "💡 Błąd w punkcie krytycznym. Sprawdź, dla jakiej wartości mianownik przyjmuje stan zerowy.",
      "FORM_MISMATCH": "💡 Firewall musi być precyzyjnie zdefiniowany. Użyj zapisu zbioru: D = \\mathbb{R} \\setminus \\{ x_0 \\}.",
      "LOGIC_ERROR": "💡 Pamiętaj, że Firewall wyklucza tylko te wartości, które powodują operację niedozwoloną (dzielenie przez zero)."
    }'>
  </div>
  <div 
    data-step="2" 
    data-strict="false"
    data-expected="2x + 4 = 3(x + 2)" 
    data-label="Znormalizuj sygnał mnożąc obie strony przez mianownik ($L=P$):"
    data-hints='{
      "ASYMMETRY_ERROR": "💡 Balans utracony! Wykonałeś operację tylko na jednej stronie kontraktu. Pamiętaj, aby pomnożyć każdy element (również stałe) przez mianownik.",
      "STRUCTURE_MISMATCH": "💡 Wyeliminuj ułamek mnożąc obie strony przez mianownik. Pamiętaj o nawiasach dla zachowania struktury strony."
    }'>
  </div>
  <div 
    data-step="3" 
    data-strict="false"
    data-expected="x = -2" 
    data-label="Izoluj niewiadomą $\textcolor{#ff0004}{x}$:"
    data-hints='{
      "VARIABLE_MISMATCH": "💡 Pamiętaj o zmianie znaków przy przenoszeniu elementów na drugą stronę znaku równości.",
      "CALCULATION_ERROR": "💡 Sprawdź dystrybucję sygnału (mnożenie przez nawias) oraz późniejszą redukcję wyrazów podobnych."
    }'>
  </div>
  <div 
    data-step="4" 
    data-expected="S = \emptyset" 
    data-label="Werdykt końcowy (Zbiór $S$) — zweryfikuj wynik z zasadami Firewalla:"
    data-hints='{
      "LOGIC_ERROR": "⚠️ Krytyczna niespójność! Porównaj uzyskany wynik z zasadami Firewalla zdefiniowanymi na starcie procesu.",
      "SET_MISMATCH": "💡 Jeśli wynik obliczeń został odrzucony przez Firewall, zbiór rozwiązań musi odzwierciedlać brak poprawnych stanów wejściowych."
    }'>
  </div>
</data-math-sandbox>
</data-gate>

### Poziom 3: Diagnoza Stanu (Analiza Tożsamości)
Nie każde zapytanie zwraca unikalny punkt. Zdiagnozuj zachowanie tego układu.
Równanie: $4(\textcolor{#ff0004}{x}-1) = 2(2\textcolor{#ff0004}{x}-2)$

<data-gate>
<data-math-sandbox level="equations" data-label="Zadanie 3: $4(\textcolor{#ff0004}{x}-1) = 2(2\textcolor{#ff0004}{x}-2)$">
  <div 
    data-step="1" 
    data-expected="4x - 4 = 4x - 4" 
    data-label="Uprość struktury kontraktu (dystrybucja sygnału):"
    data-hints='{
      "CALCULATION_ERROR": "💡 Sprawdź dystrybucję sygnału. Pamiętaj, aby pomnożyć współczynnik przez KAŻDY element wewnątrz nawiasu po obu stronach.",
      "VARIABLE_MISMATCH": "💡 Uważaj na znaki przy wymnażaniu. Sprawdź, czy po redukcji obie strony kontraktu opisują ten sam stan."
    }'>
  </div>
  <div 
    data-step="2" 
    data-expected="S = \mathbb{R}" 
    data-label="Zdiagnozuj stan końcowy (Werdykt) $S=...$:"
    data-hints='{
      "LOGIC_ERROR": "💡 Zauważ, że obie strony są identyczne (tautologia). Oznacza to, że system jest w pełni redundantny.",
      "SET_MISMATCH": "💡 Skoro każda wartość spełnia warunek L=P, zbiór rozwiązań musi obejmować wszystkie liczby dopuszczone przez Firewall."
    }'>
  </div>
</data-math-sandbox>
</data-gate>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Równanie to Kontrakt** między wejściem a wyjściem układu ($L=P$),
- **Wzmocnienie ($a$) i Bias ($b$)** to parametry transformacji zmiennej $x$,
- **Firewall (Dziedzina)** musi zostać wdrożony *przed* analizą, aby uniknąć błędów krytycznych,
- **Zbiór Rozwiązań ($S$)** to werdykt końcowy po przejściu przez walidację,
- **Normalizacja (NWW)** to klucz do czyszczenia szumu w równaniach wymiernych.

---

W kolejnej lekcji zajmiemy się **Układami Równań**, gdzie wiele kontraktów musi zostać spełnionych jednocześnie, co wymaga wyższych poziomów korelacji danych i eliminacji zmiennych. 🚀🦾
