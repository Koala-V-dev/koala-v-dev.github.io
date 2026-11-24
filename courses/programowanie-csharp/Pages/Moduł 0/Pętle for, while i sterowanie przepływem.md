# Pętle for, while i sterowanie przepływem

Wyobraź sobie program, który ma zsumować ceny 500 produktów albo prosić użytkownika o PIN, dopóki nie wpisze poprawnego kodu. Instrukcje `if` i `switch` pozwalają podjąć pojedynczą decyzję, ale nie potrafią same powtórzyć czynności setki razy.

Kopiowanie tego samego kodu 500 razy nie ma sensu. Gdy liczba powtórzeń zależy od danych użytkownika, kopiowanie staje się wręcz niemożliwe. Do rozwiązywania takich zadań służą **pętle**, które wykonują wskazany blok instrukcji wielokrotnie, dopóki spełniony jest warunek logiczny.

---

## 🔄 Pętla for i jej trzy części

Gdy z góry znasz liczbę powtórzeń albo przechodzisz po kolejnych liczbach z zakresu, naturalnym wyborem jest pętla **`for`**. Jej nagłówek składa się z trzech wyrażeń rozdzielonych średnikami:

```csharp
for (inicjalizacja; warunek; krok)
{
    // kod powtarzany w kazdym obiegu (iteracji)
}
```

Komputer wykonuje te trzy części w ściśle określonej kolejności:
1. **Inicjalizacja** uruchamia się dokładnie raz na samym początku pętli. Najczęściej tworzy tu zmienną licznika, na przykład *i*.
2. **Warunek** sprawdza się przed każdym obiegiem. Gdy daje `true`, wykonuje się ciało pętli. Gdy daje `false`, pętla natychmiast się kończy.
3. **Krok** wykonuje się po zakończeniu każdego obiegu, tuż przed ponownym sprawdzeniem warunku.

Pętla `for` nie musi zliczać wyłącznie po jedynce w górę. Możesz odliczać w dół albo przeskakiwać co kilka wartości:

```csharp
// W gore po 1: wypisze 1, 2, 3, 4, 5
for (int i = 1; i <= 5; i++)
{
    Console.Write(i + " ");
}

// W dol po 1: wypisze 5, 4, 3, 2, 1
for (int i = 5; i >= 1; i--)
{
    Console.Write(i + " ");
}

// Co 2: wypisze 0, 2, 4, 6, 8
for (int i = 0; i < 10; i += 2)
{
    Console.Write(i + " ");
}
```

### ⚙️ Operatory złożone w pętlach

Zmiana wartości zmiennej o stałą liczbę powtarza się w niemal każdej pętli. Zamiast pisać za każdym razem `suma = suma + x`, w C# używa się krótszych **operatorów złożonych**:

| Operator | Równoważny zapis | Znaczenie |
| :---: | :---: | --- |
| `i++` | `i = i + 1` | Zwiększ licznik *i* o `1` |
| `i--` | `i = i - 1` | Zmniejsz licznik *i* o `1` |
| `suma += x` | `suma = suma + x` | Dodaj *x* do zmiennej *suma* |
| `saldo -= x` | `saldo = saldo - x` | Odejmij *x* od zmiennej *saldo* |
| `iloczyn *= a` | `iloczyn = iloczyn * a` | Pomnóż *iloczyn* przez *a* |
| `n /= 10` | `n = n / 10` | Podziel całkowitoliczbowo *n* przez `10` |

> [!TIP]
> Zapis `n /= 10` na liczbie typu `int` odcina jej ostatnią cyfrę dziesiętną. Na przykład `472 / 10` daje `47`, potem `4`, a na końcu `0`. W połączeniu z `n % 10` (odczyt ostatniej cyfry) pozwala to rozebrać dowolną liczbę na pojedyncze cyfry.

---

## 🔁 Pętle while i do-while dla nieznanej liczby kroków

Nie zawsze wiesz przed startem, ile powtórzeń będzie potrzebnych. Ile razy musisz podzielić liczbę `47285` przez `10`, zanim spadnie do zera? Albo ile miesięcy zajmie odłożenie `5000` zł po `350` zł miesięcznie?

W takich sytuacjach używasz pętli **`while`**. Sprawdza ona warunek przed każdym obiegiem i działa tak długo, jak długo warunek zwraca `true`:

```csharp
int liczba = 47285;
int liczbaCyfr = 0;

while (liczba > 0)
{
    liczba /= 10;   // odetnij ostatnia cyfre
    liczbaCyfr++;   // policz wykonany krok
}
// Wynik: liczbaCyfr == 5
```

Jeśli warunek pętli `while` jest fałszywy już na starcie (na przykład `liczba == 0`), ciało pętli **nie wykona się ani razu**.

### 🧭 Kiedy potrzebujesz pętli do-while?

Zdarza się, że kod musi wykonać się przynajmniej raz, zanim w ogóle będziesz mieć co sprawdzać. Klasyczny przykład to walidacja danych wpisywanych z klawiatury albo menu konsolowe.

Najpierw musisz wyświetlić pytanie i odczytać odpowiedź przez `Console.ReadLine()`. Dopiero potem możesz sprawdzić, czy użytkownik wpisał poprawną komendę. Pętla **`do-while`** sprawdza warunek na samym końcu obiegu:

```csharp
string wybor;
do
{
    Console.WriteLine("1. Start  2. Opcje  0. Wyjdz");
    wybor = Console.ReadLine();
} while (wybor != "0");
```

Zwróć uwagę na średnik na końcu linii `while (wybor != "0");`. Brak średnika po warunku w `do-while` powoduje błąd kompilacji.

| Pętla | Kiedy wybrać? | Minimum wykonań |
| :---: | --- | :---: |
| `for` | Znasz liczbę powtórzeń lub przedział liczb | `0` |
| `while` | Liczba kroków zależy od warunku na danych | `0` |
| `do-while` | Akcja musi zajść przed sprawdzeniem warunku (menu, odczyt wejścia) | `1` |

---

## 🔬 Diagnostyka typowych błędów pętli

Większość awarii w programach z pętlami wynika z trzech powtarzalnych pomyłek. Zanim uruchomisz kod w głowie, zatrzymaj się przy każdym z poniższych przykładów i spróbuj przewidzieć efekt.

### 🎯 1. Błąd przesunięcia o jeden

Spójrz na poniższą pętlę:

```csharp
for (int i = 0; i <= 5; i++)
{
    Console.Write("*");
}
```

Ponieważ warunek `<=` obejmuje także wartość `5`, pętla wykona się dla `0, 1, 2, 3, 4, 5`, czyli wypisze **6 gwiazdek** zamiast 5. Taka pomyłka o jedną iterację to **_błąd przesunięcia o jeden_**. Gdy startujesz od `0`, używaj warunku `< n` (dla `n` powtórzeń). Gdy startujesz od `1`, używaj `<= n`.

### 🔒 2. Zasięg zmiennej licznika

Przewidź, co powie kompilator C# o poniższym kodzie:

```csharp
for (int i = 1; i <= 3; i++)
{
    Console.WriteLine(i);
}
Console.WriteLine("Koniec przy i = " + i);
```

Ten program **_nie skompiluje się_**. Kompilator zgłosi błąd **_CS0103: Nazwa „i” nie istnieje w bieżącym kontekście_**.

Zmienna zadeklarowana w nagłówku `for (int i = 1; ...)` żyje wyłącznie wewnątrz klamr tej pętli. Za zamykającą klamrą przestaje istnieć. Jeśli potrzebujesz jej wartości po wyjściu z pętli, zadeklaruj ją przed pętlą `for`.

### ♾️ 3. Pętla nieskończona

Co się stanie, gdy uruchomisz poniższe dwa fragmenty? Znajdź błąd w każdym z nich:

```csharp
// Przyklad 1
int krok = 1;
while (krok <= 5)
{
    Console.WriteLine("Krok: " + krok);
}
```

```csharp
// Przyklad 2
for (int i = 1; i != 10; i += 2)
{
    Console.WriteLine(i);
}
```

W pierwszym przykładzie zabrakło instrukcji `krok++` wewnątrz pętli. Zmienna *krok* zawsze ma wartość `1`, więc warunek `krok <= 5` nigdy nie stanie się fałszywy. Program zawiesi się w **_pętli nieskończonej_**.

W drugim przykładzie licznik *i* przyjmuje kolejno wartości `1, 3, 5, 7, 9, 11, 13...`. Przeskakuje liczbę `10`, więc warunek `i != 10` pozostaje prawdziwy (aż do przepełnienia typu `int`).

> [!WARNING]
> W warunku zatrzymania pętli unikaj operatora `!=` dla liczb zmieniających się skokowo. Bezpieczniej jest pisać `i < 10` lub `i <= 10`, bo nawet przy przeskoczeniu progu pętla zatrzyma się poprawnie.

<data-csharp-loop-tracer></data-csharp-loop-tracer>

---

## 🧩 Cztery fundamentalne wzorce iteracyjne

Prawie każda pętla w prawdziwych aplikacjach realizuje jeden z czterech prostych wzorców. Zamiast wymyślać logikę od zera, rozpoznaj wzorzec i dopasuj do niego zmienne.

### ➕ 1. Akumulator (sumowanie i mnożenie)

**Akumulator** to zmienna zadeklarowana przed pętlą, która zbiera częściowe wyniki z kolejnych obiegów. Kluczowa jest jej wartość początkowa:
- dla dodawania zaczynasz od **`0`** (element neutralny dodawania),
- dla mnożenia zaczynasz od **`1`** (gdybyś zaczął od `0`, każdy iloczyn dałby **_zero_**!).

```csharp
int suma = 0;
int iloczyn = 1;

for (int i = 1; i <= 4; i++)
{
    suma += i;
    iloczyn *= i;
}
```

| Obieg | Wartość *i* | *suma* po kroku | *iloczyn* po kroku |
| :---: | :---: | :---: | :---: |
| start | brak | `0` | `1` |
| 1 | `1` | `1` | `1` |
| 2 | `2` | `3` | `2` |
| 3 | `3` | `6` | `6` |
| 4 | `4` | `10` | `24` |

### 🔢 2. Licznik warunkowy

**Licznik warunkowy** zlicza, ile elementów spełniło określony warunek. Zawsze startuje od `0` i rośnie o `1` wyłącznie wewnątrz `if`:

```csharp
int podzielnePrzez3 = 0;

for (int i = 1; i <= 10; i++)
{
    if (i % 3 == 0)
    {
        podzielnePrzez3++;
    }
}
// Wynik: 3 (dla liczb 3, 6, 9)
```

### 📊 3. Szukanie minimum i maksimum

Gdy szukasz najmniejszej lub największej wartości w serii danych, najczęstszym błędem jest wpisanie `int min = 0;`. Jeśli wszystkie dane są dodatnie (na przykład temperatury `12, 18, 9`), wynikiem błędnie zostanie `0`.

Bezpieczne podejście to zainicjalizowanie zmiennej *min* wartością `int.MaxValue` (albo pierwszym elementem serii), a zmiennej *max* wartością `int.MinValue`:

```csharp
int min = int.MaxValue;
int max = int.MinValue;

for (int i = 1; i <= 3; i++)
{
    int odczyt = i * 15; // przykladowe dane: 15, 30, 45
    if (odczyt < min) min = odczyt;
    if (odczyt > max) max = odczyt;
}
// Wynik: min == 15, max == 45
```

### 🚩 4. Flaga boolowska w pętli

Często musisz sprawdzić, czy wśród wielu danych wystąpiła **przynajmniej jedna** wartość spełniająca warunek (na przykład czy hasło zawiera cyfrę albo czy liczba zawiera siódemkę). Do tego służy _**flaga boolowska**_.

Zaczynasz od `bool znaleziono = false;` przed pętlą. Wewnątrz pętli zmieniasz flagę na `true`, gdy warunek zadziała.

```csharp
bool maPodzielnaPrzez7 = false;

for (int i = 10; i <= 15; i++)
{
    if (i % 7 == 0)
    {
        maPodzielnaPrzez7 = true;
    }
}
```

| Obieg | Wartość *i* | `i % 7 == 0` | *maPodzielnaPrzez7* |
| :---: | :---: | :---: | :---: |
| 1 | `10` | `false` | `false` |
| 2 | `11` | `false` | `false` |
| 3 | `12` | `false` | `false` |
| 4 | `13` | `false` | `false` |
| 5 | `14` | `true` | **`true`** |
| 6 | `15` | `false` | **`true`** (bez zmiany!) |

> [!IMPORTANT]
> Nigdy nie dopisuj gałęzi `else { znaleziono = false; }` we wzorcu flagi boolowskiej. Taki zapis skasowałby zapamiętane trafienie w kolejnej iteracji i wynik zależałby wyłącznie od ostatniego elementu.

---

## 🚦 Sterowanie przepływem: break, continue i wczesny return

Czasem nie chcesz czekać na naturalne zakończenie pętli albo chcesz pominąć pojedynczy niepasujący element. Masz do dyspozycji trzy instrukcje:

- **`continue`** przerywa tylko bieżący obieg. Komputer pomija resztę kodu wewnątrz pętli i od razu przechodzi do sekcji kroku (w `for`) lub sprawdzenia warunku (w `while`).
- **`break`** natychmiast kończy całą pętlę. Program przechodzi do pierwszej instrukcji za zamykającą klamrą pętli.
- **Wczesny `return`** kończy nie tylko pętlę, ale całą metodę i od razu oddaje wynik wywołującemu.

```csharp
// Przyklad: sumowanie dodatnich, pomijanie parzystych, stop przy 9
int suma = 0;
for (int i = 1; i <= 12; i++)
{
    if (i % 2 == 0) continue; // pomin 2, 4, 6, 8
    if (i == 9) break;        // zakoncz petle przy 9
    suma += i;                // dolicz 1, 3, 5, 7 -> suma == 16
}
```

Gdy szukasz czegoś w pętli wewnątrz metody i już znalazłeś odpowiedź, wczesny `return true;` oszczędza dalsze niepotrzebne obiegi.

<data-gate>
<data-connection-matcher title="Dopasuj narzędzie iteracyjne do scenariusza">
  <item left="Pętla for" right="Wypisz kwadraty kolejnych liczb od 1 do 20"></item>
  <item left="Pętla while" right="Dziel liczbę przez 10, dopóki jest większa od zera"></item>
  <item left="Pętla do-while" right="Wyświetlaj menu i pytaj o komendę, aż użytkownik wpisze 0"></item>
  <item left="Instrukcja continue" right="Pomiń bieżący element ujemny i przejdź do kolejnego kroku"></item>
  <item left="Instrukcja break" right="Natychmiast przerwij przeszukiwanie po znalezieniu błędu"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Jak procesor wykonuje pętle (DEC/JNZ, Loop Unrolling i SIMD AVX2)</span>
<span class="deep-dive-badge">X86-64 · ASEMBLER · SIMD AVX2</span>
</summary>
<div class="deep-dive-content">

<h4>1. Pętla z perspektywy procesora</h4>

Procesor nie zna słów kluczowych `for` ani `while`. Kompilator C# i środowisko uruchomieniowe JIT tłumaczą każdą pętlę na zwykłe porównanie oraz instrukcję skoku warunkowego w górę pamięci kodu:

```asm
L_loop:
    add eax, [rsi + rcx*4]  ; dodaj kolejny element tablicy
    dec rcx                 ; zmniejsz licznik o 1 i ustaw flage zera ZF
    jnz L_loop              ; skocz do L_loop, dopoki licznik != 0
```

Instrukcje `break` i `continue` również zamieniają się w proste skoki bezwarunkowe `jmp`: `continue` skacze do etykiety sekcji kroku, a `break` do adresu tuż za pętlą.

<h4>2. Rozwijanie pętli (Loop Unrolling)</h4>

Każdy obieg prostej pętli wymaga wykonania instrukcji sterujących: zmiany licznika i skoku warunkowego. Jeśli ciało pętli zawiera tylko jedno dodawanie, procesor marnuje sporą część cykli na samo sterowanie pętlą.

Nowoczesne kompilatory optymalizujące powielają ciało pętli na przykład czterokrotnie wewnątrz jednego obiegu i zwiększają licznik o 4 (`i += 4`). Zmniejsza to liczbę skoków czterokrotnie i pozwala jednostkom obliczeniowym procesora wykonywać niezależne operacje równolegle.

<h4>3. Wektoryzacja SIMD AVX2</h4>

Zamiast dodawać jedną 32-bitową liczbę `int` naraz w rejestrze `EAX`, procesory x86-64 z rozszerzeniem **AVX2** potrafią załadować **8 liczb int jednocześnie** do jednego 256-bitowego rejestru wektorowego `YMM0` i dodać je w pojedynczym cyklu zegara:

```asm
vmovdqu ymm0, [rsi]         ; wczytaj 8 liczb int (32 bajty) naraz
vpaddd  ymm0, ymm0, [rdi]   ; dodaj 8 par liczb int w jednym cyklu CPU
vmovdqu [rdx], ymm0         ; zapisz 8 wynikow z powrotem do RAM
```

W nowoczesnym .NET identyczną moc sprzętową można wykorzystać bezpośrednio z C# za pomocą klasy `System.Numerics.Vector<int>`. Przy przetwarzaniu milionów liczb daje to przyspieszenie sięgające niemal ośmiokrotności bez zmiany taktowania procesora.

</div>
</details>

---

## 💻 Zadanie praktyczne: Analizator danych i symulator oszczędzania

Zaimplementuj trzy metody statyczne w klasie **`AnalizatorDanych`**:

1. **`SumaNieparzystych(int od, int doKonca)`**:
   - zsumuj wszystkie liczby **nieparzyste** z przedziału domkniętego od *od* do *doKonca*,
   - wewnątrz pętli `for` użyj instrukcji **`continue`**, aby pominąć liczby parzyste (`if (i % 2 == 0) continue;` działa poprawnie także dla liczb ujemnych, bo w C# `-3 % 2` wynosi `-1`, nie `1`),
   - dla `od > doKonca` zwróć `0`.
2. **`IleMiesiecyDoCelu(int wplataMiesieczna, int cel)`**:
   - oblicz w pętli **`while`**, po ilu miesiącach regularnego odkładania kwoty *wplataMiesieczna* suma oszczędności osiągnie lub przekroczy *cel*,
   - jeśli `cel <= 0`, zwróć `0`,
   - jeśli `wplataMiesieczna <= 0` (przy dodatnim celu), zwróć **`-1`**, aby uniknąć **_pętli nieskończonej_**.
3. **`CzyZawieraCyfre(int liczba, int szukanaCyfra)`**:
   - sprawdź, czy zapis dziesiętny liczby *liczba* zawiera cyfrę *szukanaCyfra* (z zakresu `0..9`),
   - rozkładaj liczbę na cyfry za pomocą `% 10` (odczyt ostatniej cyfry) i `/ 10` (odcięcie ostatniej cyfry),
   - obsłuż liczby ujemne (na przykład przez zamianę na dodatnią: jeśli `liczba < 0`, weź `-liczba`) oraz przypadek brzegowy `liczba == 0`,
   - użyj wzorca **flagi boolowskiej** lub wczesnego `return`.

<data-gate>
<data-csharp-lab title="Zadanie: Analizator danych (for, while, continue, flaga boolowska)" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class AnalizatorDanych
{
    public static int SumaNieparzystych(int od, int doKonca)
    {
        // TODO: Zsumuj liczby nieparzyste z [od, doKonca], pomijajac parzyste przez continue
        return 0;
    }

    public static int IleMiesiecyDoCelu(int wplataMiesieczna, int cel)
    {
        // TODO: Obsluz cel <= 0 (zwroc 0) oraz wplataMiesieczna <= 0 (zwroc -1)
        // Policz miesiace w petli while
        return -1;
    }

    public static bool CzyZawieraCyfre(int liczba, int szukanaCyfra)
    {
        // TODO: Obsluz liczba == 0 oraz liczby ujemne
        // Rozkladaj liczbe operacjami % 10 i / 10, uzyj flagi boolowskiej
        return false;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("Suma nieparzystych [1..10]: " + AnalizatorDanych.SumaNieparzystych(1, 10));
        Console.WriteLine("Miesiace do 1000 zl (po 350 zl): " + AnalizatorDanych.IleMiesiecyDoCelu(350, 1000));
        Console.WriteLine("Czy 4728 zawiera 7: " + AnalizatorDanych.CzyZawieraCyfre(4728, 7));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("SumaNieparzystych poprawnie sumuje przedzialy dodatnie, ujemne i puste", () => {
    LabAssert.Equal(25, AnalizatorDanych.SumaNieparzystych(1, 10));
    LabAssert.Equal(15, AnalizatorDanych.SumaNieparzystych(3, 7));
    LabAssert.Equal(5, AnalizatorDanych.SumaNieparzystych(5, 5));
    LabAssert.Equal(0, AnalizatorDanych.SumaNieparzystych(4, 4));
    LabAssert.Equal(0, AnalizatorDanych.SumaNieparzystych(10, 1));
    LabAssert.Equal(-3, AnalizatorDanych.SumaNieparzystych(-3, 2));
});
LabAssert.Test("IleMiesiecyDoCelu liczy miesiace i chroni przed petla nieskonczona", () => {
    LabAssert.Equal(3, AnalizatorDanych.IleMiesiecyDoCelu(350, 1000));
    LabAssert.Equal(4, AnalizatorDanych.IleMiesiecyDoCelu(250, 1000));
    LabAssert.Equal(1, AnalizatorDanych.IleMiesiecyDoCelu(1500, 1000));
    LabAssert.Equal(0, AnalizatorDanych.IleMiesiecyDoCelu(350, 0));
    LabAssert.Equal(0, AnalizatorDanych.IleMiesiecyDoCelu(350, -50));
    LabAssert.Equal(-1, AnalizatorDanych.IleMiesiecyDoCelu(0, 1000), "Przy wplacie 0 nalezy zwrocic -1");
    LabAssert.Equal(-1, AnalizatorDanych.IleMiesiecyDoCelu(-100, 1000), "Przy ujemnej wplacie nalezy zwrocic -1");
});
LabAssert.Test("CzyZawieraCyfre poprawnie wykrywa cyfry w liczbach dodatnich, ujemnych i zerze", () => {
    LabAssert.True(AnalizatorDanych.CzyZawieraCyfre(4728, 7));
    LabAssert.True(AnalizatorDanych.CzyZawieraCyfre(7000, 7));
    LabAssert.True(AnalizatorDanych.CzyZawieraCyfre(1237, 7));
    LabAssert.False(AnalizatorDanych.CzyZawieraCyfre(123456, 7));
    LabAssert.True(AnalizatorDanych.CzyZawieraCyfre(-9072, 7), "Liczba ujemna -9072 zawiera cyfre 7");
    LabAssert.True(AnalizatorDanych.CzyZawieraCyfre(0, 0), "Liczba 0 zawiera cyfre 0");
    LabAssert.False(AnalizatorDanych.CzyZawieraCyfre(0, 7), "Liczba 0 nie zawiera cyfry 7");
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- Wybieraj `for` dla znanego zakresu licznika, `while` dla nieznanej liczby kroków oraz `do-while`, gdy kod musi wykonać się co najmniej raz przed sprawdzeniem warunku.
- Unikaj błędu przesunięcia o jeden: przy starcie od `0` stosuj `< n`, a przy starcie od `1` stosuj `<= n`; w warunkach zatrzymania wybieraj `<` lub `<=` zamiast ryzykownego `!=`.
- We wzorcu akumulatora zaczynaj sumowanie od `0`, a mnożenie od `1`; w szukaniu minimum startuj od `int.MaxValue` lub pierwszego elementu, nigdy od `0`.
- We wzorcu flagi boolowskiej ustawiaj `znaleziono = true;` po trafieniu i nigdy nie resetuj jej do `false` w gałęzi `else`.
