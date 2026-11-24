# Magistrale przerwania i DMA

Przy kopiowaniu pliku CPU wykonuje też inne zadania. Jak dowiaduje się, że urządzenie zakończyło przesyłanie danych?

## 🛣️ Dane, adres i polecenie

**Magistrala** lub łącze przenosi dane i informacje sterujące. W uproszczonym modelu adres odpowiada na pytanie „gdzie”, dane na „co”, a sterowanie na „jaka operacja”. Łącze szeregowe może przekazywać te informacje kolejno w pakietach, zamiast używać oddzielnego przewodu dla każdego bitu adresu.

**Odpytywanie** polega na wielokrotnym sprawdzaniu stanu. **Przerwanie** informuje procesor o zdarzeniu, aby system mógł uruchomić obsługę. **DMA** pozwala urządzeniu lub kontrolerowi przesyłać dane do lub z RAM bez kopiowania każdego słowa przez CPU. CPU i sterownik przygotowują transfer, a zakończenie może być zgłoszone przerwaniem albo wykryte przez odpytywanie.

Przy odbiorze dużego obrazu system przydziela bufor, czyli obszar tymczasowy w pamięci. Kontroler zapisuje do niego dane. Dopiero po potwierdzeniu zakończenia aplikacja może dostać gotową porcję.

## 🧪 Obserwuj odczyt i pracę procesora

Wybierz duży plik na zewnętrznym dysku USB. Otwórz w Windows **Monitor zasobów** (w menu Start wpisz **resmon**) i przejdź do karty **Dysk**. Przygotuj na dysku wewnętrznym pusty folder z miejscem na kopię.

1. Zanotuj, jaka aktywność występuje przed kopiowaniem. W Eksploratorze skopiuj plik z USB do przygotowanego folderu.
2. Rozwiń **Aktywność dysku**. Odszukaj plik źródłowy i kopię według ścieżek. Sprawdź, przy której ścieżce rośnie **Odczyt (B/s)**, a przy której **Zapis (B/s)**. W sekcji **Magazyn** porównaj aktywność obu dysków.
3. Podczas kopiowania otwórz Notatnik i wpisz kilka znaków. Sprawdź, czy system przyjmuje tekst, gdy kopiowanie nadal trwa. Po zakończeniu wróć do Monitora zasobów i zobacz, które wpisy znikają, gdy wygasa aktywność związana z plikiem.

Ścieżki pokazują, z którego nośnika dane są odczytywane i na który trafia zapis. To, że podczas kopiowania działa Notatnik, pokazuje współbieżną pracę systemu. Aby ustalić, jak konkretny kontroler przesyła dane i zgłasza zakończenie, trzeba sprawdzić dokumentację urządzenia lub ślad pracy sterownika.

## 📦 Kiedy bufor jest gotowy

Rozważ dwa odczyty z tego samego dysku. Pierwszy ma wypełnić bufor miniatury, drugi bufor filmu. Kontroler może zgłosić zakończenie jednego z nich, gdy drugi jeszcze trwa. Obsługa zdarzenia sprawdza **które żądanie** jest gotowe i czy zakończyło się powodzeniem. Dopiero wtedy system przekazuje odpowiednią porcję danych programowi. W ten sposób przerwanie budzi obsługę, a informacja o zakończonym żądaniu wskazuje właściwy bufor. [Operating Systems: Three Easy Pieces, rozdział I/O Devices](https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Adres CPU i adres widziany przez urządzenie</span> <span class="deep-dive-badge">PROGRAMOWANIE SYSTEMOWE</span></summary>
<div class="deep-dive-content">

Sterownik może dostać dwa różne adresy tego samego bufora. Jeden służy CPU, drugi urządzeniu. IOMMU to układ tłumaczący adresy urządzeń i ograniczający obszary, do których mają dostęp. Na platformach bez spójnej pamięci podręcznej zapis DMA może wymagać synchronizacji, aby rdzeń zobaczył nowe dane. Linux opisuje te obowiązki w [przewodniku DMA](https://docs.kernel.org/core-api/dma-api-howto.html).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oddziel przygotowanie transferu, przesłanie danych i zawiadomienie o wyniku.

