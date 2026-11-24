# Własne metody, parametry i zwracanie wyników

Gdy program ma 20 linijek, umieszczenie wszystkiego w `Main()` jeszcze nie przeszkadza. Gdy jednak budujesz grę z planszą i przeciwnikiem AI albo narzędzie do analizy plików, jeden blok na 300 wierszy szybko zamienia się w plątaninę. Poprawka w jednym miejscu zaczyna wtedy psuć trzy inne fragmenty kodu.

Spójrz na fragment kalkulatora ocen, w którym ten sam wzór na przycięcie wartości do przedziału `[0..100]` powtarza się wielokrotnie w `Main()`:

```csharp
// PRZED: powtarzalny kod wklejony w Main()
int pkt1 = 115;
if (pkt1 < 0) pkt1 = 0;
if (pkt1 > 100) pkt1 = 100;

int pkt2 = -12;
if (pkt2 < 0) pkt2 = 0;
if (pkt2 > 100) pkt2 = 100;
```

Jeśli jutro maksymalna liczba punktów zmieni się ze `100` na `120`, musisz szukać każdej kopii ręcznie. Wystarczy pominąć jedno miejsce i program zaczyna liczyć błędnie.

Rozwiązaniem jest **dekompozycja**: podział programu na małe, wyspecjalizowane **metody**. Każda metoda ma jedną jasną odpowiedzialność: przyjmuje dane wejściowe (**parametry**), wykonuje obliczenia i oddaje wynik instrukcją **`return`**:

```csharp
// PO: jedna czysta metoda i czytelne wywolania
public static int Przytnij(int wartosc, int min, int max)
{
    if (wartosc < min) return min;
    if (wartosc > max) return max;
    return wartosc;
}

static void Main()
{
    int pkt1 = Przytnij(115, 0, 100); // 100
    int pkt2 = Przytnij(-12, 0, 100); // 0
}
```

Słowo kluczowe **`public`** oznacza, że metodę może wywołać kod spoza tej klasy, na przykład automatyczne testy. Słowo **`static`** informuje kompilator, że metoda należy bezpośrednio do klasy, więc możesz ją wywołać bez tworzenia obiektu operatorem `new` (do obiektów przejdziesz w Module 2).

---

## 🧩 Anatomia metody i stos wywołań

Kiedy metoda `Main()` wywołuje metodę `ObliczSilnie()`, środowisko uruchomieniowe CLR odkłada na _**stosie wywołań**_ (Call Stack) nową **ramkę pamięci** (Stack Frame). Mieszkają w niej parametry, zmienne lokalne oraz adres powrotu.

Gdy metoda napotka `return`, jej ramka zostaje natychmiast zdjęta ze stosu. Procesor wraca wtedy dokładnie do kolejnej instrukcji w miejscu wywołania.

<data-csharp-callstack-viz></data-csharp-callstack-viz>

Spójrz na budowę metody zwracającej wynik liczbowy oraz metody typu `void`, która wykonuje wyłącznie akcję bez zwracania wartości:

```csharp
// Metoda ZWRACAJACA wynik (typ zwracany: long)
public static long ObliczSilnie(int n)
{
    long wynik = 1;
    for (int i = 2; i <= n; i++)
    {
        wynik *= i;
    }
    return wynik; // Zwraca wynik i natychmiast konczy metode
}

// Metoda typu void: wykonuje akcje, niczego nie zwraca
public static void WypiszNaglowek(string tytul)
{
    Console.WriteLine("=== " + tytul + " ===");
}
```

### 🔒 Zasięg zmiennych i przesłanianie między metodami

Zmienne lokalne z jednej metody nigdy nie są widoczne w innej, ponieważ leżą w osobnych ramkach pamięci. Ten obszar widoczności nazywamy **zasięgiem zmiennych** (scope).

Możesz bez żadnego konfliktu nazwać zmienną tak samo w `Main()` i w wywoływanej metodzie. Zmienna *wynik* w `ObliczSilnie()` nie ma nic wspólnego ze zmienną *wynik* w `Main()`:

```csharp
public static int PomnozPrzezDwa(int liczba)
{
    int wynik = liczba * 2; // Inna ramka na stosie!
    return wynik;
}

static void Main()
{
    int wynik = 999;
    int nowa = PomnozPrzezDwa(5);
    Console.WriteLine(wynik); // Nadal 999!
    Console.WriteLine(nowa);  // 10
}
```

Gdy `PomnozPrzezDwa()` kończy pracę, jej lokalna zmienna *wynik* znika ze stosu. Zmienna *wynik* w `Main()` pozostaje nietknięta.

### 🚦 Błąd CS0161 oraz return kontra break

Jeśli metoda deklaruje typ zwracany inny niż `void`, kompilator C# sprawdza każdą możliwą ścieżkę wykonania jeszcze przed uruchomieniem programu. Gdy choć jedna ścieżka może dotrzeć do zamykającej klamry `}` bez instrukcji `return`, kompilator odrzuca kod błędem **_CS0161_** („not all code paths return a value”).

> [!WARNING]
> **Pułapka brakującego `return` (**_CS0161_**):** poniższy kod nie skompiluje się, ponieważ kompilator nie ma gwarancji, co metoda ma zwrócić dla `x <= 0`:
> ```csharp
> public static int ZnakLiczby(int x)
> {
>     if (x > 0)
>     {
>         return 1;
>     }
>     // BLAD CS0161: brak return, gdy warunek if jest falszywy!
> }
> ```
> Zawsze domykaj metodę końcowym `return` lub pełnym `else`, aby każda ścieżka oddawała wartość.

Drugą częstą pomyłką jest mylenie `break` z `return` wewnątrz pętli:
- Instrukcja **`break`** przerywa wyłącznie najbliższą pętlę `for` lub `while`. Kod stojący poniżej pętli nadal się wykona.
- Instrukcja **`return`** natychmiast zdejmuje całą ramkę metody ze stosu i oddaje wynik do miejsca wywołania. Żadna instrukcja poniżej nie zostanie już uruchomiona.

Tę właściwość wykorzystuje wzorzec _**Guard Clause**_ (klauzula strażnicza). Zamiast owijać całą metodę w głębokie `if / else`, na samym początku odrzucasz niepoprawne przypadki przez szybkie `return`:

```csharp
public static double ObliczSrednia(double suma, int liczbaElementow)
{
    if (liczbaElementow <= 0) return 0.0; // Guard Clause: szybkie wyjscie

    return suma / liczbaElementow;
}
```

### 🔹 Dlaczego logika nie wywołuje konsoli

Zwróć uwagę na ważną decyzję projektową: `ObliczSilnie` nie wywołuje `Console.WriteLine`. Zwraca czystą liczbę typu `long`, a dopiero wywołujący decyduje, co z nią zrobić.

Taki podział daje trzy natychmiastowe korzyści:
- **Reużywalność**: tę samą metodę wykorzystasz dziś w konsoli, a w Module 5 podepniesz pod przycisk w oknie Windows Forms bez zmiany ani jednej linijki.
- **Testowalność**: możesz uruchomić automatyczne testy sprawdzające 100 przypadków w ułamku milisekundy, bez ręcznego wpisywania danych z klawiatury.
- **Komponowanie**: wynik jednej metody możesz od razu wykorzystać w większym wyrażeniu, na przykład `ObliczSilnie(n) / (ObliczSilnie(k) * ObliczSilnie(n - k))`.

---

## 🎛️ Przekazywanie parametrów przez wartość, ref i out

Domyślnie typy proste (`int`, `double`, `bool`, `char`) przekazywane są **przez wartość** (pass by value). Metoda otrzymuje wyłącznie **kopię** liczby w swojej własnej ramce stosu.

Jeśli wewnątrz metody zmienisz wartość parametru, oryginał w `Main()` pozostanie nietknięty. Aby metoda mogła zmodyfikować zmienną wywołującego, używasz słowa kluczowego **`ref`** zarówno w deklaracji, jak i przy wywołaniu:

```csharp
public static void ZwiekszKopie(int x)
{
    x = x + 10; // Modyfikuje tylko lokalna kopie na stosie
}

public static void ZwiekszOryginal(ref int x)
{
    x = x + 10; // Modyfikuje zmienna wywolujacego przez referencje
}

static void Main()
{
    int punkty = 50;
    ZwiekszKopie(punkty);        // punkty nadal == 50
    ZwiekszOryginal(ref punkty); // punkty == 60
}
```

Często metoda musi zwrócić **dwie informacje naraz**: czy operacja się powiodła (`bool`) oraz sam wynik obliczeń lub parsowania. Do tego w C# służy słowo kluczowe **`out`** oraz wzorzec nazewniczy `Try...` lub `Sprobuj...`:

```csharp
public static bool SprobujPodzielic(double dzielna, double dzielnik, out double wynik)
{
    if (dzielnik == 0.0)
    {
        wynik = 0.0; // Parametr out MUSI dostac wartosc przed return!
        return false;
    }
    wynik = dzielna / dzielnik;
    return true;
}

// Wywolanie w C# 5.0 (zmienna zadeklarowana przed wywolaniem):
double iloraz;
if (SprobujPodzielic(15.0, 4.0, out iloraz))
{
    Console.WriteLine("Wynik: " + iloraz); // 3.75
}
```

> [!IMPORTANT]
> **Dwie żelazne zasady `out` w C# 5.0:**
> 1. Zmienną przekazywaną przez `out` musisz zadeklarować **przed wywołaniem** metody (np. `int wynik; int.TryParse(tekst, out wynik);`).
> 2. Wewnątrz metody parametr `out` musi otrzymać wartość na każdej ścieżce przed `return`. Jeśli o tym zapomnisz, kompilator przerwie budowanie błędem **_CS0177_**.

Porównanie trzech sposobów przekazywania argumentów w C#:

| Sposób przekazania | Czy trzeba zainicjalizować zmienną przed wywołaniem? | Czy metoda musi przypisać wartość przed `return`? | Czy zmiana wewnątrz wpływa na oryginał? | Typowe zastosowanie |
| :--- | :---: | :---: | :---: | :--- |
| Zwykły parametr (`int x`) | Tak | Nie | Nie (kopia) | Standardowe dane wejściowe |
| Referencja (`ref int x`) | Tak | Nie | Tak | Modyfikacja istniejącej zmiennej (np. zamiana wartości) |
| Wyjściowy (`out int x`) | Nie | Tak (wymusza kompilator) | Tak | Wzorzec `TryParse` lub wynik obok statusu `bool` |

<data-gate>
<data-connection-matcher title="Dopasuj sygnaturę lub błąd kompilacji do mechanizmu przekazywania parametru">
  <item left="void Dodaj(int x) { x += 5; }" right="Przez wartość: zmienia wyłącznie lokalną kopię na stosie"></item>
  <item left="int a; Zmien(ref a);" right="Błąd kompilacji: parametr ref wymaga wcześniejszej inicjalizacji zmiennej"></item>
  <item left="bool Sprobuj(string s, out int n) { return false; }" right="Błąd CS0177: parametr out nie otrzymał wartości przed instrukcją return"></item>
  <item left="int wynik; int.TryParse(tekst, out wynik);" right="Poprawny wzorzec out w C# 5.0: zmienna nie wymaga wartości startowej"></item>
</data-connection-matcher>
</data-gate>

---

## 🔧 Przeciążanie metod i parametry domyślne

W C# dwie lub więcej metod mogą nosić **dokładnie tę samą nazwę**, o ile różnią się liczbą albo typami parametrów. Ten mechanizm nazywamy **przeciążaniem metod** (Method Overloading). Kompilator jeszcze przed uruchomieniem programu wybiera właściwą wersję na podstawie przekazanych argumentów.

```csharp
public static double ObliczPole(double bok)
{
    return bok * bok; // Kwadrat
}

public static double ObliczPole(double szerokosc, double wysokosc)
{
    return szerokosc * wysokosc; // Prostokat
}
```

Drugim narzędziem upraszczającym wywołania są **parametry domyślne**. Wartość domyślną wolno nadać wyłącznie parametrom stojącym na końcu listy:

```csharp
public static int Potega(int podstawa, int wykladnik = 2)
{
    int wynik = 1;
    for (int i = 0; i < wykladnik; i++)
    {
        wynik *= podstawa;
    }
    return wynik;
}

// Oba wywolania sa poprawne:
int kwadrat = Potega(5);    // 25 (wykladnik = 2)
int szescian = Potega(5, 3); // 125
```

> [!WARNING]
> **Dwie pułapki przeciążania, na których kompilator powie stop:**
> 1. Samym typem zwracanym **_nie można_** odróżnić przeciążeń. Dwie metody `int Oblicz(int x)` i `double Oblicz(int x)` mają identyczną listę parametrów, więc kompilator odrzuci kod.
> 2. Mieszanie przeciążeń z parametrami domyślnymi prowadzi do błędu niejednoznaczności **_CS0121_**. Jeśli masz jednocześnie `void Wypisz(int a)` oraz `void Wypisz(int a, int b = 0)`, wywołanie `Wypisz(5)` pasuje do obu i kompilator nie wie, którą wersję wybrać.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Windows x64 Fastcall (RCX, RDX, R8, R9), Shadow Space, ref/out w CIL oraz Guard Page stosu</span>
<span class="deep-dive-badge">ASEMBLER x86-64 · CIL · C/C++ · WINDOWS</span>
</summary>
<div class="deep-dive-content">

<h4>1. Konwencja wywołań Windows x64 Fastcall (ABI)</h4>

Na 64-bitowym systemie Windows środowisko JIT .NET (podobnie jak kompilatory C i C++ MSVC) przekazuje pierwsze cztery argumenty metody bezpośrednio w rejestrach procesora, zamiast zapisywać je w wolniejszej pamięci RAM:
- 1. argument całkowity lub referencja trafia do `RCX` (zmiennoprzecinkowy do `XMM0`),
- 2. argument trafia do `RDX` (`XMM1`),
- 3. argument trafia do `R8` (`XMM2`),
- 4. argument trafia do `R9` (`XMM3`),
- 5. i kolejne argumenty odkładane są na stos wskazywany przez rejestr `RSP`,
- wartość zwracana (`return`) wraca zawsze w rejestrze `RAX` (lub `XMM0` dla `float` i `double`).

Dodatkowo konwencja Windows x64 wymaga, aby wywołujący zarezerwował przed instrukcją `call` dokładnie **32 bajty Shadow Space** (Home Space) na stosie (`sub rsp, 20h`), nawet gdy metoda przyjmuje mniej niż 4 parametry. Wywoływana metoda może użyć tych 32 bajtów do zrzucenia rejestrów `RCX..R9` na stos w trybie debugowania.

<h4>2. Czym są ref i out w bajtkodzie CIL i asemblerze x86-64?</h4>

Na poziomie CLR oraz kodu maszynowego między `ref int x` a `out int x` nie ma żadnej różnicy w reprezentacji. Oba kompilują się do typu `int32&` (managed pointer: zarządzany wskaźnik śledzony przez Garbage Collector), co w C++ odpowiada referencji `int&` lub wskaźnikowi `int*`. Rozróżnienie `ref` i `out` istnieje wyłącznie w metadanych (`[Out]`) i jest pilnowane statycznie przez kompilator C#.

Spójrz na różnicę w asemblerze x86-64 dla `void Zwieksz(ref int x) { x += 10; }`:

```asm
; Wywolujacy laduje ADRES zmiennej lokalnej do RCX zamiast jej wartosci:
lea  rcx, [rsp + 28h]    ; RCX = &zmienna (Load Effective Address)
call Zwieksz             ; Skok do metody, odklada adres powrotu (8 B)

; Wnetrze metody Zwieksz(ref int x):
add  dword ptr [rcx], 10 ; Zapisuje +10 bezposrednio pod adresem z RCX!
ret                      ; Zdejmuje adres powrotu ze stosu do RIP
```

Gdyby parametr był przekazany przez wartość (`int x`), kompilator użyłby `mov ecx, [rsp + 28h]`. Dodawanie w metodzie zmieniłoby wtedy wyłącznie zawartość rejestru `ECX`, bez dotykania pamięci RAM wywołującego.

W bajtkodzie CIL oba wywołania wyglądają niemal identycznie:

```il
ldloca.s  V_0                         ; Laduje adres zmiennej (Load Local Address)
call      void Narzedzia::Zwieksz(int32&)
```

Instrukcja `ldloca.s` (z końcówką `a` od słowa address) jest tym samym dla `ref` i `out`. W C++ dokładnie tę samą pracę wykonuje operator `&` lub referencja `int&`.

<h4>3. Guard Page stosu 1 MB, StackOverflowException i rekurencja ogonowa</h4>

Każdy wątek procesu w Windows otrzymuje domyślnie sztywny stos o rozmiarze **1 MB** (zapisany w nagłówku pliku PE `.exe`). Stos rośnie w dół: od wyższych adresów ku niższym (`RSP` maleje przy każdym wywołaniu). Na samym dnie zarezerwowanego obszaru system operacyjny umieszcza specjalną stronę pamięci z flagą **`PAGE_GUARD`** (Guard Page, 4096 bajtów).

Jeśli napiszesz nieskończoną rekurencję, każda kolejna ramka zabiera kilkadziesiąt bajtów na adres powrotu, zapisane rejestry i zmienne lokalne. Po kilkunastu tysiącach wywołań `RSP` dotyka strony `Guard Page`. Jądro Windows zgłasza wtedy wyjątek sprzętowy **_STATUS_STACK_OVERFLOW_** (`0xC00000FD`), a CLR natychmiast kończy proces. Od .NET 2.0 wyjątku **_StackOverflowException_** nie da się złapać w bloku `try / catch`, ponieważ na stosie nie ma już miejsca nawet na uruchomienie kodu obsługującego błąd.

W językach funkcyjnych (F#, Haskell) oraz w kompilatorach C/C++ z flagą `-O2` istnieje optymalizacja **rekurencji ogonowej** (Tail Call Optimization). Jeśli wywołanie rekurencyjne jest absolutnie ostatnią operacją przed `return` (np. `return ObliczNwd(b, a % b);`), kompilator może zastąpić instrukcję `call` zwykłym skokiem `jmp`. Nadpisuje wtedy bieżącą ramkę stosu zamiast dokładać nową, więc nawet 10 000 000 wywołań zużywa dokładnie jedną ramkę pamięci.

</div>
</details>

---

## 💻 Zadanie praktyczne: Biblioteka metod w klasie Narzedzia

W klasie `Narzedzia` zaimplementuj cztery statyczne metody wielokrotnego użytku. Algorytm Euklidesa oraz test pierwszości z warunkiem `d <= n / d` znasz już z Modułu 0; tutaj zamykasz je w czystych, testowalnych metodach.

1. **`ObliczNwd(int a, int b)`**:
   - oblicza największy wspólny dzielnik algorytmem Euklidesa z resztą z dzielenia `%`,
   - obsługuje liczby ujemne poprzez `Math.Abs`,
   - dla `ObliczNwd(0, 0)` zwraca `0`, a dla `ObliczNwd(n, 0)` zwraca `Math.Abs(n)`.
2. **`CzyPierwsza(int n)`**:
   - dla `n < 2` zwraca `false`,
   - sprawdza dzielniki od `2` dopóki `d <= n / d`,
   - zwraca `true` wyłącznie dla liczb pierwszych.
3. **`SprobujSparsowacZakres(string tekst, int min, int max, out int liczba)`**:
   - deklaruje `int temp;` i wywołuje `int.TryParse(tekst, out temp)` zgodnie z C# 5.0,
   - jeśli parsowanie się powiedzie **oraz** `temp >= min && temp <= max`, przypisuje `liczba = temp;` i zwraca `true`,
   - w każdym innym przypadku (tekst nie jest liczbą, `null`, pusty napis, liczba poza przedziałem) ustawia `liczba = 0;` i zwraca `false`.
4. **`Zamien(ref int a, ref int b)`**:
   - zamienia wartości zmiennych *a* i *b* miejscami przy użyciu zmiennej pomocniczej,
   - działa poprawnie dla liczb dodatnich, ujemnych, zera oraz równych wartości.

<data-gate>
<data-csharp-lab title="Zadanie: Metody, return, ref i wzorzec Try z out" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class Narzedzia
{
    public static int ObliczNwd(int a, int b)
    {
        // Zaimplementuj algorytm Euklidesa (obsluz liczby ujemne i zera)
        return 0;
    }

    public static bool CzyPierwsza(int n)
    {
        // Zwroc true tylko dla liczb pierwszych (sprawdzaj dzielniki d <= n / d)
        return false;
    }

    public static bool SprobujSparsowacZakres(string tekst, int min, int max, out int liczba)
    {
        // Zadeklaruj temp przed int.TryParse(tekst, out temp) i sprawdz przedzial [min..max]
        liczba = 0;
        return false;
    }

    public static void Zamien(ref int a, ref int b)
    {
        // Zamien wartosci przekazanych zmiennych miejscami
    }

    static void Main()
    {
        Console.WriteLine("NWD(1920, 1080) = " + ObliczNwd(1920, 1080));
        Console.WriteLine("Czy 97 pierwsza: " + CzyPierwsza(97));

        int ruch;
        bool ok = SprobujSparsowacZakres("5", 1, 9, out ruch);
        Console.WriteLine("Ruch poprawny: " + ok + ", wartosc: " + ruch);

        int x = 10;
        int y = 25;
        Zamien(ref x, ref y);
        Console.WriteLine("Po zamianie: x=" + x + ", y=" + y);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ObliczNwd dziala dla liczb dodatnich, ujemnych, zera i liczb wzglednie pierwszych", () => {
    LabAssert.Equal(120, Narzedzia.ObliczNwd(1920, 1080));
    LabAssert.Equal(6, Narzedzia.ObliczNwd(-18, 24));
    LabAssert.Equal(6, Narzedzia.ObliczNwd(-18, -24));
    LabAssert.Equal(7, Narzedzia.ObliczNwd(7, 0));
    LabAssert.Equal(7, Narzedzia.ObliczNwd(0, -7));
    LabAssert.Equal(0, Narzedzia.ObliczNwd(0, 0));
    LabAssert.Equal(1, Narzedzia.ObliczNwd(17, 31));
});
LabAssert.Test("CzyPierwsza poprawnie klasyfikuje liczby brzegowe, pierwsze i kwadraty liczb pierwszych", () => {
    LabAssert.False(Narzedzia.CzyPierwsza(-11));
    LabAssert.False(Narzedzia.CzyPierwsza(0));
    LabAssert.False(Narzedzia.CzyPierwsza(1));
    LabAssert.True(Narzedzia.CzyPierwsza(2));
    LabAssert.True(Narzedzia.CzyPierwsza(3));
    LabAssert.False(Narzedzia.CzyPierwsza(4));
    LabAssert.False(Narzedzia.CzyPierwsza(49));
    LabAssert.True(Narzedzia.CzyPierwsza(97));
    LabAssert.False(Narzedzia.CzyPierwsza(121));
    LabAssert.True(Narzedzia.CzyPierwsza(7919));
});
LabAssert.Test("SprobujSparsowacZakres waliduje granice przedzialu, null i bledne teksty", () => {
    int val = 999;
    LabAssert.True(Narzedzia.SprobujSparsowacZakres("1", 1, 9, out val));
    LabAssert.Equal(1, val);
    LabAssert.True(Narzedzia.SprobujSparsowacZakres("9", 1, 9, out val));
    LabAssert.Equal(9, val);
    LabAssert.True(Narzedzia.SprobujSparsowacZakres("-5", -10, 0, out val));
    LabAssert.Equal(-5, val);
    LabAssert.False(Narzedzia.SprobujSparsowacZakres("0", 1, 9, out val));
    LabAssert.Equal(0, val);
    LabAssert.False(Narzedzia.SprobujSparsowacZakres("10", 1, 9, out val));
    LabAssert.Equal(0, val);
    LabAssert.False(Narzedzia.SprobujSparsowacZakres("abc", 1, 9, out val));
    LabAssert.Equal(0, val);
    LabAssert.False(Narzedzia.SprobujSparsowacZakres("", 1, 9, out val));
    LabAssert.Equal(0, val);
    LabAssert.False(Narzedzia.SprobujSparsowacZakres(null, 1, 9, out val));
    LabAssert.Equal(0, val);
});
LabAssert.Test("Zamien zamienia wartosci zmiennych przez ref dla dodatnich, ujemnych, zera i rownych", () => {
    int a = 10;
    int b = 25;
    Narzedzia.Zamien(ref a, ref b);
    LabAssert.Equal(25, a);
    LabAssert.Equal(10, b);

    int u1 = -7;
    int u2 = 0;
    Narzedzia.Zamien(ref u1, ref u2);
    LabAssert.Equal(0, u1);
    LabAssert.Equal(-7, u2);

    int r1 = 42;
    int r2 = 42;
    Narzedzia.Zamien(ref r1, ref r2);
    LabAssert.Equal(42, r1);
    LabAssert.Equal(42, r2);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy wydzielić kod do osobnej metody?</strong> Gdy fragment obliczeń się powtarza, ma jedną jasną odpowiedzialność lub chcesz go przetestować bez `Console.WriteLine`.
- <strong>Kiedy użyć zwykłego parametru, kiedy <code>ref</code>, a kiedy <code>out</code>?</strong> Domyślnie przekazuj przez wartość (kopia). Użyj `ref`, gdy metoda ma zmodyfikować już zainicjalizowaną zmienną wywołującego. Użyj `out`, gdy metoda zwraca status `bool` i dodatkowy wynik (w C# 5.0 deklaruj zmienną przed wywołaniem).
- <strong>Czym różni się <code>return</code> od <code>break</code> i przed czym chroni CS0161?</strong> `break` kończy tylko pętlę, a `return` natychmiast zamyka całą metodę (wzorzec Guard Clause). Kompilator pilnuje błędem **_CS0161_**, aby każda ścieżka w metodzie zwracającej wartość kończyła się instrukcją `return`.
- <strong>Kiedy przeciążanie metod zadziała, a kiedy zgłosi błąd?</strong> Przeciążaj wyłącznie liczbą lub typami parametrów, nigdy samym typem zwracanym. Unikaj łączenia przeciążeń z parametrami domyślnymi o tej samej liczbie argumentów, aby nie wywołać błędu niejednoznaczności **_CS0121_**.
