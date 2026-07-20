# Wstępne informacje o systemie

Rozpoczynając pracę na dowolnym serwerze lub stacji roboczej Linux, pierwszą i kluczową czynnością jest zorientowanie się w środowisku. Informacje o dystrybucji i wersji systemu operacyjnego decydują o tym, jakich komend użyjesz, jakie pakiety zainstalujesz oraz które poradniki będą zgodne z Twoją konfiguracją.

## ⚙️ Anatomia poleceń w terminalu (CLI)

Zanim zaczniesz wpisywać pierwsze komendy w terminalu, musisz zrozumieć, jak system interpretuje to, co piszesz. Każda instrukcja wprowadzana w CLI (Command Line Interface) budowana jest według ściśle określonej składni:

$$\text{polecenie} \quad \text{[opcje]} \quad \text{[argumenty]}$$

### 1. Polecenie (Command)
To nazwa programu lub narzędzia, które chcesz uruchomić (np. `cat`, `hostname`, `ls`, `cp`). Wpisywana jest zawsze na samym początku linii.

### 2. Opcje / Flagi (Options / Flags)
Modyfikują zachowanie polecenia. Zazwyczaj zaczynają się od pojedynczego myślnika `-` (wersja skrócona, np. `-h`, `-r`) lub podwójnego myślnika `--` (wersja pełna słowna, np. `--help`, `--recursive`).  
*Przykład:* komenda `df` pokazuje miejsce na dysku w bajtach, ale `df -h` (opcja *human-readable*) wyświetli te same dane w megabajtach i gigabajtach.

### 3. Argumenty (Arguments)
To dane wejściowe dla polecenia - zazwyczaj wskazują pliki, katalogi lub teksty, na których program ma wykonać operację.  
*Przykład:* w komendzie `cat /etc/hostname` argumentem jest ścieżka do pliku `/etc/hostname`.

> [!IMPORTANT]
> **Separator spacji**  
> W terminalu spacja jest **jedynym operatorem rozdzielającym** poszczególne elementy polecenia. Jeśli zapomnisz o spacji (np. wpiszesz `cat/etc/os-release`), system potraktuje to jako jedną nazwę polecenia i zgłosi błąd: `command not found`.  
> Jeśli ścieżka lub nazwa pliku zawiera spację, należy ją ująć w cudzysłów (np. `"mój plik.txt"`) lub poprzedzić spację znakiem ucieczki (np. `mój\ plik.txt`), inaczej terminal uzna, że podajesz dwa osobne argumenty.

---

## 🧪 Stacja treningowa: identyfikacja systemu

W tej lekcji dowiesz się, jak sprawnie odczytać tożsamość systemu.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m1-01-mapa-systemu.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela stanowi podręczne zestawienie poleceń i plików konfiguracyjnych użytych w interaktywnym przewodniku.



| Komenda               | Co robi                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `cat [PLIK]`          | Wyświetla zawartość wskazanego pliku tekstowego w oknie terminala    |
| `cat /etc/os-release` | odczytuje z pliku `os-release` nazwę i wersję dystrybucji            |
| `cat /etc/hostname`   | odczytuje z pliku `hostname` nazwę komputera                         |
| `hostname`            | Wyświetla bieżącą nazwę sieciową komputera bezpośrednio w terminalu. |

## 🧾 Plik <code>/etc/os-release</code>

Plik `/etc/os-release` to uniwersalny standard w nowoczesnych dystrybucjach Linux. Przechowuje on kluczowe metadane dotyczące tożsamości systemu operacyjnego w formacie par klucz-wartość.

W codziennej pracy administratora odczyt tego pliku jest kluczowy do określenia:
- zgodności instalowanych pakietów oprogramowania,
- wersji dystrybucji Ubuntu przed uruchomieniem skryptów wdrożeniowych,
- poprawności konfiguracji według zewnętrznej dokumentacji.

Typowy odczyt tego pliku wyświetla następujące informacje:

```text
PRETTY_NAME="Ubuntu 26.04 LTS"
NAME="Ubuntu"
VERSION_ID="26.04"
VERSION="26.04 LTS (Resolute Raccoon)"
VERSION_CODENAME=resolute
ID=ubuntu
```

Podczas gdy pole `PRETTY_NAME` jest przeznaczone do wyświetlania czytelnej nazwy użytkownikowi, skrypty automatyzujące opierają się na zmiennych `ID`, `VERSION_ID` oraz `VERSION_CODENAME`.

<details>
<summary>Najważniejsze pola z <code>/etc/os-release</code></summary>

| Pole               | Przykład                             | Opis i zastosowanie                                                 |
| :----------------- | :----------------------------------- | :------------------------------------------------------------------ |
| `PRETTY_NAME`      | `Ubuntu 26.04 LTS`                   | Czytelna, pełna nazwa systemu operacyjnego.                         |
| `NAME`             | `Ubuntu`                             | Nazwa dystrybucji bez numeru wersji.                                |
| `VERSION_ID`       | `26.04`                              | Numeryczny identyfikator wersji dystrybucji.                        |
| `VERSION`          | `26.04 LTS (Resolute Raccoon)`       | Pełna nazwa wydania wraz z nazwą kodową.                            |
| `VERSION_CODENAME` | `resolute`                           | Nazwa kodowa wydania (wykorzystywana np. w repozytoriach pakietów). |
| `ID`               | `ubuntu`                             | Krótki identyfikator systemu używany przez skrypty.                 |
| `ID_LIKE`          | `debian`                             | Wskazuje dystrybucję bazową (rodzinę systemów).                     |
| `SUPPORT_URL`      | `https://help.ubuntu.com/`           | Oficjalny adres pomocy technicznej.                                 |
| `BUG_REPORT_URL`   | `https://bugs.launchpad.net/ubuntu/` | System zgłaszania błędów dystrybucji.                               |
| `LOGO`             | `ubuntu-logo`                        | Domyślny identyfikator graficzny logo.                              |

</details>

![Wynik w terminalu wstępnych informacji o systemie Linux](/public/courses/ubuntu-26/Images/ubuntu-podstawowe-informacje-o-systemie.png)

## 🖥️ Plik <code>/etc/hostname</code> i polecenie <code>hostname</code>

Nazwa sieciowa komputera (tzw. **hostname**) służy do identyfikacji maszyny w sieci lokalnej oraz w strukturach sieciowych. System Linux przechowuje tę informację w pliku konfiguracyjnym `/etc/hostname`.

Do odczytania nazwy zapisanej bezpośrednio w pliku służy polecenie `cat`:

```bash
cat /etc/hostname
```

Możesz także pobrać aktualnie ustawioną w pamięci nazwę za pomocą dedykowanego polecenia `hostname`:

```bash
hostname
```

Obie metody zwrócą ten sam rezultat np.:

```text
ubuntu
```

Różnica polega na tym, że plik `/etc/hostname` wskazuje **miejsce przechowywania** konfiguracji, natomiast polecenie `hostname` to szybki sposób na odpytanie jądra systemu o aktywną nazwę bez otwierania pliku.

## 🚀 Misja: pakiet orientacyjny

Dostajesz mały system po instalacji i notatkę w katalogu `Pobrane`.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m1-01-pakiet-orientacyjny.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Plik `/etc/os-release` jest standardowym **źródłem informacji** o dystrybucji, gdzie pole `PRETTY_NAME` służy do prezentacji czytelnej nazwy, a zmienne `ID` i `VERSION_ID` są wykorzystywane w skryptach.
- Nazwę sieciową komputera (**hostname**) odczytasz z pliku `/etc/hostname` lub bezpośrednio z pamięci jądra za pomocą polecenia `hostname`.
- Polecenie `cat` służy do szybkiego wyświetlania zawartości plików tekstowych w oknie terminala.
