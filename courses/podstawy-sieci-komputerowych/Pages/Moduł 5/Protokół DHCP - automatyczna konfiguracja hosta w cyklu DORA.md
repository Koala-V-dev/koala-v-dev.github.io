# Protokół DHCP - automatyczna konfiguracja hosta w cyklu DORA

Ręczne wpisywanie adresu IP, maski podsieci, bramy domyślnej i serwerów DNS na kilkuset stanowiskach w przedsiębiorstwie lub szkole prowadzi do literówek, konfliktów adresów i przestojów sieci. Protokół **DHCP** (*Dynamic Host Configuration Protocol*, RFC 2131) automatyzuje ten proces w czterofazowym cyklu **DORA** tuż po podłączeniu interfejsu sieciowego. Po tej lekcji będziesz umiał odczytać parametry dzierżawy ze stacji roboczej, skonfigurować pulę i rezerwację MAC na serwerze DHCP (wymóg egzaminacyjny INF.02) oraz wymusić odnowienie konfiguracji z wiersza poleceń.

## 📋 Laboratorium cyklu DHCP DORA i rezerwacji MAC

Przejdź przez komunikaty `Discover`, `Offer`, `Request` i `Acknowledge`, przełącz stację roboczą na tryb rezerwacji MAC oraz przetestuj wykrycie konfliktu adresu IP przez `DHCPDECLINE`.

<data-dhcp-dora-engine></data-dhcp-dora-engine>

![Automatyczna konfiguracja IP: Cykl DHCP DORA](/public/courses/podstawy-sieci-komputerowych/Images/dhcp-cykl-dora-i-opcje.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Przed wprowadzeniem zmian na serwerze DHCP musisz odczytać aktualne dane dzierżawy oraz fizyczny adres MAC karty sieciowej stacji roboczej.

Na systemie **Windows (PowerShell / CMD)**:

```powershell
Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer
Get-NetAdapter | Select-Object Name, MacAddress, Status
```

W klasycznym `ipconfig /all` poszukaj linii:
- `DHCP Enabled: Yes`
- `DHCP Server: 192.168.10.1`
- `Lease Obtained / Lease Expires` (czas trwania dzierżawy)
- `Physical Address` (np. `00-1A-2B-3C-4D-5E`)

Na systemie **Linux**:

```bash
ip link show eth0
cat /var/lib/dhcp/dhclient.leases | tail -n 20
```

> [!NOTE]
> Cykl **DORA** wykorzystuje bezpołączeniowy protokół UDP na portach:
> - **Port 67:** Serwer DHCP (nasłuchuje na żądania klientów).
> - **Port 68:** Klient DHCP (odbiera oferty i potwierdzenia).
> Ponieważ nowo podłączona stacja nie ma jeszcze adresu IP, pierwsze pakiety wysyła jako rozgłoszenie ogólne z adresu źródłowego `0.0.0.0` na adres docelowy `255.255.255.255`.

---

## ⚙️ Zmiana istniejącej konfiguracji

Zrealizujmy typowe zadanie egzaminacyjne z arkusza **INF.02**:
Skonfiguruj serwer DHCP na systemie Linux (`isc-dhcp-server` lub `dnsmasq`) dla podsieci `192.168.10.0/25` z następującymi parametrami:
- **Pula adresów:** `192.168.10.10` do `192.168.10.20`
- **Maska:** `255.255.255.128` (`/25`)
- **Brama domyślna (Opcja 3):** `192.168.10.1`
- **Serwer DNS (Opcja 6):** `5.4.3.2`
- **Rezerwacja:** stały adres `192.168.10.13` dla stacji o adresie MAC `00:1a:2b:3c:4d:5e`

Oto minimalistyczna konfiguracja w pliku `/etc/dhcp/dhcpd.conf`:

```text
# Konfiguracja podsieci LAN
subnet 192.168.10.0 netmask 255.255.255.128 {
    range 192.168.10.10 192.168.10.20;
    option routers 192.168.10.1;
    option domain-name-servers 5.4.3.2;
    default-lease-time 28800; # 8 godzin
    max-lease-time 86400;

    # Statyczna rezerwacja po MAC (Zadanie INF.02)
    host stacja-robocza {
        hardware ethernet 00:1a:2b:3c:4d:5e;
        fixed-address 192.168.10.13;
    }
}
```

Dla lekkiego serwera `dnsmasq` (`/etc/dnsmasq.conf`):

```text
dhcp-range=192.168.10.10,192.168.10.20,255.255.255.128,8h
dhcp-option=3,192.168.10.1
dhcp-option=6,5.4.3.2
dhcp-host=00:1a:2b:3c:4d:5e,192.168.10.13
```

Test składni przed restartem usługi:

```bash
# Weryfikacja składni pliku konfiguracyjnego isc-dhcp-server
dhcpd -t -cf /etc/dhcp/dhcpd.conf
```

Poprawny wynik testu:

```text
Configuration file syntax test succeeded.
```

Restart usługi serwera:

```bash
sudo systemctl restart isc-dhcp-server
```

---

## 🚀 Uruchomienie i test z klienta

Wymuś odnowienie konfiguracji na stacji roboczej z systemem Windows, aby przejść pełen cykl DORA i odebrać zarezerwowany adres IP.

W wierszu poleceń stacji roboczej (CMD / PowerShell):

```powershell
# 1. Zwolnienie starego adresu
ipconfig /release

# 2. Wysłanie pakietu DHCP Discover i pobranie nowej dzierżawy
ipconfig /renew
```

Oczekiwany dowód w wyniku polecenia `ipconfig /all`:

```text
IPv4 Address. . . . . . . . . . . : 192.168.10.13(Preferred)
Subnet Mask . . . . . . . . . . . : 255.255.255.128
Default Gateway . . . . . . . . . : 192.168.10.1
DNS Servers . . . . . . . . . . . : 5.4.3.2
```

Potwierdzenie testem komunikacji:

```powershell
Test-Connection -TargetName 192.168.10.1 -Count 2
```

---

## 🛠️ Samodzielna próba

Klient z systemem Linux nie pobiera adresu ze wskazanego serwera, ponieważ w sieci pojawił się fałszywy router domowy z własnym serwerem DHCP (zjawisko Rogue DHCP Server).

Twoje zadanie:
1. Odpytaj serwer DHCP bezpośrednio z poziomu Linuksa i wskaż adres IP serwera, który udzielił odpowiedzi:
   ```bash
   sudo dhclient -v -r eth0
   sudo dhclient -v eth0
   ```
2. Znajdź w logach terminala linię `DHCPACK of 192.168.10.13 from <IP_SERWERA>`.
3. Jeśli serwer nie przydzielił adresu, sprawdź czy usługa na serwerze nasłuchuje na porcie UDP 67:
   ```bash
   ss -ulpn 'sport = :67'
   ```

Kryteria ukończenia:
- Terminal Linuksa wyświetla sekwencję: `DHCPDISCOVER`, `DHCPOFFER`, `DHCPREQUEST`, `DHCPACK`.
- Adres interfejsu `eth0` przyjmuje zadaną maskę i IP.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Przykładowy poprawny log klienta DHCP:
```text
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 3
DHCPOFFER of 192.168.10.13 from 192.168.10.1
DHCPREQUEST for 192.168.10.13 on eth0 to 255.255.255.255 port 67
DHCPACK of 192.168.10.13 from 192.168.10.1
bound to 192.168.10.13 -- renewal in 14400 seconds.
```

Weryfikacja adresu na Linuksie:
```bash
ip -4 addr show eth0
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Kolejność fazy DHCP DORA

<data-gate>
  <data-sortable-list title="Ułóż w prawidłowej kolejności komunikaty cyklu DHCP DORA (porty UDP 67 i 68)">
    <item data-correct="3">DHCPREQUEST: klient akceptuje ofertę wybranego serwera (Broadcast)</item>
    <item data-correct="1">DHCPDISCOVER: klient bez IP (0.0.0.0) rozgłasza poszukiwanie serwera na 255.255.255.255</item>
    <item data-correct="4">DHCPACK: serwer zatwierdza dzierżawę i wpisuje rekord w bazie dhcpd.leases</item>
    <item data-correct="2">DHCPOFFER: serwer proponuje wolny adres IP, maskę, Opcję 3 (Brama) i Opcję 6 (DNS)</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Cztery fazy DORA:** `Discover` (klient szuka serwera) $\rightarrow$ `Offer` (serwer proponuje parametry) $\rightarrow$ `Request` (klient akceptuje ofertę) $\rightarrow$ `Acknowledge` (serwer zatwierdza dzierżawę).
- **Opcje sieciowe:** Poza adresem IP i maską serwer DHCP przekazuje kluczowe parametry: Opcja 3 to Brama Domyślna (Router), a Opcja 6 to Serwery DNS.
- **Rezerwacja MAC:** Pozwala zachować zalety dynamicznego zarządzania siecią przy jednoczesnym zagwarantowaniu, że stacje serwerowe i robocze zawsze otrzymują ten sam przewidywalny adres IP.
