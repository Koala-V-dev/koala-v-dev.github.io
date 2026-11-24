# Adresowanie IPv4, maski i notacja CIDR

Kiedy dwie stacje komunikują się w ramach jednej sieci lokalnej, do dostarczenia ramki wystarczy adres fizyczny MAC. Aby jednak router warstwy 3 mógł przekazać pakiet poza granicę lokalnego segmentu do innej sieci w biurze lub w Internecie, urządzenie musi posiadać logiczny adres **IPv4** zestawiony z **maską podsieci**.

Bez maski podsieci sam adres IP nie informuje systemu operacyjnego, czy adresat znajduje się w tym samym segmencie Ethernet, czy wymaga wysłania pakietu do bramy domyślnej.

---

## 🔢 Anatomia adresu IPv4: 32 bity w 4 oktetach

Adres IPv4 to ciąg 32 bitów podzielony na cztery grupy po 8 bitów zwane **oktetami**. Każdy oktet zapisuje się w postaci dziesiętnej w zakresie od $0$ do $255$ ($2^8 = 256$ wartości):

$$\underbrace{\mathtt{11000000}}_{\mathbf{192}}\ .\ \underbrace{\mathtt{10101000}}_{\mathbf{168}}\ .\ \underbrace{\mathtt{00000001}}_{\mathbf{1}}\ .\ \underbrace{\mathtt{00001111}}_{\mathbf{15}}$$

Łączna przestrzeń adresowa protokołu IPv4 obejmuje dokładnie $2^{32} = 4\,294\,967\,296$ adresów.

---

## 🎯 Rola maski podsieci (NetID oraz HostID)

Podobnie jak numer kierunkowy telefonu oddziela miasto od konkretnego abonenta, adres IPv4 dzieli się na dwie logiczne części:
- **Część sieciowa (*NetID*):** Identyfikuje podsieć, do której należy urządzenie.
- **Część hosta (*HostID*):** Identyfikuje konkretną kartę sieciową wewnątrz tej podsieci.

> [!CRITICAL]
> Sam adres IP (np. `192.168.1.15`) nie wyznacza granicy między siecią a hostem. O tym, które bity identyfikują sieć, decyduje wyłącznie **maska podsieci** poprzez sprzętową operację logicznego iloczynu **AND** (`IP & Maska`).

### 📏 Zasada budowy maski

Maska jest 32-bitowym wzorcem o ciągłej sekwencji jedynek (`1`) od lewej strony, po których następują wyłącznie zera (`0`):
1. Bity o wartości `1` w masce wskazują pozycje należące do *NetID*.
2. Bity o wartości `0` w masce wskazują pozycje przydzielane hostom w *HostID*.

Jedynki i zera w poprawnej masce podsieci nigdy nie przeplatają się między sobą.

---

## ⚡ Notacja CIDR (Classless Inter-Domain Routing, RFC 4632)

Zapis **CIDR** zastępuje długą postać dziesiętną maski ukośnikiem i liczbą kolejnych jedynek bitowych. Przykładowo `192.168.1.15/24` oznacza maskę złożoną z 24 jedynek oraz 8 zer (`255.255.255.0`).

### 📊 Tabela przeliczeniowa masek od /24 do /30

| Prefiks CIDR | Ostatni oktet binarnie | Zapis dziesiętny maski | Bity hosta ($n$) | Adresy ($2^n$) | Użyteczne hosty ($2^n - 2$) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **/24** | `0000 0000` | `255.255.255.0` | $8$ | $256$ | $254$ |
| **/25** | `1000 0000` | `255.255.255.128` | $7$ | $128$ | $126$ |
| **/26** | `1100 0000` | `255.255.255.192` | $6$ | $64$ | $62$ |
| **/27** | `1110 0000` | `255.255.255.224` | $5$ | $32$ | $30$ |
| **/28** | `1111 0000` | `255.255.255.240` | $4$ | $16$ | $14$ |
| **/29** | `1111 1000` | `255.255.255.248` | $3$ | $8$ | $6$ |
| **/30** | `1111 1100` | `255.255.255.252` | $2$ | $4$ | $2$ (łącza punkt-punkt) |

W poniższym wizualizatorze przesuwaj granicę maski CIDR i obserwuj bitową operację `AND` wyznaczającą adres sieci, rozgłoszenia oraz lokalność dwóch hostów:

<data-ipv4-subnet-visualizer></data-ipv4-subnet-visualizer>

---

## 🏛️ Historyczny podział na klasy adresów IPv4

W początkach Internetu zakresy przydzielano sztywno według wartości pierwszego oktetu:

![Struktura klasowa IPv4 i podział na część sieciową i hosta](/public/courses/podstawy-sieci-komputerowych/Images/ipv4-klasy-i-maski.svg)

| Klasa | Zakres 1. oktetu | Bity startowe | Domyślna maska | CIDR | Przeznaczenie |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **A** | $1$ do $126$ | `0...` | `255.0.0.0` | `/8` | Rozległe sieci szkieletowe (16.7 mln hostów na sieć). |
| **B** | $128$ do $191$ | `10...` | `255.255.0.0` | `/16` | Średnie i duże sieci organizacyjne (65 534 hostów). |
| **C** | $192$ do $223$ | `110...` | `255.255.255.0` | `/24` | Lokalne sieci biurowe i domowe (254 hosty). |
| **D** | $224$ do $239$ | `1110...` | Brak maski | Brak | Transmisja grupowa *Multicast* (streaming, OSPF). |
| **E** | $240$ do $255$ | `1111...` | Brak maski | Brak | Zakres badawczy i eksperymentalny IETF. |

---

## 🔒 Adresacja publiczna a pule prywatne RFC 1918

Adresy publiczne przydzielane przez organizację *IANA* oraz rejestry regionalne (w Europie *RIPE NCC*) są globalnie unikalne i routowalne w Internecie.

Pule prywatne zdefiniowane w **RFC 1918** służą wyłącznie do adresacji wewnątrz sieci lokalnych. Routery szkieletowe Internetu bezwarunkowo odrzucają pakiety z tymi adresami:

### 📋 Trzy zakresy prywatne RFC 1918

- **Klasa A:** `10.0.0.0` do `10.255.255.255` (prefiks `10.0.0.0/8`): pojedyncza duża sieć prywatna.
- **Klasa B:** `172.16.0.0` do `172.31.255.255` (prefiks `172.16.0.0/12`): 16 kolejnych podsieci `/16`.
- **Klasa C:** `192.168.0.0` do `192.168.255.255` (prefiks `192.168.0.0/16`): 256 podsieci `/24` stosowanych w domowych routerach i pracowniach.

---

## ⚠️ Adresy specjalne w diagnostyce systemowej

1. **Pętla zwrotna (*Loopback*, `127.0.0.0/8`):** Ruch na adres `127.0.0.1` jest obsługiwany wewnętrznie przez stos jądra systemu operacyjnego bez wysyłania ramek na fizyczną kartę sieciową.
2. **APIPA (*Automatic Private IP Addressing*, `169.254.0.0/16`):** Gdy interfejs w systemie Windows nie otrzyma odpowiedzi z serwera DHCP, system przydziela losowy adres z tej puli z maską `255.255.0.0`.
   > [!IMPORTANT]
   > Adres `169.254.x.x` w wyniku polecenia `ipconfig` wskazuje na brak łączności z serwerem DHCP (odłączony przewód, błędny VLAN lub wyłączona usługa DHCP).
3. **Adres nieokreślony (`0.0.0.0`):** Wskazuje brak przypisanego adresu podczas startu klienta DHCP lub trasę domyślną `0.0.0.0/0` w tablicy routingu.
4. **Rozgłoszenie ograniczone (`255.255.255.255`):** Adres rozgłoszeniowy w lokalnym segmencie L2, zatrzymywany na każdym routerze L3.

---

## 🔒 Sprawdzenie wiedzy: Zakresy specjalne i maski CIDR

<data-gate>
  <data-connection-matcher title="Połącz prefiks lub adres IPv4 z jego rolą w diagnostyce">
    <div class="cmw-item" data-left="169.254.0.0/16" data-right="APIPA: brak odpowiedzi od serwera DHCP"></div>
    <div class="cmw-item" data-left="127.0.0.0/8" data-right="Loopback: wewnętrzny test stosu sieciowego hosta"></div>
    <div class="cmw-item" data-left="/30 (255.255.255.252)" data-right="Maska dająca dokładnie 2 użyteczne adresy (łącze R1-R2)"></div>
    <div class="cmw-item" data-left="192.168.0.0/16" data-right="Pula prywatna RFC 1918 nieroutowana w Internecie"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wyznaczenie adresu sieci i weryfikacja lokalności hosta odbywa się przez operację bitowego iloczynu `IP & Maska`.
- Prefiks *CIDR* określa liczbę kolejnych jedynek w masce podsieci; najczęstsze maski w zadaniach to `/24` (`255.255.255.0`), `/25` (`.128`), `/26` (`.192`), `/27` (`.224`) oraz `/30` (`.252` dla łącz punkt-punkt).
- Pule prywatne *RFC 1918* (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) nie są routowane w globalnym Internecie.
- Adres z zakresu `169.254.0.0/16` (*APIPA*) sygnalizuje brak łączności stacji roboczej z serwerem DHCP.
