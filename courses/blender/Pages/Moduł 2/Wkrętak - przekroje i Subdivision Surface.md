# Wkrętak - przekroje i Subdivision Surface

Zbudujemy płaski wkrętak z wielokątną rękojeścią i ośmioma podłużnymi zagłębieniami. Na chwycie zostaną szerokie pola, a między nimi zaokrąglone żebra. To ważne rozróżnienie: zaokrąglona krawędź nie oznacza, że cała powierzchnia ma być wypukła.

![Wkrętak z płaskimi polami chwytu, rowkami i osadzonym trzpieniem](/public/courses/blender/Images/wkretak-forma.png)

W tej pracy porównasz dwa sposoby prowadzenia powierzchni: **Subdivision**, który przelicza całą bryłę, i Bevel, który buduje fazy przy wybranych krawędziach. Wybór oprzemy na kształcie i odbiciach. Materiał dodamy do oceny powierzchni, zanim zajmiemy się teksturami.

## 🧱 Najpierw przekrój i proporcje

Wybierz File → New → General i ustaw Scene → Units: Metric, Unit Scale `1`. Zaznacz domyślne obiekty, przenieś je przez <kbd>M</kbd> → New Collection do kolekcji `Wkretak`, a następnie usuń. Kursor 3D pozostaw w początku świata. W tej kolekcji dodamy części narzędzia.

Rękojeść będzie miała około 10 cm długości i 28 mm szerokości, a cały przedmiot około 21 cm. Długi chwyt powinien mieścić dłoń; krótsza szyjka osadza stalowy trzpień. Rowki nie powinny dochodzić do samych końców chwytu: zostawimy tam pełne pasy tworzywa.

Z kursorem nad widokiem 3D wybierz Add → Mesh → Cylinder. Od razu po dodaniu cylindra otwórz <kbd>F9</kbd> i ustaw Vertices 8, Radius 0.014 m, Depth 0.08 m, Location Z 0.04 m. Dolna pokrywa wypada na Z=0: wysokość cylindra wynosi 80 mm, więc jego środek ustawiamy 40 mm nad początkiem świata. Osiem boków odpowiada ośmiu polom chwytowym; nie wybieramy tej liczby jako uniwersalnej jakości cylindrów.

Nazwij obiekt Rekojesc. Ustaw Object → Set Origin → Origin to 3D Cursor. W Edit Mode zaznacz wszystko i obróć siatkę <kbd>R</kbd>, <kbd>Z</kbd>, `22.5`. Dzięki obrotowi płaskie boki są ustawione symetrycznie względem osi. Origin pozostaje przy podstawie, więc wysokości w panelu Item można odczytywać od stołu.

Przejdź do wyboru ścian (<kbd>3</kbd> nad literami). Odznacz wszystko i wybierz górną pokrywę. Wykonaj <kbd>E</kbd>, <kbd>Z</kbd>, `0.01`, <kbd>Enter</kbd>, następnie <kbd>S</kbd>, `0.65`, <kbd>Enter</kbd>. Powstaje zwężenie. Jeszcze <kbd>E</kbd>, <kbd>Z</kbd>, `0.006`, <kbd>Enter</kbd> tworzy krótką szyjkę. Obejrzyj obrys z przodu i z boku: korpus ma być prosty, bark zwężać się do szyjki, a szyjka zachowywać stałą szerokość.

![Przekroje korpusu, barku i szyjki przed zaokrąglaniem](/public/courses/blender/Images/wkretak-przekroje.png)

Te przekroje opisują zmianę formy. Dodatkowe podziały na prostym odcinku nie poprawią jego proporcji. Jeżeli rękojeść wygląda jak butelka, popraw długość szyjki i stosunek jej szerokości do korpusu teraz, gdy przesunięcie jednego pierścienia zmienia cały obrys.

## 🫧 Dlaczego Subdivision zmienia projekt

W Object Mode otwórz zakładkę z kluczem i przez Add Modifier wyszukaj Subdivision Surface. Pozostaw Catmull-Clark, ustaw Levels Viewport 2 i Render 2. W Object Mode wybierz Object → Shade Smooth. W panelu modyfikatora wyłączaj i włączaj ikonę monitora, patrząc na sam obrys.

Shade Smooth interpoluje kierunki normalnych używane do cieniowania. Sąsiednie ściany wyglądają na płynnie połączone, ale nie pojawiają się nowe punkty na obrysie. Subdivision dodaje geometrię i zmienia jej położenie. Dlatego potrafi rzeczywiście zaokrąglić ośmiokąt, ale też zwęzić korpus i rozmyć bark. To nie jest filtr usuwający błędy modelowania.

Siatka sterująca to prostsza siatka, którą edytujesz w Edit Mode. Modyfikator oblicza z niej gęstszą powierzchnię wynikową. Każdy poziom podziału ponownie dzieli powierzchnię. Wyższy Levels dokładniej opisuje wynikową krzywiznę; nie przywraca płaszczyzny, którą siatka sterująca zamieniła w łuk. Na chwilę zmień 2 na 3. Jeżeli kształt jest zły przy 2, po zwiększeniu poziomu pozostanie zły, tylko gęściej podzielony.

Żeby zobaczyć rolę pętli, w Edit Mode dodaj <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> na długim korpusie. Kliknij, następnie <kbd>PPM</kbd>, aby zostawić cięcie w środku. Uruchom Edge → Edge Slide lub naciśnij kolejno <kbd>G</kbd>, <kbd>G</kbd> i przesuń pierścień blisko dolnego końca, ale nie na samą krawędź.

Obserwuj, jak dolne zaokrąglenie staje się węższe. Cofnij samo przesunięcie i odsuń pętlę: przejście ponownie się rozszerza. Pętla podtrzymująca ogranicza obszar zmiany krzywizny, nie nadaje automatycznie „poprawnej ostrości”.

![Wpływ pętli na tę samą bryłę przy tym samym poziomie Subdivision, przed wykonaniem rowków](/public/courses/blender/Images/wkretak-subdivision-porownanie.png)

Przy obłym chwycie można rozwijać tę konstrukcję pętlami podtrzymującymi. Tutaj chcemy zachować płaskie pola, dlatego dalszą rękojeść wykonamy przez Bevel. Cofnij próbne dodanie pętli, usuń Subdivision przyciskiem X w jego nagłówku. Nie wybieraj Apply: Apply utrwaliłoby gęstą siatkę zamiast powrotu do prostych przekrojów.

Jeżeli potrzebujesz wrócić do bryły użytej w tym porównaniu, [plik przed pętlami](/public/courses/blender/Resources/wkretak-01-przed-petlami.blend) zawiera korpus, bark i szyjkę z aktywnym Subdivision. To stan demonstracji, nie finalny model z rowkami.

## ✋ Rowek potrzebuje dna, ścianek i miejsca na żebro

Wróć do Edit Mode i sprawdź, czy po próbie Subdivision została pierwotna siatka: dolna i górna granica korpusu, bark oraz szyjka. Próbnej pętli podtrzymującej nie powinno być. Jeżeli została, cofnij jej dodanie, zanim wyznaczysz granice rowków.

Przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> dodaj na korpusie dwa poziome Loop Cut, po jednym na operację. Najedź na długą pionową krawędź; podgląd ma okrążać korpus. Po każdym cięciu kliknij i <kbd>PPM</kbd>, a przy zaznaczonym pierścieniu ustaw w <kbd>N</kbd> → Item → Median Z odpowiednio 0.004 m i 0.076 m. Wyznaczają dolną i górną granicę rowków. Czteromilimetrowe pasy na końcach pozostaną pełne.

Wybierz ściany, włącz prześwietlenie <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>Z</kbd></span> i odznacz wszystko. Ramką `B` obejmij środki ośmiu długich ścian pomiędzy nowymi pierścieniami. Nie obejmuj środków krótkich pasów. Wyłącz prześwietlenie i obróć widok, sprawdzając tył: zaznaczonych ma być osiem długich pól.

Naciśnij <kbd>I</kbd>, a podczas operacji ponownie <kbd>I</kbd>, aby przełączyć na Inset Individual. Ustaw wstawienie około 2.2 mm (`0.0022`). Każda ściana dostaje własne obrzeże. Zwykły Inset traktowałby sąsiadujące zaznaczenie jako wspólny obszar; potrzebujemy ośmiu oddzielnych den.

Zaznaczone środki cofnij przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>E</kbd></span> → Extrude Individual Faces, około -1.2 mm (`-0.0012`). Każde dno porusza się wzdłuż własnej normalnej, czyli kierunku prostopadłego do swojej ściany. Zatwierdź klawiszem <kbd>Enter</kbd>. Przez <kbd>F9</kbd> sprawdź wartość przesunięcia, jeśli podczas przeciągania trudno było ją odczytać.

Zwykłe G przesunęłoby wszystkie pola w jednym kierunku świata. Zwykłe skalowanie zmieniłoby też ich szerokość, zamiast utworzyć ścianki o zadanej głębokości.

![Siatka chwytu: pełne pasy na końcach, obrzeża, boczne ścianki i cofnięte dna](/public/courses/blender/Images/wkretak-rowki-siatka.png)

Spójrz na rowek z boku, nie tylko na wprost. Wstawienie określa szerokość otaczającego żebra, a wyciągnięcie głębokość zagłębienia. To niezależne decyzje. Zbyt wąskie żebro zniknie po zaokrągleniu, zbyt głęboki rowek da cienkie, agresywne krawędzie. W podanych wymiarach zostaje miejsce na oba promienie.

Nie dodawaj kolejnego wąskiego Inset przy dnie ani cięć Bisect. W tej konstrukcji za promienie odpowiada Bevel. Dodatkowe ciasne pasy ograniczałyby fazę, a nie poprawiały kształt automatycznie.

## 📐 Dwa promienie w jednym Bevel

Bevel w trybie Weight odczytuje wagę każdej krawędzi. Waga `1` oznacza pełną ustawioną szerokość fazy, `0.2` jedną piątą, a `0` pominięcie krawędzi. Przy włączonym Clamp Overlap faza może zostać dodatkowo ograniczona przez sąsiednią geometrię.

### 🧮 Znajdź pole wag

1. Pozostań w Edit Mode. Włącz wybór krawędzi klawiszem <kbd>2</kbd> i zaznacz całość przez <kbd>A</kbd>.
2. Otwórz panel boczny klawiszem <kbd>N</kbd>. W zakładce Item rozwiń Edges Data.
3. W Mean Bevel Weight wpisz `1`. Na razie wszystkie krawędzie mają tę samą wagę. Zmienimy ją tam, gdzie potrzebujemy mniejszego promienia lub braku fazy.

W tym panelu jest też podobne pole w Vertices Data. Pozostań przy Edges Data: modyfikator ma korzystać z wag krawędzi, nie wierzchołków.

### 🪚 Oddziel obrzeża rowków od narożników chwytu

Przełącz wybór na ściany i odznacz wszystko. Zaznacz osiem den rowków. Obróć widok i dodawaj brakujące dna z przytrzymanym <kbd>Shift</kbd>, zamiast ponownie obejmować ramką całą rękojeść.

Nad widokiem 3D naciśnij <kbd>F3</kbd>, wyszukaj Select More i wykonaj tę operację dwa razy. Pierwsze rozszerzenie dołącza ścianki rowków, drugie ich obrzeża. Bark i szyjka mają pozostać poza zaznaczeniem.

Przełącz na wybór krawędzi i wpisz w Item → Edges Data → Mean Bevel Weight `0.2`. Drobne krawędzie otrzymają mniejszą fazę, ale w zaznaczeniu mogły znaleźć się również zewnętrzne narożniki. Przywrócimy im większą wagę:

1. Odznacz wszystko i wybierz jedną długą krawędź między sąsiednimi polami korpusu, poza zagłębieniem.
2. Otwórz <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>G</kbd></span> → Length. Przez <kbd>F9</kbd> zmniejsz Threshold, jeśli dołączyły krótsze krawędzie rowków. To tolerancja podobieństwa długości.
3. Sprawdź osiem długich narożników dookoła chwytu. Wpisz im wagę `1` w tym samym polu Edges Data.

Length porównuje długości. Nie rozpoznaje funkcji narożnika. Na innym modelu może zaznaczyć także krawędzie, które mają przypadkowo ten sam rozmiar.

![Osiem długich narożników i pole Edges Data, z którego korzysta Bevel w trybie Weight](/public/courses/blender/Images/wkretak-wagi.png)

W panelu Item występuje też Bevel Weight dla wierzchołków. Korzystamy z Edges Data, ponieważ fazujemy krawędzie. Pole w sekcji Vertices Data nie steruje tym trybem modyfikatora.

Ta metoda zaznaczania działa tutaj, bo osiem narożników ma jednakową długość. Nie jest poleceniem „wybierz narożniki” i na innym modelu może wskazać dodatkowe krawędzie. Rozpoznajesz wynik po położeniu zaznaczenia, nie po tym, że polecenie się wykonało.

### 🧩 Pomiń podziały płaskich pól

Na obrzeżu rowka są skośne krawędzie łączące narożniki z krawędziami wstawienia. Po obu stronach takiej krawędzi ściany leżą w jednej płaszczyźnie. Nie ma tam załamania powierzchni, więc nie potrzebujemy fazy.

Odznacz wszystko i wybierz jeden taki odcinek. Użyj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>G</kbd></span> → Face Angles, przez <kbd>F9</kbd> ustaw mały Threshold, np. `0.001`. Zaznaczenie ma obejmować podziały płaskich pól; krawędzie dna i zewnętrzne narożniki mają pozostać niezaznaczone.

W Item → Edges Data wpisz wagę `0`. Podziały pozostają w siatce, lecz Bevel nie utworzy na nich dodatkowych pasów. Na końcu sprawdź po jednej krawędzi każdej grupy: zewnętrzny narożnik `1`, obrzeże rowka `0.2`, podział płaszczyzny `0`.

### ✨ Ustaw szerokość fazy i sprawdź obrys

W Object Mode dodaj Bevel. Ustaw Affect Edges, Width Type Offset, Amount 0.0015 m, Segments 4, Limit Method Weight. Przy wadze 1 narożniki korpusu, barku i szyjki otrzymują większą fazę; przy 0.2 krawędzie rowków dostają nominalnie jedną piątą tej szerokości. Offset mierzy odsunięcie od starej krawędzi po sąsiednich ścianach, nie średnicę zaokrąglenia.

Zmień na chwilę Segments z 4 na 1. Powstaje płaski pasek fazy. Przy 4 kilka ścian opisuje łuk. To inna decyzja niż Amount: segmenty opisują gładkość łuku, a szerokość określa, ile miejsca on zajmuje. Przywróć 4 i zostaw Clamp Overlap włączone.

Jeżeli dalsze zwiększanie Amount przestaje zmieniać wynik, sprawdź, czy fazy nie zbliżyły się do sąsiednich krawędzi. Blender ogranicza ich szerokość, aby nie nakładały się na siebie; nie oznacza to osiągnięcia dobrego promienia.

## 💡 Oddziel kształt od cieniowania

W Object Mode wybierz Object → Shade Smooth. Dodaj Weighted Normal po Bevel, z Keep Sharp włączonym. W Bevel rozwiń Shading i włącz Harden Normals. Teraz wyłączaj i włączaj sam Weighted Normal, pozostawiając fazy aktywne.

Zwykłe wygładzanie uwzględnia normalne sąsiadujących ścian. W pobliżu małej fazy może sprawić, że duże płaskie pole wygląda jak napompowane. Weighted Normal zmienia udział ścian w obliczaniu normalnych: większe pola mogą mocniej określać kierunek cieniowania. Nie prostuje geometrii i nie zmienia obrysu. Keep Sharp zachowuje istniejące rozdzielenia normalnych na ostrych krawędziach; samo nie wybiera za ciebie, gdzie mają być ostre przejścia.

Kolejność jest celowa: Bevel najpierw tworzy powierzchnie faz, a Weighted Normal pracuje na otrzymanej siatce. Przesunięty przed Bevel nie oceniałby tych nowych ścian. Harden Normals ogranicza niepożądane zmiany cieniowania przy fazie. Te ustawienia wspierają konstrukcję; nie naprawią wklęsłego dna, skręconego czworokąta ani nakładających się ścian.

![Kolejność modyfikatorów rękojeści](/public/courses/blender/Images/wkretak-modyfikatory.png)

Do oceny ustaw jednolity szary materiał o Roughness około 0.2-0.3. W Material Preview obracaj oświetlenie przez Lighting → Rotation w rozwijanym panelu przy kulkach cieniowania. Kamera i model mogą pozostać nieruchome. Przesuwający się jasny pas powinien przechodzić przez fazę płynnie, a na płaskim dnie nie tworzyć przypadkowej falistej plamy.

![Porównanie starej i zmienionej konstrukcji w pięciu położeniach tego samego źródła światła](/public/courses/blender/Images/porownanie-odbic.png)

Jeśli błąd zmienia obrys, szukaj go w geometrii. Jeśli obrys pozostaje poprawny, ale płaskie pole wygląda na wybrzuszone, porównaj Shade Flat i Shade Smooth oraz wpływ Weighted Normal. Jeżeli kształt jest dobry, a refleks zbyt ostry lub za szeroki na całej powierzchni, wtedy oceniaj Roughness i oświetlenie. Tekstura nie naprawia złego prowadzenia powierzchni; może jedynie utrudnić zauważenie błędu w jednym kadrze.

## 🪛 Trzpień i płaska końcówka

Dodaj osobny cylinder: 8 wierzchołków, Radius 0.003 m, Depth 0.102 m, Location Z 0.139 m. Nazwij Grot. Dolny koniec wypada na Z=88 mm, czyli wchodzi około 8 mm w rękojeść. W Edit Mode obróć całość <kbd>R</kbd>, <kbd>Z</kbd>, `22.5`, tak jak chwyt. Trzpień jest tu ośmiokątny; jeśli chcesz uzyskać gładki okrąg w zbliżeniu, potrzebujesz większej liczby boków, a nie samego Shade Smooth.

Wybierz górną pokrywę. <kbd>E</kbd>, <kbd>Z</kbd>, `0.008`, <kbd>Enter</kbd>, następnie <kbd>S</kbd>, <kbd>Y</kbd>, `0.18`, <kbd>Enter</kbd> i <kbd>S</kbd>, <kbd>X</kbd>, `0.98`, <kbd>Enter</kbd> budują przejście do płaskiego ostrza. Osiem punktów poprzedniego pierścienia pozostaje połączonych z odpowiadającymi im punktami kolejnego. Obejrzyj to z boku: spłaszczenie ma wynikać z geometrii, nie ze światła.

Jeszcze <kbd>E</kbd>, <kbd>Z</kbd>, `0.008`, <kbd>Enter</kbd>, potem <kbd>S</kbd>, <kbd>Y</kbd>, `0.667`, <kbd>Enter</kbd> zwęża grubość końca. Z przodu końcówka pozostaje szeroka, z boku staje się cienka. Nie skaluj do zera: potrzebujemy zamkniętego, cienkiego ostrza, a nie nakładających się krawędzi.

![Przekroje przejścia z trzpienia do płaskiej końcówki](/public/courses/blender/Images/wkretak-grot.png)

Dodaj Bevel z Limit Method Angle, progiem 30°, szerokością około 0.15 mm, Segments 2, potem Weighted Normal z Keep Sharp i Shade Smooth. Tutaj Angle wybiera krawędzie na podstawie kąta między ścianami. Nie wykorzystuje wag, które ustawialiśmy na rękojeści. Przy małym ostrzu faza musi być znacznie mniejsza niż na chwycie; inaczej zje jego płaskie powierzchnie.

## 🎨 Tworzywo ma własny kolor

Rękojeści przypisz materiał Tworzywo, a grotowi osobny Stal. Dla tworzywa ustaw Metallic 0 i Roughness około 0.48; dla stali Metallic 1 i Roughness około 0.34. To jednolite materiały kontrolne, przed przygotowaniem map. Stal w podglądzie powinna odbijać otoczenie, nie tylko wyglądać jak ciemnoszary plastik.

Zmień Base Color Tworzywa na czerwony. Stal musi pozostać bez zmian. Jeśli też zmieniła kolor, sprawdź przypisanie materiałów: dwa różne obiekty mogą korzystać z tego samego materiału. Jego nazwę odczytasz u góry Material Properties. Zmiana współdzielonego materiału obejmie wszystkich jego użytkowników.

Nie potrzebujemy osobnej mapy koloru wyłącznie po to, żeby oddzielić tworzywo od stali. Przy późniejszym wspólnym atlasie możemy użyć maski tworzywa i parametru koloru w shaderze, zachowując stal poza obszarem tintowania.

Na koniec zaznacz grot, potem rękojeść jako aktywną i wybierz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> → Object (Keep Transform). Przesunięcie rękojeści ma przenosić cały przedmiot. Zapisz z aktywnymi, niezaaplikowanymi modyfikatorami. [Model po lekcji](/public/courses/blender/Resources/wkretak-02-model.blend) zawiera edytowalne rowki, dwie wagi faz i oddzielne materiały. W [następnej lekcji](/public/courses/blender/modul-2/wkretak-krzyzowy-wariant-wspolnej-konstrukcji) wykorzystamy ten chwyt, zmieniając konstrukcję końcówki.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Najpierw ustal przekroje i obrys. Subdivision zmienia całą powierzchnię, Bevel fazuje wybrane krawędzie, a Weighted Normal porządkuje cieniowanie. Sprawdzaj ich wpływ osobno; materiał nie wyrówna skręconej ściany.
