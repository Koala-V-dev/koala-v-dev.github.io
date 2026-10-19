# Detal powierzchni - geometria, Bump i Roughness

Nie każda powierzchnia potrzebuje rys i uszkodzeń. W tym młotku najpierw dobierzemy stalową krawędź, potem sprawdzimy niewielkie wygładzenie chwytu i przydatność Bump. Każdą decyzję ocenimy na całym narzędziu, a nie tylko w powiększeniu.

Otwórz [młotek po poprawionym retuszu](/public/courses/blender/Resources/mlotek-10-przekroj-i-retusz.blend), zapisz jako `mlotek_v07.blend`. Obie części korzystają z materiału **Mlotek_PBR** i wspólnego **UV_Asset**. Nie przepakowuj ich osobno.

## 🔩 Geometria: dobierz krawędź stali

Bevel głowicy ma obecnie szerokość **2 mm**. Przy małej głowicy taka faza daje dość szeroki pas odbicia. Zaznacz `Glowica` i w Bevel zmień **Width na `0.0008 m`**, czyli **0.8 mm**. Pozostaw Segments `3` i Weighted Normal po Bevel.

![Ta sama głowica z fazą 2 mm i 0.8 mm przy stałym świetle](/public/courses/blender/Images/naprawa-faza-stali.png)

Obserwuj zwężenie jasnej linii na krawędzi i przejście między szerokimi ścianami. To rzeczywista zmiana geometrii: przy wystarczającym zbliżeniu zmienia również obrys. Nie musisz niszczyć głowicy, żeby stal wyglądała wiarygodnie. Przypadkowy zygzak przez całą szerokość nie zastępuje analizy uszkodzenia.

Dla zużytej głowicy najpierw potrzebowalibyśmy referencji miejsc uderzeń, ich kierunku i skali. W tym wariancie zachowaj głowicę bez ubytku. Czysty materiał i dobrze dobrana faza są użytecznym punktem wyjścia do późniejszego zużycia.

## ✋ Roughness: zmień odbicie w miejscu chwytu

Roughness opisuje mikroskopijną chropowatość odpowiedzialną za ostrość odbicia. Nie przesuwa wierzchołków i nie zmienia koloru. Delikatnie wygładzimy dolną część trzonka, pozostawiając ją **matowym drewnem**, bez lustrzanego lakierowanego pasa.

Rozpakuj obrazy przez **File → External Data → Unpack Resources → Use files in current directory (create when necessary)**. Izoluj trzonek, tymczasowo wyłącz podgląd Bevela i przejdź do Texture Paint.

Ustaw **Single Image → Mlotek_Roughness**, aktywne UV **UV_Asset**, obraz pozostaje **Non-Color**. Wybierz **Paint Soft**, Size około **80 px**, Strength **0.45**, szarość **`0.52`** we wszystkich kanałach. Pamiętaj: to liczba w mapie danych, nie Hex koloru drewna.

Maluj wzdłuż miejsca chwytu, około **4-13 cm nad dolnym końcem**, obracając trzonek i opracowując wszystkie cztery boki. Dwa lub trzy miękkie pociągnięcia wystarczą do obniżenia wartości bez wyczyszczenia całej zastanej struktury. Zakończenia mają się łagodnie rozmywać, bez prostego pierścienia wokół trzonka.

![Płótno Roughness oraz obszar malowania chwytu](/public/courses/blender/Images/naprawa-chwyt-paint.png)

![Mapa i odbicie przed malowaniem oraz po niewielkim wygładzeniu chwytu](/public/courses/blender/Images/naprawa-chwyt-porownanie.png)

Mapa pozwala sprawdzić, **gdzie** trafiło malowanie. Podgląd odbicia pokazuje, **jak** materiał na nie reaguje. W porównaniu odbić kolor zastąpiono jednolitą szarością, żeby drewno nie maskowało zmiany. Roughness nie został dodatkowo wzmacniany dla ilustracji.

Efekt ma być umiarkowany. Jeśli widzisz wyraźną błyszczącą opaskę, popraw przejście i podnieś Roughness. Jeśli przy docelowej odległości nie dostrzegasz różnicy, nie obniżaj wartości do `0.1` tylko po to, żeby ślad „musiał być widoczny”. Możesz zachować jednolite matowe wykończenie, jeśli taki jest wybrany przedmiot.

Zapisz zmienioną mapę jako `Mlotek_Roughness_chwyt.png`. Włącz Bevel, wyjdź z izolacji i wróć do Object Mode.

## 🌲 Bump: sprawdź, czy jest potrzebny

Bump zmienia normalną używaną w obliczaniu światła. Może zasugerować małe nierówności bez dodawania geometrii, lecz **nie zmienia obrysu**. W tym ćwiczeniu potraktuj go jako próbę materiału. Nie dodamy go automatycznie do gotowego młotka.

W Shader Editorze materiału dodaj przez wyszukiwanie `Shift+A`: **Texture Coordinate**, **Mapping**, **Noise Texture** i **Bump**. Połącz **Object → Mapping, Vector → Noise, Vector**. Mapping Scale: **X `1`, Y `1`, Z `0.03`**. Noise: **3D**, Scale **`2500`**, Detail **`2`**, Roughness **`0.5`**. Połącz **Noise, Fac → Bump, Height**. Bump ustaw na Strength **`0.12`**, Distance **`0.000015`**.

![Odłączona gałąź próbna Bump obok materiału korzystającego ze wspólnego atlasu](/public/courses/blender/Images/naprawa-bump-wezly.png)

Zmniejszenie współrzędnej Z wydłuża wzór wzdłuż trzonka. Distance odpowiada tutaj skali **15 mikrometrów**, nie milimetrowemu żłobieniu. Nie podłączamy fotografii do Height: ciemny fragment Base Color może być przebarwieniem, nie zagłębieniem.

Izoluj trzonek i tymczasowo połącz **Bump, Normal → Principled BSDF, Normal**. Porównaj z odłączonym przewodem przy niezmienionym świetle i kamerze. Materiał jest wspólny ze stalą, więc połączenie oddziałuje także na głowicę: to **próba na izolowanym drewnie**, nie końcowy podział efektu według materiału.

![Porównanie drewna w zbliżeniu z wyłączonym i włączonym subtelnym Bump](/public/courses/blender/Images/naprawa-bump-proba.png)

Następnie oddal widok do całego młotka. Jeśli drobne nierówności nie wnoszą czytelnej różnicy, zostaw tę gałąź **odłączoną**. W pliku wynikowym właśnie tak jest. Proceduralny szum może pomóc w badaniu materiału, ale sam nie dowodzi, że odtworzyłeś strukturę wybranego drewna.

## 🔎 Sprawdź materiał z odległości użytkowej

![Cały młotek i mały kadr kontrolny, bez wymuszania widoczności mikroszczegółów](/public/courses/blender/Images/naprawa-final.png)

Na koniec sprawdź, czy rozpoznajesz stal i drewno, czy włókna biegną wzdłuż trzonka i czy jego dolny koniec nie wygląda jak jasna zaślepka. Obróć światło: stal powinna wyraźnie zmieniać odbicie otoczenia, matowe drewno reagować łagodniej. Kontroluj również tylny szew.

Włącz widoczność obu części i ich modyfikatory. Zapisz mapę, wykonaj **Pack Resources** i zapisz projekt. [Wynik czterech lekcji](/public/courses/blender/Resources/mlotek-11-detal-powierzchni.blend) zachowuje wspólny atlas, jeden materiał, węższą fazę głowicy i matowy chwyt. Nie ma sztucznego wcięcia ani aktywnego proceduralnego Bump.

Mamy uporządkowane dane i materiał do dalszej pracy. Przy przygotowaniu wersji do silnika zajmiemy się siatką wynikową, fazami i mapą normalną; nie wystarczy wyeksportować samych węzłów Blendera.
