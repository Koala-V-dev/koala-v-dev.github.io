# Standard lekcji i odbioru assetu

Status: specyfikacja do realizacji programu. Żadna z opisanych prób nie została jeszcze zaliczona na plikach autora.

## Karta kursu

Tytuł roboczy: Blender — produkcja assetów do gier. Slug: `blender`. Odbiorca: osoba zaczynająca grafikę 3D, potrafiąca obsługiwać pliki i foldery. Poziom: od podstaw do pracy projektowej. Opiekun merytoryczny i recenzenci: do wskazania przed publikacją. Wersje narzędzi: odczytać i zapisać z faktycznych stanowisk testowych; nie zgadywać wersji na podstawie nazw w starym rejestrze.

Po kursie uczeń samodzielnie planuje i wykonuje asset z nowego briefu, testuje warianty w Unity, UE5 i Godot, diagnozuje błędny model oraz poprawia go w ramach budżetu. Zakres główny: rekwizyty i środowisko. Pojazdy i postacie stanowią specjalizacje. Program nie jest pełnym kursem programowania gry, animacji filmowej ani renderingu offline.

## Budowa każdej lekcji

1. **Wynik:** jeden widoczny rezultat, np. „przygotujesz UV cylindra z czytelną etykietą bez rozciągania”.
2. **Wejście:** wymagane wcześniejsze umiejętności, konkretny plik startowy albo instrukcja utworzenia go od pustej sceny, wersja i ustawienia.
3. **Model mentalny:** krótka odpowiedź, co narzędzie zmienia i dlaczego przyda się w aktualnym zadaniu.
4. **Odczyt stanu:** uczeń sprawdza tryb, aktywny obiekt, wymiary, zaznaczenie, osie i inne parametry istotne w tej lekcji.
5. **Praca:** krótkie etapy z uzasadnieniem decyzji, zrzutem krytycznego stanu i oczekiwanym skutkiem. Skrót zawsze ma nazwę operacji jako alternatywę.
6. **Kontrola:** obserwowalny wynik po każdym ważnym etapie; nie samo „powinno wyglądać dobrze”.
7. **Drugi przypadek:** podobny problem z innymi wymiarami, referencją lub materiałem, bez kompletnego przepisu.
8. **Diagnoza:** objaw, najbliższy test, wynik testu i możliwa naprawa. Nie podawać jednej recepty na wszystkie przyczyny.
9. **Oddanie:** plik źródłowy, obrazy i krótki dowód spełnienia kryteriów. Eksport i test w silniku w lekcjach integrujących.
10. **Informacja zwrotna:** rozwiązanie lub wzorzec oceny dostępny po próbie, z wyjaśnieniem dopuszczalnych wariantów.

Nie każda lekcja potrzebuje quizu ani widgetu. Pytanie pamięciowe o skrót nie zastępuje zadania wykonania i naprawy modelu.

## Pliki ćwiczeniowe i ilustracje

Każdy plik `.blend` do lekcji ma jawny status: start, punkt kontrolny lub rozwiązanie. Zapisujemy wersję Blendera, jednostki, wymagane dodatki i listę obrazów. Materiał ma otwierać się na czystym stanowisku bez prywatnych ścieżek autora. Uczeń otrzymuje też drogę od pustej sceny tam, gdzie stworzenie obiektu jest celem nauki.

Zrzuty pokazują istotny fragment interfejsu, aktywny obiekt i ustawienie. Opis podaje, jaki dowód widać na obrazie. Błędny i poprawiony wynik pokazujemy z tej samej kamery, w tym samym świetle i skali. Nie retuszujemy artefaktu, który jest przedmiotem lekcji.

Krótki akapit powinien prowadzić do jednej decyzji. Jedna instrukcja nie może wymagać zapamiętania kilkunastu kliknięć. Kolor strzałki nie może być jedynym nośnikiem informacji. Nazwy UI i polskie objaśnienia pozostają spójne. Skróty opisują standardowe mapowanie; dla laptopa podajemy dostęp przez menu lub ikonę.

## Mierzalny brief assetu

Przed modelowaniem zapisujemy:

| Pole | Przykład dydaktyczny, nie norma branżowa |
| --- | --- |
| Funkcja | Skrzynia jako rekwizyt otoczenia, bez otwierania |
| Skala | 0,8 × 0,5 × 0,45 m |
| Kamera | Widok trzecioosobowy; osobno ustalony najbliższy kadr testowy |
| Styl | Realistyczny, malowana stal i guma |
| Materiały | Ustalony limit slotów oraz wymagane mapy |
| Geometria | Limit trójkątów ustalony po blockoucie i teście kadru |
| Tekstury | Rozdzielczość i TD wynikające z testu kamery |
| Kolizja | Postać nie przenika przez skrzynię; brak kosztownej kolizji zbędnego detalu |
| Środowisko | Silnik, render pipeline, wersja, urządzenie i rozdzielczość |
| Powtarzalność | Liczba instancji w scenie testowej |

Gęstość tekseli jest wielkością liniową. Przykład: wyspa reprezentująca odcinek 2 m przy 512 px/m potrzebuje 1024 px w tym kierunku. To nie oznacza automatycznie, że wszystkie wyspy zmieszczą się na teksturze 1024². Trzeba uwzględnić ich powierzchnię, pozostałe części i margines.

Budżetu nie wyznacza słowo „AAA”. Dobieramy go do miejsca w grze i pomiaru. Mały rekwizyt w tle oraz przedmiot zajmujący połowę ekranu mają inne potrzeby.

## Bramka odbioru

| Obszar | Dowód |
| --- | --- |
| Forma | Sylwetka i proporcje porównane z referencją w uzgodnionych kadrach |
| Konstrukcja | Elementy mają wiarygodne połączenia, grubości i funkcję |
| Siatka | Brak niezamierzonych duplikatów, otworów, przenikań i odwróconych ścian; zamierzone wyjątki opisane |
| Cieniowanie | Obracane światło nie ujawnia niezamierzonych załamań i szwów |
| UV | Checker, kontrola skali i rozciągania; overlap tylko świadomy |
| Bake | Brak błędów projekcji i niezamierzonych szwów w docelowym shaderze |
| Materiały | Poprawny odczyt map; wiarygodna odpowiedź na światło; wariant kanałów dla każdego shadera |
| Integracja | Skala, kierunek, pivot, kolizja, hierarchia oraz reimport sprawdzone w silniku |
| Koszt | Liczba tris, importowanych wierzchołków, materiałów, pamięć tekstur i pomiar sceny |
| Paczka | Źródła i eksport otwierają się bez brakujących zależności; README określa użycie |

Ocena każdego obszaru: 0 — brak lub wynik blokuje użycie; 1 — działa z istotnymi usterkami; 2 — spełnia brief; 3 — spełnia brief i ma udokumentowane porównanie wariantów. Przejście wymaga co najmniej 2 w każdym obszarze. Wysoka jakość renderu nie kompensuje błędnej skali ani brakujących plików. Suma punktów służy informacji zwrotnej, nie zastępuje bramek.

## Test trzech silników

W każdym stanowisku zapisujemy dokładną wersję silnika i importera, render pipeline oraz shader. Osobno zapisujemy preset eksportera. Ten sam zestaw map źródłowych może wymagać różnego pakowania i ustawień.

Pakiet kalibracyjny obejmuje kostkę o boku 1 m, znacznik przodu, niesymetryczną bryłę, testową normal mapę z wypukłym znakiem i obiekt z pivotem w narożniku. Próba w silniku potwierdza wymiar, przód/górę, wypukłość detalu i miejsce obrotu. Potem sprawdzamy kolizję oraz reimport po zmianie jednego wymiaru.

Unity: wskazać Built-in/URP/HDRP i konkretny shader. UE5: sprawdzić wybór importera, materiał, kolizję i stosowaną ścieżkę LOD/Nanite. Godot: wskazać renderer, konfigurację glTF oraz sposób przechowywania zmian poza nadpisywanym importem.

Test właściwego assetu wykonywać w neutralnej scenie oraz scenie docelowej. Pomiary wydajności porównywać przy tej samej kamerze, oświetleniu, rozdzielczości, urządzeniu i liczbie instancji. Nie porównywać FPS różnych silników jako oceny umiejętności modelowania.

## Nauka szybkości

Uczeń zapisuje czas planowania, modelowania, UV, tekstur, integracji i napraw. Oddziela czas pracy od oczekiwania na bake. Przy drugim podobnym zadaniu porównuje czas i liczbę usterek. Wskazuje jedno usprawnienie, np. lepszy blockout, wcześniej zrobiony import lub ponowne użycie własnego materiału.

Ćwiczenie tempa następuje po osiągnięciu samodzielności. Bez presji czasowej w pierwszej nauce operacji. Proceduralne narzędzie staje się wartościowe wtedy, gdy uczeń umie rozpoznać jego zły wynik i go poprawić.

## Warunki publikacji lekcji

- Procedura wykonana na świeżym pliku lub dostarczonym pliku startowym.
- Każde nowe pojęcie wyjaśnione przed zadaniem, które go wymaga.
- Samodzielny przypadek ma jawne kryteria i informację zwrotną.
- Zrzuty i pliki rzeczywiście odpowiadają końcowej instrukcji.
- Źródła mają dokładne adresy; wnioski z własnych prób są oznaczone oddzielnie.
- Linki, obrazy i kolejność w `_index.md` sprawdzone.
- Wygenerowany HTML sprawdzony na szerokim i wąskim ekranie, z powiększeniem i klawiaturą.
- Lekcja nie uzyskuje statusu „gotowa” bez wykonania prób praktycznych.

Kompilator `cli/build-course.mjs` potrafi wysyłać obrazy do GitHuba i aktualizować cache. Lokalnej kontroli dokumentów nie należy utożsamiać z uruchomieniem bezpiecznego trybu offline. Przed budową trzeba ustalić, czy dana ścieżka wykona upload. W tej fazie kompilatora nie uruchamiano.
