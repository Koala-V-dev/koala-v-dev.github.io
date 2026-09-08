# Akcje użytkowników i role

Platforma zrefaktoryzowana ale dalej jedynymi funkcjonalnościami dla klienta są rejestracja i logowanie. Czas w końcu ukończyć ten mini projekcik. 

Dodaj nową trasę w `routes.php`, a `all-posts.html` przekształć na `all-posts.php` i dodaj ukrytą kontrolkę do dokena CSRF.

Pierwszym krokiem bedzie tak jak w **CRUD** czyli insertujemy dane do tabeli *posts*:
```sql
 CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `author` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL
)
```

![](/public/courses/php/Images/przygotowanie-plików-pod-korntroler-wpisów.png)

---

Dodajemy kolejną trasę do routera:

<small>routes.php</small>

```php
$router->post(
    "/new-user-post",
    [UserPostController::class, "insertUserPost"]
);
```

Kontroler wpisów użytkownika rozszerzamy o `BaseController` by odziedziczyć metody zabezpieczania przed XSS oraz walidacji tokenu CSRF. Przesyłane dane z formularza to token oraz treść wpisu. Brakuje tylko autora i uzyskamy go z superglobalnej zmiennej sesji by nie ufać danym, które mogły by się podszyć pod użytkownika.

<small>UserPostController.php</small>

```php
class UserPostController extends BaseController
{

    public function insertUserPost(): void{
        $this->validateCSRFToken("new-post_msg","/all-posts");


        $content = $this->unsetXSS($_POST["new_post"]);
        if(!isset($_SESSION["user"])){
            $_SESSION["post_msg"] = "Sesja wygasła. Zaloguj się ponownie.";
            header("Location: /all-posts");
            exit();
        }
        $author = (int)$_SESSION["user"]["id"];

        UserPostRepository::addNewPost($author, $content);
    }
}
```

Na koniec przesyłamy gotowe dane do dedykowanego repozytorium by zostały zapisane w bazie danych:

<small>UserPostRepository.php</small>

```php
<?php
declare(strict_types=1);

namespace App\Core\Repositories;

use App\Core\Services\Database;

class UserPostRepository{

    public static function addNewPost(int $author, string $content): int {
        $sql = 'INSERT INTO posts
            (author, content)
            VALUES(?, ?)
            ';
        $stmt = Database::getConnection()->prepare($sql);

        $stmt->execute([$author, $content]);
        return $stmt->affected_rows;
    }
}
```

---

## Podstrona wszystkich wpisów

By przetestować poprawność odrzucenia wpisu bez aktywnej sesji, konieczne jest dopisanie na tym etapie trasy by w ogóle móc wyświetlić tą podstronę.

Metoda w kontrolerze bedzie identyczna jak w przypadku `HomeController.php`:

Trasa oczywiście powinna obsługiwać jedynie metodę GET:

<small>routes.php</small>

```php
$router->get(
    "/all-posts",
    [UserPostController::class, "render"]
);
```
Możesz przejść na tą podstronę bezpośrednio podając adres URL jednak warto już poprawić linki w widokach `login.php` i `all-posts.php`:
- Hiperłącze nazwy serwisu *Platforma* powinno przekierowywać na domenowy url strony głownej czyli **`/`**/
- Element nawigacji „Mało?” zamiast podania pliku `all-posts` z jego rozszerzeniem zastąp na ładniejszą formę trasy URL **`/all-posts`**. 

Jeżeli już raz wystąpił błąd braku sesji to po odświeżeniu nie powinien się ponownie wyświetlić. Możemy to zrealizować przez odłączenie elementu na danym indeksie tablicy assocjacyjnej w superglobalu `$_SESSION`:
```php
if(isset($_SESSION["post_msg"])){
    echo "<p>" . $_SESSION["post_msg"] ."</p>";
    unset($_SESSION["post_msg"]);
}
```

![](/public/courses/php/Images/dodanie-trasy-renderu-i-test-error-non-session.png)

---

## Wyświetlanie wpisów użytkowników

Na samym początku dopiszmy nową metodę do `UserPostRepository.php`, wywołajmy ją w kontrolerze i wynik przekarzmy do vidoku jako tablicę do wyświetlenia w `print_r()`:

<small>UserPostRepository.php</small>

```php
public static function getAllPosts() : ?array {
    $sql = 'SELECT * FROM posts';
    $stmt= Database::getConnection()->prepare($sql);
    $result = $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row ?: null;
}
```

<small>UserPostController.php</small>

```php
public function render(): void
{
  $posts = UserPostRepository::getAllPosts();

  $user = $this->session->getUser();
  View::render("all-posts.php", ["posts" => $posts, "user" => $user]);
}
```

![](/public/courses/php/Images/przekazanie-danych-o-wpisach-z-bd-na-widok-strony.png)

---

## Część wspólna dwóch zbiorów (INNER JOIN)

By uzyskać wszelkie niezbędne nam dane musimy się odwołać do dwóch tabel. W jednej przechowujemy treść wpisów a w drugiej dane o autorze. Dlatego początkowo struktura `posts` zawarła w sobie atrybut *`author`* z typem *intiger* to nasz nieoficjalny klucz obcy. Wykorzystujemy go do porównania z kluczem głównym innych tabel a uzyskana zależność jest relacją. Aby wyciągnąć dane z dwóch zbiorów zachowując powiązaną relację należy skorzystać z klauzuli `JOIN`.


<data-gate>
<data-venn-diagram sets="2" task="A \cap B"></data-venn-diagram>
</data-gate>

Standardowo zapisujemy `SELECT` wskazując konkretne atrybuty lub wszystko (`*`) co chcemy wyciągnąć z `FROM` tabeli. Następnie deklarujemy że chcemy część wspólną `INNER JOIN` drugiej tabeli, ale tylko te krotki, które pasują do klauzuli `ON` określającej warunek dla części wspólnej, gdzie klucz główny jednej tabeli jest równy wartością z kluczem obcym drugiej tabeli.

```sql
SELECT * FROM posts INNER JOIN users ON posts.author=users.id;
```

![](/public/courses/php/Images/inner-join-wpisy-usera.png)

Jednak zastosowanie gwiazdki nie jest optymalnym podejściem. To przekazanie nadmiaru danych, gdzie dla bezpieczeństwa zawsze należy podawać ich per minimum i w razie konieczności dosyłać kolejne. Dodatkowo nie potrzebnie zwiekszymy ich rozmiar co w przypadku gdy usługa bazy danych i interpreter php będą na różnych serwerach zwieksza opóźnienie.


```sql
SELECT posts.id, author AS user_id, username, avatar, role, content 
FROM posts INNER JOIN users ON posts.author=users.id;
```

> Zwróć uwagę na dwa pierwsze atrybuty.
> - `posts.id`: z racji że atrybut `id` występuje w obu tabelach to należy jawnie wskazać o który atrybut nam chodzi.
> - `author AS user_id`: nadajemy nową nazwę atrybutowi `author` w wyniku zapytania. Jest to tzw. **alias**.

![](/public/courses/php/Images/minimalizacaj-select-w-inner-join-user-posts.png)

Podmień teraz zapytanie SQL w metodzie `getAllPosts()` klasy `UserPostRepository`.

Przygotuj komponent postu `user-post.php`:

```html
<?php
declare(strict_types=1);
/** @var array|null $user
 * @var string $username
 * @var string $avatar
 * @var string $content
 */
?>


<div class="post">
    <div class="author">
        <img src="./images/<?php echo $avatar; ?>" 
        alt="Awatar użytkownika <?php echo $username; ?>">
        <small><?php echo $username; ?></small>
    </div>
    <p>
        <?php echo $content ?>
    </p>
</div>
```
Natomiast w `all-posts.php`  napisz pętlę która wskarze komponet i przekarze potrzebne dane do jego prepacaji by klasa rendera (`View`) przygotowała gotowy element html do wyświetlenia. Nie zapomnij o wskazaniu jej lokalizacji na początku pliku za pomocą dyrektywy: `use App\Core\View;`.

![](/public/courses/php/Images/warrning-dla-wykorzystania-foreach-w-jednej-krotce-zamiast-całości-wyniku-zapytania.png)

> Jak widzisz mamy ostrzeżenia dotyczące próby uzyskania danych z tablicy o niepoprawnym offsecie. Wynika to z tego że metoda `getAllPosts()` w `UserPostRepository` zwraca pojedynczy wynik krotki zamiast całości wyniku.

![](/public/courses/php/Images/fetch_all-MYSQLI_ASSOC.png)

> ```php
>  $row = $result->fetch_all(MYSQLI_ASSOC);
> ```

Po tej małej zmianie problem został rozwiązany:

![](/public/courses/php/Images/poprawne-wyświetlanie-postów.png)

---

## Skrypt oczyszczający i losowy avatar nowych użytkowników

Trochę już zasyfiliśmy bazę danych testowymi krotkami. Takiego czegoś na produkcję nie podamy. Mamy więc dwie opcje:
- Dropnoąć całość i ponownie stworzyć bazę danych i tabele:
  ```sql
  DROP TABLE platforma.users;
  DROP TABLE platforma.posts;
  ```
- Oczyścić tabele z wszystkich danych i zrestartować `AUTO_INCREMENT`:
  ```sql
  TRUNCATE TABLE platforma.posts;
  ```

Utwórz dedykowany plik skryptu o następującej zawartości

<small>clean_table.php</small>

```php
<?php

const host = "localhost";
const user = "root";
const password = "";
const db_name = "platforma";

$db = null;
try {
    $db = @new mysqli(host, user, password, db_name);
} catch (Exception $e) {
    echo "Błąd bazy danych: " . $e->getMessage();
}

$sql ='TRUNCATE TABLE platforma.posts;
        TRUNCATE TABLE platforma.users;
        ';
$db->multi_query($sql);
$db->close();
```

następnie podłącz go w `index.php` i odśwież stronę:

```php
require "clean_table.php";
```

Interpreter zgłosi ostrzeżenie że nie ma danych więc zakomentuj dopięcie skryptu aby już nie oczyszczał tabel.

![](/public/courses/php/Images/Oczyszczenie-bazy-danych.png)

---

W klasie `RegisterController` tóż przed insertem nowego użytkownika Zapisz fragment losujący jeden z czterech obrazków jako nową wartość atrybutu `avatar` i przekaż ją do bazy danych.

```php
$avatar = "AI_avatar_" . random_int(1,4) . ".png";
```

`user-post.php` jak i `login.php` wymagają poprawy ścieżki do źródła obrazka, więc zmień:

```
./images/
```

na

```
/resources/images/
```

![](/public/courses/php/Images/dodanie-losowych-avatraów-dla-userów.png)