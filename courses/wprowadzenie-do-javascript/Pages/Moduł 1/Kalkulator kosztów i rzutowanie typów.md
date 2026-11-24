# Kalkulator kosztów i rzutowanie typów

Zanim napiszesz choćby jedną linijkę logiki w JavaScript, musisz wiedzieć, z czym pracujesz. W aplikacjach internetowych JavaScript niemal nigdy nie działa w próżni - jego zadaniem jest ożywienie statycznego dokumentu HTML, przechwycenie akcji użytkownika i zaktualizowanie widoku strony.

W tej lekcji zaczniemy od gotowego szablonu formularza HTML, zrozumiemy model zdarzeń w przeglądarce, zgłębimy mechanizm konwersji typów w pamięci silnika JavaScript, rozwiążemy wyzwanie w edytorze kodu, a na koniec samodzielnie ożywimy formularz stacji paliw.

---

## 🏗️ Punkt wyjścia: Szablon HTML i problem martwego interfejsu

Oto kod HTML formularza stacji paliw, który posłuży nam za cel wdrożeniowy:

```html
<section id="stacja">
  <h2>Orientacyjny koszt paliwa</h2>
  
  <label for="rodzaj">Rodzaj paliwa (1-benzyna, 2-olej napędowy):</label><br>
  <input type="number" id="rodzaj"><br>

  <label for="litry">Ile litrów?</label><br>
  <input type="number" id="litry"><br>

  <button id="btn-oblicz">OBLICZ</button>
  <p id="wynik"></p>
</section>
```

Gdy otworzysz ten plik w przeglądarce, zobaczysz dwa pola liczbowe, przycisk i pusty obszar na wynik. Jednak bez względu na to, co wpiszesz i ile razy klikniesz przycisk, strona nie zareaguje.

Dlaczego? Ponieważ HTML opisuje wyłącznie **strukturę i wygląd**, ale nie posiada własnego mechanizmu obliczeniowego. Aby formularz zaczął działać, potrzebujemy skryptu JavaScript. Zanim jednak przejdziemy do obliczeń, musimy zrozumieć, w jaki sposób przeglądarka dowiaduje się, że użytkownik w ogóle kliknął przycisk.

---

## 🔌 Jak JavaScript słucha użytkownika: model zdarzeń i addEventListener

W tradycyjnych programach konsolowych (np. w C++ czy Pythonie) program zatrzymuje wykonywanie kodu na instrukcji wejścia (np. `cin >> x` lub `input()`) i czeka, aż użytkownik coś wpisze.

W przeglądarce internetowej takie podejście jest niedopuszczalne. Gdyby skrypt zatrzymał się i czekał, cała strona natychmiast by zamarzła - nie dałoby się przewijać tekstu, zaznaczać linków ani renderować animacji.

Dlatego przeglądarki działają w **architekturze sterowanej zdarzeniami** (*Event-Driven Architecture*). Oznacza to, że skrypt uruchamia się, rejestruje dyspozytorów i natychmiast kończy pracę, pozostawiając przeglądarkę w stanie czuwania.

Głównym narzędziem do rejestrowania reakcji na działania człowieka jest metoda **`addEventListener`**:

```javascript
const przycisk = document.querySelector("#btn-oblicz");

przycisk.addEventListener("click", () => {
  console.log("Przycisk został kliknięty!");
});
```

Przeanalizujmy anatomię tego wywołania:
1. **Cel zdarzenia (`przycisk`)**: Węzeł DOM, na którym chcemy nasłuchiwać.
2. **Nazwa zdarzenia (`"click"`)**: Ciąg znaków określający rodzaj akcji (np. `"click"` dla kliknięcia myszą, `"input"` dla zmiany tekstu, `"submit"` dla wysłania formularza).
3. **Funkcja zwrotna (*callback*)**: Blok kodu przekazywany jako argument. Ta funkcja **nie wykonuje się od razu**! Przeglądarka zapisuje ją w pamięci i uruchomi dopiero wtedy, gdy użytkownik faktycznie kliknie w dany element.

### ⚠️ Najczęstszy błąd początkujących: pułapka nawiasów ()

Zwróć uwagę na różnicę między przekazaniem funkcji a jej wywołaniem:

```javascript
// ❌ KATASTROFALNY BŁĄD:
przycisk.addEventListener("click", obliczKoszt()); 

// ✅ PRAWIDŁOWO:
przycisk.addEventListener("click", obliczKoszt);
// LUB:
przycisk.addEventListener("click", () => {
  obliczKoszt();
});
```

Dopisanie nawiasów `()` powoduje, że funkcja wykonuje się **natychmiast podczas wczytywania strony**, a do nasłuchiwania zostaje przypisana wartość zwrócona przez funkcję (najczęściej `undefined`). W efekcie po kliknięciu przycisku nic się nie wydarzy!

<data-gate>
  <data-quiz>
    <question>
Co się stanie, gdy zarejestrujesz zdarzenie w taki sposób: przycisk.addEventListener("click", wyswietlKomunikat()); ?
    </question>
    <options>
      <option correct>Funkcja wykona się natychmiast przy starcie, a po kliknięciu nic się nie stanie</option>
      <option>Przeglądarka zgłosi błąd składniowy i natychmiast przerwie wykonywanie całego skryptu</option>
      <option>Kod zadziała w pełni poprawnie, ponieważ nawiasy są wymagane po każdej nazwie funkcji</option>
      <option>Funkcja zostanie zarejestrowana prawidłowo, lecz uruchomi się dopiero po resecie strony</option>
    </options>
    <div data-hint="error">
Zwróć uwagę na to, co robi operator nawiasów () w języku JavaScript: wywołuje funkcję w miejscu zapisu i zwraca jej wynik do metody addEventListener.
    </div>
    <div data-hint="success">
Brawo! Nawiasy () natychmiast uruchamiają funkcję. Aby funkcja czekała na kliknięcie, musimy przekazać referencję do niej (samą nazwę bez nawiasów) lub opakować ją w funkcję strzałkową.
    </div>
  </data-quiz>
</data-gate>

---

## 🕳️ Wnętrze drzewa DOM: dlaczego właściwość .value to zawsze string?

Gdy już potrafimy nasłuchiwać kliknięcia, chcemy odczytać dane z pól wejściowych:

```javascript
const inputLitry = document.querySelector("#litry");
const litry = inputLitry.value;
```

Tutaj kryje się największa pułapka języka JavaScript: **zawartość właściwości `.value` jest zawsze ciągiem znaków (`string`)**, bez względu na to, czy w kodzie HTML użyłeś `<input type="number">`, `<input type="text">` czy `<input type="range">`.

Drzewo DOM jest reprezentacją dokumentu tekstowego. Przeglądarka przechowuje wartości pól jako sekwencje znaków Unicode.

Dlaczego to takie groźne? Ponieważ operator `+` w JavaScript jest przeciążony:
- Dla dwóch liczb wykonuje **dodawanie arytmetyczne** ($10 + 5 = 15$).
- Jeśli chociaż jeden operand jest tekstem, wykonuje **konkatenację** (skleja napisy: `"10" + "5" = "105"`).

```javascript
const litryZBaku = "40";
const litryZKanistra = "10";

console.log(litryZBaku + litryZKanistra); // Wypisze "4010", a nie 50!
```

Co jeszcze bardziej mylące, pozostałe operatory arytmetyczne (`-`, `*`, `/`) nie mają odpowiednika tekstowego, więc silnik JavaScript próbuje po cichu przekonwertować tekst na liczbę:

```javascript
console.log("10" * "5"); // 50 (silnik wymusił konwersję na liczbę)
console.log("10" - "5"); // 5  (silnik wymusił konwersję na liczbę)
console.log("10" + "5"); // "105" (silnik potraktował to jako tekst!)
```

Poleganie na takim niejawnym zachowaniu prowadzi do aplikacji, które w jednym miejscu liczą poprawnie, a w innym dopisują zera i niszczą wyliczenia finansowe.

<data-gate>
  <data-quiz>
    <question>
Jaki wynik wyświetli w konsoli poniższa operacja: console.log("100" - "20" + "10"); ?
    </question>
    <options>
      <option correct>"8010" - odejmowanie daje liczbę 80, a plus dokleja tekst "10"</option>
      <option>90 - wszystkie trzy wartości zostaną automatycznie sparsowane na liczby</option>
      <option>"100-2010" - silnik zachowa operacje na stringach jako jeden długi tekst</option>
      <option>NaN - próba odjęcia liczby od napisu natychmiast wygeneruje błąd typu</option>
    </options>
    <div data-hint="error">
Przeanalizuj kolejność działań od lewej do prawej: najpierw wykonuje się ("100" - "20"), a do wyniku tego działania dodawany jest ciąg "10".
    </div>
    <div data-hint="success">
Znakomicie! Działania wykonują się od lewej do prawej: ("100" - "20") daje liczbę 80. Następnie 80 + "10" napotyka tekst i wykonuje konkatenację, tworząc napis "8010". To jaskrawy dowód na to, dlaczego niejawna konwersja jest niebezpieczna.
    </div>
  </data-quiz>
</data-gate>

---

## ⚙️ Jawne rzutowanie: Number, parseFloat i parseInt od środka

Aby mieć pełną kontrolę nad kodem, profesjonalny programista nigdy nie pozwala silnikowi na domysły. Każdą wartość pochodzącą z formularza rzutujemy jawnie na typ liczbowy.

Silnik JavaScript oferuje do tego trzy różne mechanizmy. Różnią się one sposobem parsowania znaków:

### 🔢 1. Funkcja Number(wartość)
Wymaga, aby **cały ciąg znaków** był poprawną liczbą. Jeśli w tekście pojawi się choćby jedna litera, spacja wewnątrz lub znak waluty, natychmiast zwraca `NaN` (*Not a Number*):
```javascript
Number("120.50");    // 120.5
Number("120.50 zł"); // NaN (błąd przez tekst "zł")
Number("");          // 0 (pusty ciąg traktuje jako zero)
```

### 🌊 2. Funkcja parseFloat(tekst)
Działa jak czytnik: zaczyna od lewej strony i parsuje cyfry oraz kropkę dziesiętną. Gdy natrafi na pierwszy niedozwolony znak (np. literę lub spację), **przerywa czytanie i zwraca to, co udało się odczytać**:
```javascript
parseFloat("120.50 zł"); // 120.5 (odczytał liczbę, zignorował "zł")
parseFloat("paliwo 120"); // NaN (bo zaczyna się od liter)
parseFloat("");          // NaN
```

### 🎯 3. Funkcja parseInt(tekst, podstawa)
Działa podobnie jak `parseFloat`, ale odrzuca część ułamkową i parsuje wyłącznie liczby całkowite. Jako drugi parametr **zawsze podajemy liczbę 10** (system dziesiętny):
```javascript
parseInt("120.99 zł", 10); // 120 (odciął ułamek!)
parseInt("42", 10);        // 42
```

### 🛡️ Wykrywanie błędów: funkcja isNaN()
Do sprawdzenia, czy rzutowanie zakończyło się powodzeniem, służy funkcja `isNaN(wartość)`:
```javascript
const litry = parseFloat(inputLitry.value);

if (isNaN(litry)) {
  console.log("Użytkownik nie wpisał poprawnej liczby!");
}
```

<data-gate>
  <data-connection-matcher title="Dopasuj zachowanie metod konwersji">
    <div class="cmw-item" data-left="Number('45.90 zł')" data-right="Zwraca NaN, ponieważ wymaga czystej liczby w całym napisie"></div>
    <div class="cmw-item" data-left="parseFloat('45.90 zł')" data-right="Zwraca 45.9, czytając ułamek od lewej i ignorując jednostkę"></div>
    <div class="cmw-item" data-left="parseInt('45.90 zł', 10)" data-right="Zwraca 45, obcinając część po kropce dziesiętnej"></div>
    <div class="cmw-item" data-left="Number('')" data-right="Zwraca 0 w przypadku pustego ciągu tekstowego"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Rozliczanie zamówienia z napiwkiem

Sprawdźmy twoje zrozumienie rzutowania typów i bezpiecznych operacji matematycznych na praktycznym problemie biznesowym: kalkulatorze rachunku w lokalu gastronomicznym.

Klient podaje kwotę rachunku, oczekiwany procent napiwku dla kelnera oraz kodowy rabat kwotowy. Wszystkie te dane przychodzą do funkcji jako ciągi znaków (tak jak z kontrolek formularza).

Twoim celem jest oprogramowanie funkcji `rozliczRachunek`.

Zasady biznesowe:
- Wartości wejściowe: `kwotaStr`, `napiwekProcentStr`, `rabatStr` (wszystkie typu `string`).
- Skonwertuj kwotę, napiwek i rabat na liczby zmiennoprzecinkowe.
- Jeżeli po konwersji kwota zamówienia jest mniejsza lub równa zero, albo któraś z wartości jest `NaN` $\to$ funkcja musi zwrócić `0`.
- Do kwoty netto należy doliczyć napiwek: $\text{kwota} \cdot \frac{\text{napiwek}}{100}$.
- Od sumy należy odjąć rabat kwotowy. Pamiętaj, że rachunek nie może stać się ujemny (jeśli rabat przewyższa kwotę, wynikiem jest `0`).
- Wynik końcowy zaokrąglij do dwóch miejsc po przecinku: `Math.round(wynik * 100) / 100`.

<data-gate>
  <data-code-runner language="javascript" title="Kalkulator rachunku z napiwkiem">
    <template data-type="code">
function rozliczRachunek(kwotaStr, napiwekProcentStr, rabatStr) {
  // TODO: Napisz logikę rzutowania, walidacji i kalkulacji rachunku.
  // Pamiętaj: dane przychodzą jako tekst, a operator + bez konwersji sklei stringi!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-standard",
          "text": "Rachunek 100 zł z napiwkiem 10% i rabatem 0 daje 110 zł",
          "type": "test-case",
          "functionName": "rozliczRachunek",
          "input": ["100", "10", "0"],
          "expected": 110
        },
        {
          "id": "test-ze-znizka",
          "text": "Rachunek 200 zł z napiwkiem 10% (220 zł) i rabatem 30 zł daje 190 zł",
          "type": "test-case",
          "functionName": "rozliczRachunek",
          "input": ["200", "10", "30"],
          "expected": 190
        },
        {
          "id": "test-ulamki",
          "text": "Rachunek 45.50 zł z napiwkiem 5% daje 47.78 zł",
          "type": "test-case",
          "functionName": "rozliczRachunek",
          "input": ["45.50", "5", "0"],
          "expected": 47.78
        },
        {
          "id": "test-pusty-blad",
          "text": "Pusta lub błędna kwota ('') zwraca 0",
          "type": "test-case",
          "functionName": "rozliczRachunek",
          "input": ["", "10", "0"],
          "expected": 0
        },
        {
          "id": "test-rabat-przewyzsza",
          "text": "Rabat większy od kwoty nie daje wartości ujemnej, lecz 0",
          "type": "test-case",
          "functionName": "rozliczRachunek",
          "input": ["50", "0", "100"],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## ⛽ Projekt końcowy: Ożywiamy kalkulator kosztu paliwa

Wracamy do naszego formularza stacji paliw z początku lekcji:

```html
<label for="rodzaj">Rodzaj paliwa (1-benzyna, 2-olej napędowy):</label><br>
<input type="number" id="rodzaj"><br>

<label for="litry">Ile litrów?</label><br>
<input type="number" id="litry"><br>

<button id="btn-oblicz">OBLICZ</button>
<p id="wynik"></p>
```

Twoim zadaniem jest samodzielne napisanie skryptu JavaScript podpinającego ten formularz.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Pobierz elementy**: Użyj `document.querySelector`, aby pobrać referencje do pól `#rodzaj`, `#litry`, przycisku `#btn-oblicz` oraz paragrafu `#wynik`.
2. **Zarejestruj zdarzenie**: Podepnij pod przycisk nasłuchiwanie zdarzenia `"click"` za pomocą `addEventListener`.
3. **Odczytaj i zrzutuj dane**: Wewnątrz funkcji zwrotnej odczytaj właściwość `.value` z obu pól. Użyj `parseInt` dla rodzaju paliwa oraz `parseFloat` dla liczby litrów.
4. **Zastosuj Guard Clause (walidację brzegową)**: Jeśli któraś wartość jest `isNaN` lub liczba litrów $\le 0$, ustaw treść akapitu na `koszt paliwa: 0 zł` i natychmiast przerwij działanie funkcji instrukcją `return`.
5. **Wylicz stawkę**:
   - Dla rodzaju `1` (benzyna) stawka wynosi `4.0 zł/l`.
   - Dla rodzaju `2` (olej napędowy) stawka wynosi `3.5 zł/l`.
   - Dla każdego innego numeru stawka wynosi `0 zł/l`.
6. **Oblicz koszt i wstaw do DOM**: Pomnóż liczbę litrów przez stawkę, zaokrąglij do dwóch miejsc po przecinku i przypisz sformatowany tekst do właściwości `textContent` akapitu: `koszt paliwa: XX zł`.

Spróbuj napisać ten kod samodzielnie w swoim edytorze kodu. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy z drzewa DOM
const inputRodzaj = document.querySelector("#rodzaj");
const inputLitry = document.querySelector("#litry");
const btnOblicz = document.querySelector("#btn-oblicz");
const paragrafWynik = document.querySelector("#wynik");

// 2. Rejestrujemy nasłuchiwanie kliknięcia
btnOblicz.addEventListener("click", () => {
  // 3. Jawnie rzutujemy dane wejściowe
  const rodzaj = parseInt(inputRodzaj.value, 10);
  const litry = parseFloat(inputLitry.value);

  // 4. Walidacja wstępna (Guard Clause)
  if (isNaN(rodzaj) || isNaN(litry) || litry <= 0) {
    paragrafWynik.textContent = "koszt paliwa: 0 zł";
    return;
  }

  // 5. Ustalenie stawki na podstawie wybranego typu paliwa
  let cenaZaLitr = 0;
  if (rodzaj === 1) {
    cenaZaLitr = 4.0;
  } else if (rodzaj === 2) {
    cenaZaLitr = 3.5;
  } else {
    cenaZaLitr = 0;
  }

  // 6. Obliczenie kosztu i wyświetlenie sformatowanego tekstu w DOM
  const lacznyKoszt = Math.round(litry * cenaZaLitr * 100) / 100;
  paragrafWynik.textContent = `koszt paliwa: ${lacznyKoszt} zł`;
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przeglądarka działa w architekturze sterowanej zdarzeniami - `addEventListener("click", callback)` rejestruje funkcję, która czeka na działanie użytkownika.
- Do `addEventListener` przekazujemy referencję do funkcji lub funkcję strzałkową, nigdy wywołanie z nawiasami `()`.
- Wartość `.value` z pola formularza jest zawsze ciągiem znaków (`string`), co przy użyciu operatora `+` powoduje sklejenie tekstu zamiast dodawania.
- `parseFloat()` wyciąga liczbę zmiennoprzecinkową od początku tekstu, a `parseInt(x, 10)` parsuje liczbę całkowitą w systemie dziesiętnym.
- Po rzutowaniu zawsze sprawdzamy poprawność danych funkcją `isNaN()`, a bezpieczny wynik wstawiamy do DOM za pomocą `textContent`.
