# Polisy, Zabezpieczenia i Rejestr Systemowy

Poprzednia lekcja uczyła nas analizy po fakcie – szukaliśmy śladów awarii w Dzienniku Zdarzeń. W tym module przestaniesz być tylko obserwatorem i zaczniesz aktywnie modyfikować surowe parametry systemu, od których zależy to, na co Windows pozwala użytkownikom i aplikacjom.

Z poprzednich modułów wiesz już, jak ominąć proces OOBE i utworzyć lokalne konto administratora zamiast wymuszanego przez Microsoft konta online. Ma to jednak swoją cenę. Konto Microsoft automatycznie chroni dostęp za pomocą chmury i MFA. Konto lokalne daje Ci pełną niezależność od serwerów, ale zostawia kwestie bezpieczeństwa wyłącznie w Twoich rękach – domyślnie pozwala na puste hasła i nie posiada limitów prób logowania. W tej lekcji nauczysz się własnoręcznie łatać te luki: odetniemy drogę ransomware'owi, zahackujemy stan aplikacji w Rejestrze i zbudujemy rygorystyczną klatkę dla stanowiska publicznego. Czas wejść pod maskę.

---

## 🏗️ Architektura: Dlaczego „Ustawienia" Windows to za mało?

Zanim przejdziemy do konfiguracji, musisz zrozumieć jeden kluczowy fakt. Graficzny panel **Ustawienia** i klasyczny **Panel sterowania** to zwykłe aplikacje działające w przestrzeni użytkownika (Ring 3). Modyfikują one standardowe klucze w Rejestrze, które mogą zostać łatwo nadpisane lub zignorowane.

Z kolei narzędzia takie jak `gpedit.msc` i `secpol.msc` zapisują dane w chronionych kluczach polis (ang. *Policy Keys*) oraz w dedykowanej bazie zabezpieczeń (`secedit.sdb`). Podsystemy zabezpieczeń Windowsa (w tym proces `lsass.exe` z przestrzeni użytkownika oraz moduł *Security Reference Monitor* działający bezpośrednio w Jądrze, Ring 0) zawsze nadają absolutny priorytet tym politykom. W przypadku konfliktu ustawienia „wyklikiwane” przez użytkownika są całkowicie ignorowane.

![akcje-na-rejestrze-i-bazie-systemu-dla-jądra-secpol-gpedit-oraz-ustawień-i-panelu-sterowania](/public/courses/windows-11/Images/akcje-na-rejestrze-i-bazie-systemu-dla-jądra-secpol-gpedit-oraz-ustawień-i-panelu-sterowania.png)

:::diagram
Schemat przedstawia architekturę przepływu konfiguracji w systemie Windows, ilustrując fizyczne relacje między Jądrem systemu, narzędziami administracyjnymi i interfejsem użytkownika, a centralną bazą Rejestru.
:::

**Opis strukturalny diagramu**

1. **Główne komponenty** – W górnej części rysunku ułożone są poziomo cztery prostokątne bloki. Od lewej do prawej to: „🧿 Jądro Systemu (Ring 0)”, „🔧 `secpol.msc` Zasady Zabezpieczeń Lokalnych”, „🛠️ `gpedit.msc` Edytor Zasad Grupy” oraz „🪟 Ustawienia Windows Panel Sterowania (Ring 3)”.
2. **Centralna baza danych** – W dolnej części schematu znajduje się ciemny, walcowaty kształt z pomarańczowym obrysem, opisany jako „🗄️ Rejestr Systemowy i Baza Zabezpieczeń”.
3. **Pola akcji** – Pod każdym z czterech górnych bloków znajduje się szare pole z opisem działania, od którego prowadzi strzałka do centralnego walca na dole.
4. **Relacja Jądra Systemu** – Od Jądra odchodzi zielona strzałka przez pole „Odczytuje podczas startu i logowania”, co wizualizuje proces pobierania danych.
5. **Relacje narzędzi administracyjnych** – Od `secpol.msc` prowadzi biała strzałka przez pole „Modyfikuje secedit.sdb i klucze rejestru”. Od `gpedit.msc` prowadzi analogiczna strzałka przez pole „Generuje Registry.pol i nadpisuje rejestr”.
6. **Relacja panelu użytkownika** – Skrajny prawy blok (Ustawienia) jest połączony białą strzałką z bazą poprzez pole opisane jako „Słabe zmiany, niższy priorytet”.

> [!NOTE]
> `gpedit.msc` to potężna nakładka graficzna do masowej, bezpiecznej edycji **Rejestru** w oparciu o polityki. Z kolei `secpol.msc` to wycinek (podzbiór) edytora `gpedit.msc`, wyseparowany jako osobne narzędzie, aby dać administratorom szybki wgląd w same krytyczne parametry ochrony systemu bez przebijania się przez resztę opcji. Co najważniejsze: **ani `gpedit.msc`, ani `secpol.msc` nie są dostępne w systemie Windows 11 Home**. Narzędzia te zarezerwowane są wyłącznie dla wersji *Pro*, *Enterprise* oraz *Education*.

<data-gate>
  <data-quiz>
    <question>Dlaczego narzędzia takie jak `gpedit.msc` zawsze mają absolutny priorytet nad standardowym Panelem Sterowania?</question>
    <options>
      <item>Ponieważ operują one w przestrzeni użytkownika (Ring 3) i wymuszają uprawnienia przez UAC.</item>
      <item correct>Modyfikują one chronione klucze polis w Rejestrze, które Jądro systemu czyta jako pierwsze i ostateczne.</item>
      <item>Ze względu na to, że generują one pliki XML nadpisujące graficzne ustawienia menedżera pulpitu (DWM).</item>
    </options>
    <div data-hint="error">
      Zastanów się nad architekturą z diagramu.
    </div>
    <div data-hint="success">
      Dokładnie! Zwykłe Ustawienia to tylko Ring 3. Polityki z `gpedit` i `secpol` modyfikują specjalne chronione klucze rejestru, które Jądro Windowsa zawsze traktuje jako ważniejsze w przypadku konfliktu.
    </div>
  </data-quiz>
</data-gate>

---

## 🔐 1. Zasady Zabezpieczeń Lokalnych (secpol.msc)

Narzędzie `secpol.msc` (ang. *Security Policy*) to przystawka **MMC** (*Microsoft Management Console*), na której opiera się zarządzanie wszystkimi biznesowymi wariantami systemów Windows. No chyba że infrastruktura opiera się o chmurę Microsoft Entra ID. Samo rozszerzenie `.msc` oznacza po prostu zapisany profil tej konsoli (*Microsoft Saved Console*).

Ustawisz w niej m.in.: wymagania co do haseł, historię haseł, blokowanie konta, czy system ma tylko raportować nieudane próby logowania, czy je od razu blokować.

Uruchamiasz ją skrótem <kbd class="Win"></kbd> + <kbd>R</kbd>, wpisz komendę `secpol.msc` i zatwierdzasz klawiszem <kbd>Enter</kbd>.

### 🔑 Zasady Haseł – koniec z `admin123`

Hasła to pierwsza linia obrony. Bez wymuszonych zasad użytkownicy będą ustawiać `hasło1`, `qwerty` lub, co gorsza, zostawią konto bez hasła w ogóle.

W lewym drzewie przejdź do: <kbd class="win-menu-btn">Zasady konta</kbd> → <kbd class="win-menu-btn">Zasady haseł</kbd>.

Poniższy widok przedstawia pełną listę dostępnych polis. Wartości, które tu narzucisz, nie powinny być przypadkowe – w środowiskach produkcyjnych opiera się je na branżowych standardach bezpieczeństwa, takich jak **Microsoft Security Baselines**, wytyczne **CIS (Center for Internet Security)** czy ramy **NIST SP 800-63B**. 

Zbadaj każdą z dostępnych zasad na interaktywnym zrzucie ekranu (najedź na pulsujące punkty):

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/secpol-zasady-haseł.png">
    <hotspot x="31.3" y="20.8" title="Hasło musi spełniać wymagania co do złożoności">
_**Zalecenie: Włączone**_
Ta zasada wymusza, żeby hasło zawierało znaki z co najmniej **$3$ z $4$** kategorii:
- Wielkie litery (A-Z)
- Małe litery (a-z)  
- Cyfry ($0 - 9$)
- Znaki specjalne (!@#$%...)
`SuperAdmin` – odrzucone ❌ (brak cyfr i znaków specjalnych).  
`S3cur3@dmin` – zaakceptowane. ✅</hotspot>
    <hotspot x="75.2" y="24.2" title="Inspekcja minimalnej długości hasła">
_**Zalecenie: Używane przejściowo (np. $14$ znaków)**_
Ta nowa polisa (ikona kartki z lupą) to flagowy przykład profesjonalnego podejścia **„Audit before Enforce”** (Audytuj przed Wymuszeniem).
- **Jak to działa?** Nie blokuje fizycznie użytkownika przy zmianie hasła, ale cicho zapisuje w Dzienniku Zdarzeń każdą próbę ustawienia hasła krótszego niż podany tutaj próg.
- **Zastosowanie:** Jeśli przejmujesz infrastrukturę, w której hasła miały $8$ znaków i chcesz podnieść limit na $14$, nie włączasz od razu twardej blokady (sparaliżowałbyś pracę firmy). Najpierw ustawiasz _audyt_ na $14$, przez miesiąc obserwujesz w logach kto próbuje ustawiać stare/krótkie hasła, docierasz do tych osób i tłumaczysz konieczność bezpieczniejszych haseł, a dopiero na samym końcu włączasz rzeczywiście wymuszasz nową politykę.</hotspot>
    <hotspot x="31.3" y="27.6" title="Maksymalny okres ważności hasła">
_**Zalecenie: 365 dni (lub wyłączone)**_
Historycznie wymuszano zmianę co $30 - 90$ dni. Dziś wytyczne NIST odradzają ten proceder:
- Częste zmiany zmuszają do używania przewidywalnych haseł (np. `Haslo1`, `Haslo2`).
- Lepszym podejściem jest **jedno, długie hasło**, zmieniane wyłącznie w przypadku kompromitacji (ujawnienia/wycieku).</hotspot>
    <hotspot x="75.2" y="31" title="Minimalna długość hasła">
_**Zalecenie: $14$ znaków**_
Najbardziej krytyczny parametr całego zestawienia.
Zarówno CIS, jak i MS Baselines wskazują $14$ znaków jako próg bezpieczeństwa.
Odpowiednia długość chroni przed atakami typu Brute-Force znacznie skuteczniej niż wymyślna złożoność znaków.</hotspot>
    <hotspot x="31.3" y="34.2" title="Minimalny okres ważności hasła">
_**Zalecenie: 1 dzień**_
Stanowi zabezpieczenie przed oszustwami.
Gdyby polisa wynosiła $0$ dni, użytkownik mógłby zmienić hasło $24$ razy z rzędu w ciągu minuty, „przepychając” historię haseł i bezkarnie wracając do swojego ulubionego, starego hasła. 😅</hotspot>
    <hotspot x="75.2" y="37.6" title="Wymuszaj tworzenie historii haseł">
_**Zalecenie: $24$ hasła**_
System operacyjny zapamiętuje w izolowanej bazie $24$ ostatnie hasła użytkownika.
Gdy nadchodzi czas obowiązkowej zmiany, Windows odrzuci próbę ponownego użycia któregokolwiek z haseł znajdujących się w tym buforze.</hotspot>
    <hotspot x="31.3" y="41" title="Zapisz hasła korzystając z szyfrowania odwracalnego">
_**Zalecenie: Bezwzględnie Wyłączone**_
Krytycznie niebezpieczna polisa z czasów archaicznych protokołów (np. uwierzytelnianie CHAP).
Włączenie tej opcji powoduje zapisywanie haseł praktycznie otwartym tekstem. 
Pod żadnym pozorem nie używaj tego w nowoczesnym środowisku produkcyjnym. 🥶</hotspot>
    <hotspot x="75.2" y="44.3" title="Zmniejsz restrykcyjność limitów minimalnej długości hasła">
_**Zalecenie: Włączone**_
Nowoczesna polityka (zwróć uwagę na dedykowaną ikonę).
Wcześniej Windows pozwalał narzucić minimalną długość hasła tylko do $14$ znaków ze względu na przestarzałe API.
Włączenie zasady znosi ten limit, dając administratorowi możliwość wymuszenia haseł o długości aż do $128$ znaków.</hotspot>
  </data-hotspot>
</data-gate>

---

### 🔒 Zasady Blokady Konta – śmierć ataków Brute-Force

Sama złożoność hasła nie wystarczy. Jeśli atakujący ma nieograniczoną liczbę prób, każde hasło da się złamać słownikiem lub siłą. Zasady blokady konta rozwiązują ten problem radykalnie: po kilku błędnych próbach konto zostaje zablokowane.

Przejdź do: <kbd class="win-menu-btn">Zasady konta</kbd> → <kbd class="win-menu-btn">Zasady blokady konta</kbd>.

Na poniższym zrzucie widać poprawnie skonfigurowane zasady. Wyeliminuj mity krążące po forach i przeanalizuj produkcyjne zastosowanie każdej z nich:

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/secpol-zasady-blokady-konta.png">
    <hotspot x="31.3" y="20.5" title="Czas trwania blokady konta">
_**Zalecenie: $15$ minut (lub $0$ dla stałej blokady)**_
Określa, na jak długo konto zostaje zamrożone po przekroczeniu limitu błędów.
- Wartość $0$ oznacza blokadę do czasu ręcznej interwencji administratora (wymóg np. w sektorze finansowym).
- W zwykłej firmie zaleca się $15$ minut. To wystarcza by zatrzymać ataki Brute-Force, unikając jednocześnie ataków typu *Denial of Service* (gdyby haker złośliwie chciał zablokować wszystkich pracowników na $24$ godziny 😉).</hotspot>
    <hotspot x="75.2" y="24.4" title="Próg blokady konta">
_**Zalecenie: $5$ do $10$ nieudanych prób**_
Liczba pomyłek, po których system odcina dostęp do konta.
Błędem początkujących administratorów jest ustawianie $3$ prób. Według *Microsoft Security Baselines* próg powinien wynosić minimum $5$. Dlaczego? Użytkownicy robią literówki (<kbd>Caps Lock</kbd>, <kbd>Num Lock</kbd>). Ustawienie limitu na $3$ powoduje jedynie paraliż działu Helpdesku z powodu setek fałszywych zablokowań.</hotspot>
    <hotspot x="31.3" y="27.5" title="Wyzeruj licznik blokady konta po">
_**Zalecenie: $15$ minut**_
Polisa bardzo często źle rozumiana. Stanowi ona **okres „stygnięcia”** licznika pomyłek.
- **Jak to działa?** Jeśli próg wynosi $5$ prób, a Ty pomylisz się $4$ razy, wystarczy poczekać $15$ minut. System sam wyzeruje licznik i znów będziesz miał do dyspozycji całą pulę $5$ prób.
- Zapobiega to absurdalnej sytuacji, w której Twoje przypadkowe błędy sumują się przez cały tydzień pracy, prowadząc do nieuzasadnionej blokady.</hotspot>
    <hotspot x="75.2" y="31" title="Zezwalaj na blokadę konta administratora">
_**Zalecenie: Włączone**_
Krytyczna polisa załatana oficjalnie dopiero w Windows 11 (22H2) i Windows Server 2022!
Historycznie, wbudowane konto systemowe `Administrator` **w ogóle nie podlegało blokadom**. Atakujący doskonale o tym wiedzieli, celując automatycznymi botami zgadującymi hasła bezpośrednio w tego użytkownika. Zaznaczenie tej opcji eliminuje tę ogromną, wieloletnią lukę bezpieczeństwa Windowsa. 🤣</hotspot>
  </data-hotspot>
</data-gate>

### 🧰 Zestaw narzędzi: Zarządzanie zablokowanymi kontami

Gdy polisa bezpieczeństwa zadziała i zablokuje atak (lub gdy pracownik zapomni hasła), konto zostanie zamrożone. Jako administrator możesz to szybko zweryfikować i odblokować z poziomu PowerShell:

1. **Weryfikacja statusu konta:**
```powershell
Get-LocalUser -Name "Administrator" | Select-Object Name, Enabled, LockedOut
```
2. **Ręczne odblokowanie (po weryfikacji tożsamości):**
```powershell
Unlock-LocalUser -Name "Administrator"
```
> [!TIP]
> Jeśli preferujesz interfejs graficzny (GUI), odpal komendę `lusrmgr.msc` (Lokalni użytkownicy i grupy), wejdź we właściwości danego użytkownika i po prostu odznacz okienko "Konto jest zablokowane".

---

### 👁️ Zasady Inspekcji – włączenie „oczu” systemu

Zabezpieczenia to nie tylko blokady, ale też stały monitoring. System bez włączonego audytu jest ślepy. Windows posiada wbudowany, ultrawydajny mechanizm logowania oparty na architekturze **ETW (Event Tracing for Windows)**. Domyślnie jednak, by oszczędzać zasoby dyskowe w wersjach Desktopowych (np. Pro/Home), system nie zapisuje wielu zdarzeń powiązanych z autoryzacją.

Przejdź do: <kbd class="win-menu-btn">Zasady lokalne</kbd> → <kbd class="win-menu-btn">Zasady inspekcji</kbd>.

> [!TIP]
> W nowoczesnych środowiskach korporacyjnych z Windows 11 / Server 2022 używa się tzw. *Zaawansowanej konfiguracji zasad inspekcji* (znajdziesz ją na samym dole drzewa w `secpol`), która pozwala na precyzyjne ustawienie ponad 50 subkategorii. Jednak zaprezentowana tu lista klasycznych 9 polis jest historycznym fundamentem.

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/secpol-zasady-inspekcji.png">
    <hotspot x="31.3" y="21" title="Inspekcja zdarzeń logowania na kontach">
Ta zasada **_NIE_** oznacza samego momentu wejścia do systemu. 
- **Co robi?** Zapisuje sam fakt sprawdzania hasła w bazie danych (w lokalnej bazie SAM lub Kerberos na serwerze).
- Wpis powstaje za kulisami, zanim użytkownik w ogóle otrzyma pulpit.
    </hotspot>
    <hotspot x="76" y="24.2" title="Inspekcja dostępu do obiektów">
- **Co robi?** Rejestruje każdą próbę odczytu lub zmiany ważnego pliku.
- **Wymóg:** Opcja zadziała, tylko jeśli najpierw włączysz ją ręcznie we właściwościach samego pliku (w zakładce Zabezpieczenia).
- **Cel:** Odnajdywanie złodziei danych firmowych.
    </hotspot>
    <hotspot x="31.3" y="27.45" title="Inspekcja dostępu do usługi katalogowej">
- **Gdzie działa?** Wyłącznie na serwerach pełniących rolę Kontrolera Domeny.
- **Co robi?** Monitoruje wszystkie próby dostępu do głównej bazy Active Directory (czyli pliku `NTDS.dit`).
    </hotspot>
    <hotspot x="76" y="31" title="Inspekcja śledzenia procesów">
Bardzo potężne, ale mocno obciążające dysk narzędzie.
- **Co robi?** Zapisuje nazwę absolutnie każdej aplikacji, która została uruchomiona na komputerze.
- **Cel:** Pozwala prześledzić krok po kroku, jakie programy potajemnie uruchomił wirus (np. **_Trojan_**).
    </hotspot>
    <hotspot x="31.3" y="34.5" title="Inspekcja użycia uprawnień">
- **Co robi?** Tworzy wpis w dzienniku, gdy jakikolwiek program próbuje wykonać operację na jądrze systemowym.
- **_Wada:_** Generuje ogromny szum informacyjny, przez co jest rzadko używana.
    </hotspot>
    <hotspot x="76" y="37.7" title="Inspekcja zarządzania kontami">
- **Co robi?** Rejestruje fakt utworzenia, modyfikacji lub usunięcia dowolnego konta w systemie Windows.
- **Cel:** Służy do błyskawicznego wykrywania hakerów, którzy po włamaniu ukradkiem tworzą własne konta administracyjne. Przydatne gdy masz setki jak nie tysiące kont, ale głównie w domenie Active Directory.
    </hotspot>
    <hotspot x="31.3" y="41" title="Inspekcja zdarzeń logowania">
_**Absolutnie najważniejsza polisa dla obrony stanowiska!**_
- **Co robi?** Zapisuje każdą próbę udanego lub błędnego wejścia **na ten konkretny komputer**.
- Obejmuje wejścia przez klawiaturę fizyczną, przez sieć Wi-Fi oraz przez Pulpit Zdalny (RDP).
    </hotspot>
    <hotspot x="76" y="44.5" title="Inspekcja zdarzeń systemowych">
- **Co robi?** Rejestruje działania wpływające na podsystem zabezpieczeń Jądra Windows.
- **Przykłady:** Zapisuje dokładny czas włączenia i wyłączenia systemu, ukrytą modyfikację zegara, czy celowe wyczyszczenie Dziennika Zdarzeń.
    </hotspot>
    <hotspot x="31.3" y="48" title="Inspekcja zmian zasad">
- **Co robi?** Zapisuje każdy moment, w którym administrator dokona zmian w samym programie `secpol.msc`.
- **Cel:** Pierwszą rzeczą, jaką robi inteligentny wirus lub włamywacz, jest próba „wyłączenia monitoringu”. Ta zasada gwarantuje, że udana dezaktywacja audytu automatycznie wygeneruje o tym wpis.
    </hotspot>
  </data-hotspot>
</data-gate>

### 🗝️ Konfiguracja inspekcji zdarzeń logowania

Aby móc na żywo obserwować potencjalne ataki, kliknij dwukrotnie w **„Przeprowadź inspekcję zdarzeń logowania"** i zaznacz obydwie opcje:
- <kbd class="check-mark"></kbd> **Sukces** – system zapisze każde udane wejście (`Event ID 4624`).
- <kbd class="check-mark"></kbd> **_Niepowodzenie_** – system zapisze każdą odrzuconą próbę wejścia (`Event ID 4625`).

Po zapisaniu zmian otwórz **Podgląd zdarzeń** (`eventvwr.msc`), rozwiń <kbd class="win-menu-btn">Dzienniki systemu Windows</kbd> i kliknij <kbd class="win-menu-btn">Zabezpieczenia</kbd>.


<data-tabs>
  <tabs>
    <item>Event ID 4624 – Sukces</item>
    <item>Event ID 4625 – Niepowodzenie</item>
    <item>Kody błędów (Hex)</item>
  </tabs>
  <div>

![Podgląd Zdarzeń z otwartym zdarzeniem 4624 - Inspekcja udanych logowań z pełnymi szczegółami](/public/courses/windows-11/Images/inspekcja-logowania-w-podglądzie-zdarzeń-sukcesy.png)

**Event ID 4624: Logowanie na koncie zakończone sukcesem**

Ten log oznacza po prostu, że ktoś dostał się do systemu. Zamiast czytać cały długi opis, skup się na trzech najważniejszych polach:
- **Nowe logowanie** → *Nazwa konta* – na jaki login ktoś wszedł (np. `Egzamin`).
- **Informacje o sieci** → *Źródłowy adres sieciowy* – z jakiego adresu IP się połączył (np. `127.0.0.1` (*localhost*) w przypadku logowania fizycznie z tej samej maszyny).
- **Informacje o logowaniu** → *Typ logowania* – w jaki sposób nastąpiło wejście. Najpopularniejsze to:
  - `2` = Interaktywny (ktoś usiadł fizycznie przed monitorem i użył klawiatury).
  - `3` = Sieciowy (ktoś połączył się przez udostępniony w sieci folder).
  - `10` = Zdalny (ktoś wbił przez Pulpit Zdalny).

Jeśli w logach widzisz logowanie zdalne (Typ `10`) na konto `Administrator` o $03:00$ w nocy z adresu IP zarejestrowanego na innym kontynencie... to wiedz, że coś się dzieje. 🤔

  </div>
  <div>

![Podgląd Zdarzeń z otwartym zdarzeniem 4625 – Niepowodzenie inspekcji z pełnymi szczegółami](/public/courses/windows-11/Images/inspekcja-logowania-w-podglądzie-zdarzeń-niepowodzenie.png)

**Event ID 4625: Logowanie na koncie nie powiodło się**

To Twój najważniejszy wpis do wyłapywania ataków Brute-Force. W uproszczeniu, log z naszego środowiska testowego wygląda tak:

```yaml
Podmiot:
  Identyfikator zabezpieczeń: SYSTEM
  Nazwa konta: VM2$

Typ logowania: 2

Konto, na którym logowanie nie powiodło się:
  Identyfikator zabezpieczeń: NULL SID
  Nazwa konta: Egzamin

Informacje o niepowodzeniu:
  Stan: 0xC000006D
  Stan podrzędny: 0xC000006A

Informacje o sieci:
  Adres źródłowy sieci: 127.0.0.1
```

W tym przykładzie system odrzucił logowanie interaktywne (Typ `2`) na konto `Egzamin`, wykonane bezpośrednio z tej samej maszyny (`127.0.0.1` oznacza localhost). Skąd wiadomo, dlaczego Windows odrzucił hasło? Zajrzyj do zakładki z kodami.

> [!NOTE]
> **💡 Tipy i anegdoty: Testowanie audytu (RDP vs SMB)**
> Chcesz wygenerować Event 4625 u siebie? Połącz się z innym komputerem przez Pulpit Zdalny podając błędne hasło (w konsoli: `cmdkey /add:IP /user:Admin /pass:Zle`, a potem `mstsc /v:IP`). 
> **Dlaczego RDP, a nie np. udziały sieciowe (`net use \\IP\IPC$`)?** W Windows 11 w środowisku bez domeny Active Directory, protokół SMBv2 na dzień dobry wymaga podpisów kryptograficznych. Użycie `net use` z błędnym hasłem nie wrzuci Ci logu 4625. Zamiast tego serwer w ogóle zerwie połączenie z *Błędem systemu 86*, zanim zdąży sprawdzić hasło. RDP używa mechanizmu NLA (Network Level Authentication), który przepuści żądanie do bazy SAM i prawidłowo odnotuje w Dzienniku porażkę logowania.

  </div>
  <div>

### Słownik kodów 4625

Zamiast zgadywać, po prostu zerknij na kod w polu **Stan podrzędny**. To on zdradza prawdziwą przyczynę porażki:

- `0xC000006A` – Złe hasło. Najpopularniejszy błąd. Oznacza atak, złośliwe zgadywanie hasła albo... zwykłą literówkę przy logowaniu.
- `0xC0000064` – Konto nie istnieje. Ktoś próbuje wejść na użytkownika, którego w ogóle nie ma na tym komputerze.
- `0xC0000234` – Konto zablokowane. Atakujący wpisywał złe hasło tak długo, aż system odpalił ochronę z Zasad Blokady Konta.

W podanym logu widoczny jest kod `0xC000006A`, co świadczy o błędnym haśle. Jeśli jednak widzisz, że obcy adres IP generuje błąd `0xC000006A` po kilkanaście razy na sekundę – masz 100% pewności, że trwa automatyczny atak siłowy (Brute-Force). Rozwiązanie? Szybka blokada tego IP w Zaporze sieciowej (Firewall).

  </div>
</data-tabs>

<details>
<summary>🧰 Wyciąganie logów w PowerShell</summary>

Przeklikiwanie się przez setki wpisów w powolnym Podglądzie Zdarzeń to katorga. Znacznie szybciej wyciągniesz te dane krótkim skryptem w konsoli. 

> [!IMPORTANT]
> Dziennik Zabezpieczeń (Security) jest zablokowany dla zwykłych kont. Skrypt zadziała tylko wtedy, gdy **uruchomisz PowerShell jako Administrator**. Zwykły użytkownik dostaje z automatu odmowę dostępu (którą tutaj celowo ukryłem parametrem `-ErrorAction SilentlyContinue`, żeby nie sypać na czerwono w terminalu).

Poniższy kod filtruje błędne logowania z ostatnich $24$ godzin i formuje z nich prostą tabelę. Pobieramy wartości bezpośrednio po sztywnych numerach indeksów ze struktury XML:

![Skrypt get-winevent-4625-zabezpieczenia.png](/public/courses/windows-11/Images/skrypt-get-winevent-4625-zabezpieczenia.png)

```powershell
Get-WinEvent -FilterHashtable @{
    LogName   = 'Security'
    Id        = 4625
    StartTime = (Get-Date).AddHours(-24)
} -ErrorAction SilentlyContinue |
    Select-Object TimeCreated,
        @{n='Konto';     e={$_.Properties[5].Value}},
        @{n='IP';        e={$_.Properties[19].Value}},
        @{n='TypLog';    e={$_.Properties[10].Value}} |
    Format-Table -AutoSize
```

> [!NOTE]
> **Skąd wzięły się indeksy 19 i 10?**
> W starym Windows 10 adres IP miał indeks $18$, a Typ Logowania $9$. W Windows 11 Microsoft wcisnął w środek struktury `4625` nowe pole – `FailureReason` – przez co wszystko pod nim przesunęło się w tablicy o jeden w dół. Opieranie się na sztywnych indeksach to oczywiście brudny hack, ale przy pisaniu jednorazowych komend na kolanie to po prostu najszybsza metoda.

> [!TIP]
> Jeśli konsola ma prawa admina, a po puszczeniu skryptu widzisz absolutną pustkę – system po prostu nie zarejestrował żadnego nieudanego logowania w tym czasie. Upewnij się, że opcja audytu jest włączona w `secpol.msc` i została zastosowana (zmiany w `secpol.msc` i `gpedit.msc` stosowane są prz logowaniu ale możesz je wymusić wpisując w konsoli: `gpupdate /force`).
</details>

### 🔐 Konfiguracja inspekcji obiektów

Włączenie globalnej „Inspekcji dostępu do obiektów” w `secpol.msc` to tylko pierwszy krok. System mieli w tle setkami tysięcy plików operacyjnych. Gdyby Windows logował dostęp do każdego z nich, zajechałby dysk twardy w kilka minut. Dlatego musisz ręcznie wskazać mu konkretny plik-pułapkę, który ma wziąć na celownik.

Jak to skonfigurować i przetestować w praktyce? Wyobraź sobie plik tekstowy, do którego dostęp chcemy ściśle śledzić.

1. Klikasz na plik prawym przyciskiem myszy i wybierasz <kbd class="win-menu-btn">Właściwości</kbd> → <kbd class="win-menu-btn">Zabezpieczenia</kbd> → <kbd class="win-menu-btn">Zaawansowane</kbd>.
2. Przechodzisz do zakładki **Inspekcja** i klikasz przycisk <kbd class="win-menu-btn">Dodaj</kbd>.
3. Jako Podmiot wybierasz konkretnego użytkownika (na zrzucie ekranu jest to konto `test`) lub po prostu *Wszyscy*.  
Typ zmieniasz na _**Wszystko**_ (aby wyłapać zarówno sukcesy, jak i niepowodzenia), a w uprawnieniach zaznaczasz np. *Odczyt i wykonywanie*.

![Przygotowanie pliku do sprawdzenia działania inspekcji dostępu do obiektu](/public/courses/windows-11/Images/Przygotowanie-pliku-do-sprawdzenia-działania-inspekcji-dostępu-do-obiektu.png)

Teraz system ma ten plik na radarze. Aby wygenerować sztuczny ruch, logujemy się na konto `test` w nowym oknie konsoli:

```cmd
runas /user:test cmd
```

Następnie w nowym oknie konsoli próbujemy odczytać plik poleceniem `type`:

```cmd
cd /d "d:\Nowy folder"
type "Nowy Dokument tekstowy.txt"
```

Gdy tylko obcy proces (w tym wypadku `cmd.exe`) dobierze się do zawartości, system natychmiast wyrzuci serię wpisów w Podglądzie Zdarzeń:

![Sukcesy inspekcji 4663 4656 i jedno niepowodzenie inspekcji 4565 na kategorii zadań File System](/public/courses/windows-11/Images/2-sukcesy-inspekcji-4663-4656-i-jedne-niepowodzenie-inspekcji-4565-na-kategorii-zadania-File-System.png)

Kluczowe numery logów (Kategoria zadań: File System), których powinieneś szukać:
- **4656** – Informacja techniczna: ktoś (lub jakiś proces) poprosił system o uchwyt (Handle) do pliku.
- **4663** – Absolutny „dowód zbrodni”. Podjęto próbę konkretnej operacji na obiekcie. Jak widzisz na screenie wyżej, log bezbłędnie wyłapał dokładną nazwę konta (`test`) oraz ścieżkę do procesu (`C:\Windows\System32\cmd.exe`), który odczytał dokument. Intruz złapany za rękę!

<data-gate>
  <data-connection-matcher title="Zarządzanie bezpieczeństwem kont i inspekcją">
    <div class="cmw-item" data-left="Chcesz zapobiec atakom słownikowym poprzez uniemożliwienie powrotu do starych haseł." data-right="Ustawienie zasady `Wymuszaj tworzenie historii haseł` na np. 24 zapamiętane hasła."></div>
    <div class="cmw-item" data-left="Atakujący wykonuje zautomatyzowany atak Brute-Force na konkretne konto na serwerze." data-right="Wygenerowany zostanie ogromny ciąg zdarzeń o Event ID 4625 z kodem błędu 0xC000006A."></div>
    <div class="cmw-item" data-left="Pracownik notorycznie podaje błędne hasło (np. włączony <kbd>Caps Lock</kbd>) blokując sobie konto." data-right="Odpowiednia konfiguracja zasady `Wyzeruj licznik blokady konta po` pozwoli ominąć zatory w Helpdesku."></div>
    <div class="cmw-item" data-left="Podejrzewasz, że nieznany proces czyta poufne dokumenty dyrekcji na dysku twardym." data-right="Włączenie Event ID 4663 w zakładce Zabezpieczenia dla konkretnego pliku po włączeniu polisy."></div>
  </data-connection-matcher>
</data-gate>

---

## 🗄️ 2. Rejestr Systemowy (`regedit.exe`) – prawdziwa twarz systemu

Rejestr to hierarchiczna baza danych przechowywana jako pliki binarne (zwane *Hive*), które Jądro Windowsa mapuje na wirtualne drzewo podczas bootowania. Wszystko co system „wie" o sobie – sterowniki, konfiguracja aplikacji, preferencje użytkownika, polityki bezpieczeństwa – żyje w Rejestrze.

| Gałąź | Skrót | Co przechowuje | Plik fizyczny |
| :--- | :--- | :--- | :--- |
| HKEY_LOCAL_MACHINE | HKLM | Cała konfiguracja maszyny | `C:\Windows\System32\config\` |
| HKEY_CURRENT_USER | HKCU | Konfiguracja zalogowanego użytkownika | `%UserProfile%\NTUSER.DAT` |
| HKEY_CLASSES_ROOT | HKCR | Skojarzenia plików i COM | Połączenie HKLM + HKCU |
| HKEY_USERS | HKU | Profile wszystkich użytkowników | Wiele plików NTUSER.DAT |

> [!CAUTION]
> Przed modyfikacją rejestru zaleca się jego pełen eksport. Zwróć uwagę, czy przed kliknięciem w menu <kbd class="win-menu-btn">Plik</kbd> → <kbd class="win-menu-btn">Eksportuj</kbd> masz wybraną gałąź Komputer. W przeciwnym wypadku wyeksportujesz tylko daną gałąź kluczy. 
> Przy niektórych gałęziach podanie złej wartości sprawi, że system się nie uruchomi. 
> Taki kilkusetmegabajtowy plik `.reg` (w moim wypadku $543\text{ MB}$) zapisz koniecznie na pendrivie. Po kilku nieudanych próbach uruchomienia Windows zwykle automatycznie przełączy się do środowiska odzyskiwania WinRE (klawisz <kbd>F8</kbd> został domyślnie wyłączony w nowszych systemach by przyspieszyć bootowanie). Z poziomu WinRE możesz uruchomić wiersz polecenia i przywrócić poprawny rejestr z pendrive'a!


### 🧪 Edycja Hex zapisu gry Jelly Drift

Często gry stworzone na silniku Unity zapisują postępy lokalnie w Rejestrze Windows wykorzystując `PlayerPrefs`.  
Tak samo jest w przypadku *Jelly Drift*. Naszym celem będzie zwiększenie ilości posiadanej waluty.

Link do gry: [Jelly Drift by Dani Dev - itch.io](https://danidev.itch.io/jelly-drift)

Wiele aplikacji desktopowych zapisuje swoją konfigurację właśnie w gałęzi **`HKEY_CURRENT_USER`** → **`Software`** → _**`NazwaProducenta`**_ → *`NazwaProduktu`*. Przykładem może być chociażby Discord, Blender czy właśnie nasza gierka z itch.io.

1. Uruchom grę, aby utworzyła pliki zapisu w Edytorze Rejestru. Czasem może być konieczne ukończenie wyścigu, meczu czy poziomu albo ręczny zapis lub checkpoint. Sprawdź czy klucz się utworzył:
   ```yaml
   Komputer\HKEY_CURRENT_USER\Software\Dani\Jelly Drift
   ```
   W zależności od tego jak developer gry i developerzy unity zrealizowali implementację zapisu możesz tu napotkać wiele pojedynczych wartości REG_DWORD lub jak w tym przypadku jednej długiej wartości REG_BINARY.
   Wtedy dane są tu przechowywane w postaci ciągu szesnastkowego (Hex), a nie jako edytowalna liczba decymalna.
   ![Lokalizacja klucza i wartości Jelly Drift w regedit](/public/courses/windows-11/Images/lokalizacja-klucza-iwartości-jelly-drift-w-regedit.png)

2. Aby nie męczyć się z edycją pliku binarnego na oślep wyeksportujemy go. 😉  
   - Zaznacz klucz **Jelly Drift** w drzewie po lewej stronie. 
   - Z górnego menu wybierz <kbd class="win-menu-btn">Plik</kbd> → <kbd class="win-menu-btn">Eksportuj</kbd> i zapisz klucz jako plik `.reg` na pulpicie.

   ![Eksport klucza rejestru z programu Jelly Drift](/public/courses/windows-11/Images/export-klucza-rejestru-jelly-drift.png)
   > Zwróć uwagę na wartość widoczną na dole okna. Musisz mieć zaznaczoną konkretną gałąź rejestru, żeby nie wyeksportować przypadkiem całego drzewa. Pole z wybraną ścieżką powinno automatycznie ustawić się zgodnie z tym, który klucz został wybrany w drzewie.  

3. Otwórz zapisany plik `.reg` w Notatniku. Odszukaj zmienną ze stanem gry. Zaznacz cały ciąg znaków szesnastkowych przypisany do tej zmiennej i skopiuj go do schowka. (Uwaga: `=hex:` tej wartości nie kopiuj. Interesuje nas to co jest po dwukropku 😉)

![Edycja eksportu klucza rejestru w notatniku i zaznaczenie wartości hexadecymalnej](/public/courses/windows-11/Images/edycja-exportu-klucza-rejestru-wnotatniku-i-zaznaczenie-wartości-hexadecymalnej.png)

4. Otwórz narzędzie [CyberChef](https://gchq.github.io/CyberChef/). Wklej skopiowany ciąg w oknie Input i wybierz operację **From Hex**. Narzędzie zdekoduje szesnastkowy ciąg znaków do postaci tekstowego pliku XML.

5. Skopiuj wynikowy XML z okna Output i wklej go do nowego okna Notatnika. Wciśnij <kbd>Ctrl</kbd> + <kbd>F</kbd>, aby szybko wyszukać znacznik `<money>`. Zmień znajdującą się tam wartość na `9999999`.

![CyberChef - konwersja z HEX, skopiowanie wyniku do notatnika i wyszukiwanie wartości money w XML](/public/courses/windows-11/Images/cyberChef-konwersja-from-hex-skopiowanie-wyniku-do-notatnika-i-wyszukanie-wartości-money-w-xml.png)

> [!TIP]
> **Koszmar optymalizacyjny**
> Przeanalizuj ten XML na zrzucie ekranu z *CyberChefa* – to podręcznikowy przykład, jak **_NIE_** projektować systemów zapisu.
> 
> Zwróć uwagę na potężny narzut składniowy domyślnego serializatora XML w C#. Aby zapisać najprostszą wartość prawda/fałsz (wymagającą w teorii 1 bita), gra marnuje kilkanaście bajtów na tasiemcowy tag `<boolean>false</boolean>`. W połączeniu z deklaracją `utf-16` (które rezerwuje dwa bajty na każdy znak, wstawiając w angielskim tekście puste zera) daje to gigantyczne pompowanie pliku. Surowe dane ważące 300 bajtów rozrastają się do kilkunastu kilobajtów! W małej grze to bez znaczenia, ale w większych produkcjach zapisywanie takich molochów do plików powoduje zauważalne zacinanie się gry (*stutter*) podczas autozapisu. Mądry deweloper użyłby tu lekkiego formatu JSON z wymuszonym UTF-8. 😁

6. Skopiuj zmodyfikowany kod XML z Notatnika z powrotem do CyberChefa (do sekcji Input). Zmień operację na **To Hex**, aby zakodować tekst z powrotem do formatu szesnastkowego.
7. Skopiuj nowy ciąg Hex z okna Output, wróć do pierwszego okna Notatnika (z otwartym plikiem `.reg`) i podmień stary ciąg szesnastkowy na nowy. Zapisz plik.

![Podmiana nowej wartości hex, zapis pliku i import zmodyfikowanego klucza rejestru](/public/courses/windows-11/Images/podmiana-nowej-wartości-hex-zapis-pliku-i-import-zmodyfikowanego-klucza-rejestru.png)

8. Kliknij dwukrotnie na zapisany plik `.reg`, aby zaimportować zmodyfikowany klucz z powrotem do Rejestru Windows. Uruchom grę.

> [!WARNING]
> **Pułapka Integer Overflow (przepełnienie wartości liczbowej)**
> Wpisanie zbyt wysokiej kwoty (np. `999999999`) wywołuje błąd typu Integer Overflow. Gra ma problem ze zdeserializowaniem tak potężnej liczby z XML-a do przypisanego typu zmiennej liczbowej w kodzie. Na zrzucie poniżej (po lewej stronie) widać efekt: gra zgłupiała, ustawiła błędny poziom (Lvl $88$), zresetowała pieniądze do $\text{$}4000$ i zablokowała możliwość rozpoczęcia wyścigu. Prawa strona obrazka pokazuje poprawne zachowanie po podaniu wartości `9999999` – środki zostały poprawnie dodane i pozwoliły na zakup dowolnych ulepszeń (np. niebieskiego lakieru dla auta).

![Dziwny bug gdzie wartość money po przekroczeniu max int zmienia lvl i menu się buguje](/public/courses/windows-11/Images/dziwny-bug-gdzie-wartość-money-po-przekroczeniu-max-int-zmienia-lvl-i-menu-się-buguje-ale-dla-wartości-9999999-wszystkodziała.png)

> PS. W XML są tagi dotyczące odblokowania map i samochodów. Spróbuj je odnaleźć i pozmieniać wartości na `true`.  

### 🚀 Analiza Autostartu – wykrywanie ukrytych intruzów

Złośliwe oprogramowanie uwielbia jeden trick:
Wstrzykniecie się do kluczy autostartu w Rejestrze, żeby uruchomić się przy każdym starcie systemu. Menedżer zadań (zakładka Autostart) często ich nie pokazuje, bo **_rootkit_** celowo ukrywa się przed API Windowsa.

Większość prostego malware pozostawia po sobie ślady właśnie w kluczach autostartu.

Otwórz `regedit.exe` i przejdź do:

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

![Edytor Rejestru otwarty na kluczu Run z wpisami RtkAudUService i SecurityHealth](/public/courses/windows-11/Images/regedit-Run.png)

Na powyższym zrzucie widzisz prawdziwe wpisy autostartu z działającego systemu:

| Nazwa wartości | Dane | Ocena |
| :--- | :--- | :--- |
| `RtkAudUService` | `C:\WINDOWS\System32\DriverStore\...\RtkAudUService64.exe` | ✅ Legitny – sterownik audio Realtek |
| `SecurityHealth` | `%windir%\system32\SecurityHealthSystray.exe` | ✅ Legitny – ikona Windows Security w zasobniku |

W tym przypadku wszystko jest w porządku. Jak wygląda podejrzany wpis? 🤔 

#### Przykładowe sygnały alarmowe:

```
Nazwa: xkj7238d
Dane: C:\Users\Admin\AppData\Local\Temp\update.vbs
```

- Losowa nazwa (nie nazwa programu)
- Ścieżka w `%Temp%` lub `%AppData%`
- Plik `.vbs`, `.ps1`, lub `.bat` zamiast `.exe` z rozpoznawalnym programem

Jeśli znajdziesz coś podejrzanego: PPM na wartości → **Usuń**. Wirus straci mechanizm przetrwania przy restarcie.

Sprawdź też te lokalizacje – to one najczęściej służą jako „schronienie” zarówno dla legitnych programów, jak i złośliwego oprogramowania:

<data-tabs>
  <tabs>
    <item>Klucz Run</item>
    <item>Klucze RunOnce</item>
  </tabs>
  <div>

**Ścieżka:** 
```yaml
HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

To ulubione miejsce programów, które instalują się w profilu użytkownika (omijając UAC). Będą się uruchamiać automatycznie tylko dla aktualnie zalogowanego użytkownika. 
<b>Wartości wyciągnięte z mojego własnego kompa:</b>

- Trzy legitne wpisy z `Program Files`:
  - *Steam*: domyślnie tworzy ten wpis, aby odpalać się w tle (`-silent`) i od razu wyszukiwać aktualizacji gier.
    ```cmd
    "C:\Program Files (x86)\Steam\steam.exe" -silent
    ```
  - *EpicGamesLauncher*: podobnie jak Steam, dąży do ciągłej gotowości w tle.
    ```cmd
    "C:\Program Files\Epic Games\...\EpicGamesLauncher.exe" -silent -launchcontext=boot
    ```
  - *Microsoft Edge*: ładuje niezbędne procesy bez otwierania okna (`--no-startup-window`), aby przy kliknięciu ikony wystartować błyskawicznie.
    ```cmd
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --no-startup-window --win-session-start
    ```

- Dwa legitne wpisy z `AppData`:
  - *Discord*: domyślnie dodaje się, aby przy starcie komputera sprawdzić dostępność nowej wersji (`Update.exe`) i odpalić komunikator w tle.
    ```cmd
    "C:\Users\user\AppData\Local\Discord\Update.exe" --processStart Discord.exe
    ```
  - *LocalSend*: nasłuchuje w sieci lokalnej w tle (`--hidden`), by stale być w gotowości na odbiór plików ze smartfona.
    ```cmd
    "C:\Users\user\AppData\Local\Programs\LocalSend\localsend_app.exe" --hidden
    ```

> [!IMPORTANT]
> **Dlaczego widzisz je w Rejestrze, skoro wyłączyłeś je w Autostarcie?!** 😡  
> Wyłączenie programu w zakładce Autostart w Menedżerze Zadań wcale nie kasuje jego wpisu z `Run`! Windows tworzy obok podklucz `StartupApproved\Run`, gdzie nadaje programowi status zablokowanego. Rejestr (klucz Run) przechowuje więc fizyczne wpisy deweloperów aby w przypadku ponownego włączenia dla autostartu wiedzieć co i z jakimi parametrami uruchomić. 😜

> [!WARNING]
> Wirusy uwielbiają ten klucz, ponieważ **nie wymaga praw administratora** do zapisu!

  </div>
  <div>

**Ścieżki:**
```yaml
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce
```

Klucze typu `RunOnce` (Uruchom Raz) działają na innej zasadzie – program umieszcza w nich swój wpis i **czeka na następne logowanie użytkownika** (najczęściej następujące po restarcie systemu). W trakcie tego logowania Windows wykonuje polecenie, a następnie automatycznie usuwa wpis z Rejestru.

Złapany przed restartem wpis z mojego systemu:

- **MS Edge WebView**:
  ```cmd
  "C:\Program Files (x86)\Microsoft\EdgeWebView\Application\149.0.4022.69\Installer\setup.exe" --msedgewebview --delete-old-versions --system-level --verbose-logging --on-logon
  ```
  **Dlaczego Edge zostawia śmieci, które trzeba usuwać przy reboocie?**  
  Odpowiedź kryje się w architekturze Windows 11. Silnik przeglądarki Edge (WebView2) jest wykorzystywany przez wiele elementów interfejsu, takich jak systemowe Widżety czy różnego rodzaju usługi w tle. W przeszłości część komponentów powiązanych np. z **Menu Start** korzystała również z technologii *React Native for Windows* (co tłumaczy powszechne narzekania na lagi... a mogli pisać w Vue. Hehe, żartuję, only C++ 💪🏼).  
  
  **Skutek blokady:**  
  Skoro interfejs systemu cały czas korzysta z silnika WebView2, jego pliki bywają zablokowane przez działające procesy systemowe. Instalator nowej wersji Edge używa opcji `--delete-old-versions` i umieszcza ją w `RunOnce`. Przy następnym logowaniu użytkownika (zanim część komponentów korzystających z WebView2 zdąży ponownie zablokować stare pliki) instalator usuwa niepotrzebne wersje, a wpis samoczynnie znika z Rejestru.

> [!WARNING]
> **🔥 Fast Startup może zablokować wykonanie RunOnce!**
> Zwykłe wyłączenie Windowsa z aktywnym *Fast Startup* to nie jest pełen reset – to jedynie wylogowanie użytkownika i **hibernacja jądra** (co omawialiśmy w Module 1). 
> 
> Aby mieć pewność wykonania wpisów oczekujących na ponowne uruchomienie, należy użyć opcji **Restart**. Wyłączenie komputera przy aktywnym Fast Startup może nie uruchomić wszystkich mechanizmów oczekujących na pełny restart systemu.
> 
> Właśnie dlatego instalatory oprogramowania rzadko mówią *"Wyłącz i włącz komputer"*, tylko precyzyjnie wymuszają: **"Uruchom ponownie (Restart)"**. Daje to 100% pewności na poprawne wykonanie poinstalacyjnych porządków.

Ponieważ wpisy `RunOnce` są automatycznie usuwane po wykonaniu, klucze te (zarówno w gałęzi `HKLM` jak i `HKCU`) przez większość czasu pozostają puste. Długotrwale zalegające wpisy są nietypowe i mogą wskazywać na błąd instalatora, nieudaną aktualizację lub (w niektórych przypadkach) mechanizm utrwalania obecności złośliwego oprogramowania (tzw. „persistence”).

  </div>
</data-tabs>

<data-gate>
  <data-quiz>
    <question>Dlaczego złośliwe oprogramowanie (np. trojany) tak chętnie wykorzystuje gałąź HKCU w kluczu Run do utrwalenia swojej obecności w systemie?</question>
    <options>
      <item correct>Klucze w HKCU ładują program przy logowaniu profilu i kompletnie nie wymagają uprawnień administratora do modyfikacji.</item>
      <item>Klucze w HKLM są ignorowane przez systemy Windows 11 i zastępowane przez bezpieczną zakładkę Autostart w Menedżerze.</item>
      <item>Wpisy dodane w HKLM wykonują się jednorazowo przy restarcie, podczas gdy te z HKCU są trwale i niemożliwe do usunięcia.</item>
    </options>
    <div data-hint="error">
      Zastanów się nad restrykcjami. Czy zwykły pracownik (Konto Standardowe) może modyfikować ustawienia systemowe, a czy może własne?
    </div>
    <div data-hint="success">
      Świetnie! Zapis do `HKEY_LOCAL_MACHINE` wymaga podniesienia uprawnień (UAC). Zmiana w `HKEY_CURRENT_USER` przebiega po cichu w tle.
    </div>
  </data-quiz>
</data-gate>

---


## 🧰 Projekt: Konfiguracja Stanowiska Publicznego

Stanowiska komputerowe w miejscach publicznych (szkoły, biblioteki, kawiarnie internetowe) są narażone na ciągłe próby modyfikacji konfiguracji lub wręcz celowego sabotażu. Administrowanie takim środowiskiem wymaga wyważenia dostępności – użytkownicy muszą móc pracować – z rygorystycznym bezpieczeństwem.

### ⚖️ Analiza wektorów ataku: Czy samo konto wystarczy?

Zanim zaczniesz konfigurować system, przeanalizuj dostępne rodzaje kont lokalnych i ich wbudowane ograniczenia.

<data-tabs>
  <tabs>
    <item>Tryb Kiosku (Assigned Access)</item>
    <item>Konto Standardowe</item>
  </tabs>
  <div>

**Scenariusz:** Konfigurujesz wbudowany w Windows 11 **Tryb Kiosku**.

- Mechanizm *Assigned Access* pozwala przypisać do konta uruchamianie **tylko jednej konkretnej aplikacji** (np. Microsoft Edge w trybie pełnoekranowym), która ładuje się automatycznie po zalogowaniu, z pominięciem klasycznego pulpitu (powłoki `explorer.exe`).
- W tym trybie użytkownik jest całkowicie odcięty od systemu plików, wiersza poleceń czy Panelu Sterowania. Zablokowane są też standardowe skróty klawiszowe.
- **Wniosek:** Tryb Kiosku to najbezpieczniejsze rozwiązanie dla informatorów cyfrowych czy terminali przeglądarkowych. Nie nadaje się jednak do sali komputerowej, w której użytkownik potrzebuje dostępu do wielu programów i swobodnej pracy z plikami na pulpicie.

  </div>
  <div>

**Scenariusz:** Tworzysz **Konto Standardowe** (bez uprawnień administratora) na potrzeby pracowni komputerowej. Użytkownik otrzymuje dostęp do klasycznego pulpitu. Nie zna hasła admina, co uniemożliwia mu pokonanie alertów kontroli konta (UAC).

Co domyślnie może zrobić taki użytkownik bez dodatkowych restrykcji?

- ✅ **Instalować oprogramowanie (Per-User).** To największy mit Konta Standardowego. Brak uprawnień blokuje tylko instalacje w folderze systemowym `C:\Program Files`. Użytkownik może bez problemu pobierać z internetu i instalować programy w swoim profilu `%LocalAppData%` (w ten sposób instaluje się np. Discord, Chrome, Spotify czy Visual Studio Code).
- ✅ Otwierać konsolę CMD i PowerShell, z prawem do uruchamiania większości poleceń i skryptów w obrębie swoich uprawnień.
- ✅ Zmieniać ustawienia wizualne (tapety), dźwiękowe i językowe systemu.
- ✅ Manipulować ułatwieniami dostępu (np. włączając głośnego Narratora czy Tryb wysokiego kontrastu).

**Wniosek:** Konto Standardowe daje podstawową izolację przestrzeni dyskowej, ale **nie chroni** konfiguracji wizualnej ani nie blokuje instalacji oprogramowania per-user. Wymaga rygorystycznego "dokręcenia śrub" przez zasady `gpedit.msc`.

  </div>
</data-tabs>

---

## 🔍 Geneza: Ekran logowania jako główny punkt ataku

Ekran logowania to pierwsza i najsłabsza linia obrony w systemie Windows. Znajomość historycznych wektorów ataku pozwala zrozumieć, dlaczego fizyczny dostęp do komputera jest tak niebezpieczny.

### Atak przez Klawisze Trwałe (Sticky Keys)

W starszych systemach (Windows XP/7/8) istniała potężna luka:

1. Atakujący uruchamia komputer z narzędziowego pendrive'a (np. dystrybucji Linux LiveCD).
2. Otwiera partycję z systemem Windows.
3. Usuwa oryginalny plik `sethc.exe` (Klawisze Trwałe). Następnie kopiuje plik `cmd.exe` do katalogu, w którym znajdował się `sethc.exe`, i nadaje kopii nazwę `sethc.exe`.
4. Uruchamia ponownie komputer i czeka na ekran logowania.
5. Naciska klawisz <kbd>Shift</kbd> pięć razy z rzędu.
6. System uruchamia ukrytą **konsolę CMD z najwyższymi uprawnieniami (SYSTEM)**.
7. Wpisanie polecenia `net user Administrator NoweHaslo` oddaje atakującemu pełną kontrolę nad maszyną.

### Luki środowiska instalatora (OOBE)

Środowisko OOBE (*Out Of Box Experience*) odpowiada za pierwszą konfigurację systemu. Zanim kreator wymusi utworzenie konta użytkownika, naciśnięcie kombinacji <kbd>Shift</kbd> + <kbd>F10</kbd> otwiera konsolę wiersza poleceń z uprawnieniami **SYSTEM**.

Ta ukryta funkcja diagnostyczna istnieje nadal w instalatorze Windows 11. Każda osoba posiadająca oryginalny, podpisany instalator na pendrive ma pełny dostęp do odczytu i modyfikacji nieszyfrowanego BitLockerem dysku.

### Dostęp z zewnątrz (Linux vs NTFS)

Systemy Linux posiadają natywne wsparcie dla formatu NTFS używanego przez Windows. Uruchomienie komputera z linuksowego pendrive'a daje swobodę edycji wszystkich plików systemowych. Narzędzia kryptograficzne takie jak `chntpw` potrafią wyzerować hasło dowolnego konta w kilkadziesiąt sekund.

Ochrona przed bootowaniem z zewnętrznych nośników w Windows 11 zależy od środowiska:

| Mechanizm | Działanie w praktyce |
| :--- | :--- |
| **Secure Boot (UEFI)** | Teoretycznie blokuje nieautoryzowane systemy operacyjne. W praktyce instalatory popularnych dystrybucji Linuksa (np. Ubuntu, Fedora) **posiadają certyfikaty kryptograficzne od Microsoftu**. Secure Boot ładuje je bez najmniejszego oporu. |
| **BitLocker** | To jedyna skuteczna ochrona fizyczna. **Szyfruje całą zawartość dysku**. Obcy system uruchomiony z pendrive'a widzi jedynie cyfrowy szum, aż do podania klucza odzyskiwania. |
| **Problem wersji Home** | Windows 11 Home nie oferuje klasycznego BitLockera. Posiada „Szyfrowanie Urządzenia”, które aktywuje się wyłącznie na nowym sprzęcie (wymaga TPM i Modern Standby) i wymusza zalogowanie Kontem Microsoft. Starsze komputery i sprzęty poleasingowe często tego nie obsługują. Ich dyski pozostają całkowicie otwarte na edycję. |

> [!WARNING]
> Kluczowa zasada bezpieczeństwa: **jeśli dysk nie jest zaszyfrowany, to intruz z fizycznym dostępem do urządzenia całkowicie je przejmuje**. Wszelkie restrykcje zdefiniowane w `gpedit.msc` są egzekwowane wyłącznie przez działający system Windows (zarówno na ekranie logowania, jak i po zalogowaniu). Atakujący, uruchamiając własny system z pendrive'a, całkowicie je omija, ponieważ instalacja Windows jest w tym czasie wyłączona.

---

## ⚙️ Metoda działania: Restrykcje za pomocą gpedit.msc

Narzędzie `gpedit.msc` (Edytor lokalnych zasad grupy) to podstawowy oręż administratora. W przeciwieństwie do `secpol.msc` (skupiającego się na hasłach i logowaniu), edytor GPO pozwala na głęboką ingerencję w interfejs użytkownika, dostępność narzędzi oraz restrykcje uruchamiania aplikacji.

Aby uruchomić edytor, użyj skrótu <kbd>Win</kbd> + <kbd>R</kbd> i wpisz `gpedit.msc`.

Zasady zgrupowane są w dwóch głównych sekcjach:
- **Konfiguracja komputera (Computer Configuration):** Aplikowana przez usługi systemu. Działa globalnie na całą maszynę (w tym na ekran logowania).
- **Konfiguracja użytkownika (User Configuration):** Aplikowana w momencie logowania. Działa wyłącznie w obrębie sesji konkretnego konta.

<data-tabs>
  <tabs>
    <item>🎨 Personalizacja</item>
    <item>🔧 Narzędzia</item>
  </tabs>
  <div>

### Ochrona wizualna systemu

Ograniczenie personalizacji zapobiega umieszczaniu niestosownych grafik na pulpitach stanowisk publicznych i zachowuje ich profesjonalny wygląd.

**Ścieżka:** <kbd class="win-menu-btn">Konfiguracja użytkownika</kbd> → <kbd class="win-menu-btn">Szablony administracyjne</kbd> → <kbd class="win-menu-btn">Panel sterowania</kbd> → <kbd class="win-menu-btn">Personalizacja</kbd>:

| Zasada | Ustawienie | Wpływ na system |
| :--- | :--- | :--- |
| <span style="text-wrap:nowrap">Zapobiegaj zmienianiu tła pulpitu</span> | **Włączone** | Nie da się już zmienić tła z menu kontekstowego pliku obrazu oraz <kbd class="win-menu-btn">Personalizacja</kbd> > <kbd class="win-menu-btn">Tło</kbd> ma wyszarzone opcje z komunikatem *„Niektórymi z tych ustawień zarządza Twoja organizacja.”*|
| <span style="text-wrap:nowrap">Zapobiegaj zmienianiu wygaszacza ekranu</span> | **Włączone** | Przechodząc do <kbd class="win-menu-btn">Personalizacja</kbd> > <kbd class="win-menu-btn">Ekran blokady</kbd> i klikając w **Wygaszacz ekranu** pojawi się okienko z komunikatem *„Administrator systemu wyłączył; uruchamianie apletu Ekranu w Panelu Sterowania”*|
| <span style="text-wrap:nowrap">Zapobiegaj zmienianiu kompozycji</span> | **Włączone** | <kbd class="win-menu-btn">Personalizacja</kbd> > <kbd class="win-menu-btn">Kompozycje</kbd> zablokowaniu ulegnie jedynie wybór gotowych kompozycji Windowsa|
| <span style="text-wrap:nowrap">Zapobiegaj zmienianiu kolorów i wyglądu</span> | **Włączone** | <kbd class="win-menu-btn">Personalizacja</kbd> > <kbd class="win-menu-btn">Kolory</kbd> wszystko jest wyszarzone i niedostępne. Poza trybem wysokiego kontrastu |

**Wymuszenie jednolitej tapety dla wszystkich:**

Zamiast tylko blokować zmianę, możesz z góry narzucić konkretny plik graficzny jako niemożliwe do usunięcia tło.

**Ścieżka:** <kbd class="win-menu-btn">Konfiguracja użytkownika</kbd> → <kbd class="win-menu-btn">Szablony administracyjne</kbd> → <kbd class="win-menu-btn">Pulpit</kbd> → <kbd class="win-menu-btn">Active Desktop</kbd> → _**Tapeta pulpitu**_

1. Zmień stan na **Włączone**.
2. Wpisz bezwzględną ścieżkę do pliku, np.: `C:\Windows\Web\Wallpaper\ThemeC\img30.jpg`

![Ustawienie tapety pulpitu za pomocą Edytora lokalnych zasad grupy](/public/courses/windows-11/Images/gpedit-pulpit-theme.png)

> [!IMPORTANT]
> **Dwubiegunowość Windowsa**
> Często można się złapać na pisaniu w konfiguracji systemowej nazw katalogów z lokalizacją, tak jak widzi się je w Eksploratorze (np. `...\Wallpaper\Wschód słońca\...`). Windows posiada mechanizm tłumaczenia nazw wyświetlanych (za pomocą ukrytego pliku `desktop.ini`), ale fizyczna, systemowa nazwa katalogu to w tym wypadku `ThemeC`. Konfigurując system poprzez `gpedit` i Rejestr, musisz bezwzględnie używać prawdziwych (fizycznych) nazw ścieżek! Dlatego gdy chcesz prawdziwą ścieżkę do pliku lub katalogu to kliknij PPM na niego i wybierz <kbd class="win-menu-btn">Kopiuj jako ścieżkę</kbd>. Uzyskasz poprawną ścieżkę zamkniętą w podwójnym cudzysłowie `"`.
> 
> W przypadku grup systemowych jest odwrotnie 😅. Przykładowo w polskim Windowsie należy używać zlokalizowanych nazw zgodnych z językiem systemu (czyli grupa będzie się nazywać `Administratorzy`, a nie `Administrators`).

> [!TIP]
> W środowisku domenowym (Active Directory) ścieżka do tapety powinna prowadzić do udziału sieciowego z uprawnieniami tylko do odczytu (np. udział `NETLOGON`). Gwarantuje to, że użytkownik nie podmieni pliku graficznego bezpośrednio na dysku komputera.

  </div>
  <div>

### Ograniczenie narzędzi administracyjnych

Zwykły użytkownik nie powinien mieć dostępu do konsoli systemowych. Bez tego zabezpieczenia, nawet na koncie o ograniczonych uprawnieniach, można uruchamiać lokalne, szkodliwe skrypty.

**Ścieżka:** Konfiguracja użytkownika → Szablony administracyjne → **System**

| Zasada | Ustawienie | Wpływ na system |
| :--- | :--- | :--- |
| Zapobiegaj dostępowi do wiersza polecenia | **Włączone** | Próba otwarcia `cmd.exe` kończy się komunikatem o blokadzie nałożonej przez administratora. <br> *Czy zapobiegać również przetwarzaniu skryptów wiersza polecenia?*: Wybranie **Tak** blokuje również pliki wsadowe (`.bat` i `.cmd`). |
| Zapobiegaj dostępowi do narzędzi edycji rejestru | **Włączone** | Blokuje wywołanie programu `regedit.exe`. <br> *Czy wyłączyć pracę programu regedit w trybie cichym?*: Chodzi o to że regedit może być wywoływany przez inne programy w trybie cichym (`-Silent`). |

Zmiany są natychmiastowe i nie musisz używać `gpupdate /force`. O dziwo blokadzie uległo jedynie cmd a powershell jest dalej dostępny.

![Blokada dostępu do narzędzi systemowych za pomocą Edytora lokalnych zasad grupy](/public/courses/windows-11/Images/gpedit-blokada-cmd-i-regedit.png)

  </div>
</data-tabs>

<data-gate>
  <data-connection-matcher title="Restrykcje Stanowiska Publicznego">
    <div class="cmw-item" data-left="Musisz zapobiec uruchamianiu szkodliwych skryptów `.bat` pobranych z internetu." data-right="Aktywacja zasady `Zapobiegaj dostępowi do wiersza polecenia` z parametrem **Tak**."></div>
    <div class="cmw-item" data-left="Komputer ma pełnić rolę bezpiecznego punktu informacyjnego z dostępem tylko do jednej aplikacji." data-right="Najlepiej sprawdzi się tu Tryb Kiosku (Assigned Access) pomijający klasyczny pulpit."></div>
    <div class="cmw-item" data-left="Użytkownicy złośliwie zamieniają tapety z wykorzystaniem menu kontekstowego systemu." data-right="Włączenie zasady `Zapobiegaj zmienianiu tła pulpitu` w Konfiguracji użytkownika w `gpedit.msc`."></div>
    <div class="cmw-item" data-left="Atakujący ma fizyczny dostęp do niezabezpieczonego komputera z dyskiem w formacie NTFS." data-right="Może wyzerować hasło lokalne wykorzystując narzędzia z dystrybucji Linux LiveCD."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Architektura zarządzania zasadami:** Jądro czyta wartości prosto z Rejestru i bazy zabezpieczeń. `secpol.msc` i `gpedit.msc` to po prostu wygodne narzędzia do edycji tych plików. Tradycyjne Ustawienia Windows leżą na samym dole hierarchii – Jądro zignoruje je przy każdym konflikcie z polisami. 🏗️
- **Zasady haseł i blokady:** W `secpol.msc` narzucasz długość hasła i odcinasz dostęp po kilku błędach. Bez tego każdy prosty skrypt do Brute-Force uderzy w konta lokalne siłą. 🔐
- **Polityki Audytu i Event ID:** Windows domyślnie milczy o incydentach bezpieczeństwa. Dopiero włączenie audytu logowania sprawia, że logi **4624** i **4625** zaczynają spływać do Podglądu Zdarzeń. Pojawia się błąd 4625 z obcym IP? Masz pewność, że ktoś właśnie włamuje się na maszynę. 👁️
- **Rejestr jako źródło prawdy:** Złośliwy kod najczęściej podpina się pod gałęzie `...\CurrentVersion\Run`, żeby zapewnić sobie start wraz z systemem. Z kolei klucze w poddrzewie `Policies` działają nad głową użytkownika – nadpisują wszystko, co zostało wyklikane w interfejsie graficznym. 🗄️
- **Ochrona stanowiska publicznego i ataki fizyczne:** Brak BitLockera oddaje dysk walkowerem. Wystarczy byle jaki pendrive z Linuxem albo stara sztuczka z Klawiszami Trwałymi, żeby zresetować hasło. Zwykłe Konto Standardowe nie rozwiąże problemu bałaganu w pracowni – musisz ręcznie zablokować CMD, Regedit i personalizację korzystając z `gpedit.msc`. 🛡️

> PS. Jak zobaczysz coś o hakowaniu czy bezpieczeństwie i wspomniane zostanie `netplwiz` to wtrafiłeś na bullshit.
> To narzędzie jest tylko do zarządzania kontami. Reszta to bzdury. 😐

---

Na ten moment zbudowaliśmy solidną obronę pasywną – system zablokuje ataki wykorzystując własne restrykcje. W następnym module przechodzimy do reagowania. Zbudujemy skrypty i wepniemy je w Harmonogram Zadań, żeby sprzęt automatycznie odpierał incydenty bez Twojego udziału. ⚡
