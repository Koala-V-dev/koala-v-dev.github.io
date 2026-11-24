# Niezawodność TCP - numery sekwencyjne, okno przesuwne i kontrola przeciążeń

Protokół TCP traktuje przesyłane dane nie jako odrębne paczki, lecz jako ciągły strumień bajtów (Byte Stream). Aby zagwarantować bezbłędne dostarczenie i nie zalać pamięci RAM wolniejszego odbiorcy, jądro systemu dynamicznie reguluje przepustowość za pomocą okna przesuwnego (Sliding Window) oraz algorytmów unikania przeciążeń sieci (np. CUBIC, BBR). Po tej lekcji będziesz umiał przeanalizować rozmiar okna odbiorczego (`rwnd`), skonfigurować rozmiary buforów gniazda w kodzie oraz wyłączyć algorytm Nagle’a (`TCP_NODELAY`), który domyślnie opóźnia małe pakiety w grach o 200 milisekund.

## 📊 Laboratorium okna przesuwnego i retransmisji TCP

Wyślij kolejne segmenty strumienia, zasymuluj zgubienie pakietu w sieci i obserwuj, jak *numer potwierdzenia* (`Ack`) zatrzymuje się na brakującym bajcie aż do retransmisji oraz zmiany rozmiaru okna `rwnd`.

<data-tcp-sliding-window-engine></data-tcp-sliding-window-engine>

![Mechanizm okna przesuwnego TCP](/public/courses/podstawy-sieci-komputerowych/Images/tcp-okno-przesuwne-i-potwierdzenia.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź parametry buforowania i domyślny algorytm kontroli przeciążeń TCP na swoim stanowisku.

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetTCPSetting | Select-Object SettingName, AutoTuningLevelLocal, CongestionProvider
```

Na systemie **Linux**:

```bash
sysctl net.ipv4.tcp_congestion_control net.ipv4.tcp_rmem
```

Parametr `AutoTuningLevelLocal` w systemie Windows odpowiada za dynamiczne skalowanie okna odbiorczego (Window Scaling, RFC 7323), pozwalając na przekroczenie historycznego limitu 64 KB na połączenie i osiąganie gigabitowych transferów.

---

## ⚙️ Zmiana istniejącej konfiguracji

Domyślnie każde gniazdo TCP ma włączony **algorytm Nagle’a** (RFC 896). Został on zaprojektowany, aby oszczędzać pasmo: jądro wstrzymuje wysyłanie małych pakietów (np. pojedynczych kliknięć klawiatury lub współrzędnych gracza) do 200 ms, czekając na zapełnienie pełnego segmentu MSS lub odebranie potwierdzenia ACK dla poprzedniego pakietu.

Dla gier sieciowych i aplikacji interaktywnych opóźnienie 200 ms jest katastrofalne. 

Oto jak wyłączyć algorytm Nagle'a w **C#**, wymuszając natychmiastowe wysyłanie małych pakietów:

```csharp
using System.Net.Sockets;

using var tcpClient = new TcpClient();
tcpClient.Connect("127.0.0.1", 8080);

// Wyłączenie algorytmu Nagle'a - natychmiastowe wypychanie pakietów bez zwłoki!
tcpClient.NoDelay = true;

// Odczyt i powiększenie buforów odbiorczych i nadawczych gniazda
tcpClient.ReceiveBufferSize = 65536; // 64 KB
tcpClient.SendBufferSize = 65536;

Console.WriteLine($"[SOCKET] TCP_NODELAY: {tcpClient.NoDelay}, RcvBuf: {tcpClient.ReceiveBufferSize}");
```

W **C++** tę samą operację wykonuje funkcja `setsockopt` z flagą poziomu protokołu `IPPROTO_TCP`:

```cpp
#include <iostream>
#include <winsock2.h>
#pragma comment(lib, "ws2_32.lib")

void configureSocketForRealtime(SOCKET sock) {
    int flag = 1;
    // Wyłączenie buforowania Nagle'a
    setsockopt(sock, IPPROTO_TCP, TCP_NODELAY, (char*)&flag, sizeof(flag));

    int bufSize = 65536;
    setsockopt(sock, SOL_SOCKET, SO_RCVBUF, (char*)&bufSize, sizeof(bufSize));

    std::cout << "[C++] Gniazdo skonfigurowane w trybie niskiego opóźnienia (TCP_NODELAY).\n";
}
```

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj przepływ danych w sesji o dużej intensywności, obserwując rozmiar okna TCP w aktywnym połączeniu.

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetTCPConnection -State Established | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, AppliedSetting
```

Na systemie **Linux** zaawansowany stan parametrów okna i RTT odczytuje narzędzie `ss`:

```bash
ss -ti '( dport = :8080 or sport = :8080 )'
```

Oczekiwany dowód (wypis parametrów bufora i okna):

```text
cubic wscale:7,7 rto:200 rtt:0.12/0.05 ato:40 cwnd:10 ssthresh:7 bytes_acked:4200 segs_out:12 segs_in:10
```

Odczytane wskaźniki połączenia:
- `cwnd:10`: bieżące okno przeciążeń (*Congestion Window*) nadawcy równe 10 pełnym segmentom.
- `bytes_acked:4200`: liczba skumulowanych bajtów potwierdzonych przez drugą stronę.
- `rtt:0.12`: zmierzony czas Round-Trip Time w milisekundach.

---

## 🛠️ Samodzielna próba

Klient wysyła do serwera 10 kolejnych komend ruchu o rozmiarze 10 bajtów każda w odstępach co 5 ms.

Twoje zadanie:
1. Napisz pętlę wysyłającą 10 pakietów 10-bajtowych przez klienta TCP z domyślnym `NoDelay = false`. Zmierz całkowity czas wysłania.
2. Przestaw flagę na `NoDelay = true` i ponów pomiar.

Kryteria ukończenia:
- Z algorytmem Nagle’a (`NoDelay = false`) pakiety łączą się w grupy, a łączny czas rośnie skokowo przez oczekiwanie na potwierdzenia ACK (opóźnienia rzędu 40 do 200 ms).
- Z wyłączonym algorytmem (`NoDelay = true`) każdy 10-bajtowy segment opuszcza kartę natychmiast.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

```csharp
var sw = System.Diagnostics.Stopwatch.StartNew();

// Test z NoDelay = true
tcpClient.NoDelay = true;
NetworkStream stream = tcpClient.GetStream();
byte[] dummyData = new byte[10];

for (int i = 0; i < 10; i++)
{
    stream.Write(dummyData, 0, dummyData.Length);
    System.Threading.Thread.Sleep(5);
}

sw.Stop();
Console.WriteLine($"Czas wysyłki z TCP_NODELAY=true: {sw.ElapsedMilliseconds} ms");
```

Jeśli aplikacja sieciowa czasu rzeczywistego (np. gra lub terminal interaktywny SSH) zapomni ustawić `TCP_NODELAY`, użytkownicy odczują charakterystyczne „pływanie” kursora lub skokowe przemieszczanie się jednostek.

</details>

---

## 🔒 Sprawdzenie wiedzy: Sterowanie przepływem i niezawodnością TCP

<data-gate>
  <data-connection-matcher title="Połącz mechanizm niezawodności TCP z jego funkcją">
    <div class="cmw-item" data-left="Cumulative ACK" data-right="Potwierdza odbiór wszystkich ciągłych bajtów do pozycji Ack - 1"></div>
    <div class="cmw-item" data-left="Okno rwnd = 0" data-right="Wstrzymuje wysyłkę nadawcy z powodu zapełnionego bufora odbiorcy"></div>
    <div class="cmw-item" data-left="TCP_NODELAY" data-right="Wyłącza buforowanie małych paczek przez algorytm Nagle'a"></div>
    <div class="cmw-item" data-left="Fast Retransmit" data-right="Ponawia utracony segment po wykryciu powtarzających się Duplicate ACK"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Adresowanie bajtowe:** Numery sekwencyjne TCP (`Seq`) i potwierdzenia (`Ack`) nie liczą numerów pakietów, lecz konkretne pozycje bajtów w przesyłanym strumieniu.
- **Rola TCP_NODELAY:** Algorytm Nagle'a domyślnie buforuje małe pakiety. Wyłączenie go (`tcpClient.NoDelay = true`) jest obowiązkowym krokiem w grach i aplikacjach interaktywnych.
- **Skalowanie okna:** Mechanizm Window Scaling pozwala na dynamiczne rozszerzenie bufora odbiorczego (`rwnd`), dzięki czemu sieć przesyła gigabajty danych bez oczekiwania na potwierdzenie każdego pojedynczego segmentu.
