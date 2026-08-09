# Zdarzenia dynamicznego DOM i dostępny akordeon

Lista pytań jest pobierana po otwarciu strony. Jeśli dodasz listener osobno do każdego przycisku przed pobraniem danych, nowe przyciski nie otrzymają obsługi.

Po tej lekcji obsłużysz elementy dodane później i utrzymasz zgodność widoku z `aria-expanded`.

## 🧠 Najpierw wybierz miejsce obsługi

Masz pusty kontener `#faq`. Po sekundzie skrypt dodaje do niego pięć przycisków.

Wskaż element, który istnieje zarówno przed, jak i po dodaniu pytań. To na nim można umieścić jeden listener delegujący zdarzenia.

```html
<section id="faq" aria-label="Najczęstsze pytania"></section>
```

## 🏗️ Model: zdarzenie przechodzi przez przodków

Zdarzenie `click` powstałe na przycisku bąbelkuje przez jego przodków. Listener kontenera może sprawdzić `event.target.closest(...)` i ustalić, który przycisk zainicjował działanie.

To jest **delegacja zdarzeń**. Jej zaletą w tym przypadku nie jest sama liczba listenerów. Najważniejsze jest to, że kontener istnieje przed dynamicznie dodanymi elementami.

```javascript
const faq = document.querySelector('#faq');

faq.addEventListener('click', event => {
  const button = event.target.closest('button[data-controls]');

  if (!button || !faq.contains(button)) return;

  toggleDisclosure(button);
});
```

Warunek `faq.contains(button)` chroni przed obsłużeniem przycisku znalezionego poza właściwym kontenerem.

## 🔍 Połącz widok ze stanem dostępnym

Przycisk ma wskazywać kontrolowany panel przez `aria-controls`. Atrybut `aria-expanded` opisuje bieżący stan rozwinięcia.

```html
<h2>
  <button type="button"
          data-controls="answer-delivery"
          aria-controls="answer-delivery"
          aria-expanded="false">
    Kiedy dotrze zamówienie?
  </button>
</h2>

<div id="answer-delivery" hidden>
  Termin zależy od wybranej metody dostawy.
</div>
```

```javascript
function toggleDisclosure(button) {
  const panelId = button.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const willExpand = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(willExpand));
  panel.hidden = !willExpand;
}
```

Natywny przycisk obsługuje aktywację klawiaturą. Nie dodawaj osobnego listenera `keydown`, który ponownie emituje kliknięcie dla <kbd>Enter</kbd> lub <kbd>Spacja</kbd>.

## 🛠️ Punkt kontrolny: napraw rozjazd stanu

<data-gate>
  <data-quiz>
    <question>Panel jest widoczny, ale przycisk nadal ma `aria-expanded="false"`. Która poprawka usuwa przyczynę?</question>
    <options>
      <option>Dodać klasę z innym kolorem przycisku.</option>
      <option correct>Aktualizować `hidden` i `aria-expanded` na podstawie tej samej wartości `willExpand`.</option>
      <option>Dodać drugi listener `click` bezpośrednio do panelu.</option>
    </options>
    <div data-hint="error">Szukaj dwóch reprezentacji jednego stanu: widoczności panelu i informacji na kontrolce.</div>
    <div data-hint="success">Jedna wartość decyzyjna zapobiega sytuacji, w której DOM i stan dostępny mówią co innego.</div>
  </data-quiz>
</data-gate>

## 🧪 Zaimplementuj przejście stanu

Funkcja otrzymuje stan bieżący oraz identyfikator klikniętego panelu. Zwróć nowy stan.

Założenie: jednocześnie może być otwarty najwyżej jeden panel. Kliknięcie otwartego panelu zamyka go.

<data-gate>
  <data-code-runner language="javascript" title="Steruj stanem dostępnego akordeonu">
    <template data-type="code">
function nextDisclosureState(state, clickedId) {
  return state;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "open-panel",
          "text": "Kliknięcie zamkniętego panelu otwiera wskazany identyfikator",
          "type": "test-case",
          "functionName": "nextDisclosureState",
          "input": [{"expandedId": null}, "delivery"],
          "expected": {"expandedId": "delivery"}
        },
        {
          "id": "close-panel",
          "text": "Kliknięcie otwartego panelu zamyka wszystkie panele",
          "type": "test-case",
          "functionName": "nextDisclosureState",
          "input": [{"expandedId": "delivery"}, "delivery"],
          "expected": {"expandedId": null}
        },
        {
          "id": "switch-panel",
          "text": "Kliknięcie innego panelu przełącza otwarty identyfikator",
          "type": "test-case",
          "functionName": "nextDisclosureState",
          "input": [{"expandedId": "payment"}, "delivery"],
          "expected": {"expandedId": "delivery"}
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

Po zaliczeniu połącz wynik z DOM: dla każdego przycisku ustaw `aria-expanded` na podstawie porównania jego identyfikatora z `expandedId`. Panel ukryj, gdy identyfikatory się różnią.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

```javascript
function nextDisclosureState(state, clickedId) {
  return {
    expandedId: state.expandedId === clickedId ? null : clickedId
  };
}
```

Typowy błąd polega na przełączeniu tylko wartości logicznej. Taka wartość nie wskazuje, który z kilku paneli ma być otwarty.

</details>

## 🔄 Sprawdź zmieniony przypadek

Dodaj wewnątrz nagłówka przycisku ikonę `<span>`. Kliknięcie trafia wtedy w ikonę, nie bezpośrednio w przycisk.

Wyjaśnij, dlaczego `event.target.matches('button')` zawiedzie, a `event.target.closest('button[data-controls]')` nadal znajdzie kontrolkę.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Deleguj zdarzenie do stabilnego przodka, gdy elementy potomne powstają później.
- Wyprowadzaj widoczność i `aria-expanded` z jednej decyzji o stanie.
- Korzystaj z natywnej semantyki przycisku zamiast odtwarzać ją listenerami klawiatury.
