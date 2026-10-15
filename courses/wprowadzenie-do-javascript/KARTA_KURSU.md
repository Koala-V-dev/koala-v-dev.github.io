# Karta kursu „Wprowadzenie do JavaScript”

## Tożsamość

- Tytuł: Wprowadzenie do JavaScript
- Slug: `wprowadzenie-do-javascript`
- Autor lub opiekun merytoryczny: Zespół Centrum Wiedzy
- Stan: `szkic`
- Odbiorca: Każdy, kto chce opanować praktyczne programowanie w JavaScript od podstaw - od tworzenia logiki formularzy i kalkulatorów po dynamiczną manipulację drzewem DOM, maszyny stanów w grach planszowych oraz techniki Drag and Drop bez frameworków
- Poziom: podstawowy
- Kursy wymagane: `web-frontend`
- Kursy następujące: `javascript-ux-i-stany`, `react-framework`

## Obietnica kursu

Po ukończeniu kursu uczeń samodzielnie:

1. Pobiera dane z kontrolek formularzy HTML (pola tekstowe, liczbowe, listy rozwijane `<select>`, przyciski radiowe, suwaki `range` i checkboxy `.checked`), zabezpieczając kod przed błędami typów i brakiem wartości.
2. Przeprowadza precyzyjne obliczenia arytmetyczne oraz bezpieczne zaokrąglenia (`Math.ceil`, `Math.round`, `Math.floor`) w realnych kalkulatorach biznesowych.
3. Buduje czytelną logikę decyzyjną za pomocą instrukcji `if/else` oraz `switch`, bez błędów w punktach granicznych i progach cenowych.
4. Dynamicznie modyfikuje interfejs użytkownika w DOM: tworzy i usuwa elementy (`createElement`, `appendChild`), aktualizuje atrybuty (`src` w karuzelach i planszach gier), steruje stylami inline (`style.color`, `style.filter`) i zarządza stanem aplikacji.
5. Utrwala stan aplikacji w przeglądarce za pomocą interfejsu `localStorage`, obsługując liczniki, preferencje motywu i dane użytkownika.
6. Projektuje i implementuje deterministyczne maszyny stanów dla gier turowych (takich jak kółko i krzyżyk) wraz z blokadami ponownego kliknięcia i synchronizacją paneli graczy.
7. Implementuje interaktywne przeciąganie elementów za pomocą natywnego HTML5 Drag and Drop API (`draggable`, `dragstart`, `dragover`, `drop`, `dataTransfer`).

## Granice

- Kurs obejmuje: Czysty JavaScript (Vanilla JS ES6+) bez zewnętrznych bibliotek, manipulację drzewem DOM (`querySelector`, `getElementById`), obsługę zdarzeń (`addEventListener`), rzutowanie typów, instrukcje warunkowe, pętle, tablice, operacje na ciągach znaków, filtry CSS, `localStorage`, maszyny stanów w grach planszowych oraz HTML5 Drag and Drop API.
- Kurs świadomie nie obejmuje: Frameworków frontendowych (React, Vue), bibliotek narzędziowych (jQuery), skomplikowanej asynchroniczności (WebSockets, Workers) ani backendu (PHP/MySQL - omówionych w osobnych kursach).
- Wersje standardów: Nowoczesny standard ECMAScript (ES6+) wspierany natywnie przez wszystkie współczesne przeglądarki.
- Założone środowisko ćwiczeń: Przeglądarka internetowa z DevTools, wbudowany interaktywny widget CodeRunner (`<data-code-runner-js>`) z natychmiastową weryfikacją testów jednostkowych.

## Mapa kompetencji

| Kompetencja techniczna | Praktyczny projekt | Lekcja | Sposób weryfikacji |
| --- | --- | --- | --- |
| Odczyt wartości z pól i konwersja typów | Kalkulator kosztu paliwa | Moduł 0, Lekcja 1 | Testy asercji w CodeRunner |
| Zaokrąglenia w górę i podział jednostek | Kalkulator zużycia materiałów | Moduł 0, Lekcja 2 | Testy przypadków ułamkowych w CodeRunner |
| Grupy opcji radio i cenniki wariantowe | Konfigurator cennika z rabatami | Moduł 1, Lekcja 3 | Testy progów ilościowych i stawek |
| Wielokrotny wybór i akumulatory sumujące | Sumator usług z grupy checkboxów | Moduł 1, Lekcja 4 | Zaliczenie testu akumulatora cenowego |
| Analiza tekstu i dynamiczne style CSS | Weryfikator hasła z kolorami | Moduł 2, Lekcja 5 | Walidacja długości i obecności cyfry |
| Paski postępu i zdarzenia formularzy | Reaktywny pasek ukończenia kroków | Moduł 2, Lekcja 6 | Testy kalkulacji postępu w procentach |
| Filtry CSS i suwaki czasu rzeczywistego | Studio filtrów fotograficznych | Moduł 2, Lekcja 7 | Testy formatowania łańcucha filtrów |
| Tablice i cykliczne indeksowanie | Karuzela slajdów galerii z zapętleniem | Moduł 3, Lekcja 8 | Testy zapętlenia indeksów tablicy |
| Dynamiczne drzewo DOM i kolejki zadań | System zgłoszeń z usuwaniem | Moduł 4, Lekcja 9 | Testy logiki operacji na węzłach listy |
| Pamięć lokalna i trwałość stanu | Licznik odwiedzin i pamięć motywu | Moduł 4, Lekcja 10 | Testy rekordu w pamięci localStorage |
| Maszyny stanów i gry planszowe | Kółko i krzyżyk z blokadą pól | Moduł 5, Lekcja 11 | Testy walidacji ruchu i zmiany tury |
| HTML5 Drag and Drop API | Tablica Kanban z kolumnami | Moduł 6, Lekcja 12 | Testy upuszczania kart w strefach zrzutu |

## Plan modułów

| Moduł | Cel modułu | Lekcje | Zadanie integrujące | Warunek przejścia |
| --- | --- | --- | --- | --- |
| 0. Zmienne, typy i kalkulacje z formularzy | Pobieranie wartości, typy numeryczne, zaokrąglenia | 2 | Kalkulator remontowy | Prawidłowe zaokrąglenie i formatowanie |
| 1. Logika warunkowa, checkboxy i przyciski opcji | Obsługa `.checked`, drabinki `if/else`, grupy radio | 2 | Panel wyceny usług | Spełnienie testów progów i rabatów |
| 2. Dynamiczne style i walidacja danych | Pętle, wyrażenia regularne, filtry CSS i suwaki `range` | 3 | Studio fotograficzne i siła hasła | 100% zaliczonych asercji walidacji |
| 3. Tablice i komponenty multimedialne | Tablice danych, operacje na indeksach, zmiana `img.src` | 1 | Karuzela slajdów | Zapętlenie w obu kierunkach |
| 4. Interaktywne drzewo DOM i stan aplikacji | Tworzenie węzłów (`createElement`), `localStorage` | 2 | Interaktywny menedżer z pamięcią | Prawidłowa modyfikacja i trwałość stanu |
| 5. Maszyny stanów i gry turowe | Zmienne stanu, blokada kliknięć, synchronizacja paneli | 1 | Plansza do gry w kółko i krzyżyk | Deterministyczna zmiana tury i reset |
| 6. Zaawansowane interakcje i przeciąganie elementów | HTML5 Drag & Drop API, transfer danych, strefy zrzutu | 1 | Tablica zadań Kanban | Poprawne przenoszenie kart między strefami |

## Strategia dydaktyczna

- Punkt wyjścia: Realny problem inżynierski (jak przeliczyć koszyk, jak podmienić zdjęcie, jak zbadać hasło, jak przeprowadzić turę w grze planszowej, jak przenieść zadanie między kolumnami).
- Metoda pracy:
  1. Wizualny interfejs HTML na początku lekcji.
  2. Dogłębne wyjaśnienie mechanizmów języka JavaScript i modeli przeglądarki (dlaczego tak to działa pod maską).
  3. Omówienie pułapek programistycznych (np. niejawne łączenie napisów, brak preventDefault w dragover, nadpisanie zajętego pola planszy).
  4. Interaktywne widgety quizu ze zbalansowanymi odpowiedziami i dopasowywania pojęć.
  5. Samodzielne wyzwanie w edytorze CodeRunner z jednostkowymi testami asercji.
  6. Wdrożenie projektu z rozwiązaniem wzorcowym schowanym w sekcji rozwijanej.
