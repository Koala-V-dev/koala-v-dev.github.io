# INF.03 — Czerwiec 2025 (Zadanie 01: Portal hurtowni — SQL, HTML/CSS i JS)

Zamiast biernie czytać gotowe rozwiązanie, przejdziesz ten arkusz etapami dokładnie tak jak na egzaminie: najpierw napiszesz i przetestujesz **4 kwerendy SQL**, potem zbudujesz **strukturę semantyczną HTML i style CSS**, a na końcu zaprogramujesz **interakcję w JavaScript**.

> [!IMPORTANT]
> Oryginały jawnych arkuszy egzaminacyjnych pochodzą bezpośrednio z zasobów **Centralnej Komisji Egzaminacyjnej (CKE)**: [cke.gov.pl/egzamin-zawodowy](https://cke.gov.pl/egzamin-zawodowy/).

## Materiały i pliki startowe

| Zasób | Opis | Link |
| :--- | :--- | :--- |
| Arkusz egzaminacyjny (PDF) | Oficjalna treść zadania praktycznego | [Pobierz arkusz PDF (CKE)](https://cke.gov.pl/egzamin-zawodowy/) |
| Pliki startowe (ZIP) | Baza `.sql`, grafiki i pliki startowe | [Pobierz paczkę ZIP (CKE)](https://cke.gov.pl/egzamin-zawodowy/) |
| Baza lokalna do ćwiczeń | Plik `hurtownia.sql` do XAMPP / phpMyAdmin | <a href="/public/resources/sql-files/hurtownia.sql" download="hurtownia.sql" class="download-btn">Pobierz hurtownia.sql</a> |
| Katalog i postęp | Oznacz ten arkusz jako ukończony | [Wróć do katalogu /arkusze](/arkusze/?qual=INF.03) |

---

## Etap 1: Kwerendy SQL (kwerendy.txt)

Na egzaminie każda z 4 kwerend jest oceniana osobno. Wykonaj kolejno wszystkie cztery etapy w silniku SQL.

### Kwerenda 1 — Selekcja produktów z działu Narzędzia

Wybierz kolumny `nazwa` oraz `cena` z tabeli `towary` wyłącznie dla kategorii `'Narzędzia'`, posortowane rosnąco według ceny.

<data-gate>
<data-code-runner language="sql" title="INF.03 Kwerenda 1: Selekcja i sortowanie">
  <template data-type="code">
-- Kwerenda 1: nazwa, cena dla kategorii 'Narzędzia' rosnąco po cenie
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "kw1-exec",
        "text": "Zwrócono dokładnie 2 rekordy z kategorii Narzędzia posortowane rosnąco po cenie",
        "type": "sql-execute",
        "schema": "CREATE TABLE towary (id INT PRIMARY KEY, nazwa TEXT, kategoria TEXT, cena REAL, stan INT); INSERT INTO towary VALUES (1, 'Wiertarka udarowa', 'Narzędzia', 340.00, 15), (2, 'Zestaw kluczy', 'Narzędzia', 180.00, 40), (3, 'Farba biała', 'Malarstwo', 85.00, 60), (4, 'Drabina', 'Budownictwo', 290.00, 8);",
        "expectedCount": 2,
        "expectedColumns": ["nazwa", "cena"],
        "exactOrder": true,
        "expectedRows": [
          { "nazwa": "Zestaw kluczy", "cena": 180.00 },
          { "nazwa": "Wiertarka udarowa", "cena": 340.00 }
        ]
      }
    ]
  </template>
</data-code-runner>
</data-gate>

### Kwerenda 2 — Agregacja średniej ceny

Oblicz średnią cenę wszystkich towarów w tabeli `towary` i nadaj kolumnie wynikowej alias `srednia_cena`.

<data-gate>
<data-code-runner language="sql" title="INF.03 Kwerenda 2: Funkcja agregująca AVG">
  <template data-type="code">
-- Kwerenda 2: średnia cena jako srednia_cena
SELECT 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "kw2-avg",
        "text": "Użyto funkcji AVG(cena) z aliasem srednia_cena",
        "type": "regex",
        "pattern": "AVG\\s*\\(\\s*cena\\s*\\)\\s+AS\\s+srednia_cena"
      },
      {
        "id": "kw2-exec",
        "text": "Zwrócono poprawną średnią cenę 223.75",
        "type": "sql-execute",
        "schema": "CREATE TABLE towary (id INT PRIMARY KEY, nazwa TEXT, kategoria TEXT, cena REAL, stan INT); INSERT INTO towary VALUES (1, 'Wiertarka udarowa', 'Narzędzia', 340.00, 15), (2, 'Zestaw kluczy', 'Narzędzia', 180.00, 40), (3, 'Farba biała', 'Malarstwo', 85.00, 60), (4, 'Drabina', 'Budownictwo', 290.00, 8);",
        "expectedCount": 1,
        "expectedColumns": ["srednia_cena"],
        "expectedRows": [
          { "srednia_cena": 223.75 }
        ]
      }
    ]
  </template>
</data-code-runner>
</data-gate>

### Kwerenda 3 — Aktualizacja stanu magazynowego

Zwiększ `stan` magazynowy towaru o `id = 4` (`Drabina`) do wartości `20` poleceniem `UPDATE`.

<data-gate>
<data-code-runner language="sql" title="INF.03 Kwerenda 3: Modyfikacja UPDATE">
  <template data-type="code">
-- Kwerenda 3: ustaw stan = 20 dla id = 4
UPDATE 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "kw3-where",
        "text": "Użyto klauzuli WHERE ograniczającej aktualizację do konkretnego rekordu",
        "type": "regex",
        "pattern": "\\bWHERE\\b"
      },
      {
        "id": "kw3-exec",
        "text": "Stan towaru id = 4 wynosi teraz dokładnie 20",
        "type": "sql-execute",
        "schema": "CREATE TABLE towary (id INT PRIMARY KEY, nazwa TEXT, kategoria TEXT, cena REAL, stan INT); INSERT INTO towary VALUES (1, 'Wiertarka udarowa', 'Narzędzia', 340.00, 15), (4, 'Drabina', 'Budownictwo', 290.00, 8);",
        "expectedCount": 0,
        "assertQuery": "SELECT stan FROM towary WHERE id = 4;",
        "assertExpected": "20",
        "assertMessage": "Stan towaru o id = 4 powinien wynosić 20"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

### Kwerenda 4 — Użytkownik i uprawnienia DCL

Utwórz lokalne konto `'magazynier'@'localhost'` z hasłem `'Hurtownia#2025'` i nadaj mu wyłącznie uprawnienia `SELECT` oraz `UPDATE` do tabeli `hurtownia.towary`.

<data-gate>
<data-code-runner language="sql" title="INF.03 Kwerenda 4: CREATE USER i GRANT">
  <template data-type="code">
-- Kwerenda 4: utwórz konto 'magazynier'@'localhost' i nadaj SELECT, UPDATE na hurtownia.towary
CREATE USER 
  </template>
  <template data-type="requirements">
    [
      {
        "id": "kw4-user",
        "text": "Utworzono konto 'magazynier'@'localhost' z hasłem",
        "type": "regex",
        "pattern": "CREATE\\s+USER\\s+['\"]magazynier['\"]\\s*@\\s*['\"]localhost['\"]\\s+IDENTIFIED\\s+BY\\s+['\"][^'\"]+['\"]"
      },
      {
        "id": "kw4-grant",
        "text": "Nadano wyłącznie uprawnienia SELECT i UPDATE do hurtownia.towary",
        "type": "regex",
        "pattern": "GRANT\\s+(?:SELECT\\s*,\\s*UPDATE|UPDATE\\s*,\\s*SELECT)\\s+ON\\s+hurtownia\\.towary\\s+TO\\s+['\"]magazynier['\"]\\s*@\\s*['\"]localhost['\"]"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## Etap 2: Struktura semantyczna HTML i układ CSS

Zbuduj szkielet strony hurtowni: nagłówek `<header>`, sekcję główną `<main>` z dwiema sekcjami `<section id="lewy">` oraz `<section id="prawy">`, a na dole stopkę `<footer>`.

<data-gate>
<data-code-runner language="html" title="INF.03 Etap 2: Semantyczny szkielet HTML">
  <template data-type="code">
<!-- Zbuduj semantyczny szkielet: header, main (section#lewy + section#prawy), footer -->
<header>
  <h1>Hurtownia Narzędzi</h1>
</header>
  </template>
  <template data-type="requirements">
    [
      {
        "id": "html-header",
        "text": "Zastosowano znacznik semantyczny <header>",
        "type": "regex",
        "pattern": "<header\\b[^>]*>[\\s\\S]*</header>"
      },
      {
        "id": "html-main",
        "text": "Zastosowano znacznik semantyczny <main>",
        "type": "regex",
        "pattern": "<main\\b[^>]*>[\\s\\S]*</main>"
      },
      {
        "id": "html-sections",
        "text": "Utworzono sekcje z wymaganymi identyfikatorami id=\"lewy\" oraz id=\"prawy\"",
        "type": "regex",
        "pattern": "id\\s*=\\s*['\"]lewy['\"][\\s\\S]*id\\s*=\\s*['\"]prawy['\"]"
      },
      {
        "id": "html-footer",
        "text": "Zastosowano znacznik semantyczny <footer>",
        "type": "regex",
        "pattern": "<footer\\b[^>]*>[\\s\\S]*</footer>"
      }
    ]
  </template>
</data-code-runner>
</data-gate>

---

## Etap 3: Skrypt JavaScript (DOM, `querySelectorAll`, `forEach` i event)

Oprogramuj kliknięcie przycisku `#btn-policz`: pobierz wszystkie zaznaczone pola `.produkt-chk`, zsumuj ich atrybuty `data-cena` za pomocą `forEach` i funkcji strzałkowej, a wynik wpisz w `#wynik` w formacie `Suma: XX zł`.

<data-gate>
<data-code-runner language="javascript" sandbox="dom" title="INF.03 Etap 3: Sumator koszyka na żywym DOM">
  <template data-type="html">
<div class="kalkulator-demo">
  <label><input type="checkbox" class="produkt-chk" data-cena="180" checked> Zestaw kluczy (180 zł)</label><br>
  <label><input type="checkbox" class="produkt-chk" data-cena="340" checked> Wiertarka udarowa (340 zł)</label><br>
  <label><input type="checkbox" class="produkt-chk" data-cena="85"> Farba biała (85 zł)</label><br>
  <button id="btn-policz" type="button">Policz sumę</button>
  <p id="wynik">Suma: 0 zł</p>
</div>
  </template>
  <template data-type="code">
const przycisk = document.querySelector('#btn-policz');
const wynik = document.querySelector('#wynik');

// TODO: podepnij addEventListener('click', () => { ... })
// użyj document.querySelectorAll('.produkt-chk') oraz forEach
  </template>
  <template data-type="requirements">
    [
      {
        "id": "js-qsall",
        "text": "Pobrano listę pól metodą document.querySelectorAll",
        "type": "regex",
        "pattern": "document\\.querySelectorAll\\s*\\("
      },
      {
        "id": "js-foreach",
        "text": "Przeiterowano elementy metodą .forEach z funkcją strzałkową =>",
        "type": "regex",
        "pattern": "\\.forEach\\s*\\([^)]*=>"
      },
      {
        "id": "js-event",
        "text": "Zarejestrowano obsługę kliknięcia przez addEventListener('click', ...)",
        "type": "regex",
        "pattern": "addEventListener\\s*\\(\\s*['\"]click['\"]"
      }
    ]
  </template>
</data-code-runner>
</data-gate>
