# Tranzystory i układy scalone

W Binarnych Fundamentach IT bramka NOT zamieniała 1 na 0. W poprzednich dwóch lekcjach pojawiło się napięcie odniesione do masy oraz czas potrzebny na zmianę napięcia. Teraz można wyjaśnić, co fizycznie ustawia napięcie na wyjściu tej bramki.

## 🔀 Tranzystor steruje przewodzeniem

**Półprzewodnik** pozwala zbudować element, którego przewodzenie zależy od warunków elektrycznych. W tranzystorze MOSFET napięcie bramki względem źródła wpływa na przewodzenie między źródłem i drenem. Źródło i dren tworzą końce sterowanej drogi dla prądu. Bramkę oddziela od obszaru przewodzenia warstwa izolacyjna. W uproszczonym modelu cyfrowym traktujemy MOSFET jak sterowany napięciem przełącznik.

![Dwa tranzystory mocy IRFIBC30 w czarnych obudowach z trzema metalowymi wyprowadzeniami.](/public/courses/urządzenia-techniki-komputerowej/Images/mosfet-irfibc30.jpg)

Zdjęcie pokazuje oddzielne tranzystory mocy. Wyprowadzenia dają dostęp do bramki, drenu i źródła. Ich kolejność ustala dokumentacja modelu. W bramce procesora tranzystory powstają wewnątrz układu scalonego. *Fot. Retired electrician. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:IRFIBC30_MOS_transistor_01.jpg).*

## 🧰 Zbuduj inwerter z jednego tranzystora

Na dzielniku wyjście było między rezystorami. Tutaj na wyjściu **C** spotykają się rezystor i **dren nMOS-u**. Rezystor ciągnie wyjście w stronę 3 V. Gdy nMOS zacznie przewodzić, połączy je z masą przez źródło. Zanim zamkniesz wyłącznik, przewidź, w którą stronę zmieni się odczyt.

Adapter ma trzy nóżki w jednej linii. Osadź go w drugim rzędzie tak, żeby każda nóżka znalazła się w osobnej kolumnie. **B** będzie wejściem, a **C** wyjściem.

![Adapter nMOS. G trafia do B2, D do C2, a S do D2. Pozostałe otwory tych kolumn służą do wykonania połączeń.](/public/courses/urządzenia-techniki-komputerowej/Images/adapter-nmos-na-plytce.svg)

| Element | Punkty połączenia |
| --- | --- |
| Przewód źródła | D3 i −1 |
| Rezystor 10 kΩ na wejściu | B3 i −2 |
| Wyłącznik | +1 i B1 |
| Rezystor 10 kΩ na wyjściu | +2 i C1 |
| Multimetr V⎓ | Czerwona sonda w C3, czarna w −3 |

![Schemat inwertera nMOS. Wyłącznik i rezystor ustalają napięcie na bramce B. Multimetr mierzy napięcie drenu C względem masy.](/public/courses/urządzenia-techniki-komputerowej/Images/inwerter-nmos-polaczenia.svg)

Złóż układ przy odłączonej baterii. Rezystor między B i minusem zapewnia napięcie bliskie zera na bramce po otwarciu wyłącznika. Zamknięcie wyłącznika podaje na bramkę 3 V. **Zapisz napięcie drenu w obu położeniach wyłącznika.** Karta pod płytką zachowa oba odczyty. Jeśli napięcie wyjścia pozostaje wysokie po zamknięciu wyłącznika, przenieś czerwoną sondę do B i sprawdź, czy sygnał dociera do bramki. Wróć sondą do C przed zapisaniem wyniku.

<data-gate>
  <data-breadboard data-scenario="transistor"></data-breadboard>
</data-gate>

## 🔧 Powtórz pomiar na fizycznej płytce

Wykorzystaj elementy z tabeli, koszyk z dwiema bateriami AA oraz tranzystor **AO3400A zamontowany na adapterze z trzema wyprowadzeniami**. Wybierz adapter z oznaczeniami pinów lub sprawdź przejścia od pól układu do listew adaptera przed włożeniem go do płytki. Dla AO3400A w obudowie SOT-23 pin 1 to G, pin 2 to S, pin 3 to D. Kolejność listew na adapterze może być inna. [Nota katalogowa AO3400A](https://www.aosmd.com/sites/default/files/res/datasheets/AO3400A.pdf).

Zmierz napięcie na G i D względem wspólnej masy przy otwartym i zamkniętym wyłączniku. Przy napięciu bramki bliskim 3 V dren powinien zejść blisko 0 V. Jeśli napięcie bramki się zmienia, a wyjście pozostaje wysokie, wyłącz zasilanie i sprawdź połączenia źródła i drenu według pinów adaptera. Model płytki przybliża tranzystor przełącznikiem z małym oporem w stanie przewodzenia. Przy pomiarze interesują nas dwa stany ustalone.

## 🔀 Dwa tranzystory w inwerterze CMOS

W inwerterze CMOS pracują dwa rodzaje MOSFET-u. Tranzystor pMOS umożliwia połączenie wyjścia z dodatnim zasilaniem. Tranzystor nMOS umożliwia połączenie wyjścia z masą. Oba otrzymują to samo napięcie na bramkach.

| Wejście | Droga do zasilania przez pMOS | Droga do masy przez nMOS | Wyjście |
| --- | --- | --- | --- |
| Niskie | Przewodzi | Odcięta | Wysokie |
| Wysokie | Odcięta | Przewodzi | Niskie |

Przy wejściu niskim górny tranzystor podciąga wyjście do zasilania. Przy wejściu wysokim dolny ściąga wyjście w stronę masy. Stąd bierze się odwrócenie widoczne w tabeli prawdy NOT.

![Dwie drogi przewodzenia w inwerterze CMOS. Przy wejściu niskim wyjście jest połączone z zasilaniem przez pMOS, a przy wysokim z masą przez nMOS.](/public/courses/urządzenia-techniki-komputerowej/Images/drogi-przewodzenia-cmos.svg)

## 🔧 Znajdź i zmierz bramkę w układzie scalonym

Na stanowisku z nMOS-em wyjściem był dren. W scalaku **SN74HC04N** pierwsza bramka ma wejście na pinie **1**, a wyjście na pinie **2**. Obok niej jest jeszcze pięć osobnych inwerterów. Zasilanie jest wspólne dla wszystkich sześciu. Przygotuj płytkę stykową, wyłącznik, rezystor **10 kΩ**, kondensator ceramiczny **100 nF**, multimetr i koszyk z dwiema bateriami AA. [Rozmieszczenie wyprowadzeń, rysunek 5-1 w nocie Texas Instruments](https://www.ti.com/lit/ds/symlink/sn74hc04.pdf).

Obróć układ wycięciem do góry. Patrząc od strony napisu, znajdziesz pin 1 po lewej stronie wycięcia, a pin 14 po prawej. Włóż obudowę w poprzek szczeliny płytki. Przy odłączonym koszyku wykonaj połączenia.

| Wyprowadzenie | Co podłączyć |
| --- | --- |
| 14 (VCC) | Plus baterii |
| 7 (GND) | Minus baterii |
| 1 (1A) | Do plusa przez wyłącznik i do masy przez rezystor 10 kΩ |
| 2 (1Y) | Czerwoną sondę miernika w trybie V⎓ |
| 3, 5, 9, 11, 13 | Masę, żeby pozostałe wejścia miały określony stan |
| 14 i 7 | Kondensator 100 nF między zasilaniem i masą, blisko obudowy |

Czarną sondę zostaw na masie. Podłącz baterie i zmierz wyjście przy otwartym oraz zamkniętym wyłączniku. Porównaj te dwa odczyty z wynikiem z płytki nMOS. Potem przenieś czerwoną sondę z pinu 2 na pin 1 i zmierz wejście przy obu położeniach wyłącznika.

Jeśli wyjście nie zmienia stanu, sprawdź najpierw napięcie zasilania między pinami **14 i 7**. Jeśli jest bliskie napięciu baterii, sprawdź, czy przełączenie zmienia napięcie między **1 i 7**. W ten sposób możesz ustalić, czy sygnał w ogóle dociera do bramki. Przed poprawieniem połączenia odłącz baterie.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔧 Odczytaj bramkę za pomocą Arduino</span> <span class="deep-dive-badge">ARDUINO I C++</span></summary>
<div class="deep-dive-content">

Na stanowisku Arduino pełni dwie role. **D8** podaje stan na wejście bramki, a **D7** odczytuje jej wyjście. Użyj **Arduino Uno R3 (5 V)**, **SN74HC04N w obudowie PDIP-14**, płytki stykowej, rezystora **10 kΩ** i kondensatora ceramicznego **100 nF**. Przed połączeniem odłącz USB. Włóż scalak w poprzek szczeliny płytki i ustal pin 1 według widoku obudowy w nocie katalogowej. [Arduino Uno R3](https://docs.arduino.cc/hardware/uno-rev3/) · [Nota SN74HC04](https://www.ti.com/lit/ds/symlink/sn74hc04.pdf).

| Arduino lub płytka | Wyprowadzenie SN74HC04N |
| --- | --- |
| 5 V | 14 (VCC) |
| GND | 7 (GND) |
| D8 | 1 (1A, wejście) |
| D7 | 2 (1Y, wyjście) |
| GND | 3, 5, 9, 11 i 13 (pozostałe wejścia) |
| Rezystor 10 kΩ | Między 1 i GND |
| Kondensator 100 nF | Między 14 i 7, blisko układu |

Rezystor 10 kΩ utrzymuje stan niski na wejściu bramki, gdy Arduino jest w resecie i D8 jeszcze nie steruje linią. Nieużywane wyjścia 4, 6, 8, 10 i 12 pozostaw wolne. Po sprawdzeniu połączeń podłącz USB, wgraj szkic i otwórz monitor portu szeregowego z prędkością **9600 bit/s**.

```cpp
const int wejscieBramki = 8;
const int wyjscieBramki = 7;

void setup()
{
    pinMode(wejscieBramki, OUTPUT);
    pinMode(wyjscieBramki, INPUT);
    Serial.begin(9600);
}

void loop()
{
    for (int stan = LOW; stan <= HIGH; ++stan) {
        digitalWrite(wejscieBramki, stan);
        delay(10);
        const int odczyt = digitalRead(wyjscieBramki);

        Serial.print(stan);
        Serial.print(" -> ");
        Serial.print(odczyt);
        Serial.println(odczyt == !stan ? " OK" : " BLAD");
        delay(2000);
    }
}
```

Przewidź obie linie przed uruchomieniem. Potem porównaj odczyt Arduino z pomiarem multimetru na pinie 2 względem wspólnej masy. Szkic trzyma każdy stan przez dwie sekundy. W symulatorze stan wysoki miał 3 V. Na tym stanowisku spodziewaj się napięcia bliskiego **5 V** przy stanie wysokim i **0 V** przy niskim. Jeśli wynik się nie odwraca, sprawdź napięcie między pinami 14 i 7 oraz czy zmiana stanu z D8 dociera do pinu 1. Przed zmianą połączeń odłącz USB.

</div>
</details>

## 🧱 Od jednej bramki do układu scalonego

**Układ scalony** zawiera elementy elektroniczne wytworzone na wspólnym podłożu półprzewodnikowym i połączone ścieżkami wewnątrz struktury. Obudowa chroni strukturę i wyprowadza połączenia na zewnątrz. Płytka drukowana łączy obudowy układów, złącza i elementy takie jak rezystory i kondensatory.

Wewnątrz procesora bramki współpracują w większych układach. Jedne obliczają wynik z bieżących wejść. Inne są połączone tak, by zachować stan i udostępnić go w następnym kroku pracy. W kolejnej lekcji te funkcje dostaną nazwy, które znasz ze schematu procesora: jednostka arytmetyczno-logiczna i rejestry.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Dlaczego szybsze przełączanie zwiększa pobór mocy</span> <span class="deep-dive-badge">ELEKTRONIKA CMOS</span></summary>
<div class="deep-dive-content">

Wyjście bramki ma pojemność. Składają się na nią m.in. przewody i wejścia kolejnych tranzystorów. Przy przejściu z 0 na 1 źródło zasilania dostarcza ładunek $Q = CU$. Energia pobrana ze źródła przy takim ładowaniu wynosi w prostym modelu $E = CU^2$. Część trafia do pola elektrycznego, a część zamienia się w ciepło. Podczas rozładowania energia zgromadzona w polu również rozprasza się w obwodzie.

Jeśli wyjście ma pojemność 10 pF (10 pikofaradów) i wykonuje milion przejść $0 \to 1$ na sekundę przy 3 V, średnią moc obliczamy, mnożąc energię jednego ładowania przez liczbę ładowań na sekundę $f_{\uparrow}$.

$$ P = CU^2 f_{\uparrow} = 90\thinspace \mu\mathrm{W} $$

Wynik to 90 µW (90 mikrowatów). Przy podwojeniu liczby takich przejść wynik rośnie do 180 µW. To jedna składowa poboru. W rzeczywistym układzie są też m.in. upływy i krótkotrwałe przewodzenie obu tranzystorów podczas przejścia.

### ⏱️ To samo obciążenie opóźnia sygnał

Dołóż do wyjścia kolejne wejścia o łącznej pojemności 10 pF. Teraz trzeba naładować 20 pF. Jeśli w przybliżeniu zastąpisz przewodzący tranzystor rezystorem 500 Ω, stała czasowa z poprzedniej lekcji rośnie z 5 ns do 10 ns. Dla progu równego połowie napięcia zasilania opóźnienie samego narastania w modelu rośnie z około 3,5 do 6,9 ns. Nanosekunda (ns) to jedna miliardowa sekundy.

Liczba wejść podłączonych do jednego wyjścia wpływa więc na opóźnienie i energię przełączania, nawet gdy każde z nich ma bardzo mały prąd w stanie ustalonym. Model z rezystorem daje oszacowanie. W prawdziwym układzie przewodzenie tranzystora zmienia się w trakcie zbocza, dlatego projektant korzysta z charakterystyk czasowych podanych dla określonego obciążenia.

</div>
</details>

## <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W inwerterze CMOS dwa tranzystory sterują drogą z wyjścia do zasilania lub masy.
- Układ scalony pozwala zbudować z wielu tranzystorów bramki, obwody przechowujące stan i większe bloki procesora.

[Budowa inwertera CMOS w MIT Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/).

