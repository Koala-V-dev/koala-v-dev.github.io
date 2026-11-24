# Mechanizm ARP - wiązanie IP z MAC i bezpieczeństwo

Gdy wydajesz polecenie `ping 192.168.1.50`, stos warstwy 3 systemu operacyjnego zna docelowy adres IPv4. Karta sieciowa wpięta do przełącznika Ethernet nie potrafi jednak wysłać ramki na adres logiczny IP: nagłówek warstwy 2 wymaga podania 48-bitowego adresu **MAC** urządzenia docelowego w tym samym segmencie sieci.

Powiązanie między logiczną adresacją warstwy 3 a fizyczną adresacją kart sieciowych realizuje protokół **ARP** (*Address Resolution Protocol*, RFC 826).

---

## 🔄 Cykl pracy protokołu ARP: Request i Reply

![Mechanizm protokołu ARP: Cykl Request i Reply](/public/courses/podstawy-sieci-komputerowych/Images/arp-cykl-request-reply.svg)

### 📢 Krok 1: ARP Request (Zapytanie rozgłoszeniowe)

Host A (`192.168.1.10`) zamierza wysłać dane do Hosta B (`192.168.1.50`), ale nie zna jego adresu fizycznego MAC.
1. Host A tworzy pakiet ARP z pytaniem: kto posiada adres IP `192.168.1.50` i prośbą o odpowiedź na adres `192.168.1.10` (`AA:AA:AA:AA:AA:AA`).
2. Karta umieszcza zapytanie w ramce Ethernet II z docelowym adresem rozgłoszeniowym **`FF:FF:FF:FF:FF:FF`** i kodem EtherType **`0x0806`**.
3. Przełącznik powiela tę ramkę na wszystkie aktywne porty w obrębie danej sieci lokalnej.
4. Wszystkie stacje analizują treść komunikatu. Komputery posiadające inny adres IP cicho odrzucają pakiet.

### 🎯 Krok 2: ARP Reply (Odpowiedź bezpośrednia)

Stacja o adresie `192.168.1.50` rozpoznaje własne IP:
1. Formuje odpowiedź z własnym adresem MAC (`BB:BB:BB:BB:BB:BB`).
2. Odsyła ramkę bezpośrednio (**Unicast**) na fizyczny adres Hosta A (`AA:AA:AA:AA:AA:AA`).
3. Host A zapisuje mapowanie `IP -> MAC` w pamięci operacyjnej i od tej pory kieruje ramki bezpośrednio na adres docelowy.

---

## 🗄️ Pamięć podręczna ARP (ARP Cache)

Rozsyłanie zapytań przed każdym pojedynczym pakietem zablokowałoby sieć lokalną ruchem rozgłoszeniowym. Jądro systemu buforuje więc poznane powiązania w lokalnej tablicy pamięci podręcznej (*ARP Cache*).

- **Wpisy dynamiczne:** dodawane automatycznie po odebraniu *ARP Reply*; wygasają samoczynnie po upływie licznika ważności (typowo 2 do 20 minut braku komunikacji).
- **Wpisy statyczne:** dodawane ręcznie przez administratora; pozostają aktywne do restartu systemu lub ich jawnego skasowania.

### 💻 Diagnostyka tablicy ARP w systemie operacyjnym

#### 🪟 1. Środowisko Windows (CMD / PowerShell)

Wyświetlenie powiązań adresów dla wszystkich kart:
```cmd
C:\> arp -a

Interfejs: 192.168.1.10 --- 0xb
  Adres internetowy      Adres fizyczny        Typ
  192.168.1.1            00-11-22-33-44-55     dynamiczne
  192.168.1.50           b4-2e-99-a1-12-88     dynamiczne
```

- `arp -d *`: czyści dynamiczną pamięć podręczną ARP.
- `arp -s 192.168.1.50 b4-2e-99-a1-12-88`: dopisuje stały wpis statyczny.

#### 🐧 2. Środowisko Linux

Współczesny zestaw `iproute2` zarządza tablicą sąsiadów poleceniem `ip neigh`:
```bash
$ ip neigh show
192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE
192.168.1.50 dev eth0 lladdr b4:2e:99:a1:12:88 STALE
```

- `REACHABLE`: wpis potwierdzony niedawną wymianą danych.
- `STALE`: wpis zestarzały, wymagający weryfikacji przed kolejną transmisją.
- `ip neigh flush all`: opróżnia tablicę sąsiadów.

---

## 📢 Gratuitous ARP i wykrywanie konfliktów adresacji

Szczególnym zastosowaniem protokołu jest **Gratuitous ARP** (*GARP*), czyli zapytanie, w którym stacja odpytuje sieć o własny adres IP (IP nadawcy jest równe adresowi poszukiwanemu).

1. **Wykrywanie konfliktów adresacji (*ACD*):** Przed aktywowaniem statycznego adresu IP system wysyła zapytanie *GARP*. Odebranie odpowiedzi oznacza duplikat adresu w podsieci i skutkuje wyłączeniem interfejsu z komunikatem o konflikcie adresów IP.
2. **Odświeżenie tablic CAM po migracji:** Po przełączeniu serwera na zapasową kartę sieciową pakiet *GARP* aktualizuje wpisy we wszystkich przełącznikach w segmencie L2.

---

## ⚠️ Podatność ARP Spoofing i ochrona DAI

Protokół ARP jest całkowicie bezstanowy: karta i system operacyjny akceptują przychodzącą odpowiedź *ARP Reply* i nadpisują swoją tablicę nawet wtedy, gdy nie wysłały wcześniej zapytania *ARP Request*.

![Zagrożenie: Fałszowanie tablic ARP (ARP Spoofing)](/public/courses/podstawy-sieci-komputerowych/Images/arp-spoofing-mitm.svg)

### 🕵️ 1. Przebieg ataku Man-in-the-Middle

Atakujący wysyła równolegle dwa sfałszowane pakiety *ARP Reply*: do komputera ofiary wskazuje własny MAC jako bramę domyślną, a do routera wskazuje własny MAC jako adres ofiary. W rezultacie cały ruch między stacją a bramą przechodzi przez maszynę atakującego.

### 🛡️ 2. Mechanizmy obronne

- **Statyczne mapowanie `arp -s`:** Sztywne przypisanie adresu MAC bramy w systemie uniemożliwia jego nadpisanie fałszywą odpowiedzią.
- **DAI (*Dynamic ARP Inspection*):** Funkcja przełączników zarządzalnych L2 weryfikująca przychodzące ramki ARP względem bazy przydziałów serwera DHCP (*DHCP Snooping*). Ramki z niespójną parą IP-MAC są odrzucane na porcie wejściowym.

Wywołaj zapytanie ARP z Hosta A do Hosta B lub `8.8.8.8`, porównaj wpisy w tablicy `arp -a` przed atakiem MitM i po nim oraz włącz ochronę DAI na przełączniku:

<data-arp-simulator></data-arp-simulator>

---

## 🛠️ Samodzielna próba: Wykrywanie zatrucia ARP w sieci lokalnej

Użytkownik zgłasza, że ruch do internetu gwałtownie zwolnił. Na jego komputerze brama domyślna ma IP `192.168.1.1`, a polecenie `arp -a` zwraca następujący wynik:

```text
  192.168.1.1            aa-bb-cc-dd-ee-99     dynamiczne
  192.168.1.45           aa-bb-cc-dd-ee-99     dynamiczne
```

1. Wskaż anomalię w powyższej tablicy ARP i wyjaśnij, co dzieje się z ramkami opuszczającymi komputer użytkownika.
2. Podaj polecenie tymczasowego zabezpieczenia wpisu bramy w Windows (zakładając prawdziwy MAC routera `00-11-22-33-44-55`) oraz mechanizm po stronie przełącznika L2, który zablokuje takie pakiety u źródła.

Kryteria ukończenia:
- Rozpoznanie duplikatu adresu MAC przy dwóch różnych IP (`192.168.1.1` i `192.168.1.45`).
- Wskazanie statycznego wpisu `arp -s` oraz funkcji `DAI` (*Dynamic ARP Inspection*) na switchu.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

1. Dwa różne adresy IP (`192.168.1.1` oraz `192.168.1.45`) wskazują na **ten sam adres MAC** `aa-bb-cc-dd-ee-99`. Stacja `192.168.1.45` wykonuje atak **ARP Spoofing (MITM)**, podszywając się pod bramę domyślną. Cały ruch wychodzący poza sieć LAN trafia najpierw na kartę atakującego.
2. Tymczasowe zabezpieczenie w Windows (po uprzednim wyczyszczeniu cache):
   - `arp -s 192.168.1.1 00-11-22-33-44-55`
   Docelowa ochrona na przełączniku L2 to włączenie **DHCP Snooping** oraz **DAI (*Dynamic ARP Inspection*)**, które odrzuca fałszywe ramki `ARP Reply` niezgodne z tablicą dzierżaw DHCP.

</details>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Binarna anatomia pakietu ARP (28 B), Proxy ARP i stany sąsiada w Linuksie</span>
<span class="deep-dive-badge">RFC 826 &amp; JĄDRO LINUX</span>
</summary>
<div class="deep-dive-content">

### 📦 1. Struktura 28-bajtowego pakietu ARP (dlaczego wymagany jest Zero-Padding)

Sam komunikat ARP ma dokładnie **28 bajtów**, dlatego karta sieciowa dokleja 18 bajtów zer (*Padding*), aby osiągnąć minimum 46 bajtów ładunku ramki Ethernet II:

| Pole ARP | Rozmiar | Wartość dla Ethernet + IPv4 |
| :--- | :--- | :--- |
| **HTYPE** (*Hardware Type*) | 2 B | `0x0001` (Ethernet) |
| **PTYPE** (*Protocol Type*) | 2 B | `0x0800` (IPv4) |
| **HLEN / PLEN** | 1 B + 1 B | `6` (długość MAC) oraz `4` (długość IPv4) |
| **OPER** (*Operation*) | 2 B | `1` = ARP Request, `2` = ARP Reply |
| **SHA / SPA** | 6 B + 4 B | MAC i IPv4 nadawcy |
| **THA / TPA** | 6 B + 4 B | MAC (w Request: `00:00:00:00:00:00`) i IPv4 celu |

### 🧠 2. Proxy ARP i maszyna stanów NUD w Linuksie

- **Proxy ARP:** sytuacja, w której router odpowiada własnym adresem MAC na zapytanie ARP dotyczące hosta w innej podsieci (stosowane przy błędnej lub zbyt szerokiej masce podsieci na stacji roboczej).
- **NUD (*Neighbor Unreachability Detection*):** w jądrze Linux wpis w `ip neigh` przechodzi przez stany `INCOMPLETE` (wysłano Request), `REACHABLE` (potwierdzony ruch), `STALE` (wygasł timer, ale wpis jeszcze istnieje), `DELAY` i `PROBE` (ponowna weryfikacja unicastem zamiast kolejnego Broadcastu).

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Przebieg komunikacji z ARP

<data-gate>
  <data-sortable-list title="Ułóż kolejność kroków, gdy Host A wysyła pakiet IP do serwera 8.8.8.8 poza siecią LAN przy pustej tablicy ARP">
    <item data-correct="3">Router (brama) odpowiada ramką ARP Reply (Unicast) ze swoim adresem MAC</item>
    <item data-correct="1">Host A porównuje adres celu z maską i wybiera bramę domyślną jako Next-Hop</item>
    <item data-correct="4">Host A zapisuje MAC bramy w arp -a i wysyła ramkę z docelowym IP 8.8.8.8 na MAC bramy</item>
    <item data-correct="2">Host A wysyła Broadcast ARP Request z pytaniem o MAC bramy domyślnej</item>
  </data-sortable-list>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Protokół *ARP* (EtherType `0x0806`) tłumaczy znany adres logiczny IPv4 na nieznany adres fizyczny MAC wyłącznie w granicach lokalnej domeny rozgłoszeniowej L2.
- Zapytanie *ARP Request* trafia rozgłoszeniowo na adres `FF:FF:FF:FF:FF:FF`, natomiast odpowiedź *ARP Reply* wraca w trybie Unicast bezpośrednio do pytającego.
- Polecenia `arp -a` w Windows oraz `ip neigh show` w Linuksie pozwalają zweryfikować tablicę powiązań i wykryć fałszowanie wpisów.
- Bezstanowość ARP umożliwia atak *ARP Spoofing* (Man-in-the-Middle), przed którym chronią statyczne wpisy `arp -s` oraz inspekcja *DAI* na przełącznikach L2.
