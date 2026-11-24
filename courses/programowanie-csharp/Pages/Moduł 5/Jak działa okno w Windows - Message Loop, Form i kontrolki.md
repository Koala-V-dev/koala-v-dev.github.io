# Jak działa okno w Windows - Message Loop, Form i kontrolki

Do tej pory wszystkie programy działały liniowo w konsoli: startowały w `Main()`, wykonywały instrukcje po kolei i natychmiast się kończyły. Gdy program konsolowy wywołuje `Console.ReadLine()`, stoi w jednym miejscu i czeka wyłącznie na naciśnięcie klawisza <kbd>Enter</kbd>.

W aplikacji okienkowej ten model się załamuje. Użytkownik może w dowolnej kolejności kliknąć przycisk, zmienić rozmiar okna, nacisnąć <kbd>Alt</kbd>+<kbd>F4</kbd> albo nie robić nic przez godzinę. Dlatego program okienkowy odwraca sterowanie: tworzy okno, oddaje kontrolę systemowi Windows i budzi się dopiero w reakcji na zdarzenia. Ten mechanizm nazywa się _**pętla zdarzeń**_ i stanowi fundament technologii **Windows Forms (WinForms)**.

---

## 🪟 Pętla komunikatów Windows i jedyny wątek UI

Każdy wątek tworzący okno w systemie Windows otrzymuje od jądra własną **kolejkę komunikatów**. Wywołanie `Application.Run(new MojeOkno())` uruchamia nieskończoną pętlę, która usypia wątek przy bezczynności (0% użycia procesora).

Gdy użytkownik poruszy myszą, kliknie przycisk lub przełączy okno, system wrzuca komunikat do kolejki i natychmiast budzi wątek. Pętla pobiera komunikat, przekazuje go do odpowiedniej kontrolki i wraca w stan oczekiwania.

<data-csharp-msgloop-viz></data-csharp-msgloop-viz>

Całe okno oraz wszystkie jego kontrolki obsługuje **jeden dedykowany wątek UI** (wątek interfejsu użytkownika). Metoda `Main()` musi być oznaczona atrybutem `[STAThread]`, który ustawia dla tego wątku model _**Single-Threaded Apartment**_ wymagany przez podsystem graficzny i komponenty powłoki Windows.

> [!WARNING]
> Nigdy nie wywołuj `Thread.Sleep(...)` ani długich obliczeń wprost wewnątrz obsługi kliknięcia. Zablokujesz jedyny wątek UI: pętla przestanie odbierać komunikaty, okno nie odrysuje swojego wnętrza, a Windows oznaczy pasek tytułu etykietą **_„Brak odpowiedzi”_**.

> [!IMPORTANT]
> Pominięcie atrybutu `[STAThread]` nad `Main()` uruchamia wątek w trybie MTA. Samo okno się wyświetli, ale pierwsza próba otwarcia okna wyboru pliku (`OpenFileDialog`) lub zapisu do schowka (`Clipboard.SetText`) rzuci wyjątek **_ThreadStateException_**.

---

## ⚙️ Tryb konsolowy, tryb okienkowy i start aplikacji

Kompilator `csc.exe` zapisuje w nagłówku PE pliku `.exe` pole `Subsystem`. Informuje ono jądro systemu Windows, czy przed uruchomieniem `Main()` należy otworzyć okno terminala.

| Cecha | `/target:exe` (Konsola) | `/target:winexe` (Okno GUI) |
| :--- | :--- | :--- |
| Wartość `Subsystem` w nagłówku PE | `IMAGE_SUBSYSTEM_WINDOWS_CUI` (3) | `IMAGE_SUBSYSTEM_WINDOWS_GUI` (2) |
| Czarne okno terminala przy starcie | Tworzone automatycznie przez system | Brak: pojawia się wyłącznie Twój obiekt `Form` |
| Domyślne strumienie `Console.Out` | Podpięte do okna konsoli | Brak konsoli (zapis trafia w próżnię) |
| Wymagane biblioteki `.dll` | Tylko `mscorlib.dll` i `System.dll` | Dodatkowo `System.Windows.Forms.dll` i `System.Drawing.dll` |

Zanim w `Main()` utworzysz pierwszy obiekt okna, wywołaj dwie statyczne metody konfiguracyjne klasy `Application`:

```csharp
[STAThread]
static void Main()
{
    Application.EnableVisualStyles();
    Application.SetCompatibleTextRenderingDefault(false);
    Application.Run(new MojeOkno());
}
```

- `Application.EnableVisualStyles()` włącza nowoczesne **style wizualne** systemu Windows 11 (zaokrąglone przyciski, cienie, bieżący motyw). Bez tego wywołania kontrolki wracają do kanciastego wyglądu z czasów Windows 95.
- `Application.SetCompatibleTextRenderingDefault(false)` przełącza rysowanie napisów na szybszy, natywny mechanizm GDI (`TextRenderer`) zamiast starszego GDI+. Czcionki są wtedy ostrzejsze i spójne z resztą systemu.

<data-gate>
<data-connection-matcher title="Dopasuj element startowy WinForms do jego skutku w działającej aplikacji">
  <item left="[STAThread]" right="Włącza model COM STA; brak powoduje ThreadStateException w schowku i oknach plików"></item>
  <item left="/target:winexe" right="Ustawia podsystem WINDOWS_GUI w nagłówku PE i uruchamia program bez okna konsoli"></item>
  <item left="Application.Run(okno)" right="Uruchamia pętlę komunikatów Windows i utrzymuje okno przy życiu do zamknięcia"></item>
  <item left="Application.EnableVisualStyles()" right="Włącza nowoczesny wygląd kontrolek Windows 11 zamiast klasycznego stylu Windows 95"></item>
  <item left="Thread.Sleep(5000) w obsłudze kliknięcia" right="Blokuje jedyny wątek UI, wstrzymuje odrysowanie i wywołuje stan Brak odpowiedzi"></item>
</data-connection-matcher>
</data-gate>

---

## 📐 Układ współrzędnych ekranu, ClientSize i WorkingArea

W grafice komputerowej i w WinForms **układ współrzędnych** różni się od osi znanej z matematyki. Punkt `(0, 0)` leży zawsze w **lewym górnym rogu** ekranu (dla pozycji okna) lub w lewym górnym rogu wnętrza okna (dla kontrolek).

Oś X rośnie standardowo w prawo. Oś Y rośnie natomiast **w dół**: im większa współrzędna *y*, tym niżej na ekranie znajduje się dany element.

Projektując geometrię okna, musisz rozróżnić dwa zestawy właściwości: wymiary całego okna od jego wnętrza oraz pełny ekran od obszaru roboczego.

| Para właściwości | Co dokładnie obejmuje | Kiedy jej używasz |
| :--- | :--- | :--- |
| `Form.Size` vs `Form.ClientSize` | `Size` liczy ramki i pasek tytułu; `ClientSize` to wyłącznie użyteczne wnętrze okna | Do ustalania miejsca na kontrolki zawsze ustawiaj `ClientSize` |
| `Screen.Bounds` vs `Screen.WorkingArea` | `Bounds` to pełny monitor; `WorkingArea` odejmuje pasek zadań Windows | Do pozycjonowania okna używaj `WorkingArea`, aby nie wjechało pod pasek zadań |

> [!IMPORTANT]
> Grubość paska tytułu i ramek zależy od wersji Windows oraz skalowania ekranu (DPI). Ustawienie `ClientSize` gwarantuje, że wnętrze na kontrolki ma dokładnie zadane wymiary na każdym monitorze. Pamiętaj też o `WorkingArea.X` oraz `WorkingArea.Y`: jeśli użytkownik przeniósł pasek zadań na górę lub lewą krawędź ekranu, początek obszaru roboczego nie wynosi `(0, 0)`.

---

## 🧱 Anatomia klasy Form i podstawowe kontrolki

W WinForms każde okno jest zwykłą klasą C# dziedziczącą po `System.Windows.Forms.Form`. Dzięki dziedziczeniu Twoja klasa `MojeOkno` od razu otrzymuje zestaw gotowych właściwości: `Text` (tytuł na pasku), `ClientSize`, `BackColor`, `ForeColor`, `StartPosition` oraz kolekcję `Controls`.

Wszystkie widoczne elementy interfejsu dziedziczą ze wspólnej klasy bazowej `Control`, więc obsługujesz je za pomocą tych samych właściwości:
- `Location` (`Point`): współrzędne lewego górnego rogu kontrolki wewnątrz rodzica.
- `Size` (`Size`): szerokość i wysokość kontrolki w pikselach.
- `AutoSize` (`bool`): automatyczne dopasowanie rozmiaru do długości napisu.
- `Enabled` (`bool`): wartość `false` blokuje klikanie i wyszarza kontrolkę.

Pięć podstawowych kontrolek pozwala zbudować większość prostych narzędzi okienkowych:
- **`Label`**: wyświetla statyczny lub aktualizowany tekst (zwykle z `AutoSize = true`).
- **`Button`**: przycisk uruchamiający akcję po kliknięciu (`Click`).
- **`TextBox`**: pole edycyjne do wpisywania tekstu przez użytkownika (`Text`).
- **`CheckBox`**: pole wyboru typu tak lub nie (`Checked`).
- **`Panel`**: kontener grupujący inne kontrolki; posiada własną kolekcję `Controls` i własny punkt `(0, 0)`.

Stan okna, na przykład licznik kliknięć lub referencje do kontrolek wymagających późniejszej zmiany, przechowuj w **polach prywatnych klasy** (takich jak `_klikniecia` i `_etykieta`), a nie w zmiennych lokalnych konstruktora. Konstruktor kończy pracę zaraz po utworzeniu okna, podczas gdy obiekt okna i jego pola żyją aż do zamknięcia aplikacji.

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

public class MojeOkno : Form
{
    private int _klikniecia = 0;
    private readonly Label _etykieta;

    public MojeOkno()
    {
        Text = "Moja pierwsza aplikacja Windows 11";
        ClientSize = new Size(420, 220);
        BackColor = Color.FromArgb(15, 23, 42);
        ForeColor = Color.White;
        StartPosition = FormStartPosition.CenterScreen;

        _etykieta = new Label
        {
            Text = "Kliknij przycisk ponizej:",
            Location = new Point(24, 24),
            AutoSize = true,
            Font = new Font("Segoe UI", 12, FontStyle.Bold)
        };

        var przycisk = new Button
        {
            Text = "Kliknij mnie!",
            Location = new Point(24, 70),
            Size = new Size(180, 42),
            BackColor = Color.FromArgb(14, 165, 233),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat
        };
        przycisk.FlatAppearance.BorderSize = 0;
        przycisk.Click += ObsluzKlikniecie;

        Controls.Add(_etykieta);
        Controls.Add(przycisk);
    }

    private void ObsluzKlikniecie(object sender, EventArgs e)
    {
        _klikniecia++;
        _etykieta.Text = "Liczba klikniec: " + _klikniecia;
    }
}
```

> [!TIP]
> Samo wywołanie `new Button()` tworzy obiekt wyłącznie w pamięci RAM. Kontrolka pojawi się w oknie dopiero wtedy, gdy dodasz ją do kolekcji metodą `Controls.Add(...)`.

Zapis `przycisk.Click += ObsluzKlikniecie;` podłącza metodę reagującą na kliknięcie przycisku. Dokładny mechanizm delegatów, zdarzeń i operatora `+=` poznasz w następnej lekcji.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Uchwyt okna HWND, funkcja WndProc w user32.dll i model COM STA</span>
<span class="deep-dive-badge">WIN32 API · USER32 · COM STA</span>
</summary>
<div class="deep-dive-content">

<h4>1. WinForms to cienka warstwa zarządzana nad natywnym Win32 API (user32.dll)</h4>
Każda kontrolka dziedzicząca po `Control` (zarówno `Form`, jak i `Button` czy `Label`) posiada pod spodem natywny uchwyt okna w jądrze systemu: **`HWND`**, dostępny w C# jako `IntPtr control.Handle`. Kiedy tworzysz `new Form()` i wywołujesz `Application.Run(okno)`, środowisko WinForms wywołuje przez P/Invoke funkcje `RegisterClassExW` oraz `CreateWindowExW` z `user32.dll`. Dopiero wtedy podsystem graficzny Windows (`win32k.sys`) alokuje strukturę okna w pamięci jądra i przypisuje mu unikalny uchwyt `HWND`.

<h4>2. Surowe komunikaty Win32 i funkcja zwrotna WndProc</h4>
System Windows nie zna zdarzeń C# takich jak `Click` czy `FormClosing`. Wszystkie zdarzenia trafiają do kolejki wątku jako struktury `MSG` z 32-bitowym kodem komunikatu oraz dwoma parametrami `wParam` i `lParam`:
- `WM_LBUTTONDOWN` (`0x0201`): wciśnięcie lewego przycisku myszy (`lParam` zawiera współrzędne X i Y upakowane w dwóch słowach 16-bitowych).
- `WM_PAINT` (`0x000F`): prośba systemu o odrysowanie fragmentu okna, na przykład po odsłonięciu go przez inne okno.
- `WM_CLOSE` (`0x0010`): użytkownik kliknął przycisk zamknięcia X lub nacisnął <kbd>Alt</kbd>+<kbd>F4</kbd>.
- `WM_QUIT` (`0x0012`): sygnał zakończenia pętli komunikatów.

W czystym języku C pętla komunikatów i funkcja zwrotna wyglądają następująco:

```c
// Czysty Win32 API w C (user32.dll)
LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg)
    {
        case WM_LBUTTONDOWN:
            // Obsluga klikniecia lewym przyciskiem
            return 0;
        case WM_CLOSE:
            DestroyWindow(hwnd);
            return 0;
        case WM_DESTROY:
            PostQuitMessage(0); // Wstawia WM_QUIT (0x0012) do kolejki
            return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

// Glowna petla w WinMain:
MSG m;
while (GetMessageW(&m, NULL, 0, 0) > 0) // Zasypia w jadrze, gdy kolejka pusta (0% CPU)
{
    TranslateMessage(&m);
    DispatchMessageW(&m); // Wywoluje WndProc dla docelowego HWND
}
```

W WinForms dokładnie tę samą pętlę realizuje `Application.Run(...)`. W każdej klasie dziedziczącej po `Form` możesz nadpisać metodę `protected override void WndProc(ref Message m)` i przechwytywać surowe kody `0x0201` czy `0x0010`, zanim WinForms zamieni je na zdarzenia C#.

<h4>3. Dlaczego [STAThread] jest obowiązkowy dla aplikacji okienkowych</h4>
Atrybut `[STAThread]` nakazuje CLR wywołać natywną funkcję `CoInitializeEx(NULL, COINIT_APARTMENTTHREADED)` przed wejściem do `Main()`. Ustawia to bieżący wątek jako **Single-Threaded Apartment (STA)** w modelu komponentów COM.

Wiele kluczowych usług powłoki Windows (schowek systemowy `Clipboard.SetText`, okna wyboru plików `OpenFileDialog` i `SaveFileDialog`, mechanizm Drag & Drop oraz podsystem ułatwień dostępu UI Automation) to natywne obiekty COM napisane bez wewnętrznych blokad wielowątkowych. COM gwarantuje im bezpieczeństwo w ten sposób, że tworzy dla wątku STA ukryte okno pomocnicze i kolejkę komunikatów. Jeśli inny wątek wywoła taki obiekt COM, wywołanie jest serializowane jako komunikat w kolejce wątku STA.

Bez `[STAThread]` wątek startuje w trybie MTA (Multi-Threaded Apartment). Samo okno `Form` się wyświetli, ale pierwsza próba otwarcia `OpenFileDialog` lub zapisu do schowka zakończy się wyjątkiem **_System.Threading.ThreadStateException_**.

</div>
</details>

---

## 💻 Zadanie praktyczne: Konfigurator geometrii okna i pierwsze pobieralne GUI

Aplikacje okienkowe działają na monitorach o bardzo różnych rozdzielczościach: od małego ekranu laptopa `800x600` po monitor 4K `3840x2160`. Jeśli okno ma na sztywno ustawiony rozmiar `1024x768`, na małym ekranie jego przyciski uciekną poza dolną krawędź monitora.

W zakładce **`KonfiguracjaOkna.cs`** zaimplementuj dwie statyczne metody pomocnicze używane przez `Program.cs`:

1. `ObliczSrodek(int szerEkranu, int wysEkranu, int szerOkna, int wysOkna, out int x, out int y)`:
   - wylicza współrzędne lewego górnego rogu okna tak, aby znalazło się na środku ekranu (połowa różnicy między wymiarem ekranu a wymiarem okna, dzielenie całkowite),
   - chroni każdą oś osobno przed wyjściem poza lewą lub górną krawędź monitora: jeśli okno jest szersze niż ekran, *x* wynosi `0`; jeśli jest wyższe niż ekran, *y* wynosi `0`.

2. `DopasujRozmiarOkna(int szerEkranu, int wysEkranu, int zadanaSzer, int zadanaWys, int margines, out int szer, out int wys)`:
   - gwarantuje minimalny czytelny rozmiar okna (`MinSzerokosc = 320`, `MinWysokosc = 200`),
   - jeśli podany *margines* jest ujemny, traktuje go jak `0`,
   - wylicza maksymalną dostępną szerokość i wysokość po odjęciu marginesu z obu stron ekranu (lewa i prawa oraz góra i dół); jeżeli ekran po odjęciu podwójnego marginesu daje mniej niż rozmiar minimalny, górny limit wynosi dokładnie `MinSzerokosc` lub `MinWysokosc`,
   - dopasowuje każdą oś niezależnie do dozwolonego zakresu: zbyt małe okno powiększa do minimum, a zbyt duże zmniejsza do dostępnego maksimum.

Po zaliczeniu wszystkich testów kliknij **Pobierz .exe** i uruchom **`PierwszeOkno.exe`** na Windows 11.

<data-gate>
<data-csharp-lab title="Zadanie: Konfigurator okna WinForms (/target:winexe)" exe-name="PierwszeOkno.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        Rectangle obszar = Screen.PrimaryScreen.WorkingArea;
        int szer, wys, posX, posY;
        KonfiguracjaOkna.DopasujRozmiarOkna(obszar.Width, obszar.Height, 480, 240, 32, out szer, out wys);
        KonfiguracjaOkna.ObliczSrodek(obszar.Width, obszar.Height, szer, wys, out posX, out posY);

        var okno = new Form
        {
            Text = "PierwszeOkno - Windows 11 GUI",
            ClientSize = new Size(szer, wys),
            StartPosition = FormStartPosition.Manual,
            Location = new Point(obszar.X + posX, obszar.Y + posY),
            BackColor = Color.FromArgb(15, 23, 42),
            ForeColor = Color.White,
            FormBorderStyle = FormBorderStyle.FixedSingle,
            MaximizeBox = false
        };

        var label = new Label
        {
            Text = "Witaj w trybie GUI (/target:winexe)!",
            Location = new Point(24, 24),
            AutoSize = true,
            Font = new Font("Segoe UI", 12, FontStyle.Bold)
        };

        var info = new Label
        {
            Text = string.Format("Ekran: {0}x{1}  |  Okno: {2}x{3}  |  Pozycja: ({4}, {5})",
                obszar.Width, obszar.Height, szer, wys, posX, posY),
            Location = new Point(24, 58),
            AutoSize = true,
            Font = new Font("Segoe UI", 9.5f),
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        int licznik = 0;
        var btn = new Button
        {
            Text = "Testuj zdarzenie Click",
            Location = new Point(24, 104),
            Size = new Size(220, 44),
            BackColor = Color.FromArgb(14, 165, 233),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = new Font("Segoe UI", 10, FontStyle.Bold)
        };
        btn.FlatAppearance.BorderSize = 0;
        btn.Click += (s, e) =>
        {
            licznik++;
            label.Text = "Zdarzenie Click obsluzone: " + licznik + "x";
        };

        okno.Controls.Add(label);
        okno.Controls.Add(info);
        okno.Controls.Add(btn);
        Application.Run(okno);
    }
}
```

</cs-file>
<cs-file name="KonfiguracjaOkna.cs">

```csharp
using System;

public static class KonfiguracjaOkna
{
    public const int MinSzerokosc = 320;
    public const int MinWysokosc = 200;

    public static void ObliczSrodek(int szerEkranu, int wysEkranu, int szerOkna, int wysOkna, out int x, out int y)
    {
        // Wylicz wyśrodkowane współrzędne (x, y), nigdy mniejsze od 0
        x = 0;
        y = 0;
    }

    public static void DopasujRozmiarOkna(int szerEkranu, int wysEkranu, int zadanaSzer, int zadanaWys, int margines, out int szer, out int wys)
    {
        // Ogranicz rozmiar okna do [MinSzerokosc..maxSzer] i [MinWysokosc..maxWys] z uwzględnieniem marginesu
        szer = zadanaSzer;
        wys = zadanaWys;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ObliczSrodek wyśrodkowuje okno na Full HD, 4K oraz obsługuje przypadki asymetryczne i ujemne", () => {
    int x, y;
    KonfiguracjaOkna.ObliczSrodek(1920, 1080, 420, 220, out x, out y);
    LabAssert.Equal(750, x);
    LabAssert.Equal(430, y);

    KonfiguracjaOkna.ObliczSrodek(3840, 2160, 1200, 800, out x, out y);
    LabAssert.Equal(1320, x);
    LabAssert.Equal(680, y);

    // Obie osie większe niż ekran
    KonfiguracjaOkna.ObliczSrodek(300, 200, 500, 400, out x, out y);
    LabAssert.Equal(0, x);
    LabAssert.Equal(0, y);

    // Asymetryczne: tylko szerokość większa od ekranu
    KonfiguracjaOkna.ObliczSrodek(400, 800, 600, 200, out x, out y);
    LabAssert.Equal(0, x);
    LabAssert.Equal(300, y);

    // Asymetryczne: tylko wysokość większa od ekranu
    KonfiguracjaOkna.ObliczSrodek(1000, 300, 400, 500, out x, out y);
    LabAssert.Equal(300, x);
    LabAssert.Equal(0, y);
});

LabAssert.Test("DopasujRozmiarOkna zachowuje zadany rozmiar na monitorze 4K i przycina na Full HD oraz 800x600", () => {
    int szer, wys;
    KonfiguracjaOkna.DopasujRozmiarOkna(3840, 2160, 1200, 800, 40, out szer, out wys);
    LabAssert.Equal(1200, szer);
    LabAssert.Equal(800, wys);

    KonfiguracjaOkna.DopasujRozmiarOkna(1920, 1080, 1900, 1100, 40, out szer, out wys);
    LabAssert.Equal(1840, szer);
    LabAssert.Equal(1000, wys);

    KonfiguracjaOkna.DopasujRozmiarOkna(800, 600, 1024, 768, 30, out szer, out wys);
    LabAssert.Equal(740, szer);
    LabAssert.Equal(540, wys);
});

LabAssert.Test("DopasujRozmiarOkna obsługuje bardzo mały ekran, ujemny margines oraz asymetryczne osie", () => {
    int szer, wys;
    // Bardzo mały ekran: szerEkranu - 2*margines < MinSzerokosc
    KonfiguracjaOkna.DopasujRozmiarOkna(400, 300, 500, 400, 100, out szer, out wys);
    LabAssert.Equal(320, szer);
    LabAssert.Equal(200, wys);

    // Zbyt małe okno podbite do minimum
    KonfiguracjaOkna.DopasujRozmiarOkna(1920, 1080, 150, 100, 20, out szer, out wys);
    LabAssert.Equal(320, szer);
    LabAssert.Equal(200, wys);

    // Ujemny margines traktowany jako 0
    KonfiguracjaOkna.DopasujRozmiarOkna(800, 600, 900, 700, -25, out szer, out wys);
    LabAssert.Equal(800, szer);
    LabAssert.Equal(600, wys);

    // Asymetryczne: szerokość za duża, wysokość poniżej minimum
    KonfiguracjaOkna.DopasujRozmiarOkna(1000, 800, 1200, 120, 50, out szer, out wys);
    LabAssert.Equal(900, szer);
    LabAssert.Equal(200, wys);

    // Asymetryczne: szerokość poniżej minimum, wysokość za duża
    KonfiguracjaOkna.DopasujRozmiarOkna(1000, 800, 200, 900, 50, out szer, out wys);
    LabAssert.Equal(320, szer);
    LabAssert.Equal(700, wys);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Gdy budujesz okno w WinForms:</strong> oznacz `Main()` atrybutem `[STAThread]`, wywołaj `Application.EnableVisualStyles()` oraz `Application.SetCompatibleTextRenderingDefault(false)`, a potem uruchom pętlę komunikatów przez `Application.Run(...)`.
- <strong>Gdy aplikacja ma startować bez czarnego okna terminala:</strong> kompiluj z flagą `/target:winexe`, która wpisuje podsystem `WINDOWS_GUI` do nagłówka PE.
- <strong>Gdy chcesz uniknąć zamrożenia interfejsu:</strong> nigdy nie blokuj jedynego wątku UI wywołaniem `Thread.Sleep` ani długą pętlą obliczeniową.
- <strong>Gdy rozmieszczasz okno i kontrolki:</strong> pamiętaj, że punkt `(0, 0)` leży w lewym górnym rogu, oś Y rośnie w dół, rozmiar wnętrza ustalasz przez `ClientSize`, a dostępny obszar monitora bez paska zadań odczytujesz z `Screen.PrimaryScreen.WorkingArea`.
- <strong>Gdy dodajesz elementy do okna:</strong> trzymaj stan interfejsu w polach prywatnych klasy dziedziczącej po `Form` i każdą utworzoną kontrolkę rejestruj w kolekcji `Controls.Add(...)`.
