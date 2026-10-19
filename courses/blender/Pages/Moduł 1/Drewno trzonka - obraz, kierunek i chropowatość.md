# Drewno trzonka - obraz, kierunek i chropowatość

Trzonek ma wyglądać jak jeden kawałek jasnego drewna, oszlifowany i pozostawiony bez grubej powłoki lakieru. Zanim podłączysz obrazy, ustal te cechy. Sam napis „wood” przy teksturze nie mówi, czy przedstawia ona surowy materiał, bejcowany mebel czy mokrą deskę.

Otwórz [młotek z UV i materiałami](/public/courses/blender/Resources/mlotek-06-uv-glowica-materialy.blend), pobierz [mapy drewna, stali i opis źródeł](/public/courses/blender/Resources/jesion-mapy-2k.zip). Rozpakuj folder `textures` obok projektu i zapisz projekt jako `mlotek_v04.blend`.

## 🌳 Wybierz drewno pasujące do przedmiotu

Użyjemy Ash Veneer: fotografii spokojnego, podłużnego rysunku jesionu. To obraz powierzchni forniru; wykorzystamy go jako źródło włókien na bokach litego trzonka. Nie kopiujemy konstrukcji mebla ani nie traktujemy zdjęcia jako przekroju drewna.

Odrzuć fragmenty z łączeniami desek, wyraźnymi sękami, zabrudzeniami i wypalonymi refleksami. Na wąskim trzonku takie elementy łatwo stają się dominującymi plamami. Włókna mają biec wzdłuż narzędzia. Fotografia zawiera je poziomo, nasz trzonek stoi pionowo: trzeba ustawić UV, a nie obracać geometrię.

![Podłużne włókna i rozproszone odbicie na jasnym drewnianym trzonku](/public/courses/blender/Images/naprawa-drewno-wynik.png)

To punkt odniesienia dla tej lekcji: jasne drewno ma zachować rysunek, ale nie przykrywać go ostrym odbiciem otoczenia. Głowica pozostaje stalowa.

## 🎨 Podłącz obraz i popraw cieniowanie płaskich ścian

Zaznacz `Trzonek` i przejdź do Shading. W Shader Editor sprawdź, czy edytujesz materiał drewna. Przez Add → Texture → Image Texture dodaj węzeł, kliknij Open i otwórz `ash_veneer_diff_2k.jpg`, pozostaw sRGB i przeciągnij przewód z wyjścia Color do wejścia Base Color w Principled BSDF. Metallic pozostaje `0`, Coat Weight `0`.

Na obu częściach dodaj po Bevel modyfikator Weighted Normal: <kbd>F3</kbd>, wyszukaj `Add Weighted Normal Modifier`. Zostaw Weight `50` i włącz Keep Sharp. Shade Smooth interpoluje normalne również pomiędzy dużymi ścianami; Weighted Normal nadaje większe znaczenie powierzchni tych ścian. Obserwuj jasny pas na głowicy: szeroka, płaska powierzchnia nie powinna udawać wybrzuszonej poduszki. To zmiana cieniowania, nie przebudowa bryły.

Na materiale głowicy pozostaw Metallic `1`, kolor `B8BDC2`, ustaw Roughness `0.36`. W Material Preview wybierz środowisko studio.exr, wyłącz Scene Lights i Scene World. Obróć środowisko, żeby na stali było jednocześnie jasne odbicie i ciemniejszy obszar. Jednolity biały lub czarny refleks utrudnia ocenę metalu.

## 🧭 Ustaw kierunek i skalę

Zaznacz tylko trzonek i przejdź do Edit Mode. W UV Editorze wyświetl fotografię i zaznacz wszystkie UV. Długa wyspa boków w pliku startowym biegnie pionowo. Obróć cały zestaw trzonka o 90°: <kbd>R</kbd>, `90`, <kbd>Enter</kbd>. Na zdjęciu włókna są poziome, więc długa oś wyspy też powinna być pozioma.

Źródło obejmuje 1 metr, a trzonek ma 0.3 metra. Długa wyspa powinna zatem pobierać około 30% szerokości zdjęcia. W niezmienionym pliku startowym uzyskasz to przez <kbd>S</kbd>, `0.313`, <kbd>Enter</kbd>; potem przesuń zestaw w okolice środka fotografii. Jeśli wcześniej zmieniałeś układ, kieruj się proporcją 0.3, nie samą liczbą skali.

![Źródłowe UV na fotografii jesionu i jego kierunek na modelu](/public/courses/blender/Images/naprawa-drewno-uv.png)

Dlaczego skalujemy UV? Mniejsza wyspa pobiera mniejszy fragment zdjęcia, więc ten fragment zostaje bardziej powiększony na modelu. Większa wyspa pobiera więcej zdjęcia: rysunek drobnieje. Nie rozciągaj tylko jednej osi, żeby „zmieścić drewno”: zmienisz proporcje włókien.

Przy 2048 pikselach 30% daje około 614 pikseli na długość trzonka. Późniejszy bake do obrazu 2K nie odtworzy brakujących szczegółów fotografii. Daje natomiast miejsce na własny retusz.

Sprawdź kierunek z przodu i po obróceniu modelu. Na końcach chwilowo pojawi się zdjęcie boku: to rozpoznana pozostałość do poprawienia w lekcji Texture Paint, nie poprawny przekrój.

## ✨ Dobierz odpowiedź suchej powierzchni

W tym samym materiale dodaj drugi Image Texture, kliknij Open i wczytaj `ash_veneer_rough_2k.exr`, ustaw **Non-Color**. To dane chropowatości: nie powinny przechodzić przez przeliczenie sRGB.

Dodaj węzeł Map Range przez Add → Search. Połącz Color obrazu Roughness z wejściem Value w Map Range. Ten węzeł przeliczy jasności źródłowej mapy na wybrany zakres chropowatości. Ustaw From Min `0`, From Max `1`, To Min `0.58`, To Max `0.78`, Clamp włączone. Wyjście Result połącz z Roughness. Mapa zachowuje lokalne różnice, ale zakres odbić odpowiada naszemu założeniu matowego, oszlifowanego drewna.

![Materiał drewna: obraz koloru oraz przeliczenie mapy Roughness do matowego zakresu](/public/courses/blender/Images/naprawa-drewno-wezly.png)

Te liczby są ustawieniem tego materiału, nie definicją jesionu. Dwie deski tego samego gatunku mogą mieć inne wykończenie. Oceniaj szerokość i ostrość refleksu pod kątem: sama jasność drewna nie mówi, czy wygląda na lakierowane.

Obróć światło podglądu. Włókna mają pozostać czytelne, a odbicie powinno być szerokie i rozproszone. Jeśli powierzchnia robi się biała, rozróżnij zbyt jasne oświetlenie od zbyt ostrego refleksu, zanim zaczniesz przyciemniać Base Color.

## 🔧 Nadaj stali strukturę powierzchni

Głowica również dostaje obrazy. Pobierz dołączone w paczce mapy Metal009: Color oraz Roughness. To szczotkowana stal z drobnymi śladami obróbki, bez farby i rdzy. Nie nakładaj na młotek fotografii dużego arkusza z przetłoczeniami ani losowej skorodowanej blachy.

W materiale `Stal_glowicy` podłącz Metal009_2K-JPG_Color.jpg, sRGB → Base Color. Metallic pozostaje 1. Drugi obraz Metal009_2K-JPG_Roughness.jpg ustaw na Non-Color i połącz przez Map Range → Roughness. Map Range: From Min `0.2`, From Max `0.8`, To Min `0.25`, To Max `0.5`, Clamp włączone.

From Min i From Max opisują jasności wejściowe, To Min i To Max wynikowe wartości Roughness. Źródłowe `0.2` zostaje przeliczone na `0.25`, a `0.8` na `0.5`. Włączone Clamp zatrzymuje wynik na końcach zakresu. Zachowujemy ślady obróbki, ograniczając ich wpływ na odbicie.

![Materiał głowicy: osobna informacja o barwie metalu i o strukturze odbicia](/public/courses/blender/Images/naprawa-stal-wezly.png)

Zaznacz głowicę i otwórz Object Data Properties (zielony trójkąt) → UV Maps. Dwuklikiem na nazwie mapy zmień ją na `UV_Stal`. W jej materiale dodaj UV Map → UV_Stal i podepnij do Vector obu fotografii.

Nad UV Editorem obróć zestaw wysp tak, by długie pasy boków biegły poziomo, zgodnie ze śladami w obrazie. Dobierz wspólną skalę tak, by długa wyspa boku zajmowała około połowy szerokości zdjęcia. To dobrana skala wzoru dla tej głowicy, nie deklaracja fizycznego rozmiaru źródłowego arkusza.

![Struktura szczotkowanej stali widoczna na głowicy w świetle studyjnym](/public/courses/blender/Images/naprawa-stal-powierzchnia.png)

Sprawdź także obuch, a nie wyłącznie szeroki bok. Obrót wyspy końca zmienia kierunek śladów na tej powierzchni. Przy obrocie światła powinny ujawniać się subtelne różnice odbicia, bez czarnych plam udających otwory. Na tym etapie pozostaw Displacement i Normal niepodłączone. Najpierw oceń barwę i strukturę odbicia.

Normal zmienia cieniowanie, a Displacement może zmieniać geometrię: to osobne decyzje, które wymagają dobrania siły detalu do rozmiaru młotka. Kolor i zmienna chropowatość już budują strukturę metalu.

Źródło metalu: [Metal009, ambientCG](https://ambientcg.com/view?id=Metal009), Lennart Demes, CC0. Użyte obrazy są w paczce razem z jesionem i opisem licencji.

## 💾 Zachowaj źródło i wynik

Nazwij obecne UV trzonka UV_Drewno w Object Data Properties → UV Maps. Ten układ opisuje odczyt fotografii. Głowica nadal ma swój materiał i UV; wspólny układ do malowania utworzymy w następnym kroku, bez kasowania źródła.

Wybierz File → External Data → Pack Resources i zapisz projekt. [Wynik lekcji](/public/courses/blender/Resources/mlotek-08-drewno.blend) pozwala porównać kierunek włókien i ostrość odbicia na obu materiałach.

Źródło obrazów: [Ash Veneer, Poly Haven](https://polyhaven.com/a/ash_veneer), Jenelle van Heerden, [CC0](https://polyhaven.com/license). W paczce są oryginalne mapy oraz opis ich użycia. O wyglądzie trzonka decydują wspólnie fotografia, UV i wykończenie materiału.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Dobieraj fotografię do materiału i sposobu cięcia. Kierunek wzoru ustala UV, jego widoczny rozmiar wspólna skala wysp, a wygląd odbicia mapa Roughness. Zmieniaj te elementy osobno, obserwując skutek.
