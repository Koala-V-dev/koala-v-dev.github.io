# Szyfrowanie SSL/TLS oraz protokoły HTTP/2 i HTTP/3 (Apache2 & Nginx)

Po skonfigurowaniu serwerów WWW do obsługi stron i aplikacji pora zabezpieczyć ruch sieciowy szyfrowaniem **SSL/TLS (HTTPS)** oraz uruchomić nowocześniejsze protokoły transmisji danych: **HTTP/2** i **HTTP/3**.

---

## 🚀 Ewolucja protokołów HTTP

| Protokół | Warstwa transportowa | Główne cechy i zalety | Wymaga SSL/TLS? |
| :--- | :--- | :--- | :--- |
| **HTTP/1.1** | TCP | Przesyła tekst nagłówków. Jeden plik pobierany na jedno połączenie (lub w kolejce). | Nie (działa na port 80) |
| **HTTP/2** | TCP + TLS | **Wielopotokowość (Multiplexing):** pobiera wiele plików naraz przez jedno połączenie TCP. Kompresja nagłówków (HPACK). | **Tak** (w przeglądarkach) |
| **HTTP/3** | **UDP (QUIC)** + TLS 1.3 | **Brak blokowania (Head-of-Line Blocking):** utrata jednego pakietu nie zatrzymuje pobierania reszty. Szybsze nawiązywanie połączenia. | **Tak** (wymagane z definicji) |

> ⚠️ **Kluczowa zasada:** Wszystkie współczesne przeglądarki internetowe (Chrome, Firefox, Edge, Safari) wymagają nawiązanego połączenia szyfrowanego **HTTPS (port 443)**, aby przełączyć się na protokół HTTP/2 lub HTTP/3.

---

## 🔑 Krok 1: Generowanie samopodpisanego certyfikatu SSL

W środowisku produkcyjnym korzysta się z bezpłatnych, zaufanych certyfikatów **Let's Encrypt**. Na potrzeby testów w sieci lokalnej lub na maszynie wirtualnej wygenerujemy własny certyfikat samopodpisany (Self-Signed Certificate) za pomocą narzędzia `openssl`:

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/server-selfsigned.key \
  -out /etc/ssl/certs/server-selfsigned.crt
```

Podczas generowania możesz naciskać <kbd>Enter</kbd> przy pytaniach o dane organizacji, lub wypełnić je dowolnie.

Sprawdź uprawnienia klucza prywatnego (powinien być dostępny tylko dla administratora):

```bash
sudo chmod 600 /etc/ssl/private/server-selfsigned.key
```

---

## ⚡ Krok 2: Konfiguracja Nginx (HTTPS, HTTP/2 i HTTP/3 QUIC)

Współczesne wersje Nginx (od wersji 1.25+) posiadają natywne wsparcie dla HTTP/2 oraz HTTP/3.

Otwórz lub utwórz plik konfiguracyjny wirtualnego hosta:

```bash
sudo nano /etc/nginx/sites-available/test-ssl
```

Wklej poniższą konfigurację:

```nginx
# Przekierowanie ruchu z HTTP (port 80) na HTTPS (port 443)
server {
    listen 80;
    listen [::]:80;
    server_name www.test.local test.local;

    return 301 https://$host$request_uri;
}

# Główny blok HTTPS / HTTP/2 / HTTP/3
server {
    # Port 443 dla klasycznego TCP (HTTPS)
    listen 443 ssl;
    listen [::]:443 ssl;

    # Port 443 dla UDP (HTTP/3 / QUIC)
    listen 443 quic reuseport;
    listen [::]:443 quic reuseport;

    server_name www.test.local test.local;

    root /var/www/test;
    index index.php index.html;

    # Certyfikaty SSL
    ssl_certificate /etc/ssl/certs/server-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/server-selfsigned.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # Włączenie HTTP/2 oraz HTTP/3
    http2 on;
    http3 on;

    # Informowanie przeglądarki o dostępności połączenia HTTP/3 (QUIC)
    add_header Alt-Svc 'h3=":443"; ma=86400';

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
    }
}
```

### 🔍 Wyjaśnienie kluczowych dyrektyw Nginx:
- `listen 443 quic reuseport;` — otwiera port `443` na protokole **UDP** do obsługi protokołu QUIC (HTTP/3).
- `http2 on;` i `http3 on;` — aktywuje obsługę obu protokołów w Nginx.
- `add_header Alt-Svc 'h3=":443"; ma=86400';` — wysyła w nagłówku informację dla przeglądarki, że pod portem 443 UDP dostępny jest serwer HTTP/3.

Włącz witrynę, przetestuj i przeładuj Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/test-ssl /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧱 Krok 3: Konfiguracja Apache2 (HTTPS & HTTP/2)

W serwerze Apache2 obsługa SSL oraz HTTP/2 opiera się na dedykowanych modułach.

### 1. Włączenie niezbędnych modułów Apache:

```bash
sudo a2enmod ssl http2 rewrite
```

### 2. Utworzenie wirtualnego hosta SSL:

```bash
sudo nano /etc/apache2/sites-available/test-ssl.conf
```

Wklej konfigurację:

```apache
# Przekierowanie HTTP -> HTTPS
<VirtualHost *:80>
    ServerName www.test.local
    ServerAlias test.local
    Redirect permanent / https://www.test.local/
</VirtualHost>

# Wirtualny Host HTTPS z HTTP/2
<VirtualHost *:443>
    ServerName www.test.local
    ServerAlias test.local
    DocumentRoot /var/www/test

    # Włączenie obsługi HTTP/2 oraz HTTP/1.1 jako fallback
    Protocols h2 http/1.1

    # Włączenie silnika SSL
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/server-selfsigned.crt
    SSLCertificateKeyFile /etc/ssl/private/server-selfsigned.key

    <Directory /var/www/test>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### 🔍 Wyjaśnienie kluczowych dyrektyw Apache:
- `Protocols h2 http/1.1` — nakazuje Apache próbowanie połączenia przez **HTTP/2 (`h2`)**, a jeśli przeglądarka go nie obsługuje, spadek do HTTP/1.1.
- `SSLEngine on` — aktywuje szyfrowanie SSL/TLS dla danego wirtualnego hosta.

Włącz witrynę i przetestuj konfigurację:

```bash
sudo a2ensite test-ssl.conf
sudo apachectl configtest
sudo systemctl restart apache2
```

---

## 🧪 Krok 4: Weryfikacja działania w przeglądarce i konsoli

### 1. Przeglądarka internetowa:
1. Otwórz adres `https://www.test.local`.
2. Otrzymasz ostrzeżenie o bezpieczeństwie (*„Połączenie nie jest prywatne”*) — jest to normalne dla certyfikatów samopodpisanych. Kliknij **Zaawansowane → Przejdź do strony**.
3. Otwórz Narzędzia Deweloperskie (<kbd>F12</kbd>) i przejdź do zakładki **Sieć (Network)**.
4. Kliknij prawym przyciskiem myszy na nagłówek tabeli (np. *Nazwa*) i zaznacz kolumnę **Protokół (Protocol)**.
5. Zobaczysz oznaczenie:
   - `h2` — dla połączeń **HTTP/2**.
   - `h3` — dla połączeń **HTTP/3 (QUIC)**.

### 2. Konsola (curl):
Możesz przetestować serwer poleceniem `curl`:

```bash
# Weryfikacja HTTP/2 (parametr -k ignoruje ostrzeżenie o certyfikacie samopodpisanym)
curl -I -k --http2 https://www.test.local
```

---

## 🔒 Certyfikaty produkcyjne (Let's Encrypt & Certbot)

Gdy Twój serwer jest widoczny w publicznym internecie pod zarejestrowaną domeną (np. `mojadomena.pl`), certyfikaty samopodpisane zastępuje się darmowymi certyfikatami z **Let's Encrypt**.

Zainstaluj narzędzie Certbot dla wybranego serwera:

```bash
# Dla Nginx:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mojadomena.pl -d www.mojadomena.pl

# Dla Apache2:
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d mojadomena.pl -d www.mojadomena.pl
```

Certbot automatycznie zweryfikuje domenę, pobierze certyfikaty, dopisze je do konfiguracji serwera oraz skonfiguruje automatyczne odnawianie (co 90 dni).
