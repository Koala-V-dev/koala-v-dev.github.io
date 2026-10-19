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

Przenieś kopie do kolekcji LOW i nazwij LOW_Rekojesc oraz LOW_Grot. Ukryj HIGH. Na rękojeści zmień Segments Bevel z 6 na **1**. W Edit Mode przejdź do wyboru krawędzi (`2`). Krawędzie rowków o wadze 0.2 ustaw na **0**: wybierz jedną, użyj **Shift+G → Bevel**, sprawdź zaznaczenie i zmień Mean Bevel Weight w Edges Data. Duże narożniki o wadze 1 zachowują pojedynczy pas fazy, drobne promienie przejmie mapa.

Na LOW_Grot usuń Bevel. Ośmiokątny trzpień i płaskie ostrze zostają; znikają tylko mikrofazy. Sprawdź obrys w powiększeniu i po oddaleniu. To miejsce na zachowanie prostej fazy, jeśli twoje ujęcie naprawdę jej potrzebuje.

W Object Mode zastosuj pozostałe modyfikatory kopii LOW w kolejności: Bevel, potem Weighted Normal. Dodaj **Triangulate**, ustaw Quad Method **Fixed** i zastosuj. HIGH pozostaje nietknięte.

![High poly i dwa docelowe warianty siatki rękojeści](/public/courses/blender/Images/wkretak-siatki-lod.png)

Triangulujemy przed bake, bo tangent normal mapa zależy od interpolacji konkretnych trójkątów, normalnych i UV. Zmiana przekątnej po wypalaniu może ujawnić ukośny ślad na tej samej pozornie płaskiej ścianie. Silnik i tak użyje trójkątów; ustalamy ten podział, zamiast oddawać go przypadkowi.

## 🧱 Wariant bez rowków: nie modeluj niewidocznych zagłębień

Zapisz drugi plik. Zachowaj HIGH i uproszczony grot, ale zastąp rękojeść nową bryłą z **tych samych czterech głównych przekrojów** co na początku modelowania. Cylinder: 8 boków, promień 14 mm, wysokość 80 mm, podstawa na Z=0. Obrót siatki R Z 22.5, potem górna pokrywa: E Z 0.01, S 0.65, E Z 0.006.

Nie dodawaj pierścieni wyznaczających końce rowków ani samych rowków. Dodaj Bevel o szerokości około 1.5 mm, Segments 1, Limit Method Angle z progiem około 20°. Ma utrzymać zbliżony obrys zaokrąglonych narożników. Następnie dodaj Weighted Normal i wybierz **Object → Shade Smooth**. Zastosuj oba modyfikatory, dodaj i zastosuj Triangulate tak samo jak wcześniej. Podział ostrych normalnych ustalimy poniżej.

To nie jest gładki walec zastępujący ośmiokątny chwyt. Zachowujemy jego szerokie pola i proporcje. Usuwamy tę część geometrii, której wygląd chcemy przenieść do mapy.

![Gładka siatka wariantu prostszego; zagłębień nie ma w jej geometrii](/public/courses/blender/Images/wkretak-lod1-siatka.png)

## 📐 Ustal normalne, zanim zaczniesz wypalać

Wybierz krawędzie rękojeści przez **F3 → Select Sharp Edges**, z progiem około **50°** w panelu ostatniej operacji. Oznacz je **Ctrl+E → Mark Sharp**. Na grocie użyj około **35°**, aby zachować płaskie pola ośmiokątnego trzpienia. Sprawdź wynik: wybór kątem jest narzędziem selekcji, nie automatycznym projektem wszystkich twardych przejść.

Dodaj Weighted Normal z Keep Sharp i zastosuj go już na ustalonej, triangulowanej siatce. Ostre przejścia nie powinny uśredniać normalnych płaskiego dna i bocznej ścianki. Duże fazy pozostają wygładzane. Nie zastępuj tego Shade Flat na całym przedmiocie.

Od tej chwili nie zmieniaj normalnych przypadkowo. Mapa zostanie zapisana względem tej konkretnej bazy. Wygładzenie całej siatki po bake może zepsuć efekt, mimo że sam obraz normal mapy się nie zmieni.

## ✂️ Wspólny atlas nie oznacza nakładających się części

Obie części mają otrzymać jeden materiał i jeden atlas, ale na czas wypalania pozostaną osobnymi obiektami. Na kopiach LOW usuń nieużywany źródłowy UV_Szlif, pozostawiając go w HIGH. Utwórz docelowy UV **UV_Asset** i ustaw go jako aktywny do edycji oraz renderowania. Dzięki temu obrazy materiału docelowego nie pobiorą przypadkowo źródłowego układu szlifu.

Na każdej ostrej krawędzi low poly rozdziel także UV. Obie strony potrzebują własnych kierunków normal mapy i marginesu. **Szew UV nie musi jednak tworzyć ostrej normalnej**: można przeciąć łagodną powierzchnię, zachowując płynne cieniowanie.

Dla tych brył użyj Select Sharp Edges od około **35°** i Mark Seam. Na rękojeści część dodatkowych cięć rozdzieli powierzchnie, które dla cieniowania pozostawiliśmy gładkie. Dodaj podłużne cięcie z tyłu, łączące dolną i górną granicę korpusu. Przy Ctrl+klik wybierającym najkrótszą ścieżkę sprawdzaj przebieg, żeby zaznaczenie nie skręciło do rowka.

Na grocie rozdziel pętlę przy **początku spłaszczenia**, około Z=190 mm. Poprowadź podłużne cięcia pomiędzy ośmioma polami trzpienia i dalej po odpowiadających im krawędziach końcówki. Krótki fragment ostrza nie może być osobno rozciągnięty na cały atlas tak samo jak długi trzpień.

Zaznacz obie części LOW i tymczasowo połącz je **Ctrl+J**. Nie spawaj wierzchołków: rękojeść i grot pozostają rozłącznymi fragmentami tej samej siatki. W Edit Mode zaznacz całość i użyj **U → Unwrap**, metodą Angle Based. W UV Editor zaznacz wszystkie wyspy, wykonaj **Average Islands Scale**, potem **Pack Islands**, z Rotate włączonym, Margin Method Fraction i marginesem około **0.008** dla mastera 2048.

Praca na jednej siatce pozwala porównać powierzchnie rękojeści i grotu w tej samej operacji wyrównywania skali. Samo osobne rozłożenie każdej części może dać inne rozmiary kratek, mimo poprawnych proporcji w obrębie poszczególnych wysp. Po pakowaniu użyj **P → By Loose Parts**, wróć do Object Mode i nazwij części ponownie LOW_Rekojesc oraz LOW_Grot. UV pozostaje wspólne i na swoich miejscach. Rozdzielamy części wyłącznie po to, żeby wypalać je parami.

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
