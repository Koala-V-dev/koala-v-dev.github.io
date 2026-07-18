# TerminalLab - wspolny rdzen

Ten katalog nie jest miejscem na scenariusze lekcji. Zostaje tu tylko wspolny material dla silnika terminala, np. katalog komend, walidatorow i zachowan powloki.

Scenariusze sa rozdzielone na dwa etapy:

- `../terminal-tutor/` - wprowadzenie step by step,
- `../terminal-missions/` - wyzwania operacyjne sprawdzane checkpointami.

## Zasada silnika

JS ma byc silnikiem, nie trescia kursu:

- parsuje komendy,
- symuluje system plikow,
- wykonuje akcje,
- sprawdza stan,
- pokazuje terminal.

JS nie powinien przechowywac narracji lekcji ani listy krokow dydaktycznych.

## Dwa typy widgetow

Tutor:

```html
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m0-01-pierwsza-sesja.md"></data-terminal-tutor>
```

Mission:

```html
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m0-01-skrzynka-zrzutowa.md"></data-terminal-mission>
```

## Walidacja

W misjach walidujemy stan, nie string komendy:

- `cwd="/home/egzamin/..."`,
- `exists="/home/egzamin/plik.txt"`,
- `missing="/home/egzamin/stary.txt"`,
- `stdout-contains="..."`,
- `mode="0640"`,
- `service-state="active"`.

Porownanie pelnego stringa komendy jest dopuszczalne tylko w tutorze, kiedy komenda jest jawnie uczona.
