# Instalacja Windows 11 w środowisku wirtualnym (VirtualBox)

Budowa kompetencji inżynieryjnych wymaga bezpiecznego, w pełni izolowanego poligonu doświadczalnego. Zamiast ingerować w środowisko produkcyjne fizycznej stacji roboczej (*host*), do walidacji procesów wdrożeniowych wykorzystamy **maszynę wirtualną** (VM). Zapewni nam to kontrolę nad alokacją zasobów oraz bezpieczne środowisko do nauki.

> [!NOTE]
> Technologie wirtualizacji opierają się na warstwie abstrakcji sprzętowej zwanej *hypervisorem*. Dzielimy je na dwa typy architektoniczne:
> - **Type 1 (Bare-metal)** – rezyduje bezpośrednio na fizycznym sprzęcie, eliminując system-gospodarza. Stanowi rdzeń nowoczesnych centrów danych i chmury (np. **VMware ESXi**, **Microsoft Hyper-V**, **KVM**).
> - **Type 2 (Hosted)** – działa jako standardowa usługa w przestrzeni systemu operacyjnego gospodarza. Zapewnia doskonałą elastyczność w laboratoriach kosztem niewielkiego spadku wydajności (np. **Oracle VM VirtualBox**, **VMware Workstation**).

![Schemat hypervisorów Type 1 vs Type 2](/public/courses/windows-11/Images/hypervisors-schemat.webp)

:::diagram
Schemat porównuje architekturę hypervisorów Typu 1 i Typu 2. Po lewej stronie (Typ 1) warstwa wirtualizacji (Hypervisor) działa bezpośrednio na sprzęcie fizycznym (RAM, SSD, CPU) i zarządza maszynami wirtualnymi (VM1, VM2, VM3). Po prawej stronie (Typ 2) hypervisor działa jako aplikacja wewnątrz systemu operacyjnego gospodarza (Host OS), który pośredniczy w dostępie do sprzętu.
:::

**Opis strukturalny diagramu**

1. **Hypervisor Typu 1 (Bare-metal)** – bezpośredni przepływ kontroli: Sprzęt fizyczny (RAM, SSD, CPU) → warstwa Hypervisora (oznaczona fioletowym laptopem) → trzy niezależne maszyny wirtualne (VM1, VM2, VM3).  
2. **Hypervisor Typu 2 (Hosted)** – warstwowy przepływ kontroli: Sprzęt fizyczny (RAM, SSD, CPU) → System Operacyjny Gospodarza (Host OS oznaczony niebieskim monitorem) → warstwa Hypervisora (fioletowy laptop) → maszyny wirtualne (VM1, VM2, VM3).  
3. **Komponenty maszyn wirtualnych** – w obu typach każda maszyna wirtualna (VM) jest reprezentowana przez niebieski monitor z ikoną wirtualnego kontenera (sześcianu).

---

## ⚙️ Inicjacja środowiska hypervisora

Przed utworzeniem maszyny wirtualnej zoptymalizuj parametry globalne silnika VirtualBox. Kluczową modyfikacją jest relokacja (przeniesienie w inne miejsce) *domyślnego folderu maszyn wirtualnych*. Domyślnie instancje (Twoje wirtualne komputery) są zapisywane na dysku systemowym `C:\`.  
Ponieważ ich wirtualne dyski twarde w formacie _**VDI**_ (*Virtual Disk Image*) potrafią zajmować dziesiątki gigabajtów, doprowadzi to błyskawicznie do wysycenia całej dostępnej przestrzeni blokowej nośnika.

![Ustawienia globalne VirtualBox](/public/courses/windows-11/Images/ustawienia-globalne-vb.webp)

Kreator maszyny pozwala na natychmiastowe zmapowanie pliku $\text{ISO}$ jako wirtualnego napędu optycznego dla środowiska instalatora:

![Nowa maszyna wirtualna w VirtualBox](/public/courses/windows-11/Images/nowa-maszyna-wirtualna-vb.webp)

> [!WARNING]
> Jeżeli testujesz środowisko rozruchowe uruchamiane bezpośrednio z bootowalnego pendrive'a z narzędziem **Ventoy**, nie mapuj obrazu $\text{ISO}$ w kreatorze maszyny. Zamiast tego przetestujemy mechanizm **USB Passthrough** — to technika wirtualizacji, która przekierowuje fizyczny port USB stacji-matki bezpośrednio do odizolowanego środowiska maszyny-gościa. Dzięki temu maszyna myśli, że port jest fizycznie połączony z jej własną wirtualną płytą główną.

<data-tabs>
    <tabs>
        <b>🚀 Uruchomienie Ventoy (USB Passthrough)</b>
        <b>🔴 Obsługa błędu: Security Violation (0x1A)</b>
    </tabs>
    <div>

Po zasileniu maszyny zamknij okno wyboru $\text{ISO}$ i z poziomu górnego paska kontrolnego hypervisora zainicjuj przechwycenie interfejsu USB ze stacji-matki: <kbd class="win-menu-btn">Urządzenia</kbd> → <kbd class="win-menu-btn">USB</kbd> i wskaż fizyczny pendrive.

![Uruchomienie Ventoy z pendrive](/public/courses/windows-11/Images/uruchomienie-ventoy-z-pendrive.webp)

W prawym dolnym rogu okna podglądu znajdziesz wskaźnik **klawisza hosta** (domyślnie <kbd>Prawy Ctrl</kbd>). Służy on do wyswobadzania obsługi urządzeń wskazujących ze środowiska wirtualnego. Po ludzku jak ci maszyna odbierze kursor myszki to klikając <kbd>Prawy Ctrl</kbd> go odzyskasz.
Zainicjuj reset sprzętowy maszyny za pomocą polecenia <kbd>Prawy Ctrl</kbd> + <kbd>R</kbd>, aby ją zbootować z podpiętego właśnie USB.

</div>
<div>

Jeżeli pojawia się niebieski ekran **Security Violation (0x1A)** to znaczy, że Ventoy nie jest podpisany cyfrowo lub UEFI go nie akceptuje.

![Verification failed (0x1A) Security Violation](/public/courses/windows-11/Images/Verification-failed-(0x1A)-Security-Violation.png)

**Rozwiązanie:** W ustawieniach maszyny wirtualnej wyłącz `Secure Boot`.

![Wyłączenie Secure Boot](/public/courses/windows-11/Images/disable-secure-boot-vm.webp)

</div>
</data-tabs>

---

Jeżeli maszyna wirtualna po restarcie poprawnie odczyta Twój fizyczny pendrive (dzięki *USB Passthrough*), na ekranie powita Cię menu *Ventoy*.

![Ventoy w maszynie wirtualnej](/public/courses/windows-11/Images/ventoy-w-maszynie-wirtualnej.webp)

Teraz wybierz z listy wrzucony wcześniej plik $\text{ISO}$ (w naszym wypadku instalator Windows 11). *Ventoy* zapyta Cię, w jakim trybie ma emulować ten plik:

| Opcja                       | Do czego służy?                                                                                                                                            |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Boot in normal mode**     | Standardowe i preferowane uruchomienie obrazu (wczytanie instalatora `WinPE`).                                                                             |
| **Boot in winboot mode**    | Tryb awaryjny instalacji Windowsa. Wybierasz go, gdy przy normalnym trybie maszyna „wisi” lub wyrzuca czarny ekran (co często zdarza się w wirtualizacji). |
| **File checksum**           | Weryfikacja sumy kontrolnej. Program przelicza plik, by sprawdzić czy nie uszkodził się podczas kopiowania. Zazwyczaj pomijasz.                            |
| **Return to previous menu** | Powrót do wyboru innych plików $\text{ISO}$.                                                                                                               |

---

<data-gate>
  <data-quiz>
    <question>
Uruchamiasz maszynę wirtualną z wpiętym pendrivem Ventoy, ale instalator nie chce ruszyć, a Ty widzisz wielki niebieski ekran **Security Violation (0x1A)**. Jaka jest tego przyczyna i jak to rozwiązać?
    </question>
    <options>
      <option correct>UEFI nie rozpoznaje podpisu Ventoy. Trzeba wyłączyć maszynę i odznaczyć 'Secure Boot' w jej ustawieniach</option>
      <option>Oznacza to, że Twój obraz $\text{ISO}$ z Windowsem jest uszkodzony i musisz wykonać 'File checksum'.</option>
      <option>Wirtualizacja blokuje porty USB, więc musisz sformatować pendrive Rufusem w standardzie MBR.</option>
    </options>
    <div data-hint="error">
      Błąd 0x1A pojawia się, zanim w ogóle dotkniesz pliku ISO czy formatowania Rufusem. To mechanizm samej maszyny (na poziomie UEFI) blokujący środowiska bez oficjalnego certyfikatu.
    </div>
    <div data-hint="success">
      Dokładnie tak. Opcja Secure Boot wymaga, by wszystko, co odpala się przed Windowsem, było podpisane kluczem znanym przez Microsoft. Ventoy tego nie ma, więc musimy wyłączyć tę restrykcję na wirtualnej płycie głównej.
    </div>
  </data-quiz>
</data-gate>

---

## 💽 Środowisko Wdrożeniowe (WinPE)

Po załadowaniu do pamięci środowiska `WinPE` (*Windows Preinstallation Environment*) zobaczysz okno instalatora. To miejsce, w którym definiujesz swój region i układ klawiatury.

![Krok 1 instalatora – język i klawiatura](/public/courses/windows-11/Images/instalacja-win-11-krok1.webp)

Na kolejnych ekranach akceptujesz regulamin i wyrażasz zgodę na ewentualne usunięcie danych z dysku, po czym dochodzisz do weryfikacji licencji. Jeśli masz **Klucz produktu**, wpisz go tutaj. Jeśli chcesz zainstalować system w darmowym trybie testowym, po prostu kliknij *"Nie mam klucza produktu"*.

![Krok 2 instalatora – klucz produktu i opcja instalacji/naprawy](/public/courses/windows-11/Images/instalacja-win-11-krok2.webp)

---

## 🏷️ Wybór edycji Windows

To etap, na którym decydujesz, za które funkcje systemu płacisz. W komputerach domowych i biurowych spotkasz się zazwyczaj z edycjami `Home` i `Pro`.

> [!NOTE]
> Wersje z dopiskiem **N** (np. `Pro N`) nie mają wbudowanych odtwarzaczy multimediów ani kodeków wideo. To wymóg Unii Europejskiej, która ukróciła w ten sposób monopol Microsoftu, by dać równe szanse zewnętrznym programom np. VLC.

<details>
    <summary>📋 Lista edycji Windows 11</summary>

| Edycja                       | Zastosowanie                                                                                                                                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**                     | Podstawowa wersja do domu. Nie zaszyfrujesz nią dysku, nie podepniesz się do firmowej domeny, a instalator na siłę wymusi logowanie do konta Microsoft.                                             |
| **Home Single Language**     | To samo co `Home`, ale z zablokowaną możliwością zmiany języka systemu po instalacji. 😅                                                                                                             |
| **Pro**                      | Skrót od dla Profesjonalistów. Złoty standard w firmach. Oferuje sprzętowe szyfrowanie (BitLocker), wbudowaną wirtualizację (Hyper-V) i łatwe wpięcie do domeny w sieciach Active Directory.        |
| **Pro Education**            | Edycja `Pro` skrojona pod szkoły – z centralnym zarządzaniem ustawieniami dla uczniów.                                                                                                              |
| **Pro for Workstations**     | Wersja dla potężnych stacji roboczych. Obsługuje aż do $6\text{ TB}$ RAM-u i $4$ fizyczne procesory. Często wybierana do analizy danych i renderingu, oparta na nowoczesnym systemie plików `ReFS`. |
| **Enterprise**               | Edycja dla wielkich korporacji. Daje administratorom IT pełną kontrolę nad tysiącami stacji z jednego miejsca (np. przez platformę Intune).                                                         |
| **Enterprise multi-session** | Specjalna wersja pod serwery chmurowe (np. Azure Virtual Desktop), pozwalająca pracować wielu osobom naraz z jednego systemu.                                                                       |
| **IoT Enterprise**           | Stabilna wersja na lata. Trafia do bankomatów, kas fiskalnych i paneli przemysłowych. Działa bez awarii i nie jest zaśmiecona wbudowanymi reklamami i apkami (bloatware).                           |

</details>

![Krok 3 – Wybór edycji Windows 11](/public/courses/windows-11/Images/instalacja-win-11-krok3.webp)

<data-gate>
  <data-quiz>
    <question>
Jesteś odpowiedzialny za flotę komputerów w korporacji. Twoim zadaniem jest zapewnienie sprzętowego szyfrowania dysków (BitLocker) oraz weryfikacji tożsamości poprzez firmowy serwer (Active Directory). Jakiej licencji użyjesz?
    </question>
    <options>
      <option>Home</option>
      <option correct>Pro</option>
      <option>Home Single Language</option>
    </options>
    <div data-hint="error">
      Żadna z edycji domowych (Home) ani specjalistycznych terminali (IoT) nie posiada wbudowanych modułów do szyfrowania BitLocker oraz wejścia do domeny. Te funkcje startują od wyższego pułapu.
    </div>
    <div data-hint="success">
      Dokładnie. Wersja `Pro` to minimalny wymóg, by móc podłączyć komputer do środowiska korporacyjnego *Active Directory* i włączyć funkcję szyfrowania **BitLocker**.
    </div>
  </data-quiz>
</data-gate>

---

## 🗄️ Zarządzanie dyskiem i partycjami

To ten moment, w którym decydujesz o fizycznym i logicznym podziale dysku. Pomyłka w tym miejscu oznacza nadpisanie niewłaściwych sektorów i całkowitą utratę danych (np. prywatnych zdjęć użytkownika komputera).

Kiedy na pustym dysku po prostu klikniesz <kbd class="win-menu-btn">Dalej</kbd>, instalator podzieli miejsce nie na jedną, ale od razu na **trzy partycje**. 
> UEFI jest rygorystyczne i bez ukrytych partycji pomocniczych po prostu nie włączy systemu.

![Krok 4 – Tworzenie partycji](/public/courses/windows-11/Images/instalacja-win-11-krok4.webp)

| Partycja                 | Rozmiar                                                           | Po co istnieje?                                                                                                                                                                  |
| :----------------------- | :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Systemowa (EFI)**      | <span style="white-space: nowrap">$\approx 100 \text{ MB}$</span> | To tutaj ląduje bootloader (Menedżer rozruchu). <br>UEFI płyty głównej najpierw zagląda tutaj, żeby w ogóle wiedzieć, skąd i jak wystartować Windowsa.                           |
| **MSR**                  | $\approx 16 \text{ MB}$                                           | (Microsoft Reserved Partition). Ślepy, pusty bufor. <br>System zostawia sobie tę przestrzeń, żeby w przyszłości móc w locie zarządzać innymi partycjami dysku bez utraty plików. |
| **Podstawowa (Primary)** | Cała reszta                                                       | Twój główny dysk `C:\`. To na nim ląduje jądro systemu, pliki instalacyjne i wszystkie Twoje przyszłe dane.                                                                      |

> [!IMPORTANT]
> Instalujesz system na starym, używanym dysku? Samo sformatowanie partycji `C:\` to błąd – w ten sposób zostawisz stary bootloader na ukrytej partycji EFI. 
> 
> **Zrób to poprawnie:**
> 1. Zgraj wszystkie ważne pliki na zewnętrzny dysk/pendrive.
> 2. W instalatorze zaznaczaj każdą istniejącą partycję po kolei i klikaj `Usuń`.
> 3. Rób tak, aż na ekranie zostanie tylko jedno wolne **Nieprzydzielone miejsce**.
> 4. Zaznacz to miejsce i kliknij <kbd class="win-menu-btn">Dalej</kbd>. Instalator zbuduje świeżą trójcę partycji (EFI, MSR i Główną).

---

<data-gate>
  <data-quiz>
    <question>
Czym dokładnie jest partycja MSR o pojemności zaledwie $16 \text{ MB}$ tworzona na czystym dysku podczas instalacji Windows 11?
    </question>
    <options>
      <option>Miejsce na bootloader i konfigurację uruchamiania, czytane przez UEFI od razu po starcie zasilania.</option>
      <option correct>Pusty, ukryty kontener, z którego Microsoft korzysta podczas operacji dynamicznego zmieniania wielkości innych partycji.</option>
      <option>Nowoczesny zamiennik dawnego sektora MBR (Master Boot Record) dla starszych płyt głównych.</option>
      <option>Instalator umieszcza na niej pliki kopii zapasowej przed formatowaniem.</option>
    </options>
    <div data-hint="error">
      Zwróć uwagę na samo rozwinięcie skrótu (Microsoft Reserved). To nie jest miejsce na stare bootloadery, instrukcje startowe ani backupy instalatora.
    </div>
    <div data-hint="success">
      Poprawnie. Microsoft rezerwuje na tablicach partycji GPT trochę darmowego miejsca (bufor), które może w każdej chwili posłużyć do bezkolizyjnego re-aranżowania dysku w przyszłości.
    </div>
  </data-quiz>
</data-gate>

---

## ⌨️ DiskPart – partycjonowanie z konsoli

Zazwyczaj po prostu klikasz <kbd class="win-menu-btn">Dalej</kbd> i instalator sam dzieli dysk. Warto jednak wiedzieć, jak zbudować układ partycji całkowicie ręcznie, nie polegając na tym co zrobi za nas instalator.

Zróbmy to z poziomu konsoli:
1. Będąc w instalatorze, wciśnij na klawiaturze <kbd>Shift</kbd> + <kbd>F10</kbd>.
2. W czarnym oknie wpisz komendę `diskpart` i naciśnij <kbd>Enter</kbd> by ją wykonać.

Jesteś teraz w trybie tekstowym i możesz dzielić dysk za pomocą komend.

![CMD z DiskPart podczas instalacji](/public/courses/windows-11/Images/konsola-cmd-w-instalatorze-win-z-diskpart.webp)

### Zrozumienie Systemów Plików

Zanim cokolwiek sformatujesz, musisz zrozumieć jak systemy organizują pojedyncze pliki na nośniku.

| System Plików | Charakterystyka w IT                                                                                                                                                                                                                                                                       |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NTFS**      | Domyślny format Windowsa. Przechowuje ogromne pliki, zapamiętuje kto ma prawo do odczytu (uprawnienia ACL) i pozwala na sprzętowe szyfrowanie BitLocker.                                                                                                                                   |
| **FAT32**     | Stary format z lat $90'$, na którym nie zapiszesz pliku większego niż $4\text{ GB}$. Mimo to ma potężną zaletę – każda płyta główna (UEFI) potrafi go bez problemu przeczytać zaraz po włączeniu prądu. Dlatego właśnie instalatory z pendrive'ów i partycje rozruchowe muszą na nim stać. |
| **exFAT**     | Nowocześniejsza wersja FAT32 bez limitu $4\text{ GB}$ wielkości na plik. Powszechnie używana do pendrive'ów, bo od ręki przeczyta go nie tylko Windows, ale również Mac OS i Linux.                                                                                                        |

---

<data-gate>
  <data-quiz>
    <question>
W jakim systemie plików należy zawsze sformatować ukrytą, ważącą ok. $100\text{ MB}$ Partycję Systemową (EFI) przechowującą pliki rozruchowe Windowsa?
    </question>
    <options>
      <option>NTFS</option>
      <option>exFAT</option>
      <option correct>FAT32</option>
      <option>ReFS</option>
    </options>
    <div data-hint="error">
      Pamiętaj, że płyta główna z UEFI zaraz po starcie zasilania to środowisko bardzo proste i rygorystyczne. Nie ma w nim sterowników na odczytywanie skomplikowanej budowy i uprawnień plików NTFS czy ReFS.
    </div>
    <div data-hint="success">
      Dokładnie. Płyta główna komputera jest na tyle uproszczona, że z marszu umie wczytać strukturę plików tylko z prehistorycznego i najprostszego pod słońcem FAT32.
    </div>
  </data-quiz>
</data-gate>

---

Oto sekwencja komend, która w DiskPart wykonuje dokładnie tę samą pracę, co kliknięcie <kbd class="win-menu-btn">Nowa</kbd> na nieprzydzielonym miejscu w instalatorze:

![Komendy DiskPart – tabela](/public/courses/windows-11/Images/DiskPart-instalator-Windows.webp)

<details>
<summary>📋 Pełna ściągawka komend DiskPart</summary>

| Polecenie                             | Co robi?                                                                                                                                                                                                                                    |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `diskpart`                            | Uruchamia narzędzie z poziomu konsoli.                                                                                                                                                                                                      |
| `list disk`                           | Wyświetla listę podpiętych fizycznie dysków. (Gwiazdka `*` przy nazwie oznacza dysk o nowoczesnej tablicy GPT).                                                                                                                             |
| `select disk X`                       | Wybiera dysk o podanym numerze, na którym chcemy pracować.                                                                                                                                                                                  |
| `list part`                           | Wyświetla wykaz wszystkich partycji na wcześniej wybranym dysku.                                                                                                                                                                            |
| `clean`                               | Całkowicie wymazuje znaczniki partycji na dysku. Nieodwracalnie, lecz specjalistycznym oprogramowaniem można odzyskać dane.                                                                                                                 |
| `clean all`                           | Całkowicie wymazuje dosłownie wszystko na dysku. Nieodwracalnie.                                                                                                                                                                            |
| `convert gpt`                         | Zmienia styl partycjonowania z przestarzałego MBR na nowoczesny GPT (wymagany przez Windows 11 i UEFI).                                                                                                                                     |
| `create partition efi size=100`       | Tworzy partycję Systemową o wielkości $100\text{ MB}$. którą warto od razu sformatować: `format fs=fat32 quick`. Ponieważ sam instalator Windowsa czasami miewa humory, jeśli dostanie surową, niesformatowaną partycję oznaczoną jako EFI. |
| `create partition msr size=16`        | Tworzy partycję MSR o wielkości $16\text{ MB}$.                                                                                                                                                                                             |
| `create partition primary`            | Tworzy partycję Podstawową, zajmując domyślnie resztę wolnego miejsca.                                                                                                                                                                      |
| `format fs=fat32 quick`               | Szybko formatuje wybraną w danej chwili partycję w starym systemie plików FAT32.                                                                                                                                                            |
| `format fs=ntfs quick label="System"` | Szybko formatuje wybraną w danej chwili partycję w docelowym NTFS i nadaje jej nazwę "System".                                                                                                                                              |
| `assign letter=X`                     | Przypisuje do partycji odpowiednią literę dysku w podglądzie (np. *C*).                                                                                                                                                                     |
| `exit`                                | Opuszcza środowisko `diskpart`.                                                                                                                                                                                                             |

</details>

---

<data-gate>
  <data-quiz>
    <question>
Pracujesz w konsoli DiskPart z fabrycznie nowym dyskiem. Chcesz utworzyć na nim partycję EFI do rozruchu UEFI. W jakiej kolejności powinieneś wywołać pierwsze komendy przed poleceniem „create partition”?
    </question>
    <options>
      <option correct>`select disk X` → `clean` → `convert gpt`</option>
      <option>`convert gpt` → `clean` → `select disk X`</option>
      <option>`clean` → `select disk X` → `convert gpt`</option>
      <option>`create partition ...` → `clean` → `convert gpt`</option>
    </options>
    <div data-hint="error">
      Zła kolejność. Narzędzie powłoki musi najpierw wiedzieć „na jaki dysk patrzy”.
    </div>
    <div data-hint="success">
      Tak jest. Wybierasz cel (`select disk X`), całkowicie oczyszczasz dysk (`clean`), a potem, stawiając go na nowo mówisz: "od teraz jesteś dyskiem typu GPT" (`convert gpt`).
    </div>
  </data-quiz>
</data-gate>

---

## 🕹️ Symulator konsoli (DiskPart)

Spróbuj przeprowadzić weryfikację swojej wiedzy, wykorzystując symulator narzędzia DiskPart poniżej. Wykonanie czystego rozstawienia dysku otworzy Ci drogę do ostatniego etapu lekcji.


> [!NOTE]
> _**Emulator**_: aplikacja pozwalająca działać np. systemowi Android na komputerze stacjonarnym.
> _**Symulator**_: program komputerowy, tworzący uproszczony model jakiegoś zjawiska lub procesu (zgodny z regułami danego zjawiska, ale pozbawiony detali). 
> Jest to wirtualne odwzorowanie rzeczywistości.

<data-gate>
  <data-diskpart-widget></data-diskpart-widget>
</data-gate>

---

## ⚙️ Pierwsze Uruchomienie (OOBE)

Gdy proces kopiowania plików dobiegnie końca, komputer uruchomi się ponownie. Od tego momentu Windows ładuje się już bezpośrednio z dysku `C:\`, a pamięć tymczasowa pendrive'a powinna automatycznie zostać odłączona (Co nie zawsze ma miejsce i wtedy może ponownie załadować się instalator). 

Na ekranie wita Cię błękitny kreator konfiguracji: **OOBE** (*Out-of-Box Experience*).

Dlaczego system ponownie pyta o język i klawiaturę? Za pierwszym razem wybierałeś je tylko na użytek programu rozruchowego. Teraz ustalasz je docelowo: program zapisze te dane na stałe w rejestrze nowego systemu.

Co dokładnie musisz tam ustawić?
1. **Lokalizacja:** strefa czasowa, waluta i rodzaj klawiatury.
2. **Nazwa urządzenia (Hostname):** identyfikator PC w sieci. To po nim Twój komputer będzie widoczny dla innych oraz dla administratorów w domenie Active Directory (w wersjach `Pro` i wyższych).

![Konfiguracja po instalacji – język, klawiatura, nazwa urządzenia](/public/courses/windows-11/Images/konfiguracja-poinstalacyjna-win11-krok1.webp)

3. **Przeznaczenie (Dom/Praca):** ekran dostępny tylko w edycjach `Pro` i wyższych. Jeżeli wskażesz opcję „Praca” i poprawnie uwierzytelnisz się kontem służbowym, system zostanie automatycznie zablokowany i podporządkowany pod polityki bezpieczeństwa (GPO) narzucone przez serwery Twojej firmy.
4. **Logowanie z serwera Microsoft:** system Windows 11 oficjalnie blokuje założenie konta lokalnego (*offline*) i wymusza podłączenie profilu z chmury.



![Konfiguracja po instalacji – login i preset](/public/courses/windows-11/Images/konfiguracja-poinstalacyjna-win11-krok2.webp)

---

## 🔐 Obejście wymogu sieci: BYPASSNRO

Samo odpięcie kabla internetowego nie pozwala pominąć logowania online w Windowsie 11. System po prostu zablokuje kreator komunikatem o braku sieci i nie pozwoli kliknąć <kbd class="win-menu-btn">Dalej</kbd>. Microsoft nazywa tę blokadę **NRO** (*Network Registration Obligation*).

> Microsoft wprowadził obowiązek konta sieciowego, ponieważ chce Cię w ekosystemie płatnych subskrypcji, AI i chmury. Dokładnie tak samo jak to robi Apple z iCloud. 🍎💲

W serwisie IT to duży problem. Bardzo często stawia się czyste maszyny offline, przeznaczone wyłącznie do logowania domenowego, bez przypisywania konta prywatnego z chmury.

Blokadę NRO da się obejść:
1. Upewnij się, że maszyna **nie ma dostępu do internetu** (odłącz kabelek sieciowy w VirtualBox).
![Konfiguracja – brak internetu](/public/courses/windows-11/Images/konfiguracja-poinstalacyjna-win11-krok3.webp)
2. Użyj kombinacji klawiszy <kbd>Shift</kbd> + <kbd>F10</kbd> aby otworzyć konsolę **CMD**.
3. W konsoli CMD wpisz poniższą komendę i naciśnij <kbd>Enter</kbd>:

```powershell
oobe\bypassnro
```

Komputer uruchomi się ponownie. Po załadowaniu OOBE, obok przycisku <kbd class="win-menu-btn">Dalej</kbd> pojawi się ukryta wcześniej opcja:  
*"Nie mam internetu"*. 

Jej kliknięcie ostatecznie omija proces chmurowy i pozwala założyć typowe konto lokalne (*offline*), trzymane wyłącznie na Twoim dysku.

![Konfiguracja – opcja "Nie mam internetu"](/public/courses/windows-11/Images/konfiguracja-poinstalacyjna-win11-krok4.webp)

---

<data-gate>
  <data-quiz>
    <question>
Dlaczego komenda `oobe\bypassnro` wymusza na maszynie twardy restart komputera, zamiast w locie udostępnić przycisk "Nie mam internetu"?
    </question>
    <options>
      <option correct>To skrypt, który wstrzykuje flagę wyłączającą uciążliwy proces do rejestru Windowsa. Kreator OOBE sprawdza wytyczne z tego rejestru tylko podczas swojego starcia z jądrem – dlatego restart jest konieczny.</option>
      <option>Komenda pobiera z sieci i w locie dekompiluje fałszywy klucz weryfikacyjny od Microsoftu, a do tej akcji UEFI wymaga zresetowania RAMu.</option>
      <option>Wykonując komendę wyłączasz w systemie wirtualne zasilanie karty sieciowej, za co instalator obraża się wywalając system przed jego odpaleniem graficznym.</option>
    </options>
    <div data-hint="error">
      Złe założenie. Komenda wstrzykuje wytyczne wyłączające do rejestru. Karta sieciowa i klucze licencyjne nie mają tu znaczenia – Windows musi po prostu uruchomić się ponownie, żeby instalator odczytał te modyfikacje w rejestrze i ukrył blokadę konta lokalnego.
    </div>
    <div data-hint="success">
      W punkt. Komenda wpisuje odpowiedni dopisek do bazy rejestru. Restart zmusza OOBE do załadowania tych danych ponownie – tym razem odczytując zignorowanie przymusowych połączeń do konta Microsoft.
    </div>
  </data-quiz>
</data-gate>

---

## 🔗 Połącz Koncepcje Instalacji Systemowych

Poniższy test kompetencyjny wymusza zestawienie pojęć inżynieryjnych ze spotykanymi w procesie instalacyjnym procedurami i skrótami.

<data-gate>
  <data-connection-matcher title="Integracja Systemowa Windows">
    <item left="Rozwiązanie obejścia wymogu stałego połączenia do serwerów Microsoftu" right="Odpięcie sieci i <code>oobe\bypassnro</code>"></item>
    <item left="Błąd wygenerowany podczas uruchamiania Ventoy'a z poziomu VirtualBox" right="Security Violation 0x1A oraz wyłączenie Secure Boot"></item>
    <item left="Otwarcie konsoli CMD podczas działającego instalatora Windows" right="Kombinacja <kbd>Shift</kbd> + <kbd>F10</kbd>"></item>
    <item left="System plików dla krytycznej ukrytej partycji rozruchowej bootloadera (EFI)" right="Protokół obsługiwany z biegu przez UEFI czyli FAT32"></item>
    <item left="Prawidłowa kolejność formatowania i wprowadzania nowego standardu" right="<code>select disk X </code>→ <code>clean</code> → <code>convert gpt</code>"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W dowolnym momencie instalatora Windows można wywołać konsolę CMD kombinacją <kbd>Shift</kbd> + <kbd>F10</kbd>. Daje to bezpośredni dostęp do narzędzi takich jak `diskpart` czy skryptu `oobe\bypassnro`. 🥷
- Formatowanie partycji `C:\` nie usuwa starych plików rozruchowych z ukrytych wolumenów. Do całkowitego wyczyszczenia dysku używa się przycisku `Usuń` na wszystkich partycjach po kolei. 🧹
- Płyty główne z UEFI rozpoznają pliki rozruchowe bezpośrednio po włączeniu zasilania wyłącznie na partycjach (EFI) sformatowanych w systemie FAT32.
- Windows 11 wymaga do działania partycji o pojemności co najmniej $64\text{ GB}$.
- Instalator automatycznie dzieli dysk według układu partycji GPT (*GUID Partition Table*), pod warunkiem, że sam nośnik nie narzuca starszej struktury MBR.

---

Czy teraz u siebie zastosujesz *tabula rasa*? 😅

W następnej lekcji poznasz przydatne skróty klawiszowe i różnicę między GUI, a CLI.