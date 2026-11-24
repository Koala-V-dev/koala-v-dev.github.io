# Grafika 2D Graphics, DoubleBuffered i obsługa klawiatury

Kontrolki `Button` i `PictureBox` sprawdzają się w grach turowych, takich jak Kółko i Krzyżyk. Gdy jednak spróbujesz przesuwać kilkadziesiąt takich kontrolek _**60 razy na sekundę**_, interfejs WinForms zacznie migotać i gubić klatki. Każda kontrolka to osobne podokno systemu Windows z własnym uchwytem i ciężkim narzutem odświeżania.

Gry działające w czasie rzeczywistym (Snake, Pong, Arkanoid) wymagają jednego **płótna 2D** w klasie `System.Drawing.Graphics`. Tutaj natykasz się od razu na pierwsze zderzenie z architekturą systemu: to, co narysujesz na oknie raz, zniknie bez śladu, gdy tylko zasłonisz aplikację innym programem.

---

## 🎨 Układ współrzędnych 2D, ClientSize i mapowanie siatki

W matematyce szkolnej oś Y rośnie w górę. W grafice ekranowej (WinForms, DirectX, HTML Canvas, Unity UI) punkt `(0, 0)` leży w lewym górnym rogu obszaru roboczego, oś X rośnie w prawo, a oś Y rośnie w dół.

| Kierunek ruchu | Klawisze | Zmiana X (*dx*) | Zmiana Y (*dy*) | Przesunięcie z `(10, 10)` |
| :--- | :---: | :---: | :---: | :--- |
| W górę | <kbd>W</kbd> / <kbd>↑</kbd> | `0` | `-1` | `(10, 9)` |
| W dół | <kbd>S</kbd> / <kbd>↓</kbd> | `0` | `1` | `(10, 11)` |
| W lewo | <kbd>A</kbd> / <kbd>←</kbd> | `-1` | `0` | `(9, 10)` |
| W prawo | <kbd>D</kbd> / <kbd>→</kbd> | `1` | `0` | `(11, 10)` |

### 📐 ClientSize kontra Size

Kiedy tworzysz okno gry o rozmiarze 400 na 300 pikseli, musisz rozróżnić dwie właściwości klasy `Form`:

- **`Size`**: wymiar zewnętrzny całego okna, łącznie z belką tytułu oraz ramkami systemu Windows. Belka i ramki zabierają kilkadziesiąt pikseli z pola gry, a ich grubość zależy od motywu i skali DPI.
- **`ClientSize`**: wymiar wyłącznie wewnętrznego płótna, po którym wolno rysować obiektowi `Graphics`.

W grach 2D zawsze ustawiaj `ClientSize`. Dzięki temu wiesz dokładnie, że prawy dolny piksel planszy ma współrzędne `(ClientSize.Width - 1, ClientSize.Height - 1)`.

### 🗺️ Mapowanie kafelka siatki na piksele ekranu

Logika gry operuje na prostych współrzędnych siatki (*kolumna*, *wiersz*), natomiast ekran wymaga pikseli. Jeśli u góry okna znajduje się pasek wyniku (**HUD**) o wysokości *wysokoscHud*, a wokół planszy zostawiasz ramkę *margines*, pozycję kafelka na ekranie wyliczasz dwoma wzorami:

```csharp
int pikselX = margines + kolumna * rozmiarKratki;
int pikselY = wysokoscHud + margines + wiersz * rozmiarKratki;
```

Dla kafelka `(2, 1)` przy rozmiarze kratki `20`, wysokości HUD `36` i marginesie `4` otrzymasz prostokąt `Rectangle(44, 60, 20, 20)`. Takie rozdzielenie sprawia, że zmiana rozmiaru kafelka w jednym miejscu natychmiast skaluje całą planszę.

### 🔄 Zawijanie krawędzi i pułapka ujemnego modulo

W grach z przechodzeniem przez krawędź planszy (jak Asteroids czy Snake bez ścian) po wyjściu za prawą krawędź obiekt wraca na pozycję `0`, a po wyjściu za lewą trafia na `rozmiarPlanszy - 1`. Pierwsza intuicja podpowiada użycie reszty z dzielenia: `(pozycja + delta) % rozmiarPlanszy`.

W języku C# operator `%` zachowuje znak liczby dzielonej. Dlatego wyrażenie `-1 % 20` zwraca **`-1`**, a nie `19`! Taki wynik wywołuje **_IndexOutOfRangeException_** przy odczycie z tablicy albo wyrzuca obiekt poza widoczne okno.

Aby zawijanie działało poprawnie również dla ujemnych przesunięć większych niż rozmiar planszy (na przykład *delta* równe `-45` na planszy o szerokości `20`), stosuje się podwójne modulo:

```csharp
int wynik = (((pozycja + delta) % rozmiarPlanszy) + rozmiarPlanszy) % rozmiarPlanszy;
```

Pierwsze `% rozmiarPlanszy` sprowadza wynik do przedziału `(-rozmiarPlanszy, rozmiarPlanszy)`. Dodanie *rozmiarPlanszy* przenosi liczby ujemne na stronę dodatnią, a drugie `% rozmiarPlanszy` zamyka całość w zakresie `[0, rozmiarPlanszy - 1]`.

---

## 🖼️ Architektura WM_PAINT, DoubleBuffered i pułapka CreateGraphics

System Windows nie przechowuje w pamięci kopii tego, co narysowałeś wewnątrz okna. Gdy użytkownik zminimalizuje program, przeciągnie po nim inne okno albo zmieni jego rozmiar, system wysyła komunikat _**WM_PAINT**_. Ten komunikat jest rozkazem: „odtwórz zawartość swojego płótna od zera na podstawie aktualnego stanu”.

### 🚫 Dlaczego CreateGraphics jest pułapką

Początkujący często wywołują `this.CreateGraphics()` wewnątrz kliknięcia przycisku lub timera, rysują prostokąt i cieszą się z efektu. Problem ujawnia się po sekundzie: wystarczy zasłonić okno innym programem, a Windows wyśle _**WM_PAINT**_ i zetrze cały rysunek. Metoda `CreateGraphics()` maluje bezpośrednio na ekranie poza cyklem odświeżania systemu, więc taki obraz jest nietrwały i migocze.

Poprawna architektura rysowania w WinForms opiera się na trzech filarach:

1. **`DoubleBuffered = true`** w konstruktorze okna: każda klatka powstaje najpierw w niewidocznym buforze pamięci RAM, a dopiero po zakończeniu rysowania trafia na ekran w jednym kroku.
2. **`Invalidate()`** wywoływane w `Timer.Tick`: nie rysuje klatki od razu, lecz oznacza obszar roboczy jako nieaktualny i wstawia komunikat _**WM_PAINT**_ do kolejki zdarzeń okna.
3. **`OnPaint(PaintEventArgs e)`**: jedyne miejsce, w którym rysujesz stan gry na przekazanym obiekcie `e.Graphics`. Na początku wywołuj **`base.OnPaint(e)`**, aby klasa bazowa mogła obsłużyć podpięte zdarzenia `Paint`.

### 🧹 Zarządzanie uchwytami GDI+ i cacheowanie pędzli

Każdy obiekt `SolidBrush`, `Pen` oraz `Font` rezerwuje natywny uchwyt w jądrze systemu Windows. Masz dwie bezpieczne strategie zarządzania tymi zasobami:

- **Blok `using` w `OnPaint`**: tworzysz pędzel lokalnie i zwalniasz go natychmiast na końcu bloku. Jest to czytelne i odporne na błędy przy małej liczbie kolorów.
- **Cacheowanie w polach klasy**: jeśli co klatkę rysujesz setki kafelków tymi samymi 4 kolorami, utwórz pola `private readonly SolidBrush` raz w konstruktorze i zwolnij je przez `Dispose()` w zdarzeniu `FormClosed` (lub nadpisując `Dispose(bool)`). Unikasz wtedy zbędnego tworzenia i niszczenia uchwytów _**60 razy na sekundę**_.

> [!WARNING]
> Nigdy nie zostawiaj obiektów `SolidBrush`, `Pen` ani `Font` bez `using` lub `Dispose()`. Przy _**60 FPS**_ wyciek zaledwie 3 uchwytów na klatkę marnuje 180 uchwytów na sekundę. Po około _**55 sekundach**_ proces uderzy w sztywny limit _**10 000 uchwytów**_ GDI na proces i zakończy się awarią **_ExternalException_** lub **_OutOfMemoryException_**.

<data-gate>
<data-sortable-list title="Ułóż poprawną kolejność cyklu życia i renderowania klatki w WinForms">
  <item data-correct="4">System Windows dostarcza komunikat WM_PAINT, a metoda OnPaint wywołuje base.OnPaint(e) i rysuje stan gry</item>
  <item data-correct="1">Konstruktor okna ustawia ClientSize, włącza DoubleBuffered = true i przygotowuje zegar oraz cache pędzli</item>
  <item data-correct="5">Zdarzenie FormClosed zatrzymuje zegar i wywołuje Dispose() na zegarze oraz polach GDI+</item>
  <item data-correct="2">Zdarzenie Timer.Tick aktualizuje pozycje obiektów oraz stan logiki gry</item>
  <item data-correct="3">Wywołanie Invalidate() oznacza obszar roboczy jako nieaktualny i kolejkuje odświeżenie okna</item>
</data-sortable-list>
</data-gate>

---

## ⌨️ Klawiatura w WinForms: fokus, KeyPreview i płynny ruch

Obsługa klawiatury w oknie z własnym płótnem kryje dwie pułapki, na które wpada niemal każdy autor pierwszej gry w WinForms.

### 🎯 Pułapka fokusu kontrolek i strzałek

Jeśli na oknie `Form` nie ma żadnych kontrolek, zdarzenie `KeyDown` działa bez zarzutu. Wystarczy jednak dodać jeden `Button` (na przykład „Restart”) albo `TextBox`, a kontrolka natychmiast przejmie **fokus** klawiatury. Od tego momentu naciśnięcie <kbd>W</kbd> nie dociera do okna, a strzałki <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>←</kbd>, <kbd>→</kbd> zamiast poruszać postacią przełączają podświetlenie między przyciskami.

Rozwiązanie zależy od rodzaju klawiszy:

- **`KeyPreview = true`** w konstruktorze okna sprawia, że formularz otrzymuje zdarzenia `KeyDown` dla zwykłych klawiszy (takich jak <kbd>W</kbd>, <kbd>A</kbd>, <kbd>S</kbd>, <kbd>D</kbd>, <kbd>Spacja</kbd>) przed aktywną kontrolką.
- **`ProcessCmdKey(ref Message msg, Keys keyData)`**: strzałki, <kbd>Tab</kbd> i <kbd>Enter</kbd> są traktowane przez WinForms jako klawisze nawigacji dialogowej jeszcze przed `KeyDown`. Nadpisanie `ProcessCmdKey` pozwala przechwycić strzałki nawet wtedy, gdy na formularzu istnieją przyciski.

### 🕹️ KeyDown kontra stan wciśniętych klawiszy

Jeśli przesuwasz obiekt bezpośrednio w zdarzeniu `KeyDown`, zauważysz irytujące szarpanie. Po wciśnięciu i przytrzymaniu <kbd>D</kbd> postać wykona jeden krok, zatrzyma się na około _**500 ms**_ (systemowe opóźnienie powtarzania klawiszy Windows), a potem ruszy z niską częstotliwością. Co więcej, zdarzenie `KeyDown` zgłasza po jednym klawiszu naraz, więc nie poruszysz się płynnie po skosie (<kbd>W</kbd> + <kbd>D</kbd>).

W grach wymagających płynnego sterowania rozdzielasz odczyt klawiatury od ruchu:

- w `KeyDown` dodajesz `e.KeyCode` do zbioru `HashSet<Keys>`,
- w `KeyUp` usuwasz `e.KeyCode` ze zbioru,
- w `Timer.Tick` (co _**16,67 ms**_) sprawdzasz, które klawisze są aktualnie wciśnięte, i zmieniasz pozycję.

Poniższy przykład łączy `ClientSize`, `DoubleBuffered`, `KeyPreview`, płynny ruch oparty na `HashSet<Keys>`, cache pędzli oraz poprawne `base.OnPaint(e)`:

```csharp
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

public class PlanszaDemo : Form
{
    private readonly Timer _zegar = new Timer();
    private readonly HashSet<Keys> _wcisniete = new HashSet<Keys>();
    private readonly SolidBrush _pedzelGracza = new SolidBrush(Color.FromArgb(56, 189, 248));
    private readonly Pen _pioroObrysu = new Pen(Color.White, 2);

    private int _pozX = 120;
    private int _pozY = 80;
    private const int Predkosc = 4;

    public PlanszaDemo()
    {
        ClientSize = new Size(400, 260);
        DoubleBuffered = true;
        KeyPreview = true;

        _zegar.Interval = 16; // około 60 klatek na sekundę
        _zegar.Tick += (s, e) =>
        {
            AktualizujRuch();
            Invalidate();
        };

        KeyDown += (s, e) => _wcisniete.Add(e.KeyCode);
        KeyUp += (s, e) => _wcisniete.Remove(e.KeyCode);
        Deactivate += (s, e) => _wcisniete.Clear();

        FormClosed += (s, e) =>
        {
            _zegar.Stop();
            _zegar.Dispose();
            _pedzelGracza.Dispose();
            _pioroObrysu.Dispose();
        };

        _zegar.Start();
    }

    private void AktualizujRuch()
    {
        if (ClientSize.Width <= 0 || ClientSize.Height <= 0) return;

        int dx = 0;
        int dy = 0;
        if (_wcisniete.Contains(Keys.A) || _wcisniete.Contains(Keys.Left)) dx -= Predkosc;
        if (_wcisniete.Contains(Keys.D) || _wcisniete.Contains(Keys.Right)) dx += Predkosc;
        if (_wcisniete.Contains(Keys.W) || _wcisniete.Contains(Keys.Up)) dy -= Predkosc;
        if (_wcisniete.Contains(Keys.S) || _wcisniete.Contains(Keys.Down)) dy += Predkosc;

        _pozX = (((_pozX + dx) % ClientSize.Width) + ClientSize.Width) % ClientSize.Width;
        _pozY = (((_pozY + dy) % ClientSize.Height) + ClientSize.Height) % ClientSize.Height;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);
        Graphics g = e.Graphics;
        g.Clear(Color.FromArgb(15, 23, 42));

        g.FillEllipse(_pedzelGracza, _pozX, _pozY, 24, 24);
        g.DrawEllipse(_pioroObrysu, _pozX, _pozY, 24, 24);
    }
}
```

> [!TIP]
> Zwróć uwagę na linijkę `Deactivate += (s, e) => _wcisniete.Clear();`. Jeśli gracz przytrzyma <kbd>D</kbd> i przełączy okno skrótem <kbd>Alt</kbd>+<kbd>Tab</kbd>, okno gry nigdy nie otrzyma zdarzenia `KeyUp`. Bez wyczyszczenia zbioru w `Deactivate` postać biegłaby w prawo w nieskończoność.

<data-gate>
<data-connection-matcher title="Dopasuj objaw błędu 2D w WinForms do jego przyczyny i naprawy">
    <item left="Obraz wyraźnie migocze podczas ruchu obiektów" right="Brak DoubleBuffered = true (rysowanie bezpośrednio do Front Buffer)"></item>
    <item left="Aplikacja wyrzuca ExternalException po około 55 sekundach" right="Wyciek uchwytów GDI+ (SolidBrush lub Pen bez using i Dispose)"></item>
    <item left="Narysowane kształty znikają po minimalizacji lub zasłonięciu okna" right="Rysowanie przez CreateGraphics() zamiast w metodzie OnPaint"></item>
    <item left="Strzałki i klawisze przestały sterować po dodaniu przycisku Button" right="Przejęcie fokusu przez kontrolkę (wymagane KeyPreview lub ProcessCmdKey)"></item>
</data-connection-matcher>
</data-gate>

---

## 📦 Detekcja kolizji AABB i prawa De Morgana

W większości gier 2D każdy obiekt otacza się prostokątem równoległym do osi układu współrzędnych: **AABB**. Taki prostokąt opisują cztery liczby: lewy górny róg (*x*, *y*) oraz dodatnie wymiary (*w*, *h*).

Prostokąt zajmuje piksele w przedziałach półotwartych `[x, x + w)` w poziomie oraz `[y, y + h)` w pionie. Zamiast zgadywać warunek nakładania się, znacznie łatwiej zapisać cztery sytuacje, w których dwa prostokąty **nie kolidują** (są rozdzielone):

- pierwszy kończy się na lewo od drugiego: `x1 + w1 <= x2`,
- pierwszy zaczyna się na prawo od drugiego: `x1 >= x2 + w2`,
- pierwszy kończy się nad drugim: `y1 + h1 <= y2`,
- pierwszy zaczyna się pod drugim: `y1 >= y2 + h2`.

Prostokąty są rozdzielone, gdy zachodzi **choć jeden** z tych warunków (`A || B || C || D`). Kolizja jest dokładnym zaprzeczeniem rozdzielenia: `!(A || B || C || D)`. Stosując **prawo De Morgana** (`!(A || B) == !A && !B`), negujemy każdą nierówność i zamieniamy sumę logiczną `||` na iloczyn `&&`:

- zaprzeczeniem `x1 + w1 <= x2` jest `x1 + w1 > x2`,
- zaprzeczeniem `x1 >= x2 + w2` jest `x1 < x2 + w2`,
- zaprzeczeniem `y1 + h1 <= y2` jest `y1 + h1 > y2`,
- zaprzeczeniem `y1 >= y2 + h2` jest `y1 < y2 + h2`.

Wszystkie cztery ostre nierówności muszą zachodzić jednocześnie. Zwróć uwagę na przypadek styku krawędzi: kafelek na pozycji `x = 0` o szerokości `10` zajmuje piksele `0..9`, a sąsiedni kafelek na pozycji `x = 10` zajmuje piksele `10..19`. Nie mają żadnego wspólnego piksela, więc nie kolidują.

| Przypadek geometryczny | Prostokąt A | Prostokąt B | Wynik kolizji AABB |
| :--- | :--- | :--- | :---: |
| Brak styku (rozdzielone) | `(0, 0, 10, 10)` | `(20, 0, 10, 10)` | `false` |
| Styk samych krawędzi | `(0, 0, 10, 10)` | `(10, 0, 10, 10)` | `false` |
| Częściowe nachodzenie | `(0, 0, 10, 10)` | `(8, 6, 10, 10)` | `true` |
| Pełne zawarcie (B w A) | `(0, 0, 50, 50)` | `(10, 10, 5, 5)` | `true` |
| Zdegenerowany wymiar (`w <= 0` lub `h <= 0`) | `(0, 0, 0, 10)` | `(0, 0, 10, 10)` | `false` |

> [!IMPORTANT]
> Przed sprawdzeniem czterech nierówności AABB zawsze odrzuć prostokąty o zerowej lub ujemnej szerokości albo wysokości (`w1 <= 0 || h1 <= 0 || w2 <= 0 || h2 <= 0`). Bez tego strażnika prostokąt o wymiarach `0 x 10` umieszczony w środku dużego prostokąta spełniłby wszystkie cztery nierówności i zwrócił fałszywą kolizję.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Front Buffer, Back Buffer, Screen Tearing, VSync, GDI+ (CPU) kontra GPU i limit 10 000 uchwytów GDI</span>
<span class="deep-dive-badge">GRAFIKA 2D · VSYNC · ARCHITEKTURA WINDOWS</span>
</summary>
<div class="deep-dive-content">

<h4>1. Front Buffer, Back Buffer i Screen Tearing</h4>

Karta graficzna nie wyświetla całej klatki w jednej mikrosekundzie. Wysyła obraz do monitora wiersz po wierszu, od góry do dołu. Monitor 60 Hz odświeża pełny ekran co _**16,67 ms**_ (`1000 / 60`), a monitor 144 Hz co _**6,94 ms**_ (`1000 / 144`).

Jeśli program rysuje bezpośrednio do bufora wyświetlanego (**Front Buffer**), monitor potrafi odczytać stan w połowie rysowania. Zobaczysz puste tło, zanim pojawi się obiekt, co ludzkie oko odbiera jako migotanie. Rozwiązaniem jest **Double Buffering**: CPU lub GPU przygotowuje całą nową klatkę w buforze zapasowym (**Back Buffer**), a po jej ukończeniu podmienia bufory jednym skokiem.

Mimo podwójnego buforowania może wystąpić **_Screen Tearing_** (rozrywanie obrazu). Dzieje się tak, gdy podmiana buforów nastąpi w połowie skanowania monitora: górna część ekranu wyświetla jeszcze piksele ze starej klatki, a dolna już z nowej, tworząc wyraźną poziomą linię przesunięcia.

<h4>2. VSync (Vertical Blank) i budżet czasowy klatki</h4>

Po wysłaniu ostatniego dolnego wiersza monitor potrzebuje krótkiej przerwy przed powrotem na górę ekranu. Ten odstęp to **Vertical Blank** (**VBlank**). Synchronizacja pionowa (**VSync**) wymusza, aby podmiana buforów następowała wyłącznie w oknie VBlank:

- Przy _**60 Hz**_ masz dokładnie _**16,67 ms**_ na policzenie fizyki i wyrenderowanie klatki. Jeśli klatka zajmie 18 ms, przegapisz okno VBlank i ta sama klatka zostanie wyświetlona dwa razy (spadek płynności do 30 FPS).
- Przy _**144 Hz**_ budżet skraca się do _**6,94 ms**_ na klatkę.
- W Windows 11 menedżer okien _**DWM**_ (Desktop Window Manager) sam utrzymuje kompozycję z włączonym VSync dla aplikacji okienkowych, więc okno WinForms z `DoubleBuffered = true` jest naturalnie chronione przed rozrywaniem obrazu.

<h4>3. Windows GDI+ (System.Drawing na CPU) kontra potok GPU</h4>

`System.Drawing.Graphics` wywołuje natywną bibliotekę `gdiplus.dll`, która wykonuje rasteryzację (zamianę prostokątów, elips i glifów czcionek na tablicę pikseli ARGB) na procesorze **CPU**. Pojedyncza klatka 1920x1080 w 32-bitowym kolorze zajmuje `1920 * 1080 * 4 = 8 294 400` bajtów (_**8,29 MB**_). Przy 60 Hz daje to niemal _**500 MB/s**_ samego przesyłu pikseli, a przy 144 Hz prawie _**1,2 GB/s**_.

| Cecha | Windows GDI+ (`System.Drawing`) | Potok GPU (DirectX 11/12, Vulkan, OpenGL) |
| :--- | :--- | :--- |
| Główne obliczenia | Rdzenie CPU (rasteryzacja programowa) | Tysiące rdzeni GPU równolegle w pamięci VRAM |
| Zależności | Wbudowane w Windows (0 zewnętrznych DLL) | Sterownik GPU oraz SDK lub silnik (np. MonoGame, Unity) |
| Rozmiar `.exe` | 10 do 25 KB w czystym C# | Od kilku MB do setek MB |
| Zastosowanie | Narzędzia, wykresy na żywo, gry 2D (Snake, Tetris) | Gry 3D, tysiące sprite'ów, shadery, fizyka cząsteczek |

<h4>4. Dlaczego Windows nakłada sztywny limit 10 000 uchwytów GDI na proces</h4>

Każdy obiekt `Pen`, `SolidBrush`, `Font`, `Bitmap` czy `Graphics` w WinForms opakowuje natywny uchwyt jądra (`HPEN`, `HBRUSH`, `HFONT`, `HBITMAP`, `HDC`) wpisany do tabeli sesji Windows. Cała sesja użytkownika ma twardy limit _**65 536 uchwytów**_ GDI współdzielonych między Eksplorator, przeglądarkę, edytor kodu i wszystkie pozostałe okna.

Aby pojedynczy program z wyciekiem nie sparaliżował rysowania całego pulpitu Windows, system narzuca limit _**10 000 uchwytów**_ na proces (klucz rejestru `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows\GDIProcessHandleQuota`).

```csharp
// Przy 60 FPS i 3 wyciekach na klatkę (Brush + Pen + Font):
// 60 * 3 = 180 uchwytów/s -> po 55 sekundach proces przekracza 10 000 uchwytów i ginie!
```

Garbage Collector w .NET uruchamia się pod presją pamięci zarządzanej RAM, a sam obiekt `SolidBrush` w C# zajmuje tylko kilkadziesiąt bajtów na stercie. Bez jawnego `using` lub `Dispose()` limit _**10 000 uchwytów**_ GDI zostanie wyczerpany na długo przed uruchomieniem GC.

</div>
</details>

---

## 💻 Zadanie praktyczne: Fizyka 2D, mapowanie siatki i zawijanie krawędzi

W klasie `Fizyka2D` zaimplementuj pięć metod używanych w silnikach gier 2D:

1. **`CzyPrzeciwnyKierunek(int dx1, int dy1, int dx2, int dy2)`**:
   - zwraca `true` wyłącznie wtedy, gdy oba wektory są dokładnie przeciwne i nie są wektorami zerowymi,
   - dla `(0, 0)` oraz `(0, 0)` zwraca `false` (brak ruchu nie oznacza zawrócenia o 180 stopni).
2. **`CzyPozaPlansza(int x, int y, int szer, int wys)`**:
   - zwraca `true`, jeśli plansza ma niepoprawny wymiar (`szer <= 0` lub `wys <= 0`) albo punkt `(x, y)` leży poza zakresem `[0..szer-1]` w poziomie lub `[0..wys-1]` w pionie.
3. **`CzyKolidujaProstokaty(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2)`**:
   - realizuje detekcję kolizji **AABB** dla dwóch prostokątów równoległych do osi,
   - dla dowolnego wymiaru `<= 0` zwraca `false`,
   - styk samych krawędzi bez wspólnego pola powierzchni zwraca `false`.
4. **`PrzeliczKafelekNaProstokatEkranu(int kolumna, int wiersz, int rozmiarKratki, int wysokoscHud, int margines)`**:
   - zwraca strukturę `Rectangle` opisującą pozycję i wymiary kafelka na ekranie z uwzględnieniem paska HUD na górze oraz marginesu z lewej i od góry (pod HUD),
   - jeśli `rozmiarKratki <= 0`, zwraca `Rectangle.Empty`.
5. **`PrzesunZZawijaniem(int pozycja, int delta, int rozmiarPlanszy)`**:
   - zwraca nową współrzędną w zakresie `[0..rozmiarPlanszy - 1]` po dodaniu przesunięcia *delta* z poprawnym zawijaniem także dla liczb ujemnych i przesunięć większych niż *rozmiarPlanszy*,
   - jeśli `rozmiarPlanszy <= 0`, zwraca `0`.

<data-gate>
<data-csharp-lab title="Zadanie: Fizyka 2D - kierunki, AABB, mapowanie siatki i zawijanie krawędzi" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Drawing;

public static class Fizyka2D
{
    public static bool CzyPrzeciwnyKierunek(int dx1, int dy1, int dx2, int dy2)
    {
        return false;
    }

    public static bool CzyPozaPlansza(int x, int y, int szer, int wys)
    {
        return false;
    }

    public static bool CzyKolidujaProstokaty(int x1, int y1, int w1, int h1, int x2, int y2, int w2, int h2)
    {
        return false;
    }

    public static Rectangle PrzeliczKafelekNaProstokatEkranu(
        int kolumna, int wiersz, int rozmiarKratki, int wysokoscHud, int margines)
    {
        return Rectangle.Empty;
    }

    public static int PrzesunZZawijaniem(int pozycja, int delta, int rozmiarPlanszy)
    {
        return 0;
    }

    static void Main()
    {
        Console.WriteLine("Prawo vs Lewo: " + CzyPrzeciwnyKierunek(1, 0, -1, 0));
        Console.WriteLine("Punkt (20, 5) poza 20x20: " + CzyPozaPlansza(20, 5, 20, 20));
        Console.WriteLine("Kolizja AABB: " + CzyKolidujaProstokaty(0, 0, 10, 10, 5, 5, 10, 10));
        Console.WriteLine("Kafelek (2, 1): " + PrzeliczKafelekNaProstokatEkranu(2, 1, 20, 36, 4));
        Console.WriteLine("Zawijanie 0 + (-1) mod 20: " + PrzesunZZawijaniem(0, -1, 20));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("CzyPrzeciwnyKierunek wykrywa zawracanie 180 stopni i odrzuca wektor zerowy (0, 0)", () => {
    LabAssert.True(Fizyka2D.CzyPrzeciwnyKierunek(1, 0, -1, 0));
    LabAssert.True(Fizyka2D.CzyPrzeciwnyKierunek(-1, 0, 1, 0));
    LabAssert.True(Fizyka2D.CzyPrzeciwnyKierunek(0, -1, 0, 1));
    LabAssert.True(Fizyka2D.CzyPrzeciwnyKierunek(0, 1, 0, -1));
    LabAssert.False(Fizyka2D.CzyPrzeciwnyKierunek(1, 0, 0, 1));
    LabAssert.False(Fizyka2D.CzyPrzeciwnyKierunek(0, -1, 1, 0));
    LabAssert.False(Fizyka2D.CzyPrzeciwnyKierunek(1, 0, 1, 0));
    LabAssert.False(Fizyka2D.CzyPrzeciwnyKierunek(0, 0, 0, 0));
    LabAssert.False(Fizyka2D.CzyPrzeciwnyKierunek(0, 0, 1, 0));
});

LabAssert.Test("CzyPozaPlansza sprawdza wszystkie 4 granice oraz niepoprawne wymiary planszy", () => {
    LabAssert.False(Fizyka2D.CzyPozaPlansza(0, 0, 20, 15));
    LabAssert.False(Fizyka2D.CzyPozaPlansza(19, 14, 20, 15));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(-1, 5, 20, 15));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(5, -1, 20, 15));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(20, 5, 20, 15));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(5, 15, 20, 15));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(0, 0, 0, 10));
    LabAssert.True(Fizyka2D.CzyPozaPlansza(0, 0, 10, -5));
});

LabAssert.Test("CzyKolidujaProstokaty (AABB) rozróżnia rozdzielenie, styk krawędzi, nachodzenie i pełne zawarcie", () => {
    // Brak kolizji: rozdzielone w poziomie i pionie
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 20, 0, 10, 10));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 0, 25, 10, 10));

    // Styk samych krawędzi (prawa, lewa, dolna, górna): brak kolizji
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 10, 0, 10, 10));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(10, 0, 10, 10, 0, 0, 10, 10));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 0, 10, 10, 10));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 10, 10, 10, 0, 0, 10, 10));

    // Częściowe nachodzenie (różne narożniki)
    LabAssert.True(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 9, 9, 10, 10));
    LabAssert.True(Fizyka2D.CzyKolidujaProstokaty(5, 5, 10, 10, 0, 0, 6, 6));

    // Pełne zawarcie oraz identyczne prostokąty
    LabAssert.True(Fizyka2D.CzyKolidujaProstokaty(0, 0, 100, 100, 20, 20, 10, 10));
    LabAssert.True(Fizyka2D.CzyKolidujaProstokaty(20, 20, 10, 10, 0, 0, 100, 100));
    LabAssert.True(Fizyka2D.CzyKolidujaProstokaty(5, 5, 12, 8, 5, 5, 12, 8));

    // Zdegenerowane wymiary (szerokość lub wysokość <= 0)
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 0, 10, 0, 0, 10, 10));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(0, 0, 10, 10, 2, 2, 5, -3));
    LabAssert.False(Fizyka2D.CzyKolidujaProstokaty(5, 5, 0, 0, 0, 0, 20, 20));
});

LabAssert.Test("PrzeliczKafelekNaProstokatEkranu uwzględnia rozmiar kratki, wysokość HUD i margines", () => {
    Rectangle r0 = Fizyka2D.PrzeliczKafelekNaProstokatEkranu(0, 0, 20, 36, 4);
    LabAssert.Equal(4, r0.X);
    LabAssert.Equal(40, r0.Y);
    LabAssert.Equal(20, r0.Width);
    LabAssert.Equal(20, r0.Height);

    Rectangle r1 = Fizyka2D.PrzeliczKafelekNaProstokatEkranu(2, 1, 20, 36, 4);
    LabAssert.Equal(44, r1.X);
    LabAssert.Equal(60, r1.Y);
    LabAssert.Equal(20, r1.Width);
    LabAssert.Equal(20, r1.Height);

    Rectangle r2 = Fizyka2D.PrzeliczKafelekNaProstokatEkranu(5, 3, 24, 0, 0);
    LabAssert.Equal(120, r2.X);
    LabAssert.Equal(72, r2.Y);
    LabAssert.Equal(24, r2.Width);
    LabAssert.Equal(24, r2.Height);

    // Niepoprawny rozmiar kratki
    LabAssert.Equal(Rectangle.Empty, Fizyka2D.PrzeliczKafelekNaProstokatEkranu(1, 1, 0, 36, 4));
    LabAssert.Equal(Rectangle.Empty, Fizyka2D.PrzeliczKafelekNaProstokatEkranu(1, 1, -10, 36, 4));
});

LabAssert.Test("PrzesunZZawijaniem obsługuje ujemne modulo, wielokrotności rozmiaru i niepoprawny rozmiar", () => {
    LabAssert.Equal(6, Fizyka2D.PrzesunZZawijaniem(5, 1, 20));
    LabAssert.Equal(0, Fizyka2D.PrzesunZZawijaniem(19, 1, 20));
    LabAssert.Equal(19, Fizyka2D.PrzesunZZawijaniem(0, -1, 20));
    LabAssert.Equal(17, Fizyka2D.PrzesunZZawijaniem(2, -45, 20));
    LabAssert.Equal(3, Fizyka2D.PrzesunZZawijaniem(3, 40, 20));
    LabAssert.Equal(3, Fizyka2D.PrzesunZZawijaniem(3, -40, 20));
    LabAssert.Equal(0, Fizyka2D.PrzesunZZawijaniem(0, -1, 1));
    LabAssert.Equal(0, Fizyka2D.PrzesunZZawijaniem(5, 2, 0));
    LabAssert.Equal(0, Fizyka2D.PrzesunZZawijaniem(5, 2, -10));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy używać <code>ClientSize</code>, a kiedy <code>Size</code>?</strong> W grach 2D zawsze ustawiaj `ClientSize`, ponieważ `Size` wlicza belkę tytułu i ramki okna Windows, które skracają pole gry.
- <strong>Gdzie wolno rysować na oknie WinForms?</strong> Wyłącznie w `OnPaint(PaintEventArgs e)` (po wywołaniu `base.OnPaint(e)`), uruchamianym przez `Invalidate()` z włączonym `DoubleBuffered = true`. Unikaj `CreateGraphics()`, bo taki rysunek znika po zasłonięciu okna.
- <strong>Jak uniknąć awarii GDI+ po minucie gry?</strong> Zawsze zwalniaj `SolidBrush`, `Pen` i `Font` przez `using` w `OnPaint` albo cacheuj je jako pola klasy i wywołuj `Dispose()` w `FormClosed`, aby nie przekroczyć limitu _**10 000 uchwytów**_.
- <strong>Jak naprawić martwe strzałki i szarpany ruch klawiatury?</strong> Gdy na formularzu są kontrolki, włącz `KeyPreview = true` lub nadpisz `ProcessCmdKey`. Dla płynnego ruchu zapisuj stan klawiszy w `HashSet<Keys>` (z czyszczeniem w `Deactivate`) i przesuwaj obiekt w `Timer.Tick`.
- <strong>Jak bezpiecznie zawijać współrzędne i liczyć kolizje AABB?</strong> Używaj podwójnego modulo `(((poz + delta) % limit) + limit) % limit` na ujemne przesunięcia, a w AABB odrzucaj wymiary `<= 0` i traktuj styk krawędzi jako brak kolizji.
