# UV - jak wybierać cięcia i dzielić piksele

Przy rozkładaniu UV podejmujesz trzy różne decyzje: **gdzie rozciąć powierzchnię, jak ograniczyć odkształcenie obrazu i ile pikseli przeznaczyć na jej fragmenty**. Równa kratka pomaga w ocenie, ale sama nie odpowiada na wszystkie te pytania.

Prześledzimy je na tej samej głowicy młotka. Kształt modelu pozostaje bez zmian. W następnej lekcji samodzielnie przygotujesz rozłożenie całego narzędzia.

## ✂️ Wybierz miejsca otwarcia powierzchni

Wyobraź sobie model owinięty cienkim papierem. Chcesz zdjąć ten papier i rozłożyć na stole. Na pudełku możesz rozdzielić płaskie ściany albo pozostawić część z nich połączoną. Na głowie, jak na skórce pomarańczy, bez rozcięć i odkształceń nie uzyskasz płaskiego arkusza.

**Szew UV wskazuje miejsce rozdzielenia tej owijki. Nie rozcina siatki 3D.** Na powierzchni nadal spotykają się te same ściany, ale w UV ich brzegi mogą trafić do oddalonych miejsc obrazu.

Dlatego rozłożenie kanciastego przedmiotu może składać się z prostokątów i trapezów, a wyspa twarzy ma nieregularny obrys. Nie próbujemy zamienić każdej powierzchni w prostokąt. Próbujemy odwzorować ją na obrazie bez odkształceń szkodzących teksturze.

Na twarzy warto zachować ciągły obszar czoła, policzków i ust, a główne rozcięcie głowy poprowadzić mniej widocznym miejscem, np. z tyłu. Uszy czy wnętrze ust mogą wymagać osobnych wysp. Liczba cięć wynika z kształtu i sposobu teksturowania, nie z zasady „postać ma jedno cięcie”.

## 🧵 Zrozum, kiedy szew staje się widoczny

Renderer nie rysuje czerwonej kreski w miejscu Mark Seam. Może natomiast pokazać **niezgodność danych po obu stronach**: inny kolor, urwany sęk drewna, zmianę chropowatości albo niepasujący kierunek normalnych.

![Te same szwy głowicy: nieciągły wzór kratki i powierzchnia z jednolitym materiałem](/public/courses/blender/Images/uv-zasady-szew.png)

Na kratce granica wzoru może być wyraźna, bo sąsiednie fragmenty modelu czytają inne pola obrazu. Jednolity materiał nie pokazuje tej granicy, mimo zachowanych szwów. Szew trzeba więc **obsłużyć podczas teksturowania**, a nie traktować jako nieuniknioną szczelinę modelu.

Malowanie po modelu 3D pomaga dopasować obie strony rozcięcia. Potrzebne są też odstępy między wyspami i rozszerzenie koloru poza ich brzegi, aby filtrowanie tekstury nie podbierało obcych kolorów. Ukrycie szwu z tyłu przedmiotu pomaga, ale nie zastępuje poprawnego przygotowania tekstury.

## 📏 Oddziel rozciągnięcie od ilości pikseli

Spójrz na trzy warianty tej samej głowicy. Obraz checkera, model i kierunek patrzenia są takie same; zmieniają się tylko UV.

![A: regularna kratka, B: mniej pikseli bez zmiany proporcji, C: kierunkowe rozciągnięcie](/public/courses/blender/Images/uv-zasady-piksele.png)

**A: punkt odniesienia.** Drobne pola na środkowej ścianie są kwadratowe i mają zbliżony rozmiar.

**B: mniej miejsca na obrazie.** UV zmniejszono dwukrotnie w obu osiach. Pola nadal są kwadratami, ale na tej samej powierzchni mieści się ich mniej. Spadła gęstość tekseli: dostępnych pikseli na centymetr modelu. Wyspa zajmuje cztery razy mniejszą powierzchnię obrazu. Drobny napis lub rysa może już nie dostać wystarczającej liczby pikseli, mimo regularnej kratki.

**C: rozciągnięcie w jednym kierunku.** UV zmniejszono tylko w jednej osi. Pola stały się prostokątami. Namalowane kółko również zmieniłoby proporcje. Samo zwiększenie rozdzielczości obrazu nie naprawi tej deformacji.

Oceniaj kratkę na ścianie widzianej możliwie prostopadle. Na skośnej powierzchni kwadrat może wyglądać na zwężony przez kierunek patrzenia, nawet przy wiernym UV.

## 🎯 Przydziel szczegół tam, gdzie będzie oglądany

Teksel to piksel tekstury. Gęstość tekseli opisuje, ile takich pikseli przypada na jednostkę długości powierzchni modelu. Przy tym samym obrazie większa wyspa UV daje więcej pikseli swojemu fragmentowi modelu.

| Odcinek powierzchni modelu | Odpowiadający odcinek na teksturze | Gęstość |
| --- | --- | --- |
| 1 m | 256 pikseli | 256 px/m |
| 10 cm | 256 pikseli | 2560 px/m |

Drugi fragment dostał dziesięć razy więcej pikseli na centymetr. **Duży element nie musi być rozmazany, a mały ostry. Decyduje przydział miejsca na teksturze względem rozmiaru powierzchni i potrzebnego szczegółu.**

Dla młotka zaczniemy od podobnej gęstości na obu częściach. W postaci oglądanej blisko twarz może dostać większą gęstość niż niewidoczny spód buta. To świadomy priorytet, nie błąd. Average Islands Scale pomaga wyrównać skalę, ale nie wie, które miejsce gracz będzie oglądał z bliska.

## ⚖️ Porównaj rozłożenia przed pakowaniem

W pierwszym rozłożeniu młotka cztery boki głowicy pozostawały jedną owijką. Po dodaniu szwów na podłużnych narożnikach dało się rozłożyć poszczególne boki wierniej.

![Mniej cięć z widocznym odkształceniem i dodatkowe cięcia poprawiające kratkę](/public/courses/blender/Images/uv-glowica-porownanie.png)

Tu wybierzemy dodatkowe szwy: biegną po narożnikach, a poprawiają odwzorowanie płaskich ścian. Na policzku rozcięcie przez środek widocznej powierzchni utrudniłoby zachowanie ciągłości skóry. To inny koszt tej samej decyzji.

Zanim zapakujesz wyspy, sprawdź kolejno: gdzie potrzebujesz ciągłości wzoru, gdzie checker ujawnia deformację i czy ważne fragmenty dostały wystarczająco dużo miejsca. Dopiero potem układaj wyspy w dostępnej przestrzeni, zachowując odstępy. Pack Islands rozmieszcza istniejące wyspy; nie wybiera za Ciebie szwów ani priorytetów szczegółu.

[Plik porównawczy głowicy](/public/courses/blender/Resources/mlotek-07-uv-porownania.blend) zawiera kolekcje A, B i C. W Outlinerze włączaj widoczność jednej naraz. W [następnej lekcji](/public/courses/blender/modul-1/uv-mlotka-szwy-wyspy-i-checker) przełożysz te decyzje na własne szwy i UV młotka.
