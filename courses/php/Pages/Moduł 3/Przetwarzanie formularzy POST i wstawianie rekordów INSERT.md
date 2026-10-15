# Przetwarzanie formularzy POST i wstawianie rekordów INSERT

W zadaniach egzaminacyjnych INF.03 skrypt backendowy odbiera parametry przesłane metodą POST z formularza HTML, dokonuje ich walidacji, oblicza koszty lub formatuje dane, a następnie zapisuje nowy rekord w bazie kwerendą `INSERT INTO`.

<a href="/public/resources/sql-files/restauracja.sql" download="restauracja.sql" class="download-btn">Pobierz plik bazy danych restauracja.sql</a>

---

## 📨 Weryfikacja przesłania formularza <code>$_POST</code>

Skrypt nie może wykonywać zapytań bazodanowych przy zwykłym otwarciu strony (metodą GET). Należy sprawdzić, czy dane dotarły z formularza.

```php
<?php
// Weryfikacja metody żądania HTTP lub obecności przycisku submit
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["btn_rezerwuj"])) {
    
    // Odczyt danych z superglobalnej $_POST
    $data      = trim($_POST["data_rez"] ?? "");
    $ile_osob  = (int)($_POST["liczba_osob"] ?? 0);
    $telefon   = trim($_POST["telefon"] ?? "");
    $zgoda     = isset($_POST["zgoda"]) ? 1 : 0;

    // Walidacja poprawności danych
    if (!empty($data) && $ile_osob > 0 && !empty($telefon)) {
        // Dane poprawne - przejście do zapisu w bazie
    } else {
        echo "<p class='error'>Wypełnij wszystkie wymagane pola formularza!</p>";
    }
}
```

---

## 🛡️ Zabezpieczanie danych wejściowych i kwerenda <code>INSERT</code>

Wszystkie ciągi znaków wprowadzane przez użytkownika muszą zostać zabezpieczone funkcją `mysqli_real_escape_string` (zapobieganie SQL Injection) oraz przefiltrowane przed atakami XSS.

```php
$conn = mysqli_connect("localhost", "root", "", "restauracja");

if ($conn) {
    // Escapowanie znaków specjalnych dla bazy
    $data_bezpieczna    = mysqli_real_escape_string($conn, $data);
    $telefon_bezpieczny = mysqli_real_escape_string($conn, $telefon);

    // Formułowanie kwerendy INSERT
    $sql = "INSERT INTO rezerwacje (data_rez, liczba_osob, telefon) 
            VALUES ('$data_bezpieczna', $ile_osob, '$telefon_bezpieczny')";

    if (mysqli_query($conn, $sql)) {
        echo "<p class='success'>Dodano rezerwację do bazy danych!</p>";
    } else {
        echo "<p class='error'>Błąd zapisu: " . mysqli_error($conn) . "</p>";
    }

    mysqli_close($conn);
}
```

---

## 🎯 Sprawdzenie wiedzy: Przetwarzanie formularzy

<data-quiz>
  <div class="quiz-question" data-title="Weryfikacja checkboxa">W jaki sposób w PHP poprawnie sprawdzić, czy pole typu checkbox zostało zaznaczone w formularzu POST?</div>
  <div class="quiz-answer" data-correct="true">Za pomocą isset($_POST['nazwa_pola'])</div>
  <div class="quiz-answer">Sprawdzając czy $_POST['nazwa_pola'] === true</div>
  <div class="quiz-answer">Za pomocą funkcji is_null($_POST['nazwa_pola'])</div>
  <div class="quiz-answer">Wartość checkboxa jest zawsze obecna i wynosi "checked"</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`$_POST`" data-right="Asocjacyjna tablica przechowująca parametry przekazane w ciele żądania"></div>
  <div class="cmw-item" data-left="`mysqli_real_escape_string`" data-right="Dodaje znaki ucieczki przed znakami specjalnymi SQL (apostrofy, cudzysłowy)"></div>
  <div class="cmw-item" data-left="`mysqli_affected_rows`" data-right="Zwraca liczbę wierszy zmodyfikowanych przez ostatnie zapytanie INSERT/UPDATE"></div>
  <div class="cmw-item" data-left="`trim`" data-right="Usuwa białe znaki ze skrajnych pozycji łańcucha tekstowego"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Walidacja i budowa zapytania INSERT

Napisz fragment kodu PHP, który sprawdza, czy zmienna `$_POST['imie']` nie jest pusta, zabezpiecza ją funkcją `mysqli_real_escape_string` i wykonuje zapytanie `INSERT INTO klienci (imie) VALUES ('...')`.

<data-gate>
<data-code-runner language="php" title="Zapis formularza do bazy MySQL">
  <template data-type="code">
// 1. TODO: Sprawdź czy pole 'imie' w $_POST nie jest puste za pomocą !empty(...)
if () {
    // 2. Zabezpiecz dane wejściowe funkcją mysqli_real_escape_string
    $imie = mysqli_real_escape_string($conn, trim($_POST['imie']));

    // 3. TODO: Utwórz zapytanie INSERT INTO klienci (imie) VALUES ('$imie')
    $query = "";

    // 4. TODO: Wyślij zapytanie do bazy za pomocą mysqli_query i wyświetl potwierdzenie:
    // echo "<p class='sukces'>Dodano pomyślnie klienta: " . $imie . "</p>";

}

// 5. TODO: Zamknij aktywne połączenie z bazą za pomocą mysqli_close

  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-empty",
        "text": "Wykorzystano funkcję !empty do sprawdzenia danych wejściowych",
        "type": "regex",
        "pattern": "!empty\\s*\\("
      },
      {
        "id": "req-insert",
        "text": "Zbudowano kwerendę INSERT INTO dla tabeli klienci",
        "type": "regex",
        "pattern": "INSERT\\s+INTO\\s+klienci"
      },
      {
        "id": "req-close",
        "text": "Zamknięto połączenie z bazą funkcją mysqli_close",
        "type": "regex",
        "pattern": "mysqli_close\\s*\\("
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie egzaminacyjne - System rezerwacji stolików

Zrealizuj skrypt obsługujący dodawanie rezerwacji stolika w restauracji z bazy `restauracja.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Struktura formularza**:
   - Pole daty `date` o nazwie `data_rez`.
   - Pole liczbowe `number` o nazwie `ile_osob`.
   - Pole tekstowe `text` o nazwie `telefon`.
   - Przycisk wysyłający `submit` o nazwie `rezerwuj` i wartości `Rezerwuj`.
2. **Skrypt PHP**:
   - Sprawdź, czy formularz został przesłany metodą POST.
   - Połącz się z bazą `restauracja` na `localhost`.
   - Pobierz dane: datę, liczbę osób oraz numer telefonu.
   - Zabezpiecz ciągi znaków funkcją `mysqli_real_escape_string`.
   - Wstaw rekord do tabeli `rezerwacje`: kolumny `data_rez`, `liczba_osob`, `telefon`.
   - Po udanym zapisie wyświetl komunikat: `Dodano rezerwację do bazy`.
   - Zamknij połączenie z bazą.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Restauracja Wszystkie Smaki</title>
</head>
<body>
    <h2>Formularz rezerwacji stolika</h2>
    <form action="" method="POST">
        <label>Data rezerwacji: <input type="date" name="data_rez" required></label><br>
        <label>Liczba osób: <input type="number" name="ile_osob" min="1" max="10" required></label><br>
        <label>Numer telefonu: <input type="text" name="telefon" required></label><br>
        <input type="submit" name="rezerwuj" value="Rezerwuj">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["rezerwuj"])) {
        $conn = mysqli_connect("localhost", "root", "", "restauracja");

        if (!$conn) {
            die("Błąd połączenia: " . mysqli_connect_error());
        }

        $data_rez = mysqli_real_escape_string($conn, $_POST["data_rez"]);
        $ile_osob = (int)$_POST["ile_osob"];
        $telefon  = mysqli_real_escape_string($conn, $_POST["telefon"]);

        if (!empty($data_rez) && $ile_osob > 0 && !empty($telefon)) {
            $sql = "INSERT INTO rezerwacje (data_rez, liczba_osob, telefon) 
                    VALUES ('$data_rez', $ile_osob, '$telefon')";

            if (mysqli_query($conn, $sql)) {
                echo "<p style='color: green;'>Dodano rezerwację do bazy</p>";
            } else {
                echo "<p style='color: red;'>Błąd zapisu: " . mysqli_error($conn) . "</p>";
            }
        }

        mysqli_close($conn);
    }
    ?>
</body>
</html>
```
</details>
