# Własna mapa trzonka - bake między UV

Fotografia daje drewno na bokach trzonka, ale jego końce nadal wyglądają jak kolejne fragmenty deski. Potrzebujemy obrazu, na którym można osobno malować boki i przekroje. Przygotujemy taką mapę, zachowując obecny wygląd modelu.

Otwórz swój projekt po poprzedniej lekcji lub [młotek z drewnem](/public/courses/blender/Resources/mlotek-08-drewno.blend). Zapisz jako `mlotek_v05.blend`. Przez całą lekcję zaznaczony jest **tylko trzonek**, głowica pozostaje bez zmian.

## 🗺️ Rozdziel odczyt fotografii i zapis obrazu

Dotychczasowe UV pobiera niewielki fragment fotografii: dzięki temu słoje mają właściwą wielkość. Nowe UV rozłożymy na większej części własnego obrazu, żeby wygodnie malować powierzchnie. Samo przepakowanie starego UV zmieniłoby wielkość i położenie drewna na modelu.

Użyjemy więc **dwóch map UV tego samego trzonka**. Pierwsza wskazuje, skąd odczytać fotografię. Druga określa, gdzie zapisać odczytany kolor. Przeniesienie wyglądu materiału do pikseli obrazu nazywamy **bake**, czyli wypiekaniem.

W Object Mode otwórz **Object Data Properties**, zakładkę z zielonym trójkątem. W **UV Maps** zmień nazwę obecnej mapy na `UV_Drewno`.

W Shader Editorze dodaj **Add → Input → UV Map**, wybierz w nim `UV_Drewno` i połącz wyjście **UV** z wejściami **Vector obu fotografii**: koloru i chropowatości. To przypina materiał do starego układu, niezależnie od dalszego wyboru aktywnej mapy.

Wróć do UV Maps. Przyciskiem **+** utwórz kopię, nazwij ją `UV_Malowanie`, zaznacz jej wiersz (1) i włącz przy niej ikonę aparatu (2). Wiersz wskazuje UV do edycji, aparat UV używane domyślnie przez materiał i przy wypiekaniu.

![Dwie mapy UV: źródłowa UV_Drewno i aktywna UV_Malowanie z ikoną aparatu](/public/courses/blender/Images/retusz-uv-mapy.png)

W Edit Mode zaznacz cały trzonek. W UV Editorze zaznacz wszystkie UV i wykonaj **UV → Pack Islands**. W panelu ostatniej operacji, otwieranym **F9**, wyłącz **Rotate**, ustaw **Margin Method: Fraction** i **Margin: 0.03**. Nadal masz trzy wyspy: boki oraz dwa końce. Materiał powinien wyglądać jak wcześniej, bo fotografie czytają `UV_Drewno`.

## 🔥 Wypiecz sam kolor

Wróć do Object Mode i Shader Editora. Dodaj **Image Texture → New**: nazwa `Trzonek_BaseColor`, wymiary `2048 × 2048`, Generated Type **Blank**, Alpha wyłączone. Pozostaw **sRGB**.

**Nie podłączaj jeszcze tego obrazu do materiału.** Jest pustym miejscem docelowym. Gdyby już zasilał Base Color, wypiekałbyś pusty obraz zamiast dotychczasowego drewna. Kliknij nowy węzeł jako ostatni, tak żeby miał jasny obrys (2). Węzeł UV Map (1) nadal zasila fotografie.

![UV Map wskazuje źródło odczytu, a zaznaczony niepodłączony Image Texture jest miejscem zapisu bake](/public/courses/blender/Images/retusz-bake-wezly.png)

W **Render Properties** ustaw **Render Engine: Cycles**. Otwórz **Bake**; możesz znaleźć tę sekcję polem wyszukiwania Properties. Wybierz **Bake Type: Diffuse** (1). Rozwiń **Influence**: wyłącz **Direct** i **Indirect**, zostaw **Color** (2).

Zapisujemy kolor materiału bez oświetlenia. Inaczej odbicie okna albo cień mogłyby trafić na teksturę i pozostać na młotku również przy innym świetle w grze.

![Ustawienia bake Diffuse z wyłączonym Direct i Indirect oraz włączonym Color](/public/courses/blender/Images/retusz-bake-ustawienia.png)

Pozostaw **Selected to Active wyłączone**: odczytujemy materiał i zapisujemy mapę na tym samym obiekcie. W **Output** ustaw **Margin: 16 px**, następnie kliknij **Bake**. Blender powinien zapisać drewno w nowym układzie wysp.

W Image Editorze wybierz `Trzonek_BaseColor`, użyj **Image → Save As** i zapisz PNG w folderze `textures` obok projektu.

## ✨ Przenieś również chropowatość

W Shader Editorze dodaj kolejny Image Texture z nowym obrazem `Trzonek_Roughness`, również `2048 × 2048`. Ustaw mu **Non-Color**. Ten węzeł również pozostaje na razie niepodłączony i musi być zaznaczony jako ostatni.

W Bake zmień **Bake Type na Roughness** i wypiecz obraz. Zapisz go jako osobny PNG. W ten sposób oba nowe obrazy opisują te same miejsca na `UV_Malowanie`.

Dopiero teraz połącz nowy BaseColor z **Base Color**, a nowy Roughness z **Roughness** w Principled BSDF. Usuń dwa stare węzły fotografii oraz węzeł UV Map. Puste wejścia Vector nowych obrazów korzystają z `UV_Malowanie`, przy którym ustawiliśmy aparat.

![Własny obraz z bokami i dwoma końcami trzonka oraz zachowany wygląd na modelu](/public/courses/blender/Images/retusz-mapa-wlasna.png)

## 💾 Sprawdź przeniesienie i zapisz

Obróć model. Wielkość słojów i odbicia powinny pozostać zgodne z poprzednią wersją. Zmienił się układ pikseli na obrazie, nie materiał drewna ani geometria młotka.

Nowa mapa 2K nie odzyskuje szczegółów, których zabrakło w fotografii. Bake przelicza istniejące dane na nowy układ. Wolne piksele wykorzystamy teraz do **własnych poprawek**, między innymi drobnych słojów na przekrojach.

Wybierz **File → External Data → Pack Resources** i zapisz projekt. [Plik z własnymi mapami](/public/courses/blender/Resources/mlotek-09-mapa-do-malowania.blend) jest punktem startowym do [malowania przekroju i retuszu szwu](/public/courses/blender/modul-1/texture-paint-przekroj-drewna-i-retusz-szwu).
