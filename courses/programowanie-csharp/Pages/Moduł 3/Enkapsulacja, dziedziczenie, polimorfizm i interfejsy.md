# Enkapsulacja, dziedziczenie, polimorfizm i interfejsy

Wyobraź sobie system monitorowania zasobów albo silnik gry strategicznej. Na początku obsługujesz tylko dwa typy obiektów, więc piszesz prostą instrukcję warunkową:

```csharp
if (typ == "CPU")
{
    wynik = obciazenieCpu;
}
else if (typ == "RAM")
{
    wynik = (uzytyRam / calyRam) * 100.0;
}
```

Gdy projekt rośnie do piętnastu typów czujników lub jednostek, taka drabinka pojawia się w dziesięciu różnych plikach. Dodanie jednego nowego typu wymusza edycję każdego pliku z osobna. Jedno pominięte `else if` zamienia się w ukryty błąd w działaniu programu.

Architektura obiektowa rozwiązuje ten problem u źródła. Zamiast sprawdzać napis *typ*, trzymasz różne klasy w jednej kolekcji `List<Jednostka>` i uruchamiasz jedną, niezmienną pętlę:

```csharp
foreach (Jednostka j in oddzial)
{
    Console.WriteLine(j.OpisAtaku());
}
```

Dodanie nowej klasy `Mag` lub `Katapulta` nie wymaga zmiany ani jednej linii tej pętli. Aby taka konstrukcja działała bezpiecznie, potrzebujesz czterech współpracujących mechanizmów: **enkapsulacji**, **dziedziczenia**, **polimorfizmu** oraz **interfejsów**.

---

## 🔒 Enkapsulacja w hierarchii i dziedziczenie klas

**Dziedziczenie** pozwala utworzyć klasę pochodną na bazie istniejącej klasy bazowej za pomocą dwukropka (`class Lucznik : Jednostka`). Klasa pochodna przejmuje wszystkie odziedziczone właściwości i metody, a dodatkowo wprowadza własne pola i logikę.

Gdy kilka klas współdzieli stan, ale sam obiekt bazowy nie ma sensu w programie, oznacz klasę bazową słowem **`abstract`**. Nie utworzysz obiektu przez `new Jednostka(...)`, ponieważ **klasa abstrakcyjna** służy wyłącznie jako wspólny fundament dla konkretnych typów.

Spójrz na hierarchię jednostek w grze strategicznej:

```csharp
using System;

public abstract class Jednostka
{
    public string Nazwa { get; private set; }
    public int BazowyAtak { get; protected set; }

    protected Jednostka(string nazwa, int bazowyAtak)
    {
        Nazwa = nazwa;
        BazowyAtak = bazowyAtak;
    }

    // Kazda klasa pochodna MUSI dostarczyc wlasna implementacje
    public abstract int ObliczObrazenia();

    // Domyslne zachowanie, ktore klasa pochodna MOZE nadpisac
    public virtual string OpisAtaku()
    {
        return string.Format("{0} zadaje {1} obrazen.", Nazwa, ObliczObrazenia());
    }
}

public class Lucznik : Jednostka
{
    private int _premiaDystansu;

    public Lucznik(int bazowyAtak, int premiaDystansu) : base("Lucznik", bazowyAtak)
    {
        _premiaDystansu = premiaDystansu;
    }

    public override int ObliczObrazenia()
    {
        return BazowyAtak + _premiaDystansu;
    }
}

public class Rycerz : Jednostka
{
    private int _bonusSzazy;

    public Rycerz(int bazowyAtak, int bonusSzarzy) : base("Rycerz", bazowyAtak)
    {
        _bonusSzazy = bonusSzarzy;
    }

    public override int ObliczObrazenia()
    {
        return BazowyAtak + _bonusSzazy;
    }
}
```

Zwróć uwagę na trzy modyfikatory dostępu użyte w klasie `Jednostka`. Każdy z nich wyznacza precyzyjną granicę **enkapsulacji**:

| Modyfikator | Kto ma dostęp do zapisu lub wywołania? | Zastosowanie w projekcie |
| --- | --- | --- |
| `public` | Dowolny kod w całym programie | Kontrakt zewnętrzny: metody i odczyt właściwości |
| `protected` | Tylko ta klasa oraz klasy po niej dziedziczące | Wspólne pola bazowe (`BazowyAtak`) i konstruktor klasy abstrakcyjnej |
| `private` | Wyłącznie wnętrze jednej klasy | Szczegóły implementacji (`_premiaDystansu`, `Nazwa { get; private set; }`) |

### 🧱 Kolejność wywołań konstruktorów i słowo kluczowe base

Kiedy w kodzie wykonujesz instrukcję `new Lucznik(15, 8)`, środowisko wykonawcze musi zbudować obiekt od fundamentów w górę. Nie wolno uruchomić ciała konstruktora klasy pochodnej, dopóki część bazowa obiektu nie jest gotowa.

Słowo kluczowe **`: base(...)`** przekazuje argumenty z konstruktora `Lucznik` do konstruktora `Jednostka`. Jeśli klasa bazowa nie posiada konstruktora bezparametrowego, pominięcie `: base(...)` kończy się **_błędem kompilacji_**.

> [!IMPORTANT]
> Konstruktor klasy bazowej zawsze wykonuje się **przed** ciałem konstruktora klasy pochodnej. Dzięki temu w ciele konstruktora `Lucznik` właściwości `Nazwa` i `BazowyAtak` mają już poprawne, zwalidowane wartości.

<data-gate>
<data-sortable-list title="Ułóż w prawidłowej kolejności 5 etapów wykonywanych przy wywołaniu new Lucznik(15, 8)">
  <item data-correct="3">Wewnątrz konstruktora Jednostka ustawiane są właściwości Nazwa oraz BazowyAtak</item>
  <item data-correct="1">Środowisko CLR rezerwuje na stercie pamięć dla całego obiektu Lucznik</item>
  <item data-correct="5">Operator new zwraca referencję do w pełni zainicjalizowanego obiektu Lucznik</item>
  <item data-correct="2">Zanim ruszy ciało Lucznik, klauzula : base("Lucznik", 15) wywołuje konstruktor Jednostka</item>
  <item data-correct="4">Uruchamia się ciało konstruktora Lucznik i zapisuje wartość 8 w polu _premiaDystansu</item>
</data-sortable-list>
</data-gate>

---

## 🎭 Polimorfizm, rozszerzanie przez base i pułapka ukrywania metod

**Polimorfizm** oznacza, że jedna zmienna typu bazowego (`Jednostka`) może wskazywać na różne obiekty pochodne (`Lucznik`, `Rycerz`). Gdy wywołujesz metodę oznaczoną jako `virtual` lub `abstract`, środowisko CLR w trakcie działania programu sprawdza rzeczywisty typ obiektu na stercie i uruchamia właściwą wersję **`override`**.

### 🧩 Rozszerzanie zachowania przez base.Metoda()

Czasami klasa pochodna nie chce zastępować całej metody bazowej, lecz jedynie dopisać do niej własny fragment. Zamiast kopiować kod z klasy `Jednostka`, wywołujesz **`base.OpisAtaku()`** wewnątrz nadpisanej metody:

```csharp
public class LucznikElitarny : Lucznik
{
    public LucznikElitarny(int bazowyAtak, int premiaDystansu)
        : base(bazowyAtak, premiaDystansu)
    {
    }

    public override string OpisAtaku()
    {
        return "[ELITA] " + base.OpisAtaku();
    }
}
```

Takie wywołanie uruchamia oryginalną logikę z klasy bazowej i obudowuje jej wynik prefiksem `"[ELITA] "`. Gdy zmienisz format tekstu w `Jednostka`, wszystkie klasy pochodne automatycznie skorzystają z poprawki.

### ⚠️ Pułapka braku override i ukrywanie metod

Częstym błędem początkujących jest napisanie metody o tej samej nazwie w klasie pochodnej **bez słowa `override`** (lub gdy metoda bazowa nie jest `virtual`). Taki mechanizm nie jest polimorfizmem, lecz **_ukrywaniem metody_** (kompilator zgłasza ostrzeżenie i sugeruje słowo `new`).

Sprawdź, co wypisze ten kod:

```csharp
public class Bazowa
{
    public string PrzedstawSie() { return "Jestem Bazowa"; }
}

public class Pochodna : Bazowa
{
    public new string PrzedstawSie() { return "Jestem Pochodna"; }
}

Bazowa refBazowa = new Pochodna();
Pochodna refPochodna = new Pochodna();

Console.WriteLine(refBazowa.PrzedstawSie());   // Wypisze: Jestem Bazowa!
Console.WriteLine(refPochodna.PrzedstawSie()); // Wypisze: Jestem Pochodna
```

Bez pary `virtual` i `override` o wyborze metody decyduje typ zmiennej po lewej stronie (`Bazowa`), a nie rzeczywisty obiekt w pamięci (`Pochodna`). Referencja bazowa całkowicie ignoruje wersję z klasy `Pochodna`.

> [!WARNING]
> Jeśli chcesz, aby pętla `foreach (Jednostka j in oddzial)` wywoływała kod z klas pochodnych, metoda w klasie bazowej musi mieć `virtual` lub `abstract`, a w klasie pochodnej obowiązkowo słowo `override`.

---

## 🔌 Interfejsy, wielokrotna implementacja oraz operatory is i as

Klasa w C# może dziedziczyć tylko po **jednej** klasie bazowej. Co zrobić, gdy w grze pojawia się `WiezaObronna`? Wieża nie jest jednostką (nie porusza się po mapie), ale potrafi zadawać obrażenia i można ją naprawiać.

Tutaj wchodzi **interfejs (`interface`)**, czyli czysty **kontrakt**. Interfejs nie przechowuje pól ani konstruktorów. Definiuje wyłącznie zestaw metod i właściwości, które klasa zobowiązuje się zaimplementować. Jedna klasa może implementować **wiele interfejsów jednocześnie**:

```csharp
public interface IAtakujacy
{
    string Nazwa { get; }
    int ObliczObrazenia();
}

public interface INaprawialny
{
    void Napraw(int punkty);
}

public class WiezaObronna : IAtakujacy, INaprawialny
{
    public string Nazwa { get; private set; }
    public int Wytrzymalosc { get; private set; }

    public WiezaObronna(string nazwa, int wytrzymalosc)
    {
        Nazwa = nazwa;
        Wytrzymalosc = wytrzymalosc;
    }

    public int ObliczObrazenia()
    {
        return 25;
    }

    public void Napraw(int punkty)
    {
        if (punkty > 0) Wytrzymalosc += punkty;
    }
}
```

### 🔎 Sprawdzanie typu z operatorem is i bezpieczne rzutowanie as

Gdy trzymasz obiekty `Lucznik`, `Rycerz` i `WiezaObronna` na wspólnej liście `List<IAtakujacy>`, każda z nich obsługuje `ObliczObrazenia()`. Jednak tylko część z nich implementuje dodatkowo `INaprawialny`.

Bezpośrednie rzutowanie `(INaprawialny)obiekt` dla obiektu `Lucznik` natychmiast przerwie program wyjątkiem `**_InvalidCastException_**`. Zamiast zgadywać, używaj dwóch bezpiecznych operatorów:

- Operator **`is`** sprawdza, czy obiekt jest zgodny z danym typem lub interfejsem, i zwraca `true` albo `false`.
- Operator **`as`** próbuje rzutować obiekt na wskazany typ referencyjny. Jeśli obiekt nie implementuje interfejsu, zwraca **`null`** zamiast rzucać wyjątek.

```csharp
foreach (IAtakujacy obiekt in lista)
{
    INaprawialny doNaprawy = obiekt as INaprawialny;
    if (doNaprawy != null)
    {
        doNaprawy.Napraw(10);
    }
}
```

> [!TIP]
> Gdy chcesz zarówno sprawdzić typ, jak i wywołać na nim metodę, użyj wzorca `as` połączonego ze sprawdzeniem `!= null`. Unikasz w ten sposób podwójnego sprawdzania typu, które zaszłoby przy parze `is` i rzutowaniu w nawiasach.

### ⚖️ Kiedy klasa abstrakcyjna, a kiedy interfejs

| Cecha | `abstract class` | `interface` |
| --- | --- | --- |
| Pola i konstruktor | Może posiadać pola, konstruktor i gotowe metody pomocnicze | Brak pól instancyjnych i brak konstruktora: wyłącznie sygnatury |
| Wielokrotność | Klasa może dziedziczyć tylko po **jednej** klasie bazowej | Klasa może implementować **wiele** interfejsów jednocześnie |
| Relacja w projekcie | „Jest rodzajem...” (`Lucznik` jest rodzajem `Jednostka`) | „Potrafi robić...” (`Lucznik` i `WiezaObronna` potrafią `IAtakujacy`) |

---

## 🛡️ Modyfikatory sealed, static class oraz kompozycja ponad dziedziczenie

Dobry projekt obiektowy nie polega na budowaniu głębokich drzew dziedziczenia na dziesięć poziomów w głąb. Równie ważne jest wiedzieć, kiedy dziedziczenie zablokować albo zastąpić prostszym mechanizmem.

### 🔐 Klasy sealed i static class

- **`sealed class`** blokuje dalsze dziedziczenie po danej klasie (próba napisania `class Podklasa : KlasaSealed` daje **_błąd kompilacji_**). Stosujesz ten modyfikator, gdy klasa realizuje kompletny, zamknięty niezmiennik (np. `string` w .NET jest klasą `sealed`) lub gdy chcesz pozwolić kompilatorowi JIT na szybsze wywołania metod.
- **`static class`** to kontener na czyste funkcje narzędziowe, które nie potrzebują stanu instancji (np. `Math` lub nasz `MonitorSystemu`). Nie możesz utworzyć jej obiektu przez `new`, a wszystkie jej składowe muszą być `static`.

### 🧱 Zasada kompozycja ponad dziedziczenie

Początkujący programiści często nadużywają dziedziczenia, by „pożyczyć” kod z innej klasy. Klasycznym antywzorcem jest zapis `class Samochod : Silnik`.

Dlaczego to błąd? Samochód nie „jest rodzajem” silnika. Samochód **posiada** silnik. Dziedziczenie po `Silnik` przykleja klasę `Samochod` na stałe do jednej implementacji i wystawia na zewnątrz metody, które powinny zostać ukryte pod maską.

Zamiast dziedziczyć, zastosuj _**kompozycję ponad dziedziczenie**_: umieść w klasie pole z interfejsem i przekaż zależność przez konstruktor:

```csharp
public interface ISilnik
{
    void Uruchom();
}

public sealed class Samochod
{
    private readonly ISilnik _silnik;

    public Samochod(ISilnik silnik)
    {
        if (silnik == null) throw new ArgumentNullException("silnik");
        _silnik = silnik;
    }

    public void Jedz()
    {
        _silnik.Uruchom();
    }
}
```

Dzięki kompozycji ten sam `Samochod` może współpracować z `SilnikSpalinowy`, `SilnikElektryczny` albo symulatorem testowym. Nie modyfikujesz ani jednej linii w klasie `Samochod`.

<data-gate>
<data-connection-matcher title="Dopasuj mechanizm obiektowy C# do sytuacji projektowej">
  <item left="abstract class" right="Wspólne pola, walidacja w konstruktorze i częściowo gotowa logika dla rodziny pokrewnych klas"></item>
  <item left="interface" right="Kontrakt bez pól, który może zaimplementować jednocześnie wiele niepowiązanych ze sobą klas"></item>
  <item left="virtual / override" right="Uruchamianie właściwej wersji metody z klasy pochodnej podczas iteracji po referencji bazowej"></item>
  <item left="sealed class" right="Zablokowanie dalszego dziedziczenia w celu ochrony niezmiennika i optymalizacji JIT"></item>
  <item left="Kompozycja (pole z interfejsem)" right="Relacja „posiada” (np. Samochod posiada ISilnik) zamiast sztywnego dziedziczenia"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Tablica vtable i CALLVIRT, Devirtualization w RyuJIT oraz Diamond Problem w C++</span>
<span class="deep-dive-badge">VTABLE · RYUJIT · C++ VS C#</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak procesor wie, którą wersję metody wirtualnej uruchomić (CALL vs CALLVIRT)?</h4>

Zwykła metoda niewirtualna jest znana w czasie kompilacji. Kompilator generuje w bajtkodzie CIL instrukcję **`CALL`**, którą JIT zamienia na bezpośredni skok maszynowy pod stały adres (np. `call 0x7FF812340080`). Koszt takiego wywołania na współczesnym CPU to około 1 cykl zegara, a kompilator często wkleja krótkie ciało metody wprost w miejsce wywołania (tzw. Inlining).

Gdy metoda jest `virtual`, `abstract` lub należy do interfejsu, kompilator generuje instrukcję CIL **`CALLVIRT`**. Podczas wykonania procesor wykonuje **skok pośredni** przez tablicę metod wirtualnych (**`vtable`**, w CLR będącą częścią `MethodTable`, a w C++ wskazywaną przez ukryte pole `vptr`):

```asm
; Wywolanie polimorficzne: j.ObliczObrazenia() (RCX = adres obiektu j)
mov rax, qword ptr [rcx]      ; 1. Odczytaj MethodTable* (vptr) z offsetu +0 obiektu
mov rax, qword ptr [rax+48h]  ; 2. Pobierz adres konkretnej metody ze stalego slotu vtable
call rax                      ; 3. Skok posredni pod dynamicznie odczytany adres
```

Dodatkowy koszt pojedynczego wywołania to dwa odczyty pamięci (1 do 2 nanosekund przy trafieniu w cache L1). Jednak jeśli w ciasnej pętli obiekty różnych klas przeplatają się losowo, predyktor skoków pośrednich procesora może pudłować (**_Branch Misprediction_**). Kosztuje to 15 do 20 cykli CPU na jedno wywołanie i blokuje wklejanie ciała metody.

<h4>2. Devirtualization w kompilatorze RyuJIT, Virtual Stub Dispatch i słowo sealed</h4>

W przypadku wywołań przez **interfejs** (np. `ICzujnik.OdczytajProcent()`) dwa różne typy mogą umieścić metodę pod zupełnie innym indeksem w swojej tablicy metod. Środowisko CLR rozwiązuje to mechanizmem **Virtual Stub Dispatch (VSD)**. Dla każdego miejsca wywołania tworzy mały blok kodu pośredniego, który zapamiętuje ostatnio widziany `MethodTable*`. Gdy w pętli pojawia się ten sam typ obiektu, porównanie wskaźnika trafia natychmiast.

Jeśli klasa nie jest projektowana do dalszego dziedziczenia, oznacz ją modyfikatorem **`sealed`** (np. `public sealed class CzujnikCpu : CzujnikBazowy, IKalibrowalny`). Kompilator **RyuJIT** w .NET wykrywa wtedy, że typ w tym miejscu nie ma żadnych klas pochodnych, i przeprowadza optymalizację zwaną **Devirtualization**. Zamienia kosztowny skok pośredni `CALLVIRT` na zwykłe bezpośrednie `CALL`, a krótkie metody całkowicie wkleja w miejsce wywołania bez narzutu skoku.

<h4>3. Diamond Problem w C++ i dlaczego C# zrezygnował z wielodziedziczenia klas</h4>

W C++ klasa może dziedziczyć jednocześnie po dwóch klasach bazowych. Prowadzi to do słynnego **_problemu diamentu_** (Diamond Problem):

```cpp
struct Urzadzenie { int id; };
struct Skaner   : Urzadzenie { };
struct Drukarka : Urzadzenie { };
struct Kombajn  : Skaner, Drukarka { }; // W pamieci Kombajn sa DWIE kopie pola "id"!
// Kombajn k; k.id = 5; -> BLAD KOMPILACJI: niejednoznaczne (Skaner::id czy Drukarka::id?)
```

Rozwiązanie w C++ wymaga tzw. dziedziczenia wirtualnego (`struct Skaner : virtual Urzadzenie`). Dodaje ono ukryte tablice przesunięć (`vbtable`), komplikuje rzutowanie wskaźników i narzuca koszt pamięciowy na każdy obiekt. Twórcy C# i CLR rozwiązali problem u źródła: każda klasa ma dokładnie **jedną** klasę bazową (układ pól w pamięci jest zawsze liniowy i jednoznaczny), a współdzielenie wielu ról realizują **interfejsy**, które nie wprowadzają żadnego konfliktu pól w pamięci.

</div>
</details>

---

## 💻 Zadanie praktyczne w 2 plikach dla systemu czujników sprzętowych

Przełącz zakładkę na **`Czujniki.cs`** i zaimplementuj polimorficzny moduł monitorowania zasobów komputera:

1. **Klasa `CzujnikCpu : CzujnikBazowy, IKalibrowalny`**:
   - konstruktor `CzujnikCpu(double aktualneObciazenie, double progAlarmu)` przekazuje `("CPU", progAlarmu)` do `: base(...)`,
   - dla `aktualneObciazenie < 0 || aktualneObciazenie > 100` rzuć `ArgumentOutOfRangeException`,
   - nadpisuje `override double OdczytajProcent()`, zwracając zapisane obciążenie,
   - implementuje metodę `void Resetuj()` z interfejsu `IKalibrowalny`, która zeruje zapisane obciążenie (`0.0`).
2. **Klasa `CzujnikRam : CzujnikBazowy`** (nie implementuje `IKalibrowalny`):
   - konstruktor `CzujnikRam(double uzyteGb, double calkowiteGb, double progAlarmu)` przekazuje `("RAM", progAlarmu)` do `: base(...)`,
   - dla `calkowiteGb <= 0 || uzyteGb < 0 || uzyteGb > calkowiteGb` rzuć `ArgumentOutOfRangeException`,
   - nadpisuje `override double OdczytajProcent()`, zwracając `(uzyteGb / calkowiteGb) * 100.0`.
3. **Klasa statyczna `MonitorSystemu`**:
   - `PoliczAlarmy(List<CzujnikBazowy> czujniki)`: dla `czujniki == null` rzuć `ArgumentNullException`; przejdź jedną pętlą polimorficzną po liście i policz czujniki zgłaszające `CzyAlarm() == true` (pomijaj elementy `null`).
   - `ResetujKalibrowalne(List<CzujnikBazowy> czujniki)`: dla `czujniki == null` rzuć `ArgumentNullException`; przejdź po liście, dla każdego elementu implementującego `IKalibrowalny` (użyj operatora `as` lub `is`) wywołaj `Resetuj()` i zwróć liczbę zresetowanych czujników.

<data-gate>
<data-csharp-lab title="Zadanie: Polimorfizm, abstract class, dwa interfejsy, : base oraz is/as (2 pliki)">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;

class Program
{
    static void Main()
    {
        var czujniki = new List<CzujnikBazowy>
        {
            new CzujnikCpu(72.5, 80.0),
            new CzujnikRam(14.4, 16.0, 85.0)
        };

        foreach (CzujnikBazowy c in czujniki)
        {
            Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
                "{0}: {1:F1}% | Alarm: {2}", c.Nazwa, c.OdczytajProcent(), c.CzyAlarm()));
        }

        Console.WriteLine("Aktywne alarmy: " + MonitorSystemu.PoliczAlarmy(czujniki));
        Console.WriteLine("Zresetowane czujniki: " + MonitorSystemu.ResetujKalibrowalne(czujniki));
    }
}
```

</cs-file>
<cs-file name="Czujniki.cs">

```csharp
using System;
using System.Collections.Generic;

public interface ICzujnik
{
    string Nazwa { get; }
    double OdczytajProcent();
}

public interface IKalibrowalny
{
    void Resetuj();
}

public abstract class CzujnikBazowy : ICzujnik
{
    public string Nazwa { get; private set; }
    public double ProgAlarmu { get; protected set; }

    protected CzujnikBazowy(string nazwa, double progAlarmu)
    {
        Nazwa = nazwa;
        ProgAlarmu = progAlarmu;
    }

    public abstract double OdczytajProcent();

    public virtual bool CzyAlarm()
    {
        return OdczytajProcent() >= ProgAlarmu;
    }
}

// 1. Dopisz tutaj cala klase: public class CzujnikCpu : CzujnikBazowy, IKalibrowalny
// Pamietaj o : base("CPU", progAlarmu), walidacji [0..100], override OdczytajProcent() oraz Resetuj()

// 2. Dopisz tutaj cala klase: public class CzujnikRam : CzujnikBazowy
// Pamietaj o : base("RAM", progAlarmu), walidacji i override OdczytajProcent()

public static class MonitorSystemu
{
    public static int PoliczAlarmy(List<CzujnikBazowy> czujniki)
    {
        // Zwaliduj null i policz wszystkie czujniki z aktywnym alarmem (pomin null na liscie)
        return 0;
    }

    public static int ResetujKalibrowalne(List<CzujnikBazowy> czujniki)
    {
        // Zwaliduj null, znajdz obiekty IKalibrowalny przez as/is, wywolaj Resetuj() i zwroc ich liczbe
        return 0;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("CzujnikCpu i CzujnikRam poprawnie obliczają procenty i wyzwalają alarm na granicy progu", () => {
    CzujnikBazowy cpu = new CzujnikCpu(80.0, 80.0);
    CzujnikBazowy ram = new CzujnikRam(14.4, 16.0, 85.0);
    CzujnikBazowy spokojny = new CzujnikCpu(15.5, 80.0);

    LabAssert.True(cpu is ICzujnik);
    LabAssert.True(cpu is IKalibrowalny);
    LabAssert.False(ram is IKalibrowalny);
    LabAssert.Equal("CPU", cpu.Nazwa);
    LabAssert.Equal(80.0, cpu.OdczytajProcent());
    LabAssert.True(cpu.CzyAlarm());
    LabAssert.False(spokojny.CzyAlarm());

    LabAssert.Equal("RAM", ram.Nazwa);
    LabAssert.Equal(90.0, Math.Round(ram.OdczytajProcent(), 1));
    LabAssert.True(ram.CzyAlarm());
});
LabAssert.Test("Konstruktory CzujnikCpu i CzujnikRam odrzucają nieprawidłowe zakresy danych", () => {
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new CzujnikCpu(-1.0, 80.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new CzujnikCpu(101.0, 80.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new CzujnikRam(4.0, 0.0, 80.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new CzujnikRam(-1.0, 16.0, 80.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new CzujnikRam(18.0, 16.0, 80.0));
});
LabAssert.Test("MonitorSystemu.PoliczAlarmy działa polimorficznie dla różnych list czujników", () => {
    LabAssert.Throws<ArgumentNullException>(() => MonitorSystemu.PoliczAlarmy(null));
    LabAssert.Equal(0, MonitorSystemu.PoliczAlarmy(new List<CzujnikBazowy>()));

    var lista = new List<CzujnikBazowy>
    {
        new CzujnikCpu(45.0, 80.0),
        new CzujnikCpu(92.0, 80.0),
        null,
        new CzujnikRam(15.2, 16.0, 90.0),
        new CzujnikRam(4.0, 16.0, 90.0)
    };
    LabAssert.Equal(2, MonitorSystemu.PoliczAlarmy(lista));
});
LabAssert.Test("MonitorSystemu.ResetujKalibrowalne używa interfejsu IKalibrowalny i zeruje tylko zgodne czujniki", () => {
    LabAssert.Throws<ArgumentNullException>(() => MonitorSystemu.ResetujKalibrowalne(null));

    var cpu1 = new CzujnikCpu(95.0, 80.0);
    var cpu2 = new CzujnikCpu(50.0, 80.0);
    var ram = new CzujnikRam(15.0, 16.0, 80.0);
    var lista = new List<CzujnikBazowy> { cpu1, null, ram, cpu2 };

    int zresetowane = MonitorSystemu.ResetujKalibrowalne(lista);
    LabAssert.Equal(2, zresetowane);
    LabAssert.Equal(0.0, cpu1.OdczytajProcent());
    LabAssert.Equal(0.0, cpu2.OdczytajProcent());
    LabAssert.False(cpu1.CzyAlarm());
    LabAssert.True(ram.CzyAlarm());
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy wybrać klasę abstrakcyjną zamiast interfejsu?</strong> Wybierz `abstract class`, gdy pokrewne typy współdzielą pola i walidację w konstruktorze (`: base(...)`); wybierz `interface`, gdy różne, niepowiązane klasy muszą spełniać wspólny kontrakt.
- <strong>Jak zagwarantować polimorfizm w pętli?</strong> Oznacz metodę w klasie bazowej jako `virtual` lub `abstract`, a w pochodnej jako `override`; brak `override` ukrywa metodę i powoduje, że referencja bazowa wywoła starą wersję.
- <strong>Jak bezpiecznie sprawdzić dodatkowy interfejs w kolekcji bazowej?</strong> Użyj `as` ze sprawdzeniem `!= null` albo operatora `is`, zamiast ryzykownego rzutowania w nawiasach, które rzuca `**_InvalidCastException_**`.
- <strong>Kiedy stosować kompozycję zamiast dziedziczenia?</strong> Zawsze, gdy między obiektami zachodzi relacja „posiada” (np. samochód posiada silnik), a nie „jest rodzajem”; dodaj `sealed`, gdy klasa nie jest projektowana do dziedziczenia.
