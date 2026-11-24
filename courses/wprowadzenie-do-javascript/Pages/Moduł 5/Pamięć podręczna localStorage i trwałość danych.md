# Pamięć podręczna localStorage i trwałość danych

Wszystkie zmienne definiowane w kodzie JavaScript istnieją wyłącznie w pamięci operacyjnej (RAM) bieżącej karty przeglądarki. Gdy użytkownik przejdzie do innej podstrony, odświeży widok klawiszem F5 lub zamknie okno, stan aplikacji bezpowrotnie znika. Aby zachować konfigurację użytkownika, historię działań, stan koszyka czy statystyki odwiedzin, musimy skorzystać z mechanizmów trwałego przechowywania danych po stronie klienta.

Podstawowym i najwygodniejszym narzędziem do tego celu jest interfejs `Web Storage API`, a w szczególności obiekt `localStorage`.

---

## 🏛️ Struktura interfejsu z pamięcią podręczną

Zbudujemy panel gracza, który rejestruje liczbę uruchomień witryny, zapamiętuje wybrany motyw graficzny (jasny lub ciemny) oraz pozwala zresetować zapisane dane:

```html
<div id="app-container" class="theme-light">
  <header>
    <h1>Strefa Gracza</h1>
    <button id="btn-toggle-theme" type="button">Przełącz motyw</button>
  </header>

  <main>
    <section class="stats-card">
      <h2>Twoje statystyki</h2>
      <p id="visit-display">Liczba wejść na stronę: wczytywanie...</p>
      <button id="btn-reset-data" type="button">Wyczyść pamięć podręczną</button>
    </section>
  </main>

  <footer>
    <p>Aplikacja webowa z lokalnym magazynem danych</p>
  </footer>
</div>
```

---

## 🧠 Mechanizmy trwałego zapisu danych w przeglądarce

### 💾 Obiekt localStorage i jego cykl życia

Obiekt `window.localStorage` udostępnia prosty magazyn typu klucz-wartość przypisany do konkretnego źródła (protokół + domena + port). Dane zapisane w `localStorage` nie wygasają po zamknięciu karty czy wyłączeniu komputera - pozostają nienaruszone, dopóki skrypt lub sam użytkownik nie usunie ich z pamięci podręcznej.

Najważniejsze metody interfejsu:

* `localStorage.setItem(klucz, wartość)` - zapisuje lub aktualizuje wartość przypisaną do podanego klucza.
* `localStorage.getItem(klucz)` - pobiera wartość powiązaną z kluczem. Jeśli klucz nie istnieje, zwraca wartość `null`.
* `localStorage.removeItem(klucz)` - usuwa konkretny klucz wraz z jego zawartością.
* `localStorage.clear()` - usuwa wszystkie wpisy przypisane do bieżącej domeny.

```javascript
// Zapisanie danych w pamięci przeglądarki
localStorage.setItem("user_nickname", "CyberKoala");

// Odczytanie wartości
const nickname = localStorage.getItem("user_nickname");
console.log(nickname); // "CyberKoala"
```

### ⚠️ Pułapka rzutowania typów i obsługa wartości null

Najważniejszą cechą `localStorage` jest to, że **zawsze przechowuje wyłącznie ciągi znaków (`DOMString`)**. Nawet jeśli przekażesz do metody `setItem` liczbę lub wartość logiczną, przeglądarka dokona niejawnej konwersji do tekstu:

```javascript
localStorage.setItem("score", 150);
const savedScore = localStorage.getItem("score");

console.log(typeof savedScore); // "string"! (nie "number")
console.log(savedScore + 10);   // "15010" - nastąpiła konkatenacja tekstu!
```

Aby bezpiecznie operować na danych liczbowych:
1. Zawsze jawnie rzutuj odczytany tekst na liczbę za pomocą `Number()` lub `parseInt()`.
2. Zawsze weryfikuj, czy odczytany klucz nie jest równy `null` (czyli sytuacja pierwszego uruchomienia aplikacji na danym urządzeniu).

```javascript
const rawVisits = localStorage.getItem("visits_count");
let visits = 0;

if (rawVisits !== null) {
  visits = parseInt(rawVisits, 10);
}

// Zwiększamy licznik i zapisujemy zaktualizowaną wartość
visits += 1;
localStorage.setItem("visits_count", String(visits));
```

### 🚀 Bezpieczna inicjalizacja stanu podczas ładowania DOM

Kod odczytujący dane z magazynu i aktualizujący elementy HTML powinien wykonywać się natychmiast po zbudowaniu drzewa DOM, aby użytkownik nie doświadczył nieprzyjemnego migania interfejsu (tzw. FOUC - Flash of Unstyled Content). Używamy do tego zdarzenia `DOMContentLoaded` na obiekcie `document` lub `onload` na obiekcie `window`:

```javascript
window.addEventListener("DOMContentLoaded", () => {
  // Wczytanie zapisanego motywu
  const savedTheme = localStorage.getItem("selected_theme");
  const appContainer = document.querySelector("#app-container");

  if (savedTheme === "dark") {
    appContainer.classList.remove("theme-light");
    appContainer.classList.add("theme-dark");
  }
});
```

---

## 🎯 Sprawdź swoją wiedzę

<data-quiz>
  <question>
Co zwraca wywołanie metody `localStorage.getItem("wynik")`, jeśli klucz `"wynik"` nigdy wcześniej nie został zapisany w przeglądarce?
  </question>
  <options>
    <option correct>Wartość `null`, oznaczającą brak wpisu pod wskazanym kluczem w magazynie</option>
    <option>Pusty łańcuch znaków `""`, ponieważ magazyn zawsze zwraca typ String</option>
    <option>Wartość liczbową `0`, aby umożliwić bezpieczne operacje matematyczne</option>
    <option>Wartość `undefined`, tak jak przy próbie odczytu nieistniejącej własności obiektu</option>
  </options>
</data-quiz>

<data-connection-matcher title="Dopasuj operację na localStorage do jej przeznaczenia">
  <div class="cmw-item" data-left="`localStorage.setItem('k', 'v')`" data-right="Zapisuje lub aktualizuje wartość tekstową pod kluczem"></div>
  <div class="cmw-item" data-left="`localStorage.getItem('k')`" data-right="Odczytuje ciąg znaków lub zwraca null w razie braku wpisu"></div>
  <div class="cmw-item" data-left="`localStorage.removeItem('k')`" data-right="Usuwa wyłącznie wskazany klucz z magazynu domeny"></div>
  <div class="cmw-item" data-left="`localStorage.clear()`" data-right="Usuwa bezpowrotnie wszystkie klucze zapisane w danej domenie"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Menedżer rekordu gry zręcznościowej

Twoim zadaniem jest zaimplementowanie funkcji `evaluateHighScore(newScore, rawStoredRecord)`, która decyduje, jaki wynik powinien zostać zapisany w pamięci `localStorage`.

Wymagania:
1. `rawStoredRecord` to wartość zwrócona z `localStorage.getItem("best_score")` (czyli może być ciągiem znaków lub wartością `null`).
2. Jeśli `rawStoredRecord` to `null` lub nowy wynik `newScore` jest ściśle większy od dotychczasowego rekordu, funkcja powinna zwrócić nowy rekord jako ciąg znaków (`String(newScore)`).
3. W przeciwnym razie funkcja powinna zwrócić dotychczasowy rekord bez zmian.

<data-gate>
  <data-code-runner language="javascript" title="Menedżer rekordu gry zręcznościowej">
    <template data-type="code">
function evaluateHighScore(newScore, rawStoredRecord) {
  // TODO: Zaimplementuj obsługę zapisu rekordu:
  // 1. Jeśli rawStoredRecord to null -> zwróć String(newScore)
  // 2. Jeśli newScore > parseInt(rawStoredRecord, 10) -> zwróć String(newScore)
  // 3. W przeciwnym razie zwróć dotychczasowy rawStoredRecord
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-first-record",
          "text": "Pierwszy zapis rekordu (wcześniej null): zwraca nowy rekord jako string '50'",
          "type": "test-case",
          "functionName": "evaluateHighScore",
          "input": [50, null],
          "expected": "50"
        },
        {
          "id": "test-higher-score",
          "text": "Pobicie dotychczasowego rekordu (120 > '100'): zwraca '120'",
          "type": "test-case",
          "functionName": "evaluateHighScore",
          "input": [120, "100"],
          "expected": "120"
        },
        {
          "id": "test-lower-score",
          "text": "Wynik niższy od rekordu (80 <= '100'): pozostawia stary wynik '100'",
          "type": "test-case",
          "functionName": "evaluateHighScore",
          "input": [80, "100"],
          "expected": "100"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🛠️ Zadanie projektowe - Licznik wejść i trwały motyw witryny

Wracamy do interfejsu Strefy Gracza przedstawionego na początku lekcji. Zaimplementuj pełną logikę odczytu, aktualizacji i czyszczenia pamięci `localStorage` według poniższych kroków.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Inicjalizacja licznika odwiedzin podczas startu**: Zdefiniuj funkcję `updateVisitCounter()`, która pobiera z `localStorage` wartość klucza `"player_visits"`. Jeśli wartość to `null`, ustawia zmienną na 0, w przeciwnym razie rzutuje na liczbę za pomocą `parseInt()`. Zwiększ wartość o 1, zapisz ją z powrotem w pamięci za pomocą `setItem()` i wyświetl w elemencie `#visit-display` napis: `Liczba wejść na stronę: X`.
2. **Obsługa trwałego motywu kolorystycznego**: Zdefiniuj funkcję `initTheme()`, która czyta klucz `"player_theme"`. Jeśli zapisano `"dark"`, nadaj elementowi `#app-container` klasę `theme-dark`. Do przycisku `#btn-toggle-theme` przypisz zdarzenie `click`, które na przemian zmienia klasy oraz utrwala stan `"dark"` lub `"light"` w pamięci.
3. **Czyszczenie danych aplikacji**: Do przycisku `#btn-reset-data` przypisz kliknięcie, które usuwa klucze za pomocą `removeItem()` lub `clear()`, przywraca domyślny motyw oraz informuje o zresetowaniu statystyk.

Spróbuj napisać rozwiązanie samodzielnie w edytorze kodu. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
const appContainer = document.querySelector("#app-container");
const visitDisplay = document.querySelector("#visit-display");
const btnToggleTheme = document.querySelector("#btn-toggle-theme");
const btnReset = document.querySelector("#btn-reset-data");

function updateVisitCounter() {
  const storedVisits = localStorage.getItem("player_visits");
  let visitsCount = 0;

  if (storedVisits !== null) {
    visitsCount = parseInt(storedVisits, 10);
  }

  visitsCount += 1;
  localStorage.setItem("player_visits", String(visitsCount));

  if (visitDisplay) {
    visitDisplay.textContent = `Liczba wejść na stronę: ${visitsCount}`;
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("player_theme");
  if (savedTheme === "dark") {
    appContainer.classList.remove("theme-light");
    appContainer.classList.add("theme-dark");
  } else {
    appContainer.classList.remove("theme-dark");
    appContainer.classList.add("theme-light");
  }
}

btnToggleTheme.addEventListener("click", () => {
  const isDark = appContainer.classList.contains("theme-dark");
  if (isDark) {
    appContainer.classList.remove("theme-dark");
    appContainer.classList.add("theme-light");
    localStorage.setItem("player_theme", "light");
  } else {
    appContainer.classList.remove("theme-light");
    appContainer.classList.add("theme-dark");
    localStorage.setItem("player_theme", "dark");
  }
});

btnReset.addEventListener("click", () => {
  localStorage.removeItem("player_visits");
  localStorage.removeItem("player_theme");
  appContainer.classList.remove("theme-dark");
  appContainer.classList.add("theme-light");
  visitDisplay.textContent = "Pamięć podręczna wyczyszczona. Zresetowano licznik.";
});

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateVisitCounter();
});
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Obiekt `localStorage` przechowuje dane w sposób trwały w przeglądarce użytkownika bez terminu wygaśnięcia.
- Każda wartość w `localStorage` jest automatycznie konwertowana do typu tekstowego (`DOMString`), co wymaga jawnego rzutowania (`parseInt`, `Number`) przy operacjach na liczbach.
- Metoda `getItem()` zwraca wartość `null`, gdy dany klucz nie istnieje - należy to wykorzystywać do wykrywania pierwszego uruchomienia aplikacji.
- Metody `removeItem()` oraz `clear()` pozwalają precyzyjnie lub całościowo usuwać wpisy z pamięci lokalnej.
- Synchronizację stanu z interfejsem użytkownika najlepiej przeprowadzać podczas zdarzenia `DOMContentLoaded`.
