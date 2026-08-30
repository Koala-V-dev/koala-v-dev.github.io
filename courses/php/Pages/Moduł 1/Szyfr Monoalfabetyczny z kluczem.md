# Szyfr Monoalfabetyczny z kluczem

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


## 🎫 Losowy klucz i Randomizer

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

Klasa `\Random\Randomizer` to oddzielny plik, taki przepis na stworzenie pomocnika dla głównego kodu zawierający zestaw metod i własności skupionych wokół generowania liczb pseudolosowych. 

By móc z tego pomocnika skorzystać to musimy pierw przygotować zmienną która go przechowa. Taki obiekt nazywa się instancją klasy, a zainicjalizowanie tej instancji poprzedzamy słowem kluczowym `new` następnie wskazujemy gdzie przepis czyli ta klasa się znajduje:

```php
$randomizer = new \Random\Randomizer();
```
> Końcówka lokalizacji `\Random\Randomizer` składa się z nawiasów do których można wpisać argumenty inicjalizujące dla konstruktora który bedzie wywołany przy tworzeniu instancji.

Teraz chcąc skorzystać z jednej z umiejętności/funkcjonalności (metody/funkcji) pomocnika (obiektu instancji klasy) wypisujemy zmienną która go przechowuje i zapisem strzałki w prawo `->` uzyskujemy dostęp do wszystkich jego metod.

Nas bedzie interesować metoda `getInt()`, która przyjmuje dwa argumenty:
- Dolną granicę losowania (`int $min`)
- Górną granicę losowania (`int $max`)

---

## 🔑 Pseudolosowe przepisanie alfabetu na klucz

Założenie jest następujące:
- Mamy tablicę tymczasową z elementami zawierającymi wszystkie litery alfabetu łacińskiego `$temp_alphabet`.
- Będziemy iterować po tej tablicy dopóki nie będzie ona pusta `while (!empty($temp_alphabet))`.
- Przy każdej iteracji wykonamy $4$ kroki:
  1. przy pomocy `$randomizer->getInt(0, count($temp_alphabet) - 1)` wylosujemy liczbę którą wykorzystamy jako **`index`**.
  2. do tablicy klucza przypiszemy literę alfabetu z wylosowanego indexu.
  3. By litery się nigdy nie powtórzyły będą anihilowane przy pomocy funkcji `unset()` i wskazaniu danej wartości `$temp_alphabet[$index]`.
  4. Z racji że funkcja `unset()` dokonuje anihilacji, czyli z tablicy znika index wraz z wartością, ale cała tablica nie zostaje przebudowana nowymi indexami (pozostają puste przerwy i indexy mogą wyglądać tak `[0, 1, 4, 5, ...])`) Dlatego przy wykorzystaniu metody `array_values()` do tymczasowej tablicy przepisujemy tylko wartości co naprawia luki w indexach.


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

---

## 🔒 Budowa szyfrowania i deszyfrowania monoalfabetycznego

Mając jakiś tekst oraz dwie tablice:
- alfabet łaciński
- klucz, czyli losowo przetworzony alfabet łaciński

Szyfrowanie polega na znalezieniu w pierwszej tablicy danego znaku, a następnie zakodowanie w tekście znaku z klucza drugiej tablicy na tej samej pozycji (indexie).

<data-monoalphabetic-substitution
  text="TAJNA WIADOMOSC"
  key="QWERTYUIOPASDFGHJKLZXCVBNM">
</data-monoalphabetic-substitution>


Bierzemy naszą zmienną `$alphabet` i skoro szyfrowanie polega na operacji miedzy dwoma tablicami to musimy przetworzyć `$key`, który jest stringiem na tablicę:

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

---

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

---

### 2. Pozostawienie bez zmian wartości nie zawartych w tablicach

Tą funkcjonalność dość łatwo dodać. wystarczy po uzyskaniu wyniku z `array_search` sprawdzić czy jest on wartością `false` i dodatkowo czy jest to typ _**`boolean`**_, aby uniknąć wykonania dla rzutowanego integer $0$ do _**`bool`**_ `false`.

```php
$mapped = array_search($text[$i], $k);
if ($mapped === false) {
    $output_text .= $text[$i];
    continue;
}
```
> Tym jednym fragmentem kodu rozwiązano też problem z literkami `Q` oraz `A`, które miały index $0$ i kolidowały z `false`.

---

### 🔐 Działająca implementacja szyfru monoalfabetycznego

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

> Funkcja działa poprawnie, ale nie jest idealna.


### 🏭 Refaktoryzacja kodu

**Refaktoryzacja** to proces uproszczenia i optymalizacji fragmentu kodu bez zmiany *wejścia* i *wyjścia*. Funkcja dalej musi działać tak samo jak przed refaktoryzacją.


Redukcja kodu.  
W `if` `else` mamy bardzo podobny kod. Jego jedną różnicą jest odwrotne wykorzystanie tablic `$alphabet` oraz `$key`.  
Wyseparujmy to zachowanie do oddzielnego kodu:

```php
if ($isEncrypted) {
    $a = $alphabet;
    $k = $key;
} else {
    $a =$key;
    $k =$alphabet;
}
```
Teraz wystarczy wyciągnąć zawartość `if` albo `else` i podmienić wywołania `$alphabet` oraz `$key` na `$a` i `$k`.

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

> Zauważ że w pętli `for` odwołujemy się tylko do aktualnej wartości, więc index (`$i`) do niczego nam nie jest potrzebny. Dlatego możemy zastąpić klasyczną pętlę `for` na `foreach`: 

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

Skoro mamy bloki kodu `if` `else`, które wykonują lustrzaną i trywialną akcję to można je zapisać krócej, przy okazji poprawiając nazewnictwo zmiennych:

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
> Jeżeli zmienna `$isEncrypted` jest prawdziwa to **`$from`** przyjmuje pierwszą wartość po operatorze `?` (*`$alphabet`*), w przeciwnym wypadku drugą wartość po operatorze `:` (*`$key`*). Adekwatnie dla zmiennej **`$to`**.

![](/public/courses/php/Images/padanie-operatora-znaku-zapytania-i-dwókropka.png)

Istnieje też podobny zapis dla zabezpieczania kodu przed null-em:

```php
$wynik = $wynik ?? "Nie udało się uzyskać wyniku.";
```
Tu gdy wartość bedzie `null` zmienna $wynik$ przyjmie wartość po operatorze `??` (czyli "Nie udało się uzyskać wyniku.").

Warto w każdym języku programowania przetestować operator `??` czy działa tylko dla wartości null tak jak w PHP.
![](/public/courses/php/Images/badanie-operatora-powdójnego-znaku-zapytania.png)

---

### 👑 Finalna wersja szyfru monoalfabetycznego

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