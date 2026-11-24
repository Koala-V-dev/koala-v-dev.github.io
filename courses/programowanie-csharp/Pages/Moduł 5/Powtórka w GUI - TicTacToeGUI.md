# Powtórka w GUI - TicTacToeGUI

Gdy w **Module 1** budowaliśmy konsolową grę Kółko i Krzyżyk, celowo odseparowaliśmy plik `SilnikGry.cs` od wywołań `Console.ReadLine()`. Przy przejściu na aplikację okienkową większość początkujących programistów porzuca tę separację. Zamiast użyć gotowego silnika, trzymają stan gry w tekstach przycisków i piszą warunki `if (btn1.Text == "X" && btn2.Text == "X")`.

Taki skrót mści się bardzo szybko. Dziewięć pól planszy zamienia się w dziewięć niemal identycznych metod `Btn1_Click` aż do `Btn9_Click`. Pierwsza zmiana etykiety przycisku albo dodanie animacji rozbija logikę bota AI.

Tutaj zrobimy to tak, jak robi się w produkcyjnych aplikacjach desktopowych. Ten sam silnik 2D z heurystyką bota AI podepniemy pod ciemne okno **Windows Forms** (`TicTacToeGUI.exe`) bez dotykania reguł gry.

---

## 🏛️ Architektura MVP i jedno źródło prawdy

W aplikacjach okienkowych najlepiej sprawdza się podział odpowiedzialności **Model / Widok / Prezenter** (**MVP**). Każdy element ma jedną, wyraźnie wyznaczoną rolę:
- _**Model**_ (`SilnikGry.cs`): przechowuje wyłącznie czystą tablicę `char[3, 3]` i deterministyczne reguły gry. Nie ma w nim ani jednej linijki `using System.Windows.Forms;`.
- _**Widok**_ (`TicTacToeForm`): odpowiada za wygląd okna, przyciski `Button`, etykiety `Label` i kolory. Nie podejmuje żadnych decyzji o tym, kto wygrał.
- _**Prezenter**_ (metody `OnPoleClick`, `OdswiezPlansze` i `SprawdzZakonczenie` w oknie): odbiera intencję gracza, pyta model o wynik i każe widokowi odrysować nowy stan.

Dlaczego trzymanie stanu planszy w `Button.Text` jest architektoniczną pułapką? Generuje trzy poważne problemy:
- **_Brak testów automatycznych:_** nie uruchomisz testów jednostkowych bota AI w czystym runnerze bez tworzenia prawdziwego okna `Form` i uchwytów `HWND`.
- **_Brak przenośności:_** przeniesienie gry z konsoli do WinForms, WPF lub aplikacji webowej wymagałoby przepisania całej logiki od zera.
- **_Rozsynchronizowany stan:_** gdy dodasz spacje, ikony lub animacje w `Button.Text`, warunki porównujące napisy przestają działać.

### 🔄 Przepływ jednego ruchu gracza

Kiedy gracz klika pole na planszy, dane płyną zawsze w jednym kierunku. Zdarzenie `Button.Click` przekazuje kliknięty przycisk jako parametr *sender*. Prezenter odczytuje numer pola z `sender.Tag` i wywołuje `SilnikGry.WykonajRuch`.

Jeśli ruch był poprawny, `OdswiezPlansze()` przepisuje tablicę `_plansza` na wszystkie 9 przycisków. Dopiero wtedy `SprawdzZakonczenie()` pyta silnik o stan rundy, a jeśli gra trwa dalej, uruchamia ruch bota AI i ponownie odświeża widok.

<data-gate>
<data-sortable-list title="Ułóż 5 kroków przepływu jednego ruchu gracza w architekturze MVP">
  <item data-correct="3">SilnikGry.WykonajRuch wpisuje znak X do tablicy char[3, 3] po sprawdzeniu, czy pole jest wolne</item>
  <item data-correct="1">Gracz klika przycisk na planszy, co uruchamia zdarzenie Button.Click i metodę OnPoleClick</item>
  <item data-correct="5">SprawdzZakonczenie wywołuje SilnikGry.OcenStanGry i decyduje o podświetleniu linii lub ruchu bota AI</item>
  <item data-correct="2">Prezenter odczytuje numer pola 1..9 z właściwości Tag obiektu sender</item>
  <item data-correct="4">Metoda OdswiezPlansze przepisuje aktualny stan tablicy modelu na tekst i kolory 9 przycisków</item>
</data-sortable-list>
</data-gate>

---

## 📐 System layoutu WinForms i zasoby GDI+

Ręczne wyliczanie współrzędnych `Location` dla 9 przycisków w siatce 3x3 jest żmudne i podatne na pomyłki. W Windows Forms służy do tego kontener **TableLayoutPanel**.

Wystarczy ustawić `RowCount = 3` i `ColumnCount = 3`, a następnie dodać trzy wiersze `RowStyle` i trzy kolumny `ColumnStyle` z trybem `SizeType.Percent` i wartością `33.33f`. Kontener automatycznie podzieli dostępną przestrzeń na 9 równych komórek.

Każdy przycisk wewnątrz siatki dostaje dwie właściwości odpowiedzialne za dopasowanie:
- `Dock = DockStyle.Fill`: rozciąga przycisk na całą szerokość i wysokość jego komórki.
- `Margin = new Padding(4)`: zostawia równy, 4-pikselowy odstęp wokół przycisku, tworząc czytelne linie siatki.

```csharp
var siatka = new TableLayoutPanel
{
    Location = new Point(20, 80),
    Size = new Size(320, 320),
    RowCount = 3,
    ColumnCount = 3
};

for (int i = 0; i < 3; i++)
{
    siatka.RowStyles.Add(new RowStyle(SizeType.Percent, 33.33f));
    siatka.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33f));
}
```

### 🖋️ Współdzielony obiekt Font zamiast 9 uchwytów GDI+

Każde wywołanie `new Font("Segoe UI", 28, FontStyle.Bold)` nie tworzy zwykłego obiektu C#. Pod spodem rezerwuje natywny uchwyt **GDI+** (`HFONT`) w systemie Windows.

Jeśli wstawisz `new Font(...)` do wnętrza pętli tworzącej 9 przycisków, zarezerwujesz 9 identycznych czcionek w pamięci niezarządzanej. W prostej grze nie zawiesi to systemu, ale przy tablicy 500 kafelków albo wielokrotnym otwieraniu okien prowadzi do wycieku uchwytów.

Właściwym wzorcem jest utworzenie **jednego współdzielonego obiektu** `_fontPlanszy` przed pętlą i przypisanie tej samej referencji wszystkim przyciskom. Gdy okno kończy pracę w `Dispose(bool disposing)`, zwalniamy ten jeden obiekt przez `_fontPlanszy.Dispose()`.

---

## 🧩 Mapowanie 9 przycisków, właściwość Tag i pułapka domknięć

Wszystkie 9 przycisków podpinamy pod jedną metodę obsługi `OnPoleClick(object sender, EventArgs e)`. Aby metoda wiedziała, który przycisk kliknął użytkownik, zapisujemy numer pola we właściwości **Tag**:

```csharp
for (int pole = 1; pole <= 9; pole++)
{
    var btn = new Button
    {
        Dock = DockStyle.Fill,
        Margin = new Padding(4),
        Font = _fontPlanszy,
        BackColor = Color.FromArgb(30, 41, 59),
        ForeColor = Color.White,
        FlatStyle = FlatStyle.Flat,
        Tag = pole
    };
    btn.Click += OnPoleClick;
    _przyciski[pole - 1] = btn;
    siatka.Controls.Add(btn);
}
```

### 📦 Boxing, unboxing i ochrona przed błędem rzutowania

Właściwość `Control.Tag` ma typ `object`, więc przyjmuje dowolne dane. Gdy przypisujesz `Tag = pole`, kompilator wykonuje **boxing** (pudełkowanie): pakuje typ wartościowy `int` w obiekt na stercie.

Wewnątrz `OnPoleClick` wykonujemy operację odwrotną, czyli **unboxing** (odpakowanie):

```csharp
Button klikniety = sender as Button;
if (klikniety == null || !(klikniety.Tag is int))
{
    return;
}
int pole = (int)klikniety.Tag;
```

Dlaczego nie piszemy w ciemno `int pole = (int)((Button)sender).Tag;`? Jeśli ktoś omyłkowo podepnie metodę `OnPoleClick` pod `Label` albo przypisze do `Tag` napis `"5"` zamiast liczby `5`, bezpośrednie rzutowanie rzuci wyjątek **_InvalidCastException_**. Sprawdzenie za pomocą operatorów `as` oraz `is` bezpiecznie odrzuca błędny obiekt bez zamykania aplikacji.

### 🪤 Pułapka domknięć lambdy w pętli for

Wielu programistów zamiast `btn.Tag` próbuje użyć wyrażenia lambda bezpośrednio w pętli `for`:

```csharp
// BŁĘDNY KOD: wszystkie 9 przycisków przekaże wartość 10!
for (int pole = 1; pole <= 9; pole++)
{
    var btn = new Button();
    btn.Click += (s, e) => ObsluzKlik(pole);
}
```

Intuicja podpowiada, że każda iteracja zapamięta własną liczbę od `1` do `9`. Maszyna robi jednak coś zupełnie innego. Kompilator C# przechwytuje **samą zmienną** *pole*, a nie jej chwilową wartość.

Wszystkie 9 lambd wskazuje to samo współdzielone pole `closure.pole` w ukrytym obiekcie domknięcia. Gdy pętla `for` dobiega końca, `closure.pole` ma wartość `10` (warunek `pole <= 9` właśnie przestał być prawdziwy). Kliknięcie **dowolnego** z 9 przycisków wywoła `ObsluzKlik(10)`!

> [!WARNING]
> Zmiana specyfikacji języka wprowadzona w C# 5.0 naprawiła przechwytywanie zmiennej wyłącznie w pętli `foreach`. W zwykłej pętli `for` zmienna sterująca *pole* pozostaje współdzielona we wszystkich wersjach C#, także we współczesnym .NET. Jeśli musisz użyć lambdy w `for`, utwórz najpierw lokalną kopię wewnątrz pętli: `int numer = pole;`.

> [!TIP]
> Zapis `btn.Tag = pole;` w parze ze wspólną metodą `btn.Click += OnPoleClick;` całkowicie eliminuje problem domknięć. Nie generuje ukrytych klas `<>c__DisplayClass` ani 9 osobnych obiektów delegatów, a kod pozostaje prosty do debugowania.

<data-gate>
<data-connection-matcher title="Dopasuj mechanizm GUI w TicTacToeGUI do jego skutku w działaniu programu">
  <item left="btn.Tag = pole + wspólna metoda OnPoleClick" right="Jedna metoda obsługuje 9 przycisków bez tworzenia klas domknięć"></item>
  <item left="TableLayoutPanel z SizeType.Percent (33.33f)" right="Automatycznie dzieli siatkę 3x3 na równe komórki bez ręcznych współrzędnych"></item>
  <item left="btn.Click += (s, e) => ObsluzKlik(pole) w pętli for" right="Przechwytuje wspólną zmienną: kliknięcie każdego przycisku przekazuje 10"></item>
  <item left="Jeden współdzielony obiekt Font dla wszystkich 9 pól" right="Oszczędza natywne uchwyty GDI+ (HFONT) zamiast alokować 9 kopii"></item>
  <item left="SilnikGry bez using System.Windows.Forms" right="Umożliwia uruchamianie testów jednostkowych i przeniesienie gry do innego GUI"></item>
</data-connection-matcher>
</data-gate>

---

## 🗺️ Numeracja pól planszy 3x3 i 8 linii wygranej

Silnik gry przechowuje planszę jako tablicę dwuwymiarową `char[3, 3]`. Interfejs i bot operują natomiast na wygodnych numerach pól od `1` do `9`:

| Kolumna 0 | Kolumna 1 | Kolumna 2 |
| :---: | :---: | :---: |
| Pole **1** `[0, 0]` | Pole **2** `[0, 1]` | Pole **3** `[0, 2]` |
| Pole **4** `[1, 0]` | Pole **5** `[1, 1]` | Pole **6** `[1, 2]` |
| Pole **7** `[2, 0]` | Pole **8** `[2, 1]` | Pole **9** `[2, 2]` |

Przeliczanie w obie strony opiera się na dzieleniu całkowitym i reszcie z dzielenia przez `3`:
- z numeru pola `1..9` na indeksy tablicy: `r = (pole - 1) / 3` oraz `c = (pole - 1) % 3`,
- z indeksów tablicy `(r, c)` na numer pola: `pole = r * 3 + c + 1`.

Na planszy 3x3 istnieje dokładnie **8 linii wygranej**:
- 3 wiersze: `{ 1, 2, 3 }`, `{ 4, 5, 6 }`, `{ 7, 8, 9 }`,
- 3 kolumny: `{ 1, 4, 7 }`, `{ 2, 5, 8 }`, `{ 3, 6, 9 }`,
- 2 przekątne: `{ 1, 5, 9 }` oraz `{ 3, 5, 7 }`.

W `SilnikGry.cs` zastosujemy zasadę **jednego źródła prawdy**. Zamiast duplikować te same warunki w dwóch metodach, `CzyWygrana(p, z)` wywołuje wprost `ZnajdzLinieWygranej(p, z) != null`. Gdy poprawnie zaimplementujesz `ZnajdzLinieWygranej`, automatycznie zadziała zarówno podświetlanie linii w GUI, jak i heurystyka ataku oraz obrony bota AI.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Compiler lowering domknięć w C# 5.0 oraz limity uchwytów GDI+ w Windows</span>
<span class="deep-dive-badge">CLOSURES · COMPILER LOWERING · GDI+ HANDLES</span>
</summary>
<div class="deep-dive-content">

<h4>1. Co naprawdę generuje kompilator csc.exe dla lambdy w pętli for?</h4>

Kompilator C# obniża (ang. lowering) każdą lambdę korzystającą ze zmiennej lokalnej do ukrytej klasy domknięcia (`<>c__DisplayClass`) alokowanej na stercie. W przypadku pętli `for` zmienna sterująca *pole* staje się jednym wspólnym polem tej klasy:

```csharp
// Kod wygenerowany pod maską przez kompilator csc.exe:
var closure = new __DisplayClass();
for (closure.pole = 1; closure.pole <= 9; closure.pole++)
{
    var btn = new Button();
    btn.Click += new EventHandler(closure.LambdaMethod);
}
// Po wyjściu z pętli closure.pole == 10.
// Każde kliknięcie wywoła LambdaMethod z closure.pole równym 10!
```

Jeśli dodasz w ciele pętli lokalną kopię `int kopia = pole;`, kompilator wygeneruje klasę domknięcia **wewnątrz pętli**. Oznacza to 9 osobnych alokacji obiektów domknięć i 9 osobnych delegatów `EventHandler` na stercie. W rozwiązaniu z `btn.Tag` nie powstaje ani jedna klasa domknięcia, a wszystkie przyciski współdzielą jedną metodę instancji `OnPoleClick`.

<h4>2. Limity uchwytów GDI+ i dlaczego warto zwalniać Font</h4>

Każdy proces w systemie Windows ma twardy limit uchwytów GDI (domyślnie `10 000`, zapisany w kluczu rejestru `GDIProcessHandleQuota`). Obiekty `Font`, `Pen`, `Brush` i `Bitmap` z przestrzeni `System.Drawing` implementują interfejs `IDisposable`, ponieważ owijają natywne struktury jądra graficznego.

Gdy przekroczysz limit uchwytów w długodziałającej aplikacji desktopowej, kolejne wywołanie `new Font(...)` lub utworzenie okna rzuci wyjątek **_ExternalException_** z ogólnikowym komunikatem `A generic error occurred in GDI+`. Dlatego czcionki współdzielone między kontrolkami przechowujemy jako pole klasy formularza i zwalniamy jawnie w metodzie `Dispose(bool disposing)`.

</div>
</details>

---

## 💻 Projekt Powtórkowy 1: Zbuduj i pobierz TicTacToeGUI.exe

W zakładce **`SilnikGry.cs`** uzupełnij dwie metody wykorzystywane przez okno `TicTacToeForm` oraz bota AI:

1. `ZnajdzLinieWygranej(char[,] p, char znak)`:
   - przeszukuje wszystkie 8 linii wygranej (3 wiersze, 3 kolumny, 2 przekątne),
   - zwraca tablicę `int[]` z 3 numerami zwycięskich pól w kolejności rosnącej (np. `{ 1, 2, 3 }`, `{ 2, 5, 8 }`, `{ 1, 5, 9 }`, `{ 3, 5, 7 }`),
   - zwraca `null`, jeśli dla podanego znaku nie ma zwycięskiej linii.
   - Zwróć uwagę, że metoda `CzyWygrana(p, z)` korzysta bezpośrednio z `ZnajdzLinieWygranej(p, z) != null`.

2. `OcenStanGry(char[,] p)`:
   - zwraca `"X"`, gdy wygrał gracz `'X'`,
   - zwraca `"O"`, gdy wygrał bot `'O'`,
   - zwraca `"REMIS"`, gdy plansza jest pełna i nikt nie wygrał,
   - zwraca `"W_TOKU"`, gdy partia nadal trwa.

Okno w `Program.cs` automatycznie wywoła `ZnajdzLinieWygranej` po zakończeniu partii i podświetli zwycięskie 3 pola na zielono. Po zaliczeniu testów kliknij **Pobierz .exe** i uruchom `TicTacToeGUI.exe`.

<data-gate>
<data-csharp-lab title="Powtórka GUI cz. 1: TicTacToeGUI (WinForms 3x3 + Bot AI)" exe-name="TicTacToeGUI.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

public class TicTacToeForm : Form
{
    private char[,] _plansza = SilnikGry.NowaPlansza();
    private Button[] _przyciski = new Button[9];
    private readonly Font _fontPlanszy;
    private Label _lblStatus;
    private Label _lblWynik;
    private int _wygraneGracza = 0;
    private int _wygraneBota = 0;
    private int _remisy = 0;
    private bool _koniecRundy = false;

    public TicTacToeForm()
    {
        Text = "TicTacToe AI - Windows 11 GUI";
        ClientSize = new Size(360, 470);
        BackColor = Color.FromArgb(15, 23, 42);
        ForeColor = Color.White;
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;

        _fontPlanszy = new Font("Segoe UI", 28, FontStyle.Bold);

        _lblStatus = new Label
        {
            Text = "Twoj ruch (X)",
            Location = new Point(20, 16),
            Size = new Size(320, 30),
            Font = new Font("Segoe UI", 13, FontStyle.Bold),
            ForeColor = Color.FromArgb(56, 189, 248)
        };

        _lblWynik = new Label
        {
            Text = "Gracz: 0  |  Bot AI: 0  |  Remisy: 0",
            Location = new Point(20, 48),
            Size = new Size(320, 22),
            Font = new Font("Segoe UI", 9.5f),
            ForeColor = Color.FromArgb(148, 163, 184)
        };

        var siatka = new TableLayoutPanel
        {
            Location = new Point(20, 80),
            Size = new Size(320, 320),
            RowCount = 3,
            ColumnCount = 3
        };
        for (int i = 0; i < 3; i++)
        {
            siatka.RowStyles.Add(new RowStyle(SizeType.Percent, 33.33f));
            siatka.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33f));
        }

        for (int pole = 1; pole <= 9; pole++)
        {
            var btn = new Button
            {
                Dock = DockStyle.Fill,
                Margin = new Padding(4),
                Font = _fontPlanszy,
                BackColor = Color.FromArgb(30, 41, 59),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Tag = pole
            };
            btn.FlatAppearance.BorderColor = Color.FromArgb(51, 65, 85);
            btn.Click += OnPoleClick;
            _przyciski[pole - 1] = btn;
            siatka.Controls.Add(btn);
        }

        var btnReset = new Button
        {
            Text = "Nowa runda",
            Location = new Point(20, 412),
            Size = new Size(320, 40),
            BackColor = Color.FromArgb(14, 165, 233),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = new Font("Segoe UI", 10.5f, FontStyle.Bold)
        };
        btnReset.FlatAppearance.BorderSize = 0;
        btnReset.Click += (s, e) => ResetujRunde();

        Controls.AddRange(new Control[] { _lblStatus, _lblWynik, siatka, btnReset });
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _fontPlanszy.Dispose();
        }
        base.Dispose(disposing);
    }

    private void OnPoleClick(object sender, EventArgs e)
    {
        if (_koniecRundy) return;

        Button klikniety = sender as Button;
        if (klikniety == null || !(klikniety.Tag is int)) return;

        int pole = (int)klikniety.Tag;
        if (!SilnikGry.WykonajRuch(_plansza, pole, 'X')) return;

        OdswiezPlansze();
        if (SprawdzZakonczenie()) return;

        int ruchBota = SilnikGry.WybierzRuchBota(_plansza, 'O', 'X');
        if (ruchBota != -1) SilnikGry.WykonajRuch(_plansza, ruchBota, 'O');
        OdswiezPlansze();
        SprawdzZakonczenie();
    }

    private bool SprawdzZakonczenie()
    {
        string stan = SilnikGry.OcenStanGry(_plansza);
        if (stan == "W_TOKU") return false;
        _koniecRundy = true;

        if (stan == "X")
        {
            _wygraneGracza++;
            _lblStatus.Text = "WYGRALES!";
            _lblStatus.ForeColor = Color.FromArgb(52, 211, 153);
            PodswietlLinie(SilnikGry.ZnajdzLinieWygranej(_plansza, 'X'));
        }
        else if (stan == "O")
        {
            _wygraneBota++;
            _lblStatus.Text = "BOT AI WYGRAL!";
            _lblStatus.ForeColor = Color.FromArgb(248, 113, 113);
            PodswietlLinie(SilnikGry.ZnajdzLinieWygranej(_plansza, 'O'));
        }
        else
        {
            _remisy++;
            _lblStatus.Text = "REMIS!";
            _lblStatus.ForeColor = Color.FromArgb(251, 191, 36);
        }

        _lblWynik.Text = string.Format("Gracz: {0}  |  Bot AI: {1}  |  Remisy: {2}", _wygraneGracza, _wygraneBota, _remisy);
        return true;
    }

    private void PodswietlLinie(int[] linia)
    {
        if (linia == null) return;
        for (int i = 0; i < linia.Length; i++)
        {
            int idx = linia[i] - 1;
            if (idx >= 0 && idx < _przyciski.Length)
            {
                _przyciski[idx].BackColor = Color.FromArgb(21, 128, 61);
                _przyciski[idx].ForeColor = Color.White;
            }
        }
    }

    private void OdswiezPlansze()
    {
        for (int pole = 1; pole <= 9; pole++)
        {
            char z = _plansza[(pole - 1) / 3, (pole - 1) % 3];
            var btn = _przyciski[pole - 1];
            btn.Text = z == '.' ? "" : z.ToString();
            btn.BackColor = Color.FromArgb(30, 41, 59);
            btn.ForeColor = z == 'X' ? Color.FromArgb(56, 189, 248) : Color.FromArgb(251, 191, 36);
        }
    }

    private void ResetujRunde()
    {
        _plansza = SilnikGry.NowaPlansza();
        _koniecRundy = false;
        _lblStatus.Text = "Twoj ruch (X)";
        _lblStatus.ForeColor = Color.FromArgb(56, 189, 248);
        OdswiezPlansze();
    }
}

class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new TicTacToeForm());
    }
}
```

</cs-file>
<cs-file name="SilnikGry.cs">

```csharp
using System;

public static class SilnikGry
{
    public static char[,] NowaPlansza()
    {
        return new char[,] { { '.', '.', '.' }, { '.', '.', '.' }, { '.', '.', '.' } };
    }

    public static bool CzyWygrana(char[,] p, char z)
    {
        return ZnajdzLinieWygranej(p, z) != null;
    }

    public static bool CzyRemis(char[,] p)
    {
        for (int r = 0; r < 3; r++)
            for (int c = 0; c < 3; c++)
                if (p[r, c] == '.') return false;
        return !CzyWygrana(p, 'X') && !CzyWygrana(p, 'O');
    }

    public static bool WykonajRuch(char[,] p, int pole, char znak)
    {
        if (pole < 1 || pole > 9) return false;
        int r = (pole - 1) / 3, c = (pole - 1) % 3;
        if (p[r, c] != '.') return false;
        p[r, c] = znak;
        return true;
    }

    public static int WybierzRuchBota(char[,] p, char bot, char gracz)
    {
        int atak = ZnajdzWygrywajacy(p, bot);
        if (atak != -1) return atak;
        int blok = ZnajdzWygrywajacy(p, gracz);
        if (blok != -1) return blok;
        if (p[1, 1] == '.') return 5;
        int[] rogi = { 1, 3, 7, 9 };
        foreach (int r in rogi) if (p[(r - 1) / 3, (r - 1) % 3] == '.') return r;
        for (int i = 1; i <= 9; i++) if (p[(i - 1) / 3, (i - 1) % 3] == '.') return i;
        return -1;
    }

    private static int ZnajdzWygrywajacy(char[,] p, char z)
    {
        for (int i = 1; i <= 9; i++)
        {
            int r = (i - 1) / 3, c = (i - 1) % 3;
            if (p[r, c] == '.') { p[r, c] = z; bool ok = CzyWygrana(p, z); p[r, c] = '.'; if (ok) return i; }
        }
        return -1;
    }

    public static string OcenStanGry(char[,] p)
    {
        // Zwróć "X", "O", "REMIS" lub "W_TOKU"
        return "W_TOKU";
    }

    public static int[] ZnajdzLinieWygranej(char[,] p, char znak)
    {
        // Zwróć tablicę 3 numerów zwycięskich pól (1..9) w kolejności rosnącej lub null
        return null;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("OcenStanGry poprawnie rozpoznaje wygraną X, O, wygraną X na pełnej planszy, REMIS i W_TOKU", () => {
    char[,] winX = { { 'X', 'X', 'X' }, { 'O', '.', 'O' }, { '.', '.', '.' } };
    char[,] winXPelna = { { 'X', 'O', 'X' }, { 'O', 'X', 'O' }, { 'O', 'X', 'X' } };
    char[,] winO = { { 'X', 'O', '.' }, { 'X', 'O', '.' }, { '.', 'O', 'X' } };
    char[,] remis = { { 'X', 'O', 'X' }, { 'X', 'O', 'O' }, { 'O', 'X', 'X' } };
    char[,] pusta = SilnikGry.NowaPlansza();
    char[,] wTrakcie = { { 'X', 'O', '.' }, { '.', 'X', '.' }, { 'O', '.', '.' } };

    LabAssert.Equal("X", SilnikGry.OcenStanGry(winX));
    LabAssert.Equal("X", SilnikGry.OcenStanGry(winXPelna));
    LabAssert.Equal("O", SilnikGry.OcenStanGry(winO));
    LabAssert.Equal("REMIS", SilnikGry.OcenStanGry(remis));
    LabAssert.Equal("W_TOKU", SilnikGry.OcenStanGry(pusta));
    LabAssert.Equal("W_TOKU", SilnikGry.OcenStanGry(wTrakcie));
});

LabAssert.Test("ZnajdzLinieWygranej rozpoznaje wszystkie 3 wiersze", () => {
    char[,] r0 = { { 'X', 'X', 'X' }, { '.', '.', '.' }, { '.', '.', '.' } };
    char[,] r1 = { { '.', '.', '.' }, { 'O', 'O', 'O' }, { '.', '.', '.' } };
    char[,] r2 = { { '.', '.', '.' }, { '.', '.', '.' }, { 'X', 'X', 'X' } };

    int[] l0 = SilnikGry.ZnajdzLinieWygranej(r0, 'X');
    int[] l1 = SilnikGry.ZnajdzLinieWygranej(r1, 'O');
    int[] l2 = SilnikGry.ZnajdzLinieWygranej(r2, 'X');

    LabAssert.True(l0 != null && l0.Length == 3 && l0[0] == 1 && l0[1] == 2 && l0[2] == 3, "Wiersz 0 -> {1,2,3}");
    LabAssert.True(l1 != null && l1.Length == 3 && l1[0] == 4 && l1[1] == 5 && l1[2] == 6, "Wiersz 1 -> {4,5,6}");
    LabAssert.True(l2 != null && l2.Length == 3 && l2[0] == 7 && l2[1] == 8 && l2[2] == 9, "Wiersz 2 -> {7,8,9}");
});

LabAssert.Test("ZnajdzLinieWygranej rozpoznaje wszystkie 3 kolumny", () => {
    char[,] c0 = { { 'O', '.', '.' }, { 'O', '.', '.' }, { 'O', '.', '.' } };
    char[,] c1 = { { '.', 'X', '.' }, { '.', 'X', '.' }, { '.', 'X', '.' } };
    char[,] c2 = { { '.', '.', 'O' }, { '.', '.', 'O' }, { '.', '.', 'O' } };

    int[] l0 = SilnikGry.ZnajdzLinieWygranej(c0, 'O');
    int[] l1 = SilnikGry.ZnajdzLinieWygranej(c1, 'X');
    int[] l2 = SilnikGry.ZnajdzLinieWygranej(c2, 'O');

    LabAssert.True(l0 != null && l0.Length == 3 && l0[0] == 1 && l0[1] == 4 && l0[2] == 7, "Kolumna 0 -> {1,4,7}");
    LabAssert.True(l1 != null && l1.Length == 3 && l1[0] == 2 && l1[1] == 5 && l1[2] == 8, "Kolumna 1 -> {2,5,8}");
    LabAssert.True(l2 != null && l2.Length == 3 && l2[0] == 3 && l2[1] == 6 && l2[2] == 9, "Kolumna 2 -> {3,6,9}");
});

LabAssert.Test("ZnajdzLinieWygranej rozpoznaje obie przekątne, zwraca null przy braku wygranej i zasila bota AI", () => {
    char[,] d1 = { { 'X', '.', '.' }, { '.', 'X', '.' }, { '.', '.', 'X' } };
    char[,] d2 = { { '.', '.', 'O' }, { '.', 'O', '.' }, { 'O', '.', '.' } };
    char[,] brak = { { 'X', 'O', 'X' }, { 'X', 'O', 'O' }, { 'O', 'X', 'X' } };
    char[,] blokuj = { { 'X', 'X', '.' }, { '.', 'O', '.' }, { '.', '.', '.' } };

    int[] l1 = SilnikGry.ZnajdzLinieWygranej(d1, 'X');
    int[] l2 = SilnikGry.ZnajdzLinieWygranej(d2, 'O');
    int[] lBrakX = SilnikGry.ZnajdzLinieWygranej(brak, 'X');
    int[] lZlyZnak = SilnikGry.ZnajdzLinieWygranej(d1, 'O');

    LabAssert.True(l1 != null && l1.Length == 3 && l1[0] == 1 && l1[1] == 5 && l1[2] == 9, "Przekątna główna -> {1,5,9}");
    LabAssert.True(l2 != null && l2.Length == 3 && l2[0] == 3 && l2[1] == 5 && l2[2] == 7, "Przekątna poboczna -> {3,5,7}");
    LabAssert.True(lBrakX == null, "Przy remisie metoda musi zwrócić null");
    LabAssert.True(lZlyZnak == null, "Dla znaku bez wygranej metoda musi zwrócić null");
    LabAssert.Equal(3, SilnikGry.WybierzRuchBota(blokuj, 'O', 'X'));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Gdy przenosisz logikę do GUI:</strong> trzymaj stan i reguły w modelu bez `using System.Windows.Forms`, a kontrolki traktuj wyłącznie jako odzwierciedlenie danych.
- <strong>Gdy obsługujesz wiele podobnych przycisków:</strong> zapisz identyfikator w `btn.Tag`, podepnij jedną wspólną metodę i sprawdzaj typ przez `as` oraz `is`, zamiast łapać zmienną z pętli `for` w lambdzie.
- <strong>Gdy budujesz regularną siatkę kontrolek:</strong> użyj `TableLayoutPanel` z `SizeType.Percent` oraz `Dock = DockStyle.Fill`, zamiast ręcznie wyliczać piksele.
- <strong>Gdy wiele kontrolek używa tej samej czcionki:</strong> współdziel jeden obiekt `Font` i zwolnij go w `Dispose(bool disposing)`, aby nie marnować uchwytów GDI+.
