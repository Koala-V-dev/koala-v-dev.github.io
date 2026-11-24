# Karuzela zdjęć i cykliczne indeksowanie

Większość serwisów internetowych - od portali informacyjnych, przez sklepy online, po aplikacje społecznościowe - prezentuje treści w formie interaktywnych karuzel (sliderów). Użytkownik przegląda kolejne slajdy za pomocą strzałek w lewo i w prawo, a interfejs płynnie wymienia grafikę bez odświeżania całej strony.

W tej lekcji zaczniemy od szkieletu galerii zdjęć, zrozumiemy model pamięciowy tablic w JavaScript i przyczynę indeksowania od zera, zbadamy algorytm cyklicznego zawijania indeksów w obu kierunkach, rozwiążemy wyzwanie w edytorze kodu na przykładzie odtwarzacza muzycznego, a na koniec samodzielnie ożywimy karuzelę zdjęć.

---

## 🏗️ Punkt wyjścia: Szkielet HTML karuzeli zdjęć

Oto kod HTML prostej galerii z centralnym zdjęciem i przyciskami nawigacyjnymi:

```html
<section id="galeria">
  <h2>Zwiedzamy Polskę</h2>
  
  <div class="kontener-karuzeli">
    <button id="btn-prev" aria-label="Poprzednie zdjęcie">&lt;</button>
    <img id="obraz-glowny" src="1.jpg" alt="Aktywne zdjęcie">
    <button id="btn-next" aria-label="Następne zdjęcie">&gt;</button>
  </div>
</section>
```

Wymagania biznesowe:
- Posiadamy 7 plików graficznych: od `1.jpg` do `7.jpg`.
- Początkowo wyświetlane jest zdjęcie pierwsze (`1.jpg`).
- Kliknięcie przycisku `>` (następny) przełącza zdjęcie na kolejne (`2.jpg`, `3.jpg` itd.).
- Gdy wyświetla się ostatnie zdjęcie (`7.jpg`), kliknięcie `>` ma zapętlić galerię i wrócić do zdjęcia pierwszego (`1.jpg`).
- Kliknięcie przycisku `<` (poprzedni) cofa zdjęcie, a z pierwszego (`1.jpg`) przeskakuje na ostatnie (`7.jpg`).

---

## 🗃️ Tablice w JavaScript: dlaczego indeksujemy od zera?

Gdy chcemy przechować uporządkowaną listę elementów, tworzymy **tablicę** (`Array`):

```javascript
const zdjecia = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"];
```

W języku JavaScript elementy tablicy są indeksowane od **zera**, a nie od jedynki. Wynika to z historii architektury komputerowej: indeks nie jest numerem porządkowym, lecz **przesunięciem (offsetem) w pamięci RAM** względem początku tablicy:
- `zdjecia[0]` oznacza: *weź element z zerowym przesunięciem* (pierwszy element: `"1.jpg"`).
- `zdjecia[1]` oznacza: *przesuń się o jeden krok w pamięci* (drugi element: `"2.jpg"`).
- Ostatni poprawny element ma indeks **`zdjecia.length - 1`** (dla 7 elementów jest to indeks `6`).

### ⚠️ Pułapka wyjścia poza zakres
Co się stanie, gdy odpytasz tablicę o indeks równy jej długości?
```javascript
console.log(zdjecia[7]); // undefined!
```
W przeciwieństwie do innych języków (np. C++ czy Javy), JavaScript nie wyrzuci błędu krytycznego, lecz po cichu zwróci wartość **`undefined`**. W efekcie przeglądarka spróbuje załadować obrazek o adresie `undefined` i wyświetli ikonę uszkodzonego pliku!

<data-gate>
  <data-quiz>
    <question>
Co zwróci wyrażenie zdjecia[zdjecia.length] dla 7-elementowej tablicy w JavaScript?
    </question>
    <options>
      <option correct>Zwróci wartość undefined, ponieważ ostatni poprawny indeks to length - 1</option>
      <option>Zwróci ostatni element tablicy, ponieważ długość wskazuje na koniec kolekcji</option>
      <option>Zgłosi błąd IndexError i natychmiast zatrzyma wykonywanie całego skryptu</option>
      <option>Zwróci pierwszy element z tablicy, automatycznie zawijając indeks do zera</option>
    </options>
    <div data-hint="error">
Pamiętaj o przesunięciu: tablica o 7 elementach ma indeksy od 0 do 6. Indeks o numerze 7 leży już poza granicami tablicy.
    </div>
    <div data-hint="success">
Świetnie! Tablica o długości 7 posiada elementy pod indeksami 0, 1, 2, 3, 4, 5, 6. Indeks o numerze 7 nie istnieje i odpytanie go zwraca wartość undefined.
    </div>
  </data-quiz>
</data-gate>

---

## 🔄 Algorytm bufora cyklicznego (Circular Buffer)

Aby nasza karuzela działała w nieskończoność bez wychodzenia poza zakres tablicy, musimy zaimplementować cykliczne zawijanie indeksu.

Wyobraź sobie tablicę wygiętą w pierścień: za ostatnim elementem znajduje się pierwszy, a przed pierwszym - ostatni.

```
       [0] 1.jpg
      /         \
 [6] 7.jpg     [1] 2.jpg
    |             |
 [5] 6.jpg     [2] 3.jpg
      \         /
       [4] 5.jpg --- [3] 4.jpg
```

### ⏩ Ruch w prawo (następny slajd)
Zwiększamy indeks o 1. Jeśli osiągnie wartość równą długości tablicy, natychmiast zerujemy licznik:
```javascript
aktualnyIndeks = aktualnyIndeks + 1;

if (aktualnyIndeks >= zdjecia.length) {
  aktualnyIndeks = 0; // Wracamy na start
}
```

### ⏪ Ruch w lewo (poprzedni slajd)
Zmniejszamy indeks o 1. Jeśli spadnie poniżej zera, przeskakujemy na ostatni indeks:
```javascript
aktualnyIndeks = aktualnyIndeks - 1;

if (aktualnyIndeks < 0) {
  aktualnyIndeks = zdjecia.length - 1; // Przeskakujemy na sam koniec
}
```

<data-gate>
  <data-connection-matcher title="Operacje indeksowania na tablicach">
    <div class="cmw-item" data-left="tablica[0]" data-right="Odczytuje pierwszy element znajdujący się na początku kolekcji"></div>
    <div class="cmw-item" data-left="tablica[tablica.length - 1]" data-right="Bezpiecznie odczytuje ostatni istniejący element w tablicy"></div>
    <div class="cmw-item" data-left="indeks >= tablica.length" data-right="Warunek wykrywający przekroczenie prawego krańca tablicy"></div>
    <div class="cmw-item" data-left="indeks < 0" data-right="Warunek wykrywający spadek poniżej pierwszego elementu tablicy"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Nawigator playlisty muzycznej

Zastosujmy mechanizm cyklicznego indeksowania na niezależnym problemie inżynierskim: odtwarzaczu muzycznym (Music Player).

Odtwarzacz posiada listę utworów i pozwala przełączać piosenki przyciskami „Następna” oraz „Poprzednia”.

Twoim celem jest oprogramowanie funkcji `zmienUtwor`.

Wymagania biznesowe:
- Parametr `liczbaUtworow`: całkowita liczba utworów na playliście (liczba dodatnia).
- Parametr `aktualnyIndeks`: numer aktualnie odtwarzanego utworu (od 0 do `liczbaUtworow - 1`).
- Parametr `kierunek`: ciąg znaków `"next"` lub `"prev"`.
- Jeśli `liczbaUtworow <= 0` $\to$ zwróć `0`.
- Dla kierunku `"next"`: zwiększ indeks o 1. Jeśli indeks osiągnie lub przekroczy `liczbaUtworow`, funkcja musi zwrócić `0` (zapętlenie na start).
- Dla kierunku `"prev"`: zmniejsz indeks o 1. Jeśli indeks spadnie poniżej 0, funkcja musi zwrócić `liczbaUtworow - 1` (zapętlenie na koniec).
- Zwracana wartość: nowy poprawny indeks utworu jako liczba całkowita.

<data-gate>
  <data-code-runner language="javascript" title="Nawigator utworów odtwarzacza">
    <template data-type="code">
function zmienUtwor(liczbaUtworow, aktualnyIndeks, kierunek) {
  // TODO: Zaimplementuj cykliczną zmianę indeksu w prawo i w lewo.
  // Pamiętaj: wynik musi zawsze mieścić się w przedziale od 0 do liczbaUtworow - 1!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-next-srodek",
          "text": "Następny ze środka (utwór 2 przy 5 utworach -> 3)",
          "type": "test-case",
          "functionName": "zmienUtwor",
          "input": [5, 2, "next"],
          "expected": 3
        },
        {
          "id": "test-next-zapetlenie",
          "text": "Następny z ostatniego utworu (indeks 4 przy 5 utworach) zapętla na 0",
          "type": "test-case",
          "functionName": "zmienUtwor",
          "input": [5, 4, "next"],
          "expected": 0
        },
        {
          "id": "test-prev-srodek",
          "text": "Poprzedni ze środka (utwór 3 przy 5 utworach -> 2)",
          "type": "test-case",
          "functionName": "zmienUtwor",
          "input": [5, 3, "prev"],
          "expected": 2
        },
        {
          "id": "test-prev-zapetlenie",
          "text": "Poprzedni z pierwszego utworu (indeks 0 przy 5 utworach) zapętla na 4",
          "type": "test-case",
          "functionName": "zmienUtwor",
          "input": [5, 0, "prev"],
          "expected": 4
        },
        {
          "id": "test-pusta-playlista",
          "text": "Brak utworów (0) zwraca 0",
          "type": "test-case",
          "functionName": "zmienUtwor",
          "input": [0, 0, "next"],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🖼️ Projekt końcowy: Ożywiamy karuzelę zdjęć

Wracamy do naszego szablonu galerii z początku lekcji:

```html
<button id="btn-prev">&lt;</button>
<img id="obraz-glowny" src="1.jpg" alt="Aktywne zdjęcie">
<button id="btn-next">&gt;</button>
```

Struktura danych:
```javascript
const zdjecia = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"];
let aktualnyIndeks = 0;
```

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz referencje do obrazka `#obraz-glowny` oraz przycisków `#btn-prev` i `#btn-next`.
2. Zadeklaruj tablicę z nazwami plików oraz zmienną `let aktualnyIndeks = 0`.
3. Napisz funkcję `wyswietlZdjecie()`, która ustawi właściwość `obraz.src = zdjecia[aktualnyIndeks]`.
4. Podepnij zdarzenie click pod `#btn-next`:
   - Zwiększ `aktualnyIndeks` o 1.
   - Jeśli indeks przekroczy zakres tablicy (`>= zdjecia.length`), ustaw go na 0.
   - Wywołaj `wyswietlZdjecie()`.
5. Podepnij zdarzenie click pod `#btn-prev`:
   - Zmniejsz `aktualnyIndeks` o 1.
   - Jeśli indeks spadnie poniżej 0, ustaw go na `zdjecia.length - 1`.
   - Wywołaj `wyswietlZdjecie()`.

Spróbuj napisać ten kod samodzielnie. Po zakończeniu próby sprawdź poniższy kod referencyjny.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Definiujemy tablicę zasobów i stan początkowy
const zdjecia = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg"];
let aktualnyIndeks = 0;

// 2. Pobieramy elementy z DOM
const obraz = document.querySelector("#obraz-glowny");
const btnPrev = document.querySelector("#btn-prev");
const btnNext = document.querySelector("#btn-next");

// 3. Funkcja pomocnicza aktualizująca atrybut src w DOM
function odswiezWidok() {
  obraz.src = zdjecia[aktualnyIndeks];
}

// 4. Obsługa przejścia do następnego zdjęcia
btnNext.addEventListener("click", () => {
  aktualnyIndeks++;
  if (aktualnyIndeks >= zdjecia.length) {
    aktualnyIndeks = 0; // Zapętlenie na początek
  }
  odswiezWidok();
});

// 5. Obsługa przejścia do poprzedniego zdjęcia
btnPrev.addEventListener("click", () => {
  aktualnyIndeks--;
  if (aktualnyIndeks < 0) {
    aktualnyIndeks = zdjecia.length - 1; // Zapętlenie na koniec
  }
  odswiezWidok();
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Elementy tablicy w JavaScript są indeksowane od 0 do `length - 1`.
- Odpytanie nieistniejącego indeksu zwraca `undefined`, co przy adresach URL grafik prowadzi do błędu ładowania obrazu.
- Algorytm zapętlenia w prawo weryfikujemy warunkiem `indeks >= length` i przypisaniem `0`.
- Algorytm zapętlenia w lewo weryfikujemy warunkiem `indeks < 0` i przypisaniem `length - 1`.
- Dynamiczną podmianę grafiki na stronie realizujemy poprzez przypisanie nowej ścieżki do właściwości `img.src`.
