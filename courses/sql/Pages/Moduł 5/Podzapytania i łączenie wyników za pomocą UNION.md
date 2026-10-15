# Podzapytania i łączenie wyników za pomocą UNION

Gdy kryteria wyszukiwania zależą od wyników innego zapytania (np. poszukiwanie produktów droższych od średniej ceny całego magazynu), pojedyncze zapytanie SQL nie wystarcza. W takich scenariuszach stosujemy **podzapytania (subqueries)**. Z kolei gdy zachodzi potrzeba połączenia w jeden raport rekordów pochodzących z dwóch różnych tabel lub odrębnych zapytań o tej samej strukturze kolumn, wykorzystujemy operację sumy zbiorów `UNION`.

Pracujemy na bazie danych hurtowni wielobranżowej, badając produkty o ponadprzeciętnych cenach i łącząc dane z różnych działów.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych hurtowni:

<a href="/public/resources/sql-files/hurtownia.sql" download="hurtownia.sql" class="download-btn">Pobierz plik bazy danych hurtowni (.sql)</a>

Tabela `towary` przechowuje asortyment hurtowni:

| id (INT) | nazwa (VARCHAR) | kategoria (VARCHAR) | cena (DECIMAL) | stan (INT) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Wiertarka udarowa | Narzędzia | 340.00 | 15 |
| 2 | Zestaw kluczy | Narzędzia | 180.00 | 40 |
| 3 | Farba akrylowa biała | Malarstwo | 85.00 | 60 |
| 4 | Drabina aluminiowa | Budownictwo | 290.00 | 8 |
| 5 | Pędzel płaski | Malarstwo | 12.00 | 150 |

---

## 🔍 Podzapytania nieskorelowane w klauzuli WHERE

Podzapytanie (subquery) to zapytanie `SELECT` zagnieżdżone wewnątrz innego zapytania w nawiasach okrągłych `()`. Silnik bazodanowy wykonuje najpierw podzapytanie wewnętrzne, a jego wynik przekazuje do zapytania zewnętrznego:

```sql
-- Wybierz towary, których cena jest wyższa niż średnia cena wszystkich towarów w bazie:
SELECT nazwa, cena 
FROM towary 
WHERE cena > (SELECT AVG(cena) FROM towary);
```

Silnik oblicza najpierw wartość `AVG(cena)` (np. 181.40 zł), a następnie wykonuje filtrowanie zewnętrzne `WHERE cena > 181.40`.

### 📋 Podzapytania z operatorem IN

Gdy podzapytanie zwraca całą listę wartości (jedną kolumnę z wieloma wierszami), stosujemy operator `IN`:

```sql
SELECT nazwa, cena 
FROM towary 
WHERE id IN (SELECT id_towaru FROM promocje);
```

<data-quiz>
  <question>
Jaki warunek musi spełniać podzapytanie użyte po operatorze porównania `>` lub `=` w klauzuli `WHERE`?
  </question>
  <options>
    <option correct>Musi zwrócić dokładnie jedną wartość skalarną (jeden wiersz i jedną kolumnę)</option>
    <option>Musi zwrócić pełną tabelę z identyczną liczbą kolumn co zapytanie zewnętrzne</option>
    <option>Musi być zapytaniem z klauzulą `GROUP BY` oraz `HAVING`</option>
    <option>Musi odwoływać się do dokładnie tej samej tabeli co zapytanie główne</option>
  </options>
</data-quiz>

---

## 🔀 Teoria mnogości i suma zbiorów UNION

Operacja `UNION` odpowiada sumie zbiorów $A \cup B$. Łączy ona wyniki dwóch zapytań `SELECT` w jeden jednolity zbiór wynikowy:

<data-gate>
<data-venn-diagram sets="2" task="A \cup B"></data-venn-diagram>
</data-gate>

### ⚖️ UNION a UNION ALL

* `UNION` - łączy zbiory i automatycznie usuwa powtarzające się duplikaty (wymaga kosztownego sortowania).
* `UNION ALL` - łączy zbiory bez eliminacji duplikatów (operacja znacznie szybsza).

Warunki konieczne dla `UNION`:
1. Oba zapytania muszą zwracać **dokładnie taką samą liczbę kolumn**.
2. Odpowiadające sobie kolumny muszą posiadać **zgodne typy danych**.

```sql
SELECT nazwa, cena, 'Promocja' AS status 
FROM towary 
WHERE cena < 50.00

UNION

SELECT nazwa, cena, 'Bestseller' AS status 
FROM towary 
WHERE stan > 100;
```

<data-connection-matcher title="Dopasuj operację na zbiorach do jej właściwości">
  <div class="cmw-item" data-left="`UNION`" data-right="Łączy wyniki zapytań i automatycznie eliminuje powtarzające się duplikaty"></div>
  <div class="cmw-item" data-left="`UNION ALL`" data-right="Błyskawicznie łączy wyniki bez sprawdzania i usuwania duplikatów"></div>
  <div class="cmw-item" data-left="`WHERE cena > (SELECT ...)`" data-right="Filtruje rekordy na podstawie dynamicznie wyliczonej wartości skalarnej"></div>
  <div class="cmw-item" data-left="`WHERE id IN (SELECT ...)`" data-right="Weryfikuje przynależność klucza do listy zwróconej przez podzapytanie"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Kwerenda towarów powyżej średniej

Napisz zapytanie wybierające nazwę (`nazwa`) oraz cenę (`cena`) z tabeli `towary` dla artykułów, których cena jednostkowa przewyższa średnią cenę towarów w całej hurtowni, posortowane malejąco po cenie.

<data-gate>
<data-code-runner language="sql" title="Towary droższe od średniej ceny magazynowej">
  <template data-type="code">
-- Wybierz: nazwa, cena z tabeli towary
-- dla towarów o cenie > średnia cena w hurtowni
-- posortuj malejąco po cenie
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 najdroższe towary z kolumnami nazwa oraz cena",
        "type": "sql-execute",
        "schema": "CREATE TABLE towary (id INT PRIMARY KEY, nazwa TEXT, kategoria TEXT, cena REAL, stan INT); INSERT INTO towary VALUES (1, 'Wiertarka udarowa', 'Narzędzia', 340.00, 15), (2, 'Zestaw kluczy', 'Narzędzia', 180.00, 40), (3, 'Drabina aluminiowa', 'Budownictwo', 290.00, 8), (4, 'Pędzel płaski', 'Malarstwo', 12.00, 150);",
        "expectedCount": 2,
        "expectedColumns": ["nazwa", "cena"]
      },
      {
        "id": "syntax-subquery",
        "text": "Wykorzystano podzapytanie z funkcją AVG w klauzuli WHERE",
        "type": "contains",
        "pattern": "AVG"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Analiza asortymentu w hurtowni

Sformułuj zapytania analityczne dla kierownika hurtowni na bazie `hurtownia.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Towary powyżej średniej w dziale Narzędzia**: Napisz kwerendę zwracającą `nazwa` oraz `cena` towarów z kategorii `'Narzędzia'`, których cena jest wyższa niż średnia cena w tej samej kategorii.
2. **Najtańszy i najdroższy artykuł**: Użyj operacji `UNION`, aby w jednym raporcie zestawić towar o minimalnej cenie oraz towar o maksymalnej cenie.
3. **Produkty z krytycznym zapasem**: Napisz kwerendę z podzapytaniem, która wyłoni nazwy towarów, których stan magazynowy jest mniejszy niż średni stan towarów w hurtowni.

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Artykuły powyżej średniej w kategorii Narzędzia
SELECT nazwa, cena 
FROM towary 
WHERE kategoria = 'Narzędzia' 
  AND cena > (SELECT AVG(cena) FROM towary WHERE kategoria = 'Narzędzia');

-- Kwerenda 2: Skrajne towary za pomocą UNION
SELECT nazwa, cena, 'Najtanszy' AS typ 
FROM towary 
ORDER BY cena ASC 
LIMIT 1

UNION

SELECT nazwa, cena, 'Najdrozszy' AS typ 
FROM towary 
ORDER BY cena DESC 
LIMIT 1;

-- Kwerenda 3: Towary z zapasem poniżej średniej
SELECT nazwa, stan 
FROM towary 
WHERE stan < (SELECT AVG(stan) FROM towary);
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Podzapytania w `WHERE` pozwalają dynamicznie obliczać wartości progowe (np. średnie, minima) bez konieczności hardkodowania liczb.
- `UNION` sumuje zbiory ($A \cup B$) i usuwa duplikaty; `UNION ALL` zachowuje powtórzenia i działa szybciej.
- Wszystkie zapytania łączone przez `UNION` muszą posiadać taką samą liczbę kolumn o zgodnych typach danych.
