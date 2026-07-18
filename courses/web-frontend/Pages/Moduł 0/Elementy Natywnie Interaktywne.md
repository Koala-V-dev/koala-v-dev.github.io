# Elementy Natywnie Interaktywne

Nie każda interakcja na stronie wymaga pisania kodu w JavaScript. HTML posiada własne, wbudowane elementy, które potrafią rozwijać treść, pokazywać stan operacji, obsługiwać okna modalne czy prezentować postępy. 

Używanie gotowych elementów HTML jest kluczowe dla dostępności Twojej strony. Natywne tagi mają już wbudowaną obsługę klawiatury, odpowiednią semantykę i podstawowe ułatwienia dla osób z niepełnosprawnościami. 

Najważniejsza zasada tej lekcji brzmi: **jeśli HTML ma gotowy element do danej interakcji, użyj go zamiast wymyślać własny mechanizm**.

---

## 📂 Rozwijana treść: <code>&lt;details&gt;</code> i <code>&lt;summary&gt;</code>

Tag `<details>` tworzy sekcję, którą użytkownik może samodzielnie rozwinąć i zwinąć. Wewnątrz niego umieszczasz tag `<summary>`, który pełni funkcję widocznego, klikalnego nagłówka.

```html
<details>
    <summary>Dlaczego warto używać semantycznego HTML?</summary>
    <p>Semantyczny HTML ułatwia indeksowanie strony przez roboty i poprawia dostępność.</p>
</details>
```

---

<b>Podgląd:</b>

<details class="non-styled">
    <summary>Dlaczego warto używać semantycznego HTML?</summary>
    <p>Semantyczny HTML ułatwia indeksowanie strony przez roboty i poprawia dostępność.</p>
</details>

---

Możesz sprawić, aby sekcja była domyślnie otwarta po załadowaniu strony. Służy do tego atrybut logiczny `open`:

```html
<details open>
    <summary>Widoczna informacja startowa</summary>
    <p>Ten fragment tekstu będzie rozwinięty od samego początku.</p>
</details>
```

_**♿ Dostępność (WCAG):**_
- **Wbudowane zachowanie:** Przeglądarka automatycznie nadaje elementowi `<summary>` rolę przycisku oraz zarządza stanem `aria-expanded` (prawda/fałsz).
- **Zasada nieingerencji:** Nigdy nie dodawaj ręcznie atrybutów `role="button"` ani `aria-expanded` do tych znaczników. Możesz w ten sposób zaburzyć działanie czytników ekranu.
- **Obsługa klawiatury:** Użytkownik może otworzyć i zamknąć sekcję za pomocą klawisza <kbd>Enter</kbd> lub <kbd>Spacja</kbd> po przejściu na nią tabulatorem.

---

## 📊 Stan liczbowy: <code>&lt;progress&gt;</code> i <code>&lt;meter&gt;</code>

Znacznik `<progress>` oznacza postęp w realizacji konkretnego zadania, które zmierza do określonego końca (np. pobieranie pliku).

```html
<label for="upload">Postęp wysyłania pliku: </label>
<progress id="upload" value="70" max="100">70%</progress>
```

---

<b>Podgląd:</b>

<label for="upload">Postęp wysyłania pliku: </label><progress id="upload" value="70" max="100">70%</progress>

---

Znacznik `<meter>` reprezentuje wartość liczbową w znanym, stałym zakresie. Używasz go do pomiarów fizycznych lub statystycznych, które nie oznaczają postępu procesu (np. zajętość dysku, poziom baterii).

```html
<label for="disk">Zajętość dysku: </label>
<meter id="disk" min="0" max="100" low="70" high="90" optimum="50" value="82">82%</meter>
```

--- 

<b>Podgląd:</b>

<label for="disk">Zajętość dysku: </label> <meter id="disk" min="0" max="100" low="70" high="90" optimum="50" value="82">82%</meter>

---

_**♿ Dostępność (WCAG):**_
- **Etykietowanie:** Zarówno `<progress>`, jak i `<meter>` muszą być jednoznacznie powiązane z opisem. Zawsze używaj elementu `<label>` powiązanego za pomocą atrybutu `for` z identyfikatorem `id` danej kontrolki.
- **Tekst alternatywny (Fallback):** Tekst wpisany wewnątrz znaczników (np. `70%`) nie wyświetla się w nowoczesnych przeglądarkach – zastępują go one gotowym elementem graficznym. Służy on jako zabezpieczenie (tzw. *fallback*) dla bardzo starych przeglądarek, które nie znają tych tagów i w przeciwnym razie nic by nie pokazały (wtedy wyświetlą sam tekst). Nowoczesne czytniki ekranu ignorują ten tekst wewnętrzny i odczytują stan bezpośrednio z atrybutów `value`, `min` oraz `max`.

---

## 🧷 Kontrolka akcji: <code>&lt;button&gt;</code> kontra link

Elementy `<a>` (*HTMLAnchorElement*) oraz `<button>` (*HTMLButtonElement*) mają w specyfikacji HTML Standard (WHATWG) oraz wytycznych W3C WAI-ARIA zdefiniowane wykluczające się role semantyczne. Zastępowanie jednego drugim jest krytycznym błędem dostępności.

- **Link (<code>&lt;a&gt;</code>):** Reprezentuje hiperłącze do zasobu URI.
  - **Zarządzanie adresem URL:** Manipuluje historią sesji przeglądarki (`window.history`). Wpływa na pasek adresu URL.
  - **Kierunek działania:** Przenosi użytkownika pod nowy adres (zewnętrzny lub wewnętrzną podstronę), przewija widok do kotwicy (identyfikatora elementu na tej samej stronie, np. `#sekcja`) lub służy do pobierania zasobów (z atrybutem `download` przeglądarka pobiera plik, zamiast go otwierać):
    ```html
    <a href="faktura.pdf" download="faktura-lipiec.pdf">Pobierz fakturę</a>
    ```
  - **Obsługa klawiatury:** Należy go aktywować wyłącznie klawiszem <kbd>Enter</kbd>. Przycisk <kbd>Spacja</kbd> na linku nie aktywuje go, lecz przewija stronę w dół (co jest domyślnym zachowaniem przeglądarki dla przewijania dokumentu).
- **Przycisk (<code>&lt;button&gt;</code>):** Reprezentuje kontrolkę akcji w bieżącym dokumencie.
  - **Brak wpływu na URL:** Nie modyfikuje adresu w pasku przeglądarki ani historii sesji (chyba że przesyła formularz).
  - **Kierunek działania:** Wyzwala zachowanie po stronie klienta (JavaScript) lub serwera (wysłanie formularza). Służy do modyfikacji stanu aplikacji lub struktury DOM (np. otwieranie modali, zatwierdzanie danych, usuwanie obiektów, przełączanie motywów).
  - **Obsługa klawiatury:** Natively obsługuje aktywację za pomocą klawisza <kbd>Enter</kbd> oraz <kbd>Spacja</kbd>.

```html
<!-- PRAWIDŁOWO: Link nawiguje do podstrony -->
<a href="raport.html">Otwórz raport roczny</a>

<!-- PRAWIDŁOWO: Przycisk wywołuje akcję lokalną -->
<button type="button" id="trigger-calc">Oblicz wynik</button>
```

### 🧭 Element <code>&lt;button&gt;</code> wewnątrz <code>&lt;nav&gt;</code> – jaka jest zasada?
Zgodnie ze specyfikacją HTML, element `<nav>` grupuje linki służące do przemieszczania się po strukturze serwisu.
- **_Błąd:_** Umieszczanie przycisków `<button>` wykonujących nawigację poprzez skrypty JS:
  ```html
  <button onclick="location.href='/kontakt'">Kontakt</button>
  ```
  Taki element traci natywne funkcje przeglądarki, np. menu kontekstowe pod prawym przyciskiem myszy (<kbd class="win-menu-btn">Otwórz odnośnik w nowej karcie</kbd>).
- **Prawidłowe użycie:** Przycisk `<button>` jest dozwolony w `<nav>` wyłącznie jako element pomocniczy zarządzający samą nawigacją (np. przycisk rozwijający/zwijający menu typu hamburger <span style="border:1px solid;padding: 2px 5px;border-radius: 4px;cursor: pointer;">☰</span>, lub przycisk przełączający widoczność podmenu).

_**♿ Dostępność (WCAG):**_
- **Semantyczna rola:** Użycie linku `<a>` ostylowanego tak, by udawał przycisk, nie zmienia jego zapowiedzi w czytniku ekranu. Użytkownik usłyszy słowo „link” i będzie oczekiwać nawigacji (przejścia na inną stronę), a nie wykonania lokalnej akcji.
  - **Grzech <code>href="#"</code> lub <code>javascript:void(0)</code>:** Stosowanie linku z pustym hashem jako przycisku JS powoduje niechciane przewinięcie okna na górę (domyślne zachowanie przeglądarki dla pustej kotwicy) i psuje działanie czytników ekranu, które traktują taki link jako niedziałający odnośnik.
- **Nienatywne przyciski (np. `<div>`, `<span>`):** Nie posiadają domyślnie żadnych funkcji dostępnościowych. Są pomijane przy przechodzeniu tabulatorem i nie reagują na klawiaturę. Ich dostosowanie do standardów WCAG 2.1 wymaga ręcznego dodania `role="button"`, `tabindex="0"` oraz oprogramowania nasłuchu zdarzeń klawiatury dla klawiszy <kbd>Enter</kbd> i <kbd>Spacja</kbd>.

> [!IMPORTANT]
> ### Semantyczna rola oraz typy przycisku
> 
> - **Atrybut `role="button"`** – to proteza dla elementów nienatywnych (np. `<div>`, `<span>`). Dodawanie go do tagu `<button>` jest błędem (redundancja).
> - **Atrybut `type="button"`** – zmienia domyślne zachowanie elementu `<button>`, którym w specyfikacji HTML jest wysyłanie formularza (`type="submit"`).
>   - **Wewnątrz `<form>`:** Jest **obowiązkowy** dla wszystkich przycisków, które mają uruchomić skrypt JavaScript, a nie przesyłać dane na serwer.
>   - **Poza `<form>`:** Jest **redundantny**. Dopisuje się go wtedy głównie w ramach programowania defensywnego, aby przycisk nie zaczął wysyłać formularza po ewentualnej zmianie struktury strony. (Dany re-używalny komponent stanie się potomnym dzieckiem formularza.)

---

## 💬 Dialog: <code>&lt;dialog&gt;</code>

Tag `<dialog>` reprezentuje okno dialogowe lub okno modalne. Ponieważ jest to natywny element HTML, przeglądarka automatycznie zarządza jego zachowaniem przestrzennym, obsługą fokusu klawiatury oraz blokowaniem tła.

```html
<dialog open>
    <h2>Komunikat systemowy</h2>
    <p>To jest natywne okno dialogowe HTML.</p>
    <form method="dialog">
        <button>Zamknij</button>
    </form>
</dialog>
```

Atrybut logiczny `open` pozwala wyświetlić okno bezpośrednio po załadowaniu strony. W rzeczywistych projektach dialogi otwiera się jednak dynamicznie. Służą do tego dwie natywne metody JavaScript:
- `show()`: Otwiera okno w trybie niemodalnym. Możesz wtedy wchodzić w interakcję z elementami znajdującymi się pod oknem.
- `showModal()`: Otwiera okno w trybie modalnym. Przeglądarka tworzy ciemne tło (tzw. backdrop) i blokuje możliwość klikania czegokolwiek poza oknem.

```html
<button type="button" id="open-profile-dialog">Edytuj profil</button>

<dialog id="profile-dialog" aria-labelledby="profile-title" aria-describedby="profile-desc">
    <h2 id="profile-title">Edytuj profil</h2>
    <p id="profile-desc">Zmień swoje dane użytkownika i zapisz formularz.</p>
    
    <form method="dialog">
        <button value="cancel">Anuluj</button>
        <button value="save">Zapisz</button>
    </form>
</dialog>

<script>
const dialog = document.querySelector("#profile-dialog");
const openButton = document.querySelector("#open-profile-dialog");

openButton.addEventListener("click", () => {
    dialog.showModal();
});
</script>
```

_**♿ Dostępność (WCAG):**_
- **Rola semantyczna:** Element `<dialog>` ma domyślnie przypisaną rolę okna dialogowego. Określa to specyfikacja HTML, dlatego nie musisz dopisywać do niego atrybutu `role="dialog"`.
- **Etykietowanie:** Użyj atrybutu `aria-labelledby` w tagu `<dialog>` i skieruj go na identyfikator nagłówka wewnątrz okna (np. `id="profile-title"`). Jeśli okno zawiera dodatkowy opis, użyj `aria-describedby` skierowanego na opis (np. `id="profile-desc"`).
- **Pułapka fokusu (Focus Trap):** Kiedy otwierasz modal przez `showModal()`, przeglądarka automatycznie blokuje fokus klawiatury wewnątrz tego okna. Użytkownik klikający klawisz <kbd>Tab</kbd> nie wyjdzie poza formularz modala. Po zamknięciu okna, fokus automatycznie wraca na przycisk, który je wywołał.
- **Klawisz Escape:** Przeglądarka zapewnia, że kliknięcie klawisza <kbd>Esc</kbd> automatycznie zamyka okno modalne.
- **Unikaj własnych rozwiązań na divach:** Budowanie modali ze zwykłych tagów `<div>` wymaga ręcznego programowania pułapki fokusu, blokowania klawiatury i przywracania stanu aktywnego. Poco dodawać sobie roboty? 😉

---

## 🧭 Podpowiedzi i wyskakujące warstwy: <code>popover</code>

Atrybut `popover` to nowoczesny mechanizm HTML służący do tworzenia wyskakujących warstw, takich jak menu podręczne, podpowiedzi (tooltips) czy rozwijane listy opcji. 

_**Ważne rozróżnienie:**_ W przeciwieństwie do `<dialog>`, który jest dedykowanym elementem, <strong>`popover` to **atrybut globalny**</strong>. Możesz przypisać go do dowolnego znacznika (np. `<div>`, `<nav>` czy `<p>`).

```html
<!-- Przycisk kontrolujący podpowiedź -->
<button popovertarget="help-tip">Pokaż pomoc</button>

<!-- Element pełniący funkcję popoveru -->
<div id="help-tip" popover>
    <p>To jest natywna podpowiedź wyświetlona jako popover.</p>
</div>
```

### 🔀 Dialog a Popover – kiedy stosować i jak je łączyć?

Te dwa mechanizmy różnią się przeznaczeniem i zachowaniem:
- **Popover (Warstwa lekka):** Służy do tymczasowych, nieblokujących elementów interfejsu (np. menu kontekstowe, podpowiedzi). Ma wbudowane zachowanie **light dismiss** – zamyka się automatycznie po kliknięciu poza obszar popoveru lub wciśnięciu klawisza <kbd>Esc</kbd>. Domyślnie jest nie-modalny i pozwala na interakcję z resztą strony.
- **Dialog modalny (Blokada pełna):** Stosujesz go przy krytycznych akcjach wymagających skupienia uwagi (np. potwierdzenie płatności, formularz edycji). Uruchamiany metodą `showModal()`, tworzy ciemne tło (*backdrop*), blokuje interakcję z resztą dokumentu i więzi fokus klawiatury w swoim obrębie.

#### 🤝 Hybryda: <code>&lt;dialog popover&gt;</code> (Łączenie obu mechanizmów)
Przypisanie atrybutu `popover` do elementu `<dialog>` jest w pełni zgodne ze specyfikacją HTML i pozwala połączyć zalety obu rozwiązań:

```html
<button popovertarget="info-dialog">Pokaż szczegóły</button>

<dialog id="info-dialog" popover>
    <p>To jest semantyczny dialog sterowany deklaratywnie.</p>
</dialog>
```

**Zalety tego połączenia:**
- **Zachowanie semantyki:** Czytniki ekranu rozpoznają element jako okno dialogowe (`role="dialog"`).
- **Deklaratywne sterowanie:** Przycisk z `popovertarget` automatycznie otwiera i zamyka dialog bez użycia JavaScriptu.
- **Wbudowane zamykanie:** Dialog dziedziczy po popoverze mechanizm *light dismiss* (automatyczne zamykanie przy kliknięciu poza okno).
- **Top Layer:** Element trafia do najwyższej warstwy renderowania przeglądarki, co zapobiega ucinaniu go przez `overflow: hidden` rodziców.

_**♿ Dostępność (WCAG):**_
- **Automatyczne powiązanie:** Użycie atrybutu `popovertarget` na przycisku automatycznie informuje technologie asystujące, że przycisk steruje wyskakującą warstwą. Przeglądarka dba o to, by czytniki prawidłowo ogłaszały ten stan.
- **Fokus klawiatury:** Popover nie tworzy pułapki fokusu. Użytkownik może swobodnie przejść tabulatorem do innych elementów na stronie, co jest prawidłowym zachowaniem dla podpowiedzi lub bocznych menu pomocniczych.

---

<data-gate>
  <data-connection-matcher title="Połącz natywny element HTML z jego zastosowaniem:">
    <div class="cmw-item" data-left="`&amp;lt;details&amp;gt;`" data-right="Rozwijana i zwijana treść"></div>
    <div class="cmw-item" data-left="`&amp;lt;progress&amp;gt;`" data-right="Postęp wykonywania zadania"></div>
    <div class="cmw-item" data-left="`&amp;lt;meter&amp;gt;`" data-right="Pomiar wartości w znanym zakresie"></div>
    <div class="cmw-item" data-left="`&amp;lt;dialog&amp;gt;`" data-right="Semantyczne okno dialogowe"></div>
  </data-connection-matcher>
</data-gate>

---

<data-gate>
  <data-quiz>
    <question>Kiedy powinieneś użyć elementu <code>&lt;button&gt;</code> zamiast <code>&lt;a&gt;</code>?</question>
    <options>
      <item>Gdy tekst ma wyglądać bardziej technicznie.</item>
      <item>Gdy użytkownik ma przejść do innego dokumentu HTML.</item>
      <item correct>Gdy element uruchamia akcję w bieżącym interfejsie, a nie prowadzi pod nowy adres.</item>
      <item>Gdy chcesz ukryć adres URL przed użytkownikiem.</item>
    </options>
    <div data-hint="error">Zastanów się, czy element prowadzi do zasobu, czy wykonuje akcję.</div>
    <div data-hint="success">Dobrze. Link służy do nawigacji, przycisk do wywoływania akcji.</div>
  </data-quiz>
</data-gate>

---


### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Semantyka to fundament interakcji:** Elementy takie jak `<details>`, `<summary>`, `<progress>`, `<meter>`, `<dialog>` i `<button>` posiadają własną, natywną funkcjonalność i dostępność.
- **Link i przycisk to różne światy:** `<a>` służy wyłącznie do nawigacji, a `<button>` do wykonywania akcji w aplikacji. Nigdy nie używaj ich zamiennie ani nie stosuj linków z pustym `href="#"`.
- **Natywny dialog chroni przed błędami:** Używanie metody `showModal()` automatycznie blokuje fokus klawiatury w oknie i obsługuje klawisz <kbd>Esc</kbd>, co zapobiega powstawaniu krytycznych błędów WCAG.
- **Popover to atrybut, nie tag:** Popover jest globalnym atrybutem służącym do tworzenia lekkich warstw z automatycznym zamykaniem po kliknięciu poza nimi (light dismiss). Nie blokuje on dostępu do strony tak jak modalny `<dialog>`.
- **Właściwe etykietowanie:** Wszystkie elementy stanu (`<progress>`, `<meter>`, `<dialog>`, `<output>`) wymagają precyzyjnego opisania i powiązania z etykietami za pomocą atrybutów `for`, `id` lub `aria-labelledby`, aby były widoczne dla czytników ekranu.
