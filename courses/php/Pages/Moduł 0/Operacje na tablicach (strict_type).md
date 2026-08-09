# Operacje na tablicach

Tablice to podstawowa struktura danych w dowolnym języku programowania.

Zamiast pisać:
```php
$produkt_1 = "banan";
$produkt_2 = "jabłko";
$produkt_3 = "pomarańcza";
$produkt_4 = "truskawka";
$produkt_5 = "czereśnia";
```

Możemy stworzyć tablicę:
```php
$produkty = ["banan", "jabłko", "pomarańcza", "truskawka", "czereśnia"];
```
dodatkowo szybciej można wyświetlić grupę danych w tablicy:
```php
print_r($produkty);
```
Zamiast pisać:
```php
echo $produkt_1;
echo $produkt_2;
echo $produkt_3;
echo $produkt_4;
echo $produkt_5;
```

No i tyle wstępu.

## Wyświetlanie danych z tablicy

Jeżeli chcemy wyświetlić jeden element z tablicy, podajemy jego indeks (numer pozycji) w nawiasach kwadratowych.
```php
echo $produkty[0];
echo $produkty[1];
echo $produkty[2];
echo $produkty[3];
echo $produkty[4];
```

A dlaczego indeksy zaczynają się od $0$, a nie od $1$?

Tak naprawdę index to nic innego jak wartość biasu czyli informacja o ile komputer ma przesunąć się w tablicy względem startowego elementu by pobrać wartość z danej pozycji. 


|            |            |                |               |               |
| ---------- | ---------- | -------------- | ------------- | ------------- |
| bias = $0$ | bias = $1$ | bias = $2$     | bias = $3$    | bias = $4$    |
| `"banan"`  | `"jabłko"` | `"pomarańcza"` | `"truskawka"` | `"czereśnia"` |


## Suma wartości w tablicy $\Sigma$

Potrzebujemy tablicy z całkowicie losowymi liczbami np.:

```php
$liczby = [3, 420, 67, 69, 2137];
```

Wykonajmy na niej zsumowanie wartości czyli duża Sigma.  

```php
$wynik = $liczby[0] + $liczby[1] + $liczby[2] + $liczby[3] + $liczby[4];

echo $wynik;
```

Dla pięcioelementowej tablicy robi się to już niewygodne, a przy jej wzroście to... To lepiej nie mówić.  
Na szczęście istnieją pętle które pozwolą nam na wykonanie powtarzalnego kodu w elegancki sposób.

Podstawową pętlą jest `for`:
```php
for ($iterator_z_wartością_początkową; warunek_kontynuacji_pętli; $zmien_wartość_iteratora_po_każdej_iteracji){
    // ciało pętli
}
```
Stosując ją w naszym przykładzie otrzymamy:
```php
$liczby = [3, 420, 67, 69, 2137];
$wynik = 0;

for ($i = 0; $i < count($liczby); $i++){
    $wynik += $liczby[$i];
}

echo $wynik;
```

> W powyższym kodzie do poznania ilości elementów tablicy wykorzystano funkcję `count()`.


Przekształćmy teraz ten strukturalny kod na funkcję:


```php
function sigma($liczby){
    $wynik = 0;
    
    for ($i = 0; $i < count($liczby); $i++){
        $wynik += $liczby[$i];
    }
    return $wynik;
}
```

![suma-tablicy](/public/courses/php/Images/suma-tablicy.png)

## Dopieszczanie funkcji z ścisłym typowaniem

Na początku pliku umieść ten kod:
```php
<?php
declare(strict_types=1);
?>
```
Oznacza to, że PHP przestaje wykonywać **automatyczną konwersję (rzutowanie) typów** przy przekazywaniu argumentów do funkcji oraz zwracaniu wyników.

Domyślnie PHP używa tzw. słabego typowania (ang. *weak typing*). Jeśli przekazałbyś ciąg znaków `"5"` do funkcji oczekującej liczby `int` lub `float`, PHP automatycznie spróbowałoby przekonwertować ten tekst na liczbę.

Po włączeniu `declare(strict_types=1);`:
- **Ścisła kontrola typów**: Wywołania funkcji z pliku posiadającego tę deklarację wymagają przekazywania argumentów dokładnie takich typów, jakie zadeklarowano.
- **Wyjątek `TypeError`**: Przekazanie błędnego typu danych (np. tekstu `"100"` zamiast `float` lub `int`) wyrzuci błąd typu `TypeError`, zamiast niejawnie dokonywać konwersji.
- **Sprawdzanie typu zwracanego**: Zwracana przez funkcję wartość musi być zgodna z wybranym typem zwracanym (np. `: float`).

> 💡 **Warto wiedzieć:** Jedynym odstępstwem od reguły w trybie ścisłym jest to, że w miejscu gdzie funkcja oczekuje typu `float`, możesz przekazać liczbę typu `int` – PHP w tym wypadku bezpiecznie przekształci ją na `float`.

Dzięki temu unikamy trudno zauważalnych błędów związanych z cichym przekształcaniem danych i nasz kod staje się przewidywalny.

Nadszedł czas doinstalować kolejne dwa rozszerzenia:
- **PHP DocBlocker** od *Neil Brayfield*: Wspomaga w szybkim utworzeniu struktury PHPDoc po wpisaniu `/**` i kliknięciu <kbd>Enter</kbd>
- **PHP Intelephense** od *Intelephense*: Bardzo rozszerzone, ale na ten moment interesują nas funkcjonalności wyświetlania dokumentacji po najechaniu na funkcje oraz przechodzenie do definicji funkcji (<kbd>Ctrl</kbd> + kliknięcie na nazwę funkcji).

### Określanie typów argumentów i zwracanej wartości

Zadeklarowaliśmy że jawnie bedziemy typować i pisać dokumentację funkcji, więc musimy poprawić naszą funkcję sigma: 

```php
function sigma(array $liczby): float
```
Dopisaliśmy dwie frazy:
- `array`: Oznacza że funkcja przyjmuje jeden argument jakim jest tablica.
- `: float`: Oznacza że funkcja zwróci wartość zmiennoprzecinkową.

Skoro zwracana wartość ma być typu float, to warto by było również zmienna $wynik miała taką wartość. Zatem musimy zainicjować jej wartość jako `0.0` zamiast `0`:

```php
 $wynik = 0.0;
```

### Dokumentacja funkcji

Teraz dzieki takiej strukturze możemy przejść do linii przed definicją funkcji i wpisać `/**` + <kbd>Enter</kbd>.   
Otrzymamy szkielet dokumentacji:

```php
/**
 * Undocumented function
 *
 * @param array $liczby
 * @return float
 */
function sigma(array $liczby): float
{
     $wynik = 0.0;
    
    for ($i = 0; $i < count($liczby); $i++){
        $wynik += $liczby[$i];
    }
    return $wynik;
}
```

- `Undocumented function`: Ten fragment zmieniasz na krótki opis przeznaczenia funkcji.
- `@param array $liczby`: To informacja że ta funkcja przyjmuje jeden parametr który jest tablicą.  
- `@return float`: To informacja o typie zwracanej wartości przez funkcję. 

Ciekawe przypadki użycia są z parametrami `array` i `mixed`, jeżeli przewidujesz różne typy danych to umieszczasz je pomiędzy `<` i `>` oraz rozdzielasz `|` np. `<int|string|float|bool>`


![php-vscode-dokumentacja-i-nowe-rozszerzenia](/public/courses/php/Images/php-vscode-dokumentacja-i-nowe-rozszerzenia.png)

## Iloczyn wartości w tablicy $\Pi$
Wracamy do pisania tym razem pięknych i czytelnych funkcji, które zadziałają w trybie ścisłym. 


Obliczymy teraz iloczyn wartości w tablicy czyli duże Pi.

```php
/**
 * Zwraca iloczyn wszystkich elementów tablicy liczb.
 *
 * @param array<int|float> $liczby Tablica liczb (całkowitych lub zmiennoprzecinkowych).
 * @return float Zwraca iloczyn elementów tablicy. Dla pustej tablicy zwraca 1.
 */
function iloczynPi(array $liczby): float
{
    $wynik = 1.0;
    
    foreach ($liczby as $liczba) {
        $wynik *= $liczba;
    }
    
    return $wynik;
}

$testLiczby = [2, 3, 5];
$wynik = iloczynPi($testLiczby);

echo $wynik; // Wyświetli: 30
```

Ta funkcja trochę różni się od poprzedniej ponieważ:
- Zadeklarowana zmienna ma zainicjalizowaną wartość `1.0`, a nie `0.0`.
- Iteracja po elementach jest za pomocą pętli `foreach`.

`foreach` to specjalna instrukcja iterowania po elementach kolekcji - najczęściej tablic.  
Składnia jej wygląda tak: `foreach ($kolekcja as $element)`.

> [!NOTE]
> Obie implementacje funkcji sigma i iloczynPi realizują zadanie które już dawno w php stało się natywne i polegają na wbudowanych funkcjach _**`array_sum()`**_ oraz _**`array_product()`**_.
> ![](/public/courses/php/Images/natywne_arry_sum_and_product.png)

## Odwracanie kolejności elementów w tablicy

Wracając do pierwszej tablicy owoców, przekrztałcimy ją tak by jej elementy były w odwrotnej kolejności.

Z:

|           |            |                |               |               |
| --------- | ---------- | -------------- | ------------- | ------------- |
| `"banan"` | `"jabłko"` | `"pomarańcza"` | `"truskawka"` | `"czereśnia"` |

Chcemy uzyskać:

|               |               |                |            |           |
| ------------- | ------------- | -------------- | ---------- | --------- |
| `"czereśnia"` | `"truskawka"` | `"pomarańcza"` | `"jabłko"` | `"banan"` |


Posłużymy się do tego starą dobrą pętlą `for`. 
- Jej wartością startową iteratora będzie *ilość elementów $-1$*.
- Warunkiem kontynuacji pętli będzie wartość iteratora większa bądź równa $0$.
- Wartość iteratora będzie zmniejszana o $1$.

Posłużymy się zmienną pomocniczą typu tablica, będziemy do niej dodawać elementy oryginału począwszy od ostatniego.
Dodatkowo funkcja będzie typu `:void`, więc by zmodyfikować oryginał tablicy, przekażemy ją przez referencje (argument będzie miał prefix z znaku ampersanta `&`)

<details>
<summary>Rozwiązanie</summary>

```php
/**
 * Odwraca przekazaną tablicę. Przekazanie jej jako referencji `&` modyfikuje oryginał.
 *
 * @param array $tablica o dowolnym rozmiarze i typie wartości elementów.
 * @return void Modyfikowany jest oryginał.
 */
function odwracanie(array &$tablica) : void {

    $temp=[];

    for ($i=count($tablica)-1; $i >= 0; $i--) { 
        $temp[]=$tablica[$i];
    }
    $tablica=$temp;
}

$owoce = array("banan", "jabłko", "pomarańcza", "truskawka", "czereśnia");
print_r($owoce);
odwracanie($owoce);
print_r($owoce);
```

![odwracanie_kolejności-elementó_tablicy](/public/courses/php/Images/odwracanie_kolejności-elementó_tablicy.png)

> [!NOTE]
> Powyższa funkcjonalność jest natywnie zaimplementowana w języku PHP jako _**`array_reverse()`**_.
> Różnica polega na tym że natywna wersja nie modyfikuje oryginału przez referencję `&` tylko zwraca nową tablicę.

</details>


## Szukanie maksimum i minimum wartości w tablicy

Podzielimy to zadanie na dwie funkcje, które będą miały podobną strukturę.

Zaczniemy od maksimum. Wartość startowa naszej zmiennej $max będzie pierwszą wartością z tablicy.  
Następnie iterujemy po kolejnych elementach i porównujemy z max. Jeżeli element jest większy od aktualnego max, przypisujemy go do $max. W przeciwnym przypadku kontynuujemy iterację.

Podobnie dla minimum $min$, tylko że będziemy szukać elementu mniejszego od aktualnego min.

<details>
<summary>Rozwiązanie</summary>

```php
/**
 * Wyszukuje i zwraca największą wartość w tablicy
 *
 * @param array $tab
 * @return float Zwraca największą wartość w tablicy
 */
function maksimum(array $tab) :float {
    $max = $tab[0];    
    foreach($tab as $el){
        if($max < $el){
            $max=$el;
        }
    }
    return $max;
}
/**
 * Wyszukuje i zwraca najmniejszą wartość w tablicy
 *
 * @param array $tab
 * @return float Zwraca najmniejszą wartość w tablicy
 */
function minimum(array $tab) :float {
    $min = $tab[0];    
    foreach($tab as $el){
        if($min > $el){
            $min=$el;
        }
    }
    return $min;
}
```

![szukanie_maximum_i_minimum_wartości_w_tablicy](/public/courses/php/Images/tablice_max-min.png)

> [!NOTE]
> Powyższe funkcjonalności są natywnie zaimplementowane w języku PHP jako _**`max()`**_ i _**`min()`**_.

</details>

## Wyszukiwanie wartości w tablicy

Czesto będziemy chcieli sprawdzić czy dana wartość znajduje się w tablicy.
Jak najprościej wyszukać ją? Poprzez iterację po elementach tablicy i przerwaniu pętli w momencie znalezienia elementu przy użyciu `break`.

Pamiętaj że tablice w php są fajne a ich struktura jest taka:

```php
Array
(
    [0] => wartość
    [klucz] => wartość klucza
    [index] => wartość
)
```
Ta konstrukcja jest do odwzorowania w `foreach`:

```php
foreach ($tablica as $klucz => $wartosc)
```


<details>
<summary>Rozwiązanie</summary>

```php
/**
 * Wyszukuje wartość i zwraca jej index. 
 * Jeżeli w tablicy nie ma podanej warości to zwraca `-1`
 *
 * @param mixed $wartosc Pojedyńcza o dowolnym typie
 * @param array $tablica
 * @return integer Zwraca index lub `-1`
 */
function wyszukaj(mixed $wartosc, array $tablica) : int {
    $index = -1;

    foreach($tablica as $key=>$el){
        if($el == $wartosc){
            $index = $key;
            break;
        }
    }
    return $index;
}
```


![wyszukiwanie_wartości_w_tablicy](/public/courses/php/Images/wyszukiwanie_wartości_w_tablicy.png)

> [!NOTE]
> Funkcjonalność wyszukiwania wartości w tablicy jest natywnie dostępna w PHP jako _**`array_search()`**_.
> Zwraca ona klucz pierwszego dopasowania, a w przypadku braku wyniku: `false`.
>
> W starszych wersjach niż PHP 8.0 zwrócenie przez funkcję indexu $0$ *mogło czasem* być zinterpretowane jako `false`.
> Aktualnie problem może się dalej pojawiać, przez zwiekszoną sicłość typowania jest graniczny. Dlatego warto dopisywać trzeci parametr $strict, który wymusza porównanie typu i wartości (`===` zamiast `==`)

</details>



## Statystyka powtórzeń wartości w tablicy

Do przykładu posłuży nam następująca tablica:

```php
$dane = ['a', true, 'b', 'a', 'b', 9, 'a'];
```
Oczekiwany wynik:
```php
Array
(
    [a] => 3
    [1] => 1
    [b] => 2
    [9] => 1
)
```

<details>
<summary>Rozwiązanie</summary>

Lekko usprawniona funkcja z poprzedniej sekcji:
```php
/**
 * Wyszukuje wartość i zwraca jej index. 
 * Jeżeli w tablicy nie ma podanej warości to zwraca `-1`
 *
 * @param mixed $wartosc Pojedyńcza o dowolnym typie
 * @param array $tablica
 * @return integer Zwraca index lub `-1`
 */
function wyszukaj(mixed $wartosc, array $tablica): int
{
    foreach($tablica as $key=>$el){
        if($wartosc === $el){
            return $key;
        }
    }
    return -1;
}
```

```php
/**
 * Zlicza wystąpienia wartości w tablicy.
 * Wartości nie będące `intiger` lub `string` są na nie rzutowane.
 *
 * @param array $tablica elementów do zliczenia
 * @return array tablica z elementem jako klucz i ilością wystąpień jako wartość
 */
function statystyki(array $tablica): array
{
    $tab_temp = [];
    $tab_temp_count = [];
    foreach ($tablica as $el) {
       $key = wyszukaj($el, $tab_temp);
       if($key == -1){
            $tab_temp[]=$el;
            $tab_temp_count[$el] = 1;
       }else{
        $tab_temp_count[$el] += 1;
       }
    }
    return $tab_temp_count;
}

$dane = ['a', true, 'b', 'a', 'b', 9, 'a'];

print_r($dane);

print_r(statystyki($dane));

print_r(array_count_values($dane));
```

![tablice-statystyki-wystąpień-wartości](/public/courses/php/Images/tablice-statystyki-wystąpień-wartości.png)

> [!NOTE]
> Powyższa funkcjonalność jest natywnie zaimplementowana w języku PHP jako _**`array_count_values()`**_.
> Zwróć uwagę na *Warning* który ta funkcja zgłosiła. Chodzi o to że php w tablicach asocjacyjnych zezwala jedynie na wartości typu *`intiger`* oraz *`string`*. W naszej implementcji możesz zobaczyć że *`true`* został zamieniony na *`intiger`* $1$. W natywnej funkcji to też zachodzi ale tam taką wartość pomijają w końcowym wyniku.
> 
> Aby to rozwiązać wystarczy zapisać wartość *`true`* jako string *`"true"`*. Wtedy obie implementacje wyświetlą poprawne statystyki:
> 
> ```php
> $stare_dane = ['a', true, 'b', 'a', 'b', 9, 'a']; /*=>*/ $nowe_dane = ['a', "true", 'b', 'a', 'b', 9, 'a'];
> ```

</details>


