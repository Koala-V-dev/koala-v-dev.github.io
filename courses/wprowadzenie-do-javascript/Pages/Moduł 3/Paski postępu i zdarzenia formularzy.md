# Paski postępu i zdarzenia formularzy

Gdy formularz rejestracyjny lub proces składania zamówienia ma kilka kroków, użytkownik musi wiedzieć, ile pracy ma już za sobą, a ile jeszcze przed nim. Brak wizualnej informacji zwrotnej jest jednym z głównych powodów porzucania formularzy w sieci. Odpowiedzią na ten problem jest interaktywny pasek postępu (progress bar).

W tej lekcji zaczniemy od formularza rejestracyjnego z paskiem postępu, zrozumiemy zdarzenia cyklu życia kontrolek (`focus`, `blur`, `input`), zbadamy matematykę skali procentowej i dynamiczną zmianę szerokości w CSS, rozwiążemy wyzwanie w edytorze kodu na przykładzie wskaźnika poziomu zbiornika, a na koniec samodzielnie zaprogramujemy reaktywny pasek postępu.

---

## 🏗️ Punkt wyjścia: Formularz rejestracyjny z paskiem postępu

Oto kod HTML formularza rejestracji konta:

```html
<section id="rejestracja">
  <h2>Kreator nowego konta</h2>
  
  <label for="imie">Imię:</label><br>
  <input type="text" id="imie" class="krok-formularza"><br>

  <label for="nazwisko">Nazwisko:</label><br>
  <input type="text" id="nazwisko" class="krok-formularza"><br>

  <label for="miasto">Miasto:</label><br>
  <input type="text" id="miasto" class="krok-formularza"><br>

  <div id="ramka-postepu" style="background: #e0e0e0; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-top: 15px;">
    <div id="pasek-postepu" style="background: #28a745; width: 0%; height: 100%; transition: width 0.3s;"></div>
  </div>
  <p id="opis-postepu">Postęp rejestracji: 0%</p>
</section>
```

Założenia działania:
- Pasek postępu składa się z zewnętrznej szarej ramki oraz zielonego paska wewnętrznego (`#pasek-postepu`) o szerokości początkowej `0%`.
- Każde pomyślnie wypełnione pole ma zwiększać szerokość paska o równy ułamek całości (np. przy 3 polach o około 33.3%).
- Skrypt powinien reagować w momencie, gdy użytkownik kończy edycję danego pola i przechodzi do następnego.

---

## 🔔 Cykl życia pola tekstowego: focus, blur i input

Większość interakcji kojarzy się ze zdarzeniem `click`. Jednak pola edycyjne żyją własnym rytmem i generują dedykowane zdarzenia:

1. **`focus`** - uruchamia się w chwili, gdy kontrolka staje się aktywna (użytkownik kliknie w pole lub przejdzie do niego klawiszem <kbd>Tab</kbd>).
2. **`input`** - uruchamia się natychmiast przy każdej zmianie treści (wpisanie litery, usunięcie znaku klawiszem Backspace, wklejenie tekstu).
3. **`blur`** - uruchamia się w chwili, gdy kontrolka traci skupienie (użytkownik kliknie poza polem lub przejdzie do kolejnej kontrolki).

```javascript
const poleImie = document.querySelector("#imie");

poleImie.addEventListener("blur", () => {
  console.log("Użytkownik zakończył wypełnianie tego pola!");
});
```

Zdarzenie **`blur`** jest idealnym momentem na zaktualizowanie paska postępu, ponieważ oznacza, że użytkownik zakończył pracę z danym polem.

<data-gate>
  <data-quiz>
    <question>
Kiedy przeglądarka wywołuje zdarzenie blur na elemencie formularza?
    </question>
    <options>
      <option correct>W momencie, gdy pole traci fokus (użytkownik klika poza pole lub przechodzi dalej)</option>
      <option>W momencie, gdy użytkownik wciska klawisz Enter wewnątrz edytowanego pola tekstowego</option>
      <option>W momencie, gdy kursor myszy znajdzie się nad obszarem edycyjnym danej kontrolki</option>
      <option>W momencie, gdy treść pola zostanie całkowicie usunięta przez użytkownika formularza</option>
    </options>
    <div data-hint="error">
Pomyśl o angielskim słowie blur (rozmycie/utrata ostrości). Oznacza ono przeciwieństwo skupienia uwagi (focus).
    </div>
    <div data-hint="success">
Znakomicie! Zdarzenie blur następuje w momencie utraty skupienia. To standardowy moment na weryfikację poprawności danych i odświeżenie wskaźników postępu.
    </div>
  </data-quiz>
</data-gate>

---

## 📊 Matematyka szerokości w CSS i funkcja Math.min()

W CSS szerokość paska definiujemy za pomocą właściwości `width`. W JavaScript modyfikujemy ją przez obiekt stylów:

```javascript
const pasek = document.querySelector("#pasek-postepu");
let procent = 50;

pasek.style.width = procent + "%";
```

### ⚠️ Pułapka braku jednostki
W pliku CSS napisanie `width: 50` jest błędem składniowym - przeglądarka odrzuci taką regułę, bo nie wie, czy chodzi o piksele, procenty czy remy. Dokładnie to samo dotyczy JavaScriptu! Zapis `pasek.style.width = 50` nie zadziała. Zawsze musisz dokleić jednostkę jako string: `procent + "%"`.

### 🛡️ Ochrona przed przekroczeniem 100%: Math.min()
Jeśli formularz rozrasta się lub użytkownik wielokrotnie opuszcza kontrolki, wyliczona wartość mogłaby osiągnąć np. $125\%$. Wtedy zielony pasek „wylałby się” poza kontener!

Aby zabezpieczyć wartość przed przekroczeniem maksimum, używamy funkcji **`Math.min()`**:

```javascript
const wyliczonaWartosc = 125;
const bezpiecznyProcent = Math.min(100, wyliczonaWartosc);

console.log(bezpiecznyProcent); // Wypisze 100!
```
Funkcja `Math.min(a, b)` zwraca mniejszą z dwóch wartości. Jeśli wyliczony postęp przekroczy 100, funkcja zwróci sztywny limit 100.

<data-gate>
  <data-connection-matcher title="Zdarzenia formularza i ich przeznaczenie">
    <div class="cmw-item" data-left="focus" data-right="Uruchamia się w chwili aktywacji pola (kliknięcie lub przejście Tab)"></div>
    <div class="cmw-item" data-left="blur" data-right="Uruchamia się w chwili opuszczenia kontrolki i utraty skupienia"></div>
    <div class="cmw-item" data-left="input" data-right="Uruchamia się na żywo przy każdej modyfikacji pojedynczego znaku"></div>
    <div class="cmw-item" data-left="Math.min(100, x)" data-right="Zabezpiecza wartość liczbową przed przekroczeniem górnego limitu 100"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Wskaźnik zapełnienia zbiornika buforowego

Zastosujmy obliczenia procentowe i zabezpieczenia limitów na niezależnym problemie inżynierskim: wskaźniku napełnienia zbiornika w stacji uzdatniania wody.

Do zbiornika o określonej pojemności maksymalnej dopływa woda z dodatkowej dolewki.

Twoim celem jest oprogramowanie funkcji `obliczPoziomZbiornika`.

Wymagania biznesowe:
- Parametry: `pojemnoscMaks`, `aktualnyStan`, `dolewka` (wszystkie jako liczby).
- Jeśli `pojemnoscMaks <= 0` lub któraś z wartości jest `isNaN` $\to$ zwróć `0`.
- Oblicz nową objętość: $\text{nowaObjetosc} = \text{aktualnyStan} + \text{dolewka}$.
- Jeśli nowa objętość jest ujemna $\to$ przyjmij `0`.
- Wylicz procent zapełnienia względem pojemności maksymalnej:
  $$\text{procent} = \left(\frac{\text{nowaObjetosc}}{\text{pojemnoscMaks}}\right) \cdot 100$$
- Zbiornik posiada przelew bezpieczeństwa - wynik **nigdy nie może przekroczyć 100%** (`Math.min(100, ...)`).
- Zwracana wartość: zaokrąglona liczba całkowita procentów: `Math.round(procent)`.

<data-gate>
  <data-code-runner language="javascript" title="Wskaźnik napełnienia zbiornika">
    <template data-type="code">
function obliczPoziomZbiornika(pojemnoscMaks, aktualnyStan, dolewka) {
  // TODO: Zaimplementuj sumowanie, wyliczenie procentu oraz ograniczenie do 100%.
  // Pamiętaj: wynik musi być zaokrągloną liczbą całkowitą z przedziału 0 - 100!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-polowa",
          "text": "Zbiornik 1000L: stan 300L + dolewka 200L (500L) daje dokładnie 50%",
          "type": "test-case",
          "functionName": "obliczPoziomZbiornika",
          "input": [1000, 300, 200],
          "expected": 50
        },
        {
          "id": "test-przelew-maks",
          "text": "Zbiornik 1000L: stan 800L + dolewka 500L (1300L) zostaje ograniczony do 100%",
          "type": "test-case",
          "functionName": "obliczPoziomZbiornika",
          "input": [1000, 800, 500],
          "expected": 100
        },
        {
          "id": "test-zaokraglenie-ułamka",
          "text": "Zbiornik 300L: stan 100L bez dolewki daje 33% (33.33 -> 33)",
          "type": "test-case",
          "functionName": "obliczPoziomZbiornika",
          "input": [300, 100, 0],
          "expected": 33
        },
        {
          "id": "test-bledna-pojemnosc",
          "text": "Pojemność 0 lub ujemna zwraca 0",
          "type": "test-case",
          "functionName": "obliczPoziomZbiornika",
          "input": [0, 100, 50],
          "expected": 0
        },
        {
          "id": "test-ujemna-dolewka-pod-zero",
          "text": "Ubytek przewyższający stan (np. stan 50L - ubytek 100L) nie daje ujemnego procentu, lecz 0",
          "type": "test-case",
          "functionName": "obliczPoziomZbiornika",
          "input": [1000, 50, -100],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 📈 Projekt końcowy: Ożywiamy pasek postępu formularza

Wracamy do naszego formularza rejestracyjnego z początku lekcji:

```html
<label for="imie">Imię:</label><br>
<input type="text" id="imie" class="krok-formularza"><br>

<label for="nazwisko">Nazwisko:</label><br>
<input type="text" id="nazwisko" class="krok-formularza"><br>

<label for="miasto">Miasto:</label><br>
<input type="text" id="miasto" class="krok-formularza"><br>

<div id="ramka-postepu" style="background: #e0e0e0; width: 100%; height: 24px; border-radius: 4px; overflow: hidden; margin-top: 15px;">
  <div id="pasek-postepu" style="background: #28a745; width: 0%; height: 100%; transition: width 0.3s;"></div>
</div>
<p id="opis-postepu">Postęp rejestracji: 0%</p>
```

Zasady działania:
- Posiadamy 3 pola z klasą `.krok-formularza`.
- Każde niepuste pole zwiększa postęp o $1/3$ (około 33.33%).
- Gdy użytkownik opuszcza pole (`blur`), skrypt sprawdza ile z tych 3 pól ma wpisaną niepustą treść (`pole.value.trim() !== ""`).
- Nowy procent przypisujemy do właściwości `style.width` wewnętrznego paska oraz wypisujemy w akapicie `#opis-postepu`.

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz wszystkie pola formularza za pomocą `document.querySelectorAll(".krok-formularza")`.
2. Pobierz referencję do paska `#pasek-postepu` oraz akapitu `#opis-postepu`.
3. Napisz funkcję pomocniczą `aktualizujPostep()`:
   - Zlicz ile pól ma wpisaną treść różną od pustego napisu.
   - Wylicz procent: `Math.round((wypelnione / pola.length) * 100)`.
   - Zabezpiecz wartość za pomocą `Math.min(100, ...)`.
   - Zaktualizuj styl: `pasek.style.width = procent + "%"`.
   - Zaktualizuj tekst: `opis.textContent = Postęp rejestracji: ${procent}%`.
4. Przejdź pętlą `forEach` po wszystkich polach i zarejestruj na każdym z nich zdarzenie `"blur"` wywołujące funkcję aktualizacji.

Spróbuj napisać ten kod samodzielnie. Dopiero po zakończeniu próby sprawdź poniższy kod referencyjny.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy z DOM
const pola = document.querySelectorAll(".krok-formularza");
const pasek = document.querySelector("#pasek-postepu");
const opis = document.querySelector("#opis-postepu");

// 2. Funkcja przeliczająca postęp na podstawie wypełnionych pól
function aktualizujPostep() {
  let wypelnione = 0;

  pola.forEach(pole => {
    // Sprawdzamy czy pole nie jest puste po obcięciu spacji
    if (pole.value.trim() !== "") {
      wypelnione++;
    }
  });

  // 3. Wyliczenie procentu i zabezpieczenie przed przekroczeniem 100
  const procent = Math.min(100, Math.round((wypelnione / pola.length) * 100));

  // 4. Aktualizacja szerokości paska w CSS oraz tekstu informacyjnego
  pasek.style.width = procent + "%";
  opis.textContent = `Postęp rejestracji: ${procent}%`;
}

// 5. Podpinamy zdarzenie blur pod każde pole formularza
pola.forEach(pole => {
  pole.addEventListener("blur", aktualizujPostep);
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Zdarzenie `blur` uruchamia się natychmiast po opuszczeniu kontrolki formularza przez użytkownika, co czyni je idealnym momentem na walidację.
- Przy modyfikacji szerokości przez `element.style.width` zawsze pamiętamy o doklejeniu jednostki tekstowej (np. `procent + "%"`).
- Wartości procentowe zabezpieczamy przed przekroczeniem maksimum za pomocą funkcji `Math.min(100, wartosc)`.
- Metoda `document.querySelectorAll()` w połączeniu z pętlą `forEach()` pozwala na eleganckie podpięcie zdarzeń pod całą grupę powiązanych pól naraz.
