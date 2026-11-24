# Zmienne, typy danych i arytmetyka komputera

Każesz komputerowi podzielić `7` przez `2`, a program bez żadnego ostrzeżenia zwraca `3`. Dodajesz `1` do największej liczby całkowitej `2 147 483 647`, a wynik nagle przeskakuje na ujemne `-2 147 483 648`. W kalkulatorze finansowym sprawdzasz, czy `0.1 + 0.2` równa się `0.3`, i otrzymujesz odpowiedź `False`.

To nie błędy sprzętu. Każda wartość w programie zajmuje skończoną liczbę bajtów w pamięci RAM i podlega sztywnym regułom swojego typu danych. C# jest językiem **silnie i statycznie typowanym**, więc kompilator sprawdza typy każdej operacji jeszcze przed zbudowaniem pliku `.exe`.

---

## 📦 Zmienne, przypisanie i stałe

**Zmienna** to nazwany obszar w pamięci RAM, który przechowuje wartość określonego typu. Zanim użyjesz zmiennej, musisz ją utworzyć i nadać jej wartość początkową:

```csharp
int liczbaGraczy;         // deklaracja: rezerwujemy miejsce w pamieci na typ int
liczbaGraczy = 4;         // inicjalizacja: wpisujemy pierwsza wartosc

int punkty = 100;         // deklaracja i inicjalizacja w jednej linii
punkty = punkty + 25;     // nadpisanie: teraz zmienna punkty ma wartosc 125
```

Znak `=` w C# nie oznacza równości matematycznej. W matematyce zapis $x = x + 1$ jest sprzeczny. W programowaniu `=` to **operator przypisania**: procesor najpierw oblicza wyrażenie po prawej stronie (`100 + 25`), a potem zapisuje wynik do zmiennej po lewej stronie.

Kompilator C# pilnuje, aby nikt nie odczytał pustej, nieprzygotowanej zmiennej. Próba wypisania zmiennej przed nadaniem jej pierwszej wartości kończy się błędem kompilacji **_<code style="color: inherit;">CS0165</code>_** (`Use of unassigned local variable`):

```csharp
int wynik;
Console.WriteLine(wynik); // BLAD CS0165: zmienna nie zostala zainicjalizowana
```

### 🏷️ Nazewnictwo i stałe const

Dla zmiennych lokalnych w C# stosuj konwencję **camelCase**: pierwszy wyraz małą literą, a każdy kolejny wielką, bez spacji i polskich znaków (na przykład `cenaNetto`, `liczbaSekund`). Nazwa nie może zaczynać się od cyfry.

Jeśli wartość nie ma prawa się zmienić podczas działania programu, oznacz ją słowem kluczowym **`const`**:

```csharp
const int SekundyWMinucie = 60;
const decimal StawkaPodstawowa = 0.23m;
```

Stałe zastępują zagadkowe liczby wpisane luzem w kodzie. Jeśli ktoś spróbuje później nadpisać stałą `const`, kompilator natychmiast zablokuje taki kod.

### 🔄 Zamiana wartości dwóch zmiennych w pamięci RAM

Wyobraź sobie dwie komórki pamięci: `int a = 5;` oraz `int b = 9;`. Zobacz na animacji, dlaczego naiwny zapis `a = b; b = a;` niszczy wartość `5`, i prześledź bezpieczną zamianę (swap) ze zmienną pomocniczą *temp*:

<data-gate>
<data-csharp-swap-viz></data-csharp-swap-viz>
</data-gate>

Taki schemat zamiany wartości przez zmienną pomocniczą *temp* wykorzystasz wielokrotnie w algorytmach sortowania.

---

## 🧱 System typów danych w C#

Wybór typu zmiennej decyduje o tym, jakie dane możesz zapisać, jaką precyzję zachowasz oraz ile bajtów zarezerwujesz w pamięci RAM:

| Typ C# | Rozmiar | Zakres lub precyzja | Przykład literału | Typowe zastosowanie |
| :---: | :---: | --- | :---: | --- |
| `byte` | 1 bajt | `0` do `255` | `255` | Pojedyncze bajty plików, kanały koloru RGB |
| `int` | 4 bajty | `-2 147 483 648` do `2 147 483 647` | `42` | Liczniki, indeksy, domyślne obliczenia całkowite |
| `long` | 8 bajtów | około `-9,22 * 10^18` do `9,22 * 10^18` | `42L` | Rozmiary dużych plików w bajtach, znaczniki czasu |
| `double` | 8 bajtów | 15 do 17 cyfr znaczących (zapis binarny) | `3.14` | Fizyka, pomiary inżynierskie, prędkość sieci |
| `decimal` | 16 bajtów | 28 do 29 cyfr znaczących (zapis dziesiętny) | `19.99m` | Ceny, faktury, księgowość, podatki |
| `bool` | 1 bajt | wyłącznie `true` lub `false` | `true` | Flagi logiczne i wyniki porównań |
| `string` | zmienny | dowolny ciąg znaków tekstu | `"Raport"` | Imiona, komunikaty, ścieżki plików |

Zwróć uwagę na sufiksy literałów liczbowych. Liczbę z kropką taką jak `19.99` kompilator traktuje zawsze jako `double`. Aby przypisać ją do zmiennej `decimal`, musisz dopisać sufiks `m` (`19.99m`). Analogicznie, bardzo dużą liczbę całkowitą dla typu `long` oznaczasz sufiksem `L` (`3000000000L`).

### ⚖️ Dlaczego 0.1 + 0.2 nie równa się 0.3 w typie double?

Typ `double` zapisuje ułamki jako sumy potęg dwójki. Ułamków `0.1` i `0.2` nie da się zapisać skończenie w systemie binarnym, tak jak `1/3` w systemie dziesiętnym. W efekcie `0.1 + 0.2` daje `0.30000000000000004`, więc `0.1 + 0.2 == 0.3` zwraca `False`.

Typ **`decimal`** zapisuje liczby dziesiętnie, dlatego `0.1m + 0.2m == 0.3m` daje dokładnie `True`.

> [!IMPORTANT]
> Do pieniędzy, cen, stawek VAT i księgowości używaj zawsze typu **`decimal`** z sufiksem `m`. Typ **`double`** zostaw dla fizyki, geometrii i pomiarów, gdzie liczy się szybkość procesora, a nie dokładność co do grosza.

<data-gate>
<data-connection-matcher title="Dobierz właściwy typ C# do rodzaju danych">
    <item left="Cena produktu na fakturze (149.99 zł)" right="decimal"></item>
    <item left="Rozmiar obrazu dysku w bajtach (ponad 10 miliardów)" right="long"></item>
    <item left="Informacja, czy użytkownik jest zalogowany" right="bool"></item>
    <item left="Średnia prędkość pobierania w megabitach na sekundę" right="double"></item>
    <item left="Liczba sztuk towaru w magazynie (do kilkunastu tysięcy)" right="int"></item>
</data-connection-matcher>
</data-gate>

---

## ➗ Arytmetyka, konwersje i kolejność działań

W C# wynik operatora `/` zależy wyłącznie od **typów liczb biorących udział w dzieleniu**, a nie od typu zmiennej po lewej stronie znaku `=`:

```csharp
int a = 7;
int b = 2;

int iloraz = a / b;              // 3 (czesc ulamkowa zostaje ucieta)
int reszta = a % b;              // 1 (reszta z dzielenia, tzw. modulo)
double bladZapisu = a / b;       // 3.0! Najpierw wykonuje sie int / int = 3
double poprawny = (double)a / b; // 3.5 (rzutowanie zmienia a na double przed dzieleniem)
```

### 🪙 Rozkład wielkości za pomocą / i %

Para operatorów `/` oraz `%` pozwala rozbić dowolną liczbę całkowitą na mniejsze jednostki. Spójrz na przykład rozmieniania kwoty `254` zł na jak największe nominały (`100` zł, `10` zł i `1` zł):

```csharp
int kwota = 254;
int setki = kwota / 100;          // 254 / 100 = 2 banknoty po 100 zl
int resztaPoSetkach = kwota % 100;// 254 % 100 = 54 zl zostalo do rozmienienia
int dziesiatki = resztaPoSetkach / 10; // 54 / 10 = 5 banknotow po 10 zl
int zlotowki = kwota % 10;        // 254 % 10 = 4 monety po 1 zl
```

Dokładnie ten sam schemat działa przy zamianie centymetrów na metry albo sekund na godziny, minuty i sekundy: dzielenie `/` wyciąga pełne paczki, a reszta `%` zostawia to, co się w nich nie zmieściło.

### 🔁 Konwersja niejawna kontra jawne rzutowanie

Gdy przenosisz wartość z węższego typu do szerszego (na przykład `int` do `long` lub `int` do `double`), C# wykonuje **konwersję niejawną** automatycznie, bo nic nie może się zgubić.

W drugą stronę (na przykład z `double` do `int`) kompilator blokuje przypisanie, ponieważ grozi ono utratą części ułamkowej. Musisz użyć **jawnego rzutowania**:

```csharp
int calkowita = 42;
double szeroka = calkowita;     // konwersja niejawna: 42.0

double cena = 3.99;
int obcieta = (int)cena;        // jawne rzutowanie: 3 (UCINA ulamek, nie zaokragla!)
```

Pamiętaj też, że w C# nie wolno mieszać w jednym wyrażeniu typów `decimal` i `double` (kompilator zgłosi błąd **_CS0019_**). Gdy w obliczeniach finansowych dzielisz liczbę całkowitą `int` przez `100`, użyj literału dziesiętnego `100m` lub rzutowania `(decimal)`:

```csharp
int vat = 23;
decimal stawka = vat / 100m;       // 0.23m (poprawnie: int / decimal daje decimal)
// decimal blad = vat / 100.0;     // BLAD CS0019: double nie zamienia sie sam na decimal
```

### 📐 Priorytet operatorów i pułapka sklejania napisów

Mnożenie `*`, dzielenie `/` i reszta `%` wykonują się zawsze przed dodawaniem `+` i odejmowaniem `-`. Gdy chcesz wymusić inną kolejność, używaj nawiasów `(...)`.

Znak `+` pełni dwie role: dla liczb oznacza dodawanie, a dla napisów łączenie tekstu. Ponieważ komputer czyta wyrażenia z `+` od lewej do prawej, zobacz różnicę między dwiema poniższymi liniami:

```csharp
Console.WriteLine("Wynik: " + 2 + 3);   // wypisze: Wynik: 23
Console.WriteLine("Wynik: " + (2 + 3)); // wypisze: Wynik: 5
```

W pierwszej linii wyrażenie `"Wynik: " + 2` tworzy napis `"Wynik: 2"`, a kolejne `+ 3` dokleja cyfrę `3` jako tekst. Nawiasy w drugiej linii każą najpierw dodać liczby `2 + 3`.

---

## 🛡️ Kontrola przepełnienia: checked i unchecked

Gdy wynik operacji na typie `int` przekracza jego górną granicę (`int.MaxValue = 2 147 483 647`), w C# domyślnie działa tryb **`unchecked`**. Liczba zawija się na sam początek ujemnego zakresu (`-2 147 483 648`), a program biegnie dalej bez żadnego ostrzeżenia.

> [!WARNING]
> Ciche zawinięcie liczby w kalkulatorach finansowych, rozmiarach plików lub licznikach czasu prowadzi do trudnych do wykrycia błędów. Jeśli wynik może przekroczyć 2 miliardy, od razu użyj typu `long` albo zrzutuj pierwszy czynnik: `(long)rozmiarMB * 1024 * 1024`.

Aby zmusić program do natychmiastowego wykrycia przepełnienia, umieść obliczenie w bloku **`checked`**. W razie przekroczenia zakresu środowisko .NET rzuci **wyjątek** (sygnał błędu w trakcie działania programu, który natychmiast przerywa wadliwe obliczenie): **_<code style="color: inherit;">OverflowException</code>_**.

```csharp
int maks = int.MaxValue;

int zawiniete = unchecked(maks + 1); // -2147483648 (ciche zawiniecie)

checked
{
    int blad = maks + 1; // Rzuca OverflowException i zatrzymuje program
}
```

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Signed Overflow UB w C++ vs C#, instrukcja IDIV oraz magiczne stałe mnożenia</span>
<span class="deep-dive-badge">C++ UB · X86-64 · COMPILER OPT</span>
</summary>
<div class="deep-dive-content">

<h4>1. Undefined Behavior w C++ kontra zdefiniowana arytmetyka w C#</h4>

W językach C i C++ przepełnienie liczby całkowitej ze znakiem (`int`) jest określone w standardzie jako **_Undefined Behavior (UB)_**. Kompilator ma pełne prawo założyć, że w poprawnym programie taka sytuacja nigdy nie wystąpi, i na tej podstawie agresywnie optymalizować kod. Spójrz na funkcję sprawdzającą przepełnienie w C++:

```cpp
bool czyPrzepelnienie(int x) {
    return (x + 1) < x;
}
```

Po kompilacji z flagą `g++ -O2` kompilator rozumuje algebraicznie: skoro `x + 1` nie może się przepełnić, warunek `(x + 1) < x` jest zawsze fałszywy. W efekcie `gcc` usuwa całe porównanie i generuje dwie instrukcje asemblera:

```asm
xor eax, eax   ; zwroc 0 (false) bez sprawdzania x
ret
```

W C# arytmetyka całkowita jest w pełni zdefiniowana przez specyfikację języka. Blok `unchecked` generuje instrukcję bajtkodu CIL `add`, gwarantującą zawijanie modulo $2^{32}$. Blok `checked` generuje instrukcję `add.ovf`. Na procesorze x86-64 sprawdza ona flagę przepełnienia `OF` (Overflow Flag) instrukcją `JO` (Jump if Overflow) i zgłasza **_OverflowException_**.

<h4>2. Dlaczego dzielenie IDIV jest wolne i jak kompilator je zastępuje?</h4>

Na nowoczesnym procesorze x86-64 dodawanie (`ADD`) zajmuje 1 cykl zegara, mnożenie (`IMUL`) około 3 cykli, natomiast dzielenie całkowite instrukcją **`IDIV`** trwa od 20 do 40 cykli zegara. Dodatkowo `IDIV` wymaga umieszczenia dzielnej w sztywnej parze rejestrów `EDX:EAX` i zwraca iloraz w `EAX` oraz resztę w `EDX`.

Gdy dzielisz przez **stałą znaną w czasie kompilacji** (na przykład `sekundy / 60` albo `n / 10`), kompilator JIT w ogóle nie emituje instrukcji `IDIV`. Wyznacza z teorii liczb odwrotność modularną i zamienia dzielenie na mnożenie oraz przesunięcie bitowe:

```asm
mov  eax, edi          ; laduj argument n
mov  edx, 0x66666667   ; magiczna stala ~ (2^34) / 10
imul edx               ; wynik 64-bitowy w EDX:EAX
sar  edx, 2            ; przesuniecie arytmetyczne w prawo o 2 bity
sar  edi, 31           ; korekta znaku dla liczb ujemnych
sub  edx, edi          ; finalny iloraz n / 10 w EDX
```

Cała sekwencja trwa około 4 do 5 cykli zegara zamiast 30, bez żadnej zmiany w Twoim kodzie C#. Przy okazji diagnostyki bitowej pamiętaj, że w C# podgląd zapisu dwójkowego lub szesnastkowego liczby daje metoda `Convert.ToString(liczba, 2)` oraz `Convert.ToString(liczba, 16)`.

<h4>3. Sprzętowe double (SSE2) kontra programowy decimal</h4>

Zmienna `double` trafia bezpośrednio do rejestrów wektorowych procesora `XMM0`..`XMM15`. Obsługują ją pojedyncze rozkazy sprzętowe SSE2 (`ADDSD`, `MULSD`, `DIVSD`).

Z kolei `decimal` w C# to 128-bitowa struktura przechowująca 96-bitową mantysę całkowitą oraz dziesiętny wykładnik skali $10^{-k}$ (dla $0 \le k \le 28$). Procesory x86-64 nie mają natywnych instrukcji dla tego formatu, więc każdą operację na `decimal` wykonuje środowisko CLR. Jest około 10 razy wolniejsza niż `double`, ale całkowicie eliminuje błędy reprezentacji ułamków dziesiętnych.

</div>
</details>

---

## 💻 Zadanie praktyczne: Rozkład czasu i kalkulator brutto

> [!NOTE]
> <strong>Jak działa gotowy szablon metody z parametrem i <code>return</code>?</strong>
> W poniższym zadaniu masz gotowe nagłówki metod (na przykład `public static string FormatujCzas(int sekundy)`). Zmienne w nawiasach to **dane wejściowe**, które testy podstawią automatycznie dla wielu przypadków. Zamiast wypisywać wynik na konsolę przez `Console.WriteLine`, odeślij gotową wartość na zewnątrz słowem kluczowym **`return`**.

Zaimplementuj dwie metody statyczne w klasie **`Kalkulator`**:

1. **`FormatujCzas(int sekundy)`**:
   - rozbij podaną liczbę sekund na pełne godziny, pozostałe pełne minuty i pozostałe sekundy za pomocą operatorów `/` oraz `%` (analogicznie do przykładu z rozmienianiem kwoty),
   - zwróć napis w formacie `"Gh Mm Ss"`, na przykład:
     - `3725` daje `"1h 2m 5s"`,
     - `0` daje `"0h 0m 0s"`,
     - `86399` daje `"23h 59m 59s"`.
2. **`ObliczBrutto(decimal cenaNetto, int stawkaVatProcent)`**:
   - oblicz cenę brutto w typie **`decimal`**, dodając do *cenaNetto* podatek VAT o podanej stawce procentowej (na przykład `23` oznacza 23%),
   - uważaj na dzielenie całkowite podczas zamiany procentów na ułamek dziesiętny,
   - przykłady: dla `100.00m` i `23` wynik wynosi `123.00m`, dla `200.00m` i `8` wynik wynosi `216.00m`, dla `19.99m` i `23` wynik wynosi `24.5877m`.

<data-gate>
<data-csharp-lab title="Zadanie: Rozkład czasu i kalkulator brutto w C#" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class Kalkulator
{
    public static string FormatujCzas(int sekundy)
    {
        // TODO: Rozbij sekundy na godziny, minuty i pozostale sekundy (uzyj / oraz %)
        // Zwroc napis w formacie "1h 2m 5s"
        return "";
    }

    public static decimal ObliczBrutto(decimal cenaNetto, int stawkaVatProcent)
    {
        // TODO: Oblicz cene brutto w typie decimal (uwazaj na dzielenie calkowite)
        return 0m;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("3725 s = " + Kalkulator.FormatujCzas(3725));
        Console.WriteLine("100 netto + 23% VAT = " + Kalkulator.ObliczBrutto(100.00m, 23));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("FormatujCzas obsluguje 0 oraz wartosci ponizej minuty", () => {
    LabAssert.Equal("0h 0m 0s", Kalkulator.FormatujCzas(0));
    LabAssert.Equal("0h 0m 59s", Kalkulator.FormatujCzas(59));
});
LabAssert.Test("FormatujCzas poprawnie rozbija godziny, minuty i sekundy", () => {
    LabAssert.Equal("1h 2m 5s", Kalkulator.FormatujCzas(3725));
    LabAssert.Equal("23h 59m 59s", Kalkulator.FormatujCzas(86399));
});
LabAssert.Test("ObliczBrutto dokladnie liczy podatek VAT w typie decimal bez dzielenia calkowitego", () => {
    LabAssert.Equal(123.00m, Kalkulator.ObliczBrutto(100.00m, 23));
    LabAssert.Equal(216.00m, Kalkulator.ObliczBrutto(200.00m, 8));
    LabAssert.Equal(24.5877m, Kalkulator.ObliczBrutto(19.99m, 23));
    LabAssert.Equal(50.00m, Kalkulator.ObliczBrutto(50.00m, 0));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Jaki typ wybrać dla liczb?</strong> Do pieniędzy i podatków zawsze wybieraj `decimal` z sufiksem `m`, bo `double` nie zapisuje dokładnie ułamków typu `0.1`. Do fizyki i pomiarów wybieraj `double`, do standardowych liczników `int`, a dla wartości powyżej 2 miliardów `long` z sufiksem `L`.
- <strong>Jak uniknąć ucięcia wyniku w dzieleniu?</strong> Dzielenie dwóch liczb `int` zawsze ucina część ułamkową. Jeśli chcesz uzyskać ułamek, zrzutuj co najmniej jeden operand przed dzieleniem (na przykład `(double)a / b`) albo użyj literału z sufiksem (`100m`).
- <strong>Kiedy łączyć <code>/</code> z <code>%</code>?</strong> Gdy rozkładasz jedną wielkość całkowitą na mniejsze jednostki (nominały, czas, miary długości), `/` wyznacza pełne paczki, a `%` zwraca to, co zostało do dalszego podziału.
- <strong>Jak chronić kod przed przepełnieniem i błędami przypisania?</strong> Owijaj krytyczne operacje całkowite w blok `checked` (by zamienić ciche zawinięcie na `OverflowException`), nie używaj zmiennych przed inicjalizacją (`CS0165`), a do zamiany dwóch zmiennych używaj zmiennej pomocniczej `temp`.
