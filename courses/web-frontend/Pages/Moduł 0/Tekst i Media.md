# Tekst i Media

Masz już poprawny szkielet semantyczny strony zbudowany z `<header>`, `<main>`, `<article>` i `<aside>`. Prawdziwe problemy zaczynają się jednak wewnątrz samych akapitów. Ostrzeżenie o nieodwracalnym usunięciu konta wygląda na ekranie tak samo jak pogrubiona nazwa programu, wklejony kod źródłowy zbija się w jedną nieczytelną linię, a obrazy bez podanych wymiarów powodują gwałtowne skakanie tekstu podczas ładowania strony.

HTML nie służy do malowania liter na ekranie. Każdy znacznik śródtekstowy i multimedialny przekazuje przeglądarce, wyszukiwarce oraz technologiom asystującym konkretną intencję autora.

---

## 🔤 Semantyka tekstu: strong kontra b oraz em kontra i

Pogrubienie i kursywa to dwa najczęściej mylone obszary w HTML. Przeglądarki renderują dwie pary znaczników identycznie, ale ich znaczenie w kodzie jest zupełnie inne:

- **Znaczniki semantyczne** (`<strong>`, `<em>`): opisują wagę lub logiczny nacisk treści.
- **Znaczniki wyróżnienia wizualnego i idiomatycznego** (`<b>`, `<i>`): zaznaczają fragment wzrokowo bez nadawania mu krytycznej wagi.

### ✅ Znacznik strong oznacza krytyczną ważność

Stosuj `<strong>`, gdy pominięcie informacji grozi błędem, utratą danych albo błędną decyzją użytkownika:

```html
<p>
    Przed usunięciem konta
    <strong>pobierz kopię swoich danych</strong>.
    Tej operacji nie da się cofnąć.
</p>
```

Nie używaj `<strong>` wyłącznie po to, aby uzyskać grubszą czcionkę. Do samego wyglądu służy CSS.

### 🎨 Znacznik b oznacza wyróżnienie bez wagi

Znacznik `<b>` pogrubia tekst bez sygnału alarmowego dla maszyn. Sprawdza się przy nazwach własnych lub słowach kluczowych we wstępie, które oko czytelnika ma szybko wyłapać:

```html
<p>
    Edytor <b>Visual Studio Code</b> wspiera podgląd stron HTML.
</p>
```

### ✅ Znacznik em definiuje nacisk logiczny

Znacznik `<em>` zmienia sens logiczny wypowiedzi zależnie od tego, które słowo otacza. Zobacz różnicę w trzech wersjach tego samego zdania:

- Ja <em>nie</em> chcę tam iść (zaprzeczenie samej chęci).
- <em>Ja</em> nie chcę tam iść (ktoś inny może pójść, ale nie ja).
- Ja nie chcę <em>tam</em> iść (chcę pójść w inne miejsce).

### 🎨 Znacznik i oznacza tekst idiomatyczny

Znacznik `<i>` wydziela słowa o innym charakterze językowym, które nie zmieniają logiki zdania:
- zwroty obcojęzyczne (na przykład <i>divide et impera</i>),
- tytuły publikacji i książek (na przykład <i>Hobbit</i>),
- nazwy techniczne lub nazwy plików (na przykład <i>config.json</i>).

| Znacznik | Wygląd domyślny | Znaczenie w kodzie | Typowe zastosowanie |
| :--- | :--- | :--- | :--- |
| `<strong>` | Pogrubienie | Ważna lub krytyczna informacja | Ostrzeżenia, instrukcje bezpieczeństwa, kluczowe reguły |
| `<b>` | Pogrubienie | Wyróżnienie wizualne bez wagi | Nazwy własne, słowa kluczowe w leadzie |
| `<em>` | Kursywa | Nacisk logiczny zmieniający sens | Kontrast w zdaniu, zmiana intencji komunikatu |
| `<i>` | Kursywa | Wyróżnienie idiomatyczne | Zwroty obce, tytuły dzieł, terminy techniczne |

### 🧪 Ludzie kontra maszyny: bez mitów o czytnikach ekranu

Większość czytników ekranu (NVDA, VoiceOver) odczytuje `<strong>`, `<b>`, `<em>` i `<i>` tym samym głosem, bez zmiany intonacji. Gdyby syntezator krzyczał przy każdym pogrubieniu w sieci, słuchanie stron byłoby męczące.

Sens rozróżnienia polega na podziale odbiorców:
- **Dla człowieka**: liczy się czytelny wygląd, kontrast i rytm wzrokowy (budowany w CSS).
- **Dla maszyn**: wyszukiwarki, tryby czytnika w przeglądarkach, parsery i modele AI analizują czysty kod źródłowy. Dla nich `<strong>` i `<em>` to jasny sygnał o intencji autora.

### 🏷️ Znacznik span jako liniowy odpowiednik div

W poprzedniej lekcji poznałeś blokowy kontener `<div>`. Jego liniowym odpowiednikiem wewnątrz akapitu jest `<span>`. Nie posiada żadnego znaczenia semantycznego i domyślnie nie zmienia wyglądu tekstu:

```html
<p>
    Status połączenia: <span class="status-ok">aktywne</span>.
</p>
```

Używaj `<span>` wyłącznie wtedy, gdy musisz wydzielić fragment zdania pod późniejsze stylowanie w CSS lub pod obsługę w JavaScript.

---

## 💬 Cytaty blokowe i źródła: blockquote oraz cite

Do dłuższych cytatów służy znacznik `<blockquote>`. Informację o źródle najlepiej umieścić w jego stopce `<footer>` za pomocą znacznika `<cite>`.

W HTML istnieje także atrybut `cite="..."` na elemencie `<blockquote>`, ale jest on **_całkowicie niewidoczny dla użytkownika_** i pomijany przez wyszukiwarki. W praktyce znacznie lepiej użyć widocznego znacznika `<cite>` z linkiem `<a>` lub pełną nazwą dokumentu:

```html
<blockquote>
    <p>Treść powinna być dostępna dla każdego użytkownika, niezależnie od używanego urządzenia.</p>
    <footer>
        Źródło: <cite><a href="https://www.w3.org/WAI/WCAG21/Understanding/">Web Content Accessibility Guidelines (WCAG) 2.1</a></cite>
    </footer>
</blockquote>
```

Znacznik `<cite>` wyświetla się domyślnie kursywą, podobnie jak `<i>` oraz `<em>`:

![Porównanie tagów cite, i oraz em](/public/courses/web-frontend/Images/porównanie-cite-i-em-oraz-przedstawienie-wszystkie-3-rendery.png)

---

## 💻 Kod źródłowy w tekście: pre oraz code

### 🔮 Przewidywanie: białe znaki w p kontra pre i code

Chcesz umieścić w artykule krótki blok kodu JavaScript z wcięciami. Wpisujesz go wewnątrz zwykłego akapitu `<p>` oraz znacznika `<code>`:

```html
<p><code>function hello(name) {
    return "Cześć, " + name;
}</code></p>
```

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: czy przeglądarka zachowa trzy osobne wiersze i czterospacjowe wcięcie przed słowem `return`, czy połączy cały kod w jedną linię?

### 🔎 Obserwacja i wyjaśnienie

Przeglądarka połączy cały kod w jedną linię: `function hello(name) { return "Cześć, " + name; }`. Odpowiada za to domyślny mechanizm HTML zwany **zwijaniem białych znaków** (whitespace collapsing): dowolny ciąg spacji, tabulatorów i znaków nowej linii zamieniany jest w jedną spację.

W zwykłych akapitach to bardzo pomaga, bo możesz dowolnie łamać wiersze w edytorze kodu. W przypadku bloków kodu jest to jednak **_poważny problem czytelności_**. Rozwiązaniem jest połączenie dwóch znaczników o różnych rolach:

- `<code>` (**warstwa semantyczna**): oznacza kod źródłowy w linii tekstu lub w bloku.
- `<pre>` (**warstwa zachowania formatu**): nakazuje przeglądarce zachować dokładnie każdą spację i każdy znak nowej linii.

```html
<p>Metoda <code>querySelector()</code> zwraca pierwszy pasujący element.</p>

<pre><code>function hello(name) {
    return "Cześć, " + name;
}
</code></pre>
```

> [!WARNING]
> Przeglądarki nie kolorują automatycznie składni wewnątrz `<code>`. Wielokolorowe podświetlanie kodu wymaga dodatkowych bibliotek (takich jak `Prism.js` lub `highlight.js`) albo ręcznego ostylowania fragmentów za pomocą `<span>`.

---

## 📅 Daty dla ludzi i maszyn: time oraz ISO 8601

Zapis `04/05/2026` oznacza dla czytelnika w Polsce czwarty maja, a dla użytkownika w USA piąty kwietnia. Maszyny, kalendarze i wyszukiwarki nie mogą zgadywać konwencji regionalnej.

| Zapis tekstu na stronie | Interpretacja regionalna | Jednoznaczny zapis ISO 8601 |
| :--- | :--- | :--- |
| `04/05/2026` (Polska) | 4 maja 2026 | `2026-05-04` |
| `04/05/2026` (USA) | 5 kwietnia 2026 | `2026-04-05` |
| `15 stycznia 2026` | 15 stycznia 2026 | `2026-01-15` |

Znacznik `<time>` rozdziela czytelny tekst dla człowieka od standardu _**ISO 8601**_ w atrybucie *datetime* (zawsze od największej jednostki: rok, miesiąc, dzień):

```html
<p>Artykuł opublikowany: <time datetime="2026-01-15">15 stycznia 2026</time>.</p>
```

Najważniejsze poprawne warianty atrybutu `datetime`:
- **Pełna data**: `2026-01-15`
- **Rok i miesiąc**: `2026-01`
- **Sam rok**: `2026`
- **Godzina**: `14:30`
- **Data i godzina**: `2026-01-15T14:30` (rozdzielone literą `T`)

Jeśli opisujesz przedział czasu, użyj dwóch osobnych znaczników `<time>`:

```html
<p>
    Warsztaty trwają od <time datetime="2026-05-01">1 maja 2026</time>
    do <time datetime="2026-05-15">15 maja 2026</time>.
</p>
```

Nie używaj `<time>` dla przybliżonych epok ani niejednoznacznych określeń. Zapis `<time datetime="1990">latach 90.</time>` jest **_błędny semantycznie_**, ponieważ kod wskazuje jeden rok, a tekst obejmuje całą dekadę.

> [!WARNING]
> **Przestroga przed znacznikiem `<abbr>` i atrybutem `title`**: w starszych poradnikach spotkasz oznaczanie skrótów przez `<abbr title="Content Management System">CMS</abbr>`. To dziś martwa praktyka. Dymek z `title` nie działa na ekranach dotykowych, nie pojawia się przy nawigacji klawiszem <kbd>Tab</kbd>, a czytniki ekranu domyślnie go ignorują. Zamiast ukrywać wyjaśnienie w atrybucie, rozwijaj skrót wprost w tekście przy jego pierwszym użyciu, na przykład: „System zarządzania treścią (CMS)”.

### 🛠️ Warsztat 1: korekta semantyki tekstu, kodu i daty

Zanim przejdziesz do grafik, napraw trzy typowe błędy w poniższej notatce technicznej:
- Zamień prezentacyjne `<b>` na semantyczne `<strong>` w ostrzeżeniu o utracie danych.
- Owiń wieloliniowy fragment kodu w `<pre><code>...</code></pre>`, aby przeglądarka zachowała wcięcia.
- Zapisz datę publikacji w znaczniku `<time>` z poprawnym atrybutem `datetime="2026-05-15"`.

<data-gate>
  <data-code-runner language="html" title="Warsztat 1: Korekta strong, pre/code oraz time">
    <template data-type="code">
<p>Ostatnia aktualizacja: 15 maja 2026.</p>
<p>Przed uruchomieniem polecenia <b>wykonaj kopię zapasową bazy</b>.</p>
<p><code>SELECT nazwa, cena
FROM towary
WHERE cena &lt; 100;</code></p>
    </template>
    <template data-type="requirements">
      [
        {
          "id": "fix-time",
          "text": "Oznaczono datę znacznikiem <time datetime=\"2026-05-15\">",
          "type": "regex",
          "pattern": "<time\\b[^>]*datetime\\s*=\\s*[\"']2026-05-15[\"'][^>]*>[\\s\\S]*?</time>"
        },
        {
          "id": "fix-strong",
          "text": "Zastąpiono <b> semantycznym znacznikiem <strong> w ostrzeżeniu",
          "type": "regex",
          "pattern": "<strong\\b[^>]*>[\\s\\S]{5,}?</strong>"
        },
        {
          "id": "fix-no-b",
          "text": "Usunięto prezentacyjne <b> z komunikatu ostrzegawczego",
          "type": "not-contains",
          "pattern": "<b>"
        },
        {
          "id": "fix-pre-code",
          "text": "Umieszczono wieloliniowy blok kodu wewnątrz <pre><code>...</code></pre>",
          "type": "regex",
          "pattern": "<pre\\b[^>]*>\\s*<code\\b[^>]*>[\\s\\S]*?</code>\\s*</pre>"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🖼️ Obrazy w HTML: img, formaty plików i ścieżki

Do osadzania grafiki służy pojedynczy znacznik `<img>`. Poprawny zapis produkcyjny składa się z pięciu atrybutów:

```html
<img
    src="./images/schemat-sieci.webp"
    width="640"
    height="360"
    loading="lazy"
    alt="Schemat połączenia przeglądarki z serwerem WWW"
>
```

Zwróć uwagę na trzy techniczne detale:
- **Atrybuty *width* i *height* bez jednostki `px`**: przeglądarka od razu zna proporcje obrazu i rezerwuje miejsce w układzie przed pobraniem pliku. Chroni to czytelnika przed **_skokami układu strony_** (efektem nagłego przesuwania tekstu w dół podczas ładowania zdjęć).
- **Atrybut `loading="lazy"`**: opóźnia pobranie grafik znajdujących się daleko poniżej ekranu aż do momentu, gdy użytkownik zacznie przewijać stronę.
- **Ścieżki względne w *src***: działają tak samo jak w linkach `<a>`. Jeśli plik HTML leży w głównym folderze projektu, używasz `./images/foto.webp`. Jeśli strona leży w podfolderze `artykuly/sieci.html`, wychodzisz poziom wyżej: `../images/foto.webp`.

### 📊 Dobór formatu grafiki: JPG, PNG, WebP i SVG

Wybór niewłaściwego formatu pliku potrafi zwiększyć wagę strony dziesięciokrotnie. Dobieraj format do charakteru obrazu, nie z przyzwyczajenia:

| Format | Typ grafiki | Przezroczystość | Kiedy wybierać | Czego unikać |
| :--- | :--- | :--- | :--- | :--- |
| **JPG (JPEG)** | Rastrowy (stratny) | Nie | Fotografie i bogate sceny, gdy musisz wspierać bardzo stare narzędzia | Logo, zrzuty ekranu z tekstem (powstają artefakty kompresji) |
| **PNG** | Rastrowy (bezstratny) | Tak (kanał alfa) | Ostre zrzuty ekranu, grafiki wymagające idealnej ostrości i przezroczystości | Duże zdjęcia fotograficzne (bardzo ciężkie pliki) |
| **WebP** | Rastrowy (nowoczesny) | Tak | **Domyślny wybór na strony WWW**: zdjęcia i grafiki o 25 do 35% lżejsze niż JPG i PNG | Brak przeszkód w nowoczesnych przeglądarkach |
| **SVG** | Wektorowy (kod XML) | Tak | Ikony, proste logotypy, wykresy i schematy, które muszą być idealnie ostre w każdym powiększeniu | Fotografie i złożone obrazy malarskie |

---

## ♿ Tekst alternatywny alt oraz kontener figure

### 🔮 Przewidywanie: kiedy alt pusty, a kiedy opisowy

Na jednej stronie sklepu masz trzy obrazy osadzone przez `<img>`:
1. Cienką ozdobną linię oddzielającą sekcje (brak dodatkowej informacji).
2. Logotyp sklepu umieszczony wewnątrz linku `<a href="./index.html">` prowadzącego na stronę główną.
3. Zdjęcie bocznej krawędzi laptopa pokazujące układ portów USB-C i HDMI w recenzji technicznej.

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: który z tych trzech obrazów powinien dostać pusty atrybut `alt=""`, który wymaga opisu celu linku, a który potrzebuje dokładnego opisu zawartości zdjęcia?

### 🔎 Obserwacja i wyjaśnienie

Każdy `<img>` **musi posiadać atrybut *alt***. Jego całkowite pominięcie to **_kardynalny błąd dostępności_**, ponieważ czytnik ekranu odczyta wtedy surową nazwę pliku (na przykład `IMG_4821_final.webp`) albo zgłosi „grafika bez etykiety”.

Wartość atrybutu dobierasz jednak do roli obrazu w kontekście strony:
1. **Ozdobna linia**: `alt=""` (pusty cudzysłów). Czytnik ekranu całkowicie pomija element dekoracyjny i nie rozprasza użytkownika.
2. **Logotyp jako link**: `alt="Strona główna Sklepu"`. Opisuje funkcję odnośnika, nie wygląd samego znaku graficznego.
3. **Zdjęcie portów laptopa**: `alt="Lewa krawędź laptopa z dwoma portami USB-C oraz gniazdem HDMI"`. Zastępuje informację wzrokową, której brakuje w samym tekście.

| Rola grafiki | Poprawny atrybut `alt` | Skutek dla czytnika ekranu |
| :--- | :--- | :--- |
| Element czysto dekoracyjny | `alt=""` | Element jest bezpiecznie ignorowany |
| Obraz wewnątrz linku `<a>` | Cel linku, np. `alt="Strona główna"` | Czytnik ogłasza dokąd prowadzi odnośnik |
| Zdjęcie produktowe z podpisem obok | `alt=""` (jeśli tytuł obok wyczerpuje opis) | Brak męczącego powtarzania tej samej nazwy |
| Zdjęcie lub schemat niosący wiedzę | Konkretny opis informacji z obrazu | Użytkownik otrzymuje pełny sens grafiki |

### 🗃️ Samodzielna ilustracja z podpisem: figure i figcaption

Znacznik `<figure>` grupuje samodzielny obiekt ilustracyjny (obraz, schemat, wykres albo blok kodu), który można przenieść w inne miejsce dokumentu bez utraty sensu tekstu. Podpis dodajesz znacznikiem `<figcaption>` jako pierwszym lub ostatnim dzieckiem `<figure>`:

```html
<figure>
    <img
        src="./images/architektura-sieci.webp"
        width="640"
        height="360"
        loading="lazy"
        alt="Schemat architektury klient i serwer"
    >
    <figcaption>
        <strong>Schemat 1:</strong> Żądanie HTTP z przeglądarki przechodzi przez zaporę sieciową do serwera aplikacji, który odpytuje bazę danych i zwraca odpowiedź.
    </figcaption>
</figure>
```

Zwróć uwagę na czysty podział ról: atrybut `alt` podaje zwięzły temat ilustracji, a `<figcaption>` rozwija szczegóły techniczne widoczne dla wszystkich czytelników. Dzięki temu czytnik ekranu nie powtarza dwa razy identycznego zdania.

<data-gate>
<data-connection-matcher title="Połącz znacznik HTML z jego dokładną rolą w semantyce tekstu i mediów">
  <item left="`&lt;strong&gt;`" right="Oznacza treść krytycznie ważną, ostrzeżenie lub kluczową regułę"></item>
  <item left="`&lt;em&gt;`" right="Nadaje logiczny nacisk zmieniający sens wypowiedzi w zdaniu"></item>
  <item left="`&lt;pre&gt;&lt;code&gt;`" right="Prezentuje wieloliniowy blok kodu z zachowaniem spacji i wcięć"></item>
  <item left="`&lt;blockquote&gt;` + `&lt;cite&gt;`" right="Oznacza dłuższy cytat blokowy wraz z nazwą lub źródłem publikacji"></item>
  <item left="`&lt;time datetime=&quot;...&quot;&gt;`" right="Przekazuje maszynom jednoznaczną datę w standardzie ISO 8601"></item>
  <item left="`&lt;figure&gt;` + `&lt;figcaption&gt;`" right="Grupuje samodzielną ilustrację lub schemat razem z jego podpisem"></item>
</data-connection-matcher>
</data-gate>

---

## 🚀 Zadanie: semantyczna karta artykułu technicznego

Zbuduj kompletną semantyczną kartę fragmentu artykułu (bez używania gotowych wzorców do przeklejenia). Wyobraź sobie, że publikujesz notatkę z audytu wydajności strony internetowej.

Twój kod HTML musi zawierać wszystkie poniższe elementy:
1. Akapit z datą publikacji `15 maja 2026` zapisaną znacznikiem `<time>` z atrybutem `datetime` w formacie ISO 8601 (`2026-05-15`).
2. Krótkie ostrzeżenie lub kluczową regułę wyróżnioną znacznikiem `<strong>`.
3. Blok cytatu `<blockquote>` zawierający tekst cytatu w `<p>` oraz wskazanie źródła w znaczniku `<cite>` (na przykład nazwę specyfikacji, bez adresu zaczynającego się od `https://`).
4. Kontener `<figure>` zawierający:
   - znacznik `<img>` ze ścieżką względną (na przykład `./images/audyt-obrazow.webp`), liczbowymi atrybutami `width` i `height` (bez `px`) oraz opisowym, niepustym atrybutem `alt` (co najmniej 5 znaków),
   - podpis `<figcaption>` opisujący ilustrację (co najmniej 5 znaków).

<data-gate>
  <data-code-runner language="html" title="Semantyczna karta artykułu: time, blockquote, cite oraz figure">
    <template data-type="code">
<!-- Zbuduj semantyczną kartę artykułu: time (ISO 8601), strong, blockquote z cite oraz figure z img i figcaption -->

    </template>
    <template data-type="requirements">
      [
        {
          "id": "card-time-iso",
          "text": "Dodano znacznik <time> z atrybutem datetime w formacie ISO 8601 (2026-05-15)",
          "type": "regex",
          "pattern": "<time\\b[^>]*datetime\\s*=\\s*[\"']2026-05-15[\"'][^>]*>[\\s\\S]*?</time>"
        },
        {
          "id": "card-strong",
          "text": "Wyróżniono kluczową regułę lub ostrzeżenie znacznikiem <strong>",
          "type": "regex",
          "pattern": "<strong\\b[^>]*>[\\s\\S]{3,}?</strong>"
        },
        {
          "id": "card-blockquote-cite",
          "text": "Utworzono cytat <blockquote> zawierający źródło w znaczniku <cite>",
          "type": "regex",
          "pattern": "<blockquote\\b[^>]*>[\\s\\S]*?<cite\\b[^>]*>[\\s\\S]{3,}?</cite>[\\s\\S]*?</blockquote>"
        },
        {
          "id": "card-figure-figcaption",
          "text": "Umieszczono <img> oraz opisowy podpis <figcaption> wewnątrz <figure>",
          "type": "regex",
          "pattern": "<figure\\b[^>]*>[\\s\\S]*?<img\\b[^>]*>[\\s\\S]*?<figcaption\\b[^>]*>[\\s\\S]{5,}?</figcaption>[\\s\\S]*?</figure>"
        },
        {
          "id": "card-img-width",
          "text": "Zdefiniowano liczbowy atrybut width (bez px) na elemencie <img>",
          "type": "regex",
          "pattern": "<img\\b[^>]*width\\s*=\\s*[\"']\\d+[\"'][^>]*>"
        },
        {
          "id": "card-img-height",
          "text": "Zdefiniowano liczbowy atrybut height (bez px) na elemencie <img>",
          "type": "regex",
          "pattern": "<img\\b[^>]*height\\s*=\\s*[\"']\\d+[\"'][^>]*>"
        },
        {
          "id": "card-img-alt",
          "text": "Dodano opisowy, niepusty atrybut alt (min. 5 znaków) do elementu <img>",
          "type": "regex",
          "pattern": "<img\\b[^>]*alt\\s*=\\s*[\"'][^\"']{5,}[\"'][^>]*>"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Matematyka CLS, Preload Scanner w Blink i negocjacja formatów AVIF/WebP</span>
<span class="deep-dive-badge">CORE WEB VITALS · PRELOAD SCANNER · AVIF</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak przeglądarka wylicza proporcję z width i height przed pobraniem obrazu</h4>

W domyślnym arkuszu stylów przeglądarki (*User-Agent Stylesheet*) atrybuty HTML `width` i `height` na `<img>` mapują się na wskazówkę prezentacyjną CSS `aspect-ratio`:

```css
/* Wbudowana reguła UA w nowoczesnych silnikach (Blink, Gecko, WebKit) */
img {
    aspect-ratio: attr(width) / attr(height);
}
```

Dzięki temu, nawet jeśli później w CSS ustawisz responsywne `max-width: 100%; height: auto;`, silnik podczas pierwszego etapu *Layout* zna dokładną wysokość ramki jeszcze przed pobraniem pierwszego bajtu pliku graficznego. Utrzymuje to metrykę **CLS** (*Cumulative Layout Shift = impact fraction × distance fraction*) na poziomie `0.00`.

<h4>2. Preload Scanner i dlaczego loading="lazy" szkodzi głównemu obrazowi LCP</h4>

Gdy główny parser HTML natrafia na zasoby blokujące, w tle działa osobny, szybki **Preload Scanner** (skaner spekulatywny), który wyłapuje tagi `<img>` i uruchamia ich pobieranie z wyprzedzeniem. Dodanie `loading="lazy"` wyłącza obraz ze skanera spekulatywnego i opóźnia żądanie sieciowe aż do momentu obliczenia pełnego *Layoutu*. Dla głównego zdjęcia widocznego od razu na ekranie (**LCP**, *Largest Contentful Paint*) zamiast `loading="lazy"` stosuje się `fetchpriority="high"`.

<h4>3. Negocjacja kodeków graficznych przez znacznik picture</h4>

Format **AVIF** (oparty na kodeku wideo AV1) potrafi zmniejszyć wagę zdjęcia o kolejne 20 do 30% względem WebP. Bezpieczne podanie nowoczesnych formatów z automatycznym fallbackiem realizuje `<picture>`:

```html
<picture>
    <source srcset="./images/hero.avif" type="image/avif">
    <source srcset="./images/hero.webp" type="image/webp">
    <img src="./images/hero.jpg" width="1200" height="675" fetchpriority="high" alt="Widok serwerowni">
</picture>
```

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Rozdzielaj semantykę od wyglądu**: `<strong>` oznacza krytyczną ważność, `<em>` logiczny nacisk, natomiast `<b>`, `<i>` i `<span>` służą do wyróżnień bez narzucania maszynom fałszywej wagi.
- **Wieloliniowy kod zawsze zamykaj w `<pre><code>`**: samo `<code>` nie chroni przed zwijaniem białych znaków i wcięć przez przeglądarkę.
- **Zapisuj daty w `<time>` z formatem ISO 8601**: atrybut `datetime` ujednolica zapis dla maszyn niezależnie od języka na stronie; nie stosuj `<time>` do niejednoznacznych epok.
- **Unikaj `<abbr title="...">`**: rozwijaj skróty bezpośrednio w tekście przy pierwszym użyciu, aby były dostępne na smartfonach i dla klawiatury.
- **Dobieraj format grafiki świadomie i zawsze dodawaj `alt`, `width` oraz `height`**: domyślnie wybieraj **WebP** dla zdjęć i **SVG** dla ikon, podawaj wymiary bez `px`, a pusty `alt=""` rezerwuj wyłącznie dla grafik czysto dekoracyjnych.

> [!TIP]
> Chcesz utrwalić dobór semantyki tekstu, formatów obrazów i dostępnych podpisów na kolejnych scenariuszach? Przejdź do sekcji [Katalog zadań praktycznych](/arkusze/?qual=INF.03&tag=HTML).
