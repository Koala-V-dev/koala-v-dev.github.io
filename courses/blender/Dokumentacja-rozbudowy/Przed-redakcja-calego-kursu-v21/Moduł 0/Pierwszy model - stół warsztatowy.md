# Pierwszy model - stół warsztatowy

Z domyślnej kostki zrobimy blat, dodamy cztery nogi i zetniemy ostre krawędzie. Przy tej pracy poznasz nawigację, transformacje oraz różnicę między edycją obiektu i jego siatki.

## 🖥️ Rozkład interfejsu

Uruchom nową scenę **General**. W zakładce **Layout** okno jest podzielone na kilka edytorów:

![Układ Blendera: 1 widok 3D, 2 Outliner, 3 Properties, 4 Timeline, 5 Workspaces](/public/courses/blender/Images/m00-ui.png)

1. **3D Viewport**: tutaj oglądasz i modelujesz przedmiot.
2. **Outliner**: lista obiektów sceny, przydatna do wybierania części po nazwie.
3. **Properties**: ustawienia obiektu, sceny i renderowania. Kategorię wybierasz ikonami po lewej stronie tego edytora.
4. **Timeline**: oś czasu do animacji.
5. **Workspaces**: zakładki z układami edytorów przygotowanymi m.in. do modelowania, UV i materiałów.

## 🧱 Kostka staje się blatem

Kliknij kostkę lewym przyciskiem. Pomarańczowy obrys oznacza zaznaczenie; ten sam obiekt możesz wybrać po nazwie `Cube` w **Outlinerze**, czyli liście w prawym górnym rogu.

W **Properties** po prawej wybierz **Scene** (1 na zrzucie), rozwiń **Units** (2) i ustaw `Metric`, `Unit Scale: 1`. Dzięki temu będziemy wpisywać rozmiary w metrach i centymetrach.

![Ustawienia jednostek: 1 wskazuje zakładkę Scene, 2 pola Metric i Unit Scale](/public/courses/blender/Images/m00-units.png)

Najedź nad widok 3D i naciśnij <kbd>N</kbd>. W zakładce **Item** znajdziesz **Dimensions** (3), czyli wymiary obiektu. Dwuklikiem edytuj pola: X=`2 m`, Y=`1 m`, Z=`8 cm`. Kostka spłaszczy się w blat. W **Location Z** (1) wpisz `0.86 m`: środek blatu będzie na tej wysokości, a jego górna powierzchnia na 90 cm.

![Blat: 1 położenie środka, 2 skala obiektu, 3 wymiary](/public/courses/blender/Images/stol-blat-skala.png)

Zmień nazwę `Cube` na `Blat` przez <kbd>F2</kbd>. Zostaw kamerę i światło w scenie; teraz pracujemy na bryle.

## 🧭 Obejrzyj to, co zmieniłeś

Przytrzymaj środkowy przycisk myszy i przeciągnij, żeby obrócić widok. Kółko przybliża, a <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>ŚPM</kbd></span> przesuwa kadr. Location blatu pozostaje bez zmian: poruszasz widokiem, nie przedmiotem.

Obejrzyj blat od góry i od spodu. Bez środkowego przycisku korzystaj z manipulatora osi oraz ikon lupy i dłoni po prawej stronie widoku. Gdy zgubisz obiekt, wybierz `Blat` w Outlinerze i użyj **View → Frame Selected** lub <kbd>Numpad .</kbd>.

<kbd>Numpad 1</kbd> pokazuje przód, <kbd>Numpad 3</kbd> prawy bok, a <kbd>Numpad 7</kbd> górę. Bez numpada te rzuty znajdziesz w **View → Viewpoint**. Przydadzą się za chwilę do ustawienia nóg.

## 📐 Rozmiar i skala to różne rzeczy

Spójrz na **Scale** w Item (2 na zrzucie blatu). Po spłaszczeniu kostki wartości są różne od 1. Dimensions opisuje wynikowy rozmiar, a Scale mówi, jak obiekt został przeskalowany względem swojej siatki.

W **Object Mode** wybierz **Object → Apply → Scale**, dostępne też pod <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span>. Na poniższym zrzucie Scale (1) wróciło do `(1,1,1)`, a wymiary (2) pozostały takie same. Przygotowujemy w ten sposób równomierne fazowanie krawędzi na końcu lekcji.

![Po Apply Scale: 1 skala jednostkowa, 2 zachowane wymiary blatu](/public/courses/blender/Images/stol-blat-apply.png)

## 🦵 Dodaj nogę i zrób z niej cztery

W **Object Mode** wybierz **Add → Mesh → Cube** lub <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> → Mesh → Cube. Nowej kostce ustaw Dimensions `(0.1, 0.1, 0.82) m` (2 na zrzucie) i Location `(0.86, -0.36, 0.41) m` (1). Nazwij ją `Noga_PP` i zastosuj Scale tak jak przy blacie.

Noga sięga od podłoża do spodu blatu: 82 cm wysokości, środek na 41 cm. W rzucie od przodu sprawdź, czy obie części się stykają. Z góry zobaczysz odsunięcie nogi od brzegów.

![Pierwsza noga: 1 położenie, 2 jej wymiary; blat pozostaje na miejscu](/public/courses/blender/Images/stol-pierwsza-noga.png)

Zaznaczoną nogę powiel przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>. Blender od razu rozpoczyna przesuwanie kopii. Naciśnij <kbd>X</kbd>, wpisz `-1.72` i zatwierdź <kbd>Enter</kbd>. Kopia przejdzie na przeciwną stronę stołu. Nazwij ją `Noga_LP`.

Zaznacz obie nogi: pierwszą kliknij, drugą dodaj do zaznaczenia z <kbd>Shift</kbd>. Powiel parę przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>Y</kbd>, `0.72`, <kbd>Enter</kbd>. Powstał drugi rząd. Nazwij kopie `Noga_PT` i `Noga_LT`.

![Cztery nogi pod tym samym blatem](/public/courses/blender/Images/stol-cztery-nogi.png)

Jeśli kopia trafi w złe miejsce, cofnij operację przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>. Nie dokładaj kolejnej nogi, zanim sprawdzisz poprzednią. [Plik z blatem i pierwszą nogą](/public/courses/blender/Resources/stol-01-blat-i-noga.blend) pozwala wrócić do tego etapu, gdy chcesz powtórzyć powielanie.

## 🕸️ Edytuj krawędzie, nie cały obiekt

Wybierz sam `Blat`. Dotąd w Object Mode zmienialiśmy całe obiekty. Naciśnij <kbd>Tab</kbd>, aby wejść w **Edit Mode** i pracować na siatce: jej punktach, krawędziach i ścianach. Cyfry <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd> nad literami przełączają te rodzaje zaznaczania.

Wciśnij <kbd>2</kbd>, potem <kbd>A</kbd>, aby zaznaczyć krawędzie blatu. Ten sam wybór daje przycisk wskazany numerem 1 na zrzucie. Uruchom **Bevel** przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>, wpisz `0.005`, kółkiem myszy ustaw dwa segmenty fazy i zatwierdź. Na rancie (2) pojawią się wąskie fazy zamiast idealnie ostrego załamania.

![Edit Mode: 1 wybór krawędzi, 2 siatka blatu po fazowaniu](/public/courses/blender/Images/stol-edit-bevel.png)

Wróć przez <kbd>Tab</kbd> do Object Mode i obejrzyj rant z bliska. Scale nadal wynosi 1: tym razem zmieniliśmy geometrię wewnątrz obiektu. Samo Shade Smooth zmieniłoby sposób cieniowania, ale nie wycięłoby takich faz.

## 💾 Zapisz gotowy etap

Wybierz **File → Save As** i zapisz `stol_v01.blend`. [Plik wynikowy](/public/courses/blender/Resources/stol-02-wynik.blend) pokazuje ten sam stół po fazowaniu. Masz już model złożony z osobnych części, ustawiony w rzeczywistej skali. W kolejnej pracy wykorzystamy ten podział do dalszego modelowania.
