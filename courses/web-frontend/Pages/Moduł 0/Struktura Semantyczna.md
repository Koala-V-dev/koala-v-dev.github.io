# Struktura Semantyczna

Wiesz już, jak zbudować szkielet HTML5, ułożyć hierarchię nagłówków oraz połączyć podstrony linkami względnymi. Wyobraź sobie teraz gotowy portal informacyjny, którego cały kod składa się wyłącznie ze znaczników `<div>`. Na monitorze, po dodaniu stylów CSS, taki serwis wygląda poprawnie: ma górny pasek, menu, kolumnę z artykułem i stopkę.

Kiedy jednak tę samą stronę otwiera osoba niewidoma z czytnikiem ekranu albo robot wyszukiwarki, widzi płaską ścianę bezimiennych pudełek. Przeglądarka nie potrafi odróżnić menu od treści artykułu, a użytkownik klawiatury musi przebrnąć przez dziesiątki linków w nagłówku, zanim dotrze do pierwszego zdania tekstu.

Najważniejsza zasada architektury HTML brzmi jasno: **HTML opisuje znaczenie treści**, a CSS odpowiada za jej wygląd.

---

## 🌳 Drzewo dostępności: jak przeglądarka czyta strukturę strony

Wiesz już, że przeglądarka zamienia kod HTML w drzewo DOM, aby wyświetlić elementy na ekranie. Równolegle tworzy jednak drugą, mniej znaną strukturę: _**drzewo dostępności**_ (Accessibility Tree).

To uproszczona mapa dokumentu przeznaczona dla technologii asystujących (takich jak czytniki ekranu NVDA lub VoiceOver) oraz systemów nawigacji klawiaturowej. Zamiast interesować się kolorami i marginesami, drzewo dostępności zbiera trzy kluczowe informacje o każdym ważnym elemencie:

- **Rola**: czym jest dany obszar (na przykład nagłówkiem, menu nawigacyjnym, przyciskiem lub główną treścią).
- **Nazwa dostępna**: krótka etykieta, która pozwala odróżnić dwa elementy o tej samej roli.
- **Stan**: na przykład czy dany element jest rozwinięty, zaznaczony lub nieaktywny.

Zwykły znacznik `<div>` nie przekazuje drzewu dostępności żadnej roli. Jest przezroczystym kontenerem. Gdy cała strona powstaje z samych `<div>`, drzewo dostępności nie ma żadnych **punktów orientacyjnych** (zwanych też *landmarkami*).

---

## 🏛️ Semantyczne punkty orientacyjne HTML5

Standard _**HTML5**_ wprowadził zestaw kontenerów, które zachowują się blokowo jak `<div>`, ale automatycznie zgłaszają swoją rolę do drzewa dostępności:

```html
<header>    <!-- Nagłówek strony lub sekcji: logo, tytuł, wprowadzenie -->
<nav>       <!-- Blok głównych linków nawigacyjnych -->
<main>      <!-- Główna, unikalna treść całej strony (tylko jeden widoczny na stronę) -->
<article>   <!-- Samodzielna publikacja: artykuł, wpis na blogu, komentarz -->
<section>   <!-- Tematyczny rozdział większej całości -->
<aside>     <!-- Treść poboczna: pasek boczny, powiązane linki, ramka z definicją -->
<footer>    <!-- Stopka strony, artykułu lub sekcji -->
```

### 🔮 Przewidywanie: zupa z divów kontra landmarki

Spójrz na dwa fragmenty kodu tej samej podstrony. Pierwszy korzysta wyłącznie ze znaczników `<div>` z klasami CSS (tzw. **_div soup_**):

```html
<!-- Wariant A -->
<div class="top-bar">
    <p>Portal Inżynierii</p>
    <div class="menu">
        <ul>
            <li><a href="./index.html">Start</a></li>
            <li><a href="./artykuly.html">Artykuły</a></li>
        </ul>
    </div>
</div>
<div class="content">
    <h1>Architektura sieci</h1>
    <p>Treść publikacji...</p>
</div>
<div class="bottom-bar">
    <p>&copy; 2026 Portal Inżynierii</p>
</div>
```

Drugi wariant zamienia te same pudełka na znaczniki semantyczne HTML5:

```html
<!-- Wariant B -->
<header>
    <p>Portal Inżynierii</p>
    <nav>
        <ul>
            <li><a href="./index.html">Start</a></li>
            <li><a href="./artykuly.html">Artykuły</a></li>
        </ul>
    </nav>
</header>
<main>
    <article>
        <h1>Architektura sieci</h1>
        <p>Treść publikacji...</p>
    </article>
</main>
<footer>
    <p>&copy; 2026 Portal Inżynierii</p>
</footer>
```

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: czym różni się wygląd obu wariantów w czystej przeglądarce bez CSS, a czym różni się ich obraz w drzewie dostępności, gdy użytkownik czytnika ekranu wywoła listę punktów orientacyjnych?

### 🔎 Obserwacja i wyjaśnienie

Wizualnie bez arkusza CSS oba warianty wyglądają identycznie. Wszystkie wymienione znaczniki semantyczne są domyślnie zwykłymi blokami, takimi jak `<div>`.

Różnica ujawnia się w **drzewie dostępności**:
- Wariant A generuje **pustą listę punktów orientacyjnych**. Nazwy klas CSS (`class="top-bar"`, `class="menu"`) są dla czytnika ekranu całkowicie niewidoczne.
- Wariant B automatycznie tworzy mapę strony: obszar banera (`<header>`), nawigację (`<nav>`), główną treść (`<main>`) oraz stopkę informacyjną (`<footer>`). Użytkownik czytnika jednym skrótem klawiszowym przeskakuje bezpośrednio do `<main>`, omijając całe menu.

Czy oznacza to, że `<div>` należy całkowicie wyeliminować z kodu? Nie. Zastosuj prostą regułę wyboru:
- Jeśli obszar pełni określoną funkcję w dokumencie (stopka, menu, główna treść, artykuł), wybierz znacznik semantyczny.
- Jeśli grupujesz elementy **wyłącznie do ułożenia ich w siatce CSS** lub nadania wspólnego tła, użyj `<div>`.

<data-gate>
<data-connection-matcher title="Połącz znacznik semantyczny HTML5 z jego rolą w strukturze dokumentu">
  <item left="`&lt;main&gt;`" right="Unikalny kontener głównej treści strony (tylko jeden widoczny w dokumencie)"></item>
  <item left="`&lt;article&gt;`" right="Samodzielna publikacja mająca pełny sens po wycięciu ze strony"></item>
  <item left="`&lt;aside&gt;`" right="Treść poboczna: pasek boczny, powiązane linki lub ramka uzupełniająca"></item>
  <item left="`&lt;nav&gt;`" right="Blok głównych odnośników do poruszania się po serwisie lub artykule"></item>
  <item left="`&lt;footer&gt;`" right="Stopka strony lub artykułu: prawa autorskie, autor, linki pomocnicze"></item>
  <item left="`&lt;div&gt;`" right="Neutralny kontener bez roli w drzewie dostępności, używany pod układ CSS"></item>
</data-connection-matcher>
</data-gate>

---

## 🧭 Nawigacja i etykiety aria-label w drzewie dostępności

Znacznik `<nav>` oznacza główny blok odnośników. Nie owijaj nim każdego pojedynczego linku w akapicie ani drobnych odnośników w stopce, jeśli nie tworzą one kluczowej nawigacji.

Na jednej stronie często potrzebujesz jednak więcej niż jednej nawigacji: menu głównego serwisu, spisu treści artykułu oraz listy powiązanych publikacji. Gdy wstawisz trzy tagi `<nav>` bez dodatkowych opisów, w drzewie dostępności pojawią się trzy identyczne pozycje: „nawigacja”, „nawigacja”, „nawigacja”.

Aby nadać każdej nawigacji unikalną **nazwę dostępną**, dodaj atrybut *aria-label*. Nie zmienia on wyglądu strony na ekranie, ale wpisuje konkretną etykietę prosto do drzewa dostępności.

### 🌐 Nawigacja główna serwisu

Zwykle znajduje się w globalnym `<header>` i prowadzi między działami całej witryny:

```html
<header>
    <p>Portal Inżynierii Webowej</p>
    <nav aria-label="Główna nawigacja">
        <ul>
            <li><a href="./index.html">Strona główna</a></li>
            <li><a href="./artykuly.html">Artykuły</a></li>
            <li><a href="./kontakt.html">Kontakt</a></li>
        </ul>
    </nav>
</header>
```

### 🧩 Spis treści artykułu z kotwicami

Wewnątrz długiego artykułu możesz umieścić nawigację prowadzącą do poszczególnych sekcji tej samej strony. Linki wskazują wtedy identyfikatory *id* kolejnych rozdziałów:

```html
<article>
    <h1>Protokół HTTP w praktyce</h1>
    <nav aria-label="Spis treści artykułu">
        <ol>
            <li><a href="#zadanie">Budowa żądania</a></li>
            <li><a href="#odpowiedz">Kody odpowiedzi</a></li>
        </ol>
    </nav>

    <section id="zadanie">
        <h2>Budowa żądania</h2>
        <p>Przeglądarka wysyła metodę, ścieżkę zasobu oraz nagłówki...</p>
    </section>

    <section id="odpowiedz">
        <h2>Kody odpowiedzi</h2>
        <p>Serwer zwraca status liczbowy, na przykład 200 lub 404...</p>
    </section>
</article>
```

### 📚 Nawigacja powiązana w panelu bocznym

Lista sugerowanych lektur nie jest częścią głównego wywodu, dlatego najlepiej umieścić ją w `<aside>`:

```html
<aside>
    <h2>Powiązane publikacje</h2>
    <nav aria-label="Powiązane artykuły">
        <ul>
            <li><a href="./dns.html">Jak działa system DNS</a></li>
            <li><a href="./tls.html">Szyfrowanie połączeń TLS</a></li>
        </ul>
    </nav>
</aside>
```

> [!TIP]
> Stosuj atrybut `aria-label` **zawsze, gdy na stronie występuje więcej niż jeden znacznik `<nav>`**. Nie dopisuj w etykiecie słowa „nawigacja”, jeśli nie jest potrzebne dla zrozumiałości, ponieważ czytnik ekranu sam ogłasza rolę elementu (np. „Spis treści artykułu, nawigacja”).

### 🛠️ Warsztat 1: refaktoryzacja zupy z divów na semantykę

Poniższy dokument zbudowano w przestarzałym stylu opartym wyłącznie na znacznikach `<div>`. Zastąp wszystkie kontenery `<div>` właściwymi znacznikami semantycznymi HTML5:
- Górny pasek zamień na `<header>`, a menu wewnątrz na `<nav>` z zachowanym atrybutem `aria-label`.
- Środkowy obszar zamień na `<main>`, a zawarty w nim blok publikacji na `<article>`.
- Dolny kontener zamień na `<footer>`.
- Usuń z kodu wszystkie znaczniki `<div>`.

<data-gate>
  <data-code-runner language="html" title="Refaktoryzacja kontenerów div na znaczniki semantyczne HTML5">
    <template data-type="code">
<div>
  <p>Portal Inżynierii Webowej</p>
  <div aria-label="Menu główne">
    <ul>
      <li><a href="./index.html">Start</a></li>
      <li><a href="./artykuly.html">Artykuły</a></li>
    </ul>
  </div>
</div>

<div>
  <div>
    <h1>Architektura Landmarków</h1>
    <p>Treść publikacji dostępna dla czytników ekranu.</p>
  </div>
</div>

<div>
  <p>&copy; 2026 Portal Inżynierii Webowej</p>
</div>
    </template>
    <template data-type="requirements">
      [
        {
          "id": "ref-header",
          "text": "Zastąpiono górny kontener znacznikiem <header>",
          "type": "regex",
          "pattern": "<header\\b[^>]*>[\\s\\S]*?</header>"
        },
        {
          "id": "ref-nav-aria",
          "text": "Umieszczono wewnątrz <header> znacznik <nav> z niepustym atrybutem aria-label",
          "type": "regex",
          "pattern": "<header\\b[^>]*>[\\s\\S]*?<nav\\b[^>]*aria-label\\s*=\\s*[\"'][^\"']{3,}[\"'][^>]*>[\\s\\S]*?</nav>[\\s\\S]*?</header>"
        },
        {
          "id": "ref-main",
          "text": "Zastąpiono główny obszar znacznikiem <main>",
          "type": "regex",
          "pattern": "<main\\b[^>]*>[\\s\\S]*?</main>"
        },
        {
          "id": "ref-article",
          "text": "Umieszczono wewnątrz <main> znacznik <article> zawierający nagłówek <h1>",
          "type": "regex",
          "pattern": "<main\\b[^>]*>[\\s\\S]*?<article\\b[^>]*>[\\s\\S]*?<h1\\b[^>]*>[\\s\\S]*?</h1>[\\s\\S]*?</article>[\\s\\S]*?</main>"
        },
        {
          "id": "ref-footer",
          "text": "Zastąpiono dolny kontener znacznikiem <footer>",
          "type": "regex",
          "pattern": "<footer\\b[^>]*>[\\s\\S]*?</footer>"
        },
        {
          "id": "ref-no-div",
          "text": "Usunięto wszystkie zbędne znaczniki <div> z układu",
          "type": "not-contains",
          "pattern": "<div"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 📐 Kompletny szkielet artykułu: przykład wzorcowy

Zobacz, jak wszystkie poznane landmarki współpracują w pełnym dokumencie HTML5. Zwróć uwagę, że znaczniki `<header>` oraz `<footer>` występują tu dwukrotnie, ponieważ odnoszą się do dwóch różnych poziomów: całej strony oraz samego artykułu.

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Architektura sieci | Portal Inżynierii Webowej</title>
</head>
<body>

    <header>
        <p>Portal Inżynierii Webowej</p>
        <nav aria-label="Główna nawigacja">
            <ul>
                <li><a href="./index.html">Strona główna</a></li>
                <li><a href="./artykuly.html">Artykuły</a></li>
                <li><a href="./kontakt.html">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h1>Jak przeglądarka buduje drzewo dostępności</h1>
                <p>Opublikowano: 16 czerwca 2026</p>
            </header>

            <nav aria-label="Spis treści artykułu">
                <ol>
                    <li><a href="#model">Model DOM i Accessibility Tree</a></li>
                    <li><a href="#landmarki">Rola punktów orientacyjnych</a></li>
                </ol>
            </nav>

            <section id="model">
                <h2>Model DOM i Accessibility Tree</h2>
                <p>Silnik przeglądarki tworzy równolegle strukturę wizualną oraz drzewo dostępności...</p>
            </section>

            <section id="landmarki">
                <h2>Rola punktów orientacyjnych</h2>
                <p>Znaczniki HTML5 nadają kontenerom jednoznaczne role nawigacyjne...</p>
            </section>

            <footer>
                <p>Autor: Anna Kowalska</p>
            </footer>
        </article>

        <aside>
            <h2>Powiązane materiały</h2>
            <nav aria-label="Powiązane materiały">
                <ul>
                    <li><a href="./naglowki.html">Hierarchia nagłówków w praktyce</a></li>
                </ul>
            </nav>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 Portal Inżynierii Webowej. Wszelkie prawa zastrzeżone.</p>
    </footer>

</body>
</html>
```

Przeanalizuj cztery kluczowe decyzje architektoniczne z tego przykładu:
- **Jeden widoczny `<main>`**: obejmuje wyłącznie unikalną treść danej podstrony. Globalny nagłówek i stopka serwisu leżą poza nim.
- **Lokalny `<header>` i `<footer>` wewnątrz `<article>`**: tytuł publikacji, data oraz informacja o autorze należą do konkretnego artykułu, a nie do całego portalu.
- **Logo serwisu nie jest nagłówkiem `<h1>`**: na stronie publikacji najważniejszym tytułem `<h1>` jest tytuł artykułu, nie powtarzalna nazwa witryny.
- **Znak praw autorskich `&copy;`**: w stopce zastosowaliśmy encję HTML zamiast wpisywać symbol ręcznie.

> [!NOTE]
> **Encje HTML** to sekwencje zaczynające się od znaku `&` i kończące średnikiem `;`. Służą do bezpiecznego zapisywania znaków zastrzeżonych w składni HTML oraz symboli specjalnych:
> - `&copy;` wyświetla znak praw autorskich `©`
> - `&lt;` oraz `&gt;` wyświetlają znaki `<` oraz `>` bez otwierania znacznika HTML
> - `&amp;` wyświetla znak `&`
> - `&nbsp;` wstawia twardą spację, która zapobiega rozdzielaniu dwóch wyrazów na końcu wiersza

---

## 🧱 Wybór kontenera: article, section czy div

Najczęstszy dylemat przy projektowaniu semantyki dotyczy wyboru między `<article>`, `<section>` i `<div>`. Poniższa tabela porządkuje kryteria decyzyjne:

| Znacznik | Kiedy stosować | Przykłady użycia | Czy wymaga nagłówka |
| :--- | :--- | :--- | :--- |
| `<article>` | Treść jest samodzielna i zachowuje pełny sens po przeniesieniu na inną stronę lub do czytnika RSS | Wpis blogowy, artykuł prasowy, karta produktu, pojedynczy komentarz | Zalecany (`<h1>` lub `<h2>`) |
| `<section>` | Tematyczny rozdział lub logiczny obszar większej całości | Rozdział artykułu, sekcja opinii, blok formularza kontaktowego | Tak (od `<h2>` do `<h6>`) |
| `<div>` | Brak znaczenia semantycznego; grupowanie wyłącznie pod układ lub style CSS | Kontener siatki kolumn, ramka dekoracyjna, pasek układu kart | Nie |

Zwróć uwagę na przypadek brzegowy: znaczniki `<article>` można w siebie zagnieżdżać, jeśli treść wewnętrzna jest ściśle powiązana z zewnętrzną, ale nadal stanowi samodzielną wypowiedź. Przykładem jest pojedynczy komentarz czytelnika umieszczony wewnątrz artykułu blogowego.

---

## ♿ Dwa konteksty znacznika section i atrybut aria-labelledby

Sposób, w jaki drzewo dostępności traktuje znacznik `<section>`, zależy od tego, czy posiada on nazwę dostępną. Rozróżnij dwa scenariusze projektowe.

### 📄 Scenariusz 1: rozdział dokumentu tekstowego

Gdy dzielisz artykuł `<article>` na rozdziały („Historia”, „Podsumowanie”), `<section>` porządkuje wyłącznie strukturę tekstu. W takiej sytuacji **_nie dodawaj_** do `<section>` atrybutu `aria-labelledby`.

Użytkownicy czytników ekranu poruszają się po rozdziałach artykułu za pomocą skrótów do nagłówków (`<h2>`, `<h3>`). Nadanie etykiety każdemu rozdziałowi wywołałoby **_zanieczyszczenie punktów orientacyjnych_** (landmark pollution): lista landmarków rozrosłaby się do kilkunastu pozycji i straciła swoją przydatność.

```html
<section>
    <h2>Budowa żądania HTTP</h2>
    <p>Treść rozdziału...</p>
</section>
```

### 📊 Scenariusz 2: niezależny panel lub widget aplikacji

Gdy budujesz panel administracyjny (dashboard) z osobnymi narzędziami, na przykład „Status serwerów” oraz „Ostatnie alerty”, zależy Ci na tym, aby użytkownik mógł jednym skrótem przeskoczyć bezpośrednio do wybranego modułu.

W standardzie WAI-ARIA znacznik `<section>` otrzymuje w drzewie dostępności rolę punktu orientacyjnego (`region`) _**wyłącznie wtedy, gdy ma nadaną nazwę dostępną**_. Najlepiej powiązać go z jego własnym nagłówkiem za pomocą atrybutu *aria-labelledby*, który wskazuje wartość *id* tego nagłówka:

```html
<section aria-labelledby="heading-alerts">
    <h2 id="heading-alerts">Ostatnie alerty</h2>
    <ul>
        <li>Brak krytycznych błędów w ostatnich 24 godzinach.</li>
    </ul>
</section>
```

> [!WARNING]
> Specyfikacja ARIA pozwala wskazać przez `aria-labelledby` dowolny element na stronie, ale standard HTML5 wymaga, aby każdy znacznik `<section>` zawierał swój nagłówek (od `<h2>` do `<h6>`) wewnątrz siebie. Jeśli powiążesz sekcję z nagłówkiem leżącym poza nią, walidator W3C zgłosi ostrzeżenie „Section lacks heading”. Nagłówek **zawsze umieszczaj wewnątrz sekcji**.

Dla robotów wyszukiwarek atrybuty ARIA są neutralne: dla indeksowania liczy się treść nagłówka oraz poprawna struktura HTML. Dla czytników ekranu (NVDA, VoiceOver) sekcja z `aria-labelledby` staje się natomiast pełnoprawnym punktem orientacyjnym na liście szybkiej nawigacji.

---

## 🚀 Warsztat 2: samodzielny szkielet panelu administracyjnego

Zbuduj od zera szkielet semantyczny panelu monitorowania serwerów (sama zawartość wewnątrz `<body>`). Tym razem nie budujesz bloga, lecz **dashboard aplikacji** z nazwanym regionem widgetu oraz dwoma wyraźnie rozdzielonymi obszarami nawigacji.

Twój kod musi spełniać wszystkie poniższe wymagania:
1. Umieść globalny `<header>` z pierwszą nawigacją `<nav aria-label="...">` zawierającą listę `<ul>` linków względnych.
2. Utwórz główny obszar `<main>` z dokładnie jednym nagłówkiem `<h1>` oraz co najmniej jednym widgetem `<section aria-labelledby="...">`, którego wewnętrzny nagłówek `<h2 id="...">` posiada **identyczny identyfikator** jak wartość `aria-labelledby`.
3. Dodaj panel poboczny `<aside>` zawierający drugą nawigację `<nav aria-label="...">` (na przykład z szybkimi skrótami do logów i raportów).
4. Zakończ układ globalną stopką `<footer>`.

<data-gate>
  <data-code-runner language="html" title="Samodzielny szkielet panelu administracyjnego z aria-labelledby">
    <template data-type="code">
<!-- Zbuduj dashboard: header z nav(aria-label), main z h1 i section(aria-labelledby + pasujące h2 id), aside z drugim nav(aria-label) oraz footer -->

    </template>
    <template data-type="requirements">
      [
        {
          "id": "dash-header-nav",
          "text": "Utworzono <header> z pierwszą nawigacją <nav aria-label=\"...\">",
          "type": "regex",
          "pattern": "<header\\b[^>]*>[\\s\\S]*?<nav\\b[^>]*aria-label\\s*=\\s*[\"'][^\"']{3,}[\"'][^>]*>[\\s\\S]*?</nav>[\\s\\S]*?</header>"
        },
        {
          "id": "dash-main-h1",
          "text": "Utworzono główny kontener <main> zawierający nagłówek <h1>",
          "type": "regex",
          "pattern": "<main\\b[^>]*>[\\s\\S]*?<h1\\b[^>]*>[\\s\\S]*?</h1>[\\s\\S]*?</main>"
        },
        {
          "id": "dash-section-labelledby",
          "text": "Dodano w <main> widget <section aria-labelledby=\"...\"> powiązany z wewnętrznym <h2 id=\"...\"> o tym samym identyfikatorze",
          "type": "regex",
          "pattern": "<main\\b[^>]*>[\\s\\S]*?<section\\b[^>]*aria-labelledby\\s*=\\s*[\"']([^\"']+)[\"'][^>]*>[\\s\\S]*?<h2\\b[^>]*id\\s*=\\s*[\"']\\1[\"'][^>]*>[\\s\\S]*?</h2>[\\s\\S]*?</section>[\\s\\S]*?</main>"
        },
        {
          "id": "dash-aside-nav",
          "text": "Umieszczono w <aside> drugą nawigację <nav aria-label=\"...\">",
          "type": "regex",
          "pattern": "<aside\\b[^>]*>[\\s\\S]*?<nav\\b[^>]*aria-label\\s*=\\s*[\"'][^\"']{3,}[\"'][^>]*>[\\s\\S]*?</nav>[\\s\\S]*?</aside>"
        },
        {
          "id": "dash-footer",
          "text": "Zakończono układ stopką <footer>",
          "type": "regex",
          "pattern": "<footer\\b[^>]*>[\\s\\S]*?</footer>"
        },
        {
          "id": "dash-no-div",
          "text": "Zbudowano cały szkielet wyłącznie z semantycznych kontenerów (bez <div>)",
          "type": "not-contains",
          "pattern": "<div"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Drzewo AXObject w C++, mapowanie HTML-AAM i komunikacja z API systemu OS</span>
<span class="deep-dive-badge">HTML-AAM · AXOBJECT · OS UI AUTOMATION</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak przeglądarka wystawia strukturę do systemu operacyjnego</h4>

Czytnik ekranu (NVDA na Windows, VoiceOver na macOS) nigdy nie parsuje pliku HTML ani nie zagląda bezpośrednio do DOM. Silnik Blink buduje w pamięci równoległą strukturę węzłów **`AXObject`** i udostępnia ją przez natywne API systemu operacyjnego:

- **Windows**: `UI Automation` (UIA) / `IAccessible2`
- **macOS**: `NSAccessibility`
- **Linux**: `AT-SPI` (przez magistralę D-Bus)

Dla każdego węzła system otrzymuje trójkę `(Role, AccessibleName, States)` wyliczoną według algorytmu _**ACCNAME 1.2**_ (najpierw `aria-labelledby`, potem `aria-label`, potem natywna etykieta lub treść węzła).

<h4>2. Kontekstowe mapowanie ról w specyfikacji HTML-AAM</h4>

Specyfikacja **HTML-AAM** (*HTML Accessibility API Mappings*) definiuje, dlaczego zagnieżdżone `<header>` i `<footer>` nie zaśmiecają listy punktów orientacyjnych:

| Kontekst w drzewie DOM | Przypisana rola ARIA | Czy tworzy landmark |
| :--- | :--- | :--- |
| `<body>` → `<header>` | `banner` | Tak |
| `<article>` → `<header>` | `generic` | Nie |
| `<body>` → `<footer>` | `contentinfo` | Tak |
| `<article>` → `<footer>` | `generic` | Nie |
| `<section>` (bez nazwy) | `generic` | Nie |
| `<section aria-labelledby="...">` | `region` | Tak |

<h4>3. Kolejność fokusu i link Skip-to-content</h4>

Osoby nawigujące wyłącznie klawiaturą (<kbd>Tab</kbd>) nie korzystają ze skrótów czytnika ekranu po landmarkach. W profesjonalnych interfejsach pierwszym fokusalnym elementem wewnątrz `<body>` jest ukryty wizualnie link `<a href="#tresc-glowna">Przejdź do treści głównej</a>`, który odsłania się przy otrzymaniu fokusu (`:focus`) i przenosi kursor klawiatury bezpośrednio do `<main id="tresc-glowna" tabindex="-1">`.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Semantyka buduje drzewo dostępności**: znaczniki `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>` i `<footer>` tworzą punkty orientacyjne dla czytników ekranu, podczas gdy `<div>` pozostaje przezroczystym pudełkiem do układów CSS.
- **Wiele nawigacji wymaga `aria-label`**: gdy na stronie występuje więcej niż jeden tag `<nav>`, nazwij każdy z nich unikalną etykietą opisującą jego funkcję.
- **Jeden `<main>` na dokument**: obejmuje unikalną treść podstrony, a globalny `<header>` i `<footer>` pozostają na zewnątrz.
- **`<article>` oznacza samodzielność, `<section>` to rozdział**: jeśli fragment ma pełny sens po wycięciu ze strony, użyj `<article>`; gdy dzielisz treść na rozdziały z nagłówkami, wybierz `<section>`.
- **Atrybut `aria-labelledby` na `<section>` rezerwuj dla widgetów aplikacji**: zwykłych rozdziałów tekstu nie oznaczaj etykietami ARIA, aby uniknąć **_zanieczyszczenia punktów orientacyjnych_**.

> [!TIP]
> Chcesz przećwiczyć projektowanie układów HTML na dodatkowych zestawach praktycznych? Sprawdź [Katalog zadań praktycznych](/arkusze/?qual=INF.03&tag=HTML).
