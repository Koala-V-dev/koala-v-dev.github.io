# Osadzanie Treści i Media

Wstawiasz na stronę firmowy film instruktażowy, otwierasz podgląd w przeglądarce i widzisz zamrożoną pierwszą klatkę bez przycisku odtwarzania. Minutę później osadzasz mapę dojazdu z zewnętrznego serwisu, a w jej miejscu pojawia się pusty szary prostokąt z komunikatem o odrzuconym połączeniu.

Multimedia oraz zewnętrzne dokumenty nie zachowują się jak statyczny obrazek `<img>`. Przeglądarka musi tu negocjować formaty kompresji, egzekwować politykę autostartu dźwięku oraz pilnować granic bezpieczeństwa między różnymi domenami.

Dawniej odtwarzanie wideo wymagało zewnętrznych wtyczek pokroju Adobe Flash Player, które obciążały system i otwierały krytyczne luki bezpieczeństwa. Współczesny _**HTML5**_ obsługuje dźwięk, obraz ruchomy i osadzone dokumenty natywnie, o ile przekażesz przeglądarce poprawną strukturę i zestaw świadomych uprawnień.

---

## 🎬 Odtwarzanie wideo w przeglądarce

Do osadzenia pliku wideo służy znacznik `<video>`. Sama ścieżka do pliku w atrybucie *src* nie wystarcza, ponieważ przeglądarka domyślnie nie wyświetla paska sterowania.

```html
<video src="/resources/media-course-preview/koala.mp4" controls width="640" height="360">
    Twoja przeglądarka nie obsługuje natywnego odtwarzania wideo.
</video>
```

Każdy atrybut tego elementu zmienia konkretne zachowanie odtwarzacza:

- **`controls`**: wyświetla natywny pasek odtwarzania, suwak czasu, regulację głośności i tryb pełnoekranowy. Bez niego użytkownik nie uruchomi filmu ręcznie.
- **`width`** i **`height`**: rezerwują prostokąt w układzie strony przed pobraniem metadanych, co zapobiega przeskakiwaniu tekstu.
- **`poster`**: wskazuje adres obrazu wyświetlanego jako miniatura przed rozpoczęciem odtwarzania.
- **`preload`**: przekazuje przeglądarce wskazówkę, ile danych pobrać przed kliknięciem przycisku Play:
  - *none*: nie pobiera żadnych danych i oszczędza transfer użytkownika,
  - *metadata*: pobiera wyłącznie podstawowe informacje, takie jak czas trwania i wymiary klatki,
  - *auto*: pozwala pobrać cały plik w tle od razu po załadowaniu dokumentu.
- **`autoplay`**, **`muted`**, **`loop`**: odpowiadają kolejno za automatyczny start, wyciszenie ścieżki dźwiękowej oraz zapętlenie materiału.

Zastanów się przez chwilę nad poniższym przypadkiem. Umieszczasz na stronie wideo z atrybutami `autoplay` i `loop`, ale celowo pomijasz zarówno `controls`, jak i `muted`. Czy film ruszy automatycznie w przeglądarce Chrome lub Edge?

Sprawdź działanie takiego kodu na żywo poniżej:

<video src="/resources/media-course-preview/koala.mp4"
    autoplay
    loop
    width="360"
    height="640"
    style="width: unset; display: block; margin: auto;">
    <track src="/resources/media-course-preview/koala.vtt"
        kind="subtitles"
        srclang="pl"
        label="Polskie napisy"
        default>
    Twoja przeglądarka nie obsługuje natywnego odtwarzania wideo.
</video>

> [!WARNING]
> **_Blokada autostartu a silnik przeglądarki:_** Powyższy przykład celowo nie zawiera atrybutu `muted`. Przeglądarka Firefox sprawdza zawartość pliku i uruchamia film, gdy wykryje brak ścieżki dźwiękowej. Przeglądarki oparte na silniku Chromium (Chrome, Edge, Brave) blokują autostart bezwzględnie, dopóki w kodzie nie pojawi się jawny atrybut `muted`.

Wygląd domyślnego paska sterowania zależy od silnika przeglądarki. Poniżej widzisz zestawienie kontrolek w przeglądarce Firefox (silnik Gecko) oraz Microsoft Edge (silnik Blink):

![Porównanie domyślnego paska sterowania wideo w przeglądarkach Firefox oraz Microsoft Edge](/public/courses/web-frontend/Images/porównanie-video-firefox-vs-edge.png)

> [!NOTE]
> **Źródło materiału i licencja:** [Film z koalą pochodzi z serwisu Pixabay](https://pixabay.com/videos/koala-australia-nature-animal-324570/). Licencja serwisu pozwala na bezpłatne użycie komercyjne i edukacyjne bez konieczności oznaczania autora, pod warunkiem że plik nie jest odsprzedawany w niezmienionej formie.

### 🗄️ Standard wielu źródeł i kolejność kodeków

Jedna przeglądarka potrafi dekodować nowoczesne, lekkie pliki wideo, a inna wymaga starszego, bardziej powszechnego standardu. Samo rozszerzenie pliku nie wystarcza do oceny zgodności, ponieważ w praktyce decydują dwie warstwy:

- **Kontener**: format pliku przechowujący razem strumień obrazu, dźwięku i napisów, na przykład `.webm` lub `.mp4`.
- **Kodek**: algorytm kompresji zapisujący poszczególne klatki obrazu, na przykład _**AV1**_, _**VP9**_ albo _**H.264**_.

Aby film działał u każdego odbiorcy bez marnowania transferu, rezygnujesz z atrybutu *src* na samym `<video>` i podajesz listę wariantów przez znaczniki `<source>`:

```html
<video controls width="640" height="360">
    <source src="media/prezentacja-av1.webm" type="video/webm">
    <source src="media/prezentacja.mp4" type="video/mp4">
    <p>Twoja przeglądarka nie obsługuje odtwarzacza wideo. <a href="media/prezentacja.mp4">Pobierz plik MP4</a>.</p>
</video>
```

Przeglądarka analizuje znaczniki `<source>` ściśle **od góry do dołu** i zatrzymuje się na pierwszym formacie, który potrafi zdekodować. Jeśli umieścisz cięższy, uniwersalny plik MP4 na samej górze, nowoczesna przeglądarka wybierze go od razu i nigdy nie sięgnie po lżejszy wariant WebM zapisany niżej.

Gdy żaden z podanych formatów nie zadziała, przeglądarka wyświetla **treść zastępczą** (fallback) wpisaną na końcu wewnątrz znacznika `<video>`, najczęściej jako akapit z linkiem do pobrania pliku.

<data-gate>
  <data-sortable-list title="Ułóż elementy wewnątrz znacznika video w kolejności sprawdzania przez przeglądarkę (od najnowszego formatu do fallbacku):">
    <item data-correct="3">&lt;source src="film.mp4" type="video/mp4"&gt; (uniwersalny wariant zapasowy H.264)</item>
    <item data-correct="1">&lt;source src="film-av1.webm" type="video/webm"&gt; (najnowszy, najlżejszy kodek AV1)</item>
    <item data-correct="4">&lt;p&gt;Pobierz nagranie bezpośrednio: &lt;a href="film.mp4"&gt;film.mp4&lt;/a&gt;&lt;/p&gt; (fallback HTML)</item>
    <item data-correct="2">&lt;source src="film-vp9.webm" type="video/webm"&gt; (nowoczesny kodek VP9)</item>
  </data-sortable-list>
</data-gate>

---

## 🏷️ Dostępność wideo i odtwarzacz dźwięku

Film zawierający mowę lub istotne sygnały dźwiękowe bez tekstowej alternatywy odcina od treści osoby niesłyszące oraz użytkowników oglądających stronę w wyciszonym telefonie. W HTML5 problem rozwiązuje znacznik `<track>`, który dołącza do odtwarzacza ścieżkę tekstową w formacie _**WebVTT**_ (rozszerzenie `.vtt`).

```html
<video controls width="640" height="360">
    <source src="media/prezentacja.webm" type="video/webm">
    <source src="media/prezentacja.mp4" type="video/mp4">
    <track src="napisy-pl.vtt" kind="subtitles" srclang="pl" label="Polskie napisy" default>
    <track src="napisy-en.vtt" kind="subtitles" srclang="en" label="English subtitles">
</video>
```

Każdy atrybut ścieżki pełni określoną rolę:

- **`kind`**: określa typ ścieżki tekstowej. Wartość *subtitles* oznacza napisy dialogowe lub tłumaczeniowe dla osób słyszących tło dźwiękowe. Wartość *captions* oznacza pełne podpisy dla osób niesłyszących, wzbogacone o opisy dźwięków tła, na przykład `[dzwonek telefonu]`.
- **`srclang`**: podaje dwuliterowy kod języka napisów, na przykład *pl* lub *en*.
- **`label`**: definiuje nazwę ścieżki widoczną w menu ustawień odtwarzacza.
- **`default`**: nakazuje przeglądarce włączyć tę konkretną ścieżkę automatycznie przy starcie odtwarzania.

Sam plik `.vtt` jest zwykłym dokumentem tekstowym ze znacznikami czasu:

```vtt
WEBVTT

00:01.000 --> 00:02.800
Zacznij od najnowszego formatu na górze listy.

00:03.000 --> 00:05.200
Dopiero poniżej dopisz uniwersalny fallback MP4.
```

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Parametry kodeków MIME, pseudoelement video::cue i ograniczenia WebVTT</span>
<span class="deep-dive-badge">MIME CODECS · WEBVTT · VIDEO::CUE</span>
</summary>
<div class="deep-dive-content">

<h4>1. Pełny zapis MIME z profilem kodeka w atrybucie type</h4>

Samo `type="video/mp4"` podaje przeglądarce wyłącznie typ kontenera, bez informacji o konkretnym kodeku w środku. Przeglądarka musi wtedy pobrać początek pliku, aby sprawdzić, czy potrafi go zdekodować. Podanie parametru `codecs` według **RFC 6381** pozwala silnikowi podjąć decyzję bez jednego bajtu transferu:

```html
<source src="film-av1.mp4" type='video/mp4; codecs="av01.0.04M.08, opus"'>
<source src="film-h264.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
```

<h4>2. Ograniczenia selektora video::cue i trik z twardą spacją</h4>

Wygląd napisów WebVTT modyfikuje pseudoelement CSS `video::cue`. Specyfikacja W3C ogranicza jednak listę dozwolonych właściwości do bezpiecznego podzbioru (`color`, `background`, `font`, `text-shadow`) i celowo **nie obsługuje właściwości `padding`**. Aby czarny pasek tła nie ucinał krawędzi skrajnych liter, w plikach `.vtt` dodaje się twardą spację Unicode (`U+00A0`) na początku i końcu każdej linii.

</div>
</details>

### 🎵 Odtwarzacz dźwięku i pełna transkrypcja

Do publikacji podcastów, wykładów i krótkich nagrań głosowych służy znacznik `<audio>`. Współdzieli on silnik multimedialny z elementem `<video>`, ale nie renderuje obszaru obrazu. Nie ustawiasz mu więc atrybutów `width`, `height` ani `poster`.

```html
<audio controls preload="metadata">
    <source src="media/wyklad.ogg" type="audio/ogg">
    <source src="media/wyklad.mp3" type="audio/mpeg">
    <p>Twoja przeglądarka nie obsługuje odtwarzacza audio. <a href="media/wyklad.mp3">Pobierz nagranie MP3</a>.</p>
</audio>
```

Pominięcie atrybutu **`controls`** sprawia, że odtwarzacz `<audio>` staje się całkowicie niewidoczny na stronie. Równie bezużyteczny w typowym odtwarzaczu jest atrybut `autoplay`: przeglądarki blokują automatyczne odtwarzanie dźwięku bez wcześniejszej interakcji użytkownika, więc autostart zadziała dopiero po dodaniu `muted`.

Ponieważ `<audio>` nie posiada warstwy graficznej, nie wyświetli napisów ze znacznika `<track>`. Zgodnie z kryterium dostępności _**WCAG 1.2.1**_, dla nagrań dźwiękowych przygotowujesz **pełną transkrypcję tekstową** bezpośrednio obok odtwarzacza albo w podlinkowanym dokumencie. Najczytelniejszym wzorcem jest połączenie odtwarzacza i tekstu w elemencie `<figure>`:

```html
<figure>
    <audio controls preload="metadata" src="media/wyklad.mp3"></audio>
    <figcaption>
        Transkrypcja nagrania: prowadzący omawia różnicę między kontenerem
        a kodekiem oraz wyjaśnia kolejność deklarowania źródeł.
    </figcaption>
</figure>
```

### 🧪 Ćwiczenie: Dostępny odtwarzacz wideo z wieloma źródłami

Zbuduj kompletny odtwarzacz `<video>` z paskiem sterowania `controls`, dwoma źródłami `<source>` ułożonymi od lżejszego formatu `video/webm` do zapasowego `video/mp4`, ścieżką napisów `<track>` z `kind="subtitles"`, `srclang` i `label` oraz tekstem alternatywnym (fallback) dla przeglądarek bez wsparcia wideo.

<data-gate>
<data-code-runner language="html" title="Odtwarzacz wideo z fallbackiem i napisami">
<template data-type="code">
<!-- Zbuduj znacznik odtwarzacza zgodnie z listą kryteriów po prawej -->
</template>
<template data-type="requirements">
[
  {
    "id": "video-controls",
    "type": "regex",
    "pattern": "<video\\b[^>]*\\bcontrols\\b[^>]*>[\\s\\S]*</video>",
    "flags": "is",
    "text": "Użyj znacznika <video> z atrybutem controls oraz znacznikiem zamykającym </video>"
  },
  {
    "id": "sources-order",
    "type": "regex",
    "pattern": "<source\\b[^>]*\\btype\\s*=\\s*[\"']video/webm[\"'][^>]*>[\\s\\S]*<source\\b[^>]*\\btype\\s*=\\s*[\"']video/mp4[\"'][^>]*>",
    "flags": "is",
    "text": "Dodaj dwa znaczniki <source> w kolejności: najpierw type=\"video/webm\", potem type=\"video/mp4\""
  },
  {
    "id": "track-subtitles",
    "type": "regex",
    "pattern": "<track\\b(?=[^>]*\\bkind\\s*=\\s*[\"']subtitles[\"'])(?=[^>]*\\bsrclang\\s*=\\s*[\"'][a-z-]{2,}[\"'])(?=[^>]*\\blabel\\s*=\\s*[\"'][^\"']{2,}[\"'])[^>]*>",
    "flags": "is",
    "text": "Dodaj ścieżkę <track> z atrybutami kind=\"subtitles\", srclang oraz label"
  },
  {
    "id": "fallback-text",
    "type": "regex",
    "pattern": "<(?:source|track)\\b[^>]*>[\\s\\S]*?(?:<p\\b[^>]*>[^<]{5,}|<a\\b[^>]*>[^<]{3,}|>\\s*[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{4,})[\\s\\S]*</video>",
    "flags": "is",
    "text": "Umieść wewnątrz <video> tekst alternatywny (fallback) dla przeglądarek bez obsługi wideo"
  }
]
</template>
</data-code-runner>
</data-gate>

---

## 🪟 Osadzanie zewnętrznych dokumentów w ramce iframe

Znacznik **`<iframe>`** otwiera wewnątrz Twojej strony osobny kontekst przeglądania. To nie jest wycinek grafiki ani kopia cudzego HTML-a. W praktyce uruchamiasz w dokumencie drugą, niezależną kartę przeglądarki z własnym adresem, własnym drzewem DOM, własnymi skryptami i własną polityką prywatności.

Gdy w atrybucie *src* wpiszesz adres zwykłej podstrony dużego portalu, ramka najczęściej pozostanie pusta. Serwery celowo blokują osadzanie swoich stron na obcych domenach za pomocą nagłówków HTTP: *X-Frame-Options* lub dyrektywy *frame-ancestors* w nagłówku _**Content-Security-Policy**_. Jest to obrona przed atakiem **_clickjacking_**, w którym złośliwa witryna przykrywa obcy przycisk przezroczystą warstwą i przechwytuje kliknięcia użytkownika.

> [!IMPORTANT]
> Pusta ramka nie zawsze oznacza błąd w kodzie HTML. Jeśli zdalny serwer wysyła nagłówek blokujący osadzanie, nie obejdziesz go żadnym atrybutem. Musisz użyć oficjalnego adresu widżetu (często zawierającego `/embed/` w ścieżce) albo zrezygnować z osadzania.

Poniżej widzisz poprawnie skonfigurowaną, bezpieczną ramkę z mapą OpenStreetMap:

```html
<iframe
    src="https://www.openstreetmap.org/export/embed.html?bbox=19.398057460784916%2C51.720127626917765%2C19.42565202713013%2C51.72911286882532"
    width="425"
    height="350"
    title="Mapa okolic lotniska w Łodzi"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    sandbox="allow-scripts allow-popups"></iframe>
```

<iframe width="425" height="350" src="https://www.openstreetmap.org/export/embed.html?bbox=19.398057460784916%2C51.720127626917765%2C19.42565202713013%2C51.72911286882532&amp;layer=transportmap" title="Mapa okolic lotniska w Łodzi" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-popups" style="border: 1px solid black"></iframe>

### 🛡️ Izolacja, prywatność i kontrola uprawnień

Kod skopiowany z gotowego generatora rzadko bywa minimalny. Zanim opublikujesz ramkę w projekcie, skontroluj pięć kluczowych atrybutów:

- **`title`**: opisuje przeznaczenie ramki dla czytników ekranu. Bez tego atrybutu osoba niewidoma słyszy wyłącznie komunikat „ramka”, bez informacji, czy wchodzi w mapę, wideo, czy formularz płatności.
- **`loading="lazy"`**: opóźnia pobranie zasobów zewnętrznego dokumentu do momentu, aż użytkownik przewinie stronę w okolice ramki. Przyspiesza to pierwsze wyświetlenie strony.
- **`referrerpolicy`**: ogranicza informacje o Twoim adresie URL przekazywane do obcego serwera. Wartość `strict-origin-when-cross-origin` wysyła do obcych domen wyłącznie samo źródło, ukrywając ścieżkę podstrony i parametry zapytania.
- **`sandbox`**: zamyka ramkę w **piaskownicy bezpieczeństwa**. Pusty atrybut `sandbox` blokuje skrypty, formularze i wyskakujące okna; selektywnie oddajesz tylko niezbędne tokeny, na przykład `sandbox="allow-scripts allow-forms"`.
- **`allow`**: steruje polityką uprawnień (_**Permissions Policy**_). Wskazuje konkretne funkcje sprzętowe lub interfejsowe przeglądarki, z których ramka może skorzystać, na przykład `allow="fullscreen; picture-in-picture"`.

> [!CAUTION]
> **_Nie łącz bezmyślnie tokenów `allow-scripts` i `allow-same-origin`_** w atrybucie `sandbox`, gdy osadzasz treść z tej samej domeny lub z niezaufanego źródła. Skrypt uruchomiony w tak skonfigurowanej ramce może zmodyfikować własny element `<iframe>` i całkowicie usunąć nałożone ograniczenia.

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Opaque Origin (null), ucieczka z sandboxa i nagłówek CSP frame-ancestors</span>
<span class="deep-dive-badge">OPAQUE ORIGIN · SANDBOX ESCAPE · CSP</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak atrybut sandbox izoluje dokument na poziomie pochodzenia (Origin)</h4>

Atrybut `sandbox` (bez tokena `allow-same-origin`) przydziela ramce unikalne, **nieprzezroczyste pochodzenie** (`window.origin === "null"`). Nawet jeśli ramka ładuje plik z tej samej domeny, silnik przeglądarki traktuje ją jak całkowicie obcy serwer: blokuje odczyt ciasteczek (`document.cookie`), `localStorage` oraz dostęp do drzewa DOM strony nadrzędnej (`window.parent`).

<h4>2. Dlaczego połączenie allow-scripts + allow-same-origin całkowicie łamie izolację</h4>

Jeśli ramka pochodzi z tej samej domeny (lub kontrolujesz subdomenę) i nadasz jej oba tokeny naraz, złośliwy skrypt w środku ma pełny dostęp do własnego elementu w rodzicu i może jednym wywołaniem zdjąć piaskownicę:

```javascript
// Skrypt wewnątrz źle skonfigurowanej ramki usuwa własne ograniczenia:
window.frameElement.removeAttribute('sandbox');
location.reload();
```

<h4>3. Ochrona przed clickjackingiem po stronie serwera (HTTP CSP)</h4>

Zamiast przestarzałego `X-Frame-Options: DENY` współczesne serwery wysyłają dyrektywę **Content-Security-Policy**, która precyzyjnie wskazuje dozwolone domeny nadrzędne:

```http
Content-Security-Policy: frame-ancestors 'self' https://panel.example.com;
```

</div>
</details>

<data-gate>
<data-connection-matcher title="Połącz atrybut ramki iframe z jego funkcją techniczną">
  <item left="`sandbox`" right="Izoluje kod w ramce i domyślnie blokuje skrypty, formularze oraz wyskakujące okna"></item>
  <item left="`allow`" right="Udziela ramce zgody na wybrane funkcje przeglądarki, np. tryb pełnoekranowy"></item>
  <item left="`referrerpolicy`" right="Ogranicza zakres adresu Twojej strony przesyłany do serwera zewnętrznego"></item>
  <item left="`loading=&quot;lazy&quot;`" right="Opóźnia pobranie zawartości ramki do momentu zbliżenia się do niej podczas przewijania"></item>
  <item left="`title`" right="Dostarcza czytnikowi ekranu zrozumiały opis zawartości osadzonej ramki"></item>
</data-connection-matcher>
</data-gate>

### 🧪 Ćwiczenie: Audyt i naprawa niebezpiecznej ramki iframe

Poniższa ramka `<iframe>` osadza zewnętrzny widżet ankiety, ale zawiera cztery błędy bezpieczeństwa, prywatności i dostępności: niebezpieczną kombinację tokenów w `sandbox`, wyciek pełnego adresu przez `unsafe-url`, brak opisu `title` oraz brak `loading="lazy"`.

Napraw kod w edytorze:
- Dodaj opisowy atrybut `title` (co najmniej 5 znaków) oraz `loading="lazy"`.
- Zmień `referrerpolicy` na `strict-origin-when-cross-origin`.
- Usuń z `sandbox` token `allow-same-origin` i pozostaw wyłącznie `allow-scripts allow-forms`.
- Dodaj `allow="fullscreen"`, aby widżet mógł otworzyć widok pełnoekranowy.

<data-gate>
<data-code-runner language="html" title="Audyt i zabezpieczenie ramki iframe">
<template data-type="code">
<iframe
  src="https://forms.example.com/embed/ankieta-2026"
  width="640"
  height="420"
  referrerpolicy="unsafe-url"
  sandbox="allow-scripts allow-same-origin">
</iframe>
</template>
<template data-type="requirements">
[
  {
    "id": "iframe-https",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\bsrc\\s*=\\s*[\"']https://[^\"']+[\"'][^>]*>[\\s\\S]*</iframe>",
    "flags": "is",
    "text": "Zachowaj bezpieczny adres https:// w atrybucie src oraz domknięcie </iframe>"
  },
  {
    "id": "iframe-title",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\btitle\\s*=\\s*[\"'][^\"']{5,}[\"'][^>]*>",
    "flags": "is",
    "text": "Dodaj opisowy atrybut title (minimum 5 znaków)"
  },
  {
    "id": "iframe-lazy",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\bloading\\s*=\\s*[\"']lazy[\"'][^>]*>",
    "flags": "is",
    "text": "Włącz leniwe ładowanie przez loading=\"lazy\""
  },
  {
    "id": "iframe-referrer",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\breferrerpolicy\\s*=\\s*[\"']strict-origin-when-cross-origin[\"'][^>]*>",
    "flags": "is",
    "text": "Zamień unsafe-url na referrerpolicy=\"strict-origin-when-cross-origin\""
  },
  {
    "id": "iframe-sandbox-forms",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\bsandbox\\s*=\\s*[\"'](?=[^\"']*\\ballow-scripts\\b)(?=[^\"']*\\ballow-forms\\b)[^\"']*[\"'][^>]*>",
    "flags": "is",
    "text": "Skonfiguruj sandbox z tokenami allow-scripts oraz allow-forms"
  },
  {
    "id": "iframe-allow-fs",
    "type": "regex",
    "pattern": "<iframe\\b[^>]*\\ballow\\s*=\\s*[\"'][^\"']*\\bfullscreen\\b[^\"']*[\"'][^>]*>",
    "flags": "is",
    "text": "Dodaj uprawnienie allow=\"fullscreen\""
  },
  {
    "id": "iframe-no-same-origin",
    "type": "not-contains",
    "pattern": "allow-same-origin",
    "text": "Usuń niebezpieczny token allow-same-origin z atrybutu sandbox"
  }
]
</template>
</data-code-runner>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Jawne sterowanie i autostart**: do zwykłego odtwarzacza `<video>` lub `<audio>` zawsze dodawaj `controls`; film w tle z `autoplay` wymaga `muted`, aby Chromium nie zablokowało odtwarzania.
- **Kolejność źródeł**: umieszczaj `<source>` od najnowszego, najlżejszego kodeka (np. WebM) do uniwersalnego fallbacku (MP4/MP3), a na końcu dopisz link zastępczy.
- **Dostępność mediów**: dla wideo z mową dołączaj plik `.vtt` przez `<track>` (`kind`, `srclang`, `label`), a dla nagrań `<audio>` przygotuj pełną transkrypcję tekstową.
- **Minimalne uprawnienia w `<iframe>`**: korzystaj z oficjalnych adresów osadzania, dodawaj opisowy `title`, `loading="lazy"` i `referrerpolicy="strict-origin-when-cross-origin"`.
- **`sandbox` kontra `allow`**: `sandbox` domyślnie izoluje ramkę i selektywnie przywraca uprawnienia (bez łączenia `allow-scripts` z `allow-same-origin`), a `allow` udostępnia wybrane funkcje przeglądarki.
