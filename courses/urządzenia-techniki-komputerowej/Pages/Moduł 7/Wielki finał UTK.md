# Wielki finał UTK

Szkolna pracownia archiwizuje skany i nagrania. Masz uruchomić stanowisko, dobrać nośnik wymienny i zapewnić odzysk plików. Wykonaj kartę serwisową. Możesz pracować na poniższych danych bez sprzętu. Jeśli masz stanowisko laboratoryjne, porównaj wyniki z odczytami i używaj wyłącznie danych testowych.

## 📋 Dane stanowiska

- Płyta ma wolny slot M.2 2280 obsługujący tylko PCIe. Nośnik A ma format M.2 2280 SATA. Nośnik B ma M.2 2280 PCIe i NVMe.
- Dodatkowy dysk z archiwum jest widoczny, ale system pokazuje go jako nieprzydzielony. Istnieje kopia sprzed dwóch dni.
- Cztery dyski po 4 TB mają dać ponad 8 TB przed narzutem i tolerować awarię dowolnego jednego.
- Film 6 GiB ma przejść między dwoma stanowiskami. Oba zapisują na exFAT, a pendrive jest w FAT32.
- Formularz samokopiujący ma trzy warstwy. Skan książki ma być przeszukiwalny.

## 🧰 Kryteria

Za każdy wiersz karty przyznaj sobie po 1 punkcie za poprawną decyzję, uzasadnienie parametrem i sprawdzalny wynik. Maksimum to 15 punktów za pięć wierszy. Próg samokontroli to 12 punktów. Zachowanie jedynego egzemplarza danych jest warunkiem zaliczenia.

## 🧪 Samodzielna próba

Oddaj pięć wierszy. Połącz dobór drukarki i sposób skanowania w jeden wiersz. W pozostałych rozwiąż zgodność SSD, odzysk archiwum, RAID i nośnik wymienny. Dla każdego zapisz obserwację, działanie i potwierdzenie.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

1. Wybierz B, bo zgadza się format i połączenie PCIe. Potwierdź wykrycie modelu w firmware lub systemie.
2. Wstrzymaj zapisy na dysku archiwum. Sprawdź kopię i odtwórz próbkę do osobnego miejsca. Zabezpiecz dane z ostatnich dwóch dni przez odzysk na kopii sektorowej lub z pomocą serwisu.
3. RAID 5 daje 12 TB i toleruje jedną awarię. W modelu albo na pustych nośnikach testowych sprawdź odczyt po utracie jednego dysku. Zweryfikuj osobną kopię.
4. Wybierz exFAT na pustym nośniku lub po zabezpieczeniu dotychczasowych danych. Sprawdź zapis i odczyt filmu po obu stronach. Film przekracza limit rozmiaru pojedynczego pliku w FAT32.
5. Dobierz drukarkę igłową do nacisku na trzy warstwy. Sprawdź ostatnią kopię. Książkę zeskanuj na szybie i użyj OCR. Wyszukaj znaną frazę i porównaj z oryginałem.

</details>

## 🛠️ Zgłoszenie po modernizacji pracowni

Po montażu SSD M.2 pracownia zgłasza trzy objawy. Zniknął HDD z archiwum, zamiast systemu uruchamia się narzędzie z USB, a w skanach pojawia się pionowa linia. Nauczyciel potrzebuje stanowiska z działającym startem systemu oraz potwierdzenia, że da się odtworzyć kopię archiwum.

| Informacja przekazana z pierwszego zgłoszenia | Co wiesz przed próbą |
| --- | --- |
| Nowy SSD M.2 korzysta z SATA. | Instrukcja tej płyty podaje, że M.2 SATA wyłącza SATA 2. |
| HDD archiwum jest podłączony do SATA 2. | Na HDD mogą być nowsze pliki niż w kopii sprzed dwóch dni. |
| Podłączony pendrive zawiera narzędzie serwisowe. | Start z USB potwierdza, że uruchomił się program z pendrive’a. Stan wpisu SSD wymaga próby. |
| Wada skanu pojawia się na dokumentach wkładanych do podajnika. | Można porównać obie drogi na tym samym czystym arkuszu. |

### 🔧 Przeprowadź odbiór stanowiska

Wybierz kolejność prób na podstawie zgłoszenia. Przed zmianą zapisz, które nośniki pokazuje UEFI, jaki wpis startowy jest dostępny i gdzie leży kopia. Jeśli robisz próbę w pracowni, użyj stanowiska z dyskami i plikami ćwiczeniowymi. Usterki z tabeli służą do planowania. Na sprawnym stanowisku wystarczy zebrać odczyty i potwierdzić działanie po kontrolowanej zmianie, np. po przełożeniu przewodu dysku testowego do innego aktywnego portu.

| Obszar | Co wykonujesz | Co wpisujesz do karty |
| --- | --- | --- |
| HDD | Porównaj numer portu na płycie z instrukcją. Jeśli trzeba przepiąć przewód, odłącz zasilanie, zmień port i ponownie wejdź do UEFI. | Oznaczenie portu przed zmianą i po niej, model wykrytego HDD, wynik otwarcia pliku testowego. |
| Rozruch | Wybierz wpis systemu w jednorazowym menu startowym. Po poprawnym starcie sprawdź zachowanie przy kolejnym uruchomieniu. Jeśli trzeba zmienić kolejność, zapisz poprzednią i po zmianie powtórz start. | Nazwa wpisu, wynik próby jednorazowej i wynik startu domyślnego. |
| Odzysk | Odtwórz plik z kopii do osobnego katalogu. Otwórz go i porównaj SHA-256 z plikiem z kopii. | Data kopii, ścieżka odtworzenia, wynik otwarcia i porównania skrótów. |
| Skan | Zeskanuj ten sam arkusz z szyby i z ADF. Jeśli linia występuje tylko w ADF, postępuj według instrukcji czyszczenia i ponów skan. | Nazwy plików z obu prób, położenie śladu i wynik po ponowieniu. |

Jeśli nie masz dostępu do któregoś urządzenia, przy tej pozycji wpisz plan i oczekiwany odczyt. W kolumnie z dowodem zostaw „próba niewykonana”. Dzięki temu kolejna osoba może dokończyć odbiór i odróżnić wynik pomiaru od hipotezy.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Projekt inżynierski z bajtami w pamięci</span> <span class="deep-dive-badge">C I ASEMBLER</span></summary>
<div class="deep-dive-content">

Zbuduj model paska RAID 5 z trzema bajtami danych i czwartym bajtem parzystości. Wybierz 0x55, 0x0F i 0x80, a następnie ukryj dowolny bajt danych i odzyskaj go z pozostałych. Zapisz rozwiązanie ręcznie albo uruchom poniższy model w C. `^` oznacza XOR. `unsigned` przechowuje liczby bez znaku, a `printf` pokazuje wynik szesnastkowo. Program nie otwiera urządzeń ani plików.

```c
#include <stdio.h>

int main(void)
{
    unsigned a = 0x55, b = 0x0F, c = 0x80;
    unsigned parity = a ^ b ^ c;
    unsigned recovered = parity ^ a ^ c;
    printf("%02X %02X\n", parity, recovered);
    return recovered != b;
}
```

Oczekuj `DA 0F`. Rozszerz model tak, by ukrywać każdy z trzech bajtów. Potem zmień jeden z pozostałych bajtów i sprawdź, jak błąd przechodzi do odtworzonej wartości. Zapisz, jakiego niezależnego pomiaru potrzebujesz, aby wykryć taki błąd. W asemblerze x86 operacja `xor eax, edx` wykonuje analogiczne XOR na dwóch 32-bitowych rejestrach i zapisuje wynik w pierwszym.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W karcie serwisowej zostaw dane wejściowe, uzasadnienie decyzji i dowód wyniku, aby druga osoba mogła powtórzyć próbę.

