# Funkcje jako wartości i funkcje strzałkowe

W poprzedniej lekcji napisałeś skrypt, który pobierał elementy drzewa DOM i zmieniał status serwera z „wyłączony” na „aktywny”. Taki skrypt wykonuje się jednak dokładnie raz: natychmiast po załadowaniu strony.

Co zrobisz, gdy aplikacja musi zmienić komunikat alertu w czterech różnych momentach działania? Kopiowanie tych samych pięciu linii kodu w każde miejsce szybko zamienia skrypt w trudny do utrzymania bałagan. Jeszcze większy problem pojawia się wtedy, gdy chcesz przekazać przeglądarce instrukcję, którą ma uruchomić dopiero w przyszłości.

Rozwiązaniem obu tych problemów są funkcje traktowane jako zwykłe wartości oraz nowoczesny zapis funkcji strzałkowych.

---

## 🧩 Funkcja klasyczna jako nazwany przepis

Zanim przejdziesz do zapisu strzałkowego, zobacz klasyczną deklarację funkcji. Słowo kluczowe `function` tworzy nazwany blok instrukcji, który możesz uruchamiać wielokrotnie z różnymi danymi wejściowymi.

```javascript
function ustawKomunikat(tekst) {
  const pole = document.querySelector("#komunikat");
  pole.textContent = tekst;
}
```

Przeanalizuj trzy elementy tej konstrukcji:
- `ustawKomunikat`: nazwa funkcji, po której odwołujesz się do przepisu.
- *tekst*: **parametr**, czyli lokalna zmienna czekająca na dane wejściowe.
- `{ ... }`: **ciało funkcji**, czyli instrukcje, które wykonają się dopiero w chwili wywołania.

Sama definicja funkcji nie zmienia jeszcze niczego na stronie. Silnik JavaScript zapisuje przepis w pamięci i przechodzi do kolejnej linii. Dopiero wywołanie funkcji z nawiasami i argumentem uruchamia jej wnętrze:

```javascript
ustawKomunikat("Połączenie nawiązane");
ustawKomunikat("Zapisano ustawienia");
```

Funkcja może też obliczyć wynik i oddać go z powrotem do miejsca wywołania za pomocą słowa kluczowego **return** (na przykład `return cena - znizka;`). Jeśli w funkcji nie ma instrukcji `return`, silnik automatycznie zwraca specjalną wartość `undefined`.

---

## 📦 Funkcja jako wartość w zmiennej const

W wielu językach programowania funkcje istnieją w osobnym świecie niż liczby czy napisy. W JavaScript działa inna zasada: **funkcje są wartościami pierwszej kategorii**.

Oznacza to, że funkcję możesz zapisać w zmiennej `const` dokładnie tak samo, jak zapisujesz liczbę `42`, napis `"Online"` albo referencję do węzła DOM. Taki zapis nazywa się **wyrażeniem funkcyjnym**.

```javascript
const ustawKomunikat = function(tekst) {
  const pole = document.querySelector("#komunikat");
  pole.textContent = tekst;
};
```

Zwróć uwagę na prawą stronę znaku `=`. Po słowie `function` nie ma już nazwy, ponieważ funkcja jest zapisana bezpośrednio pod etykietą `const ustawKomunikat`. Tę samą funkcję bez własnej nazwy nazywamy **funkcją anonimową**.

Dlaczego programiści chętnie zapisują funkcje w `const`? Chroni to funkcję przed przypadkowym nadpisaniem w dalszej części programu. Jednocześnie jasno pokazuje, że nazwa funkcji jest zwykłą zmienną wskazującą na obiekt w pamięci.

---

## ➡️ Ewolucja do funkcji strzałkowej

Zapis `const nazwa = function(parametr) { ... }` działa poprawnie, ale w nowoczesnym JavaScript jest rozwlekły. Szczególnie wtedy, gdy przekazujesz krótkie funkcje anonimowe wprost do metod przeglądarki.

Dlatego standard języka wprowadził krótszy i czytelniejszy zapis: **funkcję strzałkową** (nazywaną tak od operatora `=>`). Zobacz krok po kroku, jak klasyczna funkcja zamienia się w funkcję strzałkową:

```javascript
// Krok 1: Deklaracja klasyczna
function policzRabat(cena, znizka) {
  return cena - znizka;
}

// Krok 2: Wyrażenie funkcyjne zapisane w const
const policzRabat = function(cena, znizka) {
  return cena - znizka;
};

// Krok 3: Usunięcie słowa function i dodanie strzałki => po nawiasach
const policzRabat = (cena, znizka) => {
  return cena - znizka;
};
```

W funkcji strzałkowej zachowujesz dokładnie tę samą logikę, ale usuwasz powtarzalne słowo `function`. Znak `=>` czytaj w myślach jako „przekazuje parametry do bloku instrukcji”.

Zobacz trzy warianty listy parametrów, które spotkasz w kodzie każdego dnia:

| Liczba parametrów | Zapis funkcji strzałkowej | Przykład użycia |
| :--- | :--- | :--- |
| Zero parametrów | `() => { ... }` | `const wyczysc = () => { pole.textContent = ""; };` |
| Jeden parametr | `(tekst) => { ... }` | `const pokaz = (tekst) => { pole.textContent = tekst; };` |
| Wiele parametrów | `(a, b) => { ... }` | `const dodaj = (a, b) => { return a + b; };` |

> [!TIP]
> Przy jednym parametrze JavaScript pozwala pominąć nawiasy (`tekst => { ... }`), jednak na początku nauki zawsze pisz nawiasy `(tekst) => { ... }`. Jednolity zapis zmniejsza ryzyko błędu składniowego, gdy później dopiszesz drugi parametr.

<data-gate>
  <data-sortable-list title="Ułóż etapy przekształcania funkcji klasycznej w anonimową funkcję strzałkową">
    <item data-correct="3">Zastąp słowo function operatorem strzałki =&gt; umieszczonym za nawiasami: const powitaj = (imie) =&gt; { ... };</item>
    <item data-correct="1">Zacznij od klasycznej deklaracji: function powitaj(imie) { ... }</item>
    <item data-correct="4">Usuń zmienną i użyj samej anonimowej funkcji strzałkowej tam, gdzie potrzebna jest wartość: (imie) =&gt; { ... }</item>
    <item data-correct="2">Przenieś nazwę do zmiennej const i zamień definicję na wyrażenie funkcyjne: const powitaj = function(imie) { ... };</item>
  </data-sortable-list>
</data-gate>

---

## ⚖️ Kluczowe rozróżnienie: nazwa kontra nazwa()

To najważniejsza zasada w tej lekcji. Zrozumienie różnicy między samą nazwą funkcji a jej wywołaniem oszczędzi Ci godzin szukania błędów przy zdarzeniach i pętlach.

- `pokazStatus` (bez nawiasów): to **referencja do funkcji**, czyli sam przepis. Nic się w tym momencie nie wykonuje.
- `pokazStatus()` (z nawiasami): to **natychmiastowe wywołanie funkcji**. Operator `()` każe silnikowi uruchomić kod wewnątrz funkcji tu i teraz, a w miejscu wywołania wstawić jej wynik (`return` albo `undefined`).

### 🔮 Przewidywanie: trzy warianty tego samego przepisu

Przeanalizuj uważnie poniższe trzy fragmenty kodu. Załóż, że każdy z nich uruchamiasz w osobnej konsoli.

```javascript
// Wariant A
const uruchomAlarm = () => {
  console.log("ALARM!");
};
```

```javascript
// Wariant B
const uruchomAlarm = () => {
  console.log("ALARM!");
};
const wynik = uruchomAlarm();
```

```javascript
// Wariant C
const uruchomAlarm = () => {
  console.log("ALARM!");
};
const kopiaPrzepisu = uruchomAlarm;
```

> [!IMPORTANT]
> Zanim przeczytasz wyjaśnienie poniżej, rozstrzygnij dla każdego z trzech wariantów:
> 1. Czy w konsoli pojawi się napis `"ALARM!"`?
> 2. Co dokładnie znajduje się w zmiennej `wynik` (Wariant B) oraz `kopiaPrzepisu` (Wariant C)?

### 🔎 Obserwacja i wyjaśnienie

Sprawdź swoje przewidywania z rzeczywistym zachowaniem silnika JavaScript:

- **Wariant A**: konsola pozostaje całkowicie pusta. Zapisaliśmy przepis w pamięci pod nazwą `uruchomAlarm`, ale nigdzie nie użyliśmy nawiasów `()`.
- **Wariant B**: w konsoli pojawia się `"ALARM!"`, ponieważ nawiasy `()` natychmiast uruchomiły funkcję. Funkcja nie zawiera instrukcji `return`, więc zwraca wartość `undefined`. W zmiennej `wynik` zapisane jest więc **_undefined_**, a nie funkcja.
- **Wariant C**: konsola pozostaje pusta. Nie ma nawiasów `()`, więc kod wewnątrz funkcji nie wykonał się. Zmienna `kopiaPrzepisu` wskazuje teraz na tę samą **funkcję w pamięci** co `uruchomAlarm`. Możesz ją później uruchomić, pisząc `kopiaPrzepisu()`.

---

## 🔁 Funkcja zwrotna (callback): przekazywanie przepisu dalej

Skoro funkcja jest zwykłą wartością, możesz przekazać ją jako argument do innej funkcji. Funkcję przekazaną jako argument, którą inna funkcja uruchomi w odpowiednim momencie, nazywamy _**funkcją zwrotną**_ (callback).

Zobacz to na prostym przykładzie bez żadnej magii:

```javascript
const wyswietlSukces = () => {
  console.log("Operacja zakończona poprawnie.");
};

const wykonajZLogiem = (zadanie) => {
  console.log("Start procedury...");
  zadanie();
  console.log("Koniec procedury.");
};

// Przekazujemy sam przepis (bez nawiasów!):
wykonajZLogiem(wyswietlSukces);
```

Prześledź kolejność zdarzeń w pamięci:
1. Wywołujemy `wykonajZLogiem`, przekazując referencję `wyswietlSukces` pod parametr *zadanie*.
2. Wewnątrz `wykonajZLogiem` najpierw wypisuje się `"Start procedury..."`.
3. Dopiero linia `zadanie()` dodaje nawiasy i uruchamia przekazaną funkcję.
4. Na końcu wypisuje się `"Koniec procedury."`.

A co by się stało, gdybyś zapisał `wykonajZLogiem(wyswietlSukces())` z nawiasami? Funkcja `wyswietlSukces` uruchomiłaby się za wcześnie, jeszcze przed napisem `"Start procedury..."`, a pod parametr *zadanie* trafiłaby wartość `undefined`. Wtedy linia `zadanie()` rzuciłaby błąd **_TypeError: zadanie is not a function_**.

Zamiast tworzyć osobną zmienną dla jednorazowego zadania, często przekazujemy anonimową funkcję strzałkową bezpośrednio w miejscu argumentu:

```javascript
wykonajZLogiem(() => {
  console.log("Jednorazowe zadanie wykonane.");
});
```

Dokładnie ten sam mechanizm zobaczysz w kolejnej lekcji przy obsłudze kliknięć przycisków oraz przy iterowaniu po listach elementów.

---

## 🛠️ Warsztat prowadzony: funkcja strzałkowa dla paska alertów

W panelu aplikacji mamy pasek powiadomień `#pasek-alertu` oraz tekst `#tresc-alertu`. Zamiast ręcznie powtarzać operacje na DOM przy każdym komunikacie, dokończ funkcję strzałkową `ustawAlert`, która przyjmuje dwa parametry: `wiadomosc` i `typ`.

Uzupełnij brakujące miejsca w edytorze:
- Zapisz `ustawAlert` jako funkcję strzałkową z parametrami `(wiadomosc, typ)`.
- Wewnątrz funkcji ustaw `trescEl.textContent` na wartość parametru `wiadomosc`.
- Usuń stare klasy `"info"` i `"blad"`, a następnie dodaj klasę z parametru `typ` na elemencie `pasekEl`.
- Na końcu skryptu wywołaj funkcję z argumentami `"Brak połączenia z bazą"` oraz `"blad"`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Sterownik paska alertów">
    <template data-type="html">
<style>
  .alert { padding: 14px 18px; border-radius: 8px; font-family: sans-serif; border-left: 5px solid #64748b; background: #f1f5f9; max-width: 380px; }
  .alert.info { background: #eff6ff; border-color: #2563eb; color: #1e3a8a; }
  .alert.blad { background: #fef2f2; border-color: #dc2626; color: #7f1d1d; }
</style>
<div id="pasek-alertu" class="alert info">
  <p id="tresc-alertu">System gotowy do pracy.</p>
</div>
    </template>
    <template data-type="code">
const pasekEl = document.querySelector("#pasek-alertu");
const trescEl = document.querySelector("#tresc-alertu");

// TODO: Przepisz poniższą deklarację klasyczną na funkcję strzałkową const ustawAlert = (wiadomosc, typ) => { ... }
function ustawAlert(wiadomosc, typ) {
  // 1. Ustaw trescEl.textContent na wiadomosc
  // 2. Usuń klasy "info" oraz "blad" z pasekEl.classList
  // 3. Dodaj klasę przekazaną w zmiennej typ do pasekEl.classList
}

// TODO: Wywołaj ustawAlert("Brak połączenia z bazą", "blad");
    </template>
    <template data-type="requirements">
      [
        {
          "id": "arrow-syntax",
          "text": "Definicja funkcji strzałkowej const ustawAlert = (wiadomosc, typ) =>",
          "type": "regex",
          "pattern": "const\\s+ustawAlert\\s*=\\s*\\(\\s*wiadomosc\\s*,\\s*typ\\s*\\)\\s*=>"
        },
        {
          "id": "set-message",
          "text": "Ustawienie trescEl.textContent = wiadomosc wewnątrz funkcji",
          "type": "regex",
          "pattern": "trescEl\\.textContent\\s*=\\s*wiadomosc"
        },
        {
          "id": "remove-classes",
          "text": "Usunięcie klas info i blad z pasekEl.classList",
          "type": "regex",
          "pattern": "pasekEl\\.classList\\.remove\\s*\\("
        },
        {
          "id": "add-typ",
          "text": "Dodanie klasy z parametru typ przez pasekEl.classList.add(typ)",
          "type": "regex",
          "pattern": "pasekEl\\.classList\\.add\\s*\\(\\s*typ\\s*\\)"
        },
        {
          "id": "call-alert",
          "text": "Wywołanie ustawAlert(\"Brak połączenia z bazą\", \"blad\")",
          "type": "regex",
          "pattern": "ustawAlert\\s*\\(\\s*[\"']Brak połączenia z bazą[\"']\\s*,\\s*[\"']blad[\"']\\s*\\)"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🚀 Samodzielne zadanie: Sterownik karty profilu użytkownika

Zbuduj od podstaw mały sterownik karty profilu złożony z dwóch współpracujących funkcji strzałkowych.

W szablonie HTML masz kartę `#profil`, nazwę `#nazwa-uzytkownika` oraz etykietę roli `#rola-uzytkownika`.

Twoje wymagania:
1. Pobierz wszystkie trzy elementy przez `document.querySelector` i zapisz je w zmiennych `const`.
2. Napisz pierwszą funkcję strzałkową `const ustawDaneProfilu = (nazwa, rola) => { ... }`, która ustawia `textContent` dla `#nazwa-uzytkownika` na `nazwa` oraz dla `#rola-uzytkownika` na `rola`.
3. Napisz drugą funkcję strzałkową `const oznaczJakoAdmina = () => { ... }`, która usuwa klasę `"gosc"` i dodaje klasę `"admin"` na elemencie `#profil`.
4. Napisz funkcję pomocniczą `const zastosujAkcje = (akcja) => { akcja(); };`, która przyjmuje funkcję zwrotną (*callback*) i ją wywołuje.
5. Wywołaj `ustawDaneProfilu("Marek Nowak", "Administrator")`, a następnie przekaż samą referencję `oznaczJakoAdmina` **bez nawiasów** do `zastosujAkcje(oznaczJakoAdmina)`.

<data-gate>
  <data-code-runner language="javascript" sandbox="dom" title="Sterownik karty profilu">
    <template data-type="html">
<style>
  .profil { padding: 16px; border-radius: 10px; border: 2px solid #cbd5e1; font-family: sans-serif; max-width: 320px; }
  .profil.gosc { background: #f8fafc; color: #334155; }
  .profil.admin { background: #fefce8; border-color: #ca8a04; color: #713f12; }
  .rola { display: inline-block; margin-top: 6px; padding: 3px 8px; border-radius: 4px; background: rgba(0,0,0,0.08); font-size: 0.9rem; }
</style>
<section id="profil" class="profil gosc">
  <h3 id="nazwa-uzytkownika">Anonimowy gość</h3>
  <span id="rola-uzytkownika" class="rola">Gość</span>
</section>
    </template>
    <template data-type="code">
// Zbuduj sterownik z dwiema funkcjami strzałkowymi i wywołaj je na końcu:

    </template>
    <template data-type="requirements">
      [
        {
          "id": "no-function-keyword",
          "text": "Użycie składni strzałkowej zamiast klasycznego słowa function",
          "type": "not-contains",
          "pattern": "function "
        },
        {
          "id": "select-profil",
          "text": "Pobranie #profil, #nazwa-uzytkownika oraz #rola-uzytkownika przez querySelector",
          "type": "regex",
          "pattern": "document\\.querySelector\\s*\\(\\s*[\"']#profil[\"']\\s*\\)"
        },
        {
          "id": "fn-dane",
          "text": "Funkcja strzałkowa const ustawDaneProfilu = (nazwa, rola) =>",
          "type": "regex",
          "pattern": "const\\s+ustawDaneProfilu\\s*=\\s*\\(\\s*nazwa\\s*,\\s*rola\\s*\\)\\s*=>"
        },
        {
          "id": "fn-admin",
          "text": "Funkcja strzałkowa const oznaczJakoAdmina = () =>",
          "type": "regex",
          "pattern": "const\\s+oznaczJakoAdmina\\s*=\\s*\\(\\s*\\)\\s*=>"
        },
        {
          "id": "class-admin",
          "text": "Dodanie klasy admin na karcie profilu przez classList.add",
          "type": "regex",
          "pattern": "\\.classList\\.add\\s*\\(\\s*[\"']admin[\"']\\s*\\)"
        },
        {
          "id": "call-dane",
          "text": "Wywołanie ustawDaneProfilu(\"Marek Nowak\", \"Administrator\")",
          "type": "regex",
          "pattern": "ustawDaneProfilu\\s*\\(\\s*[\"']Marek Nowak[\"']\\s*,\\s*[\"']Administrator[\"']\\s*\\)"
        },
        {
          "id": "fn-callback-runner",
          "text": "Funkcja pomocnicza const zastosujAkcje = (akcja) => wywołująca akcja()",
          "type": "regex",
          "pattern": "const\\s+zastosujAkcje\\s*=\\s*\\(\\s*akcja\\s*\\)\\s*=>"
        },
        {
          "id": "call-callback-ref",
          "text": "Przekazanie referencji oznaczJakoAdmina bez nawiasów do zastosujAkcje(oznaczJakoAdmina)",
          "type": "regex",
          "pattern": "zastosujAkcje\\s*\\(\\s*oznaczJakoAdmina\\s*\\)"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

<details class="deep-dive">
  <summary>Głębsze spojrzenie: hoisting, niejawny return i różnica w wiązaniu this</summary>

  <h4>Hoisting: dlaczego kolejność zapisu ma znaczenie przy const</h4>
  <p>Klasyczna deklaracja <code>function nazwa() {}</code> podlega w JavaScript zjawisku hoistingu: silnik rejestruje ją przed rozpoczęciem wykonywania linii kodu, więc można ją wywołać nawet nad jej definicją. Funkcja strzałkowa zapisana w <code>const</code> zachowuje się jak zwykła zmienna w strefie TDZ (Temporal Dead Zone). Próba jej wywołania przed linią deklaracji kończy się błędem <code>ReferenceError</code>. Wymusza to czytelny układ pliku od góry do dołu.</p>

  <h4>Niejawny return dla jednoinstrukcyjnych funkcji strzałkowych</h4>
  <p>Gdy funkcja strzałkowa ma wyłącznie jedno wyrażenie zwracające wartość, można pominąć nawiasy klamrowe i słowo <code>return</code>: zapis <code>const podwoj = (x) =&gt; x * 2;</code> działa identycznie jak <code>const podwoj = (x) =&gt; { return x * 2; };</code>. Gdy tylko w funkcji pojawiają się nawiasy klamrowe <code>{}</code>, słowo <code>return</code> staje się obowiązkowe, jeśli funkcja ma zwrócić wynik.</p>

  <h4>Leksykalne wiązanie this w funkcjach strzałkowych</h4>
  <p>Klasyczna funkcja tworzy własny kontekst <code>this</code> zależny od sposobu jej wywołania, co w starszym kodzie często prowadziło do trudnych błędów wewnątrz metod obiektów. Funkcja strzałkowa nie tworzy własnego <code>this</code>: dziedziczy je na stałe z otaczającego ją zakresu leksykalnego. W pracy z <code>addEventListener</code> oznacza to także, że w funkcji strzałkowej zamiast <code>this</code> korzystamy z obiektu zdarzenia (<code>event.currentTarget</code> lub <code>event.target</code>).</p>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Funkcja jako wartość**: możesz ją zapisać w `const`, skopiować do innej zmiennej albo przekazać jako argument do kolejnej funkcji.
- **Składnia strzałkowa `() => {}`**: zastępuje rozwlekłe `function() {}`; zapisuj parametry w nawiasach `(a, b) => { ... }`, a logikę w klamrach.
- **Referencja `fn` kontra wywołanie `fn()`**: sama nazwa to przepis, a nawiasy uruchamiają kod od razu, więc przekazując funkcję na później, nie dopisuj `()`.
- **Funkcja zwrotna (callback)**: funkcja przekazana jako argument; to funkcja nadrzędna decyduje, kiedy dopisze nawiasy i ją uruchomi.
