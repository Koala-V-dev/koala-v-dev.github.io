# Materiały młotka - drewno, metal i światło

Ten sam model dostanie dwa materiały: trzonek będzie niemetaliczny i bardziej matowy, a głowica metaliczna, z wyraźniejszymi odbiciami. Potem poprawimy cieniowanie faz. Na razie pracujemy jednolitymi wartościami; słoje i lokalne zużycie dodamy po przygotowaniu UV.

Otwórz własny `mlotek_v01.blend` lub [osobny model z poprzedniej lekcji](/public/courses/blender/Resources/mlotek-01-model.blend). Zapisz dalszą pracę jako `mlotek_v02.blend`.

## 💡 Włącz podgląd materiałów

W prawym górnym rogu widoku 3D wybierz **Material Preview** (1 na zrzucie), trzecią z czterech kulek. Dotychczasowy tryb Solid służył przede wszystkim do oglądania bryły; tutaj zobaczysz reakcję materiału na światło i otoczenie.

Zaznacz trzonek i otwórz **Material Properties**, kartę z czerwoną kulką w Properties (2). Kliknij **New** (3), aby utworzyć jego materiał.

![Material Preview, karta materiału i przycisk utworzenia materiału](/public/courses/blender/Images/material-podglad.png)

W rozwijanym panelu przy kulkach podglądu wyłącz **Scene Lights** i **Scene World**. Korzystamy z oświetlenia podglądu, więc nie potrzebujesz lamp ani kamery w tym pliku. Wybierz środowisko `forest.exr`; jasne niebo i ciemniejsze otoczenie będą widoczne w odbiciach metalu.

## 🪵 Ustaw bazę drewna

Nazwij materiał `Drewno_trzonka`. W sekcji **Surface** pozostaw **Principled BSDF**, podstawowy shader opisujący reakcję powierzchni na światło. Ustaw trzy pola oznaczone na zrzucie:

- **Base Color** (1): kliknij próbkę koloru i w polu Hex wpisz `A66F3FFF`. To ciepły brąz; końcowe `FF` pozostawia pełną nieprzezroczystość.
- **Metallic** (2): `0`. Drewno jest niemetaliczne, również gdy ma połysk.
- **Roughness** (3): `0.55`. Odbicia będą rozmyte, ale nie wyłączone.

![Materiał trzonka: Base Color, Metallic i Roughness](/public/courses/blender/Images/material-drewno.png)

**Base Color** określa barwę materiału, a **Roughness** jego mikroskopijną chropowatość. Niska chropowatość daje ostre odbicia, wysoka je rozprasza. Nie musisz zwiększać Metallic, żeby otrzymać lakierowane drewno; ono nadal jest niemetaliczne.

Brązowy trzonek nie ma jeszcze słojów. Ten etap ustala odpowiedź powierzchni na światło, a nie zastępuje tekstury drewna.

## 🔩 Utwórz osobny materiał stali

Zaznacz głowicę. W jej Material Properties kliknij **New** i nazwij materiał `Stal_glowicy`. Ustaw **Base Color** na `B8BDC2FF`, **Metallic** na `1`, a **Roughness** na `0.28`.

![Osobny materiał głowicy z metalicznością 1 i chropowatością 0.28](/public/courses/blender/Images/material-stal.png)

Dla odsłoniętej stali używamy metaliczności 1, dla drewna 0. Wartość pośrednia nie jest suwakiem „ładniejszego połysku”. Metal odbija otoczenie inaczej niż drewno; jego Base Color wpływa przede wszystkim na barwę odbicia.

Jeżeli głowica wygląda prawie czarno, obróć widok lub **Rotation** środowiska w panelu podglądu. Może odbijać ciemny fragment otoczenia. Zanim rozjaśnisz kolor materiału, sprawdź, czy jasny obszar środowiska pojawia się na powierzchni podczas obrotu.

## ↔️ Porównaj chropowatość w tym samym świetle

Na głowicy zmień Roughness z `0.28` na `0.08`, a potem na `0.75`. Podczas porównania pozostaw ten sam kadr i oświetlenie. Zmieniasz tylko jedno pole, więc możesz zobaczyć jego skutek.

![Ta sama głowica: ostre odbicia przy Roughness 0.08 i rozproszone przy 0.75](/public/courses/blender/Images/material-roughness.png)

Przy `0.08` granice odbijanych obszarów są wyraźniejsze. Przy `0.75` odbicie rozlewa się na większy obszar. Kształt głowicy i liczba jej ścian pozostają takie same. Wróć do `0.28` jako punktu wyjścia dla tego młotka.

## ✨ Wygładź fazy, zachowaj płaskie powierzchnie

Przybliż głowicę. Na fazach możesz zobaczyć oddzielne pasy odpowiadające segmentom Bevel. To problem cieniowania powierzchni, a nie brak materiału.

Z zaznaczoną głowicą wybierz **Object → Shade Smooth**. Następnie w modyfikatorze **Bevel** rozwiń **Shading** i włącz **Harden Normals**. Powtórz te dwie czynności na trzonku.

Wygładzanie zmienia sposób obliczania światła przez interpolację normalnych, czyli kierunków używanych przy cieniowaniu. Harden Normals pomaga zachować płaską odpowiedź dużych ścian i płynne przejście na fazach. Nie zwiększamy liczby segmentów tylko po to, żeby ukryć pasy światła.

![Ten sam kadr głowicy przed poprawą cieniowania i po niej](/public/courses/blender/Images/material-wygladzanie.png)

Na porównaniu obserwuj jasną linię biegnącą po fazie. Po poprawie nie powinna rozpadać się na osobne pasy przy każdym segmencie. Sylwetka pozostaje taka sama: wygładzanie nie zaokrągla geometrycznie kanciastego obrysu.

## 🔎 Obejrzyj materiał z kilku stron

Obróć młotek tak, żeby jasne odbicie przesunęło się przez szeroki bok głowicy i zaokrągloną krawędź. Sprawdź też trzonek: ma być brązowy, niemetaliczny i mniej lustrzany od stali. W Outlinerze nadal powinny zostać tylko dwa obiekty w kolekcji `Mlotek`.

![Młotek po przypisaniu dwóch materiałów i poprawie cieniowania](/public/courses/blender/Images/material-wynik.png)

Zapisz plik. [Wynik lekcji](/public/courses/blender/Resources/mlotek-02-materialy.blend) zawiera materiały i edytowalne modyfikatory, bez zewnętrznych obrazów. Wcześniejsza kopia młotka w pliku stołu nie zmieni się automatycznie: Append tworzył niezależną kopię. Dalsze UV przygotujemy na tym osobnym modelu.
