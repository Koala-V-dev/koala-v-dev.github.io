# UV młotka - szwy, wyspy i checker

Otwórz własny `mlotek_v02.blend` lub [model z materiałami](/public/courses/blender/Resources/mlotek-02-materialy.blend). Zapisz pracę jako `mlotek_v03.blend`.

## 🧩 Podłącz checker do materiału

Przejdź do obszaru roboczego <kbd class="win-menu-btn">UV Editing</kbd>. Po lewej jest UV Editor, po prawej widok modelu. Obraz kontrolny musi być podłączony do materiału, abyś widział go także na młotku.

Zaznacz trzonek w Object Mode. Ikoną typu edytora w lewym górnym rogu lewego obszaru zmień <kbd class="win-menu-btn">UV Editor</kbd> na <kbd class="win-menu-btn">Shader Editor</kbd>. Zobaczysz węzły materiału. Ich wejścia są po lewej, a wyjścia po prawej. Przewód przekazuje wynik jednego węzła do drugiego.

W lewym edytorze wybierz <kbd class="win-menu-btn">Add</kbd> → <kbd class="win-menu-btn">Texture</kbd> → <kbd class="win-menu-btn">Image Texture</kbd>. Na dodanym węźle kliknij <kbd class="win-menu-btn">New</kbd> i ustaw:

| Pole | Wartość |
| --- | --- |
| Name | `Checker_1024` |
| Width i Height | `1024` |
| Generated Type | `Color Grid` |

Zatwierdź utworzenie obrazu. Przeciągnij przewód z wyjścia <kbd class="win-menu-btn">Color</kbd> w Image Texture (1 na zrzucie) do wejścia <kbd class="win-menu-btn">Base Color</kbd> w Principled BSDF (2). Materiał zacznie odczytywać kolor z obrazu zamiast z jednolitej próbki.

![Połączenie wyjścia Color obrazu kontrolnego z wejściem Base Color materiału](/public/courses/blender/Images/uv-checker-node.png)

Zaznacz głowicę i dodaj do jej materiału drugi Image Texture. Z listy obrazów wybierz istniejący `Checker_1024`, po czym połącz Color z Base Color. Na czas kontroli ustaw Metallic głowicy na `0`, aby odbicia stali nie przesłaniały wzoru. W widoku 3D włącz Material Preview.

Zmień lewy obszar z powrotem na UV Editor i wybierz w nim `Checker_1024`. To ten sam obraz, z którego korzystają teraz oba materiały.

## 🔎 Obejrzyj UV po modelowaniu

Zaznacz obie części młotka, przejdź do Edit Mode i zaznacz wszystkie ściany przez <kbd>A</kbd>. Po lewej zobaczysz UV pozostałe po kostkach, z których powstał model. Kształt młotka zmienił się podczas modelowania, więc te współrzędne trzeba rozłożyć ponownie.

![UV pozostałe po kostkach oraz nierówna kratka na wymodelowanym młotku](/public/courses/blender/Images/uv-przed.png)

Przyjrzyj się płaskiemu bokowi głowicy i długiej stronie trzonka. Zapamiętaj miejsca, gdzie kratka jest wyraźnie wydłużona. Po rozłożeniu wrócisz do tych samych powierzchni i sprawdzisz skutek zmiany.

## ✂️ Otwórz boki trzonka i oddziel końcówki

Wróć do Object Mode, zaznacz sam trzonek i włącz Local View przez <kbd>Numpad /</kbd>. W Edit Mode przejdź do wyboru ścian klawiszem <kbd>3</kbd> nad literami. Odznacz wszystko, wybierz górną ścianę, a potem obróć widok od spodu i dodaj dolną z <kbd>Shift</kbd>.

Wybierz <kbd class="win-menu-btn">Select</kbd> → <kbd class="win-menu-btn">Loops</kbd> → <kbd class="win-menu-btn">Boundary Loop</kbd>. Zamiast ścian zaznaczone zostaną krawędzie, które je otaczają. W menu <kbd class="win-menu-btn">Edge</kbd> wybierz <kbd class="win-menu-btn">Mark Seam</kbd>, a następnie odznacz wszystko. Czerwone obwody wyznaczają dwie końcówki jako osobne części rozłożenia.

Teraz otwórz zamknięty pas boczny. Włącz wybór krawędzi klawiszem <kbd>2</kbd> i obróć trzonek od tyłu. Wybierz z <kbd>Shift</kbd> dwie krawędzie jednego narożnika: od dolnego końca do środkowej pętli i dalej do górnego. Na zrzucie ten ciąg oznaczono numerem 1. Ponownie wybierz <kbd class="win-menu-btn">Mark Seam</kbd>.

![Trzonek z obwodami oddzielającymi końcówki oraz jednym podłużnym szwem otwierającym powierzchnię boczną](/public/courses/blender/Images/uv-szwy-trzonek.png)

Sprawdź połączenia przy środkowej pętli i przy końcach. Podłużny szew ma dochodzić do obu czerwonych obwodów. Dzięki temu boki mogą rozłożyć się w jeden pas, a końcówki trafią obok niego.

## 🗺️ Wykonaj Unwrap i sprawdź wynik

Zaznacz całą siatkę trzonka przez <kbd>A</kbd>. Nad widokiem 3D wybierz <kbd class="win-menu-btn">UV</kbd> → <kbd class="win-menu-btn">Unwrap Angle Based</kbd>. W lewym edytorze powinny pojawić się trzy wyspy: jeden długi pas i dwie końcówki.

![Trzy wyspy trzonka: powierzchnia boczna i dwie oddzielone końcówki](/public/courses/blender/Images/uv-trzonek.png)

Wróć widokiem do tej samej strony trzonka, którą oglądałeś przed wyznaczeniem szwów. Oceń proporcje małych pól możliwie na wprost powierzchni. Przy końcach trzonek zwęża się, więc połączony pas wymaga drobnych odkształceń. Dla słojów drewna ciągłość tego pasa jest przydatna: wzór może przechodzić przez narożniki bez kolejnych granic do dopasowania.

Jeśli końcówka pozostała połączona z pasem albo pas zawija się w ciasny fragment, sprawdź czerwone krawędzie. Uzupełnij przerwany obwód lub podłużny szew i ponownie wykonaj Unwrap dla całego trzonka. Samo oznaczenie nowej krawędzi jako szwu pozostawia dotychczasowe UV aż do ponownego rozłożenia.

Długość trzonka ustaw pionowo w UV, aby ułatwić późniejsze ułożenie słojów. Jeśli pas leży poziomo, przenieś kursor nad lewy edytor, zaznacz UV przez <kbd>A</kbd> i wykonaj <kbd>R</kbd>, `90`, <kbd>Enter</kbd>. Obrócisz rozłożenie trzonka wraz z jego końcówkami, zachowując proporcje wysp.

## 🔨 Porównaj dwa podziały głowicy

Wróć do Object Mode i wyłącz Local View. Zaznacz głowicę, włącz Local View dla niej i przejdź do Edit Mode. W trybie wyboru ścian zaznacz dwie końcowe ściany po przeciwnych stronach osi X. Tak jak przy trzonku wykonaj Boundary Loop i Mark Seam, aby oddzielić końcówki.

Na początek otwórz boki jednym podłużnym szwem. W trybie wyboru krawędzi zaznacz trzy kolejne krawędzie jednego tylnego narożnika, od jednej końcówki do drugiej. Oznacz je przez Mark Seam, zaznacz całą głowicę i wykonaj Unwrap Angle Based.

Powinieneś otrzymać dwie końcówki oraz jedną wyspę łączącą cztery boki. Obejrzyj kratkę przy zwężeniach. Płaskie ściany zachowują wspólne brzegi w UV, więc ich osobne trapezowe kształty ograniczają rozłożenie całej owijki.

Wróć do wyboru krawędzi i dodaj szwy na pozostałych trzech podłużnych narożnikach. Na każdym zaznacz trzy krawędzie biegnące wzdłuż głowicy. Poprzeczne pętle przy zwężeniach pozostaw bez nowych szwów.

![Cztery podłużne narożniki głowicy i obwody jej końcówek oznaczone jako szwy](/public/courses/blender/Images/uv-szwy-glowica-pelne.png)

Zaznacz całą głowicę i ponownie wykonaj Unwrap Angle Based. Cztery boki powinny teraz tworzyć cztery oddzielne pasy, a dwie końcówki osobne wyspy. Razem daje to sześć wysp.

![Porównanie wspólnej owijki głowicy i boków rozłożonych osobno po dodaniu szwów](/public/courses/blender/Images/uv-glowica-porownanie.png)

Porównaj z poprzednią próbą ten sam płaski bok i jego zwężenie. Dodatkowe cięcia pozwoliły rozłożyć każdą ścianę zgodnie z jej kształtem. Zapisz ten wariant: przy głowicy łatwo umieścić granice tekstury na narożnikach, a mniejsza deformacja ułatwi późniejsze nakładanie śladów obróbki stali.

## 📐 Ustal skalę i spakuj obie części

Wróć do Object Mode, wyłącz Local View i zaznacz obie części. Przejdź do Edit Mode i zaznacz wszystkie ściany. Nad UV Editorem zaznacz wszystkie UV przez <kbd>A</kbd>, a następnie wybierz <kbd class="win-menu-btn">UV</kbd> → <kbd class="win-menu-btn">Average Islands Scale</kbd>.

To polecenie wyrównuje skalę wysp względem powierzchni modelu. Na tym młotku przyjmujemy zbliżoną gęstość dla drewna i stali, więc jest to użyteczny punkt wyjścia. Przy modelu z drobnym napisem albo szczegółową twarzą po takim wyrównaniu trzeba jeszcze przydzielić ważnym miejscom więcej przestrzeni.

Wybierz <kbd class="win-menu-btn">UV</kbd> → <kbd class="win-menu-btn">Pack Islands</kbd>. Od razu po operacji naciśnij <kbd>F9</kbd>, aby otworzyć jej ustawienia. Wyłącz <kbd class="win-menu-btn">Rotate</kbd>, ustaw Margin Method na `Fraction`, a Margin na `0.02`. Wyłączenie obrotu zachowa pionowy kierunek trzonka. Margines pozostawi odstępy między wyspami.

![Wspólne rozmieszczenie dziewięciu wysp oraz checker na obu częściach młotka](/public/courses/blender/Images/uv-atlas-dokladny.png)

W układzie jest dziewięć wysp: pas trzonka, cztery pasy głowicy i cztery końcówki. Mają mieścić się na obrazie bez nakładania. Porównaj wielkość małych pól na modelu, zwłaszcza na trzonku i szerokim boku głowicy. Większa ściana powinna zajmować odpowiednio więcej miejsca w UV, aby otrzymać podobną liczbę pikseli na centymetr.

Obejrzyj też fazy. Bevel nadal tworzy je jako modyfikator i wylicza ich UV z rozłożenia siatki bazowej. Jeśli wada występuje wyłącznie na fazie, przyjrzyj się jej osobno, zanim ponownie rozłożysz wszystkie duże ściany.

## 💾 Zachowaj wersję kontrolną

W UV Editorze wybierz <kbd class="win-menu-btn">Image</kbd> → <kbd class="win-menu-btn">Save As</kbd> i zapisz `Checker_1024` jako PNG, np. w folderze `textures` obok projektu. Następnie przez <kbd class="win-menu-btn">Image</kbd> → <kbd class="win-menu-btn">Pack</kbd> umieść jego kopię w pliku Blender. Zapisz `mlotek_v03.blend` z widoczną kratką.

Teraz zapisz kolejną wersję jako `mlotek_v04.blend`. W Object Mode otwórz Shader Editor dla trzonka i usuń dodany węzeł Image Texture. Powtórz to dla głowicy, po czym przywróć jej Metallic `1`. Wcześniejsze próbki Base Color ponownie określą barwy materiałów, a przygotowane UV pozostaną na siatkach.

![Przywrócone materiały drewna i stali oraz zachowane rozłożenie UV](/public/courses/blender/Images/uv-wynik-dokladny.png)

Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. Do porównania masz [wersję z checkerem](/public/courses/blender/Resources/mlotek-05-uv-glowica-checker.blend) i [model z UV oraz przywróconymi materiałami](/public/courses/blender/Resources/mlotek-06-uv-glowica-materialy.blend).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Zaplanuj otwarcie powierzchni.** Końcówki trzonka oddzieliłeś obwodami, a boki otworzyłeś jednym podłużnym szwem.
- **Zmiana szwów wymaga ponownego Unwrap.** Na głowicy porównałeś wspólną owijkę z osobno rozłożonymi bokami i sprawdziłeś skutek na tej samej powierzchni.
- **Skalę ustal przed pakowaniem.** Podobna gęstość obu części pasuje do tego młotka. Inny model może wymagać większego przydziału dla ważnego detalu.
- **Zachowaj wersję z checkerem.** Pozwala wrócić do kontroli UV, gdy późniejszy obraz ujawni problem.

| Skrót | Zastosowanie |
| --- | --- |
| <kbd>Tab</kbd> | Przełączasz Object Mode i Edit Mode. |
| <kbd>2</kbd> / <kbd>3</kbd> nad literami | Wybierasz krawędzie / ściany w Edit Mode. |
| <kbd>A</kbd> | Zaznaczasz wszystko w obszarze pod kursorem: siatkę w widoku 3D albo UV w lewym edytorze. |
| <kbd>Shift</kbd> + kliknięcie | Dodajesz kolejne elementy do zaznaczenia. |
| <kbd>Numpad /</kbd> | Włączasz lub wyłączasz Local View. |
| <kbd>R</kbd>, `90`, <kbd>Enter</kbd> nad UV Editorem | Obracasz zaznaczone UV o 90°. |
| <kbd>F9</kbd> | Otwierasz ustawienia operacji wykonanej przed chwilą, np. Pack Islands. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span> | Zapisujesz projekt. |
