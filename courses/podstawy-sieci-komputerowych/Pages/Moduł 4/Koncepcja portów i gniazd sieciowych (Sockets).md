# Koncepcja portów i gniazd sieciowych (Sockets)

Adres IP pozwala pakietom dotrzeć do właściwej maszyny w sieci, ale to gniazdo sieciowe (Socket) decyduje, który konkretny proces w systemie operacyjnym odbierze dane. Jeśli uruchomisz serwer gry lub usługę WWW na adresie pętli zwrotnej `127.0.0.1`, żaden gracz z sieci lokalnej nie zdoła się z Tobą połączyć. Po tej lekcji będziesz umiał zidentyfikować aktywne gniazda w systemie, powiązać proces gry z interfejsem sieciowym za pomocą poprawnego bindu (`0.0.0.0`) oraz zweryfikować 5-krotkę (5-tuple) połączenia w tabeli jądra.

## 🔌 Laboratorium gniazd sieciowych i 5-krotki

Otwieraj równoległe sesje klienckie na porcie `:443`, obserwuj przydział portów efemerycznych oraz przetestuj błąd zajętego portu `EADDRINUSE` przy podwójnym wywołaniu `bind()`:

<data-socket-multiplexer mode="sockets"></data-socket-multiplexer>

![Gniazdo sieciowe i demultipleksacja w jądrze](/public/courses/podstawy-sieci-komputerowych/Images/gniazdo-sieciowe-porty-zakresy.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Zanim aplikacja sieciowa otworzy gniazdo, sprawdź aktualne powiązania w tablicy jądra, aby zobaczyć, które porty i interfejsy są już zajęte przez system.

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess | Sort-Object LocalPort
```

Na systemie **Linux**:

```bash
ss -tlpn
```

Zwróć uwagę na kolumnę adresu lokalnego:
- `127.0.0.1:port`: gniazdo nasłuchuje **wyłącznie** na pętli lokalnej (brak dostępu z sieci z zewnątrz).
- `0.0.0.0:port` lub `:::port`: gniazdo nasłuchuje na **wszystkich fizycznych kartach sieciowych** hosta.

> [!NOTE]
> Przestrzeń portów 16-bitowych dzieli się na trzy standardowe zakresy IANA:
> - **0 do 1023 (Well-Known):** Zarezerwowane dla usług systemowych (np. 22 SSH, 80 HTTP, 443 HTTPS). W systemie Linux wymagają uprawnień administratora (root).
> - **1024 do 49151 (Registered):** Dedykowane dla aplikacji użytkownika, baz danych i serwerów usług (np. 3306 MySQL, 7777 serwer gry).
> - **49152 do 65535 (Dynamic/Ephemeral):** Przydzielane losowo przez system operacyjny dla wychodzących połączeń klienckich.

---

## ⚙️ Zmiana istniejącej konfiguracji

Typowym błędem początkujących programistów gier w C# lub C++ jest powiązanie gniazda z adresem `localhost`, co uniemożliwia testy w sieci lokalnej (LAN). 

Oto poprawny kod serwera w **C#**, który wiąże gniazdo ze wszystkimi kartami sieciowymi (`IPAddress.Any` czyli `0.0.0.0`) na dedykowanym porcie `8080`:

```csharp
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

// Poprawny bind na wszystkich interfejsach hosta
IPEndPoint localEndPoint = new IPEndPoint(IPAddress.Any, 8080);
using Socket listener = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

listener.Bind(localEndPoint);
listener.Listen(10);

Console.WriteLine($"[SERWER] Gniazdo aktywne na {localEndPoint}. Oczekiwanie na graczy...");

using Socket handler = listener.Accept();
Console.WriteLine($"[POŁĄCZONO] Klient: {handler.RemoteEndPoint}");

byte[] msg = Encoding.UTF8.GetBytes("Witaj na serwerze gry!\n");
handler.Send(msg);
handler.Shutdown(SocketShutdown.Both);
```

Ten sam mechanizm w **C++ (POSIX / Winsock)**:

```cpp
#include <iostream>
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")

int main() {
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    SOCKET listenSock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

    sockaddr_in service{};
    service.sin_family = AF_INET;
    service.sin_addr.s_addr = htonl(INADDR_ANY); // 0.0.0.0 - wszystkie karty!
    service.sin_port = htons(8080);

    bind(listenSock, (SOCKADDR*)&service, sizeof(service));
    listen(listenSock, SOMAXCONN);

    std::cout << "[C++] Nasłuchiwanie na 0.0.0.0:8080...\n";

    sockaddr_in clientAddr{};
    int clientLen = sizeof(clientAddr);
    SOCKET clientSock = accept(listenSock, (SOCKADDR*)&clientAddr, &clientLen);

    std::cout << "[C++] Połączenie zaakceptowane!\n";

    closesocket(clientSock);
    closesocket(listenSock);
    WSACleanup();
    return 0;
}
```

Test obecności gniazda w systemie:

```powershell
Get-NetTCPConnection -LocalPort 8080
```

Oczekiwany wynik:

```text
LocalAddress  LocalPort  RemoteAddress  RemotePort  State   OwningProcess
------------  ---------  -------------  ----------  -----   -------------
0.0.0.0       8080       0.0.0.0        0           Listen  <PID>
```

---

## 🚀 Uruchomienie i test z klienta

Nawiąż połączenie z innej powłoki terminala, odpytując serwer o dane powitalne.

Na systemie **Windows (PowerShell)**:

```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 8080
```

Lub za pomocą narzędzia `curl`:

```bash
curl http://127.0.0.1:8080
```

Oczekiwany dowód w oknie serwera:

```text
[POŁĄCZONO] Klient: 127.0.0.1:54128
```

Sprawdź tabelę połączeń w trakcie trwania sesji:
System operacyjny jednoznacznie identyfikuje to połączenie za pomocą **5-krotki (5-Tuple)**:
1. Protokół: `TCP`
2. Źródłowy adres IP: `127.0.0.1`
3. Źródłowy port klienta (efemeryczny): `54128`
4. Docelowy adres IP: `127.0.0.1`
5. Docelowy port serwera: `8080`

---

## 🛠️ Samodzielna próba

Serwer gry musi przetwarzać zapytania od wielu graczy bez zawieszania pętli głównej (`Accept()` jest operacją blokującą).

Twoje zadanie:
1. Skonfiguruj gniazdo serwera w trybie nieblokującym (`listener.Blocking = false;` w C# lub za pomocą `ioctlsocket(sock, FIONBIO, ...)` w C++).
2. Obsłuż wyjątek `SocketException` o kodzie błędu `10035` (`WSAEWOULDBLOCK` / `EWOULDBLOCK`), który pojawia się, gdy w kolejce nie ma jeszcze żadnego oczekującego gracza.
3. Spraw, aby serwer wypisywał kropkę co 500 ms, gdy nikt się nie łączy, a po pojawieniu się połączenia obsłużył klienta.

Kryteria ukończenia:
- Program nie zawiesza się na `Accept()`.
- Konsola serwera kontynuuje pracę, a połączenie od klienta zostaje natychmiast przyjęte.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

```csharp
listener.Blocking = false;

while (true)
{
    try
    {
        Socket handler = listener.Accept();
        Console.WriteLine($"\n[NOWY GRACZ]: {handler.RemoteEndPoint}");
        handler.Close();
        break;
    }
    catch (SocketException ex) when (ex.SocketErrorCode == SocketError.WouldBlock)
    {
        // Brak oczekujących połączeń w tej klatce - silnik może liczyć fizykę gry
        Console.Write(".");
        System.Threading.Thread.Sleep(500);
    }
}
```

Komunikat diagnostyczny:
Jeśli nie obsłużysz błędu `WouldBlock`, program wyrzuci nieobsłużony wyjątek: `System.Net.Sockets.SocketException (10035): A non-blocking socket operation could not be completed immediately`.

</details>

---

## 🔒 Sprawdzenie wiedzy: Powiązanie gniazd i porty

<data-gate>
  <data-connection-matcher title="Połącz element konfiguracji gniazd sieciowych z jego zachowaniem w systemie">
    <div class="cmw-item" data-left="127.0.0.1:8080" data-right="Nasłuch wyłącznie lokalny (Loopback), brak dostępu z sieci LAN"></div>
    <div class="cmw-item" data-left="0.0.0.0:8080" data-right="Powiązanie ze wszystkimi interfejsami sieciowymi maszyny"></div>
    <div class="cmw-item" data-left="49152 do 65535" data-right="Zakres efemerycznych portów źródłowych przydzielanych klientom"></div>
    <div class="cmw-item" data-left="5-krotka (5-tuple)" data-right="Zbiór (Protokół, IP src, Port src, IP dst, Port dst) rozróżniający sesje"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Identyfikator połączenia:** Jądro systemu rozróżnia sesje sieciowe za pomocą pełnej 5-krotki (Protokół, IP źródłowe, Port źródłowy, IP docelowe, Port docelowy).
- **Zasada bindowania:** Adres `127.0.0.1` ogranicza usługę do komputera lokalnego; udostępnienie jej w sieci LAN wymaga nasłuchu na `0.0.0.0` (`IPAddress.Any`).
- **Porty efemeryczne:** Klientowi nie trzeba przydzielać portu ręcznie, ponieważ jądro systemu automatycznie rezerwuje tymczasowy port z zakresu dynamicznego (49152 do 65535) na czas sesji.
