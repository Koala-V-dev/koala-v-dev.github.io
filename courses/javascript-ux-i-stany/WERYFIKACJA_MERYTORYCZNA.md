# Weryfikacja kursu „Nowoczesny JavaScript: UX, UI i Stany”

Data ponownej weryfikacji: 2026-07-26  
Zakres: 12 lekcji źródłowych, indeks, rejestr, kompilator, CodeRunner, build aplikacji i test przeglądarkowy  
Decyzja techniczna: **GO do pilotażu**  
Decyzja publikacyjna: **NO-GO do czasu pilotażu**

## Wynik redakcji

Poprzedni zbiór 31 nakładających się lekcji został wycofany z aktywnego katalogu. Jego źródła są zachowane w `_archiwum-przed-redakcja-2026-07-26`.

Aktywny kurs ma jedną kanoniczną strukturę: 4 moduły po 3 lekcje. Rejestr, indeks, źródła i wygenerowane strony wskazują te same 12 pozycji.

Każda lekcja prowadzi przez problem, przewidywanie, model, próbę z informacją zwrotną, opóźnione rozwiązanie i zmieniony przypadek. Nie ma lekcji zbudowanej wyłącznie z katalogu pojęć, tabeli lub listy definicji.

## Dowody techniczne

- Audyt szkicu: 12 lekcji, 0 błędów, 0 ostrzeżeń.
- Audyt publikacyjny: 12 lekcji, 0 błędów, 0 ostrzeżeń.
- Czysty build kursu: 12 stron HTML.
- Weryfikator CodeRunnera: 12 bramek i 35 przypadków testowych.
- Build Vite: zakończony powodzeniem.
- Testy Jest: 83 zestawy, 767 testów, wszystkie zaliczone.
- Test przeglądarkowy: menu otwiera właściwą lekcję po kliknięciu.
- Test przeglądarkowy: quiz odsłania zadanie dopiero po poprawnej odpowiedzi.
- Test przeglądarkowy: błędny kod startowy Event Loop nie przechodzi testu.
- Test podglądu Markdown: kryteria CodeRunnera są zachowane także przed kompilacją produkcyjną.

## Usunięte usterki blokujące

### Nawigacja

Kompilator koduje teraz oddzielne segmenty ścieżki. Separator katalogu pozostaje separatorem, zamiast zmieniać się w `%2F`.

### Fałszywie zaliczane ćwiczenia

Markdown przetwarzał zawartość `<template>` wewnątrz CodeRunnera. Kod był dzielony na akapity, JSON kryteriów przestawał być poprawny, a pusty zestaw testów wyglądał jak sukces.

Kod i kryteria są teraz przechowywane w UTF-8 jako dane Base64 na czas renderowania. Widget odrzuca brak kryteriów, a automatyczny weryfikator sprawdza każdą wygenerowaną bramkę.

### Stare wyniki kompilacji

Katalog wynikowy zawierał 31 osieroconych stron z poprzedniej wersji. Został usunięty jako odtwarzalny artefakt i zbudowany ponownie. Obecnie zawiera wyłącznie 12 stron kanonicznych.

## Ocena dydaktyczna

Kurs nie kończy aktywności na rozpoznaniu definicji. Uczeń między innymi:

- odtwarza ślad Event Loop i naprawia zbyt wczesny `return`;
- zabezpiecza wyszukiwanie przed spóźnioną odpowiedzią;
- dowodzi niezmienności reducera na poprzednim stanie;
- wskazuje operację omijającą płytkie Proxy;
- odrzuca niedozwolone przejście maszyny stanów;
- odtwarza instalację przez lockfile i `npm ci`;
- rozdziela odczyty i zapisy DOM, a potem mierzy wynik;
- oblicza transformację FLIP i zachowuje wariant ograniczonego ruchu;
- przechodzi pełną ścieżkę dialogu klawiaturą;
- wymusza awarię zależności i ocenia zakres fallbacku;
- ponownie podłącza Web Component i sprawdza liczbę reakcji listenera.

## Dysleksja i topografia

Materiał stosuje krótkie akapity z jedną myślą, stabilne nazwy, jawne kryteria ukończenia oraz widoczne oddzielenie instrukcji, danych, wyniku i korekty.

Zależności procesowe są pokazywane małymi schematami tekstowymi. Mermaid nie został użyty, ponieważ projekt nie ma potwierdzonego renderera tego formatu. Dzięki temu uczeń nie otrzymuje surowego kodu diagramu zamiast mapy zależności.

## Granice wnioskowania

Weryfikacja techniczna i ekspercka nie dowodzi jeszcze skuteczności na rzeczywistej grupie. Nie wykonano testu z osobami korzystającymi na co dzień z czytnika ekranu ani pilotażu dydaktycznego.

Kurs pozostaje `draft`. Przejście do `published` wymaga:

1. pilotażu na co najmniej 5 osobach z grupy docelowej;
2. zapisu pierwszej samodzielnej próby i wyniku po korekcie;
3. osobnej obserwacji czytelności przez osoby z dysleksją;
4. testu dialogu i bramek z klawiaturą oraz wybranym czytnikiem ekranu;
5. decyzji redakcyjnej na podstawie danych, bez deklarowania progu 80% przed pomiarem.

## Polecenia ponownej kontroli

```bash
node AI_SKILLS/build-koala-course/scripts/audit-course.mjs javascript-ux-i-stany --draft
node AI_SKILLS/build-koala-course/scripts/audit-course.mjs javascript-ux-i-stany
node cli/build-course.mjs javascript-ux-i-stany
node scripts/verify-javascript-ux-course.mjs
npm run build
npm test -- --runInBand
```

Źródła merytoryczne wraz z datą kontroli są zapisane w `REJESTR_ZRODEL.md`.
