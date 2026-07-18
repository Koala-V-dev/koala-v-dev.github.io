# Foldery i udziały sieciowe

Typowe zgłoszenie na Helpdesk: *„Koleżanka wrzuciła raport do folderu Księgowość. Ja go widzę, ale jak próbuję otworzyć, system wywala __*Odmowę dostępu*__. Przecież mam uprawnienia do tego folderu!”* 😒. 

Udziały sieciowe to istny koszmar dla początkujących administratorów, którzy naiwnie myślą, że kliknięcie <kbd class="win-menu-btn">Udostępnij</kbd> rozwiązuje cały problem. Pobieranie cudzego pliku przez sieć LAN przypomina wchodzenie do bazy wojskowej. Żądanie otwarcia dokumentu musi najpierw pokonać strażnika na bramie głównej (Uprawnienia udziału sieciowego *SMB*), a chwilę później musi posiadać klucz do sejfu leżącego fizycznie na dysku (Zabezpieczenia lokalne **NTFS**). Jeżeli nie rozumiesz różnicy między tymi dwiema barierami, diagnoza blokad plików szybko zamieni się w klikanie uprawnień na oślep.

---

## ⚙️ Architektura Transferu (Stos TCP/IP vs USB)

Dlaczego kopiowanie gigabajtów danych przez sieć LAN mocniej obciąża procesor serwera (Ring 0) niż przerzucenie tego samego pliku na pendrive wpięty w port USB 3.0? Odpowiedź leży w przebiegu żądań wejścia/wyjścia (I/O). 

Zanim system zdecyduje dokąd wysłać plik, musi zweryfikować uprawnienia. Aplikacja (np. Eksplorator Plików) zgłasza żądanie zapisu lub odczytu do systemu plików **NTFS** na dysku `C:\`. Jeżeli tablica ACL odrzuci prośbę, operacja zatrzymuje się na komunikacie **_Odmowy Dostępu_**. 

Gdy **NTFS** wyrazi zgodę, żądanie wpada do centralnego _**Menedżera we/wy**_ (`I/O Manager`) wewnątrz jądra, który analizuje żądany kierunek i rozdziela ruch na transfer lokalny (USB) lub zdalny (Sieć LAN).

![Diagram przepływu I/O (Input/Output) dla sieci lokalnej LAN i pamięci masowej USB](/public/courses/windows-11/Images/diagram-transferu-danych-przez-usb-lub-lan.png)

:::diagram
Architektura weryfikacji i strumieniowania I/O. Algorytm stosu TCP/IP sprawdza, czy paczki *SMB* trafiają bez przekłamań bitów. Generuje to duży narzut na zasoby, jasno pokazując dlaczego obsługa ruchu sieciowego wymaga dedykowanej mocy obliczeniowej w porównaniu do sprzętowego kontrolera USB.
:::

**Opis strukturalny diagramu**

1. **Aplikacja (np. Eksplorator Plików)**: Zgłasza żądanie zapisu lub odczytu pliku do systemu operacyjnego.
2. **Weryfikacja Praw ACL (Wolumin **NTFS**)**: Zapytanie trafia do systemu plików, który sprawdza tablicę kontroli dostępu. Brak uprawnień kończy się natychmiastową **_odmową_**.
3. _**Menedżer we/wy Jądra (`I/O Manager`)**_: Po weryfikacji przejmuje strumień danych i decyduje o trasie przesyłu w zależności od docelowego nośnika.
4. **Rozgałęzienie (Rodzaj transmisji)**:
   - *Transfer lokalny*: Pamięć flash pod USB odbiera fizyczny zrzut ładunku wprost ze sterownika magistrali. To bezpośrednia ścieżka sprzętowa.
   - *Transfer zdalny*: Ruch sieciowy jest kierowany do analizy.  
    - **Sterownik Serwera** (`srv2.sys`): Przechwytuje transfer zdalny i tnie plik na paczki zrozumiałe dla protokołu udostępniania *SMB*.
    - **Stos TCP/IP**: Każdą paczkę *SMB* obudowuje w numery sekwencyjne i wylicza matematyczne sumy kontrolne dbające o brak błędów transmisji.
    - **Sterownik karty sieciowej NDIS**: Tłumaczy gotowe pakiety logiczne na sygnał przesyłany bezpośrednio do sprzętu.
    - **Przesył przez Sieć LAN**: Sygnał opuszcza komputer fizycznym kablem miedzianym Ethernet lub jako fale radiowe Wi-Fi.


> [!NOTE]
> **Dlaczego komponenty lokalne komunikują się przez TCP/IP?**
> Często nawet w obrębie jednego serwera (np. między wirtualnymi maszynami a storage'em hosta) ruch odbywa się po adresie pętli zwrotnej `localhost` (127.0.0.1). Wynika to z niezawodności samej architektury TCP. Protokół ten sprzętowo gwarantuje integralność strumienia: samodzielnie weryfikuje sumy kontrolne, pilnuje kolejności pakietów i zarządza retransmisją. Inżynierowie implementujący protokoły (np. iSCSI czy *SMB*) polegają na gotowym, przetestowanym w jądrze stosie TCP/IP, zamiast od zera pisać własne mechanizmy weryfikacji błędów dla komunikacji międzyprocesowej.

---

<data-gate>
  <data-quiz>
    <question>Dlaczego ruch sieciowy mocniej obciąża procesor w porównaniu do kopiowania na pendrive USB?</question>
    <options>
      <item correct>Wymaga przejścia przez stos TCP/IP, który musi stale fragmentować paczki i wyliczać matematyczne sumy kontrolne.</item>
      <item>Kabel miedziany LAN wymusza na architekturze ciągłe i sztuczne obniżanie taktowania procesora, by zrównać prędkości.</item>
      <item>Menedżer we/wy systematycznie odrzuca pierwszą próbę połączenia, co zmusza jądro do dublowania każdej operacji I/O.</item>
    </options>
    <div data-hint="error">
      Pamiętaj, że przesył sieciowy, w przeciwieństwie do USB, nie posiada bezpośredniej ścieżki sprzętowej. Jądro systemu musi więc na bieżąco weryfikować poprawność pakietów i zabezpieczać je przed utratą po drodze!
    </div>
    <div data-hint="success">
      Świetnie! Stos `TCP/IP` natywnie weryfikuje poprawność bitów, dodając potężny narzut obliczeniowy, podczas gdy USB to czysta, sprzętowa autostrada przesyłowa.
    </div>
  </data-quiz>
</data-gate>

---

## 🔏 Koncepcja Podwójnego Zamka (SMB vs NTFS)

System Windows traktuje dostęp zdalny do pliku jak próbę odczytania tajnych akt w wojskowym archiwum. Żeby zmodyfikować plik w sieci, zapytanie od stacji-klienta musi pomyślnie minąć dwa niezależne systemy autoryzacji. 

![Diagram podwójnego zamka w Windows](/public/courses/windows-11/Images/diagram-dwukrokowy-do-rozpoczecia-transmisji-smb-przez-sieć-lan.png)

:::diagram
Logika Podwójnego Zamka w środowisku Windows. Klient wbijający po porcie TCP 445 jest weryfikowany w dwóch niezależnych bramach decyzyjnych. Odrzucenie pakietu na jakimkolwiek z tych etapów skutkuje **_Odmową Dostępu_**, uniemożliwiając operacje na fizycznym dysku.
:::

**Opis strukturalny diagramu**

1. **Klient z sieci LAN:** Zgłasza żądanie dostępu wysyłając pakiety na port TCP 445 (domyślny port usługi udostępniania plików i drukarek).
2. *Zamek nr 1 (Uprawnienia Udziału SMB*): Pierwszy romb decyzyjny. Serwer weryfikuje tzw. *Share Permissions* (miękką siatkę uprawnień sieciowych: Odczyt, Zmiana, Pełna kontrola).
   - **_Odmowa_**: Użytkownik od razu otrzymuje komunikat **_Odmowa Dostępu_**, a sesja zostaje odrzucona bez sprawdzania uprawnień katalogów i plików.
   - **Zgoda**: Żądanie jest przepuszczane głębiej do jądra.
3. *Zamek nr 2 (Weryfikacja Praw ACL* **NTFS**): Drugi romb decyzyjny. Żądanie zderza się z uprawnieniami zapisanymi w strukturze dysku (tzw. **NTFS** Permissions). Tutaj weryfikowana jest lista ACL.
   - **_Odmowa_**: Nawet przy pełnej zgodzie na pierwszej bramie *SMB*, brak uprawnień lokalnych dla poświadczonego użytkownika zwraca komunikat **_Odmowa Dostępu_** do zasobu.
   - **Zgoda**: Pozytywna weryfikacja w obu punktach zezwala na wykonanie docelowej operacji I/O na dysku twardym serwera.


Gdy obydwa systemy praw wchodzą w konflikt np. Udział sieciowy daje *Pełną kontrolę*, ale ACL na dysku daje tylko *Odczyt*, jądro wylicza *„Uprawnienia Efektywne”* opierając się na regule: **Najbardziej restrykcyjna polityka zawsze wygrywa.**

---

### Zamek nr 1: Udostępnianie (Brama SMB)

Uprawnienia Udziału to płytki mechanizm oparty na trzech prostych przełącznikach: *Odczyt*, *Zmiana*, *Pełna kontrola*. 

Protokół *SMB* (Server Message Block), przez który realizowany jest ten dostęp, na przestrzeni lat przeszedł drastyczną ewolucję. Największym problemem jest niezrozumienie różnic między jego generacjami, co często kończy się tworzeniem krytycznych luk w infrastrukturze. Pierwotna wersja z lat $90$. (_**SMB$\text{v}1$**_) zawierała wadę architektoniczną pozwalającą na zdalne wykonanie kodu na prawach jądra. To właśnie przez nią kryptowirus [WannaCry](https://cert.pl/posts/2017/05/wannacry-ransomware/) zainfekował setki tysięcy maszyn na całym świecie. Z tego powodu w Windows 11 domyślnie ją wyłączono, a poważnym błędem jest ręczne doinstalowywanie przestarzałych komponentów systemu (np. przez funkcje opcjonalne). Takie działanie niepotrzebnie zwiększa powierzchnię ataku na urządzenie. Zamiast obniżać poziom zabezpieczeń, należy wymuszać nowsze protokoły i standardy.

| Wersja protokołu | Status w Windows 11 | Szyfrowanie danych w locie | Główne cechy i zmiany |
| :--- | :--- | :--- | :--- |
| _**SMB$\text{v}1$**_ | **_Wyłączony_** | ❌ Brak | Przestarzały, skrajnie podatny na ataki sieciowe (**_RCE_** - *Remote Code Execution*). |
| _**SMB$\text{v}2$**_ | *Obsługiwany* | ❌ Brak (tylko podpisywanie transakcji) | Zwiększona wydajność, drastycznie mniejszy narzut pakietów. |
| _**SMB$\text{v}3$**_ | **Wymuszany** | ✅ Tak (AES) | Natywna kryptografia transmisji danych (*Encryption in Transit*) i wysoka skalowalność. |

Cały ten ruch wejściowy nasłuchuje na jednym dedykowanym porcie **TCP 445**. Jeśli zajrzysz do Zapory Windows, zauważysz jednak, że reguła otwierająca ten port nazywa się „Udostępnianie plików i drukarek”. Nie jest to błąd interfejsu ani pomyłka tłumacza. Jądro sieciowe w systemie Windows optymalizuje komunikację na tyle sprytnie, że przechwytuje surowe instrukcje wydruku (komunikacja RPC) i hermetyzuje je właśnie w pakiety protokołu *SMB*. Oznacza to wprost, że zablokowanie lub błędna konfiguracja portu 445 na serwerze nie tylko odetnie użytkowników od ich udziałów, ale również całkowicie sparaliżuje wszystkie firmowe drukarki sieciowe.

> [!NOTE]
> **Hermetyzacja**: Proces opakowywania jednych danych w drugich. By docelowy proces miał dostęp tylko do części danych, które w poprawnej strukturze sam odtworzy w swoim procesie. Np.: obraz `.png` wysłany do drukarki jest przez sterownik kompresowany do formatu `.spl`, który jest zapisywany w buforze na dysku. Dopiero gdy sterownik drukarki odczyta poprawną strukturę pliku `.spl`, odtworzy go, a następnie za pomocą algorytmu dekompresji **`Render_Bitmap()`** przetworzy go do języka maszynowego i wygeneruje rozkazy dla głowicy termicznej. Przy tym procesie mogą ulec zmianie zakresy kolorów (gamut) z <span class="color-box"><span class="R">R</span><span class="G">G</span><span class="B">B</span></span> do <span class="color-box"><span class="C">C</span><span class="M">M</span><span class="Y">Y</span><span class="K">K</span></span>.

---

<data-gate>
  <data-quiz>
    <question>Co się stanie, gdy udział SMB pozwala pracownikowi na „Pełną kontrolę”, ale zakładka NTFS pliku dopuszcza jedynie „Odczyt”?</question>
    <options>
      <item correct>Prawa zderzą się, a system wyliczy Uprawnienia Efektywne przyjmując bezwzględnie, że najbardziej restrykcyjna blokada zawsze wygrywa.</item>
      <item>Priorytet uzyska nowszy protokół sieciowy SMB, w pełni ignorując starsze i słabsze restrykcje przypisane do lokalnej tablicy dysku.</item>
      <item>System Windows zawiesi protokół komunikacji, oczekując aż Administrator ręcznie zrówna wartości z obu miejsc w jeden ciąg dostępu.</item>
    </options>
    <div data-hint="error">
      Zastanów się nad metaforą budynku: czy posiadanie pełnego dostępu do bramy wjazdowej pozwoli Ci otworzyć sejf w piwnicy, do którego nie masz klucza?
    </div>
    <div data-hint="success">
      Dokładnie tak! Dlatego administratorzy korporacyjni często otwierają udział *SMB* na "Wszyscy", by sterować bezpieczeństwem wyłącznie z poziomu twardej tablicy ACL w systemie plików **NTFS**.
    </div>
  </data-quiz>
</data-gate>

---

### Zamek nr 2: Uprawnienia NTFS (Drzwi Jądra)

**NTFS** (New Technology File System) w przeciwieństwie do udziałów sieciowych funkcjonuje na warstwie fizycznej. Prawa wyznaczone w **NTFS** to tablice kontroli dostępu (ACL), które są przechowywane w metadanych systemu plików.

Gdy użytkownik wchodzi we Właściwości pliku na zakładkę *`Zabezpieczenia`*, widzi uprawnienia podstawowe:
- Pełna kontrola
- Modyfikacja
- Odczyt i wykonywanie
- Wyświetlenie zawartości folderu
- Odczyt
- Zapis

To jednak tylko uproszczona maska. Administratorzy klikają zawsze w opcję <kbd class="link-os-windows">Pokaż uprawnienia zaawansowane</kbd>. Pod spodem kryje się silnik $14$ instrukcji, które dają precyzyjną władzę nad pojedynczymi akcjami.

Poniższy schemat dowodzi dlaczego prawa sieciowe to tylko „pierwsze drzwi”, a właściwa autoryzacja musi nastąpić w rdzeniu **NTFS**:

![Diagram zależności warstw uprawnień](/public/courses/windows-11/Images/zalerzność-praw-smb-do-grup-uprawnien-NTFS.png)

:::diagram
Schemat przepuszczania żądań przez warstwę *SMB* do zaawansowanych akcji **NTFS**. Zależności pokazują, jak wąskie uprawnienie sieciowe potrafi całkowicie wyciąć dostęp do głębokich funkcji, nawet jeśli użytkownik posiada pełną władzę na fizycznym dysku serwera.
:::

**Opis strukturalny diagramu**

1. **Odczyt** (*SMB*): Udziela zgody tylko i wyłącznie na realizację żądań z zielonej grupy `👀 Przeglądanie i Nawigacja`. Operacje zapisu/modyfikacji odbiją się z komunikatem **_Odmowy Dostępu_** w warstwie sieci.
2. **Zmiana** (*SMB*): Rozszerza dostęp. Strzałki pokazują, że status ten przepuszcza żądania do niebieskiej grupy `✏️ Tworzenie i Edycja` oraz czerwonej `🔥 Niszczenie Danych`.
3. **Pełna kontrola** (*SMB*): Najwyższy status sieciowy, który jako jedyny doprowadza strzałkę "Odblokowuje" do fioletowej grupy `👑 Zarządzanie ACL / Administrator`.

Mechanizm *SMB* z diagramu działa jak **wąskie gardło**. Nawet jeśli pracownik w **NTFS** ma przypisane fioletowe prawo `Zarządzania ACL`, a w udziale sieciowym otrzyma jedynie „Zmiana”, to nigdy nie edytuje zabezpieczeń przez LAN. Jego żądania zostaną ucięte na bramie *SMB*, całkowicie ignorując lokalne możliwości jego konta.

<data-tabs>
  <tabs>
    <item>👀 Przeglądanie i Nawigacja</item>
    <item>✏️ Tworzenie i Edycja</item>
    <item>🔥 Niszczenie Danych</item>
    <item>👑 Zarządzanie ACL / Administrator</item>
  </tabs>
  <div>

### Przeglądanie i Nawigacja (Odczyt)

Włączenie tej grupy pozwala na eksplorację dysku i czytanie plików, blokując jednocześnie możliwość jakiejkolwiek zmiany na serwerze.
* **Przechodzenie przez folder / Wykonanie pliku**: Odpowiada za nawigację po strukturze katalogów, ale jego drugą, cichą funkcją jest prawo alokacji pliku binarnego (`.exe`) do pamięci RAM komputera. Nawet po udostępnieniu pracownikowi programu w sieci, brak tej flagi wyrzuci błąd przy dwukrotnym kliknięciu w plik wykonywalny.
* **Wyświetlanie zawartości folderu / Odczyt danych**: Prawo do wylistowania zawartości katalogu oraz rzeczywistego odczytu bitów, by móc w ogóle otworzyć plik np. w Notatniku.
* **Odczyt atrybutów**: Zezwala na sprawdzanie metadanych pliku (czy jest np. *`Ukryty`* lub *`Tylko do odczytu`*).
* **Odczyt atrybutów rozszerzonych**: Pozwala na inspekcję danych **ADS** (*Alternate Data Streams*).

> [!NOTE]
> **Alokacja**: odnosi się do pliku lub fragmentu kodu. System pierw zastrzega fragment komórki pamięci RAM lub sektora na dysku twardym, a następnie przenosi tam zapis binarny.
> 
> **ADS** (*Alternate Data Streams*): to ukryte strumienie danych, które mogą być dodawane do plików. Pozwalają one na przechowywanie dodatkowych informacji o pliku, takich jak metadane, komentarze, a nawet kod wykonywalny. ADS są często wykorzystywane w złośliwym oprogramowaniu do ukrywania szkodliwych danych.
> 
> **Metadata**: to dane, które opisują inne dane. Przykładowo lokalizacja i urządzenie z którego zrobiono zdjęcie to metadane tej fotografii.

  </div>
  <div>

### Tworzenie i Edycja (Zapis)

Zestaw uprawnień do wprowadzania nowych danych, celowo pozbawiony jakichkolwiek funkcji usuwania.
* **Tworzenie plików / Zapis danych**: Umożliwia lokowanie nowych plików na dysku, zakazując jednocześnie modyfikacji plików stworzonych wcześniej. To mechanizm dla folderów wrzutowych (tzw. Drop-Box) – pracownik wrzuca raport, ale nie ma fizycznej możliwości sabotażu pliku wrzuconego przez kogoś innego.
* **Tworzenie folderów / Dołączanie danych**: Prawo do zakładania nowych podkatalogów.  
Względem samych plików pozwala na dopisywanie bajtów wyłącznie na samym końcu pliku (idealne dla środowisk produkcyjnych trzymających logi w plikach `.txt`).
* **Zapis atrybutów**: Pozwala modyfikować flagi systemowe.
* **Zapis atrybutów rozszerzonych**: Zgoda na edycję ADS.

> [!NOTE]
> *Dołączanie danych*: to proces dodawania treści do istniejącego pliku. Wykonuje się go poprzez strumień danych najczęściej przy użyciu konsoli:
> 
> _**CMD**_
> ```cmd
> echo "Tekst do dopisania." >> nazwa_pliku.txt
> ```
>  
> _**PowerShell**_
> ```powershell
> Add-Content -Path "nazwa_pliku.txt" -Value "Dodatkowa treść."
> ```

**Podstawowe atrybuty plików (Flagi)**
Są to w większości proste, jednobitowe przełączniki informujące system operacyjny, jak ma traktować dany obiekt.

| Flaga | Pełna nazwa | Działanie w systemie Windows |
| :---: | :--- | :--- |
| **R** | *Read-only* (Tylko do odczytu) | Blokuje możliwość bezpośredniego nadpisania lub edycji pliku. |
| **H** | *Hidden* (Ukryty) | Plik nie jest domyślnie wyświetlany w Eksploratorze Windows. |
| **S** | *System* (Systemowy) | Krytyczny plik jądra; posiada podwójną warstwę ukrywania w interfejsie. |
| **A** | *Archive* (Archiwalny) | Flaga ustawiana przy każdej edycji, informująca oprogramowanie do backupu, że plik uległ zmianie. |
| **C** | *Compressed* (Skompresowany) | Plik jest w locie kompresowany przez sterownik **NTFS** w celu oszczędności miejsca. |
| **E** | *Encrypted* (Szyfrowany) | Zabezpieczony sprzętowo kluczem użytkownika przy pomocy protokołu EFS. |
| **I** | *Not Indexed* (Nieindeksowany) | Wymusza ignorowanie pliku przez usługę szybkiego wyszukiwania (Windows Search). |

**Atrybuty rozszerzone i Strumienie Danych**
Zwykłe atrybuty (powyżej) to tylko stany "Włączony/Wyłączony". System **NTFS** pozwala na znacznie więcej, oferując tzw. ukryte metadane:
* **Atrybuty Rozszerzone (EA - Extended Attributes)**: Struktury typu *klucz-wartość* dodawane do plików (limitowane do max 64 KB). Obecnie to relikt przeszłości, zachowany dla kompatybilności z dawnymi systemami np. OS/2 czy portami POSIX. Z punktu widzenia współczesnego administratora są praktycznie martwe.
* **Alternatywne Strumienie Danych (ADS - Alternate Data Streams)**: Rozwiązanie stosowane natywnie do dziś. To mechanizm pozwalający „dokleić” do pliku ukryte kontenery z danymi o dowolnym rozmiarze. Główny plik to strumień nienazwany (`$DATA`), ale możemy dodać strumień poboczny. Z systemu ADS powszechnie korzystają przeglądarki internetowe – po ściągnięciu pliku z sieci dołączają do niego ukryty strumień poboczny *Zone.Identifier* (tzw. Mark of the Web), dzięki czemu system wie, że dany `.exe` pochodzi z zewnątrz i wymaga ostrzeżenia SmartScreen przed jego uruchomieniem.


  </div>
  <div>

### Niszczenie Danych (Usuwanie)

Zbiór uprawnień, które w podstawowym oknie zabezpieczeń ukryto pod ogólnym pojęciem "Modyfikacja". Brak tych uprawnień chroni zasoby przed przypadkowym skasowaniem.
* **Usuwanie podfolderów i plików**: Działa jak wyburzanie budynku w całości. Pozwala na usunięcie całego katalogu nadrzędnego wraz ze wszystkim, co znajduje się w środku (usuwanie kaskadowe).
* **Usuwanie**: Zezwala na skasowanie pojedynczego pliku lub pustego folderu. Technicznie jest to prawo do usunięcia powiązanego rekordu ze struktury MFT.

> [!TIP]
> _**Typowy scenariusz inżynierski**_: Dział finansowy ma prawa zapisu, ale przy próbie nadpisania istniejącego arkusza kalkulacyjnego dostają błąd. Analiza wykazuje brak flagi *Usuwanie*.  
Nowoczesne aplikacje biurowe podczas kliknięcia opcji Zapisz rzadko nadpisują plik na żywo; zamiast tego tworzą nowy plik obok, po czym usuwają oryginał. Jeśli odetniesz prawo kasowania, mechanizm biurowy legnie w gruzach.

> [!NOTE]
> **MFT** (*Master File Table*) – to główna tablica systemu plików **NTFS** zawierająca informacje o wszystkich plikach i katalogach na dysku. Każdy plik i katalog ma swój wpis w MFT, który zawiera informacje o jego atrybutach, lokalizacji danych na dysku oraz uprawnieniach dostępu. Decyduje które sektory można nadpisać nowymi danymi.

  </div>
  <div>

### Zarządzanie i Odzyskiwanie (Zarządzanie ACL)

Zestaw praw, który daje bezpośrednią kontrolę nad mechanizmami bezpieczeństwa Active Directory i systemu plików.
* **Odczyt uprawnień**: Pozwala wejść w zakładkę Zabezpieczenia i zobaczyć całą listę użytkowników przypisanych do pliku.
* **Zmiana uprawnień**: Prawo do modyfikowania tablicy ACL. Mając tę flagę, deweloper może samodzielnie udostępnić podkatalog koledze bez otwierania nowego zgłoszenia dla działu Helpdesku IT.
* **Przejęcie na własność**: (*Take Ownership*): Wbudowane prawo ratunkowe, dedykowane lokalnym grupom Administratorów. Jeśli ktoś usunie wszystkie grupy z listy Zabezpieczeń, wliczając w to administratora serwera, dostęp zostanie zablokowany. W takiej sytuacji używa się wymuszonego Przejęcia Własności. Jądro systemowe weryfikuje konto i nadpisuje właściciela z pominięciem blokady, pozwalając wyczyścić starą tablicę uprawnień.

  </div>
</data-tabs>

#### Dziedziczenie i optymalizacja zarządzania
W strukturach serwerowych uprawnień nie konfiguruje się ręcznie plik po pliku. Najważniejszym systemem pracy jest tu **Dziedziczenie** (*Inheritance*). Opiera się na ustawieniu odpowiednich list ACL na najwyższym folderze (np. `D:\Zasoby_HR`). Nałożone tak filtry kaskadowo obejmują wszystkie obiekty, które zostaną wrzucone do środka.

> [!NOTE]
> **Kaskadowość** to mechanizm, w którym cecha, ustawienie lub działanie zastosowane na poziomie nadrzędnym automatycznie wpływa na elementy podrzędne.
> Kluczowe w tym procesie jest istnienie hierarchii (drzewo, graf, struktura zależności), wtedy właściwość przechodzi dalej, co nazywamy *propagacją*.

Administratorzy w prosty sposób wykorzystują to do ukrywania zawartości przed osobami niepowołanymi. Skonfigurowanie dziedziczenia w taki sposób, aby na liście znajdowała się wyłącznie grupa *Uwierzytelnieni użytkownicy* (Authenticated Users) fizycznie blokuje dostęp gościom. Co więcej, jeśli z gałęzi usuniemy wbudowaną grupę **Wszyscy (Everyone)**, anonimowe próby wejścia na dany udział sieciowy zakończą się tym, że serwer,  po prostu nie wylistuje przed użytkownikiem nawet nazwy ukrytego katalogu.

> [!TIP]
> Praktyka Enterprise: Otwieranie *SMB*, uszczelnianie **NTFS**
> 
> Podwójne układanie uprawnień (trochę na udziałach *SMB*, a trochę na dysku **NTFS**) wywołuje ogromny chaos, więc stosuje się prostszą metodę:
> 
> * **Krok 1 (Brama sieciowa):** Otwórz udział *SMB* na oścież. Nadaj grupie *Wszyscy* status *Pełna kontrola*.
> * **Krok 2 (Ochrona dysku):** Resztę zabezpieczeń ustaw bezpośrednio w uprawnieniach **NTFS**. 
> 
> Prawa na dysku są niezawodne, precyzyjne i łatwe do audytu. Nawet jeśli udział sieciowy wpuszcza wszystkich, to system i tak zablokuje każdego, kto nie ma twardego uprawnienia na samym pliku.

<data-gate>
  <data-connection-matcher title="Zarządzanie Udziałami i Prawami ACL">
    <div class="cmw-item" data-left="Aplikacja bazodanowa nagle wyłącza się, raportując błąd podczas próby nadpisania kopii zapasowej na dysku sieciowym dla nocnego backupu." data-right="Odebrano pracownikowi z uprawnień NTFS twardą flagę 'Usuwanie'. Aplikacja nie może usunąć pliku temp przed zapisem, więc w obawie przed skasowaniem danych przerywa cały proces."></div>
    <div class="cmw-item" data-left="Pracownik księgowości ma prawo 'Zmiany' w sieci SMB, ale przy próbie wklejenia nowego raportu do folderu dostaje Odmowę Dostępu." data-right="Ktoś wyciął mu z tablicy kontroli dostępu grupę 'Tworzenie plików / Zapis danych', mimo pozostawienia otwartej bramy sieciowej."></div>
    <div class="cmw-item" data-left="Zlecono Ci utworzenie katalogu wrzutowego (tzw. Drop-Box). Każdy ma móc złożyć dokument zaliczeniowy, ale nie może edytować ani kasować prac kolegów." data-right="Ograniczasz prawo do grupy zapisu (Tworzenie plików) i rygorystycznie wycinasz z zabezpieczeń lokalnych flagę 'Usuwanie'."></div>
  </data-connection-matcher>
</data-gate>

---

## 🕵️ Dlaczego woluminy (dyski) to ukryte udziały?

Wyobraź sobie, że w firmie jest $200$ komputerów i na każdym musisz pilnie zaktualizować program. Bieganie od biurka do biurka z pendrive'em nie ma sensu. Administratorzy muszą mieć zdalny, pełny dostęp do dysków pracowników, by móc działać w tle.

Z tego powodu system Windows natywnie uruchamia usługę Serwera (`LanmanServer`), która bierze całe fizyczne dyski (np. dysk `C:`) oraz krytyczne foldery systemowe i wystawia je do sieci jako **Ukryte Udziały Administracyjne**.

Zasada działania jest prosta: dodanie znaku dolara `$` na końcu nazwy udziału (np. `Raporty$`) sprawia, że folder całkowicie znika z Otoczenia Sieciowego. Nikt go nie wyklika, bo po prostu go nie widać.

Windows rzutuje w sieć swoje najważniejsze zasoby:
*   `C$` – Pełen, ukryty dostęp do całego dysku systemowego `C:\` i adekwatnie inne woluminy np `D:\` → `D$`.
*   `ADMIN$` – Bezpośrednie dojście do głównego folderu `C:\Windows`.
*   `IPC$` – Niewidzialny kanał do komunikacji między procesami (Inter-Process Communication). Nie przerzuca się nim plików, służy maszynom do przekazywania poświadczeń i wewnętrznych instrukcji sieciowych.

**Jak z tego skorzystać w praktyce?**
Siedząc przy swoim stanowisku, wpisujesz w oknie Eksploratora surową ścieżkę: `\\IP_Komputera_Obok\C$`.
System od razu wyrzuci okienko logowania. Do środka nie wbijesz ot tak – Windows wpuści Cię pod warunkiem, że podasz poprawne hasło na konto lokalnego Administratora tamtej maszyny. Gdy zdasz ten test, uzyskasz dostęp do pełnego podglądu cudzego dysku `C:\` na swoim własnym ekranie.

---

## 🛑 Koniec udostępniania SMB w domu (Środowisko Workgroup)

Przez lata *SMB* (*Server Message Block*) ciągnęło wymianę plików w domowych sieciach. W Windows 11 Microsoft uciął ten temat. Udostępnianie folderów teraz działa sensownie tylko i wyłącznie w domenach _**Active Directory**_.

> [!NOTE]
> - _**Active Directory (AD)**_ – scentralizowana usługa katalogowa firmy Microsoft. Zamiast kont lokalnych na każdym PC, logujesz się kontem z domeny, a za autoryzację odpowiada centralny serwer (Kontroler Domeny).
> - _**Kerberos**_ – główny protokół uwierzytelniania w AD. Używa biletów (*Tickets*) wydawanych przez zaufany serwer **KDC** (*Key Distribution Center*).

Ta decyzja Microsoftu wywołała ogromne poruszenie w internecie i wylew poradników jak to naprawić. Problem w tym, że wiele z nich proponuje włączenie  _**SMB$\text{v}1$**_ lub włączenie przez rejestr *local KDC*, który nie działa w pełni poprawnie i blokuje połączenie zwracając fałszywy komunikat o niepoprawności wpisanego hasła (**_Błąd Systemu 86_**). Wcześniejsza implementacja udostępniania folderów w sieci LAN opierała się o dziurawy **NTLM** (*NT LAN Manager*) stosowany od czasów Windows 2.0. Teraz pakiety *SMB* muszą być podpisywane poświadczeniami cyfrowymi co poza domeną AD się nie dzieje.

Szkoda nerwów na naprawianie tego. 😒

---

## 🔐 Poufność danych a metody transmisji sieciowej

Zanim wybierzesz narzędzie, musisz zrozumieć aspekt bezpieczeństwa. Pliki między urządzeniami można przesyłać na wiele sposobów.

---

### 🔐 Triada CIA – Podstawa cyberbezpieczeństwa

Triada CIA to model opisujący trzy kluczowe właściwości bezpieczeństwa informacji:

- **Poufność** (*Confidentiality*) – dane nie mogą zostać odczytane przez osoby nieuprawnione.  
- **Integralność** (*Integrity*) – dane nie mogą zostać zmienione w sposób nieautoryzowany.  
- **Dostępność** (*Availability*) – dane muszą być dostępne dla osób uprawnionych.

![Triada CIA](/public/courses/windows-11/Images/triada-CIA.png)

---

### 🌐 Geografia i logika zakresów sieci

| Poziom | Nazwa | Zakres | Przykład |
| --- | --- | --- | --- |
| 🧠 **PAN** | Personal Area Network | Osobisty | Bluetooth, hotspot telefonu |
| 🏠 **LAN** | Local Area Network | Lokalny | Sieć domowa, szkolna |
| 🏫 **CAN** | Campus Area Network | Kampusowy | Sieć uczelni, szkoły, firmy |
| 🏙️ **MAN** | Metropolitan Area Network | Miejski | Sieć operatora w obrębie miasta |
| 🌍 **WAN** | Wide Area Network | Rozległy | Sieć krajowa, Internet |
| 🪐 **GAN** | Global Area Network | Globalny | Połączenie wielu sieci WAN |

---

### 🧩 Warstwa logiczna – jak urządzenia komunikują się ze sobą

To nie są protokoły — to **modele komunikacji** i **logiczne konstrukcje sieciowe**.

| Nazwa | Co oznacza | Zastosowanie |
| --- | --- | --- |
| **P2P (Peer‑to‑Peer)** | Połączenie bezpośrednie między urządzeniami | LocalSend, Wi‑Fi Direct, Torrent |
| **Client–Server** | Urządzenie łączy się z serwerem | SMB, FTP, HTTP |
| **VPN** | Tunelowanie ruchu | Zdalny dostęp, prywatność |
| **VLAN** | Podział sieci logicznej | Segmentacja sieci |
| **WLAN** | Sieć LAN po Wi‑Fi | Dom, szkoła, firma |
| **SAN** | Sieć pamięci masowych | Infrastrukturalne klastry wielu serwerów |
| **DLNA** | Streaming multimediów | Telewizory, konsole |
| **VoIP** | Głos po IP | Teams, Skype |
| **QoS** | Priorytety ruchu | Gry multiplayer, VoIP, wideokonferencje |

---

### 🔐 Warstwa bezpieczeństwa – E2E vs E2EE

| Model | Co szyfruje | Kto widzi treść | Przykład |
| --- | --- | --- | --- |
| <b>E2E (transport encryption)</b> | Szyfruje transmisję | **_Serwer widzi treść_** 👀 | HTTPS, MS Teams |
| <b>E2EE (end‑to‑end encryption)</b> | Szyfruje treść + klucze | *Serwer nie widzi treści* 🤫 | Signal, WhatsApp |
| <b>Brak szyfrowania</b> | Nic | **_Każdy podsłuchujący_** 🕵️‍♂️ | FTP, HTTP |

---

### 📡 Protokoły do transferu plików

| Protokół | Port | Architektura | Zastosowanie |
| --- | --- | --- | --- |
| _**SMB**_ | `445` | **LAN** | Udostępnianie plików |
| _**NFS**_ | `2049` | **LAN** | Udostępnianie plików (Linux) |
| _**FTP**_ | `21`/`20` | **LAN**/*WAN* | Transfer plików (bez szyfrowania) |
| _**SFTP**_ | `22` | **LAN**/*WAN* | Bezpieczny transfer (SSH) |
| _**HTTP/HTTPS**_ | `80`/`443` | **LAN**/*WAN* | Pobieranie/wysyłanie plików |
| _**Bluetooth OBEX**_ | – | PAN | Transfer plików BT |
| _**Wi‑Fi Direct**_ | – | **LAN**/P2P | Połączenie bez udziału głównego rutera (Access Point) |

---

### 📶 Warstwa fizyczna – technologie transmisji

| Technologia | Częstotliwość | Prędkość | Zasięg |
| --- | --- | --- | --- |
| *Wi‑Fi* | $2.4 / 5 / 6 \text{ GHz}$ | do $9.6 \text{ Gbps}$ | do $50 \text{ m}$ |
| *Bluetooth* | $2.4 \text{ GHz}$ | do $3 \text{ Mbps}$ | do $100 \text{ m}$ |
| *NFC* | $13.56 \text{ MHz}$ | do $424 \text{ Kbps}$ | do $10 \text{ cm}$ |
| *Hotspot LTE/5G* | $700–2600 \text{ MHz} / 3.5 \text{ GHz}$ | $5 \text{ Mbps}$ – $2 \text{ Gbps}$ | do $5 \text{ km}$ |
| *Wi‑Fi Direct* | $2.4 / 5 / 6 \text{ GHz}$ | do $9.6 \text{ Gbps}$ | do $50 \text{ m}$ |

<data-gate>
  <data-connection-matcher title="Zabezpieczenia Transmisji i Modele Sieci">
    <div class="cmw-item" data-left="Zasada działania technologii End-to-End Encryption (E2EE)." data-right="Szyfruje całą treść i zabezpiecza klucze po obu końcach trasy. Serwer przekaźnikowy jest całkowicie 'ślepy' na ładunek i procesuje tylko ukryty szum entropijny."></div>
    <div class="cmw-item" data-left="Ochrona oparta wyłącznie na powszechnym szyfrowaniu w warstwie Transport Encryption (E2E)." data-right="Pakiety są rozszyfrowywane po stronie serwerowni w chmurze (np. MS Teams). Narzędzia analityczne, algorytmy i obsługa techniczna mają pełen, swobodny wgląd do treści przesyłu."></div>
    <div class="cmw-item" data-left="Architektura topologii na poziomie Metropolitan Area Network (MAN)." data-right="Ogromna infrastruktura szerokopasmowa operująca na liniach światłowodowych w obrębie zurbanizowanej, zwartej struktury miejskiej."></div>
    <div class="cmw-item" data-left="Nawiązywanie łączności przy pomocy logicznej wymiany bezpośredniej P2P." data-right="Urządzenia negocjują ze sobą ustanowienie mostu łączącego sprzęt prosto między swoimi kartami sieciowymi (np. przez Wi-Fi Direct), całkowicie omijając po drodze publiczny, główny ruter."></div>
  </data-connection-matcher>
</data-gate>

---

## 🧰 Zestawienie mechanizmów do pracy lokalnej

| Oprogramowanie | Architektura sieciowa | Kontekst użycia (Praktyka) |
| :--- | :--- | :--- |
| **LocalSend** | *LAN (P2P)* | Błyskawiczne przerzucenie pliku na telefon lub Maca. |
| **Udostępnianie w pobliżu** | *Wi-Fi Direct* | Transfer plików między sprzętem firmowym zablokowanym przez IT. |
| **Łącze z telefonem** | *Hybrydowa (LAN/WAN)* | Odpisywanie na SMS z klawiatury PC i import zdjęć. |

### 1. LocalSend (Windows, macOS, Linux, iOS, Android)
LocalSend to prosta aplikacja do przesyłania plików w sieci LAN. Działa trochę jak AirDrop, ale między różnymi systemami i jest darmową alternatywą dla tradycyjnego udostępniania *SMB*. Wykorzystuje protokół multicast i TLS.  
Transmisja w zasadzie nie wychodzi poza sieć lokalną, choć społeczność tworzy już serwery przekaźnikowe (*Relay Servers*). Twórcy zaimplementowali tu prawdziwe szyfrowanie E2EE (*End to End Encryption*). Oznacza to, że nawet jeśli plik przejdzie przez serwer pośredniczący, nikt w połowie drogi go nie odczyta. Dla porównania – MS Teams używa szyfrowania, ale jego serwer rozszyfrowuje komunikację (by np. nałożyć filtry bezpieczeństwa), a następnie szyfruje ją ponownie. LocalSend działa bardziej jak Signal – klucze są tylko na końcach trasy.

Co ciekawe, możesz przesłać zainstalowaną na Androidzie aplikację bezpośrednio jako paczkę `.apk` na dysk Windowsa:
![Przesyłanie aplikacji na Windows 11](/public/courses/windows-11/Images/localSend-windows11.png)

### 2. Udostępnianie w pobliżu (Wi-Fi Direct)

To funkcja wbudowana w Windows 11. Znajdziesz ją w `Ustawieniach` → `System` → `Udostępnianie w pobliżu`.  
Do wyboru masz trzy tryby:
- Wyłączone: brak udostępniania
- Tylko moje urządzenia: tylko wysyłanie i odbieranie z tego samego konta Microsoft
- Wszyscy w pobliżu: wysyłanie i odbieranie od każdego

> [!WARNING]
> Urządzenie musi być widoczne w sieci lokalnej. Najszybciej naprawisz to z poziomu Eksploratora plików. Wejdź w zakładkę `Sieci`, kliknij prawym przyciskiem myszy na komunikat u góry i wybierz opcję `Włącz odnajdywanie sieci i udostępnianie plików`.  
Pojawi się okienko wyboru, w jakim profilu zapory sieciowej to urządzenie ma być widoczne:
- Pierwsza opcja *„Nie, niech...”* włączy udostępnianie w sieci prywatnej (domowej lub firmowej).
- Druga opcja *„Tak, włącz...”* zostawi połączenie jako sieć publiczną (do kawiarni czy na lotnisko). W domowych warunkach zdecydowanie polecam pierwszą opcję.
> ![Konfiguracja widoczności w sieci](/public/courses/windows-11/Images/Widoczność-w-sieci.png)

Funkcja pozwala pominąć główny router i infrastrukturę sieciową. Jeśli główny punkt dostępu (AP) przestanie działać, pliki i tak przejdą.
* **Jak to działa pod spodem:** System używa modułu *Bluetooth Low Energy*, by znaleźć sprzęt w pokoju. Gdy komputery się „zauważą”, karty sieciowe negocjują własny, bezpośredni most – _**Wi-Fi Direct**_. Pakiety wędrują prosto z anteny do anteny.

![Udostępnianie w pobliżu na Windows](/public/courses/windows-11/Images/windows-udostepnianie-w-poblirzu.png)

### 3. Łącze z telefonem (Transmisja hybrydowa)

To kolejna natywna aplikacja Windows 11, łącząca komputer ze smartfonem. Działa świetnie przy lekkich zadaniach (np. czytanie SMS-ów czy odbieranie powiadomień), ale przy większych operacjach mocno kuleje.

**Jak to wygląda w praktyce?**
* ✅ **Wygodne porządki:** Pamięć telefonu zostaje podpięta bezpośrednio pod Eksplorator plików. To genialne rozwiązanie do szybkiego usuwania starych zdjęć i śmieci za pomocą myszki.
* ❌ **Zadania wagi ciężkiej:** Przesyłanie większych plików (np. dokumentów PDF) czy streamowanie ekranu telefonu na komputer często laguje i zrywa połączenie.
* ⚠️ **Zależność od Wi-Fi:** Całość działa tragicznie, jeśli pracujesz na zapchanym, starym paśmie $2.4 \text{ GHz}$ zamiast na szybszym $5 \text{ GHz}$. Otwieranie czegokolwiek przypomina wtedy czasy modemu z lat $90$.

> [!WARNING]
> Aby to w ogóle działało, musisz być zalogowany tym samym kontem Microsoft na komputerze i w telefonie.
> Sama aplikacja mocno korzysta z telemetrii i działa w tle, niezależnie od tego, czy z niej korzystasz.

![Aplikacja Łącze z telefonem](/public/courses/windows-11/Images/łączenie-z-telefonem.png)

#### Jak działa transmisja hybrydowa
Łącze z telefonem korzysta z dwóch kanałów komunikacji:
- **Kanał sterujący (LTE / Internet / Microsoft Graph)** — przesyła powiadomienia, SMS-y, miniaturki zdjęć i status urządzenia. Działa zawsze, o ile masz zasięg.
- **Kanał danych lokalnych (Wi‑Fi Direct / LAN / USB)** — obsługuje streamowanie ekranu i przesył całych plików. Niestety bywa bardzo kapryśny, gdy sieć lokalna odmawia współpracy.

W praktyce oznacza to, że:
- **powiadomienia przychodzą zawsze**, bo lecą przez LTE,
- **pliki i ekran** działają tylko wtedy, gdy Windows i telefon dogadają się lokalnie, a jeśli nie — Windows udaje, że „coś robi”, ale tak naprawdę czeka na stabilny kanał.


![Podział transmisji LAN i WAN w funkcjonalności łączenia telefonu z Windows](/public/courses/windows-11/Images/podział-transmisji-lan-wan-względem-funkcjonalności-łączenia-telefonu-windows.png)

:::diagram
Architektura hybrydowa aplikacji Łącze z telefonem. Komunikacja opiera się na dwóch niezależnych kanałach: globalnym (*WAN* / <b>LTE</b>) do przesyłania lekkich powiadomień oraz lokalnym (**LAN** / <b>Wi-Fi Direct</b>) uruchamianym do ciężkiego transferu plików i strumieniowania ekranu.
:::

**Opis strukturalny diagramu**

1. **Urządzenie źródłowe (Telefon Android):** Podzielone na cztery główne moduły generujące ruch: SMS / RCS (zielony), Powiadomienia (niebieski), Obrazy / Zdjęcia (czerwony) oraz Ekran urządzenia (fioletowy).
2. **Kanał sterujący** (*LTE / Internet / Microsoft Graph*): Górna, brązowa sekcja pośrednicząca w warstwie WAN.
   - **Powiadomienia push:** Odbiera wiadomości SMS/RCS z telefonu i przekazuje je do modułu Powiadomień w systemie Windows 11.
   - **Metadane:** Pobiera powiadomienia z telefonu i dostarcza je do aplikacji SMS/RCS na komputerze. Dodatkowo kanał ten rzutuje metadane bezpośrednio do modułu *Miniatur zdjęć*.
   - **Status urządzenia:** Funkcjonuje niezależnie w kanale sterującym (stan baterii, zasięg).
3. **Kanał lokalny** (*Wi-Fi Direct / LAN / USB*): Dolna, zielona sekcja działająca wyłącznie w sieci lokalnej do obsługi ciężkich zadań.
   - **Pełne zdjęcia:** Pobiera zasoby z modułu Obrazy/Zdjęcia i alternatywną, szybką drogą zasila generowanie *Miniatur zdjęć* w Windows 11. Zatem miniatury mają architekturę hybrydową (łączą Metadane z WAN oraz Pełne zdjęcia z LAN).
   - **Transfer plików:** Obsługuje bezpośrednie, ciężkie przesyłanie Pełnych plików i zdjęć na dysk komputera.
   - **Ekran na żywo:** Bezpośrednio przechwytuje Ekran urządzenia i przekazuje go do modułu Strumieniowania ekranu w Windows.
4. **Odbiorca (Windows 11):** Składa strumienie z obu kanałów (lokalnego i chmurowego) do spójnego interfejsu graficznego użytkownika.


---

## 🕵️ Finał: Scenariusze Helpdesku i Konfiguracja

Zrozumienie podwójnego systemu kontroli to inżynierska gwarancja sprawnego rozwiązywania zgłoszeń z brakiem dostępu do plików.

<data-gate>
  <data-connection-matcher title="Narzędzia Lokalne i Zaawansowane Ścieżki Sieciowe">
    <div class="cmw-item" data-left="Pracownik IT potrzebuje dyskretnie zgrać plik ze stacji roboczej pracownika, bez tworzenia nowych, udostępnionych folderów." data-right="Wpisuje w oknie Eksploratora ukrytą ścieżkę \\IP_Komputera\C$ i autoryzuje się poświadczeniami lokalnego Administratora docelowej maszyny."></div>
    <div class="cmw-item" data-left="Menedżer szuka bezpiecznej aplikacji do szybkiego przerzucania dużych plików między komputerami w biurze bez używania serwerów w chmurze." data-right="Instaluje na stanowiskach darmowy program LocalSend, który działa w pełni lokalnie w oparciu o bezpośrednią komunikację P2P (Peer-to-Peer)."></div>
    <div class="cmw-item" data-left="Uczeń próbuje wysłać plik na laptop nauczyciela przez funkcję 'Udostępnianie w pobliżu', ale jego sprzęt w ogóle nie pojawia się na liście." data-right="Nauczyciel ma włączoną tę funkcję, ale zapomniał zmienić tryb. Działa ona na ustawieniu 'Tylko moje urządzenia', przez co laptop ukrywa się przed cudzymi kontami."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Mechanizm dwóch zamków (SMB + NTFS):** Dostęp sieciowy to dwa osobne światy. _**SMB**_ to pierwsza bramka na wejściu, a **NTFS** to fizyczny zamek na dysku. System łączy je w "Uprawnienia Efektywne" i stosuje bezlitosną zasadę: najciaśniejsze przejście decyduje o wszystkim. 🏰
- **Standard Enterprise (Praktyka IT):** Nikt w IT nie układa skomplikowanych uprawnień w obu miejscach naraz! W dużych firmach udział _**SMB**_ po prostu otwiera się na oścież ("Pełna kontrola" dla wszystkich), a dostęp do danych kontroluje się już twardo z poziomu zakładki zabezpieczeń w **NTFS**. ⚙️
- **Dlaczego nie można usunąć `Usuwania` w MFT:** Aplikacje biurowe rzadko nadpisują pliki na żywo w sektorach. Najczęściej tworzą obok nową wersję, a starą kasują. Jeśli zabierzesz komuś w **NTFS** prawo do `Usuwania`, jego praca z dokumentami Worda i Excela często zakończy się błędem zapisu. 📝
- **Ukryte udziały administracyjne** (`$`): Każdy Windows domyślnie rzutuje swój pełny dysk do sieci LAN jako ukryty zasób (np. `C$`). Znak dolara chowa folder z widoku, ale znając poświadczenia administratora danej stacji roboczej, możesz zarządzać nią w pełni zdalnie bez przerywania pracy użytkownika. 💻
- **Szyfrowanie E2EE vs. zwykłe E2E:** Szyfrowana transmisja (E2E) w usługach typu MS Teams czy zwykły Telegram nadal pozwala serwerom chmurowym czytać Twoje pakiety w połowie drogi, by je m.in. filtrować. Pełne E2EE (jak w LocalSend) daje pewność, że na kluczowej warstwie poufności przekaźnik widzi tylko szum informacyjny. 🔒
- **Kanały hybrydowe:** Nowoczesne usługi, jak wbudowane w Windows *Łącze z telefonem*, żonglują połączeniami. Lekkie dane i powiadomienia przepychają niezawodnym kanałem przez chmurę (LTE), a grube transfery plików rzucają na bezpośrednie lokalne mosty (Wi-Fi Direct). 📱

---

Strasznie sieciowo się zrobiło 😅. 
Został nam ostatni moduł. Ruszmy z diagnostyką i modyfikacją systemu! 🫙
