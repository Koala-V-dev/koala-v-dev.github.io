# Wirtualne sieci LAN (VLAN 802.1Q) - segmentacja ruchu L2

W domyślnej konfiguracji przełącznika L2 wszystkie fizyczne porty należą do tej samej domeny rozgłoszeniowej (VLAN 1). Pojedyncza ramka rozgłoszeniowa (np. ARP Broadcast) trafia wtedy do każdego komputera w sieci, wywołując przerwania procesora i ułatwiając podsłuch. Standard **IEEE 802.1Q** pozwala na logiczny podział jednego fizycznego przełącznika na izolowane sieci wirtualne (**VLAN**).

![Wirtualne sieci VLAN 802.1Q i porty Trunk](/public/courses/podstawy-sieci-komputerowych/Images/vlan-access-vs-trunk.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Zanim przypiszesz porty do nowej sieci VLAN na przełączniku zarządzalnym (Cisco / TP-Link / D-Link), musisz sprawdzić bieżącą przynależność portów oraz stan magistrali Trunk.

W trybie uprzywilejowanym CLI przełącznika:

```text
Switch# show vlan brief
```

Odczytaj domyślny stan fabryczny:
- Wszystkie porty od `Fa0/1` do `Fa0/24` oraz `Gi0/1` do `Gi0/2` są domyślnie przypisane do `VLAN 1 (default)`.
- Żaden port nie może pozostać bez przydzielonego VLAN-u.

Sprawdzenie aktywnych łączy magistralnych:

```text
Switch# show interfaces trunk
```

Jeśli polecenie nie zwraca żadnego wyniku, żaden port nie pracuje jeszcze w trybie Trunk (przesyłanie wielu VLAN-ów jednym kablem).

> [!NOTE]
> Ramka standardu **IEEE 802.1Q** otrzymuje 4-bajtowy znacznik (Tag) wstawiany bezpośrednio za adresem źródłowym MAC.

| Pole znacznika 802.1Q | Rozmiar | Znaczenie |
| :--- | :--- | :--- |
| **TPID** (*Tag Protocol Identifier*) | 16 bitów | Stała wartość `0x8100`, informująca o obecności tagu VLAN |
| **PCP** (*Priority Code Point*) | 3 bity | Priorytet QoS (802.1p), np. dla ruchu głosowego VoIP |
| **DEI** (*Drop Eligible Indicator*) | 1 bit | Flaga dopuszczalności odrzucenia ramki przy przeciążeniu |
| **VID** (*VLAN Identifier*) | 12 bitów | Numer VLAN-u od `1` do `4094` (`0` i `4095` są zarezerwowane) |

**Native VLAN (VLAN natywny):** na porcie Trunk jeden wybrany VLAN (domyślnie `VLAN 1`) jest przesyłany **bez znacznika 802.1Q**. Oba końce magistrali Trunk muszą mieć ustawiony ten sam Native VLAN, w przeciwnym razie ruch między nimi wycieknie do niewłaściwej sieci (*Native VLAN Mismatch*). W praktyce produkcyjnej Native VLAN przenosi się na nieużywany numer (np. `switchport trunk native vlan 999`).

---

## 🏷️ Laboratorium VLAN 802.1Q i Router-on-a-Stick

Przepnij porty `Fa0/1` oraz `Fa0/2` do właściwych sieci VLAN, przełącz łącze `Gi0/1` w tryb `Trunk 802.1Q`, podłącz `Router L3` i zweryfikuj trasę pakietów z `PC1`:

<data-vlan-simulator></data-vlan-simulator>

---

## ⚙️ Zmiana istniejącej konfiguracji

Zrealizujmy procedurę podziału przełącznika z arkusza egzaminacyjnego **INF.02**:
1. Utwórz sieć **VLAN 10** o nazwie `ADMINISTRACJA` oraz **VLAN 20** o nazwie `PRACOWNIA`.
2. Przypisz port `Fa0/1` do VLAN 10 (tryb Access).
3. Przypisz port `Fa0/2` do VLAN 20 (tryb Access).
4. Skonfiguruj port światłowodowy/gigabitowy `Gi0/1` jako łącze magistralne (Trunk) do routera z zezwoleniem na transport VLAN 10 i 20.

Sekwencja poleceń w CLI przełącznika:

```text
Switch# configure terminal

! Krok 1: Utworzenie baz VLAN
Switch(config)# vlan 10
Switch(config-vlan)# name ADMINISTRACJA
Switch(config-vlan)# vlan 20
Switch(config-vlan)# name PRACOWNIA
Switch(config-vlan)# exit

! Krok 2: Konfiguracja portów Access dla stacji roboczych
Switch(config)# interface FastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit

Switch(config)# interface FastEthernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20
Switch(config-if)# exit

! Krok 3: Konfiguracja portu Trunk do routera
Switch(config)# interface GigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
Switch(config-if)# exit
```

Weryfikacja poprawności konfiguracji:

```text
Switch# show vlan brief
```

Oczekiwany dowód w tabeli:

```text
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/3, Fa0/4, Fa0/5 ...
10   ADMINISTRACJA                    active    Fa0/1
20   PRACOWNIA                        active    Fa0/2
```

Port `Gi0/1` zniknął z listy portów Access, ponieważ przeszedł w tryb magistrali Trunk.

---

## 🚀 Uruchomienie i test z klienta

Zweryfikuj izolację warstwy 2 (L2) pomiędzy stacjami roboczymi wpiętymi do portów `Fa0/1` i `Fa0/2`.

Podłącz komputer PC1 (`192.168.10.10/24`) do portu `Fa0/1` oraz komputer PC2 (`192.168.20.10/24`) do portu `Fa0/2`.

Z komputera PC1 wyślij zapytanie ICMP Echo do PC2:

```bash
ping 192.168.20.10
```

Oczekiwany dowód izolacji:

```text
Pinging 192.168.20.10 with 32 bytes of data:
Request timed out.
Request timed out.
```

Przełącznik w warstwie 2 fizycznie odcina ramki Broadcast ARP z VLAN 10 od portu w VLAN 20. Stacje robocze zachowują się tak, jakby były wpięte do dwóch zupełnie osobnych, fizycznych przełączników w innych budynkach.

---

## 🛠️ Samodzielna próba

Stacje w różnych VLAN-ach muszą wymieniać dane (np. stacja z pracowni drukuje na serwerze w administracji). Wymaga to uruchomienia routingu międzywęzłowego na routerze podłączonym do portu Trunk (topologia **Router-on-a-Stick**).

Twoje zadanie:
1. Przejdź do CLI routera połączonego kablem z portem `Gi0/1` switcha.
2. Skonfiguruj logiczne podinterfejsy dla każdego VLAN-u z enkapsulacją `802.1Q` i przypisz im adresy bram domyślnych:
   - Podinterfejs `GigabitEthernet 0/0.10` z IP `192.168.10.1/24`
   - Podinterfejs `GigabitEthernet 0/0.20` z IP `192.168.20.1/24`
3. Przetestuj łączność między PC1 a PC2.

Kryteria ukończenia:
- Podinterfejsy routera odpowiadają na pingi z obu sieci VLAN.
- PC1 pinguje PC2 przez router (komunikacja Inter-VLAN działa).

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Konfiguracja na routerze (Router-on-a-Stick):
```text
Router# configure terminal
Router(config)# interface GigabitEthernet 0/0
Router(config-if)# no shutdown
Router(config-if)# exit

! Podinterfejs dla VLAN 10
Router(config)# interface GigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0
Router(config-subif)# exit

! Podinterfejs dla VLAN 20
Router(config)# interface GigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
Router(config-subif)# exit
```

Weryfikacja na routerze:
```text
Router# show ip interface brief
```

Po tej konfiguracji stacja PC1 wysyła pakiet do bramy `192.168.10.1`, router przekierowuje go wewnętrznie do podinterfejsu `.20` i wysyła otagowaną ramkę z powrotem na switch do PC2.

</details>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Atak VLAN Hopping (Double Tagging) oraz sprzętowy routing SVI w przełączniku L3</span>
<span class="deep-dive-badge">BEZPIECZEŃSTWO L2 &amp; SVI</span>
</summary>
<div class="deep-dive-content">

### 🛡️ 1. Atak Double Tagging (VLAN Hopping) i rola Native VLAN

Jeśli port dostępowy atakującego oraz Native VLAN magistrali Trunk należą do domyślnego `VLAN 1`, atakujący może wysłać ramkę z **dwoma znacznikami 802.1Q** (zewnętrzny `VID 1`, wewnętrzny `VID 20`):
1. Pierwszy switch widzi zewnętrzny tag `VID 1` zgodny z Native VLAN łącza Trunk, więc **zdejmuje pierwszy tag** i wysyła ramkę dalej przez Trunk.
2. Drugi switch odbiera ramkę i odczytuje pozostały wewnętrzny tag `VID 20`, dostarczając ją do chronionej sieci `VLAN 20`.

**Obrona:** zmiana Native VLAN na nieużywany numer (np. `999`) oraz wyłączenie automatycznej negocjacji Trunk (*DTP*, `switchport nonegotiate`) na wszystkich portach dostępowych.

### 🚀 2. Router-on-a-Stick a przełącznik wielowarstwowy L3 (SVI)

W układzie **Router-on-a-Stick** ruch między VLAN 10 i VLAN 20 musi dwukrotnie przejść przez ten sam kabel do zewnętrznego routera (tworząc wąskie gardło). W większych sieciach stosuje się przełącznik **L3** z wirtualnymi interfejsami **SVI** (*Switched Virtual Interface*, np. `interface vlan 10` i `interface vlan 20`). Routing odbywa się wówczas w układzie ASIC z pełną prędkością magistrali przełącznika.

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Segmentacja VLAN 802.1Q

<data-gate>
  <data-connection-matcher title="Połącz element konfiguracji VLAN 802.1Q z jego funkcją">
    <div class="cmw-item" data-left="Port Access" data-right="Obsługuje jeden VLAN bez znacznika 802.1Q dla stacji końcowej"></div>
    <div class="cmw-item" data-left="Port Trunk" data-right="Przenosi wiele sieci VLAN z 4-bajtowym tagiem VID (0x8100)"></div>
    <div class="cmw-item" data-left="encapsulation dot1Q 20" data-right="Przypisuje podinterfejs routera do obsługi ramek z VLAN 20"></div>
    <div class="cmw-item" data-left="Izolacja VLAN" data-right="Ogranicza ruch Broadcast ARP wyłącznie do portów tego samego VLAN"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Port Access a Trunk:** Port w trybie *Access* przesyła nieotagowane ramki jednego VLAN-u do urządzenia końcowego, natomiast port *Trunk* transportuje wiele sieci jednocześnie z 4-bajtowym znacznikiem 802.1Q.
- **Izolacja domen rozgłoszeniowych:** Sieci VLAN rozdzielają ruch *Broadcast* w warstwie 2, ograniczając zasięg zbędnych zapytań ARP i zwiększając izolację segmentów.
- **Konieczność routera L3:** Przekazanie ruchu między dwoma różnymi sieciami VLAN wymaga udziału warstwy 3 (routera w układzie *Router-on-a-Stick* lub przełącznika L3).
