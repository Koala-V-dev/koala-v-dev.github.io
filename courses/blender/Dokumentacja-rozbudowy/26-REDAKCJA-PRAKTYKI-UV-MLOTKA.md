# Redakcja praktycznej lekcji UV młotka

Data: 2026-10-20. Dotyczy wyłącznie „UV młotka - szwy, wyspy i checker.md”. Autor zaakceptował wprowadzenie „UV - jak wybierać cięcia i dzielić piksele”; jego treść zachowano bez zmian i sprawdzono sumą SHA-256.

## Przepływ umiejętności

Wejście: własny młotek po ustawieniu jednolitych materiałów oraz znajomość mapowania z zaakceptowanego wprowadzenia. Uczeń tworzy obraz kontrolny, podłącza go do obu materiałów i rozpoznaje rozciągnięcie na dotychczasowym UV. Otwiera trzonek szwami, wykonuje Unwrap i sprawdza trzy wyspy. Na głowicy porównuje jedną owijkę z bokami rozłożonymi oddzielnie. Następnie wyrównuje skalę obu części, pakuje wyspy oraz zachowuje wersję z checkerem i wersję z materiałami.

Wyjście: rozłożenie trzonka i głowicy oraz umiejętność rozpoznania przerwanego szwu, niepodłączonego obrazu i różnicy między deformacją a skalą wysp. Następna lekcja nakłada fotografie drewna i stali. Ustawienie pasa trzonka pionowo jest orientacją tego punktu kontrolnego. Kierunek konkretnej fotografii będzie dopasowywany podczas jej użycia.

Zachowano wszystkie wcześniejsze sekcje i osiem ilustracji. Dodano jeden natywny zrzut menu wyboru obwodu. Zachowano porównanie dwóch podziałów głowicy, cel ciągłości słojów na trzonku oraz końcowe zestawienie skrótów. Nie wprowadzano limitów długości ani szablonu liczby kroków.

## Poprawki oparte na sprawdzeniu

W zainstalowanym Blenderze 5.2.2 LTS menu ma ścieżkę Select → Select Loops → Boundary of Selected. Funkcja mesh.region_to_loop ma etykietę „Select Boundary of Selected”. Osobna pozycja Boundary Loops dotyczy krawędzi brzegowych siatki i nie zastępuje obwodu zaznaczonych końcówek zamkniętego modelu. Poprzednia instrukcja zawierała mylącą nazwę.

Operator obwodu sprawdzono na obu częściach rzeczywistego Resources/mlotek-02-materialy.blend: po osiem wybranych krawędzi, zgodnych z obwodami dwóch końcówek. Rozłożenie potwierdziło trzy wyspy trzonka, trzy wyspy głowicy przy jednym szwie podłużnym i sześć wysp głowicy po rozdzieleniu czterech boków. Pliku .blend nie zapisywano.

Doprecyzowano wejście w Object Mode po zmianie obszaru, znaczenie węzłów, domyślny odczyt UV przez Image Texture przy niepodłączonym Vector oraz wybór tego samego obrazu w obu materiałach. Instrukcje kontroli odnoszą się do widocznego wyniku: połączona końcówka, nieotwarty pas, wydłużone pola, różna wielkość pól.

Unwrap, Average Islands Scale i Pack Islands opisano przez ich odrębny wpływ na współrzędne. Wyrównanie całych wysp nie usuwa miejscowej deformacji. Wspólne skalowanie podczas pakowania może zmienić wielkość checkera na całym młotku, zachowując proporcje między wyspami. Zapis obrazu, zapis projektu i osadzenie obrazu mają osobno wyjaśnione skutki.

## Kontrola i granice

Kompilacja offline przeszła bez zmiany współdzielonych metadanych. Audyt 17 lekcji: zero błędów i ostrzeżeń. Podgląd jednej zmienionej lekcji: dziewięć obrazów, działające zasoby, brak błędów strony i przepełnienia przy szerokości 390 px. Obejrzano zrzuty w szerokim i wąskim układzie.

Weryfikacja Blendera objęła operatory, geometrię, liczbę wysp, kod rysujący menu oraz rzeczywisty zrzut interfejsu. Nie była pełnym przejściem lekcji wyłącznie myszą i klawiaturą ani pilotażem z uczniem. Nie przypisywać tym kontrolom dowodu retencji ani akceptacji autora.

Materiały kontroli: C:\xampp\htdocs\blender-course-development\revision\uv-practice-20261020. W katalogu znajdują się kopia wejściowa, lokalne różnice, wyniki operatorów, suma zaakceptowanego wprowadzenia oraz podgląd strony. Dawnego instalatora redakcji nie uruchamiać ponownie na nowszej treści.

Źródła pomocnicze: Blender Manual, Select Loops (https://docs.blender.org/manual/sl/5.2/modeling/meshes/selecting/loops.html), Editing UVs (https://docs.blender.org/manual/sr/5.2/modeling/meshes/uv/editing.html), Shader Nodes Introduction (https://docs.blender.org/manual/sr/5.2/render/shader_nodes/introduction.html). Nazwę pozycji menu ustalono z lokalnego Blendera, ponieważ dokumentacja i starsze wersje używają też innych etykiet.

Status: praktyczna lekcja zredagowana do oceny autora. Kolejna do opracowania: „Drewno trzonka - obraz, kierunek i chropowatość”. Przy tej redakcji sprawdzić również numerację wersji pliku ucznia: obecna praktyka zapisuje materiały jako mlotek_v04, a lekcja drewna nadal używa tego numeru. Nie zmieniano sąsiedniej lekcji przy okazji tej poprawki.