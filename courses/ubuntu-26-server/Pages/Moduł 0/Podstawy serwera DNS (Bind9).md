# Podstawy serwera DNS (BIND9)

Serwer **DNS** to baza danych kojarząca czytelne nazwy domenowe (np. `www.koala.local`) z adresami IP maszyn (np. `192.168.0.1`). Konfiguracja BIND9 polega na zdefiniowaniu *strefy* (obszaru domeny) oraz wypełnieniu jej rekordami wskazującymi na konkretne adresy.

## 📦 Instalacja BIND9

Zainstaluj serwer DNS BIND9:

```bash
sudo apt update
sudo apt install bind9
sudo systemctl status named
```

Sprawdźmy pliki w katalogu `/etc/bind`:

```bash
ls -l /etc/bind
```

![](/public/courses/ubuntu-26-server/Images/etc-bind-files.png)

- `named.conf`: główny plik startowy. BIND9 wczytuje go jako pierwszy. Nie edytuje się go bezpośrednio. Jego zadaniem jest zaimportowanie (poprzez dyrektywy `include`) pozostałych plików konfiguracyjnych.
- `named.conf.local`: plik przeznaczony na konfigurację Twoich własnych stref lokalnych. To tutaj zadeklarujemy strefę `koala.local`.
- `named.conf.options`: plik z opcjami globalnymi serwera (np. katalog roboczy, konfiguracja portów sieciowych czy serwery przekazujące zapytania).
- `named.conf.root-hints`: deklaruje strefę główną `.` typu `hint` i wskazuje plik `/usr/share/dns/root.hints` z nazwami oraz adresami serwerów głównych DNS.
- `rndc.key`: klucz używany przez narzędzie `rndc` do uwierzytelniania poleceń sterujących lokalną usługą (np. przy przeładowywaniu stref).

---

### 🌐 Jak działa globalna sieć Root DNS?

Plik `/usr/share/dns/root.hints` zawiera nazwy i adresy IP serwerów głównych DNS. Są one oznaczane literami od *A* do *M*.

#### Ograniczenie do 13 adresów

Liczba $13$ nazw ma podłoże historyczne i wynika z pierwotnych ograniczeń DNS. W latach <time>80.</time> odpowiedź przesyłana przez UDP mogła mieć najwyżej $512\text{ bajtów}$. W jednym takim pakiecie mieściła się lista $13$ serwerów wraz z potrzebnymi rekordami adresowymi i nagłówkami. Większa odpowiedź wymagałaby wówczas ponowienia zapytania przy użyciu TCP.

Współczesny DNS potrafi przesyłać większe odpowiedzi dzięki EDNS, lecz trzynaście nazw serwerów głównych pozostało. Każda z nich ma obecnie adres IPv4 oraz IPv6.

#### Technologia Anycast

Pod $13$ nazwami i ich adresami IP kryją się tysiące fizycznych instancji na świecie. Umożliwia to technologia _**Anycast**_. Wiele serwerów w różnych lokalizacjach korzysta z tego samego adresu IP, a routing BGP kieruje pakiety do odpowiedniej, zazwyczaj bliskiej sieciowo instancji.

Przykładowo w Polsce działa $11$ takich instancji. Są one zlokalizowane w Warszawie, Poznaniu, Wrocławiu i Gdyni:

- Warszawa: 1K, 2F, 1J, 2D, 2E
- Poznań: 1K
- Wrocław: 1F
- Gdynia: 1K

Możesz to sprawdzić na interaktywnej mapce, przechodząc na stronę: [root-servers.org](https://root-servers.org)

#### Dywersyfikacja oprogramowania

W celu ochrony przed błędami w kodzie operatorzy serwerów głównych korzystają z różnego oprogramowania. Zapobiega to sytuacji, w której jedna podatność wyłącza cały internet.

Operatorzy poszczególnych liter wybierają oprogramowanie niezależnie, a niektórzy uruchamiają więcej niż jeden program na swoich rozproszonych instancjach. W Root Server System są wykorzystywane cztery rodziny oprogramowania serwera nazw:

- **BIND**
- **NSD**
- **Knot DNS**
- **Atlas**

Przykładowo instancje B-Root działają na BIND albo Knot DNS, natomiast J-Root korzysta z NSD oraz Atlas. Taka różnorodność sprawia, że błąd w jednym programie nie musi dotknąć całego systemu serwerów głównych.

[Raport Root Server Technical Operations Association o różnorodności infrastruktury](https://root-servers.org/media/news/2025-External_Diversity_Report.pdf)

---

## 📝 Deklaracja strefy (<code>named.conf.local</code>)

BIND9 musi wiedzieć, dla jakiej domeny ma przetwarzać zapytania oraz w jakim pliku na dysku zapiszemy jej rekordy. Te informacje wpisuje się w pliku `named.conf.local`. Otwórz plik do edycji:

```bash
sudo nano /etc/bind/named.conf.local
```

Na końcu pliku zadeklaruj strefę `koala.local`:

```bind
zone "koala.local" {
    type primary;
    file "/etc/bind/db.koala.local";
};
```

> [!IMPORTANT]
> Pamiętaj o średnikach `;`! Każda dyrektywa oraz zamknięcie bloku `};` wymagają średnika.

![edytor z plikiem named.conf.local zawierającym deklarację strefy koala.local.](/public/courses/ubuntu-26-server/Images/bind9-strefa-koala.local.png)

Wyjaśnienie dyrektyw:

- `zone "koala.local"`: nazwa obsługiwanej domeny.
- `type primary;` (dawniej `master`): oznacza, że ten serwer przechowuje główną kopię rekordów dla tej domeny.

> BIND9 obsługuje również inne typy stref: `secondary` (dawniej `slave`) to serwer zapasowy pobierający dane z serwera głównego, `forward` przekazuje zapytania dalej, a `hint` wskazuje adresy serwerów głównych.

- `file`: ścieżka do pliku, w którym zostaną zapisane rekordy DNS.

> [!TIP]
> Od razu możesz sprawdzić poprawność składni konfiguracji, czy nie zgubił Ci się jakiś średnik albo cudzysłów:
> ```bash
> sudo named-checkconf
> ```

---

## 📄 Tworzenie pliku rekordów strefy (<code>db.koala.local</code>)

Plik strefy to baza danych zawierająca przypisania nazw domenowych do adresów IP.

Standardowo przy instalacji pakietu BIND9 była tu templatka, której już nie ma. 🤨

Gdyby jednak była, to po edycji uzyskalibyśmy takie coś:

```conf
$TTL 3600
@   IN  SOA ns.koala.local. root.koala.local. (
            2026072801  ; Serial
            1h          ; Refresh
            15m         ; Retry
            1w          ; Expire
            5m          ; Negative Cache TTL
)

; Rekordy serwerów nazw (NS)
@   IN  NS  ns.koala.local.

; Rekordy adresowe IPv4 (A)
ns    IN  A   192.168.0.1
www   IN  A   192.168.0.1
ftp   IN  A   192.168.0.1
pliki IN  A   192.168.0.1
mail  IN  A   192.168.0.1

; Rekordy serwera pocztowego (MX)
@   IN  MX  10 mail.koala.local.
```

---

### 🔍 Zrozumienie budowy pliku strefy

Pierwsza linia _**`$TTL 3600`**_ określa czas życia (*Time To Live*) wpisów w pamięci podręcznej innych serwerów ($3600$ sekund, czyli $1$ godzina). Po tym czasie serwery odpytujące ponownie skonsultują się z naszym DNS-em.

Poniżej znajduje się rekord **SOA** (*Start of Authority*), który zawiera najważniejsze informacje administracyjne o strefie.

| Fragment SOA            | Wyjaśnienie                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `@`                     | Symbol `@` zastępuje pełną nazwę domeny (`koala.local.`)                                     |
| `IN`                    | Klasa `IN` oznacza Internet                                                                  |
| `SOA`                   | Określa początek danych autorytatywnych strefy                                               |
| **`ns.koala.local.`**   | Nazwa serwera głównego                                                                       |
| **`root.koala.local.`** | Adres e-mail administratora (`root@koala.local`), gdzie pierwsza kropka pełni rolę znaku `@` |

> [!WARNING]
> Zwróć szczególną uwagę na **końcową kropkę w nazwach domenowych (FQDN)**. Wszystkie pełne nazwy bezwzględne muszą być zakończone kropką.
> Jeżeli zapomnisz kropki i wpiszesz `ns.koala.local`, BIND9 potraktuje to jako nazwę względną i doklei domenę strefy, tworząc błędny adres `ns.koala.local.koala.local.`.

Wszystkie parametry **SOA** można zwinąć do jednej linii:

```bash
koala.local. IN SOA ns.koala.local. root.koala.local. ( 2026072801 1h 15m 1w 5m )
```

Wewnątrz nawiasu znajdują się wartości czasowe oprócz pierwszej, która jest identyfikatorem wersji konfiguracji strefy:

- `2026072801`: numer seryjny (*Serial*), który należy zwiększać po każdej zmianie w pliku, aby serwery wtórne uznały nową konfigurację. Stosuje się format `RRRRMMDD` + numer zmiany (np. dnia <time datetime="2026-09-24">24.09.2026</time> druga zmiana pliku będzie mieć numer seryjny $2026092402$).
- `1h`: czas odświeżania strefy na serwerach zapasowych (*Refresh*).
- `15m`: czas ponowienia próby po błędzie (*Retry*).
- `1w`: czas wygaśnięcia strefy (*Expire*).
- `5m`: czas pamiętania odpowiedzi negatywnej, np. informacji, że pytana nazwa nie istnieje (*Negative Cache TTL*).

Wartości czasowe można podawać w sekundach lub z odpowiednią literą jednostki:

- `h` – godziny
- `m` – minuty
- `w` – tygodnie
- `d` – dni

Kolejna sekcja definiuje oficjalny serwer nazw `@ IN NS ns.koala.local.` oraz rekordy adresowe `A`, przypisujące poddomeny do adresu IPv4 serwera.

Utwórz więc teraz `db.koala.local` i zmień mu właściciela oraz uprawnienia:

```bash
sudo touch /etc/bind/db.koala.local
sudo chown bind:bind /etc/bind/db.koala.local
sudo chmod 644 /etc/bind/db.koala.local
```

Chcąc przygotować absolutne minimum dla strefy, wystarczy zapisać:

```text
$TTL 3600
@ IN SOA ns.koala.local. root.koala.local. ( 1 1h 5m 1w 1m )

@ IN NS ns.koala.local.
@ IN A 192.168.0.11

ns IN A 192.168.0.11
```

> [!CAUTION]
> Serwer, na którym działa usługa BIND9, ma adres IP `192.168.0.1`. Aby podczas testów nie mylić adresu serwera DNS z adresem docelowym, w strefie przypisaliśmy domenę `koala.local` do adresu `192.168.0.11`.

![edytor z plikiem db.koala.local.](/public/courses/ubuntu-26-server/Images/bind9.db.koala.local.png)

---

## ✅ Sprawdzenie składni i przeładowanie usługi

BIND9 jest niezwykle wrażliwy na błędy składniowe (np. brakujący średnik lub niedomknięty nawias).

Sprawdź składnię głównej konfiguracji:

```bash
sudo named-checkconf
```

Sprawdź poprawność pliku strefy:

```bash
sudo named-checkzone koala.local /etc/bind/db.koala.local
```

Możesz przeładować samą konfigurację stref bez przerywania działania usługi:

```bash
sudo systemctl reload named
```

*Protip: Możesz też użyć dedykowanego narzędzia BIND9 do przeładowywania stref:*

```bash
sudo rndc reload
```

Jednak dla świętego spokoju, skoro pracujesz na malutkiej sieci lokalnej, chwilowa przerwa w działaniu nie zaszkodzi, więc wykonaj standardową procedurę z `systemctl`:

```bash
sudo systemctl restart named
sudo systemctl status named
```

> [!NOTE]
> W dystrybucjach Debian i Ubuntu usługa systemowa dla BIND9 nosi nazwę `named`.

![zrzut z systemctl status named](/public/courses/ubuntu-26-server/Images/systemctl-named-bind9.png)

---

## 💻 Diagnostyka z poziomu klientów

W poleceniach `nslookup` oraz `dig` podaje się poszukiwaną nazwę oraz adres IP serwera DNS, do którego kierujemy zapytanie.

Przykładowo na systemie Linux:

```bash
nslookup koala.local 192.168.0.1
```

Alternatywnie przy użyciu narzędzia `dig`:

```bash
dig @192.168.0.1 koala.local
```

Windows 11 jest bardziej kumaty i nie wymaga podania adresu ip serwera DNS.

```cmd
nslookup koala.local
```

![dns-nslookup-na-klientach-windows11-ubuntu26.04Desktop](/public/courses/ubuntu-26-server/Images/dns-nslookup-na-klientach-windows11-ubuntu26.04Desktop.png)

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Serwer DNS tłumaczy nazwy domenowe na adresy IP w oparciu o pliki rekordów strefy.
- Plik `named.conf.local` wskazuje domeny, za które odpowiada serwer, oraz lokalizacje ich plików bazowych.
- Zmiany w pliku rekordów strefy wymagają każdorazowego zwiększenia numeru seryjnego (`Serial`) oraz przeładowania usługi poleceniem `systemctl reload named`.
- Narzędzia `nslookup` oraz `dig` pozwalają weryfikować odpowiedzi serwera DNS.
