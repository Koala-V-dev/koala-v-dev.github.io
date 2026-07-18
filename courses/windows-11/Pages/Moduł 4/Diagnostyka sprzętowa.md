# Diagnostyka sprzętowa

By w pełni nazwać się informatykiem, musisz umieć poprawnie skonfigurować i przetestować komputer. Na koniec tego kursu pokażę Ci darmowe narzędzia diagnostyczne oraz to, jak na ich podstawie wykryłem i poprawiłem parę rzeczy we własnym komputerze.

---

## ⚙️ Diagnostyka ogólna (CPU-Z)

**CPU-Z** to mały program na Windowsa i Androida, który służy do identyfikacji podzespołów. Wyświetla szczegółowe parametry:
- procesora,
- płyty głównej oraz chipsetu,
- pamięci RAM (w tym fabrycznych profili SPD).

Dzięki niemu sprawdzisz parametry techniczne bez rozkręcania obudowy – program czyta dane prosto z układów na podzespołach.

> [!NOTE]
> **SPD** (*Serial Presence Detect* - seryjny odczyt danych o pamięci RAM) to niewielka pamięć ROM na każdym module RAM. Przechowuje zapisane przez producenta informacje o zalecanych taktowaniach, opóźnieniach i napięciach zasilania.

### ⚙️ Analiza procesora (zakładka CPU)

![CPU-Z Zakładka CPU](/public/courses/windows-11/Images/CPU-Z_CPU.png)

Ta zakładka pokazuje dokładny model procesora oraz gniazdo (**Socket**), w którym go zamontowano. Te dane ułatwiają wybór części przy modernizacji komputera.

- **Core Voltage (napięcie rdzenia):** Pokazuje aktualne napięcie zasilające rdzenie procesora w woltach ($\text{V}$). Płyta główna i system operacyjny regulują je dynamicznie pod wpływem obciążenia.

| Stan napięcia | Co oznacza? | Zachowanie systemu |
| :--- | :--- | :--- |
| **Niskie (w spoczynku)** | Poniżej $1.0 \text{ V} – 1.2 \text{ V}$. Procesor oszczędza energię. | Komputer działa cicho i wydziela mało ciepła. |
| **Wysokie (pod obciążeniem)** | $1.2 \text{ V} – 1.45 \text{ V}$. Procesor potrzebuje więcej mocy do szybszych obliczeń. | Temperatury rosną, a wentylatory przyspieszają. |
| **Zbyt niskie (Vdroop)** | Spadek napięcia przy nagłym skoku obciążenia. | Błędy systemu, nagłe restarty lub niebieski ekran (*BS***_OD_**). |
| **Zbyt wysokie (przevoltowanie)** | Złe ustawienia w BIOS-ie lub zbyt agresywny **_overclocking_**. | Ryzyko przegrzania procesora i skrócenia jego żywotności. |

- **Stepping i Revision (wersje procesora):** Określają wersję fizycznego układu krzemowego.
  * Te parametry to odpowiednik numeru wersji oprogramowania (jak przejście z 1.0 na 1.1). Producent usuwa w ten sposób błędy konstrukcyjne (w mikrokodzie) w kolejnych partiach produkcyjnych, co poprawia stabilność lub bezpieczeństwo bez zmiany nazwy modelu. Zrzut pokazuje rewizję `C0` (typowe dla 12. generacji).
 
> [!TIP]
> **Sortowanie krzemu (Binning):** Selekcja gotowych układów w fabryce. Wbrew niektórym opiniom, fabryka stara się wyprodukować wafle krzemowe o najwyższym standardzie (np. dążąc do Core i9). Po testach okazuje się jednak, że część rdzeni ma wady lub nie radzi sobie ze stabilną pracą na wysokim taktowaniu. Zamiast wyrzucać taki układ, producent blokuje uszkodzone rdzenie i sprzedaje go jako niższy model (np. Core i7 lub Core i5).

- **Max TDP (maksymalna moc cieplna):** Teoretyczny wskaźnik ilości ciepła w watach ($\text{W}$), jaką procesor wydziela pod typowym obciążeniem. 
  
  > [!NOTE]
  > **Waty ($\text{W}$) vs Wolty ($\text{V}$):** Wolty określają napięcie prądu docierającego do procesora. Waty to pobór mocy i wydzielane ciepło.
  
  W rzeczywistości poborem prądu zarządzają limity w BIOS-ie:
  * **PL1 (Power Limit 1):** Limit mocy utrzymywany długotrwale. Zazwyczaj odpowiada wartości TDP (np. $65 \text{ W}$). Procesor może pracować z tą mocą bez limitów czasowych.
  * **PL2 (Power Limit 2):** Chwilowy limit mocy (np. przez $28$ sekund do wartości $120 \text{ W}$). Umożliwia procesorowi krótkie przyspieszenie, np. podczas włączania aplikacji. Chłodzenie komputera dobiera się pod kątem wartości PL2.
- **Instructions (zestawy instrukcji):** Lista sprzętowych instrukcji obsługiwanych przez procesor. Określają one operacje matematyczne wykonywane bezpośrednio na poziomie procesora.

<details>
<summary>Najważniejsze zestawy instrukcji i ich rola</summary>

- **MMX**: Starszy zestaw rozkazów poprawiający obsługę dźwięku i grafiki.
- **SSE (wersje od 1 do 4.2)**: Rozwinięcie MMX. Przyspiesza obliczenia zmiennoprzecinkowe w grach, grafice 3D i kompresji wideo.
- **SSSE3**: Dodatkowe instrukcje usprawniające zarządzanie pamięcią podręczną.
- **EM64T**: Umożliwia pracę w systemach 64-bitowych i obsługę ponad 4 GB pamięci RAM.
- **AES**: Sprzętowa obsługa szyfrowania danych (np. BitLocker). Odciąża procesor przy zabezpieczaniu dysków.
- **AVX / AVX2**: Instrukcje przyspieszające obliczenia na dużych pakietach danych. Przydatne przy edycji wideo i symulacjach fizycznych, choć powodują mocniejsze nagrzewanie się układu.
- **AVX-VNNI**: Instrukcje optymalizujące działanie algorytmów sztucznej inteligencji (AI).
- **FMA3**: Pozwala na jednoczesne mnożenie i dodawanie danych w jednym cyklu zegara. Przyspiesza obliczenia wektorowe.
- **SHA**: Wspiera obliczanie sum kontrolnych i szyfrowanie oparte na algorytmie SHA.

</details>

---

### ⚙️ Płyta główna (zakładka Mainboard)

![CPU-Z Zakładka Mainboard](/public/courses/windows-11/Images/CPU-Z_Mainboard.png)

Zakładka **Mainboard** pokazuje parametry płyty głównej oraz połączenia między podzespołami.

- **Manufacturer & Model (producent i model):** Marka i model płyty głównej (na zrzucie: `Gigabyte B660 GAMING X AX DDR4`). Te dane ułatwią Ci pobranie sterowników i nowego BIOS-u ze strony producenta.
- **Chipset & Southbridge (Alder Lake / B660):** Układy zarządzające przepływem danych na płycie głównej:
  * _**Mostek północny (Northbridge):**_ Znajduje się w procesorze (tutaj: Alder Lake). Łączy najszybsze komponenty: pamięć RAM i kartę graficzną.
  * _**Mostek południowy (Southbridge):**_ Chipset na płycie głównej (tutaj: B660). Odpowiada za wolniejsze połączenia: porty USB, dyski SATA, karty sieciowe i dźwiękowe.
- **LPCIO (Super I/O):** Układ na płycie głównej (tutaj: ITE IT8689). Monitoruje wentylatory, temperatury i napięcia. Z tego układu aplikacje diagnostyczne czerpią informacje o pracy komputera.
- **BIOS Version (wersja BIOS), Date (data) i CPU Microcode (mikrokod procesora):**
  * _**BIOS Version (F34) i Date (12/02/2025):**_ Wersja oprogramowania sterującego płytą główną oraz data jego wydania. Aktualizacja BIOS-u eliminuje błędy stabilności i kompatybilności, np. z pamięcią RAM.
  * _**CPU Microcode (0x3A):**_ Mikropoprawki błędów wczytywane do procesora przy uruchamianiu komputera. Działa to jak łatka usuwająca fabryczne niedociągnięcia krzemu. Nowy mikrokod jest zazwyczaj częścią aktualizacji BIOS-u.
- **Graphic Interface (Interfejs graficzny):**
  * _**Link Width (szerokość złącza):**_ Liczba aktywnych linii dla karty graficznej. Zrzut pokazuje `x16` (aktualna) / `x16` (maksymalna). Karta korzysta z pełnej szerokości złącza.
  * _**Link Speed (prędkość złącza):**_ Aktualna prędkość magistrali to `2.5 GT/s` (PCIe 1.1), mimo że maksymalna wynosi `16.0 GT/s` (PCIe 4.0). Płyta główna spowalnia złącze na pulpicie, żeby oszczędzać prąd. Pełna prędkość powróci automatycznie, gdy tylko uruchomisz grę.

---

### ⚖️ Pamięć RAM (zakładki Memory i SPD)

Pamięć RAM bywa ustawiona wolniej, niż pozwalają na to jej parametry fabryczne. Porównując te dwie zakładki, łatwo sprawdzisz, czy komputer korzysta z pełnej wydajności RAM-u.

#### 📊 Zakładka Memory (parametry bieżące)
![CPU-Z Zakładka Memory](/public/courses/windows-11/Images/CPU-Z_Memory.png)

- **DRAM Frequency (rzeczywista częstotliwość):** Na zrzucie to $1596.1 \text{ MHz}$. Współczesne kości działają w technologii **DDR** (*Double Data Rate*). Oznacza to przesyłanie dwóch pakietów danych w jednym cyklu zegara (na zboczu wznoszącym oraz opadającym sygnału). Rzeczywistą szybkość przesyłu określa się w **$\text{MT/s}$** (megatransferach na sekundę) i wynosi ona dwukrotność częstotliwości DRAM:
  $$1596.1 \text{ MHz} \times 2 \approx 3200 \text{ MT/s}$$
  *Uwaga: W sklepach ta wartość jest często błędnie oznaczana jako $\text{MHz}$.*
- **CAS# Latency (CL):** Opóźnienie pamięci, czyli czas (w cyklach zegara) od żądania danych do rozpoczęcia ich wysyłania. Na zrzucie to $16$ cykli.

| Standard RAM | <span style="text-wrap: nowrap;">Szybkość ($\text{MT/s}$)</span> | Ocena opóźnienia CAS Latency (CL) | Komentarz |
|:-:|---|---|---|
| _**DDR4**_ | <span style="text-wrap: nowrap;">$2133 - 4000$</span> | <span style="text-wrap: nowrap;">CL14 - CL16: **Bardzo dobre**</span> <br>CL18 - CL19: *Standardowe* <br>CL22 i więcej: **_Słabe_** | Najpopularniejszy standard. Wartości powyżej $3200\text{ MT/s}$ wymagają włączenia drugiego profilu XMP/EXPO. |
| _**DDR5**_ | <span style="text-wrap: nowrap;">$4800 - 8400$</span> | <span style="text-wrap: nowrap;">CL28 - CL32: **Bardzo dobre**</span> <br>CL36 - CL40: *Standardowe* <br>CL46 i więcej: **_Słabe_** | Najnowsza generacja. Wyższe opóźnienia CL są równoważone przez znacznie wyższe taktowanie. |

<details>
<summary>Tabela porównawcza CL dla pozostałych standardów RAM</summary>

| Standard RAM | <span style="text-wrap: nowrap;">Szybkość ($\text{MT/s}$)</span> | Ocena opóźnienia CAS Latency (CL) | Komentarz techniczny |
|---|---|---|---|
| _**SDRAM**_ | $66 - 133$ | CL2: **Bardzo dobre** <br> CL3: *Standardowe* | Przesyła dane raz na cykl zegara. Wyższe wartości CL wtedy nie istniały. |
| _**DDR**_ (DDR1) | $200 - 400$ | CL2 - CL2.5: **Bardzo dobre** <br> CL3: *Standardowe* | Pierwsza generacja podwajająca transfer (Double Data Rate). |
| _**DDR2**_ | $400 - 1066$ | CL3 - CL4: **Bardzo dobre** <br> CL5 - CL6: *Standardowe* <br> CL7 i więcej: **_Słabe_** | Wzrost taktowań kosztem wyższych opóźnień CL. |
| _**DDR3**_ | <span style="text-wrap: nowrap;">$800 - 2133$</span> | <span style="text-wrap: nowrap;">CL7 - CL9: **Bardzo dobre**</span> <br> CL10 - CL11: *Standardowe* <br> CL13 i więcej: **_Słabe_** | Standard używany m.in. w procesorach Intel Core od 2. do 4. generacji. |

</details>

#### 🗃️ Zakładka SPD (parametry fabryczne kości)
![CPU-Z Zakładka SPD](/public/courses/windows-11/Images/CPU-Z_SPD.png)

- **Timings Table (tabela opóźnień):** Pokazuje gotowe profile działania zapisane przez producenta w pamięci kości RAM. Zrzut prezentuje 4 profile:
  * **JEDEC #8 i JEDEC #9:** Bezpieczne, standardowe profile o szybkości $2400\text{ MT/s}$ ($1200\text{ MHz} \times 2$) przy niskim napięciu $1.20 \text{ V}$. Bez włączonego profilu XMP w BIOS-ie pamięć zwolniłaby do tych wartości.
  * **XMP-3204:** Profil XMP o szybkości **$3200\text{ MT/s}$** ($1602\text{ MHz} \times 2$) przy napięciu $1.350 \text{ V}$ i opóźnieniu CL16. Z tego profilu korzysta teraz testowany komputer (co potwierdza zakładka Memory).
  * **XMP-3602:** Maksymalny profil XMP o szybkości **$3600\text{ MT/s}$** ($1801\text{ MHz} \times 2$) przy napięciu $1.350 \text{ V}$ i opóźnieniu CL18.

#### ❓ Czym różnią się profile RAM?
* **JEDEC:** Standardowe, bezpieczne ustawienia. Zapewniają bezproblemowy rozruch komputera zaraz po złożeniu.
* **XMP (Extreme Memory Profile):** Profile szybsze (fabryczne podkręcanie) stworzone przez Intela. Trzeba je włączyć w BIOS-ie. Działają przy wyższym napięciu (np. $1.35\text{ V}$ zamiast $1.20\text{ V}$).
* **EXPO:** Odpowiednik profilu XMP opracowany przez AMD.

#### ⚠️ Dlaczego szybsza praca pamięci nie jest włączona domyślnie?
1. **Stabilny rozruch:** Płyta główna przy pierwszym włączeniu zawsze uruchamia kości w podstawowym trybie **JEDEC**. Chodzi o to, by komputer w ogóle wystartował.
2. **Możliwości kontrolera (IMC):** Kontroler pamięci wbudowany w procesor (IMC) bywa wąskim gardłem przy wysokich taktowaniach. Stabilność zależy w dużej mierze od liczby zajętych gniazd.
3. **Kwestia gwarancji i overclockingu:** Korzystanie z profilu XMP/EXPO wykracza poza standard JEDEC i z punktu widzenia producentów jest traktowane jako podkręcanie sprzętu.

#### 🪤 Pułapka liczby kości RAM (2 vs 4 moduły)
Panuje przekonanie, że obsadzenie wszystkich czterech gniazd pamięci to świetny sposób na rozbudowę. W rzeczywistości to spore wyzwanie dla stabilności komputera.

Schemat poniżej przedstawia fizyczny układ połączeń (magistralę Daisy Chain) na płycie głównej. Pokazuje, jak sygnał z procesora (IMC) dociera do poszczególnych slotów:

![Schemat kanałów slotów RAM względem CPU](/public/courses/windows-11/Images/Schemat-kanałów-slotów-RAM-względem-CPU.png)

#### Sposób podłączenia a stabilność systemu:

1. **Zalecana konfiguracja (2 kości w slotach 2 i 4):**
   * Kości instaluje się w gniazdach **A2** i **B2** (na samym końcu linii sygnałowej, tuż przed fizycznymi terminatorami).
   * Sygnał elektryczny z procesora (IMC) płynie przez puste sloty A1/B1 (które działają wtedy jedynie jako pasywne „przelotki” na ścieżce) bezpośrednio do kości w A2/B2.
   * Na końcu linii znajduje się odbiornik (kości RAM), a zaraz za nim rezystor terminujący. Dzięki temu terminator w pełni pochłania resztki energii sygnału. Unikamy w ten sposób odbić (echa i szumu), co gwarantuje stabilną pracę pamięci na ich maksymalnym taktowaniu.

2. **Błędna konfiguracja (2 kości w slotach 1 i 3):**
   * Kości trafiają do gniazd **A1** i **B1** (w środku linii), a gniazda końcowe A2 i B2 pozostają puste.
   * Sygnał dociera do kości w A1/B1, ale biegnie też wolnymi ścieżkami na płycie w kierunku pustych gniazd.
   * Brak aktywnego odbiornika na końcu pogarsza dopasowanie impedancji – terminator nie pochłania fali w całości. Część sygnału odbija się od pustego końca i wraca jako echo, nakładając się na oryginalny sygnał w slotach A1/B1 oraz na kontrolerze (IMC). Prowadzi to do zakłóceń i niestabilności pamięci przy wyższych częstotliwościach.

> [!NOTE]
> **Impedancja (opór pozorny)** – to odpowiednik oporu elektrycznego, ale dla sygnałów szybkozmiennych.
> Choć zasilacz dostarcza prąd stały (DC), to sygnały przesyłające dane (np. zegar magistrali RAM) są ciągiem impulsów o częstotliwościach rzędu gigaherców ($\text{GHz}$). Przy takich prędkościach ścieżki na płycie głównej zachowują się jak linie transmisyjne, a prąd przybiera charakterystykę fali wysokiej częstotliwości. Dlatego zamiast zwykłego oporu (rezystancji) musimy brać pod uwagę **impedancję**, która uwzględnia również pojemność i indukcyjność przewodów.

3. **Konfiguracja z 4 kośćmi (wszystkie sloty zajęte):**
   * Sygnał w każdym kanale biegnie szeregowo przez oba moduły (z IMC przez A1 do A2).
   * Dwa aktywne odbiorniki na jednej linii oznaczają dwukrotny wzrost obciążenia pojemnościowego dla kontrolera pamięci (IMC). Impulsy cyfrowe narastają i opadają wolniej (to tzw. diagram oczkowy).
   * Dodatkowo każda kość stanowi punkt skoku impedancji, co wywołuje kolejne odbicia sygnału (echo) krążące między gniazdem A1 a A2.
   * Przy takich zakłóceniach kontroler IMC ma problem z zachowaniem stabilności przy wysokich częstotliwościach (np. $3600\text{ MT/s}$).

#### Wniosek dla naszego przykładu:
Kości z przykładu mają fabryczny profil XMP na **$3600\text{ MT/s}$** (XMP-3602). Ponieważ jednak komputer ma zajęte wszystkie 4 sloty ($4 \times 8 \text{ GB}$), stabilne działanie z tą prędkością byłoby loterią.
W BIOS-ie włączono więc bezpieczniejszy i w pełni stabilny profil **XMP-3204 ($3200\text{ MT/s}$)**. To najlepszy kompromis gwarantujący stabilną pracę przy pełnym obsadzeniu płyty.

### 🛠️ Punkt Kontrolny: Konfiguracja pamięci RAM
<data-gate>
  <data-quiz>
    <question>Dlaczego po zainstalowaniu 4 modułów pamięci RAM DDR4 oznaczonych jako $3600\text{ MT/s}$ płyta główna może automatycznie uruchomić je z niższą prędkością (np. $2400\text{ MT/s}$ lub $3200\text{ MT/s}$)?</question>
    <options>
      <item correct>Obsadzenie wszystkich 4 gniazd zwiększa obciążenie pojemnościowe kontrolera pamięci (IMC) oraz wywołuje odbicia sygnału (echo) na magistrali Daisy Chain, co utrudnia stabilną pracę na najwyższym taktowaniu.</item>
      <item>Standard JEDEC fizycznie zabrania działania pamięci z prędkością wyższą niż $2400\text{ MT/s}$ przy 4 modułach z powodu zbyt wysokiego poboru energii.</item>
      <item>Procesory 12. generacji obsługują wyłącznie konfiguracje dwukanałowe (Dual Channel) i wyłączają drugą parę kości w celu zapobieżenia awarii systemu.</item>
    </options>
    <div data-hint="error">
      Zastanów się nad fizyką sygnałów szybkozmiennych. Czy kontroler pamięci w procesorze (IMC) ma łatwiejszą pracę, gdy musi obsłużyć dwa moduły na końcu linii transmisyjnej, czy cztery?
    </div>
    <div data-hint="success">
      Świetnie! Dwa moduły w slotach A2 i B2 to optymalne obciążenie i czysty sygnał. Cztery kości to duże wyzwanie dla IMC i ryzyko niestabilności przy agresywnych profilach XMP.
    </div>
  </data-quiz>
</data-gate>

---

## Diagnostyka karty graficznej (GPU-Z)

**GPU-Z** służy do sprawdzania parametrów kart graficznych (NVIDIA, AMD, Intel). Odczytuje dane układu (GPU), pamięci wideo (VRAM) i na bieżąco monitoruje parametry pracy.

### ⚙️ Parametry karty (zakładka Graphics Card)

![GPU-Z Graphics Card](/public/courses/windows-11/Images/GPU-Z_Graphics_Card.png)

- **Bus Interface (interfejs magistrali):** Pokazuje wersję i szerokość linii magistrali PCI-Express (PCIe), z których korzysta karta.
  * **W spoczynku:** Zrzut pokazuje `PCIe x16 4.0 @ x16 1.1`. Karta obsługuje standard PCIe 4.0, ale na pulpicie przełącza się w tryb 1.1, żeby oszczędzać energię.
  * **Pod obciążeniem:** Kliknij znak zapytania (`?`) obok tej opcji i uruchom wbudowany `Render Test`. Wartość powinna skoczyć do nominalnej (np. `@ x16 4.0`).  
  **_nie zaznaczaj tego checkboxa:_** _**Render in full-screen (for CrossFire / SLI)**_. Te opcje dotyczą starych systemów łączenia kilku kart w jeden układ.

  ![GPU-Z okno Render Test](/public/courses/windows-11/Images/GPU-Z_render_test.png)
  
  > [!IMPORTANT]
  > Test działa w nieskończonej pętli, bo ma stale obciążać kartę podczas diagnostyki. Gdy zobaczysz, że `Bus Interface` zmieniło się na docelową wartość (np. `@ x16 4.0`), możesz po prostu zamknąć okno testowe.
  
  > [!TIP]
  > **Co jeśli karta nie osiąga nominalnej prędkości?**
  > 1. *Zły slot PCIe:* Karta trafiła do dolnego slotu płyty głównej, który ma mniej linii (np. x4 zamiast x16) lub obsługuje starszą wersję PCIe. Kartę zawsze montuj w najwyższym slocie, najbliżej procesora.
  > 2. *Dzielenie linii (Lane Sharing):* Szybki dysk SSD M.2 NVMe współdzieli linie z gniazdem karty, co obcina pasmo GPU o połowę (np. do x8).
  > 3. *Opadanie karty (GPU Sag) lub zabrudzenie styków:* Ciężka karta mogła delikatnie wysunąć się ze złącza i stracić kontakt na skrajnych pinach. Wyjmij ją, przeczyść styki alkoholem izopropylowym (IPA) i zamontuj ponownie, najlepiej z podpórką."

- **Resizable BAR (ReBAR):** Daje procesorowi bezpośredni dostęp do całej pamięci VRAM karty graficznej.
  * **Jak to działa:** Bez ReBAR procesor komunikuje się z pamięcią karty przez małe bloki o wielkości $256\text{ MB}$ (Base Address Register). Resizable BAR znosi ten limit. Tekstury i geometria przesyłane są szybciej, co w grach daje dodatkowe $5 - 15\\%$ wydajności i zmniejsza przycięcia (stuttering).
  * **Stan na zrzucie:** Pole **Resizable BAR** pokazuje **Disabled** (Wyłączone). Aby je włączyć, musisz w BIOS-ie płyty aktywować _**Above 4G Decoding**_ oraz _**ReBAR Support**_ (u AMD ta funkcja nazywa się *SAM* – *Smart Access Memory*).
  
  > [!WARNING]
  > **Czyste UEFI i pułapka z trybem CSM (MBR vs GPT):**
  > ReBAR ruszy tylko w czystym trybie UEFI. Funkcja **CSM (Compatibility Support Module) / Legacy Boot** musi być wyłączona.
  > 
  > **Uwaga na blokadę startu systemu:**
  > Jeśli Windows był instalowany ze starym trybem CSM, Twój dysk ma układ partycji **MBR** zamiast nowszego **GPT**. Gdy po prostu wyłączysz CSM w BIOS-ie, **komputer nie wykryje dysku startowego i Windows się nie uruchomi**.
  > 
  > Jak bezpiecznie odpalić ReBAR:
  > 1. Sprawdź w *Zarządzaniu dyskami*, czy dysk systemowy ma styl **GPT**.
  > 2. Jeśli widzisz **MBR**, zrób najpierw konwersję do GPT narzędziem `mbr2gpt` (z poziomu wiersza poleceń) lub najlepiej zainstaluj system na nowo w trybie UEFI.
  > 3. Dopiero gdy system działa w czystym trybie UEFI (GPT), wejdź do BIOS-u, **wyłącz CSM** i włącz **Above 4G Decoding** oraz **Resizable BAR**.

  > [!NOTE]
  > **Efekt poprawnej konfiguracji w BIOS-ie:**
  > Poniższy zrzut pokazuje system po zmianach:
  > 1. W BIOS-ie włączono _**Above 4G Decoding**_, _**Above 4GB MMIO BIOS assignment** _oraz _**Re-Size BAR Support**_.
  > 2. GPU-Z pokazuje status **Resizable BAR: Enabled** (Włączone).
  > 3. Na zrzucie (zrobionym podczas testu obciążeniowego) magistrala działa z pełną prędkością **PCIe x16 4.0 @ x16 4.0**.

  ![GPU-Z Resizable BAR Enabled](/public/courses/windows-11/Images/GPU-Z_ResizableBAR_Włączenie.png)

- **Memory Size & Bus Width (Pojemność i szyna pamięci):**
  * **Memory Size (Pojemność):** Karta ma $12288\text{ MB}$ ($12\text{ GB}$) pamięci wideo (VRAM).
  * **Bus Width (Szerokość szyny pamięci):** Szyna danych między rdzeniem GPU a pamięcią VRAM ma szerokość **$192\text{ bit}$**. Dla kości GDDR6 od Hynixa daje to przepustowość (*Bandwidth*) rzędu **$360.0\text{ GB/s}$**.
  
  > [!NOTE]
  > **Przepustowość pamięci (Bandwidth):**
  > Szerokość szyny to jak liczba pasów na drodze, a taktowanie pamięci – jak prędkość aut. Karta z wąską szyną (np. **$128\text{-bit}$**) bywa wąskim gardłem w rozdzielczościach **$1440p/4K$**. Nawet duża pojemność (np. **$16\text{ GB}$** VRAM) nie pomoże, jeśli szyna nie nadąży z przesyłaniem danych.

---

### 🌡️ Czujniki temperatury i pracy (zakładka Sensors)

![GPU-Z Sensors](/public/courses/windows-11/Images/GPU-Z_Sensors.png)

- **GPU Temperature vs Hot Spot (temperatura średnia a najgorętszy punkt):**
  * *GPU Temperature:* Średnia z czujników w rdzeniu. Zrzut pokazuje **$46.0^\circ\text{C}$** w spoczynku. Tę wartość zobaczysz w Menedżerze zadań Windows.
  * *GPU Hot Spot Temperature:* Temperatura z najgorętszego punktu rdzenia krzemowego. Na zrzucie to **$56.1^\circ\text{C}$**.
  
  | Różnica (GPU vs Hot Spot) | Co oznacza? |
  | :--- | :--- |
  | **Do $15^\circ\text{C}$ – $20^\circ\text{C}$**<br><span style="font-size: 0.8em; text-wrap: nowrap">*(na zrzucie: $10.1^\circ\text{C}$)*</span> | Chłodzenie dolega prawidłowo, pasta działa bez zarzutu. |
  | <span style="text-wrap: nowrap">**Powyżej $25^\circ\text{C}$ - $30^\circ\text{C}$**</span> | Słaby odbiór ciepła. Pasta mogła wyschnąć, ulec wypompowaniu (*pump-out effect*) albo docisk radiatora jest nierównomierny. Czas na wymianę pasty i termopadów. |

- **Fan Speed (prędkość wentylatorów):** Prędkość obrotowa wentylatorów (w $\\%$ i RPM).
  * Zrzut podaje **$0\\%$ (0 RPM)** dla obu wentylatorów. Dzisiejsze karty chłodzone są **półpasywnie** – wentylatory stoją w miejscu podczas lekkiej pracy na pulpicie i ruszają dopiero po przekroczeniu np. $55-60^\circ\text{C}$ na rdzeniu.

- **Board Power Draw (pobór prądu karty):** Całkowity pobór mocy przez całą konstrukcję w watach ($\text{W}$).
  * Zrzut pokazuje **$19.5\text{ W}$** w spoczynku, z czego sam rdzeń (**GPU Chip Power Draw**) bierze tylko **$5.6\text{ W}$**. Reszta idzie na VRAM, wentylatory, podświetlenie i sekcję zasilania. Ta wartość pozwala ocenić zapas mocy zasilacza.
  
  > [!NOTE]
  > **Skąd karta bierze prąd?**
  > 1. **Slot PCIe płyty głównej:** Zasila kartę mocą do **$75\text{ W}$**.
  > 2. **Dodatkowe złącza zasilania (PEG):** Wtyczki $6\text{-pin}$ (dają do **$75\text{ W}$**), $8\text{-pin}$ (do **$150\text{ W}$**) lub nowsze standardy typu $12\text{VHPWR}$ / $12\text{V}-2\times6$ (nawet do **$600\text{ W}$**).
  > Taka karta pobierająca pod obciążeniem np. **$250\text{ W}$** wymaga wpięcia odpowiednich kabli prosto z zasilacza.

---

### 🔍 Informacje zaawansowane (zakładka Advanced)

W zakładce **Advanced** sprawdzisz parametry sterownika, limity sprzętowe i szczegółowy stan podłączonych monitorów.

#### ⚡ 1. Limity mocy i temperatur (sekcja General / Power Limit)
![GPU-Z Advanced - Limity](/public/courses/windows-11/Images/GPU-Z_Advanced_1.png)

- **Power Limit (limit mocy):** W sekcji *General* program pokazuje fabryczne i dopuszczalne limity zasilania rdzenia GPU.
  * Zrzut pokazuje wartość domyślną **Default ($100.0\\%$)** oraz maksymalną **Maximum ($124.7\\%$)**. W programach do podkręcania (np. MSI Afterburner) limit mocy można zwiększyć o te **$24.7\\%$** ponad fabrykę (zakres regulacji sięga od $-41\\%$ do $+25\\%$).
  * **Tuning:** Obniżenie limitu mocy (np. do $85\\%$) to prosty sposób na redukcję temperatur i poboru prądu.
  * **Temperature Limit:** Domyślny próg temperatury wynosi **Current $83.0^\circ\text{C}$**. Po jego przekroczeniu karta zacznie spowalniać taktowanie rdzenia (*thermal throttling*), żeby się nie przegrzać. Maksymalny próg, jaki można ustawić, to **$90.0^\circ\text{C}$**.

#### 🖥️ 2. Parametry podłączonych monitorów (sekcja General / Monitor)
Przewijając sekcję *General*, sprawdzisz parametry podłączonych ekranów:

##### Monitor 1 (DisplayPort)
![GPU-Z Advanced - Monitor 1](/public/courses/windows-11/Images/GPU-Z_Advanced_2.png)

- **Połączenie i linie sygnałowe:** Ekran podłączony jest przez **DisplayPort**. Karta wynegocjowała 2 linie sygnałowe z 4 możliwych (`Lanes (current) 2` / `Lanes (max) 4`).
- **Link Rate i parametry obrazu:** Prędkość łącza to **$2.7 Gbps$**, a głębia kolorów wynosi **$8\text{-bit}$ RGB**. Te dane pomagają wykryć, dlaczego monitor $4\text{K}$ odświeża się np. w $30\text{ Hz}$ zamiast $60\text{ Hz}$ – winny jest zazwyczaj kiepski kabel, który nie pozwala na pracę na maksymalnej liczbie linii.

##### Monitor 2 (HDMI)
![GPU-Z Advanced - Monitor 2](/public/courses/windows-11/Images/GPU-Z_Advanced_3.png)

- **Złącze HDMI:** Drugi ekran podpięty jest kablem **HDMI**.
- **Obsługa głębi barw i HDR:** Karta i porty obsługują obraz **$8\text{-bit}$**, **$10\text{-bit}$** oraz **$12\text{-bit}$** w przestrzeniach barwnych **RGB444**, **YCbCr444** i **YCbCr422**. Sam parametr **HDR** ma jednak status **N/A** (Not Available) – oznacza to, że ten monitor nie obsługuje wyświetlania o szerokiej rozpiętości tonalnej lub funkcja ta jest wyłączona w ustawieniach systemu Windows.

### 🛠️ Punkt Kontrolny: Włączanie Resizable BAR
<data-gate>
  <data-quiz>
    <question>Użytkownik włączył w BIOS-ie funkcję Resizable BAR, jednak program GPU-Z nadal pokazuje status `Disabled`. Komputer ma tylko jeden dysk NVMe. Co może być przyczyną?</question>
    <options>
      <item correct>System Windows został zainstalowany w starym trybie rozruchu CSM (Legacy) z partycjonowaniem dysku MBR, a ReBAR wymaga czystego UEFI i tablicy partycji GPT.</item>
      <item>Karta graficzna została zamontowana w pierwszym gnieździe PCIe płyty głównej (najbliżej CPU), co zablokowało bezpośredni dostęp procesora do pamięci VRAM.</item>
      <item>System operacyjny to 64-bitowy Windows 11, który ze względów bezpieczeństwa domyślnie blokuje funkcję ReBAR dla dysków NVMe.</item>
    </options>
    <div data-hint="error">
      Przypomnij sobie, w jakim środowisku rozruchowym (BIOS/CSM czy czyste UEFI) działa funkcja Resizable BAR oraz jak styl partycjonowania dysku (MBR vs GPT) wpływa na możliwość uruchomienia systemu po wyłączeniu CSM.
    </div>
    <div data-hint="success">
      Zgadza się! Wyłączenie CSM w BIOS-ie jest niezbędne do działania ReBAR, ale bez wcześniejszej konwersji dysku z MBR na GPT system po prostu się nie uruchomi.
    </div>
  </data-quiz>
</data-gate>

---

## Diagnostyka i testowanie dysków SSD (CrystalDiskInfo & CrystalDiskMark)

Do sprawdzania i testowania dysków SSD lub HDD służą dwa bezpłatne programy z rodziny **CrystalDisk**:
1. **CrystalDiskInfo:** Szybko odczytuje parametry _**S.M.A.R.T.**_, ogólny stan zdrowia dysku oraz jego temperaturę.
2. **CrystalDiskMark:** Testuje prędkości odczytu i zapisu (sekwencyjne oraz losowe).

---

### 📥 1. Wybór wersji i pobieranie

Na stronie pobierania ([crystalmark.info](https://crystalmark.info/en/download/#CrystalDiskInfo)) znajdziesz kilka wariantów programu:
* **Edycje wizualne (skórki):** Pod maską wszystkie wersje są identyczne. **Standard Edition** to klasyczny wygląd Windowsa. Edycje tematyczne (np. **Shizuku Edition**, **Kurei Kei Edition** czy wersja partnerska z **MSI**) mają tła w stylu anime i niestandardowe ikony. Niektóre z nich odtwarzają komunikaty głosowe przy ostrzeżeniach o stanie dysku. 😁
* **Wersja przenośna (Portable ZIP):** Zamiast instalatora wybierz paczkę **ZIP (Portable)**. Takie programy działają bez instalacji w systemie – rozpakowujesz archiwum i od razu uruchamiasz. Oszczędzasz w ten sposób rejestr Windowsa przed zbędnymi wpisami.

---

### 🩺 2. Ocena kondycji dysku (CrystalDiskInfo)

Jako przykładu użyjemy dwóch dysków NVMe pracujących w tym samym komputerze: **Lexar SSD NM790 4TB** (dysk systemowy PCIe Gen4) oraz **IR-SSDPR-P34B-02T-80** (Goodram IRDM 2TB, dodatkowy dysk PCIe Gen3).

#### Dysk C: Lexar SSD NM790 4TB (Systemowy dysk PCIe Gen4)
![CrystalDiskInfo Lexar](/public/courses/windows-11/Images/CristalDiskInfo-MSI-Lexar.png)

#### Dysk D: Goodram IRDM 2TB (Pomocniczy dysk PCIe Gen3)
![CrystalDiskInfo IRDM](/public/courses/windows-11/Images/CristalDiskInfo-MSI-IR.png)

Program wyciąga parametry _**S.M.A.R.T.**_ (*Self-Monitoring, Analysis and Reporting Technology*) bezpośrednio z wbudowanego kontrolera. Zestawienie tych dwóch modeli dobrze pokazuje różnice technologiczne:

* **Stan zdrowia (Health Status):**
  * *Lexar (Dysk C):* Pokazuje **Good ($100\\%$)**. Dysk jest świeży i zapisał niewiele terabajtów.
  * *Goodram (Dysk D):* Wskazuje **Good ($92\\%$)**. Komórki pamięci flash w dyskach SSD zużywają się przy każdym zapisie danych. Te $8\\%$ ubytku to normalny ślad użytkowania. Wartości powyżej $80-90\\%$ nie powinny martwić. Kopię zapasową i wymianę dysku planuj dopiero wtedy, gdy stan spadnie poniżej **$50\\%$** lub program zgłosi status **_„Coution”_** lub **_„Bad”_**.
* **Suma zapisów hosta (Total Host Writes):** Pokazuje łączną ilość danych zapisaną od nowości.
  * *Lexar:* Zapisał **$5660\text{ GB}$** (ok. $5.6\text{ TB}$) w ciągu **$1351$** godzin pracy.
  * *Goodram:* Przetworzył już **$45620\text{ GB}$** (ok. $45.6\text{ TB}$) przez **$9627$** godzin (czyli ponad rok ciągłego działania). Ta różnica w zużyciu tłumaczy spadek zdrowia starszego Goodrama do **$92\\%$**.
* **Wersja standardu i szyny (Transfer Mode):**
  Pokazuje interfejs, z którego aktualnie korzysta dysk, w formacie: `Bieżący tryb | Tryb maksymalny`.
  
  Tabela poniżej przedstawia maksymalne realne prędkości dla konfiguracji z czterema liniami (x4) w zależności od generacji złącza:

  | Generacja magistrali | Maksymalny odczyt | Maksymalny zapis |
  |:-:|---|---|
  | **PCIe 3.0 x4** | ok. $3500\text{ MB/s}$ | ok. $3000\text{ MB/s}$ |
  | **PCIe 4.0 x4** | ok. $7500\text{ MB/s}$ | ok. $7000\text{ MB/s}$ |
  | **PCIe 5.0 x4** | ok. $14000\text{ MB/s}$ | ok. $12000\text{ MB/s}$ |

  * *Lexar (Dysk C):* Działa w trybie **PCIe 4.0 x4**. Został zamontowany w pierwszym, górnym slocie M.2 podłączonym bezpośrednio do linii procesora (CPU), co pozwala na pełne wykorzystanie przepustowości Gen4.
  * *Goodram (Dysk D):* Działa w trybie **PCIe 3.0 x4**. Umieszczono go w dolnym slocie M.2 obsługiwanym przez chipset płyty głównej. Złącze to idealnie pasuje do możliwości tej generacji dysku.
* **Temperatura i fizyczny radiator:**
  * *Lexar (Dysk `C:`):* Wskazuje **$56^{\circ}\text{C}$** w spoczynku. Dyski PCIe Gen4 z protokołem NVMe 2.0 pobierają więcej prądu i mocno się grzeją. Na płycie głównej z naszego przykładu (*Gigabyte B660 Gaming X*) producent dodał fabryczny radiator (*M.2 Thermal Guard*) na najwyższym slocie M.2 pod procesorem. To tam siedzi dysk *`C:`*. Radiator trzyma temperatury w ryzach – bez niego dysk z Windowsem w tle szybko dobijałby do $65 - 70^{\circ}\text{C}$ już w spoczynku.
  * *Goodram (Dysk `D:`):* Trzyma chłodne **$30^{\circ}\text{C}$**. Starsze konstrukcje Gen3 nie generują tyle ciepła. Zazwyczaj lądują w dolnych slotach płyty głównej, które bywają zasłonięte przez kartę graficzną i często nie mają fabrycznych radiatorów. Przy tak niskiej emisji ciepła brak dodatkowego chłodzenia w niczym nie przeszkadza. 😎

> [!NOTE]
> **Co tu klikać?**
> CrystalDiskInfo służy tylko do odczytu danych. Nie uruchomisz tu żadnych testów obciążeniowych (do tego służy CrystalDiskMark). Warto jednak przestawić trzy opcje w menu:
> 1. **Function -> Advanced Function -> RAW Values -> 10 [DEC]:** Przełączy wartości w tabeli z systemu szesnastkowego (HEX) na dziesiętny (DEC). Dzięki temu łatwo odczytasz realną liczbę błędów czy nagłych wyłączeń dysku.
> 2. **Function -> Startup:** Program będzie startował razem z Windowsem i pilnował temperatur w tle (zobaczysz je w zasobniku systemowym obok zegarka).
> 3. **Function -> Auto Refresh:** Domyślnie dane odświeżają się co 10 minut. Możesz ustawić inne wartości.


---

### 🧪 3. Testowanie wydajności (CrystalDiskMark)

Porównanie obu szyn w praktyce dobrze pokazują poniższe testy (wykonane przy parametrach: $3$ próby, próbka $1\text{ GiB}$):

#### Dysk C: Lexar SSD NM790 4TB (PCIe Gen4 x4)
![CrystalDiskMark Lexar C](/public/courses/windows-11/Images/ClristalDiskMark-MSI-Lexar-wolumin-C.png)

#### Dysk D: Goodram IRDM 2TB (PCIe Gen3 x4)
![CrystalDiskMark IRDM D](/public/courses/windows-11/Images/ClristalDiskMark-MSI-IR-wolumin-D.png)

**Jak bezpiecznie przetestować dysk?**
Przed kliknięciem któregokolwiek przycisku, przygotuj się:
1. **Ustawienia na górnym pasku:**
   * **Liczba przebiegów:** Zmień na **$3$**. Domyślne $5$ przebiegów zbędnie obciąża i zużywa pamięć flash, a $3$ próby dają w pełni wiarygodny wynik.
   * **Rozmiar pliku testowego:** Ustaw **$1\text{ GiB}$**.
   * **Wybór dysku:** Upewnij się, że testujesz właściwą partycję (rozwiń listę i wybierz np. `C:` lub `D:`).
2. **Wyłącz programy w tle:** Wyłącz gry, przeglądarki i wstrzymaj pobieranie (np. na Steamie czy Epic Games). Ruch na dysku w tle zepsuje pomiary i zaniży wyniki.
3. **Start:** Kliknij zielony przycisk <kbd class="win-menu-btn">All</kbd> w lewym górnym rogu. Całość zajmie około $2 - 3$ minut.

> [!WARNING]
> **Nie testuj dysku bez potrzeby**
> Każdy test w CrystalDiskMark zapisuje na dysku od kilku do kilkunastu gigabajtów danych testowych. SSD mają ograniczony limit zapisu (**TBW**). Okazjonalna weryfikacja parametrów w niczym nie zaszkodzi, ale powtarzanie benchmarku w nieskończoność skraca żywotność pamięci.

#### Kluczowe parametry w tabeli wyników:
* **SEQ1M [Q8T1] (Odczyt/Zapis sekwencyjny):** Odpowiada za transfer dużych plików, np. filmów, instalatorów czy kopii zapasowych.
  * *Lexar (Dysk C - Gen4):* Wyciąga **$7095.85 \text{ MB/s}$** przy odczycie i **$6591.64 \text{ MB/s}$** przy zapisie. To wartości bliskie maksimum dla standardu PCIe Gen4.
  * *Goodram (Dysk D - Gen3):* Osiąga **$3451.51 \text{ MB/s}$** (odczyt) i **$3070.81 \text{ MB/s}$** (zapis). W pełni wykorzystuje możliwości złącza PCIe Gen3.
  * _**Co z tego wynika w praktyce?**_ Kopiując pojedynczy plik o wadze $100\text{ GB}$ (np. spakowaną grę), Lexar upora się z tym w jakieś $15$ sekund. Goodram będzie potrzebował około $30$ sekund. Przy zwykłym przeglądaniu sieci czy graniu różnica ta jest jednak całkowicie nieodczuwalna.
* **RND4K [Q1T1] (Odczyt/Zapis losowy):** Najważniejszy parametr dla płynności działania Windowsa. Sprawdza prędkość pracy na małych plikach o rozmiarze $4\text{ KB}$. System operacyjny przez większość czasu mieli właśnie takie dane (pliki rejestru, logi, małe biblioteki DLL).
  * *Lexar (Dysk C):* Osiąga **$85.75 \text{ MB/s}$** przy odczycie i **$298.81 \text{ MB/s}$** przy zapisie. Szybki losowy odczyt bezpośrednio przekłada się na natychmiastowe reakcje Windowsa.
  * *Goodram (Dysk D):* Ma odpowiednio **$44.90 \text{ MB/s}$** oraz **$136.93 \text{ MB/s}$**. Jak na dysk Gen3 to dobre liczby, jednak starszy kontroler i wolniejsze pamięci flash nie dają mu szans w starciu z nowym Lexarem.
  * _**Co z tego wynika w praktyce?**_ Mimo że Lexar ma dwukrotnie wyższe prędkości, Windows nie włączy się dwa razy szybciej – czas reakcji samego kontrolera pozostaje zbliżony. Jednak wyższa wartość losowego odczytu małych plików ($85.75\text{ MB/s}$ vs $44.90\text{ MB/s}$) sprawia, że system na Lexarze NM790 zareaguje na kliknięcia zauważalnie szybciej, a instalowanie aplikacji w tle nie powoduje mikroprzycięć interfejsu.

### 🛠️ Punkt Kontrolny: Weryfikacja prędkości dysku SSD
<data-gate>
  <data-quiz>
    <question>Użytkownik przeprowadził test dysku SSD w CrystalDiskMark i uzyskał prędkość sekwencyjną SEQ1M na poziomie ok. $3450\text{ MB/s}$ przy odczycie. Dysk to Lexar NM790 (nominalnie osiągający do $7400\text{ MB/s}$). Jaka jest najbardziej prawdopodobna przyczyna?</question>
    <options>
      <item correct>Dysk został zainstalowany w slocie M.2 obsługującym jedynie starszy standard PCIe 3.0 lub współdzieli linie PCIe z innym gniazdem, co ograniczyło transfer do limitu poprzedniej generacji.</item>
      <item>Dysk przekroczył krytyczną temperaturę pracy pod obciążeniem i wbudowany radiator celowo obniżył wydajność o połowę w celu schłodzenia kontrolera.</item>
      <item>Przed testem zapomniano zaznaczyć w menu głównym opcji automatycznego przyspieszenia interfejsu (Auto Boost).</item>
    </options>
    <div data-hint="error">
      Zwróć uwagę na wartość prędkości – $3450\text{ MB/s}$ to niemal dokładnie fizyczny limit jednej z generacji PCIe x4. Której? Gdzie na płycie głównej mógł zostać wpięty ten dysk?
    </div>
    <div data-hint="success">
      Znakomicie! Wynik na poziomie $3450\text{ MB/s}$ to kres możliwości PCIe Gen3 x4. Prawdopodobnie dysk trafił do gniazda obsługiwanego przez chipset w starszym standardzie.
    </div>
  </data-quiz>
</data-gate>

---

### 🎉 Podsumowanie całego kursu: Twoja droga do statusu Power Usera

Gratulacje! Przebrnąłeś przez cały kurs Windows 11. Z poziomu zwykłego użytkownika awansowałeś na poziom świadomego administratora, który potrafi samodzielnie konfigurować, zabezpieczać i diagnozować środowisko systemowe oraz sprzętowe. Spójrzmy na kluczowe filary, które wspólnie zbudowaliśmy:

#### 💿 Moduł 0: Instalacja i pierwsze uruchomienie
Opanowałeś instalację systemu od podstaw, omijanie restrykcji sprzętowych i sieciowych oraz podstawy wirtualizacji. Nauczyłeś się poruszać po interfejsie za pomocą skrótów klawiszowych i korzystać z wbudowanych narzędzi wiersza poleceń.

#### ⚙️ Moduł 1: Codzienna obsługa i administracja systemem
Poznałeś mechanizmy zarządzania oprogramowaniem, sprzątania pozostałości po aplikacjach oraz kontrolowania usług systemowych. Wdrożyłeś również skuteczne strategie wykonywania kopii zapasowych w celu ochrony przed utratą danych.

#### 🔌 Moduł 2: Sprzęt, sieć i bezpieczeństwo
Zgłębiłeś tematykę zarządzania sterownikami, konfiguracji sieci lokalnej i szyfrowania zapytań DNS. Poznałeś fizykę dysków i partycji, a także wdrożyłeś szyfrowanie danych za pomocą mechanizmów **BitLocker** oraz **EFS**.

#### 🔒 Moduł 3: Zarządzanie środowiskiem użytkownika
Przejąłeś kontrolę nad uprawnieniami kont lokalnych i poziomami ochrony **UAC**. Skonfigurowałeś reguły systemowej zapory sieciowej oraz udziały sieciowe, łącząc uprawnienia sieciowe z prawami dostępu do systemu plików NTFS (w tym dziedziczenie i efektywny dostęp).

#### 🔍 Moduł 4: Zaawansowana administracja i diagnostyka
Nauczyłeś się badać logi w Podglądzie Zdarzeń, analizować zrzuty pamięci po awariach w debuggerze **WinDbg** oraz zarządzać lokalnymi polisami zabezpieczeń. Dowiedziałeś się również, jak samodzielnie diagnozować parametry pracy i wydajność podzespołów sprzętowych (CPU, GPU, RAM, SSD).

---

### 🚀 Co dalej?
Zdobyte umiejętności dają Ci pełną niezależność. Zamiast zgadywać przyczyny problemów z systemem lub komputerem, potrafisz teraz logicznie analizować fakty – odczytywać błędy z logów, monitorować parametry pracy podzespołów i wdrażać bezpieczne rozwiązania. Windows 11 nie ma już przed Tobą tajemnic!


