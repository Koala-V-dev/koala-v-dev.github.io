# Animacje z requestAnimationFrame, FLIP i ograniczonym ruchem

Po zmianie kolejności kart element przeskakuje do nowego miejsca. Chcesz pokazać relację między pozycją starą i nową, ale bez animowania właściwości układu w każdej klatce.

Po tej lekcji obliczysz transformację FLIP i przygotujesz równoważny wariant bez ruchu.

## 🧠 Najpierw oblicz przesunięcie

Przed zmianą karta ma pozycję `{ left: 40, top: 100 }`.

Po zmianie ma pozycję `{ left: 220, top: 160 }`.

Jaką transformację trzeba zastosować do nowej pozycji, aby karta wizualnie zaczęła w starym miejscu?

Odejmij pozycję końcową od początkowej. Wynik to `translate(-180px, -60px)`.

## 🧭 Model FLIP jako cztery działania

Nazwy pomagają odtworzyć procedurę:

```text
First   zmierz pozycję początkową
Last    wykonaj zmianę i zmierz pozycję końcową
Invert  przesuń wizualnie element z powrotem o różnicę
Play    animuj transformację do wartości końcowej
```

Najpierw są pomiary. Zmiana kolejności DOM występuje między nimi. Animacja używa `transform`, a nie wielokrotnej zmiany `top` i `left`.

```javascript
const first = card.getBoundingClientRect();
list.prepend(card);
const last = card.getBoundingClientRect();

const dx = first.left - last.left;
const dy = first.top - last.top;

card.animate([
  { transform: `translate(${dx}px, ${dy}px)` },
  { transform: 'translate(0, 0)' }
], { duration: 220, easing: 'ease-out' });
```

Web Animations API planuje przebieg animacji. Gdy ręcznie aktualizujesz wartości w czasie, użyj znacznika czasu przekazanego do `requestAnimationFrame`, zamiast zakładać stałe 60 klatek na sekundę.

## 🔬 Zachowaj znaczenie bez ruchu

Preferencja ograniczonego ruchu nie oznacza ukrycia rezultatu działania.

```javascript
const reduceMotion = matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (reduceMotion) {
  card.focus();
  status.textContent = 'Pozycja została przeniesiona na początek.';
} else {
  playFlip(card, first, last);
}
```

W obu wariantach karta trafia do nowego miejsca. Wariant ograniczony przekazuje zmianę fokusem lub komunikatem, bez przejścia przestrzennego.

## 🛠️ Punkt kontrolny: oddziel rezultat od efektu

<data-gate>
  <data-quiz>
    <question>Użytkownik preferuje ograniczony ruch. Które zachowanie zachowuje funkcję interfejsu?</question>
    <options>
      <option>Anulować zmianę kolejności kart.</option>
      <option correct>Wykonać zmianę natychmiast i przekazać wynik bez animacji przestrzennej.</option>
      <option>Wydłużyć animację dwukrotnie.</option>
    </options>
    <div data-hint="error">Preferencja dotyczy sposobu prezentacji ruchu, nie prawa do uzyskania rezultatu.</div>
    <div data-hint="success">Stan końcowy pozostaje ten sam, zmienia się sposób komunikowania przejścia.</div>
  </data-quiz>
</data-gate>

## 🧪 Oblicz odwrócenie FLIP

Zwróć `{ x, y }`, które przenosi element z pozycji końcowej do początkowej.

<data-gate>
  <data-code-runner language="javascript" title="Oblicz transformację odwracającą">
    <template data-type="code">
function invertPosition(first, last) {
  return { x: 0, y: 0 };
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "move-right-down",
          "text": "Ruch w prawo i w dół daje ujemne odwrócenie",
          "type": "test-case",
          "functionName": "invertPosition",
          "input": [{"left":40,"top":100},{"left":220,"top":160}],
          "expected": {"x":-180,"y":-60}
        },
        {
          "id": "move-left-up",
          "text": "Ruch w lewo i w górę daje dodatnie odwrócenie",
          "type": "test-case",
          "functionName": "invertPosition",
          "input": [{"left":220,"top":160},{"left":40,"top":100}],
          "expected": {"x":180,"y":60}
        },
        {
          "id": "no-move",
          "text": "Brak zmiany pozycji nie tworzy przesunięcia",
          "type": "test-case",
          "functionName": "invertPosition",
          "input": [{"left":10,"top":10},{"left":10,"top":10}],
          "expected": {"x":0,"y":0}
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function invertPosition(first, last) {
  return {
    x: first.left - last.left,
    y: first.top - last.top
  };
}
```

Różnica jest odwróceniem zmiany, ponieważ element znajduje się już w położeniu końcowym.

</details>

## 🔄 Przenieś technikę na zmianę rozmiaru

Dodaj prostokąty z `width` i `height`. Oblicz także skale `first.width / last.width` oraz `first.height / last.height`.

Sprawdź przypadek, w którym wymiar końcowy wynosi zero. Kryterium: kod nie tworzy `Infinity`, a zamiast animacji wybiera bezpieczne przejście natychmiastowe.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Mierz stan przed zmianą i po niej, a następnie animuj różnicę.
- Używaj czasu callbacka, gdy samodzielnie obliczasz postęp animacji.
- Zachowuj rezultat interakcji także w wariancie ograniczonego ruchu.
