# Zdarzenia i addEventListener na żywym DOM

W dwóch poprzednich lekcjach potrafiłeś już namierzyć węzły przez `document.querySelector`, zmienić ich treść i klasy oraz zamknąć operacje w funkcjach strzałkowych. Każdy z tych skryptów miał jednak jedną zasadniczą granicę: wykonywał się wyłącznie raz, w momencie otwarcia strony.

Gdy użytkownik klika przycisk „Lubię to”, wpisuje wiadomość w formularzu albo wysyła komentarz, przeglądarka musi zareagować dopiero w chwili tej akcji. Nie może też zatrzymać całego programu i „czekać w miejscu”, ponieważ strona przestałaby się przewijać i całkowicie by zamarzła.

Do rozwiązania tego problemu służy model zdarzeń i metoda `addEventListener`.

---

## 📡 Architektura sterowana zdarzeniami

Przeglądarka działa w _**architekturze sterowanej zdarzeniami**_. Zamiast blokować główny wątek oczekiwaniem na ruch użytkownika, Twój skrypt uruchamia się przy starcie strony, rejestruje nasłuchy na wybranych węzłach DOM i natychmiast kończy pracę.

Od tej chwili przeglądarka przechodzi w stan czuwania. Za każdym razem, gdy użytkownik kliknie element, naciśnie klawisz lub prześle formularz, silnik przeglądarki tworzy zdarzenie i wywołuje zarejestrowaną przez Ciebie **funkcję zwrotną** (callback).

Podstawowy zapis rejestracji nasłuchu wygląda tak:

```javascript
const przycisk = document.querySelector("#btn-start");
const statusEl = document.querySelector("#status");

przycisk.addEventListener("click", () => {
  statusEl.textContent = "Uruchomiono!";
});
```

Rozłóżmy to wywołanie na trzy elementy:
1. `przycisk`: węzeł DOM, na którym nasłuchujemy.
2. `"click"`: nazwa zdarzenia zapisana jako tekst.
3. `() => { ... }`: anonimowa funkcja strzałkowa przekazana jako drugi argument, która uruchomi się dopiero po kliknięciu.

Zauważ, jak naturalnie łączą się tu umiejętności z poprzednich lekcji: `document.querySelector` dostarcza cel, a funkcja strzałkowa dostarcza przepis do wykonania w przyszłości.

---

## ⚡ Najważniejsze zdarzenia w pracy z interfejsem

Nie każde działanie użytkownika to kliknięcie myszą. Dobór właściwego typu zdarzenia decyduje o tym, czy interfejs działa płynnie i reaguje we właściwym momencie.

| Nazwa zdarzenia | Kiedy się uruchamia | Typowy element docelowy |
| :--- | :--- | :--- |
| `"click"` | Po pełnym kliknięciu elementu myszą lub aktywacji klawiaturą | `<button>`, `<a>`, element karty |
| `"input"` | Natychmiast po każdej pojedynczej zmianie znaku lub przesunięciu suwaka | `<input>`, `<textarea>` |
| `"change"` | Po zatwierdzeniu zmiany (np. wybór nowej opcji z listy lub zaznaczenie checkboxa) | `<select>`, `<input type="checkbox">` |
| `"submit"` | W chwili wysłania formularza przyciskiem lub klawiszem <kbd>Enter</kbd> | `<form>` (nie sam `<button>`!) |

Zwróć szczególną uwagę na różnicę między `"input"` a `"change"` w polach tekstowych. Zdarzenie `"input"` odpala się przy każdym naciśnięciu klawisza, dlatego idealnie nadaje się do podglądu na żywo i licznika znaków. Zdarzenie `"change"` w polu tekstowym odpala się dopiero po opuszczeniu pola (utracie fokusu).

---

## 🚫 Błąd przedwczesnego wywołania: nawiasy w addEventListener

Wiesz już z poprzedniej lekcji, że zapis `zwieksz` oznacza referencję do funkcji, a zapis `zwieksz()` natychmiast ją uruchamia. W `addEventListener` pomylenie tych dwóch zapisów jest najczęstszym źródłem „martwych przycisków”.

### 🔮 Przewidywanie: co zrobi przycisk z nawiasami w argumencie

Przeanalizuj poniższy kod:

```javascript
let licznik = 0;
const btn = document.querySelector("#btn-plus");
const wynikEl = document.querySelector("#wynik");

const zwieksz = () => {
  licznik = licznik + 1;
  wynikEl.textContent = licznik;
};

btn.addEventListener("click", zwieksz());
```

> [!IMPORTANT]
> Zanim przeczytasz wyjaśnienie poniżej, odpowiedz na dwa pytania:
> 1. Jaką wartość pokaże `#wynik` tuż po załadowaniu strony, zanim ktokolwiek kliknie przycisk?
> 2. Co się stanie na ekranie, gdy użytkownik kliknie przycisk `#btn-plus` trzy razy z rzędu?

### 🔎 Obserwacja i wyjaśnienie

Tuż po załadowaniu strony `#wynik` pokaże `1`, mimo że nikt nie kliknął przycisku. Następnie możesz kliknąć przycisk sto razy, a wartość pozostanie zamrożona na `1`.

Dlaczego tak się dzieje? W linii `btn.addEventListener("click", zwieksz())` silnik JavaScript najpierw oblicza argumenty wywołania. Widzi `zwieksz()` z nawiasami, więc **_natychmiast uruchamia funkcję_**. Zmienna `licznik` rośnie z `0` do `1`, a ponieważ `zwieksz` nie ma instrukcji `return`, w miejsce drugiego argumentu trafia **_undefined_**.

Metoda `addEventListener` dostaje więc `undefined` zamiast funkcji zwrotnej i nie ma czego wywołać przy kolejnych kliknięciach.

Poprawny zapis przekazuje samą referencję bez nawiasów albo opakowuje wywołanie w funkcję strzałkową:

```javascript
// Poprawnie: przekazujemy sam przepis bez nawiasów
btn.addEventListener("click", zwieksz);

// Również poprawnie: funkcja strzałkowa czeka na kliknięcie i dopiero wtedy wywołuje zwieksz()
btn.addEventListener("click", () => {
  zwieksz();
});
```

---

## 🧭 Obiekt event: preventDefault i target

Gdy przeglądarka wywołuje Twoją funkcję zwrotną, może przekazać do niej specjalny obiekt z pełnym opisem zdarzenia. Zwyczajowo nazywamy ten parametr *event* (lub skrótowo `e`).

```javascript
formularz.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Wysłano formularz bez przeładowania strony.");
});
```

Dwie właściwości obiektu **event** wykorzystasz niemal w każdym projekcie:

1. **event.preventDefault()**: zatrzymuje domyślną akcję przeglądarki. Formularz `<form>` domyślnie próbuje wysłać dane na serwer i **_przeładować całą stronę_**, co natychmiast kasuje stan Twoich zmiennych w JavaScript. Wywołanie `event.preventDefault()` na początku listenera `"submit"` blokuje to przeładowanie.
2. **event.target**: wskazuje konkretny węzeł DOM, który wywołał zdarzenie. W zdarzeniu `"input"` na polu tekstowym `event.target.value` daje Ci aktualny tekst wpisany przez użytkownika bez konieczności ponownego szukania pola w drzewie.

```javascript
poleTekstu.addEventListener("input", (event) => {
  podgladEl.textContent = event.target.value;
});
```

> [!TIP]
> Zapamiętaj różnicę: pola formularza (`<input>`, `<textarea>`, `<select>`) przechowują wpisaną treść we właściwości **value**, a zwykłe znaczniki tekstowe (`<p>`, `<span>`, `<h2>`) korzystają z właściwości **textContent**.

<data-gate>
<data-connection-matcher title="Połącz zdarzenie lub metodę z jej rolą w aplikacji">
  <item left="Zdarzenie `input`" right="Uruchamia się przy każdej wpisanej lub usuniętej literze w polu"></item>
  <item left="Zdarzenie `submit`" right="Rejestruje się na znaczniku form, aby obsłużyć wysłanie formularza"></item>
  <item left="`event.preventDefault()`" right="Blokuje domyślne przeładowanie strony przy wysłaniu formularza"></item>
  <item left="`event.target.value`" right="Zwraca bieżący tekst z pola wejściowego, które wywołało zdarzenie"></item>
  <item left="`btn.addEventListener('click', fn())`" right="Błąd: uruchamia fn natychmiast przy starcie i przekazuje undefined"></item>
</data-connection-matcher>
</data-gate>

---

## 🧠 Stan aplikacji: zmienna poza listenerem kontra zmienna w środku

Częstym problemem przy budowaniu liczników, koszyków czy przełączników jest umieszczenie zmiennej stanu w złym miejscu. Spójrz na te dwa warianty:

```javascript
// Wariant błędny: zmienna resetuje się przy każdym kliknięciu!
btn.addEventListener("click", () => {
  let klikniecia = 0;
  klikniecia = klikniecia + 1;
  licznikEl.textContent = klikniecia;
});
```

W wariancie błędnym funkcja strzałkowa za każdym kliknięciem tworzy nową zmienną `klikniecia` o wartości `0`, dodaje `1` i wypisuje `1`. Po zakończeniu funkcji zmienna lokalna znika z pamięci. Wynik nigdy nie przekroczy `1`.

Aby program pamiętał historię między kolejnymi kliknięciami, **zmienna stanu** musi być zadeklarowana przez `let` **poza funkcją listenera**:

```javascript
// Wariant poprawny: stan żyje poza listenerem i zachowuje wartość
let klikniecia = 0;

btn.addEventListener("click", () => {
  klikniecia = klikniecia + 1;
  licznikEl.textContent = klikniecia;
});
```

Reguła jest prosta: wszystko, co ma przetrwać między kolejnymi zdarzeniami użytkownika, deklaruj poza `addEventListener`. Wewnątrz listenera trzymaj tylko zmienne pomocnicze potrzebne do jednego, bieżącego uruchomienia.

---

## 🛠️ Warsztat prowadzony: Licznik polubień z resetem

Zbuduj działający licznik polubień z dwoma przyciskami: `#btn-like` zwiększa wynik o `1`, a `#btn-reset` zeruje stan z powrotem do `0`. Po kliknięciu w podglądzie możesz od razu przetestować oba przyciski na żywo.

Wymagania:
- Zadeklaruj zmienną stanu `let polubienia = 0;` poza funkcjami `addEventListener`.
- Podłącz listener `"click"` do `#btn-like`, który zwiększa `polubienia` o `1` i aktualizuje `#licznik-wartosc` przez `textContent`.
- Podłącz listener `"click"` do `#btn-reset`, który ustawia `polubienia = 0` i aktualizuje `#licznik-wartosc` przez `textContent`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Licznik polubień z resetem">
    <template data-type="html">
<style>
  .karta-like { padding: 16px; border-radius: 10px; border: 2px solid #cbd5e1; font-family: sans-serif; max-width: 320px; background: #f8fafc; }
  .licznik { font-size: 2rem; font-weight: 700; color: #0f172a; margin: 8px 0 12px; }
  .akcje { display: flex; gap: 8px; }
  button { padding: 8px 14px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
  #btn-like { background: #2563eb; color: #fff; }
  #btn-reset { background: #e2e8f0; color: #334155; }
</style>
<section class="karta-like">
  <h3>Post techniczny</h3>
  <p class="licznik">Polubienia: <span id="licznik-wartosc">0</span></p>
  <div class="akcje">
    <button id="btn-like" type="button">Lubię to +1</button>
    <button id="btn-reset" type="button">Resetuj</button>
  </div>
</section>
    </template>
    <template data-type="code">
const btnLike = document.querySelector("#btn-like");
const btnReset = document.querySelector("#btn-reset");
const licznikEl = document.querySelector("#licznik-wartosc");

let polubienia = 0;

// TODO 1: Podłącz zdarzenie "click" do btnLike (zwiększ polubienia i zaktualizuj licznikEl.textContent)

// TODO 2: Podłącz zdarzenie "click" do btnReset (wyzeruj polubienia i zaktualizuj licznikEl.textContent)
    </template>
    <template data-type="requirements">
      [
        {
          "id": "state-outside",
          "text": "Zmienna stanu let polubienia = 0 zadeklarowana poza listenerem",
          "type": "regex",
          "pattern": "let\\s+polubienia\\s*=\\s*0"
        },
        {
          "id": "listener-like",
          "text": "Zarejestrowany listener click na btnLike z funkcją strzałkową",
          "type": "regex",
          "pattern": "btnLike\\.addEventListener\\s*\\(\\s*[\"']click[\"']\\s*,\\s*\\([^)]*\\)\\s*=>"
        },
        {
          "id": "listener-reset",
          "text": "Zarejestrowany listener click na btnReset z funkcją strzałkową",
          "type": "regex",
          "pattern": "btnReset\\.addEventListener\\s*\\(\\s*[\"']click[\"']\\s*,\\s*\\([^)]*\\)\\s*=>"
        },
        {
          "id": "increment-state",
          "text": "Zwiększanie zmiennej polubienia wewnątrz obsługi kliknięcia",
          "type": "regex",
          "pattern": "polubienia\\s*(\\+\\+|\\+=\\s*1|=\\s*polubienia\\s*\\+\\s*1)"
        },
        {
          "id": "reset-state",
          "text": "Wyzerowanie zmiennej polubienia = 0 w obsłudze przycisku resetu",
          "type": "regex",
          "pattern": "btnReset\\.addEventListener[\\s\\S]*polubienia\\s*=\\s*0"
        },
        {
          "id": "update-textcontent",
          "text": "Aktualizacja wyświetlanej wartości przez licznikEl.textContent",
          "type": "regex",
          "pattern": "licznikEl\\.textContent\\s*=\\s*polubienia"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🚀 Samodzielne zadanie: Podgląd wiadomości na żywo i obsługa formularza

Teraz połączysz zdarzenia `"input"` i `"submit"` oraz `event.preventDefault()` w jednym formularzu.

W szablonie HTML masz:
- formularz `#form-wiadomosc`,
- pole tekstowe `#pole-wiadomosc`,
- akapit podglądu na żywo `#podglad-tekstu`,
- akapit statusu wysłania `#status-wyslania`.

Twoje wymagania:
1. Pobierz wszystkie cztery elementy przez `document.querySelector` i zapisz je w zmiennych `const`.
2. Na polu `#pole-wiadomosc` zarejestruj zdarzenie `"input"` z parametrem `event`. Przy każdej zmianie ustaw `textContent` elementu `#podglad-tekstu` na `event.target.value`.
3. Na formularzu `#form-wiadomosc` zarejestruj zdarzenie `"submit"` z parametrem `event`.
4. Jako pierwszą instrukcję w obsłudze `"submit"` wywołaj `event.preventDefault()`, aby zablokować przeładowanie strony.
5. Następnie ustaw `textContent` elementu `#status-wyslania` na `"Wiadomość wysłana!"`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Podgląd wiadomości i formularz">
    <template data-type="html">
<style>
  .box { padding: 16px; border-radius: 10px; border: 2px solid #cbd5e1; font-family: sans-serif; max-width: 380px; background: #ffffff; }
  .box input { width: 100%; box-sizing: border-box; padding: 8px 10px; border: 1px solid #94a3b8; border-radius: 6px; margin-bottom: 10px; }
  .box button { padding: 8px 14px; border-radius: 6px; border: none; background: #16a34a; color: #fff; cursor: pointer; font-weight: 600; }
  .podglad { margin-top: 12px; padding: 10px; background: #f1f5f9; border-radius: 6px; min-height: 20px; }
  .status { margin-top: 8px; font-weight: 600; color: #15803d; }
</style>
<section class="box">
  <form id="form-wiadomosc">
    <label for="pole-wiadomosc">Treść komunikatu:</label>
    <input id="pole-wiadomosc" type="text" placeholder="Wpisz wiadomość..." />
    <button type="submit">Wyślij</button>
  </form>
  <p class="podglad">Podgląd: <span id="podglad-tekstu"></span></p>
  <p id="status-wyslania" class="status"></p>
</section>
    </template>
    <template data-type="code">
// Napisz obsługę podglądu na żywo ("input") oraz wysyłania formularza ("submit"):

    </template>
    <template data-type="requirements">
      [
        {
          "id": "select-form",
          "text": "Pobranie #form-wiadomosc przez document.querySelector",
          "type": "regex",
          "pattern": "document\\.querySelector\\s*\\(\\s*[\"']#form-wiadomosc[\"']\\s*\\)"
        },
        {
          "id": "select-input",
          "text": "Pobranie #pole-wiadomosc przez document.querySelector",
          "type": "regex",
          "pattern": "document\\.querySelector\\s*\\(\\s*[\"']#pole-wiadomosc[\"']\\s*\\)"
        },
        {
          "id": "listen-input",
          "text": "Rejestracja zdarzenia input z funkcją strzałkową odbierającą event",
          "type": "regex",
          "pattern": "\\.addEventListener\\s*\\(\\s*[\"']input[\"']\\s*,\\s*\\(?\\s*(event|e)\\s*\\)?\\s*=>"
        },
        {
          "id": "live-preview",
          "text": "Aktualizacja podglądu przez textContent z wykorzystaniem target.value",
          "type": "regex",
          "pattern": "\\.textContent\\s*=\\s*(event|e)\\.target\\.value"
        },
        {
          "id": "listen-submit",
          "text": "Rejestracja zdarzenia submit na formularzu",
          "type": "regex",
          "pattern": "\\.addEventListener\\s*\\(\\s*[\"']submit[\"']\\s*,\\s*\\(?\\s*(event|e)\\s*\\)?\\s*=>"
        },
        {
          "id": "prevent-default",
          "text": "Zablokowanie przeładowania strony przez preventDefault()",
          "type": "regex",
          "pattern": "(event|e)\\.preventDefault\\s*\\(\\s*\\)"
        },
        {
          "id": "status-sent",
          "text": "Ustawienie komunikatu \"Wiadomość wysłana!\" przez textContent",
          "type": "regex",
          "pattern": "\\.textContent\\s*=\\s*[\"']Wiadomość wysłana![\"']"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
  <summary>Głębsze spojrzenie: pętla zdarzeń (Event Loop), bąbelkowanie i różnica między target a currentTarget</summary>

  <h4>Dlaczego strona nie zamarza: pętla zdarzeń</h4>
  <p>JavaScript w przeglądarce działa jednowątkowo, ale samo nasłuchiwanie kliknięć i klawiatury obsługują wielowątkowe mechanizmy przeglądarki (Web APIs). Gdy użytkownik kliknie przycisk, przeglądarka wrzuca zdarzenie do kolejki zadań. Pętla zdarzeń (Event Loop) sprawdza, czy główny stos wywołań jest pusty, i dopiero wtedy pobiera kolejną funkcję zwrotną do wykonania.</p>

  <h4>Bąbelkowanie zdarzeń w drzewie DOM</h4>
  <p>Większość zdarzeń (np. <code>click</code>) po trafieniu w kliknięty element wędruje w górę drzewa DOM przez kolejnych rodziców aż do obiektu <code>document</code>. Zjawisko to nazywa się bąbelkowaniem (event bubbling). Dzięki niemu możesz w większych aplikacjach podłączyć jeden listener do całego kontenera zamiast do stu osobnych przycisków wewnątrz niego.</p>

  <h4>event.target kontra event.currentTarget</h4>
  <p>Właściwość <code>event.target</code> wskazuje najgłębszy element, w który fizycznie kliknął użytkownik (na przykład ikonę <code>&lt;span&gt;</code> wewnątrz przycisku). Właściwość <code>event.currentTarget</code> zawsze wskazuje dokładnie ten element, na którym wywołałeś metodę <code>addEventListener</code>. W prostych przyciskach tekstowych oba wskazują na to samo, ale w rozbudowanych kartach to rozróżnienie bywa kluczowe.</p>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Model zdarzeń**: skrypt rejestruje nasłuchy przez `addEventListener` i nie blokuje przeglądarki, uruchamiając kod dopiero w reakcji na akcję użytkownika.
- **Callback bez nawiasów**: przekazuj referencję `fn` albo funkcję strzałkową `() => { ... }`, bo dopisanie `()` w `addEventListener("click", fn())` uruchamia funkcję za wcześnie i rejestruje `undefined`.
- **Dobór typu zdarzenia**: `"click"` dla przycisków, `"input"` dla podglądu na żywo, `"change"` dla wyborów z list, `"submit"` wyłącznie na znaczniku `<form>`.
- **Formularz i `event.preventDefault()`**: w obsłudze `"submit"` zawsze blokuj domyślne przeładowanie strony, aby nie wyzerować stanu skryptu.
- **Zmienna stanu poza listenerem**: zmienne zadeklarowane wewnątrz funkcji zwrotnej tworzą się od zera przy każdym kolejnym zdarzeniu.

> [!TIP]
> Chcesz utrwalić obsługę zdarzeń i formularzy na rozbudowanych zadaniach praktycznych z gotowym HTML i CSS? Zobacz [Katalog zadań praktycznych](/arkusze/?qual=INF.03&tag=JS).
