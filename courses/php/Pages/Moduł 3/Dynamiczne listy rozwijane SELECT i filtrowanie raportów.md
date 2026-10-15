# Dynamiczne listy rozwijane SELECT i filtrowanie raportów

Klasycznym schematem dwuskryptowym w arkuszach INF.03 jest generowanie listy rozwijanej `<select>` z kwerendy bazodanowej (Skrypt 1), a po zatwierdzeniu formularza – pobranie wybranego identyfikatora i wygenerowanie przefiltrowanej tabeli szczegółowej (Skrypt 2).

<a href="/public/resources/sql-files/wyprawy.sql" download="wyprawy.sql" class="download-btn">Pobierz plik bazy danych wyprawy.sql</a>

---

## 📋 Generowanie opcji <code>&lt;option&gt;</code> w pętli

W znaczniku formularza `<select name="cel">` każdy element `<option>` otrzymuje atrybut `value` równy kluczowi głównemu rekordu (np. `id`), a jako widoczny tekst wyświetlana jest nazwa własna.

```php
<form action="" method="POST">
    <label for="kraj_select">Wybierz kierunek wyprawy:</label>
    <select name="kraj" id="kraj_select">
        <?php
        $conn = mysqli_connect("localhost", "root", "", "wyprawy");
        
        $sql = "SELECT id, cel FROM wycieczki GROUP BY cel ORDER BY cel ASC";
        $result = mysqli_query($conn, $sql);

        // Zachowanie wybranej opcji po przeładowaniu strony
        $wybrany_kraj = (int)($_POST['kraj'] ?? 0);

        while ($row = mysqli_fetch_row($result)) {
            $selected = ($row[0] === $wybrany_kraj) ? "selected" : "";
            echo "<option value='{$row[0]}' $selected>" . htmlspecialchars($row[1]) . "</option>";
        }

        mysqli_close($conn);
        ?>
    </select>
    <input type="submit" name="szukaj" value="Pokaż wycieczki">
</form>
```

---

## 🔍 Skrypt raportujący z filtrem <code>WHERE</code>

Po przesłaniu formularza pobieramy identyfikator z `$_POST['kraj']`, rzutujemy go na liczbę całkowitą i wstawiamy do klauzuli `WHERE`.

```php
<?php
if (isset($_POST["szukaj"]) && !empty($_POST["kraj"])) {
    $conn = mysqli_connect("localhost", "root", "", "wyprawy");
    $id_wycieczki = (int)$_POST["kraj"];

    // Kwerenda z filtrem wybranego celu
    $sql = "SELECT cel, cena, data_wyjazdu FROM wycieczki WHERE id = $id_wycieczki";
    $result = mysqli_query($conn, $sql);

    echo "<h3>Szczegóły wybranej wyprawy:</h3>";
    while ($row = mysqli_fetch_row($result)) {
        echo "<div class='wycieczka-karta'>";
        echo "<p>Kierunek: <strong>" . htmlspecialchars($row[0]) . "</strong></p>";
        echo "<p>Cena: " . number_format((float)$row[1], 2, ',', ' ') . " PLN</p>";
        echo "<p>Termin wyjazdu: " . htmlspecialchars($row[2]) . "</p>";
        echo "</div>";
    }

    mysqli_free_result($result);
    mysqli_close($conn);
}
?>
```

---

## 🎯 Sprawdzenie wiedzy: Formularze i listy wyboru

<data-quiz>
  <div class="quiz-question" data-title="Atrybut selected">Jaki atrybut HTML sprawia, że dana opcja w znaczniku &lt;select&gt; jest domyślnie podświetlona po przeładowaniu formularza?</div>
  <div class="quiz-answer" data-correct="true">selected</div>
  <div class="quiz-answer">checked</div>
  <div class="quiz-answer">active</div>
  <div class="quiz-answer">current</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`<select name='k'>`" data-right="Kontrolka rozwijanej listy definiująca nazwę klucza w tablicy $_POST"></div>
  <div class="cmw-item" data-left="`<option value='5'>`" data-right="Pojedyncza pozycja listy przekazująca wartość '5' po wybraniu"></div>
  <div class="cmw-item" data-left="`(int)$_POST['k']`" data-right="Rzutowanie jawne chroniące kwerendę przed wstrzyknięciem znaków nieliczbowych"></div>
  <div class="cmw-item" data-left="`number_format`" data-right="Funkcja formatująca liczbę zmiennoprzecinkową z separatorami dziesiętnymi"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Generowanie znaczników option

Uzupełnij kod pętli `while`, generując znaczniki `<option>` z atrybutem `value` równym kolumnie `$row[0]` oraz etykietą tekstową `$row[1]`.

<data-gate>
<data-code-runner language="php" title="Dynamiczne opcje listy rozwijanej">
  <template data-type="code">
$result = mysqli_query($conn, "SELECT id, nazwa FROM kategorie");

echo "<select name='kat'>";
// TODO: Zbuduj pętlę while i pobieraj wiersze za pomocą mysqli_fetch_row($result)
// Wygeneruj opcje wyboru: echo "<option value='" . $row[0] . "'>" . $row[1] . "</option>";


echo "</select>";

mysqli_close($conn);
  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-select",
        "text": "Wypisano znacznik otwierający i zamykający select",
        "type": "contains",
        "pattern": "<select"
      },
      {
        "id": "req-option",
        "text": "Wygenerowano znaczniki option z atrybutem value",
        "type": "regex",
        "pattern": "<option\\s+value="
      },
      {
        "id": "req-fetch",
        "text": "Pobierano wiersze za pomocą mysqli_fetch_row",
        "type": "regex",
        "pattern": "mysqli_fetch_row\\s*\\("
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie egzaminacyjne - Wyszukiwarka ofert biura podróży

Zbuduj stronę wyszukiwania wycieczek na bazie danych `wyprawy.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Skrypt 1 (Wypełnienie listy wyboru)**:
   - Połącz się z bazą `wyprawy`.
   - Wyślij zapytanie: `SELECT id, nazwa FROM kraje ORDER BY nazwa ASC`.
   - W pętli wygeneruj znaczniki `<option value='id'>nazwa</option>` wewnątrz listy rozwijanej o nazwie `kraj_id`.
   - Zamknij połączenie.
2. **Skrypt 2 (Wyświetlenie przefiltrowanych wycieczek)**:
   - Sprawdź, czy naciśnięto przycisk `Szukaj`.
   - Pobierz wybrane `kraj_id` i zrzutuj na liczbę `(int)`.
   - Wykonaj zapytanie wybierające `cel`, `cena`, `data_wyjazdu` z tabeli `wycieczki` dla wybranego kraju (`WHERE kraje_id = ...`).
   - Wypisz wyniki w tabeli HTML (nagłówki: `Cel wyprawy`, `Koszt`, `Termin`).
   - Po zakończeniu pętli zamknij połączenie z bazą.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Biuro Podróży - Wyszukiwarka</title>
</head>
<body>
    <h2>Wybierz kierunek wyprawy</h2>
    <form action="" method="POST">
        <label for="kraj_select">Kraj docelowy:</label>
        <select name="kraj_id" id="kraj_select">
            <?php
            $conn = mysqli_connect("localhost", "root", "", "wyprawy");
            if ($conn) {
                $sql = "SELECT id, nazwa FROM kraje ORDER BY nazwa ASC";
                $res = mysqli_query($conn, $sql);
                while ($row = mysqli_fetch_row($res)) {
                    $selected = (isset($_POST['kraj_id']) && (int)$_POST['kraj_id'] === (int)$row[0]) ? "selected" : "";
                    echo "<option value='{$row[0]}' $selected>" . htmlspecialchars($row[1]) . "</option>";
                }
                mysqli_free_result($res);
                mysqli_close($conn);
            }
            ?>
        </select>
        <input type="submit" name="szukaj" value="Szukaj">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["szukaj"])) {
        $conn = mysqli_connect("localhost", "root", "", "wyprawy");
        $kraj_id = (int)$_POST["kraj_id"];

        $sql = "SELECT cel, cena, data_wyjazdu FROM wycieczki WHERE kraje_id = $kraj_id";
        $res = mysqli_query($conn, $sql);

        if (mysqli_num_rows($res) > 0) {
            echo "<h3>Dostępne wycieczki:</h3>";
            echo "<table border='1'>";
            echo "<tr><th>Cel wyprawy</th><th>Koszt</th><th>Termin</th></tr>";
            while ($row = mysqli_fetch_row($res)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row[0]) . "</td>";
                echo "<td>" . number_format((float)$row[1], 2, ',', ' ') . " zł</td>";
                echo "<td>" . htmlspecialchars($row[2]) . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p>Brak dostępnych wycieczek dla wybranego kraju.</p>";
        }

        mysqli_free_result($res);
        mysqli_close($conn);
    }
    ?>
</body>
</html>
```
</details>
