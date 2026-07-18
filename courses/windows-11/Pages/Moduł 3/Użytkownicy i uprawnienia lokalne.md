# Użytkownicy i uprawnienia lokalne

Na Helpdesku zarządzanie kontami użytkowników to chleb powszedni. *„Nie pamiętam hasła"*, *„Nie mogę zainstalować programu"*, *„Kolega potrzebuje tymczasowy dostęp do mojego komputera"* – każde z tych zgłoszeń sprowadza się do pytania: **kto ma jakie uprawnienia i jak to zmienić?**

---

## 👤 Typy kont w Windows 11

Windows rozróżnia dwa fundamentalne poziomy uprawnień konta lokalnego. Każdy użytkownik na komputerze należy do jednego z nich.

| Cecha | Konto standardowe | Konto administratora |
| :--- | :--- | :--- |
| Instalacja programów | ❌ Wymaga hasła admina (monit UAC) | ✅ Tylko potwierdzenie UAC |
| Zmiana ustawień systemowych | ❌ Zablokowane | ✅ Pełny dostęp |
| Tworzenie/usuwanie kont | ❌ Nie | ✅ Tak |
| Dostęp do własnych plików | ✅ Tak | ✅ Tak + pliki innych użytkowników |
| Zagrożenie bezpieczeństwa | 🟢 Niskie | 🔴 Wysokie (malware działa z pełnymi uprawnieniami) |

> [!IMPORTANT]
> **Złota zasada IT:** Codzienną pracę wykonuj na koncie **standardowym**. Konto administratora używaj **wyłącznie** do zadań administracyjnych. Nawet administratorzy w firmach powinni mieć dwa konta – jedno zwykłe do poczty i przeglądarki, drugie z uprawnieniami do zarządzania. Jeśli złapiesz wirusa na koncie admina – malware ma pełną kontrolę nad systemem.

---

## 🛡️ UAC – Kontrola konta użytkownika

**User Account Control** to mechanizm bezpieczeństwa, który stoi na straży między użytkownikiem a operacjami wymagającymi podwyższonych uprawnień. To ten charakterystyczny ekran z pytaniem *„Czy chcesz zezwolić tej aplikacji na wprowadzenie zmian?"*.

<data-tabs>
  <tabs>
    <item>Jak działa UAC?</item>
    <item>Poziomy UAC</item>
  </tabs>
<div>

### Mechanizm UAC

1. Użytkownik (nawet admin) uruchamia program wymagający uprawnień systemowych.
2. Windows **ciemnieje ekran** i wyświetla monit UAC.
3. **Konto standardowe** → wymaga wpisania hasła administratora.
4. **Konto administratora** → wymaga jedynie kliknięcia <kbd class="win-menu-btn">Tak</kbd>.
5. Dopiero po autoryzacji program dostaje podwyższone uprawnienia.

**Dlaczego to ważne?** Bez UAC każdy program uruchomiony przez admina miałby automatycznie pełne uprawnienia – w tym wirusy, trojany i ransomware. UAC zmusza do świadomej decyzji.

  <data-hotspot image="/courses/windows-11/Images/UAC-admin-vs-user.png">
    <hotspot x="15" y="25" title="">To okno widziane z konta **Administratora**. Wymaga jedynie kliknięcia <kbd class="win-menu-btn">Tak</kbd>.</hotspot>
    <hotspot x="85" y="25" title="">To okno widziane z konta **Standardowego**. Wymaga podania hasła do konta administratora.</hotspot>
    <hotspot x="65" y="47" title="">Uruchomienie aplikacji *Terminal* jako administrator.</hotspot>
  </data-hotspot>


> [!TIP]
> **Ikona tarczy** 🛡️ przy przycisku lub opcji w Windows oznacza, że kliknięcie wywoła monit UAC. To wizualna wskazówka, że operacja wymaga podwyższonych uprawnień.

</div>
<div>

### Poziomy UAC

Konfiguracja: `Panel sterowania` → `Konta użytkowników` → `Zmień ustawienia funkcji Kontrola konta użytkownika`

![Ustawienia UAC](/public/courses/windows-11/Images/UAC-level.png)

| Poziom | Zachowanie | Kiedy stosować |
| :--- | :--- | :--- |
| **Zawsze powiadamiaj** | Monit przy każdej zmianie systemowej i każdej instalacji | Maksymalne bezpieczeństwo (serwery, stacje krytyczne) |
| **Domyślny** | Monit tylko przy zmianach ze strony programów (nie ustawień Windows) | Zalecany – balans bezpieczeństwa i wygody |
| **Powiadamiaj bez ciemnienia** | Tak jak domyślny, ale bez bezpiecznego pulpitu (ekran nie ciemnieje) | Nie zalecany – malware może sfałszować okno UAC |
| **Nigdy nie powiadamiaj** | UAC wyłączony – wszystko działa z pełnymi uprawnieniami | ⛔ Nigdy! Kompletna rezygnacja z ochrony |

> [!CAUTION]
> Na Helpdesku zdarzają się prośby: *„Wyłącz mi te wyskakujące okienka, bo mnie denerwują."* 
> **_Nigdy nie wyłączaj UAC!_** Zamiast tego wyjaśnij, dlaczego monity się pojawiają. UAC to ostatni bastion ochrony przed malware na koncie administratora.

</div>
</data-tabs>

---

## 🧰 Narzędzia zarządzania kontami

Windows oferuje kilka ścieżek do zarządzania użytkownikami lokalnymi – od prostego GUI po komendy CMD oraz potężnego PowerShell'a.

<data-tabs>
    <tabs>
    <item>Ustawienia (GUI)</item>
    <item>lusrmgr.msc (Pro)</item>
    <item>netplwiz</item>
    <item>Terminal CMD</item>
    <item>PowerShell</item>
    </tabs>
    <div>

### Ustawienia → Konta → Inni użytkownicy

Najprostsza ścieżka, dostępna we **wszystkich** edycjach Windows 11.

<kbd class="Win"></kbd> + <kbd>I</kbd> → **Konta** → **Inni użytkownicy** → **Dodaj konto**

  <data-hotspot image="/courses/windows-11/Images/ustawienia-konta-inni-users.png">  
    <hotspot x="84" y="27" title="Dodaj konto">Główny przycisk do uruchamiania kreatora dodawania użytkownika (Microsoft lub lokalnego).
    </hotspot>
    <hotspot x="80" y="48" title="Zmień typ konta">Opcja pojawiająca się po rozwinięciu konta. Pozwala zmienić typ konta (Standardowe ↔ Administrator).
    ![Okno zmiany typu konta](/public/courses/windows-11/Images/ustawienia-konta-zmiana-typu.png)
    </hotspot>
    <hotspot x="80" y="56" title="Usuń">Usuwa konto wraz z katalogiem użytkownika i jego plikami.
    ![Usuń konto](/public/courses/windows-11/Images/ustawienia-konta-usuń-konto.png)
    </hotspot>
  </data-hotspot>

</div>
<div>

### Użytkownicy i grupy lokalne (`lusrmgr.msc`)

**Tylko Windows Pro / Enterprise / Education** – niedostępne w Home!

<kbd class="Win"></kbd> + <kbd>R</kbd> → `lusrmgr.msc`

To **profesjonalny panel** (przystawka systemu Windows) z pełną kontrolą nad kontami i grupami. Dwa „foldery”, chodź poprawniej kontenery:

**Użytkownicy** – lista wszystkich kont lokalnych:
- PPM → **Nowy użytkownik** (tworzenie)
- PPM na konto → **Ustaw hasło** (reset bez znajomości starego hasła!)
- PPM → **Właściwości** → zakładka **Członek grupy** (przypisanie do grup)
- Checkbox <kbd class="check-mark-empty"></kbd>`Konto jest wyłączone` – dezaktywacja bez usuwania

  <data-hotspot image="/courses/windows-11/Images/lusrmgr.msc-users.png">
    <hotspot x="15" y="30" title="Drzewo konsoli">Podział na dwa główne foldery: **Użytkownicy (pojedyncze konta)** i Grupy (zbiory uprawnień).</hotspot>
    <hotspot x="50" y="78" title="Nowy użytkownik">Te opcje konta i hasła użytkownika logicznie się wykluczają.
    </hotspot>
    <hotspot x="82" y="19" title="Nowy użytkownik"> Panel akcji uruchamiający kreatora dodawania użytkownika i mający eksport listy użytkowników (rozdzielone tabulacją <kbd>TAB</kbd>):
    - Nazwa użytkownika(login)
    - Pełna nazwa użytkownika (ta wyświetlana)
    - Opis użytkownika
    </hotspot>
  </data-hotspot>

> [!WARNING]
> Nowy użytkownik domyślnie należy do grupy **Użytkownicy**. Członkostwo w tej grupie jest wymagane by zalogować się do systemu przez GUI.


**Grupy** – to kontenery na zbiory uprawnień, do których można przypisywać użytkowników lub inne grupy dziedziczące po nich uprawnienia.

> [!NOTE]
> **Dziedziczenie**: Sytuacja lub proces pełnego lub częściowego przekazania cech na obiekt dziedziczący z rodzica. 

| Grupa | Uprawnienia |
| :--- | :--- |
| **Administratorzy** | Pełne uprawnienia do systemu |
| **Użytkownicy** | Standardowe uprawnienia |
| **Użytkownicy pulpitu zdalnego** | Dostęp do systemu zdalnie (`RDP`: Remote Desktop Protocol) |
| **Operatorzy kopii zapasowych** | Tworzenie i odtwarzanie backupów |

  <data-hotspot image="/courses/windows-11/Images/lusrmgr.msc-groups.png">
    <hotspot x="15" y="30" title="Drzewo konsoli">Podział na dwa główne foldery: Użytkownicy (pojedyncze konta) i **Grupy (zbiory uprawnień)**.</hotspot>
    <hotspot x="84" y="19" title="Nowa grupa"> Panel akcji uruchamiający kreatora dodawania grupy i mający eksport listy grup (rozdzielone tabulacją <kbd>TAB</kbd>):
    - Nazwa grupy
    - Opis grupy
    </hotspot>
    <hotspot x="61.5" y="84" title="Dodaj"> Tworząc grupę możesz odrazu dodać do niej użytkowników i grupy rozdzielonych średnikiem `;`.  
    Przykładowo wpisz w polu: `a_nowak;Gość;Użytkownicy` 
    Po kliknięciu w <kbd class="win-menu-btn">Sprawdź nazwy</kbd> da to w efekcie:  
    `KLIENT\a_nowak; KLIENT\Gość; KLIENT\Użytkownicy uwierzytelnieni`
    ![](/public/courses/windows-11/Images/lusrmgr.msc-dodawanie-user-to-group.png)
    </hotspot>
  </data-hotspot>


</div>
<div>

### Okno kont użytkowników (`netplwiz`)

Dostępny we **wszystkich** edycjach Windows, nawet Home.

<kbd class="Win"></kbd> + <kbd>R</kbd> → `netplwiz`

Wymaga uprawnień administratora. 
- Jeżeli admin uruchomi **Konta użytkowników** to by zmienić sobie hasło bedzie musiał użyć kombinacji klawiszy <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Del</kbd>. 
- Jeżeli bedziesz chcieć zmienić hasło innemu użytkownikowi po wybraniu go pojawi się stosowny przycisk.

![netplwiz - reset hasła](/public/courses/windows-11/Images/netplwiz-reset-hasła.png)

Po wybraniu użytkownika i kliknięciu <kbd class="win-menu-btn">Właściwości</kbd> oraz przejściu do zakładki `Członkostwo grupy`, uzyskasz następujące możliwości:
- *Użytkownik standardowy*: uprawnienia zwykłego użytkownika. Domyślnie tworzone konta są w tej grupie, co daje uprawnienia do pracy z systemem
- *Administrator*: uprawnienia administratora. Daje pełne prawa do zarządzania systemem, włączając w to tworzenie nowych użytkowników i zmianę ich uprawnień
- *Inny*: lista rozwijana z dostępnymi w systemie grup lokalnych.

![netplwiz - zmiana grupy](/public/courses/windows-11/Images/netplwiz-zmiana-grupy.webp)

Klikając <kbd class="win-menu-btn">Dodaj... </kbd>, ukaże ci się klasyczny kreator tworzenia nowego użytkownika znany z Windows 10

![netplwiz - dodawanie użytkownika](/public/courses/windows-11/Images/netplwiz-nowy-user.png)


Przechodząc do zakładki zaawansowane uzyskasz dostęp do przycisku <kbd class="win-menu-btn">Zarządzaj hasłami</kbd> uruchomi **Menedżera poświadczeń** w panelu sterowania. Chodź może się wydawać dość archaiczny to dalej jest używany przez narzędzia developerskie co widać u mnie:

![netplwiz - zaawansowane - menedżer poświadczeń](/public/courses/windows-11/Images/netplwiz-zaawansowane.png)

PS. Zaznaczyłem Ci też pomarańczową obwódką <kbd class="win-menu-btn">Zaawansowane</kbd>, po kliknięciu uruchomi się przystawka `lusrmgr.msc`. 

## Wyjaśnienie powyższych poświadczeń systemu Windows

#### Poświadczenia systemowe i Microsoft

| Nazwa poświadczenia | Źródło | Opis | Czy usuwać |
|----------------------|--------|------|------------|
| `SSO_POP_Device` | Windows | Klucz urządzenia używany w Single Sign-On. | 🔴 Nie |
| `SSO_POP_User` | Windows | Klucz użytkownika do logowania w usługach Microsoft. | 🔴 Nie |
| `MicrosoftAccount:user=…` | Windows | Główne poświadczenie konta Microsoft. | 🔴 Nie |
| `virtualapp/didlogical` | Windows | Automatyczne poświadczenie usług Live ID. | 🔴 Nie |

#### Poświadczenia Outlook / Office

| Nazwa poświadczenia | Źródło | Opis | Czy usuwać |
|----------------------|--------|------|------------|
| `Olk/PushNotificationsKey` | Outlook | Klucz do obsługi powiadomień push. | 🔴 Nie |

#### Poświadczenia narzędzi programistycznych

| Nazwa poświadczenia | Źródło | Opis | Czy usuwać |
|----------------------|--------|------|------------|
| `git:https://github.com` | Git | Dane logowania do GitHub przez HTTPS. | 🟢 Można |
| `GitHub – https://api.github.com/…` | GitHub Desktop | Token dostępu do GitHub API. | 🟢 Można |
| `gemini:antigravity` | Antigravity | Lokalne poświadczenie aplikacji. | 🟢 Można |

#### Poświadczenia aplikacji sieciowych

| Nazwa poświadczenia | Źródło | Opis | Czy usuwać |
|----------------------|--------|------|------------|
| `duck:ftp:ftpupload.net` | Cyberduck | Dane logowania do FTP. | 🟢 Można |

> [!TIP]
> `netplwiz` to jedyne GUI dostępne w Windows Home, które pozwala przypisać użytkownika do konkretnych grup systemowych. W edycji Home nie masz `lusrmgr.msc`, więc to Twoja alternatywa.
</div>
<div>

### Terminal (wiersz poleceń CMD)

Szybka administracja z wiersza poleceń (zalecam CMD jako Administrator). To klasyczne narzędzie działające w każdym systemie NT.

**Zarządzanie użytkownikami:**
```cmd
net user                                    ← lista wszystkich kont
net user Jan                                ← szczegóły konta "Jan"
net user Technik P@ssw0rd /add              ← utwórz konto z hasłem
net user Technik /delete                    ← usuń konto
net user Technik /active:no                 ← dezaktywuj (bez usuwania)
net user Jan *                              ← reset hasła (system poprosi o nowe)
```

**Zarządzanie grupami:**
```cmd
net localgroup                              ← lista wszystkich grup
net localgroup Administratorzy              ← kto jest adminem?
net localgroup Administratorzy Jan /add     ← dodaj Jana do adminów
net localgroup Administratorzy Jan /delete  ← zabierz Janowi uprawnienia admina
```

> [!NOTE]
> Nazwa grupy zależy od języka systemu! W polskim Windowsie to `Administratorzy`, w angielskim `Administrators`. Błąd w nazwie = `System error 1376`. 😉

<details><summary>Przykład skryptu tworzącego 5 użytkowników o nazwach U1-U5 i haśle $P@ssw0rd</summary>

```cmd
for /L %%i in (1,1,5) do net user Technik%%i P@ssw0rd%%i /add
```
</details>

</div>
<div>

### Zarządzanie z poziomu PowerShell

PowerShell oferuje moduł `LocalAccounts`, będący nowoczesną i potężniejszą alternatywą dla CMD.

**Zarządzanie użytkownikami:**
```powershell
Get-LocalUser                                        # lista wszystkich kont
Get-LocalUser -Name "Jan"                             # szczegóły konta "Jan"
New-LocalUser -Name "Technik" -NoPassword               # utwórz konto bez hasła
Remove-LocalUser -Name "Technik"                        # usuń konto
Disable-LocalUser -Name "Technik"                       # dezaktywuj konto
Enable-LocalUser -Name "Administrator"                  # włącz wbudowanego admina
Set-LocalUser -Name "Jan" -PasswordNeverExpires $true    # ustaw wygasanie hasła
```

**Zarządzanie grupami:**
```powershell
Get-LocalGroup                                            # lista wszystkich grup
Get-LocalGroupMember -Group "Administratorzy"                # kto jest adminem?
Add-LocalGroupMember -Group "Administratorzy" -Member "Jan"    # dodaj Jana do adminów
Remove-LocalGroupMember -Group "Administratorzy" -Member "Jan" # zabierz Janowi uprawnienia
```

> [!TIP]
> W odróżnieniu od CMD (zwracającego zwykły tekst), PowerShell zwraca wyniki w postaci ustrukturyzowanych obiektów. Pozwala to na ich łatwe przekazywanie (`|`) do innych poleceń i pętli, co jest kluczowe w skryptowaniu!

<details><summary>Przykład skryptu tworzącego 5 użytkowników o nazwach U1-U5 i haśle $P@ssw0rd</summary>

```powershell
for ($i=1; $i -le 5; $i++) {
    $username = "U$i"
    $password = ConvertTo-SecureString "$P@ssw0rd" -AsPlainText -Force
    New-LocalUser -Name $username -Password $password -FullName "Użytkownik $i" -Description "Konto testowe $i"
}
```
</details>


</div>
</data-tabs>

---

## 🔐 Konta wbudowane

Windows posiada specjalne konta systemowe, które istnieją od momentu instalacji. Są domyślnie ukryte lub wyłączone.

| Konto | Domyślny stan | Rola | Na Helpdesku |
| :--- | :--- | :--- | :--- |
| **Administrator** | Wyłączone | Konto superadmina – pełne uprawnienia, pomija UAC | Włączane w sytuacjach awaryjnych (np. jedyny admin zapomniał hasła) |
| **Gość** | Wyłączone | Tymczasowy dostęp bez hasła, minimalny poziom uprawnień | Rzadko używane – ryzyko bezpieczeństwa |
| **DefaultAccount** | Wyłączone | Konto systemowe dla profili tymczasowych | Nie dotykaj |
| **WDAGUtilityAccount** | Wyłączone | Używane przez Windows Sandbox i Application Guard | Nie dotykaj |

### Włączanie ukrytego konta Administrator

Scenariusz: jedyny administrator na komputerze zapomniał hasła. Ani resetować, ani logować się nie da.

**Rozwiązanie awaryjne** (z poziomu instalatora Windows lub środowiska WinRE w terminalu CMD):
```cmd
net user Administrator /active:yes
net user Administrator NoweHaslo123
```

Po zalogowaniu na konto Administrator możesz zresetować hasło użytkownika głównego i wyłączyć konto awaryjne:
```cmd
net user Jan NoweHasloJana
net user Administrator /active:no
```

> [!WARNING]
> Konto `Administrator` (wbudowane) **nie podlega UAC** – programy działają na nim z pełnymi uprawnieniami bez żadnych monitów. Dlatego trzymaj je **zawsze wyłączone** poza sytuacjami awaryjnymi.

---

## 📁 Profile użytkowników

Każde konto z grupą *Użytkownicy* na komputerze ma swój _**profil**_ – dedykowany folder z danymi, ustawieniami i konfiguracją. Profil tworzony jest automatycznie przy pierwszym logowaniu.

Lokalizacja: `C:\Users\<nazwa_użytkownika>\`

| Folder | Zawartość |
| :--- | :--- |
| `Desktop` | Pliki na pulpicie |
| `Documents` | Dokumenty użytkownika |
| `Downloads` | Pobrane pliki |
| `AppData` (ukryty) | Konfiguracja aplikacji, cache, pliki tymczasowe |

Plik **`NTUSER.DAT`** to główny, *ukryty* plik systemowy w systemie Windows, w którym przechowywane są wszystkie ustawienia profilu użytkownika.

**Zawartość:**  
Zapisuje konfigurację środowiska użytkownika, m.in. wygląd pulpitu, układ menu Start, ustawienia Eksploratora, preferencje programów, mapowania drukarek oraz większość ustawień aplikacji instalowanych w systemie.

**Działanie:**  
Podczas logowania plik jest ładowany do rejestru jako gałąź **`HKEY_CURRENT_USER`**, dzięki czemu system wie, jak ma wyglądać i działać środowisko użytkownika. Po wylogowaniu zmiany są zapisywane z powrotem do pliku `NTUSER.DAT`.


> [!CAUTION]
> **Usunięcie konta ≠ usunięcie profilu.** Gdy usuwasz konto przez `lusrmgr.msc` lub `net user /delete`, folder profilu w `C:\Users\[nazwa_użytkownika]`  dalej **_pozostaje na dysku_**. Zajmuje miejsce i może zawierać poufne dane. 
> 
> Aby usunąć profil: `Ustawienia` → `System` → `Informacje` → `Zaawansowane ustawienia systemu` → zakładka **Zaawansowane** → sekcja **Profile użytkowników** → **Ustawienia** → zaznacz profil → **Usuń**.

### Anatomia folderów AppData

Większość problemów z oprogramowaniem i infekcjami malware zaczyna się w jednym miejscu: w ukrytym folderze `AppData` na Twoim profilu. Zrozumienie, jak system Windows zarządza danymi aplikacji, to podstawa skutecznej diagnostyki.

Katalog `C:\Users\NazwaUżytkownika\AppData` dzieli się na trzy kluczowe podfoldery. Każdy z nich ma zupełnie inne przeznaczenie i zasady działania.

<data-tabs>
  <tabs>
    <item>Roaming</item>
    <item>Local</item>
    <item>LocalLow</item>
  </tabs>
  <div>

**Ścieżka:** `%AppData%` (domyślnie odsyła do `AppData\Roaming`)

To najważniejszy folder dla danych wędrujących. W środowiskach firmowych (Active Directory) profil użytkownika może być synchronizowany z serwerem. Jeśli zalogujesz się na innym komputerze w firmie, folder `Roaming` pobierze się z serwera.

**Co tu znajdziesz?**
- Pliki konfiguracyjne aplikacji (np. ustawienia przeglądarek).
- Zapisane stany gier.
- Szablony dokumentów i zakładki.

Ponieważ ten folder podróżuje przez sieć, aplikacje nie powinny wrzucać tu gigabajtów danych (np. pobranych aktualizacji), by nie zapchać łącza firmowego przy każdym logowaniu.

  </div>
  <div>

**Ścieżka:** `%LocalAppData%`

Zupełne przeciwieństwo Roaming. Dane w folderze `Local` są **na sztywno przypisane do jednego, fizycznego komputera**. Nie synchronizują się z serwerem.

**Co tu znajdziesz?**
- Pamięć podręczną przeglądarek (cache) – pliki, które można łatwo pobrać ponownie, by przyspieszyć ładowanie stron.
- Pliki tymczasowe instalatorów (`Local\Temp`).
- Duże bazy danych aplikacji, np. pliki skrzynek pocztowych programu Outlook (`.ost`).

To pierwsza linia frontu, jeśli zaczyna brakować Ci miejsca na dysku. Wyczyszczenie folderu `Temp` czy pamięci cache przeglądarek często zwalnia dziesiątki gigabajtów.

  </div>
  <div>

**Ścieżka:** `%LocalAppData%Low`

To folder o najniższym poziomie uprawnień i zaufania (Low Integrity). Powstał dla aplikacji, które działają w bardzo restrykcyjnym trybie chronionym np. przeglądarki internetowe w trybie incognito.

**Co tu znajdziesz?**
- Aplikacje, które nie mają prawa modyfikować głównych plików systemowych ani standardowego profilu użytkownika, mogą zapisywać dane tylko tutaj.
- Jeśli przeglądarka zostanie zhakowana przez złośliwy skrypt na stronie, atakujący znajdzie się w środowisku Low Integrity. Będzie uwięziony – może odczytywać i modyfikować tylko folder `LocalLow`, bez dostępu do reszty dysku.

  </div>
</data-tabs>

### Dlaczego AppData to wektor ataku? (Omijanie UAC)

Z założenia foldery w `AppData` miały służyć wyłącznie do przechowywania **danych**. Główne pliki wykonywalne programów (`.exe`) powinny być trzymane w zamkniętym folderze `C:\Program Files\`, gdzie dostęp wymaga praw administratora.

Większość deweloperów omija tę architekturę. Twórcy popularnych aplikacji (takich jak Discord, Spotify, instalatory gier, a nawet pakiety dla programistów jak Python) domyślnie instalują całe swoje programy (`.exe`) bezpośrednio do `AppData\Local` lub `AppData\Roaming`.

**Dlaczego to robią?**
Chodzi o ominięcie UAC (User Account Control). Folder `AppData` jest otwarty na zapis dla zwykłego, lokalnego konta. Dzięki temu przeciętny użytkownik może pobrać i zainstalować aplikację całkowicie samodzielnie, bez irytującego okienka proszącego o podanie hasła administratora.

Twórcy złośliwego oprogramowania wykorzystują dokładnie ten sam wytrych:
1. Użytkownik nieświadomie uruchamia złośliwy skrypt (np. z fałszywego maila).
2. Wirus nie posiada uprawnień, by zainstalować swój kod w `Program Files`.
3. Wirus bez pytania kopiuje swój kod `.exe` do otwartego folderu `AppData`.
4. Uruchamia się w tle, instaluje wpis w kluczu autostartu i szyfruje dysk.
5. Właśnie poznałeś działanie **_Ransomware_**. 😉

Weryfikacja jest prosta. Uruchom poniższy skrypt w PowerShell, by zobaczyć, ile programów wykorzystało tylne wejście na Twoim systemie:

```powershell
Get-ChildItem "$env:APPDATA" -Recurse -Filter *.exe -ErrorAction SilentlyContinue | Select-Object FullName
Get-ChildItem "$env:LOCALAPPDATA" -Recurse -Filter *.exe -ErrorAction SilentlyContinue | Select-Object FullName
```

Oto moja lista 😅:
- Visual Studio Code
- Antigravity
- PowerToys
- Python
- NVIDIA APP
- Mozilla Firefox
- Playwright
- Office
- GitHub Desktop
- Discord
- Composer
- WinDbg
- Gimp

Wszystko legitne. 😉

---

## 🔒 Uprawnienia NTFS (Zabezpieczenia Plików i Folderów)

Samo posiadanie konta to tylko połowa sukcesu. Prawdziwa kontrola w systemie Windows opiera się na **uprawnieniach NTFS**, które decydują o tym, *co* dany użytkownik może zrobić z konkretnym plikiem na dysku.

Właściwości pliku/folderu → zakładka **Zabezpieczenia** (Security).

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/uprawnienia-ntfs-pliku-podstawowe-i-zaawansowane.png">
    <hotspot x="27" y="25" title="Edytuj...">Uruchomi kolejne okno z podstawowymi ustawieniami uprawnień. Oznaczone niebieską obwódką.</hotspot>
    <hotspot x="15" y="78.5" title="Podstawowe uprawnienia:">Po dodaniu nowego użytkownika lub grupy uzyskasz możliwość zmiany ustawień uprawnień: 
    - `Pełna kontrola` (Full control) 
    - `Modyfikacja` (Modify) 
    - `Odczyt i wykonanie` (Read & execute)
    - `Odczyt` (Read) 
    - `Zapis` (Write) 
    - `Specjalne uprawnienia` (Special permissions)</hotspot>
    <hotspot x="82.5" y="72" title="Przełącz tryb uprawnień zaawansowane/podstawowe">Pozwala na rozszerzenie lub zawężenie listy dostępnych uprawnień do nadania.</hotspot>
    <hotspot x="26" y="44.5" title="Zaawansowane">Uruchomi kolejne okno z większą gamą możliwości takimi jak zmiana właściciela czy wyłączenie dziedziczenia uprawniań dla podkatalogów. Oznaczone fioletową obwódką.</hotspot>
    <hotspot x="38.5" y="44" title="Dodaj...">Umożliwia dodawanie kolejnych użytkowników lub grup do listy i nadanie im wybranych uprawnień. Oznaczone pomarańczową obwódką.</hotspot>
    <hotspot x="72" y="61" title="Wybierz przedmiot zabezpieczeń">Klikając to uruchamiasz kolejne okno, w którym wybierasz użytkownika lub grupę dla której chcesz nadać uprawnienia.</hotspot>
  </data-hotspot>
</data-gate>

### 🪙 Złote Zasady NTFS

1. **Odmowa (Deny) zawsze wygrywa.** Jeśli użytkownik należy do grupy A (która ma *Zezwalaj* na Odczyt) i do grupy B (która ma **_Odmów_** na Odczyt) – użytkownik **_nie_** przeczyta pliku. Zaznaczaj „Odmów” tylko wtedy, gdy to absolutnie konieczne!
2. **Pełna kontrola vs Modyfikacja.** Modyfikacja pozwala tworzyć, czytać, zmieniać i usuwać pliki. Pełna kontrola pozwala na to samo + _**prawo do zmiany uprawnień**_ i przejmowania na własność. Użytkownikom dajemy maksymalnie *Modyfikację*.
3. **Dziedziczenie (Inheritance).** Domyślnie każdy folder przekazuje swoje uprawnienia folderom i plikom wewnątrz. Aby nadać unikalne uprawnienia głęboko w strukturze, musisz wyłączyć dziedziczenie (przycisk *Zaawansowane* → *Wyłącz dziedziczenie*), kopiując obecne prawa jako jawne.
4. **Właściciel (Owner).** Nawet jeśli Administrator ma *Odmów* na odczyt pliku, może wejść w *Zaawansowane* i **Zmienić właściciela** na siebie. Właściciel zawsze ma prawo zmienić uprawnienia, dzięki czemu Administrator zawsze może odzyskać kontrolę nad zablokowanym zasobem.

### ⏹️ Zarządzanie z poziomu Konsoli

<data-tabs>
  <tabs>
    <item>CMD (icacls)</item>
    <item>PowerShell</item>
  </tabs>
  <div>

Narzędzie `icacls` to klasyk do modyfikacji NTFS z linii komend.

```cmd
icacls "C:\Raporty" /grant Jan:(R)             ← Nadaje Janowi prawo do Odczytu (Read)
icacls "C:\Raporty" /grant Technik:(M)         ← Nadaje Technikowi prawo do Modyfikacji (Modify)
icacls "C:\Raporty" /deny Gość:(F)             ← Odbiera Gościowi Pełną kontrolę (Full)
icacls "C:\Raporty" /inheritance:r             ← Wyłącza dziedziczenie i usuwa odziedziczone prawa
```

  </div>
  <div>

PowerShell operuje na tzw. listach ACL (Access Control List). Podejście skryptowe wymaga zbudowania reguły.

```powershell
$Acl = Get-Acl "C:\Raporty"
$Rule = New-Object System.Security.AccessControl.FileSystemAccessRule("Jan","Read","Allow")
$Acl.AddAccessRule($Rule)
Set-Acl "C:\Raporty" $Acl
```

  </div>
</data-tabs>

> [!TIP]
> Do szybkich operacji, `icacls` jest znacznie szybsze do wpisania w CMD, mimo topornej składni, niż budowanie reguł w PowerShell. 😉

---

## 🏛️ Lokalne Zasady Zabezpieczeń (secpol.msc)

Oprócz tego, „kto może dotknąć danego pliku”, system operacyjny musi wiedzieć „jak użytkownicy mogą się zachowywać”. Do tego służą Lokalne zasady zabezpieczeń, narzędzie potężne, używane w domenach (jako GPO) i lokalnie (w edycjach Pro/Enterprise).

<kbd class="Win"></kbd> + <kbd>R</kbd> → `secpol.msc`

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/secpol.png">
    <hotspot x="5" y="20.6" title="Zasady blokady konta">
Konfiguracja wymogów dotyczących  haseł oraz reagowania na próby włamania (blokady konta).
|Zasada| Opis ustawienia |
|:--|:--|
| Czas trwania blokady konta | Określa maksymalny czas, przez jaki konto pozostaje zablokowane po przekroczeniu progu nieudanych logowań. |
| Próg blokady konta | Wartość określająca maksymalną liczbę nieudanych prób logowania, po której konto zostaje automatycznie zablokowane. |   
| Wyzeruj licznik blokady konta po | Wartość określająca, po ilu minutach od ostatniej nieudanej próby logowania licznik nieudanych prób logowania jest resetowany. |
| Zezwalaj na blokadę konta administratora | Wartość określająca, czy konto administratora może zostać zablokowane po przekroczeniu progu nieudanych logowań. |      
  </hotspot>
    <hotspot x="5" y="68" title="Zasady haseł">
Konfiguracja wymogów dotyczących haseł oraz opcji bezpieczeństwa.
|Zasada| Opis ustawienia |
|:--|:--|
| Hasło musi spełniać wymagania co do złożoności | Wymusza minimalną złożoność hasła, włączając długość, wymaganie znaków specjalnych, cyfr oraz wielkich/małych liter. |
| Inspekcja minimalnej długości hasła | Umożliwia sprawdzanie minimalnej długości hasła. |
| Maksymalny okres ważności hasła | Określa maksymalny czas, przez jaki hasło użytkownika pozostaje ważne przed jego ponownym ustawieniem. |
| Minimalna długość hasła | Ustawia minimalną liczbę znaków, które musi zawierać hasło. |
| Minimalny okres ważności hasła | Wymusza zmianę hasła po upływie ustalonego czasu. |
| Wymuszaj tworzenie historii hasła | Utrwala historię haseł, uniemożliwiając ich ponowne użycie w zadanym okresie. |
| Zapisz hasła korzystając z szyfrowania odwracalnego | Umożliwia przechowywanie haseł w postaci zaszyfrowanej, co zwiększa bezpieczeństwo w przypadku wycieku danych. |
| Zmniejsz restrykcyjność limitów minimalnej długości hasła | Zabrania ustawienia hasła dłuższego niż $14$ znaków. Bardzo problematyczne dla usług i aplikacji w systemie. |
  </hotspot>
  </data-hotspot>
</data-gate>

---

## 🕵️ Finał: Scenariusze Helpdesku i INF.02

Zrozumienie uprawnień to umiejętność łączenia wiedzy o koncie, UAC, zabezpieczeniach plików (NTFS) i polisach lokalnych.

<data-gate>
  <data-connection-matcher title="Procedury egzaminacyjne">
    <div class="cmw-item" data-left="Klient nie może otworzyć pliku mimo że jest Administratorem." data-right="Ktoś w zakładce Zabezpieczenia nadał mu twardą Odmowę. Wejdź w Zaawansowane i przejmij Właściciela by zresetować uprawnienia."></div>
    <div class="cmw-item" data-left="Musisz nadać pracownikowi prawo do odczytu folderu w CMD." data-right="Użyj polecenia icacls: icacls &quot;C:\Dane&quot; /grant Pracownik:(R)"></div>
    <div class="cmw-item" data-left="Zadanie: zablokuj konto na 30 minut po 5 błędnych hasłach." data-right="Uruchom secpol.msc, wejdź w Zasady konta -> Zasady blokady konta i ustaw Próg blokady konta na 5 prób."></div>
    <div class="cmw-item" data-left="Usunąłeś pracownika z grupy Administratorzy, ale nadal ma pełny dostęp do dysku C:\Tajne" data-right="Użytkownik musiał zostać jawnie przypisany w zakładce Zabezpieczenia dysku C:\Tajne. Musisz mu usunąć tam wpis ręcznie."></div>
    <div class="cmw-item" data-left="Nowo dodawane pliki wewnątrz folderu automatycznie zyskują dziwne uprawnienia." data-right="Folder nadrzędny ma włączone Dziedziczenie. Wyłącz je w opcjach Zaawansowanych NTFS, jeśli chcesz odciąć nowy schemat."></div>
  </data-connection-matcher>
</data-gate>

---

<data-gate>
  <data-quiz>
    <question>Egzamin INF.02: Skonfiguruj system tak, aby użytkownik "Kowalski" mógł modyfikować pliki w katalogu `C:\Raporty`, ale zabroniono mu usuwania samego katalogu. Ponadto, hasło do każdego nowego konta w systemie musi wymagać minimum 10 znaków. Jaka jest prawidłowa ścieżka działania?</question>
    <options>
      <item>Użyć polecenia net user by zabronić kasowania. W lusrmgr.msc ustawić regułę 10 znaków.</item>
      <item correct>We właściwościach NTFS folderu nadać Kowalskiemu Zezwalaj na "Modyfikacja". Włączyć secpol.msc -> Zasady haseł i zmienić minimalną długość hasła na 10.</item>
      <item>W UAC ustawić zakaz usuwania folderów dla kont standardowych. Hasło 10-znakowe ustawić we właściwościach konta Kowalskiego w netplwiz.</item>
      <item>Zablokować usuwanie poprzez nadanie mu twardej Odmowy na wszystko w `icacls`. Długość hasła wymaga skryptu w PowerShellu.</item>
    </options>
    <div data-hint="error">
      Reguły znaków dla haseł w całym systemie konfiguruje się tylko przez `secpol.msc`. Narzędzia takie jak UAC, net user czy netplwiz w ogóle tego nie obsługują. Ponadto "Odmowa" na wszystko w NTFS spowodowałaby zablokowanie też modyfikacji.
    </div>
    <div data-hint="success">
      Znakomicie! Zabezpieczenia folderów realizujemy po stronie NTFS (Zabezpieczenia / Modyfikacja pozwala na edycję), a globalne wymogi systemowe takie jak siła haseł realizuje się polisami (secpol.msc).
    </div>
  </data-quiz>
</data-gate>

> [!TIP]
> **Złota zasada technika:** Uprawnienia to układanka. *Co możesz zrobić systemowo* (Konto + UAC + secpol.msc) oraz *czego możesz dotknąć na dysku* (NTFS). Dopiero zrozumienie obu stref daje Ci pełną władzę nad Windowsem.

----

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Złota zasada kont i rola UAC:** Codzienną pracę wykonujemy na koncie standardowym. UAC (User Account Control) zapobiega automatycznemu uruchamianiu programów z uprawnieniami admina, wymuszając świadome potwierdzenie lub podanie hasła. Nigdy go nie wyłączaj! 🛡️
- **Narzędzia zarządzania kontami:** Konsola `lusrmgr.msc` (tylko w edycjach Pro/Enterprise) to pełnoprawne narzędzie administracyjne. W Windows Home alternatywą dla GUI jest `netplwiz` oraz komendy terminala (`net user` w CMD, `Get-LocalUser` w PowerShell). 🧰
- **Plik NTUSER.DAT i profile:** Każdy zalogowany użytkownik otrzymuje swój profil w `C:\Users`. Jego indywidualne ustawienia systemowe i programów zapisywane są w ukrytym pliku `NTUSER.DAT`, który ładuje się do rejestru jako gałąź `HKEY_CURRENT_USER`. Usunięcie konta nie usuwa folderu profilu automatycznie! 📁
- **Uprawnienia NTFS (Zabezpieczenia):** Złotą zasadą jest, że twarda „Odmowa” (Deny) zawsze wygrywa z zezwoleniem. Administrator lub właściciel pliku/folderu zawsze może przejąć go na własność, nawet jeśli ma zablokowany dostęp, a uprawnienia mogą być automatycznie dziedziczone z folderów nadrzędnych. 🔒
- **Lokalne Zasady Zabezpieczeń (`secpol.msc`):** To kluczowe narzędzie do wdrażania polityk bezpieczeństwa na poziomie lokalnym – m.in. wymogów dotyczących minimalnej długości i złożoności haseł oraz blokady konta po serii nieudanych prób logowania. 🏛️

---

Skoro znasz już konta użytkowników oraz mechanizmy uprawnień lokalnych, czas zabezpieczyć stację przed zagrożeniami z sieci. Ruszamy do konfiguracji zapory sieciowej i reguł bezpieczeństwa! 🛡️