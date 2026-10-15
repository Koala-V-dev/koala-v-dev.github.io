# Funkcje agregujące i sortowanie ORDER BY

Praca z danymi w systemach produkcyjnych rzadko kończy się na prostym wyświetleniu rekordów. Równie istotne jest podsumowywanie wielkości sprzedaży, obliczanie średnich wartości, wyszukiwanie wartości skrajnych (najniższa i najwyższa cena) oraz precyzyjne porządkowanie raportów rosnąco lub malejąco za pomocą klauzul `ORDER BY` i `LIMIT`.

Pracujemy na bazie danych salonu rowerowego, generując statystyki magazynowe.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych salonu rowerowego:

<a href="/public/resources/sql-files/salon-rowerowy.sql" download="salon-rowerowy.sql" class="download-btn">Pobierz plik bazy danych salonu rowerowego (.sql)</a>

Tabela `rowery` zawiera asortyment salonu:

| id (INT) | marka (VARCHAR) | model (VARCHAR) | typ (VARCHAR) | cena (DECIMAL) | ilosc (INT) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Trek | Marlin 7 | MTB | 3299.00 | 5 |
| 2 | Giant | Roam 2 | Cross | 2799.00 | 3 |
| 3 | Kross | Hexagon 5 | MTB | 1999.00 | 8 |
| 4 | Specialized | Sirrus 3 | Miejski | 3899.00 | 2 |
| 5 | Romet | Wagant 4 | Trekking | 1899.00 | 12 |

---

## 📊 Funkcje agregujące i aliasowanie kolumn

Funkcje agregujące przetwarzają zbiór wierszy kolumny i zwracają pojedynczą wartość skalarną:

* `COUNT(*)` - zlicza łączną liczbę wierszy spełniających warunki.
* `SUM(kolumna)` - sumuje wartości liczbowe w kolumnie.
* `AVG(kolumna)` - oblicza średnią arytmetyczną wartości.
* `MIN(kolumna)` oraz `MAX(kolumna)` - wyznaczają wartość najmniejszą i największą.

```sql
SELECT 
  COUNT(*) AS liczba_modeli,
  SUM(ilosc) AS laczny_stan_magazynu,
  ROUND(AVG(cena), 2) AS srednia_cena,
  MIN(cena) AS najtanszy_rower,
  MAX(cena) AS najdrozszy_rower
FROM rowery;
```

Funkcja `ROUND(liczba, 2)` zaokrągla wynik zmiennoprzecinkowy do dwóch miejsc po przecinku.

<data-quiz>
  <question>
Które zapytanie poprawnie zwróci pojedynczy najtańszy rower z oferty salonu?
  </question>
  <options>
    <option correct>`SELECT marka, model, cena FROM rowery ORDER BY cena ASC LIMIT 1;`</option>
    <option>`SELECT marka, model FROM rowery WHERE cena = MIN(cena);`</option>
    <option>`SELECT marka, model, MIN(cena) FROM rowery LIMIT 1 DESC;`</option>
    <option>`SELECT TOP 1 marka, model FROM rowery GROUP BY najmniejsza;`</option>
  </options>
</data-quiz>

---

## 🔃 Sortowanie rekordów ORDER BY i stronicowanie LIMIT

Klauzula `ORDER BY` określa porządek sortowania wierszy:
* `ASC` (domyślnie) - sortowanie rosnąco (od A do Z, od najmniejszej liczby do największej).
* `DESC` - sortowanie malejąco (od Z do A, od największej liczby do najmniejszej).

```sql
SELECT marka, model, cena 
FROM rowery 
ORDER BY cena DESC;
```

### 🔢 Sortowanie wielopoziomowe i klauzula LIMIT

Możemy sortować po wielu kryteriach rozdzielonych przecinkami. Klauzula `LIMIT n` ogranicza wynik do pierwszych $n$ wierszy:

```sql
-- Trzy najdroższe rowery posortowane po cenie, a przy równej cenie alfabetycznie po marce
SELECT marka, model, cena 
FROM rowery 
ORDER BY cena DESC, marka ASC 
LIMIT 3;
```

<data-connection-matcher title="Dopasuj klauzulę SQL do jej roli w zapytaniu">
  <div class="cmw-item" data-left="`ORDER BY cena DESC`" data-right="Sortuje wiersze malejąco od najwyższej wartości do najniższej"></div>
  <div class="cmw-item" data-left="`LIMIT 5`" data-right="Ogranicza liczbę zwróconych rekordów do pierwszych 5 wierszy"></div>
  <div class="cmw-item" data-left="`ROUND(AVG(cena), 2)`" data-right="Zwraca średnią arytmetyczną zaokrągloną do dwóch miejsc"></div>
  <div class="cmw-item" data-left="`ORDER BY marka ASC`" data-right="Sortuje wiersze alfabetycznie od A do Z"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Ranking cenowy modeli MTB

Sformułuj zapytanie, które pobierze markę, model oraz cenę rowerów typu `'MTB'`, posortuje je malejąco według ceny i zwróci wyłącznie 2 najdroższe pozycje.

<data-gate>
<data-code-runner language="sql" title="Dwa najdroższe rowery górskie MTB">
  <template data-type="code">
-- Wybierz: marka, model, cena dla typ = 'MTB'
-- Posortuj malejąco po cenie i ogranicz do 2 wierszy
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 najdroższe rowery MTB z oczekiwanymi kolumnami",
        "type": "sql-execute",
        "schema": "CREATE TABLE rowery (id INT PRIMARY KEY, marka TEXT, model TEXT, typ TEXT, cena REAL, ilosc INT); INSERT INTO rowery VALUES (1, 'Trek', 'Marlin 7', 'MTB', 3299.00, 5), (2, 'Giant', 'Roam 2', 'Cross', 2799.00, 3), (3, 'Kross', 'Hexagon 5', 'MTB', 1999.00, 8), (4, 'Scott', 'Aspect 940', 'MTB', 2899.00, 4);",
        "expectedCount": 2,
        "expectedColumns": ["marka", "model", "cena"]
      },
      {
        "id": "syntax-order",
        "text": "Wykorzystano ORDER BY z klauzulą DESC oraz LIMIT",
        "type": "contains",
        "pattern": "ORDER BY"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Analiza magazynu salonu rowerowego

Sformułuj zapytania statystyczne dla menedżera salonu na bazie `salon-rowerowy.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Łączna wycena magazynu**: Napisz kwerendę obliczającą łączną liczbę wszystkich rowerów na stanie (`SUM(ilosc)`) oraz średnią cenę katalogową (`AVG(cena)`).
2. **Katalog alfabetyczny**: Wybierz `marka`, `model` oraz `cena` dla rowerów o cenie poniżej 3000.00 zł, sortując wynik alfabetycznie według marki.
3. **Trzy najtańsze rowery**: Wybierz markę, model oraz cenę trzech najtańszych rowerów w salonie (`ORDER BY cena ASC LIMIT 3`).

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Wycena magazynu
SELECT 
  SUM(ilosc) AS laczny_stan, 
  ROUND(AVG(cena), 2) AS srednia_cena 
FROM rowery;

-- Kwerenda 2: Rowery poniżej 3000 zł alfabetycznie
SELECT marka, model, cena 
FROM rowery 
WHERE cena < 3000.00 
ORDER BY marka ASC;

-- Kwerenda 3: Trzy najtańsze rowery
SELECT marka, model, cena 
FROM rowery 
ORDER BY cena ASC 
LIMIT 3;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Funkcje agregujące (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) redukują zestaw wierszy do pojedynczej wartości.
- Klauzula `ORDER BY` porządkuje wyniki rosnąco (`ASC`) lub malejąco (`DESC`).
- `LIMIT n` ogranicza rozmiar zwracanego zestawu danych, co ma kluczowe znaczenie przy stronicowaniu i top-rankingach.
