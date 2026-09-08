# Szyfr Vigenère’a

Szyfr Cezara przesuwał każdą literę o stałą wartość (np. o $3$ pozycje). Szyfr monoalfabetyczny mieszał cały alfabet jednym stałym kluczem przetasowanego alfabetu. Oba miały jedną ogromną wadę: **analizę częstotliwościową**. Skoro w języku polskim najczęściej występuje litera **A** lub **E**, to najczęstszy znak w szyfrogramie od razu zdradzał podstawienie.

*Blaise de Vigenère* (a tak naprawdę *Giovan Battista Bellaso* w <time datetime="1553">1553</time> roku) rozwiązał ten problem wprowadzając **szyfr polialfabetyczny**. Zamiast jednego stałego przesunięcia, każda kolejna litera tekstu ma _**inne**_ przesunięcie, definiowane przez kolejne litery powtarzanego słowa-klucza.

Przez niemal <time>300</time> lat nazywano go *le chiffre indéchiffrable* (szyfr nie do złamania).

---

## 🎛️ Tabula Recta

Do ręcznego szyfrowania używano kwadratowej tablicy $26 \times 26$ zwanej **Tabula Recta** (Kwadrat Vigenère’a). Każdy kolejny wiersz to alfabet przesunięty o $1$ pozycję w lewo (czyli $26$ kolejnych wariantów Szyfru Cezara).

- **Kolumna** = litera tekstu jawnego
- **Wiersz** = litera powtarzanego klucza
- **Przecięcie** = litera zaszyfrowana

<data-vigenere-cipher
  text="LCN GOIOGP"
  key="KOALA"
  mode="decode">
</data-vigenere-cipher>

Zauważ, co dzieje się przy szyfrowaniu słowem-kluczem **KOALA**:

| Tekst jawny: |   B   |    o    |   n   |   ·   |   v   |    o    |   y   |    a    |   g   |   e   |
| :----------- | :---: | :-----: | :---: | :---: | :---: | :-----: | :---: | :-----: | :---: | :---: |
| Klucz:       |   K   |   *O*   |   A   |   ·   |   L   |   *A*   |   K   |   *O*   |   A   |   L   |
| Szyfrogram:  |   L   | _**C**_ |   N   |   ·   |   G   | _**O**_ |   I   | _**O**_ |   G   |   P   |


Litera **O** w słowie *Bon* (pod kluczem *O*) stała się _**C**_, ale ta sama litera **O** w słowie *voyage* (pod kluczem *A*) stała się _**O**_. Co więcej, zupełnie inna litera **A** (pod kluczem *O*) również stała się _**O**_!

Ta sama litera tekstu jawnego daje różne litery w szyfrogramie, a różne litery mogą dać ten sam znak w szyfrze. To całkowicie niszczy prostą analizę częstotliwościową.

---

## 🛠️ Generowanie Tabula Recta

Przygotujmy tabelę html, która bedzie prezentowała nam Tabula Recte z widgetu.

Przygotowałem styl CSS, który ładnie rozłoży składowe:
```css
body {
    background-color: #151515;
    color: #ebebeb;
}

th,
td {
    border: 1px solid #3D3D3D;
    min-width: 20px;
    min-height: 20px;
    text-align: center;
}

td:first-child {
    background-color: #0e3b63;
}

th {
    background-color: #470e63;
}

th:first-child {
    background-color: #630e0e;
}
```

Dalej w HTML-u wywołamy wcześniej przygotowany kod z rozkładem zawartości przesuwanych alfabetów:

```html
<table>
    <thead>
        <?php echo $thead; ?>
    </thead>
    <tbody>
        <?php echo $tbody; ?>
    </tbody>
</table>
```



Klasycznie tak jak wcześniej do zdobycia liter alfabetu łacińskiego wykorzystamy kodowanie ASCII i funkcję `chr()`:

```php
$thead = "<tr>";
$tbody = "";

for ($i = 65; $i <= 90; $i++) {
    $thead .= "<th>" . chr($i) . "</th>";
}
$thead .= "</tr>";
```
Jednak jak sam widzisz pierwszy element w tabula recta powinien być pusty albo zawierać jakiś losowy znaczek.

![](/public/courses/php/Images/alfabet-w-thead-tebeli.png)

Dlatego musimy cofnąć iterator startu o jeden i dla tego elementu wpisać np.: znak `✕`, który możesz użyć korzystając z windowsowego panelu emoji <kbd class="Win"></kbd> + <kbd>.</kbd> i przejdź do zakładki z symbolami.

![](/public/courses/php/Images/emoji-symbole.png)

```php
for ($i = 64; $i <= 90; $i++) {
    if ($i == 64) {
        $thead .= "<th> ✕ </th>";
        continue;
    }
    $thead .= "<th>" . chr($i) . "</th>";
}
```

Tym krótkim fragmentem kodu uzyskaliśmy estetyczny nagłówek tabeli:

![](/public/courses/php/Images/nagłówek-tabula-recta.png)

Tabula Recta w każdym kolejnym wierszu zaczyna się od litery z przesunieciem o $1$. Dla pierwszego wiersza zaczynamy od **$A$**, dla drugiego od **$B$** i tak dalej aż do ostatniego z literą **$Z$**. Utworzy nam się macierz czyli tablica dwuwymiarowa, a co za tym idzie skorzystamy z zagnieżdżonej pętli w pętli. 

```php
for ($i = 65; $i <= 90; $i++) {
    $tbody .= "<tr>";
    for ($j = 0; $j <= 25; $j++) {
        $tbody .= "<td>" . chr($i + $j) . "</td>";
    }
    $tbody .= "</tr>";
}
```

![](/public/courses/php/Images/pierwsza-wersja-tabula-recta.png)

Powyższy wynik ma dwa problemy:
- Po znaku **$Z$** nie wracamy do litery **$A$**.
- Ilość elementów wierszy nie zgadza się z ilością elementów w nagłówku.

Chcąc zapętlić wypisywanie liter alfabetu wykonamy podobny trik jak w poprzednich szyfrowaniach.  
Gdy suma iteratorów `$i` oraz `$j` przekroczy wartość $90$ (kod ASCII dla litery '**$Z$**'), musimy od tej sumy odjąć $26$, aby powrócić do wartości $65$ (kod ASCII dla litery '**$A$**').

Zmienimy nasz fragment pętli na poniższy:

```php
for ($i = 65; $i <= 90; $i++) {
    $tbody .= "<tr>";

    for ($j = 0; $j <= 25; $j++) {
        if ($i + $j > 90) {
            $k = ($i + $j) - 26;
        } else {
            $k = $i + $j;
        }
        $tbody .= "<td>" . chr($k) . "</td>";
        
    }
    $tbody .= "</tr>";
}
```

Zastosowano tu dodatkową zmienną pomocniczą `$k` by uniknąć sytuacji nadpisywania wartości dla zmiennych iteratorów `$i` lub `$j`.

By ilość elementów w wierszach zgadzała się z ilością kolumn w nagłówku musimy spojrzeć na konstrukcję Tabula Recty i zaważyć że każdy wiersz dla elementów $0$ i $1$ ma dokładnie tą samą wartość. Dlatego na koniec pętli wystarczy powtórzyć przypisanie elementu `<td>` gdy index `$j` jest równy $0$:

```php
if ($j == 0) {
    $tbody .= "<td>" . chr($k) . "</td>";
}
```

![](/public/courses/php/Images/tabula-recta.png)

## 🔩 Przekształcenie tabula recta na wzór matematyczny

Wszystko co istnieje i wszystkie koncepcje jesteśmy wstanie opisać matematyką. Dlatego spróbujmy przekształcić Tabula Recta w formułę matematyczną. 

Dla przykładu bierzemy dwa zestawy $PC$ i $CD$.  
Możemy na tą tablicę dwuwymiarową spojrzeć jak na rzut punktów w kartezjańskim układzie współrzędnych $OXY$ i uzyskać współrzędne odległości od przeciecia:

| X    | Y    |
| :--- | :--- |
| $17$ | $4$  |
| $4$  | $5$  |

Weźmy pierwsze współrzędne dla $PC$ by uzyskać $R$:
- Suma tych współrzędnych to: $17 + 4 = 21$
- Dodając ją do $65$ (bazowa wartość ASCII dla litery $\text{A}$), otrzymamy wartość $86$ (kod ASCII dla litery $\text{V}$).
- Miedzy oczekiwanym $R$, a uzyskanym $V$ znajdują się $3$ litery $S, T, U$
- Wszystkich liter jest $26$, więc $26 - 21 = 5$.
- By uzyskać $R$ $82$ to od $V$ $86$ musimy odjąć $4$. Gdy uznamy 5 za ilość a nie pozycję liczoną od zera to $- 1$ może okazać się rozwiązaniem
-  Na koniec uzyskujemy wzór: $65 + (17 + 4) - (26 - (17 + 4) -1) = 82$
-  Można go uprościć widząc że $(17 + 4)$ się zniwelują.
-  lecz końcowy wynik $65 - 27$ nie ma sensu, bo nie idzie go pod nic podstawić. Uzyskaliśmy stałą $39$ 🙄.

![](/public/courses/php/Images/błędna-analiza-Vigenere.png)


Spróbuj może poprawić odległości $XY$ dla $PC$:

Pomijamy pierwszy wiersz i nagłówek czyli od obu wartości odejmujemy 1:
- $X = 16$
- $Y = 3$

$65 + (16 + 3) = 84 \implies$ kod ASCII dla litery $\text{T}$

Zamiast pozycji potraktujmy te nowe współrzędne jako bias więc zamiast liczyć od $1$ to bedziemy liczyć od $0$

- $X = 15$
- $Y = 2$

$65 + (15 + 2) = 82 \implies$ kod ASCII dla litery $\text{R}$

Teraz udało nam się uzyskać oczekiwaną wartość dla $PC \implies R$, więc przetestujmy też $CD$:
- $X = 4 \implies 2$
- $Y = 5 \implies 3$

$65 + (2 + 3) = 70 \implies$ kod ASCII dla litery $\text{F}$

Krótko to implementując uzyskamy następujący kod:

```php
$test_word = "CD";
$value = "";

$alphabet = [];

for($i = 65; $i<=90; $i++){
    $alphabet[]=chr($i);
}

print_r($alphabet);

$xy = 0;
for($i=0; $i < strlen($test_word); $i++){
    $xy += array_search($test_word[$i], $alphabet, true);
}

$value = chr(65+$xy);

echo "value: " . $value;
```

![](/public/courses/php/Images/wyszukiwanie-wartości-przekątnej-x-y-w-tabula-recta.png)


## 🧰 Implementacja szyfru Vigenère’a

Skoro udało nam się wygenerować Tabula Recta i przy pomocy matematyki zaszyfrować z współrzędnych $xy$ wartość na prawidłową literę w przekątnej to nadszedł czas by stworzyć wreszcie algorytm szyfrowania. 

Przygotujmy zmienne:

```php
$tekst = "TESTOWY"; // 7 znaków
$key = "KLUCZ"; // 5 znaków
$encrypt = "";
```

Z komentarzy możesz już zauważyć pierwszy problem. Tekst jest dłuższy niż klucz.  
By każdy znak tekstu $P_i$ miał swój odpowiednik w kluczu $K_i$ klucz powinien być powtarzany.

Rozwiązanie jest relatywnie proste gdy skorzystamy z matematyki i operacji modulo (`%` - reszta z dzielenia).

```php
for($i = 0; $i < strlen($tekst); $i++){
    echo $tekst[$i] . " <=> " . $key[$i % strlen($key)] . "\n";
}
```

![](/public/courses/php/Images/powtarzanie-klucza-wzgledem-dłógości-tekstu.png)


Wykorzystajmy wszystkie nasze odkrycia i złóżmy je w gotowy kod szyfrujący Vigenère’m.
W alfabecie wyszukujemy pozycję zgodną z literą tekstu i przypisujemy ją do zmiennej $x$.  
Podobnie postępujemy z literą powtarzanego klucza i przypisujemy ją do $y$.  

By uzyskać zaszyfrowaną wartość sumujemy `$x`, `$y` i $65$, które w ASCII odpowiada literze $A$.  
Na koniec przekształcamy uzyskany wynik z powrotem na literę z pomocą funkcji `chr()`.

```php
$alphabet = [];

for ($i = 65; $i <= 90; $i++) {
    $alphabet[] = chr($i);
}

$tekst = "TESTOWY"; // 7 znaków
$key = "KLUCZ"; // 5 znaków
$encrypt = "";

$key_length = strlen($key);

for ($i = 0; $i < strlen($tekst); $i++) {

    $x = array_search($tekst[$i], $alphabet, true);
    $y = array_search($key[$i % $key_length], $alphabet, true);

    $encrypt .= chr(65 + $x + $y);

    echo $tekst[$i] . " <=> " . $key[$i % $key_length] . " ==> " . $encrypt . "\n";
}

echo $encrypt;
```

Uzyskany wynik nie jest poprawny poza dwoma pozycjami $2$ i $4$.  

![](/public/courses/php/Images/początkowa-implementacja-vigenera.png)

Wynika to z tego że, przekraczamy ciągle zakres $65 - 90$ dużych liter alfabetu:
$T (19) + K (10) + 65 = 94 ($^$)$

Możemy to prosto naprawić modyfikując wartość `$encrypt`.

Gdzie początkowo `$x` i `$y` dawały sumę $T (19) + K (10) = 29$

```php
$encrypt .= chr(65 + $x + $y);
```
Natomiast gdy tą sumę potraktujemy przez modulo $26$ uzyskamy: $T (19) + K (10) = 29 \quad| \bmod 26 = 3 \implies D$

```php
$encrypt .= chr(65 + ($x + $y) % 26);
```

---

## 🛞 Analiza działania na przypadkach brzegowych


Lecz można zauważyć kolejny problem z algorytmem gdy tekst do zaszyfrowania nie bedzie dużymi literami:

```php
$tekst = "TESTOWY test";
$key = "KLUCZ";
```
| Powinniśmy uzyskać: |   D   |   P   |   M   |   V   |   N   |   G   |   J   |   ·   |   n   |   g   |   r   |   d   |
| :-----------------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Jednak uzyskaliśmy: |   D   |   P   |   M   |   V   |   N   |   G   |   J   |   U   |   C   |   Z   |   K   |   L   |

Aby tą problematykę rozwiązać to musimy zadziałać podobnie jak w wcześniejszych algorytmach szyfrowania.  
Stworzyć flagi sprawdzające czy dany znak na którym operujemy z tekstu jest małą albo dużą literą:

```php
$is_upper = ctype_upper($tekst[$i]);
$is_lower = ctype_lower($tekst[$i]);
```
Dodatkowo w szyfrowaniu Vigenère'a znak w kluczu nie może być nieprzerwanym ciągiem. Dla pozycji w tekście, która nie jest literałem wartość z klucza musi być pominięta. Dlatego potrzebujemy do tego zmienną zliczającą te przypadki i będącą zadeklarowaną poza pętlami:
```php
$key_length = strlen($key);
$key_skip = 0;
```
Następnie tą nową zmienną należy modyfikować inkrementacją tylko dla przypadków nie literalnych.  
Dlatego potrzebujemy instrukcji warunkowej _**`if`**_ sprawdzającej negację na bramce $AND$

Bramka AND zwróci `true` tylko gdy obie wartości są `true`.  
Jeżeli trafimy na dużą literę to `$is_upper` będzie $1$ a jego negacja (`!`) da $0$:

$0 \text{ AND } 1 \quad \rightarrow \quad \textbf{0}$

Znak nie może być jednocześnie dużą i małą literą więc $1$ $1$ nie wystąpią, a raczej ich negacja nie wystąpi. Co za tym idzie negując to dla przypadku gdy znak nie jest ani dużą ani małą literą uzyskamy:

$1 \text{ AND } 1 \quad \rightarrow \quad \textbf{1}$

i wtedy wykonujemy `continue` by tą iterację po stringu pominąć i pozostawić bez zmian.  
> Dodatkowo inkrementujemy zmienną `$key_skip` (zwiększamy ją o $1$).

```php
if (!$is_upper && !$is_lower) {
    $encrypt .= $tekst[$i];
    $key_skip++;
    continue;
}
```

Musimy jeszcze uwzglęnić w obliczeniach pozycji `$y` zmienną `$key_skip`:

```php
$y = array_search($key[$i % $key_length], $alphabet, true);
```
Zmieniamy na:
```php
$y = array_search(strtoupper($key[($i - $key_skip) % $key_length]), $alphabet, true);
```

W ten sposób rozwiązaliśmy problem z przesunięciem i przygotowaliśmy większość kodu pod uwzględnienie dużych i małych liter.  
Pozostało nam tylko na bazie jednej z flag zwrócić zaszyfrowany znak z odpowiedniego zakresu ASCI:
- Duża litera: $65 - 90$
- Mała litera: $97 - 122$

```php
if ($is_upper) {
    $encrypt .= chr(65 + ($x + $y) % 26);
} else {
    $encrypt .= chr(97 + ($x + $y) % 26);
}
```

![](/public/courses/php/Images/szyfrowanie-vigenerem.png)

## ✨ Dopieszczanie i refaktoryzacja funkcji

Jak zauważyłeś cały kod już został zamieszczony w funkcji:
> PS.: Tu już jest poprawiona literówka gdzie w `$isEncrypt` zamiast `y` było `i`
```php
function vigenere(string $tekst, string $key, bool $isEncrypt = false): string {}
```
Zanim napiszemy instrukcję warunkową _**`if`**_ to czy pamiętasz jej skróconą wersję zapisu?

```php
$zmienna = (warunek) ? "wartość jeśli true" : "wartość jeśli false";
```
Mając zapis strukturalny tej instrukcji warunkowej _**`if`**_:

```php
if ($is_upper) {
    $encrypt .= chr(65 + ($x + $y) % 26);
} else {
    $encrypt .= chr(97 + ($x + $y) % 26);
}
```
Można bardzo łatwo przekształcić ją na jednolinijkową bo zarówno _**`if`**_ jak i _**`else`**_ wykonują tylko jedną operację w swoich ciałach.

```php
$encrypt .= $is_upper ? chr(65 + ($x + $y) % 26) : chr(97 + ($x + $y) % 26);
```

> Dopiszmy ostatnią brakującą funkcjonalność.

Dla $i$-tej litery tekstu $P_i$ i odpowiadającej jej litery klucza $K_i$:

- **Szyfrowanie:**
  $$C_i = (P_i + K_i) \bmod 26$$
- **Deszyfrowanie:**
  $$P_i = (C_i - K_i + 26) \bmod 26$$

Dodanie $+26$ przy deszyfrowaniu zapobiega ujemnym wynikom przed wykonaniem operacji modulo (tzw. problem przesunięcia w lewo w arytmetyce reszt).

Znowu więc zmodyfikujemy wynik przypisywany do zmiennej `$encrypt`. Tym razem zamiast pisać na sztywno formułę szyfrowania Vigenère'a (`($x + $y) % 26`) to przygotujemy zmienna przesunięcia `$shift`, która w zależności czy mowa o szyfrowaniu czy deszyfrowaniu przyjmie wartość albo `($x + $y) % 26` albo `($x - $y + 26) % 26`.

```php
$shift = $isEncrypt ? ($x - $y + 26) % 26 : ($x + $y) % 26;
$encrypt .= $is_upper ? chr(65 + $shift) : chr(97 + $shift);
```

W efekcie końcowym uzyskujemy następującą postać kodu:

```php
/**
 * Funkcja szyfrująca i deszyfrująca tekst przy pomocy Vigenera.
 *
 * @param string $tekst Ciąg znaków do zaszyfrowania lub odszyfrowania
 * @param string $key Klucz do procesu szyfrowania/deszyfrowania
 * @param boolean $isEncrypt czy tekst jest zaszyfrowany?
 * @return string Zwraca podany tekst w formie zaszyfrowanej lub odszyfrowanej
 */
function vigenere(string $tekst, string $key, bool $isEncrypt = false): string
{
    $alphabet = [];
    for ($i = 65; $i <= 90; $i++) {
        $alphabet[] = chr($i);
    }
    $encrypt = "";
    $key_length = strlen($key);
    $key_skip = 0;
    for ($i = 0; $i < strlen($tekst); $i++) {
        $is_upper = ctype_upper($tekst[$i]);
        $is_lower = ctype_lower($tekst[$i]);

        if (!$is_upper && !$is_lower) {
            $encrypt .= $tekst[$i];
            $key_skip++;
            continue;
        }
        $x = array_search(strtoupper($tekst[$i]), $alphabet, true);
        $y = array_search(strtoupper($key[($i - $key_skip) % $key_length]), $alphabet, true);
        $shift = $isEncrypt ? ($x - $y + 26) % 26 : ($x + $y) % 26;
        $encrypt .= $is_upper ? chr(65 + $shift) : chr(97 + $shift);
    }
    return $encrypt;
}
$tekst = "TESTOWY test"; $key = "KLUCZ";
echo vigenere($tekst, $key,);
echo "\n";
echo vigenere("DPMVNGJ ngrd", $key, $isEncrypt = true);

```

![](/public/courses/php/Images/finalna-funkcja-szyfru-vigenera.png)
