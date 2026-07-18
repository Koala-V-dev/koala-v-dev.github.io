# Kaskadowość i Specyficzność

CSS to nie jest zwykła lista życzeń. Przeglądarka nie traktuje kodu jak zbioru poleceń, które wykonuje bezkrytycznie jedno po drugim. 

Działa ona jak sędzia. Każdego dnia rozstrzyga setki sprzecznych instrukcji o tym, jak ma wyglądać pojedynczy element na ekranie. Jeśli dwie różne reguły próbują ustawić odmienne kolory dla tego samego przycisku, przeglądarka musi natychmiast rozstrzygnąć ten spór.

Do tego służy _**kaskadowość**_ oraz _**specyficzność**_. Zrozumienie tych mechanizmów to klucz do sprawnego pisania stylów.

Najważniejsza zasada tej lekcji brzmi: <strong>**CSS jest systemem rozstrzygania konfliktów, a nie tylko zbiorem dekoracji**</strong>.

---

## ⚖️ Podział odpowiedzialności: HTML vs CSS

Pisząc kod, zawsze oddzielasz strukturę dokumentu od jego prezentacji. Tag HTML opisuje znaczenie treści, a arkusz CSS definiuje jej wygląd.

Możesz wpisać styl bezpośrednio w atrybucie tagu, na przykład `<p style="color: blue;">`. Jest to jednak uciążliwe przy wielu podstronach. Zmiana wyglądu w całym serwisie wymagałaby wtedy edycji każdego pliku osobno.

Zewnętrzny plik z rozszerzeniem `.css` to jedno źródło prawdy dla całego serwisu. Pozwala on na zmianę wyglądu wszystkich podstron w jednym miejscu.

Aby połączyć zewnętrzny plik CSS z dokumentem HTML, używamy znacznika `<link>` umieszczanego w sekcji `<head>` pliku HTML:

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

Atrybut `href` wskazuje ścieżkę do pliku ze stylami, a `rel="stylesheet"` informuje przeglądarkę o typie powiązania.

Istnieje jednak ważny wyjątek od tej reguły. Są to style krytyczne (tzw. *Critical CSS*). Wklejamy je bezpośrednio w nagłówku `<head>` strony HTML pomiędzy znacznikami `<style>...</style>`. Dzięki temu przeglądarka rysuje je od pierwszej milisekundy. Używamy ich do stworzenia prostego wskaźnika ładowania (loadera), co poprawia odbiór aplikacji.

Style krytyczne chronią użytkownika przed nagłym rozbłyskiem ekranu, czyli zjawiskiem *flashlight*. Gdy ktoś pracuje w nocy i używa ciemnego motywu, pojawienie się jasnego tła przed wczytaniem zewnętrznych stylów tworzy efekt FOUC (*flash of unstyled content*). To błąd UX (*User Experience*), który wywołuje dyskomfort i wybija z rytmu pracy. Wstrzyknięcie podstawowych stylów z ciemnym tłem bezpośrednio do kodu HTML usuwa ten problem. Dzięki temu użytkownik od pierwszej chwili widzi spójny motyw.

> [!CAUTION]
> Nie zamieszczaj wszystkich stylów jako krytycznych bo z reguły mogą nimi nie być. Jedyne co spowodujesz to wzrost rozmiaru pliku html co może spowodować wydłużenie czasu dostępu przez wolniejszy internet odbiorcy. Dodatkowo mieszasz w ten sposób warstwę struktury z prezentacją.


<iframe src="/public/resources/web-site-preview/critical-css-simulation.html" width="600" height="620" style="border: 3px solid #ccc;width: 100%;" title="Symulacja ładowania Critical CSS vs Flashlight" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

## 🏗️ Podstawy wyglądu: kolory, czcionki i motywy

Na początku nauki CSS skupisz się na trzech podstawowych właściwościach tekstu i tła:
- `color` (kolor samego tekstu),
- `background-color` (barwa tła elementu),
- `font-family` (krój czcionki).

Standardem projektowania stron jest dziś wsparcie dla jasnego i ciemnego motywu. W CSS realizujemy to za pomocą zmiennych oraz reguł `@media` (tzw. zapytań mediów):

```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --text-color: #f5f5f5;
  }
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### ⚙️ Jak działają reguły @media?
Reguła `@media` to instrukcja warunkowa w CSS. Mówi ona przeglądarce: „zastosuj ten blok stylów tylko wtedy, gdy spełniony jest konkretny warunek urządzenia”. 

W powyższym kodzie używamy zapytania `(prefers-color-scheme: dark)`. Przeglądarka odczytuje preferencje kolorystyczne bezpośrednio z systemu operacyjnego użytkownika. Jeśli w systemie (np. w menu <kbd class="win-menu-btn">Ustawienia</kbd> → <kbd class="win-menu-btn">Personalizacja</kbd> → <kbd class="win-menu-btn">Kolory</kbd>, jak na poniższym zrzucie ekranu) włączony jest tryb ciemny, przeglądarka podmieni wartości zmiennych `--bg-color` i `--text-color` na ich mroczne odpowiedniki 🧛🏼‍♂️.

![](/public/courses/web-frontend/Images/motyw-systemu-windows-11.png)

<data-gate>
  <data-quiz>
    <question>
Do czego służą style krytyczne (Critical CSS) i dlaczego wstrzykuje się je bezpośrednio w nagłówek HTML?
    </question>
    <options>
      <option correct>Do natychmiastowego renderowania pierwszego widoku strony w celu uniknięcia białego rozbłysku.</option>
      <option>Do nadpisania wszystkich pozostałych reguł w pliku CSS za pomocą wyższej specyficzności selektora.</option>
      <option>Do zablokowania pobierania zewnętrznych plików ze stylami i zmuszenia przeglądarki do pracy offline.</option>
    </options>
    <div data-hint="error">
      Nie. Zewnętrzne pliki nadal się wczytują, a wstrzyknięcie bezpośrednie nie zmienia zasad specyficzności. Spróbuj jeszcze raz!
    </div>
    <div data-hint="success">
      Doskonale! Wstrzyknięte style krytyczne ładują się natychmiast, chroniąc przed nieprzyjemnym białym rozbłyskiem.
    </div>
  </data-quiz>
</data-gate>

---

## 🌊 Algorytm kaskady: jak przeglądarka godzi sprzeczne reguły

Nazwa _**Cascading Style Sheets**_ odnosi się do sposobu, w jaki style spływają kaskadą z góry na dół przez kolejne poziomy decyzyjne.

Gdy przeglądarka ustala wygląd elementu, sprawdza trzy kryteria w określonej kolejności:

### 🏢 1. Znaczenie i pochodzenie stylu

Przeglądarka najpierw bada, skąd pochodzi dany styl. Zderzają się one na trzech poziomach ważności:
-   Style domyślne przeglądarki (*`User Agent Stylesheet`*).
-   Style użytkownika (np. własne ustawienia kontrastu lub powiększona czcionka).
-   Style dewelopera (Twoje pliki `.css`).

Możesz zmienić domyślną kolejność ważności poprzez użycie słowa `!important` na końcu deklaracji.

### ⚖️ 2. Specyficzność selektora

Jeśli dwa sprzeczne style pochodzą z tego samego źródła, przeglądarka porównuje ich specyficzność. Specyficzność to matematyczna waga selektora. Im bardziej precyzyjnie wskażesz element, tym większą siłę ma Twoja reguła.

### 🧭 3. Kolejność w kodzie

Gdy pochodzenie oraz specyficzność są identyczne, przeglądarka stosuje regułę ostatniej szansy. Styl zdefiniowany niżej w pliku CSS nadpisze ten zadeklarowany wyżej.

---

## 🎯 Selektory w akcji: precyzja wskazywania elementów

Selektor to wyrażenie wskazujące przeglądarce, do którego elementu HTML ma zastosować styl. Odpowiedni dobór selektorów pozwala zachować czytelność kodu i ułatwia późniejsze modyfikacje.

### 🧱 Selektory proste

Selektory proste to podstawowe narzędzie do wskazywania elementów w dokumencie HTML:
-   **Selektor elementu (tagu):** odwołuje się do wszystkich tagów danego typu (np. `p` stylizuje każdy akapit, a `h1` każdy nagłówek pierwszego stopnia).
-   **Selektor klasy:** oznaczany kropką `.` w pliku CSS (np. `.card`), która odpowiada atrybutowi `class="card"` w kodzie HTML. Klasy są elastyczne. Możesz przypisać tę samą klasę do wielu różnych elementów na jednej stronie. Z tego powodu na klasach opiera się niemal cała struktura współczesnego CSS.
-   **Selektor identyfikatora (ID):** oznaczany hasztagiem `#` w pliku CSS (np. `#main-header`), który odpowiada atrybutowi `id="main-header"` w kodzie HTML. Identyfikator musi być unikalny, co oznacza, że dany identyfikator może pojawić się na danej stronie HTML tylko jeden raz.

#### 🧭 Kiedy używać ID?

Ze względu na ogromną wagę specyficzności identyfikatorów, ich stosowanie bezpośrednio w arkuszach stylów CSS jest złą praktyką, ponieważ blokują one elastyczność kaskady. ID ma jednak kluczowe, niezastąpione zastosowania w strukturze strony:
1.  **Dostępność** (*Accessibility*): łączenie etykiet z polami formularzy (atrybut `for` w tagu `<label>` odsyłający do `id` w tagu `<input>`) oraz asocjacje z atrybutami typu `aria-describedby` i `aria-labelledby`.
2.  **Nawigacja wewnątrzstronnicowa („kotwice”):** odnośniki w menu `<a href="#kontakt">` przenoszące użytkownika bezpośrednio do sekcji zdefiniowanej jako `<section id="kontakt">`.
3.  **Skrypty JavaScript:** szybkie i jednoznaczne pobieranie konkretnego elementu z drzewa DOM za pomocą metody `document.getElementById()`.

> [!NOTE]
> **Asocjacja**: W kontekście dostępności, asocjacja to technika polegająca na powiązaniu dwóch lub więcej elementów w dokumencie HTML w celu przekazania dodatkowych informacji semantycznych lub instrukcji dotyczących interakcji.

### 🧩 Pseudo-klasy i pseudo-elementy

Pseudo-klasy opisują stany elementów. Najpopularniejsza pseudo-klasa `:hover` reaguje na najechanie kursorem myszy, a `:focus` aktywuje się podczas nawigacji klawiaturą (np. po wciśnięciu klawisza <kbd>Tab</kbd>).

Pseudo-elementy pozwalają wstawić wirtualną strukturę bez modyfikacji kodu HTML. Za pomocą pseudo-elementów `::before` oraz `::after` w połączeniu z właściwością `content` wstrzykniesz dekoracje bezpośrednio przed lub po zawartości elementu.

### 🔗 Kombinatory

Kombinatory łączą selektory, tworząc relacje w drzewie dokumentu:
-   **Kombinator potomka (spacja):** wybiera wszystkie zagnieżdżone elementy wewnątrz określonego rodzica (np. `.box article` ostyluje każdy tag `article` zagnieżdżony wewnątrz kontenera `.box`, niezależnie od głębokości, w tym również te zagnieżdżone w sobie nawzajem artykuły).
-   **Kombinator dziecka (`>`):** ogranicza stylizację wyłącznie do bezpośrednich potomków (np. `.box > article` ostyluje tylko te artykuły `article`, które znajdują się bezpośrednio na pierwszym poziomie kontenera `.box`, ignorując te głębiej zagnieżdżone).
-   **Kombinator sąsiedni (`+`):** stylizuje element leżący bezpośrednio po wybranym tagu na tym samym poziomie struktury HTML (np. w sekwencji trzech kontenerów selektor `.box + .box` ostyluje zarówno drugi, jak i trzeci kontener, ponieważ każdy z nich ma bezpośrednio przed sobą inny element `.box`).

Dzięki kombinatorom precyzyjnie zaadresujesz elementy bez konieczności nadawania im osobnych klas.

<iframe src="/public/resources/web-site-preview/combinators-visualizer.html" width="600" height="450" style="border: 3px solid #ccc;width: 100%;" title="Wizualizator kombinatorów CSS" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

## 📐 Matematyka specyficzności: obliczanie wagi

Specyficzność to system punktowy obliczany przez przeglądarkę. Wagę selektora zapisujemy w postaci czterech kolumn: `(Inline, ID, Klasa, Element)`.

System ten przypomina pozycyjny zapis liczbowy (np. system dziesiętny lub dwójkowy). Wartość w lewej kolumnie ma zawsze nieskończenie większą wagę niż wartość w prawej kolumnie. Oznacza to, że pojedynczy punkt w kolumnie ID `(0, 1, 0, 0)` zawsze przeważy nad dowolną liczbą punktów w kolumnie klas czy elementów. Przykładowo, selektor z dziesięcioma klasami `(0, 0, 10, 0)` i tak przegra z jednym ID.

Wartości poszczególnych kolumn obliczamy następująco:

<ol type="A">
<li>
    
**Styl wbudowany:** Zapisany bezpośrednio w atrybucie `style="..."` w pliku HTML. Waga wynosi $1$ punkt w pierwszej kolumnie: `(1, 0, 0, 0)`.</li>
<li>
    
**Identyfikatory:** Każde użycie ID (np. `#header`) daje $1$ punkt w drugiej kolumnie: `(0, 1, 0, 0)`.</li>
<li>
    
**Klasy, atrybuty, pseudo-klasy:** Klasy (np. `.card`), selektory atrybutów (np. `[type="text"]`) oraz pseudo-klasy opisujące stany (np. `:hover`) dają $1$ punkt w trzeciej kolumnie: `(0, 0, 1, 0)`.</li>
<li>
    
**Elementy, pseudo-elementy:** Tagi HTML (np. `p`) oraz pseudo-elementy (np. `::before`) dają $1$ punkt w czwartej kolumnie: `(0, 0, 0, 1)`.</li>
</ol>

<iframe src="/public/resources/web-site-preview/cascade-visualizer.html" width="600" height="620" style="border: 3px solid #ccc;width: 100%;" title="Wizualizator kaskady i specyficzności CSS" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

### 🚫 Wojna specyficzności i pułapka <code>!important</code>

Błędy w planowaniu struktury CSS oraz brak dyscypliny w doborze selektorów często prowadzą do sytuacji, w której nowo dopisana reguła nie chce zadziałać. Przeglądarka po prostu ignoruje nowy kod, ponieważ wcześniej zadeklarowany styl ma wyższą specyficzność. 

Szybkim, lecz niezwykle niebezpiecznym rozwiązaniem staje się wtedy użycie dopisku `!important`.

Dodanie deklaracji `!important` na końcu właściwości (np. `color: red !important;`):
1.  **Nie modyfikuje** specyficzności samego selektora.
2.  **Przenosi** właściwość do specjalnego, najwyższego koszyka pierwszeństwa, ignorując normalną matematykę specyficzności.

To prosta droga do tzw. „wyścigu zbrojeń” (wojny specyficzności):
-   Aby nadpisać właściwość oznaczoną jako `!important`, musisz użyć kolejnego selektora z `!important`, który ma wyższą specyficzność lub leży niżej w kodzie.
-   Z czasem arkusz staje się chaotyczny i niemożliwy do zdebugowania, a każda drobna zmiana wyglądu wymaga dopisywania `!important` w kolejnych miejscach.

> [!TIP]
> **Kiedy użycie `!important` jest uzasadnione?**
> * **Klasy narzędziowe (Utility classes):** Np. klasa `.d-none { display: none !important; }` lub `.visually-hidden`. Chcemy mieć pewność, że jeśli przypiszemy tę klasę do elementu, to zawsze ukryje ona ten element, bez względu na inne reguły.
> * **Overriding stylów zewnętrznych:** Gdy musimy wymusić zmianę wyglądu widgetu dostarczanego przez zewnętrzny skrypt JS, który generuje sztywne style inline.

---

### 🛡️ Dobre praktyki: Jak unikać konfliktów specyficzności?

Zamiast sięgać po `!important`, stosuj sprawdzony zestaw reguł architektonicznych:

#### 1. Projektuj płaską specyficzność (Flat Specificity)

Staraj się, aby większość Twoich reguł miała taką samą, niską specyficzność (opieraj kod o pojedyncze klasy). Unikaj głębokiego zagnieżdżania selektorów.

- ❌ **_Źle (wysoka specyficzność: $0, 1, 2, 1$):_**
  ```css
  #sidebar .card .card-body h2 { color: #333; }
  ```
> *Ta reguła zablokuje możliwość łatwego ostylowania nagłówka w innym miejscu.*
  
- ✅ **Dobrze (niska specyficzność: $0, 0, 1, 0$):**
  ```css
  .card__title { color: #333; }
  ```
> *Opieraj nazewnictwo o metodologie takie jak BEM (Block-Element-Modifier), co pozwala zachować czystą strukturę.*

#### 2. Rezerwuj ID dla HTML i JS, nie dla CSS
Identyfikatory (`#`) mają specyficzność o wadze $100$, co natychmiast blokuje elastyczność kodu.
- Używaj identyfikatorów (`id="..."`) do kotwic (linków), powiązań formularzy (`<label for="...">`) oraz jako selektorów dla JavaScript.
- Do stylizowania w CSS używaj **wyłącznie klas** (`class="..."`).

#### 3. Unikaj stylów wbudowanych (Inline Styles)
Style zadeklarowane bezpośrednio w tagu HTML (`style="..."`) mają specyficzność $1000$. 
- Blokują one możliwość modyfikowania wyglądu za pomocą zewnętrznych arkuszy CSS.
- Całkowicie uniemożliwiają stosowanie zapytań medialnych (Media Queries) do responsywnego dostosowania elementu.


---

### 🚀 Stacja Treningowa: Nadpisywanie specyficzności

Inny deweloper zdefiniował wygląd karty za pomocą selektorów złożonych:  
`div.card` (kolor tła) oraz `div.card h2.title` (kolor tekstu nagłówka). 

Twoim zadaniem jest nadpisanie koloru tła oraz koloru tekstu tytułu. Musisz napisać własne selektory o specyficzności równej lub większej od tych oryginalnych, aby Twoje reguły wygrały w kaskadzie.

**Zasady gry:**
-   **_Nie używaj_** deklaracji `!important`.
-   Wpisz swoje style pod komentarzem.
-   Użyj selektora `div.card` do zmiany koloru tła na `#1a1a1a`.
-   Użyj selektora `div.card h2.title` do zmiany koloru tekstu na `#ebebeb`.

<data-gate>
  <data-web-challenge id="specificity-challenge">
<template data-type="html-readonly">
<div class="card">
  <h2 class="title">Tytuł karty</h2>
  <p class="desc">Opis karty z tekstem pomocniczym.</p>
</div>
</template>
<template data-type="css-readonly">
div.card h2.title {
  color: #e74c3c; /* Czerwony */
}
div.card {
  background-color: #2c3e50;
}
</template>
<template data-type="css">
/* Napisz swoje reguły poniżej, aby nadpisać tło i kolor tytułu */
.desc {
  color: #bdc3c7;
}
</template>
<template data-type="requirements">
      [
        {"id": "bg-color", "text": "Ustaw kolor tła za pomocą div.card na #1a1a1a", "type": "selector-css", "selector": "div.card", "property": "background-color", "value": "#1a1a1a"},
        {"id": "title-color", "text": "Ustaw kolor tekstu za pomocą div.card h2.title na #ebebeb", "type": "selector-css", "selector": "div.card h2.title", "property": "color", "value": "#ebebeb"}
      ]
    </template>
  </data-web-challenge>
</data-gate>

---

## 🧬 Dziedziczenie: kiedy style przechodzą w głąb dokumentu

Dziedziczenie to mechanizm, w którym niektóre właściwości CSS przechodzą z rodzica na jego dzieci w drzewie dokumentu. Zapobiega to ciągłemu powtarzaniu tego samego kodu dla każdego elementu z osobna.

### 🟢 Co się dziedziczy?

Przeglądarka pozwala na automatyczne dziedziczenie właściwości powiązanych z prezentacją tekstu. Należą do nich między innymi rodzina czcionek, rozmiar tekstu, jego waga, kolor oraz wysokość linii.

Wystarczy, że zdefiniujesz te właściwości dla kontenera `body`, a wszystkie podrzędne elementy tekstowe je przejmą. Ułatwia to spójne zarządzanie typografią na całej stronie za pomocą zaledwie kilku linijek kodu.

### 🔴 Co się nie dziedziczy?

Przeglądarka nie dziedziczy właściwości związanych z układem przestrzennym i rozmiarem pudełka. Należą do nich marginesy zewnętrzne (`margin`), marginesy wewnętrzne (`padding`), obramowanie oraz kolor tła.

Bez tej ochrony na stronie panowałby chaos. Gdyby obramowanie sekcji dziedziczyło się automatycznie, każdy akapit i link wewnątrz tekstu otrzymałyby własną ramkę. Dzięki blokadzie dziedziczenia elementy zachowują swój unikalny kształt i pozycję bez wpływu otaczających ich rodziców.


### 🛠️ Sterowanie dziedziczeniem: wymuszony reset i przejmowanie stylów

Czasami domyślne zachowanie przeglądarki nam nie odpowiada. Możemy chcieć zmusić element do dziedziczenia czegoś, co normalnie się nie dziedziczy (np. zmusić przycisk do przejęcia czcionki strony), albo zresetować styl do domyślnych wartości fabrycznych.

Do sterowania tym mechanizmem służą cztery specjalne wartości w CSS:

1.  _**`inherit` (Przejmij od rodzica)**_
    Zmusza element do odczytania wartości od swojego bezpośredniego rodzica, nawet jeśli dana właściwość normalnie się nie dziedziczy.
    *   **Przykład:** Domyślnie przyciski `<button>` w przeglądarce ignorują czcionkę ustawioną dla całej strony (dla `body`). Aby to naprawić, zmuszamy je do przejęcia wartości:
        ```css
        button {
            font-family: inherit; /* Przyjmij czcionkę po rodzicu */
        }
        ```

2.  _**`initial` (Wyczyść do wartości fabrycznych CSS)**_
    Resetuje właściwość do jej oficjalnej, fabrycznej wartości domyślnej zdefiniowanej w specyfikacji CSS. Całkowicie ignoruje przy tym style rodziców.
    *   **Przykład:** Jeśli zmieniliśmy kolor tekstu w całej sekcji na zielony, a dla jednego akapitu chcemy przywrócić fabryczny domyślny kolor przeglądarki, piszemy:
        ```css
        p.reset {
            color: initial; /* Wróć do domyślnej czerni CSS */
        }
        ```

3.  _**`unset` (Inteligentny powrót do natury)**_
    Działa jak automatyczny przełącznik:
    *   Jeśli właściwość naturalnie się dziedziczy (np. `color`), `unset` zachowa się jak `inherit`.
    *   Jeśli właściwość naturalnie się nie dziedziczy (np. `border`, `margin`), `unset` zachowa się jak `initial`.
    *   **Przykład:** Zastosowanie `all: unset;` na przycisk `<button>` usunie z niego całkowicie wbudowane style przeglądarki (szare tło, ramkę, marginesy wewnętrzne), zamieniając go w czysty, surowy tekst:
        ```css
        button.raw {
            all: unset; /* Przycisk staje się wizualnie zwykłym tekstem */
        }
        ```

4.  _**`revert` (Cofnij do domyślnych stylów przeglądarki)**_
    Przywraca właściwość do wartości, jaką posiadałaby, gdyby autor strony nie napisał dla niej żadnych własnych reguł. Oznacza to powrót do domyślnego stylu przeglądarki (*`User Agent Stylesheet`*).
    *   **Przykład:** Jeśli całkowicie zmodyfikowaliśmy styl przycisków na stronie, ale dla jednego z nich chcemy przywrócić fabryczny wygląd z szarym tłem i domyślnym obramowaniem systemowym, piszemy:
        ```css
        button.classic {
            all: revert; /* Przywraca fabryczny, domyślny wygląd przycisku */
        }
        ```

---

### 🚀 Stacja Treningowa: Sterowanie dziedziczeniem

W tej stacji treningowej pracujesz z przyciskiem `.my-btn` umieszczonym wewnątrz kontenera `.container`. Kontener posiada ustawiony zielony kolor pisma oraz czcionkę o stałej szerokości (`monospace`).

Domyślnie przeglądarka blokuje dziedziczenie czcionek dla elementów interaktywnych takich jak `<button>`, przez co przycisk ignoruje styl rodzica. Twoim zadaniem jest przejęcie kontroli nad tym zachowaniem.

**Zasady gry:**
-   Wpisz swoje style pod komentarzem.
-   Użyj selektora `.my-btn`.
-   Zmuś przycisk do przejęcia kroju czcionki (`font-family`) od rodzica za pomocą wartości `inherit`.
-   Zresetuj wszystkie pozostałe domyślne style wizualne przycisku (tło, ramkę, dopełnienie) za pomocą właściwości `all` ustawionej na `unset`.

<data-gate>
  <data-web-challenge id="inheritance-challenge">
<template data-type="html-readonly">
<div class="container">
  <button class="my-btn">Kliknij mnie</button>
</div>
</template>
<template data-type="css-readonly">
.container {
  font-family: monospace;
  color: #2ecc71;
}
</template>
<template data-type="css">
/* Napisz swoje reguły poniżej, aby zresetować style i przejąć czcionkę */

</template>
<template data-type="requirements">
      [
        {"id": "font-inherit", "text": "Zmuś .my-btn do dziedziczenia czcionki po rodzicu (.container) za pomocą inherit", "type": "selector-css", "selector": ".my-btn", "property": "font-family", "value": "inherit"},
        {"id": "all-unset", "text": "Zresetuj domyślne style przycisku z tą klasą za pomocą unset", "type": "selector-css", "selector": ".my-btn", "property": "all", "value": "unset"}
      ]
    </template>
  </data-web-challenge>
</data-gate>

---

## ♿ Dostępność wizualna: kontrast, dysleksja i barwy

Projektowanie interfejsów to także dbanie o to, by były one dostępne dla każdego użytkownika.

### 👓 Dobór czcionek pod dysleksję

Osoby z dysleksją mają trudności z płynnym odczytywaniem i rozróżnianiem podobnych kształtów liter, zwłaszcza w przypadku znaków o zbliżonej budowie graficznej (takich jak mała litera `l`, wielka litera `I` oraz cyfra `1`). Możesz ułatwić im czytanie prostymi zabiegami w CSS.

Świetną praktyką jest stosowanie krojów pisma opracowanych z myślą o maksymalnej czytelności, takich jak specjalistyczny font Atkinson Hyperlegible (najlepiej w połączeniu z `Verdana` lub `Geneva`). Systemowe czcionki bezszeryfowe (np. `Inter` lub `system-ui`) również sprawdzają się lepiej niż tradycyjne czcionki szeryfowe o ozdobnych zakończeniach linii.

Zwiększaj odstęp między wierszami za pomocą wysokości linii ustawionej w przedziale **od $1.5$ do $1.8$**, np. `line-height: 1.7`. Unikaj przekraczania wartości 1.8 – zbyt duże odległości pionowe rozpraszają tekst i tworzą białe plamy na ekranie, co utrudnia skupienie wzroku osobom z astygmatyzmem. Pod żadnym pozorem nie stosuj pełnego wyjustowania tekstu (`text-align: justify`). Tworzy ono nieregularne pionowe korytarze pustej przestrzeni między słowami, które skutecznie rozpraszają czytelnika.

<iframe src="/public/resources/web-site-preview/dyslexia-simulation.html" width="600" height="620" style="border: 3px solid #ccc;width: 100%;" title="Symulacja typografii dla dysleksji" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 🌗 Kontrast i czytelność tekstu

Osoby słabowidzące tracą zdolność rozróżniania słabych kontrastów barw tekstu i tła. Wytyczne WCAG definiują minimalne progi dostępności cyfrowej dla tekstu standardowego (poniżej 18pt / 24px):
- **Poziom AA (podstawowy):** kontrast tekstu do tła musi wynosić co najmniej **$4.5:1$**.
- **Poziom AAA (optymalny):** kontrast tekstu do tła musi wynosić co najmniej **$7:1$**.

Dla dużych tekstów (powyżej 18pt lub pogrubionych powyżej 14pt) wymagania te są łagodniejsze i wynoszą odpowiednio 3:1 (AA) oraz 4.5:1 (AAA). Przestrzeganie standardu AAA chroni wzrok wszystkich użytkowników pracujących np. na zewnątrz w pełnym słońcu lub na przyciemnionym ekranie urządzenia.

#### 👁️ Ciemny motyw, astygmatyzm i zjawisko halacji (poświaty)

Podczas projektowania ciemnego motywu (Dark Mode) należy pamiętać, że skrajnie wysoki kontrast (np. czysta biel `#ffffff` na czarnym tle `#000000`) utrudnia czytanie osobom z astygmatyzmem. Powstaje wtedy tzw. **zjawisko halacji (poświaty)**. Efekt ten sprawia, że jasne litery emitują światło, które zmniejsza ostrość liter i pogarsza ich czytelność. Zjawisko to może dotyczyć również osób w starszym wieku.

-   **Rozwiązanie:** Zgodnie z dobrymi praktykami dostępności WCAG, zamiast czystej bieli na czerni, należy _**zmiękczyć kontrast**_. Używaj jasnoszarych lub złamanych odcieni bieli (np. `#ebebeb` lub `#bababa`) na ciemnoszarym tle (np. `#151515`). Zapewnia to wysoki, czytelny kontrast bez wywoływania poświaty i męczenia wzroku.

<data-gate>
<data-color-contrast></data-color-contrast>
</data-gate>

### 📏 Rozkład znaków i resetowanie stylów (CSS Resets)

Odstępy między znakami, wyrazami i liniami tekstu decydują o tym, jak szybko mózg przetwarza słowo pisane. Wytyczne **[WCAG 2.2 (Kryterium 1.4.12 - Text Spacing)](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)** określają minimalne wymagania dla poprawnego rozkładu przestrzennego tekstu. Według nich system musi umożliwiać użytkownikowi zmianę parametrów do następujących wartości:
- **Wysokość linii (`line-height`):** co najmniej **$1.5$** stopnia pisma,
- **Odstęp między literami (`letter-spacing`):** co najmniej **$0.12\text{em}$**,
- **Odstęp między wyrazami (`word-spacing`):** co najmniej **$0.16\text{em}$**.
W praktyce deweloperskiej narzucenie pełnych wartości WCAG jako sztywnego globalnego resetu (`*`) może rozbić interfejsy (np. przyciski czy menu). Stosuje się więc kompromisy deweloperskie. Poniższa tabela przedstawia trzy główne warianty globalnego resetu typograficznego:

<table>
<thead>
<tr>
<th>Reset minimalny (Standardowy)</th>
<th>Reset optymalny (Praktyczny złoty środek)</th>
<th>Reset skrajny (Zalecany przez WCAG)</th>
</tr>
</thead>
<tbody>
<tr>
<td>

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1.4;
  letter-spacing: .5px;
  word-spacing: 0;
}
```
*Zabezpiecza podstawowy układ stron, ale nie zapewnia pełnej dostępności typograficznej dla osób z trudnościami poznawczymi.*
</td>
<td>

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1.8;
  letter-spacing: .06rem;
  word-spacing: .13rem;
  -webkit-text-stroke: .4px rgba(0,0,0,.2);
}
```
*Moja preferencja 🥸, sprawdzona w projektach kombinacja. Równoważy czytelność z bezpieczeństwem układu stron.*
</td>
<td>

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  line-height: 1.8;
  letter-spacing: .12em;
  word-spacing: .16em;
}
```
*Wymusza odstępy odpowiadające minimalnym wartościom, które użytkownik może narzucić zgodnie z WCAG 2.2 (SC 1.4.12). Wymaga bardzo elastycznego projektowania layoutów flex/grid.*
</td>
</tr>
</tbody>
</table>

#### 💡 Dlaczego ten wariant to optymalny złoty środek?
1. **_`line-height: 1.8;`_**: zapewnia odpowiednią przestrzeń pionową między wierszami. Zapobiega to zlewaniu się sąsiednich linii tekstu, a jednocześnie nie rozprasza uwagi zbyt szerokimi przerwami. Możesz ją zmniejszyć, ale nie poniżej $1.6$, co pozwala zapobiec gubieniu wiersza podczas czytania.
2. **`letter-spacing: .06rem;`** (ok. $1\text{px}$): zapobiega optycznemu zlewaniu się liter (tzw. „crowding”). Zwiększa czytelność, nie powodując rozpadania się małych elementów interaktywnych, np. przycisków.
3. *`word-spacing: .13rem;`* (ok. $2\text{px}$): zwiększa odległości między słowami, co ułatwia i przyspiesza wyodrębnianie wyrazów przez mózg.
4. _**`-webkit-text-stroke: .4px rgba(0,0,0,.2);`**_: bardzo cienki obrys stosowany jako niestandardowa technika wyostrzania czcionki na ciemnym tle.
   - *Jak to działa:* Właściwość ta redukuje efekt rozmycia krawędzi (antyaliasingu) generowanego przez przeglądarkę. Działa jak subtelny „cień do wewnątrz” na literach. Dzięki temu czcionka staje się optycznie odrobinę cieńsza, co eliminuje poświatę i wyostrza krawędzie.
   - **Wskazówka:** Ponieważ obrys zmniejsza grubość linii, stosuj go ostrożnie. Najlepiej sprawdza się w elementach interfejsu (UI), nagłówkach czy czcionkach technicznych (np. w systemie KaTeX). W przypadku długich bloków tekstu może za bardzo odchudzić litery, co męczy wzrok.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; font-family: system-ui, sans-serif; font-size: 16px;">
    <!-- Lewy panel: Ciemny motyw (#101010) -->
    <div style="background-color: #ebebeb; color: #f00; padding: 20px; border-radius: 8px; border: 1px solid #334155; box-sizing: border-box;">
        <h5 style="margin-top: 0; color: #94a3b8; font-size: 13px; text-transform: uppercase; margin-bottom: 16px;">Ciemny motyw (Tło: #101010, Kolor: #f3f3f3)</h5>
        <!-- Bez obrysu -->
        <div style="margin-bottom: 16px; border-bottom: 1px dashed #222530; padding-bottom: 8px;">
            <span style="font-size: 11px; color: #64748b; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0px (Bez obrysu)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Wyszczuplenie 0.4px -->
        <div style="margin-bottom: 16px; border-bottom: 1px dashed #222530; padding-bottom: 8px;">
            <span style="font-size: 11px; color: #64748b; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0.4px #101010 (Optyczne wyszczuplenie)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px #101010; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px #101010; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Utrata znaków 1px -->
        <div style="margin-bottom: 16px;">
            <span style="font-size: 11px; color: #64748b; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 1px #101010 (Zbyt gruby - utrata znaków)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 1px #101010; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 1px #101010; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Twój wariant z przezroczystością, oddzielony linią akcentu -->
        <div style="padding-top: 8px;">
            <hr style="border: none; height: 1px; background-color: var(--accent-color); margin: 16px 0;">
            <span style="font-size: 11px; color: #64748b; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0.4px rgba(0,0,0,0.2) (Oryginalny reset)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px rgba(0,0,0,0.2); line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px rgba(0,0,0,0.2); line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
    </div>
    <!-- Prawy panel: Jasny motyw (#f3f3f3) -->
    <div style="background-color: #141414; color: #f00; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box;">
        <h5 style="margin-top: 0; color: #64748b; font-size: 13px; text-transform: uppercase; margin-bottom: 16px;">Jasny motyw (Tło: #f3f3f3, Kolor: #101010)</h5>
        <!-- Bez obrysu -->
        <div style="margin-bottom: 16px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px;">
            <span style="font-size: 11px; color: #94a3b8; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0px (Bez obrysu)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Pogrubienie 0.4px -->
        <div style="margin-bottom: 16px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px;">
            <span style="font-size: 11px; color: #94a3b8; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0.4px #101010 (Rozlewanie obrysu / pogrubienie)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px #101010; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px #101010; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Zlanie się glifów 1px -->
        <div style="margin-bottom: 16px;">
            <span style="font-size: 11px; color: #94a3b8; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 1px #101010 (Całkowite zlanie się glifów)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 1px #101010; line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 1px #101010; line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
        <!-- Twój wariant z przezroczystością, oddzielony linią akcentu -->
        <div style="padding-top: 8px;">
            <hr style="border: none; height: 1px; background-color: var(--accent-color); margin: 16px 0;">
            <span style="font-size: 11px; color: #94a3b8; display: block; font-family: monospace; margin-bottom: 4px;">-webkit-text-stroke: 0.4px rgba(0,0,0,0.2) (Oryginalny reset)</span>
            <div style="font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px rgba(0,0,0,0.2); line-height: 1.2;">1 2 3 4 5 6 7 8 9 0</div>
            <div style="font-family: system-ui, sans-serif; font-size: 18px; font-weight: 700; color: #f00; -webkit-text-stroke: 0.4px rgba(0,0,0,0.2); line-height: 1.2;">ą ę ó ł (Zażółć gęślą)</div>
        </div>
    </div>
</div>

### 🎨 Daltonizm i ślepota barw

Zaburzenia rozpoznawania barw uniemożliwiają poprawne rozróżnianie niektórych kolorów, najczęściej czerwonego i zielonego. Należą do nich protanopia (brak koloru czerwonego), deuteranopia (brak koloru zielonego) oraz achromatopsja (całkowite widzenie czarno-białe).

Podstawowa zasada dostępności cyfrowej mówi, że nie wolno przekazywać ważnych informacji wyłącznie za pomocą barwy. Jeśli pole formularza zawiera błąd, nie zaznaczaj go tylko czerwoną ramką. Dodaj ikonę ostrzeżenia oraz czytelny komunikat tekstowy. Gdy umieszczasz odsyłacz w bloku tekstu, nie wyróżniaj go tylko kolorem, lecz zastosuj również podkreślenie.

<iframe src="/public/resources/web-site-preview/color-blindness-simulation.html" width="600" height="620" style="border: 3px solid #ccc;width: 100%;" title="Symulator daltonizmu w interfejsach" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

## 🔗 Połącz Pary: Dostępność i ślepota barw
<data-connection-matcher title="Dopasuj zaburzenia widzenia barw i zasady projektowania do ich charakterystyki">
    <div class="cmw-item" data-left="Protanopia" data-right="Brak czopków reagujących na światło czerwone (mylenie czerwieni z zielenią)."></div>
    <div class="cmw-item" data-left="Deuteranopia" data-right="Brak czopków reagujących na światło zielone (najczęstsza postać daltonizmu)."></div>
    <div class="cmw-item" data-left="Achromatopsja" data-right="Całkowita ślepota barwna (widzenie świata wyłącznie w odcieniach szarości)."></div>
    <div class="cmw-item" data-left="Dostępność WCAG" data-right="Zakaz przekazywania kluczowych informacji wyłącznie za pomocą koloru (np. ramki błędu)."></div>
</data-connection-matcher>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Kaskada to sędzia CSS:** Rozstrzyga konflikty reguł na podstawie trzech kryteriów: pochodzenia stylu, specyficzności selektora oraz kolejności w kodzie.
- **Kolejność w kodzie rozstrzyga remisy:** Jeśli pochodzenie i specyficzność są identyczne, wygrywa reguła zadeklarowana niżej w arkuszu.
- **Kombinatory precyzują relacje:** Kombinator potomka (spacja, np. `A B`) stylizuje wszystkie zagnieżdżone elementy, kombinator dziecka (`>`) tylko bezpośrednich potomków, a kombinator sąsiedni (`+`) bezpośrednie sąsiedztwo w drzewie HTML.
- **Wagi specyficzności:** Styl wbudowany ($1000$) > ID ($100$) > Klasy, atrybuty i pseudo-klasy ($10$) > Elementy i pseudo-elementy ($1$).
- **Sterowanie dziedziczeniem:** Wartość `revert` cofa styl do domyślnego wyglądu przeglądarki, natomiast `unset` przywraca domyślną wartość ze specyfikacji CSS dla właściwości niedziedziczonych.
- **Dziedziczenie zapobiega powtarzaniu kodu:** Przekazuje właściwości typograficzne (jak czcionka czy kolor tekstu) w głąb struktury HTML. Właściwości pudełkowe (marginesy, obramowanie, tła) nie podlegają dziedziczeniu.
- **Zapobieganie halacji (poświaty):** W ciemnych motywach unikaj czystej bieli na czerni, aby nie męczyć wzroku osób z astygmatyzmem. Zmiękczaj kontrast, stosując np. `#ebebeb` na tle `#151515`.
- **Optyczne wyostrzanie tekstu:** Niestandardowa właściwość `-webkit-text-stroke` wyostrza czcionki w ciemnym motywie poprzez redukcję rozmycia krawędzi (antyaliasingu), jednak może zniekształcać drobne znaki diakrytyczne w długim tekście.
- **`!important` to ostateczność:** Zaburza naturalną kaskadę i prowadzi do wojen specyficzności. Unikaj go w codziennej pracy.
