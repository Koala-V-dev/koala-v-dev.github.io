# Podział sieci (Subnetting VLSM) w praktyce inżynierskiej

W tradycyjnym podziale sieci (FLSM) każda podsieć otrzymuje identyczną maskę, co marnuje setki adresów IP na łączach punkt-punkt i blokuje rozwój infrastruktury. Technologia **VLSM** (*Variable Length Subnet Masking*) pozwala na stosowanie masek o zmiennej długości dopasowanych ściśle do zapotrzebowania każdego działu firmy. Po tej lekcji będziesz umiał podzielić zadaną pulę adresową (np. `192.168.10.0/24`) za pomocą szybkiej inżynierskiej metody magicznej liczby (kroku), przypisać właściwe maski podsieci interfejsom w systemach Windows i Linux oraz bezbłędnie wypełnić tabelę adresacji w arkuszu egzaminacyjnym INF.02.

![Podział przestrzeni adresowej VLSM](/public/courses/podstawy-sieci-komputerowych/Images/vlsm-podzial-przestrzeni.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Zanim przystąpisz do podziału, musisz określić liczbę wymaganych adresów dla każdego segmentu i uszeregować je według złotej reguły VLSM:

> [!IMPORTANT]
> **Zawsze sortuj podsieci MALEJĄCO według wymaganej liczby hostów!**  
> Jeśli zaczniesz alokację od małej podsieci (np. łącza 2-hostowego), pofragmentujesz przestrzeń adresową i nie zmieścisz dużego bloku (np. 60 hostów) na naturalnej granicy potęgi dwójki.

Wzór na liczbę użytecznych hostów dla maski z $n$ zerami:
$$\text{Użyteczne hosty} = 2^n - 2$$
*(Odejmujemy 2 adresy: pierwszy to adres całej podsieci, ostatni to adres rozgłoszeniowy Broadcast).*

Tabela inżynierska masek dla ostatniego oktetu (Magiczna liczba = $256 - \text{wartość maski}$):

| Prefiks CIDR | Maska dziesiętna | Zera ($n$) | Liczba użytecznych hostów | Krok (Magiczna liczba) |
| :---: | :--- | :---: | :---: | :---: |
| **/25** | `255.255.255.128` | 7 | $2^7 - 2 = \mathbf{126}$ | **128** |
| **/26** | `255.255.255.192` | 6 | $2^6 - 2 = \mathbf{62}$ | **64** |
| **/27** | `255.255.255.224` | 5 | $2^5 - 2 = \mathbf{30}$ | **32** |
| **/28** | `255.255.255.240` | 4 | $2^4 - 2 = \mathbf{14}$ | **16** |
| **/29** | `255.255.255.248` | 3 | $2^3 - 2 = \mathbf{6}$ | **8** |
| **/30** | `255.255.255.252` | 2 | $2^2 - 2 = \mathbf{2}$ (Łącza P2P) | **4** |

---

## 📐 Projektant podziału VLSM

Wprowadź zapotrzebowanie na liczbę stacji dla poszczególnych działów, aby zweryfikować sortowanie malejące i dobór najmniejszych bloków potęgi dwójki:

<data-vlsm-designer></data-vlsm-designer>

---

## ⚙️ Zmiana istniejącej konfiguracji

Zaprojektujmy adresację dla puli **`192.168.1.0/24`** dla 4 segmentów sieci:
1. **Dział Sprzedaży:** 50 hostów $\rightarrow$ $2^6 - 2 = 62$ hosty $\rightarrow$ Maska **/26** (`255.255.255.192`, krok = 64)
   - Adres sieci: `192.168.1.0 /26`
   - Zakres użyteczny: `192.168.1.1` do `192.168.1.62`
   - Broadcast: `192.168.1.63`
2. **Dział Magazynu:** 25 hostów $\rightarrow$ $2^5 - 2 = 30$ hostów $\rightarrow$ Maska **/27** (`255.255.255.224`, krok = 32)
   - Start od kolejnego wolnego adresu: `192.168.1.64 /27`
   - Zakres użyteczny: `192.168.1.65` do `192.168.1.94`
   - Broadcast: `192.168.1.95`
3. **Zarząd:** 10 hostów $\rightarrow$ $2^4 - 2 = 14$ hostów $\rightarrow$ Maska **/28** (`255.255.255.240`, krok = 16)
   - Start od kolejnego wolnego adresu: `192.168.1.96 /28`
   - Zakres użyteczny: `192.168.1.97` do `192.168.1.110`
   - Broadcast: `192.168.1.111`
4. **Łącze P2P Router-Router:** 2 adresy $\rightarrow$ $2^2 - 2 = 2$ hosty $\rightarrow$ Maska **/30** (`255.255.255.252`, krok = 4)
   - Start: `192.168.1.112 /30`
   - Hosty: `192.168.1.113` oraz `192.168.1.114`
   - Broadcast: `192.168.1.115`

Przypisanie pierwszego użytecznego adresu dla Działu Sprzedaży na stacji roboczej:

Na systemie **Windows (PowerShell)**:

```powershell
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress "192.168.1.1" -PrefixLength 26 -DefaultGateway "192.168.1.62"
```

Na systemie **Linux**:

```bash
sudo ip addr add 192.168.1.1/26 dev eth0
sudo ip route add default via 192.168.1.62
```

Test poprawności przypisania w systemie:

```powershell
Get-NetIPAddress -InterfaceAlias "Ethernet" -AddressFamily IPv4 | Format-Table IPAddress, PrefixLength
```

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj za pomocą polecenia `ping`, czy stacja poprawnie komunikuje się wewnątrz swojej nowej podsieci `/26` i czy nie odbiera nieuprawnionego ruchu z sąsiedniej podsieci `/27`.

W wierszu poleceń:

```powershell
# 1. Test łączności z bramą podsieci Sprzedaży
Test-Connection -TargetName 192.168.1.62 -Count 2

# 2. Weryfikacja adresu rozgłoszeniowego podsieci
ping 192.168.1.63
```

Oczekiwany dowód:

```text
Pinging 192.168.1.63 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time<1ms TTL=128
```

Stacja robocza wie, że adres `192.168.1.64` leży już w obcej sieci i próba wysłania do niego pakietu skieruje ruch do bramy domyślnej, a nie na lokalny switch L2.

---

## 🛠️ Samodzielna próba

Typowe zadanie z arkusza egzaminacyjnego **INF.02**:
Otrzymałeś pulę `10.20.30.0/24`. Zaprojektuj podział VLSM dla dwóch podsieci:
- **LAN-A:** 100 komputerów (przypisz pierwszy użyteczny IP interfejsowi routera).
- **LAN-B:** 50 komputerów (przypisz ostatni użyteczny IP serwerowi).

Twoje zadanie:
1. Oblicz maskę CIDR i krok dla LAN-A oraz LAN-B.
2. Wskaż adres sieci, zakres użyteczny i broadcast dla obu podsieci.
3. Wskaż dokładny adres IP przypisany routerowi w LAN-A oraz serwerowi w LAN-B.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Obliczenia:
1. **LAN-A (100 hostów):**
   - $2^7 - 2 = 126$ hostów $\rightarrow$ Maska **/25** (`255.255.255.128`, krok = 128).
   - Adres sieci: `10.20.30.0 /25`
   - Użyteczne hosty: `10.20.30.1` do `10.20.30.126`
   - Broadcast: `10.20.30.127`
   - **IP Routera (pierwszy użyteczny):** `10.20.30.1 /25`

2. **LAN-B (50 hostów):**
   - Kolejny wolny adres: `10.20.30.128`
   - $2^6 - 2 = 62$ hosty $\rightarrow$ Maska **/26** (`255.255.255.192`, krok = 64).
   - Adres sieci: `10.20.30.128 /26`
   - Użyteczne hosty: `10.20.30.129` do `10.20.30.190`
   - Broadcast: `10.20.30.191`
   - **IP Serwera (ostatni użyteczny):** `10.20.30.190 /26`

Pozostała wolna przestrzeń: od `10.20.30.192` do `10.20.30.255` (64 wolne adresy).

</details>

---

## 🔒 Sprawdzenie wiedzy: Kolejność i projektowanie VLSM

<data-gate>
  <data-sortable-list title="Ułóż kolejność przydziału podsieci metodą VLSM z puli 192.168.50.0/24">
    <item data-correct="3">Podsieć C (10 hostów): maska /28 (blok 16 adresów)</item>
    <item data-correct="1">Podsieć A (45 hostów): maska /26 (blok 64 adresy)</item>
    <item data-correct="4">Łącze punkt-punkt R1-R2 (2 hosty): maska /30 (blok 4 adresy)</item>
    <item data-correct="2">Podsieć B (20 hostów): maska /27 (blok 32 adresy)</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Sortowanie malejące:** Alokację VLSM rozpoczynaj zawsze od podsieci o największej liczbie hostów, aby bloki leżały na granicach potęg dwójki bez zachodzenia adresów.
- **Krok w oktecie:** Skok kolejnych sieci wynosi $256 - \text{wartość maski w danym oktecie}$, co pozwala wyznaczyć adres sieci, zakres użyteczny i adres rozgłoszeniowy bez rozpisywania bitów.
- **Łącza punkt-punkt `/30`:** Do połączenia dwóch routerów stosuje się maskę `/30` (`255.255.255.252`), dającą dokładnie dwa użyteczne adresy IP.
