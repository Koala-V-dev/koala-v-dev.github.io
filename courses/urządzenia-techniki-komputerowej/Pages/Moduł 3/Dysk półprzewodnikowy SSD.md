# Dysk półprzewodnikowy SSD

Dwa dyski pasują długością do gniazda M.2. Karta płyty podaje obsługę wyłącznie PCIe. Jeden nośnik ma w specyfikacji SATA. Który parametr rozstrzyga zgodność?

## ⚡ Trzy poziomy opisu SSD

M.2 określa m.in. format modułu i złącze. SATA i PCIe określają sposób połączenia. NVMe to rodzina specyfikacji obsługi pamięci nieulotnej, w komputerze osobistym zwykle przez PCIe. Sprawdź protokół, klucz złącza i długość modułu, np. 2280 oznacza 22 × 80 mm.

SSD ma kontroler i komórki NAND flash. Typy SLC, MLC, TLC i QLC w powszechnym nazewnictwie oznaczają odpowiednio 1, 2, 3 i 4 bity w komórce. Z liczby bitów wynikają wymagania co do rozróżniania stanów. O wydajności dysku decyduje też kontroler, wolne miejsce i bufor szybkiego zapisu. **TBW** jest wartością zapisu wyrażoną w terabajtach, podawaną przez producenta w warunkach specyfikacji lub gwarancji.

Po skasowaniu pliku system może poinformować dysk, które zakresy nie są już potrzebne. Dla SATA mówi się o TRIM, a NVMe ma operację zwalniania zakresów. Kontroler sam planuje odzyskanie przestrzeni. Taki sygnał nie jest procedurą bezpiecznego wymazania.

## 🧪 Powtórz pomiar na SSD

Wykonaj obie próby z lekcji o HDD na kopii tego samego pliku znajdującej się na SSD. Zmień w poleceniach tylko ścieżkę. Użyj dysków wewnętrznych lub zanotuj sposób podłączenia. Jeśli jeden dysk działa przez USB, różnica obejmuje też wpływ interfejsu.

| Nośnik | Odczyt kolejnych bloków (MiB/s) | Odczyt losowy (MiB/s) | Średnie opóźnienie losowe (ms) |
| --- | --- | --- | --- |
| HDD | | | |
| SSD | | | |

Porównaj, ile razy spada przepustowość przy odczycie losowym na każdym dysku. Na HDD dochodzi ruch głowicy i obrót talerza. W SSD nadal potrzeba czasu na znalezienie danych przez kontroler i odczyt NAND. Jeśli oba dyski podłączono przez różne interfejsy, porównaj też **stosunek odczytu losowego do sekwencyjnego na każdym dysku z osobna**.

## 🌡️ Dlaczego długi zapis może zwolnić

Niektóre SSD początkowo zapisują w obszarze NAND pracującym w trybie **pSLC**, z jednym bitem na komórkę. Po zapełnieniu bufora dalszy zapis może być wolniejszy. Inny mechanizm to ograniczenie wydajności przy wysokiej temperaturze. Pomiar odczytu z tej lekcji służy do porównania dostępu do bloków. Długi zapis i jego temperaturę trzeba zmierzyć osobno. [Buforowanie zapisu i ochrona termiczna w dokumentacji Samsung](https://semiconductor.samsung.com/consumer-storage/support/faqs/internalssd-product-information/).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Mapowanie NAND i nadmiar zapisu</span> <span class="deep-dive-badge">PAMIĘĆ FLASH</span></summary>
<div class="deep-dive-content">

NAND zapisuje dane w stronach, a kasuje większe bloki. Warstwa FTL mapuje logiczny blok na fizyczne miejsce. Przy zmianie strony kontroler może zapisać nową wersję gdzie indziej, a później przenieść pozostałe ważne strony, żeby odzyskać blok. Jeśli na 8 GiB żądań hosta przypada 12 GiB zapisu NAND, współczynnik write amplification wynosi 1,5. NVMe używa kolejek zgłoszeń i zakończeń. [Specyfikacje NVM Express](https://nvmexpress.org/specification/nvm-express-base-specification/).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Sprawdź osobno format, połączenie i protokół. Długotrwały zapis oceniaj po wyjściu poza bufor.

