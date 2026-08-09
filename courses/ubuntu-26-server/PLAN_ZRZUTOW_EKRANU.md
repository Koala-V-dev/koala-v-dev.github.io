# Plan zrzutów ekranu

Zrzuty wykonaj dopiero po przejściu poleceń na trzech maszynach VirtualBox:

- `SRV`: Ubuntu Server 26.04, adres `192.168.50.20`;
- `UBU`: Ubuntu Desktop 26.04, adres z DHCP;
- `WIN`: Windows 11, adres z DHCP.

Wszystkie trzy karty ćwiczeniowe mają działać w tej samej sieci wewnętrznej VirtualBox. Serwer może mieć drugą kartę z dostępem do Internetu na czas instalowania pakietów. DHCP wolno uruchomić tylko na karcie sieci wewnętrznej.

## Zasady wykonania

1. Używaj rozdzielczości co najmniej 1440 × 900. Przytnij pusty pulpit, ale pozostaw nazwę programu lub systemu.
2. Terminal ma pokazywać polecenie i jego wynik. Sam napis `active` bez nazwy usługi nie jest dowodem.
3. W przeglądarce pozostaw pasek adresu. W narzędziu klienta pozostaw nazwę serwera i stan operacji.
4. Nie pokazuj haseł. MAC może być widoczny tylko wtedy, gdy pochodzi z maszyn przeznaczonych do publikowanego stanowiska.
5. Nie łącz wyników pochodzących z różnych prób. Adres IP, nazwa hosta, MAC i nazwa udziału mają być spójne na całym zestawie.
6. Obraz zapisz w katalogu `Images`. Pod znacznikiem zrzutu w lekcji wstaw później obraz oraz jednozdaniowy podpis mówiący, co wynik potwierdza.

## 01. Kea DHCP

- `01-kea-01-szablon.png`: `SRV`, interfejs, podsieć, pula, DNS i domena w `kea-dhcp4.conf`.
- `01-kea-02-test-status.png`: `SRV`, udany test pliku oraz stan `kea-dhcp4-server`.
- `01-kea-03-ubuntu-klient.png`: `UBU`, adres z puli, DNS i domena wyszukiwania.
- `01-kea-04-windows-klient.png`: `WIN`, właściwa karta z adresem, serwerem DHCP i DNS.
- `01-kea-05-dzierzawy.png`: `SRV`, rezerwacja oraz odpowiadający jej wpis w pliku dzierżaw.

## 02. isc-dhcp-server

- `02-isc-01-interfejs.png`: `SRV`, adres karty i ta sama nazwa w `INTERFACESv4`.
- `02-isc-02-dhcpd-conf.png`: `SRV`, kompletna podsieć w istniejącym `dhcpd.conf`.
- `02-isc-03-ubuntu-klient.png`: `UBU`, adres, DNS i domena otrzymane z ISC DHCP.
- `02-isc-04-windows-klient.png`: `WIN`, adres, serwer DHCP i DNS otrzymane z ISC DHCP.
- `02-isc-05-rezerwacja.png`: konfiguracja rezerwacji na `SRV` i odpowiadający jej adres na `WIN`.

## 03. BIND9

- `03-dns-01-pliki.png`: `SRV`, deklaracja strefy i rekordy `www`, `ftp`, `pliki`, `mail`.
- `03-dns-02-testy.png`: `SRV`, wyniki `named-checkconf` i `named-checkzone`.
- `03-dns-03-ubuntu.png`: `UBU`, odpowiedzi `dig` dla rekordów A i MX.
- `03-dns-04-windows.png`: `WIN`, odpowiedzi `nslookup` z serwera `192.168.50.20`.

## 04. Samba

- `04-samba-01-konfiguracja.png`: `SRV`, zakres SMB2/SMB3, wymagany podpis oraz udział bez gościa.
- `04-samba-02-ubuntu.png`: `UBU`, zapis pliku do `//pliki.firma.test/DANE` przez `smbclient`.
- `04-samba-03-windows.png`: `WIN`, udział otwarty po nazwie i pliki z obu klientów.
- `04-samba-04-smbstatus.png`: `SRV`, aktywna sesja Windows, udział `DANE` i negocjowany SMB3.

## 05. vsftpd

- `05-ftp-01-konfiguracja.png`: `SRV`, pięć aktywnych opcji potrzebnych do logowania, zapisu, chroot i trybu pasywnego.
- `05-ftp-02-ubuntu.png`: `UBU`, wysłanie, lista, pobranie i porównanie pliku przez `lftp`.
- `05-ftp-03-windows.png`: `WIN`, FileZilla po udanym transferze do `/upload`.
- `05-ftp-04-serwer.png`: `SRV`, dwa pliki przesłane z różnych klientów i ich treść.

## 06. Apache2

- `06-apache-01-vhost.png`: `SRV`, `ServerName`, `DocumentRoot` oraz blok `Directory` w `wordpress.conf`.
- `06-apache-02-test.png`: `SRV`, `Syntax OK` i przypisanie nazwy przez `apache2ctl -S`.
- `06-apache-03-ubuntu.png`: `UBU`, WordPress z wpisem „Apache działa” otwarty przez `www.firma.test`.
- `06-apache-04-baza.png`: `SRV`, tabele utworzone w bazie `wordpress`.

## 07. Nginx

- `07-nginx-01-konfiguracja.png`: `SRV`, `server_name`, `root`, `try_files` i `fastcgi_pass`.
- `07-nginx-02-test.png`: `SRV`, udany `nginx -t` oraz Nginx na porcie `80`.
- `07-nginx-03-windows.png`: `WIN`, WordPress z wpisem „Nginx działa”.
- `07-nginx-04-log.png`: `SRV`, żądanie strony widoczne w logu Nginx.

## 08. OpenLiteSpeed

- `08-litespeed-01-lsapi.png`: `UBU`, aplikacja `lsphp85` i handler PHP w WebAdmin.
- `08-litespeed-02-vhost.png`: `UBU`, Document Root WordPressa oraz listener na porcie `80`.
- `08-litespeed-03-test.png`: `SRV`, poprawny test konfiguracji i OpenLiteSpeed na porcie `80`.
- `08-litespeed-04-wordpress.png`: `WIN`, WordPress z wpisem „OpenLiteSpeed działa”.

## 09. Postfix

- `09-postfix-01-postconf.png`: `SRV`, pięć ustawień odczytanych przez `postconf` i port 25.
- `09-postfix-02-ubuntu.png`: `UBU`, odpowiedź `250` dla wiadomości wysłanej przez `swaks`.
- `09-postfix-03-windows.png`: `WIN`, odpowiedź `250` dla wiadomości wysłanej przez `curl.exe`.
- `09-postfix-04-maildir.png`: `SRV`, dwa pliki w `Maildir/new` z nadawcami Ubuntu i Windows.

## Wstawienie obrazu do lekcji

Znacznik zaczynający się od `> 📷 Zrzut` określa miejsce wykonania zdjęcia. Po uzyskaniu prawdziwego obrazu zastąp go konstrukcją:

```markdown
![Windows 11 otwiera udział DANE przez SMB3](../Images/04-samba-03-windows.png)

Windows 11 otwiera udział po nazwie DNS. W katalogu widać pliki zapisane z obu klientów.
```

Tekst alternatywny opisuje widoczny wynik. Podpis wyjaśnia, co ten wynik potwierdza. Nie zapisuj w nim ponownie całej instrukcji z lekcji.
