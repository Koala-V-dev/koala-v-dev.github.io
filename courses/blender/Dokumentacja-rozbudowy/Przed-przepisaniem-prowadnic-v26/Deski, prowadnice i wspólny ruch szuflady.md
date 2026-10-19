# Deski, prowadnice i wspólny ruch szuflady

Szuflada potrzebuje oparcia: prowadnice osadzone na wspornikach pod blatem będą podtrzymywać jej dno, a listwy na bokach korpusu wyznaczą tor wysuwania. Najpierw przebudujemy blat na deski, potem zamocujemy prowadnice i połączymy ruchome części przez parenting.

Otwórz `stol_v03.blend` albo [wynik poprzedniej lekcji](/public/courses/blender/Resources/stol-06-uchwyt.blend). Zapisz jako `stol_v04.blend`.

## 🪵 Zastąp jednolitą płytę deskami

W Object Mode zaznacz tylko `Blat` i usuń go poleceniem Object → Delete lub <kbd>X</kbd>. W jego miejscu powstanie pięć desek o tej samej łącznej szerokości i grubości co poprzedni blat.

Dodaj Cube `Deska_blatu_01`. Ustaw Dimensions `(2, 0.196, 0.08) m`, Location `(0, -0.402, 0.86) m` i zastosuj Scale. W Edit Mode zaznacz wszystkie krawędzie i wykonaj znane już Bevel: szerokość `0.005 m`, 2 segmenty. Wróć do Object Mode.

Powiel deskę przez Duplicate Objects: <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>D</kbd></span>, <kbd>Y</kbd>, `0.201`, <kbd>Enter</kbd>. Między deskami zostaje 5 mm szczeliny. Od razu użyj trzykrotnie Repeat Last, <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>R</kbd></span> (także w menu Edit). Każde powtórzenie dodaje następną kopię z tym samym przesunięciem.

![Pięć desek zamiast jednolitej płyty blatu](/public/courses/blender/Images/ruch-deski.png)

Powinno być pięć desek, nie sześć. Ich środki w osi Y to `-0.402`, `-0.201`, `0`, `0.201`, `0.402 m`. Wszystkie pozostają na wysokości Z = `0.86 m`. Pierwszej nie przesuwaj w osi X: jej środek posłuży za odniesienie symetrii prowadnic.

## 🧱 Podwieś wsporniki pod blatem

Dodaj Cube `Wsporniki_prowadnic`: Dimensions `(0.04, 0.60, 0.20) m`, Location `(0.435, -0.09, 0.72) m`. Zastosuj Scale.

To pionowa deska po prawej stronie korpusu szuflady. Jej górna powierzchnia dochodzi do spodu blatu na Z = `0.82 m`. Między wspornikiem a bokiem szuflady zostaje 1.5 cm na prowadnicę i listwę ruchomą.

Dodaj Mirror, pozostaw tylko oś X, a jako Mirror Object wskaż `Deska_blatu_01`. Dostaniesz drugi wspornik po lewej. Odbicie zależy tutaj od płaszczyzny X = 0; przesunięcie deski wzdłuż Y jej nie zmienia.

Zaznacz wsporniki, korpus i front, a następnie włącz Local View, żeby obejrzeć miejsce na prowadnice.

![Wsporniki po obu stronach korpusu, z pozostawionym miejscem na prowadnice](/public/courses/blender/Images/ruch-wsporniki.png)

## 🛤️ Złóż nieruchome prowadnice

Wyłącz Local View. Prowadnica będzie miała przekrój litery L: pionowy bok mocowany do wspornika i poziomą półkę pod dnem szuflady. Utwórz dwa obiekty według tabeli. Dla każdego zastosuj Scale i dodaj Mirror w osi X względem `Deska_blatu_01`.

| Obiekt | Dimensions X, Y, Z [m] | Location X, Y, Z [m] |
| --- | --- | --- |
| `Boki_prowadnic` | `0.01, 0.58, 0.08` | `0.410, -0.10, 0.65` |
| `Polki_prowadnic` | `0.03, 0.58, 0.01` | `0.400, -0.10, 0.615` |

Bok prowadnicy dochodzi do wewnętrznej powierzchni wspornika. Górna powierzchnia poziomej półki leży na Z = `0.62 m`, dokładnie pod spodem korpusu. Te części mają zostać przy stole podczas wysuwania szuflady.

Obejrzyj same wsporniki i obie części prowadnic w Local View. Na zbliżeniu 1 oznacza wspornik, 2 pionowy bok prowadnicy, a 3 półkę podtrzymującą dno.

![Nieruchome prowadnice z widocznym przekrojem L i podparciem](/public/courses/blender/Images/ruch-prowadnice.png)

## ↔️ Dodaj listwy poruszające się z korpusem

Wyłącz Local View. Dodaj `Listwy_szuflady`: Dimensions `(0.005, 0.58, 0.05) m`, Location `(0.4025, -0.10, 0.65) m`. Zastosuj Scale. Tym razem w Mirror jako obiekt odniesienia wybierz Korpus_szuflady, również tylko z osią X.

Listwy przylegają do zewnętrznych boków korpusu i mieszczą się między nim a nieruchomymi bokami prowadnic. Są częścią szuflady, dlatego muszą poruszać się z nią, a nie ze wspornikami. W Local View obejrzyj korpus, listwy i prowadnice; górny otwór szuflady nadal pozostaje wolny.

![Listwy boczne korpusu osadzone w prowadnicach](/public/courses/blender/Images/ruch-listwy.png)

To prosty układ ślizgowy o częściowym wysuwie. Nie jest prowadnicą teleskopową: przy otwarciu część długości szuflady musi pozostać na podparciu.

## 🔗 Ustaw rodzica ruchomych części

Wyłącz Local View. Odznacz wszystko. W Outlinerze z przytrzymanym <kbd>Ctrl</kbd> zaznacz `Front_szuflady`, `Mocowania_uchwytu`, `Poprzeczka_uchwytu` i `Listwy_szuflady`. `Korpus_szuflady` zaznacz jako ostatni, także z <kbd>Ctrl</kbd>. Ostatnio wybrany obiekt jest aktywny: to on zostanie rodzicem pozostałych zaznaczonych części.

Przenieś kursor nad widok 3D i wybierz Object → Parent → Object (Keep Transform) albo <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>P</kbd></span> → Object (Keep Transform). Części mają pozostać na dotychczasowych miejscach.

![Hierarchia szuflady: korpus jest rodzicem czterech obiektów](/public/courses/blender/Images/ruch-parent.png)

**Parenting** tworzy zależność położenia, obrotu i skali. Korpus jest rodzicem, a front, mocowania, poprzeczka i listwy jego dziećmi. Przesunięcie rodzica zabiera dzieci; przesunięcie samego dziecka nie przesuwa rodzica.

Keep Transform zachowuje bieżące ustawienie części przy tworzeniu tej zależności. Siatki pozostają osobne: nie sklejamy frontu z pudełkiem i nadal możemy edytować każdą część. W Outlinerze rozwiń korpus i sprawdź cztery obiekty pod nim. Wsporniki, boki i półki prowadnic mają pozostać poza tą gałęzią.

## 🧰 Wysuń szufladę i sprawdź podparcie

Zaznacz już tylko `Korpus_szuflady`. Użyj Move: <kbd>G</kbd>, <kbd>Y</kbd>, `-0.25`, <kbd>Enter</kbd>. Front, uchwyt i listwy powinny pojechać razem z korpusem. Nieruchome prowadnice zostają pod blatem.

![Wysunięta szuflada z widocznym oparciem na prowadnicach](/public/courses/blender/Images/ruch-mechanizm.png)

Na zbliżeniu w Local View widać, że tył szuflady nadal zachodzi na prowadnice. Jeżeli wyjeżdża samo pudełko, sprawdź hierarchię brakującej części. Jeżeli jadą również wsporniki, zostały omyłkowo przypisane do korpusu: cofnij parenting i popraw zaznaczenie.

![Stół z deskami blatu i częściowo wysuniętą szufladą](/public/courses/blender/Images/ruch-wynik.png)

Parenting nie ogranicza ruchu do prowadnic i nie sprawdza kolizji. Blender pozwoli przesunąć korpus przez blat albo poza podparcie. Tutaj położenie kontrolujesz ręcznie; prowadnica jest wymodelowaną konstrukcją, a nie działającą symulacją.

Zapisz projekt. Do zamknięcia wystarczy ruch korpusu o `+0.25 m` w osi Y. [Punkt kontrolny z zamkniętą szufladą](/public/courses/blender/Resources/stol-07-prowadnice.blend) i [wynik z wysuniętą szufladą](/public/courses/blender/Resources/stol-08-szuflada-otwarta.blend) mają tę samą hierarchię i prowadnice.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Kolekcja porządkuje części, a parenting wiąże ich transformacje. Do rodzica szuflady przypisuj części ruchome; prowadnice i wsporniki pozostaw przy stole. Sprawdź zależność przez ruch korpusu, nie sam wygląd hierarchii.
