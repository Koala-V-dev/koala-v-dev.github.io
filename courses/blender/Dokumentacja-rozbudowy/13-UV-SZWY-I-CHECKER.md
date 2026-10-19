# UV młotka

Trzecia lekcja modułu 1: mapa UV jako powiązanie modelu z obrazem, tymczasowy Color Grid 1024, pierwsze połączenie Image Texture Color do Principled Base Color, świadome szwy, Angle Based Unwrap, orientacja trzonka wzdłuż V, Average Islands Scale i wspólne Pack Islands bez obrotu z Fraction Margin 0.02.

Każda część ma 3 wyspy: otwarta podłużnie powierzchnia boczna i dwie końcówki. Trzonek ma 10 krawędzi szwów, głowica 11. Łącznie 6 wysp. Na potrzeby checkera Metallic głowicy czasowo 0; w wyniku przywrócone 1.

Dwa pliki: mlotek-03-uv-checker.blend (obraz zapisany jako PNG, faktycznie spakowany do blend, względna ścieżka //textures/checker_1024.png) i mlotek-04-uv-materialy.blend (te same UV z przywróconymi materiałami i bez węzłów kontrolnych). Geometria i parenting pozostają niezmienione; Bevel z Harden Normals zachowany.

Sprawdzone wszystkie trójkąty UV: brak par z nakładającym się wnętrzem, brak wysp poza 0-1, brak zerowych powierzchni, zgodność UV obu plików, zamknięte siatki. Checker odczytuje pełne piksele po ponownym otwarciu. Test Append wyniku do pustej sceny przeszedł. Gęstość po Average Islands Scale około 3.05-3.50 tys. px/m przy checkerze 1024; to etap kontrolny, nie uniwersalny budżet tekstur.

7 autentycznych ilustracji z Blender 5.2.2; oznaczone połączenie węzłów, podłużny szew i grupy wysp.

Źródła: https://docs.blender.org/manual/id/5.0/modeling/meshes/editing/uv.html ; https://docs.blender.org/manual/en/5.4/modeling/meshes/uv/editing.html ; https://docs.blender.org/manual/en/latest/editors/image/introduction.html . Operacje sprawdzone w zainstalowanym Blenderze 5.2.2.

Dalej: wykorzystanie UV do kierunku słojów i zróżnicowania powierzchni drewna.
