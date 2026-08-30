# Flexbox

Box model mówi, ile miejsca zajmuje element. Kaskada mówi, która reguła wygrywa.

Teraz potrzebujesz narzędzia do układania elementów w jednym kierunku: w rzędzie albo w kolumnie.

Do tego służy Flexbox.

Najważniejsza zasada tej lekcji brzmi: <strong>**Flexbox jest najlepszy wtedy, gdy układasz elementy w jednej osi**</strong>.

[FLEXBOX FROGGY](https://flexboxfroggy.com/#pl)
---

## 🧱 Kontener i elementy

Flexbox zaczyna się od kontenera.

```css
.nav-list {
    display: flex;
}
```

Bezpośrednie dzieci tego kontenera stają się elementami flex.

```html
<ul class="nav-list">
    <li><a href="index.html">Start</a></li>
    <li><a href="artykuly.html">Artykuły</a></li>
    <li><a href="kontakt.html">Kontakt</a></li>
</ul>
```

Pamiętaj: Flexbox działa na bezpośrednie dzieci kontenera, nie na wszystkie elementy głęboko w środku.

---

## ↔️ Kierunek osi

Domyślnie Flexbox układa elementy w rzędzie.

```css
.nav-list {
    display: flex;
    flex-direction: row;
}
```

Możesz zmienić kierunek na kolumnę:

```css
.nav-list {
    display: flex;
    flex-direction: column;
}
```

Główna oś zależy od `flex-direction`.

To ważne, bo `justify-content` działa wzdłuż osi głównej, a `align-items` wzdłuż osi poprzecznej.

---

## 🧭 Rozkład i wyrównanie

```css
.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

`justify-content` rozkłada elementy wzdłuż głównej osi.

Popularne wartości:

- `flex-start`,
- `center`,
- `flex-end`,
- `space-between`,
- `space-around`,
- `space-evenly`.

`align-items` wyrównuje elementy na osi poprzecznej.

Popularne wartości:

- `stretch`,
- `flex-start`,
- `center`,
- `flex-end`,
- `baseline`.

---

## 🧵 Zawijanie

Domyślnie Flexbox próbuje zmieścić elementy w jednym rzędzie.

```css
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
```

`flex-wrap: wrap` pozwala elementom przejść do kolejnego wiersza.

`gap` ustawia odstęp między elementami bez ręcznego kombinowania z marginesami.

---

## ⚖️ Wzrost i kurczenie

Element flex może rosnąć i kurczyć się.

```css
.card {
    flex: 1 1 250px;
}
```

To skrót od:

- `flex-grow`: czy element może rosnąć,
- `flex-shrink`: czy może się kurczyć,
- `flex-basis`: bazowy rozmiar.

W przykładzie karta ma bazowo `250px`, może rosnąć i może się kurczyć.

---

<data-gate>
  <data-connection-matcher title="Połącz właściwość Flexbox z jej rolą:">
    <div class="cmw-item" data-left="display: flex" data-right="Włącza układ flex na kontenerze"></div>
    <div class="cmw-item" data-left="flex-direction" data-right="Ustala kierunek głównej osi"></div>
    <div class="cmw-item" data-left="justify-content" data-right="Rozkłada elementy na osi głównej"></div>
    <div class="cmw-item" data-left="align-items" data-right="Wyrównuje elementy na osi poprzecznej"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Flexbox działa na kontenerze**: `display: flex` wpływa na jego bezpośrednie dzieci.
- **To układ jednej osi**: Najlepszy do pasków, menu, narzędzi, kart w rzędzie i prostych kolumn.
- **`justify-content` i `align-items` zależą od osi**: Najpierw ustal kierunek, potem wyrównuj.
- **`gap` jest lepszy niż ręczne marginesy między dziećmi**: Daje czytelny odstęp w układzie.
- **`flex` kontroluje elastyczność**: Element może rosnąć, kurczyć się i mieć rozmiar bazowy.
