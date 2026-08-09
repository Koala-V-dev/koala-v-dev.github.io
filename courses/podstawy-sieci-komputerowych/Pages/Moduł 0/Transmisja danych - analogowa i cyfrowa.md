# Transmisja danych - analogowa i cyfrowa

W pliku widzisz zera i jedynki. Po podłączeniu miernika do przewodu nie zobaczysz jednak cyfr płynących w stronę routera. Zobaczysz zmieniające się napięcie. W światłowodzie zmierzysz światło, a przy Wi-Fi odbiornik zarejestruje falę radiową.

Łącze przenosi zjawisko fizyczne. Nadajnik musi zakodować w nim informację cyfrową, a odbiornik odtworzyć symbole i bity. W tej lekcji prześledzisz ten proces bez zakładania znajomości elektroniki ani teorii fal.

Po ukończeniu lekcji odróżnisz bit, symbol i sygnał. Obliczysz też czas potrzebny na umieszczenie danych na łączu oraz rozpoznasz, czy opóźnienie wynika z szybkości transmisji, odległości czy kolejki.

## 🧱 Trzy poziomy jednej transmisji

W poprzedniej lekcji łącze było drogą dla sygnału. Teraz możemy zajrzeć do tej drogi dokładniej.

```text
informacja cyfrowa  ->  symbole  ->  sygnał fizyczny
      0110          ->  A B C    ->  napięcie, światło lub fala radiowa
```

Każdy poziom odpowiada na inne pytanie:

- *bit* opisuje informację jako `0` albo `1`;
- *symbol* jest jednym z dozwolonych stanów wybieranych przez nadajnik;
- *sygnał fizyczny* jest mierzalną zmianą przenoszoną przez medium.

<strong>Bit nie jest napięciem, impulsem światła ani falą radiową.</strong> Jest jednostką informacji. Konkretna technologia ustala, jakie właściwości sygnału będą reprezentowały poszczególne symbole.

To rozróżnienie chroni przed częstym błędem: określenie „transmisja cyfrowa” nie oznacza, że fizyczny sygnał może przyjmować wyłącznie matematyczne wartości `0` V i `1` V.

## 🎚️ Informacja dyskretna, sygnał fizyczny

Informacja cyfrowa ma skończony zestaw dozwolonych wartości. W najprostszym przypadku są to dwa stany: `0` i `1`.

Fizyczny odbiornik widzi coś mniej uporządkowanego. Napięcie, moc światła albo pole elektromagnetyczne zmienia się w czasie. Wartość zależy od nadajnika, medium, odległości oraz zakłóceń.

Odbiornik nie pyta więc: „czy na przewodzie znajduje się idealne zero?”. Podejmuje decyzję, do którego dozwolonego symbolu odebrany przebieg jest najbardziej podobny.

### ⚖️ Przykład z progiem decyzji

Poniższe napięcia są przykładem dydaktycznym, a nie parametrami konkretnego standardu:

```text
symbol 0: nadajnik wysyła poziom bliski 0,2 V
symbol 1: nadajnik wysyła poziom bliski 0,8 V
próg odbiornika: 0,5 V
```

Jeśli odbiornik zmierzy `0,74 V`, przypisze wynik do symbolu `1`. Pomiar `0,27 V` przypisze do symbolu `0`.

Wartości nie muszą dotrzeć bez żadnej zmiany. Ważne, aby po stronie odbiornika nadal dało się poprawnie rozróżnić dozwolone symbole.

## 🧩 Jeden symbol może przenosić kilka bitów

System binarny ma dwa stany, dlatego jeden wybór spośród dwóch możliwości niesie jeden bit informacji.

Nadajnik może jednak rozróżniać więcej symboli. Cztery dozwolone symbole wystarczą do zakodowania wszystkich par bitów:

| Para bitów | Symbol umowny |
| :---: | :---: |
| `00` | A |
| `01` | B |
| `10` | C |
| `11` | D |

Cztery symbole to $2^2$ możliwości, więc jeden symbol może reprezentować dwa bity. Standardy telekomunikacyjne rzeczywiście wykorzystują wiele stanów. Przykładowo QPSK rozróżnia cztery stany fazy fali, czyli cztery przesunięcia jej cyklu, i koduje nimi pary bitów.

Więcej stanów pozwala przenieść więcej bitów przy tej samej liczbie symboli na sekundę. Powstaje jednak koszt: odbiornik musi odróżniać symbole leżące bliżej siebie. Przy słabym albo zakłóconym sygnale rośnie ryzyko pomyłki.

> [!IMPORTANT]
> Liczba bitów nie musi być równa liczbie zmian sygnału. Zależność wynika z liczby symboli, kodowania oraz dodatkowych danych potrzebnych do synchronizacji i wykrywania błędów.

## 🌫️ Co niszczy czytelność sygnału

Po drodze sygnał nie zachowuje idealnego kształtu. Trzy zjawiska są szczególnie ważne:

- *tłumienie* zmniejsza poziom sygnału wraz z przejściem przez medium;
- *zakłócenia i szum* dodają niepożądane zmiany;
- *zniekształcenie* zmienia kształt przebiegu, ponieważ jego składowe nie przechodzą przez medium jednakowo.

Wróćmy do przykładowego progu `0,5 V`. Nadajnik wysłał symbol `1` jako `0,8 V`. Jeżeli tłumienie i zakłócenia obniżą pomiar do `0,47 V`, odbiornik wybierze symbol `0`.

```text
wysłano:  1
zmierzono: 0,47 V
decyzja:  0
```

W tym miejscu powstaje błąd bitu. Regenerator może utworzyć nowy, mocny sygnał, ale odtworzy symbol wynikający z decyzji odbiornika. Jeśli decyzja była błędna, regeneracja utrwali błędną wartość.

> [!NOTE]
> Regeneracja ogranicza przenoszenie zniekształconego przebiegu na kolejny odcinek. Nie gwarantuje bezbłędności. Protokoły potrzebują dodatkowych mechanizmów wykrywania błędów, korekcji albo retransmisji.

## ⏱️ Bit na sekundę i symbol na sekundę

*Szybkość bitowa* określa liczbę bitów przesyłanych w ciągu sekundy. Jej jednostką jest `bit/s`, często zapisywane jako `bps`.

*Szybkość symbolowa* określa liczbę symboli wysyłanych w ciągu sekundy. Jej jednostką jest bod, czyli `Bd`.

Jeśli jeden symbol reprezentuje jeden bit:

```text
2 000 symboli/s x 1 bit/symbol = 2 000 bit/s
```

Jeśli jeden symbol reprezentuje dwa bity:

```text
2 000 symboli/s x 2 bity/symbol = 4 000 bit/s
```

To obliczenie opisuje surową informację zakodowaną w symbolach. Użytkownik zwykle otrzymuje mniej użytecznych danych, ponieważ część transmisji zajmują nagłówki, synchronizacja, kody wykrywające błędy oraz ewentualne retransmisje.

*Goodput* oznacza tempo dostarczania użytecznych danych aplikacji. Nie należy go mylić z nominalną szybkością łącza.

## 🕒 Opóźnienie nie ma jednej przyczyny

Szybkie łącze nie usuwa każdego rodzaju opóźnienia. Całkowity czas przejścia danych składa się z kilku części.

### 📏 Opóźnienie transmisji

Opóźnienie transmisji, nazywane też czasem serializacji, mówi, ile czasu nadajnik potrzebuje na umieszczenie wszystkich bitów na łączu.

`czas transmisji = liczba bitów / szybkość bitowa`

To czas potrzebny na umieszczenie wszystkich bitów na łączu.

Ramka o rozmiarze `1 500 B` zawiera `12 000` bitów. Na łączu `10 Mbit/s` jej serializacja trwa:

```text
12 000 bit / 10 000 000 bit/s = 0,0012 s = 1,2 ms
```

Na łączu `1 Gbit/s` te same bity zajmą `0,012 ms`.

### 🌍 Opóźnienie propagacji

Opóźnienie propagacji wynika z czasu przemieszczania się sygnału przez medium. Zależy przede wszystkim od długości drogi i prędkości propagacji w danym medium.

Zwiększenie szybkości bitowej nie skraca fizycznej odległości. Może skrócić serializację, lecz sygnał nadal potrzebuje czasu, aby dotrzeć do drugiego końca łącza.

### 🚦 Przetwarzanie i kolejka

Urządzenie pośredniczące potrzebuje czasu na odczytanie informacji i podjęcie decyzji. Gdy wiele pakietów chce skorzystać z tego samego wyjścia, część czeka w buforze, czyli pamięci przeznaczonej na kolejkę.

Opóźnienie kolejki zmienia się wraz z obciążeniem. Dlatego pobieranie dużego pliku może zwiększyć czas reakcji gry albo rozmowy głosowej, mimo że odległość do serwera się nie zmieniła.

```text
opóźnienie całkowite = propagacja + serializacja + przetwarzanie + kolejka
```

## 🛠️ Punkt kontrolny: bity a symbole

<data-gate>
  <data-quiz>
    <question>Łącze wysyła 3 000 symboli na sekundę. Każdy symbol może przyjąć jeden z czterech stanów i reprezentuje dokładnie dwa bity. Jaka jest surowa szybkość bitowa przed doliczeniem narzutu protokołów?</question>
    <options>
      <option>1 500 bit/s, ponieważ dwa symbole tworzą jeden bit.</option>
      <option>3 000 bit/s, ponieważ symbol zawsze jest równy jednemu bitowi.</option>
      <option correct>6 000 bit/s, ponieważ 3 000 symboli/s x 2 bity/symbol daje 6 000 bit/s.</option>
      <option>12 000 bit/s, ponieważ cztery stany trzeba pomnożyć przez liczbę symboli.</option>
    </options>
    <div data-hint="error">Najpierw ustal, ile bitów zawiera jeden symbol. Dopiero potem pomnóż tę wartość przez liczbę symboli wysyłanych w sekundzie.</div>
    <div data-hint="success">Cztery stany pozwalają zakodować dwubitowe kombinacje `00`, `01`, `10` i `11`. Każdy z 3 000 symboli niesie więc dwa bity.</div>
  </data-quiz>
</data-gate>

## 🧪 Zdiagnozuj ograniczenie transmisji

Dopasuj każdą obserwację do głównej przyczyny:

1. Po odsunięciu urządzenia od punktu dostępu rośnie liczba błędów odbioru.
2. Przesłanie `1 500 B` trwa dłużej na łączu `10 Mbit/s` niż na `1 Gbit/s`.
3. Czas reakcji gwałtownie rośnie tylko wtedy, gdy wielu użytkowników jednocześnie obciąża to samo łącze.
4. Łącze wysyła tyle samo symboli na sekundę, ale nowy sposób kodowania umieszcza dwa bity w symbolu zamiast jednego.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Poprawne rozpoznanie:

| Obserwacja | Główne zjawisko |
| :---: | :--- |
| 1 | słabszy stosunek użytecznego sygnału do zakłóceń utrudnia rozróżnianie symboli |
| 2 | zmienia się czas serializacji bitów |
| 3 | pakiety czekają w kolejce |
| 4 | rośnie szybkość bitowa przy tej samej szybkości symbolowej |

To ćwiczenie nie wymaga jeszcze wyboru narzędzia diagnostycznego. Najpierw uczysz się rozdzielać mechanizmy. Narzędzia pojawią się po wprowadzeniu warstw i konkretnych protokołów.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Bit, symbol i sygnał są różnymi poziomami transmisji.** Bit opisuje informację, symbol jest wyborem nadajnika, a sygnał jest fizycznym nośnikiem tego wyboru.
- **Transmisja cyfrowa może używać więcej niż dwóch stanów sygnału.** Cztery symbole mogą kodować dwie cyfry binarne naraz.
- **Tłumienie, zakłócenia i zniekształcenie zmniejszają pewność decyzji odbiornika.** Regenerator nie naprawi bitu, jeśli wcześniej rozpoznano niewłaściwy symbol.
- **Szybkość bitowa i symbolowa nie są tym samym.** Liczba bitów na symbol zależy od zastosowanego kodowania.
- **Opóźnienie ma kilka składników.** Szybkość łącza wpływa na serializację, odległość na propagację, a obciążenie na czas oczekiwania w kolejce.
