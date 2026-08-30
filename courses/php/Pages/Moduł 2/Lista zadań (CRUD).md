# Lista zadań (CRUD)

Dotychczas pracowaliśmy na danych ulotnych lub statycznie umieszczonych w kodzie pliku. Czas na zmiany. Zaimplementujmy prostą listę zadań z opcją dodawania, odczytu, aktualizacji i usunięcia czyli mechanizm _**CRUD**_.
>*Create* - twórz, *Read* - czytaj, *Update* - aktualizuj, *Delete* - usuń.

By nie tracić czas na budowanie struktury HTML i stylowanie go CSSem skopiuj zawartość obu plików:

<details>
<summary>Lista zadań (CRUD)</summary>

<small>index.html</small>

```html
<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <form method="POST" id="new-task">
        <label for="new_task_name">Nazwa zadania</label>
        <input type="text" name="new_task_name" id="new_task_name">
        <button name="action" value="create">Utwórz nowe zadanie</button>
    </form>

    <table>
        <thead>
            <th>Nr.</th>
            <th>Nazwa zadania</th>
            <th>Status zadania</th>
            <th>Akcje</th>
        </thead>
        <tbody>
            <form method="POST">
                <tr>
                    <td>1.</td>
                    <td> <input type="text" name="new_task_name" id="new_task_name" value="Wypić kawę"></td>
                    <td>
                        <label class="hit-area">
                            <input type="checkbox" name="done" id="task_1" checked>
                        </label>
                    </td>
                    <td>
                        <button name="action" value="update">Aktualizuj</button>
                        <button name="action" value="delete">Usuń</button>
                    </td>
                    <input type="hidden" name="id" value="1">
                </tr>
            </form>
        </tbody>
    </table>

</body>

</html>
```

<small>style.css</small>

```css
:root {
    --color-text: #ebebeb;
    --muted-text: #ccc;
    --bg-layer-0: #111;
    --bg-layer-1: #474747;
    --table-border: #383838;
    --thead-tr: #383838;
    --tbody-tr-hover: #141414;
    --tbody-td-hover: #181818;
    --success: #296c29;
    --info: #315a72;
    --danger: #8d2121;
}

* {
    -webkit-text-stroke: 0.4px rgb(0 0 0 / 20%);
}

body {
    background-color: var(--bg-layer-0);
    color: var(--color-text);
}

#new-task {
    display: flex;
    align-items: center;
    justify-content: center;
}

table {
    box-sizing: border-box;
    margin: 15px auto;
}

th,
td {
    border: 1px solid var(--table-border);
    padding: 5px 10px;
}

th {
    font-family: system-ui;
    color: var(--muted-text);
}

th:nth-child(2) {
    width: 250px;
}

button {
    cursor: pointer;
    border: 2px solid #fff2;
    border-radius: 5px;
    padding: 5px 10px;
    font-family: monospace;
    color: #fff;
    background-color: var(--success);
}

td button:first-child {
    background-color: var(--info);
}

td button:last-child {
    background-color: var(--danger);
}

thead tr {
    background-color: var(--thead-tr);
}

tbody tr:hover {
    background-color: var(--tbody-tr-hover);
}

tbody td:hover {
    background-color: var(--tbody-td-hover);
}

.hit-area,
.hit-area input[type="checkbox"] {
    margin: auto;
    display: block;
    cursor: pointer;
}

input[type="text"] {
    padding: 5px 10px;
    margin: 0 10px;
    border: none;
    border-radius: 2px;
    color: var(--color-text);
    background-color: var(--bg-layer-1);
    display: block;
    min-width: 210px;
}

button:hover,
input[type="text"]:hover {
    filter: brightness(.9);
}
```

</details>


![](/public/courses/php/Images/wygląd-listy-zadań-do-crud-php.png)


Teraz potrzebujesz w końcu bazy danych i tu przychodzi ponownie z pomocą oprogramowanie XAMPP.  
Uruchom w panelu moduł usługi MySQL i opcjonalnie Apache:

![](/public/courses/php/Images/XAMPP-Apache-MySQL.png)

## 🗄️ Baza danych MySQL

Standardowo przeszli byśmy do klikania w phpMyAdmin (`http://localhost/phpmyadmin/`). Jednak my zrealizujemy obsługę bazy danych z poziomu kodu PHP.  

W pliku `index.php` zapisz $3$ stałe, które posłużą nam do połączenia z serwerem:

```php
const host = "localhost"; // Adres pod którym działa usługa MySQL (localhost == 127.0.0.1)
const user = "root"; // Nazwa użytkownika MySQL (w XAMPP domyślnie root)
const password = ""; // Hasło do MySQL (w XAMPP domyślnie brak hasła)
```
Ten serwer MySQL jest typem *MariaDB*. U mnie Wersja serwera: *`10.4.32-MariaDB`*.  
Dlaczego o tym wspominam?  
Chodzi o to jakiej metody bedziesz używać do komunikacji z bazami danych (PDO vs MySQLi).  
Te pierwsze ma wiekszy narzut abstrakcji dziki czemu obsłuży każdy liczący się rodzaj serwera baz danych, drugie jest dedykowane dla MySQL i przez to bardziej wydajne.

### ☎️ Połączenie z bazą danych

Do połączenia z serwerem baz danych używamy obiektu `mysqli`:

```php
$db = new mysqli(host, user, password);
```

Podajemy tylko $3$ parametry: adres hosta, użytkownika oraz hasło. Czwarty parametr (nazwę bazy) pomijamy, bo baza jeszcze nie istnieje na serwerze.


Wtedy początek pliku będzie następujący:

```php
declare(strict_types=1);

const host = "localshot"; // Literóka
const user = "root";
const password = "";

$db = new mysqli(host, user, password);

echo "<br><br>===================================<br><br>";

if($db->errno !== 0){
    echo "Numer błędu: " . $db->errno;
    exit();
}

echo "<br><br>===================================<br><br>";

if(!$db){
    echo "Numer błędu: " . $db->errno;
    exit();
}
```
Jak widzisz żaden z _**`if`**_-ów się nie wykonał. Są to stare metody chwytania błędów, które w wersjach PHP >= 8.1 nie mają szans się wywołać ze względu na zmianę domyślnych parametrów klasy `mysqli`:

```php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
```

![](/public/courses/php/Images/stare-nieaktualne-chwytanie-error-db-con.png)

Więc jak do tego podejść poprawnie?  
Zamiast stosować instrukcję warunkową `if` w celu chwytania błędów, należy użyć bloku `try` `catch`:

> `try`: spróbuj wykonać ten fragment kodu, a gdy rzuci on obiektem błędu to przekaż go do bloku `catch`. Jeżeli nie pojawi się żaden obiekt błędu z wykonywania tego fragmentu kodu to pomiń ciało `catch` i kontynuuj działanie programu.
> `catch`: przechwytuje obiekt błędu wyrzucony w bloku `try` i może wykonać awaryjne działanie dla tej okoliczności bez zmuszania programu do **_CRASHA_**.


```php
try {
    $db = @new mysqli(host, user, password);
} catch (Exception $e) {
    echo "Błąd bazy danych: " . $e->getMessage();
}
```

W ciele _**`try`**_ Przed `new mysqli()` dopisano znak małpy `@` by interpreter PHP nie zwracał standardowego ostrzeżenia:

```
Warning: mysqli::__construct(): php_network_getaddresses: getaddrinfo for localshot failed: Nieznany host. in C:\Projekty kursu\php\index.php on line 12
```
Natomiast w bloku _**`catch`**_ zainicjalizowano zmienną `$e` o typie klasy `Exception`, do której w większości języków programowania rzuca się błędy (taki standardzik w branży 😉). Następnie w ciele _**`catch`**_ został wyświetlony przez `echo` wyciągnięty komunikat z obiektu `$e` przy pomocy metody `getMessage()`.

![](/public/courses/php/Images/db-conn-trycatch.png)

---

## 🦭 Wstęp do SQL

**SQL** (*Structured Query Language*) to język bardzo wysokiego poziomu (deklaratywny), zbliżony do naturalnego języka człowieka. Używamy go do pracy z danymi przechowywanymi w bazach danych.

> Czym są bazy danych i dlaczego nie używamy plików tekstowych?

Plik tekstowy to zwykły ciąg znaków, który trzeba czytać linia po linii. Nie ma w nim typów danych, relacji, kluczy ani mechanizmów kontroli dostępu. Baza danych to natomiast **uporządkowany zbiór informacji**, którym zarządza specjalny system: _**DBMS**_ (*Database Management System*).

DBMS działa w oparciu o **relacyjny model danych**, korzystający z teorii zbiorów i logiki matematycznej. Dzięki temu możemy wykonywać operacje takie jak filtrowanie, grupowanie, łączenie tabel czy agregacje, czyli wszystko w sposób szybki i przewidywalny.

> Dlaczego DBMS jest lepszy niż pliki tekstowe?

- **Struktura danych** — tabele, typy, klucze, relacje.
- **Wydajność** — indeksy pozwalają wyszukiwać dane błyskawicznie.
- **Bezpieczeństwo** — role, uprawnienia, szyfrowanie, backupy.
- **Transakcje (ACID)** — albo zapisze się wszystko, albo nic.
- **Współbieżność** — wielu użytkowników może pracować jednocześnie.
- **Optymalizacja zapytań** — DBMS tworzy statystyki i cache’uje plany zapytań.
- **Skalowalność** — rosnąca ilość danych nie powoduje liniowego spadku wydajności.

Dlatego każda poważna aplikacja, strona internetowa, system operacyjny, aplikacja mobilna czy narzędzia analityczne korzysta z baz danych. SQL jest fundamentem pracy z danymi, również w nowoczesnych systemach analitycznych i Big Data.

---

### 🏗️ Utworzenie bazy danych

Gdy jesteśmy połączeni już z serwerem baz danych to przy pomocy metody `query()` możemy do niego wysyłać zapytania.

Pierwsze co zrobimy to utworzymy bazę danych o nazwie `todo_db`:

```sql
CREATE DATABASE todo_db;
```
> Proste prawda?

Możemy do tego podejść na dwa sposoby 

<data-tabs>
    <tabs>
        <b>Zapytanie w metodzie</b>
        <b>Zapytanie w zmiennej</b>
    </tabs>
    <div>

Pozornie mniej linii kodu i do tego ciężka w dynamicznej modyfikacji.

```php
$result = $db->query("CREATE DATABASE todo_db");
echo $result;
```
</div>
<div>

Dodatkowa zmienna może przechowywać dynamiczniejsze zapytania modyfikowane względem zapotrzebowania.

```php
$sql = 'CREATE DATABASE todo_db';
$result = $db->query($sql);
echo $result;
```
</div>
</data-tabs>

Gdy wykonamy cały ten kod to za pierwszym razem zostanie zwrócona przez `echo` wartość logiczna `true` rzutowana na int $1$, ale ponowne odświeżenie strony wywala nam fatalny błąd.

*Baza danych o tej nazwie już istnieje więc nie można jej utworzyć*

![](/public/courses/php/Images/stworzenie-bazy-danych.png)

Jak się przed tym zabezpieczyć bez ciągłego zmieniania zapytania w kodzie?  
Tu z pomocą przychodzi klauzula `IF NOT EXISTS` czyli *wykonaj jeżeli jeszcze nie istnieje...*.

```sql
CREATE DATABASE IF NOT EXISTS todo_db;
```

Dobrze, skoro baza danych już utworzona a zapytanie zabezpieczone przed nadmiarowym wykonywaniem to czas sprawdzić jakie bazy danych są dostępne na serwerze. 

Stwórzmy kolejną zmienną `$sql_1` o wartości:

```
SHOW DATABASES;
```

Tym razem wynik bedzie posiadał strukturę, a nie pojedynczą wartość dlatego php musi ją przetworzyć na coś co bardzo dobrze znamy. Tablicę asocjacyjną.

Na obiekcie klasy `mysqli_result` wykonamy metodę `fetch_assoc()` która przetwarza wynik zapytania do tablicy tablic asocjacyjnych tworząc stos z którego zdejmuje i zwraca pierwszy element (tablicę asocjacyjną pierwszego wiersza). Gdy na stosie nie bedzie już wierszy do zwrócenia jako tablice asocjacyjne to zostanie zwrócona wartość null. Każde wywołanie metody `fetch_assoc()` zdejmuje kolejny element ze stosu a następnie go zwraca.

Dlatego idealnie bedzie tu pasować pętla `while` która wykonuje się do puki warunek jest prawdziwy, a przecież `null` jest nieprawdziwe 😉

```php
echo "<pre>";
$sql_1 = "SHOW DATABASES";
$result = $db->query($sql_1);

while($row = $result->fetch_assoc()){
    print_r($row);
}
echo "</pre>";
```

Jak widać tym razem fatalnego erroru nie było. Znowu mamy jedynkę a następnie $7$ tablic asocjacyjnych z kluczem `[Database]` wskazujących na nazwy istniejących w BDMS baz danych. Ostatnia z nich to własnie ta przez naz utworzona w kodzie. 

![](/public/courses/php/Images/show-databases.png)

---

### 📋 Utworzenie tabeli

Sama baza danych to kontener na tabele które beda przechowywac faktyczne dane. Dlatego warto poznać ich kilka właściwości:
Typy danych:
- **`INT`** - liczba całkowita.
- *`VARCHAR(255)`* - tekst, który tu określono na maksymalną długość $255$ znaków. Każdy kolejny znak zostanie obcięty.
- _**`DATE`**_ - data w formacie `rrrr`-`mm`-`dd`.
- _**`DATETIME`**_ - data i czas w formacie `rrrr`-`mm`-`dd` `hh`:`mm`:`ss`.
- *`TEXT`* - tekst o nieokreślonej długości, ale maksymalnie $2^{16} - 1 = 65,535$ znaków.
- **_`ENUM("a", "b", "c")`_** - lista wartości, z których jedna może być przypisana do danego pola.
- **_`SET("a", "b", "c")`_** - lista wartości, z których wiele może być przypisana do danego pola.
- **`TINYINT`** - liczba całkowita o maksymalnej wartości $127$. Reprezentuje ona prawdę/fałsz.
- **`BOOLEAN`** - domyślnie traktowana jak `TINYINT`.

---

By stworzyć tabelę przy pomocy zapytania SQL musisz posłużyć się `CREATE TABLE` i dla bezpieczeństwa dodać jeszcze dobrze Ci znaną klauzulę `IF NOT EXISTS`:

```sql
CREATE TABLE IF NOT EXISTS nazwa_tabeli ( info_o_jej_kolumnach );
```

Pamiętamy że podczas tworzenia instancji obiektu `mysqli` nie podaliśmy nazwy bazy danych, więc DBMS nie domyśli się w której bazie danych ma stworzyć tą tabelę. Podczas tworzenia i innych działań na tabelach bedzie trzeba do jej nazwy dopisać prefiks `nazwa_bazy_danych.`:

```sql
CREATE TABLE IF NOT EXISTS todo_db.tasks (

);
```
Każdy wiersz powinien mieć niepowtarzalną wartość kolumny. Tak właściwie to w nomenklaturze baz danych nazywamy to **kluczem głównym**. Dodatkowo zamiast mówić kolumna mówimy **atrybut**, zamiast wartości w wierszu dla danego atrybutu mówimy **pole** a zamiast wiersz/rekord mówimy **krotka**. xD

Wracając. Kluczem głównym bardzo czesto jest wartość identyfikatora (`id`), chodź może to być np.: pesel lub numer paszportu. Dziwnym było by podawanie peselu w aplikacji do zarządzania zadaniami więc klasycznie bedziemy generować ID.

```sql
CREATE TABLE IF NOT EXISTS todo_db.tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
);
```
Określamy że atrybut `id` bedzie typu `INT` który przy każdym nowej krotce samoczynnie się zwiększy o $1$ czyli nastąpi inkrementacja. Dodatkowo oznaczamy go jako klucz główny i żaden inny atrybut w tej tabeli nie bedzie mógł mieć tej etykiety.

Patrząc na nagłówki tabeli CRUD z początku lekcji widzimy że są tam:
- Nr: jakaś liczba
- Nazwa zadania: tekst edytowalny
- Status zadania: input typu checkbox
- Akcje: dwa przyciski (aktualizacja, usuwanie)

Dlatego tabelę musimy jeszcze wzbogacić o atrybuty nazwy i statusu zadania.

```sql
CREATE TABLE IF NOT EXISTS todo_db.tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    is_done BOOLEAN DEFAULT 0
);
```
> [!NOTE]
> Długość ciągu tekstowego w `VARCHAR` musi być podana bo bez tego MySQL nie wie ile pamięci zaalokować na dany wpis.

Skoro mamy już utworzoną tabelę to wykonajmy to samo co zrobiliśmy po stworzeniu bazy danych. Sprawdżmy czy ona faktycznie istnieje.

Wcześniej posłużyliśmy się zapytaniem `SHOW DATABASES`, więc logicznie teraz posłużymy się zapytaniem `SHOW TABLES`.  
Jednak jest tu pewna nieścisłość. Gdy wyświetlaliśmy bazy danych to robiliśmy to na konkretnym serwerze, więc wiadomo skąd te nazwy miały być brane. Dlatego w `SHOW TABLES` brakuje nam wskazanie w której bazie danych tabele mają być wyświetlone. By tego dokonać należy dopisać słówko `FROM` i podać nazwę bazy danych:

```sql
SHOW TABLES FROM todo_db
```

![Wyświetlanie tabel po zapytaniu SHOW TABLES FROM todo_db](/public/courses/php/Images/show-tables.png)


Więc po uproszczeniu uzyskujemy taki stan kodu php:

```php
declare(strict_types=1);

const host = "localhost";
const user = "root";
const password = "";

$db = null;

try {
    $db = @new mysqli(host, user, password);
} catch (Exception $e) {
    echo "Błąd bazy danych: " . $e->getMessage();
}

$sql = 'CREATE DATABASE IF NOT EXISTS todo_db;
        CREATE TABLE IF NOT EXISTS todo_db.tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            is_done BOOLEAN DEFAULT 0
        )';

$result = $db->query($sql);
```
Ale to nie zadziała i zobaczysz fatalny błąd:

![](/public/courses/php/Images/multi-query-send-use-sinngle-query-metod.png)

Chodzi o to że aktualnie zmienna `$sql` przechowuje dwa zapytania a metoda `query()` przyjmuje tylko jedno zapytanie na raz. By rozwiązać ten problem należy zastąpić `query()` metodą `multi_query()`:

```php
$result = $db->multi_query($sql);
```

> [!WARNING]
> Metoda `multi_query()` wykonuje wiele zapytań SQL naraz, ale pozostawia w pamięci wyniki tych zapytań.
> Jeśli po jej użyciu nie odbierzesz wszystkich wyników, kolejne wywołanie `query()` lub `multi_query()` może zakończyć się błędem:
> ```
> Fatal error:  Uncaught mysqli_sql_exception: Commands out of sync; you can't run this command now in ...
> ```
> 
> Aby temu zapobiec, po wykonaniu `multi_query()` należy odebrać wszystkie wyniki. Najwygodniej zrobić to w pętli `do...while`, która wykona się co najmniej raz. W tym celu używa się trzech metod:
> - `store_result()`: pobiera wynik bieżącego zapytania (np. `SELECT`). Zwraca obiekt `mysqli_result`, albo false, jeśli zapytanie nie zwraca danych (np. `CREATE TABLE`).
> - `more_results()`: zwraca true, jeśli w buforze są jeszcze kolejne wyniki zapytań wykonanych przez `multi_query()`.
> - `next_result()`: przełącza połączenie na następny wynik w kolejce. Zwraca true, jeśli kolejny wynik istnieje, false jeśli nie.
> 
> Przykład poprawnego odbierania wyników:
> ```php
> do {
>    if ($result = $db->store_result()) {
>        while($row = $result->fetch_row()){
>            //...
>        }
>        $result->free();
>    }
> } while ($db->more_results() && $db->next_result());
> ```
> Alternatywnie możesz po prostu zamknąć połączenie, co automatycznie czyści bufor wyników, a następnie połączyć się ponownie:
> ```php
> $result = $db->multi_query($sql);
> $db->close();
> $db = new mysqli(host, user, password, 'todo_db');
> ```



---

## 📨 GET vs POST

Dwie podstawowe metody komunikacji strony WWW z serwerem to HTTP *`GET`* oraz **`POST`**. Dla uproszczenia możesz uznać że metodą *`GET`* udostępniasz zasoby i dane publicznie natomiast metodą **`POST`** pobierasz prywatne dane oraz wykonujesz akcje na serwerze i chcesz to autoryzować.

| Kryterium                          | Metoda *`GET`*                                                                                                                              | Metoda **`POST`**                                                                                           |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------- |
| **Główne przeznaczenie**           | Pobieranie i odczyt danych (`Read`), filtrowanie, wyszukiwanie                                                                              | Tworzenie, modyfikacja i usuwanie danych (`Create`, `Update`, `Delete`)                                     |
| **Lokalizacja danych**             | W pasku adresu URL jako Query String (`?klucz=wartosc`)                                                                                     | W ciele żądania HTTP (*Request Body*) – niewidoczne w adresie URL                                           |
| **Poufność danych**                | **Niska** – dane widać na ekranie, w historii przeglądarki i logach serwera                                                                 | **Wyższa** – dane nie trafiają do adresu URL ani historii (do pełnego bezpieczeństwa wymaga HTTPS)          |
| **Limit rozmiaru**                 | Ścisły limit długości adresu URL (zależny od przeglądarki/serwera, zazwyczaj <span style="text-wrap: nowrap;">$\approx 2048$</span> znaków) | Brak limitu URL (ograniczony jedynie konfiguracją serwera, np. w `php.ini` jest $40MB$ `post_max_size=40M`) |
| **Obsługiwane typy**               | Wyłącznie ciągi znaków ASCII (format URL-encoded)                                                                                           | Dowolne typy danych: tekst, JSON, XML oraz pliki binarne (*multipart/form-data*)                            |
| **Pamięć podręczna i historia**    | Zapisywane w historii przeglądarki, mogą być buforowane (_**cache**_) i dodawane do zakładek                                                | Nie są zapisywane w historii ani domyślnie cachowane; ponowne wysłanie wymaga potwierdzenia                 |
| **Wpływ na stan (Idempotentność)** | Idempotentne – wielokrotne wywołanie nie powinno zmieniać stanu zasobów na serwerze                                                         | Nieidempotentne – kolejne wywołanie może utworzyć kolejny rekord lub powtórzyć akcję                        |


> [!NOTE]
> **Idempotentność** to cecha działania, które daje taki sam wynik, niezależnie od tego, czy zrobisz je raz, czy wiele razy.

### 📇 Formularze HTML

Do podstawowych sposobów komunikacji przeglądarki z serwerem należą:

- *`GET`* pobieranie zasobów, najczęściej poprzez hiperłącza (linki).
- **`POST`** wysyłanie danych, najczęściej poprzez formularze HTML.

Formularze mogą korzystać zarówno z *`GET`*, jak i **`POST`**.
*`GET`* stosujemy wtedy, gdy użytkownik wybiera lub filtruje zasób, a wynik powinien być widoczny w URL (np. wyszukiwarki, filtry, sortowanie, paginacja, konfiguratory).
**`POST`** stosujemy wtedy, gdy formularz modyfikuje dane na serwerze (np. dodawanie, edycja, usuwanie). Dodatkowo gdy dane przesyłane są wrażliwe np.: hasło logowania.

---

Przed tabelką mamy następujący formularz:

```html
<form method="POST" id="new-task">
    <label for="new_task_name">Nazwa zadania</label>
    <input type="text" name="new_task_name" id="new_task_name">
    <button name="action" value="create">Utwórz nowe zadanie</button>
</form>
```
Etykieta opisująca i wskazująca atrybutem `for` na pole `<input>` typu `text` i jego atrybut `id` oraz przycisk akcji do utworzenia nowego zadania. Atrybuty `name` pól formularza określają klucze, za pomocą których odczytamy dane w PHP. Dodatkowo przycisk ma zdefiniowany atrybut `value` do określenia rodzaju akcji.

Gdzy zbadasz stronę (<kbd>F12</kbd>) i przejdziesz do zakładki sieć/network, a następnie uzupełnisz input i klikniesz przycisk "Utwórz nowe zadanie" zobaczysz że storna się odświeżyła a przeglądarka wykonała $3$ zapytania:
- **`200`** **`POST`** `/` pobierając plik `index.php` i ustawiając nagłówek *`Content-Type: text/html`* w którym mamy dane żądania:
  - O nazwie `new_task_name` i wartości `"test"`
  - O nazwie `action` i wartości `"create"`
- **`200`** *`GET`* `style.css` pobierając plik `style.css` i ustawiając nagłówek *`Content-Type: text/css`*
- _**`404`**_  *`GET`* `favicon.ico` to klasyczny błąd $404$ oznaczający że pod podaną ścieżką nie odnaleziono pliku `favicon.ico`. Favicon to ikonka przeglądarki widoczna w zakładce obok tytułu strony.

![](/public/courses/php/Images/dane-formularza-post.png)

By móc się odwołać do tych danych formularza wysyłanych w zapytaniu (*request*), PHP udostępnia zmienną _**SUPERGLOBALNĄ**_ `$_POST`:

```php
$_POST["wartość name z kontrolki formularza"]
```

> [!NOTE]
> _**SUPERGLOBALNYCH**_ w PHP jest ich $9$: 
> 1. _**`$GLOBALS`**_ Tablica zawierająca wszystkie zmienne globalne.
> 2. _**`$_SERVER`**_ Informacje o serwerze, nagłówkach, ścieżkach, requestach.
> 3. *`$_GET`* Dane z zapytań GET.
> 4. **`$_POST`** Dane z zapytań POST.
> 5. **_`$_FILES`_** Informacje o uploadowanych plikach.
> 6. _**`$_COOKIE`**_ Dane z ciasteczek.
> 7. _**`$_SESSION`**_ Dane sesji.
> 8. _**`$_REQUEST`**_ Mieszanka GET/POST/COOKIE (zależnie od request_order).
> 9. _**`$_ENV`**_ Zmienne środowiskowe.

---

Chcąc podejrzeć wartości zmiennych **`$_POST`** przy pomocy `echo` możesz napotkać na ostrzeżenie o niezdefiniowanych kluczach.  

![](/public/courses/php/Images/niezdefiniowane-klucze-POST.png)

By zapobiec wyświetlaniu tego rodzaju ostrzeżeń można by było wyciszyć małpą `@`. Jednak to mały plaster na dużą ranę. Zamiast tego lepiej posłóżyć się instrukcjami warunkowymi sprawdzających czy w tabeli assocjacyjnej istnieje ten konkretny klucz:

```php
if (isset($_POST['new_task_name'])) {
    echo $_POST['new_task_name'];
    echo "\n";
}
if (isset($_POST['action'])) {
    echo $_POST['action'];
    echo "\n";
}
```

Zobacz że teraz na pierwsze wyświetlenie tablicy `print_r($_POST);` i jej elementy. To jest dokładnie to samo co było w requeście `/`.

![](/public/courses/php/Images/isset-post-data-form.png)

---

## ➕ Zapisywanie zadania do bazy (INSERT)

W SQL do wstawiania nowych rekordów służy polecenie `INSERT INTO`:

```sql
INSERT INTO nazwa_tabeli 
    (atrybuty) 
VALUES 
    ('pola');
```

> [!REMINDER]
> - Nagłówkowe nazwy kolumn w tabeli w bazach danych nazywamy **atrybutami**
> - **Pole** to konkretna wartość w danej kolumnie na danym wierszu.
> - Wiersze w tabelach baz danych nazywamy **krotkami**

Teraz musimy zbudować zapytanie insertu z wykorzystaniem wartości przesłanej z formularza o `name` `new_task_name` do atrybutu `name` tabeli tasks. Posłużymy się tu konkatenacją i musimy pamiętać że `name` w tabeli zdefiniowaliśmy jako `VARCHAR(255)` co oznacza że jest to tekst i musi być ujęty w apostrofy `''` albo w cudzysłów `""`. 

> Apostrofy są mocniejsze od cudzysłów. To oznacza że jako string może być przesłąny cudzysłów który opakujesz w apaostrofy. Natomiast nie działa to na odwrót. Dlatego ja preferuję zapisywać zapytania SQL w apostrofach.

```php
if (isset($_POST['new_task_name'])) {
    $insertSQL = 'INSERT INTO tasks
                    (name)
                VALUES
                    ("' . $_POST['new_task_name'] . '")
    ';

    echo $db->query($insertSQL);
}
```

W ten sposób mamy zrealizowaną pierwszą literkę **CRUD** - **Create**.

---

## 📖 Pobieranie zadań z bazy (SELECT) i wyświetlenie w tabeli











Do pobrania danych z bazy służy polecenie `SELECT`:

```sql
SELECT * FROM tasks;
```
Gwiazdka `*` oznacza pobranie wszystkich kolumn z tabeli, ale zamiast niej można podać konkretne atrybuty do uwzględnienia w wyniku, np.:

```sql
SELECT id, name FROM tasks;
```

Zamiast modyfikować konkatenacją html danymi z bazy dokonamy separacji komponentu formularza.

Wyekstrachuj zawartość `<tbody>` do odzielnego pliku `form.html`:

```html
<form method="POST">
    <tr>
        <td>1.</td>
        <td> <input type="text" name="new_task_name" id="new_task_name" value="Wypić kawę"></td>
        <td>
            <label class="hit-area">
                <input type="checkbox" name="done" id="task_1" checked>
            </label>
        </td>
        <td>
            <button name="action" value="update">Aktualizuj</button>
            <button name="action" value="delete">Usuń</button>
        </td>
        <input type="hidden" name="id" value="1">
    </tr>
</form>
```

Zmodyfikuj wymagane pozycje z zachowaniem przykładowo skałdni dwóch peocentów jako wraperów np:
- `%%index%%`: numer wyświetlany zadania
- `%%name%%`: nazwa zadania
- `%%is_done%%`: status zadania (zrobione/nie zrobione)
- `%%id%%`: id zadania w ukrytej kontrolce `type="hidden"`

Przy pomocy `file_get_contents("form.html")` wczytujemy plik do zmiennej.

![](/public/courses/php/Images/przygotowanie-pierwszej-preparacji-reuse-html.png)


Gdy templatka jest poprawnie zaciągana i zwracana jako render html to czas zacząć ją preparować.  
Funkcja `str_replace()` Przyjmuje kolejno $3$ argumenty:
- Szukana fraza np.: `"%%name%%"`
- Wartość zastępująca szukaną frazę np.: `$row["name"]`
- Zmienna zawierająca tekst do przeszukania (`string`)

Poniżej gotowy fragment kodu który w pętli przechodzi po krotkach (wierszach) tabeli tasks zaciąga zawartość pliku `form.html`, wyszukuje odpowiednie frazy i zastępuje je polami z krotek zgodnych z podanym atrybutem. Na koniec wyświetlany jest gotowy HTML w miejscu gdzie umieścimy wywołanie pętli:

```php
$select_sql = 'SELECT * FROM tasks';
$result = $db->query($select_sql);

$nr = 0;
while ($row = mysqli_fetch_assoc($result)) {
    $nr++;
    $form = file_get_contents("form.html");

    $form = str_replace("%%name%%", $row["name"], $form);
    $form = str_replace("%%id%%", $row["id"], $form);
    $form = str_replace("%%index%%", (string)$nr, $form);

    $checked = $row["is_done"] ? "checked" : "";
    $form = str_replace("%%is_done%%", $checked, $form);

    echo $form;
}
```
> PS.: Numer w tabelce na froncie nie powinien jawnie odzwierciedlać wartości `id` z tabeli bazodanowej.

![](/public/courses/php/Images/gotowa-tabela-crud-z-preparcji.png)

---

## ✏️ Aktualizacja zadania (UPDATE)

Zobaczmy co się stanie gdy teraz wciśniemy przycisk <kbd class="win-menu-btn">Aktualizuj</kbd>:

![](/public/courses/php/Images/crud-update-analize-button.png)

- Widzimy że dane są przesyłane metodą **`POST`** a nie *`GET`*.
- Jeżeli checkbox jest zaznaczony to jest przesyłana jego wartość, a jeżeli jest odznaczony, to nie ma go wcale w przesłanych danych.
- Aktualnie `if (isset($_POST['new_task_name']))` z formularza dodawania koliduje z akcją aktualizacji. Dlatego że sprawdza tylko istnienie klucza w tablicy asocjacyjnej `$_POST`, który jest obecny w obu przypadkach.

Rozdzielmy dostępne akcje w instrukcji warunkowej `switch` bazując na wartości `action` z formularza:

```php
if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case "create":
            $insertSQL = 'INSERT INTO tasks
                            (name)
                        VALUES
                            ("' . $_POST['new_task_name'] . '")
            ';

            $db->query($insertSQL);
            break;
        case "update":

            break;
        case "delete":

            break;
    }
}
```

Teraz wysłanie zapytania o typie akcji innym niż `create` nie spowoduje insertu nowych danych.

Aby zaktualizować istniejącą krotkę w bazie danych należy się posłużyć poleceniem `UPDATE`:

```sql
UPDATE nazwa_tabeli
SET atrybut1 = nowa_wartość_pola, atrybut2 = nowa_wartość_pola, ... 
WHERE warunek_określający_krotkę_do_zmiany
```
Przykładowo:
```sql
UPDATE tasks SET name = 'Nowa nazwa', done = 1 WHERE id = 1;
```

Uzupełnijmy przypadek `case "update":` w instrukcji warunkowej `switch` przygotowując zapytanie aktualizacji w SQL.  
Posłużymy się tu zmienną pomocniczą do zapisu aktualizowanego atrybutu `is_done` a resztę danych przesłanych metodą **`POST`** umieścimy bezpośrednio konkatenacją w treści zapytania SQL:

```php
case "update":
    $is_done = isset($_POST['done']) ? 1 : 0;
    $update_sql = 'UPDATE tasks SET
                name="' . $_POST['new_task_name'] . '",
                is_done=' . $is_done . '
                WHERE id=' . $_POST["id"] . ' 
                        ';
    $db->query($update_sql);
    break;
```

![](/public/courses/php/Images/uzupełnienie-przypadku-case-w-switchu-dla-aktualizacji-crud.png)

---

## 🗑️ Usuwanie zadania (DELETE)

Do pełnego zrealizowania **CRUD** pozostała nam jeszcze tylko ostatnia literka **_Delete_** (Usuwanie).

Do usunięcia rekordu z bazy służy polecenie `DELETE FROM` gdzie za pomocą `WHERE` określamy które krotki usunąć:

```sql
DELETE FROM tasks WHERE id = 1;
```

Uzupełni switch o finalną operację usunięcia wiersza z tabeli `tasks`:

```php
case "delete":
    $db->query("DELETE FROM tasks WHERE id = " . $_POST["id"]);
    break;
```

![](/public/courses/php/Images/finalny-switch-crud.png)

---

## 🗂️ Paginacja i LIMIT oraz OFFSET

Na razie w tabeli `tasks` mamy tylko $4$ krotki (wiersze). Pomyślmy jednak co jeśli mielibyśmy ich ponad $10\text{ }000$? Wyświetlenie takiej tabeli mocno obciąży render przeglądarki i nie będzie wygodne w przeglądaniu przez odbiorcę. 

Aby zaradzić temu problemowi możemy w zapytaniu `SELECT` użyć klauzuli `LIMIT` pozwalającą na ograniczenie liczby zwracanych krotek:

```sql
SELECT * FROM tasks LIMIT 5;
```
Jednak do paginacji potrzebujemy jeszcze klauzuli `OFFSET`, która pozwala na określenie, od której krotki mają być zwracane wyniki:

```sql
SELECT * FROM tasks LIMIT 5 OFFSET 10;
```

Standardowo MySQL do wykonania tej operacji zgrupuje i posortuje tabelę na podstawie pierwszej kolumny: `id`, a następnie zwróci $5$ kolejnych krotek.

---

Implementację komponentu paginacji rozpoczniemy od jego struktury html i stylu css.

Kontener który wykorzystamy do zwrapowania elementów hiperłączy powinien być tagiem `<nav>`, ponieważ zachodzi zmiana URL od której to zależy co na stronie zostanie wyświetlone. Popatrz na zawartość atrybutu `href`. Zamieszczono w niej zmienną przesyłaną linkiem czyli metodą *`GET`*:
```html
<nav class="paginacja">
    <a href="?offset=1" class="active">1</a>
    <a href="?offset=2">2</a>
    <a href="?offset=3">3</a>
    <a href="?offset=4">4</a>
</nav>
```
Masz tu gotowy styl aby komponet wyglądał jak faktyczna paginacja:
```css
.paginacja{
    width: fit-content;
    margin: 0 auto;
    display: block;
}
.paginacja a{
    display: inline-block;
    height: 30px;
    width: 30px;
    background-color: var(--info);
    color: var(--color-text);
    text-align: center;
    font-size: 25px;
    margin: 0 3px;
    border-radius: 2px;
}
.paginacja a:hover{
    background-color: var(--success);
}
.paginacja a.active{
    background-color: var(--danger);
}
```

![](/public/courses/php/Images/styl-paginacji.png)

---


Zmodyfikujmy zapytanie `SELECT` w miejscu gdzie renderują się wiersze tabeli.  
Do zmiennej pomocniczej `$offset` przypisujemy wartość zmiennej *`GET`* o ile istnieje, w przeciwnym wypadku $1$, a dlaczego nie zero? Ponieważ zakładamy że jeżeli zmienna *`GET`* nie istnieje lub użytkownik klikną na pierwszą stronę to chcemy mu wyświetlić początkowe dane.

Zapytanie `SELECT` zostanie wzbogacone o klauzulę `LIMIT 2` a paginacja bedzie wyliczana arytmetycznie względem wartości zmiennej *`GET`*:
- dla `?offset=1`: $(1 - 1 ) \times 2 = 0 \rightarrow$ `LIMIT 2 OFFSET 0`
- dla `?offset=2`: $(2 - 1 ) \times 2 = 2 \rightarrow$ `LIMIT 2 OFFSET 2`
- dla `?offset=3`: $(3 - 1 ) \times 2 = 4 \rightarrow$ `LIMIT 2 OFFSET 4`

> Wartość ilorazu i limitu powinna być taka sama.

```php
$offset = $_GET["offset"] ?? 1;
$select_sql = 'SELECT * FROM tasks LIMIT 2 OFFSET ' . ($offset - 1) * 2;
$result = $db->query($select_sql);
```

---

By wiedzieć ile elementów paginacji musimy wygenerować to potrzebujemy informacji ile w ogóle tabela zawiera krotek.  
Zapytaniem zliczającym elementy w SQL jest funkcja `COUNT(*)`:

```sql
SELECT COUNT(*) FROM tasks;
```

Jej wynik pozwoli na określenie ile stron danych uzyskamy w odniesieniu do limitu.

```php
$select_sql = 'SELECT COUNT(*) FROM tasks';
$result = $db->query($select_sql);
$rows = $result->fetch_array();

$paginationElements = $rows[0] / 2;
```

Z racji że w zapytaniu wybrano `COUNT(*)` to wynik bedzie posiadał tylko jeden atrybut, pole i krotkę.

Wynik zapytania posłuży nam do pętli for i przygotowaniu struktury html do wyświetlenia:

```php
$paginationHTML = '<nav class="paginacja">';

for($i=1; $i<=$paginationElements;$i++){
    if($i == $offset){
    $paginationHTML .= '<a href="?offset=' . $i . '" class="active">' . $i . '</a>';
    }else{
    $paginationHTML .= '<a href="?offset=' . $i . '">' . $i . '</a>';
    }
}
$paginationHTML .= '</nav>';

echo $paginationHTML;
```

![](/public/courses/php/Images/paginacja-crud-prawie-gotowa.png)

Wydaje się że wszystko jest już zrobione. Jednak istnieje mały problem.

Dla limitu $2$ ilość elementów paginacji jest źle wyliczana.  
Gdy krotek bedzie $5$ to wynik da nam $2,5$ jednak pętla nie przyjmie wartości zmiennoprzecinkowej (`float`) jako iterator. $2,5$ zostanie ona zrzutowana na `int`, więc pominie się wartość po przecinku. Pętla faktycznie wykona się $2$ razy. 

Możesz to zauważyć jeżeli ręcznie zmienisz wartość zmiennej `?offset` w URL na $3$:
![](/public/courses/php/Images/ręczna-zmiana-offsetu.png)

W PHP mamy dwa sposoby zaokrąglania:

- `ceil(float $value): int`: Zaokrągla <b>w górę</b> do najbliższej liczby całkowitej.
- `floor(float $value): int`: Zaokrągla <b>w dół</b> do najbliższej liczby całkowitej.
- `round(float $value, int $precision = 0): float`: Zaokrągla <b>do najbliższej wartości</b> o danej precyzji po przecinku. Domyślnie działa jak „połówki w górę”, ale można zmienić tryb zaokrąglania:

| Tryb                           | Opis                                                           | Przykład                                     |
| :----------------------------- | :------------------------------------------------------------- | :------------------------------------------- |
| `PHP_ROUND_HALF_UP` (domyślny) | Zaokrągla połówki w górę                                       | `round(2.5)` daje `3`                        |
| `PHP_ROUND_HALF_DOWN`          | Zaokrągla połówki w dół                                        | `round(2.5)` daje `2`                        |
| `PHP_ROUND_HALF_EVEN`          | Zaokrągla połówki do najbliższej parzystej (metoda bankierska) | `round(2.5)` daje `2`, `round(3.5)` daje `4` |
| `PHP_ROUND_HALF_ODD`           | Zaokrągla połówki do najbliższej nieparzystej                  | `round(2.5)` daje `3`, `round(3.5)` daje `3` |



![](/public/courses/php/Images/finalny-crud.png)