# Plan Kursu: Bazy Danych i SQL (INF.03)

Plan przygotowujący do egzaminu INF.03 w zakresie projektowania, tworzenia i użytkowania relacyjnych baz danych.

## 1. Cel Kursu
Osiągnięcie biegłości w operacjach na danych (DML) i strukturze (DDL) przy użyciu MySQL/MariaDB oraz narzędzia phpMyAdmin.

## 2. Program Lekcji

### Lekcja 1: Struktura i Typy Danych (DDL)
- **Zagadnienia**: Tworzenie tabel (`CREATE TABLE`), klucze podstawowe (`PRIMARY KEY`), klucze obce, typy danych (`INT`, `VARCHAR`, `TIMESTAMP`).
- **Praktyka**: Projektowanie prostego schematu bazy w phpMyAdmin.

### Lekcja 2: Podstawowe Zapytania i Filtrowanie (DML)
- **Zagadnienia**: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`.
- **Praktyka**: Wyciąganie konkretnych informacji z dużej bazy danych (np. "lista uczniów z klasy 3A").

### Lekcja 3: Relacje i Łączenie Tabel (JOIN)
- **Zagadnienia**: `INNER JOIN`, `LEFT JOIN`. Relacje 1:1, 1:N, N:M.
- **Zadanie**: Wyświetlenie danych z dwóch powiązanych tabel (np. autorzy i ich książki).

### Lekcja 4: Funkcje Agregujące i Grupowanie
- **Zagadnienia**: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`.
- **Zadanie**: Statystyki bazy danych (np. "ile książek napisał dany autor?").

### Lekcja 5: Modyfikacja Danych i Bezpieczeństwo
- **Zagadnienia**: `INSERT`, `UPDATE`, `DELETE`, zarządzanie użytkownikami i uprawnieniami (GRANT/REVOKE).
- **Praktyka**: Masowa aktualizacja cen w sklepie internetowym.

## 3. Zgodność z INF.03
Syllabus pokrywa pełen zakres wymagany na egzaminie: od importu bazy z pliku .sql, przez pisanie zapytań w arkuszu, po integrację z formularzami PHP.
