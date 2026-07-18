# Indeks scenariuszy terminala

Ten indeks opisuje docelową kolejność użycia scenariuszy. Nazwy części plików są jeszcze historyczne, ale kolejność dydaktyczna ma wynikać z pracy w systemie, nie z numerków w nazwach.

## Moduł 0

1. `../terminal-tutor/m0-01-pierwsza-sesja.md`
   - typ: `terminal-tutor`
   - zakres: `pwd`, `ls`, `ls -la`, `mkdir`, argumenty ze spacjami, `rmdir`, `cd`, `touch`, `mv`
   - cel: pierwsza praca w katalogu domowym bez zgadywania składni

2. `../terminal-missions/m0-01-skrzynka-zrzutowa.md`
   - typ: `terminal-mission`
   - zakres: poruszanie się po katalogach, przenoszenie plików, sprzątanie po błędzie ze spacjami
   - cel: samodzielnie uporządkować katalog na komendach z tutora

## Moduł 1: pliki i katalogi

3. `../terminal-tutor/m1-01-mapa-systemu.md`
   - typ: `terminal-tutor`
   - komendy: `cat`, `hostname`
   - cel: odczytać `/etc/os-release`, `/etc/hostname` i sprawdzić nazwę przez `hostname`

4. `../terminal-missions/m1-01-pakiet-orientacyjny.md`
   - typ: `terminal-mission`
   - komendy: `cat`, `hostname`
   - cel: sprawdzić wersję Ubuntu i nazwę komputera

5. `../terminal-tutor/m1-02-kopia-i-odtworzenie.md`
   - typ: `terminal-tutor`
   - komendy: `cp`, `rm`, `ls`, `cat`
   - cel: zrobić kopię, usunąć zły plik i odtworzyć go z kopii

6. `../terminal-missions/m1-02-odzyskaj-plan.md`
   - typ: `terminal-mission`
   - komendy: `cp`, `rm`, `ls`, `cat`
   - cel: odzyskać utracony plik i sprawdzić wynik w terminalu

## Moduł 2: użytkownicy i sudo

7. `../terminal-tutor/m2-01-uzytkownik-lokalny.md`
   - typ: `terminal-tutor`
   - komendy: `whoami`, `id`, `groups`, `sudo adduser`, `groupadd`, `usermod -aG`, `getent`
   - cel: sprawdzić własną tożsamość w systemie, utworzyć konto i grupę, potwierdzić stan

8. `../terminal-missions/m2-01-konto-operatora.md`
   - typ: `terminal-mission`
   - komendy: `whoami`, `id`, `groups`, `sudo adduser`, `groupadd`, `usermod -aG`, `getent`
   - cel: przygotować lokalne konto robocze i grupę bez wchodzenia jeszcze w `chmod`

## Moduł 2: uprawnienia

9. `../terminal-tutor/m2-02-uprawnienia-katalogu.md`
   - typ: `terminal-tutor`
   - komendy: `ls -l`, `chown`, `chgrp`, `chmod`, `su`, `exit`
   - cel: ustawić właściciela, grupę i prawa katalogu, a potem sprawdzić dostęp z sesji właściwego użytkownika

10. `../terminal-missions/m2-02-katalog-projektu.md`
   - typ: `terminal-mission`
   - komendy: `ls -l`, `chown`, `chgrp`, `chmod`, `su`, `exit`
   - cel: przygotować katalog projektu dla użytkownika i grupy, potem sprawdzić wynik i odmowę dostępu z obcego konta

## Moduł 3: diagnostyka wyników komend

11. `../terminal-tutor/m3-01-diagnostyka-wynikow.md`
   - typ: `terminal-tutor`
   - komendy: `lshw`, `sudo lshw`, `less`, `tail`, `grep`, `|`, `>`, `>>`, `lsblk -f`, `df -h`, `free -h`, `top`, `htop`, `ps -ef`
   - cel: wyciągnąć dane diagnostyczne z długiego wyniku i zapisać je do plików

12. `../terminal-missions/m3-01-raport-diagnostyczny.md`
   - typ: `terminal-mission`
   - komendy: `mkdir`, `sudo lshw | grep product`, `mv`, `lsblk -f`, `df -h`, `free -h`, `ps -ef | grep networkd`, `>`, `>>`
   - cel: przygotować sprawdzalny raport stanowiska, bez kopiowania przebiegu z tutora

## Moduł 4: sieć i UFW

Scenariusze sieciowe zostają jako przedsmak kursu serwerowego:

- `../terminal-tutor/m4-01-ufw-podstawy.md`,
- `../terminal-missions/m4-01-regula-testowa-ufw.md`.

Pakowanie raportu i archiwa nie są rdzeniem modułu 3. Mogą wrócić jako dodatek, jeśli po diagnostyce będą miały realny powód.

## Scenariusze do usunięcia z wczesnej ścieżki

`systemctl`, `journalctl` i diagnoza usług nie wchodzą do podstaw kursu Desktop. Jeżeli wrócą, to jako późny moduł albo osobny kurs serwerowy.
