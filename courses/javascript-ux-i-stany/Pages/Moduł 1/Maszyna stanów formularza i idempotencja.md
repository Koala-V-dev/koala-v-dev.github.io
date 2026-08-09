# Maszyna stanów formularza i idempotencja

Użytkownik klika „Zapłać” dwa razy. Wyłączenie przycisku ogranicza drugi klik w tym widoku, ale odświeżenie strony lub ponowienie żądania nadal może dotrzeć do serwera.

Po tej lekcji zablokujesz niedozwolone przejścia interfejsu i odróżnisz tę ochronę od gwarancji transakcji po stronie serwera.

## 🧠 Najpierw oceń przejście

Formularz ma stany `editing`, `submitting`, `success` i `error`.

Czy zdarzenie `SUBMIT` powinno zmienić stan `submitting` na kolejne `submitting`?

Zapisz decyzję i jej skutek dla żądania sieciowego. Odpowiedź „przycisk będzie wyłączony” nie wystarcza, bo zdarzenie może wywołać także inny kod.

## 🧭 Model: przejście jest jawną decyzją

Maszyna stanów opisuje dozwolone pary:

```text
editing    + SUBMIT  -> submitting
error      + RETRY   -> submitting
submitting + RESOLVE -> success
submitting + REJECT  -> error
```

Brak pary oznacza brak przejścia. Dzięki temu handler nie musi zgadywać na podstawie kilku flag.

```javascript
const next = transition(current, event);

if (next === current) {
  return;
}

render(next);
```

W stanie `submitting` przycisk powinien być nieaktywny, a komunikat stanu dostępny. To informacja i ograniczenie w interfejsie, nie dowód, że płatność wykona się tylko raz.

## 🔬 Rozdziel dwie granice ochrony

```text
klik użytkownika
└─ maszyna UI odrzuca drugi SUBMIT
   └─ pierwsze żądanie POST z kluczem operacji
      └─ serwer rozpoznaje ponowienie tego samego klucza
```

Maszyna chroni logikę widoku przed niedozwolonym przejściem.

Idempotencję operacji musi realizować serwer zgodnie z własnym kontraktem. Sam nagłówek lub losowy klucz wysłany przez klienta nie tworzy takiej gwarancji, jeśli serwer go nie obsługuje.

Aktywny dokument roboczy IETF opisuje `Idempotency-Key` dla odporniejszego ponawiania żądań takich jak `POST` lub `PATCH`. To nadal Internet-Draft, nie opublikowany RFC. W produkcji sprawdź dokumentację konkretnego API.

## 🛠️ Punkt kontrolny: wskaż właściciela gwarancji

<data-gate>
  <data-quiz>
    <question>Przycisk został wyłączony po pierwszym kliknięciu. Co można na tej podstawie stwierdzić?</question>
    <options>
      <option>Płatność na pewno wykona się na serwerze tylko raz.</option>
      <option correct>Ten widok ogranicza kolejne wysłanie przez tę kontrolkę, ale nie gwarantuje idempotencji serwera.</option>
      <option>Przeglądarka automatycznie dodała trwały klucz idempotencji.</option>
    </options>
    <div data-hint="error">Rozdziel stan kontrolki w przeglądarce od sposobu przetwarzania żądań przez serwer.</div>
    <div data-hint="success">Interfejs i serwer mogą współpracować, lecz odpowiadają za inne granice systemu.</div>
  </data-quiz>
</data-gate>

## 🧪 Zaimplementuj dozwolone przejścia

Funkcja `transition(state, event)` zwraca następny stan. Dla niedozwolonego zdarzenia zwraca stan bieżący.

<data-gate>
  <data-code-runner language="javascript" title="Odrzucaj niedozwolone przejścia">
    <template data-type="code">
function transition(state, event) {
  return state;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "submit",
          "text": "Wysłanie formularza rozpoczyna operację",
          "type": "test-case",
          "functionName": "transition",
          "input": ["editing","SUBMIT"],
          "expected": "submitting"
        },
        {
          "id": "duplicate-submit",
          "text": "Drugie wysłanie podczas operacji nie tworzy przejścia",
          "type": "test-case",
          "functionName": "transition",
          "input": ["submitting","SUBMIT"],
          "expected": "submitting"
        },
        {
          "id": "resolve",
          "text": "Sukces jest dozwolony po rozpoczęciu operacji",
          "type": "test-case",
          "functionName": "transition",
          "input": ["submitting","RESOLVE"],
          "expected": "success"
        },
        {
          "id": "retry",
          "text": "Ponowienie po błędzie wraca do wysyłania",
          "type": "test-case",
          "functionName": "transition",
          "input": ["error","RETRY"],
          "expected": "submitting"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function transition(state, event) {
  const transitions = {
    editing: { SUBMIT: 'submitting' },
    submitting: { RESOLVE: 'success', REJECT: 'error' },
    error: { RETRY: 'submitting', EDIT: 'editing' },
    success: {}
  };

  return transitions[state]?.[event] ?? state;
}
```

Zwrócenie bieżącego stanu pozwala rozpoznać brak przejścia przez porównanie. W bardziej rozbudowanym systemie możesz zwrócić jawny wynik `{ accepted, state }`.

</details>

## 🔄 Połącz przejście z żądaniem

Napisz szkic handlera, który wysyła `POST` tylko wtedy, gdy `transition(current, 'SUBMIT')` zmieni stan.

Następnie dodaj klucz operacji wygenerowany raz dla próby zakupu. Ponowienie tego samego żądania ma użyć tego samego klucza, nie nowego.

Kryterium: w komentarzu zapisz, że zachowanie klucza musi być uzgodnione z API, a ostateczna deduplikacja należy do serwera. Dzięki temu kod nie obiecuje gwarancji, której nie posiada.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Modeluj dozwolone przejścia, zamiast składać zachowanie z luźnych flag.
- Odrzucaj drugie `SUBMIT` także w logice, nie tylko wyglądem przycisku.
- Oddzielaj ochronę interfejsu od idempotencji realizowanej przez serwer.
