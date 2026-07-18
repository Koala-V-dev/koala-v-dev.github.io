# Zarządzanie sprzętem i sterownikami
Zanim zaczniesz diagnozować „zdechłe” karty Wi-Fi czy znikające myszki USB, musisz zrozumieć anatomię systemu. Środowisko Windows nie jest monolitem. To warstwowa konstrukcja, w której każdy element ma ściśle wyznaczone granice i interfejsy.

Wyobraź sobie, że komputer to nie jeden wielki, bezładny program, ale wielopoziomowy budynek – a dokładniej **stożek**, w którym najwyższe piętra są bezpieczną, odizolowaną przestrzenią dla użytkownika, a sama podstawa to fizyczny krzem, kable i płynący w nich prąd. 

Aby w pełni i absolutnie zrozumieć tę architekturę, spójrz na poniższe dwa diagramy. Wprowadzają one nas krok po kroku od ogólnej zasady działania do technicznych szczegółów.

### Krok 1: Stożek i Pierścienie Bezpieczeństwa (Ring 3–0)
Pierwszy diagram przedstawia uproszczoną budowę systemu. Po lewej stronie widać tradycyjny, pionowy model stożka 3D, a po prawej – tzw. **pierścienie ochrony (Protection Rings)**. Te pierścienie to sprzętowy mechanizm bezpieczeństwa wbudowany w sam procesor (CPU), który fizycznie pilnuje uprawnień uruchamianego kodu:

![Budowa systemu operacyjnego. Po lewej stożek (Aplikacje i UI, User Mode, Sterowniki, Sprzęt fizyczny), po prawej diagram pierścieniowy(ring 3(user mode), ring 2 (sterowniki użytkownika), ring 1 (sterowniki jądra), ring 0(kernel))](/public/courses/windows-11/Images/budowa-systemu.png)

:::diagram
Schemat przedstawia architekturę bezpieczeństwa i strukturę warstwową systemu operacyjnego Windows. Po lewej stronie ukazano pionowy model stożka (od aplikacji użytkownika do warstwy fizycznej sprzętu), natomiast po prawej zaprezentowano model pierścieni ochrony procesora (od zewnętrznego Ring 3 do centralnego jądra w Ring 0).
:::

**Opis strukturalny diagramu**

1. **Pionowy model stożka (po lewej)** – ilustruje cztery warstwy systemu od góry do dołu: `APLIKACJE I UI` (tryb użytkownika), `STEROWNIKI` (pośredniczące w komunikacji), `JĄDRO` (rdzeń zarządzający) oraz `SPRZĘT FIZYCZNY` stanowiący podstawę całego układu.  
2. **Model pierścieniowy (po prawej)** – przedstawia sprzętowe pierścienie ochrony procesora (Ring 3–0):
   - **Ring 3 (zielony pierścień zewnętrzny)** – najbardziej odizolowany `TRYB UŻYTKOWNIKA (USER MODE)`, w którym działają aplikacje i pulpit.
   - **Ring 2** – warstwa przeznaczona dla bezpiecznych sterowników trybu użytkownika.
   - **Ring 1** – warstwa przeznaczona dla sterowników trybu jądra.
   - **Ring 0 (ciemnoniebieski rdzeń centralny)** – uprzywilejowany `TRYB JĄDRA (KERNEL MODE)`, w którym działa jądro systemu z bezpośrednim dostępem do sprzętu i pamięci.

*   **Ring 3 (Tryb Użytkownika / User Mode):** Najwyższy poziom izolacji (zielony pierścień zewnętrzny). Działają tu zwykłe aplikacje (np. przeglądarka, Discord, gry) oraz sam pulpit systemu Windows. Procesor zabrania stąd bezpośredniego dostępu do sprzętu i pamięci jądra. Jeśli program się zawiesi, system po prostu go zamyka i działa dalej.
*   **Ring 2 & Ring 1:** Zaprojektowane z myślą o sterownikach. W Windowsie w Ring 2 działają bezpieczne sterowniki trybu użytkownika (User-Mode Drivers), a w Ring 1 sterowniki trybu jądra (Kernel-Mode Drivers).
*   **Ring 0 (Tryb Jądra / Kernel Mode):** Rdzeń systemu z najwyższymi, nieograniczonymi uprawnieniami (ciemnoniebieski środek). Działa tu jądro systemu (kernel). Każda uruchomiona tu linijka kodu ma bezpośredni dostęp do procesora, pamięci RAM i sprzętu. Dlatego awaria w tej strefie jest krytyczna i natychmiast powoduje wyłączenie systemu (słynny niebieski ekran **BSOD**).

---

### Krok 2: Zaawansowany diagram architektoniczny (Jak to czytać?)
Skoro już rozumiesz podział na bezpieczny tryb użytkownika (Ring 3) i potężny tryb jądra (Ring 0), spójrz na drugi diagram. To **inżynieryjny diagram kołowy w rzucie 3D (krążek)**. Jest on podzielony na dwie połowy oraz centralny rdzeń:

![Architektura warstwowa systemu operacyjnego](/public/courses/windows-11/Images/warstwowy-diagram-systemu.png)

:::diagram
Zaawansowany diagram kołowy w rzucie 3D (wielowarstwowy krążek) obrazuje powiązania architektury warstwowej systemu operacyjnego. Górna część krążka reprezentuje oprogramowanie (Software), dolna – sprzęt komputerowy (Hardware), a centralna i boczne sekcje ukazują punkty styku oraz ścieżki przepływu danych.
:::

**Opis strukturalny diagramu**

1. **Strefa oprogramowania (górna połowa krążka)** – składa się z trzech koncentrycznych łuków: zewnętrznego pomarańczowego łuku `APLIKACJE I UI` (Ring 3), środkowego zielonego łuku `USER MODE` (Ring 3) oraz wewnętrznego ciemnoniebieskiego łuku `KERNEL MODE` (Ring 0/1).  
2. **Strefa sprzętowa (dolna połowa krążka)** – składa się z dwóch łuków: zewnętrznego czerwonego łuku `SPRZĘT FIZYCZNY` (np. procesor, pamięć RAM, karty rozszerzeń) oraz wewnętrznego żółtego łuku `HAL` (warstwa abstrakcji sprzętowej).  
3. **Kliny sterowników (fioletowe skrzydła po bokach)** – dwie symetryczne sekcje sterowników (Drivers) wychodzące ze środka krążka na boki. Przecinają one warstwy oprogramowania i łączą się bezpośrednio ze sprzętem fizycznym, omijając HAL dla maksymalnej wydajności (DMA).  
4. **Oś i rdzeń centralny (szary okrąg w środku tarczy)** – reprezentuje `BIOS/UEFI` (firmware startowy płyty), który stanowi punkt centralny, stykający się ze sterownikami (od góry) i HAL-em (od dołu).

*   **Górna połowa (Software):** Reprezentuje warstwy oprogramowania – od aplikacji na samej krawędzi, przez tryb użytkownika, jądro, aż po sterowniki w głębi.
*   **Dolna połowa (Hardware):** Reprezentuje sprzęt fizyczny komputera oraz warstwę jego abstrakcji (HAL).
*   **Boczne, fioletowe kliny sterowników:** Zwróć uwagę, że fioletowa warstwa sterowników rozchodzi się ze środka na lewo i prawo jak skrzydła, przecinając całe oprogramowanie i stykając się bezpośrednio z czerwonym sprzętem. Pokazuje to graficznie, jak sterowniki integrują cały stos i potrafią rozmawiać bezpośrednio z fizycznymi komponentami.

Zrozumienie tych styków to **klucz do 90% diagnostyki sprzętowej**:

### 1. Zewnętrzny krąg software: Aplikacje i UI (pomarańczowy łuk)
*   **Z czym się styka:** Wyłącznie z _**User Mode (zielony)**_.
*   Twoja przeglądarka Chrome, edytor kodu czy gra nie mają pojęcia, jaką masz płytę główną czy kartę sieciową. Są całkowicie odcięte od jądra i sprzętu fizycznego. Jeśli aplikacja chce np. zapisać plik, musi wysłać prośbę do bibliotek systemowych piętro niżej.

### 2. Środkowo-zewnętrzny krąg software: User Mode (zielony łuk)
*   **Z czym się styka:** Z _**Aplikacjami (pomarańczowy)**_, _**Kernel Mode (niebieski)**_ oraz bezpośrednio ze _**Sterownikami (fioletowe boczne kliny)**_.
*   Działają tu usługi systemowe, powłoka pulpitu (`explorer.exe`) i podstawowe interfejsy API systemu (np. `kernel32.dll`). To bezpieczna piaskownica Ring 3. Zielona warstwa styka się z fioletowymi klinami sterowników – to tu działają tzw. *User-Mode Drivers* (np. sterowniki drukarek czy prostych peryferii USB). Jeśli taki sterownik się zawiesi, Windows po cichu uruchomi go ponownie bez restartowania całego komputera.

### 3. Środkowo-wewnętrzny krąg software: Kernel Mode (niebieski łuk)
*   **Z czym się styka:** Z _**User Mode (zielony)**_ oraz ze _**Sterownikami (fioletowy)**_.
*   Prawdziwe serce systemu operacyjnego w Ring 0. To tu działa jądro (`ntoskrnl.exe`), które zarządza pamięcią RAM, przydziela czas procesora i dba o bezpieczeństwo. Kernel odbiera żądania z trybu użytkownika i zleca ich wykonanie sterownikom.

### 4. Wewnętrzny krąg software i boczne kliny: Sterowniki / Drivers (fioletowy)
*   **Z czym się styka:** Z prawie **_wszystkim_**! To absolutny łącznik całego systemu. Dotyka centralnego rdzenia _**BIOS/UEFI (7)**_, _**Kernel Mode (3)**_, _**User Mode (2)**_, _**HAL-a (5)**_ oraz bezpośrednio _**Sprzętu fizycznego (6)**_ po bokach.
*   Sterowniki to tłumacze. Odbierają abstrakcyjne żądania z jądra i zamieniają je na precyzyjne sygnały elektryczne i fizyczne komendy. Ponieważ większość sterowników działa w Ring 0, błąd w nich (np. odwołanie do nieprawidłowego adresu pamięci) to wyrok śmierci dla stacji – Windows natychmiast wyłącza system i wyświetla **_BSOD_** w celu ochrony fizycznych podzespołów.

### 5. Wewnętrzny krąg hardware: HAL / Hardware Abstraction Layer (żółty łuk)
*   **Z czym się styka:** Z _**BIOS/UEFI (szary rdzeń)**_, _**Sterownikami (fioletowe boczne kliny)**_ oraz leży na _**Sprzęcie fizycznym (czerwony)**_.
*   HAL (`hal.dll`) to biblioteka, która ukrywa przed jądrem różnice między płytami głównymi różnych producentów. Dzięki temu jądro Windowsa nie musi wiedzieć, jak konkretny producent zaprojektował linie przerwań na płycie – HAL daje ujednolicony interfejs.

### 6. Zewnętrzny krąg hardware: Sprzęt fizyczny (czerwony łuk)
*   **Z czym się styka:** Z _**HAL-em (żółty)**_ oraz bezpośrednio z _**fioletowymi klinami sterowników**_ po bokach.
*   Fizyczny krzem – procesor, RAM, kontroler grafiki, gniazda USB i dyski. Zwróć uwagę na kluczowy element: fioletowy styk sterowników ze sprzętem po bokach, który omija żółty HAL. Dla zachowania kosmicznej wydajności, sterowniki urządzeń o niskich opóźnieniach (np. karty graficzne przez PCIe, dyski NVMe) rozmawiają bezpośrednio z rejestrami sprzętu i pamięcią (DMA), omijając narzut warstwy HAL.

### 7. Centralny rdzeń: BIOS / UEFI (szary okrąg w samym środku)
*   **Z czym się styka:** Wyłącznie z _**Sterownikami (fioletowy)**_ od góry i _**HAL-em (żółty)**_ od dołu.
*   Oprogramowanie układowe (firmware) płyty głównej. Inicjalizuje sprzęt przy włączeniu zasilania komputera. Stanowi fizyczną i logiczną oś całego układu (centrum tarczy), na której po uruchomieniu komputera system Windows buduje swoje warstwy. Gdy system wystartuje, BIOS/UEFI usuwa się w cień.

---


### 🧨 Co się dzieje, gdy zawiesi się sterownik?

Gdy zawiesi się zwykła aplikacja (np. przeglądarka), można ją po prostu zamknąć i pracować dalej. W przypadku sterowników sytuacja zależy od tego, w którym **pierścieniu (Ring)** pracują:

*   **Sterowniki użytkownika (Ring 2):** Działają w bezpiecznej piaskownicy trybu użytkownika. Jeśli sterownik czujnika USB lub prostej drukarki ulegnie awarii, system Windows po prostu po cichu go zrestartuje. **Nie ma tu ryzyka BSOD** – komputer działa nieprzerwanie, a Ty co najwyżej na sekundę stracisz połączenie z urządzeniem (tzw. *lag*).
*   **Sterowniki jądra (Ring 1):** Działają w trybie uprzywilejowanym, bezpośrednio przy sercu systemu (Ring 0). Mają bezpośredni dostęp do sprzętu i pamięci jądra. Jeśli taki sterownik popełni krytyczny błąd (np. odwoła się do nieprawidłowego adresu w pamięci RAM), system Windows **natychmiast resetuje komputer i wyświetla BSOD** (*Blue Screen of Death*). Robi to celowo – to awaryjny hamulec bezpieczeństwa, który chroni podzespoły przed fizycznym uszkodzeniem lub utratą integralności danych.

---

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Krytyczna awaria kodu na tym poziomie (np. błąd pamięci) wywoła natychmiastowy i nieuchronny ekran BSOD." data-right="Kernel (Ring 0) &amp; Sterowniki jądra (Ring 1)."></div>
    <div class="cmw-item" data-left="Podczas normalnej pracy systemu operacyjnego ten moduł nie uczestniczy w operacjach I/O." data-right="BIOS / UEFI (firmware startowy płyty)."></div>
    <div class="cmw-item" data-left="Ta warstwa leży bezpośrednio na fizycznym krzemie, izolując go od ogólnego jądra." data-right="HAL (Hardware Abstraction Layer - hal.dll)."></div>
    <div class="cmw-item" data-left="Z powodu pełnej izolacji ta warstwa nie ma pojęcia o istnieniu karty graficznej czy dysku." data-right="Aplikacje i UI (najwyższy poziom Ring 3)."></div>
    <div class="cmw-item" data-left="Pracują w bezpiecznej piaskownicy trybu użytkownika, a ich zawieszenie nie wywołuje restartu całego systemu." data-right="Sterowniki użytkownika (Ring 2)."></div>
    <div class="cmw-item" data-left="Autostrada dla ultraszybkich urządzeń (np. GPU, NVMe), omijająca narzut warstw pośrednich." data-right="Sterowniki stykające się bezpośrednio ze Sprzętem."></div>
  </data-connection-matcher>
</data-gate>

---

## 🧠 Menedżer urządzeń

Głównym centrum zarządzania podzespołami jest panel o nazwie **Menedżer urządzeń**. Zobaczysz na nim wszystko, co w komputerze zamontowano. Możesz go uruchomić skrótem klawiszowym <kbd class="Win"></kbd> + <kbd>X</kbd> lub ręcznie wpisaną komendę `devmgmt.msc` w wyszukiwarce menu Windows lub oknie Uruchom (<kbd class="Win"></kbd> + <kbd>R</kbd>).

<data-tabs>
  <tabs>
    <item>Symbole i Kody Błędów</item>
    <item>Złe nawyki oszczędzania</item>
    <item>Widmowe urządzenia</item>
  </tabs>
  <div>
    
### Podstawowe symbole w Menedżerze urządzeń

| Symbol | Znaczenie | Opis |
| :--- | :--- | :--- |
| ![menadżer-urządzeń-!](/public/courses/windows-11/Images/menadżer-urządzeń-!.webp) | Problem z urządzeniem | Urządzenie zgłasza awarię. Wejdź we „Właściwości”, aby sprawdzić dany kod błędu i poznać więcej szczegółów działania. |
| ![menadżer-urządzeń-arrow-down](/public/courses/windows-11/Images/menadżer-urządzeń-arrow-down.webp) | Wyłączone urządzenie | Urządzenie zostało umyślnie wyłączone przez użytkownika lub sam system. Prąd tam i tak dociera lecz windows to ignoruje. |
| ![menadżer-urządzeń-i](/public/courses/windows-11/Images/menadżer-urządzeń-i.webp) | Ręczne ustawienia | Port lub układ na płycie działa na rzadziej spotykanych dziś, ręcznie ustawionych przerwaniach systemowych. |
| ![menadżer-urządzeń-znak-zapytania](/public/courses/windows-11/Images/menadżer-urządzeń-znak-zapytania.webp) | Brak dedykowanego sterownika | Urządzenia jeszcze nikt nie ustawił poprawnie, ponieważ brakuje głównego oprogramowania sprzętowego. |

<details>
<summary>Najczęstsze kody błędów Menedżera Urządzeń</summary>

| Kod błędu | Przyczyna | Rozwiązanie |
| :--- | :--- | :--- |
| 10 | Urządzenie nie może zostać uruchomione | <ul><li>Zrestartuj komputer.</li><li>Przeinstaluj sterownik.</li><li>Sprawdź zgodność sprzętu i ewentualne konflikty zasobów.</li></ul> |
| 12 | Konflikt zasobów (IRQ, adresy, DMA) | <ul><li>Odłącz zbędne urządzenia.</li><li>Zaktualizuj BIOS/UEFI.</li><li>Włącz „Użyj ustawień automatycznych” w Menedżerze urządzeń.</li></ul> |
| 19 | Uszkodzone wpisy rejestru sterownika | <ul><li>Usuń urządzenie i zainstaluj ponownie.</li></ul> |
| 22 | Urządzenie jest wyłączone | <ul><li>Włącz urządzenie w Menedżerze urządzeń.</li><li> Jeśli wyłącza się ponownie — sprawdź zasilanie lub sterownik.</li></ul> |
| 28 | Brak zainstalowanego sterownika | <ul><li>Pobierz sterownik od producenta.</li><li> Jeśli brak — użyj Windows Update lub sterownika zgodnego.</li></ul> |
| 31 | System nie może załadować sterownika | <ul><li>Przeinstaluj sterownik.</li><li>Sprawdź integralność systemu (SFC/DISM).</li></ul> |
| 32 | Sterownik został wyłączony w rejestrze | <ul><li>Włącz usługę/sterownik w rejestrze lub przeinstaluj urządzenie.</li></ul> |
| 37 | Sterownik nie załadował się poprawnie | <ul><li>Usuń urządzenie, zainstaluj ponownie.</li><li>Sprawdź, czy sterownik nie jest uszkodzony lub niezgodny.</li></ul> |
| 39 | Sterownik jest uszkodzony lub brakuje pliku | <ul><li>Przeinstaluj sterownik.</li><li> Jeśli problem wraca — pobierz wersję od producenta.</li></ul> |
| 43 | Urządzenie zgłosiło awarię | <ul><li>Odłącz i podłącz ponownie.</li><li>Zrestartuj komputer.</li><li>Zaktualizuj sterownik lub firmware.</li><li>Częste w GPU i USB.</li></ul> |
| 45 | Urządzenie jest odłączone | <ul><li>Podłącz urządzenie.</li><li>Jeśli nadal widoczne — usuń wpis i odśwież listę urządzeń.</li></ul> |
| 56 | Konflikt z usługą VPN lub filtrem sieciowym | <ul><li>Wyłącz VPN.</li><li>Usuń problematyczne oprogramowanie sieciowe.</li><li>Zrestartuj komputer.</li></ul> |
| 65 | Problem z konfiguracją urządzenia Bluetooth | <ul><li>Usuń urządzenie z listy BT, sparuj ponownie.</li><li>Zrestartuj usługę Bluetooth.</li></ul> |
| 110 | Błąd komunikacji z urządzeniem USB | <ul><li>Zmień port USB.</li><li>Użyj kabla o wyższej jakości.</li><li>Sprawdź zasilanie portów.</li></ul> |

</details>

</div>
<div>

### Problem: „Co jakiś czas rozłącza mi Wi-Fi / myszkę USB”

To jeden z najczęstszych problemów zgłaszanych na Helpdesku, szczególnie przez użytkowników laptopów. 

**Co się dzieje?**
*   Windows domyślnie próbuje **oszczędzać baterię**.
*   Robi to poprzez **wyłączanie zasilania** nieużywanych (jego zdaniem) portów USB oraz kart sieciowych.
*   Skutkuje to **losowym rozłączaniem Wi-Fi** co kilkanaście minut lub **zacinaniem się** myszek i klawiatur.

**Co wtedy kliknąć?**
Dwukrotnym kliknięciem wejdź we właściwości urządzenia „Główny koncentrator USB”, przejdź do zakładki „Zarządzanie energią” i odznacz opcję:  
<kbd class="check-mark-empty"></kbd> „Zezwalaj komputerowi na wyłączanie tego urządzenia w celu oszczędzania energii”.  
Taki prosty zabieg rozwiązuje $90\\%$ problemów z peryferiami!

![Zezwalaj komputerowi na wyłączanie tego urządzenia w celu oszczędzania energii](/public/courses/windows-11/Images/Zezwalaj-komputerowi-na-wyłączanie-tego-urządzenia-w-celu-oszczędzania-energii.webp)

> PS. myszki bezprzewodowe mają własne mechanizmy zarządzania energią, więc i tak będą się usypiać po czasie nieaktywności, mimo odznaczenia opcji w menadżerze urządzeń. 😒

</div>
<div>

### Pokazywanie ukrytych urządzeń

Zdarza się, że system odmawia przypisania np. wirtualnego portu `COM3` do nowego kabla.  
Dlaczego?  🤔
Bo Windows wciąż „pamięta” sterownik urządzenia, które podłączyłeś tam $3$ lata temu, i rezerwuje dla niego ten port! 

Aby to wyczyścić, w Menedżerze urządzeń wejdź w menu górne: **Widok** → **Pokaż ukryte urządzenia**. 

Szare, wyblakłe ikony to nazywane przez administratorów **Ghost Devices** (urządzenia widma). Ich usunięcie (PPM → **Odinstaluj urządzenie**) często błyskawicznie rozwiązuje konflikty USB i eliminuje problem „Nie rozpoznano urządzenia USB”.

Poniżej masz przykład – zobacz, jak Windows domyślnie zachowuje w pamięci sterownik dawno odłączonego smartfona Samsung:
![Pokaż ukryte urządzenia](/public/courses/windows-11/Images/pokaż-ukryte-urządzenia.webp)

</div>
</data-tabs>

---

## 🛠️ Akcje na sterownikach

Kliknięcie prawym klawiszem w element na liście wywoła menu kontekstowe.

<data-gate>
  <data-hotspot image="/public/courses/windows-11/Images/devmgmt-sterownik-przyklad.png">
    <hotspot x="30" y="31" title="Aktualizuj sterownik">
Automatyczne wyszukiwanie z reguły zawodzi. Profesjonalista wybiera „Przeglądaj mój komputer”.  <br>
Pobierasz spakowany folder (ZIP) ze strony producenta, wypakowujesz go i po prostu wskazujesz ten folder Windowsowi. System znajdzie w nim kluczowy plik z informacjami instalacyjnymi (`.inf`) i załaduje konfigurację.
    </hotspot>
    <hotspot x="48" y="34" title="Wyłącz urządzenie">
Blokuje działanie wybranego komponentu. Choć urządzenie nadal może być fizycznie zasilane, system operacyjny (kernel) ignoruje jego sygnały i nie przekazuje danych do aplikacji. Przykład: wyłączony mikrofon nie będzie dostępny w programach, mimo że jest podłączony. To samo dotyczy kamerki – nawet tej wbudowanej w laptopa, więc nie musisz jej zaklejać taśmą. 😅 <br><br>
...No nie koniecznie, jeżeli urządzenie z dowolnym systemem zostanie zainfekowane złośliwym oprogramowaniem klasy rootkit lub bootkit, to przestepca jest w stanie zrobić z takim sprzętem co mu sie podoba. Najbardziej problematyczne sprzęty z opcją odnajdywania nawet po wyłączeniu np. Applowskie *Finding My Devices*.
    </hotspot>
    <hotspot x="30" y="37" title="Odinstaluj urządzenie">
Usuwa sterownik i wszystkie powiązane z nim pliki z systemu. Po ponownym uruchomieniu system spróbuje zainstalować sterownik ponownie (automatycznie lub ręcznie). Jest to kluczowe do pozbycia się uszkodzonych lub niekompatybilnych wersji oprogramowania.
    </hotspot>
    <hotspot x="62" y="41" title="Skanuj w poszukiwaniu zmian sprzętowych">
Zmusza system do natychmiastowego odpytania wszystkich portów na płycie głównej (USB, PCIe) o nowy, podłączony sprzęt. Wykorzystywane, gdy np. po podłączeniu pendrive'a system nie reaguje automatycznie.
    </hotspot>
    <hotspot x="44" y="46" title="Właściwości">
Otwiera okno dialogowe z zaawansowanymi informacjami o urządzeniu. Zawiera ono kluczowe zakładki diagnostyczne, takie jak:
- „Ogólne” (status urządzenia), 
- „Sterownik” (wersja i data sterownika), 
- „Szczegóły” (w tym identyfikatory sprzętu – *Hardware IDs*) oraz 
- „Zdarzenia” (historia błędów i komunikatów systemowych, w tym kody błędów, np. *Code 43*).
    </hotspot>
  </data-hotspot>
</data-gate>

---

## 🕵️ Identyfikacja „Nieznanego urządzenia”

Gdy system nie ma właściwego pliku sterownika, układ figuruje na liście jako **Nieznane urządzenie**. Do jego rzetelnego zidentyfikowania wykorzystuje się **identyfikatory sprzętu (*Hardware IDs*)** zapisane w oprogramowaniu układowym.

Ścieżka weryfikacji w Menedżerze urządzeń:
1. Wejdź we **Właściwości** problematycznego komponentu.
2. Przejdź do zakładki **Szczegóły**.
3. Z listy *Właściwość* wybierz **Identyfikatory sprzętu**.

W oknie pojawi się ustrukturyzowany ciąg znaków wyglądający zazwyczaj tak:

`PCI\VEN_10DE&DEV_2504&SUBSYS...`

*   **`VEN_` (*Vendor ID*)**: Skrót nazwy producenta wbudowanego układu (np. płyty głównej, karty sieciowej).
*   **`DEV_` (*Device ID*)**: Skrót nazwy konkretnego modelu tego układu.

#### Jak z tego skorzystać na Helpdesku w $3$ sekundy?
1. Skopiuj sam początek kodu z najwyższej linijki (najlepiej wyciąć wyłącznie fragment `VEN_xxxx&DEV_xxxx`). 
2. Wklej to w swój czat AI (np. Gemini) z zapytaniem: *„Czego to sterownik: [wklejony kod]?”* lub wrzuć w okno wyszukiwarki bazy [PCILookup.com](https://www.pcilookup.com/) lub [DeviceHunt.com](https://devicehunt.com/).
3. Od razu dostaniesz dokładną odpowiedź co do modelu np.:  
*„$\text{Dla podanego kodu DEV to karta sieciowa Intel AX}201$”*. 
4. Wpisujesz wynik w Google i pobierasz jedyny słuszny instalator bezpośrednio ze strony producenta (np. Intel).

> [!CAUTION]
> **Metoda przeznaczona WYŁĄCZNIE dla tzw. podzespołów wewnętrznych** komputera (Wi-Fi, układy audio, karty graficzne, chipset, czytniki pod obudową). 
> 
> Nie trać czasu na sprawdzanie kodów sprzętu zwykłych klawiatur, myszek czy pendrive'ów. Te urządzenia operują na uniwersalnych i natywnych sterownikach samego systemu Windows (tzw. klasa *Mass Storage* i *HID*). Jeśli po podpięciu pendrive'a instalacja „nie idzie”, to wina ukrytych, zablokowanych portów Menedżera (tzw. „duchów” – o których czytałeś wcześniej), zepsutego gniazda USB albo śmierci samej pamięci.

---

## 🛠️ Szybka diagnostyka

Dopasuj objaw do rozwiązania:

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Mysz USB lub połączenie Wi-Fi losowo przestaje reagować na laptopie." data-right="Wejdź w Zarządzanie energią urządzenia i odznacz oszczędzanie baterii."></div>
    <div class="cmw-item" data-left="W systemie wisi Nieznane urządzenie, a Windows Update milczy." data-right="Odczytaj Identyfikatory sprzętu (Szczegóły) i wyszukaj kod w sieci."></div>
    <div class="cmw-item" data-left="Karta dźwiękowa całkowicie odmawia pracy po „aktualizacji”." data-right="Użyj Odinstaluj urządzenie, zaznacz „Usuń oprogramowanie sterownika” i zrestartuj system."></div>
    <div class="cmw-item" data-left="Po fizycznym włożeniu pendrive'a system w ogóle go nie rejestruje." data-right="Wybierz Skanuj w poszukiwaniu zmian sprzętowych, by odpytać porty."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Izolacja trybów i Ringów:** system Windows opiera się na sprzętowej separacji trybu użytkownika (Aplikacje w Ring 3) od trybu jądra (Kernel w Ring 0). Zapobiega to bezpośredniemu dostępowi programów do sprzętu i chroni system przed ich błędami. 🧱
- **Rola Ringów w sterownikach:** Sterowniki użytkownika działają w bezpiecznym Ring 2 i ich awaria nie powoduje paraliżu stacji (Windows po cichu je restartuje). Sterowniki jądra działają w Ring 1 (tuż przy jądrze w Ring 0) – ich awaria jest krytyczna, natychmiast wywołuje błąd *BS***_OD_** i resetuje komputer, by chronić podzespoły. 🚨
- **Autostrada sprzętowa (Omijanie HAL):** podczas gdy HAL (`hal.dll`) unifikuje interfejs płyty głównej dla jądra, ultraszybkie sterowniki (np. GPU przez PCIe, dyski NVMe) stykają się ze sprzętem bezpośrednio przez rejestry i pamięć DMA (widoczne jako boczne fioletowe kliny na diagramie), omijając narzut HAL-a. ⚡
- **Ghost Devices (Urządzenia widma):** system trwale rezerwuje adresy i porty logiczne dla odłączonych urządzeń z przeszłości. Aktywacja opcji „Pokaż ukryte urządzenia” pozwala usunąć te blokady i zwolnić zasoby. 👻
- **Hardware IDs (Identyfikatory sprzętu):** to klucz do rozpoznania „Nieznanego urządzenia”. Identyfikatory `VEN_` (Vendor) oraz `DEV_` (Device) pozwalają w kilka sekund namierzyć i pobrać właściwy sterownik bezpośrednio od producenta. 🕵️

---

Skoro już architekturę sprzętową komputera znasz to ruszamy w konfigurację interfejsów sieciowych i zwiększenia twojej prywatności w internecie. 👮🏻