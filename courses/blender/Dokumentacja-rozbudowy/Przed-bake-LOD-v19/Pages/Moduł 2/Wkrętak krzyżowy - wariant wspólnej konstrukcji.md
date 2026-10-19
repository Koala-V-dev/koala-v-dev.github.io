# Wkrętak krzyżowy - wariant wspólnej konstrukcji

Mamy rowkowaną rękojeść i płaski grot. Teraz wykorzystamy tę samą konstrukcję chwytu do wkrętaka krzyżowego. Zmieni się przekrój oraz sposób zwężania końcówki, nie cały przedmiot.

Otwórz [wkrętak z rowkami](/public/courses/blender/Resources/wkretak-02-model.blend) i zapisz jako `wkretaki_v02.blend`.

![Dwa wkrętaki ze wspólnym projektem rowkowanej rękojeści](/public/courses/blender/Images/wkretaki-dwa-warianty.png)

## 🧩 Zachowaj chwyt, wymień grot

Nazwij dotychczasową kolekcję **Wkretak_plaski**. Zaznacz rękojeść i przesuń ją o **`G X -0.024`**. Grot powinien podążyć za rodzicem. Następnie zaznacz oba obiekty, wykonaj **Shift+D**, potem **`X 0.048`**. Kopia stanie 48 mm obok pierwszego narzędzia.

Przenieś kopię do nowej kolekcji przez **M → New Collection**, nazwij ją **Wkretak_krzyzowy**. Nazwij jej rękojeść `Rekojesc_krzyzowy` i usuń **tylko skopiowany grot**. Rowki, Bevel z wagami krawędzi, Weighted Normal i materiały chwytu zachowujesz. Zwykłe Shift+D daje niezależną siatkę, którą można później zmienić bez deformowania pierwszej rękojeści.

## ➕ Przygotuj przekrój z dwunastu punktów

Dodaj cylinder: **Vertices `12`, Radius `0.003 m`, Depth `0.102 m`, Location X `0.024 m`, Y `0`, Z `0.139 m`**. Nazwij go **Grot_krzyzowy**. Dolny koniec znów wchodzi 8 mm w szyjkę, górny jest na Z=190 mm.

Dlaczego tym razem 12 wierzchołków? Potrzebujemy czterech ramion, a na każdą ćwiartkę przeznaczymy trzy punkty: dwa przy zewnętrznym brzegu ramienia i jeden we wklęsłym narożniku. Liczba punktów wynika z przekroju, który budujemy.

W Edit Mode obróć całą siatkę **`R Z 15`**. Wybierz górną pokrywę i wykonaj **`E Z 0.007`**. Nowy przekrój jest na Z=197 mm.

Przejdź do wyboru wierzchołków (`1`) i widoku z góry (`Num 7`). **Wyłącz prześwietlenie**, odznacz wszystko i z Shift zaznacz cztery wierzchołki górnego pierścienia leżące na przekątnych: pod kątem 45°, 135°, 225° i 315° względem osi X. To cztery punkty między przyszłymi ramionami.

Pivot pozostaw **Median Point**. Wykonaj **`S 0.35`**. To punkt wyjścia dla głębokości czterech wcięć, nie norma wymiarowa konkretnego rozmiaru PH. Porównaj widok czołowy z rzeczywistym grotem: ramiona muszą mieć szerokość, a zagłębienia pomiędzy nimi nie mogą spotkać się w jednym punkcie. Cztery punkty przesuną się ku środkowi, a osiem pozostałych wyznaczy zewnętrzne brzegi. Nie łącz punktów w środku i nie skaluj każdego osobno wokół Individual Origins.

![Jeden przekrój sterujący: osiem punktów na ramionach i cztery cofnięte narożniki](/public/courses/blender/Images/wkretak-krzyz-przekroj.png)

Na ilustracji wyizolowano jeden pierścień, żeby pozostałe wysokości nie zasłaniały układu. U siebie po obróceniu widoku nadal masz trzpień i jego wcześniejsze przekroje.

## 🔻 Zwęź cztery ramiona ku końcowi

Przejdź do wyboru ścian, odznacz wszystko i zaznacz górną pokrywę o kształcie krzyża. Wykonaj **`E Z 0.0075`**, następnie **`S 0.3333`**. Kolejny przekrój jest na wysokości 204.5 mm i ma około jednej trzeciej szerokości.

Wykonaj **`E Z 0.0015`**, potem **`S 0.6`**. Koniec wypada na Z=206 mm. Pozostaje mała, zamknięta powierzchnia, zamiast kilku nakładających się punktów. Tak powstają cztery zwężające się ramiona i zagłębienia pomiędzy nimi.

**Dlaczego drugi Scale ma inną wartość?** Skala jest mnożnikiem obecnego przekroju, nie grubością końcówki. Najpierw promień zewnętrzny zmalał z 3 do 1 mm na długości 7.5 mm. Żeby zachować ten sam spadek na kolejnym odcinku 1.5 mm, powinien zmaleć o kolejne 0.4 mm, do 0.6 mm. Stąd S 0.6. Ponowne S 0.3333 zwęziłoby go do około 0.33 mm i zaostrzyło ostatni odcinek. Powtarzanie tego samego Scale nie buduje automatycznie prostego stożka.

Z boku przyłóż wzrok do zewnętrznych krawędzi ramion: od pierwszego krzyżowego przekroju do końca powinny biec prosto. Jeśli tworzą kolano, popraw stosunek szerokości do długości odcinków. Bevel nie wyrówna tego załamania.

![Przekroje krzyżowego grotu oraz przejście w stronę trzpienia](/public/courses/blender/Images/wkretak-krzyz-siatka.png)

Wróć do Object Mode. Dodaj **Bevel**, Width **`0.00004 m`**, Segments **`2`**, a po nim **Weighted Normal**, Keep Sharp włączone. Wybierz Shade Smooth i przypisz ten sam materiał podglądowy stali co w płaskim grocie. Ustaw Limit Method Angle i próg 30°. Mała faza ma pozostać mniejsza od wąskich powierzchni przy czubku. Włączaj i wyłączaj Bevel, obserwując czoło: cztery ramiona muszą zachować szerokość. Jeżeli ich końce stają się obłe albo znikają, zmniejsz Amount zamiast dodawać segmenty. Segmenty zagęszczą łuk, ale nie oddadzą zjedzonej powierzchni.

Weighted Normal umieść po Bevel. Porównaj wynik z wyłączonym modyfikatorem przy niezmienionym świetle. Ma porządkować cieniowanie pól, a nie zamieniać cztery ramiona w miękką gwiazdkę. Przy widocznym skręceniu ściany wróć do siatki: sprawdź, czy te same cztery wklęsłe narożniki pozostają na tych samych przekątnych na każdym przekroju.

![Płaska i krzyżowa końcówka w tym samym oświetleniu i z takim samym powiększeniem](/public/courses/blender/Images/wkretak-koncowki.png)

Obróć krzyżak do widoku od czoła. Sprawdź **cztery ramiona**, odstępy pomiędzy nimi i malejący przekrój. Boczny widok samego zwężającego się czubka nie wystarczy, żeby ocenić konstrukcję.

## 🔗 Sprawdź warianty jako dwa osobne narzędzia

Zaznacz nowy grot, potem jego rękojeść jako aktywną i ustaw **Ctrl+P → Object (Keep Transform)**. Przesuń każdą rękojeść osobno: powinien poruszać się właściwy grot, a drugie narzędzie pozostać na miejscu.

Obie rękojeści mają ten sam projekt i materiały, ale niezależne siatki. **Niezależna siatka nie oznacza niezależnego materiału.** Zaznacz drugą rękojeść i otwórz Material Properties. Jeśli przy nazwie materiału widnieje liczba użytkowników, kliknięcie jej tworzy kopię materiału dla tego obiektu. Nazwij ją Tworzywo_czerwone i zmień Base Color. Pierwszy chwyt oraz oba stalowe groty mają zachować swoje kolory.

![Dwa kolory tworzywa przy niezmienionym materiale obu stalowych grotów](/public/courses/blender/Images/wkretaki-kolor-tworzywa.png)

To pozwala przygotować warianty bez mnożenia tekstur. W docelowym wspólnym atlasie maska materiałowa może wyznaczać obszar tintowania plastiku. Maska odpowiada na pytanie „gdzie zmienić kolor”, a mapa drewna, metalu lub tworzywa opisuje wygląd powierzchni. Dodanie osobnej mapy całego assetu dla każdego koloru nie jest konieczne.

Wróć do oglądania obu modeli. Obejrzyj rowki również po oddaleniu. Mają budować czytelny chwyt, a końcówki pozwalać rozróżnić narzędzia.

Zapisz projekt. [Plik z oboma wariantami](/public/courses/blender/Resources/wkretak-03-plaski-i-krzyzowy.blend) zawiera osobne kolekcje, edytowalne modyfikatory i zamknięte siatki. Do dalszego asortymentu dołączymy klucz płaski: tam kształt wyprowadzimy z obrysu i otworów.
