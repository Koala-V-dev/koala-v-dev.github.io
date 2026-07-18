# Terminal Missions - wyzwania operacyjne

Ten katalog zawiera drugi etap nauki terminala. Tutor pokazuje komendy w scenariuszu. Misja sprawdza, czy uczeń potrafi użyć tych samych narzędzi bez narzuconej sekwencji.

Misja:

- opisuje stan początkowy i stan docelowy,
- nie podaje gotowej kolejności komend,
- nie sprawdza dokładnego stringa komendy,
- ocenia niezależne kryteria stanu systemu,
- wymaga rozpoznania przed zaliczeniem,
- wymaga audytu, czyli sprawdzenia efektu w terminalu.

Mechanika podpowiedzi nie jest podstawowym sposobem uczenia. Misję poprzedza tutor i tabela komend w lekcji. Podpowiedź może ratować utknięcie, ale nie może zastępować dydaktyki.

Docelowy tag:

```html
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m0-01-skrzynka-zrzutowa.md"></data-terminal-mission>
```

## Docelowa kolejność

1. `m0-01-skrzynka-zrzutowa.md`
   - porządkowanie katalogu po błędzie ze spacjami

2. `m1-01-pakiet-orientacyjny.md`
   - wersja Ubuntu, nazwa komputera, `cat`, `hostname`

3. `m1-02-odzyskaj-plan.md`
   - kopia, usunięcie, odtworzenie pliku i audyt wyniku

4. `m2-01-konto-operatora.md`
   - utworzenie konta, hasło, grupa i audyt przez `id`, `groups`, `getent`

5. `m2-02-katalog-projektu.md`
   - właściciel, grupa i prawa katalogu po wcześniejszej lekcji o użytkownikach

6. `m1-03-slad-w-logach.md`
   - dłuższy tekst, `less`, `tail`, `grep`, bez potoków
   - nazwa pliku jest historyczna; dydaktycznie ta misja należy później

## Kontrakt scenariusza

```html
<data-terminal-mission-scenario id="m0-01-pakiet-diagnostyczny" title="Pakiet diagnostyczny">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin">...</world>

  <brief>Operacyjny opis sytuacji. Może używać <br>, gdy tekst musi mieć czytelny podział.</brief>
  <objective>Stan końcowy, który trzeba uzyskać.</objective>

  <assessment min-evidence="2">
    <evidence id="downloads-seen" label="Sprawdzono katalog `Pobrane`.">
      <expect observed-path="/home/egzamin/Pobrane"></expect>
      <nudge after="45s">Krótka podpowiedź wynikająca z braku rozpoznania.</nudge>
    </evidence>

    <condition id="original-file-moved" label="Oryginalny plik został przeniesiony.">
      <expect exists="/home/egzamin/Analiza terminala/komendy.txt" missing="/home/egzamin/Pobrane/komendy.txt" file="/home/egzamin/Analiza terminala/komendy.txt" file-contains-all="pwd,ls,cd"></expect>
      <nudge after="45s">Podpowiedź wynikająca ze stanu, nie gotowa odpowiedź.</nudge>
    </condition>

    <audit id="final-target-audit" label="Zweryfikowano katalog docelowy.">
      <expect observed-path="/home/egzamin/Analiza terminala"></expect>
    </audit>
  </assessment>
</data-terminal-mission-scenario>
```

Panel misji pokazuje:

- rozpoznanie,
- stan systemu,
- audyt.

To nie jest lista kroków. Kryteria mogą zapalać się w różnej kolejności, bo oceniany jest końcowy stan i dowody pracy, nie jedna wymuszona ścieżka.
