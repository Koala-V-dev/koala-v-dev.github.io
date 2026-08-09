# Pierwszy plik ES6, Moduły import-export i DOM

W tym kursie nauczysz się pisać nowoczesny JavaScript (ES6+) **poprzez budowanie małych, realnych interaktywnych projektów**. Zamiast zaczynać od skomplikowanych narzędzi, uruchomimy modułowy kod bezpośrednio w przeglądarce za pomocą natywnego standardu **ES6 Modules**.

W tej lekcji zbudujemy **Mini-projekt 1: Interaktywny Kalkulator Rachunków i Napiwków**.

---

## 🧠 Model mentalny: Jak działają natywne moduły ES6 w przeglądarce?

Dawniej cały kod JavaScript pisano w jednym wielkim pliku lub łączono osobnymi znacznikami `<script>`. Prowadziło to do bałaganu i konfliktów zmiennych globalnych.

Nowoczesne przeglądarki obsługują moduły natywnie dzięki atrybutowi **`type="module"`**.

```mermaid
graph TD
    HTML["Plik index.html <script type='module' src='app.js'>"] -->|Ładuje moduł główny| AppJS[app.js]
    AppJS -->|import { calculate } from| CalcJS[calculator.js]
    AppJS -->|import { render } from| UIJS[ui.js]
```

- Każdy plik `.js` staje się **osobnym modułem**. Zmienne wewnątrz pliku są prywatne.
- Udostępniamy funkcje za pomocą słowa **`export`**, a pobieramy za pomocą **`import`**.

---

## ⚙️ Krok 1: Struktura plików projektu w XAMPP / przeglądarce

Stwórzmy nowy folder w swoim środowisku:
`C:\xampp\htdocs\kalkulator-js\`

Stwórz w nim dwa pliki:
1. `index.html`
2. `calculator.js`
3. `app.js`

### Plik `index.html`:
```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kalkulator Rachunków ES6</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 400px; margin: 2rem auto; padding: 1rem; }
        .field { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.25rem; font-weight: bold; }
        input { width: 100%; padding: 0.5rem; }
        .result-box { background: #f1f5f9; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    </style>
</head>
<body>
    <h1>Kalkulator Rachunku</h1>
    
    <div class="field">
        <label for="bill-amount">Kwota rachunku (PLN):</label>
        <input type="number" id="bill-amount" value="100">
    </div>

    <div class="field">
        <label for="tip-percent">Napiwek (%):</label>
        <input type="number" id="tip-percent" value="15">
    </div>

    <div class="result-box" id="result-output">
        Wygeneruj wynik...
    </div>

    <!-- Podpinamy moduł główny z type="module" -->
    <script type="module" src="app.js"></script>
</body>
</html>
```

---

## ⚙️ Krok 2: Moduł obliczeniowy (`calculator.js`) i rozbicie składni

Otwórz plik `calculator.js`. Będzie on zawierał czystą logikę przeliczania wartości:

```javascript
/**
 * Oblicza całkowitą kwotę wraz z napiwkiem
 * @param {number} bill
 * @param {number} tipPercent
 * @return {number}
 */
export function calculateTotal(bill, tipPercent) {
  const tipAmount = bill * (tipPercent / 100);
  return bill + tipAmount;
}
```

### 🔍 Wyjaśnienie składni JavaScript od zera (Linia po linii):

- **`export function`** — Słowo `export` pozwala na użycie tej funkcji w innych plikach projektu. Słowo `function` definiuje nową funkcję.
- **`calculateTotal(bill, tipPercent)`** — Nazwa funkcji i dwa parametry wejściowe.
- **`const tipAmount`** — Słowo **`const`** tworzy zmienną stałą. W wartościach, których nie będziesz modyfikować przez ponowne przypisanie (`=`), **zawsze używaj `const`**.
- **`return`** — Zwraca wynik obliczenia z funkcji.

---

## ⚙️ Krok 3: Moduł główny i obsługa DOM (`app.js`)

Teraz w pliku `app.js` zaimportujemy naszą funkcję i podepniemy dynamiczną obsługę zdarzeń:

```javascript
// Importujemy funkcję z drugiego modułu ES6 (Pamiętaj o rozszerzeniu .js!)
import { calculateTotal } from './calculator.js';

// 1. Pobieramy elementy z drzewa DOM
const billInput = document.querySelector('#bill-amount');
const tipInput = document.querySelector('#tip-percent');
const resultOutput = document.querySelector('#result-output');

// 2. Funkcja odświeżająca widok
const updateUI = () => {
  const bill = parseFloat(billInput.value) || 0;
  const tip = parseFloat(tipInput.value) || 0;

  const total = calculateTotal(bill, tip);

  // Wstawiamy wygenerowany tekst do elementu HTML
  resultOutput.innerHTML = `
    <p>Napiwek: <strong>${(total - bill).toFixed(2)} PLN</strong></p>
    <p>Do zapłaty łącznie: <strong>${total.toFixed(2)} PLN</strong></p>
  `;
};

// 3. Rejestrujemy nasłuchiwacze zdarzeń
billInput.addEventListener('input', updateUI);
tipInput.addEventListener('input', updateUI);

// Pierwsze wywołanie na start
updateUI();
```

---

## 🛠️ Interaktywne Wyzwanie Programistyczne (Web Challenge)

Napisz własną regułę CSS oraz dopasuj podgląd kalkulatora w edytorze poniżej:

<data-gate>
  <data-web-challenge id="js-es6-dom-challenge">
    <template data-type="html">
<div class="result-box" id="result-output">
  <p>Łącznie: <strong class="total-price">115.00 PLN</strong></p>
</div>
    </template>
    
    <template data-type="css-readonly">
.result-box {
  padding: 1rem;
  border-radius: 8px;
}
    </template>
    
    <template data-type="css">
/* Wpisz reguły dla elementu .result-box oraz .total-price */
.result-box {
  background-color: #f1f5f9;
}
.total-price {
  color: #2563eb;
}
    </template>
    
    <template data-type="requirements">
      [
        {"id": "bg-color", "text": "Ustaw kolor tła .result-box na #f1f5f9", "type": "selector-css", "selector": ".result-box", "property": "background-color", "value": "#f1f5f9"},
        {"id": "price-color", "text": "Ustaw kolor tekstu .total-price na #2563eb", "type": "selector-css", "selector": ".total-price", "property": "color", "value": "#2563eb"}
      ]
    </template>
  </data-web-challenge>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>Executive Summary</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Moduły natywne podpinasz w HTML za pomocą **`<script type="module" src="...">`**.
- Używasz **`export`** do udostępniania i **`import { x } from './file.js'`** do pobierania funkcji.
- Zmienne stałe tworzysz słowem **`const`**, a funkcje zapisujesz jako funkcje strzałkowe **`() => {}`**.
