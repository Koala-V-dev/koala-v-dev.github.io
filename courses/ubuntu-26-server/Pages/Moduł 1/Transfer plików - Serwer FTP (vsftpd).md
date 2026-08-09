# Transfer plików – Serwer FTP (vsftpd)

Protokół **FTP** (*File Transfer Protocol*) to jeden z najstarszych protokołów sieciowych służących do przesyłania plików między maszynami.

> [!NOTE]
> FTP działą na portach 20 i 21.
> - Port 20 służy do przesyłania danych.
> - Port 21 służy do kontroli.
> - FTP nie jest szyfrowanym protokołem.
>
> Szyfrowanie jest możliwe dzieki TLS (FTPS) lub SSH (SFTP).
> - FTPS - Port 21: TLS (Transport Layer Security) dynamicznie wybiera sobie porty do przesyłania danych.
> - SFTP - Port 22: SSH (Secure Shell) transfer plików również odbywa się po porcie 22.
>
> FTPS jest troszkę mniej bezpieczny ale za to szybszy niż SFTP.

---

## 📦 Instalacja serwera FTP (vsftpd) i konto użytkownika

Zainstalujmy pakiet serwera **vsftpd**:

```bash
sudo apt update
sudo apt install vsftpd -y
```

---

### 👤 Utworzenie konta użytkownika i struktury katalogów

Ze względów bezpieczeństwa serwer `vsftpd` nakłada surowe obostrzenie: **katalog główny objęty mechanizmem `chroot` nie może być zapisywalny przez użytkownika**.

Dlatego nasza konfiguracja FTP-a bedzie następująca następującą strukturę:
- `/home/karol` – katalog domowy należący do użytkownika `root` (brak prawa zapisu dla Karola).
- `/home/karol/upload` – podkatalog należący do `karol`, wy którym użytkownik będzie mógł działać.

Tworzymy użytkownika `karol`:

```bash
sudo adduser karol
```

Tworzymy katalog i ustawiamy odpowiednich właścicieli i uprawnienia:

```bash
sudo mkdir -p /home/karol/upload

sudo chown karol:karol /home/karol/upload
sudo chown root:root /home/karol

sudo chmod 755 /home/karol
```

Sprawdźmy poprawność nadanych uprawnień:

```bash
ls -ld /home/karol /home/karol/upload
```
> Dzieki opcji `-d` możesz wskazać konkretny katalog do sprawdzenia zamiast jego zawartości.

![](/public/courses/ubuntu-26-server/Images/vsftp_user_dir.png)

---

## 📝 Konfiguracja serwera vsftpd (<code>/etc/vsftpd.conf</code>)

Ogólnie wiekszość roboty już zrobiliśmy w sekcji wyżej. Teraz pozostało jedynie odkomentować pare linii.

Otwórz plik konfiguracyjny do edycji w edytorze `nano`:

```bash
sudo nano -l /etc/vsftpd.conf
```

Domyślnie powinny być odkomentowane:

<details>
<summary>Własciwości usługi vsftpd</summary>

- `listen=NO`: wyłącza osobne nasłuchiwanie na gnieździe IPv4.
- `listen_ipv6=YES`: uruchamia nasłuchiwanie na gnieździe IPv6, które domyślnie przyjmuje również połączenia IPv4.
- `anonymous_enable=NO`: blokuje logowanie anonimowe.
- `local_enable=YES`: pozwala logować się użytkownikom istniejącym w Ubuntu.
- `dirmessage_enable=YES`: pozwala wyświetlić komunikat z pliku `.message` po wejściu do katalogu.
- `use_localtime=YES`: pokazuje czas plików zgodnie z lokalną strefą czasową serwera.
- `xferlog_enable=YES`: zapisuje informacje o wysyłaniu i pobieraniu plików.
- `connect_from_port_20=YES`: w trybie aktywnym wysyła dane z portu `20` serwera.
- `secure_chroot_dir=/var/run/vsftpd/empty`: wskazuje pusty katalog używany przez `vsftpd` podczas izolowania części procesu.
- `pam_service_name=vsftpd`: wybiera reguły logowania PAM z pliku `/etc/pam.d/vsftpd`.
- `rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem`: wskazuje certyfikat TLS dostarczony z systemem.
- `rsa_private_key_file=/etc/ssl/private/ssl-cert-snakeoil.key`: wskazuje klucz prywatny pasujący do certyfikatu.
- `ssl_enable=NO`: pozostawia szyfrowanie TLS wyłączone.

</details>

Na początek zainteresuje nas następująca konfiguracja do odkomentowania:

- `write_enable=YES`: pozwala zalogowanym użytkownikom wysyłać, usuwać i zmieniać nazwy plików.
- `chroot_local_user=YES`: ogranicza użytkownika do jego katalogu domowego.

Pozostało ci tylko zrestartować i sprawdzić status.

```bash
sudo systemctl restart vsftpd
sudo systemctl status vsftpd
```

aby połączyć się z udziałem FTP wystarczy podobnie jak w przypadku Samby i protokołu smb wpisać adres w eksploratorze plików:

```bash
ftp://192.168.0.1
```
Podajemy dane uwierzytelniające użytkownika `karol` i hasło.  
Jak widać na udziale jest katalog `upload` i obok niego nie można nic utworzyć. Natomiast wewnątrz katalogu `upload` mamy pełne prawa do zapisu i tworzenia plików. 

![](/public/courses/ubuntu-26-server/Images/FTP_ubuntu_26_desktop_test.png)

Podobnie ma się sytuacja w Windows 11:

![](/public/courses/ubuntu-26-server/Images/FTP_windows11_test.png)

---

## 🧠 Co tak naprawdę skonfigurowaliśmy?

Trzy dyrektywy odpowiadają za najważniejsze zachowanie serwera:

- `local_enable=YES` – zezwala lokalnym użytkownikom Ubuntu, takim jak `karol`, na logowanie do usługi FTP.
- `write_enable=YES` – zezwala na polecenia zmieniające zawartość systemu plików, między innymi wysyłanie, usuwanie i zmianę nazw plików.
- `chroot_local_user=YES` – zamyka użytkownika w jego katalogu domowym. Dla Karola katalog `/home/karol` staje się najwyższym widocznym poziomem i klient FTP pokazuje go jako `/`.

Dlatego katalog `upload` widziany w kliencie FTP jest w rzeczywistości katalogiem `/home/karol/upload` na serwerze.

FTP używa dwóch połączeń. Połączenie sterujące na porcie TCP `21` przenosi login, hasło oraz polecenia. Osobnym połączeniem przesyłana jest lista katalogów i zawartość plików.

---

## 🔓 Szyfrowane warianty FTP

Zwykły FTP nie szyfruje logowania ani przesyłanych plików.
Można to zmienić wykorzystując jedną z dwóch wariacji:

- **FTPS** (*FTP Secure - jawny FTP szyfrowany TLS*):
  - `vsftpd` jest w stanie go obsłużyć,
  - port `21`,
- **SFTP** (*SSH File Transfer Protocol*):
  - działa na `OpenSSH`,
  - port `22`,


---

## 🔐 FTPS poprzez TLS

Do obsługi FTPS wymagany jest certyfikat który vsftpd dostarcza domyślnie przy instalacji. Oczywiście jest to cert samopodpisany więc każde oprogramowanie które się bedzie z nim łączyć zgłosi ostrzeżenie że certyfikat jest niewiarygodny. 

Jedyne co musisz zrobić to ponownie wejść to poliku `/etc/vsftpd.conf` i na samym końcu zmienić wpis:

```ini
ssl_enable=NO
```

na:

```ini
ssl_enable=YES
```
Po czym restartujesz usługę:

```bash
sudo systemctl restart vsftpd
sudo systemctl status vsftpd
```

### 🔐 SFTP poprzez SSH

Chcąc skorzystać z połączenia SFTP wystarczy że na serwerze jest zainstalowane openssh.
Zweryfikuj czuy u ciebie działa:

```bash
sudo systemctl status ssh
```

Jeżeli nie to doinstaluj i uruchom usługę:

```bash
sudo apt install openssh
sudo systemctl enable --now ssh
```


### 💻 Połączenie szyfrowanym FTP na Windows 11

Tym razem eksplorator plików nie wystarczy i bedzie potrzebny dodatkowy program.
- Windows 11: **_FileZilla_** lub **Cyberduck**.

W programie **Cyberduck** utwórz nowe połączenie:

- Otwórz połączenie
- Wybierz **FTP-SSL (Explicit AUTH TLS)**
- Wpisz adres `192.168.0.1`
- Wpisz użytkownika i hasło
- Kliknij Połącz

> Oczywiście zobaczysz ostrzeżenie że cert jest trefny i łączysz się z serwerem podszywającym się pod inny.  
> Możesz podejrzeć sobie ten cert a potem kliknąć kontynuuj, wszak to twój serwer. 😉

![](/public/courses/ubuntu-26-server/Images/ftps-windows11.png)

---

W cyberduck wystarczy zmienić typ połączenia na **SFTP (bezpieczny transfer plików SSH)**

Wtedy zamiast powiadomienia o trefnym certyfikacie bedziesz pyanay o pozwolenie na każdą akcję wyrażoną kluczem:

![](/public/courses/ubuntu-26-server/Images/sftp-windows11.png)

### 🐧 Połączenie szyfrowanym FTP na Ubuntu Desktop

W tym przypadku skorzystamy z FileZilli.
Zainstaluj ją poprzez terminal:
```bash
sudo apt install filezilla
```

Filezilla domyślnie jeżeli wskarzesz jej port 21 to bedzie próbowała połączyć się z TLS a jak się nie uda to połączy się nieszyfrowanym FTP:

![](/public/courses/ubuntu-26-server/Images/ftps-ubuntu.png)

> Możesz zaóważyć że plik z windowsa ma dziwne znaczki zamiast polskich. Spowodowane jest to kodowaniem znaków typowym dla windowsa: **Windows-1250**.

Chcąc skorzystać z SFTP wystarczy podać port 22 zamiast 21 i wtedy zobaczysz następujący komunikat:

![](/public/courses/ubuntu-26-server/Images/sftp-ubuntu.png)


### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Protokoły i usługi**: `vsftpd` obsługuje nieszyfrowany FTP oraz FTPS (FTP Secure). **SFTP to nie FTP** – opiera się na protokole SSH i usłudze OpenSSH (`ssh`).
- **Różnice w portach i działaniu**:
  - **FTP**: Działa na portach `21` (sterowanie) i `20` (dane); brak szyfrowania (dane i logowanie jawne).
  - **FTPS (Explicit)**: Łączy się na porcie `21`, po czym włącza szyfrowanie TLS poleceniem `AUTH TLS`.
  - **SFTP**: Wszystkie operacje i dane przesyła w jednym szyfrowanym kanale SSH na porcie `22`.
- **Wymogi bezpieczeństwa `chroot`**: Katalog domowy użytkownika objęty `chroot` (np. `/home/karol`) nie może mieć praw zapisu i musi należeć do `root:root`. Prawa zapisu nadajemy w wybranym podkatalogu (np. `/home/karol/upload`).
- **Kluczowa konfiguracja (`/etc/vsftpd.conf`)**:
  - `local_enable=YES` – zezwala na logowanie użytkowników systemowych.
  - `write_enable=YES` – włącza uprawnienia zapisu, wgrywania i usuwania plików.
  - `chroot_local_user=YES` – izoluje użytkownika w jego katalogu domowym (widocznym jako `/`).
  - `ssl_enable=YES` – aktywuje obsługę szyfrowania FTPS.
- **Aplikacje klienckie**: O ile z niekodowanym FTP poradzi sobie Eksplorator plików, o tyle połączenia FTPS i SFTP wymagają klientów GUI takich jak FileZilla lub Cyberduck.
