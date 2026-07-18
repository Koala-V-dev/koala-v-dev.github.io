# Struktura Semantyczna

Poprzednia lekcja nauczyła Cię budować czysty szkielet dokumentu HTML. Wiesz już, jak połączyć strony linkami, jak ułożyć listę i jak stworzyć podstawową hierarchię nagłówków.

Teraz zrobimy krok dalej. 

Zbudujesz szkielet artykułu internetowego, który nie jest tylko zbiorem bezimiennych pudełek na tekst. Będzie miał strukturę zrozumiałą dla człowieka, przeglądarki, wyszukiwarki i technologii asystujących.

Najważniejsza zasada tej lekcji brzmi prosto: <strong>*HTML opisuje znaczenie treści, a CSS opisuje jej wygląd*</strong>.

Jeśli używasz tagu tylko dlatego, że daje większą czcionkę albo pogrubienie, <strong>mieszasz dwa różne poziomy pracy</strong>. To szybko prowadzi do kodu, który wygląda dobrze na ekranie, ale jest słaby architektonicznie.

---

## 🏛️ Semantyczne klocki HTML5: nowe kontenery

Zanim HTML5 stał się standardem, układ strony bardzo często budowano prawie wyłącznie z tagu `<div>`.

Div do menu. Div do artykułu. Div do stopki. Div wewnątrz diva.

Dla przeglądarki i czytnika ekranu był to anonimowy tłum kontenerów. Kod działał, ale jego struktura niewiele mówiła o treści.

HTML5 dał nam zestaw _**klocków semantycznych**_. To tagi, które nadal są kontenerami (wizualnie zachowują się jak `<div>`), ale mają nazwę opisującą rolę danego fragmentu strony.

Kluczowe tagi semantyczne, które musisz znać:

```html
<header>    <!-- Nagłówek strony lub sekcji: logo, tytuł, nawigacja -->
<nav>       <!-- Blok linków nawigacyjnych -->
<main>      <!-- Główna, unikalna treść całej strony (tylko jeden na stronę!) -->
<article>   <!-- Samodzielna publikacja: wpis blogowy, artykuł, raport, post -->
<section>   <!-- Tematyczna część większej całości -->
<aside>     <!-- Treść poboczna: sidebar, linki powiązane, reklamy -->
<footer>    <!-- Stopka strony, artykułu lub sekcji -->
```

Zastąpienie bezimiennych kontenerów `<div>` powyższymi tagami niesie ze sobą trzy kluczowe korzyści:

- **Dla programisty**: Kod staje się czytelniejszy. Od razu widać, gdzie zaczyna się i kończy nagłówek, artykuł czy stopka.
- **Dla dostępności (WCAG)**: Czytniki ekranowe osób z niepełnosprawnościami mogą płynnie nawigować po strukturze dokumentu, np. przeskakując bezpośrednio do treści głównej.
- **Dla wyszukiwarek (SEO)**: Roboty indeksujące łatwiej rozpoznają najważniejsze treści na stronie, co pozytywnie wpływa na pozycjonowanie.

Pamiętaj, że znacznik `<div>` nie staje się przez to bezużyteczny. Nadal jest podstawowym narzędziem do grupowania elementów, gdy nie mają one żadnego znaczenia semantycznego.

Dobry wybór sprowadza się do prostej zasady:
- Jeśli fragment strony pełni konkretną funkcję (np. jest stopką czy menu), wybierz odpowiedni tag semantyczny.
- Jeśli grupujesz elementy <strong>wyłącznie w celu ich ostylowania w CSS lub ułożenia w siatce</strong>, użyj tagu `<div>`.
- Jeśli masz wątpliwości, zapytaj siebie, czy ten element ma swoją nazwę w strukturze dokumentu (np. „miejsce na reklamę”), czy służy tylko do dekoracji.

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

Tag `<nav>` (*Navigation*) służy do oznaczania głównych bloków linków, które umożliwiają poruszanie się po stronie, artykule lub całym serwisie (np. menu główne, spis treści).

Na jednej stronie możesz umieścić kilka różnych nawigacji o odmiennych rolach. W poniższych przykładach zobaczysz wewnątrz nich atrybut `aria-label`. Nie przejmuj się nim na tym etapie. Szczegółowo wyjaśnię jego znaczenie za chwilę.

### 🌐 Nawigacja główna serwisu

Nawigacja główna prowadzi między najważniejszymi częściami serwisu. Zwykle znajduje się w `<header>`, bo jest częścią stałego nagłówka strony.

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

### 📚 Nawigacja między artykułami

Nawigacja między artykułami prowadzi do innych publikacji. Może znaleźć się w `<aside>`, jeśli jest poboczna wobec aktualnego tekstu, lub na końcu strony pod artykułem.

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

### 🧩 Nawigacja po sekcjach artykułu (Spis Treści)

Artykuł może mieć też spis treści prowadzący do sekcji na tej samej stronie. Linki prowadzą wtedy do elementów z konkretnym atrybutem `id`.

```html
<article>
    <h1>Sci-Hub: Kontrowersyjna Biblioteka Nauki</h1>
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
</article>
```

### 🏷️ Dlaczego <code>aria-label</code> ma znaczenie

Jeśli na stronie masz kilka elementów `<nav>`, użytkownik czytnika ekranu usłyszy listę nawigacji. Bez etykiet brzmią one identycznie („nawigacja”). Z etykietami stają się rozróżnialne:

<ul>
<li>

```html
<nav aria-label="Główna nawigacja">
```
</li>
<li>

```html
<nav aria-label="Spis treści artykułu">
```

</li>
<li>

```html
<nav aria-label="Powiązane artykuły">
```

</li>
</ul>

Etykieta nazywa funkcję konkretnej nawigacji. <strong>Stosuj ją zawsze, gdy na stronie pojawia się więcej niż jeden tag <code>&lt;nav&gt;</code></strong>.

---

## 📐 Układ artykułu z semantycznym szkieletem

Oto poprawna, kompletna struktura artykułu blogowego:

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
                <p>Autor: Arnold Schwarzenegger</p>
            </footer>
        </article>

        <aside>
            <h2>Powiązane artykuły</h2>
            <nav aria-label="Powiązane artykuły">
                <ul>
                    <li><a href="aaron-swartz.html">Aaron Swartz i wolna wiedza</a></li>
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

Zwróć uwagę na kluczowe decyzje:
- **`<main>` jest jeden**: obejmuje unikalną treść tej konkretnej strony. Nie wkładaj do niego globalnego nagłówka ani stopki.
- **`<article>` ma własny nagłówek i stopkę**: tytuł artykułu i autor należą bezpośrednio do publikacji.
- **Wielokrotność tagów**: `<header>` i `<footer>` mogą wystąpić więcej niż raz, jeśli ich kontekst (strona vs artykuł) jest różny.
- **Nazwa bloga nie jest tytułem artykułu**: na stronie publikacji najważniejszym nagłówkiem `<h1>` jest tytuł tekstu, a nie logo serwisu.
- **Użycie encji `&copy;`**: W stopce strony użyliśmy kodu `&copy;`. Przeglądarka wyświetla go jako znak praw autorskich &copy;.

> [!NOTE]
> **Encje HTML (HTML Entities)** to specjalne sekwencje znaków zaczynające się od symbolu ampersand `&` i kończące średnikiem `;`. Używamy ich w dwóch sytuacjach: gdy chcemy wyświetlić znaki zastrzeżone dla składni języka (np. `<` czy `>`), oraz gdy wprowadzamy symbole trudne do wpisania z klawiatury.
> 
> Kilka najpopularniejszych encji, które warto zapamiętać:
> - `&copy;` (znak praw autorskich: `©` (*copyright*))
> - `&lt;` (znak mniejszości: `<` (*less than*))
> - `&gt;` (znak większości: `>` (*greater than*))
> - `&amp;` (znak ampersand: `&` (*ampersand*))
> - `&nbsp;` (twarda spacja: *non-breaking space*, która zapobiega automatycznemu przenoszeniu słów do nowej linii)

---

## 🧱 Wybór znacznika: <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code> czy <code>&lt;div&gt;</code>

Wybór odpowiedniego kontenera bywa wyzwaniem. Aby podjąć właściwą decyzję, przeanalizuj znaczenie (semantykę) wydzielanego fragmentu strony.

#### 1. Znacznik <code>&lt;article&gt;</code> (Artykuł)

Stosuj go do treści, które stanowią niezależną, zamkniętą całość. Taki fragment mógłby zostać wycięty i umieszczony na zupełnie innej stronie (lub wysłany w newsletterze), zachowując swój pełny sens.

Przykłady użycia:
- Wpis na blogu lub artykuł prasowy.
- Pojedynczy komentarz użytkownika pod tekstem.
- Post na forum dyskusyjnym.

#### 2. Znacznik <code>&lt;section&gt;</code> (Sekcja)

Reprezentuje tematyczny rozdział dokumentu lub logiczny obszar strony. Sekcja nie jest samodzielną całością, lecz częścią większej struktury. Zgodnie ze specyfikacją HTML, <strong>każda prawidłowa sekcja powinna zawierać nagłówek</strong> (`<h2>`-`<h6>`) opisujący jej temat.

#### 3. Znacznik <code>&lt;div&gt;</code> (Wrapper)

To element czysto strukturalny pozbawiony jakiegokolwiek znaczenia semantycznego. <strong>Używaj go wyłącznie wtedy, gdy grupujesz elementy w celu nadania im stylów wizualnych w CSS lub ustalenia ich pozycji w układzie strony</strong>.

---

## ♿ Dostępność sekcji: Rola aria-labelledby i dwa konteksty użycia

Sposób użycia znacznika `<section>` zależy od tego, czy tworzysz dokument tekstowy, czy układ aplikacji (np. panel dashboardu). Przeglądarka i czytniki ekranu reagują na te sytuacje zupełnie inaczej.

#### 1. Sekcja dokumentu (Rozdział w tekście)

Kiedy dzielisz artykuł `<article>` na rozdziały (np. „Historia”, „Opis problemu”), znacznik `<section>` służy wyłącznie do budowania logicznej struktury dokumentu (tzw. *document outline*). 

W tym przypadku <strong>**_nie stosuje się_**</strong> atrybutu `aria-labelledby`. Użytkownicy czytników ekranu poruszają się po artykule za pomocą poziomu nagłówków (`<h2>`, `<h3>`), a nie za pomocą **landmarków**. Dodanie etykiety do każdego rozdziału tekstu spowodowałoby tak zwane zanieczyszczenie punktów kontrolnych (*landmark pollution*), co utrudnia nawigację.

> [!NOTE]
> **Landmark (punkt orientacyjny)** to kluczowy, wydzielony obszar strony (taki jak nagłówek, menu nawigacyjne, główna treść czy stopka), który posiada określone znaczenie semantyczne. Czytniki ekranu tworzą z nich specjalną mapę strony. Umożliwia to użytkownikom niewidomym szybkie przeskakiwanie między tymi sekcjami za pomocą skrótów klawiszowych.

```html
<section>
    <h2>Historia i geneza</h2>
    <p>Treść rozdziału...</p>
</section>
```

#### 2. Sekcja aplikacji (Komponent lub widget)

Kiedy budujesz panel sterowania (dashboard) lub stronę z osobnymi widgetami (np. „Prognoza pogody”, „Kursy walut”), sekcje te pełnią funkcję samodzielnych narzędzi. 

W tym kontekście zależy nam, aby użytkownik mógł błyskawicznie przeskoczyć bezpośrednio do wybranego widgetu. W standardzie WAI-ARIA (ogłoszonym przez W3C) znacznik `<section>` staje się widoczny jako ważny obszar nawigacyjny (tzw. *landmark* o roli `region`) <strong>_**wyłącznie wtedy, gdy ma nadaną nazwę**_</strong>.

Aby nadać sekcji nazwę, stosujemy atrybut `aria-labelledby` wskazujący na unikalny identyfikator (`id`) nagłówka:

```html
<section class="weather-widget" aria-labelledby="heading-weather">
    <h2 id="heading-weather">Prognoza pogody</h2>
    <!-- formularze i kontrolki widgetu -->
</section>
```

> [!WARNING]
> Choć specyfikacja ARIA pozwala, aby `aria-labelledby` wskazywało na element leżący w dowolnym miejscu strony (nawet całkowicie poza sekcją), to z punktu widzenia standardu HTML5 jest to błąd walidacji. Każdy znacznik `<section>` musi posiadać nagłówek (`<h2>`-`<h6>`) jako swoje dziecko. Jeśli powiążesz sekcję z zewnętrznym nagłówkiem, oficjalny walidator W3C zgłosi ostrzeżenie: <em>„Section lacks heading”</em> (Sekcja nie posiada nagłówka). Dlatego <strong>nagłówek zawsze musi znajdować się wewnątrz sekcji</strong>.

#### Podsumowanie zachowania technologii:
- **Czytniki ekranu (NVDA, VoiceOver)**: W sekcji aplikacji (z `aria-labelledby`) dodadzą obszar do listy szybkiej nawigacji (np. w NVDA użytkownik może przeskakiwać między landmarkami klawiszem <kbd>D</kbd>), a czytnik oznajmi: „Prognoza pogody, region”. W sekcji dokumentu (bez etykiety) potraktują go jak zwykły `<div>`.
- **Roboty indeksujące (Googlebot, Bingbot)**: Całkowicie ignorują atrybuty ARIA, w tym `aria-labelledby`. Dla pozycjonowania SEO <strong>znaczenie ma wyłącznie treść nagłówka oraz hierarchia HTML</strong>.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Tagi semantyczne HTML5 opisują funkcję**: `<article>`, `<section>`, `<nav>`, `<aside>` i `<footer>` dzielą dokument na logiczne strefy.
- **Nawigacja wymaga nazw**: Gdy na stronie masz więcej niż jeden tag `<nav>`, musisz je rozróżnić za pomocą atrybutu `aria-label`.
- **`<main>` to serce strony**: Może być tylko jeden widoczny element `<main>` na dokument.
- **`<article>` to samodzielność**: Jeśli treść ma sens wycięta ze strony (np. post, artykuł), użyj `<article>`. Jeśli to rozdział lub powiązana tematycznie część, użyj `<section>`.
- **Hierarchia nagłówków buduje spis treści**: Nie skacz po poziomach nagłówków i nie używaj ich do zmiany wyglądu czcionki.
