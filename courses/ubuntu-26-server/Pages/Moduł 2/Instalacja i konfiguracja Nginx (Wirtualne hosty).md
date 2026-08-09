# Instalacja i konfiguracja Nginx (Wirtualne hosty)

**Nginx** to wydajny serwer WWW i reverse proxy. Potrafi udostępniać pliki statyczne, obsługiwać wiele domen na jednym adresie IP oraz bezpiecznie przekazywać żądania do wewnętrznych aplikacji.

W przeciwieństwie do serwera Apache, który analizuje pliki `.htaccess` przy każdym żądaniu, Nginx przechowuje konfigurację centralnie. Obsługuje połączenia w modelu zdarzeniowym, dzięki czemu jeden proces roboczy z łatwością obsługuje tysiące równoległych klientów.

---

## 📦 Instalacja Nginx

Zainstaluj pakiet `nginx`:

```bash
sudo apt update
sudo apt install nginx
```

Po zakończeniu instalacji sprawdź stan usługi:

```bash
sudo systemctl status nginx
```

Otwórz w przeglądarce adres IP swojego serwera:

```text
http://192.168.0.1
```

Strona *„Welcome to nginx!”* już na start zniechęca wyglądając jak error w Firefox. 😅

![welcome nginx](/public/courses/ubuntu-26-server/Images/welcome_nginx.png)

---

## 🌐 Pierwszy wirtualny host

Utwórz katalog dla nowej witryny oraz prostą stronę testową:

```bash
sudo mkdir -p /var/www/test
sudo nano /var/www/test/index.html
```

```html
<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <title>Nginx</title>
</head>
<body>
    <h1>Nginx działa</h1>
</body>
</html>
```

---

Nginx dostarcza gotowy szablon w `/etc/nginx/sites-available/default`. Skopiuj go jako nowy plik konfiguracyjny:

```bash
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/test
sudo nano -l /etc/nginx/sites-available/test
```

W bloku `server` zmień trzy podstawowe dyrektywy:

```nginx
root /var/www/test;
index index.html;
server_name www.test.local;
```

Dyrektywa `server_name` określa domenę witryny, a `root` ścieżkę do plików.

![nginx virtual host](/public/courses/ubuntu-26-server/Images/nginx-virtual-host.png)

Aktywuj nową konfigurację:

```bash
sudo ln -s /etc/nginx/sites-available/test /etc/nginx/sites-enabled/test
```

Upewnij się, że dowiązanie symboliczne tworzone poleceniem `ln` wskazuje bezpośrednio na plik. W razie pomyłki użyj polecenia `unlink`.

Przetestuj poprawność pliku konfiguracyjnego przed przeładowaniem usługi:

```bash
sudo nginx -t
```

![Pokaz błędu z ln i jego naprawa](/public/courses/ubuntu-26-server/Images/nginix-złe-dowiązanie.png)



Po uzyskaniu komunikatu **syntax is ok** zrestartuj usługę:

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

Dodaj wpis domeny w pliku `hosts` na komputerze klienckim:

- **Ubuntu:** `/etc/hosts`
- **Windows:** `C:\Windows\System32\drivers\etc\hosts`

```text
192.168.0.1   www.test.local
```

![Działanie testowej stronki hosta nginix na kliencie Ubuntu](/public/courses/ubuntu-26-server/Images/nginix-test-stronki.png)

---

## 🐘 Obsługa PHP przez PHP-FPM

Nginx nie posiada modułu wykonującego PHP. Przekazuje taki plik do osobnej usługi **PHP-FPM**, a następnie wysyła klientowi otrzymaną odpowiedź.

Zainstaluj PHP-FPM:

```bash
sudo apt install php-fpm
sudo systemctl status php8.5-fpm
```

Zmień rozszerzenie strony testowej i otwórz ją w edytorze:

```bash
sudo mv /var/www/test/index.html /var/www/test/index.php
sudo nano /var/www/test/index.php
```

Dodaj do treści krótki fragment PHP:

```php
<h1>Nginx działa</h1>

<?php
echo "PHP wykonuje usługa " . php_sapi_name();
```

![nginx php](/public/courses/ubuntu-26-server/Images/nginix-php-file.png)

---

Ponownie otwórz `/etc/nginx/sites-available/test`. W dyrektywie `index` dodaj `index.php`:

```nginx
index index.php index.html index.htm index.nginx-debian.html;
```

Templatka zawiera już blok *„pass PHP scripts to FastCGI server”* oraz dwa warianty dyrektywy `fastcgi_pass`.  
PHP-FPM w Ubuntu nasłuchuje domyślnie przez lokalne gniazdo Unix, dlatego odkomentuj ten wariant i zmień numer wersji PHP na **`8.5`**:

```nginx
location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.5-fpm.sock;
}
```

`location ~ \.php$` wybiera pliki z rozszerzeniem `.php`. `fastcgi_pass` wskazuje gniazdo usługi, która ma je wykonać.

Drugi wariant `127.0.0.1:9000` to połączenie po sieci (TCP). Przydaje się wtedy, gdy PHP-FPM stoi w osobnym kontenerze Docker albo na osobnym serwerze.

Ponieważ u nas Nginx i PHP-FPM działają na tej samej maszynie, lokalne gniazdo `/run/php/php8.5-fpm.sock` jest szybsze i w zupełności wystarczy.

Pamiętaj, że w jednym bloku `location` ma być tylko jedna aktywna linijka `fastcgi_pass`. Odkomentowanie obu naraz wywali błąd zduplikowanej dyrektywy przy `sudo nginx -t`.

---

Sprawdź konfigurację i przeładuj Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Po odświeżeniu `http://www.test.local` przeglądarka powinna wyświetlić nazwę interfejsu `fpm-fcgi`. Oznacza to, że żądanie przeszło przez Nginx do PHP-FPM i wróciło jako gotowa odpowiedź HTML.

![](/public/courses/ubuntu-26-server/Images/nginx-test-php.png)

---

## 🗄️ MySQL i moduł PHP

```bash
sudo apt install mysql-server php-mysql
sudo systemctl status mysql
sudo systemctl restart php8.5-fpm
```

Pakiet `php-mysql` daje PHP możliwość gadania z bazą danych (instaluje moduły `mysqli` oraz `pdo_mysql`). Pamiętaj o restarcie PHP-FPM, żeby wczytał te nowe rozszerzenia.

```bash
sudo mysql
```

```sql
CREATE DATABASE strapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi'@'localhost' IDENTIFIED BY 'KoalaStrapi2026!';
GRANT ALL PRIVILEGES ON strapi.* TO 'strapi'@'localhost';
EXIT;
```

---

### 🔗 Sprawdzenie połączenia z PHP

Otwórz ponownie `/var/www/test/index.php` i dodaj po wcześniejszym kodzie:

```php

$mysqli = new mysqli("localhost", "strapi", "KoalaStrapi2026!");

if ($mysqli->connect_error) {
    echo "<br>Błąd połączenia z MySQL: " . $mysqli->connect_error;
} else {
    echo "<br>PHP połączyło się z MySQL";
}
```

![Zawartość pliku testowego index.php](/public/courses/ubuntu-26-server/Images/nginix-php-mysqli-file.png)

Jak widać mamy już obsługę PHP i bazy danych MySQL w Nginx.

![Test poprawności działania mysqli](/public/courses/ubuntu-26-server/Images/nginx-test-mysql.png)

---

## 🧩 Czym jest Strapi?

Strapi to system CMS (Headless), który odpowiada wyłącznie za zarządzanie danymi i wystawianie ich przez **API (JSON)**. W przeciwieństwie do klasycznego WordPressa nie generuje sam widoków frontonowych.

Strapi działa jako samodzielna aplikacja w Node.js (na lokalnym porcie `1337`). Nginx bedzie pełnił rolę **reverse proxy**: odbiera ruch z portu $80$/$443$ i przekazując żądania w tle do procesu Strapi.

---

### 🟢 Instalacja Node.js i Strapi

Doinstaluj Node.js i NPM:

```bash
sudo apt install nodejs npm
node --version
npm --version
```

Przygotuj katalog aplikacji:

```bash
sudo mkdir -p /var/www/strapi
sudo chown egza:egza /var/www/strapi
```
> [!TIP]
> Zamiast podawać nazwę użytkownika na którym jesteś zalogowany możesz skorzystać z zmiennej shell:
> ```bash
> echo $USER
> sudo chown $USER:$USER /var/www/strapi
> ```

---

Uruchom instalator Strapi:

```bash
npx create-strapi@latest /var/www/strapi --no-run --skip-cloud --use-npm --no-git-init
```

Znaczenie użytych parametrów:
- `/var/www/strapi`: ścieżka do katalogu docelowego projektu.
- `--no-run`: wyłącza automatyczne uruchomienie Strapi po zakończeniu instalacji (dzięki czemu możemy najpierw skonfigurować `.env`).
- `--skip-cloud`: pomija krok logowania/rejestracji do usługi Strapi Cloud.
- `--use-npm`: wymusza użycie menedżera pakietów `npm`.
- `--no-git-init`: pomija automatyczną inicjalizację repozytorium Git.

---

![Instalacja Strapi](/public/courses/ubuntu-26-server/Images/inicjalizacja-strapi.png)

Podczas interaktywnej instalacji wybieramy poszczególne opcje:

- **Wybór bazy danych (`MySQL`):** Wybieramy MySQL zamiast domyślnego SQLite.
- **Host (`127.0.0.1`) i Port (`3306`):** Łączenie lokalne na serwerze.
- **Baza, użytkownik i hasło:** Podajemy dane utworzonego wcześniej konta `strapi`.
- **SSL connection (`No`):** Wyłączamy SSL dla lokalnego połączenia z bazą danych bo mamy ją na tej samej maszynie.
- **Przykładowa struktura i dane (`Yes`):** Wgrywa przykładowe dane testowe do bazy danych.
- **TypeScript (`Yes` / `No`):** Wybór języka (JavaScript lub TypeScript).

---

### 🕵🏼‍♂️ Naprawa błędów z bazą danych

Możesz napotkać błąd przy inicjalizacji. Wystarczy przeczytać komunikat.  
Przykładowo tutaj wskazuje on na brak bazy danych:

![Strapi error database](/public/courses/ubuntu-26-server/Images/strapi-error-db-seed.png)

Sprawdzamy jakie bazy danych istnieją w MySQLu:
```bash
sudo mysql
```

```sql
SHOW DATABASES;
EXIT;
```

![MySQL databasy ](/public/courses/ubuntu-26-server/Images/strapi-db-badname.png)

No i się okazało że zrobiłem literówkę i zamiast `strapi`  baza danych nazywa się `starip`.
Możemy to naprawić na $2$ sposoby:

<data-tabs>
    <tabs>
        <b>Nowa baza danych</b>
        <b>Dostosowanie <code>.env</code> i praw</b>
    </tabs>
<div>

Usunąć bazę z literówką i utworzyć ją na nowo:
```bash
sudo mysql
```

```sql
DROP DATABASE starip;
CREATE DATABASE strapi;
GRANT ALL PRIVILEGES ON strapi.* TO 'strapi'@'localhost';
EXIT;
```
```bash
cd /var/www/strapi
npm run seed:example
```

</div>
<div>

W pliku `.env` zmień nazwę bazy danych:
```bash
cd /var/www/strapi
nano .env

```
    
```ini
DATABASE_NAME=starip
```
![Zmiana nazwy bazy danych w .env](/public/courses/ubuntu-26-server/Images/strapi-fix-.env.png)

Uruchom ponownie seeder:
```bash
npm run seed:example
```
Może się też okazać że baza danych `starip` nie ma uprawnień dla użytkownika `strapi`:

![Brak uprawnień do bazy danych](/public/courses/ubuntu-26-server/Images/strapi-fix-.env-bad-db-perm.png)


```bash
sudo mysql
```
```sql
GRANT ALL PRIVILEGES ON starip.* TO 'strapi'@'localhost';
EXIT;
```

No i ponownie:
```bash
npm run seed:example
```

</div>
</data-tabs>


### 🚀 Budowa i uruchomienie Strapi

Zbuduj panel administracyjny:

```bash
npm run build
```

> [!TIP]
> Jeśli podczas kompilacji panela (`npm run build`) wystąpi błąd **_`JavaScript heap out of memory`_**, oznacza to wyczerpanie domyślnego limitu pamięci RAM dla procesu Node.js. 
> 
> Uruchom budowanie ze zwiększonym limitem pamięci:
> ```bash
> NODE_OPTIONS="--max-old-space-size=2048" npm run build
> ```
> ![](/public/courses/ubuntu-26-server/Images/strapi-node-memory-low-fix.png)


Zmieńmy nasz plik testu `/etc/nginx/sites-available/test` na nową lokalizację `/var/www/strapi/`, a następnie uruchommy projekt w trybie deweloperskim:
```bash
npm run start
```

![](/public/courses/ubuntu-26-server/Images/strapi-start.png)

Skoro jeszcze nie przekonfigurowaliśmy strapi na usługę systemową to do adresu url trzeba będzie dopisać _**:1337**_.


![Strapi started on client with port](/public/courses/ubuntu-26-server/Images/strapi-run-dev-on-kilent.png)

> Skrótem klawiszowym <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span> zatrzymujemy działanie procesu npm.


---

## ⚙️ Strapi jako usługa systemowa

Utwórz konto przeznaczone tylko do działania CMS-a:

```bash
sudo useradd --system --home /var/www/strapi --shell /usr/sbin/nologin strapi-cms
sudo chown -R strapi-cms:strapi-cms /var/www/strapi
```

Konto `strapi-cms` nie ma powłoki logowania ani uprawnień administratora.

Utwórz jednostkę systemd:

```bash
sudo nano /etc/systemd/system/strapi.service
```

```systemd
[Unit]
Description=Strapi CMS
After=network.target mysql.service

[Service]
Type=simple
User=strapi-cms
Group=strapi-cms
WorkingDirectory=/var/www/strapi
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Wczytaj nową jednostkę i uruchom CMS:

```bash
sudo systemctl daemon-reload
sudo systemctl enable strapi
sudo systemctl start strapi
sudo systemctl status strapi
```

Stan `active (running)` potwierdza działanie procesu Strapi niezależnie od otwartego terminala.

---

## 🔀 Nginx jako reverse proxy

Utwórz wirtualny host dla CMS-a:

```bash
sudo nano /etc/nginx/sites-available/strapi
```

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name cms.test.local;

    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`proxy_pass` wskazuje usługę działającą na tej samej maszynie. 

`proxy_http_version 1.1;` wymusza użycie HTTP/1.1 w komunikacji Nginx z lokalnym procesem Node.js (domyślnie Nginx używa przestarzałego HTTP/1.0). Wersja 1.1 jest wymagana m.in. do obsługi trwałego podtrzymywania połączeń (`keep-alive`) oraz połączeń WebSockets.

Włącz konfigurację:

```bash
sudo ln -s /etc/nginx/sites-available/strapi /etc/nginx/sites-enabled/strapi
sudo nginx -t
sudo systemctl reload nginx
```

Otwórz:

```text
http://cms.test.local/admin
```

Utwórz konto administratora Strapi. Adres nie zawiera portu `1337`, ponieważ przeglądarka łączy się z Nginx na porcie `80`, a Nginx przekazuje ruch do CMS-a.

Jak widzisz na poniższym obrazku tym razem dałem dwa warianty statycznego DNS w `/etc/hosts` bo zapomniałem dopisać wcześniej w `/etc/nginx/sites-available/strapi` *www* i wyskakiwał mi **_błąd 404_** 😒.

![Wirtualne hosty na Nginx](/public/courses/ubuntu-26-server/Images/nginix-on-klient-loaded.png)

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Nginx obsługuje gotowe pliki oraz przekazuje żądania do innych usług;
- `server_name` pozwala udostępnić kilka hostów przez jeden adres IP;
- Strapi działa jako oddzielna usługa aplikacyjna i udostępnia treść przez REST API;
- MySQL przechowuje dane CMS-a na koncie ograniczonym do jednej bazy;
- reverse proxy ukrywa wewnętrzny port aplikacji i tworzy wspólny punkt wejścia.
