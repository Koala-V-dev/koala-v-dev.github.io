# Warstwy, Mieszanie i Maski

Współczesna grafika cyfrowa opiera się na architekturze rozłącznych **Warstw**. Pozwalają one na budowanie złożonych kompozycji w sposób **niedestrukcyjny (non-destructive)** – każdą zmianę można cofnąć, ukryć lub zmodyfikować bez bezpowrotnej utraty oryginalnych pikseli.

---

Warstwy to fundament pracy. Poniżej znajduje się infografika pokazująca, jak wygląda stos warstw w praktyce. Zwróć uwagę na panel w prawym dolnym rogu – nawet prosta grafika może składać się z kilkunastu warstw, grup oraz warstw tekstowych.

![Prezentacja warstw obrazu zaskoczonej emotki](/courses/gimp/Images/prezentacja_warstw_emotka.png)

### Panel Warstw: Przyciski Akcji

Zrozumienie interfejsu panelu warstw to pierwszy krok do sprawnej pracy:

![Pasek przycisków akcji okna warstw](/courses/gimp/Images/pasek_akcji_okna_warstw.png)

- **Nowa warstwa**: Otwiera okno ustawień (rozmiar, nazwa). Kluczowa opcja to `Wypełnienie` – decydujesz, czy ma być przezroczysta, biała, czy w kolorze z przybornika.
- **Grupa warstw**: Pozwala porządkować stos. Przeciągnięcie warstw do grupy ułatwia ich jednoczesne ukrywanie lub przesuwanie (z klawiszem `Shift`).
- **Przemieszczanie**: Strzałki góra/dół zmieniają hierarchię widoczności w stosie.
- **Duplikacja**: Tworzy identyczną kopię zaznaczonej warstwy lub grupy.
- **Połącz w dół / Spłaszcz**: Scala wybraną warstwę z tą poniżej, zamieniając je w jedną matrycę pikseli.
- **Maska warstwy**: Dodaje maskę, którą omówimy w dalszej części lekcji.
- **Usuwanie**: Kasuje zaznaczone warstwy lub grupy.

---

## 🗂️ Hierarchia Stosu i Logika RGBA

Obraz budowany jest "od dołu do góry" (Bottom to Top). Każda kolejna warstwa w menedżerze leży fizycznie **nad** poprzednią i domyślnie ją zasłania.

### Kanał Alfa (Alpha)
To serce cyfrowej przezroczystości. Tradycyjny kolor opisujemy jako **RGB** (Red, Green, Blue). W grafice cyfrowej dodajemy czwarty parametr: **A (Alpha)**.

*   **Zapis techniczny**: 
    - **RGBA**: `rgba(255, 0, 0, 0.5)` – czerwony kolor o $50\%$ przezroczystości.
    - **HEX**: `#FF000080` – ostatnie dwie cyfry (`80`) definiują poziom Alfy w systemie szesnastkowym.
*   **Wartości**: Zazwyczaj jest to 8-bitowa informacja ($0$-$255$):
    - $0$ to całkowita przezroczystość (dziura).
    - $255$ to pełne krycie (lita ściana).

<data-gate>
<data-quiz>
<question>
Masz warstwę "Słońce" (żółtą) nad warstwą "Tło" (czerwoną). Chcesz, aby żółte słońce było w połowie przezroczyste, pozwalając czerwieni przebijać spod spodu. Jaką wartość Kanału Alfa ($0$-$255$) musisz ustawić?
</question>
<options>
<option>$255$</option>
<option correct>$128$ (matematyczny środek zakresu).</option>
<option>$0$</option>
</options>
<div data-hint="error">
Pamiętaj: $255$ to lity kolor, $0$ to całkowita przezroczystość. Szukamy wartości pośredniej.
</div>
<div data-hint="success">
Brawo! $128$ oznacza krycie na poziomie około $50\%$.
</div>
</data-quiz>
</data-gate>

---

## 🧮 Tryby Mieszania (Blending Modes)

Tryby mieszania to instrukcje matematyczne wykonywane na wartościach RGB pikseli. Mówią systemowi: „Weź kolor warstwy aktywnej i wykonaj działanie na kolorach warstw leżących **pod nią**”. 

W GIMP 3.0 znajdziesz aż **39 trybów**, podzielonych na grupy logiczne. Nie musisz znać wszystkich na pamięć, ale musisz rozumieć, jak działają główne kategorie.

---

### 1. Grupa Normalna (Zarządzanie Pikselami)
Kontrolują sposób wyświetlania pikseli bez zaawansowanej filtracji kolorów.

- **Zwykły (Normal)**: Standardowe nakładanie. Górna warstwa zasłania dolną zgodnie z wartością Alfy.
- **Przenikanie (Dissolve)**: Zamiast przezroczystości tworzy „ziarno” – losowo rozrzuca piksele, co daje efekt piasku lub mrowienia.
- **Łączenie (Merge) / Dzielenie (Split)**: Zaawansowane tryby techniczne do pracy z warstwowymi teksturami.

<details>
<summary>➕ Inne w tej grupie (np. Behind, Color Erase)</summary>

- **Behind**: Malowanie tylko pod spodem istniejących pikseli.
- **Usuwanie koloru (Color Erase)**: Traktuje wybrany kolor jako przezroczystość.
- **Gumka (Erase)**: Wykorzystuje Alfę warstwy do wycinania „dziur” w tym, co pod spodem.
</details>

---

### 2. Grupa Przyciemniająca (Cienie)
Neutralnym kolorem dla tej grupy jest **BIAŁY** (wartości 255 nie zmieniają obrazu).

- **Mnożenie (Multiply)**: **Król trybów**. Mnoży wartości pikseli, co zawsze daje ciemniejszy wynik. Idealny do nakładania szkiców na kolor lub dodawania głębokich cieni.
- **Wypalanie (Burn)**: Zwiększa kontrast ciemnych obszarów, „przypalając” kolory spodu.

<details>
<summary>🌑 Pozostałe (np. Tylko ciemniejsze, Liniowe przyciemnianie)</summary>

- **Tylko ciemniejsze (Darken Only)**: Porównuje piksele i zostawia ten o niższej wartości.
- **Tylko ciemniejsze lumy**: Podobne, ale bazuje na luminancji (jasności postrzeganej).
- **Liniowe przyciemnianie (Linear Burn)**: Bardziej agresywne przyciemnianie niż Mnożenie.
</details>

![Demonstracja trybu Mnożenie: szkic nałożony na tło](/courses/gimp/Images/blending/multiply_demo.png)

---

### 3. Grupa Rozjaśniająca (Światła)
Neutralnym kolorem dla tej grupy jest **CZARNY** (wartości 0 nie zmieniają obrazu).

- **Przesiewanie (Screen)**: Odwrotność Mnożenia. Rozjaśnia obraz, „kasując” ciemne elementy. Idealny do flar, iskier, dymu na czarnym tle.
- **Rozjaśnianie (Dodge)**: Rozświetla barwy bazowe, tworząc intensywne efekty świetlne.

<details>
<summary>☀️ Pozostałe (np. Suma, Tylko jaśniejsze)</summary>

- **Tylko jaśniejsze (Lighten Only)**: Porównuje piksele i zostawia jaśniejszy.
- **Tylko jaśniejsze lumy**: Działa na podstawie luminancji.
- **Suma (Addition)**: Czyste dodawanie wartości RGB. Bardzo agresywne rozjaśnianie.
</details>

![Demonstracja trybu Przesiewanie: flara na ciemnym tle](/courses/gimp/Images/blending/screen_demo.png)

---

### 4. Grupa Kontrastowa (Tekstury i Detale)
Neutralnym kolorem jest **ŚREDNIA SZAROŚĆ** (128, 128, 128).

- **Pokrywanie (Overlay)**: Mnoży ciemne i przesiewa jasne piksele. Świetny do nakładania tekstur (np. drewna czy płótna) na lity kolor.
- **Miękkie światło (Soft Light)**: Łagodniejsza wersja, działa jak skierowanie kolorowego reflektora na scenę.
- **Twarde światło (Hard Light)**: Agresywne, daje efekt ostrego oświetlenia.

<details>
<summary>🎭 Pozostałe (np. Żywe światło, Światło liniowe, Twarda mieszanka)</summary>

- **Żywe światło (Vivid Light)**: Ekstremalny kontrast.
- **Światło punktowe (Pin Light)**: Porównuje barwy i „przerzuca” je do skrajnych wartości.
- **Twarda mieszanka (Hard Mix)**: Redukuje obraz do 8 podstawowych kolorów (czerwień, zieleń, niebieski, cyjan, magenta, żółty, czarny, biały).
</details>

![Demonstracja trybu Pokrywanie: nakładanie tekstury drewna](/courses/gimp/Images/blending/overlay_demo.png)

---

### 5. Grupa Inwersji i Różnicy (Techniczne)
Służą do porównywania obrazów i efektów psychodelicznych.

- **Różnica (Difference)**: Odejmuje kolory. Jeśli dwie warstwy są identyczne, wynik to czysty czarny. Narzędzie mistrzów do precyzyjnego wyrównywania zdjęć!
- **Wykluczenie (Exclusion)**: Podobne do różnicy, ale z mniejszym kontrastem.

<details>
<summary>🔄 Pozostałe (np. Odejmowanie, Wydobycie ziarna, Dzielenie)</summary>

- **Odejmowanie (Subtract)**: Czysta matematyka – odejmuje RGB góry od spodu.
- **Dzielenie (Divide)**: Rozjaśnia obraz poprzez dzielenie wartości (często używane do usuwania zabarwienia zdjęć).
- **Wydobycie ziarna (Grain Extract) / Połączenie ziarna (Grain Merge)**: Klasyczne tryby do pracy z teksturami i retuszem „Frequency Separation”.
</details>

---

### 6. Grupy Składników (HSL i LCh)
Najbardziej nowoczesne tryby. Pozwalają zmieniać np. tylko kolor, nie dotykając jasności zdjęcia.

- **Kolor LCh / HSL**: Najpopularniejszy sposób na kolorowanie czarno-białych zdjęć. Zachowuje cienie i światła oryginału, nanosząc na nie nową barwę.
- **Pasywny (Pass Through)**: Tryb specjalny dla **Grup Warstw**. Pozwala warstwom wewnątrz grupy „widzieć” i mieszać się z warstwami na zewnątrz.

<details>
<summary>🎨 Wszystkie tryby LCh/HSV (np. Odcień, Nasycenie, Jasność)</summary>

- **Barwa (Hue)**: Podmienia tylko barwę.
- **Nasycenie (Saturation)**: Zmienia intensywność koloru.
- **Jasność (LCh) / Wartość (HSV)**: Zmienia wyłącznie jasność, ignorując kolor.
- **Luminancja**: Najbardziej precyzyjny tryb operujący na jasności percepcyjnej.
</details>

---

<data-gate>
<data-quiz>
<question>
Masz zdjęcie płomieni na czarnym tle. Chcesz je nałożyć na nocny krajobraz tak, aby czarne tło "wybuchu" zniknęło, a płomienie oświetliły scenę. Którego trybu użyjesz?
</question>
<options>
<option>Mnożenie (Multiply).</option>
<option correct>Przesiewanie (Screen).</option>
<option>Nakładka (Overlay).</option>
</options>
<div data-hint="error">
Potrzebujesz trybu z grupy rozjaśniającej, dla którego czarny kolor ($0$) jest neutralny.
</div>
<div data-hint="success">
Dokładnie! Przesiewanie "kasuje" czerń i zostawia tylko jasne elementy.
</div>
</data-quiz>
</data-gate>

---

## 🎭 Maski Warstw

Praca z **Gumką (Eraser)** jest destrukcyjna – raz usunięte piksele są trudne do odzyskania. **Maski Warstwy** to nowoczesny, bezpieczny sposób na ukrywanie fragmentów obrazu.

Maska to dodatkowa, czarno-biała powłoka przypięta do Twojej warstwy. Działa jak "mapa widoczności":
*   **Malujesz na masce na BIAŁO**: Piksel jest w pełni widoczny ($100\%$ krycia).
*   **Malujesz na masce na CZARNO**: Piksel staje się przezroczysty ($0\%$ krycia).
*   **Malujesz na SZARO**: Uzyskujesz półprzezroczystość.

> [!IMPORTANT]
> Największa zaleta masek: Jeśli usuniesz za dużo tła i "odetniesz" postać, nie musisz cofać całej pracy. Po prostu zmień kolor pędzla na biały i zamaluj ten fragment na masce. Oryginalne zdjęcie "odrośnie" w tym miejscu, ponieważ pod maską wciąż tam jest!

<data-gate>
<data-quiz>
<question>
Ukrywasz tło zdjęcia przy pomocy maski. Przez pomyłkę zamalowałeś fragment, który powinien zostać widoczny. Jak go przywrócić w sposób niedestrukcyjny?
</question>
<options>
<option>Użyć Ctrl+Z (Cofnij) aż do skutku.</option>
<option correct>Zmienić kolor pędzla na Biały i zamalować ten fragment na masce.</option>
<option>Użyć Gumki na warstwie obrazu.</option>
</options>
<div data-hint="error">
Maska to mapa. Czarny kolor chowa. Jaki kolor odsłania to, co ukryte?
</div>
<div data-hint="success">
Perfekcyjnie! To fundament profesjonalnego retuszu i fotomontażu.
</div>
</data-quiz>
</data-gate>

---

Lekcja o warstwach to kamień milowy w Twojej edukacji. Rozumiesz już hierarchię, matematykę mieszania i potęgę niedestrukcyjnych masek. W następnej części zajmiemy się selekcją – nauczymy się, jak precyzyjnie wybierać obszary, na których chcemy pracować. 🎨🧤
