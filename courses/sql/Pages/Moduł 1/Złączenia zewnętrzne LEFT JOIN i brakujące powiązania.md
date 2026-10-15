# Złączenia zewnętrzne LEFT JOIN i brakujące powiązania

Złączenie wewnętrzne `INNER JOIN` usuwa z raportu wszystkie rekordy, które nie posiadają swojego odpowiednika w powiązanej tabeli. W praktyce inżynierskiej niezwykle często potrzebujemy jednak pełnego zestawienia (np. listy wszystkich czytelników, nawet jeśli nic jeszcze nie wypożyczyli) lub chcemy zidentyfikować wyłącznie rekordy bez powiązań (np. nieaktywne konta czy niesprzedane towary). Do tego celu służy złączenie lewostronne `LEFT JOIN`.

Pracujemy na bazie danych biblioteki miejskiej, analizując aktywność czytelników i wypożyczenia książek.

---

## 💾 Struktura relacyjna bazy i plik źródłowy

Pobierz plik zrzutu bazy biblioteki:

<a href="/public/resources/sql-files/biblioteka.sql" download="biblioteka.sql" class="download-btn">Pobierz plik bazy danych biblioteki (.sql)</a>

Tabela `czytelnicy`:
| id (INT - PK) | imie (VARCHAR) | nazwisko (VARCHAR) | kod (VARCHAR) |
| :--- | :--- | :--- | :--- |
| 1 | Anna | Kowalska | KOW01 |
| 2 | Piotr | Nowak | NOW02 |
| 3 | Ewa | Wiśniewska | WIS03 |
| 4 | Jan | Zieliński | ZIE04 |

Tabela `wypozyczenia`:
| id (INT - PK) | id_czytelnika (INT - FK) | id_ksiazki (INT) | data (DATE) |
| :--- | :--- | :--- | :--- |
| 10 | 1 | 5 | 2026-05-10 |
| 11 | 3 | 12 | 2026-05-12 |
| 12 | 1 | 8 | 2026-05-14 |

---

## ⬅️ Złączenie lewostronne LEFT JOIN i teoria zbiorów

W teorii mnogości operacja `LEFT JOIN` zachowuje cały zbiór lewy $A$ bez względu na to, czy dla danego elementu istnieje para w zbiorze prawym $B$:

<data-gate>
<data-venn-diagram sets="2" task="A"></data-venn-diagram>
</data-gate>

Jeśli rekord z tabeli lewej ($A$) nie posiada powiązania w tabeli prawej ($B$), silnik nie odrzuca go, lecz wypełnia kolumny prawej tabeli wartościami specjalnymi `NULL`:

```sql
SELECT c.imie, c.nazwisko, w.id AS nr_wypozyczenia, w.data 
FROM czytelnicy AS c 
LEFT JOIN wypozyczenia AS w ON c.id = w.id_czytelnika;
```

Dla Piotra Nowaka i Jana Zielińskiego kolumny `nr_wypozyczenia` oraz `data` przyjmą wartość `NULL`.

<data-quiz>
  <question>
Co zwróci zapytanie `tabelaA LEFT JOIN tabelaB` dla wiersza z tabeli A, który nie ma żadnego odpowiednika w tabeli B?
  </question>
  <options>
    <option correct>Wiersz z tabeli A pojawi się w wyniku, a kolumny z tabeli B przyjmą wartości `NULL`</option>
    <option>Wiersz zostanie pominięty, a zapytanie zwróci pusty zbiór danych</option>
    <option>Silnik SQL zduplikuje wiersz z tabeli A dla każdej kolumny tabeli B</option>
    <option>Zostanie natychmiast wygenerowany błąd naruszenia spójności klucza obcego</option>
  </options>
</data-quiz>

---

## 🚫 Wzorzec Anti-Join: identyfikacja brakujących powiązań

Wzorzec **Anti-Join** odpowiada różnicy zbiorów $A \setminus B$. Pozwala wyłowić wyłącznie te rekordy tabeli lewej, które **nie posiadają** żadnego powiązania w tabeli prawej:

<data-gate>
<data-venn-diagram sets="2" task="A \setminus B"></data-venn-diagram>
</data-gate>

Aby zrealizować różnicę zbiorów w języku SQL, łączymy `LEFT JOIN` z filtrem sprawdzającym brak klucza głównego tabeli prawej: `WHERE prawa_tabela.id IS NULL`:

```sql
SELECT c.imie, c.nazwisko 
FROM czytelnicy AS c 
LEFT JOIN wypozyczenia AS w ON c.id = w.id_czytelnika 
WHERE w.id IS NULL;
```

To zapytanie natychmiast odfiltruje Annę i Ewę, zwracając wyłącznie rekordy Piotra Nowaka i Jana Zielińskiego.

<data-connection-matcher title="Dopasuj rodzaj złączenia do zachowania wobec powiązań">
  <div class="cmw-item" data-left="`INNER JOIN`" data-right="Odrzuca wszystkie rekordy niemające odpowiednika w obu tabelach"></div>
  <div class="cmw-item" data-left="`LEFT JOIN`" data-right="Zachowuje wszystkie wiersze lewej tabeli wypełniając braki wartością NULL"></div>
  <div class="cmw-item" data-left="`WHERE p.id IS NULL`" data-right="Wzorzec wybierający wyłącznie rekordy bez powiązań w prawej tabeli"></div>
  <div class="cmw-item" data-left="`RIGHT JOIN`" data-right="Zachowuje wszystkie wiersze tabeli prawej w stosunku do tabeli lewej"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Wykrywanie nieaktywnych kont

Napisz kwerendę złączenia lewostronnego, która odnajdzie imiona i nazwiska czytelników (`czytelnicy.imie`, `czytelnicy.nazwisko`), którzy nie posiadają ani jednego zarejestrowanego wypożyczenia (`wypozyczenia.id IS NULL`).

<data-gate>
<data-code-runner language="sql" title="Identyfikacja czytelników bez wypożyczeń">
  <template data-type="code">
-- Wybierz kolumny imie oraz nazwisko czytelników bez wypożyczeń
-- Użyj LEFT JOIN oraz warunku IS NULL
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie zwraca 2 nieaktywnych czytelników z kolumnami imie oraz nazwisko",
        "type": "sql-execute",
        "schema": "CREATE TABLE czytelnicy (id INT PRIMARY KEY, imie TEXT, nazwisko TEXT); CREATE TABLE wypozyczenia (id INT PRIMARY KEY, id_czytelnika INT, data TEXT); INSERT INTO czytelnicy VALUES (1, 'Anna', 'Kowalska'), (2, 'Piotr', 'Nowak'), (3, 'Ewa', 'Wiśniewska'), (4, 'Jan', 'Zieliński'); INSERT INTO wypozyczenia VALUES (10, 1, '2026-05-10'), (11, 3, '2026-05-12');",
        "expectedCount": 2,
        "expectedColumns": ["imie", "nazwisko"]
      },
      {
        "id": "syntax-left-join",
        "text": "Zastosowano klauzulę LEFT JOIN z filtrem IS NULL",
        "type": "contains",
        "pattern": "LEFT JOIN"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Audyt czytelników i wypożyczeń w bibliotece

Przeprowadź audyt aktywności czytelników na bazie `biblioteka.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Pełne zestawienie czytelników z historią**: Napisz kwerendę `LEFT JOIN`, która wyświetli `imie`, `nazwisko` każdego czytelnika oraz datę jego wypożyczeń (`wypozyczenia.data`).
2. **Identyfikacja nieaktywnych kont**: Zmodyfikuj zapytanie z punktu 1, aby wyłonić wyłącznie tych czytelników, którzy nigdy nie dokonali żadnego wypożyczenia.
3. **Katalog książek bez wypożyczeń**: Wykonaj analogiczne zapytanie łączące tabelę książek `ksiazki` z tabelą `wypozyczenia`, aby odnaleźć tytuły książek, po które nikt jeszcze nie sięgnął (`wypozyczenia.id IS NULL`).

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Wszyscy czytelnicy z historią
SELECT czytelnicy.imie, czytelnicy.nazwisko, wypozyczenia.data 
FROM czytelnicy 
LEFT JOIN wypozyczenia ON czytelnicy.id = wypozyczenia.id_czytelnika;

-- Kwerenda 2: Nieaktywni czytelnicy (Anti-Join)
SELECT czytelnicy.imie, czytelnicy.nazwisko 
FROM czytelnicy 
LEFT JOIN wypozyczenia ON czytelnicy.id = wypozyczenia.id_czytelnika 
WHERE wypozyczenia.id IS NULL;

-- Kwerenda 3: Książki nigdy niewypożyczone
SELECT ksiazki.tytul 
FROM ksiazki 
LEFT JOIN wypozyczenia ON ksiazki.id = wypozyczenia.id_ksiazki 
WHERE wypozyczenia.id IS NULL;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- `LEFT JOIN` zachowuje cały zbiór tabeli lewej ($A$), wstawiając `NULL` w miejscach brakujących powiązań z tabeli prawej.
- Wzorzec Anti-Join ($A \setminus B$) pozwala wykrywać rekordy osierocone za pomocą warunku `WHERE prawa_tabela.id IS NULL`.
- Brakujące wartości `NULL` nie są równe pustemu ciągowi znaków ani zeru - oznaczają całkowity brak powiązanego wiersza.
