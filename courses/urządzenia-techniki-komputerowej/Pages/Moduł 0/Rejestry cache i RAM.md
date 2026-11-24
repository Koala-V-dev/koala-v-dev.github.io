# Rejestry cache i RAM

Po zamknięciu programu komputer odzyskał pamięć, a plik pozostał na dysku. Co przepadłoby, gdyby program trzymał zmiany wyłącznie w RAM?

## 🧱 Hierarchia pamięci

Rejestry przechowują wartości używane bezpośrednio przez instrukcje. **Cache** trzyma kopie niedawno używanych obszarów i ich sąsiadów. Rdzeń może sięgnąć do kolejnych poziomów cache, a później do **RAM**, czyli pamięci roboczej systemu i programów. Dane w typowej RAM znikają po utracie zasilania. Nośnik masowy zachowuje pliki bez stałego zasilania.

SRAM używana w cache utrzymuje stan przy zasilaniu bez cyklicznego odświeżania komórki. W typowej komórce DRAM tranzystor daje dostęp do małego kondensatora. Układ odczytu rozpoznaje stan na podstawie zgromadzonego ładunku. Ładunek z czasem ucieka, dlatego pamięć okresowo odświeża komórki. Klasyczna ROM przechowuje dane bez zasilania. Współczesne firmware często trafia do zapisywalnej pamięci flash, którą można aktualizować w kontrolowany sposób.

Gdy aplikacja czyta bajty 0, 1, 2 i kolejne, zwykle korzysta z porcji danych sprowadzonych razem. Gdy skacze po dużej tablicy, kolejne odczyty częściej wymagają nowej porcji. Tę różnicę możesz wykorzystać przy obróbce obrazów.

## 🧪 Czy w tej chwili brakuje pamięci RAM?

Komputer przycina się, gdy przełączasz aplikacje. Ktoś widzi mało wolnej pamięci i chce dołożyć RAM. Zbierz dane podczas pracy, która rzeczywiście sprawia problem.

### 🖥️ Odczytaj dwa różne rodzaje pamięci podręcznej

W **Menedżerze zadań → Wydajność → Procesor** znajdź rozmiary **L1, L2 i L3**. To pamięć podręczna sprzętu. Przejdź do **Wydajność → Pamięć** i odczytaj **Dostępna**. Dane, które Windows trzyma w RAM do ponownego użycia, mogą zajmować część pamięci, którą system nadal może przydzielić aplikacji. Wartości w tej zakładce opisują użycie RAM przez system. [Jak Windows rozlicza dostępną pamięć](https://learn.microsoft.com/en-us/windows-hardware/test/assessments/results-for-the-memory-footprint-assessment).

### 🔎 Zmierz podczas spowolnienia

Uruchom **Monitor zasobów**. W oknie <kbd>Win</kbd> + <kbd>R</kbd> wpisz `resmon` i wybierz zakładkę **Pamięć**. Na pasku pamięci fizycznej odczytaj obszary **Standby** i **Free**. Nazwy na ekranie zależą od języka systemu. Standby zawiera dane, które system może wykorzystać ponownie albo zwolnić na potrzeby aplikacji. Free oznacza strony bez takiej zachowanej zawartości.

1. Zapisz wyniki przez około pół minuty zwykłej pracy. Potem powtórz czynność, przy której komputer się zacina. Zwróć uwagę, czy dostępna pamięć pozostaje niska przez dłuższy czas i czy rośnie liczba odczytów wymaganych przez błędy stron (*Hard Faults/sec*).
2. Zapisz pracę w jednej zbędnej aplikacji, która ma duży udział w użyciu pamięci. Zamknij ją i powtórz tę samą czynność. Sprawdź, czy wzrosła dostępna pamięć, a spowolnienie i odczyty osłabły.

| Obserwacja | Zwykła praca | Podczas spowolnienia | Po zamknięciu zbędnej aplikacji |
| --- | --- | --- | --- |
| Pamięć dostępna | | | |
| Błędy stron wymagające odczytu | | | |
| Jak długo trwała czynność | | | |

**Błąd strony wymagający odczytu** oznacza, że system musiał pobrać zawartość z dysku, na przykład z pliku aplikacji albo pliku stronicowania. Krótki skok przy pierwszym uruchomieniu jest możliwy przy dużej ilości dostępnej pamięci. Trwały brak dostępnej pamięci, powtarzające się odczyty i poprawa po zwolnieniu RAM razem wspierają diagnozę. [Znaczenie liczników błędów stron według Microsoft](https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/how-to-determine-the-appropriate-page-file-size-for-64-bit-versions-of-windows).

<details>
<summary>Porównaj dwa przykładowe odczyty</summary>

- **Stacja A.** Ma 0,2 GB wolnej pamięci bez zachowanej zawartości i 4,0 GB w Standby. Odczyty rosną chwilowo przy starcie aplikacji, po czym wracają do poprzedniego poziomu. System nadal może wykorzystać pamięć Standby.
- **Stacja B.** Dostępna pamięć utrzymuje się na poziomie około 0,2 GB, przełączaniu aplikacji towarzyszą odczyty i kilkusekundowe przerwy. Po zamknięciu zbędnej aplikacji dostępna pamięć rośnie do 2 GB, a przerwy ustępują. Wynik uzasadnia sprawdzenie, czy stacja potrzebuje więcej RAM-u do tej pracy.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Adres linii i przesunięcie</span> <span class="deep-dive-badge">ARCHITEKTURA PAMIĘCI</span></summary>
<div class="deep-dive-content">

W modelu linii 64 B adres 150 należy do linii numer `150 / 64 = 2` (dzielenie całkowite), a przesunięcie to `150 % 64 = 22`. Linia obejmuje bajty 128 do 191. Adres 192 wymaga następnej. Wykorzystaj modulo z poprzedniego kursu i oblicz, ile linii obejmuje zakres od 190 do 193.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Rozdziel pojemność pamięci, czas dostępu oraz trwałość. Każdy parametr rozwiązuje inny problem.

