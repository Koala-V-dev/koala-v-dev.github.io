# Pętla Zdarzeń, Asynchroniczność i Niezawodność (Cz. 1 - Event Loop, Microtasks i Macrotasks)

Witaj w pierwszej części modułu poświęconego temu, jak wewnątrz działa silnik JavaScript (V8 w Chrome/Node.js oraz SpiderMonkey w Firefox).

Jako Twój mentor przeprowadzę Cię przez mechanizm **Pętli Zdarzeń (Event Loop)**. Dowiesz się, jak jednowątkowy JavaScript radzi sobie z asynchronicznością, oraz dlaczego **Mikrozadania (Microtasks)** mają zawsze pierwszeństwo przed **Makrozadaniami (Macrotasks)**.

---

## 🎓 Krok 1: Jednowątkowość i Stos Wywołań (Call Stack)

JavaScript wykonuje kod w **jednym głównym wątku (Single Thread)**. Oznacza to, że silnik może wykonywać dokładnie **jedną instrukcję w danym momencie**.

Głównym magazynem wykonywanych funkcji jest **Stos Wywołań (Call Stack)**:

```mermaid
graph TD
    subgraph EngineJS["Silnik JavaScript"]
        Stack["Stos Wywołań (Call Stack) <br/> Executing: console.log()"]
    end

    subgraph Queues["Kolejki Asynchroniczne"]
        MicroQueue["Kolejka Mikrozadań (Microtasks) <br/> Promise.then(), queueMicrotask()"]
        MacroQueue["Kolejka Makrozadań (Macrotasks / Task Queue) <br/> setTimeout(), setInterval(), Event Listeners"]
    end

    EngineJS -->|Gdy stos wywołań staje się pusty| EventLoop["Pętla Zdarzeń (Event Loop)"]
    EventLoop -->|1. Opróżnia całą kolejkę| MicroQueue
    EventLoop -->|2. Przelicza klatkę obrazu (60 FPS)| Render[Renderowanie Przeglądarki]
    EventLoop -->|3. Pobiera JEDNO zadanie| MacroQueue
```

---

## 🎓 Krok 2: Hierarchia Pierwszeństwa (Microtasks vs Macrotasks)

Gdy Stos Wywołań staje się pusty, **Pętla Zdarzeń (Event Loop)** podejmuje decyzję, co wykonać w następnej kolejności:

1. **Synchrony Kod:** Wykonuje się natychmiast od góry do dołu.
2. **Mikrozadania (Microtask Queue):** Wykonują się **NATYCHMIAST po kodzie synchronicznym**. Pętla Zdarzeń opróżnia CAŁĄ kolejkę mikrozadań przed przejściem dalej!
   - *Przykłady:* Obietnice `Promise.then()`, `async/await`, `queueMicrotask()`.
3. **Makrozadania (Macrotask / Task Queue):** Pętla Zdarzeń pobiera **tylko JEDNO zadanie z kolejki**, po czym daje przeglądarce czas na przerysowanie ekranu (60 FPS).
   - *Przykłady:* `setTimeout()`, `setInterval()`, `requestAnimationFrame()`, zdarzenia kliknięć `addEventListener()`.

---

## 🛠️ Warsztat z Mentorem: Analiza Kolejności Wykonania Kodu

Przeanalizujmy poniższy kod. Zastanów się, w jakiej kolejności cyfry pojawią się w konsoli przeglądarki:

```javascript
console.log('1: Synchronous Start');

setTimeout(() => {
  console.log('2: Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Microtask (Promise)');
});

console.log('4: Synchronous End');
```

### 🔍 Rozbicie kolejności linia po linii (Od Mentora):

1. **Krok 1 (Kod synchroniczny):** Silnik napotyka `console.log('1...')`. Trafia na Call Stack i od razu wypisuje **`1: Synchronous Start`**.
2. **Krok 2 (Makrozadanie):** `setTimeout(..., 0)` przekazuje funkcję do Web API. Przeglądarka umieszcza ją w **Kolejce Makrozadań (Macrotask Queue)**.
3. **Krok 3 (Mikrozadanie):** `Promise.resolve().then(...)` tworzy rozwiązaną obietnicę. Funkcja trafia do **Kolejki Mikrozadań (Microtask Queue)**.
4. **Krok 4 (Kod synchroniczny):** Silnik napotyka `console.log('4...')`. Wypisuje **`4: Synchronous End`**.
5. **Krok 5 (Opróżnianie Mikrozadań):** Call Stack staje się pusty! Event Loop najpierw sprawdza Kolejkę Mikrozadań. Znajduje tam obietnicę i wypisuje **`3: Microtask (Promise)`**.
6. **Krok 6 (Pobranie Makrozadania):** Dopiero gdy Kolejka Mikrozadań jest pusta, Event Loop sięga do Kolejki Makrozadań i wypisuje **`2: Macrotask (setTimeout)`**.

#### Ostateczny Wynik w Konsoli:
```text
1: Synchronous Start
4: Synchronous End
3: Microtask (Promise)
2: Macrotask (setTimeout)
```

---

## 🛠️ Interaktywne Wyzwanie Kolejności Event Loop (Sortable List)

Ułóż w odpowiedniej chronologicznej kolejności fazy przetwarzania kodu przez Pętlę Zdarzeń JavaScript:

<data-sortable-list title="Ułóż kolejność wykonywania zadań przez Pętlę Zdarzeń (Event Loop)">
  <item data-correct="2">Opróżnienie całej Kolejki Mikrozadań (Promise.then(), async/await)</item>
  <item data-correct="1">Wykonanie całego synchronicznego kodu ze Stosu Wywołań (Call Stack)</item>
  <item data-correct="4">Pobranie JEDNEGO zadania z Kolejki Makrozadań (setTimeout, zdarzenia DOM)</item>
  <item data-correct="3">Przeliczenie klatki renderowania interfejsu (60 FPS / Style / Layout)</item>
</data-sortable-list>

---

### <span class="header-koala"><span>🦾</span><span>Executive Summary</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- JavaScript działa na **jednym głównym wątku (Call Stack)**.
- **Mikrozadania (`Promise.then`)** mają bezwzględne pierwszeństwo i wykonują się przed makrozadaniami.
- **Makrozadania (`setTimeout`)** czekają, aż stos i mikrozadania będą całkowicie puste.
