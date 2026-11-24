# Nośniki i wydajność zapisu

Do wyboru masz dysk wewnętrzny, kartę SD, płytę optyczną i taśmę. Jedno stanowisko zapisuje materiał z kamery, drugie co tydzień odkłada duże archiwum. Zapisz najpierw, w którym przypadku potrzebujesz szybkiego dostępu do pojedynczego pliku.

## 💾 Dobór do sposobu użycia

HDD zapisuje magnetycznie na talerzach. SSD, karty pamięci i wiele pendrive'ów wykorzystują flash. Nośnik optyczny wymaga zgodnego napędu. Taśma jest przeznaczona do pracy w dużej mierze sekwencyjnej. Dysk i taśma mogą mieć dużo miejsca, ale czas dotarcia do rozproszonych plików zależy od mechanizmu.

**Przepustowość** podaje ilość danych w jednostce czasu. **Opóźnienie** to czas obsługi operacji. **IOPS** to liczba operacji wejścia i wyjścia na sekundę, zależna m.in. od rozmiaru operacji. Jeżeli kamera zapisuje 120 Mb/s, strumień wymaga 15 MB/s danych. Do doboru karty sprawdź minimalną trwałą szybkość zapisu i wymagania kamery, obok maksymalnego odczytu z opakowania.

1 TB oznacza 10¹² B, czyli około 931 GiB. Gdy odczyt wygląda inaczej, sprawdź jednostki oraz miejsce zajęte przez strukturę woluminu i dane.

## 🧪 Samodzielna próba

Kamera zapisuje 200 Mb/s. Karta A reklamuje odczyt 180 MB/s, a karta B podaje minimalny zapis 30 MB/s w trybie zgodnym z kamerą. Wskaż, którą kartę da się ocenić na podstawie tych danych.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Strumień wymaga 25 MB/s przed dodatkowym narzutem. Dla B możesz porównać gwarantowany zapis z wymaganiem, a następnie sprawdzić zgodność i wykonać próbę ciągłego zapisu. Dla A znasz inną operację, odczyt.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Od IOPS do przepustowości</span> <span class="deep-dive-badge">POMIARY WYDAJNOŚCI</span></summary>
<div class="deep-dive-content">

W kontrolowanym pomiarze 10 000 operacji po 4096 B na sekundę przenosi 40 960 000 B/s, czyli 40,96 MB/s. Ten sam wynik IOPS przy dwukrotnie większych porcjach oznaczałby dwukrotną przepustowość, gdyby urządzenie utrzymało liczbę operacji. Odczytaj jednocześnie rozmiar bloku, typ operacji i głębokość kolejki, czyli liczbę zgłoszeń oczekujących na obsługę lub zakończenie.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Dobieraj nośnik do rozmiaru operacji, czasu dostępu, trwałego zapisu i zgodności z czytnikiem.

