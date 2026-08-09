# Karta kursu „Usługi Ubuntu Server 26.04”

## Odbiorca

Kurs jest przeznaczony dla osoby po kursie `ubuntu-26`.

Uczeń potrafi użyć terminala, `nano`, `sudo`, `ip`, Netplanu, SSH i UFW. Nie konfigurował jeszcze usług sieciowych.

## Środowisko

- Ubuntu Server 26.04: `192.168.50.20/24`;
- Ubuntu Desktop 26.04 jako pierwszy klient;
- Windows 11 jako drugi klient;
- wszystkie trzy maszyny w jednej sieci wewnętrznej VirtualBox;
- karta NAT serwera służy tylko do pobierania pakietów.

## Kolejność

Kurs zaczyna się od usług, z których korzystają następne lekcje:

1. Kea przydziela klientom adres i adres serwera DNS.
2. ISC DHCP wykonuje to samo zadanie z użyciem starszego `dhcpd.conf`.
3. BIND odpowiada za nazwy `firma.test`.
4. Samba i vsftpd udostępniają pliki użytkownikom.
5. Apache, Nginx i OpenLiteSpeed obsługują tę samą witrynę PHP korzystającą z MySQL.
6. Postfix przyjmuje pocztę dla lokalnych kont.

## Sposób pracy z konfiguracją

Lekcje korzystają z plików utworzonych przez pakiet albo z dołączonych szablonów:

- Apache: kopia `000-default.conf`;
- Nginx: kopia `sites-available/default`;
- OpenLiteSpeed: domyślny wirtualny host `Example` zmieniany przez WebAdmin;
- Samba i vsftpd: edycja istniejących plików;
- Kea i BIND: szablony dołączone do kursu;
- Postfix: zmiany wykonywane przez `postconf`.

Każda usługa jest sprawdzana z Ubuntu Desktop i Windows 11. Wynik lokalnego `systemctl status` nie zastępuje testów klientów.

## Stan materiału

Kurs ma 4 moduły i 10 lekcji. Pozostaje szkicem do czasu wykonania wszystkich poleceń na trzech maszynach wskazanych w planie zrzutów.
