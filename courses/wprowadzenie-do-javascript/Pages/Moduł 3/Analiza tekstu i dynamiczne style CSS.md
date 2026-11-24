# Analiza tekstu i dynamiczne style CSS

Aplikacje internetowe stają się naprawdę angażujące wtedy, gdy natychmiast reagują wizualnie na to, co wpisuje użytkownik. Wskaźniki jakości hasła, weryfikatory kodów pocztowych czy dynamiczne podświetlenia błędów w formularzach dają użytkownikowi natychmiastową informację zwrotną za pomocą koloru tekstu i obramowania.

W tej lekcji zaczniemy od formularza weryfikatora hasła, zrozumiemy jak JavaScript analizuje ciągi znaków w pamięci i jak działa obiekt `style`, rozwiążemy wyzwanie w edytorze kodu na przykładzie walidatora kodów promocyjnych, a na koniec samodzielnie zaprogramujemy pełną logikę analizy hasła z kolorowaniem statusu.

---

## 🏗️ Punkt wyjścia: Formularz weryfikacji hasła

Oto kod HTML formularza sprawdzania jakości hasła:

```html
<section id="panel-hasla">
  <h2>Weryfikator jakości hasła</h2>
  
  <label for="input-haslo">Podaj hasło:</label><br>
  <input type="password" id="input-haslo"><br>
  
  <button id="btn-weryfikuj">Weryfikuj</button>
  <p id="tekst-wynik"></p>
</section>
```

Założenia logiki:
- Jeśli pole jest puste $\to$ tekst **`WPISZ HASŁO`**, kolor czcionki **czerwony** (`red`).
- Jeśli długość $\ge 7$ znaków i zawiera przynajmniej jedną cyfrę $\to$ tekst **`DOBRE`**, kolor czcionki **zielony** (`green`).
- Jeśli długość od 4 do 6 znaków i zawiera przynajmniej jedną cyfrę $\to$ tekst **`ŚREDNIE`**, kolor czcionki **niebieski** (`blue`).
- W pozostałych przypadkach (np. brak cyfry lub długość $< 4$) $\to$ tekst **`SŁABE`**, kolor czcionki **żółty** (`yellow`).

Aby to osiągnąć, nasz skrypt musi rozwiązać dwa problemy: zbadać zawartość tekstu oraz dynamicznie zmienić styl CSS akapitu w drzewie DOM.

---

## 🔍 Wnętrze stringa: długość i wykrywanie cyfr

Ciąg znaków w JavaScript jest indeksowaną sekwencją znaków. Liczbę znaków odczytujemy za pomocą właściwości **`.length`**:

```javascript
const haslo = "Sekret123";
console.log(haslo.length); // 9
```

Do pojedynczych znaków mamy dostęp za pomocą nawiasów kwadratowych: `haslo[0]` to `"S"`, a `haslo[haslo.length - 1]` to ostatni znak (`"3"`).

### 🔁 Pętla po znakach a kody ASCII
Możemy przejść po całym tekście pętlą `for` i porównać znaki:
```javascript
let maCyfre = false;

for (let i = 0; i < haslo.length; i++) {
  const znak = haslo[i];
  if (znak >= "0" && znak <= "9") {
    maCyfre = true;
    break; // Przerywamy pętlę w momencie znalezienia pierwszej cyfry
  }
}
```

### ⚡ Nowoczesny zapis: wyrażenie regularne
Zamiast pisać pętlę, możemy użyć zwięzłego wyrażenia regularnego:
```javascript
const maCyfre = /\d/.test(haslo);
```
Symbol `\d` oznacza dowolną cyfrę (od 0 do 9). Metoda `.test()` sprawdza, czy wzorzec występuje w zadanym tekście i zwraca `true` lub `false`.

---

## 🎨 Obiekt style i zasada camelCase

Gdy pobierzesz element z drzewa DOM, przeglądarka udostępnia obiekt **`element.style`**, który reprezentuje jego style inline:

```javascript
const akapit = document.querySelector("#tekst-wynik");

akapit.textContent = "DOBRE";
akapit.style.color = "green";
```

### ⚠️ Reguła camelCase w JavaScript
W pliku CSS właściwości wielowyrazowe rozdzielamy myślnikiem (np. `background-color`, `font-size`, `border-radius`).

Jednak w JavaScript myślnik `-` jest operatorem odejmowania! Zapis `akapit.style.background-color` zostałby zinterpretowany jako próba odjęcia zmiennej `color` od właściwości `background`.

Dlatego w JavaScript wszystkie właściwości CSS zapisujemy w notacji **camelCase**:

| Styl w CSS | Właściwość w JavaScript |
| :--- | :--- |
| `color` | `element.style.color` |
| `background-color` | `element.style.backgroundColor` |
| `font-size` | `element.style.fontSize` |
| `font-weight` | `element.style.fontWeight` |

<data-gate>
  <data-quiz>
    <question>
Jak poprawnie zmienić kolor tła elementu w JavaScript za pomocą właściwości style?
    </question>
    <options>
      <option correct>element.style.backgroundColor = "red" (zapis w notacji camelCase)</option>
      <option>element.style.background-color = "red" (zapis z tradycyjnym myślnikiem CSS)</option>
      <option>element.style.background_color = "red" (zapis w notacji ze znakiem podkreślenia)</option>
      <option>element.style["background color"] = "red" (zapis ze spacją oddzielającą słowa)</option>
    </options>
    <div data-hint="error">
Pamiętaj, że w JavaScript myślnik jest operatorem matematycznym odejmowania, dlatego właściwości CSS pisane z myślnikiem zastępujemy notacją camelCase z wielką literą.
    </div>
    <div data-hint="success">
Doskonale! Notacja camelCase (np. backgroundColor, fontSize) to jedyny poprawny sposób bezpośredniego odwoływania się do wielowyrazowych stylów CSS przez obiekt style.
    </div>
  </data-quiz>
</data-gate>

---

## 🧩 Dopasuj metody operacji na stringach

Sprawdź swoją wiedzę o metodach i właściwościach ciągów znaków w JavaScript.

<data-gate>
  <data-connection-matcher title="Właściwości i metody ciągów znaków">
    <div class="cmw-item" data-left="tekst.length" data-right="Zwraca całkowitą liczbę znaków w danym ciągu tekstowym"></div>
    <div class="cmw-item" data-left="/\d/.test(tekst)" data-right="Sprawdza, czy w tekście znajduje się przynajmniej jedna cyfra"></div>
    <div class="cmw-item" data-left="tekst.toUpperCase()" data-right="Zwraca nową kopię napisu zapisaną wyłącznie wielkimi literami"></div>
    <div class="cmw-item" data-left="tekst[0]" data-right="Umożliwia bezpośredni odczyt pierwszego znaku w danym ciągu"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Walidator kodów promocyjnych

Zastosujmy analizę tekstu i zwracanie stylów na niezależnym problemie biznesowym: weryfikatorze kodów rabatowych w sklepie internetowym.

Klient wpisuje kod promocyjny, a system weryfikuje jego strukturę i zwraca obiekt ze statusem oraz kolorem komunikatu.

Twoim celem jest oprogramowanie funkcji `sprawdzKodPromocyjny`.

Zasady poprawności kodu:
- Parametr `kodStr`: ciąg znaków wpisany przez użytkownika.
- Jeśli `kodStr` jest pusty (`""`) $\to$ zwróć `{ poprawny: false, status: "WPISZ KOD", kolor: "red" }`.
- Kod musi mieć długość **dokładnie 8 znaków**. Jeśli ma inną długość $\to$ zwróć `{ poprawny: false, status: "ZŁA DŁUGOŚĆ", kolor: "red" }`.
- Kod musi zaczynać się od litery `"P"` lub `"R"` (np. `kodStr[0] === "P" || kodStr[0] === "R"`).
- Kod musi zawierać przynajmniej jedną cyfrę (`/\d/.test(kodStr)`).
- Jeśli kod ma 8 znaków, poprawny prefiks i zawiera cyfrę $\to$ zwróć `{ poprawny: true, status: "KOD AKTYWNY", kolor: "green" }`.
- W pozostałych przypadkach (np. zły prefiks lub brak cyfry przy 8 znakach) $\to$ zwróć `{ poprawny: false, status: "BŁĘDNY FORMAT", kolor: "orange" }`.

<data-gate>
  <data-code-runner language="javascript" title="Walidator kodów rabatowych">
    <template data-type="code">
function sprawdzKodPromocyjny(kodStr) {
  // TODO: Zaimplementuj walidację długości, prefiksu oraz obecności cyfry.
  // Zwróć obiekt { poprawny: boolean, status: string, kolor: string }.
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-poprawny-p",
          "text": "Kod 'PROMO123' ma 8 znaków, zaczyna się od P i ma cyfry -> KOD AKTYWNY (green)",
          "type": "test-case",
          "functionName": "sprawdzKodPromocyjny",
          "input": ["PROMO123"],
          "expected": {"poprawny": true, "status": "KOD AKTYWNY", "kolor": "green"}
        },
        {
          "id": "test-poprawny-r",
          "text": "Kod 'RABAT001' ma 8 znaków, zaczyna się od R i ma cyfry -> KOD AKTYWNY (green)",
          "type": "test-case",
          "functionName": "sprawdzKodPromocyjny",
          "input": ["RABAT001"],
          "expected": {"poprawny": true, "status": "KOD AKTYWNY", "kolor": "green"}
        },
        {
          "id": "test-pusty",
          "text": "Pusty ciąg zwraca status WPISZ KOD (red)",
          "type": "test-case",
          "functionName": "sprawdzKodPromocyjny",
          "input": [""],
          "expected": {"poprawny": false, "status": "WPISZ KOD", "kolor": "red"}
        },
        {
          "id": "test-zla-dlugosc",
          "text": "Kod o długości innej niż 8 ('PROMO1') zwraca ZŁA DŁUGOŚĆ (red)",
          "type": "test-case",
          "functionName": "sprawdzKodPromocyjny",
          "input": ["PROMO1"],
          "expected": {"poprawny": false, "status": "ZŁA DŁUGOŚĆ", "kolor": "red"}
        },
        {
          "id": "test-zly-format",
          "text": "Kod 8-znakowy bez cyfr ('PROMOXYZ') zwraca BŁĘDNY FORMAT (orange)",
          "type": "test-case",
          "functionName": "sprawdzKodPromocyjny",
          "input": ["PROMOXYZ"],
          "expected": {"poprawny": false, "status": "BŁĘDNY FORMAT", "kolor": "orange"}
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🔐 Projekt końcowy: Ożywiamy weryfikator hasła

Wracamy do naszego początkowego formularza hasła:

```html
<label for="input-haslo">Podaj hasło:</label><br>
<input type="password" id="input-haslo"><br>

<button id="btn-weryfikuj">Weryfikuj</button>
<p id="tekst-wynik"></p>
```

Kryteria weryfikacji:
1. Puste pole $\to$ tekst `"WPISZ HASŁO"`, kolor `red`.
2. Długość $\ge 7$ i ma cyfrę $\to$ tekst `"DOBRE"`, kolor `green`.
3. Długość od 4 do 6 i ma cyfrę $\to$ tekst `"ŚREDNIE"`, kolor `blue`.
4. W pozostałych sytuacjach $\to$ tekst `"SŁABE"`, kolor `yellow`.

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz referencje do pola hasła `#input-haslo`, przycisku `#btn-weryfikuj` oraz akapitu `#tekst-wynik`.
2. Zarejestruj nasłuchiwanie kliknięcia na przycisku.
3. Wewnątrz funkcji odczytaj wpisany tekst z właściwości `.value`.
4. Zbadaj długość napisu (`haslo.length`) oraz obecność cyfry (`/\d/.test(haslo)`).
5. Zbuduj drabinkę warunków `if / else if / else` według powyższych kryteriów. Pamiętaj, aby warunek pustego pola sprawdzić jako pierwszy!
6. Ustaw właściwość `textContent` akapitu na wyliczony status oraz przypisz odpowiedni kolor do właściwości `style.color`.

Spróbuj napisać ten kod samodzielnie. Dopiero po zakończeniu próby rozwiń poniższy kod referencyjny.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy z drzewa DOM
const inputHaslo = document.querySelector("#input-haslo");
const btnWeryfikuj = document.querySelector("#btn-weryfikuj");
const tekstWynik = document.querySelector("#tekst-wynik");

// 2. Rejestrujemy zdarzenie click
btnWeryfikuj.addEventListener("click", () => {
  // 3. Pobieramy wpisany ciąg znaków
  const haslo = inputHaslo.value;
  const dlugosc = haslo.length;
  const maCyfre = /\d/.test(haslo);

  // 4. Drabinka decyzyjna weryfikująca jakość hasła
  if (dlugosc === 0) {
    tekstWynik.textContent = "WPISZ HASŁO";
    tekstWynik.style.color = "red";
  } else if (dlugosc >= 7 && maCyfre) {
    tekstWynik.textContent = "DOBRE";
    tekstWynik.style.color = "green";
  } else if (dlugosc >= 4 && dlugosc <= 6 && maCyfre) {
    tekstWynik.textContent = "ŚREDNIE";
    tekstWynik.style.color = "blue";
  } else {
    tekstWynik.textContent = "SŁABE";
    tekstWynik.style.color = "yellow";
  }
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Długość ciągu tekstowego w JavaScript sprawdzamy za pomocą właściwości `.length`.
- Wyszukiwanie cyfry w tekście najwygodniej realizować zwięzłym wyrażeniem regularnym `/\d/.test(tekst)`.
- Właściwości stylów w obiekcie `element.style` zapisujemy w konwencji camelCase (np. `backgroundColor`, `fontSize`).
- W drabinkach walidacyjnych zawsze w pierwszej kolejności badamy stan pustego pola wejściowego, co zapobiega błędnemu zaliczeniu pustego tekstu do innych reguł.
