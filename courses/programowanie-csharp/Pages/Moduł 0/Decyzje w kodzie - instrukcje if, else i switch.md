# Decyzje w kodzie - instrukcje if, else i switch

Czujnik w serwerowni melduje temperaturę `92°C`. Alarm krytyczny powinien uruchomić się od `90°C`, ale program spokojnie wypisuje jedynie „WYSOKA” i nie włącza chłodzenia awaryjnego. Kod kompiluje się bez jednego błędu, a oba progi liczbowe są wpisane poprawnie.

Winna jest kolejność sprawdzania warunków. Program wykonujący instrukcje bezrefleksyjnie od góry do dołu nie potrafi reagować na dane wejściowe. Dopiero instrukcje warunkowe **`if`**, **`else`** oraz **`switch`** pozwalają sterować ścieżką wykonania na podstawie wyrażeń logicznych typu `bool`.

---

## 🔍 Operatory porównania i zmienne logiczne bool

Warunek wewnątrz nawiasów `if (...)` musi zawsze dawać wynik typu **`bool`**: albo `true` (prawda), albo `false` (fałsz). W C# nie możesz wpisać samej liczby całkowitej jako warunku.

Do budowania warunków służy sześć operatorów porównania:

| Operator | Znaczenie | Przykład | Wynik |
| :---: | --- | :---: | :---: |
| `==` | Równe | `5 == 5` | `true` |
| `!=` | Różne | `5 != 3` | `true` |
| `<` | Mniejsze niż | `4 < 4` | `false` |
| `<=` | Mniejsze lub równe | `4 <= 4` | `true` |
| `>` | Większe niż | `10 > 2` | `true` |
| `>=` | Większe lub równe | `92 >= 90` | `true` |

Nie myl znaku przypisania `=` z operatorem porównania `==`. Jeśli napiszesz `if (temperatura = 90)`, kompilator C# zatrzyma kod błędem **_<code style="color: inherit;">CS0029</code>_** (nie można zamienić liczby na `bool`). Ostrożność zachowaj przy zmiennych logicznych: zapis `if (alarm = true)` nadal się skompiluje, ponieważ przypisuje `true` i zawsze wchodzi w gałąź `if`.

Długie warunki warto rozbijać na nazwane zmienne `bool`. Taki kod czyta się jak zwykłe zdanie:

```csharp
bool jestPrzegrzany = temperatura >= 90;
bool wymagaUwagi = temperatura >= 75;
```

---

## 🔀 Instrukcja if, else if i monotoniczność progów

Wróćmy do błędu czujnika z początku lekcji. Jeśli najpierw sprawdzisz `temperatura >= 75`, wartość `92` spełni już pierwszy warunek i gałąź dla `>= 90` nigdy się nie wykona.

W łańcuchu **`if / else if / else`** program wchodzi zawsze w **pierwszą prawdziwą gałąź**, a pozostałe całkowicie pomija. Dlatego progi liczbowe musisz układać **monotonicznie**: od najwyższego w dół albo od najniższego w górę:

```csharp
int temperatura = 92;

if (temperatura >= 90)
{
    Console.WriteLine("KRYTYCZNA");
}
else if (temperatura >= 75)
{
    Console.WriteLine("WYSOKA");
}
else
{
    Console.WriteLine("NORMA");
}
```

### ⚖️ Niezależne if/if kontra wykluczające if/else if

Porównaj dwa krótkie programy naliczające rabat od kwoty zakupów `kwota = 500`:

```csharp
// Wersja A: dwa niezalezne if
int rabatA = 0;
if (kwota >= 100)
{
    rabatA = rabatA + 5;
}
if (kwota >= 300)
{
    rabatA = rabatA + 10;
}

// Wersja B: lancuch if / else if
int rabatB = 0;
if (kwota >= 100)
{
    rabatB = rabatB + 5;
}
else if (kwota >= 300)
{
    rabatB = rabatB + 10;
}
```

Dla `kwota = 500` zmienna *rabatA* wyniesie **`15`** (oba niezależne `if` są prawdziwe i kumulują rabaty `5 + 10`), natomiast *rabatB* wyniesie **`5`** (pierwszy warunek zamyka cały łańcuch `if / else if`).

Zasada wyboru jest prosta: gdy kilka warunków może zajść jednocześnie i ich skutki mają się sumować, stosuj niezależne instrukcje `if`. Gdy dane mają trafić do dokładnie jednej kategorii (na przykład ocena lub poziom alarmu), stosuj `if / else if / else`.

### 📦 Zasięg zmiennych w bloku i błąd zbędnego średnika

Klamry `{ }` wyznaczają **zasięg blokowy** zmiennych. Zmienna zadeklarowana wewnątrz bloku `if` znika natychmiast po zamykającej klamrze `}`. Próba odczytania jej poniżej kończy się błędem kompilacji **_<code style="color: inherit;">CS0103</code>_**:

```csharp
if (temperatura >= 90)
{
    string komunikat = "ALARM";
}
// Console.WriteLine(komunikat); // BLAD CS0103: komunikat nie istnieje poza blokiem if
```

Jeśli potrzebujesz wyniku po wyjściu z `if`, zadeklaruj zmienną przed instrukcją warunkową, a wewnątrz bloku jedynie przypisz jej wartość.

> [!WARNING]
> Nigdy nie stawiaj średnika bezpośrednio po nawiasie `if (...)`! Zapis `if (temperatura >= 90);` kończy pustą instrukcję warunkową, przez co blok `{ ... }` poniżej wykona się **_zawsze_**, nawet przy temperaturze `20°C`.

---

## ⚡ Logika boolowska, priorytet i mechanizm zwarcia

Do łączenia wielu warunków w jedno wyrażenie służą trzy operatory logiczne:

| Operator | Nazwa | Kiedy daje `true`? | Mechanizm zwarcia |
| :---: | --- | --- | --- |
| `&&` | Koniunkcja (I) | Gdy oba warunki są prawdziwe | Jeśli lewa strona to `false`, prawa **nie jest obliczana** |
| `||` | Alternatywa (LUB) | Gdy co najmniej jeden warunek jest prawdziwy | Jeśli lewa strona to `true`, prawa **nie jest obliczana** |
| `!` | Negacja (NIE) | Gdy warunek ma wartość `false` | Odwraca wartość logiczną (`!true` daje `false`) |

### 📐 Priorytet operatorów i prawa De Morgana

Kompilator oblicza operatory logiczne w stałej kolejności: najpierw negację **`!`**, potem koniunkcję **`&&`**, a na końcu alternatywę **`||`**. Gdy mieszasz `&&` i `||` w jednym warunku, zawsze grupuj je nawiasami `(...)`, aby kod był jednoznaczny dla człowieka i maszyny.

Przy zaprzeczaniu złożonych warunków przydają się dwie proste reguły logiczne (zwane **prawami De Morgana**):
- `!(a && b)` oznacza dokładnie tyle samo co `!a || !b` („nieprawda, że ma bilet I jest pełnoletni” znaczy: „nie ma biletu LUB nie jest pełnoletni”).
- `!(a || b)` oznacza dokładnie tyle samo co `!a && !b` („nieprawda, że pada deszcz LUB wieje wiatr” znaczy: „nie pada deszcz I nie wieje wiatr”).

### 🛡️ Zwarcie jako ochrona przed awarią programu

Mechanizm **zwarcia** nie służy wyłącznie przyspieszeniu obliczeń. Chroni program przed przerwaniem wykonania w czasie pracy. Spójrz na dzielenie przez zmienną *dzielnik*:

```csharp
int dzielnik = 0;

// Bezpieczne: lewa strona daje false, wiec dzielenie po prawej w ogole sie nie wykona
if (dzielnik != 0 && 100 / dzielnik > 5)
{
    Console.WriteLine("Wynik wiekszy niz 5");
}
```

Gdybyś odwrócił kolejność na `100 / dzielnik > 5 && dzielnik != 0`, program natychmiast rzuciłby wyjątek **_<code style="color: inherit;">DivideByZeroException</code>_**.

Podobnie działa ochrona napisów przed wartością **`null`**. Dla typu `string` słowo `null` oznacza brak jakiegokolwiek napisu w pamięci (to nie jest nawet pusty tekst `""`). Próba sprawdzenia `tekst.Length` dla wartości `null` powoduje awarię **_<code style="color: inherit;">NullReferenceException</code>_**. Zapis `tekst != null && tekst.Length > 0` najpierw wyklucza `null`, a dopiero potem czyta długość.

<data-gate>
<data-connection-matcher title="Dopasuj konstrukcję warunkową C# do jej skutku w trakcie wykonania">
  <item left="if (a >= 100) ... if (a >= 300) ..." right="Oba warunki sprawdzane niezależnie: efekty mogą się kumulować"></item>
  <item left="if (dzielnik != 0 && 100 / dzielnik > 5)" right="Zwarcie && chroni przed DivideByZeroException dla zera"></item>
  <item left="if (tekst != null && tekst.Length > 0)" right="Zwarcie && chroni przed NullReferenceException dla null"></item>
  <item left="if (temperatura >= 90); { ... }" right="Zbędny średnik odcina warunek: blok wykona się zawsze"></item>
</data-connection-matcher>
</data-gate>

### 📅 Reguła roku przestępnego i wizualizator rozgałęzień

Ziemia okrąża Słońce w około `365,2425` dnia, a nie w równe `365,25` dnia. Dlatego kalendarz gregoriański stosuje trójstopniową regułę roku przestępnego:
1. Zasadniczo co czwarty rok (podzielny przez `4`) jest przestępny.
2. Wyjątek stanowią pełne stulecia (podzielne przez `100`, jak `1900` lub `2100`), które **nie są** przestępne.
3. Wyjątek od wyjątku stanowią lata podzielne przez `400` (jak `2000`), które **są** przestępne.

Przetestuj w wizualizatorze poniżej lata `1900`, `2000`, `2024`, `2025` i `2100` oraz różne wartości *dzielnik*. Obserwuj, które gałęzie się podświetlają i kiedy zwarcie `&&` pomija prawą stronę warunku:

<data-csharp-branch-tracer></data-csharp-branch-tracer>

---

## 🎛️ Instrukcja switch i operator trójargumentowy ?:

Gdy porównujesz jedną zmienną (na przykład `int`, `char` albo `string`) z wieloma konkretnymi wartościami stałymi, instrukcja **`switch`** jest znacznie czytelniejsza niż długi ciąg `else if`.

W przeciwieństwie do języków C i C++, w C# nie istnieje przypadkowe przechodzenie do kolejnej gałęzi po zapomnieniu słowa `break`. Kompilator traktuje brak `break` lub `return` w niepustej gałęzi `case` jako błąd kompilacji **_<code style="color: inherit;">CS0163</code>_**. Możesz natomiast bezpiecznie grupować puste etykiety `case` prowadzące do tego samego wyniku:

```csharp
string typDnia;
switch (numerDnia)
{
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        typDnia = "Dzien roboczy";
        break;
    case 6:
    case 7:
        typDnia = "Weekend";
        break;
    default:
        typDnia = "Niepoprawny numer";
        break;
}
```

W C# instrukcja `switch` obsługuje również napisy typu **`string`**, co świetnie sprawdza się przy parsowaniu poleceń tekstowych:

```csharp
string komenda = "START";
switch (komenda)
{
    case "START":
        Console.WriteLine("Uruchamianie uslugi...");
        break;
    case "STOP":
        Console.WriteLine("Zatrzymywanie uslugi...");
        break;
    default:
        Console.WriteLine("Nieznana komenda.");
        break;
}
```

### 🔹 Operator trójargumentowy ?:

Dla prostego wyboru jednej z dwóch wartości (na przykład przy przypisaniu lub w instrukcji `return`) zamiast czterech linii `if / else` możesz użyć operatora `warunek ? gdyPrawda : gdyFalsz`:

```csharp
int dniWLutym = czyPrzestepny ? 29 : 28;
```

> [!TIP]
> Stosuj operator `?:` wyłącznie dla pojedynczych, krótkich decyzji. Zagnieżdżanie kilku operatorów `?:` w jednej linii drastycznie pogarsza czytelność i utrudnia szukanie błędów.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Predykcja skoków w CPU, tablice skoków switch oraz kod bez rozgałęzień (CMOV)</span>
<span class="deep-dive-badge">CPU PIPELINE · JUMP TABLE · BRANCHLESS</span>
</summary>
<div class="deep-dive-content">

<h4>1. Koszt pomyłki predyktora skoków w potoku procesora</h4>

Nowoczesne rdzenie x86-64 wykonują instrukcje w głębokim potoku (pipeline) liczącym od 14 do 20 etapów. Gdy procesor napotyka skok warunkowy (na przykład `JG` lub `JE` wygenerowany z Twojego `if`), wynik porównania nie jest jeszcze gotowy. Aby nie zatrzymywać rdzenia, sprzętowy **predyktor skoków** (Branch Predictor) zgaduje, którą gałąź wybrać, i wykonuje jej rozkazy spekulatywnie.

Podstawą predyktora jest **2-bitowy licznik nasycony** o czterech stanach: silnie nie skacz, słabo nie skacz, słabo skacz, silnie skacz. Pojedyncza zmiana wyniku nie przestawia od razu predykcji, co chroni pętle przed błędnym zgadywaniem na ostatnim kroku:
- Gdy predyktor trafi: narzut skoku wynosi praktycznie **0 dodatkowych cykli**.
- Gdy predyktor się pomyli (na przykład na losowych, nieposortowanych danych): procesor musi opróżnić potok (pipeline flush) i wczytać właściwą gałąź od nowa. Koszt jednej pomyłki to **_15 do 20 zmarnowanych cykli zegara_**. Pętla z `if (tab[i] >= 128)` działa na posortowanej tablicy nawet 3 do 5 razy szybciej niż na tej samej tablicy w kolejności losowej.

<h4>2. Jak kompilator i JIT obniżają instrukcję switch?</h4>

Kompilator nie tłumaczy każdego `switch` jak zwykłego łańcucha `if / else if`. Strategia zależy od rozkładu etykiet `case`:
- **Gęste etykiety całkowite** (na przykład miesiące `1..12`): JIT buduje w pamięci **tablicę skoków** (Jump Table). Procesor przesuwa zakres `1..12` na `0..11`, jednym porównaniem bez znaku (`ja`) odrzuca wartości spoza zakresu i wykonuje jeden skok pośredni:

```asm
sub eax, 1                        ; przesun zakres 1..12 na 0..11
cmp eax, 11                       ; jedno porownanie bez znaku odrzuca < 1 oraz > 12
ja  L_default                     ; jesli poza zakresem 0..11, skocz do default
jmp qword ptr [jumpTable + rax*8] ; bezposredni skok do adresu z tablicy
```

- **Rzadkie, rozproszone etykiety** (na przykład `10`, `500`, `4096`, `99999`): tablica skoków zmarnowałaby pamięć, więc kompilator zamienia `switch` w drzewo wyszukiwania binarnego.

<h4>3. Programowanie bez rozgałęzień i instrukcja CMOV</h4>

W krytycznych pętlach losowe gałęzie `if` potrafią zablokować potok CPU. Nowoczesny JIT potrafi zamienić prosty warunek (na przykład `int m = (a > b) ? a : b;`) na kod całkowicie pozbawiony skoków za pomocą instrukcji warunkowego przeniesienia **`CMOV`** (Conditional Move):

```asm
; Wersja z rozgalezieniem (ryzyko oproznienia potoku):
cmp eax, edx
jg  L_done
mov eax, edx
L_done:

; Wersja bez rozgalezien (zero skokow, staly czas wykonania):
cmp   eax, edx
cmovl eax, edx   ; jesli eax < edx, skopiuj edx do eax bez skoku
```

Dzięki eliminacji skoków potok procesora pozostaje stale wypełniony niezależnie od tego, jak losowe są dane wejściowe.

</div>
</details>

---

## 💻 Zadanie praktyczne: Kalendarz gregoriański

> [!NOTE]
> **Wywołanie jednej metody z wnętrza drugiej:** obie metody w zadaniu (`CzyRokPrzestepny` oraz `DniWMiesiacu`) znajdują się wewnątrz tej samej klasy `Kalendarz`. Oznacza to, że wewnątrz `DniWMiesiacu` możesz wywołać `CzyRokPrzestepny(rok)` bezpośrednio po nazwie i użyć zwróconej wartości `bool` w instrukcji `if` lub w operatorze `?:`.

Zaimplementuj dwie metody statyczne w klasie **`Kalendarz`**:

1. **`CzyRokPrzestepny(int rok)`**:
   - zapisz w C# regułę kalendarza gregoriańskiego (podzielność sprawdzasz operatorem reszty `%`: liczba jest podzielna przez `4`, gdy `rok % 4 == 0`),
   - pamiętaj o nawiasach grupujących `&&` i `||` oraz o przypadkach stuleci: `1900` i `2100` nie są przestępne, natomiast `2000` jest przestępny.
2. **`DniWMiesiacu(int miesiac, int rok)`**:
   - użyj instrukcji **`switch (miesiac)`**,
   - dla miesięcy `1, 3, 5, 7, 8, 10, 12` zwróć `31`,
   - dla miesięcy `4, 6, 9, 11` zwróć `30`,
   - dla miesiąca `2` (luty) wywołaj własną metodę `CzyRokPrzestepny(rok)` i zwróć `29` lub `28`,
   - dla każdego innego numeru miesiąca (`default`) zwróć `-1`.

<data-gate>
<data-csharp-lab title="Zadanie: Kalendarz gregoriański (if, &&/||, switch)" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

public class Kalendarz
{
    public static bool CzyRokPrzestepny(int rok)
    {
        // TODO: Zaimplementuj regule gregorianska (podzielny przez 4 i nie 100, lub przez 400)
        return false;
    }

    public static int DniWMiesiacu(int miesiac, int rok)
    {
        // TODO: Uzyj switch (miesiac) oraz CzyRokPrzestepny(rok) dla lutego
        // Dla niepoprawnego miesiaca zwroc -1
        return -1;
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("2000 przestepny: " + Kalendarz.CzyRokPrzestepny(2000));
        Console.WriteLine("1900 przestepny: " + Kalendarz.CzyRokPrzestepny(1900));
        Console.WriteLine("Luty 2024 ma dni: " + Kalendarz.DniWMiesiacu(2, 2024));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("CzyRokPrzestepny poprawnie rozpoznaje lata zwykle, przestepne i stulecia", () => {
    LabAssert.False(Kalendarz.CzyRokPrzestepny(1900), "Rok 1900 nie jest przestepny (podzielny przez 100, nie przez 400)");
    LabAssert.True(Kalendarz.CzyRokPrzestepny(2000), "Rok 2000 jest przestepny (podzielny przez 400)");
    LabAssert.True(Kalendarz.CzyRokPrzestepny(2024), "Rok 2024 jest przestepny");
    LabAssert.False(Kalendarz.CzyRokPrzestepny(2025), "Rok 2025 nie jest przestepny");
    LabAssert.False(Kalendarz.CzyRokPrzestepny(2100), "Rok 2100 nie jest przestepny");
});
LabAssert.Test("DniWMiesiacu zwraca poprawne dni dla lutego przestepnego i zwyklego", () => {
    LabAssert.Equal(29, Kalendarz.DniWMiesiacu(2, 2024));
    LabAssert.Equal(29, Kalendarz.DniWMiesiacu(2, 2000));
    LabAssert.Equal(28, Kalendarz.DniWMiesiacu(2, 1900));
    LabAssert.Equal(28, Kalendarz.DniWMiesiacu(2, 2025));
});
LabAssert.Test("DniWMiesiacu obsluguje miesiace 30/31-dniowe oraz bledny numer miesiaca", () => {
    LabAssert.Equal(31, Kalendarz.DniWMiesiacu(1, 2025));
    LabAssert.Equal(30, Kalendarz.DniWMiesiacu(4, 2025));
    LabAssert.Equal(30, Kalendarz.DniWMiesiacu(11, 2025));
    LabAssert.Equal(31, Kalendarz.DniWMiesiacu(12, 2025));
    LabAssert.Equal(-1, Kalendarz.DniWMiesiacu(0, 2025));
    LabAssert.Equal(-1, Kalendarz.DniWMiesiacu(13, 2025));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy wybrać <code>if / if</code>, a kiedy <code>if / else if</code>?</strong> Stosuj niezależne `if / if`, gdy kilka warunków może się kumulować. Stosuj `if / else if`, gdy wybierasz jedną wykluczającą się kategorię, i układaj progi monotonicznie.
- <strong>Jak bezpiecznie łączyć warunki w <code>&&</code> i <code>||</code>?</strong> Stawiaj sprawdzenia ochronne (`dzielnik != 0`, `tekst != null`) zawsze po lewej stronie, aby wykorzystać zwarcie. Gdy mieszasz `&&` z `||`, grupuj wyrażenia nawiasami `(...)`.
- <strong>Kiedy wybrać <code>switch</code>, a kiedy <code>?:</code>?</strong> Wybieraj `switch`, gdy porównujesz jedną zmienną (`int`, `char` lub `string`) z wieloma stałymi wartościami; każdą niepustą gałąź zamykaj `break` lub `return`. Wybieraj `?:` wyłącznie dla prostego, jednolinijkowego wyboru jednej z dwóch wartości.
- <strong>O czym pamiętać przy blokach <code>{ }</code>?</strong> Zmienne zadeklarowane wewnątrz `if` znikają po klamrze zamykającej (`CS0103`), a zbędny średnik po `if (...);` odłącza warunek od jego bloku kodu.
