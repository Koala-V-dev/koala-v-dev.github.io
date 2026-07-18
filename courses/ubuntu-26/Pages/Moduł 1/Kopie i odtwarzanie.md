# Kopie i odtwarzanie

W codziennej pracy z systemem Linux tworzenie kopii zapasowych (backupów) oraz umiejętność ich odtwarzania to absolutny fundament bezpieczeństwa danych. Zanim wykonasz jakąkolwiek modyfikację lub ryzykowną operację na plikach projektu, należy przygotować drogę powrotu poprzez wykonanie sprawnej i zweryfikowanej kopii.

## 🧪 Stacja treningowa: kopia i odtworzenie

W tej lekcji nauczysz się bezpiecznie kopiować, usuwać i odzyskiwać pliki w terminalu za pomocą standardowych narzędzi systemowych.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m1-02-kopia-i-odtworzenie.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela stanowi podręczne zestawienie poleceń powłoki używanych w tej lekcji. Zawsze możesz z niej skorzystać do szybkiej weryfikacji parametrów.

| Komenda             | Opis działania                                                     | Przykład                              |
| :------------------ | :----------------------------------------------------------------- | :------------------------------------ |
| `ls [katalog]`      | Wyświetla zawartość wskazanego katalogu.                           | `ls Projekt`                          |
| `cp [źródło] [cel]` | Tworzy kopię pliku w określonej lokalizacji docelowej.             | `cp Projekt/plan.txt Backup/plan.txt` |
| `cat [plik]`        | Wyświetla zawartość wskazanego pliku tekstowego w oknie terminala. | `cat Backup/plan.txt`                 |
| `rm [plik]`         | Usuwa wskazany plik.                                               | `rm Projekt/plan.txt`                 |

## ⚖️ Różnica między <code>cp</code> a <code>mv</code>

Polecenie `cp` (*copy*) tworzy niezależny, **drugi egzemplarz** wskazanego pliku, pozostawiając plik źródłowy bez zmian.

Rozważmy poniższe polecenie:

```bash
cp Projekt/plan.txt Backup/plan.txt
```

Po jego wykonaniu w systemie będą istnieć dwa identyczne pliki w różnych lokalizacjach:
1. `Projekt/plan.txt` (oryginał)
2. `Backup/plan.txt` (kopia)

Narzędzie `mv` (*move*) działa inaczej. Przenosi plik do nowej lokalizacji lub zmienia jego nazwę, usuwając go z dotychczasowego miejsca.

```bash
mv Projekt/plan.txt Backup/plan.txt
```

Po wykonaniu `mv` plik w katalogu `Projekt` przestanie istnieć.

Podczas tworzenia kopii zapasowych należy zawsze używać polecenia `cp`, aby zachować plik źródłowy na swoim miejscu.

## 🧯 Weryfikacja poprawności kopii

Samo upewnienie się, że plik o poprawnej nazwie pojawił się w katalogu docelowym, nie gwarantuje, że proces kopiowania przebiegł prawidłowo. Do pełnej weryfikacji potrzebujesz dwóch niezależnych potwierdzeń.

Zalecana procedura weryfikacyjna po wykonaniu kopii zapasowej:

1. Potwierdź obecność pliku na dysku za pomocą polecenia `ls`:
   ```bash
   ls Backup
   ```
2. Sprawdź faktyczną treść pliku przy użyciu narzędzia `cat`:
   ```bash
   cat Backup/plan.txt
   ```

Tylko połączenie obu tych kroków daje **pewność**, że kopia zapasowa jest kompletna i zdatna do odzyskania.

## ⚠️ Usuwanie plików bez kosza

Narzędzie `rm` (*remove*) trwale usuwa pliki z systemu operacyjnego. W przeciwieństwie do graficznych menedżerów plików, terminal nie posiada kosza. Skasowanego pliku nie da się w prosty sposób odzyskać.

Przed wywołaniem polecenia `rm` należy zawsze upewnić się, że usuwany jest właściwy plik z poprawnej lokalizacji.

W tej lekcji przeprowadziłeś kontrolowane usunięcie pliku:

```bash
rm Projekt/plan.txt
```

Gdy plik został usunięty, przystąpiłeś do jego odtworzenia. Proces ten polega na ponownym skopiowaniu zabezpieczonego pliku z katalogu kopii zapasowej do katalogu roboczego:

```bash
cp Backup/plan.txt Projekt/plan.txt
```

## 🚀 Misja: odzyskiwanie planu

W tym zadaniu plik roboczy `Projekt/plan.txt` został skasowany. Twoim celem jest przywrócenie go do katalogu roboczego z wykorzystaniem wcześniej przygotowanej kopii zapasowej w `Backup/`.

Samo upewnienie się, że plik istnieje, to za mało. Musisz wykazać, że jego treść jest prawidłowa.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m1-02-odzyskaj-plan.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Narzędzie `cp` tworzy **drugi egzemplarz** pliku w lokalizacji docelowej, podczas gdy `mv` trwale go przenosi lub zmienia nazwę.
- Polecenie `rm` usuwa dane **_bezpowrotnie_** (z pominięciem kosza), co wymaga zachowania ostrożności i weryfikacji ścieżki.
- Poprawność utworzonej kopii bezpieczeństwa należy zawsze potwierdzić poprzez weryfikację nazwy (`ls`) oraz zawartości (`cat`).
- Proces odtwarzania danych jest kompletny dopiero wtedy, gdy przeprowadzisz pomyślny **audyt spójności** odzyskanego pliku.
