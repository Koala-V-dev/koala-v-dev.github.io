# Drewno trzonka - obraz, kierunek i chropowatość

Checker pokazywał, jak obraz układa się na siatce. Teraz zastąpisz go drewnem i ustawisz kierunek włókien, ich wielkość oraz odbicia światła. Pracujemy dalej na tym samym młotku.

Otwórz swoją wersję po przywróceniu materiałów lub [młotek z gotowym UV](/public/courses/blender/Resources/mlotek-06-uv-glowica-materialy.blend). Pobierz [dwie mapy drewna](/public/courses/blender/Resources/drewno-mapy-2k.zip) i rozpakuj archiwum obok projektu. Powstanie folder `textures`. Zapisz projekt jako `mlotek_v04.blend`.

## 🌳 Najpierw wybierz powierzchnię

Trzonek wykonany z jednego kawałka drewna ma włókna biegnące wzdłuż długości. Obraz z deskami i czarnymi szczelinami między nimi namalowałby na nim połączenia kilku desek. Dlatego użyjemy fragmentu ciągłej powierzchni, bez takich podziałów.

W paczce są dwa obrazy tego samego drewna. `diff` opisuje kolor, a `rough` chropowatość. Rozdzielenie tych informacji pozwala zmieniać odbicia bez przemalowywania drewna. Ciemniejszy fragment koloru sam w sobie nie oznacza gładszej powierzchni.

## 🎨 Podłącz kolor

W **Object Mode** zaznacz sam trzonek. W obszarze roboczym **UV Editing** zmień lewy edytor na **Shader Editor**, tak jak przy checkerze. W materiale `Drewno_trzonka` dodaj **Add → Texture → Image Texture**, kliknij **Open** i otwórz `wood_table_001_diff_2k.png` z folderu `textures`.

Zostaw **Color Space: sRGB**. Połącz wyjście **Color** obrazu (1) z **Base Color** w Principled BSDF (2). W widoku 3D włącz **Material Preview**. Metallic trzonka pozostaje `0`.

![Połączenie obrazu koloru z Base Color, z zaznaczonymi końcami przewodu](/public/courses/blender/Images/drewno-kolor.png)

Węzeł Image Texture przy pustym wejściu **Vector** korzysta z aktywnego UV obiektu. Zmiana obrazu w samym UV Editorze służy oglądaniu mapowania; materiał nadal korzysta z obrazu podłączonego tutaj.

## 🧭 Ustaw kierunek i wielkość włókien

Zmień lewy obszar na **UV Editor** i wybierz obraz `wood_table_001_diff_2k.png`. Nad widokiem 3D przejdź do Edit Mode i zaznacz wszystkie ściany trzonka. Następnie nad UV Editorem zaznacz wszystkie jego UV klawiszem **A**. Głowica pozostaje poza edycją.

Długa wyspa boków biegnie pionowo, podobnie jak włókna na obrazie. Takie ułożenie daje włókna wzdłuż trzonka. Poniżej zmienił się wyłącznie obrót UV o 90°; geometria, materiał i światło są identyczne.

![Ten sam młotek z włóknami wzdłuż trzonka i w poprzek po obrocie UV](/public/courses/blender/Images/drewno-kierunek.png)

Jeśli chcesz zobaczyć tę zmianę u siebie, nad UV Editorem wykonaj **R → 90 → Enter**, a potem **Ctrl+Z**. To dobry przykład, dlaczego poprawny checker jeszcze nie gwarantuje poprawnej tekstury: obrót zachowuje kształt kratek, ale zmienia kierunek materiału.

Teraz wielkość wzoru. Fotografia obejmuje około **1,5 m** wysokości drewna, trzonek ma **0,3 m**. Jego długa wyspa powinna więc zajmować około **jednej piątej wysokości obrazu**: `0,3 / 1,5 = 0,2`.

W pliku startowym wyspa zajmuje prawie całą wysokość. Ze wszystkimi UV trzonka zaznaczonymi wykonaj **S → 0.2085 → Enter**, następnie **G** i przesuń zestaw na spokojniejszy fragment po prawej stronie zdjęcia, jak na zrzucie. Dokładny fragment możesz wybrać sam; unikaj dużego, ciemnego rysunku pośrodku. Obserwuj jednocześnie wynik na modelu.

![Cały obraz drewna i wyspa boków zajmująca jedną piątą jego wysokości](/public/courses/blender/Images/drewno-uv.png)

Mniejsza wyspa pobiera mniejszy fragment fotografii, więc wzór na modelu staje się większy. Większa wyspa pokazuje więcej fotografii na tej samej powierzchni modelu, więc wzór drobnieje. Skaluj obie osie razem; rozciąganie tylko jednej zmieni proporcje włókien.

Przy wysokości obrazu `2048 px` te 20% daje około **410 pikseli na długość trzonka**. W bardzo bliskim kadrze szczegóły będą już miękkie. Wyższa rozdzielczość tej samej mapy da więcej pikseli przy zachowaniu wielkości słojów; powiększenie UV zmieni również wielkość wzoru.

Poprzednio pakowaliśmy obie części na wspólnym checkerze. Teraz drewno korzysta z osobnego obrazu, a stal nadal z jednolitego materiału. Dlatego dopasowujesz UV trzonka do skali tej fotografii. Przy późniejszym tworzeniu wspólnego atlasu wrócimy do podziału miejsca między części assetu.

## ✨ Oddziel chropowatość od koloru

Wróć do Object Mode i Shader Editora. Dodaj drugi **Image Texture**, otwórz `wood_table_001_rough_2k.png` i ustaw **Color Space: Non-Color** (1). Połącz jego **Color** z **Roughness** w Principled BSDF (2). Pierwszy obraz nadal zasila Base Color.

![Osobne obrazy dla koloru sRGB i chropowatości Non-Color oraz połączenie z Roughness](/public/courses/blender/Images/drewno-material.png)

Mapa chropowatości przechowuje liczby: czarne obszary są gładsze, białe bardziej szorstkie. **Non-Color** pozwala czytać te wartości bez przeliczenia koloru sRGB. Samo wczytanie szarego obrazka nie ustawia tego automatycznie.

Na poniższym porównaniu kolor został tymczasowo zastąpiony jednolitą szarością, żeby odsłonić same odbicia: stałe `0.08`, stałe `0.75` i mapa, przy identycznym świetle. W trzecim przypadku różne miejsca mogą mieć różną chropowatość. To mapa roughness ujawnia tutaj włókna. Po jej podłączeniu przewód zastępuje wcześniejszą, jednakową wartość Roughness. W swoim materiale zachowaj obraz drewna podłączony do Base Color.

![Jednolity szary kolor pozwala porównać samą chropowatość: 0.08, 0.75 i mapę drewna](/public/courses/blender/Images/drewno-odbicia.png)

Kolor i Roughness nie dodają geometrii ani wypukłości. Włókna są już widoczne, ale powierzchnia nadal ma kształt naszej siatki i Bevela.

## 💾 Zachowaj materiał i sprawdź końce

Wybierz **File → External Data → Pack Resources**, potem zapisz projekt. [Plik po tej lekcji](/public/courses/blender/Resources/mlotek-08-drewno.blend) ma oba obrazy wewnątrz i otwiera się bez folderu z teksturami.

Obróć młotek i obejrzyj dolny koniec trzonka oraz tylny szew. Na bokach powinny biec podłużne włókna. Na czole drewna potrzebny jest przekrój ze słojami, a na szwie trzeba sprawdzić ciągłość rysunku. Obecna fotografia boków tego nie rozwiązuje. To będzie następna praca na teksturze: dopasowanie obrazu do konkretnych powierzchni i poprawienie łączeń.

Źródło map: [Wood Table 001, Poly Haven](https://polyhaven.com/a/wood_table_001), fotografia Dimitrios Savva, opracowanie Rico Cilliers, [CC0](https://polyhaven.com/license). Paczka zawiera oryginalne mapy PNG 2048 × 2048 oraz opis źródła.
