# Pierwszy program i wypisywanie w konsoli

Zapisujesz cztery linijki kodu w pliku tekstowym, uruchamiasz kompilator i zamiast wyniku dostajesz listę sześciu czerwonych błędów. W całym pliku pomyliłeś się tylko w jednym znaku. Dlaczego komputer nie potrafi „domyślić się” Twojej intencji i zignorować drobnej literówki?

Procesor nie czyta kodu źródłowego bezpośrednio. Zanim na ekranie pojawi się choćby jeden znak, specjalny program sprawdza każdą literę, cudzysłów i średnik z matematyczną dokładnością.

---

## ⚙️ Najmniejszy program w C# i jego elementy

Spójrz na kompletny, działający program konsolowy w języku C#:

```csharp
using System;

class Program
{
    static void Main()
    {
        // Wypisanie dwoch komunikatow startowych
        Console.WriteLine("Program uruchomiony.");
        Console.WriteLine("Zakonczono inicjalizacje.");
    }
}
```

Zanim napiszesz własny kod, poznaj robocze znaczenie każdego klocka w tym szablonie:

- **`using System;`**: udostępnia standardową bibliotekę `System`. Znajduje się w niej narzędzie `Console` do obsługi okna terminala. Bez tej linii musiałbyś za każdym razem pisać pełną nazwę `System.Console.WriteLine(...)`.
- **klasa** (`class Program { ... }`): w C# każda instrukcja musi leżeć wewnątrz kontenera zwanego klasą. Na tym etapie traktuj `class Program` jak teczkę grupującą cały Twój program.
- **metoda** (`static void Main() { ... }`): nazwany blok instrukcji do wykonania. Metoda `Main()` to jedyny **punkt startowy** programu. Słowo `static` pozwala uruchomić ją od razu przy starcie, a `void` informuje, że metoda nie odsyła żadnej wartości liczbowej z powrotem.
- **średnik** (`;`): kończy każdą pojedynczą instrukcję. Po nagłówku klasy i po `Main()` nie stawiasz średnika, ponieważ ich granice wyznaczają klamry `{ }`.
- **napis** (typ `string`): dowolny ciąg znaków otoczony prostymi cudzysłowami `"..."`, na przykład `"Program uruchomiony."`.

### 💬 Komentarze w kodzie

W powyższym przykładzie pojawiła się linia zaczynająca się od `//`. To **komentarz**: notatka dla człowieka, którą kompilator całkowicie ignoruje podczas budowania programu.

C# udostępnia dwa rodzaje komentarzy:

```csharp
// Komentarz jednolinijkowy: dziala od znakow // do konca wiersza

/* Komentarz wielolinijkowy:
   moze zajmowac kilka linii naraz.
   Konczy sie para znakow gwiazdka i ukosnik. */
Console.WriteLine("Ta linia wykona sie normalnie.");
```

Komentarze przydają się do opisywania trudnych miejsc w kodzie oraz do oznaczania zadań do zrobienia (na przykład `// TODO: dopisz raport`). Możesz też tymczasowo wyłączyć wybraną instrukcję, stawiając przed nią `//`.

---

## 🛠️ Droga od pliku tekstowego do okna terminala

Aby tekst zapisany w edytorze stał się działającą aplikacją na Windows, przechodzi przez cztery ściśle ustalone etapy. Kluczową rolę pełni tu **kompilator** `csc` (C# Compiler), czyli program sprawdzający składnię i tłumaczący kod C# na plik wykonywalny `.exe`.

<data-gate>
<data-sortable-list title="Ułóż kolejność 4 etapów od pliku Program.cs do tekstu w terminalu">
  <item data-correct="3">Środowisko .NET uruchamia zbudowany plik .exe i tłumaczy go na instrukcje procesora</item>
  <item data-correct="1">Programista zapisuje instrukcje języka C# w pliku źródłowym Program.cs</item>
  <item data-correct="4">System operacyjny odbiera tekst z programu i wyświetla go w oknie terminala</item>
  <item data-correct="2">Kompilator csc sprawdza składnię kodu i tworzy plik wykonywalny .exe</item>
</data-sortable-list>
</data-gate>

Jeśli na etapie 2 w kodzie brakuje średnika, cudzysłowu lub klamry, kompilator `csc` przerywa pracę. Plik `.exe` w ogóle nie powstaje, więc nie uruchomisz nawet tych linii, które były napisane poprawnie.

---

## 🖨️ Sterowanie kursorem: Write, WriteLine i ReadLine

Okno konsoli działa jak siatka znaków z niewidzialnym kursorem. Po wypisaniu każdej litery kursor przesuwa się o jedno pole w prawo.

Różnica między podstawowymi metodami wypisywania dotyczy wyłącznie zachowania kursora na końcu napisu:

- **`Console.Write("tekst")`**: wypisuje napis i zostawia kursor bezpośrednio za ostatnim znakiem.
- **`Console.WriteLine("tekst")`**: wypisuje napis i natychmiast przenosi kursor na początek następnego wiersza.
- **`Console.WriteLine()`** (bez argumentu w nawiasach): przenosi kursor do nowej linii, tworząc pusty wiersz lub domykając linię zaczętą przez `Write`.

```csharp
Console.Write("Rdzenie: ");
Console.WriteLine("8");
Console.WriteLine();
Console.Write("Pamiec: ");
Console.WriteLine("16 GB");
```

Wynik w konsoli:

```text
Rdzenie: 8

Pamiec: 16 GB
```

### ⌨️ Podstawowy model wejście-wyjście

Konsola służy nie tylko do wyświetlania wyników, lecz także do odbierania danych z klawiatury. Do wczytania całej linii tekstu wpisanej przez użytkownika służy metoda **`Console.ReadLine()`**.

```csharp
Console.Write("Podaj nazwe stanowiska: ");
string stanowisko = Console.ReadLine();
Console.Write("Zalogowano na: ");
Console.WriteLine(stanowisko);
```

Zauważ, dlaczego pierwsze polecenie używa `Console.Write` zamiast `Console.WriteLine`. Dzięki temu kursor czeka na wpisanie nazwy w tym samym wierszu, tuż po dwukropku. Zapis `string stanowisko = ...` tworzy proste pudełko na wczytany napis (zmienne poznasz szczegółowo w następnej lekcji).

---

## 🔎 Sekwencje ucieczki w napisach

Każdy napis w C# zaczyna się i kończy cudzysłowem `"`. Rodzi to problem: jak wypisać sam znak cudzysłowu albo ukośnik wsteczny `\` (na przykład w ścieżce katalogu Windows), nie zamykając przedwcześnie napisu?

Do tego służy **sekwencja ucieczki**: para znaków rozpoczynająca się od ukośnika wstecznego `\`. Ukośnik mówi kompilatorowi, że następny znak ma specjalne znaczenie.

| Sekwencja | Znaczenie | Przykład w kodzie | Wynik w konsoli |
| :---: | --- | --- | --- |
| `\n` | Przejście do nowej linii | `"Wiersz 1\nWiersz 2"` | `Wiersz 1`<br>`Wiersz 2` |
| `\t` | Tabulator poziomy (wyrównanie kolumn) | `"Klucz:\tWartosc"` | <code style="white-space: pre; tab-size: 4;">Klucz:&#9;Wartosc</code> |
| `\"` | Dosłowny znak cudzysłowu | `"Tryb \"Cichy\""` | `Tryb "Cichy"` |
| `\\` | Dosłowny ukośnik wsteczny | `"C:\\Dane\\Logi"` | `C:\Dane\Logi` |

> [!TIP]
> Dla długich ścieżek Windows możesz postawić znak `@` przed otwierającym cudzysłowem, na przykład `@"C:\Dane\Logi"`. Taki **napis dosłowny** wyłącza interpretację ukośników wstecznych, więc nie musisz ich podwajać.

> [!WARNING]
> Wewnątrz napisu dosłownego `@"..."` sekwencja `\"` nie działa. Jeśli potrzebujesz cudzysłowu wewnątrz napisu ze znakiem `@`, zapisz dwa cudzysłowy obok siebie: `@"Tryb ""Cichy"""`.

### 🧭 Animacja kursora konsoli i sekwencji ucieczki

Prześledź na żywo, jak każda instrukcja przesuwa kursor terminala oraz jak zachowują się `\t`, `\n`, `\\`, `\"` i `@"..."`. Przełącz oba scenariusze i wykonaj wszystkie kroki, aby odblokować dalszą część lekcji:

<data-gate>
<data-csharp-console-sim></data-csharp-console-sim>
</data-gate>

Zauważ w pierwszym scenariuszu, że puste `Console.WriteLine()` po `Console.Write("C\nD")` jedynie zamyka wiersz z literą `D`. Pusty odstęp pojawiłby się dopiero po drugim wywołaniu `Console.WriteLine()`.

---

## 🚨 Czytanie błędów kompilatora i kaskada zgłoszeń

Komunikat kompilatora `csc` ma stały układ: `Plik.cs(Wiersz, Kolumna): error CSxxxx: Opis`. Nie zgaduj, co jest nie tak: numer wiersza i kod błędu wskazują dokładne miejsce usterki.

Cztery najczęstsze kody błędów na początku nauki C#:

- **_<code style="color: inherit;">CS1002</code> (`; expected`)_**: brakuje średnika `;` na końcu instrukcji. Jeśli wskazana linia wygląda poprawnie, spójrz na poprzednią niepustą linię nad nią.
  ```csharp
  Console.WriteLine("Start")   // BLAD CS1002: brak srednika na koncu
  ```
- **_<code style="color: inherit;">CS0103</code> (`The name '...' does not exist`)_**: literówka lub zła wielkość liter w nazwie. C# ściśle rozróżnia małe i wielkie litery (`Console` to nie `console`).
  ```csharp
  console.WriteLine("Start");  // BLAD CS0103: powinno byc Console
  ```
- **_<code style="color: inherit;">CS1010</code> (`Newline in constant`)_**: niezamknięty cudzysłów `"` w napisie albo niepoprawnie zapisany ukośnik przed cudzysłowem.
  ```csharp
  Console.WriteLine("Witaj);   // BLAD CS1010: brak zamykajacego cudzyslowu
  ```
- **_<code style="color: inherit;">CS1513</code> (`} expected`)_**: brakuje zamykającej klamry `}` kończącej metodę `Main()` albo klasę `Program`.

### 🔍 Przykład z analizą: dlaczego jeden błąd rodzi trzy komunikaty

Spójrz na poniższy program. Brakuje w nim wyłącznie jednego cudzysłowu w wierszu 7:

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Start systemu);
        Console.WriteLine("Gotowy.");
    }
}
```

Kompilator zgłosi aż trzy błędy naraz:

```text
Program.cs(7,27): error CS1010: Newline in constant
Program.cs(7,43): error CS1002: ; expected
Program.cs(9,6): error CS1513: } expected
```

Skąd wzięły się błędy **_CS1002_** i **_CS1513_**, skoro średnik i klamra są na swoich miejscach? Niedomknięty cudzysłów w linii 7 sprawił, że kompilator potraktował średnik na końcu wiersza jako część tekstu. Stracił orientację w strukturze pliku i zgłosił dwa fałszywe błędy wtórne. Po dopisaniu jednego znaku `"` przed nawiasem zamykającym wszystkie trzy komunikaty znikają jednocześnie.

> [!WARNING]
> Gdy kompilator wyświetli kilka błędów naraz, poprawiaj **wyłącznie pierwszy błąd od góry** i uruchom kompilację ponownie. Poprawianie błędów od dołu marnuje czas na fałszywe komunikaty z kaskady.

<data-gate>
<data-connection-matcher title="Kody błędów kompilatora C# vs przyczyna">
    <item left="CS1002 (; expected)" right="Brak średnika na końcu instrukcji"></item>
    <item left="CS0103 (The name does not exist)" right="Literówka lub zła wielkość liter w nazwie (np. console zamiast Console)"></item>
    <item left="CS1010 (Newline in constant)" right="Niezamknięty znak cudzysłowu wewnątrz napisu"></item>
    <item left="CS1513 (} expected)" right="Brakująca klamra zamykająca blok klasy lub metody"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Bajtkod CIL (ECMA-335), strumienie jądra OS (FD 0/1/2) i Tiered JIT x86-64</span>
<span class="deep-dive-badge">CIL · KERNEL OS · JIT X86-64</span>
</summary>
<div class="deep-dive-content">

<h4>1. Jak naprawdę wygląda Console.WriteLine("OK") po kompilacji?</h4>

W przeciwieństwie do C i C++, które od razu generują kod maszynowy konkretnego procesora, kompilator C# tworzy plik `.exe` z przenośnym bajtkodem _**CIL**_ (Common Intermediate Language, standard ECMA-335). Taki bajtkod działa na wirtualnej maszynie stosowej:

```text
.method private hidebysig static void Main() cil managed
{
    .entrypoint
    .maxstack 8
    IL_0000: ldstr      "OK"
    IL_0005: call       void [mscorlib]System.Console::WriteLine(string)
    IL_000a: ret
}
```

Instrukcja `ldstr` odkłada referencję do napisu `"OK"` na stos ewaluacji. Następnie `call` zdejmuje ten argument i wywołuje metodę `WriteLine`, a `ret` kończy działanie `Main()`. Ten sam plik `.exe` uruchomi się na procesorach Intel, AMD i ARM, ponieważ tłumaczenie na rozkazy konkretnego procesora zachodzi dopiero przy starcie aplikacji.

<h4>2. Wywołanie systemowe WriteFile i trzy deskryptory plików</h4>

Program działający w trybie użytkownika (User Mode) nie ma bezpośredniego dostępu do ekranu. Metoda `Console.WriteLine` zamienia znaki na bajty i wywołuje funkcję jądra Windows **`WriteFile`** z biblioteki `kernel32.dll` (w systemie Linux jest to wywołanie `write`). Każdy proces otrzymuje trzy osobne kanały komunikacji:

- **`FD 0` (`stdin`)**: standardowe wejście z klawiatury lub potoku, czytane przez `Console.ReadLine()`.
- **`FD 1` (`stdout`)**: standardowe wyjście danych (`Console.Out`), na które trafiają napisy z `Console.WriteLine()`.
- **`FD 2` (`stderr`)**: osobny kanał komunikatów błędów (`Console.Error`).

W wierszu poleceń możesz rozdzielić oba wyjścia do niezależnych plików:

```text
app.exe > wynik.txt 2> bledy.log
```

Dodatkowo `Console.WriteLine()` wstawia zakończenie wiersza właściwe dla systemu operacyjnego (`Environment.NewLine`): dwa bajty **CRLF** (`\r\n`) na Windows lub jeden bajt **LF** (`\n`) na Linuxie i macOS.

<h4>3. Dwupoziomowa kompilacja JIT</h4>

Środowisko uruchomieniowe _**CLR**_ (Common Language Runtime) korzysta z kompilatora _**JIT**_ (Just-In-Time), który tłumaczy bajtkod CIL na natywny asembler x86-64 w dwóch fazach:

- **Tier 0 (QuickJIT)**: szybka kompilacja bez ciężkich optymalizacji, aby program uruchomił się w ułamku milisekundy.
- **Tier 1 (Optimizing JIT)**: dla metod wywoływanych wielokrotnie wątek w tle rekompiluje kod do zoptymalizowanego kodu maszynowego (rozwija wywołania i przydziela rejestry CPU). Następnie podmienia adres metody w trakcie działania programu.

</div>
</details>

---

## 💻 Zadanie praktyczne: Diagnostyka błędów i formatowanie raportu

Twoje zadanie składa się z dwóch etapów. W edytorze poniżej znajduje się uszkodzony program zawierający **_cztery celowe błędy składniowe_**.

1. **Etap 1 (diagnostyka):** uruchom program, przeczytaj pierwszy błąd z raportu kompilatora i naprawaj usterki kolejno od góry, aż kod skompiluje się czysto.
2. **Etap 2 (samodzielne formatowanie):** dopisz brakującą końcówkę raportu zgodnie z podanym wzorem wyjścia.

Wymagany, dokładny wynik działania programu (7 wierszy, łącznie z pustym wierszem nr 5):

```text
=== RAPORT KOMPILACJI ===
Kompilator: csc (C# 5.0)
Katalog: C:\Projekty\CSharp
Tryb: "Diagnostyka"

Status: OK
Plik:	"raport.log"
```

Wymagania techniczne dla etapu 2:
- Po wierszu `Tryb: "Diagnostyka"` wstaw dokładnie jeden pusty wiersz za pomocą pustego wywołania `Console.WriteLine()`.
- Wiersz `Status: OK` zbuduj z dwóch osobnych instrukcji: pierwsza wypisuje samą etykietę bez przejścia do nowej linii, a druga dopisuje wartość i zamyka wiersz.
- Ostatni wiersz musi rozdzielać etykietę `Plik:` i nazwę `"raport.log"` znakiem tabulatora `\t`, a sama nazwa pliku ma być otoczona widocznymi cudzysłowami.

<data-gate>
<data-csharp-lab mode="mock" title="Diagnostyka składni i formatowanie raportu w C#" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;

class Program
{
    static void Main()
    {
        console.WriteLine("=== RAPORT KOMPILACJI ===");
        Console.WriteLine("Kompilator: csc (C# 5.0)")
        Console.WriteLine("Katalog: C:\Projekty\CSharp");
        Console.WriteLine("Tryb: "Diagnostyka"");
        // TODO: Wstaw pusty wiersz
        // TODO: Wypisz "Status: OK" za pomoca Console.Write oraz Console.WriteLine
        // TODO: Wypisz etykiete Plik:, tabulator oraz nazwe raport.log w cudzyslowach
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("Program kompiluje sie i wypisuje dokladnie 7 wierszy (w tym pusty wiersz nr 5)", () => {
    string output = LabAssert.RunMainAndCapture().TrimEnd();
    string[] lines = output.Replace("\r\n", "\n").Split('\n');
    LabAssert.Equal(7, lines.Length);
    LabAssert.Equal("=== RAPORT KOMPILACJI ===", lines[0]);
    LabAssert.Equal("Kompilator: csc (C# 5.0)", lines[1]);
    LabAssert.Equal(@"Katalog: C:\Projekty\CSharp", lines[2]);
    LabAssert.Equal("Tryb: \"Diagnostyka\"", lines[3]);
    LabAssert.Equal("", lines[4]);
    LabAssert.Equal("Status: OK", lines[5]);
    LabAssert.Equal("Plik:\t\"raport.log\"", lines[6]);
});
LabAssert.Test("Ostatni wiersz zawiera znak tabulatora i widoczne cudzyslowy", () => {
    string output = LabAssert.RunMainAndCapture().TrimEnd();
    string[] lines = output.Replace("\r\n", "\n").Split('\n');
    LabAssert.True(lines.Length >= 7, "Brakuje wiersza z nazwa pliku.");
    LabAssert.True(lines[6].Contains("\t"), "W wierszu 7 brakuje znaku tabulatora \\t.");
    LabAssert.True(lines[6].Contains("\"raport.log\""), "Nazwa raport.log musi byc otoczona cudzyslowami.");
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Kiedy użyć <code>Write</code>, a kiedy <code>WriteLine</code>?</strong> Wybieraj `Console.Write`, gdy chcesz zostawić kursor w tym samym wierszu (na przykład przed `Console.ReadLine()` lub przy sklejaniu fragmentów linii). Wybieraj `Console.WriteLine`, gdy kończysz wiersz, a puste `Console.WriteLine()`, gdy wstawiasz odstęp.
- <strong>Kiedy użyć <code>\\</code>, a kiedy <code>@"..."</code>?</strong> W zwykłych napisach stosuj sekwencje ucieczki (`\n`, `\t`, `\"`, `\\`). Gdy wpisujesz długą ścieżkę Windows z wieloma ukośnikami, dodaj przedrostek `@"C:\..."`, pamiętając o podwajaniu cudzysłowów `""`.
- <strong>Jak reagować na listę kilku błędów kompilatora?</strong> Zawsze naprawiaj wyłącznie pierwszy błąd od góry (`CS1002`, `CS0103`, `CS1010`, `CS1513`) i uruchamiaj kompilację ponownie, ponieważ błędy poniżej często są fałszywą kaskadą.
- <strong>Jak czytać szkielet programu C#?</strong> Wykonanie zawsze startuje w metodzie `static void Main()` wewnątrz klasy, pojedyncze instrukcje kończą się średnikiem `;`, a notatki po `//` lub wewnątrz `/* ... */` są pomijane przez kompilator.
