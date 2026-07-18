# Osadzanie Treści i Media

Wczesny internet był środowiskiem czysto tekstowym. Z czasem zaczęto dodawać do niego statyczne obrazy, jednak odtwarzanie filmów, dźwięków czy wstawianie interaktywnych widżetów z innych stron wymagało zewnętrznych wtyczek (np. Adobe Flash Player), które obciążały komputer i były luką w bezpieczeństwie.

Współczesny HTML5 całkowicie to zmienił. 

Przeglądarki potrafią <strong>natywnie odtwarzać multimedia oraz osadzać zewnętrzne dokumenty bez żadnych dodatkowych wtyczek</strong>. W tej lekcji dowiesz się, jak poprawnie zorganizować strukturę mediów i integracji w czystym kodzie HTML.

---

## 🎬 Odtwarzanie wideo: znacznik <code>&lt;video&gt;</code>

Do wstawienia filmu na stronę służy znacznik `<video>`. Posiada on zestaw atrybutów sterujących odtwarzaczem:

```html
<video src="public/resources/media-course-preview/koala.mp4" autoplay loop width="640" height="360">
    Twoja przeglądarka nie wspiera natywnego odtwarzania wideo.
</video>
```

#### ⚙️ Kluczowe atrybuty:
- **`controls`**: Najważniejszy atrybut w zwykłym odtwarzaczu. Jeśli go pominiesz, przeglądarka nie pokaże paska odtwarzania, przycisku Play ani regulacji głośności. Film może nadal istnieć w DOM i da się nim sterować z JavaScriptu, ale użytkownik nie otrzyma standardowego interfejsu.
- **`autoplay`**: Uruchamia odtwarzanie filmu od razu po załadowaniu strony.
- **`muted`**: Domyślnie wycisza dźwięk w filmie.
- **`loop`**: Powoduje odtwarzanie filmu w nieskończonej pętli.
- **`poster`**: Wskazuje adres obrazka (miniatury), który ma być wyświetlany przed kliknięciem Play.
- **`preload`**: Podpowiada przeglądarce, jak dużo danych filmu ma pobrać przed uruchomieniem wideo. Wskazane wartości to sugestie, które przeglądarka stara się respektować:
  - *`none`*: nie pobiera żadnych danych (oszczędza transfer użytkownika).
  - *`metadata`*: pobiera tylko podstawowe informacje, takie jak czas trwania czy wymiary filmu.
  - *`auto`*: pobiera cały plik wideo w tle od razu po wejściu na stronę.

Poniżej znajduje się przykładowe wideo z wbudowanymi napisami, `autoplay` (automatyczne odtwarzanie), `loop` (odtwarzanie w zapętleniu) i bez `controls` (pozbawione standardowego interfejsu sterowania):

<video src="/public/resources/media-course-preview/koala.mp4"
    autoplay
    loop
    width="360"
    height="640"
    style="width: unset; display: block; margin: auto;">
    <track src="/public/resources/media-course-preview/koala.vtt"
        kind="subtitles"
        srclang="pl"
        label="Polskie napisy"
        default>
    Twoja przeglądarka nie wspiera natywnego odtwarzania wideo.
</video>


> [!WARNING]
> **Polityka autoplay a silnik przeglądarki:** Powyższy kod celowo nie posiada atrybutu `muted`. Jeśli otworzysz tę lekcję w przeglądarce Firefox, odtwarzanie rozpocznie się automatycznie (ponieważ Firefox analizuje plik wideo i wykrywa brak ścieżki dźwiękowej). Jednak przeglądarki oparte na silniku Chromium (np. Chrome, Edge) zablokują autostart, dopóki nie dopiszesz atrybutu `muted`.

Porównanie domyślnych stylów kontrolek w przeglądarce Firefox (silnik Gecko) oraz MS Edge (silnik Blink):

![porównanie-video-firefox-vs-edge.png](/public/courses/web-frontend/Images/porównanie-video-firefox-vs-edge.png)

> Warto dodać, że w przeciwieństwie do przeglądarek opartych na silniku Chromium, domyślny odtwarzacz w Firefoksie ukrywa pasek sterowania po sekundzie bezczynności lub po odsunięciu od niego kursora myszy.

> [!NOTE]
> **Źródło wideo i licencja:** [Użyty film z koalą pochodzi z serwisu Pixabay](https://pixabay.com/videos/koala-australia-nature-animal-324570/). Licencja tej platformy pozwala na darmowe wykorzystanie komercyjne bez konieczności podawania autora (zasada podobna do CC0), o ile plik nie jest odsprzedawany w niezmienionej postaci.



### 🗄️ Standard wielu źródeł (Fallback)

Nie każda przeglądarka obsługuje każdy kodek wideo. Aby zagwarantować, że film zadziała u każdego odbiorcy, stosujemy **standard wielu źródeł** przy użyciu elementu `<source>`:

```html
<video controls width="640" height="360">
    <source src="media/prezentacja.webm" type="video/webm">
    <source src="media/prezentacja.mp4" type="video/mp4">
    <p>Twoja przeglądarka nie obsługuje tego formatu wideo. Pobierz plik bezpośrednio: <a href="media/prezentacja.mp4">Pobierz wideo</a>.</p>
</video>
```

Przeglądarka przetwarza podane pliki źródłowe **od góry do dołu**. Uruchomi ona **pierwszy format**, który potrafi poprawnie odtworzyć. Jeśli nie obsłuży żadnego, wyświetli *tekst alternatywny* z odnośnikiem do bezpośredniego pobrania filmu.

Kolejność źródeł to decyzja techniczna. Zazwyczaj jako pierwszy podaje się *nowocześniejszy format*, a dopiero potem powszechny fallback. Pamiętaj, że samo rozszerzenie pliku nie gwarantuje sukcesu, ponieważ kluczowy jest **kontener** oraz użyty kodek obrazu i dźwięku.

> [!NOTE]
> **Kodek** - jest to algorytm służący do kompresji danych. W przypadku wideo kodeki decydują o tym, jak efektywnie zapisywane są poszczególne klatki obrazu oraz dźwięk. Najpopularniejsze kodeki wideo to _**`H.264`**_, _**`H.265`**_ oraz _**`VP9`**_.

> [!NOTE]
> **Kontener** - to format pliku, który przechowuje dane wideo i dźwięku. Najpopularniejsze kontenery wideo to `.MP4`, `.WebM` oraz `.MOV`.

### 🏷️ Dostępność: napisy i tag <code>&lt;track&gt;</code>

Jeśli film zawiera mowę lub ważne sygnały dźwiękowe, potrzebuje tekstowej alternatywy. Dla osób niesłyszących lub oglądających wideo bez dźwięku jest to <strong>**_warunek dostępności treści_**</strong>.

Służy do tego tag `<track>`, który wczytuje plik WebVTT (`.vtt`):

```html
<video controls width="640" height="360">
    <source src="media/prezentacja.mp4" type="video/mp4">
    <track src="subtitles-pl.vtt" kind="subtitles" srclang="pl" label="Polskie napisy" default>
</video>
```

Atrybut **`default`** informuje przeglądarkę, aby włączyła napisy automatycznie od razu przy starcie odtwarzacza.

Warto rozróżnić dwa typy ścieżek:

- **`kind="subtitles"`**: *napisy tłumaczeniowe* lub językowe. Zakładają, że użytkownik słyszy dźwięki, ale potrzebuje tekstu dialogów.
- **`kind="captions"`**: *napisy dla osób niesłyszących*. Oprócz samej mowy opisują one również istotne dźwięki w tle (np. odgłos alarmu).

Choć w praktyce nie tworzy się plików `.vtt` z wariantami uwzględniającymi dźwięki dodatkowe jak [muzyka w tle] czy [alarm].

Dodatkowe dwa atrybuty które można dodać do tagu track to **`srclang`** (język napisów) oraz **`label`** (etykieta napisów wyświetlana w odtwarzaczu wideo):

```html
<track src="subtitles-pl.vtt" kind="subtitles" srclang="pl" label="Polskie napisy" default>
<track src="subtitles-en.vtt" kind="subtitles" srclang="en" label="English subtitles">
```



Pliki z napisami tworzymy w formacie _**WebVTT**_ (z rozszerzeniem `.vtt`). Ich struktura wygląda następująco:

```vtt
WEBVTT

00:01.000 --> 00:02.500
  ra rai da  

00:02.500 --> 00:04.500
  nanana  
```

Warto wiedzieć, że domyślny wygląd wyświetlanych napisów modyfikujemy za pomocą stylów CSS i specjalnego selektora *`video::cue`*, o których dowiesz się w kolejnej części kursu. Nie wszystkie efekty da się jednak osiągnąć w ten sposób. Przykładowo, style nie pozwalają kontrolować <strong>**_odstępu krawędzi tła_**</strong> od samego tekstu, przez co czarny boks przylega ciasno do liter.

Aby rozwiązać ten problem i uzyskać estetyczne odstępy po bokach, stosujemy <strong>**twarde spacje**</strong> (znak Unicode *`\u00A0`*) dopisywane bezpośrednio w pliku `.vtt` na początku i końcu każdej kwestii. Choć można dodawać je ręcznie lub prostym skryptem, do wygodniejszej pracy z napisami warto wykorzystać specjalistyczne oprogramowanie. Podobnie jak kod HTML można pisać w zwykłym „Notatniku”, ale znacznie sensowniejszym wyborem jest „VS Code”, tak do synchronizacji WebVTT warto użyć darmowych narzędzi:

- **Subtitle Edit** (zaawansowane, darmowe narzędzie o otwartym kodzie dla systemu Windows, dostępne w [oficjalnym repozytorium GitHub](https://github.com/SubtitleEdit/subtitleedit/releases)).
- **Aegisub** (popularny, darmowy program o otwartym kodzie do precyzyjnej edycji i synchronizacji napisów, dostępny na oficjalnej stronie [aegisub.org](https://aegisub.org/)).

> [!CAUTION]
> <strong>**_Uwaga na fałszywe strony_**</strong>: W sieci istnieje wiele podrabianych witryn udających oficjalne serwisy programu **Subtitle Edit**. Mogą one instalować niechciane oprogramowanie. Jedynym bezpiecznym i oficjalnym miejscem pobierania jest repozytorium na GitHubie.

---

## 🎵 Odtwarzanie dźwięku: znacznik <code>&lt;audio&gt;</code>

Znacznik **`<audio>`** służy do odtwarzania plików dźwiękowych. Działa analogicznie do `<video>`, lecz nie posiada warstwy wizualnej. Nie stosuje się do niego wymiarów ani miniatury.

```html
<audio controls preload="metadata">
    <source src="media/wyklad.ogg" type="audio/ogg">
    <source src="media/wyklad.mp3" type="audio/mpeg">
    <p>Twoja przeglądarka nie obsługuje odtwarzacza audio. <a href="media/wyklad.mp3">Pobierz plik</a>.</p>
</audio>
```

Oprócz atrybutu **`controls`** (którego brak sprawi, że odtwarzacz będzie niewidoczny na stronie), znacznik `<audio>` obsługuje dodatkowe parametry:
- **`preload`**: przyjmuje wartości `none` (nie pobieraj pliku), `metadata` (pobierz tylko czas trwania) oraz `auto` (pobierz cały plik przed odtworzeniem).
- **`loop`**: zapętla odtwarzanie ścieżki dźwiękowej.
- **`muted`**: odtwarzacz w trybie wyciszonym.
- **`autoplay`**: automatycznie uruchamia odtwarzanie, ale wymaga jeszcze wyciszenia `muted`. Ani Chromium, ani Firefox nie pozwolą na automatyczne odtwarzanie dźwięku na stronie. Dlatego `autoplay` w przypadku stosowania go w tagu `<audio>` zwykle nie ma sensu.

Dla nagrań dźwiękowych (np. podcastów czy wykładów) sam odtwarzacz to za mało. Osoby niesłyszące oraz roboty sieciowe (SEO) potrzebują tekstowego odpowiednika. <strong>Zgodnie z wytycznymi *W3C WAI* (kryterium *WCAG 1.2.1* na poziomie A), alternatywę dla audio dostarcza się w postaci _**pełnej transkrypcji tekstowej**_.</strong>

W przeciwieństwie do wideo, domyślny odtwarzacz `<audio>` nie posiada warstwy graficznej, więc nie wyświetli napisów z plików `.vtt`. Dlatego transkrypcję tworzymy jako standardowy tekst na stronie lub link do osobnego dokumentu HTML. Powinna ona zawierać wypowiedzi mówców oraz opisy ważnych dźwięków (np. `[śmiech]`).

Zalecana przez **W3C WAI** struktura kodu łączy odtwarzacz z transkrypcją w jedną całość. Odtwarzacz jest wtedy elementem interaktywnym, a transkrypcja pozostaje zwykłym tekstem, który można wyszukać, skopiować, przetłumaczyć i zindeksować.

```html
<figure>
    <audio controls preload="metadata" src="/audio/wyklad.mp3"></audio>
    <figcaption>
        Transkrypcja nagrania: prowadzący wyjaśnia różnicę między plikiem audio,
        napisami do wideo i pełnym tekstowym odpowiednikiem nagrania.
    </figcaption>
</figure>
```

> [!TIP]
> Znaczniki `<video>` i `<audio>` współdzielą ten sam moduł obsługi multimediów, dlatego mają podobny zestaw atrybutów. To tłumaczy dziwną obecność `autoplay` przy audio: zadziała dopiero wtedy, gdy dodasz `muted`, czyli gdy dźwięk i tak będzie wyciszony. Tę zależność możesz jednak wykorzystać do ciekawego triku: jeśli umieścisz plik `mp3` i napisy `.vtt` wewnątrz znacznika `<video>`, stworzysz dynamiczną transkrypcję bez obrazu. Niestety rozwiązanie zadziała wyłącznie w przeglądarce Firefox. Chromium nie wyświetli napisów, jeżeli format pliku jest tylko audio.

---

## 🪟 Osadzanie zewnętrznych treści: znacznik <code>&lt;iframe&gt;</code>

Znacznik **`<iframe>`** (ang. *Inline Frame*) tworzy w dokumencie okno na inny dokument HTML. To nie jest obrazek, link ani zwykły fragment strony. To osobny kontekst przeglądania, z własnym adresem, własnym DOM-em, własnymi skryptami i własnymi zasadami bezpieczeństwa.

Dlatego ramkę traktuj jak małą przeglądarkę w przeglądarce. Jeśli osadzasz mapę, odtwarzacz wideo albo panel płatności, nie wklejasz „kawałka HTML-a” od dostawcy. Wpuszczasz na stronę drugi dokument, który może pobierać pliki, uruchamiać skrypty, prosić o uprawnienia i śledzić część kontekstu użytkownika.

Choć technicznie możesz wpisać w `src` dowolny adres URL, **współczesne portale często blokują osadzanie swoich zwykłych stron**. Robią to przez nagłówki HTTP, najczęściej `X-Frame-Options` albo dyrektywę `frame-ancestors` w `Content-Security-Policy`. To ochrona przed atakiem typu *clickjacking*, czyli podszyciem obcej strony pod niewinny interfejs i przechwyceniem kliknięć użytkownika.

> [!IMPORTANT]
> Jeśli ramka jest pusta, problem nie zawsze leży w Twoim HTML-u. Serwer osadzanej strony może świadomie zabraniać wyświetlania w `<iframe>`. Wtedy nie „naprawiasz” tego atrybutem. Szukasz oficjalnego adresu typu `/embed/`, używasz widżetu udostępnionego przez usługę albo rezygnujesz z osadzania.

### 🔌 Zastosowanie ramek w praktyce (widżety)

Współcześnie `<iframe>` służy głównie do osadzania dedykowanych widżetów (ang. *embeds*). Portale przygotowują specjalne, odchudzone wersje swoich podstron przeznaczone do wyświetlania w ramkach. Taka wersja ma zwykle inny adres niż normalna strona.

Oto typowe źródła takich widżetów:
- **Interaktywne mapy:** Darmowy serwis [OpenStreetMap](https://www.openstreetmap.org) pozwala pobrać gotowy kod ramki (wystarczy wyszukać lokalizację, kliknąć ikonę udostępniania i wybrać format „HTML”).
- **Odtwarzacze multimediów:** YouTube udostępnia gotowe ramki pod przyciskiem „Udostępnij”, a następnie „Umieść” na karcie filmu.
- **Piaskownice programistyczne:** Portale takie jak [CodePen](https://codepen.io) umożliwiają wklejenie działającego kodu na własną stronę.

Nie myl jednak „oficjalnego” z „automatycznie idealnym”. Kod z generatora bywa wygodny, ale nadal trzeba sprawdzić `title`, `loading`, `referrerpolicy`, `allow` i ewentualny `sandbox`.

### 📐 Przykład: Osadzanie interaktywnej mapy

Poniższy kod wyświetla mapę wybranego obszaru bez instalowania zewnętrznych bibliotek:

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

Zwróć uwagę na kluczowe atrybuty:
- **`src`** wskazuje adres dokumentu wczytywanego do ramki. Dla map i filmów szukaj adresu przygotowanego do osadzania, a nie zwykłej strony z paskiem nawigacji.
- **`title`** opisuje zawartość ramki. To nie jest ozdoba. Użytkownik czytnika ekranu musi wiedzieć, czy wchodzi do mapy, filmu, formularza płatności czy reklamy.
- **`width` i `height`** rezerwują miejsce dla ramki, dzięki czemu układ nie skacze po wczytaniu zewnętrznej treści.
- **`loading="lazy"`** opóźnia wczytanie ramki do momentu, gdy użytkownik zbliży się do niej w trakcie przewijania.
- **`referrerpolicy`** ogranicza ilość informacji o Twojej stronie przekazywanych do zewnętrznego serwisu.
- **`sandbox`** ogranicza możliwości kodu działającego wewnątrz ramki.

### 🎦 Przykład: Osadzanie wideo z YouTube

Oto świadomie odchudzony wariant kodu osadzenia wideo z YouTube:

```html
<iframe
    width="560"
    height="315"
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="Odtwarzacz wideo YouTube: przykładowy film"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="fullscreen; picture-in-picture; encrypted-media"
    allowfullscreen></iframe>
```

Adres w `src` ma strukturę `/embed/`. YouTube kieruje ramkę na uproszczoną stronę odtwarzacza, a nie na zwykłą stronę filmu z komentarzami, menu i całą aplikacją. Fragment `VIDEO_ID` zastępujesz identyfikatorem filmu pobranym z kodu osadzania.

W generatorze YouTube możesz zaznaczyć opcję **„Włącz tryb rozszerzonej prywatności”**. Interfejs serwisu może się zmienić, ale decyzję w kodzie poznasz po domenie w atrybucie `src`:

```html
<!-- Zwykły wariant osadzenia -->
<iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Odtwarzacz wideo YouTube"></iframe>

<!-- Wariant z rozszerzonym trybem prywatności -->
<iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="Odtwarzacz wideo YouTube"></iframe>
```

Różnica jest subtelna, ale ważna. Wariant `youtube.com` od razu korzysta ze standardowej domeny YouTube. Wariant `youtube-nocookie.com` jest przeznaczony do osadzania w **rozszerzonym trybie prywatności**. Według komunikatu generatora YouTube nie będzie wtedy przechowywać informacji o osobach odwiedzających Twoją stronę, dopóki nie zaczną odtwarzać filmu.

To nie znaczy, że ramka staje się magicznie „bez śledzenia”. Po kliknięciu odtwarzania użytkownik wchodzi w interakcję z usługą YouTube, a odtwarzacz nadal pobiera zasoby z zewnętrznych serwerów. Ten tryb zmniejsza kontakt z YouTube przed odtworzeniem filmu, ale nie zamienia osadzenia w lokalny plik wideo.

> [!TIP]
> Jeśli masz wybór, dla zwykłych materiałów edukacyjnych lepiej użyć wariantu `youtube-nocookie.com`. To dobra praktyka prywatnościowa, a jednocześnie nie zmienia sposobu działania samego znacznika `<iframe>`.

Atrybut **`allow`** nie jest tym samym co `sandbox`. `allow` działa jak lista konkretnych funkcji przeglądarki, które ramka może wykorzystać, np. tryb pełnoekranowy, obraz w obrazie albo odtwarzanie zaszyfrowanych mediów. `sandbox` działa odwrotnie: najpierw blokuje wiele możliwości, a potem wybrane z nich oddajesz z powrotem.

> [!NOTE]
> Gotowy kod z YouTube często zawiera długą listę uprawnień, np. `accelerometer`, `autoplay`, `clipboard-write` czy `web-share`. W prawdziwym projekcie nie musisz bezmyślnie kopiować wszystkiego. Zostawiasz tylko to, czego realnie wymaga osadzony odtwarzacz i funkcje, które chcesz udostępnić użytkownikowi.

### 🛡️ Bezpieczeństwo i izolacja: atrybut <code>sandbox</code>

Wczytanie obcej witryny wewnątrz ramki niesie ryzyko wykonania niechcianego kodu, otwierania okien, wysyłania formularzy albo próby wyjścia poza ramkę. Do izolowania zawartości służy atrybut **`sandbox`**.

Pusty `sandbox` nakłada maksymalne restrykcje:

```html
<!-- Maksymalne ograniczenia (blokada skryptów, wyskakujących okienek i formularzy) -->
<iframe src="https://obca-strona.com" title="Zewnętrzny widżet" sandbox></iframe>
```

To najbezpieczniejszy zapis, ale często zbyt surowy. Mapa może przestać się przesuwać, formularz nie wyśle danych, a odtwarzacz wideo nie uruchomi interfejsu. Dlatego w praktyce zaczynasz od ograniczeń i dopiero potem dodajesz konkretne zezwolenia:

```html
<!-- Zgoda wyłącznie na uruchamianie skryptów i formularzy -->
<iframe src="https://obca-strona.com" title="Zewnętrzny formularz" sandbox="allow-scripts allow-forms"></iframe>
```

> [!CAUTION]
> <strong>**_Nie łącz bezmyślnie_**</strong> wartości `allow-scripts` oraz `allow-same-origin` dla ramki z tej samej domeny lub dla treści, której nie kontrolujesz. W takim układzie skrypt osadzony w ramce może odzyskać bardzo dużo uprawnień i praktycznie obejść sens piaskownicy.

<details>
<summary>Najważniejsze wartości atrybutu <code>sandbox</code></summary>

- `allow-scripts`: pozwala uruchamiać JavaScript wewnątrz ramki.
- `allow-forms`: pozwala wysyłać formularze.
- `allow-popups`: pozwala otwierać nowe okna i karty.
- `allow-popups-to-escape-sandbox`: pozwala nowo otwartym stronom wyjść poza ograniczenia ramki. Przydatne czasem dla płatności i logowania, ale wymaga zaufania do dostawcy.
- `allow-presentation`: pozwala użyć mechanizmów prezentacji, np. castowania lub trybu prezentacji.
- `allow-downloads`: pozwala rozpoczynać pobieranie plików.
- `allow-modals`: pozwala używać okien modalnych typu `alert`, `confirm` i `prompt`.
- `allow-same-origin`: pozwala ramce zachować własne pochodzenie (*origin*) zamiast traktowania jej jak treści z unikalnego, izolowanego źródła. To bardzo mocne zezwolenie.

</details>

### 🧭 Prywatność: atrybut <code>referrerpolicy</code>

Gdy przeglądarka wczytuje ramkę, zewnętrzny serwer może dostać informację, z jakiej strony przyszło żądanie. Tę informację nazywamy *referrerem*. Czasem jest to tylko domena, czasem pełny adres URL, a czasem nic.

Dla większości ramek rozsądnym domyślnym wyborem jest:

```html
referrerpolicy="strict-origin-when-cross-origin"
```

Ten zapis zachowuje praktyczny kompromis: przy przejściu do innej domeny przeglądarka wysyła zwykle tylko źródło strony, np. `https://twoja-strona.pl`, a nie pełny adres z fragmentem, parametrami i kontekstem użytkownika.

<details>
<summary>Wartości <code>referrerpolicy</code>, które spotkasz w dokumentacji</summary>

- `no-referrer`: nie wysyła informacji o stronie źródłowej.
- `origin`: wysyła tylko schemat, domenę i port, np. `https://example.com`.
- `strict-origin`: wysyła samo źródło, ale nie wysyła go przy przejściu z HTTPS do HTTP.
- `origin-when-cross-origin`: dla tej samej domeny może wysłać pełny adres, a dla obcej tylko źródło.
- `strict-origin-when-cross-origin`: nowoczesny, bezpieczny kompromis i dobry domyślny wybór.
- `same-origin`: wysyła referrera tylko w obrębie tej samej domeny.
- `no-referrer-when-downgrade`: historyczne zachowanie wielu przeglądarek. Nie wysyła referrera tylko przy przejściu z HTTPS do HTTP.
- `unsafe-url`: wysyła pełny adres także do obcych domen. Unikaj, bo może ujawnić parametry i strukturę strony.

</details>

### 🔐 Uprawnienia: atrybut <code>allow</code>

Atrybut `allow` opisuje, z których funkcji przeglądarki może korzystać osadzony dokument. To mechanizm powiązany z *Permissions Policy*. Nie zastępuje `sandbox`, tylko rozwiązuje inny problem.

```html
<iframe
    src="https://example.com/embed/player"
    title="Odtwarzacz multimedialny"
    allow="fullscreen; picture-in-picture"
    allowfullscreen></iframe>
```

W tym przykładzie ramka może przejść w tryb pełnoekranowy i użyć trybu obraz w obrazie. Nie dostaje automatycznie prawa do kamery, mikrofonu, geolokalizacji ani schowka.

<details>
<summary>Przykłady uprawnień, których nie warto kopiować bez namysłu</summary>

- `autoplay`: pozwala próbować automatycznego odtwarzania. Przeglądarka i tak może je zablokować.
- `clipboard-write`: pozwala zapisywać dane do schowka użytkownika.
- `geolocation`: pozwala prosić o lokalizację.
- `camera` i `microphone`: pozwalają prosić o kamerę i mikrofon.
- `encrypted-media`: potrzebne niektórym odtwarzaczom DRM.
- `fullscreen`: pozwala ramce wejść w tryb pełnoekranowy.
- `picture-in-picture`: pozwala odtwarzaczowi przejść do małego pływającego okna.

</details>

### 🧪 Bezpieczny schemat pracy z ramką

Gdy dostajesz kod `<iframe>` z obcego serwisu, nie traktuj go jak świętej formuły. Przejdź przez krótki rytuał kontroli:

1. Sprawdź, czy `src` prowadzi do oficjalnego adresu osadzania, np. `/embed/`, `/export/embed.html` albo dokumentacji widżetu.
2. Dodaj lub popraw `title`, aby mówił, co użytkownik znajdzie w ramce.
3. Dodaj `loading="lazy"`, jeśli ramka nie jest krytyczna dla pierwszego widoku strony.
4. Dodaj `referrerpolicy=` z polityką `"strict-origin-when-cross-origin"` lub ostrzejszą, jeśli nie chcesz ujawniać kontekstu.
5. Dodaj `sandbox` i poluzuj go tylko wtedy, gdy konkretna funkcja widżetu tego wymaga.
6. Ogranicz `allow` do faktycznie potrzebnych funkcji.

> [!NOTE]
> W profesjonalnych systemach renderer lub SSG może automatycznie dopisywać bezpieczne wartości do ramek, gdy autor o nich zapomni. To dobry pas bezpieczeństwa, ale nie zwalnia z rozumienia kodu źródłowego. Automat ma ratować przypadkowe przeoczenia, a nie zastępować decyzje autora.

### 📟 Przestarzałe metody: znaczniki <code>&lt;embed&gt;</code> i <code>&lt;object&gt;</code>

<strong class="tag-stamp tag-stamp--obsolete">Przestarzały (lecz praktyczny)</strong>

Dawniej do osadzania zewnętrznych rozszerzeń (np. odtwarzaczy Flash) powszechnie stosowano znaczniki `<embed>` oraz `<object>`. Współczesny standard HTML5 zastępuje te wtyczki natywnymi elementami multimedialnymi oraz ramkami `<iframe>`.

Dziś te tagi są wycofywane, ale można je spotkać w starszych projektach lub przy osadzaniu dokumentów PDF bezpośrednio na podstronie:
- **`<embed>`**: prosty znacznik do wczytywania obcych zasobów, który nie oferuje mechanizmów izolacji tak silnych jak ramka.
- **`<object>`**: bardziej rozbudowany tag, który pozwala określić typ danych oraz podać treść alternatywną (fallback) wyświetlaną w przypadku braku obsługi pliku.

W praktyce do osadzania zewnętrznych witryn wybieramy ramki. Przy plikach PDF można jednak nadal spotkać te historyczne rozwiązania.



<data-gate>
  <data-quiz>
    <question>Wklejasz na stronę zewnętrzny widżet w elemencie <code>&lt;iframe&gt;</code>. Chcesz ograniczyć jego możliwości, ale nadal świadomie oddać mu tylko te funkcje, których naprawdę potrzebuje. Które podejście jest najlepsze?</question>
    <options>
<item correct>
Dodajesz <code>sandbox</code>, sprawdzasz co przestało działać, a potem dopisujesz tylko konkretne zezwolenia, np. <code>allow-scripts</code> albo <code>allow-forms</code>.
</item>
<item>
Dodajesz długą listę w <code>allow</code>, bo każdy oficjalny generator widżetu zawsze wie lepiej, jakie uprawnienia są potrzebne Twojej stronie.
</item>
<item>
Dodajesz <code>X-Frame-Options</code> jako atrybut HTML do ramki, aby przeglądarka zablokowała skrypty w osadzonej stronie.
</item>
<item>
Usuwasz <code>title</code>, bo użytkownik i tak widzi zawartość ramki, więc opis nie ma znaczenia.
</item>
</options>
    <div data-hint="error">
      Pomyśl o zasadzie minimalnych uprawnień. Najpierw ograniczasz ramkę, a potem oddajesz tylko to, bez czego widżet faktycznie nie działa.
    </div>
    <div data-hint="success">
      Dokładnie. <code>sandbox</code> tworzy izolację, a konkretne tokeny pozwalają świadomie przywrócić wybrane możliwości ramki.
    </div>
  </data-quiz>
</data-gate>

---

Jeśli równolegle piszesz własny plik w edytorze, nie czekaj na „zadanie na końcu”. Po każdej większej decyzji zatrzymaj się na chwilę i sprawdź kod jak dokument:

- czy w tagach `<video>` i `<audio>` dodałeś atrybut `controls`, aby użytkownik miał dostęp do paska odtwarzania,
- czy przygotowałeś alternatywne źródła `<source>` dla różnych kodeków oraz link tekstowy dla przestarzałych przeglądarek,
- czy dla audio przygotowałeś transkrypcję, a dla wideo napisy lub podpisy w `<track>`,
- czy każdy `<iframe>` korzysta z oficjalnego adresu osadzania, a nie ze zwykłej strony portalu,
- czy każdy `<iframe>` posiada jasny, zrozumiały `title`,
- czy ograniczyłeś wyciek informacji przez `referrerpolicy`,
- czy zabezpieczyłeś obce widżety za pomocą `sandbox` i nadałeś tylko potrzebne uprawnienia,
- czy lista w `allow` nie jest bezmyślną kopią z generatora.

To jest lepszy tryb pracy niż dopisywanie semantyki na końcu. Najpierw myślisz o roli fragmentu, potem zapisujesz tag. CSS przyjdzie później.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Natywne multimedia**: Znaczniki `<video>` i `<audio>` nie wymagają wtyczek. Atrybut `controls` jest konieczny, aby udostępnić przyciski sterowania.
- **Dostępność wideo**: Tag `<track>` wczytuje napisy w formacie WebVTT, co pozwala osobom niesłyszącym na odbiór ścieżki dźwiękowej filmu.
- **Transkrypcja audio**: Odtwarzacz `<audio>` nie wyświetla napisów na ekranie. Z tego powodu dla nagrań dźwiękowych przygotowuje się pełny tekstowy odpowiednik.
- **Istota iframe**: Ramka wczytuje całkowicie zewnętrzny dokument HTML. Posiada własne skrypty i zasady bezpieczeństwa, dlatego wymaga zdefiniowania rozmiaru oraz atrybutu `title`.
- **Zabezpieczenie sandbox**: Atrybut `sandbox` izoluje kod wewnątrz ramki, a atrybut `allow` pozwala na kontrolowane nadawanie wybranych uprawnień (np. trybu pełnoekranowego).
- **Ochrona prywatności**: Atrybut `referrerpolicy` ogranicza informacje o Twojej stronie przekazywane do zewnętrznego serwera podczas ładowania widżetu.
- **Blokada osadzania**: Serwery dużych portali blokują wyświetlanie swoich stron w ramkach na obcych domenach za pomocą nagłówków `X-Frame-Options` lub `Content-Security-Policy` w celu ochrony przed przejęciem kliknięć.
