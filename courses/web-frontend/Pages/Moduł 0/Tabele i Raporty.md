# Tabele i Raporty

Masz opublikować zestawienie czterech planów abonamentowych z ceną, limitem przestrzeni dyskowej i czasem reakcji wsparcia. Jeśli opiszesz te dane kolejnymi akapitami albo wypunktowaniem, odbiorca zgubi punkt odniesienia już przy drugim planie. Z drugiej strony, jeśli użyjesz tabeli do podzielenia strony na pasek boczny i treść główną, czytnik ekranu potraktuje układ strony jak raport liczbowy i całkowicie zepsuje nawigację.

Kluczowa zasada tej lekcji brzmi: **tabela służy wyłącznie do danych tabelarycznych**, czyli informacji porównywanych w dwóch kierunkach naraz: poziomo po wierszu oraz pionowo po kolumnie.

---

## 🧾 Kiedy tabela ma sens, a kiedy psuje dokument

Najprostszy test decyzyjny opiera się na relacji współrzędnych. Jeśli potrafisz naturalnie powiedzieć: „w tym wierszu znajduje się konkretny obiekt, a w tej kolumnie jego mierzalna cecha”, wybierasz `<table>`.

Tabela jest właściwym wyborem dla:

- cenników pakietów usług i porównań parametrów,
- harmonogramów zajęć, dyżurów i rozkładów jazdy,
- raportów pomiarowych, zestawień sprzedaży oraz wyników testów,
- macierzy wsparcia funkcji w różnych przeglądarkach.

Nie każda powtarzalna treść jest tabelą. Katalog kart produktów nie wymaga porównywania w ścisłych kolumnach, a lista kroków procedury opisuje kolejność, więc lepiej zapisać ją w `<ol>`. Najpoważniejszym błędem jest traktowanie tabeli jako narzędzia do budowania układu strony:

```html
<!-- ŹLE: tabela udaje układ strony -->
<table>
    <tr>
        <td>Menu nawigacyjne</td>
        <td>Główna treść artykułu</td>
        <td>Panel boczny</td>
    </tr>
</table>
```

Taki kod wysyła do przeglądarki, czytników ekranu i parserów danych **_fałszywy sygnał semantyczny_**. Za układ kolumn na stronie odpowiadają semantyczne kontenery (`<nav>`, `<main>`, `<aside>`) oraz arkusze CSS.

---

## 🧱 Anatomia nowoczesnej tabeli semantycznej

Najprostsza tabela składa się z kontenera `<table>`, wierszy `<tr>` oraz zwykłych komórek danych `<td>`. Taki zapis jednak nie wystarcza w profesjonalnym raporcie, ponieważ nie odróżnia etykiet od wartości ani nie nadaje tabeli tytułu.

Pełna, nowoczesna struktura tabeli HTML5 opiera się na pięciu elementach semantycznych:

- **`<caption>`**: oficjalny tytuł tabeli umieszczany **bezpośrednio po otwarciu** `<table>`. Czytnik ekranu odczytuje go jako nazwę całej struktury.
- **`<thead>`**: sekcja grupująca wiersze z nagłówkami kolumn.
- **`<tbody>`**: sekcja z głównymi wierszami danych.
- **`<tfoot>`**: sekcja podsumowania tabeli, na przykład sumy, średniej lub statusu zbiorczego.
- **`<th>`**: komórka nagłówkowa opisująca kolumnę albo wiersz. Zastępuje zwykłe `<td>` tam, gdzie tekst pełni rolę etykiety.

```html
<table>
    <caption>Raport wyników walidacji dokumentów HTML</caption>
    <thead>
        <tr>
            <th scope="col">Plik</th>
            <th scope="col">Błędy</th>
            <th scope="col">Ostrzeżenia</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">index.html</th>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <th scope="row">kontakt.html</th>
            <td>2</td>
            <td>0</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Razem</th>
            <td>2</td>
            <td>1</td>
        </tr>
    </tfoot>
</table>
```

### ♿ Relacje nagłówków i atrybut scope

Osoba widząca potrafi w ułamku sekundy przenieść wzrok z liczby `2` w górę do kolumny „Błędy” oraz w lewo do wiersza „kontakt.html”. Czytnik ekranu porusza się po komórkach liniowo i potrzebuje jawnego powiązania zapisanego w kodzie.

Służy do tego atrybut **`scope`** dopisywany do znacznika `<th>`:

- **`scope="col"`**: oznacza, że nagłówek dotyczy wszystkich komórek danych w tej kolumnie poniżej.
- **`scope="row"`**: oznacza, że nagłówek dotyczy wszystkich komórek danych w tym samym wierszu po prawej stronie.

> [!WARNING]
> **_Nie udawaj nagłówków pogrubionym tekstem w `<td>`._** Dla przeglądarki `<td><strong>Cena</strong></td>` pozostaje zwykłą komórką danych. Tylko znacznik `<th>` z atrybutem *scope* buduje relację odczytywaną przez technologie asystujące.

Gdy w komórce tabeli chcesz pokazać dosłowną nazwę znacznika HTML, na przykład `<img>` lub `<iframe>`, zapisuj ostre nawiasy jako **encje HTML**: `&lt;` zamiast `<`, `&gt;` zamiast `>` oraz `&amp;` zamiast `&`. Dzięki temu parser wyświetli tekst `<img>` zamiast wstawiać pusty obrazek.

<data-gate>
<data-connection-matcher title="Połącz element lub atrybut tabeli z jego funkcją semantyczną">
  <item left="`&lt;caption&gt;`" right="Semantyczny tytuł całej tabeli umieszczany bezpośrednio po otwarciu znacznika table"></item>
  <item left="`&lt;thead&gt;`" right="Sekcja grupująca wiersze z nagłówkami kolumn"></item>
  <item left="`&lt;tfoot&gt;`" right="Sekcja grupująca wiersze podsumowania, np. sumy lub średniej"></item>
  <item left="`scope=&quot;col&quot;`" right="Wskazuje, że komórka th opisuje całą kolumnę poniżej"></item>
  <item left="`scope=&quot;row&quot;`" right="Wskazuje, że komórka th opisuje cały wiersz"></item>
</data-connection-matcher>
</data-gate>

### 🧪 Ćwiczenie: Semantyczna tabela cennika

Zbuduj nowoczesną tabelę cennika pakietów hostingowych. Umieść w niej tytuł `<caption>`, trzy sekcje (`<thead>`, `<tbody>`, `<tfoot>`), co najmniej trzy nagłówki kolumn `<th scope="col">` w `<thead>`, minimum dwa pakiety z nagłówkami wierszy `<th scope="row">` w `<tbody>` oraz wiersz podsumowania z `<th scope="row">` w `<tfoot>`.

<data-gate>
<data-code-runner language="html" title="Semantyczna tabela cennika usług">
<template data-type="code">
<!-- Utwórz kompletną tabelę cennika zgodną z kryteriami po prawej -->
</template>
<template data-type="requirements">
[
  {
    "id": "table-caption",
    "type": "regex",
    "pattern": "<table\\b[^>]*>\\s*<caption>[^<]{3,}</caption>",
    "flags": "is",
    "text": "Dodaj podpis <caption> z treścią bezpośrednio wewnątrz <table>"
  },
  {
    "id": "table-sections",
    "type": "regex",
    "pattern": "<thead\\b[^>]*>[\\s\\S]*</thead>[\\s\\S]*<tbody\\b[^>]*>[\\s\\S]*</tbody>[\\s\\S]*<tfoot\\b[^>]*>[\\s\\S]*</tfoot>",
    "flags": "is",
    "text": "Wydziel w tabeli trzy sekcje: <thead>, <tbody> oraz <tfoot>"
  },
  {
    "id": "thead-col-scopes",
    "type": "regex",
    "pattern": "<thead\\b[^>]*>(?:[\\s\\S]*?<th\\b[^>]*\\bscope\\s*=\\s*[\"']col[\"'][^>]*>){3,}[\\s\\S]*</thead>",
    "flags": "is",
    "text": "Zdefiniuj w <thead> co najmniej 3 nagłówki kolumn <th scope=\"col\">"
  },
  {
    "id": "tbody-row-scopes",
    "type": "regex",
    "pattern": "<tbody\\b[^>]*>(?:[\\s\\S]*?<th\\b[^>]*\\bscope\\s*=\\s*[\"']row[\"'][^>]*>){2,}[\\s\\S]*</tbody>",
    "flags": "is",
    "text": "Dodaj w <tbody> co najmniej 2 wiersze pakietów z nagłówkami <th scope=\"row\">"
  },
  {
    "id": "tfoot-row-scope",
    "type": "regex",
    "pattern": "<tfoot\\b[^>]*>[\\s\\S]*?<th\\b[^>]*\\bscope\\s*=\\s*[\"']row[\"'][^>]*>[\\s\\S]*</tfoot>",
    "flags": "is",
    "text": "Dodaj w <tfoot> wiersz podsumowania z nagłówkiem <th scope=\"row\">"
  }
]
</template>
</data-code-runner>
</data-gate>

---

## 🧮 Scalanie komórek i bilans siatki

W raportach i harmonogramach pojedynczy wpis często obejmuje kilka kolumn (na przykład całodzienna przerwa) albo kilka sąsiednich wierszy (na przykład dwugodzinny blok warsztatów). W HTML5 odpowiadają za to dwa atrybuty na elementach `<td>` i `<th>`:

- **`colspan="N"`**: rozciąga komórkę poziomo na *N* kolumn.
- **`rowspan="N"`**: rozciąga komórkę pionowo na *N* wierszy.

Zanim napiszesz pierwszy `rowspan`, przeanalizuj poniższy kod i przewidź jego wynik w przeglądarce. Tabela ma dokładnie **3 kolumny** (Dzień, Godzina, Temat). W pierwszym wierszu `tbody` komórka „Poniedziałek” otrzymała `rowspan="2"`, ale w drugim wierszu autor z przyzwyczajenia wpisał trzy komórki:

```html
<!-- PRZEWIDŹ WYNIK: tabela ma 3 kolumny w nagłówku -->
<table>
    <thead>
        <tr>
            <th scope="col">Dzień</th>
            <th scope="col">Godzina</th>
            <th scope="col">Temat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row" rowspan="2">Poniedziałek</th>
            <td>09:00</td>
            <td>Struktura HTML</td>
        </tr>
        <tr>
            <td>Poniedziałek</td>
            <td>10:00</td>
            <td>Semantyka tabel</td>
        </tr>
    </tbody>
</table>
```

Zatrzymaj się i policz zajęte miejsca w drugim wierszu `tbody`. Co przeglądarka zrobi z komórką „Semantyka tabel”?

Mechanizm siatki działa bezlitośnie dokładnie. Komórka z `rowspan="2"` w pierwszym wierszu **rezerwuje pierwszą kolumnę również w drugim wierszu**. Oznacza to, że w drugim wierszu na nowe znaczniki zostają już tylko **2 wolne miejsca** (kolumna 2 i kolumna 3). Gdy wpiszesz tam 3 komórki, przeglądarka przesunie je w prawo i **_wypchnie ostatnią komórkę poza prawą krawędź tabeli_**, tworząc osieroconą czwartą kolumnę bez nagłówka.

> [!IMPORTANT]
> **Reguła bilansu wiersza:** Dla każdego wiersza `<tr>` suma wartości `colspan` jego komórek powiększona o liczbę aktywnych `rowspan` sięgających z wierszy wyżej musi być równa stałej liczbie kolumn tabeli. Jeśli `rowspan="2"` zajmuje 1 kolumnę z góry, bieżący wiersz ma do rozdysponowania o 1 komórkę mniej.

Poprawny zapis tego samego harmonogramu usuwa nadmiarową komórkę z drugiego wiersza i zachowuje idealny bilans 3 kolumn:

```html
<table>
    <caption>Harmonogram warsztatów poniedziałkowych</caption>
    <thead>
        <tr>
            <th scope="col">Dzień</th>
            <th scope="col">Godzina</th>
            <th scope="col">Temat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row" rowspan="2">Poniedziałek</th>
            <td>09:00</td>
            <td>Struktura HTML</td>
        </tr>
        <tr>
            <td>10:00</td>
            <td>Semantyka tabel</td>
        </tr>
        <tr>
            <th scope="row">Przerwa</th>
            <td colspan="2">11:00 do 11:30 (wspólna przerwa techniczna)</td>
        </tr>
    </tbody>
</table>
```

Sprawdź bilans w każdym wierszu `tbody`:

1. Wiersz 1: `Poniedziałek` (1) + `09:00` (1) + `Struktura HTML` (1) = **3 kolumny**.
2. Wiersz 2: zajęta z góry przez `rowspan="2"` (1) + `10:00` (1) + `Semantyka tabel` (1) = **3 kolumny**.
3. Wiersz 3: `Przerwa` (1) + `colspan="2"` (2) = **3 kolumny**.

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Algorytm siatki WHATWG §4.9.12, graf nagłówków id/headers i kaskada HTML4</span>
<span class="deep-dive-badge">WHATWG TABLE MODEL · WAI-ARIA · CSS HINTS</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak przeglądarka układa komórki w macierzy (x, y)</h4>

Zgodnie z algorytmem przetwarzania tabel (**WHATWG §4.9.12**) silnik buduje dwuwymiarową siatkę slotów `(x, y)` i utrzymuje listę aktywnych komórek z `rowspan > 1` (komórek rosnących w dół):

| Wiersz `y` | Slot `x = 0` | Slot `x = 1` | Slot `x = 2` | Slot `x = 3` (nadmiarowy!) |
| :--- | :--- | :--- | :--- | :--- |
| `y = 0` | `Poniedziałek` (`rowspan="2"`) | `09:00` | `HTML` | brak |
| `y = 1` (błędny: 3 komórki) | *zajęty z `y = 0`* | `Poniedziałek` | `10:00` | **_`Semantyka tabel` (wypchnięta poza `<thead>`)_** |

Gdy parser wchodzi w wiersz `y = 1`, widzi że slot `(0, 1)` jest już zarezerwowany przez komórkę z `y = 0`. Szuka więc pierwszego wolnego miejsca `x >= 0`, trafia na `x = 1` i przesuwa każdą kolejną komórkę o jedną kolumnę w prawo. Trzecia komórka nie mieści się w 3-kolumnowej tabeli i zmusza silnik do utworzenia anonimowej czwartej kolumny bez nagłówka.

<h4>2. Tabele wielopoziomowe: colgroup, rowgroup oraz jawny graf id i headers</h4>

Gdy raport ma wiele poziomów nagłówków (na przykład kwartały podzielone na miesiące), sam `scope="col"` nie wystarcza. Stosuje się wtedy `scope="colgroup"` / `scope="rowgroup"` albo jawny graf relacji, w którym komórka `<td>` wymienia identyfikatory wszystkich opisujących ją nagłówków:

```html
<th id="q1" colspan="2" scope="colgroup">Kwartał I</th>
<th id="sty" headers="q1">Styczeń</th>
<td headers="q1 sty">14 200 PLN</td>
```

<h4>3. Przestarzałe atrybuty prezentacyjne HTML4 w kaskadzie CSS</h4>

Historyczne atrybuty HTML4 (`border`, `cellpadding`, `cellspacing`, `bgcolor`, `align`) zostały wycofane ze standardu HTML5. Przeglądarki mapują je nadal wyłącznie dla wstecznej kompatybilności jako tzw. **presentational hints** o zerowej specyficzności `(0, 0, 0)`, dlatego dowolna reguła w arkuszu CSS natychmiast je nadpisuje.

</div>
</details>

### 🧪 Ćwiczenie: Naprawa bilansu rowspan i modernizacja harmonogramu

Poniższy 3-kolumnowy harmonogram zawiera trzy błędy: przestarzałe atrybuty HTML4 (`bgcolor`, `cellpadding`), brak podpisu `<caption>` oraz klasyczny błąd bilansu siatki po `rowspan="2"` (w drugim wierszu `<tbody>` znajduje się nadmiarowa komórka `<td>Wtorek</td>`, która wypycha salę poza tabelę).

Napraw tabelę w edytorze:
- Usuń przestarzałe atrybuty `bgcolor` i `cellpadding` oraz dodaj podpis `<caption>`.
- Usuń nadmiarową komórkę `<td>Wtorek</td>` z drugiego wiersza `<tbody>`, aby wiersz pod `rowspan="2"` zawierał dokładnie 2 komórki.
- Dopisz na końcu `<tbody>` trzeci wiersz z przerwą techniczną, w którym komórka opisu scala dwie kolumny za pomocą `colspan="2"`.

<data-gate>
<data-code-runner language="html" title="Naprawa bilansu rowspan i scalenie colspan">
<template data-type="code">
<table cellpadding="6">
  <thead>
    <tr>
      <th scope="col">Dzień</th>
      <th scope="col">Godzina</th>
      <th scope="col">Sala</th>
    </tr>
  </thead>
  <tbody>
    <tr bgcolor="#eeeeee">
      <th scope="row" rowspan="2">Wtorek</th>
      <td>08:00</td>
      <td>Pracownia 12</td>
    </tr>
    <tr>
      <td>Wtorek</td>
      <td>09:00</td>
      <td>Pracownia 14</td>
    </tr>
    <!-- Dodaj poniżej wiersz przerwy z <th scope="row"> i <td colspan="2"> -->
  </tbody>
</table>
</template>
<template data-type="requirements">
[
  {
    "id": "schedule-structure",
    "type": "regex",
    "pattern": "<table\\b[^>]*>\\s*<caption>[^<]{3,}</caption>[\\s\\S]*<thead\\b[^>]*>[\\s\\S]*</thead>[\\s\\S]*<tbody\\b[^>]*>[\\s\\S]*</tbody>",
    "flags": "is",
    "text": "Dodaj podpis <caption> wewnątrz <table> oraz zachowaj sekcje <thead> i <tbody>"
  },
  {
    "id": "schedule-rowspan-balance",
    "type": "regex",
    "pattern": "<tr\\b[^>]*>\\s*<th\\b[^>]*\\browspan\\s*=\\s*[\"']2[\"'][^>]*>[\\s\\S]*?</th>\\s*<td\\b[^>]*>[\\s\\S]*?</td>\\s*<td\\b[^>]*>[\\s\\S]*?</td>\\s*</tr>\\s*<tr\\b[^>]*>\\s*<td\\b[^>]*>[\\s\\S]*?</td>\\s*<td\\b[^>]*>[\\s\\S]*?</td>\\s*</tr>",
    "flags": "is",
    "text": "Zachowaj bilans siatki: po wierszu z rowspan=\"2\" kolejny <tr> ma dokładnie 2 komórki <td>"
  },
  {
    "id": "schedule-colspan",
    "type": "regex",
    "pattern": "<tbody\\b[^>]*>[\\s\\S]*?<tr\\b[^>]*>[\\s\\S]*?<td\\b[^>]*\\bcolspan\\s*=\\s*[\"']2[\"'][^>]*>[^<]{3,}</td>[\\s\\S]*?</tr>[\\s\\S]*</tbody>",
    "flags": "is",
    "text": "Dodaj w <tbody> wiersz z komórką scalającą dwie kolumny (<td colspan=\"2\">)"
  },
  {
    "id": "no-legacy-attrs",
    "type": "regex",
    "pattern": "^(?![\\s\\S]*\\b(?:bgcolor|cellpadding|cellspacing|align)\\s*=)",
    "flags": "i",
    "text": "Usuń przestarzałe atrybuty HTML4 (bgcolor, cellpadding, cellspacing, align)"
  }
]
</template>
</data-code-runner>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Tabela wyłącznie dla danych dwuwymiarowych**: Stosuj `<table>` tylko wtedy, gdy sens danych wynika z przecięcia wiersza i kolumny. Nigdy nie buduj tabelą układu strony.
- **Pełna semantyka HTML5**: Nazywaj tabelę przez `<caption>`, dziel ją na `<thead>`, `<tbody>` oraz `<tfoot>`, a etykiety zapisuj jako `<th>` ze wskazaniem kierunku przez `scope="col"` lub `scope="row"`.
- **Matematyka scalania komórek**: Każdy wiersz musi bilansować się do stałej liczby kolumn. Pamiętaj, że `rowspan="2"` zajmuje miejsce w kolejnym wierszu, więc wpisujesz tam odpowiednio mniej komórek.
- **Encje dla kodu w komórkach**: Gdy wyświetlasz nazwy znaczników w treści tabeli, zastępuj `<` i `>` encjami `&lt;` oraz `&gt;`, aby parser nie utworzył przypadkowego elementu DOM.
- **Czysty podział ról**: Zostaw HTML-owi strukturę i relacje danych. Przestarzałe atrybuty typu `bgcolor`, `cellpadding` czy `align` należą do historii, a za estetykę tabeli odpowiadają arkusze CSS.

> [!TIP]
> Chcesz utrwalić budowanie semantycznych raportów, cenników i harmonogramów na większej liczbie samodzielnych scenariuszy? Przejdź do sekcji [Katalog zadań praktycznych](/arkusze/?qual=INF.03&tag=HTML).
