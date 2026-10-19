# Młotek - siatka, Bevel i oddzielny asset

Młotek zbudujemy z trzonka i głowicy. Dodatkowa pętla krawędzi pozwoli zwęzić trzonek przy końcach, a modyfikator Bevel zaokrągli ostre krawędzie bez utraty dostępu do prostej siatki. Młotek dostanie własną kolekcję i osobny plik, niezależny od stołu.

Otwórz `stol_v04.blend` albo [stół z poprzedniej lekcji](/public/courses/blender/Resources/stol-08-szuflada-otwarta.blend). Zapisz dalszą pracę jako `stol_v05.blend`.

## 🗂️ Oddziel stół od narzędzia

W Object Mode zaznacz wszystko przez **Select → All**, <kbd>A</kbd>. Wybierz **Object → Collection → Move to Collection**, <kbd>M</kbd>, następnie **New Collection**. Nazwij ją `Stol_warsztatowy` i potwierdź. Przenosisz istniejące obiekty, zachowując parenting szuflady.

Dodaj Cube i nazwij go `Trzonek`. Z zaznaczonym trzonkiem ponownie użyj <kbd>M</kbd> → **New Collection**, tym razem `Mlotek`. Obie kolekcje mają leżeć obok siebie pod **Scene Collection**. Kolekcja porządkuje obiekty; sama nie jest rodzicem i nie łączy ich ruchu.

W Outlinerze kliknij oko przy kolekcji stołu, żeby ją ukryć. Ukrycie nie usuwa obiektów. Pustą dawną `Collection` możesz usunąć, jeżeli po przeniesieniu nic w niej nie zostało.

## 🪵 Dodaj pętlę w trzonku

Trzonek modelujemy pionowo, od podstawy Z = 0 do Z = 30 cm. Ustaw **Dimensions** `(0.028, 0.022, 0.30) m`, **Location** `(0, 0, 0.15) m` i zastosuj Scale.

Wejdź w Edit Mode. Uruchom **Loop Cut and Slide** przez <kbd>Ctrl</kbd> + <kbd>R</kbd> lub menu Edge. Najedź na jedną z długich pionowych krawędzi. Podgląd cięcia ma biec poziomo wokół trzonka. Kliknij raz, żeby wykonać cięcie, a następnie kliknij prawym przyciskiem, żeby pozostawić je dokładnie pośrodku.

![Trzonek z jedną poziomą pętlą krawędzi](/public/courses/blender/Images/mlotek-loop.png)

Pętla dzieli boczne ściany na dwa pasy. Dzięki niej zmiana końca trzonka nie rozciągnie całego boku aż do drugiego końca.

Włącz wybór ścian przez <kbd>3</kbd> nad literami, odznacz wszystko i wybierz górną ścianę. Użyj **Scale**: <kbd>S</kbd>, <kbd>Shift</kbd> + <kbd>Z</kbd>, `0.7`, <kbd>Enter</kbd>. Skrót Shift + Z wyklucza oś Z, więc zwężasz przekrój bez zmiany wysokości. Obróć widok od spodu, wybierz tylko dolną ścianę i w ten sam sposób ustaw skalę `0.85`.

![Trzonek węższy przy końcach, z zachowaną pełną szerokością w środku](/public/courses/blender/Images/mlotek-trzonek.png)

## 🔨 Ukształtuj głowicę

Wróć do Object Mode. Dodaj Cube `Glowica` do kolekcji `Mlotek`: Dimensions `(0.065, 0.04, 0.045) m`, Location `(0, 0, 0.30) m`. Zastosuj Scale. Górny koniec trzonka wchodzi w środek głowicy.

W Edit Mode wybierz tylko boczną ścianę po stronie ujemnego X. Wykonaj **Extrude**: <kbd>E</kbd>, `0.035`, <kbd>Enter</kbd>. Dodatnia wartość prowadzi na zewnątrz zgodnie z normalną zaznaczonej ściany, tutaj w lewo. Następnie <kbd>S</kbd>, `0.9`, <kbd>Enter</kbd>, aby lekko zwęzić koniec.

Teraz wybierz ścianę po przeciwnej stronie głowicy, przy dodatnim X. Wytłocz ją o `0.045 m`, potem użyj <kbd>S</kbd>, <kbd>Y</kbd>, `0.35`, <kbd>Enter</kbd>. Ten koniec robi się wąski w jednej osi. Nie zwężaj całej głowicy w Object Mode: zmieniamy tylko wybrany koniec siatki.

![Głowica z szeroką powierzchnią uderzającą i węższym przeciwległym końcem](/public/courses/blender/Images/mlotek-glowica.png)

## ✨ Zaokrąglij krawędzie modyfikatorem

Wróć do Object Mode i wybierz głowicę. W **Modifiers → Add Modifier** wyszukaj **Bevel**. Ustaw **Amount** `0.002 m` (1 na zrzucie), **Segments** `3` (2) i **Limit Method: Angle**, `30°` (3). Na trzonku dodaj osobny Bevel z Amount `0.003 m`, również 3 segmentami i limitem Angle `30°`.

![Ustawienia Bevel i zaokrąglone krawędzie głowicy](/public/courses/blender/Images/mlotek-bevel.png)

W pierwszej lekcji Bevel dopisał geometrię bezpośrednio do siatki. Teraz pozostaje operacją w stosie: nadal możesz zmienić szerokość fazy albo liczbę segmentów. Wyłącz i włącz ikonę monitora w nagłówku modyfikatora, żeby porównać ostre i sfazowane krawędzie. Pozostaw go włączonego i nie wykonuj Apply.

## 📍 Ustaw punkt odniesienia i połóż młotek na stole

Zaznacz sam trzonek. Ustaw kursor 3D w początku świata przez **Object → Snap → Cursor to World Origin**. Następnie wybierz **Object → Set Origin → Origin to 3D Cursor**. Siatka nie przesuwa się; origin trzonka trafia w jego dolny koniec. To wygodne miejsce do ustawiania całego narzędzia.

Zaznacz głowicę, a z Shift trzonek jako ostatni. Wykonaj **Object → Parent → Object (Keep Transform)**, tak jak przy szufladzie. Głowica ma być dzieckiem trzonka, a żaden z tych obiektów dzieckiem stołu.

Przywróć widoczność kolekcji stołu. Zaznacz tylko trzonek i ustaw **Rotation X** `87.8°`, **Location** `(0.45, 0.16, 0.9093) m`. Młotek leży na blacie; niewielkie pochylenie wyrównuje oparcie grubszej głowicy i cieńszego trzonka. Zapisz projekt.

![Młotek leżący na deskach blatu](/public/courses/blender/Images/mlotek-na-stole.png)

W Outlinerze stół i młotek zajmują oddzielne kolekcje. Możesz ukryć sam stół, pozostawiając narzędzie do dalszej pracy.

![Oddzielne kolekcje Stol_warsztatowy i Mlotek oraz głowica pod trzonkiem](/public/courses/blender/Images/mlotek-kolekcje.png)

## 💾 Zapisz samo narzędzie

**Save As zapisuje cały projekt, również ukryte i niezaznaczone obiekty.** Żeby otrzymać plik samego młotka, przeniesiemy wybrane części do pustego projektu.

1. Upewnij się, że `stol_v05.blend` jest zapisany. Zaznacz **trzonek i głowicę**; samo zaznaczenie rodzica nie zaznacza automatycznie dziecka. Nad widokiem 3D użyj **Object → Copy Objects**, <kbd>Ctrl</kbd> + <kbd>C</kbd>.
2. Wybierz **File → New → General**. Zaznacz domyślne obiekty i usuń je. Użyj **Object → Paste Objects**, <kbd>Ctrl</kbd> + <kbd>V</kbd>.
3. Zaznaczony młotek przenieś przez <kbd>M</kbd> do nowej kolekcji `Mlotek`, jeżeli wklejenie nie zachowało takiej kolekcji. Usuń pustą `Collection`. W scenie mają zostać tylko trzonek i głowica w jednej kolekcji.
4. Zaznacz sam trzonek. Wybierz **Object → Clear → Location**, <kbd>Alt</kbd> + <kbd>G</kbd>, oraz **Clear → Rotation**, <kbd>Alt</kbd> + <kbd>R</kbd>. Młotek wróci pionowo do początku świata, a głowica podąży za rodzicem. W Scene → Units ustaw Metric i Unit Scale `1`, jak na początku kursu.
5. Zapisz przez **File → Save As** jako `mlotek_v01.blend`.

![Osobny projekt zawierający wyłącznie młotek](/public/courses/blender/Images/mlotek-osobny.png)

Żeby użyć go w innym projekcie, wybierz **File → Append**, otwórz `mlotek_v01.blend`, następnie **Collection**, zaznacz `Mlotek` i zatwierdź **Append**. Wczytanie kolekcji zabiera obie części oraz ich zależność rodzic-dziecko. Powstaje lokalna kopia do edycji, bez stałego powiązania z plikiem stołu.

Do porównania masz [scenę stołu z młotkiem](/public/courses/blender/Resources/stol-09-mlotek.blend) i [osobny model młotka](/public/courses/blender/Resources/mlotek-01-model.blend). Ten drugi plik wykorzystamy przy materiałach i UV.
