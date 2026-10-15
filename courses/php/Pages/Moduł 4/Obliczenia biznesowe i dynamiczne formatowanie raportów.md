# Obliczenia biznesowe i dynamiczne formatowanie raportów

W zaawansowanych zadaniach INF.03 skrypt backendowy nie tylko pobiera krotki z bazy MySQL, lecz także wykonuje obliczenia arytmetyczne dla każdego wiersza (kary, opłaty, marże, sumy narastające), agreguje statystyki globalne i dynamicznie aplikuje klasy CSS wyróżniające rekordy przekraczające założone normy.

<a href="/public/resources/sql-files/wazenie-pojazdow.sql" download="wazenie-pojazdow.sql" class="download-btn">Pobierz plik bazy danych wazenie-pojazdow.sql</a>

---

## ⚖️ Przetwarzanie danych liczbowych i funkcja <code>number_format</code>

CKE w arkuszach wymaga prezentowania wartości zmiennoprzecinkowych w standardzie europejskim: z przecinkiem jako separatorem dziesiętnym oraz spacją jako separatorem tysięcy. Służy do tego funkcja `number_format()`.

```php
<?php
// Składnia: number_format(liczba, miejsca_po_przecinku, sep_dziesietny, sep_tysiecy)
$waga_tony = 12.456;
$oplata    = 3450.8;

echo number_format($waga_tony, 2, ',', ' ') . " t";   // Wynik: "12,46 t"
echo number_format($oplata, 2, ',', ' ') . " PLN";    // Wynik: "3 450,80 PLN"
?>
```

---

## 🎨 Warunkowe formatowanie wierszy tabeli HTML

Podczas iterowania po wynikach kwerendy `mysqli_fetch_row()` skrypt bada warunek progowy. Jeśli wartość przekracza dopuszczalną normę (np. tonaż powyżej 5 ton), wiersz otrzymuje specjalną klasę CSS (np. `class="przeciazenie"`), a skrypt wylicza karę za każdą tonę nadwyżki.

```php
<?php
$conn = mysqli_connect("localhost", "root", "", "wazenietirow");
$sql  = "SELECT rejestracja, waga, dzien, czas FROM wagi ORDER BY id ASC";
$res  = mysqli_query($conn, $sql);

echo "<table>";
echo "<tr><th>Rejestracja</th><th>Waga</th><th>Status</th><th>Kara</th></tr>";

while ($row = mysqli_fetch_row($res)) {
    $nr_rej = htmlspecialchars($row[0]);
    $waga   = (float)$row[1];
    
    // Warunek biznesowy: dopuszczalna masa całkowita wynosi 5.0 ton
    if ($waga > 5.0) {
        $nadwyzka = $waga - 5.0;
        $kara     = $nadwyzka * 200; // 200 PLN za każdą tonę ponad normę
        $klasa    = "przeciazenie";
        $status   = "Przekroczenie DMC";
    } else {
        $kara     = 0.0;
        $klasa    = "norma";
        $status   = "W normie";
    }

    echo "<tr class='$klasa'>";
    echo "<td>$nr_rej</td>";
    echo "<td>" . number_format($waga, 1, ',', ' ') . " t</td>";
    echo "<td>$status</td>";
    echo "<td>" . number_format($kara, 2, ',', ' ') . " zł</td>";
    echo "</tr>";
}
echo "</table>";
?>
```

### 📈 Agregacja w pętli: sumy, średnie i liczniki

Równolegle z generowaniem widoku HTML skrypt gromadzi statystyki podsumowujące raport. Zmienne akumulacyjne inicjalizuje się wartością `0` przed pętlą, a po jej zakończeniu umieszcza w sekcji `<tfoot>` tabeli.

```php
$suma_ton = 0.0;
$licznik_pojazdow = 0;

while ($row = mysqli_fetch_row($res)) {
    $suma_ton += (float)$row[1];
    $licznik_pojazdow++;
    // generowanie kolejnych <tr>...
}

$srednia_waga = ($licznik_pojazdow > 0) ? ($suma_ton / $licznik_pojazdow) : 0;
```

---

## 🎯 Sprawdzenie wiedzy: Obliczenia i raportowanie w PHP

<data-quiz>
  <div class="quiz-question" data-title="Europejski format number_format">Które wywołanie funkcji number_format poprawnie sformatuje liczbę 1520.5 do postaci "1 520,50 zł"?</div>
  <div class="quiz-answer" data-correct="true">number_format(1520.5, 2, ',', ' ') . " zł"</div>
  <div class="quiz-answer">number_format(1520.5, 2, '.', ',') . " zł"</div>
  <div class="quiz-answer">number_format(1520.5, 0, ',', ' ') . " zł"</div>
  <div class="quiz-answer">number_format(1520.5, 2) . " zł"</div>
</data-quiz>

<data-connection-matcher>
  <div class="cmw-item" data-left="`number_format`" data-right="Formatuje liczbę z precyzją miejsc po przecinku i separatorami"></div>
  <div class="cmw-item" data-left="`$suma += $wartosc`" data-right="Akumuluje bieżącą wartość wiersza do sumy całkowitej raportu"></div>
  <div class="cmw-item" data-left="`&lt;tfoot&gt;`" data-right="Semantyczna sekcja stopki tabeli podsumowująca kolumny danych"></div>
  <div class="cmw-item" data-left="`floatval / (float)`" data-right="Rzutowanie odczytanego z kwerendy ciągu znaków na typ zmiennoprzecinkowy"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Tabela z wyróżnieniem progowym

Napisz pętlę `while`, która odczytuje rekordy z `$result` (`$row[0]` to nazwa, `$row[1]` to cena). Oblicz sumę wszystkich cen w zmiennej `$suma`. Jeśli cena przekracza 100 zł, oznacz wiersz klasą `drogi`, w przeciwnym razie `tani`. Sformatuj cenę za pomocą `number_format` z dwoma miejscami po przecinku.

<data-gate>
<data-code-runner language="php" title="Warunkowe generowanie wierszy raportu">
  <template data-type="code">
$suma = 0;
echo "<table>";
// 1. TODO: Napisz pętlę while i pobieraj wiersze przez mysqli_fetch_row($result)
//    - $row[0] to nazwa towaru, $row[1] to cena (zrzutuj na float)
//    - akumuluj sumę w zmiennej: $suma += $cena;
//    - jeśli cena > 100, przypisz klasę $klasa = "drogi", w przeciwnym razie "tani"
//    - wyświetl wiersz tabeli: echo "<tr class='$klasa'><td>$nazwa</td><td>" . number_format($cena, 2, ',', ' ') . " zł</td></tr>";


echo "</table>";
// 2. TODO: Wyświetl sformatowane podsumowanie sumy za pomocą number_format:
// echo "<p class='suma'>Suma: " . number_format($suma, 2, ',', ' ') . " zł</p>";

  </template>
  <template data-type="requirements">
    [
      {
        "id": "req-while",
        "text": "Pętla while pobierająca wiersze za pomocą mysqli_fetch_row",
        "type": "regex",
        "pattern": "while\\s*\\(\\s*\\$row\\s*=\\s*mysqli_fetch_row"
      },
      {
        "id": "req-sum",
        "text": "Akumulacja sumy w pętli ($suma += ...)",
        "type": "regex",
        "pattern": "\\$suma\\s*\\+="
      },
      {
        "id": "req-format",
        "text": "Sformatowanie kwoty za pomocą number_format",
        "type": "regex",
        "pattern": "number_format\\s*\\("
      },
      {
        "id": "req-class",
        "text": "Zastosowanie warunkowej klasy w wierszu tr",
        "type": "regex",
        "pattern": "<tr class="
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🏆 Krok po kroku: Arkusz CKE Ważenie pojazdów

W arkuszu egzaminacyjnym skrypt łączy dane o pomiarach ze stacji wagowych z nazwami ulic i generuje zestawienie pojazdów:

1. Nawiąż połączenie z bazą `wazenietirow` na koncie `root` bez hasła.
2. Zdefiniuj kwerendę z klauzulą złączenia: `SELECT wagi.rejestracja, wagi.waga, wagi.dzien, wagi.czas, lokalizacje.ulica FROM wagi JOIN lokalizacje ON wagi.lokalizacje_id = lokalizacje.id ORDER BY wagi.waga DESC`.
3. Przed pętlą zadeklaruj zmienne: `$laczna_masa = 0;` oraz `$liczba_przeciazen = 0;`.
4. W pętli `while` pobieraj kolejne krotki:
   - Dodaj masę pojazdu do `$laczna_masa`.
   - Jeśli masa pojazdu przekracza `5 ton`, zwiększ `$liczba_przeciazen` o 1 i nadaj wierszowi klasę `czerwony`.
   - Jeśli masa nie przekracza `5 ton`, nadaj wierszowi klasę `zielony`.
5. Wygeneruj komórki tabeli: numer rejestracyjny, masę sformatowaną do 1 miejsca po przecinku z dopiskiem `t`, ulicę punktu ważenia oraz datę i godzinę.
6. Pod tabelą wyświetl podsumowanie: łączną masę wszystkich pojazdów oraz liczbę pojazdów ze stwierdzonym przeciążeniem.
7. Zamknij połączenie z bazą funkcją `mysqli_close()`.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```php
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Stacja kontroli tonażu</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Dziennik ważeń pojazdów ciężarowych</h1>
    </header>

    <main>
        <table>
            <thead>
                <tr>
                    <th>Nr rejestracyjny</th>
                    <th>Masa pojazdu</th>
                    <th>Punkt kontroli</th>
                    <th>Data i godzina</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $conn = mysqli_connect("localhost", "root", "", "wazenietirow");
                
                if (!$conn) {
                    die("Błąd połączenia: " . mysqli_connect_error());
                }

                $sql = "SELECT wagi.rejestracja, wagi.waga, wagi.dzien, wagi.czas, lokalizacje.ulica 
                        FROM wagi 
                        JOIN lokalizacje ON wagi.lokalizacje_id = lokalizacje.id 
                        ORDER BY wagi.waga DESC";
                $result = mysqli_query($conn, $sql);

                $laczna_masa = 0.0;
                $liczba_przeciazen = 0;

                while ($row = mysqli_fetch_row($result)) {
                    $rejestracja = htmlspecialchars($row[0]);
                    $waga        = (float)$row[1];
                    $dzien       = htmlspecialchars($row[2]);
                    $czas        = htmlspecialchars($row[3]);
                    $ulica       = htmlspecialchars($row[4]);

                    $laczna_masa += $waga;

                    if ($waga > 5.0) {
                        $klasa = "czerwony";
                        $liczba_przeciazen++;
                    } else {
                        $klasa = "zielony";
                    }

                    echo "<tr class='$klasa'>";
                    echo "<td>$rejestracja</td>";
                    echo "<td>" . number_format($waga, 1, ',', ' ') . " t</td>";
                    echo "<td>ul. $ulica</td>";
                    echo "<td>$dzien $czas</td>";
                    echo "</tr>";
                }

                mysqli_free_result($result);
                mysqli_close($conn);
                ?>
            </tbody>
        </table>

        <section class="podsumowanie">
            <h3>Statystyka dnia:</h3>
            <p>Łączna zważona masa: <strong><?php echo number_format($laczna_masa, 2, ',', ' '); ?> ton</strong></p>
            <p>Liczba pojazdów przeciążonych (&gt; 5 t): <strong class="alarm"><?php echo $liczba_przeciazen; ?></strong></p>
        </section>
    </main>
</body>
</html>
```
</details>
