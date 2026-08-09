# Poczta w sieci lokalnej - Postfix

Serwer `mail.firma.test` ma przyjąć wiadomość wysłaną do `anna@firma.test` i zapisać ją w katalogu domowym użytkowniczki Anna.

To poczta wewnątrz sieci lokalnej. Wysyłanie wiadomości do Internetu wymaga osobnej konfiguracji DNS, TLS i ochrony przed nadużyciami.

## 📦 Instalacja Postfix

```bash
sudo apt update
sudo apt install postfix swaks
```

W instalatorze wybierz `Internet Site`. Jako `System mail name` wpisz `firma.test`.

Po instalacji zachowaj plik:

```bash
sudo cp -p /etc/postfix/main.cf /etc/postfix/main.cf.original
```

## 👤 Lokalny odbiorca

```bash
sudo adduser anna
```

Postfix dostarczy wiadomość do tego konta. Adres `anna@firma.test` nie zadziała bez lokalnego użytkownika `anna` albo osobno skonfigurowanego aliasu.

## 📝 Zmiana ustawień przez postconf

Nie przepisuj `main.cf`. Użyj programu dostarczonego przez Postfix:

```bash
sudo postconf -e 'myhostname = mail.firma.test'
sudo postconf -e 'mydomain = firma.test'
sudo postconf -e 'myorigin = $mydomain'
sudo postconf -e 'mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain'
sudo postconf -e 'mynetworks = 127.0.0.0/8, 192.168.50.0/24'
sudo postconf -e 'home_mailbox = Maildir/'
```

Odczytaj zapisane wartości:

```bash
postconf myhostname mydomain mydestination mynetworks home_mailbox
```

`mydestination` zawiera domeny dostarczane do lokalnych kont. `mynetworks` ogranicza komputery, którym serwer ufa przy wysyłaniu.

## ✅ Uruchomienie SMTP

```bash
sudo postfix check
sudo systemctl restart postfix
sudo ss -lntp | grep ':25 '
```

`postfix check` nie powinien wypisać błędu. W wyniku `ss` port 25 ma należeć do procesu Postfix.

> 📷 Zrzut `08-postfix-01-postconf.png`: terminal serwera z wartościami `myhostname`, `mydestination`, `mynetworks`, `home_mailbox` oraz wynikiem `ss` pokazującym port 25.

Jeżeli UFW jest włączona:

```bash
sudo ufw allow from 192.168.50.0/24 to any port 25 proto tcp
```

## 🐧 Wiadomość z Ubuntu Desktop

Na Ubuntu Desktop zainstaluj `swaks` i wykonaj:

```bash
sudo apt install swaks
swaks --server mail.firma.test --from ubuntu@firma.test --to anna@firma.test --header 'Subject: Proba z Ubuntu' --body 'Wiadomosc z Ubuntu Desktop'
```

W odpowiedzi serwera znajdź kod:

```text
250 2.0.0 Ok: queued as ...
```

Kod `250` oznacza, że serwer przyjął wiadomość.

> 📷 Zrzut `08-postfix-02-ubuntu.png`: terminal Ubuntu Desktop z poleceniem `swaks` oraz końcową odpowiedzią `250 2.0.0`. Muszą być widoczne adres odbiorcy i identyfikator kolejki.

## 🪟 Wiadomość z Windows 11

W Terminalu Windows sprawdź, czy `curl.exe` obsługuje SMTP:

```bat
curl.exe --version
```

W wierszu `Protocols` musi występować `smtp`. Utwórz plik `wiadomosc.txt` z treścią:

```text
From: windows@firma.test
To: anna@firma.test
Subject: Proba z Windows 11

Wiadomosc z Windows 11.
```

Wyślij go:

```bat
curl.exe --verbose --url smtp://mail.firma.test --mail-from windows@firma.test --mail-rcpt anna@firma.test --upload-file wiadomosc.txt
```

W odpowiedzi odszukaj kod `250` po przesłaniu treści wiadomości.

> 📷 Zrzut `08-postfix-03-windows.png`: Terminal Windows 11 z poleceniem `curl.exe`, adresem `mail.firma.test` i odpowiedzią SMTP `250` po wysłaniu wiadomości.

Na serwerze odszukaj dostarczony plik:

```bash
sudo find /home/anna/Maildir/new -maxdepth 1 -type f
```

Powinny istnieć dwa nowe pliki. Otwórz je przez `sudo less`. Jeden ma zawierać temat `Proba z Ubuntu`, a drugi `Proba z Windows 11`.

> 📷 Zrzut `08-postfix-04-maildir.png`: terminal serwera z dwoma plikami w `Maildir/new` oraz nagłówkami `From` i `Subject` odczytanymi z obu wiadomości.

Sprawdź też dziennik:

```bash
sudo journalctl -u postfix -n 30 --no-pager
```

## ✍️ Drugi odbiorca

Utwórz użytkownika `piotr`. Wyślij do niego wiadomość o innym temacie.

Pokaż plik w `/home/piotr/Maildir/new`. Sprawdź również, czy wiadomość Anny nadal znajduje się w jej własnym katalogu.

<details>
<summary>Wynik</summary>

Postfix powinien utworzyć osobne katalogi `Maildir` po dostarczeniu pierwszej wiadomości do każdego użytkownika. Wiadomość do Piotra nie może trafić do katalogu Anny.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- `postconf` zmienia wybrane ustawienia istniejącego `main.cf`.
- Lokalny adres pocztowy wymaga lokalnego konta użytkownika.
- Kod SMTP potwierdza przyjęcie, a plik w `Maildir` potwierdza dostarczenie.
