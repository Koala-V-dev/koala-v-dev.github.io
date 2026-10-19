# Rama i półka - Inset i Extrude

Otwórz swój `stol_v01.blend` z poprzedniej lekcji lub [stół po fazowaniu blatu](/public/courses/blender/Resources/stol-02-wynik.blend). Przez <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Save As</kbd> zapisz kopię jako `stol_v02.blend`.

## 🪵 Połącz nogi poprzeczkami

W Object Mode dodaj kostkę przez <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Cube</kbd>. Nazwij ją `Poprzeczka_P`.

Otwórz panel Item klawiszem <kbd>N</kbd>. Ustaw wymiary i położenie:

| Ustawienie                | X        | Y        | Z        |
| ------------------------- | -------- | -------- | -------- |
| Dimensions (2 na zrzucie) | `0.1 m`  | `0.62 m` | `0.08 m` |
| Location (1)              | `0.86 m` | `0 m`    | `0.22 m` |

Powstaje belka łącząca przednią i tylną nogę po prawej stronie stołu. Jej końce mają dochodzić do wewnętrznych powierzchni nóg. Sprawdź połączenie w widoku z prawej strony, <kbd>Numpad 3</kbd>.

![Poprzeczka między nogami: 1 jej położenie, 2 wymiary](/public/courses/blender/Images/polka-poprzeczka.png)

Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>, tak jak przy nogach.

Powiel zaznaczoną poprzeczkę przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>X</kbd>, `-1.72`, <kbd>Enter</kbd>. To takie samo przesunięcie na drugą stronę stołu jak w poprzedniej lekcji. Kopię nazwij `Poprzeczka_L`.

![Dwie poprzeczki przy dolnych częściach nóg](/public/courses/blender/Images/polka-rama.png)

Spójrz od przodu przez <kbd>Numpad 1</kbd>. Poprzeczki powinny być na tej samej wysokości. Będą podtrzymywać półkę, dlatego ich górne powierzchnie muszą leżeć równo.

[Punkt kontrolny z poprzeczkami](/public/courses/blender/Resources/stol-03-rama.blend) pozwala rozpocząć od tego miejsca.

## 🧱 Oprzyj półkę na poprzeczkach

Dodaj kolejną kostkę i nazwij ją `Polka`. W Item ustaw:

| Ustawienie | X        | Y        | Z        |
| ---------- | -------- | -------- | -------- |
| Dimensions | `1.72 m` | `0.62 m` | `0.04 m` |
| Location   | `0 m`    | `0 m`    | `0.28 m` |

Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>.

Półka ma 4 cm grubości. Jej środek jest na wysokości 28 cm, więc spód wypada na 26 cm. Na tej samej wysokości znajduje się góra poprzeczek. W widoku od przodu sprawdź, czy półka leży na belkach. Każdy jej koniec opiera się na poprzeczce na szerokości 5 cm.

## 🔎 Odsłoń górną powierzchnię półki

Blat zasłania półkę od góry. Zaznacz samą `Polka` i w widoku 3D naciśnij <kbd>Numpad /</kbd>. To **Local View**, czyli widok ograniczony do zaznaczonych obiektów.

Pozostałe części stołu znikną z widoku. Nie zostały usunięte. Tym samym skrótem przywrócisz widok całej sceny.

> [!TIP]
> Bez klawiatury numerycznej wybierz <kbd class="win-menu-btn">View</kbd> → <kbd class="win-menu-btn">Local View</kbd> → <kbd class="win-menu-btn">Toggle Local View</kbd>.

Wejdź w Edit Mode przez <kbd>Tab</kbd>. Naciśnij <kbd>3</kbd> nad literami, aby wybierać ściany (1 na zrzucie). Odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>.

Ustaw widok z góry, <kbd>Numpad 7</kbd>, i kliknij górną ścianę półki. Tylko ona ma być zaznaczona. Obróć widok środkowym przyciskiem myszy, żeby zobaczyć również bok płyty.

![Półka w Local View: 1 tryb zaznaczania ścian, 2 wybrana górna powierzchnia](/public/courses/blender/Images/polka-sciana.png)

## 🔲 Wydziel miejsce na zagłębienie

Górna powierzchnia jest teraz jedną ścianą. Żeby zrobić zagłębienie otoczone płaskim brzegiem, trzeba najpierw oddzielić ten brzeg od środka.

Z kursorem myszki w widoku 3D naciśnij <kbd>I</kbd>, wpisz `0.02` i zatwierdź <kbd>Enter</kbd>. Ta operacja to **Inset Faces**. Znajdziesz ją również w menu <kbd class="win-menu-btn">Face</kbd> → <kbd class="win-menu-btn">Inset Faces</kbd>.

Na powierzchni pojawi się wewnętrzny obrys odsunięty o 2 cm od brzegów. Między nim a zewnętrzną krawędzią powstaną cztery ściany obwódki (1). Duża ściana pośrodku pozostanie zaznaczona (2).

![Po Inset: 1 obwódka, 2 zaznaczona ściana środkowa](/public/courses/blender/Images/polka-inset.png)

_**Rozmiar półki się nie zmienił**_. Inset dodał podziały na jej górnej powierzchni. Dzięki temu możesz zmienić sam środek, pozostawiając zewnętrzny brzeg na miejscu.

Skalowanie górnej ściany przez <kbd>S</kbd> dałoby inny wynik. Przesunęłoby jej dotychczasowe narożniki do środka i pochyliło boczne ściany płyty. Nie utworzyłoby dodatkowej obwódki.

## ⬇️ Wytłocz zagłębienie

Pozostaw zaznaczoną środkową ścianę. Naciśnij <kbd>E</kbd>, wpisz `-0.015` i zatwierdź <kbd>Enter</kbd>. **Extrude Faces** znajdziesz też w menu <kbd class="win-menu-btn">Face</kbd> → <kbd class="win-menu-btn">Extrude Faces</kbd>.

Środek opadnie o 1.5 cm. Wzdłuż jego obrysu powstaną nowe, pionowe ścianki. Łączą górną obwódkę z dnem zagłębienia.

![Po Extrude: 1 wewnętrzna ścianka, 2 opuszczone dno zagłębienia](/public/courses/blender/Images/polka-extrude.png)

Spójrz na zbliżenia po prawej. Po Inset środek i obwódka leżały na jednej wysokości. Po Extrude oddziela je pionowy stopień wskazany numerem 1. Ściana zaznaczona numerem 2 stała się dnem wnęki.

Dlaczego wartość jest ujemna? Przy wytłaczaniu tej ściany Blender domyślnie prowadzi ruch w górę, prostopadle do jej powierzchni. Wartość dodatnia utworzyłaby podwyższenie. Ujemna cofa ścianę w głąb półki.

_**Extrude dodaje ściany, Move je przesuwa**_. Gdybyś zamiast wytłaczania przesunął środek w dół przez <kbd>G</kbd>, obwódka pochyliłaby się razem z nim. Extrude zachowuje górny brzeg i dodaje ścianki zagłębienia.

> [!IMPORTANT]
> Po uruchomieniu Extrude klawisz <kbd>Esc</kbd> anuluje samo przesuwanie. **_Nowe ściany mogą pozostać_** w miejscu poprzednich. Jeśli chcesz wycofać całe wytłoczenie, użyj <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>, zanim spróbujesz ponownie. (By ponowić cofnięto operację użyj <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></span>)

## 🛠️ Sprawdź dno i podparcie

Obróć półkę i obejrzyj ją od spodu. Spód powinien pozostać płaski. Płyta miała 4 cm grubości, a zagłębienie ma 1.5 cm głębokości. Pod jego dnem zostało więc 2.5 cm materiału.

Wróć do Object Mode przez <kbd>Tab</kbd>, a następnie wyłącz Local View przez <kbd>Numpad /</kbd> lub <kbd class="win-menu-btn">View</kbd> → <kbd class="win-menu-btn">Local View</kbd> → <kbd class="win-menu-btn">Toggle Local View</kbd>.

![Stół po dodaniu poprzeczek i półki](/public/courses/blender/Images/polka-wynik.png)

Sprawdź półkę od przodu i z boku. Ma nadal opierać się na obu poprzeczkach. Wnęka zmieniła jej górną powierzchnię, a nie położenie całej półki.

Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. [Plik wynikowy z półką](/public/courses/blender/Resources/stol-04-polka.blend) służy do porównania ułożenia części i kształtu wnęki.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Inset wydziela środek powierzchni i otaczającą go obwódkę. Extrude pozwala zmienić głębokość tego środka, dodając ścianki. Tą samą parą operacji możesz budować wnęki w obudowie lub podwyższone panele. O tym, czy powstanie zagłębienie, czy wypukłość, decyduje kierunek wytłaczania.

Nowe skróty z tej lekcji:

| Skrót | Działanie |
| --- | --- |
| <kbd>I</kbd> | Inset Faces: tworzy obwódkę wewnątrz zaznaczonej ściany w Edit Mode. |
| <kbd>E</kbd> | Extrude Faces: wytłacza zaznaczoną ścianę, dodając łączące ścianki. |
| <kbd>Numpad /</kbd> | Włącza lub wyłącza Local View, czyli izoluje zaznaczone obiekty. |

Przy wytłaczaniu <kbd>Esc</kbd> anuluje ruch, ale może pozostawić nową geometrię. Do wycofania całego Extrude użyj <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>.

Skróty powtarzane przy budowie półki:

| Skrót | Działanie |
| --- | --- |
| <kbd>N</kbd> | Panel boczny widoku 3D z wymiarami i położeniem. |
| <kbd>Tab</kbd>, następnie <kbd>3</kbd> | Wejście w Edit Mode, następnie wybór ścian. |
| <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span> | Odznacza wszystko. |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>X</kbd> | Powiela zaznaczenie i ogranicza ruch kopii do osi X. |
| <kbd>Numpad 1</kbd>, <kbd>Numpad 3</kbd>, <kbd>Numpad 7</kbd> | Widok od przodu, z prawej strony i z góry. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> | Cofa całą operację, także nieudane wytłoczenie. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span> | Zapisuje projekt. |
