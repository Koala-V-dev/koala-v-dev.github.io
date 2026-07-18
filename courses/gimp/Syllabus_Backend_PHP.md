# Plan Kursu: Backend - PHP (INF.03)

Programowanie serwerowe i integracja z bazami danych.

## 1. Cel Kursu
Tworzenie dynamicznych stron generowanych po stronie serwera oraz łączenie aplikacji z bazą MySQL.

## 2. Program Lekcji

### Lekcja 1: Składnia PHP i Praca z Zmiennymi
- **Zagadnienia**: Tagi `<?php ?>`, `echo`, konkatenacja ciągów, zmienne superglobalne (`$_GET`, `$_POST`).
- **Praktyka**: Odbieranie danych z formularza HTML i wyświetlanie ich na stronie.

### Lekcja 2: Instrukcje Warunkowe i Funkcje Tablicowe
- **Zagadnienia**: Logika w PHP, tablice asocjacyjne.
- **Zadanie**: Generowanie strony z cennikiem na podstawie tablicy w PHP.

### Lekcja 3: Połączenie z Bazą Danych (PDO/mysqli)
- **Zagadnienia**: Funkcje `mysqli_connect` lub klasa `PDO`. Obsługa błędów połączenia.
- **Zadanie**: Wyświetlenie danych z bazy SQL bezpośrednio w tabeli HTML (np. lista towarów z magazynu).

### Lekcja 4: Operacje na Danych (CRUD)
- **Zagadnienia**: Przesyłanie zapytań SQL z poziomu PHP. Wstawianie danych użytkownika do bazy.
- **Praktyka**: Skrypt dodający komentarze pod artykułem.

### Lekcja 5: Sesje i Bezpieczeństwo
- **Zagadnienia**: `session_start()`, obsługa logowania, prosta ochrona przed SQL Injection.
- **Zadanie**: Strona dostępna tylko po zalogowaniu.

## 3. Zgodność z INF.03
Syllabus kładzie nacisk na najczęstszy schemat egzaminacyjny: Skrypt PHP pobiera dane z formularza, łączy się z bazą danych i wykonuje zapytanie SQL wyświetlając wynik.
