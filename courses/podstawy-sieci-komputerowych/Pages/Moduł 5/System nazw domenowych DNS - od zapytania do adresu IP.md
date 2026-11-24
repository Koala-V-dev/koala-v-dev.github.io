# System nazw domenowych DNS - od zapytania do adresu IP

Ludzki mózg dobrze zapamiętuje nazwy tekstowe (`serwer.szkola.local` czy `steampowered.com`), lecz routery L3 przetwarzają wyłącznie 32-bitowe adresy IPv4 lub 128-bitowe adresy IPv6. System **DNS** (*Domain Name System*, RFC 1035) to rozproszona, hierarchiczna baza danych tłumacząca nazwy domenowe na adresy IP w zapytaniach UDP na porcie 53. Po tej lekcji będziesz umiał odpytać serwer DNS o konkretne rekordy (`A`, `CNAME`, `PTR`), skonfigurować strefę wyszukiwania na serwerze (zadanie egzaminacyjne INF.02) oraz wyczyścić lokalną pamięć podręczną DNS Resolver Cache.

## 🌐 Laboratorium zapytań DNS i edycji strefy

Przetestuj zapytania rekurencyjne i iteracyjne (`RD=1` kontra `RD=0`), sprawdź flagi nagłówka odpowiedzi (`QR`, `AA`, `RCODE`) oraz zmodyfikuj rekordy strefy `db.szkola.local`.

<data-dns-resolver-engine></data-dns-resolver-engine>

![Hierarchia DNS i przebieg zapytania rekurencyjnego](/public/courses/podstawy-sieci-komputerowych/Images/dns-drzewo-i-zapytanie-rekurencyjne.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź, z jakiego serwera DNS korzysta obecnie Twoja stacja robocza oraz jakie wpisy znajdują się w lokalnej pamięci podręcznej systemu operacyjnego.

Na systemie **Windows (PowerShell)**:

```powershell
# 1. Odczyt skonfigurowanych serwerów DNS
Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object ServerAddresses -ne $null | Select-Object InterfaceAlias, ServerAddresses

# 2. Odczyt lokalnej pamięci podręcznej DNS
Get-DnsClientCache | Select-Object -First 5 Entry, Data, TimeToLive
```

Na systemie **Linux**:

```bash
resolvectl status || cat /etc/resolv.conf
```

> [!NOTE]
> Kluczowe typy rekordów DNS wymagane na egzaminie zawodowym INF.02:
> - **Rekord A (Address):** Mapuje nazwę domenową na adres IPv4 (np. `serwer1.szkola.local` $\rightarrow$ `192.168.10.2`).
> - **Rekord AAAA:** Mapuje nazwę na adres IPv6.
> - **Rekord CNAME (Canonical Name):** Tworzy alias do innej nazwy (np. `www` wskazuje na `serwer1.szkola.local`).
> - **Rekord PTR (Pointer):** Służy do wyszukiwania wstecznego (Reverse DNS): na podstawie adresu IP zwraca powiązaną nazwę hosta.

---

## ⚙️ Zmiana istniejącej konfiguracji

Zrealizujmy zadanie egzaminacyjne **INF.02**:
Na serwerze Linux (pakiet `bind9`) należy utworzyć strefę podstawową wyszukiwania w przód `szkola.local` z rekordem A dla `serwer1` (`192.168.10.2`) oraz aliasem CNAME `www`.

W pliku `/etc/bind/named.conf.local` deklarujemy strefę:

```text
zone "szkola.local" {
    type master;
    file "/etc/bind/db.szkola.local";
};
```

W pliku bazy strefy `/etc/bind/db.szkola.local` definiujemy rekordy:

```text
$TTL    3600
@       IN      SOA     serwer1.szkola.local. admin.szkola.local. (
                              1         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                          3600 )       ; Negative Cache TTL
;
@       IN      NS      serwer1.szkola.local.
serwer1 IN      A       192.168.10.2
www     IN      CNAME   serwer1.szkola.local.
```

W systemie **Windows Server** analogiczną operację wykonuje moduł PowerShell:

```powershell
Add-DnsServerPrimaryZone -Name "szkola.local" -ZoneFile "szkola.local.dns"
Add-DnsServerResourceRecordA -Name "serwer1" -ZoneName "szkola.local" -IPv4Address 192.168.10.2
Add-DnsServerResourceRecordCName -Name "www" -ZoneName "szkola.local" -HostNameAlias "serwer1.szkola.local"
```

Test poprawności składni plików strefy BIND9 przed przeładowaniem:

```bash
named-checkzone szkola.local /etc/bind/db.szkola.local
```

Poprawny wynik:

```text
zone szkola.local/IN: loaded serial 1
OK
```

Przeładowanie usługi:

```bash
sudo systemctl reload bind9
```

---

## 🚀 Uruchomienie i test z klienta

Wyślij zapytanie diagnostyczne ze stacji roboczej klienta, odpytując skonfigurowany serwer DNS.

Na systemie **Windows (PowerShell)**:

```powershell
Resolve-DnsName -Name "www.szkola.local" -Server 192.168.10.2
```

Lub klasycznym narzędziem `nslookup`:

```text
nslookup www.szkola.local 192.168.10.2
```

Oczekiwany dowód poprawnej translacji:

```text
Server:  serwer1.szkola.local
Address:  192.168.10.2

Name:    serwer1.szkola.local
Address:  192.168.10.2
Aliases:  www.szkola.local
```

Zwróć uwagę: zapytanie o `www.szkola.local` rozwinęło alias CNAME i zwróciło właściwy adres IPv4 `192.168.10.2`.

---

## 🛠️ Samodzielna próba

Klasycznym problemem administratora po zmianie rekordu A domeny jest brak widoczności zmian na stacjach roboczych, ponieważ komputery klienta przetrzymują starą odpowiedź w pamięci podręcznej (DNS Cache) przez czas zdefiniowany w rekordzie TTL.

Twoje zadanie:
1. Odpytaj domenę zewnętrzną, a następnie wyświetl jej wpis w lokalnym buforze:
   ```powershell
   Get-DnsClientCache -Entry "google.com"
   ```
2. Zresetuj całą pamięć podręczną DNS stacji roboczej za pomocą dedykowanego polecenia.
3. Potwierdź, że bufor został opróżniony.

Kryteria ukończenia:
- Bufor klienta zostaje wyczyszczony poleceniem `Clear-DnsClientCache` (PowerShell) lub `ipconfig /flushdns` (CMD).
- Kolejne zapytanie wymusza pobranie świeżego pakietu z sieci.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Polecenie czyszczące w systemie Windows:
```powershell
Clear-DnsClientCache
```

Weryfikacja:
```powershell
Get-DnsClientCache -Entry "google.com"
```
Wynik powinien być pusty.

W systemie Linux (systemd-resolved):
```bash
sudo resolvectl flush-caches
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Typy rekordów i porty DNS

<data-gate>
  <data-connection-matcher title="Połącz rekord lub mechanizm DNS z jego przeznaczeniem">
    <div class="cmw-item" data-left="Rekord A" data-right="Mapuje nazwę hosta bezpośrednio na 32-bitowy adres IPv4"></div>
    <div class="cmw-item" data-left="Rekord CNAME" data-right="Tworzy alias wskazujący na inną nazwę domenową"></div>
    <div class="cmw-item" data-left="Rekord PTR" data-right="Wyszukiwanie wsteczne (Reverse DNS): zwraca nazwę dla adresu IP"></div>
    <div class="cmw-item" data-left="UDP / TCP port 53" data-right="Zapytania standardowe (UDP) oraz transfery stref AXFR (TCP)"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Rekord A vs CNAME:** Rekord A zawsze prowadzi bezpośrednio do adresu IP hosta. Rekord CNAME jest wyłącznie aliasem i musi wskazywać na inną nazwę kanoniczną, nigdy bezpośrednio na numer IP.
- **Port i protokół:** Zapytania DNS domyślnie korzystają z portu **UDP 53** (szybkość, zero narzutu). Port **TCP 53** jest wykorzystywany tylko przy transferach stref (AXFR) lub odpowiedziach przekraczających 512 bajtów (RFC 5966).
- **Czas życia TTL:** Parametr TTL określa w sekundach, jak długo rezolwery i stacje robocze mogą korzystać ze skaszkowanej odpowiedzi bez ponownego odpytywania serwera autorytatywnego.
