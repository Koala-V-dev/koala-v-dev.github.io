# Zużycie materiałów i zaokrąglanie liczb

W programowaniu aplikacji dla handlu, logistyki i budownictwa nieustannie zderzamy się z ograniczeniami fizycznego świata. W matematyce teoretycznej wynikiem dzielenia $25$ przez $4$ jest $6{,}25$. Jednak w markecie budowlanym nikt nie sprzeda klientowi ćwiartki puszki farby ani rozciętej paczki kafelków. Towary sprzedawane są w dyskretnych opakowaniach.

W tej lekcji zaczniemy od formularza kalkulatora remontowego, poznamy dogłębnie mechanikę zaokrągleń w obiekcie `Math`, rozwiążemy wyzwanie w edytorze kodu na przykładzie paczek paneli z naddatkiem na ścinki, a na koniec samodzielnie zaprogramujemy logikę zużycia farby.

---

## 🏗️ Punkt wyjścia: Formularz zapotrzebowania na farbę

Wyobraź sobie interfejs kalkulatora dla ekipy malarskiej:

```html
<section id="kalkulator-farby">
  <h2>Zapotrzebowanie na farbę</h2>
  
  <label for="powierzchnia">Powierzchnia malowania (m²):</label><br>
  <input type="number" id="powierzchnia"><br>

  <button id="btn-policz">Policz</button>
  <p id="wynik-puszki"></p>
</section>
```

Założenia techniczne:
- Jedna puszka zawiera 1 litr farby.
- 1 litr farby wystarcza dokładnie na pokrycie $4\ \text{m}^2$ powierzchni.
- Jeśli ściana ma $6\ \text{m}^2$, to dzielenie $6 / 4$ daje $1{,}5$ puszki.

Gdybyśmy użyli standardowego zaokrąglenia w dół lub obcięli ułamek, klient kupiłby 1 puszkę. Pomalowałby $4\ \text{m}^2$, a pozostałe $2\ \text{m}^2$ ściany pozostałyby surowym tynkiem! Musimy wymusić zaokrąglenie w górę do 2 pełnych puszek.

---

## 🧮 Obiekt Math: sufit, podłoga i zaokrąglenie szkolne

Wbudowany w JavaScript obiekt `Math` dostarcza zestaw metod do przekształcania liczb zmiennoprzecinkowych w liczby całkowite. Każda z nich realizuje zupełnie inną strategię:

### 📐 1. Math.ceil(x) - sufit (zawsze w górę)
Zaokrągla liczbę do najbliższej większej lub równej liczby całkowitej (w stronę plus nieskończoności):
```javascript
Math.ceil(4.01); // 5
Math.ceil(4.99); // 5
Math.ceil(4.00); // 4 (dla równej liczby nie dodaje nic)
```
To jest metoda dedykowana do wyliczania towarów niepodzielnych, paczek, biletów i liczby stron w paginacji.

### 🧱 2. Math.floor(x) - podłoga (zawsze w dół)
Zaokrągla liczbę w stronę minus nieskończoności (odcina nadmiar ułamkowy dla liczb dodatnich):
```javascript
Math.floor(4.99); // 4
Math.floor(4.01); // 4
```
Stosujemy ją, gdy interesują nas wyłącznie w pełni ukończone jednostki (np. pełne przepracowane godziny, ukończone okrążenia na torze).

### ⚖️ 3. Math.round(x) - zaokrąglenie arytmetyczne
Stosuje tradycyjną zasadę szkolną: od części ułamkowej $0{,}5$ zaokrągla w górę, a poniżej w dół:
```javascript
Math.round(4.49); // 4
Math.round(4.50); // 5
```
Używamy jej do przybliżeń statystycznych oraz zaokrąglania kwot pieniężnych do groszy:
```javascript
const kwota = 12.3456;
const grosze = Math.round(kwota * 100) / 100; // 12.35
```

---

## 🧠 Sprawdź swoje zrozumienie zaokrągleń

Sprawdź, czy potrafisz dobrać właściwą funkcję do realnego problemu logistycznego.

<data-gate>
  <data-quiz>
    <question>
Organizujesz transport dla 45 pracowników. Każdy bus mieści maksymalnie 10 osób. Które wyrażenie poprawnie wyliczy liczbę busów?
    </question>
    <options>
      <option correct>Math.ceil(45 / 10) - da 5 busów, dzięki czemu nikt nie zostanie na przystanku</option>
      <option>Math.floor(45 / 10) - da 4 busy, co w zupełności wystarczy dla większości załogi</option>
      <option>Math.round(45 / 10) - da 4 busy, ponieważ ułamek 0.5 zaokrągla się w stronę zera</option>
      <option>parseInt(45 / 10, 10) - da 4 busy, obcinając nadmiar osób bez wywoływania błędów</option>
    </options>
    <div data-hint="error">
Zastanów się: jeśli zamówisz 4 busy, zabierzesz 40 osób. Co stanie się z pozostałymi 5 pracownikami?
    </div>
    <div data-hint="success">
Doskonale! Dzielenie 45 / 10 daje 4.5. Tylko Math.ceil zaokrągli tę wartość do 5, zapewniając miejsce dla każdego pasażera.
    </div>
  </data-quiz>
</data-gate>

---

## 🧩 Dopasuj metody zaokrąglania do wyników

Przetestuj działanie poszczególnych metod obiektu `Math` na wartościach brzegowych.

<data-gate>
  <data-connection-matcher title="Dopasuj funkcję Math do jej wyniku">
    <div class="cmw-item" data-left="Math.ceil(8.01)" data-right="Zwraca 9 (najmniejsza całkowita większa od ułamka)"></div>
    <div class="cmw-item" data-left="Math.floor(8.99)" data-right="Zwraca 8 (największa całkowita mniejsza od ułamka)"></div>
    <div class="cmw-item" data-left="Math.ceil(8.00)" data-right="Zwraca 8 (wartość całkowita pozostaje nienaruszona)"></div>
    <div class="cmw-item" data-left="Math.round(8.49)" data-right="Zwraca 8 (część ułamkowa poniżej 0.5 ściąga w dół)"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Kalkulator paczek paneli z naddatkiem

W budownictwie panele podłogowe układa się z docinkami przy ścianach. Dlatego do powierzchni pomieszczenia zawsze dolicza się tzw. **naddatek na ścinki** (zazwyczaj 10% lub 15%), a dopiero potem przelicza na paczki.

Twoim zadaniem jest oprogramowanie funkcji `obliczPaczkiPaneli`.

Wymagania biznesowe:
- Parametry: `dlugoscStr`, `szerokoscStr`, `m2PaczkaStr`, `naddatekProcentStr` (wszystkie przychodzą jako tekst z formularza).
- Zrzutuj wartości na liczby zmiennoprzecinkowe.
- Jeżeli którekolwiek pole ma wartość mniejszą lub równą zero bądź `isNaN` $\to$ zwróć `0`.
- Oblicz pole powierzchni pokoju: $\text{pole} = \text{dlugosc} \cdot \text{szerokosc}$.
- Dolicz naddatek na docinki: $\text{poleZCieciem} = \text{pole} \cdot \left(1 + \frac{\text{naddatek}}{100}\right)$.
- Wylicz liczbę paczek, dzieląc powierzchnię z naddatkiem przez wydajność paczki.
- Pamiętaj, że paczek nie można dzielić - zaokrąglij wynik w górę do pełnej paczki za pomocą `Math.ceil()`.

<data-gate>
  <data-code-runner language="javascript" title="Kalkulator paczek paneli">
    <template data-type="code">
function obliczPaczkiPaneli(dlugoscStr, szerokoscStr, m2PaczkaStr, naddatekProcentStr) {
  // TODO: Zaimplementuj rzutowanie, walidację, obliczenie powierzchni z naddatkiem i zaokrąglenie w górę.
  // Pamiętaj: wynik musi być liczbą całkowitą będącą minimalną liczbą paczek do zakupu!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-standard-bez-naddatku",
          "text": "Pokój 4x5m (20 m2) przy paczce 2 m2 bez naddatku daje dokładnie 10 paczek",
          "type": "test-case",
          "functionName": "obliczPaczkiPaneli",
          "input": ["4", "5", "2", "0"],
          "expected": 10
        },
        {
          "id": "test-z-naddatkiem-zaokraglenie",
          "text": "Pokój 4x5m (20 m2) z naddatkiem 10% (22 m2) przy paczce 2.5 m2 wymaga 9 paczek (22/2.5 = 8.8 -> 9)",
          "type": "test-case",
          "functionName": "obliczPaczkiPaneli",
          "input": ["4", "5", "2.5", "10"],
          "expected": 9
        },
        {
          "id": "test-maly-ułamek-w-gore",
          "text": "Wymiar 3.2x4m (12.8 m2) bez naddatku przy paczce 2 m2 (6.4 paczki) wymaga 7 paczek",
          "type": "test-case",
          "functionName": "obliczPaczkiPaneli",
          "input": ["3.2", "4", "2", "0"],
          "expected": 7
        },
        {
          "id": "test-bledne-dane",
          "text": "Pusta lub zerowa długość ('') zwraca 0",
          "type": "test-case",
          "functionName": "obliczPaczkiPaneli",
          "input": ["", "5", "2", "10"],
          "expected": 0
        },
        {
          "id": "test-ujemne-wymiary",
          "text": "Ujemna szerokość zwraca 0",
          "type": "test-case",
          "functionName": "obliczPaczkiPaneli",
          "input": ["4", "-5", "2", "10"],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🎨 Projekt końcowy: Ożywiamy kalkulator zużycia farby

Wracamy do naszego formularza malarskiego z początku lekcji:

```html
<label for="powierzchnia">Powierzchnia malowania (m²):</label><br>
<input type="number" id="powierzchnia"><br>

<button id="btn-policz">Policz</button>
<p id="wynik-puszki"></p>
```

Założenia logiki:
- Jedna puszka zawiera 1 litr farby i wystarcza na $4\ \text{m}^2$.
- Wynik ma zostać wyświetlony w akapicie `#wynik-puszki` w formacie: `Liczba potrzebnych puszek: X`.

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz referencje do pola `#powierzchnia`, przycisku `#btn-policz` oraz akapitu `#wynik-puszki`.
2. Zarejestruj nasłuchiwanie kliknięcia na przycisku (`addEventListener("click", ...)`).
3. Wewnątrz zdarzenia odczytaj wartość z pola i sparsuj ją do liczby zmiennoprzecinkowej za pomocą `parseFloat()`.
4. Sprawdź, czy powierzchnia jest poprawna (nie jest `isNaN` i jest większa od zera). Jeśli nie, wpisz `Liczba potrzebnych puszek: 0` i zakończ działanie.
5. Podziel powierzchnię przez wydajność (4) i zaokrąglij wynik w górę za pomocą `Math.ceil()`.
6. Wstaw sformatowany tekst do właściwości `textContent` akapitu wynikowego.

Spróbuj napisać ten kod samodzielnie. Dopiero po zakończeniu próby sprawdź poniższe rozwiązanie wzorcowe.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy z DOM
const inputPowierzchnia = document.querySelector("#powierzchnia");
const btnPolicz = document.querySelector("#btn-policz");
const paragrafWynik = document.querySelector("#wynik-puszki");

// Stała określająca wydajność 1 puszki (4 m2)
const WYDAJNOSC_PUSZKI_M2 = 4;

// 2. Podpinamy nasłuchiwanie zdarzenia click
btnPolicz.addEventListener("click", () => {
  // 3. Rzutujemy wartość wejściową
  const powierzchnia = parseFloat(inputPowierzchnia.value);

  // 4. Walidacja danych wejściowych
  if (isNaN(powierzchnia) || powierzchnia <= 0) {
    paragrafWynik.textContent = "Liczba potrzebnych puszek: 0";
    return;
  }

  // 5. Wyliczenie zapotrzebowania z zaokrągleniem w górę
  const liczbaPuszek = Math.ceil(powierzchnia / WYDAJNOSC_PUSZKI_M2);

  // 6. Wyświetlenie sformatowanego wyniku w DOM
  paragrafWynik.textContent = `Liczba potrzebnych puszek: ${liczbaPuszek}`;
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- `Math.ceil()` służy do bezwzględnego zaokrąglania liczb ułamkowych w górę do najbliższej liczby całkowitej.
- Do obliczeń fizycznego zapotrzebowania na towary pakowane (puszki, paczki, kafle) zawsze stosujemy `Math.ceil()`, aby nie zabrakło materiału.
- `Math.floor()` zaokrągla w dół (przydatne do pełnych ukończonych jednostek), a `Math.round()` stosuje zaokrąglenie arytmetyczne do najbliższej wartości.
- Rozwiązanie problemu zawsze dzielimy na fazę walidacji wejścia, kalkulację matematyczną i formatowanie wyjścia do DOM.
