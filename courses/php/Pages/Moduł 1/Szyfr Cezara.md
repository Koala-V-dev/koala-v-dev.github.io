# Szyfr Cezara

Szyfr Cezara to jeden z najprostszych algorytmów szyfrowania, polegający na zamianie każdej litery tekstu jawnego na literę oddaloną od niej w alfabecie o stałą liczbę pozycji.

Wikipedia PL: [Szyfr Cezara](https://pl.wikipedia.org/wiki/Szyfr_Cezara)

W starożytności używano poniższej tarczy do szyfrowania i deszyfrowania poufnej korespondencji.

<data-caesar-wheel></data-caesar-wheel>

Rozróżnia się szyfry przesunięcia o pozycja jak przesuniecie o:
- $3$ pozycje (szyfr Cezara)
- $13$ pozycji (szyfr Rot13)
- $-1$ pozycje (szyfr adoptowanego syna Cezara, Oktawiana Augusta)
- $1$ pozycję i zapisywany po drugiej stronie pergaminu (scytale - żydowski wariant)


## ↔️ Konwersje miedzy znakami a liczbami

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


## 🪙 Szyfrowanie i deszyfrowanie Cezarem

Na początek weźmy pod uwagę tylko duże litery łacińskie:  
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
  > Zupełnie inaczej jest gdy sprawdzasz jednocześnie wartość i typ by zapobiec pominieciu wykonania operacji w np.: tablicy dla indexu $0$ gdy funkcja może jednocześnie zwracać `int`, `string` lub `bool`. Wtedy bezwarunkowo musisz użyć:
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

### ↔️ Wartości graniczne zakresu

Gdy wartość ma być cofnięta o $3$ a wynik bedzie mniejszy od $65$ musimy dodać do tego $26$ co spowoduje zapętlenie w obrębie tego zakresu.

Przykłady:

*A* $= 65$: $65 - 3 = 62 \quad \rightarrow \quad 62 + 26 = 88 =$ **X**

*A, B, C, D, E,* ... **V, W, X, Y, Z**

... **V, W, X, Y, Z,** *A, B, C, D, E* ...

Adekwatnie zabezpieczmy szyfrowanie gdzie przesuniecie jest dodatnie ($+3$):

*Z* $= 90$: $90 + 3 = 93 \quad \rightarrow \quad 93 - 26 = 67 =$ **D**

> Ale w programowaniu operujemy na biasie więc nie **D** a **C**. To znaczy że $67 - 1 = 66 = $**C**

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

Wtedy wywołując: 
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

Wkradły się tu niepożądane wyniki znaków przesunięcia spacji `#` i `7` 

---

### 🔀 Filtr wejścia przed nie-literami

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
> Wartość w nawiasach `()` zostanie jawnie rzutowana na `(bool)`. Ponieważ operatory porównania `>` `<` `>=` `<=` zwracają domyślnie ten typ. Zapisanie warunków w nawiasach też nie jest konieczne. Jednak dla mnie wygląda to czytelniej. 

To teraz by zablokować operacje na nie literach wystarczy prosty if sprawdzający negację którejś z flag:

```php
if(!$isUpper && !$isLower){
    continue;
}
```

Bramka AND zwróci `true` tylko gdy obie wartości są `true`.  
Jeżeli trafimy na dużą literę to `$isUpper` będzie $1$ a jego negacja (`!`) da $0$:

$0 \text{ AND } 1 \quad \rightarrow \quad \textbf{0}$

Znak nie może być jednocześnie dużą i małą literą więc $1$ $1$ nie wystąpią, a raczej ich negacja nie wystąpi. Co za tym idzie negując to dla przypadku gdy znak nie jest ani dużą ani małą literą uzyskamy:

$1 \text{ AND } 1 \quad \rightarrow \quad \textbf{1}$

i wtedy wykonujemy `continue` by tą iterację po stringu pominąć i pozostawić bez zmian.

```php
/**
 * Szyfrowanie i odszyfrowywanie z przesunięciem Cezara (o 3)
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
