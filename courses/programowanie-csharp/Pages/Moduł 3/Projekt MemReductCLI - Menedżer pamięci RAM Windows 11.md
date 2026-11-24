# Projekt MemReductCLI - Menedżer pamięci RAM Windows 11

Po kilku godzinach pracy z przeglądarką, komunikatorem i edytorem kodu Menedżer Zadań w Windows 11 pokazuje ponad 80% zajętego RAM. Większość otwartych kart leży jednak bezczynnie w tle, a aplikacje nie oddają zarezerwowanych ramek pamięci z powrotem do systemu.

Zbudujesz i pobierzesz **`MemReductCLI.exe`**: lekkie narzędzie konsolowe inspirowane projektem **Mem Reduct** (`henrypp/memreduct`), które odczytuje stan fizycznej pamięci i oczyszcza nieużywane obszary robocze procesów na Windows 11 **bez uprawnień administratora**.

---

## 🧠 Pamięć RAM w Windows 11 i działanie EmptyWorkingSet

Kiedy aplikacja działająca w trybie użytkownika (Ring 3) prosi system o odczyt statystyk sprzętu albo operację na pamięci procesów, przekracza granicę do jądra systemu (Ring 0). Prześledź tę ścieżkę na interaktywnym schemacie:

<data-sys-ring-bridge preset="write"></data-sys-ring-bridge>

Menedżer pamięci w jądrze Windows 11 nie dzieli fizycznego RAM wyłącznie na „zajęty” i „wolny”. Każda 4-kilobajtowa ramka pamięci znajduje się na jednej z czterech list zarządzanych przez jądro:

| Lista pamięci w Windows | Co zawiera? | Czy wymaga uprawnień administratora do czyszczenia? |
| --- | --- | --- |
| `Working Set` (zbiór roboczy) | Aktywne strony fizycznego RAM przypisane bezpośrednio do tablic stron konkretnego procesu (np. Chrome, Discord, VS Code) | **Nie** dla procesów bieżącego użytkownika: wystarcza `EmptyWorkingSet(proc.Handle)` z `psapi.dll` |
| `Standby List` (lista gotowości) | Strony usunięte z `Working Set` lub wczytane z dysku jako pamięć podręczna, gotowe do oddania nowej aplikacji | **Tak**: wymaga uprawnień administratora oraz funkcji `NtSetSystemInformation` |
| `Modified Page List` | Zmodyfikowane strony danych, które jądro musi zapisać na dysk (`pagefile.sys`), zanim przejdą na `Standby List` | **Tak**: zarządzane globalnie przez jądro Windows |
| `Free / Zero Page List` | Całkowicie puste ramki fizycznego RAM wyzerowane w tle przez wątek jądra Zero Page Thread | Nie wymaga czyszczenia: pamięć jest już w pełni wolna |

Wywołanie **`EmptyWorkingSet`** dla procesów bieżącego użytkownika przenosi nieużywane ostatnio strony z ich `Working Set` na `Standby List`. System nie zamyka kart w przeglądarce ani nie niszczy danych: po prostu pozwala innym aplikacjom natychmiast przejąć tę fizyczną pamięć.

---

## 🏗️ Wstrzykiwanie zależności i architektura czterech warstw

Gdyby klasa `MemoryCleanupService` tworzyła w środku `new Win32MemoryEngine()`, cały serwis zostałby na stałe sklejony z systemem Windows. Nie przetestowałbyś logiki czyszczenia na serwerze Linux ani w testach jednostkowych bez wywoływania prawdziwych bibliotek systemowych.

Zamiast tego stosujemy **wstrzykiwanie zależności** (Dependency Injection) przez interfejs **`IMemoryCleaner`**. Klasa `MemoryCleanupService` przyjmuje dowolny obiekt spełniający kontrakt `IMemoryCleaner` w swoim konstruktorze:

```csharp
// Na Windows 11 wstrzykujemy prawdziwy silnik Win32 API:
var prodService = new MemoryCleanupService(new Win32MemoryEngine());

// W chmurze Linux i w testach automatycznych wstrzykujemy symulator:
var testService = new MemoryCleanupService(new SimulatedMemoryCleaner(before, after, report));
```

Taki podział daje dwie natychmiastowe korzyści architektoniczne. Po pierwsze, w testach weryfikujesz dokładną kolejność wywołań i matematykę obliczania zwolnionych megabajtów z pełną deterministycznością. Po drugie, silnik `Win32MemoryEngine.cs` i model `RamSnapshot.cs` nie zawierają ani jednej instrukcji `Console.WriteLine`. W Module 5 przeniesiesz te pliki bez zmiany ani jednej linijki logiki wprost do graficznego okna Windows Forms.

### 🧩 Podział odpowiedzialności między pliki projektu

| Plik | Warstwa | Rola w architekturze |
| --- | --- | --- |
| `IMemoryCleaner.cs` | Kontrakty | Interfejs `IMemoryCleaner`, raporty (`CleanupReport`, `CleanupSessionResult`) oraz symulator `SimulatedMemoryCleaner` |
| `RamSnapshot.cs` | Domena i Serwis | Model `RamSnapshot` z niezmiennikami oraz orkiestrator `MemoryCleanupService` z historią sesji |
| `Win32MemoryEngine.cs` | Infrastruktura | Implementacja `IMemoryCleaner` wywołująca `kernel32.dll` i `psapi.dll` |
| `Program.cs` | Prezentacja (UI) | Interaktywne menu konsolowe, ranking Top 5 procesów i wypisywanie wyników |

<data-gate>
<data-connection-matcher title="Przypisz każde zadanie do właściwej warstwy architektury MemReductCLI">
  <item left="Warstwa domenowa (RamSnapshot)" right="Pilnuje niezmiennika availableBytes <= totalBytes i oblicza zwolnione MB"></item>
  <item left="Warstwa serwisu (MemoryCleanupService)" right="Orkiestruje kolejność Capture -> Clean -> Capture, sprawdza próg i zapisuje historię sesji"></item>
  <item left="Warstwa infrastruktury (Win32MemoryEngine)" right="Wywołuje natywne DLL systemu Windows przez P/Invoke i zamyka uchwyty procesów"></item>
  <item left="Warstwa prezentacji (Program.cs)" right="Obsługuje menu użytkownika, wczytuje klawisze i wypisuje raporty przez Console.WriteLine"></item>
</data-connection-matcher>
</data-gate>

---

## ⚙️ Mechanizm P/Invoke i typy natywne Win32 API

Wywoływanie natywnych funkcji napisanych w języku C z systemowych bibliotek DLL realizuje w C# mechanizm **P/Invoke** (Platform Invoke) z przestrzeni `System.Runtime.InteropServices`. W pliku `Win32MemoryEngine.cs` spotkasz kilka typów i słów kluczowych specyficznych dla styku C# z systemem operacyjnym:

- **`[DllImport("psapi.dll", SetLastError = true)]`**: informuje środowisko CLR, z której biblioteki DLL załadować zewnętrzną funkcję `extern`.
- **`ulong`** (64-bitowa liczba bez znaku): przechowuje rozmiary pamięci w bajtach. Zwykły `int` mieści maksymalnie około 2 GB, więc dla komputerów z 16 GB lub 64 GB RAM natychmiast uległby przepełnieniu.
- **`uint`** (32-bitowa liczba bez znaku): odpowiada 32-bitowemu typowi `DWORD` z Win32 API (używanemu dla pola `dwLength` oraz procentowego obciążenia `dwMemoryLoad`).
- **`IntPtr`**: natywny uchwyt lub wskaźnik systemu operacyjnego (64-bitowy w procesach x64), tutaj reprezentujący otwarty uchwyt procesu `proc.Handle`.
- **`ref`**: przekazuje strukturę `MEMORYSTATUSEX` przez referencję, aby funkcja `GlobalMemoryStatusEx` mogła zapisać dane bezpośrednio w naszej zmiennej na stosie.
- **`dwLength`**: pole rozmiaru struktury w bajtach ustawiane przez `Marshal.SizeOf`. Jeśli o nim zapomnisz, jądro odrzuci wywołanie z kodem błędu `**_ERROR_INVALID_PARAMETER_**` (87).

```csharp
[DllImport("kernel32.dll", SetLastError = true)]
private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

[DllImport("psapi.dll", SetLastError = true)]
private static extern bool EmptyWorkingSet(IntPtr hProcess);
```

> [!WARNING]
> Podczas iteracji po `Process.GetProcesses()` systemowe usługi chronione (`SYSTEM`, `Registry`, oprogramowanie antywirusowe) odrzucają dostęp do swojego uchwytu `proc.Handle`, rzucając `**_Win32Exception_**` lub `**_InvalidOperationException_**`. Dlatego wywołanie dla pojedynczego procesu musi być osłonięte blokiem `try / catch`, aby jeden chroniony proces nie przerwał czyszczenia pozostałych.

> [!CAUTION]
> Każdy obiekt `Process` otwiera natywny uchwyt jądra Windows. Zawsze zwalniaj go przez _**Dispose() w finally**_ (`proc.Dispose()`), co wywołuje systemowe `CloseHandle`. Pominięcie `Dispose()` przy setkach procesów prowadzi do **_wycieku uchwytów jądra_** i wyczerpania zasobów programu.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Soft vs Hard Page Fault, StructLayout w P/Invoke, NtSetSystemInformation i Bounce Back</span>
<span class="deep-dive-badge">WINDOWS KERNEL · P/INVOKE · WIN32 C</span>
</summary>
<div class="deep-dive-content">

<h4>1. Working Set, Standby List i Modified Page List: dlaczego EmptyWorkingSet nie psuje otwartych programów?</h4>

Gdy wywołasz `EmptyWorkingSet(hProcess)`, jądro Windows (`ntoskrnl.exe`) odłącza nieużywane strony od tablicy stron procesu i przesuwa je na `Standby List` (strony czyste) lub `Modified Page List` (strony zapisane w pamięci, jeszcze nie zsynchronizowane z dyskiem). Fizyczne bajty tych stron nadal leżą w kościach RAM.

Kiedy minutę później klikniesz zminimalizowaną kartę przeglądarki, procesor zgłasza błąd strony (Page Fault), który może przebiec na dwa skrajnie różne sposoby:
- **Soft Page Fault (poniżej 1 mikrosekundy)**: jądro widzi, że szukana strona nadal czeka w fizycznym RAM na `Standby List`. Wystarczy zaktualizować pojedynczy wpis w tablicy stron (PTE): zero operacji dyskowych, użytkownik nie czuje żadnego opóźnienia.
- **Hard Page Fault (50 do 500 mikrosekund na NVMe, kilka milisekund na HDD)**: jeśli w międzyczasie inna aplikacja (np. gra 3D) przejęła te ramki fizycznego RAM, strona trafiła wcześniej do pliku stronicowania `pagefile.sys` na dysku. Jądro musi wtedy wykonać fizyczny odczyt z SSD, co jest dziesiątki tysięcy razy wolniejsze niż Soft Page Fault.

<h4>2. Dlaczego MEMORYSTATUSEX wymaga StructLayout(LayoutKind.Sequential) i pola dwLength?</h4>

Funkcja `GlobalMemoryStatusEx` z `kernel32.dll` została napisana w języku C i oczekuje wskaźnika do struktury z nagłówka `<sysinfoapi.h>` o dokładnie określonym, 64-bajtowym układzie pamięci:

```c
typedef struct _MEMORYSTATUSEX {
    DWORD     dwLength;                 // offset 0  (4 B) - rozmiar struktury: 64 bajty!
    DWORD     dwMemoryLoad;             // offset 4  (4 B)
    DWORDLONG ullTotalPhys;             // offset 8  (8 B)
    DWORDLONG ullAvailPhys;             // offset 16 (8 B)
    DWORDLONG ullTotalPageFile;         // offset 24 (8 B)
    DWORDLONG ullAvailPageFile;         // offset 32 (8 B)
    DWORDLONG ullTotalVirtual;          // offset 40 (8 B)
    DWORDLONG ullAvailVirtual;          // offset 48 (8 B)
    DWORDLONG ullAvailExtendedVirtual;  // offset 56 (8 B)
} MEMORYSTATUSEX;                       // razem dokladnie 64 bajty
```

Atrybut **`[StructLayout(LayoutKind.Sequential)]`** zabrania środowisku CLR przestawiania kolejności pól w pamięci. Z kolei przypisanie `status.dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX))` to klasyczny wzorzec wersjonowania w Win32 API: jądro sprawdza pole `dwLength`, aby upewnić się, że program przekazał strukturę właściwego rozmiaru i nie dojdzie do przepełnienia bufora. Bez ustawienia `dwLength` funkcja zwraca `false` z kodem błędu `**_ERROR_INVALID_PARAMETER_**` (87).

<h4>3. Uprawnienie SeProfileSingleProcessPrivilege i skąd bierze się efekt Bounce Back</h4>

Pełna wersja `henrypp/memreduct` potrafi opróżnić globalną `Standby List` całego systemu. Wymaga to jednak uruchomienia z uprawnieniami administratora, aktywacji przywileju **`SeProfileSingleProcessPrivilege`** w tokenie bezpieczeństwa procesu (przez `AdjustTokenPrivileges`), a następnie wywołania nieudokumentowanej funkcji natywnej **`NtSetSystemInformation`** z `ntdll.dll` z klasą `SystemMemoryListInformation` (`0x50`) oraz komendą jądra:

```c
// Wybrane komendy dla NtSetSystemInformation(SystemMemoryListInformation = 0x50):
// 2 = MemoryEmptyWorkingSets   | 4 = MemoryPurgeStandbyList
// 3 = MemoryFlushModifiedList  | 5 = MemoryPurgeLowPriorityStandbyList
```

Nasze `MemReductCLI.exe` świadomie używa wyłącznie legalnego, udokumentowanego API trybu użytkownika (`EmptyWorkingSet`). Dzięki temu działa bezpiecznie bez podnoszenia uprawnień UAC i bez ryzyka destabilizacji buforów jądra.

Po oczyszczeniu pamięci zauważysz w Menedżerze Zadań **efekt Bounce Back**: zużycie RAM najpierw gwałtownie spada, a po kilkunastu sekundach powoli wraca częściowo w górę. To zamierzone zachowanie Windows 11 (usługa SysMain i pamięć podręczna plików jądra): wolny RAM jest marnowanym zasobem, więc system ponownie wczytuje często używane strony aplikacji i bibliotek DLL w tło.

</div>
</details>

---

## 💻 Projekt Modułu 3 dla narzędzia MemReductCLI w 4 plikach

Przełącz zakładkę na **`RamSnapshot.cs`** i uzupełnij dwie klasy stanowiące serce logiki domenowej i serwisowej projektu:

1. **Klasa `RamSnapshot`**:
   - walidacja w konstruktorze `RamSnapshot(ulong totalBytes, ulong availableBytes)`: jeśli `totalBytes == 0 || availableBytes > totalBytes`, rzuć `ArgumentOutOfRangeException`,
   - właściwości `UsedBytes` (`TotalBytes - AvailableBytes`) oraz `UsedPercent` (`((double)UsedBytes / TotalBytes) * 100.0`),
   - metoda `CalculateFreedMb(RamSnapshot after)`: dla `after == null` rzuć `ArgumentNullException`; jeśli `after.AvailableBytes > AvailableBytes`, zwróć różnicę w MB, w przeciwnym razie `0.0`.
2. **Klasa `MemoryCleanupService`** (wstrzykiwanie zależności przez `IMemoryCleaner` + historia sesji):
   - konstruktor `MemoryCleanupService(IMemoryCleaner cleaner)`: dla `cleaner == null` rzuć `ArgumentNullException`; zainicjalizuj listę `History`,
   - właściwość `History` (`List<CleanupSessionResult>`) oraz właściwość `TotalFreedMb` sumująca `FreedMb` ze wszystkich zapisanych sesji w `History`,
   - metoda `CleanupSessionResult ExecuteCleanup()`:
     1. pobierz stan przed (`CaptureRamSnapshot()`),
     2. uruchom czyszczenie (`CleanWorkingSets()`),
     3. pobierz stan po (`CaptureRamSnapshot()`),
     4. wylicz `freedMb = before.CalculateFreedMb(after)`, utwórz `CleanupSessionResult`, dodaj go do `History` i zwróć,
   - metoda `CleanupSessionResult ExecuteCleanupIfAbove(double thresholdPercent)`:
     1. dla `thresholdPercent < 0.0 || thresholdPercent > 100.0` rzuć `ArgumentOutOfRangeException`,
     2. pobierz aktualny stan RAM (`before = _cleaner.CaptureRamSnapshot()`),
     3. jeśli `before.UsedPercent < thresholdPercent`, zwróć `null` bez uruchamiania czyszczenia i bez dopisywania do `History`,
     4. w przeciwnym razie uruchom `CleanWorkingSets()`, pobierz `after = _cleaner.CaptureRamSnapshot()`, wylicz `freedMb`, zapisz wynik w `History` i zwróć go.

Po zaliczeniu wszystkich testów kliknij **⬇ Pobierz .exe** i uruchom **`MemReductCLI.exe`** na swoim komputerze z Windows 11. Interaktywne menu konsolowe pozwoli Ci na żywo sprawdzać Top 5 procesów, czyścić `Working Set` i przeglądać historię sesji.

<data-gate>
<data-csharp-lab title="Projekt Modułu 3: MemReductCLI (4 pliki OOP + DI + Win32 API)" exe-name="MemReductCLI.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;

class ProcessEntry
{
    public string Name { get; private set; }
    public int Pid { get; private set; }
    public double WorkingSetMb { get; private set; }

    public ProcessEntry(string name, int pid, double workingSetMb)
    {
        Name = name;
        Pid = pid;
        WorkingSetMb = workingSetMb;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("=== MEMREDUCT CLI v1.1 (Windows 11 User-Mode RAM Cleaner) ===");
        Console.WriteLine("Host: {0} | Rdzenie CPU: {1}", Environment.MachineName, Environment.ProcessorCount);

        if (Environment.OSVersion.Platform != PlatformID.Win32NT)
        {
            RunCloudDemo();
            return;
        }

        var engine = new Win32MemoryEngine();
        var service = new MemoryCleanupService(engine);

        if (Console.IsInputRedirected)
        {
            PrintRamAndTopProcesses(engine);
            RunCleanupAndPrint(service);
            return;
        }

        string choice;
        do
        {
            Console.WriteLine("\n--- MENU ---");
            Console.WriteLine("[1] Odswiez stan RAM i Top 5");
            Console.WriteLine("[2] Wyczysc Working Set");
            Console.WriteLine("[3] Historia sesji");
            Console.WriteLine("[0] Wyjdz");
            Console.Write("Wybor: ");

            choice = Console.ReadLine();
            if (choice == null) break;
            choice = choice.Trim();

            switch (choice)
            {
                case "1":
                    PrintRamAndTopProcesses(engine);
                    break;
                case "2":
                    RunCleanupAndPrint(service);
                    break;
                case "3":
                    PrintHistory(service);
                    break;
                case "0":
                    Console.WriteLine("Zamykanie MemReductCLI...");
                    break;
                default:
                    Console.WriteLine("Nieznana opcja. Wybierz 0, 1, 2 lub 3.");
                    break;
            }
        }
        while (choice != "0");
    }

    static void RunCloudDemo()
    {
        Console.WriteLine("[Tryb podgladu w chmurze Linux/Mono]");
        var demoBefore = new RamSnapshot(16UL * 1024 * 1024 * 1024, 5UL * 1024 * 1024 * 1024);
        var demoAfter = new RamSnapshot(16UL * 1024 * 1024 * 1024, 7UL * 1024 * 1024 * 1024);
        var demoCleaner = new SimulatedMemoryCleaner(demoBefore, demoAfter, new CleanupReport(42, 18));
        var demoService = new MemoryCleanupService(demoCleaner);
        CleanupSessionResult demoResult = demoService.ExecuteCleanup();

        Console.WriteLine("Symulacja przed: {0}", demoResult.Before);
        Console.WriteLine("Symulacja po:    {0}", demoResult.After);
        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "Zwolniono:       {0:F1} MB (lacznie w sesji: {1:F1} MB)", demoResult.FreedMb, demoService.TotalFreedMb));
        Console.WriteLine("Pobierz MemReductCLI.exe, aby uruchomic interaktywne menu na swoim Windows 11!");
    }

    static void PrintRamAndTopProcesses(IMemoryCleaner engine)
    {
        RamSnapshot current = engine.CaptureRamSnapshot();
        Console.WriteLine("\nAktualny stan RAM: {0}", current);
        Console.WriteLine("Top 5 procesow (Working Set):");

        var entries = new List<ProcessEntry>();
        foreach (Process p in Process.GetProcesses())
        {
            try
            {
                double wsMb = p.WorkingSet64 / (1024.0 * 1024.0);
                entries.Add(new ProcessEntry(p.ProcessName, p.Id, wsMb));
            }
            catch
            {
            }
            finally
            {
                p.Dispose();
            }
        }

        // Proste sortowanie przez wybieranie: 5 najwiekszych procesow malejaco
        int limit = Math.Min(5, entries.Count);
        for (int i = 0; i < limit; i++)
        {
            int maxIndex = i;
            for (int j = i + 1; j < entries.Count; j++)
            {
                if (entries[j].WorkingSetMb > entries[maxIndex].WorkingSetMb)
                {
                    maxIndex = j;
                }
            }

            ProcessEntry temp = entries[i];
            entries[i] = entries[maxIndex];
            entries[maxIndex] = temp;

            Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
                "  {0}. {1,-22} PID: {2,-6} {3,8:F1} MB",
                i + 1, entries[i].Name, entries[i].Pid, entries[i].WorkingSetMb));
        }
    }

    static void RunCleanupAndPrint(MemoryCleanupService service)
    {
        Console.WriteLine("\nCzyszczenie Working Set procesow uzytkownika...");
        CleanupSessionResult result = service.ExecuteCleanup();

        Console.WriteLine("RAM przed: {0}", result.Before);
        Console.WriteLine("RAM po:    {0}", result.After);
        Console.WriteLine("Oczyszczono procesow: {0}, pominieto chronionych: {1}",
            result.Report.CleanedProcesses, result.Report.SkippedProcesses);
        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "Zwolniono fizycznego RAM: {0:F1} MB", result.FreedMb));
    }

    static void PrintHistory(MemoryCleanupService service)
    {
        Console.WriteLine("\nHistoria sesji czyszczenia ({0}):", service.History.Count);
        if (service.History.Count == 0)
        {
            Console.WriteLine("  Brak wykonanych czyszczen w tej sesji.");
            return;
        }

        for (int i = 0; i < service.History.Count; i++)
        {
            CleanupSessionResult item = service.History[i];
            Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
                "  #{0}: {1} -> {2} | Zwolniono: {3:F1} MB",
                i + 1, item.Before, item.After, item.FreedMb));
        }

        Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
            "Lacznie zwolniono w sesji: {0:F1} MB", service.TotalFreedMb));
    }
}
```

</cs-file>
<cs-file name="IMemoryCleaner.cs" readonly>

```csharp
using System.Collections.Generic;

public class CleanupReport
{
    public int CleanedProcesses { get; private set; }
    public int SkippedProcesses { get; private set; }

    public CleanupReport(int cleanedProcesses, int skippedProcesses)
    {
        CleanedProcesses = cleanedProcesses;
        SkippedProcesses = skippedProcesses;
    }
}

public class CleanupSessionResult
{
    public RamSnapshot Before { get; private set; }
    public RamSnapshot After { get; private set; }
    public CleanupReport Report { get; private set; }
    public double FreedMb { get; private set; }

    public CleanupSessionResult(RamSnapshot before, RamSnapshot after, CleanupReport report, double freedMb)
    {
        Before = before;
        After = after;
        Report = report;
        FreedMb = freedMb;
    }
}

public interface IMemoryCleaner
{
    RamSnapshot CaptureRamSnapshot();
    CleanupReport CleanWorkingSets();
}

public class SimulatedMemoryCleaner : IMemoryCleaner
{
    private readonly RamSnapshot _before;
    private readonly RamSnapshot _after;
    private readonly CleanupReport _report;
    private int _captureCalls;

    public List<string> CallLog { get; private set; }

    public SimulatedMemoryCleaner(RamSnapshot before, RamSnapshot after, CleanupReport report)
    {
        _before = before;
        _after = after;
        _report = report;
        _captureCalls = 0;
        CallLog = new List<string>();
    }

    public RamSnapshot CaptureRamSnapshot()
    {
        CallLog.Add("Capture");
        _captureCalls++;
        return (_captureCalls % 2 == 1) ? _before : _after;
    }

    public CleanupReport CleanWorkingSets()
    {
        CallLog.Add("Clean");
        return _report;
    }
}
```

</cs-file>
<cs-file name="RamSnapshot.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Globalization;

public class RamSnapshot
{
    public ulong TotalBytes { get; private set; }
    public ulong AvailableBytes { get; private set; }

    public RamSnapshot(ulong totalBytes, ulong availableBytes)
    {
        // Zwaliduj: totalBytes == 0 lub availableBytes > totalBytes -> ArgumentOutOfRangeException
        TotalBytes = totalBytes;
        AvailableBytes = availableBytes;
    }

    public ulong UsedBytes { get { return 0; } }
    public double UsedPercent { get { return 0.0; } }
    public double TotalGb { get { return TotalBytes / (1024.0 * 1024.0 * 1024.0); } }
    public double UsedGb { get { return UsedBytes / (1024.0 * 1024.0 * 1024.0); } }

    public double CalculateFreedMb(RamSnapshot after)
    {
        if (after == null) throw new ArgumentNullException("after");
        // Zwroc roznice w MB, gdy after.AvailableBytes > AvailableBytes; inaczej 0.0
        return 0.0;
    }

    public override string ToString()
    {
        return string.Format(CultureInfo.InvariantCulture,
            "{0:F2} / {1:F2} GB ({2:F1}%)", UsedGb, TotalGb, UsedPercent);
    }
}

public class MemoryCleanupService
{
    private readonly IMemoryCleaner _cleaner;

    public List<CleanupSessionResult> History { get; private set; }

    public double TotalFreedMb
    {
        get
        {
            // Zsumuj FreedMb ze wszystkich wpisow na liscie History
            return 0.0;
        }
    }

    public MemoryCleanupService(IMemoryCleaner cleaner)
    {
        // Zwaliduj cleaner == null -> ArgumentNullException
        _cleaner = cleaner;
        History = new List<CleanupSessionResult>();
    }

    public CleanupSessionResult ExecuteCleanup()
    {
        // Wykonaj: CaptureRamSnapshot (before) -> CleanWorkingSets -> CaptureRamSnapshot (after)
        // Wylicz freedMb, dopisz wynik do History i zwroc CleanupSessionResult
        return null;
    }

    public CleanupSessionResult ExecuteCleanupIfAbove(double thresholdPercent)
    {
        // Zwaliduj thresholdPercent < 0 lub > 100 -> ArgumentOutOfRangeException
        // Pobierz stan RAM; jesli UsedPercent < thresholdPercent, zwroc null
        // W przeciwnym razie wykonaj CleanWorkingSets, pobierz stan po, dopisz do History i zwroc wynik
        return null;
    }
}
```

</cs-file>
<cs-file name="Win32MemoryEngine.cs">

```csharp
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

public class Win32MemoryEngine : IMemoryCleaner
{
    [StructLayout(LayoutKind.Sequential)]
    private struct MEMORYSTATUSEX
    {
        public uint dwLength;
        public uint dwMemoryLoad;
        public ulong ullTotalPhys;
        public ulong ullAvailPhys;
        public ulong ullTotalPageFile;
        public ulong ullAvailPageFile;
        public ulong ullTotalVirtual;
        public ulong ullAvailVirtual;
        public ulong ullAvailExtendedVirtual;
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

    [DllImport("psapi.dll", SetLastError = true)]
    private static extern bool EmptyWorkingSet(IntPtr hProcess);

    public RamSnapshot CaptureRamSnapshot()
    {
        var status = new MEMORYSTATUSEX();
        status.dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
        if (!GlobalMemoryStatusEx(ref status))
            throw new InvalidOperationException("Nie udalo sie odczytac GlobalMemoryStatusEx.");
        return new RamSnapshot(status.ullTotalPhys, status.ullAvailPhys);
    }

    public CleanupReport CleanWorkingSets()
    {
        int cleaned = 0;
        int skipped = 0;
        foreach (var proc in Process.GetProcesses())
        {
            try
            {
                if (EmptyWorkingSet(proc.Handle)) cleaned++;
                else skipped++;
            }
            catch
            {
                skipped++;
            }
            finally
            {
                proc.Dispose();
            }
        }
        return new CleanupReport(cleaned, skipped);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("RamSnapshot wylicza UsedBytes i UsedPercent w tym dla przypadków brzegowych 0% i 100%", () => {
    var snap = new RamSnapshot(1000UL, 250UL);
    LabAssert.Equal(750UL, snap.UsedBytes);
    LabAssert.Equal(75.0, Math.Round(snap.UsedPercent, 1));

    var pelny = new RamSnapshot(1024UL, 0UL);
    LabAssert.Equal(1024UL, pelny.UsedBytes);
    LabAssert.Equal(100.0, Math.Round(pelny.UsedPercent, 1));

    var pusty = new RamSnapshot(1024UL, 1024UL);
    LabAssert.Equal(0UL, pusty.UsedBytes);
    LabAssert.Equal(0.0, Math.Round(pusty.UsedPercent, 1));
});
LabAssert.Test("RamSnapshot blokuje totalBytes == 0 oraz availableBytes > totalBytes", () => {
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new RamSnapshot(0UL, 0UL));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new RamSnapshot(100UL, 150UL));
});
LabAssert.Test("CalculateFreedMb zwraca zwolnione MB, obsługuje null i nigdy nie zwraca wartości ujemnej", () => {
    ulong mb = 1024UL * 1024UL;
    var before = new RamSnapshot(8192UL * mb, 2000UL * mb);
    var after = new RamSnapshot(8192UL * mb, 2512UL * mb);
    LabAssert.Equal(512.0, Math.Round(before.CalculateFreedMb(after), 1));
    LabAssert.Equal(0.0, after.CalculateFreedMb(before));
    LabAssert.Equal(0.0, before.CalculateFreedMb(before));
    LabAssert.Throws<ArgumentNullException>(() => before.CalculateFreedMb(null));
});
LabAssert.Test("MemoryCleanupService orkiestruje czyszczenie, zapisuje historię i sumuje TotalFreedMb", () => {
    LabAssert.Throws<ArgumentNullException>(() => new MemoryCleanupService(null));

    ulong mb = 1024UL * 1024UL;
    var before = new RamSnapshot(16384UL * mb, 4000UL * mb);
    var after = new RamSnapshot(16384UL * mb, 4768UL * mb);
    var stub = new SimulatedMemoryCleaner(before, after, new CleanupReport(35, 12));

    var service = new MemoryCleanupService(stub);
    LabAssert.Equal(0, service.History.Count);
    LabAssert.Equal(0.0, service.TotalFreedMb);

    CleanupSessionResult res1 = service.ExecuteCleanup();
    LabAssert.Equal(3, stub.CallLog.Count);
    LabAssert.Equal("Capture", stub.CallLog[0]);
    LabAssert.Equal("Clean", stub.CallLog[1]);
    LabAssert.Equal("Capture", stub.CallLog[2]);
    LabAssert.Equal(768.0, Math.Round(res1.FreedMb, 1));
    LabAssert.Equal(35, res1.Report.CleanedProcesses);
    LabAssert.Equal(12, res1.Report.SkippedProcesses);

    CleanupSessionResult res2 = service.ExecuteCleanup();
    LabAssert.Equal(2, service.History.Count);
    LabAssert.Equal(1536.0, Math.Round(service.TotalFreedMb, 1));
});
LabAssert.Test("ExecuteCleanupIfAbove pomija czyszczenie poniżej progu i czyści od progu w górę", () => {
    ulong mb = 1024UL * 1024UL;
    // 1000 / 4000 dostepne -> 75% zajete
    var before = new RamSnapshot(4000UL * mb, 1000UL * mb);
    var after = new RamSnapshot(4000UL * mb, 1500UL * mb);

    var stubLow = new SimulatedMemoryCleaner(before, after, new CleanupReport(10, 5));
    var serviceLow = new MemoryCleanupService(stubLow);
    LabAssert.Throws<ArgumentOutOfRangeException>(() => serviceLow.ExecuteCleanupIfAbove(-1.0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => serviceLow.ExecuteCleanupIfAbove(101.0));

    CleanupSessionResult skipped = serviceLow.ExecuteCleanupIfAbove(80.0);
    LabAssert.True(skipped == null);
    LabAssert.Equal(1, stubLow.CallLog.Count);
    LabAssert.Equal("Capture", stubLow.CallLog[0]);
    LabAssert.Equal(0, serviceLow.History.Count);

    var stubHigh = new SimulatedMemoryCleaner(before, after, new CleanupReport(10, 5));
    var serviceHigh = new MemoryCleanupService(stubHigh);
    CleanupSessionResult cleaned = serviceHigh.ExecuteCleanupIfAbove(75.0);
    LabAssert.True(cleaned != null);
    LabAssert.Equal(3, stubHigh.CallLog.Count);
    LabAssert.Equal("Clean", stubHigh.CallLog[1]);
    LabAssert.Equal(500.0, Math.Round(cleaned.FreedMb, 1));
    LabAssert.Equal(1, serviceHigh.History.Count);
    LabAssert.Equal(500.0, Math.Round(serviceHigh.TotalFreedMb, 1));
});
LabAssert.Test("Win32MemoryEngine implementuje kontrakt IMemoryCleaner", () => {
    LabAssert.True(new Win32MemoryEngine() is IMemoryCleaner);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Dlaczego wstrzykiwać interfejs `IMemoryCleaner` zamiast tworzyć silnik przez `new`?</strong> Wstrzykiwanie zależności pozwala przetestować logikę czyszczenia i historię sesji na symulatorze bez wywoływania Win32 API oraz przenieść ten sam kod do aplikacji okienkowej.
- <strong>O czym pamiętać przy wywołaniach P/Invoke (`[DllImport]`)?</strong> Dopasuj natywne typy (`ulong`, `uint`, `IntPtr`), zachowaj układ pól przez `[StructLayout(LayoutKind.Sequential)]` i zawsze inicjalizuj `dwLength`, aby uniknąć błędu `**_ERROR_INVALID_PARAMETER_**`.
- <strong>Jak bezpiecznie pracować z uchwytami procesów Windows?</strong> Osłaniaj dostęp do `proc.Handle` blokiem `try / catch` dla chronionych procesów systemowych i zawsze wywołuj _**Dispose() w finally**_, aby zapobiec wyciekom uchwytów jądra.
- <strong>Dlaczego `EmptyWorkingSet` nie uszkadza uruchomionych aplikacji?</strong> Przenosi nieużywane strony z `Working Set` na `Standby List` w pamięci fizycznej, nie zamykając procesów ani nie usuwając danych użytkownika.
