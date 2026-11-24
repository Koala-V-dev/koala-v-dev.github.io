# Projekt WinBoostTray - Kombajn Windows 11 w zasobniku

Połączenie monitora pamięci, czyszczenia *Working Set*, trybu Awake, zrzutu ekranu i ikony zasobnika w jednym pliku **`WinBoostTray.exe`** wystawia kod na realne problemy produkcyjne. Jeśli upchniesz całą logikę w jednym pliku z formularzem, nie przetestujesz jej automatycznie bez uruchamiania okna.

Co gorsza, uruchomienie czyszczenia pamięci wprost na wątku UI zamraża interfejs na kilkaset milisekund. Jeśli zaś przeniesiesz je do `Task.Run` bez odpowiedniej blokady, szybkie dwukrotne kliknięcie przycisku uruchomi dwa równoległe sprzątania naraz i doprowadzi do wyścigu.

---

## 🏗️ Architektura trzywarstwowa WinBoostTray

Aby aplikacja była stabilna i łatwa w testowaniu, dzielimy ją na **trzy niezależne warstwy** rozdzielone pomiędzy trzy pliki projektu:

| Plik projektu | Warstwa | Odpowiedzialność |
| :--- | :--- | :--- |
| `Program.cs` | Warstwa UI i zdarzeń (`WinBoostForm`) | Kontrolki WinForms, obsługa kliknięć, `Timer`, `NotifyIcon`, cykl życia okna i bezpieczny `BeginInvoke` |
| `BoostState.cs` | Czysta logika domenowa i walidacja | Obliczenia procentu i zwolnionego RAM, maski bitowe Awake, formatowanie tekstu zasobnika i reguły auto-czyszczenia |
| `Win32Bridge.cs` | Izolowany most P/Invoke | Natywne wywołania `GlobalMemoryStatusEx` i `SetThreadExecutionState` (`kernel32.dll`) oraz `EmptyWorkingSet` (`psapi.dll`) |

Taki podział daje kluczową korzyść inżynierską: `BoostState` nie zależy od `System.Windows.Forms` ani od natywnych bibliotek DLL. Dzięki temu automatyczne testy weryfikują wszystkie obliczenia i przypadki brzegowe bez tworzenia ani jednego okna.

### 🧰 Cztery moduły w jednym procesie

1. **Monitor i czyszczenie RAM**: co sekundę odczytuje pamięć fizyczną przez `GlobalMemoryStatusEx`, wylicza procent w `BoostState` i pozwala jednym kliknięciem (lub automatycznie po przekroczeniu progu) opróżnić *Working Set* dostępnych procesów w tle.
2. **Przełącznik Awake**: buduje 32-bitową maskę flag w `BoostState.ZbudujFlagiAwake` i przekazuje ją do `SetThreadExecutionState`, blokując wygaszanie ekranu bez uprawnień administratora.
3. **QuickSnap**: ukrywa własne okno na _**220 ms**_, przechwytuje pulpit przez `Graphics.CopyFromScreen`, zapisuje plik `Snap_RRRRMMDD_GGMMSS.png` na Pulpicie i kopiuje obraz do schowka pod skrót <kbd>Ctrl</kbd>+<kbd>V</kbd>.
4. **Zasobnik systemowy**: kliknięcie <kbd>X</kbd> lub minimalizacja chowa okno obok zegara, a dopiero wybór `„Zamknij WinBoostTray”` z menu podręcznego kończy proces i zwalnia zasoby.

---

## 🔄 Cykl życia okna i ochrona przed re-entrancy

Aplikacja zasobnikowa musi precyzyjnie rozróżniać intencję użytkownika od polecenia systemu operacyjnego. W zdarzeniu `FormClosing` sprawdzamy flagę *_prawdziweZamkniecie* oraz powód zamknięcia *e.CloseReason*.

Gdy użytkownik klika <kbd>X</kbd>, *e.CloseReason* ma wartość `CloseReason.UserClosing`. Jeśli nie wybrano opcji `„Zamknij WinBoostTray”`, ustawiamy `e.Cancel = true` i chowamy okno metodą `Hide()`. Gdy natomiast Windows wysyła `CloseReason.WindowsShutDown`, warunek nie przechodzi i aplikacja zamyka się bez blokowania systemu.

<data-gate>
<data-connection-matcher title="Dopasuj warstwę lub zdarzenie WinBoostTray do jego odpowiedzialności">
  <item left="WinBoostForm (Program.cs)" right="Obsługa kontrolek UI, timerów, zadań w tle i powrotu przez BeginInvoke"></item>
  <item left="BoostState (BoostState.cs)" right="Czysta, testowalna logika domenowa, flagi bitowe i walidacja granic"></item>
  <item left="Win32Bridge (Win32Bridge.cs)" right="Izolowane wywołania P/Invoke do kernel32.dll i psapi.dll"></item>
  <item left="FormClosing" right="Przechwycenie CloseReason.UserClosing i schowanie okna do zasobnika"></item>
  <item left="FormClosed" right="Jednorazowe zatrzymanie timerów, reset Awake i usunięcie ikony zasobnika"></item>
</data-connection-matcher>
</data-gate>

### 🚦 Problem re-entrancy przy asynchronicznym czyszczeniu RAM

Wywołanie `Win32Bridge.WyczyscWorkingSets()` przechodzi po wszystkich procesach w systemie, więc uruchamiamy je w `Task.Run`. Natychmiast pojawia się jednak ryzyko **_re-entrancy_** (wielokrotnego wywołania współbieżnego).

Jeśli użytkownik dwa razy szybko kliknie przycisk czyszczenia albo timer auto-czyszczenia odpali się w trakcie trwania operacji ręcznej, dwa wątki robocze zaczną jednocześnie opróżniać te same procesy i nadpisywać komunikaty statusu.

Rozwiązujemy to flagą *_trwaCzyszczenie*:
- przed uruchomieniem `Task.Run` sprawdzamy `if (_trwaCzyszczenie) return;`, ustawiamy `_trwaCzyszczenie = true` i dezaktywujemy przycisk,
- przekazujemy *_trwaCzyszczenie* do `BoostState.CzyWymagaAutoCzyszczenia(...)`, aby automat nie uruchomił drugiej operacji w trakcie pierwszej,
- w bloku `finally` wątku roboczego zawsze wracamy przez `if (!IsDisposed && IsHandleCreated) BeginInvoke((Action)(() => ...))` i zdejmujemy flagę `_trwaCzyszczenie = false` na wątku UI.

> [!WARNING]
> Zdjęcie flagi *_trwaCzyszczenie* musi znaleźć się w bloku `finally` wykonywanym z powrotem na wątku UI. Jeśli pominiesz `finally`, dowolny nieoczekiwany wyjątek w `Task.Run` zablokuje przycisk czyszczenia na stałe aż do restartu programu.

Równie ważna jest kolejność sprzątania w `FormClosed`. Jeśli najpierw wywołasz `Dispose()` na kontrolkach, a dopiero potem zatrzymasz `_timer`, ostatni tik timera może odwołać się do już zwolnionego okna.

> [!IMPORTANT]
> W zdarzeniu `FormClosed` zawsze zachowuj kolejność: najpierw zatrzymaj timery, potem zresetuj flagi Awake (`ES_CONTINUOUS`), następnie ukryj `_tray.Visible = false` (sygnał `NIM_DELETE` dla `explorer.exe`), a na końcu wywołaj `Dispose()` na wszystkich zasobach.

<data-gate>
<data-sortable-list title="Ułóż bezpieczną kolejność zwalniania zasobów w zdarzeniu FormClosed">
  <item data-correct="3">Ukrycie ikony w zasobniku (_tray.Visible = false), aby usunąć ją z explorer.exe</item>
  <item data-correct="1">Zatrzymanie i zwolnienie timerów (_timer.Stop(); _timer.Dispose();)</item>
  <item data-correct="4">Wywołanie Dispose() na _tray, _trayMenu oraz wszystkich obiektach Font</item>
  <item data-correct="2">Reset stanu zasilania przez SetThreadExecutionState(ES_CONTINUOUS)</item>
</data-sortable-list>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Struktura Win32 NOTIFYICONDATA, ikona-duch bez NIM_DELETE i bezpieczne przywracanie Awake</span>
<span class="deep-dive-badge">WINDOWS SHELL · P/INVOKE · CYKL ŻYCIA</span>
</summary>
<div class="deep-dive-content">

<h4>1. Struktura Win32 NOTIFYICONDATA i twardy limit 63 znaków</h4>

Pod maską WinForms `NotifyIcon` komunikuje się z powłoką Windows przez funkcję `Shell_NotifyIconW` (biblioteka `shell32.dll`), przekazując strukturę **`NOTIFYICONDATAW`** z nagłówka `shellapi.h`:

```c
typedef struct _NOTIFYICONDATAW {
    DWORD cbSize;          // Rozmiar struktury w bajtach
    HWND  hWnd;            // Uchwyt ukrytego okna odbierającego kliknięcia
    UINT  uID;             // Identyfikator ikony w ramach procesu
    UINT  uFlags;          // Maska bitowa: NIF_ICON | NIF_TIP | NIF_MESSAGE
    UINT  uCallbackMessage;
    HICON hIcon;           // Uchwyt ikony GDI
    WCHAR szTip[64];       // Bufor podpowiedzi: 64 znaki UTF-16 (w tym '\0')
} NOTIFYICONDATAW;
```

Łańcuchy znaków w C kończą się znakiem zerowym `'\0'`, więc w 64-elementowej tablicy `szTip[64]` mieści się maksymalnie _**63 znaki**_ tekstu. Klasa `NotifyIcon` w .NET Framework dla zgodności wstecznej wykonuje w setterze *Text* twarde sprawdzenie `if (value.Length >= 64)` i rzuca **_ArgumentOutOfRangeException_**. Dlatego `FormatujStatusTray` zawsze gwarantuje długość nie większą niż _**63 znaki**_.

<h4>2. Jak powstaje ikona-duch w Eksploratorze Windows</h4>

Zasobnik systemowy należy do procesu **`explorer.exe`**, a komunikacja opiera się na trzech komunikatach `Shell_NotifyIconW`:

| Operacja w C# | Komunikat Win32 | Efekt w procesie `explorer.exe` |
| :--- | :--- | :--- |
| `_tray.Visible = true;` | `NIM_ADD` | Rejestruje parę `(hWnd, uID)` i rysuje ikonę obok zegara |
| `_tray.Text = tip;` | `NIM_MODIFY` | Aktualizuje pole `szTip` istniejącego wpisu |
| `_tray.Visible = false; _tray.Dispose();` | `NIM_DELETE` | Natychmiast usuwa wpis z zasobnika i zwalnia `HICON` |

Jeśli proces zakończy się bez wysłania `NIM_DELETE`, `explorer.exe` nie dowiaduje się o zamknięciu aplikacji. Ikona zostaje w zasobniku jako **_ikona-duch_** aż do najechania na nią kursorem. Dopiero wtedy Eksplorator sprawdza `IsWindow(hWnd)`, dostaje `FALSE` i usuwa osierocony wpis.

<h4>3. Wątkowe flagi ETHREAD i przewaga FormClosed nad FormClosing</h4>

System Windows przechowuje maskę `SetThreadExecutionState` osobno dla każdego wątku w strukturze jądra `ETHREAD`. Jawne wywołanie z samą flagą `ES_CONTINUOUS` w `FormClosed` natychmiast przywraca domyślne wygaszanie ekranu, zanim proces zakończy sprzątanie końcowe.

Zdarzenie `FormClosing` może zostać anulowane (`e.Cancel = true`), co wykorzystujemy przy chowaniu okna do zasobnika. Zdarzenie `FormClosed` wykonuje się dokładnie raz, gdy zamknięcie jest już nieodwołalne, dzięki czemu stanowi jedyne bezpieczne miejsce na zatrzymanie `_timer`, wyłączenie Awake i zwolnienie zasobów GDI.

</div>
</details>

---

## 💻 Projekt Końcowy Modułu 7: Zbuduj i pobierz WinBoostTray.exe

Przełącz zakładkę na **`BoostState.cs`** i zaimplementuj pięć współpracujących metod warstwy domenowej:

1. **`ObliczProcentRam(long uzytyMB, long calkowityMB)`**:
   - dla `calkowityMB <= 0` lub `uzytyMB <= 0` zwraca `0.0`,
   - oblicza zużycie procentowe `(double)uzytyMB / calkowityMB * 100.0` i ogranicza wynik do przedziału `[0.0, 100.0]`.
2. **`ObliczZwolnioneMB(long przedMB, long poMB)`**:
   - oblicza różnicę `przedMB - poMB` (ile MB zajętej pamięci udało się zwolnić),
   - nigdy nie zwraca liczby ujemnej: jeśli pamięć wzrosła (`poMB >= przedMB`), zwraca `0`.
3. **`ZbudujFlagiAwake(bool aktywny, bool utrzymujEkran)`**:
   - gdy *aktywny* jest `false`, zwraca samo `ES_CONTINUOUS`,
   - gdy *aktywny* jest `true`, łączy `ES_CONTINUOUS | ES_SYSTEM_REQUIRED`, a gdy *utrzymujEkran* jest `true`, dokłada także `ES_DISPLAY_REQUIRED`.
4. **`FormatujStatusTray(double procentRam, bool awakeAktywny)`**:
   - dla `double.IsNaN(procentRam)` lub `double.IsNegativeInfinity(procentRam)` przyjmuje `0.0`, a dla `double.IsPositiveInfinity(procentRam)` przyjmuje `100.0`,
   - ogranicza *procentRam* do `[0.0, 100.0]`, formatuje przez `CultureInfo.InvariantCulture` według wzoru `WinBoost | RAM: 64% | Awake: ON` (zaokrąglenie `F0`, status `ON` lub `OFF`),
   - gwarantuje długość wyniku nie większą niż _**63 znaki**_.
5. **`CzyWymagaAutoCzyszczenia(double procentRam, double progProcent, bool trwaCzyszczenie)`**:
   - chroni przed **_re-entrancy_**: gdy *trwaCzyszczenie* jest `true`, zawsze zwraca `false`,
   - zwraca `false`, gdy *procentRam* lub *progProcent* ma wartość `NaN` albo `Infinity`,
   - zwraca `false`, gdy *progProcent* wykracza poza sensowny zakres `1.0..100.0`,
   - w pozostałych przypadkach zwraca `true` wyłącznie wtedy, gdy `procentRam >= progProcent`.

Po zaliczeniu wszystkich testów kliknij **⬇ Pobierz .exe** i uruchom **`WinBoostTray.exe`** na Windows 11.

<data-gate>
<data-csharp-lab title="Projekt Modułu 7: WinBoostTray (MemReduct + Awake + QuickSnap + System Tray)" exe-name="WinBoostTray.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Forms;

public class WinBoostForm : Form
{
    private const double AutoCleanProg = 85.0;
    private const int AutoCleanCooldownSek = 120;

    private readonly Timer _timer = new Timer { Interval = 1000 };
    private readonly NotifyIcon _tray;
    private readonly ContextMenuStrip _trayMenu;
    private readonly Font _fontRam;
    private readonly Font _fontBtn;
    private readonly Font _fontLog;

    private Label _lblRam;
    private ProgressBar _barRam;
    private Button _btnClean;
    private Button _btnAwake;
    private CheckBox _chkAutoClean;
    private Label _lblLog;
    private bool _awakeOn = false;
    private bool _trwaCzyszczenie = false;
    private bool _prawdziweZamkniecie = false;
    private DateTime _ostatnieCzyszczenie = DateTime.MinValue;

    public WinBoostForm()
    {
        Text = "WinBoostTray - Windows 11 Utility";
        ClientSize = new Size(420, 345);
        BackColor = Color.FromArgb(15, 23, 42);
        ForeColor = Color.White;
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;

        _fontRam = new Font("Segoe UI", 18, FontStyle.Bold);
        _fontBtn = new Font("Segoe UI", 10, FontStyle.Bold);
        _fontLog = new Font("Segoe UI", 9);

        _lblRam = new Label
        {
            Text = "RAM: --%",
            Location = new Point(22, 18),
            Size = new Size(376, 36),
            Font = _fontRam,
            ForeColor = Color.FromArgb(56, 189, 248)
        };

        _barRam = new ProgressBar { Location = new Point(22, 62), Size = new Size(376, 22), Minimum = 0, Maximum = 100 };

        _btnClean = StworzPrzycisk("Wyczysc pamiec RAM (Working Set)", 100, Color.FromArgb(16, 185, 129));
        _btnClean.Click += (s, e) => WyczyscRam();

        _btnAwake = StworzPrzycisk("Tryb Awake (nie usypiaj ekranu): OFF", 152, Color.FromArgb(51, 65, 85));
        _btnAwake.Click += (s, e) => PrzelaczAwake();

        var btnSnap = StworzPrzycisk("QuickSnap - Zrzut ekranu na Pulpit + Schowek", 204, Color.FromArgb(139, 92, 246));
        btnSnap.Click += (s, e) => ZrobZrzutEkranu();

        _chkAutoClean = new CheckBox
        {
            Text = string.Format(CultureInfo.InvariantCulture,
                "Auto-czyszczenie RAM powyzej {0:F0}% (cooldown {1} s)", AutoCleanProg, AutoCleanCooldownSek),
            Location = new Point(22, 258),
            Size = new Size(376, 24),
            Font = _fontLog,
            ForeColor = Color.FromArgb(203, 213, 225)
        };

        _lblLog = new Label
        {
            Text = "Minimalizacja lub X chowa program do zasobnika (System Tray).",
            Location = new Point(22, 290),
            Size = new Size(376, 38),
            Font = _fontLog,
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        Controls.AddRange(new Control[] { _lblRam, _barRam, _btnClean, _btnAwake, btnSnap, _chkAutoClean, _lblLog });

        _trayMenu = new ContextMenuStrip();
        _trayMenu.Items.Add("Pokaz okno", null, (s, e) => { Show(); WindowState = FormWindowState.Normal; Activate(); });
        _trayMenu.Items.Add("Wyczysc RAM teraz", null, (s, e) => WyczyscRam());
        _trayMenu.Items.Add("Zrzut ekranu (QuickSnap)", null, (s, e) => ZrobZrzutEkranu());
        _trayMenu.Items.Add(new ToolStripSeparator());
        _trayMenu.Items.Add("Zamknij WinBoostTray", null, (s, e) => { _prawdziweZamkniecie = true; Close(); });

        _tray = new NotifyIcon
        {
            Icon = SystemIcons.Application,
            Visible = true,
            Text = "WinBoostTray",
            ContextMenuStrip = _trayMenu
        };
        _tray.DoubleClick += (s, e) => { Show(); WindowState = FormWindowState.Normal; Activate(); };

        Resize += (s, e) => { if (WindowState == FormWindowState.Minimized) Hide(); };
        FormClosing += (s, e) =>
        {
            if (!_prawdziweZamkniecie && e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true;
                Hide();
            }
        };
        FormClosed += (s, e) =>
        {
            _timer.Stop();
            _timer.Dispose();
            Win32Bridge.UstawAwake(BoostState.ZbudujFlagiAwake(false, false));
            _tray.Visible = false;
            _tray.Dispose();
            _trayMenu.Dispose();
            _fontRam.Dispose();
            _fontBtn.Dispose();
            _fontLog.Dispose();
        };

        _timer.Tick += (s, e) => OdswiezRam();
        OdswiezRam();
        _timer.Start();
    }

    private Button StworzPrzycisk(string tekst, int y, Color tlo)
    {
        var b = new Button
        {
            Text = tekst,
            Location = new Point(22, y),
            Size = new Size(376, 42),
            BackColor = tlo,
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = _fontBtn
        };
        b.FlatAppearance.BorderSize = 0;
        return b;
    }

    private void OdswiezRam()
    {
        ulong total, avail;
        if (!Win32Bridge.PobierzRam(out total, out avail) || total == 0) return;

        long calkowityMB = (long)(total / 1048576UL);
        long uzytyMB = (long)((total - avail) / 1048576UL);
        double pct = BoostState.ObliczProcentRam(uzytyMB, calkowityMB);
        int ipct = Math.Max(0, Math.Min(100, (int)Math.Round(pct)));

        _barRam.Value = ipct;
        _lblRam.Text = string.Format(CultureInfo.InvariantCulture,
            "RAM: {0:F1}%  ({1:F2} / {2:F2} GB)",
            pct, (total - avail) / 1073741824.0, total / 1073741824.0);

        string tip = BoostState.FormatujStatusTray(pct, _awakeOn);
        _tray.Text = tip.Length > 63 ? tip.Substring(0, 63) : tip;

        if (_chkAutoClean.Checked)
        {
            bool minalCooldown = _ostatnieCzyszczenie == DateTime.MinValue
                || (DateTime.UtcNow - _ostatnieCzyszczenie).TotalSeconds >= AutoCleanCooldownSek;

            if (minalCooldown && BoostState.CzyWymagaAutoCzyszczenia(pct, AutoCleanProg, _trwaCzyszczenie))
            {
                WyczyscRam();
            }
        }
    }

    private void WyczyscRam()
    {
        if (_trwaCzyszczenie) return;

        _trwaCzyszczenie = true;
        _btnClean.Enabled = false;
        _lblLog.Text = "Czyszczenie pamieci RAM w tle...";

        Task.Run(() =>
        {
            string komunikat = "";
            bool sukces = false;
            try
            {
                ulong t1, a1, t2, a2;
                Win32Bridge.PobierzRam(out t1, out a1);
                long przedMB = (long)((t1 - a1) / 1048576UL);

                int ok = Win32Bridge.WyczyscWorkingSets();

                Win32Bridge.PobierzRam(out t2, out a2);
                long poMB = (long)((t2 - a2) / 1048576UL);
                long zwolnioneMB = BoostState.ObliczZwolnioneMB(przedMB, poMB);

                komunikat = string.Format(CultureInfo.InvariantCulture,
                    "Zwolniono {0} MB RAM (oczyszczono procesow: {1}).", zwolnioneMB, ok);
                sukces = true;
            }
            catch (Exception ex)
            {
                komunikat = "Blad czyszczenia RAM: " + ex.Message;
            }
            finally
            {
                if (!IsDisposed && IsHandleCreated)
                {
                    BeginInvoke((Action)(() =>
                    {
                        _trwaCzyszczenie = false;
                        _btnClean.Enabled = true;
                        if (sukces)
                        {
                            _ostatnieCzyszczenie = DateTime.UtcNow;
                            OdswiezRam();
                        }
                        _lblLog.Text = komunikat;
                    }));
                }
            }
        });
    }

    private void PrzelaczAwake()
    {
        _awakeOn = !_awakeOn;
        uint flagi = BoostState.ZbudujFlagiAwake(_awakeOn, true);
        Win32Bridge.UstawAwake(flagi);
        _btnAwake.Text = "Tryb Awake (nie usypiaj ekranu): " + (_awakeOn ? "ON" : "OFF");
        _btnAwake.BackColor = _awakeOn ? Color.FromArgb(217, 119, 6) : Color.FromArgb(51, 65, 85);
        OdswiezRam();
        _lblLog.Text = _awakeOn ? "Awake AKTYWNY: Windows nie wygasi ekranu." : "Awake wylaczony: normalne zarzadzanie energia.";
    }

    private void ZrobZrzutEkranu()
    {
        bool byloWidoczne = Visible;
        if (byloWidoczne) Hide();

        var t = new Timer { Interval = 220 };
        t.Tick += (s, e) =>
        {
            t.Stop();
            t.Dispose();
            if (IsDisposed) return;

            try
            {
                Rectangle bounds = Screen.PrimaryScreen.Bounds;
                string plik = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory),
                    "Snap_" + DateTime.Now.ToString("yyyyMMdd_HHmmss", CultureInfo.InvariantCulture) + ".png");

                using (var bmp = new Bitmap(bounds.Width, bounds.Height))
                using (var g = Graphics.FromImage(bmp))
                {
                    g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size);
                    bmp.Save(plik, ImageFormat.Png);
                    Clipboard.SetImage(bmp);
                }
                _lblLog.Text = "Zapisano zrzut na Pulpicie i w schowku (Ctrl+V)!";
            }
            catch (Exception ex)
            {
                _lblLog.Text = "Blad zrzutu: " + ex.Message;
            }

            if (byloWidoczne && !IsDisposed) Show();
        };
        t.Start();
    }
}

class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new WinBoostForm());
    }
}
```

</cs-file>
<cs-file name="BoostState.cs">

```csharp
using System;
using System.Globalization;

public static class BoostState
{
    public const uint ES_CONTINUOUS = 0x80000000U;
    public const uint ES_SYSTEM_REQUIRED = 0x00000001U;
    public const uint ES_DISPLAY_REQUIRED = 0x00000002U;

    public static double ObliczProcentRam(long uzytyMB, long calkowityMB)
    {
        // Zabezpiecz przed calkowityMB <= 0 i uzytyMB <= 0 oraz ogranicz wynik do [0.0, 100.0]
        return 0.0;
    }

    public static long ObliczZwolnioneMB(long przedMB, long poMB)
    {
        // Oblicz różnicę przedMB - poMB; jeśli pamięć wzrosła, zwróć 0
        return 0;
    }

    public static uint ZbudujFlagiAwake(bool aktywny, bool utrzymujEkran)
    {
        // Zbuduj 32-bitową maskę flag Win32 dla SetThreadExecutionState
        return ES_CONTINUOUS;
    }

    public static string FormatujStatusTray(double procentRam, bool awakeAktywny)
    {
        // Obsłuż NaN/Infinity, ogranicz do [0, 100], sformatuj z InvariantCulture i zachowaj limit <= 63 znaków
        return "";
    }

    public static bool CzyWymagaAutoCzyszczenia(double procentRam, double progProcent, bool trwaCzyszczenie)
    {
        // Zabezpiecz przed re-entrancy, NaN/Infinity oraz progProcent spoza [1.0, 100.0]
        return false;
    }
}
```

</cs-file>
<cs-file name="Win32Bridge.cs" readonly>

```csharp
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

public static class Win32Bridge
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

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern uint SetThreadExecutionState(uint esFlags);

    public static bool PobierzRam(out ulong total, out ulong avail)
    {
        var st = new MEMORYSTATUSEX();
        st.dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
        if (!GlobalMemoryStatusEx(ref st)) { total = 0; avail = 0; return false; }
        total = st.ullTotalPhys;
        avail = st.ullAvailPhys;
        return true;
    }

    public static int WyczyscWorkingSets()
    {
        int ok = 0;
        foreach (var p in Process.GetProcesses())
        {
            try { if (EmptyWorkingSet(p.Handle)) ok++; }
            catch { }
            finally { p.Dispose(); }
        }
        return ok;
    }

    public static void UstawAwake(uint flagi)
    {
        SetThreadExecutionState(flagi);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ObliczProcentRam chroni przed zerem/ujemnymi i ogranicza wynik do [0..100]", () => {
    LabAssert.Equal(50.0, BoostState.ObliczProcentRam(8192, 16384));
    LabAssert.Equal(0.0, BoostState.ObliczProcentRam(0, 16384));
    LabAssert.Equal(0.0, BoostState.ObliczProcentRam(-500, 16384));
    LabAssert.Equal(0.0, BoostState.ObliczProcentRam(4096, 0));
    LabAssert.Equal(0.0, BoostState.ObliczProcentRam(4096, -1024));
    LabAssert.Equal(100.0, BoostState.ObliczProcentRam(16384, 16384));
    LabAssert.Equal(100.0, BoostState.ObliczProcentRam(20000, 16384));
});

LabAssert.Test("ObliczZwolnioneMB zwraca dodatnią różnicę i nigdy nie zwraca liczby ujemnej", () => {
    LabAssert.Equal(850L, BoostState.ObliczZwolnioneMB(8000, 7150));
    LabAssert.Equal(0L, BoostState.ObliczZwolnioneMB(8000, 8000));
    LabAssert.Equal(0L, BoostState.ObliczZwolnioneMB(8000, 8350));
    LabAssert.Equal(0L, BoostState.ObliczZwolnioneMB(0, 100));
});

LabAssert.Test("ZbudujFlagiAwake poprawnie składa maskę 32-bitową dla SetThreadExecutionState", () => {
    LabAssert.Equal(0x80000000U, BoostState.ZbudujFlagiAwake(false, false));
    LabAssert.Equal(0x80000000U, BoostState.ZbudujFlagiAwake(false, true));
    LabAssert.Equal(0x80000001U, BoostState.ZbudujFlagiAwake(true, false));
    LabAssert.Equal(0x80000003U, BoostState.ZbudujFlagiAwake(true, true));
});

LabAssert.Test("FormatujStatusTray obsługuje NaN, Infinity, clamping [0..100] i limit 63 znaków", () => {
    string on = BoostState.FormatujStatusTray(64.2, true);
    string off = BoostState.FormatujStatusTray(88.7, false);
    string nan = BoostState.FormatujStatusTray(double.NaN, true);
    string posInf = BoostState.FormatujStatusTray(double.PositiveInfinity, true);
    string negInf = BoostState.FormatujStatusTray(double.NegativeInfinity, false);
    string ujemny = BoostState.FormatujStatusTray(-12.5, true);
    string ponad = BoostState.FormatujStatusTray(135.8, false);

    LabAssert.Equal("WinBoost | RAM: 64% | Awake: ON", on);
    LabAssert.Equal("WinBoost | RAM: 89% | Awake: OFF", off);
    LabAssert.Equal("WinBoost | RAM: 0% | Awake: ON", nan);
    LabAssert.Equal("WinBoost | RAM: 100% | Awake: ON", posInf);
    LabAssert.Equal("WinBoost | RAM: 0% | Awake: OFF", negInf);
    LabAssert.Equal("WinBoost | RAM: 0% | Awake: ON", ujemny);
    LabAssert.Equal("WinBoost | RAM: 100% | Awake: OFF", ponad);

    LabAssert.True(on.Length <= 63);
    LabAssert.True(posInf.Length <= 63);
    LabAssert.True(ponad.Length <= 63);
});

LabAssert.Test("CzyWymagaAutoCzyszczenia blokuje re-entrancy, NaN, Infinity i błędne progi", () => {
    // Podstawowe granice progu przy braku aktywnego czyszczenia
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(84.9, 85.0, false));
    LabAssert.True(BoostState.CzyWymagaAutoCzyszczenia(85.0, 85.0, false));
    LabAssert.True(BoostState.CzyWymagaAutoCzyszczenia(94.2, 85.0, false));

    // Ochrona przed re-entrancy (trwaCzyszczenie == true)
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(95.0, 85.0, true));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(100.0, 1.0, true));

    // Ochrona przed NaN i Infinity
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(double.NaN, 85.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(double.PositiveInfinity, 85.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(double.NegativeInfinity, 85.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(90.0, double.NaN, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(90.0, double.PositiveInfinity, false));

    // Granice akceptowanego zakresu progProcent [1.0, 100.0]
    LabAssert.True(BoostState.CzyWymagaAutoCzyszczenia(1.0, 1.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(0.9, 1.0, false));
    LabAssert.True(BoostState.CzyWymagaAutoCzyszczenia(100.0, 100.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(99.9, 100.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(95.0, 0.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(95.0, -10.0, false));
    LabAssert.False(BoostState.CzyWymagaAutoCzyszczenia(95.0, 100.1, false));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Kiedy projektujesz aplikację desktopową z logiką i P/Invoke</strong>: rozdziel ją na trzy warstwy (`WinBoostForm`, czystą klasę domenową `BoostState` oraz `Win32Bridge`), aby testować reguły bez uruchamiania okna.
- <strong>Kiedy uruchamiasz ciężką operację z przycisku lub timera w `Task.Run`</strong>: zabezpiecz ją flagą stanu przed **_re-entrancy_** i zawsze zdejmuj blokadę w bloku `finally` przez `BeginInvoke` ze strażnikiem `!IsDisposed && IsHandleCreated`.
- <strong>Kiedy zamykasz aplikację działającą w zasobniku</strong>: w `FormClosing` chowaj okno wyłącznie dla `CloseReason.UserClosing`, a w `FormClosed` zatrzymuj timery, resetuj flagi zasilania, ukrywaj ikonę i dopiero wtedy zwalniaj zasoby.

Masz za sobą kompletną drogę od pierwszego `Main()` aż po własne portfolio **11 działających programów `.exe`**, których architekturę i kod w pełni rozumiesz: `SysSpec.exe`, `CipherForge.exe`, `TicTacToe.exe`, `FolderTidy.exe`, `MemReductCLI.exe`, `ProcScout.exe`, `TicTacToeGUI.exe`, `MemReductGUI.exe`, `MemoryCards.exe`, `NeonSnake.exe` oraz `WinBoostTray.exe`.
