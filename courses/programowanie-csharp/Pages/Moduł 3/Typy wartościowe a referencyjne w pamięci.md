# Typy wartościowe a referencyjne w pamięci

Piszesz symulator walki w grze i przed trudnym starciem chcesz zapisać zapasowy stan bohatera. Tworzysz zmienną `Postac kopia = bohater;`, a potem uruchamiasz symulację na *kopia*. W trakcie walki *kopia* traci `80` punktów życia i zużywa jedyną apteczkę z ekwipunku. Gdy po teście zaglądasz do oryginalnego obiektu *bohater*, okazuje się, że on także ma `20` HP i pusty plecak.

Z liczbami `int` albo `double` ten sam zapis `int b = a;` tworzy dwie całkowicie niezależne wartości. Dlaczego dla klasy `Postac` identyczny znak `=` połączył obie zmienne niewidzialnym sznurkiem? Odpowiedź leży w sposobie, w jaki środowisko .NET rozdziela dane między **Stos** (Stack) a **Stertę** (Managed Heap).

---

## 🧠 Stos kontra Sterta i zjawisko aliasingu

W C# instrukcja przypisania `b = a;` robi dwie zupełnie różne rzeczy zależnie od kategorii typu. Typy dzielimy na **wartościowe** (`struct`, `int`, `double`, `bool`, `char`) oraz **referencyjne** (`class`, `string`, `List<T>`, tablice `T[]`).

<data-csharp-heap-viz></data-csharp-heap-viz>

Zwróć uwagę na fundamentalną różnicę widoczną w pamięci RAM:

- **Typ wartościowy**: zmienna na stosie przechowuje **bezpośrednio same bity wartości**. Instrukcja `b = a;` kopiuje wszystkie pola do nowego miejsca na stosie, więc zmiana *b* nigdy nie dotyka *a*.
- **Typ referencyjny**: zmienna na stosie trzyma wyłącznie **8-bajtowy adres** obiektu leżącego na stercie. Instrukcja `b = a;` kopiuje **tylko ten adres**. Obie zmienne wskazują odtąd ten sam obszar pamięci, co nazywamy **aliasingiem**.

### 🔹 Kiedy wybrać struct a kiedy class

| Cecha | `struct` (Typ wartościowy) | `class` (Typ referencyjny) |
| --- | --- | --- |
| Miejsce w pamięci | Stos (lub bezpośrednio wewnątrz innego obiektu albo tablicy) | Sterta (Managed Heap), sprzątana przez Garbage Collector |
| Przypisanie `b = a` | Kopiuje wszystkie pola (dwie niezależne wartości) | Kopiuje tylko 8-bajtowy adres (aliasing) |
| Wartość `null` | Niedozwolona (chyba że użyjesz `Nullable<T>`, np. `int?`) | Dozwolona (domyślna wartość pustej referencji) |
| Dziedziczenie | Nie może dziedziczyć po innej klasie ani strukturze | Pełne dziedziczenie i polimorfizm |
| Dobre zastosowanie | Małe, niezmienne wartości do 16 B (`Punkt2D`, `KolorRgb`, `Wektor2`) | Encje z tożsamością i zmiennym stanem (`Postac`, `ProcesInfo`) |

> [!TIP]
> Projektuj własne struktury `struct` jako **niemutowalne** (z polami `readonly`). Mutowalna struktura bywa źródłem podstępnych błędów: gdy pobierzesz ją z listy lub właściwości, dostajesz ukrytą kopię, więc jej modyfikacja znika bez śladu zamiast zmienić oryginał.

---

## 🧵 Pułapka typu string i przekazywanie argumentów do metod

Skoro `string` jest **typem referencyjnym** leżącym na stercie, dlaczego poniższy kod nie psuje zmiennej *a*?

```csharp
string a = "ABC";
string b = a;     // obie zmienne wskazują ten sam napis "ABC" na stercie
b = "XYZ";        // NIE zmienia starego napisu! Tworzy nowy napis "XYZ" i przestawia adres w b
Console.WriteLine(a); // wypisze "ABC"
```

Napisy `string` w C# są **niemutowalne**: raz zapisanych znaków w pamięci nie da się nadpisać. Każda operacja przypisania lub łączenia napisów alokuje na stercie nowy obiekt `string` i zmienia wyłącznie adres przechowywany w zmiennej po lewej stronie. Dlatego `string` leży na stercie jak klasa, ale w codziennym użyciu zachowuje się bezpiecznie jak typ wartościowy.

### 🔹 Trzy przypadki przekazywania argumentów do metod

Domyślnie każdy argument w C# jest przekazywany **przez wartość** (czyli metoda dostaje kopię zawartości zmiennej ze stosu). W przypadku klasy tą zawartością ze stosu jest 8-bajtowy adres, co daje trzy różne scenariusze:

```csharp
static void ZmienStruct(Punkt2D p)
{
    // p to kopia struktury: zmiana lokalnej zmiennej nie wpływa na oryginał
    p = new Punkt2D(99, 99);
}

static void MutujKlase(Konto k)
{
    // k to kopia adresu: wskazuje TEN SAM obiekt Konto na stercie
    k.Wplac(50); // oryginał widzi zmianę salda!
}

static void PodmienReferencje(Konto k)
{
    // zmieniasz tylko lokalną kopię adresu k; zmienna wywołującego nadal wskazuje stary obiekt!
    k = new Konto(999, 0);
}

static void PodmienPrzezRef(ref Konto k)
{
    // słowo ref przekazuje dostęp do samej zmiennej wywołującego
    k = new Konto(999, 0); // oryginał zaczyna wskazywać nowy obiekt
}
```

Zapamiętaj prostą regułę: metoda bez słowa kluczowego **`ref`** może **zmienić wnętrze** przekazanego obiektu klasy, ale nie potrafi **podmienić samej zmiennej** wywołującego na inny obiekt. Słowo **`ref`** (wpisane zarówno przy parametrze metody, jak i przy jej wywołaniu) daje metodzie bezpośredni dostęp do zmiennej na stosie wywołującego.

### 🔹 Równość referencyjna operatora ==

Utwórz dwa osobne obiekty klasy `Konto` z dokładnie tym samym numerem i saldem:

```csharp
Konto k1 = new Konto(1, 500);
Konto k2 = new Konto(1, 500);
Console.WriteLine(k1 == k2); // False!
```

Wynik to `False`, mimo że wszystkie pola są identyczne. Domyślny operator **`==`** dla klas nie zagląda do środka obiektów, lecz porównuje ich **adresy w pamięci RAM**. Dwa wywołania `new` utworzyły dwa osobne miejsca na stercie, więc ich adresy są różne. Wyjątkiem jest klasa `string`, dla której twórcy C# specjalnie przeciążyli operator `==`, aby porównywał kolejne znaki.

---

## 🛡️ Kopia płytka, kopia głęboka oraz bezpieczna praca z null

Gdy potrzebujesz niezależnego klonu obiektu klasy, samo przypisanie `var kopia = oryginal;` tworzy wyłącznie alias. Musisz wywołać `new` i skopiować pola ręcznie. Jeśli jednak klasa przechowuje wewnątrz inną referencję (na przykład `List<string>`), łatwo wpaść w pułapkę **kopii płytkiej** (shallow copy):

```csharp
public class KoszykZakupow
{
    private List<string> _produkty;

    public KoszykZakupow(List<string> produkty)
    {
        _produkty = produkty;
    }

    // BŁĄD (kopia płytka): nowy koszyk dostaje ten sam adres listy _produkty!
    public KoszykZakupow KopiaPlytka()
    {
        return new KoszykZakupow(_produkty);
    }

    // POPRAWNIE (kopia głęboka): tworzy osobną listę na stercie z kopią elementów
    public KoszykZakupow KopiaGleboka()
    {
        return new KoszykZakupow(new List<string>(_produkty));
    }
}
```

Po wywołaniu `KopiaPlytka()` istnieją dwa obiekty `KoszykZakupow`, ale oba wskazują tę samą listę `_produkty` na stercie. Dodanie elementu do kopii natychmiast zmienia oryginał. Dopiero **kopia głęboka** (deep copy), która tworzy nową listę przez `new List<string>(_produkty)`, w pełni rozdziela oba obiekty.

### 🔹 NullReferenceException, operator ?? i typy Nullable

Próba odczytu właściwości albo wywołania metody na referencji równej `null` kończy się wyjątkiem **_NullReferenceException_**. Procesor dostaje wtedy pusty adres `0x0000000000000000`, spod którego nie wolno czytać danych.

> [!WARNING]
> Przed użyciem referencji pochodzącej z zewnątrz zawsze sprawdź `obiekt != null`. Do podstawiania wartości domyślnej używaj operatora **`??`** (działa w każdym C#, w tym w C# 5.0):

```csharp
string host = konfiguracja != null ? konfiguracja.AdresHosta : null;
string docelowyHost = host ?? "127.0.0.1";
```

Zwykły typ wartościowy `int` nie może przyjąć wartości `null`, ponieważ na stosie zawsze musi leżeć jakaś liczba (domyślnie `0`). Czasem jednak potrzebujesz odróżnić „wynik wynosi 0 punktów” od „gracz jeszcze nie zagrał”. Wtedy używasz typu **`int?`** (skrót od _**Nullable&lt;int&gt;**_):

```csharp
int? najlepszyWynik = null;

if (najlepszyWynik.HasValue)
    Console.WriteLine(najlepszyWynik.Value);

int bezpieczny = najlepszyWynik.GetValueOrDefault(); // zwraca 0, gdy brak wartości
int domyslny = najlepszyWynik ?? -1;                 // zwraca -1, gdy brak wartości
```

Właściwość `HasValue` informuje, czy zmienna przechowuje liczbę, a metoda `GetValueOrDefault()` albo operator `??` pozwalają bezpiecznie odczytać wynik bez ryzyka wyjątku.

<data-gate>
<data-connection-matcher title="Dopasuj operację w C# do jej skutku w pamięci RAM">
    <item left="MutujKlase(postac) zmieniające Hp wewnątrz metody" right="Modyfikuje oryginalny obiekt na stercie przez skopiowany adres"></item>
    <item left="PodmienReferencje(postac) z przypisaniem postac = new Postac(...)" right="Zmienia wyłącznie lokalną kopię adresu bez wpływu na zmienną wywołującego"></item>
    <item left="new Postac(&quot;Neo&quot;, 100) == new Postac(&quot;Neo&quot;, 100)" right="Zwraca false, ponieważ porównuje dwa różne adresy obiektów na stercie"></item>
    <item left="Kopia płytka klasy zawierającej List&lt;string&gt;" right="Tworzy drugi obiekt, ale oba współdzielą adres tej samej listy na stercie"></item>
    <item left="Wywołanie metody na referencji o wartości null" right="Rzuca wyjątek NullReferenceException z powodu pustego adresu pamięci"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Boxing w CIL, Generational Garbage Collector i porównanie z C malloc/free</span>
<span class="deep-dive-badge">CIL · GARBAGE COLLECTOR · C/C++</span>
</summary>
<div class="deep-dive-content">

<h4>1. Boxing i Unboxing w bajtkodzie CIL</h4>

Typy wartościowe (`int`, `struct`) nie mają w pamięci 16-bajtowego nagłówka obiektu CLR. Kiedy jednak przekażesz `int` w miejsce oczekujące referencji `object` (na przykład do przestarzałej kolekcji `ArrayList` albo do `string.Format("{0}", liczba)`), środowisko wykonawcze musi wykonać **Boxing**. Polega to na zaalokowaniu nowego 24-bajtowego obiektu na stercie (8 B `Object Header`, 8 B `MethodTable*` typu `System.Int32`, 4 B wartości i 4 B paddingu) oraz skopiowaniu tam liczby.

Spójrz na kod pośredni CIL generowany dla trzech linijek C# (`int x = 42; object o = x; int y = (int)o;`):

```cil
ldc.i4.s   42                        // wrzuc 42 na stos obliczeniowy
stloc.0                              // zapisz do lokalnej zmiennej x (stos)
ldloc.0                              // pobierz x
box        [mscorlib]System.Int32    // ALOKACJA 24 B NA STERCIE + kopia bitow!
stloc.1                              // zapisz 8-bajtowy adres do o
ldloc.1                              // pobierz adres ze sterty
unbox.any  [mscorlib]System.Int32    // sprawdz typ w MethodTable i skopiuj 4 B na stos
stloc.2                              // zapisz do y
```

Jeśli w pętli gry działającej w 60 klatkach na sekundę wykonasz 5 000 nieświadomych operacji boxingu w każdej klatce, powstanie **300 000 zbędnych obiektów na sekundę** (ponad 7,2 MB/s alokacji). Wywołuje to częste sprzątanie pamięci i widoczne przycięcia animacji (GC Stutter). Kolekcje generyczne `List<int>` generują specjalizowany kod maszynowy bez żadnego boxingu.

<h4>2. Generational Garbage Collector (Gen 0, Gen 1, Gen 2) i kompaktowanie sterty</h4>

Alokacja obiektu `new` na stercie CLR jest błyskawiczna, ponieważ sterta jest utrzymywana jako ciągły blok pamięci. Środowisko wykonawcze jedynie przesuwa wskaźnik wolnego miejsca (bump-the-pointer) o rozmiar nowego obiektu.

Jest to możliwe dzięki **kompaktowaniu sterty** (Compacting GC). Podczas sprzątania Garbage Collector usuwa martwe obiekty, zsuwa żywe obiekty obok siebie (likwidując fragmentację RAM) i automatycznie aktualizuje wszystkie 8-bajtowe referencje w rejestrach CPU oraz na stosach wątków.

Aby nie skanować całych gigabajtów pamięci przy każdym sprzątaniu, CLR dzieli stertę na trzy pokolenia oparte na obserwacji, że większość obiektów żyje bardzo krótko:

- **Gen 0** (zwykle kilka MB): wszystkie nowo utworzone małe obiekty. Sprzątanie trwa ułamek milisekundy i usuwa ponad 90% obiektów.
- **Gen 1**: strefa buforowa dla obiektów, które przeżyły jedno sprzątanie Gen 0.
- **Gen 2**: obiekty długowieczne (cache, główne okna aplikacji, statyczne kolekcje). Pełne sprzątanie Gen 2 (Full GC) zatrzymuje wątki aplikacji (Stop-The-World) na znacznie dłużej.

<h4>3. Porównanie z ręcznym zarządzaniem pamięcią w C i C++</h4>

W języku C programista sam rezerwuje pamięć funkcją `malloc()` i sam musi ją oddać funkcją `free()`. Zapomnienie `free()` powoduje **_wyciek pamięci_** (Memory Leak), a odczyt spod adresu po jego zwolnieniu tworzy krytyczną podatność bezpieczeństwa **_Use-After-Free (UAF)_**:

```c
int* ptr = (int*)malloc(sizeof(int));
*ptr = 100;
free(ptr);       // pamiec wraca do alokatora, ale ptr nadal trzyma stary adres!
*ptr = 999;      // USE-AFTER-FREE: nadpisujesz losowe dane innego obiektu lub crashujesz proces!
```

W C# referencja pozostaje ważna dopóki istnieje w zasięgu programu. Garbage Collector zwolni obiekt dopiero wtedy, gdy żaden korzeń (GC Root) na stosie ani w polach statycznych na niego nie wskazuje. Cała klasa błędów **_Use-After-Free (UAF)_** zostaje wyeliminowana kosztem narzutu Garbage Collectora.

</div>
</details>

---

## 💻 Zadanie praktyczne w 2 plikach dla Punkt2D i Postac

Przełącz zakładkę na **`Modele.cs`** i zaimplementuj dwa typy demonstrujące różnicę między niemutowalną strukturą wartościową a głębokim klonowaniem klasy:

1. **`public struct Punkt2D`** (niemutowalna struktura):
   - pola tylko do odczytu `public readonly int X;` oraz `public readonly int Y;`,
   - konstruktor `Punkt2D(int x, int y)` ustawiający oba pola,
   - metoda `Przesun(int dx, int dy)` zwracająca **nowy** `Punkt2D(X + dx, Y + dy)` bez modyfikowania oryginalnej struktury,
   - metoda `double OdlegloscOd(Punkt2D inny)` obliczająca odległość euklidesową między punktami (wykonaj różnice i kwadraty na typie `double`, aby uniknąć przepełnienia `int` dla współrzędnych rzędu `60000`).
2. **`public class Postac`**:
   - właściwości `public string Imie { get; private set; }`, `public int Hp { get; private set; }` oraz wyliczana `public int LiczbaPrzedmiotow { get { return _ekwipunek.Count; } }`,
   - prywatne pole referencyjne `private List<string> _ekwipunek;`,
   - konstruktor `Postac(string imie, int hp)` z walidacją: dla `string.IsNullOrWhiteSpace(imie)` rzuć **_ArgumentException_**, a dla `hp < 0` rzuć **_ArgumentOutOfRangeException_**; przypisz `Imie = imie.Trim()`, `Hp = hp` i utwórz pustą listę `_ekwipunek = new List<string>()`,
   - metoda `DodajPrzedmiot(string nazwa)`: dla `string.IsNullOrWhiteSpace(nazwa)` rzuć **_ArgumentException_**, w przeciwnym razie dodaj `nazwa.Trim()` do `_ekwipunek`,
   - metoda `MaPrzedmiot(string nazwa)` zwracająca `_ekwipunek.Contains(nazwa)`,
   - metoda `OtrzymajObrazenia(int ile)`: dla `ile < 0` rzuć **_ArgumentOutOfRangeException_**, inaczej zmniejsz `Hp`, ale nie poniżej `0`,
   - metoda **`public Postac Klonuj()`**, zwracająca **nowy, niezależny obiekt** `Postac` z **głęboką kopią** ekwipunku (dodanie przedmiotu do klona nie może zmienić ekwipunku oryginału).

<data-gate>
<data-csharp-lab title="Zadanie: niemutowalny struct Punkt2D vs class Postac z głębokim Klonuj">
<cs-file name="Program.cs">

```csharp
using System;
using System.Globalization;

class Program
{
    static void Main()
    {
        var p1 = new Punkt2D(0, 0);
        var p2 = p1.Przesun(3, 4);
        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "p1=({0},{1}), p2=({2},{3}), dystans={4:F2}",
            p1.X, p1.Y, p2.X, p2.Y, p1.OdlegloscOd(p2)));

        var hero = new Postac("Neo", 100);
        hero.DodajPrzedmiot("Klucz");
        var klon = hero.Klonuj();
        klon.OtrzymajObrazenia(60);
        klon.DodajPrzedmiot("Tarcza");

        Console.WriteLine("hero: Hp=" + hero.Hp + ", przedmioty=" + hero.LiczbaPrzedmiotow);
        Console.WriteLine("klon: Hp=" + klon.Hp + ", przedmioty=" + klon.LiczbaPrzedmiotow);
    }
}
```

</cs-file>
<cs-file name="Modele.cs">

```csharp
using System;
using System.Collections.Generic;

public struct Punkt2D
{
    public readonly int X;
    public readonly int Y;

    public Punkt2D(int x, int y)
    {
        X = x;
        Y = y;
    }

    public Punkt2D Przesun(int dx, int dy)
    {
        // Zwroc nowy Punkt2D przesuniety o (dx, dy) bez modyfikowania oryginalu
        return new Punkt2D(0, 0);
    }

    public double OdlegloscOd(Punkt2D inny)
    {
        // Oblicz odleglosc euklidesowa na typie double (uwaga na przepelnienie int!)
        return 0.0;
    }
}

public class Postac
{
    private List<string> _ekwipunek;

    public string Imie { get; private set; }
    public int Hp { get; private set; }
    public int LiczbaPrzedmiotow { get { return _ekwipunek.Count; } }

    public Postac(string imie, int hp)
    {
        // Zwaliduj imie (ArgumentException) oraz hp < 0 (ArgumentOutOfRangeException)
        // Przypisz imie.Trim(), hp i zainicjalizuj _ekwipunek
        Imie = imie;
        Hp = hp;
        _ekwipunek = new List<string>();
    }

    public void DodajPrzedmiot(string nazwa)
    {
        // Zwaliduj nazwe (ArgumentException) i dodaj nazwa.Trim() do _ekwipunek
    }

    public bool MaPrzedmiot(string nazwa)
    {
        return _ekwipunek.Contains(nazwa);
    }

    public void OtrzymajObrazenia(int ile)
    {
        // Zwaliduj ile < 0 (ArgumentOutOfRangeException) i obniz Hp maksymalnie do 0
    }

    public Postac Klonuj()
    {
        // Zwroc niezalezna, GLEBOKA kopie obiektu Postac wraz z nowa lista ekwipunku!
        return this;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("Niemutowalny struct Punkt2D zachowuje semantykę wartości i nie modyfikuje oryginału w Przesun", () => {
    var a = new Punkt2D(5, 10);
    var b = a;
    LabAssert.Equal(5, b.X);
    LabAssert.Equal(10, b.Y);

    var c = a.Przesun(3, -4);
    LabAssert.Equal(5, a.X);
    LabAssert.Equal(10, a.Y);
    LabAssert.Equal(8, c.X);
    LabAssert.Equal(6, c.Y);
});
LabAssert.Test("Punkt2D.OdlegloscOd poprawnie wylicza dystans również dla dużych współrzędnych bez przepełnienia int", () => {
    var p0 = new Punkt2D(0, 0);
    var p1 = new Punkt2D(3, 4);
    LabAssert.Equal(5.0, Math.Round(p0.OdlegloscOd(p1), 4));
    LabAssert.Equal(0.0, p1.OdlegloscOd(p1));

    var ujemny = new Punkt2D(-3, -4);
    LabAssert.Equal(10.0, Math.Round(p1.OdlegloscOd(ujemny), 4));

    var daleki = new Punkt2D(60000, 80000);
    LabAssert.Equal(100000.0, Math.Round(p0.OdlegloscOd(daleki), 4));
});
LabAssert.Test("Postac.Klonuj tworzy głęboką kopię (niezależne Hp i niezależna lista Ekwipunek)", () => {
    var orig = new Postac("  Trinity  ", 100);
    orig.DodajPrzedmiot("Klucz");
    orig.DodajPrzedmiot("Kompas");

    var kopia = orig.Klonuj();
    LabAssert.False(orig == kopia);
    kopia.OtrzymajObrazenia(75);
    kopia.DodajPrzedmiot("Tarcza");

    LabAssert.Equal("Trinity", orig.Imie);
    LabAssert.Equal("Trinity", kopia.Imie);
    LabAssert.Equal(100, orig.Hp);
    LabAssert.Equal(25, kopia.Hp);

    LabAssert.Equal(2, orig.LiczbaPrzedmiotow);
    LabAssert.Equal(3, kopia.LiczbaPrzedmiotow);
    LabAssert.True(kopia.MaPrzedmiot("Klucz"));
    LabAssert.True(kopia.MaPrzedmiot("Tarcza"));
    LabAssert.False(orig.MaPrzedmiot("Tarcza"));

    kopia.OtrzymajObrazenia(200);
    LabAssert.Equal(0, kopia.Hp);
});
LabAssert.Test("Postac waliduje null, puste imię, ujemne Hp, ujemne obrażenia i pusty przedmiot", () => {
    LabAssert.Throws<ArgumentException>(() => new Postac(null, 50));
    LabAssert.Throws<ArgumentException>(() => new Postac("  ", 50));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new Postac("Morpheus", -10));
    var p = new Postac("Morpheus", 80);
    LabAssert.Throws<ArgumentOutOfRangeException>(() => p.OtrzymajObrazenia(-5));
    LabAssert.Throws<ArgumentException>(() => p.DodajPrzedmiot("   "));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy przypisanie b = a tworzy kopię, a kiedy alias?</strong> Dla `int` i `struct` kopiowane są same dane na stosie; dla `class`, `List<T>` i tablic kopiowany jest tylko 8-bajtowy adres na stercie.
- <strong>Dlaczego string zachowuje się bezpiecznie mimo bycia typem referencyjnym?</strong> Ponieważ napisy są niemutowalne: zmiana zmiennej tworzy nowy obiekt pod nowym adresem zamiast nadpisywać stary.
- <strong>Kiedy metoda potrzebuje słowa kluczowego ref?</strong> Wtedy, gdy ma podmienić samą zmienną wywołującego na inny obiekt albo zmodyfikować przekazaną strukturę wartościową.
- <strong>Jak bezpiecznie sklonować klasę zawierającą listę lub tablicę?</strong> Utwórz nowy obiekt i przekaż mu nową kolekcję z kopią elementów (kopia głęboka), aby oryginał i klon nie współdzieliły tej samej listy na stercie.
- <strong>Jak chronić kod przed NullReferenceException i brakiem wartości w typach prostych?</strong> Sprawdzaj `!= null` przed dostępem do obiektu, stosuj operator `??` dla wartości domyślnych oraz `int?` z `HasValue` i `GetValueOrDefault()` dla opcjonalnych liczb.
