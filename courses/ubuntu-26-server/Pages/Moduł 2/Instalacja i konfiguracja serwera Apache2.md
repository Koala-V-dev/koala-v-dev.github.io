# Instalacja i konfiguracja serwera Apache2

Apache jest serwerem WWW rozwijanym przez Apache Software Foundation. Jest jednym z najpopularniejszych serwerów WWW na świecie. Charakteryzuje się elastycznością, łatwością konfiguracji i szerokim zakresem funkcji.

---

## 📦 Instalacja Apache

```bash
sudo apt update
sudo apt install apache2
```

Po instalacji uruchamia się usługa `apache2`. Sprawdź jej stan:

```bash
sudo systemctl status apache2
```

Po instalacji usługa już poprawnie działa i można poprzez adres ip wczytać stronę domyślną Apache.

![Apache działa](/public/courses/ubuntu-26-server/Images/apache2-default-website-on-ubuntu-desktop.png)


---

## 📄 Własna strona WWW

Do postawienia stronki podejdziemy na dwa sposoby:
- ręcznie napisany minimalny plik testujący
- pobrany z githuba plik diagnostyczny

Standardowo katalogi servisów w ubuntu powinny się znajdować w `/srv` i tam został też utorzony gatalog WwW przez apache2. Dlatego bedziemy to kontynuować. Utwórzmy więc dwa nowe katalogi:
```bash
mkdir -p /var/www/test/
mkdir -p /var/www/diag/
```

Do diag zaciągniemy z GitHub niezbędny plik:

```bash
curl https://raw.githubusercontent.com/RudekAlone/test-web-servera/refs/heads/main/index.php >> index.php
sudo mv index.php /var/www/diag/index.php
```

Natomiast w katalogu test stworzymy własny plik index.html o następującej treści:
```html
test
```

### 🌐 Wirtualne hosty

Mając już katalogi i pliki przygotowane musimy je jeszcze zarejestrować w usłudze.  

W tym celu stworzymy dwa nowe wirtualne hosty. Kopiujemy templatkę `000-default.conf` jako nasze dwa nowe hosty `test` i `diag`. 

```bash
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/test.conf
sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/diag.conf
```

Edytując te pliki interesują nas dwie linie:
- `ServerName`: podajemy adres naszej strony WwW.
- `DocumentRoot`: wskazujemy katalog z plikami strony.

![ apache2-virtual-host](/public/courses/ubuntu-26-server/Images/apache2-virtual-host.png)

```conf
<VirtualHost *:80>
    ServerName www.test.local
    DocumentRoot /var/www/test
</VirtualHost>
```

```conf
<VirtualHost *:80>
    ServerName www.diag.local
    DocumentRoot /var/www/diag
</VirtualHost>
```

Gdy konfiguracje są gotowe dodajmy je do Apache i zrestartujmy usługę:

```bash
sudo a2ensite test.conf
sudo a2ensite diag.conf
sudo systemctl restart apache2
sudo systemctl status apache2
```

![apache2-restart](/public/courses/ubuntu-26-server/Images/apache2-restart.png)

Niby można poprostu przeładować konfigurację co w konsoli nawet jest podpowiadne ale przy świerzej instalacji warto weryfikopwać czy jusługa się przypadkiem nie wywaliła.

```bash
sudo systemctl reload apache2
```

### 📝 Ręczna edycja pliku hosts

Z racji że nie mamy DNS to bedzie trzeba na klientach trochę oszukać i ręcznie wpisać przekerowania nazwy na adres IP.


Z racji wpisania w wirtualnych hostach nazwy `www.test.local` i `www.diag.local` musimy się do nich odwołać w plikach hosts.

Ubuntu: `sudo nano /etc/hosts`
![statyczne wpisy w hosts na ubuntu](/public/courses/ubuntu-26-server/Images/apache-hosts-ubuntu.png)

Windows: Otwórz `Notatnik` z uprawnieniami Administratora, a następnie w menu <kbd class="win-menu-btn">Plik</kbd> → <kbd class="win-menu-btn">Otwórz</kbd> przejdź do lokalizacji `C:\Windows\System32\drivers\etc\` i wybierz `hosts` (w filtrze plików ustaw `Wszystkie pliki`).
![apache-hosts-windows](/public/courses/ubuntu-26-server/Images/apache-hosts-windows.png)


Na komputerze klienckim (lub na serwerze) dodaj mapowanie nazwy w pliku `/etc/hosts` (lub `C:\Windows\System32\drivers\etc\hosts` na Windowsie), aby domena `.test` wskazywała na adres IP serwera:

```text
192.168.0.1   www.test.local
192.168.0.1   www.diag.local
```

Otwórz w przeglądarce:

```text
http://www.test.local
http://www.diag.local
```

Nie koniecznie musisz dopisywać `http://`. Może to być wymagane tylko gdy przeglądarka usilnie bedzie ptróbowała połączyć się prze **`HTTPS`**.

---

## 🐘 Dodanie podstawowej obsługi PHP

Aby uruchomić wykonywanie skryptów PHP na serwerze WWW, wystarczy zainstalować sam interpreter oraz moduł łączący go z Apache:

```bash
sudo apt install libapache2-mod-php php
```

Sprawdź, czy Apache poprawnie przetwarza kod PHP za pomocą krótkiego pliku testowego:

```bash
sudo nano /var/www/test/test.php
```

```html
test
<br>
<?php
echo "PHP działa";
```

Pamiętaj jeszcze o zmienie rozszerzenia pliku na z `.html` na `.php`.

![apache-rename-test-index-html-to-php](/public/courses/ubuntu-26-server/Images/apache-rename-test-index-html-to-php.png)

Teraz możemy na kliencie wykonać test i zobaczysz że na stronie diagnostycznej działąją tylko 2 moduły z sześciu:
- **`pdo`**: Wsparcie do programowania obiektowego w PHP 
- **`openssl`**: Biblioteka kryptograficzna.

![apache-test-php](/public/courses/ubuntu-26-server/Images/apache-test-php.png)


---

## 🗄️ MySQL i moduły PHP

Mając już działający serwer WWW z PHP nadszedł czas na bazę danych czyli MySQL i moduł integracji php z bazą danych.

Zainstaluj serwer bazy danych oraz moduł umożliwiający PHP komunikację z MySQL:

```bash
sudo apt install mysql-server php-mysql
```

### Tworzenie prostego użytkownika testowego
Na Ubuntu użytkownik `root` w MySQL korzysta z wtyczki `auth_socket` (można się logować tylko z poziomu `sudo` w terminalu). Aby wykonać zwykły test połączenia z poziomu PHP, utwórz prostą bazę `testdb` oraz użytkownika `koala` z hasłem `koala`:

Domyślny użytkownik `root` w mysql jest lokalny i nie można go użyć poprzez PHP. Dlatego utworyzmy nowego użytkownika `koala` z hasłem `koala`.

Uruchom więc konsolę MySQL:

```bash
sudo mysql
```

W konsoli MySQL wykonaj:

```sql
CREATE USER 'koala'@'localhost' IDENTIFIED BY 'koala';
GRANT ALL PRIVILEGES ON *.* TO 'koala'@'localhost';
EXIT;
```

Teraz zmodyfikujmy ponownie plik strony w `/var/www/test/`:

```php
<?php
$mysqli = new mysqli("localhost", "koala", "koala");
if ($mysqli->connect_error) {
    echo "Błąd połączenia z MySQL: " . $mysqli->connect_error;
} else {
    echo "Połączenie z MySQL Działa! ";
}
```

![Ponowna modyfikacja pliku w folderze test](/public/courses/ubuntu-26-server/Images/apache2-test-dopisanie-mysqli-con.png)

Odświeżając stronę na kliencie wszystko powinno działać poprawnie, a jeżeli będzie error 500 to możliwe że zapomniałeś o średniku `;`.

Jak widać MySQL działa i PHP teraz obsługuje kolejne dwa moduły:
- **`mysqli`**: Rozszerzenie PHP do komunikacji z bazą danych MySQL.
- **`pdo_mysql`**: Sterownik PDO dla PHP umożliwiający komunikację z bazą danych MySQL.

![apache2 test działania mysql](/public/courses/ubuntu-26-server/Images/apache-test-działania-mysql.png)

---

## 🫙 WordPress

_**WordPress**_ to najpopularniejszy na świecie system zarządzania treścią (CMS - *Content Management System*), napisany w języku PHP i wykorzystujący bazę danych MySQL/MariaDB do przechowywania treści strony, wpisów, komentarzy i ustawień. 


### 🧩 Dodatkowe moduły PHP dla WordPressa

Na naszej stronie diagnostycznej były wcześniej aktywne jedynie 2 podstawowe moduły. Sam WordPress oraz jego zaawansowane motywy i wtyczki wymagają jednak szerszego zestawu rozszerzeń PHP:

- `curl`: Pozwala na wysyłanie zapytań HTTP do innych serwerów i API z poziomu PHP (np. do sprawdzania aktualizacji wtyczek).
- `mbstring`: Biblioteka do przetwarzania ciągów znaków w kodowaniu UTF-8. Jest niezbędna do poprawnej obsługi polskich znaków.
- `gd`: Biblioteka do przetwarzania grafiki. Umożliwia generowanie miniatur, skalowanie i edycję obrazów wrzucanych do biblioteki mediów.
- `intl`: Biblioteka do internacjonalizacji. Zapewnia poprawną obsługę formatowania dat, walut oraz tłumaczeń na różne języki.
- `xml`: Biblioteka do obsługi formatu XML. Wykorzystywana jest m.in. przy imporcie, eksportowaniu treści oraz obsłudze kanałów RSS.
- `zip`: Biblioteka do archiwów ZIP. Umożliwia automatyczną instalację oraz aktualizację wtyczek i motywów z repozytorium WordPressa.

Zainstaluj wymagany komplet pakietów jedną komendą:

```bash
sudo apt install php-curl php-gd php-intl php-mbstring php-xml php-zip
```

---

## 📥 Pobranie i przygotowanie plików WordPressa

Zainstaluj program `wget` potrzebny do pobrania archiwum z oficjalnego repozytorium:

```bash
sudo apt install wget
```

Przejdź do katalogu tymczasowego, pobierz najnowszą paczkę WordPressa i rozpakuj ją:

```bash
cd /tmp
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
```

Przenieś rozpakowany katalog do docelowej lokalizacji `/var/www/` i nadaj uprawnienia użytkownikowi serwera WWW (`www-data`):

```bash
sudo cp -a /tmp/wordpress /var/www/wordpress
sudo chown -R www-data:www-data /var/www/wordpress
```

---

## 📝 Zmiana witryny statycznej na WordPressa

Otwórz stworzoną wcześniej konfigurację Virtual Hosta:

```bash
sudo nano /etc/apache2/sites-available/test.conf
```

Zmień `DocumentRoot` na katalog z WordPressem oraz dodaj blok `<Directory>`, który umożliwi działanie przyjaznych linków (.htaccess):

```apache
<VirtualHost *:80>
    ServerName www.test.local
    DocumentRoot /var/www/wordpress

    <Directory /var/www/wordpress>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/wordpress-error.log
    CustomLog ${APACHE_LOG_DIR}/wordpress-access.log combined
</VirtualHost>
```

`DocumentRoot` wskazuje teraz na katalog z WordPressem. Dyrektywa `AllowOverride All` zezwala aplikacji na nadpisywanie reguł przekierowań za pomocą pliku `.htaccess`.

Włącz moduł przepisywania adresów URL (`mod_rewrite`), sprawdź poprawność składni i przeładuj serwer Apache:

```bash
sudo a2enmod rewrite
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## 🔐 Baza i użytkownik MySQL dla WordPressa

Przed uruchomieniem instalatora w przeglądarce utwórz dedykowaną bazę danych oraz konto użytkownika w MySQL:

```bash
sudo mysql
```

W konsoli bazy danych wykonaj polecenia:

```sql
CREATE DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wordpress'@'localhost' IDENTIFIED BY 'KoalaWP2026!';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'localhost';
EXIT;
```

*(Użytkownik `wordpress` otrzymuje uprawnienia wyłącznie do swojej bazy, co gwarantuje izolację i bezpieczeństwo).*

---

## 🐘 Dokończenie instalacji WordPressa w przeglądarce

Otwórz w przeglądarce adres:

```text
http://www.test.local
```

![apache2-wordpress](/public/courses/ubuntu-26-server/Images/apache2-wordpress.png)

Po wyświetleniu powitalnego ekranu WordPressa kliknij **„Zaczynajmy!”** (*Let's go!*) i wprowadź dane dostępowe do bazy:

- **Nazwa bazy danych:** `wordpress`
- **Nazwa użytkownika:** `wordpress`
- **Hasło:** `KoalaWP2026!`
- **Serwer bazy danych:** `localhost`
- **Prefiks tabel:** `wp_`

![wordpress_dane](/public/courses/ubuntu-26-server/Images/wordpress_dane.png)

Po pomyślnym połączeniu z bazą kliknij **„Uruchom instalację”** i skonfiguruj konto administratora witryny (tytuł witryny, nazwę użytkownika, hasło administratora oraz adres e-mail).

![wordpress_dane2](/public/courses/ubuntu-26-server/Images/wordpress_dane2.png)

Zaloguj się do panelu kokpitu (`http://www.test.local/wp-admin`) i dodaj swój pierwszy testowy wpis.

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- `ServerName` przypisuje nazwę do Virtual Hosta, a `DocumentRoot` wskazuje pliki witryny;
- Apache może samodzielnie udostępnić gotową stronę HTML;
- PHP rozszerza działający serwer o treść dynamiczną;
- WordPress wykonuje kod PHP i przechowuje dane w osobnej bazie MySQL.
