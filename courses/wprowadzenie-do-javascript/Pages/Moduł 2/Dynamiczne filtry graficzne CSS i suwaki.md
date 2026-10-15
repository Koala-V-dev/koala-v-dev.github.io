# Dynamiczne filtry graficzne CSS i suwaki

W nowoczesnych aplikacjach internetowych manipulacja wyglądem multimediów nie wymaga ponownego generowania plików graficznych po stronie serwera. Przeglądarki udostępniają silnik filtrów CSS, który pozwala w czasie rzeczywistym zmieniać nasycenie, rozmycie, kontrast, jasność czy odwracać kolory obrazu bez straty jakości oryginału.

W tej lekcji zbudujemy interaktywne studio fotograficzne, w którym użytkownik może modyfikować parametry grafiki za pomocą pól wyboru, przycisków akcji oraz płynnych suwaków zakresu (`range`).

---

## 🎨 Wizualny interfejs edytora obrazu

Zaczynamy od przygotowania struktury dokumentu HTML. Zwróć uwagę na zastosowanie pól typu `range` z określonymi atrybutami `min`, `max` i `value`, które posłużą do precyzyjnego sterowania filtrami:

```html
<main class="editor-container">
  <section class="viewport-panel">
    <img id="image-preview" src="widok.jpg" alt="Podgląd edycji fotografii" />
  </section>

  <aside class="controls-panel">
    <h3>Filtry predefiniowane</h3>
    <label><input type="radio" name="preset" value="none" checked /> Brak filtra</label>
    <label><input type="radio" name="preset" value="sepia" /> Klasyczna sepia</label>
    <label><input type="radio" name="preset" value="invert" /> Negatyw (odwrócenie)</label>
    <label><input type="radio" name="preset" value="blur" /> Zmiękczenie (blur)</label>

    <h3>Korekta barwna</h3>
    <button id="btn-grayscale" type="button">Odcienie szarości</button>
    <button id="btn-color" type="button">Pełny kolor</button>

    <h3>Dostrajanie suwakami</h3>
    <label for="slider-brightness">Jasność (%):</label>
    <input type="range" id="slider-brightness" min="0" max="200" value="100" />

    <label for="slider-opacity">Krycie (%):</label>
    <input type="range" id="slider-opacity" min="0" max="100" value="100" />

    <button id="btn-reset" type="button">Przywróć domyślne</button>
  </aside>
</main>
```

---

## 🧠 Mechanizmy manipulacji filtrami w JavaScript

### ⚙️ Właściwość CSS filter i składnia funkcji graficznych

Właściwość CSS `filter` przyjmuje ciąg znaków zawierający jedną lub więcej funkcji przekształcających piksele. W kodzie JavaScript odwołujemy się do niej poprzez obiekt stylów elementu: `element.style.filter`.

Oto najczęściej wykorzystywane funkcje silnika graficznego:

* `blur(wartość)` - rozmycie gaussowskie przyjmujące jednostki długości, np. `blur(5px)`. Wartość zero oznacza ostry obraz.
* `sepia(wartość)` - efekt starej fotografii przyjmujący wartość procentową lub ułamek dziesiętny, np. `sepia(100%)` lub `sepia(1)`.
* `invert(wartość)` - odwrócenie kolorów do negatywu, np. `invert(100%)`.
* `grayscale(wartość)` - redukcja nasycenia barw do odcieni szarości, np. `grayscale(100%)`. Wartość `grayscale(0%)` przywraca pełną paletę barw.
* `brightness(wartość)` - mnożnik jasności pikseli. `brightness(100%)` to jasność wyjściowa, `0%` daje całkowitą czerń, a wartości powyżej `100%` rozjaśniają kadr.
* `opacity(wartość)` - przezroczystość grafiki w skali od `0%` (niewidoczny) do `100%` (pełne krycie).

```javascript
const photo = document.querySelector("#image-preview");

// Nałożenie pojedynczego filtra
photo.style.filter = "sepia(100%)";

// Usunięcie wszystkich nałożonych filtrów
photo.style.filter = "none";
```

### 🔄 Zdarzenia suwaków - input kontra change

Kontrolka `<input type="range">` może być nasłuchiwana na dwa różne zdarzenia i wybór właściwego decyduje o płynności interfejsu:

1. **Zdarzenie `input`**: emitowane natychmiast przy każdym, nawet najmniejszym przesunięciu suwaka przez użytkownika. Jest optymalnym wyborem do podglądu na żywo, ponieważ zapewnia natychmiastową reakcję wizualną w czasie rzeczywistym.
2. **Zdarzenie `change`**: emitowane dopiero w momencie, gdy użytkownik puści przycisk myszy lub zakończy gest dotykowy na suwaku. Nie nadaje się do płynnego podglądu, ale jest przydatne do rejestrowania ostatecznej wartości w historii operacji.

```javascript
const slider = document.querySelector("#slider-brightness");

slider.addEventListener("input", (event) => {
  const currentBrightness = event.target.value;
  photo.style.filter = `brightness(${currentBrightness}%)`;
});
```

### 🧩 Agregacja wielu filtrów w jeden łańcuch stylów

W zaawansowanym edytorze użytkownik może jednocześnie chcieć zmienić jasność i zastosować sepię. Przypisanie nowej wartości do `element.style.filter` całkowicie nadpisuje poprzednią regułę. Aby łączyć efekty, musimy scalić poszczególne funkcje oddzielając je spacjami:

```javascript
// Połączony łańcuch kilku filtrów jednocześnie:
photo.style.filter = "sepia(80%) brightness(130%) blur(2px)";
```

Gdy stan edytora zależy od kilku kontrolek naraz, najczystszą architekturą jest funkcja pomocnicza czytająca aktualne wartości wszystkich suwaków i pól, a następnie składająca ostateczny string filtrów.

---

## 🎯 Sprawdź swoją wiedzę

<data-quiz>
  <question>
Które zdarzenie JavaScript należy przypisać do suwaka `range`, aby filtr aktualizował się w czasie rzeczywistym podczas przeciągania?
  </question>
  <options>
    <option correct>Zdarzenie `input`, bo jest wyzwalane natychmiast przy każdym przesunięciu</option>
    <option>Zdarzenie `change`, bo wysyła powiadomienie dopiero po puszczeniu suwaka</option>
    <option>Zdarzenie `select`, bo informuje silnik o aktywnym zaznaczeniu elementu</option>
    <option>Zdarzenie `blur`, bo przelicza styl dopiero po opuszczeniu kontrolki</option>
  </options>
</data-quiz>

<data-connection-matcher title="Dopasuj funkcję CSS filter do jej wizualnego efektu">
  <div class="cmw-item" data-left="`blur(6px)`" data-right="Zmiękcza krawędzie i rozmywa detale obrazu"></div>
  <div class="cmw-item" data-left="`grayscale(100%)`" data-right="Usuwa barwy tworząc czarno-biały kadr"></div>
  <div class="cmw-item" data-left="`invert(100%)`" data-right="Odwraca składowe RGB tworząc efekt negatywu"></div>
  <div class="cmw-item" data-left="`brightness(150%)`" data-right="Wzmacnia intensywność światła rozjaśniając scenę"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Kalibrator naświetlania w laboratorium

Twoim zadaniem jest napisanie funkcji `buildExposureFilter(brightness, contrast)`, która przyjmuje dwie wartości liczbowe (procent jasności oraz procent kontrastu) i zwraca poprawny ciąg znaków gotowy do przypisania do właściwości `style.filter`.

Wymagania:
1. Jeżeli wartość `brightness` jest mniejsza niż 0, funkcja powinna ograniczyć ją do zera (`Math.max(0, brightness)`).
2. Funkcja musi zwrócić string w formacie `"brightness(X%) contrast(Y%)"`.

<data-gate>
  <data-code-runner language="javascript" title="Kalibrator naświetlania w laboratorium">
    <template data-type="html">
<div class="photo-lab-container">
  <div class="photo-lab-frame">
    <svg class="photo-lab-image" id="photo-preview" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#f59e0b"/>
        </linearGradient>
        <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#skyGrad)"/>
      <circle cx="280" cy="60" r="32" fill="url(#sunGrad)"/>
      <polygon points="40,200 160,80 280,200" fill="url(#mountainGrad)" opacity="0.9"/>
      <polygon points="180,200 290,110 390,200" fill="#1e293b"/>
      <polygon points="0,200 90,140 180,200" fill="#475569"/>
    </svg>
  </div>
  <div class="photo-lab-controls">
    <div class="photo-lab-control-group">
      <div class="photo-lab-label">
        <span>☀️ Jasność (Brightness):</span>
        <strong id="val-brightness">100%</strong>
      </div>
      <input type="range" id="slider-bright" min="0" max="200" value="100" />
    </div>
    <div class="photo-lab-control-group">
      <div class="photo-lab-label">
        <span>🌓 Kontrast (Contrast):</span>
        <strong id="val-contrast">100%</strong>
      </div>
      <input type="range" id="slider-contrast" min="0" max="200" value="100" />
    </div>
    <div class="photo-lab-code-output" id="filter-output">filter: brightness(100%) contrast(100%);</div>
  </div>
</div>
    </template>
    <template data-type="code">
// 1. Generator filtra CSS naświetlenia (wymagane przez asercje testowe)
function buildExposureFilter(brightness, contrast) {
  // TODO: Uzupełnij logikę ograniczania wartości brightness (Math.max(0, brightness))
  // i zwróć sformatowany ciąg w postaci: "brightness(X%) contrast(Y%)"
  
  return "";
}

// 2. Podgląd na żywo w laboratorium (zakładka 🖼️ Podgląd Na Żywo)
function initPhotoLabUI() {
  const img = document.getElementById("photo-preview");
  const bSlider = document.getElementById("slider-bright");
  const cSlider = document.getElementById("slider-contrast");
  const bVal = document.getElementById("val-brightness");
  const cVal = document.getElementById("val-contrast");
  const output = document.getElementById("filter-output");

  function update() {
    if (!bSlider || !cSlider || !img) return;
    const b = parseInt(bSlider.value, 10);
    const c = parseInt(cSlider.value, 10);

    if (bVal) bVal.textContent = b + "%";
    if (cVal) cVal.textContent = c + "%";

    const filterString = buildExposureFilter(b, c);
    if (filterString) {
      img.style.filter = filterString;
      if (output) output.textContent = `filter: ${filterString};`;
    }
  }

  if (bSlider) bSlider.addEventListener("input", update);
  if (cSlider) cSlider.addEventListener("input", update);
  update();
}

initPhotoLabUI();
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-default-100",
          "text": "Domyślne naświetlenie 100% i 100%: zwraca 'brightness(100%) contrast(100%)'",
          "type": "test-case",
          "functionName": "buildExposureFilter",
          "input": [100, 100],
          "expected": "brightness(100%) contrast(100%)"
        },
        {
          "id": "test-bright-contrast",
          "text": "Rozjaśnienie 140% i kontrast 85%: zwraca 'brightness(140%) contrast(85%)'",
          "type": "test-case",
          "functionName": "buildExposureFilter",
          "input": [140, 85],
          "expected": "brightness(140%) contrast(85%)"
        },
        {
          "id": "test-protect-negative",
          "text": "Ochrona przed ujemną jasnością (-20 i 110): zwraca 'brightness(0%) contrast(110%)'",
          "type": "test-case",
          "functionName": "buildExposureFilter",
          "input": [-20, 110],
          "expected": "brightness(0%) contrast(110%)"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🛠️ Zadanie projektowe - Studio filtrów graficznych

Wracamy do naszego projektu studia fotograficznego przedstawionego na początku lekcji. Zaimplementuj skrypt obsługujący wszystkie interakcje użytkownika według poniższych kroków.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Pobranie referencji do elementów interfejsu**: Pobierz referencję do obrazu podglądu `#image-preview`, przycisków `#btn-grayscale`, `#btn-color`, `#btn-reset` oraz suwaków `#slider-brightness` i `#slider-opacity`.
2. **Obsługa gotowych presetów za pomocą pól radio**: Pobierz wszystkie opcje radiowe o nazwie `preset`. Przypisz do każdej z nich nasłuchiwacz zdarzenia `change`. W zależności od wybranej wartości (`event.target.value`):
   - `"sepia"` -> nałóż `sepia(100%)`
   - `"invert"` -> nałóż `invert(100%)`
   - `"blur"` -> nałóż `blur(6px)`
   - `"none"` -> usuń filtry (`"none"`)
3. **Przyciski skali szarości i przywracania koloru**: Do przycisku `#btn-grayscale` przypisz nałożenie filtra `grayscale(100%)`, natomiast przycisk `#btn-color` powinien usuwać filtr szarości (`grayscale(0%)`).
4. **Płynna regulacja suwakami i reset stanu**: Dla obu suwaków nasłuchuj zdarzenia `input`, aby na bieżąco łączyć wartości jasności i krycia w jeden łańcuch stylów: `brightness(X%) opacity(Y%)`. Przycisk `#btn-reset` powinien przywrócić domyślne położenie suwaków (na 100) oraz zresetować `style.filter = "none"`.

Spróbuj napisać rozwiązanie samodzielnie w edytorze kodu. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
const preview = document.querySelector("#image-preview");
const presetRadios = document.querySelectorAll("input[name='preset']");
const btnGrayscale = document.querySelector("#btn-grayscale");
const btnColor = document.querySelector("#btn-color");
const btnReset = document.querySelector("#btn-reset");
const sliderBrightness = document.querySelector("#slider-brightness");
const sliderOpacity = document.querySelector("#slider-opacity");

function applySlidersFilter() {
  const brightness = sliderBrightness.value;
  const opacity = sliderOpacity.value;
  preview.style.filter = `brightness(${brightness}%) opacity(${opacity}%)`;
}

presetRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    switch (e.target.value) {
      case "sepia":
        preview.style.filter = "sepia(100%)";
        break;
      case "invert":
        preview.style.filter = "invert(100%)";
        break;
      case "blur":
        preview.style.filter = "blur(6px)";
        break;
      default:
        preview.style.filter = "none";
        break;
    }
  });
});

btnGrayscale.addEventListener("click", () => {
  preview.style.filter = "grayscale(100%)";
});

btnColor.addEventListener("click", () => {
  preview.style.filter = "grayscale(0%)";
});

sliderBrightness.addEventListener("input", applySlidersFilter);
sliderOpacity.addEventListener("input", applySlidersFilter);

btnReset.addEventListener("click", () => {
  sliderBrightness.value = 100;
  sliderOpacity.value = 100;
  preview.style.filter = "none";
  const defaultRadio = document.querySelector("input[name='preset'][value='none']");
  if (defaultRadio) defaultRadio.checked = true;
});
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Właściwość `element.style.filter` umożliwia sprzętowe przetwarzanie grafiki w przeglądarce za pomocą funkcji takich jak `blur()`, `sepia()`, `invert()`, `grayscale()`, `brightness()` i `opacity()`.
- Zdarzenie `input` na kontrolkach `<input type="range">` wyzwala się w sposób ciągły podczas przeciągania suwaka, co jest kluczowe dla uzyskania płynnego podglądu na żywo.
- Zdarzenie `change` czeka na zatwierdzenie wartości (puszczenie kursora myszy lub palca na ekranie dotykowym).
- Wiele filtrów łączy się w jeden ciąg znaków rozdzielając poszczególne wywołania funkcji spacjami.
- Zresetowanie stylu odbywa się przez przypisanie wartości `"none"`.
