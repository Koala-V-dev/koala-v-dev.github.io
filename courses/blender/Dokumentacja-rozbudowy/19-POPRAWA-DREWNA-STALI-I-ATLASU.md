# Poprawa czterech lekcji materiałowych

Zastępuje wynik i instrukcje opisane w raportach 16-18. Dawne pliki pobierania 08-11 zastąpiono w miejscu; wcześniejsze wersje czterech lekcji i projektów zapisano w Przed-poprawa-materialow-v14. Tytuły i kolejność lekcji zachowane.

Przyczyny: fotografia Wood Table 001 przedstawiała bejcowane i lakierowane drewno. Wcześniejszy retusz jasnych przekrojów budował niespójne wykończenie. Zbyt niska roughness dawała lakierowany chwyt. Niezależne pakowanie UV głowicy po wcześniejszym wspólnym atlasie łamało ciągłość. Ubytek przez szerokość głowicy był schematyczny, a prezentacja metalowej powierzchni zbyt ciemna. Testy techniczne poprzedniej wersji nie potwierdzały jakości artystycznej.

Zmiany: źródłem boków jest jesion Ash Veneer, 1 m, ziarno poziomo; UV odwrócone o 90 stopni, 30 cm trzonka pobiera około 30% obrazu. Map Range roughness 0.58-0.78. Czoła mają podobną barwę, kilka niskokontrastowych pasm i skupienia porów, bez rdzenia pnia i białych dysków. Native Texture Paint: Paint Hard, Paint Soft, Clone. Późniejszy chwyt malowany wartością .52, siłą .45, zamiast .16. Głowica: texture Color oraz Roughness z Metal009 ambientCG, UV_Stal, Map Range from .2/.8 to .25/.5. Wspólne UV_Asset: 9 wysp i jeden Mlotek_PBR z BaseColor, Roughness, Metallic. Faza końcowa .8 mm. Bez sztucznego ubytku. Gałąź Bump 15 µm/.12 odłączona w pliku wynikowym i opisana jako próba, nie obowiązkowy detal.

Bake: BaseColor przez Emission, ponieważ Diffuse/Color na Metallic 1 daje czarny metal. Roughness przez właściwy typ, Metallic przez Emission biały/czarny. Dwa wypieki do tego samego obrazu: pierwszy z Clear Image, drugi bez. Modyfikatory wyłączone wyłącznie w renderze na czas bake do bazowego UV, przywrócone w wyniku. Dopisanie tekstury głowicy do atlasów nie wypiekało ponownie drewna po retuszu.

Kontrola: projekty 08-11, oba zamknięte meshe o dodatniej objętości; 12/16 bazowych wierzchołków bez sztucznego ubytku. Wspólne UV identyczne po bake, retuszu i chwycie. Wszystkie modyfikatory włączone, brak linkowanych bibliotek. Spakowane mapy 2K. Metal ma zmienną barwę i roughness, na wnętrzach jego wysp Metallic=1, drewna=0. Obrazy BaseColor i Metallic identyczne między 10 i 11. Ponowne otwarcie końca w folderze bez tekstur: piksele identyczne. Rasteryzacja wnętrz wszystkich ścian UV przy 2048 px: 0 nakładających się pikseli po wyłączeniu jednopikselowego pasa granic. Nie jest to matematyczny test obszarów poniżej jednego piksela; układ dodatkowo oceniono wizualnie.

Wszystkie ilustracje pochodzą z rzeczywistych zrzutów lub renderów Blendera 5.2.2. Składanie porównań, kadrowanie i adnotacje w PIL. Szare porównanie Roughness jawnie oddziela kolor od odbicia. Światło i kamera stałe w obrębie pary. Rendery całości mają czytelne światło studyjne. To poprawiona baza materiałowa dla modelu ćwiczeniowego, nie deklaracja gotowego assetu AAA ani ukończonej geometrii eksportowej.

Źródła sprawdzone 2026-10-17:
- https://polyhaven.com/a/ash_veneer ; autor Jenelle van Heerden, CC0. Fotografia forniru używana jako rysunek boków litego drewna, nie jako jego konstrukcja.
- https://polyhaven.com/license
- https://ambientcg.com/view?id=Metal009 ; autor Lennart Demes, CC0. Użyto Color i Roughness. Metal012, Metal027, Metal034 i tekstury zardzewiałej blachy odrzucone przy doborze.
- https://docs.ambientcg.com/license/
- https://www.wood-database.com/white-ash/ ; zdjęcia referencyjne oglądane przez link, nie redystrybuowane w materiałach kursu.
- https://docs.blender.org/manual/en/latest/render/cycles/baking.html ; typy bake, cel i Clear Image; nazwy w lokalnym Blenderze 5.2.2: Emission.
- https://docs.blender.org/manual/en/latest/modeling/modifiers/normals/weighted_normal.html ; cieniowanie płaskich ścian. Lokalny modyfikator po Bevel, Weight 50, Keep Sharp.

Dalsza nauka powinna rozwinąć konstrukcję modelu, przygotowanie geometrii docelowej i normal bake. Nie maskować braków kolejną warstwą szumu lub przypadkowych uszkodzeń.

Audyt kursu: 12 lekcji, 0 błędów, 0 ostrzeżeń. Przeglądarka: cztery strony, 21 prawidłowo wczytanych ilustracji, 10 poprawnych odnośników pobierania (6 różnych zasobów). Desktop 1440 oraz mobile 390 bez poziomego przepełnienia i błędów JS. Zrzuty w Weryfikacja-M01-v14. Przebudowa offline bez zmiany image_cache i poligon_db.
