# Pierwszy model - stół warsztatowy

Otwórz Blender i wybierz **General** na ekranie startowym. Jeśli masz już otwarty projekt, nową scenę utworzysz przez <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">New</kbd> → <kbd class="win-menu-btn">General</kbd>.

## 🖥️ Gdzie pracujesz

W zakładce **Layout** znajdziesz układ widoczny na zrzucie. Numery wskazują poszczególne części okna:

![Układ Blendera: 1 widok 3D, 2 Outliner, 3 Properties, 4 Timeline, 5 Workspaces](/public/courses/blender/Images/m00-ui.png)

1. **3D Viewport** - widok 3D. Tutaj zaznaczasz, oglądasz i modelujesz obiekty.
2. **Outliner** - lista obiektów sceny. Pozwala wybrać obiekt po nazwie, nawet gdy zasłania go inny obiekt.
3. **Properties** - ustawienia. Ikony wzdłuż lewej krawędzi tej sekcji przełączają ustawienia sceny, obiektu, materiałów i innych elementów.
4. **Timeline** - oś czasu używana przy animacji.
5. **Workspaces** - zakładki z różnymi układami pracy. Na razie pozostań w Layout.

Okno jest podzielone na _**obszary**_, czyli sekcje wyświetlające różne typy edytorów. Przykładowo w miejscu Timeline możesz wyświetlić drugi widok 3D. Typ zmieniasz przyciskiem w lewym górnym rogu danej sekcji. W tej lekcji pozostaw domyślny układ.

Dodatkowo klikając <kbd>PPM</kbd> na krawędź możesz dzielić sekcje vertykalnie lub horyzontalnie albo je scalać w jedno.

![](/public/courses/blender/Images/tryby-okien-i-zarządzanie-sekcjami.png)

## 🧱 Zmień kostkę w blat

Kliknij kostkę lewym przyciskiem myszy. Zaznaczony obiekt dostaje pomarańczowy obrys. Możesz też kliknąć jego nazwę `Cube` w Outlinerze.

W Properties otwórz *Scene* (1 na zrzucie), rozwiń *Units* (2) i ustaw:

- Unit System: `Metric`.
- Unit Scale: `1`.

Blender będzie wyświetlał wymiary w jednostkach metrycznych. Przy wpisywaniu wartości możesz używać zarówno `m`, jak i `cm`.

![Ustawienia jednostek: 1 wskazuje zakładkę Scene, 2 pola Metric i Unit Scale](/public/courses/blender/Images/m00-units.png)

Najedź kursorem na widok 3D i naciśnij <kbd>N</kbd>. Przy prawej krawędzi widoku otworzy się panel boczny. Wybierz w nim zakładkę *Item*.

W sekcji **Dimensions** (3 na następnym zrzucie) ustaw rozmiar blatu:

| Pole | Wpisz  | Co zmieniasz |
| ---- | ------ | ------------ |
| X    | `2 m`  | Szerokość    |
| Y    | `1 m`  | Głębokość    |
| Z    | `8 cm` | Grubość      |

Kliknij dwukrotnie wartość w danym polu, wpisz nową i zatwierdź <kbd>Enter</kbd>. Kostka spłaszczy się w płytę.

W *Location Z* (1) wpisz `0.86 m`. To wysokość środka tej kostki. Blat ma 8 cm grubości, więc jego spód znajdzie się 4 cm niżej, na wysokości 82 cm. Górna powierzchnia będzie na 90 cm.

![Blat: 1 położenie środka, 2 skala obiektu, 3 wymiary](/public/courses/blender/Images/stol-blat-skala.png)

Z kursorem nad widokiem 3D naciśnij <kbd>F2</kbd> i zmień nazwę `Cube` na `Blat`. Nową nazwę zobaczysz w Outlinerze.

## 🧭 Obejrzyj blat z kilku stron

Przytrzymaj środkowy przycisk myszy i przeciągnij. Obrócisz widok wokół obiektu. Kółkiem myszy przybliżysz lub oddalisz widok.

Przytrzymaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>ŚPM</kbd></span> i przeciągnij, aby przesunąć widok na bok. 

> [!TIP]
> Skrót ŚPM oznacza środkowy przycisk myszy.

Obejrzyj blat od spodu. Jego położenie w scenie pozostaje takie samo - zmieniasz miejsce, z którego na niego patrzysz.

Do sprawdzenia ustawienia nóg przydadzą się widoki prostopadłe do osi:

- <kbd>Numpad 1</kbd> - widok od przodu. **`-Y`**
- <kbd>Numpad 3</kbd> - widok z prawej strony. **_`+X`_**
- <kbd>Numpad 7</kbd> - widok z góry. *`+Z`*

To klawisze na klawiaturze numerycznej, nie cyfry nad literami. Jeśli nie masz numpada, te same widoki wybierzesz w menu View → Viewpoint lub klikając na odpowiednie ikony w orbicie widoku 3D.

Gdy zgubisz blat poza kadrem, wybierz `Blat` w Outlinerze i użyj <kbd class="win-menu-btn">View</kbd> → <kbd class="win-menu-btn">Frame Selected</kbd> lub <kbd>Numpad .</kbd>. Blender ustawi widok na zaznaczonym obiekcie.


## 📐 Zastosuj skalę blatu

W panelu Item spójrz na *Scale* (2 na zrzucie blatu). Kostka została mocno rozciągnięta w X i spłaszczona w Z, dlatego wartości skali są różne.

_**Dimensions i Scale opisują coś innego**_: Dimensions podaje obecny rozmiar, a Scale informuje o przeskalowaniu obiektu. Przy fazowaniu nierównomierna skala może dać różną szerokość faz na różnych krawędziach.

Z zaznaczonym blatem, w Object Mode, wybierz <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>. Możesz też otworzyć menu Apply przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> i wybrać Scale.

Blat nie powinien zmienić rozmiaru. *Scale* wraca do `1, 1, 1`, a *Dimensions* pozostaje bez zmian. Blender uwzględnił przeskalowanie w siatce obiektu.

![Po Apply Scale: 1 skala jednostkowa, 2 zachowane wymiary blatu](/public/courses/blender/Images/stol-blat-apply.png)

## 🦵 Ustaw pierwszą nogę

W Object Mode wybierz <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Cube</kbd> (<kbd>Shift</kbd> + <kbd>A</kbd>). Nowa kostka będzie osobnym obiektem. Nadaj jej nazwę `Noga_PP` przez <kbd>F2</kbd>.

W panelu *Item* ustaw:

| Ustawienie | X        | Y         | Z        |
| ---------- | -------- | --------- | -------- |
| Dimensions | `0.1 m`  | `0.1 m`   | `0.82 m` |
| Location   | `0.86 m` | `-0.36 m` | `0.41 m` |

Noga ma przekrój 10 × 10 cm i wysokość 82 cm. Jej środek znajduje się na 41 cm, więc dół wypada na wysokości 0, a góra dochodzi do spodu blatu.

Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>, tak jak przy blacie (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span>).

![Pierwsza noga: 1 położenie, 2 jej wymiary; blat pozostaje na miejscu](/public/courses/blender/Images/stol-pierwsza-noga.png)

Sprawdź nogę od przodu i z prawej strony. Jej góra ma stykać się z blatem. W widoku z góry zobaczysz, że jest odsunięta od jego brzegów.

## ↔️ Powiel nogę na drugą stronę

Pozostaw zaznaczoną nogę. Z kursorem myszki w widoku 3D naciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>. Powstaje kopia i od razu zaczyna podążać za myszą.

Naciśnij <kbd>X</kbd>, żeby ograniczyć jej ruch do osi X. Wpisz `-1.72` i zatwierdź <kbd>Enter</kbd>. Kopia przejdzie z X = 86 cm na X = -86 cm, na przeciwną stronę blatu. Nazwij ją `Noga_LP`.

Teraz kliknij jedną nogę, a drugą dodaj do zaznaczenia z przytrzymanym <kbd>Shift</kbd>. Obie mają być zaznaczone.

Powiel parę przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>. Tym razem naciśnij <kbd>Y</kbd>, wpisz `0.72` i zatwierdź <kbd>Enter</kbd>. Powstanie drugi rząd nóg. Nazwij nowe obiekty `Noga_PT` i `Noga_LT`.

![Cztery nogi pod tym samym blatem](/public/courses/blender/Images/stol-cztery-nogi.png)

Obejrzyj stół z góry. Przy każdym narożniku ma być jedna noga. Jeśli przesunął się **_blat zamiast nogi_**, cofnij operację przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> i wybierz właściwy obiekt w Outlinerze.

[Punkt kontrolny z blatem i pierwszą nogą](/public/courses/blender/Resources/stol-01-blat-i-noga.blend) pozwala powtórzyć ten etap bez ponownego ustawiania części.

## 🕸️ Zetnij ostre krawędzie blatu

Wybierz sam `Blat`. Dotąd zmieniałeś rozmiar i położenie całych obiektów w **Object Mode**. Teraz naciśnij <kbd>Tab</kbd>, aby wejść w **Edit Mode** i pracować na siatce blatu.

Siatka składa się z wierzchołków, krawędzi i ścian. Wierzchołki to punkty. Krawędzie łączą punkty, a ściany tworzą powierzchnię między krawędziami. Ich wybór przełączasz cyframi nad literami:

- <kbd>1</kbd> - wierzchołki (vertex).
- <kbd>2</kbd> - krawędzie (edges).
- <kbd>3</kbd> - ściany (face).

Naciśnij <kbd>2</kbd>, a potem <kbd>A</kbd>, aby zaznaczyć wszystkie krawędzie blatu.  
Tryb wyboru krawędzi wskazano numerem 1 na zrzucie poniżej.

Uruchom **Bevel** przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>, wpisz `0.005` i zatwierdź <kbd>Enter</kbd>. Krawędzie zostaną ścięte o 5 mm.

Od razu otwórz <kbd>F9</kbd>, czyli ustawienia ostatniej operacji. Ustaw *Segments* na `2`. Dwa wąskie pasy ścian utworzą łagodniejsze przejście niż pojedyncze ścięcie. Na rancie (2 na zrzucie) powinieneś zobaczyć nowe krawędzie.

![Edit Mode: 1 wybór krawędzi, 2 siatka blatu po fazowaniu](/public/courses/blender/Images/stol-edit-bevel.png)

Zmieniła się _**topologia siatki**_, czyli układ jej wierzchołków, krawędzi i ścian. Przy zmianie Dimensions kostka zachowywała sześć ścian. Bevel dodał nowe ściany w miejscu ostrych kantów.

Naciśnij <kbd>Tab</kbd>, aby wrócić do Object Mode.  
Przybliż narożnik i obejrzyj fazę z boku.

## 💾 Zapisz projekt

Wybierz <span style="white-space: nowrap;"><kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Save As</kbd></span> i zapisz plik jako `stol_v01.blend` (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> / <kbd>Ctrl</kbd> + <kbd>S</kbd>). Kolejna lekcja zaczyna się od tego stołu.

[Plik wynikowy po fazowaniu](/public/courses/blender/Resources/stol-02-wynik.blend) służy do porównania ustawienia części i krawędzi blatu.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

W Object Mode pracujesz na całych obiektach. W Edit Mode możesz zmieniać wybrane fragmenty ich siatki. Przesunięcie wierzchołka zmienia kształt, a dodanie krawędzi lub ścian zmienia także topologię.

Skróty warte zapamiętania:

| Skrót | Działanie |
| --- | --- |
| <kbd>N</kbd> | Otwiera lub zamyka panel boczny widoku 3D, m.in. z zakładką Item. |
| <kbd>F2</kbd> | Zmienia nazwę zaznaczonego obiektu. |
| <kbd>Tab</kbd> | Przełącza Object Mode i Edit Mode. |
| <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd> | W Edit Mode: wybór wierzchołków, krawędzi i ścian. Cyfry nad literami. |
| <kbd>A</kbd> | Zaznacza wszystkie obiekty lub całą edytowaną siatkę, zależnie od trybu. |
| <kbd>Shift</kbd> + kliknięcie | Dodaje kolejny obiekt do zaznaczenia w widoku 3D. |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span> | Powiela zaznaczenie i rozpoczyna przesuwanie kopii. |
| <kbd>X</kbd> lub <kbd>Y</kbd> podczas przesuwania | Ogranicza ruch do wybranej osi. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> → Scale | Otwiera menu Apply. Wybranie Scale stosuje skalę obiektu. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span> | Uruchamia Bevel na zaznaczonych krawędziach w Edit Mode. |
| <kbd>F9</kbd> | Otwiera ustawienia ostatniej operacji, np. Segments po Bevel. |
| <kbd>Numpad 1</kbd>, <kbd>Numpad 3</kbd>, <kbd>Numpad 7</kbd> | Widok od przodu, z prawej strony i z góry. |
| <kbd>Numpad .</kbd> | Ustawia widok na zaznaczonym obiekcie. |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>ŚPM</kbd></span> i przeciąganie | Przesuwa widok na bok. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> | Cofa ostatnią operację. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span> / <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd></span> | Save / Save As: zapisuje projekt lub otwiera zapis pod inną nazwą. |
