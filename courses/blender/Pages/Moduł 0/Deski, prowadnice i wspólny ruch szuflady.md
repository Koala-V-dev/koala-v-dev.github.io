# Deski, prowadnice i wspólny ruch szuflady

Otwórz `stol_v03.blend` lub [stół z szufladą i uchwytem](/public/courses/blender/Resources/stol-06-uchwyt.blend). Przez <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Save As</kbd> zapisz kopię jako `stol_v04.blend`.

## 🪵 Zastąp płytę blatu deskami

W Object Mode wybierz w Outlinerze sam `Blat`. Usuń go przez <kbd>X</kbd> i potwierdź Delete. Nogi, półka i szuflada pozostają na miejscu.

Dodaj kostkę przez <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Cube</kbd>. Nazwij ją `Deska_blatu_01`. W panelu Item ustaw:

| Ustawienie | X     | Y          | Z        |
| ---------- | ----- | ---------- | -------- |
| Dimensions | `2 m` | `0.196 m`  | `0.08 m` |
| Location   | `0 m` | `-0.402 m` | `0.86 m` |

Deska biegnie przez całą szerokość stołu. Ma tę samą grubość i wysokość co usunięty blat. Zastosuj <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Apply</kbd> → <kbd class="win-menu-btn">Scale</kbd>.

Zetnij jej krawędzie tak jak w pierwszej lekcji: <kbd>Tab</kbd>, wybór krawędzi <kbd>2</kbd>, zaznaczenie całości <kbd>A</kbd>. Uruchom Bevel przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>, wpisz `0.005` i zatwierdź <kbd>Enter</kbd>. Przez <kbd>F9</kbd> ustaw *Segments* na `2`. Wróć do Object Mode.

### ↔️ Powtórz deskę ze stałym odstępem

Powiel ją przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>Y</kbd>, `0.201`, <kbd>Enter</kbd>.

Deska ma 19.6 cm szerokości, a kopię przesunąłeś o 20.1 cm. Różnica daje **5 mm szczeliny** między nimi.

Od razu, z kursorem nadal w widoku 3D, naciśnij trzy razy <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>R</kbd></span>. To **Repeat Last**, dostępne też w menu <kbd class="win-menu-btn">Edit</kbd> → <kbd class="win-menu-btn">Repeat Last</kbd>. Każde naciśnięcie ponawia utworzenie kopii i przesunięcie jej o ten sam odcinek.

Nie zmieniaj nazw między powieleniem a Repeat Last. Blender powtarza ostatnią operację, więc inna czynność może zastąpić zapamiętane powielenie.

![Pięć desek zamiast jednolitej płyty blatu](/public/courses/blender/Images/ruch-deski.png)

W widoku z góry powinieneś zobaczyć pięć desek z równymi szczelinami. Razem zajmują tyle miejsca co poprzedni blat. Pierwsza ma pozostać nazwana _**`Deska_blatu_01`**_. Użyjemy jej jako odniesienia dla Mirror.

## 🧱 Zamocuj wsporniki pod blatem

Dodaj kostkę `Wsporniki_prowadnic` i ustaw:

| Ustawienie | X         | Y         | Z        |
| ---------- | --------- | --------- | -------- |
| Dimensions | `0.04 m`  | `0.60 m`  | `0.20 m` |
| Location   | `0.435 m` | `-0.09 m` | `0.72 m` |

Zastosuj Scale. Powstała pionowa deska po prawej stronie szuflady. Górą dochodzi do spodu blatu. Między nią a korpusem zostaje 1.5 cm miejsca na prowadnicę i ruchomą listwę.

W zakładce z kluczem dodaj Mirror. Pozostaw tylko *Axis X*, a w *Mirror Object* wskaż _**`Deska_blatu_01`**_.

Środek tej deski leży przy X = 0, więc odbicie wspornika powstaje po drugiej stronie szuflady. Jej przesunięcie wzdłuż Y nie przeszkadza: potrzebujemy pionowej płaszczyzny przechodzącej przez środek stołu w osi X.

Zaznacz wsporniki, korpus i front. Włącz Local View przez <kbd>Numpad /</kbd> i obejrzyj odstępy po obu stronach szuflady.

![Wsporniki po obu stronach korpusu, z pozostawionym miejscem na prowadnice](/public/courses/blender/Images/ruch-wsporniki.png)

## 🛤️ Zbuduj nieruchome prowadnice

Wyłącz Local View. Prowadnica będzie miała przekrój litery L. Pionowy bok przylega do wspornika, a pozioma półka wchodzi pod dno szuflady.

Dodaj dwie kostki i ustaw je według tabeli.

| Obiekt                  | Ustawienie | X         | Y         | Z         |
| ----------------------- | ---------- | --------- | --------- | --------- |
| **`Boki_prowadnic`**    | Dimensions | `0.01 m`  | `0.58 m`  | `0.08 m`  |
| **`Boki_prowadnic`**    | Location   | `0.410 m` | `-0.10 m` | `0.65 m`  |
| **_`Polki_prowadnic`_** | Dimensions | `0.03 m`  | `0.58 m`  | `0.01 m`  |
| **_`Polki_prowadnic`_** | Location   | `0.400 m` | `-0.10 m` | `0.615 m` |

Na każdej zastosuj Scale i dodaj Mirror: tylko *Axis X*, *Mirror Object* = _**`Deska_blatu_01`**_. Po lewej stronie mają powstać odbicia obu części prowadnicy.

Zaznacz wsporniki i prowadnice, po czym włącz Local View. Na zbliżeniu rozpoznaj trzy części:

1. Wspornik podwieszony pod blatem.
2. Pionowy bok prowadnicy.
3. Poziomą półkę podtrzymującą szufladę.

![Nieruchome prowadnice z widocznym przekrojem L i podparciem](/public/courses/blender/Images/ruch-prowadnice.png)

Górna powierzchnia poziomej półki znajduje się na wysokości 62 cm. To wysokość spodu korpusu szuflady. Dzięki temu korpus ma na czym się oprzeć. _**Wsporniki i prowadnice pozostaną przy stole**_, gdy szuflada się wysunie.

## ↔️ Dodaj listwy do boków szuflady

Między bokiem korpusu a wspornikiem zostawiliśmy 1.5 cm miejsca. Nieruchomy bok prowadnicy zajmuje 1 cm. W pozostałych 5 mm umieścimy **listwę poruszającą się z szufladą**.

Wyłącz Local View i dodaj kostkę `Listwy_szuflady`. W panelu Item ustaw:

| Ustawienie | X | Y | Z |
| --- | --- | --- | --- |
| Dimensions | `0.005 m` | `0.58 m` | `0.05 m` |
| Location | `0.4025 m` | `-0.10 m` | `0.65 m` |

Listwa ma **5 mm grubości**, 58 cm długości i 5 cm wysokości. Biegnie wzdłuż dolnej części boku korpusu. Jej wewnętrzna powierzchnia styka się z korpusem, a zewnętrzna z pionowym bokiem prowadnicy.

Zastosuj Scale i dodaj Mirror z osią X. W *Mirror Object* wskaż `Korpus_szuflady`, żeby druga listwa powstała po przeciwnej stronie korpusu.

Zaznacz korpus, listwy, wsporniki i obie części prowadnic. Włącz Local View. Na zrzucie szerokie płyty wystające ponad korpus to nadal _**nieruchome wsporniki**_. Dodane listwy są cienkimi pasami przy bokach korpusu, poniżej jego górnej krawędzi.

![Szuflada w prowadnicach. Szerokie zewnętrzne płyty to wsporniki, a cienkie listwy przylegają do boków korpusu](/public/courses/blender/Images/ruch-listwy.png)

### 🔎 Sprawdź, co znajduje się pomiędzy częściami

Poniższy przekrój pokazuje prawą stronę tego samego modelu. Patrzymy od przodu, wzdłuż kierunku wysuwania. Numery 1, 2 i 3 oznaczają te same nieruchome części co na wcześniejszym zbliżeniu prowadnicy.

![Przekrój prawego boku: listwa 4 o grubości 5 mm mieści się między korpusem 5 a nieruchomym bokiem prowadnicy 2. Półka 3 podpiera dno, a wspornik 1 łączy prowadnicę ze stołem](/public/courses/blender/Images/ruch-listwa-przekroj.svg)

Prześledź układ od wnętrza szuflady na zewnątrz: korpus **5**, listwa **4**, bok prowadnicy **2**, wspornik **1**. Poniżej znajduje się pozioma półka **3**, na której opiera się dno korpusu.

Korpus i listwa mają wysuwać się razem. Szare elementy pozostają przy stole. Wskazanie korpusu w Mirror Object ustawia tylko odniesienie odbicia. Żeby cały obiekt listew podążał za korpusem, dodamy go za chwilę do jego dzieci.

## 🔗 Połącz ruch części przez parenting

Szuflada składa się z kilku obiektów. Gdy przesuniesz sam korpus, pozostałe części nie muszą za nim podążyć. **Parenting** tworzy relację rodzic-dziecko: dzieci przejmują ruch, obrót i skalowanie rodzica. Te zmiany położenia, obrotu i skali nazywamy transformacjami.

Rodzicem będzie `Korpus_szuflady`. Jego dziećmi mają zostać front, mocowania uchwytu, poprzeczka uchwytu i listwy boczne. Prowadnice oraz wsporniki muszą pozostać poza tą grupą.

### 🎯 Wybierz dzieci, a rodzica na końcu

Wyłącz Local View. Z kursorem w widoku 3D odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>.

Teraz w Outlinerze kliknij `Front_szuflady`. Przytrzymując <kbd>Ctrl</kbd>, dodaj do zaznaczenia:

- `Mocowania_uchwytu`.
- `Poprzeczka_uchwytu`.
- `Listwy_szuflady`.

Na końcu, nadal z <kbd>Ctrl</kbd>, kliknij `Korpus_szuflady`. To on ma być **obiektem aktywnym**, czyli wskazanym jako ostatni. W tej operacji kolejność decyduje, kto zostanie rodzicem.

> [!TIP]
> W widoku 3D dodawałeś obiekty do zaznaczenia z Shift. Tutaj wybierasz nazwy w Outlinerze i używasz Ctrl, aby dodawać pojedyncze pozycje.

### 🔗 Utwórz zależność bez przesuwania części

Przenieś kursor myszki do widoku 3D. Naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> i wybierz <kbd class="win-menu-btn">Object (Keep Transform)</kbd>. To samo polecenie znajdziesz w <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Parent</kbd>.

**Keep Transform** zachowuje obecne położenie, obrót i skalę części przy tworzeniu zależności. Po zatwierdzeniu front i uchwyt mają pozostać na swoich miejscach.

![Hierarchia szuflady: korpus jest rodzicem czterech obiektów](/public/courses/blender/Images/ruch-parent.png)

W Outlinerze rozwiń strzałkę przy `Korpus_szuflady`. Cztery obiekty powinny znajdować się pod nim, z wcięciem jak na zrzucie. Rozwijane wpisy siatek i modyfikatorów mogą być widoczne dodatkowo. Wsporniki i prowadnice nie mogą należeć do tej gałęzi.

Siatki nadal pozostają osobne. Możesz edytować sam front albo poprzeczkę uchwytu. Przesunięcie dziecka nie przesuwa rodzica ani pozostałych dzieci.

## 🧰 Wysuń szufladę

Odznacz wszystko i wybierz tylko `Korpus_szuflady`. Przenieś kursor nad widok 3D i wykonaj <kbd>G</kbd>, <kbd>Y</kbd>, `-0.25`, <kbd>Enter</kbd>.

Korpus wysunie się o 25 cm w stronę użytkownika stołu. Front, uchwyt i listwy mają podążyć za nim. Wsporniki i prowadnice zostają na miejscu.

![Stół z częściowo wysuniętą szufladą. Zaznaczony jest tylko korpus, a front i uchwyt podążają za nim dzięki parentingowi.](/public/courses/blender/Images/ruch-wynik.png)

Obróć widok i zajrzyj pod blat. Po wysunięciu tył korpusu nadal opiera się na prowadnicach. W rzeczywistym stole takie podparcie utrzymuje szufladę. Zbyt duży wysuw pozbawiłby ją oparcia.

**Odwzorowujemy rzeczywistość, ale nie symulujemy jeszcze fizyki.** Blender nadal pozwala przesunąć szufladę w dowolnej osi i przenikać nią przez inne obiekty. Parenting sprawia tylko, że jej części poruszają się razem. To wymodelowane podparcie, miejsce na ruch i dopasowanie części sprawiają, że konstrukcja wygląda wiarygodnie.

Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. Żeby zamknąć szufladę, przesuń sam korpus przez <kbd>G</kbd>, <kbd>Y</kbd>, `0.25`, <kbd>Enter</kbd>.

Do porównania masz [punkt kontrolny z zamkniętą szufladą](/public/courses/blender/Resources/stol-07-prowadnice.blend) i [wynik z wysuniętą szufladą](/public/courses/blender/Resources/stol-08-szuflada-otwarta.blend).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Repeat Last ponawia ostatnią operację, np. powielenie z przesunięciem. Parenting wiąże transformacje osobnych obiektów. Przy jego ustawianiu najpierw wybierasz dzieci, a rodzica jako ostatni obiekt. Keep Transform zachowuje ich bieżące ustawienie.

Nowe skróty:

| Skrót                                                                     | Działanie                                                                                    |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>R</kbd></span> | Repeat Last: ponawia ostatnią operację.                                                      |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span>  | Otwiera menu ustawienia rodzica w widoku 3D. W tej lekcji wybierasz Object (Keep Transform). |
| <kbd>Ctrl</kbd> + kliknięcie w Outlinerze                                 | Dodaje lub usuwa pojedynczą pozycję z zaznaczenia.                                           |

Skróty wykorzystane ponownie:

| Skrót lub sekwencja                                                                                                                                 | Działanie                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| <kbd>X</kbd> w Object Mode                                                                                                                          | Otwiera usunięcie zaznaczonego obiektu.                                                  |
| <kbd>N</kbd>                                                                                                                                        | Otwiera panel boczny z zakładką Item.                                                    |
| <kbd>Tab</kbd>                                                                                                                                      | Przełącza Object Mode i Edit Mode.                                                       |
| <kbd>2</kbd>, następnie <kbd>A</kbd> w Edit Mode                                                                                                    | Włącza wybór krawędzi i zaznacza całą siatkę.                                            |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>                                                                            | Bevel zaznaczonych krawędzi w Edit Mode.                                                 |
| <kbd>F9</kbd>                                                                                                                                       | Ustawienia ostatniej operacji.                                                           |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>Y</kbd>                                                   | Powiela zaznaczenie i ogranicza ruch kopii do osi Y.                                     |
| <kbd>Numpad /</kbd> / <kbd>Numpad 7</kbd>                                                                                                           | Local View / widok z góry.                                                               |
| <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>                                                                             | Odznacza wszystko.                                                                       |
| <kbd>G</kbd>, następnie <kbd>Y</kbd>                                                                                                                | Przesuwa zaznaczenie w osi Y. Potem wpisujesz odległość i zatwierdzasz <kbd>Enter</kbd>. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> / <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span> | Cofnięcie operacji / zapis projektu.                                                     |
