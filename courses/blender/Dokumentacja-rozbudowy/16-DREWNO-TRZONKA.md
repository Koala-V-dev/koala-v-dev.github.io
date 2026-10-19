# Drewno trzonka: obraz i znaczenie UV

Dziewiąta lekcja kursu kontynuuje plik 06. Dwie oryginalne mapy Wood Table 001 z Poly Haven: Diffuse sRGB i Rough Non-Color, PNG 2048 x 2048. Autorzy: Dimitrios Savva (fotografia), Rico Cilliers (opracowanie). CC0 pozwala dołączyć mapy do paczki kursu. W archiwum tekst źródła i licencji. Sumy MD5 obu pobrań porównano z oficjalnymi metadanymi API.

Źródła sprawdzone 2026-10-16:
- https://polyhaven.com/a/wood_table_001 - autorzy i skala fotografowanej powierzchni 1,5 m.
- https://polyhaven.com/license - warunki CC0, w tym redystrybucja.
- https://docs.blender.org/manual/en/5.2/render/shader_nodes/textures/image.html - Image Texture i domyślne współrzędne UV.
- https://docs.staging.blender.org/manual/en/latest/editors/image/image_settings.html - dane Non-Color i obrazy sRGB. Strona przedstawiała dokumentację 5.2; ustawienia dodatkowo potwierdzono w aplikacji 5.2.2.

Praktyka: kolor, obrót UV o 90 stopni jako kontrolowany przykład znaczenia kierunku, skala fizyczna wzoru (0,3/1,5 = 20% obrazu), osobna mapa Roughness, pakowanie plików. Skalowanie UV trzonka jest jednakowe w obu osiach; głowica, cała geometria, szwy, Bevel i relacja rodzic-dziecko zachowane. Poprzedni wspólny checker nie jest atlasem gotowego assetu: obecny shader drewna korzysta z osobnego obrazu. Wyjaśniono tę zmianę w lekcji.

Zrzuty pochodzą z Blendera. Porównania kierunku mają tę samą kamerę, światło i materiał. Porównanie Roughness wykonano z jednolitym szarym Base Color, aby kolor fotografii nie maskował odbić. Ten stan jest tylko diagnostycznym zrzutem; plik wynikowy zachowuje kolor drewna i mapę roughness.

Granica etapu: tekstura boków. Czoła wymagają rysunku przekroju, a tylny szew kontroli i retuszu. Lekcja wskazuje to jako konkretną następną pracę. Nie nazywa pliku końcowym assetem AA/AAA ani gotowym materiałem do eksportu. Przewidziane dalsze kroki: własny atlas, malowanie przekroju i łączeń, detal powierzchni i pipeline silników.

Plik 08 sprawdzono ponownym otwarciem: oba obrazy spakowane, poprawne przestrzenie koloru i połączenia, działanie przy nieistniejących ścieżkach zewnętrznych. Szczegóły w Weryfikacja-M01-v11.
