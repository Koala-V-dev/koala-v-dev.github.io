# Złota Era (Wstęp do RWD)

W Module 0 zbudowałeś stronę, która ma sens bez stylów. To był cel: HTML miał mówić prawdę o strukturze dokumentu.

Teraz wchodzimy w warstwę wyglądu. CSS nie ma naprawiać złego HTML-a. CSS ma nadać poprawnej strukturze czytelny rytm, proporcje, kolory, odstępy i układ.

Najważniejsza zasada tej lekcji brzmi: <strong>**CSS opisuje prezentację, ale nie może fałszować znaczenia dokumentu**</strong>.

---

## 🏛️ Dlaczego CSS w ogóle powstał?

W pierwszych latach WWW wygląd często wpisywano bezpośrednio w HTML:

```html
<body bgcolor="#111111" text="#eeeeee">
    <h1 align="center">Stara strona</h1>
    <table border="1" cellpadding="8">
        <tr>
            <td>Menu</td>
            <td>Treść</td>
        </tr>
    </table>
</body>
```

To działało, ale mieszało dwie odpowiedzialności:

- HTML miał opisywać treść.
- HTML jednocześnie próbował ustawiać wygląd.

Im większa strona, tym większy chaos. Zmiana koloru tła wymagała edycji wielu plików. Layout z tabel udawał dane tabelaryczne. Atrybuty wyglądu zaciemniały strukturę dokumentu.

CSS powstał, aby oddzielić znaczenie od prezentacji.

---

## 🎨 Pierwszy arkusz stylów

Najczystszy sposób pracy to osobny plik CSS podłączony w `<head>`.

```html
<link rel="stylesheet" href="styles.css">
```

Przykładowy plik `styles.css`:

```css
body {
    background-color: #111111;
    color: #eeeeee;
    font-family: Arial, sans-serif;
}

h1 {
    color: #7dd3fc;
}
```

HTML nadal opisuje treść. CSS opisuje sposób jej pokazania.

---

## 🧭 Trzy miejsca zapisu CSS

CSS możesz spotkać w trzech miejscach.

### 1. Plik zewnętrzny

```html
<link rel="stylesheet" href="styles.css">
```

To podstawowy i zalecany sposób. Jeden plik stylów może obsługiwać wiele podstron.

### 2. Znacznik <code>&lt;style&gt;</code>

```html
<style>
    body {
        color: #222222;
    }
</style>
```

Przydatne w małych przykładach i eksperymentach, ale w większym projekcie szybko robi bałagan.

### 3. Atrybut <code>style</code>

```html
<p style="color: red;">Ważny tekst</p>
```

To zapis inline. Unikaj go w normalnej pracy. Jest trudny do utrzymania i miesza HTML z wyglądem.

> [!NOTE]
> W tym module możesz zobaczyć `style` w krótkich przykładach porównawczych, ale docelowo uczymy się pisać CSS w osobnym pliku.

---

## 📱 RWD jako konsekwencja, nie sztuczka

RWD (*Responsive Web Design*) oznacza projektowanie strony tak, aby działała na różnych szerokościach ekranu.

To nie jest jedna magiczna reguła. To połączenie:

- poprawnego HTML-a,
- elastycznych jednostek,
- obrazów, które nie rozpychają kontenera,
- układów takich jak Flexbox i Grid,
- media queries, czyli reguł zależnych od warunków ekranu.

W Module 0 dodałeś:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

To był fundament. Teraz CSS zacznie realnie odpowiadać za układ.

---

## 🧪 Pierwsza zasada bezpieczeństwa CSS

CSS potrafi ukryć problem w HTML.

Możesz sprawić, że akapit wygląda jak nagłówek:

```css
p {
    font-size: 32px;
    font-weight: bold;
}
```

Ale to nadal będzie akapit. Robot indeksujący, czytnik ekranu i parser dokumentu nie uznają go za `<h1>`.

Dlatego zanim stylujesz, upewnij się, że HTML mówi prawdę.

---

<data-gate>
  <data-quiz>
    <question>Jaka jest podstawowa rola CSS względem HTML?</question>
    <options>
      <option>CSS zastępuje semantyczne tagi HTML, jeśli element dobrze wygląda.</option>
      <option correct>CSS opisuje prezentację poprawnie zbudowanej struktury HTML.</option>
      <option>CSS służy wyłącznie do animacji i efektów specjalnych.</option>
      <option>CSS zabezpiecza formularze przed błędnymi danymi użytkownika.</option>
    </options>
    <div data-hint="error">Pomyśl o podziale odpowiedzialności: HTML mówi, czym coś jest, CSS mówi, jak to wygląda.</div>
    <div data-hint="success">Dokładnie. CSS jest warstwą prezentacji, a nie zamiennikiem semantyki.</div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **CSS oddziela wygląd od struktury**: HTML opisuje znaczenie, CSS opisuje prezentację.
- **Plik zewnętrzny jest standardem**: `styles.css` podłączony przez `<link rel="stylesheet">` to bazowy sposób pracy.
- **Inline style to wyjątek**: `style="..."` miesza treść z prezentacją i utrudnia utrzymanie.
- **RWD zaczyna się od dobrej struktury**: Responsywność nie naprawi źle zbudowanego dokumentu.
- **Wygląd nie zmienia semantyki**: Akapit ostylowany jak nagłówek nadal jest akapitem.
