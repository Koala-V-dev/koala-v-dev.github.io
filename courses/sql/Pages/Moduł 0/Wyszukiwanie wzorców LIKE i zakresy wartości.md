# Wyszukiwanie wzorców LIKE i zakresy wartości

Dokładne dopasowanie operatorem `=` jest niewystarczające, gdy użytkownik wyszukuje produkty po fragmencie nazwy, filtruje towary w przedziale cenowym lub wybiera kilka konkretnych kategorii. Język SQL udostępnia operatory wzorców tekstowych oraz operatory zbiorów, które optymalizują filtrowanie rekordów.

Pracujemy na bazie danych salonu meblowego, konstruując zapytania wyszukiwarki produktów.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik zrzutu bazy danych, aby zaimportować schemat tabeli mebli do lokalnego serwera:

<a href="/public/resources/sql-files/sklep-meblowy.sql" download="sklep-meblowy.sql" class="download-btn">Pobierz plik bazy danych sklepu meblowego (.sql)</a>

Tabela `meble` zawiera pozycje katalogowe sklepu:

| id (INT) | nazwa (VARCHAR) | kategoria (VARCHAR) | cena (DECIMAL) | dostepnosc (INT) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Fotel biurowy Ergonom | fotele | 480.00 | 12 |
| 2 | Fotel uszak Velvet | fotele | 620.00 | 4 |
| 3 | Biurko dębowe Loft | biurka | 850.00 | 8 |
| 4 | Szafa przesuwna Nordic | szafy | 1490.00 | 2 |
| 5 | Krzesło drewniane Classic | krzesla | 180.00 | 25 |

---

## 🔤 Dopasowywanie wzorców tekstowych operatorem LIKE

Operator `LIKE` pozwala wyszukiwać ciągi znaków pasujące do określonego szablonu. W szablonie wykorzystujemy dwa znaki wieloznaczne:

1. Znak procenta (`%`) - zastępuje dowolną liczbę znaków (w tym zero znaków).
2. Znak podkreślenia (`_`) - zastępuje dokładnie jeden dowolny znak.

```sql
-- Wszystkie meble, których nazwa zaczyna się od słowa "Fotel"
SELECT nazwa, cena FROM meble WHERE nazwa LIKE 'Fotel%';

-- Wszystkie meble zawierające w nazwie słowo "Loft" w dowolnym miejscu
SELECT nazwa, cena FROM meble WHERE nazwa LIKE '%Loft%';

-- Kategorie 6-literowe kończące się na 'e'
SELECT nazwa, kategoria FROM meble WHERE kategoria LIKE '_____e';
```

<data-quiz>
  <question>
Który wzorzec w operatorze `LIKE` dopasuje wyłącznie napisy zaczynające się od litery B i mające dokładnie 4 znaki?
  </question>
  <options>
    <option correct>`LIKE 'B___'` - litera B plus dokładnie trzy znaki podkreślenia</option>
    <option>`LIKE 'B%'` - dopasuje każdy wyraz na literę B o dowolnej długości</option>
    <option>`LIKE 'B{4}'` - składnia wyrażeń regularnych niewspierana w standardowym LIKE</option>
    <option>`LIKE 'B*??'` - składnia masek plików powłoki systemowej zamiast SQL</option>
  </options>
</data-quiz>

---

## 📏 Zakresy BETWEEN, zbiory IN oraz obsługa wartości NULL

### 📐 Sprawdzanie przedziałów domkniętych klauzulą BETWEEN

Klauzula `BETWEEN min AND max` weryfikuje, czy wartość kolumny mieści się w zadanym zakresie numerycznym lub datowym. Zakres ten jest **obustronnie domknięty** (wartości graniczne są wliczane):

```sql
SELECT nazwa, cena 
FROM meble 
WHERE cena BETWEEN 400.00 AND 900.00;
```

Zapytanie to jest logicznie tożsame z zapisem: `WHERE cena >= 400.00 AND cena <= 900.00`.

### 📋 Przynależność do zbioru operatorem IN

Gdy chcemy sprawdzić, czy wartość pola pasuje do jednej z wielu dopuszczalnych opcji, operator `IN` zastępuje ciąg powtarzających się warunków `OR`:

```sql
SELECT nazwa, kategoria, cena 
FROM meble 
WHERE kategoria IN ('fotele', 'biurka');
```

Negacja `NOT IN ('szafy')` wyklucza wskazane grupy z wyniku.

### ❓ Weryfikacja braków danych operatorem IS NULL

Wartość `NULL` reprezentuje brak danych i nie może być porównywana tradycyjnym operatorem `=`. W języku SQL stosujemy dedykowane operatory `IS NULL` oraz `IS NOT NULL`:

```sql
SELECT nazwa FROM meble WHERE opis IS NOT NULL;
```

<data-connection-matcher title="Dopasuj konstrukcję SQL do jej właściwości">
  <div class="cmw-item" data-left="`LIKE '%sofa%'`" data-right="Wyszukuje podany ciąg znaków w dowolnej pozycji kolumny"></div>
  <div class="cmw-item" data-left="`BETWEEN 100 AND 300`" data-right="Filtruje przedział domknięty wraz z wartościami brzegowymi"></div>
  <div class="cmw-item" data-left="`IN ('A', 'B', 'C')`" data-right="Sprawdza przynależność wartości do podanej listy elementów"></div>
  <div class="cmw-item" data-left="`IS NOT NULL`" data-right="Wybiera wyłącznie wiersze z uzupełnioną zawartością"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Selekcja mebli po wzorcu i cenie

Sformułuj zapytanie wybierające nazwę (`nazwa`) oraz cenę (`cena`) z tabeli `meble` dla wszystkich foteli (`nazwa` zaczyna się od słowa `'Fotel'`), których cena mieści się w przedziale od 450.00 do 700.00 zł.

<data-gate>
<data-code-runner language="sql" title="Filtrowanie mebli tapicerowanych z ceną w przedziale">
  <template data-type="code">
-- Wybierz kolumny nazwa oraz cena z tabeli meble
-- dla mebli zaczynających się od 'Fotel' o cenie od 450 do 700 zł
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 wiersze z kolumnami nazwa oraz cena",
        "type": "sql-execute",
        "schema": "CREATE TABLE meble (id INT PRIMARY KEY, nazwa TEXT, kategoria TEXT, cena REAL, dostepnosc INT); INSERT INTO meble VALUES (1, 'Fotel biurowy Ergonom', 'fotele', 480.00, 12), (2, 'Fotel uszak Velvet', 'fotele', 620.00, 4), (3, 'Biurko dębowe Loft', 'biurka', 850.00, 8), (4, 'Szafa przesuwna Nordic', 'szafy', 1490.00, 2), (5, 'Krzesło drewniane Classic', 'krzesla', 180.00, 25);",
        "expectedCount": 2,
        "expectedColumns": ["nazwa", "cena"]
      },
      {
        "id": "syntax-like",
        "text": "Wykorzystano operator LIKE z symbolem wieloznacznym %",
        "type": "contains",
        "pattern": "LIKE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Wyszukiwarka asortymentu meblowego

Zbuduj kwerendy filtrujące ofertę salonu meblowego.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Fotele w ofercie**: Napisz zapytanie zwracające kolumny `nazwa` oraz `cena` dla mebli z kategorii `'fotele'` posortowane alfabetycznie według nazwy.
2. **Przedział cenowy średniej półki**: Napisz zapytanie zwracające wszystkie dane mebli o cenie od 400.00 do 1000.00 zł z użyciem operatora `BETWEEN`.
3. **Produkty z wyprzedaży**: Wybierz nazwę i cenę mebli należących do kategorii `'fotele'` lub `'krzesla'`, których dostępność w magazynie jest mniejsza niż 10 sztuk.

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Fotele alfabetycznie
SELECT nazwa, cena 
FROM meble 
WHERE kategoria = 'fotele';

-- Kwerenda 2: Meble od 400 do 1000 zł
SELECT id, nazwa, kategoria, cena, dostepnosc 
FROM meble 
WHERE cena BETWEEN 400.00 AND 1000.00;

-- Kwerenda 3: Wyprzedaż foteli i krzeseł z małym stanem
SELECT nazwa, cena 
FROM meble 
WHERE kategoria IN ('fotele', 'krzesla') AND dostepnosc < 10;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Operator `LIKE` obsługuje znaki wieloznaczne `%` (ciąg znaków) oraz `_` (pojedynczy znak).
- Klauzula `BETWEEN` tworzy domknięty przedział wartości, wliczając wartości brzegowe.
- Operator `IN` upraszcza wielokrotne alternatywy `OR` i współpracuje z negacją `NOT IN`.
- Brakujące wartości `NULL` weryfikujemy wyłącznie za pomocą `IS NULL` lub `IS NOT NULL`.
