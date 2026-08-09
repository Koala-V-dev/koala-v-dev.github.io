# Warstwa sieciowa - IP i routing

Router otrzymuje pakiet dla `10.10.5.20`. W tablicy ma cztery wpisy i aż trzy z nich pasują do tego adresu. Kolejność wierszy nie rozstrzyga, którędy wysłać pakiet.

W poprzedniej lekcji śledziłeś stan tablicy przełącznika. Teraz nauczysz się czytać prostą tablicę routingu: znajdziesz pasujące prefiksy, wybierzesz najbardziej szczegółowy i wskażesz następny krok pakietu.

## 🧠 Najpierw wybierz wpis

Router ma następujące wpisy:

```text
10.0.0.0/8       -> przez router R1
10.10.0.0/16     -> przez router R2
10.10.5.0/24     -> bezpośrednio przez eth3
0.0.0.0/0        -> przez router R-domyślny
```

Adres docelowy pakietu to `10.10.5.20`.

Zapisz, który wpis wybierasz i dlaczego. Nie poprawiaj odpowiedzi w trakcie czytania. Wrócisz do niej po poznaniu reguły.

Jeśli wybrałeś pierwszy pasujący wiersz albo trasę domyślną, zachowaj swoje uzasadnienie. Za chwilę sprawdzisz je regułą, która wymaga znalezienia **wszystkich** dopasowań.

## 🧱 Adres wskazuje cel, prefiks opisuje zbiór

Adres IPv4 ma 32 bity. Zapisuje się go jako cztery liczby od 0 do 255, nazywane oktetami:

```text
10.10.5.20
```

W tym kursie adres jest przypisany do logicznego interfejsu w określonej sieci. Nie traktuj go jako wiecznej nazwy całego komputera. Jeden komputer może mieć kilka interfejsów i kilka adresów IP.

Wpis tablicy routingu nie opisuje zwykle jednego urządzenia. Opisuje zbiór adresów za pomocą **prefiksu**. Liczba po ukośniku mówi, ile początkowych bitów musi być wspólnych.

W tej lekcji pracujesz tylko z granicami pełnych oktetów:

```text
10.0.0.0/8       obejmuje 10.*.*.*
10.10.0.0/16     obejmuje 10.10.*.*
10.10.5.0/24     obejmuje 10.10.5.*
```

Gwiazdka jest tu wyłącznie zapisem dydaktycznym: w tym miejscu może wystąpić dowolny oktet. Nie jest częścią notacji CIDR.

Sprawdź teraz `10.10.5.20` od lewej strony:

```text
10.*.*.*         pasuje
10.10.*.*        pasuje
10.10.5.*        pasuje
```

Nie musisz jeszcze przeliczać masek binarnych ani wyznaczać adresów podsieci. Te działania wymagają osobnego ćwiczenia. Tutaj uczysz się decyzji routingowej na prefiksach, których granice są widoczne między oktetami.

## 🎯 Wygrywa najdłuższy pasujący prefiks

Router porównuje docelowy adres IP z wpisami. Spośród pasujących wybiera wpis o najdłuższym prefiksie, czyli opisujący najbardziej szczegółowy zbiór.

Dla `10.10.5.20` pasują trzy wpisy właściwe oraz trasa domyślna:

```text
/8       wspólne pierwsze 8 bitów
/16      wspólne pierwsze 16 bitów
/24      wspólne pierwsze 24 bity
/0       brak wymaganych wspólnych bitów
```

Najdłuższe dopasowanie to `/24`. Router wybiera więc:

```text
10.10.5.0/24 -> bezpośrednio przez eth3
```

Kolejność wpisów na ekranie nie jest kryterium. Sama obecność trasy domyślnej także nie daje jej pierwszeństwa.

Prefiks `0.0.0.0/0` pasuje do każdego adresu, ponieważ nie wymaga zgodności żadnego początkowego bitu. Jest **trasą domyślną**, lecz przegrywa z każdym bardziej szczegółowym dopasowaniem.

## 🚪 Wpis wskazuje tylko następny krok

Tablica nie musi zawierać całej drogi do odbiorcy. Wynik wyszukania wskazuje następny krok oraz interfejs wyjściowy.

Są dwa podstawowe przypadki:

1. **Cel jest osiągalny bezpośrednio.** Następnym krokiem jest samo urządzenie docelowe na połączonej sieci.
2. **Cel jest osiągalny przez inny router.** Następnym krokiem jest adres tego routera na sieci połączonej bezpośrednio.

Rozważ wpis:

```text
10.20.0.0/16 -> przez 192.0.2.2, interfejs eth1
```

Dla pakietu do `10.20.7.9` router nie twierdzi, że `192.0.2.2` jest końcowym odbiorcą. Przekazuje pakiet do sąsiedniego routera, który podejmie własną decyzję.

Na każdym łączu potrzebna jest nowa ramka warstwy drugiej:

```text
łącze 1: ramka do następnego routera | pakiet IP do 10.20.7.9
łącze 2: nowa ramka do kolejnego kroku | pakiet IP do 10.20.7.9
```

W tym uproszczonym przykładzie nie ma translacji adresów ani tunelu, więc docelowy adres IP pozostaje `10.20.7.9`. Adres docelowy ramki zmienia się wraz z następnym krokiem. Mechanizm ustalania tego lokalnego adresu poznasz w lekcji o ARP.

## 🧯 Brak trasy też jest wynikiem

Trasa domyślna nie oznacza automatycznie „drogi do Internetu”. Jest zwykłym skonfigurowanym wpisem, który wybiera się dopiero wtedy, gdy nie ma dokładniejszego dopasowania.

Jeśli tablica nie zawiera ani pasującego prefiksu, ani trasy domyślnej, router nie próbuje kolejno wszystkich interfejsów. Nie ma podstawy do przekazania pakietu i nie może go przesłać dalej.

Komunikat o nieosiągalnej sieci nie dowodzi awarii przewodu. Może oznaczać, że urządzenie nie ma odpowiedniego wpisu routingowego.

## 🛠️ Punkt kontrolny: wybór dla nowego celu

<data-gate>
  <data-quiz>
    <question>Tablica zawiera cztery wpisy: `10.0.0.0/8` przez R1, `10.10.0.0/16` przez R2, `10.10.5.0/24` przez eth3 oraz `0.0.0.0/0` przez R4. Który wpis zostanie wybrany dla celu `10.10.7.42`?</question>
    <options>
      <option>`10.10.5.0/24` przez eth3, ponieważ `/24` jest najdłuższym prefiksem w całej tablicy.</option>
      <option correct>`10.10.0.0/16` przez R2, ponieważ cel pasuje do `/8`, `/16` i `/0`, ale nie do `10.10.5.*`.</option>
      <option>`10.0.0.0/8` przez R1, ponieważ router zatrzymuje się na pierwszym pasującym wpisie.</option>
      <option>`0.0.0.0/0` przez R4, ponieważ trasa domyślna ma pierwszeństwo przed trasami właściwymi.</option>
    </options>
    <div data-hint="error">Najpierw sprawdź zgodność każdego prefiksu z `10.10.7.42`. Długość porównuj dopiero wśród wpisów, które rzeczywiście pasują.</div>
    <div data-hint="success">`10.10.5.0/24` odpada, bo trzeci oktet celu to 7, a nie 5. Spośród pozostałych dopasowań `/16` jest najdłuższe.</div>
  </data-quiz>
</data-gate>

## 🧪 Przeprowadź cztery cele przez tablicę

Pracujesz z routerem R. Jego tablica zawiera:

```text
10.0.0.0/8        -> 192.0.2.2 przez eth1
10.30.0.0/16      -> 192.0.2.6 przez eth2
10.30.8.0/24      -> bezpośrednio przez eth3
0.0.0.0/0         -> 198.51.100.1 przez eth4
```

Przeanalizuj kolejno cztery adresy docelowe:

```text
A: 10.30.8.44
B: 10.30.9.44
C: 10.40.9.44
D: 203.0.113.8
```

Dla każdego celu zapisz:

1. wszystkie pasujące wpisy;
2. wybrany prefiks;
3. następny router albo informację `bezpośrednio`;
4. interfejs wyjściowy;
5. jednozdaniowe uzasadnienie oparte na najdłuższym dopasowaniu.

Kryteria ukończenia:

- odrzucasz `/24` dla celu B, zamiast wybierać go tylko dlatego, że jest najdłuższy w tablicy;
- rozróżniasz następny router od końcowego adresu IP;
- dla celu D używasz trasy domyślnej dopiero po wykluczeniu innych wpisów;
- potrafisz przewidzieć skutek usunięcia trasy domyślnej.

Zmień teraz stan tablicy: usuń `0.0.0.0/0` i dodaj wpis `203.0.113.0/24 -> 192.0.2.10 przez eth2`. Ponownie rozstrzygnij tylko cel D. Wyjaśnij, dlaczego wynik nie jest już trasą domyślną.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Cel A, `10.30.8.44`, pasuje do `/8`, `/16`, `/24` oraz `/0`. Najdłuższy prefiks to `10.30.8.0/24`. Cel jest osiągalny bezpośrednio przez `eth3`.

Cel B, `10.30.9.44`, pasuje do `/8`, `/16` oraz `/0`. Nie pasuje do `10.30.8.0/24`, ponieważ trzeci oktet ma wartość 9. Wygrywa `10.30.0.0/16`, więc następnym routerem jest `192.0.2.6` przez `eth2`.

Cel C, `10.40.9.44`, pasuje do `/8` oraz `/0`. Nie pasuje do `10.30.*.*`. Wygrywa `10.0.0.0/8`, więc następnym routerem jest `192.0.2.2` przez `eth1`.

Cel D, `203.0.113.8`, nie pasuje do żadnego wpisu z początkiem `10`. Pasuje do `/0`, więc router wybiera `198.51.100.1` przez `eth4`.

Po zmianie tablicy cel D pasuje do nowego wpisu `203.0.113.0/24`. Router wybiera `192.0.2.10` przez `eth2`. Nie korzysta z trasy domyślnej, ponieważ została usunięta, a nowy właściwy wpis sam wystarcza do podjęcia decyzji. Gdyby usunięto trasę domyślną bez dodania `/24`, router nie miałby trasy dla celu D.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Najpierw sprawdzasz dopasowanie, potem długość.** Najdłuższy wpis w tablicy nie wygra, jeśli nie pasuje do celu.
- **Najdłuższy pasujący prefiks jest najbardziej szczegółowy.** Trasa `/0` przegrywa z każdym pasującym prefiksem o większej długości.
- **Wynik wskazuje następny krok.** Może to być cel na sieci bezpośredniej albo sąsiedni router i interfejs wyjściowy.
- **Brak dopasowania i trasy domyślnej zatrzymuje przekazanie.** Nie jest to jeszcze dowód awarii warstwy fizycznej.
