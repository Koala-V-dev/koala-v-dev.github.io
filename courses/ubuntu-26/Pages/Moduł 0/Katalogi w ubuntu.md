# Katalogi w Ubuntu

W Windows myślisz dyskami: `C:`, `D:`, pendrive jako kolejna litera.

W Ubuntu zaczynasz od jednego drzewa katalogów. Początek tego drzewa to `/`, czyli **root**. Nie myl tego z użytkownikiem `root`. Tutaj chodzi o korzeń systemu plików.

```text
/
```

Dysk, partycja, pendrive i konfiguracja systemu to pliki umieszczone w katalogach podpiętych pod jedno drzewo.   
Ponieważ w Linuksie wszystko jest plikiem! 

## 🧭 Katalog domowy

Po otwarciu aplikacji **Files** trafiasz zwykle do katalogu domowego użytkownika.

![Ubuntu Files strona główna home](/public/courses/ubuntu-26/Images/ubuntu-files-strona-główna-home.png)

Dla użytkownika `egzamin` pełna ścieżka wygląda tak:

```text
/home/egzamin/
```

To jest twoja przestrzeń robocza. Tu trafiają dokumenty, pobrane pliki, pulpit, obrazy i większość konfiguracji użytkownika.

Aby dostać się do korzenia systemu `/` z poziomu menedżera plików kliknij w pasek lokalizacji i zmień jego zawartość.

![Ubuntu Files jak się dostać do Root](/public/courses/ubuntu-26/Images/ubuntu-files-jak-się-dostać-do-root.png)

Teraz możesz zobaczyć graficznie najważniejsze katalogi w Ubuntu i plik wymiany `swap.img`.

![Ubuntu Files katalog root](/public/courses/ubuntu-26/Images/files-katalog-root-ubuntu.png)

## 🗺️ Kilka katalogów, które trzeba kojarzyć

Nie ucz się całej struktury katalogów jak słowniczka. Na początku wystarczy kilka miejsc:

| Katalog    | Po co istnieje                                                 |
| ---------- | -------------------------------------------------------------- |
| `/home`    | katalogi użytkowników, ich pliki i konfiguracja                |
| `/etc`     | konfiguracja systemu i usług                                   |
| `/var/log` | logi, czyli ślady działania systemu                            |
| `/media`   | nośniki montowane automatycznie, na przykład pendrive          |
| `/mnt`     | miejsce do ręcznego montowania w ćwiczeniach administracyjnych |
| `/`        | korzeń całego drzewa                                           |

To wystarczy, żeby nie błądzić po systemie jak po cudzym magazynie.

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: VFS (Virtual Filesystem) i struktury inode oraz dentry w kodzie jądra</span><span class="deep-dive-badge">Linux Kernel VFS</span></summary>

Dlaczego Linux potrafi w jednym wspólnym drzewie katalogów montować jednocześnie partycję Ext4, pamięć flash FAT32, wirtualny system procesów `/proc` oraz zdalny udział sieciowy NFS? Odpowiada za to **Wirtualny System Plików** (*VFS - Virtual Filesystem*).

VFS to zorientowana obiektowo warstwa abstrakcji wewnątrz jądra Linuksa (napisana w czystym języku C z wykorzystaniem struktur i wskaźników na funkcje).

### 1. Cztery filary architektury VFS
Dla każdego zamontowanego systemu plików jądro operuje na 4 kluczowych strukturach danych:
1. **`struct super_block`**: Reprezentuje cały zamontowany system plików (metadane nośnika, rozmiar bloku alokacji, wskaźnik do korzenia).
2. **`struct inode`**: Reprezentuje konkretny fizyczny plik lub katalog na dysku. Zawiera uprawnienia, identyfikatory właściciela (UID/GID), rozmiar pliku w bajtach, znaczniki czasu oraz wskaźniki do bloków danych na dysku. Inode **nie zawiera nazwy pliku**!
3. **`struct dentry`** (*Directory Entry*): Wiąże ludzką nazwę pliku (np. `komendy.txt`) z odpowiadającym jej numerem inodu. Pamięć podręczna dentry (*dcache*) tworzy w pamięci RAM całe drzewo ścieżek, dzięki czemu przeszukiwanie katalogów nie wymaga odpytywania wolnego nośnika dyskowego.
4. **`struct file`**: Reprezentuje plik otwarty przez działający proces w pamięci (przechowuje aktualny offset odczytu `f_pos`, flagi otwarcia `O_RDONLY` oraz wskaźnik na inod).

```
   Przestrzeń użytkownika:  open("/home/user/dane.txt", O_RDONLY)
                                        │
   ═════════════════════════════════════╪═══════════════════════════════
   Jądro Linuksa (VFS):                 ▼
                             Wyszukanie w dcache:
                           "/" ──> "home" ──> "user" ──> "dane.txt"
                                                           │
                                             Wskaźnik dentry->d_inode
                                                           │
                                                           ▼
                                                struct inode (Ext4)
                                                - UID: 1000, GID: 1000
                                                - st_mode: 0644
                                                - Tablica extentów bloków
```

### 2. Polimorfizm w C: Tablice operacji `file_operations`
Każda struktura w VFS posiada pole wskazujące na tablicę wskaźników do funkcji implementujących konkretne zachowania dla danego nośnika:

```c
struct file_operations {
    ssize_t (*read) (struct file *, char __user *, size_t, loff_t *);
    ssize_t (*write) (struct file *, const char __user *, size_t, loff_t *);
    int (*open) (struct inode *, struct file *);
    int (*fsync) (struct file *, loff_t, loff_t, int datasync);
};
```

Gdy użytkownik wywołuje `read(fd, buf, 1024)`, jądro nie sprawdza warunkami `if/else`, jaki to system plików. Po prostu wywołuje polimorficznie:
`file->f_op->read(file, buf, 1024, &file->f_pos);`
Jeśli plik leży na Ext4, uruchamia się funkcja `ext4_file_read_iter()`. Jeśli w `/proc/cpuinfo`, wywoływana jest funkcja generująca tekst z pamięci RAM w locie.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Ubuntu używa jednego drzewa katalogów zaczynającego się od `/`.
- `/home/[użytkownik]` to twoje pliki i konfiguracja użytkownika.
- `/etc` to konfiguracja systemowa.
- `/var/log` to miejsce, gdzie szukasz śladów działania systemu.
- Wszystkie zasoby i systemy plików są spójnie integrowane pod wspólnym korzeniem dzięki jądrowej warstwie VFS.
