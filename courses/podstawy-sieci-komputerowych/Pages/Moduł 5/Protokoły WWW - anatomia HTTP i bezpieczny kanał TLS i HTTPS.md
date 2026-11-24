# Protokoły WWW - anatomia HTTP i bezpieczny kanał TLS i HTTPS

Gdy wpisujesz adres URL w przeglądarce, protokół **HTTP** (*Hypertext Transfer Protocol*, RFC 9110) generuje tekstowe żądanie wysyłane przez port TCP 80. W nieszyfrowanym HTTP każde hasło, ciasteczko sesyjne i nagłówek wędrują przez sieć jawnym tekstem, więc dowolny sniffer w tej samej sieci może je przechwycić. Bezpieczny protokół **HTTPS** (port TCP 443) opakowuje transmisję w szyfrowany kanał **TLS 1.3**. Po tej lekcji będziesz umiał przeanalizować nagłówki i kody odpowiedzi HTTP (`200`, `301`, `403`, `404`, `500`), wygenerować certyfikat X.509 za pomocą OpenSSL oraz skonfigurować przekierowanie ruchu HTTP na HTTPS (zadanie egzaminacyjne INF.02).

## 🔒 Laboratorium HTTP, certyfikatu X.509 i tunelu TLS

Porównaj jawny podgląd `tcpdump` dla HTTP z zaszyfrowanym ruchem TLS 1.3, sprawdź pola certyfikatu X.509 oraz przetestuj typowe kody odpowiedzi serwera WWW.

<data-http-tls-analyzer></data-http-tls-analyzer>

![Anatomia żądania HTTP i tunel szyfrowany TLS](/public/courses/podstawy-sieci-komputerowych/Images/http-request-response-i-tls.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź surową odpowiedź serwera WWW i nagłówki HTTP za pomocą narzędzia `curl` w terminalu.

Na systemie **Windows (PowerShell)** lub **Linux**:

```bash
curl -I http://example.com
```

Zwróć uwagę na strukturę pierwszej linii odpowiedzi oraz nagłówki:

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1256
Server: ECS (dsa/10A)
```

> [!NOTE]
> Kluczowe kody odpowiedzi HTTP wymagane w zadaniach egzaminacyjnych INF.02:
> - **200 OK:** Żądanie powiodło się, serwer zwrócił zawartość pliku.
> - **301 Moved Permanently:** Zasób został trwale przeniesiony pod nowy adres URL (wskazany w nagłówku `Location:`).
> - **403 Forbidden:** Serwer odmawia dostępu z powodu braku uprawnień do pliku/katalogu na dysku.
> - **404 Not Found:** Wskazany plik nie istnieje w katalogu głównym serwera (`DocumentRoot`).
> - **500 Internal Server Error:** Błąd krytyczny w kodzie skryptu serwera (np. błąd składni w PHP/Python).

---

## ⚙️ Zmiana istniejącej konfiguracji

Zrealizujmy zadanie egzaminacyjne **INF.02**:
Włącz obsługę bezpiecznego protokołu HTTPS na serwerze Apache/Nginx z wykorzystaniem certyfikatu X.509.

### 🔑 Krok 1: Wygenerowanie pary kluczy i samopodpisanego certyfikatu OpenSSL

W terminalu serwera:

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/apache-selfsigned.key \
  -out /etc/ssl/certs/apache-selfsigned.crt \
  -subj "/C=PL/ST=Polska/L=Warszawa/O=Szkola/CN=serwer1.szkola.local"
```

### ⚙️ Krok 2: Konfiguracja wirtualnego hosta SSL w Apache (`/etc/apache2/sites-available/default-ssl.conf`)

Wskaż wygenerowany certyfikat i klucz prywatny:

```text
<VirtualHost *:443>
    ServerAdmin admin@szkola.local
    ServerName serwer1.szkola.local
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
    SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key
</VirtualHost>
```

Dla serwera **Nginx** (`/etc/nginx/sites-available/default`):

```text
server {
    listen 443 ssl;
    server_name serwer1.szkola.local;
    root /var/www/html;

    ssl_certificate /etc/ssl/certs/apache-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/apache-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;
}
```

Test składni przed restartem usługi:

```bash
# Dla Apache
sudo apache2ctl configtest

# Dla Nginx
sudo nginx -t
```

Zastosowanie zmian:

```bash
sudo a2enmod ssl
sudo a2ensite default-ssl
sudo systemctl restart apache2
```

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj działanie szyfrowanego kanału HTTPS z poziomu stacji roboczej klienta.

W wierszu poleceń klienta:

```bash
# Przełącznik -k ignoruje ostrzeżenie o samopodpisanym certyfikacie (Self-Signed)
curl -v -k https://192.168.10.2
```

Oczekiwany dowód zestawienia szyfrowanej sesji TLS:

```text
* Connected to 192.168.10.2 (192.168.10.2) port 443
* ALPN: server accepted http/1.1
* Server certificate:
*  subject: C=PL; ST=Polska; L=Warszawa; O=Szkola; CN=serwer1.szkola.local
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
> GET / HTTP/1.1
> Host: 192.168.10.2
< HTTP/1.1 200 OK
```

Zwróć uwagę: połączenie zostało zrealizowane przez port **443** z użyciem szyfru **AES-256-GCM**.

---

## 🛠️ Samodzielna próba

Użytkownicy często omyłkowo wpisują w przeglądarce adres z przedrostkiem `http://` zamiast `https://`. Twoim zadaniem jest wymuszenie automatycznego przekierowania całego nieszyfrowanego ruchu z portu 80 na bezpieczny port 443 za pomocą kodu stanu **301 Moved Permanently**.

Twoje zadanie:
1. Skonfiguruj wirtualnego hosta portu 80 tak, aby zwracał stałe przekierowanie 301 na adres HTTPS.
2. W Apache w pliku `/etc/apache2/sites-available/000-default.conf` dodaj regułę:
   ```text
   <VirtualHost *:80>
       ServerName serwer1.szkola.local
       Redirect permanent / https://serwer1.szkola.local/
   </VirtualHost>
   ```
3. Przeładuj usługę i przetestuj zapytanie nagłówkowe `curl -I http://192.168.10.2`.

Kryteria ukończenia:
- Zapytanie na port 80 zwraca kod `HTTP/1.1 301 Moved Permanently`.
- W nagłówku odpowiedzi widnieje pole `Location: https://serwer1.szkola.local/`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Dla serwera Nginx konfiguracja przekierowania 301:
```text
server {
    listen 80;
    server_name serwer1.szkola.local;
    return 301 https://$host$request_uri;
}
```

Weryfikacja z klienta:
```bash
curl -I http://192.168.10.2
```

Poprawny wynik:
```text
HTTP/1.1 301 Moved Permanently
Location: https://serwer1.szkola.local/
Content-Length: 0
Connection: close
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Kody odpowiedzi HTTP i porty HTTPS

<data-gate>
  <data-connection-matcher title="Połącz kod stanu HTTP lub element TLS z właściwym znaczeniem">
    <div class="cmw-item" data-left="200 OK" data-right="Poprawna realizacja żądania i zwrócenie zasobu"></div>
    <div class="cmw-item" data-left="301 Moved Permanently" data-right="Stałe przekierowanie URL (np. z HTTP :80 na HTTPS :443)"></div>
    <div class="cmw-item" data-left="403 Forbidden" data-right="Odmowa dostępu z powodu braku uprawnień serwera do pliku"></div>
    <div class="cmw-item" data-left="404 Not Found" data-right="Wskazany plik nie istnieje w katalogu DocumentRoot"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Różnica portów:** Nieszyfrowany protokół HTTP działa na porcie **TCP 80**, natomiast bezpieczny szyfrowany HTTPS działa na porcie **TCP 443**.
- **Kody przekierowań:** Kod `301 Moved Permanently` nakazuje przeglądarce i wyszukiwarkom trwałe zaktualizowanie adresu w pamięci podręcznej i natychmiastowe przejście na protokół HTTPS.
- **Rola certyfikatów X.509:** Certyfikat cyfrowy wiąże domenę serwera z jego kluczem publicznym. W środowisku produkcyjnym certyfikaty muszą być podpisane przez zaufany urząd Root CA (np. Let's Encrypt), aby przeglądarki nie wyświetlały ostrzeżeń o zagrożeniu bezpieczeństwa.
