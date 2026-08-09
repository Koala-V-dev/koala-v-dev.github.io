# NAT - jedno IP publiczne, wiele urządzeń

Serwer zewnętrzny widzi połączenie z `203.0.113.5:62001`. W sieci lokalnej nie ma takiego hosta ani portu. Rzeczywisty klient używa `10.0.0.12:50000`.

W tej lekcji odtworzysz mapowanie NAPT z dwóch śladów, przeprowadzisz pakiet powrotny i wskażesz miejsce, w którym kończy się dowód o translacji, a zaczyna pytanie o filtrowanie.

## 🧠 Porównaj pakiet przed i po translacji

Klient otwiera połączenie TCP do serwera HTTPS:

```
przed urządzeniem NAT
TCP 10.0.0.12:50000 -> 198.51.100.20:443

po urządzeniu NAT
TCP 203.0.113.5:62001 -> 198.51.100.20:443
```

Zapisz pola, które się zmieniły, i pola, które pozostały takie same.

Nie używaj jeszcze zdania „NAT przepuści odpowiedź”. Najpierw zbuduj wpis, który pozwoli ją rozpoznać.

## 🔁 Odtwórz mapowanie NAPT

Basic NAT tłumaczy adresy. NAPT rozszerza translację o identyfikator transportowy, zwykle port TCP lub UDP. Dzięki temu kilka wewnętrznych połączeń może współdzielić jeden adres zewnętrzny.

Dla obserwowanego połączenia najważniejszy wpis ma postać:

```
protokół:          TCP
wewnętrzne:        10.0.0.12:50000
zewnętrzne:        203.0.113.5:62001
zdalny cel śladu:  198.51.100.20:443
```

Pierwsze dwa końce tworzą mapowanie adresu i portu. Informacja o zdalnym celu pomaga powiązać je z obserwowanym połączeniem, ale szczegółowe zasady mapowania i filtrowania zależą od zachowania konkretnego NAT.

W pakiecie wychodzącym urządzenie zmienia źródłowy adres oraz port:

```
10.0.0.12:50000 -> 203.0.113.5:62001
```

Cel `198.51.100.20:443` pozostaje celem tego pakietu.

## ↩️ Przeprowadź odpowiedź po wpisie

Serwer odpowiada do źródła, które zobaczył:

```
TCP 198.51.100.20:443 -> 203.0.113.5:62001
```

Urządzenie znajduje zewnętrzny koniec wpisu i tłumaczy cel pakietu:

```
TCP 198.51.100.20:443 -> 10.0.0.12:50000
```

Adres i port serwera nie zmieniają się w tym przykładzie. Zmienia się docelowy adres oraz port odpowiedzi.

Jeśli odpowiedź przyjdzie na `203.0.113.5:62002`, pokazany wpis nie pasuje. NAT nie może na jego podstawie wybrać `10.0.0.12:50000`.

## 🧱 Rozdziel mapowanie i filtrowanie

Mapowanie odpowiada na pytanie:

```
który wewnętrzny adres i port odpowiadają zewnętrznemu adresowi i portowi?
```

Filtrowanie odpowiada na inne pytanie:

```
z których zdalnych adresów i portów wolno przyjąć pakiet dla tego mapowania?
```

Różne NAT mogą stosować różne zachowania filtrowania. Sam wpis mapowania nie dowodzi, że urządzenie zaakceptuje pakiet z dowolnego zdalnego źródła.

Nie utożsamiaj też NAT z pełną polityką zapory. Translacja i decyzja o dopuszczeniu ruchu mogą być realizowane na tym samym urządzeniu, lecz odpowiadają na różne pytania. Brak pakietu po stronie wewnętrznej wymaga obserwacji zarówno wyniku wyszukania mapowania, jak i reguły filtrowania.

## 🚪 Sprawdź ruch inicjowany z zewnątrz

Pakiet przychodzący do nowego portu nie zawiera informacji o prywatnym celu:

```
TCP 198.51.100.40:53000 -> 203.0.113.5:8443
```

Statyczne przekierowanie może dostarczyć brakujące mapowanie:

```
TCP 203.0.113.5:8443 -> 10.0.0.20:443
```

To nadal nie jest dowód, że ruch przejdzie. Osobno sprawdzasz protokół, zgodność portu, regułę filtrowania, trasę do hosta i to, czy usługa nasłuchuje na `10.0.0.20:443`.

Jeśli przechwycenie na interfejsie zewnętrznym zawiera pakiet, a na wewnętrznym go nie ma, następny test powinien odczytać licznik trafień reguły translacji oraz decyzję filtra. Sam brak pakietu nie rozstrzyga, który mechanizm go zatrzymał.

## 🪆 Uwzględnij drugi translator

Adres `100.64.0.0/10` jest przestrzenią współdzieloną używaną między klientem a operatorem stosującym CGN. Gdy interfejs zewnętrzny routera klienta ma na przykład `100.64.12.8`, droga może zawierać dwa mapowania:

```
10.0.0.20:443
  translator klienta
100.64.12.8:8443
  CGN operatora
203.0.113.200:53010
```

Przekierowanie skonfigurowane tylko na pierwszym urządzeniu nie tworzy automatycznie mapowania na CGN operatora. Zewnętrzny klient trafia do publicznego adresu i portu drugiego translatora.

Nie wystarczy zobaczyć prefiks `100.64.0.0/10` na dowolnym interfejsie i ogłosić przyczynę. Potwierdź, że jest to adres po stronie operatora oraz porównaj adres widziany na interfejsie z adresem obserwowanym przez zewnętrzny serwer.

## 🛠️ Punkt kontrolny: odwróć mapowanie

<data-gate>
  <data-quiz>
    <question>Wpis TCP wiąże `10.0.0.12:50000` z `203.0.113.5:62001` dla połączenia z `198.51.100.20:443`. Co powinien zrobić NAT z pasującą odpowiedzią skierowaną do `203.0.113.5:62001`?</question>
    <options>
      <option>Zmienić źródło na `10.0.0.12:50000` i pozostawić cel publiczny.</option>
      <option correct>Zmienić cel na `10.0.0.12:50000` i zachować źródło `198.51.100.20:443`.</option>
      <option>Wysłać odpowiedź do wszystkich hostów w sieci lokalnej.</option>
      <option>Odrzucić ją, ponieważ odpowiedzi nigdy nie przechodzą przez NAPT.</option>
    </options>
    <div data-hint="error">W odpowiedzi zewnętrzny adres i port są celem. Wyszukaj je w prawej stronie mapowania i odtwórz wewnętrzny cel.</div>
    <div data-hint="success">Odpowiedź trafia na zewnętrzny koniec wpisu. Translacja odwraca docelowy adres i port do `10.0.0.12:50000`, a serwer pozostaje źródłem.</div>
  </data-quiz>
</data-gate>

## 🧪 Prześledź cztery przypadki

Dla każdego przypadku przygotuj raport:

```
pakiet wejściowy
pasujący wpis albo brak wpisu
zmieniane pola
pakiet po translacji
osobna decyzja filtra, jeśli nie ma dowodu
następny test
```

Przypadki:

```
A. istnieje mapowanie UDP 10.0.0.30:53000 <-> 203.0.113.5:63000;
   wraca 198.51.100.53:53 -> 203.0.113.5:63000

B. istnieje tylko mapowanie TCP 10.0.0.12:50000 <-> 203.0.113.5:62001;
   przychodzi TCP 198.51.100.20:443 -> 203.0.113.5:62002

C. skonfigurowano TCP 203.0.113.5:8443 -> 10.0.0.20:443;
   pakiet widać na zewnątrz, ale nie widać go na interfejsie wewnętrznym

D. dwa hosty używają źródłowego portu 50000 do tego samego serwera;
   NAT przydziela 203.0.113.5:62010 oraz 203.0.113.5:62011
```

Kryteria ukończenia:

- w odpowiedzi zmieniasz cel, a nie źródło serwera;
- protokół i port są częścią wyszukania mapowania;
- brak wpisu nie prowadzi do losowego wyboru hosta wewnętrznego;
- mapowanie nie jest przedstawione jako dowód przepuszczenia przez filtr;
- dwa identyczne porty wewnętrzne pozostają rozróżnialne dzięki różnym końcom zewnętrznym.

Zmień przypadek C: adres WAN routera to `100.64.12.8`, a zewnętrzny serwer widzi publiczny adres `203.0.113.200`. Wyjaśnij, której translacji nie kontroluje lokalna reguła przekierowania i gdzie trzeba zdobyć kolejny dowód.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A wpis pasuje do protokołu UDP oraz celu `203.0.113.5:63000`. Po translacji pakiet ma postać `198.51.100.53:53 -> 10.0.0.30:53000`. Sam wpis nie rozstrzyga jeszcze zachowania filtra wobec zdalnego źródła, jeśli nie znamy jego polityki.

W B port `62002` nie pasuje do jedynego wpisu z portem `62001`. Na podstawie tej tablicy nie ma wewnętrznego celu. Następny test sprawdza, czy istnieje inne mapowanie statyczne lub dynamiczne dla TCP `62002`.

W C reguła statyczna wskazuje zamierzoną translację celu do `10.0.0.20:443`, ale brak pakietu na interfejsie wewnętrznym nie dowodzi jej wykonania. Sprawdź licznik trafień tej reguły, wynik translacji i decyzję filtra dla tego samego pakietu.

W D każdy host musi dostać rozróżnialny zewnętrzny koniec. Odpowiedź do `62010` może wrócić do pierwszego mapowania, a odpowiedź do `62011` do drugiego, mimo identycznych portów źródłowych po stronie wewnętrznej.

Po zmianie C lokalne przekierowanie kończy się na adresie `100.64.12.8`, który nie jest adresem widzianym w publicznym Internecie. Drugie mapowanie należy do CGN operatora. Potrzebny jest dowód jego zewnętrznego adresu i portu oraz informacja, czy operator udostępnia mapowanie przychodzące. Reguła na routerze klienta nie konfiguruje CGN.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **NAPT wiąże wewnętrzny adres i port z zewnętrznym adresem i portem.** Protokół jest częścią kontekstu mapowania.
- **Pakiet wychodzący zmienia źródło, a pasująca odpowiedź zmienia cel.** Zdalny serwer pozostaje drugim końcem rozmowy.
- **Mapowanie i filtrowanie to dwie decyzje.** Istnienie wpisu nie dowodzi, że każde zdalne źródło zostanie dopuszczone.
- **Ruch inicjowany z zewnątrz potrzebuje znanego wewnętrznego celu.** Statyczne przekierowanie może go wskazać, lecz nie zastępuje kontroli filtra i usługi.
- **CGN dodaje drugi translator.** Lokalna reguła nie tworzy automatycznie publicznego mapowania po stronie operatora.
