# Użytkownicy i sudo

Bezpieczeństwo w systemie Linux opiera się na **kontroli tożsamości**. Każda operacja w powłoce wykonywana jest w imieniu określonego użytkownika, co bezpośrednio wpływa na zakres dostępnych dla niego poleceń i zasobów.

W tej lekcji dowiesz się, jak Ubuntu identyfikuje konta użytkowników i ich przynależność do grup oraz jak zarządzać lokalną bazą kont.

## 🧪 Stacja treningowa: konto lokalne

Pod okiem tutora wykonasz podstawowy cykl konfiguracyjny. Sprawdzisz własną tożsamość, utworzysz nowe konto użytkownika, utworzysz nową grupę i przypiszesz do niej konto.

Zarządzanie kontami i grupami to niezbędny **etap przygotowawczy**. Uprawnienia do plików i katalogów zyskują sens dopiero wtedy, gdy w systemie istnieją przypisane do nich podmioty.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m2-01-uzytkownik-lokalny.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela jest szybkim punktem odniesienia po przejściu tutora.

| Komenda                                 | Co robi                                               | Przykład                         |
| :-------------------------------------- | :---------------------------------------------------- | :------------------------------- |
| `whoami`                                | pokazuje nazwę aktualnego użytkownika                 | `whoami`                         |
| `id`                                    | pokazuje UID, GID i grupy aktualnego użytkownika      | `id`                             |
| `id [użytkownik]`                       | pokazuje identyfikatory i grupy wybranego użytkownika | `id technik`                     |
| `groups [użytkownik]`                   | pokazuje grupy użytkownika w krótszej formie          | `groups technik`                 |
| `sudo adduser [nazwa]`                  | tworzy lokalne konto i katalog domowy                 | `sudo adduser technik`           |
| `sudo groupadd [grupa]`                 | tworzy lokalną grupę                                  | `sudo groupadd audyt`            |
| `sudo usermod -aG [grupa] [użytkownik]` | dopisuje użytkownika do grupy dodatkowej              | `sudo usermod -aG audyt technik` |
| `getent passwd [użytkownik]`            | pokazuje wpis konta z bazy systemowej                 | `getent passwd technik`          |

## 👤 Tożsamość i plik <code>/etc/passwd</code>

Dla użytkownika najwygodniejszym identyfikatorem konta jest jego nazwa tekstowa. System operacyjny Linux wykonuje jednak operacje w oparciu o unikalne **identyfikatory liczbowe** (*`UID`*).

Wszystkie lokalne konta systemowe są zarejestrowane w pliku konfiguracyjnym `/etc/passwd`. Każdy wpis w tym pliku składa się z siedmiu pól rozdzielonych dwukropkami:

```bash
technik:x:1001:1001:technik:/home/technik:/bin/bash
```

Znaczenie poszczególnych pól:

| Fragment pola     | Opis i funkcja w systemie                                                      |
| :---------------- | :----------------------------------------------------------------------------- |
| `technik`         | Unikalna nazwa konta użytkownika.                                              |
| `x`               | Zaślepka wskazująca, że zaszyfrowane hasło znajduje się w pliku `/etc/shadow`. |
| `1001` (pierwszy) | **`UID`** (*User ID*), czyli unikalny identyfikator numeryczny użytkownika.    |
| `1001` (drugi)    | **`GID`** (*Group ID*), czyli identyfikator grupy głównej użytkownika.         |
| `technik`         | Pole informacyjne (np. pełne dane kontaktowe użytkownika).                     |
| `/home/technik`   | Ścieżka katalogu domowego przypisanego do konta.                               |
| `/bin/bash`       | Domyślna powłoka uruchamiana podczas logowania.                                |

Narzędzie `adduser` podczas tworzenia użytkownika pyta o hasło i zapisuje jego zaszyfrowany skrót w pliku `/etc/shadow`. Hasła nigdy nie są przechowywane w formie jawnej w pliku `/etc/passwd`. Z tego powodu ręczna edycja plików tożsamości jest niebezpieczna. Do zarządzania kontami należy zawsze używać dedykowanych poleceń.

<details>
<summary>Grupy widoczne przy koncie <code>egzamin</code></summary>

W systemach Ubuntu pierwsze konto utworzone podczas instalacji systemu (w tym środowisku jest to konto `egzamin`) należy domyślnie do wielu grup pomocniczych:

```text
egzamin adm cdrom sudo dip plugdev users lpadmin lxd
```

Rola poszczególnych grup systemowych:

| Grupa     | Zastosowanie                                                                       |
| :-------- | :--------------------------------------------------------------------------------- |
| `egzamin` | Prywatna grupa główna użytkownika.                                                 |
| `adm`     | Umożliwia odczyt niektórych logów systemowych w `/var/log`.                        |
| `cdrom`   | Pozwala na montowanie i obsługę lokalnych napędów optycznych.                      |
| `sudo`    | Daje uprawnienie do podnoszenia uprawnień i wykonywania poleceń administracyjnych. |
| `dip`     | Starsza grupa umożliwiająca nawiązywanie połączeń modemowych oraz VPN.             |
| `plugdev` | Pozwala na montowanie zewnętrznych nośników danych (np. pendrive).                 |
| `users`   | Ogólna grupa skupiająca wszystkich użytkowników lokalnych.                         |
| `lpadmin` | Daje prawo do zarządzania systemem drukowania.                                     |
| `lxd`     | Umożliwia uruchamianie i zarządzanie kontenerami LXD.                              |

Wymienione grupy przydzielają dostęp do określonych zasobów sprzętowych lub usług systemowych bez konieczności nadawania pełnych uprawnień administratora.

</details>

## 🔐 Działanie polecenia <code>sudo</code>

Polecenie `sudo` (*superuser do*) pozwala na uruchomienie pojedynczego polecenia z uprawnieniami konta administratora (**_root_**).

W codziennej pracy zaleca się podnoszenie uprawnień tylko dla tych operacji, które faktycznie modyfikują konfigurację lub stan systemu:

```bash
sudo adduser technik
```

Dzięki temu minimalizujesz ryzyko przypadkowego uszkodzenia systemu operacyjnego. W tej lekcji polecenie `sudo` jest wymagane do wykonania operacji modyfikujących konta i grupy:

- Tworzenie konta użytkownika:
  ```bash
  sudo adduser technik
  ```
- Tworzenie nowej grupy lokalnej:
  ```bash
  sudo groupadd audyt
  ```
- Przypisanie użytkownika do grupy dodatkowej:
  ```bash
  sudo usermod -aG audyt technik
  ```

## 👥 Bezpieczne dopisywanie do grup dodatkowych

Grupy dodatkowe służą do organizowania dostępu do określonych zasobów dla wielu użytkowników jednocześnie. Do przypisania użytkownika do nowej grupy dodatkowej służy polecenie `usermod`.

Prawidłowa konstrukcja polecenia:

```bash
sudo usermod -aG audyt technik
```

Znaczenie poszczególnych opcji (flag):

| Opcja      | Funkcja w poleceniu                                                                                 |
| :--------- | :-------------------------------------------------------------------------------------------------- |
| `-G audyt` | Wskazuje nazwę grupy dodatkowej, do której przypisujemy konto.                                      |
| `-a`       | Skrót od *append* (dopisz). Dołącza wskazaną grupę do aktualnej listy grup dodatkowych użytkownika. |

Pominięcie flagi `-a` w poleceniu `usermod -G` jest **_poważnym błędem konfiguracyjnym_**. Bez tej opcji system nadpisze dotychczasowe członkostwo użytkownika we wszystkich grupach dodatkowych, pozostawiając go wyłącznie w nowo wskazanej grupie.

## 🔎 Weryfikacja i audyt konfiguracji

Brak komunikatu o błędzie po wykonaniu polecenia administracyjnego nie oznacza automatycznie, że konfiguracja działa zgodnie z założeniami. Każda zmiana powinna zostać zweryfikowana za pomocą narzędzi kontrolnych.

Do sprawdzenia stanu konta po modyfikacji służą trzy polecenia:

1. Wyświetlenie identyfikatorów UID, GID oraz wszystkich przypisanych grup użytkownika:
   ```bash
   id technik
   ```
2. Szybki podgląd członkostwa w grupach:
   ```bash
   groups technik
   ```
3. Odpytanie bazy danych użytkowników o wpis dotyczący konkretnego konta:
   ```bash
   getent passwd technik
   ```

Weryfikacja ta pozwala upewnić się, że tożsamości oraz uprawnienia sieciowe zostały skonfigurowane w sposób bezbłędny.

## 🚀 Misja: przygotuj konto operatora

W misji przygotujesz inne konto niż w tutorze.

Masz utworzyć użytkownika `operator`, utworzyć grupę `wsparcie` i dopisać użytkownika do tej grupy. Hasło zostaje ustawione podczas działania `adduser`.

Na końcu pokaż audyt. System ma mieć dowód, że konto istnieje i należy do właściwej grupy.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m2-01-konto-operatora.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Narzędzia `whoami`, `id` oraz `groups` służą do weryfikacji **tożsamości roboczej** użytkownika oraz przypisanych do niego uprawnień.
- Plik `/etc/passwd` przechowuje definicje lokalnych kont systemowych, w tym unikalny identyfikator **`UID`**, numer grupy głównej (`GID`), ścieżkę katalogu domowego i domyślną powłokę.
- Polecenie `sudo` pozwala na bezpieczne podniesienie uprawnień do poziomu administratora (**_root_**) wyłącznie na czas wykonania jednej komendy.
- Modyfikacja grup dodatkowych poleceniem `usermod` bez flagi `-a` jest **_poważnym błędem_**, ponieważ powoduje skasowanie dotychczasowego członkostwa w innych grupach.
- Każdą zmianę konfiguracyjną należy zweryfikować, wykonując **audyt stanu konta** przy użyciu poleceń `id` lub `getent passwd`.
