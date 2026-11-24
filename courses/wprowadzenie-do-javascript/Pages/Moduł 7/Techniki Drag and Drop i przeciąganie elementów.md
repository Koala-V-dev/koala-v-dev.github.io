# Techniki Drag and Drop i przeciąganie elementów

Intuicyjny interfejs użytkownika często wymaga bezpośredniej manipulacji obiektami na ekranie. Zamiast klikać kolejne przyciski przenoszenia, użytkownicy oczekują możliwości chwycenia karty myszą (lub gestem dotykowym) i przeciągnięcia jej do innej kolumny, folderu czy koszyka. 

Współczesne przeglądarki posiadają wbudowany silnik **HTML5 Drag and Drop API**. Pozwala on w prosty i wydajny sposób rejestrować przemieszczanie elementów bez konieczności ręcznego przeliczania współrzędnych kursora myszy (`clientX`, `clientY`).

W tej lekcji zbudujemy interaktywną tablicę zadań Kanban z dwoma kolumnami i płynnym przenoszeniem kart.

---

## 📋 Wizualna tablica zadań ze strefami zrzutu

Aby element mógł być przeciągany, w kodzie HTML nadajemy mu atrybut `draggable="true"` oraz unikalny identyfikator `id`:

```html
<main class="kanban-board">
  <section id="zone-todo" class="drop-zone">
    <h2>Do wykonania</h2>
    <div id="card-1" class="task-card" draggable="true">
      <p>Przygotować specyfikację techniczną API</p>
      <span class="badge">Pilne</span>
    </div>
    <div id="card-2" class="task-card" draggable="true">
      <p>Przeprowadzić testy jednostkowe modułu logowania</p>
      <span class="badge">Średnie</span>
    </div>
  </section>

  <section id="zone-done" class="drop-zone">
    <h2>Zakończone</h2>
    <div id="card-3" class="task-card" draggable="true">
      <p>Konfiguracja środowiska Node.js</p>
      <span class="badge">Niskie</span>
    </div>
  </section>
</main>
```

---

## 🧠 Standard HTML5 Drag and Drop API w JavaScript

### 🎯 Atrybut draggable i zdarzenie dragstart

Gdy użytkownik rozpoczyna przeciąganie elementu z atrybutem `draggable="true"`, przeglądarka odpala na nim zdarzenie `dragstart`. To kluczowy moment, w którym musimy określić, jakie dane są transportowane:

```javascript
const cards = document.querySelectorAll(".task-card");

cards.forEach((card) => {
  card.addEventListener("dragstart", (event) => {
    // Zapisujemy identyfikator przeciąganego elementu w schowku transferu
    event.dataTransfer.setData("text/plain", event.target.id);

    // Opcjonalna klasa wizualna zmniejszająca krycie chwyconego elementu
    event.target.classList.add("is-dragging");
  });

  card.addEventListener("dragend", (event) => {
    // Po zakończeniu przeciągania usuwamy styl pomocniczy
    event.target.classList.remove("is-dragging");
  });
});
```

### ⚠️ Obowiązkowy preventDefault w zdarzeniu dragover

Domyślnym zachowaniem przeglądarki internetowej dla większości obszarów strony jest **odrzucanie i blokowanie upuszczania danych**. 

Aby kontener stał się prawidłową strefą zrzutu (ang. *drop target*), **musimy przechwycić zdarzenie `dragover` i bezwzględnie wywołać `event.preventDefault()`**. Bez tej pojedynczej linijki zdarzenie `drop` w ogóle się nie wywoła:

```javascript
const dropZones = document.querySelectorAll(".drop-zone");

dropZones.forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    // KRYTYCZNE: Odblokowanie możliwości upuszczenia w tej strefie!
    event.preventDefault();
    zone.classList.add("drag-hover");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-hover");
  });
});
```

### 📦 Przekazywanie danych przez obiekt dataTransfer

Obiekt `event.dataTransfer` pełni rolę bezpiecznego schowka pomiędzy elementem źródłowym a strefą docelową. Udostępnia metody:
- `setData(typMime, ciągZnaków)` - serializuje identyfikator lub treść (zwykle `"text/plain"`).
- `getData(typMime)` - odczytuje przekazany ciąg znaków w momencie zrzutu.

### 🚚 Przemieszczanie węzłów DOM w zdarzeniu drop

Gdy użytkownik puszcza przycisk myszy nad strefą zrzutu, wyzwalane jest zdarzenie `drop`. Pobieramy wówczas zapisany identyfikator elementu, odnajdujemy go w drzewie DOM za pomocą `document.getElementById()` i dołączamy do nowego kontenera:

```javascript
dropZones.forEach((zone) => {
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-hover");

    // Odczytujemy id przekazane w dragstart
    const draggedCardId = event.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(draggedCardId);

    if (draggedCard) {
      // Metoda appendChild automatycznie PRZENOSI istniejący węzeł DOM
      // (nie tworzy kopii, lecz odczepia go z poprzedniego rodzica)
      zone.appendChild(draggedCard);
    }
  });
});
```

Warto zapamiętać: metoda `appendChild()` wywołana na elemencie, który już znajduje się w strukturze dokumentu, nie duplikuje go, lecz bezpiecznie przenosi w nowe miejsce!

---

## 🎯 Sprawdź swoją wiedzę

<data-quiz>
  <question>
Co się stanie, jeśli w zdarzeniu `dragover` strefy docelowej pominiesz wywołanie `event.preventDefault()`?
  </question>
  <options>
    <option correct>Zdarzenie `drop` w ogóle się nie wykona, a kursor wskaże brak zgody na upuszczenie</option>
    <option>Element zostanie automatycznie zduplikowany w obu kontenerach jednocześnie</option>
    <option>Przeglądarka wyświetli systemowe okno dialogowe z pytaniem o potwierdzenie transferu</option>
    <option>Strona odświeży się do stanu początkowego, gubiąc bieżący stan drzewa DOM</option>
  </options>
</data-quiz>

<data-connection-matcher title="Dopasuj zdarzenie Drag and Drop do jego roli w procesie przenoszenia">
  <div class="cmw-item" data-left="`dragstart`" data-right="Zapisuje identyfikator chwyconego elementu w obiekcie dataTransfer"></div>
  <div class="cmw-item" data-left="`dragover`" data-right="Wymaga preventDefault w celu odblokowania strefy docelowej"></div>
  <div class="cmw-item" data-left="`drop`" data-right="Odczytuje dane i przenosi węzeł za pomocą metody appendChild"></div>
  <div class="cmw-item" data-left="`dragleave`" data-right="Usuwa wizualne podświetlenie strefy gdy kursor ją opuszcza"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Samodzielna implementacja Drag and Drop

W tej lekcji poznałeś standardowe zdarzenia silnika **HTML5 Drag and Drop API**. Czas sprawdzić tę wiedzę w praktyce na tablicy zadań Kanban!

Przejdź do zakładki **📄 Struktura HTML (Podgląd)** po prawej stronie, aby zapoznać się ze strukturą makiety (znajdziesz tam karty z klasą `.task-card` i strefy zrzutu z klasą `.drop-zone`).

### 📋 Twoje zadanie:
Napisz funkcję `initKanbanDragAndDrop()`, która oprogramuje pełny proces przeciągania elementów:

1. **Obsługa przeciągania kart (`.task-card`)**:
   - Dla każdego elementu `.task-card` zarejestruj nasłuchiwacz zdarzenia `"dragstart"`. W funkcji obsługi:
     - Zapisz `id` przeciąganego elementu w schowku transferu danych: `e.dataTransfer.setData("text/plain", e.target.id)`
     - Dodaj klasę pomocniczą `"is-dragging"` do `e.target`.
   - Zarejestruj nasłuchiwacz zdarzenia `"dragend"`, w którym usuniesz klasę `"is-dragging"` z `e.target`.

2. **Odblokowanie stref zrzutu (`.drop-zone`)**:
   - Dla każdego kontenera `.drop-zone` zarejestruj zdarzenie `"dragover"` i wywołaj w nim **`e.preventDefault()`**, aby poinformować przeglądarkę, że obszar akceptuje upuszczanie elementów.

3. **Przenoszenie kart w zdarzeniu `"drop"`**:
   - Dla każdego kontenera `.drop-zone` zarejestruj zdarzenie `"drop"`. W funkcji obsługi:
     - Wywołaj **`e.preventDefault()`**.
     - Odczytaj identyfikator karty ze schowka: `const cardId = e.dataTransfer.getData("text/plain")`.
     - Pobierz element karty z drzewa DOM za pomocą `document.getElementById(cardId)`.
     - Przenieś kartę do strefy docelowej za pomocą **`zone.appendChild(draggedCard)`**.

💡 **Przetestuj na żywo w zakładce 🌐 Podgląd DOM (Kanban)**:
Gdy poprawnie oprogramujesz powyższe zdarzenia i klikniesz **▶ Uruchom Kod**, przejdź do podglądu DOM i chwyć kartę myszką. Dzięki Twojemu kodowi karty będą płynnie przeskakiwać pomiędzy kolumnami!

<data-gate>
  <data-code-runner language="javascript" title="Interaktywna Tablica Kanban (Drag and Drop Sandbox)">
    <template data-type="html">
<div class="kanban-preview-wrapper" style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
  <main class="kanban-board" style="display: flex; flex-direction: row; gap: 18px; width: 100%; box-sizing: border-box;">
    <section id="zone-todo" class="drop-zone" data-zone="todo" style="flex: 1; background: var(--bg-layer-2); border: 2px dashed var(--border-color); border-radius: 10px; padding: 14px; min-height: 280px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
      <div class="drop-zone-header" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">
        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--text-color);">📋 Do wykonania</h2>
        <span class="column-count" style="font-size: 11px; padding: 2px 8px; border-radius: 10px; background: var(--bg-layer-3); color: var(--text-muted); font-weight: bold;">2</span>
      </div>
      <div id="card-1" class="task-card" draggable="true" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px; padding: 10px 14px; cursor: grab; user-select: none; box-sizing: border-box;">
        <span class="card-handle" style="font-weight: bold; color: var(--text-muted); cursor: grab; user-select: none;">⋮⋮</span>
        <span class="card-title" style="flex: 1; font-size: 13px; font-weight: 600; color: var(--text-color);">Przygotować specyfikację techniczną API</span>
        <span class="badge badge-urgent" style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid #ef4444;">PILNE</span>
      </div>
      <div id="card-2" class="task-card" draggable="true" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px; padding: 10px 14px; cursor: grab; user-select: none; box-sizing: border-box;">
        <span class="card-handle" style="font-weight: bold; color: var(--text-muted); cursor: grab; user-select: none;">⋮⋮</span>
        <span class="card-title" style="flex: 1; font-size: 13px; font-weight: 600; color: var(--text-color);">Przeprowadzić testy modułu logowania</span>
        <span class="badge badge-normal" style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid #3b82f6;">ŚREDNIE</span>
      </div>
    </section>
    <section id="zone-done" class="drop-zone" data-zone="done" style="flex: 1; background: var(--bg-layer-2); border: 2px dashed var(--border-color); border-radius: 10px; padding: 14px; min-height: 280px; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;">
      <div class="drop-zone-header" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">
        <h2 style="margin: 0; font-size: 14px; font-weight: 700; color: var(--text-color);">✅ Zrealizowane</h2>
        <span class="column-count" style="font-size: 11px; padding: 2px 8px; border-radius: 10px; background: var(--bg-layer-3); color: var(--text-muted); font-weight: bold;">1</span>
      </div>
      <div id="card-3" class="task-card" draggable="true" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px; padding: 10px 14px; cursor: grab; user-select: none; box-sizing: border-box;">
        <span class="card-handle" style="font-weight: bold; color: var(--text-muted); cursor: grab; user-select: none;">⋮⋮</span>
        <span class="card-title" style="flex: 1; font-size: 13px; font-weight: 600; color: var(--text-color);">Wdrożenie schematu bazy danych</span>
        <span class="badge badge-success" style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(16,185,129,0.2); color: #10b981; border: 1px solid #10b981;">WYKONANE</span>
      </div>
    </section>
  </main>
</div>
    </template>
    <template data-type="code">
function initKanbanDragAndDrop() {
  const cards = document.querySelectorAll(".task-card");
  const zones = document.querySelectorAll(".drop-zone");

  // 1. Zdarzenia dla kart (.task-card): dragstart oraz dragend
  cards.forEach(card => {
    card.addEventListener("dragstart", (e) => {
      // TODO: Zapisz id karty w obiekcie dataTransfer ("text/plain")
      // i dodaj klasę "is-dragging" do e.target
      
    });

    card.addEventListener("dragend", (e) => {
      // TODO: Usuń klasę "is-dragging" z e.target
      
    });
  });

  // 2. Zdarzenia dla stref zrzutu (.drop-zone): dragover oraz drop
  zones.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
      // TODO: Wywołaj metodę odblokowującą upuszczenie w przeglądarce
      
    });

    zone.addEventListener("drop", (e) => {
      // TODO: 1. Wywołaj preventDefault()
      // TODO: 2. Odczytaj id karty z e.dataTransfer.getData("text/plain")
      // TODO: 3. Pobierz element za pomocą document.getElementById(cardId)
      // TODO: 4. Przenieś pobraną kartę do strefy: zone.appendChild(card)
      
    });
  });
}

initKanbanDragAndDrop();
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-dragstart-setdata",
          "text": "W zdarzeniu dragstart dane ID karty zapisywane są przez e.dataTransfer.setData('text/plain', ...)",
          "type": "contains",
          "pattern": "setData"
        },
        {
          "id": "test-dragover-preventdefault",
          "text": "W zdarzeniu dragover wywoływane jest e.preventDefault() w celu odblokowania zrzutu",
          "type": "contains",
          "pattern": "preventDefault"
        },
        {
          "id": "test-drop-getdata",
          "text": "W zdarzeniu drop ID karty odczytywane jest przez e.dataTransfer.getData('text/plain')",
          "type": "contains",
          "pattern": "getData"
        },
        {
          "id": "test-drop-appendchild",
          "text": "W zdarzeniu drop element karty przenoszony jest metodą zone.appendChild(card)",
          "type": "contains",
          "pattern": "appendChild"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🛠️ Zadanie projektowe - Interaktywna tablica Kanban

Zbuduj kompletny mechanizm Drag and Drop dla tablicy Kanban opisanej w makiecie HTML. Postępuj według kroków poniżej.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Przygotowanie elementów przeciąganych**: Pobierz wszystkie karty `.task-card`. W zdarzeniu `dragstart` zapisz `id` karty w `e.dataTransfer.setData("text/plain", e.target.id)` oraz dodaj klasę `is-dragging`. W zdarzeniu `dragend` usuń klasę `is-dragging`.
2. **Obsługa zdarzeń strefy zrzutu**: Pobierz wszystkie kontenery `.drop-zone`. W zdarzeniu `dragover` wywołaj obowiązkowy `e.preventDefault()` i dodaj klasę podświetlenia `drag-over`. W zdarzeniu `dragleave` usuń klasę podświetlenia.
3. **Implementacja upuszczenia elementu**: W zdarzeniu `drop` wywołaj `e.preventDefault()`, usuń klasę `drag-over`, odczytaj `id` karty ze schowka `e.dataTransfer.getData("text/plain")` i przenieś kartę do strefy za pomocą `zone.appendChild(draggedCard)`.

Spróbuj napisać rozwiązanie samodzielnie w edytorze kodu. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
const cards = document.querySelectorAll(".task-card");
const zones = document.querySelectorAll(".drop-zone");

cards.forEach((card) => {
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("is-dragging");
  });

  card.addEventListener("dragend", (e) => {
    e.target.classList.remove("is-dragging");
  });
});

zones.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Odblokowanie możliwości upuszczenia
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");

    const cardId = e.dataTransfer.getData("text/plain");
    const draggedCard = document.getElementById(cardId);

    if (draggedCard) {
      // Automatyczne przeniesienie węzła DOM do nowej kolumny
      zone.appendChild(draggedCard);
    }
  });
});
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Atrybut `draggable="true"` informuje przeglądarkę, że element HTML może być przeciągany za pomocą myszy lub gestu dotykowego.
- W zdarzeniu `dragstart` przekazujemy dane identyfikacyjne do obiektu `event.dataTransfer.setData("text/plain", id)`.
- W zdarzeniu `dragover` na strefie zrzutu bezwzględnie należy wywołać `event.preventDefault()`, w przeciwnym razie przeglądarka zablokuje wykonanie zdarzenia `drop`.
- Metoda `targetZone.appendChild(draggedElement)` wykonana na istniejącym węźle DOM przemieszcza go bez tworzenia duplikatów.
- Klasy pomocnicze (`is-dragging`, `drag-over`) pozwalają na natychmiastowe wizualne informowanie użytkownika o stanie operacji.
