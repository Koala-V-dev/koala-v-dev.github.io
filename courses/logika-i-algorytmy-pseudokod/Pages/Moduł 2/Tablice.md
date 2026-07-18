# Tablice: Najważniejsza struktura w programowaniu

Znasz już pojęcie zmiennej jako pojedynczej komórki w pamięci RAM. Co zrobisz, gdy musisz przechować oceny $30$ uczniów ze sprawdzianu? Tworzenie zmiennych od `ocena1` do `ocena30` jest nieefektywne. Sytuacja komplikuje się jeszcze bardziej przy tysiącu uczniów.

Do zarządzania dużymi zbiorami danych służą **tablice** (ang. *Arrays*). Koncepcja ta wywodzi się bezpośrednio z matematycznego pojęcia ciągu: $x_1, x_2, x_3...$. W kodzie programistycznym dolne indeksy zapisujemy w nawiasach kwadratowych, na przykład `x[0]` lub `x[1]`.

---

## 🗄️ Budowa Tablicy: Koncepcja i Wydajność

Wyobraź sobie tablicę jako blok szuflad ułożonych obok siebie w pamięci RAM. Cały segment otrzymuje jedną wspólną nazwę, na przykład `T`. Do konkretnej szuflady odwołujemy się za pomocą liczby całkowitej. Liczbę tę nazywamy **indeksem**.

> [!IMPORTANT]
> **Wydajność tablic w pamięci** (*Cache Locality*)
> Wiadomo, że tablica ułatwia zapis kodu. Czy przekłada się to jednak na rzeczywistą wydajność?
> 
> Tak. Wynika to z faktu, że wszystkie elementy tablicy leżą w pamięci fizycznie obok siebie. Procesor po odczytaniu pierwszego z nich automatycznie przesyła do szybkiej pamięci podręcznej kolejne jej elementy. Mechanizm ten nazywamy **lokalnością pamięci podręcznej** (*Cache Locality*). Sprawia on, że iterowanie po tablicach jest jedną z najszybszych operacji w komputerze.

> [!NOTE]
> **Poziomy pamięci podręcznej** (_**Cache CPU**_)
> Pamięć podręczna procesora dzieli się na trzy główne poziomy. Każdy kolejny poziom jest większy, ale ma dłuższy czas dostępu.
> 
> - _**L1 Cache**_: Najmniejsza i najszybsza pamięć wbudowana bezpośrednio w każdy rdzeń.
> - _**L2 Cache**_: Większa pamięć pośrednia, przypisana do pojedynczych rdzeni lub ich grup.
> - _**L3 Cache**_: Największa pamięć współdzielona przez wszystkie rdzenie procesora.
> 
> Zobacz porównanie rzeczywistych rozmiarów pamięci podręcznej dla wybranych procesorów:
> 
> | Poziom Cache | Intel Core i7-12700F | AMD Ryzen 7 7800X3D (3D V-Cache) | Apple M2 (ARM SoC) |
> | :--- | :--- | :--- | :--- |
> | _**L1 Cache**_ | *$80\text{ KB}$* (rdzeń P) / *$96\text{ KB}$* (rdzeń E) | *$64\text{ KB}$* na rdzeń (łącznie *$512\text{ KB}$*) | *$320\text{ KB}$* (rdzeń P) / *$192\text{ KB}$* (rdzeń E) |
> | _**L2 Cache**_ | *$10\text{ MB}$* (rdzenie P) + *$2\text{ MB}$* (rdzenie E) | *$1\text{ MB}$* na rdzeń (łącznie *$8\text{ MB}$*) | *$16\text{ MB}$* (rdzenie P) + *$4\text{ MB}$* (rdzenie E) |
> | _**L3 Cache**_ | *$25\text{ MB}$* (współdzielona) | *$96\text{ MB}$* (współdzielona) | *$8\text{ MB}$* (System Level Cache) |

<data-gate>
<data-pseudocode-runner>
<pre>
WYPISZ "Tworzymy tablicę trzech elementów:"
T = [10, 20, 30]

WYPISZ "Zmieniamy element o indeksie 1:"
T[1] = 99

WYPISZ "Teraz w indeksie 1 znajduje się:"
WYPISZ T[1]
</pre>
</data-pseudocode-runner>
</data-gate>

Zwróć uwagę na panel RAM! Nasza tablica `T` składa się z elementów: `[10, 99, 30]`. Dlaczego podmiana elementu `T[1]` podmieniła w tablicy *środkową liczbę* ($20$), a nie *pierwszą* ($10$)?

---

## 🧠 Indeksowanie od Zera: Rola Offsetu

W polskim programie szkolnym pierwszy element tablicy często otrzymuje indeks 1. W tym kursie stosujemy indeksowanie od zera. Pozwoli to uniknąć popularnych błędów przesunięcia o jeden (ang. *off-by-one error*) podczas nauki rzeczywistych języków programowania.

W językach takich jak C++, PHP, Java czy Python pierwszy element tablicy zawsze posiada indeks `0`.

Wynika to z architektury sprzętowej komputera:
* **Indeks jako offset:** Indeks określa przesunięcie (ang. *offset*) w pamięci fizycznej.
* **Adres początkowy:** Pierwszy element leży dokładnie na początku zarezerwowanego obszaru. Jego przesunięcie względem adresu startowego wynosi `0`.
* **Kolejne komórki:** Drugi element leży o jeden blok pamięci dalej, co daje przesunięcie równe `1`.

Z tego powodu pierwszy element tablicy `T` adresujemy jako `T[0]`.

> [!NOTE]
> **Uproszczenie obliczeń matematycznych**
> Indeksowanie od zera ułatwia wykonywanie wielu operacji matematycznych. Przykładem jest zapętlanie indeksów za pomocą operatora modulo `%`. Pozwala to na łatwe przechodzenie po elementach w nieskończonej pętli. Indeksowanie od zera upraszcza także przeliczanie współrzędnych dwuwymiarowych na jednowymiarowy ciąg pamięci za pomocą wzoru `y * szerokość + x`. Liczenie od 1 wymagałoby dodawania sztucznych przesunięć `- 1`.

---

## 🏗️ Zarządzanie Pamięcią: Klasyfikacja Tablic

Współczesne języki programowania różnią się podejściem do deklarowania rozmiaru oraz typu elementów w tablicy.

### 📊 Rozmiar: Tablice Statyczne i Dynamiczne

- **Tablice statyczne (C++, C#, Java):** Wymagają określenia stałego rozmiaru podczas kompilacji, na przykład `int T[10]`. Rozmiar ten nie może ulec zmianie podczas działania programu. System operacyjny rezerwuje w pamięci RAM ciągły obszar na określoną liczbę elementów. Dodanie kolejnych elementów wymaga utworzenia nowej, większej tablicy i skopiowania dotychczasowych danych.
- **Tablice dynamiczne (Python, PHP, JavaScript):** Potrafią automatycznie zmieniać swój rozmiar w trakcie działania programu. Nowe elementy dodaje się za pomocą dedykowanych instrukcji. Zmiana rozmiaru odbywa się automatycznie w pamięci. Jest to rozwiązanie bardzo wygodne, lecz z reguły wolniejsze od tablic statycznych.

### 🔒 Bezpieczeństwo: Typowanie Elementów

W językach silnie typowanych wszystkie elementy tablicy muszą mieć ten sam typ. Tablica typu `int[]` przechowuje wyłącznie liczby całkowite i nie pozwoli na zapisanie tekstu. Języki o dynamicznym typowaniu pozwalają na przechowywanie różnych typów danych w jednej tablicy, na przykład `T = [15, "Słowo", true]`. Taka praktyka utrudnia jednak późniejszą analizę kodu i sprzyja powstawaniu błędów.

---

## 🔄 Odczyt Danych: Iteracja po Tablicy

Indeksy tablic są kolejnymi liczbami całkowitymi. Dzięki temu struktury te można efektywnie przetwarzać za pomocą pętli. W pętli stosujemy zmienną sterującą `i` jako indeks. Rozmiar tablicy odczytujemy za pomocą funkcji `DŁUGOŚĆ(T)`.

<data-gate>
<data-pseudocode-runner>
<pre>
Ceny = [100, 50, 20, 10]
Suma = 0

rozmiar = DŁUGOŚĆ(Ceny)
DLA i OD 0 DO rozmiar - 1
    Suma = Suma + Ceny[i]
KONIEC DLA

WYPISZ "Łączny koszt wynosi:"
WYPISZ Suma
</pre>
</data-pseudocode-runner>
</data-gate>
*(Przeanalizuj wykonanie programu krok po kroku. Zwróć uwagę, dlaczego pętla wykonuje się do wartości `rozmiar - 1`. Pierwszy element to `Ceny[0]`, a czwarty to `Ceny[3]`.)*

### 🔁 Pętla do Zadań Specjalnych: Foreach

Klasyczna pętla `FOR` wymaga ręcznego kontrolowania indeksu za pomocą zmiennej sterującej. Często jednak nie interesuje nas sam numer indeksu, a jedynie wykonanie operacji na każdym elemencie po kolei.

W tym celu w językach programowania wprowadzono uproszczoną instrukcję **Foreach**. Przechodzi ona automatycznie przez całą strukturę. Chroni to programistę przed popełnieniem błędu wyjścia poza zakres tablicy.

Oto jak wygląda porównanie tej logiki w różnych językach:

**W języku C++ (pętla zakresowa):**
```cpp
int ceny[] = {100, 50, 20, 10};
for (int cena : ceny) {
    std::cout << cena << std::endl;
}
```

**W języku PHP (konstrukcja `foreach`):**
```php
$ceny = [100, 50, 20, 10];
foreach ($ceny as $cena) {
    echo $cena;
}
```

**W języku JavaScript (pętla `for...of` oraz metoda `forEach`):**
JavaScript pozwala na użycie tradycyjnej pętli warunkowej lub metody wbudowanej. Druga opcja pozwala dodatkowo na łatwy dostęp do indeksu elementu.
```javascript
let ceny = [100, 50, 20, 10];

// Pętla for...of:
for (let cena of ceny) {
    console.log(cena);
}

// Metoda forEach:
ceny.forEach((cena, indeks) => {
    console.log("Wartość: " + cena + " na pozycji: " + indeks);
});
```

Taki zapis zwiększa czytelność kodu. Jeśli jednak potrzebujesz pełnej kontroli nad krokiem iteracji (np. odczytywania co drugiej wartości), klasyczny `FOR` z licznikiem pozostaje niezastąpiony.

---

## 🧊 Struktury Wielowymiarowe: Macierze

Dotychczas omawialiśmy tablice jednowymiarowe. Reprezentują one pojedynczą linię danych. Wewnątrz komórek tablicy możemy jednak przechowywać kolejne tablice. W ten sposób powstają struktury wielowymiarowe. Znajdują one zastosowanie w grafice komputerowej, analizie danych oraz przetwarzaniu obrazów.

Możemy je sklasyfikować następująco:

1. **Tablice jednowymiarowe (1D):** Reprezentują pojedynczy wektor danych. Dostęp do elementu uzyskujemy za pomocą jednego indeksu, np. `T[x]`.
2. **Tablice dwuwymiarowe (2D):** Reprezentują siatkę danych (macierz). Dostęp wymaga podania rzędu oraz kolumny w postaci dwóch indeksów, np. `T[y][x]`. Przykładem takiej struktury jest obraz cyfrowy, gdzie komórki odpowiadają pikselom.
3. **Tablice trójwymiarowe (3D):** Reprezentują przestrzeń. Wymagają podania trzech współrzędnych, np. `T[z][y][x]`. Używa się ich do przechowywania modeli przestrzennych lub danych medycznych.

Możliwe jest tworzenie tablic o jeszcze większej liczbie wymiarów, na przykład tablic 4D reprezentujących dane przestrzenne zmieniające się w czasie.

### ⚙️ Zastosowanie Praktyczne: Operacje na Macierzach

Macierze są strukturami danych, na których wykonuje się operacje matematyczne. Do najczęściej stosowanych należą:

1. **Mnożenie przez skalar:** Polega na przemnożeniu każdego elementu macierzy przez stałą liczbę. Operację tę stosuje się np. przy rozjaśnianiu zdjęć cyfrowych, gdzie wartość każdego piksela jest zwiększana o określony współczynnik.
2. **Dodawanie macierzy:** Wykonuje się je na macierzach o takich samych wymiarach poprzez dodanie wartości na odpowiadających pozycjach. Służy np. do nakładania filtrów graficznych na obrazy.
3. **Mnożenie dwóch macierzy:** Przemnożenie dużego zbioru punktów (np. trójwymiarowego obiektu w grze) przez macierz transformacji pozwala na jego obrót lub skalowanie w przestrzeni. Procesory kart graficznych (GPU) są zoptymalizowane pod kątem wykonywania milionów takich operacji jednocześnie. Ta sama matematyka stanowi podstawę działania sieci neuronowych i sztucznej inteligencji.

<details>
<summary><b>Dla dociekliwych: Jak te operacje wyglądają w praktyce? (To prostsze niż myślisz!)</b></summary>

Matematyka na macierzach jest niezwykle intuicyjna. Oto proste przykłady dla macierzy dwuwymiarowych ($2 \times 2$):

<b>1. Mnożenie przez skalar (stałą liczbę)</b>
Mnożymy każdy element macierzy z osobna przez naszą liczbę (np. przez $2$):

$$2 \cdot \begin{bmatrix} \textcolor{#ff0001}{1} & \textcolor{#ff0002}{2} \\\\ \textcolor{#ff0003}{3} & \textcolor{#ff0004}{4} \end{bmatrix} = \begin{bmatrix} 2 \cdot \textcolor{#ff0001}{1} & 2 \cdot \textcolor{#ff0002}{2} \\\\ 2 \cdot \textcolor{#ff0003}{3} & 2 \cdot \textcolor{#ff0004}{4} \end{bmatrix} = \begin{bmatrix} \textcolor{#ff0001}{2} & \textcolor{#ff0002}{4} \\\\ \textcolor{#ff0003}{6} & \textcolor{#ff0004}{8} \end{bmatrix}$$

<b>2. Dodawanie macierzy</b>
Dodajemy do siebie liczby, które leżą na dokładnie tych samych pozycjach:

$$\begin{bmatrix} \textcolor{#ff0001}{1} & \textcolor{#ff0002}{2} \\\\ \textcolor{#ff0003}{3} & \textcolor{#ff0004}{4} \end{bmatrix} + \begin{bmatrix} \textcolor{#ff0001}{5} & \textcolor{#ff0002}{6} \\\\ \textcolor{#ff0003}{7} & \textcolor{#ff0004}{8} \end{bmatrix} = \begin{bmatrix} \textcolor{#ff0001}{1}+\textcolor{#ff0001}{5} & \textcolor{#ff0002}{2}+\textcolor{#ff0002}{6} \\\\ \textcolor{#ff0003}{3}+\textcolor{#ff0003}{7} & \textcolor{#ff0004}{4}+\textcolor{#ff0004}{8} \end{bmatrix} = \begin{bmatrix} \textcolor{#ff0001}{6} & \textcolor{#ff0002}{8} \\\\ \textcolor{#ff0003}{10} & \textcolor{#ff0004}{12} \end{bmatrix}$$

<b>3. Mnożenie dwóch macierzy</b>
Tutaj stosujemy zasadę <i>„wiersz razy kolumna”</i>. Aby obliczyć wartość w nowej macierzy, mnożymy elementy z wiersza pierwszej macierzy przez elementy z kolumny drugiej macierzy i dodajemy wyniki:

$$\begin{bmatrix} \textcolor{#ff0001}{1} & \textcolor{#ff0001}{2} \\\\ \textcolor{#ff0003}{3} & \textcolor{#ff0003}{4} \end{bmatrix} \cdot \begin{bmatrix} \textcolor{#ff0002}{5} & \textcolor{#ff0004}{6} \\\\ \textcolor{#ff0002}{7} & \textcolor{#ff0004}{8} \end{bmatrix} = \begin{bmatrix} (\textcolor{#ff0001}{1} \cdot \textcolor{#ff0002}{5} + \textcolor{#ff0001}{2} \cdot \textcolor{#ff0002}{7}) & (\textcolor{#ff0001}{1} \cdot \textcolor{#ff0004}{6} + \textcolor{#ff0001}{2} \cdot \textcolor{#ff0004}{8}) \\\\ (\textcolor{#ff0003}{3} \cdot \textcolor{#ff0002}{5} + \textcolor{#ff0003}{4} \cdot \textcolor{#ff0002}{7}) & (\textcolor{#ff0003}{3} \cdot \textcolor{#ff0004}{6} + \textcolor{#ff0003}{4} \cdot \textcolor{#ff0004}{8}) \end{bmatrix} = \begin{bmatrix} 19 & 22 \\\\ 43 & 50 \end{bmatrix}$$

Na przykład lewy górny róg ($19$) powstał z pomnożenia pierwszego wiersza $[\textcolor{#ff0001}{1}, \textcolor{#ff0001}{2}]$ pierwszej macierzy przez pierwszą kolumnę $[\textcolor{#ff0002}{5}, \textcolor{#ff0002}{7}]$ drugiej macierzy: 

$$\textcolor{#ff0001}{1} \cdot \textcolor{#ff0002}{5} + \textcolor{#ff0001}{2} \cdot \textcolor{#ff0002}{7} = 5 + 14 = 19$$

---
</details>

---

### 👑 Zaawansowane Struktury: Tablice Obiektów

W programowaniu obiektowym tablice mogą przechowywać złożone obiekty (np. postacie w grze, przyciski interfejsu, konta użytkowników) zamiast samych liczb czy pojedynczych tekstów. Rozwiązanie to nazywamy **tablicą obiektów**.

Pozwala to kontrolować całe grupy elementów jednym prostym algorytmem. Wyobraź sobie sytuację z gry komputerowej:

- **Wyzwalacz (Trigger):** Gracz wchodzi w obszar wykrywania *jednego* ze strażników należących do pięcioosobowego patrolu.
- **Pobranie obiektów:** Silnik gry natychmiast pobiera całą powiązaną grupę i zapisuje wszystkich pięciu strażników z tego patrolu w tablicy o nazwie `Przeciwnicy`.
- **Iteracja i rozkaz:** Za pomocą pętli przechodzimy kolejno po każdym strażniku z patrolu, wydając mu polecenie namierzenia oraz zaatakowania gracza: `Przeciwnicy[i].ZlokalizujGracza()` oraz `Przeciwnicy[i].Zaatakuj()`.

Dzięki tablicy obiektów nie musisz pisać osobnego kodu dla każdego z pięciu strażników. Cały patrol reaguje wspólnie i automatycznie.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Ciągły blok pamięci:** Tablica to struktura danych leżących bezpośrednio obok siebie w pamięci RAM. Zapewnia to mechanizm **Cache Locality** i gwarantuje wysoką wydajność obliczeń.
- **Statyczność i dynamika:** Tablice statyczne mają niezmienny rozmiar określony podczas kompilacji. Tablice dynamiczne potrafią automatycznie zwiększać swoją pojemność w trakcie działania programu.
- **Zasada indeksu zero:** Indeks reprezentuje przesunięcie (offset) względem początku tablicy. Pierwszy element ma indeks `T[0]`, a ostatni `T[DŁUGOŚĆ(T) - 1]`.
- **Sposoby iteracji:** Dane w tablicy odczytujemy sekwencyjnie za pomocą pętli `FOR` z indeksem lub uproszczonej pętli `FOREACH`.
- **Wielowymiarowość:** Przechowywanie tablic wewnątrz innych tablic pozwala tworzyć macierze 2D (obrazy) oraz przestrzenie 3D. Operacje matematyczne na macierzach stanowią podstawę grafiki komputerowej i uczenia maszynowego.
