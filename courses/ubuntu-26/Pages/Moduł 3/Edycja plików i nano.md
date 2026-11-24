# Edycja plików w terminalu - nano

W pracy administratora systemów Linux bardzo rzadko będziesz mieć dostęp do graficznego edytora tekstu. Gdy konfigurujesz serwer przez sieć (na przykład za pomocą protokołu SSH), Twoim jedynym oknem na świat jest tekstowa konsola. Dlatego umiejętność sprawnej edycji plików konfiguracyjnych bezpośrednio w terminalu jest jedną z najważniejszych umiejętności praktycznych.

W systemie Ubuntu najpopularniejszym, najprostszym i domyślnie zainstalowanym edytorem konsolowym jest **nano**.

---

## 🛠️ Uruchomienie edytora

Aby otworzyć lub utworzyć nowy plik, wystarczy podać nazwę pliku jako argument do polecenia `nano`:

```bash
nano moj_plik.txt
```

Jeśli plik istnieje, zostanie otwarty do edycji. Jeśli nie istnieje, `nano` utworzy w pamięci pusty bufor, który zostanie zapisany pod podaną nazwą dopiero przy zapisie.

> [!WARNING]
> **Brak uprawnień przy edycji plików systemowych**
> 
> Pliki konfiguracyjne systemu (np. w katalogu `/etc/`) należą do użytkownika `root`. Jeśli otworzysz plik systemowy komendą `nano /etc/hosts` jako zwykły użytkownik, edytor pozwoli Ci pisać i wyświetli komunikat `[ File 'etc/hosts' is unwritable]`, ale przy próbie zapisu pokaże czerwony komunikat błędu: 
> **_[Error writnig /etc/hosts: Permission denied]_** (Brak dostępu do uprawnienia zapisu).
> 
> ![Brak uprawnień przy edycji plików systemowych](/public/courses/ubuntu-26/Images/nano-not-writing.png)
> 
> Aby edytować pliki systemowe, zawsze musisz podnieść uprawnienia za pomocą `sudo`:
> 
> ```bash
> sudo nano /etc/hosts
> ```

---

## 🧭 Nawigacja i pisanie

Po uruchomieniu edytora zobaczysz prosty interfejs:
1. **Górny pasek:** wersja programu nano oraz nazwa edytowanego pliku.
2. **Środek (główny obszar):** miejsce, w którym po prostu wpisujesz tekst za pomocą klawiatury.
3. **Dolny pasek (podpowiedzi):** ściągawka z najważniejszymi skrótami klawiszowymi.

> [!NOTE]
> **Zapomnij o myszce**  
> Inne graficzne edytory pozwalają klikać myszką w dowolnym miejscu. W klasycznych edytorach terminalowych myszka domyślnie nie działa do przesuwania kursora w tekście. Musisz poruszać się wyłącznie strzałkami na klawiaturze. Klawisze <kbd>Page Up</kbd> oraz <kbd>Page Down</kbd> przewijają cały ekran, a <kbd>Home</kbd> i <kbd>End</kbd> przenoszą na początek i koniec linii.

---

## ⌨️ Ściągawka z najważniejszych skrótów

Znak daszka `^` w dolnym pasku podpowiedzi oznacza klawisz **Control** (<kbd>Ctrl</kbd>). Przykładowo, skrót `^O` oznacza kombinację klawiszy <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span>.  
Natomiast skróty oznaczone prefiksem `M-` oznaczają klawisz **Meta** (<kbd>Alt</kbd>). Przykładowo, skrót `M-A` służy do zaznaczania.

### Pozycja, zapis i wyjście

|                                  Skrót                                   | Działanie w nano        | Opis praktyczny                                                                               |
| :----------------------------------------------------------------------: | :---------------------- | :-------------------------------------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span> | **Cur Pos** (*Pozycja*) | Wyświetla w dolnej linii precyzyjną informację o bieżącej linii i kolumnie kursora.           |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span> | **WriteOut** (*Zapisz*) | Zapisuje zmiany w pliku bez wychodzenia z edytora. System zapyta o potwierdzenie nazwy pliku. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> | **Exit** (*Wyjście*)    | Zamyka edytor nano. Jeśli dokonałeś zmian, system zapyta, czy chcesz je zapisać.              |

### Tekst: kopiowanie i wklejanie

|                                  Skrót                                   | Działanie w nano               | Opis praktyczny                                                                          |
| :----------------------------------------------------------------------: | :----------------------------- | :--------------------------------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> | **Read File** (*Wczytaj plik*) | Wkleja zawartość innego pliku w miejscu, w którym aktualnie stoi Twój kursor.            |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>K</kbd></span> | **Cut** (*Wytnij*)             | Wytnie całą linijkę tekstu, na której stoi kursor, zapisując ją do podręcznego bufora.   |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>U</kbd></span> | **Uncut** (*Wklej*)            | Wkleja linijkę z bufora w miejscu kursora. Możesz jej użyć jako prostego "kopiuj-wklej". |

> [!TIP]
> **Bezpieczne wyjście z edytora**  
> Gdy naciśniesz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> po zmodyfikowaniu pliku, na dole pojawi się pytanie:  
> `Save modified buffer?`  
> - Naciśnij <kbd>Y</kbd> (Yes), aby zatwierdzić zapis. Edytor zapyta o nazwę pliku (możesz ją zmienić lub po prostu kliknąć <kbd>Enter</kbd>, aby nadpisać).  
> - Naciśnij <kbd>N</kbd> (No), aby wyjść bez zapisywania wprowadzonych zmian.  
> - Naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span>, aby anulować wyjście i wrócić do pisania.
> <hr>
> Wielu administratorów zaczyna od nano, bo w przeciwieństwie do vima, nie trzeba czytać instrukcji obsługi, żeby z niego wyjść bez restartu terminala! 😅

---

## 🔍 Wyszukiwanie tekstu (<code>Ctrl + W</code>)

Konfiguracyjne pliki systemowe potrafią mieć setki linii kodu. Szukanie konkretnej linii wzrokiem jest nieefektywne. 
1. Naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>W</kbd></span>.
2. Wpisz szukaną frazę (np. `PORT`).
3. Naciśnij <kbd>Enter</kbd>. Kursor przeskoczy do pierwszego wystąpienia.
4. Aby wyszukać kolejne wystąpienie tego samego słowa, ponownie naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>W</kbd></span> i bez wpisywania tekstu po prostu zatwierdź klawiszem <kbd>Enter</kbd>.

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Buforowanie I/O w libc (FILE* vs int fd), blokady plików (flock/fcntl) i zrzut buforów fsync()</span><span class="deep-dive-badge">System I/O & File Locking</span></summary>

Gdy edytor tekstu (taki jak `nano` czy `vim`) modyfikuje plik na dysku, wewnątrz systemu operacyjnego zachodzi seria operacji związanych z buforowaniem pamięci i synchronizacją nośnika.

### 1. Dwa poziomy buforowania danych
Gdy program w C zapisuje tekst do pliku, dane nie trafiają natychmiast na dysk SSD:
1. **Bufor biblioteki `libc` (Przestrzeń użytkownika)**:
   Funkcje wysokopoziomowe takie jak `fprintf()` lub `fputs()` operują na strumieniu `FILE*`. Dane gromadzone są w buforze pamięci procesu (zwykle 4096 lub 8192 bajty), aby zminimalizować liczbę kosztownych przejść Ring 3 $\to$ Ring 0.
2. **Page Cache w pamięci jądra (Przestrzeń jądra)**:
   Gdy bufor biblioteki zostanie opróżniony funkcją `fflush()`, wywoływane jest wywołanie systemowe `write(fd, buf, count)`. Jądro Linuksa kopiuje dane do stron pamięci RAM zwanych **Page Cache** (oznaczając te strony jako *Dirty Pages* - brudne strony). Fizyczny zapis na dysk wykonuje asynchronicznie w tle proces jądra `kworker / flusher` co określony czas (zwykle co 5 sekund).

```
   Edytor (User Space):  fputs("port=8080", file_ptr)
                                     │
                             Bufor libc (4 KiB)
                                     │ fflush()
                                     ▼
   Jądro Linuksa:            write(fd, buf, len)
                                     │
                             Page Cache (Dirty Pages w RAM)
                                     │
                         ┌───────────┴───────────┐
                         │ fsync()               │ kworker (co 5s)
                         ▼                       ▼
   Fizyczny Dysk:        Fizyczny zapis magnetyczny / komórki Flash
```

### 2. Gwarancja trwałości: Wywołanie `fsync()`
Co się stanie, jeśli komputer straci zasilanie 1 sekundę po naciśnięciu `Ctrl + O` w edytorze?
Jeśli edytor wywołał tylko `close(fd)`, dane wciąż znajdowały się w pamięci RAM i przepadną bezpowrotnie.

Profesjonalne edytory i silniki baz danych (PostgreSQL, SQLite) po zapisaniu pliku konfiguracyjnego wykonują wywołanie systemowe:
```c
fsync(fd);
```
`fsync()` wymusza zablokowanie procesu do momentu, aż kontroler dysku fizycznie potwierdzi zapisanie wszystkich brudnych stron oraz metadanych inodu na nośniku nieulotnym.

### 3. Zapobieganie konfliktom edycji: Blokady `flock` i pliki `.swp`
Jeśli dwóch administratorów otworzy jednocześnie ten sam plik w `nano` lub `vim`:
- `vim` tworzy ukryty plik tymczasowy `.plik.swp` i zakłada blokadę adwokacką (*Advisory Lock*) funkcją systemową:
  ```c
  flock(fd, LOCK_EX | LOCK_NB);
  ```
- Flaga `LOCK_EX` wnioskuje o wyłączną blokadę zapisu (*Exclusive Lock*). Jeśli drugi proces próbuje założyć taką samą blokadę, wywołanie zwraca błąd `EWOULDBLOCK`, a edytor wyświetla ostrzeżenie o jednoczesnej modyfikacji pliku przez innego użytkownika.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Brak GUI na serwerze:** Edycja plików w terminalu jest podstawową umiejętnością admina.
- **Edycja systemowa:** Aby modyfikować pliki konfiguracyjne w `/etc/`, musisz uruchamiać nano z uprawnieniami roota (`sudo nano`).
- **Skrót Ctrl + X:** To główny wyłącznik edytora, który pyta o chęć zapisu zmian (Y/N).
- **Skrót Ctrl + O:** Pozwala na ręczne wymuszenie zapisu pliku (zrzucenie bufora na dysk).
- **Wyszukiwanie Ctrl + W:** Skrót ten (od angielskiego *Where Is*) ratuje życie w długich plikach konfiguracyjnych.
- **Ruch bez myszy:** Używaj wyłącznie strzałek, Home, End, Page Up i Page Down do poruszania się wewnątrz pliku.
