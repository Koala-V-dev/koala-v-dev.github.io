# Młotek - siatka, Bevel i oddzielny asset

Otwórz swój stół albo [projekt z poprzedniej lekcji](/public/courses/blender/Resources/stol-08-szuflada-otwarta.blend). Przez <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Save As</kbd> zapisz kolejną wersję jako `stol_v05.blend`.

## 🗂️ Zrób miejsce na młotek

W Object Mode zaznacz wszystkie obiekty przez <kbd>A</kbd>. Naciśnij <kbd>M</kbd>, wybierz <kbd class="win-menu-btn">New Collection</kbd>, wpisz `Stol_warsztatowy` i potwierdź. W Outlinerze obiekty stołu znajdą się we wspólnej kolekcji. Zależności szuflady pozostaną zachowane.

**Kolekcja** porządkuje obiekty. Możesz ukryć cały stół jednym kliknięciem, ale samo umieszczenie części w kolekcji nie sprawia, że poruszają się razem. Za wspólny ruch nadal odpowiada parenting.

Kliknij oko przy `Stol_warsztatowy`, aby ukryć stół. Następnie dodaj kostkę przez <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> → <kbd class="win-menu-btn">Mesh</kbd> → <kbd class="win-menu-btn">Cube</kbd>. Nazwij ją `Trzonek`.

Z zaznaczonym trzonkiem użyj <kbd>M</kbd> → <kbd class="win-menu-btn">New Collection</kbd> i utwórz `Mlotek`. W Outlinerze kolekcje `Mlotek` oraz `Stol_warsztatowy` mają znajdować się obok siebie pod `Scene Collection`. Jeśli kostka zniknęła po dodaniu do ukrytej kolekcji stołu, wybierz ją w Outlinerze i przenieś do `Mlotek`.

![](/public/courses/blender/Images/podział-kolekcji-na-stół-warsztatowy-i-młotek.png)

## 🪵 Nadaj trzonkowi proporcje

Zaznacz `Trzonek`. W panelu Item ustaw wymiary i położenie:

| Ustawienie | X         | Y         | Z        |
| ---------- | --------- | --------- | -------- |
| Dimensions | `0.028 m` | `0.022 m` | `0.30 m` |
| Location   | `0 m`     | `0 m`     | `0.15 m` |

Złap focus na obiekt <kbd>Numpad .</kbd>.

Trzonek ma 30 cm długości. Jego dolny koniec znajduje się na wysokości `Z = 0`, bo środek kostki podnieśliśmy o połowę jej wysokości.

Zastosuj skalę przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> → <kbd class="win-menu-btn">Scale</kbd>. Kształt pozostanie taki sam, a wartości Scale wrócą do `1`. Przy późniejszym fazowaniu szerokość fazy nie będzie rozciągana przez nierówną skalę obiektu.

Naciśnij <kbd>Tab</kbd>, aby wejść w Edit Mode. Trzonek jest jeszcze prostopadłościanem. Jeśli zwęzisz teraz jego górną ścianę, boczne ściany pochylą się na całej długości. Potrzebujesz dodatkowego przekroju, który utrzyma szerokość w środku.

Uruchom *Loop Cut and Slide* przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span>. Najedź na długą pionową krawędź. Żółty podgląd ma obiegać trzonek poziomo. Kliknij lewym przyciskiem, aby wykonać cięcie, a następnie prawym, aby anulować przesuwanie nowej pętli i pozostawić ją dokładnie pośrodku.

![Pozioma pętla dzieli trzonek w połowie wysokości](/public/courses/blender/Images/mlotek-loop.png)

Powstała **pętla krawędzi**, czyli połączony ciąg krawędzi biegnący wokół trzonka. Każda boczna ściana została podzielona na dwie. Środkowy przekrój może teraz zachować szerokość, gdy zmienisz końce.

To praktyczna zmiana _**topologii**_: sposobu połączenia wierzchołków, krawędzi i ścian. Dodajesz podział tam, gdzie potrzebujesz kontroli nad kształtem.

Przejdź do wyboru ścian klawiszem <kbd>3</kbd> nad literami. Odznacz wszystko i wybierz tylko górną ścianę trzonka. Wykonaj <kbd>S</kbd>, <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Z</kbd></span>, `0.7`, <kbd>Enter</kbd>.

Podczas skalowania <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Z</kbd></span> wyklucza oś Z. Przekrój zwęża się w X i Y do 70% początkowego rozmiaru, a wysokość nie zmienia się. Środkowa pętla pozostaje na miejscu, więc zwęża się tylko górna połowa trzonka.

Obróć widok od spodu. Odznacz górną ścianę i wybierz dolną. Powtórz tę samą operację z wartością `0.85`. Dolny koniec ma być zwężony słabiej niż górny.

![Trzonek zachowuje największy przekrój pośrodku i zwęża się ku obu końcom](/public/courses/blender/Images/mlotek-trzonek.png)

Obejrzyj sylwetkę z przodu i z boku. Najszersze miejsce powinno wypadać przy dodanej pętli. Jeśli zwęził się cały trzonek, cofnij operację i sprawdź, czy zaznaczona była tylko ściana na końcu.

## 🔨 Wyciągnij oba końce głowicy

Wróć do Object Mode. Dodaj kostkę i nazwij ją `Glowica`. Przenieś ją do kolekcji `Mlotek`, jeśli trafiła do innej.

| Ustawienie | X         | Y        | Z         |
| ---------- | --------- | -------- | --------- |
| Dimensions | `0.065 m` | `0.04 m` | `0.045 m` |
| Location   | `0 m`     | `0 m`    | `0.30 m`  |

Zastosuj Scale. Górny koniec trzonka powinien wchodzić w środek głowicy. To miejsce mocowania, więc części mają się tu stykać i częściowo zachodzić na siebie.

Wejdź w Edit Mode i włącz wybór ścian. Odznacz wszystko. Wybierz końcową ścianę po stronie ujemnego X i wykonaj <kbd>E</kbd>, `0.035`, <kbd>Enter</kbd>. Następnie użyj <kbd>S</kbd>, `0.9`, <kbd>Enter</kbd>.

Extrude dodaje nowy odcinek głowicy. Przy wytłaczaniu jednej ściany ruch jest domyślnie ograniczony do jej **normalnej**, czyli kierunku prostopadłego do powierzchni. Tutaj normalna jest skierowana w stronę ujemnego X. Dlatego dodatnie `0.035` wydłuża głowicę w lewo o 3.5 cm.

Odznacz tę ścianę i wybierz przeciwległą, po stronie dodatniego X. Wykonaj <kbd>E</kbd>, `0.045`, <kbd>Enter</kbd>, a potem <kbd>S</kbd>, <kbd>Y</kbd>, `0.35`, <kbd>Enter</kbd>.

Ten koniec zwężasz wyłącznie w osi Y, do 35% jego szerokości. Wysokość pozostaje bez zmian. Powstaje wąski koniec młotka, a po przeciwnej stronie zostaje szeroka powierzchnia uderzająca.

![Szeroki i wąski koniec głowicy po wytłoczeniu bocznych ścian](/public/courses/blender/Images/mlotek-glowica.png)

Obróć widok i sprawdź oba końce. Różnica szerokości ma być widoczna z góry. Jeśli zmienił się także środkowy fragment głowicy, podczas skalowania było zaznaczonych za dużo ścian.

## ✨ Sprawdź, co zmienia Bevel

Wróć do Object Mode i wybierz głowicę. W Properties otwórz zakładkę z kluczem. Kliknij <kbd class="win-menu-btn">Add Modifier</kbd>, wyszukaj `Bevel` i dodaj go.

W pierwszej lekcji fazowałeś krawędzie bezpośrednio w Edit Mode. Modyfikator **Bevel** wylicza fazy na podstawie siatki, ale pozostawia jej proste krawędzie do dalszej edycji. Możesz wrócić do ustawień bez odtwarzania modelu.

Ustaw parametry oznaczone na zrzucie:

| Numer | Parametr     | Wartość        | Co zmienia                                                                          |
| ----- | ------------ | -------------- | ----------------------------------------------------------------------------------- |
| 1     | Amount       | `0.002 m`      | Szerokość fazy, tutaj 2 mm.                                                         |
| 2     | Segments     | `3`            | Liczbę pasów ścian tworzących profil fazy.                                          |
| 3     | Limit Method | `Angle`, `30°` | Fazowanie krawędzi, przy których powierzchnia załamuje się mocniej niż zadany próg. |

![Bevel na głowicy: 1 szerokość fazy, 2 liczba segmentów, 3 ograniczenie według kąta](/public/courses/blender/Images/mlotek-bevel.png)

Zmień na chwilę Segments na `1` i przybliż narożnik. Faza jest pojedynczym płaskim pasem. Wróć do `3`: dodatkowe pasy tworzą łuk. Szerokość zajęta przez fazę pozostaje taka sama. **Segments zmienia kształt profilu i ilość geometrii, a Amount jego szerokość.**

Wyłącz i włącz ikonę monitora w nagłówku Bevel. Obserwuj obrys głowicy i jasny pas przy jej krawędziach. Ostra krawędź ustępuje małej powierzchni, na której może pojawić się odbicie światła. Zbyt duża faza zmieniłaby proporcje głowicy w obły klocek.

Na trzonku dodaj osobny Bevel. Ustaw Amount `0.003 m`, Segments `3` i Limit Method `Angle` z kątem `30°`. Większa faza łagodzi narożniki części trzymanej w dłoni.

Pozostaw oba modyfikatory włączone. Nie wybieraj <kbd class="win-menu-btn">Apply</kbd>: ustawienia mają pozostać dostępne do zmiany.

## 📍 Połóż narzędzie na stole

Czesto przez przypadek lub celowo możesz zmienić lokalizację 3D Cursora przez <kbd>Shift</kbd> + <kbd>PPM</kbd>.  

Zaznacz tylko trzonek. Wybierz <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Snap</kbd> → <kbd class="win-menu-btn">Cursor to World Origin</kbd>. Kursor 3D trafi do początku świata, gdzie znajduje się dolny koniec trzonka. Alternatywnie używając skrótu klawiszowego <kbd>Shift</kbd> + <kbd>S</kbd> i wybierając z cyrkularnego menu <kbd>Cursor to World Origin</kbd>.

![](/public/courses/blender/Images/snap-menu-coursor-world-origin.png)



Teraz wybierz <kbd class="win-menu-btn">Object</kbd> → <kbd class="win-menu-btn">Set Origin</kbd> → <kbd class="win-menu-btn">Origin to 3D Cursor</kbd>. Siatka zostanie na miejscu, a pomarańczowy punkt origin przesunie się na dół trzonka. Od tego punktu będziesz ustawiać położenie i obrót narzędzia.

Zaznacz głowicę i z <kbd>Shift</kbd> trzonek jako ostatni. Przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> wybierz <kbd class="win-menu-btn">Object (Keep Transform)</kbd>. Tak jak przy szufladzie ostatnio zaznaczony obiekt staje się rodzicem. Głowica będzie podążać za trzonkiem.

Przywróć widoczność kolekcji stołu. Odznacz wszystko i wybierz sam trzonek. W Item ustaw Rotation X `87.8°` oraz Location:

| X        | Y        | Z          |
| -------- | -------- | ---------- |
| `0.45 m` | `0.16 m` | `0.9093 m` |

![Młotek leży na blacie, oparty głowicą i końcem trzonka](/public/courses/blender/Images/mlotek-na-stole.png)

Obejrzyj młotek z boku, na wysokości blatu. Głowica jest grubsza niż trzonek, dlatego narzędzie leży lekko ukośnie. Podane położenie pasuje do wymiarów z tej lekcji. Jeśli zmieniłeś proporcje, dopasuj obrót i wysokość tak, aby młotek opierał się na blacie, zamiast wisieć nad nim lub w niego zapadać.

![Ułożenie młotka na stole warsztatowym](/public/courses/blender/Images/ułożenie-młotka-na-stole-warsztatowym.png)


W Outlinerze sprawdź dwa niezależne porządki. Kolekcja `Mlotek` zawiera części narzędzia. Po rozwinięciu `Trzonek` widać pod nim głowicę, bo jest jego dzieckiem. Stół nie jest rodzicem młotka. Zapisz projekt przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>.

![Kolekcje stołu i młotka są osobno. Głowica jest dzieckiem trzonka.](/public/courses/blender/Images/mlotek-kolekcje.png)


## 💾 Zapisz młotek jako oddzielny asset

**Asset** to element, który możesz wykorzystać ponownie w innej scenie. Młotek nie potrzebuje do tego całego stołu.

<strong>Save As zapisuje cały projekt, także obiekty ukryte i niezaznaczone.</strong> Samo zaznaczenie młotka przed zapisem nie wystarczy. Skopiuj jego dwie części do pustego projektu:

1. Zaznacz trzonek i głowicę. Sam wybór rodzica nie zaznacza dziecka (alternatywnie kliknij tylko kolekcję w Outlinerze) i <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span>.
2. Wybierz <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">New</kbd> → <kbd class="win-menu-btn">General</kbd>. W nowej scenie zaznacz domyślne obiekty przez <kbd>A</kbd> i usuń je klawiszem <kbd>X</kbd>. Potwierdź usunięcie.
3. Nad widokiem 3D wklej obiekty przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>V</kbd></span>. Sprawdź w Outlinerze, czy są trzonek i głowica oraz czy głowica nadal jest dzieckiem trzonka.
4. Obie części przenieś przez <kbd>M</kbd> do kolekcji `Mlotek`. Jeśli taka kolekcja już istnieje, wybierz ją zamiast tworzyć drugą. Pustą `Collection` możesz usunąć. *Kopiując kolekcję, tak naprawdę kopiujesz jej zawartość dlatego w nowym pliku wkleił się tylko trzonek i głowica.*

Wklejony młotek zachował położenie ze stołu. Odznacz wszystko i wybierz tylko trzonek. Użyj <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>G</kbd></span>, aby wyzerować Location, a następnie <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>R</kbd></span>, aby wyzerować Rotation. Dolny koniec trzonka wróci do początku świata, a narzędzie stanie pionowo. Głowica podąży za rodzicem.

![Oddzielny projekt: pionowy młotek i kolekcja zawierająca tylko jego części](/public/courses/blender/Images/mlotek-osobny.png)

W Properties otwórz <kbd class="win-menu-btn">Scene</kbd> → <kbd class="win-menu-btn">Units</kbd>. Upewnij się, że masz ustawiony **Unit System** `Metric` i **Unit Scale** `1`, ponieważ nowy projekt ma własne ustawienia jednostek. Zapisz go jako `mlotek_v01.blend`.

![Właściwości jednostek sceny](/public/courses/blender/Images/system-metryczny-sceny.png)


### 📥 Wczytaj narzędzie do innego projektu

Gdy zechcesz użyć młotka w innej scenie, wybierz <kbd class="win-menu-btn">File</kbd> → <kbd class="win-menu-btn">Append</kbd>. Otwórz zapisany `mlotek_v01.blend`, wejdź do <kbd class="win-menu-btn">Collection</kbd>, zaznacz `Mlotek` i zatwierdź przyciskiem <kbd class="win-menu-btn">Append</kbd>.

Wczytanie całej kolekcji zabiera obie części wraz z parentingiem. Powstaje lokalna kopia, którą możesz edytować bez zmieniania pliku źródłowego. Jeśli sprawdzasz to w scenie stołu, w której młotek już jest, to po wczytaniu będziesz mieć dwa narzędzia.

Do porównania masz [stół z młotkiem](/public/courses/blender/Resources/stol-09-mlotek.blend) i [osobny model młotka](/public/courses/blender/Resources/mlotek-01-model.blend). Do kolejnej lekcji pozostaw otwarty plik samego młotka.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Pętla krawędzi** daje dodatkowy przekrój do kształtowania siatki. Jej położenie decyduje, gdzie kończy się wpływ zwężenia.
- **Bevel** tworzy fazy. Amount określa ich szerokość, a Segments liczbę pasów budujących profil. Oceniaj wynik po obrysie i odbiciach, a nie tylko po wpisanych wartościach.
- **Kolekcja** porządkuje części, a parenting przekazuje im ruch rodzica. To osobne zadania.
- **Osobny plik assetu** powinien zawierać potrzebne części i ich zależności. Save As zachowuje całą scenę. Append pozwala wczytać kolekcję do kolejnego projektu.

| Nowy skrót                                                                                                                                                          | Kiedy go używasz                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| <kbd>M</kbd> w Object Mode                                                                                                                                          | Przenosisz zaznaczone obiekty do kolekcji.                                       |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> w Edit Mode                                                                                | Dodajesz pętlę. Lewy przycisk zatwierdza cięcie, prawy anuluje jego przesuwanie. |
| <kbd>S</kbd>, <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Z</kbd></span>                                                                             | Skalujesz w **_X_** i **Y** z wykluczeniem *Z*.                                  |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span> / <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>V</kbd></span> nad widokiem 3D | Kopiujesz i wklejasz obiekty w Object Mode.                                      |
| <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>G</kbd></span> / <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>R</kbd></span>                   | Zerujesz położenie / obrót obiektu.                                              |

| Skrót z wcześniejszych lekcji                                                    | Zastosowanie tutaj                                                |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| <kbd>Tab</kbd>, <kbd>3</kbd> nad literami                                        | Przechodzisz do Edit Mode i wyboru ścian.                         |
| <kbd>E</kbd>, <kbd>S</kbd>                                                       | Wytłaczasz końce głowicy i zmieniasz ich przekrój.                |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>A</kbd></span> → Scale | Stosujesz skalę przed fazowaniem.                                 |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span>         | Tworzysz parenting z ostatnio zaznaczonym obiektem jako rodzicem. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>         | Zapisujesz bieżący projekt.                                       |
