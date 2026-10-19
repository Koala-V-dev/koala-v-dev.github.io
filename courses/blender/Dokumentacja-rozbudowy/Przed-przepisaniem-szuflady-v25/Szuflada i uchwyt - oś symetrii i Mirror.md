# Szuflada i uchwyt - oś symetrii i Mirror

Do stołu dołożymy szufladę z prostym uchwytem. Korpus wydrążysz znanymi już narzędziami. Dwa mocowania uchwytu powstaną z jednego obiektu dzięki modyfikatorowi **Mirror**.

Otwórz `stol_v02.blend` lub [stół z półką](/public/courses/blender/Resources/stol-04-polka.blend). Zapisz projekt jako `stol_v03.blend`.

## 📦 Wydrąż korpus

Dodaj Cube o nazwie `Korpus_szuflady`. Ustaw Dimensions `(0.8, 0.6, 0.16) m` i Location `(0, -0.1, 0.7) m`. Zastosuj Scale. Szuflada będzie pośrodku stołu, a nad jej górną krawędzią zostaną 4 cm do spodu blatu.

Włącz Local View, wejdź w Edit Mode i wybierz tylko górną ścianę. Wykonaj Inset: <kbd>I</kbd>, `0.015`, <kbd>Enter</kbd>. Następnie Extrude: <kbd>E</kbd>, `-0.14`, <kbd>Enter</kbd>.

![Wydrążony korpus szuflady w Local View](/public/courses/blender/Images/szuflada-korpus.png)

Obwódka stała się ściankami o grubości 1.5 cm. Dno ma 2 cm grubości: od początkowych 16 cm wysokości odjęliśmy 14 cm zagłębienia. Nie usuwaj dolnej ściany; jej wewnętrzna i zewnętrzna powierzchnia zamykają bryłę.

## 🪵 Dopasuj front

Wróć do Object Mode i wyłącz Local View. Dodaj `Front_szuflady`: Dimensions `(0.84, 0.04, 0.18) m`, Location `(0, -0.42, 0.7) m`. Zastosuj Scale.

Front jest szerszy od korpusu o 2 cm z każdej strony i wyższy o 1 cm u góry oraz u dołu. Jego tylna powierzchnia styka się z przednią ścianą korpusu. Obejrzyj połączenie z boku; front nie powinien wisieć przed skrzynką.

![Front szuflady pod blatem, przed korpusem](/public/courses/blender/Images/szuflada-front.png)

Możesz porównać ustawienie z [plikiem z korpusem i frontem](/public/courses/blender/Resources/stol-05-szuflada.blend).

## 🔩 Zbuduj jedno mocowanie uchwytu

Dodaj Cube `Mocowania_uchwytu`. Ustaw Dimensions `(0.025, 0.07, 0.04) m`, Location `(0.12, -0.475, 0.7) m` i zastosuj Scale. Powstał mały klocek po prawej stronie frontu. Jego tył dochodzi do frontu, a przód wystaje w stronę użytkownika stołu, czyli w kierunku ujemnego Y.

Żeby zobaczyć detal, zaznacz mocowanie i z przytrzymanym <kbd>Shift</kbd> front, a następnie włącz Local View. Po przybliżeniu kliknij samo mocowanie, aby tylko ono było zaznaczone.

![Pojedyncze mocowanie przed dodaniem odbicia](/public/courses/blender/Images/szuflada-mocowanie.png)

## 🪞 Odbij je względem frontu

Modyfikator oblicza zmianę na podstawie istniejącej siatki. Możesz nadal edytować źródło i zmieniać ustawienia operacji. W przypadku Mirror zbudujemy jedno mocowanie, a drugie będzie jego odbiciem.

Po prawej otwórz kartę Modifiers z ikoną klucza, kliknij Add Modifier i wyszukaj `Mirror`. Dodaj ten modyfikator. W Axis pozostaw tylko X (1 na zrzucie).

Na razie możesz nie zobaczyć drugiego mocowania. Domyślnie Mirror odbija siatkę względem origin, czyli punktu odniesienia własnego obiektu. Origin kostki leży w jej środku, więc symetryczna kostka odbija się sama na siebie.

W polu Mirror Object (2) kliknij pipetę i wskaż `Front_szuflady` w Outlinerze. Blender użyje położenia i obrotu frontu jako odniesienia. Front ma X równe zero i nie jest obrócony: płaszczyzna odbicia przechodzi teraz przez środek szuflady. Mocowanie przy X = 12 cm dostaje odbicie przy X = -12 cm.

![Mirror: 1 włączona oś X, 2 front jako obiekt wyznaczający płaszczyznę odbicia](/public/courses/blender/Images/szuflada-mirror.png)

Drugie mocowanie jest wynikiem działania modyfikatora, a nie osobnym obiektem w Outlinerze. Wejdź w Edit Mode, zaznacz całą siatkę i przesuń ją przez <kbd>G</kbd>, <kbd>X</kbd>, `0.02`. Źródłowe mocowanie przesunie się w dodatnim X, a jego odbicie w ujemnym X.

Odstęp między nimi zwiększy się o 4 cm, chociaż przesunąłeś źródłową siatkę tylko o 2 cm. Cofnij ten ruch przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span> i wróć do Object Mode.

Edytujesz jedną stronę, a Mirror wylicza drugą. Pozostaw modyfikator aktywny. Zmieniając szerokość lub kształt źródłowego mocowania, poprawisz obie strony jednocześnie. Gdybyś od razu zrobił dwie niezależne kopie, każdą trzeba byłoby dopasowywać osobno.

## 🛠️ Połącz mocowania poprzeczką

Wyłącz Local View. Dodaj `Poprzeczka_uchwytu`: Dimensions `(0.26, 0.025, 0.025) m`, Location `(0, -0.5, 0.7) m`. Zastosuj Scale. Poprzeczka zachodzi końcami na oba mocowania; pomiędzy nią a frontem zostaje miejsce na palce.

Aby obejrzeć sam uchwyt, zaznacz jego poprzeczkę, mocowania oraz front i ponownie włącz Local View.

![Uchwyt z poprzeczką i dwoma symetrycznymi mocowaniami](/public/courses/blender/Images/szuflada-uchwyt.png)

Wróć do całego stołu i zapisz projekt. Na tym etapie szuflada składa się z oddzielnych obiektów; w kolejnej lekcji połączymy ich ruch, żeby wysunięcie korpusu zabierało ze sobą front i uchwyt.

![Ten sam stół po dodaniu szuflady i uchwytu](/public/courses/blender/Images/szuflada-wynik.png)

[Plik wynikowy z aktywnym Mirror](/public/courses/blender/Resources/stol-06-uchwyt.blend).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Mirror odbija źródłową siatkę względem wskazanej płaszczyzny. Jeśli kopia się nie pojawia, sprawdź punkt odniesienia i oś odbicia. Przed dodaniem niezależnej kopii rozważ, czy obie strony mają być nadal edytowane razem.
