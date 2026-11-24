# Tablice dwuwymiarowe i reprezentacja planszy

Tablica jednowymiarowa `T[]` świetnie sprawdza się przy liście wyników albo serii pomiarów. Spróbuj jednak zapisać w niej planszę do gry Kółko i Krzyżyk, mapę kafelkową w grze 2D albo obrazek ze skanera.

Osobne zmienne `pole1` aż do `pole9` albo trzy oddzielne tablice `wiersz0`, `wiersz1` i `wiersz2` szybko zamieniają kod w plątaninę warunków. Nie przejdziesz po nich jedną pętlą, nie sprawdzisz prosto przekątnej i nie zmienisz rozmiaru planszy na `2x4`.

Do takich danych służy w C# **tablica dwuwymiarowa** `T[,]`. Przechowuje ona prostokątną siatkę wierszy i kolumn jako jedną, spójną strukturę w pamięci.

---

## 🗺️ Deklaracja, inicjalizacja i układ Row-Major w pamięci

Tablicę dwuwymiarową możesz utworzyć na dwa sposoby. Pierwszy rezerwuje pustą siatkę o zadanych wymiarach, wypełnioną wartościami domyślnymi (`0` dla `int`, `'\0'` dla `char`). Drugi pozwala od razu wpisać konkretne wartości za pomocą **inicjalizacji literałowej**.

```csharp
// 1. Pusta prostokatna tablica 2 wiersze x 4 kolumny
int[,] tabela = new int[2, 4];

// 2. Inicjalizacja literalowa (2 wiersze x 3 kolumny)
char[,] plansza = {
    { 'X', 'O', '.' },
    { '.', 'X', 'O' }
};
```

Każda wewnętrzna para klamer `{ ... }` tworzy jeden wiersz tablicy. Wszystkie wiersze w `T[,]` muszą mieć dokładnie tyle samo elementów. Jeśli w drugim wierszu wpiszesz o jedną komórkę mniej, kompilator od razu odrzuci kod.

Komórkę wskazujesz parą indeksów `[r, c]`, zawsze liczoną od zera. Pierwszy indeks *r* oznacza numer wiersza, a drugi indeks *c* oznacza numer kolumny.

### 📏 Wymiary tablicy prostokątnej i pułapka zamiany indeksów

Dla kwadratowej planszy `3x3` liczba wierszy i kolumn jest identyczna. Różnicę widać dopiero na macierzy prostokątnej, na przykład `2x4`, gdzie wiersze nie są równe kolumnom.

W C# do sprawdzania rozmiaru tablicy `T[,]` służą trzy różne odczyty:
- **`plansza.GetLength(0)`** zwraca liczbę **wierszy** (pierwszy wymiar).
- **`plansza.GetLength(1)`** zwraca liczbę **kolumn** (drugi wymiar).
- **`plansza.Length`** zwraca **łączną liczbę wszystkich komórek** (`wiersze * kolumny`, dla `2x4` to `8`).

> [!IMPORTANT]
> Nigdy nie myl `GetLength(0)` z `GetLength(1)` ani nie wpisuj `plansza.Length` jako granicy pętli po wierszach. Na kwadracie `3x3` zamiana `GetLength(0)` z `GetLength(1)` ukrywa błąd, ale na planszy `2x4` natychmiast kończy się wyjątkiem **_IndexOutOfRangeException_**.

### 🧱 Jak pamięć RAM układa siatkę 2D?

Choć w kodzie widzisz `char[3, 3]` jako kwadrat, fizyczna pamięć RAM jest jednowymiarowym ciągiem bajtów. C# (tak samo jak C i C++) zapisuje tablicę `T[,]` w **układzie wierszowym** (Row-Major).

Najpierw w pamięci leżą wszystkie komórki wiersza `0`, tuż za nimi cały wiersz `1`, a na końcu wiersz `2`. Dlatego w zagnieżdżonych pętlach zawsze iterujemy najpierw po wierszach *r*, a wewnątrz po kolumnach *c*.

<data-csharp-grid2d-viz></data-csharp-grid2d-viz>

---

## 🧭 Przeliczanie współrzędnych w obie strony

Gracz w konsoli woli wpisać jedną cyfrę od `1` do `9` niż podawać osobno wiersz i kolumnę. Nie potrzebujesz do tego dziewięciu warunków `if` ani instrukcji `switch`.

Wystarczą dwa operatory arytmetyczne: dzielenie całkowite `/` oraz reszta z dzielenia `%`. Wzór działa dla planszy o dowolnej liczbie *kolumny*:

```csharp
int indeks = pole - 1;          // Przesuniecie z 1..N na 0..(N-1)
int r = indeks / kolumny;       // Numer wiersza (ile pelnych wierszy minelismy)
int c = indeks % kolumny;       // Numer kolumny (pozycja w biezacym wierszu)
```

Zobacz ten mechanizm na standardowej planszy `3x3` (`kolumny = 3`):

| Numer *pole* | `indeks = pole - 1` | `r = indeks / 3` | `c = indeks % 3` | Współrzędne `plansza[r, c]` |
| :---: | :---: | :---: | :---: | :---: |
| `1` | `0` | `0` | `0` | `[0, 0]` (lewy górny róg) |
| `2` | `1` | `0` | `1` | `[0, 1]` |
| `3` | `2` | `0` | `2` | `[0, 2]` (prawy górny róg) |
| `4` | `3` | `1` | `0` | `[1, 0]` |
| `5` | `4` | `1` | `1` | `[1, 1]` (środek planszy) |
| `6` | `5` | `1` | `2` | `[1, 2]` |
| `7` | `6` | `2` | `0` | `[2, 0]` (lewy dolny róg) |
| `8` | `7` | `2` | `1` | `[2, 1]` |
| `9` | `8` | `2` | `2` | `[2, 2]` (prawy dolny róg) |

Ten sam wzór bez żadnych zmian obsługuje planszę prostokątną `2x4` (`wiersze = 2`, `kolumny = 4`). Sprawdź pole `5`: `indeks = 4`, więc `r = 4 / 4 = 1`, a `c = 4 % 4 = 0`. To dokładnie pierwsza kolumna drugiego wiersza!

### 🔄 Kierunek odwrotny: ze współrzędnych na numer pola

Kiedy rysujesz pustą planszę w konsoli, musisz wykonać operację odwrotną. Znasz bieżące *r* i *c* z pętli, a chcesz wypisać numer pola widoczny dla gracza.

```csharp
int pole = r * kolumny + c + 1;
```

Dlaczego to działa? Przed wierszem *r* leży dokładnie `r * kolumny` pełnych pól. Dodajesz pozycję *c* w bieżącym wierszu, co daje indeks od zera, a na końcu dopisujesz `+ 1`, aby wrócić do numeracji od `1`.

> [!WARNING]
> Zawsze sprawdzaj zakres `pole < 1 || pole > wiersze * kolumny`, zanim użyjesz dzielenia i reszty. Dla `pole = 0` w C# wyrażenie `(0 - 1) / 3` daje `0`, a `(0 - 1) % 3` daje `-1`, co prowadzi prosto do **_IndexOutOfRangeException_** przy próbie odczytu `plansza[0, -1]`.

---

## 🔁 Wypisywanie siatki i sprawdzanie linii wygrywających

Aby wypisać dowolną tablicę `char[,]` w formie czytelnej siatki, łączysz dwie pętle `for` z różnymi metodami konsoli. Wewnątrz używasz `Console.Write`, aby komórki jednego wiersza stały obok siebie.

```csharp
char[,] siatka = {
    { '.', 'X', '.', 'O' },
    { 'X', '.', 'X', '.' }
};

for (int r = 0; r < siatka.GetLength(0); r++)
{
    for (int c = 0; c < siatka.GetLength(1); c++)
    {
        Console.Write(siatka[r, c] + " ");
    }
    Console.WriteLine(); // Nowa linia dopiero po calym wierszu!
}
```

Jeśli przez pomyłkę użyjesz `Console.WriteLine` w pętli wewnętrznej, cała plansza rozciągnie się w jedną pionową kolumnę. Jeśli z kolei zapomnisz o `Console.WriteLine()` na końcu pętli zewnętrznej, oba wiersze skleją się w jeden płaski ciąg znaków.

### 🔹 Osiem linii wygrywających na planszy 3x3

W grze Kółko i Krzyżyk zwycięstwo daje wypełnienie jednym znakiem dowolnej z **8 linii**:
- **3 wiersze**: `[0, 0..2]`, `[1, 0..2]`, `[2, 0..2]` (stały pierwszy indeks *r*).
- **3 kolumny**: `[0..2, 0]`, `[0..2, 1]`, `[0..2, 2]` (stały drugi indeks *c*).
- **przekątna główna**: `[0, 0]`, `[1, 1]`, `[2, 2]` (współrzędne spełniają `r == c`).
- **antyprzekątna**: `[0, 2]`, `[1, 1]`, `[2, 0]` (współrzędne spełniają `r + c == 2`).

Sprawdzanie wszystkich wierszy na planszy `3x3` zamyka się w jednej krótkiej pętli:

```csharp
for (int i = 0; i < 3; i++)
{
    if (p[i, 0] == znak && p[i, 1] == znak && p[i, 2] == znak)
    {
        return true;
    }
}
```

W tej samej pętli `for (int i = 0; i < 3; i++)` możesz dołożyć drugi warunek sprawdzający kolumnę numer *i*: wystarczy zamienić miejscami indeks stały z indeksem *i*. Po wyjściu z pętli pozostają już tylko dwa osobne warunki dla przekątnej głównej i antyprzekątnej.

<data-gate>
<data-connection-matcher title="Dopasuj wzór lub właściwość tablicy 2D do jej znaczenia na planszy">
  <item left="plansza.GetLength(0)" right="Liczba wierszy, czyli pierwszy wymiar tablicy dwuwymiarowej"></item>
  <item left="plansza.GetLength(1)" right="Liczba kolumn, czyli drugi wymiar tablicy dwuwymiarowej"></item>
  <item left="r == c" right="Warunek opisujący komórki leżące na przekątnej głównej"></item>
  <item left="r + c == 2" right="Warunek opisujący komórki leżące na antyprzekątnej planszy 3x3"></item>
  <item left="r * kolumny + c + 1" right="Przeliczenie współrzędnych (r, c) z powrotem na numer pola od 1"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Row-Major vs Column-Major na obrazie Full HD oraz CIL dla char[,] vs char[][]</span>
<span class="deep-dive-badge">CPU CACHE · CIL · GRAFIKA 2D · C# vs C++</span>
</summary>
<div class="deep-dive-content">

<h4>1. Row-Major (C/C++/C#) kontra Column-Major (Fortran/MATLAB/Julia)</h4>

Fizyczna pamięć RAM ma tylko jeden wymiar. Aby zapisać w niej macierz o `W` wierszach i `K` kolumnach, język programowania musi przyjąć jedną z dwóch konwencji spłaszczania adresu:
- **Row-Major** (C, C++, C#, Python/NumPy domyślnie): $\text{offset} = r \cdot K + c$. Sąsiednie komórki w tym samym wierszu leżą obok siebie.
- **Column-Major** (Fortran, MATLAB, R, OpenGL/GLSL dla macierzy): $\text{offset} = c \cdot W + r$. Sąsiednie komórki w tej samej kolumnie leżą obok siebie.

W języku C dla statycznej tablicy `int img[1080][1920]` kompilator zamienia `img[r][c]` bezpośrednio na jedno wyrażenie arytmetyki wskaźników:

```c
int piksel = *(&img[0][0] + r * 1920 + c); // Bezposredni skok o (r * 1920 + c) * 4 B
```

<h4>2. Ile dokładnie kosztuje zła kolejność pętli na obrazie Full HD 1920x1080?</h4>

Wyobraź sobie bufor klatki (framebuffer) w formacie RGBA, gdzie każdy piksel zajmuje 4 bajty. Obraz ma `1080` wierszy i `1920` kolumn (`int[1080, 1920]`), czyli łącznie `8 294 400` bajtów (około 7,9 MB).

W **pętli zgodnej z Row-Major** (`for r`, wewnątrz `for c`) każdy krok przesuwa adres o `+4` bajty. Jedna linia pamięci L1 CPU Cache (64 bajty) dostarcza od razu **16 kolejnych pikseli**. Na 2 073 600 pikseli procesor pobiera linię z RAM tylko `129 600` razy, a sprzętowy mechanizm wyprzedzania (Hardware Prefetcher) ładuje dane z góry.

W **pętli odwróconej** (`for c`, wewnątrz `for r`) każdy krok przeskakuje cały wiersz obrazu, czyli `1920 * 4 = 7 680` bajtów (120 linii cache naraz). Procesor pobiera z RAM 64 bajty, wykorzystuje zaledwie **4 bajty** (jeden piksel), a resztę marnuje.

Zanim pętla przejdzie do kolumny `c + 1`, wczytana wcześniej linia zostaje wypchnięta z 32 KB pamięci L1 Cache (`1080` wierszy razy 64 bajty to 69 KB). Efektem jest niemal 2 073 600 przypadków **_Cache Miss_** i nawet 8 do 12 razy wolniejsze działanie tego samego programu.

<h4>3. Dlaczego w CLR tablice poszarpane char[][] różnią się w bajtkodzie CIL od char[,]?</h4>

W środowisku .NET jednowymiarowe tablice indeksowane od zera (wektory SZArray) mają w bajtkodzie CIL własne, superszybkie instrukcje:

```il
; Odczyt elementu z tablicy poszarpanej char[][] (tablica tablic):
ldloc.0         ; zaladuj referencje do zewnetrznej tablicy wierszy
ldloc.1         ; zaladuj indeks r
ldelem.ref      ; natywna instrukcja CIL -> pobierz wiersz (char[])
ldloc.2         ; zaladuj indeks c
ldelem.u2       ; natywna instrukcja CIL -> pobierz char (2 bajty)
```

Tablica wielowymiarowa `char[,]` w CLR **nie ma osobnej instrukcji odczytu w CIL**. Kompilator C# generuje dla `p[r, c]` wywołanie specjalnej metody tworzonej przez środowisko uruchomieniowe:

```il
; Odczyt elementu z tablicy prostokatnej char[,]:
ldloc.0         ; zaladuj referencje do char[,]
ldloc.1         ; zaladuj r
ldloc.2         ; zaladuj c
call instance uint16 char[0...,0...]::Get(int32, int32)
```

Współczesny kompilator JIT RyuJIT potrafi rozwinąć wywołania `Get` i `Set` bezpośrednio w miejscu użycia. Mimo to tablica `char[,]` musi pilnować granic oraz dolnych indeksów obu wymiarów i mnożyć `r * stride + c`, co utrudnia eliminację sprawdzeń zakresu.

Z tego powodu silniki gier 3D i biblioteki graficzne w C# często wybierają tablicę poszarpaną `T[][]` albo płaską tablicę `T[w * k]` z ręcznym indeksem `r * k + c`. Na małych planszach gier (`3x3`, `8x8`, `20x20`) _**tablica prostokątna `char[,]`**_ wygrywa jednak czytelnością i gwarancją identycznej szerokości każdego wiersza.

</div>
</details>

---

## 💻 Zadanie praktyczne: Detektor wygranej i przelicznik współrzędnych

W klasie `PlanszaHelper` zaimplementuj trzy metody statyczne operujące na tablicy `char[,]`:

1. **`PoliczWolnePola(char[,] p)`**:
   - przechodzi pętlą zagnieżdżoną po `p.GetLength(0)` oraz `p.GetLength(1)`,
   - zlicza i zwraca liczbę wszystkich komórek zawierających znak `'.'`,
   - musi działać poprawnie zarówno dla kwadratu `3x3`, jak i dla macierzy prostokątnej `2x4`.
2. **`CzyGraczWygral(char[,] p, char znak)`**:
   - sprawdza na planszy `3x3` wszystkie 3 wiersze i wszystkie 3 kolumny,
   - sprawdza przekątną główną oraz antyprzekątną,
   - zwraca `true`, jeśli choć jedna z 8 linii zawiera trzy znaki równe *znak*.
3. **`ZamienPoleNaWspolrzedne(int pole, int wiersze, int kolumny, out int r, out int c)`**:
   - dla niepoprawnych wymiarów (`wiersze <= 0` lub `kolumny <= 0`) albo numeru *pole* spoza przedziału `1..(wiersze * kolumny)` ustawia `r = -1; c = -1;` i zwraca `false`,
   - dla poprawnego *pole* wylicza *r* i *c* z użyciem parametru *kolumny* i zwraca `true`.

<data-gate>
<data-csharp-lab title="Zadanie: Tablica 2D char[,] - detektor 8 linii i przelicznik prostokatny" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class PlanszaHelper
{
    public static int PoliczWolnePola(char[,] p)
    {
        // Zlicz komorki rowne '.' petla zagniezdzona po GetLength(0) i GetLength(1)
        return 0;
    }

    public static bool CzyGraczWygral(char[,] p, char znak)
    {
        // Sprawdz 3 wiersze, 3 kolumny oraz 2 przekatne na planszy 3x3
        return false;
    }

    public static bool ZamienPoleNaWspolrzedne(int pole, int wiersze, int kolumny, out int r, out int c)
    {
        // Zwaliduj wymiary oraz zakres 1..(wiersze * kolumny), potem oblicz r i c
        r = -1;
        c = -1;
        return false;
    }

    static void Main()
    {
        char[,] p = {
            { 'X', 'O', '.' },
            { '.', 'X', 'O' },
            { '.', '.', 'X' }
        };
        Console.WriteLine("Wolne pola: " + PoliczWolnePola(p));
        Console.WriteLine("Wygral X: " + CzyGraczWygral(p, 'X'));
        Console.WriteLine("Wygral O: " + CzyGraczWygral(p, 'O'));

        int r, c;
        if (ZamienPoleNaWspolrzedne(5, 2, 4, out r, out c))
        {
            Console.WriteLine("Pole 5 na 2x4 -> [" + r + ", " + c + "]");
        }
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("PoliczWolnePola zlicza kropki na planszy czesciowej, pustej, pelnej i prostokatnej 2x4", () => {
    char[,] czesciowa = { { 'X', 'O', '.' }, { '.', 'X', 'O' }, { '.', '.', 'X' } };
    LabAssert.Equal(4, PlanszaHelper.PoliczWolnePola(czesciowa));

    char[,] pusta = { { '.', '.', '.' }, { '.', '.', '.' }, { '.', '.', '.' } };
    LabAssert.Equal(9, PlanszaHelper.PoliczWolnePola(pusta));

    char[,] pelna = { { 'X', 'O', 'X' }, { 'O', 'X', 'O' }, { 'O', 'X', 'O' } };
    LabAssert.Equal(0, PlanszaHelper.PoliczWolnePola(pelna));

    char[,] prostokat = { { '.', 'X', '.', 'O' }, { 'X', '.', 'X', '.' } };
    LabAssert.Equal(4, PlanszaHelper.PoliczWolnePola(prostokat));
});
LabAssert.Test("CzyGraczWygral wykrywa wszystkie wiersze, kolumny, obie przekatne oraz brak wygranej", () => {
    char[,] wiersz2 = { { 'O', '.', 'O' }, { '.', '.', '.' }, { 'X', 'X', 'X' } };
    LabAssert.True(PlanszaHelper.CzyGraczWygral(wiersz2, 'X'));
    LabAssert.False(PlanszaHelper.CzyGraczWygral(wiersz2, 'O'));

    char[,] kolumna1 = { { 'X', 'O', '.' }, { '.', 'O', 'X' }, { 'X', 'O', '.' } };
    LabAssert.True(PlanszaHelper.CzyGraczWygral(kolumna1, 'O'));
    LabAssert.False(PlanszaHelper.CzyGraczWygral(kolumna1, 'X'));

    char[,] przekatna = { { 'X', 'O', '.' }, { '.', 'X', 'O' }, { '.', '.', 'X' } };
    LabAssert.True(PlanszaHelper.CzyGraczWygral(przekatna, 'X'));
    LabAssert.False(PlanszaHelper.CzyGraczWygral(przekatna, 'O'));

    char[,] antyprzekatna = { { '.', '.', 'O' }, { 'X', 'O', '.' }, { 'O', 'X', '.' } };
    LabAssert.True(PlanszaHelper.CzyGraczWygral(antyprzekatna, 'O'));

    char[,] remis = { { 'X', 'O', 'X' }, { 'X', 'O', 'O' }, { 'O', 'X', 'X' } };
    LabAssert.False(PlanszaHelper.CzyGraczWygral(remis, 'X'));
    LabAssert.False(PlanszaHelper.CzyGraczWygral(remis, 'O'));
});
LabAssert.Test("ZamienPoleNaWspolrzedne dziala na planszy 3x3 oraz prostokatnej 2x4 i odrzuca bledy", () => {
    int r, c;
    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(1, 3, 3, out r, out c));
    LabAssert.Equal(0, r);
    LabAssert.Equal(0, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(5, 3, 3, out r, out c));
    LabAssert.Equal(1, r);
    LabAssert.Equal(1, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(7, 3, 3, out r, out c));
    LabAssert.Equal(2, r);
    LabAssert.Equal(0, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(9, 3, 3, out r, out c));
    LabAssert.Equal(2, r);
    LabAssert.Equal(2, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(1, 2, 4, out r, out c));
    LabAssert.Equal(0, r);
    LabAssert.Equal(0, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(4, 2, 4, out r, out c));
    LabAssert.Equal(0, r);
    LabAssert.Equal(3, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(5, 2, 4, out r, out c));
    LabAssert.Equal(1, r);
    LabAssert.Equal(0, c);

    LabAssert.True(PlanszaHelper.ZamienPoleNaWspolrzedne(8, 2, 4, out r, out c));
    LabAssert.Equal(1, r);
    LabAssert.Equal(3, c);

    LabAssert.False(PlanszaHelper.ZamienPoleNaWspolrzedne(0, 3, 3, out r, out c));
    LabAssert.Equal(-1, r);
    LabAssert.Equal(-1, c);

    LabAssert.False(PlanszaHelper.ZamienPoleNaWspolrzedne(10, 3, 3, out r, out c));
    LabAssert.Equal(-1, r);
    LabAssert.Equal(-1, c);

    LabAssert.False(PlanszaHelper.ZamienPoleNaWspolrzedne(9, 2, 4, out r, out c));
    LabAssert.Equal(-1, r);
    LabAssert.Equal(-1, c);

    LabAssert.False(PlanszaHelper.ZamienPoleNaWspolrzedne(-3, 2, 4, out r, out c));
    LabAssert.Equal(-1, r);
    LabAssert.Equal(-1, c);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Czym się różnią <code>GetLength(0)</code>, <code>GetLength(1)</code> i <code>Length</code>?</strong> W pętli zewnętrznej po wierszach zawsze używaj `GetLength(0)`, a w pętli wewnętrznej po kolumnach `GetLength(1)`. Właściwość `Length` zwraca iloczyn obu wymiarów i na macierzy prostokątnej nie nadaje się na limit pojedynczej pętli.
- <strong>W jakiej kolejności przechodzić tablicę 2D?</strong> Zawsze iteruj wierszami na zewnątrz i kolumnami wewnątrz. Taki przebieg zgadza się z układem Row-Major w pamięci RAM i minimalizuje kosztowne błędy pamięci podręcznej procesora.
- <strong>Jak przeliczać numer pola na indeksy i z powrotem?</strong> Dla planszy o szerokości *kolumny* używaj `(pole - 1) / kolumny` dla wiersza oraz `(pole - 1) % kolumny` dla kolumny, ale dopiero po sprawdzeniu zakresu `1..(wiersze * kolumny)`. W drugą stronę działa wzór `r * kolumny + c + 1`.
- <strong>Jak sprawdzać linie wygrywające bez kopiowania ośmiu długich bloków?</strong> Wiersze i kolumny załatwia jedna pętla `for (int i = 0; i < 3; i++)`, a przekątną główną (`r == c`) i antyprzekątną (`r + c == 2`) dopisujesz tuż pod nią.
