# Czym jest Linux i dlaczego warto go poznać

Zanim uruchomisz terminal i wpiszesz pierwszą komendę, warto wiedzieć, z czym pracujesz.

Linux bywa opisywany jako „alternatywa dla Windowsa”, ale to zbyt wąskie ujęcie. Ten system jest podstawą wielu serwerów internetowych, superkomputerów, urządzeń z Androidem i części systemów używanych w sprzęcie naukowym.

W tym kursie interesuje nas przede wszystkim praktyka. Chcemy zrozumieć, jak Linux jest zbudowany, dlaczego administratorzy tak często wybierają terminal i skąd bierze się różnica między „system działa” a „pulpit działa”.

### 🐧 Jądro a system operacyjny (GNU/Linux)

Kiedy mówimy „Linux”, zwykle mamy na myśli cały system operacyjny. Technicznie **Linux to jądro systemu** (kernel).

Jądro odpowiada za kontakt z procesorem, pamięcią, dyskami i innym sprzętem. Samo jądro nie wystarczy jednak do wygodnej pracy. Potrzebujesz jeszcze powłoki tekstowej, komend, bibliotek systemowych, kompilatorów i programów użytkowych.

Duża część tych narzędzi pochodzi z projektu **GNU**, rozpoczętego przez Richarda Stallmana. Dlatego pełna nazwa kompletnego systemu to **GNU/Linux**.

W codziennej rozmowie możesz usłyszeć samo „Linux”. To normalne. Warto jednak rozumieć, że chodzi wtedy o skrót myślowy.

## 📦 Dystrybucje, czyli gotowe systemy z Linuksem

Skoro Linux jest tylko jądrem, ktoś musi połączyć je z resztą narzędzi. Tym właśnie zajmują się **dystrybucje**.

Dystrybucja to gotowy zestaw oprogramowania przygotowany przez społeczność lub firmę. Zawiera jądro Linux oraz wybrane komponenty:

- instalator,
- menedżer pakietów, na przykład `APT` albo `Pacman`,
- podstawowe programy systemowe,
- środowisko graficzne, czyli pulpit.

Ubuntu, Debian, Fedora i Arch Linux korzystają z tego samego typu jądra. Różnią się wyborem narzędzi, sposobem aktualizacji, domyślną konfiguracją i tym, jak dużo decyzji zostawiają użytkownikowi.

> [!TIP]
> **Dlaczego nie budujemy systemu od zera?**
> 
> Teoretycznie możesz pobrać samo jądro ze strony [kernel.org](https://www.kernel.org/), skompilować programy, dobrać biblioteki systemowe, wybrać menedżer pakietów i złożyć pulpit. Tak działa między innymi projekt [Linux From Scratch](https://www.linuxfromscratch.org/)).
> 
> W praktyce na początku kursu nie ma to sensu. Dystrybucja daje stabilny system bazowy. Dzięki temu możesz uczyć się administracji, terminala i konfiguracji bez ręcznego składania całego ekosystemu.

---

## ⚖️ Linux vs Windows: trzy ważne różnice

Przejście z Windowsa na Linuksa wymaga zmiany sposobu myślenia o systemie. Najmocniej widać to w konfiguracji, strukturze dysków i roli interfejsu graficznego.

<data-tabs>
  <tabs>
    <item>Ustawienia: rejestr vs pliki tekstowe</item>
    <item>Dyski: litery vs jedno drzewo</item>
    <item>Interfejs: GUI vs opcjonalny pulpit</item>
  </tabs>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **Rejestr i obiekty systemowe:** Windows przechowuje dużą część konfiguracji w centralnej, binarnej bazie danych, czyli w Rejestrze. Usługi działają jako osobne programy albo biblioteki `DLL`, często ładowane przez procesy pomocnicze, na przykład `svchost.exe`. Parametry startu usług są pobierane przez systemowe API. Uszkodzenie Rejestru może zablokować odczyt tych ustawień, utrudnić start systemu albo uszkodzić profil użytkownika, co już raz doświadczyłem. 😐

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Pliki tekstowe i brak jednej bazy:** Linux nie ma jednej centralnej bazy konfiguracji. Ustawienia usług, czyli *demonów*, i programów zwykle leżą w niezależnych plikach tekstowych, głównie w katalogu `/etc/`. Jeśli popełnisz błąd w konfiguracji jednej usługi, najczęściej nie uruchomi się tylko ta usługa oraz procesy, które bezpośrednio od niej zależą. Reszta systemu może dalej startować normalnie. To ważne na serwerach.
  </div>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **Osobne litery dysków:** Windows przypisuje dyskom i partycjom litery, na przykład `C:` albo `D:`. Każda litera jest punktem startowym osobnego drzewa folderów. System zarządza takimi woluminami przez własne mechanizmy i API. Dostęp niskopoziomowy do dysku jest ukryty przed zwykłym użytkownikiem i wymaga narzędzi systemowych.

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Jedno drzewo katalogów:** Linux nie używa liter dysków. Cały system plików zaczyna się od katalogu głównego `/`, nazywanego też root. Nowe dyski montuje się jako katalogi, na przykład `/media/dane`. Urządzenia sprzętowe mają swoje reprezentacje w `/dev/`, na przykład dysk `/dev/sda` i jego pierwsza partycja `/dev/sda1`. Historyczne oznaczenie `sd` pochodzi od *SCSI Disk*. Kolejne dyski dostają litery, na przykład `sda`, `sdb`, `sdc`, a partycje numery.

  </div>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **GUI jako domyślny sposób pracy:** Windows projektowano głównie do obsługi graficznej. Pulpit i okna są podstawowym sposobem zarządzania systemem. Zatrzymanie procesu `explorer.exe` nie zatrzymuje jądra, więc pulpit można uruchomić ponownie, na przykład przez Menedżer zadań. Mimo to wiele ustawień systemowych nadal najwygodniej obsługuje się graficznie. PowerShell jest mocny, ale dla wielu użytkowników pozostaje narzędziem administracyjnym.

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Terminal jako naturalny interfejs:** W Linuksie terminal jest bezpośrednim sposobem pracy z systemem. Jądro nie potrzebuje pulpitu, żeby działać. Środowisko graficzne, czyli Desktop Environment, jest programem uruchamianym w przestrzeni użytkownika. Serwery często nie mają grafiki wcale. Na komputerze osobistym pulpit można wyłączyć, zrestartować albo wymienić bez zatrzymywania usług działających w tle.
  </div>
</data-tabs>

> [!IMPORTANT]
> **Zarządzanie i uprawnienia (`sudo`)**
> 
> W Linuksie na co dzień pracujesz na koncie o ograniczonych uprawnieniach. Zmiany systemowe wymagają jawnego użycia polecenia `sudo`, czyli *SuperUser Do*.
> 
> `sudo` tymczasowo podnosi Twoje uprawnienia do poziomu administratora, czyli użytkownika `root`. Pod tym względem pełni podobną funkcję jak okno UAC w Windowsie: system pyta, czy naprawdę chcesz wykonać operację administracyjną.
> 
> ![Obrazek przedstawiający połączenie Shia LaBeouf z kanapką SUDO](/public/courses/ubuntu-26/Images/just_do_it_sudo.png)

---

## 🛠️ Punkt Kontrolny: czym jest Linux?

<data-gate>
  <data-quiz>
    <question>
Dlaczego poprawna nazwa systemu to „GNU/Linux”, a nie po prostu „Linux”?
    </question>
    <options>
      <item correct>Nazwa „Linux” odnosi się wyłącznie do jądra systemu. Kompletny system operacyjny wymaga także narzędzi przestrzeni użytkownika, takich jak powłoka, kompilatory i biblioteki. W dużej części pochodzą one z projektu GNU.</item>
      <item>Linux to marka handlowa firmy Canonical, a GNU to darmowa wersja tego samego oprogramowania dystrybuowana przez Richarda Stallmana.</item>
      <item>GNU to nazwa graficznego interfejsu użytkownika, który jest nakładany na tekstowe jądro Linuksa.</item>
    </options>

<div data-hint="error">
  Przypomnij sobie: Linus Torvalds napisał samo jądro. Jakich komponentów brakuje, żeby z jądra powstał użyteczny system operacyjny?
</div>
<div data-hint="success">
  Dobrze. Jądro Linux + narzędzia GNU = kompletny system operacyjny. To rozróżnienie pomaga zrozumieć cały ekosystem.
</div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Jądro vs GNU/Linux:** Linux to jądro systemu operacyjnego. Do kompletnego systemu potrzebne są jeszcze narzędzia przestrzeni użytkownika, w dużej części z projektu GNU.
- **Rola dystrybucji:** Dystrybucja, na przykład Ubuntu, łączy jądro, narzędzia systemowe, instalator, menedżer pakietów i pulpit w gotowy system.
- **Konfiguracja w plikach:** Linux zwykle trzyma ustawienia systemowe w czytelnych plikach tekstowych, głównie w `/etc/`, a nie w jednej centralnej bazie podobnej do Rejestru Windows.
- **Jedno drzewo katalogów:** Linux nie używa liter `C:` i `D:`. Cały system plików zaczyna się od `/`, a dyski i partycje montuje się w wybranych katalogach.
- **GUI jest opcjonalne:** Pulpit w Linuksie jest programem działającym nad systemem, nie warunkiem działania jądra ani usług.
- **`sudo` chroni system:** Operacje administracyjne wykonujesz świadomie przez `sudo`, zamiast stale pracować z pełnymi uprawnieniami administratora.

---

Znasz już podstawowe różnice między Windowsem a Linuksem. W następnym kroku przejdziesz od teorii do praktyki i zainstalujesz Ubuntu w bezpiecznym środowisku maszyny wirtualnej.
