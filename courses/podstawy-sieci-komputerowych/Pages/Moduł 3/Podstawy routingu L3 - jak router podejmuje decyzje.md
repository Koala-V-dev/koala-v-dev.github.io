# Podstawy routingu L3 - jak router podejmuje decyzje

Router nie przesyła pakietów „na ślepo” ani nie powiela ich na wszystkie porty jak przestarzały koncentrator (hub). Dla każdego przychodzącego pakietu IPv4 jądro routera przeszukuje swoją tablicę routingu, stosując bezwzględną zasadę dopasowania najdłuższego prefiksu (Longest Prefix Match). Po wyłonieniu zwycięskiej trasy router dekrementuje pole TTL o 1, przelicza sumę kontrolną L3, zdejmuje starą ramkę Ethernet i enkapsuluje pakiet w nową ramkę ze świeżym adresem fizycznym MAC kolejnego skoku. Po tej lekcji będziesz umiał przeanalizować tablicę tras w systemach Windows i Linux, dodać poprawną trasę statyczną oraz rozwiązać konflikt tras za pomocą metryki.

![Algorytm decyzji routingu L3 i Longest Prefix Match](/public/courses/podstawy-sieci-komputerowych/Images/routing-l3-decyzje-tabela.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Przed dodaniem jakiejkolwiek trasy statycznej musisz odczytać aktualną tablicę routingu jądra oraz zidentyfikować domyślną bramę (`0.0.0.0/0`) i numer indeksu interfejsu (`ifIndex`).

Na systemie **Windows (PowerShell)**:

```powershell
Get-NetRoute -AddressFamily IPv4 | Sort-Object DestinationPrefix | Format-Table DestinationPrefix, NextHop, RouteMetric, ifIndex
```

Na systemie **Linux**:

```bash
ip route show
```

Elementy widoczne w tablicy:
- `0.0.0.0/0 via <Brama>`: trasa domyślna (*Default Gateway*) o długości prefiksu 0 bitów. Jest wybierana tylko wtedy, gdy żadna bardziej szczegółowa trasa nie pasuje do adresu docelowego.
- Trasy bezpośrednio podłączone (`link-local` / `proto kernel`): sieci, do których router jest fizycznie wpięty własnymi interfejsami.

> [!NOTE]
> **Zasada Longest Prefix Match (LPM):**  
> Jeśli pakiet ma adres docelowy `192.168.10.45`, a w tablicy tras istnieją wpisy `0.0.0.0/0`, `192.168.0.0/16` oraz `192.168.10.0/25`, router wybierze trasę trzecią (`/25`), ponieważ dopasowuje najdłuższy ciąg bitów prefiksu.

---

## 🧭 Symulator decyzji routingu L3 i algorytmu LPM

Wprowadź docelowy adres IPv4 lub wybierz trasę testową, aby prześledzić dopasowanie bitowe prefiksów w tablicy tras routera:

<data-routing-engine></data-routing-engine>

---

## ⚙️ Zmiana istniejącej konfiguracji

Wyobraźmy sobie scenariusz laboratoryjny INF.02: Twoja stacja robocza (`192.168.1.10/24`) musi komunikować się z odciętą podsiecią serwerową `10.50.0.0/24`, która znajduje się za routerem pośrednim o adresie `192.168.1.254`.

Domyślna brama (`192.168.1.1`) prowadzi do Internetu i nie wie nic o sieci `10.50.0.0/24`. Musisz dodać trasę statyczną.

Konfiguracja trasy statycznej w systemie **Windows (PowerShell z uprawnieniami Administratora)**:

```powershell
# Dodanie trasy do podsieci 10.50.0.0/24 przez bramę 192.168.1.254
New-NetRoute -DestinationPrefix "10.50.0.0/24" -NextHop "192.168.1.254" -InterfaceAlias "Ethernet" -RouteMetric 10
```

W systemie **Linux**:

```bash
sudo ip route add 10.50.0.0/24 via 192.168.1.254 dev eth0 metric 10
```

Test obecności trasy w tablicy jądra:

```powershell
Find-NetRoute -RemoteIPAddress "10.50.0.15"
```

Oczekiwany wynik:

```text
IPAddress         : 10.50.0.15
InterfaceAlias    : Ethernet
DestinationPrefix : 10.50.0.0/24
NextHop           : 192.168.1.254
RouteMetric       : 10
```

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj przepływ pakietów i upewnij się, że ruch do adresu `10.50.0.1` opuszcza komputer przez właściwy router pośredni, a nie przez domyślną bramę internetową.

Wykonaj śledzenie trasy w wierszu poleceń:

```powershell
tracert -d -h 3 10.50.0.1
```

Oczekiwany dowód wyboru właściwego skoku (Next-Hop):

```text
Tracing route to 10.50.0.1 over a maximum of 3 hops
  1     1 ms     1 ms     1 ms  192.168.1.254
  2     2 ms     2 ms     2 ms  10.50.0.1
Trace complete.
```

Zwróć uwagę: pierwszy skok to `192.168.1.254` (zgodnie z naszą trasą statyczną), a nie `192.168.1.1` (brama domyślna).

---

## 🛠️ Samodzielna próba

Klasycznym problemem administratorów sieci jest konflikt metryk przy obecności dwóch kart sieciowych (np. jednoczesne połączenie Ethernet i Wi-Fi). Gdy obie karty zgłaszają domyślną bramę `0.0.0.0/0`, system wybiera kartę o **niższej metryce**.

Twoje zadanie:
1. Odczytaj metryki swoich aktywnych interfejsów:
   ```powershell
   Get-NetIPInterface -AddressFamily IPv4 | Select-Object InterfaceAlias, InterfaceMetric
   ```
2. Zmień metrykę interfejsu Wi-Fi na wyższą (np. `50`), a kablowego interfejsu Ethernet na niższą (np. `5`), wymuszając priorytet dla stabilnego połączenia kablowego:
   ```powershell
   Set-NetIPInterface -InterfaceAlias "Wi-Fi" -InterfaceMetric 50
   Set-NetIPInterface -InterfaceAlias "Ethernet" -InterfaceMetric 5
   ```
3. Zweryfikuj, która brama domyślna wygrała w tablicy tras.

Kryteria ukończenia:
- Trasa `0.0.0.0/0` przez interfejs `Ethernet` posiada sumaryczną niższą metrykę i obsługuje cały ruch domyślny.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Sprawdzenie zwycięskiej trasy domyślnej:
```powershell
Get-NetRoute -DestinationPrefix "0.0.0.0/0" | Sort-Object RouteMetric
```

Trasa na szczycie listy z najmniejszą wartością `RouteMetric` jest trasą aktywną. Jeśli router o niższej metryce ulegnie awarii, jądro automatycznie przekieruje pakiety na zapasową bramę o wyższej metryce.

Usuwanie trasy testowej po ćwiczeniu:
```powershell
Remove-NetRoute -DestinationPrefix "10.50.0.0/24" -NextHop "192.168.1.254" -Confirm:$false
```

</details>

---

## 🔒 Sprawdzenie wiedzy: Priorytet wyboru trasy L3

<data-gate>
  <data-sortable-list title="Uszereguj trasy dla adresu docelowego 10.50.0.15 od najwyższego do najniższego priorytetu wyboru (LPM)">
    <item data-correct="3">10.50.0.0/16 (dopasowanie 16 bitów)</item>
    <item data-correct="1">10.50.0.0/26 (najdłuższy dopasowany prefiks: 26 bitów)</item>
    <item data-correct="4">0.0.0.0/0 (trasa domyślna / Gateway of Last Resort)</item>
    <item data-correct="2">10.50.0.0/24 (dopasowanie 24 bitów)</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Reguła Longest Prefix Match:** Jądro routera zawsze wybiera trasę o najdłuższej masce (najbardziej szczegółową), niezależnie od tego, kiedy została dodana.
- **Rola pola TTL:** Każdy router na trasie dekrementuje TTL pakietu o 1. Gdy TTL osiągnie 0, pakiet zostaje skasowany, co zapobiega nieskończonemu krążeniu pakietów w pętlach routingu.
- **Niezmienność adresów IP:** Podczas routingu L3 źródłowe i docelowe adresy IP w nagłówku pozostają niezmienne (chyba że działa NAT). Zmianie na każdym skoku ulegają wyłącznie adresy MAC warstwy łącza danych (L2).
