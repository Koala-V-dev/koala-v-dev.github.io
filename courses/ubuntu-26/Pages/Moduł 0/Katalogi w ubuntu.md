# Katalogi w Ubuntu

W Windows myślisz dyskami: `C:`, `D:`, pendrive jako kolejna litera.

W Ubuntu zaczynasz od jednego drzewa katalogów. Początek tego drzewa to `/`, czyli **root**. Nie myl tego z użytkownikiem `root`. Tutaj chodzi o korzeń systemu plików.

```text
/
```

Dysk, partycja, pendrive i konfiguracja systemu to pliki umieszczone w katalogach podpiętych pod jedno drzewo.   
Ponieważ w linuksie wszystko jest plikiem! 

## 🧭 Katalog domowy

Po otwarciu aplikacji **Files** trafiasz zwykle do katalogu domowego użytkownika.

![Ubuntu Files strona główna home](/public/courses/ubuntu-26/Images/ubuntu-files-strona-główna-home.png)

Dla użytkownika `egzamin` pełna ścieżka wygląda tak:

```text
/home/egzamin
```

To jest twoja przestrzeń robocza. Tu trafiają dokumenty, pobrane pliki, pulpit, obrazy i większość konfiguracji użytkownika.

Aby dostać się do korzenia systemu `/` z poziomu menadżera plików kliknij w pasek lokalizacji i zmień jego zawartość.

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

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Ubuntu używa jednego drzewa katalogów zaczynającego się od `/`.
- `/home/[użytkownik]` to twoje pliki i konfiguracja użytkownika.
- `/etc` to konfiguracja systemowa.
- `/var/log` to miejsce, gdzie szukasz śladów działania systemu.
- W następnej lekcji użyjesz terminala, żeby poruszać się po tej strukturze.
