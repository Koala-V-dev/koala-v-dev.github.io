# Pliki i katalogi

Terminal początkowo może odrzucać, ale to naprawdę przyjemne narzędzie.

Na start potrzebujesz jednego wzorca:

```text
sprawdź gdzie jesteś -> wykonaj komendę -> sprawdź efekt
```

Bez tego łatwo zrobić poprawną rzecz w złym katalogu.

Tutor poprowadzi Cię przez pierwszą sesję. Opanujesz w ten sposób podstawowe komendy.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m0-01-pierwsza-sesja.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela stanowi szybki układ odniesienia dla podstawowych komend powłoki. Możesz z niej korzystać w dowolnym momencie bez konieczności ponownego uruchamiania tutora.

| Komenda             | Opis działania                                                     | Przykład                                |
| :------------------ | :----------------------------------------------------------------- | :-------------------------------------- |
| `pwd`               | Wyświetla pełną ścieżkę bieżącego katalogu roboczego.              | `pwd`                                   |
| `ls`                | Wyświetla zawartość katalogu (pliki i podkatalogi).                | `ls`                                    |
| `ls -la`            | Pokazuje szczegółowe informacje o plikach, w tym pliki ukryte.     | `ls -la`                                |
| `cd [katalog]`      | Zmienia bieżący katalog roboczy na wskazany.                       | `cd "Notatki o ubuntu"`                 |
| `cd`                | Przenosi bezpośrednio do katalogu domowego użytkownika.            | `cd`                                    |
| `mkdir [katalog]`   | Tworzy nowy katalog o wskazanej nazwie.                            | `mkdir "Notatki o ubuntu"`              |
| `touch [plik]`      | Tworzy pusty plik lub aktualizuje czas jego ostatniej modyfikacji. | `touch komendy.txt`                     |
| `mv [źródło] [cel]` | Przenosi plik/katalog lub zmienia jego nazwę.                      | `mv komendy.txt komendy-podstawowe.txt` |
| `rmdir [katalog]`   | Usuwa pusty katalog.                                               | `rmdir pusty_katalog`                   |
| `man [polecenie]`   | Wyświetla podręcznik systemowy (manual) dla danej komendy.         | `man rm`                                |
| `rm [plik]`         | Usuwa wskazany plik.                                               | `rm komendy.txt`                        |
| `rm -r [katalog]`   | Usuwa katalog wraz z całą jego zawartością (*rekursywnie*).        | `rm -r "Notatki o ubuntu"`              |

### 🧷 Spacje w nazwach

Interpreter poleceń (powłoka) traktuje spacje jako znaki rozdzielające kolejne parametry. Z tego powodu próba utworzenia katalogu z kilkuczłonową nazwą może przynieść nieoczekiwane rezultaty.

Rozważmy poniższe polecenie:

```bash
mkdir Notatki o ubuntu
```

Dla człowieka zapis ten reprezentuje jedną nazwę „Notatki o ubuntu”. Powłoka zinterpretuje go jednak jako *trzy osobne argumenty*:
1. `Notatki`
2. `o`
3. `ubuntu`

W efekcie system utworzy trzy oddzielne foldery zamiast jednego.

Aby poinstruować powłokę, że cała nazwa stanowi jeden argument, należy ująć ją w **cudzysłowy**:

```bash
mkdir "Notatki o ubuntu"
```

Alternatywnym sposobem jest zastosowanie odwrotnego ukośnika (backslash), który neutralizuje specjalne znaczenie spacji:

```bash
mkdir Notatki\ o\ ubuntu
```

W codziennej pracy znacznie bardziej przejrzystym i zalecanym rozwiązaniem jest **stosowanie cudzysłowów**.

### 🧯 Kontrola nad poleceniem <code>rm</code>

Narzędzie `rm` (*remove*) usuwa pliki w sposób <strong>**_bezpowrotny_**</strong>, omijając systemowy kosz. Dodanie flagi `-r` (*recursive*) powoduje skasowanie całego katalogu wraz z wszystkimi jego plikami i podkatalogami.

Przed wykonaniem tak radykalnej operacji należy bezwzględnie zweryfikować bieżący katalog roboczy oraz jego strukturę. Pozwoli to zapobiec przypadkowemu skasowaniu ważnych danych.

Zalecana sekwencja kontrolna przed użyciem `rm`:

1. Wyświetl bieżącą ścieżkę:
   ```bash
   pwd
   ```
2. Upewnij się, jakie pliki znajdują się w wybranej lokalizacji:
   ```bash
   ls
   ```
3. Wykonaj usunięcie dopiero po pełnym potwierdzeniu kontekstu:
   ```bash
   rm -r "Notatki o ubuntu"
   ```

Kształtowanie nawyku weryfikacji przed każdą destrukcyjną operacją to jeden z najważniejszych elementów pracy z systemami Linux.

## 🚀 Misja: porządkowanie katalogu

Wyzwanie sprawdza, czy umiesz samodzielnie naprawić bałagan po sekwencji złych komend.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m0-01-skrzynka-zrzutowa.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Każde polecenie w terminalu wykonuje się w kontekście określonego **katalogu roboczego** (jego ścieżkę wyświetlisz za pomocą `pwd`).
- Powłoka systemowa traktuje spacje jako separator argumentów. Dlatego nazwy ze spacjami należy zapisywać w **cudzysłowie**.
- Narzędzie `rm` usuwa dane **_bezpowrotnie_** (omijając kosz), a usunięcie katalogu z zawartością wymaga flagi `-r` (*recursive*).
- Dobrym nawykiem jest stosowanie **sekwencji kontrolnej**: najpierw zweryfikuj lokalizację (`pwd` i `ls`), wykonaj operację i na koniec sprawdź jej rezultat.
