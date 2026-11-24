# Zarządzanie dyskami - parted i fstab

Jako administrator systemu Linux będziesz często stawać przed zadaniem podłączenia nowego dysku do serwera, podzielenia go na partycje, sformatowania oraz skonfigurowania tak, aby montował się automatycznie przy każdym uruchomieniu systemu.

W tej lekcji nauczysz się, jak zrealizować ten proces krok po kroku i bezpiecznie przy użyciu nowoczesnego narzędzia **`parted`**, poleceń systemu plików oraz pliku konfiguracyjnego **`/etc/fstab`**.

---

## 💽 Przygotowanie środowiska: dodanie nowego dysku

Przed rozpoczęciem pracy w terminalu do maszyny wirtualnej Ubuntu w programie VirtualBox dodajemy dodatkowy wirtualny dysk twardy (np. plik w formacie VDI o rozmiarze $25\ \text{GB}$ podpięty pod kontroler SATA lub NVMe).

![Dodanie nowego dysku w VirtualBox dla maszyny wirtualnej Ubuntu](/public/courses/ubuntu-26/Images/dodanie-nowego-dysku-w-vb-dla-ubuntu-vm.png)

Po uruchomieniu systemu nowo podłączony nośnik będzie widoczny dla jądra Linux jako czysty, nieprzydzielony zasób pamięci masowej.

---

## 🔍 Identyfikacja dysków w systemie

W systemach typu Linux wszystkie urządzenia fizyczne i wirtualne reprezentowane są w postaci specjalnych plików urządzeń w katalogu `/dev/`:

- **Tradycyjne dyski twarde i SSD (SATA/SCSI/IDE)** oznaczane są nazwami `/dev/sda`, `/dev/sdb`, `/dev/sdc` itd.
- **Nowoczesne dyski NVMe** oznaczane są według schematu `/dev/nvme0n1`, `/dev/nvme0n2` itd.
- **Partycje na dyskach** oznaczane są numerem na końcu nazwy (np. `/dev/sda1`, `/dev/sdb1`) lub z prefiksem `p` w przypadku NVMe (np. `/dev/nvme0n1p1`).

Aby wyświetlić drzewiastą strukturę podłączonych dysków i ich partycji, użyj narzędzia `lsblk`:

```bash
lsblk
```

![Podgląd dysków za pomocą lsblk w tym dysków SATA sda sdb oraz NVMe nvme0n1](/public/courses/ubuntu-26/Images/lsblk-2ssd-1-nvme.png)

Na powyższym wyjściu wyraźnie widać:
- Dysk systemowy `/dev/sda` ($25\ \text{GB}$) z partycją główną `/dev/sda2` zamontowaną w korzeniu `/`.
- Drugi, nowy dysk SATA `/dev/sdb` ($25\ \text{GB}$) - obecnie czysty i bez partycji.
- Dodatkowy dysk NVMe `/dev/nvme0n1` ($5\ \text{GB}$) - również bez założonej tablicy partycji.

Aby wyświetlić szczegółowe informacje o tablicach partycji oraz wykryć dyski bez nagłówka, uruchom program `parted` z flagą `-l` (wymaga uprawnień administratora `sudo`):

```bash
sudo parted -l
```

![Wynik wykonania polecenia sudo parted -l z informacją o braku etykiety dysku](/public/courses/ubuntu-26/Images/parted-l.png)

Zauważ, że dla dysków `/dev/sdb` oraz `/dev/nvme0n1` program zgłasza komunikat:
`Error: /dev/sdb: unrecognised disk label` oraz `Partition Table: unknown`. Informuje to administratora, że dysk nie posiada jeszcze utworzonej tablicy partycji (jest fabrycznie czysty).

---

## 🛠️ Partycjonowanie dysku za pomocą parted

Narzędzie **`parted`** (*partition editor*) to nowoczesny i potężny program CLI do zarządzania tablicami partycji i rozmiarem woluminów. Działa zarówno w trybie pojedynczych wydanych komend, jak i w interaktywnej powłoce.

Przeprowadzimy proces podziału nowego dysku `/dev/sdb` na **dwie równe partycje** po $50\%$ pojemności dysku z nowoczesną tablicą partycji **GPT** (*GUID Partition Table*).

### 1. Uruchomienie programu dla wybranego dysku

```bash
sudo parted /dev/sdb
```
*Prompt terminala zmieni się na `(parted)`, co oznacza przejście do interaktywnej konsoli programu.*

### 2. Utworzenie tablicy partycji (GPT vs MBR)

Do utworzenia etykiety i tablicy partycji na dysku służy polecenie `mklabel`. Program `parted` obsługuje dwa główne standardy tablic partycji:

- **`mklabel gpt`** - tworzy nowoczesną tablicę **GPT** (*GUID Partition Table*). Jest to obowiązujący standard wspierający dyski o pojemności powyżej $2\ \text{TB}$ oraz pozwalający na utworzenie domyślnie do $128$ partycji podstawowych. Wymagany dla nowoczesnych systemów uruchamianych w trybie UEFI.
- **`mklabel msdos`** - tworzy tradycyjną tablicę **MBR** (*Master Boot Record*, określaną w `parted` jako `msdos`). Klasyczny standard stosowany na starszych komputerach z systemem BIOS. Posiada ograniczenie: obsługuje dyski maksymalnie do $2\ \text{TB}$ oraz pozwala na utworzenie najwyżej $4$ partycji podstawowych (lub $3$ podstawowych i $1$ rozszerzonej).

W naszym przykładzie tworzymy nowoczesną tablicę partycji **GPT**:

```text
(parted) mklabel gpt
```

> [!CAUTION]
> Polecenie `mklabel` natychmiast zapisuje nowy nagłówek na dysku, niszcząc dotychczasową tablicę partycji oraz odnośniki do znajdujących się tam danych!

### 3. Utworzenie dwóch partycji

Tworzymy *pierwszą* partycję podstawową zajmującą pierwsze $50\%$ powierzchni dysku:
```text
(parted) mkpart primary ext4 0% 50%
```

Tworzymy *drugą* partycję podstawową zajmującą pozostałe $50\%$ powierzchni dysku:
```text
(parted) mkpart primary ext4 50% 100%
```

### 4. Weryfikacja i wyjście z programu

Sprawdzamy układ partycji poleceniem `print`:
```text
(parted) print
```

Wychodzimy z programu klawiszem lub poleceniem `quit`:
```text
(parted) quit
```

![Tworzenie dwóch partycji na dysku sdb w interaktywnym programie parted](/public/courses/ubuntu-26/Images/parted-2-partition-on-disk-sdb.png)

Po wyjściu z `parted` system wyświetla informację: `Information: You may need to update /etc/fstab.` W tym momencie w plikach urządzeń pojawiły się dwie nowe partycje: `/dev/sdb1` oraz `/dev/sdb2`.

---

## 🎛️ Formatowanie partycji (System plików Ext4)

Samo utworzenie struktury partycji nie pozwala jeszcze na zapisywanie plików. Każda nowa partycja musi zostać sformatowana, czyli wyposażona w system plików. Standardowym systemem plików w dystrybucjach Linux jest **Ext4**.

Formatujemy obie partycje poleceniem `mkfs.ext4`, podając jako argument ścieżkę do partycji (np. `/dev/sdb1` i `/dev/sdb2`), a nie całego dysku:

```bash
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.ext4 /dev/sdb2
```

![Formatowanie partycji sdb1 i sdb2 za pomocą mkfs.ext4 i podgląd w aplikacji Disks](/public/courses/ubuntu-26/Images/mkfs-i-podgląd-partycji-na-dysku-w-programi-disks.png)

W dolnej części powyższego zrzutu widać graficzną aplikację **Disks** (*Dyski*), która potwierdza, że dysk `/dev/sdb` posiada dwie partycje typu `Linux Filesystem` o rozmiarze 13 GB każda z utworzonym systemem plików Ext4.

---

## 🔌 Montowanie tymczasowe (<code>mount</code>) oraz podgląd w GUI

W środowisku graficznym Ubuntu Desktop kliknięcie ikonki dysku w menedżerze plików lub w aplikacji *Disks* powoduje jego automatyczne zamontowanie przez usługę `udisks2` w katalogu użytkownika: `/run/media/użytkownik/UUID/`.

![Sprawdzenie automatycznego montowania w run media i odmontowanie w konsoli oraz GUI](/public/courses/ubuntu-26/Images/sprawdzenie-katalogu-run-media-egzamin-gdzie-zamontował-się-dysk-i-go-odmontowanie+pokazanie-że-graficznie-też-się-odmontował.png)

Ręczne odmontowanie woluminu wykonuje się poleceniem `umount`:

```bash
umount /run/media/egzamin/8f73a89b-f317-45b9-a36c-e107d02b1af8
```

Po wykonaniu tego polecenia w aplikacji *Disks* status partycji zmienia się na *Not Mounted* (brak zamontowania), a przycisk odtwarzania ▶ zmienia się z kwadratu wymontowania.

### Ręczne montowanie w katalogu systemowym <code>/mnt/dane</code>

Na serwerach oraz w stabilnych środowiskach produkcyjnych partycje montuje się w stałych punktach montowania, np. w katalogu `/mnt/dane`.

1. Utwórz nowy katalog dedykowany dla punktu montowania:
   ```bash
   sudo mkdir /mnt/dane
   ```

2. Zamontuj partycję `/dev/sdb1` we wskazanym folderze:
   ```bash
   sudo mount /dev/sdb1 /mnt/dane
   ```

3. Sprawdź dostępność i zajętość zamontowanego dysku poleceniem `df -h`:
   ```bash
   df -h
   ```

![Zamontowanie partycji sdb1 w katalogu mnt dane i weryfikacja za pomocą df -h oraz Disks](/public/courses/ubuntu-26/Images/zamontowanie-partycji-sb1-w-mnt-dane-i-pokazanie-że-tylko-jedna-partycja-jest-zaqmontowana.png)

Od tej chwili pliki zapisywane w katalogu `/mnt/dane` fizycznie trafiają na pierwszą partycję drugiego dysku. Zauważ w aplikacji *Disks*, że tylko partycja 1 jest zamontowana w `/mnt/dane`, podczas gdy partycja 2 pozostaje niezamontowana.

---

## 💾 Automatyczne montowanie przy starcie: <code>/etc/fstab</code>

Tymczasowe montowanie poleceniem `mount` wygasa po ponownym uruchomieniu komputera. Aby partycja montowała się automatycznie podczas startu systemu, należy dodać odpowiedni wpis w pliku konfiguracyjnym **`/etc/fstab`** (*File System Table*).

### 1. Pobranie unikalnego identyfikatora UUID (Spritny trick z poleceniem <code>tee</code>)

Zamiast nazwy urządzenia `/dev/sdb1` (która może ulec zmianie po podłączeniu nowych dysków), w pliku `fstab` zawsze stosujemy unikalny identyfikator **UUID** partycji.

Aby uniknąć ręcznego przepisywania skomplikowanego ciągu UUID z polecenia `blkid`, stosujemy sprytne przekierowanie strumienia za pomocą narzędzia **`tee`**:

```bash
sudo blkid /dev/sdb1 | sudo tee -a /etc/fstab
```

#### 💡 Dlaczego używamy <code>tee</code> zamiast zwykłego <code>>></code>?

- **Czym jest polecenie `tee`?**  
  Narzędzie `tee` przyjmuje strumień tekstowy ze standardowego wejścia, wyświetla go na ekranie terminala i jednocześnie zapisuje go do wskazanego pliku (działa analogicznie do trójnika w instalacji hydraulicznej).
- **Flaga `-a` (`--append`)**:  
  Nakazuje poleceniu `tee` **dopisywanie** nowych danych na samym końcu wskazanego pliku zamiast jego czyszczenia i nadpisywania.
- **Problem uprawnień przy przekierowaniu `>>`**:  
  Gdy wykonasz polecenie `sudo blkid /dev/sdb1 >> /etc/fstab`, z uprawnieniami administratora uruchomi się wyłącznie komenda `blkid`. Przekierowanie `>>` jest interpretowane przez Twoją bieżącą powłokę użytkownika, co zakończy się błędem odmowy dostępu: `bash: /etc/fstab: Permission denied`.
- **Rozwiązanie z `sudo tee -a`**:  
  Zastosowanie operatora potoku `|` i przekazanie wyjścia do `sudo tee -a /etc/fstab` sprawia, że samo zapisywanie do pliku wykonuje się z pełnymi uprawnieniami `sudo`. Wyjście z `blkid` zostanie z łatwością dopisane na samym końcu chronionego pliku `/etc/fstab`!

![Przechwycenie identyfikatora UUID za pomocą blkid i tee -a do pliku fstab](/public/courses/ubuntu-26/Images/sprytne-dopisanie-uuid-do-etc-fstab.png)

### 2. Edycja i struktura pliku <code>/etc/fstab</code>

Otwórz plik `/etc/fstab` w edytorze `nano`:

```bash
sudo nano /etc/fstab
```

Na końcu pliku dopisana wcześniej linia z `blkid` posłuży Ci jako wzorzec. Sformatuj nową linię według ścisłego 6-kolumnowego schematu:

```text
<Urządzenie / UUID> <Punkt montowania> <Typ systemu plików> <Opcje montowania> <Dump> <Pass>
```

Przykładowy poprawny wpis z identyfikatorem UUID:
```bash
UUID=8f73a89b-f317-45b9-a36c-e107d02b1af8 /mnt/dane ext4 defaults 0 2
```

Alternatywny zapis z tradycyjną ścieżką urządzenia:
```bash
/dev/sdb1 /mnt/dane ext4 defaults 0 2
```

#### Szczegółowe znaczenie 6 kolumn w pliku `/etc/fstab`:

| Kolumna | Nazwa                       | Opis i dopuszczalne wartości                                                                                                                                                                                                                                                                                                                           |
| :------ | :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**   | **Urządzenie / UUID**       | Identyfikator partycji (`UUID=...`) lub ścieżka pliku urządzenia (`/dev/sdb1`).                                                                                                                                                                                                                                                                        |
| **2**   | **Punkt montowania**        | Docelowa ścieżka katalogu w drzewie plików (np. `/mnt/dane`).                                                                                                                                                                                                                                                                                          |
| **3**   | **Typ systemu plików**      | Format systemu plików (`ext4`, `xfs`, `vfat`, `ntfs`, `swap`).                                                                                                                                                                                                                                                                                         |
| **4**   | **Opcje montowania**        | Parametry montowania. Wartość `defaults` oznacza zestaw standardowy: `rw`, `suid`, `dev`, `exec`, `auto`, `nouser`, `async`.                                                                                                                                                                                                                           |
| **5**   | **Dump (Kopia)**            | Flaga kopii zapasowej starym narzędziem `dump`: <br>• `0` - wyłączone (zalecane dla wszystkich współczesnych dysków). <br>• `1` - włączone.                                                                                                                                                                                                            |
| **6**   | **Pass (Sprawdzanie fsck)** | Kolejność sprawdzania spójności plików przy starcie systemu przez program `fsck`: <br>• `0` - brak sprawdzania (dla wolumenów sieciowych, swap i partycji pomocniczych). <br>• `1` - najwyższy priorytet (zarejestrowany **wyłącznie dla głównego systemu plików `/`**). <br>• `2` - niższy priorytet (dla wszystkich pozostałych partycji dyskowych). |

![Modyfikacja pliku fstab przeładowanie usług systemd i weryfikacja ikony gwiazdki w aplikacji Disks](/public/courses/ubuntu-26/Images/modyfikacja-UUID-w-fstab-i-przeładowanie-usługi.png)

Po zapisaniu pliku `/etc/fstab` w aplikacji *Disks* przy zamontowanej partycji pojawi się ikonka **gwiazdki ★**, która jednoznacznie potwierdza, że wolumin jest skonfigurowany do automatycznego montowania przy starcie systemu.

---

## ⚠️ Krytyczna procedura bezpieczeństwa (<code>mount -a</code> oraz <code>daemon-reload</code>)

> [!CAUTION]
> **Nigdy nie restartuj komputera bez wcześniejszej weryfikacji pliku fstab!**
> 
> Błąd składniowy w pliku `/etc/fstab` (np. literówka w UUID, nieistniejący katalog montowania lub błędna opcja) spowoduje, że system podczas uruchamiania utknie i przejdzie w tryb awaryjny (**Emergency Mode**). Uniemożliwi to normalny start systemu do momentu ręcznej naprawy pliku w konsoli roota!

Aby bezpiecznie zweryfikować poprawność nowej konfiguracji przed uruchomieniem ponownym, wykonaj dwie komendy:

### 1. Przeładowanie generatorów systemd

Współczesne dystrybucje Linux (Ubuntu, Debian) wykorzystują pakiet `systemd` do automatycznego generowania jednostek montowania z pliku `/etc/fstab`. Po każdej edycji `/etc/fstab` przeładuj menedżer systemd:

```bash
sudo systemctl daemon-reload
```

### 2. Weryfikacyjny test montowania (`mount -a`)

Najpierw odmontuj partycję, jeśli jest zamontowana:
```bash
sudo umount /mnt/dane
```

Następnie nakaż systemowi zamontować wszystkie systemy plików zdefiniowane w `/etc/fstab`:
```bash
sudo mount -a
```

Jeśli komenda `sudo mount -a` wykona się **całkowicie bez komunikatów o błędach**, Twój wpis w pliku `/etc/fstab` jest w $100\%$ poprawny i bez obaw możesz zrestartować komputer!

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Bezpośredni odczyt sektorów GPT w C przez open(O_DIRECT) i wywołanie ioctl(BLKGETSIZE64)</span><span class="deep-dive-badge">Block I/O & GPT Internals</span></summary>

Dla zwykłego administratora partycjonowanie to komenda `mkpart primary ext4`. Dla inżyniera systemowego jest to zapis ściśle określonych struktur binarnych w pierwszych sektorach LBA nośnika blokowego.

### 1. Dysk jako urządzenie blokowe w `/dev/`
W Linuksie plik `/dev/sdb` nie jest zwykłym plikiem. Jest to plik specjalny urządzenia blokowego (*Block Device Special File* oznaczony literą `b` w `ls -l`), reprezentowany przez parę liczb: *Major Number* (identyfikator sterownika jądra) i *Minor Number* (identyfikator konkretnego nośnika lub partycji).

### 2. Bezpośredni odczyt sektora LBA 1 (Nagłówek GPT) w języku C
Normalne wywołanie `read()` czyta dane przez bufor podręczny jądra (*Page Cache*). Aby odczytać rzeczywiste, surowe sektory z dysku z pominięciem buforowania, używamy flagi **`O_DIRECT`**:

```c
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/fs.h>
#include <stdint.h>

// Uproszczona struktura nagłówka GPT (sektor LBA 1, 92 bajty)
struct __attribute__((__packed__)) gpt_header {
    char     signature[8];    // "EFI PART" (0x5452415020494645)
    uint32_t revision;
    uint32_t header_size;     // Zwykle 92 bajty (0x5C)
    uint32_t header_crc32;    // Suma kontrolna CRC-32 nagłówka
    uint32_t reserved;
    uint64_t current_lba;     // Zwykle 1
    uint64_t backup_lba;      // Ostatni sektor dysku (LBA -1)
    uint64_t first_usable_lba;// Zwykle 34
    uint64_t last_usable_lba;
    uint8_t  disk_guid[16];   // Unikalny identyfikator GUID dysku
    uint64_t partition_entries_lba; // Zwykle LBA 2
    uint32_t num_partition_entries; // Domyślnie 128
    uint32_t sizeof_partition_entry;// Domyślnie 128 bajtów
    uint32_t partition_array_crc32; // Suma kontrolna tablicy partycji
};

int main() {
    int fd = open("/dev/sdb", O_RDONLY | O_DIRECT);
    if (fd < 0) { perror("open /dev/sdb"); return 1; }

    // Pobranie rozmiaru dysku w bajtach bezpośrednio z kontrolera
    uint64_t bytes = 0;
    ioctl(fd, BLKGETSIZE64, &bytes);
    printf("Pojemność dysku: %lu GB\n", bytes / (1024 * 1024 * 1024));

    // Flaga O_DIRECT wymaga bufora wyrównanego do rozmiaru sektora (4096B)
    void *buffer = NULL;
    posix_memalign(&buffer, 4096, 4096);

    // Przewiń do LBA 1 (sektor 512B) i odczytaj nagłówek
    lseek(fd, 512, SEEK_SET);
    read(fd, buffer, 4096);

    struct gpt_header *gpt = (struct gpt_header *)buffer;
    printf("Sygnatura GPT: %.8s\n", gpt->signature);
    printf("Current LBA:   %lu\n", gpt->current_lba);
    printf("Backup LBA:    %lu\n", gpt->backup_lba);
    printf("Liczba partycji: %u (po %u bajtów)\n", 
           gpt->num_partition_entries, gpt->sizeof_partition_entry);

    free(buffer);
    close(fd);
    return 0;
}
```

### 3. Weryfikacja integralności: Podwójne sumy kontrolne CRC-32
W przeciwieństwie do archaicznego MBR, standard GPT chroni integralność dysku dwoma wielomianami CRC-32:
1. **`header_crc32`**: Podczas obliczania sumy pole `header_crc32` jest tymczasowo zerowane. Jeśli choć jeden bit nagłówka w LBA 1 zostanie przekłamany (np. przez błąd pamięci RAM lub awarię zasilania), jądro natychmiast wykrywa niezgodność i automatycznie odtwarza nagłówek z kopii zapasowej zapisanej w sektorze wskazanym przez `backup_lba` (na samym końcu dysku).
2. **`partition_array_crc32`**: Osobna suma kontrolna chroniąca tablicę 128 wpisów partycji (sektory LBA 2-33).

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Urządzenia jako pliki:** W systemie Linux dyski twarde i SSD to pliki w `/dev/` (np. `/dev/sda`, `/dev/sdb`, `/dev/nvme0n1`).
- **Narzędzie parted:** Służy do tworzenia i modyfikacji tablic partycji. Polecenie `mklabel gpt` tworzy nagłówek GPT, a `mkpart` wydziela partycje (np. `0% 50%` oraz `50% 100%`).
- **Formatowanie mkfs.ext4:** Tworzy system plików Ext4 na wybranej partycji (np. `/dev/sdb1`), umożliwiając zapis danych.
- **Punkt montowania:** Dedykowany katalog (np. `/mnt/dane`), w którym osadzany jest system plików partycji za pomocą polecenia `mount`.
- **Automatyzacja w /etc/fstab:** Trwałe montowanie po restarcie wymaga wpisu w `/etc/fstab` z wykorzystaniem stabilnego identyfikatora `UUID` uzyskanego z `blkid`.
- **Przechwytywanie z tee -a:** Polecenie `sudo blkid /dev/sdb1 | sudo tee -a /etc/fstab` pozwala bezpiecznie dopisać UUID do pliku systemowego bez błędu uprawnień.
- **Weryfikacja mount -a i systemctl daemon-reload:** Obowiązkowa procedura sprawdzająca po edycji `/etc/fstab` chroniąca system przed wejściem w tryb awaryjny Emergency Mode.
