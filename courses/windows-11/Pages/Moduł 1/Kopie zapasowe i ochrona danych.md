# Kopie zapasowe i ochrona danych

W świecie IT istnieją tylko dwie grupy ludzi: ci, którzy **już robią backupy**, i ci, którzy **jeszcze o tym nie wiedzą**.  
Jako przyszły specjalista IT, Twoim zadaniem jest zapewnienie ciągłości działania biznesu, a zwłaszcza wtedy, gdy wszystko płonie. 🔥  
Tylko Ty, dysponując odpowiednią wiedzą i procedurami, będziesz w stanie odzyskać dane z popiołów. 🐦‍🔥

---

## 🧠 Filozofia bezpieczeństwa

Zanim wybierzesz narzędzie, musisz zrozumieć, *dlaczego* i *jak* chronimy dane. Backup to nie tylko kopia plików – to przemyślany system i procedury odzyskiwania.

<data-tabs>
  <tabs>
    <item>RPO vs RTO</item>
    <item>Zasada 3-2-1</item>
  </tabs>
  <div>
    
### Fundamenty Biznesowe: Czas to pieniądz

1. **RPO (Recovery Point Objective)** – *Ile danych możemy stracić?* Jeśli robisz backup o $2:00$, a awaria nastąpi o $23:00$ – tracisz $21$ h pracy. Twoje RPO wynosi $24$ h.
2. **RTO (Recovery Time Objective)** – *Jak szybko musimy wrócić do pracy?* Jeśli odzyskanie systemu z chmury trwa $48$ h, a firma stoi – Twoje RTO wynosi $48$ h. Czy organizacja to przeżyje?

</div>
<div>
    
### Złoty Standard: Zasada $3-2-1$

To absolutny standard rynkowy. Jeśli go nie stosujesz, nie masz backupu – masz tylko „szansę na odzysk”.
    
*   **$3$ kopie danych:** Oryginał + dwie dodatkowe kopie.
*   **$2$ różne nośniki:** Np. szybki dysk zewnętrzny HDD/SSD + chmura.
*   **$1$ kopia offline/off-site:** Fizycznie w innym budynku lub odłączona od sieci (ochrona przed pożarem i Ransomware).
  </div>
</data-tabs>

---

## 📊 Rodzaje Kopii Zapasowych

Wybór strategii backupu to kompromis między **czasem trwania kopii**, **rozmiarem archiwum** a **szybkością przywracania**.

### 1. Kopia Pełna (Full Backup)
Kopiuje absolutnie wszystkie wybrane dane.
*   **Zaleta:** Najszybsze odzyskiwanie (potrzebujesz tylko jednego pliku/nośnika).
*   **Wada:** Trwa najdłużej i zajmuje najwięcej miejsca.

### 2. Kopia Przyrostowa (Incremental Backup)
Zapisuje tylko te dane, które zmieniły się od czasu **ostatniej dowolnej** kopii (pełnej lub przyrostowej).
*   **Zaleta:** Bardzo szybki backup i minimalny rozmiar plików.
*   **Wada:** Najwolniejsze odzyskiwanie (musisz posiadać kopię pełną i **wszystkie** kolejne kopie przyrostowe w odpowiedniej kolejności).

### 3. Kopia Różnicowa (Differential Backup)
Zapisuje dane, które zmieniły się od czasu **ostatniej pełnej** kopii.
*   **Zaleta:** Szybsze odzyskiwanie niż w przyrostowej (potrzebujesz tylko kopii pełnej i ostatniej różnicowej).
*   **Wada:** Pliki rosną z każdym dniem, dopóki nie zrobisz nowej pełnej kopii.

---

## 🗓️ Historia plików

W klasycznym Panelu sterowania: `System i zabezpieczenia` → `Historia plików` możesz zobaczyć poniższy komunikat:

![Komunikat o braku oddzielnego dysku w Historii plików](/public/courses/windows-11/Images/komunikat-o-braku-oddzielnego-dysku-histria-plików.webp)

<data-tabs>
  <tabs>
    <item>Dysk wewnętrzny</item>
    <item>Dysk zewnętrzny</item>

  </tabs>
  <div>

---

## Wykorzystanie dysku wewnętrznego stacji roboczej

1. W ustawieniach maszyny wirtualnej z systemem Windows 11 przejdź do sekcji `Pamięć`. Zobaczysz tam najpewniej kontroler SATA. Gdy na niego klikniesz, ukażą się dwie ikony: okrągła dla napędów optycznych ($\text{ISO}$) i kwadratowa dla dysków twardych. 
2. Kliknij kwadratową ikonę dysku twardego. To będzie nasz pierwszy, dodatkowy dysk, więc go utwórzmy, klikając ikonę `Stwórz`. Pojawi się kolejne okno z określeniem lokalizacji `.vdi` (VirtualBox Disk Image) i rozmiaru dysku, np. $80\text{ }GB$. 
3. Możesz od razu zakończyć na domyślnych ustawieniach, upewniając się, że opcja <kbd class="check-mark-empty"></kbd> „Wstępnie przydzielony pełny rozmiar” **jest odznaczona**. Jest to starszy mechanizm dla dysków HDD, który sprawiał, że maszyny były szybsze, ale zajmowały więcej miejsca na dysku fizycznym. W przypadku dysków SSD nie ma to znaczenia, a jedynie skróciłoby delikatnie żywotność dysku SSD przez zbędne operacje odczytu i zapisu zerowych bloków. 

![Tworzenie nowego dysku wirtualnego](/public/courses/windows-11/Images/nowy-dysk-dla-vm-win-11.webp)

Po utworzeniu dysku wirtualnego musisz go podpiąć, wybierając z listy `Not Attached`. Jest to oznaczone taką delikatną pionową kreską z lewej strony elementu listy:

![Podłączanie dysku wirtualnego](/public/courses/windows-11/Images/nowy-dysk-dla-vm-win-11-atyached.webp)

Teraz, gdy uruchomisz maszynę, zobaczysz... że dysku nie ma? 🤨  
Dodaliśmy do VirtualBoxa całkowicie czysty dysk. Aby system mógł z niego korzystać, należy zainicjować tablicę partycjonowania oraz utworzyć partycje, które Windows nazywa woluminami.

Przejdź do aplikacji Ustawienia (<kbd class="Win"></kbd> + <kbd>I</kbd>) → `System` → `Pamięć` → `Dyski i woluminy`.  
Kliknij `Zainicjuj` i wybierz tablicę partycjonowania GPT.

![Inicjalizacja dysku](/public/courses/windows-11/Images/ustawienia-windows-inicjalizacjia-dysku.webp)

Jeszcze tylko utworzenie partycji podstawowej i sformatowanie jej w systemie plików NTFS.

![Tworzenie partycji](/public/courses/windows-11/Images/ustawienia-windows-tworzenie-nowego-woluminu.webp)

</div>
<div>

## Wykorzystanie dysku zewnętrznego

Tu sprawa jest prosta i być może już to robiłeś przy instalacji systemu przez pendrive z *Ventoy*.

![Podłączanie pendrive do maszyny wirtualnej](/public/courses/windows-11/Images/vm-podłączenie-pendrive.webp)

</div>
</data-tabs>

---

## 🛠️ Konfiguracja Historii plików

<data-gate>
  <data-hotspot image="/public/courses/windows-11/Images/panel-sterowania-historia-plików.png">
<hotspot x="1" y="45" title="Przywróć pliki osobiste">

Jeżeli została już utworzona kopia zapasowa, to w tym miejscu możesz przywracać pliki z wykorzystaniem **UI**  
(*User Interface* – *interfejs użytkownika*).  
![Przywracanie plików osobistych](/public/courses/windows-11/Images/historia-plików-przywracanie-plików.webp)

</hotspot>
<hotspot x="12" y="52" title="Wybierz dysk">

Możesz określić inny niż domyślnie wybrany dysk do tworzenia kopii zapasowych lub nawet wskazać lokalizację w sieci.
![Wybór dysku do Historii plików](/public/courses/windows-11/Images/historia-plików-wybierz-dysk.webp)

</hotspot>
<hotspot x="1" y="58" title="Wyklucz foldery">

W starszych wersjach Windowsa backupowane były foldery bibliotek (zaznaczone na pomarańczowo) i kilka innych (oprócz „Pobrane”).  
Microsoft już dawno porzucił tę funkcjonalność na rzecz OneDrive. Dlatego powoli znikają kolejne elementy bibliotek, nie można już utworzyć nowych przez menu kontekstowe, a do działania wymagane jest połączenie z usługą OneDrive. W innym przypadku zobaczysz wyszarzoną opcję `Trwa pobieranie bibliotek...`.
![Wykluczanie folderów z Historii plików](/public/courses/windows-11/Images/historia-plików-wykluczanie-katalogów-biblioteki.webp)
    
</hotspot>
<hotspot x="19" y="65" title="Ustawienia zaawansowane">

To tu możesz ustawić jak często mają być tworzone kopie zapasowe oraz jak długo mają być przechowywane ich wersje.
![Ustawienia zaawansowane Historii plików](/public/courses/windows-11/Images/historia-plików-ustawienia-zaawansowane.webp)

</hotspot>
<hotspot x="78" y="95" title="Włącz">

Gdy wybierzesz dysk i klikniesz <kbd class="win-menu-btn">Włącz</kbd>, Historia plików rozpocznie tworzenie kopii zapasowych.  
Ustawienia zaawansowane dalej są dostępne do zmiany harmonogramu. 
![Włącz Historii plików](/public/courses/windows-11/Images/historia-plików-włączenie.webp)

</hotspot>
  </data-hotspot>
</data-gate>

---

Gdy już skonfigurowałeś i uruchomiłeś Historię plików, możesz przejść do katalogu, w którym będą wszystkie Twoje pliki z pierwszej kopii zapasowej. Kolejne pliki będą dodawane co wyznaczony czas, a w przypadku zmiany zawartości już skopiowanych plików zobaczysz ich pełną kopię jako oddzielny plik.  
* Aby odróżnić pliki, dopisywana jest data i godzina utworzenia kopii.* 
![Lokalizacja kopii zapasowych](/public/courses/windows-11/Images/historia-plików-lokalizacja-po-uruchomieniu.webp)


Dla przykładu utworzyłem obraz czarnej kropki i zapisałem go na pulpicie. Uruchomiłem ręcznie Historię plików, by nie czekać domyślnej godziny. Następnie ponowiłem proces, dodając po kolei kolejne kropki.  
Jak widzisz, wszystkie zmiany, które zarchiwizowała Historia plików, mają nazwę zawierającą w nawiasie datę i godzinę utworzenia kopii. 
![Kopie zapasowe kolejnych wersji pliku](/public/courses/windows-11/Images/historia-plików-obrazy-kropek.webp)

Dzięki temu w katalogu Pulpitu mogę z menu kontekstowego wybrać przywrócenie odpowiedniego wariantu pliku, który został zarchiwizowany, nadpisując docelowy:

![ Przywracanie poprzednich wersji pliku](/public/courses/windows-11/Images/historia-plików-przywróć-poprzednie-wersje.webp)


> [!WARNING]
> Historia plików jest fajnym, ale przestarzałym rozwiązaniem. Microsoft wycofuje się z tej funkcjonalności na rzecz OneDrive, a w profesjonalnych środowiskach programistycznych używa się kontroli wersji, takiej jak Git.

---

## 🤔 Scenariusze Eksperckie (Diagnostyka)

Dobierz odpowiednią technologię do kryzysu, z którym mierzy się Twój klient w Windows 11 PRO.

<data-gate>
  <data-connection-matcher>
    <div class="cmw-item" data-left="Użytkownik przed chwilą nadpisał ważny plik arkusza Excel." data-right="PPM na plik → Przywróć poprzednie wersje (Historia Plików)"></div>
    <div class="cmw-item" data-left="Firma chce chronić dane przed totalną katastrofą (pożar biura)." data-right="Zasada 3-2-1 → Kopie w bezpiecznej chmurze (Off-site)"></div>
    <div class="cmw-item" data-left="Chcesz zachować historię zmian dokumentów bez ręcznego kopiowania." data-right="Skonfiguruj Harmonogram w Historii Plików"></div>
    <div class="cmw-item" data-left="Kopia zapasowa musi zajmować jak najmniej miejsca i być szybka." data-right="Kopia Przyrostowa (Incremental)"></div>
  </data-connection-matcher>
</data-gate>

---

## 🗃️ Kopia zapasowa i przywracanie (Windows 7)

Świetnym narzędziem domyślnie dostępnym w systemie Windows od wersji 7 jest **Kopia zapasowa i przywracanie (Windows 7)**. Pozwala ono na tworzenie pełnej kopii zapasowej ze wszystkimi danymi oraz całym systemem wraz z jego konfiguracją.

> [!CAUTION]
> Tak można pomyśleć na pierwszy rzut oka, lecz nic bardziej mylnego. Nie wykonuj kopii zapasowej systemu Windows 10/11 z wykorzystaniem tego narzędzia. To „wsteczna kompatybilność” i nic więcej.

1. Wybierz „Konfiguruj wykonanie kopii zapasowej”. Zobaczysz okienko kreatora, w którym zostaniesz poproszony o wskazanie lokalizacji kopii zapasowej (możesz też ją zapisać w udziale sieciowym).
![Kopia zapasowa i przywracanie (Windows 7)](/public/courses/windows-11/Images/kopia-zapasowa-i-przywracanie-win-7.webp)

2. Wybierając pierwszą opcję tego, co ma zawierać kopia zapasowa, ograniczysz się do zawartości katalogów bibliotek oraz obrazu systemowego z ustawieniami. W przypadku drugiej opcji system sam wybierze partycje systemowe i katalogi bibliotek konkretnych użytkowników lokalnych.
> [!CAUTION]
> Upewnij się, że masz zaznaczoną opcję <kbd class="check-mark"></kbd> „Dołącz obraz systemu Windows...”  
> Tylko w tym przypadku do kopii zapasowej zostaną dodane pliki programu rozruchowego (bootloadera) i będziesz w stanie je przywrócić z poziomu instalatora Windows.
Na ostatniej karcie zobaczysz podsumowanie tego, co zostanie skopiowane, oraz możliwość ustawienia harmonogramu tworzenia.
![Kopia zapasowa i przywracanie (Windows 7)](/public/courses/windows-11/Images/kopia-zapasowa-i-przywracanie-win-7-kreator.webp)

3. Pierwsza kopia, w zależności od ilości danych, może trwać kilkadziesiąt minut. Kolejne kopie są tworzone przyrostowo i trwają znacznie krócej. 
![Kopia zapasowa i przywracanie (Windows 7)](/public/courses/windows-11/Images/kopia-zapasowa-i-przywracanie-win-7-wykonywanie-kopii.webp)

---

## 🧰 Odzyskiwanie obrazu z kopii zapasowej i przywracanie systemu (Windows 7)

Na początku warto sprawdzić, czy w przystawce `diskmgmt.msc` (Zarządzanie dyskami) jest utworzona partycja odzyskiwania – tak zwana *recovery*. Jeżeli jest, możesz uruchomić system w trybie zaawansowanym, przytrzymując klawisz <kbd>Shift</kbd> i wybierając z menu Start „Uruchom ponownie”. 
![Partycja odzyskiwania w diskmgmt.msc](/public/courses/windows-11/Images/partycja-odzyskiwania-w-diskmgmt.msc.webp)


W opcjach zaawansowanych wybierz „Rozwiąż problemy” → „Zaawansowane opcje” → „Zobacz więcej opcji odzyskiwania” → „Odzyskiwanie obrazu systemu”.
![Opcje zaawansowane](/public/courses/windows-11/Images/odzyskiwanie-obrazu-systemu-z-opcji-zaawansowanych.webp)


W przypadku, gdy chcesz użyć instalatora Windows, wystarczy wybrać opcję „Napraw komputer” zamiast instalacji i wykonać podobne kroki.
![Odzyskiwanie obrazu systemu z poziomu instalatora](/public/courses/windows-11/Images/odzyskiwanie-obrazu-systemu-z-poziomu-instalatora.webp)

Niezależnie od tego, jaką drogę wybrałeś, zobaczysz ten sam kreator przywracania obrazu systemu.  
Domyślna, pierwsza opcja oznacza, że system sam przywróci najnowszą kopię zapasową. Jeżeli chcesz wybrać inną, zaznacz „Wybierz obraz systemu” i kliknij „Dalej”.
Kolejna karta to wskazanie pamięci masowej, na której znajduje się kopia zapasowa. Jeżeli w oknie nie ma żadnej pozycji do wyboru, oznacza to konieczność doinstalowania sterowników kontrolera pamięci przez przycisk <kbd class="win-menu-btn">Zaawansowane</kbd>.  

![ Przywracanie kopii zapasowej obrazu systemu Win 7](/public/courses/windows-11/Images/Przywracanie-kopi-zapasowej-obrazu-systemu-win-7.webp)

Zanim przejdziesz dalej, zaznacz opcję <kbd class="check-mark"></kbd>„Formatuj dyski i ponownie przydziel partycje”.  
Następnie kliknij <kbd class="win-menu-btn">Wyklucz dyski...</kbd> i odznacz partycje, które mają zostać pominięte w procesie formatowania (np. swoje pendrive'y). Potem kliknij <kbd class="win-menu-btn">Dalej</kbd> → <kbd class="win-menu-btn">Zakończ</kbd> i zatwierdź komunikat o formatowaniu dysku.

![ Przywracanie kopii zapasowej obrazu systemu Win 7](/public/courses/windows-11/Images/przywracanie-obrazu-systemu-win-7-wykluczanie-dysków-z-procesu-formatowania.webp)

> [!NOTE]
> Dlaczego należy stosować zasadę $3 - 2 - 1$ i sprawdzać, czy kopia zapasowa działa poprawnie?
> Poniżej masz odpowiedź na to pytanie. W procesie kopiowania na drugi dysk plik w kopii zapasowej został uszkodzony. 
> ![Uszkodzony plik kopii zapasowej (Windows 7)](/public/courses/windows-11/Images/uszkodzony-plik-kopi-zapasowej.webp)

---

## 😑 Lenistwo Microsoftu i pułapka zdeprecjonowanej kopii zapasowej (Windows 7)

Jak widziałeś powyżej, cała procedura przechodzi bez problemów. Dopóki w trakcie przywracania coś się nie wykrzaczy.

Dlaczego Microsoft na to pozwala?  
Usunięcie tej funkcjonalności wiązałoby się z brakiem wsparcia dla starszych edycji Windowsa. Nadal są osoby korzystające z siódemki – to zaproszenie ich na najnowszą edycję, aby łatwo przenieśli swoje dane. Dlatego dodano ten dopisek `(Windows 7)`. Przy aktualnych ruchach Microsoftu można łatwo wywnioskować, że jest im to na rękę. Raz zawiedziesz się na tej funkcji, tracąc ogrom czasu, i chętniej przejdziesz na kopie zapasowe konfiguracji systemu oraz usługę OneDrive. W razie problemów oficjalne wsparcie Microsoftu odeśle Cię do [dokumentacji](https://learn.microsoft.com/pl-pl/windows/compatibility/windows-7-backup-and-restore-deprecated).

Jak sam widzisz, domyślne opcje kopii zapasowych w Windows 11 są bardzo słabe... delikatnie mówiąc. 😐

Więc po co to wszystko było?  
Wiele razy przekonasz się, że różnego rodzaju oprogramowanie nie spełnia Twoich oczekiwań lub po prostu nie będzie działać. Jednak sama idea posiadania kopii zapasowych jest niezwykle ważna. Oto kilka propozycji do przetestowania:

| Narzędzie | Co MOŻESZ zrobić | Czego ABSOLUTNIE NIE MOŻESZ zrobić | Dlaczego |
|---|---|---|---|
| **CloneZilla** | ✔️ Skopiować dysk 1:1 w tym samym urządzeniu (np. NVMe → NVMe w laptopie) <br> ✔️ Skopiować dysk między **identycznymi** modelami komputerów | ❌ Przenieść system laptop → PC <br> ❌ Przenieść system na inny sprzęt (chipset, CPU, grafika) <br> ❌ Użyć jako backup systemu Windows | CloneZilla kopiuje **bloki dysku**, nie system. <br> Kopiuje sterowniki, HAL, konfigurację sprzętu.<br> Inny sprzęt = system nie wstaje. |
| **Macrium Reflect** | ✔️ Zrobić obraz systemu Windows 10/11 <br> ✔️ Przywrócić system na innym sprzęcie (po sysprep) <br> ✔️ Backup przyrostowy | ❌ Przenieść system bez sysprep na zupełnie inny sprzęt | Macrium rozumie Windows, VSS, GPT, NVMe — ale nie usuwa sterowników sprzętowych. |
| **AOMEI Backupper** | ✔️ Backup systemu <br> ✔️ Klonowanie dysku w tym samym komputerze | ❌ Migracja systemu na inny sprzęt | To narzędzie działa, ale nie rozwiązuje problemu sterowników. |
| **OneDrive / Google Drive** | ✔️ Chronić dokumenty <br> ✔️ Cofnąć wersje po ransomware | ❌ Backup systemu <br> ❌ Backup programów | To jest synchronizacja + wersjonowanie, nie obraz systemu. |
| **Git** | ✔️ Historia projektów <br> ✔️ Cofanie zmian | ❌ Backup zdjęć, filmów, dużych plików <br> ❌ Backup systemu | Git to system kontroli wersji, nie backup danych. |
| **Ręczna kopia** | ✔️ Szybkie zabezpieczenie plików | ❌ Automatyzacja <br> ❌ Backup systemu | To procedura, nie narzędzie. |

Jak widzisz, opcji jest mnóstwo. Mają swoje plusy i minusy. Dlatego warto poznawać oprogramowanie firm trzecich, a najlepiej te typu OpenSource.

> [!TIP]
> **Złota myśl technika:** Kopia całego systemu nie jest optymalną opcją. Liczą się dane bez których biznes nie może być kontynuowany lub prawnie należy je chronić. Środowisko zawsze odtworzysz. Pracy użytkownika niekoniecznie.

---

## 🧠 Sprawdź swoją wiedzę

<data-gate>
  <data-quiz>
    <question>Firma doświadczyła ataku ransomware, który zaszyfrował pliki użytkowników na dyskach lokalnych. Pliki te były synchronizowane z chmurą OneDrive. Które z podjętych działań pozwoli na najszybsze odzyskanie dokumentów bez utraty danych?</question>
    <options>
      <item correct>Wykorzystanie wbudowanej w OneDrive funkcji przywracania stanu chmury (Roll-back) do 30 dni wstecz po uprzednim wyczyszczeniu zainfekowanych stacji roboczych.</item>
      <item>Uruchomienie narzędzia Kopia zapasowa i przywracanie (Windows 7) w celu odtworzenia uszkodzonych plików z lokalnej partycji recovery.</item>
      <item>Wykonanie klonowania zainfekowanych dysków za pomocą narzędzia CloneZilla 1:1 na nowe stacje robocze.</item>
    </options>
    <div data-hint="error">
      Ransomware szyfruje pliki lokalne, co wyzwala automatyczną synchronizację zmian do chmury. Tradycyjna kopia systemu Windows 7 czy klonowanie blokowe programem CloneZilla nie służą do wersjonowania dokumentów użytkownika ani nie eliminują zagrożenia z zainfekowanego systemu. Zastanów się, jakie wbudowane mechanizmy chmury Microsoftu chronią przed tego typu skutkami.
    </div>
    <div data-hint="success">
      Doskonale! OneDrive posiada mechanizm wersjonowania plików oraz funkcję *„Roll-back”* (przywracanie stanu dysku chmurowego), która pozwala na cofnięcie zmian wprowadzonych przez ransomware w ciągu ostatnich $30$ dni. Przed synchronizacją należy oczywiście dokładnie oczyścić lub przeinstalować systemy operacyjne na stacjach roboczych.
    </div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Zasada $3 - 2 - 1$ i RPO/RTO:** to fundament planowania kopii zapasowych. Dążymy do minimalizacji utraty danych (RPO) i przestoju (RTO). Zawsze przechowuj $3$ kopie na $2$ różnych nośnikach, w tym co najmniej $1$ w lokalizacji offline/off-site. 🗄️
- **Historia plików i inicjalizacja dysku:** wbudowane wersjonowanie plików użytkownika w Windows wymaga podłączenia i przygotowania dedykowanego dysku (inicjalizacja w GPT i formatowanie w NTFS). Umożliwia ono bezproblemowe przywracanie poprzednich wersji plików wprost z menu kontekstowego. 🔄
- **Zdeprecjonowany backup Windows 7:** narzędzie **_Kopia zapasowa i przywracanie (Windows 7)_** to spuścizna wstecznej kompatybilności. Tworzy niestabilne obrazy systemu, które potrafią ulec uszkodzeniu w procesie przywracania. ⚠️
- **Dopasowanie narzędzi:** dobieraj oprogramowanie do potrzeb: CloneZilla do klonowania dysków blok po bloku na identyczny sprzęt, Macrium Reflect do stabilnych obrazów całego systemu (z użyciem **VSS** - *Volume Shadow Copy Service*), a OneDrive/Google Drive wyłącznie do synchronizacji i wersjonowania dokumentów roboczych lub zdjęć. 🧰

---

Kopie zapasowe i ochrona danych to dopiero początek drogi. Czas na zarządzanie sprzętem i sterownikami! 🥸