# Korekta powierzchni i wyjaśnienie modyfikatorów

Przeredagowano istniejące dwie lekcje modułu 2. Bez dodawania lekcji ani zmiany ich adresów. Pierwsza prowadzi od przekroju przez porównanie Subdivision i Shade Smooth do wyboru Bevel dla wielokątnego chwytu z płaskimi polami. Wyjaśniono pętle podtrzymujące, poziom podziału, Apply, Offset, segmenty, wagi krawędzi, Clamp Overlap, normalne oraz kolejność modyfikatorów. Zamiast kolejnego Inset przy dnie i Bisect zastosowano szerokość obrzeża 2.2 mm, zagłębienie 1.2 mm oraz fazy sterowane wagami 1 i .2; podziały współpłaszczyznowe wyłączono wagą 0. Rękojeść: 112 wierzchołków i 106 ścian sterujących. Jest to wariant wielokątny, nie gładki obrotowy chwyt.

Dwa robocze warianty przekrojowe odrzucono po oględzinach odbić; nie zastąpiły zasobów kursu. Końcowy wariant porównano z poprzednim w pięciu położeniach tego samego światła, przy wspólnym szarym materiale i kamerze. Statyczne zestawienie pokazuje oba komplety renderów. To porównanie pięciu stanów, nie deklaracja ciągłego testu animacji.

Praktycznie odtworzono wybór ośmiu den, dwa Select More i konwersję do zaznaczania krawędzi. Po przywróceniu większej wagi długim narożnikom wynik jest zgodny z wagami dostarczonego modelu: selection-proof.json nie zawiera różnic. Zapobiega to sytuacji, w której instrukcja opisuje inną siatkę niż plik wynikowy. Sprawdzono zamknięcie i dodatnią objętość bazowych i wynikowych siatek oraz przenośne otwarcie pliku.

W krzyżaku zmieniono ostatnią skalę z 1/3 na .6: promień 3 mm na Z197, 1 mm na Z204.5 i .6 mm na Z206 daje stały spadek zewnętrznych ramion. Wyjaśniono przyczynę, wybór 12 punktów i kontrolę czterech wklęsłych narożników. Geometria nadal jest dydaktycznym uproszczeniem, bez deklaracji tolerancji konkretnego rozmiaru PH.

Tworzywo i stal pozostają osobnymi materiałami. Dodano demonstrację kopii materiału tworzywa dla czerwonego chwytu przy niezmienionej stali oraz wyjaśnienie różnicy między niezależną siatką, materiałem i maską tintowania wspólnego atlasu. Nie dodawano pozornych tekstur, aby zakryć modelowanie. Ten etap nadal poprzedza UV i docelowe mapy.

Ilustracje pochodzą z rzeczywistych zrzutów Blendera 5.2.2 i renderów. Kadrowanie, zestawienia oraz ramki wskazujące Edges Data i Limit Method wykonano w PIL. Plik użytkownika w Downloads pozostaje nietknięty.

Źródła pomocnicze: dokumentacja Blender Subdivision Surface (https://docs.blender.org/manual/en/5.4/modeling/modifiers/generate/subdivision_surface.html), Weighted Normal 5.2 LTS (https://docs.staging.blender.org/manual/en/latest/modeling/modifiers/normals/weighted_normal.html). Opisane ustawienia sprawdzono w faktycznie używanej instalacji 5.2.2; numeru dokumentacji projektu nie zmieniano. Dokumentacja nowszej wersji służyła sprawdzeniu ogólnej zasady, nie zgodności interfejsu.
