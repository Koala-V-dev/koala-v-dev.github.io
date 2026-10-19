# Materiały młotka - drewno, metal i światło

Otwórz swój `mlotek_v01.blend` albo [osobny model z poprzedniej lekcji](/public/courses/blender/Resources/mlotek-01-model.blend). Zapisz kolejną wersję jako `mlotek_v02.blend`. Przełącz **Outliner** na **Properites** (<kbd>Shift</kbd> + <kbd>F7</kbd>).

![Przełącz Outliner na Properites](/public/courses/blender/Images/przełącz-tryb-okna.png)

## 💡 Zobacz powierzchnię w świetle

W prawym górnym rogu widoku 3D kliknij **Material Preview**, trzecią z czterech kulek (1 na zrzucie). Dotychczas pracowałeś głównie w Solid. Ten tryb ułatwia oglądanie bryły, ale widoczny w nim szary kolor nie mówi jeszcze, czy obiekt jest z drewna, czy ze stali.

Material Preview pokazuje materiały oświetlone otoczeniem. **Materiał** opisuje między innymi barwę powierzchni i sposób odbijania światła. Ten sam kształt może wyglądać jak matowe tworzywo albo polerowany metal, zależnie od tych ustawień.

Zaznacz trzonek. W Properties otwórz kartę z czerwoną kulką, czyli <kbd class="win-menu-btn">Material Properties</kbd> (2). Kliknij <kbd class="win-menu-btn">New</kbd> (3).

![1 Material Preview, 2 karta materiału, 3 przycisk New dla zaznaczonego trzonka](/public/courses/blender/Images/material-podglad.png)

Rozwiń strzałkę obok kulek podglądu. Pozostaw wyłączone <kbd class="win-menu-btn">Scene Lights</kbd> i <kbd class="win-menu-btn">Scene World</kbd>. Dzięki temu korzystasz ze światła podglądu, a nie z lamp i otoczenia zapisanych w scenie. Nie musisz dodawać lampy ani kamery, żeby obejrzeć materiał.

W tym samym panelu kliknij miniaturę środowiska i wybierz `forest.exr` (*HDRI*). Jasne niebo oraz ciemniejsze drzewa dadzą wyraźne obszary do obserwowania w odbiciach. Przy innej orientacji widoku ich układ na głowicy może się różnić od zrzutów.

![Ustawienia światła podglądu - forest.exr](/public/courses/blender/Images/HDRI-forest.png)

## 🪵 Ustaw materiał trzonka

W Material Properties nazwij nowy materiał `Drewno_trzonka`. W sekcji <kbd class="win-menu-btn">Surface</kbd> pozostaw `Principled BSDF`. To **shader**, czyli sposób obliczania, jak powierzchnia reaguje na światło. Nie musisz teraz zmieniać wszystkich jego pól.

Ustaw trzy parametry oznaczone na zrzucie:

| Numer | Parametr   | Wartość        |
| ----- | ---------- | -------------- |
| 1     | Base Color | Hex `A66F3FFF` |
| 2     | Metallic   | `0`            |
| 3     | Roughness  | `0.55`         |

Aby wpisać kolor, kliknij próbkę przy <kbd class="win-menu-btn">Base Color</kbd> i znajdź pole <kbd class="win-menu-btn">Hex</kbd> w otwartym oknie. Końcowe `FF` w kodzie oznacza pełną wartość kanału alfa. Pozostaw też parametr Alpha materiału równy `1`.

> [!NOTE]
> Ten hex składa się z 4 par liczb heksadecymalnych, które określają wartości poszczególnych kanałów:
> <span class="color-box"><span class="R">R</span><span class="G">G</span><span class="B">B</span><span class="A">A</span></span> (skrót od ang. **_Red_**, **Green**, *Blue*, <span style="opacity: .7;">Alpha</span>)


![Materiał trzonka: 1 kolor bazowy, 2 metaliczność, 3 chropowatość](/public/courses/blender/Images/material-drewno.png)

*Base Color* nadaje trzonkowi brązową barwę. Nie jest to gotowy kolor każdego piksela na ekranie. Obróć widok: oświetlona strona wygląda jaśniej, a zacieniona ciemniej, mimo że wartość w polu pozostaje taka sama.

*Metallic* ustawione na `0` oznacza powierzchnię niemetaliczną. Drewno nadal odbija światło. Nawet po wypolerowaniu albo polakierowaniu nie staje się metalem.

*Roughness* opisuje mikroskopijną chropowatość powierzchni. Przy niższej wartości odbicia są ostrzejsze. Przy wyższej rozmywają się. Nie zmienia to obrysu trzonka ani liczby jego ścian.

Na razie cały trzonek ma te same właściwości. Nie ma jeszcze słojów ani różnic chropowatości w poszczególnych miejscach. Takie zróżnicowanie dodamy teksturami.

## 🔩 Oddziel stal od drewna

Zaznacz głowicę. W jej Material Properties kliknij <kbd class="win-menu-btn">New</kbd> i nazwij materiał `Stal_glowicy`. Ustaw:

| Parametr   | Wartość        |
| ---------- | -------------- |
| Base Color | Hex `B8BDC2FF` |
| Metallic   | `1`            |
| Roughness  | `0.28`         |

![Materiał stali przypisany do głowicy oraz jego parametry](/public/courses/blender/Images/material-stal.png)

**Metallic** określa, czy powierzchnia jest niemetaliczna (`0`, np. drewno), czy metaliczna (`1`, np. odsłonięta stal). Żeby zmatowić stal, zwiększ Roughness, pozostawiając Metallic na `1`.

### 🌳 Dlaczego stal bywa prawie czarna?

Głowica odbija wybrane wcześniej otoczenie `forest.exr` (*HDRI*). Jej bok wygląda ciemno, gdy odbija drzewa, a jasno, gdy odbija niebo. Obróć widok wokół młotka i zobacz, jak zmieniają się odbicia.

Żeby przesunąć odbicia bez obracania widoku, rozwiń strzałkę obok kulek podglądu i zmień <kbd class="win-menu-btn">Rotation</kbd>, jak na zrzucie poniżej. To ustawienie obraca otoczenie wokół modelu.

![Obrót HDRI względem świata](/public/courses/blender/Images/obrót-hdri-względem-świata.png)

Jeśli głowica wygląda zbyt ciemno, najpierw sprawdź ją przy innym ustawieniu Rotation. Może odbijać ciemny fragment otoczenia, mimo poprawnego koloru materiału.

## ↔️ Rozmyj odbicie, pozostaw ten sam model

Ustaw widok tak, aby na szerokiej stronie głowicy było widać jasny i ciemny fragment otoczenia. Od tej chwili nie obracaj widoku ani środowiska.

Zmień Roughness głowicy z `0.28` na `0.08`. Przyjrzyj się granicy między jasnym i ciemnym odbiciem. Potem ustaw `0.75` i porównaj ten sam fragment.

![Ta sama głowica i oświetlenie: u góry Roughness 0.08, u dołu 0.75](/public/courses/blender/Images/material-roughness.png)

Przy `0.08` można rozpoznać wyraźniejsze kształty otoczenia. Przy `0.75` możesz stwierdzić że materiał przestał odbijać otoczenie, a zamiast tego światło odbija się od powierzchni materiału, przez co zlewają się w szerokie, łagodne plamy. Odbicie zostało rozproszone, dlatego trudniej rozpoznać jego źródło.

Wróć do `0.28`. Następnie zaznacz trzonek i na chwilę zmniejsz jego Roughness z `0.55` do `0.08`. Pojawi się ostrzejszy połysk, mimo że Metallic nadal wynosi `0`. To samo pole pozwala więc zmieniać ostrość odbić zarówno na drewnie, jak i na stali. Przywróć trzonkowi `0.55`.

Te wartości są punktem wyjścia dla naszych dwóch powierzchni. Nie istnieje jedna chropowatość pasująca do każdego kawałka drewna lub stali. Sposób obróbki i wykończenie powierzchni zmieniają ich wygląd.

## ✨ Wygładź światło na fazach

Przybliż głowicę i obróć widok tak, aby jasne odbicie trafiło na fazę. Bevel z poprzedniej lekcji ma trzy segmenty. Przy płaskim cieniowaniu każdy z nich może wyglądać jak osobny pas.

W Object Mode, z zaznaczoną głowicą, wybierz <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Shade Smooth</kbd>. Sprawdź fazę. Przejścia między segmentami staną się łagodniejsze, ale duże płaskie boki mogą zacząć wyglądać na wybrzuszone.

Siatka się nie wygięła. Shade Smooth zmienił kierunki używane do obliczania światła między sąsiednimi ścianami. W poprzedniej lekcji normalna wskazywała kierunek wytłaczania ściany. Tutaj kierunki normalnych decydują, jak widzimy odbicie na powierzchni.

Otwórz zakładkę modyfikatorów z kluczem. W Bevel rozwiń <kbd class="win-menu-btn">Shading</kbd> i zaznacz <kbd class="win-menu-btn">Harden Normals</kbd>.

![Panel Bevel z ustawieniem Harden Normals w sekcji Shading](/public/courses/blender/Images/material-harden-normals.png)

Ta opcja dopasowuje normalne faz do sąsiednich powierzchni. Pomaga zachować płaski wygląd dużych boków i płynne przejście światła na zaokrągleniach. Nie dodaje segmentów ani nie zmienia obrysu głowicy.

![U góry płaskie cieniowanie, u dołu Shade Smooth wraz z Harden Normals](/public/courses/blender/Images/material-wygladzanie.png)

Obserwuj jasny pas przy krawędzi. Ma przechodzić przez fazę płynnie, a szeroki bok ma nadal wyglądać płasko. Jeśli odległe odbicie akurat zasłania różnicę, obróć widok, aby jasna granica ponownie trafiła na fazę.

Powtórz <kbd class="win-menu-btn">Shade Smooth</kbd> i włączenie <kbd class="win-menu-btn">Harden Normals</kbd> na trzonku. Pozostaw modyfikatory Bevel bez stosowania Apply.

**Wygładzanie cieniowania nie wygładza obrysu.** Gdy widzisz pasy światła wewnątrz powierzchni, sprawdzasz cieniowanie. Gdy po zewnętrznej krawędzi modelu widać kanciaste załamania, sam Shade Smooth ich nie usunie. Wtedy oceniasz liczbę segmentów i kształt geometrii.

## 🔎 Obejrzyj całość

Oddal widok tak, aby zobaczyć cały młotek. Obracaj go powoli. Stal powinna wyraźnie odbijać zmiany otoczenia, a brązowy trzonek mieć łagodniejszy połysk. Jasna krawędź głowicy pomaga odczytać jej kształt.

![Młotek z oddzielnymi materiałami trzonka i głowicy oraz wygładzonym cieniowaniem faz](/public/courses/blender/Images/material-wynik.png)

Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. [Plik do porównania](/public/courses/blender/Resources/mlotek-02-materialy.blend) zawiera dwa materiały i edytowalne modyfikatory.

Młotek zapisany wcześniej przy stole nadal ma poprzedni wygląd. Pracujesz na osobnym pliku, a Append tworzy niezależną kopię. Do przygotowania UV zachowaj otwarty ten model.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Materiał i światło działają razem.** Zanim zmienisz kolor ciemnego metalu, obejrzyj go z innych stron albo obróć środowisko *HDRI*.
- **Metallic** wybiera sposób reakcji powierzchni na światło. Drewno pozostaje niemetaliczne nawet wtedy, gdy mocno połyskuje.
- **Roughness** zmienia ostrość odbić. Porównuj wartości przy nieruchomym widoku i świetle, aby zobaczyć skutek jednej zmiany.
- **Shade Smooth i Harden Normals** wpływają na cieniowanie. Bevel tworzy geometrię fazy. Rozróżniaj pasy odbicia od kanciastego obrysu modelu.

| Skrót                                                                       | Zastosowanie w tej lekcji                                     |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>    | Zapis materiałów i ustawień cieniowania w bieżącym projekcie. |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>PPM</kbd></span> | Zmiana położenia kursora 3D                                   |
| <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>S</kbd></span>   | Wywołanie cyrkularnego menu Snap dla origin i kursora 3D      |

Nowe polecenia tej lekcji znajdziesz pod kulkami podglądu, w Material Properties oraz w <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Shade Smooth</kbd>. 
