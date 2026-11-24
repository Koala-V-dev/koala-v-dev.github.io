# Projekt NeonSnake - Płynna gra 2D na płótnie Graphics

Jeśli wrzucisz ruch węża, wykrywanie kolizji i losowanie jedzenia prosto do metod `Timer.Tick` i `OnPaint` okna WinForms, powstanie kod uwięziony w interfejsie graficznym. Aby sprawdzić, czy wąż poprawnie wykrywa cztery ściany albo nie ginie przy pościgu za własnym ogonem, musiałbyś za każdym razem uruchamiać grę i ręcznie sterować nią przez kilka minut.

W profesjonalnych grach 2D ten problem rozwiązuje się przez rozdzielenie aplikacji na dwa współpracujące pliki: okno graficzne oraz niezależny silnik logiki.

| Plik | Odpowiedzialność | Kluczowe mechanizmy |
| :--- | :--- | :--- |
| `Program.cs` | Okno WinForms (`SnakeForm`), renderowanie i klawiatura | `DoubleBuffered = true`, `KeyPreview = true`, `OnPaint` z `using`, `Timer` zwalniany w `FormClosed`, <kbd>W</kbd>/<kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd>, <kbd>Spacja</kbd>, <kbd>R</kbd> |
| `SnakeEngine.cs` | Czysta logika planszy, ruchu, kolizji i tempa gry | `LinkedList<Point>`, buforowany kierunek ruchu, ochrona przed błędem ogona, `Wygrana`, `ObliczInterwalMs(int wynik)` |

---

## 🏗️ Architektura Headless Engine i wstrzykiwanie Random

Klasa `SnakeEngine` realizuje wzorzec **Headless Engine** (silnik bez głowy graficznej). Nie dziedziczy po `Form`, nie tworzy żadnego `Timer` i nie wywołuje metod rysujących `Graphics`. Operuje wyłącznie na liczbach całkowitych oraz lekkiej strukturze `Point` z `System.Drawing`.

Dzięki temu cały silnik można skompilować i przetestować w ułamku sekundy w `csc.exe`, bez otwierania żadnego okna. Taki kod uruchomi się nawet na serwerze bez monitora albo w automatycznych testach jednostkowych.

Drugi filar testowalności to **wstrzykiwanie zależności** dla generatora liczb losowych. Gdyby `SnakeEngine` sam wywoływał w konstruktorze `new Random()`, każde uruchomienie testu losowałoby jedzenie w innym miejscu i testy byłyby niepowtarzalne. Przekazanie obiektu `Random` z zewnątrz (`new SnakeEngine(10, 10, new Random(1))`) daje w testach w 100% deterministyczny przebieg, a w prawdziwym oknie `SnakeForm` przekazujesz zwykłe `new Random()`.

> [!TIP]
> Wstrzykiwanie `Random(seed)` przez konstruktor to pierwszy krok do wzorca **Dependency Injection**. Dokładnie tak samo w dużych aplikacjach oddziela się logikę biznesową od zegara systemowego, sieci oraz bazy danych.

---

## 🐍 Ciało węża w LinkedList i pułapka gonienia własnego ogona

Kiedy wąż przesuwa się o jedną kratkę, środkowe segmenty ciała nie zmieniają swoich współrzędnych. Zmieniają się wyłącznie dwa końce:

- przed starą głową pojawia się nowa głowa (`Cialo.AddFirst(nowaGlowa)`),
- jeśli wąż nie zjadł jedzenia, znika ostatni segment ogona (`Cialo.RemoveLast()`).

W strukturze **`LinkedList<Point>`** węzeł `Cialo.First.Value` oznacza głowę, a `Cialo.Last.Value` koniec ogona. Zarówno `AddFirst`, jak i `RemoveLast` działają w stałym czasie _**O(1)**_, przestawiając tylko dwa wskaźniki, bez kopiowania pozostałych segmentów w pamięci.

### 🐍 Błąd gonienia własnego ogona

Wyobraź sobie 4-segmentowego węża zwiniętego w ciasny kwadrat 2×2. Jego głowa próbuje wejść dokładnie na kratkę, na której w tej chwili spoczywa koniec ogona (`Cialo.Last.Value`). Jeśli na tej kratce nie ma jedzenia, ogon w tym samym kroku przesunie się naprzód i **zwolni to pole**!

Naiwny warunek sprawdzający `Cialo.Contains(nowaGlowa)` przed uwzględnieniem znikającego ogona niesłusznie ogłosi **_GAME OVER_**. Jest to klasyczny **_błąd gonienia własnego ogona_**.

Reguła jest prosta: jeśli wąż w tym kroku **nie zjada jedzenia**, kratka zajmowana przez `Cialo.Last.Value` przestaje być przeszkodą. Dopiero gdy wąż właśnie zjadł jedzenie (i rośnie), jego ogon zostaje na miejscu, więc każde pole z `Cialo` jest zajęte.

### 🏆 Warunek zwycięstwa przy pełnej planszy

Co się stanie, gdy gracz zje ostatnie jabłko i ciało węża wypełni wszystkie `Szer * Wys` kratek? Jeśli metoda `LosujJedzenie()` używa pętli `while`, która w nieskończoność szuka wolnego pola, gra **_zawiesi się na stałe_**. Z kolei pętla ograniczona do 200 losowań zostawi stare jedzenie pod głową węża i zepsuje rozgrywkę.

Bezpieczne `LosujJedzenie()` najpierw zbiera wszystkie wolne pola planszy (niezajęte przez `Cialo`). Jeśli lista wolnych pól jest pusta, plansza została zdobyta: ustawiasz `Wygrana = true` oraz `KoniecGry = true`. Jeśli wolne pola istnieją, losujesz jedno z nich za pomocą `_rnd.Next(wolnePola.Count)`. To gwarantuje znalezienie nawet ostatniej pojedynczej kratki na niemal pełnej planszy.

> [!WARNING]
> Nigdy nie używaj nieograniczonej pętli `while (true)` do losowania jedzenia na planszy skończonej wielkości. Gdy wąż zajmie ponad 95% kratek, losowe strzały dramatycznie spowalniają grę, a przy 100% zapełnienia zamrażają wątek UI na zawsze.

<data-gate>
<data-connection-matcher title="Dopasuj element architektury NeonSnake do jego roli">
    <item left="LinkedList<Point> (AddFirst i RemoveLast)" right="Przesunięcie głowy i ogona w czasie O(1) bez kopiowania środka ciała"></item>
    <item left="DoubleBuffered = true w SnakeForm" right="Rysowanie całej klatki w buforze RAM bez migotania obrazu"></item>
    <item left="Pola _kierunekKrokuDx i _kierunekKrokuDy" right="Zapamiętanie ostatniego wykonanego ruchu przeciw zawróceniu w 1 klatce"></item>
    <item left="Zwolnienie pola Cialo.Last.Value przy braku jedzenia" right="Eliminacja fałszywej śmierci w błędzie gonienia własnego ogona"></item>
    <item left="Przekazanie Random(seed) do konstruktora" right="Deterministyczne i powtarzalne testy losowania jedzenia"></item>
</data-connection-matcher>
</data-gate>

---

## ⏱️ Buforowanie wejścia i ochrona przed zawróceniem o 180 stopni

W grze ze stałym interwałem kroku (na starcie _**115 ms**_) gracz potrafi wcisnąć dwa klawisze szybciej, niż zdąży tyknąć zegar. Gdy wąż jedzie w prawo `(1, 0)`, szybkie naciśnięcie <kbd>S</kbd> (dół), a po 30 ms <kbd>A</kbd> (lewo) w naiwnej wersji gry kończy się katastrofą.

Dzieje się tak, ponieważ naiwna blokada porównuje nowy klawisz z aktualnie zapisanym kierunkiem (`Dx`, `Dy`). Pierwszy klawisz zmienia go z `(1, 0)` na `(0, 1)`, więc drugi klawisz `(-1, 0)` nie jest już przeciwny do `(0, 1)` i zostaje zaakceptowany. Przy najbliższym ticku wąż rusza w lewo prosto we własną szyję i pojawia się **_GAME OVER_**.

Aby zamknąć tę lukę, `SnakeEngine` rozdziela dwa wektory:

- **`_kierunekKrokuDx`, `_kierunekKrokuDy`**: kierunek, w którym wąż wykonał **ostatni faktyczny ruch** na planszy (aktualizowany wyłącznie wewnątrz `WykonajKrok()`).
- **`Dx`, `Dy`**: następny kierunek zaplanowany przez gracza w `UstawKierunek(int dx, int dy)`.

Metoda `UstawKierunek` porównuje nowy wektor z `_kierunekKrokuDx` i `_kierunekKrokuDy`. Dzięki temu w obrębie jednej klatki gracz może zmienić zdanie między <kbd>W</kbd> a <kbd>S</kbd>, ale nigdy nie obejdzie zakazu zawrócenia o 180 stopni.

<data-gate>
<data-sortable-list title="Ułóż oś czasu 1-klatkowego buforowania wejścia dla węża jadącego w prawo (1, 0)">
  <item data-correct="3">65 ms: Gracz wciska A (-1, 0), lecz suma z _kierunekKroku (1, 0) daje (0, 0), więc komenda zostaje odrzucona</item>
  <item data-correct="1">0 ms: Poprzedni tick kończy krok w prawo, zapisując _kierunekKroku = (1, 0) oraz bufor (Dx, Dy) = (1, 0)</item>
  <item data-correct="4">115 ms: Zegar wywołuje WykonajKrok(), zatwierdza bufor (0, 1) i wąż bezpiecznie skręca w dół</item>
  <item data-correct="2">30 ms: Gracz wciska S (0, 1); nie jest przeciwny do _kierunekKroku (1, 0), więc trafia do bufora (Dx, Dy) = (0, 1)</item>
</data-sortable-list>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: LinkedList kontra List, koszt 500 segmentów oraz Fixed Timestep kontra Delta Time</span>
<span class="deep-dive-badge">STRUKTURY DANYCH · INPUT BUFFERING · PĘTLA GRY</span>
</summary>
<div class="deep-dive-content">

<h4>1. LinkedList&lt;Point&gt; kontra List&lt;Point&gt; dla 500 segmentów</h4>

Wyobraź sobie długą partię, w której wąż ma _**500 segmentów**_ (`Point` to struktura 8-bajtowa: dwa `int` po 4 bajty). Porównaj, ile pracy wykonuje CPU przy każdym pojedynczym kroku węża:

| Struktura danych | Operacja dodania głowy i usunięcia ogona | Koszt dla 500 segmentów | Alokacje na stercie GC przy kroku |
| :--- | :--- | :--- | :--- |
| `List<Point>` | `Insert(0, p)` oraz `RemoveAt(count - 1)` | Przesunięcie 500 elementów (`Array.Copy` = 4 000 bajtów) | 0 (o ile tablica ma zapas pojemności) |
| `LinkedList<Point>` | `AddFirst(p)` oraz `RemoveLast()` | Dokładnie 2 przepięcia wskaźników `First`/`Last` | 1 obiekt `LinkedListNode<Point>` (ok. 48 B) |
| Bufor cykliczny `Point[]` | Zapis pod `buf[head]` i przesunięcie indeksów | Dokładnie 2 operacje arytmetyczne (modulo) | 0 alokacji i pełna lokalność cache CPU |

W `NeonSnake` używamy `LinkedList<Point>`, bo daje czytelny kod i stały koszt _**O(1)**_ na końcach bez ręcznego zarządzania indeksami bufora cyklicznego. Zauważ jednak, że wywołanie `Cialo.Contains(nowaGlowa)` nadal sprawdza węzły kolejno (dla 500 segmentów to poniżej 0,002 ms). W dużych grach z tysiącami jednostek obok listy utrzymuje się dodatkowo tablicę `bool[Szer, Wys]` lub `HashSet<Point>`, aby test kolizji wymagał jednego odczytu z pamięci.

<h4>2. Dlaczego dwa szybkie kliknięcia w 1 klatce łamią naiwną blokadę 180 stopni</h4>

Załóżmy, że zegar tyka co _**115 ms**_, a wąż jedzie w prawo `(1, 0)`. Zestawmy oś czasu jednej klatki w wersji naiwnej i buforowanej:

| Czas w klatce | Zdarzenie gracza lub gry | Wersja naiwna (porównuje z `Dx, Dy`) | Wersja buforowana (porównuje z `_kierunekKroku`) |
| :--- | :--- | :--- | :--- |
| `0 ms` | Poprzedni krok w prawo | `Dx = 1, Dy = 0` | `_kierunekKroku = (1, 0)`, `Dx = 1, Dy = 0` |
| `30 ms` | Gracz wciska <kbd>S</kbd> (dół) | `(1, 0) + (0, 1) != (0, 0)` ustawia `(0, 1)` | `(1, 0) + (0, 1) != (0, 0)` ustawia `Dx = 0, Dy = 1` |
| `65 ms` | Gracz wciska <kbd>A</kbd> (lewo) | `(0, 1) + (-1, 0) != (0, 0)` ustawia `(-1, 0)`! | `(1, 0) + (-1, 0) == (0, 0)` odrzucone! |
| `115 ms` | Tick timera (`WykonajKrok`) | Wąż rusza w lewo we własną szyję: **_GAME OVER_** | Wąż skręca bezpiecznie w dół `(0, 1)` |

W zaawansowanych grach zręcznościowych stosuje się nawet 2-elementową kolejkę wejść (`Queue<Point>`), aby drugi szybki klawisz (<kbd>A</kbd>) nie zginął, lecz wykonał się automatycznie w kolejnej klatce po skręcie w dół.

<h4>3. Fixed Timestep kontra Delta Time w silnikach gier</h4>

W `NeonSnake` używamy stałego kroku dyskretnego (**Fixed Timestep**): każde wywołanie `WykonajKrok()` przesuwa węża dokładnie o 1 kratkę siatki, a poziom trudności regulujemy skracaniem interwału timera (`ObliczInterwalMs`). Dzięki temu symulacja jest w 100% deterministyczna: identyczna sekwencja klawiszy zawsze da ten sam wynik.

W grach akcji z płynnym ruchem na pikselach pozycję liczy się z użyciem **Delta Time** (*dt*), czyli czasu od poprzedniej klatki: `x += vx * dt`. Samo *dt* potrafi jednak zepsuć kolizje podczas chwilowego przycięcia (przy lagu 250 ms szybki pocisk przeskoczy na drugą stronę ściany bez dotknięcia jej AABB). Dlatego nowoczesne silniki gier (Unity `FixedUpdate`, Godot `_physics_process`) stosują akumulator stałego kroku:

```csharp
double akumulator = 0.0;
const double KrokFizyki = 1.0 / 60.0; // stałe 16,67 ms na krok fizyki
akumulator += zmierzonyCzasKlatki;
while (akumulator >= KrokFizyki)
{
    AktualizujFizykę(KrokFizyki);
    akumulator -= KrokFizyki;
}
RenderujZInterpolacja(akumulator / KrokFizyki);
```

</div>
</details>

---

## 💻 Projekt Modułu 7: Zbuduj i pobierz NeonSnake.exe

Przełącz zakładkę na **`SnakeEngine.cs`** i zaimplementuj cztery metody silnika:

1. **`UstawKierunek(int dx, int dy)`**:
   - ignoruje wektor zerowy `(0, 0)`,
   - blokuje obrót o 180 stopni względem ostatniego faktycznego kroku (`_kierunekKrokuDx`, `_kierunekKrokuDy`),
   - dla poprawnego kierunku aktualizuje buforowane pola `Dx` i `Dy`.
2. **`LosujJedzenie()`**:
   - znajduje wszystkie wolne pola na planszy `Szer x Wys` niezajęte przez `Cialo`,
   - jeśli nie ma żadnego wolnego pola, ustawia `Wygrana = true` oraz `KoniecGry = true`,
   - w przeciwnym razie losuje jedno wolne pole za pomocą `_rnd` i zapisuje je w `Jedzenie`.
3. **`ObliczInterwalMs(int wynik)`** (metoda statyczna):
   - dla wyniku `0` oraz wartości ujemnych zwraca _**115 ms**_,
   - każde pełne `10` punktów skraca interwał o `3` ms (na przykład `100` punktów daje `85` ms),
   - interwał nigdy nie spada poniżej _**55 ms**_.
4. **`WykonajKrok()`**:
   - jeśli `KoniecGry` jest już `true`, zwraca `false`,
   - wylicza nową pozycję głowy na podstawie `Glowa` i buforowanego kierunku `(Dx, Dy)`,
   - jeśli nowa pozycja wychodzi poza `[0..Szer-1] x [0..Wys-1]`, ustawia `KoniecGry = true` i zwraca `false`,
   - sprawdza kolizję z ciałem z uwzględnieniem błędu gonienia własnego ogona (gdy wąż nie zjada jedzenia, pole `Cialo.Last.Value` zwalnia się w tym kroku i nie powoduje kolizji),
   - zatwierdza kierunek ostatniego kroku, przesuwa węża, a przy trafieniu w `Jedzenie` zwiększa `Wynik` o `10` i wywołuje `LosujJedzenie()`,
   - zwraca `true` po wykonaniu poprawnego ruchu.

Po przejściu wszystkich testów pobierz plik **`NeonSnake.exe`** i uruchom grę na Windows. Sterowanie: <kbd>W</kbd>/<kbd>A</kbd>/<kbd>S</kbd>/<kbd>D</kbd> lub strzałki, <kbd>Spacja</kbd> (pauza), <kbd>R</kbd> (restart).

<data-gate>
<data-csharp-lab title="Projekt Modułu 7: NeonSnake 2D (Graphics + DoubleBuffered + LinkedList)" exe-name="NeonSnake.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;
using System.Windows.Forms;

public class SnakeForm : Form
{
    private const int Kratka = 22;
    private const int Szer = 22;
    private const int Wys = 20;
    private const int WysokoscHud = 36;

    private SnakeEngine _gra;
    private readonly Timer _timer = new Timer();
    private bool _pauza = false;

    public SnakeForm()
    {
        Text = "NeonSnake 2D - WASD / Strzalki | Spacja: Pauza | R: Restart";
        ClientSize = new Size(Szer * Kratka, Wys * Kratka + WysokoscHud);
        BackColor = Color.FromArgb(15, 23, 42);
        StartPosition = FormStartPosition.CenterScreen;
        FormBorderStyle = FormBorderStyle.FixedSingle;
        MaximizeBox = false;
        DoubleBuffered = true;
        KeyPreview = true;

        _gra = new SnakeEngine(Szer, Wys, new Random());
        _timer.Interval = SnakeEngine.ObliczInterwalMs(_gra.Wynik);
        _timer.Tick += (s, e) =>
        {
            if (_pauza || _gra.KoniecGry) return;
            _gra.WykonajKrok();
            _timer.Interval = SnakeEngine.ObliczInterwalMs(_gra.Wynik);
            Invalidate();
        };

        KeyDown += OnKlawisz;
        FormClosed += (s, e) =>
        {
            _timer.Stop();
            _timer.Dispose();
        };
        _timer.Start();
    }

    private void OnKlawisz(object sender, KeyEventArgs e)
    {
        if (e.KeyCode == Keys.Space && !_gra.KoniecGry)
        {
            _pauza = !_pauza;
            Invalidate();
            return;
        }
        if (e.KeyCode == Keys.R)
        {
            _gra = new SnakeEngine(Szer, Wys, new Random());
            _pauza = false;
            _timer.Interval = SnakeEngine.ObliczInterwalMs(_gra.Wynik);
            Invalidate();
            return;
        }
        if (e.KeyCode == Keys.W || e.KeyCode == Keys.Up) _gra.UstawKierunek(0, -1);
        else if (e.KeyCode == Keys.S || e.KeyCode == Keys.Down) _gra.UstawKierunek(0, 1);
        else if (e.KeyCode == Keys.A || e.KeyCode == Keys.Left) _gra.UstawKierunek(-1, 0);
        else if (e.KeyCode == Keys.D || e.KeyCode == Keys.Right) _gra.UstawKierunek(1, 0);
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        Graphics g = e.Graphics;
        g.Clear(Color.FromArgb(15, 23, 42));

        // Pasek wyniku na górze (HUD)
        using (var barBrush = new SolidBrush(Color.FromArgb(30, 41, 59)))
        using (var font = new Font("Segoe UI", 11, FontStyle.Bold))
        using (var txtBrush = new SolidBrush(Color.FromArgb(56, 189, 248)))
        {
            g.FillRectangle(barBrush, 0, 0, ClientSize.Width, WysokoscHud);
            string stan;
            if (_gra.Wygrana) stan = "WYGRANA! (wcisnij R)";
            else if (_gra.KoniecGry) stan = "GAME OVER (wcisnij R)";
            else if (_pauza) stan = "PAUZA (Spacja)";
            else stan = "WASD / Strzalki";

            g.DrawString(string.Format("Wynik: {0}   |   {1}", _gra.Wynik, stan), font, txtBrush, 12, 8);
        }

        // Jedzenie (tylko jeśli plansza nie została jeszcze zapełniona)
        if (!_gra.Wygrana)
        {
            using (var foodBrush = new SolidBrush(Color.FromArgb(248, 113, 113)))
            {
                g.FillEllipse(foodBrush,
                    _gra.Jedzenie.X * Kratka + 3,
                    WysokoscHud + _gra.Jedzenie.Y * Kratka + 3,
                    Kratka - 6, Kratka - 6);
            }
        }

        // Ciało węża
        bool pierwsza = true;
        using (var headBrush = new SolidBrush(Color.FromArgb(56, 189, 248)))
        using (var bodyBrush = new SolidBrush(Color.FromArgb(52, 211, 153)))
        {
            foreach (Point seg in _gra.Cialo)
            {
                g.FillRectangle(pierwsza ? headBrush : bodyBrush,
                    seg.X * Kratka + 2,
                    WysokoscHud + seg.Y * Kratka + 2,
                    Kratka - 4, Kratka - 4);
                pierwsza = false;
            }
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
        Application.Run(new SnakeForm());
    }
}
```

</cs-file>
<cs-file name="SnakeEngine.cs">

```csharp
using System;
using System.Collections.Generic;
using System.Drawing;

public class SnakeEngine
{
    public int Szer { get; private set; }
    public int Wys { get; private set; }
    public LinkedList<Point> Cialo { get; private set; }
    public Point Glowa { get { return Cialo.First.Value; } }
    public Point Jedzenie { get; set; }
    public int Dx { get; private set; }
    public int Dy { get; private set; }
    public int Wynik { get; private set; }
    public bool KoniecGry { get; private set; }
    public bool Wygrana { get; private set; }

    private int _kierunekKrokuDx;
    private int _kierunekKrokuDy;
    private readonly Random _rnd;

    public SnakeEngine(int szer, int wys, Random rnd)
    {
        Szer = szer;
        Wys = wys;
        _rnd = rnd;
        Cialo = new LinkedList<Point>();
        Cialo.AddLast(new Point(szer / 2, wys / 2));
        Cialo.AddLast(new Point(szer / 2 - 1, wys / 2));
        Cialo.AddLast(new Point(szer / 2 - 2, wys / 2));
        Dx = 1;
        Dy = 0;
        _kierunekKrokuDx = 1;
        _kierunekKrokuDy = 0;
        LosujJedzenie();
    }

    public void UstawKierunek(int dx, int dy)
    {
        // Zaimplementuj buforowanie kierunku z ochroną przed wektorem zerowym i obrotem o 180 stopni
    }

    public void LosujJedzenie()
    {
        // Wylosuj wolne pole planszy lub ustaw Wygrana i KoniecGry, gdy brak wolnych pól
    }

    public static int ObliczInterwalMs(int wynik)
    {
        // Start 115 ms, skracanie co 10 pkt o 3 ms, dolny limit 55 ms
        return 115;
    }

    public bool WykonajKrok()
    {
        // Obsłuż ruch, granice, kolizję z ciałem (w tym zwalniany ogon), jedzenie oraz wynik
        return false;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("WykonajKrok przesuwa węża, zjada jedzenie i zwiększa długość oraz wynik", () => {
    var s = new SnakeEngine(10, 10, new Random(1));
    int startX = s.Glowa.X;
    int startY = s.Glowa.Y;
    s.Jedzenie = new Point(startX + 1, startY);

    LabAssert.True(s.WykonajKrok());
    LabAssert.Equal(startX + 1, s.Glowa.X);
    LabAssert.Equal(startY, s.Glowa.Y);
    LabAssert.Equal(10, s.Wynik);
    LabAssert.Equal(4, s.Cialo.Count);
    LabAssert.False(s.Cialo.Contains(s.Jedzenie));
    LabAssert.False(s.Wygrana);

    // Kolejny krok bez jedzenia nie zwiększa długości
    s.Jedzenie = new Point(0, 0);
    LabAssert.True(s.WykonajKrok());
    LabAssert.Equal(4, s.Cialo.Count);
    LabAssert.Equal(10, s.Wynik);
});

LabAssert.Test("WykonajKrok wykrywa zderzenie ze wszystkimi 4 ścianami planszy", () => {
    // Prawa ściana
    var sRight = new SnakeEngine(8, 8, new Random(1));
    sRight.Jedzenie = new Point(0, 0);
    bool zyje = true;
    for (int i = 0; i < 20 && zyje; i++) zyje = sRight.WykonajKrok();
    LabAssert.True(sRight.KoniecGry);
    LabAssert.False(sRight.Wygrana);
    LabAssert.False(sRight.WykonajKrok());

    // Górna ściana
    var sTop = new SnakeEngine(8, 8, new Random(2));
    sTop.Jedzenie = new Point(7, 7);
    sTop.UstawKierunek(0, -1);
    zyje = true;
    for (int i = 0; i < 20 && zyje; i++) zyje = sTop.WykonajKrok();
    LabAssert.True(sTop.KoniecGry);

    // Dolna ściana
    var sBot = new SnakeEngine(8, 8, new Random(3));
    sBot.Jedzenie = new Point(0, 0);
    sBot.UstawKierunek(0, 1);
    zyje = true;
    for (int i = 0; i < 20 && zyje; i++) zyje = sBot.WykonajKrok();
    LabAssert.True(sBot.KoniecGry);

    // Lewa ściana (najpierw skręt w górę, potem w lewo)
    var sLeft = new SnakeEngine(8, 8, new Random(4));
    sLeft.Jedzenie = new Point(7, 7);
    sLeft.UstawKierunek(0, -1);
    LabAssert.True(sLeft.WykonajKrok());
    sLeft.UstawKierunek(-1, 0);
    zyje = true;
    for (int i = 0; i < 20 && zyje; i++) zyje = sLeft.WykonajKrok();
    LabAssert.True(sLeft.KoniecGry);
    LabAssert.Equal(-1, sLeft.Dx);
    LabAssert.Equal(0, sLeft.Glowa.X);
});

LabAssert.Test("WykonajKrok wykrywa kolizję z własnym tułowiem", () => {
    var s = new SnakeEngine(12, 12, new Random(5));
    // Nakarm węża 2 razy, aby miał długość 5 i mógł zawinąć się w pętlę
    s.Jedzenie = new Point(s.Glowa.X + 1, s.Glowa.Y);
    LabAssert.True(s.WykonajKrok());
    s.Jedzenie = new Point(s.Glowa.X + 1, s.Glowa.Y);
    LabAssert.True(s.WykonajKrok());
    LabAssert.Equal(5, s.Cialo.Count);

    s.Jedzenie = new Point(0, 0);
    s.UstawKierunek(0, 1);  // w dół
    LabAssert.True(s.WykonajKrok());
    s.UstawKierunek(-1, 0); // w lewo
    LabAssert.True(s.WykonajKrok());
    s.UstawKierunek(0, -1); // w górę: uderzenie we własny tułów
    LabAssert.False(s.WykonajKrok());
    LabAssert.True(s.KoniecGry);
    LabAssert.False(s.Wygrana);
});

LabAssert.Test("Wejście na pole opuszczane właśnie przez ogon nie zabija węża (brak błędu gonienia ogona)", () => {
    var s = new SnakeEngine(10, 10, new Random(7));
    // Wydłuż węża do 4 segmentów
    s.Jedzenie = new Point(s.Glowa.X + 1, s.Glowa.Y);
    LabAssert.True(s.WykonajKrok());
    LabAssert.Equal(4, s.Cialo.Count);

    // Ustaw jedzenie daleko, aby wąż nie rósł podczas zwijania się w kwadrat 2x2
    s.Jedzenie = new Point(0, 0);
    s.UstawKierunek(0, 1);  // w dół
    LabAssert.True(s.WykonajKrok());
    s.UstawKierunek(-1, 0); // w lewo
    LabAssert.True(s.WykonajKrok());

    Point poleOgona = s.Cialo.Last.Value;
    s.UstawKierunek(0, -1); // w górę dokładnie na pole, które ogon właśnie zwalnia
    LabAssert.True(s.WykonajKrok());
    LabAssert.False(s.KoniecGry);
    LabAssert.Equal(poleOgona, s.Glowa);
    LabAssert.Equal(4, s.Cialo.Count);
});

LabAssert.Test("Buforowanie kierunku blokuje zawracanie o 180 stopni nawet przy dwóch kliknięciach w 1 klatce", () => {
    var s = new SnakeEngine(10, 10, new Random(1));
    s.Jedzenie = new Point(0, 0);

    // Wektor zerowy jest ignorowany
    s.UstawKierunek(0, 0);
    LabAssert.Equal(1, s.Dx);
    LabAssert.Equal(0, s.Dy);

    // Wąż jedzie w prawo (1, 0). Gracz naciska szybko Górę, a potem Lewo zanim upłynie klatka:
    s.UstawKierunek(0, -1);
    s.UstawKierunek(-1, 0); // musi zostać odrzucone względem ostatniego kroku (1, 0)
    LabAssert.Equal(0, s.Dx);
    LabAssert.Equal(-1, s.Dy);
    LabAssert.True(s.WykonajKrok());
    LabAssert.False(s.KoniecGry);

    // Po wykonaniu kroku w górę (0, -1) kierunek przeciwny (0, 1) musi być odrzucony
    s.UstawKierunek(0, 1);
    LabAssert.Equal(0, s.Dx);
    LabAssert.Equal(-1, s.Dy);

    // Skręt w lewo (-1, 0) jest dozwolony, a próba zawrócenia w dół (0, 1) w tej samej klatce musi być odrzucona
    s.UstawKierunek(-1, 0);
    LabAssert.Equal(-1, s.Dx);
    LabAssert.Equal(0, s.Dy);
    s.UstawKierunek(0, 1);
    LabAssert.Equal(-1, s.Dx);
    LabAssert.Equal(0, s.Dy);
});

LabAssert.Test("Zapełnienie całej planszy ustawia Wygrana = true i KoniecGry = true bez zawieszenia", () => {
    // Plansza 4x1: wąż zajmuje startowo (2,0), (1,0), (0,0), więc jedyne wolne pole to (3,0)
    var s = new SnakeEngine(4, 1, new Random(1));
    LabAssert.Equal(new Point(3, 0), s.Jedzenie);
    LabAssert.False(s.Wygrana);
    LabAssert.False(s.KoniecGry);

    // Jeden krok w prawo zjada ostatnie jedzenie i zapełnia wszystkie 4 pola
    LabAssert.True(s.WykonajKrok());
    LabAssert.Equal(4, s.Cialo.Count);
    LabAssert.Equal(10, s.Wynik);
    LabAssert.True(s.Wygrana);
    LabAssert.True(s.KoniecGry);
    LabAssert.False(s.WykonajKrok());
});

LabAssert.Test("ObliczInterwalMs przyspiesza grę z punktami i nie spada poniżej 55 ms", () => {
    LabAssert.Equal(115, SnakeEngine.ObliczInterwalMs(0));
    LabAssert.Equal(115, SnakeEngine.ObliczInterwalMs(-50));
    LabAssert.Equal(115, SnakeEngine.ObliczInterwalMs(9));
    LabAssert.Equal(112, SnakeEngine.ObliczInterwalMs(10));
    LabAssert.Equal(112, SnakeEngine.ObliczInterwalMs(19));
    LabAssert.Equal(85, SnakeEngine.ObliczInterwalMs(100));
    LabAssert.Equal(55, SnakeEngine.ObliczInterwalMs(200));
    LabAssert.Equal(55, SnakeEngine.ObliczInterwalMs(1000));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Dlaczego oddzielamy <code>SnakeEngine</code> od <code>SnakeForm</code>?</strong> Architektura **Headless Engine** pozwala weryfikować ruch, ściany, ogon i warunek zwycięstwa automatycznymi testami w ułamku sekundy, bez uruchamiania okna WinForms.
- <strong>Dlaczego przekazujemy <code>Random</code> przez konstruktor?</strong> Wstrzykiwanie `Random(seed)` zapewnia powtarzalność testów losowania jedzenia, przy zachowaniu pełnej losowości w oknie gry.
- <strong>Jak uniknąć błędu gonienia własnego ogona?</strong> Gdy wąż w danym kroku nie zjada jedzenia, kratka zajmowana przez `Cialo.Last.Value` zostanie zwolniona, więc wejście na nią nie jest kolizją.
- <strong>Jak zabezpieczyć losowanie jedzenia przy pełnej planszy?</strong> Zbieraj wolne pola zamiast używać nieskończonej pętli `while`; gdy lista wolnych pól jest pusta, ustaw `Wygrana = true` i `KoniecGry = true`.
- <strong>Jak skutecznie zablokować zawracanie o 180 stopni?</strong> Porównuj nowy klawisz z kierunkiem ostatniego faktycznie wykonanego kroku (`_kierunekKrokuDx`, `_kierunekKrokuDy`), a nie z buforowanym `(Dx, Dy)`.
