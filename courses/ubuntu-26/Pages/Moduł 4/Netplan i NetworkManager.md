# Netplan i NetworkManager


## tree nie jest domyślnym pakietem komendy

W systemach z rodziny Debian oraz w Ubuntu konfiguracja sieci opiera się na narzędziu Netplan. Kluczowa różnica między wersją desktopową a serwerową dotyczy używanego wykonawcy konfiguracji, określanego jako **_renderer_**.

W wersji Ubuntu Desktop domyślnym wykonawcą jest **NetworkManager** (w skrócie **NM**). Zarządza on profilami połączeń w sposób dynamiczny i ułatwia obsługę sieci Wi-Fi oraz zmianę interfejsów w środowisku graficznym.  
Na serwerach preferowana jest wyższa stabilność oraz przewidywalność, a połączenia są realizowane wyłącznie po kablu. Dlatego wykorzystuje się tam usługę o niższym narzucie **`systemd-networkd`**, która nie nadpisuje swoimi działaniami przygotowanych konfiguracji Netplan.

Przygotuj dwie maszyny wirtualne i upewnij się, że mają różne adresy MAC:
- VM1: Jedna karta sieciowa pracująca w trybie sieci wewnętrznej.
- VM2: Dwie karty sieciowe: jedna w sieci wewnętrznej, a druga w trybie NAT.

![Ubuntu sieć wewnętrzna](/public/courses/ubuntu-26/Images/ubuntu-sieć-wewnętrzna.png)

---

Od razu możesz zmienić tonację kolorów w terminalu na czytelniejszą niż ta domyślna, np.:
- Monokai Soda
- Monokai Dark

![Ubuntu terminal kolor ip br route a](/public/courses/ubuntu-26/Images/terminal-kolor-ip-br-route-a.png)

Jak widzisz, ja używam motywu Monokai Dark.

---

## 🔍 Rozpoznanie interfejsów, tras i uprawnień

Zanim przejdziesz do modyfikacji plików YAML, zapoznaj się z interfejsami sieciowymi oraz ich aktualnymi ustawieniami:

```bash
ip a
```

Wynikiem powyższego polecenia zobaczysz nazwy interfejsów i stan UP/DOWN lub UNKNOWN, typ połączenia, adres MAC, adres IPv4 oraz IPv6:

```shell
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:07:3e:6e brd ff:ff:ff:ff:ff:ff
    altname enx080027073e6e
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic noprefixroute enp0s3
       valid_lft 83475sec preferred_lft 83475sec
```

1. Pierwsza pozycja `lo` to sieć pętli zwrotnej (*localhost*, adres IPv4 `127.0.0.1/8`, IPv6 `::1/128`). Służy do komunikacji systemu z samym sobą między zainstalowanymi usługami przy użyciu stosu ISO/OSI (jest to najwydajniejszy sposób).
2. Kolejne interfejsy dotyczą fizycznych lub wirtualnych kart sieciowych a ich nazwy są zależne od dystrybucji i środowiska (np. w VirtualBox: `enp0s3`, `enp0s8`, `enp0s9`, `enp0s10` a na fizycznym sprzęcie mogą być `eth0`, `eth1` itp.).

![Ubuntu terminal ipa br route a](/public/courses/ubuntu-26/Images/ipa-br-routre.png)

Dodatkowo warto znać polecenie wyświetlające skrócone informacje o interfejsach:

```bash
ip -br address
```

```shell
lo               UNKNOWN        127.0.0.1/8 ::1/128 
enp0s3           UP             10.0.2.15/24 
```

Zdecydowanie ważniejszym i koniecznym do zapamiętania poleceniem jest:

```bash
ip route
```

Pozwala ono na podejrzenie tablicy routingu, gdzie wpis `default via` oznacza bramę domyślną. Jest to adres routera, przełącznika lub innego urządzenia przekazującego ruch do innych sieci:

```shell
default via 10.0.2.2 dev enp0s3 proto dhcp src 10.0.2.15 metric 100 
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15 metric 100 
```

- `default via`: brama domyślna, do której wysyłany jest cały ruch z nieokreślonym przeznaczeniem.
- `dev`: nazwa karty sieciowej, przez którą wysyłany jest ruch.
- `proto`: protokół użyty do konfiguracji interfejsu:
  - `dhcp`: adres pobrany z serwera DHCP.
  - `static`: adres skonfigurowany statycznie.
  - `kernel`: adres skonfigurowany bezpośrednio przez jądro systemu.
- `src`: adres źródłowy używany do wysłania pakietów.
- `metric`: metryka określająca priorytet interfejsu (im niższa wartość, tym wyższy priorytet).

---

### 🛡️ Kopia zapasowa i uprawnienia <code>/etc/netplan/</code>

Gdy poniższym poleceniem podejrzymy zawartość katalogu `/etc/netplan/`, zauważymy pliki z rozszerzeniem `.yaml`. Uprawnienia tych plików muszą wynosić `600` (`-rw-------`) przyznane wyłącznie właścicielowi `root`. Oznacza to, że pliki konfiguracyjne są przeznaczone tylko do odczytu i zapisu przez administratora. Jeżeli grupa właścicielska lub inni użytkownicy mieliby jakiekolwiek prawa, usługa Netplan zgłosi ostrzeżenie o zbyt otwartych uprawnieniach (*permissions are too open*).


```bash
ls -l /etc/netplan
```

Dla bezpieczeństwa przygotujmy katalog na kopię zapasową tych konfiguracji w swojej lokalizacji domowej. Wykorzystamy do tego polecenie `mkdir` z opcją `-p` pozwalającą na budowanie struktury katalogów:

```bash
mkdir -p ~/etc/netplan/
```


![Przygotowanie katalogu na kopię zapasową](/public/courses/ubuntu-26/Images/listowanie-netplan-tworzenie-katalogu-i-kopia-plików-z-sprawdzeniem.png)


Gdy struktura w katalogu `~/etc/netplan/` jest gotowa, skopiujmy wszystkie pliki z katalogu `/etc/netplan/` do `~/etc/netplan/` przy użyciu polecenia `cp` z opcją `-p`, aby zachować wszystkie uprawnienia i metadane:

```bash
sudo cp -p /etc/netplan/* ~/etc/netplan/
```

Upewniamy się czy zawartość najważniejszego z nich (`01-network-manager-all.yaml`) jest poprawna i czy użycie `cat`  bez `sudo` zostanie odrzucone z błędem braku uprawnień:

---

### 📝 Nowa konfiguracja interfejsów i obsługa błędów YAML

Skoro mamy bezpieczną kopię zapasową, możemy usunąć oryginalne pliki z `/etc/netplan/` i utworzyć nowy plik konfiguracyjny:

```bash
sudo rm -rf /etc/netplan/*
sudo nano /etc/netplan/00-net-conf.yaml
```

![](/public/courses/ubuntu-26/Images/usuniecie-zawartości-netplan-i-przygotowanie-się-do-edycji-w-nano-nowego-pliku-00-net-conf.yaml.png)

Możemy wyświetlić w drugim oknie terminala dotychczasową zawartość skopiowanego pliku `01-network-manager-all.yaml` i zapisać nową konfigurację w nano (`^O` czyli <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span>).

Aby zweryfikować poprawność nowego pliku konfiguracyjnego, korzystamy z polecenia:

```bash
sudo netplan try
```

![](/public/courses/ubuntu-26/Images/netplan-new-conf-bad-perm.png)

Jak widać na powyższym obrazku, podczas próby zastosowania nowej konfiguracji mogą pojawić się dwa typowe błędy:
1. **Ostrzeżenie o uprawnieniach:** plik utworzony w `/etc/netplan/` ma uprawnienia inne niż `600`.
2. **Błąd składniowy YAML:** nieodpowiednia ilość spacji lub literówki 
  ```
      renderer: NetworkManager
              ^
  ```
> [!CAUTION]
> W plikach YAML **_nie wolno używać klawisza <kbd>Tab</kbd>_** do tworzenia wcięć. Należy używać wyłącznie spacji.

Aby rozwiązać ostrzeżenie o uprawnieniach, użyj polecenia nadpisującego prawa dla wszystkich plików w katalogu `/etc/netplan/`:

```bash
sudo chmod 600 /etc/netplan/*
```

---

## 🧱 Przygotowanie maszyn i konfiguracja netplan

<data-tabs>
  <tabs>
    <item>Konfiguracja VM1</item>
    <item>Konfiguracja VM2</item>
  </tabs>
  <div>

### 🛠️ Konfiguracja VM1

| Karta sieciowa VB | Interfejs w ubuntu | Typ działania   |
| ----------------- | ------------------ | --------------- |
| Karta 1           | enp0s3             | Sieć wewnętrzna |

Poniższa konfiguracja ustawi statyczny adres IPv4 `192.168.50.10` z maską podsieci `255.255.255.0` w skróconym zapisie `/24`. Opcjonalnie dla pełnej poprawności można zadeklarować wyłączenie DHCP `dhcp4: false`, ale nie jest to konieczne.

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: false
      addresses:
        - 192.168.50.10/24
```

Gdy zapiszesz konfigurację wykonaj (nie czekaj kliknij <kbd>Enter</kbd>, i od razu się zastosuje jeżeli nie ma błędów)

```bash
sudo netplan try
```

Dla pewności możesz wykonać jeszcze (albo od razu zamiast try):

```bash
sudo netplan apply
```


![Dwa okna terminala. Na pierwszym konfiguracja netplan, a na drugim zastosowanie jej i sprawdzenia ip a](/public/courses/ubuntu-26/Images/netplan-vm1-setup-conf.png)

  </div>
  <div>

### 🛠️ Krok po kroku na maszynie VM2

| Karta sieciowa VB | Interfejs w ubuntu | Typ działania   |
| ----------------- | ------------------ | --------------- |
| Karta 1           | enp0s3             | NAT             |
| Karta 2           | enp0s8             | Sieć wewnętrzna |
| Karta 3           | enp0s9             | Nie podłączona  |
| Karta 4           | enp0s10            | Nie podłączona  |

Poniższa konfiguracja ustawi dynamicznie pobierany i stosowany adres z puli DHCP VirtualBoxa na pierwszym interfejsie NAT oraz adres statyczny IPv4 `192.168.50.20` z maską podsieci `255.255.255.0` w skróconym zapisie `/24`. Bez opcjonalnego `dhcp4: false` dla karty sieciowej pracującej w sieci wewnętrznej.

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: true
    enp0s8:
      addresses:
        - 192.168.50.20/24
```
Poniżej widzisz wszystkie 4 karty sieciowe z czego dwie ostatnie nie mają konfiguracji więc są wyłączone (**_DOWN_**).

![Dwa okna terminala. Na pierwszym konfiguracja netplan, a na drugim zastosowanie jej i sprawdzenia ip a](/public/courses/ubuntu-26/Images/netplan-vm2-setup-conf.png)

  </div>
</data-tabs>

---

## 🧪 Weryfikacja połączenia

Po konfiguracji interfejsów sieciowych musisz się jeszcze upewnić że komunikacja przebiega poprawnie.  
Dlatego wykonaj ping z obu maszyn na tą drugą.


```bash
ping -c 4 [ADRES_IP_DRUGIEJ_MASZYNY]
```

![Dwa okna terminala. Na pierwszym konfiguracja netplan, a na drugim zastosowanie jej i sprawdzenia ip a](/public/courses/ubuntu-26/Images/netplan-test-ping-dwie-maszyny.png)

### 🚂 Przekazywanie ruchu do internetu, Brama, DNS i NAT

Przestrzegam prze stosowaniem `gatewey4` jest zdepresjonowany i w nowszych systemach jako bramy domyślnej używamy pierwszego domyślnego wpisu w `routes:`.

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: true
    enp0s8:
      addresses:
        - 192.168.50.20/24
      routes:
        - to: default
          via: 192.168.50.20
```

Jak widać dzieki zastosowaniu bramy mogłżna spingować z VM1 kratę siciową NAT VM2 w innej podsieci, ale dalej nie spinguje się DNS Googla. 

![Wygląd okna z wynikami poleceń ip -br route oraz resolvectl status](/public/courses/ubuntu-26/Images/netplan-route-default-gatewey.png)

Aby VM2 udostępniła internet maszynie VM1 trzeba włączyć tymczasowo funkcjonalność routera i mechanizm NAT.

```bash
sudo sysctl -w net.ipv4.ip_forward=1
sudo iptables -t nat -A POSTROUTING -o enp0s3 -j MASQUERADE
```

- `sysctl` jest narzędziem do zarządzania parametrami jądra Linux.
  - `-w` - pozwala na **w**pisanie (zmianę) wartości parametru jądra.
  - `net.ipv4.ip_forward` - parametr jądra Linux odpowiedzialny za przekazywanie ruchu IP.
- `iptables` jest narzędziem do zarządzania tablicami, łańcuchami i regułami filtrowania pakietów IP.
  - `-t nat` - wskazuje na tablicę `nat` odpowiedzialną za operacje na adresach IP.
  - `-A POSTROUTING` - dodaje regułę do łańcucha `POSTROUTING`, wykonywanego **po** zakończeniu operacji na adresach IP.
  - `-o enp0s3` - określa interfejs wyjściowy (kartę sieciową NAT `enp0s3` na VM2).
  - `-j MASQUERADE` - określa akcję `MASQUERADE` (mechanizm NAT pozwalający na udostępnianie internetu maszynie VM1).

Dzieki temu VM1 ma pośrednio dostęp do internetu... Do puki VM2 nie zostanie ponownie uruchomiona. 

![Wygląd okna z wynikami poleceń cat /proc/sys/net/ipv4/ip_forward oraz sysctl net.ipv4.ip_forward](/public/courses/ubuntu-26/Images/netplan-ipv4-forwarding.png)

Końcowa konfiguracja netplanu dla maszyny VM1 powinna wyglądać tak:

```yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: false
      addresses:
        - 192.168.50.10/24
      routes:
        - to: default
          via: 192.168.50.20
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```



### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Netplan przechowuje opis konfiguracji, a NetworkManager wykonuje go w Ubuntu Desktop.
- Maszyna może korzystać z niezależnych kart: jednej dla ruchu internetowego (NAT) i drugiej dla prywatnej sieci laboratoryjnej.
- Karta w prywatnej sieci `ubuntu-lab` nie wymaga bramy domyślnej ani DNS, aby uniknąć konfliktów tras.
- Przestarzała klauzula `gateway4` została wycofana na rzecz bloku `routes:`.
- Konfiguracja z `renderer: NetworkManager` tworzy profil widoczny w oknie Ustawień graficznych.
- Po wprowadzeniu zmian w sieci należy sprawdzić adresy (`ip -br address`), trasy (`ip route`), DNS (`resolvectl status`) oraz łączność (`ping`).
