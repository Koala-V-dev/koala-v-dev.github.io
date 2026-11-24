# Algorytm tasowania Fisher-Yates i maszyna stanów gry

W grze Memory, Pasjansie albo trybie losowym odtwarzacza muzyki musisz uczciwie wymieszać zbiór elementów. Pierwszy pomysł nasuwa się sam: przejść pętlą po całej tablicy i zamienić każdy element z innym, wylosowanym z całego zakresu `0 .. n - 1`. Ten kod kompiluje się bez ostrzeżeń i na pierwszy rzut oka miesza karty. W rzeczywistości kryje poważny błąd matematyczny: niektóre układy kart wypadają zauważalnie częściej niż inne.

Drugi problem pojawia się w momencie, gdy z logiki konsolowej przechodzisz do okna gry. Użytkownik nie czeka grzecznie na swoją kolej. Może kliknąć tę samą kartę dwa razy, wcisnąć trzecią kartę podczas 750 ms podglądu albo klikać planszę już po wygranej. Jeśli reguły blokad rozrzucisz po przypadkowych flagach `bool`, szybkie klikanie rozbije logikę programu.

Rozwiązaniem obu problemów są dwa klasyczne narzędzia inżynierskie: **algorytm Fisher-Yates** do bezbłędnego tasowania w miejscu oraz **maszyna stanów** do twardego pilnowania dozwolonych akcji gracza.

---

## 🎲 Dlaczego naiwne tasowanie oszukuje

Rozważ miniaturową talię złożoną z zaledwie 3 kart: `[A, B, C]`. Naiwna pętla losuje w każdym z trzech kroków indeks *j* z całego zakresu `0 .. 2`, czyli wywołuje `rnd.Next(0, 3)`.

W pierwszym kroku masz 3 możliwe wybory, w drugim 3 i w trzecim znowu 3. Daje to dokładnie `3 * 3 * 3 = 27` równoprawdopodobnych ścieżek wykonania algorytmu. Tymczasem 3 karty można ułożyć wyłącznie na `3! = 6` różnych sposobów.

Liczba 27 nie dzieli się bez reszty przez 6. Nie istnieje więc żaden sposób, aby rozdzielić 27 ścieżek po równo między 6 układów kart. Trzy układy powstają na 5 sposobów (`18,52%`), a pozostałe trzy tylko na 4 sposoby (`14,81%`). Część układów pojawia się aż o 25% częściej od reszty.

---

## 🃏 Algorytm Fisher-Yates w miejscu

**Algorytm Fisher-Yates** (w nowoczesnej wersji Durstenfelda) usuwa skrzywienie rozkładu, dzieląc tablicę *tab* w pamięci na dwie strefy:
- **Prefiks nieprzetasowany** od indeksu `0` do *i*: elementy, które wciąż czekają na losowanie.
- **Sufiks gotowy** od indeksu `i + 1` do `n - 1`: karty ustawione już na swoich ostatecznych miejscach.

Pętla startuje od ostatniego indeksu `i = tab.Length - 1` i schodzi w dół do `1`. W każdym obrocie losujesz indeks *j* wyłącznie z nieprzetasowanego prefiksu `0 .. i` włącznie. W C# metoda `rnd.Next(0, i + 1)` wyklucza górną granicę, dlatego dodajesz `+ 1`.

Następnie zamieniasz miejscami elementy `tab[i]` oraz `tab[j]` i zmniejszasz *i* o `1`. Karta na pozycji *i* trafia do gotowego sufiksu i nie bierze już udziału w dalszym losowaniu.

Prześledź przebieg dla 4 kart `[A, B, C, D]`, który wykonuje dokładnie `n - 1 = 3` kroki:

| Krok | Wartość *i* | Zakres losowania *j* | Wylosowano *j* | Zamiana | Stan tablicy (sufiks gotowy pogrubiony) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Start | brak | brak | brak | brak | `[A, B, C, D]` |
| 1 | `3` | `0..3` (4 wybory) | `1` | `tab[3] <-> tab[1]` | `[A, D, C, **B**]` |
| 2 | `2` | `0..2` (3 wybory) | `2` | `tab[2] <-> tab[2]` | `[A, D, **C, B**]` |
| 3 | `1` | `0..1` (2 wybory) | `0` | `tab[1] <-> tab[0]` | `[**D, A, C, B**]` |

Zwróć uwagę na krok 2: wylosowanie `j == i` (karta zostaje na swoim miejscu) jest całkowicie legalne i konieczne. Dzięki temu drzewo wyborów ma `4 * 3 * 2 * 1 = 24` ścieżki, co pokrywa się idealnie z liczbą permutacji `4! = 24`.

### ⚡ Koszt w miejscu kontra druga lista

Często kusi, aby losować elementy z `List<int>`, dopisywać je do drugiej listy i usuwać oryginał metodą `RemoveAt`. Takie podejście kosztuje podwójną pamięć na stercie oraz czas `O(n²)` dla dużych zbiorów, ponieważ każde `RemoveAt` w środku listy przesuwa wszystkie kolejne elementy w lewo.

Fisher-Yates działa **w miejscu** (bez alokacji drugiej tablicy). Wykonuje dokładnie `n - 1` zamian i działa w czasie liniowym `O(n)` przy stałej pamięci `O(1)`. Dla 16 kart to 15 prostych zamian, a dla talii 52 kart dokładnie 51.

> [!WARNING]
> Pomyłka **_off-by-one_** polegająca na napisaniu `rnd.Next(0, i)` zamiast `rnd.Next(0, i + 1)` psuje rozkład! Taki zapis wyklucza przypadek `j == i`, przez co żaden element nie może pozostać na swoim miejscu. Otrzymujesz wtedy _**algorytm Sattolo**_, który generuje wyłącznie pojedyncze cykle i dla 4 kart produkuje zaledwie `(4 - 1)! = 6` zamiast `24` układów.

<data-gate>
<data-sortable-list title="Ułóż w poprawnej kolejności 5 kroków jednego obrotu pętli Fisher-Yates">
  <item data-correct="3">Wpisz wartość tab[j] na docelową pozycję tab[i]</item>
  <item data-correct="1">Wylosuj indeks j z zakresu od 0 do i włącznie przez rnd.Next(0, i + 1)</item>
  <item data-correct="5">Zmniejsz indeks i o 1, poszerzając gotowy sufiks tablicy</item>
  <item data-correct="2">Zapamiętaj element tab[i] w zmiennej pomocniczej tmp</item>
  <item data-correct="4">Wpisz zapamiętaną wartość tmp na pozycję tab[j]</item>
</data-sortable-list>
</data-gate>

---

## ⏱️ Pułapka new Random w pętli i testy deterministyczne

Na platformie `.NET Framework 4.x` bezparametrowy konstruktor `new Random()` pobiera ziarno z zegara systemowego `Environment.TickCount`. Ten zegar tyka zazwyczaj co około `15,6 ms`.

Jeśli utworzysz `new Random()` wewnątrz szybkiej pętli albo w metodzie wywoływanej wielokrotnie w tej samej milisekundzie, każda instancja dostanie **_identyczne ziarno_**. Zamiast losowych talii program wyprodukuje kilka identycznych kopii tego samego układu kart.

> [!IMPORTANT]
> Nigdy nie twórz `new Random()` wewnątrz metody tasującej. **Wstrzykuj obiekt `Random`** jako parametr, na przykład `TasujFisherYates(int[] tab, Random rnd)`. W działającej grze utrzymujesz jedną instancję w klasie, a w testach jednostkowych podajesz stałe ziarno `new Random(42)`, dzięki czemu wynik tasowania jest w 100% powtarzalny.

---

## ⚙️ Maszyna stanów gry w Memory

W aplikacji okienkowej zdarzenia mogą nadchodzić w dowolnej kolejności. **Maszyna stanów** (_**Finite State Machine**_, FSM) opisuje program jako skończony zbiór stanów, listę dozwolonych zdarzeń oraz sztywne reguły przejść między stanami.

W grze Memory cały cykl rozgrywki zamyka się w 4 jednoznacznych stanach:

| Aktualny stan | Zdarzenie | Akcja gry | Następny stan |
| :--- | :--- | :--- | :--- |
| `OczekiwanieNaPierwsza` | Kliknięto zakrytą kartę `A` | Odkryj `A`, zapamiętaj indeks `A` | `OczekiwanieNaDruga` |
| `OczekiwanieNaDruga` | Kliknięto tę samą lub dopasowaną kartę | Ignoruj kliknięcie | `OczekiwanieNaDruga` |
| `OczekiwanieNaDruga` | Kliknięto kartę `B` (para pasuje, zostały pary) | Oznacz parę jako dopasowaną, zlicz ruch | `OczekiwanieNaPierwsza` |
| `OczekiwanieNaDruga` | Kliknięto kartę `B` (ostatnia para) | Zlicz ruch, zatrzymaj zegar, zapisz rekord | `KoniecGry` |
| `OczekiwanieNaDruga` | Kliknięto kartę `B` (para nie pasuje) | Zlicz ruch, uruchom Timer 750 ms, zablokuj planszę | `BlokadaZakrywania` |
| `BlokadaZakrywania` | Dowolne kliknięcie karty | Odrzuć kliknięcie natychmiast | `BlokadaZakrywania` |
| `BlokadaZakrywania` | Upłynęło 750 ms (`Timer.Tick`) | Zakryj karty `A` i `B`, odblokuj planszę | `OczekiwanieNaPierwsza` |
| `KoniecGry` | Dowolne kliknięcie karty | Odrzuć kliknięcie natychmiast | `KoniecGry` |

### 🧩 Wzorzec enum i switch w kodzie

Najczytelniejszym sposobem zapisania maszyny stanów w C# jest połączenie typu wyliczeniowego `enum` z instrukcją `switch` sprawdzającą bieżący stan na samym początku każdej metody. Spójrz na uproszczony przykład obejmujący dwa stany automatu bramki biletowej:

```csharp
public enum StanBramki
{
    Zamknieta,
    Otwarta
}

public class BramkaBiletowa
{
    public StanBramki Stan { get; private set; }

    public bool ObsluzZdarzenie(bool czyBiletWazny)
    {
        switch (Stan)
        {
            case StanBramki.Zamknieta:
                if (!czyBiletWazny)
                    return false;
                Stan = StanBramki.Otwarta;
                return true;

            case StanBramki.Otwarta:
                // Kolejny bilet przy otwartej bramce zostaje odrzucony
                return false;

            default:
                return false;
        }
    }
}
```

Każda akcja wchodzi przez jeden punkt kontrolny. Zamiast zgadywać kombinację trzech różnych flag `bool`, natychmiast widzisz, w jakim stanie znajduje się obiekt i kiedy zwraca `false`.

<data-csharp-fsm-viz></data-csharp-fsm-viz>

<data-gate>
<data-connection-matcher title="Dopasuj parę (Stan + Zdarzenie) w Memory do właściwej reakcji maszyny stanów">
  <item left="OczekiwanieNaPierwsza + kliknięcie zakrytej karty A" right="Zapamiętaj indeks A i przejdź do OczekiwanieNaDruga"></item>
  <item left="OczekiwanieNaDruga + ponowne kliknięcie karty A" right="Odrzuć kliknięcie bez zwiększania liczby ruchów i bez zmiany stanu"></item>
  <item left="OczekiwanieNaDruga + nietrafiona druga karta B" right="Zwiększ liczbę ruchów i przejdź do BlokadaZakrywania"></item>
  <item left="BlokadaZakrywania + kliknięcie dowolnej trzeciej karty" right="Odrzuć kliknięcie natychmiast i pozostań w BlokadaZakrywania"></item>
  <item left="BlokadaZakrywania + sygnał TimerZakonczony po 750 ms" right="Wyczyść wybór pierwszej karty i wróć do OczekiwanieNaPierwsza"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Dowód kombinatoryczny na n = 3, PRNG kontra CSPRNG oraz modulo bias</span>
<span class="deep-dive-badge">MATEMATYKA · KOMBINATORYKA · KRYPTOGRAFIA</span>
</summary>
<div class="deep-dive-content">

<h4>1. Pełny dowód kombinatoryczny dla talii 3 kart (n = 3)</h4>

Rozważ tablicę `[A, B, C]` oraz naiwną pętlę `for (int i = 0; i < 3; i++) Swap(i, rnd.Next(0, 3));`. W każdym z trzech kroków istnieją 3 równoprawdopodobne wybory *j* (`0`, `1` lub `2`), co daje dokładnie `3 * 3 * 3 = 27` ścieżek wykonania.

Wszystkich możliwych permutacji jest `3! = 6`. Ponieważ `27 % 6 == 3`, rozkład nie może być jednostajny. Rozpisanie wszystkich 27 trójek `(j0, j1, j2)` daje dokładną tabelę częstości:

| Permutacja wynikowa | Liczba ścieżek z 27 | Prawdopodobieństwo | Błąd względem idealnego 1/6 (16,67%) |
| :--- | :--- | :--- | :--- |
| `[A, B, C]` | `4 / 27` | `14,81%` | `-1,85%` (niedoreprezentowana) |
| `[A, C, B]` | `5 / 27` | `18,52%` | `+1,85%` (faworyzowana) |
| `[B, A, C]` | `5 / 27` | `18,52%` | `+1,85%` (faworyzowana) |
| `[B, C, A]` | `5 / 27` | `18,52%` | `+1,85%` (faworyzowana) |
| `[C, A, B]` | `4 / 27` | `14,81%` | `-1,85%` (niedoreprezentowana) |
| `[C, B, A]` | `4 / 27` | `14,81%` | `-1,85%` (niedoreprezentowana) |

Trzy środkowe układy pojawiają się aż o 25% częściej niż trzy pozostałe (`5 / 4 = 1,25`). W algorytmie Fisher-Yates drzewo wyborów ma dokładnie `3 * 2 * 1 = 6` liści i każdy liść odpowiada innej permutacji z prawdopodobieństwem dokładnie `1/6`.

<h4>2. Generator pseudolosowy PRNG kontra kryptograficzny CSPRNG</h4>

Klasa `System.Random` jest deterministycznym generatorem pseudolosowym (_**PRNG**_). W klasycznym `.NET Framework 4.x` używa zmodyfikowanego subtraktywnego generatora Donalda Knutha z tablicą 56 liczb stanu. W nowszych wersjach `.NET` (od `.NET 6`) zastąpiono go szybszym algorytmem `Xoshiro256**`.

Oba mają jedną wspólną cechę: to samo ziarno (`new Random(42)`) daje identyczną sekwencję na każdym komputerze. To ogromna zaleta w grach i testach automatycznych, ale **_poważna luka w bezpieczeństwie_**. Po zaobserwowaniu kilkudziesięciu wyników z `System.Random` napastnik może odtworzyć stan wewnętrzny i przewidzieć kolejne karty lub tokeny sesji.

Do haseł, kluczy szyfrujących i gier na prawdziwe pieniądze stosuj wyłącznie kryptograficzny generator liczb losowych (_**CSPRNG**_): `RNGCryptoServiceProvider` (w `.NET Framework`) lub `RandomNumberGenerator.Create()`. Pobiera on entropię z jądra systemu operacyjnego (w Windows przez API `BCryptGenRandom` zasilane szumem sprzętowym i instrukcją `RDRAND`).

<h4>3. Problem modulo bias w językach C i C++</h4>

W C i C++ często spotyka się zapis `int j = rand() % N;`. Nawet gdy `rand()` zwraca idealnie równomierne liczby z zakresu `0 .. 32767` (w MSVC `RAND_MAX = 32767`, czyli 32 768 wartości), operator modulo wprowadza **_modulo bias_** dla każdego `N`, które nie jest potęgą dwójki.

Dla talii `N = 52` mamy `32768 = 630 * 52 + 8`. Reszty od `0` do `7` powstają na **631 sposobów**, natomiast reszty od `8` do `51` tylko na **630 sposobów**. Pierwsze 8 kart ma więc wyższą szansę wylosowania. W kryptografii eliminuje się **_modulo bias_** techniką **rejection sampling** (losowanie z odrzucaniem ogonka):

```c
// Bezpieczne losowanie bez modulo bias w C (rejection sampling)
unsigned int losuj_uczciwie(unsigned int n) {
    unsigned int zakres = (unsigned int)RAND_MAX + 1u;
    unsigned int limit = zakres - (zakres % n); // Największa wielokrotność n <= zakres
    unsigned int x;
    do {
        x = (unsigned int)rand();
    } while (x >= limit); // Odrzuć ogonek psujący równomierność
    return x % n;
}
```

W `.NET Framework 4.x` metoda `Random.Next(min, max)` stosuje skalowanie zmiennoprzecinkowe `(int)(Sample() * range) + minValue`. Dopiero w nowszym `.NET 6+` oraz w `RandomNumberGenerator.GetInt32(min, max)` biblioteka standardowa używa techniki **rejection sampling** i metody Lemire'a, całkowicie usuwając skrzywienie reszty z dzielenia.

</div>
</details>

---

## 💻 Zadanie praktyczne: TaliaMemory oraz SilnikStanowMemory

W pliku `Program.cs` dokończ implementację dwóch elementów silnika gry Memory:

### 🃏 Część 1: Klasa statyczna TaliaMemory

1. **`UtworzPary(int liczbaPar)`**:
   - jeśli *liczbaPar* `<= 0`, rzuć **_ArgumentOutOfRangeException_** z parametrem `"liczbaPar"`,
   - zwróć tablicę `int[liczbaPar * 2]`, w której każda liczba od `0` do `liczbaPar - 1` występuje dokładnie dwa razy (np. dla `3`: `{ 0, 0, 1, 1, 2, 2 }`).
2. **`TasujFisherYates(int[] tab, Random rnd)`**:
   - jeśli *tab* jest `null`, rzuć **_ArgumentNullException_** z parametrem `"tab"`,
   - jeśli *rnd* jest `null`, rzuć **_ArgumentNullException_** z parametrem `"rnd"`,
   - jeśli `tab.Length <= 1`, zakończ metodę bez zmian,
   - przetasuj *tab* w miejscu od końca w dół do indeksu `1`, losując `j = rnd.Next(0, i + 1)`.
3. **`CzyPoprawnaTaliaPar(int[] tab)`**:
   - jeśli *tab* jest `null`, pusta lub ma nieparzystą długość, zwróć `false`,
   - zlicz wystąpienia symboli w `Dictionary<int, int>` i sprawdź, czy każdy symbol występuje dokładnie `2` razy.

### ⚙️ Część 2: Klasa SilnikStanowMemory

Klasa steruje cyklem gry za pomocą `enum StanGry` (`OczekiwanieNaPierwsza`, `OczekiwanieNaDruga`, `BlokadaZakrywania`, `KoniecGry`). Na starcie obiekt ma `Stan == StanGry.OczekiwanieNaPierwsza`, `PierwszaKarta == -1` oraz `LiczbaRuchow == 0`.

1. **`KliknijKarte(int idx, bool czyPasuje, bool czyOstatnia)`**:
   - jeśli *idx* `< 0`, odrzuć kliknięcie i zwróć `false`,
   - w stanie `OczekiwanieNaPierwsza`: zapisz `PierwszaKarta = idx`, przejdź do `OczekiwanieNaDruga` i zwróć `true`,
   - w stanie `OczekiwanieNaDruga`:
     - jeśli `idx == PierwszaKarta`, odrzuć kliknięcie i zwróć `false` (bez zmiany stanu ani `LiczbaRuchow`),
     - zwiększ `LiczbaRuchow` o `1`,
     - jeśli *czyPasuje* jest `true`: wyzeruj `PierwszaKarta = -1`, ustaw stan `KoniecGry` (gdy *czyOstatnia* jest `true`) albo `OczekiwanieNaPierwsza` (gdy `false`) i zwróć `true`,
     - jeśli *czyPasuje* jest `false`: przejdź do `BlokadaZakrywania` i zwróć `true`,
   - w stanach `BlokadaZakrywania` oraz `KoniecGry`: odrzuć kliknięcie i zwróć `false`.
2. **`TimerZakonczony()`**:
   - działa wyłącznie w stanie `BlokadaZakrywania` (w każdym innym stanie zwraca `false` bez zmian),
   - zeruje `PierwszaKarta = -1`, przywraca stan `OczekiwanieNaPierwsza` i zwraca `true`.

<data-gate>
<data-csharp-lab title="Zadanie: TaliaMemory i maszyna stanów SilnikStanowMemory" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;

public enum StanGry
{
    OczekiwanieNaPierwsza,
    OczekiwanieNaDruga,
    BlokadaZakrywania,
    KoniecGry
}

public static class TaliaMemory
{
    public static int[] UtworzPary(int liczbaPar)
    {
        // 1. Zwaliduj liczbaPar <= 0 -> ArgumentOutOfRangeException
        // 2. Utwórz tablicę długości liczbaPar * 2 z parami 0,0,1,1,...
        return new int[0];
    }

    public static void TasujFisherYates(int[] tab, Random rnd)
    {
        // 1. Zwaliduj tab == null oraz rnd == null -> ArgumentNullException
        // 2. Dla tablicy o długości <= 1 nic nie rób
        // 3. Przetasuj tablicę w miejscu algorytmem Fisher-Yates
    }

    public static bool CzyPoprawnaTaliaPar(int[] tab)
    {
        // Sprawdź, czy tablica ma parzystą, niezerową długość
        // oraz czy każdy symbol występuje w niej dokładnie 2 razy (użyj Dictionary<int, int>)
        return false;
    }
}

public class SilnikStanowMemory
{
    public StanGry Stan { get; private set; }
    public int PierwszaKarta { get; private set; }
    public int LiczbaRuchow { get; private set; }

    public SilnikStanowMemory()
    {
        Stan = StanGry.OczekiwanieNaPierwsza;
        PierwszaKarta = -1;
        LiczbaRuchow = 0;
    }

    public bool KliknijKarte(int idx, bool czyPasuje, bool czyOstatnia)
    {
        // Obsłuż przejścia maszyny stanów zgodnie ze specyfikacją
        return false;
    }

    public bool TimerZakonczony()
    {
        // Odblokuj planszę wyłącznie ze stanu BlokadaZakrywania
        return false;
    }
}

public class Program
{
    static void Main()
    {
        int[] karty = TaliaMemory.UtworzPary(8);
        TaliaMemory.TasujFisherYates(karty, new Random(42));
        Console.WriteLine("Przetasowana talia (16 kart): " + string.Join(", ", karty));
        Console.WriteLine("Poprawna talia par: " + TaliaMemory.CzyPoprawnaTaliaPar(karty));

        var silnik = new SilnikStanowMemory();
        silnik.KliknijKarte(0, false, false);
        silnik.KliknijKarte(3, false, false);
        Console.WriteLine("Stan po nietrafionej parze: " + silnik.Stan + ", ruchy: " + silnik.LiczbaRuchow);
        silnik.TimerZakonczony();
        Console.WriteLine("Stan po timerze: " + silnik.Stan);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("UtworzPary odrzuca wartości <= 0 i generuje poprawne pary", () => {
    LabAssert.Throws<ArgumentOutOfRangeException>(() => TaliaMemory.UtworzPary(0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => TaliaMemory.UtworzPary(-3));

    int[] jednaPara = TaliaMemory.UtworzPary(1);
    LabAssert.Equal(2, jednaPara.Length);
    LabAssert.Equal(0, jednaPara[0]);
    LabAssert.Equal(0, jednaPara[1]);

    int[] czteryPary = TaliaMemory.UtworzPary(4);
    LabAssert.Equal(8, czteryPary.Length);
    LabAssert.True(TaliaMemory.CzyPoprawnaTaliaPar(czteryPary));
    Array.Sort(czteryPary);
    LabAssert.Equal("0,0,1,1,2,2,3,3", string.Join(",", czteryPary));
});

LabAssert.Test("TasujFisherYates waliduje argumenty, obsługuje małe tablice i tasuje w miejscu", () => {
    LabAssert.Throws<ArgumentNullException>(() => TaliaMemory.TasujFisherYates(null, new Random(1)));
    LabAssert.Throws<ArgumentNullException>(() => TaliaMemory.TasujFisherYates(new int[] { 1, 2 }, null));

    int[] pusta = new int[0];
    TaliaMemory.TasujFisherYates(pusta, new Random(1));
    LabAssert.Equal(0, pusta.Length);

    int[] jeden = new int[] { 99 };
    TaliaMemory.TasujFisherYates(jeden, new Random(1));
    LabAssert.Equal(99, jeden[0]);

    int[] karty = TaliaMemory.UtworzPary(8);
    string przed = string.Join(",", karty);
    TaliaMemory.TasujFisherYates(karty, new Random(123));
    string po = string.Join(",", karty);

    LabAssert.True(przed != po, "Talia powinna zmienić kolejność po tasowaniu.");
    LabAssert.True(TaliaMemory.CzyPoprawnaTaliaPar(karty), "Po tasowaniu każdy symbol nadal musi występować 2 razy.");

    Array.Sort(karty);
    LabAssert.Equal(przed, string.Join(",", karty));

    int[] kartyKopia = TaliaMemory.UtworzPary(8);
    TaliaMemory.TasujFisherYates(kartyKopia, new Random(123));
    LabAssert.Equal(po, string.Join(",", kartyKopia));

    int[] ziarno1 = TaliaMemory.UtworzPary(8);
    int[] ziarno2 = TaliaMemory.UtworzPary(8);
    TaliaMemory.TasujFisherYates(ziarno1, new Random(1));
    TaliaMemory.TasujFisherYates(ziarno2, new Random(2));
    LabAssert.True(string.Join(",", ziarno1) != string.Join(",", ziarno2), "Różne ziarna Random muszą dawać różne układy.");
});

LabAssert.Test("TasujFisherYates daje równomierny rozkład wszystkich 6 permutacji dla 3 elementów", () => {
    var rnd = new Random(42);
    var zliczenia = new System.Collections.Generic.Dictionary<string, int>();
    for (int t = 0; t < 12000; t++)
    {
        int[] tab = new int[] { 0, 1, 2 };
        TaliaMemory.TasujFisherYates(tab, rnd);
        string klucz = tab[0] + "," + tab[1] + "," + tab[2];
        if (zliczenia.ContainsKey(klucz)) zliczenia[klucz]++;
        else zliczenia[klucz] = 1;
    }

    LabAssert.Equal(6, zliczenia.Count);
    foreach (var wpis in zliczenia)
    {
        LabAssert.True(wpis.Value >= 1820 && wpis.Value <= 2180,
            "Permutacja " + wpis.Key + " wystąpiła " + wpis.Value + " razy (oczekiwano 1820..2180).");
    }
});

LabAssert.Test("CzyPoprawnaTaliaPar wykrywa błędne i poprawne układy symboli", () => {
    LabAssert.False(TaliaMemory.CzyPoprawnaTaliaPar(null));
    LabAssert.False(TaliaMemory.CzyPoprawnaTaliaPar(new int[0]));
    LabAssert.False(TaliaMemory.CzyPoprawnaTaliaPar(new int[] { 0, 0, 1 }));
    LabAssert.False(TaliaMemory.CzyPoprawnaTaliaPar(new int[] { 0, 0, 0, 1 }));
    LabAssert.False(TaliaMemory.CzyPoprawnaTaliaPar(new int[] { 5, 5, 5, 5 }));
    LabAssert.True(TaliaMemory.CzyPoprawnaTaliaPar(new int[] { 10, -3, 7, 10, 7, -3 }));
});

LabAssert.Test("SilnikStanowMemory obsługuje nietrafioną parę, blokadę i TimerZakonczony", () => {
    var silnik = new SilnikStanowMemory();
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, silnik.Stan);
    LabAssert.Equal(-1, silnik.PierwszaKarta);
    LabAssert.Equal(0, silnik.LiczbaRuchow);

    LabAssert.False(silnik.KliknijKarte(-1, false, false));
    LabAssert.False(silnik.TimerZakonczony());

    LabAssert.True(silnik.KliknijKarte(2, false, false));
    LabAssert.Equal(StanGry.OczekiwanieNaDruga, silnik.Stan);
    LabAssert.Equal(2, silnik.PierwszaKarta);
    LabAssert.Equal(0, silnik.LiczbaRuchow);

    // Ponowne kliknięcie tej samej karty musi zostać zignorowane
    LabAssert.False(silnik.KliknijKarte(2, true, false));
    LabAssert.Equal(StanGry.OczekiwanieNaDruga, silnik.Stan);
    LabAssert.Equal(0, silnik.LiczbaRuchow);

    // Druga karta nie pasuje -> przejście do blokady
    LabAssert.True(silnik.KliknijKarte(5, false, false));
    LabAssert.Equal(StanGry.BlokadaZakrywania, silnik.Stan);
    LabAssert.Equal(1, silnik.LiczbaRuchow);

    // Kliknięcie trzeciej karty podczas blokady zostaje odrzucone
    LabAssert.False(silnik.KliknijKarte(7, true, false));
    LabAssert.Equal(StanGry.BlokadaZakrywania, silnik.Stan);
    LabAssert.Equal(1, silnik.LiczbaRuchow);

    // Zakończenie timera odblokowuje planszę
    LabAssert.True(silnik.TimerZakonczony());
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, silnik.Stan);
    LabAssert.Equal(-1, silnik.PierwszaKarta);
    LabAssert.False(silnik.TimerZakonczony());
});

LabAssert.Test("SilnikStanowMemory obsługuje trafioną parę i przejście do KoniecGry", () => {
    var silnik = new SilnikStanowMemory();

    // Zwykła trafiona para (nie ostatnia)
    LabAssert.True(silnik.KliknijKarte(0, false, false));
    LabAssert.True(silnik.KliknijKarte(4, true, false));
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, silnik.Stan);
    LabAssert.Equal(-1, silnik.PierwszaKarta);
    LabAssert.Equal(1, silnik.LiczbaRuchow);

    // Ostatnia trafiona para -> KoniecGry
    LabAssert.True(silnik.KliknijKarte(1, false, false));
    LabAssert.True(silnik.KliknijKarte(3, true, true));
    LabAssert.Equal(StanGry.KoniecGry, silnik.Stan);
    LabAssert.Equal(-1, silnik.PierwszaKarta);
    LabAssert.Equal(2, silnik.LiczbaRuchow);

    // Po zakończeniu gry kliknięcia i timer są odrzucane
    LabAssert.False(silnik.KliknijKarte(0, false, false));
    LabAssert.False(silnik.TimerZakonczony());
    LabAssert.Equal(StanGry.KoniecGry, silnik.Stan);
    LabAssert.Equal(2, silnik.LiczbaRuchow);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- **Kiedy tasujesz tablicę lub talię kart:** wybierz algorytm **Fisher-Yates** w miejscu (`i` od `n - 1` w dół do `1`, losowanie `rnd.Next(0, i + 1)`), bo gwarantuje równy rozkład wszystkich `n!` permutacji w czasie `O(n)` i pamięci `O(1)`.
- **Kiedy piszesz metodę korzystającą z losowości:** wstrzykuj `Random` jako parametr zamiast wywoływać `new Random()` wewnątrz pętli, unikając powtarzalnego ziarna na `.NET Framework` i umożliwiając deterministyczne testy z `new Random(42)`.
- **Kiedy generujesz hasła lub tokeny bezpieczeństwa:** zrezygnuj z `System.Random` na rzecz kryptograficznego _**CSPRNG**_ (`RNGCryptoServiceProvider` lub `RandomNumberGenerator`).
- **Kiedy logika aplikacji ma opóźnienia i blokady kliknięć:** zastąp luźne flagi `bool` **maszyną stanów** (`enum` + `switch`), która odrzuca niedozwolone zdarzenia na wejściu.
