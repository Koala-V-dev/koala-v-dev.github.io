# Grupowanie danych GROUP BY i filtrowanie grup HAVING

Funkcje agregujące z poprzedniej lekcji podsumowywały całą tabelę w jeden wynik. W rzeczywistych analizach biznesowych potrzebujemy jednak podsumowań w podziale na kategorie: np. średniej ceny wycieczki w każdym kraju z osobna, liczby zamówień dla poszczególnych klientów czy sumy wydatków na poszczególne działy firmy. Do tego celu służy klauzula `GROUP BY`, a do filtrowania jej wyników - klauzula `HAVING`.

Pracujemy na bazie danych biura podróży, generując raporty popularności i rentowności kierunków wycieczkowych.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych biura podróży:

<a href="/public/resources/sql-files/wyprawy.sql" download="wyprawy.sql" class="download-btn">Pobierz plik bazy danych biura podróży (.sql)</a>

Tabela `wycieczki` zawiera ofertę wyjazdów zagranicznych:

| id (INT) | kraj (VARCHAR) | cel (VARCHAR) | cena (DECIMAL) | miejsca (INT) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Włochy | Rzym | 2400.00 | 20 |
| 2 | Hiszpania | Barcelona | 2800.00 | 25 |
| 3 | Włochy | Wenecja | 2100.00 | 15 |
| 4 | Grecja | Ateny | 1950.00 | 30 |
| 5 | Hiszpania | Madryt | 3100.00 | 18 |
| 6 | Włochy | Florencja | 2600.00 | 12 |

---

## 🗂️ Podział na kategorie klauzulą GROUP BY

Klauzula `GROUP BY` dzieli wiersze na grupy o identycznej wartości w podanej kolumnie. Następnie funkcje agregujące są uruchamiane niezależnie dla każdej z tych grup:

```sql
SELECT 
  kraj,
  COUNT(*) AS liczba_wycieczek,
  ROUND(AVG(cena), 2) AS srednia_cena,
  SUM(miejsca) AS laczna_liczba_miejsc
FROM wycieczki 
GROUP BY kraj;
```

Silnik utworzy trzy odrębne grupy (*Włochy*, *Hiszpania*, *Grecja*) i dla każdej z nich wyliczy liczbę ofert, średnią cenę oraz sumę miejsc.

> [!IMPORTANT]
> **Złota reguła SQL GROUP BY**: Każda kolumna znajdująca się w sekcji `SELECT`, która **nie jest** objęta funkcją agregującą (np. `COUNT`, `SUM`), **musi** znaleźć się w klauzuli `GROUP BY`.

<data-quiz>
  <question>
Która klauzula jest poprawnym miejscem na odfiltrowanie grup posiadających łącznie więcej niż 50 zarezerwowanych miejsc?
  </question>
  <options>
    <option correct>`HAVING SUM(miejsca) > 50` - filtruje zagregowane grupy po podziale</option>
    <option>`WHERE SUM(miejsca) > 50` - odrzuci zapytanie ze względu na funkcję w WHERE</option>
    <option>`GROUP BY SUM(miejsca) > 50` - składnia niedozwolona w klauzuli podziału</option>
    <option>`ORDER BY SUM(miejsca) > 50` - służy wyłącznie do określenia kolejności</option>
  </options>
</data-quiz>

---

## 🚦 Różnica między WHERE a HAVING w cyklu przetwarzania

Kolejność wykonywania klauzul w silniku relacyjnym:
1. `FROM` - wybór źródła tabeli.
2. `WHERE` - filtrowanie pojedynczych wierszy **przed** ich podziałem na grupy.
3. `GROUP BY` - podział przefiltrowanych wierszy na grupy.
4. `HAVING` - filtrowanie zagregowanych grup **po** wykonaniu obliczeń.
5. `SELECT` - generowanie ostatecznych kolumn i aliasów.
6. `ORDER BY` - sortowanie zbioru wynikowego.

```sql
-- Filtrujemy wycieczki droższe niż 2000 zł, grupujemy według krajów,
-- a następnie pozostawiamy tylko kraje z co najmniej 2 takimi ofertami:
SELECT kraj, COUNT(*) AS oferty_premium, ROUND(AVG(cena), 2) AS srednia
FROM wycieczki 
WHERE cena > 2000.00 
GROUP BY kraj 
HAVING COUNT(*) >= 2 
ORDER BY srednia DESC;
```

<data-connection-matcher title="Dopasuj klauzulę SQL do jej momentu w cyklu przetwarzania">
  <div class="cmw-item" data-left="`WHERE`" data-right="Filtruje pojedyncze wiersze przed ich pogrupowaniem"></div>
  <div class="cmw-item" data-left="`GROUP BY`" data-right="Dzieli przefiltrowany zbiór na grupy o wspólnej wartości"></div>
  <div class="cmw-item" data-left="`HAVING`" data-right="Filtruje utworzone grupy na podstawie wyników agregacji"></div>
  <div class="cmw-item" data-left="`ORDER BY`" data-right="Sortuje ostateczny zbiór wynikowy na samym końcu"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Analityka wycieczek z filtrem HAVING

Napisz zapytanie, które pogrupuje tabelę `wycieczki` według kolumny `kraj`. Zwróć nazwę kraju (`kraj`) oraz liczbę dostępnych wycieczek (`COUNT(*) AS liczba`), ograniczając wynik wyłącznie do krajów oferujących więcej niż 1 wycieczkę (`HAVING COUNT(*) > 1`), posortowane alfabetycznie według nazwy kraju.

<data-gate>
<data-code-runner language="sql" title="Liczba wycieczek w podziale na kraje z filtrem HAVING">
  <template data-type="code">
-- Zwróć: kraj, COUNT(*) AS liczba
-- Pogrupuj po kraju, odfiltruj grupy o liczbie > 1 i posortuj alfabetycznie
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 2 grupy (Włochy i Hiszpania) z oczekiwanymi kolumnami",
        "type": "sql-execute",
        "schema": "CREATE TABLE wycieczki (id INT PRIMARY KEY, kraj TEXT, cel TEXT, cena REAL, miejsca INT); INSERT INTO wycieczki VALUES (1, 'Włochy', 'Rzym', 2400.00, 20), (2, 'Hiszpania', 'Barcelona', 2800.00, 25), (3, 'Włochy', 'Wenecja', 2100.00, 15), (4, 'Grecja', 'Ateny', 1950.00, 30), (5, 'Hiszpania', 'Madryt', 3100.00, 18);",
        "expectedCount": 2,
        "expectedColumns": ["kraj", "liczba"]
      },
      {
        "id": "syntax-having",
        "text": "Wykorzystano klauzule GROUP BY oraz HAVING",
        "type": "contains",
        "pattern": "HAVING"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Raport popularności kierunków turystycznych

Sformułuj zapytania analityczne dla dyrekcji biura podróży na bazie `wyprawy.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Liczba wycieczek w podziale na kraje**: Napisz zapytanie zwracające kolumnę `kraj` oraz liczbę oferowanych wycieczek do tego kraju posortowaną malejąco.
2. **Kraje ze średnią ceną powyżej 2500 zł**: Użyj klauzuli `GROUP BY` oraz `HAVING`, aby wyświetlić kraje, w których średnia cena wycieczki przekracza 2500.00 zł.
3. **Pojemność kierunków**: Zbuduj zapytanie zwracające kraj oraz sumę dostępnych miejsc (`SUM(miejsca)`), uwzględniając tylko kraje z łączną liczbą miejsc powyżej 35.

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Liczba ofert per kraj
SELECT kraj, COUNT(*) AS liczba_wycieczek 
FROM wycieczki 
GROUP BY kraj 
ORDER BY liczba_wycieczek DESC;

-- Kwerenda 2: Kraje ze średnią ceną > 2500 zł
SELECT kraj, ROUND(AVG(cena), 2) AS srednia_cena 
FROM wycieczki 
GROUP BY kraj 
HAVING AVG(cena) > 2500.00;

-- Kwerenda 3: Kraje z łączną liczbą miejsc > 35
SELECT kraj, SUM(miejsca) AS suma_miejsc 
FROM wycieczki 
GROUP BY kraj 
HAVING SUM(miejsca) > 35;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- `GROUP BY` dzieli rekordy na logiczne grupy, dla których obliczane są funkcje agregujące.
- Klauzula `WHERE` filtruje wiersze przed agregacją, natomiast `HAVING` filtruje wyliczone grupy po agregacji.
- W klauzuli `HAVING` można używać funkcji agregujących (`COUNT`, `AVG`, `SUM`), co jest niedozwolone w `WHERE`.
