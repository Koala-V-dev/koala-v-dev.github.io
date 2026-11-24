# Protokół TCP - 3-Way Handshake i nawiązywanie połączenia

W protokole TCP żadne dane aplikacyjne nie mogą opuścić stacji roboczej, dopóki obie strony nie zsynchronizują numerów sekwencyjnych i nie potwierdzą gotowości buforów w procesie trójkierunkowego uścisku dłoni (3-Way Handshake). Gdy serwer nie odpowiada, jądro systemu klienta ponawia próby wysłania flagi SYN, powodując wielosekundowy timeout. Po tej lekcji będziesz umiał prześledzić stany połączenia w tablicy jądra, odróżnić odrzucenie połączenia flagą RST (`Connection Refused`) od cichego upuszczenia pakietu przez zaporę (`Connection Timed Out`) oraz zweryfikować stan `ESTABLISHED`.

## 🎛️ Laboratorium 3-Way Handshake i maszyny stanów TCP

Zmień początkowe numery sekwencyjne (`ISN`), długość ładunku oraz wymuś utratę odpowiedzi lub zablokowanie portu, aby prześledzić przejścia między stanami `SYN_SENT`, `ESTABLISHED` i `TIME_WAIT`.

<data-tcp-handshake-engine></data-tcp-handshake-engine>

![Nawiązywanie połączenia TCP: 3-Way Handshake](/public/courses/podstawy-sieci-komputerowych/Images/tcp-3way-handshake-i-flagi.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź aktualne stany maszyny stanowej TCP w systemie, aby zobaczyć gniazda w fazie nasłuchu (`LISTEN`), aktywnej sesji (`ESTABLISHED`) oraz zamykania (`TIME_WAIT`).

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetTCPConnection | Group-Object State | Select-Object Count, Name
```

Na systemie **Linux**:

```bash
ss -tan | awk '{print $1}' | sort | uniq -c
```

Znaczenie stanów w tablicy połączeń:
- `SYN_SENT`: klient wysłał żądanie nawiązania sesji i oczekuje na odpowiedź serwera.
- `SYN_RECV`: serwer odebrał SYN, wysłał SYN-ACK i oczekuje na potwierdzenie ACK.
- `ESTABLISHED`: uścisk dłoni został zakończony, a strumień dwukierunkowy jest gotowy do transmisji.

---

## ⚙️ Zmiana istniejącej konfiguracji

Zbadajmy zachowanie klienta TCP w **C#** podczas łączenia się z serwerem, mierząc czas trwania uścisku dłoni (Handshake RTT) oraz obsługując odmowę połączenia flagą RST:

```csharp
using System;
using System.Diagnostics;
using System.Net.Sockets;

string host = "127.0.0.1";
int port = 8080;

using var client = new TcpClient();
var stopwatch = Stopwatch.StartNew();

try
{
    Console.WriteLine($"[HANDSHAKE] Wysyłanie pakietu [SYN] do {host}:{port}...");
    client.Connect(host, port);
    stopwatch.Stop();

    Console.WriteLine($"[ESTABLISHED] Połączenie zestawione w {stopwatch.ElapsedMilliseconds} ms!");
    Console.WriteLine($"Lokalny port efemeryczny klienta: {client.Client.LocalEndPoint}");
}
catch (SocketException ex) when (ex.SocketErrorCode == SocketError.ConnectionRefused)
{
    stopwatch.Stop();
    Console.WriteLine($"[RST ODEBRANY] Port {port} jest zamknięty! Serwer odesłał flagę [RST, ACK] w {stopwatch.ElapsedMilliseconds} ms.");
}
catch (SocketException ex) when (ex.SocketErrorCode == SocketError.TimedOut)
{
    stopwatch.Stop();
    Console.WriteLine($"[TIMEOUT] Brak odpowiedzi po {stopwatch.ElapsedMilliseconds} ms. Zapora sieciowa cicho odrzuciła pakiet SYN (DROP).");
}
```

W **C++** identyfikację błędu `Connection Refused` po wysłaniu SYN realizuje kod `WSAECONNREFUSED` (Windows) lub `ECONNREFUSED` (Linux):

```cpp
#include <iostream>
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")

int main() {
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    SOCKET sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    sockaddr_in target{};
    target.sin_family = AF_INET;
    target.sin_addr.s_addr = inet_addr("127.0.0.1");
    target.sin_port = htons(8080);

    if (connect(sock, (SOCKADDR*)&target, sizeof(target)) == SOCKET_ERROR) {
        int err = WSAGetLastError();
        if (err == WSAECONNREFUSED) {
            std::cout << "[BLAD] Serwer odeslal flage RST (Port zamkniety!)\n";
        }
    } else {
        std::cout << "[SUKCES] Flagi SYN / SYN-ACK / ACK wymienione!\n";
    }

    closesocket(sock);
    WSACleanup();
    return 0;
}
```

---

## 🚀 Uruchomienie i test z klienta

Uruchom lokalny nasłuch w jednym oknie konsoli, a następnie wykonaj test nawiązania połączenia:

W oknie 1 (Serwer testowy PowerShell):

```powershell
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 8080)
$listener.Start()
$client = $listener.AcceptTcpClient()
Start-Sleep -Seconds 3
$listener.Stop()
```

W oknie 2 (Klient diagnostyczny):

```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 8080 -InformationLevel Detailed
```

Oczekiwany dowód powodzenia:

```text
TcpTestSucceeded : True
RemoteAddress    : 127.0.0.1
RemotePort       : 8080
```

Podczas trwania 3-sekundowej pauzy sprawdź stan gniazda:

```powershell
Get-NetTCPConnection -LocalPort 8080
```

Wynik potwierdzający uścisk dłoni:

```text
LocalAddress  LocalPort  RemoteAddress  RemotePort  State
------------  ---------  -------------  ----------  -----
127.0.0.1     8080       127.0.0.1      54210       Established
```

---

## 🛠️ Samodzielna próba

Częstym błędem administracyjnym na egzaminie INF.02 oraz w środowiskach deweloperskich jest brak rozróżnienia między **zamkniętym portem** a **zablokowanym przez zaporę sieciową (Firewall)**.

Twoje zadanie:
1. Uruchom klienta TCP na port, na którym **żadna usługa nie nasłuchuje** (np. `9999`). Zaobserwuj, jaki kod błędu zwraca system i ile milisekund to zajmuje.
2. Zablokuj port `9999` w zaporze Windows regułą blokującą ruch przychodzący:
   ```powershell
   New-NetFirewallRule -DisplayName "Blokada-9999" -Direction Inbound -LocalPort 9999 -Protocol TCP -Action Block
   ```
3. Ponów próbę połączenia z adresem zewnętrznym lub maszyny wirtualnej i porównaj czas reakcji.

Kryteria ukończenia:
- Na porcie zamkniętym odpowiedź następuje w < 5 ms z kodem `ConnectionRefused` (Router/Kernel odesłał flagę RST).
- Na porcie zablokowanym przez DROP w zaporze klient zawiesza się na 20+ sekund i kończy błędem `TimedOut`.
- Usunięcie reguły testowej: `Remove-NetFirewallRule -DisplayName "Blokada-9999"`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Różnica diagnostyczna:
- **Port zamknięty (Brak usługi):** Jądro systemu natychmiast generuje segment TCP z zapaloną flagą **RST (Reset)**. Klient natychmiast wie, że usługa nie działa.
- **Port wycięty zaporą (Drop / Silent Discard):** Pakiet SYN trafia w próżnię. Klient retransmituje pakiet SYN zgodnie z algorytmem wykładniczego cofania (po 1s, 2s, 4s...) aż do limitu czasu gniazda (często 21 sekund w Windows).

Polecenie czyszczące:
```powershell
Remove-NetFirewallRule -DisplayName "Blokada-9999"
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Stany gniazda i sekwencja TCP

<data-gate>
  <data-sortable-list title="Ułóż kolejność stanów oraz wymiany komunikatów w pełnej sesji TCP">
    <item data-correct="3">Klient odsyła [ACK] (Ack = ISN_S + 1) -> oba gniazda wchodzą w ESTABLISHED</item>
    <item data-correct="1">Klient wysyła [SYN] z ISN_K -> przechodzi ze stanu CLOSED do SYN_SENT</item>
    <item data-correct="4">Po wymianie danych strony wymieniają segmenty [FIN, ACK], zamykając kanał</item>
    <item data-correct="2">Serwer (LISTEN) odpowiada [SYN, ACK] z ISN_S i Ack = ISN_K + 1 -> SYN_RCVD</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Przebieg uścisku dłoni:** Nawiązanie sesji TCP wymaga wymiany dokładnie trzech pakietów: `SYN` (od klienta) $\rightarrow$ `SYN-ACK` (od serwera) $\rightarrow$ `ACK` (od klienta).
- **Flaga RST:** Segment z flagą RST natychmiast przerywa połączenie lub informuje o zamkniętym porcie bez oczekiwania na timeout.
- **Koszt opóźnienia:** Każde nowe połączenie TCP dodaje minimum jeden pełny czas RTT (Round-Trip Time) narzutu sieciowego zanim aplikacja wyśle pierwszy bajt danych.
