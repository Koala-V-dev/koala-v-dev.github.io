# Samodzielny stół - pierwsza kontrola jakości

Umiesz już ustawić wymiary deski i wyznaczyć jej środek. Teraz zbudujesz stół: blat i cztery nogi. Będzie prosty, bez materiałów, szuflad i zaokrągleń. W tej próbie oceniasz kontrolę wymiarów i części, nie atrakcyjność renderu.

## 📋 Odczytaj brief

Stół ma mieć 2 m szerokości, 1 m głębokości i 0.9 m wysokości. Blat ma grubość 0.08 m. Cztery nogi mają przekrój 0.1 × 0.1 m, stoją na podłożu Z=0 i dochodzą do spodu blatu. Ich środki są odsunięte od środka stołu o 0.86 m w X oraz 0.36 m w Y.

![Prosty stół z pięciu obiektów: widok, lista części i wymiary blatu](/public/courses/blender/Images/m00-table.png)

Ilustracja jest punktem kontrolnym. Twoja kamera robocza może być ustawiona inaczej. Nie dodawaj na razie detalu, który utrudni sprawdzenie wymiarów.

## 🧱 Przygotuj blat

Zacznij od nowej sceny i ustaw Metric, Unit Scale 1, jak przy półce. Możesz też otworzyć [plik startowy](/public/courses/blender/Resources/m00-01-start.blend). Pozostaw kamerę i światło, jeśli pracujesz na scenie General; nie przeszkadzają w modelowaniu i nie musisz ich teraz usuwać.

Wybierz sześcian, nazwij go `Blat` i ustaw Dimensions na (2,1,0.08) m. Sam oblicz Location Z: górna powierzchnia ma być na 0.9 m. Zastosuj Scale i sprawdź, czy po operacji wymiary pozostały takie same.

<details>
<summary>Sprawdź położenie blatu</summary>

Połowa grubości wynosi 0.04 m. Środek blatu ma być na 0.9-0.04=0.86 m. Jego dolna powierzchnia leży na 0.82 m. Location X i Y ustaw na 0.

</details>

## 🦵 Dodaj pierwszą nogę

W Object Mode wybierz **Add → Mesh → Cube**. Możesz też użyć <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> i wybrać Mesh → Cube. Dodanie w Edit Mode dopisałoby siatkę do bieżącego obiektu, dlatego przed operacją sprawdź tryb.

Nowy sześcian może zasłonić sporą część stołu. To stan pośredni. Otwórz Item i ustaw wymiary nogi, zanim ocenisz wygląd całej sceny.

Wysokość nogi ma być równa wysokości spodu blatu: 0.82 m. Ustaw Dimensions na (0.1,0.1,0.82) m, Location na (0.86,-0.36,0.41) m i nazwij obiekt `Noga_PP`. Zastosuj Scale. Dolna powierzchnia nogi trafia na 0, górna na 0.82 m.

## 🔁 Powiel i ustaw pozostałe nogi

Zaznacz nogę. W Object Mode użyj **Object → Duplicate Objects** lub <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>. Po skrócie Blender rozpoczyna przesuwanie kopii. Naciśnij <kbd>Esc</kbd>, aby anulować ten ruch; sama kopia pozostaje utworzona. Teraz ustaw dokładne Location w Item.

To ważne rozróżnienie: Esc anuluje rozpoczęty ruch, a niekoniecznie wcześniejsze utworzenie kopii. Po operacji sprawdź Outliner, zamiast ponownie duplikować w ciemno.

| Nazwa | Location X | Location Y | Location Z |
| --- | --- | --- | --- |
| Noga_PP | 0.86 | -0.36 | 0.41 |
| Noga_LP | -0.86 | -0.36 | 0.41 |
| Noga_PT | 0.86 | 0.36 | 0.41 |
| Noga_LT | -0.86 | 0.36 | 0.41 |

Powielaj jedną nogę na raz i od razu nadaj jej nazwę. W tej wersji używamy zwykłych kopii. Współdzielenie danych oraz symetrię poznasz, gdy będziesz umiał samodzielnie ocenić ten prostszy wynik.

## 🔎 Sprawdź stół z trzech stron

Z przodu powinieneś widzieć dwie pary nóg nakładających się w tym rzucie. Z góry sprawdzisz odsunięcie nóg od brzegów, a w perspektywie rozpoznasz wszystkie cztery. Jeżeli noga zniknęła, najpierw wybierz jej nazwę w Outlinerze i użyj Frame Selected.

Odczytaj wartości każdej części. W tej wersji jest pięć obiektów mesh, każdy z ośmioma wierzchołkami i sześcioma ścianami. Nie łączymy ich jeszcze przez Join. Stykanie osobnych części nie wymaga automatycznego zespawania całego stołu.

Zapisz `stol_v01.blend`, ponownie otwórz i sprawdź nazwy oraz położenia. [Plik kontrolny](/public/courses/blender/Resources/m00-06-stol-wynik.blend) służy do porównania po własnej próbie. Nie ma testowej tekstury z ćwiczenia o pakowaniu.

## 🧪 Drugi brief bez gotowej tabeli

Zrób kopię projektu jako `stol_v02.blend`. Nowy stół ma szerokość 1.4 m, głębokość 0.7 m i wysokość 0.75 m. Blat pozostaje gruby na 0.08 m. Nogi nadal mają przekrój 0.1 m, a ich zewnętrzna powierzchnia ma być odsunięta od brzegu blatu o 0.05 m.

Sam oblicz wysokość nóg, ich środki i położenie blatu. Zapisz wynik. Dopuszczalne są inne nazwy, ale musisz wskazać każdą część i uzasadnić jej pozycję.

<details>
<summary>Porównaj obliczenia</summary>

Blat: Dimensions (1.4,0.7,0.08), Location Z=0.71. Spód blatu leży na 0.67 m, więc nogi mają wysokość 0.67 m i środek Z=0.335. Środki nóg w X są na ±0.60, a w Y na ±0.25: od połowy wymiaru blatu odejmujesz 0.05 m odstępu i 0.05 m połowy nogi. Nogi stoją na Z=0. Jeśli podwójnie odjąłeś odstęp, będą niepotrzebnie blisko środka.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przekładasz wymiary całego przedmiotu na wymiary i położenie części.
- Duplikujesz świadomie i sprawdzasz, czy kopia powstała.
- Prostą bryłę uznajesz za ukończoną po kontroli briefu i ponownym otwarciu, zanim dodasz detal.
