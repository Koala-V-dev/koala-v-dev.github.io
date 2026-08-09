# PHP twoja personalna strona

**PHP** (początkowo *Personal Home Page Tools*, obecnie *PHP: Hypertext Preprocessor*) zaczął w <time datetime="1994">1994 roku</time> jako zestaw narzędzi Rasmusa Lerdorfa do śledzenia odwiedzin jego internetowego CV. Później rozwinął się w narzędzie do tworzenia dynamicznych stron.  
Za chwilę wykorzystamy dokładnie tę cechę: jeden plik PHP utworzy stronę na podstawie zapisanych w nim danych.

Na start potrzebujesz **IDE** (*Integrated Development Environment*) - np.: [VS Code](https://code.visualstudio.com/download).  
Oraz z racji że PHP jest językiem backendowym działającym po stronie serwera to potrzebujesz oprogramowania które obsłuży ci to środowisko w systemie desktopowym. Na początek spoko rozwiązaniem jest [XAMPP](https://www.apachefriends.org/download.html).
Jeden pakiet, który zawiera PHP, serwer WWW i bazę danych.

Standardowo w katalogu `C:\xampp\htdocs\`  umieszczasz swoje katalogi z projektami stron by Apache wiedział co zaserwować pod adresem `http://localhost/<nazwa-folderu>`.

Możesz też przejść szybko do katalogu `htdocs` z poziomu okna XAMPPa klikając przycisk <kbd class="win-menu-btn">Explorer</kbd>:

![Uruchomienie usługi apache w xampp](/public/courses/php/Images/xampp-apache-run.png)

My jednak na start zrobimy to trochę inaczej. Zainstalowaliśmy XAMPP, aby mieć kompletne środowisko, lecz teraz potrzebujemy jedynie interpretera PHP. XAMPP dostarcza PHP najwyżej w wersji 8.2, podczas gdy produkcyjnie dostępne są stabilne PHP 8.4 oraz najnowsze PHP 8.5.9.


![Strona PHP.net z informacjami o wersji PHP](/public/courses/php/Images/php-released.png)

---

## 🧰 IDE i server PHP

Zamiast się bawić w podkatalogi w htdocs,  uruchomimy server bezpośrednio w dowolnym katalogu z kodem projektu. Chodzi o to żęby lepiej zarządzać URL. Jeżeli tworzysz podkatalog w htdocs to adres do uruchomienia strony bedzie taki: 
```
http://localhost/nazwa-folderu/
```
Natomiast jak tworzysz w dowolnym katalogu to adres bedzie taki:
```
http://localhost:xxxx/
```

Popatrz na końcówkę adresów - w obu przypadkach jest `/`. Natomiast w pierwszym URL mowa o podstronie gdzie w naszym wariancie operujemy na bezpośredniej domenie co przy deploy projektu na product... hehe.  
Wrzucenie tego nad czym pracowaliśmy lokalnie na server nie spowoduje że linki będą błędnie się odnosić do zasobów strony.  


Na poniższym zrzucie przedstawiam ci punkt startowy pracy z PHP.  
Na początek doinstaluj sobie rozszerzenie **Live Preview** od *Microsoft*.  
Potem utwórz plik `index.php`. Rozszerzenie `.php` jest informacją że ten plik nalerzy przekazać do interpretera PHP by ten przeanalizował go pod kątem znalezienia operacji do wykonania, które zamieszcza się pomiędzy `<?php` a `?>`. Na koniec zwracany jest zwykły plik tekstowy który domyślnie posiada typ `text/html`. Czyli dokładnie taki sam jak pliki z rozszerzeniem `.html`.

![Uruchomienie php-hello-world](/public/courses/php/Images/php-hello-world!.png)

Zaznaczyłem ci żółto obramówką miejsce to otwarcia/zamkniecia okna terminala.  
W terminalu zanim wpiszesz widoczną komendę to napisz pierw: 
```powershell
php -v
```
Poznasz wersję PHP, którą uruchamiasz. Potem użyj komendy z obrazka:

```powershell
php -S 127.0.0.1:8080
```
- `php` informacja że, to co po nim zostanie przekazane do interpretera `C:\xampp\php\php.exe`
- `-S` to włączenie serwera
- `127.0.0.1` to adres IP localhosta który pozwala na komunikację przy pomocy stosu TCP/IP na tej samej maszynie.
- `:8080` to port na którym nasłuchuje serwer. Standardowo serwer WWW nasłuchuje na porcie `80`. Tradycyjnie przy web dewelopmencie duplikujemy `80` lub podajemy `3000`. Jeżeli bedziesz chciał uruchomić kika serwerów to będą one musiały mieć inne porty by nie ingerowały sobie nawzajem.

Na niebiesko zaznaczyłem link na którym działa serwer. Wystarczy przytrzymać <kbd>Ctrl</kbd> i kliknąć w link by *Live Preview* otworzyło kartę z uruchomioną stroną.  


W czerwonej obramówce masz klasykę gatunku przy nauce jakiegokolwiek języka programowania:

```php
<?php
    echo "Hello, World!";
?>
```
Kod php może znajdować się tylko wewnątrz znacznika otwierającego `<?php` i zamykającego `?>`. W każdym innym przypadku bedzie to zwykłym tekstem na stronie html. Oraz vice versa. Zapis "tekstu" musi odbywać się w apostrofach lub cudzysłowach. Tego typu wartość nazywa się string-iem. Nie możesz od tak wpisać kodu html w obrębie znacznika `<?php` i `?>`. 

## 📔 HTML zwracany przez PHP

Jeżeli potrzebujesz struktury html by przedstawić dane w bardziej czytelny sposób, to php umożliwia to na kilka sposobów.

1. Funkcja `echo()`: zwraca podaną wartość jako tekst i dodatkowo nie musisz w niej zapisywać nawiasów.
2. `var_dump()`: to narzędzie diagnostyczne. Pokaże typ, długość i wartość danych. Bardzo przydatne przy debugowaniu.
3. `printf()`: zwraca podaną wartość jako tekst, ale z formatowaniem.
4. Funkcja `print_r()`: zwraca dane które są formatowane. Czesto wykorzystywane dla łatwiejszego odczytu struktur tablic i obiektów.

No to użyjmy tych sposobów w praktyce, ale do tego przydadzą nam się zmienne.  

## 📊 Zmienne: typy i struktury danych

Nazwy zmiennych w PHP zaczynają się znakiem dolara `$`. Pierwszym znakiem właściwej nazwy może być litera albo `_`, ale nie cyfra. PHP jest językiem dynamicznie typowanym: typ należy do aktualnej wartości i może zmienić się po kolejnym przypisaniu.

Zmienna może przechowywać między innymi pojedynczą wartość, tablicę albo obiekt:
- Zmienna przechowująca pojedyńczą wartość:
  ```php
  $imie = "Kamil"; // String - ciąg znaków
  $wiek = 27; // Integer - liczba całkowita
  $wzrost = 1.5; // Float - liczba zmiennoprzecinkowa
  $czyKobieta = false; // Boolean - wartość boolowska prawda/fałsz
  ```
- Tablica przechowuje wiele wartości:
  ```php
  $tablica = array("Kamil", "27", "1.5", "false");
  $tablica = ["Kamil", "27", "1.5", "false"];
  ```
- Tablica asocjacyjna przechowuje wartości pod nazwanymi kluczami:
  ```php
  $obiekt = array("imie" => "Kamil", "wiek" => "27", "wzrost" => "1.5", "czyKobieta" => "false");
  $obiekt = ["imie" => "Kamil", "wiek" => "27", "wzrost" => "1.5", "czyKobieta" => "false"];
  ```
  
![](/public/courses/php/Images/tablice-i-obiekty-print_r.png)


## 💻 Weryfikacja BMI

Zrealizujmy skrypt obliczający moje BMI.

Wzór na BMI jest następujący:
$$\text{BMI} = \frac{\text{Masa } [kg]}{\text{Wzrost}^2 [m^2]}$$

Natomiast klasyfikacja jest taka: 

| BMI     | Niedowaga  | Prawidłowa    | Nadwaga     | Otyłość 1 stopnia | Otyłość 2 stopnia | Otyłość 3 stopnia |
| :------ | :--------- | :------------ | :---------- | :---------------- | :---------------- | :---------------- |
| Wartość | $\le 18.5$ | $18.5 - 24.9$ | $25 - 29.9$ | $30 - 34.9$       | $35 - 39.9$       | $\ge 40$          |

Do wcześniejszych zmiennych brakuje nam wagi, więc ją dopiszmy.

Do zapisania wzoru potrzebujemy operatorów arytmetycznych PHP.

| Znak specjalny | znaczenie                           |
| -------------- | ----------------------------------- |
| `+`            | dodawanie                           |
| `-`            | odejmowanie                         |
| `*`            | mnożenie                            |
| `/`            | dzielenie                           |
| `%`            | modulo — reszta z dzielenia         |
| `**`           | potęgowanie                         |
| `.`            | konkatenacja łączenie ciągów znaków |

Na zrzucie poniżej widać użycie tych operatorów. Zapis `\n` oznacza nową linię. Przeglądarka zachowa ją, gdy wynik znajdzie się wewnątrz znacznika `<pre>`.

Znaki `#` i `//` rozpoczynają komentarz jednoliniowy, który interpreter PHP pomija.

![](/public/courses/php/Images/php-arytmetyka.png)

BMI obliczamy z masy i wzrostu:
```php
$bmi = $waga / $wzrost ** 2;
```
Wynik ma wiele cyfr po przecinku. `printf()` pozwala ograniczyć ich liczbę podczas wyświetlania:
```php
printf("%.2f", $bmi);
```

<details>
  <summary>inne wartości printf</summary>

| format  | znaczenie                                                |
| ------- | -------------------------------------------------------- |
| `%d`    | dziesiętna liczba całkowita                              |
| `%f`    | dziesiętna liczba zmiennoprzecinkowa                     |
| `%.2f`  | liczba zmiennoprzecinkowa z dwoma miejscami po przecinku |
| `%s`    | ciąg znaków                                              |
| `%c`    | pojedynczy znak                                          |
| `%b`    | liczba binarna                                           |
| `%o`    | liczba ósemkowa                                          |
| `%x`    | liczba szesnastkowa małymi literami                      |
| `%X`    | liczba szesnastkowa dużymi literami                      |
| `%10s`  | ciąg znaków z wyrównaniem do prawej                      |
| `%-10s` | ciąg znaków z wyrównaniem do lewej                       |

</details>


### 🔀 Instrukcje warunkowe <code>if</code>, <code>elseif</code>, <code>else</code>

Dokończmy skrypt obliczający BMI. Sama liczba niewiele mówi, dlatego przygotujemy dwie tablice:  
progi oraz odpowiadające im klasyfikacje.
```php
$bmi_stat = [18.5, 25, 30, 35, 40];
$bmi_nazwa = ["Niedowaga", "Prawidłowa", "Nadwaga", "Otyłość 1 stopnia", "Otyłość 2 stopnia", "Otyłość 3 stopnia"];
```
Do wartości w tablicy odwołujemy się przez indeks zapisany w nawiasach kwadratowych. Pierwszy element ma indeks `0`, dlatego pięć progów zajmuje indeksy od `0` do `4`.

Poniższa struktura **`if`** najpierw sprawdza, czy warunek `$bmi >= $bmi_stat[4]` jest prawdziwy. Jeżeli **tak**, wypisze `$bmi_nazwa[5]` i pominie pozostałe gałęzie.  
Jeżeli **_nie_** to sprawdzi kolejny **_`else if`_**.
Jeżeli _**wszystkie warunki będą fałszywe**_ to wykonany zostanie kod w _**`else`**_, który już nic nie sprawdza.

```php
if($bmi >= $bmi_stat[4]){
    echo $bmi_nazwa[5];
} elseif ($bmi >= $bmi_stat[3]){
    echo $bmi_nazwa[4];
} elseif ($bmi >= $bmi_stat[2]){
    echo $bmi_nazwa[3];
} elseif ($bmi >= $bmi_stat[1]){
    echo $bmi_nazwa[2];
} elseif ($bmi >= $bmi_stat[0]){
    echo $bmi_nazwa[1];
} else {
    echo $bmi_nazwa[0];
}
```

![](/public/courses/php/Images/bmi-if-else.png)

Na koniec pozwoliłem sobie przedstawić działanie `var_dump` i tu ciekawostka nie można tej funkcji sklejać konkatenacją (`.`).


### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Kod PHP zapisujemy pomiędzy `<?php` a `?>`.
- PHP jest językiem dynamicznie typowanym, a jego zmienne tworzy się przez przypisanie wartości do nazwy zaczynającej się od `$`.
- Zbiory danych przechowujemy w tablicach które mogą być indeksowane lub asocjacyjne.
- W bloku `if` wykonujemy kod tylko wtedy gdy warunek jest prawdziwy. Jeżeli nie to sprawdzamy kolejny warunek w instrukcji `elseif`. Jeżeli wszystkie warunki są fałszywe to wykonujemy kod w instrukcji `else`.
- Łączenie znaków nazywamy konkatenacją i robimy to za pomocą operatora `.`.
- W skład działań arytmetycznych wchodzą: `+`, `-`, `*`, `/`, `%`, `**`.