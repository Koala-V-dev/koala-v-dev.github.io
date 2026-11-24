# Przepisywanie adresów NAT i PAT (RFC 1918)

Adresy prywatne IPv4 (RFC 1918) nie są routowane w globalnym Internecie. Aby stacja robocza w sieci lokalnej mogła wymieniać dane z serwerami zewnętrznymi, router brzegowy podmienia jej prywatny adres IP oraz numer portu źródłowego na własny adres publiczny w procesie **NAT/PAT** (*NAPT*).

Zbadaj tworzenie wpisów w tablicy stanów translacji (Inside Local / Inside Global), odrzucanie niezapowiedzianego ruchu z sieci WAN oraz konfigurację przekierowania portów:

<data-nat-pat-engine></data-nat-pat-engine>

![Translacja adresów NAT i Port Forwarding](/public/courses/podstawy-sieci-komputerowych/Images/nat-pat-przekierowanie-portow.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź różnicę między Twoim lokalnym adresem IP w sieci domowej a publicznym adresem IP, pod jakim widzi Cię Internet.

Na systemie **Windows (PowerShell)**:

```powershell
# 1. Odczyt lokalnego adresu prywatnego na karcie sieciowej
Get-NetIPAddress -AddressFamily IPv4 | Where-Object InterfaceAlias -notlike "*Loopback*" | Select-Object InterfaceAlias, IPAddress, PrefixLength

# 2. Odczyt publicznego adresu WAN widzianego na zewnątrz
(Invoke-RestMethod -Uri "https://api.ipify.org?format=json").ip
```

Na systemie **Linux**:

```bash
# Lokalny adres prywatny
ip -br addr show | grep UP

# Publiczny adres WAN
curl -s https://api.ipify.org
```

> [!NOTE]
> Przestrzenie prywatne zdefiniowane w **RFC 1918**:
> - `10.0.0.0/8` (`10.0.0.0` do `10.255.255.255`): duże sieci korporacyjne i serwerownie.
> - `172.16.0.0/12` (`172.16.0.0` do `172.31.255.255`): sieci średniej wielkości oraz wirtualizacja.
> - `192.168.0.0/16` (`192.168.0.0` do `192.168.255.255`): sieci domowe, biurowe i pracownie egzaminacyjne INF.02.

---

## ⚙️ Zmiana istniejącej konfiguracji

Gdy hostujesz usługę lub grę na porcie UDP `7777`, pakiet od zdalnego klienta trafia na publiczny adres routera. Ponieważ router nie posiada wpisu w tablicy translacji dla niezapowiedzianego połączenia przychodzącego, pakiet zostaje odrzucony (*DROP*).

Problem ten rozwiązuje się na dwa sposoby:

### 🎯 Metoda A: Statyczne przekierowanie portów (Port Forwarding)
W konfiguracji routera (lub w zadaniu egzaminacyjnym INF.02) tworzy się regułę mapującą port publiczny na adres stacji w sieci lokalnej:
- **Port zewnętrzny WAN:** `7777`
- **Protokół:** `UDP` (lub `TCP/UDP`)
- **Wewnętrzny adres IP:** `192.168.1.15` (stały adres LAN)
- **Port wewnętrzny LAN:** `7777`

W systemie Linux działającym jako router brzegowy regułę dodaje się w podsystemie `iptables`:

```bash
# Włączenie translacji NAPT na porcie 7777 do maszyny w sieci LAN
iptables -t nat -A PREROUTING -p udp -d 203.0.113.4 --dport 7777 -j DNAT --to-destination 192.168.1.15:7777
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

### 🔌 Metoda B: Przebijanie NAT (UDP Hole Punching z protokołem STUN)
Gry P2P nie mogą wymagać od każdego gracza ręcznego logowania się do domowego routera. Wykorzystują protokół **STUN** (RFC 5389):

Oto jak w kodzie **C#** odpytać publiczny serwer STUN Google'a, aby poznać swój publiczny port po translacji NAT (tzw. Server-Reflexive Address):

```csharp
using System;
using System.Net;
using System.Net.Sockets;

// Tworzymy gniazdo UDP powiązane z lokalnym portem
using var socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
socket.Bind(new IPEndPoint(IPAddress.Any, 7777));

// Minimalne zapytanie STUN Binding Request (RFC 5389) do serwera Google
byte[] stunRequest = new byte[20];
stunRequest[0] = 0x00; stunRequest[1] = 0x01; // Binding Request
stunRequest[2] = 0x00; stunRequest[3] = 0x00; // Message Length: 0
stunRequest[4] = 0x21; stunRequest[5] = 0x12; stunRequest[6] = 0xA4; stunRequest[7] = 0x42; // Magic Cookie

IPEndPoint stunServer = new IPEndPoint(Dns.GetHostAddresses("stun.l.google.com")[0], 19302);
socket.SendTo(stunRequest, stunServer);

byte[] stunResponse = new byte[256];
EndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
int bytes = socket.ReceiveFrom(stunResponse, ref remoteEp);

Console.WriteLine($"[STUN] Odebrano odpowiedź ({bytes} bajtów) z serwera: {remoteEp}");
Console.WriteLine("[NAT PUNCH] Router otworzył tymczasową szczelinę w zaporze dla portu 7777!");
```

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj, czy port przekierowany na routerze jest widoczny z zewnątrz przez Internet.

Uruchom nasłuch na stacji roboczej:

```powershell
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, 7777)
$listener.Start()
Write-Host "Nasłuchiwanie aktywne..."
```

Wykonaj sprawdzenie z zewnętrznej maszyny (lub za pomocą sieci komórkowej w smartfonie):

```bash
# Sprawdzenie z komputera poza siecią domową (podstaw publiczny IP routera)
curl -v telnet://203.0.113.4:7777
```

Oczekiwany dowód połączenia:

```text
* Connected to 203.0.113.4 (203.0.113.4) port 7777 (#0)
```

W tablicy połączeń routera powstaje wpis sesji:
```text
UDP 203.0.113.4:7777 <-> 192.168.1.15:7777 (Aktywny)
```

---

## 🛠️ Samodzielna próba

Klasyczną pułapką przy przekierowywaniu portów jest **brak stałego adresu IP** na stacji roboczej. Jeśli router przydzieli stacji inny adres przez DHCP (np. `192.168.1.18` zamiast `192.168.1.15`), reguła Port Forwarding przestanie działać.

Twoje zadanie:
1. Odczytaj fizyczny adres MAC swojej karty sieciowej:
   ```powershell
   Get-NetAdapter | Select-Object Name, MacAddress
   ```
2. Skonfiguruj statyczną rezerwację DHCP (Static DHCP Lease) na routerze lub w pliku konfiguracyjnym serwera DHCP Linux (`/etc/dhcp/dhcpd.conf`), powiązując odczytany adres MAC ze stałym IP `192.168.1.15`.
3. Wymuś odnowienie dzierżawy ze stacji klienta.

Kryteria ukończenia:
- Stacja pobiera dokładnie ten sam adres IP po zresetowaniu karty sieciowej.
- Polecenie `ipconfig /renew` (Windows) lub `dhclient -r && dhclient` (Linux) potwierdza przydzielenie adresu `192.168.1.15`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Wpis rezerwacji w serwerze ISC-DHCP / Linux:
```text
host stacja-dev {
    hardware ethernet 00:1A:2B:3C:4D:5E;
    fixed-address 192.168.1.15;
}
```

Odświeżenie adresu w systemie Windows:
```powershell
ipconfig /release
ipconfig /renew
```

Weryfikacja:
```powershell
Get-NetIPAddress -InterfaceAlias "Ethernet*" -AddressFamily IPv4 | Select-Object IPAddress
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Translacja NAT/PAT i Port Forwarding

<data-gate>
  <data-connection-matcher title="Połącz mechanizm NAT/PAT z odpowiadającym mu efektem w routerze">
    <div class="cmw-item" data-left="PAT / Masquerade (SNAT)" data-right="Podmiana prywatnego IP:Port na publiczne WAN IP i unikalny port"></div>
    <div class="cmw-item" data-left="Port Forwarding (DNAT)" data-right="Statyczne przekierowanie wybranego portu WAN do serwera w LAN"></div>
    <div class="cmw-item" data-left="Niezapowiedziany ruch WAN" data-right="Odrzucenie (DROP) z powodu braku wpisu w tablicy stanów NAT"></div>
    <div class="cmw-item" data-left="Protokół STUN" data-right="Poznanie własnego publicznego IP:Port na potrzeby połączeń P2P"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Istota PAT (NAPT):** Router pozwala setkom komputerów w sieci LAN korzystać z jednego publicznego adresu IP dzięki dynamicznemu podmienianiu portów źródłowych (L4).
- **Połączenia przychodzące:** Domyślnie NAT odrzuca wszystkie pakiety przychodzące z Internetu, chyba że wcześniej komputer z sieci lokalnej zainicjował ruch na ten sam adres lub istnieje statyczna reguła Port Forwarding.
- **P2P i STUN:** Nowoczesne gry wieloosobowe P2P korzystają z protokołu STUN, aby poznać swój publiczny port i nawiązać połączenie bezpośrednie przez jednoczesne wysłanie pakietów UDP (Hole Punching).
