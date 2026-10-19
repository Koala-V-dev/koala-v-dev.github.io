# Wkrętak krzyżowy - wariant wspólnej konstrukcji

Mamy rowkowaną rękojeść i płaski grot. Teraz wykorzystamy tę samą konstrukcję chwytu do wkrętaka krzyżowego. Zmieni się przekrój oraz sposób zwężania końcówki, nie cały przedmiot.

Otwórz [wkrętak z rowkami](/public/courses/blender/Resources/wkretak-02-model.blend) i zapisz jako `wkretaki_v02.blend`.

![Dwa wkrętaki ze wspólnym projektem rowkowanej rękojeści](/public/courses/blender/Images/wkretaki-dwa-warianty.png)

## 🧩 Zachowaj chwyt, wymień grot

Nazwij dotychczasową kolekcję Wkretak_plaski. Zaznacz rękojeść i przesuń ją o <kbd>G</kbd>, <kbd>X</kbd>, `-0.024`. Grot powinien podążyć za rodzicem. Następnie zaznacz oba obiekty, wykonaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, potem `X 0.048`. Kopia stanie 48 mm obok pierwszego narzędzia.

Przenieś kopię do nowej kolekcji przez <kbd>M</kbd> → New Collection, nazwij ją Wkretak_krzyzowy. Nazwij jej rękojeść `Rekojesc_krzyzowy` i usuń tylko skopiowany grot. Rowki, Bevel z wagami krawędzi, Weighted Normal i materiały chwytu zachowujesz. Zwykłe <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span> daje niezależną siatkę, którą można później zmienić bez deformowania pierwszej rękojeści.

## ➕ Przygotuj przekrój z dwunastu punktów

Dodaj cylinder: Vertices `12`, Radius `0.003 m`, Depth `0.102 m`, Location X `0.024 m`, Y `0`, Z `0.139 m`. Nazwij go Grot_krzyzowy. Dolny koniec znów wchodzi 8 mm w szyjkę, górny jest na Z=190 mm.

Dlaczego tym razem 12 wierzchołków? Potrzebujemy czterech ramion, a na każdą ćwiartkę przeznaczymy trzy punkty: dwa przy zewnętrznym brzegu ramienia i jeden we wklęsłym narożniku. Liczba punktów wynika z przekroju, który budujemy.

Wejdź w Edit Mode, zaznacz całą siatkę i obróć ją przez <kbd>R</kbd>, <kbd>Z</kbd>, `15`, <kbd>Enter</kbd>. Wybierz górną pokrywę i wykonaj <kbd>E</kbd>, <kbd>Z</kbd>, `0.007`. Nowy przekrój jest na Z=197 mm.

Przejdź do wyboru wierzchołków (<kbd>1</kbd>) i widoku z góry (<kbd>Numpad 7</kbd>). Wyłącz prześwietlenie, odznacz wszystko i z <kbd>Shift</kbd> zaznacz cztery wierzchołki górnego pierścienia leżące na przekątnych: pod kątem 45°, 135°, 225° i 315° względem osi X. To cztery punkty między przyszłymi ramionami.

W nagłówku widoku 3D otwórz Transform Pivot Point, menu obok Global/Local, i wybierz **Median Point**. To środek transformacji wyliczony z zaznaczonych punktów. Cztery narożniki mają zbliżyć się do wspólnego środka przekroju. Wykonaj <kbd>S</kbd>, `0.35`. To punkt wyjścia dla głębokości czterech wcięć.

Model jest uproszczonym grotem krzyżowym do grafiki: nie odtwarzamy tu wymiarów ani tolerancji konkretnego rozmiaru PH. Porównaj widok czołowy z rzeczywistym grotem: ramiona muszą mieć szerokość, a zagłębienia pomiędzy nimi nie mogą spotkać się w jednym punkcie. Cztery punkty przesuną się ku środkowi, a osiem pozostałych wyznaczy zewnętrzne brzegi.

Zachowaj cztery oddzielne punkty. Ich połączenie w jeden usunęłoby szerokość zagłębień.

![Jeden przekrój sterujący: osiem punktów na ramionach i cztery cofnięte narożniki](/public/courses/blender/Images/wkretak-krzyz-przekroj.png)

Na ilustracji wyizolowano jeden pierścień, żeby pozostałe wysokości nie zasłaniały układu. U siebie po obróceniu widoku nadal masz trzpień i jego wcześniejsze przekroje.

## 🔻 Zwęź cztery ramiona ku końcowi

Przejdź do wyboru ścian, odznacz wszystko i zaznacz górną pokrywę o kształcie krzyża. Wykonaj <kbd>E</kbd>, <kbd>Z</kbd>, `0.0075`, następnie <kbd>S</kbd>, `0.3333`. Kolejny przekrój jest na wysokości 204.5 mm i ma około jednej trzeciej szerokości.

Wykonaj <kbd>E</kbd>, <kbd>Z</kbd>, `0.0015`, potem <kbd>S</kbd>, `0.6`. Koniec wypada na Z=206 mm. Pozostaje mała, zamknięta powierzchnia, zamiast kilku nakładających się punktów. Tak powstają cztery zwężające się ramiona i zagłębienia pomiędzy nimi.

Drugi Scale działa na przekroju już zmniejszonym przez poprzednie skalowanie. Skala jest mnożnikiem obecnego przekroju, nie grubością końcówki. Najpierw promień zewnętrzny zmalał z 3 do 1 mm na długości 7.5 mm. Żeby zachować ten sam spadek na kolejnym odcinku 1.5 mm, powinien zmaleć o kolejne 0.4 mm, do 0.6 mm.

Stąd <kbd>S</kbd> 0.6. Ponowne <kbd>S</kbd> 0.3333 zwęziłoby go do około 0.33 mm i zaostrzyło ostatni odcinek. Powtarzanie tego samego Scale nie buduje automatycznie prostego stożka.

Z boku przyłóż wzrok do zewnętrznych krawędzi ramion: od pierwszego krzyżowego przekroju do końca powinny biec prosto. Jeśli tworzą kolano, popraw stosunek szerokości do długości odcinków. Bevel nie wyrówna tego załamania.

![Przekroje krzyżowego grotu oraz przejście w stronę trzpienia](/public/courses/blender/Images/wkretak-krzyz-siatka.png)

Wróć do Object Mode. Dodaj Bevel, Width `0.00004 m`, Segments `2`, a po nim Weighted Normal, Keep Sharp włączone. Wybierz Shade Smooth i przypisz ten sam materiał podglądowy stali co w płaskim grocie. Ustaw Limit Method Angle i próg 30°. Mała faza ma pozostać mniejsza od wąskich powierzchni przy czubku.

Włączaj i wyłączaj Bevel, obserwując czoło: cztery ramiona muszą zachować szerokość. Jeżeli ich końce stają się obłe albo znikają, zmniejsz Amount zamiast dodawać segmenty. Segmenty zagęszczą łuk, ale nie oddadzą zjedzonej powierzchni.

Weighted Normal umieść po Bevel. Porównaj wynik z wyłączonym modyfikatorem przy niezmienionym świetle. Ma porządkować cieniowanie pól, a nie zamieniać cztery ramiona w miękką gwiazdkę. Przy widocznym skręceniu ściany wróć do siatki: sprawdź, czy te same cztery wklęsłe narożniki pozostają na tych samych przekątnych na każdym przekroju.

![Płaska i krzyżowa końcówka w tym samym oświetleniu i z takim samym powiększeniem](/public/courses/blender/Images/wkretak-koncowki.png)

Obróć krzyżak do widoku od czoła. Sprawdź cztery ramiona, odstępy pomiędzy nimi i malejący przekrój. Boczny widok samego zwężającego się czubka nie wystarczy, żeby ocenić konstrukcję.

## 🔗 Sprawdź warianty jako dwa osobne narzędzia

Zaznacz nowy grot, potem jego rękojeść jako aktywną i ustaw <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> → Object (Keep Transform). Przesuń każdą rękojeść osobno: powinien poruszać się właściwy grot, a drugie narzędzie pozostać na miejscu.

Obie rękojeści mają ten sam projekt i materiały, ale niezależne siatki. Niezależna siatka nie oznacza niezależnego materiału. Zaznacz drugą rękojeść i otwórz Material Properties. Jeżeli obie rękojeści pokazują tę samą nazwę materiału, korzystają z jednego wspólnego zestawu ustawień. Obok nazwy widnieje liczba użytkowników.

Kliknij tę liczbę przy materiale drugiej rękojeści, aby utworzyć jego niezależną kopię. Zmiana nazwy bez wykonania kopii zmieniłaby tylko nazwę wspólnego materiału. Nazwij ją Tworzywo_czerwone i zmień Base Color. Pierwszy chwyt oraz oba stalowe groty mają zachować swoje kolory.

![Dwa kolory tworzywa przy niezmienionym materiale obu stalowych grotów](/public/courses/blender/Images/wkretaki-kolor-tworzywa.png)

To pozwala przygotować warianty bez mnożenia tekstur. W docelowym wspólnym atlasie maska materiałowa może wyznaczać obszar tintowania plastiku. Maska odpowiada na pytanie „gdzie zmienić kolor”, a mapa drewna, metalu lub tworzywa opisuje wygląd powierzchni. Dodanie osobnej mapy całego assetu dla każdego koloru nie jest konieczne.

Wróć do oglądania obu modeli. Obejrzyj rowki również po oddaleniu. Mają budować czytelny chwyt, a końcówki pozwalać rozróżnić narzędzia.

Zapisz projekt. [Plik z oboma wariantami](/public/courses/blender/Resources/wkretak-03-plaski-i-krzyzowy.blend) zawiera osobne kolekcje, edytowalne modyfikatory i zamknięte siatki. Dalej na płaskim wariancie przeprowadzimy pełny etap [materiałów, retopologii i bake](/public/courses/blender/modul-2/wkretak-stal-i-tworzywo-z-bliska).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Przekroje muszą zachować odpowiadające sobie punkty i ciągły spadek szerokości. Kopia siatki może nadal korzystać ze wspólnego materiału; jeśli wariant ma mieć osobny kolor, najpierw utwórz kopię materiału.
