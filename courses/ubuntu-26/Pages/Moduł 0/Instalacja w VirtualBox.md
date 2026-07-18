# Instalacja Ubuntu 26.04 w VirtualBox

> [!REMINDER]
> Maszyna wirtualna daje bezpieczne laboratorium. Możesz instalować system, testować ustawienia i uczyć się naprawiania błędów bez ryzyka dla głównego komputera.
> 
> Jeśli coś pójdzie źle, usuwasz maszynę albo wracasz do kopii. To dużo spokojniejszy sposób nauki niż eksperymenty na fizycznym dysku.

---

## 📡 Pobieranie obrazu ISO

Obraz instalacyjny Ubuntu 26.04 LTS Desktop pobierz z oficjalnej strony Canonical: [ubuntu.com/download/desktop](https://ubuntu.com/download/desktop).

Na stronie zobaczysz dwie wersje:

- **Intel or AMD 64-bit architecture:** wybierz tę wersję na typowym komputerze PC, laptopie z procesorem Intel lub AMD oraz starszym Macu.
- **ARM 64-bit architecture:** wybierz tę wersję tylko wtedy, gdy Twój komputer ma procesor ARM, na przykład Apple Silicon albo Snapdragon X Elite.

![Strona pobierania Ubuntu 26.04 LTS](/public/courses/ubuntu-26/Images/pobieranie-ubuntu-26-z-canonical.png)

Po kliknięciu właściwego przycisku pobierzesz plik z rozszerzeniem `.iso`.

> [!REMINDER]
> **ISO** to rozszerzenie pliku pochodzące od standardu $\text{ISO }9660$. W praktyce taki plik zawiera obraz płyty instalacyjnej. Możesz go nagrać na nośnik albo zamontować w maszynie wirtualnej.
> <hr>
> Po podłączeniu ISO system traktuje go tak, jakby do napędu została włożona fizyczna płyta DVD.

> [!TIP]
> **Zasada parzystych wersji LTS**
> 
> Canonical wydaje nowe wersje Ubuntu co $6$ miesięcy: w kwietniu i październiku. Stąd końcówki `.04` oraz `.10`.
> 
> Wersje z kwietnia lat parzystych, na przykład 22.04, 24.04 i 26.04, mają dopisek **LTS** (*Long-Term Support*). To stabilne wydania przeznaczone do dłuższej pracy, także na serwerach. Wersje przejściowe, takie jak 25.04, mają krótsze wsparcie i służą głównie do testowania nowszych pakietów.

---

## 🚀 Instalacja systemu Ubuntu

Uruchom maszynę wirtualną. VirtualBox wystartuje system z podłączonego pliku ISO.

### 🔮 Menu rozruchowe GRUB

Na początku zobaczysz czarny ekran z menu programu rozruchowego GRUB.

1. Wybierz **Try or Install Ubuntu** i zatwierdź klawiszem <kbd>Enter</kbd>.
2. Opcji **Ubuntu (safe graphics)** użyj tylko wtedy, gdy pierwsza opcja kończy się czarnym ekranem, migającym kursorem albo zamrożonym obrazem.

Tryb *safe graphics* uruchamia ten sam system Live z instalatorem, ale dodaje do jądra parametr `nomodeset`. Ten parametr wyłącza ładowanie sterowników karty graficznej. Obraz jest wtedy renderowany programowo przez procesor, zwykle w niższej rozdzielczości, ale instalator ma większą szansę się uruchomić.

![Menu rozruchowe GRUB](/public/courses/ubuntu-26/Images/GNU_2.14_Try_or_Inatsll_Ubuntu_Albo_Ubuntu_%28safe_graphics%29.png)

### 🌍 Ustawienia regionalne i klawiatura

Po załadowaniu systemu Live uruchomi się kreator instalacji.

1. Wybierz język **Polski**.
2. Stronę ułatwień dostępu możesz pominąć, jeśli nie potrzebujesz dodatkowych ustawień.
3. Jako układ klawiatury wybierz **Polski**.
4. Przetestuj klawiaturę w polu tekstowym. Wpisz polskie znaki: *ą, ć, ę, ł, ń, ó, ś, ź, ż*.

![Wybór języka i układu klawiatury](/public/courses/ubuntu-26/Images/instalacja-ubuntu-język-dostępność-klawiatura.png)

### 🌐 Połączenie z siecią

Instalator wykryje kartę sieciową i zaproponuje połączenie z internetem.

W tym laboratorium wybierz tryb offline. Instalacja będzie szybsza i mniej zależna od dostępności serwerów z pakietami. Aktualizacje oraz dodatkowe sterowniki lepiej wykonać już po pierwszym uruchomieniu gotowego systemu.

> Wybierz opcję **Nie łącz się z Internetem**.

![Instalacja w trybie offline](/public/courses/ubuntu-26/Images/instalacja-ubuntu-mimo-połączenia-z-internetem-wybrano-aby-się-z-nim-nie-łączyć.png)

### ⚙️ Tryb instalacji

Kreator zapyta, czy chcesz wypróbować system bez instalacji, czy zainstalować go na dysku.

> Wybierz **Zainstaluj Ubuntu**.

![Wybór instalacji lub testowania](/public/courses/ubuntu-26/Images/instalacja-ubuntu-wybór-miedzy-instalacją-a-testowaniem.png)

### 🎚️ Rodzaj instalacji

Instalator zapyta: *Jak chcesz zainstalować Ubuntu?*

- **Instalacja interaktywna:** zwykły kreator prowadzi Cię krok po kroku.
- **Zautomatyzowana za pomocą pliku autoinstalacji:** opcja dla administratorów, którzy przygotowali plik `autoinstall.yaml` z odpowiedziami instalatora.
- **Zautomatyzowana za pomocą Landscape:** rozwiązanie firmowe Canonical do centralnego zarządzania flotą komputerów z Ubuntu.

> Wybierz **Instalacja interaktywna**.

![Rodzaj instalacji](/public/courses/ubuntu-26/Images/instalacja-ubuntu-wybór-jak-zainstalować-interaktywnie-przez-plik-autoinstalacji-lub-landscape.png)

### 🧰 Wybór aplikacji na start

Możesz zdecydować, jaki zestaw programów ma zostać zainstalowany od razu.

1. Wybierz **Domyślny wybór**, jeśli chcesz lżejszy system w maszynie wirtualnej. Dostaniesz podstawowe narzędzia, przeglądarkę Firefox i terminal.
2. Wybierz **Rozszerzony wybór**, jeśli od razu potrzebujesz większego zestawu aplikacji, na przykład LibreOffice albo klienta poczty.

![Wybór oprogramowania na start](/public/courses/ubuntu-26/Images/instalacja-ubuntu-jakie-programy-na-start-podstawowe-rozszerzone.png)

### ⚠️ Sterowniki własnościowe

System zapyta o dodatkowe oprogramowanie i sterowniki własnościowe.

1. Pozostaw opcję **Zainstaluj oprogramowanie innego dostawcy do sprzętu graficznego i Wi-Fi** odznaczoną.
2. Opcję **Pobierz i zainstaluj obsługę dodatkowych formatów multimediów** możesz zaznaczyć, jeśli chcesz.

> [!WARNING]
> W maszynie wirtualnej VirtualBox <strong>**_nie zaznaczamy sterowników własnościowych_**</strong>.
> 
> System gościa nie ma bezpośredniego dostępu do fizycznej karty graficznej ani fizycznej karty Wi-Fi. VirtualBox pokazuje Ubuntu wirtualne urządzenia, na przykład kontroler graficzny `VMSVGA`.
> 
> Instalowanie sterowników NVIDIA albo AMD wewnątrz systemu gościa może spowodować błędy wyświetlania, pętle restartów albo konflikt z narzędziami Guest Additions.

![Instalacja oprogramowania własnościowego](/public/courses/ubuntu-26/Images/instalacja-ubuntu-oprogramowanie-własnościowe.png)

### 💽 Partycjonowanie dysku

Instalator zapyta, jak przygotować dysk.

<data-tabs>
    <tabs>
        <b>🖥️ Tylko Ubuntu</b>
        <b>💻 Ubuntu obok Windows</b>
    </tabs>
<div>

W maszynie wirtualnej wybierz **Wymaż dysk i zainstaluj Ubuntu**.

To najprostszy wariant laboratoryjny. Dotyczy wyłącznie wirtualnego dysku maszyny, więc nie usuwa danych z Twojego fizycznego komputera.

![Wybór automatycznego partycjonowania](/public/courses/ubuntu-26/Images/instalacja-ubuntu-wymaż-dysk.png)

</div>
<div>

### 📦 Przygotowanie dysku w Windows

Jeśli instalujesz Ubuntu na tym samym dysku co Windows 11, najpierw przygotuj **nieprzydzieloną przestrzeń** dla systemu <b>GNU/Linux</b>.

Wykonaj to z poziomu Windows 11:

1. Kliknij prawym przyciskiem myszy logo menu **Start** albo użyj skrótu <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>X</kbd></span>.
2. Wybierz <kbd class="win-menu-btn">Zarządzanie dyskami</kbd>.
3. Kliknij prawym przyciskiem największą partycję i wybierz <kbd class="win-menu-btn">Zmniejsz wolumin</kbd>.
4. Wydziel co najmniej **$50\text{ GB}$** nieprzydzielonego miejsca. Daj więcej, jeśli planujesz intensywnie korzystać z Ubuntu.

![Nieprzydzielona przestrzeń dla Ubuntu w Zarządzaniu dyskami Windows 11](/public/courses/ubuntu-26/Images/windows-11-nieprzydzielona-przestrzeń-dla-ubuntu.png)

Upewnij się też, że **BitLocker jest wyłączony** na partycji systemowej Windows. Sprawdzisz to w ścieżce: <kbd class="win-menu-btn">Panel Sterowania</kbd> > <kbd class="win-menu-btn">Duże ikony</kbd> > <kbd class="win-menu-btn">Szyfrowanie dysków funkcją BitLocker</kbd>.

![BitLocker wyłączony w Windows 11](/public/courses/ubuntu-26/Images/windows-11-bitlocker-wyłączony.png)

### 💿 Zamontowanie ISO i uruchomienie instalatora

W maszynie wirtualnej z Windows 11 zamontuj ISO Ubuntu do wirtualnego napędu optycznego. W menu VirtualBox wybierz: **Urządzenia** > **Napędy optyczne** > **Wybierz obraz instalatora ISO**.

![Zamontowanie ISO Ubuntu w maszynie wirtualnej z Windows 11](/public/courses/ubuntu-26/Images/VB-domontowanie-iso-ubuntu-w-maszynie-windows-11.png)

> [!WARNING]
> **Windows 11 nie uruchamia się w VirtualBox**
> 
> Jeśli Windows 11 nie startuje w maszynie wirtualnej, sprawdź liczbę przydzielonych rdzeni procesora. W tej konfiguracji ustaw co najmniej **$3$ procesory wirtualne**.

![Ustawienie rdzeni procesora dla Windows 11 w VirtualBox](/public/courses/ubuntu-26/Images/vb-rdzenie-dla-win11.png)

### 🔧 Bootowanie instalatora

Na fizycznym komputerze zwykle wystarczy nacisnąć <kbd>F12</kbd> przy starcie, wejść do menu bootowania i wybrać napęd optyczny. W VirtualBox sprawa zależy od trybu firmware.

<strong>**_Menu bootowania pod <kbd>F12</kbd> jest niedostępne w trybie UEFI._**</strong>

![Ekran F12 boot w VirtualBox](/public/courses/ubuntu-26/Images/VB-F12-boot.png)

Jeśli Windows 11 został zainstalowany w trybie **BIOS**, bez UEFI, menu bootowania zadziała. Naciśnij <kbd>C</kbd>, aby uruchomić instalator Ubuntu z napędu optycznego.

![Menu bootowania w trybie BIOS](/public/courses/ubuntu-26/Images/VB-BIOS-boot-menu.png)

> [!TIP]
> **Jak rozpoznać BIOS i UEFI?**
> 
> Tryb BIOS zwykle poznasz po niskiej rozdzielczości ekranu startowego. Jeśli wyłączysz UEFI w ustawieniach maszyny wirtualnej, menu bootowania zostanie odblokowane, ale instalator Ubuntu uruchomi się w niższej rozdzielczości.

![Instalator Ubuntu uruchomiony w trybie BIOS](/public/courses/ubuntu-26/Images/zbootowany-instalator-ubuntu-bez-uefi.png)

W trybie **UEFI** skorzystaj z menu zaawansowanego uruchamiania Windows 11:

1. Uruchom Windows 11 i upewnij się, że ISO Ubuntu jest widoczne w Eksploratorze plików.
2. Przytrzymaj <kbd>Shift</kbd> i kliknij **Uruchom ponownie** w menu Start.

![Restart z przytrzymanym Shift](/public/courses/ubuntu-26/Images/windows-11-restart-podczas-trzymania-klawisza-shift.png)

3. Maszyna wirtualna uruchomi niebieski ekran opcji zaawansowanych.
4. Wybierz **Użyj urządzenia**, a potem **UEFI VBOX CD-ROM**.

![Bootowanie instalatora Ubuntu przez opcje zaawansowane Windows 11](/public/courses/ubuntu-26/Images/bootowanie-instalatora-ubuntu-poprzez-tryb-zaawansowane-rezwiązywanie-problemów-win11.png)

> [!TIP]
> Jeśli po wybraniu napędu CD-ROM długo widzisz czarny ekran, użyj <span style="white-space: nowrap;"><kbd>Prawy Ctrl</kbd> + <kbd>R</kbd></span>, aby wymusić restart maszyny. Po ponownym uruchomieniu powinno pojawić się menu GRUB w wyższej rozdzielczości, ponieważ instalator wystartuje w trybie UEFI.

![Menu GRUB załadowane w trybie UEFI](/public/courses/ubuntu-26/Images/GRUB-w-trybie-UEFI.png)

### 🧩 Instalator wykrył Windows

Instalator Ubuntu może wykryć Windows i pokazać komunikat o BitLockerze. Taki komunikat może pojawić się nawet wtedy, gdy BitLocker jest wyłączony. W VirtualBox bywa to efekt pracy na wirtualnym dysku `VDI`, a nie dowód faktycznego szyfrowania partycji.

![Instalator Ubuntu wykrył Windows 11](/public/courses/ubuntu-26/Images/instalator-ubuntu-wykrył-windowsa.png)

Masz do wyboru trzy opcje:

- _**Zainstaluj Ubuntu obok Windows Boot Manager**_: instalator sam przygotuje partycje pod dual boot.
- _**Wymaż dysk i zainstaluj Ubuntu**_: instalator wyczyści cały dysk i usunie Windowsa. Nie wybieraj tej opcji, jeśli chcesz zachować Windowsa.
- _**Ręczne partycjonowanie**_: samodzielnie przygotowujesz układ partycji.

### 🔧 Ręczne partycjonowanie

Ręczne partycjonowanie jest opcjonalne. Wybierz **nieprzydzieloną przestrzeń**, przygotowaną wcześniej w Zarządzaniu dyskami Windows 11, i kliknij znak `+`.

Z dostępnego miejsca utwórz:

1. **Partycję swap** (pamięć wymiany), na przykład **4 GB** (`4096 MB`). System używa jej jako awaryjnego rozszerzenia pamięci RAM.
2. **Partycję systemową** z reszty miejsca. Wybierz system plików **Ext4** i punkt montowania `/`.

![Ręczne partycjonowanie: swap i ext4 na /](/public/courses/ubuntu-26/Images/reczne-partcjonowanie.png)

Obie metody zadziałają poprawnie. Instalator w trybie automatycznym zwykle nie tworzy osobnej partycji swap, tylko używa pliku wymiany wewnątrz partycji systemowej.

![Porównanie automatycznego i ręcznego partycjonowania](/public/courses/ubuntu-26/Images/porównanie-automatycznego-z-ręcznym-partycjonowaniem.png)

### 🔄 Menu GRUB po instalacji

Po instalacji przy każdym uruchomieniu komputera zobaczysz menu **GRUB** z listą systemów operacyjnych. Domyślnie wybrany będzie Ubuntu.

> [!IMPORTANT]
> **Czas na wybór systemu jest krótki.**
> 
> Jeśli chcesz uruchomić Windows zamiast Ubuntu, od razu naciśnij strzałkę w dół <kbd>↓</kbd> i wybierz *Windows Boot Manager*. Jeśli nic nie zrobisz, GRUB automatycznie załaduje Ubuntu.

![Menu GRUB: wybór między Ubuntu a Windows](/public/courses/ubuntu-26/Images/GRUB-menu-wyboru-bootowania-systemów.png)

</div>
</data-tabs>

### 🔐 Szyfrowanie i system plików

Gdy dysk i partycje będą gotowe, kreator zaproponuje wybór szyfrowania i systemu plików.

![Szyfrowanie i system plików](/public/courses/ubuntu-26/Images/instalacja-ubuntu-szyfrowanie-plików.png)

Masz tu kilka opcji:

- **Bez szyfrowania**: domyślny wybór. Dane na dysku nie są szyfrowane.
- **Zaszyfruj przy użyciu hasła**: pełne szyfrowanie dysku oparte na **LVM** i **LUKS**. System poprosi o hasło przy każdym uruchomieniu.
- **Użyj szyfrowania sprzętowego**: opcja dla komputerów z układem `TPM`, która pozwala sprzętowo chronić dysk i odblokowywać go podczas startu.

W **Opcjach zaawansowanych** znajdziesz też eksperymentalną obsługę **ZFS**, również w wariancie szyfrowanym. ZFS oferuje migawki (*snapshots*) i mechanizmy samonaprawy danych.

> W maszynie wirtualnej pozostaw ustawienia domyślne: **Bez szyfrowania** oraz system plików **Ext4**.

### 👤 Konfiguracja konta

Wprowadź dane użytkownika i nazwę komputera w sieci (`hostname`).

1. **Twoje imię i nazwisko:** na przykład `Egzamin`.
2. **Nazwa tego komputera:** nazwa widoczna w sieci lokalnej, na przykład `egzamin-VirtualBox`.
3. **Wybierz nazwę użytkownika:** Twój login systemowy, na przykład `egzamin` (koniecznie małymi literami).
4. **Hasło:** ustaw silne hasło, na przykład `ZAQ!2wsx` 😅. Będziesz go używać przy poleceniu `sudo`.
5. Pozostaw zaznaczoną opcję **Wymaganie hasła do zalogowania**.

![Konfiguracja konta użytkownika](/public/courses/ubuntu-26/Images/instalacja-ubuntu-skonfiguruj-swoje-konto.png)

> [!NOTE]
> **Co to jest Active Directory?**
> 
> Opcja **Użyj Active Directory** pozwala podłączyć Ubuntu do domeny Windows Server. Firmy używają jej do centralnego zarządzania kontami użytkowników.

### 🕒 Wybór strefy czasowej

Wskaż swoją lokalizację na mapie, na przykład region Polski. Instalator ustawi strefę czasową `Europe/Warsaw`. Potem pokaże podsumowanie konfiguracji.

![Wybór strefy czasowej](/public/courses/ubuntu-26/Images/instalacja-ubuntu-strefa-czasowa-i-podsumowanie-partycjonowania-sda1-i-sda2-dla-slash.png)

### 💪 Gotowe do instalacji

Przed zapisaniem zmian instalator pokaże podsumowanie.

1. Przejrzyj sekcję **Partycje**:
   - **sda1:** mała partycja rozruchowa EFI, potrzebna do startu systemu w trybie UEFI.
   - **sda2:** główna partycja systemowa w **Ext4**, zamontowana jako `/`.
2. Kliknij **Instaluj**.

### 🔎 Monitorowanie instalacji

Gdy rozpocznie się kopiowanie plików:

1. W prawym dolnym rogu okna instalatora kliknij małą ikonę **Terminala/Konsoli**, obok tekstu *Kopiowanie plików...*.
2. Instalator przełączy widok na logi tekstowe.

![Widok konsoli instalatora](/public/courses/ubuntu-26/Images/instalacja-ubuntu-koniecznie-warto-przełączyć%20na%20widok-konsoli-bo-jak-bedzie-błąd-to-ta-obcja-może-się-zablokować.png)

> [!IMPORTANT]
> **Dlaczego warto włączyć widok konsoli od razu?**
> 
> Jeśli instalator napotka błąd, logi pokażą więcej niż sam ekran graficzny. Czasem po błędzie GUI przestaje odpowiadać i nie da się już wygodnie przełączyć na widok logów.
> 
> To szczególnie przydatne przy instalacji offline, bo od razu zobaczysz, czy instalator próbuje mimo wszystko pobierać pakiety z internetu.

### 🚀 Ponowne uruchomienie

1. Po zakończeniu kopiowania plików pojawi się komunikat: *„Ubuntu 26.04 został zainstalowany i jest gotowy do użycia”*.
2. Kliknij **Uruchom ponownie teraz**. Jeśli GUI się zawiesi, użyj <span style="white-space: nowrap;"><kbd>Prawy Ctrl</kbd> + <kbd>R</kbd></span>.

![Instalacja zakończona](/public/courses/ubuntu-26/Images/instalacja-ubuntu-zakończona-i-dzieki-odłączeniu-wirtualnego-kabla-internetu-w-VB-nie-było-problemów.png)

3. Jeśli zobaczysz komunikat *„Please remove the installation medium, then press ENTER:”*, naciśnij <kbd>Enter</kbd>. VirtualBox zwykle sam odmontuje ISO.

---

## ✅ Pierwsze uruchomienie

Po restarcie zobaczysz ekran logowania **GDM** (*GNOME Display Manager*). Kliknij konto użytkownika, wpisz hasło ustawione podczas instalacji i zaloguj się do systemu.

### 🔌 Podłączenie wirtualnego kabla sieciowego

Ponieważ instalacja odbyła się offline, system po pierwszym logowaniu może nie mieć dostępu do internetu. Najpierw podłącz kartę sieciową w VirtualBox.

1. W menu okna VirtualBox wybierz **Urządzenia** > **Sieć**.
2. Kliknij **Podłącz kartę sieciową**.

![Błędy DNS spowodowane trybem Link-Local Only](/public/courses/ubuntu-26/Images/ubuntu-aktualizacja-po-instalacji.png)

### 🛠️ Naprawa konfiguracji sieci

Samo podłączenie wirtualnego kabla może nie wystarczyć. Po instalacji offline _**NetworkManager**_ może zapisać profil interfejsu w trybie **Link-Local Only** zamiast **Automatic (DHCP)**.

W trybie Link-Local system dostaje adres z puli `169.254.x.x`. To adres lokalny, bez bramy domyślnej i bez serwerów DNS. Interfejs wygląda na podłączony, ale nie ma trasy do internetu.

Próba wykonania `sudo apt update` albo `sudo apt-get update` zakończy się wtedy błędami DNS:

```bash
Błąd:1 http://archive.ubuntu.com/ubuntu resolute InRelease
   Tymczasowy błąd przy tłumaczeniu "archive.ubuntu.com"
Błąd:2 http://security.ubuntu.com/ubuntu resolute-security InRelease
   Tymczasowy błąd przy tłumaczeniu "security.ubuntu.com"
```

Aby to naprawić, przełącz interfejs na DHCP:

1. Otwórz **Ustawienia** (*Settings*) > **Sieć** (*Network*).
2. Przy połączeniu **Wired** kliknij ikonę **`>`**, a potem opcję **Wired Settings**.
3. Kliknij na ikonę koła zębatego i przejdź do zakładki **`IPv4`**.
4. Zmień **IPv4 Method** z *Link-Local Only* na *Automatic (DHCP)*.
5. Kliknij **Apply**.
6. Wyłącz i włącz interfejs przełącznikiem przy ikonie koła zębatego. To wymusi ponowne pobranie adresu IP i DNS z DHCP VirtualBox.

![Zmiana konfiguracji IPv4 z Link-Local Only na Automatic DHCP](/public/courses/ubuntu-26/Images/poprawa-ustawienia-interfejsu-sieciowego-z-link-local-Only-na-dhcp.png)

### 🖥️ Pierwsza aktualizacja systemu

Po przełączeniu interfejsu na DHCP otwórz terminal skrótem <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd></span> i wykonaj:

```bash
sudo apt update
```

Polecenie pobierze indeksy pakietów z repozytoriów. Po zakończeniu zobaczysz informację, ile pakietów można zaktualizować:

```shell
148 pakietów może być zaktualizowanych. Można je zobaczyć wykonując 'apt list --upgradable'.
```

> [!NOTE]
> **`apt` vs `apt-get`**
> 
> `apt-get` to starsze, niskopoziomowe narzędzie. Jego wyjście jest stabilne, więc dobrze nadaje się do skryptów i automatyzacji, także w instalatorach.
> 
> `apt` jest wygodniejsze dla człowieka. Pokazuje czytelniejsze komunikaty, kolory i paski postępu. W codziennej pracy administratora używaj `apt`.

### 🖥️ Instalacja aktualizacji

Samo `apt update` pobiera tylko **indeksy**, czyli listy dostępnych pakietów i wersji. Aby zainstalować nowsze pakiety, wykonaj:

```bash
sudo apt upgrade
```

Terminal pokaże listę pakietów i zapyta o potwierdzenie:

```text
Kontynuować? [T/n]
```

> [!TIP]
> **Konwencja `[T/n]` w terminalu**
> 
> Litery w nawiasie oznaczają dostępne odpowiedzi: **T** to „tak”, a **n** to „nie”. Wielka litera wskazuje wartość domyślną. W tym przypadku możesz po prostu nacisnąć <kbd>Enter</kbd>, a system potraktuje to jako zgodę.

Po zatwierdzeniu system pobierze i zainstaluje aktualizacje. Może to potrwać od kilku do kilkunastu minut.

![Aktualizacja systemu: sudo apt upgrade z promptem Kontynuować T/n](/public/courses/ubuntu-26/Images/zainstalowanie-aktualizacji.png)

Po aktualizacji środowisko jest gotowe do dalszej pracy. To dobry moment, aby wyeksportować maszynę wirtualną jako plik `.ova` (*Open Virtualization Archive*). W VirtualBox wybierz **Plik** > **Eksportuj urządzenie wirtualne**.

Plik `.ova` jest kompletnym obrazem maszyny. Możesz go później zaimportować na innym komputerze z VirtualBox bez powtarzania całej instalacji.

---

## 🛠️ Punkt Kontrolny: Instalacja

<data-gate>
  <data-quiz>
    <question>
Dlaczego do nauki Linuksa zaleca się instalację w maszynie wirtualnej (VirtualBox) zamiast bezpośrednio na dysku komputera?
    </question>
    <options>
      <item correct>Maszyna wirtualna działa w izolowanym środowisku. Nie ingeruje w główny system operacyjny, a w razie problemów można ją usunąć albo odtworzyć z kopii.</item>
      <item>Linux nie działa poprawnie na fizycznym sprzęcie i wymaga warstwy wirtualizacji do obsługi sterowników.</item>
      <item>VirtualBox szyfruje całą komunikację sieciową maszyny wirtualnej, chroniąc przed atakami podczas nauki.</item>
    </options>

<div data-hint="error">
  Pomyśl o bezpieczeństwie eksperymentowania. Co stanie się po błędzie konfiguracji na fizycznym dysku, a co po takim samym błędzie w maszynie wirtualnej?
</div>
<div data-hint="success">
  Dobrze. Maszyna wirtualna jest środowiskiem laboratoryjnym. Możesz testować, psuć i naprawiać system bez ryzyka dla głównego komputera.
</div>
  </data-quiz>
</data-gate>


---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Maszyna wirtualna chroni główny system:** błędy w Ubuntu nie uszkodzą Windowsa ani danych na fizycznym dysku.
- **ISO to obraz instalatora:** VirtualBox montuje go tak, jakby był płytą w napędzie.
- **W VirtualBox wybieramy prostą instalację:** dla czystej maszyny najbezpieczniej użyć opcji **Wymaż dysk i zainstaluj Ubuntu**, bo dotyczy ona wirtualnego dysku.
- **Sterowników własnościowych nie instalujemy w gościu:** Ubuntu w VirtualBox widzi wirtualny sprzęt, a nie fizyczną kartę NVIDIA, AMD albo Wi-Fi.
- **Po instalacji trzeba naprawić sieć:** instalacja offline może zostawić interfejs w trybie **Link-Local Only**, więc przełącz go na **Automatic (DHCP)**.
- **Aktualizacje robimy po starcie systemu:** najpierw `sudo apt update`, potem `sudo apt upgrade`.

