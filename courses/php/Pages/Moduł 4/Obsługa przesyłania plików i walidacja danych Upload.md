# Obsługa przesyłania plików i walidacja danych Upload

W aplikacjach webowych i zadaniach egzaminacyjnych INF.03 przesyłanie plików graficznych wymaga odpowiedniej konfiguracji formularza HTML, odbioru danych tymczasowych w PHP, weryfikacji formatu oraz bezpiecznego przeniesienia pliku do katalogu docelowego z zapisem metadanych w bazie SQL.

<a href="/public/resources/sql-files/galeria.sql" download="galeria.sql" class="download-btn">Pobierz plik bazy danych galeria.sql</a>

---

## 📦 Formularz HTML i nagłówek <code>enctype="multipart/form-data"</code>

Aby formularz mógł przesyłać binarne dane plików, znacznik `<form>` musi korzystać z metody `POST` oraz zawierać atrybut kodowania `enctype="multipart/form-data"`. Bez tego atrybutu przeglądarka wyśle jedynie nazwę pliku jako zwykły tekst, a tablica `$_FILES` pozostanie pusta.

```html
<form action="" method="POST" enctype="multipart/form-data">
    <label for="tytul">Tytuł fotografii:</label>
    <input type="text" name="tytul" id="tytul" required>

    <label for="obraz">Wybierz plik ze zdjęciem:</label>
    <input type="file" name="obraz" id="obraz" accept="image/*" required>

    <input type="submit" name="wyslij" value="Prześlij do galerii">
</form>
```

---

## 📂 Superglobalna tablica <code>$_FILES</code> i funkcja <code>move_uploaded_file</code>

Po przesłaniu pliku PHP umieszcza go w tymczasowej lokalizacji serwera (np. `/tmp/php...`). Informacje o nim dostępne są w tablicy asocjacyjnej `$_FILES['nazwa_pola']`:

* `$_FILES['obraz']['name']` – oryginalna nazwa pliku na komputerze użytkownika,
* `$_FILES['obraz']['type']` – typ MIME zadeklarowany przez przeglądarkę (np. `image/jpeg`),
* `$_FILES['obraz']['size']` – rozmiar pliku w bajtach,
* `$_FILES['obraz']['tmp_name']` – tymczasowa ścieżka systemowa do odebranego pliku,
* `$_FILES['obraz']['error']` – kod błędu (wartość `0` lub stała `UPLOAD_ERR_OK` oznacza brak problemów).

### 🛡️ Walidacja rozszerzenia i przenoszenie do katalogu

Plik z folderu tymczasowego należy przenieść dedykowaną funkcją `move_uploaded_file()`. Ta funkcja weryfikuje, czy plik rzeczywiście pochodzi z legalnego uploadu HTTP.

```php
<?php
if (isset($_POST["wyslij"]) && isset($_FILES["obraz"])) {
    $plik = $_FILES["obraz"];

    // Weryfikacja kodu błędu
    if ($plik["error"] === UPLOAD_ERR_OK) {
        $nazwa_oryginalna = basename($plik["name"]);
        $rozszerzenie     = strtolower(pathinfo($nazwa_oryginalna, PATHINFO_EXTENSION));
        $dozwolone        = ["jpg", "jpeg", "png", "webp"];

        // Sprawdzenie typu pliku i limitu rozmiaru (np. 5 MB)
        if (in_array($rozszerzenie, $dozwolone) && $plik["size"] <= 5 * 1024 * 1024) {
            $katalog_docelowy = "obrazy/";
            $sciezka_zapisu   = $katalog_docelowy . $nazwa_oryginalna;

            if (move_uploaded_file($plik["tmp_name"], $sciezka_zapisu)) {
                echo "<p class='success'>Plik zapisano pomyślnie jako: " . htmlspecialchars($nazwa_oryginalna) . "</p>";
            } else {
                echo "<p class='error'>Błąd podczas zapisywania pliku na dysku serwera.</p>";
            }
        } else {
            echo "<p class='error'>Niedozwolony format pliku lub zbyt duży rozmiar!</p>";
        }
    }
}
?>
```

---

## 🎯 Sprawdzenie wiedzy: Mechanizm uploadu plików

<data-quiz>
  <div class="quiz-question" data-title="Wymagany atrybut formularza">Jaki atrybut znacznika &lt;form&gt; jest niezbędny, aby pole &lt;input type="file"&gt; przekazało plik binarny do skryptu PHP?</div>
  <div class="quiz-answer" data-correct="true">enctype="multipart/form-data"</div>
  <div class="quiz-answer">enctype="application/x-www-form-urlencoded"</div>
  <div class="quiz-answer">method="GET"</div>
  <div class="quiz-answer">binary="true"</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`$_FILES['plik']['tmp_name']`" data-right="Ścieżka do pliku w tymczasowym katalogu serwera"></div>
  <div class="cmw-item" data-left="`move_uploaded_file`" data-right="Bezpiecznie przenosi plik z bufora tymczasowego do katalogu docelowego"></div>
  <div class="cmw-item" data-left="`UPLOAD_ERR_OK`" data-right="Kod sukcesu o wartości 0 oznaczający bezbłędne odebranie pliku"></div>
  <div class="cmw-item" data-left="`pathinfo(..., PATHINFO_EXTENSION)`" data-right="Wyodrębnia rozszerzenie z łańcucha nazwy pliku"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Bezpieczny upload pliku graficznego

Napisz fragment kodu PHP weryfikujący, czy plik `$_FILES['zdjecie']` nie zgłasza błędów (`UPLOAD_ERR_OK`), sprawdź czy jego rozszerzenie to `jpg` lub `png`, a następnie przenieś go za pomocą `move_uploaded_file` do ścieżki docelowej `$cel`.

<data-gate>
<data-code-runner language="php" title="Weryfikacja i przenoszenie pliku w PHP">
  <template data-type="code">
// 1. TODO: Sprawdź czy plik został przesłany w $_FILES['zdjecie'] oraz czy kod błędu 'error' === UPLOAD_ERR_OK
if () {
    $nazwa = basename($_FILES['zdjecie']['name']);
    $rozszerzenie = strtolower(pathinfo($nazwa, PATHINFO_EXTENSION));

    // 2. TODO: Jeśli rozszerzenie to 'jpg' lub 'png':
    //    - zdefiniuj ścieżkę: $cel = "uploads/" . $nazwa;
    //    - przenieś plik funkcją move_uploaded_file() ze ścieżki tmp_name do $cel
    //    - wyświetl potwierdzenie: echo "<p class='upload-success'>Plik wgrany: " . $nazwa . "</p>";

}
  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-files",
        "text": "Odwołanie do superglobalnej $_FILES['zdjecie']",
        "type": "regex",
        "pattern": "\\$_FILES\\s*\\[\\s*['\"]zdjecie['\"]\\s*\\]"
      },
      {
        "id": "req-error",
        "text": "Sprawdzenie braku błędów za pomocą UPLOAD_ERR_OK lub 0",
        "type": "regex",
        "pattern": "(UPLOAD_ERR_OK|===\\s*0|==\\s*0)"
      },
      {
        "id": "req-move",
        "text": "Użycie funkcji move_uploaded_file",
        "type": "regex",
        "pattern": "move_uploaded_file\\s*\\("
      },
      {
        "id": "req-tmp",
        "text": "Przekazanie ścieżki tymczasowej tmp_name do przeniesienia",
        "type": "contains",
        "pattern": "tmp_name"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🏆 Krok po kroku: Arkusz CKE Zdjęcia i Galeria

W zadaniu egzaminacyjnym skrypt odbiera plik ze zdjęciem, zapisuje go na dysku, wstawia rekord do bazy `galeria`, a następnie wyświetla galerię miniatur:

1. Utwórz formularz HTML z polami: tytuł (`text`), autor (`select` z bazy `autorzy`) oraz plik (`file`), z atrybutem `enctype="multipart/form-data"`.
2. Po odebraniu żądania POST sprawdź, czy plik został przesłany bez błędów (`UPLOAD_ERR_OK`).
3. Pobierz nazwę pliku, utwórz ścieżkę zapisu do katalogu `obrazy/` i przenieś plik funkcją `move_uploaded_file()`.
4. Ustanów połączenie z bazą `galeria` na koncie `root` bez hasła.
5. Wykonaj zapytanie `INSERT INTO zdjecia (autorzy_id, tytul, plik, polubienia) VALUES ($autor_id, '$tytul_bezpieczny', '$nazwa_pliku', 0)`.
6. Wyświetl zaktualizowaną galerię zdjęć: w pętli `while` pobierz kolumny `plik`, `tytul`, `polubienia` oraz imię i nazwisko autora (`JOIN autorzy ON zdjecia.autorzy_id = autorzy.id`), generując bloki `<figure><img src="obrazy/plik.jpg"><figcaption>tytuł - autor (polubienia)</figcaption></figure>`.
7. Zamknij połączenie z bazą za pomocą `mysqli_close()`.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<?php
$conn = mysqli_connect("localhost", "root", "", "galeria");

// Obsługa zapisu nowego zdjęcia po zatwierdzeniu formularza
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["dodaj"]) && isset($_FILES["fotografia"])) {
    $tytul    = trim($_POST["tytul"] ?? "");
    $autor_id = (int)($_POST["autor_id"] ?? 1);
    $plik     = $_FILES["fotografia"];

    if ($plik["error"] === UPLOAD_ERR_OK && !empty($tytul)) {
        $nazwa_oryginalna = basename($plik["name"]);
        $cel = "obrazy/" . $nazwa_oryginalna;

        if (move_uploaded_file($plik["tmp_name"], $cel)) {
            $tytul_db = mysqli_real_escape_string($conn, $tytul);
            $nazwa_db = mysqli_real_escape_string($conn, $nazwa_oryginalna);

            $sql_insert = "INSERT INTO zdjecia (autorzy_id, tytul, plik, polubienia) 
                           VALUES ($autor_id, '$tytul_db', '$nazwa_db', 0)";
            mysqli_query($conn, $sql_insert);
            echo "<p class='komunikat sukces'>Zdjęcie dodane do galerii!</p>";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Galeria Fotografii</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <section class="formularz">
        <h2>Dodaj nowe zdjęcie</h2>
        <form action="" method="POST" enctype="multipart/form-data">
            <label>Tytuł zdjęcia: <input type="text" name="tytul" required></label>
            <label>Autor:
                <select name="autor_id">
                    <?php
                    $q_autorzy = mysqli_query($conn, "SELECT id, imie, nazwisko FROM autorzy ORDER BY nazwisko ASC");
                    while ($a = mysqli_fetch_row($q_autorzy)) {
                        echo "<option value='{$a[0]}'>{$a[1]} {$a[2]}</option>";
                    }
                    ?>
                </select>
            </label>
            <label>Wybierz plik: <input type="file" name="fotografia" accept="image/jpeg,image/png" required></label>
            <input type="submit" name="dodaj" value="Zapisz w galerii">
        </form>
    </section>

    <section class="galeria">
        <h2>Wszystkie zdjęcia</h2>
        <div class="siatka-zdjec">
            <?php
            $q_galeria = "SELECT zdjecia.plik, zdjecia.tytul, zdjecia.polubienia, autorzy.imie, autorzy.nazwisko 
                          FROM zdjecia 
                          JOIN autorzy ON zdjecia.autorzy_id = autorzy.id 
                          ORDER BY zdjecia.id DESC";
            $res = mysqli_query($conn, $q_galeria);
            while ($row = mysqli_fetch_row($res)) {
                echo "<figure class='karta-foto'>";
                echo "<img src='obrazy/" . htmlspecialchars($row[0]) . "' alt='" . htmlspecialchars($row[1]) . "'>";
                echo "<figcaption>";
                echo "<h4>" . htmlspecialchars($row[1]) . "</h4>";
                echo "<p>Autor: " . htmlspecialchars($row[3] . " " . $row[4]) . "</p>";
                echo "<span class='lajki'>Polubienia: " . (int)$row[2] . "</span>";
                echo "</figcaption>";
                echo "</figure>";
            }
            mysqli_close($conn);
            ?>
        </div>
    </section>
</body>
</html>
```
</details>
