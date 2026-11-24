# Dynamiczne plansze WinForms i opóźnienie Timer

Plansza 4x4 wyklikana ręcznie w projektancie WinForms przestaje działać w chwili, gdy gracz wybierze tryb 3x4 albo 4x6. Ręczne układanie kilkudziesięciu przycisków nie skaluje się i zamienia każdą zmianę poziomu trudności w kopiowanie formularzy.

Kolejna ściana pojawia się przy obsłudze nietrafionej pary kart. Intuicja podpowiada prosty zapis: odkryj drugą kartę, wywołaj `Thread.Sleep(750)` i zakryj obie. Po uruchomieniu czeka jednak niemiła niespodzianka: okno zamiera, a druga karta w ogóle nie pojawia się na ekranie.

Na koniec program musi trwale zapisać najlepszy wynik. Zapis pliku obok `.exe` działa na Pulpicie, ale kończy się awarią uprawnień po zainstalowaniu gry w `C:\Program Files`. Poniżej rozkładamy na czynniki pierwsze trzy filary dojrzałej aplikacji okienkowej: dynamiczny układ siatki, nieblokujący `Timer` oraz atomowy zapis danych użytkownika.

---

## 🧩 Dynamiczna siatka TableLayoutPanel z kodu

Aby dopasować planszę do dowolnych wymiarów *wiersze* x *kolumny*, budujesz kontener `TableLayoutPanel` w pętli. Każdemu wierszowi i każdej kolumnie nadajesz styl `SizeType.Percent` z wartością `100f / wiersze` oraz `100f / kolumny`.

Zwróć uwagę na literę `f` w `100f`. Dzielenie całkowitoliczbowe `100 / 6` obcięłoby ułamek do `16`, zostawiając puste `4%` z boku planszy. Zapis `100f / 6` daje `16.6667f`, więc wszystkie karty mają identyczny rozmiar i wypełniają cały kontener.

```csharp
private TableLayoutPanel ZbudujSiatke(int wiersze, int kolumny, Size rozmiarPlanszy)
{
    var siatka = new TableLayoutPanel();
    siatka.Size = rozmiarPlanszy;
    siatka.RowCount = wiersze;
    siatka.ColumnCount = kolumny;

    siatka.SuspendLayout();
    for (int r = 0; r < wiersze; r++)
        siatka.RowStyles.Add(new RowStyle(SizeType.Percent, 100f / wiersze));
    for (int c = 0; c < kolumny; c++)
        siatka.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100f / kolumny));

    int indeks = 0;
    for (int r = 0; r < wiersze; r++)
    {
        for (int c = 0; c < kolumny; c++)
        {
            var btn = new Button();
            btn.Dock = DockStyle.Fill;
            btn.Margin = new Padding(4);
            btn.Tag = indeks++;
            siatka.Controls.Add(btn, c, r);
        }
    }
    siatka.ResumeLayout();
    return siatka;
}
```

Trzy właściwości decydują o tym, że siatka działa szybko i czysto:
- **`SuspendLayout()` i `ResumeLayout()`**: bez tej pary WinForms przeliczałby geometrię całej planszy po każdym `Controls.Add`. Dla 24 kart oznacza to 24 pełne przeliczenia układu zamiast jednego na końcu.
- **`Dock = DockStyle.Fill`**: rozciąga każdy przycisk na całą komórkę siatki z zachowaniem marginesu `Margin`. Bez tej właściwości przyciski miałyby domyślny, sztywny rozmiar i nie skalowałyby się z oknem.
- **`Button.Tag`**: uniwersalne pole typu `object` do przechowywania numeru karty w jednym wspólnym handlerze `Click`. Przypisanie wartości `int` wykonuje **boxing** (opakowanie liczby na stercie), a odczyt `int idx = (int)btn.Tag;` wykonuje **unboxing**.

> [!TIP]
> Podczas **unboxingu** rzutuj `btn.Tag` dokładnie na ten sam typ, który wcześniej zapisałeś. Jeśli w `Tag` siedzi `int`, próba rzutowania na `(long)btn.Tag` albo `(short)btn.Tag` rzuci wyjątek **_InvalidCastException_**.

### 📐 Algorytm szukania najbardziej kwadratowej siatki

Gracz wybiera liczbę kart (np. `12`, `16`, `24`), a program musi sam wyliczyć *wiersze* i *kolumny* tak, aby `wiersze * kolumny == liczbaKart`, `wiersze <= kolumny`, a kształt planszy był jak najbliższy kwadratowi.

Najpierw odrzucasz dane niepoprawne: dla `liczbaKart < 4` lub liczby nieparzystej (`liczbaKart % 2 != 0`) zawsze zerujesz oba parametry `out` (`wiersze = 0; kolumny = 0;`) i zwracasz `false`. Pozostawienie starych wartości w `out` po błędnym wywołaniu wprowadziłoby w błąd kod wywołujący.

Dla poprawnej liczby kart startujesz pętlą od pierwiastka `int d = (int)Math.Sqrt(liczbaKart);` i idziesz w dół do `1`. Pierwszy napotkany dzielnik spełniający `liczbaKart % d == 0` gwarantuje najmniejszą różnicę między bokami: `wiersze = d` oraz `kolumny = liczbaKart / d`. Przykładowo dla `16` trafiasz od razu `4x4`, dla `24` zaczynasz od `4` i dostajesz `4x6`, dla `12` masz `3x4`, a dla `14` trafiasz `2x7`.

<data-gate>
<data-connection-matcher title="Połącz mechanizm WinForms z jego rolą i skutkiem pominięcia">
  <item left="Dock = DockStyle.Fill" right="Rozciąga przycisk na całą komórkę siatki; bez tego karty mają sztywny rozmiar i nie skalują się"></item>
  <item left="Button.Tag" right="Przechowuje indeks karty jako object (boxing/unboxing) dla jednego wspólnego handlera Click"></item>
  <item left="SuspendLayout() i ResumeLayout()" right="Wstrzymuje przeliczanie układu do końca pętli; bez tego 24 karty wymuszają 24 przeliczenia geometrii"></item>
  <item left="SizeType.Percent z 100f / kolumny" right="Dzieli szerokość ułamkowo na równe pasy; dzielenie całkowite 100 / 6 obcięłoby ułamek i zostawiło pusty margines"></item>
  <item left="Environment.SpecialFolder.LocalApplicationData" right="Daje bezpieczny katalog zapisu bez uprawnień administratora; zapis obok .exe zawodzi w Program Files"></item>
</data-connection-matcher>
</data-gate>

---

## ⏱️ Kolejka WM_PAINT i jednorazowy Timer bez wyścigu zdarzeń

Aplikacja WinForms działa wokół jednej pętli komunikatów na **wątku UI**. Gdy w obsłudze kliknięcia zmienisz napis lub kolor przycisku, Windows nie rysuje kontrolki od razu. System jedynie dopisuje komunikat odrysowania _**WM_PAINT**_ na koniec kolejki.

> [!WARNING]
> Wywołanie **_Thread.Sleep(750)_** wewnątrz zdarzenia `Click` blokuje pętlę komunikatów. Okno nie reaguje na mysz, a komunikat _**WM_PAINT**_ czeka w kolejce przez całe 750 ms. W efekcie druga karta nawet nie zdąży się wyświetlić, zanim kod po przebudzeniu ją zakryje!

Aby pokazać graczowi obie karty i nie zamrozić okna, używasz obiektu `System.Windows.Forms.Timer`. Korzysta on z komunikatu _**WM_TIMER**_ na tym samym wątku UI, więc w zdarzeniu `Tick` bezpiecznie modyfikujesz przyciski bez ryzyka błędu wielowątkowości **_InvalidOperationException_**.

### 🛡️ Pole klasy i ochrona przed wyścigiem zdarzeń

W prostych przykładach timer bywa tworzony jako zmienna lokalna `var timerZakrycia = new Timer()`. W prawdziwej grze prowadzi to do groźnego błędu **_UI Race Condition_** (wyścigu zdarzeń w interfejsie).

Prześledź taki scenariusz: gracz odkrywa nietrafioną parę kart `0` i `5`, a timer startuje na `750 ms`. Po `300 ms` gracz klika przycisk „Nowa gra”, który tasuje nową planszę i odblokowuje kliknięcia. Gracz zdążył odkryć nową kartę `0`, gdy po pozostałych `450 ms` stary timer z poprzedniej partii odpala `Tick` i po cichu zakrywa kartę z nowej rozgrywki!

Rozwiązaniem jest trzymanie timera w polu klasy `_timerZakrycia` oraz metoda `AnulujTimerZakrycia()`, wywoływana zarówno w `Tick`, jak i na początku przycisku „Nowa gra”:

```csharp
private Timer _timerZakrycia;

private void AnulujTimerZakrycia()
{
    if (_timerZakrycia != null)
    {
        _timerZakrycia.Stop();
        _timerZakrycia.Dispose();
        _timerZakrycia = null;
    }
}

private void UruchomZakryciePoOpoznieniu(int pierwsza, int druga)
{
    AnulujTimerZakrycia();

    // Kopie lokalne dla domknięcia lambdy: pola klasy mogą się zmienić przed upływem 750 ms
    int a = pierwsza;
    int b = druga;

    _timerZakrycia = new Timer { Interval = 750 };
    _timerZakrycia.Tick += (s, e) =>
    {
        AnulujTimerZakrycia();
        ZakryjPare(a, b);
        _silnik.TimerZakonczony();
    };
    _timerZakrycia.Start();
}
```

Zwróć uwagę na zmienne lokalne *a* i *b*. Zanim upłynie `750 ms`, stan gry może wyzerować pole indeksowe pierwszej karty do `-1`. Przechwycenie lokalnych kopii *a* oraz *b* w domknięciu lambdy daje pewność, że po zakończeniu opóźnienia zakryjesz dokładnie tę parę kart, którą gracz przed chwilą odsłonił.

<data-gate>
<data-sortable-list title="Ułóż kolejność zdarzeń w kolejce UI WinForms po kliknięciu drugiej niepasującej karty">
  <item data-correct="3">Upływa 750 ms: system Windows dostarcza komunikat WM_TIMER i wywołuje handler Tick na wątku UI</item>
  <item data-correct="1">Handler Click odkrywa drugą kartę, ustawia blokadę, wywołuje _timerZakrycia.Start() i kończy działanie</item>
  <item data-correct="5">Handler Tick zakrywa karty a i b oraz zdejmuje blokadę w maszynie stanów</item>
  <item data-correct="2">Pętla komunikatów odbiera zakolejkowany WM_PAINT i rysuje obie odkryte karty na ekranie</item>
  <item data-correct="4">Handler Tick wywołuje AnulujTimerZakrycia(), wykonując Stop() i Dispose() na timerze Win32</item>
</data-sortable-list>
</data-gate>

---

## 💾 Formatowanie czasu i trwały zapis w LocalApplicationData

Zegar rozgrywki zlicza sekundy jako `int`. Aby wyświetlić napis `MM:SS`, dzielisz *sekundy* całkowicie przez `60` (minuty) i bierzesz resztę z dzielenia `sekundy % 60` (pozostałe sekundy).

Specyfikator formatu `:D2` w `string.Format("{0:D2}:{1:D2}", minuty, resztaSekund)` dopisuje wiodące zero tylko liczbom jednocyfrowym (`9` staje się `"09"`), ale nie ucina liczb większych (`61` pozostaje `"61"`). Dla wartości ujemnych sprowadź najpierw *sekundy* do `0`, aby zegar pokazał bezpieczne `"00:00"`.

### 📂 Ścieżka użytkownika i defensywny odczyt

Pliki z wynikami umieszczaj zawsze w katalogu danych bieżącego użytkownika zamiast obok `.exe`:

```csharp
string folder = Path.Combine(
    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
    "MemoryCards");
string sciezka = Path.Combine(folder, "rekord.txt");
```

Podczas odczytu pliku z dysku nie zakładaj, że plik istnieje ani że zawiera poprawną liczbę. Użytkownik mógł usunąć plik, otworzyć go w Notatniku i wpisać tekst `"abc"` albo zostawić pustą linię. Zamiast `int.Parse`, które rzuciłoby **_FormatException_**, sprawdź `File.Exists`, usuń białe znaki przez `Trim()` i użyj `int.TryParse`. Każdy błąd I/O, brak pliku albo wynik `<= 0` traktuj jako brak rekordu (`0`).

### ⚛️ Zapis atomowy przez plik tymczasowy

> [!CAUTION]
> Zwykłe `File.WriteAllText(sciezka, dane)` wywołuje funkcję systemową, która **_natychmiast obcina istniejący plik do 0 bajtów_**, a dopiero potem wpisuje nowe dane. Zanik zasilania lub ubicie procesu w tej milisekundzie niszczy dotychczasowy rekord.

Bezpieczny wzorzec inżynierski w systemach NTFS to **zapis atomowy**:
1. Upewnij się, że katalog docelowy istnieje (`Path.GetDirectoryName(sciezka)` + `Directory.CreateDirectory`).
2. Zapisz pełną nową treść do pliku tymczasowego `string tmp = sciezka + ".tmp";` przez `FileStream` i wymuś fizyczny zrzut bufora wywołaniem `fs.Flush(true)`.
3. Podmień plik jedną operacją metadanych systemu plików: `File.Replace(tmp, sciezka, null)` (gdy plik docelowy już istnieje) albo `File.Move(tmp, sciezka)` (przy pierwszym zapisie).

```csharp
string tmp = sciezka + ".tmp";
using (var fs = new FileStream(tmp, FileMode.Create, FileAccess.Write, FileShare.None))
using (var sw = new StreamWriter(fs))
{
    sw.Write(tresc);
    sw.Flush();
    fs.Flush(true);
}

if (File.Exists(sciezka))
    File.Replace(tmp, sciezka, null);
else
    File.Move(tmp, sciezka);
```

Jeśli zasilanie zniknie podczas zapisu do `.tmp`, oryginalny plik rekordu pozostaje nienaruszony. Jeśli zniknie po `File.Replace`, na dysku leży już pełny nowy plik.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: UAC i VirtualStore, Debouncing kontra Throttling oraz NTFS</span>
<span class="deep-dive-badge">WINDOWS SECURITY · UI PATTERNS · ATOMIC I/O</span>
</summary>
<div class="deep-dive-content">

<h4>1. UAC, Program Files i mechanizm VirtualStore</h4>

Od czasów Windows Vista mechanizm **UAC** (User Account Control) zabrania zwykłym procesom modyfikowania katalogów systemowych, w tym `C:\Program Files`. Zapis obok pliku `.exe` działa na Pulpicie, ale zawodzi po instalacji programu.

Zachowanie systemu zależy od manifestu aplikacji:
- **Stara aplikacja 32-bitowa bez manifestu UAC**: jądro Windows uruchamia zgodność wsteczną _**File Virtualization**_ i po cichu przekierowuje zapis do ukrytego folderu `AppData\Local\VirtualStore\Program Files\...`. Program nie rzuca wyjątku, lecz użytkownik nie znajduje pliku tam, gdzie go szuka.
- **Nowoczesna aplikacja .NET z manifestem `asInvoker` lub 64-bitowa**: wirtualizacja jest wyłączona, więc próba zapisu w `Program Files` kończy się natychmiastowym wyjątkiem **_UnauthorizedAccessException_**.

Z tego powodu wszystkie profesjonalne aplikacje desktopowe zapisują dane w `Environment.SpecialFolder.LocalApplicationData`, gdzie bieżący użytkownik ma pełne prawa zapisu bez eskalacji UAC.

<h4>2. Debouncing kontra Throttling w aplikacjach UI</h4>

Wzorzec zatrzymywania i ponownego uruchamiania timera (taki jak `AnulujTimerZakrycia()` przed nowym `Start()`) ma szersze zastosowanie w inżynierii interfejsów i nosi nazwę **debouncing**.

Przykład z wyszukiwarki: gdy użytkownik wpisuje słowo w pole tekstowe, każdy klawisz anuluje stary timer `300 ms` i uruchamia nowy. Zapytanie do bazy danych wysyła się dopiero wtedy, gdy użytkownik przestanie pisać na `300 ms`.

Pokrewną techniką jest **throttling** (dławienie częstotliwości). W przeciwieństwie do debouncingu nie czeka on na ciszę, lecz gwarantuje, że akcja (np. przeliczanie układu podczas przeciągania krawędzi okna myszą) wykona się maksymalnie raz na ustalony interwał, na przykład co `50 ms`.

<h4>3. Dlaczego File.WriteAllText grozi utratą danych na NTFS</h4>

Metoda `File.WriteAllText` otwiera plik z flagą Win32 `CREATE_ALWAYS`, która **_natychmiast obcina istniejący plik do 0 bajtów_** przed zapisaniem nowej zawartości. Ponadto system operacyjny buforuje zapis w pamięci RAM (cache dyskowy) i zrzuca go na nośnik z opóźnieniem.

Wywołanie `fs.Flush(true)` wymusza komendę `FlushFileBuffers` na sterowniku dysku, zanim wywołasz `File.Replace`. Sama zamiana wpisów w tablicy MFT systemu NTFS jest operacją księgowaną w dzienniku transakcji, dzięki czemu plik docelowy nigdy nie pozostaje w stanie „w połowie zapisany”.

</div>
</details>

---

## 💻 Zadanie praktyczne: Zegar, siatka i atomowy zapis rekordów

W klasie `RekordyHelper` zaimplementuj pięć metod statycznych dla silnika gry Memory:

1. **`FormatujCzas(int sekundy)`**:
   - wartości ujemne traktuj jako `0` (`"00:00"`),
   - zwróć napis `MM:SS` z co najmniej dwiema cyframi minut i dwiema cyframi sekund (np. `9` -> `"00:09"`, `75` -> `"01:15"`, `3665` -> `"61:05"`).
2. **`CzyNowyRekord(int stareRuchy, int noweRuchy)`**:
   - mniej ruchów oznacza lepszy wynik,
   - jeśli *noweRuchy* `<= 0`, zwróć `false`,
   - jeśli *stareRuchy* `<= 0` (brak rekordu), zwróć `true`,
   - w przeciwnym razie zwróć `true` wyłącznie wtedy, gdy `noweRuchy < stareRuchy`.
3. **`ObliczWymiarySiatki(int liczbaKart, out int wiersze, out int kolumny)`**:
   - jeśli `liczbaKart < 4` lub *liczbaKart* jest nieparzyste, wyzeruj `wiersze = 0`, `kolumny = 0` i zwróć `false`,
   - w przeciwnym razie wyznacz parę liczb `wiersze <= kolumny` o najmniejszej różnicy, gdzie `wiersze * kolumny == liczbaKart` (dzielniki od `(int)Math.Sqrt(liczbaKart)` w dół), i zwróć `true`.
4. **`WczytajRekordZPliku(string sciezka)`**:
   - jeśli *sciezka* jest pusta (`string.IsNullOrWhiteSpace`) lub plik nie istnieje, zwróć `0`,
   - wczytaj treść pliku (zabezpieczając odczyt `try / catch`), przytnij białe znaki przez `Trim()` i sparsuj przez `int.TryParse`,
   - jeśli tekst nie jest poprawną liczbą dodatnią (np. `"abc"`, `""`, `"-5"`), zwróć `0`; w przeciwnym razie zwróć wczytaną liczbę.
5. **`ZapiszRekordJesliLepszy(string sciezka, int noweRuchy)`**:
   - jeśli *sciezka* jest pusta lub `noweRuchy <= 0`, zwróć `false`,
   - wczytaj dotychczasowy rekord metodą `WczytajRekordZPliku(sciezka)` i sprawdź `CzyNowyRekord(stary, noweRuchy)` (jeśli nowy wynik nie jest lepszy, zwróć `false`),
   - jeśli `Path.GetDirectoryName(sciezka)` nie jest puste, utwórz brakujący katalog metodą `Directory.CreateDirectory`,
   - zapisz `noweRuchy.ToString()` atomowo przez plik `sciezka + ".tmp"` (`FileStream` + `Flush(true)` + `File.Replace` gdy plik istnieje albo `File.Move` przy pierwszym zapisie) i zwróć `true`.

<data-gate>
<data-csharp-lab title="Zadanie: RekordyHelper (zegar, wymiary siatki i atomowy zapis rekordu)" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.IO;

public static class RekordyHelper
{
    public static string FormatujCzas(int sekundy)
    {
        // Zwróć "MM:SS" (wartości ujemne -> "00:00", sekundy >= 3600 -> np. "60:00", "61:05")
        return "00:00";
    }

    public static bool CzyNowyRekord(int stareRuchy, int noweRuchy)
    {
        // Mniej ruchów = lepiej; stareRuchy <= 0 oznacza brak wcześniejszego rekordu
        return false;
    }

    public static bool ObliczWymiarySiatki(int liczbaKart, out int wiersze, out int kolumny)
    {
        // Dla parzystej liczbaKart >= 4 wyznacz najbardziej kwadratowe wymiary (wiersze <= kolumny)
        wiersze = 0;
        kolumny = 0;
        return false;
    }

    public static int WczytajRekordZPliku(string sciezka)
    {
        // Zwróć 0 gdy brak pliku, błędna ścieżka, błąd I/O, śmieci zamiast liczby lub wartość <= 0
        return 0;
    }

    public static bool ZapiszRekordJesliLepszy(string sciezka, int noweRuchy)
    {
        // Porównaj z bieżącym rekordem z pliku, utwórz katalog jeśli brakuje
        // i zapisz nowy rekord atomowo przez plik .tmp
        return false;
    }

    static void Main()
    {
        Console.WriteLine("75 s -> " + FormatujCzas(75));
        Console.WriteLine("3665 s -> " + FormatujCzas(3665));
        Console.WriteLine("Nowy rekord (18 vs 14): " + CzyNowyRekord(18, 14));

        int w, k;
        if (ObliczWymiarySiatki(24, out w, out k))
            Console.WriteLine("24 karty -> siatka " + w + "x" + k);
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("FormatujCzas formatuje MM:SS, obsługuje ujemne oraz czasy >= 3600 s", () => {
    LabAssert.Equal("00:00", RekordyHelper.FormatujCzas(-5));
    LabAssert.Equal("00:00", RekordyHelper.FormatujCzas(0));
    LabAssert.Equal("00:09", RekordyHelper.FormatujCzas(9));
    LabAssert.Equal("00:59", RekordyHelper.FormatujCzas(59));
    LabAssert.Equal("01:00", RekordyHelper.FormatujCzas(60));
    LabAssert.Equal("01:15", RekordyHelper.FormatujCzas(75));
    LabAssert.Equal("10:00", RekordyHelper.FormatujCzas(600));
    LabAssert.Equal("60:00", RekordyHelper.FormatujCzas(3600));
    LabAssert.Equal("61:05", RekordyHelper.FormatujCzas(3665));
});

LabAssert.Test("CzyNowyRekord rozpoznaje pierwszy rekord, poprawę i błędne wartości", () => {
    LabAssert.True(RekordyHelper.CzyNowyRekord(0, 16));
    LabAssert.True(RekordyHelper.CzyNowyRekord(-1, 10));
    LabAssert.True(RekordyHelper.CzyNowyRekord(16, 12));
    LabAssert.False(RekordyHelper.CzyNowyRekord(12, 12));
    LabAssert.False(RekordyHelper.CzyNowyRekord(12, 15));
    LabAssert.False(RekordyHelper.CzyNowyRekord(0, 0));
    LabAssert.False(RekordyHelper.CzyNowyRekord(10, -4));
});

LabAssert.Test("ObliczWymiarySiatki odrzuca niepoprawne liczby i dobiera wymiary najbliższe kwadratowi", () => {
    int w, k;

    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(0, out w, out k));
    LabAssert.Equal(0, w);
    LabAssert.Equal(0, k);

    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(-8, out w, out k));
    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(2, out w, out k));
    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(7, out w, out k));
    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(15, out w, out k));

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(4, out w, out k));
    LabAssert.Equal(2, w);
    LabAssert.Equal(2, k);

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(12, out w, out k));
    LabAssert.Equal(3, w);
    LabAssert.Equal(4, k);

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(14, out w, out k));
    LabAssert.Equal(2, w);
    LabAssert.Equal(7, k);

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(16, out w, out k));
    LabAssert.Equal(4, w);
    LabAssert.Equal(4, k);

    // Błędne wywołanie po poprawnym musi wyzerować parametry out
    LabAssert.False(RekordyHelper.ObliczWymiarySiatki(15, out w, out k));
    LabAssert.Equal(0, w);
    LabAssert.Equal(0, k);

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(24, out w, out k));
    LabAssert.Equal(4, w);
    LabAssert.Equal(6, k);

    LabAssert.True(RekordyHelper.ObliczWymiarySiatki(30, out w, out k));
    LabAssert.Equal(5, w);
    LabAssert.Equal(6, k);
});

LabAssert.Test("WczytajRekordZPliku jest odporne na brak pliku, puste ścieżki i uszkodzone dane", () => {
    string tempDir = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "koala_rec_read_" + Guid.NewGuid().ToString("N"));
    try
    {
        System.IO.Directory.CreateDirectory(tempDir);
        string brak = System.IO.Path.Combine(tempDir, "nie_ma.txt");
        string smieci = System.IO.Path.Combine(tempDir, "smieci.txt");
        string ujemny = System.IO.Path.Combine(tempDir, "ujemny.txt");
        string ok = System.IO.Path.Combine(tempDir, "ok.txt");

        System.IO.File.WriteAllText(smieci, "abc\r\n");
        System.IO.File.WriteAllText(ujemny, "-7");
        System.IO.File.WriteAllText(ok, "  18 \n");

        LabAssert.Equal(0, RekordyHelper.WczytajRekordZPliku(null));
        LabAssert.Equal(0, RekordyHelper.WczytajRekordZPliku("   "));
        LabAssert.Equal(0, RekordyHelper.WczytajRekordZPliku(brak));
        LabAssert.Equal(0, RekordyHelper.WczytajRekordZPliku(smieci));
        LabAssert.Equal(0, RekordyHelper.WczytajRekordZPliku(ujemny));
        LabAssert.Equal(18, RekordyHelper.WczytajRekordZPliku(ok));
    }
    finally
    {
        if (System.IO.Directory.Exists(tempDir))
            System.IO.Directory.Delete(tempDir, true);
    }
});

LabAssert.Test("ZapiszRekordJesliLepszy tworzy katalog, zapisuje atomowo i nadpisuje tylko lepszy wynik", () => {
    string tempDir = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "koala_rec_save_" + Guid.NewGuid().ToString("N"));
    try
    {
        string sciezka = System.IO.Path.Combine(tempDir, "podkatalog", "rekord.txt");

        LabAssert.False(RekordyHelper.ZapiszRekordJesliLepszy("", 10));
        LabAssert.False(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 0));
        LabAssert.False(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, -5));

        // Pierwszy zapis tworzy brakujący katalog i zapisuje wynik bez pozostałości .tmp
        LabAssert.True(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 20));
        LabAssert.Equal(20, RekordyHelper.WczytajRekordZPliku(sciezka));
        LabAssert.False(System.IO.File.Exists(sciezka + ".tmp"), "Plik tymczasowy .tmp nie powinien pozostać na dysku.");

        // Gorszy lub równy wynik nie nadpisuje pliku
        LabAssert.False(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 20));
        LabAssert.False(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 25));
        LabAssert.Equal(20, RekordyHelper.WczytajRekordZPliku(sciezka));

        // Lepszy wynik nadpisuje plik atomowo
        LabAssert.True(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 14));
        LabAssert.Equal(14, RekordyHelper.WczytajRekordZPliku(sciezka));
        LabAssert.False(System.IO.File.Exists(sciezka + ".tmp"), "Plik tymczasowy .tmp nie powinien pozostać po podmianie.");

        // Uszkodzony plik ze śmieciami traktowany jako brak rekordu (0) -> daje się nadpisać
        System.IO.File.WriteAllText(sciezka, "abc");
        LabAssert.True(RekordyHelper.ZapiszRekordJesliLepszy(sciezka, 19));
        LabAssert.Equal(19, RekordyHelper.WczytajRekordZPliku(sciezka));
    }
    finally
    {
        if (System.IO.Directory.Exists(tempDir))
            System.IO.Directory.Delete(tempDir, true);
    }
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- **Kiedy generujesz w pętli wiele kontrolek WinForms:** otocz pętlę parą `SuspendLayout()` / `ResumeLayout()`, użyj `SizeType.Percent` z `100f` oraz `Dock = DockStyle.Fill`, aby układ przeliczył się raz i płynnie skalował.
- **Kiedy potrzebujesz opóźnienia w oknie bez zamrażania GUI:** użyj `System.Windows.Forms.Timer` przechowywanego w polu klasy z metodą `AnulujTimerZakrycia()` i lokalnymi kopiami zmiennych w lambdzie, nigdy `Thread.Sleep` w handlerze `Click`.
- **Kiedy zapisujesz trwałe dane użytkownika w Windows:** buduj ścieżkę z `Environment.SpecialFolder.LocalApplicationData`, parsuj odczyt defensywnie przez `TryParse`, a zapis wykonuj atomowo przez plik `.tmp` i `File.Replace` / `File.Move`.
- **Kiedy dobierasz wymiary prostokątnej siatki dla parzystej liczby kart:** szukaj pierwszego dzielnika od `(int)Math.Sqrt(N)` w dół i zawsze zeruj parametry `out` przy błędnym wejściu.
