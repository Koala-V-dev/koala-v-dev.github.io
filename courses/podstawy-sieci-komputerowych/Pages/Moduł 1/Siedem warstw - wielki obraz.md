# Siedem warstw - wielki obraz

Kontrolka połączenia świeci. Komputer ma adres IP. Strona się nie otwiera.

Te fakty nie znaczą: „sieć działa” albo „sieć nie działa”. Każdy z nich jest dowodem o ograniczonym zakresie. Po tej lekcji użyjesz modelu OSI, aby nazwać ten zakres i wybrać test, który naprawdę odróżnia możliwe przyczyny.

## 🧠 Najpierw wyznacz granicę dowodu

Wyobraź sobie taką sytuację:

```text
1. Interfejs sieciowy pokazuje aktywne łącze.
2. Odpowiedź ICMP Echo wraca z adresu serwera.
3. Aplikacja zgłasza: „Nie można połączyć”.
```

**ICMP Echo** to żądanie i odpowiedź przesyłane przez IP. Jego szczegóły poznasz później.

Zanim czytasz dalej, zdecyduj:

- który fakt jest najmocniejszym dowodem;
- czego ten fakt nadal nie sprawdza;
- jakiej jednej obserwacji potrzebujesz następnie.

Nie szukaj jeszcze numeru warstwy. Najpierw oddziel to, co zaobserwowane, od tego, co tylko przypuszczasz.

<info-block>
Odpowiedź ICMP potwierdza, że konkretna wymiana IP zadziałała w tym momencie. Nie potwierdza działania połączenia TCP ani samej aplikacji. Następny test powinien dotyczyć dokładnie usługi, z którą aplikacja próbuje się połączyć.
</info-block>

Jeśli wcześniej uznałeś, że odpowiedź ICMP dowodzi sprawności całej sieci, właśnie znalazłeś granicę swojego pierwszego modelu.

## 🧭 OSI porządkuje pytania, nie daje diagnozy

Model OSI dzieli komunikację na siedem zakresów odpowiedzialności. Każdy zakres korzysta z usługi niższego i dostarcza usługę wyższemu.

To model odniesienia, nie plan budowy programu. Obowiązująca publikacja ISO/IEC 7498-1:1994 nie definiuje kompletnego protokołu ani nie wymaga siedmiu osobnych modułów w każdej implementacji.

Poniższa mapa służy do jednej czynności: **zamień ogólny objaw na pytanie o granicę usługi**. Czytaj ją od objawu w prawej kolumnie do pytania w środkowej.

| Zakres OSI | Pytanie o usługę | Przykład obserwacji |
| :---: | :--- | :--- |
| 7. aplikacji | Czy operacja aplikacji daje oczekiwany wynik? | odpowiedź HTTP, komunikat DNS, wynik logowania |
| 6. prezentacji | Czy obie strony poprawnie reprezentują i przekształcają dane? | błąd formatu, kodowania albo ochrony danych |
| 5. sesji | Czy dialog jest ustanowiony, utrzymany i zsynchronizowany? | przerwana albo błędnie wznowiona wymiana |
| 4. transportowa | Czy wybrana usługa końcowa ma potrzebne właściwości? | ustanowienie, odmowa lub utrata połączenia TCP |
| 3. sieciowa | Czy dane przechodzą przez jedną lub kilka sieci? | odpowiedź IP z określonego adresu |
| 2. łącza danych | Czy jednostki danych są wymieniane przez dane łącze? | odebrana ramka, błąd dostępu do łącza |
| 1. fizyczna | Czy medium przenosi sygnał reprezentujący bity? | wykrycie sygnału albo utrata łącza |

Zakryj pierwszą kolumnę i spróbuj nazwać zakres na podstawie pytania. Potem zakryj kolumnę z obserwacją i wymyśl własny dowód. W ten sposób tabela staje się narzędziem klasyfikacji, a nie listą do wykucia.

Numer warstwy nie jest stałą etykietą urządzenia. Zapora, przełącznik wielowarstwowy albo system równoważenia ruchu może analizować informacje z kilku zakresów.

## 🔬 Przejdź od objawu do następnego testu

Wróć do początkowego przypadku. Wiemy już, że odpowiedź ICMP wraca, ale aplikacja nie działa.

### 🔎 1. Zapisz obserwację bez interpretacji

```text
Odpowiedź ICMP Echo wróciła z adresu serwera o 10:42.
```

Zdanie „warstwy 1-3 są sprawne” jest już interpretacją. Jest też zbyt szerokie: inny rodzaj ruchu może przechodzić inną politykę lub ujawnić inny błąd.

### 📏 2. Nazwij granicę wniosku

```text
Potwierdzone: ta wymiana IP zadziałała w chwili testu.
Niepotwierdzone: transport używany przez aplikację i działanie usługi.
```

Model OSI pomaga nazwać przejście od zakresu sieciowego do transportowego i aplikacyjnego. Nie mówi jeszcze, która przyczyna jest prawdziwa.

### 🎯 3. Wybierz test rozdzielający hipotezy

Rozważ dwie hipotezy:

```text
A. Usługa nie przyjmuje połączeń.
B. Polityka po drodze odrzuca tę próbę połączenia.
```

Potrzebujesz wyniku próby połączenia z właściwą usługą. Aktywna odmowa, brak odpowiedzi i poprawne ustanowienie połączenia są różnymi obserwacjami. Każda prowadzi do innego następnego pytania.

## 🔁 Skoryguj zbyt prosty model

W prawdziwym Internecie najczęściej używasz stosu opisanego w RFC 1122: łącza, Internetu, transportu i aplikacji. Nie jest on siedmiowarstwowym OSI.

Przybliżone mapowanie łączy warstwy aplikacji, prezentacji i sesji OSI z internetową warstwą aplikacji. Warstwa sieciowa odpowiada w przybliżeniu warstwie Internetu. Warstwy fizyczna i łącza są zwykle ujmowane razem jako dostęp do sieci.

To przybliżenie ma granice. RFC 1122 wprost wskazuje, że ścisłe warstwowanie nie opisuje wszystkich interakcji. Dlatego:

- TCP zapewnia aplikacji niezawodny, uporządkowany strumień bajtów;
- UDP udostępnia datagramy bez gwarancji dostarczenia i ochrony przed duplikatami;
- TLS korzysta z niezawodnego, uporządkowanego transportu i nie jest po prostu „warstwą 6 Internetu”;
- protokół dodaje własne informacje sterujące, więc nie istnieje reguła siedmiu obowiązkowych nagłówków.

Użyj tych zdań do poprawienia jednej popularnej diagnozy:

```text
„Ping działa, więc wszystkie niższe warstwy są dobre. Problem musi być w aplikacji.”
```

Lepsza wersja brzmi:

```text
„Odpowiedź ICMP potwierdza konkretną wymianę IP. Następnie sprawdzę transport
i usługę używaną przez aplikację, nie wykluczając niższych zakresów dla innego ruchu.”
```

## 🛠️ Punkt kontrolny: wybierz dowód

<data-gate>
  <data-quiz>
    <question>Komputer otrzymuje odpowiedź ICMP Echo od serwera. Chwilę później próba połączenia TCP z usługą na tym samym serwerze zostaje aktywnie odrzucona. Który następny krok jest najlepiej uzasadniony?</question>
    <options>
      <option>Wymienić kabel, ponieważ odmowa połączenia dowodzi uszkodzenia warstwy fizycznej.</option>
      <option>Zmienić adres IP klienta, ponieważ działający ICMP dowodzi błędnego routingu.</option>
      <option correct>Sprawdzić, czy oczekiwana usługa przyjmuje połączenia oraz czy polityka nie odrzuca tej próby TCP.</option>
      <option>Uznać zakresy 1-3 za bezwarunkowo sprawne dla każdego protokołu i każdej przyszłej próby.</option>
    </options>
    <div data-hint="error">Odpowiedź ICMP dotyczy konkretnej wymiany. Aktywna odmowa kieruje uwagę na próbę TCP i usługę, nie na sam kabel.</div>
    <div data-hint="success">Odmowa jest bardziej szczegółowym dowodem niż sam brak odpowiedzi. Sprawdź stan usługi i politykę dla tej próby. Wróć do niższych zakresów, jeśli nowe obserwacje temu zaprzeczą.</div>
  </data-quiz>
</data-gate>

## 🧪 Zbuduj i obroń łańcuch dowodów

Wybierz jeden przypadek:

```text
A. Nazwa serwera nie zamienia się na adres, ale połączenie z jego adresem działa.
B. TCP zostaje ustanowione, lecz TLS odrzuca certyfikat serwera.
C. Interfejs pokazuje aktywne łącze, ale nie ma odpowiedzi z żadnego adresu poza siecią lokalną.
```

Wykonaj cztery czynności:

1. Zapisz tylko zaobserwowany fakt. Nie używaj jeszcze numeru warstwy.
2. Wskaż najniższy potwierdzony zakres i pierwszą niewiadomą.
3. Podaj dwie różne hipotezy zgodne z obserwacją.
4. Wybierz test, którego możliwe wyniki rozdzielą te hipotezy.

Kryteria ukończenia:

- obserwacja nie zawiera ukrytej diagnozy;
- wniosek nie wykracza poza wynik testu;
- dwie hipotezy mogą wyjaśnić ten sam stan początkowy;
- następny test daje różne oczekiwane wyniki dla obu hipotez;
- potrafisz uzasadnić wybór testu bez recytowania siedmiu nazw warstw.

<details>
<summary>Sprawdź tok rozumowania po wykonaniu próby</summary>

W A faktem jest nieudane rozwiązanie nazwy oraz udane połączenie z podanym adresem. Pierwsza niewiadoma dotyczy drogi rozwiązywania nazwy. Hipotezy mogą obejmować błąd lokalnego resolvera oraz brak właściwych danych w źródle autorytatywnym. Porównaj identyczne pytanie w tych dwóch punktach i zachowaj status, odpowiedź oraz TTL.

W B ustanowione TCP potwierdza transport dla tej próby. Odrzucenie certyfikatu zatrzymuje wymianę w TLS. Dwie hipotezy to na przykład niezgodna nazwa certyfikatu oraz brak zaufanego wystawcy. Odczyt certyfikatu z właściwą nazwą serwera daje inne dowody dla tych przyczyn.

W C aktywne łącze potwierdza stan lokalnego interfejsu, nie trasę poza sieć. Hipotezy mogą obejmować brak poprawnej trasy domyślnej oraz niedostępny lokalny następny krok. Najpierw odczytaj wybraną trasę. Jeśli wskazuje router, sprawdź, czy próba rozwiązania jego adresu na lokalnym łączu otrzymuje odpowiedź.

To są wzorce granic, nie jedyne dozwolone hipotezy. Twoja para jest poprawna, jeśli obie przyczyny pasują do faktów, a wynik wybranego testu może jedną z nich osłabić.

</details>

Na koniec zamień przypadek z inną osobą. Jej zadaniem jest znaleźć jedno zdanie, w którym wniosek jest szerszy niż dowód. Jeśli takie zdanie znajdzie, popraw łańcuch i ponownie obroń następny test.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **OSI służy do wyznaczania granic pytań.** Numer warstwy nie jest diagnozą ani stałą etykietą urządzenia.
- **Obserwacja jest węższa niż ogólne „sieć działa”.** Zapisuj, jaki ruch, cel i moment objął test.
- **Następny test ma rozdzielać hipotezy.** Nie powtarzaj testu, który nie zmieni możliwych wyjaśnień.
- **Stos internetowy nie jest siedmiowarstwowym OSI.** Mapowanie pomaga w rozmowie, ale pozostaje przybliżeniem.
