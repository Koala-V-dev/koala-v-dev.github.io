# Przebudowa modułu 0: pierwsza partia

Data: 2026-10-16. Stan: wdrożone źródła i lokalna kompilacja; materiał wymaga jeszcze pilotażu z uczniem. Cały kurs 108 jednostek nie jest ukończony.

## Wdrożony zakres

Nowe wprowadzenie oraz sześć lekcji: mapa interfejsu, nawigacja, Object/Edit, wymiary półki, zapis i obrazy oraz samodzielny stół. Aktywny indeks obejmuje tylko te materiały. Dotychczasowe lekcje i puste zapowiedzi przeniesiono do `Archiwum-przed-M00-20261016/Pages` w dokumentacji kursu. Poprzednia kompilacja i kompilator również są w tym archiwum. Kopii `Pages backup human` nie zmieniano.

Dodano 14 oznaczonych ilustracji z rzeczywistych zrzutów Blendera 5.2.2 LTS. Zastosowano kadrowanie, obrysy i numerację, bez przerysowywania interfejsu. Przy małych opcjach wykorzystano powiększalne wycinki. Numery umieszczono poza oznaczanymi polami, aby nie zasłaniały ich nazw.

Dołączono siedem plików `.blend`: start, skala obiektu, półka przed i po Apply, stół z obrazem przed i po pakowaniu oraz prosty stół kontrolny. PNG testowy jest osobnym zasobem. Oryginalnych modeli autora w katalogu KURS nie zmieniano.

## Zmiana ścieżki dydaktycznej

Pierwszy stół jest złożony z pięciu prostych brył. Uczeń najpierw odczytuje i przelicza wymiary, wybiera tryb oraz kontroluje zapis. Mirror i ekstruzja pojawią się w następnym etapie, na fundamencie samodzielnej kontroli prostego wyniku.

Każda lekcja ma procedurę, obserwowalny wynik, samodzielny wariant i informację zwrotną. Początkowe zadania nie wymagają szybkiej pracy ani produkcyjnej oprawy. Oddzielono od siebie wymiary i Scale, nawigację i transformacje, Origin i 3D Cursor oraz zapis i przenośność obrazów.

Demonstracja pakowania wykorzystuje obraz na istniejącym blacie. Przed i po Pack Resources stół ma tę samą geometrię oraz połączenia węzłów materiału. Podczas przygotowania ilustracji generator błędnie przełączał na osobny obiekt testowy; po uwadze autora zostało to usunięte. Pliki dostarczane do lekcji zachowują stół. Skrypt generujący również kończy pracę na stole.

## Weryfikacja

- Audyt projektu: 7 pozycji w indeksie, 7 plików lekcji, 0 błędów i 0 ostrzeżeń.
- Odczyt w Blenderze potwierdził wymiary plików kontrolnych, jednostkowe skale wyników i ustawienie nóg na podłożu oraz przy spodzie blatu. Każda z pięciu osobnych brył stołu jest manifold.
- Test pakowania: identyczny podpis geometrii, niezmieniony graf materiału, ponowny odczyt obrazu 256×256 po przeniesieniu samego `.blend` do folderu bez PNG.
- Lokalne testy w Edge: 7 stron, zgodność H1, wszystkie obrazy i odnośniki do ćwiczeń działają, rozwijanie rozwiązania działa. Brak poziomego przepełnienia strony przy 390 px.
- Obejrzano podgląd desktopowy pierwszej lekcji, sekcji pakowania oraz mobilny wycinek ustawień jednostek. Próby automatyczne nie są pilotażem z początkującym odbiorcą.
- Kompilacja z `--offline` działa przy zablokowanym `fetch`. Nie zmieniła `.image_cache.json` ani `public/poligon-db.json`.

Dowody są w `Weryfikacja-M00`: raporty JSON, zrzuty widoku platformy i skrypty kontroli.

## Kompilator i podgląd

W `cli/build-course.mjs` dodano opcję `--offline`: bez uploadu obrazów, bez wymagania tokenu GitHuba i bez aktualizacji cache obrazów oraz poligonu. W tym trybie obrazy są kopiowane lokalnie. Zasoby `Resources` są kopiowane również w zwykłej kompilacji, aby pliki ćwiczeniowe podróżowały z kursem. Dotychczasowy upload w trybie domyślnym pozostaje aktywny.

Lokalna kompilacja: `node cli/build-course.mjs blender --offline`.

Podgląd źródeł działa przez Vite pod `/public/courses/blender/modul-0/start-i-mapa-interfejsu`. To trasa aplikacji, bez `Pages` i bez `.html`. `?freemode=1` umożliwia przegląd lekcji niezależnie od blokad postępu. Zwykła nawigacja ucznia nadal korzysta z ustawień platformy. Nie zmieniano globalnych ustawień oceniania, wyglądu i postępu.

Nie publikowano niczego w internecie i nie wykonywano push ani tagu wydania.

## Następna partia

Moduł 1 powinien wprowadzić ekstrudowanie, Inset, Loop Cut, Bevel i naprawę siatki na małym wsporniku, a potem symetrię na znanym stole. Należy przygotować zrzuty przed i po zmianie, punkty kontrolne i dwa pliki: stan z problemem oraz rozwiązanie. Dalej: referencje i prawidłowa skala butelki, UV i pierwszy pełny rekwizyt w silnikach.

Przed uznaniem modułu za opublikowany trzeba jeszcze przeprowadzić próbę z nowym uczniem, sprawdzić czytelność w jego ustawieniach powiększenia i przejść ścieżkę postępu od czystego profilu. Import do silników pozostaje dalszym etapem.

## Odniesienia do dokumentacji

- [Blender 5.2: Window System](https://docs.blender.org/manual/en/5.2/interface/window_system/index.html).
- [Blender 5.2: Packed Data](https://docs.blender.org/manual/en/5.2/files/blend/packed_data.html).
- [Blender 5.2: Apply](https://docs.blender.org/manual/en/5.2/scene_layout/object/editing/apply.html).

Procedury tej partii oceniono również na lokalnym Blenderze, nie tylko na podstawie dokumentacji. Rejestr dokumentacji nie oznacza automatycznie potwierdzenia testów w silnikach.
