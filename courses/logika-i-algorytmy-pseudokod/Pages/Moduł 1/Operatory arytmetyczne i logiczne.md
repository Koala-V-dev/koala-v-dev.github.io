# Operatory Arytmetyczne i Logiczne

Znasz już typy danych. Rozumiesz także, jak komputer rezerwuje pamięć dla zmiennych. Same dane są jednak tylko statycznymi wartościami w pamięci RAM. Aby program zaczął działać, musimy zmusić procesor do modyfikowania oraz weryfikowania tych informacji.

Do tego celu służą **operatory**. Każdy operator to konkretny rozkaz dla układu ALU (Jednostki Arytmetyczno-Logicznej). Zmusza on procesor do wykonania określonej operacji na komórkach pamięci.

---

## 🧮 Podstawowe Operacje: Wielka Piątka Arytmetyki

Najprostsze komendy wysyłane do układu ALU to pięć podstawowych operatorów arytmetycznych. Pierwsze cztery z nich są powszechnie znane:

* `+` (dodawanie),
* `-` (odejmowanie),
* `*` (mnożenie), które zapisujemy gwiazdką,
* `/` (dzielenie), które zapisujemy ukośnikiem.

Piąty operator jest niezwykle ważny w inżynierii oprogramowania.

### 🔄 Operator Modulo (<code>%</code>)

Operator Modulo zwraca **resztę z dzielenia całkowitego**. W kodzie zapisujemy go symbolem `%`. Modulo jest kluczowym narzędziem do kontrolowania cykli i powtarzalności.

Oto najważniejsze zastosowania tego operatora:

1. **Badanie parzystości:** Jeśli wyrażenie `X \\% 2` daje wynik `0`, liczba jest parzysta. Wynik `1` oznacza liczbę nieparzystą. Służy to do filtrowania zbiorów danych.
2. **Kontrola cykliczności:** Pozwala ograniczyć wartości do stałego przedziału. Przykładowo, po dodaniu godzin do czasu dobowego stosujemy Modulo $24$. Wynik `37 \\% 24` da poprawną godzinę `13`.
3. **Pętle w grach:** Służy do zapętlania ruchu obiektów. Przykładem jest wywoływanie animacji podczas przemieszczania postaci w przestrzeni.

Zbadaj działanie Modulo w poniższym symulatorze. Klikaj przycisk <kbd>⏭ Krok</kbd> i obserwuj, jak maszyna wylicza czas po przekroczeniu pełnej doby.

<data-gate>
<data-pseudocode-runner>
<pre>
czasObecny = 14
czasTrwania = 15

WYPISZ "Obliczanie czasu przy uzyciu Modulo 24:"
czasDostawy = (czasObecny + czasTrwania) % 24

WYPISZ "Kurier bedzie o godzinie:"
WYPISZ czasDostawy
</pre>
</data-pseudocode-runner>
</data-gate>

Dzięki Modulo nie musimy pisać rozbudowanych instrukcji warunkowych sprawdzających, „co stanie się po północy”. Jeden prosty operator automatycznie resetuje licznik czasu.

---

## 🧬 Modyfikacje Pamięci: Mutacje Stanu

Programiści rzadko modyfikują zmienne poprzez pełne zapisy typu `x = x + 1`. Procesory posiadają instrukcje do bezpośredniej zmiany wartości w tej samej komórce pamięci. Pozwala to oszczędzać cykle pracy procesora. Zjawisko to określamy jako **mutacja stanu**.

### ➕ Inkrementacja i Dekrementacja

Te operatory zmieniają wartość zmiennej dokładnie o 1.

* `x++` (inkrementacja) to skrócony zapis operacji `x = x + 1`.
* `x--` (dekrementacja) to skrócony zapis operacji `x = x - 1`.

### ✖️ Operatory Przypisania Łącznego

Gdy modyfikujesz wartość o inną wielkość niż 1, możesz połączyć znak działania ze znakiem równości.

* `x += 5` zastępuje pełny zapis `x = x + 5`.
* `x *= 2` zastępuje pełny zapis `x = x * 2`.
* `x /= 10` zastępuje pełny zapis `x = x / 10`.

Taki zapis ułatwia optymalizację kodu. Informuje kompilator, że operacja jest wykonywana bezpośrednio na tym samym adresie w pamięci RAM.

---

## ⚖️ Porównywanie Wartości: Operatory Relacyjne

Aby program mógł podejmować decyzje, musimy porównywać dane. Służą do tego operatory relacyjne:

* **`>` (większe) oraz `<` (mniejsze)**,
* **`>=` (większe lub równe) oraz `<=` (mniejsze lub równe)**,
* **`==` (równe)**,
* **`!=` (różne / nie równe)**.

> [!IMPORTANT]
> Pamiętaj o różnicy między operatorami. Pojedynczy znak `=` służy do przypisania wartości. Podwójny znak `==` służy do sprawdzenia, czy wartości są równe.

Główna zasada działania: porównanie zawsze zwraca wynik w postaci typu logicznego. Otrzymujemy wartość **PRAWDA** lub **_FAŁSZ_**. Wynik takiego porównania możemy natychmiast zapisać do zmiennej.

Przeanalizuj poniższy przykład:
`wynikTestu = (5 > 10)`

Zmienna `wynikTestu` otrzyma wartość **_FAŁSZ_**, ponieważ liczba 5 nie jest większa od 10.

---

## 🚦 Sprawdzanie Złożonych Warunków: Operatory Logiczne

Systemy komputerowe często muszą weryfikować kilka warunków jednocześnie. Przykładowo, logowanie do konta wymaga poprawnego hasła oraz braku blokady profilu. Do łączenia warunków służą operatory logiczne.

### 🚪 Bramka AND (Koniunkcja)

Operator logiczny `AND` wymaga spełnienia wszystkich warunków składowych. Zwraca wartość **PRAWDA** tylko wtedy, gdy każdy z łączonych warunków jest prawdziwy. Jeśli chociaż jeden warunek da wynik **_FAŁSZ_**, całe wyrażenie staje się fałszywe.

<data-gate>
<data-logic-gate type="AND"></data-logic-gate>
<data-truth-table gate="AND" header="p \land q"></data-truth-table>
</data-gate>

### 🚪 Bramka OR (Alternatywa)

Operator logiczny `OR` jest bardziej tolerancyjny. Zwraca wartość **PRAWDA**, jeśli spełniony jest przynajmniej jeden z podanych warunków. Wyrażenie ma wartość **_FAŁSZ_** tylko wtedy, gdy wszystkie warunki składowe są fałszywe.

<data-gate>
<data-logic-gate type="OR"></data-logic-gate>
<data-truth-table gate="OR" header="p \lor q"></data-truth-table>
</data-gate>

### 🚪 Bramka NOT (Negacja)

Operator logiczny `NOT` odwraca wartość logiczną. Zmienia stan **PRAWDA** na **_FAŁSZ_** oraz **_FAŁSZ_** na **PRAWDA**.

<data-gate>
<data-logic-gate type="NOT"></data-logic-gate>
<data-truth-table gate="NOT" header="\neg p"></data-truth-table>
</data-gate>

---

## ⚡ Optymalizacja Obliczeń: Short-Circuit Evaluation

Współczesne kompilatory i procesory optymalizują wykonywanie testów logicznych. Korzystają z mechanizmu określanego jako **leniwe wartościowanie (Short-Circuit Evaluation)**.

Rozważmy następujące wyrażenie:
`(A == 5) OR (B == 10) OR (C == 100)`

Co zrobi procesor, jeśli zmienna `A` ma wartość `5`? 
Bramka `OR` daje wynik prawdziwy, jeśli przynajmniej jeden element jest spełniony. Ponieważ procesor analizuje kod od lewej do prawej, kończy sprawdzanie od razu po potwierdzeniu pierwszego warunku. System nie traci czasu na odczytywanie z pamięci RAM wartości zmiennych `B` oraz `C`.

Podobna optymalizacja zachodzi dla operatora `AND`. Jeśli pierwszy warunek od lewej daje wynik **_FAŁSZ_**, całe wyrażenie na pewno będzie fałszywe. Procesor natychmiast przerywa dalsze sprawdzanie.

---

## 📑 Priorytety Wykonywania: Hierarchia Operatorów

Gdy w jednej linii kodu występuje wiele różnych operatorów, procesor wykonuje je w ściśle określonej kolejności.

Maszyna stosuje następującą hierarchię priorytetów:

1. **Nawiasy `()`** - Wszystkie operacje wewnątrz nawiasów okrągłych są wykonywane w pierwszej kolejności.
2. **Matematyka wyższa** - Następnie procesor wykonuje mnożenie, dzielenie oraz operację modulo (`*`, `/`, `%`).
3. **Matematyka niższa** - W kolejnym kroku obliczane jest dodawanie oraz odejmowanie (`+`, `-`).
4. **Porównania relacyjne** - Następnie wyznaczana jest prawdziwość relacji (`>`, `<`, `==`, `!=`).
5. **Operatory logiczne** - Na samym końcu obliczane są bramki logiczne (`AND` oraz `OR`), które ustalają końcowy wynik.

> [!TIP]
> **Dobra praktyka programistyczna:** Nawet jeśli znasz priorytety operatorów, w kodzie komercyjnym zaleca się stosowanie nawiasów. Zapis `((A + B) > C) AND (D == 5)` jest znacznie czytelniejszy i eliminuje ryzyko pomyłek przy interpretacji logiki programu.

Opanowanie tego dokumentu to zamknięcie bram przed wejściem w Instrukcje Warunkowe. Stajesz się architektem. Znasz typy prądu (Zmienne) i narzędzia do ich spawania (Operatory). Czas zbudować z tego mosty, czyli tzw. Control Flow.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Modulo `%` reguluje cykle.** Odpowiada za resztę z dzielenia. Jest kluczowym narzędziem do badania parzystości liczb oraz kontroli powtarzalności bez używania rozbudowanych warunków.
- **Przypisanie to nie porównanie.** Pojedynczy znak `=` zapisuje dane pod wskazany adres w pamięci RAM. Podwójny znak `==` to operator porównania, który zawsze zwraca wartość logiczną.
- **Optymalizacja Short-Circuit.** Bramki logiczne `AND` oraz `OR` są sprawdzane od lewej do prawej. Procesor natychmiast przerywa badanie warunku, gdy końcowy wynik logiczny jest już pewny.
- **Stosowanie nawiasów.** Używanie nawiasów okrągłych eliminuje potrzebę domyślania się hierarchii operatorów. Chroni to kod przed powstawaniem błędów logicznych.
- **Mutacje stanu.** Operatory takie jak `++`, `--` oraz przypisania łączne (np. `+=`) pozwalają na wydajniejszą modyfikację komórek pamięci.
