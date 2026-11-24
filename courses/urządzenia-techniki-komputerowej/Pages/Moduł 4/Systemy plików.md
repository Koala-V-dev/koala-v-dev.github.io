# Systemy plików

Pendrive ma 20 GB wolnego miejsca i odrzuca plik 6 GiB. Co sprawdzisz przed zakupem większego?

## 📂 Reguły zapisu pliku

System plików opisuje nazwy, katalogi, położenie danych i metadane, np. rozmiar i datę. **Klaster** to jednostka przydziału przestrzeni w wielu systemach plików. Przy klastrze 4 KiB prosty plik o rozmiarze 5 KiB potrzebuje zwykle dwóch klastrów, pomijając kompresję i inne szczególne mechanizmy.

FAT32 obsługuje pojedynczy plik do 4 GiB minus 1 B. exFAT pozwala zapisywać większe pliki i bywa dobrym wyborem dla nośników wymiennych, jeśli wszystkie urządzenia go obsługują. NTFS obsługuje uprawnienia plików i dziennikowanie metadanych. ext4 to popularny system plików Linuksa z dziennikiem. **Dziennik** pomaga przywrócić spójność po przerwaniu operacji. Zakres ochrony zależy od systemu i ustawień.

W przykładzie z pendrive'em sprawdź typ systemu plików i wymagania obu urządzeń. Jeśli potrzebna jest zmiana formatu, zacznij od skopiowania danych i sprawdzenia kopii.

W warsztacie GPT prawidłowy wpis wskazywał **zakres bloków** partycji. Jeśli system wykrywa partycję o oczekiwanym rozmiarze, ale pokazuje wolumin jako **RAW**, to punkt wyjścia do sprawdzenia warstwy systemu plików. Przyczyną może być uszkodzenie jego struktur albo format, którego system nie rozpoznaje. Na dysku z danymi zanotuj wykryty zakres i stan kopii przed próbą naprawy. Sformatowanie utworzyłoby nowe struktury w tym samym zakresie. [Diagnostyka Zarządzania dyskami w dokumentacji Microsoft](https://learn.microsoft.com/troubleshoot/windows-server/backup-and-storage/troubleshoot-disk-management).

## 🧪 Ustal, dlaczego duży plik nie mieści się na pendrivie

Przygotuj testowy pendrive z **FAT32** i drugi nośnik z **exFAT** lub **NTFS**. Możesz też użyć dwóch woluminów ćwiczeniowych przygotowanych w [lekcji o zarządzaniu dyskami w Windows 11](/courses/windows-11/Pages/Moduł%202/Zarządzanie%20dyskami%20i%20partycjami.html). Do prób wystarczy mały plik tekstowy oraz istniejący plik większy niż **4 GiB**, na przykład obraz ISO. Oba nośniki muszą mieć więcej wolnego miejsca niż rozmiar większego pliku.

1. W Eksploratorze otwórz **Ten komputer**. We właściwościach każdego woluminu zanotuj **System plików** i **Wolne miejsce**. We właściwościach dużego pliku sprawdź **Rozmiar** w bajtach.
2. Skopiuj mały plik na oba woluminy. Jeśli odmówią również małego zapisu, sprawdź ochronę przed zapisem i uprawnienia do wybranego folderu przed dalszą próbą.
3. Skopiuj duży plik na FAT32 i odczytaj komunikat. Wykonaj tę samą operację na drugim woluminie. Po udanej kopii porównaj rozmiar w bajtach, a jeśli plik ma posłużyć do instalacji lub archiwizacji, porównaj także sumy SHA-256 jak w lekcji o kopiach zapasowych.

Mały plik pozwala potwierdzić, że możesz zapisać dane w wybranym miejscu. Duży plik przekracza limit pojedynczego pliku w FAT32 nawet wtedy, gdy wolnych jest kilkadziesiąt gigabajtów. Pole rozmiaru ma 32 bity bez znaku, więc najwyższa zapisywalna wartość to $2^{32}-1$ bajtów. Jeśli docelowe urządzenie, np. telewizor, czyta tylko FAT32, sprawdź możliwość podziału pliku w używanym formacie albo użyj innej drogi dostarczenia danych. [Specyfikacja FAT, opis pola DIR_FileSize](https://academy.cba.mit.edu/classes/networking_communications/SD/FAT.pdf).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Modulo i ilość pustego miejsca</span> <span class="deep-dive-badge">MATEMATYKA</span></summary>
<div class="deep-dive-content">

Otwórz właściwości małego pliku na obu woluminach i porównaj pola **Rozmiar** i **Rozmiar na dysku**. Przykładowy plik ma 4100 B, ale przy typowej alokacji zajmuje 8192 B w klastrach po 4096 B i 32 768 B w klastrach po 32 768 B. Przy wielu małych plikach tę różnicę ponosisz dla każdego pliku osobno.

Dla zwykłej alokacji rozmiar $n$ zaokrąglasz w górę do pełnego klastra wielkości $k$. Puste miejsce w przydziale to różnica między przydziałem a rozmiarem pliku.

$$ A = k\left\lceil\frac{n}{k}\right\rceil, \qquad A-n = (k - (n \bmod k)) \bmod k. $$

Dla 4100 B na klastrach po 4096 B reszta wynosi 4 B, więc pusta końcówka ma 4092 B. Drugie modulo daje 0 B pustej końcówki, gdy rozmiar pliku jest dokładną wielokrotnością klastra. Model pomija m.in. metadane, kompresję oraz małe pliki przechowywane w rekordach MFT w NTFS. [Porównanie przydziału w systemach plików Windows](https://learn.microsoft.com/en-us/windows/win32/fileio/filesystem-functionality-comparison).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oddziel wolne miejsce, limit rozmiaru pliku, zgodność urządzeń oraz wymagane uprawnienia.

