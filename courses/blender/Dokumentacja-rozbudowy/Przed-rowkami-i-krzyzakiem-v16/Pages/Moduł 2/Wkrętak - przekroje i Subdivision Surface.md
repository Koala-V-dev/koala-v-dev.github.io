# Wkrętak - przekroje i Subdivision Surface

W module 2 rozbudujemy wyposażenie stołu. Zaczynamy od płaskiego wkrętaka: około **21 cm długości**, rękojeść około **10 cm**, trzpień o średnicy **6 mm**. Nowym narzędziem jest **Subdivision Surface**. Nauczysz się prowadzić bryłę niewielką liczbą przekrojów i zachować wyraźne przejścia mimo zaokrąglania.

Modeluj w nowym pliku, niezależnie od młotka. Utwórz kolekcję **Wkretak**, zapisz jako `wkretak_v01.blend`. Jednolite materiały na ilustracjach służą ocenie formy; ten etap kończy się modelem, przed UV i teksturami.

![Model wkrętaka z jednoczęściową rękojeścią i osadzonym grotem](/public/courses/blender/Images/wkretak-forma.png)

## 🧱 Zbuduj rękojeść z kilku przekrojów

Usuń domyślne obiekty. Kursor 3D pozostaw w początku świata. Dodaj **Mesh → Cylinder** i od razu otwórz panel ostatniej operacji (`F9`): **Vertices `8`, Radius `0.014 m`, Depth `0.08 m`, Location Z `0.04 m`**. Cylinder stoi podstawą na Z=0, ma 28 mm szerokości przez przeciwległe wierzchołki i 80 mm wysokości.

Nazwij go **Rekojesc**. Przez **Object → Set Origin → Origin to 3D Cursor** ustaw początek obiektu przy podstawie. Dzięki temu współrzędna Z zaznaczonego przekroju odpowiada jego wysokości nad stołem. Przejdź do Edit Mode, zaznacz wszystko i obróć siatkę **`R Z 22.5`**. To ustawia płaskie boki ośmiokąta symetrycznie względem osi.

Przełącz wybór ścian (`3` nad literami), odznacz wszystko i zaznacz **górną pokrywę**. Wykonaj:

1. **Extrude Region**: `E Z 0.01`, potem **Scale**: `S 0.65`. Powstaje dziesięciomilimetrowe zwężenie do szyjki.
2. Ponownie `E Z 0.006`. Powstaje krótka szyjka o stałym przekroju. Górna powierzchnia jest teraz na wysokości 96 mm.

![Siatka rękojeści przed wygładzaniem: korpus, zwężenie i szyjka](/public/courses/blender/Images/wkretak-przekroje.png)

Każdy przekrój określa miejsce zmiany kształtu. Na długim, prostym korpusie nie potrzebujemy kilkunastu równomiernych podziałów. Więcej przekrojów dołożymy tam, gdzie mają kontrolować przejście.

## 🫧 Zobacz, co rzeczywiście zmienia Subdivision

Wróć do Object Mode. Dodaj **Subdivision Surface** przez wyszukiwanie `F3`. Ustaw metodę **Catmull-Clark**, **Levels Viewport `2`**, **Render `2`**. Wybierz też **Object → Shade Smooth**.

To dwie różne operacje. Shade Smooth zmienia cieniowanie istniejących ścian. Subdivision tworzy dodatkowe ściany i przelicza ich położenie, więc zmienia również **obrys**. Catmull-Clark zaokrągla przejścia i ściąga powierzchnię do wnętrza siatki sterującej. Dlatego wynikowa rękojeść będzie nieco węższa od wyjściowego ośmiokąta.

Bez dodatkowej kontroli dół i szyjka stają się zbyt miękkie. Większy Levels nie przywróci utraconego kształtu: tylko dokładniej podzieli tę samą rozmytą formę.

Możesz porównać stan z [plikiem przed pętlami podtrzymującymi](/public/courses/blender/Resources/wkretak-01-przed-petlami.blend). Zawiera rzeczywiście zbudowaną rękojeść i modyfikator, bez grotu.

## 🎯 Dodaj pętle tam, gdzie zmienia się forma

W Edit Mode widzisz prostą siatkę sterującą oraz wynik modyfikatora. Włącz **Optimal Display**, żeby dodatkowe krawędzie wynikowej siatki nie zasłaniały przekrojów.

Na długim korpusie dodaj **Loop Cut** (`Ctrl+R`). Kliknij, a potem PPM, aby pozostawić cięcie w środku. Włącz wybór wierzchołków (`1`), otwórz panel `N → Item` i ustaw **Median Z na `0.004 m`**. Zaznaczony pierścień trafi 4 mm nad podstawę.

Dodaj drugi pierścień korpusu i ustaw jego **Median Z na `0.076 m`**. Na krótkiej szyjce dodaj analogicznie dwa pierścienie: **Z `0.091 m`** i **Z `0.095 m`**. Każdy pierścień ma obejmować pełny przekrój, nie pojedynczą krawędź z przodu.

![Pętle blisko podstawy, barku i końców szyjki sterują zaokrągleniem](/public/courses/blender/Images/wkretak-petle.png)

W widoku z przodu (`Num 1`) i z boku (`Num 3`) sprawdź odstępy. Pętle przy szyjce są blisko jej końców, ponieważ przejście ma pozostać wyraźniejsze. Na korpusie zostaje długi, spokojny odcinek.

Zaznacz dolną i górną pokrywę rękojeści, bez ścian bocznych. Wykonaj **Inset Faces** (`I`) o **`0.003 m`**. Powstają obrzeża podtrzymujące płaskie końce. Środkowe pokrywy pozostają wielokątami, ale leżą na płaskich powierzchniach; nie prowadzimy przez nie zagięcia barku. Na zakrzywionych bokach zachowujemy pasy czworokątów.

![Ta sama kamera i poziom Subdivision: rękojeść bez pętli oraz z kontrolowanymi przejściami](/public/courses/blender/Images/wkretak-subdivision-porownanie.png)

**Im bliżej przejścia leży pętla, tym węższy obszar zaokrąglenia.** To nie zawsze znaczy lepiej. Przesunięcie wszystkich pętli niemal na krawędzie da twardą, pudełkowatą rękojeść. Na korpusie zostaw łagodniejszy promień niż na końcu szyjki.

## 🪛 Zrób trzpień i płaską końcówkę

W Object Mode dodaj drugi cylinder, **Vertices `8`, Radius `0.003 m`, Depth `0.102 m`, Location Z `0.139 m`**. Nazwij go **Grot**. Jego dolny koniec wypada na Z=88 mm, więc wchodzi około **8 mm w rękojeść**, zamiast wisieć nad nią. W Edit Mode obróć całą siatkę `R Z 22.5`.

Wybierz tylko górną pokrywę, znajdującą się na Z=190 mm. Wyciągnij ją przez **`E Z 0.008`**, a potem spłaszcz **`S Y 0.18`**. Zmniejsz też szerokość przez `S X 0.98`. Powstaje przejście z okrągłego trzpienia do płaskiego ostrza.

Wyciągnij pokrywę jeszcze o **`E Z 0.008`** i wykonaj **`S Y 0.667`**. Końcówka jest teraz cieńsza od początku ostrza, ale nadal ma grubość. Nie skaluj jej do zera: zlepiłbyś wierzchołki w nakładające się krawędzie.

![Siatka przejścia z trzpienia do spłaszczonej końcówki](/public/courses/blender/Images/wkretak-grot.png)

Grot nie dostaje Subdivision. Dodaj mu **Bevel**, Width **`0.00015 m`**, Segments **`2`**, następnie **Weighted Normal**, Keep Sharp włączone, oraz Shade Smooth. Mała faza łapie światło bez robienia z końcówki obłego pręta. Sprawdź płaski kształt z dwóch stron: z boku ostrze będzie wąskie, z przodu ma około 5.5 mm szerokości.

## 🔎 Sprawdź bryłę i zachowaj edytowalność

Jeśli oceniasz bryłę w Material Preview, możesz użyć znanych ustawień podglądowych: tworzywo Metallic `0`, Roughness `0.48`, kolor `24485D`; stal Metallic `1`, Roughness `0.34`. Nie zastępują docelowych tekstur.

W Outlinerze powinny być dwa obiekty w kolekcji Wkretak. Zaznacz grot, potem z `Shift` rękojeść jako aktywną i wybierz **Parent → Object (Keep Transform)** przez `Ctrl+P`. Przesunięcie rękojeści ma przenosić cały wkrętak.

Obejrzyj połączenie szyjki z trzpieniem. Stal wchodzi do środka, nie ma szczeliny. Rękojeść zwęża się ku górze, a ostrze ma płaskie zakończenie. W razie zbyt miękkiego barku sprawdź położenie pętli, zanim zwiększysz poziom podziału.

Na chwilę zmień Levels Viewport z `2` na `3` i porównaj obrys w zwykłym kadrze. Każdy kolejny poziom dzieli czworokąt na cztery ściany. Jeżeli różnica sylwetki jest pomijalna, wróć do **2**. Siatka sterująca pozostaje mała; koszt siatki wynikowej rośnie mimo niewielkiej liczby widocznych punktów edycji.

Zapisz projekt z niezaaplikowanymi modyfikatorami. [Model po lekcji](/public/courses/blender/Resources/wkretak-02-model.blend) zachowuje przekroje i pętle do dalszych zmian. Kolejny przedmiot, klucz płaski, pozwoli porównać tę metodę z budowaniem narzędzia z płaskiego obrysu i otworów.
