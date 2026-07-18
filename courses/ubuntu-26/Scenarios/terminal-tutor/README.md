# Terminal Tutor - scenariusze prowadzone

Ten katalog zawiera etap wprowadzający.

Tutor:

- uczy jednej komendy albo jednego mechanizmu naraz,
- pokazuje komendy w realnym scenariuszu,
- nie dubluje pełnego tekstu lekcji,
- nie udaje wyzwania,
- daje krótki komentarz po wyniku.

Jeżeli późniejsza misja wymaga komendy, tutor albo lekcja musi ją wcześniej wprowadzić. Misja nie może być pierwszym miejscem, w którym uczeń ma zgadnąć nowe narzędzie.

`<command>` i `<run>` są ukryte pod przyciskiem informacji w UI. Z samego `<teach>` ma wynikać, co uczeń ma zrobić. `<run>` jest dodatkowym kontekstem, nie główną instrukcją.

Docelowy tag:

```html
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m0-01-pierwsza-sesja.md"></data-terminal-tutor>
```

## Docelowa kolejność

1. `m0-01-pierwsza-sesja.md`
   - pierwszy kontakt z katalogiem domowym, spacjami w nazwach i prostą pracą na plikach

2. `m1-01-mapa-systemu.md`
   - `/etc/os-release`, `/etc/hostname`, `cat`, `hostname`

3. `m1-02-kopia-i-odtworzenie.md`
   - `cp`, `rm`, sprawdzenie kopii i odtworzenie pliku

4. `m2-01-uzytkownik-lokalny.md`
   - `whoami`, `id`, `groups`, `sudo adduser`, `groupadd`, `usermod -aG`, `getent`

5. `m2-02-uprawnienia-katalogu.md`
   - `ls -l`, `chown`, `chgrp`, `chmod`, `su`, `exit`
   - scenariusz ma sens dopiero po użytkownikach i grupach

6. `m1-03-czytanie-logow.md`
   - dłuższy tekst, `less`, `tail`, `grep`
   - nazwa pliku jest historyczna; dydaktycznie ten scenariusz należy później

## Kolejność tematów

Najpierw pliki i katalogi. Potem użytkownicy i `sudo`. Potem uprawnienia. Dopiero później dłuższy tekst, `less`, `tail`, `grep` i potoki.

`sudo` nie jest ciężkim tematem. Cięższe poznawczo są narzędzia do czytania i filtrowania tekstu oraz łączenie komend przez `|`.

## Kontrakt kroku

```html
<step id="pwd">
  <teach>Instrukcja, która wystarcza bez otwierania przycisku informacji.</teach>
  <command>pwd</command>
  <run>Dodatkowy kontekst pod przyciskiem informacji.</run>
  <expect stdout="/home/egzamin"></expect>
  <explain>Komentarz po wykonaniu. Krótki, konkretny, bez powtarzania instrukcji.</explain>
</step>
```
