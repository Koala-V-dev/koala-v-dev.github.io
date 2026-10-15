# Modyfikacja schematu tabeli ALTER TABLE i indeksy wydajnościowe

W cyklu życia aplikacji struktura bazy danych nieustannie ewoluuje. Dodawanie nowych funkcjonalności wymaga rozszerzania istniejących tabel o nowe kolumny lub modyfikacji typów danych bez utraty zgromadzonych rekordów. Ponadto w miarę wzrostu bazy ze 100 do 1 000 000 wierszy proste zapytania zaczynają drastycznie zwalniać. Rozwiązaniem obu tych wyzwań są polecenia `ALTER TABLE` oraz tworzenie indeksów wydajnościowych `CREATE INDEX`.

Pracujemy na bazie danych stacji ważenia pojazdów ciężarowych, optymalizując czas wyszukiwania numerów rejestracyjnych i rozszerzając schemat ewidencji.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych stacji kontroli i ważenia pojazdów:

<a href="/public/resources/sql-files/wazenie-pojazdow.sql" download="wazenie-pojazdow.sql" class="download-btn">Pobierz plik bazy danych ważenia pojazdów (.sql)</a>

Tabela `wagi` zawiera rejestr pomiarów:

| id (INT) | rejestracja (VARCHAR) | waga (INT) | data_wazenia (DATE) |
| :--- | :--- | :--- | :--- |
| 1 | WZ1234A | 18500 | 2026-06-01 |
| 2 | KR9988B | 24200 | 2026-06-01 |
| 3 | GD4433C | 12100 | 2026-06-02 |
| 4 | PO7711D | 31500 | 2026-06-03 |

---

## 🛠️ Ewolucja schematu za pomocą ALTER TABLE

Polecenie `ALTER TABLE` modyfikuje strukturę istniejącej tabeli z zachowaniem wszystkich dotychczas zapisanych danych:

### ➕ Dodawanie nowej kolumny (ADD COLUMN)

```sql
ALTER TABLE wagi 
ADD COLUMN przeciazenie TINYINT(1) DEFAULT 0;
```

Nowo dodana kolumna `przeciazenie` przyjmie w każdym istniejącym wierszu wartość domyślną `0`.

### ✏️ Modyfikacja typu danych (MODIFY COLUMN)

Gdy okazuje się, że kolumna na numer rejestracyjny jest zbyt krótka:

```sql
ALTER TABLE wagi 
MODIFY COLUMN rejestracja VARCHAR(20) NOT NULL;
```

### ❌ Usuwanie kolumny (DROP COLUMN)

```sql
ALTER TABLE wagi 
DROP COLUMN data_wazenia;
```

<data-quiz>
  <question>
Co stanie się z danymi zapisanymi w tabeli po wykonaniu polecenia `ALTER TABLE wagi ADD COLUMN uwagi TEXT;`?
  </question>
  <options>
    <option correct>Dotychczasowe rekordy zostaną zachowane, a w nowej kolumnie otrzymają wartość NULL lub domyślną</option>
    <option>Wszystkie wiersze w tabeli zostaną bezpowrotnie usunięte w trakcie przebudowy</option>
    <option>Silnik zablokuje operację, wymagając uprzedniego wyczyszczenia tabeli przez TRUNCATE</option>
    <option>Nowa kolumna zostanie dodana wyłącznie do wierszy wstawianych w przyszłości</option>
  </options>
</data-quiz>

---

## ⚡ Indeksy bazodanowe i eliminacja Full Table Scan

Domyślnie przy wykonaniu zapytania `SELECT * FROM wagi WHERE rejestracja = 'KR9988B'` silnik bazy danych musi przeczytać każdy wiersz tabeli od początku do końca. Nazywa się to **pełnym skanowaniem tabeli (Full Table Scan)**. Przy milionie wierszy oznacza to miliony odczytów z dysku.

### 🌲 Struktura B-Tree i polecenie CREATE INDEX

Indeks działa jak skorowidz na końcu książki technicznej. Silnik buduje zbalansowane drzewo poszukiwań (B-Tree), w którym odnalezienie dowolnego rekordu zajmuje ułamek milisekundy ($O(\log n)$ zamiast $O(n)$):

```sql
CREATE INDEX idx_rejestracja ON wagi(rejestracja);
```

Złożony indeks na kilku kolumnach przyspiesza zapytania wielowarunkowe:

```sql
CREATE INDEX idx_data_waga ON wagi(data_wazenia, waga);
```

> [!TIP]
> **Kiedy indeksować?** Indeksujemy kolumny często występujące w klauzulach `WHERE`, `JOIN ... ON` oraz `ORDER BY`. Nie należy indeksować każdej kolumny bez umiaru, ponieważ każdy indeks spowalnia operacje `INSERT`, `UPDATE` oraz `DELETE` (drzewo indeksu musi być aktualizowane przy każdym zapisie).

<data-connection-matcher title="Dopasuj operację schematu do jej zastosowania">
  <div class="cmw-item" data-left="`ALTER TABLE ... ADD`" data-right="Rozszerza schemat tabeli o nową kolumnę bez utraty danych"></div>
  <div class="cmw-item" data-left="`ALTER TABLE ... MODIFY`" data-right="Zmienia typ danych lub ograniczenia istniejącej kolumny"></div>
  <div class="cmw-item" data-left="`CREATE INDEX ... ON`" data-right="Buduje strukturę B-Tree przyspieszającą filtrowanie i złączenia"></div>
  <div class="cmw-item" data-left="`DROP INDEX ... ON`" data-right="Usuwa indeks zmniejszając narzut wydajnościowy przy zapisie"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Modyfikacja tabeli i indeksowanie

Rozszerz tabelę `pomiary` o nową kolumnę tekstową `kierowca` (TEXT) z wartością domyślną `'Nieznany'`. Następnie utwórz indeks `idx_kierowca` na nowo utworzonej kolumnie i pobierz wszystkie wiersze.

<data-gate>
<data-code-runner language="sql" title="Dodanie kolumny i utworzenie indeksu">
  <template data-type="code">
-- 1. Dodaj kolumnę kierowca (TEXT DEFAULT 'Nieznany') do tabeli pomiary
-- TODO: ALTER TABLE pomiary ADD COLUMN ...

-- 2. Utwórz indeks idx_kierowca na kolumnie kierowca w tabeli pomiary
-- TODO: CREATE INDEX ...

-- 3. Pobierz rekordy tabeli za pomocą SELECT (kolumny: id, rejestracja, waga, kierowca)
-- TODO: SELECT id, rejestracja, waga, kierowca FROM pomiary;

  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca wiersze z nową kolumną kierowca i wartością domyślną",
        "type": "sql-execute",
        "schema": "CREATE TABLE pomiary (id INT PRIMARY KEY, rejestracja TEXT, waga INT); INSERT INTO pomiary VALUES (1, 'WZ1234A', 18500), (2, 'KR9988B', 24200);",
        "expectedCount": 2,
        "expectedColumns": ["id", "rejestracja", "waga", "kierowca"]
      },
      {
        "id": "syntax-alter",
        "text": "Zastosowano polecenie ALTER TABLE ADD COLUMN oraz CREATE INDEX",
        "type": "contains",
        "pattern": "ALTER TABLE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Rozbudowa systemu ważenia pojazdów

Wykonaj zadania administracji bazą na bazie `wazenie-pojazdow.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Flaga przeciążenia**: Napisz polecenie `ALTER TABLE`, które doda do tabeli `wagi` kolumnę `kara` o typie `DECIMAL(8, 2)` z wartością domyślną `0.00`.
2. **Naliczenie kary za przeciążenie**: Zaktualizuj (`UPDATE`) kolumnę `kara` na kwotę `500.00` dla pojazdów o masie (`waga`) przekraczającej 20000 kg.
3. **Optymalizacja kwerend wyszukiwawczych**: Utwórz indeks `idx_waga` na kolumnie `waga`, aby przyspieszyć raportowanie pojazdów przekraczających dopuszczalny tonaż.

Spróbuj napisać polecenia samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Dodanie kolumny kary
ALTER TABLE wagi 
ADD COLUMN kara DECIMAL(8, 2) DEFAULT 0.00;

-- Kwerenda 2: Naliczenie kary dla przeciążonych aut
UPDATE wagi 
SET kara = 500.00 
WHERE waga > 20000;

-- Kwerenda 3: Utworzenie indeksu na masie
CREATE INDEX idx_waga ON wagi(waga);
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- `ALTER TABLE` umożliwia dodawanie (`ADD`), zmianę typu (`MODIFY`) oraz usuwanie (`DROP`) kolumn w istniejącej tabeli.
- Indeksy (`CREATE INDEX`) eliminują konieczność pełnego skanowania tabeli (Full Table Scan), przyspieszając wyszukiwanie do złożoności logarytmicznej $O(\log n)$.
- Nadmiar indeksów zwiększa narzut czasowy operacji zapisu (`INSERT`, `UPDATE`), dlatego indeksujemy wyłącznie kolumny często odpytywane w `WHERE` i `JOIN`.
