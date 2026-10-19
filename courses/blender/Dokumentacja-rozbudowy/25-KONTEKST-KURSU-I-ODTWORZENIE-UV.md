# Kontekst kursu i odtworzenie utraconych wyjaśnień UV

Data: 2026-10-18. Dokument roboczy do zachowania ciągłości między sesjami. Ostatnia redakcja została odrzucona przez autora. Żadnej wersji tej lekcji nie oznaczać jako zaakceptowanej na podstawie wyników kompilacji lub oględzin strony.

## Miejsce lekcji w aktualnym kursie

Aktualną kolejność określa Pages/_index.md. Dokument 02 opisuje wcześniejszy projekt programu, a nie obecną listę gotowych modułów.

Uczeń buduje stół w module 0, następnie młotek jako osobny asset. Zna siatkę, fazowanie i podstawowe parametry materiału. Bezpośrednio przed UV ustawia jednolite Base Color, Metallic i Roughness. Nie podłączał jeszcze obrazu do materiału.

Lekcja zasad UV ma wyjaśnić przejście od jednolitych parametrów do zróżnicowania powierzchni. Następna lekcja prowadzi przez stworzenie checkera, szwy, Unwrap i wspólny układ młotka. Dalej uczeń nakłada obrazy drewna i stali, ustala kierunek oraz skalę źródłowego wzoru, a podczas bake przenosi wygląd z układów źródłowych do wspólnego atlasu. Texture Paint korzysta już z tego atlasu. Moduł 2 powtarza proces na bardziej złożonym narzędziu i wprowadza high/low, normal mapę oraz LOD.

To tworzy zależności, które redakcja musi zachować:

| Fundament w lekcji zasad | Gdzie staje się potrzebny |
| --- | --- |
| Tekstura zmienia właściwość materiału w różnych miejscach powierzchni. Może być obrazem lub wzorem obliczanym. | Pierwsze podłączenie obrazu, późniejsze mapy Roughness i wzory proceduralne. |
| UV określa odczytywany obszar obrazu, a rozdzielczość liczbę dostępnych pikseli. | Zmiana skali i kierunku fotografii drewna, rozpoznawanie rozmycia. |
| Jeden układ może obsługiwać kilka obrazów różnych właściwości. | Osobne mapy koloru, Roughness i Metallic tego samego atlasu. |
| Różne obiekty mogą odczytywać różne części wspólnego obrazu. | Wspólny bake głowicy i trzonka bez wymuszania scalenia siatek. |
| Szwy, deformacja i gęstość wymagają osobnej oceny. | Samodzielna korekta młotka oraz UV wkrętaków. |
| Obraz dopasowany do danego UV trafi po zmianie układu w inne miejsca. | Potrzeba przeniesienia wyglądu podczas bake między UV. |

Przykład głowy służy wyjaśnieniu krzywizny, ciągłości i przydziału miejsca na detal. Nie stanowi ukończonego warsztatu postaci ani wzorca jakości UV całego skanu.

## Co rzeczywiście znajdowało się w zachowanych wersjach

Źródła porównania znajdują się w C:\xampp\htdocs\blender-course-development\revision. Nazwa „lekcja-przed.md” oznacza stan sprzed zmiany danego numeru, nie wynik tej zmiany.

| Zachowany plik | Ustalony stan |
| --- | --- |
| v31/lekcja-przed.md | Rozróżnienie rozciągnięcia i gęstości, przykład liczbowy, koszt granic tekstury, priorytet twarzy. |
| v31/lesson.md | Lekcja zaczynała się pobraniem gotowego modelu z checkerem. Autor zakwestionował wymaganie pracy z obrazem przed nauką jego podłączenia. |
| v32/lesson.md i v33/lekcja-przed.md | Definicja tekstury, kilka map na jednym UV, przykład gęstości i wspólny obraz dla dwóch obiektów. Przykład twarzy z dokumentacji został zakwestionowany przez autora. |
| v34/lekcja-przed.md | Schemat twarzy zamiast rzeczywistej tekstury i modelu. Autor zakwestionował ten dobór ilustracji. |
| v35/lekcja-przed.md, czyli stan po v34 | Rzeczywisty skan z dopasowanym obrazem skóry oraz drugi widok z nałożonymi krawędziami UV. Zawierał też wyjaśnienie asymetrycznego znamienia, tekstury proceduralnej i wspólnego układu kilku map. |
| v36/head-section.md i v37/lekcja-przed.md | Nowe, pocięte UV głowy z lokalnie równiejszą kratką. Autor wskazał zły podział miejsca między twarz a ramiona i spód. Sama poprawa kształtu pól nie uzasadniała uznania układu za lepszy. |
| v38/lekcja-przed.md | Stan poprzedzający wyjaśnienie ograniczeń rozwijania krzywizny. Eksperyment ze zmianą skali checkera został wcześniej odrzucony. |
| v39/Przed-redakcja/UV - jak wybierać cięcia i dzielić piksele.md, czyli stan po v38 | Wyjaśnienie różnicy między zachowaniem lokalnych proporcji a względnej powierzchni. Autor określił tę wersję jako poprawę, ale odrzucił rytm narracji, powtórzenia, tytuł i link naukowy. Nie była to akceptacja całości. |
| v39/principles.md i uv-local-corrections/before.md | W przebudowie zniknęły m.in. definicja tekstury proceduralnej, przykład liczbowy, współdzielenie UV przez mapy i wspólny obraz dla osobnych obiektów. Ostatnie poprawki nie odtworzyły tych treści. |

## Zakres odtworzenia

Fragmenty z v34 odzyskano przez odczyt v35/lekcja-przed.md. Fragment z v38 pochodzi z kopii w v39/Przed-redakcja. Zachowano istniejącą kolejność sekcji oraz siedem dotychczasowych ilustracji. Przywrócono dodatkowo istniejący obraz uv-twarz-uklad-model.png, pokazujący to, o co autor wcześniej poprosił: rzeczywistą teksturę z UV obok modelu.

Odtworzone treści obejmują definicję tekstury, przykład współrzędnych niezależnych od rozdzielczości, jeden układ dla koloru i Roughness, asymetrię znamienia, liczbowy przykład gęstości oraz wspólny obraz dwóch obiektów. Objaśnienie ilustracji doprecyzowuje, że gęstość geometrii wokół ust i przydział pikseli to osobne wielkości. Ogólnik o „sensownym rozłożeniu” zastąpiono kolejnością szew → ponowne Unwrap → ocena.

Nie przywracano odrzuconych schematów twarzy, wariantu rozłożenia z za małą twarzą ani porównania zmieniającego skalę checkera. Nie zmieniano modeli, tekstur, materiałów ani plików sąsiednich lekcji. Nie wprowadzano limitu znaków, linii ani liczby kroków.

Kopia wejściowa, lokalne różnice i pochodzenie fragmentów: C:\xampp\htdocs\blender-course-development\revision\uv-history-recovery. Nie uruchamiać dawnych instalatorów, bo zastąpią późniejsze poprawki autora.

## Kontrola twierdzeń

Podstawy mapowania i tekstur sprawdzono w dokumentacji Blendera. Dostępne wyniki zawierały treść opisów, a nie tylko tytuły. Źródła pozostają w dokumentacji prac, żeby uczeń nie musiał szukać wyjaśnienia poza lekcją:

- UV Editor Introduction: https://docs.blender.org/manual/en/5.0/editors/uv/introduction.html — przypisanie obszarów obrazu do powierzchni, osie U i V.
- Shader Nodes Introduction: https://docs.blender.org/manual/sr/5.2/render/shader_nodes/introduction.html — tekstury proceduralne i obrazy, wartości przekazywane materiałowi.
- Layout Workflow: https://docs.blender.org/manual/id/dev/modeling/meshes/uv/workflows/layout.html — rozkładanie różnych części osobno i sens podziału przy uchu oraz szyi. Wersja rozwojowa jest źródłem zasady, nie dowodem nazw UI lokalnego Blendera.
- UV Operators: https://docs.blender.org/manual/en/5.0/modeling/meshes/editing/uv.html — szwy, rozłożenie i nadpisanie poprzednich współrzędnych przez Unwrap.

Ilustracje twarzy obejrzano w pełnej rozdzielczości. Potwierdzają związek obrazu z modelem. Nie potwierdzają optymalności rozłożenia. Nie deklarować ogólnej poprawy UV skanu na podstawie samej regularności checkera.

## Zasada dalszej pracy

Każda poprawka musi zachować funkcję wyjaśnień już obecnych w kursie. Zmiana akapitu o checkerze nie upoważnia do usunięcia definicji tekstury ani przygotowania do bake. Różnice z poprzednią wersją należy oceniać również pod kątem utraconych umiejętności, a nie tylko brzmienia nowych zdań.

Brak jawnej akceptacji autora oznacza brak akceptacji. Poprawność linków, liczba obrazów, wykonanie skryptu i kompilacja sprawdzają inne rzeczy niż zrozumienie mechanizmu przez ucznia.
