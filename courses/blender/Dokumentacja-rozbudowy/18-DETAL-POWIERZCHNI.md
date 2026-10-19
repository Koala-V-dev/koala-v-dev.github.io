# Detal powierzchni

Dwunasta lekcja: geometria obrysu, mikronierówności Bump i polerowanie chwytu przez Roughness. Ciągłość pliku 10 do 11. Siedem ilustracji z natywnych zrzutów lub renderów Blendera 5.2.2. Szare materiały kontrolne występują tylko w porównaniach, nie w pliku wynikowym. Obrys głowicy zilustrowany maskami alfa renderów.

Głowica: 3 nowe przekroje, obniżenie dwóch wierzchołków o 3.5 mm, ponowne unwrap i pack jej UV. 28 wierzchołków, 26 czworokątów, zamknięta siatka o dodatniej objętości. Handle: geometria, UV, szwy, transformacje, relacja rodzic-dziecko i bajty Base Color bez zmian. Bevel przywrócony. Bump Object/Mapping/Noise: Scale 2500, Mapping Z .03, Strength .25, Distance .00008. Kontrolne dystanse 0/.00008/.003, maski alfa identyczne. Ubytek głowicy zmienia 1164 pikseli maski.

Roughness malowany natywnym Paint Soft: 12 pociągnięć, cztery boki, zakres wysokości .04-.13 m, rozmiar 80, siła .35, szarość .16. Zmniejszenie roughness potwierdzone próbkami. Oba obrazy spakowane; brak linkowanych bibliotek. Ponowne otwarcie poza folderem tekstur potwierdza zachowanie map. Węzły proceduralne wymagają wypieku do silnika, co zapowiedziano jako następny etap. Pełna kontrola w verification.json.

Źródła techniczne sprawdzone 2026-10-17:
- https://docs.blender.org/manual/nl/latest/render/shader_nodes/displacement/bump.html - Height, Distance, normalne.
- https://docs.staging.blender.org/manual/en/latest/render/materials/components/displacement.html - rozróżnienie geometrii i bump.
- https://raw.githubusercontent.com/blender/blender/main/source/blender/nodes/shader/nodes/node_shader_bump.cc - implementacja węzła, pomocniczo; wartości sprawdzono w lokalnym 5.2.2.
Drewno pochodzi z wcześniejszego etapu: Poly Haven wood_table_001, CC0, Dimitrios Savva i Rico Cilliers.

Przebudowa offline poprawna, współdzielone metadane bez zmian. Audyt 12 lekcji: 0 błędów i 0 ostrzeżeń. Przeglądarka desktop 1440 i mobile 390: 7 obrazów, 2 działające pliki, brak błędów JS i poziomego przepełnienia. Zrzuty i raport w Weryfikacja-M01-v13.
