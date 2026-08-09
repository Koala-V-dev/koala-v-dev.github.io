# Reprezentacja wzorów brył (arytmetyka)

Poprzednio obliczyliśmy BMI. Kod wykonał się linia po linii. Co nazywamy w nomenklaturze *programowaniem strukturalnym*. Mieliśmy jeden problem do rozwiązania i bardzo szybko oraz prosto się z nim uporaliśmy.  

Tym razem zajmiemy się pracą nad najlepszą dziedziną nauki czyli matematyką. Jednak podejdziemy do tego w stylu **programowania funkcyjnego**.

## Czym jest funkcja?

Funkcja to wydzielony blok kodu zawierający rozwiązanie danego małego problemu. Taki fragmencik jest wielokrotnie używany w programie do zrealizowania wiekszej pracy. Możesz to sobie porównać do budowlanki.

- Murarz stawia ściany z cegieł
- Glazurnik kładzie płytki
- Elektryk układa kable
- Hydraulik zakłada rury

Każdy z nich specjalizuje się w jednym zadaniu, a wykorzystanie ich pracy pozwala rozwiązać problem braku domu.

> Dodatkowym aspektem przemawiającym za programowaniem funkcjonalnym zamiast strukturalnym jest czytelność kodu i szybkość zmiany działania, a co za tym idzie brak konieczności poprawiania błędu w wielu miejscach zdublowanego kodu.


### Definicja i użycie funkcji

Funkcje definiujemy następującą strukturą:
```php
function nazwa_funkcji(){
    // ciało funkcji
}
```
Definicja funkcji jest poprzedzona słowem kluczowym `function`, zawiera nazwę oraz nawiasy okrągłe.  
Chcąc odwołać się do funkcji czyli wywołać jej działanie w innym miejscu skryptu używamy jej nazwy oraz nawiasów okrągłych:
```php
// Wywołanie funkcji:
nazwa_funkcji();
```

Funkcja maże przyjmować argumenty w nawiasach okrągłych, ale nie musi. Podobnie z zwracaniem wartości. Jeżeli nie zawrzesz w ciele funkcji na sam koniec instrukcji `return` to funkcja bedzie typu *void* i jeżeli byś ją chciał wykorzystać jako wartość to uzyskasz `NULL`: *Wskazano na nie istniejącą wartość o nieznanym typie w pamięci RAM.*

```php
function test(){}

var_dump(test());


function add($a, $b){
    return $a + $b;
}

var_dump(add(2,2));

```
Powyżej zdefiniowaliśmy dwie funkcje *void* oraz *intiger*. Gdy wywołamy je w `var_dump()` uzyskamy dwa oczekiwane wyniki:
- `NULL` dla test(), który jest typu *void*
- `int(4)` dla add(), który prwidłowo okazał się typem *intiger*

### Wykorzystanie funkcji w praktyce.

Mamy zdefiniowaną funkcje dodawania i teraz możemy ją wykorzystać na wiele sposobów:
- dokleić jej wynik konkatenacją do zwracanego stringa przez echo
- użyć jako wartość zmiennej, która potem będzie wykorzystana do kolejnych obliczeń
- przekazać wartość zmiennych jako argumenty wywołania funkcji zamiast jawnych wartości.
- przekazać wynik funkcji jako argument w kolejnym wywołaniu funkcji

```php
function add($a, $b){
    return $a + $b;
}

echo "2 + 4 = " . add(2, 4);
$c = add(2, 4);
echo "\nc = " . $c;

echo "\nc + 5 = " . add($c, 5);

echo "\n\n<hr>";

echo "\n2 + 3 + 7 + 9 = " . add(2, 3) + add(7, 9);
echo "\n2 + 3 + 7 + 9 = " . add(add(2, 3), add(7, 9));
```


![](/public/courses/php/Images/wykorzystanie-funkcji.png)

## Parametry stożka

Stożek składa się z dwóch części. Koła jako podstawy i siatki podobnej do trójkąta równoramiennego.

By móc wszystko policzyć musimy posiadać $3$ parametry:
- $r$ - promień podstawy (odcinek łączący środek z krawędzią okręgu)
- $h$ - wysokość stożka (odcinek od podstawy do czubka stożka gdzie z podstawą tworzy kąt prosty)
- $l$ - długość tworzącej stożka (odcinek od czubka stożka do krawędzi okręgu podstawy)


### Wzory

Poniżej przedstawiam wzory na potrzebne wartości, które pozwolą Ci liczyć w języku PHP:
- objetość ($V$):
$$V=\frac{1}{3}\pi r^2h$$
- pole powierzchni całkowitej ($P_c$):
$$P_c=\pi r^2 + \pi r l$$
- pole powierzchni bocznej ($P_b$):
$$P_b = \pi r l$$
- pole powierzchni podstawy ($P_p$):
$$P_p = \pi r^2$$
- długość tworzącej ($l$):
$$l = \sqrt{r^2 + h^2}$$


## Definicje funkcji dla wzorów stożka

Załóżmy że posiadamy tylko $2$ parametry stożka:
- $r = 4$
- $h = 6$
Brakuje nam długości tworzącej $l$.

### Funkcja wyprowadzająca $l$ z $r$ i $h$

Wiemy że w php możemy potęgować przy pomocy operatora `**`, ale jak wykonać operację pierwiastkowania?  
Tu z pomocą przychodzi nam jak zwykle matematyka.  
Przeanalizujmy przykład:

$$5^2 = 25$$
$$\sqrt{25} = 5$$

Jak widzisz pierwiastkowanie to odwrotność podnoszenia do potęgi.  
Teraz przypomnij sobie jak zapisać liczbę $5$ jako ułamek:

$$5 = \frac{5}{1}$$
Więc chcąc uzyskać odwrotność liczby $5$ zapiszemy ją w postaci ułamka jako:

$$\frac{1}{5}$$

Jak będzie więc wyglądać pierwiastek stopnia drugiego zapisany w php przy użyciu potęgowania?  

$$\sqrt{25} = 25^{\frac{1}{2}}$$

Nasza funkcja do pozyskania $l$ z $r$ i $h$ wygląda następująco:

```php
function get_l($r, $h){
    return ($r**2 + $h**2)**(1/2);
}
```

Zamiast działania `(1/2)` możesz od razu zapisać `0.5`.

![](/public/courses/php/Images/parametry-stożka.png)

Super! Właśnie zdefiniowaliśmy od zera natywną funkcję php do pierwiastkowania, czyli `sqrt()`:

```php
sqrt(liczba_do_spierwiastkowania);
```

### Określenie liczby $\pi$

Jak znowu popatrzymy na wzory to brakuje nam tylko jednej niewiadomej. Dokładniej liczby $\pi$.

Jest to stała matematyczna, więc to idealny moment na wprowadzenie **zmiennych stałych** (*constants variables*).

W php aby określić stałą używamy funkcji `define`:

```php
define("nazwa_stalej", "wartosc");
```

W naszym przypadku zapiszmy:

```php
define("PI", 3.141);
```

Po co w ogóle nam stałe skoro mamy zmienne i krócej się je zapisuje?  
Kluczem jest właśnie stałość. Jeżeli zdefiniujemy dla stałej jakąś wartość to mamy pewność że nie zostanie ona przypadkowo nadpisana gdzieś dalej w kodzie. Dodatkowo IDE oraz interpreter PHP odrazu zgłoszą sytucję nadpisania jako błąd i wskarzą lokalizację tego precedensu:

![](/public/courses/php/Images/syntax-error_unexpected-token-=-in-define-const-PI.png)

### Definicje i wyniki funkcji wzorów stożka

Znając parametry $r$ i $h$ oraz definiując stałą $\pi$, w przybliżeniu $3.141$ jesteś wstanie poprawnie poznać wszystkie parametry stożka:
- Promień podstawy: $r$
- Wysokość stożka: $h$
- Długość tworzącej stożka: $l = \sqrt{r^2 + h^2}$
- Objętość stożka: $V = \frac{1}{3}\pi r^2h$
- Pole powierzchni całkowitej: $P_c = \pi r^2 + \pi r l$
- Pole powierzchni bocznej: $P_b = \pi r l$
- Pole powierzchni podstawy: $P_p = \pi r^2$

```php
$r= 4; $h=6;

function get_l($r, $h){
    return ($r**2 + $h**2)**0.5;
}
echo "Parametry stożka: r=" . $r .", h=" . $h . ", l=" . get_l($r, $h);

define("PI",3.141);

function stozek_get_V($r, $h){
    return (1/3) * PI * $r**2 * $h;
}
echo "\nObjętość stożka (V): " . stozek_get_V($r, $h);
function stozek_get_Pc($r, $h){
    return PI * $r**2 + PI * $r * get_l($r, $h); 
}
echo "\nPole powierzchni całkowitej (Pc): " . stozek_get_Pc($r, $h);
function stozek_get_Pb($r, $h){
    return PI * $r * get_l($r, $h);
}
echo "\nPole powierzchni bocznej (Pb): " . stozek_get_Pb($r, $h);
function stozek_get_Pp($r){
    return PI * $r**2;
}
echo "\nPole powierzchni podstawy (Pp): " .stozek_get_Pp($r);

```

![](/public/courses/php/Images/funkcje-obliczające-wzory-stożka.png)

> [!TIP]
> PS w PHP już zdefiniowano stałą PI jako `M_PI` i wynosi ona w przybliżeniu $3.1415926535898$.
> Mało tego, ze względu na czestość występownia zdefiniowane zostały też `M_PI_2` ($\frac{\pi}{2}$), `M_PI_4` ($\frac{\pi}{4}$) oraz `M_1_PI` ($\frac{1}{\pi}$) i `M_2_PI` ($\frac{2}{\pi}$).
> !["M_PI constant"](/public/courses/php/Images/php_stałe-wartości_z_pi_M_PI.png)


## Rozszerz kalkulacje o walec i kulę

**Walec** to bryła obrotowa, która powstaje przez obrót prostokąta wokół jednej z jego boków.  
**Kula** to bryła obrotowa, która powstaje przez obrót koła wokół jego średnicy.


### Wzory na walec

- objetość walca:
$$V = \pi r^2 h$$
- pole powierzchni całkowitej walca:
$$P_c = 2 \pi r^2 + 2 \pi r h$$
- pole powierzchni bocznej walca:
$$P_b = 2 \pi r h$$
- pole powierzchni podstawy walca:
$$P_p = \pi r^2$$

### Wzory na kulę

- objetość kuli:
$$V = \frac{4}{3}\pi r^3$$
- pole powierzchni całkowitej kuli:
$$P_c = 4 \pi r^2$$
