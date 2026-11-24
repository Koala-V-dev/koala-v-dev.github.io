# Klasy, obiekty, konstruktory i słowo this

Wyobraź sobie kod serwera gry, który przechowuje dane graczy w trzech osobnych tablicach: *nicki*, *hp* oraz *poziomy*. Gracz spod indeksu `2` ma swój nick w `nicki[2]`, punkty życia w `hp[2]` i poziom w `poziomy[2]`. Wystarczy jedno sortowanie wyników według *hp* albo usunięcie jednego gracza bez zaktualizowania trzeciej tablicy, aby dane się rozjechały. Nagle inny użytkownik przejmuje cudzy poziom i cudze punkty życia.

Ten sam problem pojawia się w monitorze procesów Windows, gdzie każdy proces ma identyfikator PID, nazwę i zużycie pamięci RAM. **Programowanie Obiektowe (OOP)** rozwiązuje ten bałagan u źródła. Zamiast rozrzucać dane po wielu tablicach, łączysz je razem z metodami w jeden spójny typ zwany **klasą** (`class`).

Klasa jest projektem technicznym, a nie gotowym egzemplarzem. Dopiero operator **`new`** tworzy na jej podstawie konkretny **obiekt** (instancję) w pamięci RAM. Zobacz najprostszy przykład takiej definicji:

```csharp
public class Gracz
{
    public string Nick;
    public int Hp;
}

// Użycie w Main:
Gracz ada = new Gracz();
ada.Nick = "Ada";
ada.Hp = 100;

Gracz jan = new Gracz();
jan.Nick = "Jan";
jan.Hp = 80;
```

Teraz wystarczy jedna tablica `Gracz[]` albo lista `List<Gracz>`. Gdy przestawiasz obiekt *ada*, jego *Nick* i *Hp* zawsze podróżują razem jako jedna całość.

---

## 🏗️ Jeden kod metod i wiele zestawów pól

Częste błędne założenie mówi, że 1000 obiektów klasy `Gracz` zajmuje miejsce na 1000 kopii jej metod. W środowisku .NET kod każdej metody istnieje w pamięci **tylko jeden raz**. Każdy obiekt utworzony przez `new` dostaje natomiast własny, niezależny zestaw pól na swoje dane.

Skoro wszystkie obiekty współdzielą jedną definicję metody `OtrzymajObrazenia`, skąd metoda wie, czy zmniejszyć *Hp* obiektu *ada*, czy obiektu *jan*? Kompilator przekazuje jej adres konkretnego obiektu jako ukryty pierwszy parametr o nazwie _**this**_. Gdy wywołujesz `ada.OtrzymajObrazenia(20)`, wewnątrz metody słowo `this` wskazuje dokładnie na obiekt *ada*.

To wyjaśnia różnicę między składnikiem instancyjnym a składnikiem **`static`**:

- **Metoda lub właściwość instancyjna**: należy do pojedynczego obiektu i otrzymuje ukryte _**this**_. Odczytuje i zmienia pola konkretnej instancji.
- **Metoda lub właściwość `static`**: należy do samej klasy, a nie do konkretnego obiektu. Nie otrzymuje parametru _**this**_, więc nie widzi pól pojedynczego gracza. Świetnie sprawdza się jako wspólny licznik (na przykład `Gracz.LiczbaGraczy`) lub funkcja pomocnicza.

---

## 🛡️ Pola private, właściwości i modyfikator readonly

Nasz pierwszy przykład z publicznymi polami `public int Hp;` ma poważną wadę. Dowolna linia kodu w całym programie może wpisać `ada.Hp = -999;`, niszcząc zasady gry. Aby ochronić stan obiektu, stosujemy **hermetyzację**: ukrywamy surowe dane przed bezpośrednim zapisem z zewnątrz.

W C# masz cztery podstawowe narzędzia do projektowania stanu klasy:

| Konstrukcja w klasie | Dostęp z zewnątrz | Kiedy jej używać? |
| --- | --- | --- |
| `private int _maksHp;` | Brak (tylko wewnątrz klasy) | Wewnętrzne dane pomocnicze, o których reszta programu nie musi wiedzieć |
| `public string Nick { get; set; }` | Odczyt i zapis | Gdy każda wartość jest dozwolona i nie wymaga reguł walidacji |
| `public int Hp { get; private set; }` | Tylko odczyt (zapis tylko w klasie) | Gdy stan może się zmieniać wyłącznie przez metody pilnujące zasad (np. `OtrzymajObrazenia`) |
| `public bool CzyZywy { get { return Hp > 0; } }` | Tylko odczyt (bez pola w RAM) | **Właściwość wyliczana**: wynik liczony na bieżąco z innych pól przy każdym odczycie |

Zwróć uwagę na czwarty wiersz tabeli. **Właściwość wyliczana** ma wyłącznie blok `get` (bez `set`) i nie przechowuje osobnej zmiennej w pamięci. Gdy zmieni się *Hp*, właściwość `CzyZywy` natychmiast zwróci aktualną odpowiedź `true` lub `false`, bez ryzyka nieaktualnych danych.

Jeśli jakieś pole ma zostać ustawione raz przy narodzinach obiektu i nigdy więcej się nie zmienić (nawet wewnątrz metod tej samej klasy), oznacz je modyfikatorem **`readonly`**:

```csharp
public class Konto
{
    private readonly int _idKonta;
    public decimal Saldo { get; private set; }
    public bool CzyNaPlusie { get { return Saldo > 0; } }

    public Konto(int idKonta, decimal saldoStartowe)
    {
        _idKonta = idKonta;
        Saldo = saldoStartowe;
    }
}
```

Próba ponownego przypisania do pola `_idKonta` w dowolnej metodzie poza konstruktorem zakończy się **_błędem kompilacji_**. Dzięki temu kompilator sam pilnuje, że identyfikator obiektu pozostanie stały przez cały czas jego życia.

<data-gate>
<data-connection-matcher title="Dopasuj element klasy C# do jego roli w programie">
    <item left="private int _tajnyKlucz;" right="Ukrywa pole całkowicie przed kodem spoza klasy"></item>
    <item left="public int Hp { get; private set; }" right="Pozwala na odczyt z zewnątrz, ale blokuje zapis poza metodami klasy"></item>
    <item left="public int Brakuje { get { return 100 - Hp; } }" right="Wylicza wynik na bieżąco przy odczycie bez tworzenia osobnego pola"></item>
    <item left="public static int LiczbaObiektow" right="Przechowuje jedną wspólną wartość dla całej klasy zamiast osobnej kopii w obiektach"></item>
    <item left="this.hp = hp;" right="Rozstrzyga konflikt nazw między polem obiektu a parametrem konstruktora"></item>
</data-connection-matcher>
</data-gate>

---

## 🔧 Konstruktory, konflikt nazw i łańcuch this

**Konstruktor** to specjalna metoda uruchamiana automatycznie w chwili wywołania operatora `new`. Nosi dokładnie taką samą nazwę jak klasa i nie ma typu zwracanego (nawet `void`). Jego zadaniem jest zbudowanie obiektu w poprawnym, gotowym do pracy stanie.

### 🔹 Znikający konstruktor domyślny i konflikt nazw

Jeśli w klasie nie napiszesz żadnego konstruktora, kompilator sam wygeneruje pusty **konstruktor bezparametrowy** (`public Gracz() { }`). W chwili, gdy dopiszesz własny konstruktor z parametrami, ten automatyczny konstruktor **znika**.

> [!IMPORTANT]
> Po zdefiniowaniu własnego konstruktora `Gracz(string nick, int hp)` wywołanie `new Gracz()` przestaje się kompilować. Jeśli klasa nadal potrzebuje wersji bez parametrów, musisz dopisać ją jawnie.

Wewnątrz konstruktora często nadajemy parametrom takie same nazwy jak polom klasy. Zobacz, co dzieje się bez użycia słowa `this`:

```csharp
public class Bohater
{
    private int hp;

    public Bohater(int hp)
    {
        hp = hp;      // BŁĄD: przypisuje parametr do samego siebie! Pole obiektu nadal ma 0.
        this.hp = hp; // POPRAWNIE: lewa strona to pole obiektu, prawa to parametr.
    }
}
```

> [!WARNING]
> Zapis `hp = hp;` kompiluje się bez błędu, ale tworzy **_cichy defekt_**: pole obiektu pozostaje wyzerowane. Stosuj `this.hp = hp;` albo nazewnictwo odróżniające pole (np. `_hp` lub właściwość `Hp` wielką literą).

### 🔹 Dlaczego konstruktor rzuca wyjątki i jak działa łańcuch konstruktorów

Konstruktor nie może zwrócić `false`, gdy dostanie pusty nick albo ujemne punkty życia. Gdyby po cichu zignorował błędne dane, program dostałby do ręki uszkodzony obiekt, który później wywołałby awarię w losowym miejscu. Dlatego konstruktor pilnuje **niezmiennika klasy** (zestawu reguł zawsze prawdziwych dla obiektu) i natychmiast rzuca **_ArgumentException_** albo **_ArgumentOutOfRangeException_**.

Często chcemy tworzyć obiekt na kilka sposobów: raz podając wszystkie dane, a innym razem korzystając z wartości domyślnych. Zamiast kopiować warunki `if` do każdego konstruktora, łączymy je składnią **`: this(...)`**:

```csharp
using System;
using System.Globalization;

public class Gracz
{
    public string Nick { get; private set; }
    public int Hp { get; private set; }
    public int MaksHp { get; private set; }
    public int BrakujaceHp { get { return MaksHp - Hp; } }

    public static int LiczbaGraczy { get; private set; }

    // 1. Konstruktor główny: jedyne miejsce z walidacją i inkrementacją licznika
    public Gracz(string nick, int startoweHp)
    {
        if (string.IsNullOrWhiteSpace(nick))
            throw new ArgumentException("Nick gracza nie moze byc pusty.");
        if (startoweHp <= 0)
            throw new ArgumentOutOfRangeException("startoweHp");

        Nick = nick.Trim();
        Hp = startoweHp;
        MaksHp = startoweHp;
        LiczbaGraczy++;
    }

    // 2. Konstruktor skrócony: deleguje pracę do konstruktora głównego
    public Gracz(string nick) : this(nick, 100)
    {
    }

    public void OtrzymajObrazenia(int ile)
    {
        if (ile < 0)
            throw new ArgumentOutOfRangeException("ile");

        Hp = Math.Max(0, Hp - ile);
    }

    public override string ToString()
    {
        return string.Format(CultureInfo.InvariantCulture, "{0} ({1}/{2} HP)", Nick, Hp, MaksHp);
    }
}
```

Zwróć uwagę na kolejność zdarzeń przy wywołaniu `new Gracz("Ada")`. Najpierw uruchamia się konstruktor główny wskazany po `: this("Ada", 100)`, a dopiero po jego zakończeniu wykonuje się ciało konstruktora skróconego. Jeśli walidacja rzuci wyjątek w konstruktorze głównym, instrukcja `LiczbaGraczy++` na jego końcu w ogóle się nie wykona.

<data-gate>
<data-sortable-list title="Ułóż kolejność 4 kroków przy wywołaniu new Gracz(&quot;Ada&quot;)">
  <item data-correct="3">Konstruktor główny sprawdza argumenty, ustawia pola Nick, Hp, MaksHp i zwiększa LiczbaGraczy</item>
  <item data-correct="1">Program wywołuje przeciążony konstruktor skrócony Gracz(&quot;Ada&quot;)</item>
  <item data-correct="4">Wykonuje się ciało konstruktora skróconego, a operator new zwraca adres gotowego obiektu</item>
  <item data-correct="2">Mechanizm : this(&quot;Ada&quot;, 100) przekazuje sterowanie do konstruktora głównego przed uruchomieniem ciała skróconego</item>
</data-sortable-list>
</data-gate>

---

## 🏷️ Dziedziczenie z System.Object i metoda ToString

Każda klasa, którą napiszesz w C#, dziedziczy automatycznie po wspólnym typie bazowym _**System.Object**_. Oznacza to, że każdy obiekt od razu posiada gotową metodę `ToString()`, wywoływaną niejawnie przez `Console.WriteLine(gracz)` oraz w oknie debuggera.

Domyślna wersja `ToString()` z _**System.Object**_ nie zna pól Twojej klasy, więc wypisuje jedynie samą nazwę typu (na przykład `"Gracz"`). Dopisując `public override string ToString()`, zastępujesz to domyślne zachowanie czytelnym opisem obiektu.

Gdy w `ToString()` formatujesz liczby zmiennoprzecinkowe (na przykład zużycie pamięci w MB), polska wersja Windows wstawi przecinek (`842,5`), a angielska kropkę (`842.5`). Przekazując **`CultureInfo.InvariantCulture`** z przestrzeni nazw `System.Globalization`, gwarantujesz identyczny zapis z kropką na każdym komputerze:

```csharp
string czas = string.Format(CultureInfo.InvariantCulture, "{0:F1} s", 12.46); // zawsze "12.5 s"
```

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Układ obiektu na stercie CLR, padding w C++ i C# oraz rejestr RCX</span>
<span class="deep-dive-badge">PAMIĘĆ CLR · X86-64 · C++</span>
</summary>
<div class="deep-dive-content">

<h4>1. Układ obiektu klasy na 64-bitowej stercie CLR</h4>

Każdy obiekt klasy na 64-bitowej stercie CLR przechowuje własne pola oraz dwa 8-bajtowe pola nagłówkowe. Sama referencja obiektu (czyli `this`) wskazuje na `MethodTable*` pod offsetem `+0 B`, natomiast nagłówek synchronizacji leży 8 bajtów przed nią:

| Offset względem `this` | Rozmiar | Nazwa sekcji | Co przechowuje? |
| --- | --- | --- | --- |
| `-8 B` | 8 B | `Object Header` | Indeks bloku synchronizacji (`SyncBlockIndex`) dla `lock`, flagi GC i kod skrótu |
| `+0 B` | 8 B | `MethodTable*` | Wskaźnik na wspólną tablicę metod i metadanych klasy `Gracz` (tu wskazuje `this`) |
| `+8 B` | 8 B | Pole `Nick` | 64-bitowy adres napisu `string` leżącego osobno na stercie |
| `+16 B` | 4 B | Pole `Hp` | Liczba 32-bitowa (`int`) zapisana bezpośrednio wewnątrz obiektu |
| `+20 B` | 4 B | `Padding` | Puste bajty wyrównujące rozmiar obiektu do wielokrotności 8 B (razem 32 B) |

<h4>2. Wyrównanie pamięci (padding) w C++ i w środowisku CLR</h4>

Procesor x86-64 najwydajniej pobiera 8-bajtowe słowa (`long`, wskaźniki) spod adresów podzielnych przez 8. Gdy adres nie jest podzielny przez 8, CPU musi wykonać dwa odczyty z pamięci podręcznej L1 zamiast jednego. Dlatego kompilatory wstawiają niewidoczne bajty wypełniające zwane **paddingiem**.

W języku **C++** standard zabrania kompilatorowi przestawiać kolejności zadeklarowanych pól. Zobacz różnicę dla dwóch pozornie identycznych struktur:

```cpp
struct ZlyUklad {
    bool a;      // offset 0 (1 B) + 7 B paddingu!
    long long b; // offset 8 (8 B)
    bool c;      // offset 16 (1 B) + 7 B paddingu!
};               // sizeof(ZlyUklad) == 24 bajty!

struct DobryUklad {
    long long b; // offset 0 (8 B)
    bool a;      // offset 8 (1 B)
    bool c;      // offset 9 (1 B) + 6 B paddingu
};               // sizeof(DobryUklad) == 16 bajtów!
```

Przy tablicy 10 milionów elementów różnica między 24 B a 16 B to aż **_80 MB zmarnowanego RAM_** oraz znacznie gorsze wykorzystanie linii cache L1 (64 B).

W **C#** środowisko CLR radzi sobie z tym sprytniej:
- Dla klas (`class`) domyślny jest układ `[StructLayout(LayoutKind.Auto)]`. Ładowacz klas ma prawo **automatycznie przetasować kolejność pól** w pamięci, aby ograniczyć straty na padding.
- Dla struktur (`struct`) domyślny jest układ `[StructLayout(LayoutKind.Sequential)]`, który zachowuje kolejność dokładnie jak w C++ (jest to niezbędne przy wywołaniach Win32 API przez P/Invoke).
- Minimalny rozmiar pustego obiektu klasy na 64-bitowej stercie CLR to zawsze **24 bajty**: 8 B `Object Header`, 8 B `MethodTable*` oraz minimum 8 B przestrzeni na pola.

<h4>3. Jak procesor x86-64 widzi słowo kluczowe this</h4>

W konwencji wywołań Microsoft x64 (Windows ABI) pierwsze cztery argumenty całkowite lub wskaźnikowe trafiają do rejestrów `RCX`, `RDX`, `R8`, `R9`. Dla każdej metody instancyjnej w C# i C++ ukryty wskaźnik `this` zajmuje zawsze pierwszy rejestr **`RCX`**, a jawne argumenty przesuwają się dalej:

```asm
; Wywołanie: gracz.OtrzymajObrazenia(20);
mov rcx, [rbp-8]             ; 1. ukryty parametr: adres obiektu (this) -> RCX
mov edx, 20                  ; 2. jawny parametr: ile = 20 -> EDX
call Gracz::OtrzymajObrazenia
```

Wewnątrz metody odczyt pola `this.Hp` to pojedyncza instrukcja z przesunięciem względem rejestru bazowego `RCX`: `mov eax, dword ptr [rcx+16]`. Metoda `static` nie dostaje adresu w `RCX`, więc argument `20` trafia bezpośrednio do rejestru `ECX`.

<h4>4. Zasada niezmiennika klasy</h4>

Najważniejszym zadaniem konstruktora nie jest wygoda zapisu, lecz utrzymanie **niezmiennika klasy**: warunku, który musi pozostać prawdziwy przez cały czas życia obiektu. Jeśli konstruktor waliduje argumenty, a modyfikatory `private set` blokują niekontrolowane przypisania z zewnątrz, to obiekt w nielegalnym stanie fizycznie nie może zaistnieć w pamięci. Eliminuje to konieczność powtarzania sprawdzeń `if (gracz.Hp < 0)` w dziesiątkach innych metod.

</div>
</details>

---

## 💻 Zadanie praktyczne w 2 plikach dla klasy ProcesInfo

Przełącz zakładkę w edytorze na **`ProcesInfo.cs`** i zaimplementuj klasę opisującą proces systemu Windows wraz z monitorowaniem jego szczytowego zużycia pamięci oraz globalnego licznika utworzonych obiektów:

1. **Właściwość statyczna `public static int LiczbaUtworzonych { get; private set; }`**:
   - zadeklaruj ją w klasie i zwiększaj o `1` w konstruktorze głównym dopiero po pomyślnej walidacji (błędne wywołanie rzucające wyjątek nie może zwiększać licznika).
2. **Właściwość wyliczana `public double RoznicaOdSzczytuMb`**:
   - zaimplementuj właściwość tylko do odczytu (`get`), która na bieżąco zwraca `SzczytPamieciMb - PamiecMb`.
3. **Konstruktor główny `ProcesInfo(int pid, string nazwa, double pamiecMb)`**:
   - dla `pid < 0` lub `pamiecMb < 0` rzuć **_ArgumentOutOfRangeException_**,
   - dla pustej lub białoznakowej nazwy (`string.IsNullOrWhiteSpace(nazwa)`) rzuć **_ArgumentException_**,
   - przypisz `Pid`, `Nazwa` (po przycięciu spacji metodą `Trim()`), `PamiecMb`, zainicjalizuj `SzczytPamieciMb` wartością `pamiecMb` oraz zwiększ `LiczbaUtworzonych`.
4. **Konstruktor skrócony `ProcesInfo(int pid, string nazwa)`**:
   - zadeklaruj go samodzielnie i deleguj wywołanie przez `: this(pid, nazwa, 0.0)`.
5. **Metoda `ZaktualizujPamiec(double nowaPamiecMb)`**:
   - dla wartości ujemnej rzuć **_ArgumentOutOfRangeException_**,
   - zaktualizuj `PamiecMb`, a jeśli `nowaPamiecMb > SzczytPamieciMb`, zaktualizuj także `SzczytPamieciMb` (niezmiennik: `SzczytPamieciMb >= PamiecMb` jest zawsze prawdziwy).
6. **Metoda `override string ToString()`**:
   - zwróć napis w formacie `"{0} (PID: {1}) - {2:F1} MB"` z użyciem `CultureInfo.InvariantCulture`.

<data-gate>
<data-csharp-lab title="Zadanie: Klasa ProcesInfo, static LiczbaUtworzonych, właściwość wyliczana i łańcuch konstruktorów">
<cs-file name="Program.cs">

```csharp
using System;
using System.Globalization;

class Program
{
    static void Main()
    {
        var chrome = new ProcesInfo(4120, "chrome", 842.5);
        chrome.ZaktualizujPamiec(1024.0);
        chrome.ZaktualizujPamiec(790.0);

        var notepad = new ProcesInfo(1044, "notepad");
        notepad.ZaktualizujPamiec(18.2);

        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "{0} | Szczyt: {1:F1} MB | Roznica od szczytu: {2:F1} MB",
            chrome, chrome.SzczytPamieciMb, chrome.RoznicaOdSzczytuMb));
        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "{0} | Szczyt: {1:F1} MB | Roznica od szczytu: {2:F1} MB",
            notepad, notepad.SzczytPamieciMb, notepad.RoznicaOdSzczytuMb));
        Console.WriteLine("Utworzono obiektow: " + ProcesInfo.LiczbaUtworzonych);
    }
}
```

</cs-file>
<cs-file name="ProcesInfo.cs">

```csharp
using System;
using System.Globalization;

public class ProcesInfo
{
    public static int LiczbaUtworzonych { get; private set; }

    public int Pid { get; private set; }
    public string Nazwa { get; private set; }
    public double PamiecMb { get; private set; }
    public double SzczytPamieciMb { get; private set; }

    public double RoznicaOdSzczytuMb
    {
        get
        {
            // Zwroc roznice miedzy SzczytPamieciMb a PamiecMb
            return 0.0;
        }
    }

    public ProcesInfo(int pid, string nazwa, double pamiecMb)
    {
        // Zwaliduj pid < 0, pamiecMb < 0 (ArgumentOutOfRangeException)
        // oraz nazwe (ArgumentException), przypisz wlasciwosci i zwieksz LiczbaUtworzonych
    }

    // Dopisz przeciazony konstruktor ProcesInfo(int pid, string nazwa) delegujacy przez : this(...)

    public void ZaktualizujPamiec(double nowaPamiecMb)
    {
        // Zwaliduj nowaPamiecMb < 0, zaktualizuj PamiecMb oraz (jesli wieksza) SzczytPamieciMb
    }

    public override string ToString()
    {
        // Zwroc "{Nazwa} (PID: {Pid}) - {PamiecMb:F1} MB" z CultureInfo.InvariantCulture
        return "";
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("Konstruktor główny ustawia pola, przycina nazwę, inicjalizuje SzczytPamieciMb i zwiększa LiczbaUtworzonych", () => {
    int przed = ProcesInfo.LiczbaUtworzonych;

    var p = new ProcesInfo(1200, "  discord  ", 310.5);
    LabAssert.Equal(1200, p.Pid);
    LabAssert.Equal("discord", p.Nazwa);
    LabAssert.Equal(310.5, p.PamiecMb);
    LabAssert.Equal(310.5, p.SzczytPamieciMb);
    LabAssert.Equal(0.0, p.RoznicaOdSzczytuMb);

    var idle = new ProcesInfo(0, "System Idle Process", 0.0);
    LabAssert.Equal(0, idle.Pid);
    LabAssert.Equal(0.0, idle.PamiecMb);
    LabAssert.Equal(0.0, idle.SzczytPamieciMb);
    LabAssert.Equal(przed + 2, ProcesInfo.LiczbaUtworzonych);
});
LabAssert.Test("Błędne argumenty rzucają właściwe wyjątki i nie zwiększają LiczbaUtworzonych", () => {
    int przed = ProcesInfo.LiczbaUtworzonych;

    LabAssert.Throws<ArgumentOutOfRangeException>(() => new ProcesInfo(-1, "x", 10.0));
    LabAssert.Throws<ArgumentException>(() => new ProcesInfo(1, null, 10.0));
    LabAssert.Throws<ArgumentException>(() => new ProcesInfo(1, "   ", 10.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new ProcesInfo(1, "x", -0.1));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new ProcesInfo(-5, "cmd"));
    LabAssert.Throws<ArgumentException>(() => new ProcesInfo(5, "  "));

    LabAssert.Equal(przed, ProcesInfo.LiczbaUtworzonych);
});
LabAssert.Test("Konstruktor skrócony (: this), ZaktualizujPamiec i RoznicaOdSzczytuMb pilnują niezmiennika", () => {
    int przed = ProcesInfo.LiczbaUtworzonych;
    var p = new ProcesInfo(500, "cmd");
    LabAssert.Equal(przed + 1, ProcesInfo.LiczbaUtworzonych);
    LabAssert.Equal(0.0, p.PamiecMb);
    LabAssert.Equal(0.0, p.SzczytPamieciMb);
    LabAssert.Equal(0.0, p.RoznicaOdSzczytuMb);

    p.ZaktualizujPamiec(48.5);
    LabAssert.Equal(48.5, p.PamiecMb);
    LabAssert.Equal(48.5, p.SzczytPamieciMb);
    LabAssert.Equal(0.0, p.RoznicaOdSzczytuMb);

    p.ZaktualizujPamiec(12.5);
    LabAssert.Equal(12.5, p.PamiecMb);
    LabAssert.Equal(48.5, p.SzczytPamieciMb);
    LabAssert.Equal(36.0, Math.Round(p.RoznicaOdSzczytuMb, 4));

    p.ZaktualizujPamiec(0.0);
    LabAssert.Equal(0.0, p.PamiecMb);
    LabAssert.Equal(48.5, p.SzczytPamieciMb);
    LabAssert.Equal(48.5, Math.Round(p.RoznicaOdSzczytuMb, 4));

    LabAssert.Throws<ArgumentOutOfRangeException>(() => p.ZaktualizujPamiec(-1.0));
});
LabAssert.Test("ToString zwraca format z kropką dziesiętną (InvariantCulture)", () => {
    var p1 = new ProcesInfo(4120, "chrome", 842.56);
    LabAssert.Equal("chrome (PID: 4120) - 842.6 MB", p1.ToString());
    var p2 = new ProcesInfo(4, "System");
    LabAssert.Equal("System (PID: 4) - 0.0 MB", p2.ToString());
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy zastąpić równoległe tablice klasą?</strong> Zawsze wtedy, gdy kilka wartości (np. nick, HP, poziom) opisuje jeden byt i musi podróżować razem jako spójny obiekt.
- <strong>Jak chronić stan obiektu przed uszkodzeniem?</strong> Używaj `{ get; private set; }` oraz `readonly` dla niezmiennych pól, a każdą zmianę przepuszczaj przez metodę z walidacją.
- <strong>Jak projektować konstruktory bez duplikacji kodu?</strong> Waliduj argumenty i rzucaj wyjątki wyłącznie w konstruktorze głównym, a pozostałe wersje podpinaj przez `: this(...)`.
- <strong>Kiedy użyć właściwości wyliczanej zamiast zwykłego pola?</strong> Gdy wartość wynika bezpośrednio z innych pól obiektu (jak `RoznicaOdSzczytuMb`) i powinna być zawsze aktualna bez ręcznego przeliczania.
- <strong>Dlaczego warto nadpisywać ToString() z CultureInfo.InvariantCulture?</strong> Aby każdy obiekt wypisywał czytelny opis w logach i debuggerze z przewidywalną kropką dziesiętną niezależnie od języka systemu Windows.
