# Od rysunku do kodu: Pseudokod i potęga abstrakcji

W poprzednich lekcjach projektowaliśmy logikę przy użyciu schematów blokowych. Wizualna reprezentacja dobrze obrazuje przepływ programu, pokazując jak wskaźnik instrukcji wędruje przez węzły, przydzielając pamięć RAM i decydując o dalszej ścieżce.

Grafika ma jednak ograniczenia. Nawet prosta aplikacja użytkowa składa się z tysięcy operacji. Schemat blokowy o takiej skali szybko zamieniłby się w nieczytelną pajęczynę przecinających się linii.

Aby sprawnie zarządzać tak dużą liczbą instrukcji, korzystamy z kodu tekstowego. Pozwala on na zapisanie ogromnej ilości rozkazów dla procesora w zwartej i czytelnej formie. Zanim przejdziesz do konkretnych języków programowania, warto poznać uniwersalny pomost pomiędzy światem rysunku a kodem – **Pseudokod**.

---

## 🗜️ Dekodowanie Schematu: Architektura Pseudokodu

Pseudokod to uproszczony zapis przypominający język programowania, ale pozbawiony jego ścisłych reguł składniowych. Nie musisz stawiać średników na końcu linii ani definiować bibliotek.

Służy on dwóm kluczowym zadaniom:
1. Pozwala naszkicować logikę algorytmu na papierze, bez tracenia czasu na poprawianie błędów składniowych.
2. Przyzwyczaja umysł do przejścia z myślenia przestrzennego (grafy 2D) na liniowe, gdzie kod czytany jest z góry na dół.

Pokażę Ci teraz, w jaki sposób podstawowe figury ze schematów blokowych zamieniają się w polecenia tekstowe.

---

## 📦 Filar 1: Sekwencja i Pamięć Operacyjna

Zamiast rysować prostokąt, w tekście przypisanie wartości do pamięci realizujemy używając znaku równości `=`. Wartość po prawej stronie jest obliczana, a wynik trafia do pamięci RAM pod nazwę podaną po lewej stronie.

Z kolei równoległobok (reprezentujący operacje wejścia/wyjścia) zamieniamy na proste polecenia `WYPISZ` lub `POBIERZ`.

Wykorzystaj poniższy „Kroker Kodowy”. Przeanalizujmy algorytm, który sumuje i uśrednia trzy wartości. Klikaj przycisk <kbd>⏭ Krok</kbd> i obserwuj, jak procesor sekwencyjnie rezerwuje pamięć w panelu **(RAM) Zmienne**. Zwróć uwagę, jak instrukcja `WYPISZ` wyświetla te wartości na ekranie.

<data-gate>
<data-pseudocode-runner>
<pre>
a = 10
b = 5
c = 15

suma = a + b + c
srednia = suma / 3

WYPISZ "Obliczanie statystyk zakonczone."
WYPISZ "Calkowita suma wynosi: " + suma
WYPISZ "Srednia z pomiarow to: " + srednia
</pre>
</data-pseudocode-runner>
</data-gate>

Zauważ, jak wskaźnik instrukcji wykonuje kod linijka po linijce, tworząc krok po kroku _**Stan**_ Twojego programu. W schemacie blokowym wymagałoby to narysowania pięciu osobnych bloków.

---

## 🔀 Filar 2: Architektura Skoków i Instrukcja JEŻELI

Największa zmiana następuje przy rombach decyzyjnych. Na schemacie blokowym ścieżka rozwidla się na **TAK** oraz **_NIE_**. Kod tekstowy zapisujemy liniowo, więc nie mamy możliwości stworzenia dwóch oddzielnych kolumn poleceń.

Aby to rozwiązać, stosujemy instrukcję `JEŻELI ... TO` (ang. `IF`). Używamy tu również wcięć (tabulacji), aby pogrupować instrukcje. Każda linia przesunięta o jedno wcięcie w prawo należy do danego bloku logicznego.

Jeśli warunek jest oceniony jako **Prawda**, program wchodzi do bloku i wykonuje wcięte instrukcje. Jeśli sygnał to **_Fałsz_**, procesor przeskakuje ten wcięty blok i przechodzi od razu do sekcji `W PRZECIWNYM RAZIE` (ang. `ELSE`).

Przeanalizujmy klasyczny algorytm wybierający większą z dwóch liczb. Zobacz, jak wskaźnik wykonawczy całkowicie omija ten blok kodu, który nie spełnia warunku.

<data-gate>
<data-pseudocode-runner>
<pre>
liczbaA = 74
liczbaB = 103

WYPISZ "Rozpoczynam analize maksimum..."

JEŻELI liczbaA > liczbaB TO
    maksimum = liczbaA
W PRZECIWNYM RAZIE
    maksimum = liczbaB
KONIEC JEŻELI

WYPISZ "Najwieksza liczba w zbiorze to: " + maksimum
</pre>
</data-pseudocode-runner>
</data-gate>

Zapis `KONIEC JEŻELI` jest kluczowy. Jasno informuje komputer, gdzie kończy się rozwidlenie i w którym miejscu obie ścieżki zbiegają się we wspólny ciąg instrukcji.

---

## 🔄 Filar 3: Pętla DOPÓKI

Pętla iteracyjna (ang. `WHILE`) pozwala na wielokrotne powtarzanie tego samego kodu. Na schemacie blokowym była to strzałka, która wracała z powrotem do rombu decyzyjnego. 

W dokumencie tekstowym osiągamy ten efekt stosując strukturę `DOPÓKI ... WYKONUJ` wraz z domknięciem `KONIEC DOPÓKI`. Kiedy procesor dociera do linii zamknięcia, wraca do samego początku pętli. Tam ponownie sprawdza warunek i decyduje, czy rozpocząć kolejny cykl.

Przetestuj algorytm odliczania w Krokerze. Wykonuj kolejne kroki i obserwuj moment, w którym aktualizacja zmiennej *`odliczanie`* sprawia, że warunek staje się fałszywy, a pętla ulega zakończeniu.

<data-gate>
<data-pseudocode-runner>
<pre>
odliczanie = 3
czasOpoznienia = 1

WYPISZ "Inicjalizacja ladunku..."

DOPÓKI odliczanie > 0
    WYPISZ "Czas do eksplozji: " + odliczanie
    odliczanie = odliczanie - czasOpoznienia
KONIEC DOPÓKI

WYPISZ "BOOM!"
</pre>
</data-pseudocode-runner>
</data-gate>

Gdybyś pominął aktualizację zmiennej wewnątrz pętli, warunek zawsze pozostałby spełniony. Stworzyłoby to **_Nieskończoną pętlę_**, która zawiesiłaby działanie programu.

---

## 🧠 Kompilator w Mózgu i Tabela Śledzenia

Na egzaminach z programowania często spotkasz się z gotowym kodem, a Twoim zadaniem będzie odgadnąć, jaki wynik ostatecznie wygeneruje program. 

W takiej sytuacji stosuje się Tabelę Śledzenia (*Trace Table*). Pozwala ona na papierze prześledzić zmiany poszczególnych zmiennych krok po kroku, dokładnie tak, jak robi to komputer.

Rozwiążmy wspólnie prosty przykład iteracyjny. Spójrz na poniższy kod:

```yaml
x = 2
y = 5

DOPÓKI y > 1
    x = x + y
    y = y - 2
KONIEC DOPÓKI

WYPISZ x
```

Tabela Śledzenia obrazuje krok po kroku aktualne stany przypisane do pamięci (Zmienna *`x`* oraz Zmienna *`y`*). Zobaczmy przebieg algorytmu w praktyce:

| Numer kroku | Zdarzenie | *`x`* | *`y`* | Wynik logiki i decyzja pętli |
| :--- | :--- | :--- | :--- | :--- |
| **Start** | Przypisanie `x` | `2` | Puste | Uruchomienie programu. |
| **Start** | Przypisanie `y` | `2` | `5` | Obie zmienne są gotowe. |
| **Cykl 1** | Sprawdzenie `y > 1` | `2` | `5` | $5 > 1$ to **Prawda**. Wejście do pętli. |
| **Cykl 1** | Aktualizacja `x` | `2 + 5 = 7` | `5` | `x` otrzymuje wartość $7$. |
| **Cykl 1** | Aktualizacja `y` | `7` | `5 - 2 = 3` | `y` otrzymuje wartość $3$. |
| **Cykl 1** | KONIEC DOPÓKI | `7` | `3` | Powrót na początek pętli. |
| **Cykl 2** | Sprawdzenie `y > 1` | `7` | `3` | $3 > 1$ to **Prawda**. Wejście do pętli. |
| **Cykl 2** | Aktualizacja `x` | `7 + 3 = 10` | `3` | `x` otrzymuje wartość $10$. |
| **Cykl 2** | Aktualizacja `y` | `10` | `3 - 2 = 1` | `y` zostaje zmniejszone do $1$. |
| **Cykl 2** | KONIEC DOPÓKI | `10` | `1` | Powrót na początek pętli. |
| **Wyjście** | Sprawdzenie `y > 1` | `10` | `1` | $1 > 1$ daje **_Fałsz_**. Zakończenie pętli. |
| **Koniec** | WYPISZ `x` | `10` | `1` | Program wypisuje wynik **10**. |

Udało nam się bez zgadywania ustalić, że pętla wykona się dokładnie dwa razy, a na końcu program wyświetli liczbę $10$. Tabela śledzenia to proste i sprawdzone narzędzie ułatwiające analizę działania kodu przed jego właściwym uruchomieniem.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Przewaga tekstu nad grafiką:** Gdy algorytm rozrasta się do dużych rozmiarów, tekstowa lista instrukcji jest znacznie czytelniejsza niż rozbudowany schemat graficzny.
- **Wcięcia i skoki:** Słowa takie jak `JEŻELI` czy `DOPÓKI` nie tylko pełnią funkcje czytelnych instrukcji dla człowieka. Mówią one programowi, które konkretnie wcięte bloki kodu ma wykonać, a które powinien przeskoczyć.
- **Znaczenie analizy ręcznej:** Zanim spróbujesz rozwiązać problem w edytorze kodu, warto przetestować własną logikę zapisując na kartce poszczególne iteracje zmiennych. Pozwala to na wczesne wykrycie wielu pomyłek.
