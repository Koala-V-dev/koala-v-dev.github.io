# UV - jak wybierać cięcia i dzielić piksele

Trzonek ma już brązowy materiał, ale jego powierzchnia wszędzie wygląda tak samo. Słoje wymagają zmiennego wzoru. Możemy odczytać go z obrazu, jeśli określimy, który fragment obrazu ma trafić na każdą część modelu. Ten układ przypisania to **mapa UV**.

Zanim rozłożysz młotek w Blenderze, przyjrzyj się kilku gotowym porównaniom. Pozwolą ci zrozumieć, gdzie poprowadzić cięcia, co sprawdzać kolorową kratką i jak przydzielić miejsce na szczegóły. W kolejnej lekcji wykonasz te operacje na swoim modelu.

## 🗺️ Odczytaj związek obrazu z modelem

**Model** określa kształt, a materiał sposób reagowania powierzchni na światło. Tekstura pozwala zmieniać właściwości materiału w poszczególnych miejscach, np. narysować ciemny napis na jasnym trzonku.

Teksturą może być zapisany obraz albo wzór obliczany przez Blender, np. szum tworzący plamki. Taki obliczany wzór nazywamy teksturą proceduralną.

Spójrz na bok głowicy po prawej: widać na nim kolejno pola A4, B4, C4 i D4. Po lewej odnajdziesz je pod długą wyspą w dolnej części obrazu. Jej obrys określa, który fragment kratki trafia na ten bok. Gdybyś przesunął tę wyspę o kolumnę w prawo, na głowicy pojawiłyby się pola A5, B5, C5 i D5. Kształt głowicy pozostałby taki sam.

![Rozłożone ściany głowicy na obrazie oraz odpowiadający im wzór na modelu](/public/courses/blender/Images/uv-zasady-wyspy.png)

Kratka to **checker**, obraz kontrolny podłączany do materiału. Znamy kształt jego pól, więc po nałożeniu na model widzimy, gdzie wzór się rozciąga lub ściska. Litery pomagają odnaleźć odpowiadające sobie miejsca w obu widokach. Tego samego rozłożenia UV można później użyć do odczytania obrazu drewna albo metalu.

Połączony fragment rozłożenia nazywamy **wyspą UV**. Może obejmować jedną ścianę albo większy obszar modelu. Wyspy rozmieszczasz na obrazie, którego kierunki oznaczamy jako U i V: poziomy i pionowy.

Cały obraz mieści się w zakresie od `0` do `1` w obu osiach UV, niezależnie od liczby jego pikseli. Środek obrazu ma UV `(0.5, 0.5)` zarówno przy rozdzielczości 1024 × 1024, jak i 2048 × 2048.

Ten sam układ UV może służyć do odczytywania osobnego obrazu koloru i osobnego obrazu chropowatości. Oba trafią w te same miejsca modelu. To pozwala umieścić na drewnie plamę, która jednocześnie zmienia barwę i połysk.

## ✂️ Otwórz powierzchnię w odpowiednich miejscach

Spójrz na trzonek jak na papierową owijkę. Jego boki tworzą zamknięty obwód, więc do rozłożenia potrzebują podłużnego otwarcia. Końcówki można oddzielić, aby rozłożyły się obok pasa bocznego. Właśnie taki podział pokazują czerwone krawędzie na zrzucie.

![Podłużny szew otwierający boki trzonka oraz szwy oddzielające obie końcówki](/public/courses/blender/Images/uv-szwy-trzonek.png)

Te krawędzie oznaczamy jako **szwy UV**. Podczas operacji **Unwrap** Blender rozkłada powierzchnię zgodnie z podziałem. Siatka 3D zachowuje połączone ściany, a ich brzegi w UV mogą zajmować różne miejsca na obrazie. Jedna krawędź modelu odpowiada wtedy dwóm oddzielnym brzegom wysp.

Gdy planujesz szwy na nowym modelu, najpierw rozpoznaj jego części. Bok prostego walca potrzebuje otwarcia wzdłuż i oddzielenia denek. Pudełko można otworzyć jak karton, pozostawiając część ścian połączoną. W obłym uchwycie wygodnie zachować ciągły obszar chwytu, a cięcie poprowadzić po mniej widocznej stronie.

Po oznaczeniu szwów wykonujesz Unwrap. Blender oblicza położenie ścian w UV, pozostawiając połączone te brzegi, których nie rozdzieliłeś. Gdy zmienisz szwy, ponowne Unwrap obliczy nowe rozłożenie. Dopiero na tym wyniku oceniasz, czy wybrany podział wystarczył.

## 🔨 Popraw podział, gdy sąsiednie ściany się ograniczają

Głowica młotka ma płaskie boki, ale zwęża się przy końcach. Połączone w jedną owijkę ściany utrudniają sobie rozłożenie: ich brzegi muszą pozostać razem, choć poszczególne trapezy potrzebują innego układu. Na górnym obrazie widać, jak wygina się przez to kratka.

![U góry boki głowicy połączone w jedną owijkę, u dołu rozłożone osobno po dodaniu szwów na narożnikach](/public/courses/blender/Images/uv-glowica-porownanie.png)

Po dodaniu szwów na podłużnych narożnikach każdy bok może rozłożyć się niezależnie. Kratka na dolnym obrazie zachowuje proporcje znacznie lepiej. Wyspy dopasowują się do kształtów ścian, więc zwężający się bok zachowuje trapezowy obrys w UV.

Gdybyś wyprostował zwężenie takiej wyspy do prostokąta, węższy koniec głowicy musiałby odczytywać równie szeroki pas obrazu jak jej środek. Wzór ścisnąłby się na końcu. Dlatego przy płaskim boku zachowujesz w UV jego proporcje i zwężenia. Prostokątna wyspa pasuje do prostokątnej powierzchni.

Jeśli rozłożenie jednej płaskiej części wyraźnie psuje sąsiednią, sprawdź podział na ich wspólnej krawędzi. Po zmianie szwów ponownie wykonujesz Unwrap i porównujesz to samo miejsce na modelu. Nowy szew warto zachować wtedy, gdy usuwa widoczne ściśnięcie, a wzór na granicy części da się dopasować.

## ⚖️ Rozłóż odkształcenia na obłej powierzchni

Bok prostego walca można po jednym cięciu rozwinąć w prostokąt, bo zakrzywia się tylko wokół obwodu. Policzki, czoło i nos tworzą powierzchnię zakrzywioną w wielu kierunkach. Przy rozpłaszczaniu taki płat musi się miejscami rozciągnąć albo ścisnąć. Podobny problem wystąpi na metalowej kuli.

Dlatego jedna duża wyspa obejmująca twarz będzie miała odkształcenia. Możesz zmieniać ich rozkład albo dodać cięcia, żeby mniejsze płaty rozłożyły się swobodniej. Każde kolejne cięcie tworzy jednak brzegi obrazu do dopasowania i wymaga odstępu między wyspami.

Na poniższym fragmencie półkuli widać dwa możliwe wyniki. Lewy układ lepiej zachowuje lokalne proporcje wzoru, kosztem zmiennej skali na powierzchni. Prawy przydziela podobną ilość obrazu podobnym powierzchniom w 3D, kosztem proporcji pól. Model, obraz i ujęcie są w obu przypadkach takie same.

![Ten sam fragment półkuli: po lewej odwzorowanie zachowujące lokalne kąty, po prawej względną powierzchnię](/public/courses/blender/Images/uv-polkula-fragment.png)

Na obłej powierzchni sprawdzaj małe pola kratki w obrębie jednego fragmentu, np. policzka. Duże pole z literą może przechodzić przez bok nosa i policzek, więc obejmuje kilka różnych kierunków powierzchni. Jego wygięcie samo w sobie niewiele mówi o jakości UV. Najpierw obróć model tak, by patrzeć możliwie na wprost ocenianego miejsca. Tak ograniczysz zwężenie wzoru wynikające z kąta patrzenia.

Potem porównaj szerokość i wysokość drobnych pól oraz ich rozmiar na sąsiednich fragmentach. Pola podobne do kwadratów, które stopniowo zmieniają wielkość, wskazują głównie zmianę przydziału pikseli. Długie, wąskie pola ujawniają rozciągnięcie w jednym kierunku. Szczególnie uważaj na nagłe przejście od regularnej kratki do ciasnego pasma przy nozdrzu lub kąciku ust: tam szczegół może stracić ostrość.

Na głowicy można było rozdzielić płaskie boki i prawie usunąć ten problem. Na głowie oceniasz, gdzie pozostawić łagodne odkształcenie, żeby zachować ciągłość skóry. Drobna kratka pomaga znaleźć miejscowe ściśnięcia także wtedy, gdy duże litery wyglądają na całej twarzy krzywo.

Planując UV głowy, zachowaj oba policzki, nos i czoło w jednym płacie, a otwarcie poprowadź z tyłu, od szyi ku czubkowi. Po rozłożeniu sprawdź okolice oczu, nosa i ust. Jeżeli przy połączeniu ucha z głową powstaje mocne ściśnięcie, spróbuj wydzielić ucho szwem u jego nasady i rozłożyć je osobno. Jeśli szyja ciągnie rozłożenie twarzy w długi, wąski fragment, porównaj wynik po oddzieleniu jej od głowy.

Po każdej takiej próbie wróć do tych samych miejsc z checkerem. Zachowaj zmianę, która poprawia problematyczny obszar bez pogorszenia ważniejszych części. Unikaj dzielenia policzka na drobne wyspy tylko po to, żeby wyprostować każdą kratkę: granice tych wysp przecinałyby widoczną skórę, a odstępy zabierałyby miejsce na jej szczegóły.

## 🎨 Przygotuj miejsce na potrzebne szczegóły

Tekstura skóry pokazuje, dlaczego ciągłość twarzy jest przydatna. Brwi, usta i zarost na płaskim obrazie mają układ dopasowany do UV tego modelu. Po odczytaniu obrazu trafiają na swoje miejsca, a oba policzki mają osobne miejsca na obrazie.

Pieprzyk namalowany na jednym policzku pojawi się tylko na nim. Gdy obie połowy twarzy współdzielą ten sam fragment obrazu, dostają też te same namalowane szczegóły.

![Pełna tekstura koloru skóry obok głowy korzystającej z tego obrazu](/public/courses/blender/Images/uv-twarz-tekstura-model.png)

Na tym samym obrazie poniżej widać krawędzie UV. Odszukaj obszar nosa i ust: trójkąty wskazują, z których miejsc obrazu korzystają ich ściany. Gęsta siatka wokół ust opisuje kształt modelu. Przydział pikseli zależy od powierzchni, którą te trójkąty zajmują na obrazie.

![Ten sam obraz skóry z nałożonymi krawędziami UV oraz model odczytujący go w Blenderze](/public/courses/blender/Images/uv-twarz-uklad-model.png)

Zwróć uwagę na różnicę między tym obrazem a checkerem. Kratka ma z góry ustalone, regularne pola. Obraz skóry przygotowano pod konkretne UV: po lewej rysy twarzy są rozłożone tak, aby po nałożeniu odtworzyły właściwy wygląd po prawej. Malując po modelu 3D, prowadzisz pędzel po policzku, a program zapisuje ślad w odpowiadających mu miejscach obrazu. Ślad na płaskim obrazie może przez to mieć inne proporcje.

Tak można dopasować wygląd skóry do rozłożenia, ale nadal trzeba zapewnić jej miejsce na szczegół. Jeżeli na szerokość znamienia przypadają zaledwie dwa piksele, dokładniejszy ruch pędzla nie doda kolejnych. Z tego powodu oprócz kształtu pól checkera oceniasz też ich wielkość.

Przy zbliżeniach twarz powinna dostać więcej miejsca niż jednolity, rzadko widoczny spód popiersia. Gdy zaczyna brakować przestrzeni na obrazie, zmniejsz wyspę spodu i przeznacz odzyskane miejsce na twarz. Podobnie napis na małej tabliczce może wymagać większej gęstości niż duży bok skrzyni. **Wielkość wysp dobierasz do potrzebnego detalu i sposobu oglądania modelu.**

Powiększając całą wyspę, zachowuj jej proporcje. Dwukrotnie większa szerokość i wysokość daje cztery razy więcej miejsca na piksele, więc ten przydział odbywa się kosztem pozostałych części. Ostatecznie sprawdź detal z odległości, z której model ma być oglądany w grze. To pozwala ocenić, czy dodatkowe miejsce poprawia coś, co gracz rzeczywiście zobaczy.

Model i obraz: Lee Perry-Smith / Infinite-Realities, [pliki źródłowe](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/LeePerrySmith), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

## 📏 Rozpoznaj, którą zmianę wykonać

Poniżej trzy warianty tej samej głowicy z tym samym obrazem. W B zmniejszono UV w obu osiach, a w C tylko w jednej. Porównaj, co stało się z polami wzoru.

![A: punkt odniesienia; B: mniej miejsca na obrazie przy zachowanych proporcjach; C: wydłużony wzór po ściśnięciu UV w jednej osi](/public/courses/blender/Images/uv-zasady-piksele.png)

W B kratki zachowują kształt, ale jest ich mniej na tej samej powierzchni. Powiększenie wyspy przydzieli głowicy większy fragment obrazu i pozwoli zmieścić drobniejszy detal. W C trzeba poprawić proporcje UV: zwiększenie rozdzielczości dałoby tylko więcej pikseli do narysowania wydłużonego wzoru.

Piksel tekstury to **teksel**. Gęstość tekseli mówi, ile pikseli przypada na jednostkę długości powierzchni modelu. Jeśli 10 cm trzonka otrzyma 100 pikseli, ma 10 pikseli na centymetr. Przy 200 pikselach ma ich 20 na centymetr.

Przy tym samym obrazie checkera większe pola na modelu oznaczają mniej pikseli na centymetr. Dlatego porównując części modelu, korzystasz z jednej kratki o niezmienionej skali w materiale.

Własne rozłożenie poprawiaj według objawu:

| Co widzisz na modelu?                                                             | Co zmienić w UV?                                                                                      |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Pola zachowują proporcje, ale na ważnym detalu są dużo większe niż obok.          | Powiększ całą wyspę tego detalu i odzyskaj miejsce na mniej ważnych częściach.                        |
| Cała płaska powierzchnia ma pola wydłużone w jednym kierunku.                     | Przywróć wyspie proporcje powierzchni. Sprawdź, czy jej zwężenia nie zostały wymuszone do prostokąta. |
| Tylko przy przewężeniu lub nasadzie występuje ciasne pasmo zdeformowanych pól.    | Sprawdź podział w tym miejscu. Porównaj rozłożenie po dodaniu szwu uwalniającego tę część.            |
| Pola na obłej powierzchni zmieniają się łagodnie, a szczegóły pozostają czytelne. | Oceń ciągłość wzoru i przydział pikseli przed dodaniem następnych cięć.                               |

Na młotku zaczniemy od zbliżonej gęstości na drewnie i stali. Przy postaci priorytet można nadać twarzy. Sam równo wypełniony kwadrat UV nie pokaże, czy podział miejsca odpowiada tym potrzebom.

## 🧵 Połącz wzór na brzegach wysp

Oddzielne wyspy nadal spotykają się na modelu. Na schemacie żółte brzegi odpowiadają jednemu narożnikowi, więc punkt `1` łączy się z `1`, a `2` z `2`. Niebieski pas przechodzi przez narożnik płynnie, gdy dochodzi do obu brzegów na odpowiadającej sobie wysokości.

![Dopasowany i przesunięty pas na oddzielnych wyspach oraz wynik na wspólnym narożniku modelu](/public/courses/blender/Images/uv-szew-dopasowanie.svg)

Dolny wariant pokazuje koszt niedopasowania: pas urywa się i zaczyna ponownie niżej. W ten sam sposób może pojawić się granica koloru skóry albo połysku. Umieszczenie szwu z tyłu modelu ułatwia ukrycie przejścia, a malowanie po powierzchni 3D pomaga dopasować jego strony.

## 📦 Ułóż przygotowane wyspy

Głowica i trzonek mogą pozostać osobnymi obiektami, korzystając ze wspólnego obrazu. Ich wyspy zajmują wtedy różne obszary tej tekstury.

Po sprawdzeniu rozłożenia i ustaleniu skali części możesz je spakować. Zachowaj osobne miejsce dla powierzchni, na których chcesz malować różne szczegóły. Nakładające się wyspy będą odczytywać ten sam fragment obrazu, co przydaje się przy identycznych częściach, lecz ogranicza różnicowanie ich wyglądu.

Zostaw też odstępy między wyspami. Podczas malowania lub wypalania tekstury trzeba wypełnić je przedłużeniem koloru znad brzegu wyspy. Dzięki temu przy filtrowaniu i pomniejszaniu obrazu do powierzchni nie zacznie przenikać kolor sąsiedniej części. Samo odsunięcie wysp pozostawia tylko miejsce na taki zapas.

Pakując wyspy, zachowaj ich wzajemną skalę ustaloną według ważności detalu. Po ułożeniu wróć do modelu i sprawdź ważne miejsca z checkerem, a potem z właściwym obrazem. Zmiana UV po namalowaniu skóry lub słojów przesunie odczytywany wzór względem modelu. Dlatego rozłożenie i przydział pikseli przygotowujesz przed szczegółowym teksturowaniem.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Szwy dobieraj do powierzchni.** Otwórz zamknięte obwody i oddziel części, które utrudniają sobie rozłożenie.
- **Po Unwrap sprawdzaj skutek na modelu.** Płaski bok może zachować swój kształt, a ciągły obły płat wymaga rozłożenia odkształceń.
- **Dobierz poprawkę do objawu.** Zmiana proporcji UV wpływa na kształt wzoru, a wielkość wyspy na przydział pikseli.
- **Pakuj po ustaleniu priorytetów.** Ważny detal, ciągłość wzoru i widoczność części decydują o ich miejscu na teksturze.
