# ZAAWANSOWANY KURS: FUNDAMENTY SIECI KOMPUTEROWYCH I CYBERBEZPIECZEŃSTWA (OD PODSTAW DO MASTRY)

## MODUŁ 1: Wprowadzenie do sieci komputerowych, teorii informacji i systemów liczbowych

### Lekcja 1.1: Istota sieci komputerowej we współczesnym świecie
* **Zagadnienia do poruszenia:**
  * Definicja sieci komputerowej jako zbioru niezależnych urządzeń połączonych kanałami komunikacyjnymi.
  * Ewolucja pojęcia sieci: od tradycyjnych komputerów i serwerów po urządzenia IoT (smartfony, drukarki, konsola do gier, bankomaty, biletomaty, a nawet inteligentne lodówki).
  * Kanały i media transmisyjne: sygnały elektryczne w kablach miedzianych, fale świetlne w światłowodach, fale radiowe (Wi-Fi, 4G, 5G), a nawet teoretyczne sygnały dymne jako ilustracja medium.
* **Praktyka / Laboratorium:** Identyfikacja urządzeń sieciowych w otoczeniu domowym i biurowym; analiza urządzeń podłączonych do lokalnego punktu dostępowego.
* **Kluczowe pojęcia:** Sieć komputerowa, Host, Serwer, Klient, Medium transmisyjne, Protokół komunikacyjny.

### Lekcja 1.2: Teoria informacji, jednostki danych i przepustowość łączy
* **Zagadnienia do poruszenia:**
  * Najmniejsza cząstka informacji: bit (\\(0\\) lub \\(1\\), stan niski/wysoki) oraz bajt (\\(8\\) bitów).
  * Przedrostki dziesiętne SI (\\(kilo=10^3\\), \\(mega=10^6\\), \\(giga=10^9\\)) vs przedrostki binarne IEC (\\(kibi=2^{10}=1024\\), \\(mebi=2^{20}\\), \\(gibi=2^{30}\\)).
  * Różnica w pojemnościach dysków twardych oferowanych przez producentów a rzeczywistą przestrzenią w systemie operacyjnym.
  * Przepustowość sieci wyrażana w bitach na sekundę (\\(bit/s\\), \\(Mbit/s\\), \\(Gbit/s\\)) a rozmiary plików wyrażane w bajtach (\\(B\\), \\(MB\\), \\(GB\\)).
  * Wzory na przeliczanie jednostek: konwersja bitów na bajty i odwrotnie (mnożenie/dzielenie przez \\(8\\)).
* **Praktyka / Laboratorium:**
  * Obliczanie ilości danych pobranych w określonym czasie przy danej przepustowości łącza (np. pobieranie przy \\(60\text{ Mbit/s}\\) w czasie 1h).
  * Obliczanie dokładnego czasu pobierania pliku o zadanej wielkości (np. plik \\(1\text{ GB}\\) na łączu \\(10\text{ Mbit/s}\\)).
* **Kluczowe pojęcia:** Bit, Bajt, Kibibajt (KiB), Megabit na sekundę (Mbit/s), Przepustowość.

### Lekcja 1.3: Systemy liczbowe w informatyce sieciowej (dwójkowy, dziesiątkowy, szesnastkowy)
* **Zagadnienia do poruszenia:**
  * Podstawy systemu binarnego (podstawa 2, cyfry \\(0\\) i \\(1\\)) i reprezentacja wagowa rzędów (potęgi dwójki: \\(1, 2, 4, 8, 16, 32, 64, 128\\)).
  * Algorytm konwersji liczb dziesiętnych na binarne (dzielenie przez \\(2\\) z resztą i zapis od prawej do lewej) oraz binarnych na dziesiętne.
  * System szesnastkowy (hexadecimal, podstawa 16, cyfry \\(0-9\\) oraz litery \\(A-F\\)) i jego rola w zapisie adresów MAC oraz IPv6.
* **Praktyka / Laboratorium:** Ręczne przeliczanie wartości dziesiętnych na binarne i szesnastkowe bez użycia kalkulatora.

---

## MODUŁ 2: Architektura sieciowa, media transmisyjne i topologie

### Lekcja 2.1: Klasyfikacja sieci ze względu na zasięg i strukturę organizacyjną
* **Zagadnienia do poruszenia:**
  * Podział sieci ze względu na obszar: LAN (*Local Area Network*), MAN (*Metropolitan Area Network*), WAN (*Wide Area Network*).
  * Pojęcie globalnej sieci Internet, jej historia (ARPANET, pierwsze łącze w Polsce w 1990 r.) oraz rozróżnienie sieci Internet od usługi WWW.
  * Sektorowe sieci prywatne: Intranet (wewnętrzna sieć organizacji) oraz Extranet (rozszerzenie Intranetu dla partnerów/zewnętrznych podmiotów).
  * Architektury sieciowe: Klient-Serwer (*Client-Server*) vs Peer-to-Peer (*P2P*, architektura równorzędna).
* **Praktyka / Laboratorium:** Analiza struktury sieciowej w organizacji oraz identyfikacja zasobów pracujących w modelu P2P oraz Klient-Serwer.

### Lekcja 2.2: Przewodowe i bezprzewodowe media transmisyjne
* **Zagadnienia do poruszenia:**
  * Miedziane media transmisyjne:
    * Kabel koncentryczny (*Thinnet* 10Base2, *Thicknet* 10Base5, złącza BNC).
    * Kabel typu skrętka (*Twisted Pair*): rodzaje nieekranowane UTP, ekranowane folią FTP, ekranowane siatką STP oraz ich hybrydy (F/UTP, S/FTP).
    * Kategorie skrętek (3, 5, 5e, 6, 6a, 7) i ich parametry techniczne (tłumienie, propagacja, rezystancja, promień zgięcia).
  * Światłowodowe media transmisyjne:
    * Zjawisko przesyłania fali świetlnej w rdzeniu szklanym; konstrukcja kabla (rdzeń, płaszcz, powłoka lakierowana, płaszcz zewnętrzny).
    * Światłowód jednomodowy (SMF, rdzeń 8–10 µm, jedna wiązka, brak rozmycia, ogromne odległości) vs wielomodowy (MMF, rdzeń 50/62.5 µm, wiele wiązek, rozmycie sygnału).
    * Najpopularniejsze złącza światłowodowe: ST, SC, FC.
  * Bezprzewodowe media transmisyjne: fale radiowe (pasma 2.4 GHz oraz 5 GHz w Wi-Fi).
* **Praktyka / Laboratorium:** Zaciiskanie wtyków RJ-45 na kablu skrętka wg standardów T568A i T568B; porównanie tłumienia sygnałów.

### Lekcja 2.3: Topologie fizyczne, logiczne i metody dostępu do nośnika
* **Zagadnienia do poruszenia:**
  * Topologie fizyczne: magistrala (*Bus*), pierścień (*Ring*), gwiazda (*Star*), rozszerzona gwiazda, siatka (*Mesh*).
  * Topologie logiczne: punkt-punkt (*Point-to-Point*), pierścień, wielodostępowa / rozgłaszania.
  * Metody kontroli dostępu do wspólnego medium transmisyjnego:
    * CSMA/CD (*Carrier Sense Multiple Access with Collision Detection*) – nasłuchiwanie łącza i obsługa kolizji w klasycznym Ethernet.
    * CSMA/CA (*Collision Avoidance*) – unikanie kolizji w sieciach bezprzewodowych Wi-Fi.
    * Token Passing – przekazywanie żetonu w sieciach Token Ring.
* **Kluczowe pojęcia:** Domeny kolizyjne, CSMA/CD, CSMA/CA, Topologia Gwiazdy.

---

## MODUŁ 3: Warstwowe modele odniesienia (ISO/OSI i TCP/IP)

### Lekcja 3.1: Dlaczego stosujemy modele warstwowe? Standaryzacja i interoperacyjność
* **Zagadnienia do poruszenia:**
  * Idea podziału skomplikowanego procesu komunikacji na mniejsze, odizolowane etapy (warstwy).
  * Zalety modeli warstwowych: możliwość współdziałania sprzętu i oprogramowania różnych producentów, łatwiejsze zarządzanie i wykrywanie błędów.
  * Niezależność warstw: zmiana w jednej warstwie nie wymaga modyfikacji pozostałych.
* **Kluczowe pojęcia:** Interoperacyjność, Standaryzacja, Model Odniesienia.

### Lekcja 3.2: Szczegółowa analiza 7 warstw modelu ISO/OSI
* **Zagadnienia do poruszenia:**
  * Historia modelu ISO/OSI (*Open Systems Interconnection*).
  * Warstwa 1 – Fizyczna (*Physical*): kodowanie bitów, sygnały elektryczne/świetlne/radiowe.
  * Warstwa 2 – Łącza Danych (*Data Link*): ramkowanie, adresowanie fizyczne (MAC), kontrola dostępu do nośnika.
  * Warstwa 3 – Sieciowa (*Network*): adresowanie logiczne (IP), routing, wyznaczanie optymalnej trasy.
  * Warstwa 4 – Transportowa (*Transport*): komunikacja end-to-end, segmentacja, niezawodność, porty.
  * Warstwa 5 – Sesji (*Session*): nawiązywanie, utrzymywanie i zamykanie sesji komunikacyjnych.
  * Warstwa 6 – Prezentacji (*Presentation*): formatowanie danych, kodowanie, kompresja, szyfrowanie.
  * Warstwa 7 – Aplikacji (*Application*): interfejs sieciowy bezpośrednio dla oprogramowania użytkownika.
* **Kluczowe pojęcia:** PDU (*Protocol Data Unit*), 7 warstw OSI.

### Lekcja 3.3: Model TCP/IP, jednostki PDU oraz procesy Enkapsulacji i Dekapsulacji
* **Zagadnienia do poruszenia:**
  * 4 warstwy modelu TCP/IP: Dostęp do sieci (*Network Access*), Internetowa (*Internet*), Transportowa (*Transport*), Aplikacji (*Application*) i ich relacja do modelu ISO/OSI.
  * Nazewnictwo jednostek danych PDU na poszczególnych poziomach: Dane \\(\rightarrow\\) Segment/Datagram \\(\rightarrow\\) Pakiet \\(\rightarrow\\) Ramka \\(\rightarrow\\) Bity.
  * Proces Enkapsulacji danych na hoście nadawczym (doklejanie nagłówków sterujących w dół stosu).
  * Proces Dekapsulacji danych na hoście odbiorczym (zdejmowanie nagłówków w górę stosu).
  * Trzystopniowe adresowanie w procesie przesyłania danych: Numery portów \\(\rightarrow\\) Adresy IP \\(\rightarrow\\) Adresy MAC.
* **Praktyka / Laboratorium:** Śledzenie nagłówków ramki i pakietu podczas przesyłania wiadomości email lub zapytania HTTP w symulatorze sieciowym.

---

## MODUŁ 4: Warstwa łącza danych, Ethernet i protokół ARP

### Lekcja 4.1: Podwarstwy LLC i MAC oraz budowa adresu fizycznego MAC
* **Zagadnienia do poruszenia:**
  * Podział warstwy łącza danych na dwie podwarstwy:
    * LLC (*Logical Link Control*, IEEE 802.2) – komunikacja z wyższymi warstwami i sterownikiem karty.
    * MAC (*Media Access Control*, IEEE 802.3) – adresowanie fizyczne i dostęp do nośnika.
  * Budowa adresu MAC: 48-bitowy (\\(6\\) bajtów) zapis szesnastkowy; pierwsza połowa to OUI (*Organizationally Unique Identifier* producenta), druga połowa to unikalny identyfikator karty.
  * Sprzętowy charakter adresu MAC w pamięci ROM karty a możliwość podmieniania adresu MAC na poziomie systemowym (MAC Spoofing).
* **Kluczowe pojęcia:** OUI, Adres MAC, Podwarstwa LLC, Podwarstwa MAC.

### Lekcja 4.2: Standard Ethernet i anatomia ramki Ethernet II
* **Zagadnienia do poruszenia:**
  * Historia i ewolucja Ethernetu (Xerox, IEEE 802.3): od 10Base2/5 przez Fast Ethernet (\\(100\text{ Mbit/s}\\)) po Gigabit Ethernet (\\(1000\text{ Base-T}\\)) i wersje \\(10/100\text{ Gbit}\\).
  * Budowa ramki Ethernet II:
    * Preambuła (\\(7\\) bajtów) i SFD (*Start Frame Delimiter*, \\(1\\) bajt).
    * Docelowy i źródłowy adres MAC (\\(2 \times 6\\) bajtów).
    * Typ / Długość (*EtherType*, np. `0x0800` dla IPv4, `0x0806` dla ARP) (\\(2\\) bajty).
    * Dane / Payload (od \\(46\\) do \\(1500\\) bajtów – dopasowanie *padding* jeśli mniej niż 46 bajtów).
    * FCS (*Frame Check Sequence* / CRC suma kontrolna) (\\(4\\) bajty).
  * Rozmiar ramki: minimalnie \\(64\\) bajty, maksymalnie \\(1518\\) bajtów (lub \\(1522\\) bajty dla ramek z tagiem VLAN 802.1Q).
* **Praktyka / Laboratorium:** Analiza bajtowa nagłówka ramki Ethernet przechwyconej na żywo.

### Lekcja 4.3: Zasada działania przełącznika (Switch) i tablica adresów MAC
* **Zagadnienia do poruszenia:**
  * Ewolucja od Koncentratora (*Hub* – przesyłanie do wszystkich portów, jedna domena kolizyjna) do Przełącznika (*Switch* – przekazywanie punkt-punkt).
  * Funkcjonowanie tablicy adresów MAC (*CAM Table*):
    * Proces uczenia się (*Learning*): odczytywanie źródłowego adresu MAC z przychodzącej ramki.
    * Proces zalewania (*Flooding*): wysyłanie ramki na wszystkie porty poza nadawczym, gdy docelowy MAC jest nieznany lub rozgłoszeniowy.
    * Przekazywanie (*Forwarding*): dostarczanie ramki dokładnie na port docelowy.
  * Elimacja kolizji, wydzielanie domen kolizyjnych oraz praca w trybie Pełnego Dupleksu (*Full-Duplex*).
* **Praktyka / Laboratorium:**
  * Wyświetlanie i czyszczenie tablicy MAC przełącznika w konsoli Cisco CLI (`show mac address-table`, `clear mac address-table`).
  * Obserwacja zjawiska zalewania w symulatorze sieciowym.

### Lekcja 4.4: Protokół ARP (Address Resolution Protocol)
* **Zagadnienia do poruszenia:**
  * Zadanie protokołu ARP: odwzorowywanie znanego adresu logicznego IPv4 na nieznany adres fizyczny MAC w obrębie tej samej podsieci.
  * Działanie mechanizmu ARP:
    * Zapytanie ARP Request (ramka rozgłoszeniowa Broadcast na adres `FF:FF:FF:FF:FF:FF`).
    * Odpowiedź ARP Reply (ramka jednostkowa Unicast do nadawcy).
  * Pamięć podręczna ARP (*ARP Cache*): wpisy dynamiczne (z czasem wygasania ok. 10 min) vs wpisy statyczne.
* **Praktyka / Laboratorium:** Podgląd i modyfikacja tablicy ARP w systemie Windows/Linux poleceniami `arp -a` oraz `arp -s`.

---

## MODUŁ 5: Projektowanie sieci LAN, okablowanie strukturalne i urządzenia RACK

### Lekcja 5.1: Zasady projektowania i normy okablowania strukturalnego
* **Zagadnienia do poruszenia:**
  * Podział okablowania strukturalnego: okablowanie poziome, pionowe (szkieletowe) oraz kampusowe.
  * Ograniczenia odległościowe dla okablowania miedzianego: maksymalnie \\(100\text{ m}\\) całkowitej długości toru (\\(90\text{ m}\\) kabel w korytkach + \\(10\text{ m}\\) na kable połączeniowe/patchcordy).
  * Kody kolorystyczne standardów T568A i T568B na złączach RJ-45 i gniazdach ściennych.
  * Dobór mediów transmisyjnych: skrętka miedziana dla połączeń końcowych, światłowód dla połączeń szkieletowych między pionami.
* **Kluczowe pojęcia:** Okablowanie Poziome, Okablowanie Pionowe, Patchcord, Standard T568B.

### Lekcja 5.2: Główny i Pośrednie Punkty Dystrybucyjne oraz wyposażenie RACK
* **Zagadnienia do poruszenia:**
  * Struktura punktów rozdzielczych: Główny Punkt Dystrybucyjny (MDF) oraz Pośrednie Punkty Dystrybucyjne (IDF).
  * Szafy dystrybucyjne RACK 19 cali: wiszące vs wolnostojące; jednostka wysokości \\(U\\) (\\(1U = 44.45\text{ mm} = 1.75\text{ cala}\\)).
  * Wyposażenie szafy RACK: Panele krosownicze (*Patch Panels*), przełączniki, routery, serwery, organizatory kabli, zasilacze awaryjne UPS, klimatyzacja dedykowana.
  * Wymagania architektoniczne pomieszczeń serwerowych (wymiary drzwi, wysokość, podłoga techniczna, wentylacja).
* **Praktyka / Laboratorium:** Opracowanie projektu rozmieszczenia elementów w szafie RACK \\(42U\\) dla budynku 3-kondygnacyjnego.

### Lekcja 5.3: Hierarchiczny model sieciowy i tworzenie pełnej dokumentacji projektowej
* **Zagadnienia do poruszenia:**
  * Trzy warstwy hierarchicznego modelu sieciowego:
    * Warstwa Rdzenia (*Core*) – ultraszybki przesył pakietów bez filtrowania.
    * Warstwa Dystrybucji (*Distribution*) – routing między VLAN-ami, polityki bezpieczeństwa, agregacja.
    * Warstwa Dostępu (*Access*) – bezpośrednie podłączenie urządzeń końcowych, Port Security.
  * Cechy nowoczesnej sieci: Skalowalność, Redundancja (nadmiarowość urządzeń i łączy), Wydajność, Bezpieczeństwo, Łatwość zarządzania.
  * Zawartość dokumentacji technicznej: założenia, bilans portów, rzuty kondygnacji, kosztorys urządzeń aktywnych/pasywnych, schemat logiczny i fizyczny, wyniki pomiarów reflektometrycznych / testerem mapy połączeń.
* **Praktyka / Laboratorium:** Wykonanie kompleksowego projektu sieci LAN dla zadanej specyfikacji budynku biurowego.

---

## MODUŁ 6: Warstwa sieciowa, adresowanie IPv4 i podsieci (VLSM/CIDR)

### Lekcja 6.1: Działanie i nagłówek protokołu IPv4
* **Zagadnienia do poruszenia:**
  * Rola warstwy sieciowej: adresowanie logiczne, routing, enkapsulacja i fragmentacja pakietów.
  * Cechy protokołu IPv4: bezpołączeniowy (*Connectionless*), usługa bezpotwierdzeniowa (*Best Effort*), niezależny od nośnika (*Media Independent*).
  * Analiza pól nagłówka IPv4:
    * Wersja, IHL (*Internet Header Length*), ToS/DiffServ (priorytetyzacja ruchu / QoS).
    * Długość całkowita (*Total Length*), Identyfikacja, Flagi, Przesunięcie fragmentu (*Fragment Offset*) – mechanizm fragmentacji przy przekraczaniu MTU (*Maximum Transmission Unit*).
    * TTL (*Time to Live*) – zapobieganie zapętlaniu pakietów w sieci.
    * Protokół warstwy wyższej (np. `1` dla ICMP, `6` dla TCP, `17` dla UDP).
    * Suma kontrolna nagłówka (*Header Checksum*).
    * Adres IP źródłowy i docelowy (\\(2 \times 32\\) bity).
* **Praktyka / Laboratorium:** Śledzenie zmian wartości TTL podczas przeskakiwania pakietu przez kolejne routery.

### Lekcja 6.2: Anatomia adresu IPv4, maska podsieci i notacja CIDR
* **Zagadnienia do poruszenia:**
  * Zapis 32-bitowego adresu IPv4 w postaci 4 oktetów dziesiętnych rozdzielonych kropkami (np. `192.168.1.1`).
  * Rola maski podsieci: wyznaczanie części sieciowej (*Network ID*) oraz części hosta (*Host ID*).
  * Notacja CIDR (*Classless Inter-Domain Routing*, np. `/24`, `/26`, `/30`).
  * Kluczowe adresy w każdej podsieci:
    * Adres sieci (pierwszy adres, bity hosta równe `0`).
    * Adres rozgłoszeniowy Broadcast (ostatni adres, bity hosta równe `1`).
    * Zakres użytkowych adresów dla hostów.
    * Brama domyślna (*Default Gateway*).
* **Praktyka / Laboratorium:** Matematyczne obliczanie adresu sieci, adresu rozgłoszeniowego i liczby dostępnych hostów dla masek `/24`, `/26`, `/30`.

### Lekcja 6.3: Adresy prywatne vs publiczne, NAT oraz adresy specjalne
* **Zagadnienia do poruszenia:**
  * Wyczulenie na kurczącą się pulę adresów IPv4 i wprowadzenie klas adresów prywatnych (RFC 1918): `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
  * Rola mechanizmu NAT (*Network Address Translation*): translacja adresów prywatnych na publiczny adres IP na granicy sieci.
  * Adresy specjalnego przeznaczenia:
    * Pętla zwrotna Loopback (`127.0.0.1` do `127.255.255.254` – testowanie lokalnego stosu TCP/IP).
    * Adresy łącza lokalnego (*Link-Local* / APIPA: `169.254.0.0/16`).
    * Adresy do celów edukacyjnych (TEST-NET).
  * Typy transmisji IP: Unicast (1 do 1), Multicast (1 do grupy, zakres `224.0.0.0/4`), Broadcast (1 do wszystkich).
* **Kluczowe pojęcia:** NAT, APIPA, Unicast, Multicast, Broadcast.

---

## MODUŁ 7: Podstawy i zaawansowany Routing (Statyczny i Dynamiczny)

### Lekcja 7.1: Rola routera, brama domyślna i tablica routingu
* **Zagadnienia do poruszenia:**
  * Router jako urządzenie warstwy 3 łączące odrębne sieci logiczne.
  * Pojęcie bramy domyślnej (*Default Gateway*) jako punktu wyjścia z lokalnej podsieci.
  * Struktura tablicy routingu (*Routing Table*):
    * Wpisy sieci bezpośrednio podłączonych (\\(C\\) - *Connected*).
    * Wpisy tras statycznych (\\(S\\) - *Static*).
    * Wpisy tras dynamicznych (\\(R\\) - *RIP*, \\(O\\) - *OSPF*, \\(D\\) - *EIGRP*).
    * Trasa domyślna (*Default Route* `0.0.0.0/0`).
  * Algorytm podejmowania decyzji o przekazaniu pakietu: wyszukiwanie najdłuższego dopasowania (*Longest Prefix Match*) i koncepcja *Next-Hop*.
* **Praktyka / Laboratorium:** Analiza tablicy routingu na routerze Cisco za pomocą polecenia `show ip route`.

### Lekcja 7.2: Routing statyczny vs dynamiczny (RIP, OSPF, EIGRP, BGP)
* **Zagadnienia do poruszenia:**
  * Routing statyczny: ręczna konfiguracja tras przez administratora; zalety (brak obciążenia CPU, wysokie bezpieczeństwo), wady (brak elastyczności, trudność w utrzymaniu w dużych sieciach).
  * Routing dynamiczny: automatyczne odnajdywanie tras i reakcja na awarie.
  * Klasyfikacja protokołów routingu dynamicznego:
    * Wektor odległości (*Distance Vector*): np. RIP (v1/v2, zliczenie skoków *Hop Count*).
    * Stan łącza (*Link-State*): np. OSPF (algorytm Dijkstry, metryka oparta na przepustowości).
    * Hybrydowe / Zaawansowane: EIGRP (własność Cisco).
    * Protokoły bramy zewnętrznej (EGP): BGP (*Border Gateway Protocol* – routing sieci Internet).
* **Praktyka / Laboratorium:** Konfiguracja routingu statycznego oraz protokołu OSPF w środowisku Cisco Packet Tracer.

### Lekcja 7.3: Diagnostyka warstwy sieciowej za pomocą protokołu ICMP
* **Zagadnienia do poruszenia:**
  * Rola protokołu ICMP (*Internet Control Message Protocol*) w komunikacji błędów i diagnostyce.
  * Program `ping`:
    * Wysyłanie żądań ICMP Echo Request i odbiór ICMP Echo Reply.
    * Interpretacja parametru czasu (RTT w ms) i pola TTL.
    * Testowanie pętli zwrotnej, bramy domyślnej i adresów zewnętrznych.
    * Blokowanie komunikatów ICMP na zaporach sieciowych.
  * Program `tracert` / `traceroute`:
    * Wykorzystanie stopniowego zwiększania pola TTL (\\(1, 2, 3\dots\\)) do identyfikacji kolejnych routerów (*Next-Hop*) na trasie pakietu.
    * Wykrywanie pętli routingowych i wąskich gardeł.
* **Praktyka / Laboratorium:**
  * Diagnozowanie braku łączności w sieci za pomocą narzędzi `ping` i `tracert` z różnymi parametrami.

---

## MODUŁ 8: Warstwa transportowa (TCP, UDP, mechanizmy połączeniowe i kontrola przepływu)

### Lekcja 8.1: Zadania warstwy transportowej, adresowanie portów i gniazda (Sockets)
* **Zagadnienia do poruszenia:**
  * Rola warstwy transportowej: śledzenie pojedynczych konwersacji, Segmentacja i reasemblacja danych, Multipleksowanie (*Multiplexing*).
  * Identyfikacja aplikacji za pomocą numerów portów (zakres \\(0 - 65535\\)):
    * Dobrze znane porty (*Well-Known Ports*: \\(0 - 1023\\), np. HTTP 80, HTTPS 443, SSH 22, DNS 53).
    * Zarejestrowane porty (*Registered Ports*: \\(1024 - 49151\\), np. MySQL 3306).
    * Dynamiczne / Prywatne porty (*Dynamic/Private Ports*: \\(49152 - 65535\\) – przydzielane losowo klientom).
  * Pojęcie gniazda sieciowego (*Socket*): kombinacja adresu IP i numeru portu (np. `192.168.1.50:443`) jednoznacznie identyfikująca proces.
* **Kluczowe pojęcia:** Multipleksowanie, Port Aplikacji, Gniazdo (Socket).

### Lekcja 8.2: Bezpołączeniowy protokół UDP (User Datagram Protocol)
* **Zagadnienia do poruszenia:**
  * Charakterystyka UDP: bezpołączeniowy, bezpotwierdzeniowy, lekki narzut nagłówka (tylko \\(8\\) bajtów).
  * Budowa nagłówka UDP: Port źródłowy, Port docelowy, Długość, Suma kontrolna.
  * Zastosowania UDP: Aplikacje wymagające niskiego opóźnienia i wysokiej szybkości, tolerujące sporadyczną utratę pakietów (DNS, DHCP, VoIP, streaming wideo, gry online).
* **Kluczowe pojęcia:** UDP Datagram, Lekki nagłówek, Niski narzut.

### Lekcja 8.3: Połączeniowy i niezawodny protokół TCP (Transmission Control Protocol)
* **Zagadnienia do poruszenia:**
  * Charakterystyka TCP: połączeniowy, gwarantujący niezawodność, dostarczenie danych w odpowiedniej kolejności i kontrolę przepływu (\\(20\\) bajtów nagłówka).
  * Flagi sterujące nagłówka TCP: `SYN`, `ACK`, `FIN`, `RST`, `PSH`, `URG`.
  * Mechanizm nawiązywania połączenia – Potrójny Uścisk Dłoni (*Three-Way Handshake*):
    1. Klient $\rightarrow$ Serwer: `SYN` (z początkowym numerem sekwencyjnym ISN).
    2. Serwer $\rightarrow$ Klient: `SYN-ACK`.
    3. Klient $\rightarrow$ Serwer: `ACK`.
  * Zamykanie połączenia (czterostopniowe: `FIN` \\(\rightarrow\\) `ACK` \\(\rightarrow\\) `FIN` \\(\rightarrow\\) `ACK`).
  * Niezawodność i kontrola przepływu:
    * Numery sekwencyjne (`SEQ`) i potwierdzenia (`ACK`).
    * Rozmiar okna (*Window Size*) i Okno Przesuwne (*Sliding Window* / okno dynamiczne).
* **Praktyka / Laboratorium:** Podgląd połączeń TCP na żywo za pomocą polecenia `netstat -a -f` w konsoli operacyjnej.

---

## MODUŁ 9: Warstwa aplikacji i kluczowe usługi sieciowe (DNS, DHCP, HTTP/S, FTP, SSH, Mail)

### Lekcja 9.1: Protokoły www (HTTP i HTTPS)
* **Zagadnienia do poruszenia:**
  * Model komunikacji HTTP (port 80): Klient wysyła żądanie URL, serwer odpowiada kodem HTML.
  * Podstawowe metody HTTP: `GET` (pobieranie danych) oraz `POST` (przesyłanie formularzy/danych na serwer).
  * Kody odpowiedzi HTTP: kody sukcesu ($200\text{ OK}$), błędy klienta ($403\text{ Forbidden}$, $404\text{ Not Found}$), błędy serwera ($500\text{ Internal Server Error}$).
  * Zagrożenie przesyłania danych jawnym tekstem w protokole HTTP (możliwość podsłuchania loginu i hasła).
  * Bezpieczna alternatywa: HTTPS (port 443) szyfrujący transmisję za pomocą TLS/SSL.
* **Praktyka / Laboratorium:** Przechwytywanie zapytań HTTP GET i POST oraz obserwacja niezaszyfrowanych nagłówków.

### Lekcja 9.2: Usługi poczty elektronicznej (SMTP, POP3, IMAP) i przesyłania plików (FTP)
* **Zagadnienia do poruszenia:**
  * Obsługa poczty e-mail:
    * SMTP (*Simple Mail Transfer Protocol*, port 25 / SMTPS 465/587) – wysyłanie poczty między serwerami.
    * POP3 (*Post Office Protocol v3*, port 110 / POP3S 995) – pobieranie poczty na dysk lokalny.
    * IMAP (*Internet Message Access Protocol*) – synchronizacja poczty na serwerze.
    * Rola agentów pocztowych: MUA (*Mail User Agent*), MTA (*Mail Transfer Agent*), MDA (*Mail Delivery Agent*).
  * Przesyłanie plików FTP (*File Transfer Protocol*):
    * Rozdzielenie połączenia: połączenie sterujące (port 21) oraz połączenie danych (port 20).
    * Autoryzacja użytkownika vs dostęp anonimowy (*Anonymous*).
* **Praktyka / Laboratorium:** Połączenie z serwerem FTP i wgranie plików za pomocą programu WinSCP lub FileZilla.

### Lekcja 9.3: Bezpieczne zarządzanie zdalne (SSH vs Telnet)
* **Zagadnienia do poruszenia:**
  * Telnet (port 23) – niezaszyfrowany, przestarzały protokół terminalowy.
  * SSH (*Secure Shell*, port 22) – zaszyfrowany protokół zarządzania hostami.
  * Mechanizm kryptograficzny SSH: klucze asymetryczne (RSA/DSA), plik `known_hosts`, klucz sesji szyfrujący całą konwersację symetrycznie.
* **Praktyka / Laboratorium:** Zdalne logowanie do serwera Linux przez SSH za pomocą programu PuTTY i generowanie pary kluczy.

### Lekcja 9.4: Usługa nazw domenowych DNS (Domain Name System)
* **Zagadnienia do poruszenia:**
  * Rola DNS: tłumaczenie nazw zrozumiałych dla człowieka (nazw mnemonicznych/domen) na adresy IP.
  * Hierarchiczna struktura DNS (odwrócone drzewo): Root (korzeń `.`), TLD (*Top-Level Domain*: `.pl`, `.com`, `.org`, `.gov`), domeny II poziomu.
  * Kluczowe typy rekordów DNS: Rekord `A` (IPv4), Rekord `AAAA` (IPv6), Rekord `MX` (serwery pocztowe), Rekord `CNAME` (alias).
  * Działanie modułu resolvera oraz rola pamięci podręcznej (*DNS Cache*) na hoście i serwerze lokalnym.
* **Praktyka / Laboratorium:** podgląd i czyszczenie pamięci cache DNS w systemie Windows (`ipconfig /displaydns`, `ipconfig /flushdns`).

### Lekcja 9.5: Protokół automatycznej konfiguracji hostów DHCP
* **Zagadnienia do poruszenia:**
  * Rola DHCP (*Dynamic Host Configuration Protocol*): automatyczny przydział adresu IP, maski podsieci, bramy domyślnej i adresów serwerów DNS.
  * Koncepcja dzierżawy adresu IP (*Lease Time*), wygasanie dzierżawy i zwrot adresu do puli (*Address Pool*).
  * Wymóg statycznego adresowania dla kluczowych urządzeń strukturalnych (serwery, drukarki, routery).
* **Kluczowe pojęcia:** Pula adresów, Dzierżawa (Lease), DHCP Server.

---

## MODUŁ 10: Protokół IPv6 – Przyszłość adresowania sieciowego

### Lekcja 10.1: Dlaczego powstał IPv6? Struktura i zasady skracania adresów
* **Zagadnienia do poruszenia:**
  * Przyczyny wprowadzenia IPv6: wyczerpanie 32-bitowej puli IPv4 (ok. 4 mld adresów rynkowo skończone).
  * Ogromna przestrzeń adresowa IPv6: 128 bitów ($2^{128} \approx 3.4 \times 10^{38}$ adresów).
  * Zapis adresu IPv6: 8 heksów (hektetów) po 16 bitów, rozdzielonych dwukropkami (np. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`).
  * Zasady skracania zapisu:
    1. Pomijanie zer wiodących w poszczególnych heksach.
    2. Jednorazowe zastąpienie ciągu zerowych heksów podwójnym dwukropkiem (`::`).
* **Praktyka / Laboratorium:** Ręczne skracanie i rozwijanie pełnych adresów IPv6.

### Lekcja 10.2: Typy i zakresy adresowe w IPv6
* **Zagadnienia do poruszenia:**
  * Brak adresów Broadcast w IPv6 – zastąpienie ich usprawnionym Multicastem.
  * Rodzaje adresów IPv6 Unicast:
    * Global Unicast (`2000::/3`) – odpowiednik publicznych IPv4, routowalne w necie.
    * Unique Local (`FC00::/7`) – odpowiednik adresów prywatnych IPv4.
    * Link-Local (`FE80::/10`) – autokonfigurowalne adresy do komunikacji wyłącznie w lokalnym segmencie.
    * Loopback (`::1/128`).
  * Adresy Multicast (`FF00::/8`): np. All Nodes (`FF02::1`), All Routers (`FF02::2`), Solicited-Node Multicast.
  * Adresy Anycast (adres 1 do najbliższego z grupy).
* **Kluczowe pojęcia:** Global Unicast, Link-Local, Unique Local, Anycast.

### Lekcja 10.3: Konfiguracja dynamiczna (SLAAC, DHCPv6) oraz mechanizmy współistnienia (Dual Stack, Tunelowanie)
* **Zagadnienia do poruszenia:**
  * Metody automatycznej konfiguracji:
    * SLAAC (*Stateless Address Autoconfiguration*) – generowanie adresu na podstawie prefiksu z komunikatów RA (*Router Advertisement*) oraz ID interfejsu (metoda EUI-64 z MAC karty lub losowa).
    * SLAAC + Stateless DHCPv6.
    * Stateful DHCPv6.
  * Mechanizmy przejścia z IPv4 na IPv6:
    * Podwójny stos (*Dual Stack*) – równoległe działanie IPv4 i IPv6 na urządzeniach.
    * Tunelowanie (np. 6to4, ISATAP) – pakowanie pakietów IPv6 w pakiety IPv4.
    * Translacja NAT-PT / NAT64.
* **Praktyka / Laboratorium:** Konfiguracja statyczna oraz obserwacja automatycznie wygenerowanego adresu Link-Local w systemie Windows.

---

## MODUŁ 11: Zaawansowana administracja, przełączanie Cisco/Linux i wirtualizacja

### Lekcja 11.1: Przełączanie wirtualne (VLAN) i protokoły drzewa rozpinającego (STP)
* **Zagadnienia do poruszenia:**
  * Podział sieci fizycznej na wirtualne sieci lokalne (VLAN, IEEE 802.1Q).
  * Zalety VLAN-ów: izolacja ruchu, podniesienie bezpieczeństwa, ograniczenie domen rozgłoszeniowych.
  * Zjawisko pętli w warstwie 2 i rola protokołu STP (*Spanning Tree Protocol* / PVST, RPVST) w blokowaniu zapasowych ścieżek.
  * Agregacja łączy: EtherChannel / LACP.
* **Praktyka / Laboratorium:** Tworzenie VLAN-ów i przypisywanie portów na przełącznikach Cisco CLI / TP-Link.

### Lekcja 11.2: Zabezpieczanie urządzeń przełączających i serwerów
* **Zagadnienia do poruszenia:**
  * Zabezpieczenia na przełączniku:
    * Port Security (limitowanie i przypisywanie adresów MAC do portu).
    * DHCP Snooping (blokowanie nieautoryzowanych serwerów DHCP).
    * Szyfrowanie haseł, usługi AAA oraz dostęp SSH.
  * Administracja systemem Linux Ubuntu Server:
    * Konfiguracja interfejsów i zasilanie tabel sieciowych.
    * Usługi sieciowe: Apache2 (HTTP/HTTPS), DNSmasq, BIND9, iptables (Firewall / NAT).
    * Wirtualizacja: Hyper-V, LVM, serwery plików SMB/NFS.
* **Praktyka / Laboratorium:** Konfiguracja reguł zapory `iptables` i uszczelnianie dostępu SSH na serwerze Linux.

---

## MODUŁ 12: Podsłuchiwanie sieci, inspekcja pakietów (Wireshark) i analiza ruchu na żywo

### Lekcja 12.1: Wprowadzenie do snifferów i konfiguracja środowiska Wireshark
* **Zagadnienia do poruszenia:**
  * Definicja sniffera jako narzędzia do inspekcji i analizy pakietów na poziomie karty sieciowej.
  * Rola bibliotek przechwytywania ruchu w czasie rzeczywistym (WinPcap / Npcap dla Windows).
  * Trzy okna interfejsu Wireshark: Lista pakietów, Szczegóły nagłówków PDU (odzwierciedlenie stosu), Podgląd szesnastkowy/bajtowy (*Hex Dump*).
* **Praktyka / Laboratorium:** Instalacja Wiresharka, wybór właściwego interfejsu i uruchomienie przechwytywania ruchu.

### Lekcja 12.2: Filtry przechwytywania (Capture Filters) vs filtry wyświetlania (Display Filters)
* **Zagadnienia do poruszenia:**
  * Różnica fundamentalna: filtry przechwytywania ograniczają zapisywany ruch na wejściu; filtry wyświetlania ukrywają nieistotne pakiety z już przechwyconego zbioru.
  * Składnia filtrów wyświetlania: np. `dns`, `http`, `tcp`, `icmp`, `ip.addr == X.X.X.X`.
  * Tworzenie zaawansowanych warunków z operatorami logicznymi (`and`, `or`, `not`).
* **Praktyka / Laboratorium:** Wyizolowanie z szumu sieciowego wyłącznie pakiety uzgadniania trój etapowego TCP dla wybranego serwera WWW.

### Lekcja 12.3: Praktyczna analiza protokołów i wyciąganie niezaszyfrowanych danych
* **Zagadnienia do poruszenia:**
  * Analiza na żywo procesu enkapsulacji: badanie ramki Ethernet, pakietu IP i segmentu TCP krok po kroku.
  * Obserwacja nawiązywania połączenia TCP (flagi `SYN` $\rightarrow$ `SYN-ACK` $\rightarrow$ `ACK`).
  * Przechwytywanie informacji przesłanych jawnym tekstem:
    * Odczyt loginu i hasła z formularzy HTTP POST.
    * Odczyt poświadczeń w sesji FTP.
  * Uświadomienie bezwzględnej konieczności stosowania szyfrowania SSL/TLS (HTTPS, FTPS, SSH) w dzisiejszych sieciach.
* **Praktyka / Laboratorium:** Przechwycenie własnego logowania w środowisku testowym i odczytanie przesłanego hasła z pakietu HTTP POST.

---

## MODUŁ 13: Sieci komputerowe w Cyberbezpieczeństwie – Ofensywa, Defensywa i Analiza Malware

### Lekcja 13.1: Sieci jako kręgosłup cyberbezpieczeństwa
* **Zagadnienia do poruszenia:**
  * Dlaczego sieci są fundamentem cyberbezpieczeństwa: każdy atak, infekcja malware, wyciek danych czy komunikacja C2 opiera się na pakietach sieciowych.
  * Dwubiegunowość cyberbezpieczeństwa:
    * Strona ofensywna (*Red Team*): preparowanie, modyfikowanie i wysyłanie pakietów w celu doprowadzenia do błędnej pracy usługi.
    * Strona defensywna (*Blue Team*): stanie na drodze ruchu i wykrywanie/blokowanie zagrożeń w pojedynczych pakietach lub sekwencjach.
* **Kluczowe pojęcia:** Red Team, Blue Team, Inżynieria ruchu, Preparowanie pakietów.

### Lekcja 13.2: Stos technologiczny obrony sieciowej i stacyjnej
* **Zagadnienia do poruszenia:**
  * Ochrona stacji końcowej: EDR (*Endpoint Detection and Response* – analiza pamięci i procesów) oraz DLP (*Data Loss Prevention* – pilnowanie wycieku danych).
  * Ochrona na brzegu i wewnątrz sieci:
    * Zapora sieciowa (*Firewall*): decydowanie o zezwoleniu na połączenie.
    * IDS/IPS (*Intrusion Detection/Prevention System*): wykrywanie znanych wzorców ataków i blokowanie ich w locie.
    * NDR (*Network Detection and Response*): wyszukiwanie anomalii zachowania w całej sieci.
* **Kluczowe pojęcia:** Firewall, IDS/IPS, NDR, EDR, DLP.

### Lekcja 13.3: Wektory infekcji i zachowanie złośliwego oprogramowania (Malware) w sieci
* **Zagadnienia do poruszenia:**
  * Cztery główne wektory dostawania się malware do wnętrza organizacji (wszystkie wykorzystują sieć):
    1. Phishing (wiadomości e-mail z załącznikami/linkami).
    2. Pobieranie złośliwego oprogramowania z sieci (kraki, fałszywe instalatory).
    3. Socjotechnika (fałszywa weryfikacja "I am not a robot" wykonująca polecenia w konsoli).
    4. Exploitation luk w usługach wystawionych do Internetu (bramy VPN, serwery pocztowe, panele).
  * Zachowanie malware po infekcji:
    * Komunikacja z serwerem C2 (*Command & Control*) i botnety.
    * InfoStealery – wykradanie ciasteczek, tokenów i haseł.
    * Ransomware i podwójne wymuszenie (*Double Extortion* – najpierw exfiltracja gigabajtów danych przez sieć, potem szyfrowanie).
    * Wyjątki takie jak Stuxnet (infekcja przez USB, ale rozprzestrzenianie po lokalnej sieci LAN).
* **Praktyka / Laboratorium:** Analiza aktywnych połączeń sieciowych systemu za pomocą wbudowanego narzędzia `netstat` i weryfikacja podejrzanych procesów (np. `svchost.exe`) oraz ich adresów docelowych w bazach Threat Intelligence.

### Lekcja 13.4: Podatności protokołów warstwy 2 – ARP Spoofing i atak Man-in-the-Middle
* **Zagadnienia do poruszenia:**
  * Brak jakiejkolwiek autentykacji w tradycyjnym protokole ARP.
  * Mechanizm ataku ARP Spoofing / ARP Poisoning: rozsyłanie fałszywych odpowiedzi ARP Reply przypisujących MAC adres atakującego do adresu IP bramy domyślnej.
  * Przechwytywanie całego ruchu stacji (Man-in-the-Middle – MitM).
  * Metody obrony: statyczne wpisy ARP, Dynamic ARP Inspection (DAI) na przełącznikach.
* **Kluczowe pojęcia:** ARP Spoofing, Man-in-the-Middle, DAI.

---

## MODUŁ 14: Praktyczny warsztat, wirtualne laboratoria i podsumowanie

### Lekcja 14.1: Budowa własnego środowiska laboratoryjnego (Home Lab)
* **Zagadnienia do poruszenia:**
  * Wirtualizacja środowiska: konfiguracja Hyper-V / VirtualBox / VMware.
  * Wdrożenie wirtualnej zapory sieciowej pfSense / OPNsense i konfiguracja interfejsów WAN/LAN.
  * Symulacja sieci w środowisku Cisco Packet Tracer: przeciąganie routerów, switchy i konfiguracja przez CLI.
  * Skanowanie sieci za pomocą narzędzia Nmap: analiza wysyłanych pakietów pod spodem w Wiresharku.
* **Praktyka / Laboratorium:** Zbudowanie wirtualnego laboratorium, uruchomienie zaporowej maszyny pfSense oraz przeprowadzenie skanowania Nmap z równoległym podglądem pakietów w Wiresharku.

### Lekcja 14.2: Ścieżka rozwoju i właściwe podejście do nauki sieci
* **Zagadnienia do poruszenia:**
  * Unikanie pułapki "tutorial hell" oraz bezmyślnego wklejania komend z internetu bez rozumienia co przelatuje przez kartę sieciową.
  * Właściwa metodologia: nauka teorii połączona z jej dotykaniem, rozbijaniem i analizą na poziomie pakietów.
  * Dalsze materiały dydaktyczne i certyfikacja (np. CompTIA Network+, materiały edukacyjne).
* **Kluczowe pojęcia:** Packet-Level Understanding, Home Lab, Analiza anomalii.

---

