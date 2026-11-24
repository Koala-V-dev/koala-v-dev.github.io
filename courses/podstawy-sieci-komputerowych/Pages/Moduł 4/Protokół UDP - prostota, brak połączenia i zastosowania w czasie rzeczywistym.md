# Protokół UDP - prostota, brak połączenia i zastosowania w czasie rzeczywistym

W grach sieciowych akcji (strzelanki, gry wyścigowe) oraz komunikacji głosowej VoIP największym wrogiem rozgrywki nie jest drobna utrata pakietów, lecz nagłe opóźnienie (lag spike). Gdy protokół TCP gubi pojedynczą paczkę danych, wstrzymuje dostarczanie wszystkich kolejnych klatek w buforze jądra (zjawisko Head-of-Line Blocking), dopóki stary pakiet nie zostanie retransmitowany. Po tej lekcji będziesz umiał uruchomić bezpołączeniowe gniazdo UDP w C# oraz C++, zweryfikować port w systemie operacyjnym i zaimplementować odrzucanie przestarzałych klatek stanu gry na podstawie numeru sekwencyjnego.

## 📡 Laboratorium strumienia UDP Real-Time kontra TCP

Włącz stratę pakietu w sieci i porównaj zachowanie kolejki odbiorczej protokołów UDP i TCP oraz przelicz rozmiar pola Length w 8-bajtowym nagłówku UDP:

<data-socket-multiplexer mode="udp_stream"></data-socket-multiplexer>

![Protokół UDP i eliminacja Head-of-Line Blocking](/public/courses/podstawy-sieci-komputerowych/Images/protokol-udp-naglowek-mechanizm.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Zanim otworzysz gniazdo UDP dla serwera gry lub usługi, musisz sprawdzić, czy wybrany port (np. `7777` lub `27015`) nie jest już zajęty przez inny proces na Twoim stanowisku.

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetUDPEndpoint -LocalPort 7777 -ErrorAction SilentlyContinue
```

Na systemie **Linux**:

```bash
ss -ulpn 'sport = :7777'
```

Jeśli polecenie zwróci pusty wynik, port jest wolny i gotowy do nasłuchiwania. Jeśli wskaże aktywny proces (PID), musisz wybrać inny port lub zamknąć kolidującą aplikację.

> [!NOTE]
> UDP nie posiada stanów połączenia (takich jak `ESTABLISHED` czy `TIME_WAIT`). W tablicy gniazd jądra port UDP widnieje jako `UNCONN` (Linux) lub `*.*` (Windows), co oznacza gotowość na odebranie datagramu od dowolnego nadawcy.

---

## ⚙️ Zmiana istniejącej konfiguracji

Zbudujmy minimalistyczny odbiornik stanu gry w **C#** (silniki Unity / Godot / .NET), który nasłuchuje na porcie UDP `7777` w trybie nieblokującym i odczytuje współrzędne gracza:

```csharp
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

// Inicjalizacja gniazda UDP na porcie 7777
using var udpServer = new UdpClient(7777);
IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);

Console.WriteLine("Oczekiwanie na klatki stanu gry (UDP 7777)...");

while (true)
{
    // Odbiór pojedynczego datagramu bez narzutu na zestawianie połączenia
    byte[] packet = udpServer.Receive(ref remoteEp);
    
    // Odczyt: 4 bajty nagłówka sekwencji + payload pozycji
    uint seq = BitConverter.ToUInt32(packet, 0);
    string payload = Encoding.UTF8.GetString(packet, 4, packet.Length - 4);
    
    Console.WriteLine($"[Klatka #{seq}] z {remoteEp}: {payload}");
}
```

Dla silników pisanych w **C++** (np. Unreal Engine / custom engine) ten sam mechanizm realizuje bezpośrednie wywołanie biblioteki Berkeley / Winsock:

```cpp
#include <iostream>
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")

int main() {
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    SOCKET sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    
    sockaddr_in serverService{};
    serverService.sin_family = AF_INET;
    serverService.sin_addr.s_addr = INADDR_ANY;
    serverService.sin_port = htons(7777);

    bind(sock, (SOCKADDR*)&serverService, sizeof(serverService));

    char recvBuf[512];
    sockaddr_in clientAddr{};
    int clientLen = sizeof(clientAddr);

    // Odbiór klatki czasu rzeczywistego
    int bytesRecv = recvfrom(sock, recvBuf, sizeof(recvBuf), 0, (SOCKADDR*)&clientAddr, &clientLen);
    std::cout << "Odebrano datagram UDP (" << bytesRecv << " bajtow)\n";

    closesocket(sock);
    WSACleanup();
    return 0;
}
```

Test składni i obecności aktywnego gniazda w systemie po uruchomieniu programu:

```powershell
Get-NetUDPEndpoint -LocalPort 7777
```

Poprawny wynik:

```text
LocalAddress  LocalPort
------------  ---------
0.0.0.0       7777
```

---

## 🚀 Uruchomienie i test z klienta

Wyślij z terminala testowy datagram UDP, aby zasymulować klatkę ruchu gracza wysłaną przez klienta.

Na systemie **Linux / WSL** (narzędzie `netcat`):

```bash
echo -n -e "\x01\x00\x00\x00POS:X=120,Y=45,Z=10" | nc -u -w1 127.0.0.1 7777
```

Na systemie **Windows (PowerShell)**:

```powershell
$client = New-Object System.Net.Sockets.UdpClient
$data = [System.Text.Encoding]::UTF8.GetBytes("POS:X=120,Y=45,Z=10")
# Dodajemy 4 bajty numeru sekwencji (Klatka #1)
$packet = [byte[]]@(1, 0, 0, 0) + $data
$client.Send($packet, $packet.Length, "127.0.0.1", 7777)
$client.Close()
```

Oczekiwany dowód w oknie serwera:

```text
[Klatka #1] z 127.0.0.1:54321: POS:X=120,Y=45,Z=10
```

---

## 🛠️ Samodzielna próba

Pakiety UDP mogą dotrzeć do serwera w złej kolejności (np. klatka `#5` wyprzedzi klatkę `#4` z powodu wyboru innej trasy routingu przez routery pośrednie). Jeśli serwer bezkrytycznie zastosuje klatkę `#4` po klatce `#5`, postać gracza cofnie się w czasie (tzw. rubberbanding).

Twoje zadanie:
1. Zadeklaruj w pętli zmienną `uint lastSequence = 0;`.
2. Zaimplementuj filtr odrzucający przestarzałe klatki: jeśli odebrany numer klatki jest mniejszy lub równy `lastSequence`, odrzuć datagram bez aktualizowania stanu gry.
3. Jeśli numer klatki jest większy, zaktualizuj pozycję i zapisz nowy `lastSequence`.

Kryteria ukończenia:
- Klatka `#2` nadesłana po klatce `#3` zostaje zignorowana z komunikatem w konsoli.
- Klatki o rosnących numerach aktualizują pozycję płynnie bez zacięć.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

```csharp
uint lastSequence = 0;

while (true)
{
    byte[] packet = udpServer.Receive(ref remoteEp);
    uint seq = BitConverter.ToUInt32(packet, 0);

    // Filtr świeżości danych (Drop outdated frames)
    if (seq <= lastSequence)
    {
        Console.WriteLine($"[DROP] Odrzucono przestarzałą klatkę #{seq} (Ostatnia: #{lastSequence})");
        continue;
    }

    lastSequence = seq;
    string payload = Encoding.UTF8.GetString(packet, 4, packet.Length - 4);
    Console.WriteLine($"[APPLY #{seq}]: {payload}");
}
```

Typowy błąd:
Gdy nie zresetujesz `lastSequence` po rozłączeniu gracza, nowo dołączony gracz rozpoczynający od klatki `#1` będzie miał wszystkie pakiety odrzucane do momentu przekroczenia starej wartości licznika.

</details>

---

## 🔒 Sprawdzenie wiedzy: Właściwości protokołu UDP

<data-gate>
  <data-connection-matcher title="Połącz pojęcie protokołu UDP z jego charakterystyką">
    <div class="cmw-item" data-left="8 bajtów nagłówka" data-right="Source Port, Dest Port, Length oraz Checksum (po 2 bajty)"></div>
    <div class="cmw-item" data-left="Brak Head-of-Line Blocking" data-right="Nowsze datagramy trafiają do aplikacji mimo utraty starszej paczki"></div>
    <div class="cmw-item" data-left="Stan UNCONN w ss -ulpn" data-right="Brak stanów ESTABLISHED i brak nawiązywania sesji 3-Way Handshake"></div>
    <div class="cmw-item" data-left="Filtr lastSequence" data-right="Kod aplikacji odrzuca spóźnione klatki gry przybyłe w złej kolejności"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Brak Head-of-Line Blocking:** UDP nie wstrzymuje nowo przybyłych pakietów w buforze jądra, co pozwala grom sieciowym renderować natychmiast najświeższy stan świata gry.
- **Narzut nagłówka:** Nagłówek UDP ma dokładnie 8 bajtów (Source Port, Dest Port, Length, Checksum) i nie zawiera żadnych flag synchronizacji ani potwierdzeń.
- **Odpowiedzialność aplikacji:** Przy transmisji UDP to kod Twojej gry (C#/C++) odpowiada za filtrację kolejności pakietów, obsługę utraconych klatek i synchronizację zegara.
