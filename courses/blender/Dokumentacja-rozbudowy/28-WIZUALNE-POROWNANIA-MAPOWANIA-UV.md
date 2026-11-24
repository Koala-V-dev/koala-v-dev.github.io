# Wizualne porównania mapowania UV

Data: 2026-10-20. Status: materiał do oceny autora, przed pilotażem z uczniami.

## Zakres i zachowanie poprzedniej pracy

Autor wskazał brak demonstracji efektów metod i pól F9 na złożonych modelach. W lekcji „UV młotka - szwy, wyspy i checker” zastąpiono dwa ostatnio dodane bloki referencyjne. Zachowano wcześniejszy praktyczny przebieg, wszystkie istniejące ilustracje, zaakceptowane wprowadzenie UV i pozostałe lekcje. Do tabeli skrótów dopisano skalowanie UV w osi Y. Porównano sumy plików Pages poza redagowaną lekcją.

Dodano 20 plansz oraz plik Resources/UV-laboratorium-wizualne.blend. Porównania metod i F9 pogrupowano w dwa zestawy zakładek, po cztery panele. Narracja ucznia opisuje działanie w Blenderze i obserwację wyniku. Skrypty w katalogu roboczym są narzędziami wytworzenia materiałów, nie instrukcjami dla ucznia.

## Modele i pochodzenie dowodu

X: zamknięta obudowa o łukowym zewnętrznym obrysie, płaskim dole, stopniowanym otworze, pierścieniach frontowych i tylnej powierzchni. 896 wierzchołków, 896 czworokątów. Przykład obejmuje płaty płaskie, pasy i zmiany promienia.

Y: skan Lee Perry-Smith / Infinite-Realities, CC BY 3.0, z zasobów three.js. Połączono duplikaty wierzchołków; granice oryginalnych UV zachowano jako szwy. 8844 wierzchołki, 17684 trójkąty. Nie zmieniono wcześniejszych plików z tym skanem ani obrazu skóry. Licencja jest dołączona do zasobów i wskazana w lekcji oraz wewnątrz pliku Blender.

Modele wyrenderowano w Blenderze 5.2.2 LTS. Diagramy pod nimi pochodzą z rzeczywistych współrzędnych UV. Zaznaczenie przodu twarzy na diagramach wynika z wyboru ścian skanu, zachowuje ich indeksy między wariantami. Kwadrat UV ma tę samą skalę wewnątrz porównania. W przykładzie prostokątnego obrazu podgląd ma proporcje 2:1. Materiały nie zwiększają liczby powtórzeń checkera węzłem Mapping ani mnożnikiem współrzędnych.

Trzy metody Unwrap porównano przy tych samych szwach obu modeli. Wynik skanu jest przykładem niekorzystnej zmiany przydziału powierzchni przez Angle Based i Conformal przy konkretnych granicach. Nie jest dowodem, że te metody zawsze dają złe UV twarzy. Minimum Stretch poprawia przydział w tym przykładzie, a nadal wymaga oceny deformacji i przeznaczenia tekstury.

Smart UV Project używa w obu modelach limitu 66°. Cube, Sphere, Reset i Lightmap pokazują wynik operatorów. Follow Active Quads pokazano na zaznaczonym czworokątnym pasie wnętrza obudowy z przygotowaną proporcjonalną ścianą wzorcową. Cylinder pokazano na wybranym pasie ze zgodną osią i następną korektą wysokości UV do proporcji obwodu/głębokości. Ta korekta jest jawnie opisana w lekcji; nie przypisywać jej samemu poleceniu Cylinder Projection.

Rzuty z przodu i Bounds wykonano jako ortogonalne odwzorowanie współrzędnych powierzchni oraz osobne dopasowanie obu osi do granic. Są ilustracją geometrii rzutu, nie zrzutem ręcznego wywołania Project from View w interfejsie. Przesunięcie i wspólna skala rzutu uzyskanego ręcznie mogą się różnić. Pokazano płaski front oraz całą głowę, a w parze Bounds dokładnie ten sam dolny pas frontu.

## Przepływ zagadnień

Uczeń najpierw otwiera trzonek szwami. Przy wyborze operacji poznaje różnicę między zachowaniem lokalnych kątów a przydziałem powierzchni. Na obudowie sprawdza podobieństwo trzech metod; na skanie rozpoznaje utratę miejsca dla twarzy. Dalej rozróżnia automatyczny podział, projekcję zależną od osi/widoku oraz prowadzenie UV przez czworokąty. Wynik ocenia pod kątem deformacji, ciągłości i nakładania, a nie samego wyglądu atlasu.

F9 pojawia się po pierwszym rzeczywistym Unwrap trzonka. Pary obejmują Correct Aspect, Margin, Margin Method, Subdivision Surface, Fill Holes, Iterations, Original Bounds, Importance Weights/Weight Group/Weight Factor i No Flip. Method odsyła do wcześniejszego porównania trzech metod. Po przykładach uczeń wraca do rozłożenia trzonka i kontynuuje dotychczasowe porównanie szwów głowicy oraz wspólny atlas.

W obu wariantach Subdivision oglądana geometria ma ten sam modyfikator. Correct Aspect używa tego samego obrazu 1024 × 512. Próba marginesów Scaled/Add/Fraction zaczyna się od jednakowo powiększonych UV i wartości 0.02. Diagram pokazuje rzeczywisty wynik, bez obietnicy, że każda metoda musi dać inną przerwę.

Fill Holes i No Flip dały w pokazanych parach identyczne UV, co potwierdzono współrzędnymi. Zaznaczono to otwarcie. Przecięty szwem pierścień nie pozostawia wewnętrznego otworu w rozwijanym płacie. Brak zmiany po No Flip nie jest demonstracją działania na wymuszonym odwróceniu przy przypiętych punktach. Nie przedstawiać tych par jako dowodu naprawy każdego problemu z otworami lub nałożeniami.

## Weryfikacja i ograniczenia

Audyt 17 lekcji: 0 błędów i 0 ostrzeżeń. Kompilacja offline zakończona poprawnie, bez zmiany bazy poligon i cache obrazów. Przeglądarka: 31 obrazów z opisami alternatywnymi, 2 grupy zakładek, 8 paneli aktywowanych klawiaturą, brak błędów strony i poziomego przepełnienia przy 390 px. Obejrzano plansze porównawcze, przegląd zbiorczy oraz ujęcia strony na szerokim i wąskim ekranie.

Plik Blender sprawdzono po ponownym otwarciu: pojedynczy model na scenę, kamera, skończone współrzędne UV, przypisane materiały oraz dwa osadzone obrazy. Usunięto pustą scenę importu. Sceny przechowują wyniki, nie historię F9, co wyjaśniono uczniowi.

To kontrola materiałów i działania zasobów, nie badanie retencji ani potwierdzenie zrozumiałości przez uczniów. Nie deklarować przejścia bramki 80% ani pełnego ręcznego odtworzenia wszystkich ustawień.

Dowody i źródła robocze: C:\xampp\htdocs\blender-course-development\revision\uv-visual-methods-20261020. Pliki results.json, blend-verification.json, Documentation/browser.json, before.md, changes.diff i protected.json. Instalator jest jednorazowy; nie uruchamiać na treści później poprawionej przez autora.

Dokumentacja odniesienia: [Blender Manual, UV Operators](https://docs.blender.org/manual/en/5.1/modeling/meshes/editing/uv.html), lokalne RNA i menu Blendera 5.2.2 z poprzedniej kontroli. Pełna strona manuala w tej turze zwracała błąd dostępu; podstawą nowych przykładów są wykonane operacje i zapisane współrzędne, nie deklaracja ponownego przeczytania strony. Pochodzenie skanu: [three.js LeePerrySmith](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/LeePerrySmith), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
