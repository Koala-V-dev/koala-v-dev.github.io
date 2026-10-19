# Profil z referencji – Butelka wody (Narzędzie Spin i mapa UV)

W grafice gier rzadko modeluje się „z głowy”. Podstawą pracy twórcy assetów 3D jest rysunek techniczny, szkic koncepcyjny lub zdjęcie referencyjne. Zamiast rzeźbić obiekty cylindryczne z sześcianu, tworzy się ich **profil boczny z pojedynczych wierzchołków**, a następnie obraca go w pełną bryłę narzędziem **Spin**.

W tej lekcji zbudujesz **butelkę wody na bazie obrazu referencyjnego**, rozłożysz jej siatkę na mapę **UV** i nałożysz teksturę z grafiką etykiety.

---

## 🖼️ Krok 1: Wstawienie i zablokowanie obrazu referencyjnego

Aby wymodelować butelkę z zachowaniem rzeczywistych proporcji, potrzebujemy podkładu graficznego w widoku z przodu.

1. Przełącz widok na płaski rzut z przodu: wciśnij <kbd>Numpad 1</kbd>.
2. Ustaw kursor 3D dokładnie w środku świata: wciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>C</kbd></span>.
3. Wstaw obraz referencyjny: wciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> $\rightarrow$ `Image` $\rightarrow$ **Reference**.
4. Wybierz plik graficzny przedstawiający butelkę z boku.

Alternatywnie możesz po prostu przeciągnąć obraz do okna Blendera bezpośrednio z eksploratora plików lub przeglądarki internetowej.

![referencja butelek wody](/public/courses/blender/Images/butelki-wody.png)

[Źródło grafiki](https://portalkomunalny.pl/wp-content/uploads/2022/11/depositphotos_253281792_l-768x388.jpg)

### Ustawienia referencji w panelu właściwości:
- W panelu właściwości po prawej stronie wybierz ikonę obrazka (**Data / Object Data Properties**).
- Zaznacz opcję **Opacity** i ustaw wartość na `0.5`, aby grafika była półprzezroczysta.
- Przesuń obraz (<kbd>G</kbd>), aby pionowa oś symetrii butelki pokrywała się dokładnie z niebieską osią **Z**, a dno butelki leżało na czerwonej osi **X** ($Z=0$).

> [!TIP]
> W bocznym panelu właściwości w sekcji **Item** (<kbd>N</kbd>) możesz kliknąć kłódeczki przy parametrach pozycji, aby zablokować możliwość przypadkowej relokacji referencji podczas modelowania.

![start modelowania butelki wody z profilem](/public/courses/blender/Images/start-model-butelki-wody.png)

---

## ✏️ Krok 2: Rysowanie profilu z pojedynczych wierzchołków

Butelka jest bryłą osiowosymetryczną – wystarczy narysować połowę jej obrysu, od dna do wlewu.

1. W widoku z przodu (<kbd>Numpad 1</kbd>) dodaj płaszczyznę: <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> $\rightarrow$ `Mesh` $\rightarrow$ **Plane**.
2. Wejdź w tryb edycji: wciśnij <kbd>Tab</kbd>.
3. Zaznacz wszystkie wierzchołki (<kbd>A</kbd>) i zredukuj je do jednego punktu w centrum: wciśnij <kbd>M</kbd> $\rightarrow$ **At Center**.
4. Masz teraz pojedynczy wierzchołek. Przesuń go na środek dna butelki: <kbd>G</kbd> $\rightarrow$ ustaw na przecięciu osi Z ($X=0, Z=0$).
5. Rysuj profil wzdłuż prawej krawędzi butelki za pomocą ekstruzji:
   - Wciśnij <kbd>E</kbd> i kliknij <kbd>LPM</kbd> na załamaniu dna.
   - Wciskaj kolejne <kbd>E</kbd>, stawiając wierzchołki wzdłuż ścianki bocznej, zwężenia szyjki, przetłoczeń gwintu aż po górną krawędź wlewu.
6. Ostatni wierzchołek na szczycie szyjki dociągnij do osi Z: w panelu bocznym (<kbd>N</kbd>) w sekcji `Transform` wpisz dla niego dokładnie wartość **X = 0**.

![profil butelki wody](/public/courses/blender/Images/linia-boczna-butelki.png)

---

## 🌀 Krok 3: Generowanie bryły narzędziem Spin

Mając narysowaną połowę obrysu, obracamy ją o $360^\circ$ dookoła osi Z.

1. Upewnij się, że **3D Cursor** znajduje się dokładnie na osi Z w punkcie $(0, 0, 0)$. Narzędzie Spin używa kursora jako osi obrotu!
2. Zaznacz wszystkie wierzchołki profilu: wciśnij <kbd>A</kbd>.
3. Na lewym pasku narzędzi wybierz ikonę **Spin** (lub użyj skrótu <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>E</kbd></span> $\rightarrow$ **Spin**).
4. Kliknij i przeciągnij niebieski łuk widoczny na ekranie, a w lewym dolnym rogu rozwiń panel parametrów **Spin**:
   - **Steps:** `12`
   - **Angle:** `360°`
   - **Axis:** `X = 0`, `Y = 0`, `Z = 1.0`

![wygląd butelki po spin](/public/courses/blender/Images/ustawienia-spin-butelki.png)

### Usunięcie nadmiaru wierzchołków na osi Z:
- Zaznacz całą butelkę (<kbd>A</kbd>).
- Wciśnij <kbd>M</kbd> $\rightarrow$ **By Distance**. Blender zespawa zdublowane wierzchołki w dnie i na szczycie wlewu.  
- Na dole ekranu zobaczysz panel odległości scalania oraz komunikat informujący, ile osieroconych wierzchołków usunięto.

![Usuwanie nadmiaru wierzchołków z modelu](/public/courses/blender/Images/usuwanie-nadmiaru-vertexow-z-modelu.png)

### Weryfikacja normalnych ścian:
- Włącz `Viewport Overlays` $\rightarrow$ **Face Orientation**.
- W widoku zewnętrznym nie może być widać **_czerwonych ścian_**.
- Jeśli ściany są czerwone, wciśnij <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>N</kbd></span> $\rightarrow$ **Recalculate Outside**.

---

## 🏷️ Krok 4: Wyodrębnienie i modelowanie etykiety

Etykieta nie jest namalowana bezpośrednio na plastiku, lecz stanowi osobną foliową opaskę.

1. W trybie edycji butelki przytrzymaj <kbd>Alt</kbd> i kliknij <kbd>LPM</kbd> na poziomą krawędź obrotu.
2. Następnie wciśnij <kbd>Shift</kbd> i zaznacz z <kbd>Alt</kbd> drugą krawędź – wyznaczy to pionowy zakres wysokości etykiety.
3. Zduplikuj zaznaczone okręgi: <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>.
4. Natychmiast wyodrębnij je do osobnego obiektu: wciśnij <kbd>P</kbd> $\rightarrow$ **Selection**.

![separacja linii do etykiety butelki](/public/courses/blender/Images/separacja-lini-do-etykiety-butelki.png)

### Budowanie ścian etykiety:
1. Przejdź do edycji nowo utworzonego obiektu etykiety. W Outlinerze możesz tymczasowo ukryć butelkę (ikona oka).
2. Zaznacz krawędź górnego okręgu oraz krawędź dolnego okręgu. Klikając <kbd>F</kbd>, połączysz je w ścianę (*Face*).
3. Jeśli utworzona ściana jest czerwona, wciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>N</kbd></span> i zaznacz opcję **Inside**.

![budowanie ścian na okręgu](/public/courses/blender/Images/budowanie-scian-na-okregu.png)

4. Gdy zaznaczysz boczną krawędź tej ściany, możesz błyskawicznie uzupełnić resztę cylindra kolejnymi ściankami, wciskając po prostu klawisz <kbd>F</kbd>.

### Odsunięcie etykiety od butelki (likwidacja przenikania):
Gdy włączysz ponownie widok butelki, zauważysz, że obie powierzchnie przenikają się na tej samej wysokości. Należy dodać etykiecie odstęp od korpusu:
1. Zastosuj wytłoczenie wewnętrzne: wciśnij <kbd>I</kbd> (*Inset*).
2. Przeskaluj środek klawiszem <kbd>S</kbd>, odsuwając ścianki na zewnątrz od butelki.

![Odsunięcie środka etykiety od butelki](/public/courses/blender/Images/odsuniecie-etykiety-od-butelki.png)

---

## 🪓 Krok 5: Gęstość siatki, cieniowanie i detale

### Modyfikator Subdivision Surface:
Dodaj na oba obiekty modyfikator **Subdivision Surface** z parametrem `Levels Viewport: 2`.

Zauważysz, że etykieta może przestać idealnie przylegać i odsłonią się czerwone ścianki normali (nierenderowana część, która w grach jest przezroczysta).

![Dodawanie modyfikatora Subdivision Surface](/public/courses/blender/Images/modyfikator-subdivision-butelka.png)

Aby to zniwelować:
1. Zaznacz krawędzie i wytłocz je: <kbd>E</kbd>.
2. Anuluj przemieszczenie prawym przyciskiem myszy (<kbd>PPM</kbd>).
3. Zbliż je z powrotem do butelki za pomocą skalowania: <kbd>S</kbd>.

![zakrycie złych normali](/public/courses/blender/Images/zakrycie-złych-normali.png)

### Wygładzanie cieniowania (Shade Smooth i Mark Sharp):
1. W trybie obiektowym (`Object Mode`) zaznacz obiekty (<kbd>A</kbd>).
2. Kliknij <kbd>PPM</kbd> $\rightarrow$ **Shade Smooth**.

![shade smooth na butelce](/public/courses/blender/Images/shade-smooth-butelka.png)

Przejścia tonalne stały się gładkie. Aby jednak zachować ostre zagięcia na wybranych krawędziach bez rozmywania formy:
1. W trybie edycji zaznacz krawędź, która ma pozostać ostra.
2. Kliknij <kbd>PPM</kbd> $\rightarrow$ **Mark Sharp**. Powstanie błękitna linia oznaczająca ostrą krawędź.

![stosowanie mark sharp na butelce](/public/courses/blender/Images/stosowanie-mark-sharp-butelka.png)

Porównaj efekt: po lewej stronie zastosowano **Mark Sharp**, po prawej krawędź jest rozmyta.

![porównanie etykiety z sharp markiem i bez](/public/courses/blender/Images/etykieta-z-sharp-markem-i-bez.png)

### Wyostrzenie szyjki butelki (Bevel):
Modyfikator *Subdivision* może utrudniać zaznaczanie krawędzi. Możesz tymczasowo wyłączyć jego podgląd w widoku (ikona monitora w panelu modyfikatora).
1. Zaznacz wszystkie 4 krawędzie lejka szyjki butelki.
2. Wciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>.
3. Przesuwając myszką, regulujesz szerokość fazy, a kółkiem myszy zmieniasz liczbę segmentów zaokrąglenia.

![Porównanie modyfikatora Subdivision Surface z modyfikatorem Bevel](/public/courses/blender/Images/render-modyfikatora-i-bevel.png)

---

## 🧴 Krok 6: Wyodrębnienie korka

Korek od butelki jest osobnym elementem z tworzywa sztucznego.

1. Zaznacz ścianki odpowiadające za korek na szczycie szyjki.
2. Wytnij go do osobnego obiektu: wciśnij <kbd>P</kbd> $\rightarrow$ **Selection**.

![separacja korka](/public/courses/blender/Images/separacja-korka.png)

---

## 🎨 Krok 7: Materiały i Shading

Przełącz tryb podglądu w widoku 3D z *Solid* na **Material Preview** (<kbd>Z</kbd> $\rightarrow$ *Material Preview*).

### Materiał butelki (Tworzywo PET):
Zaznacz butelkę, przejdź do zakładki **Material Properties** (czerwona kula) i utwórz nowy materiał:
- **Base Color:** delikatny błękit
- **Metallic:** `0.0` (plastik to dielektryk; wartość `1.0` oznacza metal)
- **Roughness:** `0.3` (gładka tafla o wyraźnym bliku świetlnym)
- **Alpha:** `0.6` (częściowa przezroczystość ścianki)

![materiał butelki](/public/courses/blender/Images/materiał-butelki.png)

### Etykieta i podpięcie grafiki:
1. Zaznacz obiekt etykiety i utwórz dla niego nowy materiał.
2. Przejdź do przestrzeni roboczej **Shading**.
3. Dodaj węzeł **Image Texture** (<span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> $\rightarrow$ `Texture` $\rightarrow$ `Image Texture`) i wskaż plik z grafiką etykiety:

![Etykieta wody Saguaro](/public/courses/blender/Images/etykieta-wody-saguaro.png)

[Źródło etykiety](https://www.labelsmania.com/public/foto/37008944.jpg)

4. Podepnij wyjście `Color` z Image Texture do wejścia `Base Color` w węźle Principled BSDF.

Gdy podepniesz obraz, grafika może nie pojawić się poprawnie na modelu, ponieważ obiekt nie posiada jeszcze zdefiniowanych współrzędnych UV.

![podpinanie obrazu jako etykiety](/public/courses/blender/Images/podpinanie-obrazu-jako-etykiety.png)

---

## 🗺️ Krok 8: Rozwijanie UV i dopasowanie etykiety

1. Przejdź do zakładki **UV Editing**.
2. W widoku 3D zaznacz wszystkie wierzchołki etykiety (<kbd>A</kbd>).
3. Wciśnij <kbd>U</kbd> i wybierz rzutowanie cylindryczne (**Cylinder Projection**), dopasowane do bryły opaski.

![butelka w UV editing](/public/courses/blender/Images/butelka-UV-editing.png)

### Wyrównywanie wierzchołków siatki UV:
Siatka po automatycznym rzutowaniu może być zniekształcona. Wyrównujemy ją do prostokąta:
1. W oknie UV Editor wciśnij <kbd>C</kbd> (*Circle Select*), aby pędzlem zaznaczyć górną poziomą krawędź wierzchołków.
2. Kliknij <kbd>PPM</kbd> $\rightarrow$ **Align Horizontally**.
3. Powtórz operację dla pionowych linii wierzchołków, wybierając **Align Vertically**.

![wyrównanie siatki UV na etykiecie](/public/courses/blender/Images/wyruwnanie-siatki-UV-na-etykiecie.png)

### Rozwiązanie problemu deformacji UV przez modyfikator:
Mimo równej siatki tekstura może ulec rozciągnięciu przez aktywny modyfikator **Subdivision Surface**.

![błędny UV mimo poprawnej siatki](/public/courses/blender/Images/błędny-uv-mimo-poprawnej-siatki-uv.png)

Rozwiązanie produkcyjne:
1. W panelu modyfikatorów kliknij strzałkę obok nazwy Subdivision Surface i wybierz **Apply** (zamrażając podziały w stałą geometrię).
2. Ponownie zaznacz linie wierzchołków i wyrównaj je narzędziem **Align Horizontally** oraz **Align Vertically**.

![Problem z UV po zastosowaniu modyfikatora](/public/courses/blender/Images/problem-z-uv-po-zastosowaniu-modyfikatora.png)

---

## ⚙️ Krok 9: Korek – Wiele materiałów i prążki proceduralne (Bump)

1. Zastosuj modyfikator **Subdivision** na obiekcie korka.
2. Nadaj mu kolor granatowy z parametrem `Roughness: 0.7`.
3. Dodaj drugi slot materiałowy w zakładce *Material Properties*, zaznacz ścianki boczne korka i kliknij przycisk **Assign**, przypisując materiał do wybranego fragmentu.

![butelka z wieloma materiałami](/public/courses/blender/Images/butelka-wiele-materiałów.png)

### Szwy UV i rozwijanie korka:
1. Zaznacz krawędź obwodową rozdzielającą materiały oraz jedną linię pionową dzielącą ściankę boczną.
2. Kliknij <kbd>PPM</kbd> $\rightarrow$ **Mark Seam** (szwy zostaną podświetlone na pomarańczowo-czerwono).

![Szwy na korku butelki](/public/courses/blender/Images/szwy-uv-butelka.png)

3. Wciśnij <kbd>U</kbd> $\rightarrow$ **Unwrap** (metoda *Angle Based*).
4. Przełącz tryb zaznaczania na wyspy UV (klawisz <kbd>4</kbd> na klawiaturze numerycznej w UV Editorze), aby wygodnie rozłożyć i wyrównać trzy powstałe wyspy do kształtu prostokąta.

![Siatka UV korka i zaznaczanie wyspami](/public/courses/blender/Images/uv-korka-i-selekt-wyspami.png)

### Proceduralna faktura prążków (Bump Mapping):
W zakładce **Shading** tworzymy chropowate rowki na boku korka za pomocą 4 węzłów:
- **Bump:** przekształca mapę kontrastu (czerń/biel) na pozorne wypukłości wektora normalnego.
- **Color Ramp:** reguluje kontrast i wyrazistość prążków.
- **Wave Texture:** generuje powtarzalne, pionowe fale symulujące ząbki uchwytu.
- **UV Map:** pobiera współrzędne z rozwiniętej siatki UV i przekazuje je do generatora fal.

> [!TIP]
> Jeśli prążki układają się poziomo zamiast pionowo, obróć wyspę UV boku korka o $90^\circ$ w oknie UV Editora (<kbd>R</kbd> $\rightarrow$ `90` $\rightarrow$ <kbd>Enter</kbd>).

![Shading korka z węzłami proceduralnymi](/public/courses/blender/Images/lorek-od-butelki-shading.png)

---

## 🏆 Efekt końcowy

Po połączeniu bryły toczonej, wydzielonej etykiety ze zmapowaną grafiką oraz wytłoczonego proceduralnie korka otrzymujesz gotowy, zoptymalizowany asset butelki wody Saguaro:

![gotowy model butelki](/public/courses/blender/Images/gotowy-model-butelki.png)

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Tworzenie brył obrotowych o precyzyjnych proporcjach za pomocą profilu 2D i narzędzia **Spin** (<span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>E</kbd></span>).
- Wyodrębnianie powiązanych elementów do osobnych obiektów (<kbd>P</kbd> $\rightarrow$ *Selection*) i likwidację nakładania się ścianek.
- Kontrolę cieniowania powierzchni łącząc **Shade Smooth** ze szwami ostrości **Mark Sharp**.
- Zrozumienie podstaw rzutowania UV, szwów rozcięcia (**Mark Seam**) oraz wyrównywania siatek do grafiki etykiety.
- Podstawy generowania mikrowypukłości powierzchni za pomocą węzła **Bump** i tekstur proceduralnych bez zagęszczania geometrii.