# Plansza do gry i maszyna stanów tury

Tworzenie gier komputerowych oraz interaktywnych aplikacji biznesowych wymaga precyzyjnego kontrolowania kolejności zdarzeń. W grach turowych, systemach rezerwacji biletów czy kreatorach wieloetapowych kluczowym pojęciem architektonicznym jest **maszyna stanów** (ang. *state machine*). Odpowiada ona za śledzenie, czyja tura aktualnie trwa, jakie akcje są w danym momencie dozwolone oraz jak interfejs reaguje na kliknięcia użytkowników.

W tej lekcji stworzymy w pełni funkcjonalny silnik planszowy dla dwóch graczy oparty na klasycznej rozgrywce kółko i krzyżyk.

---

## 🎮 Makieta planszy i paneli graczy

Interfejs gry składa się z siatki 3x3 reprezentowanej przez tabelę (lub kontener CSS Grid) oraz dwóch paneli informacyjnych wskazujących, który gracz powinien wykonać kolejny ruch:

```html
<main class="game-wrapper">
  <aside id="panel-player-o" class="player-card active">
    <h2>Gracz 1: Kółko (O)</h2>
    <p class="status-badge">Twój ruch!</p>
  </aside>

  <section class="board-container">
    <table id="game-board">
      <tr>
        <td data-index="0"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="1"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="2"><img src="nic.png" alt="Puste pole" /></td>
      </tr>
      <tr>
        <td data-index="3"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="4"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="5"><img src="nic.png" alt="Puste pole" /></td>
      </tr>
      <tr>
        <td data-index="6"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="7"><img src="nic.png" alt="Puste pole" /></td>
        <td data-index="8"><img src="nic.png" alt="Puste pole" /></td>
      </tr>
    </table>

    <div class="controls">
      <button id="btn-reset-board" type="button">Zresetuj grę</button>
    </div>
  </section>

  <aside id="panel-player-x" class="player-card hidden">
    <h2>Gracz 2: Krzyżyk (X)</h2>
    <p class="status-badge">Oczekiwanie...</p>
  </aside>
</main>
```

---

## 🧠 Maszyna stanów w grach turowych

### 🔄 Zmienna stanu i deterministyczna zmiana tury

Sercem gry turowej jest pojedyncza zmienna reprezentująca aktualnego gracza. Na początku rozgrywki inicjalizujemy stan początkowy:

```javascript
let currentPlayer = "o"; // Dopuszczalne stany: "o" oraz "x"
```

Za każdym razem, gdy gracz wykona poprawny ruch, stan musi przełączyć się na drugiego gracza:

```javascript
function switchTurn() {
  if (currentPlayer === "o") {
    currentPlayer = "x";
  } else {
    currentPlayer = "o";
  }
}
```

Dzięki temu zmiana tury jest deterministyczna - niemożliwe jest wykonanie dwóch ruchów z rzędu przez tego samego gracza.

### 🔒 Blokada kliknięć i ochrona przed nadpisaniem pola

W grach planszowych pole raz zajęte nie może zostać zmienione. Jednym z najczęstszych błędów początkujących programistów jest brak walidacji zawartości komórki przed nałożeniem symbolu.

Możemy to zrealizować badając atrybut `src` obrazu wewnątrz komórki lub sprawdzając atrybut `dataset`:

```javascript
function handleCellClick(cell) {
  const image = cell.querySelector("img");

  // Jeśli w komórce nie ma grafiki pustego pola 'nic.png', pole jest już zajęte!
  if (!image.src.endsWith("nic.png")) {
    // Przerywamy wykonanie funkcji - nic nie robimy
    return;
  }

  // Wstawiamy symbol aktualnego gracza
  if (currentPlayer === "o") {
    image.src = "o.png";
    image.alt = "Kółko";
  } else {
    image.src = "x.png";
    image.alt = "Krzyżyk";
  }

  // Po poprawnym ruchu przełączamy stan
  switchTurn();
}
```

### 👁️ Synchronizacja wskaźników interfejsu użytkownika

Użytkownik musi w czytelny sposób widzieć, do kogo należy ruch. Synchronizujemy wygląd paneli bocznych przełączając klasy CSS lub modyfikując właściwość `style.display`:

```javascript
function updateTurnPanels() {
  const panelO = document.querySelector("#panel-player-o");
  const panelX = document.querySelector("#panel-player-x");

  if (currentPlayer === "o") {
    panelO.classList.remove("hidden");
    panelO.classList.add("active");

    panelX.classList.remove("active");
    panelX.classList.add("hidden");
  } else {
    panelX.classList.remove("hidden");
    panelX.classList.add("active");

    panelO.classList.remove("active");
    panelO.classList.add("hidden");
  }
}
```

### 🔄 Czyszczenie planszy i reset maszyny stanów

Reset rozgrywki wymaga wykonania dwóch operacji:
1. Przywrócenia stanu zmiennych logicznych (`currentPlayer = "o"`).
2. Przywrócenia stanu wyjściowego wszystkich węzłów DOM (zamiana wszystkich grafik na `nic.png` i zaktualizowanie paneli).

```javascript
function resetGame() {
  currentPlayer = "o";

  const allImages = document.querySelectorAll("#game-board img");
  allImages.forEach((img) => {
    img.src = "nic.png";
    img.alt = "Puste pole";
  });

  updateTurnPanels();
}
```

---

## 🎯 Sprawdź swoją wiedzę

<data-quiz>
  <question>
W jaki sposób najskuteczniej zapobiec nadpisaniu komórki, w której gracz postawił już swój znak?
  </question>
  <options>
    <option correct>Sprawdzić przed zmianą grafiki, czy źródło obrazu wskazuje na puste pole `nic.png`</option>
    <option>Usunąć całą tabelę z drzewa DOM i zbudować ją na nowo po każdym kliknięciu</option>
    <option>Wywołać funkcję `switchTurn()` przed wstawieniem nowego symbolu graficznego</option>
    <option>Ustawić styl `pointer-events: none` na całym nadrzędnym elemencie tabeli</option>
  </options>
</data-quiz>

<data-connection-matcher title="Dopasuj zdarzenie w grze do operacji na stanie lub modelu DOM">
  <div class="cmw-item" data-left="Kliknięcie w pole z `nic.png` przy turze `o`" data-right="Podmiana na `o.png` i przekazanie tury graczowi `x`"></div>
  <div class="cmw-item" data-left="Kliknięcie w pole z `o.png` lub `x.png`" data-right="Zignorowanie akcji i brak jakichkolwiek zmian na planszy"></div>
  <div class="cmw-item" data-left="Przełączenie tury na gracza `x`" data-right="Ukrycie lewego panelu gracza `o` i aktywacja panelu `x`"></div>
  <div class="cmw-item" data-left="Kliknięcie przycisku `Zresetuj grę`" data-right="Przywrócenie `nic.png` we wszystkich komórkach i tury gracza `o`"></div>
</data-connection-matcher>

---

## 💻 Wyzwanie kodowe - Kontroler tury w pojedynku bitewnym

Napisz funkcję `executeTurnMove(currentTurn, cellState)`, która przetwarza próbę wykonania ruchu na pojedynczym polu gry.

Wymagania:
1. `currentTurn` to string `"O"` lub `"X"`.
2. `cellState` to aktualny stan pola: `"empty"`, `"O"` lub `"X"`.
3. Jeżeli `cellState` nie jest równe `"empty"`, ruch jest niedozwolony. Funkcja powinna zwrócić obiekt:
   `{ valid: false, nextTurn: currentTurn, newCell: cellState }`.
4. Jeżeli pole było `"empty"`, ruch jest poprawny: pole przyjmuje wartość `currentTurn`, tura zmienia się na przeciwną (`"O"` przechodzi w `"X"`, a `"X"` w `"O"`), a funkcja zwraca:
   `{ valid: true, nextTurn: nextPlayer, newCell: currentTurn }`.

<data-gate>
  <data-code-runner language="javascript" title="Kontroler tury w pojedynku kółko i krzyżyk">
    <template data-type="html">
<div class="tictactoe-board-container" style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 16px; box-sizing: border-box;">
  <div class="tictactoe-status" id="ttt-status" style="font-size: 14px; font-weight: 700; padding: 8px 18px; border-radius: 20px; border: 2px solid var(--border-color); background: var(--bg-layer-2); color: var(--text-color);">
    Aktualna tura gracza: <span id="ttt-current-player" style="color: #3b82f6; font-size: 16px; font-weight: 800;">O</span>
  </div>
  <div class="tictactoe-grid" id="ttt-grid" style="display: grid !important; grid-template-columns: repeat(3, 80px) !important; grid-template-rows: repeat(3, 80px) !important; gap: 10px !important; width: 260px !important; margin: 12px auto !important; box-sizing: border-box !important;">
    <div class="tictactoe-cell" data-index="0" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="1" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="2" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="3" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="4" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="5" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="6" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="7" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
    <div class="tictactoe-cell" data-index="8" data-state="empty" style="width: 80px !important; height: 80px !important; border: 2px solid var(--border-color) !important; border-radius: 8px !important; background: var(--bg-layer-1) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 36px !important; font-weight: 800 !important; color: var(--text-color) !important; cursor: pointer !important; user-select: none !important; box-sizing: border-box !important;"></div>
  </div>
  <div class="kanban-status-banner" id="ttt-message" style="width: 100%; max-width: 320px; text-align: center; padding: 8px 12px; border-radius: 8px; font-size: 12.5px; font-weight: 600; border: 1px solid var(--border-color); background: var(--bg-layer-2); color: var(--text-color);">
    👉 Kliknij dowolne pole, aby wykonać ruch
  </div>
</div>
    </template>
    <template data-type="code">
// 1. Logika przejścia stanu tury (wymagane przez asercje testowe)
function executeTurnMove(currentTurn, cellState) {
  // TODO: Zaimplementuj walidację i naprzemienną zmianę tury:
  // 1. Jeśli cellState !== "empty" -> zwróć { valid: false, nextTurn: currentTurn, newCell: cellState }
  // 2. Jeśli cellState === "empty" -> tura przechodzi na przeciwną (O -> X, X -> O)
  //    i zwróć { valid: true, nextTurn: nextPlayer, newCell: currentTurn }
  
  return null;
}

// 2. Obsługa interaktywnej planszy gry (zakładka 🎮 Interaktywna Plansza Gry)
function initTicTacToeUI() {
  let activePlayer = "O";
  const cells = document.querySelectorAll(".tictactoe-cell");
  const playerDisplay = document.getElementById("ttt-current-player");
  const msgDisplay = document.getElementById("ttt-message");

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const currentState = cell.dataset.state;
      const decision = executeTurnMove(activePlayer, currentState);

      if (decision && decision.valid) {
        cell.textContent = decision.newCell;
        cell.dataset.state = decision.newCell;
        cell.classList.add(decision.newCell === "O" ? "cell-o" : "cell-x", "taken");

        activePlayer = decision.nextTurn;
        if (playerDisplay) {
          playerDisplay.textContent = activePlayer;
          playerDisplay.style.color = activePlayer === "O" ? "#3b82f6" : "#ef4444";
        }
        if (msgDisplay) {
          msgDisplay.className = "kanban-status-banner status-success";
          msgDisplay.innerHTML = `<span class="status-icon">✅</span> <span class="status-text">Ruch poprawny! Teraz ruch gracza: ${activePlayer}</span>`;
        }
      } else {
        const errorMsg = decision ? "Pole jest już zajęte!" : "Zaimplementuj executeTurnMove, aby wykonać ruch!";
        cell.classList.add("cell-error");
        setTimeout(() => cell.classList.remove("cell-error"), 400);

        if (msgDisplay) {
          msgDisplay.className = "kanban-status-banner status-blocked";
          msgDisplay.innerHTML = `<span class="status-icon">⛔</span> <span class="status-text">${errorMsg}</span>`;
        }
      }
    });
  });
}

initTicTacToeUI();
    </template>
    <template data-type="requirements">
      [
        {
          "id": "test-move-o",
          "text": "Prawidłowy ruch kółka na puste pole: { valid: true, nextTurn: 'X', newCell: 'O' }",
          "type": "test-case",
          "functionName": "executeTurnMove",
          "input": ["O", "empty"],
          "expected": {
            "valid": true,
            "nextTurn": "X",
            "newCell": "O"
          }
        },
        {
          "id": "test-move-x",
          "text": "Prawidłowy ruch krzyżyka na puste pole: { valid: true, nextTurn: 'O', newCell: 'X' }",
          "type": "test-case",
          "functionName": "executeTurnMove",
          "input": ["X", "empty"],
          "expected": {
            "valid": true,
            "nextTurn": "O",
            "newCell": "X"
          }
        },
        {
          "id": "test-blocked-move",
          "text": "Próba kliknięcia zajętego pola blokuje ruch: { valid: false, nextTurn: 'O', newCell: 'X' }",
          "type": "test-case",
          "functionName": "executeTurnMove",
          "input": ["O", "X"],
          "expected": {
            "valid": false,
            "nextTurn": "O",
            "newCell": "X"
          }
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

---

## 🛠️ Zadanie projektowe - Plansza do gry w kółko i krzyżyk

Zaimplementuj kompletny skrypt obsługujący planszę do gry opisaną w makiecie HTML. Postępuj zgodnie z poniższym planem działania.

### 📋 Lista kroków do samodzielnego wykonania:
1. **Definicja stanu i pobranie elementów**: Utwórz zmienną stanu `let currentPlayer = "o"`. Pobierz referencje do paneli `#panel-player-o`, `#panel-player-x`, przycisku `#btn-reset-board` oraz wszystkich komórek tabeli `document.querySelectorAll("#game-board td")`.
2. **Obsługa kliknięcia komórki tabeli**: Przypisz nasłuchiwacz zdarzenia `click` do każdej komórki `<td>`:
   - Pobierz element `<img>` wewnątrz komórki.
   - Sprawdź, czy `img.src` kończy się na `"nic.png"`. Jeśli nie - natychmiast przerwij działanie funkcji (`return`).
   - Jeśli pole jest puste, a `currentPlayer === "o"`, zmień grafikę na `"o.png"` i ustaw turę na `"x"`.
   - Jeśli pole jest puste, a tura należy do `"x"`, zmień grafikę na `"x.png"` i ustaw turę na `"o"`.
   - Zaktualizuj stan paneli bocznych.
3. **Synchronizacja widoczności paneli**: Zaimplementuj funkcję przełączającą widoczność paneli bocznych graczy (`hidden` / `active`), informując o tym, czyj ruch następuje.
4. **Resetowanie stanu gry**: Przypisz do przycisku `#btn-reset-board` przywrócenie tury gracza `"o"`, ustawienie grafiki `"nic.png"` dla wszystkich 9 komórek oraz odświeżenie paneli.

Spróbuj napisać rozwiązanie samodzielnie w edytorze kodu. Dopiero po zakończeniu próby rozwiń poniższy blok, aby porównać swoje rozwiązanie z kodem wzorcowym.

<details>
<summary>Pokaż przykładowy kod rozwiązania</summary>

```javascript
let currentPlayer = "o";

const panelO = document.querySelector("#panel-player-o");
const panelX = document.querySelector("#panel-player-x");
const cells = document.querySelectorAll("#game-board td");
const btnReset = document.querySelector("#btn-reset-board");

function updatePanels() {
  if (currentPlayer === "o") {
    panelO.classList.remove("hidden");
    panelO.classList.add("active");
    panelX.classList.remove("active");
    panelX.classList.add("hidden");
  } else {
    panelX.classList.remove("hidden");
    panelX.classList.add("active");
    panelO.classList.remove("active");
    panelO.classList.add("hidden");
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const img = cell.querySelector("img");
    if (!img) return;

    // Sprawdzenie czy pole jest puste
    if (!img.src.endsWith("nic.png")) {
      return; // Pole zajęte - brak akcji
    }

    if (currentPlayer === "o") {
      img.src = "o.png";
      img.alt = "Kółko";
      currentPlayer = "x";
    } else {
      img.src = "x.png";
      img.alt = "Krzyżyk";
      currentPlayer = "o";
    }

    updatePanels();
  });
});

btnReset.addEventListener("click", () => {
  currentPlayer = "o";
  cells.forEach((cell) => {
    const img = cell.querySelector("img");
    if (img) {
      img.src = "nic.png";
      img.alt = "Puste pole";
    }
  });
  updatePanels();
});

// Inicjalizacja widoku na start
updatePanels();
```
</details>

---

## 🐨 <span class="header-koala">Podsumowanie lekcji</span>

- Maszyna stanów w grze turowej opiera się na zmiennej kontrolnej, która deterministycznie przełącza się pomiędzy dopuszczalnymi wartościami po każdej poprawnej akcji.
- Ochrona przed nadpisaniem stanu polega na wczesnej weryfikacji zawartości komórki i wywołaniu instrukcji `return`, co zapobiega nieuprawnionym zmianom.
- Zmiana tury wymaga jednoczesnej aktualizacji modelu logicznego w pamięci skryptu oraz synchronizacji wskaźników wizualnych w drzewie DOM.
- Przycisk resetowania przywraca wyjściowy stan logiczny zmiennych oraz iteracyjnie odświeża wszystkie węzły interfejsu.
