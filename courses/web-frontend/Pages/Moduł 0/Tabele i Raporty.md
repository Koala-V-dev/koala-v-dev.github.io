# Tabele i Raporty

Do tej pory budowałeś dokument jako ciąg nagłówków, akapitów, list, linków, sekcji i mediów.

To wystarcza dla artykułu, katalogu linków albo prostej strony informacyjnej. W realnych serwisach szybko trafisz jednak na dane, które mają układ porównawczy.

Wtedy nie walcz z listą ani z akapitami. Użyj tabeli.

Najważniejsza zasada tej lekcji brzmi: <strong>**tabela służy do danych tabelarycznych, a nie do układania wyglądu strony**</strong>. Tak jak to robiono w zamierzchłych czasach.

---

## 🧾 Kiedy tabela ma sens?

Tabela jest dobra wtedy, gdy relacja między informacjami wynika z przecięcia wiersza i kolumny.

Jeżeli możesz naturalnie powiedzieć: „w tym wierszu mam konkretny obiekt, a w tej kolumnie jego cechę”, to prawdopodobnie potrzebujesz tabeli.

Przykłady:

- raport wyników egzaminu,
- cennik pakietów,
- lista zamówień,
- porównanie formatów plików,
- harmonogram zajęć,
- zestawienie dostępności funkcji w przeglądarkach.

Nie każda powtarzalna informacja jest tabelą.

Jeżeli opisujesz kilka cech jednego obiektu, często lepsza będzie lista definicji albo zwykła sekcja z nagłówkami. Jeżeli prezentujesz zestaw kart produktów, tabela zwykle będzie zła, bo najważniejsza relacja nie wynika z przecięcia wiersza i kolumny. Jeżeli pokazujesz kolejność działań, lepsza będzie lista uporządkowana.

<strong>**Tabela ma sens wtedy, gdy użytkownik ma porównywać dane w dwóch kierunkach: poziomo i pionowo**</strong>.

Nie używaj tabeli do robienia kolumn strony, sidebarów, kart produktów ani układu wizualnego. To historyczna praktyka z czasów przed CSS. Działała wizualnie, ale niszczyła sens dokumentu.

```html
<!-- ŹLE: tabela udaje layout strony -->
<table>
    <tr>
        <td>Menu</td>
        <td>Treść artykułu</td>
        <td>Reklama</td>
    </tr>
</table>
```

Taki zapis mówi maszynom: „to są dane do porównywania”. A w rzeczywistości są to obszary układu strony. Dla czytnika ekranu, robota indeksującego i przyszłego parsera AI to fałszywy sygnał.

---

## 🧱 Podstawowa struktura tabeli

Minimalna tabela składa się z trzech elementów:

- `<table>`: kontener całej tabeli.
- `<tr>` (*table row*): wiersz tabeli.
- `<td>` (*table data*): zwykła komórka danych.

> Domyślnie tabela wyświetla się bez obramowania. Aby zbliżyć się do standardowego wyglądu tabeli można dodać `border="1"`.

```html
<table border="1">
    <tr>
        <td>Nazwa</td>
        <td>Status</td>
    </tr>
    <tr>
        <td>index.html</td>
        <td>Gotowy</td>
    </tr>
</table>
```

Ten kod wyświetli tabelę, ale semantycznie jest jeszcze zbyt ubogi. Maszyny nie wiedzą, czy pierwszy wiersz jest nagłówkiem, czy zwykłymi danymi.

W raporcie technicznym to za mało.
## 🔲 Nagłówki tabeli: <code>&lt;th&gt;</code>

Tag `<th>` (*table header*) oznacza komórkę nagłówkową. To ona mówi maszynom i przeglądarkom, jak interpretować komórki danych w tej samej kolumnie lub w tym samym wierszu.

Domyślnie tekst w komórce `<th>` wyświetla się jako pogrubiony i wyśrodkowany. Zastępując odpowiednie tagi `<td>` znacznikiem `<th>`, nadajesz tabeli właściwą strukturę:

```html
<table border="1">
    <tr>
        <th>Nazwa pliku</th>
        <th>Status</th>
        <th>Uwagi</th>
    </tr>
    <tr>
        <th>index.html</th>
        <td>Gotowy</td>
        <td>Strona główna projektu</td>
    </tr>
</table>
```

W tym przykładzie pierwszy wiersz zawiera nagłówki kolumn, natomiast w drugim wierszu komórka `index.html` jest nagłówkiem wiersza (dzięki użyciu `<th>` zamiast `<td>`). Pozostałe komórki opisują jej właściwości.

---

## 🏷️ Tytuł tabeli: <code>&lt;caption&gt;</code>

Tabela powinna mieć własny tytuł. Do tego służy tag `<caption>`.

`<caption>` umieszczasz bezpośrednio po otwierającym tagu `<table>`.

```html
<table border="1">
    <caption>Raport plików projektu HTML</caption>
    <tr>
        <th>Plik</th>
        <th>Rola</th>
        <th>Status</th>
    </tr>
    <tr>
        <th>index.html</th>
        <td>Strona główna</td>
        <td>Gotowy</td>
    </tr>
</table>
```

`<caption>` nie jest ozdobnym nagłówkiem nad tabelą. To semantyczna nazwa całej struktury.

Dla człowieka jest podpisem. Dla czytnika ekranu, ekstraktora treści i LLM-a jest informacją: „ta tabela dotyczy raportu plików projektu”.

> [!NOTE]
> Jeżeli tabela występuje bezpośrednio pod nagłówkiem sekcji, nadal warto dodać `<caption>`, gdy tabela ma być samodzielnie zrozumiała.
> <strong>Nagłówek sekcji opisuje fragment artykułu, natomiast `<caption>` opisuje konkretną tabelę.</strong>

---

## 🧩 Grupowanie tabeli: <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;tfoot&gt;</code>

W większych tabelach warto rozdzielić części tabeli na logiczne grupy.

- `<thead>`: część nagłówkowa.
- `<tbody>`: główne dane.
- `<tfoot>`: podsumowanie, suma, średnia albo wniosek.

```html
<table border="1">
    <caption>Raport wyników walidacji HTML</caption>

    <thead>
        <tr>
            <th>Plik</th>
            <th>Błędy</th>
            <th>Ostrzeżenia</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <th>index.html</th>
            <td>0</td>
            <td>1</td>
        </tr>
        <tr>
            <th>artykul.html</th>
            <td>2</td>
            <td>0</td>
        </tr>
    </tbody>

    <tfoot>
        <tr>
            <th>Razem</th>
            <td>2</td>
            <td>1</td>
        </tr>
    </tfoot>
</table>
```

Taki zapis jest dłuższy, ale czytelniejszy. Maszyna widzi, gdzie są etykiety, gdzie dane, a gdzie podsumowanie.

To ma znaczenie dla:

- czytników ekranu,
- automatycznego eksportu danych,
- indeksowania treści,
- przyszłych narzędzi AI analizujących raporty na stronie.

---

## ♿ Tabela dostępna w praktyce

Tabela staje się problemem, gdy użytkownik nie widzi całego układu naraz.

Osoba widząca może przesunąć wzrok z komórki do nagłówka kolumny. Czytnik ekranu czyta liniowo. Potrzebuje struktury zapisanej w kodzie.

Dlatego te trzy decyzje są kluczowe:

1. Dodaj `<caption>`, aby nazwać tabelę.
2. Używaj `<th>`, aby oznaczać nagłówki.
3. Zacznij od wdrożenia poprawnych znaczników `<th>` w prostych tabelach. Atrybut `scope` dodawaj wtedy, gdy chcesz jawnie doprecyzować relację nagłówka z kolumną lub wierszem.

```html
<table border="1">
    <caption>Porównanie sposobów osadzania mediów</caption>
    <thead>
        <tr>
            <th scope="col">Element</th>
            <th scope="col">Zastosowanie</th>
            <th scope="col">Wymagany opis</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">&lt;img&gt;</th>
            <td>Obraz</td>
            <td>alt</td>
        </tr>
        <tr>
            <th scope="row">&lt;iframe&gt;</th>
            <td>Osadzona strona</td>
            <td>title</td>
        </tr>
    </tbody>
</table>
```

> [!WARNING]
> Nie zostawiaj tabeli bez nagłówków tylko dlatego, że wizualnie „widać, o co chodzi”.
> W kodzie nie ma wzroku. Jest struktura.

---

## 🔤 Encje HTML w komórkach tabeli

Możesz chcieć pokazać nazwę znacznika jako tekst: `<img>`, `<iframe>`, `<main>`, `<nav>`. Problem polega na tym, że znaki `<` i `>` mają w HTML-u specjalne znaczenie. Otwierają i zamykają tagi.

Jeżeli wpiszesz w komórce tabeli surowe `<iframe>`, przeglądarka może potraktować to jako próbę utworzenia prawdziwego elementu `<iframe>`, a nie jako tekst do pokazania odbiorcy.

Dlatego w treści HTML zapisujesz znaki specjalne jako **encje**:

- `&lt;` oznacza znak `<`,
- `&gt;` oznacza znak `>`,
- `&amp;` oznacza znak `&`,
- `&copy;` oznacza znak `©`.

```html
<table border="1">
    <caption>Elementy wymagające opisu</caption>
    <tr>
        <th scope="col">Element</th>
        <th scope="col">Atrybut opisujący</th>
    </tr>
    <tr>
        <th scope="row">&lt;img&gt;</th>
        <td>alt</td>
    </tr>
    <tr>
        <th scope="row">&lt;iframe&gt;</th>
        <td>title</td>
    </tr>
</table>
```

Na stronie użytkownik zobaczy tekst `<img>` i `<iframe>`, ale parser HTML nie pomyli ich z prawdziwymi tagami.

A co jeżeli chcesz pokazać encję jako tekst? 😅  
Wtedy wystarczy zastąpić ampersanta (`&`) frazą `&amp;` i dopisać resztę encji: `&lt;` → `&amp;lt;` = &amp;lt; (&lt;).

---

## 🧮 Proste i złożone tabele

Na tym etapie trzymaj się tabel prostych.

Prosta tabela ma jeden poziom nagłówków kolumn i ewentualnie jeden poziom nagłówków wierszy. Do przedstawienia takich danych wystarczą standardowe tagi `<th>` i `<td>`.

Złożona tabela ma nagłówki wielopoziomowe, scalone komórki, grupy kolumn albo wiele powiązań między nagłówkami a danymi.

W HTML istnieją do tego atrybuty `colspan`, `rowspan`, `id` i `headers`, ale łatwo zbudować nimi strukturę trudną do zrozumienia.

Przykład prostego scalenia:

```html
<table>
    <caption>Raport tygodniowy</caption>
    <tr>
        <th>Dzień</th>
        <th>Zadania</th>
        <th>Błędy</th>
    </tr>
    <tr>
        <th>Poniedziałek</th>
        <td>5</td>
        <td>1</td>
    </tr>
    <tr>
        <th>Razem</th>
        <td colspan="2">6 wpisów w raporcie</td>
    </tr>
</table>
```
> [!NOTE]
> - `colspan="2"` oznacza, że komórka zajmuje dwie kolumny.
> - `rowspan="2"` oznacza, że komórka zajmuje dwa wiersze.

Używasz tego oszczędnie. Jeżeli tabela zaczyna przypominać labirynt, często lepiej rozbić ją na dwie prostsze tabele.

---

### 🔗 Gdy tabela robi się trudniejsza: <code>scope</code> i <code>colgroup</code>

Atrybut `scope` służy do jawnego wskazania relacji między komórką nagłówkową a komórkami danych. Pomaga to urządzeniom asystującym (np. VoiceOver czy TalkBack) w odczytaniu struktury, gdy tabela staje się bardziej złożona.

Przydaje się on, gdy łączysz nagłówki wierszy i kolumn lub tworzysz grupy komórek. Wybierz wtedy jedną z czterech wartości:
- `scope="col"`: nagłówek pojedynczej kolumny,
- `scope="row"`: nagłówek pojedynczego wiersza,
- `scope="colgroup"`: nagłówek dla grupy kolumn (zdefiniowanej przez `<colgroup>`),
- `scope="rowgroup"`: nagłówek dla grupy wierszy (zdefiniowanej przez osobne `<tbody>`).

>
> Niektóre programy desktopowe (np. NVDA) dobrze radzą sobie bez niego w prostych układach. Jednak na systemach mobilnych (iOS z VoiceOver, Android z TalkBack) jawny `scope` bywa kluczowy do prawidłowego odczytywania danych.

<details>
<summary><b>🔍 Zobacz przykład zaawansowanej struktury z <code>scope</code> i <code>colgroup</code></b></summary>

W wielopoziomowych strukturach nagłówki mogą działać na kilku poziomach naraz. Poniżej zobaczysz tabelę pomiarowo-medyczną posiadającą grupy kolumn oraz grupy wierszy. W takim przypadku `scope="colgroup"` oraz `scope="rowgroup"` ma realne uzasadnienie, ale tylko wtedy, gdy grupy są faktycznie zapisane w strukturze tabeli.

Grupy kolumn tworzy `<colgroup>`. Grupy wierszy tworzą osobne sekcje `<tbody>`.

<details>
<summary><b>📄 Kod HTML zaawansowanej tabeli pomiarowo-medycznej</b></summary>

```html
<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <caption>Porównawczy raport jakości powietrza i powikłań oddechowych</caption>
    <colgroup span="1"></colgroup>
    <colgroup span="1"></colgroup>
    <colgroup span="2"></colgroup>
    <colgroup span="2"></colgroup>
    <colgroup span="2"></colgroup>
    <thead>
        <tr bgcolor="#CFD6DF">
            <th scope="col" rowspan="2">Województwo</th>
            <th scope="col" rowspan="2">Pora roku</th>
            <th scope="colgroup" colspan="2">Średnia PM2.5 (µg/m³)</th>
            <th scope="colgroup" colspan="2">Średnia PM10 (µg/m³)</th>
            <th scope="colgroup" colspan="2">Zarejestrowane przypadki medyczne</th>
        </tr>
        <tr bgcolor="#CFD6DF">
            <th scope="col">Rok 2024</th>
            <th scope="col">Rok 2025</th>
            <th scope="col">Rok 2024</th>
            <th scope="col">Rok 2025</th>
            <th scope="col">Ataki astmy</th>
            <th scope="col">Stany ostre POChP</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="rowgroup" rowspan="2">Mazowieckie</th>
            <th scope="row">Zima</th>
            <td align="right">42</td>
            <td align="right">38</td>
            <td align="right">68</td>
            <td align="right">58</td>
            <td align="right">124</td>
            <td align="right">340</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Lato</th>
            <td align="right">12</td>
            <td align="right">10</td>
            <td align="right">22</td>
            <td align="right">18</td>
            <td align="right">15</td>
            <td align="right">45</td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <th scope="rowgroup" rowspan="2">Śląskie</th>
            <th scope="row">Zima</th>
            <td align="right">95</td>
            <td align="right">84</td>
            <td align="right">160</td>
            <td align="right">140</td>
            <td align="right">412</td>
            <td align="right">980</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Lato</th>
            <td align="right">24</td>
            <td align="right">18</td>
            <td align="right">42</td>
            <td align="right">32</td>
            <td align="right">48</td>
            <td align="right">112</td>
        </tr>
    </tbody>
    <tfoot>
        <tr bgcolor="#CFD6DF">
            <th scope="row" colspan="2">Średnia krajowa (województwa)</th>
            <td align="right">43.25 µg/m³</td>
            <td align="right">37.5 µg/m³</td>
            <td align="right">73 µg/m³</td>
            <td align="right">62 µg/m³</td>
            <td align="right">149.75 przypadków</td>
            <td align="right">369.25 przypadków</td>
        </tr>
    </tfoot>
</table>
```

</details>

<details>
<summary><b>🖥️ Render zaawansowanej tabeli pomiarowo-medycznej</b></summary>

<div class="native-html-preview">
<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <caption>Porównawczy raport jakości powietrza i powikłań oddechowych</caption>
    <colgroup span="1"></colgroup>
    <colgroup span="1"></colgroup>
    <colgroup span="2"></colgroup>
    <colgroup span="2"></colgroup>
    <colgroup span="2"></colgroup>
    <thead>
        <tr bgcolor="#CFD6DF">
            <th scope="col" rowspan="2">Województwo</th>
            <th scope="col" rowspan="2">Pora roku</th>
            <th scope="colgroup" colspan="2">Średnia PM2.5 (µg/m³)</th>
            <th scope="colgroup" colspan="2">Średnia PM10 (µg/m³)</th>
            <th scope="colgroup" colspan="2">Zarejestrowane przypadki medyczne</th>
        </tr>
        <tr bgcolor="#CFD6DF">
            <th scope="col">Rok 2024</th>
            <th scope="col">Rok 2025</th>
            <th scope="col">Rok 2024</th>
            <th scope="col">Rok 2025</th>
            <th scope="col">Ataki astmy</th>
            <th scope="col">Stany ostre POChP</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="rowgroup" rowspan="2">Mazowieckie</th>
            <th scope="row">Zima</th>
            <td align="right">42</td>
            <td align="right">38</td>
            <td align="right">68</td>
            <td align="right">58</td>
            <td align="right">124</td>
            <td align="right">340</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Lato</th>
            <td align="right">12</td>
            <td align="right">10</td>
            <td align="right">22</td>
            <td align="right">18</td>
            <td align="right">15</td>
            <td align="right">45</td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <th scope="rowgroup" rowspan="2">Śląskie</th>
            <th scope="row">Zima</th>
            <td align="right">95</td>
            <td align="right">84</td>
            <td align="right">160</td>
            <td align="right">140</td>
            <td align="right">412</td>
            <td align="right">980</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Lato</th>
            <td align="right">24</td>
            <td align="right">18</td>
            <td align="right">42</td>
            <td align="right">32</td>
            <td align="right">48</td>
            <td align="right">112</td>
        </tr>
    </tbody>
    <tfoot>
        <tr bgcolor="#CFD6DF">
            <th scope="row" colspan="2">Średnia krajowa (województwa)</th>
            <td align="right">43.25 µg/m³</td>
            <td align="right">37.5 µg/m³</td>
            <td align="right">73 µg/m³</td>
            <td align="right">62 µg/m³</td>
            <td align="right">149.75 przypadków</td>
            <td align="right">369.25 przypadków</td>
        </tr>
    </tfoot>
</table>
</div>

</details>

</details>

---

### 🔗 Ręczne powiązanie: <code>id</code> i <code>headers</code>

Czasami tabele są skrajnie złożone. Ich nagłówki bywają wielopoziomowe i nie układają się w proste rzędy czy kolumny. Wtedy sam atrybut `scope` nie wystarczy. W takich sytuacjach stosuje się bezpośrednie powiązanie komórek z nagłówkami za pomocą atrybutów `id` oraz `headers`.

Zasada działania jest prosta:
1. Każdej komórce nagłówkowej `<th>` nadajesz unikalny identyfikator w atrybucie `id`.
2. Każdej komórce danych `<td>` (lub podnagłówkowi) przypisujesz atrybut `headers`, w którym wymieniasz (rozdzielone spacją) identyfikatory wszystkich nagłówków, które się do niej odnoszą.

```html
<table>
    <caption>Plan zajęć z podziałem na sale i grupy</caption>
    <thead>
        <tr>
            <th id="h-dzien">Dzień</th>
            <th id="h-sala1" colspan="2">Sala A</th>
            <th id="h-sala2" colspan="2">Sala B</th>
        </tr>
        <tr>
            <th id="h-godz" headers="h-dzien">Godzina</th>
            <th id="h-g1" headers="h-sala1">Grupa 1</th>
            <th id="h-g2" headers="h-sala1">Grupa 2</th>
            <th id="h-g3" headers="h-sala2">Grupa 1</th>
            <th id="h-g4" headers="h-sala2">Grupa 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th id="r-pn" headers="h-dzien h-godz">Poniedziałek 09:00</th>
            <td headers="h-sala1 h-g1 r-pn">Projektowanie UI</td>
            <td headers="h-sala1 h-g2 r-pn">Programowanie JS</td>
            <td headers="h-sala2 h-g3 r-pn">Bazy danych</td>
            <td headers="h-sala2 h-g4 r-pn">Wolne 🤙🏼</td>
        </tr>
    </tbody>
</table>
```

> [!NOTE]
> Ta metoda wymaga ręcznego wpisywania wielu identyfikatorów. Przez to kod staje się obszerny i trudniejszy w utrzymaniu. Używaj jej tylko w skomplikowanych tabelach, gdy standardowe `scope` nie pozwala na czytelne powiązanie danych z nagłówkiem.

---

## 🎨 Warstwa prezentacji przed CSS

<strong class="tag-stamp tag-stamp--dead">Etap przejściowy (legacy HTML)</strong>

Dawniej HTML odpowiadał także za wygląd strony. W starych tabelach zobaczysz więc atrybuty prezentacyjne. Dzisiaj to zła praktyka. Jeśli musisz szybko ostylować element bez CSS, używaj `style=""`. To też miesza treść z wyglądem, ale jest nowocześniejsze niż stare atrybuty.

Dlaczego o tym wspominam?
Te stare rozwiązania:
- pozwalają łatwo zobaczyć tabelę, zanim poznasz CSS
- pokazują historyczną ewolucję HTML-a

Najprostsza pomoc wizualna to `border="1"`:

```html
<table border="1">
    <caption>Raport plików projektu</caption>
    <tr>
        <th scope="col">Plik</th>
        <th scope="col">Status</th>
    </tr>
    <tr>
        <th scope="row">index.html</th>
        <td>Gotowy</td>
    </tr>
</table>
```

Potem możesz dodać podstawowe odstępy i kolor tła nagłówka:

```html
<table border="1" cellpadding="6" cellspacing="0">
    <caption>Raport dostępności elementów HTML</caption>
    <tr bgcolor="#CFD6DF">
        <th scope="col">Element</th>
        <th scope="col">Opis wymagany?</th>
        <th scope="col">Atrybut</th>
    </tr>
    <tr>
        <th scope="row">&lt;img&gt;</th>
        <td>Tak</td>
        <td>alt</td>
    </tr>
    <tr bgcolor="#E1E1E1">
        <th scope="row">&lt;iframe&gt;</th>
        <td>Tak</td>
        <td>title</td>
    </tr>
</table>
```

Najważniejsze atrybuty tej przejściowej warstwy:

- `border="1"`: pokazuje obramowanie tabeli i komórek,
- `cellpadding="6"`: dodaje odstęp między tekstem a krawędzią komórki,
- `cellspacing="0"`: usuwa odstęp między komórkami,
- `bgcolor="#CFD6DF"`: ustawia kolor tła wiersza albo komórki,
- `width="100%"`: rozciąga tabelę na dostępną szerokość,
- `align="center"`: wyrównuje zawartość komórki lub tabelę w starszych dokumentach.

> [!IMPORTANT]
> To jest warstwa przejściowa, nie docelowy wzorzec. HTML ma opisać strukturę danych. CSS przejmie wygląd. Atrybuty takie jak `bgcolor` warto rozumieć, ale nie warto budować na nich nowego systemu stylowania.

---

## 🧪 Przykład: Kompleksowy raport w HTML

Aby lepiej zobrazować, jak połączyć semantykę tabeli z tradycyjnym formatowaniem, przygotowałem poniższy przykład. Zwróć uwagę na zastosowanie grup wierszy, nagłówków oraz atrybutów prezentacyjnych.

Oto kod kompletnej tabeli z raportem jakości powietrza:

```html
<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <caption>Bieżący raport jakości powietrza i stężeń pyłów zawieszonych</caption>
    <thead>
        <tr bgcolor="#98D3FF">
            <th scope="col">Stacja pomiarowa</th>
            <th scope="col">Pył PM2.5 (µg/m³)</th>
            <th scope="col">Pył PM10 (µg/m³)</th>
            <th scope="col">Tlenek węgla CO (mg/m³)</th>
            <th scope="col">Indeks AQI</th>
            <th scope="col">Zalecenie medyczne</th>
        </tr>
    </thead>
    <tbody>
        <tr bgcolor="#FFFFFF">
            <th scope="row">Warszawa-Ursynów</th>
            <td align="right">12</td>
            <td align="right">22</td>
            <td align="right">0.3</td>
            <td bgcolor="#93F179" align="center">24 (Dobry)</td>
            <td>Powietrze czyste, brak obostrzeń</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Katowice-Koszutka</th>
            <td align="right">38</td>
            <td align="right">58</td>
            <td align="right">0.8</td>
            <td bgcolor="#EADA90" align="center">84 (Umiarkowany)</td>
            <td>Osoby wrażliwe powinny ograniczyć wysiłek</td>
        </tr>
        <tr bgcolor="#FFFFFF">
            <th scope="row">Kraków-Krasińskiego</th>
            <td align="right">72</td>
            <td align="right">115</td>
            <td align="right">1.6</td>
            <td bgcolor="#DD8585" align="center">152 (Zły)</td>
            <td>Ogranicz przebywanie i wysiłek na zewnątrz</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Rybnik-Borki</th>
            <td align="right">145</td>
            <td align="right">230</td>
            <td align="right">2.9</td>
            <td bgcolor="#B999BE" align="center">204 (Bardzo zły)</td>
            <td>Pozostań w domu i włącz oczyszczacz powietrza</td>
        </tr>
    </tbody>
    <tfoot>
        <tr bgcolor="#CFD6DF">
            <th scope="row" colspan="2">Średnia pomiarowa (województwa)</th>
            <td align="right">66.75 µg/m³</td>
            <td align="right">106.25 µg/m³</td>
            <td align="right">1.4 mg/m³</td>
            <td align="center">Status: ostrzegawczy</td>
        </tr>
    </tfoot>
</table>
```

A oto jak ta tabela wygląda po wyrenderowaniu w przeglądarce:

<div class="native-html-preview">
<table border="1" cellpadding="8" cellspacing="0" width="100%">
    <caption>Bieżący raport jakości powietrza i stężeń pyłów zawieszonych</caption>
    <thead>
        <tr bgcolor="#98D3FF">
            <th scope="col">Stacja pomiarowa</th>
            <th scope="col">Pył PM2.5 (µg/m³)</th>
            <th scope="col">Pył PM10 (µg/m³)</th>
            <th scope="col">Tlenek węgla CO (mg/m³)</th>
            <th scope="col">Indeks AQI</th>
            <th scope="col">Zalecenie medyczne</th>
        </tr>
    </thead>
    <tbody>
        <tr bgcolor="#FFFFFF">
            <th scope="row">Warszawa-Ursynów</th>
            <td align="right">12</td>
            <td align="right">22</td>
            <td align="right">0.3</td>
            <td bgcolor="#93F179" align="center">24 (Dobry)</td>
            <td>Powietrze czyste, brak obostrzeń</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Katowice-Koszutka</th>
            <td align="right">38</td>
            <td align="right">58</td>
            <td align="right">0.8</td>
            <td bgcolor="#EADA90" align="center">84 (Umiarkowany)</td>
            <td>Osoby wrażliwe powinny ograniczyć wysiłek</td>
        </tr>
        <tr bgcolor="#FFFFFF">
            <th scope="row">Kraków-Krasińskiego</th>
            <td align="right">72</td>
            <td align="right">115</td>
            <td align="right">1.6</td>
            <td bgcolor="#DD8585" align="center">152 (Zły)</td>
            <td>Ogranicz przebywanie i wysiłek na zewnątrz</td>
        </tr>
        <tr bgcolor="#E1E1E1">
            <th scope="row">Rybnik-Borki</th>
            <td align="right">145</td>
            <td align="right">230</td>
            <td align="right">2.9</td>
            <td bgcolor="#B999BE" align="center">204 (Bardzo zły)</td>
            <td>Pozostań w domu i włącz oczyszczacz powietrza</td>
        </tr>
    </tbody>
    <tfoot>
        <tr bgcolor="#CFD6DF">
            <th scope="row" colspan="2">Średnia pomiarowa (województwa)</th>
            <td align="right">66.75 µg/m³</td>
            <td align="right">106.25 µg/m³</td>
            <td align="right">1.4 mg/m³</td>
            <td align="center">Status: ostrzegawczy</td>
        </tr>
    </tfoot>
</table>
</div>

W tym przykładzie:
- **Semantyka**: Zastosowałem znaczniki `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th>` oraz `scope`. Dzięki temu struktura jest w pełni dostępna dla czytników ekranu.
- **Prezentacja**: Wykorzystałem atrybuty `border`, `cellpadding`, `cellspacing` oraz `bgcolor`. Określają one wygląd tabeli przed wprowadzeniem arkuszy stylów CSS.

---

<data-gate>
  <data-quiz>
    <question>Który zestaw elementów najlepiej opisuje dostępną tabelę z raportem danych?</question>
    <options>
      <item><code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;td&gt;</code> oraz dużo tekstu w pierwszym wierszu bez nagłówków.</item>
      <item correct><code>&lt;caption&gt;</code>, poprawne <code>&lt;th&gt;</code>, logiczne grupy wierszy oraz dane, które naprawdę tworzą relację wierszy i kolumn.</item>
      <item><code>&lt;div&gt;</code>, <code>&lt;span&gt;</code> i ręcznie wpisane odstępy, aby kolumny wyglądały równo.</item>
      <item><code>&lt;table&gt;</code> użyta do podzielenia strony na menu, treść i stopkę.</item>
    </options>
    <div data-hint="error">Pamiętaj, że dostępna tabela musi nazwać siebie i pokazać relację nagłówków z danymi.</div>
    <div data-hint="success">Dokładnie. <code>&lt;caption&gt;</code>, <code>&lt;th&gt;</code> i logiczne grupy tabeli tworzą strukturę czytelną dla człowieka, czytnika ekranu i maszyn. <code>scope</code> doprecyzowuje relacje wtedy, gdy tabela robi się trudniejsza.</div>
  </data-quiz>
</data-gate>

---

<data-gate>
  <data-connection-matcher title="Połącz element tabeli z jego rolą semantyczną:">
    <div class="cmw-item" data-left="`&amp;lt;caption&amp;gt;`" data-right="Nazwa lub opis całej tabeli"></div>
    <div class="cmw-item" data-left="`&amp;lt;th&amp;gt;`" data-right="Komórka nagłówkowa opisująca kolumnę albo wiersz"></div>
    <div class="cmw-item" data-left="`scope`" data-right="Doprecyzowanie relacji nagłówka z trudniejszą tabelą"></div>
    <div class="cmw-item" data-left="`&amp;lt;tfoot&amp;gt;`" data-right="Podsumowanie tabeli, np. suma lub wniosek"></div>
  </data-connection-matcher>
</data-gate>

---

Jeśli piszesz własny dokument równolegle z lekcją, nie zaczynaj od pytania „jak zrobić tabelkę?”. Zacznij od pytania, czy dane naprawdę tworzą raport.

Sprawdź:

- czy tabela pokazuje dane, a nie układ strony,
- czy każdy wiersz ma jeden jasny temat,
- czy każda kolumna opisuje jedną cechę,
- czy tabela ma `<caption>`,
- czy nagłówki są zapisane jako `<th>`,
- czy `scope` jest potrzebny, bo tabela ma nagłówki w obu kierunkach albo grupy danych,
- czy historyczne atrybuty wyglądu są użyte świadomie, a nie jako zamiennik CSS.

To jest dobry nawyk. Najpierw sprawdzasz sens danych. Dopiero potem wybierasz znaczniki.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Tabela jest dla danych**: Używaj `<table>` wtedy, gdy informacje tworzą relację wierszy i kolumn.
- **`<caption>` nazywa tabelę**: To semantyczny podpis całej struktury, ważny dla ludzi, czytników ekranu i parserów.
- **`<th>` opisuje dane**: Nagłówki kolumn i wierszy zapisuj jako `<th>`, nie jako pogrubione `<td>`.
- **`scope` jest narzędziem sytuacyjnym**: W prostych tabelach często wystarczy `<th>`. Przy trudniejszych raportach `scope="col"`, `scope="row"`, `scope="colgroup"` i `scope="rowgroup"` doprecyzowują relacje.
- **Trudne tabele sprawdzaj u źródła**: Gdy będziesz chciał utworzyć niestandardową strukturę tabeli, sięgnij po [WAI Tables Tutorial](https://www.w3.org/WAI/tutorials/tables/). Zobaczysz tam, co w aktualnych standardach warto dodać, a co możesz pominąć, na przykład `scope` w prostych tabelach.
- **Raport wymaga decyzji**: Tabela jest dobra, gdy chcesz porównywać dane między wierszami i kolumnami. Lista, karta albo opis mogą być lepsze dla innych typów informacji.
- **`border` i `bgcolor` to etap przejściowy**: Pomagają zobaczyć tabelę w surowym HTML-u, ale właściwe stylowanie tabel przeniesie później CSS.
- **Tabele nie są layoutem**: Układ strony budujesz semantycznymi kontenerami HTML, a później CSS-em, nie tabelą udającą siatkę.
