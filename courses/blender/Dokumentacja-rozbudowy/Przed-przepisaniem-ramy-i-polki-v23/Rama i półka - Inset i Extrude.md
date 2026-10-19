# Rama i półka - Inset i Extrude

Pod blatem dołożymy dwie poprzeczki, a na nich półkę z płytkim zagłębieniem na narzędzia. Poprzeczki powstaną tak jak nogi. Zagłębienie zrobimy już przez zmianę siatki: wydzielimy obwódkę i opuścimy środek powierzchni.

Otwórz swój `stol_v01.blend` z poprzedniej lekcji lub [jej plik wynikowy](/public/courses/blender/Resources/stol-02-wynik.blend). Zapisz dalszą pracę jako `stol_v02.blend`.

## 🪵 Połącz nogi poprzeczkami

W Object Mode dodaj kostkę przez Add → Mesh → Cube i nazwij ją `Poprzeczka_P`. Panel Item otwierasz klawiszem <kbd>N</kbd>, a skalę stosujesz przez Object → Apply → Scale, tak jak przy nogach. W Item ustaw Dimensions `(0.1, 0.62, 0.08) m` (2 na zrzucie) oraz Location `(0.86, 0, 0.22) m` (1). Zastosuj Scale. Poprzeczka biegnie między przednią i tylną nogą po prawej stronie stołu.

![Poprzeczka między nogami: 1 jej położenie, 2 wymiary](/public/courses/blender/Images/polka-poprzeczka.png)

Powiel ją przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, <kbd>X</kbd>, `-1.72`, <kbd>Enter</kbd>. Kopię nazwij `Poprzeczka_L`. Z przodu obie poprzeczki mają być na jednej wysokości, a z boku ich końce powinny dochodzić do nóg.

![Dwie poprzeczki przy dolnych częściach nóg](/public/courses/blender/Images/polka-rama.png)

Gdy potrzebujesz wrócić do tego miejsca, otwórz [stół z poprzeczkami](/public/courses/blender/Resources/stol-03-rama.blend).

## 🧱 Połóż na nich półkę

Dodaj kolejną kostkę o nazwie `Polka`. Ustaw Dimensions `(1.72, 0.62, 0.04) m` i Location `(0, 0, 0.28) m`, następnie zastosuj Scale. Spód półki jest na wysokości 26 cm, równo z górną powierzchnią poprzeczek. Jej końce zachodzą na poprzeczki po 5 cm. Sprawdź to z przodu i z boku: półka ma opierać się na belkach. Dopasowanie części jest ważniejsze niż samo przepisanie współrzędnych.

Blat zasłania półkę od góry. Z zaznaczoną półką użyj View → Local View → Toggle Local View lub <kbd>Numpad /</kbd>. Pozostałe obiekty znikną z tego widoku, ale pozostają w scenie. Tym samym poleceniem wrócisz do całego stołu.

## 🟧 Wybierz górną ścianę

Wejdź w Edit Mode przez <kbd>Tab</kbd>, a klawiszem <kbd>3</kbd> nad literami włącz wybór ścian (1 na zrzucie). Odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>, ustaw widok z góry i kliknij środek półki. Zaznaczona ma być tylko górna ściana (2). Obróć widok, żeby zobaczyć jej grubość.

![Półka w Local View: 1 tryb zaznaczania ścian, 2 wybrana górna powierzchnia](/public/courses/blender/Images/polka-sciana.png)

## 🔲 Wydziel obwódkę przez Inset

Z kursorem nad widokiem 3D wybierz Face → **Inset Faces** lub naciśnij <kbd>I</kbd>, wpisz `0.02` i zatwierdź klawiszem <kbd>Enter</kbd>. Inset Faces tworzy nową pętlę krawędzi 2 cm od brzegu, a pomiędzy nią i starym obrysem powstają ściany obwódki. Środkowa ściana pozostaje zaznaczona.

![Po Inset: 1 obwódka, 2 zaznaczona ściana środkowa](/public/courses/blender/Images/polka-inset.png)

To nie jest pomniejszenie całej półki. Zewnętrzne wymiary pozostały takie same; przybyła geometria, która pozwoli zmienić sam środek. Gdybyś użył <kbd>S</kbd> na górnej ścianie kostki, pochyliłbyś jej boczne ściany zamiast utworzyć taką obwódkę.

## ⬇️ Opuść środek przez Extrude

Przy zaznaczonej środkowej ścianie wybierz Face → Extrude Faces lub naciśnij <kbd>E</kbd>, wpisz `-0.015` i zatwierdź klawiszem <kbd>Enter</kbd>. Extrude Region tworzy nowe ściany łączące stare położenie obrysu z nowym. Ruch zaczyna się prostopadle do zaznaczonej powierzchni; tutaj wartość ujemna opuszcza ją o 1.5 cm.

![Po Extrude: 1 wewnętrzna ścianka, 2 opuszczone dno zagłębienia](/public/courses/blender/Images/polka-extrude.png)

Samo <kbd>G</kbd> przesunęłoby dotychczasową ścianę i rozciągnęło jej sąsiadów. Ekstruzja zostawia górną obwódkę na miejscu i dodaje pionowe ścianki zagłębienia. Obejrzyj krawędź wskazaną numerem 1 oraz jej zbliżenia po prawej: przed opuszczeniem ściany i po nim.

Jeśli anulujesz ruch po <kbd>E</kbd> przez <kbd>Esc</kbd>, nowa geometria może pozostać w starym miejscu. Nieudane wytłoczenie cofnij przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>, zanim wykonasz je ponownie.

## 🛠️ Wróć do całego stołu

Przejdź do Object Mode i wyłącz Local View. Z boku sprawdź położenie półki na poprzeczkach. Jej zagłębienie ma pozostać wewnątrz grubości: spód jest płaski, a dno wgłębienia leży 2.5 cm nad nim.

![Stół po dodaniu poprzeczek i półki](/public/courses/blender/Images/polka-wynik.png)

Zapisz projekt. [Plik wynikowy](/public/courses/blender/Resources/stol-04-polka.blend) zawiera ten sam blat i nogi oraz trzy dodane części. Inset i Extrude wykorzystamy ponownie przy wnękach, uchwytach i obudowach, gdzie zmiana całej bryły przez Scale już nie wystarcza.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Inset wydziela obwódkę, zachowując zewnętrzny obrys. Extrude dodaje ściany między starym i nowym położeniem zaznaczenia. Dobieraj głębokość wnęki do grubości bryły, żeby dno nie przeszło przez spód.
