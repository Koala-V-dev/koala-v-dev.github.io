# Pierwsza Strona HTML i Struktura Dokumentu

Znasz już drogę pliku HTML z serwera do drzewa DOM w przeglądarce. Wyobraź sobie, że tworzysz swój pierwszy projekt i zapisujesz stronę główną jako `start.html`. Wrzucasz folder na serwer, wpisujesz adres domeny i zamiast witryny widzisz błąd **_403 Forbidden_** albo publiczny spis wszystkich plików z folderu.

Dlaczego jedna nazwa pliku decyduje o działaniu i bezpieczeństwie całej strony? Czas zbudować poprawny dokument HTML5, opanować czytelną hierarchię nagłówków oraz połączyć podstrony za pomocą ścieżek względnych i zagnieżdżonych list.

---

## 📁 Dlaczego plik główny nazywa się index.html

Utwórz w edytorze VS Code nowy plik o nazwie `index.html`. Kliknij ikonę nowego pliku w pasku bocznym po lewej stronie. Jeśli panel boczny jest schowany, otworzysz go skrótem <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>.

![Wycinek z VS Code demonstrujący utworzenie nowego pliku](/public/courses/web-frontend/Images/nowy-plik-index-html.png)

Kiedy wpisujesz w przeglądarce sam adres domeny, na przykład `https://example.com`, nie podajesz na końcu nazwy konkretnego pliku. Serwer musi sam zdecydować, który dokument odesłać w odpowiedzi.

Proces po stronie serwera przebiega w trzech krokach:
1. Serwer otwiera główny folder przypisany do domeny `example.com`.
2. Szuka w tym folderze pliku o domyślnej nazwie **index.html**.
3. Odsyła ten plik z kodem `200 OK` jako stronę startową witryny.

Jeśli w folderze brakuje pliku `index.html`, serwer nie wie, co wyświetlić. W zależności od konfiguracji zwraca wtedy błąd **_403 Forbidden_** (brak dostępu) lub **_404 Not Found_**.

W słabiej zabezpieczonych konfiguracjach serwer generuje automatyczny spis całej zawartości katalogu (tzw. Directory Listing). Poniższy zrzut ekranu pokazuje skutek takiej luki: brak pliku `index.html` ujawnił wszystkie pliki w folderze, łącznie z prywatnymi danymi takimi jak `dane_klientów.json` czy `notatka.txt`.

![Wygląd okna przeglądarki w przypadku braku pliku index.html](/public/courses/web-frontend/Images/przykład-gdy-nie-ma-index-html.png)

> [!TIP]
> W dawnych systemach z systemem plików `FAT16` rozszerzenia nazw mogły mieć najwyżej trzy znaki, dlatego używano skróconej formy `.htm`. Obecnie **standardowym i zalecanym rozszerzeniem** dokumentów webowych jest `.html`.

---

## 💀 Szkielet dokumentu HTML5

Każdy poprawny dokument HTML wymaga podstawowej struktury startowej nazywanej boilerplate. Zanim umieścisz na stronie pierwszy nagłówek, musisz przekazać przeglądarce informacje o standardzie języka, kodowaniu znaków oraz sposobie skalowania widoku.

```html
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Katalog Zasobów</title>
</head>

<body>
    <!-- Widoczna treść strony -->
</body>

</html>
```

Każdy element tego szkieletu pełni konkretną funkcję techniczną:

- `<!DOCTYPE html>`: deklaracja informująca silnik przeglądarki, że dokument korzysta ze standardu _**HTML5**_. Chroni przed przejściem w przestarzały tryb wstecznej kompatybilności (quirks mode).
- `<html lang="pl">`: główny kontener całego dokumentu. Atrybut `lang="pl"` jest **wymaganiem dostępności WCAG**: pozwala czytnikom ekranu użyć polskiego głosu, a przeglądarce rozpoznać język tekstu.
- `<head>`: sekcja metadanych. Zawarte tu znaczniki (poza tytułem karty) nie wyświetlają się w oknie strony, ale konfigurują jej działanie.
  - `<meta charset="UTF-8">`: określa kodowanie znaków, gwarantując poprawne wyświetlanie polskich liter (`ą`, `ć`, `ę`, `ł`, `ń`, `ó`, `ś`, `ź`, `ż`).
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: instruuje przeglądarki mobilne, aby dopasowały szerokość strony do ekranu telefonu zamiast pomniejszać widok jak z monitora komputera.
  - `<title>`: ustawia nazwę wyświetlaną na karcie przeglądarki oraz w wynikach wyszukiwania.
- `<body>`: właściwy kontener treści. Wszystko, co ma zobaczyć użytkownik, trafia właśnie tutaj.

### 🔮 Przewidywanie: co się stanie bez deklaracji UTF-8

Zatrzymaj się na chwilę przed eksperymentem. Zapisujesz plik HTML w nowoczesnym kodowaniu UTF-8, ustawiasz atrybut `<html lang="pl">`, ale usuwasz z sekcji `<head>` linię `<meta charset="UTF-8">`. Wewnątrz `<body>` wpisujesz nagłówek:

```html
<h1>Żółć i gęślą jaźń</h1>
```

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: czy atrybut `lang="pl"` wystarczy, aby przeglądarka zawsze poprawnie wyświetliła polskie znaki, czy bez deklaracji `UTF-8` może zamienić je na uszkodzone symbole?

### 🔎 Obserwacja i wyjaśnienie

Atrybut `lang="pl"` nie wystarcza. Informuje on jedynie o języku treści (dla syntezatorów mowy, wyszukiwarek i modułu tłumaczenia), ale w żaden sposób nie określa, jak zamieniać bajty pliku na litery alfabetu.

Gdy serwer nie wyśle nagłówka kodowania, a w pliku zabraknie `<meta charset="UTF-8">`, przeglądarka może użyć domyślnego kodowania jednobajtowego. W efekcie dwubajtowe polskie znaki rozpadają się na dziwne pary symboli, na przykład `Å»Ã³Å‚Ä‡ i gÄ™Å›lÄ… jaÅºÅ„`. Znacznik `<meta charset="UTF-8">` umieszczaj **zawsze jako pierwszy element** wewnątrz `<head>`.

### 🛠️ Podgląd na żywo i czysta przestrzeń robocza

Aby uruchomić podgląd pliku w VS Code przez zainstalowaną wcześniej wtyczkę *Live Preview*, kliknij ikonę podglądu w prawym górnym rogu edytora. Na początku nauki warto też wyłączyć automatyczne podpowiedzi AI, aby samodzielnie utrwalić składnię znaczników bez rozpraszania uwagi.

![Wyłączanie podpowiedzi AI w edytorze VS Code](/public/courses/web-frontend/Images/VSCode-wyłącz-podpowiedzi-AI.png)

Zwróć uwagę na wpływ dwóch prostych zmian w szablonie: ustawienie `lang="en"` sprawia, że przeglądarka proponuje tłumaczenie strony na język polski, a zmiana tekstu wewnątrz `<title>` od razu aktualizuje napis na karcie przeglądarki. Jeśli minimapa kodu po prawej stronie przeszkadza Ci w skupieniu, możesz ją wyłączyć prawym przyciskiem myszy.

![Podgląd efektu atrybutu lang i znacznika title oraz wyłączanie minimapy w VS Code](/public/courses/web-frontend/Images/VSCode-wyłącz-minimapę.png)

<data-gate>
  <data-sortable-list title="Ułóż warstwy szkieletu dokumentu HTML5 w poprawnej kolejności od góry pliku">
    <item data-correct="3">Sekcja &lt;head&gt; zawierająca &lt;meta charset="UTF-8"&gt;, viewport oraz &lt;title&gt;</item>
    <item data-correct="1">Deklaracja standardu &lt;!DOCTYPE html&gt;</item>
    <item data-correct="5">Domknięcie głównego kontenera dokumentu &lt;/html&gt;</item>
    <item data-correct="2">Otwarcie głównego kontenera z językiem &lt;html lang="pl"&gt;</item>
    <item data-correct="4">Sekcja &lt;body&gt; z widoczną treścią strony dla użytkownika</item>
  </data-sortable-list>
</data-gate>

---

## 🌐 Protokół sieciowy i adresy: http://127.0.0.1 kontra file://

Gdy otwierasz podgląd przez wtyczkę *Live Preview*, w pasku adresu pojawia się ciąg `http://127.0.0.1:3000/...`. Jeśli jednak klikniesz dwukrotnie plik `index.html` bezpośrednio w folderze na dysku, przeglądarka pokaże adres `file:///C:/...`.

Różnica między tymi dwoma trybami ma bezpośredni wpływ na działanie Twoich linków:

- **Protokół lokalny (`file:///`)**: przeglądarka otwiera plik bezpośrednio z dysku twardego, bez udziału serwera sieciowego. Taki adres działa wyłącznie na Twoim komputerze.
- **Protokół sieciowy (`http://`)**: wtyczka *Live Preview* uruchamia w tle **lokalny mini-serwer** pod adresem pętli zwrotnej `127.0.0.1` (localhost). Dzięki temu testujesz stronę w warunkach zbliżonych do prawdziwego hostingu.

Przy okazji rozróżnij dwa bliskie pojęcia, które często pojawiają się w dokumentacji technicznej:

- **URI**: ogólny identyfikator dowolnego zasobu (może wskazywać nazwę książki, obiekt w bazie lub dokument).
- **URL**: konkretny rodzaj URI, który oprócz nazwy podaje dokładny adres zasobu oraz protokół dostępu (np. `https://`, `http://` lub `file://`).

---

## 🏗️ Hierarchia nagłówków od H1 do H6

Nagłówki nie służą do powiększania czcionki. Ich zadaniem jest zbudowanie **hierarchii informacji**, na podstawie której czytniki ekranu i roboty wyszukiwarek tworzą spis treści dokumentu. HTML udostępnia sześć poziomów: od najważniejszego `<h1>` do najniższego `<h6>`.

- `<h1>`: główny, unikalny tytuł konkretnej strony lub podstrony (na przykład tytuł artykułu albo „Kontakt”). Na jednym widoku stosujemy dokładnie jeden element `<h1>`.
- `<h2>`: główne rozdziały (sekcje) dzielące treść na logiczne bloki.
- `<h3>`: podrozdziały wewnątrz sekcji otwartej przez `<h2>`.
- `<h4>`, `<h5>`, `<h6>`: głębsze podpoziomy używane w rozbudowanych dokumentacjach technicznych i raportach.

### 📶 Dwie twarde zasady hierarchii nagłówków

Aby kod spełniał standardy dostępności (`WCAG`) i był czytelny dla wyszukiwarek, przestrzegaj dwóch reguł:

1. **Zakaz zagnieżdżania**: nigdy nie wkładaj jednego nagłówka wewnątrz drugiego. Podrzędność wynika z numeracji (`<h3>` zapisany po `<h2>`), a nie z fizycznego umieszczenia znacznika w znaczniku.

```html
<!-- POPRAWNA KOLEJNOŚĆ -->
<h2>Dokumentacja sieciowa</h2>
<h3>Specyfikacja HTML</h3>
<h3>Standardy dostępności</h3>

<!-- BŁĘDNE ZAGNIEŻDŻENIE -->
<h2>Dokumentacja sieciowa <h3>Specyfikacja HTML</h3></h2>
```

2. **Zakaz pomijania poziomów w dół**: nie przeskakuj z `<h1>` prosto na `<h3>` ani z `<h2>` na `<h4>`. Powrót w górę (na przykład z `<h3>` na nowe `<h2>` rozpoczynające kolejny dział) jest w pełni poprawny.

| Sekwencja nagłówków | Ocena | Wyjaśnienie |
| :--- | :--- | :--- |
| `H1` → `H2` → `H3` | **Poprawna** | Stopniowe schodzenie w dół bez luk. |
| `H1` → `H3` → `H2` | **_Błędna_** | Pominięto poziom `H2` na starcie dokumentu. |
| `H1` → `H2` → `H3` → `H2` | **Poprawna** | Powrót do `H2` otwiera nową sekcję główną. |
| `H1` → `H2` → `H3` → `H2` → `H4` | **_Błędna_** | Po drugim `H2` przeskoczono od razu na `H4` bez `H3`. |

Do zwykłych bloków tekstu używaj zawsze znacznika akapitu `<p>`, a nigdy nagłówków.

---

## 🗂️ Listy nieuporządkowane, uporządkowane i zagnieżdżone

Listy służą do grupowania powiązanych pozycji. Opierają się na sztywnej relacji **rodzic i dziecko**: rodzicem jest znacznik listy (`<ul>` lub `<ol>`), a **jedynym dozwolonym bezpośrednim dzieckiem listy** jest element `<li>`.

- **Lista nieuporządkowana (`<ul>`)**: stosujesz ją, gdy kolejność punktów nie zmienia sensu (na przykład katalog linków lub menu nawigacji). Przeglądarka dodaje domyślne punktory.
- **Lista uporządkowana (`<ol>`)**: stosujesz ją, gdy kolejność jest istotna (instrukcja krok po kroku, ranking). Przeglądarka automatycznie numeruje pozycje.

```html
<ol>
    <li>Utwórz plik index.html w VS Code</li>
    <li>Dodaj szkielet HTML5 z kodowaniem UTF-8</li>
    <li>Uruchom podgląd Live Preview</li>
</ol>
```

### ⚠️ Typowy błąd: elementy osierocone w listach

Jeśli wstawisz akapit `<p>` albo zwykły tekst bezpośrednio wewnątrz `<ul>` lub `<ol>` bez otoczenia ich znacznikiem `<li>`, powstają tzw. **_elementy osierocone_**.

Na poniższym zrzucie ekranu pierwsza lista `<ol>` ma poprawne elementy `<li>` z numeracją. W drugiej liście `<p>` i tekst wrzucono luzem do `<ol>`: przeglądarka zastosowała wcięcie, ale nie potrafiła wygenerować numerów, a struktura łamie standardy dostępności.

![Porównanie poprawnej numerowanej listy ol oraz błędnej listy z osieroconymi elementami w Edge i Firefox](/public/courses/web-frontend/Images/Przedstawienie_w_MS_Edge_i_Mozilla_Firefox_render_strony_oraz_inspekcję_kodu_Gdzie_pierwsza_lista_ol_jest_numerowana_a_druga_mimo_wcięć_nie_ma_markera.png)

### 🌿 Poprawne zagnieżdżanie podlisty

Kiedy pozycja na liście zawiera własną podlistę (na przykład kategorię z podlinkami), podlistę `<ul>` lub `<ol>` umieszczasz **wewnątrz znacznika `<li>`**, nigdy bezpośrednio obok niego:

```html
<ul>
    <li>
        Dokumentacja
        <ul>
            <li>Specyfikacja HTML5</li>
            <li>Wytyczne dostępności WCAG</li>
        </ul>
    </li>
    <li>Narzędzia deweloperskie</li>
</ul>
```

Dzięki temu każda podlista ma swojego wyraźnego rodzica `<li>`, a czytniki ekranu poprawnie ogłaszają poziom zagnieżdżenia.

### 🛠️ Warsztat prowadzony: korekta hierarchii nagłówków i listy

Poniższy fragment katalogu zawiera trzy typowe usterki: przeskoczony poziom nagłówka (`<h4>` po `<h1>`), brak poziomu `<h3>` dla podsekcji oraz akapity `<p>` wrzucone bezpośrednio do `<ul>` bez znaczników `<li>`.

Napraw kod w edytorze:
- Zastąp przeskoczony nagłówek `<h4>` poprawnym `<h2>` oraz dodaj podsekcję `<h3>` (na przykład dla dokumentacji).
- Usuń z kodu znacznik `<h4>`.
- Zastąp osierocone pozycje w liście `<ul>` poprawnymi elementami `<li>`.

<data-gate>
  <data-code-runner language="html" title="Korekta hierarchii nagłówków i pozycji listy">
    <template data-type="code">
<h1>Katalog Zasobów</h1>
<p>Sprawdzone materiały do nauki technologii webowych:</p>

<h4>Dokumentacja Techniczna</h4>

<ul>
  <p>MDN Web Docs</p>
  <p>Standardy W3C</p>
</ul>
    </template>
    <template data-type="requirements">
      [
        {
          "id": "has-h1",
          "text": "Zachowano główny nagłówek <h1>",
          "type": "regex",
          "pattern": "<h1\\b[^>]*>[\\s\\S]*?</h1>"
        },
        {
          "id": "has-h2",
          "text": "Zastąpiono przeskoczony nagłówek znacznikiem <h2>",
          "type": "regex",
          "pattern": "<h2\\b[^>]*>[\\s\\S]*?</h2>"
        },
        {
          "id": "has-h3",
          "text": "Dodano podsekcję z nagłówkiem <h3> (zachowując ciągłość H1 → H2 → H3)",
          "type": "regex",
          "pattern": "<h3\\b[^>]*>[\\s\\S]*?</h3>"
        },
        {
          "id": "no-h4",
          "text": "Usunięto błędny, przeskoczony nagłówek <h4>",
          "type": "not-contains",
          "pattern": "<h4"
        },
        {
          "id": "items-in-li",
          "text": "Każda pozycja wewnątrz listy <ul> jest poprawnym elementem <li> (co najmniej 2 pozycje, bez osieroconych <p>)",
          "type": "regex",
          "pattern": "<ul\\b[^>]*>\\s*<li\\b[^>]*>[\\s\\S]*?</li>\\s*<li\\b[^>]*>[\\s\\S]*?</li>[\\s\\S]*?</ul>"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🔗 Hiperłącza, atrybut target i ścieżki plików

Do łączenia dokumentów służy znacznik kotwicy `<a>`. Jego kluczowym atrybutem jest *href*, który określa adres docelowy odnośnika.

Domyślnie kliknięcie linku otwiera cel w tej samej karcie (`target="_self"`). Gdy odsyłasz użytkownika na zewnętrzny portal i chcesz, aby Twoja strona pozostała otwarta w tle, dodaj atrybut `target="_blank"`:

```html
<a href="https://developer.mozilla.org" target="_blank">Dokumentacja MDN</a>
```

### 📂 Ścieżki bezwzględne i względne

Linki w obrębie własnego projektu możesz zapisywać na dwa sposoby:

- **Adresowanie bezwzględne**: podaje pełny adres internetowy (`https://domena.pl/kontakt.html`) albo ścieżkę zaczynającą się od ukośnika (`/kontakt.html`), która każe serwerowi szukać pliku od głównego folderu domeny.
- **Adresowanie względne** (zalecane dla plików projektu): wskazuje położenie docelowego pliku względem dokumentu, w którym aktualnie piszesz kod:
  - `./poradniki.html`: plik leży w tym samym folderze co obecny dokument.
  - `podstrony/kontakt.html`: wejście do podfolderu `podstrony`.
  - `../index.html`: wyjście o jeden poziom wyżej, do folderu nadrzędnego.

### 🔮 Przewidywanie: ścieżki ./, ../ oraz / w podfolderze projektu

Spójrz na układ plików w Twoim folderze głównym `projekt/`:
- `projekt/index.html`
- `projekt/kontakt.html`
- `projekt/katalog/narzedzia.html`
- `projekt/katalog/poradniki.html`

Edytujesz plik `katalog/narzedzia.html` i umieszczasz w nim trzy odnośniki:
1. `<a href="./poradniki.html">Poradniki</a>`
2. `<a href="../index.html">Strona główna</a>`
3. `<a href="/kontakt.html">Kontakt</a>`

> [!IMPORTANT]
> Zastanów się przed dalszym czytaniem: otwierasz projekt bezpośrednio z dysku twardego przez protokół `file:///`. Które z tych trzech linków zadziałają poprawnie, a który zwróci błąd braku pliku?

### 🔎 Obserwacja i wyjaśnienie

Dwa pierwsze linki zadziałają bez problemu w każdym środowisku:
- `./poradniki.html` wskazuje plik w bieżącym folderze `katalog/`, więc przeglądarka odnajdzie `katalog/poradniki.html`.
- `../index.html` cofa się o jeden poziom do folderu `projekt/` i poprawnie otwiera `projekt/index.html`.

Trzeci link (`/kontakt.html`) **_zawiedzie przy protokole `file:///`_**. Początkowy ukośnik `/` oznacza główny katalog systemu plików: na Windows przeglądarka spróbuje otworzyć nieistniejący plik `C:\kontakt.html`. Ten sam zapis zadziała dopiero na serwerze HTTP (jak *Live Preview* albo docelowy hosting), gdzie `/` wskazuje główny folder serwera.

Dlatego dla linków wewnętrznych w projekcie stosuj **adresowanie względne** (`./`, `../`), aby projekt był w pełni przenośny.

<data-gate>
<data-connection-matcher title="Połącz znacznik HTML lub ścieżkę pliku z ich rzeczywistym działaniem">
  <item left="`&lt;meta charset=&quot;UTF-8&quot;&gt;`" right="Zapewnia poprawne dekodowanie polskich znaków diakrytycznych"></item>
  <item left="`&lt;meta name=&quot;viewport&quot; ...&gt;`" right="Dopasowuje szerokość i skalowanie strony do ekranu smartfona"></item>
  <item left="`&lt;html lang=&quot;pl&quot;&gt;`" right="Określa język dokumentu dla czytników ekranu (WCAG) i przeglądarek"></item>
  <item left="`./poradniki.html`" right="Ścieżka względna do pliku w tym samym folderze"></item>
  <item left="`../index.html`" right="Ścieżka względna wychodząca o jeden folder wyżej"></item>
  <item left="`/kontakt.html`" right="Ścieżka od głównego katalogu serwera (zawodzi przy otwarciu z dysku file://)"></item>
</data-connection-matcher>
</data-gate>

---

## 🚀 Samodzielne zadanie: podstrona katalogu z zagnieżdżoną listą

Budujesz podstronę `katalog/zasoby.html` w projekcie o takiej samej strukturze folderów jak wyżej (`index.html` leży poziom wyżej, a `narzedzia.html` w tym samym folderze `katalog/`).

Napisz samodzielnie poprawny semantycznie fragment HTML spełniający wszystkie wymagania:
1. Umieść dokładnie jeden główny nagłówek `<h1>` oraz krótki akapit wprowadzający `<p>`.
2. Zbuduj hierarchię nagłówków bez pomijania poziomów: główną sekcję `<h2>` oraz podsekcję `<h3>`.
3. Utwórz listę nieuporządkowaną `<ul>` z elementami `<li>`, w tym co najmniej jedną **zagnieżdżoną listę `<ul>`** umieszczoną poprawnie wewnątrz wybranego elementu `<li>`.
4. Wewnątrz elementów listy umieść trzy rodzaje odnośników:
   - link względny do pliku w tym samym folderze (np. `./narzedzia.html`),
   - link względny wracający do strony głównej poziom wyżej (`../index.html`),
   - link zewnętrzny zaczynający się od `https://` otwierany w nowej karcie (`target="_blank"`).

<data-gate>
  <data-code-runner language="html" title="Podstrona katalogu z zagnieżdżoną listą i linkami względnymi">
    <template data-type="code">
<!-- Zbuduj podstronę katalog/zasoby.html zgodnie z wymaganiami -->

    </template>
    <template data-type="requirements">
      [
        {
          "id": "cat-h1",
          "text": "Dodano główny nagłówek <h1>",
          "type": "regex",
          "pattern": "<h1\\b[^>]*>[\\s\\S]*?</h1>"
        },
        {
          "id": "cat-p",
          "text": "Dodano akapit wprowadzający <p>",
          "type": "regex",
          "pattern": "<p\\b[^>]*>[\\s\\S]{5,}?</p>"
        },
        {
          "id": "cat-h2-h3",
          "text": "Zachowano ciągłą hierarchię nagłówków <h2> oraz <h3>",
          "type": "regex",
          "pattern": "<h2\\b[^>]*>[\\s\\S]*?</h2>[\\s\\S]*?<h3\\b[^>]*>[\\s\\S]*?</h3>"
        },
        {
          "id": "cat-nested-list",
          "text": "Utworzono zagnieżdżoną listę <ul> poprawnie umieszczoną wewnątrz <li>",
          "type": "regex",
          "pattern": "<li\\b[^>]*>[\\s\\S]*?<ul\\b[^>]*>[\\s\\S]*?<li\\b[^>]*>[\\s\\S]*?</li>[\\s\\S]*?</ul>[\\s\\S]*?</li>"
        },
        {
          "id": "cat-rel-same",
          "text": "Dodano wewnątrz <li> link względny do pliku w tym samym folderze (href=\"./...\")",
          "type": "regex",
          "pattern": "<li\\b[^>]*>[\\s\\S]*?<a\\b[^>]*href\\s*=\\s*[\"']\\./[^\"']+[\"'][^>]*>[\\s\\S]*?</a>[\\s\\S]*?</li>"
        },
        {
          "id": "cat-rel-up",
          "text": "Dodano wewnątrz <li> link względny poziom wyżej do strony głównej (href=\"../index.html\")",
          "type": "regex",
          "pattern": "<li\\b[^>]*>[\\s\\S]*?<a\\b[^>]*href\\s*=\\s*[\"']\\.\\./index\\.html[\"'][^>]*>[\\s\\S]*?</a>[\\s\\S]*?</li>"
        },
        {
          "id": "cat-external-blank",
          "text": "Dodano wewnątrz <li> zewnętrzny link https:// otwierany w nowej karcie (target=\"_blank\")",
          "type": "regex",
          "pattern": "<li\\b[^>]*>[\\s\\S]*?<a\\b[^>]*(?:href\\s*=\\s*[\"']https://[^\"']+[\"'][^>]*target\\s*=\\s*[\"']_blank[\"']|target\\s*=\\s*[\"']_blank[\"'][^>]*href\\s*=\\s*[\"']https://[^\"']+[\"'])[^>]*>[\\s\\S]*?</a>[\\s\\S]*?</li>"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Bajty UTF-8, limit 1024 bajtów prescanu, Quirks Mode i izolacja procesów</span>
<span class="deep-dive-badge">UTF-8 · WHATWG PRESCAN · SITE ISOLATION</span>
</summary>
<div class="deep-dive-content">

<h4>1. Dlaczego brak meta charset zamienia „ł” na „Å‚” (poziom bajtów)</h4>

Znak `ł` ma w standardzie Unicode punkt kodowy `U+0142`. W zmiennodługościowym kodowaniu **UTF-8** zajmuje dokładnie **2 bajty**: `0xC5 0x82`. Jeśli serwer nie wyśle nagłówka `Content-Type: text/html; charset=utf-8`, a w pliku zabraknie `<meta charset="UTF-8">`, przeglądarka może zdekodować każdy bajt osobno w jednobajtowej tablicy Windows-1252:

| Interpretacja | Bajty w pliku | Odczytane znaki | Punkty kodowe |
| :--- | :--- | :--- | :--- |
| **UTF-8** (poprawny) | `0xC5 0x82` (2 bajty razem) | `ł` | `U+0142` |
| **Windows-1252** (błędny) | `0xC5`, potem `0x82` (osobno) | `Å` oraz `‚` | `U+00C5`, `U+201A` |

Dodatkowo specyfikacja _**WHATWG §13.2.3.2**_ definiuje algorytm *prescan*, który szuka deklaracji `<meta charset="...">` wyłącznie w **pierwszych 1024 bajtach** dokumentu. Jeśli wstawisz ją zbyt daleko za długim komentarzem lub skryptami, parser zignoruje ją przy starcie i będzie musiał zrestartować parsowanie od zera.

<h4>2. Co dokładnie psuje brak DOCTYPE (Quirks Mode)</h4>

Brak linii `<!DOCTYPE html>` przełącza silnik renderujący w tryb zgodności z przeglądarkami z lat 90. (Quirks Mode). W tym trybie:

- szerokość `width` w CSS obejmuje `padding` i `border` (stary model pudełkowy Internet Explorer 5),
- tabele przestają dziedziczyć rozmiar czcionki z `<body>`,
- jednostka `px` staje się opcjonalna w części reguł CSS, co rozjeżdża współczesne układy stron.

<h4>3. Izolacja procesów i bezpieczeństwo target="_blank"</h4>

Dawniej link z samym `target="_blank"` otwierał nową kartę w **tym samym procesie renderującym** z aktywną referencją `window.opener`, pozwalając obcej stronie przekierować Twoją kartę źródłową na fałszywy ekran logowania (atak *reverse tabnabbing*). Współczesne przeglądarki automatycznie implikują `rel="noopener"` dla `_blank`, co pozwala Chromium odseparować karty w ramach **Site Isolation**. Mimo to w kodzie produkcyjnym warto jawnie dopisywać `rel="noopener noreferrer"` dla linków do nieznanych domen.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Plik główny to `index.html`**: serwer szuka go domyślnie po wpisaniu samej domeny; jego brak grozi błędem **_`403 Forbidden`_** albo ujawnieniem listy plików (Directory Listing).
- **Szkielet HTML5**: `<!DOCTYPE html>` włącza tryb standardowy, `<meta charset="UTF-8">` ratuje polskie znaki, `<meta name="viewport">` naprawia widok mobilny, a `<html lang="pl">` wspiera dostępność WCAG.
- **Hierarchia nagłówków**: stosuj jeden `<h1>` na podstronę, nigdy nie zagnieżdżaj nagłówków i nie pomijaj poziomów w dół (`H1` → `H2` → `H3`).
- **Relacja rodzic i dziecko w listach**: bezpośrednim dzieckiem `<ul>` lub `<ol>` jest wyłącznie `<li>`; linki `<a>` oraz zagnieżdżone podlisty wkładaj zawsze do wnętrza `<li>`.
- **Ścieżki względne**: używaj `./` (ten sam folder) oraz `../` (poziom wyżej), aby linki działały tak samo na dysku (`file://`), w *Live Preview* (`http://127.0.0.1`) i na serwerze docelowym.
