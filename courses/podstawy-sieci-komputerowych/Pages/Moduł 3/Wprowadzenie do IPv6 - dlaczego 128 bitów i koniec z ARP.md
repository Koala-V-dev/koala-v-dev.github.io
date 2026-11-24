# Wprowadzenie do IPv6 - dlaczego 128 bitów i koniec z ARP

Pula adresowa IPv4 obejmuje niespełna 4.3 miliarda adresów. Translacja NAT (RFC 1918) przedłużyła jej działanie w sieciach biurowych i domowych, ale przerwała bezpośrednią łączność koniec-z-końcem (*End-to-End Connectivity*), zmuszając aplikacje i gry sieciowe do stosowania mechanizmów przebijania zapór.

Protokół nowej generacji **IPv6** (*RFC 8200*) rozwiązuje problem wyczerpania adresów i upraszcza nagłówek pakietu, zastępując ponadto rozgłoszeniowy protokół ARP komunikacją grupową **NDP**.

---

## 🌐 1. Dlaczego 128 bitów i uproszczony nagłówek

Przestrzeń adresowa IPv6 ma długość **128 bitów**:

$$2^{128} \approx 3{,}4028 \times 10^{38}\text{ adresów}$$

Tak ogromna pula pozwala na przydzielenie globalnie unikalnego adresu każdemu urządzeniu, co eliminuje konieczność stosowania translacji NAT.

### 📐 Architektura stałego nagłówka (40 bajtów)

W przeciwieństwie do zmiennego nagłówka IPv4 (20 do 60 bajtów), nagłówek podstawowy IPv6 ma zawsze dokładnie **40 bajtów**:
- **Brak sumy kontrolnej nagłówka:** Routery nie przeliczają sumy kontrolnej przy każdym przeskoku, co przyspiesza przełączanie pakietów w krzemowych układach ASIC.
- **Brak fragmentacji na routerach:** Router pośredni nie dzieli dużych pakietów IPv6. Zbyt duży pakiet zostaje odrzucony ze zwrotem komunikatu *ICMPv6 Packet Too Big*, a fragmentację wykonuje wyłącznie nadawca (*PMTUD*).
- **Pole Hop Limit zamiast TTL:** Ośmiobitowy licznik zmniejszany o 1 na każdym routerze pośrednim.

---

## ✂️ 2. Format zapisu i reguły kompresji (RFC 5952)

Przetestuj kompresję oraz rozwijanie adresów IPv6, algorytm EUI-64 oraz wyliczanie adresu grupowego NDP w poniższym laboratorium:

<data-ipv6-address-lab></data-ipv6-address-lab>

![Struktura i kompresja IPv6](/public/courses/podstawy-sieci-komputerowych/Images/ipv6-format-i-kompresja.svg)

Adres IPv6 zapisuje się szesnastkowo w 8 blokach po 4 znaki (*hekstetach*) rozdzielonych dwukropkami, na przykład `2001:0db8:0000:0000:0000:0000:1428:57ab`. Standard RFC 5952 definiuje dwie reguły skracania:

### ➖ Reguła 1: Pomijanie zer wiodących w hekstecie

W każdym hekstecie usuwa się początkowe zera z lewej strony. Zera kończące pozostają na miejscu:
- `:0db8:` zamienia się na `:db8:`
- `:0001:` zamienia się na `:1:`
- `:0000:` zamienia się na `:0:`
- `:ab00:` pozostaje jako `:ab00:`

Po zastosowaniu pierwszej reguły zapis przyjmuje postać `2001:db8:0:0:0:0:1428:57ab`.

### 🔗 Reguła 2: Zastąpienie ciągu zer podwójnym dwukropkiem (::)

Najdłuższy ciąg kolejnych hekstetów złożonych z samych zer (minimum 2 hekstety) zastępuje się symbolem **`::`**. Ze względu na jednoznaczność rozwinięcia symbol `::` może wystąpić w adresie **wyłącznie jeden raz**. Przy równych ciągach zer skraca się ciąg położony najbardziej na lewo.

Po zastosowaniu obu reguł otrzymujemy zapis kanoniczny `2001:db8::1428:57ab`.

### 📋 Ćwiczenie z rozwijania adresów

| Adres skrócony | Adres pełny (32 cyfry hex) |
| :--- | :--- |
| `::1` | `0000:0000:0000:0000:0000:0000:0000:0001` |
| `::` | `0000:0000:0000:0000:0000:0000:0000:0000` |
| `fe80::20c:29ff:fe4b:88aa` | `fe80:0000:0000:0000:020c:29ff:fe4b:88aa` |
| `2001:db8:0:1::` | `2001:0db8:0000:0001:0000:0000:0000:0000` |

---

## 🏷️ 3. Typy adresów i zasięgi w IPv6

W protokole IPv6 zrezygnowano z adresów rozgłoszeniowych (*Broadcast*). Wprowadzono trzy tryby komunikacji: **Unicast** (jeden cel), **Multicast** (grupa odbiorców) oraz **Anycast** (najbliższy w metryce routingu węzeł z grupy serwerów).

### 📊 Klasyfikacja adresów Unicast i Multicast (INF.02)

| Typ adresu | Prefiks | Przeznaczenie |
| :--- | :--- | :--- |
| **Global Unicast (GUA)** | `2000::/3` | Publiczne, globalnie routowalne adresy internetowe. |
| **Link-Local (LLA)** | `fe80::/10` | Obowiązkowe adresy lokalnego łącza L2; nie przechodzą przez routery. |
| **Unique Local (ULA)** | `fc00::/7` | Adresy prywatne do sieci wewnętrznych (odpowiednik RFC 1918). |
| **Pętla zwrotna (*Loopback*)** | `::1/128` | Lokalny stos sieciowy (odpowiednik `127.0.0.1`). |
| **Adres nieokreślony** | `::/128` | Brak przypisanego adresu (odpowiednik `0.0.0.0`). |
| **Multicast** | `ff00::/8` | Ruch grupowy: `ff02::1` (wszystkie węzły), `ff02::2` (wszystkie routery). |

---

## 📡 4. Koniec z ARP: Protokół Neighbor Discovery (NDP)

W sieci IPv4 ramki `ARP Request` wysyłane na adres rozgłoszeniowy `FF:FF:FF:FF:FF:FF` budzą każdą kartę sieciową w segmencie L2, zmuszając systemy sąsiadów do przeglądania obcych zapytań.

Protokół IPv6 zastępuje ARP mechanizmem **NDP** (*Neighbor Discovery Protocol*, RFC 4861), opartym na komunikatach **ICMPv6**:

1. **Rezolucja adresów MAC bez Broadcastu (NS i NA):**  
   Nadawca wylicza adres grupowy **Solicited-Node Multicast** (`ff02::1:ffxx:xxxx` z ostatnich 24 bitów celu) i wysyła pakiet *Neighbor Solicitation* (ICMPv6 Typ 135). Sprzętowa karta sieciowa filtruje ruch w warstwie fizycznej i dostarcza ramkę wyłącznie docelowemu odbiorcy, który odpowiada komunikatem *Neighbor Advertisement* (Typ 136).
2. **Autokonfiguracja bezstanowa (*SLAAC*):**  
   Stacja wysyła zapytanie *Router Solicitation* (Typ 133). Router odpowiada komunikatem *Router Advertisement* (Typ 134) z prefiksem sieci (np. `2001:db8:cafe:1::/64`), po czym host sam wyznacza 64-bitowy identyfikator interfejsu losowo lub algorytmem *EUI-64* (wstawienie `FF:FE` w środek adresu MAC i inwersja 7. bitu U/L).

---

## 💻 5. Polecenia diagnostyczne IPv6

### 🪟 Diagnostyka w Windows

```cmd
ipconfig /all
netsh interface ipv6 show neighbors
ping -6 2001:4860:4860::8888
ping -6 fe80::1%eth0
```

Przy testowaniu adresu Link-Local (`fe80::`) należy podać identyfikator strefy interfejsu (`%12` lub `%eth0`), ponieważ prefiks `fe80::/10` powtarza się na każdej karcie sieciowej w systemie.

### 🐧 Diagnostyka w Linux

```bash
ip -6 addr show
ip -6 neigh show
ping -6 2001:4860:4860::8888
```

---

## 🔒 6. Sprawdzenie wiedzy: Prefiksy i mechanizmy IPv6

<data-gate>
  <data-connection-matcher title="Połącz prefiks lub mechanizm IPv6 z jego funkcją">
    <div class="cmw-item" data-left="fe80::/10" data-right="Link-Local: obowiązkowy adres lokalnego segmentu L2"></div>
    <div class="cmw-item" data-left="2000::/3" data-right="Global Unicast: publiczna pula routowana w Internecie"></div>
    <div class="cmw-item" data-left="fc00::/7" data-right="Unique Local: prywatny adres do komunikacji wewnątrz firmy"></div>
    <div class="cmw-item" data-left="Protokół NDP (NS / NA)" data-right="Zastępuje rozgłoszeniowy ARP z użyciem Solicited-Node Multicast"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przestrzeń 128-bitowa IPv6 oraz stały 40-bajtowy nagłówek bez sumy kontrolnej upraszczają routing sprzętowy i eliminują konieczność stosowania translacji NAT.
- Skracanie adresów według *RFC 5952* polega na usunięciu zer wiodących z każdego hekstetu oraz jednorazowym użyciu `::` dla najdłuższego ciągu zerowych bloków.
- Podstawowe prefiksy IPv6 to `2000::/3` (Global Unicast), `fe80::/10` (Link-Local), `fc00::/7` (Unique Local) oraz `::1/128` (Loopback).
- Protokół *NDP* (ICMPv6 NS i NA) zastępuje rozgłoszeniowy *ARP* dzięki wykorzystaniu sprzętowego filtrowania *Solicited-Node Multicast* (`ff02::1:ffxx:xxxx`).
