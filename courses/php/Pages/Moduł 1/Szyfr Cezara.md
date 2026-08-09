# Szyfr Cezara

Szyfr Cezara to jeden z najprostszych algorytmów szyfrowania, polegający na zamianie każdej litery tekstu jawnego na literę oddaloną od niej w alfabecie o stałą liczbę pozycji.

Wikipedia PL: [Szyfr Cezara](https://pl.wikipedia.org/wiki/Szyfr_Cezara)

W starożytności używano poniższej tarczy do szyfrowania i deszyfrowania poufnej korespondencji.

<data-caesar-wheel></data-caesar-wheel>

Rozróżnia się szyfry przesunięcia o pozycja jak przesuniecie o:
- $3$ pozycje (szyfr Cezara)
- $13$ pozycji (szyfr Rot13)
- $-1$ pozycje (szyfr adoptowanego syna Cezara, Oktawiana Augusta)
- $1$ pozycję i zapisywany po drugiej stronie pergaminu (scytalezm - żydowski wariant)


## Konwersje miedzy znakami a liczbami

Operacje przesunięcia czyli tak naprawde dodawania i odejmowania na tekście jest trudne. Dlatego pierwszym krokiem jest sprowadzenie renderu tekstu na zapis ASCII.



<data-ascii-converter></data-ascii-converter>


Dokumentacja php z przydatnymi metodami:

- [ord()](https://www.php.net/manual/en/function.ord.php)
- [chr()](https://www.php.net/manual/en/function.chr.php)
- [mb_ord()](https://www.php.net/manual/en/function.mb-ord.php)
- [mb_chr()](https://www.php.net/manual/en/function.mb-chr.php)

Na początku zapoznajmy się z `chr()`:

Prze konwertujmy liczby od $65$ do $90$ na znaki:

```php
for($i=65; $i<= 65+25; $i++){
    var_dump(chr($i));
}
```

![](/public/courses/php/Images/konwersja_dec_ASCII_do_Znaków.png)

Teraz rozszerzmy wynik na dwie kolumny:
- Alfabet łaciński
- Przesunięty o $3$ pozycje (szyfr Cezara)

Zastanów się co musi się wydarzyć gdy przesuniecie bedzie ponad wartość $90$.



![](/public/courses/php/Images/przesunięcie_tabelaryczne-alfabetu-o3.png)


<data-caesar-cipher
  text="Dod pd nrwd, d nrw mhvw svhp"
  shift="19"
  mode="encode">
</data-caesar-cipher>


## Szyfrowanie i deszyfrowanie Cezarem

Na poczętek weźmy pod uwagę tylko duże litery łacińskie:  
$\text{A}[65] - \text{Z}[90]$

Funkcja `caesar` powinna przyjmować $2$ parametry:
- `$text` - string na którym bedzie operować
- `$isEncrypted` - czy tekst jest już zaszyfrowany. Domyślnie: false.

```php
function caesar(string $text, bool $isEncrypted=false): string {...}
```
Dzieki przypisaniu domyślnej wartości parametrowi `$isEncrypted` nie ma potrzeby jej podawania przy wywołaniu tej funkcji.

Tak jak wcześniej bedziemy potrzebować zrobić z liter odpowiedni znak decymalny z tablicy ASCII:

```php
for ($i = 0; $i < strlen($text); $i++) {
    $chart = ord($text[$i]);
}
```

W zależności od wartości `$isEncrypted` musimy zdecydować czy szyfrujemy (przesunięcie $+3$), czy odszyfrowujemy (przesunięcie $-3$).

W tym przypadku if-a możemy zapisać na dwa sposoby:
- ```php
  if($isEncrypted == true){
  } else{}
  ```
Jednak w praktyce zapisuje się to bez porównywania:
- ```php
  if($isEncrypted){
  } else{}
  ```
  > [!NOTE]
  > Jeżeli sprawdzasz prawdziwość lub istnienie czegoś w zmiennej stosujesz krótszy zapis bez porównywania z wartością boolowską. Takie przypadki to gdy wartość może być $0$, `null`, `""` (empty), czyli fałsze (`false`)
  > Jednak czasem bedziesz chcieć wykonać coś tylko dla fałszu, wtedy zamiast pisać w `else` i pozostawiać pusty blok `if` skorzystaj z negacji (`!`):
  > ```php
  > if(!$isEncrypted){}
  > ```
  > Zupełnie inaczej jest gdy sprawdzasz jednocześnie wartość i typ by zapobiec pominiecie wykonania operacji w np.: tablicy dla indexu $0$ gdy funkcja może jednocześnie zwracać `int`, `string` lub `bool`. Wtedy bezwarunkowo musisz użyć:
  > ```php
  > if($value === false){}
  > ```

Uzyskamy koniec końców taką funkcję z testem wywołania:

```php
function caesar(string $text, bool $isEncrypted=false): string
{
    for ($i = 0; $i < strlen($text); $i++) {
        $chart = ord($text[$i]);

        if ($isEncrypted) {
            $text[$i] = chr($chart - 3);
        } else {
            $text[$i] = chr($chart + 3);
        }
    }
    return $text;
}

echo caesar("ABC XYZ");
echo "\n";
echo caesar("CDE QRS", true);
```

Wynik bedzie niepoprawny:
```text
DEF#[\]
@ABNOP
```
Ponieważ wychodzimy poza zakres dużych liter i musimy się przed tym zabezpieczyć.

### Wartości graniczne zakresu

Gdy wartość ma być cofnięta o $3$ a wynik bedzie mniejszy od $65$ musimy dodać do tego $25$ co spowoduje zapętlenie w obrębie tego zakresu:
Przykłady:

*A* $= 65$: $65 - 3 = 62 \quad \rightarrow \quad 62 + 25 = 87 =$ **W**

*A, B, C, D, E,* ... **V, W, X, Y, Z**

... **V, W, X, Y, Z,** *A, B, C, D, E* ...

Adekwatnie zabezpieczmy szyfrowanie gdzie przesuniecie jest dodatnie ($+3$):

*Z* $= 90$: $90 + 3 = 93 \quad \rightarrow \quad 93 - 25 = 68 =$ **C**

```php
if ($isEncrypted) {
    if($chart - 3 < 65){
        $chart += 26;
    }
    $text[$i] = chr($chart - 3);
} else {
    if($chart + 3 > 90){
        $chart -= 26;
    }
    $text[$i] = chr($chart + 3);
}
```

Wtedy wywoując: 
```php
echo caesar("ABC XYZ");
echo "\n";
echo caesar("DEF ABC", true);
```

Uzyskamy zdecydowanie poprawniejszy wynik:
```text
DEF#ABC
ABC7XYZ
```

Wkradły się tu nieporządane wyniki znków przsunęcia spacji `#` i `7` 

### Filtr wejścia przed nie-literami

Zabezpieczmy funkcję przed zmianą czegokolwiek co nie jest literą, a przy okazji utworzymy flagi informacyjne czy mamy odczynienia z zakresem dużych liter czy małych:

Flaga w programowaniu to nic innego niż zmienna typu `false`/`true`.

Dokonaj deklaracji i zainicjuj zmienne jako `false`

```php
$isUpper = false; $isLower = false;
```

Zapisujemy dwa warunki:
- **Prawda** jeżeli wartość jest wieksza lub równa $65$ i jednocześnie mniejsza lub równa $90$, czyli jest w zakresie $65 - 90$ ($A - Z$):
- **Prawda** jeżeli wartość jest wieksza lub równa $97$ i jednocześnie mniejsza lub równa $122$, czyli jest w zakresie $97 - 122$ ($a - z$):

```php
if($chart >= 65 && $chart <= 90){
    $isUpper = true;
}
if($chart >= 97 && $chart <=122){
    $isLower = true;
}
```

> [!NOTE]
> Jeżeli widzisz że powstał zapis taki jak powyżej, czyli jedyne co if robi to zmienia wartość boolowską to znaczy że ten fragment kodu można zastąpić w skrócony sposób:
> ```php
> $isUpper = ($chart >= 65 && $chart <= 90);
> $isLower = ($chart >= 97 && $chart <=122);
> ```
> Wartość w nawiasach `()` zostanie jawnie rzutowana na `(bool)`. Ponieważ operatory porównania `>` `<` `>=` `<=` zwracają domyślnie ten typ. Zapisanie warunków w nawiasach tż nie jest konieczne. Jednak dla mnie wygląda to czytelniej. 

To teraz by zablokować operacje na nie literach wystarczy prosty if sprawdzający negację którejś z flag:

```php
if(!$isUpper && !$isLower){
    continue;
}
```

Bramka AND zwróci `true` tylko gdy obie wartości są `true`.  
Jeżeli w trafimy na dużą literę to `$isUpper` będzie $1$ a jego negacja (`!`) da $0$:

$0 \text{ AND } 1 \quad \rightarrow \quad \textbf{0}$

Znak nie może być jednocześnie dużą i małą literą więc $1$ $1$ nie wystąpią a raczej ich negacja nie wystąpi. Co za tym idzie negując to dla przypadku gdy znak nie jest ani dużą ani małą literą =zyskamy:

$1 \text{ AND } 1 \quad \rightarrow \quad \textbf{1}$

i wtedy wykonujemy `continue` by tą iterację po stringu pominąć i pozostawić bez zmian.

```php
/**
 * Szyfrowanie i odszyfrowywanie z przsunieciem Cezara (o 3)
 *
 * @param string $text Wartość na której ma zostać przeprowadzona operacja
 * @param boolean $isEncrypted Czy wartość ma zostać odszyfrowana?
 * @return string Zaszyfrowana/Odszyfrowana wartość `$text`
 */
function caesar(string $text, bool $isEncrypted = false): string
{
    for ($i = 0; $i < strlen($text); $i++) {
        $chart = ord($text[$i]);

        $isUpper = ($chart >= 65 && $chart <= 90);
        $isLower = ($chart >= 97 && $chart <= 122);

        if (!$isUpper && !$isLower) {
            continue;
        }

        if ($isEncrypted) {
            if ($chart - 3 < 65) {
                $chart += 26;
            }
            $text[$i] = chr($chart - 3);
        } else {
            if ($chart + 3 > 90) {
                $chart -= 26;
            }
            $text[$i] = chr($chart + 3);
        }
    }
    return $text;
}

echo caesar("ABC XYZ");
echo "\n";
echo caesar("DEF ABC", true);
```

![](/public/courses/php/Images/szyfr_cezara.png)

> Dopisz obsługę małych liter w funkcji `caesar`. Wypróbuj i zobacz czy wszystko działa poprawnie:
> ```php
> echo caesar("Ala ma kota, a kot jest psem. Zdane. zarobisz");
> echo "\n";
> echo caesar("Dod pd nrwd, d nrw mhvw svhp. Cgdqh. cdurelvc", true);
> ```

## Szyfr monoalfabetyczny z kluczem

Jak szyfr Cezara opierał się o przesunieci pozycji każdej litery alfabetu łacińskiego tak monoalabetyczne szyfrowanie wprowadza klucz z losowo ułożonymi literami tego samego alfabetu. Dlatego bez klucza lub częściowo rozszyfrowanego tekstu złamanie szyfru jest bardzo utrudnione.

Korzystając z wcześniejszego badania funkcji `chr()` przygotujmy tablicę alfabetu łacińskiego:

```php
$alphabet = [];

for($i=65; $i<=90; $i++){
    $alphabet[]=chr($i);
}
print_r($alphabet);
```

Teraz skopiujemy ją jako tablicę do kolejnej zmiennej, która posłuży nam jako pula do losowo wybieranych liter dla nowej tablicy klucza.

```php
$alphabet = [];
$temp_alphabet = $alphabet;
$key = [];
```


### Losowy klucz i Randomizer

Większość popularnych funkcji w PHP do generowania liczb losowych jest przestarzała:

| Funkcja         | Status           |
| --------------- | ---------------- |
| `rand()`        | **_DEPRECATED_** |
| `srand()`       | **_DEPRECATED_** |
| `mt_rand()`     | **_DEPRECATED_** |
| `mt_srand()`    | **_DEPRECATED_** |
| `lcg_value()`   | **_DEPRECATED_** |
| *`MT_RAND_PHP`* | **_DEPRECATED_** |

W PHP 8+ wyróżniamy $5$ sposobów na losowanie liczb pseudolosowych:
1. `random_int()`: zwraca liczbę całkowitą losową z podanego zakresu
2. `random_bytes()`: zwraca losowe bajty
3. `random_float()`: zwraca liczbę zmiennoprzecinkową losową z podanego zakresu
4. Klasa `\Random\Randomizer`: tworzy nowy obiekt generujący liczby losowe
5. Klasa `\Random\Engine\Secure`: tworzy nowy obiekt generatora liczb pseudolosowych o wysokim stopniu losowości

Pierwszy raz skorzystamy z klasy w PHP. Nie bedziemy jej jeszcze tworzyć. Na razie tylko skorzystajmy z tego co jest już nam dane.

Klasa `\Random\Randomizer` to oddzielny plik,taki przepis na stworzenie pomocnika dla głównego kodu zawierający zestaw metod i własności skupionych wokół generowania liczb pseudolosowych. 

By móc z tego pomocnika skorzystać to musimy pierw przygotować zmienną która go przechowa. Taki obiekt nazywa się instancją klasy, a zainicjalizowanie tej instancji poprzedzamy słowem kluczowym `new` następnie wskazujemy gdzie przepis czyli ta klasa się znajduje:

```php
$randomizer = new \Random\Randomizer();
```
Końcówka lokalizacji `\Random\Randomizer` składa się z nawiasów do których można wpisać argumenty inicjalizujące dla konstruktora który bedzie wywołany przy tworzeniu instancji.

Teraz chcąc skorzystać z jednej z umiejętności/funkcjonalności (metody/funkcji) pomocnika (obiektu instancji klasy) wypisujemy zmienną która go przechowuje i zapisem strzałki w prawo `->` uzyskujemy dostęp do wszystkich jego metod.

Nas bedzie interesować metoda `getInt()`, która przyjmuje dwa argumenty:
- Dolną granicę losowania (`int $min`)
- Górną granicę losowania (`int $max`)

### Pseudolosowe przepisanie alfabetu na klucz

Założenie jest następujące:
- Mamy tablicę tymczasową z elementami zawierającymi wszystkie litery alfabetu łacińskiego `$temp_alphabet`.
- Będziemy iterować po tej tablicy dopóki nie będzie ona pusta `while (!empty($temp_alphabet))`.
- Przy każdej iteracji wykonamy $4$ kroki:
  - przy pomocy `$randomizer->getInt(0, count($temp_alphabet) - 1)` wylosujemy liczbę którą wykorzystamy jako **`index`**.
  - do tablicy klucza przypiszemy literę alfabetu z wylosowanego indexu.
  - By litery się nigdy nie powturzyły bedą anihilowane przy pomocy funkcji `unset()` i wskazaniu danej wartości `$temp_alphabet[$index]`.
  - Z racji że funkcja `unset()` dokonuje anihilacji, czyli z tablicy znika index wraz z wartością, ale cała tablica nie zostaje przebudowana nowymi indexami (pozostają puste przerwy i indexy magą wyglądać tak `[0, 1, 4, 5, ...])`) Dlatego przy wykorzystaniu metody `array_values()` do tymczasowej tablicy przepisujemy tylko wartości co naprawia luki w indexach.


<details>
<summary> Cały kod </summary>

Zamiast każdorazowo generować tablicę alfabetu w funkcji możesz zrobić to tylko raz a wynik przypisać do zmiennej. Oszczedzasz w ten sposób zasoby komputera.

```php
for ($i = 65; $i <= 90; $i++) {
    echo chr($i) .", ";
}
```


```php
/**
 * Generuje losowe ułożenie liter alfabetu jako klucz do szyfrowania monoalfabetycznego
 *
 * @return string Ciąg losowo ułożonych znaków alfabetu bez powtórzeń
 */
function monoalphabetKeyGen(): string
{
    $alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    $key = "";
    $randomizer = new \Random\Randomizer();

    while (!empty($alphabet)) {
        $random_index = $randomizer->getInt(0, count($alphabet) - 1);

        $key .= $alphabet[$random_index];

        unset($alphabet[$random_index]);
        $temp_alphabet = array_values($alphabet);
    }
    return $key;
}
```

![](/public/courses/php/Images/losowy-klucz-z-przetasowaniem-tablicy-alfabetu.png)
</details>

## Budowa szyfrowania i deszyfrowania monoalfabetycznego

Mając jakiś tekst oraz dwie tablice:
- alfabet łaciński
- klucz, czyli losowo przetworzony alfabet łaciński

Szyfrowanie polega na znalezieniu w pierwszej tablicy danego znaku, a następnie zakodowanie w tekście znaku z klucza drugiej tablicy na tej samej pozycji (indexie).

<data-monoalphabetic-substitution
  text="TAJNA WIADOMOSC"
  key="QWERTYUIOPASDFGHJKLZXCVBNM">
</data-monoalphabetic-substitution>


Bierzemy naszą zmienną `$alphabet` i skoro szyfrowanie polaga na operacji miedzy dwoma tablicami to musimy przetworzyć `$key`, który jest stringiem na tablicę:

```php
$key_array = [];
for ($i = 0; $i < strlen($key); $i++) {
    $key_array[] = $key[$i];
}
$key = $key_array;
```
Ale zamiast pisać własną implementację w PHP skorzystamy z natywnej implementacji którą przygotowano w C więc na pewno będzie wydajniejsza.

```php
$key = str_split($key);
```
Lub z `mb_str_split()`, gdy operujemy na znakach *UTF-8*.

```php
$key = mb_str_split($key, 1, "UTF-8");
```

Nasza funkcja szyfrująca bedzie dość podobna do tej z caesara:
```php
function monoalphabet(string $text, string $key, bool $isEncrypted = true): string {}
```

Klasycznie całość zapiszemy iteracyjnie czyli w pętli:

```php
for ($i = 0; $i < strlen($text); $i++) {}
```

Musimy uzyskać pozycję (index) litery w tablicy alfabetu i na jej podstawie pobrać znak z tablicy klucza i przypisać ją do nowej zmiennej.

Z pomocą przychodzi nam natywna funkcja PHP `array_search()`:

```php
array_search(mixed $needle, array $haystack, bool $strict = false): int|string|false
```
- `$needle`: szukany element
- `$haystack`: tablica do przeszukania
- `$strict`: czy szukać z uwzględnieniem typu danych

Jej wynik bedziemy przechowywać w zmiennej mapującej pozycję `$mapped`:

```php
$mapped = array_search($chart, $alphabet);
```
Potem do zmiennej zadeklarowanej i zainicjalizowanej jako string `$output_text`  przed pętlą `for` bedziemy dopisywać w każdej iteracji literę z drugiej tablicy stosując znalezioną pozycję z `$mapped`

```php
$output_text .= $key[$mapped];
```

Uzyskujemy następującą funkcję szyfrującą monoalfabetycznie:

```php
function monoalphabet(string $text, string $key, bool $isEncrypted = true): string {
    $alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    $key = str_split($key);
    $output_text="";

if ($isEncrypted) {
     for ($i = 0; $i < strlen($text); $i++) {
        $mapped = array_search($text[$i], $key);
        $output_text .= $alphabet[$mapped];
    }
}else{
    for ($i = 0; $i < strlen($text); $i++) {
        $mapped = array_search($text[$i], $alphabet);
        $output_text .= $key[$mapped];
    }
}
    
    return $output_text;
}


echo "TEST łatwy: <hr>";
echo monoalphabet("ZTBZ", "QWERTYUIOPASDFGHJKLZXCVBNM", true);
echo "\n";
echo monoalphabet("TEXT", "QWERTYUIOPASDFGHJKLZXCVBNM", false);

echo "\n\n\nTest pełniejszy: <hr>";
echo monoalphabet("Q qZT BZ", "QWERTYUIOPASDFGHJKLZXCVBNM", true);
echo "\n";
echo monoalphabet("A aTE XT", "QWERTYUIOPASDFGHJKLZXCVBNM", false);
```


Z testów wynika że funkcja ma $3$ główne problemy:
1. Nie ma małych liter
2. Brak zachowania spacji
3. `Q` oraz `A` mają index $0$ co może kolidować z `false` i dawać dziwne efekty.
![](/public/courses/php/Images/pierwsza-wersja-monoalphabetic-crypt.png)


### 1. Wsparcie dla małych liter

Tu skorzystamy z $3$ natywnych funkcji PHP:
- `ctype_lower()` - Sprawdza czy znak jest małą literą.
- `strtolower()` - Zamienia string na małe litery.
- `strtoupper()` - Zamienia string na duże litery.

```php
for ($i = 0; $i < strlen($text); $i++) {
            $isLower = ctype_lower($text[$i]); // Flaga czy litera jest mała

            if ($isLower) {
                $text[$i] = strtoupper($text[$i]); // Zamiana na dużą literę
            }

            $mapped = array_search($text[$i], $k); // Szukamy pozycji wystąpienia dużej litery w tablicy dużych liter

            if ($isLower) {
                $output_text .= strtolower($a[$mapped]); // Dodajemy do wyniku małą literę z drugiej tablicy
            } else {
                $output_text .= $a[$mapped]; // Dodajemy do wyniku dużą literę z drugiej tablicy
            }
}
```
> Adekwatnie dla deszyfrowania.

### 2. Pozostawienie bez zmian wartości nie zawartych w tablicach

Tą funkcjonalność dość łatwo dadać. wystarczy po uzyskaniu wyniku z `array_search` sprawdzić czy jest on wartością `false` i dodatkowo czy jest to typ _**`boolean`**_, aby uniknąć wykonania dla rzutowanego integer $0$ to `bool` `false`.

```php
$mapped = array_search($text[$i], $k);
if ($mapped === false) {
    $output_text .= $text[$i];
    continue;
}
```
> Tym jednym fragmentem kodu rozwiązano też problem z literkami `Q` oraz `A`, które miały index $0$ i kolidowały z `false`.

### Działająca implementacja szyfru monoalfabetycznego

```php
function monoalphabet(string $text, string $key, bool $isEncrypted = true): string
{
    $alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    $key = str_split($key);


    $output_text = "";
    if ($isEncrypted) {
        for ($i = 0; $i < strlen($text); $i++) {
            $isLower = ctype_lower($text[$i]);
            if ($isLower) {
                $text[$i] = strtoupper($text[$i]);
            }
            $mapped = array_search($text[$i], $key);
            if ($mapped === false) {
                $output_text .= $text[$i];
                continue;
            }
            if ($isLower) {
                $output_text .= strtolower($alphabet[$mapped]);
            } else {
                $output_text .= $alphabet[$mapped];
            }
         }
     } else {
         for ($i = 0; $i < strlen($text); $i++) {
             $isLower = ctype_lower($text[$i]);
             if ($isLower) {
                 $text[$i] = strtoupper($text[$i]);
             }
             $mapped = array_search($text[$i], $alphabet, true);
             if ($mapped === false) {
                 $output_text .= $text[$i];
                 continue;
             }
             if ($isLower) {
                 $output_text .= strtolower($key[$mapped]);
             } else {
                 $output_text .= $key[$mapped];
             }
         }
    }

    return $output_text;
}
```

> Funkcja działą poprawnie, ale nie jest idealna.


### Refaktoryzacja kodu

**Refaktoryzacja** to proces uproszczenia i optymalizacji fragmentu kodu bez zmiany *wejścia* i *wyjścia*. Funkcja dalej musi działać tak samo jak przed refaktoryzacją.


Redukcja kodu.  
W `if` `else` mamy bardzo podobny kod. Jego jedną różnicą jest odwrotne wykorzystanie tablic `$alphabet` oraz `$key`.  
Wyseparujmy to zachowanie do odzielnego kodu:

```php
if ($isEncrypted) {
    $a = $alphabet;
    $k = $key;
} else {
    $a =$key;
    $k =$alphabet;
}
```
Teraz wystarczy wyciągnoąć zawartość `if` albo `else` i podminić wywołania `$alphabet` oraz `$key` na `$a` i `$k`.

Podmieniona zawartość `if`:
```php
for ($i = 0; $i < strlen($text); $i++) {
    $isLower = ctype_lower($text[$i]);
    if ($isLower) {
        $text[$i] = strtoupper($text[$i]);
    }
    $mapped = array_search($text[$i], $k);
    if ($mapped === false) {
        $output_text .= $text[$i];
        continue;
    }
    if ($isLower) {
        $output_text .= strtolower($a[$mapped]);
    } else {
        $output_text .= $a[$mapped];
    }
}
```

Funkcja po redukcji jest o wiele krótsza i dalej działa tak samo:

```php
function monoalphabet(string $text, string $key, bool $isEncrypted = true): string
{
    $alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    $key = str_split($key);

    $output_text = "";
    if ($isEncrypted) {
        $a = $alphabet;
        $k = $key;
    } else {
        $a = $key;
        $k = $alphabet;
    }

    for ($i = 0; $i < strlen($text); $i++) {
        $isLower = ctype_lower($text[$i]);
        if ($isLower) {
            $text[$i] = strtoupper($text[$i]);
        }
        $mapped = array_search($text[$i], $k);
        if ($mapped === false) {
            $output_text .= $text[$i];
            continue;
        }
        if ($isLower) {
            $output_text .= strtolower($a[$mapped]);
        } else {
            $output_text .= $a[$mapped];
        }
    }

    return $output_text;
}
```

> Zaówarz że w pętli `for` odwoujemy się tylko do aktualnej wartości przez index i `$i` do niczego nam nie jest potrzebny. Dlatego możemy zastąpić klasyczną petlę `for` na `foreach`: 

```php
foreach (str_split($text) as $chart) {
    $isLower = ctype_lower($chart);
    if ($isLower) {
        $chart = strtoupper($chart);
    }
    $mapped = array_search($chart, $k);
    if ($mapped === false) {
        $output_text .= $chart;
        continue;
    }
    if ($isLower) {
        $output_text .= strtolower($a[$mapped]);
    } else {
        $output_text .= $a[$mapped];
    }
}
```

Skoro mamy przypadki że bloków kodu skłądającego się wyłącznie z `if` `else` to można go zapisać krócej i przy okzaji poprawić nazwnictwo zmiennych:

```php
if ($isEncrypted) {
    $a = $alphabet;
    $k = $key;
} else {
    $a = $key;
    $k = $alphabet;
}
```

```php
$from = $isEncrypted ? $alphabet : $key;
$to = $isEncrypted ? $key : $alphabet;
```
> Jeżęli zmienna `$isEncrypted` jest prawdziwa to $from$ przyjmuje pierwszą wartość po operatorze `?` ($$alphabet$), w przeciwnym wypadku drugą wartość po operatorze `:` ($$key$). Adkwatnie dla zmiennej $to$.

![](/public/courses/php/Images/padanie-operatora-znaku-zapytania-i-dwókropka.png)

Istnieje też podobny zapis dla zabezpieczania kodu przed null-em:

```php
$wynik = $wynik ?? "Nie udało się uzyskać wyniku.";
```
Tu gdy wartość bedzie `null` zmienna $wynik$ przyjmie wartość po operatorze `??` (czyli "Nie udało się uzyskać wyniku.").

Warto w każdym języku programowania przetestować operator `??` czy działa tylko dla wartości null tak jak w PHP.
![](/public/courses/php/Images/badanie-operatora-powdójnego-znaku-zapytania.png)

### Finalna wersja szyfru monoalfabetycznego

Czy widzisz coś co jeszcze można zrefaktoryzować w tej funkcji?

```php
function monoalphabet(string $text, string $key, bool $isEncrypted = true): string
{
    $alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    $key = str_split($key);

    $output_text = "";
    $from = $isEncrypted ? $alphabet : $key;
    $to = $isEncrypted ? $key : $alphabet;

    foreach (str_split($text) as $chart) {
        $isLower = ctype_lower($chart);
        if ($isLower) {
            $chart = strtoupper($chart);
        }
        $mapped = array_search($chart, $to);
        if ($mapped === false) {
            $output_text .= $chart;
            continue;
        }
        if ($isLower) {
            $output_text .= strtolower($from[$mapped]);
        } else {
            $output_text .= $from[$mapped];
        }
    }

    return $output_text;
}
```