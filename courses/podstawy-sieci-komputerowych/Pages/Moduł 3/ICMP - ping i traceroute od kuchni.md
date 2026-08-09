# ICMP - ping i traceroute od kuchni

Brak odpowiedzi na ping bywa opisywany jako „host nie działa”. To tylko jedna z kilku możliwości. Żądanie mogło zginąć, odpowiedź mogła zostać odfiltrowana, a host mógł świadomie nie odpowiadać na Echo Request.

W tej lekcji odczytasz, co naprawdę potwierdza Echo Reply, komunikat błędu i brak odpowiedzi. Potem wybierzesz sondę, która wnosi nowy dowód.

## 🧠 Zacznij od najsilniejszego wniosku

Otrzymujesz wynik:

```
Echo Request  id=42 seq=3 -> 203.0.113.20
Echo Reply    id=42 seq=3 <- 203.0.113.20
RTT 18 ms
```

Uzupełnij:

```
ten wynik potwierdza...
ten wynik nie potwierdza...
```

Nie używaj ogólnego zdania „sieć działa”. Nazwij konkretny protokół, próbkę i kierunek odpowiedzi.

## 📬 Echo potwierdza jedną wymianę

ICMPv4 jest częścią mechanizmów IP. Echo Request oraz Echo Reply pozwalają sprawdzić, czy dla danej próbki odpowiedź wróciła do nadawcy.

Identyfikator i numer sekwencyjny łączą odpowiedź z żądaniem:

```
id=42 seq=3 -> id=42 seq=3
```

Echo Reply od `203.0.113.20` potwierdza, że żądanie dotarło do węzła odpowiadającego za ten adres oraz że odpowiedź wróciła. RTT jest czasem całej tej drogi tam i z powrotem dla jednej próbki.

Nie potwierdza to, że usługa HTTPS działa, że kolejne pakiety wybiorą identyczną trasę ani że opóźnienie w jedną stronę wynosi połowę RTT.

## 🕳️ Brak odpowiedzi jest słabym dowodem

Ślad zawiera Echo Request, ale nie zawiera pasującego Echo Reply ani błędu ICMP.

```
Echo Request id=43 seq=1 -> 203.0.113.20
timeout
```

Możesz powiedzieć tylko, że odpowiedź nie dotarła do miejsca obserwacji w oczekiwanym czasie.

Taki wynik nie rozróżnia:

```
straty żądania
braku odpowiedzi w węźle docelowym
straty odpowiedzi
filtrowania ICMP
ograniczania częstotliwości odpowiedzi
```

Następna sonda powinna zmienić jeden warunek. Przykładowo sprawdź TCP do portu rzeczywistej usługi albo obserwuj żądanie bliżej celu. Powtórzenie identycznego ping bez planu daje więcej próbek, ale nie zawsze rozdziela przyczyny.

## 🧾 Czytaj komunikat razem z cytowaną sondą

Komunikat ICMP Destination Unreachable zawiera fragment pierwotnego datagramu. Dzięki temu nadawca może połączyć błąd z właściwą sondą.

Przykład:

```
wysłano UDP 192.0.2.10:53000 -> 203.0.113.20:33450
otrzymano ICMP Destination Unreachable, port unreachable
cytowany pakiet: UDP 192.0.2.10:53000 -> 203.0.113.20:33450
źródło ICMP: 203.0.113.20
```

Najsilniejszy wniosek: węzeł pod adresem docelowym otrzymał tę sondę i zgłosił niedostępny port UDP. To nie znaczy, że wszystkie porty są zamknięte ani że aplikacja na innym protokole nie działa.

Kod błędu jest użyteczny tylko z kontekstem cytowanego pakietu oraz źródłem komunikatu. Sam napis „unreachable” nie wystarcza do wskazania granicy.

## 🪜 Traceroute zmienia TTL sondy

Router zmniejsza TTL pakietu IPv4 podczas przekazywania. Gdy TTL wygaśnie w tranzycie, router może odesłać ICMP Time Exceeded.

Traceroute wysyła serie sond z rosnącym TTL:

```
TTL 1 -> odpowiedź Time Exceeded od pierwszego routera
TTL 2 -> odpowiedź Time Exceeded od kolejnego routera
TTL 3 -> następny punkt lub odpowiedź końcowa
```

Klasyczny wariant używa sond UDP i kończy po ICMP port unreachable od celu. Inne implementacje mogą używać ICMP Echo albo TCP. Interpretując wynik, sprawdź rodzaj sondy i warunek zakończenia.

Adres źródłowy Time Exceeded wskazuje urządzenie, które wygenerowało odpowiedź. Nie musi być jedynym routerem używanym przez zwykły ruch ani dowodem symetrycznej trasy powrotnej.

## ⭐ Nie zamieniaj gwiazdki w awarię

Wynik wygląda tak:

```
1  192.0.2.1
2  *
3  198.51.100.9
4  203.0.113.20  cel osiągnięty
```

Brak odpowiedzi dla TTL 2 oznacza brak widocznego komunikatu dla tych sond. Późniejsze odpowiedzi dowodzą, że co najmniej niektóre sondy z większym TTL dotarły dalej.

Węzeł na drugim etapie mógł przekazywać ruch, ale nie generować Time Exceeded, ograniczać jego częstotliwość albo wysyłać odpowiedź drogą, która nie wróciła. Przy wielu równoważnych trasach kolejne sondy mogą też przejść inną ścieżką.

Wysoki RTT jednego środkowego wiersza również nie dowodzi samodzielnie przeciążenia przekazywania. Router może odpowiadać na ICMP z niskim priorytetem. Jeżeli późniejsze RTT są niższe, szukaj potwierdzenia w pomiarach końcowych i ruchu aplikacji.

## 🛠️ Punkt kontrolny: zinterpretuj brak w środku

<data-gate>
  <data-quiz>
    <question>Traceroute pokazuje odpowiedź w kroku 1, `*` w kroku 2, odpowiedź routera w kroku 3 i osiągnięty cel w kroku 4. Który wniosek jest najlepiej uzasadniony?</question>
    <options>
      <option>Router w kroku 2 nie przekazuje żadnych pakietów.</option>
      <option correct>Nie otrzymano widocznej odpowiedzi dla sond kroku 2, ale późniejsze sondy dotarły dalej; sama gwiazdka nie dowodzi awarii przekazywania.</option>
      <option>Krok 2 na pewno blokuje cały ICMP w obu kierunkach.</option>
      <option>Cel został osiągnięty bez żadnych routerów pośrednich.</option>
    </options>
    <div data-hint="error">Porównaj gwiazdkę z dowodami z późniejszych kroków. Brak komunikatu z jednego TTL nie może unieważnić odpowiedzi, które przyszły zza tego miejsca.</div>
    <div data-hint="success">Gwiazda oznacza brak obserwowanej odpowiedzi dla tych sond. Późniejsze odpowiedzi ograniczają wniosek: przekazywanie co najmniej części sond było możliwe.</div>
  </data-quiz>
</data-gate>

## 🧪 Oceń cztery wyniki

Dla każdego wyniku przygotuj raport:

```
rodzaj sondy
pasująca odpowiedź lub jej brak
najsilniejszy pozytywny dowód
wniosek, którego nie wolno wyciągnąć
następna sonda zmieniająca jeden warunek
```

Wyniki:

```
A. Echo Reply od 203.0.113.20 dla id=42 seq=3, RTT 18 ms
B. ICMP port unreachable od 203.0.113.20 cytuje wysłaną sondę UDP
   do portu 33450
C. traceroute: odpowiedź w 1, gwiazda w 2, odpowiedź w 3, cel w 4
D. brak Echo Reply od 203.0.113.20, ale połączenie TCP do portu 443
   tego adresu kończy handshake
```

Kryteria ukończenia:

- Echo Reply nie jest dowodem działania dowolnej aplikacji;
- timeout nie jest nazywany dowodem wyłączenia hosta;
- ICMP port unreachable jest wiązany z cytowaną sondą i konkretnym portem;
- gwiazdka w środku nie unieważnia późniejszej odpowiedzi;
- następna sonda wnosi inne dane, zamiast tylko powtarzać ten sam wniosek.

Zmień D: TCP 443 również kończy się timeoutem, ale DNS zwraca oczekiwany adres, a lokalny router odpowiada na Echo. Zapisz, co zostało potwierdzone, czego nadal nie wiadomo i gdzie przesuniesz następny pomiar.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A cel odpowiedział na konkretną sondę Echo, a odpowiedź wróciła w 18 ms. Nie wiadomo z tego, czy działa HTTPS ani jaka była droga w jedną stronę.

W B źródło docelowe zgłosiło niedostępność portu UDP `33450` dla cytowanej sondy. To pozytywny dowód dotarcia tej sondy do stosu IP celu, ale nie ocena innych portów i protokołów.

W C brak odpowiedzi w kroku 2 dotyczy tylko widoczności odpowiedzi dla tych sond. Kroki 3 i 4 pokazują, że sondy z większym TTL dotarły dalej i do celu.

W D udany handshake TCP potwierdza ścieżkę potrzebną dla tej usługi, mimo braku Echo Reply. Najbardziej użyteczny wniosek to różnica w traktowaniu ICMP Echo i TCP 443, a nie „host nie działa”.

Po zmianie D rozpoznanie DNS potwierdza mapowanie nazwy na oczekiwany adres, a odpowiedź routera lokalny odcinek do następnego kroku dla ICMP. Nie wiadomo, gdzie dalej giną sondy ani czy cel je odbiera. Uruchom śledzenie z jawnym rodzajem sondy TCP do portu 443 i porównaj przechwycenie przy wyjściu lokalnej sieci z kolejnym dostępnym punktem. Pierwszy brak odpowiedzi po drodze nie staje się automatycznie przyczyną bez potwierdzenia z drugiej strony.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Echo Reply potwierdza konkretną wymianę ICMP.** Nie jest testem każdej usługi na hoście.
- **Timeout mówi o braku widocznej odpowiedzi.** Nie rozstrzyga, gdzie zginęło żądanie lub odpowiedź.
- **Błąd ICMP czytasz z cytowaną sondą.** Port unreachable dotyczy konkretnego protokołu i portu.
- **Traceroute wykorzystuje rosnący TTL.** Rodzaj sondy i warunek zakończenia zależą od implementacji.
- **Gwiazdka jest brakiem danych dla danego kroku.** Późniejsze odpowiedzi mogą dowodzić, że ruch dotarł dalej.
