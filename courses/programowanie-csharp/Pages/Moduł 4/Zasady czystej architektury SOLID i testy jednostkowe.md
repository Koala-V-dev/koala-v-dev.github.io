# Zasady czystej architektury SOLID i testy jednostkowe

Napisać działający skrypt na 50 linijek potrafi niemal każdy. Problem pojawia się wtedy, gdy projekt rośnie do kilkunastu plików i trzeba dodać kolejną funkcję, na przykład eksport raportu do JSON.

W źle zaprojektowanym kodzie dopisanie nowego formatu zmusza do edycji centralnej klasy, która już działała. Jedna pomyłka psuje istniejący eksport CSV, a sprawdzenie poprawki wymaga ręcznego uruchamiania programu i zaglądania w pliki na dysku.

Zasady _**SOLID**_ i **testy jednostkowe** rozwiązują ten problem u źródła. Pozwalają rozbudowywać aplikację przez dokładanie nowych klas oraz sprawdzać logikę w ułamku milisekundy bez dotykania dysku czy zegara systemowego.

---

## 🧱 Studium przypadku: monolit nie do przetestowania

Spójrz na klasę `GeneratorRaportu`, która na pierwszy rzut oka wygląda zupełnie niewinnie. Zbiera jednak trzy poważne wady architektoniczne w jednym miejscu:

```csharp
using System;
using System.Collections.Generic;
using System.IO;

public class GeneratorRaportu
{
    public void Zapisz(List<string> wpisy, string format, string sciezka)
    {
        string znacznikCzasu = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
        string tresc;

        switch (format)
        {
            case "CSV":
                tresc = znacznikCzasu + "\n" + string.Join(";", wpisy);
                break;
            case "TXT":
                tresc = znacznikCzasu + "\n" + string.Join("\n", wpisy);
                break;
            default:
                throw new ArgumentException("Nieznany format: " + format);
        }

        File.WriteAllText(sciezka, tresc);
    }
}
```

Spróbuj napisać automatyczny test dla metody `Zapisz`. Natychmiast zderzysz się z trzema barierami:

- **Brak możliwości rozszerzania bez edycji:** dodanie formatu JSON wymusza dopisanie kolejnej gałęzi `case` w działającej metodzie `Zapisz`.
- **Niedeterministyczny czas:** wywołanie `DateTime.Now` sprawia, że wynik zmienia się co minutę. Test nie może porównać wygenerowanego tekstu ze stałym wzorcem.
- **Twardy zapis na dysk:** metoda `File.WriteAllText` tworzy prawdziwe pliki przy każdym teście. Błąd uprawnień albo brak miejsca na dysku powoduje **_fałszywą awarię testu_**, mimo że sama logika formatowania jest poprawna.

### 🔧 Refaktoryzacja na IRaportExporter i IZegar

Aby rozbić ten **_monolit nie do przetestowania_**, oddzielamy trzy odpowiedzialności: formatowanie tekstu, odczyt aktualnego czasu oraz samo złożenie raportu.

Zamiast wywoływać `DateTime.Now` i instrukcję `switch` na sztywno, wprowadzamy dwa wąskie interfejsy: `IRaportExporter` oraz `IZegar`. Przekazujemy je do klasy przez konstruktor (**Constructor Injection**):

```csharp
using System;
using System.Collections.Generic;

public interface IRaportExporter
{
    string Formatuj(List<string> wpisy);
}

public interface IZegar
{
    DateTime PobierzCzas();
}

public class ZegarSystemowy : IZegar
{
    public DateTime PobierzCzas()
    {
        return DateTime.Now;
    }
}

public class KreatorRaportu
{
    private readonly IRaportExporter _exporter;
    private readonly IZegar _zegar;

    public KreatorRaportu(IRaportExporter exporter, IZegar zegar)
    {
        if (exporter == null)
            throw new ArgumentNullException("exporter");
        if (zegar == null)
            throw new ArgumentNullException("zegar");

        _exporter = exporter;
        _zegar = zegar;
    }

    public string Zbuduj(List<string> wpisy)
    {
        string naglowek = _zegar.PobierzCzas().ToString("yyyy-MM-dd HH:mm");
        string tresc = _exporter.Formatuj(wpisy);
        return naglowek + "\n" + tresc;
    }
}
```

Zauważ, jak diametralnie zmieniła się sytuacja. Klasa `KreatorRaportu` nie dotyka dysku, nie zawiera instrukcji `switch` i nie pyta systemu operacyjnego o godzinę.

W produkcji podajesz jej `ZegarSystemowy` oraz wybrany eksporter. W teście podstawiasz zegar zwracający stałą datę i lekką atrapę eksportera, otrzymując stuprocentową powtarzalność.

---

## 🏛️ Pięć zasad SOLID w codziennym kodzie

Akronim _**SOLID**_ zbiera pięć reguł projektowania klas i interfejsów. Każda z nich chroni inny fragment architektury przed sztywnością i przypadkowymi błędami:

| Zasada | Znaczenie | Objaw złamania | Poprawne rozwiązanie |
| --- | --- | --- | --- |
| **SRP** (Single Responsibility) | Jedna klasa ma jeden powód do zmiany | Klasa `Gra` liczy punkty, rysuje ekran i zapisuje pliki | Rozdzielenie na `SilnikWyniku`, `Renderer` i `ZapisStanu` |
| **OCP** (Open/Closed) | Otwarta na rozszerzenia, zamknięta na modyfikacje | Długi łańcuch `switch` dla każdego nowego formatu | Nowy format jako osobna klasa implementująca interfejs |
| **LSP** (Liskov Substitution) | Podtyp bezpiecznie zastępuje typ bazowy | Implementacja rzuca `NotSupportedException` na metodzie z interfejsu | Podział kontraktu tak, by każda klasa spełniała wszystkie metody |
| **ISP** (Interface Segregation) | Wąskie, wyspecjalizowane interfejsy | Klasa musi mieć puste metody, których nie potrzebuje | Rozbicie dużego interfejsu na mniejsze role |
| **DIP** (Dependency Inversion) | Zależność od abstrakcji, nie od konkretnej klasy | `new ZegarSystemowy()` wpisane na sztywno w konstruktorze | Wstrzyknięcie `IZegar` jako parametru konstruktora |

### 🔀 Złamanie i naprawa LSP oraz ISP

Zasady **LSP** oraz **ISP** często idą w parze, ponieważ zbyt szeroki interfejs popycha programistę do łamania kontraktu. Spójrz na magazyn danych, w którym jedna z klas obsługuje wyłącznie odczyt:

```csharp
// ZLAMANIE LSP: magazyn tylko do odczytu udaje pelny magazyn
public interface IMagazyn
{
    string Wczytaj(string klucz);
    void Zapisz(string klucz, string wartosc);
}

public class MagazynTylkoDoOdczytu : IMagazyn
{
    public string Wczytaj(string klucz) { return "dane"; }

    public void Zapisz(string klucz, string wartosc)
    {
        // Zaskakujacy wyjatek dla kodu oczekujacego IMagazyn!
        throw new NotSupportedException("Ten magazyn nie pozwala na zapis.");
    }
}
```

Każda funkcja przyjmująca `IMagazyn` zakłada, że może wywołać `Zapisz`. Podstawienie `MagazynTylkoDoOdczytu` kończy się w trakcie działania aplikacji błędem **_NotSupportedException_**.

Naprawą jest rozdzielenie kontraktu zgodnie z **ISP** na dwa osobne interfejsy:

```csharp
// NAPRAWA ISP + LSP: kazda klasa implementuje tylko to, co obsluguje
public interface IOdczytMagazynu
{
    string Wczytaj(string klucz);
}

public interface IZapisMagazynu
{
    void Zapisz(string klucz, string wartosc);
}

public class MagazynKonfiguracji : IOdczytMagazynu
{
    public string Wczytaj(string klucz) { return "dane"; }
}

public class MagazynPlikowy : IOdczytMagazynu, IZapisMagazynu
{
    public string Wczytaj(string klucz) { return "dane"; }
    public void Zapisz(string klucz, string wartosc) { /* zapis na dysk */ }
}
```

Teraz kompilator sam pilnuje poprawności. Nikt nie przekaże `MagazynKonfiguracji` do metody wymagającej `IZapisMagazynu`, więc niespodziewany wyjątek w ogóle nie może wystąpić.

### 🎮 Wzorzec Strategia i walidacja w konstruktorze

Połączenie **OCP** i **DIP** tworzy wzorzec projektowy **Strategia**. Klasa nadrzędna deleguje zmienny algorytm do obiektu przekazanego przez interfejs:

```csharp
public interface IStrategiaPunktacji
{
    int Oblicz(int bazaPunktow, int seriaTrafien);
}

public class PunktacjaStandardowa : IStrategiaPunktacji
{
    public int Oblicz(int bazaPunktow, int seriaTrafien)
    {
        return bazaPunktow;
    }
}

public class PunktacjaCombo : IStrategiaPunktacji
{
    public int Oblicz(int bazaPunktow, int seriaTrafien)
    {
        return bazaPunktow * (seriaTrafien > 0 ? seriaTrafien : 1);
    }
}

public class SilnikWyniku
{
    private readonly IStrategiaPunktacji _strategia;

    public SilnikWyniku(IStrategiaPunktacji strategia)
    {
        if (strategia == null)
            throw new ArgumentNullException("strategia");
        _strategia = strategia;
    }

    public int Nalicz(int baza, int seria)
    {
        return _strategia.Oblicz(baza, seria);
    }
}
```

> [!IMPORTANT]
> Zawsze sprawdzaj zależności pod kątem `null` już w konstruktorze i rzucaj `ArgumentNullException` (reguła **Fail Fast**). Jeśli pominiesz tę kontrolę, uszkodzony obiekt powstanie po cichu, a program wybuchnie dopiero później z niejasnym błędem **_NullReferenceException_** w zupełnie innym miejscu kodu.

<data-gate>
<data-connection-matcher title="Dopasuj błąd architektoniczny do złamanej zasady SOLID">
  <item left="Klasa Zamowienie jednocześnie liczy podatek VAT, generuje PDF i wysyła e-mail" right="SRP (Single Responsibility): klasa ma trzy różne powody do zmiany"></item>
  <item left="Dodanie płatności BLIK wymaga dopisania kolejnego else if w klasie Kasa" right="OCP (Open/Closed): kod trzeba modyfikować zamiast go rozszerzać"></item>
  <item left="Klasa PlikTylkoDoOdczytu implementuje IPlik i rzuca NotSupportedException w metodzie Zapisz" right="LSP (Liskov Substitution): podtyp łamie kontrakt oczekiwanego typu bazowego"></item>
  <item left="Interfejs IUrzadzenieBiura wymusza na prostej drukarce pustą metodę Skanuj i Faksuj" right="ISP (Interface Segregation): zbyt szeroki interfejs zmusza do zbędnych metod"></item>
  <item left="SerwisPowiadomien tworzy na sztywno new KlientSmtp() wewnątrz własnego konstruktora" right="DIP (Dependency Inversion): moduł zależy od konkretnej klasy zamiast abstrakcji"></item>
</data-connection-matcher>
</data-gate>

---

## 🧪 Testy jednostkowe AAA, atrapy i realny xUnit

Każdy czytelny test jednostkowy dzieli się na trzy stałe sekcje zwane wzorcem **AAA** (Arrange, Act, Assert). Taka struktura sprawia, że po miesiącu od razu widzisz, co przygotowano, co uruchomiono i jaki warunek sprawdzono:

```csharp
// 1. Arrange: przygotuj zaleznosci i dane wejsciowe
var silnik = new SilnikWyniku(new PunktacjaCombo());

// 2. Act: wywolaj dokladnie jedna testowana operacje
int punkty = silnik.Nalicz(100, 3);

// 3. Assert: zweryfikuj wynik
LabAssert.Equal(300, punkty);
```

Dobry zestaw testów sprawdza nie tylko typową ścieżkę poprawną (Happy Path), lecz przede wszystkim **przypadki brzegowe** (Edge Cases): wartość `null`, pustą listę, zero, pojedynczy element oraz znaki specjalne.

### 🎭 Trzy rodzaje atrap testowych: Stub, Spy i Fake

Dzięki **DIP** możesz podstawić w miejsce bazy danych, zegara albo eksportera lekki obiekt testowy (**Test Double**). W praktyce najczęściej używasz trzech rodzajów atrap:

| Rodzaj atrapy | Co robi w teście? | Konkretny przykład |
| --- | --- | --- |
| **Stub** | Zwraca sztywną, z góry zaprogramowaną wartość | `StubZegar : IZegar` zawsze zwracający `2026-01-15 10:00` |
| **Spy** | Zapisuje historię wywołań i przekazanych argumentów | `SpyPowiadomien` zliczający *LiczbaWyslan* i pamiętający treść |
| **Fake** | Działa jak uproszczona wersja produkcyjna w pamięci | `InMemoryRepozytorium` oparte na `Dictionary<int, T>` zamiast SQL |

Spójrz na krótki przykład atrapy typu **Spy** dla serwisu powiadomień. Pozwala ona sprawdzić, czy testowany kod faktycznie wywołał zależność dokładną liczbę razy:

```csharp
public interface IPowiadomienia
{
    void Wyslij(string tresc);
}

public class SpyPowiadomien : IPowiadomienia
{
    public int LiczbaWyslan { get; private set; }
    public string OstatniaWiadomosc { get; private set; }

    public void Wyslij(string tresc)
    {
        LiczbaWyslan++;
        OstatniaWiadomosc = tresc;
    }
}
```

Po uruchomieniu testowanego serwisu sprawdzasz w sekcji **Assert**, że `spy.LiczbaWyslan` wynosi dokładnie `1`, a `spy.OstatniaWiadomosc` zawiera oczekiwany komunikat.

### 🧰 Jak LabAssert przekłada się na realny xUnit

Na tej platformie używasz lekkiej klasy `LabAssert`, która nie wymaga zewnętrznych paczek NuGet. Jej składnia została jednak wzorowana bezpośrednio na bibliotece **xUnit**, czyli standardzie w komercyjnych projektach .NET.

Tak samo wyglądałby test `SilnikWyniku` w prawdziwym projekcie testowym xUnit:

```csharp
using System;
using Xunit;

public class SilnikWynikuTests
{
    [Fact]
    public void Nalicz_DlaPunktacjiCombo_MnozyBazePrzezSerie()
    {
        // Arrange
        var silnik = new SilnikWyniku(new PunktacjaCombo());

        // Act
        int punkty = silnik.Nalicz(100, 3);

        // Assert
        Assert.Equal(300, punkty);
    }

    [Fact]
    public void Konstruktor_DlaNullStrategii_RzucaArgumentNullException()
    {
        Assert.Throws<ArgumentNullException>(() => new SilnikWyniku(null));
    }
}
```

Atrybut `[Fact]` oznacza pojedynczy test, a metody `Assert.Equal` i `Assert.Throws<T>` działają identycznie jak `LabAssert.Equal` oraz `LabAssert.Throws<T>`. Umiejętność pisania testów tutaj przenosisz jeden do jednego do Visual Studio i Ridera.

<data-gate>
<data-sortable-list title="Ułóż etapy testu jednostkowego AAA z użyciem SpyExporter">
  <item data-correct="4">Assert: sprawdzenie zwróconego tekstu oraz licznika spy.LiczbaWywolan == 1</item>
  <item data-correct="1">Arrange: utworzenie instancji SpyExporter i wstrzyknięcie jej do konstruktora RaportSerwis</item>
  <item data-correct="3">Act: pojedyncze wywołanie testowanej metody serwis.Eksportuj(dane)</item>
  <item data-correct="5">Assert: weryfikacja, że spy.OstatnieWpisy zawiera dokładnie przekazane elementy</item>
  <item data-correct="2">Arrange: przygotowanie wejściowej listy danych testowych</item>
</data-sortable-list>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Coupling vs Cohesion, przeciążony konstruktor i Mutation Testing</span>
<span class="deep-dive-badge">ARCHITEKTURA · STRYKER.NET · JAKOŚĆ TESTÓW</span>
</summary>
<div class="deep-dive-content">

<h4>1. Sprzężenie (Coupling) kontra Spójność (Cohesion)</h4>

Dobra architektura dąży jednocześnie do dwóch celów: **niskiego sprzężenia** między klasami oraz **wysokiej spójności** wewnątrz każdej klasy.

- **Wysoka spójność** oznacza, że wszystkie pola i metody klasy współpracują nad jednym zadaniem. Jeśli połowa metod klasy używa wyłącznie pola `_bazaDanych`, a druga połowa wyłącznie pola `_klientSmtp`, w jednym pliku ukryte są dwie osobne klasy.
- **Niskie sprzężenie** oznacza, że zmiana formatu pliku albo biblioteki sieciowej w klasie A nie zmusza do poprawek w kilkunastu innych plikach.

<h4>2. Sygnał alarmowy: przeciążony konstruktor (Constructor Over-Injection)</h4>

Wstrzykiwanie zależności przez konstruktor ma cenną zaletę diagnostyczną: czyni wszystkie zależności klasy widocznymi od razu w jednej linijce.

Gdy konstruktor zaczyna przyjmować **_6, 7 albo 9 interfejsów_** (`ILogger`, `IMailer`, `IRepo`, `ICache`, `IParser`, `IExporter`, `IClock`), nie jest to wada **DIP**. To wyraźny sygnał, że klasa złamała **SRP** i robi zbyt wiele rzeczy naraz.

Rozwiązaniem jest rozbicie jej na mniejsze serwisy albo wydzielenie fasady skupiającej spójne operacje.

<h4>3. Testowanie mutacyjne (Mutation Testing) ze Stryker.NET</h4>

Metryka pokrycia kodu testami (Code Coverage) potrafi wprowadzać w błąd. Test, który wywołuje metodę `Formatuj`, ale ma słabą asercję, daje 100% pokrycia i jednocześnie nie wykrywa realnych błędów.

Narzędzia takie jak **Stryker.NET** działają jak automatyczny audytor testów. Modyfikują drzewo składniowe AST Twojego kodu produkcyjnego, tworząc dziesiątki „mutantów”, a następnie dla każdego z nich uruchamiają cały zestaw testów:

```csharp
// Kod oryginalny:
if (wpisy == null || wpisy.Count == 0) return "[]";

// Mutant 1 (zamiana || na &&):
if (wpisy == null && wpisy.Count == 0) return "[]";

// Mutant 2 (zamiana == na !=):
if (wpisy == null || wpisy.Count != 0) return "[]";
```

- Jeśli przynajmniej jeden test nie przejdzie, **mutant został zabity** (testy działają skutecznie).
- Jeśli wszystkie testy nadal świecą na zielono mimo uszkodzonej logiki (na przykład przy Mutancie 1, gdy zabrakło osobnego testu dla pustej listy i osobnego dla `null`), **_mutant przeżył_**.
- Wynik końcowy to **Mutation Score** (procent zabitych mutantów). W projektach produkcyjnych 85% Mutation Score jest znacznie silniejszą gwarancją jakości niż samo 100% pokrycia linii.

</div>
</details>

---

## 💻 Zadanie praktyczne: Strategia eksporterów i własny SpyExporter

> [!WARNING]
> Podczas budowania JSON kolejność escapowania znaków jest krytyczna. Najpierw zamieniaj odwrotny ukośnik `\` na `\\`, a dopiero potem cudzysłów `"` na `\"`. Odwrotna kolejność zamieni `"` w `\"`, a drugi krok dopisze ukośnik i stworzy **_uszkodzony zapis ucieczki_** `\\"`, który psuje składnię JSON.

W zakładce **`Eksportery.cs`** zaimplementuj cztery klasy współpracujące z interfejsem `IRaportExporter`:

1. **`CsvExporter`**:
   - dla *wpisy* równych `null` lub pustej listy zwraca pusty napis `""`,
   - dla niepustej listy łączy elementy średnikiem `;`.
2. **`JsonExporter`**:
   - dla *wpisy* równych `null` lub pustej listy zwraca `"[]"`,
   - dla niepustej listy buduje tablicę JSON bez spacji po przecinkach (na przykład `["chrome","code"]`),
   - bezpiecznie traktuje ewentualny element `null` w liście jak pusty napis oraz escapuje `\` przed `"`.
3. **`RaportSerwis`**:
   - konstruktor przyjmuje `IRaportExporter exporter` i dla `null` rzuca `ArgumentNullException("exporter")`,
   - metoda `Eksportuj(List<string> wpisy)` dla `null` rzuca `ArgumentNullException("wpisy")` bez wywoływania eksportera, a w przeciwnym razie deleguje formatowanie do wstrzykniętej strategii.
4. **`SpyExporter`** (własna atrapa typu **Spy** do testów):
   - udostępnia właściwości `LiczbaWywolan` (`int`, początkowo `0`) oraz `OstatnieWpisy` (`List<string>`, początkowo `null`),
   - w `Formatuj(List<string> wpisy)` zwiększa `LiczbaWywolan` o `1`, zapamiętuje przekazane *wpisy* w `OstatnieWpisy` i zwraca napis `"SPY:"` połączony z liczbą elementów (`0`, jeśli *wpisy* są `null`).

<data-gate>
<data-csharp-lab title="Zadanie: SOLID (DIP + Strategia) i własny SpyExporter">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        var dane = new List<string> { "chrome", "app \"v2\"", "C:\\Tools\\scout.exe" };
        var serwisCsv = new RaportSerwis(new CsvExporter());
        var serwisJson = new RaportSerwis(new JsonExporter());
        var spy = new SpyExporter();
        var serwisSpy = new RaportSerwis(spy);

        Console.WriteLine("CSV:  " + serwisCsv.Eksportuj(dane));
        Console.WriteLine("JSON: " + serwisJson.Eksportuj(dane));
        Console.WriteLine("SPY:  " + serwisSpy.Eksportuj(dane) + " (wywolan: " + spy.LiczbaWywolan + ")");
    }
}
```

</cs-file>
<cs-file name="Eksportery.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

public interface IRaportExporter
{
    string Formatuj(List<string> wpisy);
}

public class CsvExporter : IRaportExporter
{
    public string Formatuj(List<string> wpisy)
    {
        // Dla null lub pustej listy zwroc "", w przeciwnym razie polacz srednikiem
        return "";
    }
}

public class JsonExporter : IRaportExporter
{
    public string Formatuj(List<string> wpisy)
    {
        // Dla null lub pustej listy zwroc "[]"
        // Pamietaj o kolejnosci escapowania: najpierw \ -> \\, potem " -> \"
        return "[]";
    }
}

public class RaportSerwis
{
    private readonly IRaportExporter _exporter;

    public RaportSerwis(IRaportExporter exporter)
    {
        // Zwaliduj null -> ArgumentNullException("exporter")
        _exporter = exporter;
    }

    public string Eksportuj(List<string> wpisy)
    {
        // Zwaliduj wpisy == null -> ArgumentNullException("wpisy"), potem deleguj do _exporter
        return "";
    }
}

public class SpyExporter : IRaportExporter
{
    public int LiczbaWywolan { get; private set; }
    public List<string> OstatnieWpisy { get; private set; }

    public string Formatuj(List<string> wpisy)
    {
        // Zwieksz LiczbaWywolan, zapamietaj wpisy w OstatnieWpisy i zwroc "SPY:<liczba>"
        return "";
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("CsvExporter formatuje wiele elementow, pojedynczy element, pusta liste i null", () => {
    var csv = new CsvExporter();
    LabAssert.Equal("chrome;discord;code", csv.Formatuj(new List<string> { "chrome", "discord", "code" }));
    LabAssert.Equal("solo", csv.Formatuj(new List<string> { "solo" }));
    LabAssert.Equal("", csv.Formatuj(new List<string>()));
    LabAssert.Equal("", csv.Formatuj(null));
});

LabAssert.Test("JsonExporter tworzy tablice JSON i poprawnie escapuje backslashe oraz cudzyslowy", () => {
    var json = new JsonExporter();
    LabAssert.Equal("[]", json.Formatuj(new List<string>()));
    LabAssert.Equal("[]", json.Formatuj(null));
    LabAssert.Equal("[\"chrome\",\"code\"]", json.Formatuj(new List<string> { "chrome", "code" }));

    var specjalne = new List<string> { "app \"v1\"", "C:\\Apps\\run.exe" };
    LabAssert.Equal("[\"app \\\"v1\\\"\",\"C:\\\\Apps\\\\run.exe\"]", json.Formatuj(specjalne));
});

LabAssert.Test("RaportSerwis wstrzykuje strategie (DIP) i waliduje argumenty null", () => {
    LabAssert.Throws<ArgumentNullException>(() => new RaportSerwis(null));

    var serwisCsv = new RaportSerwis(new CsvExporter());
    LabAssert.Equal("a;b", serwisCsv.Eksportuj(new List<string> { "a", "b" }));
    LabAssert.Throws<ArgumentNullException>(() => serwisCsv.Eksportuj(null));
});

LabAssert.Test("SpyExporter zlicza wywolania, zapamietuje wpisy i nie uruchamia sie przy blednym null", () => {
    var spy = new SpyExporter();
    LabAssert.Equal(0, spy.LiczbaWywolan);
    LabAssert.Equal(null, spy.OstatnieWpisy);

    var serwis = new RaportSerwis(spy);
    LabAssert.Throws<ArgumentNullException>(() => serwis.Eksportuj(null));
    LabAssert.Equal(0, spy.LiczbaWywolan);

    var pierwsze = new List<string> { "x", "y", "z" };
    LabAssert.Equal("SPY:3", serwis.Eksportuj(pierwsze));
    LabAssert.Equal(1, spy.LiczbaWywolan);
    LabAssert.Equal(3, spy.OstatnieWpisy.Count);
    LabAssert.Equal("x", spy.OstatnieWpisy[0]);
    LabAssert.Equal("z", spy.OstatnieWpisy[2]);

    var drugie = new List<string> { "solo" };
    LabAssert.Equal("SPY:1", serwis.Eksportuj(drugie));
    LabAssert.Equal(2, spy.LiczbaWywolan);
    LabAssert.Equal(1, spy.OstatnieWpisy.Count);
    LabAssert.Equal("solo", spy.OstatnieWpisy[0]);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy wydzielić interfejs strategii?</strong> Gdy dodanie kolejnego wariantu algorytmu (na przykład formatu eksportu) wymagałoby dopisania nowej gałęzi w `switch` lub `if / else if`.
- <strong>Kiedy podzielić interfejs na mniejsze?</strong> Gdy choć jedna klasa implementująca musi rzucać `NotSupportedException` albo zostawiać puste metody, bo łamie to jednocześnie ISP i LSP.
- <strong>Kiedy wstrzykiwać zależność przez konstruktor?</strong> Zawsze wtedy, gdy klasa korzysta z efektów ubocznych (zegar, dysk, sieć) lub wymiennej logiki, którą chcesz przetestować w izolacji.
- <strong>Jaką atrapę wybrać w teście AAA?</strong> Użyj **Stub**, gdy potrzebujesz stałej wartości zwrotnej (np. zegara), **Spy**, gdy weryfikujesz liczbę wywołań i argumenty, oraz **Fake**, gdy test wymaga lekkiej działającej bazy w pamięci.
- <strong>Jak pisać odporne testy?</strong> Sprawdzaj nie tylko ścieżkę poprawną, lecz także przypadki brzegowe: `null`, pustą listę i znaki specjalne (`\` oraz `"`), z walidacją `ArgumentNullException` na wejściu.
