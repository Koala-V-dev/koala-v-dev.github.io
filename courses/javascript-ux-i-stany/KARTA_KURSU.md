# Karta kursu „Nowoczesny JavaScript: UX, UI i Stany”

## Tożsamość

- Slug: `javascript-ux-i-stany`
- Stan: `redakcja, przed pilotażem`
- Odbiorca: osoba, która potrafi zbudować prostą stronę w HTML, CSS i JavaScript oraz obsłużyć DOM i zdarzenia
- Poziom: średnio zaawansowany z wejściem do zagadnień zaawansowanych
- Kurs wymagany: `web-frontend`
- Środowisko: aktualna stabilna przeglądarka, Node.js zgodny z wymaganiami bieżącej wersji Vite
- Data kontroli wersji i standardów: 2026-07-26

## Obietnica kursu

Po ukończeniu kursu uczeń samodzielnie:

1. diagnozuje kolejność zdarzeń, wyścigi zapytań i błędy modelu stanu na podstawie obserwowalnego śladu;
2. projektuje stan UI z czystym reducerem i jawnymi przejściami maszyny stanów;
3. mierzy koszt operacji DOM oraz dobiera debounce, `requestAnimationFrame` i ograniczenie ruchu do wyniku pomiaru;
4. buduje dostępny dialog, kontrolowany fallback i bezpieczny Web Component bez interpolowania niezaufanych danych do HTML.

## Projekt przewodni

Uczeń rozwija panel obsługi zamówienia. Ten sam panel powraca w kolejnych lekcjach: pobiera dane, aktualizuje status, blokuje powtórne wysłanie, pokazuje dialog i działa po częściowej awarii.

Każda lekcja dostarcza jeden sprawdzalny fragment panelu. Ostatnia lekcja modułu łączy wcześniejsze decyzje w większy przypadek.

## Plan kompetencji

| Moduł | Dowód wykonania | Warunek przejścia |
| --- | --- | --- |
| 0. Zdarzenia | ślad wykonania, dostępny akordeon i ochrona przed starą odpowiedzią | uczeń przewiduje wynik i naprawia zmieniony przypadek |
| 1. Stan | testy reducera, jawne ograniczenia Proxy i legalne przejścia FSM | błędne przejście zostaje odrzucone, a reducer jest deterministyczny |
| 2. Pomiar | powtarzalna instalacja, profil operacji DOM i animacja respektująca preferencje | decyzja wynika z wyniku pomiaru, nie z hasła optymalizacyjnego |
| 3. Komponenty | dialog klawiaturowy, fallback i bezpieczny komponent | pełny przepływ działa bez myszy i bez `innerHTML` dla danych użytkownika |

## Granice

Kurs nie uczy całej składni JavaScript od podstaw. Nie zastępuje dokumentacji API ani kursu frameworka.

Kurs świadomie nie obiecuje:

- gwarantowanych 60 klatek na sekundę;
- pełnej reaktywności z pojedynczego płytkiego Proxy;
- bezpieczeństwa transakcji tylko dzięki blokadzie przycisku;
- pełnej obsługi błędów asynchronicznych przez synchroniczny wrapper renderowania.

## Stan jakości

- Struktura 12 lekcji: wdrożona
- Moduły 0 do 3: zredagowane, 12 lekcji kanonicznych
- Audyt techniczny i publikacyjny: 0 błędów, 0 ostrzeżeń
- Bramki kodowe: 12 CodeRunnerów, 35 przypadków testowych
- Test przeglądarkowy: nawigacja, quiz, odrzucenie błędnego kodu i podgląd Markdown zaliczone
- Test klawiaturą i małym ekranem: podstawowa ścieżka zaliczona, pełny audyt z czytnikiem ekranu pozostaje do pilotażu
- Pilotaż na co najmniej 5 osobach: niewykonany
- Deklaracja progu 80%: niedozwolona do czasu zebrania danych
