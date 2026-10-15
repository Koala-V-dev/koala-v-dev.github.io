# Obsługa bazy mysqli i dynamiczne generowanie widoków

Większość arkuszy egzaminacyjnych INF.03 z zakresu backendu weryfikuje umiejętność proceduralnej komunikacji ze środowiskiem MySQL/MariaDB za pomocą rozszerzenia `mysqli`. Standardowy skrypt pobiera dane i generuje z nich strukturę HTML bezpośrednio w pętli.

<a href="/public/resources/sql-files/wedkarstwo.sql" download="wedkarstwo.sql" class="download-btn">Pobierz plik bazy danych wedkarstwo.sql</a>

---

## 🔌 Ustanawianie połączenia <code>mysqli_connect</code>

Proceduralna funkcja `mysqli_connect` przyjmuje cztery podstawowe argumenty: adres serwera, nazwę użytkownika, hasło oraz nazwę bazy danych. W środowisku lokalnym (XAMPP/WAMP) domyślnym użytkownikiem jest `root` z pustym hasłem.

```php
<?php
// Parametry połączenia z serwerem bazodanowym
$host = "localhost";
$user = "root";
$pass = "";
$db   = "wedkarstwo";

// Nawiązanie połączenia
$conn = mysqli_connect($host, $user, $pass, $db);

// Weryfikacja stanu połączenia
if (!$conn) {
    die("Błąd połączenia z bazą: " . mysqli_connect_error());
}
```

Zawsze należy sprawdzić, czy zmienna połączenia `$conn` nie ma wartości `false`. W przypadku awarii serwera funkcja `mysqli_connect_error()` zwraca techniczny opis przyczyny odmowy dostępu.

---

## ⚡ Wykonywanie zapytań <code>mysqli_query</code> i pobieranie wierszy

Wysłanie kwerendy do otwartego połączenia odbywa się za pomocą `mysqli_query`. Wynikiem dla zapytań `SELECT` jest obiekt typu `mysqli_result`, z którego krotki pobierane są w pętli.

```php
$sql = "SELECT id, nazwa, wystepowanie FROM Ryby WHERE styl_zycia = 1";
$result = mysqli_query($conn, $sql);

if ($result) {
    echo "<ul>";
    // mysqli_fetch_row zwraca tablicę indeksowaną numerycznie (0, 1, 2...)
    while ($row = mysqli_fetch_row($result)) {
        echo "<li><strong>" . htmlspecialchars($row[1]) . "</strong> (występowanie: " . htmlspecialchars($row[2]) . ")</li>";
    }
    echo "</ul>";
    
    // Zwolnienie zasobów pamięci podręcznej wyniku
    mysqli_free_result($result);
}

// Zawsze zamykaj aktywne połączenie po wykonaniu operacji
mysqli_close($conn);
```

### 📊 Różnica między fetch_row a fetch_assoc

| Funkcja | Typ zwracanej tablicy | Dostęp do pól | Zaleta / Zastosowanie |
| :--- | :--- | :--- | :--- |
| **`mysqli_fetch_row`** | Numeryczna | `$row[0]`, `$row[1]` | Oszczędność pamięci, standard w arkuszach CKE |
| **`mysqli_fetch_assoc`** | Asocjacyjna | `$row['nazwa']`, `$row['cena']` | Czytelność kodu przy wielu kolumnach |
| **`mysqli_fetch_array`** | Hybrydowa | `$row[0]` oraz `$row['nazwa']` | Podwójna reprezentacja (często domyślna) |

---

## 🎯 Sprawdzenie wiedzy: Mechanizm mysqli

<data-quiz>
  <div class="quiz-question" data-title="Kolejność funkcji">Jaka jest poprawna kolejność wywołań funkcji proceduralnego mysqli przy generowaniu raportu?</div>
  <div class="quiz-answer" data-correct="true">mysqli_connect -> mysqli_query -> mysqli_fetch_row -> mysqli_close</div>
  <div class="quiz-answer">mysqli_query -> mysqli_connect -> mysqli_fetch_assoc -> mysqli_close</div>
  <div class="quiz-answer">mysqli_connect -> mysqli_fetch_row -> mysqli_query -> mysqli_free_result</div>
  <div class="quiz-answer">mysqli_query -> mysqli_connect -> mysqli_close -> mysqli_fetch_array</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`mysqli_connect`" data-right="Ustanawia fizyczny socket połączenia z instancją serwera MySQL"></div>
  <div class="cmw-item" data-left="`mysqli_query`" data-right="Wysyła polecenie SQL i zwraca obiekt wynikowy lub status boolean"></div>
  <div class="cmw-item" data-left="`mysqli_fetch_row`" data-right="Pobiera bieżącą krotkę jako tablicę indeksowaną numerycznie od 0"></div>
  <div class="cmw-item" data-left="`mysqli_close`" data-right="Zwalnia deskryptor połączenia i zamyka sesję z serwerem baz danych"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Generowanie listy kwerendy w pętli

Sformułuj skrypt pobierający rekordy z zasobu bazodanowego. Użyj połączenia `$conn`, wykonaj zapytanie wybierające `id`, `nazwa` oraz `cena` z tabeli `towary`, a następnie w pętli `while` wygeneruj elementy `<li>` z formatowaniem `nazwa: cena zł`.

<data-gate>
<data-code-runner language="php" title="Generowanie listy HTML z bazy danych">
  <template data-type="code">
// Połączenie bazodanowe $conn jest już aktywne
// 1. Zdefiniuj kwerendę pobierającą id, nazwa, cena z tabeli 'towary'
$query = "SELECT id, nazwa, cena FROM towary";

// 2. TODO: Wyślij zapytanie do bazy danych za pomocą mysqli_query


echo "<ul>";
// 3. TODO: Zbuduj pętlę while pobierającą rekordy za pomocą mysqli_fetch_row($result)
//    Wypisz każdy towar jako element listy: echo "<li>" . $row[1] . ": " . $row[2] . " zł</li>";


echo "</ul>";

// 4. TODO: Zamknij aktywne połączenie z bazą za pomocą mysqli_close

  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-query",
        "text": "Użyto funkcji mysqli_query do wysłania kwerendy",
        "type": "regex",
        "pattern": "mysqli_query\\s*\\("
      },
      {
        "id": "req-fetch",
        "text": "Pobieranie wierszy w pętli za pomocą mysqli_fetch_row lub fetch_assoc",
        "type": "regex",
        "pattern": "mysqli_fetch_(row|assoc|array)\\s*\\("
      },
      {
        "id": "req-close",
        "text": "Prawidłowe zamknięcie połączenia za pomocą mysqli_close",
        "type": "regex",
        "pattern": "mysqli_close\\s*\\("
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie egzaminacyjne - Karta łowiska wędkarskiego

Zbuduj skrypt PHP generujący zestawienie ryb drapieżnych w oparciu o bazę `wedkarstwo.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Utworzenie połączenia**: Połącz się z serwerem `localhost`, użytkownik `root`, bez hasła, baza `wedkarstwo`.
2. **Formułowanie kwerendy**: Napisz zapytanie wybierające `nazwa`, `akwen` oraz `wojewodztwo` dla ryb drapieżnych (gdzie `styl_zycia = 1`).
3. **Konstrukcja tabeli HTML**:
   - Wypisz nagłówek tabeli: `Lp.`, `Gatunek ryby`, `Akwen`, `Województwo`.
   - W pętli `while` wypisz każdy wiersz w znacznikach `<tr><td>`.
   - Zaimplementuj licznik wierszy `$lp`, inkrementowany w każdej iteracji.
4. **Zwolnienie zasobów**: Zamknij połączenie z bazą funkcją `mysqli_close`.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<?php
// 1. Połączenie z bazą
$conn = mysqli_connect("localhost", "root", "", "wedkarstwo");

if (!$conn) {
    die("Błąd połączenia: " . mysqli_connect_error());
}

// 2. Zapytanie SQL (ryby drapieżne)
$sql = "SELECT Ryby.nazwa, Lowisko.akwen, Lowisko.wojewodztwo 
        FROM Ryby 
        INNER JOIN Lowisko ON Ryby.id = Lowisko.Ryby_id 
        WHERE Ryby.styl_zycia = 1";

$result = mysqli_query($conn, $sql);

// 3. Generowanie tabeli HTML
echo "<table border='1'>";
echo "<thead><tr><th>Lp.</th><th>Gatunek ryby</th><th>Akwen</th><th>Województwo</th></tr></thead>";
echo "<tbody>";

$lp = 1;
while ($row = mysqli_fetch_row($result)) {
    echo "<tr>";
    echo "<td>" . $lp . "</td>";
    echo "<td>" . htmlspecialchars($row[0]) . "</td>";
    echo "<td>" . htmlspecialchars($row[1]) . "</td>";
    echo "<td>" . htmlspecialchars($row[2]) . "</td>";
    echo "</tr>";
    $lp++;
}

echo "</tbody>";
echo "</table>";

// 4. Zamknięcie zasobów
mysqli_free_result($result);
mysqli_close($conn);
?>
```
</details>
