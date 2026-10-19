# Wkrętak krzyżowy - wariant wspólnej konstrukcji

Mamy rowkowaną rękojeść i płaski grot. Teraz wykorzystamy tę samą konstrukcję chwytu do wkrętaka krzyżowego. Zmieni się przekrój oraz sposób zwężania końcówki, nie cały przedmiot.

Otwórz [wkrętak z rowkami](/public/courses/blender/Resources/wkretak-02-model.blend) i zapisz jako `wkretaki_v02.blend`.

![Dwa wkrętaki ze wspólnym projektem rowkowanej rękojeści](/public/courses/blender/Images/wkretaki-dwa-warianty.png)

## 🧩 Zachowaj chwyt, wymień grot

Nazwij dotychczasową kolekcję **Wkretak_plaski**. Zaznacz rękojeść i przesuń ją o **`G X -0.024`**. Grot powinien podążyć za rodzicem. Następnie zaznacz oba obiekty, wykonaj **Shift+D**, potem **`X 0.048`**. Kopia stanie 48 mm obok pierwszego narzędzia.

Przenieś kopię do nowej kolekcji przez **M → New Collection**, nazwij ją **Wkretak_krzyzowy**. Nazwij jej rękojeść `Rekojesc_krzyzowy` i usuń **tylko skopiowany grot**. Rowki, Subdivision i materiały chwytu zachowujesz. Zwykłe Shift+D daje niezależną siatkę, którą można później zmienić bez deformowania pierwszej rękojeści.

## ➕ Przygotuj przekrój z dwunastu punktów

Dodaj cylinder: **Vertices `12`, Radius `0.003 m`, Depth `0.102 m`, Location X `0.024 m`, Y `0`, Z `0.139 m`**. Nazwij go **Grot_krzyzowy**. Dolny koniec znów wchodzi 8 mm w szyjkę, górny jest na Z=190 mm.

Dlaczego tym razem 12 wierzchołków? Potrzebujemy czterech ramion, a na każdą ćwiartkę przeznaczymy trzy punkty: dwa przy zewnętrznym brzegu ramienia i jeden we wklęsłym narożniku. Liczba punktów wynika z przekroju, który budujemy.

W Edit Mode obróć całą siatkę **`R Z 15`**. Wybierz górną pokrywę i wykonaj **`E Z 0.007`**. Nowy przekrój jest na Z=197 mm.

Przejdź do wyboru wierzchołków (`1`) i widoku z góry (`Num 7`). **Wyłącz prześwietlenie**, odznacz wszystko i z Shift zaznacz cztery wierzchołki górnego pierścienia leżące na przekątnych: pod kątem 45°, 135°, 225° i 315° względem osi X. To cztery punkty między przyszłymi ramionami.

Pivot pozostaw **Median Point**. Wykonaj **`S 0.35`**. Cztery punkty przesuną się ku środkowi, a osiem pozostałych wyznaczy zewnętrzne brzegi. Nie łącz punktów w środku i nie skaluj każdego osobno wokół Individual Origins.

![Jeden przekrój sterujący: osiem punktów na ramionach i cztery cofnięte narożniki](/public/courses/blender/Images/wkretak-krzyz-przekroj.png)

Na ilustracji wyizolowano jeden pierścień, żeby pozostałe wysokości nie zasłaniały układu. U siebie po obróceniu widoku nadal masz trzpień i jego wcześniejsze przekroje.

## 🔻 Zwęź cztery ramiona ku końcowi

Przejdź do wyboru ścian, odznacz wszystko i zaznacz górną pokrywę o kształcie krzyża. Wykonaj **`E Z 0.0075`**, następnie **`S 0.3333`**. Kolejny przekrój jest na wysokości 204.5 mm i ma około jednej trzeciej szerokości.

Powtórz **`E Z 0.0015`**, potem **`S 0.3333`**. Koniec wypada na Z=206 mm. Pozostaje mała, zamknięta powierzchnia, zamiast kilku nakładających się punktów. Tak powstają cztery zwężające się ramiona i zagłębienia pomiędzy nimi.

![Przekroje krzyżowego grotu oraz przejście w stronę trzpienia](/public/courses/blender/Images/wkretak-krzyz-siatka.png)

Wróć do Object Mode. Dodaj **Bevel**, Width **`0.00004 m`**, Segments **`2`**, a po nim **Weighted Normal**, Keep Sharp włączone. Wybierz Shade Smooth i przypisz ten sam materiał podglądowy stali co w płaskim grocie. Mała faza ma pozostać mniejsza od wąskich powierzchni przy czubku.

![Płaska i krzyżowa końcówka w tym samym oświetleniu i z takim samym powiększeniem](/public/courses/blender/Images/wkretak-koncowki.png)

Obróć krzyżak do widoku od czoła. Sprawdź **cztery ramiona**, odstępy pomiędzy nimi i malejący przekrój. Boczny widok samego zwężającego się czubka nie wystarczy, żeby ocenić konstrukcję.

## 🔗 Sprawdź warianty jako dwa osobne narzędzia

Zaznacz nowy grot, potem jego rękojeść jako aktywną i ustaw **Ctrl+P → Object (Keep Transform)**. Przesuń każdą rękojeść osobno: powinien poruszać się właściwy grot, a drugie narzędzie pozostać na miejscu.

Obie rękojeści mają ten sam projekt i materiały, ale niezależne siatki. Obejrzyj rowki również po oddaleniu. Mają budować czytelny chwyt, a końcówki pozwalać rozróżnić narzędzia.

Zapisz projekt. [Plik z oboma wariantami](/public/courses/blender/Resources/wkretak-03-plaski-i-krzyzowy.blend) zawiera osobne kolekcje, edytowalne modyfikatory i zamknięte siatki. Do dalszego asortymentu dołączymy klucz płaski: tam kształt wyprowadzimy z obrysu i otworów.
