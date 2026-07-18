# Instrukcje Warunkowe: Decyzyjność algorytmu

Bez możliwości rozgałęziania kodu program wykonuje wszystkie instrukcje po kolei. Oznacza to, że realizuje je linijka po linijce, zawsze w tej samej kolejności. Taki program działa jak prosty kalkulator.

Złożone systemy informatyczne wymagają jednak elastyczności. Program musi reagować na dane wejściowe i dostosowywać do nich swoje zachowanie. Do tego celu służy **instrukcja warunkowa** (często określana jako `IF`). Pozwala ona na warunkowe pominięcie lub wykonanie wybranych bloków kodu.

---

## 🚦 Budowa Instrukcji: JEŻELI ... TO ... W PRZECIWNYM RAZIE

Podstawowa struktura podejmowania decyzji składa się z trzech etapów:

1. **Ewaluacja warunku:** Układ ALU weryfikuje warunek relacyjny (np. `wiek >= 18`). Wyrażenie to musi dać wynik prawdziwy lub fałszywy.
2. **Ścieżka prawdy (`TO`):** Blok kodu wykonywany tylko wtedy, gdy sprawdzany warunek jest prawdziwy.
3. **Ścieżka fałszu (`W PRZECIWNYM RAZIE`):** Blok kodu wykonywany tylko wtedy, gdy sprawdzany warunek jest fałszywy.

Procesor nigdy nie wykonuje obu tych ścieżek jednocześnie. Jeśli warunek jest prawdziwy, blok fałszu zostaje całkowicie pominięty. Po wykonaniu odpowiednich instrukcji program przechodzi bezpośrednio do linii `KONIEC JEŻELI`.

<data-gate>
<data-pseudocode-runner>

<pre>
wiek = 16

WYPISZ "Weryfikacja wieku..."

JEŻELI wiek >= 18 TO
    WYPISZ "Dostęp przyznany. Witaj w systemie."
W PRZECIWNYM RAZIE
    WYPISZ "Odmowa. Jesteś za młody."
KONIEC JEŻELI

WYPISZ "Koniec programu."
</pre>
</data-pseudocode-runner>
</data-gate>

Przeklikaj ten program przyciskiem **Krok**. Zaobserwujesz, że instrukcja po słowie kluczowym `W PRZECIWNYM RAZIE` zostanie całkowicie pominięta przez układ ALU!

---

## 🧬 Warunki Złożone: Łączenie Sygnałów

Pojedyncze zapytanie to często za mało. Co jeśli system wymaga weryfikacji kilku czynników jednocześnie? W takich sytuacjach wewnątrz instrukcji `JEŻELI` stosujemy operatory logiczne.

Wykorzystujemy do tego operatory logiczne:

* **Bramka `AND`:** Stosowana wtedy, gdy wymagane jest bezwzględne spełnienie wszystkich warunków jednocześnie.
* **Bramka `OR`:** Stosowana wtedy, gdy wystarczy spełnienie przynajmniej jednego z podanych warunków.

Dobrą praktyką jest grupowanie poszczególnych warunków w nawiasy okrągłe `()`. Zapobiega to błędom wynikającym z priorytetów operatorów.

<data-gate>
<data-pseudocode-runner>

<pre>
punktyWidza = 45
czyVIP = PRAWDA

JEŻELI (punktyWidza >= 100) OR (czyVIP == PRAWDA) TO
    WYPISZ "Wstęp do loży VIP otwarty!"
W PRZECIWNYM RAZIE
    WYPISZ "Pozostań w sektorze standardowym."
KONIEC JEŻELI
</pre>
</data-pseudocode-runner>
</data-gate>

---

## 🪆 Zagnieżdżanie: Decyzja wewnątrz Decyzji

Struktury decyzyjne w programach bywają wielopoziomowe. Możemy najpierw sprawdzić wiek użytkownika. Dopiero po potwierdzeniu pełnoletności weryfikujemy posiadanie ważnego biletu.

Takie rozwiązanie nazywamy **zagnieżdżeniem instrukcji warunkowych**. Wewnątrz bloku prawdy lub fałszu umieszczamy kolejną, całkowicie niezależną instrukcję `JEŻELI`.

<data-gate>
<data-pseudocode-runner>

<pre>
wiek = 22
bilet = FAŁSZ

JEŻELI wiek >= 18 TO
    WYPISZ "[V] Wiek OK"
    
    JEŻELI bilet == PRAWDA TO
        WYPISZ "[V] Bilet OK. Wejdz."
    W PRZECIWNYM RAZIE
        WYPISZ "[X] Brak biletu. Skieruj do kasy."
    KONIEC JEŻELI
    
W PRZECIWNYM RAZIE
    WYPISZ "[X] Odrzucony - za mlody. Nie sprawdzam nawet biletu."
KONIEC JEŻELI
</pre>
</data-pseudocode-runner>
</data-gate>

Zauważ korzyść wydajnościową tej struktury. Jeśli osoba nie spełnia warunku pełnoletności, procesor od razu przechodzi do zewnętrznej sekcji `W PRZECIWNYM RAZIE`. Zmienna `bilet` nie jest w ogóle weryfikowana.

---

## 🕳️ Pułapki Logiczne: Kolejność Ewaluacji

Podczas tworzenia rozbudowanych struktur warunkowych łatwo popełnić błąd logiczny. Wynika on ze specyfiki działania procesora.

Interpreter analizuje warunki po kolei, od góry do dołu. Wykonuje on wyłącznie pierwszy napotkany blok, którego warunek dał wynik prawdziwy. Pozostała część struktury zostaje całkowicie zignorowana.

Przeanalizujmy błędną próbę przyznawania rang na podstawie zebranych punktów:

* **Od 10 punktów:** Ranga Brązowa.
* **Od 50 punktów:** Ranga Srebrna.
* **Od 100 punktów:** Ranga Złota.

<data-gate>
<data-pseudocode-runner>

<pre>
punktyGracza = 150

WYPISZ "System nadawania rang (BLEDNY DESIGN):"

JEŻELI punktyGracza >= 10 TO
    WYPISZ "Ranga Brazowa!"
W PRZECIWNYM RAZIE
    JEŻELI punktyGracza >= 50 TO
        WYPISZ "Ranga Srebrna!"
    W PRZECIWNYM RAZIE
        JEŻELI punktyGracza >= 100 TO
            WYPISZ "Ranga Zlota!"
        KONIEC JEŻELI
    KONIEC JEŻELI
KONIEC JEŻELI
</pre>
</data-pseudocode-runner>
</data-gate>

Dlaczego gracz mający 150 punktów otrzymał rangę Brązową? 

Program sprawdził pierwszy warunek od góry: `150 >= 10`. Wynik tego porównania to prawda. Została wykonana instrukcja wypisania rangi Brązowej, a cały pozostały blok warunkowy został pominięty.

> [!CAUTION]
> Warunki w strukturach wielokrotnego wyboru należy układać od najbardziej szczegółowych do najbardziej ogólnych. Przy porównaniach wartości liczbowych za pomocą operatora `>=` na samej górze sprawdzamy najwyższe progi.

Poniżej znajduje się poprawiona struktura logiczna:

<data-gate>
<data-pseudocode-runner>

<pre>
punktyGracza = 150

WYPISZ "System nadawania rang (DOBRY DESIGN):"

JEŻELI punktyGracza >= 100 TO
    WYPISZ "Ranga Zlota!"
W PRZECIWNYM RAZIE
    JEŻELI punktyGracza >= 50 TO
        WYPISZ "Ranga Srebrna!"
    W PRZECIWNYM RAZIE
        JEŻELI punktyGracza >= 10 TO
            WYPISZ "Ranga Brazowa!"
        KONIEC JEŻELI
    KONIEC JEŻELI
KONIEC JEŻELI
</pre>
</data-pseudocode-runner>
</data-gate>

Taka konstrukcja odpowiada strukturze `ELSE IF` w tradycyjnych językach programowania. Każdy kolejny warunek sprawdzany jest tylko wtedy, gdy poprzedni okazał się fałszywy.

---

## 🎛️ Instrukcja Wyboru: WYBIERZ ZMIENNĄ

Drabinki warunkowe zbudowane z wielu instrukcji `JEŻELI` bywają nieczytelne. Gdy chcesz wykonać określone działania na podstawie konkretnej wartości jednej zmiennej, lepszym wyborem architektonicznym jest użycie instrukcji wyboru (tzw. `switch` z języków programowania).

W polskim pseudokodzie instrukcja ta nazywa się `WYBIERZ`. Jej działanie polega na dopasowaniu wartości danej zmiennej do jednego z podanych przypadków (`PRZYPADEK`). Jeśli żaden przypadek nie pasuje, wykonywany jest blok zastępczy (`INACZEJ`).

<data-gate>
<data-pseudocode-runner>
<pre>
wybórMenu = 2

WYBIERZ wybórMenu
    PRZYPADEK 1:
        WYPISZ "Wybrano: Rozpocznij nową grę."
    PRZYPADEK 2:
        WYPISZ "Wybrano: Opcje i ustawienia."
    PRZYPADEK 3:
        WYPISZ "Wybrano: Wyjście."
    INACZEJ:
        WYPISZ "Nieznana opcja. Podaj liczbę od 1 do 3."
KONIEC WYBIERZ
</pre>
</data-pseudocode-runner>
</data-gate>

Zwróć uwagę, że instrukcja `WYBIERZ` jest bardzo zoptymalizowana. Maszyna od razu przeskakuje do odpowiedniego przypadku, omijając wszystkie pozostałe (podobnie jak pociąg przestawiany na odpowiednie tory za pomocą zwrotnicy). Brak konieczności weryfikacji wielu skomplikowanych operatorów relacyjnych oszczędza cykle procesora.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Selektywne wykonywanie kodu.** Instrukcja warunkowa pozwala maszynie pomijać wybrane bloki rozkazów. Zwiększa to wydajność i elastyczność programu.
- **Bezpieczne warunki złożone.** Przy łączeniu warunków za pomocą operatorów `AND` oraz `OR` stosuj nawiasy okrągłe. Gwarantuje to właściwą kolejność ich sprawdzania.
- **Czytelne struktury zagnieżdżone.** Możesz umieszczać instrukcje warunkowe wewnątrz innych decyzji. Pamiętaj jednak o zachowaniu odpowiednich wcięć w tekście.
- **Hierarchia w drabinkach warunkowych.** Badając progi liczbowe, zawsze układaj warunki od najwyższych (najtrudniejszych do spełnienia) do najniższych.
