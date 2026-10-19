# Obiekt i siatka - dwa poziomy edycji

Możesz powiększyć sześcian na dwa sposoby i uzyskać podobny obraz. W jednym przypadku zmienia się skala obiektu, w drugim położenie punktów siatki. Ten podział pomoże Ci później zrozumieć modyfikatory, współdzielenie danych i część niespodziewanych wyników.

Otwórz [plik startowy](/public/courses/blender/Resources/m00-01-start.blend) lub nową scenę General. Ta lekcja celowo wykorzystuje prosty sześcian. Na złożonym samochodzie trudniej zauważyć, co dokładnie się zmieniło.

## 📦 Object Mode porusza całym obiektem

W lewym górnym rogu widoku sprawdź **Object Mode**. Wybierz `Cube`, ustaw kursor nad 3D Viewport i otwórz Item klawiszem <kbd>N</kbd>. Domyślny sześcian ma wymiary 2 × 2 × 2, a Scale równe 1 na każdej osi.

![Object Mode i panel transformacji sześcianu](/public/courses/blender/Images/m00-object.png)

Naciśnij kolejno <kbd>S</kbd>, <kbd>X</kbd>, wpisz `2` i zatwierdź <kbd>Enter</kbd>. To **Scale** ograniczone do osi X. Klawisze wciskasz po kolei. Przed zatwierdzeniem <kbd>Esc</kbd> lub prawy przycisk myszy anuluje operację.

W Item odczytaj efekt: wymiar X wynosi 4, a Scale X wynosi 2. Y i Z nie zmieniły się. Podwoiłeś skalę obiektu w jednym kierunku.

![Powiększenie w Object Mode: Dimensions X równe 4 m i Scale X równe 2](/public/courses/blender/Images/m00-scale-before.png)

Skalowanie w Object Mode jest normalnym sposobem pracy. Trzeba tylko wiedzieć, w jakim stanie pozostawia obiekt. Nie będziemy nazywać go błędem.

## 🕸️ Edit Mode zmienia siatkę wewnątrz obiektu

Cofnij ostatnią operację przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>. Potwierdź, że sześcian znów ma wymiar X równy 2 i Scale X równe 1.

1. Naciśnij <kbd>Tab</kbd>. Podpis zmieni się na **Edit Mode**.
2. Wciśnij <kbd>1</kbd> nad literami, aby wybrać tryb wierzchołków.
3. Naciśnij <kbd>A</kbd>, żeby zaznaczyć całą siatkę.
4. Wykonaj <kbd>S</kbd>, <kbd>X</kbd>, `2`, <kbd>Enter</kbd>.
5. Wróć przez <kbd>Tab</kbd> do Object Mode i odczytaj Item.

Wymiar X ponownie wynosi 4, ale skala obiektu pozostaje 1. Teraz zmieniłeś współrzędne punktów siatki. W Edit Mode panel może pokazywać położenie zaznaczonych elementów zamiast transformacji całego obiektu, dlatego porównanie wykonuj po powrocie do Object Mode.

![Edit Mode: oznaczone menu trybu oraz przyciski wierzchołków, krawędzi i ścian](/public/courses/blender/Images/m00-edit.png)

Wierzchołek jest punktem. Krawędź łączy punkty, a ściana opisuje powierzchnię. Przyciski obok menu trybu oraz cyfry <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd> przełączają zaznaczanie tych elementów. Nie są to klawisze numpada.

## 📐 Co robi Apply Scale

Wróć do nowego sześcianu lub otwórz [przykład skali obiektu](/public/courses/blender/Resources/m00-03-skala-obiektu.blend). Ma Scale X=2 i wymiar X=4.

W Object Mode wybierz **Object → Apply → Scale** lub <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> i `Scale`. Nie wybieraj teraz All Transforms.

![Po Apply Scale: rozmiar pozostaje 4 na 2 na 2 metry, a skala wraca do jedności](/public/courses/blender/Images/m00-scale-after.png)

Kształt i wymiary pozostają takie same, lecz Scale znów wynosi (1,1,1). Przekształcenie zostało przeniesione do danych geometrii. Przy modelowaniu prostych statycznych rekwizytów często przygotowujemy w ten sposób obiekt przed operacjami zależnymi od skali. Przy animowanych i współdzielonych obiektach decyzja wymaga dodatkowej uwagi; dojdziemy do tego później.

## 🧪 Samodzielna próba

Na świeżym sześcianie uzyskaj wymiar Y równy 1, pozostawiając X i Z równe 2. Najpierw zrób to w Object Mode i odczytaj Scale. Następnie zastosuj wyłącznie Scale. Kształt ma zostać ten sam, a wartości Scale mają wynosić 1.

<details>
<summary>Sprawdź rozwiązanie po próbie</summary>

Sześcian o początkowym boku 2 trzeba w osi Y pomniejszyć do połowy: S, Y, 0.5, Enter. W Object Mode Scale Y wyniesie 0.5. Po Object → Apply → Scale wymiary będą nadal (2,1,2), a Scale (1,1,1). Jeśli zmieniły się wszystkie wymiary, nie ograniczyłeś skalowania do Y. Cofnij i powtórz.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przed operacją sprawdzasz Object Mode lub Edit Mode.
- Podobny wygląd bryły może wynikać z innej skali obiektu i innego kształtu danych siatki.
- Apply Scale zachowuje rozmiar, a zmienia sposób jego zapisania.
