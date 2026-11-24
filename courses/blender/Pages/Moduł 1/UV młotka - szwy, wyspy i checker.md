# UV młotka - szwy, wyspy i checker

Otwórz własny `mlotek_v02.blend` lub [model z materiałami](/public/courses/blender/Resources/mlotek-02-materialy.blend). Zapisz pracę jako `mlotek_v03.blend`.

## 🧩 Podłącz checker do materiału

Przejdź do obszaru roboczego <kbd class="win-menu-btn">UV Editing</kbd>. Po lewej jest UV Editor, po prawej widok modelu. W lewym edytorze będziesz układać UV na obrazie, a w prawym sprawdzać, jak ten obraz wygląda na powierzchni młotka.

Sprawdź tryb w lewym górnym rogu widoku 3D. Jeśli po przełączeniu obszaru Blender włączył Edit Mode, wróć do Object Mode przez <kbd>Tab</kbd>. Zacznij od podłączenia checkera do materiałów obu części.

Zaznacz trzonek w Object Mode. Ikoną typu edytora w lewym górnym rogu lewego obszaru zmień <kbd class="win-menu-btn">UV Editor</kbd> na <kbd class="win-menu-btn">Shader Editor</kbd>. Jeśli węzły są poza widokiem, naciśnij <kbd>Home</kbd> nad tym edytorem, aby objąć je wszystkie.

Materiał jest tu przedstawiony jako połączone **węzły**. Principled BSDF zawiera znane ci już Base Color, Metallic i Roughness. Dodasz węzeł odczytujący obraz i przekażesz jego kolor do Base Color. Wejścia węzła są po lewej, a wyjścia po prawej. Przeciągnięty między nimi przewód określa, skąd pobierana jest dana wartość.

W lewym edytorze wybierz <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Texture</kbd> → <kbd class="win-menu-btn">Image Texture</kbd>. Na dodanym węźle kliknij <kbd class="win-menu-btn">New</kbd> i ustaw:

| Pole | Wartość |
| --- | --- |
| Name | `Checker_1024` |
| Width i Height | `1024` |
| Generated Type | `Color Grid` |

Color Grid wygeneruje kolorową kratkę z literami. Nazwa `Checker_1024` pozwoli wybrać ten sam obraz w drugim materiale. Wartości Width i Height określają rozdzielczość obrazu kontrolnego.

Zatwierdź utworzenie obrazu. Przeciągnij przewód z wyjścia <kbd class="win-menu-btn">Color</kbd> w Image Texture (1 na zrzucie) do wejścia <kbd class="win-menu-btn">Base Color</kbd> w Principled BSDF (2). Materiał zacznie odczytywać kolor z obrazu zamiast z jednolitej próbki.

![Połączenie wyjścia Color obrazu kontrolnego z wejściem Base Color materiału](/public/courses/blender/Images/uv-checker-node.png)

Przy niepodłączonym wejściu <kbd class="win-menu-btn">Vector</kbd> węzeł Image Texture korzysta z aktywnej mapy UV obiektu. Dlatego późniejsza zmiana rozłożenia UV zmieni kratkę widoczną na modelu. Oba obiekty mogą odczytywać ten sam obraz według własnych współrzędnych.

Zaznacz głowicę i dodaj do jej materiału drugi Image Texture. Z listy obrazów wybierz istniejący `Checker_1024`, po czym połącz Color z Base Color. Na czas kontroli ustaw Metallic głowicy na `0`, aby odbicia stali nie przesłaniały wzoru. W widoku 3D włącz Material Preview.

Zmień lewy obszar z powrotem na UV Editor. Z listy obrazów w jego nagłówku wybierz `Checker_1024`. W obu materiałach i w edytorze masz teraz ten sam obraz, więc możesz porównywać wielkość pól na trzonku i głowicy.

Jeżeli kratka jest widoczna tylko po lewej, sprawdź prawy widok: ma działać w Material Preview. Jeśli tylko jedna część pozostaje jednolita, zaznacz ją w Object Mode i sprawdź w jej materiale połączenie Color → Base Color.

## 🔎 Obejrzyj UV po modelowaniu

W widoku 3D zaznacz trzonek, a z wciśniętym <kbd>Shift</kbd> dodaj głowicę. Przejdź do Edit Mode przez <kbd>Tab</kbd> i, trzymając kursor nad widokiem 3D, zaznacz całą siatkę przez <kbd>A</kbd>. Po lewej zobaczysz UV pozostałe po kostkach, z których powstał model. Kształt młotka zmienił się podczas modelowania, więc te współrzędne trzeba rozłożyć ponownie.

![UV pozostałe po kostkach oraz nierówna kratka na wymodelowanym młotku](/public/courses/blender/Images/uv-przed.png)

Na trzonku pola są rozciągnięte w długie, wąskie pasma. Na szerokim boku głowicy porównaj ich wysokość i szerokość. Obróć każdą z tych powierzchni możliwie w swoją stronę, aby ograniczyć wpływ kąta patrzenia. Po Unwrap wrócisz do tych samych miejsc i ocenisz zmianę proporcji.

## ✂️ Otwórz boki trzonka i oddziel końcówki

Wróć do Object Mode, zaznacz sam trzonek i włącz Local View przez <kbd>Numpad /</kbd>. To polecenie znajdziesz też w <kbd class="win-menu-btn">View</kbd> → <kbd class="win-menu-btn">Local View</kbd> → <kbd class="win-menu-btn">Toggle Local View</kbd>.

W Edit Mode przejdź do wyboru ścian klawiszem <kbd>3</kbd> nad literami. Nad widokiem 3D odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>. Wybierz górną ścianę kończącą trzonek, a potem obróć widok od spodu i dodaj dolną z <kbd>Shift</kbd>. Zaznaczone mają być tylko dwie końcówki.

Wybierz <kbd class="win-menu-btn">Select</kbd> → <kbd class="win-menu-btn">Select Loops</kbd> → <kbd class="win-menu-btn">Boundary of Selected</kbd>. W Blenderze 5.2.2 tak nazywa się polecenie zamieniające zaznaczenie ścian na krawędzie ich obwodu.

![Dwie końcówki trzonka zaznaczone w trybie wyboru ścian oraz menu z poleceniem Boundary of Selected](/public/courses/blender/Images/uv-obwod-zaznaczenia.png)

Po wykonaniu polecenia Blender przełączy wybór na krawędzie. Na tym trzonku powinny być zaznaczone dwa obwody po cztery krawędzie. W menu <kbd class="win-menu-btn">Edge</kbd> wybierz <kbd class="win-menu-btn">Mark Seam</kbd>, a następnie odznacz wszystko. Czerwone linie wskażą miejsca oddzielenia końcówek od boków przy rozkładaniu UV.

Teraz otwórz zamknięty pas boczny. Włącz wybór krawędzi klawiszem <kbd>2</kbd> i obróć trzonek od tyłu. Wybierz z <kbd>Shift</kbd> dwie krawędzie jednego narożnika: od dolnego końca do środkowej pętli i dalej do górnego. Na zrzucie ten ciąg oznaczono numerem 1. Ponownie wybierz <kbd class="win-menu-btn">Mark Seam</kbd>.

![Trzonek z obwodami oddzielającymi końcówki oraz jednym podłużnym szwem otwierającym powierzchnię boczną](/public/courses/blender/Images/uv-szwy-trzonek.png)

Sprawdź połączenia przy środkowej pętli i przy końcach. Podłużny szew ma dochodzić do obu czerwonych obwodów. Dzięki temu boki mogą rozłożyć się w jeden pas, a końcówki trafią obok niego.

## 🗺️ Wykonaj Unwrap i sprawdź wynik

Zaznacz całą siatkę trzonka przez <kbd>A</kbd> nad widokiem 3D i naciśnij <kbd>U</kbd>. Otworzy się menu <kbd class="win-menu-btn">UV Mapping</kbd>. Zawiera kilka sposobów utworzenia UV. Wybór zależy od tego, czy chcesz rozwinąć powierzchnię według szwów, automatycznie podzielić model, czy rzutować go z określonego kierunku.

![Menu UV Mapping w Blenderze 5.2.2: trzy metody Unwrap u góry oraz pozostałe sposoby mapowania poniżej](/public/courses/blender/Images/uv-menu-metody.png)

### 🔀 Porównaj metody na trudniejszej powierzchni

Na trzonku trzy metody dają zbliżony wynik. Spójrz więc na obudowę ze stopniowanym otworem i na skan głowy. W każdym rzędzie zachowano ten sam model, szwy, obraz i kamerę. Zmienia się metoda Unwrap. Pod modelem jest jego rzeczywisty układ UV.

![Angle Based, Conformal i Minimum Stretch na tej samej obudowie, wraz z układami UV](/public/courses/blender/Images/uv-porownanie-metody-obudowa.png)

Na szerokim froncie obudowy małe kratki mają podobne proporcje we wszystkich trzech próbach. Powierzchnia składa się z płaskich pól oraz pasów, które można otworzyć szwami. **Conformal** wystarcza tu do uzyskania użytecznego rozłożenia. Zmiana na bardziej złożoną metodę przynosi niewielką korzyść.

![Te same trzy metody na skanie głowy: dwie pierwsze mocno zmniejszają obszar twarzy; Minimum Stretch przydziela mu więcej miejsca](/public/courses/blender/Images/uv-porownanie-metody-glowa.png)

Teraz porównaj policzek z ramieniem. W pierwszych dwóch próbach na twarzy mieści się zaledwie kilka dużych pól, choć na ramionach jest ich dużo więcej. W UV przód twarzy oznaczono pomarańczowymi krawędziami. Widzisz, jak mocno skurczył się ten obszar. Taki wynik utrudniłby zapisanie szczegółów skóry.

**Angle Based** i Conformal starają się zachować lokalne kąty podczas rozpłaszczania. Pozostawiają jednak swobodę zmiany wielkości poszczególnych obszarów. Przy tym podziale skanu obie metody wykorzystały ją w niekorzystny sposób. **Minimum Stretch** uwzględnia także zmiany względnej powierzchni i w tej próbie daje twarzy znacznie równiejszy przydział. Nadal obejrzyj nos i okolice oczu: krzywizna wymusza miejscowe deformacje.

Gdy porównujesz metody, sprawdzaj więc **proporcje pól i ich wielkość między obszarami**. Jeśli wszystkie trzy wyniki pozostawiają problem w tym samym miejscu, sprawdź możliwość dodatkowego cięcia. Wybór metody i zaplanowanie szwów są dwiema decyzjami, które wspólnie kształtują wynik.

### 🧭 Dobierz sposób mapowania do powierzchni

Pozostałe pozycje menu tworzą UV według innych zasad. Obejrzyj ich działanie na tych samych dwóch modelach. W zakładkach znajdziesz zarówno użyteczne zastosowania, jak i skutki objęcia daną projekcją zbyt dużej części obiektu.

<data-tabs>
<tabs><b>Automatyczny podział</b><b>Projekcje brył</b><b>Rzut z widoku</b><b>Pasy i powtarzanie</b></tabs>
<div>

<kbd class="win-menu-btn">Smart UV Project</kbd> grupuje ściany według kierunków. Na obudowie daje osobne pola, które łatwo ocenić i później pomalować. Na głowie ten sam limit kąta rozcina ciągłą powierzchnię na liczne fragmenty. Spójrz zwłaszcza na okolice nosa i uszu w UV. Przy malowaniu skóry trzeba byłoby dopasowywać wzór przez te granice.

![Smart UV Project z limitem 66 stopni na obudowie i skanie głowy: porównanie podziału powierzchni](/public/courses/blender/Images/uv-porownanie-smart.png)

Pole <kbd class="win-menu-btn">Angle Limit</kbd> reguluje ten podział. Obniżenie limitu pozwala łączyć w grupy ściany o bardziej zbliżonych kierunkach, więc zwykle powstaje więcej fragmentów. Po operacji sprawdź, czy granice wysp pasują do sposobu malowania assetu.

<kbd class="win-menu-btn">Lightmap Pack</kbd> wydziela osobne obszary dla ścian. Obejrzyj, jak wypełnia nimi atlas obu modeli. Taki podział służy zapisowi wypalonego oświetlenia, gdzie powierzchnie potrzebują własnego miejsca. Przy ręcznym malowaniu twarzy liczba granic bardzo utrudniłaby pracę.

![Lightmap Pack na obudowie i głowie: liczne osobne pola ścian w atlasie UV](/public/courses/blender/Images/uv-porownanie-lightmap.png)

</div>
<div>

<kbd class="win-menu-btn">Cube Projection</kbd> rzutuje ściany z sześciu kierunków. Na płaskich częściach obudowy daje czytelne pola checkera. Na głowie kierunek projekcji zmienia się między sąsiednimi fragmentami, co widać po nagłych zmianach wzoru. **Sprawdź też nakładanie w UV**: projekcja może umieścić kilka powierzchni w tym samym miejscu obrazu. Do indywidualnego malowania każdej z nich potrzebujesz osobnych obszarów atlasu.

![Cube Projection na obudowie i głowie: kształt wzoru oraz nakładające się rzuty w UV](/public/courses/blender/Images/uv-porownanie-cube.png)

<kbd class="win-menu-btn">Cylinder Projection</kbd> rozwija powierzchnię wokół osi. W obudowie zaznaczono tylko wewnętrzny pas otworu, a oś projekcji ustawiono wzdłuż tego otworu. Powstaje prostokątna owijka. Po projekcji dopasowano jej proporcje do obwodu i głębokości otworu: w UV Editorze skaluj wysokość pasa przez <kbd>S</kbd>, <kbd>Y</kbd> i sprawdzaj kratkę na jego powierzchni. Zakończ, gdy małe pola oglądane na wprost mają podobną szerokość i wysokość.

Na całej głowie i ramionach jedna oś wymusza duże różnice skali między szyją, nosem i szerokim dołem. Dobierz zarówno oś, jak i zakres zaznaczenia. Front oraz uskoki obudowy rozłóż osobno.

![Cylinder Projection na wybranym wnętrzu otworu oraz na całym skanie głowy z ramionami](/public/courses/blender/Images/uv-porownanie-cylinder.png)

<kbd class="win-menu-btn">Sphere Projection</kbd> nadaje współrzędne według kierunków wychodzących ze środka, podobnie jak długość i szerokość geograficzna na globie. Porównaj czubek głowy z jej bokiem. Pola zbiegają się przy biegunie. Na obudowie układ dodatkowo nie odpowiada przebiegowi otworu i płaskich frontów. Tę projekcję łatwiej wykorzystać na powierzchni zbliżonej do kuli, np. gałce ocznej.

![Sphere Projection na obudowie i głowie: deformacje wynikające z odwzorowania wokół środka i przy biegunach](/public/courses/blender/Images/uv-porownanie-sphere.png)

</div>
<div>

<kbd class="win-menu-btn">Project from View</kbd> przenosi zaznaczenie na obraz zgodnie z widokiem. Na obudowie zaznaczono wyłącznie płaski front i wykonano rzut prostopadły do niego. Pola zachowują proporcje. Rzut całej głowy zapisuje głębokość nosa, policzków i tyłu głowy w tej samej płaszczyźnie. Powierzchnie mogą się nałożyć, a odwrócone boki zostają ściśnięte.

![Rzut z przodu na sam płaski front obudowy i na cały skan: różnica wynikająca z zaznaczenia powierzchni](/public/courses/blender/Images/uv-porownanie-front.png)

Wariant <kbd class="win-menu-btn">Project from View (Bounds)</kbd> rozciąga rzut do granic obrazu. Poniżej w obu próbach zaznaczony jest ten sam niski pas frontu obudowy. Po dopasowaniu Bounds jego UV zajmuje cały kwadrat, a na powierzchni powstają bardzo wąskie pola. Szerokość i wysokość rzutu zmieniły skalę w różnym stopniu. Użyj zwykłego rzutu, gdy chcesz zachować proporcje, a położenie i wspólną skalę ustaw później w UV Editorze.

![Ten sam wąski pas obudowy przed i po dopasowaniu rzutu do granic obrazu, z widoczną zmianą proporcji checkera](/public/courses/blender/Images/uv-porownanie-bounds.png)

</div>
<div>

<kbd class="win-menu-btn">Follow Active Quads</kbd> prowadzi UV od aktywnego czworokąta przez zaznaczony pas sąsiednich czworokątów. W przykładzie użyto całego wewnętrznego pasa obudowy. Jego ściana początkowa dostała prostokątne UV o proporcjach odpowiadających jej bokom. Kolejne ściany kontynuują ten układ.

![Follow Active Quads na pasie czworokątów wewnątrz otworu złożonej obudowy](/public/courses/blender/Images/uv-porownanie-follow.png)

Aby powtórzyć próbę w pliku porównawczym, wybierz scenę `x-follow`. W Edit Mode zaznacz pas ścian wewnątrz otworu. Jedną z nich wybierz jako ostatnią, aby została aktywna. Jej UV jest wzorcem dla reszty. Po <kbd>U</kbd> wybierz Follow Active Quads. Rozciągnięcie ściany początkowej przeniesie się na pas, dlatego sprawdź ją przed wykonaniem polecenia. Skan głowy składa się z trójkątów, więc ta metoda nie poprowadzi po nim takiego pasa.

<kbd class="win-menu-btn">Reset</kbd> przypisuje każdej zaznaczonej ścianie cały obraz. Spójrz, ile razy wraca ten sam wzór na obu modelach. Można tak powielać grafikę na osobnych panelach. Indywidualne rysy czy pieprzyk wymagałyby oddzielnego miejsca w UV, ponieważ zmiana wspólnego obrazu pojawi się na wszystkich odczytujących go ścianach.

![Reset na czworokątach obudowy i trójkątach skanu: każda ściana odczytuje cały wspólny obraz](/public/courses/blender/Images/uv-porownanie-reset.png)

</div>
</data-tabs>

Możesz obejrzeć i przeliczyć te wyniki w [pliku z porównaniami UV](/public/courses/blender/Resources/UV-laboratorium-wizualne.blend). Lista scen w górnej belce Blendera zawiera warianty nazwane jak na ilustracjach, np. `x-conformal` i `y-minimum_stretch`. Po wybraniu sceny przejdź do UV Editing, zaznacz model, włącz Edit Mode i zaznacz siatkę przez <kbd>A</kbd>. W lewym edytorze wybierz obraz `Checker_1024`.

Skan głowy: Lee Perry-Smith / Infinite-Realities, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), z [zasobów three.js](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/LeePerrySmith). W porównaniach zmieniono UV i materiał kontrolny.

Polecenia <kbd class="win-menu-btn">Mark Seam</kbd> i <kbd class="win-menu-btn">Clear Seam</kbd> dodają i usuwają oznaczenia szwów. Po zmianie oznaczeń ponownie wykonaj Unwrap.


Na trzonku chcemy zachować zaplanowany pas boczny i dwie końcówki. Wybierz teraz <kbd class="win-menu-btn">Unwrap Angle Based</kbd>.

W lewym edytorze powinny pojawić się trzy wyspy: jeden długi pas i dwie końcówki. Ich położenie i obrót mogą różnić się od ilustracji. Sprawdź przede wszystkim, czy końcówki są osobno, a wszystkie boki tworzą wspólny pas.

![Trzy wyspy trzonka: powierzchnia boczna i dwie oddzielone końcówki](/public/courses/blender/Images/uv-trzonek.png)

### ⚙️ Zobacz, co zmienia F9

Od razu po Unwrap naciśnij <kbd>F9</kbd> nad widokiem 3D. Panel pozwala przeliczyć tę operację po zmianie ustawień. Pole <kbd class="win-menu-btn">Method</kbd> przełącza trzy metody pokazane wcześniej.

![Panel F9 operacji Unwrap w Blenderze 5.2.2, z parametrami Minimum Stretch](/public/courses/blender/Images/uv-unwrap-ustawienia.png)

Poniżej każda para pokazuje zmianę jednego ustawienia. W pliku porównawczym zapisane są wyniki UV. Aby samodzielnie otworzyć panel F9 po wczytaniu sceny, najpierw wykonaj Unwrap przez <kbd>U</kbd>. Zapisany projekt nie przechowuje historii ostatniej operacji.

<data-tabs>
<tabs><b>Obraz i odstępy</b><b>Siatka i otwory</b><b>Przeliczanie i obszar</b><b>Wagi i odwrócenia</b></tabs>
<div>

<kbd class="win-menu-btn">Correct Aspect</kbd> uwzględnia szerokość i wysokość obrazu. W obu próbach poniżej użyto tego samego checkera 1024 × 512. Po wyłączeniu korekty UV jest układane jak dla kwadratowego obrazu i kratki na modelu zmieniają proporcje. Włączona korekta dopasowuje rozłożenie do prostokątnej tekstury. Podgląd UV na ilustracji również ma proporcje 2:1, aby dało się to porównać.

![Correct Aspect wyłączone i włączone na tej samej obudowie z tą samą prostokątną teksturą 1024 na 512 pikseli](/public/courses/blender/Images/uv-porownanie-f9-aspect.png)

Blender odczytuje wymiary z obrazu w aktywnym węźle Image Texture materiału. Zaznacz ten węzeł w Shader Editorze przed Unwrap. Nasz młotek ma kwadratowy checker, więc pozostaw Correct Aspect włączone.

<kbd class="win-menu-btn">Margin</kbd> rezerwuje wolne miejsce wokół pakowanych wysp. Porównaj puste pasy w dwóch atlasach poniżej. Większy margines oddziela wyspy kosztem miejsca zajmowanego przez ich powierzchnie. Po wspólnym dopasowaniu do obrazu na modelu mieści się wtedy mniej pól checkera.

![Fraction z marginesem 0 i 0.06: różna szerokość pustych pasów i wielkość wysp w atlasie](/public/courses/blender/Images/uv-porownanie-f9-margin.png)

<kbd class="win-menu-btn">Margin Method</kbd> określa, jak Blender interpretuje wpisaną wartość. W tej próbie przed każdym Unwrap powiększono początkowe UV dziesięciokrotnie. Pole Margin ma zawsze `0.02`. Obejrzyj odstępy: ta sama liczba w różnych trybach daje inny wynik.

![Scaled, Add i Fraction z wartością Margin 0.02, przy identycznych początkowych UV powiększonych dziesięciokrotnie](/public/courses/blender/Images/uv-porownanie-f9-margin-method.png)

*Scaled* uzależnia margines od skali dotychczasowych UV. *Add* dodaje odstęp przed końcowym dopasowaniem układu, więc późniejsze skalowanie wpływa na jego wielkość. *Fraction* wyraża margines w odniesieniu do końcowego kwadratu UV. Do ustawiania odstępów w gotowym atlasie najłatwiej kontrolować Fraction. Samo pozostawienie pustego miejsca wymaga jeszcze wypełnienia go odpowiednimi kolorami podczas wypalania lub malowania tekstury.

</div>
<div>

<kbd class="win-menu-btn">Use Subdivision Surface</kbd> uwzględnia powierzchnię po modyfikatorze Subdivision Surface. W obu próbach poniżej oglądasz ten sam wygładzony model. Po lewej UV obliczono na podstawie siatki bazowej, a po prawej z uwzględnieniem wygładzenia. Porównaj kratkę przy przejściu frontu w otwór, gdzie modyfikator najmocniej zmienia kształt.

![Ta sama wygładzona obudowa z UV obliczonym bez uwzględnienia i z uwzględnieniem Subdivision Surface](/public/courses/blender/Images/uv-porownanie-f9-subdiv.png)

Włącz tę opcję, gdy oceniasz teksturę na powierzchni wygładzonej tym modyfikatorem. Trzonek młotka korzysta z Bevel, więc tutaj pozostaw ją wyłączoną.

<kbd class="win-menu-btn">Fill Holes</kbd> pomaga obliczać rozłożenie płatów z wewnętrznymi otworami przez ich tymczasowe domknięcie na potrzeby obliczeń. Spójrz na poniższą obudowę: ma otwór w bryle, ale każdy pierścieniowy płat otwarto szwem od środka do zewnętrznego brzegu. Dlatego obie próby dały identyczne UV.

![Fill Holes wyłączone i włączone: identyczny wynik na obudowie z pierścieniami już otwartymi szwami](/public/courses/blender/Images/uv-porownanie-f9-holes.png)

Przed użyciem tej opcji prześledź granicę rozwijanego płata. Zamknięty otwór wewnątrz tej granicy może wpłynąć na obliczenia. Fill Holes zachowuje geometrię modelu. Pole jest dostępne dla Angle Based i Conformal, a Minimum Stretch uwzględnia takie domknięcie automatycznie.

</div>
<div>

<kbd class="win-menu-btn">Iterations</kbd> w Minimum Stretch określa liczbę kolejnych przebiegów poprawiania układu. Porównaj czoło, policzek i szyję po jednym oraz po trzydziestu przebiegach. Metoda dostaje więcej czasu na ograniczanie odkształceń wewnątrz tych samych granic.

![Minimum Stretch po jednym i trzydziestu przebiegach na tym samym skanie głowy](/public/courses/blender/Images/uv-porownanie-f9-iterations.png)

Zacznij od `10`. Zwiększ liczbę i wróć wzrokiem do tego samego fragmentu. Gdy dalsze przeliczanie daje podobną kratkę, pozostaw niższą wartość. Zbyt ograniczony szwami płat nadal będzie wymagał decyzji o cięciu.

<kbd class="win-menu-btn">Original Bounds</kbd> przydaje się podczas poprawiania istniejącego atlasu. W obu próbach poniżej punktem wyjścia był ten sam układ zajmujący mały obszar po prawej. Przy wyłączonej opcji Blender rozmieścił wyspy na nowo. Przy włączonej zachował dotychczasowe obszary rozłożenia. Porównaj ich położenie w kwadracie UV.

![Ponowne Unwrap małego istniejącego atlasu z Original Bounds wyłączonym i włączonym](/public/courses/blender/Images/uv-porownanie-f9-bounds.png)

W tym trybie część ustawień pakowania staje się niedostępna. Po ponownym rozłożeniu sprawdź dopasowanie istniejącego obrazu, ponieważ punkty wewnątrz wysp mogą zmienić pozycję. Przy młotku zastępujemy UV pozostałe po kostce, więc pozostaw Original Bounds wyłączone.

</div>
<div>

<kbd class="win-menu-btn">Importance Weights</kbd> pozwala przydzielić więcej miejsca wybranej części powierzchni. W scenach `weights-0` i `weights-2` grupa wierzchołków `Priorytet_twarzy` ma wyższe wagi z przodu głowy, a niższe na pozostałej powierzchni. Zaznaczenie Importance Weights udostępnia nazwę grupy w <kbd class="win-menu-btn">Weight Group</kbd> oraz siłę wpływu w <kbd class="win-menu-btn">Weight Factor</kbd>.

![Ta sama grupa wag twarzy przy Weight Factor 0 i 2: zmiana przydziału powierzchni UV i rozmiaru kratki na twarzy](/public/courses/blender/Images/uv-porownanie-f9-weights.png)

Przy Factor `0` wagi nie wpływają na wynik. Przy `2` na twarzy mieści się więcej pól checkera, a na ramionach mniej. Ten przydział ma koszt: obejrzyj wydłużenie pól w szyi. Dobieraj wpływ do szczegółowości obrazu i odległości oglądania assetu.

Aby przygotować własną grupę, otwórz <kbd class="win-menu-btn">Object Data Properties</kbd> pod zielonym trójkątem. W <kbd class="win-menu-btn">Vertex Groups</kbd> kliknij `+` i nadaj nazwę. W Edit Mode zaznacz wierzchołki ważnego obszaru, ustaw Weight, np. `1`, i kliknij Assign. Pozostałemu obszarowi przypisz mniejszą wagę, np. `0.1`. Dopiero wtedy wybierz tę grupę w panelu Unwrap. Przy młotku pozostaw Importance Weights wyłączone.

<kbd class="win-menu-btn">No Flip</kbd> ogranicza lokalne odwracanie ścian w UV podczas optymalizacji. Poniżej oba wyniki są identyczne: dla tego otwarcia skanu dodatkowe ograniczenie nie zmieniło rozwiązania.

![No Flip wyłączone i włączone na tym samym poprawnie otwartym skanie: identyczne wyniki tej próby](/public/courses/blender/Images/uv-porownanie-f9-flip.png)

Ta kontrola ma znaczenie zwłaszcza przy przypiętych punktach UV, których położenie ogranicza rozwijanie. Odwrócenie rozpoznasz w UV po ścianie przechodzącej na drugą stronę własnej krawędzi, często z nałożeniem na sąsiada. Obrócenie całej wyspy na obrazie zachowuje wzajemne ułożenie jej ścian. Po włączeniu No Flip nadal sprawdzaj nakładanie i proporcje wzoru.

</div>
</data-tabs>

Wróć do trzonka młotka. W panelu pozostaw Method: Angle Based, włączone Correct Aspect oraz wyłączone Use Subdivision Surface i Original Bounds. Kliknij poza panelem, aby kontynuować pracę na tym rozłożeniu.


Wróć widokiem do tej samej strony trzonka, którą oglądałeś przed wyznaczeniem szwów. Oceń proporcje małych pól możliwie na wprost powierzchni. Przy końcach trzonek zwęża się, więc połączony pas wymaga drobnych odkształceń. Dla słojów drewna ciągłość tego pasa jest przydatna: wzór może przechodzić przez narożniki bez kolejnych granic do dopasowania.

Jeśli końcówka pozostała połączona z pasem, sprawdź, czy otacza ją pełny czerwony obwód. Jeśli boki nie otworzyły się w długi pas, prześledź podłużny szew: ma dochodzić od jednego obwodu do drugiego, także przez środkową pętlę. Uzupełnij brakującą krawędź, zaznacz cały trzonek i ponownie wykonaj Unwrap. Nowe oznaczenie szwu zacznie wpływać na UV po tej operacji.

Ustaw długość pasa pionowo w UV, jak na ilustracji. Zachowasz w ten sposób czytelny kierunek jego długości. Przy nakładaniu fotografii drewna dopasujesz ten kierunek do włókien widocznych na obrazie. Jeśli pas leży poziomo, przenieś kursor nad lewy edytor, zaznacz UV przez <kbd>A</kbd> i wykonaj <kbd>R</kbd>, `90`, <kbd>Enter</kbd>. Obrócisz rozłożenie trzonka wraz z jego końcówkami, zachowując proporcje wysp.

## 🔨 Porównaj dwa podziały głowicy

Wróć do Object Mode i wyłącz Local View. Zaznacz głowicę, włącz Local View dla niej i przejdź do Edit Mode. Klawiszem <kbd>3</kbd> włącz wybór ścian, odznacz wszystko i zaznacz z <kbd>Shift</kbd> dwie końcowe ściany po przeciwnych stronach osi X. Tak jak przy trzonku wykonaj <kbd class="win-menu-btn">Boundary of Selected</kbd>, a potem <kbd class="win-menu-btn">Mark Seam</kbd>, aby oddzielić końcówki. Odznacz krawędzie przed wyborem podłużnego szwu.

Na początek otwórz boki jednym podłużnym szwem. W trybie wyboru krawędzi zaznacz trzy kolejne krawędzie jednego tylnego narożnika, od jednej końcówki do drugiej. Oznacz je przez Mark Seam, zaznacz całą głowicę i wykonaj Unwrap Angle Based.

Powinieneś otrzymać dwie końcówki oraz jedną wyspę łączącą cztery boki. Obejrzyj kratkę przy zwężeniach. Płaskie ściany zachowują wspólne brzegi w UV, więc ich osobne trapezowe kształty ograniczają rozłożenie całej owijki.

Wróć do wyboru krawędzi i dodaj szwy na pozostałych trzech podłużnych narożnikach. Na każdym zaznacz trzy krawędzie biegnące wzdłuż głowicy. Poprzeczne pętle przy zwężeniach pozostaw bez nowych szwów.

![Cztery podłużne narożniki głowicy i obwody jej końcówek oznaczone jako szwy](/public/courses/blender/Images/uv-szwy-glowica-pelne.png)

Zaznacz całą głowicę i ponownie wykonaj Unwrap Angle Based. Cztery boki powinny teraz tworzyć cztery oddzielne pasy, a dwie końcówki osobne wyspy. Razem daje to sześć wysp.

![Porównanie wspólnej owijki głowicy i boków rozłożonych osobno po dodaniu szwów](/public/courses/blender/Images/uv-glowica-porownanie.png)

Porównaj z poprzednią próbą ten sam płaski bok i jego zwężenie. Dodatkowe cięcia pozwoliły rozłożyć każdą ścianę zgodnie z jej kształtem. Zapisz ten wariant: przy głowicy łatwo umieścić granice tekstury na narożnikach, a mniejsza deformacja ułatwi późniejsze nakładanie śladów obróbki stali.

## 📐 Ustal skalę i spakuj obie części

Wróć do Object Mode, wyłącz Local View i zaznacz obie części. Przejdź do Edit Mode i zaznacz wszystkie ściany. Nad UV Editorem zaznacz wszystkie UV przez <kbd>A</kbd>, a następnie wybierz <kbd class="win-menu-btn">UV</kbd> → <kbd class="win-menu-btn">Average Islands Scale</kbd>.

Average Islands Scale skaluje całe wyspy tak, aby podobnej powierzchni w 3D odpowiadała podobna powierzchnia w UV. Dzięki temu duży bok głowicy otrzyma więcej miejsca niż mała końcówka, a rozmiar pól checkera na obu częściach powinien się zbliżyć.

Na młotku przyjmujemy podobną gęstość dla drewna i stali. Po wyrównaniu sprawdź duże płaskie powierzchnie obu części. Jeśli pola nadal są wydłużone, wróć do rozłożenia tej części: wyrównanie skali całych wysp zachowuje ich wewnętrzne odkształcenia. Przydział większego miejsca na wyjątkowo drobny detal wykonuje się po takim wyrównaniu.

Wybierz <kbd class="win-menu-btn">UV</kbd> → <kbd class="win-menu-btn">Pack Islands</kbd>. Od razu po operacji naciśnij <kbd>F9</kbd>, aby otworzyć jej ustawienia:

| Ustawienie | Wartość | Wpływ na ten układ |
| --- | --- | --- |
| Rotate | Wyłączone | Zachowuje ustawiony kierunek pasa trzonka. |
| Scale | Włączone | Pozwala wspólnie dopasować wielkość wysp do miejsca na obrazie. |
| Margin Method | `Fraction` | Określa margines jako część wymiaru końcowego układu UV. |
| Margin | `0.02` | Ustala margines na 2% wymiaru obrazu dla tego układu kontrolnego. |

Pack Islands przemieszcza wyspy i może wspólnie zmienić ich skalę, zachowując proporcje między nimi. Po pakowaniu kratka może więc stać się wszędzie większa lub mniejsza. Porównaj jej wielkość między częściami młotka. Każda wyspa ma teraz własny obszar tego samego obrazu.

![Wspólne rozmieszczenie dziewięciu wysp oraz checker na obu częściach młotka](/public/courses/blender/Images/uv-atlas-dokladny.png)

W układzie jest dziewięć wysp: pas trzonka, cztery pasy głowicy i cztery końcówki. Mają mieścić się na obrazie bez nakładania. Porównaj wielkość małych pól na modelu, zwłaszcza na trzonku i szerokim boku głowicy. Większa ściana powinna zajmować odpowiednio więcej miejsca w UV, aby otrzymać podobną liczbę pikseli na centymetr.

Obejrzyj też fazy. Bevel nadal tworzy je jako modyfikator i wylicza ich UV z rozłożenia siatki bazowej. Najpierw oceń kratkę na dużych bokach, a potem na wąskich zaokrągleniach. Jeśli zniekształcenie występuje wyłącznie na fazie, oddziel tę obserwację od oceny reszty powierzchni.

## 💾 Zachowaj wersję kontrolną

W UV Editorze wybierz <kbd class="win-menu-btn">Image</kbd> → <kbd class="win-menu-btn">Save As</kbd> i zapisz `Checker_1024` jako PNG, np. w folderze `textures` obok projektu. To zapis samego obrazu. Zapis projektu przechowuje siatki, UV i materiały wraz z odwołaniami do obrazów.

Następnie przez <kbd class="win-menu-btn">Image</kbd> → <kbd class="win-menu-btn">Pack</kbd> umieść kopię obrazu wewnątrz pliku Blender. Zapisz `mlotek_v03.blend` z widoczną kratką. Zachowasz punkt odniesienia do porównania, gdy zaczniesz nakładać drewno i stal.

Teraz zapisz kolejną wersję jako `mlotek_v04.blend`. W Object Mode otwórz Shader Editor dla trzonka i usuń dodany węzeł Image Texture. Powtórz to dla głowicy, po czym przywróć jej Metallic `1`. Wcześniejsze próbki Base Color ponownie określą barwy materiałów, a przygotowane UV pozostaną na siatkach.

![Przywrócone materiały drewna i stali oraz zachowane rozłożenie UV](/public/courses/blender/Images/uv-wynik-dokladny.png)

Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. Do porównania masz [wersję z checkerem](/public/courses/blender/Resources/mlotek-05-uv-glowica-checker.blend) i [model z UV oraz przywróconymi materiałami](/public/courses/blender/Resources/mlotek-06-uv-glowica-materialy.blend).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Zaplanuj otwarcie powierzchni.** Końcówki trzonka oddzieliłeś obwodami, a boki otworzyłeś jednym podłużnym szwem.
- **Metodę dobieraj do zadania.** Trzy metody Unwrap korzystają ze szwów, a projekcje zależą od kierunku lub bryły rzutowania. Porównuj ten sam fragment wzoru po zmianie jednego ustawienia.
- **Zmiana szwów wymaga ponownego Unwrap.** Na głowicy porównałeś wspólną owijkę z osobno rozłożonymi bokami i sprawdziłeś skutek na tej samej powierzchni.
- **Skalę ustal przed pakowaniem.** Podobna gęstość obu części pasuje do tego młotka. Inny model może wymagać większego przydziału dla ważnego detalu.
- **Zachowaj wersję z checkerem.** Pozwala wrócić do kontroli UV, gdy późniejszy obraz ujawni problem.

| Skrót | Zastosowanie |
| --- | --- |
| <kbd>Tab</kbd> | Przełączasz Object Mode i Edit Mode. |
| <kbd>Home</kbd> nad Shader Editorem | Obejmujesz widokiem wszystkie węzły materiału. |
| <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span> nad widokiem 3D | Odznaczasz siatkę przed wyborem końcówek lub szwu. |
| <kbd>2</kbd> / <kbd>3</kbd> nad literami | Wybierasz krawędzie / ściany w Edit Mode. |
| <kbd>A</kbd> | Zaznaczasz wszystko w obszarze pod kursorem: siatkę w widoku 3D albo UV w lewym edytorze. |
| <kbd>Shift</kbd> + kliknięcie | Dodajesz kolejne elementy do zaznaczenia. |
| <kbd>Numpad /</kbd> | Włączasz lub wyłączasz Local View. |
| <kbd>S</kbd>, <kbd>Y</kbd> nad UV Editorem | Zmieniasz wysokość zaznaczonego UV, kontrolując proporcje kratki na powierzchni. |
| <kbd>R</kbd>, `90`, <kbd>Enter</kbd> nad UV Editorem | Obracasz zaznaczone UV o 90°. |
| <kbd>U</kbd> nad widokiem 3D | Otwierasz menu UV Mapping. |
| <kbd>F9</kbd> | Otwierasz ustawienia ostatniej operacji, np. wybór Method po Unwrap albo parametry Pack Islands. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span> | Zapisujesz projekt. |
