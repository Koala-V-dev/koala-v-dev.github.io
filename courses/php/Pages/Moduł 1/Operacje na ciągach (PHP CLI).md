# Operacje na ciągach (PHP CLI)

Zanim przejdziemy do ciągów, to czy wiedziałeś że PHP pozwala na wprowadzanie danych przez terminal?  

Realizujemy to poprzez funkcję `readline()`:
```php
$input = readline("Jak się nazywasz?: ");
echo 'Cześć, <span class="wynik">' . $input . "</span>!";
```
Gdy odświeżysz stronę na serwerze zobaczysz że coś się przetwarza. Przeglądarka wysłała zapytanie do serwera i czeka na odpowiedź. Natomiast na serwerze PHP wyświetlił komunikat z `readline()` i czeka aż wprowadzisz dane.  
Gdy to nastąpi dopiero wtedy przeglądarka uzyska przetworzoną przez PHP odpowiedź.

![Prezentacja działania readline](/public/courses/php/Images/php-CLI-readline.png)

## Czym jest ciąg

Ciąg to zestawienie danych jeden po drugim. Mamy wiele rodzaji ciągów:
- _**Ciąg znaków**_ czyli dobrze ci znany **`string`**. Wynik *"Halo!"* to zestawienie znaków *'H', 'a', 'l', 'o', '!'*
- _**Ciąg liczb**_:
  - **Ciąg arytmetyczny** to liczby które powstają poprzez dodawanie stałej wartości do poprzedniego elementu. Przykład: 1,2,3,4,5
  - **Ciąg geometryczny** to liczby które powstają poprzez mnożenie stałej wartości przez poprzedni element. Przykład: 1,2,4,8,16
- _**Ciąg fibbonaciego**_ to liczby które powstają poprzez dodawanie dwóch poprzednich elementów. Przykład: 1,1,2,3,5,8,13,21,34...

## Operacje na ciągach znaków

Wiedząc że `string` jest ciągiem znaków to możemy go potraktować jako tablicę elementów.

Przepiszmy więc `"Memento mori"` jako tablicę. Przyda nam się poznać długość tego ciągu i z pomocą przychodzi nam funkcja `strlen()`:

```php
$word = "Memento mori";
$tab = [];

for($i = 0; $i < strlen($word); $i++){
    $tab[] = $word[$i];
}

print_r($tab);
```

No dobrze, skoro umiesz już poruszać się po znakach w ciągu to poznajmy wartość tego odwróconego zdania:  
*!oetaM ,tluv sueD .ątsimargorp ćatsoz zsisuM*
```php
$word = "!oetaM ,tluv sueD .ątsimargorp ćatsoz zsisuM";
$tab = [];
$newWord = "";
for($i = strlen($word)-1; $i >=0; $i--){
    $newWord .= $word[$i];
}

echo $newWord;
```

Jak widzisz na ponirzym obrazu coś poszło nie tak. Mimo że mamy zadeklarowane `<meta charset="UTF-8">` to wynik posiada błędne znaczki dla polskich liter (`ć` i `ą`).
![](/public/courses/php/Images/odwracanie_stringa.png)

Chodzi o to że znaki specjalne i emoji są deklarowane na kilku bitach i wychodzą poza standard **ASCI** (*American Standard Code for Information Interchange*) które to pierwotnie miały tylko $8 \text{ bitów}$ ($256$ znaków). Dlatego do poprawnej zabawy stringami w polskim języku powinniśmy się posługiwać funkcjami **MB** (*Multibyte*).

### Biblioteka <code>mb_string</code>

To moduł php pozwalający na poprawną interpretacją znaków wielobajtowych. Standardowe funkcje string operują nie tyle co na znakach a na bajtach co jest szybsze. Niestety wiąże się to z zwracaniem śmieciowych wartości gdy konwersji dokonamy na znakach diagretycznych lub z alfabetu chińskiego lub japońskiego albo arabskiego. Te specjalne nie amerykańskie znaki potrzebują do zapisu od $2$ do $4$ bajtów. To samo tyczy się emoji.

### Wsparcie dla <code>mbstring</code>

Zakomentuj na razie kod PHP i wywołaj przez `echo` funkcję `phpinfo()`. Następnie wyszukaj frazy *Multibyte decoding support using mbstring* i sprawdź czy jest włączona **`enabled`**:

Gdy wartość bedzie tak jak na obrazku **_`disabled`_**, to bedziesz musiał dokonać modyfikacji w pliku `php.ini`.

![](/public/courses/php/Images/php_info_mbstring.png)

Przy standardowej instalacji XAMPP ten plik znajduje się w `C:/xampp/php/php.ini`.  
Otwórz go w dowolnym edytorze i wyszukaj frazy `mbstring`.

Tak jak na obrazku wystarczy usunąć średnik `;` na początku linii:

```ini
;extension=mbstring
```

do formy:

```ini
extension=mbstring
```

Następnie uruchom ponownie serwer Apache lub gdy pracujesz w lepszej formie, czyli zakończ działanie serwera PHP <span style="text-wrap: nowrap;"> <kbd>Ctrl</kbd> + <kbd>C</kbd> </span> w konsoli terminalu i uruchom go ponownie:
```ps
php -S 127.0.0.1:8080
```

![](/public/courses/php/Images/php.ini-mbstring-extension.png)

### Metody <code>mb_string</code>

Skoro mamy włączone wsparcie dla biblioteki mbstring, możemy teraz poprawnie zrealizować odwracanie zdania:

```php
$word = "!oetaM ,tluv sueD .ątsimargorp ćatsoz zsisuM";
$tab = [];
$newWord = "";
echo '$word ma w strlen: ' . strlen($word) . " znaków\n";
echo '$word ma w mb_strlen: ' . mb_strlen($word) . " znaków\n";

for ($i = mb_strlen($word) - 1; $i >= 0; $i--) {
    $newWord .= mb_substr($word, $i, 1);

    echo "<code>" . mb_substr($word, $i, 1) . "</code>";
}
echo "\n";
echo $newWord;
```

Jak widać z pierwszego testu na $44$ znaki łącznie z spacjami standardowa funkcja `strlen()` zwróciła wartość $46$ znaków a bardziej $46 \text{ bajtów}$. Natomiast funkcja `mb_strlen()` zwróciła prawidłową wartość **$44 \text{ znaki}$**.

Drugą funkcją z biblioteki `mbstring` którą użyto to `mb_substr()`:

```php
mb_substr(
    string $string, // Zmienna typu string
    int $start, // Początkowa pozycja od której ma zostać wycięta i zwrócona fraza
    ?int $length = null, // [?- Opcjonalnie] Długość frazy, domyślnie do końca stringa
    ?string $encoding = null // [?- Opcjonalnie] Kodowanie znaków, domyślnie ustawione w pliku php.ini: default_charset="UTF-8"
): string|false // Zwraca frazę lub false w przypadku błędu
```

W tym kodzie zostało użyte `mb_substr($word, $i, 1);`, co oznacza że z zmiennej `$word` zostaje wycięty znak o indeksie `$i` i długości $1$.

![](/public/courses/php/Images/mb_string_testy.png)

## Ciąg arytmetyczny

Ciąg arytmetyczny to funkcja matematyczna która dla stałego $d$ (różnicy ciągu) definiuje się następująco:

$$ x_n = x_0 + n \cdot d $$

> [!IMPORTANT]
> W literaturze polskiej często używa się symbolu $r$ jako różnicy ciągu. Jednak zgodnie z notacją algorytmiczną, a co za tym idzie anglosaską bierzemy $d$ od słowa *difference*.

Na przykładzie ciągu z $x_0 = 1$ i $d = 2$ wygląda on tak:
$$\begin{align*}x_1 &= 1 + 1 \cdot 2 = 3\\x_2 &= 1 + 2 \cdot 2 = 5\\x_3 &= 1 + 3 \cdot 2 = 7\\\end{align*}$$

Napiszmy funkcję PHP, która przyjmuje parametry $a_0$, $d$ oraz $n$ i zwraca $n$ w formie listy nieuporządkowanej `<ul>`, działania i wynik kolejnych $n$ wyrazów ciągu arytmetycznego.  
Dodatkowo parametry podamy w konsoli przy użyciu `readline()`: 

Przykładowe rozwiązanie może wyglądać tak:

![](/public/courses/php/Images/brak-rzutowania-stringa-na-float.png)

Jak pewnie widzisz na obrazku kod nie działa. Wywaliło error. Nasza funkcja oczekiwała wartości liczbowych:
```php
function ciagArytmetyczny(float $a, float $d, int $n) : void
```
Natomiast przy użyciu  `readline()` do zmiennych została przekazane wartości typu **string**. To że to nie są liczby widać po tekście w konsoli: to słowa otoczone są apostrofami.
```ps
#0 C:\Projekty kursu\php\index.php(51): ciagArytmetyczny('.6', '2', '6')
```
Z pomocą przychodzi nam rzutowanie zmiennych. Oczekujemy wartości o określonym typie, wiec wystarczy ten typ zapisać w nawiasach przed zmienną lub funkcją. Rzutować możęmy na:
- `(int)`: `$x = (int) '5';` → `$x = 5;`
- `(float)`: `$x = (float) '5.5';` → `$x = 5.5;`
- `(string)`: `$x = (string) 5;` → `$x = "5";`
- `(bool)`: `$x = (bool) 1;` → `$x = true;`
- `(array)`: `$x = (array) 1;` → `$x = [1];`
- `(object)`: `$x = (object) 1;` → `$x = (object) [1];`

> [!WARNING]
> W PHP 8+ zdepresjonowano pełne nazwy podstawowych typów zmiennych ( intiger, boolean) nie ma też sensu używać aliasów dla float czyli double czy real. Ponadto (unset) nie jest już wspierane (Wali SyntaxErrorem).


Gdy dodano poprawne rzutowanie na oczekiwane zmienne wszystko zadziałało:

![](/public/courses/php/Images/ciąg_arytmetyczny-w-php.png)

```php
/**
 * Przyjmuje parametry i wyświetla n wyników działań arytmetycznych ciągu
 *
 * @param float $a Wartość bazowa ciągu
 * @param float $d Różnica ciągu
 * @param integer $n Ilość wyrazów ciągu do wyświetlenia
 * @return void W miejscu wywołania pojawi się lista ul html 
 */
function ciagArytmetyczny(float $a, float $d, int $n) : void {
    echo "<ul>";
    for($i=0; $i < $n; $i++){
        echo "<li>x<sub>" . $i . "</sub> = " . $a . " + " . $i . " &#xD7 " . $d . " = ";
        echo $a + $i * $d;
        echo "</li>";
    }
    echo "</ul>";
}
$a = (float)readline("Podaj wartość pierwszego wyrazu ciągu arytmetycznego: ");
$d = (float)readline("Podaj wartość różnicy ciągu: ");
$n = (int)readline("Ile wyrazów chcesz by ci podać?: ");
ciagArytmetyczny($a, $d, $n);
```

## Ciąg geometryczny

Ciąg geometryczny to funkcja matematyczna która dla stałego $r$ (ilorazu ciągu) definiuje się następująco:

$$ x_n = x_0 \cdot r^n $$

> [!IMPORTANT]
> Zgodnie z notacją anglosaską i algorytmiczną, używamy symbolu $r$ od słowa *ratio* (stosunek/iloraz). W polskiej literaturze matematycznej w tym miejscu spotkasz literę $q$ (od łacińskiego *quotient* - iloraz). Pamiętaj, aby nie pomylić angielskiego **$r$** (**ratio** - stosunek) z polskim **_$r$_** (**_różnica_**) stosowanym przy ciągu arytmetycznym!

$$ \begin{align*} x_1 &= 1 \cdot 2^1 = 2\\ x_2 &= 1 \cdot 2^2 = 4\\ x_3 &= 1 \cdot 2^3 = 8\\ \end{align*} $$

```php
/**
 * Przyjmuje parametry i wyświetla n wyników działań geometrycznych ciągu
 *
 * @param float $a Wartość bazowa ciągu
 * @param float $r Stosunek ciągu
 * @param integer $n Ilość wyrazów ciągu do wyświetlenia
 * @return void W miejscu wywołania pojawi się lista ul html 
 */
function ciagGeometryczny(float $a, float $r, int $n) : void {
    echo "<ul>";
    for($i=0; $i < $n; $i++){
        echo "<li>x<sub>" . $i . "</sub> = " . $a . " &#xD7 " . $r . "<sup>" . $i . "</sup>" . " = ";
        echo $a * $r**$i;
        echo "</li>";
    }
    echo "</ul>";

}

$a = (float)readline("Podaj wartość pierwszego wyrazu ciągu geometrycznego: ");
$r = (float)readline("Podaj stosunek ciągu: ");
$n = (int)readline("Ile chcesz bym ci podał wyrazów?: ");

ciagGeometryczny($a, $r, $n);
```

## Ciąg fibonacciego

Rozgrzany? No to lecimy z klasyką, ciąg fibonacciego. Zdefiniujmy go najpierw matematycznie:

$$ Fib = \begin{cases} x_0 = 0 \\ x_1 = 1 \\ x_n = x_{n-1} + x_{n-2} & \text{dla } n \geq 2 \end{cases} $$

> [!WARNING]
> W literaturze istnieją dwa popularne sposoby definiowania początkowych wyrazów ciągu Fibonacciego:
> - **$x_0 = 0,\; x_1 = 1$** — definicja algorytmiczna, powszechnie stosowana w informatyce.
> - *$x_1 = 1,\; x_2 = 1$* — definicja matematyczna, często spotykana w podręcznikach. 
> Często spotkasz się z zapisami jako wartości początkowe $[0, 1]$ lub $[1, 1]$ oznaczają to samo, ale ten sens pojawia się dopiero w odniesieniu do szeregu $x_n$. 

![](/public/courses/php/Images/Fibonacci_Copilot_20260804_160311.png)


<details>
  <summary>Rozwiązanie</summary>

```php
/**
 * Zwraca tablicę n-elementowych z kolejnymi wartościami ciągu Fibonacciego
 *
 * @param integer $n Rozmiar tablicy / ilość wyrazów ciągu
 * @return array Tablica z kolejnymi wyrazami ciągu
 */
function fib(int $n) : array {
    $fib=[1,1];
    for($i=1;$i<$n-1;$i++){
        $fib[]=$fib[$i]+$fib[$i-1];
    }
    return $fib;
}

$n = (int)readline("Podaj ile chcesz wyrazów ciągu Fibonacciego: ");

foreach(fib($n) as $key => $el){
    if($key % 5 == 0){
        echo "\n";
    }
    echo $el . "\t";
}
```


![](/public/courses/php/Images/fibonacci.png)

</details>