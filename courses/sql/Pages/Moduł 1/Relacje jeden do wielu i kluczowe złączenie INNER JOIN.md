# Relacje jeden do wielu i kluczowe złączenie INNER JOIN

Prawdziwa siła relacyjnych baz danych polega na eliminacji redundancji danych. Zamiast powielać pełne dane klienta czy potrawy w każdym zamówieniu, dzielimy model na wyspecjalizowane tabele i łączymy je relacjami za pomocą kluczy obcych. Aby odczytać powiązane ze sobą informacje w jednym spójnym raporcie, stosujemy operację złączenia wewnętrznego `INNER JOIN`.

Pracujemy na relacyjnej bazie danych restauracji, zestawiając zamówienia sali z pozycjami menu.

---

## 💾 Struktura relacyjna bazy i plik źródłowy

Pobierz plik zrzutu bazy danych restauracji do lokalnego serwera MySQL:

<a href="/public/resources/sql-files/restauracja.sql" download="restauracja.sql" class="download-btn">Pobierz plik bazy danych restauracji (.sql)</a>

Baza zawiera m.in. tabelę `dania` oraz powiązaną relacją jeden-do-wielu tabelę `zamowienia`:

Tabela `dania`:
| id (INT - PK) | nazwa (VARCHAR) | typ (INT) | cena (DECIMAL) |
| :--- | :--- | :--- | :--- |
| 1 | Gazpacho | 1 | 22.00 |
| 2 | Lasagne | 2 | 34.00 |
| 3 | Tarta szpinakowa | 2 | 28.00 |
| 4 | Kompot truskawkowy | 3 | 8.00 |

Tabela `zamowienia`:
| id (INT - PK) | id_dania (INT - FK) | stolik (INT) | data (DATE) |
| :--- | :--- | :--- | :--- |
| 101 | 2 | 4 | 2026-06-15 |
| 102 | 1 | 2 | 2026-06-15 |
| 103 | 2 | 5 | 2026-06-15 |
| 104 | 4 | 2 | 2026-06-15 |

---

## 🔑 Klucz główny i klucz obcy jako fundament relacji

* **Klucz główny (Primary Key - PK)**: kolumna (np. `dania.id`), która unikalnie identyfikuje każdy wiersz w tabeli. Nie dopuszcza wartości `NULL` ani duplikatów.
* **Klucz obcy (Foreign Key - FK)**: kolumna w powiązanej tabeli (np. `zamowienia.id_dania`), która przechowuje referencję wskazującą na istniejący klucz główny tabeli nadrzędnej.

Dzięki temu zamiast zapisywać tekst `"Lasagne"` i cenę `34.00` przy każdym zamówieniu, w tabeli zamówień przechowujemy wyłącznie identyfikator `2`. Zmiana nazwy lub ceny potrawy w tabeli `dania` jest natychmiast widoczna w całej historii zamówień bez modyfikacji milionów wierszy.

<data-quiz>
  <question>
Co stanie się w złączeniu `INNER JOIN` z wierszem tabeli `zamowienia`, jeśli jego klucz obcy `id_dania` nie istnieje w tabeli `dania`?
  </question>
  <options>
    <option correct>Wiersz zostanie bezwzględnie pominięty w zbiorze wynikowym zapytania</option>
    <option>Wiersz pojawi się w wyniku z wartościami `NULL` w polach tabeli dań</option>
    <option>Silnik bazy danych natychmiast zgłosi błąd krytyczny naruszenia klucza</option>
    <option>Zostanie utworzony nowy pusty rekord w tabeli dań o zadanym identyfikatorze</option>
  </options>
</data-quiz>

---

## 🔗 Teoria zbiorów i złączenie wewnętrzne INNER JOIN

W teorii mnogości relacja `INNER JOIN` odpowiada iloczynowi zbiorów (części wspólnej $A \cap B$). Zwracane są wyłącznie te rekordy tabeli lewej, które posiadają swój odpowiednik w tabeli prawej spełniający warunek złączenia:

<data-gate>
<data-venn-diagram sets="2" task="A \cap B"></data-venn-diagram>
</data-gate>

### 📐 Składnia klauzuli INNER JOIN i aliasy tabel

Warunek dopasowania definiujemy po słowie kluczowym `ON`. W celu skrócenia zapisu i wyeliminowania konfliktów nazw stosujemy aliasy tabel (`AS z`, `AS d`):

```sql
SELECT z.id AS nr_zamowienia, d.nazwa, d.cena, z.stolik 
FROM zamowienia AS z
INNER JOIN dania AS d ON z.id_dania = d.id;
```

Działanie silnika:
1. Przegląda rekord po rekordzie tabelę `zamowienia` (tabela $A$).
2. Szuka w tabeli `dania` (tabela $B$) rekordu o identycznej wartości klucza `id = id_dania`.
3. Jeśli rekordy spełniają warunek `ON`, scala kolumny obu tabel w pojedynczy wiersz wyniku.
4. Rekordy bez powiązania zostają bezpowrotnie odrzucone z raportu.

<data-connection-matcher title="Dopasuj pojęcie relacyjne do jego roli w schemacie bazy">
  <div class="cmw-item" data-left="`PRIMARY KEY`" data-right="Unikalny identyfikator jednoznacznie wskazujący wiersz w tabeli"></div>
  <div class="cmw-item" data-left="`FOREIGN KEY`" data-right="Klucz obcy wskazujący na rekord w tabeli nadrzędnej"></div>
  <div class="cmw-item" data-left="`INNER JOIN`" data-right="Zwraca wiersze posiadające dopasowanie w obu łączonych tabelach"></div>
  <div class="cmw-item" data-left="`tabela AS t`" data-right="Aliasy skracające zapytanie i eliminujące konflikty nazw"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Kwerenda relacyjna zamówień

Połącz tabelę `zamowienia` z tabelą `dania`. Zwróć numer zamówienia (`zamowienia.id`), numer stolika (`zamowienia.stolik`), nazwę potrawy (`dania.nazwa`) oraz cenę (`dania.cena`) wyłącznie dla zamówień przy stolikach o numerze większym niż 2.

<data-gate>
<data-code-runner language="sql" title="Zestawienie zamówień restauracji z nazwami dań">
  <template data-type="code">
-- Połącz tabelę zamowienia z dania za pomocą INNER JOIN
-- Wybierz: zamowienia.id, zamowienia.stolik, dania.nazwa, dania.cena
-- Warunek: stolik > 2
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 złączone wiersze z oczekiwanymi kolumnami",
        "type": "sql-execute",
        "schema": "CREATE TABLE dania (id INT PRIMARY KEY, nazwa TEXT, cena REAL); CREATE TABLE zamowienia (id INT PRIMARY KEY, id_dania INT, stolik INT); INSERT INTO dania VALUES (1, 'Gazpacho', 22.00), (2, 'Lasagne', 34.00), (3, 'Tarta szpinakowa', 28.00); INSERT INTO zamowienia VALUES (101, 2, 4), (102, 1, 2), (103, 3, 5);",
        "expectedCount": 2,
        "expectedColumns": ["id", "stolik", "nazwa", "cena"]
      },
      {
        "id": "syntax-join",
        "text": "Wykorzystano klauzulę INNER JOIN z warunkiem ON",
        "type": "contains",
        "pattern": "JOIN"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Zestawienie dań i zamówień w restauracji

Stwórz zapytania analityczne dla obsługi sali restauracyjnej na bazie `restauracja.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Pełna lista zrealizowanych potraw**: Napisz kwerendę łączącą `zamowienia` z tabelą `dania`. Zwróć numer zamówienia (`zamowienia.id`), nazwę dania oraz jego cenę.
2. **Kwerenda dla rachunków stolika numer 4**: Zmodyfikuj zapytanie z punktu 1 dodając klauzulę `WHERE`, aby wyselekcjonować wyłącznie zamówienia złożone przy stoliku numer 4.
3. **Dania droższe niż 25 zł w zamówieniach**: Zbuduj kwerendę relacyjną zwracającą nazwę potrawy, cenę i datę zamówienia dla dań, których cena jednostkowa przekracza 25.00 zł.

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Zestawienie zamówień z potrawami
SELECT zamowienia.id, dania.nazwa, dania.cena 
FROM zamowienia 
INNER JOIN dania ON zamowienia.id_dania = dania.id;

-- Kwerenda 2: Zamówienia dla stolika numer 4
SELECT zamowienia.id, dania.nazwa, dania.cena 
FROM zamowienia 
INNER JOIN dania ON zamowienia.id_dania = dania.id 
WHERE zamowienia.stolik = 4;

-- Kwerenda 3: Pozycje powyżej 25 zł
SELECT dania.nazwa, dania.cena, zamowienia.data 
FROM zamowienia 
INNER JOIN dania ON zamowienia.id_dania = dania.id 
WHERE dania.cena > 25.00;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Klucz główny (`PRIMARY KEY`) gwarantuje unikalność rekordu, a klucz obcy (`FOREIGN KEY`) ustanawia referencję.
- `INNER JOIN` wyznacza część wspólną $A \cap B$ i odrzuca wiersze bez dopasowania w obu tabelach.
- Klauzula `ON` określa warunek złączenia logicznego między kluczem głównym a obcym.
- Stosowanie aliasów tabel (`tabela AS t`) zapobiega wieloznaczności kolumn o identycznych nazwach.
