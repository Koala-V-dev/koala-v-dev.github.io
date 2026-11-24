# Zasobnik systemowy NotifyIcon, zrzut ekranu i tryb Awake

Narzędzia systemowe takie jak `PowerToys`, `ShareX` czy `Mem Reduct` działają dyskretnie obok zegara i nie zajmują miejsca na pasku zadań. Gdy jednak napiszesz pierwszą taką aplikację intuicyjnie, szybko zderzysz się z trzema problemami systemu Windows 11.

Kliknięcie krzyżyka zamyka cały proces zamiast schować okno, a brak sprzątania zostawia obok zegara martwą ikonę. Z kolei próba aktualizacji etykiety lub schowka z wątku w tle kończy się natychmiastowym wyjątkiem **_InvalidOperationException: Cross-thread operation not valid_** albo **_ThreadStateException_**.

---

## 🔔 Zasobnik systemowy NotifyIcon i cykl życia okna

Klasa `NotifyIcon` rejestruje ikonę procesu w **zasobniku systemowym** Eksploratora Windows. Dołączona do niej kontrolka `ContextMenuStrip` otwiera menu podręczne po kliknięciu prawym przyciskiem myszy.

```csharp
var menu = new ContextMenuStrip();
menu.Items.Add("Pokaz okno", null, (s, e) => { Show(); WindowState = FormWindowState.Normal; });
menu.Items.Add("Zamknij", null, (s, e) => { _prawdziweZamkniecie = true; Close(); });

var tray = new NotifyIcon
{
    Icon = SystemIcons.Application,
    Text = "MojeNarzedzie",
    ContextMenuStrip = menu,
    Visible = true
};
```

Właściwość *Text* ustawia dymek podpowiedzi widoczny po najechaniu kursorem na ikonę. Systemowa struktura Win32 mieści tu maksymalnie _**63 znaki**_ (64. znak to obowiązkowy terminator `'\0'`). Przekroczenie tej granicy rzuca **_ArgumentOutOfRangeException_**, dlatego długie komunikaty trzeba bezpiecznie skracać.

### 🔄 Zdarzenia FormClosing i FormClosed

Aplikacja zasobnikowa musi rozróżniać kliknięcie przycisku <kbd>X</kbd> przez użytkownika od polecenia zamknięcia systemu Windows. Odpowiada za to zdarzenie `FormClosing` oraz właściwość *e.CloseReason*.

```csharp
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
    _trayIcon.Visible = false;
    _trayIcon.Dispose();
    _trayMenu.Dispose();
};
```

Gdy *e.CloseReason* ma wartość `CloseReason.UserClosing`, anulujesz zamknięcie i chowasz okno do zasobnika. Gdy natomiast system wysyła `CloseReason.WindowsShutDown` albo `CloseReason.ApplicationExitCall`, warunek jest fałszywy i program kończy się normalnie.

Zwalnianie zasobów zawsze umieszczaj w `FormClosed`, a nie w `FormClosing`. Zdarzenie `FormClosed` uruchamia się dokładnie raz, gdy zamknięcie nie zostało już anulowane. Ustawienie `_trayIcon.Visible = false` przed `Dispose()` wysyła do Eksploratora Windows sygnał usunięcia ikony.

> [!WARNING]
> Anulowanie każdego `FormClosing` bez sprawdzenia `CloseReason.UserClosing` sprawia, że Twoja aplikacja blokuje wyłączanie i restart systemu Windows 11. Z kolei brak `_trayIcon.Visible = false` w `FormClosed` pozostawia obok zegara **_ikona-duch_**, która znika dopiero po najechaniu na nią kursorem.

---

## ⚡ Flagi bitowe Win32 i tryb Awake

Funkcja Win32 `SetThreadExecutionState` z biblioteki `kernel32.dll` informuje menedżer zasilania Windows, czy bieżący wątek wymaga aktywnego komputera lub monitora. Działa bez uprawnień administratora.

Zamiast przyjmować wiele parametrów `bool`, funkcja oczekuje jednej liczby typu `uint`, czyli _**32 bity**_ spakowane w pojedynczą **maskę bitową**. Każdy bit działa jak niezależny przełącznik.

### 🧮 Zapis szesnastkowy i typ uint

W kodzie Win32 stałe flag zapisuje się w **systemie szesnastkowym** z prefiksem `0x` i sufiksem `U` (oznaczającym typ bez znaku `uint`). Jedna cyfra szesnastkowa reprezentuje dokładnie 4 bity, więc 8 cyfr opisuje pełne _**32 bity**_.

Dlaczego używamy `uint`, a nie `int`? Stała `ES_CONTINUOUS` zapala najwyższy bit numer 31 (`0x80000000U`). W typie `int` bit 31 jest bitem znaku (liczba ujemna), co prowadziłoby do błędów kompilacji i konwersji. W typie `uint` wszystkie _**32 bity**_ są równoprawnymi flagami.

| Stała Win32 | Wartość HEX | Zapalony bit | Znaczenie |
| :--- | :---: | :---: | :--- |
| `ES_SYSTEM_REQUIRED` | `0x00000001U` | bit 0 | Blokuje przejście komputera w stan uśpienia |
| `ES_DISPLAY_REQUIRED` | `0x00000002U` | bit 1 | Blokuje wygaszenie monitora |
| `ES_CONTINUOUS` | `0x80000000U` | bit 31 | Utrzymuje ustawienie aż do kolejnego wywołania |

### 🔧 Cztery operatory na maskach bitowych

Do manipulacji pojedynczymi bitami w zmiennej *maska* służą cztery operatory bitowe C#:

1. **Łączenie (zapalanie) bitów `|`** (bitowe LUB): `maska | flaga` ustawia wybrane bity na `1`, nie zmieniając pozostałych.
2. **Sprawdzanie bitów `&`** (bitowe I): warunek `(maska & flaga) == flaga` zwraca `true` tylko wtedy, gdy wszystkie bity z *flaga* są zapalone w *maska*. Dla `flaga == 0U` należy najpierw zwrócić `false`, ponieważ pusta flaga nie oznacza żadnego ustawienia.
3. **Usuwanie (gaszenie) bitów `& ~`** (I z negacją): operator `~flaga` odwraca wszystkie bity (z `1` robi `0`, z `0` robi `1`), a `maska & ~flaga` zeruje dokładnie te bity, które były zapalone w *flaga*.
4. **Przełączanie bitów `^`** (bitowe XOR): `maska ^ flaga` zamienia `0` na `1`, a `1` na `0` na wskazanych pozycjach. Dwukrotne wykonanie `^` z tą samą flagą przywraca dokładnie stan początkowy.

```csharp
uint maska = ES_CONTINUOUS | ES_SYSTEM_REQUIRED;      // 0x80000001U
maska |= ES_DISPLAY_REQUIRED;                         // zapala bit 1 -> 0x80000003U
maska &= ~ES_DISPLAY_REQUIRED;                        // gasi bit 1   -> 0x80000001U
maska ^= ES_DISPLAY_REQUIRED;                         // przełącza bit 1 -> 0x80000003U
bool maEkran = (maska & ES_DISPLAY_REQUIRED) == ES_DISPLAY_REQUIRED;
```

<data-csharp-bitflags-viz></data-csharp-bitflags-viz>

---

## 📸 Zrzut ekranu, skalowanie DPI i wymóg wątku STA

Przechwycenie głównego monitora w WinForms polega na utworzeniu obiektu `Bitmap` o wymiarach ekranu i skopiowaniu pikseli metodą `Graphics.CopyFromScreen`. Oba obiekty korzystają z natywnych zasobów GDI, dlatego zawsze zamykaj je w bloku `using`.

```csharp
Rectangle ekran = Screen.PrimaryScreen.Bounds;
using (var bmp = new Bitmap(ekran.Width, ekran.Height))
using (var g = Graphics.FromImage(bmp))
{
    g.CopyFromScreen(ekran.Location, Point.Empty, ekran.Size);
    bmp.Save(sciezkaPng, System.Drawing.Imaging.ImageFormat.Png);
    Clipboard.SetImage(bmp);
}
```

### 🖥️ Skalowanie DPI w Windows 11

Współczesne laptopy i monitory 4K często pracują w Windows 11 ze skalowaniem _**125%**_ lub _**150%**_. Jeśli aplikacja WinForms nie deklaruje świadomości DPI w manifeście lub konfiguracji startowej, system wirtualizuje rozdzielczość.

W takim trybie `Screen.PrimaryScreen.Bounds` zwraca wymiary logiczne (na przykład `1280x720` zamiast fizycznych `1920x1080`). W efekcie `Graphics.CopyFromScreen` może zapisać przycięty wycinek pulpitu zamiast pełnego ekranu. Świadomość DPI pozwala odczytać prawdziwą rozdzielczość fizyczną matrycy.

### 📋 Wymóg wątku STA dla schowka

Wywołanie `Clipboard.SetImage(bmp)` korzysta z mechanizmu OLE systemu Windows, który wymaga wątku pracującego w trybie **STA** (jednowątkowy apartament). Główny wątek interfejsu WinForms spełnia ten warunek dzięki atrybutowi `[STAThread]` nad metodą `Main`.

Wątki robocze z puli `Task.Run` działają jednak w trybie wielowątkowym MTA. Wywołanie `Clipboard.SetImage` wewnątrz `Task.Run` natychmiast kończy się wyjątkiem **_ThreadStateException_**. Zapis obrazu do schowka zawsze wykonuj na głównym wątku UI.

> [!IMPORTANT]
> Schowek Windows (`Clipboard`) wymaga wątku **STA**. Jeśli robisz zrzut lub konwersję obrazu w tle, prześlij gotową bitmapę z powrotem na wątek UI przed wywołaniem `Clipboard.SetImage`, a dopiero po skopiowaniu zwolnij ją w bloku `using`.

<data-gate>
<data-connection-matcher title="Dopasuj objaw błędu w aplikacji zasobnikowej do jego przyczyny i rozwiązania">
  <item left="Po zamknięciu programu obok zegara zostaje martwa ikona-duch" right="Brak _trayIcon.Visible = false i Dispose() w zdarzeniu FormClosed"></item>
  <item left="Aplikacja uniemożliwia wyłączenie lub restart Windows 11" right="Ustawienie e.Cancel = true w FormClosing bez warunku CloseReason.UserClosing"></item>
  <item left="Wyjątek ArgumentOutOfRangeException przy aktualizacji podpowiedzi ikony" right="Przekroczenie limitu 63 znaków właściwości NotifyIcon.Text"></item>
  <item left="Wyjątek ThreadStateException przy wywołaniu Clipboard.SetImage" right="Uruchomienie operacji schowka wewnątrz Task.Run (wątek MTA) zamiast wątku STA"></item>
</data-connection-matcher>
</data-gate>

---

## 🧵 Bezpieczny powrót na wątek UI przez BeginInvoke

Długie zadania, takie jak przeglądanie dziesiątek procesów lub zapis dużego pliku, nie mogą blokować głównego wątku okna. Uruchamiamy je w tle metodą `Task.Run`, dzięki czemu interfejs pozostaje płynny i reaguje na kliknięcia.

Wątek roboczy nie ma jednak prawa bezpośrednio modyfikować kontrolek WinForms (na przykład *label.Text*). Próba bezpośredniego zapisu rzuca wyjątek **_InvalidOperationException: Cross-thread operation not valid_**, ponieważ kontrolki Win32 nie są bezpieczne wielowątkowo.

Aby bezpiecznie przekazać aktualizację do pętli komunikatów okna, stosujemy metodę `BeginInvoke` ze strażnikiem cyklu życia:

```csharp
Task.Run(() =>
{
    string wynik = WykonajCiezkaPrace();

    if (!IsDisposed && IsHandleCreated)
    {
        BeginInvoke((Action)(() => _lblStatus.Text = wynik));
    }
});
```

### 🔍 Dlaczego potrzebny jest warunek i rzutowanie na Action

Warunek `!IsDisposed && IsHandleCreated` chroni przed sytuacją wyścigu: użytkownik mógł zamknąć aplikację w momencie, gdy `Task.Run` wciąż pracował. Wywołanie `BeginInvoke` na zwolnionym oknie rzuciłoby **_ObjectDisposedException_**.

Dlaczego w kodzie piszemy `(Action)(() => ...)`, a nie samą lambdę `() => ...`? Sygnatura `Control.BeginInvoke` przyjmuje ogólny typ bazowy `System.Delegate`, a nie konkretny delegat `Action`. W C# gołe wyrażenie lambda nie ma własnego typu i kompilator nie potrafi sam zgadnąć, jaką klasę dziedziczącą po `Delegate` ma utworzyć. Jawne rzutowanie `(Action)` rozwiązuje tę niejednoznaczność.

<data-gate>
<data-sortable-list title="Ułóż bezpieczną sekwencję wykonania zadania w tle i aktualizacji kontrolki UI">
  <item data-correct="4">Zlecenie aktualizacji pętli okna przez BeginInvoke((Action)(() => ...))</item>
  <item data-correct="2">Wykonanie czasochłonnej operacji obliczeniowej lub systemowej w wątku roboczym</item>
  <item data-correct="5">Bezpieczna modyfikacja właściwości kontrolki (np. _lblStatus.Text) na wątku UI</item>
  <item data-correct="1">Uruchomienie zadania w tle przez Task.Run, aby nie zamrozić interfejsu</item>
  <item data-correct="3">Sprawdzenie strażnika !IsDisposed && IsHandleCreated przed powrotem do okna</item>
</data-sortable-list>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Rejestr CPU dla 32 flag, natywne BitBlt w gdi32.dll i SynchronizationContext w WinForms</span>
<span class="deep-dive-badge">OPERATORY BITOWE · GDI32 · WIELOWĄTKOWOŚĆ</span>
</summary>
<div class="deep-dive-content">

<h4>1. 32 przełączniki w jednym rejestrze CPU</h4>

W Win32 API większość funkcji systemowych (`CreateFile`, `MessageBox`, `SetThreadExecutionState`) przyjmuje maskę bitową `DWORD` (`uint` w C#). Cała maska mieści się w jednym 32-bitowym rejestrze CPU (na przykład `EAX`), a operacje na flagach kompilator RyuJIT zamienia na pojedyncze instrukcje x86-64 wykonywane w _**1 cyklu zegara**_:

```asm
; Zapalanie bitu: maska |= 0x00000002U
or   eax, 2

; Testowanie pojedynczej flagi: (maska & 0x00000002U) != 0
test eax, 2
setne al

; Gaszenie bitu: maska &= ~0x00000002U  (~2 = 0xFFFFFFFD)
and  eax, 0FFFFFFFDh

; Przelaczanie bitu: maska ^= 0x00000002U
xor  eax, 2
```

Dlaczego w teście złożonej maski piszemy `(maska & flaga) == flaga`, a nie `(maska & flaga) != 0`? Jeśli *flaga* ma zapalone dwa bity (`ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED = 0x00000003U`), a w *maska* zapalony jest tylko bit 0 (`0x80000001U`), to wynik `maska & flaga` wynosi `0x00000001U`. Warunek `!= 0` zwróciłby błędnie `true`, mimo że bit 1 był zgaszony. Porównanie `== flaga` gwarantuje obecność każdego wymaganego bitu.

<h4>2. Natywne BitBlt pod maską Graphics.CopyFromScreen</h4>

Metoda `Graphics.CopyFromScreen` to nakładka na trzy niskopoziomowe wywołania z natywnych bibliotek `user32.dll` i `gdi32.dll`:

```c
HDC hdcScreen = GetDC(NULL);
BitBlt(hdcDest, 0, 0, width, height, hdcScreen, srcX, srcY, SRCCOPY);
ReleaseDC(NULL, hdcScreen);
```

Stała `SRCCOPY` (`0x00CC0020`) nakazuje skopiowanie pikseli 1:1 bez mieszania z tłem. Pojedynczy zrzut ekranu `1920x1080` w 32-bitowym formacie ARGB zajmuje `1920 * 1080 * 4 = 8 294 400` bajtów (ponad _**8 MB**_ w natywnej pamięci GDI). Bez bloku `using` kilkanaście zrzutów zużywa ponad 100 MB pamięci niezarządzanej i zostawia otwarte uchwyty `HBITMAP` oraz `HDC`.

<h4>3. Control.BeginInvoke, Control.Invoke i ryzyko zakleszczenia</h4>

Każde okno WinForms (natywny uchwyt `HWND`) należy wyłącznie do jednego wątku UI, który kręci pętlą komunikatów (`GetMessage` i `DispatchMessage` wewnątrz `Application.Run`). Wewnętrzne struktury kontrolek Win32 nie mają blokad wielowątkowych, dlatego WinForms sprawdza właściwość `InvokeRequired` i rzuca **_InvalidOperationException: Cross-thread operation not valid_** przy próbie dostępu z innego wątku.

| Mechanizm marshalingu na wątek UI | Wywołanie Win32 pod maską | Zachowanie wątku roboczego | Ryzyko zakleszczenia |
| :--- | :--- | :--- | :--- |
| `Control.BeginInvoke` | `PostMessage` (kolejka okna) | Wraca natychmiast (asynchronicznie) | Brak (zalecany standard w WinForms) |
| `Control.Invoke` | `SendMessage` (synchronicznie) | Blokuje się aż wątek UI wykona akcję | Wysokie, jeśli wątek UI czeka na `task.Wait()` |
| `SynchronizationContext.Post` | `WindowsFormsSynchronizationContext` | Wraca natychmiast (używane przez `async/await`) | Brak |

</div>
</details>

---

## 💻 Zadanie praktyczne: Flagi bitowe, nazwy zrzutów i limit zasobnika

W klasie `SystemHelper` zaimplementuj sześć współpracujących metod:

1. **`ZbudujFlagiAwake(bool aktywny, bool utrzymujEkran)`**:
   - gdy *aktywny* ma wartość `false`, zwraca samo `ES_CONTINUOUS` (niezależnie od *utrzymujEkran*),
   - gdy *aktywny* ma wartość `true`, a *utrzymujEkran* ma wartość `false`, zwraca `ES_CONTINUOUS` połączone z `ES_SYSTEM_REQUIRED`,
   - gdy oba parametry są `true`, zwraca `ES_CONTINUOUS` połączone z `ES_SYSTEM_REQUIRED` i `ES_DISPLAY_REQUIRED`.
2. **`CzyFlagaUstawiona(uint maska, uint flaga)`**:
   - dla `flaga == 0U` zwraca `false`,
   - w przeciwnym razie sprawdza operatorem `&`, czy wszystkie bity z *flaga* są ustawione w *maska*.
3. **`PrzelaczFlage(uint maska, uint flaga)`**:
   - przełącza wskazane bity w *maska* za pomocą operatora XOR (`^`).
4. **`UsunFlage(uint maska, uint flaga)`**:
   - gasi wskazane bity w *maska* za pomocą operatorów `&` i `~`, nie naruszając pozostałych bitów.
5. **`GenerujNazweZrzutu(DateTime czas)`**:
   - zwraca sortowalną nazwę pliku PNG zaczynającą się od `Snap_`, z datą (rok 4 cyfry, miesiąc 2 cyfry, dzień 2 cyfry), podkreślnikiem, godziną w formacie 24-godzinnym (godzina, minuta, sekunda po 2 cyfry) oraz rozszerzeniem `.png`. Przykład wyniku: `Snap_20260105_030409.png`. Użyj `CultureInfo.InvariantCulture`.
6. **`BezpiecznyTekstZasobnika(string tekst)`**:
   - dla `null` lub pustego napisu zwraca `""`,
   - dla napisów o długości do _**63 znaki**_ włącznie zwraca oryginalny napis bez zmian,
   - dla napisów dłuższych niż _**63 znaki**_ ucina tekst do 60 pierwszych znaków i dopisuje `"..."` (łączna długość 63 znaki).

<data-gate>
<data-csharp-lab title="Zadanie: Flagi bitowe Awake, generator nazw PNG i limit tekstu NotifyIcon" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Globalization;

public static class SystemHelper
{
    public const uint ES_CONTINUOUS = 0x80000000U;
    public const uint ES_SYSTEM_REQUIRED = 0x00000001U;
    public const uint ES_DISPLAY_REQUIRED = 0x00000002U;

    public static uint ZbudujFlagiAwake(bool aktywny, bool utrzymujEkran)
    {
        // Zbuduj odpowiednią 32-bitową maskę flag Win32
        return ES_CONTINUOUS;
    }

    public static bool CzyFlagaUstawiona(uint maska, uint flaga)
    {
        // Sprawdź, czy wszystkie bity z flaga są zapalone w maska (dla flaga == 0U zwróć false)
        return false;
    }

    public static uint PrzelaczFlage(uint maska, uint flaga)
    {
        // Przełącz wybrane bity w maska operatorem bitowym XOR
        return maska;
    }

    public static uint UsunFlage(uint maska, uint flaga)
    {
        // Wyzeruj wybrane bity w maska bez zmiany pozostałych bitów
        return maska;
    }

    public static string GenerujNazweZrzutu(DateTime czas)
    {
        // Zbuduj sortowalną nazwę pliku PNG z wiodącymi zerami i CultureInfo.InvariantCulture
        return "";
    }

    public static string BezpiecznyTekstZasobnika(string tekst)
    {
        // Obsłuż null/pusty napis oraz twardy limit 63 znaków (powyżej: 60 znaków + "...")
        return "";
    }

    static void Main()
    {
        uint maska = ZbudujFlagiAwake(true, true);
        Console.WriteLine("Maska HEX: 0x" + maska.ToString("X8"));
        Console.WriteLine("Ekran aktywny: " + CzyFlagaUstawiona(maska, ES_DISPLAY_REQUIRED));
        Console.WriteLine("Po usunieciu ekranu: 0x" + UsunFlage(maska, ES_DISPLAY_REQUIRED).ToString("X8"));
        Console.WriteLine("Plik: " + GenerujNazweZrzutu(new DateTime(2026, 11, 21, 14, 30, 5)));
        Console.WriteLine("Tray: " + BezpiecznyTekstZasobnika("WinBoostTray dziala poprawnie"));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ZbudujFlagiAwake obsługuje wszystkie 4 kombinacje parametrów i bit 31", () => {
    LabAssert.Equal(0x80000000U, SystemHelper.ZbudujFlagiAwake(false, false));
    LabAssert.Equal(0x80000000U, SystemHelper.ZbudujFlagiAwake(false, true));
    LabAssert.Equal(0x80000001U, SystemHelper.ZbudujFlagiAwake(true, false));
    LabAssert.Equal(0x80000003U, SystemHelper.ZbudujFlagiAwake(true, true));
});

LabAssert.Test("CzyFlagaUstawiona testuje pojedyncze bity, złożone maski, bit 31 i przypadek zerowy", () => {
    uint pelna = SystemHelper.ES_CONTINUOUS | SystemHelper.ES_SYSTEM_REQUIRED | SystemHelper.ES_DISPLAY_REQUIRED;
    uint tylkoSystem = SystemHelper.ES_CONTINUOUS | SystemHelper.ES_SYSTEM_REQUIRED;
    uint wylaczony = SystemHelper.ES_CONTINUOUS;

    LabAssert.True(SystemHelper.CzyFlagaUstawiona(pelna, SystemHelper.ES_CONTINUOUS));
    LabAssert.True(SystemHelper.CzyFlagaUstawiona(pelna, SystemHelper.ES_SYSTEM_REQUIRED));
    LabAssert.True(SystemHelper.CzyFlagaUstawiona(pelna, SystemHelper.ES_DISPLAY_REQUIRED));
    LabAssert.True(SystemHelper.CzyFlagaUstawiona(pelna, SystemHelper.ES_SYSTEM_REQUIRED | SystemHelper.ES_DISPLAY_REQUIRED));

    LabAssert.True(SystemHelper.CzyFlagaUstawiona(tylkoSystem, SystemHelper.ES_SYSTEM_REQUIRED));
    LabAssert.False(SystemHelper.CzyFlagaUstawiona(tylkoSystem, SystemHelper.ES_DISPLAY_REQUIRED));
    LabAssert.False(SystemHelper.CzyFlagaUstawiona(tylkoSystem, SystemHelper.ES_SYSTEM_REQUIRED | SystemHelper.ES_DISPLAY_REQUIRED));

    LabAssert.False(SystemHelper.CzyFlagaUstawiona(wylaczony, SystemHelper.ES_SYSTEM_REQUIRED));
    LabAssert.False(SystemHelper.CzyFlagaUstawiona(0U, SystemHelper.ES_CONTINUOUS));
    LabAssert.False(SystemHelper.CzyFlagaUstawiona(pelna, 0U));
    LabAssert.False(SystemHelper.CzyFlagaUstawiona(0U, 0U));
});

LabAssert.Test("PrzelaczFlage przełącza bity operatorem XOR i po 2 wywołaniach wraca do stanu początkowego", () => {
    uint start = SystemHelper.ES_CONTINUOUS | SystemHelper.ES_SYSTEM_REQUIRED;
    uint poPierwszym = SystemHelper.PrzelaczFlage(start, SystemHelper.ES_DISPLAY_REQUIRED);
    uint poDrugim = SystemHelper.PrzelaczFlage(poPierwszym, SystemHelper.ES_DISPLAY_REQUIRED);

    LabAssert.Equal(0x80000003U, poPierwszym);
    LabAssert.Equal(start, poDrugim);

    uint bezBitu31 = SystemHelper.PrzelaczFlage(SystemHelper.ES_CONTINUOUS, SystemHelper.ES_CONTINUOUS);
    LabAssert.Equal(0U, bezBitu31);
    LabAssert.Equal(SystemHelper.ES_CONTINUOUS, SystemHelper.PrzelaczFlage(bezBitu31, SystemHelper.ES_CONTINUOUS));
});

LabAssert.Test("UsunFlage gasi wybrane bity bez naruszania pozostałych", () => {
    uint pelna = SystemHelper.ES_CONTINUOUS | SystemHelper.ES_SYSTEM_REQUIRED | SystemHelper.ES_DISPLAY_REQUIRED;

    LabAssert.Equal(0x80000001U, SystemHelper.UsunFlage(pelna, SystemHelper.ES_DISPLAY_REQUIRED));
    LabAssert.Equal(0x80000000U, SystemHelper.UsunFlage(pelna, SystemHelper.ES_SYSTEM_REQUIRED | SystemHelper.ES_DISPLAY_REQUIRED));
    LabAssert.Equal(0x00000003U, SystemHelper.UsunFlage(pelna, SystemHelper.ES_CONTINUOUS));

    uint tylkoSystem = SystemHelper.ES_CONTINUOUS | SystemHelper.ES_SYSTEM_REQUIRED;
    LabAssert.Equal(tylkoSystem, SystemHelper.UsunFlage(tylkoSystem, SystemHelper.ES_DISPLAY_REQUIRED));
});

LabAssert.Test("GenerujNazweZrzutu tworzy sortowalną nazwę PNG z wiodącymi zerami", () => {
    LabAssert.Equal("Snap_20261121_143005.png", SystemHelper.GenerujNazweZrzutu(new DateTime(2026, 11, 21, 14, 30, 5)));
    LabAssert.Equal("Snap_20260105_030409.png", SystemHelper.GenerujNazweZrzutu(new DateTime(2026, 1, 5, 3, 4, 9)));
    LabAssert.Equal("Snap_20261231_235959.png", SystemHelper.GenerujNazweZrzutu(new DateTime(2026, 12, 31, 23, 59, 59)));
});

LabAssert.Test("BezpiecznyTekstZasobnika obsługuje null, pusty tekst, dokładnie 63 znaki i 64+ znaków", () => {
    LabAssert.Equal("", SystemHelper.BezpiecznyTekstZasobnika(null));
    LabAssert.Equal("", SystemHelper.BezpiecznyTekstZasobnika(""));
    LabAssert.Equal("WinBoostTray", SystemHelper.BezpiecznyTekstZasobnika("WinBoostTray"));

    string dokladnie63 = new string('A', 63);
    LabAssert.Equal(dokladnie63, SystemHelper.BezpiecznyTekstZasobnika(dokladnie63));

    string znaki64 = new string('B', 64);
    string skrocony64 = SystemHelper.BezpiecznyTekstZasobnika(znaki64);
    LabAssert.Equal(63, skrocony64.Length);
    LabAssert.Equal(new string('B', 60) + "...", skrocony64);

    string dlugi = "WinBoostTray | RAM: 78% | Awake: ON | Auto-czyszczenie aktywne co 120 sekund";
    string skroconyDlugi = SystemHelper.BezpiecznyTekstZasobnika(dlugi);
    LabAssert.Equal(63, skroconyDlugi.Length);
    LabAssert.True(skroconyDlugi.EndsWith("..."));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Kiedy chowasz okno do zasobnika w `FormClosing`</strong>: anuluj zamknięcie tylko dla `CloseReason.UserClosing`, aby nie blokować zamykania Windows, a w `FormClosed` zawsze ustaw `_trayIcon.Visible = false` i wywołaj `Dispose()`.
- <strong>Kiedy przekazujesz maski bitowe do Win32 API</strong>: używaj typu `uint` (bez znaku dla bitu 31), zapalaj flagi operatorem `|`, gaś przez `& ~`, przełączaj przez `^`, a testuj przez `(maska & flaga) == flaga`.
- <strong>Kiedy przechwytujesz ekran i zapisujesz go do schowka</strong>: zamykaj `Bitmap` i `Graphics` w bloku `using`, pamiętaj o skalowaniu DPI w Windows 11 oraz wykonuj `Clipboard.SetImage` wyłącznie na wątku **STA**.
- <strong>Kiedy aktualizujesz kontrolki WinForms z `Task.Run`</strong>: zawsze sprawdzaj `!IsDisposed && IsHandleCreated` i używaj `BeginInvoke((Action)(() => ...))` z jawnym rzutowaniem na `Action`.
