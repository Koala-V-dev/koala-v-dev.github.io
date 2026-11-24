# Diagnostyka sieciowa - protokół ICMP, Ping i Traceroute

Protokół **ICMP** (*Internet Control Message Protocol*, RFC 792) przenosi komunikaty kontrolne i diagnostyczne stosu IP. Nie transportuje danych aplikacji, lecz zgłasza błędy dostarczania pakietów, niedostępność hostów oraz mierzy opóźnienia w trasie.

Wykorzystują go dwa podstawowe narzędzia diagnostyczne: `ping` (Echo Request/Reply) oraz `traceroute` / `tracert` (mapowanie węzłów przez stopniowe zwiększanie pola *TTL*).

Przetestuj wygaszanie licznika TTL na kolejnych skokach oraz wyznaczanie limitu MTU z flagą *Don't Fragment*:

<data-icmp-traceroute-engine></data-icmp-traceroute-engine>

![Mechanika protokołu ICMP: Ping i Traceroute](/public/courses/podstawy-sieci-komputerowych/Images/icmp-ping-i-traceroute-mechanizm.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Zanim zaczniesz badać odległe serwery, zweryfikuj stan lokalnego interfejsu i bramy domyślnej.

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetIPConfiguration | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway
```

Na systemie **Linux**:

```bash
ip route | grep default
```

Diagnostykę łączności wykonuje się od najbliższego elementu stosu do najdalszego:
1. Pętla lokalna (`127.0.0.1`): weryfikacja poprawności działania stosu TCP/IP w jądrze systemu.
2. Własny adres IP na karcie: sprawdzenie aktywności lokalnego interfejsu.
3. Adres bramy domyślnej: test łączności z lokalnym routerem po skrętce lub Wi-Fi.
4. Zewnętrzny adres IP (np. `8.8.8.8`): test routingu poza sieć lokalną.
5. Nazwa domenowa (np. `google.com`): sprawdzenie poprawności rozwiązywania nazw DNS.

> [!NOTE]
> Podstawowe typy i kody komunikatów ICMP:
> - **Type 8, Code 0:** Echo Request (zapytanie `ping`).
> - **Type 0, Code 0:** Echo Reply (odpowiedź na `ping`).
> - **Type 3, Code 1:** Host Unreachable (brak odpowiedzi ARP w podsieci docelowej).
> - **Type 3, Code 3:** Port Unreachable (host odpowiada, ale port docelowy jest zamknięty).
> - **Type 11, Code 0:** Time-to-Live Exceeded in Transit (licznik TTL osiągnął zero podczas tranzytu).

---

## ⚙️ Zmiana istniejącej konfiguracji

W grach sieciowych i optymalizacji transmisji UDP krytycznym parametrem jest **MTU** (Maximum Transmission Unit, standardowo 1500 bajtów w sieci Ethernet). Jeśli wyślesz pakiet UDP większy niż MTU z ustawioną flagą DF (*Don't Fragment*), router go upuści i odeśle komunikat:
`ICMP Type 3, Code 4: Fragmentation Needed and DF set`.

Przetestujmy maksymalny bezpieczny rozmiar ładunku za pomocą polecenia `ping` z wymuszoną flagą DF:

Na systemie **Windows (PowerShell / CMD)**:

```powershell
# Przełącznik -f ustawia flagę Don't Fragment
# Przełącznik -l ustawia rozmiar bufora ICMP
ping -n 1 -f -l 1472 8.8.8.8
```

Na systemie **Linux**:

```bash
ping -c 1 -M do -s 1472 8.8.8.8
```

Dlaczego dokładnie **1472 bajty**?
$$\text{MTU (1500 B)} - \text{Nagłówek IPv4 (20 B)} - \text{Nagłówek ICMP (8 B)} = 1472 \text{ B ładunku}$$

Oczekiwany wynik dla 1472 bajtów (brak fragmentacji):

```text
Reply from 8.8.8.8: bytes=1472 time=12ms TTL=117
```

Jeśli zwiększysz bufor choćby o 1 bajt (do 1473 B):

```powershell
ping -n 1 -f -l 1473 8.8.8.8
```

Komunikat błędu jądra:

```text
Packet needs to be fragmented but DF set.
```

---

## 🚀 Uruchomienie i test z klienta

Zbadaj pełną ścieżkę do zdalnego serwera, obserwując kolejne routery pośrednie ujawniające się dzięki wygaszaniu pola TTL.

Na systemie **Windows (PowerShell)**:

```powershell
tracert -d 8.8.8.8
```

Na systemie **Linux**:

```bash
traceroute -n 8.8.8.8
```

Oczekiwany dowód (reprezentacja kolejnych skoków):

```text
Tracing route to 8.8.8.8 over a maximum of 30 hops:
  1     1 ms     1 ms     1 ms  192.168.1.1      <-- Twój router domowy (TTL=1 wygasł)
  2     4 ms     3 ms     4 ms  10.200.0.1       <-- Koncentrator dostawcy ISP (TTL=2 wygasł)
  3    11 ms    10 ms    12 ms  72.14.212.138    <-- Router brzegowy szkieletu Internetu
  4    12 ms    11 ms    11 ms  8.8.8.8          <-- Serwer docelowy osiągnięty!
```

Gdy w wynikach pojawiają się gwiazdki `* * * Request timed out`, oznacza to, że dany router pośredni ma skonfigurowaną zaporę odrzucającą pakiety ICMP w celu ochrony procesora (CPU Rate Limiting).

---

## 🛠️ Samodzielna próba

Klasycznym błędem podczas egzaminu zawodowego INF.02 oraz konfiguracji serwerów Windows Server jest włączona zapora systemowa, która domyślnie blokuje przychodzące odpowiedzi `ping` (Echo Request), udając, że maszyna jest wyłączona.

Twoje zadanie:
1. Sprawdź, czy Twój komputer odpowiada na pingi z innej maszyny w sieci lokalnej.
2. Odblokuj ruch ICMPv4 w Zaporze Windows za pomocą polecenia PowerShell:
   ```powershell
   Enable-NetFirewallRule -Name "FPS-ICMP4-ERQ-In"
   ```
3. Ponów test z innego urządzenia w sieci domowej lub maszyny wirtualnej:
   ```bash
   ping <Adres-Twojego-PC>
   ```

Kryteria ukończenia:
- Przed zmianą: `Request timed out`.
- Po odblokowaniu reguły: `Reply from <Adres-Twojego-PC>: bytes=32 time<1ms TTL=128`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Sprawdzenie statusu reguły w PowerShell:
```powershell
Get-NetFirewallRule -Name "FPS-ICMP4-ERQ-In" | Select-Object DisplayName, Enabled, Direction, Action
```

Jeśli reguła nie istniała, można utworzyć ją ręcznie:
```powershell
New-NetFirewallRule -DisplayName "Zezwalaj na ICMPv4 Ping" -Direction Inbound -Protocol ICMPv4 -IcmpType 8 -Action Allow
```

Wyłączenie po ćwiczeniu:
```powershell
Disable-NetFirewallRule -Name "FPS-ICMP4-ERQ-In"
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Kody diagnostyczne ICMP

<data-gate>
  <data-connection-matcher title="Połącz komunikat ICMP z sytuacją diagnostyczną w sieci">
    <div class="cmw-item" data-left="Type 8 Code 0" data-right="Echo Request: wysłane żądanie testu ping"></div>
    <div class="cmw-item" data-left="Type 0 Code 0" data-right="Echo Reply: poprawna odpowiedź z hosta docelowego"></div>
    <div class="cmw-item" data-left="Type 11 Code 0" data-right="Time Exceeded: TTL spadło do zera (podstawa Traceroute)"></div>
    <div class="cmw-item" data-left="Type 3 Code 4" data-right="Fragmentation Needed: pakiet przekracza MTU przy DF=1"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Mechanizm Traceroute:** Narzędzie wysyła kolejne sondy ze stopniowo rosnącą wartością pola *TTL* (1, 2, 3...), zmuszając routery pośrednie do odsyłania komunikatów `ICMP Type 11 Code 0 (Time Exceeded)`.
- **Budżet MTU:** W sieci Ethernet maksymalny rozmiar ładunku bez fragmentacji wynosi 1472 bajty (1500 B minus 20 B nagłówka IP i 8 B nagłówka ICMP).
- **Interpretacja gwiazdek:** Brak odpowiedzi na `ping` lub gwiazdki w `traceroute` wynikają często z reguł zapory sieciowej blokujących ruch ICMP, a nie z przerwania fizycznego łącza.
