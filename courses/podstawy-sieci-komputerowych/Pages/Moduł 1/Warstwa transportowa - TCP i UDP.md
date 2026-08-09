# Warstwa transportowa - TCP i UDP

Program wysyła kolejno trzy pomiary: `41`, `42`, `43`. Pakiet z drugim pomiarem ginie, a trzeci dociera. Co zobaczy odbiorca: przerwę, opóźnienie czy dane w innej postaci?

Sam adres IP doprowadził ruch do właściwego urządzenia. Teraz rozstrzygniesz, jak port kieruje dane do właściwego punktu komunikacji oraz co aplikacja dostaje od TCP i UDP po stracie danych.

## 🧠 Najpierw przewidź odbiór

Nadawca wykonuje trzy operacje wysłania:

```text
wyślij "41"
wyślij "42"
wyślij "43"
```

Sieć traci pakiet przenoszący `42`, a przepuszcza pakiet z `43`. W wariancie TCP transport spróbuje odzyskać brakujące bajty. W wariancie UDP nie ma wbudowanej retransmisji.

Zapisz osobne przewidywania:

1. Co aplikacja odbierająca może zobaczyć podczas użycia TCP?
2. Co może zobaczyć podczas użycia UDP?
3. Która warstwa musi zdecydować, czy pomiar `42` nadal ma wartość po opóźnieniu?

Nie wystarczy odpowiedź „TCP jest pewne, UDP jest szybkie”. Potrzebujesz modelu danych widzianych przez aplikację.

## 🚪 Port rozdziela punkty komunikacji

Na jednym urządzeniu wiele aplikacji korzysta równocześnie z sieci. TCP i UDP mają 16-bitowe numery portów od 0 do 65535. Port docelowy pomaga systemowi skierować dane do właściwego punktu komunikacji.

Port nie jest trwałym numerem procesu. Proces może otworzyć kilka punktów komunikacji, zakończyć się albo użyć numeru ustalonego dynamicznie. Ten sam numer ma też osobne znaczenie dla TCP i UDP.

Sesję danego protokołu rozróżnia zestaw wartości:

```text
protokół transportowy
adres IP źródła : port źródłowy
adres IP celu   : port docelowy
```

Przykład:

```text
TCP 192.0.2.10:53000 -> 198.51.100.7:443
TCP 192.0.2.10:53001 -> 198.51.100.7:443
```

Obie sesje trafiają do usługi nasłuchującej na porcie `443`, ale różne porty źródłowe pozwalają odróżnić ich ruch. Numer `443` jest powszechnie zarejestrowany dla HTTPS, lecz numer portu sam nie dowodzi, jaki protokół aplikacyjny rzeczywiście działa ani czy ruch jest bezpieczny.

## 🌊 TCP przekazuje strumień bajtów

TCP udostępnia aplikacji niezawodny, uporządkowany strumień bajtów. Wykrywa straty za pomocą numerów sekwencji i odzyskuje brakujące dane przez retransmisję.

Jeśli fragment zawierający `42` zaginie, odbiorca TCP może już mieć późniejsze bajty, lecz nie odda ich aplikacji przed uzupełnieniem luki. Aplikacja zobaczy dane we właściwej kolejności po odzyskaniu brakującego fragmentu.

TCP nie zachowuje jednak granic operacji wysłania. Trzy wywołania nadawcy nie muszą dać trzech odczytów odbiorcy:

```text
nadawca:  "41" | "42" | "43"
odbiorca: "414243"
```

Możliwy jest także podział jednego zapisu na kilka odczytów. Dlatego protokół aplikacyjny pracujący nad TCP musi sam określić granice wiadomości, na przykład długością albo jednoznacznym separatorem.

W rozważanym przypadku TCP zapewni kolejność `41`, `42`, `43`, ale utrata `42` może opóźnić przekazanie późniejszych bajtów do aplikacji. To koszt wybranego kontraktu, nie dowód, że TCP jest zawsze wolne.

## 📦 UDP przekazuje osobne datagramy

UDP udostępnia aplikacji osobne datagramy. Jedna operacja wysłania odpowiada jednemu datagramowi, a odbiorca zachowuje jego granice.

UDP nie gwarantuje jednak dostarczenia ani ochrony przed duplikatami. Datagramy mogą zginąć, dotrzeć poza kolejnością albo pojawić się ponownie.

Dla początkowego przypadku aplikacja może otrzymać:

```text
datagram "41"
datagram "43"
```

Sam UDP nie czeka na `42` i go nie odtwarza. Jeżeli kolejność ma znaczenie, aplikacja potrzebuje własnego numeru sekwencji. Jeżeli utracony pomiar trzeba odzyskać, potrzebuje potwierdzeń i retransmisji albo transportu, który już je zapewnia.

Brak mechanizmów TCP nie oznacza zgody na wysyłanie bez ograniczeń. Aplikacja korzystająca z UDP w Internecie nadal musi reagować na przeciążenie i nie może zakładać dowolnej przepustowości.

## ⚖️ Wybierasz kontrakt, nie etykietę aplikacji

Nazwy zastosowań nie wystarczają do wyboru transportu. „Wideo używa UDP”, „HTTP używa TCP” i „UDP jest szybsze” to skróty, które zawodzą przy współczesnych protokołach.

Zacznij od pytań:

1. Czy odbiorca potrzebuje każdego bajtu i dokładnej kolejności?
2. Czy spóźniona wiadomość nadal ma wartość?
3. Czy aplikacja rozumie duplikaty, luki i zmianę kolejności?
4. Czy potrzebuje strumienia bajtów, czy oddzielnych wiadomości?
5. Kto zapewni kontrolę przeciążenia i bezpieczeństwo?

Jeśli potrzebujesz niezawodnego, uporządkowanego strumienia, TCP daje taki kontrakt. Nadal musisz dodać granice wiadomości i reguły protokołu aplikacyjnego.

Jeśli pojedyncze wiadomości mogą się zestarzeć, a aplikacja potrafi obsłużyć luki i duplikaty, UDP może być właściwą podstawą. Wtedy odpowiedzialność nie znika, tylko przechodzi wyżej.

QUIC pokazuje granicę prostego porównania. Jest transportem opartym na UDP, ale sam dodaje bezpieczne połączenia, niezawodne strumienie i kontrolę przeciążenia. Wybór UDP na najniższym poziomie nie przesądza więc o właściwościach całej usługi.

## 🛠️ Punkt kontrolny: granice odczytu TCP

<data-gate>
  <data-quiz>
    <question>Nadawca TCP wykonuje dwa zapisy: najpierw `ALA`, potem `MAK`. Odbiorca otrzymuje w jednym odczycie `ALAMAK`. Który wniosek jest poprawny?</question>
    <options>
      <option>Sieć uszkodziła dane, ponieważ każdy zapis TCP powinien dać osobny odczyt.</option>
      <option correct>To poprawne zachowanie strumienia TCP. Aplikacja musi sama wyznaczać granice swoich wiadomości.</option>
      <option>TCP zamieniło dwa segmenty miejscami, ale ukryło błąd przed aplikacją.</option>
      <option>Port docelowy połączył wiadomości dwóch różnych sesji.</option>
    </options>
    <div data-hint="error">Porównaj strumień z datagramem. TCP chroni kolejność bajtów, lecz nie obiecuje zachowania granic poszczególnych operacji zapisu.</div>
    <div data-hint="success">Bajty pozostały w kolejności, ale dwa zapisy zostały odczytane razem. Protokół aplikacyjny potrzebuje długości, separatora albo innej reguły ramkowania wiadomości.</div>
  </data-quiz>
</data-gate>

## 🧪 Zaprojektuj odbiór dwóch usług

Projektujesz dwa niezależne kanały.

Kanał A przesyła polecenia sterownika:

```text
SET temperatura 20
SET temperatura 25
```

Każde polecenie musi dotrzeć, a kolejność zmienia wynik. Kanał B wysyła co sekundę aktualną pozycję obiektu. Pozycja sprzed pięciu sekund nie powinna zastąpić nowszej.

Dla każdego kanału zapisz:

1. wymagany kontrakt odbioru;
2. wybór TCP albo UDP jako podstawy;
3. informację, którą aplikacja musi dodać do danych;
4. reakcję na stratę, duplikat i spóźnione dane;
5. rolę portu docelowego.

Kryteria ukończenia:

- dla kanału A uwzględniasz brak granic wiadomości w TCP;
- dla kanału B nie mylisz zachowania granic datagramu z gwarancją dostarczenia;
- wskazujesz, kto odpowiada za wykrywanie danych starych i zduplikowanych;
- nie przypisujesz szyfrowania automatycznie ani TCP, ani UDP;
- port służy do skierowania danych do punktu komunikacji, a nie do dowodzenia treści protokołu.

Zmień teraz warunek kanału B: audyt wymaga późniejszego odtworzenia każdego pomiaru. Oceń ponownie wybór. Możesz zmienić transport albo rozbudować protokół nad UDP, ale nazwij koszt brakującego mechanizmu.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Kanał A potrzebuje pełnej i uporządkowanej sekwencji. TCP zapewnia strumień o tych właściwościach. Aplikacja musi jednak dodać granice poleceń, na przykład długość lub separator końca wiersza. Utracone bajty są odzyskiwane przez TCP, a późniejsze czekają na uzupełnienie luki. Port docelowy kieruje strumień do usługi sterownika, ale sam nie potwierdza formatu polecenia ani szyfrowania.

Kanał B może użyć UDP, ponieważ najnowszy stan ma większą wartość niż stan spóźniony. Każdy datagram powinien zawierać co najmniej numer sekwencji albo znacznik czasu oraz identyfikator obiektu. Aplikacja akceptuje nowszy stan, odrzuca duplikaty i dane starsze od już przyjętych, a lukę może zanotować bez czekania na retransmisję. Musi też kontrolować tempo wysyłania. Port docelowy kieruje datagram do odbiorcy tej usługi.

Po dodaniu wymogu audytu sama strategia „pomiń lukę” przestaje wystarczać. Można użyć niezawodnego transportu i zdefiniować granice rekordów albo dodać nad UDP potwierdzenia, retransmisję, przechowywanie historii i kontrolę przeciążenia. Druga droga odtwarza wiele mechanizmów gotowego transportu, więc wymaga osobnego uzasadnienia oraz testów.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **TCP daje uporządkowany strumień bajtów.** Odzyskuje straty, ale nie zachowuje granic operacji wysłania.
- **UDP daje osobne datagramy bez gwarancji dostarczenia.** Obsługa luk, duplikatów i spóźnionych danych należy do aplikacji albo protokołu zbudowanego wyżej.
- **Port pomaga rozdzielać komunikację.** Nie jest trwałym numerem procesu ani dowodem użycia konkretnej aplikacji.
- **Transport wybiera się z wymagań odbioru.** Nazwa zastosowania i rozmiar nagłówka nie zastępują analizy skutków straty oraz opóźnienia.
