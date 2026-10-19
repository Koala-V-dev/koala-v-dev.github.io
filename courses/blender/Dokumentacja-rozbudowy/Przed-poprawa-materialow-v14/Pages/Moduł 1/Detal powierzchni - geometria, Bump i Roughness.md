# Detal powierzchni - geometria, Bump i Roughness

Młotek ma już kolor drewna, przekroje i poprawiony szew. Teraz dodamy trzy różne ślady użytkowania: ubytek głowicy, drobne włókna drewna i wygładzony chwyt. Każdy wymaga innego narzędzia, bo każdy zmienia coś innego w wyglądzie przedmiotu.

Kontynuuj swój projekt albo otwórz [młotek po retuszu](/public/courses/blender/Resources/mlotek-10-przekroj-i-retusz.blend). Zapisz kopię jako `mlotek_v07.blend`.

## 🔨 Ubytek, który zmienia obrys

Spójrz na górną krawędź obucha. Gdy brakuje tam kawałka metalu, tło musi być widoczne w miejscu ubytku. Potrzebujemy więc zmiany siatki. Sama ciemna plama nadal zostawiłaby prostą krawędź.

1. Zaznacz `Glowica`, przejdź do Edit Mode (`Tab`) i widoku z przodu (`Num 1`).
2. Najedź na długą krawędź lewego, szerokiego odcinka głowicy. `Ctrl+R` wyświetli przekrój. Kółkiem ustaw **3 cięcia**, zatwierdź LPM, następnie PPM, żeby pozostawić równomierny podział.
3. Włącz wybór wierzchołków (`1` nad literami), prześwietlenie (`Alt+Z`) i odznacz wszystko (`Alt+A`). Ramką `B` obejmij **górny punkt środkowego z trzech nowych przekrojów**. Z przodu nakładają się tam dwa wierzchołki: przedni i tylny. Prześwietlenie pozwala wybrać oba.
4. Obniż je: `G`, `Z`, `-0.0035`, `Enter`. To 3,5 mm w scenie z jednostkami metrycznymi. Wyłącz prześwietlenie.

![Trzy nowe przekroje głowicy i dwa obniżone wierzchołki](/public/courses/blender/Images/detal-siatka.png)

Dwa sąsiednie przekroje wyznaczają granice ubytku. Dzięki nim nie wyginasz całej połowy głowicy. Istniejący Bevel zaokrągla nowe krawędzie. To prosty ubytek krawędzi; bardziej nieregularne uszkodzenia opracujemy przy dokładniejszym modelowaniu.

![Porównanie obrysu fragmentu obucha przed zmianą i po zmianie siatki](/public/courses/blender/Images/detal-obrys.png)

Na ilustracji pokazano maski widoczności z renderów: kolor wypełnienia jest umowny. Wcięcie rzeczywiście odsłania tło.

Po zmianie geometrii odśwież UV **samej głowicy**: zaznacz jej ściany, wykonaj `U → Unwrap`, wybierz Angle Based, następnie w edytorze UV `UV → Pack Islands`, wyłącz Rotate i ustaw Margin `0.03`. Stal ma obecnie jednolity materiał, więc nie zobaczysz zmiany koloru. UV drewna pozostaje bez zmian.

## 🌲 Włókna widoczne w świetle

Drobne nierówności drewna są znacznie mniejsze. W zbliżeniu rozbijają odbicie światła, ale nie potrzebujemy osobnych wierzchołków dla każdego włókna. **Bump zmienia normalną używaną do cieniowania**, czyli kierunek, według którego materiał reaguje na światło. Wierzchołki pozostają na miejscu, podobnie jak obrys modelu.

Zaznacz `Trzonek`, otwórz jego materiał w Shader Editor. Przez `Shift+A` i wyszukiwanie dodaj **Texture Coordinate**, **Mapping**, **Noise Texture** oraz **Bump**. Zachowaj istniejące połączenia obrazów koloru i chropowatości.

![Węzły mikronierówności drewna z oznaczonymi gniazdami i skalą](/public/courses/blender/Images/detal-bump-wezly.png)

Połącz i ustaw:

- **1. Object → Mapping, Vector.** Współrzędne pochodzą z obiektu, więc ten wzór nie korzysta z wysp UV.
- **2. Mapping, Scale: X `1`, Y `1`, Z `0.03`.** Zmniejszenie współrzędnej Z wydłuża wzór wzdłuż trzonka.
- Mapping, Vector → Noise Texture, Vector. Noise: **3D**, Scale `2500`, Detail `2`, Roughness `0.5`.
- **3 → 4. Noise, Fac → Bump, Height.** Liczba z Noise opisuje umowną wysokość drobnych nierówności.
- Bump: **Strength `0.25`, Distance `0.00008`**. To skala wysokości 80 mikrometrów przy naszych jednostkach. Pole może wyświetlać zaokrąglone `0.0001`; kliknij je i wpisz dokładną wartość.
- **5. Bump, Normal → Principled BSDF, Normal.**

To proceduralne przybliżenie włókien. Fotografia nadal odpowiada za kolor. Nie podłączamy jej automatycznie do Height: ciemna smuga może być przebarwieniem, a nie rowkiem. Takie połączenie często daje powierzchnię wyglądającą jak odlana z fotografii.

![Stała kamera i światło: Bump wyłączony, subtelny i przesadzony](/public/courses/blender/Images/detal-bump-porownanie.png)

W tym porównaniu kolor zastąpiono jednolitą szarością, a Roughness ustawiono na `0.25`, żeby zobaczyć sam Bump. Kamera, światło i Strength są identyczne. Zmienia się wyłącznie Distance: `0`, `0.00008`, `0.003`. Ostatni wariant ma skalę aż 3 mm: rozbija odbicie tak mocno, że drewno wygląda na głęboko pofałdowane. Mimo tego **obrys wszystkich trzech modeli pozostaje identyczny**. Po próbie przywróć `0.00008`.

## ✋ Chwyt wygładzony przez używanie

Dłoń stopniowo wygładza drewno. Możemy pokazać to mocniejszym, bardziej skupionym odbiciem, zachowując kolor i kształt trzonka. Edytujemy więc wyłącznie **Roughness**.

Jeśli obrazy są spakowane, przed malowaniem wybierz `File → External Data → Unpack Resources → Use files in current directory (create when necessary)`. Dzięki temu późniejszy zapis i ponowne pakowanie obejmą aktualne piksele.

Odizoluj trzonek, tymczasowo wyłącz podgląd jego Bevel i przejdź do Texture Paint. Ustaw **Single Image**, obraz `Trzonek_Roughness`, aktywne UV `UV_Malowanie`. Obraz ma pozostać **Non-Color**.

Wybierz **Paint Soft**, Size `80 px`, Strength `0.35` i szarość o wartości `0.16` we wszystkich kanałach. Maluj miękkimi pociągnięciami wzdłuż dolnej części uchwytu, mniej więcej od 4 do 13 cm nad jego końcem. Obracaj model i opracuj wszystkie cztery boki. Pozostaw łagodne przejścia zamiast ostrego pierścienia.

![Texture Paint: aktywna mapa Roughness i miękki pędzel na trzonku](/public/courses/blender/Images/detal-chwyt-malowanie.png)

Niska Strength miesza kolejne pociągnięcia z zastaną mapą. Nie musisz zamalowywać jej na jednolitą szarość: zachowane różnice dają mniej mechaniczny efekt. Ciemniejsze piksele oznaczają tu gładszą powierzchnię, a nie ciemniejsze drewno.

![Wpływ retuszu Roughness na odbicie światła przy wyłączonym Bump](/public/courses/blender/Images/detal-chwyt-odbicia.png)

W obu renderach ponownie użyto jednolitego szarego koloru i wyłączono Bump. Zmienia się tylko mapa Roughness. Po malowaniu odbicie na chwycie staje się gładsze; siatka i mapa Base Color są takie same.

Zapisz obraz przez `Image → Save As` jako `Trzonek_Roughness_chwyt.png`. Wróć do Object Mode, włącz Bevel i widoczność głowicy, zakończ izolację. Wykonaj `File → External Data → Pack Resources` i zapisz projekt.

## 🔎 Ile detalu widać w użyciu?

![Cały młotek z właściwymi materiałami: porównanie bez Bump i z subtelnym Bump](/public/courses/blender/Images/detal-dystans.png)

Tutaj wraca właściwy kolor drewna i stal. W obrębie tej pary kamera i światło są identyczne; zmienia się tylko włączenie Bump. Przy całym młotku różnica jest znacznie mniej czytelna niż w zbliżeniu. Ubytek nadal wpływa na obrys, a wygładzony chwyt może zdradzić się odbiciem, gdy poruszysz światłem lub kamerą.

Oceniaj detal z odległości, z której gracz zobaczy przedmiot. Młotek w dłoni przy kamerze uzasadnia inne szczegóły niż narzędzie leżące daleko na półce. Zwiększanie Bump tylko po to, żeby było go widać z daleka, łatwo niszczy wiarygodną skalę materiału.

[ Pobierz młotek po tej lekcji ](/public/courses/blender/Resources/mlotek-11-detal-powierzchni.blend)

Węzły proceduralne Blendera nie przeniosą się automatycznie jako gotowy materiał do Unity, UE5 czy Godota. Następnym krokiem będzie przygotowanie wersji high-poly i low-poly oraz wypieczenie detalu do mapy normalnej. Wtedy sprawdzimy również, które kształty nadal muszą pozostać w geometrii.
