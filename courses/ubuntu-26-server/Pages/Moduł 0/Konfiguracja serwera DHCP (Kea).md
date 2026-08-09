# Konfiguracja serwera DHCP (Kea)

Server **DHCP** (*Dynamic Host Configuration Protocol*) to usługa sieciowa, która automatycznie przydziela adresy IP oraz parametry konfiguracyjne urządzeniom w sieci lokalnej.

---

## 🏗️ Przygotowanie środowiska i instalacja Kea DHCP

Zaimportuj **Ubuntu 26.04 Server** i przydziel mu dwie karty sieciowe:
1. Pierwsza karta w trybie `NAT` (do wyjścia w świat / do Internetu).
2. Druga karta w trybie `Sieć wewnętrzna` (do obsługi naszej sieci LAN).

Do testów przydadzą się dwie maszyny klienckie podłączone do sieci wewnętrznej:  
**Ubuntu 26.04 Desktop** oraz **Windows 11**.

Na początku zaktualizujmy repozytoria i zainstalujmy serwer **Kea DHCP**:

```bash
sudo apt update
sudo apt install kea-dhcp4-server -y
```

![](/public/courses/ubuntu-26-server/Images/update-and-bad-netplan.png)

Zauważ, że mimo podpięcia dwóch kart, tylko jedna ma narazie przydzielony adres IP. Zanim uruchomimy serwer DHCP, musimy skonfigurować drugi interfejs w Netplanie.

---

## ⚙️ Konfiguracja interfejsu sieciowego w Netplan

Sprawdźmy zawartość `/etc/netplan/` za pomocą `ls -l`.  
Znajdziesz tam domyślny plik z instalacji. Zamiast go modyfikować, stworzymy własny `00-net-conf.yaml`.

![](/public/courses/ubuntu-26-server/Images/nowy-plik-netplan.png)

Jego zawartość będzie wyglądać następująco:

```yaml
network:
  version: 2
  ethernets:
    enp0s3:
      dhcp4: true
      dhcp6: false
    enp0s8:
      addresses:
        - 192.168.0.1/24
```

Zapisz plik i zastosuj zmiany poleceniem:

```bash
sudo netplan apply
```

Sprawdźmy wynik przez `ip a` lub `ip -br address`:

![](/public/courses/ubuntu-26-server/Images/nowy-netplan-zweryfikowany.png)

---

## 🔍 Poprawa czytelności pliku konfiguracyjnego w nano

Główny plik z ustawieniami usługi leży w `/etc/kea/kea-dhcp4.conf`. Podgląd zawartości w tym katalogu wymaga uprawnień `sudo`.

![Kea DHCP - domyślny plik konfiguracyjny serwera Kea DHCP](/public/courses/ubuntu-26-server/Images/lokalizacja-pliku-konfiguracji-kea-dhcp.png)

Otwórzmy go w edytorze `nano`:

```bash
sudo nano /etc/kea/kea-dhcp4.conf
```

![Domyślny plik konfiguracyjny serwera Kea DHCP](/public/courses/ubuntu-26-server/Images/paskudny-kea-dhcp4.conf.png)

> Tego się po prostu nie da czytać, a większość poradników robi kopiuj-wklej z internetu. 😒

Jednak jest sposób, żeby ten plik wyglądał o czytelniej. Zauważ, że zastosowany tu format to nic innego jak `JSONC` (*JSON with Comments*).

Utwórzmy najpierw kopię zapasową oryginału, a następnie zmieńmy rozszerzenie z `.conf` na `.json`:

```bash
sudo cp /etc/kea/kea-dhcp4.conf /etc/kea/kea-dhcp4.conf__ORI
sudo mv /etc/kea/kea-dhcp4.conf /etc/kea/kea-dhcp4.json
```

![](/public/courses/ubuntu-26-server/Images/kea-dhcp4-json.png)

Teraz gdy otworzysz ten sam plik z nowym rozszerzeniem, `nano` od razu załapie, jakiej składni kolorystycznej użyć:

```bash
sudo nano /etc/kea/kea-dhcp4.json
```

No i z takim plikiem można się już bawić. 😎

![Kea DHCP - plik konfiguracyjny w formacie JSONC](/public/courses/ubuntu-26-server/Images/kea-nano-json.png)

---

## 🧰 Czyszczenie kodu i praca w edytorze nano

Najlepiej będzie do tego podejść iteracyjnie.  
Na początek usuń wszystkie komentarze (są to linie zaczynające się od `//`).

W `nano` możesz łatwo usuwać linie przy pomocy `^K` <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>. W razie gdybyś niechcący usunął nie tę linię co trzeba, skorzystaj z `M-U` <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>U</kbd></span>.

> [!TIP]
> Podczas tego procesu przydadzą ci się dwa protipy:
> - `^L` <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>L</kbd></span> przewinie stronę tak, by linia na której znajduje się kursor była na środku.
> - Kolor kursora zmienia się z białego na błękitny, gdy jesteś w linii z komentarzem.
>   ![Nano kursorem w linii z komentarzem](/public/courses/ubuntu-26-server/Images/tipy-dla-usuwania-komentarzy.png)

Gdy pozbędziesz się całego szumu wywołanego komentarzami, zapisz plik `^O` <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span> oraz wyjdź z edytora `^X` <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> i uruchom `nano` jeszcze raz z opcją **`-l`**. Da ci to numerowanie linii. 🤓

```bash
sudo nano -l /etc/kea/kea-dhcp4.json
```

![Czysty plik konfiguracyjny serwera Kea DHCP i uruchomienie nano z opcją -l](/public/courses/ubuntu-26-server/Images/czyste-kea-config-i-uruchomienie-nano-z-opcją--l.png)

---

## 🏗️ Struktura formatu JSON

**JSON** (*JavaScript Object Notation*) to tekstowy format wymiany danych. By go w miarę sensownie ogarnąć, musisz znać parę zasad:
- `{ }` : Klamry reprezentują strukturę obiektu. Plik JSON przechowuje tylko jeden obiekt, dlatego całość zawartości musi być otoczona klamrą (to jest *wrapper*). Taki obiekt ma klucze i wartości.
  - `"klucz" : "wartość"` : Para klucz-wartość. Klucz zawsze musi być w cudzysłowie `" "`, po dwukropku podajesz wartość tego klucza. Wartość może być:
    - tekstowa (*string*) i wtedy musi zostać zapisana w cudzysłowie.
    - liczbowa: jest zapisywana bez żadnych wrapperów, tak po prostu.
    - logiczna: w JSON są to `true` i `false` zapisywane bez cudzysłowu.
    - kolejny obiekt: czyli znowu klamry `{ }` i tworzy nam się zagnieżdżona struktura w strukturze.
    - tablica `[ ]`: czyli taki obiekt, ale zawierający tylko wartości bez kluczy.

Przykładzik:

```json
{
  "imie": "Kamil",
  "wiek": 27,
  "czyKobieta": false,
  "komputer": {
    "procesor": "Intel Core i7-12700F",
    "ram": { "pojemnosc_gb": 32, "typ": "DDR4" },
    "dyski": [
      { "typ": "SSD NVMe", "generacja": 3, "pojemnosc_tb": 2 },
      { "typ": "SSD NVMe", "generacja": 4, "pojemnosc_tb": 4 }
    ]
  },
  "ulubioneLiczby": [ 3, 2137, 420, 69 ]
}
```

### Omówienie blokowe właściwości obiektu JSON z pliku <code>kea-dhcp4</code>

W obiekcie JSON znajduje się tylko jedna właściwość `Dhcp4`, której wartością jest obiekt. Ten obiekt przechowuje w sobie $11$ wpisów typu klucz-wartość:

1. _**`"interfaces-config"`**_: to obiekt, który posiada jedynie klucz `"interfaces"`, a jego wartością jest tablica stringów. Wpisujemy tu jako string nazwę interfejsu, przez który będzie świadczona usługa DHCP.

<details><summary>Niewymagane klucze</summary>

2. `"control-socket"`: gniazdo kontrolne, czyli obiekt definiujący sposób komunikacji z usługą Kea DHCP (domyślnie przez gniazdo jądra UNIX). Zawarte tu pola zależą od wybranego typu gniazda.
3. `"lease-database"`: to z kolei obiekt, w którym definiujemy w jaki sposób serwer Kea ma przechowywać informacje o wypożyczonych adresach.
     - `type: memfile` oznacza że te dane są w postaci pliku załadowanego do pamięci RAM.
     - `lfc-interval`: *lease file clean interval*, oznacza co ile sekund serwer będzie sprzątał.
4. `"expired-leases-processing"`: to z kolei obiekt, w którym definiujemy właściwości:
     - `"reclaim-timer-wait-time"`: czas jaki serwer ma czekać przed rozpoczęciem usuwania wygasłych dzierżaw.
     - `"flush-reclaimed-timer-wait-time"`: czas jaki serwer ma czekać przed usunięciem wygasłych dzierżaw.
     - `"hold-reclaimed-time"`: czas jaki serwer ma przechowywać wygasłe dzierżawy zanim je usunie.
     - `"max-reclaim-leases"`: maksymalna liczba dzierżaw do usunięcia w jednym cyklu.
     - `"max-reclaim-time"`: maksymalny czas jaki serwer ma przeznaczyć na usuwanie wygasłych dzierżaw.
     - `"unwarned-reclaim-cycles"`: liczba cykli usuwania wygasłych dzierżaw przed wysłaniem ostrzeżenia.

</details>

---

5. _**`"renew-timer"`**_: timer odnowienia dzierżawy (pół wartości czasu ważności).
6. _**`"rebind-timer"`**_: timer ponowienia dzierżawy (całkowita wartość czasu ważności).
7. _**`"valid-lifetime"`**_: czas ważności dzierżawy.
8. _**`"option-data"`**_: to tablica obiektów, gdzie ciekawsze są dwa pierwsze:
     - Ustawienie adresów DNS:
       - `"name"`: nazwa opcji.
       - `"data"`: adres serwera DNS w formacie dziesiętnym z kropkami (oktety).
     - Ustawienie nazwy domeny:
       - `"code"`: kod $15$ w usłudze DHCP odnosi się do parametru o nazwie: *domain-name*.
       - `"data"`: nazwa domeny.

---

<details><summary>Niewymagane klucze</summary>

9. `"client-classes"`: to tablica z jednym obiektem konfiguracji *VoIP* (protokołu do transmisji głosu przez IP). 

</details>

---

10. _**`"subnet4"`**_: ta tablica z jednym obiektem najbardziej Cię zainteresuje.
    - `"id"`: identyfikator podsieci dla usługi KEA-DHCP.
    - `"subnet"`: definicja podsieci z adresem i maską. Przykładowo dla maski `255.255.255.0` zapisanej w skróconej notacji `/24` podajesz adres IPv4 zmieniając ostatni oktet na $0$, np. `192.168.50.0/24`.
    - `"pools"`: tablica obiektów z pulami adresów do wypożyczenia. Standardowo jest to jeden obiekt z zakresem, ale możesz podać ich kilka, pamiętając, że wartość jest ciągiem tekstowym, więc musi znajdować się w cudzysłowie, np.:
      ```json
        "pools": [
          { "pool": "192.168.50.100 - 192.168.50.150" },
          { "pool": "192.168.50.160 - 192.168.50.200" }
        ]
      ```
    - `"option-data"`: ten sam klucz co w głównym `"Dhcp4"`. Domyślnie posiada jedynie obiekt do ustawienia bramy domyślnej:
      ```json
      {
        "name": "routers",
        "data": "192.168.50.1"
      }
      ```
      Możemy w nim zawrzeć też obiekty wspomniane w punkcie 8.
    - `"reservations"`: rezerwacje adresów IP dla konkretnych komputerów. Dla standardowego działania DHCP wystarczy posłużyć się pierwszym obiektem jako szablonem do przypisania adresu IP konkretnemu urządzeniu na zawsze. Często stosowane dla drukarek.
      - `"hw-address"`: adres MAC karty sieciowej urządzenia. Podany w formacie `XX:XX:XX:XX:XX:XX`.
      - `"ip-address"`: adres IP, który ma zostać przypisany urządzeniu.
        ```json
        {
          "hw-address": "1a:1b:1c:1d:1e:1f",
          "ip-address": "192.0.2.201"
        }
        ```

---

<details><summary>Niewymagane klucze</summary>

11. `"loggers"`: to tablica obiektów definiująca logowanie zdarzeń serwera.

</details>

---

## ⛓️‍💥 Przykładowa konfiguracja DHCP (Kea)

Gdy już mamy omówione klucze, to możemy jeszcze bardziej oczyścić/odchudzić konfigurację, pozbywając się niewymaganych kluczy (poza ostatnim `"loggers"`). Ten klucz za bardzo nie zaśmieca, a może mieć wpływ na możliwość zwracania błędów konfiguracji KEA-DHCP.

Pozwoliłem sobie na zmodyfikowanie kontrastu i balansu kolorów dla lepszej czytelności.

![kea-oczyszczony-konfig.png](/public/courses/ubuntu-26-server/Images/kea-oczyszczony-konfig.png)

Dobra, to lecimy z naszą konfiguracją. 🚀

| Właściwość                 | Wartość                           |
| -------------------------- | --------------------------------- |
| Interfejs nasłuchu         | *enp0s8*                          |
| Czas ważności dzierżawy    | **$24$ godziny** ($86400$ s)      |
| Maska podsieci             | `255.255.255.0` (`/24`)           |
| Brama domyślna             | `192.168.0.1`                     |
| Serwery DNS                | `192.168.0.1`, `8.8.8.8`          |
| Nazwa domeny               | **_koala.local_**                 |
| Pula adresów IP            | `192.168.0.100` - `192.168.0.150` |
| Rezerwacja IP (Windows 11) | _**`192.168.0.99`**_              |

Gotowy plik konfiguracyjny:

```json
{
  "Dhcp4": {
    "interfaces-config": {
      "interfaces": [ "enp0s8" ]
    },
    "renew-timer": 43200,
    "rebind-timer": 86400,
    "valid-lifetime": 86400,
    "subnet4": [
      {
        "id": 1,
        "subnet": "192.168.0.0/24",
        "pools": [
          { "pool": "192.168.0.100 - 192.168.0.150" }
        ],
        "option-data": [
          {
            "name": "domain-name-servers",
            "data": "192.168.0.1 8.8.8.8"
          },
          {
            "name": "routers",
            "data": "192.168.0.1"
          },
          {
            "code": 15,
            "data": "koala.local"
          }
        ],
        "reservations": [
          {
            "hw-address": "08:00:27:83:92:BF",
            "ip-address": "192.168.0.99",
            "hostname": "windows11"
          }
        ]
      }
    ]
  }
}
```

Pamiętaj, że zrobiliśmy sztuczkę ze zmianą formatu pliku na `.json`. Przed restartem usługi przywróć końcówkę `.conf`:

```bash
sudo mv /etc/kea/kea-dhcp4.json /etc/kea/kea-dhcp4.conf
sudo systemctl restart kea-dhcp4-server
sudo systemctl status kea-dhcp4-server
```

![Zastosowanie konfiguracji Kea DHCP i status usługi](/public/courses/ubuntu-26-server/Images/zastosowanie-konfiguracji-kea-dhcp.png)

---

## 🧪 Weryfikacja działania na klientach

Dokonajmy weryfikacji na klientach **Windows 11** i **Ubuntu 26.04 Desktop**:

![Adresy IP przydzielone przez DHCP klientom Windows 11 i Ubuntu 26.04](/public/courses/ubuntu-26-server/Images/adresy-ip-z-dhcp-na-windows11-i-ubuntu26.04.png)

Do pobrania na nowo adresu z puli DHCP:

- **Windows 11**:
  ```cmd
  ipconfig /release
  ipconfig /renew
  ```
- **Ubuntu 26.04 Desktop**:
  ```bash
  sudo netplan apply
  ```

> [!IMPORTANT]
> jak zapomnisz komendy no ponowne zaciągnięcie adresu z dhcp to wiedz że wystarczy zrestartować kartę sieciową albo po prostu cały komputer.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W konfiguracji Kea definiujesz interfejs nasłuchu, podsieć, pulę wolnych adresów oraz opcje sieciowe (DNS, bramka domyślna).
- Klient potwierdza poprawne działanie DHCP poprzez automatyczne pobranie adresu IP z zdefiniowanego zakresu.
- Rezerwacja trwale wiąże adres MAC karty sieciowej ze stałym adresem IP w podsieci.
