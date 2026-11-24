# Wyrażenia lambda i potoki LINQ

Masz listę 500 pomiarów sieciowych z serwerów i musisz wyciągnąć trzy najwolniejsze udane odpowiedzi powyżej 50 ms. Zapisanie tego w klasycznej pętli `foreach` wymaga utworzenia listy pomocniczej, ręcznego filtrowania, napisania komparatora do sortowania oraz osobnej pętli wycinającej trzy pierwsze wyniki. Każda zmiana kryterium zmusza do przebudowy kilkudziesięciu linii kodu.

W C# te same operacje opisujesz deklaratywnie w kilku czytelnych wierszach. Łączysz w tym celu **wyrażenia lambda** (`=>`) oraz bibliotekę **LINQ** z przestrzeni `System.Linq`.

---

## 🧩 Delegaty Func, Action oraz pełna składnia lambd

**Wyrażenie lambda** to anonimowa funkcja, którą przekazujesz jako argument do innej metody, dokładnie tak jak liczbę albo napis. Zapis `p => p.CzasMs > 50` oznacza: „weź parametr *p* i zwróć wynik porównania `p.CzasMs > 50`”.

Aby kompilator wiedział, jaką funkcję może przyjąć metoda, C# dostarcza dwa wbudowane generyczne **typy delegatów**:

- **`Func<T, TResult>`**: opisuje funkcję, która przyjmuje argumenty i **zawsze zwraca wynik**. Ostatni parametr typu w nawiasach ostrych to zawsze typ zwracany. Przykładowo `Func<int, bool>` przyjmuje `int` i zwraca `bool`, a `Func<int, int, double>` przyjmuje dwa `int` i zwraca `double`.
- **`Action<T>`**: opisuje akcję, która przyjmuje argumenty, ale **nic nie zwraca** (`void`), na przykład `Action<string>` do wypisania komunikatu w konsoli.

Spójrz, jak możesz przekazać warunek jako `Func<T, bool>` do własnej metody generycznej:

```csharp
public static int PoliczPasujace<T>(IEnumerable<T> dane, Func<T, bool> warunek)
{
    int licznik = 0;
    foreach (T element in dane)
    {
        if (warunek(element))
            licznik++;
    }
    return licznik;
}

// Wywolanie z wyrazeniem lambda:
int duze = PoliczPasujace(new[] { 10, 80, 120 }, x => x > 50); // wynik: 2
```

W zależności od liczby parametrów i złożoności logiki, wyrażenie lambda przyjmuje cztery formy składniowe:

| Forma lambdy | Składnia | Kiedy stosować? |
| --- | --- | --- |
| Jeden parametr | `p => p.CzasMs > 50` | Najczęstszy zapis w `Where`, `Select` i `OrderBy` |
| Zero parametrów | `() => DateTime.Now` | Funkcje fabrykujące, testy `LabAssert.Throws`, zadania w tle |
| Wiele parametrów | `(a, b) => a + b` | Agregacje, porównywanie par, delegaty wieloargumentowe |
| **Lambda blokowa** | `x => { ... return ...; }` | Gdy ciało wymaga zmiennych lokalnych, `if` lub wielu instrukcji |

**Lambda blokowa** używa nawiasów klamrowych `{ }` i wymaga jawnego słowa kluczowego `return` (jeśli delegat to `Func`). Ten zapis przyda się szczególnie przy obsłudze zdarzeń i operacji asynchronicznych w kolejnej lekcji:

```csharp
Func<double, string> klasyfikujPing = ms =>
{
    if (ms < 30) return "Szybki";
    if (ms < 100) return "Sredni";
    return "Wolny";
};

Action<string> wypiszLog = tekst => Console.WriteLine("[LOG] " + tekst);
wypiszLog(klasyfikujPing(75)); // [LOG] Sredni
```

---

## ⚡ Potok przetwarzania LINQ i operatory

Biblioteka **LINQ** (Language Integrated Query) to zestaw metod rozszerzających dla dowolnej kolekcji implementującej `IEnumerable<T>`: tablic, list `List<T>`, słowników oraz własnych kolekcji z poprzedniej lekcji. Łącząc wywołania w łańcuch, tworzysz **potok przetwarzania danych**.

<data-csharp-linq-viz></data-csharp-linq-viz>

### 🔀 Filtrowanie, sortowanie, grupowanie i spłaszczanie

Najważniejsze operatory przekształcające kolekcję w przestrzeni `System.Linq`:

| Operator LINQ | Rola w potoku | Przykład użycia |
| --- | --- | --- |
| `Where` | Przepuszcza wyłącznie elementy spełniające predykat | `.Where(p => p.CzyUdany && p.CzasMs > 40)` |
| `OrderBy` / `OrderByDescending` | Sortuje rosnąco lub malejąco po głównym kluczu | `.OrderByDescending(p => p.CzasMs)` |
| `ThenBy` / `ThenByDescending` | Sortowanie drugorzędne przy remisach po `OrderBy` | `.ThenBy(p => p.Host)` |
| `Select` | Mapuje każdy element na nową wartość lub typ (1 do 1) | `.Select(p => p.Host)` |
| `SelectMany` | Spłaszcza zagnieżdżone kolekcje w jedną płaską sekwencję | `.SelectMany(serwer => serwer.Logi)` |
| `Distinct` | Usuwa duplikaty z sekwencji | `.Distinct()` |
| `Skip(n)` / `Take(n)` | Pomija *n* elementów / pobiera co najwyżej *n* kolejnych | `.Skip(20).Take(10)` (paginacja: strona 3) |
| `GroupBy` | Grupuje elementy po wspólnym kluczu (`g.Key`) | `.GroupBy(p => p.Host.ToLowerInvariant())` |
| `ToDictionary` | Materializuje wynik do `Dictionary<TKey, TValue>` | `.ToDictionary(g => g.Key, g => g.Count())` |

Zwróć uwagę na dwa operatory często mylone przez początkujących: `Select` kontra `SelectMany`. Jeśli masz listę serwerów, a każdy serwer ma własną listę `List<string> Logi`, to `serwery.Select(s => s.Logi)` zwróci kolekcję list (`IEnumerable<List<string>>`). Dopiero **`SelectMany`** spłaszcza te zagnieżdżone listy w jeden ciągły strumień `IEnumerable<string>`.

Z kolei duet **`Skip` + `Take`** stanowi standardowy mechanizm **paginacji** wyników. Aby pobrać stronę numer *strona* (liczoną od 1) o rozmiarze *rozmiarStrony*, pomijasz `(strona - 1) * rozmiarStrony` rekordów i bierzesz kolejne *rozmiarStrony*.

### 🎯 Wyszukiwanie pojedynczego elementu i sprawdzanie warunków

Gdy szukasz konkretnego rekordu albo chcesz sprawdzić warunek logiczny, wybór właściwego operatora decyduje o bezpieczeństwie i wydajności kodu:

- **`First()`** kontra **`FirstOrDefault()`**: oba zwracają pierwszy pasujący element. Gdy kolekcja jest pusta lub nic nie pasuje, `First()` rzuca **_InvalidOperationException_**, natomiast `FirstOrDefault()` bezpiecznie zwraca `default(T)` (`null` dla klas, `0` dla liczb).
- **`SingleOrDefault()`**: stosuj wyłącznie wtedy, gdy w kolekcji może istnieć **co najwyżej jeden** pasujący element (na przykład wyszukiwanie po unikalnym `Id`). Jeśli dopasowań będzie dwa lub więcej, `SingleOrDefault()` celowo rzuci **_InvalidOperationException_**, sygnalizując naruszenie unikalności danych.
- **`Any()`** kontra **`All()`**: `Any(warunek)` sprawdza, czy istnieje choć jeden pasujący element, a `All(warunek)` sprawdza, czy spełniają go wszystkie elementy.

> [!TIP]
> Nigdy nie pisz `if (lista.Count() > 0)` ani `if (lista.Where(x => x > 10).Count() > 0)`. Wywołanie `Count()` potrafi przejść przez całą kolekcję do samego końca. Zamiast tego użyj **`Any()`**, które zatrzymuje się natychmiast po znalezieniu pierwszego pasującego elementu.

Spójrz na przykład analizy logów sieciowych z serwerów gry:

```csharp
var najwolniejszeHosty = pomiary
    .Where(p => p.CzyUdany && p.CzasMs >= 50)
    .OrderByDescending(p => p.CzasMs)
    .ThenBy(p => p.Host)
    .Take(3)
    .Select(p => p.Host)
    .ToList();

var sredniPingHostow = pomiary
    .Where(p => p.CzyUdany)
    .GroupBy(p => p.Host.ToLowerInvariant())
    .ToDictionary(g => g.Key, g => g.Average(x => x.CzasMs));
```

### ⚠️ Zachowanie operatorów na pustej sekwencji

Jednym z najczęstszych źródeł awarii w aplikacjach produkcyjnych jest założenie, że każda agregacja LINQ na pustej liście zwraca `0`. Rzeczywiste zachowanie zależy od operatora:

| Operator na pustej sekwencji | Wynik dla `int` / `double` | Wynik dla klasy (np. `string`) |
| --- | --- | --- |
| `Count()` | `0` | `0` |
| `Any()` | `false` | `false` |
| `All(warunek)` | `true` (pusta prawda) | `true` (pusta prawda) |
| `Sum()` | `0` lub `0.0` | nie dotyczy |
| `Average()` | rzuca **_InvalidOperationException_** | nie dotyczy |
| `Min()` / `Max()` | rzuca **_InvalidOperationException_** | `null` |
| `First()` / `Single()` | rzuca **_InvalidOperationException_** | rzuca **_InvalidOperationException_** |
| `FirstOrDefault()` / `SingleOrDefault()` | `0` lub `0.0` | `null` |

Zanim wywołasz `Average()`, `Min()` lub `Max()` na przefiltrowanych liczbach, sprawdź przez `Any()`, czy sekwencja nie jest pusta. Inaczej pojedynczy dzień bez danych lub nietrafiony filtr zatrzyma aplikację wyjątkiem.

---

## ⏳ Odroczone wykonanie i pułapka wielokrotnej enumeracji

Operatory pośrednie (`Where`, `Select`, `OrderBy`, `Skip`, `Take`) **nie wykonują obliczeń w chwili wywołania**. Zwracają obiekt `IEnumerable<T>`, który jest jedynie opisem potoku gotowym do uruchomienia. To zachowanie nazywamy _**odroczonym wykonaniem**_ (Deferred Execution).

Faktyczne przetwarzanie startuje dopiero w momencie **materializacji**:

- gdy wywołasz `.ToList()`, `.ToArray()` lub `.ToDictionary(...)`,
- gdy wywołasz agregację lub pobranie elementu (`.Count()`, `.Sum(...)`, `.Any()`, `.FirstOrDefault()`),
- gdy przeiterujesz wynik w pętli `foreach`.

Jeśli po zdefiniowaniu zapytania dopiszesz element do źródłowej listy, zapytanie zobaczy go podczas późniejszej materializacji:

```csharp
var logi = new List<int> { 12, 85, 34 };
IEnumerable<int> wysokie = logi.Where(ms => ms > 50); // Jeszcze nic nie policzono!

logi.Add(140); // Dodane po zdefiniowaniu zapytania

// Dopiero teraz LINQ przeglada liste i zwraca [85, 140]
List<int> wynik = wysokie.ToList();
```

Odroczone wykonanie ma jednak drugą stronę: **wielokrotną enumerację**. Załóżmy, że filtrujesz 500 000 rekordów i zapisujesz wynik jako leniwy obiekt `IEnumerable<Pomiar>`:

```csharp
IEnumerable<Pomiar> wolne = pomiary.Where(p => p.CzasMs > 100);

int liczba = wolne.Count();            // 1. przejscie: 500 000 sprawdzen
double suma = wolne.Sum(p => p.CzasMs); // 2. przejscie: 500 000 sprawdzen
foreach (var p in wolne) { ... }        // 3. przejscie: 500 000 sprawdzen
```

> [!WARNING]
> Każda z trzech powyższych linii uruchamia filtr `Where` od zera! Zamiast 500 000 sprawdzeń program wykonuje **_1 500 000 operacji_** i trzykrotnie marnuje czas procesora. Gdy wynik zapytania wykorzystujesz więcej niż raz, zmaterializuj go raz na początku przez `.ToList()`.

<data-gate>
<data-connection-matcher title="Dopasuj realną potrzebę w aplikacji do właściwego operatora LINQ">
  <item left="Sprawdzenie, czy istnieje choć jeden błąd krytyczny bez liczenia całej listy" right="Any(warunek)"></item>
  <item left="Połączenie list logów ze wszystkich serwerów w jedną płaską kolekcję" right="SelectMany(...)"></item>
  <item left="Pobranie pierwszego pasującego użytkownika lub null, gdy go brak" right="FirstOrDefault(warunek)"></item>
  <item left="Wyświetlenie czwartej strony wyników raportu po 20 rekordów" right="Skip(60).Take(20)"></item>
  <item left="Zapisanie przefiltrowanego wyniku przed użyciem go w Count, Sum i foreach" right="ToList()"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Maszyna stanów yield return i domknięcia (Closures)</span>
<span class="deep-dive-badge">ROSLYN LOWERING · IENUMERABLE · CLOSURES</span>
</summary>
<div class="deep-dive-content">

<h4>1. Maszyna stanów yield return i brak pośrednich list w RAM</h4>

Częsty mit głosi, że `.Where(...).Select(...).Take(5).ToList()` tworzy w pamięci kolejno trzy pośrednie listy. W rzeczywistości operatory strumieniowe (`Where`, `Select`, `Take`) są zaimplementowane jako iteratory z `yield return`.

Podczas kompilacji kompilator Roslyn przeprowadza obniżanie składni (lowering) i zamienia metodę z `yield return` w ukrytą klasę maszyny stanów implementującą `IEnumerable<T>` oraz `IEnumerator<T>`:

```csharp
// Uproszczony kod generowany przez kompilator dla iteratora Where:
private sealed class WhereIterator<T> : IEnumerable<T>, IEnumerator<T>
{
    private int state;          // aktualny etap (0 = start, 1 = petla, -1 = koniec)
    private T current;          // biezacy element zwracany przez Current
    private IEnumerator<T> src; // iterator zrodlowy

    public bool MoveNext()
    {
        while (src.MoveNext())
        {
            if (predicate(src.Current)) { current = src.Current; return true; }
        }
        return false;
    }
}
```

Gdy `ToList()` wywołuje `MoveNext()` na `Take(5)`, potok „ciągnie” pojedynczy element od końca do początku. Jeśli pierwsze 5 pasujących rekordów leży wśród pierwszych 40 elementów miliona rekordów, iterator zatrzymuje się po **40 krokach** i w ogóle nie czyta pozostałych **999 960 rekordów**. Wyjątkiem są `OrderBy` oraz `GroupBy`, które muszą zbuforować wszystkie elementy, zanim wydadzą pierwszy wynik.

<h4>2. Domknięcia (Closures) i klasyczny błąd pętli for z lambdą</h4>

Wyrażenie lambda może odczytywać zmienne lokalne z otaczającej metody, na przykład `int prog = 50; lista.Where(x => x > prog);`. Zmienna lokalna leży jednak na stosie, który zniknie po wyjściu z metody, a lambda może zostać wywołana znacznie później.

Roslyn rozwiązuje ten problem, generując ukrytą klasę pomocniczą na stercie (`<>c__DisplayClass0_0`) i przenosząc przechwyconą zmienną *prog* jako pole tej klasy (lifting). Stąd bierze się znany błąd z pętlą `for`:

```csharp
var akcje = new List<Func<int>>();
for (int i = 0; i < 3; i++)
{
    akcje.Add(() => i); // Kazda lambda przechwytuje TO SAMO pole 'i' na stercie!
}
// Wywolanie akcje[0](), akcje[1](), akcje[2]() zwroci: 3, 3, 3 zamiast 0, 1, 2!
```

Wszystkie trzy lambdy wskazują na tę samą instancję ukrytej klasy z jednym polem *i*, które po zakończeniu pętli ma wartość `3`. Poprawka wymaga utworzenia zmiennej lokalnej wewnątrz pętli (`int kopia = i; akcje.Add(() => kopia);`), co zmusza kompilator do utworzenia osobnej instancji domknięcia dla każdej iteracji.

</div>
</details>

---

## 💻 Zadanie praktyczne: Analityka procesów w LINQ

W klasie `AnalizatorLinq` uzupełnij pięć metod operujących na liście `List<WpisProcesu>`:

1. **`TopNazwy(List<WpisProcesu> procesy, int ile)`**:
   - dla `procesy == null` lub `ile <= 0` zwróć pustą listę nazw,
   - posortuj procesy malejąco po zużyciu pamięci, pobierz co najwyżej *ile* pierwszych i zwróć listę ich nazw.
2. **`SumaPamieciDlaNazwy(List<WpisProcesu> procesy, string nazwa)`**:
   - dla `procesy == null` lub pustej nazwy zwróć `0.0`,
   - zsumuj zużycie pamięci wszystkich procesów o podanej nazwie bez rozróżniania wielkości liter.
3. **`PodsumujGrupami(List<WpisProcesu> procesy)`**:
   - dla `procesy == null` zwróć pusty słownik,
   - pogrupuj procesy po nazwie sprowadzonej do małych liter i zsumuj pamięć w każdej grupie.
4. **`SredniaPamiecAktywnych(List<WpisProcesu> procesy, double progMb)`**:
   - dla `procesy == null` zwróć `0.0`,
   - odfiltruj procesy zużywające co najmniej *progMb* pamięci (`>=`) i oblicz ich średnie zużycie pamięci,
   - jeśli żaden proces nie spełnia warunku, zwróć bezpiecznie `0.0` bez rzucania wyjątku przez `Average()`.
5. **`ZnajdzNajciezszyLubNull(List<WpisProcesu> procesy, string prefiksNazwy)`**:
   - dla `procesy == null` lub pustego prefiksu zwróć `null`,
   - znajdź proces, którego nazwa zaczyna się od *prefiksNazwy* (bez rozróżniania wielkości liter) i ma największe zużycie pamięci,
   - jeśli brak pasujących procesów, zwróć `null`.

<data-gate>
<data-csharp-lab title="Zadanie: Potoki LINQ - filtrowanie, sortowanie, grupowanie i bezpieczne agregacje" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

public class WpisProcesu
{
    public string Nazwa { get; private set; }
    public double PamiecMb { get; private set; }

    public WpisProcesu(string nazwa, double pamiecMb)
    {
        Nazwa = nazwa;
        PamiecMb = pamiecMb;
    }
}

public class AnalizatorLinq
{
    public static List<string> TopNazwy(List<WpisProcesu> procesy, int ile)
    {
        // Zwroc nazwy 'ile' najbardziej pamieciozernych procesow (zabezpiecz null i ile <= 0)
        return new List<string>();
    }

    public static double SumaPamieciDlaNazwy(List<WpisProcesu> procesy, string nazwa)
    {
        // Zsumuj pamiec procesow o podanej nazwie bez rozrozniania wielkosci liter
        return 0.0;
    }

    public static Dictionary<string, double> PodsumujGrupami(List<WpisProcesu> procesy)
    {
        // Zbuduj slownik: nazwa (malymi literami) -> laczna pamiec MB
        return new Dictionary<string, double>();
    }

    public static double SredniaPamiecAktywnych(List<WpisProcesu> procesy, double progMb)
    {
        // Policz srednia pamiec dla procesow z PamiecMb >= progMb; dla braku wynikow zwroc 0.0
        return 0.0;
    }

    public static WpisProcesu ZnajdzNajciezszyLubNull(List<WpisProcesu> procesy, string prefiksNazwy)
    {
        // Zwroc najciezszy proces zaczynajacy sie od prefiksNazwy (ignore case) lub null
        return null;
    }

    static void Main()
    {
        var lista = new List<WpisProcesu>
        {
            new WpisProcesu("chrome", 250.0),
            new WpisProcesu("Chrome", 310.0),
            new WpisProcesu("discord", 180.0),
            new WpisProcesu("notepad", 12.5)
        };

        Console.WriteLine("Top 2: " + string.Join(", ", TopNazwy(lista, 2)));
        Console.WriteLine("Suma Chrome: " + SumaPamieciDlaNazwy(lista, "CHROME") + " MB");
        Console.WriteLine("Srednia >= 100 MB: " + SredniaPamiecAktywnych(lista, 100.0) + " MB");
        var najciezszyChr = ZnajdzNajciezszyLubNull(lista, "chr");
        Console.WriteLine("Najciezszy chr*: " + (najciezszyChr != null ? najciezszyChr.PamiecMb.ToString() : "brak"));

        var grupy = PodsumujGrupami(lista);
        foreach (var para in grupy)
        {
            Console.WriteLine(para.Key + ": " + para.Value + " MB");
        }
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("TopNazwy sortuje malejaco po pamieci i obsluguje przypadki brzegowe", () => {
    var lista = new List<WpisProcesu> {
        new WpisProcesu("a", 50),
        new WpisProcesu("b", 300),
        new WpisProcesu("c", 120)
    };
    LabAssert.Equal("b,c", string.Join(",", AnalizatorLinq.TopNazwy(lista, 2)));
    LabAssert.Equal("b,c,a", string.Join(",", AnalizatorLinq.TopNazwy(lista, 10)));
    LabAssert.Equal(0, AnalizatorLinq.TopNazwy(lista, 0).Count);
    LabAssert.Equal(0, AnalizatorLinq.TopNazwy(lista, -3).Count);
    LabAssert.Equal(0, AnalizatorLinq.TopNazwy(null, 2).Count);
    LabAssert.Equal(0, AnalizatorLinq.TopNazwy(new List<WpisProcesu>(), 3).Count);
});

LabAssert.Test("SumaPamieciDlaNazwy ignoruje wielkosc liter i obsluguje null oraz brak dopasowan", () => {
    var lista = new List<WpisProcesu> {
        new WpisProcesu("chrome", 100.5),
        new WpisProcesu("CHROME", 200.5),
        new WpisProcesu("edge", 150.0)
    };
    LabAssert.Equal(301.0, AnalizatorLinq.SumaPamieciDlaNazwy(lista, "Chrome"));
    LabAssert.Equal(0.0, AnalizatorLinq.SumaPamieciDlaNazwy(lista, "firefox"));
    LabAssert.Equal(0.0, AnalizatorLinq.SumaPamieciDlaNazwy(new List<WpisProcesu>(), "chrome"));
    LabAssert.Equal(0.0, AnalizatorLinq.SumaPamieciDlaNazwy(null, "chrome"));
    LabAssert.Equal(0.0, AnalizatorLinq.SumaPamieciDlaNazwy(lista, null));
    LabAssert.Equal(0.0, AnalizatorLinq.SumaPamieciDlaNazwy(lista, ""));
});

LabAssert.Test("PodsumujGrupami laczy nazwy niezaleznie od wielkosci liter i obsluguje null oraz pusta liste", () => {
    var lista = new List<WpisProcesu> {
        new WpisProcesu("chrome", 100.0),
        new WpisProcesu("Chrome", 250.0),
        new WpisProcesu("discord", 180.0)
    };
    var mapa = AnalizatorLinq.PodsumujGrupami(lista);
    LabAssert.Equal(2, mapa.Count);
    LabAssert.Equal(350.0, mapa["chrome"]);
    LabAssert.Equal(180.0, mapa["discord"]);

    LabAssert.Equal(0, AnalizatorLinq.PodsumujGrupami(new List<WpisProcesu>()).Count);
    LabAssert.Equal(0, AnalizatorLinq.PodsumujGrupami(null).Count);
});

LabAssert.Test("SredniaPamiecAktywnych liczy srednia powyzej progu i nie rzuca wyjatku dla pustego wyniku", () => {
    var lista = new List<WpisProcesu> {
        new WpisProcesu("notepad", 20.0),
        new WpisProcesu("discord", 100.0),
        new WpisProcesu("chrome", 300.0)
    };
    LabAssert.Equal(200.0, AnalizatorLinq.SredniaPamiecAktywnych(lista, 100.0));
    LabAssert.Equal(300.0, AnalizatorLinq.SredniaPamiecAktywnych(lista, 250.0));
    LabAssert.Equal(0.0, AnalizatorLinq.SredniaPamiecAktywnych(lista, 999.0));
    LabAssert.Equal(0.0, AnalizatorLinq.SredniaPamiecAktywnych(new List<WpisProcesu>(), 10.0));
    LabAssert.Equal(0.0, AnalizatorLinq.SredniaPamiecAktywnych(null, 10.0));
});

LabAssert.Test("ZnajdzNajciezszyLubNull wybiera najwiekszy pasujacy proces lub zwraca null", () => {
    var lista = new List<WpisProcesu> {
        new WpisProcesu("chrome_helper", 120.0),
        new WpisProcesu("Chrome_main", 420.0),
        new WpisProcesu("code", 280.0)
    };
    var znaleziony = AnalizatorLinq.ZnajdzNajciezszyLubNull(lista, "CHR");
    LabAssert.Equal(true, znaleziony != null);
    LabAssert.Equal("Chrome_main", znaleziony.Nazwa);
    LabAssert.Equal(420.0, znaleziony.PamiecMb);

    LabAssert.Equal(true, AnalizatorLinq.ZnajdzNajciezszyLubNull(lista, "firefox") == null);
    LabAssert.Equal(true, AnalizatorLinq.ZnajdzNajciezszyLubNull(new List<WpisProcesu>(), "chr") == null);
    LabAssert.Equal(true, AnalizatorLinq.ZnajdzNajciezszyLubNull(null, "chr") == null);
    LabAssert.Equal(true, AnalizatorLinq.ZnajdzNajciezszyLubNull(lista, "") == null);
    LabAssert.Equal(true, AnalizatorLinq.ZnajdzNajciezszyLubNull(lista, null) == null);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Gdy przekazujesz logikę jako argument do metody:</strong> użyj delegatu `Func<..., TResult>` dla funkcji zwracających wartość lub `Action<...>` dla operacji `void`, zapisując samą logikę jako zwięzłą lambdę (lub lambdę blokową przy wielu instrukcjach).
- <strong>Gdy sprawdzasz istnienie elementu lub pobierasz pierwszy wynik:</strong> wybieraj `Any()` zamiast `Count() > 0` oraz `FirstOrDefault()` zamiast `First()`, aby uniknąć zbędnego skanowania i **_InvalidOperationException_**.
- <strong>Gdy liczysz `Average()`, `Min()` lub `Max()` na przefiltrowanych liczbach:</strong> najpierw upewnij się przez `Any()`, że sekwencja nie jest pusta.
- <strong>Gdy wynik zapytania LINQ wykorzystujesz więcej niż raz:</strong> zmaterializuj go jednorazowo przez `.ToList()`, aby uniknąć wielokrotnej enumeracji tej samej kolekcji.
- <strong>Gdy musisz spłaszczyć kolekcję kolekcji lub podzielić dane na strony:</strong> sięgnij po `SelectMany(...)` dla spłaszczania oraz duet `Skip(n).Take(m)` dla paginacji.
