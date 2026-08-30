# Macierze (tablice wielowymiarowe)

Znasz arytmetykę:
*a `+` b* to _**$a + b$**_
*a `-` b* to _**$a - b$**_
*a `*` b* to _**$a \times b$**_ lub _**$a \cdot b$**_
*a `/` b* to _**$a\div b$**_ 
*a `**` b* to _**$a^b$**_
*a `**`(1/b)* to _**$\sqrt[b]{a}$**_

Znasz już dużą Sigmę $\sum$ i duże Pi $\Pi$

$$\sum_{i=1}^{n} x_i = x_1 + x_2 + \dots + x_n $$
$$\prod_{i=1}^{n} x_i = x_1 \times x_2 \times \dots \times x_n $$



Znasz już tablice jednowymiarowe:
```php
$tab1D = [1, 2, 3, 4, 5];
```
To nic innego jak reprezentacja szeregu w matematyce:

$$ x_0=1, \quad x_1=2, \quad x_2=3, \quad x_3=4, \quad x_4=5 $$

Czas na macierze i tablice wielowymiarowe.

---

## 🔡 Macierze w matematyce

Macierz to prostokątna tablica liczb, symboli lub wyrażeń, rozmieszczonych w wierszach i kolumnach. Najprostszy przykład macierzy: 

$$\begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}$$

Możemy ją zapisać przy użyciu tablic:
```php
$tab2D = [
    [1, 2],
    [3, 4]
];
```

Spróbujmy ją wyświetlić na stronie.  
> Jaka struktura HTML pozwala na wyświetlanie tabelarycznych danych?

Na sam początek zapiszmy ręcznie kod html z danymi powyższej macierzy:

```html
<table>
    <tr>
        <td>1</td>
        <td>2</td>
    </tr>
    <tr>
        <td>3</td>
        <td>4</td>
    </tr>
</table>
```
Teraz zastanówmy się jak umieścić liczby z `$tab2D` w strukturę kodu HTML. Można to zrobić przy pomocy pętli `foreach`.

```php
$tab2D = [
    [1, 2],
    [3, 4]
];

echo "<table>";
foreach ($tab2D as $wiersz) {
    echo "<tr>";
    foreach ($wiersz as $kolumna) {
        echo "<td>" . $kolumna . "</td>";
    }
    echo "</tr>";
}
echo "</table>";
```

Lub przypisując ciało tabeli html jako string do zmiennej i wyświetlając dopiero w wskazanym miejscu co daje lepszą separację kodu php i html.

![Wizualizacja kodu](/public/courses/php/Images/macierz-w-tabeli-z-tablicy-2D.png)

---

## ↔️ Dodawanie wartości do macierzy

Uczyńmy teraz ten fragment kodu do wizualizacji macierzy jako funkcję:

```php
/**
 * Przyjmuje dwuwymiarową tablicę i zwraca kod html reprezentujący macierz.
 *
 * @param array $tablica2D
 * @return string Kod html w postaci ciągu znaków (`<tbody>`).
 */
function wizualizatorMacierzy(array $tablica2D): string
{
    $html = "<tbody>";
    foreach ($tablica2D as $wiersz) {
        $html .= "<tr>";
        foreach ($wiersz as $kolumna) {
            $html .= "<td>" . $kolumna . "</td>";
        }
        $html .= "</tr>";
    }
    $html .= "</tbody>";

    return $html;
}
```

Przygotujmy przestrzeń do wizualizacji dalszych działań na macierzach.
Potrzebujemy wrapera (może być to `div` z klasą *obliczenia*) i wstawimy do niego znaczniki tabeli oraz kodu php:

```html
<div class="obliczenia">
    <table>
        <?php echo wizualizatorMacierzy($macierzA) ?>
    </table>
    <span>+</span>
    <table>
        <?php echo wizualizatorMacierzy($macierzB) ?>
    </table>
    <span>=</span>
    <table>
        <?php echo wizualizatorMacierzy($macierzC) ?>
    </table>
</div>
```

```css
hr{
    margin: 40px 0;
}
.obliczenia {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    width: 400px;
}

.obliczenia table {
    border-left: 1px solid;
    border-right: 1px solid;
    padding: 0 2px 0 8px;
}

.obliczenia td {
    width: 20px;
    padding: 2px 5px;
}

span{
    width: 20px;
    text-align: center;
}
```

i dwie tablice:

```php
$macierzA = [
    [1, 2],
    [3, 4]
];
$macierzB = [
    [5, 6],
    [7, 8]
];
```

![](/public/courses/php/Images/macierz_dodawania.png)

Jak się dodaje macierze? Odpowiedź jest prosta, dodajemy odpowiednie elementy (o tych samych indeksach) do siebie:

$$\begin{bmatrix}\textcolor{#ff0001}{a_{11}} & \textcolor{#ff0002}{a_{12}} \\ \textcolor{#ff0003}{a_{21}} & \textcolor{#ff0004}{a_{22}}\end{bmatrix} + \begin{bmatrix}\textcolor{#ff0001}{b_{11}} & \textcolor{#ff0002}{b_{12}} \\ \textcolor{#ff0003}{b_{21}} & \textcolor{#ff0004}{b_{22}}\end{bmatrix} = \begin{bmatrix}\textcolor{#ff0001}{a_{11}+b_{11}} & \textcolor{#ff0002}{a_{12}+b_{12}} \\ \textcolor{#ff0003}{a_{21}+b_{21}} & \textcolor{#ff0004}{a_{22}+b_{22}}\end{bmatrix}$$

Teraz zróbmy to samo w php. Ponieważ w pętli foreach tworzymy referencje do elementów tablicy, musimy dodać indeksy w pętlach `$i =>` i `$j =>`.

Pierwsza pętla porusza się po wierszach (`$i`) czyli przechodzi po tablicach głównej tablicy.  
Druga pętla dla każdej iteracji zewnętrznej pętli wykonuje już operacje na tych zagnieżdżonych tablicach. Dajemy jej literkę *j* by nie nadpisywała wyższego iteratora.

Wtedy możemy się dokładnie odwołać do konkretnej pozycji w tablicy za pomocą `[]` i indeksów `i` i `j`.

```php
$macierzC = [];
foreach ($macierzA as $i => $wiersz) {
    foreach ($wiersz as $j => $kolumna) {
        $macierzC[$i][$j] = $kolumna + $macierzB[$i][$j];
    }
}
```

> 🌟 Wykonaj samodzielnie odejmowanie macierzy.

---

## ↗️ Skalowanie macierzy

Macierz pomnożona przez pojedynczą liczbę zwaną skalarem jest niczym innym jak pomnożeniem każdego elementu macierzy przez tę daną liczbę.


Przykład skalowania pięciokrotnego macierzy:

$$\begin{bmatrix} \textcolor{#ff0001}{a_{11}} & \textcolor{#ff0002}{a_{12}} \\\textcolor{#ff0003}{a_{21}} & \textcolor{#ff0004}{a_{22}}\end{bmatrix} \cdot 5 = \begin{bmatrix} \textcolor{#ff0001}{a_{11} \cdot 5} &\textcolor{#ff0002}{a_{12} \cdot 5} \\\textcolor{#ff0003}{a_{21} \cdot 5} &\textcolor{#ff0004}{a_{22} \cdot 5}\end{bmatrix}$$

Przy skalowaniu macierzy można wykorzystać dokładnie ten samo kod co przy dodawaniu z małą modyfikacją 

```php
$skalar = 5;
$macierzC = [];
foreach ($macierzA as $i => $wiersz) {
    foreach ($wiersz as $j => $kolumna) {
        $macierzC[$i][$j] = $kolumna * $skalar;
    }
}

```

## 🔃 Mnożenie macierzy przez macierz 

Skalar okazał się banalny, ale co gdy zastąpimy go inną macierzą?

By móc pomnożyć macierz przez macierz, liczba kolumn pierwszej macierzy musi być równa liczbie wierszy drugiej macierzy.

<data-matrix-multiply matrix-a="1,2;3,4" matrix-b="5,6;7,8"></data-matrix-multiply>


$$\begin{bmatrix}\textcolor{#ff0001}{a_{11}} & \textcolor{#ff0002}{a_{12}} \\\textcolor{#ff0003}{a_{21}} & \textcolor{#ff0004}{a_{22}}\end{bmatrix}\cdot\begin{bmatrix}\textcolor{#ff0001}{b_{11}} & \textcolor{#ff0002}{b_{12}} \\\textcolor{#ff0003}{b_{21}} & \textcolor{#ff0004}{b_{22}}\end{bmatrix}=\begin{bmatrix}\textcolor{#ff0001}{\textcolor{#ff0001}{a_{11}}\textcolor{#ff0001}{b_{11}} + \textcolor{#ff0002}{a_{12}}\textcolor{#ff0003}{b_{21}}} &\textcolor{#ff0002}{\textcolor{#ff0001}{a_{11}}\textcolor{#ff0002}{b_{12}} + \textcolor{#ff0002}{a_{12}}\textcolor{#ff0004}{b_{22}}} \\\textcolor{#ff0003}{\textcolor{#ff0003}{a_{21}}\textcolor{#ff0001}{b_{11}} + \textcolor{#ff0004}{a_{22}}\textcolor{#ff0003}{b_{21}}} &\textcolor{#ff0004}{\textcolor{#ff0003}{a_{21}}\textcolor{#ff0002}{b_{12}} + \textcolor{#ff0004}{a_{22}}\textcolor{#ff0004}{b_{22}}}\end{bmatrix}$$


Jak to oprogramować?  
Na pewno skoro są to macierze to musimy mić pętlę zagnieżdżoną w pętli.  
Różnica miedzy tym co pisaliśmy wcześniej czyli operacja przez pojedynczy skalar na każdej wartości lub arytmetyka wartości elementów dwóch tablic o tych samych pozycjach to za mało.

W powyższym widgecie aby uzyskać wynik $19$ musimy wziąć:
*Macierz A* i pomnożyć jej wartość z pozycji `A[0][0]` przez *macierz B* i wartość z pozycji `B[0][0]`. Następnie w tym samym kroku wziąć kolejną wartość `A[0][1]` i pomnożyć ją przez *macierz B* i wartość z pozycji `B[1][0]`. Sumując te wyniki otrzymujemy wartość pierwszego elementu *macierzy C*.

Patrzymy co jeszcze można obliczyć bez zmiany wiersza operacyjnego *macierzy A*.  
Jest to wartość $22$ w *macierzy C*.  
Pozycje z *macierzy A* się nie zmieniają dalej używamy  `A[0][0]` i  `A[0][1]`.  
Natomiast w *macierzy B* bierzemy kolejną kolumnę i wartości do operacji będą na pozycjach `B[1][0]` i `B[1][1]`.  

Dopiero gdy dokonamy wszelkich obliczeń powiązanych z pierwszym wierszem *macierzy A* możemy przejść do kolejnego.  

Wcześniejsze pozycje dla kolumn *macierzy B* się nie zmieniają i modyfikacji ulegają jedynie pozycje *macierzy A*, a reszta procesu się powtarza.

Pewnie już zauważyłeś że proces jest powtarzalny więc warto się posłużyć dla tego przypadku kolejną pętlą.

1. Pętla główna (zawiera wiersze macierzy)
2. Pierwsze zagnieżdżenie pętli (zawiera kolumny: elementy z danego wiersza)
3. Kolejne zagnieżdżenie pętli (wykonuje działania ilorazu i sumuje wyniki dla każdego elementu danej kolumny w wierszu)

Przygotujmy sobie podstawową strukturę do dalszego rozkminiania:

```php
function ilorazMacierzy(array $macierzA, array $macierzB) : array {
    $macierzC = [];
    foreach($macierzA as $i => $wiersz){
        foreach($wiersz as $j => $kolumna){
            
            for($k=0; $k <count($wiersz); $k++ ){


            }
        }
    }

    return $macierzC;
}
```
W powyższym kodzie, pierwsza pętla $i$ przechodzi przez wiersze *macierzy A*.  
Druga pętla $j$ przechodzi przez kolumny *macierzy B*.  
Potem mamy kolejną zagnieżdżoną pętlę która ma się wykonać tyle razy ile w wierszu jest wartości. 

---

Jakie dać referencje i gdzie użyć wartości `$i`, `$j`, `$k`? Najlepszą metodą jest metoda prób i błędów.

Zastanawiałem się dłuższą chwilę aż postanowiłem uruchomić painta i sobie to rozrysować:

![Mnożenie macierzy rozkminianie problematyki rysowaniem bazgrołów w paincie](/public/courses/php/Images/macierze-paint.png)

Do zagnieżdżonej trzeciej pętli wprowadziłem kod do wypisywania sobie wartości które będą mi potrzebne do obliczeń:

```php
echo "<pre>";
echo '$macierzA['.$x.']['.$x.']: ' . $macierzA[$x][$x] . "\n";
echo '$macierzB['.$x.']['.$x.']: ' . $macierzB[$x][$x] . "\n";
echo "</pre>";
```

Następnie podmieniałem `$x` na różne kombinacje `$i`, `$j` i `$k` szukając odpowiednich par które w widgecie są wykorzystane do mnożenia oraz pary par do sumowania.


Gdy udało mi się znaleźć odpowiednie umiejscowienie iteratorów w tablicach macierzy A i B to musiałem się zastanowić jak teraz te pary par zsumować.

![Wyszukiwanie odpowiednich pozycji](/public/courses/php/Images/macierze-wyszukiwanie-odpowiednich-pozycji.png)

---

Utworzyłem zmienną pomocniczą `$tempValue` i zainicjalizowałem jej wartość jako $0$. Umieszczając ją przed pętlą `for` a już w samej pętli `for` dodawałem do zmiennej `$tempValue` wyniki mnożenia kolejnych par. 
```php
$tempValue += $macierzA[$i][$k] * $macierzB[$k][$j];
```

By na koniec po pętli `for` umieścić wynik `$temp` w odpowiedniej pozycji macierzy C:

```php
$macierzC[$i][$j] = $tempValue;
```

Koniec końców udało mi się zrealizować postawiony cel mnożenia macierzy przez drugą macierz:

![Mnożenie macierzy przez macierz](/public/courses/php/Images/funkcja-ilorazu-dwóch-macierzy.png)

---

Jednak ten kod nie jest idealny. Twoim zadaniem bedzie poprawić go.
- Zmienna `$kolumna` jest zadeklarowana lecz nigdy nie używana. Zapisz tą pętlę bez potrzeby deklaracji zbędnej zmiennej np.: jako `for`.
- Czy aby na pewno jest tak bardzo potrzebna kolejna zmienna `$tempValue`? Ogranicz ilość deklaracji zmiennych. 
- Działa? To już nie potrzebujemy „diagnostycznych” instrukcji `echo`, więc je usuń.
- Dopisz brakującą dokumentację.

Cały powyższy kod do poprawki:

```php
function ilorazMacierzy(array $macierzA, array $macierzB): array
{
    $macierzC = [];
    foreach ($macierzA as $i => $wiersz) {
        foreach ($wiersz as $j => $kolumna) {

            $tempValue = 0;
            for ($k = 0; $k < count($wiersz); $k++) {

                echo "<pre>";
                echo '$macierzA[' . $i . '][' . $k . ']: ' . $macierzA[$i][$k] . "\n";
                echo '$macierzB[' . $k . '][' . $j . ']: ' . $macierzB[$k][$j] . "\n";
                echo "</pre>";
                $tempValue += $macierzA[$i][$k] * $macierzB[$k][$j];
            }
            $macierzC[$i][$j]=$tempValue;
        }
    }

    return $macierzC;
}
```