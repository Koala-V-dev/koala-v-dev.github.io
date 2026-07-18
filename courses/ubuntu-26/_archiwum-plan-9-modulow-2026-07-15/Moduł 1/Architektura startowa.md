# Architektura startowa i proces rozruchu

Zrozumienie, jak system Linux budzi się do życia – od momentu naciśnięcia przycisku zasilania do wyświetlenia ekranu logowania stacji roboczej Ubuntu Desktop – to jedna z najważniejszych kompetencji każdego inżyniera i zaawansowanego użytkownika. Proces ten składa się z kilku niezależnych faz, z których każda odpowiada za inicjalizację innej warstwy ogólnej architektury systemu.

---

## 🔌 Faza 1: Inicjalizacja sprzętowa (Firmware/UEFI)

Zanim jakikolwiek system operacyjny zacznie działać, kontrolę nad komputerem przejmuje wbudowane oprogramowanie układowe płyty głównej – **UEFI (Unified Extensible Firmware Interface)**.

### Co dzieje się w fazie UEFI?
1. **_POST (Power-On Self-Test)_**: UEFI wykonuje podstawowe sprawdzenie komponentów komputera (procesor, pamięć RAM, napięcia zasilacza, karty rozszerzeń). Jeśli test wykryje usterkę krytyczną, płyta główna zgłosi błąd za pomocą sygnałów dźwiękowych (BEEP codes) lub diod diagnostycznych.
2. **Odczyt zmiennych NVRAM**: UEFI sprawdza zapisaną w nieulotnej pamięci konfigurację (np. kolejność bootowania stacji roboczej).
3. **Dostęp do partycji ESP**: UEFI wyszukuje na dyskach partycję **ESP (EFI System Partition)**. Jest to partycja sformatowana w systemie plików FAT32, oznaczona specjalnym identyfikatorem GUID. Na tej partycji znajdują się programy rozruchowe różnych systemów (np. pod ścieżką `/EFI/BOOT/` lub `/EFI/ubuntu/`).

### 🛡️ Secure Boot i łańcuch zaufania
Większość współczesnych stacji roboczych posiada włączony mechanizm _**Secure Boot**_. Ma on na celu ochronę przed złośliwym oprogramowaniem modyfikującym kod rozruchowy (np. rootkitami).
* UEFI weryfikuje podpis cyfrowy pierwszego ładowanego programu. Ponieważ klucze podpisu Canonical nie są wbudowane bezpośrednio w każdy chip UEFI (tam zazwyczaj znajduje się tylko klucz Microsoftu), Ubuntu używa pośrednika o nazwie **Shim** (`shimx64.efi`).
* Program Shim posiada podpis cyfrowy Microsoftu (co pozwala mu przejść weryfikację Secure Boot płyty głównej) oraz zawiera wbudowany certyfikat Canonical.
* Następnie Shim weryfikuje podpis bootloadera GRUB2 (`grubx64.efi`) przy użyciu klucza Canonical i go uruchamia, przedłużając w ten sposób łańcuch zaufania.

---

## 🧭 Faza 2: Ładowanie systemu (GRUB2)

**GRUB2 (Grand Unified Bootloader)** to oficjalny i niezwykle elastyczny program rozruchowy stosowany domyślnie w dystrybucji Ubuntu Desktop.

### Rola GRUB2:
* **Odczyt konfiguracji**: GRUB2 odczytuje swój plik konfiguracyjny *grub.cfg* (zlokalizowany w `/boot/grub/grub.cfg`, generowany automatycznie na bazie `/etc/default/grub`).
* **Menu wyboru**: Wyświetla graficzne menu, w którym użytkownik może wybrać starszą wersję jądra w razie awarii lub przejść do trybu ratunkowego.
* **Załadowanie jądra i initramfs**: GRUB2 lokalizuje na partycji systemowej dwa kluczowe pliki, wczytuje je do pamięci operacyjnej RAM i przekazuje sterowanie do procesora. Te pliki to:
  1. *vmlinuz* – skompresowany obraz jądra systemu Linux.
  2. *initramfs* – obraz tymczasowego systemu plików w pamięci RAM.

---

## 🐧 Faza 3: Jądro (vmlinuz) i Initramfs

Gdy GRUB2 kończy swoją pracę, jądro Linuksa (*vmlinuz*) przejmuje pełną kontrolę nad procesami systemowymi. Na tym etapie system nie ma jeszcze dostępu do właściwego dysku twardego.

### Rola Initramfs (Initial RAM Filesystem)
Tradycyjne jądro nie zawiera w sobie sterowników do każdego urządzenia na rynku, ponieważ jego rozmiar byłby zbyt duży. Co więcej, jeśli system operacyjny zainstalowano na zaszyfrowanym dysku (**LUKS**) lub na wolumenach logicznych (**LVM**), jądro nie potrafi go odczytać bez uruchomienia dodatkowego oprogramowania.
1. **Samorozpakowanie**: Jądro dekompresuje się w pamięci RAM i uruchamia podstawowe podsystemy (zarządzanie pamięcią, wątkami procesora).
2. **Montowanie Initramfs**: Jądro montuje wczytany przez GRUB2 plik *initramfs* jako tymczasowy główny system plików w pamięci RAM.
3. **Uruchomienie skryptu init**: Wewnątrz initramfs jądro uruchamia skrypt `/init`. Skrypt ten ładuje niezbędne moduły jądra (np. sterowniki SATA/NVMe, moduły kryptograficzne do odszyfrowania LUKS, obsługę LVM lub systemów plików Btrfs/ZFS).
4. **Odszyfrowanie i Pivot**: Po pomyślnym zamontowaniu fizycznego dysku systemowego stacji roboczej, initramfs wykonuje operację `switch_root` (lub `pivot_root`). Tymczasowy system plików w RAM-ie zostaje zwolniony z pamięci, a nowym głównym katalogiem `/` staje się fizyczna partycja na dysku twardym.

---

## ⚙️ Faza 4: Inicjalizacja usług (Systemd)

Po zamontowaniu właściwego systemu plików, jądro Linuksa uruchamia pierwszy oficjalny proces przestrzeni użytkownika – `/sbin/init`, który w Ubuntu 26.04 LTS jest dowiązaniem do programu **systemd** (proces oznaczony jako **PID 1**).

### Równoległa inicjalizacja i cele (Targets)
Starsze systemy rozruchowe (SysVinit) uruchamiały usługi jedna po drugiej (szeregowo), co drastycznie spowalniało start komputera. **systemd** rewolucjonizuje ten proces, uruchamiając usługi równolegle i zarządzając zależnościami poprzez gniazda (sockets).

Systemd przechodzi przez tzw. cele rozruchu (**targets**):
1. *sysinit.target* – wstępna inicjalizacja systemu (zamontowanie dysków z `/etc/fstab`, włączenie pamięci swap, konfiguracja zegara).
2. *basic.target* – przygotowanie podstawowego środowiska operacyjnego (ładowanie sterowników urządzeń, modułów sieciowych).
3. *multi-user.target* – uruchomienie usług sieciowych, bazy danych, demonów systemowych (odpowiednik trybu konsolowego).
4. *graphical.target* – docelowy punkt dla stacji roboczej Ubuntu Desktop. Uruchamia menedżer wyświetlania **GDM3** (GNOME Display Manager), który prezentuje graficzny ekran logowania użytkownika.

> [!TIP]
> Jeśli chcesz przeanalizować czas startu poszczególnych faz i usług, systemd udostępnia dedykowane narzędzie diagnostyczne. Wpisz w terminalu **_systemd-analyze blame_** aby dowiedzieć się, które usługi najbardziej opóźniają rozruch Twojego komputera.

---

## 🛠️ Punkt Kontrolny: Architektura rozruchu
<data-gate>
  <data-quiz>
    <question>
Jaka jest hierarchiczna kolejność programów i etapów rozruchu stacji roboczej z Ubuntu Desktop?
    </question>
    <options>
      <item correct>UEFI (Shim $\rightarrow$ GRUB2) $\rightarrow$ Jądro (vmlinuz $\rightarrow$ Initramfs) $\rightarrow$ Systemd (graphical.target)</item>
      <item>Systemd (sysinit) $\rightarrow$ UEFI $\rightarrow$ GRUB2 $\rightarrow$ Jądro (vmlinuz)</item>
      <item>GRUB2 $\rightarrow$ UEFI $\rightarrow$ Initramfs $\rightarrow$ Systemd (multi-user.target)</item>
    </options>

<div data-hint="error">
  Zacznij od najniższego poziomu (płyta główna/firmware), następnie przejdź przez program rozruchowy i jądro operujące na dysku tymczasowym, aż do uruchomienia głównego menedżera usług systemd.
</div>
<div data-hint="success">
  Doskonale! Ta sekwencja precyzyjnie opisuje łańcuch zdarzeń rozruchu systemu Linux na nowoczesnej stacji roboczej.
</div>
  </data-quiz>
</data-gate>
