# Blender — od pierwszej siatki do produkcji assetów

Status: projekt programu, 18 modułów i 108 jednostek dydaktycznych. To mapa do opracowania lekcji, nie lista gotowych materiałów.

## Obietnica i metoda

Uczeń przeprowadza asset od briefu i referencji przez model, UV, tekstury i optymalizację do testu w silniku. Uzasadnia, gdzie potrzebna jest geometria, gdzie wystarczy materiał, a gdzie detal nie jest widoczny. Potrafi samodzielnie znaleźć i naprawić błąd na nieznanym modelu.

Bazą jest Blender i narzędzia silnika. Płatny dodatek ani płatny program do teksturowania nie może być warunkiem przejścia rdzenia. Substance 3D Painter lub odpowiednik może dostać wariant dodatkowy; procedura w bazowej ścieżce musi prowadzić do tego samego zestawu map.

Każdy moduł zawiera demonstrację, ćwiczenie prowadzone, samodzielny wariant, diagnozę problemu i ocenę wyniku. Jednostka może wymagać kilku sesji. Nie obiecujemy ukończenia warsztatu w określonej liczbie godzin bez pilotażu.

## M00. Stanowisko, interfejs i pierwsza siatka

1. Obszary i edytory: Viewport, Outliner, Properties, Timeline; powiększanie i przywracanie obszaru.
2. Nawigacja: orbitowanie, pan, zoom, Frame Selected, perspektywa, ortho i praca bez numpada.
3. Obiekt, dane siatki i tryby: Object/Edit; vertex, edge, face; zaznaczenie aktywne.
4. Transformacje: G/R/S, wpisywanie liczb, osie globalne i lokalne, pivot, Origin i 3D Cursor.
5. Pliki i odzyskiwanie pracy: zapis wersji, cofanie, autosave, tekstury zewnętrzne i brakujące zależności.
6. Stół warsztatowy: wymiary, ekstruzja, symetria i samodzielny wariant bez przepisu.

Zaliczenie: stół o wymiarach z briefu, poprawne normalne, ponowne otwarcie projektu z zachowanymi zależnościami. Uczeń odróżnia przesunięcie widoku od przesunięcia modelu.

## M01. Jak działa siatka i cieniowanie

1. Pozycja punktu, krawędź, ściana i trójkąt: interpretacja wireframe oraz statystyk.
2. Extrude, Inset, Loop Cut, Bevel i Edge Slide na uchwycie narzędzia.
3. Merge, Dissolve, Delete, Bridge i Fill: różne skutki pozornie podobnych operacji.
4. Normale powierzchni, smooth/flat, ostre krawędzie i kontrola odbić.
5. Non-manifold, zdublowane ściany, wnętrza i samoprzecięcia: kiedy są problemem.
6. Warsztat naprawczy: zbyt gęsty i źle cieniowany wspornik.

Zaliczenie: uczeń naprawia wspornik, przedstawia porównanie przed/po i wyjaśnia każdą usuniętą pętlę. Quady nie są celem samym w sobie.

## M02. Referencja, proporcje i modelowanie niedestrukcyjne

1. Brief: funkcja obiektu, skala, kamera, styl i lista referencji.
2. Butelka z profilu: Spin i Screw, położenie osi oraz zamykanie powierzchni.
3. Fiolka: Solidify, normalne i grubość przy rzeczywistych wymiarach.
4. Słój: gwint, poziom uproszczenia i decyzja geometria czy tekstura.
5. Mirror, Array, Bevel i kolejność stosu: porównania na jednym obiekcie.
6. Dodge z blueprintu jako studium bryły; ocena proporcji i refleksów bez obietnicy gotowego assetu.

Zaliczenie: własny obiekt z nowej referencji i edytowalny stos. Dodge pozostaje rozszerzeniem dla chętnych; nie blokuje pierwszego małego assetu.

## M03. UV i pierwszy materiał

1. Współrzędne UV: ta sama siatka w przestrzeni 3D i na obrazie 2D.
2. Szwy na pudełku, cylindrze i butelce: cięcie, unwrap i checker.
3. Rozciąganie, orientacja wysp, skala wysp i gęstość tekseli.
4. Pakowanie, margines w pikselach, mipmapy i kontrolowane nakładanie UV.
5. Principled i obrazy: Base Color, Metallic, Roughness, Normal; sRGB i dane liniowe.
6. Butelka lub puszka z etykietą: samodzielna zmiana grafiki i kontrola szwu.

Zaliczenie: czytelny checker, uzasadnione szwy, poprawny odczyt map oraz zapis wszystkich obrazów. Nie wprowadzamy jeszcze trudnego bake’u.

## M04. Pierwszy pełny asset w trzech silnikach

1. Puszka narzędziowa: brief, blockout, pivot i model docelowy.
2. UV, proste tekstury, materiały i przygotowanie paczki.
3. Unity: import siatki, shader wybranego pipeline, skala i prefab.
4. UE5: import siatki, materiał, pivot, kolizja i aktor testowy.
5. Godot: glTF/GLB, materiały, kolizja i scena dziedzicząca lub opakowująca import.
6. Reimport po zmianie wymiarów; porównanie orientacji, materiału i zależności.

Zaliczenie: jeden asset uruchomiony we wszystkich trzech silnikach. Do dalszej codziennej pracy uczeń wybiera jeden główny silnik; test porównawczy wraca w M16.

## M05. Hard surface i decyzje konstrukcyjne

1. Skrzynia polowa: forma główna, drugorzędna i detal w skali kamery.
2. Boolean: obiekty tnące, kolejność i naprawa po zatwierdzeniu.
3. Bevel i subdivision: krawędzie wspierające, crease i szerokość fazy.
4. Panel z nitami: Array, linked duplicates, instancje i unikalne warianty.
5. Przewody: krzywe Beziera, profile, konwersja i redukcja segmentów.
6. Przegląd skrzyni: refleksy, sylwetka, powtarzalny detal i świadome uproszczenia.

Zaliczenie: skrzynia z czytelną konstrukcją. Uczeń usuwa detal niewidoczny przy docelowej kamerze i dokumentuje efekt.

## M06. High-to-low i kontrolowany bake

1. Plan HP/LP: które szczegóły zmieniają sylwetkę, a które tylko cieniowanie.
2. High poly skrzyni: kontrolowane fazy i detale pod rzutowanie.
3. Low poly: redukcja bez utraty istotnego konturu, siatka renderowana a edytowalna.
4. UV pod bake: rozcięcia, ostre krawędzie, padding i kontrola triangulacji.
5. Bake w Cycles: Selected to Active, obraz docelowy, normal tangent, cage i ray distance.
6. Naprawa: przenikanie projekcji, brakujące fragmenty, błędna orientacja kanału Y i seams.

Zaliczenie: skrzynia LP z bake’em; porównanie HP/LP z tych samych kamer, test mapy w głównym silniku. Sam poprawny podgląd w Blenderze nie wystarcza.

## M07. Teksturowanie PBR i wiarygodne zużycie

1. Odczytywanie materiałów z referencji: metal, farba, drewno, plastik i guma.
2. Rozdzielenie koloru, roughness i reliefu; unikanie namalowanego światła.
3. Maski zużycia: funkcja, kontakt, grawitacja i historia przedmiotu.
4. Texture Paint oraz wypalanie materiałów proceduralnych do przenośnych map.
5. Pakowanie kanałów pod konkretny shader: osobne źródła, ORM, smoothness i warianty.
6. Przegląd pod neutralnym i scenowym światłem; drugi wariant skrzyni bez przebudowy.

Zaliczenie: rozpoznawalne materiały również bez atrakcyjnego HDRI. Uczeń wyjaśnia obecność każdej większej plamy zużycia.

## M08. Powtórzenie procesu i tempo pracy

1. Beczka z klepkami: samodzielny brief, podział pracy i budżet.
2. Model i UV: powtarzalne elementy, unikalne oznaczenia i współdzielone tekstury.
3. Topór: sylwetka, stylisko, ostrze i podział materiałów.
4. Warianty LOD i kolizje obu rekwizytów.
5. Import, profilowanie i poprawki po rzeczywistym teście kamery.
6. Drugi podobny rekwizyt: zapis czasu etapów, źródeł poprawek i porównanie jakości.

Zaliczenie: dwa assety od pustej sceny. Tempo porównujemy przy tej samej liście odbiorowej; szybszy wynik z większą liczbą usterek nie jest postępem.

## M09. Środowisko modułowe

1. Brief warsztatu: siatka modułowa, wymiary drzwi, grubości i pivoty.
2. Zestaw ścian, narożników, podłóg i przejść bez szczelin.
3. Tileable materiały i trim sheet: projekt paska oraz mapowanie elementów.
4. Dekale i vertex color: warianty bez mnożenia unikalnych tekstur.
5. Lightmap UV tam, gdzie wymaga ich wybrany system oświetlenia.
6. Składanie sceny w silniku: instancje, powtarzalność i test oświetlenia łączeń.

Zaliczenie: scena złożona z własnego zestawu. Nowy korytarz powstaje przez składanie modułów, a nie modelowanie każdego fragmentu od nowa.

## M10. Obiekty organiczne i rzeźba środowiskowa

1. Skała: masa główna, płaszczyzny i sylwetka zamiast przypadkowego noise.
2. Sculpt Mode: pędzle, maski, remesh i rozdzielczość odpowiednia do etapu.
3. Uszkodzone drewno i skóra: detal zgodny ze skalą.
4. Retopologia obiektu statycznego, decymacja i porównanie wyników.
5. Bake, tekstury i łączenie materiału kafelkowego z detalem unikalnym.
6. Zestaw wariantów skał i test powtarzalności w scenie.

Zaliczenie: obiekt organiczny po pełnym procesie, bez wymagania anatomii postaci.

## M11. Roślinność i koszt przezroczystości

1. Budowa rośliny z referencji: rozkład masy i skala liści.
2. Atlas i karty: geometria, UV i obszar pustej tekstury.
3. Normale, materiały dwustronne, alpha clip i test pod światło.
4. LOD, billboard oraz znikanie drobnych fragmentów w mipmapach.
5. Prosty wiatr: maska, pivot i zachowanie przy ziemi.
6. Profilowanie overdraw w gęstym skupisku, porównanie wariantów.

Zaliczenie: roślina czytelna z bliska i stabilna z daleka; porównanie kosztu grupy obiektów, nie wyłącznie jednego egzemplarza.

## M12. Optymalizacja oparta na pomiarze

1. CPU, GPU, draw calls, materiał i pamięć tekstur: co rzeczywiście mierzymy.
2. Trójkąty, podziały wierzchołków na granicach UV/normalnych i koszt eksportu.
3. Rozdzielczość, mipmapy, kompresja oraz streaming tekstur.
4. LOD, culling, instancje i kolizje przy realnej liczbie kopii.
5. UE5 Nanite: osobna ścieżka testowa i porównanie z tradycyjnym assetem.
6. Dwie wersje sceny: ta sama kamera, rozdzielczość i urządzenie, pomiar przed/po.

Zaliczenie: raport z wąskim gardłem, zmianą i pomiarem po zmianie. Zmniejszenie liczby trójkątów bez poprawy kosztu nie kończy diagnozy.

## M13. Specjalizacja — pojazd lub rekwizyt hero

1. Powrót do Dodge’a: lista usterek, referencje i plan przebudowy.
2. Panel, refleksy i szczeliny: odbudowa jednego problematycznego fragmentu.
3. Koło, wnętrze i spód: zakres zależny od ujęcia oraz funkcji pojazdu.
4. Wersja docelowa: HP/LP, UV, bake, szkło i lakier.
5. Ruchome części: pivoty, hierarchia, prosta animacja i test kolizji.
6. Oddanie assetu: porównanie pierwotnej i finalnej wersji w silniku.

Zaliczenie: pojazd lub równoważny trudny rekwizyt. Żaden problem z siatką nie może być uznany za naprawiony tylko dlatego, że ukrywa go materiał prezentacyjny.

## M14. Specjalizacja — postać i deformacja

1. Sylwetka, proporcje i anatomia funkcjonalna; pełna postać w blockoucie.
2. Sculpt form głównych, twarzy i dłoni; detal dopiero po akceptacji proporcji.
3. Retopologia: pętle twarzy i stawów testowane na ruchu.
4. UV, bake, skóra, oczy, włosy i strój w ustalonym zakresie projektu.
5. Szkielet, skinning, twist i test pozycji granicznych; dopasowanie do wybranego silnika.
6. Eksport animacji, root motion lub ruch w miejscu, reimport i retargeting według briefu.

To rozbudowana specjalizacja: każdą jednostkę należy rozwinąć w serię ćwiczeń i przeglądów. Nie obiecywać postaci AAA po sześciu krótkich tekstach. Zaliczenie: deformacja sprawdzona na zestawie póz, poprawny rig i animacja w silniku.

## M15. Własny warsztat i automatyzacja

1. Biblioteka własnych materiałów, profili, detali i presetów z pochodzeniem plików.
2. Naming, kolekcje, foldery, wersjonowanie binariów i przekazanie projektu.
3. Geometry Nodes do kontrolowanej powtarzalności na poznanym wcześniej modelu.
4. Batch export i walidacja: skala, nazwy, ścieżki, UV i brakujące obrazy.
5. Proceduralny wariant i świadoma zamiana na geometrię eksportową.
6. Próba produkcyjna: mała rodzina assetów z rejestrem czasu i poprawek.

Zaliczenie: uczeń odtwarza paczkę z czystej kopii projektu; automatyzacja nie usuwa danych źródłowych.

## M16. Egzamin samodzielności i odbiór

1. Nowy brief bez instrukcji kliknięć: plan, referencje i kryteria.
2. Samodzielne modelowanie, UV, bake i tekstury.
3. Import i konfiguracja wariantu Unity.
4. Import i konfiguracja wariantu UE5.
5. Import i konfiguracja wariantu Godot.
6. Naprawa nieznanego assetu i obrona decyzji jakościowych oraz kosztowych.

Zaliczenie: spełnienie standardu odbioru z dokumentu 03 we wszystkich trzech silnikach oraz samodzielna diagnoza. To bramka do M17; nie wystarcza obejrzenie lekcji.

## M17. Gotowe zasoby i AI po opanowaniu warsztatu

1. Ocena źródła: licencja, pochodzenie, zależności i dopasowanie do briefu.
2. Asset Store i biblioteki: inspekcja siatki, shaderów, LOD, kolizji oraz kosztu.
3. Kitbash: wspólna skala, język form, materiały i usuwanie niespójności.
4. AI jako wsparcie referencji i wariantów; ocena użyteczności wyniku.
5. Naprawa wygenerowanej siatki: otwory, zlane formy, UV, tekstury i ponowny bake.
6. Eksperyment porównawczy: od zera, z bazy i z AI; pełny czas wraz z naprawami.

Zaliczenie: porównywalna jakość trzech metod i uczciwy raport kosztu. Wynik AI, którego naprawa przekracza budżet, może zostać odrzucony — to poprawna decyzja produkcyjna.

## Przeniesienie obecnych materiałów

- Trzy lekcje M00 zachować jako źródło. Stół trafi po nowym wprowadzeniu; butelka do M02/M03; Dodge do M02 jako rozszerzenie i do M13 jako projekt naprawczy.
- Obecne tytuły M01/M02 wykorzystać w M02/M05 po napisaniu pełnych ćwiczeń.
- HP/LP/bake przenieść do M06, po UV z M03.
- Obecne tematy sculpt/retopo/rig rozwinąć w M14, a nie uczynić ich jedynym środkiem kursu.
- Nie podmieniać `_index.md` na tę mapę, dopóki odpowiadające lekcje nie istnieją i nie przejdą kontroli.

## Kolejność opracowania

Najpierw M00–M04: początkujący ma otrzymać zamkniętą drogę do pierwszego działającego assetu. Następnie M05–M08: jakość siatki, bake, materiały i powtórzenie całego procesu. Potem środowisko i optymalizacja M09–M12. Dalej specjalizacje, własny warsztat i egzamin M13–M16. Dopiero na końcu M17.

Każda partia kończy się przeglądem dydaktycznym i testem wykonania. Nie publikować całej mapy jako ukończonego kursu i nie zastępować ćwiczeń masowo powielonym szablonem.
