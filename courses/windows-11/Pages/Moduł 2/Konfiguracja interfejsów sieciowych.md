# Konfiguracja interfejsów sieciowych

Na Helpdesku **sieć** to temat numer jeden. Ponad połowa zgłoszeń zaczyna się od słów: *„Nie działa mi internet"*. Zanim zaczniesz przeszukiwać kable i resetować routery, musisz wiedzieć, jak Windows widzi i zarządza połączeniami sieciowymi – bo to właśnie tam najczęściej leży przyczyna.

---

## 🌐 Jak działa połączenie z Internetem?

Zanim przejdziemy do konfiguracji, warto mieć mentalny obraz tego, co się dzieje, gdy klient otwiera stronę `google.com`. Każdy element tego łańcucha może się zepsuć – a Ty musisz wiedzieć, *gdzie* szukać.

####  Łańcuch połączenia (uproszczony):

1. **Karta sieciowa** (_**NIC**_ – *Network Interface Card*) – fizyczny lub wirtualny adapter w komputerze. Ethernet (kabel RJ-45) lub Wi-Fi.
2. **Router / Access Point** – urządzenie w biurze lub domu, które przydziela adresy IP przez _**DHCP**_ (*Dynamic Host Configuration Protocol*) i łączy sieć lokalną z Internetem tłumacząc lokalny adres na publiczny (_**NAT**_ – *Network Address Translation*).
3. **ISP** (*Internet Service Provider*) – dostawca internetu np. Orange, UPC, Play lub bezpośrednio NASK – państwowa jednostka odpowiedzialna za polską część Internetu. To on kontroluje Twoje połączenie ze światem. Jego serwery DNS decydują, jakie strony „widzisz”.
4. **Serwer docelowy** – maszyna gdzieś na świecie, na której siedzi strona WWW lub usługa.

> [!IMPORTANT]
> **ISP to nie neutralny dostawca rury.** Twój dostawca internetu widzi **każde** zapytanie DNS, które wysyłasz (bo domyślnie korzystasz z jego serwerów DNS). Na mocy polskiego prawa, ISP może **blokować dostęp** do określonych domen (np. hazard, piractwo) przez tzw. blokadę DNS – po prostu nie odpowiada na zapytanie lub przekierowuje Cię na stronę z komunikatem o blokadzie.
> Możesz sam sprawdzić [aktualizowaną listę ostrzeżeń CERT](https://cert.pl/lista-ostrzezen/). Lub rejestr zablokowanych w Polsce po ustawie delegalizującej internetowy hazard: [Rejestr zablokowanych domen hazardowych](https://hazard.mf.gov.pl/).

> [!NOTE]
> **Dual-Stack i preferencja IPv6**
> Standardem sieciowym jest obecnie **Dual-Stack** – równoległe działanie IPv4 i IPv6. Zapewnia to obsługę starszych urządzeń, dlatego IPv4 nie zostanie wyłączony.
> 
> Windows (od wersji Vista) domyślnie **preferuje IPv6** (zgodnie z $\text{RFC }6724$). Jeśli router przydzieli globalny adres IPv6, system spróbuje połączyć się w tym standardzie. Jeśli sieć nie obsługuje IPv6 (brak trasowania), Windows od razu skorzysta z IPv4.
> 
> Problemy diagnostyczne pojawiają się przy błędnej konfiguracji: gdy system otrzyma rekord DNS dla IPv6, ale router nie ma do niego trasy. Windows czeka wtedy na upłynięcie limitu czasu (*timeout*) przed przejściem na IPv4, co użytkownik odczuwa jako powolne ładowanie stron.

---

<data-gate>
  <data-quiz>
    <question>Co oznacza skrót ISP i NASK?</question>
    <options>
      <item correct>ISP – Internet Service Provider, NASK – Naukowa i Akademicka Sieć Komputerowa</item>
      <item>ISP – Internetowy Serwis Pogotowia, NASK – Narodowa Agencja Sieci Komputerowej</item>
      <item>ISP – Internet Server Processing, NASK – National Agency for Scientific Computing</item>
    </options>
    <div data-hint="error">
Chodzi o skróty dostawcy internetu oraz polskiej jednostki odpowiedzialnej za krajową domenę internetową .pl i rejestrację nazw w tej domenie, a także za polską część globalnego Internetu. 
    </div>
    <div data-hint="success">
Dokładnie tak!  
**ISP** to skrót od "Internet Service Provider", co po polsku oznacza „dostawca usług internetowych”.  
**NASK** to natomiast skrót od „Naukowa i Akademicka Sieć Komputerowa”, polskiej jednostki odpowiedzialnej za krajową domenę internetową .pl i rejestrację nazw w tej domenie, a także za polską część globalnego Internetu.
    </div>
  </data-quiz>
</data-gate>

---

## 🔍 Podstawowa diagnostyka: ipconfig

To Twoja **pierwsza komenda** przy każdym zgłoszeniu sieciowym. Otwórz okno Uruchom skrótem <kbd class="Win"></kbd> + <kbd>R</kbd>, wpisz `cmd` i zatwierdź klawiszem <kbd>Enter</kbd>, a następnie w konsoli wpisz:

```
ipconfig /all
```

<data-tabs>
  <tabs>
    <item>Co widzisz w wyniku?</item>
    <item>Kluczowe komendy ipconfig</item>
  </tabs>
  <div>

**Anatomia wyniku `ipconfig /all`**

Komenda wyświetla **pełną konfigurację** każdego interfejsu sieciowego w systemie. Oto co musisz umieć odczytać:

| Pole | Co oznacza | Co masz gadać |
| :--- | :--- | :--- |
| **Adres IPv4** | Twój adres w sieci lokalnej | Jeśli zaczyna się od `169.254.x.x` → DHCP nie przydzielił adresu! |
| **Maska podsieci** | Określa rozmiar sieci | Typowa: `255.255.255.0` (sieć /24, $254$ hosty) |
| **Brama domyślna** | Adres routera | Brak = zero połączenia z internetem |
| **Serwery DNS** | Kto tłumaczy nazwy domen na IP | Domyślnie serwer ISP. Można zmienić! |
| **DHCP włączony** | Czy IP jest automatyczne | `Tak` = router przydziela. `Nie` = trzeba wpisać ręcznie |
| **Adres fizyczny (MAC)** | Unikalny identyfikator karty sieciowej | Przydatny przy filtrowaniu MAC i diagnostyce |

<details>
<summary>🔬 <b>Matematyka binarna pod maską TCP/IP – Dlaczego Binarne Fundamenty IT były obowiązkowe?</b></summary>

Jeśli zastanawiałeś się, po co uczyłeś się systemów binarnych i szesnastkowych w kursie wstępnym – oto Twoja odpowiedź. Stos sieciowy systemu Windows nie widzi liczb dziesiętnych. Dla karty sieciowej i jądra systemu, adresacja sieciowa to czysta logika cyfrowa.

### 1. Maska podsieci to bramka logiczna AND
Gdy Twój komputer chce wysłać pakiet pod adres `192.168.1.53` przy masce `255.255.255.0`, system operacyjny musi podjąć kluczową decyzję: 

Gdzie jest cel wysłania pakietu?

| Sieci lokalna | Sieć zewnętrzna |
|---|---|
| ślemy go bezpośrednio przez switch| ślemy go do bramy domyślnej / routera |


Aby to ustalić, Windows wykonuje **bitową operację AND (koniunkcję $\land$)** na adresie IP oraz masce podsieci:

<pre class="network-binary-calc">
Adres IP:                   11000000 . 10101000 . 00000001 . 00110101  (192.168.1.53)
Maska:                  AND 11111111 . 11111111 . 11111111 . 00000000  (255.255.255.0)
                          ------------------------------------------
Adres sieci (wynik):         11000000 . 10101000 . 00000001 . 00000000  (192.168.1.0)
</pre>

Wszędzie tam, gdzie w masce są jedynki ($1$), bity adresu IP zostają przepisane bez zmian ($1 \text{ AND } 1 = 1$, $0 \text{ AND } 1 = 0$). Tam, gdzie są zera ($0$), wynik jest zawsze zerem ($x \text{ AND } 0 = 0$). 
*   **Maska `/24` (CIDR):** Notacja `/24` oznacza dokładnie liczbę początkowych jedynek w zapisie binarnym maski podsieci (trzy pełne oktety po $8$ bitów = $24$ jedynki). Pozostałe $8$ bitów (zera) to przestrzeń adresowa dla hostów ($2^8 - 2 = 254$ dostępne adresy w sieci, wyłączając adres sieci i adres rozgłoszeniowy).

### 2. Adres fizyczny MAC – 48 bitów zapisanych w HEX
Adres MAC (np. `00:1A:2B:3C:4D:5E`) to unikalny sprzętowy numer karty sieciowej składający się z $48$ bitów <span style="white-space: nowrap">($6$ bajtów)</span> zapisanych szesnastkowo. Dzieli się on na dwie równe części:
*   **Pierwsze 24 bity (3 bajty – `00:1A:2B`):** To **OUI** (*Organizationally Unique Identifier*). Unikalny kod przypisywany producentowi sprzętu (np. Intel, Realtek) przez organizację IEEE. Odczytując te bity, w sekundę dowiesz się, kto wyprodukował układ scalony karty!
*   **Kolejne 24 bity (3 bajty – `3C:4D:5E`):** To unikalny numer seryjny karty przydzielany bezpośrednio przez producenta na taśmie produkcyjnej.
</details>

> [!CAUTION]
> **Adres `169.254.x.x` (APIPA)** to sygnał alarmowy! Oznacza, że komputer **nie dostał adresu od routera** i przypisał sobie tymczasowy. Przyczyny: kabel odłączony, router nie działa, usługa DHCP padła lub na routerze skończyła się pula adresów.

  </div>
  <div>

### Komendy ipconfig, które musisz znać

| Komenda | Co robi | Kiedy użyć |
| :--- | :--- | :--- |
| `ipconfig` | Podstawowy widok IP, maski, bramy | Szybka weryfikacja połączenia |
| `ipconfig /all` | Pełne szczegóły (DNS, DHCP, MAC) | Głębsza diagnostyka |
| `ipconfig /release` | Zwalnia aktualny adres IP z DHCP | Przed odnowieniem dzierżawy |
| `ipconfig /renew` | Prosi router o nowy adres IP | Klasyczny „reset sieci" |
| `ipconfig /flushdns` | Czyści lokalną pamięć podręczną DNS | Strona nie ładuje się, choć internet działa |
| `ipconfig /displaydns` | Pokazuje zapisane w cache wpisy DNS | Sprawdzenie, jakie adresy DNS system zapamiętał od ostatniego restartu |

Najpopularniejsza sekwencja na Helpdesku (tzw. **reset stosu sieciowego**):

```
ipconfig /release    # zwalnia aktualny adres IP z DHCP
ipconfig /renew     # prosi router o nowy adres IP
ipconfig /flushdns  # czyści lokalną pamięć podręczną DNS
```

Te trzy komendy rozwiązują zaskakująco dużo problemów. Działają jak „wyłącz i włącz ponownie”, ale dla samej sieci.

  </div>
</data-tabs>

---

<data-gate>
  <data-quiz>
    <question>Wpisujesz `ipconfig` na stacji roboczej i w wyniku widnieje adres IPv4 zaczynający się od `169.254.x.x`. Co oznacza ta sytuacja?</question>
    <options>
      <item>Karta sieciowa działa w trybie statycznym – należy pilnie zmienić serwery DNS na publiczne.</item>
      <item>Adres IP został pomyślnie przypisany przez router, ale lokalna pamięć DNS wymaga czyszczenia.</item>
      <item correct>To adres APIPA – komputer nie dostał konfiguracji od serwera DHCP, np. przez odłączony kabel.</item>
      <item>To adres pętli zwrotnej (localhost) – system operacyjny nie załadował stosu protokołów sieciowych.</item>
    </options>
    <div data-hint="error">
      Sprawdź w ostrzeżeniu powyżej, w jakich okolicznościach system przypisuje tymczasowy adres z zakresu 169.254.x.x.
    </div>
    <div data-hint="success">
      Dokładnie! Jest to adres APIPA (Automatic Private IP Addressing). System Windows przypisuje go tymczasowo, gdy karta sieciowa nie może pobrać adresu IP z serwera DHCP (np. z powodu braku połączenia fizycznego z routerem).
    </div>
  </data-quiz>
</data-gate>

---

## ⚙️ Konfiguracja interfejsu sieciowego

Windows 11 oferuje dwie ścieżki do ustawień sieciowych. Obie prowadzą do tego samego celu, ale mają różne możliwości.

<data-tabs>
  <tabs>
    <item>Nowoczesne Ustawienia</item>
    <item>Klasyczny Panel (ncpa.cpl)</item>
  </tabs>
  <div>

### Nowoczesne Ustawienia

Otwórz <kbd class="Win"></kbd> + <kbd>I</kbd> → **Sieć i Internet**. Zobaczysz przegląd aktywnych połączeń.

Kliknięcie w aktywne połączenie (np. *Ethernet* lub *Wi-Fi*) otwiera szczegóły, w których możesz konfigurować parametry protokołu IPv4:

*   **Edycja przypisania IP:** Możesz zmienić ustawienie z DHCP (automatyczne) na Ręczne i przypisać statyczny adres IPv4, dziesiętną maskę podsieci oraz bramę domyślną.
*   **Serwery DNS (IPv4):** Możesz ręcznie zdefiniować serwery DNS oraz włączyć dla nich szyfrowanie DNS over HTTPS (DoH).

![Konfiguracja IPv4 w nowoczesnych ustawieniach Windows 11](/public/courses/windows-11/Images/ipv4-ustawienia.webp)

  </div>
  <div>

### Klasyczny Panel Sterowania

Wciśnij <kbd class="Win"></kbd> + <kbd>R</kbd> i wpisz `ncpa.cpl`. To **klasyczne okno „Połączenia sieciowe”** – żywe od czasów Windows XP i wciąż niezastąpione na egzaminie zawodowym.

Tutaj widzisz **wszystkie** interfejsy sieciowe: aktywne, wyłączone, wirtualne (VPN, VirtualBox Host-Only itp.).

> **PPM** – Kliknij prawym przyciskiem myszy.

**PPM na interfejs → „Właściwości”** na wybranym interfejsie otwiera listę protokołów.
*   <kbd class="check-mark"></kbd> _**Protokół internetowy w wersji 4 (TCP/IPv4)**_ – zaznacz go i kliknij <kbd class="win-menu-btn">Właściwości</kbd>. 

W nowo otwartym oknie ręcznie wpisujesz dane z podziałem na dwie sekcje:
1. **Użyj następującego adresu IP:** Umożliwia wpisanie:
  - *Statycznego adresu IP* (np. `192.168.0.2`).
  - *Maska podsieci:* System Windows często sam uzupełnia maskę domyślną na podstawie klasy adresu IP (np. `255.255.255.0` dla klasy C).
  - *Brama domyślna:* Adres routera, przez który komputer komunikuje się z innymi sieciami (np. `192.168.0.1`).  
  W przypadku maszyn wirtualnych np. VirtualBox możesz wpisać tu adres serwera bo to tam pójdzie pierwszy pakiet klienta.
2. **Użyj następujących adresów serwerów DNS:**
  - *Preferowany serwer DNS* (np. `8.8.8.8` - Google-owski DNS)
  - *Alternatywny serwer DNS* (np. `192.168.0.1` - adres routera, lub lokalnego serwera DNS)

Panel `ncpa.cpl` jest jedynym miejscem, gdzie szybko:
- **wyłączysz/włączysz** interfejs sieciowy jednym klikiem (PPM → Wyłącz / Włącz).
- zmienisz nazwę interfejsu (PPM → Zmień nazwę).
To bezwzględnie wymagane umiejętności na egzaminie praktycznym INF.02! 😉

![Panel sterowania - połączenia sieciowe z oknem konfiguracji IPv4](/public/courses/windows-11/Images/ipv4-panel-sterowania.webp)

  </div>
</data-tabs>


## 🆚 DHCP vs IP statyczny – kiedy co?

| Cecha | DHCP (automatyczny) | Statyczny (ręczny) |
| :--- | :--- | :--- |
| Kto przydziela IP? | Router (serwer DHCP) | Ty, ręcznie |
| Typowe zastosowanie | Komputery pracowników, laptopy | Serwery, drukarki sieciowe, NAS (Network Attached Storage) |
| Ryzyko konfliktu IP | Minimalne (router pilnuje) | Wysokie (jeśli źle przypiszesz) |
| Zmiana sieci | Bezproblemowa | Trzeba ręcznie przestawić |

**Na helpdesku** – $99\\%$ stacji roboczych działa na DHCP. Adres statyczny ustawiasz tylko dla:
- **Drukarek sieciowych** (żeby adres się nie zmienił po restarcie routera)
- **Serwerów lokalnych** (NAS, serwer plików)
- **Rezerwacji DHCP** na routerze (alternatywa – przypisujesz stały IP do MAC adresu)

> [!WARNING]
> **Konflikt IP** – jeśli dwóm urządzeniom przypiszesz ten sam adres statyczny, oba stracą łączność. Windows wyświetli ostrzeżenie: *„Wykryto konflikt adresów IP”.* Rozwiązanie: zmień IP jednego z urządzeń lub przejdź na DHCP.

---

## 🔒 DNS – serwer nazw (i dlaczego to Twoja sprawa)

DNS (*Domain Name System*) to **książka telefoniczna internetu**. Zamienia nazwy, które ludzie rozumieją (`google.com`), na adresy IP, które rozumieją systemy komputerowe (`142.250.186.206`) i potrafią przetworzyć na binarny zapis by zrozumiała go maszyna.

Ogromna część problemów *„nie działa internet”* to w rzeczywistości **_„nie działa DNS”_**.

Prosty test:
1. Otwórz `cmd` i wpisz: `ping 8.8.8.8`
2. Jeśli ping *działa* → internet jest a problem leży w DNS.
3. Jeśli ping **_nie działa_** → problem jest głębiej (kabel, router, ISP).

<data-tabs>
  <tabs>
    <item>Blokada DNS przez ISP</item>
    <item>Zmiana DNS (Windows)</item>
    <item>DNS over HTTPS (DoH)</item>
    <item>DoH w przeglądarkach</item>
  </tabs>
  <div>

### Jak ISP blokuje strony przez DNS?

Mechanizm jest banalnie prosty:

1. Wpisujesz `„zablokowana-strona.com”` w przeglądarkę.
2. Twój komputer pyta serwer DNS dostawcy: *„Jaki IP ma ta strona?”*
3. Serwer ISP **wie**, że domena jest na liście blokad → zamiast prawdziwego IP, zwraca *fałszywy adres* (np. stronę z komunikatem *„Domena zablokowana”*) albo w ogóle *nie odpowiada*.

To tzw. _**DNS hijacking**_ (porwanie DNS). ISP nie blokuje samej strony – blokuje **odpowiedź na pytanie o jej adres**.

**Jak to obejść?** Wystarczy zmienić serwer DNS na taki, który nie podlega polskiemu ISP.

### Popularne publiczne serwery DNS

| Dostawca | Preferowany | Alternatywny | Uwagi |
| :--- | :--- | :--- | :--- |
| **Cloudflare** | `1.1.1.1` | `1.0.0.1` | Najszybszy, prywatność |
| **Google** | `8.8.8.8` | `8.8.4.4` | Niezawodny, popularny |
| **Quad9** | `9.9.9.9` | `149.112.112.112` | Blokuje złośliwe domeny |

> [!CAUTION]
> Zmiana DNS **_nie_** omija blokad na poziomie IP (np. firewall firmowy). Omija *wyłącznie* blokady oparte na DNS. To ważne rozróżnienie.

  </div>
  <div>

### Zmiana DNS w Windows 11

**Ścieżka nowoczesna:**
1. <kbd class="Win"></kbd> + <kbd>I</kbd> → **„Sieć i Internet”** → kliknij aktywne połączenie.
2. Przy pozycji **„Przypisanie serwera DNS”** kliknij **„Edytuj”**.
3. Zmień z `„Automatyczne (DHCP)”` na `„Ręczne”`.
4. Włącz **„IPv4”** i wpisz adresy (np. `1.1.1.1` i `1.0.0.1`).
5. Zapisz.

**Ścieżka klasyczna (ncpa.cpl):**
1. <kbd class="Win"></kbd> + <kbd>R</kbd> → `ncpa.cpl`
2. PPM na aktywne połączenie → **„Właściwości”**
3. Zaznacz **„Protokół internetowy w wersji 4 (TCP/IPv4)”** → **„Właściwości”**
4. Wybierz **„Użyj następujących adresów serwerów DNS”**
5. Wpisz preferowany i alternatywny DNS → <kbd class="win-menu-btn">OK</kbd>  → <kbd class="win-menu-btn">OK</kbd> (oba okna)

Po zmianie warto wyczyścić cache:
```
ipconfig /flushdns
```

  </div>
  <div>

### DNS over HTTPS (DoH) – Szyfrowanie DNS i inżynieria prywatności

Zmiana serwera DNS na inny to dopiero połowa sukcesu. Standardowo zapytania DNS przesyłane są *całkowicie otwartym tekstem* na porcie **53 (UDP)**. Niesie to ze sobą poważne konsekwencje i zagrożenia sieciowe:

- _**Inwigilacja i profilowanie ISP:**_ Twój dostawca internetu (ISP) rejestruje każdą odpytywaną przez Ciebie nazwę domeny (np. to, na jakie portale informacyjne, medyczne czy finansowe wchodzisz). Nawet jeśli cała komunikacja ze stroną jest szyfrowana (HTTPS), ISP doskonale zna historię Twoich zapytań DNS.
- _**Porywanie DNS (DNS Hijacking) i Phishing:**_ Zainfekowany router domowy, złośliwe oprogramowanie w sieci LAN lub cyberprzestępca w publicznej sieci Wi-Fi może przechwycić Twoje zapytanie o adres banku i podmienić odpowiedź, kierując Cię na idealnie przygotowaną fałszywą stronę wyłudzającą hasła.
- _**Cenzura i blokady dostawców:**_ Wiele blokad nakładanych przez państwa lub dostawców internetu (np. blokady stron hazardowych lub pirackich) opiera się wyłącznie na porywaniu nieszyfrowanego ruchu DNS na porcie 53 i zwracaniu fałszywych adresów IP (np. strony ostrzegawczej).

**DNS over HTTPS (DoH)** rozwiązuje ten problem. Zamyka zapytania DNS wewnątrz standardowego, szyfrowanego ruchu **HTTPS (port 443)**. Zapytanie płynie w bezpiecznym kanale TLS bezpośrednio do zaufanego serwera.

#### Co to oznacza w praktyce i co się z tym wiąże?
- _**Czy ISP może zablokować lub spowolnić DoH?**_ Ponieważ ruch DoH wygląda dla systemów monitorowania dostawcy identycznie jak normalny ruch HTTPS (np. logowanie do banku czy oglądanie wideo), **_ISP nie jest w stanie go zablokować ani spowolnić bez całkowitego zablokowania całego internetu_**!   
To kluczowa przewaga DoH nad konkurencyjnym standardem DoT (DNS over TLS), który działa na dedykowanym porcie 853 – ten port ISP może zablokować w ułamku sekundy.
- _**Wpływ na wydajność:**_ Narzut szyfrowania TLS i nawiązania bezpiecznego połączenia HTTPS dodaje minimalne opóźnienie (kilka milisekund), jednak dzięki agresywnemu buforowaniu (*cache'owaniu*) DNS w systemie Windows 11 i nowoczesnych przeglądarkach, różnica w codziennym użytkowaniu jest **całkowicie nieodczuwalna**.

---

#### 🌐 Najważniejsze publiczne serwery DoH (IPv4 & IPv6):

Przechodząc na szyfrowany DNS, najczęściej wybieramy renomowane, globalne serwery:

| Dostawca DNS | Preferowany IPv4 | Preferowany IPv6 | Szablon DoH (Adres URL) |
| :--- | :--- | :--- | :--- |
| **Cloudflare** (Najszybszy, prywatność) | `1.1.1.1` | `2606:4700:4700::1111` | `https://cloudflare-dns.com/dns-query` |
| **Google** (Szybki, globalny) | `8.8.8.8` | `2001:4860:4860::8888` | `https://dns.google/dns-query` |
| **Quad9** (Filtrowanie malware/phishingu) | `9.9.9.9` | `2620:fe::fe` | `https://dns.quad9.net/dns-query` |

---

#### 👓 Włączanie i konfiguracja DoH w najnowszych wersjach Windows 11 (GUI)

W najnowszych kompilacjach Windows 11 nie musimy już używać konsoli PowerShell do dodawania szyfrowanych DNS. Cały proces wyklikasz w nowoczesnym panelu Ustawień:

1.  Otwórz <kbd class="Win"></kbd> + <kbd>I</kbd> $\rightarrow$ **„Sieć i Internet”** $\rightarrow$ kliknij aktywne połączenie (Wi-Fi lub Ethernet).
2.  Przy pozycji **„Przypisanie serwera DNS”** kliknij **„Edytuj”**.
3.  Zmień z `„Automatyczne (DHCP)”` na `„Ręczne”` i aktywuj przełącznik **IPv4** lub **IPv6** (zalecam skonfigurowanie obu!).
4.  Wpisz adres (np. IPv4: `1.1.1.1` lub IPv6: `2606:4700:4700::1111`).
5.  W nowej opcji **„DNS za pośrednictwem protokołu HTTPS”** wybierz jeden z trzech trybów:
    *   *Wyłączone:* Windows wysyła zapytania otwartym, nieszyfrowanym tekstem (port 53 UDP).
    *   *Włączane (szablon automatyczny):* Windows automatycznie dopasuje adres URL szablonu szyfrowania dla najpopularniejszych serwerów (Cloudflare, Google, Quad9) na podstawie wpisanego IP.
    *   *Włączane (szablon ręczny):* Otwiera dodatkowe pole tekstowe **„DNS za pośrednictwem szablonu protokołu HTTPS”**, w które musisz ręcznie wkleić adres URL (szablon) z tabeli powyżej. Idealne, jeśli korzystasz z własnego lub mniej popularnego serwera DoH (np. NextDNS).
6.  **Przełącznik „Powrót do zwykłego tekstu” (Dilemma awaryjny):**
    *   *Włączony (Zalecany dla stabilności):* Jeśli serwer DoH ulegnie awarii lub sieć publiczna (np. w hotelu) zablokuje porty szyfrowane, Windows automatycznie przełączy się na klasyczny, nieszyfrowany protokół DNS (port 53 UDP), abyś nie stracił dostępu do sieci.
    *   *Wyłączony (Strict / Tryb bezkompromisowy):* Windows zabrania wysyłania nieszyfrowanych zapytań DNS. Jeśli bezpieczne połączenie DoH nie może zostać nawiązane, system całkowicie zablokuje rozwiązywanie nazw domen. Zyskujesz $100\\%$ prywatności, ale ryzykujesz brak internetu w niektórych sieciach.
7.  Zapisz ustawienia i wyczyść cache komendą `ipconfig /flushdns` w konsoli CMD!

![Ustawienia szyfrowanego serwera DNS w systemie Windows 11](/public/courses/windows-11/Images/https-dns-ustawienia-windows.webp)

> [!NOTE]
> **Jak sprawdzić, czy szyfrowanie naprawdę działa?**
> - **W systemowej aplikacji Ustawienia:** Przy Twoich serwerach DNS pojawi się jasna adnotacja **„Zaszyfrowane”** (lub *Zaszyfrowane (DNS over HTTPS)*).
> - **W konsoli za pomocą `ipconfig /all`:** W najnowszych wersjach Windows 11 (od kompilacji 24H2), komenda wprost wyświetla szablon DoH (np. `DoH: https://cloudflare-dns.com/dns-query`) bezpośrednio pod adresem IP każdego serwera DNS! W starszych wersjach systemu status szyfrowania sprawdzisz wyłącznie graficznie w Ustawieniach.

> [!TIP]
> **Dlaczego tuż po wyczyszczeniu cache (`ipconfig /flushdns`) internet może przez krótką chwilę delikatnie „przymulić”?**
> Ponieważ usuwasz z pamięci komputera wszystkie dotychczas zapamiętane adresy IP witryn sieciowych! Przy pierwszym wejściu na dowolną stronę internetową, system musi od zera wysłać zapytanie do serwera DNS i poczekać na odpowiedź. Pierwsze wczytanie danej strony potrwa minimalnie dłużej, ale każde kolejne wejście na tę samą stronę będzie już błyskawiczne, ponieważ jej adres IP ponownie trafi do lokalnej pamięci podręcznej (*cache'u*) Twojego systemu operacyjnego. 😉

---

### DoH w przeglądarkach – Niezależna linia obrony

Nawet jeśli nie posiadasz uprawnień administratora na komputerze (np. komputer firmowy / w pracowni szkolnej) i nie możesz zmienić ustawień systemowych DNS, **przeglądarka internetowa** może samodzielnie szyfrować swoje zapytania.

#### Google Chrome / Microsoft Edge:

1. Wejdź w **„Ustawienia”** → **„Prywatność i bezpieczeństwo”** → **„Bezpieczeństwo”**.
2. Przewiń do sekcji **„Użyj bezpiecznego DNS”**.
3. Przełącz na **„Przy użyciu”** i wybierz dostawcę (Cloudflare, Google itp.) lub wpisz własny adres.

#### Mozilla Firefox:

1. Wejdź w **„Ustawienia”** → **„Prywatność i bezpieczeństwo”**.
2. Przewiń na sam dół do sekcji **„DNS over HTTPS”**.
3. Wybierz **„Zwiększona ochrona”** lub **„Maksymalna ochrona”**.
4. Wybierz dostawcę (domyślnie Cloudflare).

> [!TIP]
> **Mechanizm Auto-upgrade** (Chrome/Edge) – jeśli wybierzesz *„Z bieżącym dostawcą usług”*, przeglądarka sprawdzi, czy Twój aktualny serwer DNS obsługuje DoH. Jeśli tak – automatycznie przełączy się na szyfrowanie. Jeśli nie – zostawi nieszyfrowane zapytania. Zero ryzyka, warto zawsze mieć włączone.

  </div>
</data-tabs>

---

<data-gate>
  <data-quiz>
    <question>Wykonujesz test diagnostyczny: polecenie `ping 8.8.8.8` zwraca poprawne odpowiedzi, ale wpisanie nazwy strony w przeglądarce kończy się błędem. Co to oznacza?</question>
    <options>
      <item>Kabel sieciowy jest uszkodzony lub switch w szafie rack uległ awarii.</item>
      <item correct>Serwer DNS ma awarię i system nie potrafi przetłumaczyć nazwy domeny.</item>
      <item>Dostawca internetu całkowicie zablokował ruch sieciowy na poziomie IP.</item>
      <item>Karta sieciowa otrzymała błędną i niespójną maskę podsieci z DHCP.</item>
    </options>
    <div data-hint="error">
      Zastanów się: skoro pakiety docierają do adresu IP (8.8.8.8), połączenie działa. Czego brakuje do otwierania stron po nazwach słownych?
    </div>
    <div data-hint="success">
      Dokładnie! Jeśli `ping 8.8.8.8` działa, oznacza to, że połączenie sieciowe jest sprawne. Skoro jednak przeglądarka nie potrafi przetłumaczyć nazwy słownej witryny na adres IP, wina leży po stronie serwera DNS.
    </div>
  </data-quiz>
</data-gate>

---

## 🛠️ Narzędzia diagnostyczne

Gdy `ipconfig` nie wystarczy, masz do dyspozycji kilka narzędzi do głębszej diagnostyki. Każde z nich odpowiada na inne pytanie.

<data-tabs>
  <tabs>
    <item>ping</item>
    <item>nslookup</item>
    <item>tracert</item>
    <item>netstat</item>
  </tabs>
  <div>

### ping – czy cel jest osiągalny?

Wysyła pakiety _**ICMP**_ (*Internet Control Message Protocol*) do wskazanego adresu i mierzy czas odpowiedzi.

```powershell
ping google.com
ping 192.168.0.1
ping -t 8.8.8.8        # (ciągły ping, zatrzymaj Ctrl+C)
```

**Rzeczywisty wynik badania łączności z bramą domyślną (routerem):**
<pre class="network-binary-calc">
C:\Users&gt;ping 192.168.0.1

Pinging 192.168.0.1 with 32 bytes of data:
Reply from 192.168.0.1: bytes=32 time=26ms TTL=64
Reply from 192.168.0.1: bytes=32 time=32ms TTL=64
Reply from 192.168.0.1: bytes=32 time=51ms TTL=64
Reply from 192.168.0.1: bytes=32 time=35ms TTL=64

Ping statistics for 192.168.0.1:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 26ms, Maximum = 51ms, Average = 36ms
</pre>

#### Co czytać z wyniku:
- **`time=26ms`** (Czas odpowiedzi / *Latencja*) – czas, jaki pakiet potrzebował na podróż do bramy i z powrotem. W stabilnej, kablowej sieci LAN opóźnienie to wynosi zazwyczaj poniżej $1\text{ ms}$. W bezprzewodowej sieci Wi-Fi czas ten może ulegać fluktuacjom (np. od 26ms do 51ms) z powodu obciążenia pasma radiowego lub odległości od routera.
- **`TTL=64`** (*Time To Live*) – czas życia pakietu. Każdy router, przez który pakiet przechodzi, odejmuje 1 od wartości TTL. Jeśli TTL spadnie do $0$, pakiet zostaje odrzucony (zapobiega to krążeniu pakietów w nieskończoność w pętlach routingu). Domyślna wartość startowa $64$ jednoznacznie sugeruje, że bramą domyślną jest urządzenie oparte na systemie z rodziny Linux (np. domowy router), a my jesteśmy na bezpośrednim (pierwszym) przeskoku.
- **`Lost = 0 (0% loss)`** – wskaźnik strat pakietów. Wszystkie wysłane zapytania wróciły pomyślnie. Jakakolwiek strata pakietów większa od $0\\%$ wskazuje na problemy fizyczne (uszkodzony kabel RJ-45) lub silne zakłócenia sygnału radiowego Wi-Fi.
- **Upłynął limit czasu żądania** – cel nie odpowiada (zapora sieciowa, brak trasy, host offline).
- **Host docelowy nieosiągalny** – router brzegowy nie wie, jak wytrasować pakiet do podanej sieci.

**Helpdeskowy trik – kolejność pingowania:**
1. `ping 127.0.0.1` – stos TCP/IP działa? (localhost)
2. `ping <brama domyślna>` – widzisz router?
3. `ping 8.8.8.8` – wychodzisz na świat?
4. `ping google.com` – DNS działa?

Jeśli krok $3$ działa, a $4$ nie → problem z DNS, nie z internetem!

  </div>
  <div>

### nslookup – kto odpowiada na pytania DNS?

Pozwala ręcznie odpytać serwer DNS o konkretną domenę.

```powershell
nslookup google.com
nslookup google.com 1.1.1.1       # (odpytaj konkretny serwer DNS)
```

**Rzeczywisty wynik odpytania serwera Cloudflare (`1.1.1.1`):**
<pre class="network-binary-calc">
C:\Users&gt;nslookup google.com 1.1.1.1
Server:  one.one.one.one
Address:  1.1.1.1

Non-authoritative answer:
Name:    google.com
Addresses:  2a00:1450:4008:803::200e
          216.58.207.14
</pre>


#### Wynik zawiera:
*   **Server / Address** – nazwa i IP serwera DNS, który nam odpowiedział (w tym przypadku publiczny serwer Cloudflare `one.one.one.one`).
*   **Non-authoritative answer** (Odpowiedź nieautorytatywna) – oznacza, że serwer DNS pobrał wynik ze swojej pamięci podręcznej (cache), a nie bezpośrednio od serwera zarządzającego strefą `google.com`.
*   **Name / Addresses** – dopasowane adresy IP dla domeny. Zwróć uwagę, że serwer zwrócił zarówno nowoczesny adres IPv6 (`2a00:1450:4008:803::200e`), jak i klasyczny IPv4 (`216.58.207.14`)!

**Kiedy używać:**
- Strona nie ładuje się → sprawdź, czy DNS w ogóle zwraca odpowiedź.
- Podejrzenie blokady DNS → odpytaj inny serwer (np. `1.1.1.1`) i porównaj wyniki.
- Migracja domeny → sprawdź, czy nowy rekord DNS już się rozpropagował.

  </div>
  <div>

### tracert – jaką trasą lecą pakiety?

Pokazuje **każdy router** (przeskok), przez który przechodzi pakiet w drodze do celu.

```powershell
tracert google.com
tracert -d google.com       # (bez rozwiązywania nazw – szybciej)
```

**Rzeczywisty wynik śledzenia trasy w standardzie IPv6:**
<pre class="network-binary-calc">
C:\Users&gt;tracert -d google.com

Tracing route to google.com [2a00:1450:4008:801::200e]
over a maximum of 30 hops:

  1     4 ms     8 ms     2 ms  2a02:beef:ca8a:5800:5667:51ff:feeb:180f
  2    97 ms   101 ms    17 ms  2a02:beef:0:af::1
  3    19 ms    10 ms    14 ms  2a02:beef:80:33:0:1510:0:1
  4    43 ms   166 ms    93 ms  2001:730:2c00::5474:803d
  5     *        *        *     Request timed out.
  6   100 ms   113 ms    89 ms  2001:4c08:200f::731
  7   104 ms     *        *     2001:4860:1:1::171c
  8    37 ms    38 ms    42 ms  2001:4860:0:1::8677
  9   119 ms   110 ms   128 ms  2001:4860:0:1::8656
 10    47 ms    75 ms   117 ms  2001:4860::c:4003:364e
 11    82 ms    40 ms    60 ms  2001:4860::8:4000:f437
 12    59 ms   120 ms   101 ms  2001:4860::9:4003:3585
 13    53 ms    58 ms   144 ms  2a00:1450:4008:801::200e

Trace complete.
</pre>

#### Co czytać z wyniku:
*   **Tracing route to google.com [2a00...]** – System operacyjny automatycznie wybrał preferowany protokół IPv6 do komunikacji z serwerami Google!
*   **Przeskok 1 (Brama domyślna):** Pierwszy wiersz to Twój domowy router. Czas to zaledwie kilka milisekund, bo router stoi obok Ciebie. (`2a02:beef:ca8a:5800:5667:51ff:feeb:180f`) PS. Wyszukaj w googlu `beef` 😉.
*   **Przeskoki 2-4:** Urządzenia brzegowe i routery Twojego dostawcy internetu (ISP).
*   **Przeskok 5 (`* * *`):** Router ma zablokowane odpowiedzi na diagnostyczne pakiety ICMP ze względów bezpieczeństwa (zapora sieciowa), ale bez problemu przesyła ruch dalej.
*   **Przeskoki 7-12 (`2001:4860::`):** Wkroczenie pakietów w szkieletową, globalną infrastrukturę sieci Google.
*   **Przeskok 13 (Cel):** Ostateczny cel – serwer Google.
*   _**Trzy kolumny czasu (Dlaczego aż trzy?):**_ `tracert` domyślnie wysyła **trzy niezależne pakiety próbne (sondy)** do każdego routera po drodze. Daje to statystyczny obraz stabilności łącza (badanie opóźnień/latencji):
    - *Czasy są niskie i podobne* (np. `4 ms 8 ms 2 ms`) $\rightarrow$ linia jest idealnie stabilna, a pakiety przesyłane są bez wahań i opóźnień.
    - *Pojedynczy wysoki czas* (np. `4 ms 120 ms  3 ms`) $\rightarrow$ chwilowe wahanie opóźnienia (*jitter*) lub chwilowe obciążenie procesora danego routera, który przetworzył diagnostyczny pakiet ICMP z najniższym priorytetem.
    - *Wydruk typu `4 ms  *  2 ms`* $\rightarrow$ router zgubił jeden pakiet próbny (*packet loss*) lub zastosował limit zapytań (*rate limiting*) dla ruchu ICMP, by chronić swój procesor przed przeciążeniem.
    - *Wydruk `*  *  *`* $\rightarrow$ router całkowicie blokuje i ignoruje zapytania diagnostyczne na swojej zaporze sieciowej (częste w dużych węzłach szkieletowych), ale ruch bez problemu płynie dalej.

**Zastosowanie na Helpdesku:**
- Wolny internet → `tracert` pokaże, czy problem jest w sieci lokalnej, u ISP czy dalej.
- Połączenie zrywa się na konkretnym etapie → wiadomo, gdzie zgłosić awarię (ISP, administrator).

  </div>
  <div>

### netstat – co właśnie łączy się z komputerem?

Wyświetla aktywne połączenia sieciowe, nasłuchujące porty oraz procesy, które za nimi stoją.

```powershell
netstat -an          # (wszystkie połączenia, numerycznie)
netstat -b           # (pokazuje program za połączeniem – wymaga admina)
netstat -ano         # (z PID procesu – świetne do łączenia z Menedżerem zadań)
```

#### 1. Ręczne odpytanie wszystkich połączeń (netstat -an)
Wypisuje tablicę połączeń w postaci czysto numerycznej (bez rozwiązywania nazw portów i domen – dzięki czemu działa błyskawicznie):
<pre class="network-binary-calc">
C:\Users&gt;netstat -an

Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
  TCP    0.0.0.0:443            0.0.0.0:0              LISTENING
  TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING
  TCP    127.0.0.1:80           127.0.0.1:54267        ESTABLISHED
  TCP    127.0.0.1:54267        127.0.0.1:80           ESTABLISHED
  TCP    192.168.0.87:49728     104.18.124.108:443     ESTABLISHED
  TCP    [2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6]:51094  [2a00:1450:4008:803::200a]:443  ESTABLISHED
</pre>

**Zrozumieć powyższy zrzut:**
*   **`0.0.0.0:80 / 0.0.0.0:3306` (LISTENING):** Twój komputer nasłuchuje na wszystkich dostępnych interfejsach sieciowych IPv4 (`0.0.0.0`) na porcie **80** (serwer WWW HTTP) oraz **3306** (baza danych MySQL). Komputer jest gotowy na przyjęcie połączeń!
*   **`127.0.0.1:80` $\leftrightarrow$ `127.0.0.1:54267` (ESTABLISHED):** Aktywne połączenie lokalne wewnątrz pętli zwrotnej (*loopback*). Przeglądarka internetowa na tym samym komputerze rozmawia z lokalnym serwerem WWW.
*   **`192.168.0.87:49728` $\leftrightarrow$ `104.18.124.108:443` (ESTABLISHED):** Komputer o prywatnym IP `192.168.0.87` nawiązał bezpieczne, szyfrowane połączenie (port **443** - HTTPS) z publicznym serwerem w internecie o IP `104.18.124.108` (sieć Cloudflare).
*   **`[2a02:beef:...]:51094` $\leftrightarrow$ `[2a00:...]:443` (ESTABLISHED):** Pełne połączenie zrealizowane w standardzie **IPv6**! Komputer używa dynamicznego adresu publicznego do rozmowy z serwerem Google po HTTPS.

> [!TIP]
> Adres `104.18.124.108` należy do sieci dostarczania treści (CDN) Cloudflare.
> Zamiast wskazywać na jeden konkretny serwer, jest to adres typu *reverse proxy*.
> Oznacza to, że chroni on prawdziwe serwery wielu różnych stron internetowych i aplikacji, ukrywając ich właściwe adresy.

---

#### 2. Kto stoi za połączeniem? Haczyk z uprawnieniami (netstat -b)
Jeśli spróbujesz sprawdzić programy przypisane do portów ze zwykłego wiersza poleceń, Windows natychmiast Cię zablokuje:
<pre class="network-binary-calc">
C:\Users&gt;netstat -b
Żądana operacja wymaga podniesienia uprawnień.
</pre>

> [!IMPORTANT]
> Komenda `netstat -b` odczytuje dane bezpośrednio z jądra systemu, dlatego **zawsze musi być uruchamiana w konsoli CMD otwartej jako Administrator**!

Po otwarciu CMD jako Administrator, otrzymujemy niesamowity, pełny i niezwykle pouczający wydruk procesów (Case Study Twojego systemu deweloperskiego):
<pre class="network-binary-calc">
C:\Windows\System32&gt;netstat -b

Active Connections

  Proto  Local Address          Foreign Address        State
  TCP    127.0.0.1:80           PC-GAMER:54275         ESTABLISHED
 [httpd.exe]
  TCP    127.0.0.1:49704        PC-GAMER:59455         ESTABLISHED
 [Antigravity.exe]
  TCP    127.0.0.1:53461        PC-GAMER:53462         ESTABLISHED
 [nvcontainer.exe]
  TCP    127.0.0.1:53462        PC-GAMER:53461         ESTABLISHED
 [nvcontainer.exe]
  TCP    127.0.0.1:54275        PC-GAMER:http          ESTABLISHED
 [firefox.exe]
  TCP    127.0.0.1:54456        PC-GAMER:62828         ESTABLISHED
 [language_server_windows_x64.exe]
  TCP    127.0.0.1:62828        PC-GAMER:54456         ESTABLISHED
 [Antigravity.exe]
  TCP    127.0.0.1:57600        PC-GAMER:57601         ESTABLISHED
 [OVRServer_x64.exe]
  TCP    127.0.0.1:57601        PC-GAMER:57600         ESTABLISHED
 [OVRServer_x64.exe]
  TCP    192.168.0.87:49728     104.18.124.108:https   ESTABLISHED
 [EpicWebHelper.exe]
  TCP    192.168.0.87:52396     172.211.123.250:https  ESTABLISHED
 [VirtualBoxVM.exe]
  TCP    192.168.0.87:54239     ec2-52-202-225-39:https  CLOSE_WAIT
 [EpicGamesLauncher.exe]
  TCP    [::1]:3306             PC-GAMER:54334         ESTABLISHED
 [mysqld.exe]
  TCP    [::1]:54334            PC-GAMER:3306          ESTABLISHED
 [httpd.exe]
  TCP    [2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6]:49688  g2a02-26f0-00d8-0000-0000-0000-6851-3c3a:https  ESTABLISHED
 [WidgetBoard.exe]
  TCP    [2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6]:52660  [2603:1020:206:d::1]:https  ESTABLISHED
 [VirtualBoxVM.exe]
  TCP    [2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6]:57467  [2603:1020:1302:3::148]:https  ESTABLISHED
 [CrossDeviceService.exe]
</pre>

> [!TIP]
> Adres lokalny `2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6` to publiczny adres IPv6 (prefiks `2a02:`), w którym część interfejsu (`97ef:c096:8b0a:6bd6`) jest losowa i tymczasowa (zanonimizowana), co chroni tożsamość urządzenia przed profilowaniem przez zewnętrzne serwery.


#### Inżynieryjny rozbiór i sekrety procesów:
*   **`httpd.exe` (Apache) $\leftrightarrow$ `mysqld.exe` (MySQL) na IPv6 (`[::1]:3306`):** To absolutny hit! Zauważ, że serwer WWW (`httpd.exe`) łączy się z bazą danych MySQL (`mysqld.exe`) nie pod klasycznym `127.0.0.1`, lecz przy użyciu lokalnego interfejsu **IPv6 (`[::1]`)**! Windows 11 natywnie i preferencyjnie kieruje ruch localhosta po IPv6, co potwierdza ten log.
*   **Komunikacja sterowników sprzętowych po TCP/IP:** 
    - **`nvcontainer.exe` (NVIDIA Container):** Sterownik karty graficznej NVIDIA tworzy wewnętrzne gniazda TCP (`127.0.0.1:53461` $\leftrightarrow$ `127.0.0.1:53462`), by przesyłać dane telemetryczne i konfiguracje między swoimi modułami w systemie.
    - **`OVRServer_x64.exe` (Oculus VR Runtime):** Oprogramowanie do wirtualnej rzeczywistości (VR) również używa lokalnego stosu sieciowego TCP (`57600` $\leftrightarrow$ `57601`) do komunikacji sterownika z goglami VR.
    - *Wniosek dydaktyczny:* Sieć TCP/IP i interfejs loopback są używane w nowoczesnych systemach operacyjnych jako najszybsza i najbardziej niezawodna forma komunikacji międzyprocesowej (IPC) dla sterowników i usług!
*   **Deweloperski agent AI (`Antigravity.exe`):** Nasz agent kodujący w tle aktywnie komunikuje się z serwerem językowym IDE (`language_server_windows_x64.exe`) po portach loopback (`54456` $\leftrightarrow$ `62828`).
*   **Wirtualizacja w akcji (`VirtualBoxVM.exe`):** Maszyna wirtualna w tle utrzymuje połączenia z internetem po HTTPS zarówno przez protokół IPv4 (`192.168.0.87`), jak i zanonimizowany IPv6 (`2a02:beef:ca8a:5800:...`). Karta sieciowa maszyny wirtualnej działa w trybie mostka (bridged) lub NAT.
*   **W tle sieciowe usługi Windows 11:**
    - **`WidgetBoard.exe`:** Pobiera wiadomości i pogodę z chmury Microsoft po zanonimizowanym adresie publicznym IPv6.
    - **`CrossDeviceService.exe`:** Odpowiada za integrację smartfona z komputerem (przez aplikację _**Link to Windows**_).
*   **Sklepy z grami i chmury AWS (`EpicGamesLauncher.exe`):**
    - Widzimy status **`CLOSE_WAIT`** do chmury Amazon Web Services (`ec2-...`). Oznacza to, że zewnętrzny serwer Amazon zamknął już sesję (lub minął limit bezczynności), a nasz klient w tle przygotowuje się do zwolnienia gniazda sieciowego systemu operacyjnego.

---

#### 3. Statusy połączeń (Co musisz wiedzieć):
- *LISTENING* – port otwarty, serwer czeka na połączenia przychodzące od klientów (np. baza danych lub serwer Apache czekający na zapytania).
- *ESTABLISHED* – połączenie aktywne, trwa wymiana danych w czasie rzeczywistym.
- *TIME_WAIT* – połączenie zostało zamknięte przez jedną ze stron, ale gniazdo sieciowe wciąż czeka w buforze bezpieczeństwa systemu, aby odebrać ewentualne spóźnione pakiety z sieci.
- *CLOSE_WAIT* – druga strona zakończyła połączenie, nasz system przetwarza procedurę zamknięcia gniazda.

**Kiedy przydatny na Helpdesku:**
- _**Zajęty port:**_ Chcesz odpalić XAMPP (Apache na porcie 80), ale wyskakuje błąd, że port jest zajęty. Wpisujesz `netstat -ano` w CMD, odnajdujesz PID procesu nasłuchującego na porcie 80, otwierasz Menedżer Zadań i zamykasz proces (często port 80 blokuje w tle Skype lub usługi IIS).
- _**Wykrywanie wirusów / malware:**_ Jeśli komputer dziwnie się zachowuje, `netstat -b` pozwala sprawdzić, który dokładnie plik `.exe` nawiązał połączenie z nieznanym serwerem w internecie.

  </div>
</data-tabs>

---

## 🕵️ Szybka diagnostyka sieciowa

Dopasuj objaw zgłoszony przez klienta do odpowiedniej procedury diagnostycznej:

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Klient mówi: „Nie działa mi internet”, ale Spotify w tle gra muzykę." data-right="Problem z DNS – uruchom ipconfig /flushdns i zmień serwer DNS na publiczny."></div>
    <div class="cmw-item" data-left="Laptop nie ma w ogóle adresu IP (widoczne 169.254.x.x)." data-right="DHCP nie odpowiada – sprawdź kabel lub Wi-Fi, zrestartuj router, wykonaj ipconfig /renew."></div>
    <div class="cmw-item" data-left="Strona działa u Ciebie, ale nie u klienta na tym samym łączu." data-right="Cache DNS klienta trzyma starą odpowiedź – wyczyść cache: ipconfig /flushdns."></div>
    <div class="cmw-item" data-left="Klient nie może wejść na konkretną stronę, reszta internetu działa." data-right="Prawdopodobna blokada DNS przez ISP – sprawdź nslookup z alternatywnym serwerem (np. 1.1.1.1)."></div>
    <div class="cmw-item" data-left="Internet jest ekstremalnie wolny, strony ładują się minutami." data-right="Użyj tracert, by znaleźć wąskie gardło – nagły skok latencji wskaże problematyczny przeskok."></div>
  </data-connection-matcher>
</data-gate>

---

## 🚀 Protokół IPv6 – Przyszłość, która już tu jest

Większość wciąż myśli wyłącznie kategoriami adresów IPv4. Jednak pula tych adresów ($2^{32} \approx 4{,}3$ miliarda) oficjalnie się wyczerpała. Dlatego mamy podział na sieci lokalne przed routerem i publiczne za routerem. Windows 11 jest systemem **natywnie zaprojektowanym pod preferencję IPv6**. Jeśli Twoja sieć obsługuje oba standardy, Windows zawsze priorytetowo wybierze IPv6, a z IPv4 skorzysta dopiero jako z wyjścia awaryjnego.

### 🧱 Anatomia adresu IPv6 – Imperium Heksadecymalne
Adres IPv6 ma długość **128 bitów (16 bajtów)** – to cztery razy więcej niż IPv4! Ponieważ zapisanie go dziesiętnie byłoby koszmarem, stosuje się zapis szesnastkowy (HEX) podzielony na $8$ grup po $4$ cyfry szesnastkowe rozdzielone dwukropkami:
`2001:0db8:85a3:0000:0000:8a2e:0370:7334`

*   **Zasada kompresji zer (`::`):** Aby ułatwić czytanie, jedną ciągłą sekwencję samych zer w adresie można zastąpić podwójnym dwukropkiem. Powyższy adres po kompresji wygląda tak: `2001:db8:85a3::8a2e:370:7334`.

---

### 🔬 Wielki mit IPv6 – Obalamy błędne przekonania o NAT i prywatności

Wielu uczniów (a nawet starszych administratorów!) zadaje pytanie:
*„Po co Windows ma generować losowy, dynamiczny adres IPv6, skoro router i tak przetłumaczy go na jeden publiczny adres IP?”*

**To kardynalny błąd!** **_W świecie IPv6... NIE MA NAT-u_** (translacji adresów)!
*   Każde urządzenie w Twojej sieci lokalnej (komputer, telefon, inteligentna żarówka) otrzymuje swój własny, **unikalny w skali całego świata GLOBALNY (publiczny) adres IP**!
*   Pakiety lecą z Twojej karty sieciowej bezpośrednio do serwera docelowego (np. Google) bez żadnej podmiany adresów po drodze. Router w IPv6 zajmuje się wyłącznie czystym trasowaniem (routingiem), a nie podmienianiem nagłówków.

Dlaczego więc *„Privacy Extensions”* (losowy IPv6) w Windows 11 ratuje naszą prywatność? 😏
*   **_Bez Privacy Extensions:_** Twój globalny adres IPv6 byłby generowany na podstawie niezmiennego, fizycznego adresu MAC Twojej karty sieciowej (standard EUI-64). Ponieważ ten adres jest publiczny i stały, każdy serwer na świecie, z którym się łączysz, mógłby w $100\\%$ zidentyfikować dokładnie to jedno, konkretne urządzenie. Reklamodawcy mogliby śledzić Twoją historię surfowania bez względu na to, czy łączysz się z domu, z biura, czy z publicznego Wi-Fi!
*   **Z Privacy Extensions (Rozszerzeniami Prywatności):** Windows 11 obok jednego stałego adresu generuje **losowy, tymczasowy adres IPv6** i regularnie go zmienia (zazwyczaj co $24$ godziny). To właśnie ten tymczasowy adres jest używany do komunikacji z internetem. Zewnętrzne serwisy widzą tylko losowy adres z danej puli, który za chwilę wygaśnie.

> [!TIP]
> **Privacy Extensions (L3 IPv6) vs Losowe adresy sprzętowe MAC (L2 Wi-Fi):**
> Nie myl *Privacy Extensions* (losowania adresu IP w warstwie sieciowej L3) z **losowymi adresami sprzętowymi** (losowaniem adresu MAC w warstwie łącza danych L2) w ustawieniach sieci bezprzewodowej Windows 11 (`Ustawienia` $\rightarrow$ `Sieć i Internet` $\rightarrow$ `Wi-Fi` $\rightarrow$ `Zarządzaj znanymi sieciami` $\rightarrow$ Wybierz sieć, np. `UPC69C666CF` $\rightarrow$ `Losowe adresy sprzętowe`).
> - **Kiedy włączyć losowy MAC:** W publicznych sieciach Wi-Fi (hotele, lotniska, galerie handlowe), aby systemy marketingowe i trackerzy nie mogli profilować ani śledzić fizycznej obecności Twojego urządzenia na podstawie stałego adresu MAC.
> - **Kiedy wyłączyć losowy MAC:** W zaufanych sieciach domowych (np. Twojej sieci domowej `UPC69C666CF`) lub firmowych, jeśli na routerze / zaporze sieciowej masz wdrożone **filtrowanie adresów MAC** (białe listy urządzeń dopuszczonych), przypisujesz stałe adresy IP w DHCP na podstawie MAC, lub sieć wymaga uwierzytelniania sprzętowego. Wyłączenie tej opcji przywraca stały, fabryczny adres fizyczny karty sieciowej (`Physical Address`), zapobiegając konfliktom autoryzacji, podczas gdy *Privacy Extensions* w warstwie L3 i tak doskonale chroni Twoją tożsamość przed śledzeniem w internecie!

---

### ⚙️ Autokonfiguracja SLAAC – Zapomnij o DHCPv6
W IPv6 stacja robocza rzadko potrzebuje serwera DHCPv6. Windows 11 natywnie obsługuje **SLAAC** (*Stateless Address Autoconfiguration*):
1.  Po podłączeniu do sieci Windows 11 wysyła zapytanie.
2.  Router odpowiada (*Router Advertisement*), rozgłaszając **64-bitowy prefiks sieci** (np. `2a02:beef:ca8a:5800::/64`).
3.  Windows 11 pobiera ten prefiks i automatycznie dokleja do niego swoje losowe 64 bity, tworząc kompletny, globalny adres IP!
*   **Brak klasycznej maski:** W konfiguracji ręcznej IPv6 zamiast maski dziesiętnej wpisujesz **„Długość prefiksu podsieci”** (gdzie standardem na stacji roboczej jest `/64`, czyli wartość $64$ 😅).

---

### 🔎 Case Study – Analiza prawdziwego wyniku ipconfig /all
Przyjrzyjmy się rzeczywistemu wydrukowi diagnostycznemu z Wi-Fi komputera klienckiego podłączonego do internetu w Polsce (dostawca Play):

```bash
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . : home
   Description . . . . . . . . . . . : RZ608 Wi-Fi 6E 80MHz
   Physical Address. . . . . . . . . : 38-D5-7A-4B-E2-ED
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv6 Address. . . . . . . . . . . : 2a02:beef:ca8a:5800:97ef:c096:8b0a:6bd6(Preferred)
   Temporary IPv6 Address. . . . . . : 2a02:beef:ca8a:5800:4c2a:82ec:9621:d0b4(Deprecated)
   Temporary IPv6 Address. . . . . . : 2a02:beef:ca8a:5800:5576:b155:68f7:f6ea(Deprecated)
   Link-local IPv6 Address . . . . . : fe80::4927:6fb5:3c9e:f40f%8(Preferred)
   IPv4 Address. . . . . . . . . . . : 192.168.0.87(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : fe80::5667:51ff:feeb:180f%8
                                       192.168.0.1
   DHCP Server . . . . . . . . . . . : 192.168.0.1
   DNS Servers . . . . . . . . . . . : 2606:4700:4700::1111
                                         DoH: https://cloudflare-dns.com/dns-query
                                       2001:4860:4860::8888
                                         DoH: https://dns.google/dns-query
                                       1.1.1.1
                                         DoH: https://cloudflare-dns.com/dns-query
                                       8.8.8.8
                                         DoH: https://dns.google/dns-query
   NetBIOS over Tcpip. . . . . . . . : Enabled
```

#### Co z tego odczyta profesjonalny inżynier?
1.  **`2a02:beef:ca8a:5800...`** – to globalny, publiczny prefiks IPv6 dostawcy Play. Urządzenie komunikuje się ze światem bezpośrednio, bez użycia NAT-u.
2.  **`Temporary IPv6 Address... (Deprecated)`** – to tymczasowe adresy wygenerowane przez *Privacy Extensions*. Ich status to **`Deprecated` (przestarzały)**. Oznacza to, że ich czas ważności minął i system nie użyje ich do nowych połączeń, ale wciąż utrzymuje je jako aktywne dla trwających sesji w tle (np. pobieranie pliku lub sesja w grze), by nie zerwać aktywnego połączenia z użytkownikiem!
3.  **`Default Gateway: fe80::...%8`** – w IPv6 bramą domyślną jest Link-Local routera (`fe80::`), a końcówka `%8` (Zone Index) mówi jądru Windows, że pakiety mają wyjść fizycznie przez kartę sieciową o indeksie 8 (czyli Wi-Fi).
4.  **`DNS Servers` i wiersze z szablonami `DoH: https://...`:** To jest absolutna rewelacja inżynieryjna! W najnowszych wersjach Windows 11 (od wersji 24H2 wzwyż), system w konsoli CMD wprost wyświetla przypisany do każdego IP szablon **DoH (DNS over HTTPS)**! Widzimy tu w pełni wdrożone i aktywne szyfrowanie DNS oparte na publicznych, bezpiecznych serwerach Cloudflare (`1.1.1.1` i `2606:4700::1111`) oraz Google (`8.8.8.8` i `2001:4860::8888`). Każde zapytanie o nazwę domeny leci w bezpiecznym, szyfrowanym tunelu HTTPS (port 443).
    *   *Uwaga diagnostyczna:* W starszych kompilacjach Windows 11 komenda `ipconfig /all` nie raportuje szablów DoH – tam status szyfrowania (szyfrowany/nieszyfrowany) sprawdzamy wyłącznie graficznie w aplikacji Ustawienia w sekcji właściwości karty sieciowej.

---

<data-gate>
  <data-quiz>
    <question>Zgodnie z zasadą działania protokołu IPv6 w systemie Windows 11, do czego służy mechanizm Privacy Extensions?</question>
    <options>
      <item>Do maskowania fizycznego adresu MAC karty sieciowej podczas łączenia z publicznymi sieciami Wi-Fi.</item>
      <item correct>Do regularnego generowania losowego, tymczasowego adresu IPv6 używanego do połączeń z internetem.</item>
      <item>Do translacji wielu adresów lokalnych na jeden publiczny adres IP na routerze brzegowym (NAT).</item>
      <item>Do automatycznego szyfrowania zapytań DNS i przesyłania ich bezpiecznym kanałem HTTPS.</item>
    </options>
    <div data-hint="error">
      Zastanów się: jak Windows 11 chroni tożsamość urządzenia w warstwie sieciowej L3 przed śledzeniem przez zewnętrzne witryny?
    </div>
    <div data-hint="success">
      Dokładnie! Privacy Extensions w warstwie sieciowej L3 regularnie generują tymczasowy, losowy adres IPv6 do ruchu wychodzącego. Chroni to urządzenie przed globalnym profilowaniem i śledzeniem historii przeglądania.
    </div>
  </data-quiz>
</data-gate>

---

> [!TIP]
> **Złota zasada helpdeskowej diagnostyki sieci:** Zawsze idź od dołu do góry. Najpierw **fizyka** (kable, zasilanie, Wi-Fi, APIPA `169.254.x.x`), potem **protokół IP** (`ipconfig /renew`), następnie **DNS** (`ping 8.8.8.8` vs `ping google.com`), a na samym końcu **aplikacja**. Przeskakiwanie tych kroków to najczęstsza strata czasu w pracy technika.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Bitowa logika masek IP:** Maska podsieci to binarna bramka AND. System operacyjny wyznacza adres sieci lokalnej za pomocą logicznej koniunkcji (AND) na adresie IP i masce bit po bicie. Jeśli wynik docelowego IP daje inny adres sieci niż lokalny, pakiet leci do bramy domyślnej. 🧱
- **Szesnastkowa tożsamość MAC:** Adres fizyczny MAC składa się z 48 bitów zapisanych w HEX. Pierwsze 24 bity (3 bajty) to unikalny identyfikator producenta (OUI), a kolejne 24 bity to unikalny numer sprzętowy przypisany na linii produkcyjnej. 🕵️
- **Bezpieczeństwo w IPv6 (SLAAC i Privacy Extensions):** W IPv6 nie ma NAT-u. Windows 11 automatycznie konfiguruje swój globalny, publiczny IP (SLAAC) i włącza *Privacy Extensions*, które regularnie generują losowy, tymczasowy adres IPv6. Chroni to Twój sprzętowy adres MAC przed globalnym profilowaniem i śledzeniem w internecie! ⚡
- **Diagnostyka hierarchiczna:** Złota zasada helpdesku brzmi: *zawsze od dołu do góry*. Najpierw sprawdzasz warstwę fizyczną, potem protokół IP (`ipconfig /renew`), następnie DNS, a na końcu aplikację. 📶
- **Szyfrowanie DNS over HTTPS (DoH):** Klasyczny DNS leci jawnym tekstem na porcie 53 (UDP), co pozwala ISP na porywanie zapytań (DNS Hijacking). Włączenie DoH zamyka ruch DNS wewnątrz szyfrowanego protokołu HTTPS (port 443), chroniąc przed podsłuchem i blokadami dostawców. 🔒

---

Brawo! Teraz jesteś już bezpieczny w sieci! 🌐  
W kolejnej lekcji zajmiemy się danymi na dyskach. 🗃️