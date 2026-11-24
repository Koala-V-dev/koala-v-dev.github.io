# Drzewo DOM i document.querySelector

Otwierasz kartę produktu w sklepie internetowym. Na ekranie widnieje napis „Brak w magazynie”, a przycisk zakupu jest nieaktywny. Po sekundzie status zmienia się na „Dostępny”, kolor ramki przechodzi w zieleń, a przycisk daje się kliknąć.

Plik HTML na serwerze nie zmienił się w tym czasie ani o jeden znak. Przeglądarka nie przeładowała też strony. Jak JavaScript zmienił zawartość ekranu, skoro sam plik HTML jest tylko statycznym tekstem?

Aby odpowiedzieć na to pytanie, musisz zobaczyć, co przeglądarka buduje w pamięci komputera zaraz po pobraniu pliku HTML.

---

## 🌳 Od pliku HTML do żywego drzewa DOM

Plik HTML to płaski tekst zapisany na dysku lub przesłany przez sieć. Zawiera znaczniki takie jak `<article>`, `<h2>` czy `<button>`, ale sam w sobie nie potrafi reagować na działania użytkownika ani zmieniać swojego stanu.

Gdy przeglądarka pobiera ten tekst, uruchamia parser HTML. Parser czyta znaczniki od góry do dołu i zamienia każdy z nich w żywy obiekt w pamięci RAM. Wszystkie te obiekty tworzą hierarchiczną strukturę nazywaną **drzewem DOM** (Document Object Model).

Spójrz na krótki fragment HTML:

```html
<article id="karta-produktu" class="karta">
  <h2>Klawiatura mechaniczna</h2>
  <p class="cena">299 zł</p>
  <button id="btn-kup">Dodaj do koszyka</button>
</article>
```

W pamięci przeglądarki ten tekst zamienia się w żywe drzewo powiązanych ze sobą obiektów. Kliknij dowolny selektor poniżej i zobacz na animacji, jak `document.querySelector` wędruje po węzłach w RAM:

<data-dom-tree-lab></data-dom-tree-lab>

Każdy punkt na tym schemacie to **węzeł** drzewa DOM. Znaczniki HTML stają się *węzłami elementów*, a napisy w ich wnętrzu stają się *węzłami tekstowymi*.

Kluczowa zmiana myślenia jest prosta: JavaScript nigdy nie edytuje pliku `.html` na dysku. JavaScript rozmawia wyłącznie z **drzewem DOM** w pamięci RAM. Gdy zmieniasz właściwość obiektu w DOM, przeglądarka natychmiast odrysowuje zmieniony fragment strony na ekranie.

---

## 📦 Zmienne const i let jako etykiety na węzły

Zanim zmienisz cokolwiek na stronie, musisz przechwycić konkretny obiekt z drzewa DOM i zapisać go pod czytelną nazwą. Do przechowywania takich odniesień w JavaScript służą zmienne deklarowane słowami `const` i `let`.

Słowo kluczowe **const** tworzy stałe powiązanie między nazwą a wartością. Po przypisaniu nie możesz podmienić tej etykiety na inny obiekt.

Słowo kluczowe *let* tworzy zmienną, której wartość możesz później nadpisać nową wartością. Używasz go na przykład do liczników albo tekstu, który zmienia się w trakcie działania programu.

```javascript
const nazwaSklepu = "TechLab";
let liczbaSztuk = 3;

liczbaSztuk = 4; // Poprawne: zmienna let pozwala na nadpisanie wartości.
// nazwaSklepu = "Inny"; // Błąd TypeError: nie można ponownie przypisać const.
```

W pracy z drzewem DOM niemal zawsze zapisujemy pobrane elementy w zmiennych **const**. Początkujący często obawiają się, że `const` zablokuje możliwość zmiany tekstu lub koloru danego elementu.

Tak się nie dzieje. Deklaracja `const` blokuje wyłącznie samą etykietę, czyli wskazanie na konkretny obiekt w pamięci. Wnętrze tego obiektu, na przykład jego tekst lub klasy CSS, nadal pozostaje w pełni modyfikowalne.

Do podglądania wartości zmiennych podczas nauki służy wbudowane polecenie `console.log(wartosc)`. Wypisuje ono dowolną wartość w konsoli narzędzi deweloperskich przeglądarki (skrót <kbd>F12</kbd>), dzięki czemu natychmiast widzisz, co naprawdę siedzi w pamięci.

> [!IMPORTANT]
> Wybieraj `const` jako domyślny sposób zapisywania referencji do elementów DOM. Sięgaj po `let` dopiero wtedy, gdy planujesz nadpisywać samą zmienną nową wartością.

---

## 🎯 Namierzanie elementu przez document.querySelector

Głównym punktem wejścia do całego drzewa DOM jest wbudowany obiekt _**document**_. Reprezentuje on całą załadowaną stronę i udostępnia metody do wyszukiwania węzłów.

Najbardziej uniwersalnym narzędziem do namierzania pojedynczego elementu jest metoda **document.querySelector**. Jako argument przyjmuje ona tekst z selektorem CSS: dokładnie takim samym, jakiego używasz w arkuszach stylów.

```javascript
const karta = document.querySelector("#karta-produktu");
const cena = document.querySelector(".cena");
const przycisk = document.querySelector("#karta-produktu button");
```

Zauważ, jak precyzyjnie działają znaki na początku selektora:

| Selektor w `querySelector` | Czego szuka w drzewie DOM | Przykład dopasowanego HTML |
| :--- | :--- | :--- |
| `"#btn-kup"` | Elementu o konkretnym atrybucie `id` | `<button id="btn-kup">` |
| `".cena"` | Pierwszego elementu z klasą CSS `cena` | `<p class="cena">` |
| `"h2"` | Pierwszego znacznika `<h2>` na stronie | `<h2>Klawiatura</h2>` |
| `"#karta .cena"` | Elementu `.cena` wewnątrz `#karta` | `<p class="cena">` w `#karta` |
| `"button[disabled]"` | Przycisku z atrybutem `disabled` | `<button disabled>` |

### 🔮 Przewidywanie: co zwróci querySelector przy wielu pasujących elementach

Zanim przeczytasz wyjaśnienie poniżej, zatrzymaj się na 20 sekund i zapisz w myślach własną odpowiedź.

Masz na stronie trzy karty produktów, a w każdej z nich znajduje się akapit z klasą `cena`:

```html
<p class="cena">120 zł</p>
<p class="cena">250 zł</p>
<p class="cena">89 zł</p>
```

Uruchamiasz kod:

```javascript
const wynik = document.querySelector(".cena");
```

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: czy zmienna `wynik` zawiera listę wszystkich trzech akapitów, ostatni akapit z ceną `89 zł`, czy wyłącznie pierwszy akapit z ceną `120 zł`?

### 🔎 Obserwacja i wyjaśnienie

Zmienna `wynik` przechowuje **wyłącznie pierwszy pasujący element**, czyli `<p class="cena">120 zł</p>`. Pozostałe dwa akapity zostają całkowicie zignorowane.

Metoda `document.querySelector` przeszukuje drzewo DOM od góry do dołu w kolejności zapisu w HTML. W chwili, gdy znajdzie pierwszy węzeł pasujący do selektora, natychmiast kończy poszukiwania i zwraca ten jeden obiekt.

Jeśli potrzebujesz pobrać wszystkie pasujące elementy naraz, użyjesz innej metody (`querySelectorAll`), którą poznasz w dalszej części tego modułu. Gdy celujesz w jeden konkretny element, najbezpieczniej jest nadać mu unikalny atrybut `id` i szukać go przez `#id`.

---

## 🩺 Diagnozowanie null i TypeError

Co się stanie, gdy selektor przekazany do `document.querySelector` nie pasuje do żadnego elementu w drzewie DOM? Metoda nie zgłasza wtedy błędu. Zamiast tego zwraca specjalną wartość **_null_**, która oznacza „nie znaleziono żadnego obiektu”.

### 🔮 Przewidywanie: brak znaku # przed identyfikatorem

Przeanalizuj poniższy kod HTML i JavaScript:

```html
<p id="status-zamowienia">Oczekuje na płatność</p>
```

```javascript
const statusEl = document.querySelector("status-zamowienia");
statusEl.textContent = "Opłacone";
```

> [!IMPORTANT]
> Zastanów się przed dalszym czytaniem: co zostanie zapisane w zmiennej `statusEl` w pierwszej linii i jaki komunikat pojawi się w konsoli przy wykonaniu drugiej linii?

### 🔎 Obserwacja i wyjaśnienie

W pierwszej linii brakuje znaku `#` przed nazwą identyfikatora. Przeglądarka szuka więc znacznika `<status-zamowienia>`, który nie istnieje w HTML. W efekcie zmienna `statusEl` otrzymuje wartość **_null_**.

Pierwsza linia kończy się po cichu bez żadnego ostrzeżenia. Awaria następuje dopiero w drugiej linii, gdy próbujesz ustawić właściwość `textContent` na wartości `null`.

Konsola wyświetla wtedy najczęstszy błąd w pracy z DOM:

```text
Uncaught TypeError: Cannot set properties of null (setting 'textContent')
```

Komunikat ten oznacza dosłownie: „nie można ustawić właściwości `textContent` na wartości `null`”. Błąd nie leży w samym `textContent`, tylko linijkę wyżej, w błędnym selektorze lub braku elementu w drzewie.

Gdy zobaczysz **_TypeError_** związany z `null`, sprawdź po kolei trzy najczęstsze przyczyny:

1. **_Brak prefiksu `#` lub `.`_**: dla `id` wymagany jest `#`, a dla `class` wymagana jest kropka `.`.
2. **_Literówka w nazwie_**: selektory rozróżniają wielkość liter i myślniki, więc `#statusZamowienia` to nie to samo co `#status-zamowienia`.
3. **_Zbyt wczesne uruchomienie skryptu_**: znacznik `<script>` umieszczony w `<head>` bez atrybutu `defer` wykonuje się, zanim przeglądarka zdąży zbudować elementy w `<body>`.

> [!WARNING]
> Gdy dołączasz zewnętrzny plik JavaScript w sekcji `<head>`, dodaj atrybut `defer` (`<script src="app.js" defer></script>`). Dzięki temu przeglądarka najpierw zbuduje całe drzewo DOM, a dopiero potem uruchomi Twój skrypt.

<data-gate>
  <data-sortable-list title="Ułóż etapy od pobrania HTML do aktualizacji elementu w DOM">
    <item data-correct="3">Skrypt wywołuje document.querySelector("#status") i otrzymuje referencję do węzła (albo null)</item>
    <item data-correct="1">Przeglądarka pobiera tekstowy plik HTML z serwera</item>
    <item data-correct="4">Skrypt modyfikuje właściwość obiektu w pamięci, a przeglądarka natychmiast odrysowuje widok</item>
    <item data-correct="2">Parser HTML buduje żywe drzewo obiektów DOM w pamięci RAM</item>
  </data-sortable-list>
</data-gate>

---

## ✍️ Bezpieczna zmiana treści: textContent kontra innerHTML

Po poprawnym namierzeniu węzła możesz odczytać lub zmienić jego zawartość tekstową. Do dyspozycji masz dwie popularne właściwości: **textContent** oraz *innerHTML*. Choć dla zwykłego tekstu wyglądają podobnie, działają na zupełnie innych zasadach.

Właściwość **textContent** traktuje przypisywany napis wyłącznie jako surowy tekst. Przeglądarka nie uruchamia parsera HTML i wyświetla dokładnie te znaki, które przekazałeś.

Właściwość *innerHTML* przekazuje napis do parsera HTML. Przeglądarka interpretuje napotkane znaczniki i buduje z nich nowe węzły w drzewie DOM.

Spójrz na różnicę w działaniu dla identycznego ciągu znaków:

```javascript
const napis = "<strong>Promocja</strong> -20%";

poleA.textContent = napis;
// Na ekranie dosłownie: <strong>Promocja</strong> -20%

poleB.innerHTML = napis;
// Na ekranie pogrubione: Promocja -20%
```

Dlaczego to rozróżnienie ma znaczenie krytyczne dla bezpieczeństwa? Wyobraź sobie, że wyświetlasz na stronie nazwę wpisaną wcześniej przez obcego użytkownika. Jeśli złośliwy użytkownik wpisze fragment HTML ze skryptem i wstawisz go przez `innerHTML`, przeglądarka wykona jego kod.

Taki atak nazywa się **_XSS_** (Cross-Site Scripting). Właściwość **textContent** całkowicie neutralizuje ten problem, ponieważ zamienia znaki `<` oraz `>` w zwykły, nieszkodliwy tekst na ekranie.

| Cecha | `textContent` | `innerHTML` |
| :--- | :--- | :--- |
| Interpretacja znaczników HTML | Nie (zawsze surowy tekst) | Tak (parsuje i tworzy nowe węzły) |
| Bezpieczeństwo przy danych od użytkownika | Bezpieczne | Ryzyko ataku **_XSS_** |
| Wydajność przy częstych zmianach | Wysoka (brak ponownego parsowania) | Niższa (wymaga pracy parsera HTML) |
| Kiedy stosować | Domyślnie do każdego tekstu | Wyłącznie dla zaufanego kodu HTML |

---

## 🎨 Sterowanie wyglądem przez classList

Zmiana wyglądu elementu nie wymaga wpisywania reguł CSS bezpośrednio w kodzie JavaScript. Zamiast manipulować pojedynczymi właściwościami `element.style.color`, definiujesz gotowe klasy w CSS, a w JavaScript jedynie włączasz lub wyłączasz je przez **classList**.

Właściwość `classList` daje dostęp do listy klas CSS przypisanych do danego węzła. Udostępnia cztery podstawowe metody:

- `element.classList.add("aktywny")`: dodaje klasę, jeśli jeszcze jej nie ma.
- `element.classList.remove("offline")`: usuwa wskazaną klasę.
- `element.classList.toggle("otwarty")`: dodaje klasę, gdy jej brakuje, albo usuwa ją, gdy już istnieje.
- `element.classList.contains("online")`: zwraca `true` lub `false`, informując, czy element ma tę klasę.

Przeanalizuj pełny przykład przejścia karty ze stanu nieaktywnego do gotowego:

```javascript
const karta = document.querySelector("#karta-produktu");
const statusEl = document.querySelector("#status-produktu");
const przycisk = document.querySelector("#btn-kup");

statusEl.textContent = "Dostępny od ręki";
karta.classList.remove("niedostepny");
karta.classList.add("dostepny");
przycisk.disabled = false;
```

Zwróć uwagę na ostatnią linię: `przycisk.disabled = false`. Atrybuty logiczne HTML (takie jak `disabled` w `<button disabled>`) mają swoje bezpośrednie odpowiedniki we właściwościach obiektu DOM typu logicznego (`true` lub `false`).

<data-gate>
<data-connection-matcher title="Połącz operację DOM z jej rzeczywistym skutkiem">
  <item left="`document.querySelector('.cena')`" right="Zwraca pierwszy napotkany węzeł z klasą cena w drzewie DOM"></item>
  <item left="`document.querySelector('brak-hasha')`" right="Zwraca null, jeśli nie istnieje znacznik o takiej nazwie"></item>
  <item left="`el.textContent = '&lt;b&gt;Test&lt;/b&gt;'`" right="Wypisuje dosłowny tekst ze znacznikami, bez parsowania HTML"></item>
  <item left="`el.classList.toggle('aktywny')`" right="Dodaje klasę aktywny, jeśli jej nie ma, lub usuwa ją, jeśli istnieje"></item>
  <item left="`przycisk.disabled = false`" right="Odblokowuje przycisk, usuwając stan nieaktywności w DOM"></item>
</data-connection-matcher>
</data-gate>

---

## 🛠️ Warsztat prowadzony: naprawa skryptu karty produktu

Poniższy skrypt miał zaktualizować kartę produktu: zmienić cenę promocyjną, usunąć klasę `wyprzedany` i dodać klasę `promocja`. Zawiera jednak trzy celowe usterki, przez które nie działa poprawnie.

Zdiagnozuj błędy i popraw skrypt w edytorze:
- Popraw selektor dla elementu o `id="cena-produktu"`, aby nie zwracał `null`.
- Zastąp niebezpieczne `innerHTML` bezpiecznym `textContent` przy ustawianiu tekstu `"199 zł"`.
- Popraw metody `classList` na karcie `#karta-produktu`, aby usunąć klasę `"wyprzedany"` i dodać klasę `"promocja"`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Naprawa karty produktu">
    <template data-type="html">
<style>
  .karta { padding: 16px; border-radius: 10px; border: 2px solid #94a3b8; font-family: sans-serif; max-width: 320px; }
  .karta.wyprzedany { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
  .karta.promocja { background: #ecfdf5; border-color: #10b981; color: #065f46; }
  .cena { font-size: 1.4rem; font-weight: 700; margin: 8px 0 0; }
</style>
<article id="karta-produktu" class="karta wyprzedany">
  <h3>Słuchawki studyjne</h3>
  <p id="cena-produktu" class="cena">299 zł</p>
</article>
    </template>
    <template data-type="code">
// Napraw 3 błędy w poniższym skrypcie:
const karta = document.querySelector("#karta-produktu");
const cenaEl = document.querySelector("cena-produktu");

cenaEl.innerHTML = "199 zł";

karta.classList.add("wyprzedany");
karta.classList.remove("promocja");
    </template>
    <template data-type="requirements">
      [
        {
          "id": "fix-selector",
          "text": "Poprawny selektor ID #cena-produktu w document.querySelector",
          "type": "regex",
          "pattern": "document\\.querySelector\\s*\\(\\s*[\"']#cena-produktu[\"']\\s*\\)"
        },
        {
          "id": "use-textcontent",
          "text": "Użycie textContent do ustawienia nowej ceny 199 zł",
          "type": "regex",
          "pattern": "cenaEl\\.textContent\\s*=\\s*[\"']199 zł[\"']"
        },
        {
          "id": "no-innerhtml",
          "text": "Usunięcie właściwości innerHTML ze skryptu",
          "type": "not-contains",
          "pattern": "innerHTML"
        },
        {
          "id": "remove-wyprzedany",
          "text": "Usunięcie klasy wyprzedany z karty przez classList.remove",
          "type": "regex",
          "pattern": "karta\\.classList\\.remove\\s*\\(\\s*[\"']wyprzedany[\"']\\s*\\)"
        },
        {
          "id": "add-promocja",
          "text": "Dodanie klasy promocja do karty przez classList.add",
          "type": "regex",
          "pattern": "karta\\.classList\\.add\\s*\\(\\s*[\"']promocja[\"']\\s*\\)"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🚀 Samodzielne zadanie: Panel statusu serwera

Teraz napiszesz kompletny skrypt sterujący od zera. W podglądzie znajduje się karta monitoringu serwera, która domyślnie jest w stanie wyłączonym (`offline`), a przycisk wejścia do panelu jest zablokowany (`disabled`).

Twoje wymagania:
1. Zapisz w zmiennych `const` referencje do trzech węzłów za pomocą `document.querySelector`: `#panel-serwera`, `#komunikat-statusu` oraz `#btn-panel`.
2. Zmień treść elementu `#komunikat-statusu` na `"Serwer aktywny"` używając wyłącznie `textContent`.
3. Na elemencie `#panel-serwera` usuń klasę `"offline"` i dodaj klasę `"online"` za pomocą `classList`.
4. Odblokuj przycisk `#btn-panel`, ustawiając jego właściwość `disabled` na `false`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Panel statusu serwera">
    <template data-type="html">
<style>
  .panel { padding: 18px; border-radius: 10px; border: 2px solid #64748b; font-family: sans-serif; max-width: 340px; }
  .panel.offline { background: #fff1f2; border-color: #e11d48; color: #881337; }
  .panel.online { background: #f0fdf4; border-color: #16a34a; color: #14532d; }
  .panel button { margin-top: 10px; padding: 8px 14px; border-radius: 6px; border: none; background: #16a34a; color: #fff; cursor: pointer; }
  .panel button:disabled { background: #94a3b8; cursor: not-allowed; }
</style>
<section id="panel-serwera" class="panel offline">
  <h3>Węzeł produkcyjny EU-01</h3>
  <p id="komunikat-statusu">Serwer wyłączony</p>
  <button id="btn-panel" disabled>Otwórz konsolę</button>
</section>
    </template>
    <template data-type="code">
// Napisz kod aktywujący panel serwera zgodnie z wymaganiami:

    </template>
    <template data-type="requirements">
      [
        {
          "id": "const-panel",
          "text": "Pobranie #panel-serwera przez document.querySelector i zapis w const",
          "type": "regex",
          "pattern": "const\\s+[a-zA-Z_$][a-zA-Z0-9_$]*\\s*=\\s*document\\.querySelector\\s*\\(\\s*[\"']#panel-serwera[\"']\\s*\\)"
        },
        {
          "id": "const-status",
          "text": "Pobranie #komunikat-statusu przez document.querySelector i zapis w const",
          "type": "regex",
          "pattern": "const\\s+[a-zA-Z_$][a-zA-Z0-9_$]*\\s*=\\s*document\\.querySelector\\s*\\(\\s*[\"']#komunikat-statusu[\"']\\s*\\)"
        },
        {
          "id": "const-btn",
          "text": "Pobranie #btn-panel przez document.querySelector i zapis w const",
          "type": "regex",
          "pattern": "const\\s+[a-zA-Z_$][a-zA-Z0-9_$]*\\s*=\\s*document\\.querySelector\\s*\\(\\s*[\"']#btn-panel[\"']\\s*\\)"
        },
        {
          "id": "set-text",
          "text": "Zmiana tekstu komunikatu na \"Serwer aktywny\" przez textContent",
          "type": "regex",
          "pattern": "\\.textContent\\s*=\\s*[\"']Serwer aktywny[\"']"
        },
        {
          "id": "no-innerhtml-2",
          "text": "Brak użycia innerHTML w rozwiązaniu",
          "type": "not-contains",
          "pattern": "innerHTML"
        },
        {
          "id": "toggle-classes-remove",
          "text": "Usunięcie klasy offline przez classList.remove",
          "type": "regex",
          "pattern": "\\.classList\\.remove\\s*\\(\\s*[\"']offline[\"']\\s*\\)"
        },
        {
          "id": "toggle-classes-add",
          "text": "Dodanie klasy online przez classList.add",
          "type": "regex",
          "pattern": "\\.classList\\.add\\s*\\(\\s*[\"']online[\"']\\s*\\)"
        },
        {
          "id": "enable-button",
          "text": "Odblokowanie przycisku przez ustawienie disabled = false",
          "type": "regex",
          "pattern": "\\.disabled\\s*=\\s*false"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
  <summary>Głębsze spojrzenie: jak silnik przeglądarki buduje DOM i dlaczego textContent wygrywa z innerText</summary>

  <h4>Jak powstaje drzewo DOM i drzewo renderowania</h4>
  <p>Parser HTML zamienia strumień bajtów w tokeny (np. tag otwierający, atrybuty, tag zamykający), a następnie buduje z nich hierarchię obiektów zgodną ze specyfikacją WHATWG DOM Living Standard. Równolegle parser CSS buduje osobne drzewo stylów nazywane CSSOM. Dopiero połączenie DOM oraz CSSOM tworzy drzewo renderowania, na podstawie którego silnik oblicza geometrię bloków (layout) i maluje piksele na ekranie.</p>

  <h4>Różnica między textContent a innerText</h4>
  <p>W starszych poradnikach często pojawia się właściwość <code>innerText</code>. W przeciwieństwie do <code>textContent</code>, odczyt <code>innerText</code> uwzględnia aktualne style CSS (np. pomija elementy z <code>display: none</code>). Wymusza to na przeglądarce natychmiastowe przeliczenie układu strony (reflow), co przy częstych wywołaniach potrafi wyraźnie spowolnić aplikację. Właściwość <code>textContent</code> czyta bezpośrednio węzły tekstowe w DOM bez uruchamiania silnika układu.</p>

  <h4>Dlaczego zmiana pojedynczej klasy jest lepsza niż modyfikacja style</h4>
  <p>Wielokrotne przypisywanie właściwości <code>element.style.color</code>, <code>element.style.border</code> i <code>element.style.background</code> w kodzie JavaScript miesza warstwę logiki z warstwą prezentacji i nadpisuje reguły arkusza CSS stylami liniowymi o wysokiej specyficzności. Przełączanie klas przez <code>classList</code> pozwala utrzymać wszystkie style w pliku CSS oraz ułatwia obsługę motywów (np. trybu ciemnego).</p>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **HTML a drzewo DOM**: HTML to plik tekstowy, a DOM to żywa struktura obiektów w RAM; JavaScript modyfikuje wyłącznie obiekty DOM, a przeglądarka natychmiast odzwierciedla zmiany.
- **Referencje w `const`**: stałe powiązanie chroni przed przypadkowym nadpisaniem zmiennej, ale pozwala swobodnie zmieniać tekst, klasy i atrybuty samego węzła.
- **Wynik `document.querySelector`**: metoda zwraca pierwszy pasujący element albo `null`, dlatego zawsze sprawdzaj prefiks `#` (dla `id`) oraz `.` (dla `class`).
- **Diagnoza błędu**: gdy widzisz **_TypeError_** z komunikatem o `null`, szukaj przyczyny w linii z `querySelector`, nie w samej właściwości `textContent` czy `classList`.
- **`textContent` i `classList`**: stosuj `textContent` do bezpiecznej zmiany napisów (bez ryzyka XSS), a `classList` do przełączania stanów wizualnych w CSS.

> [!TIP]
> Chcesz poćwiczyć namierzanie elementów i modyfikację gotowych struktur HTML w większych projektach? Sprawdź [Katalog zadań praktycznych](/arkusze/?qual=INF.03).
