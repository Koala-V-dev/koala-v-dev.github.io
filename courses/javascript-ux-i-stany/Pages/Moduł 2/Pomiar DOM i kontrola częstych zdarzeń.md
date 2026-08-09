# Pomiar DOM i kontrola częstych zdarzeń

Podczas przewijania panel odczytuje położenie elementu i natychmiast zmienia jego styl. Powtórzenie tego schematu dla wielu elementów miesza pomiary z zapisami i utrudnia kontrolę kosztu.

Po tej lekcji rozdzielisz odczyty od zapisów oraz zredukujesz serię zdarzeń do jednej aktualizacji na klatkę.

## 🧠 Najpierw oznacz operacje

Przypisz każdej linii literę `R` jak odczyt albo `W` jak zapis.

```javascript
card.style.transform = 'translateX(10px)';
const width = card.getBoundingClientRect().width;
card.style.width = `${width + 20}px`;
const nextWidth = card.getBoundingClientRect().width;
```

Powstaje sekwencja `W R W R`. Zanim przeglądarka odpowie na pomiar, może potrzebować uaktualnić informacje o układzie po wcześniejszym zapisie.

## 🧭 Model: zbierz odczyty, potem wykonaj zapisy

Lepszy układ pracy ma dwie wyraźne fazy:

```text
READ
├─ getBoundingClientRect pierwszego elementu
└─ getBoundingClientRect drugiego elementu

WRITE
├─ zmiana stylu pierwszego elementu
└─ zmiana stylu drugiego elementu
```

Nie każdy odczyt powoduje kosztowną pracę i nie da się określić czasu z samego kodu. Ten podział usuwa jednak przeplatanie, które może wymuszać powtarzane przeliczanie układu.

`getBoundingClientRect()` zwraca prostokąt elementu względem viewportu w chwili pomiaru. Po zmianie układu wcześniejszy wynik jest migawką, nie żywym obiektem planu aplikacji.

## 🔬 Ogranicz serię zdarzeń do klatki

`scroll` może pojawiać się wiele razy między kolejnymi aktualizacjami obrazu. Handler zapisuje najnowsze dane i planuje najwyżej jeden callback.

```javascript
let scheduled = false;
let latestScrollY = 0;

window.addEventListener('scroll', () => {
  latestScrollY = window.scrollY;

  if (scheduled) return;
  scheduled = true;

  requestAnimationFrame(() => {
    scheduled = false;

    const top = card.getBoundingClientRect().top; // READ
    const active = top < 80;

    card.classList.toggle('is-sticky', active);  // WRITE
    output.textContent = String(latestScrollY);  // WRITE
  });
}, { passive: true });
```

To nie jest debounce o określonym czasie. Callback jest powiązany z możliwością aktualizacji animacji przez przeglądarkę. Nadal trzeba zmierzyć koszt jego pracy w narzędziach wydajnościowych.

## 🛠️ Punkt kontrolny: znajdź aktualną wartość

<data-gate>
  <data-quiz>
    <question>Pięć zdarzeń `scroll` wystąpiło przed zaplanowanym callbackiem. Którą pozycję powinien wykorzystać callback?</question>
    <options>
      <option>Pierwszą, bo utworzyła callback.</option>
      <option correct>Najnowszą zapisaną wartość, bo opisuje stan w chwili wykonania.</option>
      <option>Średnią ze wszystkich pozycji.</option>
    </options>
    <div data-hint="error">Flaga ogranicza liczbę callbacków, ale dane mogą być aktualizowane przy każdym zdarzeniu.</div>
    <div data-hint="success">Jeden callback obsługuje skumulowaną serię, używając najnowszego stanu.</div>
  </data-quiz>
</data-gate>

## 🧪 Zaplanuj fazy pracy

Otrzymujesz operacje `read` i `write` w kolejności zgłoszenia. Zwróć plan, w którym wszystkie odczyty tej klatki występują przed zapisami. Zachowaj kolejność wewnątrz każdej grupy.

<data-gate>
  <data-code-runner language="javascript" title="Rozdziel odczyty od zapisów">
    <template data-type="code">
function planFrame(operations) {
  return operations;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "separate-phases",
          "text": "Odczyty poprzedzają zapisy",
          "type": "test-case",
          "functionName": "planFrame",
          "input": [[{"type":"write","id":"w1"},{"type":"read","id":"r1"},{"type":"write","id":"w2"},{"type":"read","id":"r2"}]],
          "expected": [{"type":"read","id":"r1"},{"type":"read","id":"r2"},{"type":"write","id":"w1"},{"type":"write","id":"w2"}]
        },
        {
          "id": "stable-order",
          "text": "Kolejność operacji w fazie pozostaje stabilna",
          "type": "test-case",
          "functionName": "planFrame",
          "input": [[{"type":"read","id":"r2"},{"type":"read","id":"r1"},{"type":"write","id":"w2"},{"type":"write","id":"w1"}]],
          "expected": [{"type":"read","id":"r2"},{"type":"read","id":"r1"},{"type":"write","id":"w2"},{"type":"write","id":"w1"}]
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function planFrame(operations) {
  const reads = operations.filter(operation => operation.type === 'read');
  const writes = operations.filter(operation => operation.type === 'write');
  return [...reads, ...writes];
}
```

Ta funkcja modeluje kolejność. W kodzie DOM kolejka przechowywałaby funkcje do wykonania w zaplanowanym callbacku.

</details>

## 🔄 Zmierz zmieniony przypadek

Dodaj drugi element i świadomie ułóż callback: najpierw dwa wywołania `getBoundingClientRect()`, potem dwie zmiany klas.

W panelu Performance nagraj przewijanie przed i po zmianie. Kryterium nie brzmi „zielony wykres”. Zapisz liczbę callbacków, czas najdłuższego callbacka i czy podczas testu pojawiło się widoczne zacięcie.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oznaczaj operacje DOM jako odczyty lub zapisy przed optymalizacją.
- Grupuj odczyty przed zapisami w obrębie aktualizacji.
- Redukuj serię częstych zdarzeń do pracy o mierzalnym koszcie.
