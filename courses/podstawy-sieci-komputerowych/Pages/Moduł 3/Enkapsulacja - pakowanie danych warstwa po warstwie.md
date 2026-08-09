# Enkapsulacja - pakowanie danych warstwa po warstwie

Na lewym łączu widzisz ramkę do routera. Na prawym łączu widzisz inną ramkę do serwera. Obie przenoszą dane z tego samego połączenia TCP. Które pola powinny się zmienić, a które pozostać powiązane?

W tej lekcji odtworzysz jedną wymianę z dwóch punktów pomiaru. Na końcu potrafisz wskazać, gdzie kończy się dowód z ramki, gdzie z datagramu IP i gdzie z segmentu TCP.

## 🗺️ Ustal topologię i założenia

Pracujesz w kontrolowanym laboratorium:

```
host A                    router R                    serwer B
192.0.2.10/24             192.0.2.1/24               198.51.100.20/24
MAC A                     MAC R-L    MAC R-P          MAC B
   |---------- P0 ----------|            |------ P1 ------|
                             198.51.100.1/24
```

`P0` obserwuje lewe łącze. `P1` obserwuje prawe. Host A wysyła dane TCP do serwera B na port `8080`.

W pierwszym przebiegu obowiązują założenia:

```
IPv4 i TCP
brak NAT
brak tunelu
brak fragmentacji
jeden obserwowany segment danych
router nie przetrzymuje datagramu przez pełną sekundę
```

Te założenia są częścią zadania. Bez nich zmiana adresu IP, portu albo liczby pakietów mogłaby być poprawnym skutkiem dodatkowego mechanizmu.

## 📦 Zbuduj jednostki od środka

Aplikacja przekazuje do TCP bajty:

```
GET /health HTTP/1.1\r\nHost: lab.example\r\n\r\n
```

TCP dodaje informacje potrzebne do połączenia i porządkowania bajtów. W badanej próbce zapisujesz:

```
TCP
src port: 51000
dst port: 8080
seq:      1001
flags:    PSH, ACK
payload:  43 bajty
```

Nagłówek TCP razem z danymi tworzy segment. IPv4 przenosi ten segment jako swoje dane:

```
IPv4
src:      192.0.2.10
dst:      198.51.100.20
TTL:      64
protocol: TCP
payload:  segment TCP
```

Na konkretnym łączu datagram IPv4 staje się danymi ramki Ethernet:

```
Ethernet
src MAC:   MAC A
dst MAC:   MAC R-L
EtherType: IPv4
payload:   datagram IPv4
```

To jest enkapsulacja użyteczna w analizie: każde pole sterujące ma właściciela i zakres. Port docelowy należy do TCP. Docelowy adres IP należy do IPv4. Docelowy MAC należy do bieżącego łącza.

## 🚪 Najpierw wybierz następny krok

Serwer B nie jest w lokalnym prefiksie hosta A. Tablica routingu wybiera więc router `192.0.2.1` jako następny krok.

ARP rozwiązuje adres tego lokalnego następnego kroku na `MAC R-L`. Dlatego pierwsza ramka ma:

```
dst IP:  198.51.100.20
dst MAC: MAC R-L
```

Te cele nie są sprzeczne. IP opisuje końcowy cel datagramu. MAC opisuje odbiorcę na jednym łączu. Host A nie pyta ARP o MAC zdalnego serwera B.

## 🔁 Router wymienia ramkę

Punkt `P0` rejestruje:

```
Ethernet: MAC A -> MAC R-L
IPv4:     192.0.2.10 -> 198.51.100.20, TTL 64, protocol TCP
TCP:      51000 -> 8080, seq 1001, payload 43 B
```

Router odbiera ramkę przeznaczoną do jego lewego interfejsu. Wyodrębnia datagram IPv4, wybiera trasę według docelowego IP i zmniejsza TTL przed przekazaniem.

Na prawym łączu tworzy nową ramkę dla następnego kroku. Punkt `P1` rejestruje:

```
Ethernet: MAC R-P -> MAC B
IPv4:     192.0.2.10 -> 198.51.100.20, TTL 63, protocol TCP
TCP:      51000 -> 8080, seq 1001, payload 43 B
```

W tym kontrolowanym przebiegu:

```
zmienione:     źródłowy MAC, docelowy MAC, TTL, suma nagłówka IPv4
zachowane:     źródłowy IP, docelowy IP, porty, seq, dane TCP
nowe lokalnie: ramka prawego łącza i jej FCS
```

Suma nagłówka IPv4 zmienia się, ponieważ zmienił się TTL. Suma TCP nie obejmuje TTL. Obejmuje jednak segment oraz pseudonagłówek z adresami IP. W tym przebiegu adresy, porty i dane TCP są zachowane, więc router nie musi przebudowywać segmentu.

FCS chroni ramkę na jednym łączu. Nowa ramka otrzymuje własny FCS. Nie każde miejsce przechwycenia pokazuje to pole, ponieważ sprzęt może je sprawdzić lub dodać poza punktem widocznym dla programu.

## 🧩 Odbiorca rozdziela po polach

Serwer B odbiera ramkę skierowaną do `MAC B`. `EtherType` wskazuje IPv4, więc zawartość trafia do obsługi IPv4.

Docelowy IP pasuje do serwera. Pole `protocol` wskazuje TCP. Docelowy port `8080` pozwala przekazać bajty do właściwego gniazda aplikacji.

Dekapsulacja nie oznacza, że każdy nagłówek znika bez śladu w osobnym programie. To kolejne interpretacje granic danych i przekazywanie właściwej zawartości do następnego mechanizmu.

## 🔬 Punkt pomiaru ogranicza wniosek

Jeśli `P0` widzi ramkę, a `P1` jej nie widzi, możesz potwierdzić tylko obecność ramki w `P0` i brak pasującej obserwacji w `P1`.

Nie rozstrzyga to automatycznie, że router odrzucił datagram. Przyczyną może być także:

```
inna trasa wyjściowa
filtr przechwytywania
błędne położenie punktu P1
utrata danych pomiarowych
faktyczne odrzucenie przed P1
```

Najpierw powiąż obserwacje za pomocą pól IP, TCP, długości i czasu. Potem sprawdź licznik odrzuceń lub wykonaj pomiar bliżej interfejsu wyjściowego. Brak w jednym pliku przechwycenia nie jest jeszcze dowodem przyczyny.

## 🧾 Użyj raportu zmiany pól

Dla każdego przypadku zapisz:

```
założenia topologii
punkt i kierunek pomiaru
ramka: src MAC, dst MAC, EtherType
IPv4: src, dst, TTL, protocol
TCP: porty, seq, długość danych
pola zachowane
pola zmienione i mechanizm zmiany
najsilniejszy wniosek
brakujący dowód i następny pomiar
```

Raport nie wymaga zapamiętania nazw wszystkich jednostek danych. Wymaga przypisania pola do zakresu, porównania dwóch śladów i obrony wniosku.

## 🛠️ Punkt kontrolny: odtwórz prawą ramkę

<data-gate>
  <data-quiz>
    <question>W opisanym przebiegu bez NAT i tunelu punkt P0 widzi ramkę od `MAC A` do `MAC R-L`, datagram od `192.0.2.10` do `198.51.100.20`, TTL 64 oraz TCP z portu `51000` do `8080`, seq 1001. Co powinien zobaczyć P1 po poprawnym przekazaniu przez router?</question>
    <options>
      <option>Te same adresy MAC i TTL 64, ponieważ router przekazuje całą ramkę bez zmian.</option>
      <option correct>Nową ramkę od `MAC R-P` do `MAC B`, te same adresy IP i pola TCP oraz TTL zmniejszony do 63.</option>
      <option>Adres IP serwera zastąpiony adresem routera, a docelowy port usunięty.</option>
      <option>Nową ramkę z docelowym `MAC A`, ponieważ odpowiedź będzie wracała do nadawcy.</option>
    </options>
    <div data-hint="error">Oddziel zakres łącza od zakresu datagramu. Router jest odbiorcą pierwszej ramki, ale serwer pozostaje celem IP.</div>
    <div data-hint="success">Router kończy jedną ramkę i tworzy następną. W założonym przebiegu zachowuje cele IP oraz segment TCP, a zmienia pola lokalnego łącza i TTL.</div>
  </data-quiz>
</data-gate>

## 🧪 Porównaj cztery przebiegi

Przygotuj raport zmiany pól dla każdego przypadku.

```
A. P0: MAC A -> MAC R-L, IP A -> IP B, TTL 64, TCP 51000 -> 8080
   P1: MAC R-P -> MAC B, IP A -> IP B, TTL 63, TCP 51000 -> 8080

B. Trasa hosta wskazuje router jako następny krok.
   P0: dst MAC = MAC B, dst IP = IP B

C. P0 widzi poprawną ramkę do MAC R-L.
   P1 nie zawiera pasującej obserwacji.

D. P0: IP A -> IP B, TTL 1, TCP 51000 -> 8080
   P0 później widzi ICMP Time Exceeded od routera,
   które cytuje nagłówek tej sondy.
```

Kryteria ukończenia:

- ramka lokalna i datagram końcowy mają osobno nazwane cele;
- zmiana MAC na routerze nie jest nazywana zmianą celu IP;
- TTL jest zmniejszony przy przekazaniu, a datagram z wyczerpanym TTL nie pojawia się jako zwykły ruch na P1;
- brak obserwacji w P1 nie staje się automatycznie dowodem odrzucenia;
- przypadek B wykrywa niezgodność między trasą przez router a docelowym MAC;
- każdy wniosek wskazuje pole lub parę obserwacji, na której się opiera.

Zmień założenia: router wykonuje NAPT i mapuje `192.0.2.10:51000` na `198.51.100.1:62000`. Zapisz oczekiwany ślad P1 oraz wyjaśnij, dlaczego suma TCP musi zostać dostosowana.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A router poprawnie zastąpił ramkę lewego łącza ramką prawego łącza. Adresy IP, porty, sekwencja i dane wiążą oba ślady. TTL mniejszy o jeden potwierdza operację przekazania IPv4 między punktami.

W B docelowy MAC nie pasuje do założonej decyzji routingu. Dla zdalnego IP host powinien zbudować ramkę do MAC lokalnego następnego kroku. Sprawdź prefiks, wybraną trasę i wpis ARP dla routera. Sam ślad nie wyjaśnia jeszcze, czy błędne jest założenie topologii, konfiguracja hosta czy opis punktu pomiaru.

W C potwierdzono wysłanie ramki do routera, ale nie potwierdzono jej obecności w P1. Sprawdź interfejs wyjściowy wybrany przez trasę, filtr i liczniki punktu P1 oraz liczniki odrzuceń routera. Dopiero drugi dowód może odróżnić brak przekazania od braku obserwacji.

W D router nie może przekazać zwykłego datagramu z TTL zmniejszonym do zera. Cytowany nagłówek w ICMP wiąże komunikat z badaną sondą. P1 nie powinien pokazać tej sondy jako poprawnie przekazanego datagramu do serwera.

Po włączeniu NAPT oczekiwany P1 wygląda tak:

```
Ethernet: MAC R-P -> MAC B
IPv4:     198.51.100.1 -> 198.51.100.20, TTL 63, protocol TCP
TCP:      62000 -> 8080, seq 1001, payload 43 B
```

Zmieniły się źródłowy adres IP i źródłowy port. Suma TCP obejmuje nagłówek, dane oraz pseudonagłówek zawierający adresy IP. Translator musi więc dostosować sumę TCP, a także sumę zmienionego nagłówka IPv4. Cel IP, port docelowy, sekwencja i dane pozostają powiązaniem z pierwotnym przepływem.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Pole ma właściciela i zakres.** MAC dotyczy łącza, IP datagramu, a port segmentu transportowego.
- **Router wymienia ramkę podczas przekazania.** W zwykłym przebiegu zachowuje cel IP i segment TCP, a zmniejsza TTL.
- **Następny krok nie jest końcowym celem.** Zdalny IP może być przenoszony w ramce do lokalnego MAC routera.
- **Dwa ślady łączysz po wielu polach.** Jedna zgodna wartość nie wystarcza do przypisania pakietów.
- **Brak obserwacji ma granicę.** Potwierdza brak danych w punkcie pomiaru, nie automatycznie przyczynę straty.
