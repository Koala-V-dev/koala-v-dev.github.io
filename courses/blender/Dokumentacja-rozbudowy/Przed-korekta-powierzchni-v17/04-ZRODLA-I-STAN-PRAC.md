# Źródła i stan prac

Data przeglądu: 2026-10-16. Status: fundament projektu kursu i ukończona wstępna inspekcja trzech plików `.blend`.

Aktualny stan: czternaście lekcji. Moduł 2: poprawiony wkrętak płaski z rowkami oraz osobna lekcja wariantu krzyżowego na wspólnym projekcie chwytu. Szczegóły: [21-ROWKI-I-WARIANT-KRZYZOWY.md](21-ROWKI-I-WARIANT-KRZYZOWY.md).

## Dokumentacja techniczna

| Źródło                                                                                                                                                    | Co potwierdza                                                             | Stan                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Blender Manual 5.2 — Render Baking](https://docs.blender.org/manual/en/5.2/render/cycles/baking.html)                                                    | UV, obraz docelowy, bake i Selected to Active                             | Odnalezione w wyszukiwaniu; nie jest potwierdzeniem UI wersji ze zrzutów     |
| [Epic — FBX Static Mesh Pipeline](https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-static-mesh-pipeline-in-unreal-engine)                  | Triangulacja, import, kolizje UCX, LOD i użycie FBX 2020.2 przez pipeline | Odczytano stronę; ustawień eksportera Blendera nie testowano                 |
| [Godot stable — Importing 3D scenes](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/index.html)                     | Dokumentacja formatów, eksportu i konfiguracji importu                    | Odczytano indeks; procedura dla wybranej wersji wymaga testu                 |
| [Unity — Configure smoothness with the Standard Shader](https://docs.unity.cn/6000.1/Documentation/Manual/StandardShaderMaterialParameterSmoothness.html) | Zależność smoothness od konfiguracji Standard Shader                      | Odnalezione w wyszukiwaniu; nie przenosić ustawień automatycznie na URP/HDRP |

Strony `stable` i dokumentacja bez zamrożonej wersji mogą się zmieniać. Lekcja produkcyjna wymaga zapisania wersji użytej w teście. Nie oznaczamy procedury jako potwierdzonej tylko dlatego, że istnieje dokumentacja narzędzia.

## Co wykonano

- Rozpoznano różnicę pomiędzy bieżącym workspace PHP a wskazanym projektem Centrum Wiedzy.
- Przeczytano strukturę kursu, wprowadzenie, rejestr umiejętności i źródeł, lekcję Dodge’a i fragmenty lekcji stołu.
- Sprawdzono wielkości wszystkich 24 lekcji i potwierdzono, które są samymi tytułami.
- Obejrzano zrzut finalnego Dodge’a i powiązano obserwacje z treścią lekcji.
- Potwierdzono obecność materiałów `.blend` w katalogu podanym przez autora.
- Przygotowano program 108 jednostek, standard odbioru, mapę migracji i listę korekt technicznych.

- Otworzono trzy projekty w Blenderze 5.2.2 LTS, wykonano odczyt danych i dziewięć podglądów geometrii. Oryginały zachowały identyczne skróty SHA-256. Wyniki: [05-INSPEKCJA-PLIKOW-BLEND.md](05-INSPEKCJA-PLIKOW-BLEND.md).
- Autor potwierdził pochodzenie utraconych obrazów butelki: przeciągnięcie z Firefoksa i zapis odwołań do Temp bez trwałej kopii.

## Czego jeszcze nie wykonano

- Pełnej kontroli samoprzecięć, nakładania UV i kierunku wszystkich normalnych; zakres wykonanej inspekcji opisuje raport 05.
- Napisania i wykonania 108 jednostek. Program jest specyfikacją.
- Przygotowania plików startowych, rozwiązań, zrzutów nowych procedur i przykładów błędów.
- Testów importu, reimportu, animacji i wydajności w Unity, UE5 i Godot.
- Pilotażu z początkującym uczniem oraz recenzji dydaktycznej.
- Kompilacji i kontroli wizualnej stron kursu.

## Następny pakiet wykonawczy

1. Na podstawie ukończonej inspekcji przygotować opisane kopie startowe i kontrolne, zachowując oryginały. W pierwszej kolejności: zależności obrazów, skala i Mirror stołu.
2. Opracowanie M00 i poprawienie stołu: pełne wejście do UI, nawigacji, plików oraz rozróżnienia obiekt/siatka.
3. Opracowanie M01–M03 na małych obiektach, z rzeczywistymi plikami ćwiczeniowymi.
4. Pierwszy kompletny rekwizyt i trzy stanowiska testowe M04.
5. Dopiero po przejściu tej ścieżki rozszerzanie dalszych modułów.

Pełny kurs nie jest jeszcze gotowy. Pierwszą zamkniętą partią do publikacji powinien być samodzielny przepływ od uruchomienia Blendera do małego assetu w silniku, a nie zbiór kilkudziesięciu zapowiedzi.

## Aktualizacja po przebudowie modułu 0

Pierwsza partia została wdrożona: wprowadzenie, sześć pełnych lekcji, 14 oznaczonych zrzutów interfejsu i siedem plików ćwiczeniowych `.blend`. Poprzednie źródła i kompilację zachowano w archiwum, a kopia autora pozostała nienaruszona.

Potwierdzono wymiary plików kontrolnych oraz poprawne pakowanie na niezmienionym stole i ponowne otwarcie bez obrazu zewnętrznego. Audyt struktury zwrócił 0 błędów i 0 ostrzeżeń. Siedem stron przeszło lokalną kontrolę obrazów, odnośników, podpowiedzi i układu mobilnego. Szczegóły oraz ograniczenia: [06-PRZEBUDOWA-M00.md](06-PRZEBUDOWA-M00.md).

Wcześniejsza lista kolejnych prac opisuje stan sprzed tej partii. Najbliższy etap to moduł 1: operacje na siatce i kontrolowana diagnoza, potem referencje, UV oraz pierwszy asset w silnikach. Cały kurs pozostaje w przebudowie; pilotaż z uczniem i testy silników nie są jeszcze wykonane.
