# Formularze i Dane Użytkownika

Do tej pory Twoja strona głównie przekazywała informacje. Użytkownik mógł czytać, klikać linki, oglądać media i analizować tabele.

Teraz dodamy kierunek odwrotny: użytkownik wpisuje dane, wybiera opcje i wysyła dane.

Formularz jest jednym z najważniejszych elementów HTML. Obsługuje logowanie, wyszukiwanie, kontakt, zakupy, rejestrację, ankiety i panele administracyjne.

Najważniejsza zasada tej lekcji brzmi: <strong>**każde pole formularza musi mieć zrozumiałą etykietę i poprawny typ danych**</strong>.

---

## 🧾 Szkielet formularza: <code>&lt;form&gt;</code>

Element `<form>` grupuje kontrolki, które wspólnie tworzą jeden zestaw danych.

```html
<form action="/kontakt" method="post">
    <label for="email">Adres e-mail</label>
    <input id="email" name="email" type="email">

    <button type="submit">Wyślij</button>
</form>
```

Najważniejsze atrybuty:

- `action`: adres, pod który formularz ma wysłać dane.
- `method`: sposób wysłania danych.
- `name`: nazwa pola w danych wysyłanych do serwera.

Bez `name` pole może wyglądać poprawnie, ale jego wartość nie zostanie sensownie przekazana w żądaniu (*request*).

---

## 📬 GET czy POST?

Formularz może wysyłać dane najczęściej metodą `get` albo `post`.

`get` dopisuje dane do adresu URL. Nadaje się do wyszukiwania, filtrowania i linków, które można komuś udostępnić.

```html
<form action="/szukaj" method="get">
    <label for="q">Szukaj</label>
    <input id="q" name="q" type="search">
    <button type="submit">Szukaj</button>
</form>
```

Po wysłaniu adres może wyglądać tak:

```text
https://moja-strona.pl/szukaj?q=html
```

Po znaku zapytania (`?`) do URL są dopisywane zmienne z wartościami inputów w których podano `name=""` i separowane są znakiem `&`



`post` wysyła dane w treści żądania. Stosuj go przy logowaniu, rejestracji, komentarzach, zamówieniach i danych prywatnych.

```html
<form action="/konto/logowanie" method="post">
    <label for="login">Login</label>
    <input id="login" name="login" type="text">

    <label for="password">Hasło</label>
    <input id="password" name="password" type="password">

    <button type="submit">Zaloguj</button>
</form>
```

> [!WARNING]
> `post` nie oznacza automatycznie bezpieczeństwa. Dane nadal muszą być wysyłane przez `HTTPS`, a serwer musi je poprawnie walidować.

---

## 🏷️ Etykiety: <code>&lt;label&gt;</code> i <code>for</code>

Etykieta mówi człowiekowi i maszynie, czego dotyczy pole.

```html
<label for="username">Nazwa użytkownika</label>
<input id="username" name="username" type="text">
```

Atrybut `for` wskazuje na `id` pola. Dzięki temu:

- kliknięcie tekstu etykiety aktywuje pole,
- czytnik ekranu potrafi odczytać nazwę kontrolki,
- formularz jest łatwiejszy do obsługi na telefonie,
- parsery i narzędzia testujące rozumieją strukturę.

<strong>**_Placeholder nie zastępuje etykiety_**</strong>.

```html
<!-- ŹLE: pole ma podpowiedź, ale nie ma etykiety -->
<input name="email" type="email" placeholder="Adres e-mail">
```

`placeholder` znika po wpisaniu tekstu. Nie jest stabilną nazwą pola.

---

## 🔠 Typy pól <code>&lt;input&gt;</code>

Typ pola wybieraj według danych, których oczekujesz od użytkownika. Zdefiniowanie wszystkiego jako `type="text"` sprawia, że urządzenia mobilne nie dostosują odpowiedniego układu klawiatury ekranowej (np. numerycznej), a przeglądarka nie sprawdzi formatu danych.

---

### 📝 Pola znakowe (tekstowe)

Pola znakowe służą do wpisywania liter, słów, symboli i znaków specjalnych.

#### <code>type="text"</code>: zwykły tekst

Używaj go dla danych, które są tekstem, ale nie mają własnego typu HTML: imię, nazwisko, login, nazwa produktu, tytuł zadania.

```html
<label for="login">Login</label>
<input id="login" name="login" type="text" required minlength="3" maxlength="16">
```

`text` sam z siebie nie sprawdza formatu. Możesz jednak dodać `required`, `minlength`, `maxlength` albo `pattern`.

<b>Podgląd: spróbuj wysłać pusty login albo login krótszy niż 3 znaki.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-login">Login</label><br>
        <input id="preview-login" name="login" type="text" required minlength="3" maxlength="16" placeholder="jan_kowalski">
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="email"</code>: adres e-mail

Używaj go przy adresach e-mail. Przeglądarka sprawdzi podstawowy format, na przykład obecność `@`.

```html
<label for="email">Adres e-mail</label>
<input id="email" name="email" type="email" required autocomplete="email">
```

`type="email"` nie sprawdza, czy konto naprawdę istnieje. Sprawdza tylko, czy wpis wygląda jak adres e-mail.

<b>Podgląd: wpisz <code>abc</code> i naciśnij Wyślij.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-email">Adres e-mail</label><br>
        <input id="preview-email" name="email" type="email" required autocomplete="email" placeholder="uczen@example.com">
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="password"</code>: hasło

Używaj go dla haseł i innych tajnych wartości, które nie powinny być widoczne podczas wpisywania.

```html
<label for="password">Hasło</label>
<input id="password" name="password" type="password" required autocomplete="current-password">
```

`password` ukrywa znaki, ale nie oznacza bezpieczeństwa. Hasło nadal musi być wysłane przez `HTTPS`, a serwer musi je sprawdzić.

<b>Podgląd:</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-password">Hasło</label><br>
        <input id="preview-password" name="password" type="password" required autocomplete="current-password">
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="search"</code>: wyszukiwanie

Używaj go w formularzach wyszukiwania i filtrowania.

```html
<label for="q">Szukaj</label>
<input id="q" name="q" type="search" placeholder="Szukaj kursu...">
```

W przeglądarkach opartych na silniku Chromium (Chrome, Edge) po wpisaniu tekstu pojawia się natywny przycisk `x` do szybkiego czyszczenia pola. W Firefoxie ta kontrolka wygląda identycznie jak zwykły `type="text"` (brak przycisku czyszczenia).

<b>Podgląd: wpisz tekst i porównaj zachowanie w Firefox oraz Chromium (np. Chrome/Edge).</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-search">Szukaj</label><br>
        <input id="preview-search" name="q" type="search" placeholder="Szukaj kursu..." required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="url"</code>: adres strony

Używaj go dla adresów internetowych.

```html
<label for="website">Strona WWW</label>
<input id="website" name="website" type="url" placeholder="https://example.com">
```

`url` sprawdza podstawowy format adresu. Jeżeli wpiszesz samo `example.com`, przeglądarka może uznać to za błąd, bo brakuje schematu, na przykład `https://`.

<b>Podgląd: wpisz <code>example.com</code>, potem <code>https://example.com</code>.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-url">Strona WWW</label><br>
        <input id="preview-url" name="website" type="url" placeholder="https://example.com" required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="text"</code> + <code>&lt;datalist&gt;</code>: autocomplete z podpowiedziami

Element `<datalist>` dostarcza listę podpowiedzi do pola tekstowego bez wymuszania wyboru - użytkownik może wpisać cokolwiek albo wybrać z listy.

Powiązanie przez `list` na inpucie i `id` na datalist.

```html
<label for="city">Miasto</label>
<input id="city" name="city" type="text" list="cities" autocomplete="off">
<datalist id="cities">
  <option value="Warszawa">
  <option value="Kraków">
  <option value="Wrocław">
  <option value="Gdańsk">
</datalist>
```

`<datalist>` różni się od `<select>`: użytkownik nie jest zmuszony do wyboru z listy. Może wpisać dowolną wartość.

<b>Podgląd: wpisz pierwsze litery miasta.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-city">Miasto</label><br>
        <input id="preview-city" name="city" type="text" list="preview-cities" autocomplete="off" placeholder="Wpisz miasto...">
        <datalist id="preview-cities">
          <option value="Warszawa">
          <option value="Kraków">
          <option value="Wrocław">
          <option value="Gdańsk">
          <option value="Poznań">
          <option value="Łódź">
        </datalist>
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

### 🔢 Pola numeryczne i daty

Służą do wprowadzania liczb, wykonywania na nich obliczeń lub wyboru czasu.

#### <code>type="number"</code>: liczba

Używaj go dla wartości liczbowych, na których chcesz wykonywać zakresy, kroki albo obliczenia.

```html
<label for="age">Wiek</label>
<input id="age" name="age" type="number" min="13" max="120" step="1" required>
```

`number` współpracuje z atrybutami `min`, `max` i `step`. Wygląd tej kontrolki zależy od przeglądarki:
- **Chromium (Chrome, Edge):** Pilnuje wpisywanych znaków i pozwala wpisać wyłącznie cyfry (blokując litery). Pokazuje małe strzałki (spin-buttons) zwiększania/zmniejszania wartości, ale tylko wtedy, gdy pole jest sfokusowane lub najedziesz na nie myszką. Kiedy pole jest nieaktywne, strzałki znikają, a element wygląda jak zwykły `type="text"`.
- **Firefox:** Pozwala wpisać dowolne znaki (np. litery), ale w przypadku wpisania tekstu zamiast liczby, przeglądarka oznaczy pole jako niepoprawne przy próbie wysłania formularza. Strzałki po prawej stronie są widoczne cały czas.

<b>Podgląd: wpisz $5$ albo $150$ i wyślij formularz. Zwróć uwagę na zachowanie strzałek przy najechaniu i kliknięciu.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-age">Wiek</label><br>
        <input id="preview-age" name="age" type="number" min="13" max="120" step="1" value="18" required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="tel"</code>: numer telefonu

Używaj go dla numerów telefonu.

```html
<label for="phone">Telefon</label>
<input id="phone" name="phone" type="tel" autocomplete="tel">
```

`tel` zwykle nie waliduje automatycznie numeru, bo formaty różnią się krajami. Jego kluczową zaletą jest to, że na urządzeniach mobilnych wymusza wyświetlenie **dedykowanej klawiatury numerycznej** (często ze znakami `+`, `*`, `#`) zamiast pełnej alfanumerycznej.

**Ważne:** Przeglądarka domyślnie **nie blokuje** wpisywania liter ani znaków specjalnych w tym polu. Wynika to z faktu, że numery telefonów na całym świecie mają skrajnie różne formaty. Jeśli chcesz ograniczyć wpisywanie wyłącznie do cyfr, musisz zastosować atrybut `pattern` z wyrażeniem regularnym (np. `pattern="[0-9]{9}"` dla 9 cyfr).

<b>Podgląd: wpisz cokolwiek i wyślij formularz</b>
<data-gate>
  <div class="native-html-preview">
    <form>
        <label for="preview-phone">Telefon</label><input id="preview-phone" name="phone" type="tel" autocomplete="tel" placeholder="420692137" required>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="date"</code>: data

Używaj go dla dat, na przykład terminu, daty urodzenia albo daty wydarzenia.

```html
<label for="deadline">Termin</label>
<input id="deadline" name="deadline" type="date" min="2077-01-01" max="2137-12-31">
```

`date` pozwala ograniczyć zakres przez `min` i `max`. Natywny wybór daty wygląda inaczej w różnych przeglądarkach i systemach.

<b>Podgląd: wybierz datę i wyślij formularz</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-date">Termin w 2026 roku</label><br>
        <input id="preview-date" name="deadline" type="date" min="2026-01-01" max="2026-12-31" required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="range"</code>: suwak

Używaj go do wyboru wartości liczbowej z zakresu, gdy precyzyjna liczba nie jest kluczowa: głośność, jasność, ocena, priorytet.

```html
<label for="volume">Głośność: <output id="vol-out">50</output>%</label>
<input id="volume" name="volume" type="range" min="0" max="100" step="5" value="50">
```

`range` nie wyświetla aktualnej wartości. Żeby ją pokazać, trzeba użyć elementu `<output>` lub JavaScript. Atrybuty `min`, `max` i `step` działają tak samo jak w `type="number"`.

<b>Podgląd: przesuń suwak.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-volume">Głośność: <output id="preview-vol-out" for="preview-volume">50</output>%</label><br>
        <input id="preview-volume" name="volume" type="range" min="0" max="100" step="5" value="50"
          oninput="document.getElementById('preview-vol-out').value = this.value">
      </p>
      <button type="submit">Zapisz</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="time"</code>: godzina

Używaj go do wyboru godziny. Format wartości to zawsze `HH:MM` (24-godzinny).

```html
<label for="meeting">Godzina spotkania</label>
<input id="meeting" name="meeting" type="time" min="08:00" max="18:00">
```

`min` i `max` ograniczają zakres dostępnych godzin. Wygląd kontrolki zależy od systemu operacyjnego i przeglądarki.

<b>Podgląd: wybierz godzinę poza zakresem 08:00-18:00 i wyślij.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-time">Godzina spotkania (8:00-18:00)</label><br>
        <input id="preview-time" name="meeting" type="time" min="08:00" max="18:00" required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

---

### 🧺 Grupy kontrolek wyboru

Służą do wybierania gotowych opcji zdefiniowanych w kodzie.

#### <code>type="checkbox"</code>: niezależna decyzja

Używaj go, gdy użytkownik może zaznaczyć albo odznaczyć opcję. Checkboxy z różnymi nazwami są niezależne.

```html
<input id="newsletter" name="newsletter" type="checkbox">
<label for="newsletter">Chcę otrzymywać newsletter</label>
```

Checkbox może być wymagany przez `required`, na przykład przy akceptacji regulaminu.

<b>Podgląd: nie zaznaczaj wymaganego checkboxa i wyślij formularz</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <input id="preview-terms" name="terms" type="checkbox" required>
        <label for="preview-terms">Akceptuję regulamin</label>
      </p>
      <p>
        <input id="preview-newsletter" name="newsletter" type="checkbox">
        <label for="preview-newsletter">Chcę otrzymywać newsletter</label>
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

#### <code>type="radio"</code>: jeden wybór z grupy

Używaj go, gdy użytkownik ma wybrać jedną odpowiedź z kilku możliwości.

```html
<input id="contact-email" name="contact" type="radio" value="email" required>
<label for="contact-email">E-mail</label>

<input id="contact-phone" name="contact" type="radio" value="phone">
<label for="contact-phone">Telefon</label>
```

Radio buttony tworzą grupę przez wspólne `name`. Jeżeli każde radio ma inne `name`, przeglądarka potraktuje je jak osobne decyzje i użytkownik będzie mógł zaznaczyć kilka.

<b>Podgląd: wybierz kilka metodę kontaktu.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <fieldset>
        <legend>Preferowany kontakt</legend>
        <input id="preview-contact-email" name="contact" type="radio" value="email" required>
        <label for="preview-contact-email">E-mail</label><br>
        <input id="preview-contact-phone" name="contact" type="radio" value="phone">
        <label for="preview-contact-phone">Telefon</label><br>
        <input id="preview-contact-none" name="contact" type="radio" value="none">
        <label for="preview-contact-none">Nie kontaktuj się ze mną</label>
      </fieldset>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

#### Elementy grupujące: <code>&lt;fieldset&gt;</code> i <code>&lt;legend&gt;</code>

Gdy kilka pól dotyczy jednego tematu (szczególnie przy radio buttonach i checkboxach), użyj `<fieldset>`, a nagłówek grupy opisz za pomocą `<legend>`.

```html
<fieldset>
    <legend>Preferowany kontakt</legend>

    <input id="contact-email" name="contact" type="radio" value="email">
    <label for="contact-email">E-mail</label>

    <input id="contact-phone" name="contact" type="radio" value="phone">
    <label for="contact-phone">Telefon</label>
</fieldset>
```

Bez legendy użytkownik korzystający z technologii asystujących usłyszy same opcje (np. „E-mail”, „Telefon”), nie wiedząc, czego one dotyczą.

---

### ⚙️ Budowanie własnych wzorców walidacji (atrybut <code>pattern</code>)

Gdy wbudowane typy pól nie wystarczają do walidacji specyficznego formatu danych (np. kodu pocztowego, numeru seryjnego czy serii dokumentu), możesz zdefiniować własny wzorzec za pomocą wyrażeń regularnych (Regex). Najczęściej łączy się go z `type="text"` lub `type="tel"`.

```html
<label for="serial-number">Numer seryjny (Wzór: AB123)</label>
<input id="serial-number" name="serial" type="text" pattern="[A-Z]{2}[0-9]{3}" required>
```

#### 🔍 Jak działają wyrażenia regularne w HTML?

W atrybucie `pattern` przeglądarka automatycznie dopasowuje wzorzec do **całego wpisanego tekstu** (tak, jakby na początku i końcu znajdowały się ukryte kotwice `^` oraz `$`). Użytkownik musi wpisać dokładnie to, co opisuje wzorzec.

Wyrażenia buduje się ze **zbiorów znaków** (co dopuszczamy) i **kwantyfikatorów** (ile razy znaki mogą się powtórzyć).

- _**Zbiory znaków (nawiasy kwadratowe `[]`):**_
  - `[A-Z]` – pojedyncza wielka litera (od A do Z).
  - `[a-z]` – pojedyncza mała litera.
  - `[0-9]` – pojedyncza cyfra (można zapisać też jako `\d`).
  - `[a-zA-Z]` – pojedyncza dowolna litera (mała lub wielka).

- _**Kwantyfikatory (nawiasy klamrowe `{}` oraz symbole):**_
  - `{n}` – dokładnie `n` powtórzeń (np. `{3}` to dokładnie 3 znaki).
  - `{min,max}` – od `min` do `max` powtórzeń (np. `{9,15}`).
  - `?` – element opcjonalny (może wystąpić 0 lub 1 raz).
  - `+` – co najmniej 1 powtórzenie.
  - `*` – dowolna liczba powtórzeń (od 0 do nieskończoności).

#### 🛠️ Analiza przykładów

- **Przykład 1: Kod identyfikacyjny (`[A-Z]{2}[0-9]{3}`)**
  - `[A-Z]{2}` – dokładnie dwie wielkie litery (np. `PL`, `AB`).
  - `[0-9]{3}` – dokładnie trzy cyfry (np. `123`, `000`).
  - *Pasuje:* `PL045`, `AB999`.
  - **_Nie pasuje:_** `pl045` (małe litery), `PL12` (za mało cyfr), `AB1234` (za dużo cyfr).

- **Przykład 2: Polski kod pocztowy (`[0-9]{2}-[0-9]{3}`)**
  - `[0-9]{2}` – dokładnie dwie cyfry.
  - `-` – dosłowny znak myślnika.
  - `[0-9]{3}` – dokładnie trzy cyfry.
  - *Pasuje:* `00-950`, `43-100`.
  - **_Nie pasuje:_** `00950` (brak myślnika), `0-950` (za mało cyfr przed myślnikiem).

- **Przykład 3: Numer telefonu bez spacji (`\+?[0-9]{9}`)**
  - `\+?` – opcjonalny znak plusa na początku (ukośnik `\` jest potrzebny, ponieważ sam `+` jest znakiem specjalnym w Regex, więc musimy go potraktować znakiem „ucieczki”).
  - `[0-9]{9}` – dokładnie dziewięć cyfr.
  - *Pasuje:* `123456789`, `+48123456789` (jeśli dodamy numer kierunkowy przed pozostałymi cyframi).

<b>Podgląd walidacji wzorca:</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-code">Kod identyfikacyjny (Wzór: AB123)</label><br>
        <input id="preview-code" name="code" type="text" pattern="[A-Z]{2}[0-9]{3}" placeholder="AB123" required>
      </p>
      <button type="submit">Sprawdź</button>
    </form>
  </div>
</data-gate>

Walidacja HTML pomaga użytkownikowi szybciej zauważyć błąd, ale nie zastępuje walidacji po stronie serwera.

<strong>**Serwer musi traktować dane z formularza jako niezaufane**</strong>.

---

### <code>color</code>: selektor koloru

Służy do wyboru koloru z palety lub ręcznego wprowadzenia kodu szesnastkowego.

```html
<label for="favcolor">Wybierz kolor</label>
<input id="favcolor" name="favcolor" type="color" value="#ff0000">
```

**Kluczowe fakty techniczne:**
- **Wartość i format:** Pole zawsze przechowuje i przesyła wartość jako **7-znakowy kod szesnastkowy** (np. `#ff0000` lub `#002f55`) zapisany małymi literami. Nie obsługuje przezroczystości (kanału alfa).
- **Domyślna wartość:** Jeśli nie zdefiniujesz atrybutu `value` lub podasz nieprawidłową wartość, przeglądarka domyślnie ustawi kolor czarny (`#000000`). W tym polu nie można ustawić pustej wartości.
- **Działanie:** Kliknięcie pola otwiera systemowy (OS) lub przeglądarkowy selektor koloru.

<b>Podgląd: wybierz swój ulubiony kolor.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="favcolor">Wybierz kolor</label><br>
        <input id="favcolor" name="favcolor" type="color" value="#ff0000">
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

### <code>file</code>: pole wyboru plików

Służy do wysyłania plików z urządzenia użytkownika na serwer.

```html
<label for="avatar">Wybierz zdjęcie (PNG, JPEG)</label>
<input id="avatar" name="avatar" type="file" accept="image/png, image/jpeg" multiple required>
```

**Kluczowe fakty techniczne:**
- **Atrybut `enctype` formularza:** Aby plik fizycznie dotarł na serwer w żądaniu POST, tag `<form>` **musi** posiadać atrybuty `method="post"` oraz `enctype="multipart/form-data"`. Bez tego formularz wyśle tylko tekstową nazwę pliku zamiast jego rzeczywistej zawartości.
- **Filtrowanie typów (`accept`):** Za pomocą atrybutu `accept` możesz ograniczyć typy plików dopuszczalne do wyboru (np. `accept="image/png, image/jpeg"` lub `accept=".pdf"`). Zapobiega to pomyłkowemu załadowaniu niewłaściwego formatu przez użytkownika.
- **Wielokrotny wybór (`multiple`):** Dodanie tego atrybutu logicznego pozwala użytkownikowi wybrać więcej niż jeden plik naraz.

<b>Podgląd: wybierz plik z dysku.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="avatar">Wybierz plik</label><br>
        <input id="avatar" name="avatar" type="file" required>
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

### <code>type="hidden"</code>: niewidoczne pole danych

Pole ukryte nie jest widoczne dla użytkownika, ale jego wartość jest wysyłana razem z formularzem.

```html
<form action="/komentarz" method="post">
  <input type="hidden" name="csrf_token" value="8f14e45fcc">
  <input type="hidden" name="post_id" value="42">

  <label for="tresc">Komentarz</label>
  <textarea id="tresc" name="tresc"></textarea>
  <button type="submit">Dodaj</button>
</form>
```

Używaj go do przesyłania:
- **tokenów CSRF** - ochrona przed atakami Cross-Site Request Forgery,
- **identyfikatorów kontekstu** - np. ID posta, strony, sesji wieloetapowej,
- **danych stanu** - wartości generowanych przez serwer, które muszą wrócić przy kolejnym żądaniu.

<strong>**_Ostrzeżenie:_**</strong> Pole jest ukryte wizualnie, ale użytkownik widzi jego wartość w źródle HTML i może ją zmodyfikować. <strong>Serwer musi zawsze walidować dane z pól hidden</strong>.

---

### ⚙️ Stany pól: <code>disabled</code> i <code>readonly</code>

Oba atrybuty blokują edycję pola, ale działają inaczej.

```html
<!-- Pole zablokowane - wartość NIE jest wysyłana do serwera -->
<input name="plan" type="text" value="Darmowy" disabled>

<!-- Pole tylko do odczytu - wartość JEST wysyłana do serwera -->
<input name="user_id" type="text" value="12345" readonly>
```

| Cecha | `disabled` | `readonly` |
| :--- | :--- | :--- |
| Edycja przez użytkownika | zablokowana | zablokowana |
| Wartość wysyłana do serwera | **_nie_** | **tak** |
| Focusowalny | nie | tak |
| Styl wizualny | wyszarzony | zależy od przeglądarki |

`disabled` stosuj dla pól, których wartość jest nieistotna lub warunkowa. `readonly` stosuj dla pól, których wartość musi dotrzeć do serwera, ale użytkownik nie powinien jej zmieniać - np. wygenerowane identyfikatory, podsumowania zamówień.

<b>Podgląd: zwróć uwagę, które pole pojawia się w wynikach przesłanego formularza.</b>
<data-gate>
  <div class="native-html-preview">
    <form>
      <p>
        <label for="preview-disabled">Plan (disabled)</label><br>
        <input id="preview-disabled" name="plan" type="text" value="Darmowy" disabled>
      </p>
      <p>
        <label for="preview-readonly">ID użytkownika (readonly)</label><br>
        <input id="preview-readonly" name="user_id" type="text" value="12345" readonly>
      </p>
      <button type="submit">Wyślij</button>
    </form>
  </div>
</data-gate>

---

## 📝 Kontrolki niebędące elementami <code>&lt;input&gt;</code>

W formularzach występują również inne tagi, które służą do wprowadzania dłuższych tekstów, wyboru z list rozwijanych czy prezentacji wyników.

### <code>&lt;textarea&gt;</code>: większy blok tekstu

Pozwala na wpisanie dłuższego tekstu (np. komentarza, opisu). Rozmiar pola można ustalić atrybutami `rows` (liczba linii) i `cols` (szerokość).

```html
<label for="message">Wiadomość</label>
<textarea id="message" name="message" rows="6"></textarea>
```

---

### <code>&lt;select&gt;</code> i <code>&lt;option&gt;</code>: lista rozwijana

Służy do wyboru jednej (lub wielu, z atrybutem `multiple`) opcji z listy rozwijanej.

```html
<label for="topic">Temat</label>
<select id="topic" name="topic">
    <option value="">Wybierz temat</option>
    <option value="html">HTML</option>
    <option value="accessibility">Dostępność</option>
</select>
```

Opcje można grupować za pomocą `<optgroup>`. Atrybut `label` definiuje nazwę grupy, wyświetlaną jako nieaktywny nagłówek.

```html
<label for="tech">Technologia</label>
<select id="tech" name="tech">
  <option value="">Wybierz technologię</option>
  <optgroup label="Frontend">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="php">PHP</option>
    <option value="python">Python</option>
  </optgroup>
</select>
```

---

### <code>&lt;button&gt;</code>: przyciski formularza

Zawsze określaj atrybut `type` przycisku. Domyślnie przycisk wewnątrz formularza zachowuje się jak `type="submit"`.

```html
<!-- Wysyła formularz -->
<button type="submit">Wyślij formularz</button>

<!-- Resetuje wszystkie pola do stanu początkowego -->
<button type="reset">Wyczyść formularz</button>

<!-- Formularz na niego nie zareaguje -->
<button type="button">Kliknij</button>
```

---

### <code>&lt;output&gt;</code>: wynik obliczeń

Służy do wyświetlania wyników operacji wykonanych w formularzu. Atrybut `for` powinien zawierać identyfikatory `id` elementów wejściowych, z których pochodzą dane.

```html
<form>
    <label for="score">Wynik testu</label>
    <input id="score" name="score" type="number" value="8" min="0" max="10">
    <p>Ocena końcowa: <output name="grade" for="score">dobry</output></p>
</form>
```

_**♿ Dostępność (WCAG):**_
- **Powiązanie:** Atrybut `for` w tagu `<output>` powinien zawierać identyfikatory `id` elementów wejściowych, z których pochodzą dane do obliczeń.
- **Dynamiczne ogłaszanie:** Element ten ma domyślnie przypisaną rolę powiadomień na żywo. Kiedy jego wartość zostanie zmieniona, czytnik ekranu automatycznie odczyta nowy wynik użytkownikowi.

---

<data-gate>
  <data-quiz>
    <question>Dlaczego <code>placeholder</code> nie powinien zastępować elementu <code>&lt;label&gt;</code>?</question>
    <options>
      <item>Bo placeholder działa wyłącznie w polach typu <code>password</code>.</item>
      <item correct>Bo placeholder jest tylko podpowiedzią wizualną, znika podczas pisania i nie tworzy stabilnej nazwy pola.</item>
      <item>Bo placeholder blokuje wysyłanie formularza metodą <code>post</code>.</item>
      <item>Bo placeholder jest przeznaczony wyłącznie dla wyszukiwarek SEO.</item>
    </options>
    <div data-hint="error">Pomyśl o użytkowniku czytnika ekranu i osobie, która już zaczęła wpisywać tekst w polu.</div>
    <div data-hint="success">Dokładnie. <code>&lt;label&gt;</code> nazywa pole, a placeholder tylko podpowiada przykład lub oczekiwany format.</div>
  </data-quiz>
</data-gate>

---

<data-gate>
  <data-connection-matcher title="Połącz element formularza z jego rolą:">
    <div class="cmw-item" data-left="`&amp;lt;label&amp;gt;`" data-right="Nadaje polu zrozumiałą nazwę"></div>
    <div class="cmw-item" data-left="`name`" data-right="Określa nazwę pola w danych wysyłanych do serwera"></div>
    <div class="cmw-item" data-left="`required`" data-right="Oznacza pole jako obowiązkowe"></div>
    <div class="cmw-item" data-left="`&amp;lt;fieldset&amp;gt;`" data-right="Grupuje powiązane kontrolki formularza"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **`<form>` zbiera dane użytkownika**: `action` wskazuje adres, a `method` określa sposób wysłania danych.
- **Etykieta jest obowiązkowa w praktyce**: `<label>` tworzy stabilną nazwę pola dla człowieka, czytnika ekranu i narzędzi testujących.
- **Typ pola ma znaczenie**: `email`, `url`, `number`, `date`, `password` i inne typy niosą informację o rodzaju danych.
- **HTML ma podstawową walidację**: `required`, `min`, `max`, `maxlength` i `pattern` pomagają, ale nie zastępują walidacji serwera.
- **`fieldset` i `legend` porządkują grupy**: Szczególnie przy radio buttonach i checkboxach dają użytkownikowi kontekst.
- **`type="hidden"` przemyca dane**: niewidoczne dla użytkownika, wysyłane z formularzem. Używaj do tokenów CSRF i identyfikatorów kontekstu.
- **`disabled` nie wysyła, `readonly` wysyła**: to najczęstsza pomyłka przy formularzach z zablokowanymi polami.
- **`<datalist>` daje podpowiedzi bez ograniczeń**: użytkownik może wybrać opcję albo wpisać cokolwiek innego.

