# ARP - kto ma ten adres MAC

Host chce wysłać pakiet do `198.51.100.20`. Jego karta sieciowa nie potrzebuje jednak adresu MAC zdalnego serwera. Potrzebuje adresu MAC następnego kroku na lokalnym łączu.

W tej lekcji wybierzesz właściwy adres IPv4 do rozwiązania przez ARP, odtworzysz ramkę i zatrzymasz diagnozę tam, gdzie kończy się dowód z lokalnego łącza.

## 🧠 Najpierw wybierz cel zapytania

Host ma konfigurację:

```
adres:          192.0.2.10/26
trasa lokalna:  192.0.2.0/26 przez eth0
trasa domyślna: 0.0.0.0/0 przez 192.0.2.1 na eth0
cel pakietu:    198.51.100.20
```

Zapisz dwa osobne pola:

```
docelowy adres IPv4 pakietu
adres IPv4 następnego kroku do rozwiązania przez ARP
```

Jeśli wpiszesz ten sam adres w obu polach, sprawdź najpierw wynik decyzji routingu.

## 🧭 ARP zaczyna się po decyzji o trasie

Tablica routingu wybiera interfejs oraz następny krok. Dopiero potem urządzenie szuka adresu sprzętowego potrzebnego do zbudowania ramki na tym łączu.

Dla celu bezpośredniego:

```
cel IP należy do trasy lokalnej
następny krok IP = cel IP
ARP pyta o cel IP
```

Dla celu przez router:

```
cel IP pasuje do trasy przez router
następny krok IP = adres routera
ARP pyta o adres routera
```

W początkowym przypadku `198.51.100.20` nie należy do `192.0.2.0/26`. Trasa domyślna wybiera więc następny krok `192.0.2.1`.

```
cel pakietu IP:        198.51.100.20
cel rozwiązania ARP:   192.0.2.1
```

To model zwykłego hosta bez jawnie skonfigurowanego proxy ARP. Specjalne mechanizmy mogą zmieniać zachowanie, ale wymagają osobnego dowodu.

## 📣 Odczytaj żądanie ARP

Gdy pamięć sąsiadów nie zawiera potrzebnego wpisu, host wysyła ramkę rozgłoszeniową na lokalnym łączu.

```
Ethernet źródło:       02:00:00:00:00:10
Ethernet cel:          ff:ff:ff:ff:ff:ff
ARP operacja:          request
ARP adres nadawcy IP:  192.0.2.10
ARP MAC nadawcy:       02:00:00:00:00:10
ARP szukany adres IP:  192.0.2.1
```

Broadcast dotyczy ramki z pytaniem. Nie staje się docelowym adresem MAC późniejszej ramki z pakietem IP.

Urządzenie posiadające szukany adres odpowiada swoim adresem sprzętowym:

```
ARP operacja:          reply
ARP adres nadawcy IP:  192.0.2.1
ARP MAC nadawcy:       02:00:00:00:00:01
ARP adres celu IP:     192.0.2.10
ARP MAC celu:          02:00:00:00:00:10
```

Host może zapisać skojarzenie `192.0.2.1` z `02:00:00:00:00:01` w pamięci sąsiadów.

## ✉️ Zbuduj ramkę bez zmiany celu IP

Po rozwiązaniu następnego kroku ramka oraz pakiet mają różne cele:

```
Ethernet cel MAC:      02:00:00:00:00:01
IPv4 cel:              198.51.100.20
```

Ramka dociera do routera na lokalnym łączu. Pakiet nadal wskazuje zdalny serwer. Router usuwa lokalny nagłówek łącza, wykonuje własną decyzję routingu i buduje nową ramkę na kolejnym łączu.

Nie wyprowadzaj z tego reguły, że adres IPv4 nigdy nie może zmienić się po drodze. Wcześniejsza lekcja o NAT pokazała jawny wyjątek związany z translacją.

## 🔍 Diagnozuj pamięć i brak odpowiedzi

Wpis w pamięci sąsiadów pozwala użyć znanego MAC bez nowego broadcastu przy każdym pakiecie. Implementacja musi jednak usuwać albo ponownie sprawdzać nieaktualne dane.

Nie zakładaj jednego uniwersalnego czasu życia ani nazw stanów dla wszystkich systemów. W raporcie wystarczą trzy pytania:

```
czy istnieje wpis dla następnego kroku?
jaki MAC zawiera i kiedy został potwierdzony?
czy nowa próba ARP otrzymuje odpowiedź?
```

Jeśli host wysyła żądania o `192.0.2.1` i nie otrzymuje odpowiedzi, pierwszy brak powodzenia dotyczy rozwiązania sąsiada na lokalnym łączu. Nie jest to jeszcze dowód awarii zdalnego serwera `198.51.100.20`.

Następny test może sprawdzić ten sam broadcast i odpowiedź na porcie routera, zgodność VLAN oraz to, czy `192.0.2.1` jest skonfigurowany na właściwym interfejsie.

## ⚠️ Traktuj sprzeczne odpowiedzi jako sygnał

Dwie odpowiedzi przypisują `192.0.2.1` do różnych adresów MAC:

```
09:10:01  192.0.2.1 is-at 02:00:00:00:00:01
09:10:02  192.0.2.1 is-at 02:00:00:00:00:99
```

To dowód sprzecznego mapowania na łączu. Nie jest jeszcze dowodem ataku. Możliwa jest błędna konfiguracja, konflikt adresu, awaryjne przełączenie urządzeń albo fałszywa odpowiedź.

Kolejny test powinien powiązać oba MAC z portami przełącznika, sprawdzić konfigurację właściciela adresu i porównać czas z planowanym przełączeniem. Dopiero dodatkowe dowody pozwalają nazwać przyczynę.

ARP Announcement może ogłosić, że host używa adresu, i pomóc odświeżyć stare wpisy. Mechanizm wykrywania konfliktów również używa ARP Probe i Announcement. Pojedynczy niezapowiedziany pakiet nie powinien automatycznie otrzymać etykiety „atak”.

## 🛠️ Punkt kontrolny: wybierz następny krok

<data-gate>
  <data-quiz>
    <question>Host `192.0.2.10/26` wysyła pakiet do `198.51.100.20` przez trasę domyślną z routerem `192.0.2.1`. O który adres IPv4 powinien zapytać przez ARP?</question>
    <options>
      <option>`198.51.100.20`, ponieważ jest docelowym adresem pakietu.</option>
      <option correct>`192.0.2.1`, ponieważ jest następnym krokiem na lokalnym łączu.</option>
      <option>`255.255.255.255`, ponieważ każdy cel zdalny jest broadcastem.</option>
      <option>`192.0.2.10`, ponieważ host najpierw rozwiązuje własny adres.</option>
    </options>
    <div data-hint="error">Najpierw zastosuj tablicę routingu. ARP rozwiązuje adres potrzebny na lokalnym łączu, a nie każdy końcowy adres pakietu.</div>
    <div data-hint="success">Trasa wybiera router `192.0.2.1` jako następny krok. Jego MAC trafia do ramki, a `198.51.100.20` pozostaje celem pakietu IPv4.</div>
  </data-quiz>
</data-gate>

## 🧪 Rozwiąż cztery przypadki

Dla każdego przypadku przygotuj raport:

```
wybrana trasa i interfejs
końcowy cel IPv4
następny krok IPv4
wynik pamięci sąsiadów
potrzebne działanie ARP
docelowy MAC ramki albo pierwszy brak dowodu
```

Przypadki dla hosta `192.0.2.10/26` z routerem `192.0.2.1`:

```
A. cel 192.0.2.50; pamięć ma 192.0.2.50 -> 02:00:00:00:00:50
B. cel 198.51.100.20; brak wpisu dla 192.0.2.1; ARP Reply przychodzi
C. cel 203.0.113.20; nie ma pasującej trasy ani trasy domyślnej
D. cel 198.51.100.20; na pytanie o 192.0.2.1 przychodzą dwa różne MAC
```

Kryteria ukończenia:

- decyzja routingu poprzedza działanie ARP;
- dla celu lokalnego rozwiązujesz adres celu, a dla zdalnego adres routera;
- brak trasy nie jest opisywany jako brak odpowiedzi ARP;
- cel MAC ramki i cel IPv4 pakietu pozostają osobnymi polami;
- dwa różne MAC prowadzą do weryfikacji konfliktu, a nie automatycznej etykiety ataku.

Zmień D: o 09:10 administrator potwierdza planowane przełączenie routera na zapasowy MAC `02:00:00:00:00:99`. Zaktualizuj wniosek i zaproponuj dowód, że stary MAC nie odpowiada już jako właściciel `192.0.2.1`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A cel leży w lokalnym `/26`, więc następny krok to `192.0.2.50`. Istniejący wpis daje MAC `02:00:00:00:00:50`; nowy broadcast ARP nie jest potrzebny w tym momencie.

W B celem pakietu pozostaje `198.51.100.20`, ale trasa wybiera `192.0.2.1`. Host pyta przez ARP o router. Po odpowiedzi używa MAC nadawcy odpowiedzi jako celu lokalnej ramki.

W C proces zatrzymuje się przy wyborze trasy. Nie ma jeszcze następnego kroku ani uzasadnienia dla żądania ARP. Najpierw trzeba naprawić lub uzupełnić tablicę routingu.

W D trasa oraz szukany adres są znane, lecz dwie odpowiedzi tworzą sprzeczny dowód własności. Sprawdź porty obu MAC, konfigurację urządzeń i zdarzenia zmiany stanu. Nie przypisuj przyczyny bez tej korelacji.

Po zmianie D nowy MAC zgadza się z planowanym przełączeniem, więc najbardziej prawdopodobne staje się legalne przejęcie adresu przez zapasowy router. Nadal trzeba potwierdzić stan: przechwycić kolejne odpowiedzi, sprawdzić tablicę MAC przełącznika i wykazać, że stary port nie odpowiada już za `192.0.2.1`.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Najpierw wybierasz trasę i następny krok.** Dopiero potem ARP szuka jego adresu sprzętowego.
- **Cel zdalny nie jest celem ARP.** Dla trasy przez router rozwiązujesz lokalny adres routera.
- **Ramka i pakiet mają osobne cele.** MAC wskazuje następny krok na łączu, a IPv4 wskazuje końcowy cel pakietu.
- **Brak odpowiedzi ARP ogranicza diagnozę do lokalnego sąsiedztwa.** Nie dowodzi awarii zdalnej usługi.
- **Sprzeczne mapowania wymagają korelacji.** Konflikt, przełączenie i fałszywa odpowiedź rozróżniasz dodatkowymi dowodami.
