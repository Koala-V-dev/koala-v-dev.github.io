# Moduł 2: wkrętak

Dodano pierwszą lekcję modułu 2: Wkrętak - przekroje i Subdivision Surface. Nowy model od pustej sceny, bez zmiany młotka i stołu. Punktem kontrolnym jest rzeczywiście zbudowana rękojeść bez pętli, nie domyślny obiekt. Wynik: dwa zamknięte meshe w kolekcji Wkretak, grot jako dziecko rękojeści. Długość 206 mm, rękojeść 96 mm, trzpień nominalnie 6 mm, wejście w rękojeść 8 mm. Materiały jednolite wyłącznie do oceny bryły; nie deklarowano gotowych tekstur ani eksportu.

Rękojeść: 8 wierzchołków przekroju, korpus 0-80 mm, zwężenie 80-90, szyjka 90-96. Dodatkowe pętle na 4,76,91,95 mm i Inset pokryw 3 mm. Ngony tylko na płaskich środkach pokryw, boki czworokątne. Catmull-Clark 2/2, Optimal Display. 80 wierzchołków i 74 bazowe ściany; wynik poziomów 1/2/3: 304/1216/4864 ścian. Grot: 32 wierzchołki i 26 ścian, spłaszczenie na wysokościach 198 i 206 mm, Bevel .15 mm/2 oraz Weighted Normal. Modyfikatory niezaaplikowane, oba obiekty widoczne, brak linkowanych bibliotek i obrazów. Ponowne otwarcie w osobnym folderze poprawne.

Pięć ilustracji z natywnych zrzutów i renderu Blendera 5.2.2, kadrowanie oraz podpisy PIL. Przed/po pętlach ma tę samą kamerę, oświetlenie i poziom Subdivision 2. Objaśniono różnicę Shade Smooth i zmiany obrysu, wpływ odległości pętli oraz wzrost kosztu siatki. Nie zwiększano poziomu, żeby ukrywać brak pętli. Dalszy przedmiot zgodnie z przyjętą ścieżką: klucz płaski, obrys/grubość/otwory/Boolean.

Źródło pomocnicze sprawdzone 2026-10-17: https://docs.blender.org/manual/en/3.6/modeling/modifiers/generate/subdivision_surface.html - Catmull-Clark i pętle podtrzymujące. Bieżące wyniki oraz nazwy interfejsu potwierdzono w lokalnym Blenderze 5.2.2; nie zakładano zgodności wersji po samej etykiecie latest.

Przebudowa offline poprawna, współdzielone metadane bez zmian. Audyt 13 lekcji: 0 błędów i 0 ostrzeżeń. Przeglądarka desktop 1440 i mobile 390: 5 obrazów, 2 działające pliki, brak błędów JS i poziomego przepełnienia. Zrzuty i raport w Weryfikacja-M02-v15.
