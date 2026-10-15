# Ciasteczka Cookies i zapamiętywanie stanu użytkownika

W aplikacjach internetowych protokół HTTP jest bezstanowy. W zadaniach egzaminacyjnych INF.03 mechanizm ciasteczek (cookies) służy do zapamiętywania faktu odwiedzin użytkownika, blokowania wielokrotnego głosowania w ankietach lub przechowywania preferencji wyglądu strony.

<a href="/public/resources/sql-files/szachy.sql" download="szachy.sql" class="download-btn">Pobierz plik bazy danych szachy.sql</a>

---

## 🍪 Wysyłanie ciasteczka <code>setcookie</code>

Funkcja `setcookie` wysyła nagłówek HTTP `Set-Cookie` do przeglądarki klienta. Musi zostać wywołana przed wygenerowaniem jakichkolwiek znaków wyjścia (przed tagiem `<html>`, spacjami czy instrukcją `echo`).

```php
<?php
// Składnia: setcookie(nazwa, wartosc, czas_wygasniecia, sciezka);
$nazwa    = "odwiedziny";
$wartosc  = "tak";
$waznosc  = time() + (3600 * 24); // Ważność: 24 godziny (czas unixowy w sekundach)
$sciezka  = "/";

setcookie($nazwa, $wartosc, $waznosc, $sciezka);
?>
```

### ⏱️ Czas życia i usuwanie ciasteczek

Czas wygaśnięcia określa się w sekundach od początku ery uniksowej (1 stycznia 1970 r.), sumując aktualny czas z funkcji `time()` oraz pożądaną liczbę sekund. Aby usunąć ciasteczko, należy wysłać je ponownie z datą przeszłą:

```php
// Usunięcie ciasteczka poprzez ustawienie czasu w przeszłości
setcookie("odwiedziny", "", time() - 3600, "/");
```

---

## 📥 Odczyt danych z tablicy <code>$_COOKIE</code>

Ciasteczka przesłane przez przeglądarkę w nagłówku żądania HTTP trafiają do superglobalnej tablicy asocjacyjnej `$_COOKIE`. Dostęp do nich jest możliwy dopiero przy kolejnym żądaniu (po przeładowaniu strony).

```php
<?php
if (!isset($_COOKIE["odwiedziny"])) {
    // Pierwsza wizyta: ustawiamy ciasteczko i wyświetlamy komunikat początkowy
    setcookie("odwiedziny", "1", time() + 3600, "/");
    echo "<p class='powitanie'>Dziękujemy za pierwsze odwiedzenie naszej witryny szachowej!</p>";
} else {
    // Kolejna wizyta: ciasteczko już istnieje
    echo "<p class='powitanie'>Witaj ponownie w klubie szachowym Gambit Piona!</p>";
}
?>
```

---

## 🎯 Sprawdzenie wiedzy: Obsługa Cookies w PHP

<data-quiz>
  <div class="quiz-question" data-title="Kiedy wywołać setcookie">Który warunek musi zostać spełniony, aby funkcja setcookie() wykonała się poprawnie bez generowania błędu ostrzeżenia?</div>
  <div class="quiz-answer" data-correct="true">Musi zostać wywołana przed wysłaniem jakiegokolwiek kodu HTML, spacji lub instrukcji echo</div>
  <div class="quiz-answer">Musi zostać wywołana w sekcji &lt;footer&gt; po załadowaniu całej zawartości DOM</div>
  <div class="quiz-answer">Wymaga wcześniejszego wywołania session_start() na początku pliku</div>
  <div class="quiz-answer">Może być wywołana w dowolnym miejscu, ponieważ dane zapisywane są asynchronicznie przez JS</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`setcookie`" data-right="Wysyła nagłówek HTTP Set-Cookie do przeglądarki klienta"></div>
  <div class="cmw-item" data-left="`$_COOKIE`" data-right="Asocjacyjna tablica odczytująca ciasteczka przesłane w żądaniu HTTP"></div>
  <div class="cmw-item" data-left="`time() + 3600`" data-right="Wyznacza moment wygaśnięcia ciasteczka za dokładnie jedną godzinę"></div>
  <div class="cmw-item" data-left="`time() - 3600`" data-right="Wymusza natychmiastowe usunięcie ciasteczka z pamięci przeglądarki"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Licznik wizyt w ciasteczku

Napisz skrypt, który sprawdza, czy istnieje ciasteczko `licznik_wizyt`. Jeśli istnieje, odczytuje jego wartość, zwiększa o 1 i zapisuje nowe ciasteczko z czasem ważności 30 dni (`time() + 2592000`). Jeśli nie istnieje, inicjalizuje wartość liczbą 1 i zapisuje ciasteczko. Wyświetl komunikat o numerze wizyty.

<data-gate>
<data-code-runner language="php" title="Zliczanie wizyt z użyciem $_COOKIE">
  <template data-type="code">
// 1. TODO: Sprawdź za pomocą isset(), czy ciasteczko 'licznik_wizyt' istnieje w tablicy $_COOKIE
//    Jeśli tak: zrzutuj na int i zwiększ wartość o 1. Jeśli nie: ustaw wartość początkową 1.
$liczba = 0;


// 2. TODO: Zapisz ciasteczko 'licznik_wizyt' funkcją setcookie() na 30 dni:
//    użyj time() + 2592000 ze ścieżką '/'


// 3. TODO: Wyświetl komunikat z numerem wizyty za pomocą echo
//    np. echo "<div class='cookie-alert'>To Twoja wizyta numer: " . $liczba . "</div>";

  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-isset",
        "text": "Weryfikacja istnienia ciasteczka za pomocą isset($_COOKIE[...])",
        "type": "regex",
        "pattern": "isset\\s*\\(\\s*\\$_COOKIE"
      },
      {
        "id": "req-setcookie",
        "text": "Wywołanie funkcji setcookie z określeniem nazwy i czasu wygaśnięcia",
        "type": "regex",
        "pattern": "setcookie\\s*\\("
      },
      {
        "id": "req-time",
        "text": "Użycie funkcji time() do wyliczenia daty ważności",
        "type": "regex",
        "pattern": "time\\s*\\("
      },
      {
        "id": "req-echo",
        "text": "Wyświetlenie komunikatu z liczbą wizyt za pomocą echo",
        "type": "regex",
        "pattern": "echo\\s+"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🏆 Krok po kroku: Arkusz CKE Koło szachowe gambit piona

W arkuszu egzaminacyjnym skrypt łączy obsługę bazy `szachy` z weryfikacją ciasteczka i prezentacją rankingu graczy:

1. W sekcji nagłówka PHP sprawdź obecność ciasteczka `odwiedziny`.
2. Jeśli ciasteczko nie istnieje, utwórz ciasteczko `odwiedziny` z wartością `tak` na czas 1 godziny (`time() + 3600`) i ustaw treść komunikatu na *"Dziękujemy za pierwsze odwiedzenie naszej strony"*.
3. Jeśli ciasteczko istnieje, ustaw treść komunikatu na *"Witaj ponownie na naszej stronie!"*.
4. Połącz się z bazą danych `szachy` na koncie `root` bez hasła.
5. Wykonaj zapytanie pobierające zawodników o randze powyżej 2000: `SELECT pseudonim, tytul, ranking FROM zawodnicy WHERE ranking > 2000 ORDER BY ranking DESC`.
6. Wyświetl pobrane dane w tabeli HTML z kolumnami: *Pseudonim*, *Tytuł*, *Ranking Elo*.
7. Zamknij połączenie z serwerem bazy danych.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<?php
// Krok 1 i 2: Obsługa ciasteczka przed wygenerowaniem treści HTML
$komunikat = "";
if (!isset($_COOKIE["odwiedziny"])) {
    setcookie("odwiedziny", "tak", time() + 3600, "/");
    $komunikat = "Dziękujemy za pierwsze odwiedzenie naszej strony";
} else {
    $komunikat = "Witaj ponownie na naszej stronie!";
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Koło szachowe Gambit Piona</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h2>Klub szachowy</h2>
        <p class="info"><?php echo $komunikat; ?></p>
    </header>

    <main>
        <h3>Zawodnicy z rankingiem powyżej 2000:</h3>
        <table>
            <tr>
                <th>Pseudonim</th>
                <th>Tytuł</th>
                <th>Ranking</th>
            </tr>
            <?php
            $conn = mysqli_connect("localhost", "root", "", "szachy");
            if ($conn) {
                $sql = "SELECT pseudonim, tytul, ranking FROM zawodnicy WHERE ranking > 2000 ORDER BY ranking DESC";
                $res = mysqli_query($conn, $sql);
                while ($row = mysqli_fetch_row($res)) {
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($row[0]) . "</td>";
                    echo "<td>" . htmlspecialchars($row[1]) . "</td>";
                    echo "<td>" . (int)$row[2] . "</td>";
                    echo "</tr>";
                }
                mysqli_free_result($res);
                mysqli_close($conn);
            }
            ?>
        </table>
    </main>
</body>
</html>
```
</details>
