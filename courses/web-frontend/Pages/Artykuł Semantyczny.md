# Artykuł Semantyczny

Poprzednia lekcja nauczyła Cię budować czysty szkielet dokumentu HTML. Wiesz już, jak połączyć strony linkami, jak ułożyć listę i jak stworzyć podstawową hierarchię nagłówków.

Teraz zrobimy krok dalej.

Zbudujesz artykuł internetowy, który nie jest tylko zbiorem pudełek na tekst. Będzie miał strukturę zrozumiałą dla człowieka, przeglądarki, wyszukiwarki i technologii asystujących.

Najważniejsza zasada tej lekcji brzmi prosto: <strong>HTML opisuje znaczenie treści, a CSS opisuje jej wygląd</strong>.

Jeśli używasz tagu tylko dlatego, że daje większą czcionkę albo pogrubienie, mieszasz dwa różne poziomy pracy. To szybko prowadzi do kodu, który wygląda dobrze na ekranie, ale jest słaby architektonicznie.

W tej lekcji będziemy patrzeć na semantykę z trzech stron:

- **dla człowieka**, który czyta i utrzymuje kod,
- **dla technologii asystujących**, które próbują zbudować użyteczny obraz strony,
- <strong>dla maszyn</strong>, czyli wyszukiwarek, parserów i modeli AI, które analizują strukturę dokumentu.

To ważne, bo semantyka nie zawsze daje natychmiastowy efekt słyszalny w czytniku ekranu. <strong>Nadal jest jednak informacją zapisaną w dokumencie</strong>. Dobry HTML nie jest dekoracją dla walidatora. Jest umową: mówisz możliwie jasno, czym jest każdy fragment treści.

---

## 🏛️ Semantyczne klocki HTML5: nowe kontenery

Zanim HTML5 stał się standardem, układ strony bardzo często budowano prawie wyłącznie z tagu <code>&lt;div&gt;</code>.

Div do menu. Div do artykułu. Div do stopki. Div wewnątrz diva.

Dla przeglądarki i czytnika ekranu był to anonimowy tłum kontenerów. Kod działał, ale jego struktura niewiele mówiła o treści.

HTML5 dał nam zestaw _**klocków semantycznych**_. To tagi, które nadal są kontenerami, ale mają nazwę opisującą rolę danego fragmentu strony.

Kluczowe tagi semantyczne, które musisz znać:

```html
<header>    <!-- Nagłówek strony lub sekcji: logo, tytuł, nawigacja -->
<nav>       <!-- Blok linków nawigacyjnych -->
<main>      <!-- Główna, unikalna treść całej strony -->
<article>   <!-- Samodzielna publikacja: wpis, artykuł, raport -->
<section>   <!-- Tematyczna część większej całości -->
<aside>     <!-- Treść poboczna: sidebar, linki powiązane, przypisy, reklamy -->
<footer>    <!-- Stopka strony, artykułu lub sekcji -->
```

Każdy z tych tagów zachowuje się wizualnie podobnie do <code>&lt;div&gt;</code>. Różnica nie leży w wyglądzie.

Różnica leży w informacji.

Programista widzi szybciej, gdzie zaczyna się artykuł. Czytnik ekranu może lepiej przedstawić układ strony. Wyszukiwarka łatwiej rozpoznaje, która treść jest główna, a która pomocnicza.

Nie oznacza to, że <code>&lt;div&gt;</code> jest zły. Nadal używa się go do grupowania elementów, gdy nie ma lepszego znaczeniowo tagu.

Dobry wybór wygląda tak:

- **Masz fragment z konkretną rolą**: użyj tagu semantycznego.
- **Masz grupę tylko do stylowania lub układu**: użyj <code>&lt;div&gt;</code>.
- **Masz wątpliwość**: zapytaj, czy ten element ma nazwę w strukturze treści, czy tylko pomaga w wyglądzie.

<data-gate>
  <data-connection-matcher title="Dopasuj tag semantyczny do jego roli w dokumencie:">
    <div class="cmw-item" data-left="`&amp;lt;main&amp;gt;`" data-right="Unikalny kontener głównej treści strony. Może być tylko jeden."></div>
    <div class="cmw-item" data-left="`&amp;lt;article&amp;gt;`" data-right="Niezależna publikacja: blog post, artykuł naukowy, wpis forum."></div>
    <div class="cmw-item" data-left="`&amp;lt;aside&amp;gt;`" data-right="Treść poboczna niezwiązana bezpośrednio z artykułem: sidebar, reklama."></div>
    <div class="cmw-item" data-left="`&amp;lt;nav&amp;gt;`" data-right="Blok linków do nawigacji po stronie lub serwisie."></div>
    <div class="cmw-item" data-left="`&amp;lt;footer&amp;gt;`" data-right="Stopka dokumentu: prawa autorskie, kontakt, linki pomocnicze."></div>
  </data-connection-matcher>
</data-gate>

---

## 🧭 Nawigacja: globalna, lokalna i kontekstowa

Tag <code>&lt;nav&gt;</code> nie oznacza każdego miejsca, w którym pojawia się link.

Oznacza ważny blok linków służących do poruszania się po stronie, artykule albo serwisie.

To rozróżnienie jest praktyczne. Na jednej stronie możesz mieć kilka różnych nawigacji i każda może mieć inną rolę.

### 🌐 Nawigacja główna serwisu

Nawigacja główna prowadzi między najważniejszymi częściami serwisu.

Zwykle znajduje się w <code>&lt;header&gt;</code>, bo jest częścią stałego nagłówka strony.

```html
<header>
    <span class="logo">Mój Blog o Technologii</span>

    <nav aria-label="Główna nawigacja">
        <ul>
            <li><a href="index.html">Strona główna</a></li>
            <li><a href="artykuly.html">Artykuły</a></li>
            <li><a href="kontakt.html">Kontakt</a></li>
        </ul>
    </nav>
</header>
```

To menu odpowiada na pytanie: „gdzie mogę przejść w ramach całego serwisu?”.

Nie jest częścią treści artykułu. Jest częścią interfejsu strony.

### 📚 Nawigacja między artykułami

Nawigacja między artykułami prowadzi do innych publikacji.

Może znaleźć się w <code>&lt;aside&gt;</code>, jeśli jest poboczna wobec aktualnego tekstu. Może też pojawić się po artykule, gdy służy do przejścia do poprzedniego lub następnego wpisu.

```html
<aside>
    <h2>Powiązane artykuły</h2>

    <nav aria-label="Powiązane artykuły">
        <ul>
            <li><a href="aaron-swartz.html">Aaron Swartz i wolna wiedza</a></li>
            <li><a href="creative-commons.html">Creative Commons</a></li>
        </ul>
    </nav>
</aside>
```

Ta nawigacja odpowiada na inne pytanie: „co mogę przeczytać po tym artykule?”.

Nie zastępuje menu głównego. Ma własny kontekst.

### 🧩 Nawigacja po sekcjach artykułu

Artykuł może mieć też spis treści prowadzący do sekcji na tej samej stronie.

To jest nawigacja kontekstowa. Działa wewnątrz jednego tekstu.

```html
<article>
    <h1>Sci-Hub: Kontrowersyjna Biblioteka Nauki</h1>

    <nav aria-label="Spis treści artykułu">
        <ol>
            <li><a href="#historia">Historia i geneza</a></li>
            <li><a href="#prawo">Kontrowersje prawne</a></li>
            <li><a href="#dostep">Dostęp do wiedzy</a></li>
        </ol>
    </nav>

    <section id="historia">
        <h2>Historia i geneza</h2>
        <p>Alexandra Elbakyan stworzyła platformę w 2011 roku...</p>
    </section>

    <section id="prawo">
        <h2>Kontrowersje prawne</h2>
        <p>Największe wydawnictwa naukowe pozwały serwis...</p>
    </section>

    <section id="dostep">
        <h2>Dostęp do wiedzy</h2>
        <p>Spór o Sci-Hub dotyczy także modelu dystrybucji badań...</p>
    </section>
</article>
```

Tutaj linki z <code>&lt;nav&gt;</code> nie prowadzą do innych stron. Prowadzą do elementów z konkretnym `id`.

To nadal jest poprawna nawigacja, ponieważ pomaga użytkownikowi poruszać się po dużej treści.

### 🏷️ Dlaczego <code>aria-label</code> ma znaczenie

Jeśli na stronie masz kilka elementów <code>&lt;nav&gt;</code>, użytkownik czytnika ekranu może usłyszeć listę nawigacji.

Bez etykiet brzmią podobnie. Z etykietami stają się rozróżnialne:

```html
<nav aria-label="Główna nawigacja">...</nav>
<nav aria-label="Spis treści artykułu">...</nav>
<nav aria-label="Powiązane artykuły">...</nav>
```

Nie dodajesz etykiety dla ozdoby. Dodajesz ją, żeby nazwać funkcję konkretnej nawigacji.

Krótka reguła:

- **Menu serwisu**: <code>&lt;nav aria-label="Główna nawigacja"&gt;</code>.
- **Spis treści artykułu**: <code>&lt;nav aria-label="Spis treści artykułu"&gt;</code>.
- **Linki do podobnych publikacji**: <code>&lt;nav aria-label="Powiązane artykuły"&gt;</code>.

---

## 📐 Układ artykułu z semantycznym szkieletem

Oto pełniejsza struktura artykułu blogowego.

Zwróć uwagę, że zawiera trzy różne typy nawigacji. Każda ma inny cel.

```html
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sci-Hub: Kontrowersyjna Biblioteka Nauki | Mój Blog o Technologii</title>
</head>

<body>

    <header>
        <span class="logo">Mój Blog o Technologii</span>

        <nav aria-label="Główna nawigacja">
            <ul>
                <li><a href="index.html">Strona główna</a></li>
                <li><a href="artykuly.html">Artykuły</a></li>
                <li><a href="kontakt.html">Kontakt</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h1>Sci-Hub: Kontrowersyjna Biblioteka Nauki</h1>
                <p>Artykuł opublikowany: <time datetime="2026-06-16">16 czerwca 2026</time></p>
            </header>

            <nav aria-label="Spis treści artykułu">
                <ol>
                    <li><a href="#historia">Historia i geneza</a></li>
                    <li><a href="#prawo">Kontrowersje prawne</a></li>
                </ol>
            </nav>

            <section id="historia">
                <h2>Historia i geneza</h2>
                <p>Alexandra Elbakyan stworzyła platformę w 2011 roku...</p>
            </section>

            <section id="prawo">
                <h2>Kontrowersje prawne</h2>
                <p>Największe wydawnictwa naukowe pozwały serwis...</p>
            </section>

            <footer>
                <p>Autorka: Alexandra Elbakyan</p>
            </footer>
        </article>

        <aside>
            <h2>Powiązane artykuły</h2>

            <nav aria-label="Powiązane artykuły">
                <ul>
                    <li><a href="aaron-swartz.html">Aaron Swartz i wolna wiedza</a></li>
                    <li><a href="creative-commons.html">Creative Commons</a></li>
                </ul>
            </nav>
        </aside>
    </main>

    <footer>
        <p>&copy; 2026 Mój Blog o Technologii. Wszelkie prawa zastrzeżone.</p>
    </footer>

</body>
</html>
```

Ten przykład pokazuje kilka ważnych decyzji.

- **`<main>` jest jeden**: obejmuje unikalną treść tej konkretnej strony. Nie wkładaj do niego globalnego nagłówka ani globalnej stopki.
- **`<article>` ma własny nagłówek**: tytuł artykułu i data publikacji należą do publikacji, nie do całego serwisu.
- **`<header>` może wystąpić więcej niż raz**: jeden jest nagłówkiem strony, drugi nagłówkiem artykułu. To poprawne, bo ich kontekst jest inny.
- **`<footer>` też może wystąpić więcej niż raz**: stopka artykułu może zawierać autora, a stopka strony prawa autorskie i sekcję kontaktową.
- **`<aside>` stoi obok artykułu**: powiązane linki są pomocnicze wobec tekstu, ale nie są jego główną treścią. Często jest też wykorzystywany do umieszczania reklam w obrębie całej strony.
- **Nazwa bloga nie powinna przejmować roli tytułu artykułu**: na stronie publikacji najważniejszym nagłówkiem jest tytuł tekstu. Nazwa serwisu może być zwykłym elementem identyfikacji marki, na przykład tekstem w <code>&lt;span class="logo"&gt;</code>.


---

## 🧱 <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code> czy <code>&lt;div&gt;</code>

To jest jeden z tych wyborów, które na początku wyglądają podobnie.

Wszystkie trzy tagi mogą „opakować” fragment strony. Różnią się tym, co mówią o treści.

Zacznij od pytania: „czy ten fragment ma własne znaczenie, czy tylko pomaga mi ułożyć elementy na ekranie?”.

<code>&lt;article&gt;</code> wybierasz wtedy, gdy fragment może istnieć samodzielnie poza aktualną stroną.

Dobrym przykładem jest wpis blogowy, news, komentarz, post na forum albo karta produktu. Każdy z tych fragmentów da się przenieść do kanału RSS, wyników wyszukiwania albo osobnego widoku i nadal będzie miał sens.

```html
<article>
    <h1>Jak działa HTTPS?</h1>
    <p>Krótki artykuł wyjaśniający szyfrowanie połączenia...</p>
</article>
```

<code>&lt;section&gt;</code> wybierasz wtedy, gdy fragment jest tematyczną częścią większej całości.

Sekcja „Historia i geneza” w artykule nie jest osobną publikacją. Jest rozdziałem. Tak samo sekcja „Wymagania systemowe” w dokumentacji albo sekcja „Parametry techniczne” na stronie produktu.

```html
<article>
    <h1>Jak działa HTTPS?</h1>

    <section>
        <h2>Certyfikat TLS</h2>
        <p>Certyfikat pomaga potwierdzić tożsamość serwera...</p>
    </section>
</article>
```

<code>&lt;section&gt;</code> może też porządkować większy interfejs, jeśli dany fragment ma wyraźny temat.

Na stronie z katalogiem filmów mogą istnieć sekcje „Filmy animowane”, „Dramaty” i „Komedie”. To nie są rozdziały artykułu, ale nadal są logicznymi obszarami treści.

<code>&lt;div&gt;</code> zostaje na sytuacje, w których nie dodajesz znaczenia.

Jeśli potrzebujesz wrappera do CSS, grupy inputów do ułożenia w siatce albo kontenera na przyciski, zwykły <code>&lt;div&gt;</code> jest uczciwszy niż udawana semantyka.

> **Praktyczny test:**
> - **Da się wysłać jako samodzielny materiał?** Użyj <code>&lt;article&gt;</code>.
> - **To rozdział albo tematyczna część większej całości?** Użyj <code>&lt;section&gt;</code>.
> - **To logiczny obszar interfejsu z własnym tematem?** Użyj <code>&lt;section&gt;</code>.
> - **To tylko pudełko do układu albo stylowania?** Użyj <code>&lt;div&gt;</code>.

### ⚓ Nagłówki sekcji i ARIA

Sekcja powinna mieć nazwę. W zwykłym artykule najprostsza i najlepsza nazwa to nagłówek wewnątrz sekcji.

Nie potrzebujesz wtedy `aria-labelledby`.

```html
<article>
    <h1>Tytuł artykułu</h1>

    <section>
        <h2>Pierwszy rozdział</h2>
        <p>Treść pierwszego rozdziału...</p>

        <section>
            <h3>Podrozdział pierwszego rozdziału</h3>
            <p>Treść podrozdziału...</p>
        </section>
    </section>

    <section>
        <h2>Drugi rozdział</h2>
        <p>Treść drugiego rozdziału...</p>
    </section>
</article>
```

To jest poprawna struktura.

Nagłówek znajduje się w sekcji, więc czytelnik i technologia asystująca dostają spójny układ: najpierw temat, potem treść.

`aria-labelledby` przydaje się wtedy, gdy nazwa elementu pochodzi z innego miejsca albo tworzysz komponent interfejsu i chcesz jawnie wskazać jego etykietę.

```html
<section class="quiz-widget" aria-labelledby="quiz-heading">
    <h2 id="quiz-heading">Szybki quiz tematyczny</h2>
    <p>Sprawdź, czy rozpoznajesz tagi semantyczne.</p>
</section>
```

To jest opcjonalne ulepszenie, nie obowiązek dla każdej sekcji.

Unikaj takiego układu:

```html
<h2 id="pierwszy-rozdzial">Pierwszy rozdział</h2>

<section aria-labelledby="pierwszy-rozdzial">
    <p>Treść pierwszego rozdziału...</p>
</section>
```

Problem polega na tym, że nagłówek stoi poza sekcją. Kod próbuje później „dokleić” go przez ARIA.

W artykule lepiej zrobić prościej: włóż nagłówek do sekcji.

Pamiętaj też o kolejności nagłówków. Nie przeskakuj z <code>&lt;h1&gt;</code> do <code>&lt;h4&gt;</code> tylko dlatego, że <code>&lt;h4&gt;</code> wygląda ładniej.

Wygląd ustawisz w CSS. Znaczenie zostawiasz w HTML.

---

## 🔤 Semantyka tekstu: <code>&lt;strong&gt;</code> vs <code>&lt;b&gt;</code>, <code>&lt;em&gt;</code> vs <code>&lt;i&gt;</code>

Pogrubienie i kursywa wyglądają prosto. W HTML mają jednak dwa różne poziomy znaczenia.

Jedne tagi opisują wygląd. Drugie opisują sens.

### 🎭 Wygląd a znaczenie

HTML5 dzieli tagi tekstowe na dwie grupy:

- **Tagi prezentacyjne**: opisują efekt wizualny.
- **Tagi semantyczne**: opisują znaczenie tekstu.

To nie jest akademicka różnica. Wyszukiwarki, parsery, narzędzia automatyczne i modele AI mogą lepiej rozpoznać sens treści oznaczonej semantycznie.

Z czytnikami ekranu sprawa jest bardziej przyziemna.

Semantyka pomaga, ale nie daje gwarancji, że każdy czytnik odczyta każdy niuans tak samo.

### ✅ <code>&lt;strong&gt;</code> oznacza ważność

Tag <code>&lt;strong&gt;</code> oznacza, że zawarty tekst ma <strong>krytyczne lub bardzo ważne znaczenie w danym kontekście</strong>.

```html
<p>
    Przed usunięciem konta
    <strong>pobierz kopię swoich danych</strong>.
    Tej operacji nie da się cofnąć.
</p>
```

Użyj go wtedy, gdy pominięcie informacji może doprowadzić do błędu, utraty danych albo złej decyzji.

<strong>Nie używaj <code>&lt;strong&gt;</code> tylko po to, żeby tekst był grubszy</strong>.

### 🎨 <code>&lt;b&gt;</code> oznacza wyróżnienie wizualne

Tag <code>&lt;b&gt;</code> daje pogrubienie bez dodatkowej semantycznej wagi.

Nadaje się do nazw własnych, słów kluczowych we wstępie albo terminów, które chcesz wyłowić wzrokiem.

```html
<p>
    Oprogramowanie <b>Visual Studio Code</b>
    zostało stworzone przez Microsoft.
</p>
```

To nadal może być poprawny tag. Warunek jest jeden: nie udawaj nim ostrzeżenia ani instrukcji krytycznej.

### ✅ <code>&lt;em&gt;</code> oznacza emfazę

Tag <code>&lt;em&gt;</code> oznacza nacisk, który zmienia sens zdania.

```html
<p>Nie mówię, że to Twoja wina. Mówię, że to <em>mogła</em> być Twoja wina.</p>
```

Przesunięcie emfazy zmienia komunikat:

```html
<p><em>Nie</em> mówię, że to Twoja wina.</p>
<p>Nie mówię, że to <em>Twoja</em> wina.</p>
```

To są inne znaczenia, mimo że słowa prawie się nie zmieniły.

### 🎨 <code>&lt;i&gt;</code> oznacza kursywę bez emfazy

Tag <code>&lt;i&gt;</code> stosuje kursywę bez semantycznego nacisku.

Pasuje do terminów obcojęzycznych, tytułów dzieł, nazw technicznych albo zapisu konwencji.

```html
<p>Architektura oparta na zasadzie <i>separation of concerns</i> jest łatwiejsza w utrzymaniu.</p>
<p>Plik ma rozszerzenie <i>.exe</i>, czyli jest plikiem wykonywalnym w systemie Windows.</p>
```

### 📊 Porównanie w tabeli

| Tag | Wygląd | Semantyka | Kiedy stosować |
| :--- | :--- | :--- | :--- |
| <code>&lt;strong&gt;</code> | Pogrubienie | Ważna lub krytyczna informacja | Ostrzeżenia, skutki nieodwracalne, instrukcje bezpieczeństwa |
| <code>&lt;b&gt;</code> | Pogrubienie | Brak dodatkowej wagi | Nazwy własne, słowa kluczowe, wizualne wyróżnienie |
| <code>&lt;em&gt;</code> | Kursywa | Emfaza zmieniająca sens | Słowo, które zmienia intencję zdania |
| <code>&lt;i&gt;</code> | Kursywa | Brak emfazy | Terminy obce, tytuły, konwencje techniczne |

### 🧪 Rzeczywistość czytników ekranu

Tu trzeba powiedzieć rzecz niewygodną, ale ważną.

HTML ma znaczenie semantyczne, ale czytnik ekranu nie musi odczytać każdego znaczenia w sposób słyszalny.

Na przykład NVDA w typowej konfiguracji potrafi przejść obojętnie obok różnicy między <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code> i zwykłym tekstem. Może też nie rozwinąć automatycznie skrótu z <code>&lt;abbr title="..."&gt;</code>.

Częściowo wynika to z historii webu. Przez lata ogromna liczba stron była budowana z anonimowych <code>&lt;div&gt;</code>, przypadkowych ról i skryptów, które udawały prawdziwe kontrolki. Technologie asystujące musiały nauczyć się działać w świecie niedoskonałego kodu. Dlatego współczesny czytnik ekranu nie jest prostym „lektorem HTML-a”. Jest programem, który interpretuje stronę przez przeglądarkę, system operacyjny, drzewo dostępności i własne ustawienia użytkownika.

<strong>To nie znaczy, że te tagi są bez sensu</strong>.

Znaczy to, że semantyka ma kilka odbiorców naraz:

- **Przeglądarka** buduje drzewo DOM i drzewo dostępności.
- **Czytnik ekranu** korzysta z tego drzewa, ale interpretuje je po swojemu.
- **Wyszukiwarka** analizuje strukturę treści i linków.
- **Narzędzia automatyczne** sprawdzają poprawność dokumentu.
- **Modele AI i parsery** łatwiej rozpoznają, co jest tytułem, datą, ostrzeżeniem, cytatem albo główną treścią.

WCAG nie jest magiczną tarczą.

To standard, który mówi, jak projektować dostępniej. Rzeczywiste działanie zależy jednak od przeglądarki, systemu operacyjnego, czytnika ekranu, ustawień użytkownika i jakości kodu JavaScript.

Dlatego nie pisz:

```html
<p>To jest <strong>bardzo ważne</strong>.</p>
```

z założeniem, że każdy użytkownik usłyszy specjalny ton głosu.

Pisz tak dlatego, że informacja naprawdę jest ważna. A jeśli komunikat jest krytyczny, <strong>dopisz go jasno w treści</strong>:

```html
<p>
    <strong>Uwaga:</strong>
    usunięcie konta trwale skasuje zapisane dane.
</p>
```

Słowo „Uwaga” robi tu pracę także wtedy, gdy czytnik nie ogłosi semantycznej wagi tagu <code>&lt;strong&gt;</code>.

Sprawdź teraz, czy umiesz odróżnić semantyczną wagę informacji od samego efektu pogrubienia.

<data-gate>
  <data-quiz>
    <question>Piszesz dokumentację techniczną. Pojawia się zdanie ostrzegające o nieodwracalnej operacji usunięcia danych. Który tag powinieneś zastosować?</question>
    <options>
      <item correct>
<code>&lt;strong&gt;</code> - bo komunikat ma krytyczne znaczenie dla bezpieczeństwa. Czytnik ekranu może, ale nie musi zaznaczyć tę ważność w mowie; narzędzia analizujące dokument dostają jednak informację o wadze treści.
      </item>
      <item>
<code>&lt;b&gt;</code> - bo chcesz, żeby tekst ostrzeżenia wyglądał na pogrubiony i przykuwał wzrok.
      </item>
      <item>
<code>&lt;em&gt;</code> - bo chcesz podkreślić emfazę na słowie „nieodwracalny” w środku zdania.
      </item>
      <item>
<code>&lt;i&gt;</code> - bo ostrzeżenia techniczne są zwyczajowo pisane kursywą.
      </item>
    </options>
    <div data-hint="error">
      Zastanów się, co się stanie, gdy ktoś korzystający z czytnika ekranu trafi na to ostrzeżenie. Który tag informuje maszynę, że treść jest naprawdę ważna?
    </div>
    <div data-hint="success">
      Dobrze. <code>&lt;strong&gt;</code> komunikuje semantyczną wagę treści. <code>&lt;b&gt;</code> daje tylko efekt wizualny.
    </div>
  </data-quiz>
</data-gate>

---

## 📝 Inne przydatne tagi śródtekstowe

Artykuł techniczny rzadko składa się wyłącznie z akapitów.

Pojawiają się w nim cytaty, kod, skróty, daty i obrazy. Dla każdego z tych przypadków HTML ma tag, który opisuje rolę treści.

### 💬 <code>&lt;blockquote&gt;</code> i <code>&lt;cite&gt;</code> dla cytatów

<code>&lt;blockquote&gt;</code> oznacza dłuższy cytat z zewnętrznego źródła.

<code>&lt;cite&gt;</code> oznacza tytuł dzieła, nazwę źródła albo autora cytowanej publikacji.

```html
<blockquote cite="https://www.w3.org/WAI/WCAG21/Understanding/">
    <p>Treść powinna być dostępna dla każdego użytkownika.</p>
    <footer>
        Źródło: <cite>Web Content Accessibility Guidelines (WCAG) 2.1</cite>
    </footer>
</blockquote>
```

Atrybut `cite` w <code>&lt;blockquote&gt;</code> przechowuje adres źródła. Przeglądarka zwykle go nie pokazuje, ale kod staje się dokładniejszy semantycznie.

Nie używaj <code>&lt;blockquote&gt;</code> tylko do wcięcia tekstu. Do wyglądu służy CSS.

### 💻 <code>&lt;code&gt;</code> i <code>&lt;pre&gt;</code> dla kodu

Tag <code>&lt;code&gt;</code> oznacza fragment kodu w tekście.

Tag <code>&lt;pre&gt;</code> zachowuje spacje, wcięcia i nowe linie. Dlatego często owija się nim większy blok kodu.

```html
<p>Metoda <code>querySelector()</code> zwraca pierwszy pasujący element.</p>

<pre><code>function hello(name) {
    return "Cześć, " + name;
}</code></pre>
```

Zwróć uwagę na zagnieżdżenie. <code>&lt;pre&gt;</code> dba o układ, a <code>&lt;code&gt;</code> mówi, że zawartość jest kodem.

### 📅 <code>&lt;time&gt;</code> czyli data dla maszyny

W artykule data publikacji może wyglądać po ludzku:

```html
<p>Artykuł opublikowany: <time datetime="2024-01-15">15 stycznia 2024</time></p>
```

Tekst „15 stycznia 2024” jest dla czytelnika. Wartość `2024-01-15` jest dla maszyny.

Format `datetime` korzysta ze standardu _**ISO 8601**_. <strong>Najpierw zapisujesz rok, potem miesiąc, potem dzień</strong>.

> [!NOTE]
> _**ISO 8601**_ w HTML-u nie oznacza, że użytkownik ma widzieć datę w takim zapisie.
> To format techniczny dla przeglądarek, robotów, wyszukiwarek, kalendarzy i modeli językowych.
> W Polsce naturalny tekst to zwykle „15 stycznia 2024” albo „15.01.2024”, ale w atrybucie `datetime` nadal zapisujesz `2024-01-15`.

Przykłady:

- **Pełna data**: `2024-01-15`.
- **Miesiąc**: `2013-01`.
- **Rok**: `2019`.
- **Godzina**: `14:30`.
- **Zakres dat**: `2024-01-01/2024-12-31`.

Poniższa mapa nie koloruje kontynentów.
Format daty jest zwyczajem kraju, języka i systemu, a nie prostą cechą geografii.
Spójrz na nią jak na ostrzeżenie przed jednym odruchem: „wszędzie zapiszę datę tak samo”.
Człowiek czyta datę lokalnie, a maszyna potrzebuje zapisu jednoznacznego.

![Mapa świata z krótkimi formatami zapisu dat według kraju: Polska używa kolejności dzień-miesiąc-rok, USA miesiąc-dzień-rok, a część krajów Azji i Europy używa kolejności rok-miesiąc-dzień.](/public/courses/web-frontend/Images/date-format-map.svg)

> PS. Otwórz ten obraz w nowej karcie, a po najechaniu na niego myszką zobaczysz dymek z nazwą kraju oraz formatem zapisu daty w nim stosowanym. 😉

```html
<p>Facebook uruchomił wersję <code>.onion</code> w
    <time datetime="2014">2014</time> roku.</p>

<p>Spotkanie odbędzie się o
    <time datetime="14:30">wpół do trzeciej</time>.</p>

<p>BBC udostępniło mirror w sieci Tor w
    <time datetime="2019">2019</time> roku.</p>
```

<code>&lt;time&gt;</code> ma sens tylko wtedy, gdy data jest jednoznaczna.

```html
<!-- Niepoprawnie: „lata 90.” to opis epoki, nie jedna data -->
<p>Projekt powstał w <time datetime="1990">latach 90.</time></p>
```

Taki zapis jest <strong>błędny semantycznie</strong>. Kod mówi „1990”, ale tekst mówi „cała dekada”.

### 🔤 <code>&lt;abbr&gt;</code> czyli skrót z kontekstem

Tag <code>&lt;abbr&gt;</code> oznacza skrót albo akronim, a atrybut `title` przechowuje jego rozwinięcie.
To nie jest tylko „ładniejszy zapis”.
W wielu desktopowych przeglądarkach po najechaniu myszką na skrót pojawia się natywny tooltip z rozwinięciem.
Dla maszyn powstaje też wyraźna para: widoczny skrót oraz jego pełna nazwa.

```html
<p>
    System <abbr title="Content Management System">CMS</abbr>
    zarządza treścią w panelu administracyjnym.
</p>
```

<strong>Użyj go przy pierwszym wystąpieniu skrótu</strong>, jeśli odbiorca może go nie znać albo jeśli rozwinięcie pomaga robotom, wyszukiwarkom, translatorom i modelom AI poprawnie rozpoznać temat.
Skrót `CMS` sam w sobie jest wieloznaczny; `Content Management System` zamyka interpretację.

```html
<p>
    Standard <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>
    definiuje wymogi dostępności cyfrowej.
</p>

<p>
    Blokady <abbr title="Domain Name System">DNS</abbr>
    utrudniają dostęp do stron.
</p>
```

Jednocześnie nie chowaj ważnej informacji wyłącznie w tooltipie.
Tooltip z `title` jest wygodny dla użytkownika myszy, ale bywa słaby na telefonie, nie zawsze jest dostępny z klawiatury i nie każdy czytnik ekranu odczyta go tak, jak oczekujesz.
Jeśli rozwinięcie jest krytyczne dla zrozumienia tekstu, <strong>podaj je normalnie w treści</strong>, a <code>&lt;abbr&gt;</code> potraktuj jako dodatkową warstwę semantyczną.

Nie każdy skrót wymaga opakowania.
Jeśli skrót jest powszechny w kontekście lekcji albo rozwinięcie już stoi obok, <code>&lt;abbr&gt;</code> może być zbędny dla człowieka.
Może jednak nadal mieć sens maszynowo, gdy zależy ci na precyzyjnym powiązaniu skrótu z pojęciem.

```html
<!-- Często wystarczy: rozwinięcie jest już podane w widocznym tekście -->
<p>SaaS (<em>Software as a Service</em>)</p>
```

---

## 🖼️ Obrazy z opisem: <code>&lt;img&gt;</code> i atrybut `alt`

Obraz w HTML ma co najmniej dwa ważne atrybuty.

`src` wskazuje plik. `alt` opisuje zawartość albo funkcję obrazu.

```html
<img src="images/diagram-sieci.png" alt="Schemat połączeń między serwerem a klientem przez protokół HTTPS">
```

Atrybut `alt` nie jest ozdobnym komentarzem. <strong>To tekst zastępczy</strong>.

- **Dla czytnika ekranu**: opisuje obraz osobie, która go nie widzi.
- **Dla błędu ładowania**: pojawia się, gdy grafika nie zostanie pobrana.
- **Dla wyszukiwarki**: pomaga zrozumieć kontekst grafiki.

Dobry `alt` zależy od funkcji obrazu.

```html
<!-- Źle: zbędny początek -->
<img src="logo.png" alt="Obrazek przedstawiający logo firmy">

<!-- Dobrze: krótki opis treści -->
<img src="logo.png" alt="Logo firmy KoalaLearn">

<!-- Dobrze dla dekoracji: pusty alt, ale atrybut jest obecny -->
<img src="dekoracyjna-linia.png" alt="">
```

Pusty `alt=""` oznacza: „pomiń ten obraz, jest dekoracyjny”.

<strong>Brak atrybutu <code>alt</code> to co innego.</strong> Wtedy czytnik ekranu może odczytać nazwę pliku, na przykład „dekoracyjna-linia.png”. To zwykle nie pomaga użytkownikowi.

### 🧠 Jak pisać dobry `alt`

Nie opisuj samego faktu, że obraz jest obrazem. Czytnik ekranu i tak wie, że trafił na grafikę.

Opisz informację, którą obraz wnosi do treści.

- **Zdjęcie produktu**: podaj cechy potrzebne do rozpoznania produktu.
- **Wykres**: podaj najważniejszy wniosek z danych.
- **Ikona w przycisku**: opisz działanie, na przykład `alt="Usuń"`.
- **Dekoracja**: zostaw `alt=""`.

<data-gate>
  <data-quiz>
    <question>Na stronie sklepu internetowego umieszczasz zdjęcie produktu. Jaką wartość atrybutu `alt` zastosować dla fotografii czerwonych sneakersów Nike Air Max 270?</question>
    <options>
<item>

```html
alt=""
```

<br>
To zdjęcie produktu, więc jest dekoracyjne i można je pominąć.

</item>
<item correct>

```html
alt="Czerwone buty sportowe Nike Air Max 270"
```

konkretny opis zawartości zdjęcia.

</item>
<item>

```html
alt="Zdjęcie produktu numer 4721"
```

numer SKU wystarczy do zidentyfikowania produktu w bazie.

</item>
<item>

```html
alt="Obrazek przedstawiający buty"
```

prefiks „Obrazek przedstawiający” informuje czytnik, że to grafika.

</item>
    </options>
    <div data-hint="error">
      Zastanów się, co usłyszy osoba niewidoma korzystająca z czytnika ekranu po wejściu na stronę produktu. Czy opis powinien ją zidentyfikować na tyle, by podjąć decyzję zakupową?
    </div>
    <div data-hint="success">
      Tak. Dobry `alt` dla obrazu produktu zastępuje wzrokowe postrzeganie zdjęcia. Czytnik ekranu powinien przekazać tyle informacji, by użytkownik wiedział, co dokładnie widzi na grafice.
    </div>
  </data-quiz>
</data-gate>

---

## 🧪 Decyzje semantyczne w praktyce

Semantyka nie polega na zapamiętaniu tabelki.

Polega na zadaniu właściwego pytania przy każdym fragmencie treści.

### 🧭 Pytania kontrolne

Gdy wybierasz tag, zatrzymaj się na chwilę i sprawdź:

- **Czy ten fragment jest główną treścią strony?** Jeśli tak, powinien znaleźć się w <code>&lt;main&gt;</code>.
- **Czy ten fragment jest samodzielną publikacją?** Jeśli tak, rozważ <code>&lt;article&gt;</code>.
- **Czy to rozdział większej całości?** Jeśli tak, użyj <code>&lt;section&gt;</code> z nagłówkiem.
- **Czy to linki do poruszania się po stronie lub serwisie?** Jeśli tak, użyj <code>&lt;nav&gt;</code>.
- **Czy ten blok jest poboczny wobec głównego tekstu?** Jeśli tak, rozważ <code>&lt;aside&gt;</code>.
- **Czy wyróżnienie zmienia znaczenie?** Jeśli tak, wybierz <code>&lt;strong&gt;</code> albo <code>&lt;em&gt;</code>, nie sam efekt wizualny.

### 🧩 Krótka analiza przykładu

Załóżmy, że tworzysz artykuł o HTTPS.

Masz logo strony, menu, tytuł artykułu, spis treści, trzy rozdziały, ramkę z linkami do podobnych tekstów i stopkę.

Podział może wyglądać tak:

- **Logo i menu serwisu**: <code>&lt;header&gt;</code> oraz <code>&lt;nav aria-label="Główna nawigacja"&gt;</code>.
- **Treść strony**: jeden <code>&lt;main&gt;</code>.
- **Publikacja o HTTPS**: <code>&lt;article&gt;</code>.
- **Tytuł i data publikacji**: <code>&lt;header&gt;</code> wewnątrz artykułu.
- **Spis treści artykułu**: <code>&lt;nav aria-label="Spis treści artykułu"&gt;</code>.
- **Rozdziały o certyfikacie, szyfrowaniu i zaufaniu**: trzy elementy <code>&lt;section&gt;</code>.
- **Podobne materiały**: <code>&lt;aside&gt;</code> z własną nawigacją.
- **Prawa autorskie i kontakt techniczny**: końcowy <code>&lt;footer&gt;</code>.

To jest myślenie semantyczne. Najpierw rozpoznajesz rolę treści, potem dobierasz tag.

Jeśli równolegle piszesz własny plik w edytorze, nie czekaj na „zadanie na końcu”. Po każdej większej decyzji zatrzymaj się na chwilę i sprawdź kod jak dokument:

- czy <code>&lt;main&gt;</code> obejmuje tylko unikalną treść strony,
- czy tytuł artykułu jest najważniejszym nagłówkiem widoku,
- czy sekcje mają własne nagłówki,
- czy spis treści artykułu prowadzi do istniejących `id`,
- czy linki poboczne nie udają głównej treści,
- czy <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;time&gt;</code>, <code>&lt;abbr&gt;</code> i `alt` wynikają z sensu treści.

To jest lepszy tryb pracy niż dopisywanie semantyki na końcu. Najpierw myślisz o roli fragmentu, potem zapisujesz tag. CSS przyjdzie później.

---

## 🧩 Własne widgety a dostępność

W lekcjach tego kursu spotkasz elementy typu <code>&lt;data-quiz&gt;</code> i <code>&lt;data-connection-matcher&gt;</code>.

To nie są standardowe tagi HTML.

Przeglądarka nie wie sama z siebie, że <code>&lt;data-quiz&gt;</code> jest quizem, ma pytanie, odpowiedzi i komunikaty zwrotne. Dopiero kod JavaScript zamienia taki znacznik w interaktywny komponent.

I tu zaczyna się najważniejsza część dostępności.

Jeśli widget wizualnie wygląda dobrze, ale fokus klawiatury trafia od razu na pierwszą odpowiedź, użytkownik NVDA może nie usłyszeć pytania. Dla osoby widzącej pytanie jest nad odpowiedziami. Dla osoby pracującej tabulatorem aktualnym światem jest element, który dostał fokus.

Dlatego quiz powinien po hydratacji mieć:

- pytanie jako widoczną treść,
- pytanie powiązane z grupą odpowiedzi przez `aria-labelledby`,
- odpowiedzi jako prawdziwe elementy interaktywne,
- komunikaty błędu i sukcesu w obszarze `aria-live`,
- kolejność fokusu, która nie pomija sensu zadania.

Podobnie działa matcher połączeń.

Jeśli fokus trafia tylko na małą kropkę, a ta kropka ma etykietę „punkt połączenia”, czytnik ekranu nie wie, jaki bloczek użytkownik właśnie wybrał.

Dostępna wersja musi nadać tej kropce nazwę wynikającą z treści bloczka, na przykład: „Lewy element: Blink”.

Instrukcję obsługi lepiej podać raz na poziomie całego widgetu niż powtarzać ją na każdym małym elemencie. Inaczej czytnik ekranu zaczyna mówić dużo, ale użytkownik rozumie mniej.

Strzałki w takim komponencie są wygodne dla użytkownika klawiatury, ale z czytnikiem ekranu mogą być przechwytywane przez tryb czytania. W NVDA przełączanie trybu, na przykład <span style="white-space: nowrap;"><kbd>Caps Lock</kbd> + <kbd>Spacja</kbd></span>, zmienia to, czy strzałki sterują stroną, czy widgetem.

To jest normalne napięcie między aplikacją webową a technologią asystującą.

Jeśli widget jest prosty, zwykle wystarczą prawdziwe przyciski, pola formularza, etykiety i przewidywalna kolejność fokusu.

Jeśli widget jest złożoną miniaplikacją, jak matcher połączeń z własną nawigacją strzałkami, czasem potrzebny jest tryb aplikacyjny: `role="application"` ustawione na kontenerze widgetu. To sygnał, że w tym obszarze klawisze mają trafić do komponentu, a nie do trybu przeglądania czytnika.

To nie jest rola dla każdego widgetu. Quiz jej nie potrzebuje. Matcher może jej potrzebować, bo bez niej NVDA potrafi zatrzymać strzałki, <span style="white-space: nowrap;"><kbd>Enter</kbd></span> i <span style="white-space: nowrap;"><kbd>Spacja</kbd></span> zanim dotrą do kodu ćwiczenia.

Dlatego dobry widget:

- nie opiera dostępności wyłącznie na wyglądzie,
- ma sensowną kolejność fokusu,
- ma krótkie etykiety elementów operacyjnych,
- podaje instrukcję raz, w dobrym miejscu,
- jest testowany klawiaturą i prawdziwym czytnikiem ekranu.

Zapamiętaj tę zasadę:

- **Semantyczny HTML pomaga opisać dokument**.
- **ARIA pomaga opisać niestandardową interakcję**.
- **`role="application"` pomaga tylko wybranym miniaplikacjom**.
- **Test z prawdziwym czytnikiem ekranu pokazuje, czy to faktycznie działa**.

Nie traktuj WCAG jak rytuału odhaczania atrybutów.

Traktuj je jak mapę. Mapa jest potrzebna, ale teren sprawdzasz w przeglądarce, klawiaturą i czytnikiem ekranu.

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Tagi semantyczne HTML5 opisują rolę**: <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;aside&gt;</code> i <code>&lt;footer&gt;</code> nie są dekoracją. Informują, czym jest dany fragment dokumentu.
- **Nawigacja może mieć różne funkcje**: menu główne, spis treści artykułu i linki do powiązanych publikacji to różne nawigacje. Gdy występują razem, nazwij je przez `aria-label`.
- **<code>&lt;main&gt;</code> jest unikalny**: na stronie powinien być jeden widoczny element <code>&lt;main&gt;</code>, obejmujący główną treść dokumentu.
- **<code>&lt;article&gt;</code> oznacza samodzielną publikację**: <code>&lt;section&gt;</code> oznacza rozdział lub tematyczną część większej całości.
- **<code>&lt;strong&gt;</code> to nie samo pogrubienie**: oznacza informację ważną lub krytyczną. <code>&lt;b&gt;</code> daje wyróżnienie wizualne bez tej wagi.
- **<code>&lt;em&gt;</code> to nie sama kursywa**: oznacza nacisk zmieniający sens zdania. <code>&lt;i&gt;</code> stosuj do kursywy bez emfazy.
- **Czytnik ekranu nie jest abstrakcyjną teorią**: NVDA, VoiceOver i inne narzędzia mogą różnie interpretować semantykę. Krytyczne informacje zapisuj jasno w treści, nie tylko w tagu.
- **Własne widgety wymagają jawnej dostępności**: <code>&lt;data-quiz&gt;</code> i <code>&lt;data-connection-matcher&gt;</code> muszą po hydratacji dostać role, etykiety, komunikaty i sensowną kolejność fokusu.
- **`alt` opisuje funkcję obrazu**: obraz produktu, wykres i dekoracja wymagają różnych decyzji. Pusty `alt=""` jest poprawny tylko dla dekoracji.
- **<code>&lt;time&gt;</code> z `datetime` pozwala maszynom czytać daty**: tekst może być naturalny dla człowieka, ale wartość `datetime` powinna być jednoznaczna.
