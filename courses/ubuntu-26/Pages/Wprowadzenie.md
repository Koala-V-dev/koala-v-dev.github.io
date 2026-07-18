<div class="hero-header text-center">
  <h1 class="display-3 gradient-text-primary fw-900 mb-3">Ubuntu 26.04 LTS</h1>
  <p class="lead text-muted fs-4">Nie kurs o Linuksie. Kurs myślenia systemowego na Linuksie.</p>
</div>

Ten kurs ma nauczyć pracy z Ubuntu tak, żeby uczeń nie kończył z listą komend do przepisania, tylko z modelem działania systemu. Po module 0 zna pulpit, instalację i pierwszy kontakt z terminalem. Dalej nie idziemy w "kolejne funkcje Ubuntu". Idziemy w umiejętność rozumienia, diagnozowania i naprawiania systemu.

Ubuntu Desktop jest tu laboratorium. Uczeń ma widzieć GUI, ale stopniowo odkrywać mechanizmy, które później spotka na Ubuntu Server: pliki konfiguracyjne, procesy, usługi, logi, uprawnienia, sieć, backup, automatyzację i tryb ratunkowy.

To ma być przejście między kursem Windows 11 a przyszłym Ubuntu Server. Windows uczył kontrolowania systemu użytkownika i diagnozy lokalnej. Ubuntu ma dołożyć filozofię uniksową: wszystko jest plikiem, mały program robi jedną rzecz, system zostawia ślady w logach, a administrator nie zgaduje.

<data-gate>
  <data-quiz>
    <question>Co jest najważniejszym celem kursu po module 0?</question>
    <options>
      <option>Przerobić jak najwięcej poleceń bez kontekstu.</option>
      <option correct>Zbudować rozumienie mechanizmów Ubuntu i przygotować grunt pod kurs Ubuntu Server.</option>
      <option>Powtórzyć informator z Ubuntu 24.04 w krótszej wersji.</option>
    </options>
    <div data-hint="error">To nie ma być katalog funkcji ani zbiór porad.</div>
    <div data-hint="success">Tak. Desktop jest środowiskiem ćwiczeń, a celem jest myślenie administracyjne.</div>
  </data-quiz>
</data-gate>

# Mapa kursu po module 0

Po module 0 kurs nie powinien iść w stronę "poznaj kolejne funkcje Ubuntu". To jest ślepa uliczka. Uczeń ma już uruchomiony system, widział GNOME, katalogi i terminal. Teraz trzeba zbudować u niego sposób myślenia, który później przeniesie się na Ubuntu Server.

Cała dalsza część kursu powinna mieć jedną oś:

> Nie zgaduję. Sprawdzam stan systemu, rozumiem mechanizm i dopiero wtedy zmieniam konfigurację.

---

## 1. Linux jako system plików, procesów i tekstu

Pierwszy blok po module 0 powinien nauczyć ucznia, że Linux nie jest "innym Windowsem". To system, w którym informacja jest dostępna przez pliki, katalogi, strumienie, procesy i logi.

Uczeń powinien umieć:

- wyjaśnić, czym różni się `/` od `/home`,
- znaleźć plik po nazwie, typie i zawartości,
- odczytać konfigurację użytkownika z ukrytych plików,
- rozumieć różnicę między wynikiem komendy a błędem komendy,
- połączyć kilka prostych narzędzi potokiem,
- wydobyć z logu konkretną informację.

To ma być blok "uczę się widzieć system", nie "uczę się komend".

Start rozdziału jest już rozpisany jako osobne lekcje:

- `00 - O co chodzi w tym rozdziale` - oś pracy: rozpoznanie, operacja, audyt,
- `01 - Mapa systemu bez encyklopedii` - `/etc/os-release`, `/etc/hostname`, `hostname`, wersja Ubuntu i nazwa komputera,

Pierwsza lekcja korzysta z nowych widgetów:

- tutor terminala: `/public/courses/ubuntu-26/Scenarios/terminal-tutor/m1-01-mapa-systemu.md`,
- misja terminala: `/public/courses/ubuntu-26/Scenarios/terminal-missions/m1-01-pakiet-orientacyjny.md`.

---

## 2. System żyje: start, procesy, usługi, logi

Drugi blok powinien być mocny diagnostycznie. Uczeń ma zrozumieć, że system składa się z uruchomionych procesów, usług i zależności, a awarie zostawiają ślady.

Uczeń powinien umieć:

- opisać start: UEFI, GRUB, jądro, initramfs, systemd,
- odróżnić proces od usługi,
- sprawdzić, co obciąża system,
- sprawdzić status usługi,
- przeczytać log konkretnej usługi,
- znaleźć przyczynę wolnego startu,
- zrozumieć, gdzie w tym wszystkim jest GNOME, GDM i Wayland.

To ma być odpowiednik jakościowy diagnostyki z Windows 11, tylko na linuksowych mechanizmach.

---

## 3. Dane, uprawnienia i odzyskiwanie

Trzeci blok musi dać uczniowi realną sprawczość nad danymi. Nie wystarczy powiedzieć, że istnieje `chmod`. Trzeba pokazać, jak zły właściciel pliku, złe prawa katalogu albo bezmyślne `sudo` psują pracę.

Uczeń powinien umieć:

- odczytać właściciela, grupę i prawa pliku,
- wyjaśnić `rwx` dla pliku i katalogu,
- naprawić typowy problem z prawami w katalogu domowym,
- użyć `sudo` świadomie,
- sprawdzić dyski i punkty montowania,
- zrobić kopię katalogu,
- odtworzyć usunięty plik,
- rozumieć, co daje szyfrowanie, a czego nie daje.

Ten blok ma mieć obowiązkowe ćwiczenie odzyskiwania danych. Bez odzyskania pliku nie ma prawdziwej lekcji backupu.

---

## 4. Sieć, zdalna praca i automatyzacja

Czwarty blok jest mostem do Ubuntu Server. Tutaj uczeń zaczyna pracować tak, jak będzie pracował później z maszyną bez GUI.

Uczeń powinien umieć:

- sprawdzić adres IP, bramę i DNS,
- odróżnić problem sieci od problemu DNS,
- sprawdzić, czy port nasłuchuje,
- otworzyć konkretny port w UFW,
- połączyć się z drugą maszyną przez SSH,
- przesłać plik bez GUI,
- napisać prosty skrypt audytu,
- uruchomić go automatycznie,
- przejść przez podstawową procedurę ratunkową ze snapshotem i chroot.

To nie ma jeszcze być pełny kurs serwerowy. To ma być moment, w którym uczeń mówi: "okej, rozumiem, dlaczego serwer da się obsługiwać bez pulpitu".

---

## Finał kursu

Finał nie powinien być quizem z nazw komend. Finał powinien być projektem:

**"Moja stacja robocza administratora Ubuntu"**

Uczeń ma oddać:

- raport o systemie,
- opis katalogów projektu i praw dostępu,
- wynik diagnozy startu i usług,
- działający backup z testem odtworzenia,
- działające połączenie SSH do drugiej maszyny,
- prosty skrypt audytu,
- regułę UFW uzasadnioną konkretną usługą,
- krótką procedurę ratunkową.

Dopiero wtedy przejście do Ubuntu Server ma sens.
