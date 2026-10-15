# Karta kursu „Język SQL i relacyjne bazy danych”

## Tożsamość

- Tytuł: Język SQL i relacyjne bazy danych
- Slug: `sql`
- Autor lub opiekun merytoryczny: Zespół Centrum Wiedzy
- Stan: `szkic`
- Odbiorca: Programiści backendu i frontendu, administratorzy baz danych oraz kandydaci do kwalifikacji INF.03 poszukujący praktycznej biegłości w konstruowaniu wydajnych zapytań SQL na rzeczywistych bazach danych
- Poziom: podstawowy
- Kursy wymagane: brak
- Kursy następujące: `php`, `laravel-framework`

## Obietnica kursu

Po ukończeniu kursu uczeń samodzielnie:

1. Pobiera, filtruje i sortuje dane z pojedynczych i wielu tabel relacyjnych za pomocą klauzul `SELECT`, `WHERE`, `ORDER BY` oraz `LIMIT`.
2. Konstruuje zaawansowane filtry tekstowe i numeryczne przy użyciu operatorów `LIKE`, `IN`, `BETWEEN` oraz obsługuje wartości brakujące `IS NULL`.
3. Łączy tabele relacyjne za pomocą złączeń `INNER JOIN`, `LEFT JOIN` i `RIGHT JOIN`, prawidłowo operując na kluczach głównych i obcych.
4. Przeprowadza agregację danych z użyciem funkcji `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` oraz grupuje wyniki klauzulą `GROUP BY` i filtruje zagregowane zbiory za pomocą `HAVING`.
5. Bezpiecznie modyfikuje dane transakcyjne za pomocą instrukcji `INSERT INTO`, `UPDATE` oraz `DELETE`, stosując właściwe warunki brzegowe.
6. Projektuje i tworzy nowe tabele relacyjne (`CREATE TABLE`), dobierając optymalne typy danych, klucze główne `PRIMARY KEY`, klucze obce `FOREIGN KEY` oraz indeksy.

## Granice

- Kurs obejmuje: Standard języka SQL (ANSI SQL / MariaDB / MySQL), strukturę relacyjnych baz danych, import gotowych plików zrzutów `.sql`, złączenia relacyjne, agregacje, podzapytania, manipulację danymi DML oraz definiowanie schematów DDL.
- Kurs świadomie nie obejmuje: Nierelacyjnych baz danych NoSQL (MongoDB), procedur składowanych, wyzwalaczy (triggers) ani specyfiki administracyjnej silników klastrowych.
- Wersje standardów: Dialekt MariaDB 10.4+ / MySQL 8.0+ wspierany przez serwery Apache/XAMPP i silniki produkcyjne.
- Założone środowisko ćwiczeń: Przeglądarka internetowa z silnikiem bazodanowym sql.js (SQLite/WASM), lokalny serwer MySQL (XAMPP/Docker) z załączonymi plikami `.sql`.

## Mapa kompetencji

| Kompetencja techniczna | Praktyczny projekt | Lekcja | Sposób weryfikacji |
| --- | --- | --- | --- |
| Filtrowanie i operatory logiczne | Baza stacji paliw | Moduł 0, Lekcja 1 | Prawidłowe zapytanie filtrujące w konsoli SQL |
| Wzorce tekstowe i zakresy | Baza salonu meblowego | Moduł 0, Lekcja 2 | Dopasowanie wzorców LIKE i zakresów cen |
| Relacje 1:N i złączenie INNER JOIN | Baza restauracji | Moduł 1, Lekcja 3 | Połączenie zamówień z daniami po kluczach obcych |
| Złączenia zewnętrzne LEFT JOIN | Baza biblioteki | Moduł 1, Lekcja 4 | Wykrycie rekordów nieposiadających powiązań |
| Funkcje agregujące i sortowanie | Baza salonu rowerowego | Moduł 2, Lekcja 5 | Obliczenie średnich i skrajnych wartości w tabeli |
| Grupowanie i warunek HAVING | Baza wypraw turystycznych | Moduł 2, Lekcja 6 | Raport podsumowujący z filtrem HAVING |
| Manipulacja danymi DML | Baza przychodni lekarskiej | Moduł 3, Lekcja 7 | Operacje INSERT, UPDATE i DELETE z warunkami |
| Projektowanie schematów DDL | Baza repertuaru kinowego | Moduł 4, Lekcja 8 | Utworzenie tabeli z więzami integralności |
| Modyfikacja tabel i indeksy B-Tree | Baza stacji ważenia | Moduł 4, Lekcja 9 | ALTER TABLE oraz optymalizacja CREATE INDEX |
| Podzapytania i suma zbiorów UNION | Baza hurtowni | Moduł 5, Lekcja 10 | Zapytanie z podzapytaniem oraz UNION |
| Uprawnienia i bezpieczeństwo bazy | Baza pensjonatu | Moduł 5, Lekcja 11 | Konfiguracja CREATE USER, GRANT i REVOKE |

## Plan modułów

| Moduł | Cel modułu | Lekcje | Zadanie integrujące | Warunek przejścia |
| --- | --- | --- | --- | --- |
| 0. Selekcja i filtrowanie rekordów | Opanowanie składni SELECT, WHERE, LIKE, BETWEEN | 2 | Raport asortymentu magazynowego | 100% poprawnych wyników zapytań |
| 1. Relacje i złączenia tabel | Złączenia INNER JOIN, LEFT JOIN, klucze obce | 2 | Zestawienie obrotu zamówień | Bezbledne powiązanie rekordów w relacji |
| 2. Agregacja i analityka danych | Funkcje COUNT/SUM/AVG, GROUP BY, HAVING, ORDER BY | 2 | Panel statystyk sprzedaży | Prawidłowa separacja WHERE i HAVING |
| 3. Modyfikacja danych w tabelach | Bezpieczne operacje INSERT, UPDATE, DELETE | 1 | Obsługa zgłoszeń serwisowych | Prawidłowa modyfikacja bez utraty danych |
| 4. Definiowanie struktur bazodanowych | Tworzenie tabel CREATE TABLE, ALTER TABLE, indeksy | 2 | Kompletny schemat bazy kina i ważenia | Poprawna walidacja relacji i indeksów |
| 5. Zaawansowane operacje i administracja | Podzapytania, UNION, uprawnienia CREATE USER, GRANT | 2 | Konfiguracja kont i analityka hurtowni | Prawidłowe nadanie uprawnień i zapytania |

## Strategia dydaktyczna

- Punkt wyjścia: Rzeczywista baza danych z danymi pobranymi bezpośrednio z arkuszy egzaminacyjnych, udostępniona jako plik `.sql` do natychmiastowego pobrania.
- Metoda pracy:
  1. Przycisk pobrania gotowej bazy danych `.sql` na samym początku lekcji.
  2. Wizualna reprezentacja struktury tabeli i powiązań.
  3. Konkretna kwerenda rozwiązująca rzeczywisty problem biznesowy.
  4. Wyjaśnienie mechanizmu wykonania zapytania w silniku bazy danych.
  5. Quiz weryfikujący zrozumienie kolejności klauzul i typów danych.
  6. Dopasowanie pojęć i składni w interaktywnym matcherze.
  7. Samodzielne zadanie kwerendy z przykładowym rozwiązaniem ukrytym w sekcji rozwijanej.
