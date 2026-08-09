# Dostępny dialog z natywnym elementem dialog

Przycisk „Usuń zamówienie” otwiera warstwę wizualną. Fokus nadal przechodzi do linków pod spodem, a po zamknięciu użytkownik klawiatury nie wie, gdzie się znalazł.

Po tej lekcji zbudujesz modalny dialog z nazwą, kontrolowanym fokusem i testem pełnej ścieżki klawiatury.

## 🧠 Najpierw wybierz fokus

Dialog potwierdza nieodwracalne usunięcie. Zawiera przyciski „Anuluj” oraz „Usuń”.

Który element powinien dostać fokus początkowy?

W tym przypadku bezpiecznym wyborem jest „Anuluj”. Nie istnieje jedna reguła „zawsze pierwszy element”. Decyzja zależy od zadania, długości treści i skutku domyślnej akcji.

## 🧭 Model: otwarcie, praca, powrót

```text
przycisk otwierający
└─ showModal()
   ├─ fokus wewnątrz dialogu
   ├─ treść poza dialogiem nieaktywna
   └─ zamknięcie
      └─ fokus wraca do logicznego miejsca
```

Natywny `<dialog>` otwarty przez `showModal()` zapewnia zachowanie modalne przeglądarki. `show()` otwiera dialog niemodalny i nie jest zamiennikiem w tym scenariuszu.

Dialog potrzebuje dostępnej nazwy. Wskaż widoczny tytuł przez `aria-labelledby`.

```html
<button id="open-delete" type="button">Usuń zamówienie</button>

<dialog id="delete-dialog" aria-labelledby="delete-title">
  <h2 id="delete-title">Usunąć zamówienie?</h2>
  <p>Tej operacji nie można cofnąć.</p>

  <form method="dialog">
    <button value="cancel" autofocus>Anuluj</button>
    <button value="confirm">Usuń</button>
  </form>
</dialog>
```

`method="dialog"` pozwala przyciskom zamknąć dialog i ustawić `returnValue` bez ręcznego odtwarzania całej obsługi.

## 🔬 Połącz wynik z działaniem

```javascript
const opener = document.querySelector('#open-delete');
const dialog = document.querySelector('#delete-dialog');

opener.addEventListener('click', () => {
  dialog.showModal();
});

dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'confirm') {
    deleteOrder();
  }
});
```

Nie wykonuj usunięcia w samym zdarzeniu otwarcia. Wynik użytkownika jest znany dopiero po zamknięciu.

Przeglądarka obsługuje <kbd>Escape</kbd> i ograniczenie fokusu dla modalnego `<dialog>`. Nadal trzeba sprawdzić zachowanie w docelowych przeglądarkach oraz sensowny powrót fokusu, zwłaszcza gdy element otwierający został usunięty.

## 🛠️ Punkt kontrolny: rozpoznaj tryb

<data-gate>
  <data-quiz>
    <question>Kod wywołuje `dialog.show()`. Dlaczego warstwa nie zachowuje się jak modalna?</question>
    <options>
      <option>Brakuje `role="button"` na dialogu.</option>
      <option correct>`show()` otwiera dialog niemodalny; ten przypadek wymaga `showModal()`.</option>
      <option>Każdy dialog wymaga ręcznego listenera klawisza Tab.</option>
    </options>
    <div data-hint="error">Porównaj dwie metody otwierania natywnego elementu.</div>
    <div data-hint="success">Tryb otwarcia decyduje o modalności, nie sam wygląd warstwy.</div>
  </data-quiz>
</data-gate>

## 🧪 Wybierz fokus początkowy

Funkcja otrzymuje opis dialogu. Dla operacji nieodwracalnej wybierz bezpieczną akcję. Dla długiej strukturalnej treści wybierz tytuł. W prostym formularzu wybierz pierwsze pole.

<data-gate>
  <data-code-runner language="javascript" title="Dobierz fokus do zadania">
    <template data-type="code">
function chooseInitialFocus(dialog) {
  return 'first-control';
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "destructive",
          "text": "Operacja nieodwracalna zaczyna od bezpiecznej akcji",
          "type": "test-case",
          "functionName": "chooseInitialFocus",
          "input": [{"destructive":true,"longContent":false}],
          "expected": "cancel"
        },
        {
          "id": "long-content",
          "text": "Długa treść zaczyna od elementu strukturalnego",
          "type": "test-case",
          "functionName": "chooseInitialFocus",
          "input": [{"destructive":false,"longContent":true}],
          "expected": "heading"
        },
        {
          "id": "simple-form",
          "text": "Prosty formularz zaczyna od pierwszej kontrolki",
          "type": "test-case",
          "functionName": "chooseInitialFocus",
          "input": [{"destructive":false,"longContent":false}],
          "expected": "first-control"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function chooseInitialFocus(dialog) {
  if (dialog.destructive) return 'cancel';
  if (dialog.longContent) return 'heading';
  return 'first-control';
}
```

Dla tytułu użyj `tabindex="-1"`, aby mógł otrzymać fokus programowo bez dodawania go do zwykłej kolejności Tab.

</details>

## 🔄 Wykonaj test klawiaturą

Odłóż mysz. Otwórz dialog klawiszem <kbd>Enter</kbd>, przejdź przez kontrolki klawiszami <kbd>Tab</kbd> i <kbd>Shift</kbd> + <kbd>Tab</kbd>, zamknij przez <kbd>Escape</kbd>, a potem otwórz ponownie i wybierz „Anuluj”.

Kryterium: fokus nie trafia pod warstwę, jest widoczny, a po zamknięciu wraca do przycisku otwierającego lub innego logicznego miejsca.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Otwieraj modalny `<dialog>` metodą `showModal()`.
- Dobieraj fokus początkowy do treści i ryzyka działania.
- Weryfikuj pełną drogę otwarcia, pracy i powrotu wyłącznie klawiaturą.
