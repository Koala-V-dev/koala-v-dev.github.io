# Blender — audyt i kierunek rozbudowy

Data: 2026-10-16. Status: audyt źródeł i projekt dydaktyczny, nie ukończony kurs.

## Materiał objęty przeglądem

Projekt: `C:\Users\rudek\Desktop\htdocs`. To Centrum Wiedzy: statyczna platforma z Vite i własnym kompilatorem Markdown. Katalog `C:\xampp\htdocs` zawiera inną, PHP-ową aplikację. Nie należy mieszać ich plików.

Źródło kursu: `public/courses/blender`. Kolejność ustala `Pages/_index.md`; tytuły muszą odpowiadać nazwom plików. `courses/blender` jest wynikiem kompilacji. Przeczytano README projektu, odpowiednie fragmenty kompilatora i bazę tworzenia kursów: README, kartę kursu, szablon lekcji oraz bramkę dydaktyczną.

Obecny program ma 8 modułów po 3 lekcje. Trzy lekcje modułu 0 mają rozwiniętą treść i zrzuty. Pozostałe 21 plików to tytuły; `Wprowadzenie.md` również zawiera sam tytuł. `data.md` jest użytecznym zalążkiem rejestru umiejętności, ale licznik użyć narzędzia nie dowodzi samodzielności ucznia.

Materiały robocze autora: `C:\Users\rudek\Desktop\blender come back\KURS`: `stół.blend`, `butelka.blend`, `dodge.blend`, kopie `.blend1` butelki i Dodge’a oraz blueprint samochodu. Potwierdzono obecność plików. Nie uruchomiono ich w Blenderze: nie odnaleziono lokalnego pliku wykonywalnego w sprawdzonych lokalizacjach. Nie przeprowadzono więc kontroli siatki, UV, materiałów, zależności ani eksportu tych plików. Oceny wizualnej nie wolno przedstawiać jako audytu `.blend`.

## Co zachować

Projekty stół → butelka → samochód pokazują rosnącą trudność i prawdziwą pracę autora. Zrzuty powinny pozostać materiałem instruktażowym. Dodge może powracać jako projekt diagnozy, a potem przebudowy. Uczeń zobaczy wtedy, dlaczego pierwszy czytelny model nie jest jeszcze gotowym assetem.

Na obejrzanym zrzucie `dodge-gotowy-40k-vertexów.png` bryła samochodu jest rozpoznawalna. Widać nierówny przebieg refleksów na masce, bardzo miękkie przejścia części krawędzi oraz uproszczone koła i przedni pas. Są to obserwacje obrazu, nie potwierdzenie przyczyn w topologii. Statystyka ze zrzutu nie określa kosztu wersji docelowej w silniku.

## Co zmienić w metodyce

1. Dodać wprowadzenie do interfejsu i pracy na plikach przed stołem. Oddzielić ruch widoku od transformacji obiektu, Object od Edit, obiekt od danych siatki, Origin od 3D Cursora.
2. UV i podstawy materiałów muszą poprzedzić pierwszy bake. Przed projektem high-to-low uczeń musi już umieć sprawdzić rozciąganie UV i normalne.
3. Pierwszy import do silnika wykonać na prostym rekwizycie. Wykrycie złej skali po kilku miesiącach modelowania jest zbyt późne.
4. Pełny proces powtórzyć na kilku assetach: prosty prop, skrzynia high-to-low, obiekt organiczny, zestaw modułowy, projekt specjalizacyjny.
5. Oddzielić specjalizację postaci od głównej ścieżki rekwizytów i środowiska. Anatomia, rig i mimika są osobnym dużym warsztatem.
6. Szybkość rozwijać po jakości: drugi podobny asset, plan czasu, analiza poprawek, biblioteka własnych rozwiązań. Nie mierzyć tempa samym odtwarzaniem kliknięć z filmu.
7. Gotowe bazy, Asset Store i AI dopiero po zaliczeniu samodzielnej produkcji i diagnozy. Ta sama kontrola jakości obowiązuje asset kupiony, wygenerowany i własny.

## Korekty techniczne wymagane w istniejących materiałach

| Miejsce | Problem | Kierunek poprawki |
| --- | --- | --- |
| Stół: rzuty | Numpad 1 i 3 przypisano odpowiednio do osi X i Y | Front patrzy wzdłuż Y, Right wzdłuż X, Top wzdłuż Z; rozróżnić kierunek patrzenia i osie widocznej płaszczyzny |
| Stół: skala | Skalowanie w Object Mode nazwano błędną metodyką | Jest poprawnym działaniem; uczeń ma przewidzieć wpływ niejednostkowej skali i świadomie wybrać moment Apply Scale |
| Stół i rejestr | X-Ray pomieszano z Wireframe | Alt+Z przełącza X-Ray; Shift+Z przełącza Wireframe przy standardowym mapowaniu |
| Dodge: topologia | Quady przedstawiono jako jedyną poprawną siatkę, trójkąty i n-gony jako zakazane | Oceniać rezultat, krzywiznę, subdivision, deformację i kontrolę triangulacji; eksportowana siatka jest trójkątowa |
| Dodge: Weighted Normal | Obietnica idealnego usunięcia wszystkich zniekształceń | Rozdzielić kształt powierzchni od cieniowania. Zmienione normalne nie prostują sylwetki ani wadliwej geometrii |
| Dodge: stos | Tekst zaleca Solidify przed Subdivision, podsumowanie pokazuje odwrotnie | Pokazać oba warianty na jednej krawędzi i wybrać na podstawie wymaganego rantu oraz grubości |
| Dodge: lakier | Metallic 0.9 podano jako fizyczną receptę na dowolny lakier | Oddzielić pigmentowaną powłokę dielektryczną, podłoże metalowe i ewentualną warstwę coat; testować pod neutralnym światłem |
| Dodge: szyba | Samo Alpha 0.5 udaje kompletny materiał szkła | Zdefiniować shader i tryb renderowania w docelowym silniku; osobno omówić transmisję, przezroczystość i koszt sortowania |
| Rejestr S-002 | MikkTSpace nazwano standardem 16-bit | To sposób wyznaczania bazy stycznej; precyzja tekstury jest inną decyzją |
| Rejestr S-004 | Gęstości tekseli przedstawiono jako branżowe normy; jednostka w słowniku jest powierzchniowa | Texel density podawać liniowo: px/m lub px/cm. Wartości dobierać do kamery i briefu |
| Rejestr S-005 | ORM potraktowano jako format dla wszystkich silników | Pakowanie zależy od shadera i render pipeline. Zachować osobne mapy źródłowe i przygotowywać warianty |
| Rejestr S-008 | Kości twist przedstawiono jako bezwzględny wymóg UE5 | Wymagania wynikają z wybranego szkieletu, deformacji i retargetingu |
| Rejestr S-009 | Jedna konfiguracja osi i Unit Scale 0.01 przedstawiona jako obowiązkowa | Walidować preset eksportera i importera kostką wzorcową oraz strzałką kierunku |
| Rejestr T-002 | Cage potraktowano jako obowiązkowe rozwiązanie każdego bake’u | Uczyć doboru projekcji, ray distance i cage do geometrii; porównywać rezultat |

Dotychczasowy rejestr ma pozycje oznaczone „Potwierdzone” bez dokładnych adresów i odtwarzalnych dowodów. Nie należy przenosić tego statusu do nowej wersji. Wersja widoczna w tytule okna na zrzucie jest informacją o materiale autora, nie dowodem oficjalnego statusu wydania LTS.

## Standard docelowy

„AA/AAA” oznacza tu ambicję jakościową: wiarygodny model, materiały, spójność artystyczna i sprawny proces. Nie jest uniwersalnym budżetem polygonów ani certyfikatem. Asset zalicza kurs dopiero, gdy działa w docelowej scenie, z docelową kamerą i udokumentowanymi kosztami.

W tej fazie przygotowano audyt, projekt programu i kryteria produkcji. Nie zmieniono istniejących lekcji, zrzutów, spisu treści ani rejestru kursów. Pełne lekcje, pliki ćwiczeniowe i testy w silnikach pozostają do wykonania według programu.
