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

| Komenda | Opis działania | Przykład |
| :--- | :--- | :--- |
| `ls -l` | Wyświetla zawartość katalogu w formacie szczegółowym (w tym prawa dostępu i własność). | `ls -l` |
| `sudo chown [użytkownik] [ścieżka]` | Zmienia właściciela wskazanego pliku lub katalogu. | `sudo chown technik Projekt` |
| `sudo chgrp [grupa] [ścieżka]` | Zmienia grupę właścicielską wskazanego pliku lub katalogu. | `sudo chgrp audyt Projekt` |
| `sudo chown [użytkownik]:[grupa] [ścieżka]` | Zmienia jednocześnie właściciela oraz grupę właścicielską jednym poleceniem. | `sudo chown technik:audyt Projekt` |
| `sudo chmod [tryb] [ścieżka]` | Zmienia prawa dostępu (mode) dla wskazanego zasobu. | `sudo chmod 750 Projekt` |
| `su - [użytkownik]` | Uruchamia nową sesję powłoki z prawami i środowiskiem wskazanego konta. | `su - technik` |
| `exit` | Kończy bieżącą sesję powłoki i powraca do poprzedniej tożsamości. | `exit` |

## 👤 Reprezentacja uprawnień w listingu <code>ls -l</code>

Polecenie `ls -l` wyświetla szczegółowe metadane każdego zasobu w jednej linii. Przykład reprezentacji dla katalogu:

```bash
drwxr-x--- 2 technik audyt 4096 1999-05-30 21:37 Projekt
```

Każdy znak w sekwencji uprawnień ma ściśle określone znaczenie:

| Zapis pola | Znaczenie i przynależność |
| :--- | :--- |
| `d` | Typ zasobu (litera `d` oznacza katalog, myślnik `-` to zwykły plik). |
| `rwx` (pierwsze trzy) | Prawa **właściciela** konta (odczyt, zapis, wykonanie). |
| `r-x` (środkowe trzy) | Prawa **grupy właścicielskiej** (odczyt, brak zapisu, wykonanie). |
| `---` (ostatnie trzy) | Prawa **pozostałych użytkowników** w systemie (brak jakichkolwiek praw). |
| `technik` | Właściciel zasobu. |
| `audyt` | Grupa właścicielska zasobu. |
| `Projekt` | Nazwa katalogu lub pliku. |

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

| Prawo | Wartość | Działanie w odniesieniu do katalogu |
| :--- | :--- | :--- |
| `r` (*read*) | `4` | Zezwala na wyświetlenie listy plików wewnątrz katalogu. |
| `w` (*write*) | `2` | Zezwala na tworzenie, usuwanie oraz modyfikację wpisów w katalogu. |
| `x` (*execute*) | `1` | Zezwala na wejście do katalogu (przejście przez niego) w celu wykonania dalszych poleceń. |

Na podstawie tej kalkulacji tryb `750` oznacza:

| Klasa dostępu | Cyfra ósemkowa | Składniki sumy | Wynikowy tryb tekstowy |
| :--- | :--- | :--- | :--- |
| Właściciel | `7` | `4` + `2` + `1` | `rwx` (pełny dostęp) |
| Grupa | `5` | `4` + `0` + `1` | `r-x` (odczyt i wejście, brak zapisu) |
| Pozostali | `0` | `0` + `0` + `0` | `---` (brak jakichkolwiek praw) |

W przypadku katalogów uprawnienie `x` ma **kluczowe znaczenie**. Bez prawa wykonywania nie jest możliwe wejście do katalogu, nawet jeśli klasa użytkowników ma teoretycznie przypisane prawo odczytu `r`.

## 🧪 Sandbox: model uprawnień rwx

Poniższy model pozwala na bezpieczną, interaktywną wizualizację i testowanie zachowania uprawnień w bezpiecznym środowisku symulacyjnym.

<data-gate>
<data-permission-lab src="/public/courses/ubuntu-26/Scenarios/permissions/model-rwx-zadanie.md"></data-permission-lab>
</data-gate>

## 🚀 Misja: zabezpiecz katalog projektu

W misji dostajesz inny katalog projektu. Masz ustawić właściciela, grupę i prawa, a potem pokazać wynik przez `ls -l`.

To jest normalna administracyjna praca: zmieniasz stan systemu, robisz audyt i testujesz dostęp z właściwego konta.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m2-02-katalog-projektu.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Narzędzie `ls -l` służy do szczegółowego **audytu stanu własności** oraz przypisanych praw dostępu do zasobów.
- Polecenie `chown` służy do zmiany właściciela, `chgrp` do zmiany grupy, natomiast `chmod` modyfikuje uprawnienia dostępu (tryb).
- Uprawnienia ósemkowe (np. `750`) określają sumaryczne prawa odpowiednio dla właściciela (`rwx`), grupy (`r-x`) oraz pozostałych użytkowników (`---`).
- W przypadku katalogów prawo wykonywania (`x`) ma **kluczowe znaczenie**, ponieważ warunkuje ono możliwość wejścia do folderu oraz przechodzenia przez jego ścieżkę.
- Polecenie `su -` pozwala na uruchomienie sesji jako inny użytkownik, co umożliwia praktyczne przetestowanie i weryfikację uprawnień dostępu.
- Każdą zmianę własności lub praw dostępu należy sprawdzić na końcu poprzez **audyt spójności**, zamiast ufać wyłącznie poprawnemu wykonaniu komendy.
