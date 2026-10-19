# Wkrętak - retopologia, UV i poziomy LOD

Mały wkrętak nie musi mieć wszystkich rowków w geometrii. Zbudujemy dwa warianty i porównamy je w tym samym kadrze: 472 trójkąty z rowkami oraz 280 bez rowków, które odtworzymy normal mapą. Dopiero widoczna różnica przy danej wielkości na ekranie rozstrzygnie, którego użyć.

Otwórz [high poly z materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend). HIGH zostaje źródłem, z edytowalnymi modyfikatorami. Źródło i cel bake pozostawimy w tym samym miejscu. Wypalanie będzie szukać powierzchni HIGH nad odpowiadającymi im fragmentami LOW.

## 🎯 Retopologia jest decyzją o kształcie

**Retopologia** oznacza przygotowanie siatki odpowiadającej zastosowaniu. Przy skanie lub rzeźbie często budujemy ją od nowa na powierzchni high poly. Tutaj wykorzystamy istniejącą siatkę sterującą, a dla prostszego chwytu wrócimy do czterech przekrojów.

Normal mapa zmienia kierunek odbijania światła. Nie zmienia obrysu, nie wycina otworów i nie odtwarza rzeczywistego zasłaniania powierzchni. Z bliska może więc być widać różnicę głębokości, choć sam zarys rowka wygląda poprawnie. Gdy narzędzie zajmuje kilkadziesiąt pikseli, wiele takich różnic przestaje mieć znaczenie.

| Część | Wariant dokładniejszy | Wariant prostszy |
| --- | --- | --- |
| Korpus, bark i szyjka | Geometria | Geometria |
| Duże narożniki chwytu | Proste fazy w geometrii | Proste fazy w geometrii |
| Rowki | Geometria i drobne zaokrąglenia z mapy | Cały relief z normal mapy |
| Mikrofazy stali i ziarno powierzchni | Normal mapa | Normal mapa |

O przydatności uproszczenia decyduje widoczny efekt. Jeżeli usunięta krawędź psuje widoczny obrys, mapa jej nie odda. Jeżeli szczegół znika po oddaleniu, kilka dodatkowych pasów ścian może już nie dawać korzyści.

## 🪚 Wariant z rowkami: uprość wynik modyfikatorów

### 🗂️ Zrób kopie robocze

W Object Mode zaznacz rękojeść i grot. Wykonaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, następnie <kbd>PPM</kbd>, aby anulować przesuwanie. Kopie pozostają na źródle. Z nadal zaznaczonymi kopiami wybierz <kbd>M</kbd> → New Collection i nazwij kolekcję `LOW`.

W Outlinerze nazwij kopie `LOW_Rekojesc` i `LOW_Grot`. Kliknij oko przy HIGH. W widoku mają pozostać tylko części LOW.

Zaznacz LOW_Rekojesc. W zakładce z kluczem rozwiń Bevel i zmień Segments z `6` na `1`. Zamiast kilku pasów opisujących łuk zostanie pojedynczy pas fazy. Zachowamy go na głównych narożnikach; drobne fazy rowków przeniesiemy do normal mapy.

### 📐 Wyłącz fazy obrzeży rowków

Bevel nadal ma Limit Method: Weight. Przypomnij sobie grupy z modelowania: waga `1` na głównych narożnikach, `0.2` na obrzeżach rowków i `0` na podziałach płaszczyzn. Waga mnoży szerokość fazy; nie usuwa samego rowka.

1. Wejdź w Edit Mode, wybierz krawędzie klawiszem <kbd>2</kbd> i odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>.
2. Wybierz jedną krawędź na styku dna rowka i jego bocznej ścianki.
3. Otwórz <kbd>N</kbd> → Item → Edges Data. W Mean Bevel Weight odczytaj `0.2`. Jeśli widzisz `1` albo `0`, sprawdź, którą krawędź wybrałeś.

![Pole Mean Bevel Weight w sekcji Edges Data i modyfikator Bevel ograniczony wagami](/public/courses/blender/Images/wkretak-wagi.png)

Zrzut pokazuje miejsce odczytu. Zaznaczono na nim główne narożniki, więc wartość wynosi `1.00`. Dla obrzeża rowka odczytujesz `0.20`. Używaj pola w Edges Data, nie podobnego pola w Vertices Data.

Z kursorem nad modelem otwórz <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>G</kbd></span> → Bevel. Blender wybierze krawędzie o podobnej wadze. Obróć model: mają zaznaczyć się obrzeża rowków, a główne narożniki pozostać poza wyborem.

W Item → Edges Data → Mean Bevel Weight wpisz `0`. Wróć do Object Mode. Rowki mają pozostać, a zniknąć ich drobne fazy. Duże narożniki nadal powinny mieć pojedynczy pas fazy. Jeśli zniknął również ten pas, cofnij zmianę i sprawdź zaznaczenie.

Na LOW_Grot usuń Bevel przez X w nagłówku modyfikatora. Ośmiokątny trzpień i płaskie ostrze pozostają; usuwasz mikrofazy. Sprawdź obrys z bliska i przy widoku całego narzędzia.

### 🔺 Utrwal siatkę LOW

Apply w menu modyfikatora zapisuje jego wynik w siatce. HIGH zachowujemy z edytowalnym stosem, żeby móc wrócić do szerokości i segmentów fazy.

Na LOW_Rekojesc, w Object Mode, otwórz strzałkę w dół w nagłówku Bevel i wybierz Apply. To menu w zakładce z kluczem; <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> otwiera inne menu, dotyczące transformacji obiektu.

Na obu częściach LOW usuń dotychczasowy Weighted Normal przez X. Ustalimy normalne ponownie po ostatecznym podziale ścian. Dodaj przez Add Modifier → Triangulate, ustaw Quad Method: Fixed i wybierz Apply. W Edit Mode zobaczysz przekątne dzielące czworokąty na trójkąty.

![High poly i dwa docelowe warianty siatki rękojeści](/public/courses/blender/Images/wkretak-siatki-lod.png)

Normal mapa w przestrzeni tangent zapisuje kierunek względem powierzchni LOW: jej normalnej i kierunków biegnących wzdłuż UV. Triangulujemy przed bake, bo taki zapis zależy od interpolacji konkretnych trójkątów, normalnych i UV. Zmiana przekątnej po wypalaniu może ujawnić ukośny ślad na tej samej pozornie płaskiej ścianie. Silnik i tak użyje trójkątów; ustalamy ten podział, zamiast oddawać go przypadkowi.

## 🧱 Wariant bez rowków: nie modeluj niewidocznych zagłębień

Zapisz drugi plik przez File → Save As. W nim zachowaj HIGH i uproszczony LOW_Grot. W Outlinerze wybierz wyłącznie LOW_Rekojesc i usuń ją przez X. Zbudujemy nową rękojeść: korpus, zwężenie przy grocie i krótką szyjkę, bez podziałów potrzebnych wcześniej do rowków.

W Object Mode dodaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> → Mesh → Cylinder i od razu otwórz <kbd>F9</kbd>. Ustaw Vertices 8, Radius 14 mm, Depth 80 mm oraz Location Z 40 mm, X i Y pozostaw 0.

Cylinder powstaje wokół swojego środka, dlatego podnosimy środek o połowę wysokości: dół ma trafić na Z=0, a góra na 80 mm. Osiem boków odtwarza szerokie pola chwytu; gęsty walec nie jest tu potrzebny. Nazwij obiekt LOW_Rekojesc i przenieś go przez <kbd>M</kbd> → LOW do kolekcji kopii.

Wybierz Object → Snap → Cursor to World Origin, a potem Object → Set Origin → Origin to 3D Cursor. Punkt odniesienia nowego chwytu znajdzie się przy podstawie, tak jak w HIGH; sama bryła nie zmieni położenia.

Wejdź w Edit Mode, zaznacz całość i wykonaj <kbd>R</kbd>, <kbd>Z</kbd>, `22.5`, <kbd>Enter</kbd>. Obracamy siatkę wokół jej środka, żeby płaskie pola ustawiły się tak jak w HIGH. Przełącz wybór na ściany klawiszem <kbd>3</kbd>, odznacz wszystko, a przez <kbd>Numpad 7</kbd> spójrz z góry i wybierz górną pokrywę. Zaznaczona ma być tylko ta jedna ściana. Teraz:

1. <kbd>E</kbd>, <kbd>Z</kbd>, `10mm`, <kbd>Enter</kbd> wyciąga kolejny przekrój do wysokości 90 mm.
2. <kbd>S</kbd>, `0.65`, <kbd>Enter</kbd> zwęża ten przekrój, tworząc bark przechodzący w szyjkę. Zwężenie dotyczy nowej pokrywy, a nie całego korpusu.
3. <kbd>E</kbd>, <kbd>Z</kbd>, `6mm`, <kbd>Enter</kbd> przedłuża węższy przekrój, tworząc szyjkę do wysokości 96 mm.

Obróć widok i porównaj obrys z HIGH, włączając na chwilę jego widoczność w Outlinerze. Szerokość korpusu, bark i koniec szyjki powinny się pokrywać. Brakujące zagłębienia są celowym uproszczeniem; przesunięty bark lub inna szerokość chwytu byłyby błędem kształtu. Po kontroli ukryj HIGH.

Wróć do Object Mode. W zakładce z kluczem dodaj Bevel, ustaw Amount 1.5 mm, Segments 1, Limit Method: Angle i Angle 20°. Tym razem nie używamy wag: Angle wybiera krawędzie według kąta między ścianami. Dzięki temu faza powstaje na narożnikach nowej bryły, mimo że nie przypisaliśmy im wag.

Faza ma zbliżyć obrys narożników LOW do zaokrąglonego HIGH. Oceń efekt na modelu; sama zgodność wpisanej szerokości nie gwarantuje zgodności obrysu.

Wybierz Object → Shade Smooth. Wygładzanie zmienia cieniowanie, a nie liczbę boków cylindra. Zastosuj Bevel, dodaj i zastosuj Triangulate tak samo jak w poprzednim wariancie. Za chwilę wskażemy też granice, które mają pozostać ostre.

Na szerokich polach chwytu nie ma już zagłębień. Ich wygląd przeniesiemy z HIGH na tę płaską powierzchnię, zachowując geometrię potrzebną do obrysu narzędzia.

![Gładka siatka wariantu prostszego; zagłębień nie ma w jej geometrii](/public/courses/blender/Images/wkretak-lod1-siatka.png)

## 📐 Ustal normalne, zanim zaczniesz wypalać

Zaznacz rękojeść LOW. Wejdź klawiszem <kbd>Tab</kbd> w Edit Mode, włącz wybór krawędzi klawiszem <kbd>2</kbd> i odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>. Z kursorem nad widokiem 3D naciśnij <kbd>F3</kbd>, wyszukaj Select Sharp Edges i zatwierdź. Od razu naciśnij <kbd>F9</kbd>, aby otworzyć ustawienia tej operacji, i wpisz próg około 50°.

Blender zaznaczy krawędzie, przy których ściany spotykają się pod dostatecznie dużym kątem. Oznacz je <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>E</kbd></span> → Mark Sharp. Po odznaczeniu zobaczysz oznaczenia ostrych krawędzi. Mark Sharp określa granicę wygładzania; nie rozcina siatki. Na grocie użyj około 35°, aby zachować płaskie pola ośmiokątnego trzpienia.

Sprawdź wynik: wybór kątem jest narzędziem selekcji, nie automatycznym projektem wszystkich twardych przejść.

Wróć do Object Mode. W zakładce z kluczem użyj Add Modifier, wyszukaj Weighted Normal, zaznacz w nim Keep Sharp, a potem wybierz Apply z menu nagłówka. Zrób to na obu częściach LOW, już po ich triangulacji.

Weighted Normal koryguje kierunki używane do cieniowania: szerokie pola powinny odbijać światło jak płaskie powierzchnie, zamiast wyglądać na napompowane. Keep Sharp zachowuje oznaczone przed chwilą ostre granice. Ostre przejścia nie powinny uśredniać normalnych płaskiego dna i bocznej ścianki. Duże fazy pozostają wygładzane. Nie zastępuj tego Shade Flat na całym przedmiocie.

Od tej chwili nie zmieniaj normalnych przypadkowo. Mapa zostanie zapisana względem tej konkretnej bazy. Wygładzenie całej siatki po bake może zepsuć efekt, mimo że sam obraz normal mapy się nie zmieni.

## ✂️ Wspólny atlas nie oznacza nakładających się części

Obie części mają otrzymać jeden materiał i jeden atlas, ale na czas wypalania pozostaną osobnymi obiektami. Dla każdej części LOW otwórz Object Data Properties (zielony trójkąt) i rozwiń UV Maps. Jeżeli na liście jest UV_Szlif, zaznacz ten wpis i kliknij minus obok listy.

Usuwasz mapę z kopii LOW, nie z HIGH. Kliknij plus, aby utworzyć mapę docelową, i dwuklikiem nazwij ją UV_Asset. Kliknij jej wiersz, a następnie ikonę aparatu przy nim: ta mapa ma być wybrana do edycji i używana domyślnie przez materiał.

Jeśli obiekt ma już inne, niepotrzebne mapy, usuń je z LOW, pozostawiając jedną UV_Asset. Dzięki temu obrazy materiału docelowego nie pobiorą przypadkowo źródłowego układu szlifu.

Na każdej ostrej krawędzi low poly rozdziel także UV. Obie strony potrzebują własnych kierunków normal mapy i marginesu. Szew UV nie musi jednak tworzyć ostrej normalnej: można przeciąć łagodną powierzchnię, zachowując płynne cieniowanie.

Na każdej części wejdź w Edit Mode i wybór krawędzi. Odznacz wszystko, użyj <kbd>F3</kbd> → Select Sharp Edges, a w <kbd>F9</kbd> ustaw około 35°. Z zaznaczonymi krawędziami wybierz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>E</kbd></span> → Mark Seam. Po odznaczeniu zobaczysz czerwone linie: to miejsca cięcia UV, nie fizyczne szczeliny modelu.

Na rękojeści część dodatkowych cięć rozdzieli powierzchnie, które dla cieniowania pozostawiliśmy gładkie. Dodaj podłużne cięcie z tyłu: wybierz pierwszą krawędź przy dolnej granicy korpusu, z <kbd>Ctrl</kbd> wybierz końcową przy górnej, a wybranej ścieżce nadaj <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>E</kbd></span> → Mark Seam.

Przy <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>LPM</kbd></span> wybierającym najkrótszą ścieżkę sprawdzaj przebieg, żeby zaznaczenie nie skręciło do rowka.

Na grocie rozdziel pętlę przy początku spłaszczenia, około Z=190 mm. W Edit Mode zaznacz z <kbd>Shift</kbd> krawędzie tej poprzecznej granicy i wybierz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>E</kbd></span> → Mark Seam. Następnie zaznacz osiem podłużnych ścieżek pomiędzy polami trzpienia, kontynuując każdą przez odpowiadające jej krawędzie końcówki. Im również nadaj Mark Seam.

Krótki fragment ostrza nie może być osobno rozciągnięty na cały atlas tak samo jak długi trzpień.

Wróć do Object Mode, zaznacz obie części LOW i tymczasowo połącz je <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span>. Nie spawaj wierzchołków: rękojeść i grot pozostają rozłącznymi fragmentami tej samej siatki. W Edit Mode zaznacz całość i użyj <kbd>U</kbd> → Unwrap, metodą Angle Based.

Przenieś kursor nad UV Editor, naciśnij <kbd>A</kbd>, aby zaznaczyć wszystkie wyspy, i wybierz UV → Average Islands Scale. Rękojeść i grot mają teraz dostać podobną ilość pikseli na podobny rozmiar powierzchni. Następnie wybierz UV → Pack Islands.

W ustawieniach pakowania włącz Rotate, ustaw Margin Method: Fraction i Margin 0.008 dla mastera 2048. Pack Islands układa wyspy w kwadracie tekstury i zostawia między nimi odstępy; nie poprawia kształtu rozciągniętej wyspy.

Praca na jednej siatce pozwala porównać powierzchnie rękojeści i grotu w tej samej operacji wyrównywania skali. Samo osobne rozłożenie każdej części może dać inne rozmiary kratek, mimo poprawnych proporcji w obrębie poszczególnych wysp.

Po pakowaniu przenieś kursor nad widok 3D, nadal w Edit Mode zaznacz całość klawiszem <kbd>A</kbd> i użyj <kbd>P</kbd> → By Loose Parts. Wróć przez <kbd>Tab</kbd> do Object Mode i nazwij części ponownie LOW_Rekojesc oraz LOW_Grot. UV pozostaje wspólne i na swoich miejscach.

Rozdzielamy części wyłącznie po to, żeby wypalać je parami.

Do kontroli utwórz nowy materiał LOW_Checker. W Image Texture wybierz New, rozmiar 1024 i Generated Type: Color Grid. Połącz Color z Base Color i przypisz ten sam materiał obu częściom LOW. Materiały HIGH zachowują swoje dotychczasowe węzły.

![Checker i wspólny atlas wariantu z rowkami](/public/courses/blender/Images/wkretak-lod0-uv.png)

![Checker i osobny atlas porównawczego wariantu bez rowków](/public/courses/blender/Images/wkretak-lod1-uv.png)

Sprawdź checker na polach chwytu, ściankach i ostrzu. Average Islands Scale wyrównuje skalę wysp względem powierzchni, ale nie usuwa rozciągnięcia wewnątrz źle rozłożonej wyspy. Jeśli kratki są ściśnięte tylko na początku ostrza, wróć do jego cięć i Unwrap. Samo zwiększenie obrazu nie przywróci prawidłowych proporcji.

Nie pakuj obu części niezależnie na całe 0-1. Nadpisałyby sobie piksele przy bake. Źródłowy UV_Szlif materiału stali i docelowy UV_Asset mają różne zadania; kierunek szlifu przeniesiemy z materiału HIGH, nie będziemy ustawiać go obrotem całego atlasu.

## 🔭 LOD wybiera szczegół według wielkości na ekranie

LOD, Level of Detail, to wersja modelu o określonym poziomie szczegółowości. W zestawie porównawczym LOD0 zachowuje rowki, LOD1 ma gładki chwyt i ich wypalony relief. High poly jest źródłem produkcyjnym, a nie kolejnym LOD ładowanym do gry.

![Oba warianty po wypalaniu: z bliska oraz przy małej wielkości na ekranie](/public/courses/blender/Images/wkretak-lod-odleglosc.png)

Porównaj te same narożniki i zakończenia rowków. Z bliska sprawdzaj obrys, zasłanianie powierzchni i zachowanie refleksu. Po oddaleniu sprawdź, które różnice rzeczywiście zostały. Dla narzędzia leżącego w tle sam wariant 280 trójkątów może wystarczyć, bez utrzymywania dokładniejszego poziomu. Do inspekcji przedmiotu przy kamerze warto zachować wariant dokładniejszy.

Nie ustalamy jednej odległości przełączenia w metrach dla każdej gry. Znaczenie mają rozmiar na ekranie, pole widzenia, rozdzielczość i sposób oglądania. Przełączenie powinno nastąpić, zanim zmiana geometrii zacznie rzucać się w oczy. Silnik może stopniowo mieszać widoczność dwóch poziomów, aby złagodzić przełączenie. Nie zastąpi to zgodności obrysu; konfigurację takiego przejścia wykonuje się w silniku.

W tym porównaniu każdy LOD ma własny bake i atlas, aby poprawnie pokazać skutki zmiany topologii i bazy normalnych. To ma koszt tekstur. W produkcji często projektuje się LOD pod współdzielone UV i materiały. Nie można obiecać, że samo usunięcie ścian zachowa poprawność starej tangent normal mapy. Przy tak małym narzędziu oszczędność 192 trójkątów należy zestawić także z kosztem kolejnego materiału, map i przełączenia.

Pobierz [wariant z rowkami i UV](/public/courses/blender/Resources/wkretak-LOD0-uv.blend) albo [wariant bez rowków i UV](/public/courses/blender/Resources/wkretak-LOD1-uv.blend). W obu zachowano HIGH jako źródło. Teraz wypalimy mapy i ocenimy, ile wyglądu rzeczywiście przeszło na prostsze siatki.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

W LOW zachowuj geometrię potrzebną do obrysu i bliskich ujęć. Szczegół odbicia możesz przenieść do normal mapy. Przed bake ustal trójkąty, normalne i UV; oceniaj oszczędność geometrii razem z kosztem dodatkowych map.
