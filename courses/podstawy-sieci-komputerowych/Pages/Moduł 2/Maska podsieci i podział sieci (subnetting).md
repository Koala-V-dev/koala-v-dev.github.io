# Maska podsieci i podział sieci (subnetting)

Masz pulę `192.0.2.0/24` i cztery zespoły o różnych potrzebach. Równy podział da części za małe albo niepotrzebnie duże.

W poprzedniej lekcji wyznaczałeś granice gotowego prefiksu. Teraz zaprojektujesz kilka niepokrywających się podsieci, uzasadnisz ich rozmiary i zostawisz widoczną rezerwę.

## 🧠 Zacznij od decyzji, nie od maski

Wymagania są następujące:

```
studio:             50 hostów
laboratorium:       20 hostów
kamery:             10 hostów
łącze punkt-punkt:   2 końce
```

Zapisz kolejność, w której przydzieliłbyś bloki. Obok każdego wymagania wpisz najmniejszy prefiks, który według ciebie wystarczy.

Nie sprawdzaj jeszcze rozwiązania. Ważne jest, czy po obliczeniach zmienisz swoją pierwszą decyzję.

## 📐 Dobierz rozmiar bloku

Zwykła podsieć z broadcastem potrzebuje dwóch adresów granicznych. Do liczby hostów dodaj więc `2`, a potem wybierz najmniejszą potęgę dwóch, która pomieści wynik.

Dla studia:

```
50 hostów + 2 adresy graniczne = 52 adresy
najmniejsza potęga dwóch nie mniejsza niż 52 = 64
64 adresy = 2^6, więc prefiks ma 32 - 6 = /26
```

Tę samą decyzję wykonaj dla pozostałych zwykłych podsieci:

```
laboratorium: 20 + 2 = 22 -> blok 32 adresów -> /27
kamery:       10 + 2 = 12 -> blok 16 adresów -> /28
```

Łącze punkt do punktu jest jawnym wyjątkiem. Jeśli oba urządzenia obsługują RFC 3021, blok `/31` daje dokładnie dwa adresy końców i nie używa broadcastu.

## 📦 Przydzielaj od największego

Najpierw ułóż wymagania malejąco według wielkości bloków. Duży blok ma mniej miejsc, w których może rozpocząć się poprawnie. Małe bloki łatwiej dopasować później.

Początek puli `192.0.2.0/24` można wypełnić tak:

```
studio          192.0.2.0/26      .0  do .63
laboratorium    192.0.2.64/27     .64 do .95
kamery          192.0.2.96/28     .96 do .111
łącze           192.0.2.112/31    .112 i .113
wolne                                .114 do .255
```

Każdy kolejny blok zaczyna się na granicy zgodnej z jego rozmiarem:

```
/26: wielokrotność 64
/27: wielokrotność 32
/28: wielokrotność 16
/31: liczba parzysta
```

Te wiersze nie są tabelą do zapamiętania. Wartość wynika z liczby adresów w wybranym bloku.

## 🔍 Sprawdź projekt trzema testami

Sam poprawny rozmiar nie wystarcza. Każdy przydział przechodzi trzy testy.

Test pojemności:

```
czy liczba dostępnych końcówek spełnia wymaganie?
```

Test granicy:

```
czy adres sieci jest wielokrotnością rozmiaru bloku?
```

Test kolizji:

```
czy zakres od adresu sieci do końca bloku nie przecina innego przydziału?
```

Przykład błędu: `192.0.2.80/27` ma dobry rozmiar dla laboratorium, ale złą granicę. Operacja AND sprowadzi ten zapis do sieci `192.0.2.64/27`.

Przykład drugiego błędu: `192.0.2.64/26` jest wyrównany i mieści 62 hosty, lecz obejmuje zakres `.64` do `.127`. Przeciąłby pokazane wcześniej bloki laboratorium, kamer i łącza.

## 🧾 Zapisz rezerwę uczciwie

Wolny zakres `.114` do `.255` nie jest jednym prefiksem CIDR. Początek `.114` nie jest wyrównany do bloku obejmującego całą tę przestrzeń.

W dokumentacji projektu zapisz więc wolny przedział albo rozłóż go na poprawnie wyrównane prefiksy. Nie zaokrąglaj go do większego bloku, bo taki zapis mógłby objąć już przydzielone adresy.

Rezerwa ma znaczenie dopiero wtedy, gdy wiadomo, gdzie leży i które przyszłe bloki mogą się w niej zmieścić.

## 🛠️ Punkt kontrolny: wybierz poprawny plan

<data-gate>
  <data-quiz>
    <question>Z puli `198.51.100.0/24` trzeba wydzielić zwykłe podsieci dla 70, 30 i 12 hostów. Który plan spełnia pojemność, wyrównanie i brak nakładania?</question>
    <options>
      <option>`198.51.100.0/26`, `198.51.100.64/27`, `198.51.100.96/28`</option>
      <option correct>`198.51.100.0/25`, `198.51.100.128/27`, `198.51.100.160/28`</option>
      <option>`198.51.100.0/25`, `198.51.100.120/27`, `198.51.100.152/28`</option>
      <option>`198.51.100.0/25`, `198.51.100.64/27`, `198.51.100.96/28`</option>
    </options>
    <div data-hint="error">Najpierw sprawdź pojemność dla 70 hostów. Potem wyznacz koniec każdego bloku i zobacz, czy następny zaczyna się za nim na własnej granicy.</div>
    <div data-hint="success">Blok `/25` mieści 126 hostów i kończy się na `.127`. `/27` zaczyna się na `.128` i kończy na `.159`. Następny wyrównany `/28` zaczyna się na `.160`.</div>
  </data-quiz>
</data-gate>

## 🧪 Zaprojektuj plan i obsłuż zmianę

Pula projektu to `203.0.113.0/24`.

```
pracownia:          60 hostów
biuro wsparcia:     28 hostów
urządzenia pomiarowe: 12 hostów
łącze punkt-punkt:   2 końce z obsługą RFC 3021
```

Przygotuj raport:

```
wymaganie
wybrany prefiks i dowód pojemności
adres sieci
koniec bloku
zakres końcówek
sprawdzenie granicy
sprawdzenie kolizji
pozostała wolna przestrzeń
```

Kryteria ukończenia:

- każdy blok mieści wymagane końcówki;
- żaden blok nie przecina innego;
- każdy adres sieci jest wyrównany do rozmiaru bloku;
- `/31` stosujesz tylko do jawnie opisanego łącza punkt do punktu;
- wolnej przestrzeni nie przedstawiasz jako jednego prefiksu bez sprawdzenia granicy.

Po wykonaniu projektu zmień wymaganie biura wsparcia z 28 na 40 hostów. Zaznacz wszystkie przydziały, które trzeba przenieść albo zmniejszyć. Nie wystarczy zmienić samego napisu `/27` na `/26`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Jedno poprawne rozmieszczenie zaczyna się od `203.0.113.0/26` dla pracowni. Blok obejmuje `.0` do `.63` i daje 62 adresy hostów.

Biuro wsparcia otrzymuje `203.0.113.64/27`, czyli zakres `.64` do `.95` oraz hosty `.65` do `.94`. Urządzenia pomiarowe mieszczą się w `203.0.113.96/28`, od `.96` do `.111`, z hostami `.97` do `.110`. Łącze używa `203.0.113.112/31`, więc jego końce to `.112` i `.113`.

Po wzroście biura do 40 hostów potrzebny jest blok `/26`. Zapis `203.0.113.64/26` jest wyrównany, ale obejmuje `.64` do `.127`. Przecina dotychczasowe bloki urządzeń pomiarowych i łącza. Możesz pozostawić pracownię na `.0/26`, rozszerzyć biuro do `.64/26`, a mniejsze przydziały przenieść za `.127`, na przykład urządzenia do `.128/28` i łącze do `.144/31`.

Zmiana jednego wymagania wpływa na sąsiadów. Właśnie dlatego raport zawiera zakresy i test kolizji, a nie tylko nazwy działów oraz prefiksy.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Rozmiar wynika z wymaganej liczby końcówek.** Dla zwykłej podsieci uwzględniasz adres sieci i broadcast.
- **Największe bloki przydzielasz najpierw.** Potem dopasowujesz mniejsze do pozostałych granic.
- **Każdy przydział sprawdzasz pod kątem pojemności, wyrównania i kolizji.** Sam prefiks nie dowodzi poprawności planu.
- **Rezerwa musi mieć jawny zakres.** Nie nazywasz jej jednym prefiksem bez kontroli wyrównania.
- **Zmiana wymagania może przesunąć sąsiednie podsieci.** Dobry plan pokazuje zależności i pozwala je ponownie sprawdzić.
