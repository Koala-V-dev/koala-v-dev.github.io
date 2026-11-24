# Metody mapowania i ustawienia Unwrap

Data: 2026-10-20. Rozszerzenie „UV młotka - szwy, wyspy i checker.md” na wyraźną prośbę autora o wyjaśnienie opcji Unwrap. Pozostałe lekcje, w tym zaakceptowane wprowadzenie UV, zachowano bez zmian. Sprawdzono sumy plików Pages poza redagowaną lekcją.

## Miejsce w toku pracy

Wyjaśnienie pojawia się przy pierwszym Unwrap, po oznaczeniu szwów trzonka. Uczeń ma już checker podłączony do materiału i przygotowany podział powierzchni. Porównuje metody na własnym modelu w panelu F9, utrzymując stałe szwy, zaznaczenie i widok. Na koniec przywraca Angle Based, aby kontynuować dotychczasowy ciąg pracy.

Zachowano wszystkie poprzednie sekcje i dziewięć ilustracji. Dodano natywne zrzuty menu UV Mapping oraz panelu F9. Menu pokazuje trzonek ze starym UV, przed pierwszym rozłożeniem. Panel przedstawia Minimum Stretch z widocznymi dodatkowymi parametrami. Nie zmieniano modeli ani nie zapisywano plików .blend.

## Zakres przekazywanej umiejętności

Rozróżniono trzy metody korzystające ze szwów: Angle Based, Conformal i Minimum Stretch. Wyjaśniono cel ograniczania zmian kątów oraz względnej powierzchni, podobieństwo wyników na prostych siatkach i potrzebę oceny tego samego fragmentu checkera. Nie ustalono sztywnej reguły „organiczne = jedna metoda, mechaniczne = druga”.

Opisano przeznaczenie pozostałych pozycji menu: Smart UV Project, Lightmap Pack, Follow Active Quads, Cube Projection, Cylinder Projection, Sphere Projection, Project from View, Project from View (Bounds), Reset oraz rolę Mark Seam i Clear Seam. Jest to wybór sposobu pracy, a nie pełny warsztat każdego narzędzia projekcji z wszystkimi jego osobnymi ustawieniami.

Panel Unwrap obejmuje Method, Fill Holes, Use Subdivision Surface, Original Bounds, Correct Aspect, Margin Method z trzema wariantami i Margin. Dla Minimum Stretch objaśniono Iterations, No Flip, Importance Weights oraz pojawiające się po włączeniu wag Weight Group i Weight Factor. Wyjaśnienie wag definiuje wartość przypisaną wierzchołkowi i podaje miejsce utworzenia grupy, zamiast zakładać znajomość tej funkcji. Przy porównaniu metod wagi pozostają wyłączone.

Kontrola wyniku ma prowadzić do decyzji: zmiana metody przy problemie rozłożenia, korekta szwów przy nadmiernie ograniczonym płacie, zmiana skali przy zbyt małym przydziale obrazu. Obrót i położenie wysp nie są samodzielnymi kryteriami oceny deformacji.

## Podstawa i weryfikacja

Rzeczywiste menu i wszystkie parametry odczytano z lokalnego Blendera 5.2.2 LTS. Wynik w options.json. Natywne ujęcia trzech metod wykonano przy tych samych szwach, obrazie, modelu i widoku. Przed próbami Conformal i Minimum Stretch przywracano początkowe współrzędne UV. Wyniki na trzonku są zbliżone, dlatego nie publikowano trzech niemal identycznych obrazów jako pozornej poprawy jakości. Pozostają w materiałach kontroli.

Panel F9 zarejestrowano po uruchomieniu operatora w natywnym interfejsie. Zrzuty sprawdzono wizualnie. Nie deklarować pełnego ręcznego przejścia całej lekcji ani badania zrozumienia z uczniem.

Kompilacja offline i audyt 17 lekcji bez błędów i ostrzeżeń. Podgląd zmienionej lekcji: 11 obrazów, działające lokalne zasoby, brak błędów strony i poziomego przepełnienia przy 390 px. Obejrzano zrzuty panelu w szerokim i wąskim układzie. Status: rozszerzenie do oceny autora.

Materiały i kopia sprzed rozszerzenia: C:\xampp\htdocs\blender-course-development\revision\unwrap-options-20261020. Nie uruchamiać ponownie tego instalatora na treści później zmienionej przez autora.

Źródła kontroli poza narracją ucznia:

- Blender Manual, UV Operators: https://docs.blender.org/manual/en/5.1/modeling/meshes/editing/uv.html — metody i projekcje. Nazwy lokalnego UI potwierdzono oddzielnie w wersji 5.2.2.
- Blender Manual 5.2, UV Operators: https://docs.blender.org/manual/uk/5.2/modeling/meshes/editing/uv.html — wagi i względny przydział miejsca.
- Blender Manual 4.3, UV Operators: https://docs.blender.org/manual/en/4.3/modeling/meshes/editing/uv.html — wyjaśnienie działania wag. Stare nazwy Allow Flips, Attribute i Factor zastąpiono nazwami potwierdzonymi lokalnie.
- Oficjalny kod operatora: https://raw.githubusercontent.com/blender/blender/main/source/blender/editors/uvedit/uvedit_unwrap_ops.cc — warunkowe wyświetlanie pól, domknięcie otworów w Minimum Stretch i obsługa Original Bounds. To gałąź rozwojowa, wykorzystana do sprawdzenia mechanizmu wspólnie z odczytem lokalnych właściwości, a nie zamiennik sprawdzenia UI 5.2.2.