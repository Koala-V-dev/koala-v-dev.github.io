# Plan dydaktyczny kursu Ubuntu 26.04 Desktop

Ten plik ustala kolejność nauki w kursie. Nie jest tekstem dla ucznia.

Kurs ma uczyć pracy w realnym systemie Ubuntu Desktop. Uczeń ma wykonywać konkretne operacje, widzieć ich skutki i umieć sprawdzić wynik. Scenariusze mają wynikać z normalnej pracy w systemie: porządkowanie plików, tworzenie kont, sprawdzanie dostępu, robienie kopii, odtwarzanie pliku, czytanie tekstu diagnostycznego, ustawienie sieci, cofnięcie reguły firewalla.

Scenariusz ma wynikać z normalnej pracy przy Ubuntu Desktop. Kurs nie zaczyna od awarii usług, hardeningu ani zadań serwerowych. Ton ma być techniczny i prosty, ale nie dziecięcy.

## 1. Twarda kolejność tematów

Kolejność musi wynikać z zależności między umiejętnościami:

1. GUI, instalacja, katalog domowy.
2. Pliki i katalogi w terminalu.
3. Kopiowanie, przenoszenie, usuwanie i odtwarzanie plików.
4. Użytkownicy i `sudo`.
5. Uprawnienia plików i katalogów.
6. Dłuższy tekst: `less`, `tail`, `grep`.
7. Potoki i łączenie komend przez `|`.
8. Podstawowa diagnostyka stanu maszyny: pamięć, procesy, miejsce na dysku.
9. Sieć podstawowa.
10. UFW jako kontrola dostępu.

Partycjonowanie i dyski są osobną lekcją ekranową. Nie wciskamy ich do widgetu terminalowego, bo wymagają realnych zrzutów ekranu, widoku narzędzi i ostrożnego pokazania skutków operacji.

Najważniejsza korekta:

- `sudo` nie jest ciężkim tematem. To normalny element pracy z Ubuntu.
- `less`, `tail`, `grep` i potoki są cięższe poznawczo niż samo `sudo`.
- Uprawnienia nie mają sensu przed użytkownikami i grupami.
- Użytkownicy nie mają sensu, jeśli uczeń nie umie jeszcze pracować na plikach i katalogach.

## 2. Konstrukcja każdej lekcji

Każda lekcja terminalowa ma mieć stały układ:

1. **Merytoryczne wprowadzenie**

   Krótko: co uczeń zaraz zrobi i dlaczego to jest normalna praca w systemie.

2. **Tutor**

   Tutor pokazuje komendy w scenariuszu. Nie dubluje pełnego tekstu lekcji. Nie robi z ucznia dziecka. Każdy krok ma mieć polecenie do wykonania i krótki komentarz po wyniku.

3. **Zestawienie komend**

   Tabela po tutorze. Uczeń ma móc wrócić do składni bez przeklikiwania widgetu.

4. **Dopowiedzenia**

   Tylko tam, gdzie tabela nie wystarcza. Przykład: spacje w nazwach, różnica między plikiem a katalogiem, właściciel a grupa.

5. **Misja / wyzwanie**

   Realne zadanie bez prowadzenia za rękę. Ma sprawdzać użycie komend z lekcji, nie zgadywanie nowych narzędzi.

6. **Co masz wynieść z tej lekcji**

   Krótkie punkty z realnymi umiejętnościami. Bez ogólników.

## 3. Moduł 0: Ubuntu jako środowisko pracy

Cel: uczeń ma działający system i zna podstawowy układ Ubuntu Desktop.

Lekcje:

1. `Czym jest Linux`
2. `Instalacja w VirtualBox`
3. `Ustawienia GNOME`
4. `Katalogi w Ubuntu`
5. `Pierwszy terminal`

Zakres terminala w module 0:

- `pwd`,
- `ls`,
- `ls -la`,
- `cd`,
- `mkdir`,
- `rmdir`,
- `touch`,
- `mv`.

Do poprawy:

- `Pierwszy terminal` nie powinien uczyć `rm`, `rm -r` i `man` jako pełnych komend startowych.
- `rm` może pojawić się jako ostrzeżenie albo późniejsze narzędzie po kopii.
- `man` ma sens dopiero, gdy uczeń zna już kilka komend i potrafi odróżnić składnię od opisu.

Realny scenariusz:

Uczeń porządkuje własny katalog: tworzy katalog z nazwą zawierającą spacje, widzi błąd argumentów, sprząta puste katalogi, tworzy plik, zmienia nazwę, wraca do katalogu domowego.

## 4. Moduł 1: Pliki i katalogi w terminalu

Cel: uczeń umie pracować na własnych plikach, zanim dostanie użytkowników, `sudo` i uprawnienia.

Aktualna kolejność:

1. Pliki i katalogi
2. Wstępne informacje o systemie
3. Kopie i odtwarzanie

Komendy:

- `pwd`,
- `ls`,
- `ls -la`,
- `cd`,
- `mkdir`,
- `touch`,
- `mv`,
- `cp`,
- `rm`,
- `rmdir`,
- `cat` do krótkiego sprawdzenia treści.

Decyzje:

- `cat` jest lekkie, jeśli czytamy krótki plik.
- `less`, `tail`, `grep` nie należą jeszcze do tego modułu.
- Logi nie należą jeszcze do tego modułu.
- Potoki nie należą jeszcze do tego modułu.

Realne scenariusze:

- przenieść pobrany plik z `Pobrane` do katalogu projektu,
- zmienić nazwę pliku na czytelną,
- zrobić kopię przed usuwaniem,
- usunąć zły plik i odtworzyć go z kopii,
- sprawdzić zawartość krótkiego pliku przez `cat`.

## 5. Moduł 2: Użytkownicy, `sudo` i uprawnienia

Cel: uczeń rozumie, kim jest w systemie, po co są grupy i jak właściciel/grupa/prawa wpływają na dostęp do katalogu.

Ten moduł zamyka pierwszy blok administracyjny. Bez użytkowników i grup nie ma sensu tłumaczyć właściciela, grupy i `rwx`.

Komendy:

- `whoami`,
- `id`,
- `groups`,
- `getent`,
- `sudo`,
- `adduser`,
- `groupadd`,
- `usermod -aG`,
- `ls -l`,
- `chown`,
- `chgrp`,
- `chmod`,
- `su`,
- `exit`.

Zakres:

- aktualny użytkownik,
- UID i GID,
- grupy,
- katalog domowy,
- konto utworzone przez `adduser`,
- `sudo` jako wykonanie operacji administracyjnej,
- grupa jako sposób organizowania dostępu.
- właściciel, grupa i pozostali,
- `r`, `w`, `x` na katalogu,
- audyt uprawnień przez `ls -l`,
- test dostępu z sesji innego użytkownika.

Decyzje:

- `sudo` nie jest ciężkim tematem. Trzeba go wprowadzić normalnie i wcześnie, bo Ubuntu używa go w codziennej administracji.
- `useradd` jest później niż `adduser`, bo jest mniej przyjazny i wymaga większej świadomości.
- Usuwanie konta z katalogiem domowym jest osobnym ćwiczeniem, po kopiach i po rozumieniu skutków.
- Uprawnienia kończą moduł 2, bo są naturalną konsekwencją kont i grup.
- Niskopoziomowe zarządzanie kontami nie wchodzi do głównej ścieżki desktopowej na tym etapie.

Realne scenariusze:

- sprawdzić aktualne konto,
- utworzyć konto `technik`,
- ustawić hasło,
- utworzyć grupę `audyt`,
- dodać użytkownika do grupy,
- sprawdzić wynik przez `id` i `getent`.
- przygotować katalog projektu dla użytkownika i grupy,
- sprawdzić odmowę dostępu z konta spoza grupy.

Aktualne lekcje:

1. `Użytkownicy i sudo`
2. `Uprawnienia plików i katalogów`

## 6. Moduł 3: Diagnostyka wyników komend

Cel: uczeń uczy się wyciągać konkretne dane z długich wyników komend diagnostycznych i zapisywać je do plików.

To nie jest moduł o logach usług. To jest praca z wynikiem: obejrzeć długi output, ograniczyć go, zapisać dowód i wrócić do niego bez przewijania całego terminala.

Komendy:

- `less`,
- `tail`,
- `grep`,
- `|`,
- `>`,
- `>>`,
- `lshw`,
- `lsblk -f`,
- `df -h`,
- `free -h`,
- `ps -ef`,
- `top`,
- `htop`.

Zakres:

- długi wynik komendy diagnostycznej,
- porównanie `lshw` bez `sudo` i `sudo lshw`, w tym ostrzeżenia o niepełnym wyniku,
- obejrzenie wyniku przez `less`,
- pokazanie końcówki zapisanego wyniku przez `tail`,
- filtrowanie po frazie przez `grep`,
- potok jako przekazanie wyniku jednej komendy do drugiej,
- zapis wyniku do pliku przez `>` i dopisanie przez `>>`,
- podstawowy stan maszyny: sprzęt, dyski, miejsce, pamięć, procesy.

Zakaz na tym etapie:

- nie robimy diagnostyki usług,
- nie mówimy o „usługa się wywala”,
- nie używamy `journalctl`,
- nie używamy `systemctl`,
- nie robimy pakietu serwerowego ani hardeningu.

Realne scenariusze:

- z długiego wyniku `lshw` wyciągnąć modele sprzętu,
- zapisać pełny wynik do pliku i sprawdzić jego końcówkę,
- zapisać dyski i zajętość miejsca w jednym pliku raportu,
- zapisać pamięć do osobnego pliku,
- przefiltrować listę procesów i zapisać pasującą linię.

Aktualna lekcja:

1. `Diagnostyka wyników komend`

## 7. Lekcja ekranowa: partycjonowanie i dyski

Partycjonowanie i dyski wymagają realnych zrzutów ekranu. Ta lekcja nie powinna być terminalowym widgetem.

Zakres:

- widok dysków i partycji,
- różnica między dyskiem, partycją i systemem plików,
- montowanie jako koncepcja,
- ostrożność przy operacjach niszczących dane,
- realne screeny z Ubuntu/VirtualBox.

## 8. Moduł 4: Sieć i UFW

Cel: uczeń rozumie podstawową łączność i umie kontrolować prostą regułę firewalla.

To jest dobry przedsmak kolejnego kursu serwerowego. W tym kursie zostajemy przy podstawach Desktop: adres, brama, DNS, test połączenia i prosta reguła UFW.

Komendy:

- `ip a`,
- `ip r`,
- `ping`,
- `resolvectl`,
- `sudo ufw status`,
- `sudo ufw enable`,
- `sudo ufw allow`,
- `sudo ufw delete`.

Zakres:

- adres IP,
- brama,
- DNS,
- test łączności,
- port jako numer dostępu do usługi,
- UFW jako lista reguł.

Decyzje:

- Nie zaczynać od „ekspozycji usług”.
- Najpierw uczeń musi rozumieć IP, DNS i port.
- SSH może być przykładem portu `22/tcp`, ale pełna lekcja SSH to osobny etap.

Realny scenariusz:

Uczeń sprawdza adres maszyny, testuje połączenie, włącza UFW, dodaje regułę testową, sprawdza status i usuwa regułę.

## 9. Rzeczy do przesunięcia później

Te tematy nie powinny blokować początkującego kursu Desktop:

- diagnoza usług,
- `systemctl`,
- `journalctl`,
- awarie usług,
- hardening SSH,
- Fail2ban,
- AppArmor,
- Netplan produkcyjny,
- NFS,
- Samba,
- `chroot`,
- automatyzacja timerami.

Można je zapowiedzieć, ale nie budować na nich podstawowych ćwiczeń.

## 10. Kontrakt komend

Komenda może pojawić się w misji tylko wtedy, gdy była wcześniej:

- w tutorze tej lekcji,
- w tabeli komend tej lekcji,
- albo w poprzedniej lekcji jako ćwiczona umiejętność.

Nie używamy misji do pierwszego pokazania narzędzia.

## 11. Najpilniejsze poprawki w obecnym kursie

1. `Pages/Moduł 0/Pierwszy terminal.md`
   - usunąć `rm`, `rm -r`, `man` z głównego zestawu startowego albo przenieść je do zapowiedzi,
   - zostawić tylko komendy faktycznie ćwiczone w tutorze.

2. `Pages/Moduł 1/01 - Mapa systemu bez encyklopedii.md`
   - zakres: `cat`, `hostname`,
   - odczyt `/etc/os-release`, `/etc/hostname` i szybkie sprawdzenie nazwy przez `hostname`,
   - bez logów, bez `grep`, bez potoków.

3. Obecne lekcje kopii i odtwarzania
   - przenieść przed użytkowników i uprawnienia,
   - to ma być fundament przed `rm` i pracą administracyjną.

4. Obecny moduł użytkowników
   - zostawić przed uprawnieniami,
   - `sudo` tłumaczyć normalnie, nie jako ciężki temat.

5. Obecny moduł uprawnień
   - już przeniesiony po użytkownikach,
   - trzymać jako zamknięcie modułu 2.

6. Lekcja o dłuższym tekście i logach
   - utworzyć w module 3 jako nową lekcję bez numeracji w nazwie,
   - przepisać tak, żeby log był tekstem ze śladem, nie diagnozą usług.

7. Lekcja o potokach
   - utworzyć w module 3 jako nową lekcję bez numeracji w nazwie,
   - przesunąć po `grep`,
   - dodać tutor i misję potokową,
   - nie mieszać `sort` i `uniq`, jeśli nie są ćwiczone.

8. `Pages/Wprowadzenie.md`
   - przepisać dla ucznia,
   - usunąć ciężki język strategii, Servera i wielkiej administracji.

## 12. Test jakości lekcji

Po lekcji uczeń ma umieć powiedzieć:

```text
Co zrobiłem.
Po co to zrobiłem.
Jaką komendą.
Jaki wynik potwierdza, że operacja się udała.
Gdzie tego użyję w normalnej pracy z Ubuntu.
```

Jeżeli odpowiedzią jest tylko lista komend, lekcja jest źle zaprojektowana.
