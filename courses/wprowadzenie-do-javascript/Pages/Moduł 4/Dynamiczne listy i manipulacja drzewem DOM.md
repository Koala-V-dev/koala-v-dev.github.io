# Dynamiczne listy i manipulacja drzewem DOM

Prawdziwa moc języka JavaScript ujawnia się wtedy, gdy aplikacja nie tylko modyfikuje istniejące napisy, ale dynamicznie **tworzy nowe elementy** w dokumencie HTML oraz zarządza listami obiektów w czasie rzeczywistym. To fundament każdego koszyka sklepowego, listy zadań (To-Do) czy systemu zamówień w lokalu gastronomicznym.

W tej lekcji zaczniemy od interfejsu zamówień restauracyjnych, poznamy głęboki mechanizm tworzenia węzłów w pamięci (`createElement`), wpinania ich do drzewa (`appendChild`) oraz czyszczenia kontenerów, rozwiążemy wyzwanie w edytorze kodu na przykładzie kolejki zgłoszeń serwisowych, a na koniec samodzielnie zaprogramujemy interaktywny system zamówień potraw.

---

## 🏗️ Punkt wyjścia: Szablon menu restauracji

Oto kod HTML interfejsu wyboru potraw i podglądu zamówienia:

```html
<section id="restauracja">
  <h2>Menu dań wegetariańskich</h2>
  
  <div class="menu-potrawy">
    <button class="kafelek" data-danie="Naleśniki">Naleśniki</button>
    <button class="kafelek" data-danie="Lasagne szpinakowa">Lasagne szpinakowa</button>
    <button class="kafelek" data-danie="Wege rosół">Wege rosół</button>
    <button class="kafelek" data-danie="Kompot">Kompot</button>
  </div>

  <h3>Twoje zamówienie:</h3>
  <ul id="lista-zamowienia"></ul>

  <button id="btn-wyczysc">Wyczyść</button>
  <button id="btn-zatwierdz">Zatwierdź</button>
</section>
```

Wymagania biznesowe:
- W stanie początkowym lista zamówień `<ul>` jest całkowicie pusta.
- Kliknięcie dowolnego kafelka z potrawą powoduje dodanie nowego elementu `<li>` z nazwą klikniętego dania do listy `#lista-zamowienia`.
- Kliknięcie przycisku „Wyczyść” usuwa wszystkie pozycje z listy.
- Kliknięcie przycisku „Zatwierdź” wyświetla komunikat w oknie dialogowym `alert("Zamówienie zostało przekazane do realizacji")` oraz czyści listę.

---

## 🏗️ Tworzenie węzłów: createElement kontra innerHTML

Wielu początkujących próbuje dodawać elementy do listy, doklejając tekst do właściwości `innerHTML`:

```javascript
// ❌ NIEBEZPIECZNE I NIEWYDAJNE:
lista.innerHTML += `<li>${nazwaPotrawy}</li>`;
```

Dlaczego ten z pozoru prosty zapis jest złą praktyką?
1. **Niszczenie stanu w pamięci**: Zapis `lista.innerHTML += ...` powoduje, że przeglądarka niszczy **całą dotychczasową zawartość listy**, parsuje od nowa cały ciąg HTML i tworzy węzły od zera. Jeśli na poprzednich elementach były podpięte nasłuchiwacze zdarzeń, zostają one bezpowrotnie utracone!
2. **Podatność XSS**: Wstrzykiwanie tekstu przez `innerHTML` otwiera aplikację na ataki typu Cross-Site Scripting, jeśli nazwa zawierałaby złośliwy kod HTML.

### ✅ Wzorzec bezpieczny: createElement i appendChild

Profesjonalny kod tworzy elementy jako obiekty w pamięci, a następnie wpina je do drzewa DOM:

```javascript
// 1. Tworzymy nowy węzeł w pamięci RAM (jeszcze nie widoczny na stronie)
const nowyElement = document.createElement("li");

// 2. Bezpiecznie wstawiamy tekst
nowyElement.textContent = nazwaDania;

// 3. Wpinamy element na koniec wskazanego kontenera rodzica
lista.appendChild(nowyElement);
```

Dzięki temu przeglądarka dokłada do drzewa dokładnie jeden nowy węzeł, nie naruszając pozostałych dzieci kontenera.

---

## 🧹 Czyszczenie kontenera: innerHTML = ""

Gdy chcemy całkowicie opróżnić listę (np. po kliknięciu „Wyczyść”), możemy ustawić właściwość `innerHTML` kontenera na pusty ciąg znaków:

```javascript
const lista = document.querySelector("#lista-zamowienia");
lista.innerHTML = ""; // Błyskawicznie usuwa wszystkie dzieci węzła
```

W tym konkretnym przypadku wyczyszczenie całego kontenera jest w pełni bezpieczne i pożądane, ponieważ celowo chcemy zniszczyć wszystkie pozycje listy.

<data-gate>
  <data-quiz>
    <question>
Dlaczego dołączanie elementów przez createElement i appendChild jest lepsze niż dopisywanie innerHTML += ?
    </question>
    <options>
      <option correct>appendChild nie niszczy istniejących węzłów ani ich podpiętych nasłuchiwaczy zdarzeń</option>
      <option>appendChild automatycznie zapisuje dane w pamięci podręcznej przeglądarki użytkownika</option>
      <option>Dopisywanie innerHTML += działa wyłącznie na serwerze i jest ignorowane przez przeglądarkę</option>
      <option>Dopisywanie innerHTML += wymaga podania adresu URL bazy danych przed modyfikacją drzewa</option>
    </options>
    <div data-hint="error">
Zastanów się, co dzieje się z węzłami potomnymi, gdy nadpisujesz cały kod HTML rodzica operatorem +=.
    </div>
    <div data-hint="success">
Znakomicie! innerHTML += niszczy i parsuje od nowa całą zawartość kontenera. appendChild operuje bezpośrednio na obiektach w pamięci RAM, dołączając tylko nowy element.
    </div>
  </data-quiz>
</data-gate>

---

## 🧩 Dopasuj metody manipulacji drzewem DOM

Przetestuj znajomość kluczowych metod pracy z węzłami DOM.

<data-gate>
  <data-connection-matcher title="Metody manipulacji drzewem DOM">
    <div class="cmw-item" data-left="document.createElement('li')" data-right="Tworzy w pamięci przeglądarki nowy, jeszcze niepodpięty element"></div>
    <div class="cmw-item" data-left="rodzic.appendChild(dziecko)" data-right="Wpina istniejący element na sam koniec wskazanego węzła rodzica"></div>
    <div class="cmw-item" data-left="kontener.innerHTML = ''" data-right="Błyskawicznie usuwa wszystkie dzieci z wnętrza danego elementu"></div>
    <div class="cmw-item" data-left="element.getAttribute('data-danie')" data-right="Odczytuje wartość niestandardowego atrybutu zapisanego w HTML"></div>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Wyzwanie w edytorze: Kolejka zgłoszeń helpdesku

Zastosujmy manipulację tablicą i stanem listy na niezależnym problemie inżynierskim: menadżerze kolejki zadań helpdesku IT.

System zarządza listą oczekujących zgłoszeń i reaguje na akcje operatora.

Twoim celem jest oprogramowanie funkcji `zarzadzajKolejka`.

Wymagania biznesowe:
- Parametr `kolejka`: tablica ciągów znaków reprezentująca aktualne zadania (np. `["Formatowanie dysku", "Instalacja Windows"]`).
- Parametr `akcja`: ciąg znaków (`"dodaj"`, `"obsluz"`, `"wyczysc"` lub `"liczba"`).
- Parametr `noweZadanie`: treść zgłoszenia (string).
- Zachowanie:
  - `"dodaj"`: jeśli `noweZadanie` nie jest puste (`noweZadanie.trim() !== ""`), dodaj je na koniec kolejki i zwróć nową kopię tablicy. W przeciwnym razie zwróć niezmienioną tablicę.
  - `"obsluz"`: usuwa pierwsze zgłoszenie z początku kolejki i zwraca zaktualizowaną tablicę (jeśli kolejka była pusta, zwraca pustą tablicę `[]`).
  - `"wyczysc"`: zwraca pustą tablicę `[]`.
  - `"liczba"`: zwraca liczbę zadań oczekujących w kolejce jako liczbę całkowitą.

<data-gate>
  <data-code-runner language="javascript" title="Menadżer kolejki zgłoszeń">
    <template data-type="html">
<div class="queue-lab-container" style="display: flex; flex-direction: column; gap: 14px; width: 100%;">
  <div class="queue-toolbar" style="display: flex; flex-direction: row; gap: 8px; align-items: center; flex-wrap: wrap;">
    <input type="text" id="queue-input-task" class="queue-input" placeholder="Wpisz treść nowego zgłoszenia..." style="flex: 1; min-width: 180px; padding: 8px 12px; border: 2px solid var(--border-color); border-radius: 6px; background: var(--bg-layer-1); color: var(--text-color); font-size: 13px;" />
    <button type="button" id="btn-queue-add" class="queue-btn queue-btn-primary" style="position: relative; padding: 8px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; background: var(--button-bg-primary); color: #fff; border: 1px solid var(--button-bg-primary);">➕ Dodaj</button>
    <button type="button" id="btn-queue-serve" class="queue-btn" style="position: relative; padding: 8px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; background: var(--bg-layer-2); color: var(--text-color); border: 1px solid var(--border-color);">⏩ Obsłuż</button>
    <button type="button" id="btn-queue-clear" class="queue-btn" style="position: relative; padding: 8px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; background: var(--bg-layer-2); color: var(--text-color); border: 1px solid var(--border-color);">🗑️ Wyczyść</button>
  </div>
  <div class="kanban-status-banner" id="queue-status-banner" style="padding: 8px 14px; border-radius: 8px; background: var(--hint-info-background-color); border: 1px solid var(--hint-info-border-color); color: var(--text-color); font-size: 13px; font-weight: 600;">
    <span class="status-icon">📋</span>
    <span class="status-text">Oczekujące zgłoszenia: <strong id="queue-counter" style="color: var(--accent-color);">2</strong></span>
  </div>
  <ul class="queue-list" id="queue-list" style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
    <li class="queue-item" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px;">
      <span style="font-size: 13px; font-weight: 600; color: var(--text-color);">1. Konfiguracja serwera WWW</span>
      <span class="badge badge-normal" style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid #3b82f6;">OCZEKUJE</span>
    </li>
    <li class="queue-item" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px;">
      <span style="font-size: 13px; font-weight: 600; color: var(--text-color);">2. Wymiana uszkodzonego kabla Ethernet</span>
      <span class="badge badge-normal" style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid #3b82f6;">OCZEKUJE</span>
    </li>
  </ul>
</div>
    </template>
    <template data-type="code">
// 1. Logika zarządzania tablicą kolejki zgłoszeń (wymagane przez asercje testowe)
function zarzadzajKolejka(kolejka, akcja, noweZadanie) {
  // TODO: Zaimplementuj obsługę akcji: dodaj, obsluz, wyczysc oraz liczba.
  // Pamiętaj o niemutowaniu oryginalnej tablicy przy akcjach dodawania i usuwania!
  
  return null;
}

// 2. Obsługa interaktywnej kolejki w DOM (zakładka 📋 Interaktywna Kolejka Zgłoszeń)
function initQueueUI() {
  let tickets = ["Konfiguracja serwera WWW", "Wymiana uszkodzonego kabla Ethernet"];
  const listEl = document.getElementById("queue-list");
  const countEl = document.getElementById("queue-counter");
  const inputEl = document.getElementById("queue-input-task");
  const addBtn = document.getElementById("btn-queue-add");
  const serveBtn = document.getElementById("btn-queue-serve");
  const clearBtn = document.getElementById("btn-queue-clear");

  function render() {
    if (!listEl) return;
    const count = zarzadzajKolejka(tickets, "liczba") ?? tickets.length;
    if (countEl) countEl.textContent = count;

    if (tickets.length === 0) {
      listEl.innerHTML = '<div class="queue-empty-msg" style="text-align: center; padding: 24px; color: var(--text-muted); font-style: italic; font-size: 13px;">🎉 Wszystkie zgłoszenia zostały pomyślnie obsłużone! Kolejka jest pusta.</div>';
      return;
    }

    listEl.innerHTML = "";
    tickets.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "queue-item";
      li.style.cssText = "display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; background: var(--bg-layer-1); border: 2px solid var(--border-color); border-radius: 8px;";
      li.innerHTML = `<span style="font-size: 13px; font-weight: 600; color: var(--text-color);">${i + 1}. ${t}</span><span class="badge badge-normal" style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(59,130,246,0.2); color: #3b82f6; border: 1px solid #3b82f6;">OCZEKUJE</span>`;
      listEl.appendChild(li);
    });
  }

  if (addBtn && inputEl) {
    addBtn.addEventListener("click", () => {
      const text = inputEl.value.trim();
      if (!text) return;
      const res = zarzadzajKolejka(tickets, "dodaj", text);
      if (Array.isArray(res)) {
        tickets = res;
        inputEl.value = "";
        render();
      }
    });
  }

  if (serveBtn) {
    serveBtn.addEventListener("click", () => {
      const res = zarzadzajKolejka(tickets, "obsluz");
      if (Array.isArray(res)) {
        tickets = res;
        render();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const res = zarzadzajKolejka(tickets, "wyczysc");
      if (Array.isArray(res)) {
        tickets = res;
        render();
      }
    });
  }

  render();
}

initQueueUI();
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-dodaj",
          "text": "Akcja 'dodaj' z zadaniem 'Konfiguracja sieci' dodaje pozycję na koniec tablicy",
          "type": "test-case",
          "functionName": "zarzadzajKolejka",
          "input": [["Wymiana dysku"], "dodaj", "Konfiguracja sieci"],
          "expected": ["Wymiana dysku", "Konfiguracja sieci"]
        },
        {
          "id": "test-obsluz",
          "text": "Akcja 'obsluz' usuwa pierwsze zadanie z początku kolejki",
          "type": "test-case",
          "functionName": "zarzadzajKolejka",
          "input": [["Zadanie 1", "Zadanie 2", "Zadanie 3"], "obsluz", ""],
          "expected": ["Zadanie 2", "Zadanie 3"]
        },
        {
          "id": "test-wyczysc",
          "text": "Akcja 'wyczysc' zwraca pustą tablicę []",
          "type": "test-case",
          "functionName": "zarzadzajKolejka",
          "input": [["Zadanie 1", "Zadanie 2"], "wyczysc", ""],
          "expected": []
        },
        {
          "id": "test-liczba",
          "text": "Akcja 'liczba' dla kolejki z 3 zadaniami zwraca 3",
          "type": "test-case",
          "functionName": "zarzadzajKolejka",
          "input": [["A", "B", "C"], "liczba", ""],
          "expected": 3
        },
        {
          "id": "test-puste-dodanie",
          "text": "Dodanie pustego zadania ('') nie zmienia kolejki",
          "type": "test-case",
          "functionName": "zarzadzajKolejka",
          "input": [["A"], "dodaj", ""],
          "expected": ["A"]
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🍲 Projekt końcowy: Ożywiamy system zamówień lokalu

Wracamy do naszego menu potraw z początku lekcji:

```html
<div class="menu-potrawy">
  <button class="kafelek" data-danie="Naleśniki">Naleśniki</button>
  <button class="kafelek" data-danie="Lasagne szpinakowa">Lasagne szpinakowa</button>
  <button class="kafelek" data-danie="Wege rosół">Wege rosół</button>
  <button class="kafelek" data-danie="Kompot">Kompot</button>
</div>

<h3>Twoje zamówienie:</h3>
<ul id="lista-zamowienia"></ul>

<button id="btn-wyczysc">Wyczyść</button>
<button id="btn-zatwierdz">Zatwierdź</button>
```

### 📋 Lista kroków do samodzielnego wykonania:
1. Pobierz listę wszystkich kafelków za pomocą `document.querySelectorAll(".kafelek")`.
2. Pobierz referencje do listy `#lista-zamowienia` oraz przycisków `#btn-wyczysc` i `#btn-zatwierdz`.
3. Dla każdego kafelka zarejestruj nasłuchiwanie kliknięcia (`forEach`):
   - Wewnątrz zdarzenia odczytaj nazwę dania z atrybutu `data-danie` za pomocą `kafelek.getAttribute("data-danie")`.
   - Utwórz nowy element listy `document.createElement("li")`.
   - Ustaw tekst nowego elementu na odczytaną nazwę dania.
   - Wepnij element do listy za pomocą `lista.appendChild(noweLi)`.
4. Podepnij zdarzenie click pod przycisk `#btn-wyczysc`:
   - Wyczyść całą zawartość listy za pomocą `lista.innerHTML = ""`.
5. Podepnij zdarzenie click pod przycisk `#btn-zatwierdz`:
   - Wyświetl okno dialogowe z komunikatem: `alert("Zamówienie zostało przekazane do realizacji")`.
   - Wyczyść listę zamówień za pomocą `lista.innerHTML = ""`.

Spróbuj napisać ten kod samodzielnie. Po zakończeniu pracy sprawdź poniższy kod referencyjny.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
// 1. Pobieramy elementy z drzewa DOM
const kafelki = document.querySelectorAll(".kafelek");
const listaZamowienia = document.querySelector("#lista-zamowienia");
const btnWyczysc = document.querySelector("#btn-wyczysc");
const btnZatwierdz = document.querySelector("#btn-zatwierdz");

// 2. Obsługa kliknięcia kafelka potrawy
kafelki.forEach(kafelek => {
  kafelek.addEventListener("click", () => {
    // Odczytujemy nazwę potrawy zapisaną w atrybucie data-danie
    const nazwaDania = kafelek.getAttribute("data-danie");

    // Bezpiecznie tworzymy i wpinamy element <li>
    const noweLi = document.createElement("li");
    noweLi.textContent = nazwaDania;
    listaZamowienia.appendChild(noweLi);
  });
});

// 3. Obsługa przycisku Wyczyść
btnWyczysc.addEventListener("click", () => {
  listaZamowienia.innerHTML = "";
});

// 4. Obsługa przycisku Zatwierdź
btnZatwierdz.addEventListener("click", () => {
  alert("Zamówienie zostało przekazane do realizacji");
  listaZamowienia.innerHTML = "";
});
```
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Nowe elementy tworzymy metodą `document.createElement()`, wstawiamy tekst przez `textContent`, a dołączamy do strony za pomocą `appendChild()`.
- Wzorzec `createElement + appendChild` chroni istniejące elementy przed przebudowaniem i utratą podpiętych zdarzeń.
- Błyskawiczne czyszczenie kontenera realizujemy poprzez przypisanie pustego ciągu do `innerHTML = ""`.
- Atrybuty niestandardowe typu `data-*` pozwalają na bezpieczne przechowywanie danych biznesowych bezpośrednio w znacznikach HTML.
