# Projekt ProcScout - Skaner procesów i portów TCP z LINQ

Otwórz Menedżer zadań na komputerze programisty. Zamiast jednej pozycji przeglądarki zobaczysz 25 osobnych wierszy `chrome`, 12 instancji `Code` i kilka procesów `discord`.

W takim widoku trudno jednym rzutem oka ocenić, która aplikacja faktycznie pochłania najwięcej pamięci RAM. Trudno też szybko sprawdzić, które lokalne porty TCP są już zajęte przez uruchomione serwery deweloperskie.

W tym projekcie zbudujesz pobieralne narzędzie diagnostyczne **`ProcScout.exe`**, które łączy wszystkie filary Modułu 4 w jedną spójną architekturę:
- **Typy generyczne:** bufor cykliczny `HistoriaPomiarow<T>` rejestrujący historię łącznego zużycia RAM z kolejnych skanów w stałej pamięci.
- **Potoki LINQ:** grupowanie wieloprocesowych aplikacji, sortowanie z rozstrzyganiem remisów oraz filtrowanie unikalnych portów TCP.
- **Zasady SOLID:** wydzielenie eksportu za interfejs `IScoutExporter` z implementacją `CsvScoutExporter` oraz oddzielenie konsolowego menu (`Program.cs`) od czystego, testowalnego silnika (`ScoutEngine.cs`).

---

## 🔍 Bezpieczny odczyt procesów, uchwyty jądra i potok LINQ

Każdy obiekt `System.Diagnostics.Process` utrzymuje po stronie systemu Windows natywny uchwyt jądra (kernel handle). Klasa `Process` implementuje interfejs _**IDisposable**_, więc każdy pobrany uchwyt musi zostać jawnie zwolniony po odczycie danych.

W pętli skanującej najlepiej zamknąć każdy obiekt *p* w bloku `using (p)`, a sam odczyt jego właściwości otoczyć blokiem `try / catch`:

```csharp
foreach (var p in Process.GetProcesses())
{
    using (p)
    {
        try
        {
            double pamiecMib = p.WorkingSet64 / (1024.0 * 1024.0);
            rekordy.Add(new ProcesRekord(p.ProcessName, pamiecMib));
        }
        catch
        {
            // Procesy systemowe chronione (np. Idle, System) odmawiaja odczytu
        }
    }
}
```

Blok `using (p)` kompilator zamienia na `try / finally { p.Dispose(); }`. Masz gwarancję, że uchwyt jądra wróci do systemu nawet wtedy, gdy odczyt pamięci rzuci wyjątek braku uprawnień.

Właściwość `WorkingSet64` zwraca fizyczną pamięć zajmowaną przez proces w bajtach. Dzielenie przez `1024.0 * 1024.0` przelicza bajty na **MiB** (mebibajty), a zapis zmiennoprzecinkowy `1024.0` chroni przed ucięciem ułamka w dzieleniu całkowitym.

> [!WARNING]
> Pominięcie `using (p)` lub `p.Dispose()` w narzędziu odświeżającym skan w pętli prowadzi do **_wycieku uchwytów jądra_**. Po kilkunastu odświeżeniach proces gromadzi tysiące otwartych uchwytów w systemie Windows.

### 🔗 Agregacja wieloprocesowych aplikacji

Surowa lista `ProcesRekord` zawiera dziesiątki wpisów o tej samej nazwie (czasem różniących się wielkością liter, np. `chrome` i `Chrome`). Zamiast budować ręczne słowniki i pętle sortujące, przepuszczasz dane przez potok LINQ.

Każdy operator w łańcuchu odpowiada za jedno zadanie: grupowanie po małych literach, wyliczenie statystyk grupy, ustawienie liderów RAM na początku, deterministyczne rozstrzygnięcie remisów alfabetycznie, obcięcie listy do *topN* wyników oraz finalną materializację do listy.

<data-gate>
<data-sortable-list title="Ułóż etapy potoku agregacji LINQ dla procesów systemu Windows">
  <item data-correct="3">OrderByDescending: posortowanie aplikacji malejąco według łącznego zużycia RAM</item>
  <item data-correct="1">GroupBy: pogrupowanie rekordów po nazwie procesu sprowadzonej do małych liter</item>
  <item data-correct="5">Take: wybranie pierwszych N najbardziej pamięciożernych aplikacji</item>
  <item data-correct="2">Select: zamiana każdej grupy w obiekt GrupaAplikacji z liczbą instancji i sumą MiB</item>
  <item data-correct="6">ToList: materializacja odroczonego zapytania LINQ do gotowej listy w pamięci</item>
  <item data-correct="4">ThenBy: alfabetyczne rozstrzygnięcie remisów między aplikacjami o równym zużyciu RAM</item>
</data-sortable-list>
</data-gate>

---

## 🌐 Porty nasłuchujące TCP i architektura SOLID z historią pomiarów

Klasa `IPGlobalProperties` z przestrzeni nazw `System.Net.NetworkInformation` pozwala pobrać tablicę wszystkich lokalnych punktów końcowych (`IPEndPoint`) w stanie `LISTEN`. Działa bez uprawnień administratora i pokazuje, które porty są aktualnie zajęte przez działające usługi.

Standard **RFC 6335** dzieli 16-bitową przestrzeń numerów portów na trzy kategorie:

| Zakres portów (RFC 6335) | Nazwa kategorii | Przykłady zastosowań |
| --- | --- | --- |
| `0..1023` | Porty dobrze znane (Well-Known) | HTTP `80`, HTTPS `443`, SSH `22`, SMB `445` |
| `1024..49151` | Porty zarejestrowane (Registered) | MySQL `3306`, RDP `3389`, Vite `5173`, Minecraft `25565` |
| `49152..65535` | Porty efemeryczne (Dynamic/Ephemeral) | Dynamiczne połączenia wychodzące i lokalne gniazda IPC |

Ta sama usługa sieciowa często nasłuchuje jednocześnie na adresie IPv4 (`0.0.0.0`) oraz IPv6 (`::`), więc jej numer portu pojawia się na surowej liście dwukrotnie. Operator `Distinct` usuwa te duplikaty przed posortowaniem wyników rosnąco.

### 🏛️ Połączenie SOLID i bufora cyklicznego w jednym narzędziu

Formatowanie tabeli CSV nie powinno siedzieć na sztywno w `Program.cs` ani w silniku skanującym. Wydzielenie interfejsu `IScoutExporter` i klasy `CsvScoutExporter` realizuje zasady **SRP**, **OCP** oraz **DIP**: w przyszłości możesz dopisać `JsonScoutExporter` bez zmiany logiki skanowania.

> [!IMPORTANT]
> Na polskiej wersji systemu Windows domyślne formatowanie liczb zmiennoprzecinkowych (`F1`) używa przecinka dziesiętnego (`550,5`). Zawsze przekazuj `CultureInfo.InvariantCulture` do `string.Format`, aby raport CSV używał kropki (`550.5`) i otwierał się poprawnie w każdym parserze na świecie.

Z kolei przy wielokrotnym odświeżaniu skanu w interaktywnym menu konsolowym przydaje się generyczna klasa `HistoriaPomiarow<T>`. Działa jak **bufor cykliczny** o stałej pojemności: pamięta na przykład 5 ostatnich pomiarów łącznego RAM i nadpisuje najstarszy wpis bez niekontrolowanego rozrostu listy.

<data-gate>
<data-connection-matcher title="Dopasuj zakres portów TCP lub mechanizm .NET do jego roli w ProcScout">
  <item left="Porty 0..1023" right="Porty dobrze znane (systemowe), m.in. HTTP 80, HTTPS 443 i SMB 445"></item>
  <item left="Porty 1024..49151" right="Porty zarejestrowane aplikacji użytkownika, np. MySQL 3306 i Vite 5173"></item>
  <item left="Porty 49152..65535" right="Pula portów efemerycznych przydzielanych dynamicznie połączeniom wychodzącym"></item>
  <item left="using (p) na obiekcie Process" right="Natychmiastowe zwolnienie natywnego uchwytu jądra Windows nawet przy wyjątku"></item>
  <item left="CultureInfo.InvariantCulture" right="Wymuszenie kropki dziesiętnej w CSV niezależnie od polskich ustawień Windows"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: iphlpapi.dll, Site Isolation i wyczerpanie portów efemerycznych</span>
<span class="deep-dive-badge">WIN32 IPHLPAPI · SPECTRE · SIECI TCP/IP</span>
</summary>
<div class="deep-dive-content">

<h4>1. Wywołania iphlpapi.dll pod spodem GetActiveTcpListeners i netstat -ano</h4>

Wewnątrz .NET Framework metoda `GetActiveTcpListeners()` wywołuje przez mechanizm P/Invoke natywne funkcje z biblioteki systemowej **`iphlpapi.dll`** (IP Helper API): `GetTcpTable` dla IPv4 oraz `GetTcp6Table` dla IPv6. Biblioteka ta odpytuje sterownik sieciowy `tcpip.sys` o aktualną tablicę gniazd w stanie `MIB_TCP_STATE_LISTEN`.

Struktura `MIB_TCPTABLE` zwraca adres lokalny, port zapisany w kolejności sieciowej (big-endian, więc .NET zamienia bajty na little-endian x86-64) oraz stan gniazda. Rozszerzona funkcja `GetExtendedTcpTable` zwraca dodatkowo identyfikator procesu właściciela `dwOwningPid`:

```c
// Sygnatura w Win32 API (iphlpapi.dll), z ktorej korzysta m.in. netstat -ano:
DWORD GetExtendedTcpTable(
    PVOID pTcpTable, PDWORD pdwSize, BOOL bOrder,
    ULONG ulAf, TCP_TABLE_CLASS TableClass, ULONG Reserved
);
```

Odczyt samej listy lokalnych portów nasłuchujących nie wymaga uprawnień administratora, ponieważ program nie otwiera surowego gniazda sieciowego ani nie przechwytuje cudzych pakietów. Narzędzie systemowe **`netstat -ano`** korzysta właśnie z `GetExtendedTcpTable` z flagą `TCP_TABLE_OWNER_PID_LISTENER`, aby dopisać kolumnę `PID`.

<h4>2. Architektura Site Isolation w przeglądarkach po ataku Spectre</h4>

Dawniej przeglądarka działała jako jeden proces, a każda karta była osobnym wątkiem. Zawieszenie jednej strony zamykało całe okno, a wszystkie karty dzieliły wspólną przestrzeń adresową pamięci.

W 2018 roku ujawniono klasę ataków sprzętowych **_Spectre_**, pozwalających odczytać dowolny bajt pamięci w obrębie tego samego procesu przez spekulatywne wykonywanie instrukcji CPU i pomiar czasu dostępu do cache L1. Złośliwy skrypt na jednej karcie mógł w ten sposób wykraść hasła lub tokeny sesyjne z innej karty.

Współczesne przeglądarki stosują architekturę **Site Isolation** (Process-per-Site-Instance):
- każda domena otrzymuje osobny, odizolowany proces w piaskownicy (sandbox) z własną tablicą stron pamięci,
- osobne procesy obsługują GPU, stos sieciowy, dekodery multimediów oraz rozszerzenia.

Z punktu widzenia bezpieczeństwa to ogromny zysk. Z punktu widzenia diagnostyki RAM wymusza jednak agregację przez `GroupBy`, aby zobaczyć prawdziwy koszt całej aplikacji.

<h4>3. Pula portów efemerycznych, stan TIME_WAIT i błąd SocketException 10048</h4>

Od systemu Windows Vista aż po Windows 11 jądro przydziela połączeniom wychodzącym dokładnie **16 384 porty efemeryczne** (`49152..65535`).

Jeśli źle napisany klient HTTP tworzy w pętli tysiące nowych obiektów `HttpClient` na sekundę bez ich ponownego użycia, każde zamykane gniazdo trafia w stan `TIME_WAIT` na 120 sekund. Po wyczerpaniu całej puli 16 384 portów system odrzuca kolejne połączenia wychodzące błędem **_SocketException (10048: Address already in use)_**.

</div>
</details>

---

## 💻 Projekt Modułu 4: Zbuduj i pobierz ProcScout.exe

W zakładce **`ScoutEngine.cs`** uzupełnij cztery elementy łączące generyki, LINQ i zasady SOLID:

1. **Generyczna klasa `HistoriaPomiarow<T>`**:
   - konstruktor przyjmuje *pojemnosc* (`int`); dla wartości mniejszej lub równej `0` rzuca `ArgumentOutOfRangeException("pojemnosc")`,
   - udostępnia właściwości `Count` (liczba aktualnie zapisanych wpisów) oraz `Pojemnosc` (maksymalny rozmiar bufora),
   - metoda `Dodaj(T pomiar)` dopisuje pomiar do tablicy cyklicznej, nadpisując najstarszy wpis po zapełnieniu,
   - metoda `PobierzWszystkie()` zwraca nową `List<T>` z elementami ułożonymi chronologicznie od najstarszego do najnowszego.
2. **Klasa `CsvScoutExporter` implementująca `IScoutExporter`**:
   - metoda `Eksportuj(List<GrupaAplikacji> grupy)` zawsze zaczyna wynik od wiersza nagłówkowego `"Aplikacja;Instancje;RamMB"`,
   - jeśli *grupy* nie są `null`, dopisuje po jednym wierszu rozdzielonym średnikami (nazwa, liczba instancji, pamięć RAM z jednym miejscem po przecinku w `CultureInfo.InvariantCulture`),
   - łączy wszystkie wiersze znakiem nowej linii `"\n"`.
3. **Metoda `ScoutEngine.AgregujAplikacje(List<ProcesRekord> procesy, int topN)`**:
   - dla *procesy* równych `null` lub *topN* mniejszego bądź równego `0` zwraca pustą `List<GrupaAplikacji>`,
   - grupuje rekordy niezależnie od wielkości liter (klucz sprowadzony do małych liter), zlicza instancje i sumuje pamięć RAM,
   - sortuje malejąco po łącznej pamięci RAM, rozstrzyga remisy alfabetycznie po nazwie, ogranicza wynik do *topN* pozycji i zwraca gotową listę.
4. **Metoda `ScoutEngine.FiltrujPortyUzytkownika(List<int> porty)`**:
   - dla *porty* równych `null` zwraca pustą `List<int>`,
   - przepuszcza wyłącznie poprawne porty użytkownika z przedziału `1024..65535`, usuwa duplikaty i zwraca wynik posortowany rosnąco.

Plik **`Program.cs`** wykonuje automatyczny pierwszy skan od razu po starcie, a na prawdziwym terminalu Windows uruchamia interaktywne menu (odświeżanie skanu z historią RAM, filtrowanie po nazwie, podgląd portów TCP i zapis raportu CSV na dysk). Po przejściu testów kliknij **⬇ Pobierz .exe** i przetestuj `ProcScout.exe` na swoim komputerze.

<data-gate>
<data-csharp-lab title="Projekt Modułu 4: ProcScout (Generyki + LINQ + SOLID)" exe-name="ProcScout.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;

class Program
{
    static List<ProcesRekord> SkanujProcesy()
    {
        var rekordy = new List<ProcesRekord>();
        foreach (var p in Process.GetProcesses())
        {
            using (p)
            {
                try
                {
                    rekordy.Add(new ProcesRekord(p.ProcessName, p.WorkingSet64 / (1024.0 * 1024.0)));
                }
                catch
                {
                    // Pomijamy procesy systemowe bez uprawnien do odczytu pamieci
                }
            }
        }
        return rekordy;
    }

    static List<int> SkanujPortyTcp()
    {
        var surowe = IPGlobalProperties.GetIPGlobalProperties()
            .GetActiveTcpListeners()
            .Select(ep => ep.Port)
            .ToList();
        return ScoutEngine.FiltrujPortyUzytkownika(surowe);
    }

    static void PokazHistorieRam(HistoriaPomiarow<double> historia)
    {
        var pomiary = historia.PobierzWszystkie()
            .Select(mb => mb.ToString("F1", CultureInfo.InvariantCulture) + " MiB");
        Console.WriteLine("Historia lacznego RAM (ostatnie " + historia.Count + "/" + historia.Pojemnosc + " skanow): " + string.Join(" -> ", pomiary));
    }

    static void Main()
    {
        Console.WriteLine("=== PROCSCOUT v2.0 (Generyki + LINQ + SOLID) ===");

        IScoutExporter exporter = new CsvScoutExporter();
        var historiaRam = new HistoriaPomiarow<double>(5);

        var rekordy = SkanujProcesy();
        historiaRam.Dodaj(rekordy.Sum(r => r.PamiecMb));
        var ostatnieTop = ScoutEngine.AgregujAplikacje(rekordy, 8);

        Console.WriteLine("\nTop 8 aplikacji (zsumowane instancje):");
        Console.WriteLine(exporter.Eksportuj(ostatnieTop));
        PokazHistorieRam(historiaRam);

        try
        {
            var porty = SkanujPortyTcp().Take(15).ToList();
            Console.WriteLine("\nOtwarte porty uzytkownika TCP (pierwsze 15): " + string.Join(", ", porty));
        }
        catch (Exception ex)
        {
            Console.WriteLine("\nPorty TCP niedostepne w tym srodowisku: " + ex.Message);
        }

        if (Console.IsInputRedirected)
            return;

        string wybor;
        do
        {
            Console.WriteLine("\n--- MENU PROCSCOUT ---");
            Console.WriteLine("[1] Odswiez skan procesow");
            Console.WriteLine("[2] Filtruj proces po nazwie");
            Console.WriteLine("[3] Pokaz porty TCP");
            Console.WriteLine("[4] Zapisz raport CSV na dysk");
            Console.WriteLine("[0] Wyjdz");
            Console.Write("Wybor: ");

            wybor = Console.ReadLine();
            if (wybor == null)
                break;

            wybor = wybor.Trim();
            switch (wybor)
            {
                case "1":
                    rekordy = SkanujProcesy();
                    historiaRam.Dodaj(rekordy.Sum(r => r.PamiecMb));
                    ostatnieTop = ScoutEngine.AgregujAplikacje(rekordy, 8);
                    Console.WriteLine("\n" + exporter.Eksportuj(ostatnieTop));
                    PokazHistorieRam(historiaRam);
                    break;

                case "2":
                    Console.Write("Podaj fragment nazwy procesu: ");
                    string fraza = Console.ReadLine();
                    if (!string.IsNullOrWhiteSpace(fraza))
                    {
                        string szukana = fraza.Trim().ToLowerInvariant();
                        var wszystkie = ScoutEngine.AgregujAplikacje(rekordy, rekordy.Count);
                        var pasujace = wszystkie.Where(a => a.Nazwa.Contains(szukana)).ToList();
                        if (pasujace.Count == 0)
                            Console.WriteLine("Brak procesow pasujacych do frazy: " + fraza);
                        else
                            Console.WriteLine("\n" + exporter.Eksportuj(pasujace));
                    }
                    break;

                case "3":
                    try
                    {
                        var wszystkiePorty = SkanujPortyTcp();
                        Console.WriteLine("Znalezione porty uzytkownika (" + wszystkiePorty.Count + "): " + string.Join(", ", wszystkiePorty));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Nie udalo sie odczytac portow TCP: " + ex.Message);
                    }
                    break;

                case "4":
                    try
                    {
                        string sciezka = "procscout-raport.csv";
                        File.WriteAllText(sciezka, exporter.Eksportuj(ostatnieTop));
                        Console.WriteLine("Zapisano raport do pliku: " + Path.GetFullPath(sciezka));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Blad zapisu raportu: " + ex.Message);
                    }
                    break;

                case "0":
                    Console.WriteLine("Zamykanie ProcScout...");
                    break;

                default:
                    Console.WriteLine("Nieznana opcja. Wybierz cyfre 0-4.");
                    break;
            }
        }
        while (wybor != "0");
    }
}
```

</cs-file>
<cs-file name="ScoutEngine.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

public class ProcesRekord
{
    public string Nazwa { get; private set; }
    public double PamiecMb { get; private set; }

    public ProcesRekord(string nazwa, double pamiecMb)
    {
        Nazwa = nazwa;
        PamiecMb = pamiecMb;
    }
}

public class GrupaAplikacji
{
    public string Nazwa { get; private set; }
    public int Instancje { get; private set; }
    public double LacznieMb { get; private set; }

    public GrupaAplikacji(string nazwa, int instancje, double lacznieMb)
    {
        Nazwa = nazwa;
        Instancje = instancje;
        LacznieMb = lacznieMb;
    }
}

public class HistoriaPomiarow<T>
{
    private T[] _dane;
    private int _indeksZapisu;

    public int Count { get; private set; }
    public int Pojemnosc { get { return _dane.Length; } }

    public HistoriaPomiarow(int pojemnosc)
    {
        // Rzuc ArgumentOutOfRangeException("pojemnosc") dla pojemnosc <= 0
        _dane = new T[pojemnosc > 0 ? pojemnosc : 1];
    }

    public void Dodaj(T pomiar)
    {
        // Zapisz pomiar w buforze cyklicznym i zaktualizuj indeks oraz Count
    }

    public List<T> PobierzWszystkie()
    {
        // Zwroc elementy chronologicznie od najstarszego do najnowszego
        return new List<T>();
    }
}

public interface IScoutExporter
{
    string Eksportuj(List<GrupaAplikacji> grupy);
}

public class CsvScoutExporter : IScoutExporter
{
    public string Eksportuj(List<GrupaAplikacji> grupy)
    {
        // Naglowek "Aplikacja;Instancje;RamMB" + wiersze z CultureInfo.InvariantCulture (F1)
        return "";
    }
}

public static class ScoutEngine
{
    public static List<GrupaAplikacji> AgregujAplikacje(List<ProcesRekord> procesy, int topN)
    {
        // Zabezpiecz null i topN <= 0, zagreguj instancje oraz zwroc topN aplikacji
        return new List<GrupaAplikacji>();
    }

    public static List<int> FiltrujPortyUzytkownika(List<int> porty)
    {
        // Zabezpiecz null, odfiltruj porty poza 1024..65535, usun duplikaty i posortuj rosnaco
        return new List<int>();
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ScoutEngine.AgregujAplikacje grupuje instancje, rozstrzyga remisy przez ThenBy i obsluguje przypadki brzegowe", () => {
    var dane = new List<ProcesRekord> {
        new ProcesRekord("chrome", 200.0),
        new ProcesRekord("Chrome", 350.0),
        new ProcesRekord("zed", 400.0),
        new ProcesRekord("discord", 400.0),
        new ProcesRekord("notepad", 15.0)
    };
    var top = ScoutEngine.AgregujAplikacje(dane, 3);
    LabAssert.Equal(3, top.Count);
    LabAssert.Equal("chrome", top[0].Nazwa);
    LabAssert.Equal(2, top[0].Instancje);
    LabAssert.Equal(550.0, top[0].LacznieMb);
    LabAssert.Equal("discord", top[1].Nazwa);
    LabAssert.Equal("zed", top[2].Nazwa);

    LabAssert.Equal(0, ScoutEngine.AgregujAplikacje(dane, 0).Count);
    LabAssert.Equal(0, ScoutEngine.AgregujAplikacje(null, 5).Count);
});

LabAssert.Test("CsvScoutExporter implementuje IScoutExporter, uzywa kropki dziesietnej i obsluguje null", () => {
    IScoutExporter exporter = new CsvScoutExporter();
    var grupy = new List<GrupaAplikacji> {
        new GrupaAplikacji("chrome", 2, 550.5),
        new GrupaAplikacji("discord", 1, 120.0)
    };
    string csv = exporter.Eksportuj(grupy).Replace("\r\n", "\n");
    LabAssert.Equal("Aplikacja;Instancje;RamMB\nchrome;2;550.5\ndiscord;1;120.0", csv);

    string pustyCsv = exporter.Eksportuj(new List<GrupaAplikacji>()).Replace("\r\n", "\n");
    LabAssert.Equal("Aplikacja;Instancje;RamMB", pustyCsv);

    string nullCsv = exporter.Eksportuj(null).Replace("\r\n", "\n");
    LabAssert.Equal("Aplikacja;Instancje;RamMB", nullCsv);
});

LabAssert.Test("ScoutEngine.FiltrujPortyUzytkownika sprawdza granice 1024..65535, usuwa duplikaty i sortuje rosnaco", () => {
    var surowe = new List<int> { -1, 0, 80, 443, 1023, 5173, 3306, 5173, 1024, 65535, 65536, 25565, 3306 };
    var wynik = ScoutEngine.FiltrujPortyUzytkownika(surowe);
    LabAssert.Equal("1024,3306,5173,25565,65535", string.Join(",", wynik));

    LabAssert.Equal(0, ScoutEngine.FiltrujPortyUzytkownika(new List<int> { -1, 22, 80, 443, 1023, 65536 }).Count);
    LabAssert.Equal(0, ScoutEngine.FiltrujPortyUzytkownika(null).Count);
});

LabAssert.Test("HistoriaPomiarow<T> nadpisuje najstarsze wpisy w buforze cyklicznym i waliduje pojemnosc", () => {
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new HistoriaPomiarow<double>(0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new HistoriaPomiarow<double>(-3));

    var historia = new HistoriaPomiarow<double>(3);
    LabAssert.Equal(0, historia.Count);
    LabAssert.Equal(3, historia.Pojemnosc);
    LabAssert.Equal(0, historia.PobierzWszystkie().Count);

    historia.Dodaj(100.5);
    historia.Dodaj(200.0);
    LabAssert.Equal(2, historia.Count);
    LabAssert.Equal(100.5, historia.PobierzWszystkie()[0]);
    LabAssert.Equal(200.0, historia.PobierzWszystkie()[1]);

    historia.Dodaj(300.0);
    historia.Dodaj(400.0);
    LabAssert.Equal(3, historia.Count);
    var lista = historia.PobierzWszystkie();
    LabAssert.Equal(200.0, lista[0]);
    LabAssert.Equal(300.0, lista[1]);
    LabAssert.Equal(400.0, lista[2]);

    var logi = new HistoriaPomiarow<string>(2);
    logi.Dodaj("skan-1");
    logi.Dodaj("skan-2");
    logi.Dodaj("skan-3");
    LabAssert.Equal("skan-2,skan-3", string.Join(",", logi.PobierzWszystkie()));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Jak bezpiecznie czytać procesy Windows?</strong> Zawsze zamykaj każdy obiekt `Process` w bloku `using (p)` oraz przechwytuj wyjątki uprawnień, aby uniknąć wycieku uchwytów jądra.
- <strong>Kiedy używać `CultureInfo.InvariantCulture`?</strong> Przy każdym zapisie liczb zmiennoprzecinkowych do plików tekstowych (CSV, JSON, logi), aby kropka dziesiętna była identyczna na każdym komputerze.
- <strong>Jak łączyć generyki, LINQ i SOLID w aplikacji?</strong> Silnik obliczeniowy trzymaj w czystych metodach LINQ, historię pomiarów w generycznym buforze o stałym rozmiarze, a eksport za interfejsem strategii (`IScoutExporter`).
- <strong>Jak projektować pobieralne narzędzie konsolowe?</strong> Oddziel pierwszy automatyczny raport od interaktywnej pętli `do-while` chronionej warunkiem `!Console.IsInputRedirected` oraz bezpiecznym wyjściem przy `wybor == null`.
