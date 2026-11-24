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

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Format archiwów TAR i matematyka kompresji bezstratnej DEFLATE (LZ77 + Huffman)</span><span class="deep-dive-badge">Data Compression & Formats</span></summary>

W świecie Linuksa tworzenie kopii zapasowych często opiera się na duecie: **TAR** (archiwizacja) oraz **GZIP** (kompresja). To dwa całkowicie różne algorytmicznie procesy połączone w jeden plik `.tar.gz`.

### 1. Format binarny TAR (Tape Archive)
Format TAR powstał do sekwencyjnego zapisu plików na taśmach magnetycznych. Nie wykonuje żadnej kompresji:
- Całe archiwum jest podzielone na sztywne rekordy o rozmiarze **$512\ \text{bajtów}$**.
- Każdy plik w archiwum zaczyna się od 512-bajtowego nagłówka **UStar** (*Unix Standard TAR*):
  - Bajty 0-99: Ścieżka pliku (zakończona zerem `\0`)
  - Bajty 100-107: Tryb uprawnień pliku (zapisany w systemie ósemkowym w ASCII)
  - Bajty 108-115: UID właściciela (w ósemkowym ASCII)
  - Bajty 116-123: GID grupy (w ósemkowym ASCII)
  - Bajty 124-135: Rozmiar pliku w bajtach (w ósemkowym ASCII)
  - Bajty 148-155: Suma kontrolna nagłówka
- Po nagłówku następują surowe dane pliku wyrównane w górę do wielokrotności $512\ \text{bajtów}$ (resztę wypełniają zera `0x00`).
- Koniec archiwum sygnalizują dwa kolejne, puste bloki $512\ \text{bajtów}$ złożone z samych zer.

### 2. Matematyka kompresji DEFLATE (GZIP)
Algorytm DEFLATE (stosowany w plikach `.gz` oraz `.zip`) łączy dwa potężne mechanizmy matematyczne:
1. **Algorytm słownikowy LZ77 (Lempel-Ziv 1977)**:
   - Przeszukuje strumień wejściowy w przesuwnym oknie o rozmiarze $32\ \text{KiB}$.
   - Jeśli znajdzie powtarzający się ciąg bajtów, zastępuje go parą: `(odległość_wstecz, długość_dopasowania)`.
   - Złożoność czasowa wyszukiwania jest optymalizowana tablicami haszującymi trójek bajtów.
2. **Statyczne i dynamiczne kodowanie Huffmana**:
   - Analizuje częstość występowania poszczególnych symboli w skompresowanym strumieniu LZ77.
   - Symbole pojawiające się najczęściej otrzymują najkrótsze kody binarne (np. 2 bity zamiast 8), a symbole rzadkie - kody dłuższe.
   - Kody są prefiksowe: żaden kod nie jest prefiksem innego, co umożliwia natychmiastowe, jednoznaczne dekodowanie strumienia bit po bicie.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Narzędzie `cp` tworzy **drugi egzemplarz** pliku w lokalizacji docelowej, podczas gdy `mv` trwale go przenosi lub zmienia nazwę.
- Polecenie `rm` usuwa dane **_bezpowrotnie_** (z pominięciem kosza), co wymaga zachowania ostrożności i weryfikacji ścieżki.
- Poprawność utworzonej kopii bezpieczeństwa należy zawsze potwierdzić poprzez weryfikację nazwy (`ls`) oraz zawartości (`cat`).
- Proces odtwarzania danych jest kompletny dopiero wtedy, gdy przeprowadzisz pomyślny **audyt spójności** odzyskanego pliku.
