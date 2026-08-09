# Fetch bez wyścigów i czytelne stany UI

Użytkownik najpierw wyszukuje „ko”, a chwilę później „koala”. Pierwsze żądanie jest wolniejsze. Jeśli jego odpowiedź dotrze na końcu, może nadpisać poprawny wynik dla nowszego zapytania.

Po tej lekcji rozdzielisz błąd HTTP od błędu żądania i nie dopuścisz, aby stara odpowiedź zmieniła aktualny widok.

## 🧠 Najpierw przewidź wyścig

Dwa żądania startują w tej kolejności:

```text
1. „ko”    czas odpowiedzi: 900 ms
2. „koala” czas odpowiedzi: 200 ms
```

Jeśli każda odpowiedź bezwarunkowo wywoła `render(data)`, jaki tekst użytkownik zobaczy po 900 ms?

Odpowiedź „ko” jest starsza, ale kończy się później. Sama kolejność `await` wewnątrz dwóch osobnych wywołań nie zachowuje kolejności intencji użytkownika.

## 🏗️ Model: pięć stanów zamiast trzech haseł

Dla tego widoku potrzebujesz stanów: `idle`, `loading`, `success`, `empty` i `error`.

Uczeń nie ma ich zapamiętać jako listy. Użyj ich do odpowiedzi na pytanie: co powinien zobaczyć użytkownik i jaka akcja jest teraz dozwolona?

```javascript
const initialState = {
  status: 'idle',
  query: '',
  results: [],
  message: ''
};
```

`fetch()` zwykle rozwiązuje Promise także dla odpowiedzi HTTP 404 lub 500. Dlatego kod ocenia `response.ok` zgodnie z przyjętą polityką aplikacji.

Promise może zostać odrzucona z wielu powodów związanych z żądaniem, między innymi po przerwaniu przez `AbortController`. Nie sprowadzaj `catch` wyłącznie do „braku fizycznej sieci”.

## 🔍 Zabezpiecz aktualność odpowiedzi

Każde wyszukiwanie otrzymuje numer. Tylko odpowiedź o numerze równym najnowszemu może zmienić widok.

```javascript
let latestRequestId = 0;

async function searchProducts(query) {
  const requestId = ++latestRequestId;
  renderState({ status: 'loading', query });

  try {
    const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (requestId !== latestRequestId) return;

    renderState({
      status: data.length ? 'success' : 'empty',
      query,
      results: data
    });
  } catch (error) {
    if (requestId !== latestRequestId) return;
    renderState({ status: 'error', query, message: error.message });
  }
}
```

W większej aplikacji warto dodatkowo przerwać poprzednie żądanie przez `AbortController`. Numer żądania nadal pozostaje użytecznym dowodem, że odpowiedź odpowiada bieżącej intencji.

Wstawiaj tekst z API przez `textContent` lub twórz elementy DOM. Nie interpoluj niezaufanych wartości do `innerHTML`.

## 🛠️ Punkt kontrolny: wybierz dowód aktualności

<data-gate>
  <data-quiz>
    <question>Żądanie A wystartowało przed B, ale zakończyło się po B. Który warunek pozwala A bezpiecznie zmienić widok?</question>
    <options>
      <option>A ma status HTTP 200.</option>
      <option correct>Identyfikator A nadal jest równy `latestRequestId`.</option>
      <option>A trwało dłużej niż 500 ms.</option>
    </options>
    <div data-hint="error">Status HTTP mówi o odpowiedzi serwera, nie o tym, czy użytkownik nadal czeka na ten wynik.</div>
    <div data-hint="success">Porównanie identyfikatorów wiąże odpowiedź z najnowszą intencją użytkownika.</div>
  </data-quiz>
</data-gate>

## 🧪 Napraw symulowany live search

Funkcja otrzymuje listę żądań. Każde ma `value` oraz `delay`. Wszystkie startują w kolejności tablicy.

Zwróć wartość ostatniego rozpoczętego żądania, nawet jeśli starsze zakończy się później.

<data-gate>
  <data-code-runner language="javascript" title="Odrzuć spóźnioną odpowiedź">
    <template data-type="code">
async function resolveLatest(requests) {
  let displayed = null;

  await Promise.all(requests.map(request =>
    new Promise(resolve => {
      setTimeout(() => {
        displayed = request.value;
        resolve();
      }, request.delay);
    })
  ));

  return displayed;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "older-finishes-last",
          "text": "Starsza i wolniejsza odpowiedź nie nadpisuje nowszej",
          "type": "test-case",
          "functionName": "resolveLatest",
          "input": [[{"value":"ko","delay":30},{"value":"koala","delay":5}]],
          "expected": "koala"
        },
        {
          "id": "latest-finishes-last",
          "text": "Najnowsza odpowiedź nadal działa, gdy kończy się jako ostatnia",
          "type": "test-case",
          "functionName": "resolveLatest",
          "input": [[{"value":"ko","delay":5},{"value":"koala","delay":30}]],
          "expected": "koala"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

Nie wolno zwrócić po prostu ostatniej wartości z tablicy. Użyj identyfikatora żądania do podjęcia decyzji wewnątrz callbacka odpowiedzi.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

```javascript
async function resolveLatest(requests) {
  let latestRequestId = 0;
  let displayed = null;

  await Promise.all(requests.map(request => {
    const requestId = ++latestRequestId;

    return new Promise(resolve => {
      setTimeout(() => {
        if (requestId === latestRequestId) {
          displayed = request.value;
        }
        resolve();
      }, request.delay);
    });
  }));

  return displayed;
}
```

Test zmienia kolejność zakończenia, więc rozwiązanie oparte wyłącznie na czasie jednego przykładu nie przejdzie obu przypadków.

</details>

## 🔄 Rozszerz przypadek o anulowanie

Dodaj `AbortController`. Przed rozpoczęciem nowego żądania przerwij poprzednie. W `catch` odróżnij `AbortError` od błędu, który powinien pokazać komunikat użytkownikowi.

Kryterium: anulowanie starego żądania nie przełącza aktualnego widoku w stan `error`.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oceniaj osobno odpowiedź HTTP, błąd żądania i aktualność odpowiedzi.
- Wiąż wynik z najnowszą intencją użytkownika przez identyfikator lub anulowanie.
- Renderuj tekst z API bez parsowania go jako HTML.
