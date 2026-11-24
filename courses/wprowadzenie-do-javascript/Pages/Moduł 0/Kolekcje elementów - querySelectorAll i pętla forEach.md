# Kolekcje elementów: querySelectorAll i pętla forEach

Wyobraź sobie stronę sklepu internetowego, na której stoi 24 karty produktów. Wszystkie mają wspólną klasę `.karta`. Chcesz dodać przycisk „Zaznacz wszystkie”, który podświetli każdą kartę jednym kliknięciem.

Do tej pory używałeś `document.querySelector(".karta")`. Gdy uruchomisz to polecenie na liście 24 produktów, podświetli się wyłącznie pierwsza karta od góry. Pozostałe 23 pozostaną nietknięte, ponieważ `querySelector` przerywa przeszukiwanie dokumentu w chwili znalezienia pierwszego pasującego węzła.

Ręczne nadawanie identyfikatorów `#karta-1`, `#karta-2` aż do `#karta-24` nie rozwiązuje problemu. Gdy jutro dodasz dwa nowe produkty w HTML, skrypt przestanie obejmować całą listę. Potrzebujesz narzędzia, które zbiera wszystkie pasujące elementy naraz, oraz mechanizmu, który przetwarza je jeden po drugim.

## 📦 Pojedynczy element kontra kolekcja NodeList

Metoda `document.querySelector` zachowuje się jak szczypce: chwyta jeden konkretny element z drzewa DOM. Jeśli żaden znacznik nie pasuje do selektora, zwraca wartość `null`.

Metoda **document.querySelectorAll** działa inaczej. Przeszukuje całe drzewo dokumentu i zbiera każdy pasujący znacznik do jednego kontenera nazywanego _**NodeList**_.

Pomyśl o tej różnicy jak o magazynie. `querySelector` podaje Ci do ręki pojedynczy produkt. `querySelectorAll` stawia przed Tobą karton z ponumerowanymi przegródkami: `0`, `1`, `2` i tak dalej.

```javascript
const pierwszaKarta = document.querySelector(".karta");
const wszystkieKarty = document.querySelectorAll(".karta");

console.log(pierwszaKarta);          // <div class="karta">...</div> (lub null)
console.log(wszystkieKarty);         // NodeList(4) [div.karta, div.karta, ...]
console.log(wszystkieKarty.length);  // 4
```

Karton ma jedną ważną cechę: **zawsze istnieje jako obiekt**, nawet gdy w środku nic nie ma. Jeśli na stronie nie ma ani jednego elementu z klasą `.karta`, `querySelectorAll(".karta")` nie zwraca `null`. Zwraca pustą kolekcję `NodeList`, której właściwość *length* wynosi `0`.

| Cecha | `document.querySelector(selektor)` | `document.querySelectorAll(selektor)` |
| :--- | :--- | :--- |
| Co zwraca przy trafieniu | Pierwszy pasujący obiekt `Element` | Kolekcję `NodeList` ze wszystkimi trafieniami |
| Co zwraca, gdy brak trafień | `null` | Pustą kolekcję `NodeList` (`.length === 0`) |
| Czy ma właściwość `.classList` | Tak (bezpośrednio na elemencie) | Nie (`.classList` mają dopiero elementy w środku) |
| Czy ma właściwość `.length` | Nie | Tak (zwraca liczbę znalezionych elementów) |

> [!IMPORTANT]
> **Kluczowa zasada typów:** `querySelectorAll` nigdy nie zwraca `null`. Zawsze dostajesz obiekt `NodeList`, więc możesz bezpiecznie odczytać *lista.length* nawet wtedy, gdy selektor nic nie znalazł.

## 🔍 Przewidź, sprawdź, wyjaśnij: błąd na pudełku

Skoro zmienna *karty* przechowuje wszystkie karty produktów, intuicja podpowiada najkrótszy możliwy zapis: dodać klasę bezpośrednio do całej zmiennej. Przeanalizuj poniższy kod.

```javascript
const karty = document.querySelectorAll(".karta");
karty.classList.add("aktywna");
```

**Krok 1 (Przewidź):** Zatrzymaj się na 10 sekund i postaw konkretną hipotezę, zanim przeczytasz dalszą część. Co zrobi przeglądarka po uruchomieniu tych dwóch linii?
- Opcja A: Doda klasę `aktywna` do wszystkich elementów `.karta` naraz.
- Opcja B: Doda klasę `aktywna` tylko do pierwszego elementu.
- Opcja C: Przerwie działanie skryptu z błędem **_TypeError_**.

**Krok 2 (Obserwuj):** Po uruchomieniu kodu w konsoli przeglądarki żadna karta nie zmienia wyglądu. Zamiast tego pojawia się czerwony komunikat:

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'add')
```

**Krok 3 (Wyjaśnij):** Przyczyną błędu nie jest brak elementów na stronie. Zmienna *karty* to kolekcja `NodeList`, czyli karton z elementami. Karton nie jest znacznikiem HTML, więc nie posiada właściwości `classList`.

Gdy JavaScript próbuje odczytać `karty.classList`, otrzymuje wartość `undefined`. Zaraz potem próbuje wywołać na tym `undefined` metodę `.add("aktywna")`. Ponieważ na `undefined` nie da się wywołać żadnej metody, silnik natychmiast rzuca **_TypeError_**.

> [!WARNING]
> **Diagnostyka błędu:** Gdy widzisz w konsoli komunikat **_Cannot read properties of undefined (reading 'add')_** przy operacji na `classList`, sprawdź linię wyżej. Prawie zawsze próbujesz modyfikować całą kolekcję z `querySelectorAll` zamiast pojedynczego elementu.

## ⚙️ Pętla forEach krok po kroku

Aby zmienić wygląd każdej karty, musisz otworzyć karton i wykonać operację osobno dla każdej przegródki. Teoretycznie mógłbyś użyć indeksów ręcznie: `karty[0].classList.add("aktywna")`, potem `karty[1]` i tak dalej. Taki kod natychmiast psuje się, gdy liczba produktów na stronie się zmieni.

Zamiast ręcznego wypisywania indeksów używasz wbudowanej metody **forEach**, którą posiada każda kolekcja `NodeList`. Metoda ta przyjmuje funkcję strzałkową i wywołuje ją automatycznie dla każdego kolejnego elementu w kolekcji.

```javascript
const karty = document.querySelectorAll(".karta");

karty.forEach((karta, indeks) => {
  karta.classList.add("aktywna");
  console.log(indeks, karta.textContent);
});
```

Przyjrzyj się uważnie, skąd biorą się parametry *karta* i *indeks*. Nigdzie nie przypisywałeś im wartości znakiem `=`. Robi to za Ciebie silnik JavaScript wewnątrz metody `forEach`.

Załóżmy, że na stronie istnieją 3 karty: „Klawiatura”, „Mysz” i „Monitor”. Prześledź dokładnie, co wykonuje przeglądarka:

1. **Start pętli:** `karty.forEach(...)` sprawdza, że kolekcja ma długość `3`.
2. **Iteracja 1 (indeks 0):** Silnik wyjmuje `karty[0]` („Klawiatura”) i wstawia go jako pierwszy parametr *karta*, a liczbę `0` jako drugi parametr *indeks*. Uruchamia ciało funkcji: dodaje klasę `aktywna` do „Klawiatury” i wypisuje `0 "Klawiatura"`.
3. **Iteracja 2 (indeks 1):** Silnik wyjmuje `karty[1]` („Mysz”) i podstawia `1` pod *indeks*. Dodaje klasę `aktywna` do „Myszy” i wypisuje `1 "Mysz"`.
4. **Iteracja 3 (indeks 2):** Silnik wyjmuje `karty[2]` („Monitor”) i podstawia `2` pod *indeks*. Dodaje klasę `aktywna` do „Monitora” i wypisuje `2 "Monitor"`.
5. **Koniec pętli:** Brak kolejnych elementów w `NodeList`. Program przechodzi do linii kodu za zamknięciem `});`.

### Nazwy parametrów i drugi parametr

Nazwy *karta* oraz *indeks* wybierasz samodzielnie. Równie poprawnie zadziałają nazwy `(el, i)` albo `(produkt, numer)`. Dla silnika JavaScript liczy się wyłącznie **kolejność parametrów**:
- **pierwszy parametr** zawsze otrzymuje bieżący element HTML z kolekcji,
- **drugi parametr** jest opcjonalny i zawsze otrzymuje numer porządkowy tej iteracji, liczony od zera (`0`, `1`, `2`, ...).

Jeśli w danym zadaniu nie potrzebujesz numeru iteracji, pomijasz drugi parametr i piszesz po prostu `karty.forEach((karta) => { ... })`.

### Co dzieje się przy pustej kolekcji

Załóżmy, że wywołałeś `document.querySelectorAll(".nieistniejaca")` i otrzymałeś pustą kolekcję o długości `0`. Kiedy wywołasz na niej `.forEach(...)`, pętla sprawdzi długość, wykona zero obiegów i zakończy się bez żadnego błędu. Nie musisz owijać `forEach` w dodatkowy warunek `if (lista.length > 0)`.

<data-gate>
<data-sortable-list title="Przepływ wykonania: od querySelectorAll do ostatniej iteracji forEach">
  <item data-correct="3">Iteracja 1: silnik podstawia element [0] pod parametr karta i wykonuje ciało funkcji strzałkowej</item>
  <item data-correct="1">Wywołanie document.querySelectorAll(".karta") skanuje DOM i zwraca kolekcję NodeList (np. 3 elementy)</item>
  <item data-correct="5">Iteracja 3: silnik podstawia element [2] pod parametr karta i wykonuje ciało funkcji strzałkowej</item>
  <item data-correct="2">Wywołanie karty.forEach(...) rozpoczyna przeglądanie kolekcji od indeksu 0</item>
  <item data-correct="6">Brak kolejnych pozycji w NodeList: pętla kończy działanie i kod przechodzi do kolejnej instrukcji</item>
  <item data-correct="4">Iteracja 2: silnik podstawia element [1] pod parametr karta i wykonuje ciało funkcji strzałkowej</item>
</data-sortable-list>
</data-gate>

## 🧪 Ćwiczenie prowadzone: numerowanie i podświetlanie listy zadań

Zanim uzupełnisz pętlę, zwróć uwagę na dwa krótkie zapisy łączenia tekstu, z których skorzystasz w ćwiczeniach:

```javascript
// Nawiasy przy (indeks + 1) gwarantują dodawanie liczb przed sklejeniem z tekstem:
element.textContent = (indeks + 1) + ". " + element.textContent;

// Operator += dopisuje nowy fragment na końcu istniejącego napisu:
element.textContent += " (-20%)";
```

Masz gotową listę 4 zadań w HTML. Każde zadanie ma klasę `.zadanie`. Twoim celem jest uzupełnienie pętli `forEach` tak, aby:
1. dodać każdemu zadaniu klasę `gotowe` przez `classList.add`,
2. dopisać na początku tekstu każdego zadania jego numer dla człowieka (`indeks + 1`, na przykład `1. Sprawdzić kopię zapasową`),
3. wypisać łączną liczbę zadań w elemencie `#licznik`, korzystając z właściwości *length*.

<data-gate>
<data-code-runner language="javascript" sandbox="dom" title="Lista zadań: numerowanie i klasa gotowe">
<template data-type="html">
<style>
  .zadania-panel { font-family: system-ui, sans-serif; padding: 14px; background: #1e293b; color: #f8fafc; border-radius: 10px; }
  .zadania-panel h3 { margin: 0 0 10px 0; font-size: 16px; color: #93c5fd; }
  .zadania-lista { list-style: none; padding: 0; margin: 0 0 12px 0; display: grid; gap: 8px; }
  .zadanie { padding: 10px 12px; background: #334155; border-left: 4px solid #64748b; border-radius: 6px; transition: all 0.2s; }
  .zadanie.gotowe { background: #14532d; border-left-color: #22c55e; color: #dcfce7; }
  #licznik { margin: 0; font-size: 14px; font-weight: 600; color: #fcd34d; }
</style>
<div class="zadania-panel">
  <h3>Lista kontrolna serwera</h3>
  <ul class="zadania-lista">
    <li class="zadanie">Sprawdzić kopię zapasową bazy</li>
    <li class="zadanie">Zaktualizować certyfikat SSL</li>
    <li class="zadanie">Oczyścić stare logi aplikacji</li>
    <li class="zadanie">Zweryfikować wolne miejsce na dysku</li>
  </ul>
  <p id="licznik">Liczba zadań: ?</p>
</div>
</template>
<template data-type="code">
const zadania = document.querySelectorAll(".zadanie");
const licznik = document.querySelector("#licznik");

zadania.forEach((zadanie, indeks) => {
  // 1. Dodaj klasę "gotowe" do bieżącego elementu zadanie

  // 2. Zmień zadanie.textContent, dopisując numer (indeks + 1) przed obecnym tekstem

});

// 3. Wpisz do licznik.textContent tekst zawierający zadania.length
</template>
<template data-type="requirements">
[
  {
    "id": "qsa",
    "text": "Pobiera wszystkie zadania metodą querySelectorAll",
    "type": "contains",
    "pattern": "querySelectorAll"
  },
  {
    "id": "foreach-two-params",
    "text": "Używa pętli forEach z funkcją strzałkową przyjmującą element i indeks",
    "type": "regex",
    "pattern": "\\.forEach\\s*\\(\\s*\\(\\s*[a-zA-Z_$][\\w$]*\\s*,\\s*[a-zA-Z_$][\\w$]*\\s*\\)\\s*=>"
  },
  {
    "id": "classlist-add",
    "text": "Dodaje każdemu zadaniu klasę gotowe przez classList.add",
    "type": "regex",
    "pattern": "classList\\.add\\s*\\(\\s*[\"']gotowe[\"']\\s*\\)"
  },
  {
    "id": "no-collection-classlist",
    "text": "Nie wywołuje classList bezpośrednio na kolekcji zadania",
    "type": "not-contains",
    "pattern": "zadania.classList"
  },
  {
    "id": "human-index",
    "text": "Numeruje zadania od 1, dodając 1 do indeksu (indeks + 1)",
    "type": "regex",
    "pattern": "\\+\\s*1"
  },
  {
    "id": "use-length",
    "text": "Odczytuje liczbę elementów kolekcji za pomocą właściwości .length",
    "type": "contains",
    "pattern": ".length"
  }
]
</template>
</data-code-runner>
</data-gate>

## 🛠️ Typowe błędy podczas pracy z kolekcjami

Zanim przejdziesz do samodzielnego zadania, poznaj trzy pomyłki, które najczęściej blokują kod początkujących. Każda z nich daje inny objaw w przeglądarce.

### 1. Pętla forEach wywołana na querySelector

Jeśli przez nieuwagę napiszesz `document.querySelector(".produkt")` zamiast `querySelectorAll`, otrzymasz pojedynczy element HTML. Pojedynczy element nie ma metody `forEach`, więc konsola wyrzuci błąd **_TypeError: produkty.forEach is not a function_**.

### 2. Brak kropki przed nazwą klasy

Zapis `document.querySelectorAll("produkt")` bez kropki na początku nie zgłasza żadnego błędu składni. Przeglądarka grzecznie szuka nieistniejącego znacznika `<produkt>`, znajduje zero wyników i zwraca pustą `NodeList`. Pętla `forEach` wykonuje wtedy zero iteracji, a strona wygląda tak, jakby kod w ogóle nie zadziałał.

> [!TIP]
> **Szybki test diagnostyczny:** Jeśli pętla `forEach` „nic nie robi” i w konsoli nie ma błędu, wpisz nad pętlą `console.log(produkty.length)`. Wartość `0` natychmiast wskazuje na literówkę w selektorze albo brak kropki przed nazwą klasy.

### 3. Wyświetlanie surowego indeksu użytkownikowi

Komputer liczy pozycje od `0`, bo indeks oznacza przesunięcie od początku kolekcji. Użytkownik spodziewa się listy zaczynającej się od `1`. Zawsze dodawaj `+ 1` w tekście wyświetlanym na ekranie, ale nigdy nie zmieniaj samej zmiennej sterującej.

## 🚀 Samodzielne zadanie: masowa akcja Wyprzedaż -20%

Zbuduj obsługę przycisku przeceny w panelu sklepu. Na stronie znajduje się przycisk `#btn-promocja`, cztery karty z klasą `.produkt` oraz pole informacyjne `#liczba-produktow`.

Napisz od zera skrypt, który po kliknięciu przycisku `#btn-promocja`:
1. pobierze wszystkie karty `.produkt` metodą `document.querySelectorAll(".produkt")`,
2. przejdzie po nich pętlą `.forEach` z funkcją strzałkową,
3. każdej karcie doda klasę `przecena` za pomocą `classList.add("przecena")` oraz dopisze do jej tekstu etykietę `-20%` (na przykład `produkt.textContent += " (-20%)"`),
4. w elemencie `#liczba-produktow` wypisze komunikat zawierający liczbę przecenionych kart odczytaną przez `.length`.

Po uruchomieniu kodu kliknij przycisk w zakładce podglądu DOM i sprawdź, czy wszystkie cztery produkty zmieniły kolor i otrzymały etykietę.

<data-gate>
<data-code-runner language="javascript" sandbox="dom" title="Masowa akcja: Wyprzedaż -20%">
<template data-type="html">
<style>
  .sklep { font-family: system-ui, sans-serif; padding: 14px; background: #0f172a; color: #f8fafc; border-radius: 10px; }
  .sklep-bar { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
  #btn-promocja { padding: 8px 14px; background: #ea580c; color: #fff; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
  #btn-promocja:hover { background: #c2410c; }
  #liczba-produktow { font-size: 13px; color: #cbd5e1; margin: 0; }
  .siatka { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .produkt { padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
  .produkt.przecena { background: #431407; border-color: #f97316; color: #ffedd5; font-weight: 600; }
</style>
<div class="sklep">
  <div class="sklep-bar">
    <button id="btn-promocja" type="button">Aktywuj wyprzedaż -20%</button>
    <p id="liczba-produktow">Brak aktywnej promocji</p>
  </div>
  <div class="siatka">
    <div class="produkt">Klawiatura mechaniczna</div>
    <div class="produkt">Mysz bezprzewodowa</div>
    <div class="produkt">Słuchawki studyjne</div>
    <div class="produkt">Podkładka XL</div>
  </div>
</div>
</template>
<template data-type="code">
// 1. Pobierz przycisk #btn-promocja oraz akapit #liczba-produktow

// 2. Podepnij zdarzenie "click" do przycisku

// 3. Wewnątrz obsługi kliknięcia pobierz wszystkie .produkt przez querySelectorAll,
//    przejdź po nich pętlą forEach (dodaj klasę "przecena" i dopisz "-20%"),
//    a na końcu wypisz liczbę produktów (.length) w #liczba-produktow
</template>
<template data-type="requirements">
[
  {
    "id": "click-listener",
    "text": "Podpina nasłuchiwacz zdarzenia click do przycisku promocji",
    "type": "regex",
    "pattern": "addEventListener\\s*\\(\\s*[\"']click[\"']"
  },
  {
    "id": "qsa-produkt",
    "text": "Pobiera wszystkie elementy .produkt za pomocą querySelectorAll",
    "type": "regex",
    "pattern": "querySelectorAll\\s*\\(\\s*[\"']\\.produkt[\"']\\s*\\)"
  },
  {
    "id": "foreach-arrow",
    "text": "Przechodzi po kolekcji metodą forEach z funkcją strzałkową",
    "type": "regex",
    "pattern": "\\.forEach\\s*\\([^)]*=>"
  },
  {
    "id": "add-przecena",
    "text": "Dodaje klasę przecena każdemu produktowi przez classList.add",
    "type": "regex",
    "pattern": "classList\\.add\\s*\\(\\s*[\"']przecena[\"']\\s*\\)"
  },
  {
    "id": "label-discount",
    "text": "Dopisuje etykietę -20% do treści produktu",
    "type": "contains",
    "pattern": "-20%"
  },
  {
    "id": "show-length",
    "text": "Wykorzystuje właściwość .length do wyświetlenia liczby produktów",
    "type": "contains",
    "pattern": ".length"
  }
]
</template>
</data-code-runner>
</data-gate>

<details class="deep-dive">
<summary>🔬 Dla dociekliwych: statyczna NodeList, brak map/filter i wydajność DOM</summary>

<h4>Statyczna NodeList kontra żywa HTMLCollection</h4>
<p>Metoda <code>document.querySelectorAll</code> zwraca <strong>statyczną</strong> kolekcję <code>NodeList</code>. Działa ona jak zdjęcie z chwili wywołania. Jeśli chwilę później skrypt doda do strony nową kartę <code>.produkt</code> albo usunie starą, zapisana wcześniej zmienna <code>produkty</code> nadal będzie miała starą liczbę elementów.</p>
<p>Starsze metody, takie jak <code>document.getElementsByClassName</code>, zwracają <strong>żywą</strong> kolekcję <code>HTMLCollection</code>, która aktualizuje się automatycznie przy każdej zmianie w DOM. Żywa kolekcja potrafi jednak utrudnić debugowanie (na przykład gdy usuwasz elementy podczas pętli, zmieniając długość listy w locie), a do tego nie posiada metody <code>forEach</code>. Dlatego w nowoczesnym JavaScripcie domyślnym wyborem jest <code>querySelectorAll</code>.</p>

<h4>Dlaczego NodeList ma forEach, ale nie ma map ani filter</h4>
<p>Kolekcja <code>NodeList</code> wygląda w konsoli podobnie do tablicy, ponieważ ma indeksy <code>[0]</code>, <code>[1]</code> i właściwość <code>.length</code>. Technicznie nie jest jednak obiektem typu <code>Array</code>. Z tego powodu posiada metodę <code>forEach</code>, ale próba wywołania <code>produkty.filter(...)</code> albo <code>produkty.map(...)</code> zakończy się błędem <code>TypeError</code>.</p>
<p>Gdy w kolejnych modułach będziesz chciał przefiltrować elementy DOM metodami tablicowymi, wystarczy zamienić kolekcję na prawdziwą tablicę jednym wyrażeniem: <code>Array.from(produkty)</code> albo <code>[...produkty]</code>.</p>

<h4>Kiedy zapisywać kolekcję raz, a kiedy pobierać ją w kliknięciu</h4>
<p>Jeśli lista elementów w HTML jest stała od załadowania strony, pobranie jej raz na górze skryptu oszczędza przeglądarce powtarzania wyszukiwania. Jeśli jednak w trakcie działania aplikacji użytkownik może dodawać lub usuwać elementy (albo zmieniać ich klasy, jak w zadaniach z filtrowaniem aktywnych kart), wywołanie <code>querySelectorAll</code> wewnątrz funkcji kliknięcia gwarantuje, że pracujesz na aktualnym stanie strony.</p>

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Gdy potrzebujesz jednego konkretnego znacznika, użyj **document.querySelector** (pamiętaj o możliwym wyniku `null`). Gdy operujesz na grupie elementów, użyj **document.querySelectorAll**, które zawsze zwraca kolekcję _**NodeList**_ z właściwością `length`.
- Nigdy nie wywołuj `.classList` ani `.textContent` bezpośrednio na wyniku `querySelectorAll`. Kolekcja to kontener, więc taka operacja zawsze rzuci **_TypeError_**.
- Aby wykonać akcję na każdym elemencie z kolekcji, użyj `lista.forEach((element, indeks) => { ... })`. Pierwszy parametr to bieżący element HTML, a drugi (opcjonalny) to jego indeks liczony od zera.
- Jeśli pętla `forEach` nie przynosi efektu i nie pokazuje błędu, sprawdź `lista.length` w konsoli: wartość `0` najczęściej oznacza brak kropki przed nazwą klasy lub literówkę w selektorze.
