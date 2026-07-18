# Box Model i Jednostki

Każdy element wyświetlany na stronie internetowej zajmuje określone miejsce. Nawet jeśli na ekranie widzisz tylko pojedynczą literę lub zaokrąglony przycisk, przeglądarka pod spodem traktuje go jak idealny, prostokątny obszar.

Ten prostokąt składa się z kilku warstw układających się jedna w drugą jak rosyjska matrioszka 🪆. Zrozumienie tego mechanizmu (tzw. **Box Model** lub model pudełkowy) oraz jednostek miar to absolutny fundament tworzenia stabilnych layoutów w CSS.

---

## 📦 Cztery warstwy pudełka

Każde pudełko CSS składa się z czterech warstw (od wewnątrz do zewnątrz):

<div style="background-color: rgb(51 26 1);border: 1px dashed #ff8200;padding: 16px;margin: 16px 0;border-radius: 8px;font-family: system-ui, sans-serif;">
  <span style="color: #ff8f1b;font-weight: bold;font-size: 12px;text-transform: uppercase;letter-spacing: 0.5px;">Margin</span>
  <span style="color: #d3d3d3;font-size: 11px;margin-left: 8px;">— odstęp zewnętrzny (tło rodzica)</span>
  <div style="background-color: rgb(87 68 9);border: 1px solid #ffc000;padding: 16px;margin-top: 10px;border-radius: 6px;">
    <span style="color: #ffdc6f;font-weight: bold;font-size: 12px;text-transform: uppercase;letter-spacing: 0.5px;">Border</span>
    <span style="color: #d3d3d3;font-size: 11px;margin-left: 8px;">— obramowanie elementu</span>
    <div style="background-color: rgb(18 53 3);border: 1px dashed #5cb536;padding: 16px;margin-top: 10px;border-radius: 6px;">
      <span style="color: #4dd519;font-weight: bold;font-size: 12px;text-transform: uppercase;letter-spacing: 0.5px;">Padding</span>
      <span style="color: #d3d3d3;font-size: 11px;margin-left: 8px;">— odstęp wewnętrzny (tło elementu)</span>
      <div style="background-color: rgb(0 42 51);border: 1px solid #45818e;padding: 16px;margin-top: 10px;border-radius: 4px;text-align: center;">
        <span style="color: #0ac2e7;font-weight: bold;font-size: 12px;text-transform: uppercase;letter-spacing: 0.5px;">Content</span>
        <div style="color: #d3d3d3;font-size: 11px;margin-top: 4px;">— właściwa treść (tekst, grafika)</div>
      </div>
    </div>
  </div>
</div>

1.  **`content` (Zawartość):** Właściwy obszar roboczy, w którym znajduje się tekst, obrazek lub inne elementy potomne.
2.  **`padding` (Odstęp wewnętrzny):** Przestrzeń otaczająca treść. Przyjmuje kolor tła elementu. Używamy jej, gdy chcemy odsunąć tekst od obramowania.
3.  **`border` (Obramowanie):** Linia otaczająca padding i treść. Może mieć różną grubość, styl (np. ciągła, przerywana) oraz kolor.
4.  **`margin` (Margines zewnętrzny):** Pusta przestrzeń na zewnątrz obramowania, służąca do odsuwania pudełka od sąsiednich elementów. Jest całkowicie przezroczysta i pokazuje tło rodzica.

Przykładowy zapis w CSS:
```css
.card {
    width: 300px;
    height: 150px;
    padding: 20px;
    border: 2px solid #444444;
    margin: 30px;
}
```

---

## 🧮 <code>box-sizing</code>: <code>content-box</code> vs <code>border-box</code>

To, jak przeglądarka oblicza całkowity rozmiar elementu na ekranie, zależy od właściwości `box-sizing`. Wyróżniamy dwa modele:

### 1. <code>content-box</code> (Model domyślny)

W tym modelu szerokość (`width`) i wysokość (`height`) dotyczą wyłącznie warstwy *`content`*. Każdy dopisany `padding` i `border` zwiększa optyczny rozmiar elementu na ekranie.

*   **Wzór na całkowitą szerokość:**
    $$\text{Szerokość całkowita} = \text{width} + 2 \times \text{padding} + 2 \times \text{border}$$
*   Dla powyższej klasy `.card`:
    $$\text{Szerokość} = 300\text{px} + 2 \times 20\text{px} + 2 \times 2\text{px} = 344\text{px}$$
    
To zachowanie często prowadzi do rozbicia układu stron. Elementy stają się szersze niż zakładaliśmy i spadają do nowego wiersza.

### 2. `border-box` (Model rekomendowany)

W tym modelu szerokość (`width`) określa całkowity rozmiar pudełka na ekranie (wliczając w to `padding` i `border`). Jeśli dodasz `padding` lub `border`, obszar treści (`content`) automatycznie się skurczy, aby zachować stałą szerokość.

*   Dla powyższej klasy `.card` o szerokości $300\text{px}$, element na ekranie będzie miał dokładnie $300\text{px}$ szerokości. 
*   Obszar samej treści (`content`) zmniejszy się do:
    $$300\text{px} - 2 \times 20\text{px} - 2 \times 2\text{px} = 256\text{px}$$

Dlatego standardową praktyką na początku każdego projektu jest globalny reset:
```css
* {
    box-sizing: border-box;
}
```
Dzięki temu projektowanie układów staje się intuicyjne i przewidywalne.

---

### 🚀 Stacja Treningowa: Kontrola modelu pudełkowego

Domyślnie przeglądarka stosuje model pudełkowy `content-box`. W tym modelu szerokość elementu na ekranie to suma szerokości zawartości, dopełnienia (`padding`) oraz obramowania (`border`). Może to sprawiać, że elementy stają się szersze niż planowaliśmy, rozbijając układ strony.

Twoim zadaniem jest zmiana modelu pudełkowego na `border-box` w klasie `.card` oraz dodanie koloru tła.

**Zasady gry:**
-   Wpisz swoje style wewnątrz bloku `.card`.
-   Zmień model pudełkowy elementu na `border-box`, aby jego rzeczywista szerokość wynosiła dokładnie `300px`.
-   Ustaw kolor tła elementu na ciemny granat (`#2c3e50`).

<data-gate>
  <data-web-challenge id="box-sizing-challenge">
<template data-type="html-readonly">
<div class="card">
  Tekst wewnątrz karty
</div>
</template>
<template data-type="css-readonly">
.card {
  width: 300px;
  padding: 20px;
  border: 5px solid #3498db;
}
</template>
<template data-type="css">
/* Wpisz reguły poniżej */
</template>
<template data-type="requirements">
      [
        {"id": "box-sizing", "text": "Ustaw box-sizing elementu .card na border-box", "type": "selector-css", "selector": ".card", "property": "box-sizing", "value": "border-box"},
        {"id": "bg-color", "text": "Ustaw kolor tła elementu .card na #2c3e50", "type": "selector-css", "selector": ".card", "property": "background-color", "value": "#2c3e50"}
      ]
    </template>
  </data-web-challenge>
</data-gate>

---

## 🧪 Eksperyment: Interaktywny symulator modelu pudełkowego

Sprawdź, jak parametry `box-sizing` oraz `display` wpływają na zachowanie i rzeczywiste wymiary elementu:

<iframe src="/public/resources/web-site-preview/box-model-visualizer.html" width="600" height="620" style="border: 3px solid #ccc; width: 100%; border-radius: 12px; background-color: #0c0f16;" title="Wizualizator Box Modelu CSS" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

## 🧱 Typy wyświetlania (CSS Display)

Właściwość `display` decyduje o tym, jak element pozycjonuje się w strukturze dokumentu i jak reaguje na reguły modelu pudełkowego.

| Wartość            | Zachowanie w układzie                                                                               | Wpływ marginesów i paddingów                                                                                                                    | Przykłady                           |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------- |
| **`block`**        | Zajmuje całą dostępną szerokość rodzica (zaczyna się od nowej linii).                               | W pełni respektuje `width`, `height`, `padding` oraz `margin`.                                                                                  | `<div>`, `<p>`, `<h1>`, `<article>` |
| **`inline`**       | Wpasowuje się w nurt tekstu. Zajmuje tylko tyle miejsca, ile jego zawartość.                        | **Ignoruje `width` i `height`.** Marginesy i paddingi działają tylko w poziomie; w pionie nakładają się na sąsiednie linie, nie odpychając ich! | `<a>`, `<span>`, `<strong>`, `<em>` |
| **`inline-block`** | Układa się w jednej linii z innymi elementami (jak inline), ale zachowuje się w środku jak pudełko. | W pełni respektuje `width`, `height`, `padding` oraz pionowe/poziome marginesy.                                                                 | `<img>`, `<button>`, `<input>`      |
| **`none`**         | Element jest całkowicie usuwany z drzewa renderowania (znika z ekranu i nie zajmuje miejsca).       | Brak (element nie istnieje w układzie).                                                                                                         | *Brak domyślnych*                   |

---

## 📏 Jednostki CSS pod lupą

Elastyczny i responsywny interfejs wymaga świadomego doboru jednostek miar.

### 1. Piksele (<code>px</code>) — Jednostka absolutna
- *Charakterystyka:* Stały rozmiar fizyczny na ekranie.
- _**Zastosowanie:**_ Cienkie obramowania (np. `border: 1px solid`), precyzyjne cienie, drobne elementy geometryczne.
- **_Wada:_** Brak elastyczności. Jeśli użytkownik zwiększy bazowy rozmiar czcionki w ustawieniach systemowych lub przeglądarce, elementy zadeklarowane w `px` nie dopasują się.

### 2. <code>rem</code> (Root EM) - Jednostka względna dostępności
- *Charakterystyka:* Odnosi się do bazowego rozmiaru czcionki elementu głównego (`<html>`). Zazwyczaj domyślny rozmiar to **$16\text{px}$**.
- *Skala:* $1\text{rem} = 16\text{px}$
  $1.5\text{rem} = 24\text{px}$
  $0.5\text{rem} = 8\text{px}$
- _**Zastosowanie:**_ Rozmiary czcionek (`font-size`), odstępy wewnętrzne (`padding`), marginesy układu.
- **Zaleta:** Pełna elastyczność i zgodność z zasadami dostępności WCAG. Tekst i layout skalują się proporcjonalnie do preferencji użytkownika.

### 3. <code>em</code> - Jednostka względna kontekstu
- *Charakterystyka:* Odnosi się do rozmiaru czcionki **bieżącego elementu** (lub jego rodzica).
- _**Zastosowanie:**_ Właściwości, które powinny zmieniać się proporcjonalnie do tekstu w danym komponencie — np. wielkość ikony obok tekstu czy odstępy wewnątrz przycisku o różnej skali wielkości (`btn-lg`, `btn-sm`).

### 4. 📱 Jednostki obszaru roboczego oraz procenty (<code>%</code>, <code>vw</code>, <code>vh</code>, <code>svh</code>, <code>lvh</code>, <code>dvh</code>)

Zanim przejdziemy do nowości na urządzeniach mobilnych, zdefiniujmy **obszar roboczy (viewport)**. Viewport to widoczna część strony w oknie przeglądarki. W przeciwieństwie do procentów (`%`), które liczą swój rozmiar względem bezpośredniego rodzica (kontenera), jednostki viewportu odnoszą się bezpośrednio do wymiarów całego okna urządzenia.

-   **`%`**: Odnosi się do rozmiaru rodzica. Idealne do tworzenia elastycznych siatek, kolumn i drobnych komponentów wewnątrz sekcji.
-   **`vw` (Viewport Width):** $1\text{vw}$ to $1\%$ szerokości okna przeglądarki. 
    > [!WARNING]
    > **Klasyczna pułapka z `100vw` na komputerach:**
    > Jednostka `vw` wlicza w szerokość okna również pionowy suwak (scrollbar) przeglądarki na desktopie! Jeśli nadasz głównemu kontenerowi `width: 100vw`, a strona będzie długa i pojawi się suwak, element rozciągnie się pod suwak, wywołując irytujący **poziomy pasek przewijania (horizontal scroll)** na dole ekranu. Dlatego dla szerokości elementów blokowych prawie zawsze lepszym wyborem jest `width: 100%`.
-   **`vh` (Viewport Height):** $1\text{vh}$ to $1\%$ wysokości okna przeglądarki.

## 🔗 Połącz Pary: Jednostki miar w CSS
<data-gate>
  <data-connection-matcher title="Dopasuj jednostki miar w CSS do ich zachowania i przeznaczenia">
      <div class="cmw-item" data-left="px" data-right="Jednostka absolutna o stałym rozmiarze fizycznym na ekranie (dobra do cienkich ram)."></div>
      <div class="cmw-item" data-left="rem" data-right="Jednostka względna oparta na rozmiarze czcionki elementu głównego html (domyślnie $16\text{px}$)."></div>
      <div class="cmw-item" data-left="em" data-right="Jednostka względna odnosząca się do rozmiaru czcionki bieżącego elementu lub jego rodzica."></div>
      <div class="cmw-item" data-left="vw" data-right="Jednostka względna określająca szerokość okna przeglądarki ($1\text{vw}$ to $1\%$ tej szerokości)."></div>
      <div class="cmw-item" data-left="vh" data-right="Jednostka względna określająca wysokość okna przeglądarki ($1\text{vh}$ to $1\%$ tej wysokości)."></div>
      <div class="cmw-item" data-left="%" data-right="Jednostka względna obliczająca rozmiar w stosunku do wymiarów bezpośredniego rodzica."></div>
  </data-connection-matcher>
</data-gate>

---

## 🕵️ Dlaczego tradycyjne <code>100vh</code> popsuło się na telefonach?
Na komputerze wysokość okna zmienia się rzadko. Na smartfonach jednak dynamiczne paski adresu przeglądarek (na dole w Safari na iOS, na górze w Chrome/Firefox na Androidzie) **chowają się przy skrolowaniu w dół i wysuwają przy skrolowaniu w górę**.

Przeglądarki mobilne nie mogły płynnie aktualizować `100vh` podczas każdego ruchu palca, ponieważ wywoływało to drżenie całej strony (ciągłe przeliczanie rozmiarów wszystkich elementów na stronie, tzw. *layout reflow*). Z tego powodu Apple i Google zdecydowały o **zamrożeniu wartości `100vh` na maksymalną wysokość ekranu (tak jakby paska adresu w ogóle nie było)**.

W efekcie:
- Gdy wchodzisz na stronę i pasek adresu jest widoczny, dolna część Twojego kontenera o wysokości `100vh` (np. stopka na dole strony) **zostaje zasłonięta przez ten pasek** i staje się niewidoczna bez przewinięcia strony.

---

### 🛠️ Nowe jednostki mobilne: <code>svh</code>, <code>lvh</code> oraz <code>dvh</code> (CSS Viewports Level 4)
Aby dać nam pełną kontrolę, W3C wprowadziło trzy dedykowane jednostki wysokości:

1. _**`svh` (Small Viewport Height):**_
   * Wysokość wyliczana dla stanu, gdy dynamiczne paski przeglądarki *są w pełni widoczne* (najmniejszy możliwy obszar roboczy).
   * **Zastosowanie:** Świetne do sekcji powitalnych, które od razu po wejściu muszą mieścić się na ekranie.
   * **_Wada (Pusta przestrzeń / Gap):_** Jeśli ustawisz `html, body { height: 100svh; }`, a użytkownik zacznie skrolować stronę i pasek adresu się schowa, wysokość Twojego kontenera się nie zmieni. Na samym dole ekranu pod Twoją stroną odsłoni się pusta, zazwyczaj biała przestrzeń (tło przeglądarki). To ten słynny *„nieszczęsny biały pasek”*, z którym deweloperzy zmagają się przy budowaniu mobilnych stron od zera.

2. _**`lvh` (Large Viewport Height):**_
   * Wysokość wyliczana dla stanu, gdy dynamiczne paski przeglądarki *są całkowicie schowane* (największy możliwy obszar roboczy). Odpowiednik tradycyjnego `vh` na mobile.
   * **Zastosowanie:** Rzadkie, głównie do sekcji, które mają być ogromne i mogą częściowo chować się pod interfejsem przeglądarki na start.

3. _**`dvh` (Dynamic Viewport Height):**_
   * Dynamiczna wysokość, która *płynnie reaguje na przewijanie strony*.
   * Gdy pasek adresu jest widoczny, `100dvh` ma rozmiar `svh` (np. `927px`). Gdy skrolujesz i pasek znika – płynnie rośnie do `lvh` (np. `1005px`).
   * **Zastosowanie:** Najlepszy standard dla głównych kontenerów strony (`html`, `body`), ponieważ eliminuje zarówno problem zasłaniania elementów na start, jak i powstawania pustych przestrzeni po przewinięciu.

> [!TIP]
> **Jak poprawnie ostylować główny kontener strony?**
> Aby uniknąć białych pasków i mieć pewność, że Twoje tło zawsze pasuje, stosuj w swoich projektach standardową regułę:
> ```css
> html, body {
>     height: 100dvh;
>     margin: 0;
>     background-color: #twój-kolor-tła; /* Nadanie tła elementowi html zapobiega wyświetlaniu fabrycznego tła przeglądarki pod spodem */
> }
> ```

---

### ⌨️ Zmora wirtualnej klawiatury (<code>interactive-widget</code>)
Dynamiczne paski przeglądarki to jedno, ale prawdziwym wyzwaniem jest wirtualna klawiatura mobilna. Kiedy użytkownik klika w pole tekstowe (`<input>`), wysuwa się klawiatura, która zabiera ogromną część ekranu (np. 45% wysokości). 

To, jak przeglądarka zareaguje na pojawienie się klawiatury, zależy od systemu operacyjnego i silnika renderowania:
- **Safari (iOS):** Domyślnie **nakłada klawiaturę na wierzch strony** (zachowanie `overlays-content`). Cała wysokość viewportu pozostaje bez zmian, a dolna część elementów `100vh`/`100dvh` oraz formularzy zostaje bezpowrotnie zasłonięta.
- **Chrome / Firefox (Android):** Domyślnie **zmniejszają fizyczną wysokość obszaru roboczego** (zachowanie zbliżone do `resizes-content`). Elementy `100dvh` automatycznie kurczą się, dzięki czemu cały widok (w tym przyciski na dole) przesuwa się w górę i mieści się nad klawiaturą.

Przeglądarki pozwalają nam w pełni kontrolować to zachowanie w tagu `<meta>` za pomocą parametru `interactive-widget`:

- Klawiatura wysuwa się nad treść, nie wpływając na rozmiar viewportu (zachowanie z iOS Safari).`
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=overlays-content">
```
- Klawiatura fizycznie pomniejsza wysokość viewportu, zmuszając jednostki `vh`/`dvh` do dostosowania się i przesunięcia całej strony w górę (zachowanie z Android Chrome).
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">
```
Poniższa tabela pomoże Ci w podjęciu decyzji projektowej:

| Ustawienie w `<meta>` (`interactive-widget`)   | Zachowanie `100svh` / `100dvh` przy klawiaturze                                                                                            | Kiedy stosować?                                                                                                                                                             |
| :--------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`resizes-content`** (skalowanie okna)        | Wszystkie jednostki (`svh`/`dvh`) **zmniejszają wysokość** o rozmiar klawiatury. Elementy na dole są **przesuwane w górę** nad klawiaturę. | Gdy masz na dole strony formularze, komunikatory (czat z polem tekstowym), inputy lub przyciski akcji (np. „Dalej”, „Kup teraz”), które muszą być widoczne podczas pisania. |
| **`overlays-content`** (nakładanie na wierzch) | Jednostki nie zmieniają rozmiaru (lub `dvh` spada do `svh`), ale klawiatura **zasłania dolne elementy** strony.                            | Gdy tworzysz gry webowe, aplikacje graficzne, galerie zdjęć lub prezentacje na pełny ekran, gdzie skurczenie widoku zepsułoby kompozycję i proporcje grafiki.               |


Przeanalizuj interaktywny symulator, aby zobaczyć, jak te ustawienia wpływają na dopasowanie ekranu:

<iframe src="/public/resources/web-site-preview/viewport-units-visualizer.html" width="600" height="620" style="border: 3px solid #ccc; width: 100%; border-radius: 12px; background-color: #0c0f16;" title="Wizualizator jednostek Viewportu" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

<data-quiz>
    <question>Głowa już boli?</question>
    <options>
        <option>Tak</option>
        <option correct>Nie</option>
    </options>
    <div data-hint="success">
        Wamos, Amigo! Perfekto. Mucho gusto. 🐺
    </div>
    <div data-hint="error">
        Spokojnie. 😏 Zrób sobie przerwę na kawę ☕️ i wróć z silniejszym mentalem. 💪🏼
    </div>
</data-quiz>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Każdy element to pudełko:** Układ CSS opiera się na kompozycji warstw (zawartość, padding, border i margin).
- **`border-box` ułatwia życie:** Włączenie tego modelu pudełkowego sprawia, że padding i border nie powiększają zewnętrznych wymiarów elementu, co stabilizuje layout.
- **Dopasuj typ wyświetlania (`display`):** Elementy `inline` ignorują wymiary pionowe. Aby nadawać elementom odstępy w pionie, stosuj `inline-block` lub `block`.
- **Wybieraj jednostki relatywne:** Stosuj `rem` do wielkości tekstu i paddingów (dla pełnej dostępności cyfrowej), `em` do elementów zależnych od kontekstu, a pikseli (`px`) używaj wyłącznie do stałych detali geometrycznych (np. cienkich obramowań).
- **Opanuj dynamiczny viewport mobilny:** Tradycyjne `100vh` bywa zasłaniane paskami adresu na telefonach. Używaj `dvh` (Dynamic Viewport Height) dla głównych kontenerów strony, aby tło płynnie dopasowywało się do ekranu.
- **Kontroluj wirtualną klawiaturę:** Za pomocą parametru `interactive-widget` w tagu `<meta>` decydujesz, czy klawiatura ma pomniejszać obszar roboczy strony (`resizes-content`), czy też nakładać się na treść (`overlays-content`).
