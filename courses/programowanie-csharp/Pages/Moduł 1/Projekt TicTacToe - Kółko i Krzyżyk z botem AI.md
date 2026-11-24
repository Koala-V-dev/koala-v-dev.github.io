# Projekt TicTacToe - Kółko i Krzyżyk z botem AI

Napisanie gry w Kółko i Krzyżyk w jednej długiej metodzie `Main()` wydaje się szybkie tylko pierwszego dnia. Kiedy jednak wymieszasz `Console.ReadLine()` i rysowanie kresek bezpośrednio ze sprawdzaniem wygranej, wpadasz w ślepą uliczkę.

Takiego kodu nie da się automatycznie przetestować, ponieważ każda próba uruchomienia czeka na człowieka przy klawiaturze. A gdy zechcesz przenieść grę z czarnego terminala do okienkowej aplikacji graficznej, musisz przepisać wszystkie zasady od zera.

Rozwiązaniem jest świadomy podział projektu na dwie niezależne warstwy. Zbudujesz pełnoprawny plik `TicTacToe.exe`, w którym logika gry nic nie wie o konsoli.

---

## 🏗️ Architektura dwuplikowa: silnik kontra interfejs

Projekt dzielimy na dwa pliki o jasno wyznaczonych granicach odpowiedzialności:
1. **`SilnikGry.cs`**: czysta logika planszy `char[,]`, walidacja ruchów, wykrywanie wygranej i remisu oraz algorytm decyzji bota AI. W tym pliku nie wolno używać klasy `Console`.
2. **`Program.cs`**: warstwa interfejsu konsolowego z pętlą rozgrywki, czytelnym rysowaniem siatki i pobieraniem liczb od użytkownika.

Klasa `SilnikGry` jest oznaczona jako **`public static class SilnikGry`**. Słowo `static` oznacza, że nie tworzysz jej egzemplarza przez `new SilnikGry()`, tylko wywołujesz gotowe metody bezpośrednio po nazwie klasy, na przykład `SilnikGry.WykonajRuch(...)`. Słowo `public` udostępnia te metody innym plikom oraz testom automatycznym.

Taki podział ma konkretny cel inżynierski: w Module 5 weźmiesz _**ten sam plik `SilnikGry.cs`**_ i bez przepisywania zasad gry podepniesz go pod okno Windows Forms (`TicTacToeGUI.exe`).

### 🔌 Tryb interaktywny i Console.IsInputRedirected

Program konsolowy uruchomiony w automatycznym środowisku testowym (albo z przekierowanym wejściem) nie ma żywego użytkownika przed ekranem. Gdyby wywołał wtedy `Console.ReadLine()`, zawiesiłby się lub odczytał pustą wartość `null`.

Właściwość **`Console.IsInputRedirected`** rozwiązuje ten problem. Zwraca `true`, gdy wejście jest przekierowane (na przykład w podglądzie przeglądarkowym), i `false`, gdy uruchamiasz `TicTacToe.exe` w prawdziwym oknie terminala.

Dzięki temu `Program.cs` ma dwa tryby pracy: w przeglądarce prezentuje szybką symulację pierwszego ruchu bota, a po pobraniu pliku `.exe` uruchamia pełną rozgrywkę interaktywną.

> [!TIP]
> Gdy klikniesz dwukrotnie pobrany plik `TicTacToe.exe` w Eksploratorze Windows, okno terminala zamyka się natychmiast po zakończeniu metody `Main()`. Dlatego na końcu trybu interaktywnego dopisujemy `Console.WriteLine("\nNacisnij Enter, aby zakonczyc...");` oraz `Console.ReadLine();`, aby zdążyć przeczytać wynik partii.

---

## 🤖 Czteropoziomowa heurystyka bota AI

Bot nie losuje pól na ślepo. W każdej swojej turze ocenia aktualny stan planszy według ścisłej hierarchii priorytetów: od ruchów decydujących o wyniku partii aż po kontrolę najsilniejszych pól strategicznych.

| Priorytet | Strategia bota | Co dokładnie sprawdza? | Dlaczego to działa? |
| :---: | :--- | :--- | :--- |
| **1** | **Atak (natychmiastowa wygrana)** | Czy istnieje wolne pole, na którym wstawienie znaku *bot* daje 3 w linii? | Kończy partię w tej turze i zapewnia zwycięstwo. |
| **2** | **Obrona (blokowanie rywala)** | Czy istnieje wolne pole, na którym znak *gracz* dałby mu wygraną za turę? | Uniemożliwia przeciwnikowi zwycięstwo w następnym ruchu. |
| **3** | **Kontrola środka** | Czy pole `5` (`p[1, 1]`) jest wolne? | Środek należy jednocześnie do **4 linii wygrywających** (wiersz, kolumna, obie przekątne). |
| **4** | **Narożniki, potem krawędzie** | Pierwsze wolne pole z `{ 1, 3, 7, 9 }`, a na końcu pozostałe `{ 2, 4, 6, 8 }`. | Każdy narożnik należy do **3 linii**, a pole krawędziowe tylko do **2 linii**. |

Kolejność pierwszych dwóch kroków jest krytyczna. Wyobraź sobie planszę, na której bot (`O`) ma już dwa znaki w pierwszym wierszu, a gracz (`X`) ma dwa znaki w drugim wierszu.

Jeśli zamienisz Atak z Obroną, bot najpierw zablokuje gracza w drugim wierszu, zamiast dostawić trzecie `O` i wygrać od razu. W ten sposób oddałby pewną wygraną i przedłużył partię.

<data-gate>
<data-sortable-list title="Ułóż cztery priorytety decyzyjne bota AI od najwyższego do najniższego">
  <item data-correct="3">Kontrola środka planszy (pole 5), które przecina aż 4 linie wygrywające</item>
  <item data-correct="1">Atak: natychmiastowe uzupełnienie własnej linii i wygrana w tej turze</item>
  <item data-correct="4">Zajęcie pierwszego wolnego narożnika (3 linie), a dopiero potem krawędzi (2 linie)</item>
  <item data-correct="2">Obrona: zablokowanie pola, na którym przeciwnik ułożyłby 3 znaki w następnej turze</item>
</data-sortable-list>
</data-gate>

---

## 🧪 Ruch na próbę i granica heurystyki

Priorytety 1 i 2 korzystają z tej samej metody pomocniczej: `ZnajdzRuchWygrywajacy(char[,] p, char znak)`. Przy ataku wywołujesz ją dla znaku *bot*, a przy obronie dla znaku *gracz*.

Jej działanie opiera się na technice **ruchu na próbę i cofnięcia** (make move / unmake move). Dla każdego pola `pole` od `1` do `9` metoda przelicza `(r, c)`, pomija zajęte komórki, a dla wolnego pola wykonuje trzy kroki:
1. Tymczasowo wpisuje badany znak na planszę: `p[r, c] = znak;`.
2. Zapisuje do zmiennej logicznej wynik gotowej metody `CzyWygrana(p, znak)`.
3. Zawsze cofa zmianę z powrotem na kropkę `p[r, c] = '.';`, zanim zdecyduje o zwrocie numeru *pole*.

> [!WARNING]
> Zawsze przywracaj `p[r, c] = '.';` **przed** instrukcją `return pole;`. Jeśli napiszesz `if (CzyWygrana(p, znak)) return pole;` bez cofnięcia znaku, bot podczas sprawdzania obrony zostawi na planszy **_fałszywy znak przeciwnika_**. Kolejne wywołanie `WykonajRuch` zobaczy wtedy zajęte pole i cała rozgrywka się rozsypie.

### 🍴 Dlaczego heurystyka przegrywa z „widełkami”?

Nasza 4-poziomowa heurystyka gra solidnie, ale patrzy wyłącznie na jeden ruch do przodu. Doświadczony gracz może zastawić na nią podwójną groźbę, nazywaną **„widełkami”**.

Prześledź taki układ: gracz `X` stawia znak w narożniku `1`, bot `O` zajmuje środek `5`, gracz dokłada przeciwny narożnik `9`, bot wybiera wolny narożnik `3`, a gracz zajmuje narożnik `7`.

```text
 X | . | O
---+---+---
 . | O | .
---+---+---
 X | . | X
```

Teraz gracz `X` grozi wygraną jednocześnie na polu `4` (lewa kolumna) oraz na polu `8` (dolny wiersz). Bot może zablokować w swojej turze tylko jedno z nich, więc przegrywa w kolejnym ruchu. Aby zablokować „widełki” z wyprzedzeniem, silnik musi zajrzeć głębiej w drzewo gry (zobacz sekcję „Pod maską” o algorytmie Minimax).

<data-gate>
<data-connection-matcher title="Dopasuj sytuację na planszy do decyzji bota AI (bot gra jako O)">
  <item left="Bot ma O na polach 1 i 2, a gracz X na polach 4 i 5 (pola 3 i 6 wolne)" right="Priorytet 1 (Atak): bot wybiera pole 3 i kończy partię wygraną"></item>
  <item left="Gracz ma X na polach 1 i 5, bot ma O na polu 3 (pole 9 wolne)" right="Priorytet 2 (Obrona): bot blokuje przekątną na polu 9"></item>
  <item left="Gracz rozpoczął od narożnika na polu 1, reszta planszy jest pusta" right="Priorytet 3 (Środek): bot zajmuje kluczowe pole 5"></item>
  <item left="Gracz rozpoczął od środka na polu 5, reszta planszy jest pusta" right="Priorytet 4 (Narożnik): bot zajmuje pierwszy wolny narożnik (pole 1)"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Przestrzeń stanów gry, algorytm Minimax i odcinanie Alpha-Beta w silnikach C++</span>
<span class="deep-dive-badge">AI W GRACH · TEORIA GIER · C++ · STOCKFISH</span>
</summary>
<div class="deep-dive-content">

<h4>1. Przestrzeń stanów Kółko i Krzyżyk w dokładnych liczbach</h4>

Na pustej planszy `3x3` pierwszy gracz ma 9 możliwości, drugi 8, trzeci 7 i tak dalej. Górna granica liczby wszystkich sekwencji ruchów wynosi $9! = 362\,880$.

Po odrzuceniu nielegalnych przedłużeń partii po ułożeniu 3 znaków w linii zostaje dokładnie **255 168** możliwych pełnych rozgrywek:
- `131 184` kończy się wygraną pierwszego gracza (`X`),
- `77 904` kończy się wygraną drugiego gracza (`O`),
- `46 080` kończy się remisem.

Wiele układów jest swoim odbiciem lustrzanym lub obrotem o 90, 180 albo 270 stopni. Po odrzuceniu symetrii w całej grze istnieje zaledwie **765** istotnie różnych pozycji. Współczesny procesor przeszukuje całe drzewo gry w ułamku milisekundy.

<h4>2. Matematyczna definicja algorytmu Minimax</h4>

Aby bot był matematycznie **niepokonany** (najgorszy możliwy wynik to remis) i zawsze unikał „widełek”, stosuje się rekurencyjny algorytm **Minimax**. Zakłada on, że obaj gracze wybierają ruchy optymalne:
- Węzeł **MAX** (tura bota) szuka ruchu o najwyższej ocenie (`+10 - glebokosc` za wygraną, `0` za remis, `glebokosc - 10` za porażkę).
- Węzeł **MIN** (tura gracza) szuka ruchu o najniższej ocenie z perspektywy bota.

Odjęcie głębokości sprawia, że bot woli wygrać w 2 ruchach niż w 4, a w przegranej pozycji walczy jak najdłużej.

```csharp
static int Minimax(char[,] p, int glebokosc, bool turaBota)
{
    if (SilnikGry.CzyWygrana(p, 'O')) return 10 - glebokosc;
    if (SilnikGry.CzyWygrana(p, 'X')) return glebokosc - 10;
    if (SilnikGry.CzyRemis(p)) return 0;

    int najlepszy = turaBota ? int.MinValue : int.MaxValue;
    for (int pole = 1; pole <= 9; pole++)
    {
        int r = (pole - 1) / 3, c = (pole - 1) % 3;
        if (p[r, c] != '.') continue;
        p[r, c] = turaBota ? 'O' : 'X';
        int ocena = Minimax(p, glebokosc + 1, !turaBota);
        p[r, c] = '.'; // Cofniecie ruchu (unmake move)
        if (turaBota && ocena > najlepszy) najlepszy = ocena;
        if (!turaBota && ocena < najlepszy) najlepszy = ocena;
    }
    return najlepszy;
}
```

<h4>3. Odcinanie Alpha-Beta Pruning w silnikach szachowych C++</h4>

W szachach z typowej pozycji istnieje około `35` legalnych ruchów. Przeszukanie czystym Minimaxem zaledwie 6 półruchów w przód wymagałoby sprawdzenia $35^6 = 1\,838\,265\,625$ pozycji.

Silniki szachowe pisane w C++ (na przykład Stockfish) przyspieszają przeszukiwanie przez **Alpha-Beta Pruning**. Algorytm pilnuje dwóch granic:
- **alfa (`alpha`)**: najlepszy wynik, jaki gracz MAX ma już zagwarantowany na innej gałęzi.
- **beta (`beta`)**: najniższy wynik, jaki gracz MIN ma już zagwarantowany.

Gdy w kolejnej gałęzi zajdzie warunek `beta <= alpha`, przeciwnik i tak nigdy nie dopuści do tej pozycji. Silnik natychmiast przerywa analizę tej gałęzi instrukcją `break`. Wynik jest identyczny z pełnym Minimaxem, ale liczba odwiedzanych pozycji spada z ponad 1,8 miliarda do około $35^3 = 42\,875$, czyli ponad **42 000 razy mniej pracy**.

</div>
</details>

---

## 💻 Projekt Modułu 1: Zbuduj i pobierz TicTacToe.exe

Przełącz zakładkę edytora na **`SilnikGry.cs`** i zaimplementuj cztery kluczowe metody silnika:

1. **`CzyRemis(char[,] p)`**:
   - zwraca `true` wyłącznie wtedy, gdy na planszy nie ma już żadnego wolnego pola `'.'` **oraz** żaden z graczy (`'X'` ani `'O'`) nie wygrał.
2. **`WykonajRuch(char[,] p, int pole, char znak)`**:
   - sprawdza, czy *pole* mieści się w zakresie `1..9`,
   - wylicza `r = (pole - 1) / 3` i `c = (pole - 1) % 3`,
   - jeśli `p[r, c] != '.'` (pole zajęte), zwraca `false` bez modyfikacji planszy,
   - w przeciwnym razie wpisuje `p[r, c] = znak;` i zwraca `true`.
3. **`ZnajdzRuchWygrywajacy(char[,] p, char znak)`**:
   - przegląda pola `1..9` i dla każdego wolnego pola `'.'` wykonuje ruch na próbę: wpisuje *znak*, sprawdza `CzyWygrana(p, znak)` i **zawsze** cofa pole z powrotem na `'.'` przed zwróceniem numeru *pole*,
   - jeśli żaden ruch nie daje natychmiastowej wygranej, zwraca `-1`.
4. **`WybierzRuchBota(char[,] p, char bot, char gracz)`**:
   - priorytet 1: wywołuje `ZnajdzRuchWygrywajacy(p, bot)` i jeśli wynik jest różny od `-1`, zwraca go,
   - priorytet 2: wywołuje `ZnajdzRuchWygrywajacy(p, gracz)` i jeśli wynik jest różny od `-1`, zwraca to pole jako blok,
   - priorytet 3: jeśli środek `p[1, 1] == '.'`, zwraca `5`,
   - priorytet 4: sprawdza kolejno narożniki `{ 1, 3, 7, 9 }`, a jeśli wszystkie są zajęte, zwraca pierwsze wolne pole z `1..9` (lub `-1`, gdy plansza jest pełna).

Po przejściu wszystkich testów pobierz plik **`TicTacToe.exe`** i rozegraj partię z własnym botem w oknie terminala.

<data-gate>
<data-csharp-lab title="Projekt Modulu 1: TicTacToe z botem AI (2 pliki)" exe-name="TicTacToe.exe">
<cs-file name="Program.cs">

```csharp
using System;

class Program
{
    static void RysujPlansze(char[,] p)
    {
        Console.WriteLine();
        for (int r = 0; r < 3; r++)
        {
            Console.Write("  ");
            for (int c = 0; c < 3; c++)
            {
                char znak = p[r, c];
                if (znak == '.') Console.Write(" " + (r * 3 + c + 1) + " ");
                else Console.Write(" " + znak + " ");
                if (c < 2) Console.Write("|");
            }
            Console.WriteLine();
            if (r < 2) Console.WriteLine("  ---+---+---");
        }
        Console.WriteLine();
    }

    static void Main()
    {
        char[,] plansza = SilnikGry.NowaPlansza();
        Console.WriteLine("=== TICTACTOE AI v1.0 ===");

        if (Console.IsInputRedirected)
        {
            // Tryb podgladu automatycznego (symulacja poczatku partii)
            SilnikGry.WykonajRuch(plansza, 1, 'X');
            int ruchBota = SilnikGry.WybierzRuchBota(plansza, 'O', 'X');
            SilnikGry.WykonajRuch(plansza, ruchBota, 'O');
            RysujPlansze(plansza);
            Console.WriteLine("Bot AI wybral pole: " + ruchBota);
            Console.WriteLine("Pobierz TicTacToe.exe, aby zagrac interaktywnie na Windows!");
            return;
        }

        while (true)
        {
            RysujPlansze(plansza);
            Console.Write("Twoj ruch (1-9): ");
            int pole;
            if (!int.TryParse(Console.ReadLine(), out pole) || !SilnikGry.WykonajRuch(plansza, pole, 'X'))
            {
                Console.WriteLine("Nieprawidlowe lub zajete pole!");
                continue;
            }
            if (SilnikGry.CzyWygrana(plansza, 'X'))
            {
                RysujPlansze(plansza);
                Console.WriteLine("WYGRALES!");
                break;
            }
            if (SilnikGry.CzyRemis(plansza))
            {
                RysujPlansze(plansza);
                Console.WriteLine("REMIS!");
                break;
            }

            int botPole = SilnikGry.WybierzRuchBota(plansza, 'O', 'X');
            SilnikGry.WykonajRuch(plansza, botPole, 'O');
            Console.WriteLine("Bot AI zagral na pole: " + botPole);
            if (SilnikGry.CzyWygrana(plansza, 'O'))
            {
                RysujPlansze(plansza);
                Console.WriteLine("BOT AI WYGRAL!");
                break;
            }
            if (SilnikGry.CzyRemis(plansza))
            {
                RysujPlansze(plansza);
                Console.WriteLine("REMIS!");
                break;
            }
        }

        Console.WriteLine("\nNacisnij Enter, aby zakonczyc...");
        Console.ReadLine();
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
        return new char[,] {
            { '.', '.', '.' },
            { '.', '.', '.' },
            { '.', '.', '.' }
        };
    }

    public static bool CzyWygrana(char[,] p, char z)
    {
        for (int i = 0; i < 3; i++)
        {
            if (p[i, 0] == z && p[i, 1] == z && p[i, 2] == z) return true;
            if (p[0, i] == z && p[1, i] == z && p[2, i] == z) return true;
        }
        return (p[0, 0] == z && p[1, 1] == z && p[2, 2] == z)
            || (p[0, 2] == z && p[1, 1] == z && p[2, 0] == z);
    }

    public static bool CzyRemis(char[,] p)
    {
        // Zwroc true tylko gdy brak pol '.' oraz nikt nie wygral
        return false;
    }

    public static bool WykonajRuch(char[,] p, int pole, char znak)
    {
        // Zwaliduj zakres 1..9 i sprawdz, czy p[r, c] == '.'
        return false;
    }

    public static int ZnajdzRuchWygrywajacy(char[,] p, char znak)
    {
        // Dla kazdego wolnego pola 1..9: wpisz znak, sprawdz CzyWygrana, ZAWSZE cofnij na '.' przed return
        return -1;
    }

    public static int WybierzRuchBota(char[,] p, char bot, char gracz)
    {
        // 1. Atak (ZnajdzRuchWygrywajacy dla bot)
        // 2. Obrona (ZnajdzRuchWygrywajacy dla gracz)
        // 3. Srodek (5), potem narozniki { 1, 3, 7, 9 }, potem pierwsze wolne pole
        return -1;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("WykonajRuch stawia znak na wolnym polu i odrzuca zajete lub nielegalne pola", () => {
    char[,] p = SilnikGry.NowaPlansza();
    LabAssert.True(SilnikGry.WykonajRuch(p, 5, 'X'));
    LabAssert.Equal('X', p[1, 1]);
    LabAssert.False(SilnikGry.WykonajRuch(p, 5, 'O'));
    LabAssert.Equal('X', p[1, 1]);
    LabAssert.False(SilnikGry.WykonajRuch(p, 0, 'O'));
    LabAssert.False(SilnikGry.WykonajRuch(p, 10, 'O'));
    LabAssert.False(SilnikGry.WykonajRuch(p, -2, 'O'));
});
LabAssert.Test("CzyRemis wykrywa pelna plansze bez zwyciezcy i zwraca false przy wygranej lub wolnych polach", () => {
    char[,] remis = { { 'X', 'O', 'X' }, { 'X', 'O', 'O' }, { 'O', 'X', 'X' } };
    LabAssert.True(SilnikGry.CzyRemis(remis));

    char[,] wygranaPelna = { { 'X', 'X', 'X' }, { 'O', 'O', 'X' }, { 'O', 'X', 'O' } };
    LabAssert.False(SilnikGry.CzyRemis(wygranaPelna));

    char[,] wTrakcie = { { 'X', 'O', '.' }, { '.', 'X', '.' }, { '.', '.', 'O' } };
    LabAssert.False(SilnikGry.CzyRemis(wTrakcie));
});
LabAssert.Test("ZnajdzRuchWygrywajacy znajduje wygrana i NIE zostawia smieci na planszy", () => {
    char[,] p = { { 'O', 'O', '.' }, { 'X', 'X', '.' }, { '.', '.', '.' } };
    LabAssert.Equal(3, SilnikGry.ZnajdzRuchWygrywajacy(p, 'O'));
    LabAssert.Equal('.', p[0, 2]);
    LabAssert.Equal('.', p[1, 2]);

    LabAssert.Equal(6, SilnikGry.ZnajdzRuchWygrywajacy(p, 'X'));
    LabAssert.Equal('.', p[1, 2]);
    LabAssert.Equal('.', p[0, 2]);

    char[,] brak = { { 'X', '.', '.' }, { '.', 'O', '.' }, { '.', '.', '.' } };
    LabAssert.Equal(-1, SilnikGry.ZnajdzRuchWygrywajacy(brak, 'X'));
    LabAssert.Equal('.', brak[0, 1]);
    LabAssert.Equal('.', brak[2, 2]);
});
LabAssert.Test("Bot AI wybiera wygrywajacy ruch (atak ma pierwszenstwo nad blokiem)", () => {
    char[,] p = { { 'O', 'O', '.' }, { 'X', 'X', '.' }, { '.', '.', '.' } };
    LabAssert.Equal(3, SilnikGry.WybierzRuchBota(p, 'O', 'X'));
    LabAssert.Equal('.', p[0, 2]);
    LabAssert.Equal('.', p[1, 2]);
});
LabAssert.Test("Bot AI blokuje wygrana przeciwnika po przekatnej i w wierszu", () => {
    char[,] wiersz = { { 'X', 'X', '.' }, { '.', 'O', '.' }, { '.', '.', '.' } };
    LabAssert.Equal(3, SilnikGry.WybierzRuchBota(wiersz, 'O', 'X'));
    LabAssert.Equal('.', wiersz[0, 2]);

    char[,] przekatna = { { 'X', '.', '.' }, { '.', 'X', '.' }, { 'O', '.', '.' } };
    LabAssert.Equal(9, SilnikGry.WybierzRuchBota(przekatna, 'O', 'X'));
    LabAssert.Equal('.', przekatna[2, 2]);
});
LabAssert.Test("Bot AI zajmuje srodek (5), naroznik, krawedz, a dla pelnej planszy zwraca -1", () => {
    char[,] p1 = SilnikGry.NowaPlansza();
    SilnikGry.WykonajRuch(p1, 1, 'X');
    LabAssert.Equal(5, SilnikGry.WybierzRuchBota(p1, 'O', 'X'));

    char[,] p2 = SilnikGry.NowaPlansza();
    SilnikGry.WykonajRuch(p2, 5, 'X');
    LabAssert.Equal(1, SilnikGry.WybierzRuchBota(p2, 'O', 'X'));

    char[,] sameKrawedzie = { { 'X', '.', 'O' }, { 'O', 'O', 'X' }, { 'X', 'X', 'O' } };
    LabAssert.Equal(2, SilnikGry.WybierzRuchBota(sameKrawedzie, 'O', 'X'));

    char[,] pelna = { { 'X', 'O', 'X' }, { 'X', 'O', 'O' }, { 'O', 'X', 'X' } };
    LabAssert.Equal(-1, SilnikGry.WybierzRuchBota(pelna, 'O', 'X'));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Dlaczego oddzielamy <code>SilnikGry.cs</code> od <code>Program.cs</code>?</strong> Logika gry bez żadnych wywołań `Console` daje się w pełni przetestować automatycznie i pozwala później podpiąć ten sam silnik pod okno graficzne Windows Forms bez przepisywania zasad.
- <strong>Jaka jest właściwa kolejność decyzji bota AI?</strong> Zawsze sprawdzaj najpierw własny atak, potem obronę przed rywalem, następnie środek planszy (4 linie), a na końcu narożniki (3 linie) i krawędzie (2 linie).
- <strong>O czym musisz pamiętać przy ruchu na próbę (make move / unmake move)?</strong> Po sprawdzeniu `CzyWygrana` zawsze przywracaj `p[r, c] = '.';` przed instrukcją `return`, inaczej metoda sprawdzająca zostawi na planszy fałszywy znak.
- <strong>Po co sprawdzamy <code>Console.IsInputRedirected</code> i dodajemy końcowe <code>Console.ReadLine()</code>?</strong> `IsInputRedirected` chroni program przed zawieszeniem w środowisku automatycznym bez klawiatury, a końcowy `ReadLine()` w trybie interaktywnym zatrzymuje okno `TicTacToe.exe` na Windows do czasu naciśnięcia Enter.
