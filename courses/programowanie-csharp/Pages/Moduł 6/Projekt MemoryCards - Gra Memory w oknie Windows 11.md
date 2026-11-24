# Projekt MemoryCards - Gra Memory w oknie Windows 11

Kiedy budujesz pierwszą grę okienkową, pokusa jest prosta: wrzucić tasowanie, liczenie ruchów, obsługę timera i zapis rekordu do jednej metody `Button_Click`. Taki plik szybko rozrasta się do kilkuset linii. Każda drobna poprawka wymaga uruchomienia okna i szesnastu ręcznych kliknięć, aby sprawdzić, czy ekran wygranej nie zepsuł się po drodze.

Problem pogłębia się w momencie, gdy gracz kliknie przycisk „Nowa gra” w połowie odliczania timera zakrycia. Stary timer potrafi wtedy po cichu przykryć świeżo odkrytą kartę z nowej partii. Do tego każda niezwolniona czcionka `Font` zostawia w systemie Windows otwarty uchwyt graficzny.

Rozwiązaniem jest świadomy podział na dwie warstwy i kontrola nad trzema newralgicznymi punktami styku z systemem operacyjnym.

---

## 🏗️ Architektura Model i Widok w aplikacji desktopowej

Cały projekt `MemoryCards.exe` rozdzielamy na dwa pliki źródłowe o ściśle określonych rolach. Dzięki temu logika gry nie wie nic o istnieniu okien, przycisków ani biblioteki WinForms.

| Plik | Odpowiedzialność | Zależności |
| :--- | :--- | :--- |
| `MemoryModel.cs` | Czysta logika gry: generowanie 8 par, tasowanie Fisher-Yates, maszyna stanów `StanGry`, sprawdzanie par, skuteczność, formatowanie czasu i ocena rekordu. | Wyłącznie `System` (zero zależności od GUI). |
| `Program.cs` | Warstwa prezentacji WinForms (`MemoryForm`): okno 4x4, obsługa kliknięć, dwa timery, zasoby GDI oraz atomowy zapis rekordu na dysku. | `System`, `System.Drawing`, `System.IO`, `System.Windows.Forms`. |

Taki wzorzec architektoniczny nazywamy _**separacją modelu od widoku**_ (Model i Widok). Możesz uruchomić dziesiątki testów automatycznych dla klasy `MemoryModel` w kilka milisekund, bez otwierania żadnego okna. Dopiero gdy wszystkie reguły gry przechodzą weryfikację, kompilujesz oba pliki razem do gotowego programu `MemoryCards.exe`.

### 🚦 Punkt wejścia aplikacji okienkowej WinForms

Program konsolowy kończy działanie zaraz po wykonaniu ostatniej instrukcji w `Main()`. Aplikacja okienkowa musi działać w sposób ciągły i reagować na ruchy myszy, kliknięcia oraz tyknięcia timerów. Odpowiada za to czteroliniowa sekwencja startowa w klasie `Program`:

```csharp
class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MemoryForm());
    }
}
```

Każdy z tych czterech elementów pełni konkretną rolę w systemie Windows:

- **`[STAThread]`**: oznacza główny wątek jako jednowątkowy apartament COM (Single-Threaded Apartment). Wymagają tego okna dialogowe Windows, takie jak `MessageBox`, oraz dostęp do schowka. Bez tego atrybutu część okien systemowych rzuci **_wyjątek `ThreadStateException`_**.
- **`Application.EnableVisualStyles()`**: włącza nowoczesny wygląd kontrolek systemu Windows 11. Pominięcie tej linii cofa styl przycisków i pasków przewijania do wyglądu z systemu Windows 95.
- **`Application.SetCompatibleTextRenderingDefault(false)`**: ustawia nowszy, natywny mechanizm rysowania tekstu (GDI), który daje ostrzejsze czcionki niż starszy GDI+.
- **`Application.Run(new MemoryForm())`**: wyświetla okno i uruchamia **pętlę komunikatów** systemu Windows. Od tego momentu program czeka na zdarzenia od użytkownika i nie kończy działania aż do zamknięcia formularza.

### 🎨 Budowa kart i zbiorcze dodawanie kontrolek

Każda z szesnastu kart w siatce `TableLayoutPanel` to obiekt klasy `Button`. Aby karty wyglądały nowocześnie w ciemnym motywie, zamiast wypukłej ramki 3D ustawiamy właściwość **`FlatStyle.Flat`** oraz kolor obramowania w `btn.FlatAppearance.BorderColor`.

Po utworzeniu etykiety statusu, siatki z kartami i przycisku „Nowa gra” dodajemy wszystkie trzy główne elementy do okna jednym wywołaniem **`Controls.AddRange`**:

```csharp
Controls.AddRange(new Control[] { _lblInfo, siatka, btnNowa });
```

Wywołanie `AddRange` jest bardziej wydajne niż trzy osobne wywołania `Controls.Add`, ponieważ pozwala formularzowi zaktualizować układ kontrolek zbiorczo.

<data-gate>
<data-connection-matcher title="Podział odpowiedzialności: MemoryModel kontra MemoryForm">
    <item left="Tasowanie 8 par kart algorytmem Fisher-Yates" right="MemoryModel: losowa permutacja tablicy Symbole bez zależności od GUI"></item>
    <item left="Przejścia maszyny stanów StanGry" right="MemoryModel: pilnowanie blokady i detekcja stanu KoniecGry"></item>
    <item left="ObliczSkutecznoscProcent()" right="MemoryModel: matematyka trafień względem ruchów bez dzielenia przez zero"></item>
    <item left="Dynamiczna siatka 4x4 TableLayoutPanel" right="MemoryForm: rozmieszczenie 16 przycisków Button w oknie Windows"></item>
    <item left="Jednorazowy Timer zakrycia 750 ms" right="MemoryForm: odliczanie opóźnienia na wątku UI i wywołanie ZakonczBlokade()"></item>
    <item left="Zapis rekordu przez FileStream.Flush(true)" right="MemoryForm: trwały zapis atomowy w folderze LocalApplicationData"></item>
</data-connection-matcher>
</data-gate>

---

## 🔄 Maszyna stanów StanGry w praktyce

W poprzednich lekcjach blokada kliknięć była prostą flagą `bool _blokada`. W pełnym projekcie przenosimy sterowanie przepływem do jawnego typu wyliczeniowego **`StanGry`** wewnątrz klasy `MemoryModel`:

```csharp
public enum StanGry
{
    OczekiwanieNaPierwsza,
    OczekiwanieNaDruga,
    BlokadaZakrywania,
    KoniecGry
}
```

Taka konstrukcja czyni model **jedynym źródłem prawdy** o stanie rozgrywki. Okno `MemoryForm` nie musi już zgadywać, czy gra jest zablokowana albo zakończona. Na początku metody `OnKartaClick` formularz sprawdza po prostu właściwość `Stan`:

- Jeśli `Stan` wynosi `BlokadaZakrywania` lub `KoniecGry`, kliknięcie zostaje natychmiast odrzucone.
- Gdy gracz odsłania pierwszą kartę, okno zapisuje jej indeks w polu *_pierwszy* i wywołuje `OznaczWyborPierwszej()`, przesuwając model do stanu `OczekiwanieNaDruga`.
- Gdy gracz odsłania drugą kartę, okno przekazuje oba indeksy (*a* i *b*) do metody **`SprawdzPare(a, b)`**.

Wewnątrz `SprawdzPare(a, b)` model decyduje o kolejnym stanie:

1. **Trafiona para, gra trwa dalej**: obie karty dostają flagę `Dopasowane = true`, rośnie `TrafionePary`, a `Stan` wraca do `OczekiwanieNaPierwsza`.
2. **Trafiona ostatnia, ósma para**: właściwość `CzyWygrana` przyjmuje wartość `true`, a `Stan` przechodzi nieodwracalnie w `KoniecGry`.
3. **Pudło (różne symbole)**: model zwiększa `Ruchy` i ustawia `Stan = StanGry.BlokadaZakrywania`. Dopiero po 750 ms timer w `MemoryForm` zakrywa obie karty i wywołuje **`ZakonczBlokade()`**, co przywraca stan `OczekiwanieNaPierwsza`.

> [!NOTE]
> Metoda `ZakonczBlokade()` powinna zmieniać stan wyłącznie wtedy, gdy aktualny `Stan` to `BlokadaZakrywania`. Dzięki temu przypadkowe wywołanie tej metody po zakończeniu gry nigdy nie cofnie stanu `KoniecGry`.

<data-gate>
<data-sortable-list title="Kolejność 6 kroków po kliknięciu drugiej, niepasującej karty">
  <item data-correct="4">Model ustawia stan BlokadaZakrywania, a okno odrzuca kolejne kliknięcia</item>
  <item data-correct="1">Odkryj kartę B na planszy i wyświetl jej symbol w przycisku</item>
  <item data-correct="6">W zdarzeniu Tick zakryj karty A i B oraz wywołaj ZakonczBlokade(), wracając do OczekiwanieNaPierwsza</item>
  <item data-correct="2">Wywołaj metodę SprawdzPare(a, b) w obiekcie MemoryModel</item>
  <item data-correct="5">Uruchom jednorazowy timer zakrycia z interwałem 750 ms</item>
  <item data-correct="3">Odśwież pasek statusu z nową liczbą ruchów</item>
</data-sortable-list>
</data-gate>

---

## 🛡️ Trzy kluczowe punkty styku w Program.cs

W pliku `Program.cs` kod warstwy graficznej spotyka się bezpośrednio z zasobami systemu Windows. Poniższe trzy mechanizmy decydują o tym, czy gra będzie stabilna po stu partiach i niespodziewanych kliknięciach.

### ⏱️ Anulowanie timera przy nowej grze i zamknięciu okna

Gdy gracz odkryje dwie różne karty, startuje jednorazowy `_timerZakrycia` na 750 ms. Jeśli przed upływem tego czasu użytkownik kliknie przycisk „Nowa gra” lub zamknie okno krzyżykiem, pozostawiony timer odpaliłby się na nowej planszy albo na **_już zniszczonym oknie_**.

Wspólna metoda pomocnicza `AnulujTimerZakrycia()` zamyka ten problem w jednym miejscu:

```csharp
private void AnulujTimerZakrycia()
{
    if (_timerZakrycia != null)
    {
        _timerZakrycia.Stop();
        _timerZakrycia.Dispose();
        _timerZakrycia = null;
    }
}
```

Wywołujemy ją w trzech sytuacjach: na początku `StartNowaGra()`, przed utworzeniem nowego timera zakrycia oraz w zdarzeniu `FormClosed`.

### 🧹 Zwalnianie wszystkich czcionek GDI bez wyjątków

Każdy obiekt klasy `Font` rezerwuje w jądrze Windows natywny uchwyt graficzny _**GDI**_. Tworzenie czcionek w locie, na przykład `Font = new Font("Segoe UI", 11, FontStyle.Bold)` osobno dla etykiety i dla przycisku „Nowa gra”, zostawia **_wyciek uchwytów GDI_**, ponieważ nikt nie wywołuje na nich metody `Dispose()`.

W `MemoryForm` tworzymy dokładnie dwa współdzielone pola czcionek: *_czcionkaKarty* dla szesnastu przycisków planszy oraz *_czcionkaUI* dla paska statusu i przycisku „Nowa gra”. Oba obiekty zwalniamy jawnie w zdarzeniu `FormClosed`:

```csharp
FormClosed += (s, e) =>
{
    AnulujTimerZakrycia();
    _zegarGry.Stop();
    _zegarGry.Dispose();
    _czcionkaKarty.Dispose();
    _czcionkaUI.Dispose();
};
```

> [!WARNING]
> Jeśli w przyszłości rozbudujesz grę o zmianę rozmiaru planszy (na przykład 4x4 na 4x6), nigdy nie czyść siatki samym wywołaniem `siatka.Controls.Clear()`. Metoda `Clear()` jedynie odpina kontrolki od rodzica, ale **_nie zwalnia natywnych uchwytów HWND ani obiektów Font_**. Każdą usuwaną kontrolkę musisz jawnie zwolnić przez `Dispose()`.

### 💾 Atomowy zapis rekordu przez zrzut bufora dyskowego

Zwykłe `File.WriteAllText` na docelowym pliku rekordu natychmiast obcina starą zawartość do zera bajtów. Przerwa w zasilaniu w tym ułamku milisekundy niszczy plik `rekord.txt`.

Dlatego w metodzie `ZapiszRekord()` stosujemy zapis dwuetapowy do pliku tymczasowego z wymuszeniem fizycznego zrzutu bufora dyskowego:

```csharp
string tmp = _sciezkaRekordu + ".tmp";
using (FileStream fs = new FileStream(tmp, FileMode.Create, FileAccess.Write, FileShare.None))
using (StreamWriter sw = new StreamWriter(fs))
{
    sw.Write(_rekord.ToString());
    sw.Flush();
    fs.Flush(true);
}
```

Wywołanie `sw.Flush()` opróżnia bufor w pamięci programu, a `fs.Flush(true)` nakazuje systemowi operacyjnemu zapisać dane fizycznie na nośniku. Dopiero gdy plik `.tmp` jest bezpieczny na dysku, `File.Replace` (lub `File.Move` przy pierwszym zapisie) atomowo podmienia docelowy plik `rekord.txt`.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Testowanie 1000 rozgrywek w 5 ms oraz limity uchwytów GDI w WinForms</span>
<span class="deep-dive-badge">ARCHITEKTURA GIER · GDI · PAMIĘĆ WIN32</span>
</summary>
<div class="deep-dive-content">

<h4>1. Separacja modelu od widoku: 1000 pełnych rozgrywek w 5 milisekund</h4>

Gdy logika gry jest wymieszana z metodami `Button_Click`, każda zmiana wymaga ręcznego klikania w oknie. Rozdzielając `MemoryModel` od `MemoryForm`, możesz napisać automatycznego bota, który rozegra 1000 pełnych partii w około 5 ms bez otwierania okna Windows:

```csharp
// Symulacja 1000 idealnych rozgrywek z różnymi ziarnami PRNG w ~5 ms
for (int seed = 0; seed < 1000; seed++)
{
    var model = new MemoryModel(new Random(seed));
    for (int i = 0; i < model.Symbole.Length; i++)
    {
        if (model.Dopasowane[i]) continue;
        for (int j = i + 1; j < model.Symbole.Length; j++)
        {
            if (!model.Dopasowane[j] && model.Symbole[i] == model.Symbole[j])
            {
                model.SprawdzPare(i, j);
                break;
            }
        }
    }
    if (model.Stan != StanGry.KoniecGry || model.Ruchy != 8)
        throw new Exception("Błąd logiki dla ziarna " + seed);
}
```

Taka architektura jest fundamentem profesjonalnych silników gier (MVC, MVVM, ECS). Warstwa logiki nie wie, czy obraz rysuje WinForms, WPF, DirectX, czy konsola tekstowa.

<h4>2. Wyciek uchwytów GDI i USER przy dynamicznym przebudowywaniu planszy</h4>

W systemie Windows każda kontrolka WinForms (`Button`, `Label`) posiada natywny uchwyt okna systemowego (**HWND**, obiekt typu USER). Każda czcionka (`Font`) i pędzel (`Brush`) to natywny obiekt podsystemu graficznego **GDI**.

System Windows nakłada na każdy proces twardy limit: domyślnie _**10 000 obiektów USER i 10 000 obiektów GDI**_ (klucz rejestru `GDIProcessHandleQuota`).

Częsty błąd w grach zmieniających rozmiar planszy wygląda tak:

```csharp
siatka.Controls.Clear(); // BŁĄD! Odpina przyciski, ale NIE wywołuje Dispose()!
```

Metoda `Controls.Clear()` usuwa jedynie referencje z kolekcji rodzica, ale **_nie zwalnia natywnych uchwytów HWND ani obiektów Font_**. Jeśli gracz wielokrotnie zmienia rozmiar planszy, stare uchwyty gromadzą się w tabeli jądra aż do przekroczenia limitu i nagłego zatrzymania programu **_wyjątkiem `Win32Exception: Error creating window handle`_**.

Poprawny wzorzec czyszczenia dynamicznej siatki wymaga jawnego wywołania `Dispose()` na każdej starej kontrolce:

```csharp
while (siatka.Controls.Count > 0)
{
    Control staraKontrolka = siatka.Controls[0];
    siatka.Controls.RemoveAt(0);
    staraKontrolka.Dispose(); // Natychmiast zwalnia natywny uchwyt HWND
}
```

W naszym `MemoryForm` tworzymy 16 przycisków raz w konstruktorze i współdzielimy dokładnie dwie czcionki (`_czcionkaKarty` oraz `_czcionkaUI`). Każda nowa gra jedynie aktualizuje tekst i kolory istniejących przycisków, więc zużycie uchwytów GDI i USER pozostaje stałe nawet po tysiącu rozegranych partii.

</div>
</details>

---

## 💻 Projekt Modułu 6: Zbuduj i pobierz MemoryCards.exe

> [!IMPORTANT]
> Plik `Program.cs` zawiera gotową warstwę okna `MemoryForm`. Twoja praca odbywa się w zakładce **`MemoryModel.cs`**! Przełącz zakładkę na górze edytora przed pisaniem kodu.

W pliku **`MemoryModel.cs`** zaimplementuj pełną logikę modelu gry:

1. **Konstruktor `MemoryModel(Random rnd)`**:
   - jeśli *rnd* jest `null`, rzuć `ArgumentNullException("rnd")`,
   - z tablicy 8 symboli bazowych `{ "@", "#", "$", "%", "&", "*", "+", "!" }` zbuduj 16-elementową tablicę `Symbole` (każdy symbol dokładnie dwa razy) oraz 16-elementową tablicę `Dopasowane`,
   - przetasuj tablicę `Symbole` w miejscu algorytmem **Fisher-Yates** (pętla od `Symbole.Length - 1` w dół do `1`, losowanie `rnd.Next(0, i + 1)`),
   - ustaw `Stan = StanGry.OczekiwanieNaPierwsza`.
2. **Metoda `SprawdzPare(int indeksA, int indeksB)`**:
   - jeśli `Stan` wynosi `BlokadaZakrywania` lub `KoniecGry`, zwróć `false` bez zwiększania `Ruchy`,
   - jeśli którykolwiek indeks jest poza zakresem `[0 .. Symbole.Length - 1]`, `indeksA == indeksB` albo któraś z tych dwóch kart jest już dopasowana, zwróć `false` bez zwiększania `Ruchy`,
   - zwiększ `Ruchy++`,
   - przy trafieniu (`Symbole[indeksA] == Symbole[indeksB]`): ustaw obie pozycje w `Dopasowane` na `true`, zwiększ `TrafionePary++`, ustaw `Stan` na `StanGry.KoniecGry` (gdy `CzyWygrana`) lub `StanGry.OczekiwanieNaPierwsza`, i zwróć `true`,
   - przy pudle: ustaw `Stan = StanGry.BlokadaZakrywania` i zwróć `false`.
3. **Metoda `ZakonczBlokade()`**:
   - przywróć `Stan = StanGry.OczekiwanieNaPierwsza` wyłącznie wtedy, gdy aktualny `Stan == StanGry.BlokadaZakrywania`.
4. **Metoda `ObliczSkutecznoscProcent()`**:
   - jeśli `Ruchy == 0`, zwróć `0.0`,
   - w przeciwnym razie zwróć `(double)TrafionePary / Ruchy * 100.0`.
5. **Metoda statyczna `FormatujCzas(int sekundy)`**:
   - dla wartości ujemnych zwróć `"00:00"`,
   - dla nieujemnych zwróć napis `"MM:SS"` z wiodącymi zerami (np. `9` daje `"00:09"`, `75` daje `"01:15"`, `3665` daje `"61:05"`).
6. **Metoda statyczna `CzyNowyRekord(int staryRekord, int nowyWynik)`**:
   - mniej ruchów oznacza lepszy wynik,
   - jeśli *nowyWynik* wynosi `<= 0`, zwróć `false`,
   - jeśli *staryRekord* wynosi `<= 0` (brak wcześniejszego rekordu), zwróć `true`,
   - w przeciwnym razie zwróć `nowyWynik < staryRekord`.

Po zaliczeniu wszystkich testów kliknij **Pobierz .exe** i uruchom własną grę **`MemoryCards.exe`** na Windows 11.

<data-gate>
<data-csharp-lab title="Projekt Modułu 6: MemoryCards (Gra WinForms 4x4 + Fisher-Yates + StanGry + Rekordy)" exe-name="MemoryCards.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

public class MemoryForm : Form
{
    private MemoryModel _model;
    private Button[] _karty = new Button[16];
    private int _pierwszy = -1;
    private int _sekundy = 0;
    private int _rekord = 0;
    private Label _lblInfo;
    private Font _czcionkaKarty;
    private Font _czcionkaUI;
    private Timer _zegarGry = new Timer { Interval = 1000 };
    private Timer _timerZakrycia = null;
    private readonly string _sciezkaRekordu = Path.Combine(
        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MemoryCards"),
        "rekord.txt");

    public MemoryForm()
    {
        Text = "MemoryCards - Windows 11 Game";
        ClientSize = new Size(420, 520);
        BackColor = Color.FromArgb(15, 23, 42);
        ForeColor = Color.White;
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;

        WczytajRekord();

        _czcionkaKarty = new Font("Consolas", 24, FontStyle.Bold);
        _czcionkaUI = new Font("Segoe UI", 11, FontStyle.Bold);

        _lblInfo = new Label
        {
            Location = new Point(20, 14),
            Size = new Size(380, 34),
            Font = _czcionkaUI,
            ForeColor = Color.FromArgb(56, 189, 248)
        };

        var siatka = new TableLayoutPanel
        {
            Location = new Point(20, 56),
            Size = new Size(380, 380),
            RowCount = 4,
            ColumnCount = 4
        };
        siatka.SuspendLayout();
        for (int i = 0; i < 4; i++)
        {
            siatka.RowStyles.Add(new RowStyle(SizeType.Percent, 25f));
            siatka.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 25f));
        }

        for (int i = 0; i < 16; i++)
        {
            var btn = new Button
            {
                Dock = DockStyle.Fill,
                Margin = new Padding(5),
                Font = _czcionkaKarty,
                BackColor = Color.FromArgb(30, 41, 59),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Tag = i
            };
            btn.FlatAppearance.BorderColor = Color.FromArgb(71, 85, 105);
            btn.Click += OnKartaClick;
            _karty[i] = btn;
            siatka.Controls.Add(btn);
        }
        siatka.ResumeLayout();

        var btnNowa = new Button
        {
            Text = "Nowa gra (przetasuj)",
            Location = new Point(20, 452),
            Size = new Size(380, 44),
            BackColor = Color.FromArgb(14, 165, 233),
            ForeColor = Color.White,
            FlatStyle = FlatStyle.Flat,
            Font = _czcionkaUI
        };
        btnNowa.FlatAppearance.BorderSize = 0;
        btnNowa.Click += (s, e) => StartNowaGra();

        Controls.AddRange(new Control[] { _lblInfo, siatka, btnNowa });

        _zegarGry.Tick += (s, e) => { _sekundy++; OdswiezPasek(); };
        FormClosed += (s, e) =>
        {
            AnulujTimerZakrycia();
            _zegarGry.Stop();
            _zegarGry.Dispose();
            _czcionkaKarty.Dispose();
            _czcionkaUI.Dispose();
        };
        StartNowaGra();
    }

    private void AnulujTimerZakrycia()
    {
        if (_timerZakrycia != null)
        {
            _timerZakrycia.Stop();
            _timerZakrycia.Dispose();
            _timerZakrycia = null;
        }
    }

    private void StartNowaGra()
    {
        AnulujTimerZakrycia();
        _model = new MemoryModel(new Random());
        _pierwszy = -1;
        _sekundy = 0;
        for (int i = 0; i < 16; i++)
        {
            _karty[i].Text = "?";
            _karty[i].BackColor = Color.FromArgb(30, 41, 59);
            _karty[i].ForeColor = Color.FromArgb(148, 163, 184);
        }
        _zegarGry.Start();
        OdswiezPasek();
    }

    private void OnKartaClick(object sender, EventArgs e)
    {
        if (_model.Stan == StanGry.BlokadaZakrywania || _model.Stan == StanGry.KoniecGry)
            return;

        int idx = (int)((Button)sender).Tag;
        if (_model.Dopasowane[idx] || idx == _pierwszy)
            return;

        _karty[idx].Text = _model.Symbole[idx];
        _karty[idx].BackColor = Color.FromArgb(23, 37, 84);
        _karty[idx].ForeColor = Color.FromArgb(56, 189, 248);

        if (_pierwszy == -1)
        {
            _pierwszy = idx;
            _model.OznaczWyborPierwszej();
            return;
        }

        int a = _pierwszy;
        int b = idx;
        _pierwszy = -1;

        if (_model.SprawdzPare(a, b))
        {
            _karty[a].BackColor = Color.FromArgb(6, 78, 59);
            _karty[b].BackColor = Color.FromArgb(6, 78, 59);
            _karty[a].ForeColor = Color.FromArgb(52, 211, 153);
            _karty[b].ForeColor = Color.FromArgb(52, 211, 153);
            OdswiezPasek();

            if (_model.Stan == StanGry.KoniecGry)
            {
                _zegarGry.Stop();
                if (MemoryModel.CzyNowyRekord(_rekord, _model.Ruchy))
                {
                    _rekord = _model.Ruchy;
                    ZapiszRekord();
                }
                OdswiezPasek();
                MessageBox.Show(
                    string.Format("Wygrana w {0} ruchach ({1})!\nSkuteczność: {2:F1}%",
                        _model.Ruchy, MemoryModel.FormatujCzas(_sekundy), _model.ObliczSkutecznoscProcent()),
                    "MemoryCards", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }
        else
        {
            OdswiezPasek();
            AnulujTimerZakrycia();
            _timerZakrycia = new Timer { Interval = 750 };
            _timerZakrycia.Tick += (s, ev) =>
            {
                AnulujTimerZakrycia();
                _karty[a].Text = "?";
                _karty[a].BackColor = Color.FromArgb(30, 41, 59);
                _karty[a].ForeColor = Color.FromArgb(148, 163, 184);
                _karty[b].Text = "?";
                _karty[b].BackColor = Color.FromArgb(30, 41, 59);
                _karty[b].ForeColor = Color.FromArgb(148, 163, 184);
                _model.ZakonczBlokade();
            };
            _timerZakrycia.Start();
        }
    }

    private void OdswiezPasek()
    {
        string rek = _rekord > 0 ? _rekord.ToString() : "-";
        _lblInfo.Text = string.Format("Czas: {0}  |  Ruchy: {1}  |  Rekord: {2}",
            MemoryModel.FormatujCzas(_sekundy), _model.Ruchy, rek);
    }

    private void WczytajRekord()
    {
        try
        {
            int val;
            if (File.Exists(_sciezkaRekordu) && int.TryParse(File.ReadAllText(_sciezkaRekordu), out val))
                _rekord = val;
        }
        catch { }
    }

    private void ZapiszRekord()
    {
        try
        {
            string folder = Path.GetDirectoryName(_sciezkaRekordu);
            if (!string.IsNullOrEmpty(folder))
                Directory.CreateDirectory(folder);

            string tmp = _sciezkaRekordu + ".tmp";
            using (FileStream fs = new FileStream(tmp, FileMode.Create, FileAccess.Write, FileShare.None))
            using (StreamWriter sw = new StreamWriter(fs))
            {
                sw.Write(_rekord.ToString());
                sw.Flush();
                fs.Flush(true);
            }

            if (File.Exists(_sciezkaRekordu))
                File.Replace(tmp, _sciezkaRekordu, null);
            else
                File.Move(tmp, _sciezkaRekordu);
        }
        catch { }
    }
}

class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new MemoryForm());
    }
}
```

</cs-file>
<cs-file name="MemoryModel.cs">

```csharp
using System;

public enum StanGry
{
    OczekiwanieNaPierwsza,
    OczekiwanieNaDruga,
    BlokadaZakrywania,
    KoniecGry
}

public class MemoryModel
{
    public string[] Symbole { get; private set; }
    public bool[] Dopasowane { get; private set; }
    public int Ruchy { get; private set; }
    public int TrafionePary { get; private set; }
    public StanGry Stan { get; private set; }
    public bool CzyWygrana { get { return TrafionePary == Symbole.Length / 2; } }

    public MemoryModel(Random rnd)
    {
        // 1. Zwaliduj rnd == null (rzuć ArgumentNullException("rnd"))
        // 2. Utwórz 8 par z bazy { "@", "#", "$", "%", "&", "*", "+", "!" } (16 kart)
        // 3. Zainicjalizuj tablicę Dopasowane o długości 16
        // 4. Przetasuj Symbole algorytmem Fisher-Yates
        // 5. Ustaw Stan = StanGry.OczekiwanieNaPierwsza
    }

    public void OznaczWyborPierwszej()
    {
        if (Stan == StanGry.OczekiwanieNaPierwsza)
            Stan = StanGry.OczekiwanieNaDruga;
    }

    public bool SprawdzPare(int indeksA, int indeksB)
    {
        // 1. Odrzuć wywołanie gdy Stan == BlokadaZakrywania lub KoniecGry
        // 2. Zwaliduj zakres indeksów, indeksA == indeksB oraz karty już dopasowane
        // 3. Zwiększ Ruchy
        // 4. Przy trafieniu: oznacz Dopasowane, zwiększ TrafionePary, zaktualizuj Stan i zwróć true
        // 5. Przy pudle: ustaw Stan = StanGry.BlokadaZakrywania i zwróć false
        return false;
    }

    public void ZakonczBlokade()
    {
        // Przywróć Stan = StanGry.OczekiwanieNaPierwsza wyłącznie gdy Stan == StanGry.BlokadaZakrywania
    }

    public double ObliczSkutecznoscProcent()
    {
        // Zwróć 0.0 gdy Ruchy == 0, inaczej (double)TrafionePary / Ruchy * 100.0
        return 0.0;
    }

    public static string FormatujCzas(int sekundy)
    {
        // Dla wartości ujemnych zwróć "00:00", inaczej format "MM:SS" (np. 75 -> "01:15", 3665 -> "61:05")
        return "00:00";
    }

    public static bool CzyNowyRekord(int staryRekord, int nowyWynik)
    {
        // Mniej ruchów oznacza lepszy wynik; nowyWynik <= 0 -> false; staryRekord <= 0 -> true
        return false;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("Konstruktor waliduje null, buduje 8 par (16 kart) i deterministycznie tasuje Fisher-Yates", () => {
    bool rzuconoNull = false;
    try
    {
        new MemoryModel(null);
    }
    catch (ArgumentNullException)
    {
        rzuconoNull = true;
    }
    LabAssert.True(rzuconoNull, "Konstruktor powinien rzucić ArgumentNullException dla rnd == null.");

    var m1 = new MemoryModel(new Random(42));
    var m2 = new MemoryModel(new Random(42));
    var m3 = new MemoryModel(new Random(99));

    LabAssert.True(m1.Symbole != null && m1.Symbole.Length == 16, "Tablica Symbole musi mieć 16 elementów.");
    LabAssert.True(m1.Dopasowane != null && m1.Dopasowane.Length == 16, "Tablica Dopasowane musi mieć 16 elementów.");
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, m1.Stan);

    string[] oczekiwane = { "@", "#", "$", "%", "&", "*", "+", "!" };
    for (int s = 0; s < oczekiwane.Length; s++)
    {
        int ile = 0;
        for (int i = 0; i < m1.Symbole.Length; i++)
        {
            if (m1.Symbole[i] == oczekiwane[s]) ile++;
        }
        LabAssert.Equal(2, ile);
    }

    int rozniceM1M2 = 0;
    int rozniceM1M3 = 0;
    for (int i = 0; i < 16; i++)
    {
        LabAssert.False(m1.Dopasowane[i]);
        if (m1.Symbole[i] != m2.Symbole[i]) rozniceM1M2++;
        if (m1.Symbole[i] != m3.Symbole[i]) rozniceM1M3++;
    }
    LabAssert.Equal(0, rozniceM1M2);
    LabAssert.True(rozniceM1M3 > 0, "Różne ziarna Random powinny generować różne permutacje kart.");
});

LabAssert.Test("SprawdzPare odrzuca niepoprawne indeksy i ten sam indeks bez nabijania ruchów", () => {
    var m = new MemoryModel(new Random(7));
    LabAssert.Equal(0.0, m.ObliczSkutecznoscProcent());

    LabAssert.False(m.SprawdzPare(0, 0));
    LabAssert.False(m.SprawdzPare(-1, 2));
    LabAssert.False(m.SprawdzPare(2, -1));
    LabAssert.False(m.SprawdzPare(0, 16));
    LabAssert.False(m.SprawdzPare(16, 0));
    LabAssert.False(m.SprawdzPare(100, 200));

    LabAssert.Equal(0, m.Ruchy);
    LabAssert.Equal(0, m.TrafionePary);
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, m.Stan);
    LabAssert.False(m.CzyWygrana);
});

LabAssert.Test("Przejścia StanGry, ZakonczBlokade, pudło, trafienie i skuteczność (0%, 50%, 33.33%)", () => {
    var m = new MemoryModel(new Random(7));
    int firstIdx = 0;
    int matchIdx = -1;
    int mismatchIdx = -1;
    for (int i = 1; i < m.Symbole.Length; i++)
    {
        if (m.Symbole[i] == m.Symbole[firstIdx]) matchIdx = i;
        else if (mismatchIdx == -1) mismatchIdx = i;
    }

    m.OznaczWyborPierwszej();
    LabAssert.Equal(StanGry.OczekiwanieNaDruga, m.Stan);

    // Pudło przełącza grę w stan BlokadaZakrywania
    LabAssert.False(m.SprawdzPare(firstIdx, mismatchIdx));
    LabAssert.Equal(1, m.Ruchy);
    LabAssert.Equal(0, m.TrafionePary);
    LabAssert.Equal(StanGry.BlokadaZakrywania, m.Stan);
    LabAssert.Equal(0.0, m.ObliczSkutecznoscProcent());

    // Podczas BlokadaZakrywania żadne kliknięcie nie może być przyjęte
    LabAssert.False(m.SprawdzPare(firstIdx, matchIdx));
    LabAssert.Equal(1, m.Ruchy);
    LabAssert.Equal(0, m.TrafionePary);
    LabAssert.Equal(StanGry.BlokadaZakrywania, m.Stan);

    // Po zakończeniu blokady gra wraca do OczekiwanieNaPierwsza
    m.ZakonczBlokade();
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, m.Stan);

    // Trafienie pary
    m.OznaczWyborPierwszej();
    LabAssert.True(m.SprawdzPare(firstIdx, matchIdx));
    LabAssert.Equal(2, m.Ruchy);
    LabAssert.Equal(1, m.TrafionePary);
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, m.Stan);
    LabAssert.True(m.Dopasowane[firstIdx] && m.Dopasowane[matchIdx]);
    LabAssert.Equal(50.0, m.ObliczSkutecznoscProcent());

    // Ponowna próba na już dopasowanej karcie nie zwiększa liczby ruchów
    LabAssert.False(m.SprawdzPare(firstIdx, matchIdx));
    LabAssert.False(m.SprawdzPare(firstIdx, mismatchIdx));
    LabAssert.False(m.SprawdzPare(mismatchIdx, firstIdx));
    LabAssert.Equal(2, m.Ruchy);
    LabAssert.Equal(1, m.TrafionePary);

    // Dodatkowe pudło: 1 trafienie na 3 ruchy = 33.333...%
    int otherMismatchIdx = -1;
    for (int i = 1; i < m.Symbole.Length; i++)
    {
        if (!m.Dopasowane[i] && i != mismatchIdx && m.Symbole[i] != m.Symbole[mismatchIdx])
        {
            otherMismatchIdx = i;
            break;
        }
    }
    LabAssert.False(m.SprawdzPare(mismatchIdx, otherMismatchIdx));
    LabAssert.Equal(3, m.Ruchy);
    LabAssert.Equal(1, m.TrafionePary);
    LabAssert.Equal(StanGry.BlokadaZakrywania, m.Stan);
    LabAssert.True(Math.Abs(m.ObliczSkutecznoscProcent() - (100.0 / 3.0)) < 0.001,
        "Skuteczność dla 1 trafienia na 3 ruchy powinna wynosić ok. 33.33% (unikaj dzielenia całkowitego).");
    m.ZakonczBlokade();
    LabAssert.Equal(StanGry.OczekiwanieNaPierwsza, m.Stan);
});

LabAssert.Test("FormatujCzas oraz CzyNowyRekord obsługują wartości brzegowe", () => {
    LabAssert.Equal("00:00", MemoryModel.FormatujCzas(-5));
    LabAssert.Equal("00:00", MemoryModel.FormatujCzas(0));
    LabAssert.Equal("00:09", MemoryModel.FormatujCzas(9));
    LabAssert.Equal("00:59", MemoryModel.FormatujCzas(59));
    LabAssert.Equal("01:00", MemoryModel.FormatujCzas(60));
    LabAssert.Equal("01:15", MemoryModel.FormatujCzas(75));
    LabAssert.Equal("60:00", MemoryModel.FormatujCzas(3600));
    LabAssert.Equal("61:05", MemoryModel.FormatujCzas(3665));

    LabAssert.True(MemoryModel.CzyNowyRekord(0, 16));
    LabAssert.True(MemoryModel.CzyNowyRekord(-1, 10));
    LabAssert.True(MemoryModel.CzyNowyRekord(16, 12));
    LabAssert.False(MemoryModel.CzyNowyRekord(12, 12));
    LabAssert.False(MemoryModel.CzyNowyRekord(12, 15));
    LabAssert.False(MemoryModel.CzyNowyRekord(0, 0));
    LabAssert.False(MemoryModel.CzyNowyRekord(10, -4));
});

LabAssert.Test("Pełna symulacja rozgrywki doprowadza do StanGry.KoniecGry i blokuje dalsze ruchy", () => {
    var m = new MemoryModel(new Random(42));
    for (int i = 0; i < m.Symbole.Length; i++)
    {
        if (m.Dopasowane[i]) continue;
        for (int j = i + 1; j < m.Symbole.Length; j++)
        {
            if (!m.Dopasowane[j] && m.Symbole[i] == m.Symbole[j])
            {
                m.OznaczWyborPierwszej();
                LabAssert.True(m.SprawdzPare(i, j));
                break;
            }
        }
    }

    LabAssert.Equal(8, m.Ruchy);
    LabAssert.Equal(8, m.TrafionePary);
    LabAssert.True(m.CzyWygrana);
    LabAssert.Equal(StanGry.KoniecGry, m.Stan);
    LabAssert.Equal(100.0, m.ObliczSkutecznoscProcent());

    // Po zakończeniu gry ZakonczBlokade oraz SprawdzPare nie mogą zmienić stanu ani licznika ruchów
    m.ZakonczBlokade();
    LabAssert.Equal(StanGry.KoniecGry, m.Stan);
    LabAssert.False(m.SprawdzPare(0, 1));
    LabAssert.Equal(8, m.Ruchy);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Kiedy rozdzielać aplikację na Model i Widok?</strong> Zawsze wtedy, gdy logika (tasowanie, punktacja, stany) ma być testowana automatycznie bez otwierania okna GUI i ręcznego klikania.
- <strong>Kiedy anulować jednorazowy timer?</strong> Przed każdym resetem rozgrywki, przed uruchomieniem nowego timera oraz w zdarzeniu `FormClosed`, aby uniknąć wyścigów zdarzeń na świeżej planszy.
- <strong>Jak zarządzać czcionkami i kontrolkami GDI w WinForms?</strong> Współdziel instancje `Font` między kontrolkami, zwalniaj każdą z nich przez `Dispose()` w `FormClosed`, a przy przebudowie siatki nigdy nie polegaj na samym `Controls.Clear()`.
- <strong>Jak bezpiecznie zapisywać rekordy użytkownika na dysku?</strong> Zapisuj dane w folderze `LocalApplicationData` przez plik tymczasowy z `FileStream.Flush(true)`, a na końcu atomowo podmieniaj plik docelowy metodą `File.Replace` lub `File.Move`.
