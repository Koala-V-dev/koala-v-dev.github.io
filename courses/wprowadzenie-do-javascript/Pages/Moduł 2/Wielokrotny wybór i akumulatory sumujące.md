# Wielokrotny wybór i akumulatory sumujące

W aplikacjach e-commerce, konfiguratorach sprzętu czy panelach rezerwacyjnych rzadko kiedy klient wybiera tylko jedną pozycję. Najczęściej ma możliwość zaznaczenia dowolnego zestawu opcji dodatkowych: od braku jakichkolwiek dodatków, przez jedną lub dwie pozycje, aż po zaznaczenie wszystkich. Służą do tego pola wyboru typu checkbox (`<input type="checkbox">`).

W tej lekcji zaczniemy od formularza wyboru usług pielęgnacyjnych, zrozumiemy działanie właściwości `.checked` w pamięci DOM, poznamy wzorzec akumulatora sumującego i wyeliminujemy niebezpieczny błąd wycieku sumy w zasięgu globalnym, rozwiążemy wyzwanie w edytorze kodu na przykładzie konfiguratora komputera, a na koniec samodzielnie zaprogramujemy sumator zabiegów.

---

## 🏗️ Punkt wyjścia: Formularz wielokrotnego wyboru

Oto kod HTML formularza wyceny zabiegów:

```html
<form id="form-zabiegi">
  <h2>Wybierz zabiegi pielęgnacyjne</h2>
  
  <label><input type="checkbox" id="chk-strzyzenie"> Strzyżenie (25 zł)</label><br>
  <label><input type="checkbox" id="chk-czesanie"> Czesanie (30 zł)</label><br>
  <label><input type="checkbox" id="chk-koloryzacja"> Koloryzacja (50 zł)</label><br>
  
  <button type="button" id="btn-cena">Odkryj cenę</button>
  <p id="wynik-cena"></p>
</form>
```

Wymagania biznesowe:
- Klient może zaznaczyć dowolną kombinację usług lub nie wybrać żadnej.
- Po kliknięciu przycisku skrypt ma zsumować ceny wszystkich zaznaczonych pozycji.
- Jeśli żadne pole nie zostało zaznaczone, cena wynosi `0 zł`.
- Wynik ma pojawić się w akapicie w formacie: `Cena zabiegów: XX zł`.

---

## ☑️ Odczyt stanu checkboxa: właściwość .checked

W przypadku pól tekstowych odpytujemy właściwość `.value`. Jednak dla pól typu checkbox właściwość `.value` kryje niebezpieczną pułapkę: domyślnie zwraca ona napis `"on"` **niezależnie od tego, czy pole jest zaznaczone, czy puste**!

Do badania faktycznego stanu zaznaczenia służy właściwość **`.checked`**, która zwraca czystą wartość logiczną typu boolean:
- **`true`** - gdy użytkownik postawił w polu ptaszek.
- **`false`** - gdy pole pozostało odznaczone.

```javascript
const chkStrzyzenie = document.querySelector("#chk-strzyzenie");

if (chkStrzyzenie.checked) {
  console.log("Klient wybrał strzyżenie!");
} else {
  console.log("Pole strzyżenia jest puste.");
}
```

---

## 🧮 Wzorzec akumulatora i pułapka pamięci globalnej

Gdy musimy zsumować wartości z kilku niezależnych warunków, stosujemy zmienną zwaną **akumulatorem**. Akumulator zbiera cząstkowe kwoty i przechowuje bieżącą sumę.

Oto kardynalny błąd projektowy, który regularnie pojawia się w kodzie początkujących programistów:

```javascript
// ❌ KATASTROFALNY BŁĄD ZASIEGU ZMIENNEJ:
let cenaCalkowita = 0; // Zmienna zadeklarowana poza funkcją w zasięgu globalnym!

btnCena.addEventListener("click", () => {
  if (chkStrzyzenie.checked) cenaCalkowita += 25;
  if (chkCzesanie.checked) cenaCalkowita += 30;
  
  wynik.textContent = `Cena zabiegów: ${cenaCalkowita} zł`;
});
```

Co się stanie przy uruchomieniu tego kodu w przeglądarce?
1. Użytkownik zaznacza strzyżenie (25 zł) i czesanie (30 zł). Klika przycisk. Wynik wynosi **55 zł** (wygląda poprawnie).
2. Użytkownik decyduje się sprawdzić cenę jeszcze raz i klika przycisk ponownie. Ponieważ zmienna `cenaCalkowita` wisi w zasięgu globalnym i ma wartość 55, funkcja dodaje kwoty **ponownie do starej sumy**! Wynik: **110 zł**!
3. Każde kolejne kliknięcie powiększa rachunek o kolejne 55 zł!

Zmienna sumująca **musi być zawsze deklarowana i zerowana wewnątrz funkcji obsługującej zdarzenie**:

```javascript
// ✅ PRAWIDŁOWO:
btnCena.addEventListener("click", () => {
  let cenaCalkowita = 0; // Świeży reset przy każdym pojedynczym kliknięciu!

  if (chkStrzyzenie.checked) cenaCalkowita += 25;
  if (chkCzesanie.checked) cenaCalkowita += 30;
  if (chkKoloryzacja.checked) cenaCalkowita += 50;

  wynik.textContent = `Cena zabiegów: ${cenaCalkowita} zł`;
});
```

Dzięki temu każde wywołanie funkcji tworzy nową zmienną na stosie pamięci, zaczyna liczenie od czystego zera i niszczy zmienną po zakończeniu funkcji.

<data-gate>
  <data-quiz>
    <question>
Gdzie należy zadeklarować i wyzerować zmienną akumulatora sumującego opcje po kliknięciu przycisku?
    </question>
    <options>
      <option correct>Wewnątrz funkcji obsługującej kliknięcie, aby każda kalkulacja startowała od zera</option>
      <option>Poza funkcją w zasięgu globalnym, aby zachować wartość sumy między przeładowaniami</option>
      <option>W osobnym pliku konfiguracyjnym, aby zapobiec modyfikacji wartości przez przeglądarkę</option>
      <option>Bezpośrednio w atrybucie znacznika HTML, aby uniknąć tworzenia zmiennych w pamięci</option>
    </options>
    <div data-hint="error">
Zastanów się: co stanie się z wartością zmiennej, gdy użytkownik kliknie przycisk kilkukrotnie bez odświeżania strony?
    </div>
    <div data-hint="success">
Wspaniale! Zmienna lokalna wewnątrz funkcji jest tworzona na nowo przy każdym kliknięciu. Gwarantuje to, że wielokrotne wciskanie przycisku nie będzie dublować naliczonego rachunku.
    </div>
  </data-quiz>
</data-gate>

---

## 🧩 Dopasuj zachowania kontrolek checkbox

Sprawdź, jak przeglądarka i silnik JavaScript reagują na właściwości pól wielokrotnego wyboru.

<data-gate>
  <data-connection-matcher title="Właściwości pól wyboru checkbox">
    <div class="cmw-item" data-left="checkbox.checked" data-right="Zwraca wartość boolean true lub false w zależności od zaznaczenia"></div>
    <div class="cmw-item" data-left="checkbox.value" data-right="Zwraca wartość atrybutu (domyślnie 'on'), niezależnie od zaznaczenia"></div>
    <div class="cmw-item" data-left="Akumulator wewnątrz funkcji" data-right="Gwarantuje bezpieczne zerowanie sumy przed każdym przeliczeniem"></div>
    <div class="cmw-item" data-left="Akumulator w zasięgu globalnym" data-right="Powoduje błędne kumulowanie kwot przy wielokrotnych kliknięciach"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Konfigurator komputera gamingowego

Zastosujmy wzorzec akumulatora na niezależnym problemie biznesowym: konfiguratorze podzespołów komputerowych w sklepie ze sprzętem IT.

Klient kupuje jednostkę bazową komputera i zaznacza wybrane ulepszenia za pomocą pól checkbox.

Twoim zadaniem jest oprogramowanie funkcji `obliczCeneKomputera`.

Wymagania biznesowe:
- Parametr `cenaBazowa`: liczba reprezentująca cenę jednostki podstawowej.
- Parametry logiczne: `czyDyskSSD`, `czyDodatkowyRAM`, `czySystemWin` (wartości typu `boolean`).
- Cennik ulepszeń:
  - Dysk SSD $\to$ dopłata 250 zł.
  - Dodatkowy RAM $\to$ dopłata 400 zł.
  - System Windows $\to$ dopłata 550 zł.
- Jeśli `cenaBazowa <= 0` lub `isNaN(cenaBazowa)` $\to$ funkcja musi zwrócić `0`.
- Zwracana wartość: łączny koszt komputera jako liczba całkowita (np. 3000 zł bazy + 250 zł SSD = 3250 zł).

<data-gate>
  <data-code-runner language="javascript" title="Konfigurator zestawu PC">
    <template data-type="code">
function obliczCeneKomputera(cenaBazowa, czyDyskSSD, czyDodatkowyRAM, czySystemWin) {
  // TODO: Zaimplementuj walidację ceny bazowej oraz akumulator sumujący wybrane dodatki.
  // Pamiętaj: każda opcja może być zaznaczona niezależnie od pozostałych!
  
  return null;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-sama-baza",
          "text": "Baza 3000 zł bez dodatków daje 3000 zł",
          "type": "test-case",
          "functionName": "obliczCeneKomputera",
          "input": [3000, false, false, false],
          "expected": 3000
        },
        {
          "id": "test-wszystkie-dodatki",
          "text": "Baza 3000 zł ze wszystkimi dodatkami daje 4200 zł (3000 + 250 + 400 + 550)",
          "type": "test-case",
          "functionName": "obliczCeneKomputera",
          "input": [3000, true, true, true],
          "expected": 4200
        },
        {
          "id": "test-ram-system",
          "text": "Baza 2500 zł z RAM-em i systemem daje 3450 zł (2500 + 400 + 550)",
          "type": "test-case",
          "functionName": "obliczCeneKomputera",
          "input": [2500, false, true, true],
          "expected": 3450
        },
        {
          "id": "test-baza-zerowa",
          "text": "Cena bazowa 0 zł zwraca 0 zł niezależnie od dodatków",
          "type": "test-case",
          "functionName": "obliczCeneKomputera",
          "input": [0, true, true, false],
          "expected": 0
        },
        {
          "id": "test-baza-ujemna",
          "text": "Ujemna cena bazowa zwraca 0 zł",
          "type": "test-case",
          "functionName": "obliczCeneKomputera",
          "input": [-1000, true, false, false],
          "expected": 0
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 💇 Projekt końcowy: Ożywiamy sumator usług salonu

Wracamy do naszego formularza usług pielęgnacyjnych z początku lekcji:

```html
<label><input type="checkbox" id="chk-strzyzenie"> Strzyżenie (25 zł)</label><br>
<label><input type="checkbox" id="chk-czesanie"> Czesanie (30 zł)</label><br>
<label><input type="checkbox" id="chk-koloryzacja"> Koloryzacja (50 zł)</label><br>

<button type="button" id="btn-cena">Odkryj cenę</button>
<p id="wynik-cena"></p>
```

Cennik usług:
- Strzyżenie: 25 zł
- Czesanie: 30 zł
- Koloryzacja: 50 zł
- Format wyniku pod przyciskiem: `Cena zabiegów: XX zł`.

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz referencje do trzech pól wyboru, przycisku `#btn-cena` oraz akapitu `#wynik-cena`.
2. Zarejestruj nasłuchiwanie kliknięcia na przycisku.
3. Wewnątrz funkcji zainicjalizuj zmienną akumulatora `let suma = 0;`.
4. Sprawdź właściwość `.checked` dla każdego z trzech checkboxów. Za każdy zaznaczony element dodaj odpowiednią kwotę do zmiennej `suma`.
5. Wstaw sformatowany tekst `Cena zabiegów: ${suma} zł` do właściwości `textContent` akapitu wynikowego.

Spróbuj zaimplementować ten kod samodzielnie. Dopiero po zakończeniu próby sprawdź poniższy kod referencyjny.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy interfejsu
const chkStrzyzenie = document.querySelector("#chk-strzyzenie");
const chkCzesanie = document.querySelector("#chk-czesanie");
const chkKoloryzacja = document.querySelector("#chk-koloryzacja");
const btnCena = document.querySelector("#btn-cena");
const wynikAkapit = document.querySelector("#wynik-cena");

// 2. Podpinamy zdarzenie click
btnCena.addEventListener("click", () => {
  // 3. Akumulator lokalny - zerowany przy każdym kliknięciu!
  let suma = 0;

  // 4. Badanie stanu każdego checkboxa
  if (chkStrzyzenie.checked) {
    suma += 25;
  }
  if (chkCzesanie.checked) {
    suma += 30;
  }
  if (chkKoloryzacja.checked) {
    suma += 50;
  }

  // 5. Wyświetlenie sformatowanego wyniku w DOM
  wynikAkapit.textContent = `Cena zabiegów: ${suma} zł`;
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Pola checkbox pozwalają na niezależny wybór wielu opcji naraz.
- Stan zaznaczenia pola checkbox sprawdzamy przez właściwość `.checked`, która zwraca wartość logiczną `true` lub `false`.
- Zmienną akumulatora sumującego zawsze tworzymy i zerujemy wewnątrz funkcji obsługującej zdarzenie, aby wielokrotne kliknięcia nie kumulowały sumy.
- Wzorzec niezależnych instrukcji `if (warunek) suma += kwota;` pozwala na obsłużenie dowolnej kombinacji zaznaczeń.
