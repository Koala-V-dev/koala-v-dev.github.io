# Czym jest sieć komputerowa

Masz laptop i drukarkę. Oba urządzenia działają poprawnie. Samo ustawienie ich obok siebie nie wystarczy jednak, aby wysłać dokument do druku.

Urządzenia potrzebują drogi, sposobu rozpoznania odbiorcy oraz wspólnych reguł wymiany danych. Dopiero taki układ tworzy sieć, z której można świadomie korzystać i którą można diagnozować.

W tej lekcji zbudujesz pierwszy model sieci. Po jej ukończeniu rozpoznasz host, połączenie i urządzenie pośredniczące. Wyjaśnisz też, dlaczego samo podłączenie kabla nie gwarantuje komunikacji.

## 🏗️ Sieć to współpracujący system

NIST opisuje sieć jako system utworzony z połączonych komponentów. W praktyce technicznej potrzebujemy jeszcze jednego warunku: komponenty muszą potrafić wymieniać dane według zgodnych reguł.

<strong>**Sieć komputerowa** to system połączonych urządzeń, które wymieniają dane za pomocą uzgodnionych protokołów.</strong>

W tej definicji każde słowo wykonuje konkretną pracę:

- **system** oznacza, że wynik zależy od współdziałania wielu elementów;
- **połączone urządzenia** mają fizyczną albo bezprzewodową drogę przesyłania sygnału;
- **wymiana danych** ma nadawcę, odbiorcę i określony cel;
- **protokół** określa reguły, według których urządzenia tworzą, wysyłają i odczytują dane.

Dwa urządzenia połączone kablem mogą nadal się nie komunikować. Kabel zapewnia drogę dla sygnału, ale nie naprawi wyłączonego interfejsu, niezgodnego protokołu ani błędnego wskazania odbiorcy.

> [!NOTE]
> Sieć nie musi mieć dostępu do Internetu. Laptop i drukarka połączone we wspólnej sieci lokalnej mogą wymieniać dane nawet wtedy, gdy router nie ma połączenia z operatorem.

## 💻 Host rozpoczyna albo kończy wymianę

Komputer, telefon, serwer lub drukarka sieciowa może pełnić rolę *hosta*. Jest to urządzenie, które stanowi źródło albo cel danych w sieci.

Gdy wysyłasz dokument do drukarki:

```text
laptop                         drukarka
źródło danych  ───────────►  cel danych
```

Role nie są przypisane na stałe. Drukarka odbiera dokument, ale może też wysłać do laptopa informację o braku papieru. Wtedy staje się źródłem komunikatu.

Nie każde urządzenie w sieci jest hostem w tym samym sensie. Przełącznik i router przede wszystkim przekazują ruch dalej. Nie są miejscem, w którym użytkownik otwiera wysłane zdjęcie lub dokument.

## 🔗 Połączenie przenosi sygnał

Urządzenia wymieniają dane przez *łącze*. Łącze może wykorzystywać:

- przewód miedziany;
- światłowód;
- fale radiowe, na przykład Wi-Fi.

Łącze nie przenosi pojęć takich jak „zdjęcie” albo „strona internetowa”. Przenosi sygnał fizyczny. Sprzęt i oprogramowanie kodują w tym sygnale bity, które znasz z kursu Binarne Fundamenty IT.

Szczegóły kodowania sygnału należą do kolejnych lekcji. Na tym etapie wystarczy rozdzielić dwie rzeczy:

```text
łącze = droga dla sygnału
protokół = reguły interpretowania wymiany
```

Ta różnica przydaje się w diagnostyce. Świecąca dioda portu może potwierdzić aktywne połączenie fizyczne. Nie potwierdza jeszcze, że aplikacja umie porozumieć się z drugim urządzeniem.

## ⚙️ Protokół nadaje wymianie reguły

*Protokół sieciowy* opisuje format danych oraz zachowanie uczestników komunikacji. Urządzenie musi wiedzieć między innymi:

- jak rozpoznać początek i koniec jednostki danych;
- gdzie znajduje się informacja o odbiorcy;
- jak odróżnić treść od informacji sterujących;
- co zrobić po odebraniu poprawnych albo uszkodzonych danych.

Nie istnieje jeden protokół wykonujący całą pracę. Różne protokoły rozwiązują problemy na różnych etapach. W dalszej części kursu poznasz ich warstwy i zależności.

> [!IMPORTANT]
> Niezawodność nie jest automatyczną właściwością każdej sieci ani każdego pakietu. Protokół IP może dostarczyć datagram uszkodzony, zduplikowany, poza kolejnością albo nie dostarczyć go wcale. Gdy aplikacja potrzebuje niezawodnego i uporządkowanego strumienia, może użyć protokołu transportowego takiego jak TCP, który wykrywa straty i wykonuje retransmisję.

## 📦 Dane otrzymują opakowania

Duża wiadomość nie porusza się przez całą sieć jako jeden nieopisany blok. Kolejne protokoły dodają informacje potrzebne na swoim etapie przesyłania.

W dokumentacji Internetu spotkasz kilka precyzyjnych nazw:

- *segment* odnosi się do jednostki protokołu TCP;
- *datagram IP* zawiera nagłówek IP oraz dane protokołu wyższej warstwy;
- *ramka* jest jednostką przesyłaną przez protokół warstwy łącza.

W mowie potocznej wszystkie te jednostki bywają nazywane „pakietami”. W tej lekcji możesz używać słowa *pakiet* jako nazwy ogólnej. W kolejnych modułach będziemy rozróżniać nazwy zgodnie z warstwą.

```text
ramka  [ informacje łącza | pakiet IP [ informacje IP | dane ] ]
```

Opakowanie nie gwarantuje dostarczenia. Zawiera informacje, dzięki którym urządzenia mogą podjąć właściwe decyzje na danym etapie.

## 🔀 Urządzenia pośredniczące wybierają dalszą drogę

Bezpośrednie połączenie dwóch urządzeń jest możliwe, lecz typowa sieć zawiera elementy przekazujące ruch.

### 🔌 Przełącznik w sieci lokalnej

*Przełącznik* (*switch*) łączy urządzenia należące do tej samej sieci lokalnej. Odbiera ramkę na jednym porcie i przekazuje ją dalej zgodnie z informacjami warstwy łącza.

Na tym etapie nie musisz znać adresów MAC ani tablicy przełączania. Ważna jest rola: przełącznik pomaga dostarczyć ramkę wewnątrz lokalnego połączenia.

### 📡 Punkt dostępu dla urządzeń bezprzewodowych

*Punkt dostępu* (*access point*, AP) łączy bezprzewodowych klientów z systemem dystrybucyjnym, którym często jest przewodowa sieć organizacji.

Domowe urządzenie nazywane „routerem Wi-Fi” zwykle łączy kilka funkcji w jednej obudowie. Może działać jednocześnie jako punkt dostępu, przełącznik, router i zapora. Jedna obudowa nie oznacza jednej roli.

### 🧭 Router pomiędzy sieciami

*Router* przekazuje pakiety pomiędzy różnymi sieciami. Interpretuje adres IP celu i wybiera następny etap drogi.

Internet jest połączeniem wielu niezależnych sieci. Routery umożliwiają przechodzenie pakietów z jednej sieci do następnej aż do osiągnięcia celu.

```text
laptop ─► punkt dostępu ─► router ─► inne sieci ─► serwer
 host          AP          router                     host
```

Pakiety pomiędzy daną parą hostów zazwyczaj korzystają w danym momencie z tej samej ścieżki. Trasa może się jednak zmienić, gdy zmieni się stan lub konfiguracja sieci. Droga w stronę serwera nie musi być identyczna z drogą powrotną.

## 🛠️ Punkt kontrolny: czego brakuje do komunikacji

<data-gate>
  <data-quiz>
    <question>Laptop jest połączony z przełącznikiem sprawnym kablem. Dioda portu świeci. Program nie potrafi jednak wysłać zadania do drukarki, ponieważ używa formatu, którego drukarka nie obsługuje. Który element modelu zawiódł?</question>
    <options>
      <option>Łącze, ponieważ świecąca dioda oznacza uszkodzenie przewodu.</option>
      <option correct>Reguły komunikacji, ponieważ istnieje droga dla sygnału, ale urządzenia nie potrafią zgodnie zinterpretować wymiany.</option>
      <option>Host, ponieważ drukarka sieciowa nie może być celem danych.</option>
      <option>Router, ponieważ każda komunikacja w sieci lokalnej musi przejść przez router.</option>
    </options>
    <div data-hint="error">Oddziel potwierdzone połączenie fizyczne od sposobu interpretowania danych. Który z tych dwóch elementów opisuje format wymiany?</div>
    <div data-hint="success">Aktywne łącze potwierdza drogę dla sygnału. Zgodny protokół lub format usługi jest osobnym warunkiem komunikacji.</div>
  </data-quiz>
</data-gate>

## 🧪 Rozpoznaj role w małej sieci

Przeanalizuj sytuację:

> Telefon wysyła zdjęcie przez Wi-Fi do serwera znajdującego się poza domem. Domowy punkt dostępu odbiera transmisję radiową. Router przekazuje pakiet do sieci operatora. Serwer zapisuje zdjęcie i odsyła potwierdzenie.

Spróbuj odpowiedzieć bez wracania do definicji:

1. Które urządzenia są hostami?
2. Który element zapewnia telefonowi dostęp bezprzewodowy?
3. Który element przekazuje pakiet pomiędzy siecią domową a siecią operatora?
4. Czy potwierdzenie zapisu może wrócić inną ścieżką niż zdjęcie?
5. Czy aktywne Wi-Fi samo gwarantuje, że serwer zapisze zdjęcie?

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Telefon i serwer są hostami tej wymiany. Punkt dostępu dołącza telefon bezprzewodowo, a router przekazuje pakiet pomiędzy siecią domową i siecią operatora.

Potwierdzenie może wrócić inną ścieżką, choć w stabilnej sieci trasy często pozostają takie same przez dłuższy czas. Aktywne Wi-Fi nie gwarantuje zapisu zdjęcia. Potwierdza lokalne połączenie radiowe, ale nie działanie wszystkich dalszych protokołów ani usługi serwera.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Sieć jest systemem współpracujących elementów.** Potrzebuje urządzeń, łącza i zgodnych reguł wymiany danych.
- **Host jest źródłem albo celem danych.** Rola zależy od konkretnej wymiany, dlatego drukarka może odebrać dokument i później wysłać komunikat o stanie.
- **Łącze i protokół rozwiązują inne problemy.** Pierwsze przenosi sygnał, a drugi określa sposób tworzenia i interpretowania wymiany.
- **Przełącznik pomaga przekazywać ramki lokalnie, a router łączy różne sieci.** Punkt dostępu dołącza klientów bezprzewodowych do sieci.
- **IP nie gwarantuje dostarczenia ani kolejności.** Niezawodność zapewnia dopiero odpowiedni protokół wyższej warstwy, jeśli aplikacja jej potrzebuje.
