# Zarządzanie dyskami i partycjami

Na Helpdesku prędzej czy później usłyszysz: *„Komputer nie widzi dysku”*, *„Pendrive nie daje się sformatować”* albo *„Dysk C jest pełny, a ja nic inżynierskiego nie instalowałem”* 😅. Każdy z tych problemów wymaga zrozumienia tego, **jak Windows organizuje dane na nośnikach** – od surowego dysku fizycznego, przez tablice partycji, aż po litery woluminów widoczne w Eksploratorze.

---

## 💾 Pamięci masowe – przestrzeń na dane nieulotne

Aby skutecznie zarządzać przestrzenią dyskową z poziomu systemu operacyjnego, musisz najpierw poznać budowę i zasady działania samych nośników danych. 

Pamięć masowa jest pamięcią **nieulotną** (*non-volatile*) – w przeciwieństwie do pamięci operacyjnej RAM, zachowuje ona zapisane pliki i foldery po wyłączeniu zasilania komputera. [Pierwszym w historii nieulotnym dyskiem twardym](https://pl.wikipedia.org/wiki/Dysk_twardy#Historia) była konstrukcja **IBM 350 z $1956$ roku** (będąca częścią komputera RAMAC). Składała się z 50 talerzy o gigantycznej średnicy **$24$ cali** i mieściła zaledwie **$5$ megabajtów (MB)** danych! 

Dziś, po dekadach ewolucji magnetyzmu i półprzewodników, na rynku dominują dwa całkowicie odmienne światy technologiczne, z którymi bezpośrednio współpracuje system Windows 11:
- *MAGNETYCZNE HDD* (Talerzowe)
- *PÓŁPRZEWODNIKOWE SSD* (pamięć Flash)

Zderzenie tych dwóch światów fizycznych i mechanicznych ma bezpośrednie przełożenie na to, jak jądro systemu Windows 11 zarządza strukturą plików, przydziałem klastrów oraz wbudowaną automatyzacją konserwacyjną.

---

### 🔬 Fizyczna budowa nośników danych

Przeanalizujmy szczegółowo budowę fizyczną obu typów nośników. Pozwoli to zrozumieć logiczny podział danych na sektory oraz unikalne metody optymalizacji stosowane przez system Windows 11.

<data-tabs>
  <tabs>
    <item>Dyski magnetyczne HDD</item>
    <item>Dyski półprzewodnikowe SSD</item>
  </tabs>
  <div>

### Dysk magnetyczny HDD (Hard Disk Drive)

Klasyczny dysk twardy (HDD) to precyzyjne urządzenie elektro-mechaniczne. Dane są zapisywane magnetycznie na wirujących z ogromną prędkością **talerzach** (*platters*), pokrytych cienką warstwą ferromagnetyka. 

Odczyt i zapis realizują mikroskopijne **głowice elektromagnetyczne** umieszczone na precyzyjnych ramionach pozycjonera. Fizyczny zapis danych na talerzu magnetycznym opiera się na polaryzacji miniaturowych domen magnetycznych (ziaren ferromagnetyka). We współczesnych dyskach stosuje się technologię **zapisu prostopadłego (PMR – Perpendicular Magnetic Recording)**, w której domeny magnetyczne są zorientowane pionowo względem powierzchni talerza, co umożliwia znacznie większą gęstość upakowania danych.

### 🏗️ Budowa i logiczny podział dysku HDD:

![Rozkład danych magnetycznych na talerzu dysku HDD](/public/courses/windows-11/Images/dane-magnetyczne.webp)

:::diagram
Schemat przedstawia zasadę prostopadłego zapisu magnetycznego (PMR) danych na talerzu dysku twardego, gdzie kierunek namagnesowania domen reprezentuje wartości binarne `1` i `0`.
:::

**Opis strukturalny diagramu**

1. **Podział na domeny magnetyczne** – Rysunek przedstawia ciąg $12$ pionowych, prostokątnych komórek (domen magnetycznych) na powierzchni talerza dysku. Pierwsze $8$ komórek jest spolaryzowanych magnetycznie (kolorowe), a kolejne $4$ po prawej stronie są nieaktywne/szare.
2. **Reprezentacja bitu 1 (kolor różowy/czerwony)** – Komórki reprezentujące wartość logiczną `1` posiadają polaryzację z biegunem północnym (N) na górze i południowym (S) na dole, co zilustrowano czarną strzałką skierowaną w górę. Pod każdą taką komórką widnieje czerwona cyfra `1`.
3. **Reprezentacja bitu 0 (kolor niebieski)** – Komórki reprezentujące wartość logiczną `0` posiadają polaryzację z biegunem południowym (S) na górze i północnym (N) na dole, co zilustrowano czarną strzałką skierowaną w dół. Pod każdą taką komórką widnieje czerwona cyfra `0`.
4. **Zapisana sekwencja binarna** – Uporządkowany ciąg ośmiu spolaryzowanych domen reprezentuje bajt danych o wartości binarnej: `1 0 1 0 0 1 0 1`.

---

- **Ścieżka** (*Track*): Koncentryczny okrąg na powierzchni talerza magnetycznego.
- **Sektor geometryczny:** Wycinek koła talerza dzielący wszystkie ścieżki.
- **Sektor dysku** (*Sector*): Najmniejsza fizyczna jednostka adresowania na dysku. Przez dekady standardowy sektor mieścił $512 \text{ bajtów}$, natomiast współczesne dyski w standardzie _**Advanced Format (AF / 4Kn)**_ operują na sektorach o rozmiarze **$4096 \text{ bajtów}$ ($4 \text{ KiB}$)**.
- **Cylinder:** Pionowy stos ścieżek o identycznym promieniu, leżących nad sobą na wszystkich talerzach dysku.
- **Klaster** (*Jednostka alokacji*): Logiczna grupa sektorów. System Windows 11 nie zarządza bezpośrednio pojedynczymi sektorami, lecz przydziela plikom pełne klastry (np. standardowo $4 \text{ KB}$ w systemie plików NTFS).

![Fizyczny schemat budowy wewnętrznej dysku HDD](/public/courses/windows-11/Images/hdd_schemat.png)

:::diagram
Fizyczny schemat budowy przedstawia wewnętrzne i zewnętrzne komponenty dysku twardego HDD (Hard Disk Drive). Ukazuje fizyczną konstrukcję mechaniczną oraz logiczną strukturę podziału przestrzeni dyskowej na podstawie dokładnych oznaczeń na rysunku.
:::

**Opis strukturalny diagramu**

1. **Elementy logiczne struktury danych (oznaczone na talerzu)** – wskazane są cztery obszary na wirującym talerzu magnetycznym: `ŚCIEŻKA` (jako pojedynczy okrąg), `SEKTOR DYSKU` (pojedynczy blok danych na ścieżce), `SEKTOR GEOMETRYCZNY` (wycinek przechodzący przez wszystkie talerze) oraz `KLASTER` (zgrupowanie sektorów).  
2. **Mechanizm pozycjonowania** – wskazane jest `RAMIĘ GŁOWICY` połączone z elementem `UKŁAD POZYCJONUJĄCY RAMIĘ GŁOWICY`. Na końcu ramienia znajduje się `GŁOWICA` elektromagnetyczna.  
3. **Konstrukcja nośnika i napęd** – w centrum znajdują się wirujące `TALERZE` osadzone na osi, którą obraca `SILNIK OBRACAJĄCY TALERZAMI`.  
4. **Interfejsy przyłączeniowe** – na obudowie wyprowadzone są porty: zasilanie oznaczone jako `ZŁĄCZE ZASILANIA SATA` oraz złącze danych `WEJŚCIE SATA`.

- **Silnik i prędkość obrotowa** (*Spindle*): Silnik obraca talerzami ze stałą prędkością (standardowo $5400 \text{ RPM}$ w laptopach i dyskach przenośnych lub $7200 \text{ RPM}$ w komputerach stacjonarnych i serwerach).
> $\text{RPM}$ – obroty na minutę (*Rotations Per Minute*).
- **Wielotalerzowość:** Dysk może składać się z kilku talerzy zamontowanych na wspólnej osi. Każda powierzchnia talerza ma swoją dedykowaną głowicę odczytująco-zapisującą. Na powyższym schemacie widzimy pięć ramion pozycjonera niosących łącznie osiem głowic (obsługujących obie strony czterech talerzy) – gęstość zapisu na tak zaawansowanym stosie pozwala uzyskać pojemności rzędu $10\text{ TB}$ i więcej!
- **Poduszka powietrzna i sterylność:** Głowica nie dotyka talerza! Unosi się nad nim na wysokości zaledwie kilkunastu nanometrów, wykorzystując mikroskopijną poduszkę powietrzną tworzoną przez pęd powietrza wirującego nośnika.

> [!CAUTION]
> **_Śmiertelna czułość na zanieczyszczenia:_**
> Otwarcie obudowy dysku HDD poza specjalistyczną, sterylną komorą bezpyłową (tzw. *Cleanroom*) w 99% niszczy dysk bezpowrotnie. Drobiny kurzu zawieszone w powietrzu są wielokrotnie większe niż szczelina między głowicą a talerzem. Jeśli pyłek osiądzie na talerzu, pędząca głowica zderzy się z nim, powodując fizyczne zdrapanie warstwy magnetycznej (tzw. *Head Crash* / lądowanie głowicy) i całkowitą utratę danych.

- **Fizyczne interfejsy i zasilanie:**
    - *SATA (Serial ATA):* Współczesne złącze szeregowe. Wtyczka sygnałowa posiada **$7$ pinów**, a wtyczka zasilająca **$15$ pinów** (razem $22$ piny). Jest mała, elastyczna i wspiera podłączanie w locie (Hot-Plug).
    - *IDE (ATA / PATA):* Przestarzałe, szerokie złącze równoległe posiadające aż **$40$ pinów** połączonych szeroką taśmą.
    - *Zasilanie MOLEX:* Stary typ wtyczki zasilającej stosowany do zasilania dysków standardu IDE (PATA), dostarczający napięcia:
      - **$12\text{ V}$** potrzebne do zasilenia silnika obracającego talerzami,
      - **$5\text{ V}$** zasilające układy elektroniczne dysku.

### ⚙️ Windows 11 a HDD – Fragmentacja i Defragmentacja:
Ponieważ dysk HDD jest urządzeniem mechanicznym, jego głowica musi fizycznie przemieścić się nad odpowiednią ścieżkę, a następnie poczekać, aż talerz obróci się pod nią do właściwego sektora (tzw. *opóźnienie rotacyjne*). 

Z czasem zapisywania i usuwania plików, dane pojedynczego pliku ulegają **fragmentacji** – zostają rozrzucone w różnych klastrach na powierzchni całego dysku. Gdy głowica musi nieustannie skakać fizycznie z miejsca na miejsce, wydajność odczytu drastycznie spada.

W systemie Windows 11 wbudowane narzędzie _**Defragmentacja i optymalizacja dysków**_ regularnie scala pofragmentowane pliki na nośnikach HDD, układając je w jeden ciągły ciąg klastrów. Dzięki temu głowica odczytuje plik jednym płynnym ruchem, co znacząco przyspiesza działanie systemu!

  </div>
  <div>

### Dysk półprzewodnikowy SSD (Solid State Drive)

Pamięć półprzewodnikowa nie jest nowym konceptem – z powodzeniem od lat służy jako pamięć operacyjna RAM. Jednak klasyczny RAM jest pamięcią **ulotną** (Dynamic RAM – DRAM), która wymaga stałego dopływu prądu do podtrzymania ładunku w kondensatorach. 

Dysk SSD wykorzystuje nieulotną pamięć **NAND Flash**. Dzięki zastosowaniu tranzystorów z bramką pływającą (Floating Gate) lub technologii Charge Trap, komórki SSD potrafią trwale uwięzić ładunek elektryczny (elektrony) wewnątrz struktury krzemowej, zachowując dane po odłączeniu zasilania komputera. 

Przez dekady wysoki koszt produkcji kości krzemowych o dużej gęstości zapisu sprawiał, że proporcja ceny do pojemności SSD była niekorzystna. Dopiero ewolucja litografii pozwoliła na masowe zastąpienie dysków HDD w naszych komputerach.

### 🏗️ Budowa i komponenty dysku SSD:

![Wewnętrzne komponenty dysku SSD SATA](/public/courses/windows-11/Images/ssd_budowa.png)

:::diagram
Schemat przedstawia wewnętrzną płytkę drukowaną (PCB) otwartego dysku SSD ze złączem SATA, wskazując jego fizyczne komponenty oraz interfejsy przyłączeniowe zgodnie z etykietami na rysunku.
:::

**Opis strukturalny diagramu**

1. **Moduły pamięci** – u góry płytki znajdują się cztery czarne układy scalone oznaczone jako `MODUŁY PAMIĘCI FLASH DZIAŁAJĄCE NA UKŁADACH PAMIĘCI NAND`.
2. **Bufor danych** – po lewej stronie umieszczony jest mniejszy układ scalony oznaczony jako `BUFOR PAMIĘĆ CACHE`.
3. **Układ sterujący** – w centrum znajduje się główny procesor dysku oznaczony jako `KONTROLER SSD`.
4. **Złącze danych** – na dolnej krawędzi po lewej stronie wyprowadzone jest 7-pinowe `WEJŚCIE SATA`.
5. **Złącze zasilania** – na dolnej krawędzi po prawej stronie znajduje się 15-pinowy port zasilający oznaczony jako `ZŁĄCZE ZASILANIA SATA`.

Dyski SSD są całkowicie pozbawione ruchomych części mechanicznych. Składają się z trzech kluczowych komponentów:
1.  **Kontroler SSD:** Zaawansowany procesor (mózg dysku). Odpowiada za korekcję błędów (ECC), równomierne zużycie komórek (*Wear Leveling*), szyfrowanie sprzętowe oraz protokół komunikacji.
2.  **Pamięć podręczna DRAM:** Szybki bufor przechowujący mapę translacji adresów logicznych na fizyczne (FTL – Flash Translation Layer). Pozwala kontrolerowi błyskawicznie lokalizować dane na kościach pamięci.
3.  **Kości pamięci NAND Flash:** Półprzewodnikowe układy scalone przechowujące pliki w komórkach krzemowych.

### 📊 Ewolucja pamięci Flash: SLC vs MLC vs TLC vs QLC vs PLC:
Zwiększanie pojemności dysków krzemowych odbywa się poprzez wciskanie większej liczby bitów (stanów elektrycznych) do pojedynczego tranzystora NAND:

![Typy komórek pamięci NAND Flash i ich gęstość zapisu](/public/courses/windows-11/Images/slc_mlc_tlc_qlc_plc.png)

:::diagram
Render 3D porównuje pięć typów komórek pamięci NAND Flash (SLC, MLC, TLC, QLC, PLC) pod kątem liczby bitów zapisywanych w pojedynczej komórce oraz stanów napięcia reprezentowanych przez stosy kolorowych walców.
:::

**Opis strukturalny diagramu**

1. **Komórka SLC** – kolumna oznaczona jako `SLC` z zielonym nagłówkiem `1b` (1 bit), zawierająca 2 zielone walce oznaczone cyfrą `1` (2 poziomy napięcia).
2. **Komórka MLC** – kolumna oznaczona jako `MLC` z żółtym nagłówkiem `2b` (2 bity), zawierająca stos 4 żółtych walców oznaczonych liczbą `10` (4 poziomy napięcia).
3. **Komórka TLC** – kolumna oznaczona jako `TLC` z różowym nagłówkiem `3b` (3 bity), zawierająca stos 8 różowych walców oznaczonych liczbą `101` (8 poziomów napięcia).
4. **Komórka QLC** – kolumna oznaczona jako `QLC` z niebieskim nagłówkiem `4b` (4 bity), zawierająca stos 16 niebieskich walców oznaczonych liczbą `1010` (16 poziomów napięcia).
5. **Komórka PLC** – kolumna oznaczona jako `PLC` z czerwonym nagłówkiem `5b` (5 bitów), zawierająca stos 32 czerwonych walców oznaczonych liczbą `10101` (32 poziomy napięcia).

- **SLC (Single-Level Cell – 1 bit/komórkę):** Przechowuje $2$ stany napięcia. Najszybsza, o najwyższej trwałości (do $100\ 000$ cykli zapisu), ale bardzo droga i o małej pojemności.
- **MLC (Multi-Level Cell – 2 bity/komórkę):** Przechowuje $4$ stany napięcia. Standard w starszych profesjonalnych dyskach SSD. Żywotność ok. $10\ 000$ cykli.
- **TLC (Triple-Level Cell – 3 bity/komórkę):** Przechowuje $8$ stanów napięcia. Obecny standard w większości współczesnych dysków SSD. Świetny kompromis wydajności i trwałości ($3000$ cykli).
- **QLC (Quad-Level Cell – 4 bity/komórkę):** Przechowuje $16$ stanów napięcia. Bardzo tanie dyski o ogromnych pojemnościach, ale o niskiej trwałości (ok. $1000$ cykli) i silnym spadku prędkości zapisu po zapełnieniu bufora DRAM/SLC.
- **PLC (Penta-Level Cell – 5 bitów/komórkę):** Przechowuje $32$ stany napięcia. Nadchodzący standard mający zastąpić klasyczne HDD w serwerowniach typu „zimne archiwum”. Ekstremalnie tanie kosztem żywotności, która może wynosić poniżej $500$ cykli na komórkę.

### ⚠️ Windows 11 a SSD – Kategoryczny zakaz defragmentacji i funkcja TRIM:

> [!CAUTION]
> **_Pod żadnym pozorem nie defragmentuj dysków SSD!_**
> Ponieważ czas dostępu do dowolnej komórki pamięci krzemowej SSD jest identyczny (zwykle poniżej $0{,}1\text{ ms}$), rozrzucenie klastrów (fragmentacja logiczna) nie wpływa negatywnie na wydajność odczytu nośnika. 
> 
> Klasyczna defragmentacja wymusza miliony niepotrzebnych cykli zapisu, co drastycznie skraca żywotność pamięci NAND i doprowadza do przedwczesnego zużycia dysku!

System Windows 11 w pełni rozpoznaje dyski SSD i zamiast defragmentacji wysyła do nich komendę **TRIM**.

**Jak działa TRIM w Windows 11?**
Gdy usuwasz plik w systemie Windows, system plików NTFS jedynie oznacza odpowiednie klastry jako wolne w swojej tabeli MFT, ale fizyczne bloki na nośniku nadal zawierają stare dane (dla dysku to wciąż dane użyteczne). Komórka pamięci Flash przed ponownym zapisem **musi zostać całkowicie wymazana**, co w SSD odbywa się w dużych blokach i zajmuje relatywnie dużo czasu.
_**TRIM**_ przekazuje kontrolerowi SSD listę bloków, które nie zawierają już przydatnych danych. Kontroler w wolnej chwili (w tle) bezgłośnie wymazuje te bloki krzemowe, przygotowując czyste, puste komórki na przyszłe, błyskawiczne operacje zapisu!

Współczesne dyski SSD nie wymagają manualnej defragmentacji. Dla zachowania pełnej wydajności kontrolera pamięci Flash (odpowiadającego za *Wear Leveling*) zaleca się pozostawienie <span style="white-space:nowrap">**$10-20\\%$**</span> wolnej przestrzeni (często nazywanej potocznie *Over-Provisioningiem*). 

Aby odzyskać zablokowaną przestrzeń po starych aktualizacjach Windows na przepełnionym, **małym dysku systemowym `C:`**, możesz uruchomić narzędzie systemowe:
```powershell
cleanmgr
```
> Zastosowanie dla `cleanmgr` ma sens przy małych dyskach systemowych – na ogromnych, kilkuterrabajtowych nośnikach na dane, odzyskane za jego pomocą np. $600 \text{ MB}$ to kropla w morzu nie wpływająca w żadnym stopniu na kondycję SSD.

**Weryfikacja działania funkcji TRIM w Windows 11:**
Upewnij się, że system poprawnie wysyła do dysku komendy czyszczące. Otwórz konsolę PowerShell z uprawnieniami administratora i wpisz:
```powershell
fsutil behavior query DisableDeleteNotify
```
W najnowszych systemach operacyjnych otrzymasz precyzyjny raport ze statusem oddzielnie dla każdego systemu plików (wartość `0` oznacza, że blokada TRIM jest wyłączona – a zatem sam TRIM **działa i poprawnie komunikuje się ze sprzętem**):
```yaml
NTFS DisableDeleteNotify = 0  (Allows TRIM operations to be sent to the storage device)
ReFS DisableDeleteNotify = 0  (Allows TRIM operations to be sent to the storage device)
```

Jeśli wynikiem z niezrozumiałych powodów byłoby `1`, powinieneś włączyć obsługę TRIM ręcznie poleceniem:
```powershell
fsutil behavior set DisableDeleteNotify 0
```

  </div>
</data-tabs>

---

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Dysk magnetyczny (HDD)" data-right="Nośnik elektro-mechaniczny wymagający defragmentacji w celu zminimalizowania skoków głowicy podczas odczytu pofragmentowanych plików"></div>
    <div class="cmw-item" data-left="Dysk półprzewodnikowy (SSD)" data-right="Cichy napęd oparty na kościach NAND Flash w którym fragmentacja danych nie wpływa negatywnie na czas dostępu do plików"></div>
    <div class="cmw-item" data-left="Komenda TRIM" data-right="Sygnał wysyłany z systemu operacyjnego informujący kontroler SSD o zwolnionych adresach LBA w celu ich wyczyszczenia w tle"></div>
    <div class="cmw-item" data-left="Adresowanie LBA" data-right="Metoda mapowania w której dysk prezentuje się systemowi jako ciąg kolejnych bloków logicznych bez ujawniania geometrii fizycznej"></div>
  </data-connection-matcher>
</data-gate>

---

### 🔬 Zaawansowane adresowanie i struktura sektorów

Gdy fizyczna warstwa nośnika jest gotowa, system operacyjny musi odwoływać się do konkretnych miejsc zapisu na dysku.

#### 1. Adresowanie CHS vs LBA:
- **CHS** (*Cylinder-Head-Sector*): Stary standard adresowania używany w dyskach HDD do lat $90$. System operacyjny musiał dokładnie znać fizyczną geometrię dysku: numer cylindra (ścieżki), głowicy zapisującej oraz konkretnego sektora. Posiadał dramatyczne ograniczenia pojemności (maksymalnie do ok. $8{,}4\text{ GB}$).
- **LBA** (*Logical Block Addressing*): Współczesny standard. Geometria fizyczna jest ukryta. Dysk prezentuje się systemowi jako jeden liniowy ciąg bloków (sektorów) ponumerowanych od $0$ do $n$. Jądro systemu wysyła do kontrolera proste zapytanie: *`Odczytaj blok o numerze 102450`*, a kontroler dysku sam wie, gdzie te dane się znajdują.

#### 2. Rozmiar sektora (512 bajtów vs 4Kn):
- **Klasyczny sektor (512-byte):** Przez dekady standardowy blok dysku miał rozmiar **$512\text{ bajtów}$**.
- **Advanced Format (4Kn / 4096-byte):** Nowoczesne dyski HDD i SSD operują na sektorach o rozmiarze <span style="white-space:nowrap">**$4096\text{ bajtów}$** ($4\text{ KiB}$).</span> Pozwala to na znacznie lepszą korekcję błędów (`ECC`) i efektywniejsze wykorzystanie przestrzeni nośnika.

Możesz to sprawdzić w systemie Windows, uruchamiając `msinfo32` (*Informacje o systemie*) i sprawdzając wartość **Przesunięcie partycji**, która powinna być wielokrotnością **$4096\text{ bajtów}$** ($4\text{ KiB}$).

![Rozmiar sektora klasycznego vs Advanced Format](/public/courses/windows-11/Images/4k_disk_good.webp)

> [!TIP]
> **512e (Emulacja):** Wiele dysków Advanced Format emuluje sektory $512\text{-bajtowe}$ na poziomie sprzętowym, aby zachować kompatybilność ze starszymi systemami operacyjnymi. W Windows 11 dyski działają już natywnie w pełnym trybie **4Kn** (Native 4K).

---

### 🔌 Złącza fizyczne a protokoły logiczne (Pułapka interfejsów)

Wielu młodych techników myli kształt wtyczki z protokołem komunikacyjnym dysku. Aby uniknąć zwrotów niekompatybilnego sprzętu przez klientów, musisz opanować twardy, inżynieryjny podział: **czym innym jest złącze fizyczne (form factor), a czym innym protokół (język rozmowy dysku z procesorem)**.

<data-tabs>
  <tabs>
    <item>Klasyczne łącze SATA (Kable)</item>
    <item>Złącze M.2 (Na płycie głównej)</item>
  </tabs>
  <div>

### Tradycyjny kabel SATA i powolny protokół AHCI

Klasyczne nośniki $2{,}5\text{-calowe}$ (zarówno talerzowe HDD, jak i SSD) podłączane są do płyty głównej kablem **SATA** (*Serial ATA*). Taki dysk komunikuje się z procesorem komputera (CPU) za pomocą przestarzałego języka zwanego protokołem **AHCI** (*Advanced Host Controller Interface*).

- **Ograniczenia AHCI:** Protokół AHCI został stworzony dekady temu, specjalnie pod kątem wolnych, magnetycznych dysków HDD. Obsługuje **tylko 1 kolejkę poleceń** o maksymalnej głębokości zaledwie $32$ zadań. 
- **Wąskie gardło SATA III:** Maksymalna, sprzętowa przepustowość kabla w standardzie SATA III to $600\text{ MB/s}$. Dlatego nawet jeśli włożysz tam najszybszy dysk SSD na świecie, system operacyjny zostanie ograniczony limitem przestarzałego kabla SATA (osiągając realnie maksymalnie ok. $550\text{ MB/s}$).

Wniosek jest brutalny: podłączanie nowoczesnych pamięci krzemowych przez architekturę SATA to jak zamontowanie silnika odrzutowego na starym, drewnianym wozie konnym. System jest tak szybki, jak jego najwolniejszy punkt komunikacyjny. Nadeszła era M.2!

  </div>
  <div>

### Rewolucyjne złącze M.2 i pułapka kluczy (Key B/M)

**M.2** to niezwykle smukły i kompaktowy kształt złącza fizycznego wlutowanego bezpośrednio w płytę główną (eliminujący bałagan kablowy znany z dysków SATA). **Tutaj zaczyna się pułapka.** Dysk w formacie M.2 może korzystać z **dwóch zupełnie różnych protokołów komunikacyjnych** (wolnego SATA lub szybkiego NVMe), o czym decydują sprzętowe wycięcia zwane kluczami (*Keys*):

![Zestawienie różnic w kluczach wtyczki dysku M.2](/public/courses/windows-11/Images/m2_keys_schema.webp)

1. **Dysk M.2 SATA (Klucz B+M):** Dysk o kształcie M.2 (z dwoma wycięciami na wtyczce), ale nadal rozmawiający z procesorem za pomocą starego języka SATA/AHCI. Jest ograniczony do bolesnych $550\text{ MB/s}$ prędkości! Niska cena zachęca klientów do zakupu, po czym czują się oni oszukani brakiem „milionowych” prędkości.
2. **Dysk M.2 NVMe (Klucz M):** Prawdziwy demon prędkości (z jednym wycięciem po prawej stronie).

## Protokół NVMe i rewolucja DirectStorage

**NVMe** (*Non-Volatile Memory Express*) to nowoczesny język stworzony od podstaw z myślą o błyskawicznych dyskach krzemowych. Omija on powolny kontroler dysków i podłącza pamięć bezpośrednio pod autostradę do procesora – szynę **PCI Express (PCIe)**!

- **Genialne kolejkowanie:** Zamiast jednej powolnej kolejki z AHCI, system Windows operując na protokole NVMe potrafi otworzyć **aż $64\ 000$ równoległych kolejek**, a w każdej z nich przetwarzać kolejne $64\ 000$ zadań! To wreszcie pozwala na nakarmienie danymi ogromnych, wielordzeniowych procesorów (CPU).
- **Przepustowości w gigabajtach:** Dyski NVMe na złączu PCIe $3.0$ osiągają do $3500\text{ MB/s}$, generacja PCIe $4.0$ podbija to do $7500\text{ MB/s}$, natomiast absolutnie nowe układy na szynie PCIe $5.0$ wyciągają zatrważające **$14\ 000\text{ MB/s}$ ($14\text{ GB/s}$)**. To $25$-krotnie szybciej niż jakikolwiek SSD zapięty pod kabelkiem SATA!

> [!TIP]
> *Moc DirectStorage w Windows 11*
> Jednym z flagowych atutów Windows 11 jest technologia **DirectStorage**. Wykorzystując szaloną przepustowość szyny PCIe NVMe, jądro systemu przekazuje skompresowane paczki zasobów gry z dysku bezpośrednio do VRAM karty graficznej, całkowicie omijając obciążenie procesora głównego (CPU). Dekompresją zajmuje się GPU! Ekran ładowania gry skraca się z $20$ sekund do mrugnięcia okiem!

  </div>
</data-tabs>

---

<data-gate>
  <data-quiz>
    <question>Użytkownik zakupił dysk SSD w formacie M.2 SATA i podłączył go do nowego laptopa. Po uruchomieniu testu prędkości zauważył, że transfery nie przekraczają 550 MB/s. Co jest przyczyną?</question>
    <options>
      <item>Port M.2 na płycie głównej automatycznie przełączył się w tryb oszczędzania energii ze względu na brak wsparcia dla protokołu NVMe.</item>
      <item correct>Złącze M.2 określa jedynie format fizyczny; dysk M.2 SATA wciąż komunikuje się za pomocą starego protokołu AHCI z limitem szyny SATA III.</item>
      <item>System operacyjny Windows 11 wymaga włączenia DirectStorage, aby odblokować pełną przepustowość magistrali PCIe dla dysków M.2.</item>
      <item>Konstrukcja wymaga manualnego przełączenia typu klucza fizycznego z Key B na Key M w ustawieniach systemu BIOS/UEFI płyty głównej.</item>
    </options>
    <div data-hint="error">
      Wskazówka: Zastanów się, czy samo złącze M.2 gwarantuje korzystanie z szyny PCIe (NVMe) i czy klucze fizyczne (wycięcia) oraz technologie optymalizacji gier mają wpływ na ogólny limit przepustowości interfejsu SATA III.
    </div>
    <div data-hint="success">
      Dokładnie! Złącze M.2 to tylko format fizyczny. Jeżeli zakupiony nośnik to dysk M.2 SATA, to korzysta on z protokołu SATA/AHCI i jest ograniczony przepustowością szyny SATA III. Aby uzyskać prędkości rzędu tysięcy MB/s, należy zastosować dysk M.2 NVMe (korzystający z szyny PCIe).
    </div>
  </data-quiz>
</data-gate>

---

### 🏗️ Od fizyki do litery dysku – logiczne etapy organizacji danych

Zanim surowy nośnik fizyczny (HDD lub SSD) pokaże się jako znana litera dysku `C:` w oknie Eksploratora plików, system operacyjny Windows 11 musi przeprowadzić logiczną strukturyzację danych. 

Pomyśl o tym jak o kolejnych etapach wznoszenia budynku mieszkalnego:

1.  **Dysk fizyczny (Nośnik surowy):** Fizyczny HDD, SSD, NVMe lub pendrive. Sam z siebie jest dla systemu operacyjnego jedynie ciągiem bajtów podzielonym na sektory.
2.  **Tablica partycji (Plan architektoniczny):** Mówi systemowi, jak logicznie podzielić ten fizyczny obszar na części. Dwa główne standardy to **MBR** (stary) i **GPT** (nowoczesny).
3.  **Partycja / Wolumin (Mieszkania w bloku):** Wydzielony, ciągły obszar logiczny na dysku (np. partycja systemowa, partycja danych, ukryta partycja odzyskiwania).
4.  **System plików (Aranżacja wnętrza):** Sposób fizycznego zapisu i organizacji struktury plików, folderów oraz metadanych wewnątrz danej partycji (np. NTFS, exFAT, FAT32, ReFS).
5.  **Litera dysku (Adres pocztowy):** Etykieta (np. `C:`, `D:`, `E:`), pod którą system operacyjny Windows montuje dany wolumin, udostępniając go użytkownikowi w Eksploratorze.

### 📋 Tablice partycjonowania: MBR vs GPT

Po zrozumieniu z czym fizycznie się komunikujemy (SATA czy NVMe), musimy założyć na tym czystym nośniku „plan geodezyjny”. Tym właśnie jest **Tablica partycji** (*Partition Table*) – to pierwsza rzecz, którą system Windows 11 odczytuje ze świeżego dysku twardego. Decyduje ona o tym, ile partycji możesz na nim utworzyć oraz na jak pojemnych dyskach w ogóle będziesz w stanie operować!

<data-tabs>
  <tabs>
    <item>Stary standard MBR</item>
    <item>Nowoczesny GPT</item>
  </tabs>
  <div>

### MBR (Master Boot Record)

MBR to technologia stworzona na początku lat $80$. w erze MS-DOS. Do niedawna był to absolutny standard. 

![Struktura partycji MBR](/public/courses/windows-11/Images/mbr_signature.webp)

:::diagram
Diagram przedstawia strukturę logiczną pierwszego sektora dysku ($512$ bajtów) sformatowanego w standardzie MBR (Master Boot Record), dzieląc go na sekcję kodu rozruchowego, sygnaturę dysku, tabelę partycji oraz sygnaturę końcową.
:::

**Opis strukturalny diagramu**

1. **Kod rozruchowy (Bootloader)** – największy blok po lewej stronie zajmujący `440 bajtów` przeznaczony na kod programu rozruchowego.
2. **Identyfikator dysku** – blok o rozmiarze `4 bajty` zawierający unikalną sygnaturę dysku.
3. **Puste bajty** – wąski, czarny obszar zajmujący `2 bajty` (niewykorzystane, puste bajty znajdujące się bezpośrednio po sygnaturze dysku).
4. **Tabela partycji** – obszar o łącznej wielkości `64 bajtów`, podzielony na cztery równe bloki po `16 bajtów` każdy, odpowiadające wpisom dla `Partycja 1`, `Partycja 2`, `Partycja 3` oraz `Partycja 4`.
5. **Sygnatura rozruchowa MBR** – blok końcowy po prawej stronie o rozmiarze `2 bajty` (standardowo o wartości `0x55AA`).

Obecnie traktuje się go jak przestarzały skansen inżynieryjny, ze względu na potężne ograniczenia:

- **Limit pojemności:** MBR potrafi zaadresować maksymalnie wolumin o rozmiarze do $2\text{ TB}$. Jeśli podłączysz dysk $4\text{ TB}$ zaimplementowany w starym MBR, Windows zobaczy tylko równe $2\text{ TB}$, a pozostała część powierzchni sprzętowej zmarnuje się jako „niedostępny obszar”.
- **Limit partycji:** Pozwala utworzyć maksymalnie **$4$ partycje podstawowe** na dysku (jeśli klient chce $5$ partycji, technik musi utworzyć $3$ podstawowe i $1$ rozszerzoną z partycjami logicznymi – tzw. rzeźbienie w miedzi).
- **Zależność sprzętowa:** Wymaga uruchamiania komputera w przestarzałym trybie startu **Legacy BIOS** (lub moduł CSM).
- **Brak odporności na uszkodzenia:** Cała definicja partycji dla całego nośnika to pojedynczy malutki rekord, trzymany w Sektorze LBA $0$ (na samym fizycznym początku dysku).
  - ❌ Jeśli jakakolwiek awaria (np. bad-sector) uderzy w ten konkretny punkt, **cała struktura dysku znika!** Dysk raportuje się jako „RAW” i wymaga specjalistycznego oprogramowania (np. TestDisk) do próby odtworzenia tej tabeli po omacku.

  </div>
  <div>

### GPT (GUID Partition Table)

GPT to nowoczesny, kuloodporny inżynieryjnie standard tablic, tworzony jako nieodłączna część standardu zintegrowanego środowiska płyt głównych UEFI.

![Struktura ochronna tablicy GPT w nowożytnych systemach](/public/courses/windows-11/Images/gpt_schema.webp)

:::diagram
Schemat przedstawia pionowy układ logicznych bloków adresowania (LBA) w strukturze tablicy partycji GPT, ukazując podział na nagłówki główne na początku nośnika oraz nagłówki zapasowe na samym końcu dysku.
:::

**Opis strukturalny diagramu**

1. **Sektor ochronny (LBA 0)** – na samym początku znajduje się blok `Ochronny MBR` (zabezpieczający strukturę przed starszym oprogramowaniem).
2. **Główny nagłówek (LBA 1)** – blok zawierający `Główny Nagłówek GPT`.
3. **Główna tabela partycji (LBA 2 - LBA 33)** – blok tabeli zawierający wpisy o partycjach (maksymalnie 128 wpisów, gdzie każdy wpis ma rozmiar 128 bajtów).
4. **Przestrzeń danych (od LBA 34 do LBA -34)** – obszar podzielony kolejno na `Partycja 1`, `Partycja 2` oraz sekcję `Pozostałe partycje`.
5. **Zapasowa tabela partycji (LBA -33 do LBA -2)** – kopia zapasowa głównej tabeli wpisów o partycjach, zlokalizowana na końcu nośnika.
6. **Zapasowy nagłówek (LBA -1)** – zlokalizowany w ostatnim logicznym sektorze dysku `Drugi zapasowy nagłówek GPT`.

- **Kosmiczne limity pojemności:** Zamiast małego systemu identyfikatorów, każdy blok i partycja otrzymuje <span style="white-space:nowrap">$128$-bitowy</span> **kryptograficzny GUID** (*Globally Unique Identifier*). Pozwala to tablicy obsługiwać fizyczne dyski twarde o rozmiarze sięgającym niewyobrażalnych **$9{,}4\text{ ZB}$ (zetta-bajtów)**. Limit nie będzie problemem przez najbliższe dziesięciolecia!
- **Wielka elastyczność:** Natywne wsparcie dla **$128$ równoległych partycji podstawowych** bezpośrednio w strukturze logicznej systemu Windows.
- **Wbudowana redundancja i odporność:** W standardzie GPT na dysku przechowywane są jednocześnie **dwie w pełni funkcjonalne kopie struktury partycji**! Pierwsza znajduje się na fizycznym początku nośnika (LBA 1), a druga (Safety Backup) – obowiązkowo na **ostatnim użytecznym sektorze fizycznym nośnika**.
  - ✅ Jeśli na początku dysku pojawi się fizyczny *bad-sector*, system UEFI ułamek sekundy później automatycznie wczytuje tabelę z końca dysku i nadpisuje uszkodzoną kopię główną naprawiając system w locie!

  </div>
</data-tabs>

> [!IMPORTANT]
> System Windows 11 **_do startu bezwzględnie wymaga GPT + UEFI._**
> Instalator najnowszego systemu Windows natychmiast odrzuci instalację na dysku systemowym, który zostanie zainicjalizowany jako MBR. Poinformuje o *„błędzie konfiguracji dysku”*.

---

### 🛠️ Wiersz poleceń i wbudowane narzędzie: MBR2GPT.exe
Co zrobić, gdy stary komputer pracowniczy klienta ma na jedynym dysku stary format MBR (Windows działa na nim w trybie Legacy CSM), a zarząd nakazał wszystkim pilną migrację na Windows 11 bez utraty profili pracowniczych (bez formatu i nowej instalacji)? 

W Windows 11 i Windows 10 dostępny jest potężny, bezstratny kombajn w wierszu poleceń. Pozwala w $\approx 10$ sekund na przepisanie struktury całego dysku MBR na w pełni redundantne bloki GPT, **bez utraty nawet jednego bitu z plików pracownika!** Wywołaj ten proces w konsoli CMD jako Administrator:

1. **Etap 1 – Walidacja** (Narzędzie symuluje, czy układ partycji pozwala na konwersję w locie):
    ```cmd
    mbr2gpt /validate /allowFullOS
    ```
2. **Etap 2 – Właściwa konwersja (_Bez powrotu_):**
    ```cmd
    mbr2gpt /convert /allowFullOS
    ```
3. **Etap 3 – Krytyczny Reboot UEFI:** System poinformuje, by natychmiast wykonać restart! Musisz szybko wejść do konfiguracji płyty głównej (klawisz <kbd>F2</kbd> / <kbd>DEL</kbd>) i zmienić ustawienie **Boot Mode z trybu *Legacy (CSM)* na *UEFI***. Jeśli tego nie zrobisz, BIOS spróbuje czytać stary Sektor $0$ MBR i system się nie załaduje, zgłaszając <span style="white-space:nowrap;">*„Boot Device Not Found”*.</span>

---

<data-gate>
  <data-quiz>
    <question>Technik z innego oddziału pyta Cię przez komunikator: „Przekonwertowałem dysk systemowy komputera z MBR na GPT za pomocą narzędzia MBR2GPT.exe. Konwersja zakończyła się sukcesem, ale po restarcie komputer wyświetla błąd 'No bootable device found'. Co zrobił nie tak?"</question>
    <options>
      <item>Uruchomione narzędzie MBR2GPT.exe uszkodziło pliki rozruchowe systemu, co wymaga wdrożenia nowego obrazu instalacyjnego Windows.</item>
      <item correct>Po konwersji dysku nie zmieniono trybu rozruchu (Boot Mode) w ustawieniach UEFI płyty głównej z Legacy (CSM BIOS) na czysty standard UEFI.</item>
      <item>Wielkość sektorów fizycznych nowego dysku uniemożliwiła poprawne odczytanie tablicy GPT przez stary kontroler w trybie automatycznym.</item>
      <item>Dla nowo powstałej tablicy partycji GPT należy pilnie wywołać procedurę chkdsk /f /r z poziomu zewnętrznego środowiska WinRE.</item>
    </options>
    <div data-hint="error">
      Wskazówka: Zwróć uwagę, jak zmiana typu tablicy partycji z MBR na GPT wpływa na sposób, w jaki płyta główna odnajduje system operacyjny podczas startu komputera.
    </div>
    <div data-hint="success">
      Dokładnie! Konwersja na GPT wymusza przejście na nowoczesny standard startu UEFI. Płyta główna w trybie Legacy nie zrozumie partycji EFI. Przełączenie opcji Boot Mode na UEFI w ustawieniach płyty głównej natychmiast uruchomi system!
    </div>
  </data-quiz>
</data-gate>

---


### 📂 Systemy plików – jak Windows organizuje dane

System plików to „język”, którym partycja opisuje swoje pliki i foldery. Wybór systemu plików determinuje, co możesz zrobić z danym nośnikiem.

<data-tabs>
  <tabs>
    <item>NTFS</item>
    <item>exFAT</item>
    <item>FAT32</item>
    <item>ReFS</item>
  </tabs>
  <div>

### NTFS – Domyślny, transakcyjny system plików Windows

**New Technology File System** – standard dla wszystkich wewnętrznych dysków Windows od wersji $\text{NT/}2000$. Działa w sposób w pełni transakcyjny (dziennikowany).

| Cecha | Wartość |
| :--- | :--- |
| Maks. rozmiar pliku | $16\text{ TB}$ (teoretycznie $256\text{ TB}$) |
| Maks. rozmiar woluminu | $256\text{ TB}$ |
| Dziennikowanie (journaling) | ✅ Tak (transakcyjność) |
| Uprawnienia plików (ACL) | ✅ Tak (Maksymalne bezpieczeństwo) |
| Szyfrowanie systemowe | ✅ Tak (EFS - Encrypting File System & BitLocker) |
| Kompresja w locie | ✅ Tak |
| Kompatybilność z macOS | ⚠️ Tylko odczyt (zapis wymaga dodatkowego oprogramowania zewnętrznego) |

**Kiedy użyć:** Zawsze na dyskach wewnętrznych (systemowych i danych) w środowisku Windows.

#### ⚙️ Główne filary technologiczne NTFS:
- **Dziennikowanie** (*Journaling*): Przed fizycznym zapisaniem zmian (np. pliku), NTFS zapisuje tę transakcję w specjalnym ukrytym pliku dziennika (`$LogFile`). Jeśli nastąpi nagła awaria zasilania, system przy następnym rozruchu odczytuje dziennik i natychmiast przywraca spójność struktury plików w ułamku sekundy, zapobiegając uszkodzeniu całego systemu plików.
- **Uprawnienia ACL** (*Access Control Lists*): Pozwalają na precyzyjne definiowanie, którzy użytkownicy lub grupy mogą odczytywać, zapisywać, modyfikować lub wykonywać konkretne pliki i foldery (Karta <kbd class="win-menu-btn">Zabezpieczenia</kbd> we właściwościach pliku).
- **Szyfrowanie EFS** (*Encrypting File System*): Pozwala na szyfrowanie pojedynczych plików lub folderów za pomocą certyfikatu przypisanego do konta konkretnego użytkownika Windows.

  </div>
  <div>

### exFAT – Optymalny standard dla pamięci przenośnych

**Extended File Allocation Table** – stworzony przez Microsoft specjalnie z myślą o szybkich pamięciach flash (pendrive'y, karty SD, dyski zewnętrzne SSD).

| Cecha | Wartość |
| :--- | :--- |
| Maks. rozmiar pliku | $16\text{ EB}$ (eksa-bajty; brak praktycznego limitu) |
| Maks. rozmiar woluminu | $128\text{ PB}$ (peta-bajty) |
| Dziennikowanie | ❌ Nie |
| Uprawnienia plików (ACL) | ❌ Nie |
| Szyfrowanie systemowe | ❌ Brak natywnego EFS (ale pełne wsparcie dla **BitLocker To Go**!) |
| Kompatybilność | ✅ Windows, macOS, Linux, konsole (PS5/Xbox), telewizory |

**Kiedy użyć:** Pendrive'y i dyski zewnętrzne, które muszą bezproblemowo wymieniać pliki między systemami Windows a macOS/Linux.

> [!IMPORTANT]
> **Dlaczego exFAT nie ma dziennika?**
> Brak dziennikowania to świadoma decyzja inżynieryjna. Dziennik NTFS generuje ogromną liczbę drobnych, ciągłych zapisów metadanych. Na pamięciach flash (pendrive'ach) drastycznie przyspieszyłoby to fizyczne zużycie komórek pamięci i skróciło żywotność urządzenia.
> 
> **Konsekwencja:** Brak dziennika sprawia, że exFAT jest wysoce podatny na uszkodzenia w przypadku nagłego wyciągnięcia nośnika z portu USB podczas zapisu. Zawsze używaj opcji **„Bezpieczne usuwanie sprzętu”**! 
> 
> **BitLocker To Go:** Choć exFAT nie posiada zaawansowanych zabezpieczeń plików (ACL/EFS), Windows 11 pozwala w pełni zaszyfrować cały nośnik za pomocą technologii **BitLocker To Go** (dostępnej w wersjach Pro/Enterprise).

  </div>
  <div>

### FAT32 – Kompatybilny weteran IT

**File Allocation Table 32** – system plików z $1996$ roku (debiutował w Windows 95 OSR2), wciąż obecny w świecie IT wyłącznie ze względów kompatybilności wstecznej.

| Cecha | Wartość |
| :--- | :--- |
| Maks. rozmiar pliku | **$4\text{ GB}$** ⚠️ (Krytyczny limit!) |
| Maks. rozmiar woluminu | $2\text{ TB}$ (Windows formatuje fabrycznie tylko do $32\text{ GB}$) |
| Dziennikowanie | ❌ Nie |
| Uprawnienia plików (ACL) | ❌ Nie |
| Kompatybilność | ✅ Działa ze wszystkim, co posiada port USB (nawet z bardzo starym sprzętem) <br> PS. Nie próbuj z pralką. 🤫 |

**Kiedy użyć:** Tylko gdy urządzenie docelowe bezwzględnie wymaga FAT32 – np. starsze radia samochodowe, starsze telewizory, systemy plików w mikrokontrolerach lub partycja rozruchowa EFI (ESP) w Windowsie!

> [!CAUTION]
> **Pułapka $4\text{ GB}$:** To klasyczne zgłoszenie helpdeskowe. Klient przynosi pendrive 64 GB i mówi: *„Mam 40 GB wolnego miejsca, ale system zgłasza błąd braku miejsca przy próbie skopiowania filmu 5 GB”*.
> - Diagnoza: pendrive ma system plików FAT32. 
> - Rozwiązanie: przeformatuj nośnik na exFAT.

> [!TIP]
> **$32\text{ GB}$ vs $2\text{ TB}$ w FAT32?**
> Ograniczenie do $32\text{ GB}$ dla FAT32 to sztuczna blokada wprowadzona celowo w interfejsie graficznym (`diskmgmt.msc`) Windowsa jeszcze w czasach Windows 2000, by zniechęcić ludzi do tego systemu plików i wymusić powszechną migrację na NTFS.
> Narzędziami 3rd-party (firm trzecich), DiskPartem lub spod Linuxa bez problemu sformatujesz w FAT32 partycje wielkości $128\text{ GB}$ czy nawet $2\text{ TB}$, a sam Windows bez żadnego problemu zamontuje je w systemie do odczytu i zapisu!

  </div>
  <div>

### ReFS – Odporność i przyszłość pod kątem serwerów i deweloperów

**Resilient File System** – zaawansowany system plików Microsoftu, zaprojektowany z myślą o maksymalnej spójności, odporności na ciche uszkodzenia danych oraz potężnych serwerowych magazynach danych (typu Big Data).

| Cecha | Wartość |
| :--- | :--- |
| Maks. rozmiar pliku | $35\text{ PB}$ (peta-bajty) |
| Samonaprawa (Integrity Streams) | ✅ Tak (pełna detekcja i korekcja uszkodzeń) |
| Bootowalny | ❌ Nie (Windows nie potrafi uruchomić się z ReFS) |
| Szyfrowanie | ✅ Tak (BitLocker) |
| Klonowanie bloków (Copy-on-Write) | ✅ Tak (Block Cloning) |

**Kiedy użyć:** Storage Spaces (Miejsca do magazynowania), serwery bazodanowe, maszyny wirtualne Hyper-V oraz **Dev Drive** w Windows 11.

### 🛡️ Samonaprawa i walka z „Bit Rot” (Cichym uszkodzeniem danych):
ReFS wykorzystuje sumy kontrolne (checksums) do ciągłej weryfikacji integralności bloków danych i metadanych. Zdolność do automatycznej naprawy wymaga odpowiedniej konfiguracji sprzętowej:
1. **Pojedynczy dysk z ReFS:** Jeśli posiadasz tylko jeden dysk z ReFS, system wyłapie błąd sumy kontrolnej (*Bit Rot*) i po prostu uniemożliwi odczyt. Bez lustrzanej kopii na innej partycji/dysku nie będzie jednak w stanie go naprawić.
2. **ReFS połączony z macierzą Storage Spaces:** Magia ReFS ujawnia się w pełni, gdy połączysz go wirtualnie w technologii Storage Spaces (Miejsca do magazynowania) tworząc Pulę Lustrzaną (Mirror) zbudowaną z dwóch fizycznych dysków. W tym zintegrowanym środowisku:
   - Przy żądaniu odczytu pliku ReFS weryfikuje w locie jego sumę kontrolną na Dysku nr 1.
   - Jeśli wykryje, że bit "zgnił" (suma się nie zgadza), zrzuca błąd i ignoruje dane.
   - Natychmiast i bez wstrzymywania procesu użytkownika uderza do bliźniaczego Dysku nr 2, pobiera stamtąd poprawny pakiet, dostarcza go do procesora i potajemnie naprawia w tle zgniły sektor na <span style="white-space:nowrap">Dysku nr 1.</span>

### 🚀 Dev Drive w Windows 11 – ReFS dla programistów:
Windows 11 (od wersji 23H2) pozwala na stworzenie dedykowanej partycji programistycznej **Dev Drive** opartą na ReFS. Zapewnia ona:
- **Copy-on-Write (Block Cloning):** Klonowanie ogromnych repozytoriów kodu lub plików maszyn wirtualnych odbywa się w milisekundach, ponieważ system plików tworzy jedynie nowe wskaźniki bez fizycznego kopiowania bloków danych na dysku.
- **Asynchroniczny tryb Microsoft Defender:** Dedykowany tryb antywirusowy dla Dev Drive redukuje narzut skanowania operacji wejścia/wyjścia plików tymczasowych (np. folderów `node_modules`, cache kompilatora), przyspieszając kompilację kodu nawet o **$30\text{--}40\\%$**!

  </div>
</data-tabs>

---

<data-gate>
  <data-quiz>
    <question>Pracownik z działu deweloperskiego zgłasza: „Zbudowanie naszego projektu w Node.js zajmuje mi na nowym laptopie z Windows 11 aż 5 minut. Wszyscy na Linuxie robią to w 3 minuty. Czy mój dysk SSD NVMe jest uszkodzony?”. Co zrobisz jako inżynier?</question>
    <options>
      <item>Zlecisz fizyczną wymianę dysku NVMe oraz płyty głównej w serwisie, podejrzewając sprzętowe uszkodzenie kontrolera pamięci.</item>
      <item>Zalecisz całkowite wyłączenie ochrony antywirusowej Microsoft Defender w systemie, aby wyeliminować skanowanie w locie.</item>
      <item correct>Utworzysz dedykowaną partycję Dev Drive z systemem ReFS, oferującą asynchroniczne skanowanie antywirusowe i Block Cloning.</item>
      <item>Zaproponujesz zmianę formatu całego dysku systemowego z NTFS na exFAT, co skróci czas operacji wejścia-wyjścia na plikach.</item>
    </options>
    <div data-hint="error">
      Wskazówka: Całkowite wyłączenie antywirusa w firmie to poważne ryzyko bezpieczeństwa, a SSD NVMe rzadko wykazuje tak specyficzne, stabilne spowolnienie. Pomyśl o nowej funkcji Windows 11, zaprojektowanej specjalnie dla deweloperów.
    </div>
    <div data-hint="success">
      Świetna diagnoza! Dev Drive to rewelacyjna funkcja Windows 11 stworzona dokładnie pod takie scenariusze. Wykorzystanie ReFS (Block Cloning/Copy-on-Write) oraz przełączenie Defendera w tryb asynchroniczny (bezpieczny dla systemu, wydajny dla kodu) redukuje narzut kompilacji o $30\text{–}40\\%$!
    </div>
  </data-quiz>
</data-gate>

---

## 🧰 Zarządzanie dyskami (diskmgmt.msc)

To **centralny panel** do zarządzania wszystkimi dyskami i partycjami w systemie. Otwierasz go na kilka sposobów:
- **Skrót klawiszowy:** Naciśnij <kbd class="Win"></kbd> + <kbd>X</kbd> → wybierz **Zarządzanie dyskami**
- **Uruchom (Run):** Naciśnij <kbd class="Win"></kbd> + <kbd>R</kbd> → wpisz `diskmgmt.msc` i zatwierdź klikając <kbd>Enter</kbd>.
- **Eksplorator plików:** Przejdź do katalogu `C:\Windows\System32`, odnajdź plik `diskmgmt.msc` i uruchom go bezpośrednio.

![Programik diskmgmt.msc w folderze System32](/public/courses/windows-11/Images/plik-diskmgmt.msc.webp)

### 🪟 Co zobaczysz w oknie?

Interfejs przystawki podzielony jest na dwie główne sekcje robocze:
- _**Górna sekcja (Lista woluminów):**_ Tabela przedstawiająca litery dysków, systemy plików (NTFS, exFAT, FAT32 itp.), pojemności, wolną przestrzeń oraz stan zdrowia.
- *Dolna sekcja (Mapa graficzna dysków):* Wizualny podział każdego fizycznego nośnika na poszczególne logiczne partycje, systemy plików oraz nieprzydzielone miejsce.

![Interfejs panelu Zarządzanie dyskami z podziałem na sekcje](/public/courses/windows-11/Images/diskmgmt.webp)

### 🎨 Identyfikacja wizualna i statusy dysku:
- **Kolory woluminów:** System Windows stosuje kodowanie kolorystyczne dla szybkiego rozpoznania woluminów: np. ciemnoniebieski pasek oznacza **wolumin prosty**, fioletowy to **wolumin łączony** (*Spanned*), natomiast cyjanowy to wolumin *RAID-$5$*.
    
    ![System kodowania kolorów woluminów w Windows](/public/courses/windows-11/Images/wolumin-color.webp)
- **Przestrzeń nieprzydzielona:** Czarna linia oznacza obszar fizyczny nośnika, który nie należy do żadnej partycji.
- **Statusy dysków fizycznych:**
    - **_Nie zainicjowany:_** Dysk jest widoczny sprzętowo, ale nie ma jeszcze tablicy partycjonowania (MBR/GPT) lub jest ona uszkodzona.
    - **Online:** Dysk jest gotowy do operacji zapisu i odczytu przez system operacyjny.
    - *Offline:* Dysk jest wyłączony z użytku, ale dalej żre prąd.

---

### 🗺️ Ukryte partycje Windows 11 – dlaczego NIE wolno ich ruszać

Gdy otworzysz `diskmgmt.msc` na nowo zainstalowanym komputerze, obok głównego dysku `C:` zobaczysz kilka dodatkowych partycji, które nie posiadają przypisanej litery dysku i powinny być ukryte w Eksploratorze plików. 

Klienci często dzwonią na Helpdesk:  
*„Widzę w Menedżerze jakieś partycje $100\text{ MB}$ i $500\text{ MB}$. Mogę je usunąć, żeby scalić je z dyskiem `C:`?”*.  
Jako inżynier musisz stanowczo odmówić i wyjaśnić ich rolę:

| Nazwa partycji | Typowy rozmiar | Rola i konsekwencje usunięcia |
| :--- | :--- | :--- |
| **EFI System Partition (ESP)** | <span style="white-space:nowrap">$\approx 100\text{--}260\text{ MB}$</span> | **Partycja rozruchowa.** Zawiera bootloader systemu Windows (pliki `.efi`). Jeśli ją usuniesz, **komputer nie uruchomi się w ogóle** (brak pliku rozruchowego w trybie UEFI). |
| **MSR (Microsoft Reserved)** | <span style="white-space:nowrap">$\approx 16\text{ MB}$</span> | **Partycja zarezerwowana.** Windows używa jej jako podręcznego bufora do operacji partycjonowania i konwersji dysków podstawowych na dynamiczne / Storage Spaces. |
| **Recovery Partition (WinRE)** | <span style="white-space:nowrap">$\approx 500\text{--}700\text{ MB}$</span> | **Partycja odzyskiwania.** Zawiera miniaturowy system operacyjny Windows Recovery Environment. Umożliwia diagnostykę, resetowanie hasła, przywracanie obrazu oraz naprawę systemu przy awarii bez użycia zewnętrznego pendrive'a instalacyjnego. |

---

### 🛎️ Inicjowanie nowych dysków fizycznych

Gdy podłączysz do komputera całkowicie nowy dysk twardy prosto ze sklepu i nie zobaczysz go w Eksploratorze plików.  
W przystawce `diskmgmt.msc` będzie oznaczony czerwoną strzałką jako **_Nie zainicjowany_**.

![Inicjalizacja nowo wykrytego dysku fizycznego](/public/courses/windows-11/Images/init-new-disk.png)

Windows automatycznie wyświetli okno pop-up z pytaniem o **Inicjalizację dysku**. Będziesz musiał dokonać wyboru tablicy partycji. Wybór jest oczywisty, bierz styl GPT. 🥸

> [!CAUTION]
> **Inicjalizacja czyści dysk!**
> Jeśli podłączasz stary dysk z innego komputera w celu zgrania danych i system krzyczy, że dysk wymaga inicjalizacji – **_pod żadnym pozorem tego nie rób!_** ✋🏻 Oznacza to uszkodzenie metadanych tablicy partycji. W takim scenariuszu użyj specjalnego oprogramowania do ratowania danych.

---

### 💿 Wirtualne dyski twarde (VHD / VHDX) – Dyski ukryte w pliku

Wirtualne dyski twarde (**VHD** – Virtual Hard Disk oraz nowszy **VHDX**) to pliki o specjalnym formacie, które system Windows potrafi zamontować w taki sposób, jakby były fizycznie podłączonymi do komputera dyskami twardymi. Zyskują one osobną literę dysku w Eksploratorze i mogą być swobodnie partycjonowane oraz formatowane.

#### 🔬 Różnica: VHD vs VHDX:
- **VHD:** Starszy format. Obsługuje wirtualne dyski o maksymalnej pojemności do **$2\text{ TB}$**.
- **VHDX:** Nowoczesny format wprowadzony w Windows 8. Obsługuje dyski o pojemności do **$64\text{ TB}$**. Jest znacznie bardziej odporny na uszkodzenia danych przy nagłych utratach zasilania dzięki wbudowanemu dziennikowaniu zmian metadanych (journaling).

### 🛠️ Jak utworzyć i zainicjować dysk VHD/VHDX w Windows 11:

1.  W przystawce `diskmgmt.msc` kliknij w górnym menu <kbd class="win-menu-btn">Akcja</kbd> $\rightarrow$ <kbd class="win-menu-btn">Utwórz dysk VHD</kbd>.
2.  Wskaż fizyczną ścieżkę zapisu pliku (np. `E:\Plik_Dysku_Wirtualnego.vhd`).
3.  Określ wirtualny rozmiar dysku (np. $300\text{ MB}$).
4.  Wybierz typ dysku wirtualnego:
    - *Stały rozmiar (Fixed size):* Windows natychmiast wyrezerwuje plik o wybranej pojemności ($300\text{ MB}$) na Twoim fizycznym dysku. Zapewnia to wyższą i stabilniejszą wydajność zapisu/odczytu.
    - *Dynamicznie powiększający się (Dynamic expanding):* Plik na dysku fizycznym na początku będzie zajmował zaledwie kilka megabajtów i będzie rósł automatycznie wraz z fizycznym dodawaniem plików do wirtualnego dysku.  
    **Oszczędza miejsce na dysku fizycznym!**

![Kreator tworzenia nowego wirtualnego dysku VHD/VHDX](/public/courses/windows-11/Images/nowy-vhd.webp)

5.  Po kliknięciu **OK** wirtualny dysk zostanie podpięty, z charakterystyczną błękitną ikonką.
6.  Kliknij PPM na jego nazwę po lewej stronie i wybierz **Zainicjuj dysk…**, wskazując styl partycjonowania GPT.
7.  Kliknij PPM na czarny obszar nieprzydzielony i stwórz **Nowy wolumin prosty** formatując go jako NTFS lub exFAT.

![Inicjalizacja i partycjonowanie wirtualnego dysku VHD](/public/courses/windows-11/Images/init-new-virtual-disk.png)

> [!IMPORTANT]
> **Automatyczne odmontowywanie VHD:**
> Gdy zrestartujesz komputer, system Windows **automatycznie odmontuje** wszystkie wirtualne dyski VHD/VHDX. Aby ponownie uzyskać do nich dostęp, musisz albo dwukrotnie kliknąć plik `.vhdx` w Eksploratorze plików, albo podpiąć go ponownie w przystawce (<kbd class="win-menu-btn">Akcja</kbd> $\rightarrow$ <kbd class="win-menu-btn">Dołącz dysk VHD</kbd>).
>
> **Jak to zautomatyzować?**
> Uruchom Harmonogram zadań i stwórz zadanie uruchamiane przy starcie systemu z najwyższymi uprawnieniami, wykonujące prostą komendę PowerShell:
> ```powershell
> Mount-DiskImage -ImagePath "C:\DyskWirtualny.vhdx"
> ```

---

<data-gate>
  <data-quiz>
    <question>Podczas analizy dysków w diskmgmt.msc zauważyłeś trzy ukryte partycje bez przypisanych liter dysków: EFI (ESP), MSR oraz Recovery (WinRE). Która z nich jest kluczowa, aby komputer z Windows 11 w ogóle mógł załadować system operacyjny?</question>
    <options>
      <item correct>Partycja EFI (ESP) o pojemności ok. $100\text{–}260\text{ MB}$ – przechowuje bootloader systemu Windows (.efi) wymagany do startu w trybie UEFI.</item>
      <item>Partycja Recovery (WinRE) o rozmiarze ok. $500\text{–}700\text{ MB}$ – przechowuje główne jądro systemu oraz sterowniki potrzebne przy rozruchu.</item>
      <item>Partycja MSR (Microsoft Reserved) o wielkości $16\text{ MB}$ – odpowiada bezpośrednio za rozruch interfejsu graficznego powłoki Explorer.</item>
      <item>Żadna z nich – wszystkie te partycje są opcjonalne i można je usunąć w DiskPart, scalając wolne miejsce bezpośrednio z dyskiem C:.</item>
    </options>
    <div data-hint="error">
      Wskazówka: Zastanów się, gdzie system operacyjny przechowuje pliki startowe (.efi) niezbędne do uruchomienia bootloadera w nowoczesnych maszynach UEFI. Usunięcie której z tych partycji wywoła błąd 'No bootable device'?
    </div>
    <div data-hint="success">
      Dokładnie! Partycja systemowa EFI (ESP) przechowuje pliki bootloadera niezbędne dla interfejsu UEFI do zainicjowania rozruchu systemu Windows 11. Jej usunięcie sprawi, że komputer wyświetli błąd braku urządzenia rozruchowego.
    </div>
  </data-quiz>
</data-gate>

---

### 🔬 Typy dysków: Podstawowy vs Dynamiczny

Podczas inicjalizacji nowego dysku w `diskmgmt.msc` Windows domyślnie tworzy dysk **Podstawowy** (*Basic*). Tradycyjnie system Windows oferował również technologię dysków **Dynamicznych** (*Dynamic*) do tworzenia woluminów wielodyskowych. Obecnie technologia ta jest przestarzała (**_zdeprecjonowana_**) i zastępowana przez **Miejsca do magazynowania** (*Storage Spaces*).

`diskmgmt.msc` to dalej funkcjonalna przystawka systemu Windows z grupy Legacy support. Chodź istnieje i działa nie bedzie już dalej rozwijana. Microsoft zaleca używanie do wszystkich nowych operacji z dyskami **Storage Spaces**. Zwłaszcza przy programowalnych macierzach dyskowych (RAID).  
Sytuacja jest podobna jak w przejściu z MBR na GPT. Utworzenie macierzy RAID w `diskmgmt.msc` wymaga konwersji dysków na dynamiczne podobnie jak w MBR tworzymy partycje rozszerzone i na niej kolejne logiczne. Natomiast Storage Spaces pozwalają na tworzenie macierzy RAID bez konwersji dysków na dynamiczne.   

> [!IMPORTANT]
> ⚠️ **_Status i ograniczenia dysków dynamicznych w Windows 11:_**
> 1. **Brak wsparcia w Windows 11 Home:** Ta edycja systemu w ogóle nie obsługuje dysków dynamicznych. Próba konwersji lub importu takiego dysku zakończy się niepowodzeniem.
> 2. **Deprecjacja technologii:** Microsoft oficjalnie wycofuje wsparcie dla dysków dynamicznych. Używanie ich (szczególnie jako dysków systemowych/rozruchowych) może powodować poważne błędy podczas aktualizacji systemu Windows (np. kod błędu `0x80070001`).

---

### 🗃️ Kluczowe operacje w panelu diskmgmt.msc i RAID-y
(PPM - prawy przycisk myszy na wolumin):

> [!NOTE]
> **Redundancja** - Nadmiarowość danych, czyli tworzenie kopii zapasowej danych w celu zapewnienia ciągłości pracy w przypadku awarii sprzętu.

<data-tabs>
  <tabs>
    <item>Zmniejsz/Rozszerz</item>
    <item>Wolumin Prosty</item>
    <item>Wolumin Łączony</item>
    <item>Wolumin Rozłożony</item>
    <item>Wolumin Dublowany</item>
    <item>Wolumin RAID-5</item>
  </tabs>
  <div>

### Zmniejszanie i Rozszerzanie Woluminów

- **Zmniejsz wolumin (*Shrink Volume*):** PPM na wolumin $\rightarrow$ **Zmniejsz wolumin**. Pozwala odciąć wolne miejsce z końca partycji i zamienić go na obszar *Nie przydzielone*. Windows nie przesunie plików zablokowanych (pliki stronicowania, hibernacji itp.).
- **Rozszerz wolumin (*Extend Volume*):** PPM na wolumin $\rightarrow$ **Rozszerz wolumin**. Kreator pozwala powiększyć partycję o sąsiadujące po prawej stronie nieprzydzielone miejsce.
    - *Szary przycisk?* Jeśli pomiędzy Twoją partycją a nieprzydzielonym miejscem znajduje się inny wolumin (np. partycja odzyskiwania), rozszerzenie w GUI jest zablokowane.

  </div>
  <div>

### Wolumin Prosty (Podstawowy)

**Wolumin prosty** to podstawowa konfiguracja, która wykorzystuje przestrzeń na jednym fizycznym dysku. Jest najłatwiejszy do zarządzania i idealny do codziennego przechowywania danych.
- **Zastosowanie:** Dysk systemowy, standardowa partycja na dane na jednym nośniku.

![Kreator woluminu prostego w diskmgmt](/public/courses/windows-11/Images/diskmgmt.msc_wolumin_prosty.webp)


  </div>
  <div>

### Wolumin Łączony (Spanned / JBOD)

**Wolumin łączony** pozwala połączyć wolne obszary z kilku dysków fizycznych (mogą to być nośniki o różnych rozmiarach i interfejsach) w jeden wspólny logiczny wolumin przypisany pod jedną literę dysku. 

![Schemat JBOD bez redundancji](/public/courses/windows-11/Images/JBOD.webp)

:::diagram
Schemat przedstawia logiczny rozkład danych w architekturze woluminu łączonego JBOD (Just a Bunch of Disks) bez redundancji, zilustrowany na przykładzie trzech fizycznych dysków.
:::

**Opis strukturalny diagramu**

1. **Struktura dysków fizycznych** – macierz składa się z trzech nośników: *`Dysk 1`* ($30 \text{ GB}$), **`Dysk 2`** ($10 \text{ GB}$) oraz _**`Dysk 3`**_ ($20 \text{ GB}$).
2. **Rozmieszczenie Pliku A (kolor pomarańczowy)** – bloki oznaczające plik A (od `A1` do `A8`) są zapisane szeregowo na nośnikach: bloki `A1`-`A6` zapełniają cały *`Dysk 1`*, natomiast bloki `A7`-`A8` przechodzą na początek przestrzeni dyskowej **`Dysk 2`**.
3. **Rozmieszczenie Pliku B (kolor zielony)** – bloki oznaczające plik B (od `B1` do `B6`) rozpoczynają się na dysku **`Dysk 2`** (bloki `B1`-`B4`), a ich końcowa część `B5`-`B6` jest zapisana na dysku _**`Dysk 3`**_.
4. **Wolna przestrzeń (kolor niebieski)** – pozostała część dysku _**`Dysk 3`**_ jest oznaczona jako wolna/nieprzydzielona przestrzeń logiczna woluminu.

- **Mechanizm zapisu:** Dane są zapisywane szeregowo – najpierw zapełniany jest do końca pierwszy dysk, a potem system płynnie zaczyna zapisywać na kolejnym.
- **Redundancja:** ❌ Brak (RAID JBOD - Just a Bunch of Disks). 
- **Ryzyko:** Jeśli ulegnie awarii **choćby jeden** z połączonych dysków fizycznych, uszkodzeniu ulega cała struktura logiczna woluminu i **tracisz dostęp do wszystkich danych** z całej puli!

#### Kreator w Windows 11
![Kreator woluminu łącznego w diskmgmt](/public/courses/windows-11/Images/diskmgmt.msc_wolumin_lonczony.webp)

  </div>
  <div>

### Wolumin Rozłożony (Striped / RAID $0$)

**Wolumin rozłożony** (paskowany) łączy wolną przestrzeń z co najmniej dwóch (maksymalnie $32$) fizycznych dysków twardych. Wymaga dysków o tej samej pojemności (zostaną zrównane do najmniejszego wspólnego mianownika).

![Schemat zapisu danych w RAID 0](/public/courses/windows-11/Images/RAID_0.webp)

:::diagram
Schemat przedstawia podział i naprzemienne rozmieszczenie danych (Striping) w macierzy RAID $0$. Porównuje strukturę zapisu plików na macierzy dwudyskowej (po lewej) oraz czterodyskowej (po prawej).
:::

**Opis strukturalny diagramu**

1. **Konfiguracja dwudyskowa (po lewej)** – Plik A (żółte bloki `A1`-`A4`) i Plik B (zielone bloki `B1`-`B4`) są rozdzielone naprzemiennie: *`Dysk 1`* przechowuje bloki nieparzyste (`A1`, `A3` oraz `B1`, `B3`), a **`Dysk 2`** bloki parzyste (`A2`, `A4` oraz `B2`, `B4`). Wolna przestrzeń oznaczona jest na niebiesko.
2. **Konfiguracja czterodyskowa (po prawej)** – Paski plików są rozproszone na cztery nośniki (*`Dysk 1`*, **`Dysk 2`**, _**`Dysk 3`**_, **_`Dysk 4`_**). Blok `A1` trafia na _`Dysk 1`_, `A2` na **`Dysk 2`**, `A3` na _**`Dysk 3`**_, `A4` na **_`Dysk 4`_**, `A5` z powrotem na _`Dysk 1`_ itd.
3. **Zasada działania** – Zapis i odczyt odbywają się równolegle ze wszystkich dysków w macierzy, co zwielokrotnia wydajność, lecz awaria dowolnego dysku niszczy spójność całego woluminu.

- **Mechanizm zapisu:** Dane są dzielone na równe bloki (paski) i zapisywane / odczytywane **jednocześnie (równolegle)** na wszystkich dyskach puli.
- **Wydajność:** 🚀 Ekstremalnie wysoka (prędkość sumuje się w zależności od liczby dysków).
- **Redundancja:** ❌ Brak.
- **Ryzyko:** Najniebezpieczniejszy wolumin! Awaria pojedynczego dysku niszczy bezpowrotnie wszystkie dane na całym woluminie rozłożonym. Używaj wyłącznie do danych tymczasowych, cache kompilatora lub scratch dysków.

#### Kreator w Windows 11
![Kreator woluminu rozłożonego w diskmgmt](/public/courses/windows-11/Images/diskmgmt.msc_wolumin_rozlozony.webp)

  </div>
  <div>

### Wolumin Dublowany (Mirrored / RAID $1$)

**Wolumin dublowany** (zwierciadlany) powiela te same dane w czasie rzeczywistym na dwóch fizycznych dyskach twardych. Wymaga co najmniej dwóch dysków (ich pojemność zostanie zrównana do pojemności mniejszego dysku).

![Schemat dublowania danych w RAID 1](/public/courses/windows-11/Images/RAID_1.webp)

:::diagram
Schemat przedstawia strukturę macierzy RAID $1$ (Mirroring / Dublowanie). Porównuje zapis zwierciadlany dla układu dwudyskowego (po lewej) oraz czterodyskowego (po prawej).
:::

**Opis strukturalny diagramu**

1. **Układ dwudyskowy (po lewej)** – Plik A (żółte bloki `A1`-`A2`) i Plik B (zielone bloki `B1`-`B2`) są zapisywane identycznie na obu nośnikach. Zarówno *`Dysk 1`*, jak i **`Dysk 2`** zawierają dokładnie tę samą sekwencję bloków (`A1`, `A2`, `B1`, `B2`).
2. **Układ czterodyskowy (po prawej)** – Wszystkie cztery nośniki (*`Dysk 1`*, **`Dysk 2`**, _**`Dysk 3`**_, **_`Dysk 4`_**) przechowują dokładnie te same kopie bloków danych w tej samej strukturze.
3. **Pojemność i odporność** – Całkowita pojemność macierzy jest równa pojemności pojedynczego dysku (najmniejszego w puli), ale macierz toleruje awarię $N-1$ dysków (gdzie $N$ to liczba dysków w macierzy).

- **Mechanizm zapisu:** Każdy plik zapisywany na tym woluminie jest fizycznie zapisywany w dwóch identycznych kopiach równolegle na obu nośnikach.
- **Wydajność:** Odczyt może ulec przyspieszeniu (system odczytuje dane z dwóch dysków jednocześnie), zapis pozostaje na poziomie prędkości wolniejszego dysku.
- **Redundancja:** ✅ Pełna. Odporność na całkowite uszkodzenie jednego z dysków fizycznych.
- **Zastosowanie:** Przechowywanie krytycznych baz danych, ważnych dokumentów firmowych.

#### Kreator w Windows 11
![Kreator woluminu dublowanego w diskmgmt](/public/courses/windows-11/Images/diskmgmt.msc_wolumin_dublowany.webp)

  </div>
  <div>

### 🛡️ Wolumin RAID-$5$ (Parzystość)

Przeglądając Kreator w Menedżerze Dysków na Windows 11, zauważysz opcję **„Nowy wolumin RAID-$5$”**. Jest ona jednak całkowicie zablokowana (wyszarzona).

![Schemat rozpraszania sum kontrolnych w RAID 5](/public/courses/windows-11/Images/RAID_5.webp)

:::diagram
Schemat przedstawia rozkład danych oraz bloków parzystości (XOR) w macierzy RAID $5$. Porównuje strukturę zapisu dla układu trójdyskowego (po lewej) oraz czterodyskowego (po prawej).
:::

**Opis strukturalny diagramu**

1. **Układ trójdyskowy (po lewej)** – Bloki parzystości (bloki z literą `p`) są rozproszone rotacyjnie:
  - Pierwszy wiersz: Dane `A1` (*`Dysk 1`*), `A2` (**`Dysk 2`**), Parzystość `Ap` (_**`Dysk 3`**_).
  - Drugi wiersz: Dane `B1` (*`Dysk 1`*), Dane `B2` (_**`Dysk 3`**_), Parzystość `Bp` (**`Dysk 2`**).
  - Trzeci wiersz: Dane `C1` (**`Dysk 2`**), Dane `C2` (_**`Dysk 3`**_), Parzystość `Cp` (*`Dysk 1`*).
2. **Układ czterodyskowy (po prawej)** – W każdym wierszu dane zajmują 3 dyski, a parzystość jeden dysk, która rotuje w lewo w każdym kolejnym wierszu (bloki `Ap` na **_`Dysku 4`_**, `Bp` na _**`Dysku 3`**_, `Cp` na **`Dysku 2`**, `Dp` na *`Dysku 1`*).
3. **Tolerancja błędów** – Uszkodzenie jednego dowolnego dysku pozwala na odtworzenie brakujących danych za pomocą operacji logicznych XOR na pozostałe nośniki.

- **Zasada działania:** Dane oraz sumy kontrolne (parzystość) są rozpraszane na min. $3$ dyskach fizycznych. Awaria jednego z dysków nie powoduje utraty danych, ponieważ system potrafi je odtworzyć z równań parzystości w locie.
- **Dlaczego zablokowana?** Systemy klienckie Windows 11 mają celowo zablokowaną możliwość tworzenia tradycyjnych woluminów RAID-$5$. Ta funkcja jest zarezerwowana wyłączenie dla wersji serwerowych (np. **Windows Server 2025**).

#### Kreator w Windows Server $2025$
![Kreator woluminu RAID-5 w diskmgmt](/public/courses/windows-11/Images/diskmgmt.msc_wolumin_RAID-5.webp)

  </div>
</data-tabs>

---

Aby dopełnić Twoją wiedzę o infrastrukturze RAID spotykanej na rynku, poznaj pozostałe konfiguracje:

<data-tabs>
  <tabs>
    <item>RAID 5E / 5EE (Hot-Spare)</item>
    <item>RAID 6 (Podwójna Parzystość)</item>
    <item>RAID 10 (Hybryda)</item>
    <item>RAID 1E (Zmodyfikowane Lustro)</item>
  </tabs>
  <div>

### RAID $5$E oraz $5$EE (Parzystość z Hot-Spare)

Podstawowy RAID $5$ potrafi przetrwać awarię jednego dysku fizycznego z puli. Gdy dysk padnie, macierz staje się podatna na utratę danych przy awarii kolejnego dysku, a administrator musi udać się do serwerowni i włożyć sprawny dysk do zatoki.

RAID $5$E i $5$EE rozwiązują ten problem implementując specjalny mechanizm wolnych bloków zapasowych (**Hot Spare**) rozsianych na pozostałych napędach.

![Schemat strukturalny RAID 5E z blokami zapasowymi](/public/courses/windows-11/Images/RAID_5E_5EE.webp)

:::diagram
Schemat strukturalny porównuje rozkład bloków danych, parzystości oraz obszaru zapasowego (Hot-Spare) w macierzach RAID $5$E (po lewej) oraz RAID $5$EE (po prawej).
:::

**Opis strukturalny diagramu**

1. **Struktura RAID $5$E (po lewej)** – Macierz składa się z czterech dysków fizycznych. Bloki danych i parzystości (`p`) są ułożone rotacyjnie na górze, natomiast dedykowany obszar zapasowy Hot-Spare jest wydzielony jako jednolity, niebieski pasek zajmujący dolny wiersz na wszystkich czterech dyskach (`Spare` na dole każdego dysku).
2. **Struktura RAID $5$EE (po prawej)** – Wolna przestrzeń zapasowa nie tworzy jednolitego dolnego wiersza. Bloki zapasowe `Spare` są rozproszone rotacyjnie i wplecione bezpośrednio w strukturę macierzy na każdym poziomie wierszy, naprzemiennie z blokami danych i parzystości.
**Korzyść funkcjonalna** – Rozproszenie bloków zapasowych w RAID $5$EE przyspiesza proces rekonstrukcji (rebuildu) macierzy po awarii w porównaniu do RAID $5$E, ponieważ operacje zapisu kontrolera są bardziej zrównoważone na wszystkich sprawnych nośnikach.


- **Zasada działania:** Macierz posiada stałą rezerwę wolnego miejsca na wypadek awarii (zamiast pustego dysku czekającego na użycie). W ułamek sekundy po awarii nośnika, RAID $5$E natychmiast rozpoczyna automatyczną odbudowę rozbitej parzystości na pozostałych, wolnych sektorach. 
- **Zalety:** Natychmiastowe skrócenie okna utraty danych. Nie musisz zrywać się w nocy z łóżka do serwerowni.

  </div>
  <div>

### RAID $6$ (Podwójna Parzystość)

Podczas odbudowywania RAID-u $5$ obciążenie dysków rośnie w sposób ekstremalny (trzeba odczytać gigabajty danych z wszystkich pozostałych nośników, co może trwać dni w przypadku nośników $12\text{ TB}$). Ten potężny wysiłek odczytu nierzadko sprawia, że w trakcie odbudowy... zawodzi kolejny dysk, całkowicie niszcząc bazę danych! Odpowiedzią jest RAID $6$.

![Schemat działania RAID 6 - Podwójna parzystość](/public/courses/windows-11/Images/RAID_6.webp)

:::diagram
Schemat przedstawia logikę podwójnej parzystości rozproszonej w macierzy RAID $6$ na przykładzie czterech fizycznych dysków.
:::

**Opis strukturalny diagramu**

1. **Rozkład bloków parzystości** – W każdym wierszu danych znajdują się dwie niezależne sumy kontrolne parzystości oznaczone literami `p` oraz `q`:
   * Wiersz 1: 
     - Dane `A1` *`Dysk 1`*,
     - Dane `A2` **`Dysk 2`**,
     - parzystość `Ap` _**`Dysk 3`**_,
     - Parzystość `Aq` **_`Dysk 4`_**,
   * Wiersz 2: 
     - Dane `B1` *`Dysk 1`*,
     - parzystość `Bp` **`Dysk 2`**,
     - parzystość `Bq` _**`Dysk 3`**_,
     - Dane `B2` **_`Dysk 4`_**.
   * Wiersz 3: 
     - Parzystość `Cp` *`Dysk 1`*,
     - parzystość `Cq` **`Dysk 2`**,
     - Dane `C1` _**`Dysk 3`**_,
     - Dane `C2` **_`Dysk 4`_**.
2. **Podział ról** – Parzystość `p` jest wyliczana zazwyczaj za pomocą prostej sumy XOR, natomiast parzystość `q` przy użyciu bardziej złożonego algorytmu (np. kodu Reeda-Solomona).
3. **Tolerancja awarii** – Dzięki obecności dwóch różnych sum kontrolnych w każdym rzędzie, macierz potrafi bezstratnie funkcjonować nawet przy jednoczesnej fizycznej awarii dwóch dowolnych dysków.

- **Zasada działania:** Podobnie jak RAID $5$, z tą różnicą, że system tworzy i rozprasza aż **dwa oddzielne bloki sum kontrolnych**. 
- **Korzyść:** Pozwala na jednoczesną awarię **aż dwóch dysków fizycznych** bez utraty pojedynczego pliku!
- **_Wady:_** Niższa efektywność pamięci i większy narzut obliczeniowy dla procesora.  
Wymaga co najmniej $4$ dysków do uruchomienia.

  </div>
  <div>

### RAID $10$ ( Hybryda $1 + 0$)

Najbardziej bezkompromisowe rozwiązania łączące bezpieczeństwo danych z najwyższą możliwą prędkością operacji bazodanowych – tzw. RAIDy hybrydowe (Lustro Paskowane). 

- **RAID $10$:** Wymaga min. $4$ dysków. Najpierw dyski łączone są w bezpieczne, odporne na awarie pary lustrzane (RAID $1$). Następnie takie zmirrorowane pary są zbijane w wydajnościowy, superszybki RAID $0$. Zapewnia rewelacyjną prędkość odczytu/zapisu dla najcięższych baz SQL.
![Konstrukcja RAID 10](/public/courses/windows-11/Images/RAID_10.webp)

:::diagram
Schemat przedstawia strukturę macierzy hybrydowej RAID $10$ (RAID $1+0$) zbudowanej z czterech dysków fizycznych, łączącej techniki mirroring i striping.
:::

**Opis strukturalny diagramu**

1. **Warstwa nadrzędna (RAID $0$)** – u góry schematu znajduje się główny podział danych (striping) na paski. Dane są kierowane równolegle do dwóch niezależnych gałęzi.
2. **Podgrupy lustrzane (RAID $1$)** – w środkowej części schemat dzieli się na dwie niezależne pary RAID $1$:
   * **Lewa para**: Przechowuje zduplikowane bloki `A1`, `A3` oraz `B1`, `B3` (*`Dysk 1`* jest lustrzaną kopią **`Dysku 2`**).
   * **Prawa para**: Przechowuje zduplikowane bloki `A2`, `A4` oraz `B2`, `B4` (_**`Dysk 3`**_ jest lustrzaną kopią **_`Dysku 4`_**).
3. **Odporność na uszkodzenia** – Macierz toleruje uszkodzenie jednego dysku w każdej parze RAID 1. Uszkodzenie np. Dysku 1 i Dysku 3 nie powoduje utraty danych, ale jednoczesne uszkodzenie Dysku 1 i Dysku 2 (cała lewa para) niszczy całą macierz.
> RAIDy Hybrydowe odczytujemy od podstawy do góry. 
> W tym przypadku mamy dwa RAIDy $1$ złączone w jeden RAID $0$.

</div>
<div>

### RAID $1\text{E}$ (Zmodyfikowane Lustro)

Jest to zaawansowana wersja lustra, która potrafi efektywnie wykorzystać nieparzystą liczbę dysków (np. $3$ lub $5$). Zamiast tworzyć idealne kopie 1:1, system stosuje technikę zwaną **przesuniętym lustrem** (*shifted mirroring*). Każdy blok danych ma swój dubel, ale jest on zapisywany na sąsiednim dysku w strukturze szachownicy (ang. *checkerboard*).  

**Korzyść:** Oferuje wydajność zbliżoną do RAID $0$ przy zachowaniu bezpieczeństwa RAID $1$, ale jest bardziej elastyczny pod kątem liczby fizycznych nośników.

![Porównanie RAID 1E względem 1 i 0](/public/courses/windows-11/Images/RAID_1E-względem-RAID1-i-RAID0.webp)

:::diagram
Schemat porównuje strukturę trzech technologii zapisu: RAID $1\text{E}$ (lustro przesunięte, po lewej), RAID $1$ (klasyczne lustro, pośrodku) oraz RAID $0$ (paski, po prawej), ilustrując rozmieszczenie bloków danych na poszczególnych dyskach.
:::

**Opis strukturalny diagramu**

1. **RAID $1\text{E}$ (Przesunięte lustro) – po lewej stronie** – ukazuje trzy dyski (Dysk 1, Dysk 2, Dysk 3), na których dane są rozproszone z przesunięciem (szachownica):
  - Blok `A1` znajduje się na *`Dysku 1`* i **`Dysku 2`**, blok `A2` na *`Dysku 1`* i _**`Dysku 3`**_, a blok `A3` na **`Dysku 2`** i _**`Dysku 3`**_.
  - Analogicznie bloki danych `B`: `B1` na *`Dysku 1`* i **`Dysku 2`**, `B2` na *`Dysku 1`* i _**`Dysku 3`**_, a `B3` na **`Dysku 2`** i _**`Dysku 3`**_.
2. **RAID $1$ (Klasyczne lustro) – pośrodku** – ukazuje dwa dyski (Dysk 1 i Dysk 2) z identycznym, równoległym układem bloków: oba dyski przechowują dokładnie tę samą sekwencję danych (`A1`, `A2`, `B1`, `B2`).
3. **RAID $0$ (Paski) – po prawej stronie** – ukazuje dwa dyski (Dysk 3 i Dysk 4), na których dane są podzielone i rozłożone naprzemiennie:
  - **`Dysk 3`** przechowuje bloki nieparzyste (`A1`, `A3`, `B1`, `B3`).
  - **_`Dysk 4`_** przechowuje bloki parzyste (`A2`, `A4`, `B2`, `B4`).

  </div>
</data-tabs>

---

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="RAID 0 (Striped)" data-right="Maksymalna wydajność dzięki paskowaniu danych na dyskach, ale brak jakiejkolwiek odporności na awarie (awaria 1 dysku niszczy wszystkie dane)."></div>
    <div class="cmw-item" data-left="RAID 1 (Mirrored)" data-right="Klasyczne lustro 1:1. Dane są dublowane na dwóch dyskach; wysoka niezawodność kosztem straty 50% całkowitej pojemności."></div>
    <div class="cmw-item" data-left="RAID 5" data-right="Dane i parzystość rozproszone na minimum 3 dyskach. Odporność na awarię 1 dowolnego dysku przy zachowaniu dobrego stosunku pojemności do ceny."></div>
    <div class="cmw-item" data-left="RAID 6" data-right="Dwie niezależne sumy kontrolne parzystości rozproszone na minimum 4 dyskach. Odporność na jednoczesną awarię 2 dowolnych dysków."></div>
    <div class="cmw-item" data-left="RAID 10 (1+0)" data-right="Hybryda łącząca pary lustrzane (RAID 1) w jeden wydajny wolumin rozłożony (RAID 0). Oferuje bardzo wysokie I/O i szybki rebuilding."></div>
  </data-connection-matcher>
</data-gate>

---

## 🛡️ Miejsca do magazynowania (Storage Spaces)

Windows 11 posiada wbudowaną technologię **Miejsca do magazynowania (Storage Spaces)**. Pozwala ona na połączenie wielu fizycznych dysków twardych (o różnych pojemnościach i interfejsach, np. SATA i USB) w jedną **pulę pamięci (Storage Pool)**, a następnie tworzenie z niej wirtualnych dysków o określonym poziomie odporności na awarie.

To nowoczesny, elastyczny i znacznie bezpieczniejszy następca klasycznego RAID-u programowego znanego z dysków dynamicznych z Menedżera Dysków (`diskmgmt.msc`).

Miejsca do magazynowania natywnie wspierają odpowiedniki RAID $0$ i RAID $1$ opisane wyżej, a co najważniejsze – odblokowują pełną moc tworzenia macierzy z parzystością na konsumenckim Windows 11! 

### 🛢️ Konfiguracja miejsc do magazynowania (Storage Spaces)

1. W panelu sterowania zmień widok na duże ikony i kliknij w <kbd class="win-menu-btn">Miejsca do magazynowania</kbd>.  
Następnie kliknij w <kbd class="link-os-windows">Utwórz pulę i miejsce do magazynowania</kbd>

![Panel sterowania - Miejsca do magazynowania](/public/courses/windows-11/Images/miejsce-do-magazynowania-panel-sterowania.png)
2. Zobaczysz tu wszystkie dyski podstawowe (bez tych przekonwertowanych na dynamiczne i bez `C:\`). Jeżeli jakiś dysk posiada wolumin prosty to system zgrupuje go do poniższej sekcji z ostrzeżeniem o utracie danych. Po zaznaczeniu dysków, które chcesz dodać do puli kliknij w przycisk <kbd class="win-menu-btn">Utwórz pulę</kbd>

![Panel sterowania - Miejsca do magazynowania - tworzenie puli](/public/courses/windows-11/Images/miejsce-do-magazynowania-panel-sterowania-tworzenie-puli.png)
3. Główne ustawienia, które powinny cię zainteresować to typ odporności i rozmiar (maksymalny):
| Typ odporności | Odpowiednik RAID | Liczba dysków | Wymagana dodatkowa przestrzeń redundantna | Odporność na awarie |
|---|---|---|---|---|
| Proste (brak odporności) | JBOD | $1+$ | $0\\%$ | $0$ dysków |
| Dublowany dwustopniowo | RAID $1$ | $2+$ | $100\\%$ | $1$ dysk |
| Dublowany trzystopniowo | RAID $1$ z dodatkowymi blokami | $5+$ | $200\\%$ | $2$ dyski |
| Parzystość | RAID $5$ | $3+$ | $33\\%$ | $1$ dysk |

![Panel sterowania - Miejsca do magazynowania - konfiguracja puli](/public/courses/windows-11/Images/miejsce-do-magazynowania-panel-sterowania-konfiguracja-puli.png)

4. Poniżej widzisz jak to wygląda w `diskmgmt.msc` z dynamicznym dyskiem $3$, którego pula nie widziała.

![Panel sterowania - Miejsca do magazynowania - konfiguracja puli](/public/courses/windows-11/Images/miejsce-do-magazynowania-porównanie-z-dyskiem-dynamicznym-w-diskmgmt.msc.png)

5. Gdy ponownie wejdziesz w miescja magazynowania to utworzoną pulę możeszwykonć następujące akcje:
  - <kbd class="link-os-windows">Utwórz miejsce do magazynowania</kbd> - Tworzysz nową logiczną przestrzeń korzystającą z tych samych dysków fizycznych w puli magazynu.
  - <kbd class="link-os-windows">Dodaj dyski</kbd> - Rozbudowujesz pulę o nowe dyski fizyczne.
  - <kbd class="link-os-windows">Zmień nazwę puli</kbd> - Zmieniasz nazwę puli.
  - <kbd class="link-os-windows">Optymalizuj użycie dysku</kbd> - Windows przeanalizuje rozmieszczenie danych i optymalnie je rozmieści na dyskach w puli. Ta akcja jest wykonywana każdorazowo gdy dodasz lub usuniesz fizyczny dysk z puli.

![Miejsca do magazynowania - konfiguracja puli - rozbudowa puli](/public/courses/windows-11/Images/miejsce-do-magazynowania-panel-sterowania-zarządzenie-rekonfiguracja.png)

---

<data-gate>
  <data-quiz>
    <question>Klient chce skonfigurować w systemie Windows 11 pulę Storage Spaces o wysokiej odporności z parzystością (odpowiednik RAID $5$). Jaka jest minimalna liczba fizycznych dysków, które musi wpiąć do komputera, aby utworzyć takie miejsce do magazynowania?</question>
    <options>
      <item>$1$ dysk fizyczny</item>
      <item>$2$ dyski fizyczne</item>
      <item correct>3$ dyski fizyczne</item>
      <item>$5$ dysków fizycznych</item>
    </options>
    <div data-hint="error">
      Wskazówka: Zastanów się, w jaki sposób rozkładane są dane oraz sumy kontrolne parzystości w odpowiedniku RAID $5$. Ile minimalnie nośników jest wymaganych, aby móc rozproszyć te informacje w taki sposób, by awaria jednego z nich nie zniszczyła całości?
    </div>
    <div data-hint="success">
      Znakomicie! Zarówno klasyczny RAID $5$, jak i jego implementacja w Storage Spaces (Parzystość) wymaga podłączenia co najmniej $3$ dysków fizycznych, aby móc wydajnie rozpraszać dane oraz sumy kontrolne parzystości.
    </div>
  </data-quiz>
</data-gate>

---

## ⌨️ DiskPart – partycjonowanie z poziomu CMD

Gdy graficzny interfejs zawodzi (pendrive jest zablokowany, dysk ma uszkodzoną tablicę partycji w stanie RAW lub pracujesz w środowisku instalatora Windows 11), sięgasz po **DiskPart** – narzędzie wiersza poleceń.

> [!CAUTION]
> DiskPart to narzędzie bezkompromisowe. Nie wyświetla komunikatów typu *„Czy na pewno chcesz usunąć dane?”*. Komenda `clean` natychmiast zeruje sektory rozruchowe. Zawsze zweryfikuj wybrany nośnik za pomocą `list disk` przed uruchomieniem poleceń niszczących!

### 🛠️ Ręczna inicjalizacja surowego dysku krok po kroku:
```cmd
diskpart
list disk                          ← wyświetla fizyczne dyski (identyfikuj po pojemności!)
select disk 1                      ← wybiera dysk o indeksie 1 (Bądź niesamowicie ostrożny!)
clean                              ← usuwa tablicę partycji (szybkie czyszczenie)
create partition primary           ← tworzy partycję podstawową na całym obszarze
format fs=ntfs quick               ← szybkie formatowanie w NTFS (dla exFAT wpisz fs=exfat)
assign letter=E                    ← przypisuje wolną literę E
exit                               ← opuszcza narzędzie DiskPart
```

#### 🔬 Różnica: clean vs clean all:
- **`clean`:** Kasuje wyłącznie tablicę partycji i informacje o sektorach rozruchowych (pierwsze i ostatnie megabajty dysku). Trwa ułamek sekundy. Dane nadal fizycznie leżą na nośniku i można je odzyskać specjalnym oprogramowaniem.
- **`clean all`:** Nadpisuje **każdy pojedynczy sektor dysku zerami**. Trwa bardzo długo (nawet kilka godzin w przypadku HDD). Całkowicie uniemożliwia odzyskanie danych i pozwala na fizyczne przetestowanie zapisu każdej komórki dysku. Idealne przed sprzedażą komputera lub dysku!

---

## 🔍 chkdsk i Repair-Volume – diagnostyka oraz naprawa logicznych błędów dysku

Gdy dysk zaczyna działać niestabilnie, pliki znikają lub system zgłasza błędy wejścia/wyjścia (**I/O**) po nagłym wyłączeniu komputera, uruchamiamy **Check Disk (`chkdsk`)**. Tę operację wywołujemy, gdy wiemy już, że struktura dysku istnieje, partycje są założone, a awarii uległa jedynie warstwa bitowa samego systemu plików.

#### Sposób użycia (Konsola CMD uruchomiona jako Administrator):
- `chkdsk E:` $\rightarrow$ Skanuje dysk E w trybie tylko do odczytu (raportuje błędy, ale ich nie naprawia).
- `chkdsk E: /f` $\rightarrow$ Skanuje i **naprawia błędy** w strukturze systemu plików.
- `chkdsk E: /f /r /x` $\rightarrow$ Najbardziej agresywny tryb inżynieryjny:
    - `/f` – naprawia strukturę logiczną plików.
    - `/r` – lokalizuje uszkodzone sektory (bad sectors) na powierzchni dysku, próbuje odzyskać z nich dane i oznacza je jako wyłączone z użytku, by system więcej na nich nie zapisywał.
    - `/x` – wymusza natychmiastowe odmontowanie woluminu przed skanowaniem, zwalniając wszelkie blokady procesów w tle.

#### ⚙️ Diagnostyka i szybka naprawa (Repair-Volume) w PowerShell:
Nowoczesne wersje Windows 11 pozwalają na bezinwazyjne diagnozowanie systemu plików w locie oraz błyskawiczną naprawę (zamiast wielogodzinnego klasycznego `chkdsk`) za pomocą cmdletu `Repair-Volume`:

- **Weryfikacja/Skanowanie w tle (w pełni online):**
  ```powershell
  Repair-Volume -DriveLetter C -Scan
  ```
  Skanuje wolumin w tle podczas normalnej pracy systemu. Jeśli znajdzie błędy, rejestruje je w metadanych systemu plików (NTFS self-healing) bez blokowania dostępu do dysku.

- **Skanowanie i naprawa (offline w razie potrzeby):**
  ```powershell
  Repair-Volume -DriveLetter C -OfflineScanAndFix
  ```
  Skanuje wolumin i w razie wykrycia problemów przełącza go na chwilę w tryb offline, by je naprawić (lub planuje szybką naprawę przy restarcie, jeśli dotyczy to dysku systemowego `C:`).

- **Szybka naprawa punktowa (Spot Fix):**
  ```powershell
  Repair-Volume -DriveLetter C -SpotFix
  ```
  Błyskawicznie naprawia wyłącznie błędy wcześniej wykryte i zarejestrowane przez polecenie z parametrem `-Scan`. Wymaga odmontowania woluminu tylko na kilka sekund.

---

## 🕵️ Scenariusze diagnostyczne Helpdesku

Dopasuj zgłoszony przez użytkownika objaw do poprawnego rozwiązania:

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Klient mówi: 'Pendrive nie daje się sformatować w Eksploratorze, wyskakuje błąd ochrony zapisu'." data-right="Użyj DiskPart: select disk X → clean → create partition primary → format fs=exfat quick."></div>
    <div class="cmw-item" data-left="Nowo podłączony dysk SSD 2 TB M.2 nie pojawia się w oknie Ten komputer." data-right="Otwórz diskmgmt.msc – dysk wymaga inicjalizacji (styl GPT) i utworzenia nowego woluminu."></div>
    <div class="cmw-item" data-left="Klient nie może zapisać pliku ISO 6 GB na pendrive, chociaż ma 30 GB wolnego miejsca." data-right="Nośnik sformatowany w starym FAT32 (limit 4 GB na plik) – przeformatuj go na exFAT."></div>
    <div class="cmw-item" data-left="Po nagłym odcięciu prądu system Windows ładuje się bardzo wolno i sypie błędami zapisu plików." data-right="Uruchom konsolę jako Administrator i wykonaj chkdsk C: /f /r w celu naprawy błędów systemu plików."></div>
    <div class="cmw-item" data-left="Chcesz powiększyć dysk C: o nieprzydzielone miejsce, ale opcja Rozszerz wolumin jest szara." data-right="Wolna przestrzeń nie sąsiaduje z woluminem C bezpośrednio po prawej – usuń partycję blokującą lub użyj GParted."></div>
  </data-connection-matcher>
</data-gate>

---

> [!TIP]
> **Złota Zasada Helpdeskowego Partycjonowania:**
> Zanim dotkniesz tablicy partycji lub uruchomisz jakiekolwiek polecenie DiskPart na komputerze klienta – **zawsze upewnij się, że posiadasz aktualną kopię zapasową (backup)** najważniejszych danych! Operacje niskopoziomowe są z natury obarczone ryzykiem (np. nagły spadek napięcia w sieci w trakcie zapisu tablicy partycji) i mogą bezpowrotnie zniszczyć strukturę logiczną dysku.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Różnica między formatem a protokołem:** Sam format fizyczny złącza (M.2) nie definiuje prędkości dysku – nośnik M.2 może korzystać ze starego protokołu SATA (AHCI) lub nowoczesnego NVMe (PCIe). Jako inżynier zawsze weryfikuj typ klucza (fizycznego wycięcia) oraz to, jaki protokół (SATA czy PCIe) obsługuje dane gniazdo na płycie głównej. 🔌
- **Standard GPT vs MBR:** Windows 11 do startu bezwzględnie wymaga tablicy GPT oraz włączonego trybu UEFI. MBR to przestarzały standard ograniczony do $2\text{ TB}$ i $4$ partycji podstawowych. Inżynierskie narzędzie `MBR2GPT.exe` pozwala na bezstratną konwersję systemu w locie w zaledwie kilkanaście sekund. 🗺️
- **Sztuczne limity systemów plików:** Powszechny limit $32\text{ GB}$ dla formatowania FAT32 w Windows to jedynie zaszłość historyczna GUI Menedżera Dysków. FAT32 technologicznie obsługuje woluminy do $2\text{ TB}$. Z kolei exFAT jest idealny dla pamięci USB z uwagi na obsługę plików $>4\text{ GB}$, jednak brak dziennika (*journaling*) czyni go podatnym na uszkodzenia przy nagłym odłączeniu. 💾
- **Potęga ReFS i mechanizmu Storage Spaces:** Nowoczesny system plików ReFS potrafi w pełni uchronić dane przed cichym uszkodzeniem (*Bit Rot*), weryfikując sumy kontrolne plików w locie. Do pełnej automatycznej samonaprawy wymaga on jednak spięcia nośników w pulę lustrzaną (Mirror) w ramach wbudowanego w Windows 11 narzędzia *Storage Spaces*. 🛡️
- **DiskPart, chkdsk i Repair-Volume jako ostatnia linia obrony:** Gdy graficzny panel `diskmgmt.msc` zawodzi, inżynier Helpdesku sięga po terminal. Narzędzie `DiskPart` z komendą `clean all` pozwala na niskopoziomowe wyzerowanie każdego sektora dysku. Z kolei klasyczny `chkdsk /f /r /x` oraz nowoczesny, znacznie szybszy cmdlet `Repair-Volume` (ze skanowaniem w tle `-Scan` oraz szybką naprawą `-OfflineScanAndFix` / `-SpotFix`) bezkompromisowo diagnozują i naprawiają spójność logiczną partycji. 🧰

---

Skoro wiesz już jak dane są zalokowane i jak działają partycje, to czas je zabezpieczyć. Przechodzimy do **szyfrowania!** 🔑