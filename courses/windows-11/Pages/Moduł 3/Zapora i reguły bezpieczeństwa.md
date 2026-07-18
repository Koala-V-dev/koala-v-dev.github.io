# Zapora i reguły bezpieczeństwa

Zapora sieciowa (Windows Defender Firewall) w systemie Windows to dla wielu początkujących administratorów temat „czarnej magii”. Najczęściej kończy się to klikaniem na oślep, tworzeniem dziesiątek powielających się reguł lub, co najgorsze, całkowitym wyłączaniem zapory „dla testu”.

W tej lekcji odrzucamy amatorskie sztuczki. Zejdziemy pod maskę systemu operacyjnego, by zrozumieć architekturę zapory, precyzyjny algorytm ewaluacji pakietów oraz mechanizmy logowania.

> [!NOTE]
> **Ewaluacja**: Ocena, analiza, szacowanie.

---

## 🤵🏻‍♂️ Anegdotyczno-abstrakcyjna idea Zapory Sieciowej

Wyobraź sobie, że jesteś unieruchomiony i nie możesz opuszczać swojej willi. Zapora sieciowa to twój lokaj – zarządca wejścia.

Gdy zamawiasz jedzenie, lokaj wie o tym i wpuszcza dostawcę. To sytuacja, w której korzystasz z przeglądarki i łączysz się z jakąś stroną. Ty zainicjowałeś połączenie, więc odpowiedź może wrócić do środka.

Inaczej wygląda to w przypadku programów, które oczekują połączeń z zewnątrz, np. gdy hostujesz grę. Załóżmy, że jesteś fanem MTG i chcesz, aby znajomi przyszli do twojej willi pograć. Musisz powiedzieć lokajowi, że ma ich wpuścić – czyli otworzyć odpowiedni port.

Przed willą stoi jednak tłum ludzi. To miliony pakietów z internetu, które mogą próbować dostać się do środka. Lokaj wie jednak, że przygotowałeś stół do MTG, więc sprawdza każdego gościa (pakiet) i wpuszcza tylko tych, którzy mają talię MTG. Jeśli ktoś ma talię pokera albo nie ma jej wcale – nie wchodzi.

Po co więc zapora?  
Aby chronić cię przed niebezpiecznymi osobami (hakerami), które chcą cię okraść lub zaszkodzić. Dodatkowo zapobiega niepotrzebnemu obciążeniu systemu, blokując ruch, którego i tak nie chcesz obsługiwać.

![Schemat decyzyjny dołączania gracza z internetu do hostowanej na komputerze gry](/public/courses/windows-11/Images/schemat-decyzyjny-dołączania-gracza-z-internetu-do-hostowanej-na-komputerze-gry.png)

:::diagram
Diagram przedstawia proces filtrowania ruchu sieciowego przez zaporę Windows Filtering Platform (WFP).
Pokazuje decyzję „Zezwól” lub „Odrzuć” dla gracza próbującego połączyć się z serwerem gry.
:::

**Opis strukturalny diagramu**

1. **Gracz z internetu** – inicjuje połączenie z portem gry.  
2. **Zapora / WFP** – punkt decyzyjny, który sprawdza reguły bezpieczeństwa.  
3. **Zgoda na regułę** → gracz dołącza do serwera gry.  
4. **Brak zgody lub reguły** → pakiet zostaje odrzucony.  
5. Kolory: zielony = zezwól, żółty = odrzuć.



## 🏗️ Architektura pod maską: WFP i BFE

Zapora w Windowsie nie jest po prostu „programem”. To głęboko zintegrowany mechanizm systemu operacyjnego. Zrozumienie jego warstw to pierwszy krok do eksperckości.

1. **WFP (Windows Filtering Platform):** To zbiór sterowników sieciowych operujących na poziomie jądra systemu (Ring 0). WFP ma możliwość zatrzymywania, modyfikowania lub odrzucania każdego pakietu wchodzącego i wychodzącego z interfejsu sieciowego. To jest „silnik” zapory.
2. **BFE (Base Filtering Engine - Podstawowy aparat filtrowania):** Usługa działająca w przestrzeni użytkownika, która zarządza regułami i przekazuje je do WFP. 
3. **Zapora Defender (Interfejs):** Narzędzia takie jak `wf.msc` czy `netsh` to tylko interfejsy graficzne/konsolowe, które wysyłają żądania do usługi BFE.

![Diagram decyzyjny rządania blokady ruchu X przez program antywirusowy z podziałęm na tryb usera i tryb kernela](/public/courses/windows-11/Images/diagram-decydyjny-rządania-blokady-ruchu-X-przez-program-antywirusowy-z-podziałęm-na-tryb-usera-i-tryb-kernela.png)

:::diagram
Diagram decyzyjny przedstawia proces przekazywania żądania zablokowania ruchu sieciowego przez aplikację antywirusową działającą w przestrzeni użytkownika (User Mode) do sterowników filtrujących sieci w jądrze systemu (Kernel Mode) za pośrednictwem silnika BFE i WFP. Przedstawia dokładną ścieżkę decyzyjną oraz przepływ pakietów.
:::

**Opis strukturalny diagramu**

1. **Przestrzeń użytkownika (User Mode)** – na górze schematu znajduje się proces: `Program Antywirusowy` (krok 1: „Chcę zablokować ruch X”) przekazuje żądanie do biblioteki `BFE.DLL`.  
2. **Weryfikacja w BFE (krok 2)** – następuje weryfikacja cyfrowa i uprawnień aplikacji. Blok decyzyjny `Czy program ma uprawnienia?` rozdziela przepływ: ścieżka **NIE** prowadzi do akcji `Odrzuć żądanie. Zapisz błąd w logach`, a ścieżka **TAK** przechodzi do `Tłumaczenie reguły dla jądra Windows`.  
3. **Bezpieczna granica systemowa** – żądanie przekracza granicę trybów przez dedykowany `Interfejs IPC / IOCTL`.  
4. **Przestrzeń jądra (Kernel Mode)** – krok 3: przekazanie instrukcji w formacie binarnym do silnika `WFP Core` (Kernel Filter Engine). Krok 4: następuje aktualizacja tabeli filtrów w pamięci RAM jądra, co modyfikuje `Tabelę Aktywnych Filtrów`.  
5. **Przepływ pakietów sieciowych (dół schematu)** – krok 5: przychodzący pakiet sieciowy z `Karty Sieciowej Ethernet/Wi-Fi` trafia do `WFP Core`. Krok 6: następuje błyskawiczne porównanie z `Tabelą Aktywnych Filtrów`.  
6. **Decyzja WFP** – końcowy krok rozstrzygający los pakietu: ścieżka **Zezwól** oznacza `Przepuść do Windowsa`, natomiast ścieżka **Blokuj** powoduje `Fizyczne porzucenie pakietu w nicość`.

> [!CAUTION]
> **Scenariusz Awarii:** Jeśli wirus lub złośliwy skrypt zatrzyma usługę **BFE**, cały mechanizm zapory przestaje działać. Co gorsza, system Windows automatycznie przejdzie w tryb "zamknij wszystko", odcinając dostęp do sieci, aby chronić komputer! BFE jest absolutnym fundamentem bezpieczeństwa sieciowego Windows.

<data-gate>
  <data-quiz>
    <question>Jak w architekturze systemu Windows Defender Firewall realizowana jest ścieżka od zdefiniowania reguły przez administratora w GUI (wf.msc) do fizycznego zablokowania pakietu na karcie sieciowej?</question>
    <options>
      <item>Konsola wf.msc bezpośrednio modyfikuje sterownik jądra systemu, który automatycznie pobiera czarną listę IP i przekazuje ją do fizycznej karty sieciowej.</item>
      <item correct>Konsola wf.msc wysyła żądanie do usługi Base Filtering Engine (BFE), która autoryzuje zmianę i wdraża ją bezpośrednio do jądra Windows Filtering Platform (WFP).</item>
      <item>Sterownik jądra WFP regularnie monitoruje pamięć konsoli wf.msc i w przypadku wykrycia nowych wpisów automatycznie restartuje cały stos protokołów sieciowych.</item>
      <item>Aplikacja antywirusowa w trybie użytkownika przejmuje kontrolę nad bazą danych WFP i samodzielnie kompiluje kod binarny dla sterowników kart sieciowych.</item>
    </options>
    <div data-hint="error">
      Przeanalizuj podział ról zapory: które elementy działają w przestrzeni użytkownika (User Mode) jako interfejs lub zarządca reguł, a który element operuje bezpośrednio w jądrze systemu (Kernel Mode) na poziomie sterowników sieciowych. Spójrz na diagram przepływu żądania.
    </div>
    <div data-hint="success">
      Doskonale! BFE zarządza regułami w przestrzeni użytkownika i przekazuje je do WFP działającego w jądrze systemu, co umożliwia niskopoziomowe filtrowanie pakietów.
    </div>
  </data-quiz>
</data-gate>

---

## 🌐 NLA (Network Location Awareness) – Inteligencja Profilowania

System Windows obsługuje trzy profile zapory: **Domena**, **Prywatny**, **Publiczny**. Pytanie brzmi: *Skąd Windows wie, którego profilu użyć w danej sekundzie i jak unika pomyłek?*

Za identyfikację sieci i dopasowanie odpowiedniego profilu zapory odpowiada usługa systemowa **NLA (Network Location Awareness - Rozpoznawanie lokalizacji w sieci)**.

### 🧠 Jak NLA identyfikuje sieć? (Network Signature)
NLA nie zgaduje. Gdy system nawiązuje połączenie sieciowe (Ethernet, Wi-Fi, VPN), usługa NLA generuje unikalny **podpis sieci (Network Signature)** na podstawie następujących danych:
1. **Adres MAC bramy domyślnej (Default Gateway):** Główny identyfikator dla sieci przewodowych i bezprzewodowych.
2. **SSID sieci bezprzewodowej:** Dla połączeń Wi-Fi nazwa sieci jest kluczowym elementem sygnatury.
3. **Sufiks DNS domeny:** Przypisywany przez serwer DHCP (np. `firma.local`).

Na podstawie tych parametrów NLA tworzy unikalny identyfikator (GUID) sieci i szuka go w rejestrze systemowym pod kluczem:
`HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\NetworkList\Profiles` oraz `Signatures`

---

### 💾 Anatomia rejestru NLA (Network List)

Podpis sieci oraz przypisane do nich profile zapory są przechowywane w rejestrze systemowym pod ścieżką:  
`HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\NetworkList`

Wgląd pod maskę pozwala zrozumieć, skąd Windows czerpie te informacje:

#### 1. Profile sieciowe (`...\NetworkList\Profiles`)
Każda zapamiętana sieć ma tutaj swój klucz oznaczony unikalnym identyfikatorem GUID. Przyjrzyjmy się kluczowi profilu telefonu ze zrzutu ekranu:  
`Profiles\{261356F1-78CE-4CC2-A353-FDEDDC7DD8C2}`

| Wartość rejestru | Typ       | Opis / Analiza                                                                                                                                     |
| :--------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProfileName`    | REG_SZ    | Nazwa profilu. Tutaj: `Galaxy J6B373` (SSID sieci Wi-Fi).                                                                                          |
| `Description`    | REG_SZ    | Opis pomocniczy. Tutaj również: `Galaxy J6B373`.                                                                                                   |
| `Category`       | REG_DWORD | **Kluczowa dla zapory!** Definiuje typ sieci:<br>• `0` = **Publiczna** (Public)<br>• `1` = **Prywatna** (Private)<br>• `2` = **Domenowa** (Domain) |
| `Managed`        | REG_DWORD | Określa, czy sieć jest zarządzana przez GPO (`1` - tak, `0` - nie).                                                                                |
| `NameType`       | REG_DWORD | Określa typ połączenia (np. `0x47` to sieć bezprzewodowa Wi-Fi, `0x06` / `0x01` to Ethernet).                                                      |

![Klucz rejestru profilu sieciowego w edytorze rejestru (regedit)](/public/courses/windows-11/Images/nla-registry-profile.png)

:::diagram
Zrzut ekranu z Edytora rejestru (regedit) przedstawiający zawartość klucza Profiles\{261356F1-78CE-4CC2-A353-FDEDDC7DD8C2} z wartościami takimi jak Category ustawioną na 0.
:::

**Opis strukturalny diagramu**
1. **Drzewo rejestru** – po lewej stronie rozwinięta gałąź `NetworkList\Profiles` z listą identyfikatorów GUID.
2. **Wybrany GUID** – zaznaczony profil telefonu `{261356F1-78CE-4CC2-A353-FDEDDC7DD8C2}`.
3. **Panel szczegółów** – po prawej stronie lista wartości: `ProfileName` o wartości `Galaxy J6B373`, `Category` ze statusem `0` (sieć publiczna) oraz pozostałe metadane profilu.

#### 2. Sygnatury sieciowe (`...\NetworkList\Signatures`)
Dzielą się na `Managed` (zarządzane domanowo) oraz `Unmanaged` (niezarządzane). NLA przechowuje tu parametry fizyczne sieci, aby dopasować je do profilu GUID:
*   Klucz sygnatury to unikalny hash (np. `010103000F00...`).
*   Wewnątrz klucza wartość `ProfileGuid` wskazuje na konkretny profil (np. `{261356F1-78CE-4CC2-A353-FDEDDC7DD8C2}`).
*   Wartość `DefaultGatewayMac` przechowuje adres MAC bramy domyślnej routera (np. `9a,85,b2,e0,37,30`).
*   Wartość `DnsSuffix` wskazuje na sufiks domeny (np. `play.pl` lub `<brak>`).

To powiązanie gwarantuje, że dopóki nie zmieni się adres MAC bramy lub SSID, NLA zawsze bezbłędnie rozpozna sieć i wczyta z rejestru przypisany jej profil (np. Prywatny).

---

### 🕵️ Algorytm przydzielania profili: Krok po kroku

Oto rzeczywista ścieżka decyzyjna usługi NLA po wykryciu połączenia:

![Schemat decyzyjny wczytywania profilu zapory sieciowej przez usługę NLA](/public/courses/windows-11/Images/decyzje-o-wczytaniu-danego-profilu-zapory-sieciowej-przez-NLA.png)

:::diagram
Diagram przedstawia logiczny algorytm usługi NLA określający, który z trzech profilów zapory sieciowej (Domena, Prywatny lub Publiczny) zostanie przypisany do połączenia.
:::

**Opis strukturalny diagramu**

1. **Nawiązanie połączenia** – system wykrywa nowe połączenie sieciowe i uruchamia procedurę identyfikacji sieci (NLA).
2. **Przynależność do domeny AD** – NLA sprawdza, czy komputer jest członkiem domeny Active Directory.
3. **Detekcja kontrolera domeny (DC)** – w przypadku przynależności do domeny system próbuje zlokalizować kontroler domeny. Jeśli się to uda, wczytywany jest profil **Domena**.
4. **Sprawdzenie rejestru (podpis sieci)** – jeśli DC nie zostanie wykryty lub komputer nie należy do domeny, NLA porównuje podpis sieci z bazą danych zapamiętanych sieci w rejestrze systemowym.
5. **Wczytanie zapisanego profilu** – jeśli sieć jest znana, system wczytuje przypisany do niej wcześniej profil (**Prywatny** lub **Publiczny**).
6. **Profil domyślny (Publiczny)** – nowa sieć automatycznie otrzymuje profil publiczny.
7. **Monit / Akcja użytkownika** – zmiana profilu nowej sieci zależy od zachowania użytkownika (monit o wykrywanie sieci lub ręczna konfiguracja we właściwościach).
8. **Decyzja o wykrywaniu sieci** – zezwolenie na wykrywanie przełącza sieć na profil **Prywatny**, odmowa pozostawia profil **Publiczny**.


#### 1. Sieć Domeny (Domain Profile)
NLA automatycznie aktywuje profil Domeny **tylko** wtedy, gdy:
- Komputer jest członkiem domeny Active Directory.
- Na danym interfejsie sieciowym zostanie pomyślnie zlokalizowany i uwierzytelniony **Kontroler Domeny (Domain Controller - DC)**. Odbywa się to poprzez odpytanie DNS o rekordy SRV (np. `_ldap._tcp.dc._msdcs.nazwadomeny.pl`) oraz próbę kontaktu przez protokoły LDAP/Kerberos. Jeśli DC nie odpowie (np. łączysz się z domową siecią bez VPN), profil Domeny **nie** zostanie aktywowany.

#### 2. Profil Prywatny (Private Profile) vs Publiczny (Public Profile) – Obalamy mit
> [!WARNING]
> **Windows nigdy automatycznie nie przypisuje profilu Prywatnego dla nowej sieci!**
> Ze względów bezpieczeństwa (zasada najniższego poziomu zaufania), domyślnym profilem dla każdej nowej, dotąd nieznanej sieci jest zawsze profil **Publiczny**.

System przełączy sieć na profil **Prywatny** wyłącznie w następujących sytuacjach:
- **Decyzja użytkownika podczas pierwszego łączenia (Wi-Fi):** System pyta: *„Czy chcesz zezwolić innym komputerom i urządzeniom w tej sieci na odnajdowanie Twojego komputera?”*. Kliknięcie **Tak** oznacza zmianę kategorii na Prywatną.
- **Wymuszenie przez administratora:** Za pomocą PowerShell, Zasad Grupy (GPO) lub bezpośredniej edycji rejestru.
- **Ręczna zmiana w Ustawieniach:** Użytkownik wchodzi w `Ustawienia` -> `Sieć i internet` -> `Wi-Fi / Ethernet` -> Właściwości sieci i zaznacza `Typ profilu sieciowego` na **Prywatny**.  
PS możesz też tu podejrzeć hasło i uzyskać wynik tekstowy oraz QR kod.
![Typ profilu sieciowego dla sieci Wi-Fi w ustawieniach Windows 11](/public/courses/windows-11/Images/siec-wifi-profile-zapory-i-pokaz-haslo.png)

---

### 🌐 NCSI (Network Connection Status Indicator) – Pomocnik NLA
NLA ściśle współpracuje z inną usługą – **NCSI (Wskaźnik stanu połączenia sieciowego)**. To NCSI odpowiada za to, czy na pasku zadań widzisz ikonę globusa („Brak dostępu do Internetu”), czy pełne połączenie.

NCSI wykonuje dwa testy (tzw. sondy):
1. **Sonda aktywna HTTP:** Próbuje pobrać plik tekstowy z serwerów Microsoft (dla Windows 11 jest to żądanie GET do `http://www.msftconnecttest.com/connecttest.txt` oczekując odpowiedzi `Microsoft Connect Test` i kodu HTTP 200).
2. **Sonda DNS:** Wykonuje zapytanie o adres IP dla domeny `dns.msftncsi.com`. Oczekuje konkretnej odpowiedzi (np. `131.107.255.255`).

Jeśli któryś z testów zawiedzie, system zgłosi status „Brak internetu” (ikona globusa na pasku zadań).

**Dlaczego to ważne w praktyce? Przykład z hotelu/kawiarni:**
1. **Blokada początkowa:** Łączysz się z Wi-Fi w hotelu. Zanim zalogujesz się na stronie powitalnej, router hotelowy blokuje cały ruch.
2. **Reakcja NCSI:** Sonda NCSI próbuje pobrać plik testowy, ale router hotelowy przekierowuje to żądanie na swoją stronę logowania. NCSI nie otrzymuje spodziewanej odpowiedzi `Microsoft Connect Test` i ustawia status **Brak dostępu do internetu**. NLA przypisuje profil **Publiczny**.
3. **Autoryzacja:** Otwierasz przeglądarkę i pomyślnie logujesz się do sieci hotelowej. Router odblokowuje ruch dla Twojej karty sieciowej.
4. **Wykrycie zmiany przez NCSI:** NCSI ponawia próbę i tym razem pomyślnie pobiera plik tekstowy z serwera Microsoft. Ikona na pasku zadań zmienia się na aktywną sieć Wi-Fi.
5. **Reakcja NLA:** Ta zmiana statusu NCSI działa jak impuls – natychmiast wyzwala w usłudze NLA ponowną ewaluację (sprawdzenie) parametrów sieci, by upewnić się, czy zapora systemowa wczytała właściwy profil.

Teraz pewnie rozumiesz dlaczego po połączeniu się z siecią status może być *„Połączono. Brak Internetu”*. 😉

---

### 🛠️ Zarządzanie profilami sieciowymi z poziomu konsoli

Gdy interfejs graficzny Windows (GUI) nie pozwala na zmianę profilu (np. przy sieciach oznaczonych jako „Sieć niezidentyfikowana”), administrator musi sięgnąć po konsolę PowerShell (uruchomioną jako Administrator).

#### Krok 1: Weryfikacja bez uprawnień administratora
Jeśli uruchomisz standardową konsolę PowerShell (jako zwykły użytkownik) i spróbujesz zmienić profil, polecenie zakończy się błędem braku uprawnień:

```powershell
PS C:\Users\Technik> Get-NetConnectionProfile

Name                    : WIFI12345678
InterfaceAlias           : Wi-Fi
InterfaceIndex           : 8
NetworkCategory          : Public
DomainAuthenticationKind  : None
IPv4Connectivity         : Internet
IPv6Connectivity         : Internet

PS C:\Users\Technik> Set-NetConnectionProfile -Name "WIFI12345678" -NetworkCategory Private
Set-NetConnectionProfile : Unable to set the NetworkCategory due to one of the following possible reasons: not running
PowerShell elevated; the NetworkCategory cannot be changed from 'DomainAuthenticated'; user initiated changes to Networ
kCategory are being prevented due to the Group Policy setting 'Network List Manager Policies'.
At line:1 char:1
+ Set-NetConnectionProfile -Name "WIFI12345678" -NetworkCategory Private
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : PermissionDenied: (MSFT_NetConnect...466C7009F50D}"):root/StandardCi...nnectionProfile)
   [Set-NetConnectionProfile], CimException
    + FullyQualifiedErrorId : MI RESULT 2,Set-NetConnectionProfile
```

#### Krok 2: Zmiana z uprawnieniami Administratora
Po uruchomieniu PowerShell jako Administrator możesz swobodnie zarządzać profilami:

```powershell
# 1. Sprawdzenie profilu
PS C:\Windows\system32> Get-NetConnectionProfile

Name                    : WIFI12345678
InterfaceAlias           : Wi-Fi
InterfaceIndex           : 8
NetworkCategory          : Public
DomainAuthenticationKind  : None
IPv4Connectivity         : Internet
IPv6Connectivity         : Internet

# 2. Wymuszenie profilu Prywatnego dla konkretnej sieci
PS C:\Windows\system32> Set-NetConnectionProfile -Name "WIFI12345678" -NetworkCategory Private

# 3. Potwierdzenie zmiany
PS C:\Windows\system32> Get-NetConnectionProfile

Name                    : WIFI12345678
InterfaceAlias           : Wi-Fi
InterfaceIndex           : 8
NetworkCategory          : Private
DomainAuthenticationKind  : None
IPv4Connectivity         : Internet
IPv6Connectivity         : Internet

# 4. Przywrócenie profilu Publicznego
PS C:\Windows\system32> Set-NetConnectionProfile -Name "WIFI12345678" -NetworkCategory Public

# 5. Potwierdzenie powrotu do profilu Publicznego
PS C:\Windows\system32> Get-NetConnectionProfile

Name                    : WIFI12345678
InterfaceAlias           : Wi-Fi
InterfaceIndex           : 8
NetworkCategory          : Public
DomainAuthenticationKind  : None
IPv4Connectivity         : Internet
IPv6Connectivity         : Internet
```

> [!TIP]
> Zwróć uwagę na komunikat o błędzie z kroku pierwszego. Informuje on, że próba zmiany profilu sieci może być również blokowana przez centralne Zasady Grupy (GPO) w firmie: `Group Policy setting 'Network List Manager Policies'`.

> [!TIP]
> Jeśli masz problem z ciągle resetującym się profilem sieci bezprzewodowej do stanu "Publiczny", upewnij się, że Twoja brama domyślna (router) ma przypisany stały adres MAC i nie zmienia go dynamicznie (np. z powodu włączonej ochrony przed śledzeniem / losowych adresów MAC w routerze). Zmiana MAC bramy wymusza na NLA wygenerowanie nowej sygnatury sieci i powrót do domyślnego profilu Publicznego.

<data-gate>
  <data-quiz>
    <question>W jaki sposób usługi NLA (Network Location Awareness) oraz NCSI (Network Connection Status Indicator) współpracują przy określaniu profilu zapory i stanu sieci po podłączeniu komputera?</question>
    <options>
      <item>NLA przeprowadza aktywne testy połączeń HTTP/DNS z serwerami Microsoft, a usługa NCSI na tej podstawie zapisuje w rejestrze systemowym nową konfigurację zapony.</item>
      <item correct>NCSI bada dostępność internetu za pomocą sond HTTP/DNS, podczas gdy NLA tworzy unikalny podpis sieci (MAC i SSID) i wczytuje z rejestru przypisany do niego profil.</item>
      <item>System Windows automatycznie wymusza bezpieczny profil Prywatny, jeśli sonda HTTP usługi NCSI nie powiedzie się z powodu przekierowania na stronę logowania routera.</item>
      <item>NLA wyłącza filtry zapory sieciowej na wszystkich kartach, gdy NCSI potwierdzi obecność kontrolera domeny Active Directory oraz zweryfikuje poprawność rekordów DNS.</item>
    </options>
    <div data-hint="error">
      Przypomnij sobie zasadę działania sond (HTTP i DNS) – do czego one służą? Następnie zastanów się, co wchodzi w skład sygnatury (Network Signature) tworzonej przez NLA i jaka kategoria profilu jest domyślnie przypisywana nowej sieci.
    </div>
    <div data-hint="success">
      Świetnie! NCSI bada dostępność internetu, a NLA na podstawie unikalnej sygnatury (SSID i MAC) dopasowuje profil z rejestru. Nowe sieci zawsze domyślnie otrzymują bezpieczny profil Publiczny.
    </div>
  </data-quiz>
</data-gate>

---

## ⚙️ Prawdziwy Algorytm Przetwarzania Reguł

To jest najczęściej oblewany punkt na testach dla administratorów. W starych firewallach sprzętowych (Cisco ASA, wczesne iptables) liczyła się *kolejność* reguł od góry do dołu. 

**W zaporze Windows kolejność reguł nie ma żadnego znaczenia.** Zamiast tego, każdy pakiet przychodzący przechodzi przez twardy, 4-stopniowy algorytm ewaluacji:

1. **Obejście Uwierzytelnione** (_**IPsec Authenticated Bypass**_): Jeśli nadejdzie pakiet zaufany, kryptograficznie zweryfikowany przez protokół IPsec (zgodnie z regułami zabezpieczeń połączeń), zostaje natychmiast wpuszczony, z pominięciem kolejnych kroków.
2. **Reguły Blokujące** (_**Block Connections**_): System przeszukuje listę reguł. Jeśli znajdzie *jakąkolwiek* regułę blokującą pasującą do pakietu, pakiet jest natychmiast niszczony (DROP). **Blokada jest królem.**
3. **Reguły Zezwalające** (_**Allow Connections**_): Jeśli nie było blokady, system szuka reguły wpuszczającej. Jeśli ją znajdzie, wpuszcza pakiet. W tym momencie zapora *stanowa* (Stateful) zapisuje to połączenie.
4. **Domyślne Zachowanie** Profilu: Jeśli pakiet nie dopasował się ani do reguły Blokuj, ani Zezwalaj, decyduje profil. Dla ruchu przychodzącego to zawsze DROP.

> [!IMPORTANT]
> Z algorytmu wynika **złota inżynieryjna zasada**: Jeśli chcesz komuś zezwolić na dostęp do portu 80, nie twórz reguły "Blokuj wszystkich" a potem "Zezwól szefowi". Ponieważ zasada nr 2 wygrywa z nr 3, szef i tak zostanie zablokowany! Wystarczy, że usuniesz reguły zezwalające dla innych, a zadziała zasada nr 4 (domyślny DROP). Reguł "Blokuj" używamy wyłącznie po to, by odciąć dostęp komuś konkretnemu.

<data-gate>
  <data-quiz>
    <question>Administrator dodał dwie reguły w zaporze Windows Defender: jedną typu Blokuj (Block) dla całego ruchu przychodzącego z podsieci $192.168.0.0/24$ na port `8000`, oraz drugą typu Zezwalaj (Allow) dla komputera o adresie $192.168.0.2$ na ten sam port. Czy połączenie z adresu $192.168.0.2$ zostanie zrealizowane?</question>
    <options>
      <item>Tak, ponieważ reguła zezwalająca wskazuje pojedynczy adres IP, co nadaje jej wyższy priorytet nad regułą blokującą obejmującą całą podsieć.</item>
      <item correct>Nie, ponieważ reguły blokujące są przetwarzane przed zezwalającymi i w razie dopasowania pakiet sieciowy jest natychmiast odrzucany (DROP).</item>
      <item>Tak, o ile reguła zezwalająca dla wybranego hosta została zdefiniowana chronologicznie wcześniej niż reguła blokująca ruch dla podsieci.</item>
      <item>Nie, ponieważ każdy pakiet kierowany na porty wyższe niż 1024 wymaga przeprowadzenia wcześniejszego uwierzytelnienia przez protokół IPsec.</item>
    </options>
    <div data-hint="error">
      Przeanalizuj 4-stopniowy algorytm przetwarzania pakietu przez zaporę. Co jest sprawdzane w kroku drugim (Reguły Blokujące), a co w kroku trzecim (Reguły Zezwalające)? Jak wpływa to na sytuację, gdy pakiet pasuje do obu reguł?
    </div>
    <div data-hint="success">
      Znakomicie! Ponieważ reguła Blokuj jest sprawdzana przed Zezwalaj (krok 2 vs krok 3), blokada zawsze ma pierwszeństwo. Złotą zasadą jest unikanie reguł blokujących dla podsieci, gdy chcemy dopuścić tylko wybrane wyjątki.
    </div>
  </data-quiz>
</data-gate>

---

# Konfiguracja zapory sieciowej

## 🧫 Przygotowanie środowiska laboratoryjnego

Zanim przejdziemy do ustawień przygotujmy nasze środowisko laboratoryjne w VirtualBox.

Po zaimportowaniu maszyny `Windows 11 PRO` kliknij na nią PPM i wybierz opcję **„Sklonuj”**.  
W nowym oknie ustal nazwę i wybierz rodzaj klonowania: **„Powiązany klon”**. Nie zapomnij zmienić też Polityki adresów MAC na `Wygeneruj nowe adresy MAC dla wszystkich kart sieciowych` i kliknij <kbd class="win-menu-btn">Zakończ</kbd>.

![klon-powiązany-Virtual-Box](/public/courses/windows-11/Images/klon-powiązany-Virtual-Box.png)

Upewnij się, że w ustawieniach każdej maszyny wirtualnej Twoja karta sieciowa działa w trybie **`Sieć wewnętrzna`** i jest przypisana do tej samej sieci wirtualnej np.: **`intnet`**. Ważne aby do maszyny był podłączony wirtualny kabel.  
Możesz też zmienić ustawienie *Promiscuous Mode* na **`Pozwalaj wszystkim`** – bedziesz miał pewność, że VirtualBox nie zablokuje po drodze jakiegoś pakietu.

![ustawienia-sieciowe-maszyny-wirtualnej-VirtualBox](/public/courses/windows-11/Images/ustawienia-sieciowe-maszyny-wirtualnej-VirtualBox.png)

VirtualBox jest popularnym i darmowym rozwiązaniem, ale nie koniecznie najlepszym.  
Jeżeli maszyny ci lagują to musisz poeksperymentować z ustawieniami w `System` i `Ekran`.
W moim przypadku działanie snapszotów poprawiło się po wyłączniu akceleracji i zmianie sterownika graficznego oraz ustawienie rdzeni procesora na $1$ i ilości pamięci RAM na $2 \text{ GB}$.  
![ustawienia-akceleracji-i-sterownika-grafiki-w-vm](/public/courses/windows-11/Images/ustawienia-akceleracji-i-sterownika-grafiki-w-vm.png)

Dodatkowo możesz zaznaczyć pola: 
- <kbd class="check-mark"></kbd> `Użyj buforowania wejścia/wyjścia gospodarza`
- <kbd class="check-mark"></kbd> `Dysk SSD`
![ustawienia-pamięci-VB](/public/courses/windows-11/Images/ustawienia-pamięci-VB.png)

## 🎭 Konfiguracja interfejsów sieciowych maszyn wirtualnych

Mając już trzy klony powiązane (*snapshots*), skonfiguruj na nich następujące adresy IP:

| Maszyna | VM_1            | VM_2            | VM_3            |
| :------ | :-------------- | :-------------- | :-------------- |
| IPv4    | `192.168.0.1`   | `192.168.0.2`   | `192.168.0.3`   |
| Maska   | `255.255.255.0` | `255.255.255.0` | `255.255.255.0` |

Jak widzisz mimo poprawnej konfiguracji `ping` nie przechodzą i jest to spowodowane tym że **Zapora Windows Defender** je odrzuca.
![dwie-maszyny-wiertualne-w-których-nie-przechodzi-ping](/public/courses/windows-11/Images/dwie-maszyny-wiertualne-w-których-nie-przechodzi-ping.png)

Skonfigurujmy regułę zezwalającą na ruch z `ping` protokołu _**ICMP**_ w maszynie `VM_1`.

1. Uruchom przystawkę `wf.msc`
2. W zakładce *Reguły przychodzące* przestaw sobie nagłówki kolumn tak abyś miał podgląd na interesujące nas dane:
  - **Nazwa**: Udostępnianie plików i drukarek (żądanie echo — ruch przychodzący ICMPv4)
  - **Protokół**: ICMPv4
  - **Profil**: Prywatny, Publiczny
Najpewniej jesteś domyślnie na profilu Publicznym, ale jak pewnie zauważyłeś jest niżej odzielna reguła gdy dołączysz do domeny Active Directory (Domena). Prawym przyciskiem myszy rozwiń menu i kliknij **Włącz regułę**.

![wf.msc-reguła-udostępniania-plików-i-drukarek-włącz](/public/courses/windows-11/Images/wf.msc-reguła-udostępniania-plików-i-drukarek-włącz.png)

Teraz każda maszyna bedzie wstanie spingować tą stację roboczą (*HOST*). To jednak sprawia że równie dobrze można by było wyłączyć zaporę. 🤨

3. Konfiguracja białej listy (*white-list*).  
Kliknij dwukrotnie na włączoną wcześniej regułę a następnie w zakładkę <kbd class="win-menu-btn">Zakres</kbd>.  
Zobaczysz tam dwie sekcje: **Lokalny adres IP** i **Zdalny adres IP**.  Na logikę jest podział na komunikację w sieci lokalnej i poprzez internet. Nic bardziej mylnego 🥸:
    - **Lokalny adres IP** to filtr na twoje interfejsy sieciowe np.: WI-FI, Ethernet, VirtualBox Host-only Adapter czy Hamachi.
    - **Zdalny adres IP** to filtr na adresy IP które chcesz przepuścić z **zewnątrz** do twojego komputera.

Kliknij <kbd class="win-menu-btn">Dodaj...</kbd> i wpisz adres IP `192.168.0.2` aby znalazł się na liście dozwolonych.

![konfiguracja-zakresu-zezwoleń-na-ping-dla-jedej-maszyny](/public/courses/windows-11/Images/konfiguracja-zakresu-zezwoleń-na-ping-dla-jedej-maszyny.png)


Teraz jak widzisz poniżej ma to wiekszy sens bo przepuszczamy ping tylko dla adresu `192.168.0.2` a inne blokujemy (`192.168.0.3`):
![wf.msc-test-pingów-ICMPv4-z-filtrem-zakresu](/public/courses/windows-11/Images/wf.msc-test-pingów-ICMPv4-z-filtrem-zakresu.png)

---

## 🐍 Filtr dostępu do serwera python

Kontynuując prace na tych trzech maszynach zainstalujemy pytchona na `VM_3` (`192.168.0.3`) i skonfigurujemy regułę zezwalającą na ruch tylko z `VM_2` (`192.168.0.2`).

1. Przełącz sieć w maszynie `VM_3` na `NAT` by dać jej dostęp do internetu. Jeżeli twoja sieć domowa to `192.168.0.X` to nie musisz zmieniać konfiguracji interfejsu na DHCP.
2. Uruchom aplikację Terminal i przełącz się na power shell poleceniem <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> lub myszką klikając na `⋁` w górnej sekcji przy karcie i wybierz **PowerShell**

3. Zainstaluj pythona wpisując polecenie `winget install -e --id Python.Python.3.13`

![instalacja-python.3.13-przez-winget](/public/courses/windows-11/Images/instalacja-python.3.13-przez-winget.png)

4. Uruchom pythona wpisując polecenie `python -m http.server 8000`

![uruchomiony-serwer-python-na-port-8000](/public/courses/windows-11/Images/uruchomiony‑serwer-python‑na-port‑8000.png)

5. Chcąc wykonać test połączenia na konkretnym porcie standardowy `ping [IP_ADDRESS]:[PORT]` nie zadziała bo filtr ICMP jest zablokowany.  
Wykonajmy test za pomocą polecenia `Test-NetConnection -ComputerName [IP_ADDRESS] -Port [PORT]`:

```powershell
Test-NetConnection -ComputerName 192.168.0.3 -Port 8000
```

Jak widać wcześniejsze zezwolenie na dostęp do Pythona w profilach sieciowych publiczny i prywatny pozwoliło na pełną komunikację z serwerem developerskim *`http`* pythona.
![ping-vs-test-net-connection-python](/public/courses/windows-11/Images/ping-vs-test-net-connection-python.png)

6. Naszym celem jest ograniczenie dostępu do portu `8000` tylko dla maszyny `VM_2` (`192.168.0.2`). Wiec w zaporze musisz odnaleźć te dwie reguły (`TCP` i `UDP`) i usunąć. Dodamy własną. Klknij **Regułach przychodzących** i w **Akcje* na <kbd class="win-menu-btn">Nowa reguła...</kbd>. Następnie w nowym oknie wybierz port.
![wf.msc-nowa-reguła-1](/public/courses/windows-11/Images/wf.msc-nowa-reguła-1.png)

7. W kreatorze:
  -  Określ port TCP jako `8000`
  - Zezwól na połączenie
  - Możesz pozostawić zaznaczone wszystkie profile
  - wpisz nazwę reguły np. `Python-http-dev-server` i kliknij <kbd class="win-menu-btn">Zakończ</kbd>
![wf.msc-nowa-reguła-2](/public/courses/windows-11/Images/wf.msc-nowa-reguła-2.png)

8. Ponawiasz trik z zakresem który był wcześniej ograniczając białą-listę do `192.168.0.2`.

9. Ponawiając test z maszyn `VM_1` (`192.168.0.1`) i `VM_2` (`192.168.0.2`) do portu `8000` zobaczysz że uzyskaliśmy nasz cel i tylko `VM_2` ma dostęp do portu do serwera http pythona na `VM_3`.
![test-dwóch-maszyn-po-konfiguracji-wf](/public/courses/windows-11/Images/uruchomiony‑serwer-python‑na-port‑8000-test-dwóch-maszyn.png)

---

## 🕵️ Finał: Scenariusze Helpdesku i konfiguracja zapory

Zarządzanie bezpieczeństwem sieciowym w Windows 11 wymaga sprawnego łączenia wiedzy teoretycznej (profile NLA, algorytmy filtrowania) z praktycznymi narzędziami diagnostycznymi i konfiguracyjnymi.

<data-gate>
  <data-connection-matcher title="Diagnostyka i reguły zapory">
    <div class="cmw-item" data-left="Chcesz zmienić profil sieci na Prywatny, ale polecenie Set-NetConnectionProfile w PowerShell zwraca PermissionDenied." data-right="Uruchom konsolę PowerShell z podwyższonymi uprawnieniami (jako Administrator) – konfiguracja profilu sieci wymaga uprawnień administracyjnych."></div>
    <div class="cmw-item" data-left="Po restarcie routera sieć domowa jest oznaczana jako nowa i otrzymuje domyślnie profil Publiczny." data-right="Router lub karta sieciowa używa zmiennego/losowego MAC adresu bramy, co zmienia sygnaturę sieci generowaną przez usługę NLA."></div>
    <div class="cmw-item" data-left="Musisz zezwolić na pingowanie stacji roboczej, ale wyłącznie z jednego wybranego adresu IP w podsieci." data-right="We właściwościach reguły udostępniania plików (żądanie echo ICMPv4) przejdź do zakładki Zakres i dodaj adres IP w sekcji Zdalny adres IP."></div>
    <div class="cmw-item" data-left="Aplikacja antywirusowa chce zablokować określony ruch sieciowy w trybie jądra (Kernel Mode)." data-right="Żądanie jest wysyłane z trybu użytkownika do usługi BFE, która weryfikuje uprawnienia i przekazuje instrukcję do silnika jądra WFP."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Architektura zapory (WFP i BFE):** Zapora sieciowa to nie zwykła aplikacja, lecz głęboko zintegrowany mechanizm. Sterownik jądra **WFP** (Ring 0) filtruje pakiety bezpośrednio na interfejsach, a usługa **BFE** w przestrzeni użytkownika zarządza regułami. Wyłączenie lub awaria BFE odcina sieć całkowicie. 🏗️
- **Identyfikacja sieci przez NLA:** Usługa **NLA** rozpoznaje lokalizację sieciową i tworzy sygnaturę na podstawie adresu MAC bramy domyślnej oraz SSID. Na tej podstawie przypisuje profil zapory: *Domena* (gdy wykryto kontroler domeny), *Prywatny* lub *Publiczny*. 🌐
- **Domyślne zachowanie NCSI:** Za weryfikację połączenia z internetem odpowiada **NCSI**, wykonując sondy HTTP i DNS. Dopiero potwierdzenie połączenia przez NCSI wyzwala w NLA ostateczne dopasowanie i wdrożenie profilu sieciowego. 🧠
- **Zarządzanie profilami z PowerShell:** Gdy interfejs graficzny zawodzi, administrator może zarządzać profilami sieci za pomocą poleceń `Get-NetConnectionProfile` i `Set-NetConnectionProfile`. Wymaga to jednak uruchomienia konsoli z uprawnieniami administratora. 🛠️
- **Algorytm ewaluacji reguł:** Kolejność reguł w Windows Defender Firewall nie ma znaczenia. Najpierw sprawdzane jest obejście IPsec, potem twarde reguły **Blokujące** (które zawsze wygrywają), następnie reguły **Zezwalające**, a na końcu domyślne zachowanie profilu (DROP dla ruchu przychodzącego). ⚙️

---

Skoro opanowałeś już działanie zapory sieciowej oraz filtrowanie ruchu, pora przyjrzeć się mechanizmom, które odpowiadają za działanie tych i wielu innych procesów w tle. Przechodzimy do lekcji o usługach systemowych! ⚙️
