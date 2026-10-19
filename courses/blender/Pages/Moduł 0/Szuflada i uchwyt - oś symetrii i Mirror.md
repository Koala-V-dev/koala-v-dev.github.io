# Szuflada i uchwyt - oś symetrii i Mirror

Otwórz `stol_v02.blend` z poprzedniej lekcji lub [stół z półką](/public/courses/blender/Resources/stol-04-polka.blend). Przez <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Save As</kbd> zapisz kopię jako `stol_v03.blend`.

## 📦 Ustaw korpus szuflady

W Object Mode dodaj kostkę przez <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Cube</kbd>. Nazwij ją `Korpus_szuflady`.

W panelu Item ustaw:

| Ustawienie | X       | Y        | Z        |
| ---------- | ------- | -------- | -------- |
| Dimensions | `0.8 m` | `0.6 m`  | `0.16 m` |
| Location   | `0 m`   | `-0.1 m` | `0.7 m`  |

Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>.

Bryła powinna znaleźć się pod blatem, pośrodku między lewymi i prawymi nogami. Ma 16 cm wysokości. Jej góra wypada na 78 cm, więc do spodu blatu zostają 4 cm.

## 🕳️ Wydrąż wnętrze

Z zaznaczonym korpusem włącz Local View przez <kbd>Numpad /</kbd>. Wejdź w Edit Mode przez <kbd>Tab</kbd> i przełącz wybór na ściany klawiszem <kbd>3</kbd> nad literami.

Odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>. Ustaw widok z góry, <kbd>Numpad 7</kbd>, i wybierz górną ścianę. Użyj poznanej przy półce pary operacji:

1. **Inset Faces**: <kbd>I</kbd>, `0.015`, <kbd>Enter</kbd>. Powstaje obwódka o szerokości 1.5 cm.
2. **Extrude Faces**: <kbd>E</kbd>, `-0.14`, <kbd>Enter</kbd>. Zaznaczony środek opada o 14 cm, tworząc wnętrze szuflady.

![Wydrążony korpus szuflady w Local View](/public/courses/blender/Images/szuflada-korpus.png)

Obróć widok i zajrzyj do środka. Obwódka Inset wyznacza grubość bocznych ścianek. Między dnem wnętrza a spodem korpusu zostały 2 cm materiału: bryła miała 16 cm wysokości, a wnętrze zagłębiliśmy na 14 cm.

## 🪵 Dodaj front

Wróć do Object Mode i wyłącz Local View. Dodaj kolejną kostkę, nazwij ją `Front_szuflady` i ustaw:

| Ustawienie | X        | Y         | Z        |
| ---------- | -------- | --------- | -------- |
| Dimensions | `0.84 m` | `0.04 m`  | `0.18 m` |
| Location   | `0 m`    | `-0.42 m` | `0.7 m`  |

Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>.

Front jest szerszy od korpusu o 2 cm z każdej strony. U góry i u dołu wystaje po 1 cm. W widoku z prawej strony, <kbd>Numpad 3</kbd>, sprawdź styk: tylna powierzchnia frontu ma dochodzić do przedniej ściany korpusu.

![Front szuflady pod blatem, przed korpusem](/public/courses/blender/Images/szuflada-front.png)

[Punkt kontrolny z korpusem i frontem](/public/courses/blender/Resources/stol-05-szuflada.blend) pozwala wrócić do tego etapu.

## 🔩 Ustaw prawe mocowanie uchwytu

Dodaj kostkę i nazwij ją `Mocowania_uchwytu`. Na razie będzie tylko jedna, po prawej stronie frontu.

| Ustawienie | X         | Y          | Z        |
| ---------- | --------- | ---------- | -------- |
| Dimensions | `0.025 m` | `0.07 m`   | `0.04 m` |
| Location   | `0.12 m`  | `-0.475 m` | `0.7 m`  |

Zastosuj Scale. Mocowanie ma przylegać do frontu i wystawać przed niego. Na nim oprze się poprzeczka uchwytu.

Żeby przybliżyć tę część, zaznacz mocowanie i dodaj front do zaznaczenia z przytrzymanym <kbd>Shift</kbd>. Włącz Local View przez <kbd>Numpad /</kbd>. W widoku zostaną oba obiekty.

![Pojedyncze mocowanie przed dodaniem odbicia](/public/courses/blender/Images/szuflada-mocowanie.png)

Po przybliżeniu kliknij samo mocowanie. _**Modyfikator dodamy do mocowania**_, front szuflady posłuży tylko do ustawienia symetrii.

## 🪞 Dodaj Mirror

Po prawej, w Properties, otwórz zakładkę z kluczem. Kliknij <kbd class="win-menu-btn">Add Modifier</kbd>, wyszukaj `Mirror` i dodaj go do zaznaczonego mocowania.

**Modyfikator** to operacja wykonywana na siatce obiektu. Jej ustawienia pozostają dostępne w panelu. Mirror oblicza odbicie siatki, dlatego możemy modelować jedno mocowanie i otrzymywać drugie o takim samym kształcie.

W *Axis* pozostaw włączone tylko *X* (1 na zrzucie poniżej). Uchwyt ma być symetryczny lewo-prawo. Wysokość obu mocowań oraz ich odległość od frontu szuflady mają pozostać takie same.

### 📍 Dlaczego nie widać drugiego mocowania

Domyślnie Mirror korzysta z punktu odniesienia własnego obiektu, czyli **origin**. W Object Mode widać go jako małą pomarańczową kropkę. W naszej kostce leży pośrodku mocowania.

Odbicie kostki względem jej środka pokrywa się z nią samą. Dlatego po dodaniu Mirror możesz nadal widzieć tylko jedno mocowanie. Potrzebujemy odbicia względem środka całego frontu.

### 🎯 Wskaż środek symetrii

W modyfikatorze znajdź *Mirror Object* (2). Kliknij pipetę obok tego pola, a potem wskaż `Front_szuflady` w Outlinerze. W polu powinna pojawić się jego nazwa.

![Mirror: 1 włączona oś X, 2 front jako obiekt wyznaczający płaszczyznę odbicia](/public/courses/blender/Images/szuflada-mirror.png)

Mirror używa teraz położenia i obrotu frontu do wyznaczenia odbicia. Front nie jest obrócony, a jego środek ma X = 0. Pionowa płaszczyzna symetrii przechodzi więc przez środek szuflady.

Źródłowe mocowanie stoi 12 cm na prawo od środka. Odbicie pojawia się 12 cm na lewo. Oba powinny przylegać do frontu na tej samej wysokości.

Jeśli mocowania nie stoją po przeciwnych stronach frontu, sprawdź włączone osie. Jeśli **_odbicie pokrywa się ze źródłem_**, sprawdź, czy Mirror Object wskazuje front szuflady, a nie samo mocowanie.

## ↔️ Zmień jedno mocowanie i sprawdź odbicie

Spójrz do Outlinera. Nadal jest tam jeden obiekt `Mocowania_uchwytu`. Lewa część jest wynikiem działania Mirror, a nie niezależną kopią utworzoną przez Shift+D.

Z zaznaczonym mocowaniem wejdź w Edit Mode i zaznacz całą siatkę przez <kbd>A</kbd>. Uruchom **Move** klawiszem <kbd>G</kbd>. Znajdziesz je też w menu <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Transform</kbd> → <kbd class="win-menu-btn">Move</kbd>.

Naciśnij <kbd>X</kbd>, wpisz `0.02` i zatwierdź <kbd>Enter</kbd>. Przesuwasz zaznaczoną siatkę mocowania o 2 cm w osi X.

Prawe mocowanie odsunie się o 2 cm od środka, a lewe odbicie odsunie się o 2 cm w przeciwną stronę. Odstęp między nimi wzrośnie łącznie o 4 cm.

Cofnij ten ruch przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> i wróć do Object Mode przez <kbd>Tab</kbd>. Mocowania mają ponownie stać po 12 cm od środka.

_**Edytujesz źródło, Mirror aktualizuje odbicie**_. Dotyczy to także zmiany kształtu. Przy dwóch niezależnych kopiach poprawkę trzeba byłoby wykonać na obu. Pozostaw Mirror w panelu, żeby zachować wspólną edycję.

## 🛠️ Połącz mocowania poprzeczką

Wyłącz Local View. Dodaj kostkę `Poprzeczka_uchwytu` i ustaw:

| Ustawienie | X        | Y         | Z         |
| ---------- | -------- | --------- | --------- |
| Dimensions | `0.26 m` | `0.025 m` | `0.025 m` |
| Location   | `0 m`    | `-0.5 m`  | `0.7 m`   |

Zastosuj Scale. Poprzeczka ma zachodzić końcami na oba mocowania. Pomiędzy nią a frontem zostaje miejsce na palce.

Zaznacz poprzeczkę, mocowania i front, dodając obiekty z przytrzymanym <kbd>Shift</kbd>. Włącz Local View, aby obejrzeć połączenia z boku i od góry.

![Uchwyt z poprzeczką i dwoma symetrycznymi mocowaniami](/public/courses/blender/Images/szuflada-uchwyt.png)

Wyłącz Local View i zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>.

![Ten sam stół po dodaniu szuflady i uchwytu](/public/courses/blender/Images/szuflada-wynik.png)

Korpus, front i uchwyt nadal są osobnymi obiektami. Szuflada nie ma jeszcze podparcia. W następnej lekcji dołożysz prowadnice i połączysz ruch jej części.

[Plik wynikowy z aktywnym Mirror](/public/courses/blender/Resources/stol-06-uchwyt.blend) pozwala porównać ustawienia odbicia i dopasowanie uchwytu.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Mirror tworzy odbicie siatki i aktualizuje je przy edycji źródła. Axis określa kierunek symetrii, a Mirror Object pozwala wyznaczyć jej położenie i orientację innym obiektem. Odbicie wokół środka własnej, symetrycznej kostki może pokrywać się ze źródłem.

Nowe działanie to przesuwanie siatki w Edit Mode:

| Skrót lub sekwencja                                                 | Działanie                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <kbd>G</kbd>, następnie <kbd>X</kbd>, <kbd>Y</kbd> lub <kbd>Z</kbd> | Rozpoczyna przesuwanie i ogranicza je do wskazanej osi. Potem wpisujesz odległość i zatwierdzasz <kbd>Enter</kbd>. </br> - <kbd>Shift</kbd> + klawisz danej osi wyklucza ją z działania np.: <kbd>Shift</kbd> + <kbd>Z</kbd>  pozwala przesunąć zaznaczenie w osiach **_X_** i **Y** bez zmiany wysokości *Z*. |

Skróty wykorzystane ponownie:

| Skrót                                                                                  | Działanie                                             |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| <kbd>N</kbd>                                                                           | Otwiera panel boczny widoku 3D z zakładką Item.       |
| <kbd>F2</kbd>                                                                          | Zmienia nazwę zaznaczonego obiektu.                   |
| <kbd>Tab</kbd>                                                                         | Przełącza Object Mode i Edit Mode.                    |
| <kbd>3</kbd> nad literami                                                              | W Edit Mode włącza wybór ścian.                       |
| <kbd>A</kbd> / <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span> | Zaznacza wszystko / odznacza wszystko.                |
| <kbd>I</kbd> / <kbd>E</kbd>                                                            | Inset Faces / Extrude Faces na zaznaczonych ścianach. |
| <kbd>Numpad /</kbd>                                                                    | Włącza lub wyłącza Local View.                        |
| <kbd>Numpad 3</kbd> / <kbd>Numpad 7</kbd>                                              | Widok z prawej strony / z góry.                       |
| <kbd>Shift</kbd> + kliknięcie                                                          | Dodaje obiekt do zaznaczenia w widoku 3D.             |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>               | Cofa zmianę, np. próbne rozsunięcie mocowań.          |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>               | Zapisuje projekt.                                     |
