# CSS Grid

Flexbox świetnie układa elementy w jednej osi. Ale strona często potrzebuje układu dwuwymiarowego: kolumn i wierszy jednocześnie.

Do tego służy CSS Grid.

Najważniejsza zasada tej lekcji brzmi: <strong>**Grid jest najlepszy wtedy, gdy projektujesz relację kolumn i wierszy**</strong>.

---

## 🧱 Kontener grid

Grid zaczyna się od kontenera:

```css
.layout {
    display: grid;
}
```

Bezpośrednie dzieci stają się elementami grid.

```html
<main class="layout">
    <article>Treść</article>
    <aside>Linki powiązane</aside>
</main>
```

---

## 🧮 Kolumny i wiersze

Podstawowe właściwości:

```css
.layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
}
```

`grid-template-columns: 2fr 1fr` tworzy dwie kolumny:

- pierwsza dostaje dwie części dostępnej przestrzeni,
- druga dostaje jedną część.

Jednostka `fr` oznacza ułamek wolnej przestrzeni.

---

## 📐 Repeat i minmax

Grid ma funkcje, które pomagają budować elastyczne siatki.

```css
.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
```

To tworzy trzy równe kolumny.

Bardziej elastyczny zapis:

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
}
```

Ten układ tworzy tyle kolumn, ile się zmieści. Każda karta ma minimum `240px`, a potem może rosnąć.

To jeden z fundamentów responsywnego CSS bez ręcznego liczenia breakpointów dla każdego przypadku.

---

## 🗺️ Obszary siatki

Grid potrafi nazywać obszary layoutu.

```css
.page {
    display: grid;
    grid-template-areas:
        "header header"
        "main aside"
        "footer footer";
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
}

header {
    grid-area: header;
}

main {
    grid-area: main;
}

aside {
    grid-area: aside;
}

footer {
    grid-area: footer;
}
```

To czytelne, ale pamiętaj: kolejność wizualna nie powinna fałszować kolejności HTML.

HTML nadal ma mieć logiczny porządek dokumentu.

---

## 🧭 Grid czy Flexbox?

Uproszczona decyzja:

| Problem | Lepsze narzędzie |
| :--- | :--- |
| Menu w jednym rzędzie | Flexbox |
| Pasek narzędzi | Flexbox |
| Karty zawijające się w rzędach | Flexbox albo Grid |
| Cały layout strony z kolumnami i wierszami | Grid |
| Galeria obrazów | Grid |
| Dashboard z panelami | Grid |

Nie chodzi o religię narzędzi. Chodzi o oś problemu.

Flexbox myśli linią. Grid myśli siatką.

---

<data-gate>
  <data-quiz>
    <question>Kiedy CSS Grid jest zwykle lepszym wyborem niż Flexbox?</question>
    <options>
      <option>Gdy chcesz pogrubić tekst w akapicie.</option>
      <option>Gdy układasz pojedynczy przycisk w formularzu.</option>
      <option correct>Gdy projektujesz układ kolumn i wierszy jednocześnie.</option>
      <option>Gdy chcesz zmienić atrybut <code>alt</code> obrazka.</option>
    </options>
    <div data-hint="error">Pomyśl o różnicy między jedną osią a siatką dwuwymiarową.</div>
    <div data-hint="success">Dokładnie. Grid jest naturalny dla układów dwuwymiarowych.</div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Grid tworzy siatkę**: Działa na kolumnach i wierszach jednocześnie.
- **`fr` dzieli wolną przestrzeń**: To wygodna jednostka layoutu.
- **`repeat()` skraca zapis**: Pomaga tworzyć powtarzalne kolumny.
- **`minmax()` stabilizuje responsywność**: Pozwala określić minimum i maksimum rozmiaru toru.
- **Flexbox i Grid się uzupełniają**: Flexbox jest linią, Grid jest mapą.
