# Czym jest Linux i dlaczego warto go poznać

Zanim uruchomisz terminal i wpiszesz pierwszą komendę, warto wiedzieć, z czym pracujesz.

Linux bywa opisywany jako „alternatywa dla Windowsa”, ale to zbyt wąskie ujęcie. Ten system jest fundamentem współczesnych serwerów internetowych, chmury obliczeniowej, superkomputerów oraz systemów wbudowanych i urządzeń mobilnych (Android).

W tym kursie interesuje nas przede wszystkim inżynierska praktyka. Skupimy się na tym, jak Linux jest zbudowany, dlaczego administratorzy wybierają terminal oraz skąd wynika fundamentalny podział na jądro, przestrzeń użytkownika i środowisko graficzne.

---

### 🐧 Jądro a system operacyjny (GNU/Linux)

Kiedy mówimy „Linux”, zwykle mamy na myśli cały system operacyjny. W ścisłym ujęciu technicznym **Linux to wyłącznie jądro systemu** (*kernel*).

Jądro odpowiada za bezpośredni kontakt z procesorem, zarządzanie pamięcią fizyczną i wirtualną, harmonogramowanie procesów oraz obsługę dysków i urządzeń peryferyjnych. Samo jądro nie wystarcza jednak do pracy interaktywnej. Do stworzenia środowiska pracy potrzebna jest powłoka tekstowa (*shell*), podstawowy zestaw narzędzi POSIX, biblioteka standardowa C (*glibc*), kompilatory oraz demony systemowe.

Większość tych kluczowych narzędzi pochodzi z projektu _**GNU**_, zapoczątkowanego przez Richarda Stallmana. Z tego powodu kompletny, gotowy do pracy system operacyjny nosi formalną nazwę _**GNU/Linux**_.

---

## 📦 Dystrybucje, czyli kompletne systemy

Skoro Linux jest jądrem, a narzędzia GNU stanowią przestrzeń użytkownika, konieczne jest ich zintegrowanie w spójny ekosystem instalacyjny. Tym zadaniem zajmują się **dystrybucje Linuksa**.

Dystrybucja to przygotowany zestaw oprogramowania, który obejmuje:
- Jądro Linuksa (*Linux Kernel*)
- Instalator systemu (np. Subiquity w Ubuntu)
- Menedżer pakietów (np. *APT*, *DNF*, *Pacman*)
- Biblioteki systemowe i demony bazowe (np. *systemd*)
- Opcjonalne środowisko graficzne (*Desktop Environment*, np. *GNOME*, *KDE Plasma*)

Ubuntu, Debian, Fedora i Arch Linux wykorzystują to samo jądro. Różnią się formatem pakietów, polityką wydań (wydania punktowe vs *rolling release*) oraz domyślnym zestawem prekonfigurowanych usług.

---

## ⚖️ Trzy fundamentalne różnice: Linux vs Windows

Przejście z systemu Windows na Linuksa wymaga modyfikacji mentalnego modelu zarządzania środowiskiem.

<data-tabs>
  <tabs>
    <item>Konfiguracja: Rejestr vs Pliki Tekstowe</item>
    <item>Struktura danych: Litery dysków vs Jedno drzewo</item>
    <item>Interfejs: Integralne GUI vs Niezależna powłoka</item>
  </tabs>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **Rejestr i obiekty binarne:** Windows przechowuje kluczowe konfiguracje w centralnej, binarnej bazie danych (Rejestr Windows, pliki gałęzi Hive). Uszkodzenie struktury rejestru może uniemożliwić rozruch jądra lub zablokować ładowanie profilu użytkownika.

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Pliki tekstowe (Plain Text) w `/etc`:** W Linuksie nie ma pojedynczego, binarnego punktu awarii konfiguracji. Usługi systemowe (*demony*) czytają ustawienia ze zwykłych plików tekstowych (np. `/etc/ssh/sshd_config`, `/etc/fstab`). Błąd składni w konfiguracji jednej usługi uniemożliwi start tylko tego demona, nie destabilizując reszty systemu operacyjnego.

  </div>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **Litery dysków i niezależne woluminy:** Windows organizuje nośniki danych według niezależnych liter dysków (`C:`, `D:`). Każda litera stanowi korzeń odrębnego drzewa katalogów.

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Jednolite drzewo katalogów FHS:** Linux nie stosuje liter nośników. Wszystkie zasoby, partycje i nośniki zewnętrzne są montowane w wyznaczonych punktach montowania wewnątrz **jednego wspólnego drzewa**, którego początkiem jest katalog główny `/` (*root*). Nośniki sprzętowe są reprezentowane w wirtualnym systemie plików `/dev/` (np. dysk `/dev/sda`, partycja `/dev/sda1`).

  </div>
  <div>

![Logo Windows](/public/courses/ubuntu-26/Images/windows.png)

- **Interfejs graficzny jako rdzeń:** Windows projektowano od podstaw z myślą o graficznej obsłudze okienkowej. Mimo potężnych możliwości konsoli PowerShell, wiele komponentów systemu zakłada obecność podsystemu graficznego.

![Logo Linux](/public/courses/ubuntu-26/Images/linux.png)

- **Pulpit jako opcjonalny proces przestrzeni użytkownika:** W Linuksie serwer wyświetlania (Wayland lub X11) oraz menedżer okien to zwykłe procesy działające w przestrzeni użytkownika (*User Space*). Jądro i usługi sieciowe działają całkowicie niezależnie od grafiki. Na serwerach środowisko graficzne nie jest w ogóle instalowane, co drastycznie redukuje zużycie pamięci RAM oraz powierzchnię potencjalnych ataków sieciowych.

  </div>
</data-tabs>

---

## 🛡️ Model bezpieczeństwa i rola polecenia `sudo`

W Linuksie codzienna praca odbywa się z poziomu konta o ograniczonych uprawnieniach. Modyfikacja plików konfiguracyjnych, instalacja pakietów oraz zarządzanie demonami wymagają uprawnień superużytkownika **root** (UID 0).

Polecenie `sudo` (*SuperUser Do*) umożliwia uwierzytelnionemu użytkownikowi jednorazowe wykonanie wskazanej komendy z uprawnieniami konta root. Działa to jako ścisła zapora proceduralna: każda operacja naruszająca stan systemu wymaga świadomej autoryzacji hasłem, co zapobiega przypadkowym uszkodzeniom struktury plików przez skrypty lub nieuwagę operatora.

---

## 🌳 Drzewo genealogiczne dystrybucji

Wszystkie nowoczesne dystrybucje dzielą się na kilka głównych rodzin wywodzących się ze stabilnych projektów macierzystych:

![Drzewo genealogiczne dystrybucji Linux](/public/courses/ubuntu-26/Images/distro-mather.png)

1. _**Rodzina Debian**_ (Debian GNU/Linux):
   - Format pakietów: `.deb`, menedżery: `dpkg` oraz `apt`. Cechuje się rygorystycznym podejściem do stabilności.
   - Główne pochodne: **Ubuntu** (dystrybucja bazowa naszego kursu) oraz **Kali Linux**.
2. _**Rodzina Red Hat**_ (RHEL - Red Hat Enterprise Linux):
   - Format pakietów: `.rpm`, menedżer: `dnf` (dawniej `yum`). Standard korporacyjny i serwerowy.
   - Główne pochodne: **Fedora** (wydania innowacyjne) oraz **Rocky Linux** / **AlmaLinux** (darmowe kompilacje RHEL).
3. _**Rodzina Arch Linux**_:
   - Model ciągły (*Rolling Release*), menedżer pakietów `pacman`.
   - Główne pochodne: **Manjaro** oraz **EndeavourOS**.

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Przejście Ring 3 do Ring 0 i instrukcja syscall w architekturze x86_64</span><span class="deep-dive-badge">x86_64 Kernel Internals</span></summary>

Rozróżnienie między jądrem a przestrzenią użytkownika to nie tylko podział logiczny w oprogramowaniu. Jest to **twarda granica sprzętowa** egzekwowana bezpośrednio przez krzem mikroprocesora.

### 1. Poziomy uprawnień pierścieni (Privilege Rings)
W architekturze x86_64 procesor operuje na poziomach uprawnień zdefiniowanych w 2 najmłodszych bitach rejestru segmentowego kodu `%cs` (*Current Privilege Level - CPL*):
- **Ring 3 (CPL = 3)**: Przestrzeń Użytkownika (*User Space*). Tutaj działają przeglądarki, powłoka Bash, serwer graficzny i aplikacje. Kod nie może bezpośrednio wykonać instrukcji wejścia-wyjścia (`in`, `out`), wyłączyć przerwań (`cli`), modyfikować rejestrów kontrolnych (`CR0`, `CR3`) ani uzyskać bezpośredniego dostępu do fizycznych adresów pamięci.
- **Ring 0 (CPL = 0)**: Przestrzeń Jądra (*Kernel Space* / *Supervisor Mode*). Jądro Linuksa ma pełny dostęp do wszystkich instrukcji maszynowych i całej przestrzeni adresowej sprzętu.

```
       ┌──────────────────────────────────────────────────┐
       │   Ring 3: Aplikacje, Bash, Biblioteka glibc       │
       └────────────────────────┬─────────────────────────┘
                                │  Instrukcja SYSCALL (RAX = nr)
       ═════════════════════════╪══════════════════════════ Granica sprzętowa
                                ▼
       ┌──────────────────────────────────────────────────┐
       │   Ring 0: Linux Kernel (Obsługa przerwania)       │
       │   - Rejestr MSR IA32_LSTAR wskazuje wejście      │
       │   - Zrzut rejestrów na stos (struct pt_regs)     │
       │   - Wykonanie funkcji sys_call_table[RAX]        │
       │   - Powrót instrukcją SYSRET                     │
       └──────────────────────────────────────────────────┘
```

<data-sys-ring-bridge preset="write"></data-sys-ring-bridge>

### 2. Mechanizm wywołania systemowego (Syscall Dispatcher)
Gdy program w C wywołuje funkcję zapisu danych do pliku `write(fd, buf, count)`:
1. Biblioteka `glibc` umieszcza unikalny identyfikator wywołania systemowego w rejestrze `RAX` (dla `sys_write` na x86_64 jest to liczba **1**).
2. Argumenty funkcji trafiają do kolejnych rejestrów zgodnie z konwencją ABI x86_64: `RDI` = deskryptor pliku `fd`, `RSI` = wskaźnik na bufor w pamięci `buf`, `RDX` = liczba bajtów `count`.
3. Wykonywana jest instrukcja maszynowa `syscall`.

Sprzęt procesora w ułamku nanosekundy wykonuje sekwencję atomową:
- Zapisuje aktualny wskaźnik instrukcji `%rip` do rejestru `%rcx`.
- Zapisuje rejestr flag `%rflags` do `%r11`.
- Ładuje do `%rip` stały adres procedury wejściowej jądra z rejestru modelowego procesora **`MSR IA32_LSTAR`** (*Long System Target Address Register*).
- Przestawia bity CPL w rejestrze `%cs` na wartość **0** (Ring 0).

W jądrze wykonywana jest procedura asocjacyjna `entry_SYSCALL_64`, która zapisuje wszystkie rejestry procesora na dedykowany stos jądra do struktury `struct pt_regs`, weryfikuje poprawność wskaźników z przestrzeni użytkownika, wykonuje kod sterownika dysku i powraca do Ring 3 instrukcją maszynową `sysret`.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Jądro vs GNU/Linux:** Linux to jądro systemu operacyjnego. Do kompletnego środowiska pracy niezbędne są narzędzia przestrzeni użytkownika, kompilatory i biblioteki standardowe pochodzące z projektu GNU.
- **Rola dystrybucji:** Dystrybucja łączy jądro, menedżer pakietów, instalator oraz środowisko pulpitu w gotowy, przetestowany produkt inżynierski.
- **Konfiguracja w plikach tekstowych:** Linux organizuje konfigurację usług w plikach tekstowych w katalogu `/etc/`, eliminując pojedynczy binarny punkt awarii znany z Rejestru Windows.
- **Jednolite drzewo FHS:** Wszystkie dyski i partycje są montowane wewnątrz jednego wspólnego drzewa zaczynającego się od korzenia `/`.
- **Niezależność jądra od grafiki:** Interfejs graficzny jest opcjonalną aplikacją przestrzeni użytkownika. Serwery działają stabilnie w trybie bezgłowym (*headless*) bez zainstalowanego pulpitu.
- **Autoryzacja `sudo`:** Dostęp do uprawnień administratora `root` jest przydzielany selektywnie na czas wykonania konkretnego polecenia, chroniąc integralność systemu operacyjnego.
