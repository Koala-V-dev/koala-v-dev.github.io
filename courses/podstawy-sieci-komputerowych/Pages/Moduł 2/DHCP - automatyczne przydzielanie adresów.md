# DHCP - automatyczne przydzielanie adresów

Klient pokazuje „brak Internetu”. W przechwyconym ruchu widać cztery komunikaty DHCP i poprawne potwierdzenie. Ponowne uruchamianie serwera niczego nie naprawi, jeśli błąd znajduje się w przekazanej opcji routera.

W tej lekcji odczytasz ślad DHCP, wskażesz ostatni potwierdzony etap i wybierzesz test, który rozdziela możliwe przyczyny.

## 🧠 Najpierw znajdź ostatni dowód

Przeczytaj ślad:

```
09:00:01 DHCPDISCOVER  xid=0x41
09:00:01 DHCPOFFER     xid=0x41  yiaddr=192.0.2.130
09:00:02 DHCPREQUEST   xid=0x41  requested=192.0.2.130
09:00:02 DHCPACK       xid=0x41  lease=8h
```

Zapisz dwie odpowiedzi:

```
ostatni potwierdzony etap
czego sam ten ślad jeszcze nie potwierdza
```

Nie oceniaj jeszcze dostępu do DNS ani Internetu. Najpierw ogranicz wniosek do tego, co naprawdę zawierają komunikaty.

## 🔄 Czytaj wymianę jako zmianę stanu

Nazwy Discover, Offer, Request i Acknowledgement tworzą popularny skrót DORA. Przy diagnozie ważniejsza jest rola każdego komunikatu.

```
DISCOVER  klient szuka dostępnej konfiguracji
OFFER     serwer proponuje adres i parametry
REQUEST   klient wskazuje wybraną ofertę oraz żądany adres
ACK       serwer potwierdza dzierżawę i konfigurację
```

Oferta nie jest jeszcze dowodem zakończonej dzierżawy. Dopiero DHCPACK pozwala klientowi przejść do stanu związanego z przydzielonym adresem.

Serwer może też wysłać DHCPNAK. Oznacza to, że żądana konfiguracja nie jest dla klienta poprawna w danym kontekście. Klient nie powinien traktować wcześniejszej oferty jak aktywnej dzierżawy.

Pole identyfikatora transakcji, tutaj `xid=0x41`, pomaga połączyć komunikaty jednej wymiany. Sama bliskość czasowa nie wystarcza, gdy wielu klientów działa równocześnie.

## 📦 Sprawdź zawartość ACK

Potwierdzenie DHCP może dostarczyć adres oraz opcje konfiguracyjne. Trzy z nich są szczególnie ważne w tym zadaniu:

```
maska podsieci
lista routerów w podsieci klienta
lista serwerów DNS
```

Sam DHCPACK potwierdza zakończenie wymiany DHCP. Nie dowodzi, że każda przekazana wartość pasuje do topologii albo że wskazany router i DNS odpowiadają.

Rozszerzmy początkowy ślad:

```
DHCPACK
yiaddr:       192.0.2.130
subnet mask:  255.255.255.192  (/26)
router:       192.0.2.65
DNS:          203.0.113.53
```

Adres klienta należy do `192.0.2.128/26`. Opcja routera wskazuje `192.0.2.65`, czyli inny blok `/26`.

Wniosek brzmi: wymiana DHCP zakończyła się ACK, ale opcja routera jest niespójna z podsiecią klienta. Następny test powinien sprawdzić konfigurację zakresu na serwerze i faktyczny adres routera w `192.0.2.128/26`.

## 🧭 Ogranicz wnioski po braku odpowiedzi

Jeżeli klient powtarza DHCPDISCOVER i nie widzi DHCPOFFER, wiesz tylko, że oferta nie dotarła do punktu przechwytywania.

Możliwe granice problemu obejmują:

```
dostarczenie komunikatu do właściwego segmentu
przekazanie przez relay
dostarczenie do serwera
wybór pasującej puli i polityki
droga odpowiedzi do klienta
```

Nie wybieraj przyczyny z tej listy bez nowego dowodu. Przechwyć ten sam `xid` po drugiej stronie kolejnej granicy, na przykład na wejściu relay albo serwera.

## 🌉 Sprawdź relay między podsieciami

Klient przed otrzymaniem adresu może nadawać lokalnie. Taki ruch nie przechodzi sam przez router do serwera w innej podsieci.

Agent relay odbiera żądanie na interfejsie klienta, ustawia pole `giaddr` na adres związany z tym interfejsem i przekazuje komunikat do skonfigurowanego serwera. Serwer wysyła odpowiedź do relay wskazanego przez `giaddr`, a relay dostarcza ją klientowi.

```
klient VLAN 30
  DISCOVER xid=0x52
relay 203.0.113.1
  giaddr=203.0.113.1, xid=0x52
serwer DHCP
```

Pole `giaddr` daje serwerowi informację o drodze przez relay i może służyć do wyboru właściwego zakresu konfiguracji. Nie jest opcją domyślnego routera przekazywaną klientowi.

Jeśli ślad przy kliencie ma DISCOVER, a ślad przy serwerze nie ma tej samej transakcji, sprawdzaj relay oraz drogę do serwera. Jeśli serwer widzi żądanie, ale nie odpowiada, sprawdzaj dopasowanie puli i politykę serwera.

## ⏱️ Rozróżnij odnowienie od nowej dzierżawy

ACK zawiera czas dzierżawy. Serwer może również określić T1 i T2. Bez tych opcji wartości domyślne wynoszą odpowiednio połowę oraz siedem ósmych czasu dzierżawy.

Dla dzierżawy ośmiogodzinnej od 09:00:

```
T1:       13:00  klient próbuje odnowić u znanego serwera
T2:       16:00  klient próbuje odnowić u dowolnego serwera
wygaśnięcie: 17:00
```

Brak odpowiedzi na pierwszą próbę przy T1 nie oznacza natychmiastowej utraty adresu. Klient może używać ważnej dzierżawy i ponawiać próby. Dopiero wygaśnięcie bez DHCPACK odbiera podstawę do dalszego używania dzierżawionego adresu.

## 🛠️ Punkt kontrolny: wskaż pierwszą naprawę

<data-gate>
  <data-quiz>
    <question>Ślad zawiera DISCOVER, OFFER, REQUEST i ACK dla jednego `xid`. Klient dostał `192.0.2.130/26`, a opcja routera ma wartość `192.0.2.65`. Który wniosek jest najlepiej uzasadniony?</question>
    <options>
      <option>Serwer DHCP nie odpowiedział, więc trzeba go uruchomić.</option>
      <option correct>Dzierżawa została potwierdzona, ale router z opcji leży poza podsiecią klienta. Trzeba sprawdzić opcję routera dla tego zakresu.</option>
      <option>Klient powinien ponowić DHCPDISCOVER, ponieważ OFFER nigdy nie prowadzi do ACK.</option>
      <option>Adres klienta jest błędny, ponieważ każdy adres zaczynający się od `192` musi mieć prefiks `/24`.</option>
    </options>
    <div data-hint="error">Najpierw zachowaj pozytywny dowód ACK. Potem policz sieć klienta z `/26` i porównaj ją z adresem routera.</div>
    <div data-hint="success">ACK kończy wymianę dzierżawy, ale nie gwarantuje poprawności topologicznej opcji. Klient jest w `192.0.2.128/26`, a router w `192.0.2.64/26`.</div>
  </data-quiz>
</data-gate>

## 🧪 Zdiagnozuj cztery ślady

Dla każdego przypadku wypełnij raport:

```
transakcja lub stan dzierżawy
ostatni pozytywny dowód
pierwszy brak powodzenia
czego nie wolno jeszcze twierdzić
następny punkt przechwytywania lub test
```

Przypadki:

```
A. klient trzykrotnie wysyła DISCOVER xid=0x61; przy kliencie brak OFFER
B. po OFFER i REQUEST serwer wysyła DHCPNAK dla xid=0x62
C. klient dostaje ACK z adresem, maską i routerem; brak opcji DNS;
   połączenie z adresem IP działa, wyszukanie nazwy nie
D. ważna dzierżawa kończy się o 17:00; o 13:00 klient wysyła unicast
   DHCPREQUEST do znanego serwera i nie otrzymuje odpowiedzi
```

Kryteria ukończenia:

- brak OFFER nie staje się automatycznie dowodem awarii serwera;
- DHCPNAK nie jest opisywany jako aktywna dzierżawa;
- brak DNS po ACK kieruje test do opcji lub konfiguracji resolvera, nie do kabla;
- brak odpowiedzi przy T1 nie jest mylony z wygaśnięciem dzierżawy;
- następny test obserwuje tę samą transakcję po drugiej stronie jednej granicy.

Zmień przypadek A: relay odbiera DISCOVER na interfejsie `203.0.113.1`, lecz pakiet wysłany w stronę serwera ma `giaddr=0.0.0.0`. Zapisz nowy pierwszy błąd i test, który potwierdzi poprawkę.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A ostatnim dowodem jest wysłanie DISCOVER przez klienta. Brak OFFER przy kliencie nie rozstrzyga, czy żądanie dotarło do relay lub serwera. Następny zapis powinien szukać tego samego `xid=0x61` na wejściu relay, na jego wyjściu i dopiero potem przy serwerze.

W B oferta dotarła, klient wybrał ją przez REQUEST, ale serwer jawnie odrzucił żądanie przez DHCPNAK. Sprawdź powód w logu serwera, bieżącą podsieć klienta i stan żądanego adresu. Nie konfiguruj adresu z odrzuconej oferty.

W C DHCP zakończył się ACK, a komunikacja po adresie IP potwierdza część konfiguracji sieciowej. Brak opcji DNS jest pierwszym konkretnym tropem dla awarii nazw. Porównaj listę żądanych opcji, zawartość ACK i konfigurację resolvera po stronie klienta.

W D klient nadal ma ważną dzierżawę. Brak odpowiedzi przy T1 kieruje test do znanego serwera i drogi unicast, ale nie uzasadnia porzucenia adresu o 13:00. Obserwuj kolejne próby oraz przejście do ponownego wiązania przy T2.

Po zmianie A relay przyjął żądanie, lecz nie ustawił `giaddr`. Pierwszy błąd leży więc w przetworzeniu przez relay. Po poprawce przechwyć pakiet wychodzący i potwierdź jednocześnie właściwe `giaddr`, zachowany `xid=0x61` oraz pojawienie się odpowiedzi skierowanej z serwera do relay.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Ślad DHCP czytasz jako zmianę stanu.** OFFER jest propozycją, ACK potwierdza dzierżawę, a NAK odrzuca żądanie.
- **ACK nie dowodzi poprawności każdej opcji.** Maskę, router i DNS porównujesz z topologią oraz objawem.
- **Brak odpowiedzi ograniczasz do miejsca obserwacji.** Ten sam identyfikator transakcji śledzisz przez kolejne granice.
- **Relay łączy klienta z serwerem w innej podsieci.** Pole `giaddr` wskazuje kontekst relay, a nie domyślny router klienta.
- **T1 nie jest końcem dzierżawy.** Klient może ponawiać odnowienie aż do wygaśnięcia, jeśli nie otrzyma potwierdzenia.
