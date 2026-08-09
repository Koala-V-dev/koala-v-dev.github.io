# Kolejność zdarzeń i niezawodna asynchroniczność

Użytkownik klika „Zapisz”. Przycisk zmienia etykietę, Promise aktualizuje komunikat, a timer usuwa blokadę. Kod wygląda liniowo, lecz wynik zależy od tego, kiedy poszczególne callbacki trafiają do wykonania.

Po tej lekcji odtworzysz ślad wykonania i rozpoznasz moment, w którym kod oddaje sterowanie przeglądarce.

## 🧠 Najpierw przewidź ślad

Nie uruchamiaj jeszcze kodu. Zapisz cztery etykiety w przewidywanej kolejności.

```javascript
const trace = [];

trace.push('A: kod synchroniczny');

setTimeout(() => {
  trace.push('D: callback timera');
}, 0);

Promise.resolve().then(() => {
  trace.push('C: reakcja Promise');
});

trace.push('B: koniec kodu synchronicznego');
```

Twoje przewidywanie jest hipotezą. Nie oceniaj go przed zebraniem wyniku.

## 🏗️ Model: zadanie i punkt kontrolny mikrozadań

Kod uruchomiony przez przeglądarkę wykonuje się w ramach **zadania**. Wywołania synchroniczne kończą się przed rozpoczęciem następnego zadania.

Reakcja rozwiązanej Promise trafia do kolejki *mikrozadań*. Przeglądarka wykonuje punkt kontrolny mikrozadań po zakończeniu stosu bieżącego skryptu. Mikrozadanie może dodać kolejne mikrozadanie, dlatego długa seria może opóźnić inne prace.

Timer z opóźnieniem `0` nie oznacza „uruchom teraz”. Oznacza, że callback może zostać zakolejkowany jako przyszłe zadanie po spełnieniu ograniczeń timera.

<strong>**Reguła diagnostyczna:**</strong> najpierw znajdź granicę bieżącego kodu synchronicznego. Dopiero potem rozpatruj reakcje Promise i przyszłe zadania.

> [!NOTE]
> Renderowanie nie jest obowiązkową trzecią fazą po każdym zadaniu. Przeglądarka aktualizuje widok, gdy występuje możliwość renderowania i aktualizacja jest potrzebna.

## 🔍 Zbierz dowód zamiast zgadywać

Dodaj na końcu programu:

```javascript
setTimeout(() => console.log(trace), 10);
```

Oczekiwany ślad:

```text
A: kod synchroniczny
B: koniec kodu synchronicznego
C: reakcja Promise
D: callback timera
```

Porównaj wynik z hipotezą. Jeśli różni się tylko pozycja `C` i `D`, przyczyną jest pomylenie mikrozadania z przyszłym zadaniem.

## 🛠️ Punkt kontrolny: znajdź granicę

<data-gate>
  <data-quiz>
    <question>Funkcja dopisała do śladu `start`, zaplanowała reakcję Promise, dopisała `koniec` i zwróciła wynik. Dlaczego w zwróconej tablicy nie ma jeszcze wpisu z Promise?</question>
    <options>
      <option>Promise zawsze wykonuje się po timerach.</option>
      <option correct>Funkcja zwróciła tablicę przed punktem kontrolnym mikrozadań.</option>
      <option>Silnik usuwa wpisy dodane przez callbacki asynchroniczne.</option>
    </options>
    <div data-hint="error">Wskaż dokładny moment wykonania `return` względem zakończenia bieżącego stosu.</div>
    <div data-hint="success">`return` należy do bieżącego kodu synchronicznego. Reakcja Promise może wykonać się dopiero po zwolnieniu stosu.</div>
  </data-quiz>
</data-gate>

## 🧪 Napraw obserwację kolejności

Poniższa funkcja ma zwrócić pełny ślad. Obecnie zwraca go zbyt wcześnie. Zmień funkcję tak, aby test zobaczył także callback timera.

Nie wpisuj oczekiwanej tablicy na sztywno. Test ma sprawdzać rzeczywiste wykonanie callbacków.

<data-gate>
  <data-code-runner language="javascript" title="Zbierz pełny ślad Event Loop">
    <template data-type="code">
async function observeOrder() {
  const trace = [];
  trace.push('sync:start');

  setTimeout(() => {
    trace.push('task:timer');
  }, 0);

  Promise.resolve().then(() => {
    trace.push('microtask:promise');
  });

  trace.push('sync:end');

  await Promise.resolve();
  return trace;
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "complete-trace",
          "text": "Funkcja zwraca pełny ślad po wykonaniu timera",
          "type": "test-case",
          "functionName": "observeOrder",
          "input": [],
          "expected": ["sync:start", "sync:end", "microtask:promise", "task:timer"]
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

Kryterium ukończenia: wynik pochodzi z tablicy uzupełnianej przez callbacki, a nie z ręcznie zwróconej stałej.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Jedno z poprawnych rozwiązań czeka na przyszłe zadanie:

```javascript
async function observeOrder() {
  const trace = [];
  trace.push('sync:start');

  setTimeout(() => trace.push('task:timer'), 0);
  Promise.resolve().then(() => trace.push('microtask:promise'));

  trace.push('sync:end');
  await new Promise(resolve => setTimeout(resolve, 10));
  return trace;
}
```

Samo `await Promise.resolve()` przepuszcza reakcje Promise, lecz nie czeka na zadanie timera.

</details>

## 🔄 Przenieś model na nowy przypadek

Zamień reakcję Promise na pięć tysięcy mikrozadań, z których każde dodaje następne. Przewidź, co stanie się z reakcją przycisku i możliwością renderowania.

Nie potrzebujesz dokładnego czasu. Uzasadnij kierunek zmiany: długa kolejka mikrozadań może opóźnić przejście do innych zadań i aktualizacji widoku.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wyznacz granicę kodu synchronicznego przed analizą callbacków.
- Traktuj timer jako przyszłe zadanie, nie natychmiastowe wywołanie.
- Potwierdzaj model śladem wykonania, a nie hasłem o „pierwszeństwie”.
