# Dysk twardy HDD

Jeden duży plik kopiuje się szybciej niż tysiące małych o tej samej łącznej wielkości. Przewidź, co w HDD może pochłonąć dodatkowy czas.

## 🧲 Ruch przed odczytem

HDD ma wirujące talerze, głowice oraz mechanizm ustawiający głowice nad odpowiednią ścieżką. Ścieżki tworzą okręgi, a sektor jest porcją danych na nośniku. System adresuje **bloki logiczne** numerami LBA. Elektronika dysku tłumaczy żądania na własny układ danych. Dawne CHS opisywało położenie przez cylinder, głowicę i sektor.

Przy rozrzuconych żądaniach głowica częściej zmienia położenie i czeka na obrót talerza. Przy długim ciągłym odczycie koszt ustawienia rozkłada się na wiele danych. Przy kopiowaniu wielu małych plików dochodzi też obsługa wpisów systemu plików.

Dla nośnika 7200 obr./min pełny obrót trwa około 8,33 ms. Losowa pozycja oznacza średnio połowę obrotu, czyli około 4,17 ms czekania po ustawieniu głowicy w uproszczonym modelu.

## 🧪 Zmierz koszt zmiany miejsca odczytu

Na HDD wybierz istniejący duży plik lokalny, na przykład obraz ISO o rozmiarze kilku GiB. Zamknij programy, które intensywnie korzystają z tego dysku. Otwórz PowerShell w folderze z plikiem **diskspd.exe** i podstaw w poleceniach własną ścieżkę. Oba testy czytają bloki po **64 KiB**, po jednym żądaniu naraz. Drugi test zmienia tylko kolejność odczytu. [DiskSpd i opis parametrów](https://github.com/microsoft/diskspd/wiki/Command-line-and-parameters).

```powershell
.\diskspd.exe -b64K -d20 -o1 -t1 -w0 -Su -L "D:\test\obraz.iso"
.\diskspd.exe -b64K -d20 -o1 -t1 -w0 -Su -L -r "D:\test\obraz.iso"
```

Pierwsze polecenie czyta kolejne bloki. **`-r`** wybiera losowe pozycje. **`-w0`** oznacza sam odczyt, a **`-Su`** omija buforowanie pliku przez Windows. Z sekcji wyników odczytu zanotuj przepustowość w **MiB/s** i średnie opóźnienie w **ms**.

Jeśli losowy odczyt ma większe opóźnienie, głowica częściej musi zmienić położenie i poczekać na obrót talerza. Zapisz oba wyniki. Użyjesz tych samych poleceń w lekcji o SSD, żeby zobaczyć, ile kosztuje zmiana miejsca odczytu bez ruchu głowicy.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Koszt całej trasy a czas pojedynczego odczytu</span> <span class="deep-dive-badge">ALGORYTMY SZEREGOWANIA</span></summary>
<div class="deep-dive-content">

Jeśli głowica startuje w $p_0$ i po kolei odwiedza $p_1, p_2, \ldots, p_n$, to do obsłużenia $k$-tego zgłoszenia pokona drogę:

$$D_k = \sum_{i=1}^{k} |p_i - p_{i-1}|.$$

Głowica zaczyna na ścieżce 40, a zgłoszenia czekają w kolejności 90, 35, 20, 80. FCFS bierze najstarsze zgłoszenie, SSTF wybiera najbliższą ścieżkę. Dla tej kolejki SSTF kończy po 90 odstępach między ścieżkami, a FCFS po 180. Mimo to zgłoszenie na ścieżkę 90 w FCFS jest obsłużone już po 50 odstępach, a w SSTF dopiero po 90. Suma drogi odpowiada na pytanie o całą kolejkę. Wartość dla konkretnego zgłoszenia zależy od jego miejsca w kolejce.

W tym przykładzie wszystkie zgłoszenia czekają od startu. Gdy nowe żądania stale dochodzą blisko głowicy, SSTF może wielokrotnie odsuwać jedno dalekie zgłoszenie. To **głodzenie**. Jednym ze sposobów ograniczenia tego problemu jest zamknięcie grupy zgłoszeń na czas przejścia przez ścieżki i skierowanie nowych żądań do kolejnej grupy, jak w F-SCAN.

Wyniki przykładu wyrażamy w odstępach między ścieżkami. Do wyznaczenia czasu w milisekundach potrzeba modelu pozycjonowania głowicy, opóźnienia obrotowego i transferu. W przykładzie numery reprezentują fizyczne ścieżki. System operacyjny operuje adresami LBA.

Źródło: [Operating Systems: Three Easy Pieces, rozdział Hard Disk Drives, §37.5](https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przy porównaniu HDD rozróżnij odczyt sekwencyjny i losowy oraz porównuj te same warunki.

