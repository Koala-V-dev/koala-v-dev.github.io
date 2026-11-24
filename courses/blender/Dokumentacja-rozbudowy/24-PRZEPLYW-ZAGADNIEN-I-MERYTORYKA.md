# Przepływ zagadnień i merytoryka kursu Blender

Data: 2026-10-17. Zakres: wszystkie 17 aktywnych lekcji z `Pages/_index.md`. Środowisko materiałów: Blender 5.2.2 LTS, angielskie nazwy interfejsu, domyślna mapa klawiszy. To dokument autora, nie lekcja.

## Wersja M0.1 zaakceptowana stylistycznie przez autora

Autor po własnej korekcie uznał pierwszą lekcję za czytelną. Aktualna wersja w Pages jest nadrzędna wobec roboczego v22-first-lesson.md. Nie nadpisywać jej starszymi generatorami edit_course_v21.py, rewrite_v20.py ani kopią v22.

Własne zmiany autora: elementy menu oznaczone przez `<kbd class="win-menu-btn">`, objaśnienie ŚPM wydzielone jako TIP, kierunki widoków skojarzone kolorystycznie z osiami, polskie i angielskie nazwy elementów siatki, usunięte zdanie „Zaznaczenie ponownie obejmuje cały blat”, wyraźniejsze przerwy między czynnościami. Dodany zrzut `tryby-okien-i-zarządzanie-sekcjami.png` pokazuje wybór typu edytora oraz dzielenie i łączenie sekcji okna. Zrzut obejrzano, a zmiany porównano z v22.

Wniosek do następnych lekcji: instrukcja ma prowadzić przez widoczne elementy interfejsu i aktualny stan modelu. Formatowanie rozróżnia menu, klawisze, parametry i pojęcia. Zrzut umieszczony przy pierwszej czynności może zastąpić niejasny opis. Usuwać zdania bez informacji potrzebnej w danym momencie. Nie kopiować mechanicznie liczby sekcji, kolorów ani długości akapitów. Pozostałe lekcje nadal wymagają takiej redakcji i oceny autora.
## Ocena autora po redakcji v21 i zmiana M0.1

Autor odrzucił v21 jako mechaniczną redakcję, która nie poprawiła jakości nauczania. Jej wyniki techniczne opisane niżej nie oznaczają akceptacji materiału. Nie kontynuować ograniczania kolorów do jednej kotwicy na stronę ani automatycznego dzielenia akapitów jako metody poprawy dydaktycznej.

M0.1 przepisano ponownie: początek prowadzi od razu do uruchomienia sceny, UI opisuje sekcje okna i zmienne typy edytorów, używa pojęcia obiektu, usuwa abstrakcyjne pouczenia o klawiaturze i osiach przed pierwszą czynnością. Kierunki są wyjaśniane przy wymiarach i powielaniu. Różnica Object/Edit i znaczenie topologii wynikają z porównania skalowania kostki z dodaniem ścian przez Bevel. Kolory mają różne funkcje i nie są mechanicznym pogrubieniem. Pozostałe 16 lekcji nadal wymaga ponownej oceny po odrzuceniu v21. Nowa pierwsza lekcja również czeka na ocenę autora.
## Jak używać tego dokumentu w następnej sesji

1. Czytaj go razem z aktualnym indeksem i treścią lekcji, którą zamierzasz zmienić. Nie odtwarzaj kursu wyłącznie z raportów 06-23: zawierają historyczne, później odrzucone wersje.
2. Sprawdź uwagi promotora przygotowywane przez autora. Nie nadpisuj jego pliku ani nie uznawaj własnego przeglądu za rozstrzygnięcie tych uwag.
3. Przy nowym pojęciu wskaż wcześniejsze wyjaśnienie i faktyczne zastosowanie. Samo wystąpienie nazwy nie oznacza opanowania umiejętności.
4. Po zmianie dopisz tutaj jej wpływ na zależności, plik wejściowy i wynik. Komentarze o produkcji materiału pozostaw poza `Pages`.

Źródła kursu: `C:\Users\rudek\Desktop\htdocs\public\courses\blender`. `C:\xampp\htdocs` to inny projekt; służył jako katalog roboczy narzędzi redakcyjnych. Nie przenoś tam aktywnej treści przez pomylenie katalogów.

## Stan przeglądu

Wszystkie 17 lekcji przeczytano i zmieniono redakcyjnie. Zachowano nazwy, kolejność oraz istniejące ilustracje i zasoby. Uzupełniono wskazane niżej luki instrukcyjne i pojęciowe. Status dydaktyczny: do recenzji autora, przed pilotażem. Nie deklarujemy opanowania materiału przez uczniów ani osiągnięcia poziomu produkcyjnego na podstawie kompilacji.

Redakcja nie była ponownym wykonaniem wszystkich operacji myszą w Blenderze. Zasoby `.blend`, bake i eksporty pochodzą z poprzednich etapów. Zmiany tekstu wymagające szczególnej kontroli praktycznej: wybór krawędzi wagami, ręczne projekcje UV_Szlif, ustawienie celu bake i powrót z tymczasowego Emission. Weryfikacja dokumentacji internetowej w tej sesji była częściowa: część bezpośrednich stron Manual zwróciła błąd pobrania. Nie traktować tych prób jako przeczytania całej dokumentacji 5.2.

## Główna ścieżka umiejętności

Stół uczy rozpoznawania stanu sceny i budowania z części. Młotek przenosi pracę na siatkę, a następnie na materiały i obrazy. Wkrętaki wymagają samodzielnego rozdzielenia kształtu, cieniowania i danych powierzchni, a potem ich przeniesienia do lżejszej siatki.

| Etap | Uczeń pracuje na | Główna decyzja |
| --- | --- | --- |
| M0 | Części stołu i hierarchia sceny | Który obiekt lub fragment siatki zmienić i co powinno się poruszać razem |
| M1, model i materiały | Osobny młotek, dwa materiały | Czy problem dotyczy geometrii, normalnych, światła czy właściwości powierzchni |
| M1, UV i obrazy | Szwy, wyspy i wspólny atlas | Gdzie przeciąć, jak rozłożyć i ile pikseli przydzielić |
| M1, bake i retusz | Źródłowe UV oraz docelowy obraz | Skąd odczytać wygląd, gdzie go zapisać i którą mapę poprawić |
| M2, modelowanie | Przekroje i stos modyfikatorów | Jak utrzymać płaskie pola, promienie oraz ciągły obrys |
| M2, materiały | Proceduralne tworzywo i stal | Jak sterować kierunkiem, skalą wzoru i maską koloru |
| M2, LOW i bake | Dwa warianty siatki z mapami | Co zachować w geometrii i czy oszczędność jest widoczna oraz opłacalna |

## Moduł 0: pierwszy model

### M0.1 Pierwszy model - stół warsztatowy

- Wejście: nowa scena General. Bez znajomości Blendera.
- Nowe: edytory, zaznaczenie, osie, kontekst kursora, jednostki, Dimensions, Location, origin, Scale i Apply Scale; nawigacja; Object/Edit Mode; wierzchołek, krawędź, ściana; Bevel w siatce; zapis projektu.
- Zależność: położenie środka i połowa wymiaru wyjaśniają styki blatu i nóg. Powielanie stosuje osie, zamiast przypadkowego przesuwania w perspektywie.
- Kontrola ucznia: cztery nogi stoją na Z=0 i dochodzą do spodu blatu; Apply Scale zachowuje Dimensions; faza zmienia krawędzie, nie całe położenie stołu.
- Redakcja: dodano kontekst skrótów, osie i pierwsze wyjaśnienie origin; oddzielono wymiary nogi od położenia; wyjaśniono składniki siatki i segmenty fazy. Zachowano wprowadzenie do UI.
- Dalej: poprzeczki używają tych samych transformacji; półka wymaga wyboru jednej ściany.

### M0.2 Rama i półka - Inset i Extrude

- Wejście: stół z M0.1; `stol-02-wynik.blend`.
- Nowe: Local View, Inset, Extrude, pozostawiona geometria po anulowaniu ruchu.
- Mechanizm: Inset tworzy obrzeże wewnątrz ściany; Extrude dodaje połączenie między starym i nowym obrysem. Sam Scale lub Move nie tworzy tej samej konstrukcji.
- Kontrola ucznia: półka opiera się na poprzeczkach, a wnęka nie przechodzi przez spód. Grubość dna wynika z porównania głębokości i wysokości bryły.
- Redakcja: przywrócono drogę przez menu i przypomnienie panelu Item; dopisano kontrolę styku części, nie tylko zgodności liczb.
- Dalej: te same operacje wydrążają korpus szuflady.

### M0.3 Szuflada i uchwyt - oś symetrii i Mirror

- Wejście: stół z półką; `stol-04-polka.blend`.
- Nowe: modyfikator, Mirror, origin jako odniesienie, Mirror Object.
- Mechanizm: odbicie symetrycznej kostki wokół jej własnego środka może pokryć się ze źródłem; front przesuwa płaszczyznę odbicia do środka szuflady.
- Kontrola ucznia: dwa mocowania po przeciwnych stronach frontu, jedna edytowana siatka i aktywny Mirror. Ruch źródła o 2 cm zwiększa rozstaw pary o 4 cm.
- Redakcja: wyjaśniono operację w stosie oraz związek przesunięcia źródła z rozstawem pary.
- Dalej: Mirror powiela wsporniki i prowadnice.

### M0.4 Deski, prowadnice i wspólny ruch szuflady

- Wejście: stół z szufladą; `stol-06-uchwyt.blend`.
- Nowe: Repeat Last, parenting, obiekt aktywny, Keep Transform.
- Mechanizm: rodzic przenosi transformacje na dzieci; kolekcja ich nie wiąże. Nieruchome prowadnice i części ruchome należą do różnych zależności.
- Kontrola ucznia: wysunięcie korpusu zabiera front i uchwyt, lecz nie wsporniki. Tył szuflady nadal pozostaje na podparciu.
- Redakcja: wyjaśniono znaczenie ostatniego wybranego obiektu, Keep Transform i brak automatycznej kolizji lub ograniczenia ruchu.
- Dalej: własny młotek wykorzystuje kolekcję i rodzica jako dwa różne narzędzia.

## Moduł 1: młotek, materiały i obrazy

### M1.1 Młotek - siatka, Bevel i oddzielny asset

- Wejście: stół z M0.4; `stol-08-szuflada-otwarta.blend`.
- Nowe: Loop Cut, ograniczenie osi przez Shift+Z, Bevel jako modyfikator, przeniesienie origin, osobny projekt, Append.
- Mechanizm: dodatkowy przekrój ogranicza obszar deformacji; stos Bevel zachowuje siatkę sterującą. Save As zapisuje całą scenę, więc wybór obiektów nie jest eksportem zaznaczenia.
- Kontrola ucznia: dwa obiekty młotka we własnej kolekcji, głowica podąża za trzonkiem; osobny plik nie zawiera ukrytego stołu.
- Redakcja: wyjaśniono pętlę i parametry Bevel. Zachowano pełną drogę kopiowania do pustej sceny i rozróżnienie Append od stałego połączenia z plikiem źródła.
- Dalej: osobny model jest podstawą pracy materiałowej.

### M1.2 Materiały młotka - drewno, metal i światło

- Wejście: `mlotek-01-model.blend`.
- Nowe: Material Preview, materiał, Principled BSDF, Base Color, Metallic, Roughness, normalna, Shade Smooth i Harden Normals.
- Mechanizm: rodzaj powierzchni, rozproszenie odbicia, kierunki cieniowania i oświetlenie to oddzielne przyczyny wyglądu.
- Kontrola ucznia: zmiana Roughness przy stałym świetle zmienia ostrość odbicia, nie obrys; Shade Smooth usuwa pasy cieniowania faz, ale nie dodaje segmentów obrysu.
- Redakcja: odróżniono Base Color od koloru widzianego w świetle, wyjaśniono normalną przed interpolacją. Zapowiedź dotyczy nowego drewna i obróbki stali, nie narzuconego zużycia.
- Dalej: checker będzie kolejnym źródłem Base Color.

### M1.3 UV - jak wybierać cięcia i dzielić piksele

- Wejście: pojęcie powierzchni i materiału; bez operacyjnej znajomości UV.
- Nowe: UV, U/V, szew, ciągłość wzoru, deformacja, teksele i ich gęstość.
- Mechanizm: miejsce cięcia, odkształcenie i przydział pikseli są trzema różnymi decyzjami. Dodatkowe szwy mogą zmniejszyć deformację kosztem ciągłości malowania.
- Kontrola ucznia: rozróżnia A/B (zmiana skali) i A/C (zmiana proporcji), przewidując zachowanie okrągłego nadruku.
- Redakcja: dodano pierwsze wyjaśnienie UV/U/V, usunięto długie wyróżnione zdania, dopisano odczyt konkretnych porównań. Nie ustanowiono fałszywej reguły jednego cięcia dla postaci.
- Dalej: następna lekcja realizuje te decyzje na obu częściach młotka.

### M1.4 UV młotka - szwy, wyspy i checker

- Wejście: M1.3 i `mlotek-02-materialy.blend`.
- Nowe: Shader Editor, wejście/wyjście węzła, Image Texture i Color Grid, Mark Seam, Boundary Loop, Unwrap, wyspa UV, Average Islands Scale, Pack Islands, zapis i pakowanie obrazu.
- Mechanizm: obraz w lewym edytorze nie jest automatycznie podłączony do materiału. Wspólne pakowanie obu części przydziela im odrębne miejsce na tym samym obrazie.
- Kontrola ucznia: dziewięć wysp, brak przypadkowego nakładania i porównywalna kratka na obu częściach.
- Redakcja: wyjaśniono pierwszy przepływ danych w węzłach; naprawiono pominięte wejście w Edit Mode przy głowicy; doprecyzowano F9 i obrót wyspy.
- Dalej: rozłożenie służy do kierunkowego odczytu fotografii drewna.

### M1.5 Drewno trzonka - obraz, kierunek i chropowatość

- Wejście: `mlotek-06-uv-glowica-materialy.blend`, mapy z paczki jesionu i stali.
- Nowe: źródło fotografii, sRGB/Non-Color, UV skala i kierunek, Map Range, Weighted Normal, nazwane UV_Drewno i UV_Stal.
- Mechanizm: wielkość próbki fotografii określa rozmiar włókien na modelu. Mapa Roughness jest danymi, a Map Range przelicza jej zakres bez zamiany w Base Color.
- Kontrola ucznia: włókna wzdłuż trzonka, matowe drewno, czytelne ślady obróbki stali przy obracanym świetle.
- Redakcja: wskazano otwieranie obrazów i miejsca nazw UV. Rozpisano wejście Value i znaczenie czterech granic Map Range. Zachowano informację, że fornir jest źródłem rysunku boków, nie przekroju.
- Dalej: źródłowe mapowanie musi zostać zachowane podczas tworzenia atlasu.

### M1.6 Własna mapa trzonka - bake między UV

- Wejście: `mlotek-08-drewno.blend`.
- Nowe: UV odczytu i zapisu, aktywny Image Texture, Emit, Clear Image, wspólny atlas BaseColor/Roughness/Metallic, wspólny materiał PBR.
- Mechanizm: bake na tym samym obiekcie przenosi wynik materiału ze źródłowych UV do docelowego UV. Selected to Active pozostaje wyłączone; to jeszcze nie projekcja HIGH na LOW.
- Kontrola ucznia: atlas zawiera drewno i stal, a zmiana organizacji map nie zmienia kierunku włókien ani wyglądu obu materiałów.
- Redakcja: poprawiono nazwę typu bake na Emit, wyjaśniono ikonę renderowania modyfikatorów, odłączenie fotografii przed Metallic, przypisanie jednego materiału i rozdzielono diagnozę trzech typowych usterek.
- Dalej: retusz działa na własnym obrazie całego assetu.

### M1.7 Texture Paint - przekrój drewna i retusz szwu

- Wejście: `mlotek-09-mapa-do-malowania.blend`.
- Nowe: Canvas/Single Image, maska ścian, Paint Hard/Soft, Clone, padding, niezależny retusz BaseColor i Roughness.
- Mechanizm: przekrój poprzeczny wąskiego elementu nie musi zawierać środka koncentrycznych słojów. Malowanie w 3D zapisuje ciągłe pociągnięcie po obu brzegach szwu UV.
- Kontrola ucznia: zachowana barwa drewna, inna struktura czoła, brak szerokiego rozmazanego pasa na tylnym szwie.
- Redakcja: poprawiono skrót Local View na Numpad /, wybór pokryw i przejście trybu; wskazano Canvas, maskę i UV oraz sposób zmiany mapy na Roughness.
- Dalej: kolejna lekcja porównuje geometrię, odbicie i relief na tym samym atlasie.

### M1.8 Detal powierzchni - geometria, Bump i Roughness

- Wejście: `mlotek-10-przekroj-i-retusz.blend`.
- Nowe: lokalny retusz Roughness, Mapping, proceduralny Noise, Bump jako interpretacja wysokości.
- Mechanizm: krawędź zmienia geometrię, chropowatość rozproszenie odbicia, Bump normalne. Wspólny materiał obejmuje także stal; próba na izolowanym drewnie nie jest końcową maską materiałową.
- Kontrola ucznia: potrafi wskazać, którą zmianę widzi w obrysie, w szerokości odbicia i w mikroszczególe. Nie wzmacnia niewidocznego detalu tylko dla ilustracji.
- Redakcja: Width zastąpiono właściwym polem Amount; usunięto komentarze o poprzednim nieudanym ubytku; rozpisano połączenia i odróżniono Roughness szumu od Roughness materiału.
- Dalej: wkrętak wymaga świadomej konstrukcji powierzchni i selektywnego fazowania.

## Moduł 2: wkrętaki i wersje do gry

### M2.1 Wkrętak - przekroje i Subdivision Surface

- Wejście: nowy plik; znajomość transformacji, siatki, fazowania i normalnych z M0/M1.
- Nowe: przekroje, Catmull-Clark, pętle podtrzymujące, Edge Slide, Inset Individual, Extrude Individual Faces, wagi Bevel, Select Similar, Clamp Overlap, stos Bevel/Weighted Normal.
- Mechanizm: pętle i szerokość faz wyznaczają kształt; segmenty gęstość jego opisu. Normalne nie prostują skręconej geometrii. Wyciąganie indywidualne stosuje normalną każdej ściany.
- Kontrola ucznia: osiem rowków, szerokie płaskie pola, ciągłe odbicia przy kilku kierunkach światła; trzy grupy wag 1/0.2/0.
- Redakcja: dodano jednostki nowego pliku i drogę dodawania modyfikatora; uporządkowano wybór wag w krótsze podsekcje; wyjaśniono odczyt Edges Data i tolerancję podobieństwa. Zachowano porównanie Subdivision z Bevel.
- Dalej: ten chwyt jest powtórnie używany przez drugi wariant, a jego wagi później przez LOW.

### M2.2 Wkrętak krzyżowy - wariant wspólnej konstrukcji

- Wejście: `wkretak-02-model.blend`.
- Nowe: projektowanie przekroju krzyża, odpowiadające sobie punkty przekrojów, stałe zwężenie w kolejnych odcinkach; kopia materiału niezależna od kopii siatki.
- Mechanizm: Scale jest mnożnikiem aktualnego rozmiaru, więc powtórzenie mnożnika na odcinku innej długości nie zachowuje stałego spadku. Shift+D nie tworzy automatycznie niezależnego materiału.
- Kontrola ucznia: cztery ramiona w widoku czołowym, brak kolana w obrysie i niezależny kolor tylko jednego chwytu.
- Redakcja: wyjaśniono ograniczenie do graficznego przybliżenia grotu, rozróżniono kopię i zmianę nazwy materiału, uporządkowano zapis kolejnych operacji.
- Dalej: pełną ścieżkę materiałów i bake wykonujemy na wariancie płaskim. Krzyżak nie ma jeszcze własnego analogicznego bake w tej części kursu.

### M2.3 Wkrętak - stal i tworzywo z bliska

- Wejście: `wkretak-02-model.blend` lub gotowy stan `wkretak-04-high-materialy.blend` do oglądania ustawień.
- Nowe: Object jako współrzędne proceduralne, Color Ramp jako neutralny nośnik, Multiply i parametr koloru, UV_Szlif, projekcja pola z aktywnego widoku, kierunkowy Vector Math, skos ścian pod bake.
- Mechanizm: kierunek i wielkość szlifu wynikają z UV i mnożników. Kratka oddziela deformację od gęstości, a Map Range ogranicza wpływ szumu na odbicie. Współrzędne źródła mogą wychodzić poza 0-1, bo nie są jeszcze docelowym atlasem obrazów.
- Kontrola ucznia: porównywalne kwadraty na trzpieniu i ostrzu; delikatny szlif wzdłuż pól; zmiana RGB nie zmienia materiału stali.
- Redakcja: przebudowano ciąg tworzywa i stali na odcinki pracy, połączenia i ustawienia. Usunięto rachunek delty UV. Zdefiniowano Multiply, Value/Factor i rolę mapowania; skos ma osobne czynności i przywrócenie pivota.
- Ważne dla autora: gotowy stan ma już skos. Ponowne skalowanie den byłoby błędem. Własny układ UV może wymagać innego Scale Noise niż gotowy plik; nie obiecywać identycznego wyniku po samym przepisaniu liczb.

### M2.4 Wkrętak - retopologia, UV i poziomy LOD

- Wejście: high poly z materiałami i edytowalnymi modyfikatorami.
- Nowe: LOW jako uproszczona siatka, Apply modyfikatora, triangulacja przed bake, Mark Sharp, finalne normalne, ostre granice a szwy UV, dwa warianty LOD.
- Mechanizm: normal mapa odtwarza kierunki odbicia, ale nie obrys i rzeczywiste zasłanianie. Ostateczna triangulacja, normalne i UV są podstawą tangent normal mapy.
- Kontrola ucznia: LOW0 z rowkami i LOW1 bez nich; porównanie w tym samym kadrze; brak nakładania obu części w atlasie. Liczby 472/280 dotyczą dołączonych wariantów, a nie uniwersalnego budżetu.
- Redakcja: uporządkowano kopie, wagę 0.2 i utrwalanie siatki; usunięto zbędne dwukrotne stosowanie Weighted Normal. Najpierw Bevel/triangulacja, potem oznaczenie ostrych granic i finalny Weighted Normal. Dopisano konkretne operacje Mark Seam i koszt oddzielnych map LOD.
- Dalej: bake Selected to Active jest nowym trybem pracy, odmiennym od przenoszenia obrazów młotka.

### M2.5 Wkrętak - bake i porównanie game assetu

- Wejście: osobny plik UV każdego LOD. Dwie części LOW i odpowiadające im HIGH.
- Nowe: Selected to Active, para źródło/cel, automatyczny cage, Extrusion, tangent normal mapa, Normal Map, maska 1-Metallic, porównanie rozdzielczości, pakowane kanały i ograniczenia eksportu.
- Mechanizm: aktywny obiekt wskazuje cel, aktywny Image Texture obraz zapisu. Cage ustala początek projekcji; Margin rozszerza obraz poza wyspy, a Strength Normal Map wpływa dopiero na odczyt.
- Kontrola ucznia: HIGH/LOW w tej samej kamerze i świetle, LOW bez/z normal mapą; zmiana barwy plastiku nie barwi stali. Dwie pary bake zapisują różne wyspy tego samego obrazu bez kasowania pierwszej.
- Redakcja: utworzenie celu i wybór pary otrzymały oddzielne czynności, maska jawne wejścia, a dodatkowe formaty tabelę zamiast jednego wielowątkowego akapitu. Wyjaśniono tangenty i rolę kanałów. Nie przedstawia się eksportu jako wykonanego importu do trzech silników.
- Dalej: potrzebna rzeczywista integracja w wybranym silniku, z określoną wersją i shaderem.

## Rejestr pojęć, które muszą pozostać spójne

| Pojęcie | Pierwsze wyjaśnienie | Późniejszy sprawdzian rozumienia |
| --- | --- | --- |
| Obiekt i siatka | M0.1 | M0.3: źródło Mirror; M2.1: siatka sterująca |
| Origin i osie | M0.1 | M0.3: płaszczyzna odbicia; M1.1: ustawienie narzędzia |
| Kolekcja a rodzic | M0.4, zastosowanie M1.1 | M2.2: dwa niezależne narzędzia |
| Geometria a cieniowanie | M0.1, rozwinięcie M1.2 | M1.8 i M2.1: wybór poprawki odbicia |
| Metallic a Roughness | M1.2 | M1.6: osobne mapy; M2.5: maska tworzywa |
| UV, szew, deformacja i gęstość | M1.3 | M1.4: checker; M2.3: trzpień i ostrze |
| Źródło i cel bake | M1.6 | M2.5: dodatkowo oddzielne obiekty HIGH i LOW |
| Bump a geometria | M1.8 | M2.4/M2.5: ograniczenia normal mapy |
| Waga krawędzi Bevel | M2.1 | M2.4: znalezienie grupy 0.2 i usunięcie jej faz |
| Parametr koloru i maska | M2.3, maska M2.5 | Czerwony chwyt przy niezmienionej stali |
| LOD | M2.4 | M2.5: wygląd, koszt geometrii i map; konfiguracja silnika nadal przed nami |

## Granice obecnej merytoryki

- To nadal początek programu assetów, nie ukończony kurs poziomu AA/AAA. Nazwa poziomu nie zastępuje briefu, kamery, budżetu i testów w grze.
- Retopologia obejmuje tu uproszczenie istniejącej bryły i budowę prostego chwytu. Nie nauczono jeszcze ręcznego prowadzenia nowej siatki po rzeźbie lub skanie.
- Brak przeprowadzonego w tych lekcjach importu w Unity, UE5 i Godot, konfiguracji LOD, kolizji, reimportu i pomiaru sceny. Link do dokumentacji nie jest wykonaniem zadania.
- Krzyżak jest wariantem ćwiczenia modelowania. Dalsze pliki materiałów, UV i bake dotyczą wkrętaka płaskiego. Nie opisywać go jako drugiego ukończonego assetu do gry.
- Każdy LOD ma własny atlas i wypiek. To czytelne porównanie, lecz dodatkowy koszt danych. Następna lekcja optymalizacji nie może obiecywać oszczędności wyłącznie na podstawie 192 trójkątów.
- Nie ma testu z początkującymi. Zrozumiałość oceni autor i próba uczniowska; audyt plików ma węższy zakres.

## Kontrakt redakcyjny na kolejne sesje

- `**...**` to zielona kotwica, `*...*` niebieska. Nie traktuj ich jako zwykłego pogrubiania wszystkich nazw interfejsu. Wyróżniaj oszczędnie definicję lub istotny wynik, nie całe polecenia.
- Klawisze zapisuj przez `<kbd>`. Kombinacje trzymane równocześnie w niełamliwym `<span>`; kolejność klawiszy i wartość liczbową oddzielaj przecinkami. `S`, `Z`, wartość to sekwencja, nie jednoczesne naciśnięcie.
- Dane i wartości oddzielaj od wyjaśnienia. Tabela jest uzasadniona, gdy odczytuje się z niej pola; nie zamieniaj w nią całej narracji.
- Jedna instrukcja ma prowadzić do rozpoznawalnego stanu. Przy nowej operacji podaj edytor, tryb, zaznaczenie, czynność i widoczny wynik, ale nie powtarzaj pełnego wstępu do UI przy każdym znanym kliknięciu.
- Długość wynika z trudności. Nie rób lekcji z pojedynczego pola ani nie ściskaj UV i bake w akapit pełen skrótów.
- Nie dopisuj obowiązkowych ćwiczeń dla samego schematu. Porównanie, próba i zmiana przypadku mają służyć aktualnej umiejętności.
- Zrzut ma pomagać wykonać sąsiednią czynność. Gdy jego wartość różni się od aktualnie ustawianej, wyjaśnij to albo przygotuj właściwy zrzut. Nie ukrywaj rozbieżności ogólnym podpisem.
- Pliki nazywaj jako start, punkt kontrolny lub wynik. Gotowy wynik nie zastępuje instrukcji wykonania własnej wersji.
- Raporty, obrona jakości, historia poprawek i uwagi do generatora pozostają w dokumentacji. Lekcja mówi o modelu i pracy ucznia.

## Źródła zasad i dalsza kontrola

Projekt: `AI_SKILLS/build-koala-course/SKILL.md`, jego trzy dokumenty references, `AI_SKILLS/SKILL_redactor.md`, `AI_SKILLS/SKILL_humanizer.md`, `BAZA_TWORZENIA_KURSOW/04-SKLADNIA-I-WIDGETY.md`, `10-BRAMKA-DYDAKTYCZNA-I-DYSLEKSJA.md`, a także korekta kursu z dokumentu 07. W razie konfliktu pierwszeństwo mają konkretne polecenia autora.

Dokumentacja narzędzia do kontroli kluczowych tez: [Render Baking](https://docs.blender.org/manual/en/5.2/render/cycles/baking.html), [Weighted Normal](https://docs.blender.org/manual/en/5.2/modeling/modifiers/modify/weighted_normal.html), [UV Editing](https://docs.blender.org/manual/en/5.2/modeling/meshes/uv/editing.html), [Bump](https://docs.blender.org/manual/en/5.2/render/shader_nodes/vector/bump.html). Częściowe wyniki wyszukiwania potwierdziły sens ważenia normalnych i wyrównywania skali; nie zastępują praktycznej kontroli całego przepływu w UI 5.2.

Historia sprzed tej redakcji: `Przed-redakcja-calego-kursu-v21`. Robocze kopie i dowody: `C:\xampp\htdocs\blender-course-development\revision\v21`.

## Kontrola wykonanej redakcji

- Zmieniono wszystkie 17 aktywnych lekcji. Kontrola integralności potwierdziła zachowanie 107 odwołań do ilustracji i wszystkich dotychczasowych odwołań do plików Resources. Źródła lekcji i kopie robocze są zgodne.
- Zredukowano 661 wyróżnień `**...**` do 17 pojedynczych kotwic. To kontrola gęstości kolorowania, nie miara jakości tekstu. Zapis klawiszy nie zawiera zagnieżdżonych `<kbd>` ani podwójnych kontenerów kombinacji.
- Audyt kursu: 17 lekcji w indeksie i na dysku, 0 błędów, 0 ostrzeżeń. Lokalna kompilacja przeszła z zablokowanym fetch; wspólne image cache i poligon-db pozostały bez zmian.
- Przegląd przeglądarkowy objął 17 stron przy szerokości 1440 i 390 px. Sprawdzono tytuły, załadowanie obrazów, istnienie 136 unikalnych lokalnych zasobów, zapis klawiszy i brak poziomego przewijania całej strony. Wynik: brak wykrytych błędów. Obejrzano wybrane zrzuty sekcji M0 i M2, nie wykonano ręcznie każdej procedury w Blenderze.
- Testy projektu uruchomione przez `node node_modules/jest/bin/jest.js --runInBand`: 94 zestawy i 829 testów przeszły. To wynik testów aplikacji, nie test nauczania modelowania.
- Dowody: `v21/Documentation/editorial-integrity.json`, `v21/Documentation/browser-all.json` i zrzuty desktop/mobile. Drobne końcowe korekty językowe oraz doprecyzowanie Median Point objęto ponowną kompilacją; nie zmieniają modeli ani obrazów.

Materiał jest przekazany do recenzji promotora. Nie otrzymał na tej podstawie statusu potwierdzonego dydaktycznie ani sprawdzonego w trzech silnikach.



## M0.2 przepisana do recenzji autora - v23

Lekcję „Rama i półka - Inset i Extrude” przepisano osobno, po akceptacji stylistycznej M0.1. Poprzedni plik zachowano w Przed-przepisaniem-ramy-i-polki-v23. Pierwszej lekcji z poprawkami autora nie zmieniano.

Początek prowadzi do otwarcia właściwego stołu i zapisania kopii, bez zapowiedzi listy tematów. Znane transformacje służą ustawieniu poprzeczek i półki. Dane rozdzielono na pola tabel, a położenie wynika ze styku powierzchni. Local View wprowadzono przy rzeczywistym problemie zasłonięcia półki przez blat. Inset rozdziela brzeg od środka jednej ściany. Extrude dodaje pionowe ścianki po opuszczeniu środka. Porównania ze Scale i Move wyjaśniają różnicę w konstrukcji, zamiast przedstawiać wyłącznie skróty. Kontrola obejmuje równe podpory, zachowany obrys półki, pionowe ścianki i 2.5 cm materiału pod dnem.

Zachowano sześć istniejących ilustracji i trzy odwołania do plików kontrolnych. Numery na zrzutach są wykorzystane w tekście. Menu ma zapis win-menu-btn, kombinacje klawiszy niełamliwe kontenery, kolory rozróżniają nazwy operacji, parametry, istotne skutki i błąd anulowania Extrude. Oczekuje recenzji autora, nie jest oznaczona jako zaakceptowana dydaktycznie.

Kontrola: audyt kursu 0 błędów i 0 ostrzeżeń, kompilacja offline poprawna. Sprawdzono tę stronę przy 1440 i 390 px: 6 obrazów, 9 lokalnych zasobów, brak wykrytych błędów. Dowody: C:\xampp\htdocs\blender-course-development\revision\v23\Documentation\browser-all.json. Nie wykonywano ponownie całej procedury w Blenderze i nie zmieniano modeli.

## Skróty w końcowej sekcji - ustalenie autora

Autor zaakceptował redakcję M0.2. Na jego prośbę sekcję „Co masz wynieść z tej lekcji” uzupełniono w M0.1 i M0.2 o użyte skróty wraz z działaniem. M0.2 oddziela nowe operacje I/E/Local View od przypomnienia znanych skrótów. Zachowano wcześniej zaakceptowaną narrację obu lekcji.

W kolejnych lekcjach umieszczaj takie przypomnienie w istniejącej sekcji końcowej. Wybieraj skróty rzeczywiście użyte i istotne dla umiejętności. Podawaj kontekst trybu lub operacji, jeśli zmienia znaczenie klawisza. Odróżniaj kombinację naciskaną razem od kolejnych klawiszy. Nie zastępuj wyjaśnienia mechanizmu samą tabelą skrótów.

## M0.3 przepisana do recenzji autora - v25

Po zaakceptowanych M0.1 i M0.2 przepisano „Szuflada i uchwyt - oś symetrii i Mirror”. Początek prowadzi do właściwego pliku i zapisu kopii. Inset/Extrude są ponownie wykorzystane do wydrążenia korpusu, a grubość dna wynika z wysokości bryły i głębokości wytłoczenia. Dane czterech dodawanych obiektów rozdzielono na tabele pól. Użyto stylu menu i klawiszy z wersji autora.

Nowe pojęcia wprowadzane przy działaniu: modyfikator jako operacja na siatce, origin jako punkt odniesienia, domyślne pokrycie odbicia kostki ze źródłem, Axis jako kierunek i Mirror Object jako odniesienie odbicia. Zrzut Mirror jest powiązany z numerami 1/2. Front wyznacza płaszczyznę X=0. Krótki ruch G, X, 0.02 w Edit Mode pokazuje aktualizację drugiej strony i zwiększenie całego rozstawu o 4 cm. Cofnięcie ruchu przywraca stan do dodania poprzeczki. Odbicie nie jest przedstawiane jako niezależny obiekt.

Końcowa sekcja zawiera regułę wyboru odniesienia, nową sekwencję G/X oraz przypomnienie użytych skrótów. Tekst jawnie wskazuje stan przejściowy: brak prowadnic i osobne obiekty szuflady. Następna M0.4 ma domknąć podparcie oraz wspólny ruch. M0.3 czeka na recenzję autora. Poprzednia wersja znajduje się w Przed-przepisaniem-szuflady-v25. Nie zmieniano M0.1, M0.2 ani modeli i obrazów.

Kontrola techniczna: audyt 17 lekcji, 0 błędów, 0 ostrzeżeń; kompilacja offline poprawna; sprawdzenie M0.3 w przeglądarce przy 1440/390 px: 6 obrazów, 9 lokalnych zasobów, brak wykrytych błędów. Obejrzano ilustracje mocowania, Mirror i uchwytu. Nie wykonywano ponownie całej procedury w Blenderze. Dowody przeglądarkowe: revision/v25/Documentation/browser-all.json.

## M0.3 zaakceptowana, M0.4 przepisana do recenzji - v26

Autor zaakceptował lekcję szuflady i Mirror (M0.3). Następnie przepisano „Deski, prowadnice i wspólny ruch szuflady”. Pozostałych zaakceptowanych lekcji nie zmieniano. Poprzednia M0.4 jest w Przed-przepisaniem-prowadnic-v26.

Przepływ M0.4: ponowne użycie Bevel przy pierwszej desce, duplikacja z odstępem, Repeat Last jako nowa operacja, wsporniki i nieruchome prowadnice, ruchome listwy, wybór dzieci i aktywnego rodzica, Keep Transform, sprawdzenie hierarchii i rzeczywisty ruch korpusu. Rozstaw kopii wynika z szerokości deski i szczeliny. Mirror ma ponowne zastosowanie z odniesieniem stołu lub korpusu. Wyjaśniono, że Mirror Object nie jest zastępstwem parentingu.

Nowe pojęcia: parenting jako zależność transformacji, rodzic/dziecko, obiekt aktywny w tej operacji oraz Keep Transform. Zaznaczenie jest rozpisane według faktycznej pracy w Outlinerze z Ctrl i przeniesieniem kursora do widoku 3D przed Ctrl+P. Zrzut hierarchii odpowiada czterem dzieciom korpusu. Próba wysuwu sprawdza podział ruchome/nieruchome i zachowane podparcie. Diagnoza wskazuje, jak cofnąć błędną zależność i poprawić wybór. Końcowa sekcja zawiera nowe oraz powtarzane skróty.

Usunięto z podsumowania wyjaśnienie kolekcji, ponieważ lekcja jeszcze ich nie wprowadza. Kolekcje pozostają nowym pojęciem w M1.1, gdzie mają rzeczywiste zastosowanie do oddzielenia stołu i młotka. Parenting nie jest przedstawiany jako symulacja prowadnic lub kolizji.

Zachowano siedem obrazów, trzy odnośniki do plików i dotychczasową geometrię. Kontrola: audyt kursu 0 błędów/ostrzeżeń, kompilacja offline poprawna, przegląd M0.4 przy 1440/390 px bez wykrytych błędów (7 obrazów, 10 lokalnych zasobów). Obejrzano zrzuty wsporników, przekroju L, listew, hierarchii i wysuwu. Nie wykonywano od nowa całej procedury w Blenderze. Dowody: revision/v26/Documentation/browser-all.json. M0.4 czeka na ocenę autora.

## Korekta czytelności listew M0.4 - v27

Autor wskazał rozbieżność między sekcją „Dodaj listwy do boków szuflady” a zrzutem. Sprawdzono aktualny tekst, obraz ruch-listwy.png i rzeczywistą geometrię stol-07-prowadnice.blend. Stary kadr pokazuje przede wszystkim duże wsporniki. Cienka listwa jest słabo rozróżnialna, a wcześniejszy opis nie identyfikował elementów.

Odczyt modelu potwierdza dla prawej strony: zewnętrzna ściana korpusu X=0.400 m; listwa X=0.400..0.405 m, Z=0.625..0.675 m; nieruchomy bok prowadnicy X=0.405..0.415 m; wspornik X=0.415..0.455 m. Listwa ma 5 mm grubości i 5 cm wysokości. Dane tabeli pozostawiono, ale ich sens wyjaśniono bezpośrednio przy tworzeniu części.

Dodano ruch-listwa-przekroj.svg. Przekrój nie jest wymyśloną ilustracją: obrysy pochodzą z przecięcia ewaluowanych siatek płaszczyzną Y=-0.1 m. Zachowuje proporcje. Numery 1/2/3 odpowiadają wcześniejszemu obrazowi prowadnicy, 4 oznacza listwę, 5 korpus. Kolory dodatkowo odróżniają ruchome części od nieruchomego podparcia. Opis starego zrzutu wskazuje szerokie wsporniki i cienkie listwy. Nie zmieniono modeli ani pozostałych akapitów autora.

Dowody: revision/v27/actual-geometry.json, inspect_rails.py, make_section.py i section-preview.png. Kontrola: audyt 0 błędów/ostrzeżeń, kompilacja offline poprawna, strona 1440/390 px bez wykrytych błędów, 8 obrazów i 11 zasobów. Status: poprawiony fragment do oceny autora, M0.4 nadal niezaakceptowana w całości.


### Korekta v28 — wysuwanie szuflady: zgodność obrazu i instrukcji

- Usunięto z tej sekcji zbliżenie z zaznaczonymi wszystkimi elementami. Pozostały zrzut pokazuje całą scenę i zaznaczenie samego korpusu, zgodnie z poleceniem ruchu.
- Usunięto wtrącenie o naprawianiu hierarchii, które przerywało obserwację wyniku.
- Obserwacja podparcia prowadzi teraz do wyjaśnienia różnicy między odwzorowaniem fizycznej konstrukcji a symulacją fizyki. Parenting przenosi ruch, ale nie zapewnia kolizji ani ograniczeń osi.
- Nie zmieniano plików Blender ani pozostałych sekcji lekcji. Moduł 0, lekcja 4 nadal czeka na akceptację autora.


### Redakcja v29 — młotek: siatka, Bevel i oddzielny asset

Autor zaakceptował lekcję o prowadnicach po korekcie v28. Kolejna redagowana lekcja otwiera moduł 1.

- Wejście: uczeń potrafi pracować na ścianach, stosować skalę, używać Extrude i parentingu. Punktem startowym pozostaje stół z końca modułu 0.
- Przepływ: oddzielenie kolekcji → przekrój trzonka i kontrola zwężenia → wytłoczenie końców głowicy → fazy wyliczane przez Bevel → origin i wspólny ruch → przeniesienie narzędzia do osobnego pliku → Append kolekcji.
- Pętla ma wyjaśnioną funkcję: utrzymuje środkowy przekrój przy zwężaniu końców. Topologia jest nazwana przy rzeczywistej zmianie połączeń siatki.
- Bevel: parametry powiązano z numerami na istniejącym zrzucie. Porównanie Segments 1 i 3 oraz włączenia i wyłączenia modyfikatora ma pokazać profil, obrys i odbicia. Nie utożsamiono większej liczby segmentów z automatycznie lepszym modelem.
- Oddzielono porządkowanie kolekcją od przekazywania ruchu parentingiem. Zapis assetu wyjaśnia zakres Save As, potrzebę zaznaczenia obu części i zerowanie transformacji rodzica.
- Zachowano 7 istniejących zrzutów i pliki kontrolne. Obejrzano wszystkie zrzuty. Nie zmieniano modeli i nie przeprowadzono ponownie pełnej procedury ręcznie w Blenderze.
- Parametry Bevel i działanie Loop Cut porównano z dokumentacją producenta: https://docs.blender.org/manual/en/5.2/modeling/modifiers/generate/bevel.html oraz https://docs.staging.blender.org/manual/en/latest/modeling/meshes/editing/edge/loopcut_slide.html .
- Wyjście: osobny plik młotka bez stołu, z edytowalnymi modyfikatorami, przygotowany do lekcji o materiałach. To model ćwiczebny, nie gotowy zoptymalizowany asset do silnika.
- Status: do recenzji autora. Nie mierzono retencji ani zrozumiałości na grupie uczniów.

Weryfikacja v29: kompilacja zakończona powodzeniem, audyt 17 lekcji bez błędów i ostrzeżeń. Kontrola przeglądarkowa tej lekcji: 7 obrazów wczytanych, 10 zasobów obecnych, brak błędów skryptów i poziomego przepełnienia przy szerokości 390 px. Obejrzano zapis widoku mobilnego. Wyniki techniczne nie zastępują recenzji dydaktycznej autora.


### Redakcja v30 — materiały młotka: powierzchnia, światło i cieniowanie

Autor zaakceptował modelowanie młotka po własnej korekcie i dodaniu czterech zrzutów. Jego bieżący plik pozostawiono bez zmian.

- Wejście: osobny model z dwoma obiektami i edytowalnym Bevel. Znane: normalna jako kierunek prostopadły do ściany, geometria faz i parenting.
- Przepływ: Material Preview i światło otoczenia → materiał trzonka → osobny materiał stali → obrót otoczenia przy stałym materiale → porównanie Roughness w stałym kadrze → przeniesienie tej obserwacji na niemetaliczny trzonek → rozróżnienie geometrii fazy i cieniowania.
- Materiał i shader wyjaśniono przy pierwszym użyciu. Base Color nie jest utożsamiony z gotowym kolorem piksela, Metallic z siłą połysku, a Roughness z geometrią powierzchni.
- Zachowano sześć istniejących ilustracji i obejrzano ich zawartość. Nowy zrzut panelu Bevel pochodzi z uruchomionego Blendera 5.2.2 i istniejącego punktu kontrolnego. Pliku blend nie zapisano. Nie przeprowadzono od początku całej lekcji ręcznie.
- Uczeń porównuje odbicia bez równoczesnej zmiany kadru i światła, potem obserwuje połysk drewna przy Metallic 0. W części o Shade Smooth ogląda fazę i płaski bok zamiast zwiększać segmenty w odpowiedzi na każdy problem z odbiciem.
- Źródła sprawdzone 2026-10-18: Blender Manual 5.2 Principled BSDF, https://docs.blender.org/manual/sr/5.2/render/shader_nodes/shader/principled.html ; Harden Normals, https://docs.blender.org/manual/uk/latest/modeling/modifiers/generate/bevel.html . Wersja angielska 5.2 nie została pobrana przez narzędzie, wykorzystano dostępne strony producenta z angielską treścią parametrów.
- Wyjście: dwa niezależne, jednolite materiały i poprawione cieniowanie faz. Brak słojów i śladów obróbki jest jawnie nazwanym zakresem tego etapu. Dalsze UV i tekstury pozostają w kolejnych lekcjach.
- Status: do recenzji autora, przed pilotażem. Zgodność techniczna nie dowodzi retencji.

Weryfikacja v30: kompilacja zakończona powodzeniem, audyt kursu bez błędów i ostrzeżeń. Przeglądarka: 7 obrazów wczytanych, 9 zasobów obecnych, brak błędów strony i przepełnienia przy 390 px. Obejrzano zapis widoku desktopowego i mobilnego. Pierwszy pomiar przerwało oczekiwanie networkidle, ponowiono po DOMContentLoaded i sprawdzono załadowanie obrazów osobno. Wynik nie zastępuje recenzji dydaktycznej.


### Redakcja v31 — UV: wybór cięć i przydział pikseli

Poprzednia lekcja materiałów została przyjęta po skrótach autora i punktowej korekcie v30. Nie zmieniano jej ponownie.

- Wejście: model młotka z dwoma materiałami. Nowe pojęcia: tekstura jako zróżnicowanie wartości na powierzchni, współrzędne UV, wyspa, szew, checker, teksel i gęstość tekseli. Pojęcia poprzedzają ich użycie w wyjaśnieniach.
- Plik porównawczy przeniesiono na początek. Zamiast ogólnej zapowiedzi uczeń ogląda A, następnie przełącza A/B i B/C przy identycznej geometrii.
- Dodano rzeczywisty zrzut wysp w UV Editorze obok modelu 3D. Otworzono istniejący plik porównawczy w Blenderze 5.2.2, włączono A_Rowne_UV, wybrano Glowica_A i jej siatkę w Edit Mode. Nie zapisano pliku blend. Potwierdzono nazwy kolekcji A_Rowne_UV, B_Mniej_pikseli, C_Rozciagniecie.
- Główne rozróżnienie: odkształcenie proporcji wzoru kontra zbyt mały przydział pikseli. Dodano przyczynę deformacji przy zamianie trapezu na prostokąt. Wyjaśniono, dlaczego powiększenie obrazu nie usuwa deformacji UV.
- Pozostawiono trzy wcześniejsze porównania. Związek wysp i modelu, koszt cięć na twarzy oraz granice szwów prowadzą do decyzji, zamiast listy nazw narzędzi na zapas. Average Islands Scale i Pack Islands zostaną użyte w kolejnej lekcji praktycznej.
- Gęstość wyjaśnia odcinek 10 cm i 100/200 pikseli. Brak sugerowanej jednej docelowej gęstości dla wszystkich assetów.
- Źródło pomocnicze: dokumentacja producenta, Editing UVs: https://docs.blender.org/manual/id/5.0/modeling/meshes/uv/editing.html oraz Layout Workflow https://docs.blender.org/manual/id/dev/modeling/meshes/uv/workflows/layout.html . Zakres: skalowanie wysp, odkształcenia i układanie wysp. W lekcji nie podano zależnych od wersji ścieżek tych narzędzi.
- Wyjście: rozpoznanie trzech przyczyn problemu (miejsce cięcia, proporcje, przydział pikseli) przed wykonaniem własnego UV w kolejnej lekcji. Status: do recenzji autora, bez badania retencji. Zapis zrzutu nie jest pełnym ponowieniem procedur dalszej lekcji.

Weryfikacja v31: kompilacja i audyt 17 lekcji bez błędów i ostrzeżeń. Kontrola przeglądarkowa tej lekcji: 4 obrazy wczytane, 5 zasobów obecnych, bez błędów strony i poziomego przepełnienia przy 390 px. Zapisano widok desktopowy i mobilny.


### Przebudowa v32 — lekcja teoretyczna o UV

Autor odrzucił konstrukcję v31: gotowy plik z checkerem wyprzedzał umiejętność jego utworzenia, a tekst mieszał teorię z instrukcjami obsługi przykładu. Nie uznawać v31 za zaakceptowany wzorzec.

- Usunięto pobieranie projektu, przełączanie A/B/C w Outlinerze i opis struktury kolejnych kroków pracy. Jedyny pomost w otwarciu wprost zapowiada teorię na ilustracjach przed praktyką w następnej lekcji.
- Przepływ: model / mapa / obraz → wyspy i otwarcie powierzchni → rzeczywisty przykład twarzy → koszt prostowania trapezu → dwa brzegi tej samej krawędzi → odkształcenie kontra przydział pikseli → wspólny obraz, nakładanie, margines i pakowanie.
- Dodano ilustrację rzeczywistego UV twarzy z dokumentacji producenta oraz dwa autorskie schematy SVG. Schemat miejsca szwu jest jawnie uproszczony, nie udaje pełnego rozwiązania topologii głowy. Schemat wzoru pokazuje dwa oddzielne brzegi UV i ich spotkanie na tym samym narożniku 3D, przy dopasowanych i niedopasowanych danych.
- Pozostawiono wcześniejsze ilustracje związku UV z obrazem, deformacji głowicy i wariantów gęstości. Usunięto porównanie checkera z jednolitym szarym materiałem jako główny dowód ciągłości szwu: schemat dwóch dopasowanych brzegów wyjaśnia mechanizm bez zastępowania tekstury.
- Ważne granice: UV nie jest teksturą, jedna mapa może obsługiwać różne kanały obrazowe, wspólny obraz nie wymaga scalania obiektów, nakładanie wysp jest czasem celowe, rozdzielczość nie naprawia proporcji UV.
- Źródła zbadane 2026-10-18: Blender Seams (5.1), Layout Workflow (5.2), Editing UVs (5.2), Unity Texture Import Settings (mechanizm filtrowania i mipmap, bez zależnych od wersji poleceń). Linki umieszczono przy odpowiednich fragmentach lekcji.
- Ilustracja twarzy: Blender Documentation Team, Blender Manual 4.4, Layout Workflow, plik modeling_meshes_uv_workflows_layout_combining-uv-maps-2.png, pobrano z https://docs.blender.org/manual/en/4.4/_images/modeling_meshes_uv_workflows_layout_combining-uv-maps-2.png . Bez zmian, CC BY-SA 4.0, atrybucja i link do licencji w lekcji. Drugi pobrany obraz manuala nie został wykorzystany.
- Wyjście: uczeń ma rozpoznać, czego szuka podczas praktycznej kontroli UV. Nie twierdzimy, że po samej teorii potrafi wykonać rozłożenie. Stan: do recenzji autora, przed pilotażem.

Weryfikacja v32: kompilacja i audyt 17 lekcji bez błędów i ostrzeżeń. Sprawdzono 6 ilustracji i 6 lokalnych zasobów tej lekcji. Kontrola przy 1440 px i 390 px bez błędów strony oraz poziomego przepełnienia. Obejrzano porównanie brzegów szwu i ilustrację twarzy w wygenerowanym kursie. Brak odnośników do pobrania pliku blend oraz instrukcji przełączania kolekcji w tej lekcji.

### Korekta v33 po uwagach autora
Wstęp v32 wyprzedzał pojęcie tekstury i został odrzucony. Nowy punkt wejścia odwołuje się do poznanego koloru i chropowatości, następnie wprowadza teksturę. Wyjaśniono krótko obrazy oraz wzory proceduralne (Blender Manual Noise Texture: https://docs.blender.org/manual/ja/5.2/render/shader_nodes/textures/noise.html). Usunięto zdanie o docelowym wyglądzie metalu i retoryczne przeciwstawienia. Ilustrację z manuala zastąpiono autorskim, jawnie schematycznym przedstawieniem obu policzków z osobnym miejscem na jednostronny pieprzyk. Nie przedstawia ono produkcyjnej topologii. Wyjaśnienie dodatkowych cięć głowicy odnosi się teraz wprost do górnego i dolnego obrazu. Zachowano pozostałe zasoby i pliki użytkownika. Kompilacja oraz audyt bez błędów, 6 ilustracji wczytanych w przeglądarce, brak przepełnienia przy 390 px. Status: do recenzji autora.

### Korekta v34 — rzeczywista tekstura i oteksturowana głowa
Autor odrzucił schemat v33 jako maskę bez wyjaśnienia działania UV. Zastąpiono go dwoma rzeczywistymi zrzutami Blendera: oryginalny obraz koloru obok modelu oraz ten sam obraz z krawędziami UV obok modelu. Wykorzystano skan Lee Perry-Smith / Infinite-Realities i dopasowany Map-COL.jpg z https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/LeePerrySmith, CC BY 3.0. Oryginalna licencja i pliki są w revision/v34. Przy imporcie glTF odwrócono współrzędną V, dopasowując konwencję do oryginalnego obrazu. Geometria pozostała bez zmian. Oświetlenie wspomaga niewielki udział emisji koloru, aby cienie nie przesłaniały szczegółów w ilustracji mapowania. Nie zapisywano blend użytkownika. Zmieniono wyłącznie sekcję twarzy, zachowując pozostałe bieżące poprawki autora. Opis odnosi się do brwi, powiek, ust, zarostu i faktycznych trójkątów na obrazie. Atrybucja w lekcji. Kompilacja i audyt bez błędów, 6 ilustracji wczytanych, brak przepełnienia przy 390 px. Status: do recenzji autora.


### Korekta v35 — kontrola głowy checkerem
Autor wykrył odkształcenia i nierówną gęstość w UV skanu. v34 sprawdzało dopasowanie obrazu skóry, ale nie kontrolowało jakości UV checkerem. Nie traktować tego skanu jako wzorca optymalnego UV. Dodano dostarczony przez autora zrzut checkera i opis konkretnych objawów. Rozdzielono dopasowanie tekstury przygotowanej do danego UV od jakości odwzorowania regularnego wzoru. Zmiana UV wymaga ponownego dopasowania obrazu. Wskazano możliwość oddzielnego rozłożenia uszu, szyi i ramion. Nie wykonywano nowego unwrap ani nie deklarowano poprawienia modelu źródłowego.


### Przebudowa v36 — diagnoza UV, decyzja i sprawdzenie poprawy

Autor odrzucił dopisek v35 jako opis obrazka bez nauczenia rozpoznawania i poprawiania UV. Samo nazywanie odkształceń nie wystarcza. Zachować tę uwagę jako wymaganie: każda diagnoza powinna prowadzić do działania i obserwowalnego wyniku.

- Przeniesiono proste przykłady głowicy, warianty A/B/C i gęstość przed trudny przypadek głowy. Zachowano bieżącą treść autora w pozostałych sekcjach, w tym jego poprawione linki źródłowe.
- Wykonano rzeczywiste nowe UV tego samego skanu. Wydzielono obszary twarzy, czaszki, tyłu głowy, uszu, szyi i ramion. Zachowano istniejące brzegi oryginalnych wysp, zespawano duplikaty glTF przy identycznych pozycjach i wykonano Angle Based, wyrównanie skali oraz pakowanie. Granice nowych części biegną po krawędziach istniejącej triangulacji. To wykonany przykład decyzji, nie deklaracja gotowego assetu do animacji lub produkcji.
- Pierwsza próba Minimum Stretch przy zbyt małym podziale poprawiała szyję i ramiona, ale pogarszała twarz. Odrzucono ją po pomiarze, zamiast nazwać poprawą. Obecny wariant dzieli dodatkowo czaszkę i tył głowy oraz używa Angle Based.
- Zachowano dwie warstwy UV: Oryginal i Po_rozlozeniu. Pomiar na każdym trójkącie: iloraz wartości singularnych lokalnego odwzorowania z 3D do UV (1 = brak kierunkowej deformacji), średnia ważona polem 3D. Całość 2.364 → 1.056; obszar twarzy 2.631 → 1.096. P90 twarzy 3.296 → 1.265. Wynik potwierdza ograniczenie odkształceń, nie ich całkowity brak. Średnie skale między grupami także się zbliżyły. Szczegóły w revision/v36/metrics.json. Tych technicznych liczb nie wprowadzono do lekcji początkującego.
- Porównanie checkera wykorzystuje ten sam obraz, geometrię powierzchni, kadr i światło. Zestawiono kadry bez zmiany proporcji obrazu. Czerwone linie na drugim zrzucie są krzywymi prowadzonymi dokładnie po rzeczywistych krawędziach oznaczonych jako szwy.
- Wykonano prawdziwe przeniesienie oryginalnego koloru na nowe UV przez bake EMIT w Cycles: źródło jawnie odczytuje Oryginal, docelowy obraz używa Po_rozlozeniu. Zrzut nowej tekstury i modelu dowodzi, że po zmianie UV trzeba dopasować również obraz. Nie uczono jeszcze obsługi bake w tej teoretycznej lekcji.
- Rozpoznawanie: proporcje małych pól, porównanie gęstości, perspektywa, obrót wysp, odkształcenie na krzywiźnie i przeskok na szwie mają osobne wyjaśnienia. Dodano działanie i kryterium sprawdzenia dla B/C, dla problemu miejscowego oraz dla nowego UV głowy.
- Akceptacja opiera się na wpływie na planowany detal i odległość oglądania. Nie wprowadzono uniwersalnego progu liczbowego ani obietnicy idealnych kwadratów na całej głowie.
- Źródła: Blender UV Operators (Angle Based, Minimum Stretch, Unwrap) https://docs.blender.org/manual/en/5.0/modeling/meshes/editing/uv.html ; UV Overlays Angle/Area https://docs.blender.org/manual/uk/latest/editors/uv/overlays.html . Model i oryginalny obraz: Lee Perry-Smith / Infinite-Realities, CC BY 3.0, atrybucja w lekcji. Pliki warsztatowe wyłącznie w revision/v36, bez zmiany plików blend autora.
- Stan: do recenzji autora. Wykonano i wizualnie sprawdzono operacje w materiale porównawczym, nie badano retencji uczniów.

Weryfikacja v36: kompilacja i audyt bez błędów oraz ostrzeżeń. W przeglądarce wczytano 8 ilustracji, potwierdzono 8 lokalnych zasobów. Brak błędów strony i poziomego przepełnienia przy 390 px. Obejrzano porównanie przed/po w kursie na szerokim i wąskim ekranie. Rzeczywiste rozłożenie UV oraz przeniesienie obrazu wykonano i sprawdzono w plikach warsztatowych v36. Ostateczna ocena dydaktyczna nadal należy do recenzji autora.


### Korekta v37 — wycofanie oceny wariantu v36 jako poprawy całego UV
Autor wskazał, że v36 zmniejszyło kierunkowe odkształcenie kosztem budżetu twarzy, przydzielając nadmierne miejsce dużym, mniej istotnym częściom i spodowi. Wskaźnik izotropii trójkątów i wyrównana skala nie są wystarczającym kryterium jakości assetu. Nie powtarzać tego wniosku ani traktować v36 jako wzorca zoptymalizowanego UV głowy.
Usunięto z lekcji porównanie v36, ilustrację jego cięć i przeniesionego koloru. Przywrócono analizę oryginalnego UV. Wykonano dwa rzeczywiste zrzuty tego samego oryginalnego UV: checker powtarzany 1× i 4× w obu kierunkach, identyczny model, kadr i światło. Zmieniono wyłącznie skalę próbkowania wzoru kontrolnego. Nie zmieniono UV, obrazu skóry ani jego rozdzielczości. Objaśniono, że drobniejszy wzór pozwala lokalnie ocenić kształt, ale zachowuje istniejące proporcje odwzorowania.
Ocenę rozdzielono na lokalne proporcje, świadomy przydział pikseli według widoczności i detalu oraz koszt szwów. Nie nazwano ani oryginału, ani nowego wariantu optymalnym układem bez wymagań assetu. Zmieniono także obietnicę otwarcia: zamiast rozkładania bez odkształceń jest ocena odkształceń i podział miejsca.

Weryfikacja v37: kompilacja i audyt bez błędów i ostrzeżeń. Wczytano 6 ilustracji, potwierdzono 6 zasobów, brak błędów strony i przepełnienia przy 390 px. Obejrzano rzeczywiste porównanie skali checkera w lekcji. Poprzednie ocenione niewłaściwie obrazy v36 zachowano jako nieużywane pliki historyczne, usunięto ich odwołania z lekcji.


### Przebudowa v38 — fundament: rozwijalność, kąty i powierzchnia

Autor ponownie odrzucił łatanie opisu. W v37 nadal brakowało przyczyny odmiennych oczekiwań wobec płaskiej głowicy i ciągłej powierzchni głowy. Usunięto porównanie powtórzeń checkera i przebudowano lekcję od mechanizmu.

- Zbadano źródła: CGAL Surface Mesh Parameterization (https://doc.cgal.org/latest/Surface_mesh_parameterization/index.html), artykuł badawczy o nieuniknionych odkształceniach powierzchni nierozwijalnych (https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0217537), Blender UV Operators oraz wzory odwzorowań stereograficznego i Lamberta z Wolfram MathWorld.
- Rozróżniono powierzchnię płaską, rozwijalny bok walca i nierozwijalny duży płat sferyczny. Problem wynika z geometrii powierzchni, a nie podziału biologiczne / niebiologiczne. Nawet metalowa kula stawia problem rozłożenia krzywizny.
- Nowy rzeczywisty przykład Blendera: ta sama półkula, te same obrazy i światło, jednakowe kołowe granice UV. Odwzorowanie stereograficzne x/(1-y), z/(1-y) zachowuje kąty; odwzorowanie Lamberta x/sqrt(1-y), z/sqrt(1-y), z odpowiednią stałą normalizacji, zachowuje względną powierzchnię. Stały obraz 1024 bez powtórzeń, brak skalowania w materiale. Zrzuty całej półkuli oraz tego samego fragmentu przy kącie 60°, oglądanego na wprost. W każdej parze zmienia się wyłącznie mapa UV. Dwóch wariantów nie oceniono jako uniwersalnie lepszego.
- Wyjaśnienie przechodzi przez zachowanie proporcji kontra zmienna skala oraz zachowanie pola kontra deformacja. Obserwację oddzielono od skrótu perspektywicznego i naturalnego wyginania linii na krzywiźnie. Nie obiecano idealnych pól na całej głowie.
- Wybór UV głowy: cel oglądania → ciągłe obszary i otwarcie płata → rozłożenie / kontrola → przydział miejsca według detalu i widoczności → pakowanie → tworzenie obrazu. Wyjaśniono, dlaczego malowanie po 3D może uwzględnić deformację i dlaczego nadal liczy się liczba pikseli.
- Zachowano oryginalną teksturę i model Lee Perry-Smitha, atrybucję oraz wcześniejsze ilustracje młotka i granicy szwu. Nie zmieniono UV skanu, obrazu skóry ani plików blend autora. Pliki v36 i v37 pozostają wyłącznie historią odrzuconych rozwiązań.
- Poprzednie powtarzanie wzoru było zmianą współrzędnych próbkowania tylko w osobnym materiale testowym, pozostawiało UV i kolor skóry bez zmian, ale komplikowało dydaktykę. Obecny przykład całkowicie usuwa tę dodatkową zmienną.
- Stan: do recenzji autora; nie deklarować pomiaru zrozumiałości ani retencji. Przed kolejną redakcją analizować ten łańcuch błędów, zamiast kopiować rytm kolejnych dopisków.

Weryfikacja v38: kompilacja i audyt bez błędów oraz ostrzeżeń. Potwierdzono 7 ilustracji i 7 zasobów, bez błędów strony oraz poziomego przepełnienia przy 390 px. Obejrzano w kursie zbliżenie tego samego fragmentu półkuli w dwóch odwzorowaniach oraz porównanie całych powierzchni. Zmieniono wyłącznie treść tej lekcji i jej zasoby. Pełna akceptacja dydaktyczna pozostaje po stronie autora.


### Redakcja v39 — płynny proces decyzyjny i jego wykonanie na młotku

Autor uznał v38 za poprawę merytoryczną, ale odrzucił mechaniczną narrację, powtarzanie wniosków, nagłówek o trudnościach młotka i głowy oraz naukowy link w przepływie lekcji. Nie traktować krótkich jednoideowych akapitów jako nakazu rozbijania każdego zdania na osobną myśl. Związek przyczynowy ma być czytelny w połączonym akapicie.

- Zredagowano dwie sąsiadujące lekcje jako parę: decyzje przy rozkładaniu oraz ich wykonanie i kontrola w Blenderze. Nie zmieniono indeksu, nazw plików ani przyjętych lekcji modelowania i materiałów.
- Lekcja zasad prowadzi od obrazu i wysp przez otwarcie rzeczywistego trzonka, rozdzielenie ograniczających się boków głowicy, kompromis na krzywiźnie, przydział detalu, diagnozę, dopasowanie brzegów i pakowanie. Zredukowano osobne rozdziały powtarzające ocenę głowy. Usunięto porównanie całej półkuli jako powtórzenie wniosku ze zbliżenia. Zachowano jedno kontrolowane porównanie lokalnych proporcji i powierzchni.
- Źródła naukowe i opisy algorytmów pozostają w dokumentacji v38, a w treści ucznia pozostawiono tylko niezbędną atrybucję licencjonowanego skanu i obrazu. Lekcja nie wymaga czytania pracy badawczej ani podręcznika CGAL.
- Lekcja praktyczna rozpoczyna pracę z własnym mlotek_v02.blend / punktem kontrolnym. Obraz jest tworzony i podłączany przez ucznia. Każdy blok łączy działanie z przyczyną i obserwowalnym wynikiem: obwody końcówek, podłużne otwarcie, liczba wysp, kierunek słojów, wspólna owijka głowicy, dodatkowe narożniki, porównanie efektu, skala i pakowanie.
- Wprowadzono rzeczywistą iterację na głowicy: jeden podłużny szew daje trzy wyspy; dodatkowe trzy narożniki dają sześć. Unwrap jest ponawiane po zmianie szwów. Learner nie otrzymuje wyłącznie finalnego zestawu krawędzi do odkliknięcia.
- Sprawdzono operacje na aktualnym Resources/mlotek-02-materialy.blend w Blenderze 5.2.2: trzonek ma 3 wyspy i 2 krawędzie otwarcia, głowica z owijką 3 wyspy i 3 krawędzie otwarcia, po rozdzieleniu boków 6 wysp. Zweryfikowano, że skale obiektów wynoszą 1. Wyniki w revision/v39/verification.json, procedura nie zapisuje pliku blend.
- Obejrzano istniejące ilustracje praktyczne. Dodano do praktyki istniejący obraz porównujący owijkę i rozdzielone boki. Zachowano punkty kontrolne oraz nazwy wersji projektów. Obrót całego rozłożenia trzonka przez A, R 90 upraszcza orientację bez dokładania niewyjaśnionej selekcji wyspy przez L i zależności od Sync Selection.
- Wyjaśnienie Average Islands Scale ograniczono do celu tego młotka, z wyraźnym odniesieniem do priorytetu innych detali. Tabela skrótów zawiera czynności faktycznie używane w praktyce, z kontekstem obszaru pod kursorem.
- Granica weryfikacji: sprawdzono geometrię, wyspy i operacje rozkładania przez API Blender oraz odczytano ilustracje. Nie przeprowadzono całej lekcji ponownie wyłącznie ręcznymi kliknięciami ani pilotażu z uczniami. Proces jest przenośną podstawą dalszej pracy, nie deklaracją opanowania każdego zaawansowanego rodzaju UV po dwóch lekcjach.
- Stan: do recenzji autora. Źródła matematyczne i historia błędnych kryteriów v36/v37 pozostają dostępne do kontroli, poza narracją lekcji.

Weryfikacja v39: kompilacja i audyt 17 lekcji bez błędów i ostrzeżeń. Sprawdzono obie zredagowane lekcje w przeglądarce: 15 wystąpień obrazów, 16 unikalnych lokalnych zasobów, brak błędów strony i poziomego przepełnienia przy 390 px. Obejrzano zapis układu mobilnego zasad oraz desktopowego porównania owijki i oddzielnych boków w praktyce. Wynik kontroli technicznej nie jest oceną zrozumiałości materiału.

### Korekta zasad po odrzuceniu v39 — 2026-10-18

Autor odrzucił kolejną przebudowę całości. V39 nie ma akceptacji dydaktycznej. Wyniki kontroli technicznych nie świadczą o jakości wyjaśnień.

Dalsza redakcja ma poprawiać konkretny problem w istniejącym fragmencie. Zachować działające wyjaśnienia, autorskie poprawki, ilustracje i kolejność poza zakresem koniecznej korekty. Nie przepisywać sąsiednich sekcji ani kolejnej lekcji dla dopasowania do nowego schematu. Nie uruchamiać ponownie dawnych instalatorów treści. Przed zapisem sprawdzić różnice pod kątem niezamierzonych usunięć i regresji.

Nie ustalać limitów znaków, linii, kroków ani jednakowej długości lekcji. Zakres wyjaśnienia wynika ze złożoności zagadnienia i wiedzy ucznia. Dzielić tekst według toku rozumowania, stosować czytelne akapity i obrazy przy omawianej czynności. Unikać zarówno ścian tekstu, jak i poszatkowanych, niezwiązanych zdań. Skracanie ma usuwać powtórzenia i puste komentarze, zachowując przyczyny, sposób wykonania i kryteria oceny wyniku.

Ponownie przeczytano SKILL_redactor.md, author-voice.md oraz reguły SKILL_humanizer.md dotyczące zachowania sensu i poprawiania problematycznych fragmentów. Reguły stylu nie upoważniają do zastępowania całej lekcji. W tej turze nie zmieniono treści lekcji. Ta notatka służy ciągłości pracy i nie wprowadza dodatkowego obowiązku zatwierdzania każdej poprawki przez autora.

### Lokalne poprawki lekcji zasad UV — 2026-10-18

Zmieniono wyłącznie „UV - jak wybierać cięcia i dzielić piksele.md”. Zachowano nagłówki, wszystkie siedem ilustracji, podsumowanie i sąsiednią lekcję praktyczną. Kopia wejściowa i różnice znajdują się w C:\xampp\htdocs\blender-course-development\revision\uv-local-corrections. Brak ustalonych limitów długości.

Poprawione luki: odczyt konkretnego pola obrazu na głowicy, zachowanie proporcji trapezowej powierzchni, geometria rozwijalna i obła, ocena drobnych pól checkera oddzielnie od kąta patrzenia, porównanie rozmiaru pól przy niezmienionym obrazie testowym, wybór szwu według miejscowego ściśnięcia, obraz skóry przygotowany pod UV, przydział miejsca według detalu i widoczności, rozróżnienie marginesu wysp i wypełnienia zapasu koloru. Tabela łączy objaw z rodzajem poprawki. Zasady są wprowadzeniem do kolejnej lekcji wykonywanej na młotku, bez pozorowania praktycznego ćwiczenia na gotowym popiersiu.

Sprawdzono istniejące ilustracje w oryginalnej rozdzielczości i w podglądzie kursu. Kompilacja offline i audyt 17 lekcji bez błędów i ostrzeżeń. Podgląd tej lekcji: siedem obrazów, brak błędów strony i przepełnienia przy szerokości 390 px. Obejrzano porównanie krzywizny oraz tabelę na ekranie desktopowym i mobilnym. Nie wykonano pilotażu z uczniem. Status: treść poprawiona, bez domniemanej akceptacji autora.

Źródła do kontroli poza narracją ucznia: Blender Manual, UV Operators (https://docs.blender.org/manual/en/5.0/modeling/meshes/editing/uv.html), Seams (https://docs.staging.blender.org/manual/en/latest/modeling/meshes/uv/unwrapping/seams.html), UV Overlays (https://docs.blender.org/manual/en/5.4/editors/uv/overlays.html). W tej turze dostępne były wyniki indeksu wyszukiwarki, pełne strony zwracały błędy dostępu. Nie przedstawiać ich jako przeczytanych w całości. Źródła geometrii odwzorowań i pochodzenie porównania półkuli zapisano wcześniej przy v38. Nie zmieniano modeli, map UV, obrazu skóry ani skali checkera w materiałach.


### Powrót do historii i kontekstu kursu — 2026-10-18

Autor odrzucił ostatnią redakcję. Porównanie zachowanych wersji ujawniło utratę wyjaśnień potrzebnych w dalszej nauce. Pochodzenie odtworzonych fragmentów, związki z sąsiednimi lekcjami i ograniczenia ocen zapisano w [25-KONTEKST-KURSU-I-ODTWORZENIE-UV.md](25-KONTEKST-KURSU-I-ODTWORZENIE-UV.md). To aktualny punkt wejścia do dalszej pracy nad tą lekcją. Nie zakładać akceptacji autora.



### 2026-10-20 — akceptacja wprowadzenia i redakcja praktyki UV

Autor zaakceptował lekcję wprowadzającą UV. Zachowano ją bez zmian. Zredagowano wyłącznie praktykę na młotku, zachowując dotychczasowe sekcje, porównania i ilustracje. Poprawiono m.in. nazwę operacji Boundary of Selected na podstawie lokalnego Blendera 5.2.2. Szczegóły zakresu, przepływu wiedzy, weryfikacji i dalszej pracy: [26-REDAKCJA-PRAKTYKI-UV-MLOTKA.md](26-REDAKCJA-PRAKTYKI-UV-MLOTKA.md).



### 2026-10-20 — wybór metody i ustawień Unwrap

Na prośbę autora rozszerzono tę samą lekcję praktyczną o metody menu UV Mapping, wszystkie pola operatora Unwrap oraz próbę porównania jednej zmiany w F9. Zachowano wcześniejszą treść i ilustracje. Zakres, źródła i ograniczenia kontroli: [27-METODY-I-USTAWIENIA-UNWRAP.md](27-METODY-I-USTAWIENIA-UNWRAP.md).


### 2026-10-20 - wizualne porównania metod i F9

Po uwadze autora o nadmiarze tekstu zastąpiono dwa bloki referencyjne porównaniami na złożonej obudowie i skanie głowy. Dodano 20 plansz, dwie grupy zakładek i plik Blender z wariantami. Pozostałe lekcje i wcześniejszy przebieg praktyki zachowano. Zakres, pochodzenie dowodów, przepływ umiejętności oraz ograniczenia: [28-WIZUALNE-POROWNANIA-MAPOWANIA-UV.md](28-WIZUALNE-POROWNANIA-MAPOWANIA-UV.md). Materiał pozostaje do oceny autora, przed pilotażem.
