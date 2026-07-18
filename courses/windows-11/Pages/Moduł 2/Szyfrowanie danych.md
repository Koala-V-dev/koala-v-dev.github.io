# Szyfrowanie danych w Windows 11

Wyobraź sobie krytyczny scenariusz zgłoszony na Helpdesk: pracownik spieszący się na spotkanie zostawia służbowy laptop w pociągu. Ktoś go odnajduje, demontuje klapę obudowy, wyjmuje szybki nośnik SSD M.2 NVMe, a następnie podłącza go za pomocą zewnętrznego adaptera USB do innego komputera z systemem Linux. 

W tym momencie hasło logowania do systemu Windows oraz kody PIN są **całkowicie bezużyteczne**. Zabezpieczają one jedynie sesję użytkownika w uruchomionym systemie operacyjnym (logowanie logiczne). Z perspektywy napastnika posiadającego fizyczny dostęp do nośnika, wszystkie bazy danych klientów, hasła zapamiętane w przeglądarce, prywatne klucze SSH oraz firmowe dokumenty leżą na dysku w postaci **otwartego, jawnego strumienia bajtów** w strukturze systemu plików NTFS.

Jedyną skuteczną inżynieryjną linią obrony przed tym wektorem ataku (nazywanym *atakiem offline* lub *Cold Boot*) jest _**niskopoziomowe szyfrowanie danych**_. Sprawia ono, że bez uwierzytelnienia sprzętowego lub klucza kryptograficznego, odczyt jakiegokolwiek sektora dysku zwraca wyłącznie losowy szum informacyjny (entropię).

> [!NOTE]
> **Entropia** to miara nieuporządkowania lub losowości w systemie. Im większa entropia, tym trudniej jest odgadnąć lub przewidzieć dane.

> [!CAUTION]
> **NIE WOLNO MIEĆ WŁĄCZONEGO BITLOCKERA GDY INSTALUJESZ STEROWNIKI!!!!**
> Ja po zainstalowaniu sterowników NVIDIA RTX 3060 610.47 z 26 maja przeżyłem piekło: przez 9 dni w sumie 8 *BS***_OD_** i 10 razy recovery z BitLockera. Mało tego – 5 razy pod rząd przy jednym uruchomieniu komputera zapętliło mi to gówno w kółko: *BS***_OD_* ➔ BitLocker recovery ➔ *BS***_OD_* ➔ BitLocker recovery... Myślałem, że oszaleję, dopóki nie wydali wersji 610.62 z 16 czerwca 2026. Od razu musiałem wstrzymać BitLockera i dopiero instalować sterowniki. Kompletny dramat i gigantyczny stres! 😫

---

## 🔐 BitLocker – Szyfrowanie całego woluminu (FVE)

**BitLocker Drive Encryption** to wbudowana w system Windows technologia szyfrowania całego woluminu (ang. *Full Volume Encryption*). W przeciwieństwie do szyfrowania pojedynczych plików, BitLocker działa poniżej warstwy systemu plików, szyfrując sektory dysku w locie (ang. *on-the-fly encryption*).

### 🛠️ Architektura i Hierarchia Kluczy BitLockera
Bezpośrednie szyfrowanie kilku terabajtów danych za pomocą hasła użytkownika byłoby kryptograficznym i wydajnościowym koszmarem. Zmiana hasła przez użytkownika wymagałaby odszyfrowania i ponownego szyfrowania całego nośnika, co trwałoby godzinami i doprowadziło do przedwczesnego zużycia komórek krzemowych NAND Flash (wyczerpania limitu cykli TBW – *Total Bytes Written*).

Aby rozwiązać ten problem, inżynierowie Microsoftu wdrożyli wielowarstwową **hierarchię kluczy**:

![Diagram hierarchii kluczy w usłudze szyfrowania danych w systemie Windows](/public/courses/windows-11/Images/diagram-hierarchia-kluczy-szyfrowanie-windows.drawio.webp)

:::diagram
Diagram przedstawia proces deszyfrowania i hierarchię kluczy w usłudze BitLocker. Pokazuje, jak poszczególne metody autoryzacji (protektory) odszyfrowują główny klucz woluminu (VMK), który następnie odszyfrowuje klucz szyfrowania dysku (FVEK) wykonujący operacje we/wy w locie na sektorach dysku.
:::

**Opis strukturalny diagramu**

1. **Protektory (Metody autoryzacji)** – cztery niezależne komórki na górze: Chip TPM 2.0, Kod PIN przy starcie, Klucz Odzyskiwania 48-cyfr, Hasło Użytkownika.  
2. **Pierwszy etap deszyfracji** – każdy z protektorów posiada powiązanie (strzałka „odszyfrowuje”) z centralnym blokiem Volume Master Key - VMK.  
3. **Drugi etap deszyfracji** – blok Volume Master Key - VMK wskazuje za pomocą strzałki „odszyfrowuje” na blok Full Volume Encryption Key - FVEK.  
4. **Operacje dyskowe** – klucz FVEK jest połączony strzałką „szyfruje/deszyfruje w locie” z fizyczną bazą danych (Zaszyfrowane Sektory na Dysku oznaczone ciemnoniebieskim walcem).

1. **FVEK** (*Full Volume Encryption Key*): Klucz szyfrowania całego woluminu. Jest to klucz symetryczny o długości $128$ lub $256$ bitów. To nim bezpośrednio szyfrowany jest każdy sektor na dysku. **FVEK** jest generowany losowo podczas włączania BitLockera i **_nigdy się nie zmienia_** (_**chyba że BitLocker zostanie całkowicie wyłączony i włączony na nowo**_).
2. **VMK** (*Volume Master Key*): Główny klucz woluminu. Służy wyłącznie do zaszyfrowania i zabezpieczenia klucza **FVEK**. Sam klucz **VMK** jest przechowywany w metadanych woluminu w postaci zaszyfrowanej za pomocą jednego lub kilku **Protektorów**.
3. **Protektory Klucza** (*Key Protectors*): Konkretne metody autoryzacji. Może to być moduł sprzętowy **TPM**, kod **TPM+PIN**, klucz USB, hasło lub **48-cyfrowy Klucz Odzyskiwania** (*Recovery Key*). 
   - _**Jak to działa w praktyce?**_ Każdy dodany protektor szyfruje niezależnie tę samą kopię klucza **VMK**. Gdy zmieniasz hasło lub PIN, system nie dotyka plików ani **FVEK** – odszyfrowuje klucz **VMK** starym hasłem, szyfruje go nowym i zapisuje w metadanych. Trwa to ułamek sekundy i oszczędza dysk!

### 📊 Algorytm XTS-AES: Kryptograficzne serce BitLockera
W nowoczesnych wersjach systemu Windows 11 domyślnym algorytmem szyfrowania BitLockera jest **XTS-AES** (zastępując starszy tryb AES-CBC).

Standardowy tryb szyfrowania blokowego AES-CBC (Cipher Block Chaining) wymagał stosowania tzw. dyfuzora (Elephant Diffuser), ponieważ bez niego był podatny na ataki manipulacji bitami na poziomie sektorów (ang. *bit-flipping attacks*). Jeśli napastnik znał strukturę sektora NTFS, mógł zmienić konkretne bajty w szyfrogramie, co po zdeszyfrowaniu przez system dawało przewidywalną zmianę (np. modyfikację uprawnień w pliku systemowym), mimo braku znajomości klucza!

**XTS-AES (zdefiniowany w standardzie IEEE 1619)** eliminuje tę podatność:
- Wykorzystuje **dwa niezależne klucze AES** (stąd oznaczenie klucza $256$-bitowego jako $2 \times 128$ bitów lub $512$-bitowego jako $2 \times 256$ bitów).
- Wprowadza tzw. **wątek adresowy (tweak)**, czyli matematyczne powiązanie szyfrogramu z adresem logicznym sektora (LBA) na dysku.
- Dzięki temu te same dane (np. ciąg samych zer) zapisane w sektorze $100$ i sektorze $500$ po zaszyfrowaniu będą wyglądać **całkowicie inaczej**. Uniemożliwia to napastnikowi manipulację pojedynczymi blokami oraz kopiowanie zaszyfrowanych sektorów między różnymi miejscami na dysku.

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="FVEK (Full Volume Encryption Key)" data-right="Klucz symetryczny bezpośrednio szyfrujący każdy fizyczny sektor na dysku w locie."></div>
    <div class="cmw-item" data-left="VMK (Volume Master Key)" data-right="Klucz pośredni szyfrujący FVEK, zapisywany w postaci zaszyfrowanej w metadanych woluminu."></div>
    <div class="cmw-item" data-left="Protektory klucza (Key Protectors)" data-right="Metody autoryzacji (np. TPM, PIN, hasło) szyfrujące niezależną kopię klucza głównego."></div>
    <div class="cmw-item" data-left="Wątek adresowy (Tweak w XTS-AES)" data-right="Matematyczne powiązanie szyfru z adresem LBA sektora, różnicujące ten sam ciąg danych."></div>
  </data-connection-matcher>
</data-gate>

---

## 🏛️ Integracja Sprzętowa: Jak TPM i Secure Boot chronią klucze

Największą zaletą BitLockera jest jego bezobsługowość dla użytkownika końcowego. Dzieje się tak dzięki ścisłej integracji z dwoma sprzętowymi filarami bezpieczeństwa płyty głównej: **Secure Boot** oraz układem **TPM**.

![Sekwencja operacji BitLockera podczas rozruchu systemu](/public/courses/windows-11/Images/Działanie-Secure-boot-TPM-2.0.webp)

:::diagram
Diagram sekwencyjny przedstawia proces weryfikacji integralności platformy przez Secure Boot i moduł TPM 2.0 przy rozruchu komputera. Pokazuje dwa alternatywne scenariusze: pomyślne załadowanie jądra systemu (niebieski obszar) oraz blokadę rozruchu skutkującą wyświetleniem ekranu BitLocker Recovery (pomarańczowy obszar).
:::

**Opis strukturalny diagramu**

1. **Uruchomienie** – użytkownik włącza zasilanie PC, co aktywuje UEFI, które weryfikuje podpis cyfrowy Windows Boot Managera w bazie db oraz przedłuża rejestry PCR 0, 2, 4, 7 w chipie TPM.  
2. **Scenariusz sukcesu (niebieska ramka)** – pomiary PCR zgadzają się ze stanem Seal w TPM. Windows Boot Manager wysyła żądanie "Unseal", TPM uwalnia klucz VMK do pamięci RAM, a Boot Manager odszyfrowuje klucz FVEK, ładuje jądro i wyświetla ekran logowania Windows 11.  
3. **Scenariusz blokady (pomarańczowa ramka)** – w przypadku braku Secure Boot, zmiany konfiguracji lub obcego bootloadera, pomiary PCR różnią się od stanu Seal. TPM odrzuca żądanie "Unseal" (Odmowa), a Windows Boot Manager wyświetla ekran BitLocker Recovery, żądając 48-cyfrowego klucza od użytkownika.

### 1. Secure Boot – Łańcuch Zaufania
**Secure Boot** to funkcja oprogramowania układowego UEFI, która gwarantuje, że komputer uruchamia wyłącznie zaufane oprogramowanie podpisane cyfrowo przez producenta sprzętu lub Microsoft. Architektura ta opiera się na bazie kluczy kryptograficznych zapisanych w nieulotnej pamięci płyty głównej:
- **PK** (*Platform Key*): Klucz platformy instalowany przez producenta płyty głównej. Ustanawia relację zaufania między właścicielem platformy a firmware.
- **KEK** (*Key Exchange Key*): Klucz wymiany klucza. Służy do weryfikacji podpisów podczas aktualizacji baz danych podpisów rozruchowych.
- **db** (*Authorized Signature Database*): Baza podpisów oprogramowania rozruchowego, które ma pozwolenie na uruchomienie (m.in. certyfikaty Microsoftu dla systemów operacyjnych).
- **dbx** (*Forbidden Signature Database*): Czarna lista certyfikatów i sum kontrolnych bootloaderów, które zostały uznane za zainfekowane lub posiadają znane podatności (np. podatność **_GRUB BootHole_**).

Jeśli spróbujesz załadować niepodpisany system operacyjny lub zmodyfikowany plik rozruchowy, Secure Boot natychmiast przerwie start komputera, chroniąc przed infekcjami typu bootkit. Tak jak to było podczas pierwszej instalacji Windowsa 11 za pomocą Ventoy w maszynie wirtualnej (Oracle VirtualBox).

![Błąd naruszenia Secure Boot w maszynie wirtualnej Hyper-V](/public/courses/windows-11/Images/Verification-failed-(0x1A)-Security-Violation.png)

### 2. TPM 2.0 – Platformowe Rejestry Konfiguracyjne (PCR)
**TPM** (*Trusted Platform Module*) to dedykowany, fizyczny (lub wirtualny w procesorze – fTPM) mikrokontroler kryptograficzny. Jego kluczową rolą w BitLockerze jest **przechowywanie i zabezpieczanie klucza VMK**.

TPM nie wydaje klucza VMK „na ładne oczy”. Wydaje go tylko wtedy, gdy stan komputera jest identyczny z bezpiecznym stanem wzorcowym z momentu włączenia szyfrowania. Stan ten mierzony jest za pomocą **Rejestrów PCR (Platform Configuration Registers)**:
- Rejestry PCR to małe komórki pamięci wewnątrz chipu TPM o rozmiarze odpowiadającym wybranej funkcji skrótu (np. $32\text{ bajty}$ dla `SHA-256`).
- **Złota zasada PCR:** Wartości do rejestrów PCR nie mogą być bezpośrednio zapisywane/nadpisywane przez oprogramowanie. Jedyną operacją modyfikacji jest **przedłużenie rejestru** (ang. *PCR Extend*):
  
  **$$\text{PCR}_{\text{nowy}}$$** $$=$$ **$$ \text{HASH}$$** _**$$(\text{PCR}_{\text{stary}}$$**_ $$\bf{||}$$ *$$\text{Nowy Pomiar})$$*
  
  Oznacza to, że każdy załadowany sterownik, wersja BIOS-u czy konfiguracja opcji rozruchowych jest hashowana i „doklejana” do rejestru. Jeśli napastnik zmieni kolejność ładowania sterowników lub podmieni plik rozruchowy – końcowa wartość rejestru PCR będzie zupełnie inna!

### 🔬 Znaczenie konkretnych rejestrów PCR dla BitLockera:
Windows 11 konfiguruje domyślnie BitLockera tak, aby klucz VMK był **zapieczętowany** (ang. *Sealed*) pod zestaw rejestrów PCR. Jeśli chociaż jeden z nich zmieni wartość, TPM zablokuje klucz.

| Indeks PCR | Co mierzy i weryfikuje? | Co wywoła zablokowanie klucza w TPM? |
| :---: | :--- | :--- |
| **PCR 0** | Kod i metadane firmware płyty głównej (BIOS/UEFI). | Aktualizacja BIOS-u płyty głównej do nowszej wersji. |
| **PCR 2** | Opcjonalne ROM-y urządzeń (Option ROMs, np. firmware karty graficznej czy karty sieciowej). | Wymiana dedykowanej karty graficznej lub instalacja kontrolera RAID. |
| **PCR 4** | Kod i konfiguracja _**Windows Boot Managera**_ (`bootmgfw.efi`) oraz baza konfiguracji rozruchu (**BCD**). | Modyfikacja opcji rozruchu (np. włączenie trybu debugowania, zmiana ścieżki jądra w BCD). |
| **PCR 7** | Status _**Secure Boot**_ oraz bazy certyfikatów bezpieczeństwa (**db**, **dbx**). | Ręczne wyłączenie _**Secure Boot**_ w UEFI lub instalacja niepodpisanego sterownika rozruchowego. |

---

<data-gate>
  <data-quiz>
    <question>Technik IT weryfikuje status szyfrowania serwera za pomocą polecenia `manage-bde -status`. Zauważa, że jako protektor woluminu systemowego wymieniony jest wyłącznie moduł TPM, a Secure Boot został wyłączony w UEFI w celu instalacji testowego hypervisora. Co stanie się podczas najbliższego restartu systemu?</question>
    <options>
      <option>System uruchomi się bez przeszkód, ponieważ wyłączenie Secure Boot nie zmienia pomiaru rejestru PCR 0.</option>
      <option correct>TPM odmówi wydania klucza VMK, ponieważ wyłączenie Secure Boot zmieniło sumę kontrolną rejestru PCR 7.</option>
      <option>BitLocker automatycznie zawiesi ochronę dla PCR 4, by uniknąć monitu o klucz odzyskiwania na serwerze.</option>
      <option>Rozruch zostanie przekierowany do konsoli odzyskiwania z powodu zmiany certyfikatów w rejestrze PCR 2.</option>
    </options>
    <div data-hint="error">
      Zastanów się, czy wyłączenie Secure Boot wpływa na pomiar integralności platformy przekazywany do TPM. Jaki status lub moduł ulega weryfikacji przy starcie UEFI i jak reaguje TPM na brak spójności?
    </div>
    <div data-hint="success">
      Genialnie! Zmiana stanu Secure Boot zmienia wartość rejestru PCR 7, pod który zapieczętowany (sealed) jest klucz VMK. W efekcie TPM przy starcie stwierdza naruszenie integralności platformy i blokuje dostęp. Konieczne będzie ręczne wpisanie klucza odzyskiwania lub włączenie Secure Boot z powrotem.
    </div>
  </data-quiz>
</data-gate>

---

## 🛡️ Klucz Odzyskiwania (Recovery Key) – Ostatnia deska ratunku

Gdy TPM zablokuje klucz VMK (ponieważ wykrył zmianę w rejestrach PCR – np. po aktualizacji BIOS-u lub przełożeniu dysku fizycznego do innego komputera), system przy starcie zaprezentuje charakterystyczny, niebieski ekran żądający **48-cyfrowego Klucza Odzyskiwania (Recovery Key)**.

![Niebieski ekran odzyskiwania funkcji BitLocker w systemie Windows](/public/courses/windows-11/Images/Bitlocker_Recovery.webp)

Należy wtedy wpisać odpowiedni klucz odzyskiwania, który BitLocker wygenerował podczas inicjalizacji.

```yaml
Klucz odzyskiwania do szyfrowania dysków funkcją BitLocker 

Aby sprawdzić, czy jest to poprawny klucz odzyskiwania, porównaj początek następującego identyfikatora z wartością identyfikatora wyświetlaną na ekranie komputera.

Identyfikator:

	839B3329-E1DC-4694-9000-55ADD88577D9

Jeśli powyższy identyfikator jest zgodny z wartością wyświetlaną na ekranie komputera, odblokuj dysk za pomocą poniższego klucza.

Klucz odzyskiwania:

	539007-462134-282137-107693-542420-057242-851337-634666

Jeśli powyższy identyfikator nie jest zgodny z wyświetlanym na komputerze, oznacza to, że nie jest to odpowiedni klucz do odblokowania dysku.
Spróbuj użyć innego klucza odzyskiwania albo przejdź do strony https://go.microsoft.com/fwlink/?LinkID=260589, aby uzyskać dodatkową pomoc.
```

> [!CAUTION]
> **Bez klucza odzyskiwania dane są trwale i bezpowrotnie utracone.** 
> Szyfrowanie XTS-AES-256 jest odporne na łamanie metodą brute-force. Microsoft nie posiada tylnych drzwi ani centralnej bazy danych z kluczami użytkowników prywatnych. Brak klucza = brak dostępu do danych. 😶‍🌫️

### 💾 Gdzie Windows 11 przechowuje Klucze Odzyskiwania?

Zależnie od edycji systemu i typu konta, klucz odzyskiwania może być zdeponowany w różnych miejscach:

<data-tabs>
  <tabs>
    <item>Konto Microsoft (MSA)</item>
    <item>Active Directory (Lokalne)</item>
    <item>Microsoft Entra ID / Intune</item>
    <item>Zapis ręczny</item>
  </tabs>
  <div>

### Klucz na prywatnym koncie Microsoft (MSA)
W edycji **Windows 11 Home** (oraz Pro w konfiguracji konsumenckiej), klucz odzyskiwania jest automatycznie przesyłany do chmury Microsoftu podczas logowania się na konto Microsoft podczas pierwszej konfiguracji komputera (OOBE).

Użytkownik może go odnaleźć logując się z dowolnego urządzenia na stronie:  
🔗 **[account.microsoft.com/devices/recoverykey](https://account.microsoft.com/devices/recoverykey)**

> [!WARNING]
> **Pułapka usuniętego konta MSA:**  
> Klient kupił nowy komputer, zalogował się kontem Microsoft, system w tle zaszyfrował dysk systemowy. Po kilku miesiącach klient postanowił przejść na konto lokalne i usunął konto Microsoft z chmury. Podczas najbliższej aktualizacji BIOS-u system zażądał klucza odzyskiwania. Ponieważ konto MSA zostało skasowane – klucz zniknął z serwerów MS. Dane na dysku są nie do odzyskania. **Zawsze upewnij się, że posiadasz fizyczny wydruk klucza przed usunięciem konta!**

  </div>
  <div>

### Klucz w lokalnej domenie Active Directory (AD DS)
W infrastrukturze lokalnej przedsiębiorstwa (Active Directory), zasady grupy (GPO) mogą wymusić, aby komputer **nie mógł włączyć BitLockera**, dopóki pomyślnie nie prześle i nie zapisze klucza odzyskiwania jako atrybutu swojego obiektu komputerowego w bazie danych AD.

Technik IT może go odczytać za pomocą narzędzia:
- **Active Directory Users and Computers (ADUC)** $\rightarrow$ właściwości danego komputera $\rightarrow$ zakładka: <kbd class="win-menu-btn">BitLocker Recovery</kbd>.

  </div>
  <div>

### Klucz w chmurze Microsoft Entra ID (dawniej Azure AD) & Intune
Dla urządzeń mobilnych i firmowych (zarządzanych w modelu Cloud-Only lub hybrydowym), klucz odzyskiwania jest bezpiecznie eskortowany do chmury Entra ID za pośrednictwem agenta MDM (Microsoft Intune).

- **Z perspektywy Administratora:** Klucz jest widoczny w portalu administracyjnym Intune / Microsoft Endpoint Manager pod profilem sprzętowym urządzenia.
- **Z perspektywy Użytkownika:** Użytkownik firmowy może zalogować się swoimi danymi służbowymi na portalu Moje Konto Microsoft i samodzielnie odczytać klucz.

  </div>
  <div>

### Ręczny zapis i kopia fizyczna
Podczas ręcznej konfiguracji BitLockera w edycji Pro/Enterprise, kreator oferuje trzy alternatywne formy zabezpieczenia klucza:
1. **Zapis na dysku flash (pendrive):** Tworzony jest plik tekstowy o nazwie zawierającej ID klucza (np. `BitLocker Recovery Key F8E9D2C4-....TXT`). Jego treść masz przedstawioną powyżej, w ramce.
2. **Zapis do pliku tekstowego na innym woluminie:** (Windows zabrania zapisu pliku na szyfrowanym dysku systemowym).
3. **Wydruk fizyczny:** Generowany jest sformatowany dokument papierowy z kodem kreskowym i pełnym ciągiem cyfr – idealny do zdeponowania w bezpiecznym firmowym sejfie.

  </div>
</data-tabs>

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Konto Microsoft (MSA)" data-right="Klucz trafia do chmury automatycznie; zniknie z serwerów, jeśli usuniesz konto MSA."></div>
    <div class="cmw-item" data-left="Active Directory (AD)" data-right="Klucz jest zapisywany jako atrybut obiektu komputera w lokalnej bazie domeny firmowej."></div>
    <div class="cmw-item" data-left="Microsoft Entra ID" data-right="Klucz jest eskortowany do chmury przez agenta MDM i widoczny w portalu admina Intune."></div>
    <div class="cmw-item" data-left="Kopia fizyczna (Sejf)" data-right="Klucz jest drukowany na papierze w celu zdeponowania go w bezpiecznej szafie pancernej."></div>
  </data-connection-matcher>
</data-gate>

---

## 🔌 Windows 11 Home vs Pro – Konfrontacja standardów szyfrowania

Wielu techników popełnia błąd, twierdząc, że edycja Windows 11 Home nie posiada w ogóle funkcji szyfrowania, _**bo nie ma Bitlockera**_. To nie prawda! Różnica polega na interfejsie zarządzania oraz poziomie kontroli:

| Cecha / Funkcja | Windows 11 Home (Szyfrowanie urządzenia) | Windows 11 Pro / Enterprise (BitLocker) |
| :--- | :---: | :---: |
| **Domyślna dostępność** | ✅ Tak (wymaga TPM 2.0 i Secure Boot) | ✅ Tak |
| **Sposób aktywacji** | ⚡ Wyłącznie automatyczna (po zalogowaniu MSA) | 🛠️ Ręczna przez GUI, CLI, GPO lub Intune |
| **Szyfrowanie dysków niesystemowych** | ❌ Nie (szyfruje tylko wolumin `C:`) | ✅ Tak (dowolne dyski wewnętrzne SATA/NVMe) |
| **BitLocker To Go (Pendrive / USB)** | ❌ Nie (może tylko odczytywać zablokowane nośniki) | ✅ Tak (pełne szyfrowanie i zarządzanie) |
| **Wymóg uwierzytelnienia przedstartowego** | ❌ Nie (wyłącznie automatyczne odszyfrowanie przez TPM) | ✅ Tak (opcjonalny wymóg podania **kodu PIN** przy starcie) |
| **Zarządzanie kluczami i algorytmami** | ❌ Brak interfejsu (brak `manage-bde`, brak w Panelu sterowania) | ✅ Pełne (konsola `manage-bde`, Panel Sterowania, GPO) |
| **Wymóg modern standby / HSTI** | ✅ Tak (wymaga zaliczenia sprzętowych testów bezpieczeństwa) | ❌ Nie (BitLocker można włączyć na każdym sprzęcie z TPM) |

<data-gate>
  <data-quiz>
    <question>Technik wdrożył stację roboczą z systemem Windows 11 Home w małym biurze. Klient chce zabezpieczyć dane na dysku systemowym oraz na zewnętrznym dysku USB, a także wymusić podawanie kodu PIN przy każdym rozruchu komputera. Jakie ograniczenie napotka technik?</question>
    <options>
      <option>Dysk systemowy nie może zostać zaszyfrowany, ponieważ podstawowa edycja Home nie obsługuje żadnej formy ochrony.</option>
      <option correct>System odmówi konfiguracji kodu PIN przed startem oraz włączenia pełnego szyfrowania dla zewnętrznego dysku USB.</option>
      <option>Wymagane będzie podłączenie komputera do domeny Active Directory, aby odblokować funkcję szyfrowania dysków USB.</option>
      <option>Szyfrowanie woluminów w edycji Home działa wyłącznie wtedy, gdy płyta główna nie posiada sprzętowego modułu TPM.</option>
    </options>
    <div data-hint="error">
      Przeanalizuj uważnie tabelę porównawczą Home vs Pro. Zwróć uwagę na dostępność funkcji BitLocker To Go oraz opcję uwierzytelnienia przedstartowego (PIN) w edycji Home.
    </div>
    <div data-hint="success">
      Świetnie! Szyfrowanie urządzenia w Windows 11 Home chroni wyłącznie dysk C:, nie pozwala na konfigurację PIN-u przy starcie ani na szyfrowanie dysków zewnętrznych (BitLocker To Go). Do tych celów wymagana jest edycja Pro lub Enterprise.
    </div>
  </data-quiz>
</data-gate>

---

## 🔑 BitLocker To Go – Szyfrowanie nośników wymiennych

**BitLocker To Go** to rozszerzenie technologii BitLocker dedykowane dla wymiennych dysków pamięci masowej (pendrive'y, zewnętrzne dyski SSD/HDD, karty pamięci SD). Pozwala na zabezpieczenie nośników, które najłatwiej zgubić lub skraść.

### ⚙️ Procedura wdrożeniowa technika IT:
1. Podłącz nośnik USB do komputera z Windows 11 Pro.
2. Otwórz Eksplorator plików $\rightarrow$ kliknij PPM na nośnik $\rightarrow$ wybierz **Włącz funkcję BitLocker**.
3. **Wybór metody odblokowywania:** Zaznacz opcję **Użyj hasła do odblokowywania dysku** i wprowadź silne hasło zgodne z polityką bezpieczeństwa firmy.
4. **Zapisz klucz odzyskiwania:** Zapisz go do pliku w bezpiecznym katalogu sieciowym IT lub wydrukuj.
5. **Wybór obszaru do zaszyfrowania:**
   - *Szyfruj tylko zajęte miejsce na dysku:* Idealne dla nowych, czystych pendrive'ów (szybkie).
   - *Szyfruj cały dysk:* Bezwzględnie wymagane dla starych, używanych nośników (szyfruje również wolne sektory, w których mogą zalegać skasowane pliki możliwe do odzyskania).
6. **Wybór trybu szyfrowania – KROK KRYTYCZNY:**
   - *Nowy tryb szyfrowania (XTS-AES):* Najlepszy dla dysków, które będą używane wyłącznie na nowoczesnych komputerach z Windows 10/11.
    - *Tryb zgodności (AES-CBC):* **Zalecany dla pendrive'ów**, które technik przenosi między różnymi urządzeniami. Umożliwia odczyt i zapis danych również pod starszymi systemami operacyjnymi (np. Windows 7/8/8.1 czy Windows Server 2012).

<data-gate>
  <data-quiz>
    <question>Przygotowujesz przenośny pendrive USB z szyfrowaniem BitLocker To Go dla pracownika, który będzie z niego korzystał zarówno na nowoczesnym laptopie z Windows 11, jak i na starszej maszynie diagnostycznej z Windows 7. Który tryb szyfrowania wybierasz?</question>
    <options>
      <option>Nowy tryb szyfrowania (XTS-AES), aby zapewnić najwyższy poziom bezpieczeństwa i ochronę przed manipulacją blokami.</option>
      <option correct>Tryb zgodności (AES-CBC), ponieważ starsze systemy operacyjne nie obsługują algorytmu XTS-AES i nie odczytają nośnika.</option>
      <option>Dowolny tryb szyfrowania, ponieważ Windows 7 automatycznie pobierze brakujące sterowniki XTS-AES z usługi Windows Update.</option>
      <option>Szyfrowanie urządzenia (standard Home), gdyż automatycznie dopasowuje algorytm w zależności od wykrytego systemu.</option>
    </options>
    <div data-hint="error">
      Zastanów się, od której wersji systemu Windows wprowadzono nowoczesny tryb XTS-AES i czy starsze platformy, takie jak Windows 7, potrafią zinterpretować ten algorytm bez natywnego wsparcia w kernelu.
    </div>
    <div data-hint="success">
      Doskonale! Nowy tryb XTS-AES został wprowadzony dopiero w Windows 10 (wersja 1511). Starsze systemy, jak Windows 7 czy starsze wersje Windows Server, nie rozumieją tego standardu. Wybór trybu zgodności (AES-CBC) jest kluczowy, by nośnik był czytelny na starszych maszynach.
    </div>
  </data-quiz>
</data-gate>

---

## 📁 EFS (Encrypting File System) – Szyfrowanie na poziomie plików

**Encrypting File System (EFS)** to technologia szyfrowania wbudowana bezpośrednio w system plików **NTFS**.  
W przeciwieństwie do BitLockera, który operuje na fizycznych sektorach dysku, EFS działa na poziomie logicznych struktur plików i folderów.

![Diagram hierarchii kluczy w usłudze szyfrowania danych w systemie Windows](/public/courses/windows-11/Images/diagram-procedury-szyfrowania-plików.webp)

:::diagram
Diagram przedstawia proces transparentnego odszyfrowywania danych za pomocą systemu plików EFS (Encrypting File System) podczas logowania użytkownika. Pokazuje sekwencyjny łańcuch zależności od hasła logowania, przez mechanizm DPAPI i klucze asymetryczne RSA, aż do klucza symetrycznego FEK deszyfrującego plik na partycji NTFS.
:::

**Opis strukturalny diagramu**

1. **Krok 1 (Logowanie)** – Użytkownik loguje się hasłem, co inicjuje proces autoryzacji w silniku DPAPI.  
2. **Krok 2 (Odszyfrowanie klucza RSA)** – silnik DPAPI odszyfrowuje Klucz Prywatny RSA Użytkownika przechowywany w jego profilu.  
3. **Krok 3 (Odszyfrowanie FEK)** – odszyfrowany Klucz Prywatny RSA Użytkownika deszyfruje klucz symetryczny FEK (File Encryption Key).  
4. **Krok 4 (Dostęp do pliku)** – klucz FEK odszyfrowuje i udostępnia Fizyczny Plik zapisany na Partycji NTFS.

### 🔬 Jak działa EFS pod maską? (DPAPI & FEK)

Gdy oznaczysz folder lub plik jako zaszyfrowany (PPM $\rightarrow$ <kbd class="win-menu-btn">Właściwości</kbd> $\rightarrow$ <kbd class="win-menu-btn">Zaawansowane</kbd> $\rightarrow$ zaznaczenie <kbd class="check-mark"></kbd>*Szyfruj zawartość, aby zabezpieczyć dane*):
1. System operacyjny Windows generuje losowy, symetryczny **Klucz Szyfrowania Pliku (FEK – File Encryption Key)** o długości 256 bitów (AES), którym fizycznie szyfruje zawartość pliku.
![EFS - instrukcja włączenia na katalogu](/public/courses/windows-11/Images/EFS-instrukcja-włączenia-na-katalogu.webp)

2. Klucz FEK jest następnie szyfrowany asymetrycznie za pomocą **klucza publicznego RSA** zalogowanego użytkownika. Tak zaszyfrowany klucz FEK jest zapisywany w specjalnym atrybucie pliku NTFS (**`$EFS`**).

3. Powiązany z nim **klucz prywatny RSA** użytkownika jest przechowywany w jego profilu systemowym (`%APPDATA%\Microsoft\SystemCertificates\My\Certificates`) i jest chroniony przez niskopoziomową usługę **DPAPI (Data Protection API)**.
![EFS - lokalizacja kluczy prywatnych RSA użytkownika](/public/courses/windows-11/Images/EFS-lokalizacja-kluczy-prywatnych-RSA-uzytkownika.webp)

4. DPAPI generuje klucz główny (Master Key) zabezpieczony bezpośrednio **hasłem logowania użytkownika**.  
Gdy użytkownik loguje się do komputera: jego hasło odblokowuje DPAPI $\rightarrow$ DPAPI odszyfrowuje klucz prywatny RSA $\rightarrow$ klucz prywatny odszyfrowuje FEK z metadanych pliku $\rightarrow$ plik otwiera się transparentnie.

Jeżeli inny użytkownik będzie chciał otworzyć plik, to nie będzie w stanie tego zrobić, ponieważ nie będzie miał dostępu do klucza prywatnego RSA użytkownika.
![EFS - zaszyfrowany plik zapisany w katalogu z przypisanym certyfikatem innego użytkownika](/public/courses/windows-11/Images/EFS-zaszyfrowany-plik-zapisany-w-katalogu-z-przypisanym-certyfikatem.webp)

### ⚠️ Krytyczna pętla katastrofy administratora EFS:
Ponieważ klucz prywatny RSA użytkownika jest zabezpieczony przez DPAPI za pomocą hasła logowania, istnieje gigantyczne zagrożenie utraty danych:
- **Scenariusz:** Użytkownik zapomniał hasła do konta lokalnego. Zgłasza się do administratora IT. Administrator loguje się na konto admina i brutalnie resetuje hasło pracownika komendą `net user pracownik NoweHaslo123` lub w przystawce `lusrmgr.msc`.
- **Konsekwencja:** Podczas resetu hasła „na siłę”, DPAPI traci możliwość zdeszyfrowania klucza głównego (Master Key), ponieważ nie zna starego hasła, które służyło jako sól kryptograficzna. Przy próbie logowania pracownika na nowe hasło, system Windows nie jest w stanie odszyfrować jego klucza prywatnego RSA. _**Wszystkie pliki zaszyfrowane przez EFS stają się permanentnie bezużyteczne i niemożliwe do odczytania, mimo że pracownik zna nowe hasło!**_

### 🛡️ Jak zabezpieczyć EFS przed katastrofą?
1. **Eksport certyfikatu EFS do pliku `.pfx`:** Uruchom `certmgr.msc` $\rightarrow$ przejdź do *Osobiste* $\rightarrow$ *Certyfikaty* $\rightarrow$ znajdź certyfikat z przeznaczeniem *System szyfrowania plików* $\rightarrow$ kliknij PPM $\rightarrow$ *Wszystkie zadania* $\rightarrow$ *Eksportuj*.
![EFS -eksport certyfikatu](/public/courses/windows-11/Images/EFS-eksport-certyfikatu.webp)

2. Windows przeprowadzi Cię przez proces eksportu w kreatorze:
  - Pierwszym pytaniem będzie to, czy chcesz wyeksportować klucz prywatny wraz z certyfikatem. Bezwzględnie zaznacz opcję **Tak, wyeksportuj klucz prywatny** (bez niego backup EFS nie będzie miał żadnej wartości rozszyfrowującej).
  - Następnie w kreatorze wybierz format pliku. Powinien być to **Personal Information Exchange - PKCS#12** (plik z rozszerzeniem `.pfx`) i powinien być zaznaczony checkbox <kbd class="check-mark"></kbd> *Jeśli jest to możliwe, dołącz wszystkie certyfikaty w ścieżce certyfikacji*. 
    > **Dlaczego pozostałe formaty (DER, Base-64, PKCS#7, SST) są wyszarzone?**  
    > Wynika to bezpośrednio z wybranej w poprzednim kroku opcji eksportu klucza prywatnego. Formaty takie jak `.cer` (DER/Base-64), `.p7b` (PKCS#7) czy `.sst` technologicznie **nie posiadają możliwości przechowywania klucza prywatnego** – służą wyłącznie do dystrybucji kluczy publicznych lub całych łańcuchów certyfikatów. Jedynym standardem w tym kreatorze, który pozwala bezpiecznie scalić klucz publiczny z kluczem prywatnym i dodatkowo zabezpieczyć go hasłem, jest właśnie standard **PKCS#12** (PFX).
  - Ustaw silne hasło do pliku `.pfx` (będzie ono wymagane podczas importowania certyfikatu na nowym koncie/komputerze).
  - Wskaż lokalizację docelową zapisu lub poprostu jego nazwę jak ja.
  - Na ostatnim ekranie zobaczysz podsumowanie i lokalizację pliku w `C:\WINDOWS\System32\`.
![Wszystkie 6 okien kreatora eksportu certyfikatu EFS](/public/courses/windows-11/Images/kreator-eksportu-certyfikatu.webp)

Utworzony plik po uruchomieniu pokaże kreator importu certyfikatu:

![Plik certyfikatu EFS w lokalizacji `C:\WINDOWS\System32\`](/public/courses/windows-11/Images/kreator-importu-certyfikatu.webp)

---

## ⚖️ BitLocker vs EFS – Tabela porównawcza

| Cecha / Właściwość | BitLocker Drive Encryption (FVE) | Encrypting File System (EFS) |
| :--- | :--- | :--- |
| **Poziom operacyjny** | Sektorowy (Poniżej warstwy systemu plików). | Plikowy (Poziom systemu plików NTFS). |
| **Jednostka szyfrowania** | Cały wolumin (np. partycja `C:`, dysk `D:`). | Pojedyncze pliki, foldery. |
| **Przechowywanie kluczy** | Moduł sprzętowy **TPM** lub klucz odzyskiwania. | Certyfikaty użytkownika (DPAPI, baza SAM). |
| **Odporność na ataki offline** | **Wysoka** (pełna ochrona przed wyjęciem dysku). | **Niska** (metadane i pliki nieszyfrowane są widoczne). |
| **Transparentność** | Pełna (użytkownik nie wie o szyfrowaniu). | Ręczna (użytkownik musi oznaczyć pliki/foldery). |
| **Wymagany system plików** | Dowolny (szyfrowanie sektorów fizycznych). | Bezwzględnie **NTFS**. |
| **Wydajność** | Znikomy narzut (wsparcie sprzętowe instrukcji AES-NI). | Narzut widoczny przy szyfrowaniu tysięcy małych plików. |
| **Podstawowe zastosowanie** | Ochrona skradzionego sprzętu. | Separacja użytkowników na jednym komputerze. |

<data-gate>
  <data-quiz>
    <question>Dlaczego brutalny i wymuszony reset zapomnianego hasła lokalnego użytkownika (np. za pomocą polecenia `net user` z konta administratora) uniemożliwia mu późniejszy odczyt jego plików zaszyfrowanych wcześniej przez EFS?</question>
    <options>
      <option>Podczas wymuszonego resetu hasła system Windows bezpowrotnie usuwa prywatne certyfikaty użytkownika z profilu.</option>
      <option correct>Usługa DPAPI traci dostęp do Master Key szyfrowanego starym hasłem, blokując odczyt klucza prywatnego EFS.</option>
      <option>Zmieniony skrót hasła w bazie SAM nie pasuje do symetrycznego klucza FEK, który bezpośrednio szyfruje pliki.</option>
      <option>System NTFS trwale blokuje prawa dostępu ACL do zaszyfrowanych katalogów dla nowo utworzonej sesji konta.</option>
    </options>
    <div data-hint="error">
      Zwróć uwagę na architekturę ochrony kluczy w systemie Windows. Klucz prywatny certyfikatu EFS nie leży w profilu w postaci otwartej – chroni go usługa DPAPI. Co DPAPI wykorzystuje jako kluczowe źródło do wygenerowania swojego klucza głównego (Master Key)?
    </div>
    <div data-hint="success">
      Dokładnie tak! DPAPI zabezpiecza Master Key kluczem wyprowadzonym z hasła użytkownika. Gdy zmieniamy hasło bez podania starego (brutalny reset admina), DPAPI nie jest w stanie odszyfrować starego Master Key. Klucz prywatny EFS staje się bezużyteczną stertą bajtów. Dlatego tak ważne jest posiadanie kopii zapasowej certyfikatu (.pfx) lub wdrożonego agenta DRA w domenie!
    </div>
  </data-quiz>
</data-gate>

---

## 💻 Zarządzanie BitLockerem z poziomu CLI (manage-bde)

W pracy administratora lub inżyniera helpdesku, graficzny Panel Sterowania jest zbyt ograniczony. Konsolowe narzędzie **`manage-bde.exe`** pozwala na pełną automatyzację i głęboką diagnostykę szyfrowania z poziomu terminala CMD/PowerShell (uruchomionego jako Administrator):

### 1. Sprawdzenie statusu szyfrowania wszystkich dysków:
```cmd
manage-bde -status
```
*Zwróć uwagę na wartość: "Metoda szyfrowania" (np. XTS-AES 256) oraz "Status ochrony" (Włączona/Wyłączona).*

### 2. Wyświetlenie aktywnych protektorów i odczytanie Klucza Odzyskiwania:
```cmd
manage-bde -protectors -get C:
```
*To polecenie wyciąga z metadanych pełny $48$-cyfrowy klucz odzyskiwania oraz jego identyfikator (ID). Kluczowe, gdy musimy zapisać klucz klienta, który gubi dostęp.*

### 3. Wstrzymanie ochrony BitLocker na czas aktualizacji BIOS/firmware:
```cmd
manage-bde -protectors -disable C: -rebootcount 1
```
*Tymczasowo zawiesza weryfikację rejestrów PCR przez TPM na dokładnie $1$ restart systemu. Zapobiega to zablokowaniu komputera i wyzwoleniu ekranu odzyskiwania po zmianie firmware płyty głównej. Ochrona włączy się automatycznie przy kolejnym uruchomieniu.*

### 4. Ręczne odblokowanie zaszyfrowanego dysku kluczem odzyskiwania:
```cmd
manage-bde -unlock E: -RecoveryPassword 123456-123456-...-123456
```
*Umożliwia technikowi dostęp do woluminu zablokowanego dysku z innego komputera z poziomu wiersza poleceń instalatora Windows (WinPE).*

---

## 🕵️ Scenariusze Helpdesku

Dopasuj awarię zgłoszoną przez użytkownika do poprawnego działania inżynierskiego:

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Pracownik dzwoni: po aktualizacji BIOS-u laptop żąda klucza odzyskiwania BitLocker. Użytkownik nie ma pojęcia co to." data-right="Wejdź na portal Intune lub zaloguj się na konto Microsoft pracownika (MSA), aby pobrać 48-cyfrowy kod."></div>
    <div class="cmw-item" data-left="Administrator planuje zdalną, masową aktualizację BIOS na 100 stacjach roboczych w firmie." data-right="Wdrożyj skrypt wykonujący manage-bde -protectors -disable C: -rebootcount 1 przed instalacją firmware."></div>
    <div class="cmw-item" data-left="Technik IT zresetował hasło lokalnego użytkownika przez 'net user'. Użytkownik nie może otworzyć swoich zielonych plików." data-right="DPAPI straciło klucz Master. Odszyfrowanie wymaga importu kopii zapasowej certyfikatu EFS (.pfx) lub użycia DRA."></div>
    <div class="cmw-item" data-left="Użytkownik Windows 11 Home chce zaszyfrować swój przenośny pendrive USB za pomocą BitLocker To Go." data-right="Edycja Home nie wspiera tworzenia BitLocker To Go. Wykonaj szyfrowanie na stacji roboczej z Windows Pro."></div>
    <div class="cmw-item" data-left="Klient kupił nowy dysk zewnętrzny i chce, aby działał z szyfrowaniem pod Windows 11 oraz starym Windows 7." data-right="Uruchom BitLocker To Go na Windows 11, ale bezwzględnie wybierz tryb szyfrowania zgodności (AES-CBC)."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Istota szyfrowania offline:** Szyfrowanie dysku (np. BitLocker) to jedyna linia obrony przed fizycznym wyjęciem nośnika z urządzenia. Hasła Windows zabezpieczają wyłącznie logiczną sesję w uruchomionym systemie, a nie surowe bloki na dysku. 🔑
- **Hierarchia kluczy dyskowych:** BitLocker nie szyfruje plików bezpośrednio hasłem. Dysk szyfrowany jest kluczem FVEK, ten z kolei chroniony jest przez VMK, a VMK jest zabezpieczony różnymi Protektorami (TPM, PIN, Hasło). Pozwala to na natychmiastową zmianę metod autoryzacji bez ponownego szyfrowania danych. ⛓️
- **Matematyczne zabezpieczenie XTS-AES:** Nowoczesny tryb XTS-AES wprowadza tzw. wątek adresowy (tweak), który wiąże matematycznie szyfrogram z fizycznym adresem sektora (LBA). Uniemożliwia to napastnikowi kopiowanie sektorów oraz ataki typu bit-flipping. 📊
- **Rola TPM i rejestrów PCR:** Układ TPM weryfikuje integralność platformy przy starcie za pomocą rejestrów PCR. Zmiana wersji BIOS (PCR 0), konfiguracji BCD (PCR 4) lub wyłączenie Secure Boot (PCR 7) zablokuje klucz w TPM i wywoła ekran odzyskiwania. 🏛️
- **Windows 11 Home vs Pro:** Edycja Home wspiera uproszczone „Szyfrowanie urządzenia” (automatyczne, tylko dysk C:, wymaga konta MSA, brak kodu PIN i manage-bde). Pełne szyfrowanie wielu dysków, obsługa CLI oraz protektor PIN wymagają edycji Pro/Enterprise. 💻
- **Szyfrowanie nośników wymiennych (BitLocker To Go):** W przypadku pendrive'ów przenoszonych na starsze systemy (np. Windows 7) należy bezwzględnie wybrać tryb zgodności (AES-CBC), ponieważ standard XTS-AES nie jest na nich obsługiwany. 🔌
- **Katastrofa EFS przy brutalnym resecie hasła:** EFS szyfruje pliki kluczem FEK, chronionym certyfikatem RSA. Klucz prywatny certyfikatu zabezpiecza usługa DPAPI, wykorzystująca hasło użytkownika. Wymuszony reset hasła przez administratora odcina DPAPI od soli starego hasła, trwale niszcząc dostęp do danych EFS. 📁
- **Złota zasada aktualizacji BIOS:** Przed masową aktualizacją BIOS-u na komputerach z BitLockerem, zawsze wstrzymaj ochronę za pomocą polecenia `manage-bde -protectors -disable C: -rebootcount 1`, aby uniknąć paraliżu i konieczności ręcznego wpisywania 48-cyfrowych kluczy odzyskiwania. 🧰

---

Gratulacje! 🎉  
Przebrnąłeś przez wstępne konfiguracje stanowiska. Czas na administrację! ⚙️