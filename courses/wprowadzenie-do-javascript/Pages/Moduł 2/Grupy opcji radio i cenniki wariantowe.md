# Grupy opcji radio i cenniki wariantowe

Wielu procesów w aplikacjach webowych nie da się obsłużyć zwykłym polem tekstowym. Gdy użytkownik wybiera taryfę abonamentu, metodę dostawy kurierskiej czy długość strzyżenia w salonie fryzjerskim, system musi wymusić wybór **dokładnie jednej opcji z zamkniętej listy**. Służą do tego przyciski radiowe (`<input type="radio">`).

W tej lekcji zaczniemy od formularza wyboru usługi w salonie, zbadamy działanie grup opcji w drzewie DOM, opanujemy instrukcję `switch` bez błędów w sterowaniu przepływem, rozwiążemy wyzwanie w edytorze kodu na przykładzie systemu biletowego, a na koniec samodzielnie zaprogramujemy logikę cennika promocyjnego.

---

## 🏗️ Punkt wyjścia: Formularz wariantów usług

Oto kod HTML formularza wyceny usługi fryzjerskiej:

```html
<form id="form-usluga">
  <h2>Wybór długości włosów</h2>
  
  <label><input type="radio" name="fryzura" value="krotkie"> Krótkie (25 zł)</label><br>
  <label><input type="radio" name="fryzura" value="srednie"> Średnie (30 zł)</label><br>
  <label><input type="radio" name="fryzura" value="poldlugie"> Półdługie (40 zł)</label><br>
  <label><input type="radio" name="fryzura" value="dlugie"> Długie (50 zł)</label><br>
  
  <button type="button" id="btn-promocja">Odkryj promocję</button>
  <p id="wynik-promocji"></p>
</form>
```

Wymagania biznesowe:
- W danym momencie tylko jeden przycisk może być zaznaczony.
- Kliknięcie przycisku „Odkryj promocję” ma pobrać wybraną długość i naliczyć rabat promocyjny w wysokości 10 zł od ceny bazowej.
- Wynik ma pojawić się pod przyciskiem w formacie: `cena promocyjna: XX`.

---

## 🔘 Jak działają przyciski radiowe w przeglądarce

W HTML przyciski radiowe tworzą logiczną grupę tylko wtedy, gdy dzielą identyczny atrybut **`name`** (w naszym przykładzie `name="fryzura"`). Przeglądarka pilnuje wtedy wzajemnego wykluczania: zaznaczenie jednej opcji natychmiast odznacza pozostałe.

Wartość przypisana do wybranej opcji zapisana jest w atrybucie `value`. Jednak w przeciwieństwie do pól tekstowych, odpytanie zwykłego selektora `document.querySelector('input[type="radio"]')` pobrałoby zawsze pierwszy przycisk z brzegu, niezależnie od tego czy jest zaznaczony!

Aby namierzyć przycisk, który użytkownik faktycznie zaznaczył, stosujemy pseudoklasę CSS **`:checked`**:

```javascript
const zaznaczonaOpcja = document.querySelector('input[name="fryzura"]:checked');
```

### ⚠️ Pułapka braku wyboru: obiekt null
Co się stanie, gdy użytkownik kliknie przycisk, zanim zaznaczy jakąkolwiek opcję?
Selektor nie znajdzie żadnego pasującego elementu i zwróci wartość **`null`**.

```javascript
// ❌ KATASTROFALNY BŁĄD:
const wybranyWariant = document.querySelector('input[name="fryzura"]:checked').value;
// TypeError: Cannot read properties of null (reading 'value') - aplikacja przestaje działać!
```

Przed odczytaniem właściwości `.value` musimy bezwzględnie sprawdzić, czy element istnieje:

```javascript
// ✅ PRAWIDŁOWO:
const zaznaczone = document.querySelector('input[name="fryzura"]:checked');

if (zaznaczone === null) {
  console.log("Użytkownik nie wybrał żadnej opcji!");
  return;
}

const wariant = zaznaczone.value; // Bezpieczny odczyt: np. "srednie"
```

<data-gate>
  <data-quiz>
    <question>
Co zwróci document.querySelector('input[name="fryzura"]:checked'), jeśli użytkownik nie zaznaczył żadnego przycisku?
    </question>
    <options>
      <option correct>Zwróci wartość null, ponieważ żaden element nie spełnia warunku selektora</option>
      <option>Zwróci pusty ciąg tekstowy "", oznaczający brak wpisanej treści w polu</option>
      <option>Zgłosi błąd TypeError z informacją o braku aktywnej kontrolki w formularzu</option>
      <option>Zwróci pierwszy element z grupy jako domyślnie zaznaczony przycisk radiowy</option>
    </options>
    <div data-hint="error">
Pamiętaj o tym, jak zachowuje się metoda querySelector: gdy w dokumencie nie ma elementu spełniającego podane kryteria, metoda zawsze zwraca pustą referencję null.
    </div>
    <div data-hint="success">
Dokładnie! querySelector zwraca null, gdy nic nie pasuje do selektora. Dlatego próba odczytania .value bez sprawdzenia warunkiem if spowodowałaby błąd wykonania skryptu.
    </div>
  </data-quiz>
</data-gate>

---

## 🔀 Instrukcja switch: elegancka drabinka wariantów

Gdy mamy do czynienia z wieloma wartościami tej samej zmiennej, instrukcja `switch` jest znacznie czytelniejsza od długiego łańcucha `if ... else if ... else if`:

```javascript
let cenaBazowa = 0;

switch (wariant) {
  case "krotkie":
    cenaBazowa = 25;
    break;
  case "srednie":
    cenaBazowa = 30;
    break;
  case "poldlugie":
    cenaBazowa = 40;
    break;
  case "dlugie":
    cenaBazowa = 50;
    break;
  default:
    cenaBazowa = 0; // Bezpiecznik na wypadek nieznanej wartości
}
```

### ⚡ Rola instrukcji break
Słowo kluczowe `break` nakazuje silnikowi JavaScript natychmiastowe opuszczenie bloku `switch`. Gdybyś pominął `break`, silnik przeszedłby do kolejnego `case` niezależnie od warunku (tzw. zjawisko *fall-through*), nadpisując wyliczoną cenę kolejną wartością!

Klauzula `default:` działa jak końcowe `else` - wykonuje się wtedy, gdy żaden z wcześniejszych przypadków nie pasował.

<data-gate>
  <data-connection-matcher title="Elementy składowe instrukcji switch">
    <div class="cmw-item" data-left="case 'wariant':" data-right="Definiuje punkt wejścia dla konkretnej dopasowanej wartości"></div>
    <div class="cmw-item" data-left="break;" data-right="Przerywa wykonywanie bloku switch i zapobiega fall-through"></div>
    <div class="cmw-item" data-left="default:" data-right="Wykonuje się awaryjnie, gdy żaden case nie został dopasowany"></div>
    <div class="cmw-item" data-left="Pominięcie break" data-right="Powoduje bezwarunkowe wykonanie kodu w kolejnych gałęziach case"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: System biletowy teatru

Zastosujmy poznane techniki na niezależnym problemie biznesowym: systemie wyliczania ceny biletów do teatru.

Klient wybiera strefę widowni, a system może naliczyć zniżkę studencką.

Twoim celem jest oprogramowanie funkcji `obliczCeneBiletu`.

Zasady cennika:
- Parametr `strefaStr` (ciąg znaków):
  - `"parter"` $\to$ stawka bazowa 80 zł.
  - `"balkon"` $\to$ stawka bazowa 60 zł.
  - `"loza"` $\to$ stawka bazowa 120 zł.
  - Wszelkie inne wartości $\to$ funkcja zwraca `0`.
- Parametr `czyUlgowy` (wartość typu `boolean`):
  - Jeśli `true`, naliczany jest rabat 25% (cena wynosi $75\%$ ceny bazowej).
  - Jeśli `false`, obowiązuje pełna cena bazowa.
- Zwracana wartość: liczba reprezentująca ostateczną cenę biletu zaokrąglona do 2 miejsc po przecinku: `Math.round(cena * 100) / 100`.

<data-gate>
  <data-code-runner language="javascript" title="Kalkulator biletów teatralnych">
    <template data-type="code">
function obliczCeneBiletu(strefaStr, czyUlgowy) {
  // TODO: Użyj instrukcji switch do ustalenia ceny bazowej i nalicz zniżkę.
  // Pamiętaj: dla nieznanej strefy funkcja powinna zwrócić 0!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-parter-normalny",
          "text": "Strefa 'parter' bez ulgi kosztuje 80 zł",
          "type": "test-case",
          "functionName": "obliczCeneBiletu",
          "input": ["parter", false],
          "expected": 80
        },
        {
          "id": "test-parter-ulgowy",
          "text": "Strefa 'parter' z ulgą 25% kosztuje 60 zł (80 * 0.75)",
          "type": "test-case",
          "functionName": "obliczCeneBiletu",
          "input": ["parter", true],
          "expected": 60
        },
        {
          "id": "test-balkon-ulgowy",
          "text": "Strefa 'balkon' z ulgą 25% kosztuje 45 zł (60 * 0.75)",
          "type": "test-case",
          "functionName": "obliczCeneBiletu",
          "input": ["balkon", true],
          "expected": 45
        },
        {
          "id": "test-loza-normalna",
          "text": "Strefa 'loza' bez ulgi kosztuje 120 zł",
          "type": "test-case",
          "functionName": "obliczCeneBiletu",
          "input": ["loza", false],
          "expected": 120
        },
        {
          "id": "test-nieznana-strefa",
          "text": "Nieznana strefa ('scena') zwraca 0 zł",
          "type": "test-case",
          "functionName": "obliczCeneBiletu",
          "input": ["scena", false],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## ✂️ Projekt końcowy: Ożywiamy cennik salonu fryzjerskiego

Wracamy do naszego formularza wyboru fryzury z początku lekcji:

```html
<label><input type="radio" name="fryzura" value="krotkie"> Krótkie (25 zł)</label><br>
<label><input type="radio" name="fryzura" value="srednie"> Średnie (30 zł)</label><br>
<label><input type="radio" name="fryzura" value="poldlugie"> Półdługie (40 zł)</label><br>
<label><input type="radio" name="fryzura" value="dlugie"> Długie (50 zł)</label><br>

<button type="button" id="btn-promocja">Odkryj promocję</button>
<p id="wynik-promocji"></p>
```

Cennik bazowy:
- Krótkie: 25 zł (promocja: 15 zł).
- Średnie: 30 zł (promocja: 20 zł).
- Półdługie: 40 zł (promocja: 30 zł).
- Długie: 50 zł (promocja: 40 zł).
- Format wyjścia pod przyciskiem: `cena promocyjna: XX`.

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz referencję do przycisku `#btn-promocja` oraz akapitu `#wynik-promocji`.
2. Zarejestruj nasłuchiwanie kliknięcia na przycisku.
3. Wewnątrz funkcji odpytaj selektor `input[name="fryzura"]:checked`.
4. Sprawdź, czy użytkownik dokonał wyboru (czy zmienna nie jest równa `null`). Jeśli jest pusta, wyświetl komunikat o konieczności wyboru i zakończ funkcję.
5. Użyj instrukcji `switch` lub `if`, aby na podstawie wartości `.value` przypisać cenę bazową.
6. Odejmij rabat promocyjny (10 zł) i wpisz sformatowany tekst do właściwości `textContent` akapitu.

Spróbuj zaimplementować ten kod samodzielnie. Po zakończeniu pracy sprawdź wzorcowe rozwiązanie poniżej.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy interfejsu
const btnPromocja = document.querySelector("#btn-promocja");
const wynikAkapit = document.querySelector("#wynik-promocji");

// Stała określająca wysokość rabatu promocyjnego
const RABAT_PROMOCYJNY = 10;

// 2. Podpinamy zdarzenie click
btnPromocja.addEventListener("click", () => {
  // 3. Pobieramy aktualnie zaznaczony przycisk radiowy
  const zaznaczonyRadio = document.querySelector('input[name="fryzura"]:checked');

  // 4. Zabezpieczenie przed brakiem zaznaczenia (Guard Clause)
  if (!zaznaczonyRadio) {
    wynikAkapit.textContent = "Proszę zaznaczyć jedną z opcji!";
    return;
  }

  // 5. Ustalenie ceny bazowej w zależności od wybranego wariantu
  let cenaBazowa = 0;
  switch (zaznaczonyRadio.value) {
    case "krotkie":
      cenaBazowa = 25;
      break;
    case "srednie":
      cenaBazowa = 30;
      break;
    case "poldlugie":
      cenaBazowa = 40;
      break;
    case "dlugie":
      cenaBazowa = 50;
      break;
    default:
      cenaBazowa = 0;
  }

  // 6. Odliczenie rabatu i wyświetlenie wyniku
  const cenaPromocyjna = Math.max(0, cenaBazowa - RABAT_PROMOCYJNY);
  wynikAkapit.textContent = `cena promocyjna: ${cenaPromocyjna}`;
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przyciski radiowe z tej samej grupy łączymy wspólnym atrybutem `name`.
- Aktualnie zaznaczony przycisk radiowy pobieramy selektorem `input[name="nazwa"]:checked`.
- Zawsze weryfikujemy, czy `querySelector` nie zwrócił wartości `null`, aby uniknąć błędu `TypeError`.
- W instrukcji `switch` każdą gałąź `case` kończymy instrukcją `break`, a gałąź `default:` traktujemy jako zabezpieczenie przed nieobsłużoną wartością.
