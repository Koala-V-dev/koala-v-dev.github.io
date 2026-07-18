# Typy Danych i Pamięć Fizyczna: Świadomość danych i zasobów

Z poprzedniego modułu wiesz, że zmienna to zarezerwowany obszar w pamięci RAM, do którego odwołujemy się za pomocą etykiety. Komputer to jednak urządzenie w pełni inżynieryjne – nie potrafi zgadywać. Jeśli zapiszesz w pamięci sygnał, musisz jednoznacznie zadeklarować maszynie, w jaki sposób ma go interpretować. Do tego służą **Typy Danych**.

Wszystko w komputerze to ciąg zer i jedynek. Ten sam fizyczny ciąg bitów może być na ekranie wyświetlony jako liczba `65`, a w innym przypadku jako litera `"A"`. Zrozumienie różnicy pomiędzy typami pozwala uniknąć katastrofalnych błędów już na poziomie pisania kodu.

## 🧠 Czym fizycznie jest Pamięć RAM?

Zanim przejdziemy do typów, musimy zdefiniować samo zjawisko **Pamięci**. Zmienna nie unosi się w magicznej chmurze. Pamięć RAM (Random Access Memory) to fizyczna siatka miliardów mikroskopijnych kondensatorów i tranzystorów na płycie głównej. 

Kiedy w pseudokodzie piszesz `wiek = 18`, system operacyjny:
1. Szuka wolnego bloku w tej siatce krzemu.
2. Rezerwuje go dla Twojego programu.
3. Fizycznie ładuje wybrane kondensatory prądem (stan $1$), a inne rozładowuje (stan $0$), aby zapisać binarną formę liczby 18.
4. Zwraca Ci **Adres Pamięci** (np. `0x1A4F`), który kompilator ukrywa pod przyjazną dla Ciebie nazwą `wiek`.

Każda komórka ma swój z góry określony rozmiar. Jeśli chcesz przechować w niej znak, procesor musi wiedzieć, ile dokładnie kondensatorów ma do dyspozycji. Dlatego właśnie system musi znać **Typ Danych**.

> [!TIP]
> **Wyrównanie danych w pamięci**
> Pamięć RAM jest podzielona na komórki o rozmiarze $1\text{ bajta}$. Współczesne procesory $64\text{-bitowe}$ odczytują pamięć blokami po $8\text{ bajtów}$. Kompilatory automatycznie wyrównują zmienne w pamięci. Brak wyrównania sprawiłby, że np. $4\text{-bajtowa}$ liczba mogłaby zostać podzielona na dwa bloki, co wymusiłoby na procesorze wykonanie dwóch odczytów zamiast jednego.

Poniżej znajdziesz reprezentację ułożenia danych w RAM (od lewej do prawej), gdzie jeden kwadrat to $1\text{ bajt}$:

![Schemat wizualizujący ułożenie zmiennych w komórkach pamięci RAM o szerokości 8 bajtów z uwzględnieniem dopełnienia (paddingu) i wyrównania.](/public/courses/logika-i-algorytmy-pseudokod/Images/Rozmieszczenie-zmiennych-w-komórkach-pamięci-RAM.png)

:::diagram
Diagram ilustruje różne sposoby alokacji zmiennych w pamięci RAM, która jest zorganizowana w 8-bajtowe wiersze. Zestawia ze sobą poprawne i błędne ułożenie danych (ang. memory alignment), ukazując zjawiska dopełnienia (paddingu) oraz wyrównania strukturalnego.
:::

**Opis strukturalny diagramu**

1. **Struktura pamięci RAM (wiersze 8-bajtowe)**: legenda rozmiarów typów danych: `bool` zajmuje 1 bajt (niebieski), `int` 4 bajty (zielony), `float` 4 bajty (czerwony), `double` 8 bajtów (pomarańczowy), a `char` 1 bajt (fioletowy).
2. **Dobre rozmieszczenie z zastosowanym dopełnieniem**: ukazuje 1-bajtowy `bool` oraz 1-bajtowy `char` na początku pierwszego wiersza. Ponieważ 4-bajtowy `int` wymaga adresacji podzielnej przez 4, dodano 2 puste bajty dopełnienia (paddingu), a `int` rozpoczyna się od indeksu 4. Następnie w nowym wierszu znajduje się 4-bajtowy `float` oraz 8-bajtowy `double` w całości zajmujący trzeci wiersz.
3. **Złe rozmieszczenie**: ukazuje zmienne ułożone bezpośrednio po sobie bez dopełnienia. 4-bajtowy `int` zaczyna się natychmiast po 1-bajtowym `bool`, co powoduje, że 4-bajtowy `float` zostaje podzielony: dwa bajty znajdują się na końcu pierwszego wiersza, a dwa pozostałe na początku drugiego wiersza. Wymusza to na procesorze wykonanie dwóch odczytów.
4. **Wyrównanie optymalne**: prezentuje optymalizację struktury danych. Największa zmienna (8-bajtowy `double`) zajmuje w całości pierwszy wiersz. Drugi wiersz w pełni wypełniają 4-bajtowy `int` oraz 4-bajtowy `float`. Zmienne 1-bajtowe (`bool` i `char`) zostały zgrupowane razem w trzecim wierszu, eliminując potrzebę pustego dopełnienia.

---

## ⚙️ Kompilator i Interpreter: Weryfikacja Typu

Języki programowania różnią się sposobem zarządzania pamięcią dla danych.

- **Języki statycznie typowane (C++, C#, Java):** Typ zmiennej musisz zadeklarować bezpośrednio w kodzie. Przed uruchomieniem programu **kompilator** analizuje strukturę kodu i precyzyjnie planuje układ danych (nie rezerwuje fizycznego RAM-u, lecz określa, ile bajtów będzie na co potrzebne). Gdy deklarujesz `int wiek = 18;`, kompilator rezerwuje dla tej zmiennej dokładnie $4\text{ bajty}$ w strukturze programu. Fizyczną pamięć przydzieli dopiero **system operacyjny** w momencie uruchomienia aplikacji. Ponieważ typ i rozmiar są z góry zablokowane, próba przypisania tekstu do liczby wywoła błąd kompilacji.
- **Języki dynamicznie typowane (JavaScript, PHP, Python):** Nie wymagają deklarowania typów. **Interpreter** analizuje kod linijka po linijce w trakcie działania programu. Dopiero w momencie wykonania instrukcji `wiek = 18` interpreter prosi system operacyjny o przydzielenie pamięci na liczbę. Zapisanie w kolejnym kroku `wiek = "osiemnaście"` sprawia, że interpreter alokuje nowy obszar pamięci na tekst i przepina tam etykietę zmiennej. Nieużywana komórka zostanie później usunięta przez automatyczny mechanizm oczyszczania pamięci (ang. *Garbage Collector*).

![Schemat porównujący cykl życia kodu w językach kompilowanych i interpretowanych.](/public/courses/logika-i-algorytmy-pseudokod/Images/kompilator-vs-Interpreter.png)

:::diagram
Diagram zestawia architekturę działania języków kompilowanych (np. C++) oraz interpretowanych (np. JS, PHP, Python). Zobrazowano na nim, jak kod źródłowy przekształca się w proces uruchomiony w pamięci w obu środowiskach.
:::

**Opis strukturalny diagramu**

1. **Języki kompilowane np.: C++ (górna sekcja)**: proces składa się z dwóch etapów. Plik źródłowy poddawany jest kompilacji przez kompilator, który generuje plik binarny zapisywany na dysku. Uruchomienie tego pliku tworzy proces w pamięci.
2. **Języki interpretowane np.: JS, PHP, Python (dolna sekcja)**: proces jest bezpośredni. Plik źródłowy podlega interpretacji w locie. Interpreter czyta kod i wykonuje instrukcje bezpośrednio w pamięci RAM bez tworzenia pliku binarnego.

> [!WARNING]
> W językach takich jak PHP czy JavaScript typowanie jest dynamiczne oraz słabe. Oznacza to, że interpreter potrafi automatycznie konwertować typy (np. dodać liczbę do tekstu).
> Użycie dyrektyw `use strict;` w JavaScript lub `declare(strict_types=1);` w PHP ogranicza te automatyczne konwersje, lecz nie zmienia tych języków w statycznie typowane. Typy są nadal sprawdzane w trakcie działania programu.

---

## 🏗️ Prymitywne Typy Danych

Prymitywne typy danych są wbudowane bezpośrednio w architekturę sprzętową procesorów i stanowią fundament zapisu informacji.

### 🔢 1. Liczby Całkowite (Integer)

Przeznaczone są do precyzyjnych obliczeń arytmetycznych bez ułamków, na przykład `0`, `5`, `-42`.
* **Zastosowanie:** Stosowane jako liczniki w pętlach, indeksy tablic oraz do zliczania obiektów.

### 🎚️ 2. Liczby Zmiennoprzecinkowe (Float / Double)

Reprezentują liczby ułamkowe, na przykład `3.14`, `-0.5`, `100.0`. W informatyce ułamki zawsze oddzielamy kropką.
* **Zastosowanie:** Obliczenia fizyczne, wektory współrzędnych, systemy finansowe. Reprezentacja zmiennoprzecinkowa ma ograniczoną precyzję (np. operacja $0.1 + 0.2$ w wielu językach daje wynik `0.30000000000000004`).

### ⚖️ 3. Wartości Logiczne (Boolean)

Najmniejsza jednostka informacji. Przyjmuje wyłącznie jeden z dwóch stanów: prawda (`true` / `1`) lub fałsz (`false` / `0`).

> [!IMPORTANT]
> **Konwersje typów w warunkach logicznych**
> Przekazywanie wartości liczbowych lub pustych jako warunek instrukcji warunkowej `if` zależy od reguł wybranego języka programowania.
> 
> 1. <b>Języki o ścisłym typowaniu (Java, C#):</b>
>    Nie obsługują pojęcia wartości niejawnie prawdziwych lub fałszywych (ang. *truthy/falsy values*). Warunek instrukcji `if` musi być wyrażeniem logicznym. Wprowadzenie instrukcji `if (0)` wywoła błąd kompilacji.
> 
> 2. <b>Język C++:</b>
>    Pozwala na automatyczną konwersję na typ logiczny dla typów liczbowych (wartość `0` jest traktowana jako fałsz, inne jako prawda) oraz wskaźników (brak adresu `nullptr` to fałsz). Wprowadzenie pustego tekstu `if (std::string(""))` wywoła błąd kompilacji.
> 
> 3. <b>Języki o dynamicznym typowaniu (JavaScript, Python, PHP):</b>
>    Interpretery konwertują wartości na fałsz (**_Falsy_**) lub prawdę (**Truthy**) podczas wykonywania programu. Różnice między językami przedstawia poniższa tabela:
> 
> | Wartość w warunku `if` | JavaScript (JS) | Python | PHP | C++ (Niejawna konwersja) | Java / C# |
> | :--- | :--- | :--- | :--- | :--- | :--- |
> | _**`0`**_ (Liczba zero) | ❌ **_Falsy_** | ❌ **_Falsy_** | ❌ **_Falsy_** | ❌ **_Falsy_** | *Błąd (Wymaga bool)* |
> | _**`""`**_ (Pusty tekst) | ❌ **_Falsy_** | ❌ **_Falsy_** | ❌ **_Falsy_** | *Błąd (Wymaga bool)* | *Błąd (Wymaga bool)* |
> | _**`"0"`**_ (Tekst z cyfrą zero) | ✅ **Truthy** | ✅ **Truthy** | ❌ **_Falsy_** *(Quirk PHP!)* | *Błąd (Wymaga bool)* | *Błąd (Wymaga bool)* |
> | _**`null` / `None` / `nullptr`**_ | ❌ **_Falsy_** | ❌ **_Falsy_** | ❌ **_Falsy_** | ❌ **_Falsy_** | *Błąd (Wymaga bool)* |
> | _**`NaN`**_ (Not a Number) | ❌ **_Falsy_** | ✅ **Truthy** | ✅ **Truthy** | ✅ **Truthy** | *Błąd (Wymaga bool)* |
> | _**`[]`**_ (Pusta tablica) | ✅ **Truthy** | ❌ **_Falsy_** | ❌ **_Falsy_** | *Błąd (Wymaga bool)* | *Błąd (Wymaga bool)* |
> | _**`{}`**_ (Pusty obiekt) | ✅ **Truthy** | ❌ **_Falsy_** | **✅ Truthy** *(stdClass)* | *Błąd (Wymaga bool)* | *Błąd (Wymaga bool)* |
> | _**`undefined`**_ (Brak wartości) | ❌ **_Falsy_** | (Brak typu) | (Brak typu) | (Brak typu) | (Brak typu) |
> 
> > [!CAUTION]
> > **Różnice interpretacji:**
> > * **JavaScript (JS):** Pusta tablica `[]` oraz pusty obiekt `{}` są traktowane jako prawda (**Truthy**).
> > * **Python:** Pusta lista `[]` oraz pusty słownik `{}` są traktowane jako fałsz (**Falsy**).
> > * **PHP (ciąg tekstowy `"0"`):** Ciąg znaków zawierający pojedyncze zero jest fałszem (**Falsy**). Wynika to z obsługi danych z formularzy HTML.
> > * **PHP (klasa `stdClass`):** Pusty obiekt klasy `stdClass` jest zawsze traktowany jako prawda (**Truthy**), mimo że pusta tablica `[]` jest fałszem.

### 🔤 4. Łańcuchy Znaków (String)

Tekst reprezentuje sekwencję liter, cyfr lub symboli. Łańcuch znaków zapisujemy w cudzysłowach, na przykład `"Ala ma kota"`, `"5"`. Wartość `"5"` nie jest liczbą, lecz znakiem i nie można na niej wykonywać operacji arytmetycznych.

W ujęciu technicznym string jest tablicą znaków `Char[]`. Każdy znak jest reprezentowany jako liczba całkowita zgodna z wybranym standardem kodowania (np. ASCII lub UTF-8). Oznacza to, że:
- Każdy znak posiada przypisany numer kodowy.
- Każdy znak zajmuje komórkę pamięci o stałym rozmiarze.
- Cały tekst jest przechowywany jako ciąg bajtów leżących obok siebie w pamięci RAM.

Przykład:  
W napisie `"Hasło"` litera `H` znajduje się w pierwszej komórce tablicy, `a` w drugiej, `s` w trzeciej itd.  
Każdy z tych znaków jest fizycznie reprezentowany jako liczba (np. `H = 72` w ASCII), a cały `String` jest liniową strukturą pamięci.

---

<data-gate>
  <data-connection-matcher title="Dopasuj konkretną wartość do jej typu">
    <div class="cmw-item" data-left="`5`" data-right="liczba całkowita (`Integer`)"></div>
    <div class="cmw-item" data-left='`"100"`' data-right="tablica znaków (`String`)"></div>
    <div class="cmw-item" data-left="`True`" data-right="wartość logiczna (`Boolean`)"></div>
    <div class="cmw-item" data-left="`3.14`" data-right="liczba zmiennoprzecinkowa (`Float`)"></div>
  </data-connection-matcher>
</data-gate>

---

## 🔗 Mutacje: Konkatenacja i Sklejanie Typów

Słabe typowanie pozwala na automatyczne mieszanie typów danych w obliczeniach. Częstym źródłem błędów jest próba łączenia liczby z tekstem.

Zjawisko to nosi nazwę **konkatenacji**. Przy poleceniu `5 + "5"` kompilator lub interpreter nie wykona dodawania arytmetycznego. Przekształci on liczbę w tekst i połączy oba ciągi, generując napis `"55"`.

Konkatenacja to strukturalne wiązanie tablic znaków. Różne staki technologiczne posiadają do tego różne operatory:
* W JS, C++, Java oraz Pseudokodzie jest to `+`.
* W PHP rolę sklejania pełni kropka `.`, a operator `+` wymusza twardą matematykę, przez co próba dodania `"5" + 5` w PHP zadziała jak dodawanie.
> [!CAUTION]
> Konkatenacja kropką w PHP musi być oddzielona spacją gdy występuje bezpośrednio po cyfrze, aby interpreter nie pomylił jej z kropką dziesiętną. Zapis `4.5` oznacza liczbę ($4.5$), natomiast zapis `4 . 5` generuje tekst `"45"`.

<data-gate>
<data-pseudocode-runner>
<pre>
a = "5"
b = 5
czyGotowy = PRAWDA

WYPISZ "Obliczanie a + b (String + Number):"
c = a + b
WYPISZ "To klasyczna Konkatenacja! Wynik:"
WYPISZ c

WYPISZ "---"

WYPISZ "Obliczanie b + b + 0.4 (Number + Number + Float):"
d = b + b + 0.4
WYPISZ "Twarda arytmetyka! Wynik:"
WYPISZ d
</pre>
</data-pseudocode-runner>
</data-gate>

Kontrola nad typami danych jest kluczowa dla stabilności oprogramowania. Niewłaściwa konwersja typów w trakcie działania programu prowadzi do błędów logicznych.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **RAM to fizyczny nośnik:** Zmienne są przechowywane w komórkach pamięci składających się z kondensatorów. Typ danych informuje procesor, jak interpretować te bity.
- **Kompilator a interpreter:** Języki statyczne wymagają sztywnej deklaracji przed uruchomieniem. Języki dynamiczne dopasowują typy w locie.
- **Wartości logiczne i rzutowanie:** Zero, pusty tekst oraz brak wartości mogą być rzutowane na fałsz (Falsy). Zasady te różnią się między językami (np. quirk z `"0"` w PHP).
- **Struktura tekstu:** String jest tablicą znaków `Char[]`, w której każda litera odpowiada konkretnemu indeksowi i numerowi w standardzie kodowania.
- **Konkatenacja:** Łączenie tekstu z liczbą powoduje automatyczną konwersję na typ tekstowy. Należy kontrolować ten proces w zależności od stosowanego języka.
