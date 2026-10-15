# Modelowanie z blueprintu – Dodge Challenger 1970 (Kolekcje, rzuty i montaż)

Tworzenie pojazdów i zaawansowanych assetów mechanicznych w branży gier wymaga rygorystycznej precyzji geometrycznej. Nie da się zbudować ikonicznego samochodu „na oko” – standardem produkcyjnym jest praca na **wielorzutowym rysunku technicznym (blueprincie)** obejmującym widok z boku, z przodu, z tyłu i z góry.

W tej lekcji skonfigurujesz profesjonalne środowisko pracy w oparciu o **kolekcje w Outlinerze**, rozłożysz 4 rzuty techniczne **Dodge'a Challengera z 1970 roku**, zbudujesz kompletną karoserię krok po kroku oraz opanujesz instancjonowanie podzespołów (<span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>D</kbd></span>) i relacje nadrzędności (**Parenting**).

---

## 📐 Krok 1: Organizacja sceny w Kolekcjach (Outliner)

Gdy w scenie pojawia się wiele płaszczyzn referencyjnych i elementów konstrukcyjnych, brak dyscypliny w Outlinerze prowadzi do chaosu. Standardem PRO jest bezwzględne rozdzielenie obiektów pomocniczych od siatek właściwych.

1. W prawym górnym rogu ekranu (okno **Outliner**) kliknij prawym przyciskiem myszy na `Scene Collection` i wybierz **New Collection**.
2. Nazwij nową kolekcję jako `Blueprint`.
3. Kliknij na nią <kbd>PPM</kbd> i wybierz z menu kontekstowego kolor oznaczenia (np. **niebieski** tag), co pozwala natychmiast odróżnić dane referencyjne.
4. Utwórz drugą kolekcję o nazwie `model` (pozostawioną jako domyślnie **białą**), w której znajdą się wszystkie elementy samochodu.

Wewnątrz kolekcji `Blueprint` utworzymy 4 puste obiekty graficzne (**Empty / Image**):
- `side` (rzut z boku)
- `front` (rzut z przodu)
- `back` (rzut z tyłu)
- `top` (rzut z góry / dach)

---

## 🖼️ Krok 2: Konfiguracja rysunków technicznych (Empty Images)

Pobierz rysunek techniczny Dodge'a Challengera z 1970 roku:
[Pobierz Blueprint – The Blueprints](https://www.the-blueprints.com/blueprints/cars/dodge/37047/view/dodge_challenger_1970/)

![Konfiguracja blueprintu i kolekcji w Blenderze](/public/courses/blender/Images/dodge-start.png)

Wstawiając każdy z rzutów (<span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> $\rightarrow$ `Image` $\rightarrow$ **Reference**), przejdź do panelu właściwości po prawej stronie do zakładki **Data** (ikona obrazka) i skonfiguruj kluczowe parametry wyświetlania:

### 1. Depth (Głębia wyświetlania):
Ustaw na **Back**. Dzięki temu obraz referencyjny jest zawsze rysowany *pod* siatką 3D. Modelowany samochód nigdy nie zostanie zasłonięty przez płaszczyznę rysunku.

### 2. Side (Strona widoczności):
Wybierz **Front** zamiast *Both*. Blueprint będzie widoczny wyłącznie od strony roboczej. Gdy obrócisz kamerę na przeciwną stronę pojazdu, obraz stanie się przezroczysty, nie zasłaniając widoku.

### 3. Show In (Filtrowanie widoku):
- **Orthographic:** zaznacz (blueprint ma być widoczny w rzutach technicznych).
- **Perspective:** odznacz (wyłącz). Gdy opuścisz rzuty płaskie i zaczniesz obracać widok w perspektywie 3D, wszystkie 4 płaszczyzny blueprintu znikną. Przestrzeń robocza pozostaje czysta, a Ty widzisz wyłącznie bryłę pojazdu.

### 4. Wymiarowanie i punkt podłoża:
- Samochód w rzeczywistości ma długość ok. $4.86\text{ m}$. W polu **Size** ustaw wartość zbliżoną do `5 m`.
- Wyrównaj wszystkie 4 rzuty tak, aby dolna krawędź opon stykała się z siatką podłoża na wysokości **Z = 0**, a pionowa oś symetrii samochodu przebiegała dokładnie przez środek świata ($X=0$).

---

## 🚗 Krok 3: Płaskie panele z rzutu z góry (Top-Down Panel Blocking – 7 blach)

W modelowaniu zaawansowanych pojazdów wyciąganie całej karoserii z jednego połączonego wielokąta prowadzi do katastrofy – gęstsze nacięcia pod detale zniekształcają sąsiednie, gładkie płaszczyzny, tworząc pofałdowaną blachę.

Standardem produkcyjnym w technice panelowej (*Panel Modeling*) jest rozbicie karoserii na **niezależne obiekty blach**, dokładnie tak, jak montuje się poszycie w fabryce. Zaczynamy od rzutu z góry (oś Z), tworząc całkowicie płaskie profile.

### 1. Weryfikacja powierzchni za pomocą MatCapu:
Aby na bieżąco kontrolować odbicia światła i wyłapać ewentualne krzywizny:
1. W prawym górnym rogu widoku 3D kliknij strzałkę obok kulki podglądu **Viewport Shading**.
2. W sekcji **Lighting** przełącz tryb ze *Studio* na **MatCap**.
3. Wybierz materiał chromowany / metaliczny (gładka kula z wyraźnym błyskiem specularnym).
4. Zaznacz opcję **Specular Lighting**.

Klikając <kbd>PPM</kbd> na krawędź okien możesz dodawać nowe okna lub scalać je poprzez join.

![dodge-blachy-top.png](/public/courses/blender/Images/dodge-blachy-top.png)

### 2. Siedem płaskich paneli w kolekcji `model`:
W widoku z góry (<kbd>Numpad 7</kbd>) dodaj płaszczyznę i wymodeluj obrysy kolejnych elementów na płasko ($Z = 0$), tworząc 7 osobnych obiektów:
- `gril` – podszybie (panel wentylacyjny między maską a przednią szybą).
- `przednia_klapa_0` – centralna, wewnętrzna połać maski silnika.
- `przednia_klapa_1` – sekcja przetłoczenia maski.
- `przednia_klapa_2` – przednia poprzeczna listwa czołowa zamykająca przód.
- `przednia_klapa_3` – zewnętrzne skrzydło maski przylegające do błotnika.
- `dach` – główna połać dachu.
- `tylna_klapa` – pokrywa bagażnika.

### 3. Stos modyfikatorów dla każdego panelu:
Dla każdego z powyższych obiektów ustaw identyczny, czysty stos modyfikatorów:
1. **Mirror:**
   - Oś: **X**.
   - Zaznacz **Clipping** oraz **Merge** (gwarantuje idealne zgrzanie połówek w osi środkowej bez szczelin).
2. **Subdivision Surface:**(Na razie wyłączony podgląd renderu, włączymy go w późniejszym kroku.)
   - Algorytm: **Catmull-Clark**.
   - **Levels Viewport:** `1` (lub `2`).
   - **Render:** `2`.
   - Zaznacz **Optimal Display** (dzięki temu w trybie edycji widzisz tylko swoje kluczowe linie sterujące, a nie gęstą siatkę podziału).

---

## 📐 Krok 4: Nadanie profilu w osi Z (Krzywizna maski, dachu i klapy)

Gdy 7 paneli idealnie pokrywa się z blueprintem w rzucie z góry, przenosimy je w trzeci wymiar:

1. Przełącz się na rzut z boku (<kbd>Numpad 3</kbd> lub <kbd>Numpad 1</kbd>).
2. Wybierz obiekt `dach`, wejdź w `Edit Mode` (<kbd>Tab</kbd>), zaznacz wszystkie wierzchołki (<kbd>A</kbd>) i podnieś je w osi Z (<kbd>G</kbd> $\rightarrow$ <kbd>Z</kbd>) na wysokość linii dachu z blueprintu.
3. Dopasuj wierzchołki wzdłużnie – dach Challengera ma delikatny łuk opadający ku tyłowi.
4. Zaznacz obiekty maski (`przednia_klapa_0` do `przednia_klapa_3`) i podnieś je do poziomu przedniej krawędzi komory silnika, nadając im łagodny spadek w stronę zderzaka.
5. Obiekt `tylna_klapa` podnieś na wysokość linii bagażnika.
6. W rzucie z przodu (<kbd>Numpad 1</kbd>) skoryguj poprzeczne łuki paneli (blacha dachu i maski delikatnie opada ku krawędziom zewnętrznym).

Dzięki temu, że maska jest podzielona na sekcje (`przednia_klapa_0..3`), przetłoczenia silnika powstają naturalnie przez lekkie przesunięcie wysokości sąsiednich krawędzi, a metaliczny MatCap od razu pokazuje czyste, nieposzarpane linie światła!

Gdy Powyginasz blachy w miarę odpowiednim stylu to zobaczysz lekki rozjazd między widokami blueprint-u. Nie musi to być idealnie. Na razie budujemy masę wstępnie kształtną.


![](/public/courses/blender/Images/dodge-wyginanie-blacy-w-osi-z.png)


---

## 🏎️ Krok 5: Poszycie boczne i nadkola (5 elementów boku)

Zamiast ciągnąć boki z dachu jako jeden zrośnięty monolit, kontynuujemy produkcyjną metodę panelową. Bok Challengera dzielimy na **5 logicznych stref blachy**, co pozwala zachować idealnie ostre linie przetłoczeń bez fałdowania powierzchni:

### 1. Pięć obiektów bocznych w Outlinerze:
1. `pasek_boczny` – główna pozioma listwa (tzw. *character line*) biegnąca przez całą długość auta. Stanowi szkielet i oś odniesienia dla całego boku.
2. `bok_nad_paskiem` – górna partia poszycia boku, biegnąca od paska do dolnej linii okien.
3. `drzwi` – dolny arkusz poszycia drzwi poniżej paska bocznego.
4. `nadkole_przednie` – wyprofilowany łuk błotnika wokół przedniego koła.
5. `nadkole_tylne` – wyprofilowany łuk błotnika wokół tylnego koła wraz z dolnym fragmentem progu.

### 2. Kluczowa technika: Mirror Object (`dach`):
Elementy boczne nie przecinają osi symetrii świata ($X = 0$). Gdybyśmy dodali zwykły modyfikator Mirror, Blender odbiłby je wokół ich lokalnego punktu Origin, tworząc zduplikowane ścianki w złym miejscu.

Aby uzyskać idealną symetrię na drugą stronę pojazdu:
1. W modyfikatorze **Mirror** każdego bocznego elementu rozwiń pole **Mirror Object** (z ikoną pipety).
2. Wskaż centralny obiekt znajdujący się dokładnie w osi symetrii – np. `dach`.
3. Prawy bok samochodu natychmiast wygeneruje się w idealnej pozycji symetrycznej.

![Bok samochodu z 5 paneli bez okien](/public/courses/blender/Images/dodge-bok-bez-okna.png)

### 3. Szyba boczna, rama drzwi i separacja (<kbd>P</kbd> oraz <kbd>Ctrl</kbd> + <kbd>J</kbd>):

W kolejnym kroku uzupełniamy brakującą górną część poszycia drzwi, ramę bocznej szyby oraz przednią szybę (`szyba`):

1. **Separacja ścianek (<kbd>P</kbd>):**
   W trybie edycji (`Edit Mode`) po zaznaczeniu ścianek możesz je natychmiast odłączyć do zupełnie nowego obiektu:
   - Wciśnij klawisz <kbd>P</kbd> $\rightarrow$ wybierz **Selection**.
   - Pozwala to szybko „odciąć” górną ramę drzwi lub wyodrębnić płaszczyznę samej szyby bez konieczności tworzenia siatki od zera.
2. **Łączenie obiektów (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span>):**
   Gdy w trybie obiektowym (`Object Mode`) zaznaczysz kilka paneli i zechcesz scalić je w jeden podzespół (np. połączyć poszycie drzwi z ich ramą):
   - Wciśnij skrót <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span> (*Join*).
3. **Symetria Mirror Object:**
   Pamiętaj, że dla każdego nowego bocznego obiektu wskazujemy w modyfikatorze **Mirror** pole **Mirror Object $\rightarrow$ `dach`**, co zapewnia idealną symetrię geometrii po prawej stronie wozu.

![Dodanie szyby z progiem oraz separacja pod drzwi](/public/courses/blender/Images/dodge-dodanie-szyby-z=progiem-separacja-pod-drzwi.png)

---

## 🏁 Krok 6: Konstrukcja tyłu, łączenie skorupy i czysta topologia

W miarę jak projekt rośnie, liczba pojedynczych blach w Outlinerze zaczyna utrudniać nawigację. Zanim połączymy elementy, wprowadzamy porządek w hierarchii sceny:

### 1. Podkolekcje w Outlinerze (`top`, `bok`, `tył`):
Wewnątrz głównej kolekcji `model` utwórz trzy logiczne podkolekcje:
- `top` – sekcje maski silnika, podszybie i dach,
- `bok` – listwy, poszycie drzwi, szyby oraz łuki nadkoli,
- `tył` – elementy pasa tylnego i klapa bagażnika.

W kolekcji `tył` wymodeluj płaskie arkusze pasa tylnego wraz z podłużnym wycięciem pod zespolone lampy tylne:

![Konstrukcja paneli tyłu i wnęki na światła](/public/courses/blender/Images/dodge-tył-1.png)

---

### 2. Łączenie nieruchomej karoserii (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span>):
Samochód dzieli się na elementy **ruchome** oraz **konstrukcyjne (poszycie nośne)**:
- **Elementy ruchome:** drzwi (`drzwi`), przednia maska oraz klapa bagażnika (`tylna_klapa`) **pozostają osobnymi obiektami**. W silniku gry lub przy tworzeniu animacji muszą otwierać się na własnych zawiasach.
- **Skorupa nieruchoma:** dach, słupki C, tylne błotniki i pas tylny łączymy w jeden spójny korpus:
  1. W trybie `Object Mode` zaznacz dach, słupki i pas tylny.
  2. Wciśnij skrót <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span> (*Join*).
  3. Wejdź w `Edit Mode` (<kbd>Tab</kbd>) i połącz stykające się krawędzie (wypełniając ścianki klawiszem <kbd>F</kbd> lub scalając wierzchołki <kbd>M</kbd> $\rightarrow$ *By Distance*).
  4. Wytnij otwór pod tylną szybę i wnękę komory bagażnika.

![Łączenie tyłu kokpitu w jednolitą bryłę](/public/courses/blender/Images/dodge-łączenie-tyłu-kokpitu.png)

---

### 3. Złote zasady topologii: Quady vs Trójkąty vs N-gony

Gdy części karoserii zostają połączone, jakość siatki decyduje o tym, czy lakier pod światłem zachowa idealną gładkość:

- **Quady (Czworokąty – 4 wierzchołki):**  
  Jedyny w pełni pożądany typ geometrii w modelowaniu *Subdivision Surface*. Zapewniają nieprzerwany przepływ pętli (*edge loop flow*), pozwalają na precyzyjne cięcia (<kbd>Ctrl</kbd> + <kbd>R</kbd>) i równomierne załamywanie światła na łukach.
- **Trójkąty (Tris – 3 wierzchołki):**  
  Trójkąt działa jak zapora – przerywa bieg pętli krawędzi. Na zakrzywionych powierzchniach karoserii modyfikator *Subdivision* ściąga siatkę w stronę pojedynczego wierzchołka trójkąta, tworząc widoczne dołki i załamania cieniowania (*pinching*). Trójkąty są dopuszczalne wyłącznie na idealnie płaskich powierzchniach lub na samym końcu procesu przy optymalizacji pod silnik gry.
- **N-Gony (Wielokąty o 5 i więcej wierzchołkach):**  
  Niedopuszczalne przy wygładzaniu. Blender nie potrafi jednoznacznie określić, jak podzielić N-gon na mniejsze wielokąty, co prowadzi do czarnych plam cieniowania i pękania siatki przy deformacjach.

---

### 4. Wygładzanie nierówności siatki (*Smooth Vertices*):
Jeśli po zespawaniu krawędzi linia blachy wykazuje drobne uskoki:
1. Zaznacz nierówne wierzchołki w `Edit Mode`.
2. Z górnego menu wybierz `Vertex` $\rightarrow$ **Smooth Vertices** (lub kliknij <kbd>PPM</kbd> na zaznaczeniu i wybierz tę funkcję z menu kontekstowego).
3. Do precyzyjnego wyrównywania pozycji używaj również podwójnego wciśnięcia <kbd>G</kbd> (**Edge Slide**), co pozwala przesuwać punkty wzdłuż istniejących linii bez zniekształcania ogólnego profilu bryły.

---

### 5. Fizyczna grubość blachy – modyfikator Solidify:
Karoseria pojazdu w rzeczywistości nie jest papierową powłoką o zerowej grubości. W grach brak grubości blachy powoduje błędy oświetlenia (*light leaking*) na krawędziach otworów okiennych i drzwiowych.

Nadaj skorupie karoserii modyfikator **Solidify**:
1. W panelu modyfikatorów kliknij **Add Modifier** $\rightarrow$ **Generate** $\rightarrow$ **Solidify**.
2. **Mode:** `Simple`.
3. **Thickness:** `0.01 m` (1 cm grubości rantu blachy).
4. **Offset:** `-1.0000` (wytłaczanie do wnętrza pojazdu, aby nie zaburzyć wymiarów zewnętrznych).
5. Zaznacz opcję **Fill Rim** (automatycznie zamyka krawędzie cięć i otworów).

Modyfikator Solidify umieść w stosie **przed** modyfikatorem Subdivision Surface – dzięki temu zaokrąglone zostaną również wewnętrzne ranty blach.

### 6. Kontrola budżetu w Status Barze i diagnostyka przepływu światła

Podczas modelowania pojazdów pod silniki gier stała kontrola liczby wielokątów jest obowiązkowa. Blender pozwala na bieżąco monitorować statystyki bez wchodzenia w dodatkowe panele.

#### Włączenie statystyk sceny w Status Barze:
1. Przejdź do menu `Edit` $\rightarrow$ **Preferences** $\rightarrow$ zakładka **Interface**.
2. W sekcji **Editors** rozwiń pozycję **Status Bar**.
3. Zaznacz opcję **Scene Statistics** (możesz też po prostu kliknąć <kbd>PPM</kbd> na dolnej belce statusu Blendera i zaznaczyć tę samą opcję).
4. Na dolnym pasku pojawi się dokładny licznik wierzchołków (**Verts**), krawędzi (**Edges**), ścian (**Faces**) i trójkątów (**Tris**).

Na tym etapie sama skorupa kokpitu (`Plane`) liczy zaledwie **725 wierzchołków** (ok. 1450 po uwzględnieniu modyfikatora Mirror), a cały samochód ze wszystkimi panelami zamyka się w ok. 1265 wierzchołkach bazowych. To wzorcowy, profesjonalny budżet pod modelowanie *Subdivision Surface* – siatka jest wystarczająco lekka do edycji, a zarazem idealnie definiuje bryłę.

![Diagnostyka przepływu pętli i statystyki sceny w Blenderze](/public/courses/blender/Images/dodge-przepływ-światła-po-siadce.png)

#### Analiza przepływu siatki (Edge Flow) i artefaktów:
W widoku z metalicznym MatCapem widać dokładnie, gdzie siatka współpracuje ze światłem, a gdzie powstają naprężenia:

- 🟢 **Zielone strzałki (Prawidłowy Edge Flow):**  
  Pętle krawędzi biegnące przez dach, spływające po słupku A na przedni błotnik oraz wzdłuż przetłoczenia bocznego (*character line*). Przepływ jest jednokierunkowy, pętle nie skręcają gwałtownie, a odbicie światła na masce i dachu rozkłada się jak na prawdziwej lakierowanej karoserii.
- 🔴 **Czerwone okręgi (Miejscowe załamania cieniowania – Pinching):**
  1. **Okolice wlotu na masce (*hood scoop*):** Ciasne skupisko pętli krawędzi potrzebnych do wycięcia wlotu graniczy z szeroką, płaską taflą maski. Zbiegające się krawędzie tworzą bieguny (tzw. *E-poles* – wierzchołki łączące 5 krawędzi), na których algorytm Catmull-Clark naciąga siatkę w punkt, tworząc widoczny dołek.
  2. **Kącik podszybia i przejście w błotnik:** Miejsce, gdzie łączą się trzy różne kierunki blachy (pionowa szyba, poziome podszybie i opadający błotnik). Gdy czworokąty nie są idealnie płaskie (*non-planar quads*), cieniowanie gubi wektory normalnych i załamuje odbicie pod nienaturalnym kątem.
  3. **Podstawa słupka A:** Zagęszczenie wierzchołków przy zejściu słupka do krawędzi drzwi.

#### Jak eliminujemy te załamania:
1. **Relaksacja pętli (<kbd>G</kbd> $\rightarrow$ <kbd>G</kbd>):** Za pomocą podwójnego wciśnięcia <kbd>G</kbd> (*Edge Slide*) odsuwamy pętle krawędzi otaczające detal, aby przejście gęstości siatki między wlotem a gładką maską było stopniowe i łagodne.
2. **Wyrzucenie biegunów na krawędź:** Wierzchołki o 5 krawędziach przesuwamy w stronę szczelin montażowych (np. linii styku maski z błotnikiem), gdzie przetłoczenie lub cień naturalnie maskuje załamanie.
3. **Modyfikator WeightedNormal:** Na samym dole stosu modyfikatorów dodajemy modyfikator **WeightedNormal** (zaznaczając opcje *Keep Sharp* oraz *Face Influence*). Przepisuje on wektory normalnych wierzchołków proporcjonalnie do powierzchni przylegających ścianek, dzięki czemu duże płaskie pozycje maski pozostają idealnie gładkie pomimo obecności drobnych cięć.

---

## 🚘 Krok 7: Pas przedni i wnęka grilla

1. Przełącz na rzut z przodu (<kbd>Numpad 1</kbd>) i z góry (<kbd>Numpad 7</kbd>).
2. Wybierz obiekt `gril` i dopasuj go do czoła przedniego pasa.
3. Wytłocz krawędzie pionowo w dół (<kbd>E</kbd> $\rightarrow$ <kbd>Z</kbd>), a następnie do środka pojazdu w osi Y (<kbd>E</kbd> $\rightarrow$ <kbd>Y</kbd>), budując głęboką wnękę pasa przedniego.
4. W tej wnęce osadzone zostaną charakterystyczne cztery okrągłe reflektory oraz pozioma atrapa chłodnicy z chromowaną obwódką.

---


![Ukończony model Dodge Challenger 1970 z kołami i pełnym stosem modyfikatorów](/public/courses/blender/Images/dodge-gotowy-40k-vertexów.png)

Po włączeniu wszystkich modyfikatorów w stosie (**Mirror** $\rightarrow$ **Subdivision Surface** $\rightarrow$ **Solidify** $\rightarrow$ **WeightedNormal**) samochód prezentuje się w pełnej okazałości:
- Siatka bazowa licząca ok. 700–1200 wierzchołków po wygładzeniu Catmull-Clark tworzy gładką, zwartą bryłę **42 681 wierzchołków (83 816 trójkątów)**.
- Modyfikator **WeightedNormal** w trybie *Face Area* z parametrem *Keep Sharp* i *Face Influence* idealnie likwiduje wszelkie mikrozniekształcenia światła wokół wlotów powietrza i reflektorów.
- Samochód jest gotową bryłą typu *Mid/High-Poly*, która w kolejnych modułach posłuży do wypalenia mapy normalnych (*Baking*) na zoptymalizowaną siatkę *Low-Poly*.

## 🛞 Krok 8: Koła i potęga instancjonowania (<span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>D</kbd></span>)

Początkujący tworzą 4 osobne koła lub kopiują je skrótem `Shift + D`. Gdy po godzinie chcą zmienić bieżnik lub felgę, muszą powtarzać tę samą pracę 4 razy.

Profesjonalne podejście polega na zbudowaniu **jednego koła wzorcowego** i powieleniu go jako instancji:

1. W widoku z boku dodaj cylinder o 16 wierzchołkach: <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> $\rightarrow$ `Mesh` $\rightarrow$ **Cylinder**.
2. Obróć cylinder o $90^\circ$ w osi Y: <kbd>R</kbd> $\rightarrow$ <kbd>Y</kbd> $\rightarrow$ `90` $\rightarrow$ <kbd>Enter</kbd>.
3. Dopasuj średnicę i szerokość do przedniego koła na blueprincie.
4. W `Edit Mode` wymodeluj wgłębienie felgi za pomocą Insetu (<kbd>I</kbd>) i ekstruzji do środka (<kbd>E</kbd>).

### Ustawienie punktu Origin w osi obrotu:
Upewnij się, że **Origin Point** (pomarańczowa kropka) koła znajduje się dokładnie w jego geometrycznym środku. W trybie obiektowym wybierz:
`Object` $\rightarrow$ `Set Origin` $\rightarrow$ **Origin to Geometry**.

### Powielenie kół jako instancji (Linked Duplicates):
1. Zaznacz przednie lewe koło w `Object Mode`.
2. Wciśnij <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>D</kbd></span> (nie `Shift + D`!).
3. Zablokuj ruch w osi Y (<kbd>Y</kbd>) i przesuń kopię do tylnego nadkola.
4. Zaznacz oba koła z <kbd>Shift</kbd>, wciśnij <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>D</kbd></span>, zablokuj ruch w osi X (<kbd>X</kbd>) i przesuń na prawą stronę samochodu.

Wszystkie 4 koła dzielą tę samą siatkę. Gdy wejdziesz w tryb edycji dowolnego koła i zmodyfikujesz choćby jeden wierzchołek felgi, wszystkie 4 koła zaktualizują się w czasie rzeczywistym.

---

## 🔗 Krok 9: Hierarchia sceny i Parenting (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span>)

Samochód w grze składa się z korpusu i ruchomych podzespołów. Koła muszą podążać za ruchem pojazdu, ale zachować możliwość niezależnego toczenia się i skrętu.

1. W `Object Mode` zaznacz wszystkie 4 koła (przytrzymując <kbd>Shift</kbd>).
2. Na samym końcu kliknij z <kbd>Shift</kbd> na karoserię samochodu (karoseria musi być aktywnym obiektem o jaśniejszym obrysie).
3. Wciśnij skrót <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> i wybierz **Object (Keep Transform)**.

### Test mechaniki:
- Zaznacz karoserię i przesuń ją (<kbd>G</kbd>): cały pojazd porusza się razem z kołami.
- Zaznacz dowolne przednie koło i obróć je w osi Z (<kbd>R</kbd> $\rightarrow$ <kbd>Z</kbd>): koło płynnie skręca w nadkolu wokół swojego punktu Origin, dokładnie tak jak w silniku gry.

---

## 🎨 Krok 10: Zróżnicowanie materiałów PBR

Nadaj poszczególnym elementom fizyczne właściwości materiałowe:

- **Lakier karoserii:** `Base Color`: pomarańczowy / śliwkowy, `Metallic: 0.9`, `Roughness: 0.18`.
- **Guma opon:** `Base Color`: ciemnoszary, `Metallic: 0.0`, `Roughness: 0.85`.
- **Chromowane zderzaki i kołpaki:** `Base Color`: biały, `Metallic: 1.0`, `Roughness: 0.05`.
- **Szyby:** `Base Color`: ciemnografitowy, `Roughness: 0.1`, `Alpha: 0.5`.
- **Reflektory przednie:** materiał ze zwiększonym parametrem **Emission** (kolor ciepły żółty, siła 2.0).

---

## 🎯 Samodzielna próba

Wyposaż Challengera w charakterystyczny podwójny wlot powietrza na masce (tzw. *hood scoop*):

1. W `Edit Mode` karoserii zaznacz ścianki na masce silnika po lewej stronie (symetria Mirror automatycznie obsłuży prawą stronę).
2. Zastosuj Inset (<kbd>I</kbd>) do wydzielenia obrysu wlotu.
3. Wytłocz ścianki lekko w górę (<kbd>E</kbd>), a przednią pionową ściankę wlotu wytłocz do wewnątrz, symulując otwór wlotu powietrza.
4. Przypisz do wnętrza wlotu matowy czarny materiał plastikowej kratki.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Profesjonalną organizację Outlinera w oparciu o oznaczone kolorystycznie **Kolekcje** (dane referencyjne vs model).
- Konfigurację rysunków technicznych Empty (**Back depth**, **Front side**, **Orthographic only**) gwarantującą czysty widok perspektywiczny 3D.
- Metodologię modelowania krawędziowego (*Poly/Edge Modeling*) pojazdów od nadkoli, przez progi, maskę, aż po dach i tył.
- Zastosowanie klonowania połączonego (<span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>D</kbd></span>) do powtarzalnych podzespołów mechanicznych.
- Relacje nadrzędności (**Parenting** <kbd>Ctrl + P</kbd>) zachowujące lokalne osie obrotu i skrętu kół.
