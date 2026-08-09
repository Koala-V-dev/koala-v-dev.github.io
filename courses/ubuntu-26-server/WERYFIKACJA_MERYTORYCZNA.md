# Weryfikacja kursu „Usługi Ubuntu Server 26.04”

Data redakcji: 2026-07-26

Stan: przed wykonaniem na docelowej maszynie i przed pilotażem.

## Aktualny zakres

Kurs ma 4 moduły i 10 lekcji:

- Kea DHCP;
- ISC DHCP Server;
- BIND9;
- Samba;
- vsftpd;
- architektura usług WWW;
- Apache2;
- Nginx;
- OpenLiteSpeed;
- Postfix.

## Kontrola treści

- kurs zaczyna się od DHCP i DNS, a nie od serwera WWW;
- porównanie usług WWW wynika z uruchomienia tej samej aplikacji WordPress;
- konfiguracje nie są pisane od pustego pliku;
- każda usługa ma test na Ubuntu Desktop i Windows 11;
- każda usługa WWW jest sprawdzana przez port, log i działanie WordPressa;
- polecenia zależne od nazwy interfejsu lub urządzenia każą użyć wartości odczytanej na własnej maszynie.

## Ograniczenia

Polecenia nadal wymagają wykonania na Ubuntu Server 26.04, Ubuntu Desktop 26.04 i Windows 11 połączonych jedną siecią wewnętrzną VirtualBox.

Do czasu takiego wykonania kurs pozostaje w statusie `draft`. Audyt Markdown i kompilacja sprawdzają materiał, ale nie potwierdzają działania usług.
