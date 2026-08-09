# Czysty reducer i niezmienny stan

W panelu zamówienia ten sam stan wejściowy raz daje identyfikator `1712`, a chwilę później `1713`. Historia działań nie wystarcza już do odtworzenia błędu.

Po tej lekcji napiszesz reducer, który daje przewidywalny wynik i nie zmienia przekazanego stanu.

## 🧠 Najpierw znajdź źródło nieprzewidywalności

Przeczytaj kod bez uruchamiania. Wskaż dwie operacje, których wyniku nie da się wyjaśnić wyłącznie przez `state` i `action`.

```javascript
function orderReducer(state, action) {
  if (action.type === 'item/added') {
    state.items.push({
      id: Date.now(),
      name: action.name
    });
  }

  return state;
}
```

Pierwszy problem to `Date.now()`. Drugi to `push()` wykonany na tablicy należącej do poprzedniego stanu.

## 🧭 Model: wynik zależy od dwóch wejść

Reducer ma kontrakt:

```text
poprzedni stan + działanie -> następny stan
```

Nie pobiera danych. Nie uruchamia timera. Nie tworzy losowego identyfikatora. Takie efekty wykonuje kod poza reducerem, a ich wyniki trafiają w działaniu.

```javascript
const action = {
  type: 'item/added',
  payload: { id: 'line-8', name: 'Klawiatura' }
};
```

Reducer może teraz odtworzyć wynik z samych argumentów.

Niezmienność nie oznacza, że obiekty JavaScript stają się fizycznie niezmienne. Oznacza, że reducer nie modyfikuje otrzymanych struktur. Tworzy kopię każdego poziomu, który zmienia.

```javascript
return {
  ...state,
  items: [...state.items, action.payload]
};
```

## 🔬 Zbierz dowód referencjami

Po redukcji zachowaj referencję do starego stanu.

```javascript
const before = {
  status: 'editing',
  items: [{ id: 'line-1', name: 'Mysz' }]
};

const after = orderReducer(before, action);
```

Sprawdź trzy fakty:

```javascript
console.log(before.items.length);       // nadal 1
console.log(after === before);          // false
console.log(after.items === before.items); // false
```

To nie jest lista do zapamiętania. Każdy wynik odpowiada na inne pytanie: czy stary zapis przetrwał, czy powstał nowy stan i czy zmieniona gałąź dostała nową referencję.

## 🛠️ Punkt kontrolny: oddziel efekt

<data-gate>
  <data-quiz>
    <question>Gdzie powinien powstać identyfikator nowej pozycji, aby reducer pozostał czysty?</question>
    <options>
      <option>W reducerze przez `Date.now()`.</option>
      <option correct>Przed wywołaniem reducera, a następnie w `action.payload`.</option>
      <option>Po zwróceniu stanu przez dopisanie pola do obiektu.</option>
    </options>
    <div data-hint="error">Uruchom reducer dwa razy z dokładnie tymi samymi argumentami. Wyniki powinny być równe.</div>
    <div data-hint="success">Działanie staje się pełnym zapisem zdarzenia, a reducer tylko oblicza zmianę.</div>
  </data-quiz>
</data-gate>

## 🧪 Zbuduj reducer koszyka

Obsłuż działania `item/added` i `item/quantityChanged`. Nie zmieniaj `state`, `state.items` ani obiektu pozycji.

<data-gate>
  <data-code-runner language="javascript" title="Aktualizuj stan bez mutacji">
    <template data-type="code">
function orderReducer(state, action) {
  return state;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "add-item",
          "text": "Dodanie zachowuje stare pozycje i dopisuje payload",
          "type": "test-case",
          "functionName": "orderReducer",
          "input": [{"items":[{"id":"a","quantity":1}]},{"type":"item/added","payload":{"id":"b","quantity":1}}],
          "expected": {"items":[{"id":"a","quantity":1},{"id":"b","quantity":1}]}
        },
        {
          "id": "change-one",
          "text": "Zmiana ilości dotyczy tylko wskazanej pozycji",
          "type": "test-case",
          "functionName": "orderReducer",
          "input": [{"items":[{"id":"a","quantity":1},{"id":"b","quantity":1}]},{"type":"item/quantityChanged","payload":{"id":"b","quantity":3}}],
          "expected": {"items":[{"id":"a","quantity":1},{"id":"b","quantity":3}]}
        },
        {
          "id": "unknown-action",
          "text": "Nieznane działanie nie zmienia wartości stanu",
          "type": "test-case",
          "functionName": "orderReducer",
          "input": [{"items":[{"id":"a","quantity":1}]},{"type":"coupon/ignored"}],
          "expected": {"items":[{"id":"a","quantity":1}]}
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

Kryterium ukończenia: ponowne użycie tego samego stanu wejściowego nie może ujawnić zmian wykonanych przez wcześniejsze wywołanie.

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function orderReducer(state, action) {
  switch (action.type) {
    case 'item/added':
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'item/quantityChanged':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    default:
      return state;
  }
}
```

`map()` tworzy nową tablicę. Kopia obiektu powstaje tylko dla zmienianej pozycji.

</details>

## 🔄 Przenieś umiejętność na stan zagnieżdżony

Dodaj `delivery.address.city`. Zmień miasto bez modyfikacji wcześniejszego stanu.

Narysuj najpierw ścieżkę `state -> delivery -> address -> city`. Nowej kopii potrzebuje każdy obiekt leżący na tej ścieżce. Obiekt `items` może zachować referencję, bo nie jest zmieniany.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wyprowadzaj następny stan wyłącznie z `state` i `action`.
- Przekazuj wynik efektu, na przykład identyfikator, w działaniu.
- Kopiuj każdy zmieniany poziom, aby poprzedni stan pozostał wiarygodnym zapisem.
