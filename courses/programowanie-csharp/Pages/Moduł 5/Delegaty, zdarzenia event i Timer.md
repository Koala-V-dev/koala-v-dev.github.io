# Delegaty, zdarzenia event i Timer

W poprzedniej lekcji podpiąłeś reakcję na kliknięcie przycisku zapisem `przycisk.Click += ObsluzKlikniecie;`. Ten sam problem pojawia się, gdy budujesz własną klasę logiki, na przykład monitor zużycia pamięci RAM albo czujnik temperatury procesora.

Jeśli klasa monitora odwołuje się wprost do kontrolki `Label` lub okna `Form`, traci niezależność. Nie przetestujesz jej w testach jednostkowych ani nie uruchomisz jej w narzędziu konsolowym bez otwierania całego interfejsu graficznego.

Rozwiązaniem jest _**wzorzec obserwatora**_ wbudowany w język C#. Klasa nadawcy publikuje sam fakt za pomocą **delegatów** oraz modyfikatora **`event`**, a okno lub konsola jedynie dopisuje swoją reakcję. Do cyklicznego odświeżania danych bez zamrażania okna służy komponent **`System.Windows.Forms.Timer`**.

---

## 📡 Od metody nazwanej do Action, Func i EventHandler

**Delegat** to bezpieczny typowo obiekt przechowujący referencję do metody. Pozwala zapisać funkcję w zmiennej, przekazać ją jako argument do innej metody i wywołać w późniejszym momencie.

Zacznijmy od dwóch zwykłych metod nazwanych: pierwsza tylko wypisuje komunikat (`void`), a druga ocenia pomiar i zwraca `bool`.

```csharp
static void WypiszAlarm(int procent)
{
    Console.WriteLine("Alarm obciazenia: " + procent + "%");
}

static bool CzyKrytyczny(int procent)
{
    return procent >= 80;
}
```

Zamiast definiować własne typy delegatów, w .NET korzystamy z gotowych delegatów generycznych **`Action`** (dla metod `void`) oraz **`Func`** (dla metod zwracających wynik, gdzie ostatni parametr typu to typ zwracany):

```csharp
// 1. Przypisanie metod nazwanych do delegatow
Action<int> powiadom = WypiszAlarm;
Func<int, bool> filtr = CzyKrytyczny;

powiadom(85);                 // Wypisze: Alarm obciazenia: 85%
bool wysoki = filtr(85);      // Zwroci: true

// 2. Ten sam zapis skrocony za pomoca wyrazenia lambda
Action<int> powiadomLambda = (v) => Console.WriteLine("Alarm: " + v);
Func<int, bool> filtrLambda = (v) => v >= 80;
```

W bibliotece Windows Forms niemal wszystkie wbudowane zdarzenia kontrolek (`Button.Click`, `Timer.Tick`, `CheckBox.CheckedChanged`) korzystają ze standardowego delegata **`EventHandler`**. Ma on zawsze stałą sygnaturę: `void NazwaMetody(object sender, EventArgs e)`.

- Parametr *sender* wskazuje konkretny obiekt, który wywołał zdarzenie (na przykład kliknięty przycisk lub tykający zegar).
- Parametr *e* przekazuje dodatkowe dane zdarzenia (lub pusty `EventArgs.Empty`, jeśli danych nie ma). Dla zamykania okna WinForms używa pokrewnego `FormClosingEventArgs`, w którym możesz ustawić `e.Cancel = true` i zatrzymać zamknięcie.

| Typ delegata | Typ zwracany | Zastosowanie i przykład |
| :--- | :--- | :--- |
| `Action` | `void` | Akcja bez parametrów: `Action start = () => Uruchom();` |
| `Action<int>` | `void` | Powiadomienie z danymi: `Action<int> alarm = (v) => Log(v);` |
| `Func<int, bool>` | `bool` (ostatni typ) | Predykat lub filtr: `Func<int, bool> test = (v) => v >= 80;` |
| `EventHandler` | `void` | Standard WinForms: `(object sender, EventArgs e)` w `Click` i `Tick` |

---

## 🛡️ Zdarzenie event i bezpieczne wywołanie w C# 5.0

Zwykłe publiczne pole typu `Action<int>` łamie hermetyzację: każdy fragment programu mógłby wywołać cudzy alarm albo nadpisać całą listę odbiorców operatorem `=`. Słowo kluczowe **`event`** nakłada na delegat twardą blokadę dostępu.

Zewnętrzny kod może wyłącznie:
- dopisać nowego subskrybenta operatorem **`+=`**,
- wypisać istniejącego subskrybenta operatorem **`-=`**.

Zewnętrzny kod **_nie może_** wywołać zdarzenia z zewnątrz ani wykasować cudzych subskrybentów przez `=`. Prawo wywołania ma wyłącznie klasa, która zadeklarowała dane zdarzenie.

```csharp
public class MonitorZdarzen
{
    public event Action<int> PrzekroczonoProg;
    private readonly int _prog;

    public MonitorZdarzen(int prog)
    {
        _prog = prog;
    }

    public void ZglosPomiar(int wartosc)
    {
        if (wartosc >= _prog)
        {
            Action<int> handler = PrzekroczonoProg;
            if (handler != null)
            {
                handler(wartosc);
            }
        }
    }
}
```

> [!IMPORTANT]
> W C# 5.0 przed wywołaniem zdarzenia zawsze skopiuj jego referencję do zmiennej lokalnej (*handler*), a dopiero potem sprawdź `if (handler != null)`. Jeśli nikt nie subskrybuje zdarzenia, pole ma wartość `null` i bezpośrednie wywołanie rzuci **_NullReferenceException_**. Kopia lokalna chroni także przed sytuacją, w której inny wątek wypisze ostatniego subskrybenta dokładnie między sprawdzeniem `!= null` a wywołaniem. W nowszych wersjach C# (od C# 6.0) kompilator generuje dokładnie ten sam kod ze skrótu `PrzekroczonoProg?.Invoke(wartosc)`.

Dzięki temu podziałowi klasa `MonitorZdarzen` nic nie wie o interfejsie użytkownika. Ten sam obiekt obsłuży konsolę (`Console.WriteLine`), okno WinForms (`Label`) oraz automatyczny test jednostkowy.

---

## 🚨 Pułapka operatora -= z anonimową lambdą

Gdy okno subskrybuje zdarzenie długo żyjącego obiektu (na przykład globalnego monitora lub zegara), obiekt nadawcy zapisuje w swojej liście silną referencję do subskrybenta. Jeśli okno zostanie zamknięte bez odpięcia subskrypcji, obiekt okna pozostanie **_nadal osiągalne_** dla Garbage Collectora i utworzy **wyciek pamięci**.

Bardzo częstym błędem jest próba odpięcia anonimowego wyrażenia lambda w ten sposób:

```csharp
// Podpiecie anonimowej lambdy (obiekt delegata nr 1)
monitor.PrzekroczonoProg += (v) => AktualizujEtykiete(v);

// Proba odpiecia przy zamykaniu okna (nowy obiekt delegata nr 2!)
monitor.PrzekroczonoProg -= (v) => AktualizujEtykiete(v); // NIE ZADZIALA!
```

Kompilator tworzy dla każdej z tych dwóch linii **dwa osobne obiekty delegatów** pod różnymi adresami w pamięci. Operator `-=` szuka na liście dokładnie tej samej instancji, nie znajduje jej i kończy działanie bez żadnego błędu, a stara subskrypcja zostaje w pamięci na zawsze.

> [!WARNING]
> Nigdy nie używaj anonimowej lambdy przy zdarzeniu, z którego zamierzasz się później wypisać przez `-=`. Podepnij metodę nazwaną (`monitor.PrzekroczonoProg += ObsluzAlarm;` oraz `-= ObsluzAlarm;`) albo zapisz lambdę w polu klasy typu `Action<int>` i użyj tego samego pola przy obu operatorach.

<data-gate>
<data-connection-matcher title="Dopasuj konstrukcję delegatów i zdarzeń do jej roli lub błędu">
  <item left="Action&lt;int&gt;" right="Delegat przyjmujący liczbę całkowitą i niezwracający żadnej wartości (void)"></item>
  <item left="Func&lt;int, bool&gt;" right="Delegat przyjmujący liczbę całkowitą i zwracający wartość logiczną bool"></item>
  <item left="EventHandler" right="Standardowy delegat WinForms o sygnaturze (object sender, EventArgs e)"></item>
  <item left="public event Action&lt;int&gt; Alarm;" right="Zewnętrzny kod może używać tylko += i -=, bez wywoływania oraz bez operatora ="></item>
  <item left="m.Alarm -= (v) =&gt; Log(v);" right="Tworzy drugi, odrębny delegat: nie odpina pierwszej lambdy i powoduje wyciek pamięci"></item>
</data-connection-matcher>
</data-gate>

---

## ⏱️ Timer w WinForms kontra Thread.Sleep i System.Threading.Timer

Cykliczne odświeżanie danych w oknie (na przykład pomiar RAM co sekundę albo ruch piłki w grze) wymaga współpracy z pętlą komunikatów Windows. Wybór złego mechanizmu kończy się zamrożeniem aplikacji albo natychmiastowym wyjątkiem.

> [!WARNING]
> Nigdy nie pisz w aplikacji okienkowej pętli `while (true)` z wywołaniem `Thread.Sleep(1000)`. Usypiasz w ten sposób jedyny wątek UI: kolejka przestaje obsługiwać kliknięcia oraz odrysowanie `WM_PAINT`, a okno zawiesza się ze statusem **_„Brak odpowiedzi”_**.

W bibliotece .NET istnieją dwie klasy o tej samej nazwie `Timer`, ale o zupełnie innym modelu wątkowym:
- **`System.Windows.Forms.Timer`**: działa na bazie komunikatu systemowego `WM_TIMER`. Zdarzenie `Tick` wykonuje się zawsze w **wątku UI**, więc możesz w nim bezpiecznie zmieniać `Label.Text` czy `ProgressBar.Value`.
- **`System.Threading.Timer`**: uruchamia funkcję zwrotną w **wątku z puli wątków** w tle. Próba bezpośredniej modyfikacji dowolnej kontrolki WinForms z tego wątku kończy się wyjątkiem **_InvalidOperationException_** (niedozwolona operacja międzywątkowa na kontrolce).

| Kryterium | `Thread.Sleep` w wątku UI | `System.Windows.Forms.Timer` | `System.Threading.Timer` |
| :--- | :--- | :--- | :--- |
| Wątek wykonania | Blokuje jedyny wątek UI | Bezpieczny wątek UI (`WM_TIMER`) | Wątek w tle z puli wątków |
| Reakcja okna na kliknięcia | Brak: okno zamrożone | Pełna responsywność okna | Pełna responsywność okna |
| Zmiana `Label.Text` wprost | Blokuje odrysowanie `WM_PAINT` | W pełni bezpieczna | Rzuca `InvalidOperationException` |
| Zatrzymanie i sprzątanie | Wymaga flagi przerwania pętli | `Stop()`, `-=` oraz `Dispose()` | `Dispose()` |

Poprawny cykl życia zegara w klasie `Form` przechowuje referencję w polu prywatnym i sprząta zasoby przy zamykaniu okna (`FormClosing`):

```csharp
private readonly System.Windows.Forms.Timer _zegar;

public OknoMonitora()
{
    _zegar = new System.Windows.Forms.Timer();
    _zegar.Interval = 1000; // 1000 ms = 1 sekunda
    _zegar.Tick += OdswiezDaneRam;
    _zegar.Start();

    FormClosing += PrzyZamykaniuOkna;
}

private void OdswiezDaneRam(object sender, EventArgs e)
{
    // Bezpieczna aktualizacja kontrolek w watku UI
}

private void PrzyZamykaniuOkna(object sender, FormClosingEventArgs e)
{
    _zegar.Stop();
    _zegar.Tick -= OdswiezDaneRam;
    _zegar.Dispose();
}
```

<data-gate>
<data-sortable-list title="Ułóż bezpieczny cykl życia obiektu System.Windows.Forms.Timer w oknie WinForms">
  <item data-correct="3">Podpięcie nazwanej metody obsługi zdarzenia: _zegar.Tick += OdswiezDaneRam;</item>
  <item data-correct="1">Utworzenie instancji zegara w polu klasy: _zegar = new System.Windows.Forms.Timer();</item>
  <item data-correct="5">Zatrzymanie, odpięcie metody i zwolnienie zasobów w FormClosing: Stop(), -= oraz Dispose()</item>
  <item data-correct="2">Ustawienie odstępu między tyknięciami: _zegar.Interval = 1000;</item>
  <item data-correct="4">Uruchomienie cyklicznego wysyłania WM_TIMER: _zegar.Start();</item>
</data-sortable-list>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Budowa MulticastDelegate w CLR, niemutowalność += i graf GC Roots</span>
<span class="deep-dive-badge">MULTICASTDELEGATE · CLR · MEMORY LEAK</span>
</summary>
<div class="deep-dive-content">

<h4>1. Co naprawdę siedzi w obiekcie MulticastDelegate wewnątrz CLR</h4>
W języku C lub C++ zwykły wskaźnik na funkcję (`void (*cb)(int)`) zajmuje 8 bajtów na architekturze x86-64 i wskazuje wyłącznie adres kodu maszynowego. W C# każdy typ delegata dziedziczy po klasie `System.MulticastDelegate` i zawiera na stercie trzy kluczowe pola:
- `_target` (`object`): referencja do instancji obiektu, na którym ma zostać wywołana metoda (dla metod `static` ma wartość `null`).
- `_methodPtr` (`IntPtr`): adres natywnego kodu JIT (lub stuba wywołania) docelowej metody.
- `_invocationList` (`object`): dla pojedynczego subskrybenta `null`; gdy podepniesz dwie lub więcej metod przez `+=`, CLR alokuje tu tablicę `object[]` przechowującą kolejne pojedyncze delegaty.

Gdy wywołujesz `handler(procent)`, CLR przechodzi kolejno po wszystkich wpisach w `_invocationList` i dla każdego wywołuje kod spod `_methodPtr`, przekazując `_target` jako ukryty parametr `this` w rejestrze `RCX` (konwencja wywołań x64 Windows).

<h4>2. Dlaczego += alokuje nowy obiekt i po co lokalna kopia delegata</h4>
Delegaty w .NET są **niemutowalne** (podobnie jak `string`). Kompilator obniża zapis `m.AlarmWyzwalany += f;` do wywołania `Delegate.Combine(m.AlarmWyzwalany, f)`, które **alokuje nową instancję `MulticastDelegate`** z nową tablicą `_invocationList` i przypisuje jej referencję z powrotem do pola zdarzenia. Analogicznie `-=` wywołuje `Delegate.Remove(...)`.

W kodzie wielowątkowym naiwny zapis:

```csharp
if (AlarmWyzwalany != null)
{
    AlarmWyzwalany(procent); // Ryzyko NullReferenceException!
}
```

może zawieść: między sprawdzeniem `!= null` a wywołaniem inny wątek może wypisać ostatniego subskrybenta przez `-=`, ustawiając pole `AlarmWyzwalany` na `null` i wywołując **_NullReferenceException_**. Dlatego kopiujemy referencję do zmiennej lokalnej na stosie:

```csharp
Action<int> handler = AlarmWyzwalany; // Kopia referencji na stosie watku
if (handler != null)
{
    handler(procent); // Wywolanie na niemutowalnej migawce listy subskrybentow
}
```

Ponieważ `MulticastDelegate` jest niemutowalny, nawet jeśli inny wątek w tej samej mikrosekundzie wywoła `-=`, nasza lokalna zmienna *handler* nadal wskazuje na kompletną, bezpieczną tablicę delegatów.

<h4>3. Jak Garbage Collector widzi nieodpięte zdarzenie (GC Roots)</h4>
Wyobraź sobie długo żyjący obiekt nadawcy (na przykład globalny `MonitorRam`), który żyje przez cały czas działania programu. Użytkownik otwiera okno diagnostyczne `OknoWykresu` i w jego konstruktorze podpina `monitor.ZmianaRam += this.AktualizujWykres;`.

Wewnątrz `monitor` pole `ZmianaRam` trzyma w tablicy `_invocationList` delegat, którego pole `_target` wskazuje **silną referencją** na obiekt `OknoWykresu`. Gdy użytkownik zamknie okno bez odpięcia subskrypcji:
- Garbage Collector przechodzi graf korzeni (`GC Roots`).
- Znajduje żywy obiekt `monitor` -> `ZmianaRam` -> `_target` -> zamknięte `OknoWykresu`.
- Uznaje zamknięte okno (wraz ze wszystkimi jego kontrolkami, czcionkami i bitmapami) za **_nadal osiągalne_** i nigdy nie zwalnia jego pamięci.

Każde kolejne otwarcie i zamknięcie okna dokłada w pamięci RAM następny obiekt-duch. Dopiero wywołanie `monitor.ZmianaRam -= this.AktualizujWykres;` w `FormClosed` lub `Dispose()` przecina tę krawędź w grafie i pozwala Garbage Collectorowi odzyskać pamięć.

</div>
</details>

---

## 💻 Zadanie praktyczne: LicznikAlarmow z histerezą i filtrem Func

W prawdziwym monitoringu temperatury CPU lub obciążenia RAM wartości często oscylują wokół progu: `79% -> 80% -> 79% -> 81% -> 80%`. Bez mechanizmu **histerezy** system wysyłałby alarm przy każdym kolejnym pomiarze.

Histereza wprowadza dwa progi:
- **`ProgAlarmu`** (na przykład `80`): osiągnięcie lub przekroczenie tej wartości uruchamia alarm i ustawia `CzyAlarmAktywny = true`.
- **`ProgResetu`** (na przykład `65`): dopóki obciążenie nie spadnie do wartości `<= ProgResetu`, kolejne wysokie pomiary nie wyzwalają duplikatu alarmu. Dopiero spadek `<= ProgResetu` ustawia `CzyAlarmAktywny = false` i ponownie uzbraja czujnik.

W klasie **`LicznikAlarmow`** zaimplementuj cztery elementy:
1. Publiczne zdarzenie **`AlarmWyzwalany`** typu `Action<int>` (zadeklarowane ze słowem kluczowym `event`).
2. Konstruktor `LicznikAlarmow(int progAlarmu, int progResetu)`:
   - odrzuca błędną konfigurację, w której *progResetu* jest większy lub równy *progAlarmu* (rzuca `ArgumentException`),
   - zapisuje oba progi we właściwościach `ProgAlarmu` oraz `ProgResetu`, ustawia początkowy `OstatniAlarm` na `-1`, a stan alarmu `CzyAlarmAktywny` na `false`.
3. Metodę `SprawdzPoziom(int procent)` realizującą dwustanową maszynę z histerezą:
   - przy każdym wywołaniu zwiększa licznik wszystkich pomiarów (`LiczbaPomiarow`),
   - gdy alarm jest nieaktywny, a nowy pomiar osiąga lub przekracza `ProgAlarmu`: aktywuje stan alarmu, zwiększa `LiczbaAlarmow`, zapamiętuje ten pomiar jako `OstatniAlarm` i bezpiecznie powiadamia subskrybentów zdarzenia `AlarmWyzwalany` (bez ryzyka `NullReferenceException`, gdy nikt nie subskrybuje),
   - gdy alarm jest aktywny, a pomiar spadnie do wartości mniejszej lub równej `ProgResetu`: dezaktywuje stan alarmu i ponownie uzbraja czujnik.
4. Statyczną metodę `FiltrujOdczyty(List<int> dane, Func<int, bool> warunek)`:
   - jeśli *dane* albo *warunek* ma wartość `null`, rzuca `ArgumentNullException`,
   - zwraca nową listę `List<int>` zawierającą w oryginalnej kolejności wyłącznie te odczyty, dla których delegat *warunek* zwraca `true` (bez modyfikowania listy wejściowej).

<data-gate>
<data-csharp-lab title="Zadanie: LicznikAlarmow z histerezą, event oraz Func" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;

public class LicznikAlarmow
{
    public int ProgAlarmu { get; private set; }
    public int ProgResetu { get; private set; }
    public int LiczbaPomiarow { get; private set; }
    public int LiczbaAlarmow { get; private set; }
    public int OstatniAlarm { get; private set; }
    public bool CzyAlarmAktywny { get; private set; }

    // 1. Zadeklaruj publiczne zdarzenie: public event Action<int> AlarmWyzwalany;

    public LicznikAlarmow(int progAlarmu, int progResetu)
    {
        // 2. Walidacja (progResetu >= progAlarmu -> ArgumentException) i inicjalizacja pól
    }

    public void SprawdzPoziom(int procent)
    {
        // 3. Zaimplementuj liczenie pomiarów, histerezę i bezpieczne wywołanie AlarmWyzwalany
    }

    public static List<int> FiltrujOdczyty(List<int> dane, Func<int, bool> warunek)
    {
        // 4. Walidacja null (ArgumentNullException) i filtrowanie odczytów za pomocą delegata Func
        return new List<int>();
    }

    static void Main()
    {
        var monitor = new LicznikAlarmow(80, 65);
        monitor.SprawdzPoziom(60);
        monitor.SprawdzPoziom(85);
        monitor.SprawdzPoziom(92);
        monitor.SprawdzPoziom(64);
        monitor.SprawdzPoziom(88);
        Console.WriteLine("Pomiary: " + monitor.LiczbaPomiarow + ", Alarmy: " + monitor.LiczbaAlarmow);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("AlarmWyzwalany jest prawdziwym zdarzeniem (event), a właściwości progów zwracają zadane wartości", () => {
    LabAssert.True(typeof(LicznikAlarmow).GetEvent("AlarmWyzwalany") != null,
        "AlarmWyzwalany musi być zadeklarowane jako zdarzenie (event), a nie zwykłe pole delegata");
    var m = new LicznikAlarmow(80, 65);
    LabAssert.Equal(80, m.ProgAlarmu);
    LabAssert.Equal(65, m.ProgResetu);
    LabAssert.Equal(-1, m.OstatniAlarm);
    LabAssert.False(m.CzyAlarmAktywny);
});

LabAssert.Test("Histereza obsługuje dokładny próg ProgAlarmu (80) i oscylację tuż nad ProgResetu (66 -> 80)", () => {
    var m = new LicznikAlarmow(80, 65);
    int wywolania = 0;
    int ostatniaWartosc = -1;
    m.AlarmWyzwalany += (val) => { wywolania++; ostatniaWartosc = val; };

    m.SprawdzPoziom(50);
    m.SprawdzPoziom(79);
    LabAssert.Equal(0, wywolania);
    LabAssert.False(m.CzyAlarmAktywny);

    // Dokładna wartość graniczna ProgAlarmu (80) wyzwala pierwszy alarm
    m.SprawdzPoziom(80);
    LabAssert.Equal(1, wywolania);
    LabAssert.Equal(80, ostatniaWartosc);
    LabAssert.Equal(80, m.OstatniAlarm);
    LabAssert.True(m.CzyAlarmAktywny);

    // Oscylacja tuż nad ProgResetu (66 -> 80) NIE resetuje alarmu i NIE duplikuje wywołania
    m.SprawdzPoziom(95);
    m.SprawdzPoziom(66);
    LabAssert.True(m.CzyAlarmAktywny);
    m.SprawdzPoziom(80);
    LabAssert.Equal(1, wywolania);

    // Dopiero spadek do dokładnego ProgResetu (65) uzbraja ponownie czujnik
    m.SprawdzPoziom(65);
    LabAssert.False(m.CzyAlarmAktywny);

    // Ponowne osiągnięcie progu wyzwala drugi alarm
    m.SprawdzPoziom(80);
    LabAssert.Equal(2, wywolania);
    LabAssert.Equal(80, m.OstatniAlarm);
    LabAssert.Equal(2, m.LiczbaAlarmow);
    LabAssert.Equal(8, m.LiczbaPomiarow);
});

LabAssert.Test("SprawdzPoziom nie rzuca NullReferenceException gdy brak subskrybentów", () => {
    var m = new LicznikAlarmow(75, 50);
    m.SprawdzPoziom(90);
    LabAssert.Equal(1, m.LiczbaAlarmow);
    LabAssert.Equal(90, m.OstatniAlarm);
});

LabAssert.Test("Obsługa wielu subskrybentów (+=) oraz wypisania subskrybenta (-=)", () => {
    var m = new LicznikAlarmow(80, 60);
    int licznikA = 0;
    int licznikB = 0;
    Action<int> subA = (v) => { licznikA++; };
    Action<int> subB = (v) => { licznikB++; };

    m.AlarmWyzwalany += subA;
    m.AlarmWyzwalany += subB;

    m.SprawdzPoziom(85);
    LabAssert.Equal(1, licznikA);
    LabAssert.Equal(1, licznikB);

    // Wypisujemy pierwszego subskrybenta i resetujemy histerezę
    m.AlarmWyzwalany -= subA;
    m.SprawdzPoziom(55);
    m.SprawdzPoziom(90);

    LabAssert.Equal(1, licznikA);
    LabAssert.Equal(2, licznikB);
});

LabAssert.Test("Konstruktor rzuca ArgumentException gdy ProgResetu >= ProgAlarmu", () => {
    LabAssert.Throws<ArgumentException>(() => { new LicznikAlarmow(80, 80); });
    LabAssert.Throws<ArgumentException>(() => { new LicznikAlarmow(70, 85); });
});

LabAssert.Test("FiltrujOdczyty filtruje listę przez Func<int, bool>, nie zmienia wejścia i waliduje null", () => {
    var wejscie = new System.Collections.Generic.List<int> { 45, 80, 79, 95, 62, 88 };

    var wysokie = LicznikAlarmow.FiltrujOdczyty(wejscie, (v) => v >= 80);
    LabAssert.Equal(3, wysokie.Count);
    LabAssert.Equal(80, wysokie[0]);
    LabAssert.Equal(95, wysokie[1]);
    LabAssert.Equal(88, wysokie[2]);

    // Lista wejściowa pozostała nietknięta
    LabAssert.Equal(6, wejscie.Count);

    var puste = LicznikAlarmow.FiltrujOdczyty(wejscie, (v) => v > 100);
    LabAssert.Equal(0, puste.Count);

    var parzyste = LicznikAlarmow.FiltrujOdczyty(wejscie, (v) => v % 2 == 0);
    LabAssert.Equal(3, parzyste.Count);
    LabAssert.Equal(80, parzyste[0]);
    LabAssert.Equal(62, parzyste[1]);
    LabAssert.Equal(88, parzyste[2]);

    LabAssert.Throws<ArgumentNullException>(() => { LicznikAlarmow.FiltrujOdczyty(null, (v) => true); });
    LabAssert.Throws<ArgumentNullException>(() => { LicznikAlarmow.FiltrujOdczyty(wejscie, null); });
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- <strong>Gdy przekazujesz funkcję jako parametr lub publikujesz powiadomienie:</strong> użyj `Action<T>` dla metod `void`, `Func<T, TResult>` dla metod zwracających wynik (na przykład filtrów) oraz `EventHandler` dla standardowych zdarzeń kontrolek WinForms.
- <strong>Gdy oddzielasz logikę silnika od okna:</strong> deklaruj zdarzenia ze słowem kluczowym `event`, aby zewnętrzny kod mógł wyłącznie dopisywać (`+=`) i wypisywać (`-=`) subskrybentów.
- <strong>Gdy wywołujesz własne zdarzenie w C# 5.0:</strong> skopiuj jego referencję do zmiennej lokalnej i sprawdź `!= null`, aby uniknąć wyjątku `NullReferenceException`.
- <strong>Gdy podpinasz się do długo żyjącego nadawcy:</strong> używaj metody nazwanej lub zapisanego pola delegata zamiast anonimowej lambdy i zawsze wypisuj się przez `-=` przy zamykaniu okna.
- <strong>Gdy potrzebujesz cyklicznej aktualizacji interfejsu:</strong> używaj `System.Windows.Forms.Timer` (bezpieczny wątek UI przez `WM_TIMER`), nigdy `Thread.Sleep` ani `System.Threading.Timer` do bezpośredniej zmiany kontrolek, i zawsze wywołuj `Stop()` oraz `Dispose()` w `FormClosing`.
