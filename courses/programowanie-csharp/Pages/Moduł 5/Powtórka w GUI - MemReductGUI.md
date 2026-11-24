# Powtórka w GUI - MemReductGUI

W **Module 3** zbudowaliśmy konsolowe narzędzie `Win32MemoryEngine`, które wywoływało natywne funkcje `GlobalMemoryStatusEx` i `EmptyWorkingSet`. W konsoli program wykonywał jeden pomiar, wypisywał wynik i zamykał proces.

Aplikacja okienkowa działa w zupełnie innym trybie. Żyje godzinami, co sekundę odpytuje system operacyjny i w dowolnej chwili reaguje na kliknięcia użytkownika. Jeśli zamkniesz okno bez zatrzymania zegara, jego uchwyt nigdy nie zniknie z pamięci. Jeśli pasek postępu dostanie wartość `101`, program natychmiast się wyłączy z wyjątkiem.

Tutaj bierzemy dokładnie ten sam plik `Win32MemoryEngine.cs` (bez ani jednej zmiany w wywołaniach P/Invoke Win32) i łączymy go z ciemnym oknem **Windows Forms** (`MemReductGUI.exe`).

---

## 🔄 Cykl życia okna Form i pułapka niezatrzymanego Timera

Od wywołania konstruktora w C# aż do zwolnienia pamięci okno przechodzi przez **7 ściśle określonych etapów**:
1. **Konstruktor** (`new MemReductForm()`): tworzy obiekty C# kontrolek w pamięci zarządzanej. Natywny uchwyt `HWND` jeszcze nie istnieje.
2. **HandleCreated**: podsystem WinForms wywołuje natywne `CreateWindowExW` i przydziela uchwyt okna `HWND`.
3. **Load**: uruchamia się tuż przed pierwszym pokazaniem okna na ekranie. To dobre miejsce na wczytanie ustawień.
4. **Shown**: odpala się dokładnie raz, zaraz po pierwszym narysowaniu okna.
5. **FormClosing**: użytkownik kliknął przycisk zamknięcia albo nacisnął <kbd>Alt</kbd>+<kbd>F4</kbd>. Można tu jeszcze anulować zamykanie (`e.Cancel = true`) oraz zatrzymać zasoby w tle.
6. **FormClosed**: okno zniknęło z ekranu, ale obiekt C# nadal czeka na posprzątanie.
7. **Dispose**: zwalnia wszystkie zasoby niezarządzane, w tym uchwyty `HWND`, czcionki i komponenty.

### ⏳ Dlaczego niezatrzymany Timer wycieka przez GCHandle?

Zegar `System.Windows.Forms.Timer` nie jest zwykłym obiektem zarządzanym. Po wywołaniu `_timer.Start()` rejestruje w CLR specjalny korzeń _**GCHandle**_, aby Garbage Collector nie usunął działającego zegara w trakcie pracy programu.

Powstaje wtedy łańcuch silnych referencji: _**GCHandle**_ -> `_timer` -> zdarzenie `Tick` -> delegat -> `MemReductForm` -> wszystkie kontrolki. Jeśli zamkniesz okno bez wyłączenia zegara, łańcuch nigdy nie zostanie przerwany. Zegar będzie nadal tykać co sekundę i próbować zapisać tekst do zniszczonych etykiet, co zakończy się wyjątkiem **_ObjectDisposedException_**.

> [!WARNING]
> W każdym oknie korzystającym z `System.Windows.Forms.Timer` podepnij zdarzenie `FormClosing` i wywołaj w nim jawnie `_timer.Stop(); _timer.Dispose();`. Tylko wtedy Windows zwolni natywny timer, a CLR usunie blokujący korzeń `GCHandle`.

Zwróć też uwagę na wybór właściwej klasy timera. `System.Windows.Forms.Timer` dostarcza zdarzenie `Tick` prosto do głównej pętli komunikatów, więc bezpiecznie modyfikuje kontrolki. Z kolei `System.Threading.Timer` uruchamia kod na losowym wątku roboczym, z którego **_nie wolno_** dotykać kontrolek UI (grozi to wyjątkiem **_InvalidOperationException_**).

<data-gate>
<data-sortable-list title="Ułóż 7 etapów cyklu życia okna Form od utworzenia obiektu do zwolnienia zasobów">
  <item data-correct="4">Shown: pierwsze odrysowanie okna na ekranie zakończone</item>
  <item data-correct="1">Konstruktor: utworzenie obiektów C# kontrolek bez uchwytu HWND</item>
  <item data-correct="6">FormClosed: okno zniknęło z ekranu i czeka na zwolnienie zasobów</item>
  <item data-correct="2">HandleCreated: przydzielenie natywnego uchwytu HWND przez system Windows</item>
  <item data-correct="5">FormClosing: reakcja na zamknięcie (np. Alt+F4), miejsce na zatrzymanie timera</item>
  <item data-correct="7">Dispose: zwolnienie uchwytów HWND, czcionek GDI+ i komponentów</item>
  <item data-correct="3">Load: przygotowanie danych tuż przed pierwszym wyświetleniem okna</item>
</data-sortable-list>
</data-gate>

---

## 📊 Odświeżanie na żywo, Controls.AddRange i bufor historii

W konstruktorze okna dodajemy wszystkie siedem kontrolek jednym wywołaniem `Controls.AddRange(new Control[] { ... })`. Zamiast siedem razy zmuszać formularz do przeliczania układu po pojedynczym `Controls.Add(...)`, podsystem WinForms wstrzymuje layout i przelicza go zbiorczo na końcu.

Co `1000 ms` zegar wywołuje metodę `OdswiezStan()`. Zamiast trzymać luźną listę próbek bezpośrednio w klasie formularza, zamykamy logikę historii w osobnej klasie **BuforHistoriiRam** o stałej pojemności (np. `10` ostatnich pomiarów):
- odrzuca błędne próbki o wartości `null`,
- po przekroczeniu pojemności usuwa najstarszy wpis z początku listy,
- wylicza średnie oraz maksymalne obciążenie RAM z aktualnego okna czasowego.

Dzięki temu pojedynczy chwilowy skok pamięci nie zafałszuje odczytu, a okno `MemReductForm` nie musi znać szczegółów zarządzania kolekcją.

### 🛡️ Clampowanie ProgressBar i ochrona Timer.Tick

Kontrolka `ProgressBar` ma twarde granice określone przez `Minimum = 0` i `Maximum = 100`. Jeśli wynik zaokrąglenia `Math.Round(snap.UsedPercent)` z jakiegokolwiek powodu wyjdzie poza ten przedział, przypisanie `_pasekRam.Value = pct` rzuci wyjątek **_ArgumentOutOfRangeException_**.

Dlatego wartość zawsze **clampujemy** (przycinamy do bezpiecznego zakresu):

```csharp
int pct = (int)Math.Round(snap.UsedPercent);
if (pct < 0) pct = 0;
if (pct > 100) pct = 100;
_pasekRam.Value = pct;
```

Całe wnętrze metody `OdswiezStan()` otaczamy dodatkowo blokiem `try/catch`. Jeśli wywołanie natywnego API w zdarzeniu `Timer.Tick` rzuci wyjątek bez przechwycenia, pętla komunikatów WinForms wyświetli okno awarii .NET co kolejną sekundę. Z przechwyceniem błędu aplikacja wypisuje spokojny komunikat w etykiecie `_lblRaport` i działa dalej.

---

## 🚦 Progi obciążenia i CultureInfo.InvariantCulture

Interfejs przekazuje stan obciążenia pamięci podwójnym kodowaniem: czytelną etykietą tekstową oraz kontrastowym kolorem na ciemnym tle `#0F172A`:

| Zakres obciążenia RAM | Etykieta tekstowa | Kolor akcentu | Znaczenie |
| :--- | :--- | :--- | :--- |
| `< 65.0%` | `NISKI` | Zielony (`#34D399`) | Duży zapas wolnej pamięci fizycznej |
| `65.0% do 84.9%` | `SREDNI` | Bursztynowy (`#FBBF24`) | Podwyższone zużycie, warto obserwować |
| `>= 85.0%` | `WYSOKI` | Czerwony (`#F87171`) | System bliski wyczerpania RAM i stronicowania na dysk |

> [!IMPORTANT]
> Na polskim systemie Windows domyślne `string.Format("{0:F1} MB", 512.0)` wypisze `"512,0 MB"` z przecinkiem zamiast kropki. Jeśli raport jest parsowany przez testy automatyczne albo narzędzia logujące, taki detal rozbija aplikację u użytkownika z innymi ustawieniami regionalnymi. Zawsze podawaj jawnie `CultureInfo.InvariantCulture`, np. `string.Format(CultureInfo.InvariantCulture, "{0:F1}", wartosc)`.

---

## 🧹 Synchroniczne czyszczenie RAM i stan zajętości UI

Przycisk **Wyczyść pamięć RAM teraz** uruchamia `_engine.CleanWorkingSets()`. Metoda ta pobiera listę wszystkich uruchomionych procesów i wywołuje dla każdego natywną funkcję `EmptyWorkingSet`, która zwalnia `Working Set` procesów bieżącego użytkownika bez uprawnień administratora.

Pętla po kilkuset procesach trwa od ułamka sekundy do około 1 lub 2 sekund. Ponieważ zdarzenie `Click` wykonuje się **synchronicznie w wątku UI**, na ten moment okno przestaje odpowiadać. Jeśli użytkownik niecierpliwie kliknie przycisk kilka razy, kolejne kliknięcia ustawią się w kolejce komunikatów i uruchomią czyszczenie raz za razem.

W kodzie synchronicznym zabezpieczamy ten scenariusz trzema krokami w bloku `try/finally`:
1. Przed startem wyłączamy przycisk (`_btnClean.Enabled = false;`) i ustawiamy kursor oczekiwania (`Cursor = Cursors.WaitCursor;`).
2. Wewnątrz `try` wykonujemy pomiar przed, czyszczenie i pomiar po.
3. W bloku `finally` **zawsze** przywracamy `Cursor = Cursors.Default;` oraz `_btnClean.Enabled = true;`, nawet jeśli w trakcie pojawi się wyjątek.

To rozwiązanie chroni przed wielokrotnym kliknięciem i daje użytkownikowi czytelny sygnał wizualny. Pełne odblokowanie okna podczas długich operacji poznasz w kolejnych modułach przy okazji programowania asynchronicznego (`async` i `await`), które przenosi ciężką pętlę poza wątek UI.

<data-gate>
<data-connection-matcher title="Dopasuj typowy błąd produkcyjny WinForms do jego przyczyny i naprawy">
  <item left="ObjectDisposedException po zamknięciu okna z timerem" right="Niezatrzymany Timer nadal strzela Tick: wywołaj Stop() i Dispose() w FormClosing"></item>
  <item left="ArgumentOutOfRangeException przy ustawianiu ProgressBar.Value" right="Wartość poza zakresem 0..100: zastosuj clampowanie przed przypisaniem"></item>
  <item left="Raport zawiera 512,0 MB zamiast 512.0 MB na polskim Windowsie" right="Domyślna kultura systemu: przekaż CultureInfo.InvariantCulture do string.Format"></item>
  <item left="Zamknięte okno potomne nigdy nie znika z pamięci RAM" right="Aktywny Timer trzyma korzeń GCHandle blokujący Garbage Collector"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Natywne SetTimer i KillTimer, kontrast WCAG oraz Working Set w Windows</span>
<span class="deep-dive-badge">SETTIMER · GCHANDLE · WCAG · WORKING SET</span>
</summary>
<div class="deep-dive-content">

<h4>1. Natywne SetTimer i KillTimer oraz łańcuch referencji GCHandle</h4>

Gdy wywołujesz `_timer.Start()`, `System.Windows.Forms.Timer` korzysta z funkcji `SetTimer` z biblioteki `user32.dll` i tworzy ukryte okno pomocnicze (`TimerNativeWindow`) odbierające komunikaty `WM_TIMER` (`0x0113`):

```c
// Wywołania Win32 API wykonywane pod maską przez Forms.Timer:
UINT_PTR id = SetTimer(hwndPomocnicze, 1, 1000, NULL); // Co 1000 ms wstawia WM_TIMER
// ... po zatrzymaniu lub zamknięciu okna:
KillTimer(hwndPomocnicze, id);                         // Usuwa timer z jądra user32.dll
```

Aby Garbage Collector nie zebrał działającego timera, CLR rejestruje korzeń `GCHandle.Alloc(this)`. Dopóki `KillTimer` nie zostanie wywołane przez `_timer.Stop()` i `_timer.Dispose()`, korzeń utrzymuje przy życiu cały graf obiektów okna.

<h4>2. Dostępność kolorów (WCAG AA i AAA)</h4>

Około 8% mężczyzn i 0,5% kobiet ma zaburzenia rozpoznawania barw, najczęściej deuteranopię (trudność w odróżnieniu zieleni od czerwieni). Z tego powodu krytycznych progów nigdy nie wolno przekazywać samym kolorem.

W `MemReductForm` łączymy wyraźny tekst `[NISKI]`, `[SREDNI]`, `[WYSOKI]` z kolorami o wysokim kontraście na tle `#0F172A`:
- `#34D399` (zielony): kontrast około `9.6:1` (spełnia WCAG AAA),
- `#FBBF24` (bursztynowy): kontrast około `10.8:1` (spełnia WCAG AAA),
- `#F87171` (czerwony): kontrast około `6.1:1` (spełnia WCAG AA).

<h4>3. Czym jest Working Set w jądrze Windows?</h4>

`Working Set` to zbiór stron pamięci fizycznej RAM aktualnie przypisanych do danego procesu. Wywołanie `EmptyWorkingSet` prosi menedżer pamięci systemu Windows o przeniesienie nieużywanych chwilowo stron z `Working Set` procesu na listę gotowości (ang. Standby List). Dzięki temu pamięć fizyczna staje się od razu dostępna dla innych aplikacji, a operacja działa bez podnoszenia uprawnień dla procesów należących do bieżącego użytkownika.

</div>
</details>

---

## 💻 Projekt Powtórkowy 2: Zbuduj i pobierz MemReductGUI.exe

W zakładce **`RamSnapshot.cs`** uzupełnij dwie statyczne metody klasy `RamSnapshot` oraz klasę **`BuforHistoriiRam`** wykorzystywane przez okno `MemReductForm`:

1. `RamSnapshot.OkreslPoziom(double procent)`:
   - `< 65.0` zwraca `"NISKI"`,
   - `< 85.0` zwraca `"SREDNI"`,
   - `>= 85.0` zwraca `"WYSOKI"`.

2. `RamSnapshot.FormatujRaportCzyszczenia(RamSnapshot przed, RamSnapshot po, int oczyszczono)`:
   - gdy *przed* lub *po* ma wartość `null`, zwraca dokładnie `"Brak danych do porownania."`,
   - oblicza zwolnioną pamięć w MB za pomocą `przed.CalculateFreedMb(po)`,
   - gdy zwolniono `<= 0.0` MB, zwraca `"Brak zwolnionej pamieci (procesy: N)."` (gdzie `N` to *oczyszczono*),
   - w przeciwnym razie zwraca `"Zwolniono X.X MB (procesy: N)."`, formatując liczbę megabajtów z jednym miejscem po kropce (`:F1`) przez `CultureInfo.InvariantCulture`.

3. Klasa `BuforHistoriiRam`:
   - konstruktor `BuforHistoriiRam(int pojemnosc)`: jeśli *pojemnosc* jest `<= 0`, rzuca `ArgumentOutOfRangeException("pojemnosc")`,
   - `Dodaj(RamSnapshot probka)`: ignoruje `null`; dopisuje próbkę na koniec listy, a jeśli liczba próbek przekracza `Pojemnosc`, usuwa najstarszą próbkę z indeksu `0`,
   - `SrednieObciazenie()`: zwraca `0.0` dla pustego bufora, a w przeciwnym razie średnią arytmetyczną `UsedPercent` przechowywanych próbek,
   - `MaksymalneObciazenie()`: zwraca `0.0` dla pustego bufora, a w przeciwnym razie największą wartość `UsedPercent` spośród przechowywanych próbek.

Po zaliczeniu wszystkich testów kliknij **Pobierz .exe** i uruchom `MemReductGUI.exe` na Windows 11.

<data-gate>
<data-csharp-lab title="Powtórka GUI cz. 2: MemReductGUI (WinForms + Timer + BuforHistoriiRam + Win32 API)" exe-name="MemReductGUI.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.Globalization;
using System.Windows.Forms;

public class MemReductForm : Form
{
    private readonly Win32MemoryEngine _engine = new Win32MemoryEngine();
    private readonly Timer _timer = new Timer();
    private readonly BuforHistoriiRam _historia = new BuforHistoriiRam(10);
    private Label _lblProcent;
    private Label _lblDetale;
    private Label _lblHistoria;
    private Label _lblRaport;
    private ProgressBar _pasekRam;
    private Button _btnClean;

    public MemReductForm()
    {
        Text = "MemReduct GUI - Windows 11 RAM Cleaner";
        ClientSize = new Size(440, 305);
        BackColor = Color.FromArgb(15, 23, 42);
        ForeColor = Color.White;
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;

        var lblTytul = new Label
        {
            Text = "FIZYCZNA PAMIEC RAM (" + Environment.MachineName + ")",
            Location = new Point(22, 18),
            AutoSize = true,
            Font = new Font("Segoe UI", 9.5f, FontStyle.Bold),
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        _lblProcent = new Label
        {
            Text = "-- %",
            Location = new Point(20, 44),
            Size = new Size(396, 48),
            Font = new Font("Segoe UI", 26, FontStyle.Bold),
            ForeColor = Color.FromArgb(56, 189, 248)
        };

        _pasekRam = new ProgressBar
        {
            Location = new Point(22, 100),
            Size = new Size(396, 24),
            Minimum = 0,
            Maximum = 100
        };

        _lblDetale = new Label
        {
            Text = "Odczytywanie...",
            Location = new Point(22, 132),
            Size = new Size(396, 22),
            Font = new Font("Segoe UI", 10),
            ForeColor = Color.FromArgb(203, 213, 225)
        };

        _lblHistoria = new Label
        {
            Text = "Srednia: -- %  |  Maks: -- %  (probki: 0/10)",
            Location = new Point(22, 158),
            Size = new Size(396, 22),
            Font = new Font("Segoe UI", 9),
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        _btnClean = new Button
        {
            Text = "Wyczysc pamiec RAM teraz",
            Location = new Point(22, 192),
            Size = new Size(396, 44),
            BackColor = Color.FromArgb(16, 185, 129),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = new Font("Segoe UI", 11, FontStyle.Bold)
        };
        _btnClean.FlatAppearance.BorderSize = 0;
        _btnClean.Click += (s, e) => WyczyscTeraz();

        _lblRaport = new Label
        {
            Text = "Gotowy. Czyszczenie dziala bez uprawnien administratora.",
            Location = new Point(22, 248),
            Size = new Size(396, 36),
            Font = new Font("Segoe UI", 9),
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        Controls.AddRange(new Control[] { lblTytul, _lblProcent, _pasekRam, _lblDetale, _lblHistoria, _btnClean, _lblRaport });

        _timer.Interval = 1000;
        _timer.Tick += (s, e) => OdswiezStan();
        FormClosing += (s, e) => { _timer.Stop(); _timer.Dispose(); };

        OdswiezStan();
        _timer.Start();
    }

    private void OdswiezStan()
    {
        try
        {
            RamSnapshot snap = _engine.CaptureRamSnapshot();
            _historia.Dodaj(snap);

            int pct = (int)Math.Round(snap.UsedPercent);
            if (pct < 0) pct = 0;
            if (pct > 100) pct = 100;

            string poziom = RamSnapshot.OkreslPoziom(snap.UsedPercent);
            double srednia = _historia.SrednieObciazenie();
            double maks = _historia.MaksymalneObciazenie();

            _pasekRam.Value = pct;
            _lblProcent.Text = string.Format(CultureInfo.InvariantCulture, "{0:F1}%  [{1}]", snap.UsedPercent, poziom);
            _lblDetale.Text = string.Format(CultureInfo.InvariantCulture, "Zajete: {0:F2} GB  /  Calkowite: {1:F2} GB  (Wolne: {2:F2} GB)",
                snap.UsedGb, snap.TotalGb, snap.TotalGb - snap.UsedGb);
            _lblHistoria.Text = string.Format(CultureInfo.InvariantCulture, "Srednia: {0:F1}%  |  Maks: {1:F1}%  (probki: {2}/{3})",
                srednia, maks, _historia.LiczbaProbek, _historia.Pojemnosc);

            _lblProcent.ForeColor = poziom == "WYSOKI"
                ? Color.FromArgb(248, 113, 113)
                : (poziom == "SREDNI" ? Color.FromArgb(251, 191, 36) : Color.FromArgb(52, 211, 153));
        }
        catch (Exception ex)
        {
            _lblRaport.Text = "Blad odczytu: " + ex.Message;
        }
    }

    private void WyczyscTeraz()
    {
        _btnClean.Enabled = false;
        Cursor = Cursors.WaitCursor;
        _lblRaport.Text = "Czyszczenie Working Set procesow...";
        try
        {
            RamSnapshot before = _engine.CaptureRamSnapshot();
            CleanupReport rep = _engine.CleanWorkingSets();
            RamSnapshot after = _engine.CaptureRamSnapshot();
            OdswiezStan();
            _lblRaport.Text = RamSnapshot.FormatujRaportCzyszczenia(before, after, rep.CleanedProcesses);
        }
        catch (Exception ex)
        {
            _lblRaport.Text = "Blad czyszczenia: " + ex.Message;
        }
        finally
        {
            Cursor = Cursors.Default;
            _btnClean.Enabled = true;
        }
    }
}

class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MemReductForm());
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
        if (totalBytes == 0 || availableBytes > totalBytes) throw new ArgumentOutOfRangeException("availableBytes");
        TotalBytes = totalBytes;
        AvailableBytes = availableBytes;
    }

    public ulong UsedBytes { get { return TotalBytes - AvailableBytes; } }
    public double UsedPercent { get { return ((double)UsedBytes / TotalBytes) * 100.0; } }
    public double TotalGb { get { return TotalBytes / (1024.0 * 1024.0 * 1024.0); } }
    public double UsedGb { get { return UsedBytes / (1024.0 * 1024.0 * 1024.0); } }

    public double CalculateFreedMb(RamSnapshot after)
    {
        if (after == null || after.AvailableBytes <= AvailableBytes) return 0.0;
        return (after.AvailableBytes - AvailableBytes) / (1024.0 * 1024.0);
    }

    public static string OkreslPoziom(double procent)
    {
        // Zwróć "NISKI" (< 65.0), "SREDNI" (< 85.0) lub "WYSOKI" (>= 85.0)
        return "NISKI";
    }

    public static string FormatujRaportCzyszczenia(RamSnapshot przed, RamSnapshot po, int oczyszczono)
    {
        // Obsłuż przed/po == null, brak zwolnionej pamięci oraz zwolnione MB z CultureInfo.InvariantCulture
        return "";
    }
}

public class BuforHistoriiRam
{
    private readonly List<RamSnapshot> _probki = new List<RamSnapshot>();

    public int Pojemnosc { get; private set; }
    public int LiczbaProbek { get { return _probki.Count; } }

    public BuforHistoriiRam(int pojemnosc)
    {
        if (pojemnosc <= 0) throw new ArgumentOutOfRangeException("pojemnosc");
        Pojemnosc = pojemnosc;
    }

    public void Dodaj(RamSnapshot probka)
    {
        // Ignoruj null; dodaj próbkę i usuń najstarszą, jeśli liczba próbek przekracza Pojemnosc
    }

    public double SrednieObciazenie()
    {
        // Zwróć 0.0 dla pustego bufora, w przeciwnym razie średnią UsedPercent
        return 0.0;
    }

    public double MaksymalneObciazenie()
    {
        // Zwróć 0.0 dla pustego bufora, w przeciwnym razie maksymalną wartość UsedPercent
        return 0.0;
    }
}
```

</cs-file>
<cs-file name="Win32MemoryEngine.cs" readonly>

```csharp
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

public class CleanupReport
{
    public int CleanedProcesses { get; private set; }
    public int SkippedProcesses { get; private set; }
    public CleanupReport(int c, int s) { CleanedProcesses = c; SkippedProcesses = s; }
}

public class Win32MemoryEngine
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
    private struct MEMORYSTATUSEX
    {
        public uint dwLength, dwMemoryLoad;
        public ulong ullTotalPhys, ullAvailPhys, ullTotalPageFile, ullAvailPageFile, ullTotalVirtual, ullAvailVirtual, ullAvailExtendedVirtual;
    }

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

    [DllImport("psapi.dll", SetLastError = true)]
    private static extern bool EmptyWorkingSet(IntPtr hProcess);

    public RamSnapshot CaptureRamSnapshot()
    {
        var st = new MEMORYSTATUSEX();
        st.dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
        if (!GlobalMemoryStatusEx(ref st)) throw new InvalidOperationException("Blad GlobalMemoryStatusEx");
        return new RamSnapshot(st.ullTotalPhys, st.ullAvailPhys);
    }

    public CleanupReport CleanWorkingSets()
    {
        int cleaned = 0, skipped = 0;
        foreach (var p in Process.GetProcesses())
        {
            try { if (EmptyWorkingSet(p.Handle)) cleaned++; else skipped++; }
            catch { skipped++; }
            finally { p.Dispose(); }
        }
        return new CleanupReport(cleaned, skipped);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("OkreslPoziom klasyfikuje progi obciążenia RAM (< 65, < 85, >= 85)", () => {
    LabAssert.Equal("NISKI", RamSnapshot.OkreslPoziom(0.0));
    LabAssert.Equal("NISKI", RamSnapshot.OkreslPoziom(64.99));
    LabAssert.Equal("SREDNI", RamSnapshot.OkreslPoziom(65.0));
    LabAssert.Equal("SREDNI", RamSnapshot.OkreslPoziom(84.99));
    LabAssert.Equal("WYSOKI", RamSnapshot.OkreslPoziom(85.0));
    LabAssert.Equal("WYSOKI", RamSnapshot.OkreslPoziom(99.5));
});

LabAssert.Test("FormatujRaportCzyszczenia obsługuje null, brak zwolnionego RAM oraz wartości całkowite i ułamkowe MB", () => {
    ulong mb = 1024UL * 1024UL;
    var przed = new RamSnapshot(8192UL * mb, 2048UL * mb);
    var poZwolnieniu = new RamSnapshot(8192UL * mb, 2560UL * mb);
    var poUlamkowym = new RamSnapshot(8192UL * mb, 2048UL * mb + 128UL * mb + 512UL * 1024UL);
    var poWzroscie = new RamSnapshot(8192UL * mb, 1900UL * mb);

    LabAssert.Equal("Brak danych do porownania.", RamSnapshot.FormatujRaportCzyszczenia(null, poZwolnieniu, 10));
    LabAssert.Equal("Brak danych do porownania.", RamSnapshot.FormatujRaportCzyszczenia(przed, null, 10));
    LabAssert.Equal("Brak zwolnionej pamieci (procesy: 12).", RamSnapshot.FormatujRaportCzyszczenia(przed, przed, 12));
    LabAssert.Equal("Brak zwolnionej pamieci (procesy: 5).", RamSnapshot.FormatujRaportCzyszczenia(przed, poWzroscie, 5));
    LabAssert.Equal("Zwolniono 512.0 MB (procesy: 42).", RamSnapshot.FormatujRaportCzyszczenia(przed, poZwolnieniu, 42));
    LabAssert.Equal("Zwolniono 128.5 MB (procesy: 17).", RamSnapshot.FormatujRaportCzyszczenia(przed, poUlamkowym, 17));
});

LabAssert.Test("BuforHistoriiRam waliduje pojemność, obsługuje pusty bufor i odrzuca null", () => {
    bool rzucono = false;
    try { new BuforHistoriiRam(0); } catch (ArgumentOutOfRangeException) { rzucono = true; }
    LabAssert.True(rzucono, "Pojemność 0 powinna rzucić ArgumentOutOfRangeException");

    var bufor = new BuforHistoriiRam(5);
    LabAssert.Equal(0, bufor.LiczbaProbek);
    LabAssert.Equal(0.0, bufor.SrednieObciazenie());
    LabAssert.Equal(0.0, bufor.MaksymalneObciazenie());

    bufor.Dodaj(null);
    LabAssert.Equal(0, bufor.LiczbaProbek);
    LabAssert.Equal(0.0, bufor.SrednieObciazenie());
});

LabAssert.Test("BuforHistoriiRam liczy średnią, maksimum i usuwa najstarszą próbkę po przekroczeniu pojemności", () => {
    var bufor = new BuforHistoriiRam(3);
    bufor.Dodaj(new RamSnapshot(1000, 100)); // 90%
    bufor.Dodaj(new RamSnapshot(1000, 500)); // 50%
    bufor.Dodaj(null);                       // ignorowane
    bufor.Dodaj(new RamSnapshot(1000, 600)); // 40%

    LabAssert.Equal(3, bufor.LiczbaProbek);
    LabAssert.True(Math.Abs(bufor.SrednieObciazenie() - 60.0) < 0.001, "Średnia (90, 50, 40) = 60.0%");
    LabAssert.True(Math.Abs(bufor.MaksymalneObciazenie() - 90.0) < 0.001, "Maksimum (90, 50, 40) = 90.0%");

    bufor.Dodaj(new RamSnapshot(1000, 700)); // 30% -> wypada 90%, zostają 50%, 40%, 30%
    LabAssert.Equal(3, bufor.LiczbaProbek);
    LabAssert.True(Math.Abs(bufor.SrednieObciazenie() - 40.0) < 0.001, "Średnia po wyrzuceniu najstarszej (50, 40, 30) = 40.0%");
    LabAssert.True(Math.Abs(bufor.MaksymalneObciazenie() - 50.0) < 0.001, "Maksimum po wyrzuceniu piku 90% powinno spaść do 50.0%");
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Gdy uruchamiasz w oknie Timer:</strong> zawsze zatrzymuj go i zwalniaj (`_timer.Stop(); _timer.Dispose();`) w zdarzeniu `FormClosing`, aby zwolnić `GCHandle` i uniknąć `ObjectDisposedException`.
- <strong>Gdy ustawiasz ProgressBar.Value lub obsługujesz Timer.Tick:</strong> przycinaj wartość do przedziału `0..100` i owijaj ciało odświeżania w `try/catch`, aby pojedynczy błąd nie przerwał pętli komunikatów.
- <strong>Gdy formatujesz liczby do raportów lub testów:</strong> używaj `CultureInfo.InvariantCulture`, aby kropka dziesiętna była identyczna na każdej wersji językowej Windows.
- <strong>Gdy wywołujesz dłuższą operację synchronicznie w wątku UI:</strong> wyłącz przycisk i ustaw `Cursors.WaitCursor` przed wywołaniem, a przywróć oba w bloku `finally`.
