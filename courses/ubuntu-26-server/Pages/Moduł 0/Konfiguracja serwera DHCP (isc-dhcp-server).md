# Konfiguracja serwera DHCP (isc-dhcp-server)

`isc-dhcp-server` nadal znajduje się w repozytorium Ubuntu 26.04, choć producent nie rozwija go od <time datetime="2022-10-05">5 października 2022 roku</time>. Ta lekcja jest potrzebna do pracy ze starszymi konfiguracjami `dhcpd.conf`.

## 📦 Instalacja pakietu

```bash
sudo apt update
sudo apt install isc-dhcp-server
```

## 🔌 Wybór interfejsu

```bash
ip -br address
sudo nano /etc/default/isc-dhcp-server
```

![](/public/courses/ubuntu-26-server/Images/isc-dhcp-server-default.png)

```bash
INTERFACESv4="enp0s8"
```

## 📝 Konfiguracja dhcpd.conf

Zachowaj plik pakietu:

```bash
sudo cp /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf_ORI
sudo nano -l /etc/dhcp/dhcpd.conf
```

W okolicach $24$ linii od komentuj linijkę `authoritative;`, co oznacza, że serwer jest autorytatywny.

![](/public/courses/ubuntu-26-server/Images/dhcpd.conf-authoritative.png)


W linii $53 - 63$ masz do od komentowanie główną konfigurację oraz na późniejsze rezerwacje w liniach $82 - 85$.

![](/public/courses/ubuntu-26-server/Images/dhcpd.conf-interesująca-konfiguracja.png)

Mamy następującą templatkę:
```conf
subnet 10.5.5.0 netmask 255.255.255.224 {
    range 10.5.5.26 10.5.5.30;
    option domain-name-servers ns1.internal.local.example.org;
    option domain-name "internal.example.org";
    option subnet-mask 255.255.255.224;
    option routers 10.5.5.1;
    option broadcast-address 10.5.5.31;
    default-lease-time 600;
    max-lease-time 7200;
}
```


| Właściwość                 | Wartość                           |
| -------------------------- | --------------------------------- |
| Interfejs nasłuchu         | *enp0s8*                          |
| Czas ważności dzierżawy    | **$24$ godziny** ($86400$ s)      |
| Maska podsieci             | `255.255.255.0` (`/24`)           |
| Brama domyślna             | `192.168.0.1`                     |
| Serwery DNS                | `192.168.0.1`, `1.1.1.1`          |
| Nazwa domeny               | **_koala-v-local_**               |
| Pula adresów IP            | `192.168.0.200` - `192.168.0.250` |
| Rezerwacja IP (Windows 11) | _**`192.168.0.199`**_             |

```conf
subnet 192.168.0.0 netmask 255.255.255.0 {
    range 192.168.0.200 192.168.0.250;
    option domain-name-servers 192.168.0.1, 1.1.1.1;
    option domain-name "koala-v-local";
    option subnet-mask 255.255.255.0;
    option routers 192.168.0.1;
    option broadcast-address 192.168.0.255;
    default-lease-time 86400;
    max-lease-time 86400;
}

host windows11 {
    hardware ethernet 08:00:27:83:92:BF;
    fixed-address 192.168.0.199;
}
```

Po wszystkim wystarczy zrestartować usługę i sprawdzić jej status:
```bash
sudo systemctl restart isc-dhcp-server
sudo systemctl status isc-dhcp-server
```

![](/public/courses/ubuntu-26-server/Images/isc-dhcp-server-restart-usługi.png)


W razie gdyby usługa po restarcie nie wstała z pomocą przychodzi `journalctl`.

```
sudo journalctl -u isc-dhcp-server --since "5 minutes ago"
```
lub w odniesieniu do aktualnego identyfikatora procesu:
```bash
sudo journalctl _PID=2060
```
Gdzie te `2060` to identyfikator procesu.
Jak wiesz najpierw w ubuntu uruchamia się systemd, z PID równym `1` a potem kolejne usługi i z kardzzym nowym uruchomieniem czy też restartem usługi PID się zmienia. Dlatego zawsze należy je sprawdzić po dokonanych zmianach i restarcie.

Jak widzisz poniżej zdjagnozowanie błędu jest banalne. W lini 59 adres broadcast ma końcówkę `256` zamiast `255`.

![](/public/courses/ubuntu-26-server/Images/journalctl-_PID=-isc-dhcp-server.png)

Gdy usługa zostanie skonfigurowana i działa warto sprawdzić czy maszysny dostały odpowiedznie adresy i jak widać poniżej wszystko jest ok 👍🏼.

![](/public/courses/ubuntu-26-server/Images/sprawdzenie-konfiguracji-isc-dhcp-server-na-klientach-windows11-i-ubuntu26.04-desktop.png)

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Interfejs wybierasz w `/etc/default/isc-dhcp-server`.
- Podsieć, pulę i opcje klientów ustawiasz w istniejącym `dhcpd.conf`.
- `dhcpd -t` sprawdza plik przed restartem.
- Kea i ISC DHCP nie mogą jednocześnie obsługiwać tej samej karty.
