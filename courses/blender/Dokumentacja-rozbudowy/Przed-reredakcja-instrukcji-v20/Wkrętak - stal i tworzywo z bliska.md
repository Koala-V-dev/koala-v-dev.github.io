# Wkrętak - stal i tworzywo z bliska

Mamy model z czytelnym chwytem. Teraz nadamy mu wykończenie nowego narzędzia: satynowe tworzywo i szlifowaną stal. Zmienność powierzchni zbudujemy w shaderze, a później wypalimy ją do obrazów używanych przez wersję do gry.

Otwórz [wkrętak po modelowaniu](/public/courses/blender/Resources/wkretak-02-model.blend) i zapisz osobną wersję. Kolekcję nazwij **HIGH**, obiekty **HIGH_Rekojesc** i **HIGH_Grot**. W obu Bevel zwiększ Segments do **6**, pozostawiając szerokości i wagi. Nie zmieniaj obrysu tylko po to, żeby zwiększyć liczbę ścian. High poly będzie źródłem kształtu i powierzchni dla późniejszego bake.

![High poly z materiałem tworzywa i szlifowanej stali](/public/courses/blender/Images/wkretak-materialy-high.png)

## 🔬 Co właściwie opisujemy teksturą

Na tworzywie potrzebujemy koloru, rozkładu chropowatości i bardzo drobnego reliefu po formowaniu. Na stali również potrzebujemy tekstury: niewielkiej zmienności odbicia i kierunku szlifu. **Metallic pozostaje 0 dla tworzywa i 1 dla odsłoniętej stali**. Nie zamieniamy tworzywa w metal przez obniżenie Roughness ani stali w plastik przez jej podwyższenie.

Base Color metalu określa barwę jego odbicia. Roughness określa, jak szeroko rozprasza się refleks. Normal lub Bump zmienia kierunek lokalnego odbicia. Dlatego drobny szlif powinien przede wszystkim pracować w świetle, a nie wyglądać jak namalowane ciemne pasy.

Pracuj w **Shading**, z Material Preview i tym samym oświetleniem, którego używałeś do oceny bryły. Nie zmieniaj jednocześnie materiału, światła i ekspozycji: stracisz informację, co rzeczywiście poprawiło wygląd.

## 🧴 Tworzywo: oddziel kolor od struktury

Rękojeści utwórz materiał **Tworzywo formowane**. W Principled BSDF pozostaw Metallic 0 i Coat Weight 0. Nie dodajemy lakieru na całym chwycie. Dodaj **Texture Coordinate** i korzystaj z wyjścia **Object**. Przy skali obiektów 1 współrzędne odnoszą się do rozmiaru tej konstrukcji, więc szersza część nie dostaje automatycznie drobniejszego ziarna niż szyjka.

Dodaj **Noise Texture**. Połącz Object z Vector, ustaw Scale około **160**, Detail **2**. Ten Noise opisuje łagodną zmienność większych fragmentów, nie pojedyncze ziarna plastiku.

Z jego Fac poprowadź dwie gałęzie:

- Do **Color Ramp**, z dwoma bliskimi szarościami: liniowe RGB około **0.78** i **0.82**. To niewielka zmienność jasności nośnika koloru.
- Do **Map Range**, z From Min 0, From Max 1, To Min **0.43**, To Max **0.53**. Result połącz z Roughness.

Map Range nie produkuje nowego szumu. Przelicza istniejący sygnał z zakresu 0-1 na zakres chropowatości. Jasne obszary Noise stają się trochę bardziej szorstkie, ciemne trochę gładsze. Różnica ma być widoczna w przesuwającym się refleksie, bez łat przypominających mokrą powierzchnię.

Między Color Ramp a Base Color wstaw **Mix Color** w trybie **Multiply**, z Factor 1. Drugim kolorem niech będzie węzeł **RGB** nazwany **Kolor tworzywa**. Dla niebieskiego wariantu użyj przykładowo liniowego RGB **0.025, 0.09, 0.15**. W pliku przykładowym tę operację realizuje węzeł MixRGB, również w trybie Multiply.

Mnożymy neutralną strukturę przez wybrany kolor. Dzięki temu czerwony wariant wymaga zmiany jednego RGB, a nie przebudowy Noise i Color Ramp. Stal korzysta z innego materiału, więc zmiana jej nie obejmuje.

![Węzły tworzywa: neutralna struktura, zakres Roughness i kolor oddzielony od tej struktury](/public/courses/blender/Images/wkretak-tworzywo-wezly.png)

## 🫧 Mikrorelief nie jest kształtem rękojeści

Dodaj drugi Noise Texture, również z Object, ale ze Scale około **2400** i Detail 2. To znacznie mniejsze cechy niż w pierwszym Noise. Scale nie oznacza liczby widocznych kropek: przy tych współrzędnych wzrost Scale zmniejsza typowy rozmiar struktury.

Połącz Fac z **Height** węzła **Bump**, a jego Normal z wejściem Normal w Principled. Zacznij od **Strength 0.35**, **Distance 0.000008 m**. Distance jest skalą interpretowanej różnicy wysokości, tutaj rzędu mikrometrów. Wysokość nie ma związku z głębokością wymodelowanych rowków, która jest wielokrotnie większa.

Sprawdź efekt z bliska, wyłączając połączenie Bump. Ziarno może delikatnie rozbijać refleks, ale nie powinno robić z chwytu pumeksu. Potem oddal widok do całego narzędzia. Jeżeli nadal widzisz każdą grudkę, struktura jest zbyt gruba albo relief zbyt silny. Jeżeli ziarno przestaje być rozróżnialne, a satynowe odbicie nadal pasuje do tworzywa, to oczekiwany wynik. W grze najmniejsze cechy i tak ograniczy rozdzielczość tekstury oraz filtrowanie.

Nie wzmacniaj Bump, żeby zastąpić krawędzie rowków. Ich głębokość i obrys już istnieją w siatce.

## ⚙️ Stal: kierunek zamiast przypadkowej plamistości

Grotowi utwórz materiał **Stal szlifowana**, Metallic 1. Najpierw ustaw jednolitą Roughness około 0.32 i neutralny, jasny kolor odbicia. Obróć oświetlenie: na stali musi być widoczne otoczenie. Ciemny metal w ciemnym otoczeniu nie jest dowodem, że Metallic nie działa.

Jeśli zaczynasz od wcześniejszego pliku bez tego UV, przygotuj go opisanym niżej sposobem albo otwórz [stan z przygotowanym źródłowym UV](/public/courses/blender/Resources/wkretak-04-high-materialy.blend), żeby prześledzić połączenia na działającym materiale. Dla szlifu użyjemy **UV Map → UV_Szlif**, a nie rozciągniętego pola szumu w osiach świata. W dołączonym high poly ten źródłowy układ jest przygotowany w skali powierzchni: U biegnie w poprzek pola, V wzdłuż niego. Osobne płaskie pola otrzymują rzut na ich własną płaszczyznę, z zachowaniem jednostek długości. Ostrze nie jest więc traktowane jak pionowy trzpień, na który z boku pada ten sam wzór 3D.

To inny układ niż późniejsze **UV_Asset**. UV_Szlif służy do opisania materiału źródłowego i może wychodzić poza 0-1. UV_Asset będzie wspólnym, niepokrywającym się atlasem całego assetu. Bake przeniesie wygląd między tymi przestrzeniami.

Dodaj **Vector Math → Multiply** i Noise Texture. Wyjście UV Map połącz z pierwszym wektorem Multiply. Drugi ustaw orientacyjnie na **6000, 100, 1**, wynik do Vector Noise. Scale Noise pozostaw 1, Detail 2. U zmienia się szybko, V znacznie wolniej: struktura staje się wąska w poprzek i wydłużona wzdłuż powierzchni. Wzrost obu wartości zagęści wzór, a zamiana ich proporcji obróci dominujący kierunek.

![Kratka o stałej skali powierzchni na trzpieniu i pochyłej końcówce](/public/courses/blender/Images/wkretak-stal-checker.png)

Sprawdź to **przed szumem**: podłącz UV_Szlif do Checker Texture o Scale około 1000 i na chwilę pokaż go jako Base Color. Kwadraty oglądaj na wprost danego pola, nie na krawędzi perspektywicznego widoku. Jeżeli po przejściu na ostrze robią się prostokątami, popraw jego UV. Jeżeli kratka zachowuje skalę, a sam szlif się zagęszcza, sprawdź współrzędne i kierunek w shaderze. Pakowanie atlasu nie naprawi źle rozciągniętego szumu 3D.

![Ten sam materiał stali z projekcją w osiach 3D oraz ze współrzędnymi mierzącymi powierzchnię](/public/courses/blender/Images/wkretak-stal-uv-poprawa.png)

Gdy budujesz ten źródłowy UV samodzielnie, rozdziel pola trzpienia i przejście w ostrze. Rzutuj płaskie pole z widoku prostopadłego do niego, potem wyrównaj skalę wysp względem powierzchni i ustaw ich długi kierunek wzdłuż V. Nie normalizuj każdej wyspy osobno do całego kwadratu: krótki fragment dostałby inną gęstość szlifu niż długi. Przy kalibracji użyj jednego znanego odcinka: prosty trzpień ma 102 mm. Odczytaj V wierzchołków na obu jego końcach w panelu Item UV i oblicz różnicę ΔV. Zaznacz cały źródłowy układ i przeskaluj go współczynnikiem **0.102 / ΔV**. W tej skali jednostka UV odpowiada metrowi, więc wartości kierunkowego Noise mają wspólny sens na wszystkich polach. Pozostaw ten źródłowy układ bez końcowego normalizowania do kwadratu 0-1.

Fac Noise podłącz do Map Range z zakresem wyjściowym **0.29-0.35**, a wynik do Roughness. Dla Base Color użyj Color Ramp z bliskimi odcieniami stali, np. liniowe RGB od **0.52, 0.55, 0.59** do **0.55, 0.58, 0.62**. Duży kontrast stworzyłby paski farby zamiast zmienności metalowej powierzchni.

![Węzły kierunkowej struktury stali i ograniczonego zakresu chropowatości](/public/courses/blender/Images/wkretak-stal-wezly.png)

Jeśli dodajesz mikrorelief, użyj tego samego kierunkowego wektora w drugim Noise i Bump o Strength około 0.35 oraz Distance **0.000002 m**. Nie kopiuj wysokości plastiku: to inna powierzchnia. Na płaskim ostrzu kierunek pozostaje wzdłuż Z. Przy modelowaniu innego sposobu obróbki można nadać mu odrębny kierunek, zamiast udawać, że jeden szlif odpowiada każdej powierzchni narzędzia.

![Jednolita stal i stal ze strukturą przy tej samej kamerze, geometrii i świetle](/public/courses/blender/Images/wkretak-stal-porownanie.png)

## 💡 Oceń wykończenie przed wypalaniem

Oglądaj osobno obrys, szerokie refleksy i drobną strukturę. Obrys nadal zależy od siatki. Refleks powinien przechodzić przez fazy bez przypadkowych załamań. Struktura ma różnicować tworzywo i stal, a nie zasłaniać całą konstrukcję.

![Zbliżenia na gotowe tworzywo i stal](/public/courses/blender/Images/wkretak-materialy-zblizenie.png)

Zmniejsz na chwilę zakres Roughness do jednej wartości, odłącz Bump i porównaj wynik. W ten sposób rozpoznasz wkład obu sygnałów. Zostaw tylko to, co daje pożądane wykończenie. Na tym etapie zachowujemy fabryczne wykończenie narzędzia.

Przed przygotowaniem normal mapy nadajemy ściankom rowków niewielki skos. Na high poly w Edit Mode i wyborze ścian zaznacz osiem den. Ustaw pivot **Individual Origins**, żeby każde pole miało własny środek. Wykonaj **S Shift+Z 0.81**: skalujesz w płaszczyźnie XY, więc zwężasz dno bez zmiany jego długości ani głębokości. Następnie **S Z 0.982** lekko skraca zakończenia. W tym modelu brzegi cofają się w płaszczyźnie dna o około 0.6 mm. Powstaje szersze wejście i węższe dno. Przywróć pivot Median Point. Skalowanie wszystkich den razem względem środka rękojeści zmieniłoby także ich rozstaw i głębokość; dlatego wybór pivota jest tu istotny.

Skos ma także znaczenie dla bake. Ścianka dokładnie prostopadła do płaskiego panelu ma w projekcji niemal zerową szerokość. Jej kierunek nie dostanie własnego pasa pikseli. Ukośne przejście ma szerokość, więc można przedstawić je normal mapą na gładkim chwycie. W kolejnej lekcji porównamy tę wersję z zachowanymi rowkami w geometrii.

Zapisz [high poly z edytowalnymi materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend). W następnej lekcji zbudujemy wersję do gry, zachowując ten plik jako źródło. Węzły proceduralne zostaną na high poly; do gry trafią ich wypalone odpowiedniki i znacznie lżejsza siatka.
