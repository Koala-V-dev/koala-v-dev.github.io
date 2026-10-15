# Podstawy zapytania SELECT i filtrowanie WHERE

Relacyjne bazy danych przechowują dane w dwuwymiarowych tabelach podzielonych na kolumny (atrybuty) oraz wiersze (rekordy). Każda operacja odczytu danych w języku SQL rozpoczyna się od instrukcji `SELECT`, która wskazuje silnikowi bazy żądane kolumny oraz źródłową tabelę w klauzuli `FROM`.

Pracujemy na bazie danych stacji paliw, analizując cenniki oraz weryfikując stany rezerw w podziemnych zbiornikach.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik zrzutu bazy danych, aby zaimportować strukturę oraz dane testowe do lokalnego serwera bazy danych:

<a href="/public/resources/sql-files/stacja-paliw.sql" download="stacja-paliw.sql" class="download-btn">Pobierz plik bazy danych stacji paliw (.sql)</a>

Tabela `stacja` przechowuje dane asortymentowe:

| id (INT) | nazwa (VARCHAR) | cena (DECIMAL) | stan_magazynu (INT) |
| :--- | :--- | :--- | :--- |
| 1 | Benzyna 95 | 6.55 | 12500 |
| 2 | Benzyna 98 | 7.15 | 4200 |
| 3 | Olej Napędowy | 6.49 | 18000 |
| 4 | LPG | 2.95 | 3100 |

---

## 🔍 Projekcja kolumn w zapytaniu SELECT

Najprostsze zapytanie SQL definiuje listę kolumn pobieranych z tabeli:

```sql
SELECT nazwa, cena FROM stacja;
```

Znak gwiazdki (`*`) wymusza pobranie wszystkich zdefiniowanych kolumn:

```sql
SELECT * FROM stacja;
```

W systemach produkcyjnych zaleca się jawne wskazywanie nazw kolumn. Zmniejsza to obciążenie sieci, przyspiesza deserializację danych i zapobiega awariom aplikacji przy zmianach schematu tabeli.

<data-quiz>
  <question>
Jaka jest główna konsekwencja stosowania `SELECT *` zamiast jawnego wypisania nazw kolumn w zapytaniach produkcyjnych?
  </question>
  <options>
    <option correct>Przesyłane są zbędne dane, co zwiększa obciążenie sieci i obniża przepustowość</option>
    <option>Baza danych automatycznie odrzuci zapytanie ze względów bezpieczeństwa</option>
    <option>Silnik SQL uniemożliwi sortowanie wyników klauzulą `ORDER BY`</option>
    <option>Zapytanie zadziała poprawnie wyłącznie dla pierwszego odczytanego wiersza</option>
  </options>
</data-quiz>

---

## ⚖️ Filtrowanie rekordów klauzulą WHERE

Klauzula `WHERE` definiuje warunek logiczny ewaluowany dla każdego wiersza tabeli. Rekord trafia do wyniku tylko wtedy, gdy warunek zwróci wartość prawdy (`TRUE`):

```sql
SELECT nazwa, cena 
FROM stacja 
WHERE cena < 6.50;
```

Podstawowe operatory porównania:
* `=` - dokładna równość
* `!=` lub `<>` - różny od
* `>` oraz `<` - większy, mniejszy
* `>=` oraz `<=` - większy bądź równy, mniejszy bądź równy

### 🔀 Łączenie warunków operatorami AND OR oraz NOT

Warunki można łączyć w wielopoziomowe predykaty:

```sql
SELECT nazwa, stan_magazynu 
FROM stacja 
WHERE cena > 6.00 AND stan_magazynu < 5000;
```

* `AND` wymaga spełnienia obu warunków jednocześnie.
* `OR` wymaga spełnienia co najmniej jednego z warunków.
* `NOT` odwraca wartość logiczną wyrażenia.

Operator `AND` ma wyższy priorytet logiczny niż `OR`. W złożonych zapytaniach stosuj nawiasy `()`, aby jednoznacznie wymusić kolejność ewaluacji.

<data-connection-matcher title="Dopasuj operator SQL do jego interpretacji logicznej">
  <div class="cmw-item" data-left="`AND`" data-right="Koniunkcja wymagająca spełnienia obu warunków jednocześnie"></div>
  <div class="cmw-item" data-left="`OR`" data-right="Alternatywa wymagająca spełnienia co najmniej jednego warunku"></div>
  <div class="cmw-item" data-left="`NOT`" data-right="Negacja odwracająca wartość logiczną sprawdzanego warunku"></div>
  <div class="cmw-item" data-left="`!=`" data-right="Porównanie wykluczające rekordy o identycznej wartości"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Kwerenda cenowa paliw

Sformułuj zapytanie filtrujące ofertę stacji paliw. Wybierz wyłącznie kolumny `nazwa` oraz `cena` dla tych rodzajów paliw, których cena mieści się w przedziale od 6.00 do 7.00 zł i stan magazynowy wynosi powyżej 4000 litrów.

<data-gate>
<data-code-runner language="sql" title="Kwerenda filtrująca paliwa w przedziale cenowym">
  <template data-type="code">
-- Wybierz kolumny nazwa oraz cena z tabeli stacja
-- dla rekordów z ceną od 6.00 do 7.00 zł i stanem powyżej 4000 litrów
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 wiersze z kolumnami nazwa oraz cena",
        "type": "sql-execute",
        "schema": "CREATE TABLE stacja (id INT PRIMARY KEY, nazwa TEXT, cena REAL, stan_magazynu INT); INSERT INTO stacja VALUES (1, 'Benzyna 95', 6.55, 12500), (2, 'Benzyna 98', 7.15, 4200), (3, 'Olej Napędowy', 6.49, 18000), (4, 'LPG', 2.95, 3100);",
        "expectedCount": 2,
        "expectedColumns": ["nazwa", "cena"]
      },
      {
        "id": "syntax-where",
        "text": "Wykorzystano klauzulę WHERE z operatorem logicznym AND",
        "type": "contains",
        "pattern": "WHERE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Analiza sprzedaży paliw

Twoim zadaniem jest sformułowanie zapytań SQL dla personelu stacji paliw na zaimportowanej bazie danych.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Pobranie pełnego cennika**: Napisz kwerendę wybierającą kolumny `nazwa` oraz `cena` dla wszystkich dostępnych rodzajów paliw.
2. **Alert niskiego stanu magazynowego**: Napisz zapytanie, które zwróci `nazwa` oraz `stan_magazynu` dla pozycji, których zapas spadł poniżej 5000 litrów.
3. **Paliwa premium w krytycznym stanie**: Napisz zapytanie zwracające wszystkie dane paliw o cenie wyższej niż 7.00 zł, których stan magazynowy jest mniejszy niż 10000 litrów.

Spróbuj napisać zapytania samodzielnie w swoim kliencie baz danych. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Cennik paliw
SELECT nazwa, cena 
FROM stacja;

-- Kwerenda 2: Niski stan magazynu (< 5000 litrów)
SELECT nazwa, stan_magazynu 
FROM stacja 
WHERE stan_magazynu < 5000;

-- Kwerenda 3: Paliwa drogie i z niskim stanem magazynowym
SELECT id, nazwa, cena, stan_magazynu 
FROM stacja 
WHERE cena > 7.00 AND stan_magazynu < 10000;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Instrukcja `SELECT` określa listę zwracanych kolumn, a klauzula `FROM` wskazuje tabelę źródłową.
- Klauzula `WHERE` filtruje wiersze przed ich zwróceniem na podstawie wyrażeń logicznych.
- Operatory logiczne `AND` oraz `OR` pozwalają na budowanie wielopoziomowych filtrów danych.
- Stosowanie nawiasów okrągłych eliminuje niejednoznaczności wynikające z pierwszeństwa operatora `AND` nad `OR`.
