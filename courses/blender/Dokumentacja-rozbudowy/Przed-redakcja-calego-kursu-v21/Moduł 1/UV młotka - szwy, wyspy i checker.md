# UV młotka - szwy, wyspy i checker

W poprzedniej lekcji porównaliśmy ciągłość powierzchni, odkształcenie UV i przydział pikseli. Teraz przygotujesz własne szwy, sprawdzisz checker i ułożysz wyspy obu części młotka. Jeśli zaczynasz tutaj, przeczytaj najpierw [jak wybierać cięcia i dzielić piksele](/public/courses/blender/modul-1/uv-jak-wybierac-ciecia-i-dzielic-piksele).

Otwórz `mlotek_v02.blend` lub [model z materiałami](/public/courses/blender/Resources/mlotek-02-materialy.blend). Zapisz pracę jako `mlotek_v03.blend`.

## 🧩 Podłącz obraz kontrolny

Przejdź do obszaru roboczego **UV Editing**. Po lewej jest edytor obrazu i UV, po prawej widok modelu. Najpierw przygotujemy checker, czyli kratkę pozwalającą ocenić rozciąganie obrazu na powierzchni.

W Object Mode zaznacz trzonek. Ikoną typu edytora w lewym górnym rogu **lewego obszaru** zmień UV Editor na **Shader Editor**. To edytor materiału; widoczne w nim węzły opisują przepływ danych do powierzchni.

Wybierz **Add → Texture → Image Texture**. Na nowym węźle kliknij **New**. Nazwij obraz `Checker_1024`, ustaw Width i Height na `1024`, a **Generated Type** na **Color Grid**. Zatwierdź, następnie przeciągnij połączenie z wyjścia **Color** obrazu do wejścia **Base Color** węzła Principled BSDF. Zrzut pokazuje oba końce tego przewodu (1 i 2).

![Obraz Color Grid podłączony do koloru materiału trzonka](/public/courses/blender/Images/uv-checker-node.png)

Na głowicy dodaj drugi Image Texture, ale zamiast New wybierz z listy **ten sam** `Checker_1024`. Również połącz Color z Base Color. Na czas kontroli zmień Metallic głowicy na `0`, żeby metaliczne odbicia nie utrudniały oglądania kratki. W widoku 3D włącz znany już **Material Preview**.

Zmień lewy obszar z powrotem na **UV Editor** i wybierz w nim obraz `Checker_1024`. Jeżeli samego wybrania obrazu w edytorze nie widać na modelu, sprawdź połączenie w materiale: wyświetlenie obrazu po lewej nie podłącza go automatycznie do powierzchni.

## 🔎 Zobacz, co zostało po kostkach

Zaznacz trzonek i głowicę, przejdź do Edit Mode i zaznacz wszystkie ściany. UV po lewej mogą już istnieć: kostki startowe dostały domyślne mapowanie, a później zmienialiśmy ich kształt. To nie jest jeszcze poprawne rozłożenie gotowego młotka.

![Domyślne UV i nierówna kratka na wymodelowanym młotku](/public/courses/blender/Images/uv-przed.png)

Kwadraty powinny mieć zbliżony rozmiar na obu częściach. Mocno wydłużone pola oznaczają rozciągnięcie obrazu. Nakładające się wyspy sprawiłyby też, że malowanie jednego fragmentu zmieniałoby drugi.

## ✂️ Wskaż szwy trzonka

Wróć do Object Mode, zaznacz sam trzonek i włącz Local View. W Edit Mode wybierz ściany, odznacz wszystko, a potem zaznacz górną i dolną ścianę trzonka. Obróć widok, żeby dodać drugą z Shift.

Wybierz **Select → Loops → Boundary Loop**. Blender zaznaczy krawędzie otaczające obie końcowe ściany. Użyj **Edge → Mark Seam**. Odznacz wszystko: szwy powinny być czerwone.

Obróć trzonek od tyłu. W trybie wyboru krawędzi zaznacz z Shift **dwie krawędzie tworzące jeden podłużny narożnik**, od dolnej do górnej końcówki, przez środkową pętlę. Wybieramy tylny narożnik przy ujemnym X i dodatnim Y, pokazany numerem 1. Ponownie wykonaj Mark Seam.

![Szwy trzonka: podłużne cięcie i obwody końcówek](/public/courses/blender/Images/uv-szwy-trzonek.png)

Obwody odcinają dwie końcówki. Podłużny szew pozwala otworzyć boczną powierzchnię jak owijkę. **Mark Seam nie rozcina modelu w scenie**; wskazuje, gdzie rozdzielić obraz podczas rozkładania UV.

## 🗺️ Rozłóż trzonek

Zaznacz całą siatkę trzonka. Nad widokiem 3D wybierz **UV → Unwrap Angle Based**. Po lewej powinny powstać trzy wyspy: długa powierzchnia boczna oraz dwie małe końcówki.

![Rozłożony trzonek: jedna wyspa boczna i dwie końcówki](/public/courses/blender/Images/uv-trzonek.png)

Wyspa to połączony fragment UV. Zbliż widok kratki na trzonku i porównaj środek z końcami. Patrz możliwie prostopadle do ocenianej ściany: widok pod kątem sam zmienia wygląd kwadratów. Jeżeli pola są rozciągnięte również na wprost, sprawdź szwy i zaznaczenie przed Unwrap.

Chcemy, żeby długość trzonka biegła pionowo w UV, wzdłuż V. Jeżeli długa wyspa leży poziomo, odznacz UV, najedź na nią i użyj **Select Linked Pick**, <kbd>L</kbd>, a następnie **Rotate**, <kbd>R</kbd>, `90`, <kbd>Enter</kbd>. To przygotuje czytelny kierunek późniejszych słojów.

## 🔨 Rozłóż głowicę na osobne boki

Wróć do Object Mode, wyłącz Local View i zaznacz głowicę. Włącz Local View dla niej. Zaznacz obie końcowe ściany po przeciwnych stronach osi X, wykonaj Boundary Loop i Mark Seam.

Odznacz wszystko. Dodaj szwy na **wszystkich czterech podłużnych narożnikach głowicy**. Każdy narożnik tworzą trzy kolejne krawędzie od jednej końcówki do drugiej. Obracaj widok, żeby zaznaczyć również narożniki od spodu i z tyłu. Nie oznaczaj poprzecznych pętli przy zwężeniach.

![Szwy wokół końcówek i wzdłuż narożników rozdzielających boki głowicy](/public/courses/blender/Images/uv-szwy-glowica-pelne.png)

Zaznacz całą głowicę i wykonaj Unwrap Angle Based. Oczekujemy **sześciu wysp: czterech pasów bocznych i dwóch końcówek**. To wariant z mniejszym odkształceniem poznany w poprzedniej lekcji. Obejrzyj kratkę na płaskim środkowym boku od przodu, a skośną końcówkę osobno, obracając widok w jej stronę.

## 📐 Wyrównaj skalę i ułóż wspólną mapę

Wróć do Object Mode, wyłącz Local View i zaznacz obie części. Wejdź w Edit Mode, zaznacz wszystkie ściany. **Przenieś kursor nad UV Editor**, zaznacz wszystkie UV i wykonaj kolejno:

1. **UV → Average Islands Scale**. Wyrównuje skalę obrazu względem powierzchni modelu, aby drobne końcówki i duże boki nie miały przypadkowo zupełnie innej wielkości kratki.
2. **UV → Pack Islands**. W opcjach ostatniej operacji wyłącz **Rotate**, ustaw **Margin Method: Fraction** i **Margin: 0.02**. Wyspy mają zmieścić się w kwadracie 0-1 bez nakładania, z odstępami.

![Wspólne UV obu części oraz checker po rozłożeniu i ułożeniu wysp](/public/courses/blender/Images/uv-atlas-dokladny.png)

Po lewej widać teraz **dziewięć wysp**: jeden pas trzonka, cztery pasy głowicy i cztery końcówki. Porównaj rozmiar drobnej kratki na modelu, a nie wielkość samych wysp: większy fragment powierzchni zajmuje odpowiednio więcej miejsca w UV.

Obie części nadal mają osobne materiały. Wspólny układ UV pozwoli później korzystać z jednego zestawu obrazów. Wyłączone Rotate zachowuje ustalony kierunek trzonka. Odstępy zostawiają miejsce na rozszerzenie koloru poza brzegi wysp, potrzebne przy filtrowaniu tekstury.

Obejrzyj również fazy i końcówki. Bevel pozostaje modyfikatorem i wylicza UV nowych ścian na podstawie mapowania siatki bazowej. Checker ma ujawnić problemy także tam, nie tylko na największych płaszczyznach.

## 💾 Zachowaj kontrolę i przywróć materiały

W UV Editorze wybierz **Image → Save As** i zapisz `Checker_1024` jako PNG, np. w folderze `textures` obok projektu. Następnie wybierz **Image → Pack**, żeby kopia obrazu znalazła się również wewnątrz pliku Blender. Zapisz `mlotek_v03.blend` z widoczną kratką. To wersja kontrolna, do której możesz wrócić bez odtwarzania obrazu.

Następnie zapisz kopię jako `mlotek_v04.blend`. W Object Mode usuń z obu materiałów dodany węzeł Image Texture. Wcześniejsze kolory Principled wrócą po odpięciu połączeń. Głowicy przywróć Metallic `1`. UV pozostają na miejscu: zmiana materiału ich nie usuwa.

![Drewno i stal przywrócone, przygotowane wyspy UV zachowane](/public/courses/blender/Images/uv-wynik-dokladny.png)

Zapisz plik. Do porównania masz [wersję z zapakowanym checkerem](/public/courses/blender/Resources/mlotek-05-uv-glowica-checker.blend) i [model z UV oraz przywróconymi materiałami](/public/courses/blender/Resources/mlotek-06-uv-glowica-materialy.blend). W kolejnym kroku wykorzystamy te wyspy do ułożenia słojów drewna.
