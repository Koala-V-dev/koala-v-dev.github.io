# Pętle zagnieżdżone i algorytmy liczbowe

Sprawdźmy w myślach, czy liczba `2 147 483 647` jest pierwsza. Jeśli napiszesz prostą pętlę `for` sprawdzającą wszystkie dzielniki od `2` do `2 147 483 646`, procesor wykona ponad dwa miliardy dzieleń i zawiesi program na kilka sekund.

Gdy spróbujesz przyspieszyć tę pętlę szkolnym warunkiem `d * d <= n`, wydarzy się coś jeszcze gorszego. Program nie zakończy się szybciej: wpadnie w **_przepełnienie typu int_** i po kilku miliardach błędnych kroków wyrzuci awarię **_DivideByZeroException_**. To moment, w którym samo pisanie pętli przestaje wystarczać, a zaczyna się projektowanie algorytmów.

---

## 🧱 Pętle zagnieżdżone i koszt kwadratowy

Jedną pętlę możesz umieścić wewnątrz drugiej. Taki układ nazywamy **pętlą zagnieżdżoną**. Pętla zewnętrzna steruje zazwyczaj wierszami, a pętla wewnętrzna kolumnami w danym wierszu.

Dla każdego **jednego** obrotu pętli zewnętrznej pętla wewnętrzna wykonuje **wszystkie** swoje kroki od początku do końca:

```csharp
for (int wiersz = 1; wiersz <= 3; wiersz++)
{
    for (int kolumna = 1; kolumna <= 3; kolumna++)
    {
        Console.Write((wiersz * kolumna) + "\t");
    }
    Console.WriteLine();
}
```

Prześledź kolejność wartości obu liczników w pierwszych sześciu krokach:

| Krok łączny | *wiersz* (zewnętrzna) | *kolumna* (wewnętrzna) | Wypisany iloczyn |
| :---: | :---: | :---: | :---: |
| 1 | `1` | `1` | `1` |
| 2 | `1` | `2` | `2` |
| 3 | `1` | `3` | `3` |
| 4 | `2` | `1` | `2` |
| 5 | `2` | `2` | `4` |
| 6 | `2` | `3` | `6` |

### 📐 Animacja pętli zagnieżdżonej 2D i granicy zależnej

Zamiast liczyć kroki na kartce, przełącz wszystkie trzy tryby poniżej (pełna siatka `n × n`, unikalne pary `b = a + 1` oraz trójkąt `j <= i`) i obejrzyj animację kolejności wykonań oraz łączną liczbę kroków:

<data-gate>
<data-csharp-nested-loop-viz></data-csharp-nested-loop-viz>
</data-gate>

### ⏱️ Dlaczego zagnieżdżone pętle szybko zwalniają?

Jeśli obie pętle wykonują po *n* kroków, wnętrze wewnętrznej pętli wykona się **$n \times n$ razy**. Taki wzrost nazywamy **kosztem kwadratowym**:

| Rozmiar danych *n* | Pojedyncza pętla (*n*) | Pętla zagnieżdżona ($n \times n$) |
| :---: | :---: | :---: |
| `10` | `10` kroków | `100` kroków |
| `100` | `100` kroków | `10 000` kroków |
| `1 000` | `1 000` kroków | `1 000 000` kroków |
| `100 000` | `100 000` kroków | **_10 000 000 000 kroków_** |

Dziesięciokrotny wzrost danych wydłuża czas pracy pętli zagnieżdżonej aż **stukrotnie**.

> [!WARNING]
> Instrukcja `break` umieszczona w pętli wewnętrznej przerywa **wyłącznie pętlę wewnętrzną**. Pętla zewnętrzna nadal przechodzi do kolejnego wiersza. Dodatkowo nie używaj tej samej nazwy licznika *i* w obu pętlach: kompilator C# odrzuci taki kod jako błąd zasięgu zmiennej.

---

## 🧮 Algorytm Euklidesa (NWD)

Największy wspólny dzielnik dwóch liczb całkowitych *a* i *b* (w skrócie **NWD**) można szukać naiwnie, sprawdzając wszystkie liczby w dół od mniejszej z nich. Dla liczb rzędu miliarda zajęłoby to miliard dzieleń.

Starożytny **algorytm Euklidesa** opiera się na prostej własności matematycznej zwanej _**niezmiennikiem**_: największy wspólny dzielnik nie zmienia się, gdy większą liczbę zastąpimy resztą z dzielenia `a % b`.

$$NWD(a, b) = NWD(b, a \bmod b)$$

Powtarzasz tę podmianę tak długo, aż *b* spadnie do zera. Wtedy wynik siedzi w zmiennej *a*.

<data-euclid-modern a="100" b="30"></data-euclid-modern>

Zobacz ślad kroków dla dwóch różnych par:

| Krok | Para `(a, b)` dla `(100, 30)` | Reszta `a % b` | Para `(a, b)` dla `(18, 48)` | Reszta `a % b` |
| :---: | :---: | :---: | :---: | :---: |
| start | `(100, 30)` | `10` | `(18, 48)` | `18` |
| 1 | `(30, 10)` | `0` | `(48, 18)` | `12` |
| 2 | `(10, 0)` | stop, NWD = `10` | `(18, 12)` | `6` |
| 3 | brak | brak | `(12, 6)` | `0` |
| 4 | brak | brak | `(6, 0)` | stop, NWD = `6` |

Zwróć uwagę na parę `(18, 48)`, gdzie pierwsza liczba jest mniejsza od drugiej. Ponieważ `18 % 48` daje `18`, pierwszy krok sam zamienia liczby miejscami na `(48, 18)`. Nie musisz dopisywać żadnego `if` zamieniającego argumenty.

Aby przełożyć ten schemat na pętlę `while (b != 0)` w C#, w każdym obiegu wykonaj dokładnie trzy przypisania:
1. Oblicz resztę `a % b` i zapisz ją w zmiennej pomocniczej *reszta*.
2. Przepisz wartość *b* do *a*.
3. Przepisz wartość *reszta* do *b*.

Po zakończeniu pętli `while` zwróć zmienną *a*.

---

## 🛡️ Test pierwszości i błąd przepełnienia kwadratu

Liczba całkowita *n* jest **liczbą pierwszą**, gdy jest większa od `1` i dzieli się bez reszty wyłącznie przez `1` oraz przez samą siebie. Liczby mniejsze od `2` (wszystkie ujemne, `0` oraz `1`) z definicji **nie są pierwsze**.

Dlaczego nie trzeba sprawdzać dzielników aż do `n - 1`? Spójrz na wszystkie pary dzielników liczby złożonej `36` (jej pierwiastek wynosi `6`):

- `2 × 18 = 36`
- `3 × 12 = 36`
- `4 × 9 = 36`
- `6 × 6 = 36`

W każdej parze co najmniej jeden dzielnik jest mniejszy lub równy $\sqrt{n}$. Jeśli żaden dzielnik z przedziału od `2` do $\sqrt{n}$ nie dzieli *n*, to żaden większy też jej nie podzieli.

### 🔎 Przewidź, co zrobi komputer dla int.MaxValue

Zatrzymaj się i przeanalizuj poniższą pętlę dla największej liczby typu `int`, czyli `n = 2 147 483 647` (to słynna liczba pierwsza Mersenne'a, $2^{31} - 1$, której pierwiastek wynosi około `46340,95`):

```csharp
// NIEBEZPIECZNA WERSJA!
for (int d = 2; d * d <= n; d++)
{
    if (n % d == 0) return false;
}
```

Co obliczy procesor w kroku, gdy *d* wzrośnie z `46340` do `46341`?

1. Dla `d = 46340` iloczyn `46340 * 46340 = 2 147 395 600`. Mieści się w `int` i jest mniejszy od *n*. Pętla robi `d++`.
2. Dla `d = 46341` matematyczny kwadrat wynosi `2 147 488 281`. Przekracza zakres `int.MaxValue` (`2 147 483 647`) o `4634`.
3. W domyślnym trybie `unchecked` wynik zawija się na drugą stronę osi liczbowej do **_-2 147 479 015_**.
4. Komputer sprawdza warunek `-2 147 479 015 <= 2 147 483 647`. To jest **prawda**!

Pętla nie zatrzymuje się przy pierwiastku. Zmienna *d* rośnie dalej przez kolejne dwa miliardy liczb, aż sama się przepełni, przeskoczy na liczby ujemne i dotrze do `d = 0`. Wtedy dzielenie `n % 0` zabija program wyjątkiem **_DivideByZeroException_**.

### ✅ Bezpieczny warunek dzielący

Zamiast mnożyć `d * d <= n`, przenieś jedno *d* na drugą stronę nierówności i zapisz warunek pętli `for` jako **`d <= n / d`**.

Ten zapis nigdy nie przekroczy zakresu `int`. Dla `n = 2 147 483 647` i `d = 46341` komputer oblicza `2147483647 / 46341 = 46340`. Warunek `46341 <= 46340` daje `false` i pętla zatrzymuje się w ułamku milisekundy.

Sprawdź jeszcze dwa przypadki brzegowe zanim napiszesz własną metodę:
- dla dowolnego `n < 2` (liczby ujemne, `0` oraz `1`) od razu zwróć `false`,
- dla `n = 2` pętla startuje od `d = 2`, a `2 / 2 = 1`, więc warunek `2 <= 1` jest fałszywy już na starcie i po pętli zwracasz `true`.

<data-gate>
<data-connection-matcher title="Dopasuj konstrukcję algorytmiczną do jej zachowania w czasie działania">
  <item left="for (int d = 2; d * d <= n; d++) dla int.MaxValue" right="Przepełnienie int i zawinięcie do liczby ujemnej (DivideByZeroException)"></item>
  <item left="for (int d = 2; d <= n / d; d++)" right="Bezpieczny test pierwszości do pierwiastka bez przepełnienia int"></item>
  <item left="while (b != 0) { r = a % b; a = b; b = r; }" right="Algorytm Euklidesa: maks. 45 kroków w całym zakresie int"></item>
  <item left="for (int a = 1; a <= n; a++) for (int b = a + 1; b <= n; b++)" right="Przeszukuje wyłącznie unikalne pary bez powtórzeń (a < b)"></item>
</data-connection-matcher>
</data-gate>

---

## ⚡ Porównanie liczby kroków w praktyce

Po poznaniu obu algorytmów porównaj, ile pracy oszczędzasz procesorowi w porównaniu z naiwną pętlą:

| Problem dla dużych danych | Naiwna pętla | Przemyślany algorytm | Zysk |
| --- | --- | --- | --- |
| Czy `1 000 000 007` jest pierwsza? | `1 000 000 005` dzieleń (`d < n`) | `31 622` dzielenia (`d <= n / d`) | **31 623 razy mniej pracy** |
| Czy `2 147 483 647` jest pierwsza? | `2 147 483 645` dzieleń | `46 339` dzieleń (`d <= n / d`) | **46 341 razy mniej pracy** |
| NWD dowolnych liczb z zakresu `int` | Do `2 000 000 000` kroków | Maksymalnie `44` lub `45` kroków (Euklides) | **Ponad 40 milionów razy szybciej** |

### 🔗 Od NWD do bezpiecznego NWW

Mając gotowy algorytm Euklidesa, możesz błyskawicznie policzyć **Najmniejszą Wspólną Wielokrotność** (NWW) dwóch nieujemnych liczb *a* i *b*:

$$NWW(a, b) = \frac{a}{NWD(a, b)} \cdot b$$

Zwróć uwagę na kolejność operacji. Gdybyś najpierw pomnożył `a * b` jako `int`, dla dużych liczb (na przykład `100 000` i `99 999`) iloczyn natychmiast wywołałby **_przepełnienie typu int_**.

Dlatego w C# najpierw dzielimy przez *nwd*, a dopiero potem mnożymy w 64-bitowym typie `long`: `(long)(a / nwd) * b`. Jeśli którakolwiek z liczb *a* lub *b* wynosi `0`, ich NWW wynosi po prostu `0L`.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Twierdzenie Lamégo, koszt DIV kontra MUL oraz szybkie potęgowanie binarne</span>
<span class="deep-dive-badge">TEORIA LICZB · X86-64 · POTĘGOWANIE BINARNE</span>
</summary>
<div class="deep-dive-content">

<h4>1. Twierdzenie Lamégo i rekordowe pary Fibonacciego</h4>

W 1844 roku francuski matematyk Gabriel Lamé udowodnił, jaka para liczb zmusza algorytm Euklidesa do wykonania największej możliwej liczby kroków. Najgorszy przypadek zachodzi wtedy, gdy w każdym dzieleniu iloraz wynosi dokładnie `1`, czyli reszta maleje najwolniej jak to matematycznie możliwe.

Ten warunek spełniają dwie kolejne **liczby Fibonacciego**:

```text
NWD(13, 8) -> NWD(8, 5) -> NWD(5, 3) -> NWD(3, 2) -> NWD(2, 1) -> NWD(1, 0)
```

Ponieważ liczby Fibonacciego rosną wykładniczo, twierdzenie Lamégo gwarantuje, że liczba iteracji algorytmu Euklidesa nigdy nie przekroczy pięciokrotności liczby cyfr dziesiętnych mniejszej z liczb. W całym zakresie 32-bitowego typu `int` rekord dla pary `1 836 311 903` oraz `1 134 903 170` wynosi dokładnie **44 iteracje** (lub **45**, gdy mniejsza liczba zostanie podana jako pierwsza).

<h4>2. Koszt instrukcji DIV kontra MUL w procesorze x86-64</h4>

Na poziomie krzemu mnożenie całkowite (`IMUL`) trwa w nowoczesnych rdzeniach x86-64 około **3 cykli zegara**. Dzielenie całkowite (`IDIV`) jest znacznie bardziej złożone i zajmuje od **12 do 26 cykli**.

W teście pierwszości zapis `d <= n / d` wykonuje dzielenie w każdym kroku pętli, ale ratuje przed **_przepełnieniem_** w 32-bitowym `int`. Co ciekawe, procesor oblicza iloraz `n / d` oraz resztę `n % d` jedną wspólną instrukcją `IDIV`, więc kompilator JIT potrafi wykorzystać oba wyniki jednocześnie! Jeśli zależy Ci na czystym mnożeniu bez ryzyka przepełnienia dla 32-bitowego *n*, możesz też trzymać licznik *d* w 64-bitowym typie `long` i wtedy zapisać `d * d <= n`.

<h4>3. Szybkie potęgowanie binarne dla ambitnych</h4>

Jak policzyć $3^{13}$ w zaledwie 4 krokach zamiast 13 mnożeń? Zapisz wykładnik `13` w systemie binarnym: $13 = 8 + 4 + 1$ (czyli `1101`). Wtedy:

$$3^{13} = 3^8 \cdot 3^4 \cdot 3^1$$

W każdym kroku pętli `while (wykladnik > 0)` sprawdzasz ostatni bit wykładnika (`wykladnik % 2 == 1`). Gdy wynosi `1`, domnażasz bieżącą potęgę do wyniku. Następnie podnosisz podstawę do kwadratu i dzielisz wykładnik całkowicie przez `2`:

```csharp
long wynik = 1;
while (wykladnik > 0)
{
    if (wykladnik % 2 == 1) wynik *= podstawa;
    podstawa *= podstawa;
    wykladnik /= 2;
}
```

Dla wykładnika równego miliard pętla wykonuje zaledwie **30 iteracji** zamiast miliarda mnożeń. Ta technika jest fundamentem nowoczesnej kryptografii klucza publicznego (RSA).

</div>
</details>

---

## 💻 Zadanie praktyczne: Biblioteka algorytmów liczbowych

Zaimplementuj cztery metody statyczne w klasie **`AlgorytmyLiczbowe`**:

1. **`ObliczNwd(int a, int b)`**:
   - oblicz największy wspólny dzielnik nieujemnych liczb *a* i *b* algorytmem Euklidesa w pętli `while (b != 0)`.
2. **`CzyPierwsza(int n)`**:
   - dla `n < 2` zwróć `false`,
   - sprawdź dzielniki w pętli `for` z bezpiecznym warunkiem **`d <= n / d`** (testy weryfikują m.in. `2147483647`).
3. **`ObliczNww(int a, int b)`**:
   - dla `a == 0 || b == 0` zwróć `0L`,
   - w przeciwnym razie wykorzystaj własną metodę `ObliczNwd(a, b)` i oblicz wynik bez ryzyka przepełnienia: **`(long)(a / nwd) * b`**.
4. **`IleParWzgledniePierwszych(int n)`**:
   - użyj **pętli zagnieżdżonej** z zależną granicą (`1 <= a < b <= n`, czyli `for (int a = 1; a <= n; a++)` oraz `for (int b = a + 1; b <= n; b++)`),
   - policz, ile unikalnych par `(a, b)` jest względnie pierwszych, czyli spełnia warunek `ObliczNwd(a, b) == 1` (dla `n < 2` zwróć `0`).

<data-gate>
<data-csharp-lab title="Zadanie: Biblioteka algorytmów liczbowych (NWD, Pierwszość, NWW, Pętle zagnieżdżone)" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class AlgorytmyLiczbowe
{
    public static int ObliczNwd(int a, int b)
    {
        // TODO: Zaimplementuj algorytm Euklidesa w petli while (b != 0)
        return 0;
    }

    public static bool CzyPierwsza(int n)
    {
        // TODO: Dla n < 2 zwroc false; sprawdz dzielniki z bezpiecznym warunkiem d <= n / d
        return false;
    }

    public static long ObliczNww(int a, int b)
    {
        // TODO: Obsluz a == 0 lub b == 0 (zwroc 0L)
        // Uzyj ObliczNwd(a, b) i wzoru (long)(a / nwd) * b bez przepelnienia int
        return 0L;
    }

    public static int IleParWzgledniePierwszych(int n)
    {
        // TODO: Uzyj petli zagniezdzonej 1 <= a < b <= n i policz pary z ObliczNwd(a, b) == 1
        return 0;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("NWD(100, 30) = " + AlgorytmyLiczbowe.ObliczNwd(100, 30));
        Console.WriteLine("Czy 97 pierwsza = " + AlgorytmyLiczbowe.CzyPierwsza(97));
        Console.WriteLine("NWW(12, 18) = " + AlgorytmyLiczbowe.ObliczNww(12, 18));
        Console.WriteLine("Pary wzglednie pierwsze do 4 = " + AlgorytmyLiczbowe.IleParWzgledniePierwszych(4));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("ObliczNwd dziala poprawnie dla roznych par liczb, odwrotnej kolejnosci i zera", () => {
    LabAssert.Equal(10, AlgorytmyLiczbowe.ObliczNwd(100, 30));
    LabAssert.Equal(6, AlgorytmyLiczbowe.ObliczNwd(18, 48));
    LabAssert.Equal(1, AlgorytmyLiczbowe.ObliczNwd(17, 31));
    LabAssert.Equal(42, AlgorytmyLiczbowe.ObliczNwd(42, 0));
    LabAssert.Equal(1, AlgorytmyLiczbowe.ObliczNwd(1836311903, 1134903170));
});
LabAssert.Test("CzyPierwsza poprawnie klasyfikuje liczby male, zlozone oraz int.MaxValue", () => {
    LabAssert.False(AlgorytmyLiczbowe.CzyPierwsza(-5));
    LabAssert.False(AlgorytmyLiczbowe.CzyPierwsza(0));
    LabAssert.False(AlgorytmyLiczbowe.CzyPierwsza(1));
    LabAssert.True(AlgorytmyLiczbowe.CzyPierwsza(2));
    LabAssert.True(AlgorytmyLiczbowe.CzyPierwsza(97));
    LabAssert.False(AlgorytmyLiczbowe.CzyPierwsza(121));
    LabAssert.True(AlgorytmyLiczbowe.CzyPierwsza(2147483647), "int.MaxValue jest liczba pierwsza - uzyj warunku d <= n / d");
});
LabAssert.Test("ObliczNww poprawnie oblicza NWW dla zera, liczb malych oraz duzych bez przepelnienia int", () => {
    LabAssert.Equal(0L, AlgorytmyLiczbowe.ObliczNww(0, 15));
    LabAssert.Equal(0L, AlgorytmyLiczbowe.ObliczNww(15, 0));
    LabAssert.Equal(36L, AlgorytmyLiczbowe.ObliczNww(12, 18));
    LabAssert.Equal(21L, AlgorytmyLiczbowe.ObliczNww(3, 7));
    LabAssert.Equal(9999900000L, AlgorytmyLiczbowe.ObliczNww(100000, 99999), "Dla duzych liczb dziel przed mnozeniem i zwroc long");
});
LabAssert.Test("IleParWzgledniePierwszych poprawnie zlicza pary w petli zagniezdzonej", () => {
    LabAssert.Equal(0, AlgorytmyLiczbowe.IleParWzgledniePierwszych(1));
    LabAssert.Equal(1, AlgorytmyLiczbowe.IleParWzgledniePierwszych(2));
    LabAssert.Equal(5, AlgorytmyLiczbowe.IleParWzgledniePierwszych(4));
    LabAssert.Equal(9, AlgorytmyLiczbowe.IleParWzgledniePierwszych(5));
    LabAssert.Equal(11, AlgorytmyLiczbowe.IleParWzgledniePierwszych(6));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- Pętle zagnieżdżone mają koszt kwadratowy $n \times n$: przed zagnieżdżeniem pętli oszacuj rozmiar danych, a pamiętaj, że `break` przerywa wyłącznie najbliższą pętlę.
- Algorytm Euklidesa wyznacza NWD w pętli `while (b != 0)` za pomocą podmiany `(a, b) -> (b, a % b)` w maksymalnie 44 lub 45 krokach w całym zakresie `int`.
- W teście pierwszości sprawdzaj dzielniki wyłącznie do pierwiastka i zawsze używaj warunku `d <= n / d` zamiast `d * d <= n`, aby uniknąć przepełnienia 32-bitowego `int`.
- Przy obliczaniu NWW dziel przez NWD przed mnożeniem i korzystaj z typu `long`: `(long)(a / nwd) * b`.
