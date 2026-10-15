# Zarządzanie użytkownikami i uprawnienia bazy danych

Aplikacje webowe w architekturze produkcyjnej nigdy nie powinny łączyć się z bazą danych przy użyciu konta administratora (`root`). Naruszenie tej zasady grozi przejęciem pełnej kontroli nad serwerem w przypadku podatności SQL Injection. Właściwa inżynieria baz danych opiera się na **zasadzie najmniejszych uprawnień (Principle of Least Privilege)**: tworzeniu dedykowanych kont technicznych z dostępem ograniczonym wyłącznie do niezbędnych tabel i operacji.

Pracujemy na bazie danych pensjonatu wypoczynkowego, konfigurując uprawnienia dla personelu recepcji oraz automatycznego systemu rezerwacji.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik bazy danych pensjonatu:

<a href="/public/resources/sql-files/pensjonat.sql" download="pensjonat.sql" class="download-btn">Pobierz plik bazy danych pensjonatu (.sql)</a>

Tabela `pokoje` zawiera bazę noclegową:

| id (INT) | numer (INT) | standard (VARCHAR) | cena_za_dobe (DECIMAL) | dostepny (TINYINT) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 101 | Standard | 180.00 | 1 |
| 2 | 102 | Standard | 180.00 | 0 |
| 3 | 201 | Apartament | 350.00 | 1 |
| 4 | 202 | Deluxe | 420.00 | 1 |

---

## 👤 Tworzenie kont użytkowników w silniku MySQL i MariaDB

Instrukcja `CREATE USER` rejestruje nowe konto w systemowej tabeli silnika bazy danych:

```sql
CREATE USER 'recepcja'@'localhost' IDENTIFIED BY 'BezpieczneHaslo#2026';
```

W notacji relacyjnej konto składa się z dwóch elementów rozdzielonych znakiem `@`:
1. **Nazwa użytkownika** (np. `'recepcja'`).
2. **Host źródłowy** (np. `'localhost'` - dozwolone połączenia wyłącznie z tej samej maszyny; `'%'` - połączenie z dowolnego adresu IP w sieci).

Zmiana hasła istniejącego użytkownika:

```sql
ALTER USER 'recepcja'@'localhost' IDENTIFIED BY 'NoweHaslo#9988';
```

Usuwanie konta:

```sql
DROP USER IF EXISTS 'recepcja'@'localhost';
```

<data-quiz>
  <question>
Dlaczego w instrukcji `CREATE USER 'app'@'localhost'` zaleca się wskazanie `'localhost'` zamiast symbolu `'%'`?
  </question>
  <options>
    <option correct>Ogranicza dostęp wyłącznie do aplikacji uruchomionej lokalnie, blokując zdalne ataki z sieci zewnętrznej</option>
    <option>Zwiększa maksymalną liczbę jednoczesnych połączeń do bazy danych</option>
    <option>Automatycznie szyfruje wszystkie zapytania algorytmem RSA w pamięci RAM</option>
    <option>Wymusza na silniku bazy wyłączenie sprawdzania haseł dostępowych</option>
  </options>
</data-quiz>

---

## 🛡️ Nadawanie i odbieranie uprawnień: GRANT i REVOKE

### 🔑 Nadawanie uprawnień poleceniem GRANT

Polecenie `GRANT` przydziela konkretne uprawnienia do wskazanych baz lub tabel:

```sql
-- Dostęp do odczytu i dodawania rezerwacji w bazie pensjonat:
GRANT SELECT, INSERT ON pensjonat.pokoje TO 'recepcja'@'localhost';

-- Pełne uprawnienia do wszystkich tabel w bazie:
GRANT ALL PRIVILEGES ON pensjonat.* TO 'kierownik'@'localhost';
```

Katalog standardowych uprawnień relacyjnych:
* `SELECT` - prawo do wykonywania zapytań odczytujących.
* `INSERT` - prawo do wstawiania nowych rekordów.
* `UPDATE` - prawo do modyfikacji istniejących wierszy.
* `DELETE` - prawo do usuwania danych.
* `CREATE`, `DROP`, `ALTER` - uprawnienia administracyjne do modyfikacji struktur tabel.

### 🚫 Odbieranie uprawnień poleceniem REVOKE

```sql
REVOKE DELETE ON pensjonat.pokoje FROM 'recepcja'@'localhost';
```

### 🔄 Przeładowanie tablic uprawnień

Po modyfikacji uprawnień należy odświeżyć tablice pamięci podręcznej serwera:

```sql
FLUSH PRIVILEGES;
```

Podgląd aktualnych uprawnień zalogowanego lub wskazanego użytkownika:

```sql
SHOW GRANTS FOR 'recepcja'@'localhost';
```

<data-connection-matcher title="Dopasuj polecenie administracyjne do jego przeznaczenia">
  <div class="cmw-item" data-left="`CREATE USER ... IDENTIFIED BY`" data-right="Tworzy nowe konto użytkownika z przypisanym hasłem"></div>
  <div class="cmw-item" data-left="`GRANT SELECT, INSERT ON`" data-right="Przydziela wybrane uprawnienia do określonej bazy lub tabeli"></div>
  <div class="cmw-item" data-left="`REVOKE DELETE ON`" data-right="Odbiera użytkownikowi uprawnienie do usuwania rekordów"></div>
  <div class="cmw-item" data-left="`FLUSH PRIVILEGES`" data-right="Przeładowuje tablice uprawnień w pamięci podręcznej serwera"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Selekcja dostępnych pokoi pensjonatu

Napisz zapytanie, które pobierze numer pokoju (`numer`), standard (`standard`) oraz cenę za dobę (`cena_za_dobe`) dla wszystkich wolnych pokoi (`dostepny = 1`) o cenie za dobę nieprzekraczającej 300.00 zł, posortowane rosnąco po cenie.

<data-gate>
<data-code-runner language="sql" title="Filtr wolnych pokoi w przystępnej cenie">
  <template data-type="code">
-- Wybierz: numer, standard, cena_za_dobe
-- dla dostepny = 1 oraz cena_za_dobe <= 300
-- posortuj rosnąco po cena_za_dobe
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Zapytanie poprawnie zwraca 1 wolny pokój spełniający kryteria cenowe",
        "type": "sql-execute",
        "schema": "CREATE TABLE pokoje (id INT PRIMARY KEY, numer INT, standard TEXT, cena_za_dobe REAL, dostepny INT); INSERT INTO pokoje VALUES (1, 101, 'Standard', 180.00, 1), (2, 102, 'Standard', 180.00, 0), (3, 201, 'Apartament', 350.00, 1), (4, 202, 'Deluxe', 420.00, 1);",
        "expectedCount": 1,
        "expectedColumns": ["numer", "standard", "cena_za_dobe"]
      },
      {
        "id": "syntax-where",
        "text": "Zastosowano klauzulę WHERE z filtrem dostępności i ceny",
        "type": "contains",
        "pattern": "WHERE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Konfiguracja konta bazy danych pensjonatu

Wykonaj zadania zabezpieczenia i nadania uprawnień dla systemu pensjonatu.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Utworzenie konta pracownika**: Napisz polecenie `CREATE USER`, które utworzy użytkownika `'recepcjonista'@'localhost'` z hasłem `'Pensjonat#2026'`.
2. **Nadanie minimalnych uprawnień**: Nadaj temu użytkownikowi wyłącznie uprawnienia do odczytu (`SELECT`) oraz modyfikacji (`UPDATE`) tabeli `pokoje` w bazie `pensjonat`.
3. **Zatwierdzenie uprawnień**: Przeładuj tablice uprawnień poleceniem `FLUSH PRIVILEGES;`.

Spróbuj napisać polecenia samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1: Utworzenie użytkownika
CREATE USER 'recepcjonista'@'localhost' IDENTIFIED BY 'Pensjonat#2026';

-- Kwerenda 2: Nadanie uprawnień do tabeli
GRANT SELECT, UPDATE ON pensjonat.pokoje TO 'recepcjonista'@'localhost';

-- Kwerenda 3: Przeładowanie tablic uprawnień
FLUSH PRIVILEGES;
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Zasada najmniejszych uprawnień chroni serwer przed atakami poprzez ograniczenie dostępu kont technicznych.
- `CREATE USER` definiuje nazwę konta, dozwolony host źródłowy oraz hasło.
- `GRANT` przydziela uprawnienia (`SELECT`, `INSERT`, `UPDATE`), a `REVOKE` je cofa.
- `FLUSH PRIVILEGES` wymusza natychmiastowe zastosowanie zmian w silniku bazy danych.
