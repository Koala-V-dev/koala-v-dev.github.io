# Adresowanie IPv4 - budowa i klasy

Na interfejsie widzisz `192.0.2.130/26`. Ktoś patrzy tylko na pierwszy oktet i mówi: „to dawna klasa C, więc sieć ma `/24`”. Taka odpowiedź zmieniłaby zakres z 64 do 256 adresów.

Cel jest praktyczny: wyznaczyć granice konkretnego prefiksu i sprawdzić, czy podany adres może należeć do hosta. Tabela klas nie jest do tego potrzebna.

## 🧠 Najpierw przewidź zakres

Bez liczenia odpowiedz:

```
interfejs A: 192.0.2.130/26
interfejs B: 192.0.2.190/26
```

Czy oba adresy mogą znajdować się w tej samej podsieci?

Zapisz `tak` albo `nie` i podaj granicę, której jeszcze nie znasz. Po obliczeniu wrócisz do tej prognozy.

## 🧩 Adres i prefiks tworzą jedną informację

IPv4 ma 32 bity zapisane zwykle jako cztery oktety. Każdy oktet mieści wartość od `0` do `255`.

Sam adres `192.0.2.130` nie wyznacza granicy sieci. Robi to dopiero prefiks `/26`:

```
26 bitów prefiksu | 6 bitów części lokalnej
```

Pierwsze 24 bity obejmują trzy pełne oktety. W ostatnim oktecie do prefiksu należą jeszcze dwa bity.

```
adres:  130 = 10000010
maska:  192 = 11000000
                 ^^------ 2 bity prefiksu
```

Nie zmieniaj prefiksu na podstawie pierwszego oktetu. To zapis `/26` jest częścią danych wejściowych.

## 🔬 Wyznacz adres sieci

Adres sieci otrzymujesz przez operację logiczną AND między adresem a maską. Bit wyniku ma wartość `1` tylko wtedy, gdy oba bity wejściowe mają wartość `1`.

```
adres:  10000010   130
maska:  11000000   192
AND:    10000000   128
```

Trzy wcześniejsze oktety maski mają same jedynki, więc pozostają bez zmiany.

```
adres interfejsu: 192.0.2.130/26
adres sieci:      192.0.2.128/26
```

To pierwszy adres bloku. Opisuje cały prefiks, a nie pojedynczy interfejs.

## 📡 Wyznacz koniec bloku

W części lokalnej ustaw wszystkie bity na `1`. Otrzymasz ostatni adres tradycyjnej podsieci, czyli adres rozgłoszeniowy skierowany do tego prefiksu.

```
adres sieci:      10000000   128
bity lokalne:     00111111    63
wynik OR:         10111111   191
```

Pełny zakres wygląda tak:

```
sieć:             192.0.2.128
pierwszy host:    192.0.2.129
adres A:          192.0.2.130
adres B:          192.0.2.190
ostatni host:     192.0.2.190
broadcast:        192.0.2.191
```

Pierwsza prognoza powinna teraz brzmieć `tak`. Oba adresy leżą między początkiem i końcem tego samego bloku, a żaden nie jest adresem sieci ani broadcastem.

## 🧭 Użyj stałej procedury

Dla zwykłej podsieci wykonuj zawsze te same cztery działania:

1. zapisz adres razem z prefiksem;
2. wykonaj `adres AND maska`, aby znaleźć adres sieci;
3. ustaw bity lokalne na `1`, aby znaleźć broadcast;
4. sprawdź, czy adres interfejsu nie jest pierwszym ani ostatnim adresem bloku.

Wzór `2^(32 - prefiks)` podaje liczbę wszystkich adresów w bloku. Dla `/26` jest to `2^6`, czyli `64`.

W zwykłej podsieci z broadcastem dwa adresy pełnią role graniczne, więc pozostają `62` adresy dla hostów. Nie traktuj jednak odejmowania dwóch jako prawa dla każdego prefiksu. Na łączu punkt do punktu `/31` oba adresy mogą identyfikować końce łącza. `/32` opisuje pojedynczy adres.

## 🕰️ Klasa nie zastępuje prefiksu

Dawny system klasowy wiązał początkowe bity adresu ze stałą granicą sieci. Adres zaczynający się od `192` kojarzono z klasą C i granicą `/24`.

CIDR zastąpił takie domysły jawną długością prefiksu. Dlatego `192.0.2.130/26` należy analizować jako `/26`, nawet jeśli ktoś rozpoznaje w nim historyczny zakres klasy C.

Znajomość nazw klas pomaga czytać stare materiały. Nie pomaga wyznaczyć współczesnej podsieci bez prefiksu.

## 🛠️ Punkt kontrolny: znajdź granice

<data-gate>
  <data-quiz>
    <question>Interfejs ma adres `198.51.100.77/27`. Który zestaw poprawnie opisuje zwykłą podsieć z broadcastem?</question>
    <options>
      <option>Sieć `.0`, broadcast `.255`, hosty `.1` do `.254`.</option>
      <option correct>Sieć `.64`, broadcast `.95`, hosty `.65` do `.94`.</option>
      <option>Sieć `.64`, broadcast `.96`, hosty `.65` do `.95`.</option>
      <option>Sieć `.77`, broadcast `.108`, hosty `.78` do `.107`.</option>
    </options>
    <div data-hint="error">Dla `/27` pozostaje 5 bitów lokalnych, więc blok ma 32 adresy. Znajdź wielokrotność 32 nie większą niż 77, a potem ostatni adres tego bloku.</div>
    <div data-hint="success">Adres 77 leży w bloku od 64 do 95. Pierwszy adres opisuje sieć, ostatni jest broadcastem, a środek pozostaje dla hostów.</div>
  </data-quiz>
</data-gate>

## 🧪 Oceń trzy konfiguracje

Dla każdej konfiguracji wypełnij ten sam raport:

```
adres i prefiks
adres sieci
broadcast
zakres hostów
adres interfejsu: poprawny albo graniczny
dowód w bitach ostatniego oktetu
```

Przypadki:

```
A. 203.0.113.14/28
B. 203.0.113.16/28
C. 198.51.100.130/26
```

Kryteria ukończenia:

- każdy wynik wynika z podanego prefiksu, a nie z dawnej klasy;
- pokazujesz operację AND dla adresu sieci;
- osobno nazywasz cały blok i adres skonfigurowany na interfejsie;
- rozpoznajesz adres, którego nie wolno przypisać zwykłemu hostowi w tym modelu.

Zmień przypadek A na łącze punkt do punktu `203.0.113.10/31`, którego drugi koniec ma adres `203.0.113.11/31`. Wyjaśnij, dlaczego reguła „odejmij sieć i broadcast” dałaby tu błędny wynik.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A prefiks `/28` zostawia cztery bity lokalne. Blok ma 16 adresów: sieć `203.0.113.0`, broadcast `203.0.113.15`, hosty od `.1` do `.14`. Adres `.14` jest poprawnym adresem hosta.

W B granice są następne: sieć `203.0.113.16`, broadcast `203.0.113.31`, hosty od `.17` do `.30`. Adres `.16` opisuje sieć, więc w zwykłej podsieci z broadcastem nie jest adresem hosta.

W C maska `/26` ma w ostatnim oktecie postać `11000000`. Operacja `10000010 AND 11000000` daje `10000000`, czyli `128`. Sieć to `198.51.100.128`, broadcast `.191`, a hosty mieszczą się od `.129` do `.190`. Adres `.130` jest poprawny.

Na łączu punkt do punktu `/31` pozostaje jeden bit lokalny. RFC 3021 każe interpretować oba adresy jako adresy końców: `.10` i `.11`. Takie łącze nie potrzebuje adresu broadcast. Mechaniczne odjęcie dwóch pozostawiłoby zero adresów i zniszczyłoby poprawny model.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Adres bez prefiksu nie wyznacza podsieci.** Analizujesz zawsze parę `adres/prefiks`.
- **Operacja AND wyznacza początek bloku.** Ustawienie bitów lokalnych na `1` wyznacza jego koniec.
- **Adres sieci, adres hosta i broadcast mają inne role.** Sam fakt przynależności do bloku nie wystarcza do poprawnej konfiguracji interfejsu.
- **Klasy A, B i C są pojęciem historycznym.** Współczesną granicę wyznacza jawna długość prefiksu.
- **Reguła o dwóch adresach granicznych ma wyjątki.** `/31` może opisywać dwa końce łącza punkt do punktu, a `/32` pojedynczy adres.
