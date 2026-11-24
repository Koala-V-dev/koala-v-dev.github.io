# Formularze i Dane Użytkownika

Do tej pory dokument HTML działał w jedną stronę: strona wyświetlała treść, a użytkownik mógł ją tylko czytać i klikać odnośniki. Formularz otwiera kanał zwrotny. Pozwala wprowadzać dane, wybierać opcje i przesyłać je do przetworzenia przez serwer.

Z formularzami wiąże się jednak częsty problem konstrukcyjny. Możesz zbudować kompletny ekran rejestracji, który wygląda bezbłędnie w przeglądarce, a mimo to po kliknięciu przycisku „Wyślij” do serwera dotrze pusty pakiet danych. Wszystko przez jeden pominięty atrybut.

Poniżej rozłożysz ten mechanizm na czynniki pierwsze: od wyboru metody przesyłania i trójki atrybutów pola po kontrolki wyboru oraz natywną walidację.

---

## 📮 Szkielet formularza i metody wysyłania: form, action, method

Kontenerem spinającym pola w jeden pakiet danych jest znacznik `<form>`. Dwa kluczowe atrybuty decydują o tym, dokąd i w jaki sposób przeglądarka wyśle zebrane wartości:

- *action*: adres docelowy na serwerze, który odbierze dane.
- *method*: metoda protokołu HTTP, najczęściej `GET` albo `POST`.

Zanim przejdziesz dalej, przewidź zachowanie przeglądarki dla dwóch formularzy. Pierwszy to wyszukiwarka kursów z ustawieniem `method="GET"`. Drugi to formularz logowania z hasłem z ustawieniem `method="POST"`. Co pojawi się w pasku adresu po kliknięciu przycisku wysyłania w obu przypadkach?

### 🔍 Metoda GET: dane w adresie URL

Metoda `GET` dopisuje pary `klucz=wartosc` bezpośrednio do adresu URL po znaku zapytania `?`, rozdzielając kolejne pola znakiem `&`.

```html
<form action="/szukaj" method="GET">
    <label for="query">Szukaj kursu</label>
    <input id="query" name="q" type="text">
    <button type="submit">Szukaj</button>
</form>
```

Po wpisaniu słowa „html” i wysłaniu formularza przeglądarka otworzy adres:

```text
https://twoja-strona.pl/szukaj?q=html
```

Takie zachowanie jest zaletą w wyszukiwarkach i filtrach katalogu. Użytkownik może skopiować adres z paska, zapisać go w zakładkach albo wysłać komuś link do dokładnie tych samych wyników.

### 🔒 Metoda POST: dane w ciele żądania

Metoda `POST` umieszcza dane w niewidocznym na pasku adresu **ciele żądania HTTP**. Stosuj ją zawsze przy logowaniu, rejestracji, formularzach kontaktowych, zamówieniach oraz przy wysyłaniu dłuższych tekstów.

```html
<form action="/logowanie" method="POST">
    <label for="user-login">Login</label>
    <input id="user-login" name="login" type="text">

    <label for="user-pass">Hasło</label>
    <input id="user-pass" name="password" type="password">

    <button type="submit">Zaloguj</button>
</form>
```

Gdybyś użył metody `GET` w formularzu logowania, hasło użytkownika zapisałoby się w historii przeglądarki, w zakładkach oraz w logach serwerów pośredniczących.

> [!WARNING]
> **_Metoda POST nie szyfruje danych sama z siebie._** Ukrywa je jedynie przed paskiem adresu. Do ochrony danych w sieci nadal wymagane jest szyfrowane połączenie `HTTPS`, a serwer musi zawsze zweryfikować wszystko, co otrzymał.

---

## 🔗 Święta trójca pola formularza: label, id oraz name

Każde pole wprowadzania danych pełni dwie równoległe role: komunikuje się z człowiekiem w przeglądarce oraz przekazuje wartość do programu po stronie serwera. Dlatego poprawnie napisane pole wymaga współpracy trzech atrybutów.

```html
<label for="client-email">Adres e-mail</label>
<input id="client-email" name="email" type="email">
```

1. **Atrybut `for` w `<label>` oraz `id` w `<input>`:** tworzą połączenie wewnątrz dokumentu HTML. Wartość `for` musi być identyczna z wartością `id`. Dzięki temu kliknięcie napisu „Adres e-mail” ustawia kursor w polu, a czytnik ekranu ogłasza nazwę kontrolki osobie niewidomej.
2. **Atrybut `name` w `<input>`:** określa **klucz danych** w żądaniu wysyłanym na serwer. W powyższym przykładzie serwer otrzyma parę `email=jan@example.com`.

> [!CAUTION]
> **_Brak atrybutu `name` sprawia, że przeglądarka całkowicie pomija pole podczas wysyłania formularza._** Pole może mieć poprawny `id`, widoczną etykietę i wpisaną treść, a mimo to jego wartość nigdy nie dotrze na serwer.

Drugim częstym błędem jest zastępowanie znacznika `<label>` atrybutem `placeholder`. Podpowiedź `placeholder` znika w chwili, gdy użytkownik wpisze pierwszy znak. Nie daje też stabilnej nazwy dla technologii asystujących. Używaj `placeholder` wyłącznie jako przykładu formatu (na przykład `jan@example.com`), zawsze obok pełnego `<label>`.

---

## ⌨️ Podstawowe kontrolki tekstowe i przyciski

Typ pola `<input>` dobieraj dokładnie do rodzaju danych. Ustawianie wszędzie `type="text"` odbiera użytkownikom telefonów dedykowaną klawiaturę (na przykład ze znakiem `@`), a przeglądarce możliwość sprawdzenia formatu.

- `type="text"`: krótki, jednoliniowy tekst bez szczególnego formatu, na przykład imię, login lub tytuł.
- `type="email"`: adres poczty elektronicznej. Przeglądarka sprawdza podstawową składnię ze znakiem `@`.
- `type="password"`: hasło. Maskuje wpisywane znaki kropkami lub gwiazdkami.

Do dłuższych, wieloliniowych wypowiedzi (wiadomość, opis usterki, komentarz) nie używaj `<input>`. Służy do tego znacznik parowy `<textarea>` z atrybutem *rows* określającym początkową wysokość w liniach.

```html
<label for="msg">Treść wiadomości</label>
<textarea id="msg" name="message" rows="5" required></textarea>
```

Zwróć uwagę na atrybut logiczny `required`. Informuje on przeglądarkę, że formularza nie wolno wysłać, dopóki to pole pozostaje puste.

### 🔘 Przyciski wewnątrz formularza

Element `<button>` wewnątrz `<form>` domyślnie zachowuje się jak przycisk wysyłający. Zawsze zapisuj jego typ jawnie, aby kod nie zostawiał żadnych wątpliwości:

- `<button type="submit">`: uruchamia walidację i wysyła formularz pod adres z `action`.
- `<button type="button">`: nie wysyła formularza i nie czyści pól; służy do lokalnych akcji (na przykład otwarcia podpowiedzi `popover`).

### 🧪 Zadanie 1: Dostępny formularz kontaktowy

Zbuduj formularz kontaktowy wysyłający dane metodą `POST` pod wybrany adres w atrybucie `action`. Umieść w nim pole na adres e-mail (`type="email"`) oraz wieloliniowe pole wiadomości (`<textarea>`). Oba pola muszą być wymagane (`required`), posiadać atrybuty `id` oraz `name`, a także powiązane etykiety `<label for="...">`. Całość zakończ przyciskiem `<button type="submit">`.

<data-gate>
<data-code-runner language="html" title="Zadanie 1: Dostępny formularz kontaktowy">
<template data-type="code">
<!-- Utwórz formularz kontaktowy z action i method="POST" -->
<!-- Dodaj powiązane etykiety label, pole input type="email" (required), textarea (required) oraz button type="submit" -->
</template>
<template data-type="requirements">
[
  { "id": "form-post", "type": "regex", "pattern": "<form\\b(?=[^>]*\\baction=[\"'][^\"']+[\"'])(?=[^>]*\\bmethod=[\"']post[\"'])[^>]*>", "flags": "i", "text": "Utwórz element <form> z atrybutami action oraz method=\"POST\"" },
  { "id": "input-email", "type": "regex", "pattern": "<input\\b(?=[^>]*\\btype=[\"']email[\"'])(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bname=[\"'][^\"']+[\"'])(?=[^>]*\\brequired\\b)[^>]*>", "flags": "i", "text": "Dodaj pole <input type=\"email\"> z atrybutami id, name oraz required" },
  { "id": "textarea-msg", "type": "regex", "pattern": "<textarea\\b(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bname=[\"'][^\"']+[\"'])(?=[^>]*\\brequired\\b)[^>]*>[\\s\\S]*?</textarea>", "flags": "is", "text": "Dodaj wieloliniowe pole <textarea> z atrybutami id, name oraz required" },
  { "id": "labels-for", "type": "regex", "pattern": "<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>[\\s\\S]*?<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>", "flags": "is", "text": "Powiąż pola z opisami za pomocą co najmniej dwóch etykiet <label for=\"...\">" },
  { "id": "btn-submit", "type": "regex", "pattern": "<button\\b[^>]*\\btype=[\"']submit[\"'][^>]*>[\\s\\S]*?</button>", "flags": "is", "text": "Dodaj przycisk wysyłania <button type=\"submit\">" }
]
</template>
</data-code-runner>
</data-gate>

---

## 🎛️ Liczby, daty i kontrolki wyboru

Formularze często wymagają podania konkretnej liczby, daty albo wyboru jednej opcji z gotowej listy.

### 📅 Pola liczbowe i daty: number oraz date

Pole `type="number"` przyjmuje wartości liczbowe i współpracuje z ograniczeniami *min*, *max* oraz *step*. Pole `type="date"` wyświetla natywny kalendarz i przekazuje datę w standardowym formacie `RRRR-MM-DD`.

```html
<label for="guests">Liczba osób</label>
<input id="guests" name="guests" type="number" min="1" max="10" step="1" required>

<label for="visit-date">Data wizyty</label>
<input id="visit-date" name="visit_date" type="date" min="2026-01-01" required>
```

### ☑️ Niezależne decyzje i wybór jednokrotny: checkbox kontra radio

- **`type="checkbox"`** oznacza niezależną zgodę albo opcję, którą można zaznaczyć lub odznaczyć (na przykład akceptacja regulaminu lub zgoda na newsletter). Jeśli dodasz `required` do pojedynczego checkboxa, przeglądarka wymusi jego zaznaczenie przed wysłaniem.
- **`type="radio"`** pozwala wybrać **dokładnie jedną opcję** z grupy. Kluczowy mechanizm to **wspólny atrybut `name`**: wszystkie przyciski radiowe w jednej grupie muszą mieć tę samą wartość `name`, ale różne `id` oraz różne `value`.

Jeśli zapomnisz o wspólnym `name` i dasz każdemu przyciskowi `radio` inną nazwę, przeglądarka pozwoli zaznaczyć wszystkie opcje naraz i użytkownik nie będzie mógł ich później odznaczyć.

### 📦 Grupowanie pól: fieldset i legend

Powiązane grupy kontrolek (zwłaszcza przyciski `radio` i zestawy `checkbox`) zamykaj w znaczniku `<fieldset>`, a tytuł całej grupy wpisuj w pierwszym dziecku `<legend>`.

```html
<fieldset>
    <legend>Sposób dostawy</legend>

    <input id="del-courier" name="delivery" type="radio" value="courier" required>
    <label for="del-courier">Kurier</label>

    <input id="del-locker" name="delivery" type="radio" value="locker">
    <label for="del-locker">Paczkomat</label>
</fieldset>
```

Bez `<legend>` użytkownik czytnika ekranu usłyszy same etykiety „Kurier” i „Paczkomat”, nie wiedząc, jakiego pytania dotyczą.

### 📋 Lista rozwijana: select, optgroup i option

Gdy użytkownik wybiera jedną wartość z dłuższej listy, użyj `<select>` z wewnętrznymi pozycjami `<option>`. Aby uporządkować wiele opcji w kategorie, pogrupuj je za pomocą `<optgroup label="...">`.

```html
<label for="room-type">Rodzaj sali</label>
<select id="room-type" name="room_type" required>
    <option value="">Wybierz z listy</option>
    <optgroup label="Sale małe">
        <option value="s1">Sala konferencyjna A (do 6 osób)</option>
        <option value="s2">Sala warsztatowa B (do 10 osób)</option>
    </optgroup>
    <optgroup label="Sale duże">
        <option value="l1">Aula szkoleniowa (do 40 osób)</option>
    </optgroup>
</select>
```

Wartość wysłana na serwer pochodzi z atrybutu `value` wybranego elementu `<option>`. Pusta pierwsza opcja `<option value="">` w połączeniu z `required` na `<select>` wymusza świadomy wybór użytkownika.

---

## 🛡️ Natywna walidacja oraz stany disabled i readonly

Przeglądarka potrafi wyłapać najprostsze błędy jeszcze przed wysłaniem żądania do serwera. Służą do tego atrybuty walidacyjne:

- `required`: pole nie może pozostać puste.
- `min` i `max`: dolna oraz górna granica dla liczb i dat.
- `minlength` i `maxlength`: minimalna oraz maksymalna liczba znaków w polu tekstowym.
- `pattern`: wzorzec formatu zapisany jako wyrażenie regularne. Przeglądarka dopasowuje go do całej wpisanej wartości.

Prosty przykład użycia `pattern` dla polskiego kodu pocztowego (dwie cyfry, łącznik, trzy cyfry):

```html
<label for="postal-code">Kod pocztowy (format 00-000)</label>
<input id="postal-code" name="postal_code" type="text" pattern="[0-9]{2}-[0-9]{3}" required>
```

Wzorzec `[0-9]{2}` oznacza dokładnie dwie cyfry, znak `-` to dosłowny łącznik, a `[0-9]{3}` wymusza dokładnie trzy cyfry. Wpisanie `00950` bez łącznika zablokuje wysłanie formularza.

> [!IMPORTANT]
> Natywna walidacja HTML poprawia wygodę użytkownika, bo daje natychmiastową informację zwrotną. Nie stanowi jednak zabezpieczenia aplikacji: każdy może zmodyfikować kod strony w przeglądarce. **Serwer musi zawsze powtórzyć walidację otrzymanych danych.**

### 🔮 Przewidywanie: disabled kontra readonly

Wyobraź sobie formularz potwierdzenia zamówienia. Wyświetlasz w nim numer zamówienia `ZAM-2026-41`, którego użytkownik nie może edytować, ale serwer musi otrzymać tę wartość po kliknięciu „Potwierdź”. Zablokujesz pole atrybutem `disabled` czy `readonly`?

Oba atrybuty uniemożliwiają edycję tekstu, ale w chwili wysyłania formularza działają zupełnie inaczej:

| Cecha kontrolki | `disabled` | `readonly` |
| :--- | :--- | :--- |
| Edycja przez użytkownika | zablokowana | zablokowana |
| Wysłanie wartości do serwera | **_nie (pole jest pomijane)_** | **tak (wartość trafia na serwer)** |
| Przejście klawiszem <kbd>Tab</kbd> | nie | tak |

```html
<!-- Wartość NIE zostanie wysłana na serwer -->
<input name="promo_code" type="text" value="BRAK" disabled>

<!-- Wartość ZOSTANIE wysłana na serwer -->
<input name="order_id" type="text" value="ZAM-2026-41" readonly>
```

Dlatego dla numeru zamówienia, który musi dotrzeć do serwera, właściwym wyborem jest `readonly`. Atrybut `disabled` stosuj wyłącznie wtedy, gdy pole jest tymczasowo wyłączone i jego wartość nie ma brać udziału w wysyłanym żądaniu.

---

<data-gate>
<data-connection-matcher title="Połącz element lub atrybut formularza z jego działaniem">
  <item left="`for` i `id`" right="Łączą etykietę label z konkretnym polem dla kliknięcia i czytnika ekranu"></item>
  <item left="`name`" right="Nadaje kontrolce klucz, pod którym jej wartość jest wysyłana do serwera"></item>
  <item left="`method=&quot;GET&quot;`" right="Dopisuje dane formularza do adresu URL po znaku zapytania"></item>
  <item left="`method=&quot;POST&quot;`" right="Wysyła dane w ciele żądania, bez dopisywania ich do paska adresu"></item>
  <item left="`disabled`" right="Blokuje edycję pola i pomija jego wartość podczas wysyłania"></item>
  <item left="`readonly`" right="Blokuje edycję pola, ale wysyła jego wartość razem z formularzem"></item>
  <item left="`type=&quot;radio&quot;`" right="Pozwala wybrać jedną opcję w grupie pól ze wspólnym atrybutem name"></item>
  <item left="`type=&quot;checkbox&quot;`" right="Pozwala niezależnie zaznaczyć lub odznaczyć pojedynczą opcję"></item>
</data-connection-matcher>
</data-gate>

---

### 🧪 Zadanie 2: Formularz rezerwacyjny

Uzupełnij formularz rezerwacji sali konferencyjnej. Zawrzyj w nim:
1. Grupę `<fieldset>` z opisem `<legend>` zawierającą co najmniej dwa przyciski `type="radio"` połączone **wspólnym atrybutem `name`**, z osobnymi atrybutami `value`.
2. Powiązaną etykietę `<label for="...">` oraz listę rozwijaną `<select>` (z `id` i `name`) zawierającą co najmniej dwa elementy `<option>`.
3. Powiązaną etykietę `<label for="...">` oraz pole liczbowe `<input type="number">` (z `id`, `name`, `min` oraz `max`) określające liczbę uczestników.
4. Pole numeru rezerwacji `<input type="text" ... readonly>` z ustawioną wartością `value`, którego nie da się edytować, ale które zostanie wysłane na serwer.
5. Przycisk wysyłania `<button type="submit">`.

<data-gate>
<data-code-runner language="html" title="Zadanie 2: Formularz rezerwacyjny">
<template data-type="code">
<form action="/rezerwacja" method="POST">
  <!-- 1. Dodaj fieldset z legend oraz co najmniej dwa input type="radio" ze wspólnym name i atrybutami value -->

  <!-- 2. Dodaj label for oraz listę select (id, name) z co najmniej dwoma option -->

  <!-- 3. Dodaj label for oraz pole input type="number" (id, name, min, max) -->

  <!-- 4. Dodaj pole tekstowe z numerem rezerwacji i atrybutem readonly -->

  <!-- 5. Dodaj przycisk button type="submit" -->
</form>
</template>
<template data-type="requirements">
[
  { "id": "fieldset-legend", "type": "regex", "pattern": "<fieldset\\b[^>]*>[\\s\\S]*?<legend\\b[^>]*>[^<]+</legend>[\\s\\S]*?</fieldset>", "flags": "is", "text": "Opakuj grupę opcji w <fieldset> z niepustym nagłówkiem <legend>" },
  { "id": "radio-group", "type": "regex", "pattern": "<input\\b(?=[^>]*\\btype=[\"']radio[\"'])(?=[^>]*\\bvalue=[\"'][^\"']+[\"'])[^>]*\\bname=[\"']([^\"']+)[\"'][^>]*>[\\s\\S]*?<input\\b(?=[^>]*\\btype=[\"']radio[\"'])(?=[^>]*\\bvalue=[\"'][^\"']+[\"'])[^>]*\\bname=[\"']\\1[\"'][^>]*>", "flags": "is", "text": "Dodaj co najmniej dwa pola <input type=\"radio\"> z tym samym atrybutem name i własnymi value" },
  { "id": "select-options", "type": "regex", "pattern": "<select\\b(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bname=[\"'][^\"']+[\"'])[^>]*>[\\s\\S]*?<option\\b[^>]*>[^<]+</option>[\\s\\S]*?<option\\b[^>]*>[^<]+</option>[\\s\\S]*?</select>", "flags": "is", "text": "Dodaj listę <select> (z id i name) z co najmniej dwoma elementami <option>" },
  { "id": "input-number", "type": "regex", "pattern": "<input\\b(?=[^>]*\\btype=[\"']number[\"'])(?=[^>]*\\bid=[\"'][^\"']+[\"'])(?=[^>]*\\bname=[\"'][^\"']+[\"'])(?=[^>]*\\bmin=[\"']\\d+[\"'])(?=[^>]*\\bmax=[\"']\\d+[\"'])[^>]*>", "flags": "i", "text": "Dodaj pole <input type=\"number\"> z atrybutami id, name, min oraz max" },
  { "id": "labels-for", "type": "regex", "pattern": "<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>[\\s\\S]*?<label\\b[^>]*\\bfor=[\"'][^\"']+[\"'][^>]*>[\\s\\S]*?</label>", "flags": "is", "text": "Dodaj co najmniej dwie etykiety <label for=\"...\"> powiązane z polami" },
  { "id": "input-readonly", "type": "regex", "pattern": "<input\\b(?=[^>]*\\bname=[\"'][^\"']+[\"'])(?=[^>]*\\bvalue=[\"'][^\"']+[\"'])(?=[^>]*\\breadonly\\b)[^>]*>", "flags": "i", "text": "Dodaj pole z numerem rezerwacji (name, value) zabezpieczone atrybutem readonly" },
  { "id": "btn-submit", "type": "regex", "pattern": "<button\\b[^>]*\\btype=[\"']submit[\"'][^>]*>[\\s\\S]*?</button>", "flags": "is", "text": "Dodaj przycisk wysyłania <button type=\"submit\">" }
]
</template>
</data-code-runner>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Kodowanie ciała POST (urlencoded vs multipart/form-data) i tokeny CSRF</span>
<span class="deep-dive-badge">HTTP POST · MULTIPART · CSRF</span>
</summary>
<div class="deep-dive-content">

<h4>1. Co dokładnie leci w ciele żądania HTTP POST?</h4>

Domyślnie formularz koduje dane jako `application/x-www-form-urlencoded` (taki sam format `klucz=wartosc&...` jak w `GET`, tylko przeniesiony z adresu URL do ciała żądania). Gdy jednak formularz zawiera pole przesyłania pliku `<input type="file">`, musisz ustawić `enctype="multipart/form-data"`. Przeglądarka dzieli wtedy ciało żądania losowym separatorem *boundary* i wysyła surowe bajty pliku:

```http
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----KoalaBoundary7MA4YWxk

------KoalaBoundary7MA4YWxk
Content-Disposition: form-data; name="order_id"

ZAM-2026-41
------KoalaBoundary7MA4YWxk
Content-Disposition: form-data; name="avatar"; filename="profil.webp"
Content-Type: image/webp

<surowe bajty pliku graficznego>
------KoalaBoundary7MA4YWxk--
```

Bez `enctype="multipart/form-data"` przeglądarka wyśle wyłącznie tekstową nazwę pliku (`avatar=profil.webp`), a serwer nigdy nie dostanie jego zawartości binarnej.

<h4>2. Pola ukryte (type="hidden"), CSRF i obejście walidacji HTML</h4>

Pole `<input type="hidden" name="csrf_token" value="...">` nie pojawia się na ekranie, ale jego wartość trafia w ciele żądania POST i służy do ochrony przed atakami **CSRF** (*Cross-Site Request Forgery*). Pamiętaj, że każdy użytkownik może w DevTools dopisać atrybut `novalidate` do `<form>` albo wysłać żądanie bezpośrednio z narzędzia `curl` z pominięciem przeglądarki. Dlatego walidacja HTML jest wyłącznie warstwą UX, a każdą regułę bezpieczeństwa i spójności musi ponownie zweryfikować serwer.

<h4>3. Podpowiedzi bez zamkniętej listy: znacznik datalist</h4>

Jeśli chcesz podpowiadać popularne wartości podczas wpisywania, ale bez blokowania własnego tekstu użytkownika, połącz `<input list="miasta">` ze znacznikiem `<datalist id="miasta">` zawierającym pozycje `<option value="...">`.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Dobieraj metodę do charakteru danych:** używaj `GET` do wyszukiwania i filtrowania (dane trafiają do adresu URL), a `POST` do logowania, rejestracji i formularzy wysyłających prywatne lub dłuższe treści.
- **Pilnuj trójki `for`, `id` i `name`:** para `for`/`id` zapewnia dostępność i klikalność etykiety `<label>`, a atrybut `name` decyduje o tym, czy wartość pola w ogóle trafi do serwera. Nigdy nie zastępuj etykiety samym `placeholder`.
- **Grupuj opcje wyboru z głową:** przyciski `radio` tworzą grupę jednokrotnego wyboru wyłącznie wtedy, gdy dzielą ten sam atrybut `name`. Zamykaj takie grupy w `<fieldset>` z czytelnym `<legend>`.
- **Rozróżniaj `disabled` i `readonly`:** oba blokują edycję, ale `disabled` wyklucza pole z wysyłanych danych, natomiast `readonly` przesyła jego wartość do serwera.
- **Traktuj walidację HTML jako pierwszą linię pomocy:** atrybuty `required`, `min`, `max`, `minlength` i `pattern` oszczędzają czas użytkownika, lecz ostateczną weryfikację zawsze wykonuje serwer.

> [!TIP]
> Chcesz utrwalić budowanie semantycznych struktur i formularzy na realnych scenariuszach? Zajrzyj do [Katalog zadań praktycznych](/arkusze/?qual=INF.03&tag=HTML).
