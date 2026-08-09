# Reaktywność z Proxy i jej granice

Zmiana `store.status` odświeża widok. Zmiana `store.customer.name` nie robi nic. Kod wygląda podobnie, ale `Proxy` obserwuje tylko operacje przechodzące przez konkretną nakładkę.

Po tej lekcji zbudujesz płytki magazyn reaktywny i rozpoznasz operację, która omija jego pułapkę.

## 🧠 Najpierw przewidź dwa wyniki

```javascript
const changes = [];
const state = { status: 'idle', customer: { name: 'Ada' } };

const store = new Proxy(state, {
  set(target, key, value, receiver) {
    changes.push(String(key));
    return Reflect.set(target, key, value, receiver);
  }
});

store.status = 'loading';
store.customer.name = 'Ola';
```

Zapisz zawartość `changes`. Dopiero potem uruchom kod.

## 🧭 Model: obserwowana jest operacja, nie cała struktura

Przypisanie `store.status` wywołuje pułapkę `set` zewnętrznego Proxy.

Przy `store.customer.name` najpierw działa odczyt `store.customer`. Zwraca on zwykły obiekt `customer`. Późniejsze przypisanie `name` odbywa się już na tym zwykłym obiekcie.

```text
store.status = ...
└─ przechodzi przez Proxy -> pułapka set

store.customer.name = ...
├─ store.customer -> zwraca zwykły obiekt
└─ zwykłyObiekt.name = ... -> omija zewnętrzne Proxy
```

Ten magazyn jest **płytki**. Nie nazywaj go głęboko reaktywnym.

`Reflect.set(target, key, value, receiver)` wykonuje standardową operację ustawienia i zwraca informację o powodzeniu. Zwracaj ten wynik z pułapki zamiast zakładać, że zapis zawsze się udał.

## 🔬 Sprawdź przyczynę śladem

Dodaj pułapkę `get` tylko na czas diagnozy:

```javascript
get(target, key, receiver) {
  console.log('get', String(key));
  return Reflect.get(target, key, receiver);
}
```

Dla zmiany imienia zobaczysz odczyt `customer`, lecz nie zobaczysz `set name`. To dowód, że przypisanie nie przeszło przez obserwowaną granicę.

Możliwe strategie to zastępowanie całej gałęzi, jawna metoda `update()` albo rekurencyjne opakowywanie z pamięcią podręczną Proxy. W tej lekcji wybieramy pierwszą strategię, bo jej koszt i granice są czytelne.

```javascript
store.customer = { ...store.customer, name: 'Ola' };
```

## 🛠️ Punkt kontrolny: wybierz operację widoczną

<data-gate>
  <data-quiz>
    <question>Która zmiana zostanie zauważona przez płytkie Proxy obiektu `store`?</question>
    <options>
      <option>`store.customer.name = 'Ola'`</option>
      <option correct>`store.customer = { ...store.customer, name: 'Ola' }`</option>
      <option>`const name = store.customer.name`</option>
    </options>
    <div data-hint="error">Pułapka `set` musi otrzymać klucz należący bezpośrednio do obiektu opakowanego przez Proxy.</div>
    <div data-hint="success">Zastąpienie `customer` przechodzi przez zewnętrzną pułapkę `set`.</div>
  </data-quiz>
</data-gate>

## 🧪 Zbuduj płytki magazyn

Funkcja ma zwracać `{ state, changes }`. Każde przypisanie bezpośredniej właściwości zapisuje obiekt `{ key, previous, next }`.

Nie zapisuj zmiany, gdy nowa wartość jest równa poprzedniej według `Object.is`.

<data-gate>
  <data-code-runner language="javascript" title="Obserwuj bezpośrednie zmiany stanu">
    <template data-type="code">
function createShallowStore(initialState) {
  const changes = [];
  return { state: initialState, changes };
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "record-change",
          "text": "Magazyn zapisuje zmianę bezpośredniej właściwości",
          "type": "test-case",
          "functionName": "exerciseStore",
          "input": [{"status":"idle"},[["status","loading"]]],
          "expected": [{"key":"status","previous":"idle","next":"loading"}]
        },
        {
          "id": "ignore-same",
          "text": "Przypisanie tej samej wartości nie tworzy zmiany",
          "type": "test-case",
          "functionName": "exerciseStore",
          "input": [{"status":"idle"},[["status","idle"]]],
          "expected": []
        },
        {
          "id": "record-sequence",
          "text": "Kolejne przypisania zachowują poprzednią wartość",
          "type": "test-case",
          "functionName": "exerciseStore",
          "input": [{"count":0},[["count",1],["count",2]]],
          "expected": [{"key":"count","previous":0,"next":1},{"key":"count","previous":1,"next":2}]
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

W edytorze dopisz także funkcję pomocniczą używaną przez test:

```javascript
function exerciseStore(initialState, operations) {
  const { state, changes } = createShallowStore(initialState);
  operations.forEach(([key, value]) => {
    state[key] = value;
  });
  return changes;
}
```

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function createShallowStore(initialState) {
  const changes = [];

  const state = new Proxy({ ...initialState }, {
    set(target, key, value, receiver) {
      const previous = Reflect.get(target, key, receiver);

      if (Object.is(previous, value)) return true;

      const didSet = Reflect.set(target, key, value, receiver);
      if (didSet) {
        changes.push({ key: String(key), previous, next: value });
      }
      return didSet;
    }
  });

  return { state, changes };
}

function exerciseStore(initialState, operations) {
  const { state, changes } = createShallowStore(initialState);
  operations.forEach(([key, value]) => {
    state[key] = value;
  });
  return changes;
}
```

Kopia `initialState` chroni obiekt przekazany przez wywołującego przed bezpośrednią zmianą.

</details>

## 🔄 Sprawdź granicę na zmienionym przypadku

Użyj magazynu ze stanem `{ customer: { name: 'Ada' } }`. Najpierw zmień samo `name`. Potem zastąp całe `customer`.

Kryterium: potrafisz przewidzieć liczbę wpisów w `changes` i uzasadnić ją ścieżką operacji. Nie wystarczy odpowiedź „Proxy nie działa z obiektami zagnieżdżonymi”. Działa, ale tylko tam, gdzie operacja przechodzi przez opakowany obiekt.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Określaj, która konkretna operacja przechodzi przez Proxy.
- Nazywaj płytki magazyn płytkim i pokazuj jego granicę śladem.
- Używaj `Reflect` do zachowania standardowej semantyki operacji.
