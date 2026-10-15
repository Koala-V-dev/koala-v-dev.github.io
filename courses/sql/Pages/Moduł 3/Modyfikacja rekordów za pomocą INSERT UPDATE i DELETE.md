# Modyfikacja rekordów za pomocą INSERT UPDATE i DELETE

Operacje odczytu danych stanowią tylko połowę pracy programisty z bazą relacyjną. Druga połowa to modyfikacja danych w ramach operacji DML (Data Manipulation Language): dodawanie nowych rekordów (`INSERT`), aktualizowanie istniejących wartości (`UPDATE`) oraz bezpieczne usuwanie zbędnych danych (`DELETE`).

Pracujemy na bazie danych przychodni lekarskiej, rejestrując i realizując recepty pacjentów.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych przychodni medycznej:

<a href="/public/resources/sql-files/recepty.sql" download="recepty.sql" class="download-btn">Pobierz plik bazy danych przychodni (.sql)</a>

Tabela `recepty` przechowuje status dokumentów medycznych:

| id (INT) | pesel (VARCHAR) | kod (INT) | zrealizowana (TINYINT) | data_wystawienia (DATE) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 02231201928 | 1012 | 0 | 2026-06-01 |
| 2 | 89100412890 | 4421 | 0 | 2026-06-03 |
| 3 | 78010219827 | 9031 | 1 | 2026-06-05 |
| 4 | 95051508212 | 8901 | 0 | 2026-06-10 |

---

## ➕ Wstawianie rekordów za pomocą INSERT INTO

Polecenie `INSERT INTO` tworzy nowe wiersze w tabeli:

```sql
INSERT INTO recepty (pesel, kod, zrealizowana, data_wystawienia) 
VALUES ('04251209876', 7712, 0, '2026-06-12');
```

Zaleca się jawne wymienianie nazw kolumn w nawiasach. Pozwala to pominąć kolumnę klucza głównego `id`, jeśli posiada ona atrybut `AUTO_INCREMENT`.

### 📦 Wstawianie wielu wierszy w jednym zapytaniu

Możemy wstawić wiele krotek w jednej operacji, oddzielając zestawy wartości przecinkami:

```sql
INSERT INTO recepty (pesel, kod, zrealizowana, data_wystawienia) VALUES 
('91021408761', 3120, 0, '2026-06-14'),
('83091104329', 5590, 0, '2026-06-14');
```

<data-quiz>
  <question>
Co nastąpi po uruchomieniu zapytania `UPDATE recepty SET zrealizowana = 1;` bez klauzuli `WHERE`?
  </question>
  <options>
    <option correct>Wszystkie wiersze w całej tabeli zostaną bezwarunkowo oznaczone jako zrealizowane</option>
    <option>Silnik bazy danych zgłosi błąd składniowy i odmówi wykonania operacji</option>
    <option>Zostanie zaktualizowany wyłącznie pierwszy wiersz o najniższym identyfikatorze</option>
    <option>Operacja zostanie wstrzymana w oczekiwaniu na potwierdzenie transakcji</option>
  </options>
</data-quiz>

---

## ✏️ Aktualizacja i usuwanie danych: UPDATE oraz DELETE

### 🔄 Modyfikacja danych klauzulą UPDATE

Polecenie `UPDATE` zmienia wartości we wskazanych kolumnach dla wierszy spełniających warunek `WHERE`:

```sql
UPDATE recepty 
SET zrealizowana = 1 
WHERE kod = 4421;
```

> [!CAUTION]
> **Zasada bezpieczeństwa**: Brak klauzuli `WHERE` w poleceniach `UPDATE` oraz `DELETE` spowoduje modyfikację lub skasowanie **wszystkich wierszy w całej tabeli**.

### 🗑️ Usuwanie rekordów klauzulą DELETE i czyszczenie TRUNCATE

Polecenie `DELETE` usuwa wybrane wiersze:

```sql
DELETE FROM recepty 
WHERE zrealizowana = 1 AND data_wystawienia < '2026-01-01';
```

Do całkowitego wyczyszczenia tabeli i zresetowania licznika `AUTO_INCREMENT` do zera służy instrukcja:

```sql
TRUNCATE TABLE recepty;
```

<data-connection-matcher title="Dopasuj operację SQL do jej przeznaczenia">
  <div class="cmw-item" data-left="`INSERT INTO ... VALUES`" data-right="Wstawia jeden lub więcej nowych wierszy do tabeli"></div>
  <div class="cmw-item" data-left="`UPDATE ... SET ... WHERE`" data-right="Zmienia wartości wybranych kolumn w określonych wierszach"></div>
  <div class="cmw-item" data-left="`DELETE FROM ... WHERE`" data-right="Trwale usuwa wiersze spełniające warunek logiczny"></div>
  <div class="cmw-item" data-left="`TRUNCATE TABLE`" data-right="Błyskawicznie czyści całą tabelę i resetuje licznik auto-increment"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Realizacja recepty w aptece

Napisz polecenie aktualizacji, które zmieni status recepty o kodzie `1012` na zrealizowaną (`zrealizowana = 1`). Następnie pobierz ten zaktualizowany rekord (`SELECT * FROM recepty WHERE kod = 1012;`), aby potwierdzić zmianę.

<data-gate>
<data-code-runner language="sql" title="Aktualizacja statusu realizacji recepty">
  <template data-type="code">
-- 1. Zaktualizuj receptę o kodzie 1012 ustawiając zrealizowana = 1
-- TODO: Napisz polecenie UPDATE z klauzulą SET oraz warunkiem WHERE

-- 2. Pobierz ten rekord za pomocą SELECT (kolumny: id, pesel, kod, zrealizowana)
-- TODO: Napisz kwerendę SELECT dla kodu 1012

  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca zaktualizowany rekord z polem zrealizowana = 1",
        "type": "sql-execute",
        "schema": "CREATE TABLE recepty (id INT PRIMARY KEY, pesel TEXT, kod INT, zrealizowana INT); INSERT INTO recepty VALUES (1, '02231201928', 1012, 0), (2, '89100412890', 4421, 0);",
        "expectedCount": 1,
        "expectedColumns": ["id", "kod", "zrealizowana"]
      },
      {
        "id": "syntax-update",
        "text": "Wykorzystano polecenie UPDATE z klauzulą SET i WHERE",
        "type": "contains",
        "pattern": "UPDATE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Zarządzanie receptami pacjentów w przychodni

Zrealizuj zadania modyfikacji bazy danych dla panelu lekarza na bazie `recepty.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Wystawienie nowej recepty**: Napisz polecenie `INSERT INTO`, które doda do tabeli `recepty` nowy dokument dla pacjenta o numerze PESEL `'03251209876'`, z kodem recepty `9922`, statusem `0` (niezrealizowana) oraz dzisiejszą datą wystawienia.
2. **Realizacja w aptece**: Napisz polecenie `UPDATE`, które zmieni status recepty o kodzie `8901` na zrealizowaną (`zrealizowana = 1`).
3. **Usunięcie starych dokumentów**: Napisz polecenie `DELETE`, które skasuje wszystkie recepty zrealizowane (`zrealizowana = 1`), których data wystawienia jest wcześniejsza niż `'2026-06-05'`.

Spróbuj napisać polecenia samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Wstawienie nowej recepty
INSERT INTO recepty (pesel, kod, zrealizowana, data_wystawienia) 
VALUES ('03251209876', 9922, 0, '2026-06-15');

-- Kwerenda 2: Realizacja recepty
UPDATE recepty 
SET zrealizowana = 1 
WHERE kod = 8901;

-- Kwerenda 3: Usunięcie starych zrealizowanych recept
DELETE FROM recepty 
WHERE zrealizowana = 1 AND data_wystawienia < '2026-06-05';
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- `INSERT INTO` dodaje nowe rekordy; warto jawnie wymieniać kolumny docelowe.
- `UPDATE` oraz `DELETE` bezwzględnie wymagają klauzuli `WHERE`, aby uniknąć przypadkowego zniszczenia bazy.
- `TRUNCATE TABLE` błyskawicznie czyści całą tabelę i resetuje licznik `AUTO_INCREMENT`.
