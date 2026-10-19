# Podstawy UV przed procedurą

Po uwadze autora rozdzielono naukę na dwie strony: najpierw decyzje (ciągłość/szwy, deformacja, przydział pikseli), potem warsztat młotka. Wstęp nie jest przeglądem opcji: używa kontrolowanych porównań tego samego modelu.

Nowa lekcja wyjaśnia brak automatycznej szczeliny na szwie, nieciągłość danych tekstury, różnicę między nieregularnym obrysem wyspy a odkształceniem, widok pod kątem, gęstość tekseli, skalę liniową i powierzchnię obrazu oraz świadome priorytety (twarz/spód buta). Wyjaśnia także dlaczego Pack Islands nie zastępuje decyzji autora.

Przykłady A/B/C mają identyczną geometrię, kadr i materiał: A oryginalne UV, B skala 0.5 w obu osiach (powierzchnia UV 0.25, bez anizotropii), C skala 0.5 tylko w U (anizotropia 2). Obraz spakowany. W pliku porównawczym kolekcje można przełączać ikoną oka.

Warsztat skrócono: wybór sześciu wysp głowicy jest uzasadniony wcześniej, więc uczeń wykonuje od razu docelowe szwy. Nie robi najpierw gorszej wersji tylko po to, aby ją potem poprawiać. Zachowano pliki wynikowe 05/06 i ich weryfikację.

Materiały źródłowe: dokumentacja szwów https://docs.blender.org/manual/en/4.0/modeling/meshes/uv/unwrapping/seams.html i narzędzi UV https://docs.blender.org/manual/id/5.0/modeling/meshes/uv/editing.html . Przykłady wygenerowano i sprawdzono w Blenderze 5.2.2.

Dalsza redakcja ma najpierw określać kryteria decyzji i pokazywać ich skutki, dopiero potem operacje. Nie zastępować braku zrozumienia kolejną poprawką siatki ani listą poleceń.
