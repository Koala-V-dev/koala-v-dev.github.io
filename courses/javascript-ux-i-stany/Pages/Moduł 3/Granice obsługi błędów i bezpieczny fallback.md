# Granice obsługi błędów i bezpieczny fallback

Widget ceny przestaje działać. Globalny `catch` pokazuje „Coś poszło nie tak”, ale usuwa także resztę panelu. Użytkownik traci możliwość dokończenia zamówienia, a log nie wskazuje wadliwego kroku.

Po tej lekcji wyznaczysz granicę błędu, zachowasz jego przyczynę i pokażesz fallback, który podtrzymuje podstawowe zadanie.

## 🧠 Najpierw wybierz najmniejszy obszar utraty

Panel składa się z adresu, listy produktów i kalkulatora rabatu. Tylko kalkulator rzuca wyjątek.

Który obszar powinien zastąpić fallback?

Jeśli komponenty są niezależne, utrata całego panelu jest zbyt szeroka. Granica powinna objąć kalkulator, a pozostałe dane zachować.

## 🧭 Model: przechwyć tam, gdzie potrafisz zareagować

`try...catch` ma sens w miejscu, które może wykonać konkretną korektę:

```text
operacja niskiego poziomu
└─ rzuca błąd techniczny
   └─ granica funkcji dodaje kontekst
      └─ granica widoku wybiera fallback
```

Nie połykaj błędu pustym `catch`. Jeśli dodajesz kontekst, zachowaj pierwotną przyczynę.

```javascript
async function loadDiscount(orderId) {
  try {
    return await discountApi.get(orderId);
  } catch (error) {
    throw new Error(`Nie udało się pobrać rabatu dla ${orderId}`, {
      cause: error
    });
  }
}
```

Komunikat dla użytkownika nie powinien ujawniać stosu, adresu endpointu ani danych wewnętrznych. Diagnostyka trafia do kontrolowanego logu.

## 🔬 Zaprojektuj fallback wokół zadania

```javascript
async function renderDiscount(orderId) {
  try {
    const discount = await loadDiscount(orderId);
    showDiscount(discount);
  } catch (error) {
    reportError(error, { feature: 'discount', orderId });
    showDiscountFallback({
      message: 'Rabatu nie można teraz obliczyć.',
      action: 'Spróbuj ponownie'
    });
  }
}
```

Fallback nie udaje sukcesu. Mówi, czego nie udało się zrobić, i daje działanie możliwe do wykonania. Lista produktów pozostaje dostępna.

Ponowienie powinno mieć limit lub stan `loading`, aby seria kliknięć nie tworzyła lawiny żądań. Wykorzystaj maszynę stanów z poprzedniego modułu.

## 🛠️ Punkt kontrolny: zachowaj sygnał

<data-gate>
  <data-quiz>
    <question>Który `catch` daje użytkownikowi fallback i zachowuje dane diagnostyczne?</question>
    <options>
      <option>`catch {}`</option>
      <option correct>`catch (error) { reportError(error); showFallback(); }`</option>
      <option>`catch (error) { showSuccess(); }`</option>
    </options>
    <div data-hint="error">Potrzebne są dwa różne wyjścia: bezpieczne dla użytkownika i diagnostyczne dla zespołu.</div>
    <div data-hint="success">Błąd nie znika, ale szczegóły nie muszą być wyświetlane odbiorcy.</div>
  </data-quiz>
</data-gate>

## 🧪 Zamień błąd na stan widoku

Funkcja otrzymuje wynik operacji. Dla sukcesu zachowuje dane. Dla znanych kodów błędu wybiera konkretny komunikat i możliwość ponowienia. Nie zwracaj technicznego `detail` w komunikacie użytkownika.

<data-gate>
  <data-code-runner language="javascript" title="Zbuduj bezpieczny stan fallbacku">
    <template data-type="code">
function toViewState(result) {
  return { status: 'unknown' };
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "success",
          "text": "Sukces zachowuje dane",
          "type": "test-case",
          "functionName": "toViewState",
          "input": [{"ok":true,"data":{"discount":10}}],
          "expected": {"status":"success","data":{"discount":10}}
        },
        {
          "id": "offline",
          "text": "Błąd sieci daje możliwość ponowienia",
          "type": "test-case",
          "functionName": "toViewState",
          "input": [{"ok":false,"code":"NETWORK","detail":"fetch /private failed"}],
          "expected": {"status":"error","message":"Sprawdź połączenie i spróbuj ponownie.","canRetry":true}
        },
        {
          "id": "invalid",
          "text": "Błąd danych nie jest bez końca ponawiany",
          "type": "test-case",
          "functionName": "toViewState",
          "input": [{"ok":false,"code":"INVALID_DATA","detail":"stack trace"}],
          "expected": {"status":"error","message":"Nie można wyświetlić tych danych.","canRetry":false}
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function toViewState(result) {
  if (result.ok) {
    return { status: 'success', data: result.data };
  }

  if (result.code === 'NETWORK') {
    return {
      status: 'error',
      message: 'Sprawdź połączenie i spróbuj ponownie.',
      canRetry: true
    };
  }

  return {
    status: 'error',
    message: 'Nie można wyświetlić tych danych.',
    canRetry: false
  };
}
```

Pole `detail` może trafić do bezpiecznej diagnostyki, lecz nie jest częścią stanu prezentowanego użytkownikowi.

</details>

## 🔄 Przetestuj awarię zależności

Zastąp funkcję API atrapą, która odrzuca Promise. Sprawdź, czy panel produktów pozostaje aktywny, fallback rabatu otrzymuje fokus tylko wtedy, gdy jest to potrzebne, a przycisk „Spróbuj ponownie” nie uruchamia dwóch żądań naraz.

Kryterium: potrafisz pokazać log z zachowaną przyczyną oraz działający podstawowy przepływ użytkownika.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Umieszczaj granicę błędu tam, gdzie istnieje konkretna reakcja naprawcza.
- Zachowuj pierwotną przyczynę dla diagnostyki.
- Projektuj fallback wokół zadania, które użytkownik nadal może wykonać.
