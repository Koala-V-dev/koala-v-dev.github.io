# Refaktoryzacja aplikacji

W poprzedniej lekcji *Rejestracja i logowanie*, zrealizowaliśmy mechanizmy logowania i rejestracji. Nasza aplikacja posiada już fundamenty uwierzytelniania, obsługę sesji oraz bazowe mechanizmy bezpieczeństwa (*Argon2id*, zabezpieczenie przed *XSS* i tokeny *CSRF*). Zanim jednak przejdziemy do implementacji akcji użytkowników (dodawanie i usuwanie wpisów, przypisywanie awatarów) oraz systemu ról (`user` vs `admin`), musimy dokonać rzetelnej _**analizy stanu projektu**_ i zaplanować jego **wstępną refaktoryzację**.

---

## 🗺️ Mapa architektury obecnego stanu projektu

Poniższy diagram przedstawia przepływ danych, powiązania między plikami oraz zidentyfikowane obszary długu technologicznego, które wymagają uporządkowania przed dodaniem nowych funkcjonalności:

![Schemat zależności i powstająca architektura](/public/courses/php/Images/zalążek-architektury.png)

:::diagram
Diagram architektury przedstawia pełny obieg żądania HTTP w aplikacji po module „Rejestracja i logowanie” – od momentu wysłania żądania przez przeglądarkę użytkownika, przez reguły serwera Apache (.htaccess), warstwę logiki i danych (router.php, Auth.php, MySQL, sesja PHP), aż po warstwę prezentacji (szablony HTML, wstrzykiwanie komponentów i podmianę znaczników) oraz zwrot wyrenderowanego kodu HTML do klienta.
:::

**Opis strukturalny diagramu**

1. **Przeglądarka / Użytkownik** – inicjuje żądanie HTTP metodą `GET` lub `POST` i oczekuje na odpowiedź w postaci wyrenderowanego kodu HTML.
2. **Serwer Apache (`.htaccess`)** – weryfikuje adres URL i dokonuje przepisania żądań:
   - **Dostęp bezpośredni** kieruje do katalogu `/resources/` (arkusz `style.css`, obrazy, awatary).
   - **Przekierowanie do wejścia** kieruje ruch aplikacji do pliku startowego `index.php` (bootstrap bazy danych i schemat tabel `users` oraz `posts`).
3. **Warstwa Logiki i Danych (kontener pomarańczowy)**:
   - **`backend/core/router.php`** – punkt wejścia analizujący trasę URL za pomocą instrukcji `switch` (brak dedykowanych kontrolerów).
   - **`backend/core/Auth.php`** – klasa odpowiedzialna za obsługę uwierzytelniania, filtry XSS, tokeny CSRF, operacje SQL oraz zarządzanie sesją.
   - **Algorytm Argon2id** – realizuje haszowanie (`password_hash`) oraz weryfikację haseł (`password_verify`).
   - **Baza MySQL (`platforma`)** – przechowuje tabele `users` (pola: `id`, `login`, `pass`, `role`) oraz `posts` (pola: `id`, `author`, `content`), z którymi `Auth` komunikuje się przez zapytania `mysqli`.
   - **Sesja PHP (`$_SESSION`)** – przechowuje dane zalogowanego klienta (`user data`) oraz token `csrf_token`.
4. **Warstwa Prezentacji: Szablony HTML (kontener niebieski)**:
   - **`backend/views/`** – statyczne pliki widoków (`login.html`, `all-posts.html`, `error404.html`) odczytywane za pomocą `file_get_contents`.
   - **`register_login_section.html`** – pod-komponent formularzy logowania i rejestracji wstrzykiwany do głównego szablonu.
   - **Manualny rendering widoku** – operacja `str_replace()` na markerach szablonu, podstawiająca komunikaty błędów, wygenerowany token CSRF oraz widok zależny od stanu zalogowania.
5. **Zwrócenie wyrenderowanego HTML** – sklejony finalny dokument HTML trafia z powrotem do przeglądarki użytkownika.
6. **Podział kontenerów**: zielony = konfiguracja serwera WWW, pomarańczowy = warstwa logiki i danych backendu, niebieski = warstwa prezentacji i szablonów HTML.
 
---

### 🔍 Wnioski z analizy stanu projektu (Co wymaga refaktoryzacji?)

| Obszar / Komponent   | Stan obecny                                                                                 | Problem / Zagrożenie                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **`router.php`**     | Monolityczny `switch($uri)` z obsługą bazy, logiki i widoków w jednym pliku                 | Złamanie zasady pojedynczej odpowiedzialności (*SRP*), trudne skalowanie przy nowych akcjach                                               |
| **`Auth.php`**       | Klasa łączy rejestrację, logowanie, czyszczenie XSS, sprawdzanie CSRF i operacje bazodanowe | „Boski obiekt” (*God Object*), mieszanie walidacji HTTP z logiką domenową                                                                  |
| **Zapytania SQL**    | Konkatenacja ciągów w zapytaniach SQL (`'SELECT ... WHERE login="' . $login . '"'`)         | **_Podatność na SQL Injection_** mimo stosowania encji HTML. Aktualne formularze są odporne dopóki wykorzystujemy prymitywne zapytania SQL |
| **Szablony widoków** | Ręczne zastępowanie `%%placeholder%%` za pomocą wielokrotnego `str_replace()`               | Ogromne ryzyko powstania chaotycznego i wymieszanego kodu przy rozbudowie UI, brak dynamicznych pętli dla postów i ról                     |

---

## Planowanie nowej architektury

Na wykresie jest bardzo dużo strzałek i miejsc w których zawsze można zrobić coś lepiej. Spróbujmy to uporządkować.

Nasza aplikacja:
1. Przyjmuje żądania:
  - *`GET`* z linku URL by wyświetlić daną stronę
  - **`POST`** z formularza wysyłającego dane i oczekującego na odpowiedź
2. Zapamiętuje zalogowanego użytkownika
3. Przetwarza dane wejściowe by zapobiec atakom XSS
4. Stosuje tokeny CSRF jako dodatkową warstwę bezpieczeństwa że dalej prowadzi dialog z poprawnym klientem
5. Utajnia hasło
6. Komunikuje błędnie wprowadzone dane przez użytkownika
7. Zapisuje informacje do bazy danych
8. Odczytuje informacje z bazy danych

> Zastosujmy się do podstawowej zasady programistów czyli *pojedyncza odpowiedzialność, reużywalność oraz nie blokownie rozwoju*.


`router.php` aktualnie robi za dużo, inicjalizuje bezpiecznie sesję, połączenie z bazą danych, sprawdzenie URI i wywołanie w _**`switch`**_ masy kodu. W procesie refaktoryzacji powinny powstać dedykowane klasy by sam plik `router.php` stał się tylko prostym zbiorem mapowania URI na na jakąś klasę.

Powstaną nam wtedy:
- `SessionManager`: Klasa której odpowiedzialnością bedzie zarządzanie sesją.
- `Database`: Klasa przez którą bedziemy się komunikować z bazą danych.
- `Router`: Faktyczna klasa do której bedziemy tylko przekazywać mapę zależności URI z pliku `routes.php`.

Mamy też klasę w pliku `Auth`, która świadczy dwa cele czyli rejestracja i logowanie reszta to pomocnicze walidacje danych i ich zabezpieczanie. Ponadto mieszamy tu logikę i zapytania SQL czyli pracę wykonywaną na preprocesorze PHP i komunikację z silnikiem bazodanowym DBMS.

Rozdzielimy te drogi czyli rejestrację użytkownika od jego logowania do platformy, a na dodatek separacji potraktujemy też warstwy logiki i repozytoriów zapytań:
- `RegisterController` i `LoginController`: Główni nadzorcy procesów logiki i walidacji danych.
- `UserRepository`: Baza metod statycznych zawierająca zapytania dotyczące użytkowników.

---

## Composer

Dobra mamy za sobą lekki projekcik rejestracji i logowania. Wiemy co w nim jest nie tak i mamy plan by to naprawić.  
To właśnie początek myślenia architektonicznego, a nie kolepacza kodu. W tym momencie doskonałym będzie wykorzystanie cudu takiego jak **menedżer pakietów Composer**.  

Przechodząc na stronę pobierania [https://getcomposer.org/download/](https://getcomposer.org/download/) masz dwie opcje:
- instalator `.exe` w którym decydujesz czy instalujesz tylko dla siebie LUB dla wszystkich użytkowników ale wtedy musisz być adminem.
- Pobrać plik `.phar` na którym uruchamiasz komendy kompozytora przy użyciu PHP np. `php composer.phar`:

![Kompozytor zarządza zależnościami PHP](/public/courses/php/Images/composer.phar.png)

--- 

Zainicjuj kreator projektu:
```bash
php composer.phar init
```

Pierwsze pytanie dotyczy nazwy projektu zazwyczaj `nazwa-firmy/nazwa-kodowa-projektu` np.
```bash
rudek/platforma
```
W kolejnym pytaniu decydujesz czy dołączyć autora. Wpisujesz `n` by pominąć.
Następnie określasz, które poziomy stabilności pakietów mają być akceptowane podczas instalacji w projekcie.

| Poziom rozwoju | Znaczenie                                                                       |
| -------------- | ------------------------------------------------------------------------------- |
| `dev`          | Najbardziej liberalny i nieblokujący możliwości instalacji jakichkolwiek paczek |
| `stable`       | Tylko stabilne wersje typowe dla środowiska produkcyjnego                       |
| `rc`           | *release candidate* (prawie stabilne) 😉                                         |
| `beta`         | Wersje testowe i zapoznawcze                                                    |
| `alpha`        | Bardzo wczesne wersje                                                           |

Dla ułatwienia możesz uznać że `minimum-stability` ma dwie opcje:
- `stable`: piszesz gdy realnie jesteś w pracy i już dużo ogarniasz.
- `dev`: uczysz się, eksperymentujesz poznajesz nowości.


Następne pytanie dotyczy typu tego co bedziesz robić. Podpowiem żę na start tworzysz **projekty**.
> Pozostałe typy nie będę omawiał. Ponieważ gdy bedziesz na nie gotów, to bedziesz wiedział już co znaczą.

Licencję daj standardowo jako _**MIT**_.

Bibliotek jeszcze rzadnych nie znamy więc dla obu pytań o zależności napisz **_`no`_**.

Teraz najważniejsze. Na którym katalogu ma działąć **PSR-4 autoloader**? Standardowo jest to katalog **src**, ale ja tam lubię wpisać `backend/` albo `core/`.

W ostatnim pytaniu wyświetli ci się konfiguracja i gdy klikniesz <kbd>Enter</kbd> to composer utworzy plik `composer.json` i katalog `vendor` do przechowywania wszystkich zależnych pakietów dla twojego projektu.

![](/public/courses/php/Images/composer-init-platforma.png)

> Małą poprawka wartości obiektu `psr-4` (i literówki w opisie):

```json
{
    "name": "rudek/platforma",
    "description": "Platforma z wpisami użytkowników",
    "type": "project",
    "license": "MIT",
    "autoload": {
        "psr-4": {
            "App\\": "backend/"
        }
    },
    "minimum-stability": "dev",
    "require": {}
}
```

---

## Klasa Router

Przygotujmy pierw bazę. Zobacz że w `backend\` powstał nowy dedykowany plik `routes.php` do mapowania tras i aktualnie tworzy instancję klasy `Router()`.  
Katalogi `core\` i `views\` mają poprawione nazwy i zaczynają się z dużej litery.  
W `index.php` zakomentowano fragment inicjalizacyjny tworzący bazę danych wraz z tabelami jeżeli czegoś brakuje oraz zmieniono lokalizację względną z:
```php
require_once("./backend/core/router.php");
```
na:
```php
require_once("./backend/routes.php");
```

Czasami autoloader może się nie ogarnąć samoistnie nowe pliki i katalogi, więc warto wywołać poniższą komendę:
```bash
php composer.phar dump-autoload
```

![](/public/courses/php/Images/przygotowanie-do-budowy-Routera.png)

> Zobacz że teraz mamy nie musimy zapisywać `require_once` ale za to musimy skorzystać z `use` oraz `namespace`.

Założenie jest takie, tworzymy kontener będący tablicą do przechowywania macierzy powiązań URI i metody na konkretne klasy i ich metody.
```php
/**
 * Kontener na zmapowane trasy URL
 *
 * @var array
 */
private array $routes = [];
```

Instancja klasy **Router** przechowuje te zmapowania, więc musi udostępniać publicznie tak zwaną metodę setera do dodawania nowych elementów w kontenerze tras. 

```php
/**
 * Dodawanie mapowania na trasy  metody GET
 *
 * @param string $uri trasa URI
 * @param array $action Tablica dwuelementowa z klasą i metodą
 * @return void
 */
public function get(string $uri, array $action): void {
    $this->routes['GET'][$uri] = $action;
}
```
Odrazu dodamy też metodę `post`, która bedzie działać analogicznie ale dla metod POST.

```php
/**
 * Dodawanie mapowania na trasy  metody POST
 *
 * @param string $uri trasa URI
 * @param array $action Tablica dwuelementowa z klasą i metodą
 * @return void
 */
public function post(string $uri, array $action): void {
    $this->routes['POST'][$uri] = $action;
}
```

Dodatkową metodą publiczną bedzie uruchomienie sprawdzenia istnienia danej trasy, wywołania metody przypisanej trasie klasy oraz w razie nie znalezienia trasy wywołanie strony z komunikatem błędu $404$.

```php
/**
 * Uruchomienie Routera i wyszukiwania trasy.
 * Jeżeli nie znajdzie trasy zgodnej z Metodą i URI to zwraca HTTP Error 404
 *
 * @return void
 */
public function run(): void {
    $method = $_SERVER['REQUEST_METHOD'];

    $uri = \explode("?", (string)$_SERVER["REQUEST_URI"])[0];

    if(!isset($this->routes[$method][$uri])){
        \http_response_code(404);
        echo "ERORR 404: Nie znaleziono strony";
        return;
    }
}
```
> Jak widzisz wykorzystano tu wcześniej zapisaną metodę `explode`.
> Dodatkowo jest też `return;`, który nic nie zwraca bo metoda jest `void` i jego jedynym celem jest przerwanie wykonywania dalszego kodu tej metody.


![](/public/courses/php/Images/Pierwszy-etap-klasy-Router.png)

Pamiętaj aby dopisać też $2$ jedyne lecz bardzo ważne `require_once` w pliku `index.php`:
<small>index.php</small>
```php
require_once ('./vendor/autoload.php');
require_once("./backend/routes.php");
```

Dodatkowo masz $2$ możliwe sposoby uruchomienia Routera:
- Możesz to zrobić bezpośrednio w `routes.php`
- Możesz to zrobić w `index.php` z racji że `require_once` to tak naprawde doklejenie zawartości pliku w miejscu jego wywołania.

---

### Pierwsza trasa dla Routera

Gdy popatrzymy na seter w klasie Router czyli metodę `get()` to wysuwamy wniosek że musimy jej przekazać adres URI w stringu oraz jakąś tablicę. Wcześniejsze założenia nakierowują nas na konieczność podania klasy i metody z tej klasy która ma zostać uruchomiona.

Zatem wywołajmy metodę `get()` klasy Router z argumentami `/` oraz tablicą z nazwą klasy `HomeController::class` oraz metodą `render`.

<small>routes.php</small>

```php
$router->get("/", [HomeController::class, "render"]);
```
Dlaczego akurat w taki sposób?  
Zacznijmy od metody. Jeżeli w tablicy zapisane zostało by po prostu `render()` to interpreter PHP spróbował by wywołać te funkcję i zwróciło by błąd braku jej definicji. Natomiast zapisanie samej nazwy oznaczało by że jest to stała, której też nie zdefiniowano.  
Dlaczego więc nazwa klasy nie jest zapisana jako string?  
Popatrz na te dwa dwukropki `::`. Standardowo w PHP używamy ich do odwoływania się abstrakcji stałych. Najczęściej zobaczysz zapis: `Klasa::metoda_statyczna()` lub `Klasa::STALA_KLASY`. Natomiast my zamiast brać element klasy to bierzemy całą jej definicję dlatego jest `::class`.

---

### Home controller

Napiszmy więc naszego pierwszego nadzorcę kontrolującego procesy związane z widokiem strony głównej.

W katalogu `backend\Core\` Utwórz katalog `Controllers` i utwórz w nim plik `HomeController.php`.

Definicja całej klasy jest bardzo banalna. Tak jak w wcześniejszej wersji zwrócimy przy pomocy `echo` zawartość pliku `login.php`:

<small>backend\Core\Controllers\HomeController.php</small>

```php
<?php
declare(strict_types=1);

// namespace powinien być zgodny z katalogiem w którym znajduje się plik gdzie zamiast backend\ piszemy App\.
namespace App\Core\Controllers;

class HomeController {
    public function render():void {
        echo \file_get_contents("./backend/Views/login.html");
    }
}
```

---

### Uruchomienie metody render klasy HomeController na trasie "/"

Mamy trasę i mamy klasę kontrolera, ale Router jeszcze ich nie jej nie wywołuje.

Przy pomocy `$method` i `$uri` musimy odnajdziemy odpowiednią tablicę w kontenerze `$routes` (`:array`). Zmapować na zmienne i wykorzystać je w procesie inicjalizacji instancji klasy i wywołania z niej metody.

Zmapowanie wartości elementów tablicy na zmienne wygląda tak:
```php
 [$controllerClass, $controllerMethod] = $this->routes[$method][$uri];
```
Potem wykorzystujemy je tak jakbyśmy po prostu pisali standardową instancję i wywołanie:
```php
$controller = new $controllerClass();
$controller->$controllerMethod();
```
Dlaczego tak można? Ponieważ PHP podczas interpretacji zastępuje zmienne ich wartościami i w drugiej kolejności wykonuje kolejne kroki kodu. Wyobraź to sobie tak:

```php
$controller = new class HomeController{...}();
$controller->render();
```

![Router - wywołanie metody klasy przez Router](/public/courses/php/Images/wywołanie-metody-klasy-przez-Router.png)

---

## Menadżer sesji

Skoro Router już działa, czas zająć się za mechanizmami sesji. Logicznie nie bedzie to tym razem kontroler. Bo to właśnie kontrolery będą chciały komunikować się z `SessionManager`, więc ta klasa ma świadczyć usługę. Co za tym idzie w `backend\Core\` powinien powstać dedykowany katalog `Services\`.  

W poprzedniej wersji fragment kodu odpowiedzialny za sesję wyglądał tak:
```php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
```

Będziemy musieli to samo zaimplementować w klasie `SessionManager`. Powyższy kod jest traktowany jako element startowy, bez którego dalsza praca z sesją nie ma sensu. Dlatego przy tworzeniu instancji naszej klasy `SessionManager` musimy je wywołać.  
Odpowiednie dla nich miejsce to konstruktor, ale nie wkleimy ich tak po prostu. Stworzymy $3$ prywatne metody, które konstruktor wywoła.

Konfiguracja parametrów ciasteczka **PHPSESSID** i zapewnienie istnienia tokenu CSRF jest praktycznie bez zmian ale z zastosowaną separacją do dedykowanych metod prywatnych.
```php
private function configure(): void
{
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

private function ensureCsrfToken(): void
{
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}
```

Startując sesję wydajniej będzie sprawdzić najpierw czy nie jest już ona aktywna. Pomijamy w ten sposób niepotrzebne wysyłanie nagłówka HTTP. Wartość `PHP_SESSION_ACTIVE` jest stałą języka PHP i to do niej należy porównać wartość struktury obiektu sesji. 
```php
private function start(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}
```

Wtedy konstruktor bedzie wyglądał następująco:
```php
public function __construct()
{
    $this->configure();
    $this->start();
    $this->ensureCsrfToken();
}
```

Co za tym idzie w `HomeController` podpinamy `use` klasy menadżera sesji, tworzymy zmienną prywatną typu tej klasy `SessionManager` by przechowywać w niej instancję tej klasy do przyszłego odwoływania się w innych metodach. 

Standardowo samą instancję inicjalizujemy w konstruktorze kontrolera.

```php
private SessionManager $session;

public function __construct()
{
    $this->session = new SessionManager();
}
```

Jak widać w danych strony po odświeżeniu  powstało ciasteczko **PHPSESSID**:

![](/public/courses/php/Images/sesja-z-SessionManager.png)

---

### Token CSRF Menadżera sesji

Dodajmy dwie metody dotyczące tokenu CSRF który się wygenerował przy inicjalizacji klasy `SessionManager`.

- Dostęp do wartości tokenu:
    ```php
     public function getTokenCSRF(): string
    {
        return $_SESSION['csrf_token'];
    }
    ```
- Sprawdzenie czy otrzymany token jest taki sam jak przechowywany w sesji: 
    ```php
    public function validateCSRF(string $token): bool
    {
        return hash_equals($this->getTokenCSRF(), $token);
    }
    ```

---

### Sesja użytkownika

W sesji też wcześniej przechowywaliśmy użytkownika po udanym zalogowaniu.  
- metoda *setera* ustawiająca wartość na kluczu user w tablicy asocjacyjnej superglobalnej `$_SESSION`:
    ```php
    public function setUser(array $user): void
    {
        $_SESSION['user'] = $user;
    }
    ```
- metoda *getera* pobierająca użytkownika z sesji:
    ```php
    public function getUser(): array
    {
        return $_SESSION['user'] ?? [];
    }
    ```
- funkcjonalność dla wylogowania, czyli usunięcia klucza `user` z sesji
    ```php
    public function logout(): void
    {
        unset($_SESSION['user']);
    }
    ```

> [!TIP]
> W sumie metodę `getUser()` można już na tym etapie zapisać lepiej. Aktualnie zwraca ona tablicę asocjacyjną danych użytkownika z BD albo pustą tablicę. To oznacza że bedziemy musieli tworzyć takiego ifa:
> ```php
> if(empty($session->getUser())){...}
> ``` 
> A małą poprawką mogli byśmy pisać tak:
> ```php
> if($session->getUser()){...}
> ```
> Wystarczyło by zadeklarować że metoda nie zwraca tablicy, tylko <u>może opcjonalnie</u> ją zwrócić `: ?array`.
> Wtedy zamiast zwracać `[]` to zwracamy `null`, który jest tańszy jako wartość/typ niż pusta struktura tablicy.
> ```php
> public function getUser(): ?array
> {
>    return $_SESSION['user'] ?? null;
> }
> ``` 

## Renderowanie Widoków i zasiewanie ich danymi

W tym momencie refaktoryzacji projektu musimy się zatrzymać.

- Strony mogą mieć różnego rodzaju konfiguracje sektorów składających się na gotowy wynik. Często są to konkretne wartości takie jak nazwa użytkownika lub np.: decyzja o wyświetleniu formularza rejestracji lub logowania zależna od stanu zalogowania użytkownika w sesji.  
- Jest to też ostatni moment przed wysłaniem odpowiedzi do klienta. Tu musimy dokładnie pilnować jakie dane od nas opuszczają serwer.  
- Dany widok może być wielokrotnie użyty w pętli albo kilka kontrolerów będzie chciało daną templatke użyć.

Przydał by nam się pośrednik który sprawdzi istnienie pliku templatki i przekaże jej dane które od nas otrzyma. 

W `backend\Core\` musimy stworzyć nową klasę `View.php`. Tym razem bedzie się ona różnić od poprzednich.

Mianowicie jej jedyną metodą będzie `public static function render()`. Zwróć uwagę na słowo kluczowe **_`static`_**, oznacza to że nie tworzymy jej instancji lecz chcąc wywołać jej metodę odwołujemy się bezpośrednio do definicji klasy:
```php
View::render();
```

W tym momencie też warto przejść z stosowania ścieżek bezwzględnych do ścieżek względnych. W PHP można skorzystać z stałej `__DIR__` która zwroci lokalizację wykonywalnego pliku względem głównego katalogu dysku np.:
- *Windows*: `C:\xampp\htdocs\backend\Core\View.php`
- *Linux*: `/var/www/html/backend/Core/View.php`

Wtedy patrzysz gdzie leży plik z daną templatką i gdzie w strukturze projektu wywołasz `__DIR__`. Wtedy doklejasz kolejne katalogi, a gdy musisz przejść do katalogu wyżej to zapisujesz `/../`, bo to właśnie te dwie kropki znaczą (`cd ..` przejdź do katalogu wyżej).

```
./backend
    └── Core/
    |   └── /plik.php
    └── Views/
        └── /plik.html
    
-------------------------------------------------

./backend  /Core/Plik_w_którym_jestesmy.php
   └── /..
       └── /Views/Plik_do_którego_się_chcemy_odnieść.html
```

Dlatego stabilniej i przewidywalniej jest zapisywać tak:

```php
public static function render(string $view, array $data = []): void
{
    $path = __DIR__ . '/../Views/' . $view;
}
```
Jest jeszcze jedno miejsce gdzie powinniśmy poprawić bezwzględne ścieżki:

<small>index.php</small>
```php
require_once ('./vendor/autoload.php');
require_once("./backend/routes.php");
```

> Tak w ogóle to `require_once` nie wymaga nawiasów.

```php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . "/backend/routes.php";
```

---

Dobra mamy ścieżkę do templatki ale nie mamy pojęcia czy ona tam istnieje. Zapiszmy instrukcję warunkową _**`if`**_ z negacją wywołania funkcji `file_exists` i w razie co rzucimy wyjątkiem. 
```php
if (!\file_exists($path)) {
    throw new \Exception("Nie znaleziono widoku w " . $view);
}
```

Wywołajmy metodę render w `HomeController`:
```php
View::render("xd.html",[]);
```

Jak widzisz fatalny błąd poprawnie się ukazał przerywając dalszą pracę preprocesora PHP. 

![](/public/courses/php/Images/templatka-w-danej-lokalizacji-nie-istnieje.png)

> Gdy zmienisz wartość wywołania na plik który faktycznie istnieje w `backend\Views\` to zobaczysz biały ekran w przeglądarce.

Dopisując do statycznej metody `render` w klasie `View` linię: `include $path;` widok znów będzie dostępny, tak jak był w przypadku `echo file_get_contents()`.

Pewnie się teraz zastanawiasz, *po co było tyle pisać skoro jedna linijka daje ten sam efekt?*
Mamy teraz możliwość siania danych 😎...

W `HomeController` w metodzie `render()` pobierzmy użytkownika i przekażmy go do pośrednika `View`:
```php
public function render(): void
{
    $user = $this->session->getUser();
    View::render("login.html", ["user" => $user]);
}
```
Natomiast w samym renderze użyjemy nowej funkcji jaką jest `extract()`, która tworzy zmienne o nazwie klucza tablicy asocjacyjnej i inicjuje ich wartości zgodnie z tym na co wskazuje jej klucz.

<small>backend\Core\View.php</small>

```php
<?php

declare(strict_types=1);

namespace App\Core;

class View
{
    /**
     * Weryfikuje istnienie widoku w `backend/Views/`, rzuca wyjątek gdy go nie ma.
     * W przeciwnym wypadku rozpakowuje i przekazuje zmienne z tablicy asocjacyjnej do pliku z templatką.
     *
     * @param string $view Nazwa widoku
     * @param array $data Dane przekazywane do widoku format: `["user" => $user, "token" => $token, ...]`
     */
    public static function render(string $view, array $data = []): void
    {
        $path = __DIR__ . '/../Views/' . $view;

        if (!\file_exists($path)) {
            throw new \Exception("Nie znaleziono widoku w " . $view);
        }

        \extract($data);

        include $path;
    }
}
```

Natomiast plik `login.html`  zmianiamy na rozszerzenie `.php` i zastępujemy „haczyk” `%%register_login_section%%` poniższą instrukcją warunkową:

```php
<?php
if ($user) {
    echo "Witaj " . $user["username"] . "!";
} else {
    include __DIR__ . "/register_login_section.html";
}
?>
```

![](/public/courses/php/Images/widok-zależny-od-wartości-zmiennej-user.png)

> Jak widzisz wszystko działa poprawnie. Nie zalogowaliśmy się więc widzimy formularze rejestracji i logowania. Mimo to IDE zgłasza jakiś problem z niezdefiniowaną zmienną `$user`. 
> To dlatego że `intelephense` analizuje kod statycznie i nie kuma że w `View` wyekstrahowaliśmy tą zmienną.
> Jest na to bardzo łatwy sposób, a przy okazji da nam lepiej udokumentowany kod. Na początku pliku z widokiem zapisujemy PHPDocs zmiennych z których widok korzysta:
> ```php
> <?php
> declare(strict_types=1);
> /** @var array|null $user
> * @var string $csrf
> * @var string $register_msg
> * @var string $login_msg 
> */
> ?>
>```

## Klasa dostępu do bazy danych

No i tu robi się ciekawie. Od lat są dwa podejścia:
- Dla MySQL/MariaDB dedykowany sterownik `ext-mysqli`
- Dla każdego innego np.: PostgreSQL, SQLite, Microsoft SQL Server itd. używamy `ext-pdo` (PHP Data Objects).

Dużo jest gadane że `PDO` to jedyna słuszna droga bo jest w pełni obiektowe a `mysqli` możesz zapisać proceduralnie i obiektowo. Zazwyczaj się też zaczyna od `mysqli` a potem wraz z pisaniem bardziej obiektowo przechodzi do `PDO`. Stąd ta gatka że `PDO` jest lepsze od `mysqli`.

My w `Database` obsłużymy oba sterowniki a wybór pozostawiamy konfiguracji w pliku `.env`. No właśnie `.env`. Co to jest za plik?

> [!NOTE]
> Plik **ENV** zapisywany w dwóch wariantach:
> - `.env`: używany przez projekt i ściśle tajny nie może wyciec bo zawiera hasła i klucze do baz danych, API itd.
> - `.env.example`: publiczny wzorzec z nazwami zmiennych z których korzysta aplikacja ale bez wartości.

Przejdź teraz do terminala i wpisz:
```bash
php .\composer.phar search env 
```

Zobaczysz wszystkie pakiety zawierające frazę `env`, ale nie wszystkie dotyczą pliku `.env`. Na ten moment interesuje nas `vlucas/phpdotenv` bo naszym celem jest załadować zmienne z `.env` do kodu PHP. Nic więcej. Zero bajerów.

Zaktualizujmy zależność w `composer.json` poprzez terminal
```bash
php .\composer.phar require vlucas/phpdotenv
```

Po wykonaniu komendy plik `composer.json` się zaktualizował ale w konsoli mamy error:
![](/public/courses/php/Images/compozer-error-none-extension-zip.png)

Pamiętasz jak używaliśmy `mb_string`? Tam też domyślnie było to wyłączone. Powtórzymy ten sam proceder lecz tym razem dla rozszerzenia zip:

Przejdź do `C:/xampp/php/` i edytuj `php.ini`. W nim wyszukaj frazy:
```
;extension=zip
```
I zmień na wersję bez średnika:
```
extension=zip
```

![](/public/courses/php/Images/php-ini-zip.png)

Teraz możemy wrócić do terminala w VS Code ale nie powtarzajmy komendy. Zależność jest już w `composer.json` więc wystarczy tylko wykonać komendę `install`.

Zatem wpisz:
```bash
php .\composer.phar install
```

Zobacz jakiej wersji ci się zainstalował i w `composer.json` zmień `*` na tą wersję u mnie to `5.7`.

![](/public/courses/php/Images/composer-install.png)

> Dlaczego nie zapisałem całej wersji `5.7.0`?
> Te numeracje odzielone kropkami decydują o poziomie różnic miedzy wersjami:
> - Pierwsza liczba to **Major** (duże zmiany, często niekompatybilne z poprzednią wersją)
> - Druga liczba to **Minor** (mniejsze zmiany, które nie psują kompatybilności wstecznej)
> - Trzecia liczba to **Patch** (drobne zmiany, poprawki błędów)
> Dlatego stwierdziłem że małe zmiany poprawiające bezpieczeństwo i wydajność zawsze na propsie 🔥.

Utwórz w katalogu głównym projektu plik `.env` i dodaj do niego poniższe wpisy:

```env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=platforma
```

Potem skopiuj plik, usuń wartości i zmień nazwę na `.env.example`. 

Teraz przygotujemy tak zwany `bootstrap` w `backend/` bo to właśnie na tym katalogu operuje autoloader. Utwórz plik `backend/bootstrap.php` o następującej zawartości:
```php
<?php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
```
Doklej go w `index.php` pomiędzy autoladerem i `routes.php`:
```php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/backend/bootstrap.php';

require_once __DIR__ . "/backend/routes.php";

$router->run();
```

> [!NOTE]
> **BootStrap** to skrypt który konfiguruje aplikację. To właśnie w nim między innymi ładujemy pliki konfiguracyjne i rozpoczynamy inicjalizację różnych modułów które się pomiędzy sobą komunikują ale w żadnym innym miejscu intuicyjnie ich nie instancjonujemy.


Gdy `bootstrap.php` i `index.php` masz ogarnięte to dla testów tymczasowo wpisz do metody `render()` w `HomeController`:
```php
print_r($_ENV);
```
Po odświeżeniu strony powinna się pokazać tablica asocjacyjna zawierająca dane z pliku `.env`.

![](/public/courses/php/Images/test-działania-dotenv.png)

Dlaczego w ogóle ścieżka w `Dotenv\Dotenv::createImmutable()` przyjmuje parametr do folderu a nie pliku `.env`?
1. Gdyby metoda miała domyślny argument jako stałą `__DIR__` to zamiast zwrócić twój katalog projektu to by się odnosiła do lakalizacji w `vendor` gdzie ją zainstalowaliśmy
2. Biblioteka wymusza standardową konwencję nazewnictwa plików `.env`
3. jako drugi parametr możesz podać w tablicy nazwy plików które zostą sklejone jako wspólny obiekt w pamięci RAM.
    - `immutable` gdy w kolejnym pliku powtórzy się zmienna to jej wartość **nie nadpisze poprzedniej**
    - `mutable` gdy w kolejnym pliku powtórzy się zmienna to jej wartość **_nadpisze poprzednią_**


### Klasa Database

W `backend/Core/Services/` utwórz plik klasy `Database`. Bedziemy go używać w repozytoriach zapytań SQL, wiec warto sobie ułatwić do niej dostęp robiąc ja statyczną. Jej jedyną odpowiedzialnością bedzie udostępnianie połączenia z bazą danych i w razie niepowodzenia zgłoszenie fatalnego błędu.

Tworzymy więc standardową strukturę klasy jak każdą inną:
```php
<?php
declare(strict_types=1);

namespace App\Core\Services;

class Database{
    private static ?\mysqli $connection = null;
}
```
> W zmienna prywatna statyczna ma za zadanie przechowywać obiekt `mysqli` albo pozostać na wartości `null`. dlatego jej typ ma na początku dopisany znak zapytani `?`.
> Bedziemy tworzyć z niej singletona aby uniknąć niezliczonych duplikacji połączeń.
> `\` przed `mysqli` wymusza na interpreterze aby szukał tej klasy globalnie jako natywnej PHP, a nie w namespace `App\Core\Services`.


Dodajmy teraz funkcję która najpierw sprawdzi czy `$connection` dalej ma wartość `null` i jeżeli tak to podejmie próbę połącznia z bazą danych wykorzystując zmienne z `.env`. W razie nie powodzenia umrze zwracając komunikat błędu fatalnego.  
Jeżeli próba połączenia się powiedzie lub `$connection` nie posiadał wartości `null` to zwracamy obiekt `mysqli` z zmiennej `$connection`.

```php
public static function getConnection(): \mysqli{
        if(self::$connection === null){
            try{
                self::$connection = new \mysqli(
                        $_ENV["DB_HOST"],
                        $_ENV["DB_USERNAME"],
                        $_ENV["DB_PASSWORD"],
                        $_ENV["DB_DATABASE"]
                    );
            }catch(\Exception $e){
                die("Błąd połączenia z bazą danych: " . $e->getMessage());
            }
            
        }
        return self::$connection;
    }
```


Dla testu działania wprowadziłem błędną nazwę użytkownika w pliku `.env` i w `HomeController` wywołałem metodę statyczną `getConnection()` klasy `Database`. Jak widać wyjątek przechwycony i fatalny błąd rzucony:

![](/public/courses/php/Images/test-błędu-połączenia-z-bazą-danych-statycznej-instancji-klasy.png)

## Logowanie i rejestracja

Mamy już wszystkie elementy bazowe do dalszego rozwoju projektu:
- Zarządzanie trasami URI z wywołaniem odpowiedniego kontrolera
- Silnik renderujący widoki
- Menadżer sesji
- Statyczna klasa udostępniająca połączenie z bazą danych

Teraz nadszedł czas na implementację kontrolerów logowania i rejestracji oraz wspólnego dla nich repozytorium zapytań bazodanowych. W katalogu `Controllers/` utwórz dwa pliki:
1. `LoginController.php`
2. `RegisterController.php`

W katalogu `Repositories/` utwórz plik `UserRepository.php`.

### Klasa UserRepository

W starym `Auth.php` wykorzystywaliśmy $2$ zapytania SQL, wiec teraz przepiszemy je jako statyczne metody w `UserRepository.php` i po preparacji wyślemy je do bazy danych korzystając z naszego serwisu `Database`:
```php
<?php
declare(strict_types=1);

namespace App\Core\Repositories;

use App\Core\Services\Database;

class UserRepository{
    public static function getUserAsLogin(string $login): ?array{
    }
    public static function addNewUser(string $login, string $pass, string $username): int{
    }
}
```

Jak wygląda preparowanie zapytań SQL na połączeniu `mysqli`?  
Zamiast doklejać konkatenacją zmienne do zapytania SQL wpisujemy tylko placeholder `?` a następnie wywołujemy metodę `bind_param()` na przygotowanym zapytaniu. W nim podajemy typy zmiennych które zamierzamy wysłać do bazy danych oraz same wartości.  
- Dla `string` jest to typ `s`.  Wartości tekstowe.
- Dla `int` jest to typ `i`. Liczby całkowite. Lub boolean jako tinyint.
- Dla `double` jest to typ `d`.  Liczby zmiennoprzecinkowe
- Dla `blob`/`binary` jest to typ `b`.  

Przekazujemy do metody `bind_param()` w zmiennej referencyjnej to, co ma być wstawione w miejsce placeholdera `?`:

```php
public static function getUserAsLogin(string $login): ?array
{
    $sql = 'SELECT * FROM users WHERE login = ?';
    $stmt = Database::getConnection()->prepare($sql);
    $stmt->bind_param("s", $login);
}
```

> Tak spreparowane zapytanie chroni nas przed wstrzykiwaniem SQL.

Następnie na `$stmt` wywoujemy `execute()` która wyśle zapytanie do bazy danych i bedzie przechowywać w sobie obiekt `mysqli_stmt` np.:

```
object(mysqli_stmt)#26 (10) { ["affected_rows"]=> int(-1) ["insert_id"]=> int(0) ["num_rows"]=> int(0) ["param_count"]=> int(1) ["field_count"]=> int(6) ["errno"]=> int(0) ["error"]=> string(0) "" ["error_list"]=> array(0) { } ["sqlstate"]=> string(5) "00000" ["id"]=> int(1) } 
```
Przy zapytaniach `INSERT`, `UPDATE` i `DELETE` często odwołamy się do wartości `affected_rows`, która przechowuje informację ile krotek dodano/zmieniono/usunięto wykonując zapytanie SQL.
```php
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
return $row ?: null;
```
> W przypadku metody `getUserAsLogin` bedziemy chcieli uzuskać dane z tabeli więc wyciągamy je za pomocą `get_result()` i przekształcamy na tablicę asocjacyjną.

Metoda `getUserAsLogin` ma zadeklarowane że może zwrócić tablicę (`: ?array`). Pamiętamy że w PHP pusta tablica to fałsz więc zapis `$row ?: null`...:
- zwróci `$row` - `?`, jeżeli w `$row` tablica bedzie zawierać jakieś wartości
- zwróci `null` - `: null`, jeżeli w `$row` tablica bedzie pusta

ALE... Od PHP 8.1 nie ma konieczności ręcznego bindowania parametrów z określeniem ich typów. Możesz odrazu przekazać zmienne jako elementy tablicy wprost do metody `execute()`:

```php
    public static function getUserAsLogin(string $login): ?array
    {
        $sql = 'SELECT * FROM users WHERE login = ?';
        
        $stmt = Database::getConnection()->prepare($sql);
        $stmt->execute([$login]);

        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row ?: null;
    }
```

Podobnie ma się sprawa z metodą `addNewUser` z tą różnicą że że zwracamy właściwość `affected_rows` obiektu `mysqli_stmt`:

```php
public static function addNewUser(string $login, string $pass, string $username): int
{
    $sql = 'INSERT INTO users 
        (login, password, username, role)
        VALUES(?, ?, ?, "user")';
    $stmt = Database::getConnection()->prepare($sql);
    
    $stmt->execute([$login, $pass, $username]);
    return $stmt->affected_rows;
}
```

W ten sposób mamy gotową i bezpieczną klasę repozytorium użytkownika. Przechodzimy teraz do stworzenia kontrolera rejestracji.

### Klasa RegisterController

Kontroler bedzie potrzebował użyć dwóch klas:
- `UserRepository` by komunikować się z serwerem bazy danych MariaDB.
- `SessionManager` ponieważ bedziemy chcieli porównywać token CSRF z tym co mamy w sesji.

Standardowo tworzymy zmienną do przechowania instancji `SessionManager` i za pomocą konstruktora wstrzykniemy do niej inicjalizację obiektu `SessionManager()`. Metodę `unsetXSS` możemy skopiować w całości z starego `Auth.php` z lekką modyfikacją że zamiast referencji i typu void to metoda bedzie zwracać wartość string.

```php
<?php
declare(strict_types=1);

namespace App\Core\Controllers;

use App\Core\Repositories\UserRepository;
use App\Core\Services\SessionManager;


class RegisterController {

    private SessionManager $session;

    public function __construct()
    {
        $this->session = new SessionManager();
    }

    private function unsetXSS(string $value): string {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
```

Teraz stworzymy metodę _**void**_ `register()`. W pierwszym kroku sprawdzamy czy token CSRF jest zgodny:
- Jeżeli **_nie_** to do klucza `register_msg` w superglobalnej `$_SESSION` przypisujemy komunikat dla klienta. Następnie zmieniamy nagłówek odpowiedzi z serwera na typ przekierowania z powrotem do strony głównej (`header("Location: /");`) i przerywamy działanie metody za pomocą `exit()` by dalszy kod się nie wykonał.
- Jeżeli **tak**, to wyciągamy dane z superglobalnej tablicy `$_POST` i przypisujemy je przez metodę `unsetXSS()` zapisując oczyszczone wartości do zmiennych lokalnych.

```php
public function register(): void{
    if($this->session->getTokenCSRF() !== $_POST["csrf_token"]){
        $_SESSION["register_msg"] = "Niezgodność autoryzacji tokenu CSRF.";
        header("Location: /");
        exit();
    }

    $username = $this->unsetXSS($_POST["username"]);
    $login = $this->unsetXSS($_POST["login"]);
    $pass = $this->unsetXSS($_POST["pass"]);
    $repass = $this->unsetXSS($_POST["repass"]);
}
```

Token CSRF się zgadza, dane oczyszczone To czas je zweryfikować czy spełniają nasze wymagania platformy.  

Takie podstawowe weryfikacje to oczywiście sprawdzenia:
- Czy hasła są takie same
- Czy wszystkie pola zostały uzupełnione oraz nie przekazano nam $x$ spacji (białych znaków).
- Czy zakresy długości wartości pól mieszczą się w naszych przedziałach.
- Czy podany login jest nie jest już zajęty.

```php
private function validateFormData(string $username, string $login, string $pass, string $repass): ?string{
    if($pass !== $repass){
        return "Podane hasła nie są takie same.";
    }

    $username = \trim($username);
    $login = \trim($login);
    $pass = \trim($pass);
    if($username === "" || $login === "" || $pass === ""){
        return "Proszę uzupełnić wszystkie dane";
    }

    if(\strlen($username) > 30 && \strlen($username) < 3){
        return "Długość nazwy użytkownika jest nie poprawna. Powinno mieć minimum 3 a maksimum 20 znaków";
    }
    if(\strlen($login) > 20 && \strlen($login) < 3){
        return "Długość loginu jest nie poprawna. Powinno mieć minimum 3 a maksimum 20 znaków";
    }
    
    if(\strlen($pass) < 12){
        return "Hasło jest za krótkie. Powinno mieć minimum 12 znaków";
    } else if(\strlen($pass) > 255){
        return "Hasło jest za długie. Powinno mieć maksimum 255 znaków";
    }


    $userData = UserRepository::getUserAsLogin($login);
    if($userData){
        return "Użytkownik o tym loginie już istnieje";
    }
    return null;
}
```

Wtedy pamiętamy że `null` w PHP to fałsz i uzupełniamy metodę register o kolejny fragment kodu:

```php
$validateFormData = $this->validateFormData($username, $login, $pass, $repass);
if (is_string($validateFormData)) {
    $_SESSION["register_msg"] = $validateFormData;
    header("Location: /");
    exit();
}
```

Pozostało nam już tylko skopiować i wydzielić z starego `Auth.php` fragment hashowania hasła do osobnej metody i dokończyć metodę register.

```php
private function passwordHashed(string $pass): string
{
    $options = [
        'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
        'threads' => PASSWORD_ARGON2_DEFAULT_THREADS,
        'time_cost' => PASSWORD_ARGON2_DEFAULT_TIME_COST
    ];
    return password_hash($pass, PASSWORD_ARGON2ID, $options);
}
```

```php
if (!UserRepository::addNewUser($login, $this->passwordHashed($pass), $username)) {
    $_SESSION["register_msg"] = "Coś poszło nie tak. :/";
    header("Location: /");
    exit();
}

$_SESSION["register_msg"] = "Rejestracja przebiegła pomyślnie. Możesz się zalogować.";
header("Location: /");
```

---

Od razu ruszajmy za ciosem i uzupełnijmy klasę `LoginController`:

```php
<?php

declare(strict_types=1);

namespace App\Core\Controllers;

use App\Core\Repositories\UserRepository;
use App\Core\Services\SessionManager;



class LoginController
{

    private SessionManager $session;
    public function __construct()
    {
        $this->session = new SessionManager();
    }

    private function unsetXSS(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }

    public function login(): void
    {
        if ($this->session->getTokenCSRF() !== $_POST["csrf_token"]) {
            $_SESSION["login_msg"] = "Niezgodność autoryzacji tokenu CSRF.";
            header("Location: /");
            exit();
        }

        $login = $this->unsetXSS($_POST["login"]);
        $pass = $this->unsetXSS($_POST["pass"]);

        $user = UserRepository::getUserAsLogin($login);
        if($this->validatePasswordHash($pass, $user["password"])){
            $_SESSION["user"] = $user;
            header("Location: /");
        }else{
            $_SESSION["login_msg"] = "Podano nieprawidłowe dane.";
            header("Location: /");
        }

    }
    private function validatePasswordHash(string $passInput, string $passHash): bool
    {
        return password_verify($passInput, $passHash);
    }
}
```

Można by powiedzieć że skończyliśmy pracę nad kontrolerami logowania i rejestracji, ale nic bardziej mylnego. Tym fragmentem łamiemy zasadę **DRY** (*Don't Repeat Yourself*):
```php
private SessionManager $session;
public function __construct()
{
    $this->session = new SessionManager();
}

private function unsetXSS(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
```

Wydzielmy ją do do klasy dziedzictwa `BaseController`.

```php
<?php
declare(strict_types=1);

namespace App\Core\Controllers;

use App\Core\Services\SessionManager;

class BaseController{
    
    protected SessionManager $session;

    public function __construct()
    {
        $this->session = new SessionManager();
    }

    protected function unsetXSS(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
```
> Zwróć uwagę że klauzule dostępności zmieniłem z private na protected, dzięki czemu można je odziedziczyć i dalej nie ma do nich dostępu nikt spoza potomków.

Następnie  w `LoginController` i `RegisterController` zastępujemy `use` Menadżera sesji na bazę dziedzictwa i wskazujemy że nasze klasy kontrolerów rozszerzają to co zapoczątkował `BaseController`.  

```php
use App\Core\Controllers\BaseController;

class LoginController extends BaseController
{//...
}
```
Adekwatnie bedzie z weryfikacją tokenów CSRF. Dlatego je też należy wyseparować do odzielnej metody protected i wywoływać jako odziedziczoną:
```php
protected function validateCSRFToken(string $key, string $location): void{
    $isValid = $this->session->getTokenCSRF() === $this->unsetXSS($_POST["csrf_token"]);
    if(!$isValid){
        $_SESSION[$key] = "Niezgodność autoryzacji tokenu CSRF.";
        header("Location: /" . $location);
        exit();
    }
}
```
> Wtedy w metodzie `login` i `register` będzie to teraz wyglądać tak:
> ```php
>    $this->validateCSRFToken("login_msg", "/");
> ```


Uzupełnij jeszcze `register_login_section.php`:
```php
<?php
    if (isset($_SESSION["csrf_token"]))
    echo '<input type="hidden" name="csrf_token" value="' . $_SESSION["csrf_token"]. '">';
?>
```
```php
if(isset($_SESSION["register_msg"]))
    echo '<p>' . $_SESSION["register_msg"] . '</p>';
?>
```
```php
if(isset($_SESSION["login_msg"]))
    echo '<p>' . $_SESSION["login_msg"] . '</p>';
?>
```

## Końcowe spojrzenie

Dodaj nowy katalog `Archive` i umieść w nim `CRUD` i pliki `Auth.php` oraz `OLD_router.php`. Nie ma sensu ich usuwać, zostawiasz sobie odniesienie.

Zobacz jak z dwóch plików wyklarowała się już ciekawa architektura. Chodź może się wydawać to przerostem formy nad treścią i faktycznie dla zwykłego rejestrowania i logowani tak jest. Jednak ta forma owocuje łatwiejszym rozrostem platformy i pozwala uniknąć przeciążenia poznawczego w chaosie setek plików skryptowych.

![](/public/courses/php/Images/platforma-po-pierwszej-refaktoryzacji.png)