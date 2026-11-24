# Uprawnienia plików i katalogów

Bezpieczeństwo danych w systemie Linux opiera się na **systemie uprawnień**. Każdy plik oraz katalog ma przypisanego właściciela i grupę, a także precyzyjnie zdefiniowane prawa odczytu, zapisu i wykonywania dla różnych kategorii użytkowników.

W tej lekcji dowiesz się, jak poprawnie przypisywać własność zasobów oraz jak zarządzać uprawnieniami dostępu.

## 🧪 Stacja treningowa: konfiguracja uprawnień

W tej stacji treningowej skonfigurujesz uprawnienia dla katalogu `/srv/Projekt`. Nauczysz się nadawać własność użytkownikowi oraz grupie, a także ograniczać dostęp dla nieuprawnionych kont.

Konto `technik` i grupa `audyt` zostały już przygotowane w środowisku laboratoryjnym. Konfiguracja skupia się wyłącznie na zarządzaniu prawami dostępu do katalogu.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m2-02-uprawnienia-katalogu.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela stanowi podręczne zestawienie poleceń powłoki używanych do weryfikacji i modyfikacji uprawnień w systemach Linux.

| Komenda                                     | Opis działania                                                                         | Przykład                           |
| :------------------------------------------ | :------------------------------------------------------------------------------------- | :--------------------------------- |
| `ls -l`                                     | Wyświetla zawartość katalogu w formacie szczegółowym (w tym prawa dostępu i własność). | `ls -l`                            |
| `sudo chown [użytkownik] [ścieżka]`         | Zmienia właściciela wskazanego pliku lub katalogu.                                     | `sudo chown technik Projekt`       |
| `sudo chgrp [grupa] [ścieżka]`              | Zmienia grupę właścicielską wskazanego pliku lub katalogu.                             | `sudo chgrp audyt Projekt`         |
| `sudo chown [użytkownik]:[grupa] [ścieżka]` | Zmienia jednocześnie właściciela oraz grupę właścicielską jednym poleceniem.           | `sudo chown technik:audyt Projekt` |
| `sudo chmod [tryb] [ścieżka]`               | Zmienia prawa dostępu (mode) dla wskazanego zasobu.                                    | `sudo chmod 750 Projekt`           |
| `su - [użytkownik]`                         | Uruchamia nową sesję powłoki z prawami i środowiskiem wskazanego konta.                | `su - technik`                     |
| `exit`                                      | Kończy bieżącą sesję powłoki i powraca do poprzedniej tożsamości.                      | `exit`                             |

## 👤 Reprezentacja uprawnień w listingu <code>ls -l</code>

Polecenie `ls -l` wyświetla szczegółowe metadane każdego zasobu w jednej linii. Przykład reprezentacji dla katalogu:

```bash
drwxr-x--- 2 technik audyt 4096 1999-05-30 21:37 Projekt
```

Każdy znak w sekwencji uprawnień ma ściśle określone znaczenie:

| Zapis pola            | Znaczenie i przynależność                                                |
| :-------------------- | :----------------------------------------------------------------------- |
| `d`                   | Typ zasobu (litera `d` oznacza katalog, myślnik `-` to zwykły plik).     |
| `rwx` (pierwsze trzy) | Prawa **właściciela** konta (odczyt, zapis, wykonanie).                  |
| `r-x` (środkowe trzy) | Prawa **grupy właścicielskiej** (odczyt, brak zapisu, wykonanie).        |
| `---` (ostatnie trzy) | Prawa **pozostałych użytkowników** w systemie (brak jakichkolwiek praw). |
| `technik`             | Właściciel zasobu.                                                       |
| `audyt`               | Grupa właścicielska zasobu.                                              |
| `Projekt`             | Nazwa katalogu lub pliku.                                                |

Proces weryfikacji bezpieczeństwa należy zawsze rozpoczynać od sprawdzenia **właściciela i grupy**. Zmiana samych uprawnień za pomocą `chmod` nie przyniesie pożądanego efektu, jeśli plik lub katalog należy do niewłaściwego podmiotu.

## 🔢 Tryb numeryczny (ósemkowy)

W zapisie numerycznym uprawnień (zwanym notacją ósemkową) prawa reprezentowane są przez trzy cyfry. Każda cyfra określa poziom dostępu dla innej klasy użytkowników:

```text
750
││└─ pozostali (others)
│└── grupa właścicielska (group)
└─── właściciel (owner)
```

Wartości poszczególnych uprawnień sumuje się dla każdej klasy z osobna:

| Prawo           | Wartość | Działanie w odniesieniu do katalogu                                                       |
| :-------------- | :------ | :---------------------------------------------------------------------------------------- |
| `r` (*read*)    | `4`     | Zezwala na wyświetlenie listy plików wewnątrz katalogu.                                   |
| `w` (*write*)   | `2`     | Zezwala na tworzenie, usuwanie oraz modyfikację wpisów w katalogu.                        |
| `x` (*execute*) | `1`     | Zezwala na wejście do katalogu (przejście przez niego) w celu wykonania dalszych poleceń. |

Na podstawie tej kalkulacji tryb `750` oznacza:

| Klasa dostępu | Cyfra ósemkowa | Składniki sumy  | Wynikowy tryb tekstowy                |
| :------------ | :------------- | :-------------- | :------------------------------------ |
| Właściciel    | `7`            | `4` + `2` + `1` | `rwx` (pełny dostęp)                  |
| Grupa         | `5`            | `4` + `0` + `1` | `r-x` (odczyt i wejście, brak zapisu) |
| Pozostali     | `0`            | `0` + `0` + `0` | `---` (brak jakichkolwiek praw)       |

W przypadku katalogów uprawnienie `x` ma **kluczowe znaczenie**. Bez prawa wykonywania nie jest możliwe wejście do katalogu, nawet jeśli klasa użytkowników ma teoretycznie przypisane prawo odczytu `r`.

<data-posix-acl-matrix octal="0750" file-type="d"></data-posix-acl-matrix>


## 🧪 Sandbox: model uprawnień rwx

Poniższy model pozwala na bezpieczną, interaktywną wizualizację i testowanie zachowania uprawnień w bezpiecznym środowisku symulacyjnym.

<data-gate>
<data-permission-lab src="/public/courses/ubuntu-26/Scenarios/permissions/model-rwx-zadanie.md"></data-permission-lab>
</data-gate>

## 🚀 Misja: zabezpieczenie katalogu projektu

W tej misji otrzymujesz inny katalog roboczy w systemie plików. Twoim zadaniem jest poprawne ustawienie właściciela konta, przydzielenie grupy właścicielskiej oraz skonfigurowanie praw dostępu w trybie ósemkowym, a następnie przeprowadzenie końcowego audytu za pomocą polecenia `ls -l`.

To standardowa praca administracyjna: modyfikujesz stan systemu, weryfikujesz uprawnienia i testujesz dostęp z właściwego konta.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m2-02-katalog-projektu.md"></data-terminal-mission>
</data-gate>

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Maska Umask w Algebrze Boole'a i algorytm weryfikacji DAC w jądrze Linuksa</span><span class="deep-dive-badge">Boolean Logic & VFS DAC</span></summary>

Uprawnienia plików w Linuksie to bezpośrednie zastosowanie algebry Boole'a i operacji na maskach bitowych, które poznaliśmy w kursie Binarne Fundamenty IT.

### 1. Maska bitowa `st_mode` w strukturze `struct stat`
W strukturze `inode` uprawnienia są zapisane w 16-bitowej liczbie całkowitej `mode_t st_mode`:
- Bity 15-12: Typ pliku (zwykły plik `0100000_2`, katalog `0040000_2`, link symboliczny `0120000_2`)
- Bity 11-9: Bity specjalne (SUID = `4000_8`, SGID = `2000_8`, Sticky = `1000_8`)
- Bity 8-6: Uprawnienia właściciela (`rwx` = $4 + 2 + 1 = 7$)
- Bity 5-3: Uprawnienia grupy (`r-x` = $4 + 0 + 1 = 5$)
- Bity 2-0: Uprawnienia pozostałych (`---` = $0 + 0 + 0 = 0$)

### 2. Matematyka maski `umask`: Operacja `AND NOT`
Domyślnie program tworzący plik wnioskuje o uprawnienia bazowe $0666_8$ (odczyt i zapis dla każdego), a tworzący katalog o $0777_8$ (pełny dostęp). 
Dlaczego nowo utworzony plik ma uprawnienia `-rw-r--r--` ($0644_8$)?

Odpowiada za to maska procesu `umask` (domyślnie w Ubuntu `0022_8`). Jądro Linuksa wylicza finalny tryb operacją bitową:
$$\text{Tryb finalny} = \text{Tryb bazowy} \ \& \ (\sim\text{umask})$$

Rozpiszmy to binarnie dla pliku przy umask $0022_8$:
- Tryb bazowy: $0666_8 = 110\ 110\ 110_2$
- Maska umask: $0022_8 = 000\ 010\ 010_2$
- Negacja bitowa $\sim\text{umask}$: $111\ 101\ 101_2$
- Iloczyn bitowy `AND`:
  $$\begin{array}{r@{\quad}l}
    110\ 110\ 110_2 & (0666_8) \\
  \&\ 111\ 101\ 101_2 & (\sim 0022_8) \\
  \hline
    110\ 100\ 100_2 & (0644_8 = \text{rw-r--r--})
  \end{array}$$

Maska `umask` nie „odejmuje” liczb jak w arytmetyce dziesiętnej. Jest to **filtr maskujący**, który zeruje wskazane bity uprawnień.

### 3. Algorytm sprawdzania uprawnień w VFS (`generic_permission`)
Gdy proces o tożsamości `fsuid` i grupach `fsgid` próbuje otworzyć plik, jądro wykonuje algorytm dyskrecjonalnej kontroli dostępu (*DAC - Discretionary Access Control*):

```c
int generic_permission(struct user_namespace *mnt_userns, struct inode *inode, int mask) {
    // KROK 1: Czy proces jest właścicielem pliku?
    if (current_fsuid() == inode->i_uid) {
        if ((inode->i_mode & mask) == mask) return 0; // Dostęp przyznany
        return -EACCES; // Odmowa dostępu! Sprawdzanie NATYCHMIAST się kończy.
    }

    // KROK 2: Czy proces należy do grupy pliku lub grup uzupełniających?
    if (in_group_p(inode->i_gid)) {
        if (((inode->i_mode >> 3) & mask) == mask) return 0;
        return -EACCES; // Odmowa dostępu!
    }

    // KROK 3: Sprawdzenie praw pozostałych (others)
    if (((inode->i_mode >> 6) & mask) == mask) return 0;
    return -EACCES;
}
```

**Kluczowy wniosek inżynierski**: Jeśli plik ma uprawnienia `077` (brak praw dla właściciela, pełne prawa dla grupy i others), a próbujesz go odczytać jako **właściciel**, jądro wykona KROK 1 i **zablokuje dostęp z błędem Permission Denied**. Jądro nigdy nie przejdzie do sprawdzania grupy ani others!

<data-posix-umask-dac umask="022" file-type="-"></data-posix-umask-dac>

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Narzędzie `ls -l` służy do szczegółowego **audytu stanu własności** oraz przypisanych praw dostępu do zasobów.
- Polecenie `chown` służy do zmiany właściciela, `chgrp` do zmiany grupy, natomiast `chmod` modyfikuje uprawnienia dostępu (tryb).
- Uprawnienia ósemkowe (np. `750`) określają sumaryczne prawa odpowiednio dla właściciela (`rwx`), grupy (`r-x`) oraz pozostałych użytkowników (`---`).
- W przypadku katalogów prawo wykonywania (`x`) ma **kluczowe znaczenie**, ponieważ warunkuje ono możliwość wejścia do folderu oraz przechodzenia przez jego ścieżkę.
- Polecenie `su -` pozwala na uruchomienie sesji jako inny użytkownik, co umożliwia praktyczne przetestowanie i weryfikację uprawnień dostępu.
- Każdą zmianę własności lub praw dostępu należy sprawdzić na końcu poprzez **audyt spójności**, zamiast ufać wyłącznie poprawnemu wykonaniu komendy.
