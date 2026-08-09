# Weryfikacja merytoryczna kursu Podstawy sieci komputerowych

- Stan: `przed pilotażem`
- Data kontroli: `2026-07-25`
- Zakładany odbiorca: osoba po kursie `binarne-fundamenty-it`, bez wcześniejszej wiedzy sieciowej
- Zakres bieżącej kontroli: cały kurs, lekcja po lekcji; moduł 3 nadal w przebudowie

## Rejestr wymagań wstępnych

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit i bajt | `ZNANY` | `binarne-fundamenty-it/Moduł 0/Bity, Bajty i Realne Prędkości` |
| sygnał fizyczny | `WPROWADZANY` | sekcja „Połączenie przenosi sygnał”; bez wymagania znajomości modulacji |
| host | `WPROWADZANY` | sekcja „Host rozpoczyna albo kończy wymianę” |
| protokół | `WPROWADZANY` | sekcja „Protokół nadaje wymianie reguły” |
| ramka, datagram, segment | `WPROWADZANY POMOCNICZO` | rozróżnienie nazw bez wymagania budowy nagłówków |
| przełącznik, punkt dostępu, router | `WPROWADZANY` | role opisane bez adresów MAC i tablic routingu |
| adres IP | `POMOCNICZY` | występuje tylko jako informacja interpretowana przez router; pełne wyjaśnienie później |
| TCP | `POMOCNICZY` | przykład protokołu zapewniającego niezawodny strumień; mechanika później |

Wynik bramki zależności: brak pozycji `LUKA` dla zadań wymaganych w lekcji.

## Źródła pierwotne i normatywne

| ID | Źródło | Zastosowanie | Data dostępu |
| --- | --- | --- | --- |
| S-001 | NIST CSRC, „network”, https://csrc.nist.gov/glossary/term/network | sieć jako system połączonych komponentów | 2026-07-25 |
| S-002 | NIST CSRC, „host”, https://csrc.nist.gov/glossary/term/host | host jako źródło/cel w odróżnieniu od urządzenia kierującego ruchem | 2026-07-25 |
| S-003 | NIST CSRC, „router”, https://csrc.nist.gov/glossary/term/router | router jako urządzenie przekazujące pakiety pomiędzy sieciami | 2026-07-25 |
| S-004 | NIST CSRC, „Access Point”, https://csrc.nist.gov/glossary/term/access_point | rola punktu dostępu w dołączaniu klientów bezprzewodowych | 2026-07-25 |
| S-005 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | architektura hostów i bram, niezależne przekazywanie datagramów, definicje ramki/pakietu/datagramu oraz ścieżki | 2026-07-25 |
| S-006 | IETF RFC 9293, https://www.rfc-editor.org/rfc/rfc9293.html | TCP jako niezawodny, uporządkowany strumień bajtów; detekcja strat i retransmisja | 2026-07-25 |
| S-007 | IETF RFC 791, https://www.rfc-editor.org/rfc/rfc791.html | rola IP w przenoszeniu datagramów przez połączone sieci i znaczenie adresu | 2026-07-25 |
| S-008 | ITU-T G.961, https://www.itu.int/rec/T-REC-G.961 | przykład kodowania danych binarnych w trójstanowe symbole oraz zależność szybkości symbolowej od kodu linii i szybkości bitowej | 2026-07-25 |
| S-009 | ITU-T J.1 (12/2025), https://www.itu.int/epublications/publication/itu-t-j-1-2025-12-terms-definitions-and-acronyms-for-television-and-sound-transmission-and-integrated-broadband-cable-networks | QPSK jako cztery stany fazy kodujące dwa bity | 2026-07-25 |
| S-010 | ITU-T G.807 (10/2024), https://www.itu.int/epublications/publication/itu-t-g-807-2024-10-generic-functional-architecture-of-the-optical-media-layer | rozdzielenie strumienia informacji cyfrowej od sygnału i funkcji modulacji | 2026-07-25 |
| S-011 | ITU-T K.60 (07/2023), https://www.itu.int/epublications/publication/itu-t-k-60-2023-07-emission-levels-and-test-methods-for-wireline-telecommunication-networks-to-minimize-electromagnetic-disturbance-of-radio-services | zakłócenie elektromagnetyczne jako zjawisko mogące pogorszyć pracę urządzenia lub systemu | 2026-07-25 |
| S-012 | NIST, „Blind Measurement of Receiver System Noise”, https://www.nist.gov/publications/blind-measurement-receiver-system-noise | wpływ tłumienia oraz dodatkowego szumu na odpowiedź danych odbiornika | 2026-07-25 |
| S-013 | IETF RFC 7928, https://www.rfc-editor.org/rfc/rfc7928.html | składniki opóźnienia końcowego oraz definicja goodputu | 2026-07-25 |
| S-014 | IETF RFC 4377, https://www.rfc-editor.org/rfc/rfc4377.html | rozróżnienie opóźnienia propagacji, transmisji, przetwarzania i kolejki | 2026-07-25 |
| S-015 | IETF RFC 5166, https://www.rfc-editor.org/rfc/rfc5166.html | rozróżnienie throughputu i goodputu | 2026-07-25 |
| S-016 | IEEE 802.3 10GBASE-T Study Group, cele projektu, https://www.ieee802.org/3/an/objectives.pdf | zależność zasięgu 10GBASE-T od klasy i parametrów całego kanału miedzianego | 2026-07-25 |
| S-017 | IEEE 802.11 Working Group, https://www.ieee802.org/11/abt80211.html | zakres standardu 802.11 obejmujący warstwy MAC i PHY | 2026-07-25 |
| S-018 | IEEE P802.11-93/95, https://www.ieee802.org/11/Documents/DocumentArchives/1993_docs/1193095_scan.pdf | współdzielenie medium radiowego oraz dostęp CSMA/CA z potwierdzeniami | 2026-07-25 |
| S-019 | FCC 24-125, https://docs.fcc.gov/public/attachments/FCC-24-125A1_Rcd.pdf | 6 GHz jako pasmo udostępnione urządzeniom nielicencjonowanym z zasadami ochrony innych zastosowań | 2026-07-25 |
| S-020 | Corning, „Optical Fiber Glossary of Terms”, https://www.corning.com/optical-communications/in/en/home/products/fiber/optical-fiber-resource-center/glossary-of-terms.html | tłumienie, dyspersja oraz rozróżnienie włókna jednomodowego i wielomodowego | 2026-07-25 |
| S-021 | OSHA, „Guidelines for Laser Safety and Hazard Assessment”, https://www.osha.gov/enforcement/directives/std-01-05-001 | zakaz patrzenia w niezweryfikowane zakończenia włókien i ryzyko niewidzialnego promieniowania | 2026-07-25 |
| S-022 | NIST SP 800-82 Rev. 3, https://doi.org/10.6028/NIST.SP.800-82r3 | wpływ środowiska przemysłowego na dobór okablowania oraz potrzeba ochrony przed zakłóceniami | 2026-07-25 |
| S-023 | ISO/IEC 7498-1:1994, https://www.iso.org/standard/20269.html | aktualny status modelu, zastąpienie edycji z 1984 roku oraz zakres jako model odniesienia, nie specyfikacja implementacji | 2026-07-25 |
| S-024 | ITU-T X.200 (07/1994), https://www.itu.int/rec/T-REC-X.200 | cele, usługi i możliwe funkcje siedmiu warstw OSI oraz zastrzeżenie, że opis nie definiuje kompletnych protokołów | 2026-07-25 |
| S-025 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | czteropoziomowa organizacja stosu internetowego i ograniczenia ścisłego modelu warstwowego | 2026-07-25 |
| S-026 | IETF RFC 768, https://www.rfc-editor.org/rfc/rfc768.html | UDP jako usługa datagramowa bez gwarancji dostarczenia i ochrony przed duplikatami | 2026-07-25 |
| S-027 | IETF RFC 8200, https://www.rfc-editor.org/rfc/rfc8200.html | fragmentacja IPv6 wykonywana przez źródło, a nie routery po drodze | 2026-07-25 |
| S-028 | IETF RFC 8446, https://www.rfc-editor.org/rfc/rfc8446.html | TLS jako bezpieczny kanał korzystający z niezawodnego, uporządkowanego strumienia transportowego | 2026-07-25 |
| S-029 | IETF RFC 792, https://www.rfc-editor.org/rfc/rfc792.html | ICMP Echo i ograniczony zakres wniosków wynikających z komunikatów ICMP | 2026-07-25 |
| S-030 | IEEE 802.3-2022, https://standards.ieee.org/ieee/7003/10422/ | wspólna funkcja MAC Ethernetu, różne warstwy PHY, tryby współdzielony i pełnego dupleksu oraz zakres standardu | 2026-07-25 |
| S-031 | IEEE/ISO/IEC 8802-1Q-2024, https://standards.ieee.org/ieee/8802-1Q/11825/ | aktualny zakres standardu mostów, sieci mostowanych i VLAN-ów | 2026-07-25 |
| S-032 | IEEE 802.1 i IETF, „IEEE 802.1Q”, https://www.ieee802.org/802_tutorials/2013-03/8021-IETF-tutorial-final.pdf | decyzja przekazywania według docelowego MAC i VLAN, filtrowanie znanych portów oraz zalewanie nieznanego celu | 2026-07-25 |
| S-033 | IETF RFC 9542, https://www.rfc-editor.org/rfc/rfc9542.html | współczesne zasady 48-bitowych adresów MAC, różne długości przydziałów IEEE oraz położenie adresów i EtherType w ramce | 2026-07-25 |
| S-034 | Cisco IOS XE 17, „Configure MAC”, https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/lyr2-fwd/cdp-lldp-mac-udld/cdp-lldp-mac-udld-configuration-guide/c-configure-mac.html | potwierdzenie implementacyjne: uczenie ze źródła, przekazywanie według celu, filtrowanie, zalewanie i konfigurowalne starzenie wpisów | 2026-07-25 |
| S-035 | IEEE 802.3 Working Group, „IEEE 802.3 Ethernet Overview”, https://www.ieee802.org/misc-docs/GlobeCom2009/IEEE_802d3_Law.pdf | pola ramki MAC Ethernet, w tym adres docelowy, źródłowy, dane i FCS | 2026-07-25 |
| S-036 | IETF RFC 791, https://www.rfc-editor.org/rfc/rfc791.html | 32-bitowe adresy IPv4, przekazywanie datagramów według adresu docelowego oraz wymiana nagłówka lokalnej sieci na kolejnych łączach | 2026-07-25 |
| S-037 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | wybór pierwszego kroku przez host, rozróżnienie celu bezpośredniego i bramy oraz możliwość posiadania wielu adresów przez host wielointerfejsowy | 2026-07-25 |
| S-038 | IETF RFC 1812, https://www.rfc-editor.org/rfc/rfc1812.html | wymagane najdłuższe dopasowanie, trasa domyślna o długości zero, następny krok i brak możliwości przekazania bez pasującej trasy | 2026-07-25 |
| S-039 | IETF RFC 4632, https://www.rfc-editor.org/rfc/rfc4632.html | zapis prefiksu CIDR, zakres długości od 0 do 32 oraz reguła najdłuższego dopasowania | 2026-07-25 |
| S-040 | IETF RFC 9293, https://www.rfc-editor.org/rfc/rfc9293.html | TCP jako niezawodny, uporządkowany strumień bajtów, wykrywanie strat i odzyskiwanie przez retransmisję; dokument zastępuje RFC 793 | 2026-07-25 |
| S-041 | IETF RFC 768, https://www.rfc-editor.org/rfc/rfc768.html | UDP jako usługa datagramowa bez gwarancji dostarczenia i ochrony przed duplikatami oraz pola portów | 2026-07-25 |
| S-042 | IETF RFC 6335, https://www.rfc-editor.org/rfc/rfc6335.html | port jako logiczny identyfikator do demultipleksacji sesji, identyfikacji usługi i rozróżniania komunikacji wraz z adresami oraz protokołem | 2026-07-25 |
| S-043 | IETF RFC 8085, https://www.rfc-editor.org/rfc/rfc8085.html | odpowiedzialność aplikacji UDP za obsługę strat, duplikatów, niezawodności i kontrolę przeciążenia | 2026-07-25 |
| S-044 | IETF RFC 9000, https://www.rfc-editor.org/rfc/rfc9000.html | QUIC jako bezpieczny, multipleksowany transport oparty na UDP z niezawodnymi strumieniami i kontrolą przeciążenia | 2026-07-25 |
| S-045 | IETF RFC 9110, https://www.rfc-editor.org/rfc/rfc9110.html | aktualna semantyka żądań i odpowiedzi HTTP, reprezentacje, bezstanowość protokołu oraz znaczenie odpowiedzi 400 i 401 | 2026-07-25 |
| S-046 | IETF RFC 8259, https://www.rfc-editor.org/rfc/rfc8259.html | gramatyka JSON, poprawne wartości i obiekty oraz wymaganie UTF-8 dla wymiany między systemami | 2026-07-25 |
| S-047 | IETF RFC 3629, https://www.rfc-editor.org/rfc/rfc3629.html | UTF-8 jako kodowanie znaków Unicode przy użyciu sekwencji od jednego do czterech oktetów | 2026-07-25 |
| S-048 | IETF RFC 8729, https://www.rfc-editor.org/rfc/rfc8729.html | seria RFC obejmuje dokumenty z kilku strumieni i o różnych statusach; sam numer RFC nie oznacza standardu internetowego | 2026-07-25 |
| S-049 | IETF RFC 3021, https://www.rfc-editor.org/rfc/rfc3021.html | prefiks `/31` na łączu punkt do punktu i interpretowanie obu adresów jako adresów końców zamiast sieci oraz broadcastu | 2026-07-25 |
| S-050 | IETF RFC 5737, https://www.rfc-editor.org/rfc/rfc5737.html | bloki `192.0.2.0/24`, `198.51.100.0/24` i `203.0.113.0/24` przeznaczone do dokumentacji i przykładów | 2026-07-25 |
| S-051 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | 32-bitowa postać adresu IPv4, adres hosta, adres sieci oraz standardowa postać broadcastu z bitami części lokalnej ustawionymi na jeden | 2026-07-25 |
| S-052 | IETF RFC 4291, https://www.rfc-editor.org/rfc/rfc4291.html | 128-bitowa architektura adresów IPv6, osiem 16-bitowych grup, składnia `::`, zapis prefiksu oraz zakres link-local | 2026-07-25 |
| S-053 | IETF RFC 5952, https://www.rfc-editor.org/rfc/rfc5952.html | kanoniczna reprezentacja tekstowa IPv6: brak zer wiodących, maksymalne skrócenie najdłuższego ciągu, wybór pierwszego ciągu przy remisie i małe litery | 2026-07-25 |
| S-054 | IETF RFC 4007, https://www.rfc-editor.org/rfc/rfc4007.html | strefy adresów o ograniczonym zakresie oraz indeks strefy rozróżniający ten sam adres link-local na różnych łączach | 2026-07-25 |
| S-055 | IETF RFC 3849 oraz aktualizacja RFC 9637, https://www.rfc-editor.org/rfc/rfc3849.html, https://www.rfc-editor.org/rfc/rfc9637.html | `2001:db8::/32` jako nadal istniejący prefiks dokumentacyjny oraz rozszerzenie przestrzeni dokumentacyjnej o `3fff::/20` | 2026-07-25 |
| S-056 | IETF RFC 2131, https://www.rfc-editor.org/rfc/rfc2131.html | stany klienta DHCPv4, znaczenie DISCOVER, OFFER, REQUEST, ACK i NAK, identyfikator transakcji, relay, T1, T2 oraz wygaśnięcie dzierżawy | 2026-07-25 |
| S-057 | IETF RFC 2132, https://www.rfc-editor.org/rfc/rfc2132.html | opcje maski podsieci, routerów w podsieci klienta i serwerów DNS | 2026-07-25 |
| S-058 | IETF RFC 1542, https://www.rfc-editor.org/rfc/rfc1542.html | zachowanie agenta BOOTP/DHCP relay, ustawianie `giaddr`, zachowanie pól żądania i dostarczanie odpowiedzi | 2026-07-25 |
| S-059 | IETF RFC 3927, https://www.rfc-editor.org/rfc/rfc3927.html | IPv4 link-local jako mechanizm dla braku działającego adresu routowalnego oraz zakaz traktowania go jako powodu do zmiany maszyny stanów DHCP | 2026-07-25 |
| S-060 | IETF RFC 3022, https://www.rfc-editor.org/rfc/rfc3022.html | tradycyjny NAT i NAPT, wiązanie wewnętrznych adresów oraz portów z zewnętrznymi, translacja pakietów w obu kierunkach i statyczne mapowania ruchu przychodzącego | 2026-07-25 |
| S-061 | IETF RFC 4787, https://www.rfc-editor.org/rfc/rfc4787.html | rozróżnienie zachowania mapowania i filtrowania NAT oraz kryteriów akceptacji pakietów od zdalnych końców | 2026-07-25 |
| S-062 | IETF RFC 6888, https://www.rfc-editor.org/rfc/rfc6888.html | CGN jako dodatkowa warstwa translacji u operatora, zewnętrzny adres i port oraz znaczenie informacji o mapowaniu | 2026-07-25 |
| S-063 | IETF RFC 6598, https://www.rfc-editor.org/rfc/rfc6598.html | przestrzeń współdzielona `100.64.0.0/10` przeznaczona do łączy między urządzeniem klienta a CGN | 2026-07-25 |
| S-064 | IETF RFC 826, https://www.rfc-editor.org/rfc/rfc826.html | pola ARP Request i Reply, uczenie skojarzenia z pól nadawcy oraz rozwiązanie adresu protokołu do adresu sprzętowego | 2026-07-25 |
| S-065 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | wymaganie usuwania lub ponownej walidacji nieaktualnych wpisów pamięci ARP bez narzucania jednego czasu i mechanizmu | 2026-07-25 |
| S-066 | IETF RFC 1812, https://www.rfc-editor.org/rfc/rfc1812.html | wybór bezpośredniego celu albo innego routera jako następnego kroku przed rozwiązaniem adresu łącza | 2026-07-25 |
| S-067 | IETF RFC 5227, https://www.rfc-editor.org/rfc/rfc5227.html | ARP Probe, Announcement, ciągłe wykrywanie konfliktu IPv4 oraz ograniczenia wnioskowania o przyczynie sprzecznych pakietów | 2026-07-25 |
| S-068 | IETF RFC 792, https://www.rfc-editor.org/rfc/rfc792.html | ICMPv4 Echo, Destination Unreachable, Time Exceeded, cytowanie pierwotnego datagramu i brak gwarancji otrzymania komunikatu kontrolnego | 2026-07-25 |
| S-069 | IETF RFC 1122, https://www.rfc-editor.org/rfc/rfc1122.html | wymagania hosta dla Echo Request/Reply oraz traktowanie komunikatów Destination Unreachable jako wskazówek dla wyższych warstw | 2026-07-25 |
| S-070 | IETF RFC 1812, https://www.rfc-editor.org/rfc/rfc1812.html | generowanie Time Exceeded po wygaśnięciu TTL oraz dopuszczalne ograniczanie częstotliwości komunikatów ICMP przez routery | 2026-07-25 |
| S-071 | IETF RFC 7276, https://www.rfc-editor.org/rfc/rfc7276.html | traceroute jako aplikacja używająca rosnącego TTL, Time Exceeded i odpowiedzi końcowej; możliwość wielu tras ECMP | 2026-07-25 |
| S-072 | IETF RFC 1034, https://www.rfc-editor.org/rfc/rfc1034.html | rola resolvera rekurencyjnego, pamięć podręczna, TTL, delegacje oraz kontynuowanie rozwiązywania po rekordzie CNAME | 2026-07-25 |
| S-073 | IETF RFC 1035, https://www.rfc-editor.org/rfc/rfc1035.html | budowa pytania i odpowiedzi DNS, pola QNAME, QTYPE i QCLASS oraz znaczenie kodów NOERROR, SERVFAIL i NXDOMAIN | 2026-07-25 |
| S-074 | IETF RFC 2308 oraz aktualizacja RFC 9520, https://www.rfc-editor.org/rfc/rfc2308.html, https://www.rfc-editor.org/rfc/rfc9520.html | rozróżnienie NXDOMAIN od NOERROR bez danych żądanego typu, SOA i TTL odpowiedzi negatywnej oraz przechowywanie błędów rozwiązywania | 2026-07-25 |
| S-075 | IETF RFC 8499, https://www.rfc-editor.org/rfc/rfc8499.html | współczesna terminologia DNS, odpowiedzi pozytywne i negatywne oraz rozróżnienie kodów odpowiedzi | 2026-07-25 |
| S-076 | IETF RFC 2606, https://www.rfc-editor.org/rfc/rfc2606.html | domena `.example` przeznaczona do dokumentacji i przykładów | 2026-07-25 |
| S-077 | IETF RFC 9112, https://www.rfc-editor.org/rfc/rfc9112.html | składnia żądania HTTP/1.1, request-target, wymaganie pola Host i znaczenie authority przy kierowaniu żądania | 2026-07-25 |
| S-078 | IETF RFC 9114, https://www.rfc-editor.org/rfc/rfc9114.html | zachowanie semantyki HTTP w HTTP/3, QUIC jako transport oraz niezależne strumienie żądań i odpowiedzi | 2026-07-25 |
| S-079 | IETF RFC 894, https://www.rfc-editor.org/rfc/rfc894.html | przenoszenie datagramu IPv4 w danych ramki Ethernet, EtherType `0x0800` oraz lokalne mapowanie adresu IP na adres Ethernet | 2026-07-25 |

## Decyzje redakcyjne po kontroli

1. Usunięto twierdzenie, że pakiety tej samej wiadomości standardowo idą różnymi trasami. RFC 1122 wskazuje, że w danym momencie zwykle korzystają z tej samej ścieżki, choć ścieżka może się zmieniać, a kierunki mogą być asymetryczne.
2. Usunięto sugestię, że sam podział na pakiety zapewnia ponowienie utraconych danych. IP nie zapewnia niezawodności; retransmisję realizuje na przykład TCP.
3. Usunięto klasyfikację PAN/LAN/MAN/WAN z pierwszej lekcji. Nie była potrzebna do zbudowania podstawowego modelu komunikacji i wprowadzała nieostre kryteria zasięgu.
4. Usunięto modele klient-serwer, P2P i hybrydowy. Należą do organizacji usług i wymagają wcześniejszego rozróżnienia hosta, usługi oraz drogi sieciowej.
5. Usunięto anegdotę ARPANET. Była prawdziwa w ogólnym zarysie, lecz nie wspierała umiejętności ocenianej w lekcji.
6. Wprowadzono ścisłe rozróżnienie łącza, protokołu, hosta i urządzenia pośredniczącego.

## Kontrola lekcji o transmisji danych

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit, bajt i potęgi dwójki | `ZNANY` | kurs `binarne-fundamenty-it` |
| łącze i sygnał fizyczny | `ZNANY` | poprzednia lekcja, sekcja „Połączenie przenosi sygnał” |
| dzielenie jednostek i przeliczanie sekund | `ZNANY` | kurs binarny wykorzystuje obliczenia szybkości transmisji |
| symbol | `WPROWADZANY` | sekcja „Trzy poziomy jednej transmisji” |
| próg decyzji odbiornika | `WPROWADZANY` | przykład z wartościami dydaktycznymi |
| faza fali | `POMOCNICZY` | krótkie objaśnienie przy QPSK; nie jest wymagana w zadaniach |
| tłumienie, zakłócenie, zniekształcenie | `WPROWADZANY` | sekcja „Co niszczy czytelność sygnału” |
| szybkość symbolowa i goodput | `WPROWADZANY` | definicje oraz obliczenie w lekcji |
| serializacja, propagacja, przetwarzanie, kolejka | `WPROWADZANY` | osobne podsekcje z przykładami |

Wynik bramki zależności: brak pozycji `LUKA` dla pytań i ćwiczeń.

### Wprowadzone korekty

1. Rozdzielono informację cyfrową, symbole i mierzalny sygnał fizyczny.
2. Usunięto model utożsamiający bit z jednym z dwóch idealnych napięć.
3. Pokazano, że technologia może kodować dane binarne przy użyciu więcej niż dwóch symboli.
4. Zastąpiono twierdzenie o pełnym usuwaniu szumu modelem decyzji odbiornika. Błędna decyzja może zostać zregenerowana jako błędny bit.
5. Usunięto nieostre porównanie „analogowe kontra cyfrowe” oraz twierdzenie, że sygnał analogowy pojawia się tylko w modemach.
6. Usunięto sekcję ADC/DAC i twierdzenie Nyquista, ponieważ nie wspierały umiejętności przesyłania bitów przez łącze i wymagały dodatkowych fundamentów.
7. Rozdzielono szybkość bitową, szybkość symbolową i goodput.
8. Zamiast deklarować niezależność opóźnienia od szybkości, rozłożono opóźnienie na propagację, serializację, przetwarzanie i kolejkę.

Status lekcji: `po kontroli źródłowej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o mediach transmisyjnych

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit, symbol i sygnał fizyczny | `ZNANY` | lekcja `Transmisja danych - analogowa i cyfrowa` |
| tłumienie, zakłócenie i goodput | `ZNANY` | lekcja `Transmisja danych - analogowa i cyfrowa` |
| łącze i urządzenie pośredniczące | `ZNANY` | lekcja `Czym jest sieć komputerowa` |
| kanał jako cały tor transmisyjny | `WPROWADZANY` | sekcja „Kategoria nie jest obietnicą dla samego kabla” |
| sygnał różnicowy i zrównoważenie par | `WPROWADZANY POMOCNICZO` | sekcja o miedzi; brak obliczeń w zadaniach |
| budżet strat i dyspersja | `WPROWADZANY` | sekcja o światłowodzie; bez obliczeń optycznych |
| współdzielenie medium radiowego | `WPROWADZANY` | sekcja o falach radiowych |

Wynik bramki zależności: zadanie wymaga rozpoznania ograniczeń, a nie pamięci katalogowych zasięgów.

### Wprowadzone korekty

1. Usunięto tabelę maksymalnych szybkości kategorii przewodów. Zastąpił ją model całego kanału i konkretnego wariantu Ethernet.
2. Usunięto powiązanie limitu 100 m z kolizjami CSMA/CD. Parametry kanału obejmują między innymi straty, odbicia, przesłuchy i szum.
3. Ekranowanie opisano jako element systemu zależny od konstrukcji oraz instalacji, a nie automatyczną gwarancję odporności.
4. Usunięto fałszywe twierdzenie o braku tłumienia w światłowodzie. Dodano tłumienie, dyspersję, budżet strat i zgodność modułów.
5. Usunięto uniwersalne zasięgi przypisane samym nazwom `MMF` i `SMF`. Zasięg zależy od kompletnego wariantu optycznego.
6. Usunięto tabelę teoretycznych szybkości generacji Wi-Fi oraz kategoryczne porównania pasm. Wprowadzono współdzielenie medium i czynniki wpływające na goodput.
7. Usunięto twierdzenie, że pasmo 6 GHz jest zupełnie puste. Dostęp zależy od regulacji i współistnienia z innymi zastosowaniami.
8. Zadanie końcowe wymaga uzasadnienia decyzji czterema ograniczeniami oraz wskazania zgodności końców łącza.

Status lekcji: `po kontroli źródłowej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o modelu OSI

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit, symbol, sygnał i medium | `ZNANY` | moduł 0 |
| host, łącze, protokół i urządzenie pośredniczące | `ZNANY` | lekcja `Czym jest sieć komputerowa` |
| warstwa i granica usługi | `WPROWADZANY` | sekcja „OSI porządkuje pytania, nie daje diagnozy” |
| TCP i UDP | `WPROWADZANY` | właściwości obu usług wyjaśnione przed użyciem diagnostycznym |
| ICMP Echo | `WPROWADZANY POMOCNICZO` | krótka definicja przed pierwszym zadaniem; budowa protokołu nie jest wymagana |
| sesja i reprezentacja danych | `WPROWADZANY POMOCNICZO` | pytania w mapie zakresów OSI; pojęcia nie są wymagane w zadaniu końcowym |

Wynik bramki zależności: brak pozycji `LUKA`. Quiz wymaga oceny zakresu dowodu, nie znajomości konfiguracji DNS, ICMP ani SSH.

### Wprowadzone korekty

1. Zastąpiono historię o niekompatybilnych sieciach producentów udokumentowanym celem modelu: wspólną podstawą koordynacji standardów.
2. Wyjaśniono, że ISO/IEC 7498-1 jest modelem odniesienia, a nie specyfikacją siedmiu obowiązkowych modułów programu.
3. Usunięto podział „warstwy 1-3 to infrastruktura, 4-7 to aplikacje”, który nie odpowiada zakresom usług w X.200.
4. Warstwie fizycznej nie przypisano idealnych napięć oznaczających bezpośrednio `0` i `1`; model korzysta z fundamentu bit, symbol, sygnał.
5. Warstwa łącza nie gwarantuje już niezawodności każdej ramki. X.200 dopuszcza wykrywanie i możliwą korekcję zależnie od usługi.
6. Usunięto fragmentację jako ogólną obowiązkową funkcję routera. W IPv6 fragmentuje źródło, nie router po drodze.
7. UDP opisano przez brak gwarancji dostarczenia i ochrony przed duplikatami, bez fałszywego skrótu „szybsze dostarczanie”.
8. Usunięto twierdzenia, że TCP realizuje warstwę sesji, a TLS warstwę transportową. Mapowanie protokołów internetowych na OSI pozostaje przybliżeniem.
9. Enkapsulacja nie zakłada już osobnego nagłówka każdej z siedmiu warstw ani zakazu inspekcji wyższych informacji przez urządzenia pośredniczące.
10. Działający ping jest dowodem dla konkretnej wymiany ICMP w danym czasie, a nie dowodem sprawności wszystkich funkcji warstw 1-3.
11. Zadanie końcowe wymaga zapisania obserwacji, granicy wniosku i testu rozdzielającego możliwe przyczyny.
12. Po dodatkowej kontroli dydaktycznej przebudowano lekcję z ekspozycji siedmiu warstw na pętlę: przewidywanie, granica dowodu, demonstracja toku diagnostycznego, korekta zbyt szerokiego wniosku i transfer na nowym przypadku.
13. Tabela warstw pełni funkcję klasyfikatora. Uczeń zakrywa kolumny, odtwarza relację i używa jej do wyboru pytania; nie jest ona materiałem do biernego zapamiętania.
14. Zadanie transferowe wymaga dwóch hipotez dających się rozróżnić przez test oraz obrony wniosku przed inną osobą.

### Kontrola techniczna i dostępności

- Kompilacja pojedynczego kursu: zaliczona.
- Audyt szkicu: `0 błędów`; ostrzeżenia dotyczą pozostałych, jeszcze niezweryfikowanych lekcji i niespójnego wpisu `TCP/IP` w indeksie.
- Testy renderowania i quizu: zaliczone, łącznie 15 testów w sprawdzonych zestawach po dodaniu dwóch przypadków klawiaturowych.
- Aktywacja poprawnej odpowiedzi kliknięciem, klawiszem Enter i spacją: zaliczona w widoku przeglądarkowym.
- Widok 390 × 844 px: brak poziomego przepełnienia całej strony; szeroka tabela ma własne przewijanie poziome.
- Konsola przeglądarki podczas przepływu: brak ostrzeżeń i błędów.
- Czytelność dla osób z dysleksją: zastosowano krótkie odcinki pracy, stałą sekwencję obserwacja → granica → test, jawne kryteria i brak oceny pisowni. Wymaga jeszcze próby z odbiorcami.

Status lekcji: `po kontroli źródłowej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o warstwie fizycznej i łącza danych

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit, symbol, sygnał i medium | `ZNANY` | lekcje `Transmisja danych - analogowa i cyfrowa` oraz `Media transmisyjne - kable i fale` |
| warstwa fizyczna i warstwa łącza | `ZNANY` | lekcja `Siedem warstw - wielki obraz` |
| ramka i przełącznik | `WPROWADZONY WCZEŚNIEJ` | lekcja `Czym jest sieć komputerowa`; bez wcześniejszego wymagania adresów MAC |
| PHY | `WPROWADZANY POMOCNICZO` | definicja jako fizyczna część konkretnej odmiany Ethernetu |
| adres źródłowy i docelowy MAC | `WPROWADZANY` | ramka oraz osobne kroki uczenia i przekazywania |
| unicast i broadcast | `WPROWADZANY` | definicja jednego odbiorcy oraz adres grupowy przed użyciem w zadaniach |
| FCS i CRC | `WPROWADZANY POMOCNICZO` | wykrywanie uszkodzonej ramki bez obliczeń CRC |
| tablica przekazywania i starzenie | `WPROWADZANY` | symulacja kolejnych stanów przełącznika |
| VLAN | `POMOCNICZY` | krótka nazwa logicznego segmentu; wszystkie ćwiczenia jawnie zakładają jeden segment |

Wynik bramki zależności: brak pozycji `LUKA`. Zadanie wymaga jedynie wcześniejszego rozumienia sygnału, ramki i roli przełącznika.

### Wprowadzone korekty

1. Usunięto katalog wariantów Ethernetu i zasięgów. Powtarzał materiał o mediach i zachęcał do pamięciowego dopasowywania liczb zamiast pracy na wymaganiach konkretnego PHY.
2. Usunięto historię Ethernetu oraz statystyki typowych szybkości portów. Nie wspierały ocenianej umiejętności i szybko tracą aktualność.
3. Usunięto listę trybów simplex, half-duplex i full-duplex oraz osobne omówienie CSMA/CD i CSMA/CA. Wymagały dodatkowych modeli, a nie były używane w zadaniu końcowym.
4. Zrezygnowano z reguły „pierwsze trzy oktety oznaczają producenta”. RFC 9542 opisuje różne długości przydziałów oraz adresy lokalnie administrowane.
5. Nie przedstawiono 1500 bajtów jako uniwersalnego MTU całej warstwy drugiej ani FCS jako mechanizmu naprawy lub retransmisji.
6. Usunięto fałszywy wpis `FF:FF:FF:FF:FF:FF → ALL` z tablicy przełącznika. Adres grupowy nie jest uczony jako źródłowy adres portu.
7. Zastąpiono rzekomy uniwersalny `TTL 300 s` konfigurowalnym starzeniem wpisów dynamicznych.
8. Usunięto absolutne twierdzenie, że przełącznik wyklucza wszystkie kolizje. Standard 802.3 nadal opisuje zarówno współdzielony tryb half-duplex, jak i full-duplex; nie było to potrzebne do ćwiczenia.
9. VLAN-y pozostawiono wyłącznie jako jawne ograniczenie uproszczonego modelu. Nie udają osobnej, pobieżnej lekcji na końcu pliku.
10. Rdzeń dydaktyczny oparto na zmianie stanu tablicy. Uczeń osobno śledzi źródło, cel, port wejściowy, porty wyjściowe i wynik po każdej ramce.
11. Przypadek transferowy zmienia stan przez starzenie wpisu, więc nie da się go zaliczyć przez skopiowanie pierwszej demonstracji.

### Kontrola techniczna i dostępności

- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Pozostałe 68 ostrzeżeń należy do dalszej kolejki kontroli kursu.
- Testy renderowania i quizu: 15/15 zaliczone.
- Quiz: poprawna odpowiedź działa klawiszem Enter, ustawia stan tekstowy i odblokowuje zadanie transferowe.
- Rozwiązanie zadania: domyślnie zwinięte, po rozwinięciu zawiera pełne stany trzech ramek oraz wariant ze zestarzonym wpisem.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; bloki tekstowe mieszczą się w kolumnie.
- Konsola podczas przepływu: brak ostrzeżeń i błędów.
- Natywne `<details>/<summary>` wymaga jeszcze ręcznego potwierdzenia klawiaturą poza automatyzacją. Narzędzie testowe nie wywołało domyślnej akcji Enter ani spacji na skupionym elemencie `summary`, choć kliknięcie i treść działają.

Status lekcji: `po kontroli źródłowej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o IP i routingu

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| pakiet, router i urządzenie pośredniczące | `ZNANY` | lekcje `Czym jest sieć komputerowa` oraz `Siedem warstw - wielki obraz` |
| ramka i lokalny adres docelowy | `ZNANY` | lekcja `Warstwa fizyczna i łącza danych` |
| bit, oktet i 32 bity | `ZNANY` | kurs `binarne-fundamenty-it`; cztery oktety IPv4 są pokazane przed zadaniem |
| adres IPv4 | `WPROWADZANY` | definicja adresu logicznego interfejsu i zapis czterech oktetów |
| prefiks CIDR `/8`, `/16`, `/24` | `WPROWADZANY` | zbiory pokazane na granicach pełnych oktetów przed pierwszą decyzją |
| najdłuższe pasujące dopasowanie | `WPROWADZANY` | demonstracja dla trzech nakładających się prefiksów i `/0` |
| następny router i interfejs wyjściowy | `WPROWADZANY` | osobne rozróżnienie celu bezpośredniego i celu przez sąsiedni router |
| maska binarna, obliczenia podsieci, ARP, NAT | `ODROCZONY` | nie są wymagane w quizie ani zadaniu transferowym; mają osobne późniejsze lekcje |

Wynik bramki zależności: brak pozycji `LUKA`. Zadania korzystają wyłącznie z prefiksów na granicach oktetów, więc nie wymagają nieprzećwiczonego subnettingu.

### Wprowadzone korekty

1. Zastąpiono przegląd adresów prywatnych, NAT, nagłówka IPv4, TTL i protokołów dynamicznych jedną umiejętnością: wyborem następnego kroku z tablicy routingu.
2. Adres IP przypisano do logicznego interfejsu w danym kontekście, a nie przedstawiono jako globalnej i stałej nazwy całego hosta.
3. Nie powtórzono reguły o zawsze stałym adresie MAC ani prostego podziale „MAC od producenta, IP od administratora”. Wcześniejsza lekcja pokazuje adresy lokalnie administrowane i zmienne.
4. Prefiks wprowadzono jako zbiór adresów. Uczeń najpierw sprawdza każde dopasowanie, a dopiero potem porównuje długości.
5. Trasy domyślnej nie utożsamiono z Internetem. Jest wpisem `/0`, który pasuje do każdego celu, lecz przegrywa z bardziej szczegółowym dopasowaniem.
6. Rozdzielono końcowy adres IP, następny router oraz interfejs wyjściowy. Router podejmuje decyzję o następnym kroku, nie zapisuje całej drogi pakietu w pojedynczym wpisie.
7. Zmianę ramki na kolejnych łączach opisano bez przedwczesnego wymagania mechaniki ARP. Jawnie ograniczono przykład do przypadku bez translacji i tunelowania.
8. Dodano przypadek braku trasy. Bez dopasowania i bez `/0` urządzenie nie próbuje losowo kolejnych interfejsów.
9. Quiz wymaga odrzucenia dłuższego, ale niepasującego `/24`. Dzięki temu nie da się go zaliczyć samą regułą „wybierz największą liczbę”.
10. Zadanie transferowe wymaga czterech pełnych decyzji, listy dopasowań i uzasadnienia. Zmieniony stan usuwa trasę domyślną i dodaje nowy prefiks właściwy.
11. Rozwiązanie pozostaje ukryte do samodzielnej próby i pokazuje punkt, w którym typowe błędne dopasowanie zmienia wynik.

### Kontrola dydaktyczna i dostępności

- Rdzeń lekcji tworzy pętlę: przewidywanie, sprawdzenie zbiorów, zastosowanie reguły, rozróżnienie następnego kroku i transfer na zmienionej tablicy.
- Bloki z wpisami pełnią funkcję danych roboczych. Uczeń zaznacza dopasowania i wyprowadza decyzję, więc nie są katalogiem do zapamiętania.
- Krótkie akapity, stałe nazwy pól oraz powtarzana sekwencja `dopasowania -> najdłuższy prefiks -> następny krok` ograniczają obciążenie pamięci roboczej.
- Kryteria oceniają decyzję i uzasadnienie, nie pisownię ani tempo czytania.
- Nie użyto diagramu Mermaid, ponieważ kompilator kursu nie ma jeszcze potwierdzonego renderowania tej składni. Zależność między łączami opisano tekstowym stanem alternatywnym.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Pozostałe 61 ostrzeżeń należy do dalszej kolejki kontroli kursu.
- Quiz: poprawna odpowiedź działa klawiszem Enter, wyłącza odpowiedzi i odblokowuje zadanie transferowe.
- Usunięto błąd widoczny dopiero po renderowaniu: strzałki zapisane w tagach quizu pojawiały się jako dosłowny tekst `-&gt;`.
- Rozwiązanie zadania jest początkowo zwinięte. Po rozwinięciu zawiera wyniki czterech celów oraz zmienionego przypadku.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu. Dłuższe bloki kodu mają własne przewijanie poziome.
- Konsola przeglądarki podczas przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o TCP i UDP

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| pakiet, adres IP i interfejs | `ZNANY` | lekcja `Warstwa sieciowa - IP i routing` |
| strata i zmiana kolejności pakietów | `ZNANY` | lekcja `Czym jest sieć komputerowa` oraz model zawodnej usługi IP |
| TCP jako strumień niezawodny i UDP jako datagramy | `WPROWADZONY POMOCNICZO` | lekcja `Siedem warstw - wielki obraz`; tutaj właściwości są ćwiczone |
| port źródłowy i docelowy | `WPROWADZANY` | sekcja o rozdzielaniu punktów komunikacji |
| strumień bajtów i granice wiadomości | `WPROWADZANY` | demonstracja dwóch zapisów i jednego odczytu TCP |
| numer sekwencji aplikacji | `WPROWADZANY` | narzędzie do odrzucania starych oraz zduplikowanych datagramów |
| kontrola przeciążenia | `WPROWADZANY POMOCNICZO` | ograniczenie projektu UDP; bez wymagania implementacji algorytmu |
| handshake, stany TCP, MSS i budowa nagłówków | `ODROCZONY` | nie są potrzebne do ocenianej decyzji o kontrakcie odbioru |

Wynik bramki zależności: brak pozycji `LUKA`. Zadanie wymaga rozumienia skutków straty dla aplikacji, nie pamięci pól nagłówka ani numerów portów usług.

### Wprowadzone korekty

1. Usunięto katalog zakresów portów i popularnych numerów. Port przedstawiono jako część identyfikacji komunikacji, a nie trwały numer procesu.
2. Usunięto absolutne powiązanie numeru portu z aplikacją i bezpieczeństwem. Numer może wskazywać zarejestrowaną usługę, lecz sam nie dowodzi treści ani szyfrowania.
3. Zastąpiono hasło „TCP gwarantuje dane” precyzyjnym kontraktem niezawodnego, uporządkowanego strumienia bajtów.
4. Dodano brak zachowania granic operacji zapisu przez TCP. Quiz sprawdza właśnie tę często pomijaną właściwość.
5. UDP opisano przez zachowanie granic datagramów oraz brak gwarancji dostarczenia i ochrony przed duplikatami. Nie nazwano go automatycznie szybszym.
6. Usunięto twierdzenie, że TCP zawsze zatrzymuje całą transmisję sieciową. Lekcja mówi o wstrzymaniu przekazania późniejszych bajtów do aplikacji do czasu uzupełnienia luki w strumieniu.
7. Nie przedstawiono braku kontroli przepływu UDP jako prawa do wysyłania z dowolną szybkością. Dodano odpowiedzialność za kontrolę przeciążenia.
8. Usunięto katalog DNS, DHCP, gier, wideo i baz danych. Nazwa zastosowania nie zastępuje analizy wymagań odbioru.
9. QUIC wykorzystano jako kontrprzykład dla fałszywej osi „TCP niezawodne, UDP szybkie”. Protokół oparty na UDP może dodać niezawodne strumienie i kontrolę przeciążenia.
10. Usunięto handshake, zamknięcie, tabelę stanów, nagłówki i stałe MSS. Nie były używane w zadaniu i zawierały zależne od implementacji uproszczenia.
11. Zadanie transferowe porównuje sterowanie wymagające kolejności z aktualizacją stanu, która traci wartość po czasie. Zmieniony warunek audytu wymusza ponowną ocenę projektu.

### Kontrola dydaktyczna i dostępności

- Uczeń najpierw przewiduje obserwację po stracie, następnie porównuje strumień i datagram, a na końcu projektuje reakcję dwóch aplikacji.
- Listy są formularzem decyzji: wymagają wpisania kontraktu, danych pomocniczych i reakcji na trzy rodzaje zakłóceń.
- Sekwencja `kontrakt -> transport -> odpowiedzialność aplikacji` pozostaje stała w demonstracji, quizie i transferze.
- Rozwiązanie jest ukryte do samodzielnej próby i nie ocenia pisowni ani znajomości angielskich rozwinięć skrótów.
- Audyt szkicu po przebudowie: `0 błędów`; lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 61 do 54 ostrzeżeń.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Quiz: poprawna odpowiedź działa klawiszem Enter, wyłącza odpowiedzi i odblokowuje zadanie transferowe.
- Przed zaliczeniem quizu zadanie oraz rozwiązanie są niewidoczne. Rozwiązanie pozostaje zwinięte po odblokowaniu i rozwija się na żądanie.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu, a wszystkie odpowiedzi mieszczą się w granicach ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o warstwach sesji, prezentacji i aplikacji

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| model OSI jako zakres pytań | `ZNANY` | lekcja `Siedem warstw - wielki obraz` |
| transport, strumień TCP i port | `ZNANY` | lekcja `Warstwa transportowa - TCP i UDP` |
| UTF-8 | `WPROWADZANY` | rozdzielenie bajtów, znaków i struktury przed pierwszym zadaniem |
| składnia JSON i parser | `WPROWADZANY` | dwa dokumenty pokazujące błąd gramatyki oraz błąd reguły usługi |
| stan rozmowy i identyfikator sesji | `WPROWADZANY` | przykład rozpoczęcia i zatwierdzenia importu w kontekście `S7` |
| kontrakt aplikacji | `WPROWADZANY` | wymagane pole oraz bezpieczny zakres wartości w zadaniu transferowym |
| HTTP 400 i 401 | `POMOCNICZY` | krótkie ograniczenie zakresu wniosku, bez pamięciowego wymagania kodów |
| szczegóły handshake TLS i katalog protokołów aplikacyjnych | `ODROCZONY` | nie są potrzebne do lokalizowania pierwszej niepotwierdzonej granicy |

Wynik bramki zależności: brak pozycji `LUKA`. Uczeń pracuje na jawnych logach i kontrakcie, nie musi znać wcześniej JSON ani kodów HTTP.

### Wprowadzone korekty

1. Usunięto trzy katalogi funkcji i protokołów przypisanych do warstw 5, 6 i 7. Zastąpiły je pytania o reprezentację, ciągłość rozmowy oraz znaczenie operacji.
2. Nie przedstawiono warstw jako obowiązkowych osobnych modułów programu. ISO/IEC 7498-1 jest modelem odniesienia, a stos internetowy organizuje funkcje inaczej.
3. Usunięto mapowanie TLS do warstwy 5 albo 6 jako jedyną poprawną odpowiedź. TLS, HTTP, JSON i stan aplikacji nie tworzą relacji jeden do jednego z warstwami OSI.
4. Rozdzielono cztery dowody: dostarczenie bajtów, ochronę kanału, dekodowanie UTF-8 i parsowanie JSON.
5. Poprawny JSON nie jest traktowany jako dowód zgodności z kontraktem usługi. Typ pola, wymagane pola oraz zakres wartości należą do reguł konkretnej aplikacji.
6. Sesji aplikacyjnej nie utożsamiono z jednym połączeniem TCP. Jej kontekst może obejmować kilka wymian i połączeń.
7. Usunięto katalog HTTP, DNS, SMTP, IMAP, FTP, SSH, DHCP i SNMP. Nie wspierał umiejętności ocenianej w lekcji.
8. Usunięto uproszczony przebieg HTTPS, który mieszał kolejność DNS, TCP, TLS, IP i Ethernetu oraz wymagał nieprzećwiczonych szczegółów.
9. Usunięto końcową tabelę siedmiu warstw. Powtarzała poprzednią lekcję i zachęcała do pamięciowego przypisywania protokołów.
10. Quiz wymaga utrzymania granicy wniosku po kilku potwierdzonych krokach. Zadanie transferowe wymaga wskazania ostatniego sukcesu, pierwszego błędu, testu i naprawy.
11. Zmieniony przypadek zachowuje ten sam dokument jako poprawny JSON, lecz usuwa wymagane pole. Uczeń musi przesunąć diagnozę z reprezentacji do kontraktu aplikacji.

### Kontrola dydaktyczna i dostępności

- Rdzeń lekcji ma stały rytm: ostatni potwierdzony krok, pierwsza porażka, dowód, następny test.
- Przykłady A do D różnią się jedną granicą, co pozwala ćwiczyć rozróżnianie bez jednoczesnego wprowadzania dodatkowych protokołów.
- Bloki danych służą do klasyfikacji i wyboru testu. Nie są listą informacji do odtworzenia z pamięci.
- Tekst używa krótkich akapitów, stałych nazw i jawnego kontraktu wejściowego. Pisownia oraz tempo czytania nie są kryterium zadania.
- Nie użyto Mermaid, ponieważ kompilator nadal nie ma potwierdzonego renderowania diagramów. Łańcuch dowodów ma tekstową postać liniową.
- Audyt szkicu po przebudowie: `0 błędów`; lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 54 do 49 ostrzeżeń.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Quiz: poprawna odpowiedź działa klawiszem spacji, kończy próbę i odblokowuje zadanie transferowe.
- Przed zaliczeniem quizu zadanie oraz rozwiązanie są niewidoczne. Rozwiązanie pozostaje zwinięte po odblokowaniu i zawiera wszystkie cztery raporty oraz zmieniony przypadek.
- Przykłady JSON zachowują cudzysłowy, przecinki i strukturę po renderowaniu.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu, a odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o modelach OSI i TCP-IP

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| obserwacja, ostatni sukces i pierwszy brak powodzenia | `ZNANY` | lekcje `Siedem warstw - wielki obraz` oraz `Warstwy sesji, prezentacji i aplikacji` |
| ramka, adres IP, trasa i segment TCP | `ZNANY` | wcześniejsze lekcje modułu 1 |
| siedem warstw OSI | `ZNANY` | lekcja `Siedem warstw - wielki obraz` |
| cztery warstwy architektury internetowej | `WPROWADZANY` | układ z RFC 1122 pokazany przed pierwszym tłumaczeniem diagnozy |
| przybliżone przejście między modelami | `WPROWADZANY` | mapa pytań i dwa opisy tego samego braku trasy |
| status oraz zastępowanie dokumentów RFC | `WPROWADZANY POMOCNICZO` | procedura sprawdzenia aktualnej specyfikacji z przykładami TCP i HTTP |
| szczegółowa klasyfikacja wszystkich protokołów | `ODROCZONY` | nie jest wymagana do zachowania granicy dowodu ani do zadania transferowego |

Wynik bramki zależności: brak pozycji `LUKA`. Nowa umiejętność polega na zmianie języka opisu, a nie na ponownym uczeniu działania ramki, routingu lub transportu.

### Wprowadzone korekty

1. Usunięto opowieść o rywalizacji modeli oraz hasło, że jeden model „wygrał”. Nie pomagały przełożyć obserwacji na granice diagnostyczne.
2. Zastąpiono dokładne mapowanie pudełek przejściem przybliżonym. ISO/IEC 7498-1 jest modelem odniesienia, a RFC 1122 organizuje wymagania hosta internetowego w czterech warstwach.
3. Nie przedstawiono warstw OSI 5, 6 i 7 jako zaginionych elementów prawdziwego stosu. Architektura internetowa grupuje te pytania szerzej w warstwie aplikacji.
4. Rozdzielono nazwę zakresu od diagnozy. Uczeń musi zachować pozytywny dowód, pierwszą porażkę i część jeszcze nieprzetestowaną.
5. Ten sam brak trasy opisano w obu językach. Zmiana słownika nie może zmienić obserwacji ani rozszerzyć wniosku.
6. ARP, TLS i QUIC służą tylko jako kontrprzykłady dla sztywnego przypisywania protokołu do jednego pola. Nie tworzą katalogu do zapamiętania.
7. Usunięto listę historycznych dokumentów RFC. Zastąpiła ją procedura sprawdzania tytułu, statusu, zakresu oraz informacji o zastąpieniu lub aktualizacji.
8. Poprawiono rodowód specyfikacji: RFC 9293 zastępuje RFC 793, natomiast RFC 9110 jest aktualną specyfikacją semantyki HTTP bez sugerowania, że bezpośrednio zastąpiło RFC 2616.
9. Quiz sprawdza zachowanie całego łańcucha dowodów po braku trasy. Sama znajomość numerów warstw nie wystarcza do wyboru odpowiedzi.
10. Zadanie transferowe obejmuje cztery różne granice awarii, a zmieniony przypadek wymaga odróżnienia błędu reprezentacji od reguły aplikacji.

### Kontrola dydaktyczna i dostępności

- Stały formularz `obserwacja -> ostatni potwierdzony zakres -> pierwszy brak powodzenia -> następny test` prowadzi ucznia przez każdy przypadek.
- Mapa tekstowa służy tłumaczeniu pytań między modelami. Nie jest tabelą równoważności ani materiałem do mechanicznego odtworzenia.
- Krótkie akapity, powtarzalne pola odpowiedzi i pojedyncza zmiana między przypadkami ograniczają obciążenie pamięci roboczej.
- Kryteria oceniają granicę wniosku oraz jakość następnego testu. Nie oceniają pisowni, tempa czytania ani pamięci numerów RFC.
- Nie użyto Mermaid, ponieważ kompilator kursu nadal nie ma potwierdzonego renderowania tej składni. Relację pokazano w dostępnej postaci tekstowej.
- Rozwiązanie pozostaje ukryte do samodzielnej próby i omawia również zmieniony przypadek.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Pozostałe 43 ostrzeżenia należą do dalszej kolejki przebudowy.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie transferowe nie występuje w drzewie dostępności. Poprawna odpowiedź aktywowana spacją odblokowuje zadanie i pokazuje tekstowy komunikat powodzenia.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera odpowiedzi dla czterech incydentów oraz zmienionego przypadku z błędem JSON.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie cztery odpowiedzi quizu mieszczą się między krawędziami ekranu.
- Usunięto nieobsługiwaną etykietę `text` z bloków kodu. Ponowne otwarcie lekcji nie generuje ostrzeżeń ani błędów konsoli.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o adresowaniu IPv4

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit, oktet i zapis binarny liczby od 0 do 255 | `ZNANY` | kurs `binarne-fundamenty-it`; lekcja przypomina znaczenie czterech oktetów |
| adres IPv4 jako adres logiczny interfejsu | `ZNANY` | lekcja `Warstwa sieciowa - IP i routing` |
| prefiksy `/8`, `/16` i `/24` jako zbiory adresów | `ZNANY` | lekcja `Warstwa sieciowa - IP i routing` |
| maska binarna oraz operacja AND | `WPROWADZANY` | demonstracja ostatniego oktetu dla `192.0.2.130/26` |
| adres sieci i broadcast | `WPROWADZANY` | wyprowadzenie początku oraz końca jednego bloku przed quizem |
| dawne klasy A, B i C | `WPROWADZANY POMOCNICZO` | tylko jako historyczna reguła, której nie wolno użyć zamiast jawnego prefiksu |
| planowanie i dzielenie puli na kilka podsieci | `ODROCZONY` | następna lekcja o subnettingu |
| pełny rejestr adresów specjalnego przeznaczenia | `ODROCZONY` | nie jest potrzebny do wyznaczania granic podanego prefiksu |

Wynik bramki zależności: brak pozycji `LUKA`. Uczeń potrzebuje podstaw zapisu binarnego z kursu zależnego, ale operację AND oraz role adresów granicznych ćwiczy od początku w tej lekcji.

### Wprowadzone korekty

1. Usunięto tabelę klas A do E. Dawne klasy pozostały jako jedna pułapka diagnostyczna: pierwszy oktet nie zastępuje jawnej długości prefiksu.
2. Usunięto tabelę popularnych masek i „typowych zastosowań”. Uczeń wyprowadza wynik z bitów konkretnego adresu, a nie dopasowuje go do zapamiętanego wiersza.
3. Zastąpiono ogólny wykład o budowie IPv4 jedną sprawnością: wyznaczeniem sieci, broadcastu, zakresu hostów i poprawności adresu interfejsu.
4. Adres analizowany jest zawsze razem z prefiksem. Lekcja nie sugeruje, że sam adres ujawnia granicę podsieci.
5. Operację AND pokazano na jednym zmieniającym się oktecie. Pozostałe trzy oktety nie obciążają zapisu, ale wynik nadal wynika z bitów.
6. Usunięto uniwersalną regułę `2^(32-prefiks)-2`. Jest poprawna dla ćwiczonych zwykłych podsieci z broadcastem, lecz nie dla łączy punkt do punktu `/31` ani pojedynczego adresu `/32`.
7. Dodano przypadek transferowy `/31`, aby uczeń musiał rozpoznać granicę zastosowania poznanej procedury.
8. Usunięto katalog adresów prywatnych, link-local, loopback, multicast i przestrzeni współdzielonej. Nie był używany przez ocenianą umiejętność i mieszał kilka przyszłych tematów.
9. Usunięto listę poleceń Linuksa i Windows bez zadania na ich wyniku. Raport ucznia ma teraz stałe pola, które pozwalają sprawdzić tok rozumowania.
10. Wszystkie przykłady używają bloków TEST-NET przeznaczonych przez RFC 5737 do dokumentacji.
11. Quiz zmienia prefiks na `/27`, a zadanie na `/28` i `/26`. Nie da się zaliczyć ich przez przepisanie demonstracji dla `/26`.

### Kontrola dydaktyczna i dostępności

- Lekcja zaczyna się prognozą, do której uczeń wraca po obliczeniu. Błąd staje się informacją o niezrozumianej granicy, a nie oceną pamięci.
- Stała procedura `adres/prefiks -> AND -> sieć -> broadcast -> ocena adresu` jest powtarzana w demonstracji, quizie i transferze.
- Zapis binarny ogranicza się do oktetu, w którym przebiega granica. Krótkie wiersze i wyrównane pola ułatwiają śledzenie bitów osobom z dysleksją.
- Listy pełnią rolę instrukcji wykonania i kryteriów oceny. Każdy punkt odpowiada działaniu lub dowodowi w raporcie.
- Nie użyto tabeli dydaktycznej ani Mermaid. Relacja jest liniowa i mieści się w dostępnym bloku tekstowym; diagram nie skróciłby procesu wnioskowania.
- Rozwiązanie jest ukryte do samodzielnej próby i wyjaśnia także przypadek, w którym poznana wcześniej reguła przestaje działać.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 43 do 37 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie transferowe nie występuje w drzewie dostępności. Enter na poprawnej odpowiedzi pokazuje komunikat tekstowy i odblokowuje zadanie.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera wyniki A do C oraz poprawne rozumowanie dla `/31`.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi quizu mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o projektowaniu podsieci

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| para `adres/prefiks`, adres sieci i koniec bloku | `ZNANY` | lekcja `Adresowanie IPv4 - budowa i klasy` |
| liczba bitów lokalnych i rozmiar bloku | `ZNANY` | lekcja `Adresowanie IPv4 - budowa i klasy` |
| zwykła podsieć z adresem sieci oraz broadcastem | `ZNANY` | lekcja `Adresowanie IPv4 - budowa i klasy` |
| wyjątek `/31` dla łącza punkt do punktu | `ZNANY` | końcowy transfer w poprzedniej lekcji; tutaj używany w projekcie |
| dobór najmniejszej potęgi dwóch | `WPROWADZANY` | przykład 50 hostów i blok 64 adresów |
| wyrównanie bloku | `WPROWADZANY` | test granicy oraz kontrprzykład `192.0.2.80/27` |
| kolizja zakresów | `WPROWADZANY` | test kolizji oraz kontrprzykład rozszerzenia do `/26` |
| agregacja tras | `ODROCZONY` | osobna umiejętność, niepotrzebna do przydziału kilku bloków z jednej puli |

Wynik bramki zależności: brak pozycji `LUKA`. Lekcja korzysta bezpośrednio z obliczeń przećwiczonych wcześniej, a nową trudnością jest planowanie kilku zależnych przydziałów.

### Wprowadzone korekty

1. Usunięto wykład o powodach dzielenia sieci. Zastąpił go rzeczywisty problem przydziału jednej puli do czterech wymagań.
2. Nie obiecano automatycznego bezpieczeństwa po utworzeniu podsieci. Polityka ruchu wymaga osobnej konfiguracji i nie jest ocenianą umiejętnością tej lekcji.
3. Usunięto demonstrację równego podziału `/24` na cztery identyczne `/26`. Uczeń projektuje bloki różnej wielkości, ponieważ wymagania nie są równe.
4. Zastąpiono metaforę „pożyczania bitów” obliczeniem pojemności i jawnej długości prefiksu. Wynik można sprawdzić na konkretnym zakresie.
5. Usunięto tabelę ośmiu gotowych podsieci `/23`. Nie wymagała decyzji i tworzyła długi wzorzec do kopiowania.
6. Procedura obejmuje trzy osobne testy: pojemność, wyrównanie i kolizję. Poprawny prefiks bez poprawnego początku nie zalicza projektu.
7. Dodano uczciwy zapis rezerwy. Wolnego przedziału nie wolno nazwać jednym prefiksem, jeśli jego początek i rozmiar nie tworzą takiego bloku.
8. Usunięto osobny miniwykład o supernettingu. Agregacja tras jest odmienną decyzją i rozpraszała ćwiczenie alokacji.
9. Usunięto tabelę prefiksów „do zapamiętania”. Rozmiar bloku jest wyprowadzany z wymagania i potęgi dwóch.
10. Quiz wymaga jednoczesnego sprawdzenia pojemności, granic i nakładania. Każda błędna odpowiedź narusza inny warunek.
11. Zadanie transferowe zmienia liczbę hostów po wykonaniu planu. Uczeń musi wykryć wpływ rozszerzenia na dwa sąsiednie bloki i przeprojektować układ.

### Kontrola dydaktyczna i dostępności

- Rdzeń lekcji tworzy pętlę `wymaganie -> rozmiar -> granica -> zakres -> kolizja -> zmiana wymagania`.
- Powtarzalne pola raportu odciążają pamięć roboczą i pozwalają porównywać przypadki wiersz po wierszu.
- Krótkie bloki tekstowe pokazują topologię przestrzeni adresowej w kolejności rosnącej. Nie użyto tabeli, ponieważ ważniejsze jest śledzenie początku i końca każdego zakresu.
- Lista granic wynika z obliczonych rozmiarów i jest używana natychmiast do kontroli projektu. Nie jest katalogiem faktów bez działania.
- Kryteria nie oceniają pisowni ani szybkości rachunków. Oceniają kompletność dowodu i brak kolizji.
- Rozwiązanie pozostaje ukryte do samodzielnej próby i pokazuje, dlaczego pozornie lokalna zmiana prefiksu wpływa na sąsiednie przydziały.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 37 do 35 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie projektowe nie występuje w drzewie dostępności. Spacja na poprawnej odpowiedzi odblokowuje zadanie i pokazuje rozwiązanie kontrolne quizu.
- Rozwiązanie transferu jest początkowo zwinięte. Po rozwinięciu zawiera pierwotny plan i przeprojektowanie po wzroście wymagania do 40 hostów.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o zapisie IPv6

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| bit i zapis szesnastkowy | `ZNANY` | kurs `binarne-fundamenty-it` |
| adres logiczny interfejsu i długość prefiksu | `ZNANY` | wcześniejsze lekcje o IPv4 i routingu |
| osiem 16-bitowych grup IPv6 | `WPROWADZANY` | rozwinięcie pierwszego adresu do pełnej postaci |
| elastyczny zapis RFC 4291 | `WPROWADZANY` | kilka poprawnych tekstów opisujących tę samą wartość |
| zapis kanoniczny RFC 5952 | `WPROWADZANY` | cztery działania normalizacji i przypadek remisu |
| identyfikator strefy link-local | `WPROWADZANY` | porównanie `fe80::1%eth0` z `fe80::1%eth1` |
| SLAAC, NDP, DHCPv6 i planowanie podsieci IPv6 | `ODROCZONY` | nie są potrzebne do ocenianej umiejętności normalizacji oraz porównania adresów |

Wynik bramki zależności: brak pozycji `LUKA`. Wymagany zapis szesnastkowy pochodzi z kursu zależnego, a wszystkie reguły specyficzne dla IPv6 są ćwiczone przed quizem.

### Wprowadzone korekty

1. Usunięto liczby o wyczerpaniu IPv4, rynku adresów i wdrożeniu IPv6. Były zmienne w czasie i nie wspierały żadnej ocenianej decyzji.
2. Usunięto twierdzenie, że IPv6 eliminuje potrzebę NAT w każdym projekcie. Lekcja nie ocenia architektury translacji ani polityki sieciowej.
3. Zastąpiono katalog typów adresów jedną sprawnością operacyjną: normalizacją, porównaniem i zachowaniem kontekstu adresu.
4. Poprawiono rozróżnienie między zapisem poprawnym składniowo a kanonicznym. Wiodące zera są dopuszczalne przez RFC 4291, choć RFC 5952 wymaga ich usunięcia w formacie kanonicznym.
5. Dodano pomijaną wcześniej regułę wyboru najdłuższego ciągu zer oraz pierwszego ciągu przy remisie.
6. Dodano zakaz używania `::` do skrócenia tylko jednej grupy zerowej w zapisie kanonicznym.
7. Prefiks jest przechowywany osobno od 128-bitowej wartości adresu. Ta sama wartość z `/64` i `/48` nie oznacza równoważnej konfiguracji.
8. Identyfikatora strefy nie przedstawiono jako fragmentu adresu. Służy do wybrania właściwego łącza dla adresu o ograniczonym zakresie.
9. Usunięto katalog SLAAC i NDP, tabelę porównania IPv4 z IPv6 oraz listę poleceń bez zadania. Każdy z tych tematów wymaga własnej sytuacji problemowej.
10. Quiz używa dwóch równych ciągów zer. Uczeń musi zastosować regułę remisu, a nie tylko znaleźć dowolne miejsce dla `::`.
11. Zadanie transferowe łączy poprawność składni, równoważność wartości, kanoniczność, prefiks i strefę. Zwykłe skrócenie jednego adresu nie wystarcza do zaliczenia.

### Kontrola dydaktyczna i dostępności

- Sekwencja `policz grupy -> rozwiń -> skróć kanonicznie -> porównaj -> zachowaj kontekst` pozostaje stała w demonstracji i zadaniu.
- Adresy są pokazywane w wyrównanych blokach, po jednym przekształceniu na wiersz. Ułatwia to śledzenie osobom, które mylą położenie znaków.
- Długie katalogi skrótów zastąpiono raportem z sześcioma stałymi polami. Każde pole wymaga decyzji i ma dowód w tekście adresu.
- Kryteria nie oceniają tempa przepisywania ani pamięci nazw angielskich. Oceniają jednoznaczność rozwinięcia i zachowanie kontekstu.
- Nie użyto Mermaid, ponieważ najważniejsza relacja dotyczy pozycji znaków w pojedynczym wierszu, a kompilator nie ma potwierdzonego renderowania diagramów.
- Rozwiązanie jest ukryte do samodzielnej próby i rozdziela wartość adresu, prefiks oraz strefę.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 35 do 31 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie porównawcze nie występuje w drzewie dostępności. Enter na poprawnej odpowiedzi odblokowuje zadanie i pokazuje regułę remisu.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu poprawnie rozdziela równoważność adresu, różnicę prefiksu i strefy `%eth0` oraz `%eth1`.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o diagnostyce DHCP

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| adres IPv4, prefiks i sprawdzanie tej samej podsieci | `ZNANY` | lekcje o IPv4 i subnettingu |
| klient, serwer, router i transmisja UDP | `ZNANY` | moduły 0 i 1 |
| DISCOVER, OFFER, REQUEST, ACK i NAK | `WPROWADZANY` | każda wiadomość opisana jako zmiana stanu przed pierwszą diagnozą |
| identyfikator transakcji `xid` | `WPROWADZANY` | narzędzie do łączenia komunikatów jednej wymiany |
| opcje maski, routera i DNS | `WPROWADZANY` | analiza zawartości DHCPACK |
| relay i `giaddr` | `WPROWADZANY` | ślad klienta z VLAN 30 przez relay do serwera |
| T1, T2 i wygaśnięcie | `WPROWADZANY` | oś czasu dla dzierżawy ośmiogodzinnej |
| konfiguracja konkretnego serwera DHCP | `ODROCZONY` | lekcja ocenia interpretację śladu, a nie składnię jednego produktu |

Wynik bramki zależności: brak pozycji `LUKA`. Wszystkie elementy protokołu potrzebne do raportu są wprowadzone na jawnych śladach, a obliczenie podsieci zostało przećwiczone wcześniej.

### Wprowadzone korekty

1. Zastąpiono katalog przydzielanych parametrów analizą zawartości konkretnego DHCPACK.
2. DORA pozostawiono jako nazwy komunikatów, ale nie jako cel pamięciowy. Uczeń opisuje zmianę stanu i zakres dowodu każdego komunikatu.
3. Oferta nie jest już przedstawiona jako zakończona dzierżawa. ACK potwierdza przydział, a NAK odrzuca żądanie.
4. Usunięto absolutne twierdzenia, że OFFER zawsze jest unicastem, a REQUEST zawsze broadcastem. Sposób dostarczenia zależy od stanu klienta, pól i obecności relay.
5. Dodano `xid`, aby uczeń łączył komunikaty tej samej transakcji zamiast polegać na kolejności kilku klientów.
6. ACK nie jest traktowany jako dowód poprawności topologii. Quiz wymaga wykrycia routera leżącego poza podsiecią klienta.
7. Brak OFFER nie jest utożsamiony z wyłączonym serwerem. Następny test przesuwa obserwację o jedną granicę w stronę relay lub serwera.
8. Relay opisano przez zachowanie żądania, ustawienie `giaddr` i drogę odpowiedzi. Pole `giaddr` nie jest mylone z opcją routera klienta.
9. T1 i T2 opisano jako wartości konfigurowalne z wartościami domyślnymi, a nie bezwarunkowe momenty dokładnie 50% i 87,5% każdej dzierżawy.
10. Usunięto tabelę objawów i napraw. Te same objawy mogą mieć kilka przyczyn; zadanie wymaga dowodu oraz testu rozróżniającego.
11. Usunięto listę poleceń bez danych wejściowych oraz diagnozę opartą wyłącznie na adresie IPv4 link-local. Ślad protokołu daje węższą i sprawdzalną granicę.
12. Zmieniony przypadek pokazuje uszkodzenie `giaddr` po odebraniu żądania przez relay, więc uczeń musi zaktualizować diagnozę na podstawie nowego dowodu.

### Kontrola dydaktyczna i dostępności

- Stały raport `stan -> ostatni dowód -> pierwszy brak -> zakazany wniosek -> następny test` zamienia nazwy komunikatów w procedurę diagnostyczną.
- Każdy ślad zawiera tylko informacje potrzebne do jednej decyzji. Kolejne przypadki zmieniają etap protokołu lub zawartość opcji.
- Oś czasu dzierżawy ma trzy jawne punkty i konkretne godziny, co ogranicza obciążenie rachunkowe oraz ułatwia osobom z dysleksją śledzenie kolejności.
- Lista możliwych granic po braku OFFER jest mapą miejsc pomiaru. Uczeń wybiera z niej kolejny punkt, zamiast uczyć się przyczyn na pamięć.
- Kryteria oceniają granicę wniosku i jakość kolejnego testu. Nie oceniają rozwinięcia skrótu DORA ani znajomości poleceń systemowych.
- Rozwiązanie jest ukryte do próby i nie podaje jednej przyczyny tam, gdzie ślad jej nie rozstrzyga.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 31 do 28 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie diagnostyczne nie występuje w drzewie dostępności. Spacja na poprawnej odpowiedzi odblokowuje zadanie i pokazuje granicę wniosku po ACK.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera cztery raporty oraz zmieniony przypadek z błędnym `giaddr`.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o mapowaniu NAT

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| adres IPv4, port TCP lub UDP i kierunek pakietu | `ZNANY` | wcześniejsze lekcje o IP oraz transporcie |
| adres wewnętrzny i zewnętrzny | `WPROWADZANY` | dwa ślady tego samego pakietu przed i po translatorze |
| mapowanie NAPT | `WPROWADZANY` | jawne powiązanie dwóch końców adres-port wraz z protokołem |
| translacja pakietu powrotnego | `WPROWADZANY` | odwrócenie docelowego adresu i portu na podstawie wpisu |
| filtrowanie NAT | `WPROWADZANY` | osobne pytanie o dopuszczalne źródła zdalne |
| statyczne przekierowanie | `WPROWADZANY` | ruch przychodzący do `203.0.113.5:8443` |
| CGN i `100.64.0.0/10` | `WPROWADZANY` | przykład dwóch kolejnych translatorów |
| składnia iptables, nftables i konkretnego routera | `ODROCZONY` | nie jest potrzebna do odtworzenia mapowania ze śladu |

Wynik bramki zależności: brak pozycji `LUKA`. Lekcja korzysta ze znanych adresów i portów, a każdy nowy element translacji jest pokazany na jednym pakiecie przed zadaniem.

### Wprowadzone korekty

1. Usunięto ogólną opowieść o sieci domowej i oszczędzaniu adresów. Rdzeń tworzy porównanie pakietu przed i po translatorze.
2. Zastąpiono tabelę sesji jednym wpisem z nazwanymi polami. Uczeń używa go natychmiast do odtworzenia odpowiedzi.
3. Nie założono, że zdalny adres i port zawsze należą do klucza mapowania. Szczegółowe zachowanie mapowania zależy od NAT, a zdalny cel jest zachowany jako kontekst obserwowanego połączenia.
4. Rozdzielono mapowanie i filtrowanie zgodnie z RFC 4787. Istnienie zewnętrznego końca nie jest dowodem akceptacji pakietu z każdego źródła.
5. NAT nie jest przedstawiony jako zapora. Translacja oraz polityka dopuszczenia mogą współistnieć na urządzeniu, ale wymagają osobnych dowodów.
6. Usunięto katalog Static NAT, Dynamic NAT, PAT, maskarady i DNAT. Lekcja ćwiczy NAPT oraz jedno statyczne mapowanie zamiast pamięci nazw.
7. Port zewnętrzny nie jest nazywany losowym. Jest przydzielonym, rozróżnialnym elementem mapowania; sposób wyboru zależy od implementacji.
8. Statyczne przekierowanie nie jest obietnicą dostępnej usługi. Uczeń sprawdza trafienie translacji, filtr, trasę i nasłuch.
9. CGN opisano jako drugi translator. Sam adres z `100.64.0.0/10` nie wystarcza do diagnozy bez potwierdzenia strony operatora i adresu widzianego z zewnątrz.
10. Usunięto listę wad NAT, przykłady protokołów ALG oraz stwierdzenie, że IPv6 zawsze usuwa potrzebę translacji. Nie służyły ocenianej umiejętności.
11. Usunięto polecenia iptables i nftables bez środowiska wykonawczego. Raport wskazuje, jakich liczników i punktów przechwytywania trzeba szukać niezależnie od produktu.
12. Zadanie zmienia lokalne przekierowanie w układ z CGN. Uczeń musi dodać drugie mapowanie i wskazać granicę własnej kontroli.

### Kontrola dydaktyczna i dostępności

- Sekwencja `pakiet -> wpis -> zmieniane pola -> pakiet po translacji -> filtr -> następny test` jest stała w demonstracji i transferze.
- Wiersze przed i po translacji mają tę samą kolejność pól. Pozwala to śledzić zmianę bez przeskakiwania po tabeli.
- Każdy przypadek zmienia jeden warunek: port, istnienie wpisu, filtr albo liczbę translatorów.
- Lista kryteriów jest bezpośrednim kluczem oceny raportu. Nie zawiera nazw odmian NAT bez działania.
- Kryteria nie oceniają angielskich rozwinięć skrótów ani składni konkretnego firewalla. Oceniają poprawność kierunku i granicę dowodu.
- Nie użyto Mermaid, ponieważ kompilator nie ma potwierdzonego renderowania. Topologię dwóch translatorów pokazano w liniowym bloku tekstowym z jednoznaczną kolejnością.
- Rozwiązanie jest ukryte do próby i zachowuje niepewność tam, gdzie ślad nie rozstrzyga zachowania filtra.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 28 do 25 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie śledzenia pakietów nie występuje w drzewie dostępności. Enter na poprawnej odpowiedzi odblokowuje zadanie i pokazuje kierunek translacji odpowiedzi.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera cztery przypadki oraz zmienioną topologię z drugim mapowaniem CGN.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o ARP i następnym kroku

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| adres IPv4, prefiks, trasa lokalna i domyślna | `ZNANY` | lekcje o routingu oraz adresowaniu IPv4 |
| ramka Ethernet, adres źródłowy i docelowy MAC | `ZNANY` | lekcja `Warstwa fizyczna i łącza danych` |
| następny krok i interfejs wyjściowy | `ZNANY` | lekcja `Warstwa sieciowa - IP i routing` |
| cel rozwiązania ARP | `WPROWADZANY` | porównanie celu bezpośredniego z celem przez router |
| pola ARP Request i Reply | `WPROWADZANY` | dwa pełne ślady przed budową ramki danych |
| pamięć sąsiadów i jej walidacja | `WPROWADZANY` | trzy pytania diagnostyczne bez stałego czasu implementacji |
| ARP Probe i Announcement | `WPROWADZANY POMOCNICZO` | kontekst dla konfliktu oraz legalnego przełączenia adresu |
| proxy ARP i zabezpieczenia przełącznika | `ODROCZONY` | jawnie poza zwykłym modelem hosta ocenianym w lekcji |

Wynik bramki zależności: brak pozycji `LUKA`. Lekcja składa znaną decyzję routingu i znaną ramkę Ethernet w nową umiejętność wyboru celu ARP.

### Wprowadzone korekty

1. Usunięto ogólny wykład „IP kontra MAC”. Zastąpiło go rozdzielenie końcowego celu pakietu i następnego kroku na lokalnym łączu.
2. Decyzja routingu jawnie poprzedza ARP. Brak trasy zatrzymuje proces przed próbą rozwiązania sąsiada.
3. Broadcast jest przypisany do ramki ARP Request, a nie do późniejszej ramki przenoszącej pakiet danych.
4. Adres zdalnego serwera nie jest rozwiązywany przez ARP dla trasy przez router. Host pyta o lokalny adres następnego kroku.
5. Usunięto stały zakres TTL pamięci ARP oraz katalog stanów specyficznych dla Linuksa. RFC 1122 wymaga walidacji lub usuwania starych wpisów, lecz dopuszcza różne mechanizmy.
6. Usunięto listę poleceń bez zadania. Raport wymaga informacji, którą można uzyskać z pamięci sąsiadów niezależnie od systemu.
7. Gratuitous ARP zastąpiono precyzyjnymi pojęciami Probe i Announcement z RFC 5227. Pojedyncze ogłoszenie nie jest przedstawione jako pełna metoda wykrywania konfliktu.
8. Sprzeczne odpowiedzi nie są automatycznie nazwane spoofingiem. Uczeń musi rozróżnić konflikt, przełączenie i fałszywą odpowiedź dodatkowymi dowodami.
9. Usunięto katalog ataków, DAI, DHCP Snooping i MITM. Wymagał osobnego modelu zagrożeń i odciągał od ocenianej diagnozy sąsiada.
10. Quiz sprawdza adres następnego kroku, a zadanie łączy trafienie pamięci, brak wpisu, brak trasy i sprzeczne odpowiedzi.
11. Zmieniony przypadek dostarcza legalne zdarzenie failover. Uczeń musi zaktualizować hipotezę bez ignorowania potrzeby potwierdzenia stanu.

### Kontrola dydaktyczna i dostępności

- Stała kolejność `trasa -> następny krok -> pamięć -> ARP -> MAC ramki` prowadzi przez każdy przypadek.
- Cel IPv4 i cel MAC są zawsze w osobnych, nazwanych wierszach. Ogranicza to częste pomylenie poziomów.
- Bloki ARP Request i Reply zawierają tylko pola używane w dalszym wnioskowaniu.
- Lista trzech pytań o pamięć sąsiadów jest procedurą pomiaru, a nie katalogiem nazw stanów.
- Kryteria oceniają wybór celu i granicę wniosku. Nie oceniają pamięci poleceń ani nazw mechanizmów ochronnych.
- Nie użyto Mermaid, ponieważ kompilator nadal nie ma potwierdzonego renderowania. Kolejność decyzji przedstawiono liniowo i z tekstowym odpowiednikiem topologii.
- Rozwiązanie jest ukryte do próby i jawnie koryguje diagnozę po dodaniu informacji o failover.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 25 do 22 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie o czterech przypadkach nie występuje w drzewie dostępności. Spacja na poprawnej odpowiedzi odblokowuje zadanie i pokazuje różnicę między celem IP a następnym krokiem.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera brak trasy, rozwiązanie routera, wpis lokalny oraz aktualizację hipotezy po failover.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o interpretacji ICMP

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| pakiet IPv4, cel, router i TTL | `ZNANY` | wcześniejsze lekcje o IP i routingu |
| port UDP i handshake TCP | `ZNANY` | lekcja o warstwie transportowej |
| Echo Request, Echo Reply, identyfikator i sekwencja | `WPROWADZANY` | pierwsza wymiana oraz powiązanie odpowiedzi z sondą |
| ICMP Destination Unreachable | `WPROWADZANY` | port unreachable czytany razem z cytowaną sondą UDP |
| ICMP Time Exceeded | `WPROWADZANY` | mechanizm rosnącego TTL w traceroute |
| rodzaj sondy traceroute | `WPROWADZANY` | rozróżnienie wariantów UDP, Echo i TCP |
| filtrowanie i ograniczanie częstotliwości ICMP | `WPROWADZANY POMOCNICZO` | wyjaśnia granice wniosku po timeout i gwiazdce |
| analiza opóźnienia jednokierunkowego | `ODROCZONY` | RTT nie dostarcza tej wartości bez dodatkowej synchronizacji i pomiaru |

Wynik bramki zależności: brak pozycji `LUKA`. Nowe komunikaty są zawsze połączone z konkretną sondą, a znane TCP i UDP służą jako testy rozróżniające.

### Wprowadzone korekty

1. Usunięto definicję ICMP jako protokołu, który „nie przenosi danych użytkownika”. Komunikaty błędów zawierają fragment pierwotnego datagramu, a ważniejsza jest ich rola dowodowa.
2. Usunięto tabelę typów i kodów. Port unreachable oraz Time Exceeded są wprowadzane wtedy, gdy uczeń używa ich do diagnozy.
3. Echo Reply ograniczono do konkretnej próbki ICMP. Nie jest przedstawiony jako dowód działania dowolnej usługi ani całej sieci.
4. Timeout nie oznacza wyłączonego hosta. Lekcja jawnie rozdziela stratę żądania, brak odpowiedzi, stratę odpowiedzi, filtrowanie i ograniczanie częstotliwości.
5. Usunięto założenie, że TTL odpowiedzi pozwala odjąć liczbę przeskoków od rzekomo znanej wartości początkowej systemu.
6. RTT jest czasem pełnej wymiany dla próbki, a nie połową opóźnienia w każdą stronę.
7. Błąd ICMP czytany jest z cytowanym pakietem. Kod bez protokołu, portu oraz źródła nie wystarcza do wskazania granicy.
8. Traceroute nie jest przedstawiony jako jeden protokół. Rodzaj sondy i odpowiedź końcowa zależą od implementacji.
9. Gwiazdka oznacza brak widocznej odpowiedzi dla sond danego TTL. Późniejsze odpowiedzi mogą wykazać dalsze przekazywanie.
10. Wysoki RTT środkowego wiersza nie jest automatycznie diagnozą przeciążenia. Router może obsługiwać generowanie ICMP z innym priorytetem.
11. Usunięto tabelę „objaw, narzędzie, wniosek”, która przedstawiała hipotezy jako rozstrzygnięcia.
12. Zmieniony przypadek łączy brak Echo i TCP z działającym DNS oraz lokalnym routerem. Uczeń musi przesunąć pomiar bez nazywania pierwszej gwiazdki przyczyną.

### Kontrola dydaktyczna i dostępności

- Stały raport `sonda -> odpowiedź -> pozytywny dowód -> zakazany wniosek -> nowa sonda` prowadzi wszystkie przypadki.
- Każdy ślad ma krótki identyfikator, numer sekwencyjny albo cytowany tuple, dzięki czemu odpowiedź da się przypisać bez polegania na pamięci kolejności.
- Bloki traceroute zawierają cztery wiersze i jedną zmianę. Pozwala to zauważyć sprzeczność między gwiazdką w środku a osiągniętym celem.
- Lista przyczyn timeout jest zbiorem hipotez do rozdzielenia następnym testem, a nie tabelą gotowych diagnoz.
- Kryteria oceniają siłę wniosku i wartość nowej sondy. Nie oceniają pamięci numerów typów ICMP ani składni poleceń.
- Nie użyto Mermaid, ponieważ liniowa sekwencja TTL jest czytelna w bloku tekstowym, a kompilator nie ma potwierdzonego renderowania diagramów.
- Rozwiązanie jest ukryte do próby i zachowuje niepewność przy braku odpowiedzi.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów`; przebudowana lekcja nie generuje własnych ostrzeżeń. Kolejka całego kursu spadła z 22 do 15 ostrzeżeń.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie o czterech wynikach nie występuje w drzewie dostępności. Enter na poprawnej odpowiedzi odblokowuje zadanie i pokazuje ograniczenie wniosku z gwiazdki.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera Echo, błąd dla UDP, traceroute, działające TCP oraz zmieniony przypadek z dwoma timeoutami.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o interpretacji odpowiedzi DNS

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| adres IPv4 i IPv6 | `ZNANY` | lekcje modułu 2 o adresowaniu |
| klient, serwer i wymiana żądanie oraz odpowiedź | `ZNANY` | lekcje o warstwie transportowej i aplikacji |
| resolver rekurencyjny i serwer autorytatywny | `WPROWADZANY` | liniowy zapis ról przed diagnostyką błędów |
| pytanie QNAME, QTYPE i QCLASS | `WPROWADZANY` | pierwszy krok stałego raportu |
| odpowiedź pozytywna i łańcuch CNAME | `WPROWADZANY` | dwa ślady kończące się rekordem A |
| NOERROR bez danych typu i NXDOMAIN | `WPROWADZANY` | porównanie trzech odpowiedzi o kontrolowanych różnicach |
| SERVFAIL i timeout | `WPROWADZANY` | granice wniosku oraz porównanie punktów obserwacji |
| TTL odpowiedzi pozytywnej i negatywnej | `WPROWADZANY` | oś czasu pamięci resolvera |
| DNSSEC, DoH, DoT i administracja strefą | `ODROCZONY` | wymagają osobnych modeli bezpieczeństwa i eksploatacji, nie są potrzebne w ocenianej diagnozie |

Wynik bramki zależności: brak pozycji `LUKA`. Uczeń korzysta ze znanych adresów i schematu żądanie oraz odpowiedź, a nowe kody poznaje dopiero w śladzie, w którym są potrzebne.

### Wprowadzone korekty

1. Usunięto katalog hierarchii DNS, rodzajów rekordów, szyfrowania i poleceń. Nie budował ocenianej umiejętności lokalizacji granicy błędu.
2. Usunięto twierdzenie, że działający ping po adresie i niedziałająca nazwa prawie zawsze oznaczają DNS. Objaw może powstać także przed zapytaniem, w aplikacji albo po uzyskaniu odpowiedzi.
3. Każda interpretacja rozpoczyna się od pełnego zestawu `QNAME`, `QTYPE`, `QCLASS`. Odpowiedź dla `A` nie jest traktowana jako odpowiedź dla `AAAA`.
4. `NOERROR` z pustą sekcją odpowiedzi i `SOA` jest odróżniony od `NXDOMAIN`. Brak danych żądanego typu nie staje się brakiem nazwy.
5. `SERVFAIL` oznacza nieukończone przetwarzanie przez resolver, a timeout tylko brak widocznej odpowiedzi w czasie próby. Żaden z nich nie dowodzi nieistnienia nazwy.
6. Łańcuch CNAME zachowuje alias, nazwę docelową oraz osobne TTL. Skrócony zapis nazwa równa się adres nie ukrywa już pośredniej granicy.
7. TTL opisuje czas przechowywania w konkretnym resolverze. Usunięto model jednej chwili globalnej propagacji.
8. Odpowiedzi negatywne również są traktowane jako dane, które mogą pozostać w pamięci według informacji ze strefy.
9. Czyszczenie pamięci nie jest pierwszym krokiem. Uczeń najpierw zapisuje wartość, respondera i pozostały TTL, żeby nie zniszczyć dowodu.
10. Quiz wymaga przejścia przez alias, a zadanie rozdziela odpowiedź pozytywną, brak typu, brak nazwy oraz brak odpowiedzi.
11. Zmieniony przypadek dodaje poprawną odpowiedź z innego resolvera. Uczeń musi zawęzić hipotezę bez automatycznego obwiniania pamięci lokalnej.

### Kontrola dydaktyczna i dostępności

- Stały raport prowadzi od dokładnego pytania przez odpowiedź do granicy dowodu i następnego testu.
- Ślady mają stałą kolejność pól i krótkie etykiety. Uczeń nie musi utrzymywać całej wymiany w pamięci roboczej.
- Trzy pierwsze odpowiedzi różnią się jednym kluczowym warunkiem: danymi typu, brakiem typu albo brakiem nazwy.
- Lista kryteriów jest kluczem oceny raportu. Nie sprawdza pamięci nazw rekordów niezwiązanych z zadaniem.
- Nie użyto Mermaid, ponieważ kompilator nie ma potwierdzonego renderowania. Relację klient, resolver i serwer autorytatywny pokazano krótkim blokiem liniowym z odpowiednikiem tekstowym.
- Rozwiązanie pozostaje ukryte do wykonania próby i nie usuwa niepewności po timeout.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów, 12 ostrzeżeń`; lekcja DNS nie generuje własnych ostrzeżeń. Pozostałe dotyczą dwóch jeszcze nieprzebudowanych lekcji.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią treść zadania transferowego nie występuje w migawce drzewa dostępności. Enter na poprawnej odpowiedzi odblokowuje zadanie i pokazuje informację zwrotną.
- Rozwiązanie jest początkowo zwinięte. Po ręcznym rozwinięciu zawiera cztery przypadki i aktualizację hipotezy po odpowiedzi z innego resolvera.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; widoczne odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów. Widoczne są tylko komunikaty diagnostyczne środowiska Vite i generatora spisu treści.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o lokalizacji granicy HTTP i HTTPS

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| DNS i odpowiedź pozytywna dla nazwy | `ZNANY` | poprzednia lekcja o DNS |
| połączenie TCP i port | `ZNANY` | lekcja o TCP i UDP |
| podstawowa rola TLS | `ZNANY` | lekcja o warstwach sesji, prezentacji i aplikacji |
| URI, scheme, authority, path i query | `WPROWADZANY` | rozbiór jednego zamierzonego URI |
| metoda, target i Host w HTTP/1.1 | `WPROWADZANY` | jedno pełne żądanie potrzebne w diagnozie |
| finalna odpowiedź i status | `WPROWADZANY` | odpowiedzi 301, 401, 404 i 503 w kontekście śladu |
| WWW-Authenticate, Location i Retry-After | `WPROWADZANY POMOCNICZO` | tylko przy statusie, którego interpretację zmieniają |
| format ramek HTTP/2 i HTTP/3 | `ODROCZONY` | lekcja ocenia semantyczną granicę żądanie oraz odpowiedź, nie dekodowanie ramek |
| pełna kryptografia certyfikatów | `ODROCZONY` | oceniane jest miejsce zatrzymania TLS, nie budowa PKI |

Wynik bramki zależności: brak pozycji `LUKA`. Lekcja składa znane DNS, TCP i podstawową rolę TLS w jedną procedurę, a pola HTTP wprowadza na konkretnych śladach.

### Wprowadzone korekty

1. Usunięto katalog metod, zakresów kodów, rodzajów certyfikatów, wersji HTTP i poleceń terminalowych. Nie wspierały jednej ocenianej diagnozy.
2. Usunięto slogan, że wszystko w WWW używa HTTP albo HTTPS. Kurs nie potrzebuje takiego uogólnienia, żeby analizować konkretną wymianę.
3. Wprowadzono sekwencję DNS, transport, TLS, żądanie HTTP i odpowiedź HTTP. Uczeń wskazuje ostatnią zakończoną granicę.
4. Błąd certyfikatu przed wysłaniem żądania nie otrzymuje wymyślonego kodu HTTP. Metoda i target nie są wtedy przedmiotem diagnozy.
5. Authority pozostaje oddzielone od adresu IP. Pole Host w HTTP/1.1 może wybrać inną witrynę na tym samym adresie.
6. `401` nie jest sprowadzone do „klient nie jest zalogowany”. Interpretacja uwzględnia brak ważnych danych uwierzytelniających i pole `WWW-Authenticate`.
7. `403` usunięto z zadania, ponieważ poprzedni quiz błędnie zakładał, że taki status zawsze dowodzi rozpoznania tożsamości klienta.
8. `404` nie jest przedstawione jako pewny brak zasobu. RFC 9110 dopuszcza także nieujawnianie istnienia zasobu.
9. `503` potwierdza odebranie odpowiedzi HTTP, mimo że usługa chwilowo nie może obsłużyć żądania. `Retry-After` pozostaje sugestią ponowienia.
10. Przekierowanie jest nową wymianą. Samo `301` nie dowodzi sukcesu żądania pod adresem z `Location`.
11. HTTP/2 i HTTP/3 ograniczono do wyjaśnienia, że zmieniają kodowanie lub transport, ale zachowują badaną semantykę żądania i odpowiedzi.
12. Zmieniony przypadek zachowuje adres, metodę i ścieżkę, a zmienia authority. Uczeń ma wykryć granicę routingu wirtualnego hosta bez nazywania konkretnej przyczyny bez logu.

### Kontrola dydaktyczna i dostępności

- Stały raport zachowuje URI, ostatnią granicę, żądanie, odpowiedź, granicę wniosku i następny test.
- Każdy ślad ma krótkie, powtarzalne etykiety. Różnice nie są ukryte w długich akapitach.
- Pięć prób zatrzymuje się w różnych miejscach albo zwraca inną semantykę HTTP. Uczeń nie rozwiąże zadania przez jedną regułę „działa lub nie działa”.
- Kryteria są kluczem oceny decyzji, a nie listą nazw do zapamiętania.
- Nie użyto Mermaid, ponieważ kompilator nie ma potwierdzonego renderowania. Kolejność granic pokazano w numerowanym bloku tekstowym.
- Rozwiązanie pozostaje ukryte do próby i zachowuje niepewność tam, gdzie odpowiedź nie wskazuje konfiguracji konkretnego komponentu.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów, 3 ostrzeżenia`; lekcja HTTP nie generuje własnych ostrzeżeń. Wszystkie pozostałe dotyczą ostatniej nieprzebudowanej lekcji.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie o pięciu próbach nie występuje w drzewie dostępności. Spacja na poprawnej odpowiedzi odblokowuje zadanie i pokazuje granicę TLS.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera pięć prób oraz aktualizację hipotezy po zmianie pola Host.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; wszystkie odpowiedzi mieszczą się między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola lekcji o rekonstrukcji enkapsulacji

### Wymagania wstępne

| Pojęcie lub umiejętność | Status | Dowód lub miejsce wprowadzenia |
| --- | --- | --- |
| ramka Ethernet, źródłowy i docelowy MAC | `ZNANY` | lekcja o warstwie łącza danych |
| trasa, następny krok, docelowy IP i TTL | `ZNANY` | lekcje o routingu i ICMP |
| ARP dla lokalnego następnego kroku | `ZNANY` | lekcja o ARP |
| porty, sekwencja i dane TCP | `ZNANY` | lekcja o TCP i UDP |
| NAPT i mapowanie adresu oraz portu | `ZNANY` | lekcja o NAT |
| punkt i kierunek przechwycenia | `WPROWADZANY` | topologia P0 oraz P1 przed pierwszym śladem |
| suma nagłówka IPv4 i suma TCP | `WPROWADZANY POMOCNICZO` | wyjaśniają zmianę po TTL oraz NAPT, bez ręcznego obliczania |
| FCS ramki i ograniczenia widoczności | `WPROWADZANY POMOCNICZO` | granica lokalnej ramki oraz zastrzeżenie o sprzęcie |
| tunele, fragmentacja i mechanizmy odciążania | `ODROCZONY` | jawnie wyłączone z pierwszego przebiegu; wymagają osobnych śladów |

Wynik bramki zależności: brak pozycji `LUKA`. Lekcja składa wcześniej ćwiczone decyzje w analizę dwóch punktów, a nowe elementy sum kontrolnych służą tylko do uzasadnienia obserwowanej zmiany.

### Wprowadzone korekty

1. Usunięto katalog nazw PDU oraz opis enkapsulacji jako mechanicznego dodawania nagłówka przez każdą z siedmiu warstw.
2. Usunięto absoluty, że przełącznik, karta lub router „nie wie nic” o wyższych protokołach. Implementacje mogą analizować więcej pól niż minimum potrzebne do podstawowej decyzji.
3. Jedna jawna topologia zastąpiła kilka ogólnych diagramów. Punkty P0 i P1 określają miejsce oraz kierunek każdego dowodu.
4. Wprowadzono kontrolowane założenia: IPv4, TCP, brak NAT, tunelu i fragmentacji oraz jeden segment. Dzięki temu zachowanie pól ma rozstrzygalny wzorzec.
5. Docelowy MAC lokalnego routera i docelowy IP zdalnego serwera występują obok siebie. Uczeń musi wyjaśnić ich różne zakresy.
6. Router kończy ramkę lewego łącza i tworzy ramkę prawego łącza. Nie jest opisany jako urządzenie, które tylko podmienia dwa pola w tej samej ramce.
7. TTL i suma nagłówka IPv4 zmieniają się przy przekazaniu. Porty, sekwencja i dane TCP pozostają powiązane w przebiegu bez translatora.
8. FCS jest przypisany do ramki jednego łącza, ale lekcja ostrzega, że program przechwytujący nie zawsze go pokaże.
9. Brak pasującej obserwacji P1 nie jest automatycznie uznany za odrzucenie przez router. Uczeń sprawdza trasę, filtr, położenie sondy i liczniki.
10. Quiz wymaga odtworzenia całej prawej ramki oraz pól wewnętrznych, a nie znajomości zachowania broadcastu.
11. Zadanie łączy poprawne przekazanie, niezgodny MAC następnego kroku, brak obserwacji i wyczerpanie TTL powiązane cytowanym ICMP.
12. Zmienione założenie włącza NAPT. Uczeń musi zaktualizować źródłowy IP, port i sumę TCP, nie porzucając pozostałych powiązań przepływu.
13. Usunięto katalog filtrów Wireshark i tcpdump. Umiejętność jest niezależna od składni konkretnego narzędzia.

### Kontrola dydaktyczna i dostępności

- Stały raport utrzymuje kolejność `ramka -> IPv4 -> TCP -> dowód -> brakujący pomiar`.
- Pola P0 i P1 stoją w tej samej kolejności, dzięki czemu różnicę można znaleźć bez przeszukiwania akapitów.
- Topologia jest niezbędna do rozwiązania zadania. Nie jest dekoracyjnym diagramem ani katalogiem urządzeń.
- Każdy przypadek zmienia jedną własność: zgodność następnego kroku, obecność drugiego śladu, TTL albo translator.
- Kryteria oceniają przypisanie pola do zakresu i siłę wniosku. Nie oceniają pamięci angielskich rozwinięć skrótów.
- Nie użyto Mermaid, ponieważ kompilator nie ma potwierdzonego renderowania. Zastosowano krótki schemat tekstowy, którego znaczenie jest również opisane zdaniami.
- Rozwiązanie pozostaje ukryte do próby i jawnie zachowuje niepewność przy braku P1.
- Kompilacja wszystkich 19 lekcji: zaliczona.
- Audyt szkicu: `0 błędów, 0 ostrzeżeń`.
- Testy aktywacji quizu klawiaturą: 3/3 zaliczone.
- Przed odpowiedzią zadanie o czterech przebiegach nie występuje w drzewie dostępności. Enter na poprawnej odpowiedzi odblokowuje zadanie i pokazuje zakres ramki oraz datagramu.
- Kontrola przeglądarkowa wykryła encję `-&gt;` widoczną w etykiecie quizu. Strzałki zastąpiono słowem „do”, a ponowna kontrola potwierdziła czyste etykiety odpowiedzi.
- Rozwiązanie jest początkowo zwinięte. Po rozwinięciu zawiera cztery przypadki oraz nowy ślad P1 po włączeniu NAPT.
- Widok 390 × 844 px: brak poziomego przepełnienia dokumentu; bloki topologii i pól mieszczą się w szerokości, a wszystkie odpowiedzi pozostają między krawędziami ekranu.
- Konsola przeglądarki podczas pełnego przepływu: brak ostrzeżeń i błędów.

Status lekcji: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Kontrola przekrojowa całego kursu

- Indeks zawiera 19 lekcji i wszystkie 19 plików źródłowych istnieje.
- Każda lekcja ma bramkę wymagającą decyzji oraz odroczoną samokontrolę w zwijanym rozwiązaniu.
- Zadania transferowe zmieniają warunek, topologię, dowód albo ograniczenie. Nie polegają wyłącznie na zmianie nazwy lub liczby.
- Audyt w trybie publikacyjnym: `0 błędów, 0 ostrzeżeń`.
- Kompilacja całego kursu: zaliczona dla 19 lekcji.
- Testy ukończenia quizu i aktywacji klawiaturą: 3/3 zaliczone.
- Końcowa kontrola czterech uzupełnionych lekcji potwierdziła, że rozwiązanie nie występuje w drzewie dostępności przed przejściem bramki, o ile lekcja nie była już wcześniej ukończona w zapisanym stanie.
- Cztery uzupełnione lekcje w widoku 390 × 844 px nie mają poziomego przepełnienia, a zwijane rozwiązania pozostają początkowo zamknięte.
- Kontrole przeglądarkowe przebudowywanych lekcji nie wykazały ostrzeżeń ani błędów konsoli.
- Diagramy Mermaid nie zostały użyte, ponieważ kompilator nie ma potwierdzonego renderowania. Schematy tekstowe pozostały tylko tam, gdzie uczeń wykorzystuje relację lub kolejność w zadaniu.
- Materiał przeszedł kontrolę redakcyjną pod kątem sztucznych sloganów, pustych pochwał, mechanicznych wyliczeń i zbyt szerokich wniosków. Stała struktura raportów została zachowana celowo jako wsparcie pamięci roboczej i dysleksji.

Status kursu: `po kontroli źródłowej, technicznej i przebudowie dydaktycznej, przed recenzją ekspercką i pilotażem`.

## Bramka 80% zrozumiałości

Nie przeprowadzono jeszcze próby na co najmniej 5 osobach z grupy docelowej. Nie wolno opisywać lekcji jako „zrozumiałej w 80%”. Po recenzji eksperckiej należy przeprowadzić pilotaż według `BAZA_TWORZENIA_KURSOW/09-BRAMKA-80-PROCENT.md`.
