# Wkrętak - stal i tworzywo z bliska

Mamy model z czytelnym chwytem. Teraz nadamy mu wykończenie nowego narzędzia: satynowe tworzywo i szlifowaną stal. Zmienność powierzchni zbudujemy w shaderze, a później wypalimy ją do obrazów używanych przez wersję do gry.

Otwórz [wkrętak po modelowaniu](/public/courses/blender/Resources/wkretak-02-model.blend) i zapisz osobną wersję. Kolekcję nazwij HIGH, obiekty HIGH_Rekojesc i HIGH_Grot. W obu Bevel zwiększ Segments do 6, pozostawiając szerokości i wagi. Nie zmieniaj obrysu tylko po to, żeby zwiększyć liczbę ścian. High poly to dokładniejsza wersja modelu, z której odczytamy zaokrąglenia i strukturę powierzchni podczas bake. Nie jest jeszcze siatką przeznaczoną do gry.

![High poly z materiałem tworzywa i szlifowanej stali](/public/courses/blender/Images/wkretak-materialy-high.png)

## 🔬 Co właściwie opisujemy teksturą

Na tworzywie potrzebujemy koloru, rozkładu chropowatości i bardzo drobnego reliefu po formowaniu. Na stali również potrzebujemy tekstury: niewielkiej zmienności odbicia i kierunku szlifu. Metallic pozostaje 0 dla tworzywa i 1 dla odsłoniętej stali. Nie zamieniamy tworzywa w metal przez obniżenie Roughness ani stali w plastik przez jej podwyższenie.

Base Color metalu określa barwę jego odbicia. Roughness określa, jak szeroko rozprasza się refleks. Normal lub Bump zmienia kierunek lokalnego odbicia. Dlatego drobny szlif powinien przede wszystkim pracować w świetle, a nie wyglądać jak namalowane ciemne pasy.

Pracuj w Shading, z Material Preview i tym samym oświetleniem, którego używałeś do oceny bryły. Nie zmieniaj jednocześnie materiału, światła i ekspozycji: stracisz informację, co rzeczywiście poprawiło wygląd.

## 🧴 Tworzywo: oddziel kolor od struktury

Zaznacz rękojeść i przejdź do Shading. W Shader Editor edytuj jej materiał, nazwij go `Tworzywo formowane`. Pozostaw Metallic `0` i Coat Weight `0`: budujemy satynowe tworzywo bez dodatkowej powłoki lakieru.

Węzły dodajesz przez Add → Search lub <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> z kursorem nad Shader Editor. Wyszukaj Texture Coordinate i Noise Texture. Połącz wyjście Object pierwszego z wejściem Vector drugiego. W Noise ustaw Scale `160`, Detail `2`.

Object opisuje położenie punktu na powierzchni we współrzędnych obiektu. Przy zachowanej skali `1, 1, 1` wzór ma wspólny rozmiar na korpusie i szyjce. Noise przelicza te położenia na płynne, nieregularne jasności. Wyjście Factor daje pojedynczą wartość, której użyjemy do sterowania materiałem.

### 🎨 Zbuduj neutralną strukturę koloru

Dodaj Color Ramp. Połącz Factor Noise z Factor rampy. Kliknij lewy znacznik pod paskiem, następnie próbkę koloru poniżej, i ustaw jasną szarość. Prawemu znacznikowi nadaj bardzo zbliżoną, trochę jaśniejszą szarość. Oba końce mają być jasne: domyślna czerń i biel stworzyłyby mocne plamy.

Dodaj Mix Color, wybierz **Multiply** i ustaw Factor `1`. Dodaj również RGB, nazwij go `Kolor tworzywa` i wybierz ciemny niebieski. Połączenia:

- Color z Color Ramp → A w Mix.
- Wyjście RGB → B w Mix.
- Wynik Mix → Base Color w Principled BSDF.

Multiply mnoży neutralną strukturę przez wybrany kolor. Zmiana RGB na czerwony zmieni barwę chwytu, zachowując jasności wzoru. W dołączonym pliku jest starszy MixRGB: wejścia Color1 i Color2 odpowiadają A i B.

### ✨ Ogranicz różnice chropowatości

Dodaj Map Range. Z tego samego wyjścia Factor Noise przeciągnij drugi przewód, tym razem do Value w Map Range. Jedno wyjście może zasilać kilka wejść.

| Pole Map Range | Wartość |
| --- | --- |
| From Min / From Max | `0` / `1` |
| To Min / To Max | `0.43` / `0.53` |

Połącz Result z Roughness Principled. Najciemniejsze miejsca szumu dostają Roughness `0.43`, najjaśniejsze `0.53`, a pozostałe wartości pośrednie. Wzór zmienia ostrość odbicia, lecz nie przełącza powierzchni między lustrem i matem.

Obróć oświetlenie podglądu. Jeżeli widzisz wyraźne mokre łaty, zbliż To Min do To Max. Jeżeli zmienia się tylko barwa plastiku, sprawdź, czy Result rzeczywiście trafia do Roughness.

![Węzły tworzywa: neutralna struktura, zakres Roughness i kolor oddzielony od tej struktury](/public/courses/blender/Images/wkretak-tworzywo-wezly.png)

## 🫧 Mikrorelief nie jest kształtem rękojeści

Dodaj drugi Noise Texture. Podłącz do Vector to samo wyjście Object, ustaw Scale `2400` i Detail `2`. Wyższy Scale tworzy drobniejszą strukturę niż pierwszy szum.

Dodaj Bump i połącz Factor drugiego Noise → Height Bump, następnie Normal Bump → Normal Principled. Ustaw Strength `0.35`, Distance `0.000008 m`.

Height jest sygnałem wysokości. Bump oblicza z jego zmian kierunki używane do odbicia światła; nie przesuwa wierzchołków. Distance skaluje interpretowaną różnicę wysokości, Strength siłę wpływu na normalną. Tu pracujemy na bardzo drobnym reliefie, znacznie mniejszym od rowków chwytu.

Zaznacz Bump i naciśnij <kbd>M</kbd>, aby go wyciszyć. Porównaj odbicie przy tym samym świetle, potem drugim <kbd>M</kbd> przywróć działanie. Po oddaleniu do całego narzędzia pojedyncze grudki powinny przestać być rozróżnialne. Jeśli nadal dominują, zwiększ Scale szumu lub zmniejsz wpływ Bump.

## ⚙️ Stal: kierunek zamiast przypadkowej plamistości

Grotowi utwórz materiał Stal szlifowana, Metallic 1. Najpierw ustaw jednolitą Roughness około 0.32 i neutralny, jasny kolor odbicia. Obróć oświetlenie: na stali musi być widoczne otoczenie. Gdy powierzchnia odbija ciemny fragment otoczenia, wygląda ciemno. Obrót oświetlenia pozwala odróżnić ten przypadek od błędnego materiału.

Szlif powinien biec wzdłuż powierzchni grotu. Gdy rozciągniemy szum tylko w osi świata, na prostym trzpieniu może wyglądać dobrze, ale na pochylonej końcówce zmieni gęstość. Dlatego damy materiałowi osobne współrzędne UV_Szlif. U oznacza poziomy kierunek w edytorze UV, a V pionowy. U ustawimy w poprzek metalowego pola, V wzdłuż niego. To kierunki na rozłożonej powierzchni, nie osie świata.

Otwórz [high poly z przygotowanym UV i materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend), jeżeli chcesz najpierw sprawdzić działający przykład. Zaznacz HIGH_Grot i w Properties otwórz Object Data Properties z ikoną zielonego trójkąta. Rozwiń UV Maps i wybierz UV_Szlif.

W przestrzeni UV Editing, po wejściu klawiszem <kbd>Tab</kbd> w Edit Mode i zaznaczeniu całości klawiszem <kbd>A</kbd>, po lewej zobaczysz rozłożone pola metalu. Najedź na ten edytor i naciśnij <kbd>Home</kbd>, aby objąć widokiem cały układ.

UV_Szlif służy do określenia kierunku i rozmiaru proceduralnego szlifu. Pola mogą tutaj na siebie zachodzić i wychodzić poza kwadrat 0-1, bo materiał proceduralny oblicza wzór także poza nim. W następnej lekcji zrobimy osobny UV_Asset, w którym każda część dostanie własne miejsce na wypalanej teksturze. Zachodzenie wysp w tamtym atlasie spowodowałoby nadpisywanie obrazu.

Jeżeli pracujesz od własnego modelu, przygotuj UV_Szlif następująco. Chcemy osobnych, nierozciągniętych rzutów płaskich pól, a nie rozciągania krótkiego ostrza na taki sam prostokąt jak długi trzpień.

### 🗺️ Rzutuj płaskie pola na UV

Zaznacz grot. W Object Data Properties → UV Maps kliknij plus i nazwij nową mapę `UV_Szlif`. Przejdź do UV Editing. Nad widokiem 3D wejdź w Edit Mode, włącz wybór ścian klawiszem <kbd>3</kbd> i odznacz wszystko.

Wybierz jedno długie, płaskie pole trzpienia. Naciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Numpad 7</kbd></span>, aby patrzeć prostopadle do wybranej ściany. Bez numpada użyj View → Align View → Align View to Active → Top. Przez U otwórz menu UV i wybierz Project from View.

To rzut wybranej powierzchni na płaszczyznę widoku. Wybierz zwykłe Project from View, pozostawiając Scale to Bounds wyłączone. Dopasowanie każdego pola osobno do pełnego kwadratu odebrałoby nam wspólną skalę długiego trzpienia i krótkiego ostrza.

Powtórz dla kolejnych płaskich pól trzpienia, przejścia i końcówki. Za każdym razem odznacz poprzednią ścianę, wybierz następną i ustaw widok prostopadły do niej. Rzut całego grotu z jednego boku ścisnąłby wzór na pochyłych powierzchniach.

### 📏 Wyrównaj skalę i kierunek

W widoku 3D zaznacz wszystkie ściany. Przenieś kursor nad UV Editor i zaznacz wszystkie UV klawiszem <kbd>A</kbd>. Wybierz UV → Average Islands Scale. W ustawieniach tej operacji pozostaw Non-Uniform i Shear wyłączone: wyrównujemy wielkość wysp bez zmiany ich proporcji.

Długi trzpień ma zajmować odpowiednio więcej miejsca niż krótka końcówka. Jeśli zmieniałeś przybliżenie między projekcjami, wspólne wyrównanie skali usunie różnicę wynikającą z powiększenia widoku.

Odznacz UV przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>. Najedź na jedną wyspę i naciśnij <kbd>L</kbd>, aby wybrać ją w całości. Obróć przez <kbd>R</kbd>, tak aby kierunek od rękojeści do czubka biegł pionowo. Powtórz dla pozostałych pól. U pozostaje kierunkiem w poprzek powierzchni, V wzdłuż niej. Nie rozciągaj wysp osobno w jednej osi.

### 🔎 Sprawdź skalę kratką

Wróć do Shading i zaznacz grot. W Shader Editor wybierz jego materiał. Węzły dodajesz przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> → Search z kursorem nad tym edytorem. Wyszukaj UV Map, a w dodanym węźle wybierz nazwę UV_Szlif. Dodaj Checker Texture.

Przeciągnij przewód z wyjścia UV pierwszego węzła do wejścia Vector drugiego, a wyjście Color kratki podłącz tymczasowo do Base Color w Principled BSDF. Dla czytelności kontroli ustaw na chwilę Metallic 0; po kontroli wrócisz do 1.

W przygotowanym pliku zacznij od Scale 1000 w Checker Texture. W swoim układzie dobierz Scale tak, aby zobaczyć kilkanaście kratek wzdłuż trzpienia. Liczba zależy od wielkości UV. Sprawdzamy proporcje i porównujemy wielkość kratek na różnych częściach. Ustawienie Scale jest wspólne dla całego grotu.

![Kratka o stałej skali powierzchni na trzpieniu i pochyłej końcówce](/public/courses/blender/Images/wkretak-stal-checker.png)

Oglądaj każde pole na wprost. Kwadrat widziany pod kątem wygląda na węższy nawet przy dobrym UV. Na trzpieniu i ostrzu kratki powinny być podobnej wielkości. Prostokąty zamiast kwadratów oznaczają rozciągnięcie: wróć do projekcji konkretnego pola.

Kwadraty, ale znacznie mniejsze na ostrzu oznaczają różną skalę wysp: zaznacz wszystkie i ponów Average Islands Scale. Zwiększenie Scale w Checker Texture zagęści cały wzór; nie wyrówna jednej źle rozłożonej części.

![Ten sam materiał stali z projekcją w osiach 3D oraz ze współrzędnymi powierzchni](/public/courses/blender/Images/wkretak-stal-uv-poprawa.png)

Po kontroli odłącz Checker od Base Color i przywróć Metallic `1`. Węzeł kratki zostaw odłączony z boku grafu.

### ⚙️ Zbuduj kierunkowy szlif

Dodaj Vector Math i w jego liście operacji wybierz Multiply. Połącz wyjście UV węzła UV Map z pierwszym Vector. Drugie Vector pozostaw bez przewodu. W trzech polach wpisz `6000`, `100`, `1` dla przygotowanego układu z pliku.

Pierwsza wartość mnoży U, druga V. Wzór zmienia się 60 razy szybciej w poprzek niż wzdłuż pola, dlatego powstają podłużne ślady. Trzecia współrzędna mapy UV wynosi tutaj zero i nie wyznacza kierunku szlifu.

Dodaj Noise Texture i połącz Vector z Multiply → Vector Noise. Ustaw Scale `1`, Detail `2`. Przy własnoręcznie rozłożonym UV wspólna skala wysp może być inna. Dopasuj wtedy Scale w Noise: zwiększenie daje drobniejszy wzór, zmniejszenie grubszy. Oceniaj jednocześnie trzpień i ostrze; nie reguluj wielkości każdego pola osobno.

Dodaj Map Range. Połącz Factor Noise → Value Map Range i ustaw:

| Pole | Wartość |
| --- | --- |
| From Min / From Max | `0` / `1` |
| To Min / To Max | `0.29` / `0.35` |

Połącz Result → Roughness Principled. Te same jasności szumu dadzą niewielkie różnice ostrości odbicia stali.

Dodaj Color Ramp. Połącz Factor tego samego Noise → Factor rampy, a Color rampy → Base Color Principled. Kliknij kolejno znaczniki pod paskiem i ich próbki koloru. Ustaw dwie bliskie, jasne, lekko chłodne szarości. Jeśli zostawisz domyślną czerń i biel, zamiast subtelnego szlifu zobaczysz ciemne paski.

W Map Range zmieniasz rozproszenie odbicia; w Color Ramp jego barwę. Jeżeli szlif jest zbyt kontrastowy, najpierw ustal, który z tych sygnałów odpowiada za widoczne pasy.

![Węzły kierunkowej struktury stali i ograniczonego zakresu chropowatości](/public/courses/blender/Images/wkretak-stal-wezly.png)

Najpierw obejrzyj wynik bez Bump. Obracaj oświetlenie w Material Preview przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>PPM</kbd></span> i przeciąganie w widoku 3D. Szlif powinien delikatnie rozbijać odbicie, a nie pokrywać grot wyraźną zebrą. Jeśli pasy są zbyt mocne, zbliż do siebie kolory rampy.

Jeśli refleks jest zbyt nierówny, zbliż wartości To Min i To Max w Map Range. To dwie różne poprawki: pierwsza zmienia kolor odbicia, druga jego rozproszenie.

Dopiero potem możesz dodać mikrorelief. Dodaj drugi Noise Texture i podłącz do jego Vector to samo wyjście Multiply. Dodaj Bump, połącz Factor drugiego Noise z Height, a wyjście Normal Bump z Normal Principled. Zacznij od Scale 1, Detail 2 w Noise oraz Strength 0.35 i Distance 0.000002 m w Bump.

Przy własnym UV użyj Scale dopasowanego w poprzednim Noise. Bump zmienia kierunek odbicia, nie dodaje rzeczywistych rys do siatki. Jeśli efekt nie poprawia wyglądu w docelowym kadrze, nie musisz go zachowywać.

![Jednolita stal i stal ze strukturą przy tej samej kamerze, geometrii i świetle](/public/courses/blender/Images/wkretak-stal-porownanie.png)

## 💡 Oceń wykończenie przed wypalaniem

Oglądaj osobno obrys, szerokie refleksy i drobną strukturę. Obrys nadal zależy od siatki. Refleks powinien przechodzić przez fazy bez przypadkowych załamań. Struktura ma różnicować tworzywo i stal, a nie zasłaniać całą konstrukcję.

![Zbliżenia na gotowe tworzywo i stal](/public/courses/blender/Images/wkretak-materialy-zblizenie.png)

Zmniejsz na chwilę zakres Roughness do jednej wartości, odłącz Bump i porównaj wynik. W ten sposób rozpoznasz wkład obu sygnałów. Zostaw tylko to, co daje pożądane wykończenie. Na tym etapie zachowujemy fabryczne wykończenie narzędzia.

### 🪚 Przygotuj ścianki rowków do wypalania

W gotowym `wkretak-04-high-materialy.blend` ten etap jest wykonany. Jeżeli pracujesz od własnego modelu z pionowymi ściankami rowków, lekko zwęź ich dna, zachowując głębokość.

Zaznacz HIGH_Rekojesc, wejdź w Edit Mode i wybór ścian. Odznacz wszystko i wybierz osiem den rowków. W nagłówku widoku otwórz Transform Pivot Point, obok wyboru Global/Local, i ustaw Individual Origins.

1. Wykonaj <kbd>S</kbd>, <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Z</kbd></span>, `0.81`, <kbd>Enter</kbd>. Skalujesz w płaszczyźnie XY względem środka każdego dna, więc zwężasz je bez skracania wzdłuż Z.
2. Wykonaj <kbd>S</kbd>, <kbd>Z</kbd>, `0.982`, <kbd>Enter</kbd>, aby lekko skrócić zakończenia.
3. Przywróć Transform Pivot Point → Median Point.

Z boku sprawdź przekrój: wejście rowka ma być szersze od dna. Środek dna zostaje w dotychczasowym miejscu. Skalowanie całego zaznaczenia względem wspólnego środka przesunęłoby również dna w stronę osi rękojeści, zmieniając ich głębokość.

Skos ma także znaczenie dla bake. Ścianka dokładnie prostopadła do płaskiego panelu ma w projekcji niemal zerową szerokość. Jej kierunek nie dostanie własnego pasa pikseli. Ukośne przejście ma szerokość, więc można przedstawić je normal mapą na gładkim chwycie. W kolejnej lekcji porównamy tę wersję z zachowanymi rowkami w geometrii.

Zapisz własny projekt. Do porównania masz [wynik z edytowalnymi materiałami](/public/courses/blender/Resources/wkretak-04-high-materialy.blend). W następnej lekcji zbudujemy wersję do gry, zachowując ten plik jako źródło. Węzły proceduralne zostaną na high poly; do gry trafią ich wypalone odpowiedniki i znacznie lżejsza siatka.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Wyrównaj proporcje i skalę UV, zanim dobierzesz grubość szlifu. Neutralna struktura pomnożona przez kolor pozwala zmieniać wariant tworzywa bez przebudowy tekstury. Oceniaj barwę, chropowatość i relief oddzielnie.
