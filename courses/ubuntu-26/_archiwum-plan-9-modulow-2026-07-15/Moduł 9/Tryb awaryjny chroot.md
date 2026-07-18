# Ratowanie systemu i tryb chroot

Gdy system nie chce się uruchomić z powodu uszkodzonego sektora rozruchowego (GRUB) lub administrator zapomni hasła roota i zablokuje swoje konto, jedynym ratunkiem jest wdrożenie procedury ratunkowej z poziomu zewnętrznego nośnika LiveCD i wejście w tryb **chroot (change root)**.

---

## 🧭 Krok po kroku: Wejście do chroota

Procedura ta polega na uruchomieniu komputera z pendrive'a (np. przygotowanego w programie Ventoy), zamontowaniu uszkodzonego systemu plików i "przeniesieniu" powłoki systemowej do wnętrza uszkodzonej instalacji.

### 1. Uruchom system LiveCD i znajdź partycję systemową
Wpisz `lsblk`, aby zidentyfikować partycję z uszkodzonym systemem (np. `/dev/sda2`).

### 2. Zamontuj główny system plików
Montujemy partycję pod tymczasowy punkt montowania w systemie LiveCD (np. `/mnt`):
```bash
sudo mount /dev/sda2 /mnt
```
*Uwaga:* Jeśli masz osobną partycję `/boot` lub EFI, musisz je również podpiąć pod odpowiednie podkatalogi: `sudo mount /dev/sda1 /mnt/boot/efi`.

### 3. Podepnij wirtualne systemy plików jądra
Jest to krytyczny krok. Aby programy w chroocie miały dostęp do sprzętu, sieci i procesów jądra LiveCD, musimy połączyć (bind) wirtualne katalogi:
```bash
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys
sudo mount --bind /run /mnt/run
```

### 4. Wejdź do środowiska chroot
Teraz wykonujemy główne polecenie przeniesienia głównego katalogu:
```bash
sudo chroot /mnt
```
Od tego momentu konsola zachowuje się tak, jakbyś zalogował się bezpośrednio na uszkodzonym systemie. Masz dostęp do lokalnych użytkowników, programów i konfiguracji.

---

## 🛠️ Zastosowanie praktyczne w chroocie

Po wejściu do chroota możesz wykonać kluczowe naprawy:
* **Reset hasła roota:**
  ```bash
  passwd root
  ```
* **Naprawa i reinstalacja bootloadera GRUB:**
  ```bash
  grub-install /dev/sda
  update-grub
  ```

Po zakończeniu prac wyjdź z chroota (`exit`), odmontuj połączone katalogi (`sudo umount -R /mnt`) i uruchom komputer ponownie.

---

## 🛠️ Punkt Kontrolny: Tryb chroot
<data-gate>
  <data-quiz>
    <question>
Dlaczego przed wykonaniem komendy chroot /mnt należy podpiąć wirtualne systemy plików za pomocą mount --bind?
    </question>
    <options>
      <item correct>Aby programy uruchamiane wewnątrz chroota miały dostęp do procesów jądra, informacji o sprzęcie (sys/proc) oraz urządzeń blokowych (dev).</item>
      <item>Aby system LiveCD mógł pobrać aktualizacje pakietów przez internet.</item>
      <item>Jest to krok opcjonalny, wymagany wyłącznie przy reinstalacji serwerów Apache.</item>
    </options>

<div data-hint="error">
  Zastanów się: skąd programy w chroocie (np. `grub-install`) mają wiedzieć, jakie fizyczne dyski znajdują się w komputerze, skoro nie widzą katalogu `/dev`?
</div>
<div data-hint="success">
  Genialne! Powiązanie `/dev`, `/sys` i `/proc` dostarcza usłudze chroot wglądu w stan rzeczywistego sprzętu obsługiwanego przez jądro LiveCD.
</div>
  </data-quiz>
</data-gate>
