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

Wyjście **Factor** Noise podłącz do dwóch węzłów. Jeden przewód może mieć kilka połączeń: przeciągnij kolejny z tego samego wyjścia. Węzły dodaj przez **Shift+A → Search** w Shader Editor:

- Do wejścia **Factor** w **Color Ramp**. Klikaj kolejno lewy i prawy znacznik pod paskiem, a potem pole koloru wybranego znacznika. Zamiast czerni i bieli ustaw dwie bardzo bliskie jasne szarości. Rampa ma nieznacznie różnicować jasność, a nie robić czarne plamy.
- Do wejścia **Value** w **Map Range**, z From Min 0, From Max 1, To Min **0.43**, To Max **0.53**. Result połącz z Roughness.

Map Range nie produkuje nowego szumu. Przelicza istniejący sygnał z zakresu 0-1 na zakres chropowatości. Jasne obszary Noise stają się trochę bardziej szorstkie, ciemne trochę gładsze. Różnica ma być widoczna w przesuwającym się refleksie, bez łat przypominających mokrą powierzchnię.

Dodaj **Mix Color**, wybierz w nim tryb **Multiply** i ustaw **Factor 1**. Połącz wyjście Color rampy z pierwszym wejściem koloru (**A**). Dodaj **RGB**, zmień jego nazwę na **Kolor tworzywa** i kliknij próbkę, aby wybrać kolor chwytu, np. ciemny niebieski. Wyjście RGB podłącz do drugiego wejścia koloru (**B**), a wynik Mix do **Base Color** Principled. W pliku przykładowym jest starszy węzeł **MixRGB**: jego dwa wejścia nazywają się Color1 i Color2 i pełnią te same role.

Mnożymy neutralną strukturę przez wybrany kolor. Dzięki temu czerwony wariant wymaga zmiany jednego RGB, a nie przebudowy Noise i Color Ramp. Stal korzysta z innego materiału, więc zmiana jej nie obejmuje.

![Węzły tworzywa: neutralna struktura, zakres Roughness i kolor oddzielony od tej struktury](/public/courses/blender/Images/wkretak-tworzywo-wezly.png)

## 🫧 Mikrorelief nie jest kształtem rękojeści

Dodaj drugi Noise Texture, również z Object, ale ze Scale około **2400** i Detail 2. To znacznie mniejsze cechy niż w pierwszym Noise. Scale nie oznacza liczby widocznych kropek: przy tych współrzędnych wzrost Scale zmniejsza typowy rozmiar struktury.

Połącz wyjście **Factor** drugiego Noise z **Height** węzła **Bump**, a jego Normal z wejściem Normal w Principled. Zacznij od **Strength 0.35**, **Distance 0.000008 m**. Distance jest skalą interpretowanej różnicy wysokości, tutaj rzędu mikrometrów. Wysokość nie ma związku z głębokością wymodelowanych rowków, która jest wielokrotnie większa.

Sprawdź efekt z bliska: zaznacz węzeł Bump i naciśnij **M**, aby go tymczasowo wyciszyć. Drugie M przywróci działanie. Ziarno może delikatnie rozbijać refleks, ale nie powinno robić z chwytu pumeksu. Potem oddal widok do całego narzędzia. Jeżeli nadal widzisz każdą grudkę, struktura jest zbyt gruba albo relief zbyt silny. Jeżeli ziarno przestaje być rozróżnialne, a satynowe odbicie nadal pasuje do tworzywa, to oczekiwany wynik. W grze najmniejsze cechy i tak ograniczy rozdzielczość tekstury oraz filtrowanie.

Nie wzmacniaj Bump, żeby zastąpić krawędzie rowków. Ich głębokość i obrys już istnieją w siatce.

## ⚙️ Stal: kierunek zamiast przypadkowej plamistości

Grotowi utwórz materiał **Stal szlifowana**, Metallic 1. Najpierw ustaw jednolitą Roughness około 0.32 i neutralny, jasny kolor odbicia. Obróć oświetlenie: na stali musi być widoczne otoczenie. Ciemny metal w ciemnym otoczeniu nie jest dowodem, że Metallic nie działa.

Szlif powinien biec wzdłuż powierzchni grotu. Gdy rozciągniemy szum tylko w osi świata, na prostym trzpieniu może wyglądać dobrze, ale na pochylonej końcówce zmieni gęstość. Dlatego damy materiałowi osobne współrzędne **UV_Szlif**. **U oznacza poziomy kierunek w edytorze UV, a V pionowy**. U ustawimy w poprzek metalowego pola, V wzdłuż niego. To kierunki na rozłożonej powierzchni, nie osie świata.

Otwórz [high poly z przygotowanym UV i materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend), jeżeli chcesz najpierw sprawdzić działający przykład. Zaznacz **HIGH_Grot** i w Properties otwórz **Object Data Properties** z ikoną zielonego trójkąta. Rozwiń **UV Maps** i wybierz **UV_Szlif**. W przestrzeni **UV Editing**, po wejściu Tabem w Edit Mode i zaznaczeniu całości klawiszem A, po lewej zobaczysz rozłożone pola metalu. Najedź na ten edytor i naciśnij **Home**, aby objąć widokiem cały układ.

**Ten układ służy do tworzenia szlifu, a nie do upakowania gotowego assetu na obrazku.** Pola mogą tutaj na siebie zachodzić i wychodzić poza kwadrat 0-1, bo materiał proceduralny oblicza wzór także poza nim. W następnej lekcji zrobimy osobny **UV_Asset**, w którym każda część dostanie własne miejsce na wypalanej teksturze. Zachodzenie wysp w tamtym atlasie spowodowałoby nadpisywanie obrazu.

Jeżeli pracujesz od własnego modelu, przygotuj UV_Szlif następująco. Chcemy osobnych, nierozciągniętych rzutów płaskich pól, a nie rozciągania krótkiego ostrza na taki sam prostokąt jak długi trzpień.

1. Zaznacz grot, w **Object Data Properties → UV Maps** kliknij **+** i nazwij nową mapę **UV_Szlif**. Przejdź do **UV Editing**. W widoku 3D wejdź w Edit Mode, wybór ścian (**3 z górnego rzędu**), odznacz wszystko i wybierz jedno długie płaskie pole trzpienia. Pracuj na siatce sterującej, nie stosuj Bevel.
2. Z kursorem nad widokiem 3D naciśnij **Shift+Num7**. Widok ustawi się prostopadle do aktywnej ściany. Użyj **U → Project from View**. Wybierz zwykłe Project from View, nie **Project from View (Bounds)**: wariant Bounds rozciąga zaznaczenie do rozmiaru kwadratu, a my chcemy zachować proporcje pola.
3. Powtórz wybór ściany, ustawienie prostopadłego widoku i projekcję dla pozostałych płaskich pól trzpienia oraz końcówki. Małe, pochyłe pola przejścia też rzutuj z ich własnego widoku. Zmienianie powiększenia między projekcjami może zmienić rozmiary wysp; wyrównamy je wspólnie za chwilę. Projekcja z boku całego grotu spłaszczyłaby pochyłe pola i ponownie ścisnęła na nich wzór.
4. W widoku 3D zaznacz wszystkie ściany. Przenieś kursor do **UV Editor**, naciśnij A, a w menu **UV → Average Islands Scale** wyrównaj skalę wysp względem powierzchni modelu. Długi trzpień powinien zajmować odpowiednio więcej miejsca niż krótka końcówka. Ta operacja wyrównuje rozmiar wzoru pomiędzy wyspami; nie naprawia zniekształceń wewnątrz źle rzutowanej wyspy.
5. W UV Editor odznacz wszystko przez Alt+A. Najedź na pojedynczą wyspę i naciśnij **L**, aby zaznaczyć ją w całości. Obróć ją przez **R**, tak aby jej długi kierunek biegł pionowo. Powtórz dla pozostałych pól. Obracaj wyspy, ale nie rozciągaj ich osobno przez S X lub S Y. Na wąskim polu końcówki za kierunek wzdłużny przyjmij kierunek od trzpienia do czubka.

Teraz sprawdzimy, co te czynności dały na modelu. Wróć do **Shading** i zaznacz grot. W Shader Editor wybierz jego materiał. Węzły dodajesz przez **Shift+A → Search** z kursorem nad tym edytorem. Wyszukaj **UV Map**, a w dodanym węźle wybierz nazwę **UV_Szlif**. Dodaj **Checker Texture**. Przeciągnij przewód z wyjścia **UV** pierwszego węzła do wejścia **Vector** drugiego, a wyjście **Color** kratki podłącz tymczasowo do **Base Color** w Principled BSDF. Dla czytelności kontroli ustaw na chwilę Metallic 0; po kontroli wrócisz do 1.

W przygotowanym pliku zacznij od **Scale 1000** w Checker Texture. W swoim układzie dobierz Scale tak, aby zobaczyć kilkanaście kratek wzdłuż trzpienia. Liczba zależy od wielkości UV. **Nie musisz przeliczać UV na metry.** Tu sprawdzamy proporcje i porównujemy wielkość kratek na różnych częściach.

![Kratka o stałej skali powierzchni na trzpieniu i pochyłej końcówce](/public/courses/blender/Images/wkretak-stal-checker.png)

Oglądaj każde pole na wprost. Kwadrat widziany pod kątem wygląda na węższy nawet przy dobrym UV. Na trzpieniu i ostrzu kratki powinny być podobnej wielkości. **Prostokąty zamiast kwadratów** oznaczają rozciągnięcie: wróć do projekcji konkretnego pola. **Kwadraty, ale znacznie mniejsze na ostrzu** oznaczają różną skalę wysp: zaznacz wszystkie i ponów Average Islands Scale. Zwiększenie Scale w Checker Texture zagęści cały wzór; nie wyrówna jednej źle rozłożonej części.

![Ten sam materiał stali z projekcją w osiach 3D oraz ze współrzędnymi powierzchni](/public/courses/blender/Images/wkretak-stal-uv-poprawa.png)

Gdy kratka przechodzi kontrolę, odłącz ją od Base Color i przywróć **Metallic 1**. Checker zostaw z boku grafu, żeby móc do niego wrócić. Teraz zbuduj szlif:

1. Dodaj **Vector Math** i z listy operacji w jego nagłówku wybierz **Multiply**. Połącz **UV** z UV Map z pierwszym wejściem **Vector**. Drugie wejście pozostaw bez przewodu: jego trzy pola to mnożniki kierunków U, V oraz niewykorzystywanego tutaj trzeciego kierunku.
2. Dla **przygotowanego UV z pliku** wpisz w te pola **6000, 100, 1**. Dodaj **Noise Texture**, podłącz wyjście Vector z Multiply do Vector w Noise. Ustaw Noise **Scale 1**, **Detail 2**. Większy mnożnik U sprawia, że wzór zmienia się szybko w poprzek pola; mniejszy V wydłuża go wzdłuż. Powstają drobne podłużne ślady.
3. Jeśli przygotowałeś własny UV, jego całkowita wielkość będzie inna niż w pliku, więc te same liczby dadzą inną grubość szlifu. Zachowaj na początek proporcję mnożników U do V, a **Scale w Noise** zmieniaj, obserwując model: większy Scale daje drobniejszy wzór, mniejszy grubszy. Ta regulacja zmienia oba kierunki razem. Oceniaj trzpień i ostrze jednocześnie; nie dopasowuj każdego pola osobnym skalowaniem UV.
4. Dodaj **Map Range**. Wyjście **Factor** Noise podłącz do **Value** Map Range. Ustaw **From Min 0**, **From Max 1**, **To Min 0.29**, **To Max 0.35**. Wyjście **Result** podłącz do **Roughness** w Principled. Szum nie steruje już chropowatością w pełnym zakresie od lustra do matu: mieści ją między 0.29 a 0.35.
5. Dodaj **Color Ramp**. To samo wyjście **Factor** Noise połącz także z **Factor** rampy, a jej **Color** z **Base Color** w Principled. Kliknij lewy znacznik pod paskiem rampy, potem pole koloru poniżej. Ustaw jasną, lekko chłodną szarość. Wybierz prawy znacznik i ustaw bardzo zbliżoną, odrobinę jaśniejszą szarość. Zastępujemy domyślną czerń i biel: ich duży kontrast dałby ciemne paski przypominające farbę. W gotowym pliku możesz kliknąć oba znaczniki i porównać ich kolory.

![Węzły kierunkowej struktury stali i ograniczonego zakresu chropowatości](/public/courses/blender/Images/wkretak-stal-wezly.png)

Najpierw obejrzyj wynik bez Bump. Obracaj oświetlenie w Material Preview przez **Shift+PPM i przeciąganie** w widoku 3D. Szlif powinien delikatnie rozbijać odbicie, a nie pokrywać grot wyraźną zebrą. Jeśli pasy są zbyt mocne, zbliż do siebie kolory rampy. Jeśli refleks jest zbyt nierówny, zbliż wartości To Min i To Max w Map Range. To dwie różne poprawki: pierwsza zmienia kolor odbicia, druga jego rozproszenie.

Dopiero potem możesz dodać mikrorelief. Dodaj drugi Noise Texture i podłącz do jego Vector to samo wyjście Multiply. Dodaj **Bump**, połącz **Factor** drugiego Noise z **Height**, a wyjście **Normal** Bump z **Normal** Principled. Zacznij od Scale 1, Detail 2 w Noise oraz Strength 0.35 i Distance **0.000002 m** w Bump. Przy własnym UV użyj Scale dopasowanego w poprzednim Noise. Bump zmienia kierunek odbicia, nie dodaje rzeczywistych rys do siatki. Jeśli efekt nie poprawia wyglądu w docelowym kadrze, nie musisz go zachowywać.

![Jednolita stal i stal ze strukturą przy tej samej kamerze, geometrii i świetle](/public/courses/blender/Images/wkretak-stal-porownanie.png)

## 💡 Oceń wykończenie przed wypalaniem

Oglądaj osobno obrys, szerokie refleksy i drobną strukturę. Obrys nadal zależy od siatki. Refleks powinien przechodzić przez fazy bez przypadkowych załamań. Struktura ma różnicować tworzywo i stal, a nie zasłaniać całą konstrukcję.

![Zbliżenia na gotowe tworzywo i stal](/public/courses/blender/Images/wkretak-materialy-zblizenie.png)

Zmniejsz na chwilę zakres Roughness do jednej wartości, odłącz Bump i porównaj wynik. W ten sposób rozpoznasz wkład obu sygnałów. Zostaw tylko to, co daje pożądane wykończenie. Na tym etapie zachowujemy fabryczne wykończenie narzędzia.

Przed przygotowaniem normal mapy nadajemy ściankom rowków niewielki skos. **W gotowym pliku wkretak-04-high-materialy ten skos jest już wykonany; nie skaluj jego den drugi raz.** Poniższe czynności wykonaj, jeśli nadal pracujesz na modelu z prostymi, pionowymi ściankami. Na high poly w Edit Mode i wyborze ścian zaznacz osiem den. W nagłówku widoku 3D otwórz **Transform Pivot Point** (menu środka transformacji obok wyboru Global/Local) i wybierz **Individual Origins**, żeby każde pole miało własny środek. Wykonaj **S Shift+Z 0.81**: skalujesz w płaszczyźnie XY, więc zwężasz dno bez zmiany jego długości ani głębokości. Następnie **S Z 0.982** lekko skraca zakończenia. W tym modelu brzegi cofają się w płaszczyźnie dna o około 0.6 mm. Powstaje szersze wejście i węższe dno. Przywróć pivot Median Point. Skalowanie wszystkich den razem względem środka rękojeści zmieniłoby także ich rozstaw i głębokość; dlatego wybór pivota jest tu istotny.

Skos ma także znaczenie dla bake. Ścianka dokładnie prostopadła do płaskiego panelu ma w projekcji niemal zerową szerokość. Jej kierunek nie dostanie własnego pasa pikseli. Ukośne przejście ma szerokość, więc można przedstawić je normal mapą na gładkim chwycie. W kolejnej lekcji porównamy tę wersję z zachowanymi rowkami w geometrii.

Zapisz [high poly z edytowalnymi materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend). W następnej lekcji zbudujemy wersję do gry, zachowując ten plik jako źródło. Węzły proceduralne zostaną na high poly; do gry trafią ich wypalone odpowiedniki i znacznie lżejsza siatka.
