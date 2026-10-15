# Projektowanie tabel CREATE TABLE i więzy integralności

Projektowanie architektury relacyjnej bazy danych wymaga dobrania optymalnych typów danych oraz narzucenia reguł spójności (więzów integralności), które uniemożliwią wprowadzenie do systemu nieprawidłowych lub osieroconych danych. Wszystkie te reguły deklarujemy w języku DDL (Data Definition Language) za pomocą instrukcji `CREATE TABLE`.

Pracujemy na bazie danych kina wielosalowego, projektując tabele repertuaru i rezerwacji biletów.

---

## 💾 Struktura bazy danych i plik źródłowy

Pobierz plik zrzutu bazy danych kina:

<a href="/public/resources/sql-files/kino.sql" download="kino.sql" class="download-btn">Pobierz plik bazy danych kina (.sql)</a>

Tabela `filmy` zawiera repertuar kina:

| id (INT) | tytul (VARCHAR) | rezyser (VARCHAR) | czas_trwania (INT) | kategoria (VARCHAR) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Incepcja | Christopher Nolan | 148 | Sci-Fi |
| 2 | Diuna | Denis Villeneuve | 155 | Sci-Fi |
| 3 | Parasite | Bong Joon-ho | 132 | Dramat |

---

## 🏗️ Dobór typów danych w relacyjnych bazach danych

Właściwy dobór typu danych zmniejsza zużycie pamięci RAM i dysku oraz przyspiesza indeksowanie:

* **Typy całkowite**: `TINYINT` (1 bajt, np. flagi logiczne 0/1), `INT` (4 bajty, standardowe identyfikatory).
* **Typy zmiennoprzecinkowe i stałoprzecinkowe**:
  * `DECIMAL(10, 2)` - format **stałoprzecinkowy**, bezwzględnie wymagany dla cen i walut (zapobiega błędom zaokrągleń).
  * `FLOAT` / `DOUBLE` - format zmiennoprzecinkowy dla pomiarów fizycznych i geolokalizacji.
* **Typy tekstowe**:
  * `VARCHAR(n)` - tekst o zmiennej długości do $n$ znaków (np. email, nazwisko).
  * `TEXT` - długie opisy, recenzje lub artykuły.
* **Typy czasowe**: `DATE` (YYYY-MM-DD), `TIME` (HH:MM:SS), `DATETIME` (data i godzina).

<data-quiz>
  <question>
Dlaczego dla cen biletów lub towarów w sklepie należy bezwzględnie używać typu `DECIMAL` zamiast `FLOAT`?
  </question>
  <options>
    <option correct>Typ `DECIMAL` przechowuje dokładną wartość dziesiętną bez błędów zmiennoprzecinkowych</option>
    <option>Typ `FLOAT` zajmuje dwa razy więcej pamięci dyskowej niż typ `DECIMAL`</option>
    <option>Silnik relacyjny uniemożliwia sortowanie kolumn o typie zmiennoprzecinkowym</option>
    <option>Typ `DECIMAL` automatycznie formatuje i dokleja symbol waluty do wyniku</option>
  </options>
</data-quiz>

---

## 🔒 Więzy integralności danych (Constraints)

Więzy integralności wymuszają poprawność danych na poziomie samego silnika bazy danych:

1. `PRIMARY KEY` - klucz główny, unikalny, nie dopuszcza `NULL`.
2. `AUTO_INCREMENT` - automatycznie nadaje kolejny numer całkowity przy wstawianiu wiersza.
3. `NOT NULL` - zabrania pozostawienia pustego pola.
4. `UNIQUE` - gwarantuje unikalność wartości w kolumnie (np. adres email użytkownika).
5. `DEFAULT wartosc` - przypisuje domyślną wartość, gdy programista jej nie poda.
6. `FOREIGN KEY (kolumna) REFERENCES tabela(id)` - zapewnia, że wartość istnieje w tabeli nadrzędnej.

```sql
CREATE TABLE IF NOT EXISTS seanse (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_filmu INT NOT NULL,
  sala INT NOT NULL,
  data_seansu DATETIME NOT NULL,
  cena_biletu DECIMAL(6, 2) DEFAULT 25.00,
  FOREIGN KEY (id_filmu) REFERENCES filmy(id) ON DELETE CASCADE
);
```

Klauzula `ON DELETE CASCADE` oznacza, że usunięcie filmu z tabeli `filmy` automatycznie skasuje wszystkie powiązane z nim seanse, zapobiegając powstawaniu rekordów osieroconych.

<data-connection-matcher title="Dopasuj ograniczenie kolumny do reguły integralności">
  <div class="cmw-item" data-left="`PRIMARY KEY`" data-right="Klucz unikalny identyfikujący wiersz, nie dopuszcza wartości NULL"></div>
  <div class="cmw-item" data-left="`FOREIGN KEY`" data-right="Wymusza istnienie rekordu w powiązanej tabeli nadrzędnej"></div>
  <div class="cmw-item" data-left="`UNIQUE`" data-right="Zapobiega wystąpieniu duplikatów wartości w obrębie kolumny"></div>
  <div class="cmw-item" data-left="`DEFAULT`" data-right="Wstawia predefiniowaną wartość gdy programista jej nie poda"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Projektowanie tabeli rezerwacji

Napisz polecenie `CREATE TABLE sale`, która stworzy tabelę sal kinowych z kolumnami: `id` (INTEGER PRIMARY KEY), `nazwa` (TEXT NOT NULL UNIQUE) oraz `miejsca` (INTEGER DEFAULT 120). Następnie wstaw do niej jedną salę i sprawdź wynik za pomocą `SELECT`.

<data-gate>
<data-code-runner language="sql" title="Definiowanie nowej tabeli sal kinowych">
  <template data-type="code">
-- 1. Utwórz tabelę sale z kolumnami: id (INTEGER PRIMARY KEY), nazwa (TEXT NOT NULL UNIQUE), miejsca (INTEGER DEFAULT 120)
-- TODO: CREATE TABLE sale (...)

-- 2. Wstaw rekord (id: 1, nazwa: 'Sala Premierowa')
-- TODO: INSERT INTO sale ...

-- 3. Pobierz utworzone dane (kolumny: id, nazwa, miejsca)
-- TODO: SELECT id, nazwa, miejsca FROM sale;

  </template>
  <template data-type="requirements">
    [
      {
        "id": "sql-exec",
        "text": "Tabela została utworzona i poprawnie zwraca wstawiony rekord z domyślną liczbą 120 miejsc",
        "type": "sql-execute",
        "schema": "",
        "expectedCount": 1,
        "expectedColumns": ["id", "nazwa", "miejsca"]
      },
      {
        "id": "syntax-create",
        "text": "Zastosowano instrukcję CREATE TABLE z ograniczeniem PRIMARY KEY",
        "type": "contains",
        "pattern": "CREATE TABLE"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## 🛠️ Zadanie praktyczne - Architektura tabeli seansów kinowych

Zaprojektuj i wdróż tabelę harmonogramu seansów kinowych na bazie `kino.sql`.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Utworzenie tabeli `rezerwacje`**: Napisz polecenie `CREATE TABLE rezerwacje`, która będzie zawierać:
   - `id` (klucz główny, liczba całkowita, auto inkrementacja).
   - `klient_email` (tekst do 100 znaków, pole wymagane `NOT NULL`).
   - `id_filmu` (liczba całkowita, `NOT NULL`).
   - `liczba_biletow` (liczba całkowita, wartość domyślna 1).
2. **Dodanie klucza obcego**: Ustaw więz integralności referencyjnej tak, aby pole `id_filmu` odwoływało się do kolumny `id` tabeli `filmy`.
3. **Wstawienie danych testowych**: Wstaw rezerwację dla filmu o identyfikatorze 1 na adres `'jan.kowalski@example.com'`.

Spróbuj napisać zapytania samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy blok.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```sql
-- Kwerenda 1 i 2: Definicja tabeli z kluczem obcym
CREATE TABLE rezerwacje (
  id INT AUTO_INCREMENT PRIMARY KEY,
  klient_email VARCHAR(100) NOT NULL,
  id_filmu INT NOT NULL,
  liczba_biletow INT DEFAULT 1,
  FOREIGN KEY (id_filmu) REFERENCES filmy(id) ON DELETE CASCADE
);

-- Kwerenda 3: Wstawienie rezerwacji
INSERT INTO rezerwacje (klient_email, id_filmu, liczba_biletow) 
VALUES ('jan.kowalski@example.com', 1, 2);
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Instrukcja `CREATE TABLE` definiuje architekturę tabeli, typy danych kolumn oraz ich ograniczenia.
- Typ `DECIMAL` jest standardem dla operacji finansowych, eliminując błędy binarnej arytmetyki zmiennoprzecinkowej.
- Więzy integralności (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `FOREIGN KEY`) chronią bazę przed wprowadzeniem niespójnych danych.
- `ON DELETE CASCADE` dba o automatyczne usuwanie rekordów zależnych przy kasowaniu rekordu nadrzędnego.
