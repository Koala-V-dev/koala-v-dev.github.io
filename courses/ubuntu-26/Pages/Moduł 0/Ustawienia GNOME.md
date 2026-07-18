# Odkrywanie pulpitu GNOME

Po pierwszym uruchomieniu *Ubuntu 26.04 LTS* zobaczysz pulpit *GNOME 50*. Powiedzmy sobie wprost: na klasycznym komputerze z myszką i klawiaturą ten interfejs jest mocno dyskusyjny.

Nie dlatego, że nie działa.  
Jest stabilny i rozwijany przez świetną społeczność. Problem tkwi w filozofii. GNOME wygląda i zachowuje się tak, jakby powstało z myślą o tabletach, gestach i ekranach dotykowych. Na laptopie z panelem dotykowym to ma sens. Na zwykłym monitorze $16:9$ po prostu marnujesz cenną przestrzeń.

Nie bez powodu ten układ wydaje się znajomy. GNOME garściami czerpie z rozwiązań znanych z systemu *macOS*, stąd obecność górnego paska i doku. Szkoda tylko, że ta kopia marnuje znacznie więcej pikseli niż oryginalny pierwowzór:

| System operacyjny   | Pasek główny / Dock | Górny pasek systemowy |
| ------------------- | ------------------- | --------------------- |
| *Windows 11*        | `47px`              | brak                  |
| *Ubuntu (GNOME)*    | `66px`              | `33px`                |
| *macOS* (Standard)  | `56px`              | `24px`                |
| *macOS* (z notchem) | `56px`              | `37px`                |

W czystej matematyce GNOME zabiera najwięcej przestrzeni na ekranie. Windows 11 z dolnym paskiem zadań zostawia znacznie większy obszar na okna aplikacji. GNOME narzuca mobilną filozofię z macOS, ale marnuje na to jeszcze więcej miejsca. Nic dziwnego, że wielu użytkowników od razu ucieka do środowiska **KDE Plasma**.

## 🩹 Plaster łagodzący na rany po GNOME

Możemy dokonać kilku poprawek, żeby to wyglądało i działało lepiej. Zmień pozycję doku z lewego paska na dolny, zabiera zbyt dużo miejsca horyzontalnego a to nie smartfon by pracować wertykalnie:

![Panel boczny w GNOME](/public/courses/ubuntu-26/Images/gnome-pozycja-docka.png)

Automatyczne ukrywanie doku w Ubuntu nie działa jak pasek zadań w Windows. Dok znika dopiero wtedy, gdy najeżdża na niego okno aplikacji. Wystarczy jeden piksel zbliżenia. To skrajnie głupie zachowanie względem klasycznego wysuwania po dotknięciu krawędzi kursorem, tak jak to zrealizowano w Windowsie.

Dobrym trikiem jest zmniejszenie ikon do `28` pikseli. Szerokość doku spadnie wtedy do około $46\text{px}$. Odzyskasz trochę przestrzeni.
![Panel boczny w GNOME z mniejszymi ikonami](/public/courses/ubuntu-26/Images/gnome-pozycja-docka+mniejsze-w-nim-ikony.png)

Porównaj to sobie. Ta sama rozdzielczość a po poprawkach zmieniła się ważność. Waga fokusu przeniosła się z wspólnego istnienia z dokiem na rzecz okna aplikacji. Jest też bardziej Windowsowo, gdyby nie to że menu start jest po prawej a nie lewej stonie doka.

---

## ⚙️ Ważniejsze opcje w Ustawieniach

Panel ustawień w GNOME to nie jest potężne centrum administracyjne rodem z Windowsa. To raczej prosty wręcz prostacki zestaw przełączników do najbardziej podstawowych rzeczy.

W zakładce <kbd class="ubuntu-menu-btn">System</kbd> interesują Cię tylko dwa miejsca:

1. **About**: znajdziesz tu informacje o sprzęcie i zmienisz nazwę urządzenia, czyli `hostname`.
![Ubuntu widok karty ustawiania About (informacje o systemie)](/public/courses/ubuntu-26/Images/ubuntu-about.png)
2. **Users**: pozwala na zmianę hasła, włączenie automatycznego logowania i dodawanie nowych kont.  
Opcja dodawania użytkowników będzie zablokowana (wyszarzona). Aby ją aktywować, musisz najpierw kliknąć przycisk <kbd class="ubuntu-menu-btn">Unlock...</kbd> w prawym górnym rogu i podać swoje hasło administratora.
![Ubuntu widok karty ustawiania Users (użytkownicy) przed odblokowaniem](/public/courses/ubuntu-26/Images/ubuntu-users-gui-1.png)
Sam proces tworzenia użytkownika w interfejsie graficznym jest banalny. Wpisujesz nazwę wyświetlaną, login, decydujesz o typie konta (zwykłe lub administracyjne) oraz wybierasz kto ustawi hasło. Użytkownik przy pierwszym logowaniu, czy ty na kolejnej stronie.
![Ubuntu widok karty ustawiania Users (użytkownicy) po odblokowaniu](/public/courses/ubuntu-26/Images/ubuntu-users-gui-2.png)

> Jeżeli dodasz kolejnych użytkowników, pojawią się oni na liście w nowej sekcji „Other Users” tuż nad przyciskiem <kbd class="ubuntu-menu-btn">Add User</kbd>.


Karta <kbd class="ubuntu-menu-btn">Apps</kbd> pozwala zarządzać uprawnieniami programów, na przykład przeglądarki `Firefox`.

![Ubuntu widok karty ustawiania Apps (aplikacje)](/public/courses/ubuntu-26/Images/ubuntu-uprawnienia-aplikacji.png)

Jeżeli denerwuje Cię wpisywanie hasła do zablokowanego ekranu po kilku minutach bezczynności, to musisz wyłączyć tę opcję. Zrobisz to w jednej z dwóch stron:
- na karcie <kbd class="ubuntu-menu-btn">Power</kbd>
- na karcie <kbd class="ubuntu-menu-btn">Privacy & Security</kbd>

![Ubuntu widok karty ustawiania Privacy & Security (prywatność i bezpieczeństwo)](/public/courses/ubuntu-26/Images/ubuntu-wygaszacz-ekranu-karta-power-i-karta-Prvacy-and-Security.png)


> W sekcji <kbd class="ubuntu-menu-btn">Power</kbd> możesz też przełączyć tryb zasilania na oszczędny lub zbilansowany. Nie szukaj tu jednak zaawansowanych planów zasilania znanych z systemu Windows – GNOME oferuje tylko absolutne minimum 😒.

## 🌐 Ustawienia sieciowe

To najważniejszy ekran ustawień w tej lekcji.

Zobaczysz tu wszystkie aktywne karty sieciowe. Przełącznik przy danej karcie pozwala ją szybko zrestartować. Przydatne, gdy chcesz wymusić ponowne pobranie adresu IP. Kliknięcie koła zębatego otworzy okno właściwości danego interfejsu.

![Ubuntu widok karty ustawiania Network (sieć)](/public/courses/ubuntu-26/Images/ubuntu-ustawienia-network.png)

Zakładka <kbd class="ubuntu-menu-btn">Details</kbd> pokazuje aktualny stan połączenia. W sekcji <kbd class="ubuntu-menu-btn">Identity</kbd> możesz zmienić nazwę profilu sieciowego.

![Ubuntu widok karty ustawiania Network (sieć) po kliknięciu koła zebatego](/public/courses/ubuntu-26/Images/ubuntu-ustawienia-network-zmiana-nazwy-interfejsu.png)

W zakładce <kbd class="ubuntu-menu-btn">IPv4</kbd> decydujesz, czy system ma pobierać dane automatycznie z serwera **DHCP** (*Dynamic Host Configuration Protocol*), czy wolisz wpisać adresację ręcznie.

![Ubuntu widok karty ustawiania Network (sieć) po kliknięciu koła zebatego i wybraniu zakładki Details](/public/courses/ubuntu-26/Images/ubuntu-ustawienia-network-ustawienia-ip-interfejsu.png)

| Nazwa ustawienia | Przykładowa konfiguracja                                                                                | Opis                     |
| ---------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ |
| IPv4             | <ul><li>Address: `192.168.0.5`</li><li>Netmask:`255.255.255.0`</li><li>Gateway: `192.168.0.1`</li></ul> | Ręczna konfiguracja IPv4 |
| DNS              | `8.8.8.8` lub kilka oddzielonych przecinkiem np.: `8.8.8.8, 1.1.1.1`                                    | Ręczna konfiguracja DNS  |


### 🔌 Konfiguracja komunikacji statycznej IPv4

W programie `VirtualBox` wirtualna maszyna startuje domyślnie w trybie **sieci NAT** (*Network Address Translation*). Masz wtedy dostęp do internetu, ale komputer jest niewidoczny dla innych urządzeń w sieci. Aby to zmienić i połączyć dwie wirtualne maszyny bezpośrednio ze sobą, wejdź w ustawienia maszyny w `VirtualBox` i w zakładce **Network** zmień tryb na **Internal Network** (*Sieć wewnętrzna*).

![Konfiguracja sieci w VirtualBox: tryb Sieć wewnętrzna](/public/courses/ubuntu-26/Images/ubuntu-sieć-wewnętrzna.png)

Teraz zaimportuj lub stwórz drugą maszynę z Ubuntu. Obie muszą być podpięte do tej samej sieci wewnętrznej. 
> [!WARNING]
> Upewnij się, że adresy **MAC** (*Media Access Control*) są różne dla obu maszyn,inaczej karty sieciowe będą się gryźć.

Gdy to już ogarniesz dokonajmy przykładowej konfiguracji, gdzie zastosujemy następujące ustawienia adresacji IP:

| Maszyna            | IPv4          | Netmask         | Gateway       | DNS       |
| ------------------ | ------------- | --------------- | ------------- | --------- |
| Ubuntu 26.04 *VM1* | `192.168.0.2` | `255.255.255.0` | `[PUSTY]`     | `8.8.8.8` |
| Ubuntu 26.04 *VM2* | `192.168.0.3` | `255.255.255.0` | `192.168.0.1` | `1.1.1.1` |


Gdy ustawisz adresy na obu VM, sprawdź połączenie. Otwórz **Terminal** skrótem <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd></span> i wpisz polecenie:

```bash
ping [IPv4 drugiej maszyny]
```
Testowe pakiety będą wysyłane w nieskończoność. Aby przerwać działanie programu, użyj skrótu <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span>.

![Ubuntu widok karty ustawiania Network (sieć) po kliknięciu koła zebatego i wybraniu zakładki Details](/public/courses/ubuntu-26/Images/ping-2-ubuntu.png)

> [!TIP]
> Jeśli chcesz wyczyścić ekran terminala, użyj skrótu <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>L</kbd></span>. Spowoduje to jednak tylko przewinięcie widoku w dół. Aby całkowicie wymazać historię z bufora bieżącego okna, wpisz komendę `clear`.

Co się stanie, gdy spróbujesz wysłać `ping` między maszynami z różnych podsieci (na przykład `192.168.0.3` i `192.168.1.2`)?

![Ubuntu widok karty ustawiania Network (sieć) po kliknięciu koła zebatego i wybraniu zakładki Details](/public/courses/ubuntu-26/Images/ping-2-ubuntu-inna-podsieć.png)

Na zrzucie jedna maszyna wyświetliła komunikat **_Destination Host Unreachable_**, a druga **_ping: connect: Network is unreachable_**. Oba błędy oznaczają brak trasy do celu. Bez fizycznego lub wirtualnego routera, maszyny z różnych podsieci nie nawiążą kontaktu.

## 🔗 Połącz Pary: Ustawienia GNOME

Przetestuj, czy kojarzysz najważniejsze ustawienia z tej lekcji.

<data-gate>
<data-connection-matcher title="Ustawienia GNOME">
    <item left="Zmiana nazwy komputera (`hostname`)" right="System / About"></item>
    <item left="Dodanie nowego użytkownika" right="System / Users"></item>
    <item left="Ręczne wpisanie adresu IPv4" right="Network / IPv4"></item>
    <item left="Wyłączenie blokady ekranu" right="Privacy &amp; Security"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Głównie to jak dokonać ustawień interfejsu sieciowego. 😉

---

Podsumowując: GNOME to próba stworzenia interfejsu „do wszystkiego”, czyli na desktopy i ekrany dotykowe. Na klasycznym pececie bywa to irytujące, a możliwości konfiguracji są bardzo skromne w porównaniu do *KDE Plasma*.

Dla przyszłego administratora serwerów jest to jednak idealny punkt startowy. Bardzo szybko postanowisz całkowicie wywalić środowisko pulpitu i przejść do pracy w czystej konsoli.
