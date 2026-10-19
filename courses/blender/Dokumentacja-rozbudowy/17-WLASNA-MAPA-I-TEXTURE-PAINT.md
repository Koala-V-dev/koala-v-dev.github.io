# Własne mapy, przekrój i retusz

Dodano dwie pełne lekcje, w kolejności: bake między dwoma UV, następnie Texture Paint. Kontynuacja pliku 08. Plik 09 to rzeczywisty wypiek Diffuse/Color bez Direct/Indirect i Roughness do osobnych map 2048 x 2048. UV_Drewno zachowuje układ odczytu fotografii, UV_Malowanie jest zapakowanym układem docelowym. Źródłowe obrazy są jawnie przypięte do UV_Drewno podczas bake; wynikowy materiał używa aktywnego UV_Malowanie.

W pliku 10 namalowano oba przekroje drewna oraz ich chropowatość około 0.7. Native Texture Paint: Paint Hard, Paint Soft i Clone; pociągnięcia wykonano przez API Blendera. Dociągnięcie obrazu na brzegach i padding wykonano pędzlami w edytorze 2D, a retusz narożnika przez projekcyjne malowanie 3D. Próbna niebieska kreska pokazuje zapis jednego pociągnięcia przy dwóch brzegach wyspy; nie została w pliku końcowym. Bevel wyłączony wyłącznie podczas malowania, w pliku końcowym ponownie włączony. Geometria, szwy, pozycje, relacja rodzic-dziecko oraz głowica zachowane.

Weryfikacja 5.2.2: maksymalne różnice próbek wnętrz ścian między fotografią i bake poniżej 0.01, po porównaniu w tej samej przestrzeni liniowej. Weryfikacja wymaga odróżnienia bufora float fotografii 16-bit od bufora bajtowego PNG wynikowego. Zmierzono zmniejszenie skoku koloru i roughness przy tylnym szwie. To kontrola próbek, nie gwarancja idealnego dopasowania każdego piksela. Po poprawkach sprawdzono końce, aktywne UV, oba spakowane obrazy i ponowne otwarcie pliku poza folderem tekstur. Plik nie ma linkowanych bibliotek, oba obiekty widoczne, Bevel zachowany. Przekrój pozostaje prostym rysunkiem uczniowskim, bez twierdzenia o końcowej jakości AAA.

Istotne sprawdzenie zapisu: zapis PNG przy nadal istniejącym starszym pakiecie obrazu i samo Pack All może zachować stary pakiet. W lekcji Texture Paint polecono rozpakowanie pliku startowego przed edycją, zapis PNG po malowaniu i dopiero ponowne pakowanie. Test roundtrip tej ścieżki w save-workflow.json potwierdza zachowanie zmienionych pikseli. W procedurze generującej plik również usuwano poprzedni pakiet przed zapisem i pakowaniem aktualnych danych.

Źródła techniczne, sprawdzone 2026-10-16:
- https://docs.staging.blender.org/manual/en/latest/render/cycles/baking.html - Bake i aktywny Image Texture jako cel.
- https://docs.staging.blender.org/manual/en/latest/sculpt_paint/texture_paint/tool_settings/texture_slots.html - wybór obrazu i aktywnego UV.
- https://docs.blender.org/manual/id/5.2/sculpt_paint/texture_paint/introduction.html - malowanie w edytorze obrazu i widoku 3D.
- https://docs.blender.org/manual/id/3.6/sculpt_paint/texture_paint/tools.html - Clone, Ctrl+LPM jako źródło. Nazwy pędzli i aktualny interfejs potwierdzono lokalnie w Blenderze 5.2.2.
- Skrypty zainstalowanego Blendera 5.2: bl_ui/space_view3d.py oraz space_view3d_toolbar.py, SelectPaintSlotHelper - nagłówek, Mode Single Image, obraz i aktywne UV.
- https://polyhaven.com/a/wood_table_001 oraz https://polyhaven.com/license - źródłowe drewno CC0, autorzy Dimitrios Savva i Rico Cilliers; zachowano opis źródła w ZIP map.

Weryfikacja przeglądarkowa oraz przebudowa offline są zachowane w Weryfikacja-M01-v12. Następny etap materiałowy powinien połączyć detal powierzchni z jego fizyczną skalą, a następnie wyraźnie oddzielić geometrię, bump/normal i dane eksportowane do silnika.
