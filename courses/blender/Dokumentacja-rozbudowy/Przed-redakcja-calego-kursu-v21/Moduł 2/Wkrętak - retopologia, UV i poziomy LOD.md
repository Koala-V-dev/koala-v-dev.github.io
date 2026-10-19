# Wkrętak - retopologia, UV i poziomy LOD

Mały wkrętak nie musi mieć wszystkich rowków w geometrii. Zbudujemy dwa warianty i porównamy je w tym samym kadrze: **472 trójkąty z rowkami** oraz **280 bez rowków**, które odtworzymy normal mapą. Dopiero widoczna różnica przy danej wielkości na ekranie rozstrzygnie, którego użyć.

Otwórz [high poly z materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend). HIGH zostaje źródłem, z edytowalnymi modyfikatorami. Kopie wykonuj przez Shift+D, potem PPM, żeby pozostawały dokładnie w tym samym miejscu. Do bake źródło i cel muszą na siebie trafiać; rozstawimy je obok siebie dopiero do ilustracji, nie w pliku roboczym.

## 🎯 Retopologia jest decyzją o kształcie

Retopologia oznacza przygotowanie siatki odpowiadającej zastosowaniu. Przy skanie lub rzeźbie często budujemy ją od nowa na powierzchni high poly. Tutaj wykorzystamy istniejącą siatkę sterującą, a dla prostszego chwytu wrócimy do czterech przekrojów.

Normal mapa zmienia kierunek odbijania światła. **Nie zmienia obrysu, nie wycina otworów i nie odtwarza rzeczywistego zasłaniania powierzchni.** Z bliska może więc być widać różnicę głębokości, choć sam zarys rowka wygląda poprawnie. Gdy narzędzie zajmuje kilkadziesiąt pikseli, wiele takich różnic przestaje mieć znaczenie.

| Część | Wariant dokładniejszy | Wariant prostszy |
| --- | --- | --- |
| Korpus, bark i szyjka | Geometria | Geometria |
| Duże narożniki chwytu | Proste fazy w geometrii | Proste fazy w geometrii |
| Rowki | Geometria i drobne zaokrąglenia z mapy | Cały relief z normal mapy |
| Mikrofazy stali i ziarno powierzchni | Normal mapa | Normal mapa |

O przydatności uproszczenia decyduje widoczny efekt. Jeżeli usunięta krawędź psuje widoczny obrys, mapa jej nie odda. Jeżeli szczegół znika po oddaleniu, kilka dodatkowych pasów ścian może już nie dawać korzyści.

## 🪚 Wariant z rowkami: uprość wynik modyfikatorów

Zacznij od kopii obu części. W Object Mode zaznacz rękojeść i grot, naciśnij **Shift+D**, a następnie **PPM**, żeby anulować samo przesuwanie. Kopie już istnieją i pozostają na źródle. Z nadal zaznaczonymi kopiami naciśnij **M → New Collection**, wpisz **LOW** i zatwierdź. W Outlinerze rozwiń LOW, nazwij jej obiekty **LOW_Rekojesc** i **LOW_Grot**. Kliknij oko przy kolekcji **HIGH**. W widoku mają zostać tylko kopie; rozwinięta kolekcja LOW pozwala sprawdzić, czy trafiły do niej obie części.

Zaznacz LOW_Rekojesc. Po prawej otwórz **Modifiers Properties**, czyli zakładkę z kluczem. Rozwiń istniejący **Bevel** i zmień **Segments z 6 na 1**. Zamiast kilku wąskich pasów tworzących łuk zostanie jeden płaski pas fazy. Obróć widok: chwyt ma zachować szerokie pola i zaokrąglony obrys, choć z bliska faza będzie prostsza.

W tym Bevel pole **Limit Method** jest ustawione na **Weight**. Oznacza to, że modyfikator czyta liczbę przypisaną do każdej krawędzi. **Waga 1 daje pełną ustawioną szerokość fazy, 0.2 daje jedną piątą tej szerokości, a 0 wyłącza fazowanie danej krawędzi.** Nie jest to waga materiału ani wierzchołka. W naszym modelu główne narożniki mają 1, a drobne obrzeża rowków 0.2. Chcemy usunąć tylko te drobne fazy; same zagłębienia nadal zostaną w siatce.

Żeby znaleźć i zmienić właściwe krawędzie:

1. Z kursorem nad widokiem 3D naciśnij **Tab**, aby wejść w Edit Mode, potem **2 z górnego rzędu klawiatury**, aby wybierać krawędzie. Odznacz wszystko przez **Alt+A**. Przybliż jeden rowek i kliknij krawędź na styku jego dna z boczną ścianką.
2. Naciśnij **N** w widoku 3D. W bocznym panelu otwórz **Item**, a w nim **Edges Data**. Odczytaj **Mean Bevel Weight**: dla tej krawędzi powinno być **0.2**. Wyżej możesz widzieć podobnie nazwane pole w **Vertices Data**. Tutaj pracujemy w **Edges Data**, bo modyfikator fazuje krawędzie.
3. Jeżeli widzisz 1, zaznaczyłeś główny narożnik; jeżeli 0, inną krawędź siatki. Zmień wybór, aż odczytasz 0.2. Dopiero wtedy, z kursorem z powrotem nad modelem, naciśnij **Shift+G** i wybierz **Bevel**. To wybór podobnych krawędzi według ich wagi Bevel. Blender nie rozpoznaje rowków: szuka krawędzi z taką samą wartością jak wybrana.
4. Obróć model i sprawdź zaznaczenie. Powinny zaznaczyć się drobne obrzeża rowków, a nie długie zewnętrzne narożniki chwytu. W **Item → Edges Data → Mean Bevel Weight** wpisz **0** i zatwierdź Enterem. Zmiana dotyczy wszystkich zaznaczonych krawędzi.
5. Wróć przez **Tab** do Object Mode. Drobne zaokrąglenia rowków powinny zniknąć, ale zagłębienia i duże fazy pozostają. Jeżeli zniknęły także główne fazy, cofnij zmianę i sprawdź wybór krawędzi.

![Pole Mean Bevel Weight w sekcji Edges Data i modyfikator Bevel ograniczony wagami](/public/courses/blender/Images/wkretak-wagi.png)

Na ilustracji zaznaczone są główne narożniki, dlatego pole pokazuje **1.00**. Przy wybieraniu obrzeża rowka masz odczytać **0.20**; zdjęcie pokazuje miejsce odczytu, nie wartość do skopiowania. Zwróć uwagę na **Edges Data** w panelu Item oraz **Weight** w modyfikatorze. Pierwsze pole przechowuje wagę zaznaczonych krawędzi, drugie mówi modyfikatorowi, żeby tych wag używał. Przy zaznaczeniu krawędzi o różnych wagach pole pokazuje średnią, dlatego odczyt zaczęliśmy od jednej krawędzi.

Teraz wybierz **LOW_Grot** w Outlinerze. W zakładce z kluczem usuń jego **Bevel**, klikając **X w nagłówku tego modyfikatora**. Ośmiokątny trzpień i płaskie ostrze mają zostać; usuwasz zaokrąglenia, a nie samą końcówkę. Obejrzyj obrys z bliska i przy wielkości całego narzędzia. Jeżeli bez fazy ostrze wyraźnie traci potrzebny kształt, cofnij usunięcie i zachowaj prostą fazę z jednym segmentem.

Zanim przejdziemy do UV, utrwalimy wynik modyfikatorów w siatce LOW. **Apply w nagłówku modyfikatora** zamienia jego widoczny wynik na rzeczywiste wierzchołki i ściany. Od tej chwili nie zmienisz już Segments tego modyfikatora, dlatego zachowujemy edytowalne HIGH.

W Object Mode zaznacz LOW_Rekojesc. W nagłówku Bevel otwórz menu ze strzałką w dół i wybierz **Apply**. Następnie tak samo zastosuj **Weighted Normal** poniżej. Na LOW_Grot zastosuj pozostały Weighted Normal. To menu modyfikatora w zakładce z kluczem, a nie menu transformacji otwierane przez Ctrl+A.

Na każdej części LOW dodaj następnie modyfikator: **Add Modifier**, wyszukaj **Triangulate**, ustaw **Quad Method: Fixed** i użyj jego **Apply**. Triangulate dzieli czworokąty na trójkąty. W Edit Mode zobaczysz teraz przekątne ścian. Nie dodaje nimi nowego kształtu; ustala podział, względem którego wypalimy mapę.

![High poly i dwa docelowe warianty siatki rękojeści](/public/courses/blender/Images/wkretak-siatki-lod.png)

Triangulujemy przed bake, bo tangent normal mapa zależy od interpolacji konkretnych trójkątów, normalnych i UV. Zmiana przekątnej po wypalaniu może ujawnić ukośny ślad na tej samej pozornie płaskiej ścianie. Silnik i tak użyje trójkątów; ustalamy ten podział, zamiast oddawać go przypadkowi.

## 🧱 Wariant bez rowków: nie modeluj niewidocznych zagłębień

Zapisz drugi plik przez **File → Save As**. W nim zachowaj HIGH i uproszczony LOW_Grot. W Outlinerze wybierz wyłącznie **LOW_Rekojesc** i usuń ją przez X. Zbudujemy nową rękojeść: korpus, zwężenie przy grocie i krótką szyjkę, bez podziałów potrzebnych wcześniej do rowków.

W Object Mode dodaj **Shift+A → Mesh → Cylinder** i od razu otwórz **F9**. Ustaw **Vertices 8**, **Radius 14 mm**, **Depth 80 mm** oraz **Location Z 40 mm**, X i Y pozostaw 0. Cylinder powstaje wokół swojego środka, dlatego podnosimy środek o połowę wysokości: dół ma trafić na Z=0, a góra na 80 mm. Osiem boków odtwarza szerokie pola chwytu; gęsty walec nie jest tu potrzebny. Nazwij obiekt LOW_Rekojesc i przenieś go przez **M → LOW** do kolekcji kopii.

Wejdź w Edit Mode, zaznacz całość i wykonaj **R Z 22.5 Enter**. Obracamy siatkę wokół jej środka, żeby płaskie pola ustawiły się tak jak w HIGH. Przełącz wybór na ściany klawiszem **3**, odznacz wszystko, a przez **Num7** spójrz z góry i wybierz górną pokrywę. Zaznaczona ma być tylko ta jedna ściana. Teraz:

1. **E Z 10mm Enter** wyciąga kolejny przekrój do wysokości 90 mm.
2. **S 0.65 Enter** zwęża ten przekrój, tworząc bark przechodzący w szyjkę. Zwężenie dotyczy nowej pokrywy, a nie całego korpusu.
3. **E Z 6mm Enter** przedłuża węższy przekrój, tworząc szyjkę do wysokości 96 mm.

Obróć widok i porównaj obrys z HIGH, włączając na chwilę jego widoczność w Outlinerze. Szerokość korpusu, bark i koniec szyjki powinny się pokrywać. Brakujące zagłębienia są celowym uproszczeniem; przesunięty bark lub inna szerokość chwytu byłyby błędem kształtu. Po kontroli ukryj HIGH.

Wróć do Object Mode. W zakładce z kluczem dodaj **Bevel**, ustaw **Amount 1.5 mm**, **Segments 1**, **Limit Method: Angle** i **Angle 20°**. Tym razem nie używamy wag: Angle wybiera krawędzie według kąta między ścianami. Dzięki temu faza powstaje na narożnikach nowej bryły, mimo że nie przypisaliśmy im wag. Ma zbliżyć obrys narożników LOW do zaokrąglonego HIGH. Oceń efekt na modelu; sama zgodność wpisanej szerokości nie gwarantuje zgodności obrysu.

Dodaj **Weighted Normal** i wybierz **Object → Shade Smooth**. Wygładzanie zmienia cieniowanie, a nie liczbę boków cylindra. Zastosuj Bevel, potem Weighted Normal, dodaj i zastosuj Triangulate tak samo jak w poprzednim wariancie. Za chwilę wskażemy też granice, które mają pozostać ostre.

To nie jest gładki walec zastępujący ośmiokątny chwyt. Zachowujemy jego szerokie pola i proporcje. Usuwamy tę część geometrii, której wygląd chcemy przenieść do mapy.

![Gładka siatka wariantu prostszego; zagłębień nie ma w jej geometrii](/public/courses/blender/Images/wkretak-lod1-siatka.png)

## 📐 Ustal normalne, zanim zaczniesz wypalać

Zaznacz rękojeść LOW. Wejdź Tabem w Edit Mode, włącz wybór krawędzi klawiszem **2** i odznacz wszystko przez **Alt+A**. Z kursorem nad widokiem 3D naciśnij **F3**, wyszukaj **Select Sharp Edges** i zatwierdź. Od razu naciśnij **F9**, aby otworzyć ustawienia tej operacji, i wpisz próg około **50°**. Blender zaznaczy krawędzie, przy których ściany spotykają się pod dostatecznie dużym kątem. Oznacz je **Ctrl+E → Mark Sharp**. Na grocie użyj około **35°**, aby zachować płaskie pola ośmiokątnego trzpienia. Sprawdź wynik: wybór kątem jest narzędziem selekcji, nie automatycznym projektem wszystkich twardych przejść.

Wróć do Object Mode. W zakładce z kluczem użyj **Add Modifier**, wyszukaj **Weighted Normal**, zaznacz w nim **Keep Sharp**, a potem wybierz Apply z menu nagłówka. Zrób to na obu częściach LOW, już po ich triangulacji. Weighted Normal koryguje kierunki używane do cieniowania: szerokie pola powinny odbijać światło jak płaskie powierzchnie, zamiast wyglądać na napompowane. Keep Sharp zachowuje oznaczone przed chwilą ostre granice. Ostre przejścia nie powinny uśredniać normalnych płaskiego dna i bocznej ścianki. Duże fazy pozostają wygładzane. Nie zastępuj tego Shade Flat na całym przedmiocie.

Od tej chwili nie zmieniaj normalnych przypadkowo. Mapa zostanie zapisana względem tej konkretnej bazy. Wygładzenie całej siatki po bake może zepsuć efekt, mimo że sam obraz normal mapy się nie zmieni.

## ✂️ Wspólny atlas nie oznacza nakładających się części

Obie części mają otrzymać jeden materiał i jeden atlas, ale na czas wypalania pozostaną osobnymi obiektami. Dla każdej części LOW otwórz **Object Data Properties** (zielony trójkąt) i rozwiń **UV Maps**. Jeżeli na liście jest UV_Szlif, zaznacz ten wpis i kliknij **minus obok listy**. Usuwasz mapę z kopii LOW, nie z HIGH. Kliknij **plus**, aby utworzyć mapę docelową, i dwuklikiem nazwij ją **UV_Asset**. Kliknij jej wiersz, a następnie ikonę aparatu przy nim: ta mapa ma być wybrana do edycji i używana domyślnie przez materiał. Jeśli obiekt ma już inne, niepotrzebne mapy, usuń je z LOW, pozostawiając jedną UV_Asset. Dzięki temu obrazy materiału docelowego nie pobiorą przypadkowo źródłowego układu szlifu.

Na każdej ostrej krawędzi low poly rozdziel także UV. Obie strony potrzebują własnych kierunków normal mapy i marginesu. **Szew UV nie musi jednak tworzyć ostrej normalnej**: można przeciąć łagodną powierzchnię, zachowując płynne cieniowanie.

Na każdej części wejdź w Edit Mode i wybór krawędzi. Odznacz wszystko, użyj **F3 → Select Sharp Edges**, a w **F9** ustaw około **35°**. Z zaznaczonymi krawędziami wybierz **Ctrl+E → Mark Seam**. Po odznaczeniu zobaczysz czerwone linie: to miejsca cięcia UV, nie fizyczne szczeliny modelu. Na rękojeści część dodatkowych cięć rozdzieli powierzchnie, które dla cieniowania pozostawiliśmy gładkie. Dodaj podłużne cięcie z tyłu, łączące dolną i górną granicę korpusu. Przy Ctrl+klik wybierającym najkrótszą ścieżkę sprawdzaj przebieg, żeby zaznaczenie nie skręciło do rowka.

Na grocie rozdziel pętlę przy **początku spłaszczenia**, około Z=190 mm. Poprowadź podłużne cięcia pomiędzy ośmioma polami trzpienia i dalej po odpowiadających im krawędziach końcówki. Krótki fragment ostrza nie może być osobno rozciągnięty na cały atlas tak samo jak długi trzpień.

Wróć do **Object Mode**, zaznacz obie części LOW i tymczasowo połącz je **Ctrl+J**. Nie spawaj wierzchołków: rękojeść i grot pozostają rozłącznymi fragmentami tej samej siatki. W Edit Mode zaznacz całość i użyj **U → Unwrap**, metodą Angle Based. Przenieś kursor nad **UV Editor**, naciśnij **A**, aby zaznaczyć wszystkie wyspy, i wybierz **UV → Average Islands Scale**. Rękojeść i grot mają teraz dostać podobną ilość pikseli na podobny rozmiar powierzchni. Następnie wybierz **UV → Pack Islands**. W ustawieniach pakowania włącz **Rotate**, ustaw **Margin Method: Fraction** i **Margin 0.008** dla mastera 2048. Pack Islands układa wyspy w kwadracie tekstury i zostawia między nimi odstępy; nie poprawia kształtu rozciągniętej wyspy.

Praca na jednej siatce pozwala porównać powierzchnie rękojeści i grotu w tej samej operacji wyrównywania skali. Samo osobne rozłożenie każdej części może dać inne rozmiary kratek, mimo poprawnych proporcji w obrębie poszczególnych wysp. Po pakowaniu przenieś kursor nad **widok 3D**, nadal w Edit Mode zaznacz całość klawiszem A i użyj **P → By Loose Parts**. Wróć przez Tab do Object Mode i nazwij części ponownie LOW_Rekojesc oraz LOW_Grot. UV pozostaje wspólne i na swoich miejscach. Rozdzielamy części wyłącznie po to, żeby wypalać je parami.

Do kontroli utwórz nowy materiał **LOW_Checker**. W Image Texture wybierz New, rozmiar 1024 i **Generated Type: Color Grid**. Połącz Color z Base Color i przypisz ten sam materiał obu częściom LOW. Materiały HIGH zachowują swoje dotychczasowe węzły.

![Checker i wspólny atlas wariantu z rowkami](/public/courses/blender/Images/wkretak-lod0-uv.png)

![Checker i osobny atlas porównawczego wariantu bez rowków](/public/courses/blender/Images/wkretak-lod1-uv.png)

Sprawdź checker na polach chwytu, ściankach i ostrzu. Average Islands Scale wyrównuje skalę wysp względem powierzchni, ale nie usuwa rozciągnięcia wewnątrz źle rozłożonej wyspy. Jeśli kratki są ściśnięte tylko na początku ostrza, wróć do jego cięć i Unwrap. Samo zwiększenie obrazu nie przywróci prawidłowych proporcji.

Nie pakuj obu części niezależnie na całe 0-1. Nadpisałyby sobie piksele przy bake. Źródłowy UV_Szlif materiału stali i docelowy UV_Asset mają różne zadania; kierunek szlifu przeniesiemy z materiału HIGH, nie będziemy ustawiać go obrotem całego atlasu.

## 🔭 LOD wybiera szczegół według wielkości na ekranie

**LOD, Level of Detail**, to wersja modelu o określonym poziomie szczegółowości. W zestawie porównawczym LOD0 zachowuje rowki, LOD1 ma gładki chwyt i ich wypalony relief. High poly jest źródłem produkcyjnym, a nie kolejnym LOD ładowanym do gry.

![Oba warianty po wypalaniu: z bliska oraz przy małej wielkości na ekranie](/public/courses/blender/Images/wkretak-lod-odleglosc.png)

Porównaj te same narożniki i zakończenia rowków. Z bliska sprawdzaj obrys, zasłanianie powierzchni i zachowanie refleksu. Po oddaleniu sprawdź, które różnice rzeczywiście zostały. Dla narzędzia leżącego w tle **sam wariant 280 trójkątów może wystarczyć**, bez utrzymywania dokładniejszego poziomu. Do inspekcji przedmiotu przy kamerze warto zachować wariant dokładniejszy.

Nie ustalamy jednej odległości przełączenia w metrach dla każdej gry. Znaczenie mają rozmiar na ekranie, pole widzenia, rozdzielczość i sposób oglądania. Przełączenie powinno nastąpić, zanim zmiana geometrii zacznie rzucać się w oczy. Silnik może wygładzać zmianę przez przejście lub dithering; nie naprawi to radykalnie innego obrysu.

W tym porównaniu każdy LOD ma własny bake i atlas, aby poprawnie pokazać skutki zmiany topologii i bazy normalnych. To ma koszt tekstur. W produkcji często projektuje się LOD pod współdzielone UV i materiały. Nie można obiecać, że samo usunięcie ścian zachowa poprawność starej tangent normal mapy. Przy tak małym narzędziu oszczędność 192 trójkątów należy zestawić także z kosztem kolejnego materiału, map i przełączenia.

Pobierz [wariant z rowkami i UV](/public/courses/blender/Resources/wkretak-LOD0-uv.blend) albo [wariant bez rowków i UV](/public/courses/blender/Resources/wkretak-LOD1-uv.blend). W obu zachowano HIGH jako źródło. Teraz wypalimy mapy i ocenimy, ile wyglądu rzeczywiście przeszło na prostsze siatki.
