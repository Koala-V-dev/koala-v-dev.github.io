# Texture Paint - przekrój drewna i retusz szwu

Własna mapa pozwala malować konkretną część młotka bez zmieniania fotografii źródłowej. Poprawimy dwa różne problemy: podłużne włókna na czole trzonka oraz nieciągłość rysunku na tylnym szwie.

Otwórz swoją wersję po bake lub [plik przygotowany do malowania](/public/courses/blender/Resources/mlotek-09-mapa-do-malowania.blend). Zapisz jako `mlotek_v06.blend`.

Obrazy zostały spakowane do projektu. Wybierz **File → External Data → Unpack Resources → Use files in current directory (create when necessary)**. Powstaną robocze PNG w folderze `textures` obok projektu. Będziemy je edytować i zapisywać, a po zakończeniu ponownie spakujemy do `.blend`.

## 🖌️ Wybierz powierzchnie, obraz i pędzel

Zaznacz trzonek i izoluj go klawiszem **/** nad widokiem 3D. W zakładce modyfikatorów wyłącz na czas malowania **podgląd Bevela ikoną monitora**. Wrócimy do niego po retuszu. Pracę na ostrej siatce łatwiej kontrolować przy końcach i narożniku.

W Edit Mode odznacz ściany i zaznacz **oba końce trzonka**, tak jak przy wyznaczaniu ich szwów UV. Wróć do Object Mode, a potem wybierz **Texture Paint** z listy trybów widoku 3D. Włącz **Face Selection Masking**, ikonę ściany obok listy trybów (3). Pędzel będzie działał tylko na zaznaczonych końcach.

Nad widokiem 3D otwórz wybór płótna (1). Ustaw **Mode: Single Image**, wybierz `Trzonek_BaseColor` oraz UV `UV_Malowanie`. To tutaj wskazujesz **obraz, na którym zostaną zapisane pociągnięcia**. Po lewej w Image Editorze wyświetl ten sam obraz; tryb **Paint** umożliwia również malowanie po obrazie 2D.

Z listy pędzli (2) wybierz **Paint Soft**. W dolnej półce pędzli można wyszukać go po nazwie. **Size** zmienia wielkość pędzla, **Strength** siłę nanoszenia koloru. Zacznij od około `30 px` i `0.3`; rozmiar dostosuj do przybliżenia widoku.

![Wybór obrazu do malowania, pędzla i maski zaznaczonych ścian](/public/courses/blender/Images/retusz-paint-kontrolki.png)

Do oceny koloru ustaw **Solid** i w jego menu przy kulach wybierz **Lighting: Flat**, **Color: Texture**. Oglądasz wtedy teksturę bez odbić światła. Po zakończeniu wrócimy do Material Preview, żeby sprawdzić również chropowatość.

## 🌳 Namaluj przekrój zamiast kolejnego boku

Obróć widok pod dolny koniec trzonka i przybliż go. Na czole drewna widać przecięte warstwy przyrostu. W wąskim kawałku wyciętym z większej deski zwykle będą to **fragmenty łuków**, których środek wypada poza trzonkiem.

Pędzlem **Paint Hard** pokryj zaznaczone czoło jasnym brązem surowego drewna. Wybierz kolor zbliżony do jasnych partii boków, ale bez ciemnego lakieru. Maska chroni boczne ściany przed zamalowaniem.

Wróć do **Paint Soft**, zmniejsz Size do kilku pikseli i narysuj ciemniejszym brązem kilka nierówno rozstawionych łuków. Zmniejsz Strength, jeśli linie są zbyt mocne. Kilka jaśniejszych przerw i różnic w grubości przełamie regularność. Na zrzucie widać prosty rysunek z tego etapu, jeszcze bez drobnych porów i śladów obróbki.

Sprawdź też wyspę końca w lewym edytorze obrazu. Dociągnij bazowy kolor i łuki do jej brzegów oraz trochę poza obrys, na margines około **16 pikseli obrazu**. Tak powstaje **padding**: kolor poza wyspą, z którego skorzysta filtrowanie tekstury przy krawędzi. Bez niego z brzegu może wracać stara fotografia lub kolor pustego tła. Zachowaj odstęp od sąsiednich wysp.

![Ten sam koniec trzonka przed malowaniem i po zastąpieniu włókien rysunkiem przekroju](/public/courses/blender/Images/retusz-przekroj.png)

Porównanie pokazuje sam kolor powierzchni, bez wpływu światła, z ponownie włączonym Bevelem.

Powtórz to na górnym końcu, widocznym dzięki izolacji trzonka. Podczas malowania obu czół przełącz też płótno na **Trzonek_Roughness** i pokryj końce jasną szarością, około `0.7` przy zakresie od czerni do bieli. Przecięte, otwarte włókna będą bardziej matowe niż lakierowane boki. Potem wróć na **Trzonek_BaseColor**.

## 🔗 Zobacz, gdzie trafia pociągnięcie przez szew

Wyłącz maskę ścian, żeby znów malować boki. Obróć trzonek od tyłu, z tylnym narożnikiem pośrodku widoku. To narożnik, wzdłuż którego przecinaliśmy UV.

Zrób krótką, wyraźną kreskę **w poprzek narożnika**. Na modelu jest ciągła, lecz na obrazie pojawia się w dwóch odległych miejscach przy brzegach długiej wyspy. Blender przelicza pociągnięcie z powierzchni 3D na UV obu ścian. Szew rozdziela współrzędne obrazu, nie model.

![Próbne niebieskie pociągnięcie przechodzi przez narożnik i zapisuje się przy obu brzegach wyspy](/public/courses/blender/Images/retusz-przez-szew.png)

Cofnij tę kreskę **Ctrl+Z**. Do gotowego materiału nie należy.

## 🩹 Połącz rysunek pędzlem Clone

Wybierz pędzel **Clone**. Kopiuje istniejący rysunek, dzięki czemu nie musisz zastępować włókien jednolitą plamą. Z **Ctrl+LPM** wskaż źródło na pobliskim, poprawnym fragmencie drewna, kilka milimetrów od szwu. Następnie maluj wzdłuż narożnika.

Ustaw miękki pędzel szerszy od widocznego łączenia i Strength około `0.5`. Kopiuj włókna biegnące w tym samym kierunku. Zmieniaj punkt źródłowy, kiedy zaczynasz powielać charakterystyczną smugę. Celem jest płynne przejście rysunku po obu stronach narożnika.

![Tylny narożnik przed retuszem oraz po połączeniu rysunku pędzlem Clone](/public/courses/blender/Images/retusz-szew.png)

Przełącz płótno na **Trzonek_Roughness** i powtórz retusz tego samego szwu, potem wróć do BaseColor. Retusz koloru nie zmienia drugiej mapy, a nieciągłość chropowatości może zdradzić łączenie w odbiciu światła. Obejrzyj narożnik również pod innym kątem. Nie zacieraj szerokiego pasa pędzlem Blur: usunąłby również strukturę drewna.

## 💾 Zapisz obrazy i sprawdź materiał

Włącz ponownie podgląd Bevela, wyjdź z izolacji klawiszem **/** i włącz **Material Preview**. Sprawdź drewno w zwykłym kadrze oraz z bliska: końce mają przekrój i bardziej matową powierzchnię, a retusz boków nie powinien tworzyć rozmazanej łaty.

W Image Editorze zapisz **oba zmienione obrazy** przez **Image → Save As** do folderu `textures` obok projektu, następnie wykonaj **File → External Data → Pack Resources** i zapisz `.blend`. Gwiazdka przy menu Image oznacza niezapisane zmiany obrazu; samo Ctrl+S projektu nie zastępuje zapisu zewnętrznych PNG.

[Plik po malowaniu](/public/courses/blender/Resources/mlotek-10-przekroj-i-retusz.blend) zawiera oba obrazy. Możesz też pobrać [wynikowe mapy PNG](/public/courses/blender/Resources/trzonek-po-retuszu-mapy.zip). Rysunek przekroju jest pierwszą własną warstwą detalu; pory, rysy i ślady obróbki dodamy później z uwzględnieniem skali oraz sposobu używania narzędzia.
