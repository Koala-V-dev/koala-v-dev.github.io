# Bezpieczny Web Component z Shadow DOM

Komponent etykiety działa po pierwszym wstawieniu, lecz nie reaguje na zmianę atrybutu. Po ponownym podłączeniu dodaje drugi listener. Dodatkowo wkłada tekst atrybutu przez `innerHTML`.

Po tej lekcji zbudujesz element niestandardowy z jawnym cyklem życia, aktualizacją atrybutów i bezpiecznym renderowaniem tekstu.

## 🧠 Najpierw wskaż trzy granice

Przeczytaj szkic:

```javascript
class OrderBadge extends HTMLElement {
  connectedCallback() {
    this.innerHTML = this.getAttribute('label');
    this.addEventListener('click', () => this.toggle());
  }
}
```

Wskaż osobno:

- dane z atrybutu,
- moment podłączenia elementu,
- funkcję listenera potrzebną do późniejszego usunięcia.

Te trzy miejsca prowadzą do trzech różnych usterek. Sama zamiana klasy CSS nie naprawi żadnej z nich.

## 🧭 Model: konstrukcja, połączenie, zmiana, rozłączenie

```text
constructor
└─ utwórz Shadow Root i stałą strukturę

connectedCallback
└─ podłącz zasoby zależne od dokumentu

attributeChangedCallback
└─ zsynchronizuj obserwowany atrybut

disconnectedCallback
└─ usuń listenery i inne zasoby
```

Konstruktor powinien przygotować własną strukturę, lecz nie zakładać, że element jest już połączony z dokumentem.

Lista `observedAttributes` określa, które zmiany wywołają callback.

## 🔬 Renderuj tekst jako tekst

```javascript
class OrderBadge extends HTMLElement {
  static observedAttributes = ['label', 'variant'];

  #button;
  #onClick = () => this.toggleAttribute('selected');

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    this.#button = document.createElement('button');
    this.#button.type = 'button';
    root.append(this.#button);
  }

  connectedCallback() {
    this.#button.addEventListener('click', this.#onClick);
    this.#render();
  }

  disconnectedCallback() {
    this.#button.removeEventListener('click', this.#onClick);
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    this.#button.textContent = this.getAttribute('label') ?? 'Zamówienie';
    this.#button.dataset.variant = normalizeVariant(
      this.getAttribute('variant')
    );
  }
}

customElements.define('order-badge', OrderBadge);
```

`textContent` nie interpretuje etykiety jako HTML. Wartość `variant` przechodzi przez listę dozwolonych wariantów, zanim wpłynie na styl.

Ten komponent ma otwarty Shadow Root ze względu na prostą diagnostykę kursową. Zamknięty root nie jest zabezpieczeniem dla niezaufanych danych i nie zastępuje walidacji.

## 🛠️ Punkt kontrolny: napraw wyciek listenera

<data-gate>
  <data-quiz>
    <question>Dlaczego anonimowy listener dodany w `connectedCallback()` utrudnia poprawne odłączenie?</question>
    <options>
      <option>Shadow DOM nie obsługuje listenerów.</option>
      <option correct>`removeEventListener` potrzebuje tej samej referencji funkcji, której użyto przy dodaniu.</option>
      <option>Listener można usuwać tylko z `window`.</option>
    </options>
    <div data-hint="error">Porównaj drugi argument wywołań `addEventListener` i `removeEventListener`.</div>
    <div data-hint="success">Pole klasy przechowuje stabilną funkcję przez cały cykl życia instancji.</div>
  </data-quiz>
</data-gate>

## 🧪 Ogranicz wariant do kontraktu

Komponent obsługuje tylko `neutral`, `success` i `warning`. Każda inna wartość, brak wartości i inny typ mają dać `neutral`.

<data-gate>
  <data-code-runner language="javascript" title="Waliduj publiczny atrybut komponentu">
    <template data-type="code">
function normalizeVariant(value) {
  return value;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "allowed",
          "text": "Dozwolony wariant pozostaje bez zmian",
          "type": "test-case",
          "functionName": "normalizeVariant",
          "input": ["success"],
          "expected": "success"
        },
        {
          "id": "unknown",
          "text": "Nieznany wariant dostaje bezpieczną wartość domyślną",
          "type": "test-case",
          "functionName": "normalizeVariant",
          "input": ["url(javascript:bad)"],
          "expected": "neutral"
        },
        {
          "id": "missing",
          "text": "Brak atrybutu dostaje wartość domyślną",
          "type": "test-case",
          "functionName": "normalizeVariant",
          "input": [null],
          "expected": "neutral"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function normalizeVariant(value) {
  const allowed = new Set(['neutral', 'success', 'warning']);
  return allowed.has(value) ? value : 'neutral';
}
```

Lista dozwolonych wartości jest jednocześnie dokumentacją publicznego kontraktu atrybutu.

</details>

## 🔄 Sprawdź ponowne podłączenie

Dodaj komponent do dokumentu, odłącz go przez `remove()`, a potem dodaj ponownie. Kliknij raz.

Kryterium: stan `selected` zmienia się dokładnie raz. Następnie zmień `label` przez `setAttribute` i potwierdź aktualizację tekstu bez ponownego tworzenia elementu.

Na końcu ustaw etykietę na tekst `<img src=x onerror=alert(1)>`. Ma pojawić się dosłowny tekst, a nie element obrazu.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Rozdzielaj odpowiedzialności callbacków cyklu życia komponentu.
- Przechowuj stabilne referencje listenerów i usuwaj je przy rozłączeniu.
- Renderuj niezaufane etykiety jako tekst i ograniczaj atrybuty do jawnego kontraktu.
