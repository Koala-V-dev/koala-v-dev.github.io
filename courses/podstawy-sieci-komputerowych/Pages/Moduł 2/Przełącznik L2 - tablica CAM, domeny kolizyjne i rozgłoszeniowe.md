# Przełącznik L2 - tablica CAM, domeny kolizyjne i rozgłoszeniowe

Koncentrator (Hub) powiela sygnał elektryczny otrzymany na jednym porcie na wszystkie pozostałe gniazda, przez co stacje dzielą jedno medium i wzajemnie generują kolizje. Przełącznik warstwy drugiej (*Switch L2*) eliminuje ten problem sprzętowo: układ scalony *ASIC* odczytuje nagłówki ramek Ethernet i kieruje ruch wyłącznie do portu odbiorcy.

Podstawą tego mechanizmu jest asocjacyjna pamięć sprzętu zwana **tablicą CAM** oraz rozdzielenie ruchu na niezależne domeny kolizyjne.

---

## 🧠 Tablica CAM w przełączniku L2

Po podłączeniu do zasilania przełącznik nie wymaga wstępnej konfiguracji. Wewnętrzna pamięć asocjacyjna **CAM** (*Content Addressable Memory*, zwana tablicą adresów MAC) automatycznie gromadzi powiązania między adresami fizycznymi stacji a portami, do których są podłączone:

![Mechanizm przełącznika L2: Tablica CAM i reguły przełączania](/public/courses/podstawy-sieci-komputerowych/Images/switch-tablica-cam-algorytm.svg)

Każdy wpis ma postać relacji:
$$\text{Adres fizyczny MAC} \longleftrightarrow \text{Numer portu fizycznego}$$

---

## ⚙️ Trzy operacje układu ASIC podczas odbioru ramki

Gdy ramka Ethernet dociera na jeden z portów przełącznika, układ scalony ASIC wykonuje trzy operacje:

### 📥 1. Uczenie się portu (Learning z pola Source MAC)

Przełącznik odczytuje pole **Source MAC** przychodzącej ramki i zapisuje w tablicy CAM, że ten adres fizyczny znajduje się na danym porcie. Jeśli wpis już istnieje, układ resetuje licznik czasu ważności (**Aging Timer**, domyślnie **300 sekund**). Urządzenie nieaktywne przez 5 minut zostaje usunięte z tablicy.

### 🎯 2. Przełączanie i filtrowanie (Forwarding z pola Destination MAC)

Układ wyszukuje pole **Destination MAC** w tablicy CAM. Gdy odnajdzie wpis (np. adres odbiorcy pod Portem 2), kieruje ramkę wyłącznie na ten jeden port wyjściowy. Pozostałe porty nie otrzymują sygnału, co zapobiega podsłuchiwaniu i oszczędza pasmo pozostałych stacji.

### 📢 3. Zalewanie (Flooding przy Unknown Unicast oraz Broadcast)

Jeśli adres docelowy nie występuje w tablicy CAM (*Unknown Unicast*) lub jest adresem rozgłoszeniowym `FF:FF:FF:FF:FF:FF` (*Broadcast*), przełącznik wysyła kopię ramki na wszystkie aktywne porty z wyjątkiem portu źródłowego. Po odpowiedzi odbiorcy przełącznik uczy się jego portu zgodnie z operacją uczenia.

Wyślij ramkę między wybranymi stacjami `PC 1..4`, wywołaj przepełnienie tablicy CAM atakiem `macof` na Porcie 4 i aktywuj na nim ochronę Port Security:

<data-switch-cam-simulator></data-switch-cam-simulator>

### ⚡ 4. Tryby przekazywania ramek w przełączniku

Przełącznik może rozpocząć wysyłanie ramki na port wyjściowy w różnym momencie jej odbioru:

| Metoda przełączania | Kiedy switch zaczyna wysyłać ramkę | Kontrola błędów FCS | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **Store-and-Forward** | Po odebraniu całej ramki (do ostatniego bajtu `FCS`) | **Pełna:** uszkodzone ramki są odrzucane przed wysłaniem | Standard w niemal wszystkich współczesnych switchach |
| **Cut-Through** | Natychmiast po odczytaniu pierwszych 6 bajtów (`Destination MAC`) | **Brak:** przekazuje nawet uszkodzone ramki (*runts*) | Specjalistyczne sieci niskich opóźnień (np. centra danych HFT) |
| **Fragment-Free** | Po odebraniu pierwszych 64 bajtów ramki | **Częściowa:** odfiltrowuje kolizje krótsze niż 64 B | Kompromis między opóźnieniem a odrzucaniem kolizji |

---

## 📊 Domeny kolizyjne i rozgłoszeniowe (Standard INF.02)

Zasada podziału domen przez urządzenia sieciowe stanowi stały element zadań egzaminacyjnych kwalifikacji INF.02:

| Cecha | Domena kolizyjna (*Collision Domain*) | Domena rozgłoszeniowa (*Broadcast Domain*) |
| :--- | :--- | :--- |
| **Definicja** | Obszar sieci, w którym jednoczesna emisja sygnału przez dwie stacje niszczy ramkę. | Obszar sieci, do którego dociera ramka z adresem rozgłoszeniowym `FF:FF:FF:FF:FF:FF`. |
| **Koncentrator (Hub L1)** | Tworzy jedną wspólną domenę kolizyjną dla wszystkich gniazd. | Tworzy jedną wspólną domenę rozgłoszeniową. |
| **Przełącznik (Switch L2)** | **Rozdziela domeny:** każdy pojedynczy port tworzy odrębną domenę kolizyjną. | **Nie rozdziela domen:** cały przełącznik bez VLAN stanowi jedną domenę rozgłoszeniową. |
| **Router (L3)** | Rozdziela domeny na każdym interfejsie. | **Rozdziela domeny:** router domyślnie zatrzymuje ruch rozgłoszeniowy warstwy 2. |

> [!IMPORTANT]
> **Liczenie domen na przykładzie przełącznika 24-portowego:**  
> Niezarządzalny przełącznik posiadający 24 porty tworzy **24 oddzielne domeny kolizyjne**, ale wszystkie 24 stacje znajdują się w **jednej wspólnej domenie rozgłoszeniowej**.

---

## 🛡️ Przepełnienie tablicy CAM i ochrona Port Security

Pamięć CAM ma ograniczoną pojemność sprzętową (typowo od 8 000 do 128 000 wpisów). Generowanie tysięcy fałszywych źródłowych adresów MAC na sekundę (atak **MAC Flooding**, np. narzędziem `macof`) zapełnia pamięć switcha.

### ⚠️ 1. Przebieg ataku MAC Flooding

Po zapełnieniu pamięci CAM przełącznik traci możliwość dopisywania kolejnych adresów stacji roboczych. Każda nowa ramka staje się dla switcha ruchem nieznanym (*Unknown Unicast*). Przełącznik zaczyna zalewać wszystkie porty, co umożliwia atakującemu podsłuchiwanie całego ruchu sieciowego (degradacja do działania Huba).

### 🔒 2. Sprzętowa ochrona Port Security

Administrator zabezpiecza porty przełącznika funkcją **Port Security**, określając maksymalną liczbę dozwolonych adresów MAC na porcie (np. `maximum 1`) oraz tryb reakcji na naruszenie:
- `shutdown`: natychmiastowe wyłączenie portu i przejście w stan *err-disable*.
- `restrict`: odrzucenie nieautoryzowanych ramek i wysłanie powiadomienia SNMP do administratora.

---

## 💻 Diagnostyka tablicy CAM w konsoli przełącznika

Podgląd zawartości pamięci CAM w systemie Cisco IOS:

```text
Switch# show mac address-table
```

Odczyt parametrów z tabeli:

| VLAN | Adres fizyczny MAC | Typ wpisu | Port interfejsu |
| :--- | :--- | :--- | :--- |
| `1` | `001a.2b3c.4d5e` | `DYNAMIC` (poznany z ruchu) | `Fa0/1` |
| `1` | `b42e.99a1.1288` | `DYNAMIC` (poznany z ruchu) | `Fa0/2` |
| `1` | `0011.2233.4455` | `DYNAMIC` (poznany z ruchu) | `Gi0/1` |

Wyczyszczenie dynamicznych wpisów tablicy CAM:

```text
Switch# clear mac address-table dynamic
```

---

## 🛠️ Samodzielna próba: Port w stanie err-disable po naruszeniu Port Security

Po podłączeniu nieautoryzowanego małego switcha do gniazdka w sali na porcie `Fa0/4` przełącznika zgasła dioda linku, a polecenie `show interfaces status` pokazuje stan `err-disabled`. Na porcie działała konfiguracja `switchport port-security maximum 1` w trybie `shutdown`.

1. Wyjaśnij, dlaczego port został wyłączony natychmiast po podpięciu drugiego komputera do gniazdka.
2. Podaj kolejność dwóch poleceń w trybie konfiguracji interfejsu `Fa0/4`, które przywrócą port do pracy po odłączeniu nieautoryzowanego sprzętu.

Kryteria ukończenia:
- Powiązanie przekroczenia limitu `maximum 1` adresu MAC w tablicy CAM z reakcją trybu `shutdown`.
- Wskazanie sekwencji `shutdown`, a następnie `no shutdown` na interfejsie `Fa0/4`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

1. Do portu `Fa0/4` dotarły ramki z dwoma różnymi adresami `Source MAC` (od dwóch komputerów za nieautoryzowanym switchem). Przekroczyło to limit `maximum 1`, więc mechanizm **Port Security** w trybie `shutdown` zablokował port w stanie `err-disabled`.
2. Po fizycznym odpięciu dodatkowego urządzenia administrator musi ręcznie zresetować port:
```text
Switch(config)# interface FastEthernet 0/4
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```

</details>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Pamięć asocjacyjna TCAM w układzie krzemowym ASIC</span>
<span class="deep-dive-badge">SPRZĘT ASIC & KRZEM</span>
</summary>
<div class="deep-dive-content">

Tradycyjna pamięć RAM przyjmuje adres komórki i zwraca jej zawartość w kolejnych cyklach zegara. Pamięć asocjacyjna **CAM** (*Content-Addressable Memory*) działa odwrotnie: przyjmuje poszukiwaną daną (np. 48-bitowy docelowy adres MAC) i w **pojedynczym cyklu zegara** zwraca numer powiązanego portu.

W przełącznikach warstwy 2 i 3 stosuje się rozszerzenie trójstanowe **TCAM** (*Ternary CAM*). Oprócz stanów logicznych `0` i `1` komórka obsługuje stan `X` (*Don't Care* / maska bitowa):

1. **Wyszukiwanie równoległe:** Wszystkie wpisy w tablicy są sprawdzane sprzętowo równocześnie przez tysiące komparatorów w krzemie.
2. **Tablice L3 i ACL:** Stan maski `X` pozwala routerom i przełącznikom wielowarstwowym dopasowywać prefiksy podsieci IP (maski `/24`, `/16`) oraz reguły list kontroli dostępu (*Access Control Lists*) bez obciążania procesora CPU przełącznika.

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Decyzje przełącznika L2

<data-gate>
  <data-connection-matcher title="Połącz mechanizm przełącznika L2 z jego dokładnym działaniem">
    <div class="cmw-item" data-left="Learning" data-right="Zapis Source MAC -> Port w tablicy CAM (300 s)"></div>
    <div class="cmw-item" data-left="Forwarding" data-right="Wysłanie ramki wyłącznie na znany port docelowy"></div>
    <div class="cmw-item" data-left="Flooding" data-right="Powielenie na wszystkie porty poza źródłowym"></div>
    <div class="cmw-item" data-left="Port Security" data-right="Przejście portu w ERR-DISABLE po przekroczeniu limitu MAC"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Tablica *CAM* odwzorowuje adresy fizyczne MAC na konkretne porty przełącznika w szybkiej pamięci asocjacyjnej układu ASIC, wygaszając nieaktywne wpisy domyślnie po 300 sekundach.
- Przełącznik uczy się z pola *Source MAC*, przekazuje wybrane ramki według *Destination MAC* i zalewa wszystkie pozostałe porty wyłącznie w przypadku *Unknown Unicast* oraz *Broadcast*.
- Każdy port przełącznika L2 stanowi odrębną domenę kolizyjną, lecz cały przełącznik bez podziału VLAN stanowi jedną wspólną domenę rozgłoszeniową.
- Ochrona przed atakiem przepełnienia pamięci CAM (*MAC Flooding*) polega na ograniczeniu liczby dozwolonych adresów na porcie za pomocą funkcji *Port Security*.
