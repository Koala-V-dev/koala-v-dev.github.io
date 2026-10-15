# Pierwsza bryła – Prosty stół warsztatowy (Ekstruzja i skala obiektu)

Gdy po raz pierwszy uruchamiasz Blendera, domyślna scena zawiera sześcian o boku 2 metrów. W tej lekcji przekształcisz tę bryłę w **prosty stół warsztatowy** o zadanych wymiarach produkcyjnych. 

Nauczysz się kontrolować przestrzeń, przełączać tryby pracy i zrozumiesz, dlaczego zignorowanie skali niszczy dalszą pracę nad modelem.

Klasyką jest zaznaczyć wszystko <kbd>A</kbd> i usunąć <kbd>Delete</kbd> lub <kbd>X</kbd>.

![domyslna-scena](/public/courses/blender/Images/blender-start.png)

Następnie dodanie na nowo do kostki (*cube*) sceny <kbd>Shift</kbd> + <kbd>A</kbd>.

![dodawanie-obiektu](/public/courses/blender/Images/dodawanie-obiektu.png)


---

## 🧭 Nawigacja i przestrzeń robocza

W grafice 3D nie obracasz modelu, lecz kamerę wirtualną w przestrzeni trójwymiarowej. Trzy osie wyznaczają kierunki:
- Oś czerwona (**X**) – lewo / prawo
- Oś zielona (**Y**) – przód / tył
- Oś niebieska (**Z**) – góra / dół

Widok możesz zablokować na danej osi **X** <kbd>Numpad 1</kbd>, **Y** <kbd>Numpad 3</kbd>, **Z** <kbd>Numpad 7</kbd>.

![](/public/courses/blender/Images/rotacaj-widoku-x-y-z.png)


### Podstawowe sterowanie widokiem:
- **Obrót widoku:** naciśnij i przytrzymaj <kbd>ŚPM</kbd> (Środkowy Przycisk Myszy).
- **Przesunięcie widoku (Pan):** przytrzymaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>ŚPM</kbd></span>.
- ** Przybliżenie / Oddalenie:** kręć kółkiem myszy lub <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>ŚPM</kbd></span>.
- **Wycentrowanie na zaznaczonym obiekcie:** klawisz <kbd>Numpad .</kbd> (kropka na klawiaturze numerycznej).

> [!NOTE]
> Jeśli pracujesz na laptopie bez klawiatury numerycznej, wejdź w menu `Edit` $\rightarrow$ `Preferences` $\rightarrow$ zakładka `Input` i zaznacz opcję **Emulate Numpad**. Klawisze od <kbd>1</kbd> do <kbd>9</kbd> nad literami przejmą funkcje rzutów.

---

## Tryby pracy

Blender rozróżnia tryby pracy, które zmieniają przeznaczenie narzędzi. W trybie ***Object Mode*** manipulujesz obiektem jako całością (pozycją, obrotem, skalą). W trybie ***Edit Mode*** edytujesz siatkę (wierzchołki, krawędzie, ściany).

- **Object Mode** – wciśnij <kbd>Tab</kbd>.
- **Edit Mode** – wciśnij <kbd>Tab</kbd>.

Oba tryby mają swoje własne skróty klawiszowe, które są używane do modyfikowania geometrii.

![tryby-pracy](/public/courses/blender/Images/tryby-pracy.png)


Wybierając klawisze <kbd>1</kbd>, <kbd>2</kbd> lub <kbd>3</kbd> (nad literami) w trybie ***Edit Mode***, zmieniasz rodzaj wybieranych elementów:
- <kbd>1</kbd> – Wierzchołki (*Vertex*)
- <kbd>2</kbd> – Krawędzie (*Edge*)
- <kbd>3</kbd> – Ściany (*Face*)

Możesz też chcieć zmienić widok na przezroczysty. Wtedy użyj skrótu <kbd>Shift</kbd> + <kbd>Z</kbd> lub włącz tryb *X-Ray* <kbd>Alt</kbd> + <kbd>Z</kbd>.



## ⚠️ Błędna metodyka: Skalowanie w Object Mode

Najczęstszy błąd początkujących to rozciąganie bryły w trybie obiektowym bez świadomości działania macierzy transformacji.

Wciśnij klawisz <kbd>N</kbd>, aby wysunąć boczny panel właściwości (**Sidebar**) i spójrz na sekcję `Transform` $\rightarrow$ `Scale`:

```text
Wartości fabryczne:
Scale X: 1.000
Scale Y: 1.000
Scale Z: 1.000
```

Jeśli w trybie `Object Mode` przeskalujesz sześcian wzdłuż osi X (<kbd>S</kbd>, a następnie <kbd>X</kbd>, wpisując `2`), obiekt się rozciągnie, ale jego wewnętrzna skala wyniesie **(2.0, 1.0, 1.0)**.

**_Konsekwencje błędu:_**
Każde kolejne narzędzie (np. zaokrąglanie krawędzi Bevel, grubość Solidify, teksturowanie UV) przyjmie współczynnik $2.0$. W efekcie zaokrąglenia będą jajowate, a tekstury rozciągnięte w osi X.

### Zasada produkcyjna (PRO):
Przed modelowaniem szczegółów zawsze zatwierdzaj skalę skrótem:
<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> $\rightarrow$ wybierz **Scale**. Wartości w panelu bocznym powrócą do `1.000`, a wymiary fizyczne (**Dimensions**) zostaną zachowane.

---

## 🛠️ Budowa stołu warsztatowego krok po kroku

Nasz stół będzie miał blat o wymiarach **2.0 m x 1.0 m x 0.1 m** oraz cztery nogi o wysokości **0.8 m**.

### Krok 1: Wymiarowanie blatu
1. Zaznacz domyślny sześcian lewym przyciskiem myszy (<kbd>LPM</kbd>).
2. W panelu bocznym (<kbd>N</kbd>) w sekcji `Dimensions` wpisz:
   - `X`: **2 m**
   - `Y`: **1 m**
   - `Z`: **0.1 m**
3. Wciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> i wybierz **Scale**. Wartości `Scale` muszą wynosić dokładnie `1.000`.

### Krok 2: Przejście do trybu edycji (Edit Mode)
Wciśnij klawisz <kbd>Tab</kbd>, aby wejść w `Edit Mode`. 

W lewym górnym rogu ekranu (lub klawiszami <kbd>1</kbd>, <kbd>2</kbd>, <kbd>3</kbd> nad literami) przełączasz elementy geometrii:
- <kbd>1</kbd> – Wierzchołki (*Vertex*)
- <kbd>2</kbd> – Krawędzie (*Edge*)
- <kbd>3</kbd> – Ściany (*Face*)

### Krok 3: Nacięcia pod nogi stołu (Loop Cut)

By wydobyć z sześcianu formę należy zagęścić jego geometrię w odpowiednich miejscach.

Musimy podzielić dolną ścianę na obszary, z których wyciągniemy nogi.

1. Wciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> i najedź kursorem na blat stołu. Pojawi się żółta linia podziału.
2. Kliknij <kbd>LPM</kbd>, aby zatwierdzić podział, a następnie kliknij <kbd>PPM</kbd> (Prawy Przycisk Myszy), aby wycentrować linie.
3. Przygotuj nacięcia tak by pozostał odstęp od krawędzi blatu i kwadrat na nogę stołu.

![nacięcia-pod-nogi-stołu](/public/courses/blender/Images/ciecia-blatu-stolu.png)

> [!TIP]
> Klawisz <kbd>G</kbd> to przesuwanie zaznaczenia. Możesz je przesuwać względem osi xyz klikając odpowiedni klawisz z literką jej odpowiadający oraz podwójne kliknięcie <kbd>G</kbd> pozwala na przesuwanie zaznaczenia wzdłuż osi prostopadłej do powierzchni, na której się znajduje.


Teraz zaznacz skrajne wierzchołki (vertexy) w trybie przezroczystości i je usuń.

![Usuwanie wierzchołków](/public/courses/blender/Images/zanzaczanie-vertexsow-w-trybie-przezroczystej-siatki.png)


Teraz przejdź do zakłądki modyfikatorów i dodaj `Generate` $\rightarrow$  `Mirror`:


![Modyfikator Mirror](/public/courses/blender/Images/modyfikator-mirror.png)

Ustaw osie X i Y symetrii. Dzięki temu wystarczy, że stworzysz nogę w jednym narożniku, a modyfikator automatycznie wygeneruje pozostałe trzy.

![Modyfikator Mirror](/public/courses/blender/Images/modyfikator-mirror-osie-xy.png)


### Krok 4: Wytłaczanie nóg (Extrude)
1. Obróć widok pod spód stołu (<span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>ŚPM</kbd></span> i <kbd>ŚPM</kbd>).
2. Przełącz się w tryb wyboru ścian (<kbd>3</kbd>).
3. Zaznacz narożną ściankę <kbd>LPM</kbd>.
4. Wciśnij klawisz <kbd>E</kbd> (*Extrude*)
5. Na dole pojawi się okienko do rozwinięcia *Extrude Region and Move*. Wprowadź na osi **Z** wartość `.8` by uzyskać nogę o wysokości $80\text{ cm}$.


![Ekstrakcja ściany](/public/courses/blender/Images/ekstrakcja-sciany.png)



---

## 🔍 Weryfikacja czystości geometrii

Przełącz widok do `Object Mode` (<kbd>Tab</kbd>).

Sprawdź parametry obiektu:
1. **Dimensions:** powinny wynosić $X=2.0\text{ m}$, $Y=1.0\text{ m}$, $Z=0.9\text{ m}$ (blat 10 cm + nogi 80 cm).
2. **Scale:** musi wynosić dokładnie $X=1.000$, $Y=1.000$, $Z=1.000$.
3. **Face Orientation:** włącz menu `Viewport Overlays` (ikona dwóch nakładających się kółek na górnym pasku) i zaznacz **Face Orientation**. Cały stół musi być **niebieski**. Jeśli jakakolwiek ściana jest czerwona, wejdź w `Edit Mode`, zaznacz wszystko (<kbd>A</kbd>) i wciśnij <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>N</kbd></span> (*Recalculate Normals*).

---

## 🎯 Samodzielna próba

Dodaj odpowiednie cięcia i ekstruzje tak aby odwzorować poniższy stół warsztatowy:

![Stolik-todo](/public/courses/blender/Images/stolik-todo.png)

W modyfikatorze Mirror ustaw opcję `Clipping` jako włączoną. Wtedy gdy krawędź lub vertex obiektu złączy się z odbiciem lustrzanym to się skleją w jedną całość. 

Zaznaczając vertexy lub krawędzie najlepiej tak by powstała ściana zbudowana z czterech vertexów. Naciśnij <kbd>F</kbd> (*Fill*) i się połączą w ścianę.

Ścianki w grafice 3D są jednostronne i nie mają grubości. To znaczy że renderują się tylko z jednej strony. Dlatego ważne jest aby normalne były skierowane na zewnątrz obiektu.

Aby zobaczyć normalne ścianek należy wejść w zakładkę `Viewport Overlays` i zaznaczyć `Face Orientation`. 

![złe-normalne-scian](/public/courses/blender/Images/show-bad-normals-faces.png)

Czerwone ścianki oznaczają że patrzysz na przezroczystą stronę zamiast tej renderowanej. Aby to naprawić należy zaznaczyć wszystkie czerwone ścianki przytrzymując klaiwsz <kbd>Shift</kbd> a następnie z menu wybrać `Mesh` $\rightarrow$ `Normals` $\rightarrow$ `Recalculate Outside` / `Recalculate Inside` lub poprostu `Flip` (możesz też to menu odpalić skrótem <kbd>Alt</kbd> + <kbd>N</kbd>)

![dobre-normalne-scian](/public/courses/blender/Images/fix-bad-normals-faces.png)