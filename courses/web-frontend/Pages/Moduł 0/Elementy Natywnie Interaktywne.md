# Elementy Natywnie Interaktywne

Wiele osób buduje rozwijane listy, paski postępu i wyskakujące podpowiedzi ze zwykłych znaczników `<div>`. Taki kod wymaga później dziesiątek linii skryptów, ręcznej obsługi klawiszy <kbd>Tab</kbd>, <kbd>Enter</kbd> oraz <kbd>Esc</kbd>, a czytniki ekranu nadal widzą w nim tylko bezkształtny blok tekstu.

HTML5 rozwiązuje ten problem u źródła. Przeglądarka dostarcza gotowe, **natywnie interaktywne elementy**, które działają bez ani jednej linii JavaScriptu. Mają wbudowaną obsługę klawiatury, stany otwarcia i zamknięcia oraz pełną semantykę dla technologii asystujących.

Zasada inżynierska jest prosta: zanim zbudujesz własny mechanizm interfejsu, sprawdź, czy przeglądarka nie ma już dla niego gotowego znacznika albo atrybutu.

---

## 📂 Rozwijana treść z details i summary

Najczęstsza interakcja na stronach informacyjnych to sekcja zwijana, na przykład lista pytań i odpowiedzi (FAQ) albo dodatkowe szczegóły techniczne. Do tego celu służy para znaczników `<details>` oraz `<summary>`.

Zanim zobaczysz kod, zatrzymaj się na chwilę i przewidź zachowanie przeglądarki. Co stanie się z elementem `<details>`, jeśli umieścisz wewnątrz niego nagłówek `<summary>` i użytkownik przejdzie na niego klawiszem <kbd>Tab</kbd>, a potem naciśnie <kbd>Spację</kbd>? I jak sprawić, aby jedna z odpowiedzi była widoczna od razu po otwarciu strony?

Znacznik `<details>` tworzy kontener na treść, którą można zwinąć i rozwinąć. Jego pierwszym dzieckiem musi być `<summary>`, czyli widoczny, klikalny tytuł. Przeglądarka sama dorysowuje trójkątny wskaźnik oraz obsługuje kliknięcie myszą i klawisze <kbd>Enter</kbd> oraz <kbd>Spacja</kbd>.

```html
<details>
    <summary>Dlaczego warto używać natywnych znaczników HTML?</summary>
    <p>Przeglądarka automatycznie zapewnia obsługę klawiatury i poprawną semantykę dla czytników ekranu.</p>
</details>
```

Tak ten fragment działa bezpośrednio w przeglądarce:

<details class="non-styled">
    <summary>Dlaczego warto używać natywnych znaczników HTML?</summary>
    <p>Przeglądarka automatycznie zapewnia obsługę klawiatury i poprawną semantykę dla czytników ekranu.</p>
</details>

Jeśli wybrana sekcja ma być rozwinięta od momentu załadowania strony, dopisz do znacznika otwierającego **atrybut logiczny** `open`. Nie potrzebuje on żadnej wartości.

```html
<details open>
    <summary>Godziny otwarcia serwisu</summary>
    <p>Dział techniczny pracuje od poniedziałku do piątku od 8:00 do 16:00.</p>
</details>
```

> [!WARNING]
> **_Nie nadpisuj natywnej semantyki._** Przeglądarka sama nadaje elementowi `<summary>` rolę przycisku i aktualizuje jego stan otwarcia. Ręczne dopisywanie `role="button"` albo `aria-expanded` wprowadza konflikt w drzewie dostępności i potrafi zepsuć odczyt w czytniku ekranu.

Typowym błędem początkujących jest też umieszczanie `<summary>` dopiero na drugim miejscu wewnątrz `<details>` albo pomijanie go całkowicie. Gdy zabraknie `<summary>`, przeglądarka wstawi własną, generyczną etykietę (najczęściej słowo „Szczegóły”), nad którą tracisz kontrolę merytoryczną.

### 🧪 Zadanie 1: Natywna sekcja FAQ

Zbuduj sekcję z co najmniej dwoma pytaniami FAQ przy użyciu `<details>` oraz `<summary>`. Pierwsze pytanie ma być rozwinięte domyślnie po otwarciu strony. Nie używaj ręcznych atrybutów `role="button"` ani `onclick`.

<data-gate>
<data-code-runner language="html" title="Zadanie 1: Natywna sekcja FAQ">
<template data-type="code">
<section>
  <h2>Najczęstsze pytania</h2>
  <!-- Dodaj poniżej co najmniej dwa elementy details z summary -->
  <!-- Pierwszy element otwórz domyślnie atrybutem open -->
</section>
</template>
<template data-type="requirements">
[
  { "id": "two-details", "type": "regex", "pattern": "<details\\b[^>]*>\\s*<summary\\b[^>]*>[^<]+</summary>[\\s\\S]*?</details>[\\s\\S]*?<details\\b[^>]*>\\s*<summary\\b[^>]*>[^<]+</summary>[\\s\\S]*?</details>", "flags": "is", "text": "Utwórz co najmniej dwa elementy <details>, z których każdy zaczyna się od niepustego <summary>" },
  { "id": "details-open", "type": "regex", "pattern": "<details\\b[^>]*\\bopen\\b[^>]*>", "flags": "i", "text": "Ustaw jeden element <details> jako domyślnie rozwinięty przez atrybut open" },
  { "id": "no-manual-aria", "type": "not-contains", "pattern": "role=\"button\"", "text": "Nie dodawaj ręcznie role=\"button\" do natywnego znacznika <summary>" },
  { "id": "no-inline-js", "type": "not-contains", "pattern": "onclick", "text": "Zrealizuj interakcję czystym HTML bez atrybutu onclick" }
]
</template>
</data-code-runner>
</data-gate>

---

## 📊 Postęp zadania kontra pomiar zakresu: progress i meter

Na ekranie dwa poziome paski mogą wyglądać niemal identycznie. Dla przeglądarki i technologii asystujących oznaczają jednak dwie różne sytuacje.

Przewidź wybór znacznika w dwóch scenariuszach:
1. Na stronie trwa wysyłanie załącznika na serwer i pasek pokazuje aktualnie 70%.
2. Panel administracyjny pokazuje zajętość dysku serwera na poziomie 82% oraz poziom naładowania baterii UPS.

> [!IMPORTANT]
> Zastanów się przed dalszym czytaniem: czy oba przypadki powinny korzystać z tego samego elementu HTML?

Nie. W pierwszym scenariuszu opisujesz proces, który zmierza do końca. W drugim mierzysz stały parametr fizyczny w znanym przedziale wartości.

### ⏳ Znacznik progress dla trwających procesów

Element `<progress>` służy wyłącznie do pokazywania **postępu zadania** w czasie, na przykład pobierania pliku, instalacji albo kroków wieloetapowego formularza. Przyjmuje atrybuty *value* (bieżąca wartość) oraz *max* (wartość końcowa, domyślnie `1`).

Aby czytnik ekranu wiedział, czego dotyczy sam pasek, łączysz go z opisem tekstowym za pomocą znacznika **`<label>`**. Atrybut `for` w `<label>` musi mieć dokładnie taką samą wartość jak atrybut `id` w elemencie `<progress>` (ten sam mechanizm etykietowania rozwiniesz szerzej w następnej lekcji o formularzach):

```html
<label for="upload-bar">Wysyłanie archiwum:</label>
<progress id="upload-bar" value="70" max="100">70%</progress>
```

Podgląd działania w przeglądarce:

<label for="upload-bar-preview">Wysyłanie archiwum: </label><progress id="upload-bar-preview" value="70" max="100">70%</progress>

Jeżeli usuniesz atrybut *value*, pasek przejdzie w stan nieokreślony: przeglądarka pokaże animację informującą, że operacja trwa, ale jej czas zakończenia nie jest jeszcze znany.

### 🌡️ Znacznik meter dla pomiarów w stałym zakresie

Element `<meter>` reprezentuje **pomiar skalarny** w znanym przedziale, taki jak zajętość dysku, temperatura procesora, poziom baterii albo siła hasła. Taki pomiar może rosnąć i spadać, a jego celem nie jest „ukończenie zadania”.

Dodatkową zaletą `<meter>` są progi oceny wartości: *min*, *max*, *low*, *high* oraz *optimum*. Przeglądarka automatycznie dobiera kolor paska (zielony, żółty lub czerwony) w zależności od tego, jak blisko strefy optymalnej znajduje się aktualna wartość *value*.

```html
<label for="disk-usage">Zajętość dysku:</label>
<meter id="disk-usage" min="0" max="100" low="70" high="90" optimum="40" value="82">82%</meter>
```

Podgląd działania w przeglądarce:

<label for="disk-usage-preview">Zajętość dysku: </label><meter id="disk-usage-preview" min="0" max="100" low="70" high="90" optimum="40" value="82">82%</meter>

Zwróć uwagę na wartość *optimum* równą `40` przy aktualnym zapełnieniu `82`. Ponieważ wynik leży powyżej progu *low* (`70`), ale poniżej krytycznego *high* (`90`), przeglądarka sygnalizuje stan ostrzegawczy. Gdyby wartość przekroczyła `90`, pasek zmieniłby kolor na alarmowy.

> [!IMPORTANT]
> Zarówno `<progress>`, jak i `<meter>` muszą mieć powiązaną etykietę `<label for="...">` wskazującą na atrybut `id` wskaźnika. Tekst wpisany między znacznikiem otwierającym a zamykającym (na przykład `82%`) to jedynie zapasowy tekst dla bardzo starych przeglądarek, które nie potrafią narysować paska. Nowoczesne czytniki ekranu odczytują stan bezpośrednio z atrybutów liczbowych.

**_Częsty błąd:_** używanie `<progress>` do wyświetlania poziomu baterii, ocen użytkowników albo wolnego miejsca na dysku. Czytnik ekranu zapowie wtedy taki element jako „pasek postępu”, co myli odbiorcę sugerując trwający proces ładowania.

---

## 🔘 Nawigacja kontra akcja: a oraz button

W wielu projektach graficznych linki wyglądają jak przyciski, a przyciski przypominają zwykły tekst. Wygląd to jednak sprawa arkuszy stylów. W strukturze HTML znaczniki `<a>` i `<button>` mają **wykluczające się role semantyczne**.

- **Link (`<a>`) służy do nawigacji.** Przenosi użytkownika pod inny adres URL, przewija stronę do kotwicy (na przykład `#kontakt`) albo pobiera plik przy użyciu atrybutu *download*. Zmienia historię przeglądarki i wspiera menu kontekstowe pod prawym przyciskiem myszy („Otwórz link w nowej karcie”). Z klawiatury uruchamia się go klawiszem <kbd>Enter</kbd>.
- **Przycisk (`<button>`) wywołuje akcję.** Nie przenosi pod nowy adres i nie modyfikuje historii przeglądarki. Służy do otwierania wyskakujących paneli, przełączania widoków, potwierdzania operacji albo wysyłania formularza. Z klawiatury aktywuje się go zarówno klawiszem <kbd>Enter</kbd>, jak i <kbd>Spacją</kbd>.

```html
<!-- Nawigacja do dokumentu lub pliku -->
<a href="raport-roczny.pdf" download>Pobierz raport roczny</a>

<!-- Lokalna akcja w interfejsie -->
<button type="button">Pokaż szczegóły techniczne</button>
```

> [!CAUTION]
> **_Unikaj pseudolinków z pustym adresem `href="#"` oraz klikalnych `<div>`._** Link z samym znakiem `#` przewija stronę na samą górę i wprowadza w błąd czytnik ekranu, który zapowiada przejście do zasobu. Z kolei zwykły `<div>` jest całkowicie pomijany podczas nawigacji klawiszem <kbd>Tab</kbd> i nie reaguje na klawiaturę.

Dobrą praktyką jest jawne dopisywanie atrybutu `type="button"` do przycisków, które nie mają wysyłać formularza. Domyślny typ elementu `<button>` umieszczonego wewnątrz formularza to `submit`. Jawne podanie `type="button"` chroni przycisk przed przypadkowym wysłaniem danych, jeśli komponent trafi kiedyś do środka `<form>`.

Wewnątrz sekcji nawigacyjnej `<nav>` umieszczaj linki `<a>` prowadzące do podstron. Przycisk `<button>` ma tam sens wyłącznie wtedy, gdy steruje samym interfejsem nawigacji, na przykład rozwija menu mobilne.

---

## 💬 Wyskakujące warstwy bez skryptów: atrybut popover

Wyobraź sobie panel z krótką pomocą kontekstową, powiadomieniem albo podręcznym menu ustawień. Dawniej wymagało to pisania kodu JavaScript, pilnowania kolejności warstw oraz ręcznego zamykania okna po kliknięciu w tło.

Nowoczesny HTML wprowadza _**atrybut globalny**_ `popover`. W przeciwieństwie do `<details>` nie jest to nowy znacznik, lecz atrybut, który możesz dopisać do dowolnego elementu, na przykład `<div>`, `<aside>` lub `<dialog>`.

Do sterowania takim panelem wystarcza zwykły `<button>` z atrybutem `popovertarget` ustawionym na wartość `id` docelowej warstwy.

```html
<button type="button" popovertarget="help-panel">Pokaż instrukcję</button>

<div id="help-panel" popover>
    <h3>Skróty klawiszowe</h3>
    <p>Naciśnij Esc lub kliknij poza to okno, aby je zamknąć.</p>
</div>
```

Przetestuj to działanie na żywo (spróbuj zamknąć wyskakujący panel klawiszem <kbd>Esc</kbd> lub kliknięciem obok):

<button type="button" popovertarget="koala-popover-demo">Pokaż natywny popover</button>
<div id="koala-popover-demo" popover>
    <p>To okno działa w czystym HTML bez ani jednej linii JavaScriptu. Naciśnij Esc lub kliknij poza nie, aby zamknąć.</p>
</div>

Przeglądarka bierze na siebie cały cykl życia wyskakującej warstwy:

1. **Automatyczne przełączanie:** kliknięcie przycisku z `popovertarget` na zmianę otwiera i zamyka powiązany element. Możesz też jawnie wskazać akcję przez `popovertargetaction="show"` lub `popovertargetaction="hide"` (na przykład na przycisku „Zamknij” wewnątrz panelu).
2. **Lekkie zamykanie:** element z `popover` zamyka się automatycznie po kliknięciu w dowolne miejsce poza nim albo po wciśnięciu klawisza <kbd>Esc</kbd>.
3. **Najwyższa warstwa renderowania:** otwarty panel trafia ponad całą resztę dokumentu. Nie zostanie przypadkowo ucięty przez kontener nadrzędny z ukrytym przepełnieniem.

Jeżeli wyskakujący panel ma pełnić rolę semantycznego okna z komunikatem, możesz połączyć znacznik `<dialog>` z atrybutem `popover`:

```html
<button type="button" popovertarget="status-info">Informacje o systemie</button>

<dialog id="status-info" popover>
    <p>Wersja środowiska: 2.4. Wszystkie usługi działają poprawnie.</p>
</dialog>
```

Takie połączenie zachowuje wbudowaną rolę okna dialogowego dla czytników ekranu, a jednocześnie daje pełne, deklaratywne sterowanie bez pisania skryptów.

---

<data-gate>
<data-connection-matcher title="Dopasuj natywny mechanizm HTML do właściwego zastosowania">
  <item left="`&lt;progress&gt;`" right="Postęp pobierania pliku lub trwającej instalacji"></item>
  <item left="`&lt;meter&gt;`" right="Pomiar zajętości dysku lub poziomu baterii w stałym zakresie"></item>
  <item left="`&lt;a&gt;`" right="Przejście na inną podstronę lub pobranie dokumentu przez adres URL"></item>
  <item left="`&lt;button&gt;`" right="Wywołanie lokalnej akcji w bieżącym widoku bez zmiany adresu"></item>
  <item left="`&lt;details&gt;`" right="Wbudowana sekcja zwijana i rozwijana w treści strony, na przykład FAQ"></item>
  <item left="`popover`" right="Wyskakująca warstwa zamykana kliknięciem obok lub klawiszem Esc"></item>
</data-connection-matcher>
</data-gate>

---

### 🧪 Zadanie 2: Panel zasobów z miernikami i popoverem

Zbuduj panel monitorowania zasobów zawierający:
1. Pasek postępu `<progress>` (z atrybutami `id`, `value`, `max`) powiązany z etykietą `<label for="...">`.
2. Miernik `<meter>` (z atrybutami `id`, `min`, `max`, `low`, `high`, `optimum` oraz `value`) powiązany z własną etykietą `<label for="...">`.
3. Przycisk `<button type="button" popovertarget="...">` otwierający warstwę informacyjną z dokładnie tym samym `id` i atrybutem `popover`.

<data-gate>
<data-code-runner language="html" title="Zadanie 2: Panel zasobów z miernikami i popoverem">
<template data-type="code">
<section>
  <h2>Panel zasobów serwera</h2>
  <!-- 1. Dodaj etykietę label oraz pasek postępu progress (id, value, max) -->

  <!-- 2. Dodaj etykietę label oraz miernik meter (id, min, max, low, high, optimum, value) -->

  <!-- 3. Dodaj przycisk button (type="button", popovertarget) oraz element z pasującym id i atrybutem popover -->
</section>
</template>
<template data-type="requirements">
[
  { "id": "progress-el", "type": "regex", "pattern": "<progress\\b(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bvalue=[\"']\\d+[\"'])(?=[^>]*\\bmax=[\"']\\d+[\"'])[^>]*>", "flags": "i", "text": "Dodaj element <progress> z atrybutami id, value oraz max" },
  { "id": "meter-el", "type": "regex", "pattern": "<meter\\b(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bmin=[\"']\\d+[\"'])(?=[^>]*\\bmax=[\"']\\d+[\"'])(?=[^>]*\\blow=[\"']\\d+[\"'])(?=[^>]*\\bhigh=[\"']\\d+[\"'])(?=[^>]*\\boptimum=[\"']\\d+[\"'])(?=[^>]*\\bvalue=[\"']\\d+[\"'])[^>]*>", "flags": "i", "text": "Dodaj element <meter> z atrybutami id, min, max, low, high, optimum oraz value" },
  { "id": "labels-for", "type": "regex", "pattern": "<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>[\\s\\S]*?<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>", "flags": "is", "text": "Powiąż oba wskaźniki z opisami przez dwa elementy <label for=\"...\">" },
  { "id": "popover-link", "type": "regex", "pattern": "<button\\b(?=[^>]*\\btype=[\"']button[\"'])[^>]*\\bpopovertarget=[\"']([^\"']+)[\"'][^>]*>[\\s\\S]*?</button>[\\s\\S]*?<[a-z]+\\b(?=[^>]*\\bid=[\"']\\1[\"'])(?=[^>]*\\bpopover\\b)[^>]*>[\\s\\S]*?</[a-z]+>", "flags": "is", "text": "Połącz przycisk <button type=\"button\" popovertarget=\"...\"> z elementem popover o identycznym id" }
]
</template>
</data-code-runner>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Top Layer kompozytora, stan inert i natywne okno modalne dialog</span>
<span class="deep-dive-badge">TOP LAYER · INERT SUBTREE · DIALOG API</span>
</summary>
<div class="deep-dive-content">

<h4>1. Dlaczego Top Layer wygrywa z każdym z-index i overflow: hidden</h4>

Zwykłe elementy strony układane są wewnątrz kontekstów stosu (*Stacking Contexts*). Jeśli kontener rodzica ma ustawione `overflow: hidden` lub niższy `z-index`, dziecko nie może się ponad niego wybić nawet przy `z-index: 999999`.

Otwarty element z atrybutem `popover` (oraz modalny `<dialog>`) zostaje promowany przez silnik renderujący do specjalnej listy **Top Layer** utrzymywanej bezpośrednio przez viewport ponad całym dokumentem `<html>`. Kolejność nakładania w Top Layer wynika wyłącznie z kolejności otwierania (stos LIFO), a przeglądarka dołącza pod elementem pseudoelement `::backdrop`.

<h4>2. Różnica architektoniczna: niemodalny popover kontra stan inert</h4>

- **`popover` (niemodalny)**: reszta dokumentu pozostaje aktywna dla myszy, klawiatury i drzewa dostępności; kliknięcie poza warstwę wywołuje *light dismiss*.
- **Modalny `<dialog>`**: w dalszej części kursu (po poznaniu JavaScriptu) otworzysz `<dialog>` metodą `dialog.showModal()`. Silnik oznacza wtedy całe pozostałe drzewo dokumentu jako **`inert`**: blokuje zdarzenia myszy, zamyka fokus klawiatury wyłącznie wewnątrz okna, ukrywa tło przed drzewem `AXObject` (czytnik ekranu nie ucieka poza okno), zamyka dialog klawiszem <kbd>Esc</kbd> i po zamknięciu automatycznie przywraca fokus na przycisk wywołujący.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Natywne elementy zamiast `<div>`:** znaczniki `<details>`, `<progress>`, `<meter>`, `<button>` oraz atrybut `popover` dostarczają gotową obsługę klawiatury i semantykę bez pisania JavaScriptu.
- **Proces kontra pomiar:** dla trwającej operacji (pobieranie, wysyłanie) użyj `<progress>`, a dla wartości w stałym zakresie (dysk, bateria, temperatura) wybierz `<meter>` z progami *low*, *high* i *optimum*.
- **Link kontra przycisk:** `<a>` prowadzi pod adres URL lub pobiera zasób, a `<button>` uruchamia lokalną akcję; unikaj `href="#"` jako zamiennika przycisku.
- **Etykiety wskaźników:** łącz `<progress>` i `<meter>` z opisem za pomocą pary `<label for="...">` oraz `id="..."`, aby czytnik ekranu wiedział, czego dotyczy odczytana wartość.
- **Deklaratywny `popover`:** dodaj atrybut `popover` do kontenera z `id` i steruj nim przyciskiem z `popovertarget`, aby zyskać automatyczne zamykanie kliknięciem obok oraz klawiszem <kbd>Esc</kbd>.
