# Tablice jednowymiarowe i algorytmy klasyczne

Gdy przechowujesz wyniki 100 graczy, pomiary pingu z ostatniej minuty albo bufor pikseli ekranu, nie tworzysz zmiennych `ping1`, `ping2`, ..., `ping100`. Nad setką osobnych nazw nie uruchomisz pętli `for` i nie przekażesz ich do jednej metody liczącej średnią.

Rozwiązaniem jest **tablica jednowymiarowa `T[]`**: najprostszy i najszybszy kontener danych w pamięci RAM. Przechowuje wiele wartości tego samego typu pod jedną nazwą, a dostęp do dowolnego elementu zajmuje procesorowi dokładnie jedno obliczenie adresu.

---

## 🧱 Ciągły układ RAM, indeksowanie i tworzenie tablic

Tablica `int[]` rezerwuje w pamięci RAM **jeden nieprzerwany blok bajtów**. Ponieważ pojedyncza liczba `int` zajmuje dokładnie 4 bajty, adres dowolnego elementu pod indeksem *i* procesor wylicza jednym mnożeniem i dodawaniem:

$$\text{adres}(i) = \text{adres\_poczatku} + i \cdot 4\text{ bajty}$$

Właśnie dlatego indeksowanie zaczyna się od **`0`**: pierwszy element leży z przesunięciem `0` bajtów od początku tablicy. Niezależnie od tego, czy tablica ma 10 czy 10 000 000 elementów, odczyt `tab[i]` nie wymaga przeglądania wcześniejszych komórek.

| Indeks *i* | Przesunięcie od początku | Przykładowy adres RAM (hex) | Wartość w `wyniki[i]` |
| :---: | :---: | :---: | :---: |
| `0` | `+0 B` | `0x1000` | `10` |
| `1` | `+4 B` | `0x1004` | `24` |
| `2` | `+8 B` | `0x1008` | `37` |
| `3` | `+12 B` | `0x100C` | `52` |
| `4` | `+16 B` | `0x1010` | `68` |
| `5` | `+20 B` | `0x1014` | `91` |

Ostatni poprawny indeks 6-elementowej tablicy to zawsze **`tab.Length - 1`** (tutaj `5`). Próba odczytu lub zapisu `tab[6]` albo `tab[-1]` natychmiast przerywa program wyjątkiem **_IndexOutOfRangeException_**.

### 📦 Deklaracja, wartości domyślne i tablica pusta kontra null

Tablicę utworzysz na dwa sposoby: podając listę wartości startowych albo rezerwując pusty blok operatorem **`new`** o zadanym rozmiarze *n*:

```csharp
int[] wyniki = { 10, 24, 37, 52, 68, 91 }; // Rozmiar 6 wyliczony automatycznie
int[] pomiary = new int[5];                // 5 komorek: wszystkie rowne 0
bool[] flagi = new bool[3];                // 3 komorki: wszystkie rowne false
string[] nazwy = new string[4];            // 4 komorki: wszystkie rowne null
```

Po utworzeniu tablicy CLR automatycznie zeruje jej pamięć, wpisując **wartości domyślne**: `0` dla typów liczbowych (`int`, `double`), `false` dla `bool`, `'\0'` dla `char` oraz `null` dla typów referencyjnych (`string`).

Tablica ma **stały rozmiar**. Gdy raz utworzysz `new int[5]`, jej właściwość `Length` pozostanie równa `5` aż do końca istnienia obiektu (powiększenie wymaga utworzenia nowej, większej tablicy i skopiowania elementów).

Nie myl tablicy pustej z brakiem tablicy (`null`):
- **`int[] pusta = new int[0];`**: istniejący obiekt tablicy bez elementów. Odczyt `pusta.Length` bezpiecznie zwraca `0`, a pętla po tej tablicy wykona się `0` razy.
- **`int[] brak = null;`**: zmienna nie wskazuje na żaden obiekt w pamięci. Każda próba odczytu `brak.Length` kończy się wyjątkiem **_NullReferenceException_**.

### 🔁 Iteracja, szukanie ekstremum i aliasing referencji

Do przechodzenia po tablicy używasz klasycznej pętli `for` lub pętli `foreach`:

```csharp
int[] temperatury = { -12, -4, -19, -7 };

// Petla for: masz dostep do indeksu i mozesz modyfikowac tab[i]
for (int i = 0; i < temperatury.Length; i++)
{
    temperatury[i] += 1;
}

// Petla foreach: czytelny odczyt wszystkich elementow bez ryzyka bledu indeksu
foreach (int t in temperatury)
{
    Console.WriteLine(t);
}
```

Pętla `foreach` służy wyłącznie do odczytu: zmiennej *t* nie wolno nadpisywać wewnątrz pętli. Gdy chcesz wypisać całą tablicę w jednej linii tekstu, przydaje się metoda `string.Join(", ", dane)`, która łączy wszystkie elementy tablicy w jeden napis rozdzielony podanym separatorem.

Częstym zadaniem na tablicach jest znalezienie najmniejszej (`min`) lub największej (`max`) wartości. Zawsze inicjalizuj zmienną *max* pierwszym elementem tablicy `tab[0]`, a nigdy zerem `0`:

```csharp
int max = temperatury[0]; // Poprawnie: startujemy od realnego elementu (-11)
for (int i = 1; i < temperatury.Length; i++)
{
    if (temperatury[i] > max) max = temperatury[i];
}
```

Gdybyś wpisał `int max = 0;`, dla tablicy samych temperatur ujemnych (`{ -11, -3, -18, -6 }`) kod zwróciłby fałszywe `0`, którego w ogóle nie ma w danych. Przed odczytem `tab[0]` zawsze upewnij się, że `tab.Length > 0`.

> [!WARNING]
> **Pułapka aliasingu referencji:** tablica w C# jest **typem referencyjnym**. Zapis `int[] kopia = oryginal;` **_nie kopiuje_** liczb w pamięci RAM. Tworzy wyłącznie drugą nazwę (alias) wskazującą na tę samą tablicę. Zmiana `kopia[0] = 99;` natychmiast zmienia `oryginal[0]`. Dokładnie tak samo działa przekazanie `int[] tab` do metody: zmiany w `tab[i]` wewnątrz metody są od razu widoczne w `Main()`.

---

## ⚡ Trzy klasyczne algorytmy na tablicach

### 🔍 1. Wyszukiwanie binarne

Jeśli dane w tablicy są **posortowane rosnąco**, przeglądanie ich element po elemencie od indeksu `0` jest stratą czasu. **Wyszukiwanie binarne** (Binary Search) utrzymuje aktywny przedział `[lewy..prawy]` i w każdym kroku sprawdza dokładnie jego środek:

1. Wyznacz `srodek = lewy + (prawy - lewy) / 2`.
2. Jeśli `tab[srodek] == szukana`: zwracasz indeks *srodek*.
3. Jeśli `tab[srodek] < szukana`: szukana liczba może być tylko po prawej, więc ustawiasz `lewy = srodek + 1`.
4. Jeśli `tab[srodek] > szukana`: szukana liczba może być tylko po lewej, więc ustawiasz `prawy = srodek - 1`.
5. Pętla działa dopóki `lewy <= prawy`. Gdy granice się miną, elementu nie ma w tablicy i zwracasz `-1`.

> [!IMPORTANT]
> **Dlaczego `lewy + (prawy - lewy) / 2`, a nie `(lewy + prawy) / 2`?**
> Przy bardzo dużej tablicy (ponad 1,1 miliarda elementów) indeksy *lewy* i *prawy* mogą przekroczyć miliard. Ich suma `lewy + prawy` przekroczy wtedy limit 32-bitowego `int` (`2 147 483 647`), zawinie się na liczbę ujemną i wywoła **_IndexOutOfRangeException_**. Wzór `lewy + (prawy - lewy) / 2` daje ten sam matematyczny środek bez ryzyka przepełnienia.

Prześledź tabelę śladu dla tablicy `tab = { -10, 0, 3, 7, 19, 25, 42 }` (indeksy `0..6`):

| Przypadek | Krok | *lewy* | *prawy* | *srodek* | `tab[srodek]` | Decyzja |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| Szukamy `19` | 1 | `0` | `6` | `3` | `7` | `7 < 19`, więc `lewy = 4` |
| Szukamy `19` | 2 | `4` | `6` | `5` | `25` | `25 > 19`, więc `prawy = 4` |
| Szukamy `19` | 3 | `4` | `4` | `4` | `19` | Trafienie! Zwracamy `4` |
| Szukamy `10` | 1 | `0` | `6` | `3` | `7` | `7 < 10`, więc `lewy = 4` |
| Szukamy `10` | 2 | `4` | `6` | `5` | `25` | `25 > 10`, więc `prawy = 4` |
| Szukamy `10` | 3 | `4` | `4` | `4` | `19` | `19 > 10`, więc `prawy = 3` (`lewy > prawy`: koniec, zwracamy `-1`) |

Zwróć uwagę na krok 3 obu przypadków oraz na tablicę jednoelementową `{ 7 }`, gdzie na starcie `lewy = 0` i `prawy = 0`. Gdyby pętla miała warunek `lewy < prawy` zamiast **`lewy <= prawy`**, algorytm nigdy nie sprawdziłby ostatniego pozostałego elementu pod indeksem `4` ani jedynego elementu tablicy `{ 7 }`!

Każde jedno porównanie odrzuca **połowę pozostałych danych**. Zobacz konkretną różnicę liczby porównań:

| Rozmiar tablicy | Wyszukiwanie liniowe (średnio / pesymistycznie) | Wyszukiwanie binarne (maksymalnie porównań) |
| :---: | :---: | :---: |
| `100` elementów | `50` / `100` | `7` |
| `10 000` elementów | `5 000` / `10 000` | `14` |
| `1 000 000` elementów | `500 000` / `1 000 000` | `20` |
| `1 000 000 000` elementów | `500 000 000` / `1 000 000 000` | `30` |

Przy milionie elementów wyszukiwanie binarne wykonuje najwyżej **20 porównań** zamiast średnio **500 000**. Warunek konieczny: tablica musi być wcześniej posortowana.

<data-gate>
<data-sortable-list title="Ułóż w poprawnej kolejności etapy wyszukiwania binarnego w posortowanej tablicy">
  <item data-correct="1">Ustaw początkowe granice przedziału: lewy = 0 oraz prawy = tab.Length - 1</item>
  <item data-correct="2">Dopóki lewy <= prawy, wylicz środek wzorem lewy + (prawy - lewy) / 2</item>
  <item data-correct="3">Jeśli tab[srodek] == szukana, natychmiast zwróć indeks srodek</item>
  <item data-correct="4">Jeśli tab[srodek] < szukana, przesuń lewy = srodek + 1; w przeciwnym razie prawy = srodek - 1</item>
  <item data-correct="5">Gdy granice się miną (lewy > prawy), zakończ pętlę i zwróć -1</item>
</data-sortable-list>
</data-gate>

### 🔄 2. Odwracanie tablicy w miejscu dwoma wskaźnikami

Aby odwrócić kolejność elementów w tablicy, nie musisz rezerwować drugiej tablicy tej samej wielkości. Wystarczą dwa indeksy startujące z przeciwnych końców: *lewy* równy `0` oraz *prawy* równy `tab.Length - 1`.

Dopóki `lewy < prawy`, zamieniasz miejscami `tab[lewy]` i `tab[prawy]` przez jedną pomocniczą zmienną *temp*, po czym przesuwasz oba indeksy ku środkowi (`lewy++`, `prawy--`).

Sprawdź, dlaczego warunek **`lewy < prawy`** działa bezbłędnie dla obu rodzajów długości:
- **Długość parzysta** (np. 4 elementy o indeksach `0, 1, 2, 3`): zamieniasz parę `(0, 3)`, potem `(1, 2)`. Następnie `lewy = 2`, `prawy = 1`: warunek `2 < 1` jest fałszywy i pętla kończy pracę.
- **Długość nieparzysta** (np. 5 elementów o indeksach `0, 1, 2, 3, 4`): zamieniasz `(0, 4)`, potem `(1, 3)`. Następnie `lewy = 2`, `prawy = 2`: środkowy element pod indeksem `2` stoi już na swoim docelowym miejscu, a warunek `2 < 2` zatrzymuje pętlę bez zbędnej zamiany z samym sobą.

Dla tablicy o 1 000 000 elementów algorytm wykonuje dokładnie 500 000 zamian i zużywa wyłącznie **4 bajty dodatkowej pamięci** na zmienną *temp*.

### 🃏 3. Sortowanie przez wstawianie

Algorytm **Insertion Sort** działa dokładnie tak, jak układasz karty w ręku. Lewą część tablicy traktujesz jako już posortowaną (na starcie stanowi ją sam element `tab[0]`).

W kolejnych krokach dla *i* od `1` do `tab.Length - 1`:
1. Zapamiętujesz bieżący element w zmiennej `klucz = tab[i]` i ustawiasz `j = i - 1`.
2. W wewnętrznej pętli `while` przesuwasz w prawo wszystkie większe od niego elementy z posortowanej lewej części (`tab[j + 1] = tab[j]`), zmniejszając *j*.
3. Gdy trafisz na mniejszy lub równy element (albo na początek tablicy `j == -1`), wstawiasz *klucz* w zwolnione miejsce `tab[j + 1]`.

> [!WARNING]
> **Kolejność w warunku `while (j >= 0 && tab[j] > klucz)` jest krytyczna!**
> Operator `&&` działa ze zwarciem od lewej do prawej. Gdy *klucz* jest najmniejszym elementem i *j* spada do `-1`, warunek `j >= 0` daje `false`, więc prawa strona nie zostaje w ogóle sprawdzona. Jeśli odwrócisz kolejność na `while (tab[j] > klucz && j >= 0)`, program spróbuje odczytać `tab[-1]` i natychmiast rzuci **_IndexOutOfRangeException_**.

<data-insert-sort-poker></data-insert-sort-poker>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: historia błędu Joshuy Blocha, Bounds Check Elimination w JIT i linie L1 CPU Cache</span>
<span class="deep-dive-badge">CPU CACHE · JIT .NET · C/C++ · ALGORYTMIKA</span>
</summary>
<div class="deep-dive-content">

<h4>1. Dwadzieścia lat ukrytego błędu w bibliotekach standardowych</h4>

Przez ponad 20 lat podręczniki algorytmiki oraz oficjalna biblioteka standardowa Javy (`Arrays.binarySearch`) zawierały zapis `(lewy + prawy) / 2`. Błąd ujawnił się dopiero wtedy, gdy serwery zaczęły dysponować wielogigabajtową pamięcią RAM, i został głośno opisany w 2006 roku przez Joshuę Blocha. W C oraz C++, oprócz wzoru `lewy + (prawy - lewy) / 2`, stosuje się także rzutowanie na typ bez znaku z przesunięciem bitowym: `((unsigned int)lewy + (unsigned int)prawy) >> 1`.

<h4>2. Arytmetyka wskaźników w C kontra Bounds Check Elimination w JIT .NET</h4>

W języku C zapis `tab[i]` jest dosłownie skrótem dla arytmetyki wskaźników `*(tab + i)`. Kompilator C nie sprawdza, czy *i* mieści się w granicach tablicy: odczyt `tab[500]` po prostu sięga po przypadkową pamięć (częste źródło luk bezpieczeństwa **_Buffer Overflow_**).

W C# każdy dostęp `tab[i]` jest bezpieczny: CLR musi sprawdzić warunek `0 <= i < tab.Length`. Wydawałoby się, że w pętli na milion obrotów to milion dodatkowych instrukcji `cmp` i skoków warunkowych. Jednak kompilator **RyuJIT** w .NET stosuje optymalizację **Bounds Check Elimination** (BCE).

Gdy napiszesz kanoniczną pętlę:

```csharp
for (int i = 0; i < tab.Length; i++)
{
    suma += tab[i];
}
```

JIT udowadnia statycznie, że *i* zawsze zaczyna od `0`, rośnie co `1` i kończy się ściśle poniżej `tab.Length`. W wygenerowanym kodzie maszynowym x86-64 całkowicie usuwa sprawdzenie granic z wnętrza pętli, generując kod niemal identyczny z zoptymalizowanym C++ (`add eax, dword ptr [rcx + rdx*4 + 10h]`, gdzie `+10h` to 16-bajtowy nagłówek obiektu tablicy na stercie CLR). Jeśli jednak zapiszesz warunek nietypowo (np. `i <= tab.Length - 1` albo przez oddzielną zmienną `int n = tab.Length`), w starszych wersjach JIT optymalizacja BCE może nie zadziałać.

<h4>3. Linia L1 CPU Cache (64 B) i Hardware Prefetcher</h4>

Dlaczego iteracja po tablicy `int[]` bywa 5 do 10 razy szybsza niż przejście po tej samej liczbie elementów w strukturze rozrzuconej po pamięci (np. liście wiązanej)?

Dostęp do głównej pamięci RAM trwa około **60 do 100 nanosekund** (setki cykli procesora), podczas gdy odczyt z pamięci podręcznej **L1 Cache** trwa około **1 nanosekundy** (3 do 4 cykle). Procesor nigdy nie pobiera z RAM pojedynczego 4-bajtowego `int`: kontroler pamięci zawsze transferuje całą **linię cache o rozmiarze 64 bajtów**.

Ponieważ elementy `int[]` leżą w pamięci jeden za drugim:
- odczyt `tab[0]` wczytuje do L1 Cache za jednym zamachem aż **16 kolejnych liczb `int`** (`tab[0]`..`tab[15]`),
- kolejne 15 odczytów trafia bezpośrednio w L1 Cache (**Cache Hit**),
- dodatkowo wbudowany w procesor układ **Hardware Prefetcher** wykrywa liniowy wzorzec dostępu i zaczyna pobierać z RAM kolejną linię (`tab[16]`..`tab[31]`) jeszcze zanim pętla do niej dotrze.

Porównanie kosztów sprzętowych dla przejścia przez 1 000 000 liczb `int` (4 MB danych):
- ciągła tablica `int[]`: dokładnie `62 500` linii cache (po 64 B), prawie 100% trafień dzięki prefetcherowi, czas około 0,4 ms,
- rozproszona struktura wskaźnikowa (węzły rozsiane po stercie): do `1 000 000` osobnych pobrań z RAM, czas 6 do 12 ms.

Dlatego nawet algorytmy wykonujące więcej prostych operacji na ciągłej tablicy potrafią w praktyce pokonać bardziej skomplikowane struktury wskaźnikowe.

</div>
</details>

---

## 💻 Zadanie praktyczne: Biblioteka algorytmów na tablicach int

W klasie `AlgorytmyTablic` zaimplementuj trzy metody statyczne:

1. **`WyszukajBinarnie(int[] posortowana, int szukana)`**:
   - wyszukuje *szukana* w tablicy posortowanej rosnąco,
   - zwraca indeks znalezionego elementu lub `-1`, jeśli element nie występuje (również dla tablicy pustej `Length == 0`),
   - środek wyliczaj bezpiecznym wzorem `lewy + (prawy - lewy) / 2`.
2. **`OdwrocWMiejscu(int[] tab)`**:
   - odwraca kolejność elementów bezpośrednio w przekazanej tablicy bez alokowania drugiej tablicy,
   - poprawnie obsługuje tablice o długości `0`, `1`, parzystej i nieparzystej.
3. **`SortujPrzezWstawianie(int[] tab)`**:
   - sortuje tablicę rosnąco w miejscu algorytmem Insertion Sort (bez użycia `Array.Sort`),
   - poprawnie obsługuje duplikaty, liczby ujemne, tablicę już posortowaną oraz posortowaną odwrotnie.

<data-gate>
<data-csharp-lab title="Zadanie: Binary Search, Reverse In-Place i Insertion Sort" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class AlgorytmyTablic
{
    public static int WyszukajBinarnie(int[] posortowana, int szukana)
    {
        // Zaimplementuj wyszukiwanie binarne z wzorem lewy + (prawy - lewy) / 2
        return -1;
    }

    public static void OdwrocWMiejscu(int[] tab)
    {
        // Zamieniaj pary (lewy, prawy) az indeksy sie spotkaja w srodku
    }

    public static void SortujPrzezWstawianie(int[] tab)
    {
        // Zaimplementuj sortowanie przez wstawianie rosnaco w miejscu
    }

    static void Main()
    {
        int[] dane = { 42, -7, 19, 3, 25, 3 };
        SortujPrzezWstawianie(dane);
        Console.WriteLine("Posortowane: " + string.Join(", ", dane));
        Console.WriteLine("Indeks 19: " + WyszukajBinarnie(dane, 19));
        OdwrocWMiejscu(dane);
        Console.WriteLine("Odwrocone: " + string.Join(", ", dane));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("SortujPrzezWstawianie obsluguje liczby ujemne, duplikaty i przypadki brzegowe", () => {
    int[] t1 = { 42, -7, 19, 3, 25, 3 };
    AlgorytmyTablic.SortujPrzezWstawianie(t1);
    LabAssert.Equal("-7,3,3,19,25,42", string.Join(",", t1));

    int[] odwrocona = { 9, 7, 5, 3, 1 };
    AlgorytmyTablic.SortujPrzezWstawianie(odwrocona);
    LabAssert.Equal("1,3,5,7,9", string.Join(",", odwrocona));

    int[] jeden = { 99 };
    AlgorytmyTablic.SortujPrzezWstawianie(jeden);
    LabAssert.Equal("99", string.Join(",", jeden));

    int[] pusta = new int[0];
    AlgorytmyTablic.SortujPrzezWstawianie(pusta);
    LabAssert.Equal(0, pusta.Length);
});
LabAssert.Test("WyszukajBinarnie znajduje elementy na brzegach, w srodku, z ujemnymi i przy braku", () => {
    int[] t = { -50, -10, 0, 3, 7, 19, 25, 42 };
    LabAssert.Equal(0, AlgorytmyTablic.WyszukajBinarnie(t, -50));
    LabAssert.Equal(2, AlgorytmyTablic.WyszukajBinarnie(t, 0));
    LabAssert.Equal(5, AlgorytmyTablic.WyszukajBinarnie(t, 19));
    LabAssert.Equal(7, AlgorytmyTablic.WyszukajBinarnie(t, 42));
    LabAssert.Equal(-1, AlgorytmyTablic.WyszukajBinarnie(t, -100));
    LabAssert.Equal(-1, AlgorytmyTablic.WyszukajBinarnie(t, 10));
    LabAssert.Equal(-1, AlgorytmyTablic.WyszukajBinarnie(t, 100));

    int[] jeden = { 7 };
    LabAssert.Equal(0, AlgorytmyTablic.WyszukajBinarnie(jeden, 7));
    LabAssert.Equal(-1, AlgorytmyTablic.WyszukajBinarnie(jeden, 8));

    int[] pusta = new int[0];
    LabAssert.Equal(-1, AlgorytmyTablic.WyszukajBinarnie(pusta, 5));
});
LabAssert.Test("OdwrocWMiejscu dziala dla parzystej, nieparzystej, 1-elementowej i pustej tablicy", () => {
    int[] a = { 1, 2, 3, 4, 5 };
    AlgorytmyTablic.OdwrocWMiejscu(a);
    LabAssert.Equal("5,4,3,2,1", string.Join(",", a));

    int[] b = { -10, 20, -30, 40 };
    AlgorytmyTablic.OdwrocWMiejscu(b);
    LabAssert.Equal("40,-30,20,-10", string.Join(",", b));

    int[] c = { 77 };
    AlgorytmyTablic.OdwrocWMiejscu(c);
    LabAssert.Equal("77", string.Join(",", c));

    int[] d = new int[0];
    AlgorytmyTablic.OdwrocWMiejscu(d);
    LabAssert.Equal(0, d.Length);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Jak bezpiecznie indeksować i przekazywać tablice w C#?</strong> Indeksy biegną od `0` do `tab.Length - 1`, a tablica jest typem referencyjnym: przypisanie `kopia = oryginal` tworzy alias, nie kopię. Odróżniaj pustą tablicę `new int[0]` od `null`, który rzuca **_NullReferenceException_**.
- <strong>Kiedy użyć <code>for</code>, a kiedy <code>foreach</code>?</strong> Wybieraj `for`, gdy potrzebujesz indeksu lub chcesz zmieniać elementy `tab[i]`. Wybieraj `foreach`, gdy tylko czytasz kolejne wartości. Przy szukaniu `min` i `max` zawsze startuj od `tab[0]`, nigdy od `0`.
- <strong>Kiedy wolno użyć wyszukiwania binarnego i jak uniknąć błędów brzegowych?</strong> Używaj go wyłącznie na posortowanej tablicy. Pętlę zapisuj z warunkiem `lewy <= prawy`, a środek licz wzorem `lewy + (prawy - lewy) / 2`.
- <strong>Na co uważać w algorytmach działających w miejscu?</strong> Przy odwracaniu dwoma wskaźnikami używaj `lewy < prawy`, aby poprawnie obsłużyć długość parzystą i nieparzystą. W Insertion Sort zawsze stawiaj `j >= 0` po lewej stronie `&&`, zanim odczytasz `tab[j]`.
