# Rejestr Źródeł i Ustaleń Technicznych – Blender 5.2.2 (AAA Game Pipeline)

## Zakres weryfikacji
- **Kurs:** Blender 5.2.2 – Tworzenie assetów i postaci do gier AAA
- **Środowisko docelowe:** Blender 5.2.2 LTS, Unreal Engine 5.4+, format FBX 2020 / glTF 2.0
- **Data weryfikacji:** 2026-10-09
- **Osoba weryfikująca:** Zespół Edukacyjny Centrum Wiedzy

---

## Źródła pierwotne i standardy branżowe

| ID | Twierdzenie / Procedura techniczna | Źródło pierwotne | Wersja / Data | Miejsce w kursie | Wynik kontroli |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-001** | **Rozdzielenie Object Mode od Edit Mode i Apply Scale:** Modyfikatory (Bevel, Solidify) oraz algorytmy UV opierają się na skali obiektu. Skalowanie w Object Mode bez `Ctrl + A -> Apply Scale` wprowadza nierównomierny współczynnik skali, powodując asymetryczne fazowanie i rozciąganie tekseli. | *Blender 5.x Reference Manual – Object Transforms & Apply Matrix* (docs.blender.org) | 2026-03 | Moduł 0, Lekcja 1 | Potwierdzone |
| **S-002** | **Standard MikkTSpace dla Normal Map w silnikach:** Unreal Engine 5 i Unity operują na standardzie MikkTSpace (16-bit Tangent Space). Wypalanie musi korzystać z tego samego algorytmu co silnik docelowy, aby uniknąć artefaktów cieniowania na łączeniach wielokątów. | *Morten S. Mikkelsen – Simulation of Wrinkled Surfaces (MikkTSpace Library)* / *Epic Games UE5 Static Mesh Documentation* | 2024 / 2026 | Moduł 3, Lekcja 3 | Potwierdzone |
| **S-003** | **Żelazna reguła Hard Edges a UV Seams:** Każda ostra krawędź cieniowania (Hard/Sharp Edge lub granica Smoothing Group) **musi** posiadać odpowiadający jej szew UV (UV Seam / rozcięcie wyspy). Brak rozcięcia na ostrej krawędzi powoduje interpolację wektora normalnego i powstawanie czarnych smug na renderze silnika. | *Polycount Technical Wiki – Normal Map Modeling & UV Splitting* / *Epic Games Developer Community* | 2025 | Moduł 3 / Moduł 4 | Potwierdzone |
| **S-004** | **Standaryzacja Texel Density:** W środowiskach gier AAA gęstość tekseli musi być stała w ramach klasy assetu (np. 10.24 px/cm dla broni pierwszoosobowej, 5.12 px/cm dla otoczenia, 20.48 px/cm dla twarzy postaci). Elementy o tej samej skali fizycznej muszą mieć proporcjonalną powierzchnię na mapie UV. | *Leonardo Iezzi – Texel Density in Modern Video Games Pipeline* / *GDC Production Guides* | 2024 | Moduł 4, Lekcja 2 | Potwierdzone |
| **S-005** | **Pakowanie kanałów tekstur (Channel Packing / ORM):** Optymalizacja VRAM wymaga łączenia masek w jeden plik tekstury: Kanał R = Ambient Occlusion, Kanał G = Roughness, Kanał B = Metallic. Format kompresji BC7 / DXT1. | *Unreal Engine PBR Material Specifications* / *Substance 3D PBR Guide* | 2025 | Moduł 4, Lekcja 3 | Potwierdzone |
| **S-006** | **Topologia mimiczna (Facial Loops):** Pętle wielokątów wokół oczodołów (*orbicularis oculi*) i ust (*orbicularis oris*) muszą tworzyć koncentryczne pierścienie, połączone fałdem nosowo-wargowym (*nasolabial fold*). Układ ten zapobiega zniekształceniom mimiki przy animacji FACS / blendshape'ach. | *Hippydrome – Art of Moving Points & Facial Articulation* / *Polycount Topology Compendium* | 2024 | Moduł 6, Lekcja 1 | Potwierdzone |
| **S-007** | **Siatka stawów zawiasowych i obrotowych:** Zgięcia kolan i łokci wymagają 3-pętlowego układu podtrzymującego masę (zwiększona gęstość po stronie rozciąganej, redukcja po stronie ściskanej), co zapobiega utracie objętości (volume collapse) podczas animacji. | *Character Art in Games – AAA Deformation Topology Guidelines* | 2025 | Moduł 6, Lekcja 2 | Potwierdzone |
| **S-008** | **Kości skręcające (Twist Bones) w szkielecie:** Szkielet zgodny z Unreal Engine 5 wymaga kości skręcających (np. `lowerarm_twist_01`, `thigh_twist_01`) do rozkładania rotacji wzdłużnej kończyny, co eliminuje efekt „zwijania cukierka” (*candy-wrapper artifact*) przy obrocie nadgarstka i kostki. | *Epic Games UE5 Skeletal Mesh & Control Rig Standard Documentation* | 2026 | Moduł 7, Lekcja 1 | Potwierdzone |
| **S-009** | **Siatki kolizji UCX i orientacja osi przy eksporcie:** Unreal Engine wymaga prefiksu `UCX_NazwaAssetu_XX` dla kolizji wypukłych (Convex Hull). Układ współrzędnych przy eksporcie FBX: Oś główna w przód = `-Y Forward`, oś pionowa = `Z Up`, jednostka sceny = `Metric / Centimeters` (Unit Scale 0.01 w Blenderze). | *Epic Games Static Mesh FBX Pipeline Standard* | 2026 | Moduł 7, Lekcja 3 | Potwierdzone |

---

## Praktyczne procedury badawcze i weryfikacja błędów

| ID | Badany problem / Antywzorzec | Procedura testowa w Blenderze 5.2.2 | Rezultat negatywny (Błąd metodyki) | Rozwiązanie produkcyjne (PRO) |
| :--- | :--- | :--- | :--- | :--- |
| **T-001** | **Brak `Apply Scale` przed Bevel** | Przeskalowanie sześcianu w Object Mode ($S_X=3, S_Y=1, S_Z=1$), wejście w Edit Mode, dodanie `Ctrl + B` (Bevel). | Fazowanie jest rozciągnięte w osi X (nie tworzy kąta 45°). | Wywołanie `Ctrl + A -> Scale` w Object Mode przed operacjami na siatce. |
| **T-002** | **Wypalanie bez Cage przy twardych krawędziach** | Wypalenie Normal Mapy z High-Poly na Low-Poly o ostrych kątach 90° bez klatki ekstrudowanej (`Cage`). | Powstanie czarnych przerw (seams) i przesunięć krawędzi wzdłuż szwów. | Stworzenie dopasowanego obiektu Cage (`Alt + S` po normalnych) i rzutowanie promieni ortogonalnie. |
| **T-003** | **Automatyczny Remesh na zgięciach stawów** | Użycie Voxel Remesh na zgiętej ręce i próba animacji kością. | Pęknięcia siatki, zniekształcenia tekstury, zapadanie się geometrii wewnątrz stawu. | Ręczna retopologia z zachowaniem 3 pętli wspierających na stawie łokciowym i kolanowym. |

---

## Słownik i standardy nazewnictwa w pipeline

- **High-Poly (HP):** Model wysokopoligonowy z kompletem detali geometrycznych (mikrofazy, przetłoczenia, pory skóry).
- **Low-Poly (LP):** Zoptymalizowana siatka docelowa o minimalnej liczbie wielokątów niezbędnej do utrzymania sylwetki w grze.
- **Cage:** Kopia siatki Low-Poly równomiernie powiększona wzdłuż wektorów normalnych, kontrolująca zasięg promieni wypalających (Ray Distance).
- **Texel Density (TD):** Liczba pikseli przypadająca na centymetr kwadratowy powierzchni w świecie 3D ($px/cm$).
- **ORM Texture:** Skompresowana tekstura wielokanałowa (R=Occlusion, G=Roughness, B=Metallic).
- **Deformation Loops:** Pętle krawędzi zorientowane wzdłuż linii kompresji i naciągu mięśni.
- **Twist Bone:** Dodatkowa kość pomocnicza w szkielecie rozpraszająca rotację osiową.
