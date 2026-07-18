# Założenia przebudowy kursu Ubuntu 26.04 LTS

Poprzedni układ był zły z prostego powodu: moduły były nazwami tematów, nie drogą uczenia. "APT i Snap", "systemd", "UFW", "SSH", "rsync" to nie są jeszcze lekcje. To etykiety narzędzi. Uczeń po takiej strukturze wie, że coś istnieje, ale nie wie, kiedy, po co i jak tego użyć.

Nowy kurs musi mieć oś dydaktyczną:

> Uczeń przechodzi od użytkownika Ubuntu Desktop do osoby, która umie myśleć jak początkujący administrator Linuksa.

To oznacza, że każda kolejna część musi rozwiązywać coraz trudniejszy problem. Nie wolno zaczynać od "poznajmy komendę". Trzeba zaczynać od napięcia dydaktycznego: coś nie działa, coś trzeba zabezpieczyć, coś trzeba sprawdzić, coś trzeba odtworzyć, coś trzeba zautomatyzować.

---

## Czego ten kurs nie ma robić

- Nie ma być informatorem o Ubuntu.
- Nie ma być listą komend Bash.
- Nie ma być miniaturowym kursem Ubuntu Server udającym Desktop.
- Nie ma mieć 20 plików po 40 linijek, które tylko opisują, co kiedyś można napisać.
- Nie ma robić z ucznia operatora kopiuj-wklej.

---

## Właściwa struktura po module 0

Po module 0 kurs powinien mieć **4 duże rozdziały**, a nie drobno posiekane moduły. Każdy rozdział ma być pisany jako pełny blok dydaktyczny, z prawdziwą merytoryką, przykładami, obrazami i ćwiczeniami.

### Rozdział 1: Linux jako system plików, procesów i tekstu

Uczeń musi zrozumieć podstawową różnicę między Windows a Linuksem: w Linuksie bardzo dużo rzeczy jest reprezentowane jako plik, strumień tekstu, proces albo wpis w logu.

To nie jest rozdział "nauka terminala". Terminal jest tylko lupą. Prawdziwy temat to sposób, w jaki Linux organizuje rzeczywistość.

Materiał powinien objąć:

- drzewo katalogów od `/`, ale bez encyklopedii FHS,
- różnicę między katalogiem domowym użytkownika a systemem,
- ścieżki, ukryte pliki, konfigurację użytkownika,
- pliki zwykłe, katalogi, linki symboliczne, urządzenia,
- standardowe strumienie `stdin`, `stdout`, `stderr`,
- potoki jako model przetwarzania informacji,
- `grep`, `find`, `less`, `tail`, `wc`, `sort`, `uniq` jako narzędzia śledcze, nie lista komend,
- pierwszy kontakt z logami jako tekstem, który można filtrować.

Pytanie prowadzące rozdział:

> Gdzie system trzyma informacje i jak je wydobyć bez klikania po omacku?

Efekt końcowy:

Uczeń dostaje folder z bałaganem, logiem tekstowym i kilkoma plikami konfiguracyjnymi. Musi odnaleźć konkretną informację, wyjaśnić ścieżkę, znaleźć błąd w logu i zapisać wynik do raportu.

### Rozdział 2: System żyje, czyli procesy, usługi, start i awarie

Ten rozdział ma być odpowiednikiem mocnych lekcji diagnostycznych z Windows 11. Nie "co to jest systemd", tylko: "system startuje wolno", "aplikacja znika", "usługa nie działa", "co zostawiło ślad?".

Materiał powinien objąć:

- UEFI, GRUB, jądro, initramfs i systemd jako łańcuch startu,
- PID 1 i zależności usług,
- proces kontra usługa,
- `ps`, `top/htop`, `pgrep`, `kill` w kontekście diagnozy,
- `systemctl status`, `restart`, `enable`, `disable`, `is-failed`,
- `journalctl` jako odpowiednik dochodzenia po zdarzeniu,
- `systemd-analyze` do analizy startu,
- podstawy sesji graficznej: GDM, GNOME, Wayland, X11 jako źródła realnych problemów desktopowych,
- różnicę między objawem a przyczyną.

Pytanie prowadzące rozdział:

> Co dokładnie działa w systemie, kto to uruchomił i gdzie zostały dowody awarii?

Efekt końcowy:

Uczeń diagnozuje symulowaną awarię: jedna usługa nie startuje, jeden proces zawiesza sesję, a start systemu jest opóźniony. Ma znaleźć przyczynę po statusie usługi, PID i logach, a nie zgadywać.

### Rozdział 3: Tożsamość, dane i granice dostępu

Tutaj kurs musi wejść w merytorykę, której zwykły użytkownik nie ma, a przyszły administrator musi ją rozumieć. Nie chodzi o samo `chmod 755`. Chodzi o to, dlaczego jeden użytkownik może zniszczyć dane, a drugi nie; dlaczego `sudo` jest narzędziem kontroli, a nie magicznym młotkiem; dlaczego backup i szyfrowanie rozwiązują inne problemy.

Materiał powinien objąć:

- użytkownik, grupa, UID, GID,
- właściciel pliku i model `rwx`,
- prawa katalogu kontra prawa pliku,
- `chmod`, `chown`, `umask`, podstawowe ACL tylko wtedy, gdy jest uzasadnienie,
- `sudo`, grupa `sudo`, zasada najmniejszych uprawnień,
- typowe błędy: edytowanie plików użytkownika jako root, psucie właścicieli w katalogu domowym,
- dyski, partycje, systemy plików, UUID, punkty montowania,
- `lsblk`, `df`, `du`, `mount`, podstawy `fstab`,
- backup przez `rsync` jako model różnicy między kopią a synchronizacją,
- szyfrowanie danych i granice ochrony hasłem logowania.

Pytanie prowadzące rozdział:

> Kto ma dostęp do danych, gdzie te dane fizycznie są i jak je odzyskać po błędzie?

Efekt końcowy:

Uczeń buduje katalog projektu z sensownymi prawami, tworzy konto testowe, pokazuje różnicę w dostępie, montuje nośnik/katalog backupu, robi kopię i odtwarza usunięty plik. Bez tego rozdział nie jest zaliczony.

### Rozdział 4: Sieć, zdalna praca i automatyzacja jako most do Server

Dopiero teraz kurs ma prawo dotknąć tematów serwerowych, ale nadal z perspektywy Desktopa. Sieć nie jako "Netplan od zera", tylko jako diagnoza: czy mam adres, czy mam bramę, czy działa DNS, czy port nasłuchuje, czy firewall mnie blokuje, czy mogę wejść po SSH.

Materiał powinien objąć:

- adres IP, maskę, bramę, DNS i trasę domyślną,
- `ip a`, `ip r`, `resolvectl`, `ping`, `curl`, `ss`,
- różnicę między "nie działa internet", "nie działa DNS" i "nie działa usługa",
- UFW jako kontrolę dostępu do usług, nie jako ozdobny firewall,
- SSH: klient, serwer, klucz publiczny/prywatny, fingerprint,
- kopiowanie plików przez `scp` albo `sftp`,
- podstawową współpracę z Windows przez udział lub prosty transfer,
- Bash jako automatyzację powtarzalnej diagnozy,
- `cron` albo `systemd timer` dopiero wtedy, gdy istnieje skrypt wart uruchamiania,
- tryb ratunkowy, snapshot VM, Live ISO i `chroot` jako finałowa procedura przetrwania.

Pytanie prowadzące rozdział:

> Jak udowodnić, gdzie kończy się mój komputer, gdzie zaczyna sieć i jak zarządzać systemem bez siedzenia przed jego ekranem?

Efekt końcowy:

Uczeń ma dwie maszyny w laboratorium. Sprawdza łączność, uruchamia usługę testową, otwiera konkretny port w UFW, łączy się przez SSH kluczem, kopiuje plik, uruchamia skrypt audytu i automatyzuje jego wykonanie. Na końcu robi snapshot i przechodzi przez kontrolowaną procedurę ratunkową.

---

## Standard prawdziwej lekcji

Każda lekcja musi mieć mięso. Minimalny standard:

1. **Problem** - konkretny objaw lub zadanie, które uczeń rozumie.
2. **Model działania** - co dzieje się pod spodem, bez lania wody.
3. **Demonstracja** - wynik komend, zrzuty ekranu albo porównanie stanów przed i po.
4. **Ćwiczenie** - uczeń sam wykonuje operację, która może się udać albo nie.
5. **Diagnoza błędu** - co najczęściej pójdzie źle i jak to rozpoznać.
6. **Punkt kontrolny** - pytanie sprawdzające rozumienie mechanizmu, nie pamięć nazwy komendy.

Jeśli lekcja nie daje uczniowi nowej sprawczości, nie jest lekcją.

---

## Progresja kursu

Po module 0 uczeń:

- zna pulpit i pierwszy terminal.

Po rozdziale 1:

- umie poruszać się po systemie plików,
- umie wydobyć informację z tekstu,
- rozumie strumienie i potoki,
- przestaje traktować terminal jak zaklęcie.

Po rozdziale 2:

- umie sprawdzić proces,
- umie sprawdzić usługę,
- umie przeczytać log,
- umie odróżnić objaw od przyczyny.

Po rozdziale 3:

- rozumie prawa dostępu,
- potrafi zabezpieczyć katalog,
- potrafi zrobić i odtworzyć backup,
- rozumie różnicę między hasłem, uprawnieniami i szyfrowaniem.

Po rozdziale 4:

- umie diagnozować podstawową sieć,
- umie kontrolować dostęp firewallem,
- umie pracować przez SSH,
- umie automatyzować własną diagnostykę,
- ma mentalny most do Ubuntu Server.

---

## Co przenieść do przyszłego Ubuntu Server

Te tematy nie powinny dominować kursu Desktop:

- pełna konfiguracja Netplan,
- NFS jako osobna usługa serwerowa,
- Fail2ban,
- AppArmor jako osobny moduł,
- hardening SSH produkcyjnego serwera,
- hosting usług,
- zaawansowane systemd units,
- monitoring serwerowy,
- polityki backupu dla usług.

Można je zasygnalizować, ale nie robić z nich osi kursu. Ten kurs ma przygotować grunt, nie spalić materiał serwerowy za wcześnie.
