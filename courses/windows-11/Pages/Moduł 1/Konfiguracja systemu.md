# Konfiguracja Systemu

Nowoczesna aplikacja **Ustawienia** (skrót <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span>) sukcesywnie przejmuje rolę klasycznego Panelu Sterowania.  
Czas nauczyć się w niej sprawnie nawigować i zrozumieć, co tak naprawdę robią kluczowe przełączniki.

---

## 💻 Zarządzanie Zasobami i Wydajnością (System)

Sekcja **System** grupuje parametry bezpośrednio wpływające na stabilność, wydajność sprzętową oraz obsługę urządzeń wejścia/wyjścia.

### Optymalizacja planów zasilania
*Lokalizacja:* `System` → `Zasilanie i bateria`

Na komputerach stacjonarnych i stacjach roboczych wdrożenie trybu **Najwyższa wydajność** wyłącza agresywne mechanizmy oszczędzania energii. Dzięki temu system nie parkuje (nie wprowadza w stan uśpienia) rdzeni procesora, co eliminuje mikroopóźnienia przy nagłych skokach obciążenia (np. podczas intensywnych operacji I/O, wirtualizacji czy kompilacji kodu).

---

### Zjawisko Fast Startup (Szybkie uruchamianie)

System Windows domyślnie korzysta z funkcji **Fast Startup**, będącej formą hybrydowej hibernacji. 

W tym modelu:
- Kliknięcie opcji <kbd class="os-ui">Zamknij</kbd> **nie wyłącza** komputera całkowicie.
- Przestrzeń jądra (kernel space) oraz kluczowe sterowniki są zamrażane i zapisywane do pliku systemowego `hiberfil.sys`.
- Przy kolejnym rozruchu Windows odtwarza zapisany obraz pamięci, zamiast inicjalizować wszystkie usługi od zera.

Dzięki temu system startuje szybciej, jednak **czas pracy jądra kumuluje się między sesjami**. W zakładce wydajności Menedżera Zadań czas pracy procesora może wskazywać wiele dni lub tygodni uptime'u, mimo regularnego wyłączania komputera.

![Menedżer zadań - czas pracy procesora](/public/courses/windows-11/Images/menedżer-zadań-czas-pracy-procesora.webp)

> [!CAUTION]
> Aktywny Fast Startup niesie za sobą poważne ryzyka diagnostyczne:
> - Błędy w przestrzeni jądra lub sterownikach są przenoszone do kolejnych sesji.
> - Przy instalacji niektórych poprawek plik `hiberfil.sys` nie jest prawidłowo czyszczony, co prowadzi do konfliktów wersji sterowników po rozruchu.

To wyjaśnia, dlaczego standardowa opcja **Uruchom ponownie** (Restart) rozwiązuje większość problemów ze stabilnością – jako jedyna wymusza pełną inicjalizację jądra od zera. 😜


Jeżeli chcesz mieć pewność co do czystości sesji i zminimalizować ryzyko problemów, wyłącz **Fast Startup** w Panelu Sterowania. System delikatnie dłużej się bedzie uruchamiać, ale bedzie to stabilniejsze.

![Panel sterowania - wyłączenie szybkiego startu](/public/courses/windows-11/Images/Panel-sterowania-wyłączenie-szybkiego-startu.png)

---

<data-gate>
  <data-quiz>
    <question>Pracownik zgłasza powtarzające się błędy sterowników i spadek wydajności stacji roboczej. Twierdzi, że codziennie po pracy wyłącza komputer opcją Zamknij. Menedżer Zadań w zakładce Wydajność wskazuje czas pracy procesora przekraczający $20$ dni. Jaka jest przyczyna tej rozbieżności?</question>
    <options>
      <item correct>Aktywna funkcja Fast Startup zapisuje stan jądra w pliku hiberfil.sys zamiast je wyładowywać. Czas pracy kumuluje się z sesji na sesję.</item>
      <item>Wyczerpana bateria CMOS na płycie głównej powoduje utratę konfiguracji i restart zegarów sprzętowych po każdym odłączeniu zasilania.</item>
      <item>Uszkodzony czujnik termiczny płyty głównej fałszuje statystyki wydajności w Menedżerze Zadań.</item>
    </options>
    <div data-hint="error">
Przy włączonej hybrydowej hibernacji kliknięcie „Zamknij” nie resetuje środowiska wykonawczego. Zwróć uwagę na plik hiberfil.sys.
    </div>
    <div data-hint="success">
Prawidłowa diagnoza! Funkcja Fast Startup zrzuca stan jądra na dysk, przez co system operuje na tej samej sesji jądra przez wiele dni. Pełny restart rozwiązuje ten problem.
    </div>
  </data-quiz>
</data-gate>

---

## 🖥️ Parametry Wyświetlania i Skalowania

*Lokalizacja:* `System` → `Ekran` → `Zaawansowane wyświetlanie`

Częstym niedopatrzeniem po instalacji systemu lub sterowników GPU jest pozostawienie domyślnego odświeżania $60 \text{ Hz}$ na monitorach obsługujących wyższe częstotliwości (np. $144 \text{ Hz}$ lub więcej). Powoduje to spadek płynności animacji systemowych i może wywoływać zjawisko rozrywania obrazu (*tearing*).

Drugim kluczowym aspektem jest skalowanie interfejsu (DPI/PPI) na ekranach o wysokiej gęstości pikseli (np. panele 4K), gdzie niewłaściwe ustawienia powodują rozmycie czcionek lub zbyt małe elementy interfejsu.

> [!NOTE]
> **Hz (Częstotliwość odświeżania) vs FPS (Klatki na sekundę):**
> - **$\text{Hz}$** to fizyczna częstotliwość, z jaką monitor jest w stanie odświeżyć obraz w ciągu sekundy.
> - **$\text{FPS}$** to liczba klatek generowanych i wysyłanych przez procesor graficzny (GPU) w ciągu sekundy.
> 
> Jeśli GPU generuje $120 \text{ FPS}$ na monitorze o odświeżaniu $60 \text{ Hz}$, zobaczysz tylko $60$ klatek (nadmiarowe klatki mogą zmniejszyć tzw. *input lag*, ale nie poprawią płynności wizualnej).

---

> [!TIP]
> W menu `Ekran` możesz graficznie dostosować **Układ wielu monitorów**. Jeśli system błędnie mapuje kierunki przejścia kursora między ekranami, chwyć lewym przyciskiem myszy miniaturę ekranu i przeciągnij ją tak, aby odzwierciedlała fizyczny układ monitorów na Twoim biurku.
> ![Układ wielu monitorów](/public/courses/windows-11/Images/układ-monitorów.webp)
> PS. Nie próbuj działać *Pixel Perfect*. Ekrany by wydłużyć swoją żywotność co jakiś czas minimalnie przesuwają obraz w pionie.

---

Dla przykładu – poniżej widać zmianę odświeżania z standardowych $60\text{ } Hz$ na płynniejsze $100\text{ } Hz$ dla budżetowego monitora Samsung.
 
![Zaawansowane opcje wyświetlania](/public/courses/windows-11/Images/ustawienia-windows-monitor-100Hz.webp)

Jak najprościej zobaczyć różnicę gołym okiem? Wystarczy szybko poruszać kursorem myszy po pulpicie przed i po operacji. Mając podłączone dwa monitory do stacji, możesz porównać ruch na obu jednocześnie. Ten efekt który zobaczysz to *ghosting*.

---

## 📋 Historia schowka

*Lokalizacja:* `System` → `Schowek` | Skrót: <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>V</kbd></span>

Klasyczny schowek systemowy przechowuje tylko jeden skopiowany element. Aktywacja historii schowka pozwala systemowi zapamiętać do $25$ ostatnio skopiowanych obiektów (tekstów, grafik, zrzutów ekranu). 

Wybrane elementy schowka można przypiąć pinezką, co zapobiega ich wyczyszczeniu przy restarcie systemu. 

Genialne narzędzie! Na początku nawyk używania klawisza <kbd class="Win"></kbd> zamiast <kbd>Ctrl</kbd> do wklejania wydaje się dziwny, ale po kilku tygodniach nie wyobrażam sobie pracy bez pełnej historii tego, co kopiowałem.

---

## 👥 Zarządzanie użytkownikami (Konta)

Microsoft od dłuższego czasu bardzo mocno zmusza do logowania się kontem Microsoft.

- **Omijanie wymogu internetu:** W okienku dodawania użytkownika system stanowczo domaga się podania e-maila. 

  Aby stworzyć normalne **Konto Lokalne**, musisz kliknąć opcję *Nie mam informacji logowania tej osoby*, a na następnym ekranie powtórzyć operację klikając *Dodaj użytkownika bez konta Microsoft*. Teraz możesz utworzyć konto lokalne, ale jak przeczytasz, co jest tam napisane, to zobaczysz, że Microsoft wysuwa kartę pułapki „ochrona dziecka”. 🤔
- **Tryb Kiosk:** Ciekawa opcja Windowsa. Możesz stworzyć specjalne konto użytkownika o roli „Kiosk”. Po wybraniu tego profilu Windows odpala się w sekundę i na pełnym ekranie wyświetla **tylko ten jeden wybrany przez Ciebie program** (np. aplikację pogody). Jest to rozwiązanie dla biletomatów, bankomatów czy stanowisk informacyjnych w galeriach handlowych.

---

## 🕒 Dlaczego przez złe ustawienie czasu nagle „pada” internet?

Zła konfiguracja zegara wydaje się drobnostką, ale to najczęstsza przyczyna nagłego odcięcia od stron WWW i dziwnych błędów w aplikacjach sieciowych.

- *Jak to działa w praktyce:*  
Wszystkie bezpieczne strony internetowe (te z kłódką `HTTPS`) opierają się na **certyfikatach SSL/TLS**. Każdy taki certyfikat ma sztywny okres ważności (od-do). Jeśli bateria CMOS na Twojej płycie głównej padnie i zegar w komputerze cofnie się np. o rok, przeglądarka przy próbie wejścia na stronę uzna jej certyfikat za sfałszowany lub nieważny. Efekt? Czerwony ekran blokady i błąd typu `ERR_CERT_DATE_INVALID`. Internet fizycznie działa, ale system Cię do niego nie dopuści.
- **Szybki fix:** Zawsze, gdy widzisz dziwne błędy „zabezpieczeń” na znanych witrynach lub w nowo postawionych usługach, w pierwszej kolejności zmuś system do pobrania aktualnego czasu: `Czas i język` → `Data i godzina` → <kbd class="os-ui">Synchronizuj teraz</kbd> (kliknięcie tego przycisku odpala natychmiastowe zapytanie do serwerów czasu NTP).

---

<data-gate>
  <data-quiz>
    <question>Po wymianie uszkodzonej baterii CMOS na płycie głównej komputer uruchomił się poprawnie, ale użytkownik nie może otworzyć żadnej bezpiecznej witryny HTTPS w przeglądarce. Wyświetla się czerwony ekran z błędem ERR_CERT_DATE_INVALID. Jak należy rozwiązać ten problem?</question>
    <options>
      <item correct>Zsynchronizować czas systemowy z serwerem czasu NTP w sekcji Czas i język aplikacji Ustawienia.</item>
      <item>Wyłączyć zaporę sieciową Windows Defender, która blokuje szyfrowany ruch na porcie $443$.</item>
      <item>Usunąć i zainstalować ponownie przeglądarkę internetową w celu resetu magazynu certyfikatów.</item>
    </options>
    <div data-hint="error">
Zastanów się, w jaki sposób przeglądarka sprawdza ważność certyfikatów bezpieczeństwa witryn HTTPS. Wymaga to porównania czasu zapisanego w certyfikacie z czasem na komputerze.
    </div>
    <div data-hint="success">
Zgadza się. Certyfikaty SSL/TLS mają ściśle określony okres ważności. Jeśli czas systemowy stacji drastycznie odbiega od rzeczywistego, walidacja certyfikatu zakończy się błędem.
    </div>
  </data-quiz>
</data-gate>

---

## 🗂️ Panel Sterowania i Klasyczne Aplety

Panel Sterowania pozostaje kluczowym narzędziem administracyjnym, przechowującym zaawansowane aplety konfiguracyjne, które nie zostały jeszcze w pełni zaimplementowane w nowoczesnej aplikacji Ustawienia.

> [!TIP]
> Aby błyskawicznie otworzyć klasyczny Panel Sterowania, wciśnij <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>R</kbd></span>, wpisz `control` i zatwierdź klawiszem <kbd>Enter</kbd>. Dla wygody zmień widok w prawym górnym rogu na **Duże ikony**.

Zestawienie najważniejszych apletów systemowych (plików z rozszerzeniem `.cpl`), wywoływanych bezpośrednio z konsoli:

| Aplet | Rola w systemie | Skrót powłoki |
| :--- | :--- | :--- |
| **Połączenia sieciowe** | Zaawansowane zarządzanie kartami sieciowymi, adresacją IP, maską podsieci i bramą domyślną. | `ncpa.cpl` |
| **Programy i funkcje** | Klasyczny menedżer instalacji i deinstalacji oprogramowania. | `appwiz.cpl` |
| **Opcje zasilania** | Konfiguracja zaawansowanych planów zasilania i limitów zużycia energii przez CPU. | `powercfg.cpl` |
| **Zapora Windows Defender** | Zarządzanie regułami filtrowania ruchu sieciowego (porty wejściowe i wyjściowe). | `firewall.cpl` |

---

## 🔗 Diagnoza Problemów Konfiguracyjnych

Dopasuj zgłaszany przez użytkownika problem do odpowiedniego narzędzia lub lokalizacji w systemie:

<data-gate>
  <data-connection-matcher title="Diagnostyka Konfiguracji">
    <div class="cmw-item" data-left="Niewłaściwa skala czcionek i elementów interfejsu na monitorze o wysokiej gęstości pikseli (np. 4K)" data-right="<code>Ustawienia</code> → <code>System</code> → <code>Ekran</code> → <code>Skala</code>"></div>
    <div class="cmw-item" data-left="Konieczność szybkiego dostępu do historii kopiowanych fragmentów tekstu lub zrzutów ekranu" data-right='Wywołanie schowka skrótem <kbd class="Win"></kbd> + <kbd>V</kbd>'></div>
    <div class="cmw-item" data-left="Przeglądarka odrzuca połączenia HTTPS z powodu błędu ważności certyfikatu SSL" data-right="Synchronizacja czasu systemowego z serwerem NTP"></div>
    <div class="cmw-item" data-left="Kumulowanie czasu pracy jądra systemu operacyjnego mimo codziennego zamykania stacji" data-right="Dezaktywacja funkcji Fast Startup"></div>
  </data-connection-matcher>
</data-gate>

---

> [!TIP]
> Pasek adresu Eksploratora plików obsługuje protokoły systemowe (np. URI `ms-settings:`), co pozwala na bezpośrednie wywoływanie konkretnych zakładek Ustawień. Wpisanie `ms-settings:display` przeniesie Cię natychmiast do zaawansowanych opcji wyświetlania.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Pełny restart a zamknięcie:** włączona funkcja *Fast Startup* sprawia, że zamknięcie systemu jedynie hibernuje jądro (`hiberfil.sys`). Tylko opcja **Uruchom ponownie** (Restart) gwarantuje załadowanie czystego jądra od zera. 🔄
- **Synchronizacja czasu to podstawa:** desynchronizacja zegara systemowego (np. po rozładowaniu baterii CMOS) natychmiast blokuje bezpieczne połączenia `HTTPS` z powodu błędów walidacji certyfikatów SSL/TLS. 🕒
- **Narzędzia legacy są niezbędne:** klasyczne aplety Panelu Sterowania (np. `ncpa.cpl` czy `appwiz.cpl`) nadal stanowią podstawowe narzędzie diagnostyczne w pracy administratora IT. 🗂️

---

Mam nadzieje że zaczniesz używać schowka systemowego <kbd class="Win"></kbd> + <kbd>V</kbd>. To naprawde genialna funkcja! 😎