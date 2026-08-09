# Udostępnianie plików dla Windows (Samba)

Serwer **Samba** umożliwia udostępnianie plików oraz drukarek w sieci lokalnej przy użyciu protokołu **SMB/CIFS**. Pozwala to na bezproblemową wymianę danych pomiędzy serwerem z systemem Linux (Ubuntu Server) a komputerami w sieci lokalnej (systemy Windows 11 oraz Ubuntu Desktop).

W tej lekcji skonfigurujemy serwer tak, aby udostępnił katalog `/srv/dane` pod nazwą zasobu `DANE`. Dostęp do pliku będzie zabezpieczony kontem użytkownika `labamba`.

---

## 📦 Instalacja Samby i konto użytkownika

Zainstalujmy pakiet serwera Samba:

```bash
sudo apt update
sudo apt install samba -y
```

Po instalacji usługi `smbd` (odpowiedzialna za transfer plików) uruchomią się automatycznie.

### Dlaczego zwykłe konto w systemie nie wystarczy?

Samba nie korzysta bezpośrednio ze standardowych haseł zakodowanych w `/etc/shadow`. Posiada własną bazę kont i haseł (`passdb.tdb`). Aby użytkownik mógł zalogować się do udziału sieciowego, spełnione muszą być dwa warunki:
1. Konto musi istnieć w systemie Linux (w pliku `/etc/passwd`).
2. Konto musi zostać dodane do bazy danych Samby wraz z nadanym hasłem.

Stwórzmy najpierw konto systemowe `labamba`:

```bash
sudo adduser labamba
```

Wypełnij hasło i przejdź przez domyślne zapytania edytora. Następnie dodaj to samo konto do bazy Samby i nadaj mu hasło dostępowe:

```bash
sudo smbpasswd -a labamba
```

> [!TIP]
> Polecenie `smbpasswd -a` służy do dodawania nowego użytkownika do bazy Samby. Jeśli w przyszłości będziesz chciał zmienić istniejące hasło w Sambie, użyj tego samego polecenia bez przełącznika `-a`: `sudo smbpasswd labamba`.

Możesz zweryfikować obecność użytkownika w obu bazach danych:

```bash
# Sprawdzenie bazy kont systemowych Linux
getent passwd labamba

# Sprawdzenie bazy kont Samby
sudo pdbedit -L
```

![](/public/courses/ubuntu-26-server/Images/samba-add-user.png)

---

## 📁 Przygotowanie katalogu udziału (<code>/srv/dane</code>)

Zanim przejdziemy do pliku konfiguracyjnego Samby, musimy przygotować folder na dysku, który będzie przechowywał udostępniane pliki.

> [!NOTE]
> Katalog `/srv/` w systemie Ubuntu służy do przechowywania danych specyficznych dla usług (serwisów) uruchomionych na komputerze, takich jak pliki stron WWW czy zasoby FTP. Nazwa katalogu pochodzi od angielskiego słowa **service** (serwis/usługa).

```bash
sudo mkdir -p /srv/dane
sudo chown labamba:labamba /srv/dane
sudo chmod 700 /srv/dane
```

Zauważ, że nadaliśmy katalogowi uprawnienia `700` (`drwx------`). Oznacza to, że z poziomu systemu operacyjnego tylko jego właściciel – użytkownik `labamba` – ma prawo do odczytu, zapisu i wykonywania w tym katalogu.

Sprawdźmy wynik weryfikacji:

```bash
ls -l /srv
```

![](/public/courses/ubuntu-26-server/Images/samba-katalog-na-dane-w-srv.png)

> [!WARNING]
> Pamiętaj! Prawa dostępu do plików w Sambie są wypadkową dwóch warstw: **uprawnień systemu plików POSIX** (czyli `chmod`/`chown` w Ubuntu) oraz **uprawnień zdefiniowanych w konfiguracji Samby**. Jeśli w Sambie zezwolisz na zapis, ale na poziomie katalogu w systemie zabronisz tego użytkownikowi, zapis się nie uda!

---

## 📝 Konfiguracja pliku <code>/etc/samba/smb.conf</code>

Główny plik konfiguracyjny usługi znajduje się w `/etc/samba/smb.conf`. Zanim zaczniemy w nim grzebać, zróbmy bezpieczną kopię zapasową pliku oryginalnego:

```bash
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.ori
```

Otwórzmy plik do edycji w `nano`:

```bash
sudo nano /etc/samba/smb.conf
```

No i znowu mamy plik wypełniony komentarzami. Są to dwa typy zakomentowanych linii: poprzez średnik `;` oraz hasztag `#`.

![](/public/courses/ubuntu-26-server/Images/samba-smb.conf.png)

### 1. Domyślne ustawienia w sekcji globalnej (<code>[global]</code>)

W oryginalnym pliku `smb.conf` sekcja `[global]` zawiera już domyślne dyrektywy:
- `workgroup = WORKGROUP` – nazwa grupy roboczej w sieci (domyślna dla Windows).
- `server role = standalone server` – serwer działa niezależnie (poza domeną Active Directory).
- `disable netbios = yes` – wyłączenie przestarzałego serwisu NetBIOS `nmbd`.

Możemy dodatkowo wzmocnić bezpieczeństwo połączeń SMB, dodając dyrektywy określające wersje protokołu oraz wymuszenie cyfrowego podpisywania:

```ini
[global]
   workgroup = WORKGROUP
   server min protocol = SMB2_02
   server max protocol = SMB3
   server signing = mandatory
```

**Co oznaczają te dodane dyrektywy?**
- `server min protocol = SMB2_02`: wyłącza obsługę przestarzałego i niebezpiecznego protokołu **_SMB1_** (podatnego na ataki ransomware, takie jak WannaCry).
- `server max protocol = SMB3`: zezwala na nowoczesne, szybkie protokoły SMB2 oraz SMB3.
- `server signing = mandatory`: wymusza cyfrowe podpisywanie pakietów SMB, chroniąc ruch przed przechwyceniem i modyfikacją w sieci.

![](/public/courses/ubuntu-26-server/Images/samba-smb.conf-global.png)

---

### 2. Definiowanie udziału sieciowego <code>[DANE]</code>

Przejdź na sam koniec pliku `smb.conf` i dopisz własną sekcję dla udziału `DANE`:

```ini
[DANE]
    path = /srv/dane
    valid users = labamba
    guest ok = no
    read only = no
    browsable = yes
    create mask = 0660
    directory mask = 0770
```

![edytor z sekcją DANE w pliku smb.conf](/public/courses/ubuntu-26-server/Images/samba-smb.conf-udział.png)

Rozłóżmy te opcje na czynniki pierwsze:
- `[DANE]`: nazwa zasobu widoczna dla klientów podłączających się przez sieć (np. `\\192.168.0.1\DANE`).
- `path = /srv/dane`: fizyczna ścieżka do katalogu na serwerze Ubuntu.
- `valid users = labamba`: lista użytkowników uprawnionych do zalogowania się do tego udziału.
- `guest ok = no`: blokuje dostęp anonimowy (bez podawania hasła).
- `read only = no`: zezwala użytkownikowi na zapisywanie i tworzenie nowych plików/katalogów.
- `browsable = yes`: udział będzie widoczny przy przeglądaniu zasobów serwera.
- `create mask = 0660`: nowe pliki tworzone przez użytkowników otrzymają uprawnienia `rw-rw----`.
- `directory mask = 0770`: nowe katalogi tworzone w udziale otrzymają uprawnienia `rwxrwx---`.

Zapisz plik <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span> i wyjdź <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span>.

---

### 3. Weryfikacja składni i restart usług

Samba posiada wbudowane narzędzie walidujące plik konfiguracyjny – `testparm`. Uruchom je, aby sprawdzić, czy nie popełniłeś błędu składniowego:

```bash
sudo testparm -s
```
`-s` jest zbędne, to zwykły skip na konieczność kliknięcia dodatkowego <kbd>Enter</kbd>.

`testparm` wypisze przetworzoną konfigurację czystych parametrów. Kluczowe jest pojawienie się komunikatu `Loaded services file OK.` na górze oraz sekcji `[DANE]` na dole tabeli.

![testparm](/public/courses/ubuntu-26-server/Images/samba-test-parm.png)

Jeśli `testparm` nie zgłasza żadnych błędów krytycznych, zrestartuj usługę Samby:

```bash
sudo systemctl restart smbd
```

Sprawdź jej status:

```bash
sudo systemctl status smbd
```

---

## 🐧 Połączenie z poziomu klienta Linux (Ubuntu Desktop)

Na maszynie klienckiej **Ubuntu Desktop 26.04** podłączonej do tej samej sieci wewnętrznej (`192.168.0.0/24`) otwieranie udziałów SMB wykonuje się bezpośrednio w graficznym menedżerze plików (Pliki / Nautilus):

1. Otwórz menedżer plików i w pasku nawigacji/adresu wpisz `smb://192.168.0.1/DANE` i zatwierdź <kbd>Enter</kbd>.
2. W oknie logowania wybierz opcję **Użytkownik zarejestrowany** (*Registered User*), wpisz nazwę użytkownika `labamba` oraz ustalone wcześniej hasło.
3. Dla testu uprawnień utwórz w udziale katalog oraz plik.

![Menedżer plików Ubuntu Desktop połączony z udziałem Samba](/public/courses/ubuntu-26-server/Images/samba-test-udziału-ubuntu-26-desktop.png)

---

## 💻 Połączenie z poziomu klienta Windows 11

Przejdźmy na drugi komputer kliencki z systemem **Windows 11**.

1. Otwarcie udziału w Eksploratorze plików

Naciśnij skrót klawiszowy <span style="white-space: nowrap;"><kbd>Win</kbd> + <kbd>E</kbd></span>, aby otworzyć okno *Eksplorator plików*, a następnie wpisz w pasku adresu ścieżkę do zasobu:

```text
\\192.168.0.1\DANE
```

2. W oknie logowania **Wprowadź poświadczenia sieciowe** wpisz nazwę użytkownika `labamba` oraz ustalone wcześniej hasło. 
   > [!TIP]
   > Jeśli Twój komputer w Windows jest zalogowany do konta Microsoft, Windows może próbować wysłać błędny login (np. `TwojMail@outlook.com`). W takim przypadku w polu użytkownika wpisz `.\labamba` (kropka i ukośnik wymuszają logowanie na konto lokalne serwera).
3. Dla testu uprawnień utwórz w udziale katalog oraz plik.

![Eksplorator Windows 11 otwarty pod adresem DANE](/public/courses/ubuntu-26-server/Images/samba-test-udziału-windows11.png)

---

## 📊 Podgląd aktywnych połączeń SMB (<code>smbstatus</code>)

Gdy komputer klienta Windows 11 lub Ubuntu Desktop utrzymuje aktywne połączenie z udziałem, na serwerze możemy w każdej chwili zweryfikować stan sesji sieciowych.

Służy do tego wbudowane polecenie:

```bash
sudo smbstatus
```

![wynik smbstatus przy aktywnym połączeniu](/public/courses/ubuntu-26-server/Images/samba-statystyki.png)

Wynik tego polecenia dostarcza szczegółowych informacji:
- **Samba version**: wersja pakietu Samby na serwerze (`4.23.6`).
- **Username / Group**: zidentyfikowany użytkownik (`labamba:labamba`).
- **Machine**: adresy IP podłączonych klientów (np. `192.168.0.2` oraz `192.168.0.4`).
- **Protocol Version**: wynegocjowana wersja protokołu – w naszym przypadku nowoczesne `SMB3_11`.
- **Signing**: aktywne cyfrowe podpisywanie pakietów (`AES-128-GMAC`), wynikające z dyrektywy `server signing = mandatory`.
- **Service / Path**: nazwa podpiętego udziału (`DANE`) oraz ścieżka `/srv/dane`.
- **Locked files**: podgląd otwartych plików i zasobów na serwerze.

Dodatkowo weryfikacja zawartości katalogu na serwerze przy użyciu `ls -l /srv/dane/` potwierdza poprawność utworzonych plików i folderów z obu systemów:

```bash
sudo ls -l /srv/dane/
```

W wyniku widać katalogi `test_katalogu_ubuntu` i `test_katalogu_windows` (uprawnienia `drwxrwx---+` z maski `0770`) oraz pliki `test_pliku_ubuntu.txt` i `test_pliku_windows.txt` (uprawnienia `-rw-rw---+` z maski `0660`).

---

> [!WARNING]
> **Dlaczego unikamy udziałów publicznych (<code>guest ok = yes</code>)?**
> W starszych poradnikach często spotkasz się z konfiguracją udziałów anonimowych bez podawania hasła (`guest ok = yes`). We współczesnych systemach Windows 10/11 oraz nowszych wydaniach Samby anonimowy dostęp jest **domyślnie zablokowany ze względów bezpieczeństwa** przez zasady grupy (*AllowInsecureGuestAuth = 0*).
> Próba otwarcia takiego udziału z klienta Windows 11 zakończy się błędem odmowy dostępu. Oprócz całkowitego wycofania protokołu SMB1, Microsoft znacząco zaostrzył politykę bezpieczeństwa, wymuszając logowanie nazwanym kontem użytkownika i cyfrowe podpisywanie pakietów.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Użytkownik Samby musi posiadać dwa konta: konto w systemie Linux (`adduser`) oraz wpis w bazie haseł Samby (`smbpasswd -a`).
- Dostęp do plików jest kontrolowany dwupoziomowo: przez konfigurację udziału w `smb.conf` oraz przez uprawnienia systemu plików POSIX w Ubuntu.
- Zawsze wyłączaj przestarzałe protokoły, ustawiając `server min protocol = SMB2_02` w sekcji `[global]`.
- Pamiętaj, że najnowsze systemy Windows 11 blokują anonimowe połączenia gościa (`guest ok = yes`), wymagając uwierzytelniania kontem.
- Do testowania i diagnostyki używaj `testparm` (składnia) oraz `smbstatus` (aktywne sesje). Na klientach używaj menedżera plików GUI w Ubuntu Desktop lub `net use` / Eksploratora plików w Windows 11.
