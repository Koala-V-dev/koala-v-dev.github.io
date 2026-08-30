# Szyfrowanie XOR i Binarka (OOP)

Pisząc kod, robimy to strukturalnie realizując by rozwiązać problem. Gdy problem można rozłożyć na wiele podproblemów, to wydzielamy wcześniej napisany kod w funkcje jako naszych pracowników by potem je wykorzystać do rozwiązania większego problemu. Mamy wtedy klarownie wydzielony kod bez konieczności większego powtarzania go. Przy wiekszej złożoności i szybkim rozroście oprogramowania napotykamy ponownie na problem, który funkcje miały rozwiązać. Tworzą nam się specjaliści którzy mają identyczne lub bardzo zbliżone fragmenty kodu bez którego nie zrealizują swojej roboty.


Co powiesz na mechanizm polegający na stworzeniu takiej funkcji bazowej zawierającej część wspólną tych wszystkich pozostałych specjalistów? Tu z pomocą przychodzi programowanie zorientowane obiektowo **OOP** (*Object Oriented Programming*).

Weźmy na warsztat smartphone. Ma on swoje właściwości fizyczne i funkcjonalności:
- Grubość
- Wysokość
- Szerokość
- Producent
- Model
- Waga
- Pojemność baterii
- Pojemność pamięci RAM

Jego funkcjonalnością jest uruchomienie systemu operacyjnego i zasilenie podzespołów.

```php
$OS = new Android($bateria, $pamiecRAM, $głośnik, $procesor, $matryca, $mikrofon, $czujniki);
```

System to natomiast główna instancja **Klasy** operacyjnej czyli zdefiniowanych przepisów na metody i właściwości:

```php
class Android {
    private $bateria;
    private $pamiecRAM;
    private $głośnik;
    private $procesor;
    private $matryca;
    private $mikrofon;
    private $czujniki;

    public function __construct($bateria, $pamiecRAM, $głośnik, $procesor, $matryca, $mikrofon, $czujniki) {
        $this->bateria = $bateria;
        $this->pamiecRAM = $pamiecRAM;
        $this->głośnik = $głośnik;
        $this->procesor = $procesor;
        $this->matryca = $matryca;
        $this->mikrofon = $mikrofon;
        $this->czujniki = $czujniki;
    }

    public function uruchomAplikację($NazwaAplikacji) {
        //...
    }

    public function getStatusBaterii(): int {
        $poziomBaterii = $this->bateria;
        //... Analiza wskaźników i komunikatów fizycznych komponentu
        return $poziomBaterii;
    }
}
```

Gdy uruchomisz smartphone i powstanie główna instancja klasy systemowej, która jest tak zwanym _**singletonem**_, to jako użytkownik będziesz się do niej zwracać by wywołać metodę publiczną np. uruchomienia aplikacji:

```php
$OS->uruchomAplikację('Galeria');
```
> Dodatkowo na pasku statusowym cały czas widzisz stan baterii czyli wynik wywoływania co $0.5s$ funkcji publicznej **`getStatusBaterii()`** z klasy Android.

Gdy zostanie uruchomiona aplikacja *Galeria* to  tak naprawde powstanie kolejna instancja klasy którą bedzie przechowywać *`$OS`*. To właśnie w tym momencie ujawnia się główny atut programowania obiektowego...

---

Uruchamiając jakąkolwiek aplikację można wyróżnić ich elementy wspólne np.: to że każda ma **UI** (*User interface* - interfejs użytkownika). Dlatego zamiast implementować tę funkcjonalność w każdej klasie osobno tworzymy jedną klasę bazową z funkcjonalnością interfejsu użytkownika i dziedziczymy z niej dla każdej aplikacji.

```php
class AplikacjaBazowa {
    private $ui;

    public function __construct() {
        $this->ui = new UI();
    }

    public function getUI(): UI {
        return $this->ui;
    }
}
```
Wtedy każda uruchomiona aplikacja dziedziczy z klasy bazowej i ją rozszerza o własne właściwości i metody:

```php
class Galeria extends AplikacjaBazowa {
    //...
}
```

---

Dlaczego to podejście jest takie fajne?
- **Separacja odpowiedzialności**: Naturalnym jest to by klasy zapisywać jako oddzielne pliki zawierające tylko to co dana klasa ma realizować. Ani więcej ani mniej.
- **Czytelność kodu**: Klasy plików są krótkie bo nie trzeba ich $x$ czasu scrollować, a przez to czytelniejsze (Ja osobiście stosuję zasadę klas o maksymalnej długości około $600$ linii 😎).
- **Łatwość pracy w zespołach**: Dzieki pracy na oddzielnych plikach, łatwiej podzielić się obowiązkami. Ktoś zrobi $Router$, ktoś $Validator$.
- **Nowe możliwości które dają nam wzorce projektowe**: Wzorce projektowe to przepisy na rozwiazania typowych problemów programistycznych, które wielokrotnie pojawiły się w innych projektach. Programiści by je rozwiązać tworzyli intuicyjnie kod, który okazywał się niezależnie jako bardzo zbliżony do siebie. Przykładem jest wcześniej wspomniany  _**Singleton**_, wzorzec który rozwiązuje poniższy problem:

---

Mamy klasę prawdy, która ma przechowywać stany gry i graczy. Mamy też klasy elementów gry i samych postaci graczy. Załóżmy że jest to strzelanka i jeden z graczy trafił drugiego. Jeżeli ta informacja ma  zostać odnotowana w klasie prawdy to napotykamy na problem możliwości tworzenia każdorazowo nowej instancji i dopiero wtedy zmiana jej stanu.

Widzisz problem? Wiele instancji i każda ma inny stan.  
Dlatego by to rozwiązać to metody rejestrujące obrażenia zanim stworzą nową instancję klasy prawdy sprawdzają czy taka klasa już istnieje i jeżeli istnieje to do swojego pojemnika (zmiennej) przypiszą nie nową instancję, a referencję do istniejącego obiektu w przestrzeni programu gry.

```php
//singleton

class Singleton {
    private static $instance = null;
    private function __construct() {
        //...
    }
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Singleton();
        }
        return self::$instance;
    }
}
```

---

## 🎪 Własna klasa w oddzielnym pliku

Ok, skoro już zapoznałeś się z ideą OOP to czas ją wdrożyć. Są pewne zasady, których należy przestrzegać.

- Klasy piszemy z dużej litery np. 
  - Klasa $User$
  - Klasa $Product$
  - Klasa $ProductCategory$
- Funkcje w klasach nazywamy metodami.
- Plik zawierający definicję klasy musi mieć taką samą nazwę jak sama klasa.
- Przestrzeń nazw powinna reprezentować strukturę katalogową


Budowę klasy w php zaczynamy oczywiście od rozpoczęcia znacznika `<?php`, którego nie trzeba kończyć zamykającym `?>` gdy w pliku bedzie tylko sam kod PHP.  
Następnie zapisujemy deklarację że bedziemy pisać z ścisłym typowaniem.  
Kolejnym krokiem bedzie określenie przestrzeni nazw (_**`namespace`**_). To pozwoli na separację i pisania metod o tej samej nazwie co natywnie dostępne w PHP np. *`sort()`*. Dla przypadków gdy faktycznie chcemy skorzystać w klasie z natywnej metody PHP odwołujemy się do niej z prefiksem **<code>&#92;</code>** np. **`\sort()`**.  

---

Dopiero teraz możemy zacząć pisać deklarację klasy:

```php
<?php
declare(strict_types=1);
namespace App;

class Binarka {
    // ...
}
```

By skorzystać z tej klasy w innym pliku musimy dołączyć do niego zawartość jej definicji. Możemy to zrobić na $4$ sposoby:

1. **`require`** - Wymusza wykonanie pliku i wyrzuca błąd fatalny jeśli nie uda się go dokleić do kodu.
2. **`require_once`** - Działa jak `require` ale dodatkowo sprawdza czy plik nie został już dołączony.
3. **`include`** - Wymusza wykonanie pliku i zwraca ostrzeżenie jeśli nie uda się go dokleić do kodu.
4. **`include_once`** - Działa jak `include` ale dodatkowo sprawdza czy plik nie został już dołączony.

> Dlatego tak ważne jest nazywanie pliku klasy tą samą nazwą co sama klasa, ułatwia to rozeznanie się w kodzie.

Weźmy na początek taką definicję pliku `Binarka.php`:
```php
<?php
declare(strict_types=1);
namespace App;

class Binarka {
    /**
     * @var int
     */
    public $liczba1;
    /**
     * @var int
     */
    private $liczba2;
    /**
     * @var int
     */
    protected $liczba3;

    public function __construct(int $liczba2)
    {
        $this->liczba1=11;
        $this->liczba2=$liczba2;
        $this->liczba3=33;
        echo $this->liczba2 . "\n";
    }
}
```
Mamy zadeklarowane trzy zmienne o różnym stopniu dostępności oraz metodę konstruktora _**`__construct()`**_, która jest automatycznie wykonywana podczas tworzenia nowej instancji klasy.
- *`public`* - Dostępna wszędzie
- **`private`** - Dostępna tylko w klasie
- _**`protected`**_ - Dostępna w klasie i klasach dziedziczących

Aby lepiej zrozumieć te klauzule dostępności załóżmy że jesteś klasą pochodną rodzica, a rodzic coś zamówił w internecie.
- *Zmienna publiczna to nr. telefonu rodzica.* Ty go znasz, rodzic go zna i kurier też go zna.
- **Zmienna prywatna to informacja co rodzic zamówił.** Ty i kurier tego nie wiecie, a rodzic już tak.
- _**Zmienna chroniona to PIN do telefonu twojego rodzica.**_ Ty i rodzic go znacie, ale kurier juz nie.

Popatrz na poniższy zrzut ekranu.
![](/public/courses/php/Images/php-oop-klasa-i-zmienne-dostepu.png)

Mamy $2$ pliki:
- `index.php`: pierwszy główny plik uruchamiany przez server.
- `Binarka.php`: klasa z której korzystamy i która jest przechowywana w katalogu `Core\`.

By móc się odwołać do zmiennej lub metody klasy `Binarka` musisz wskazać zmienną zawierającą instancję tej klasy lub w przypadku gdy chcesz odwołać się sam do siebie np.: wewnątrz klasy to stosujesz specjalną zmienną `$this`.

Jeżeli klasa od samego początku istnienia potrzebuje jakiś danych to zapisujesz je w metodzie konstruktora. Wtedy bez tych danych przy budowie instancji PHP zwróci error.

W podglądzie działania zobaczysz że PHP zwrócił echo z konstruktora:
```php
echo $this->liczba2 . "\n";
```
Następnie echo z indexu w którym odwołano się do zmiennej publicznej `$liczba1`:
```php
echo "Publiczna z instancji klasy: " . $bin->liczba1;
```

Oraz Fatalny Error ze względów na próbę dostępu do zmiennej prywatnej. Tak samo by było dla przykładu zmiennej chronionej `$liczba3`. Ponieważ index nie dziedziczy po klasie `Binarka`. Dodatkowo IDE (*Integrated Development Environment*) podkreśliło na czerwono obie te zmienne.

---

## 🧮 Operacje Binarne

Zapewne znasz procedurę na przekształcenie wartości dziesiętnej do systemu dwójkowego/binarnego. Przypomnijmy ją sobie na przykładzie liczby $22$:

Wartość dziesiętną dzielimy przez $2$ i zapisujemy resztę. Potem z wyniku pozbywamy się wartości po przecinuku $\frac{1}{2}$ i znowu dzielimy przez dwa powtarzając proces. Gdy napotkamy $0$ zatrzymujemy działanie i przepisujemy reszty od końca do początku. W ten sposób otrzymamy $22_{10}$ = $10110_2$.

```
22 | 0
11 | 1
 5 | 1
 2 | 0
 1 | 1
 0 | 
```

Zapisując to w kodzie php otrzymamy:

```php
$liczba = 22;
$bin = "";
while ($liczba!=0){
    $bin = $liczba % 2 . $bin;
    $liczba = ($liczba - $liczba % 2) / 2;
}
echo "Liczba " . $liczba . " w zapisie binarnym to: " . $bin;
```

Podobnie będą wyglądać operacje konwersji dziesiętnego na octalny (ósemkowy) i heksadecymalny (szesnastkowy).

Przykład konwersji heksadecymalnego na dziesiętny w PHP:

```php
$liczba = 22;
$bin = "";
while ($liczba!=0){
    $wynik = $liczba % 16;
    $liczba =($liczba - $liczba % 16) / 16;
    switch($wynik){
        case 10: $bin = "A" . $bin; break;
        case 11: $bin = "B" . $bin; break;
        case 12: $bin = "C" . $bin; break;
        case 13: $bin = "D" . $bin; break;
        case 14: $bin = "E" . $bin; break;
        case 15: $bin = "F" . $bin; break;
        default: $bin = $wynik . $bin;
    }
}
echo $bin;
```

> Zapisz samodzielnie implementację konwersji z dziesiętnego na oktalny (ósemkowy).

---

### 🏗️ Budowa klasy Binarka


Zapełnijmy naszą klasę `Binarka` metodami konwersji miedzy systemami:

```php
<?php
declare(strict_types=1);

namespace App;

/**
 * Klasa metod do przeprowadzania działań binarnych
 */
class Binarka
{

    /**
     * Konwersja dziesiętnego na binarny
     * @param int $decimal
     * @return array<int> Zwraca tablicę liczb będących binarną reprezentacją podanej liczby,
     * zapisaną w prawidłowej kolejności (od potęgi $n$ do $0$)
     */
    function decToBin(int $decimal): array
    {
        $bin = [];
        while ($decimal != 0) {
            array_unshift($bin, $decimal % 2);
            $decimal = ($decimal - $decimal % 2) / 2;
        }

        return $bin;
    }

    /**
     * Konwersja binarny na dziesiętny
     * @param array<int> $binary Tablica poszczególnych cyfr zapisana w prawidłowej kolejności
     * (od potęgi $n$ do $0$)
     * @return int Zwraca liczbę dziesiętną będącą wynikiem konwersji
     */
    function binToDec(array $binary): int
    {
        $dec = 0;
        $counter = count($binary);
        foreach ($binary as $bin) {
            $counter--;
            $dec += $bin * (2 ** $counter);
        }

        return $dec;
    }
}
```

![](/public/courses/php/Images/Klasa-Binarka-bin-metody.png)

---

### ⊕ Metoda operacyjna XOR

Nie bez powodu metoda `decToBin()` zwraca wartości w tablicy. Będziemy mogli przekazać każdy jej bit i podać go operacji bramki XOR.

Tabela logiczna bramki XOR:

|   A   |    B    |   XOR   |
| :---: | :-----: | :-----: |
|  *0*  | **_0_** | _**0**_ |
|  *0*  | **_1_** | _**1**_ |
|  *1*  | **_0_** | _**1**_ |
|  *1*  | **_1_** | _**0**_ |

<data-logic-gate type="XOR" id="xor-gate"></data-logic-gate>

Metoda po obserwacji tablicy logicznej bramki XOR jest bardzo prosta. Gdy $A$ oraz $B$ są takie same to wynikiem jest $0$, w przeciwnym wypadku wynikiem jest $1$.

```php
/**
 * Wykonuje operację XOR na dwóch podanych bitach
 *
 * @param integer $A Pierwszy bit
 * @param integer $B Drugi bit
 * @return integer Wynik opercji XOR
 */
function calculateXOR(int $A, int $B): int{
    if($A === $B){
        return 0;
    }
    return 1;
}
```
Test przypadków:
```php
$bin = new App\Binarka();

echo "0 ⊕ 0 : " . $bin->calculateXOR(0,0) . "\n";
echo "1 ⊕ 0 : " . $bin->calculateXOR(1,0) . "\n";
echo "0 ⊕ 1 : " . $bin->calculateXOR(0,1) . "\n";
echo "1 ⊕ 1 : " . $bin->calculateXOR(1,1) . "\n";
```

Jak widać na poniższym obrazku wyniki zgadzają się z tabelą logiczną bramki XOR.

![](/public/courses/php/Images/metoda-xor-w-klasie-binarka.png)

---

### ↔️ Metoda konwersji pomiędzy binarnym a heksadecymalnym

Jeden znak systemu binarnego odpowiada zapisowi $4$ znaków w systemie dwójkowym:

|  Hex  | Bin  |
| :---: | ---- |
|  $0$  | 0000 |
|  $1$  | 0001 |
|  $2$  | 0010 |
|  $3$  | 0011 |
|  $4$  | 0100 |
|  $5$  | 0101 |
|  $6$  | 0110 |
|  $7$  | 0111 |
|  $8$  | 1000 |
|  $9$  | 1001 |
|  $A$  | 1010 |
|  $B$  | 1011 |
|  $C$  | 1100 |
|  $D$  | 1101 |
|  $E$  | 1110 |
|  $F$  | 1111 |

Na pierwszy rzut oka kusi użycie _**`switcha`**_. Jednak podejdźmy do tego trochę inaczej.  
Z góry znamy wszystkie przypadki, mamy je w tabelce powyżej. Przygotujmy więc tak zwaną mapę przypadków zapisaną w strukturze tablicy assocjacyjnej:

```php
$mapHexBin = [
    "0" => "0000",
    "1" => "0001",
    "2" => "0010",
    "3" => "0011",
    "4" => "0100",
    "5" => "0101",
    "6" => "0110",
    "7" => "0111",
    "8" => "1000",
    "9" => "1001",
    "A" => "1010",
    "B" => "1011",
    "C" => "1100",
    "D" => "1101",
    "E" => "1110",
    "F" => "1111",
];
```
Pozostańmy przy typie `string` dla obu metod konwersji. Pozwoli nam to na skorzystanie z mapy i napisanie bardzo krótkich metod:
1. Konwersja heksadecymalnego na binarny przy użyciu mapy polega na zwruceniu wartości z mapy dla danego klucza znaku heksadecymalnego przekazanego jako paraqmetr metody:
    ```php
    function hexToBin(string $hex): string{
        return (string)$this->mapHexBin[$hex];
    }
    ```
2. Konwersja binarna na heksadecymalny przy użyciu mapy polega na wyszukaniu i zwruceniu klucza wskazującego na wartość przekazaną jako parametr metody:
    ```php
    function binToHex(string $bin): string{
        return (string)array_search($bin, $this->mapHexBin);
    }
    ```

![](/public/courses/php/Images/konwersja-hex-bin-z-mapowaniem.png)

---

## 🔐 Szyfr XOR

Zbudujmy kolejną klasę nazwaną `XORCrypt` dziedziczącą z klasy `Binarka` i przetestujmy cechę dziedziczenia.  
Skoro nowa klasa jest potomną po `Binarka` to zachodzi podobna sytuacja jak w biologii. Dzieci mogą mieć ten sam kolor oczu co ich rodzice. Więc klasa `XORCrypt` będzie posiadała w swoim asortymencie odziedziczone zmienne publiczne i chronione oraz metody rodzica:

```php
<?php
declare(strict_types=1);
namespace App\Core;
require_once 'Binarka.php';
use App\Binarka;

class XORCrypt extends Binarka{

    function test(string $hex){
        return $this->hexToBin($hex);
    }
}
```

Jak widzisz na poniższym obrazku klasa `XORCrypt` może od tak sobie korzystać z metody `hexToBin()` z klasy `Binarka`:

![](/public/courses/php/Images/dziedziczenie-metod-z-binarka.png)

> [!WARNING]
> Zwróć uwagę na obie linie `require_once`. W `XORCrypt` jest tam sama nazwa z rozszerzeniem pliku zawierającym klasę Binarka ponieważ oba pliki znajdują się w tym samym katalogu. Czyli są na tym samym poziomie struktury katalogowej. Natomiast względem indexu oba pliki z klasami są w podfolderze: `Core\` dlatego w `index.php` musi być `Core\Binarka.php`. Natomiast to rze u mnie istnieje prefix `./` to wynika z tego że mam większą pewność użycia relatywnego odniesienia względem lokalizacji pliku w którym to zapisałem. Jeżeli chciałbym z jakiegoś powodu w którejś z klas zaimportować `index.php` zapisałbym to tak: `../index.php`, gdzie dwie kropki i slesz wskazują na konieczność wejścia na wyższy poziom struktury katalogów.

OK, popatrz na poniższy widget prezentujący działanie algorytmu szyfrowania XOR:
<data-xor-cipher text="TAJNE" key="KOD"></data-xor-cipher>


Jak widzisz w algorytmie szyfrowania XOR dochodzi do następującej procedury:
1. Konwersja znaku tekstu jawnego na dziesiętny zgodnie z ASCII
2. Konwersja znaku klucza na dziesiętny zgodnie z ASCII
3. Wynik w zapisie bajtowym, heksadecymalnym. To oznacza $2$ znaki hex, ponieważ pojedynczy znak heksadecymalny to połowa bajta czyli nibble.

Punkt trzeci wskazuje na konieczność zmodyfikowania zawartości klasy `Binarka`. Musimy zadbać o wyrównanie bajtowe czyli zawsze działać na $8 \text{ bitach}$.

Dopiszmy więc kolejną metodę wyrównania do Bajta:

```php
/**
 * Wyrównanie zapisu binarnego do bajta
 * 
 * @param string $bin Zapis binarny do wyrównania
 * @return string Wyrównany zapis binarny do bajta
 */
function alignmentToBajt(string $bin): string{
    $alignment = "";
    for($i = 0; $i < 8 - strlen($bin); $i++){
        $alignment.="0";
    }
    return $alignment . $bin;
}
```
Przemianujemy też metodę `binToHex()` na wariant pomocniczy. Dużo poza nazwą się nie zmieni:
```php
function binToHexHelper(string $bin): string
{
    return (string)array_search($bin, $this->mapHexBin);
}
```

Teraz możemy napisać nową metodę `binToHex()`, która bedzie przyjmować tylko i wyłącznie string zapisu binarnego o długości $8$ znaków by uzyskać pełen bajt.  
Przy pomocy `str_split($bin, 4)` dokonamy podziału tego stringa na równej długości czteroznakowe teksty.

![](/public/courses/php/Images/str_split-na-4.png)

Każdy z otrzymanych tekstów, czyli 4-bitowy zapis binarny, będzie przekazywany do metody $binToHexHelper()$, która nam poda odpowiadający znak heksadecymalny.  

Na koniec zwracamy konkatenację tych wyników:

```php
function binToHex(string $bin): string
{
    if(strlen($bin)!=8){
        return "Podano zapis binarny o innej długości niż 8 bitów (0/1)";
    }
    $hex0 = $this->binToHexHelper(\str_split($bin, 4)[0]);
    $hex1 = $this->binToHexHelper(\str_split($bin, 4)[1]);

    return $hex0 . $hex1;
}
```

![](/public/courses/php/Images/wyrównanie-bajtowe-binarki-i-poprawny-hex.png)

---

### 🔒 Metoda szyfrowania XOR

Teraz gdy klasa `Binarka` wygląda na działającą poprawnie możemy przejść do faktycznej implementacji algorytmu szyfrowania XOR.

Klasycznie metoda przyjmuje tekst oraz klucz. Następnie przygotowujemy sobie pojemnik do przechowywania zaszyfrowanego tekstu:

```php
function encrypt(string $text, string $key): string
{
    $encrypted = "";
    //TODO:  Szyfrowanko 
    return $encrypted;
}
```
Każdy znak tekstu i klucza musi zostać przetworzony kolejno na dziesiętną reprezentację ASCII a potem na zapis binarny i do tego wyrównany do bajta.  
Klucz musi być powtarzany cyklicznie by nie zabrakło znaków do operacji. 

```php
$keyLength = \strlen($key);

foreach (\str_split($text) as $index => $char) {
    $binChar = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($char))));
    $binKey  = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($key[$index % $keyLength]))));
}
```
W powyższym kodzie tworzymy zmienną pomocniczą do przechowywania długości klucza `$keyLength` tak samo jak realizowane to było w poprzednich algorytmach szyfrowania. Posłuży nam on w operacji modulo i zapętlaniu klucza względem długości tekstu.

Następnie w pętli `foreach` przechodzimy po każdym znaku z tekstu i przygotowujemy binarną reprezentację. To znaczy bierzemy znak i poddajemy go operacjom: 
1. `\ord($char)` - konwersja na dziesiętny
2. `$this->decToBin()` - konwersja na binarny
3. `\implode('', ...)` - złączenie tablicy 1D w stringa
4. `$this->alignmentToBajt(...)` - wyrównanie do bajta.

Analogiczne operacje wykonujemy na kolejnym znaku klucza. Z tą różnicą że zamiast brać kolejno znaki z tekstu to indeks znaku klucza obliczamy przy pomocy operatora modulo `$index % $keyLength`. Pozwala nam to na cykliczne zapętlanie klucza.

Uzyskaliśmy w ten sposób bajtowe reprezentacje znaków które teraz bedziemy chcieli bajt po bajcie potraktować bramką XOR np.:
```
01010100 tekst "T"
01001011 klucz "K"
-------- XOR
00011111 
```
Uzyskany wynik na koniec przetwarzamy metodą $binToHex()$ i dodajemy konkatenacją do wynikowej zmiennej `$encrypted`.

```php
$resultXOR = "";
for ($i = 0; $i < 8; $i++) {
    $resultXOR .= $this->calculateXOR((int)$binChar[$i], (int)$binKey[$i]);
}
$encrypted .= $this->binToHex($resultXOR);
```

W efekcie końcowym uzyskaliśmy w pełni działającą klasę implementującą algorytm szyfrowania XOR.

```php
<?php
declare(strict_types=1);

namespace App\Core;

require_once 'Binarka.php';

use App\Binarka;

class XORCrypt extends Binarka
{

    function encrypt(string $text, string $key): string
    {
        $encrypted = "";
        $keyLength = \strlen($key);

        foreach (\str_split($text) as $index => $char) {
            $binChar = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($char))));
            $binKey  = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($key[$index % $keyLength]))));

            $resultXOR = "";
            for ($i = 0; $i < 8; $i++) {
                $resultXOR .= $this->calculateXOR((int)$binChar[$i], (int)$binKey[$i]);
            }
            $encrypted .= $this->binToHex($resultXOR);
        }
        return $encrypted;
    }
}
```

![](/public/courses/php/Images/XORCrypt.png)

---

### 🔓 Metoda odszyfrowywania XOR

Dobrze to teraz zapiszmy metodę odszyfrowywania. Tym razem musimy uwzględnić to że $2$ znaki heksadecymalne składają się na jeden znak tekstu jawnego. Co za tym idzie główna pętla powinna iterować co $2$ znaki. jednocześnie pozwalać na iterację po każdym znaku w kluczu.

Zmienimy więc pętlę `foreach` na klasyczny `for` zwiekszany o $2$ a nie o $1$ i dodamy zmienną pomocniczą do iteracji po kluczu:
```php
function decrypt(string $text, string $key): string
{
    $decrypted = "";
    $keyLength = \strlen($key);
    $k = 0;
    for($i=0; $i<strlen($text); $i+=2){
        //..
    }
    return $decrypted;
}
```

Z racji że operacja będzie wykonywana na znakach heksadecymalnych a nie zwykłym tekście to należy zmodyfikować zmienną `$binChar` zastępując ją nową `$binHex`:

```php
$binHex = $this->hexToBin($text[$i]) . $this->hexToBin($text[$i+1]);
```
Do zmiennej `$binHex` wpisujemy sklejone wyniki działania metod `hexToBin()`. Skoro główna pętla operuje na co drugim indeksie to powinniśmy uzyskać następujący wynik:
`$i=0`, więc pierwszy znak $1$ da nam wynik $0001_2$ a drugi $F$ da nam wynik $1111_2$.
`$i=2` bo tak iteruje główna pętla `$i+=2` więc oczekiwane wyniki to dla $0$: $0000_2$ i dla $E$: $1110_2$.

Kolejnym krokiem bedzie lekka modyfikacja zmiennej `$binKey` gdzie zamiast `$index` podaję `$k` i po inicjalizacji jej nowej wartości inkrementuję pomocniczą `$k`:

```php
$binKey  = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($key[$k % $keyLength]))));
$k++;
```

Na koniec zamiast zwracać wynik operacji XOR na system szesnastkowy metodą `binToHex()` posłużymy się `binToDec()` i z racji że ta metoda wymaga jako argumentu podania tablicy to wysyłamy do niej `str_split($resultXOR)`.

```php
function decrypt(string $text, string $key): string
{
    $decrypted = "";
    $keyLength = \strlen($key);
    $k = 0;
     for($i=0; $i<strlen($text); $i+=2){
        $binHex = $this->hexToBin($text[$i]) . $this->hexToBin($text[$i+1]);
        $binKey  = $this->alignmentToBajt(\implode('', $this->decToBin(\ord($key[$k % $keyLength]))));
        $k++;

        $resultXOR = "";
        for ($j = 0; $j < 8; $j++) {
            $resultXOR .= $this->calculateXOR((int)$binHex[$j], (int)$binKey[$j]);
        }

        $decrypted .= \chr($this->binToDec(str_split($resultXOR)));
    }

    return $decrypted;
}
```


![](/public/courses/php/Images/gotowa-klasa-szyfrowania-xor.png)

---

## 🧠 Zagadka

Na sam koniec tej lekcji zostawiam cię z poniższą zagadką 😉.

> [!WARNING]
> WHAT THE 00 2D 00 3A 00 27 00 20 00?
> Ten klucz rozszyfruje ten tekst 🤨:
> 1B 20 64 28 20 64 3F 36 64 3F 20 64 39 20 3E 38 35 3D 2D 3D 2B 3C 3A 2E 2E 3C 3E 74