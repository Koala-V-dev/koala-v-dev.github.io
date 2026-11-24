# Obsługa błędów, Guard Clause i wyjątki

Wyobraź sobie program, który skanuje folder użytkownika na Windows 11. Przez pierwsze dziewięćset plików wszystko działa bez zarzutu. Przy pliku numer dziewięćset jeden przeglądarka trzyma blokadę na pobieranym archiwum, a system odmawia dostępu.

Bez zabezpieczenia cały proces kończy się natychmiastowym zamknięciem okna. Tracisz raport z poprzednich dziewięciuset plików, a użytkownik widzi jedynie czerwony ekran z komunikatem technicznym.

Gdy dopiero uczysz się programować, kusi Cię otaczanie każdego kroku kolejnymi instrukcjami `if`. Taki kod szybko zamienia się w pięciopoziomową piramidę wcięć, w której trudno odróżnić logikę biznesową od sprawdzania błędów. Środowisko .NET rozwiązuje ten problem przez dwa uzupełniające się mechanizmy: **wzorzec Guard Clause** oraz strukturę **`try / catch / finally`** z blokiem **`using`**.

---

## 🛡️ Wzorzec Guard Clause i hierarchia wyjątków

Wzorzec **Guard Clause** (klauzula strażnicza) polega na natychmiastowym odrzucaniu błędnych argumentów w pierwszych liniach metody. Zamiast wsuwać właściwy kod głęboko w gałęzie `else`, przerywasz wykonanie instrukcją `throw new ...` już przy pierwszym wykrytym naruszeniu kontraktu.

```csharp
public static string ZbudujAdresSerwera(string host, int port)
{
    if (string.IsNullOrWhiteSpace(host))
        throw new ArgumentException("Nazwa hosta nie moze byc pusta.", "host");

    if (port < 1 || port > 65535)
        throw new ArgumentOutOfRangeException("port", "Port TCP musi miescic sie w zakresie 1-65535.");

    return host.Trim() + ":" + port;
}
```

Zwróć uwagę na wcięcia w powyższym przykładzie. Główna logika (`return ...`) leży na zerowym poziomie i uruchamia się dopiero wtedy, gdy wszystkie strażniki przepuszczą dane wejściowe.

### ⚠️ Pułapka kolejności parametrów konstruktorów

Konstruktory wyjątków z rodziny argumentów mają w .NET zdradliwą różnicę w kolejności parametrów. Jeśli je pomylisz, kod skompiluje się bez ostrzeżenia, ale wygeneruje mylący komunikat błędu.

| Typ wyjątku | Kolejność parametrów konstruktora | Poprawny zapis w C# 5.0 |
| --- | --- | --- |
| `ArgumentException` | `(wiadomosc, nazwaParametru)` | `new ArgumentException("Pusty napis.", "host")` |
| `ArgumentNullException` | `(nazwaParametru, wiadomosc)` | `new ArgumentNullException("lista", "Brak danych.")` |
| `ArgumentOutOfRangeException` | `(nazwaParametru, wiadomosc)` | `new ArgumentOutOfRangeException("port", "Poza zakresem.")` |

> [!WARNING]
> Jeśli w `ArgumentNullException` podasz najpierw komunikat, a potem nazwę parametru, środowisko CLR potraktuje cały komunikat jako nazwę zmiennej. W logach zobaczysz wtedy absurdalny wpis: **_Nazwa parametru: Wartość nie może być pusta_**.

### 🌳 Hierarchia wyjątków w .NET

Wszystkie wyjątki w C# dziedziczą po klasie bazowej _**`System.Exception`**_. Dobór konkretnego typu mówi wywołującemu dokładnie, co zawiodło i czy program może ten problem naprawić.

| Typ wyjątku | Dziedziczy po | Kiedy go rzucasz lub łapiesz? |
| --- | --- | --- |
| `ArgumentException` | `SystemException` | Nieprawidłowa treść argumentu (pusty napis, niedozwolone znaki) |
| `ArgumentNullException` | `ArgumentException` | Przekazano `null` tam, gdzie wymagany jest obiekt lub kolekcja |
| `ArgumentOutOfRangeException` | `ArgumentException` | Wartość poza dozwolonym przedziałem (ujemny rozmiar, błędny port) |
| `InvalidOperationException` | `SystemException` | Argumenty są poprawne, ale obiekt jest w złym stanie (np. zdjęcie z pustego stosu) |
| `KeyNotFoundException` | `SystemException` | Próba odczytu nieistniejącego klucza przez indeksator słownika `mapa[klucz]` |
| `NullReferenceException` | `SystemException` | Wywołanie metody lub właściwości na zmiennej równej `null` (błąd w kodzie) |
| `FormatException` | `SystemException` | Napis nie daje się zamienić na liczbę (np. `int.Parse("abc")`) |
| `OverflowException` | `ArithmeticException` | Liczba przekracza zakres typu docelowego (np. `int.Parse("99999999999")`) |
| `IOException` | `SystemException` | Błąd operacji dyskowej, zablokowany plik lub odłączony nośnik |
| `FileNotFoundException` | `IOException` | Podana ścieżka pliku nie istnieje na dysku |
| `UnauthorizedAccessException` | `SystemException` | System Windows odmówił praw odczytu lub zapisu do pliku |

### 🔎 Sprawdzanie zakazanych znaków metodą IndexOfAny

Strażnik bardzo często musi odrzucić tekst zawierający choćby jeden znak z czarnej listy. Pisanie siedmiu osobnych wywołań `Contains` zaciemnia kod i wielokrotnie skanuje ten sam napis.

Klasa `string` udostępnia w tym celu metodę **`IndexOfAny(char[] anyOf)`**. Przeszukuje ona napis dokładnie raz i zwraca indeks pierwszego napotkanego znaku z tablicy lub `-1`, gdy żaden z zakazanych znaków nie występuje.

```csharp
public static string WalidujLogin(string login)
{
    if (string.IsNullOrWhiteSpace(login))
        throw new ArgumentException("Login nie moze byc pusty.", "login");

    char[] zakazane = new char[] { ' ', '@', '#', '$' };
    if (login.IndexOfAny(zakazane) >= 0)
        throw new ArgumentException("Login zawiera niedozwolony znak.", "login");

    return login.Trim();
}
```

Tę samą technikę stosuje się w ochronie przed atakiem **_Path Traversal_**. Jeśli użytkownik poda nazwę pliku zawierającą sekwencję `".."` albo separatory katalogów `'/'` i `'\\'`, może wyjść z folderu aplikacji i nadpisać pliki systemowe Windows. Połączenie sprawdzenia `".."` z `IndexOfAny` na tablicy zakazanych znaków zamyka tę lukę na samym wejściu metody.

---

## 🔍 Czytanie obiektu Exception i stosu wywołań StackTrace

Kiedy w programie pada wyjątek, środowisko CLR tworzy obiekt klasy dziedziczącej po `Exception` i wypełnia jego właściwości diagnostyczne. Dwie z nich są kluczowe przy szukaniu przyczyny awarii:

- **`Message`**: zwięzły opis problemu przekazany w konstruktorze wyjątku.
- **`StackTrace`**: pełna historia **ramek wywołań** (od miejsca powstania błędu w górę aż do metody `Main`).

Przeanalizuj przykładowy zrzut błędu wypisany przez środowisko uruchomieniowe:

```text
System.FormatException: Nieprawidłowy format ciągu wejściowego.
   w System.Number.StringToNumber(String str, NumberStyles options, ...)
   w System.Int32.Parse(String s)
   w Sklep.PoliczCene(String tekst) w Program.cs:wiersz 42
   w Sklep.Main() w Program.cs:wiersz 15
```

Stos wywołań czytaj zawsze **od góry do dołu**. Pierwsze linie wskazują wnętrze biblioteki .NET, w którym rzucono wyjątek (`Int32.Parse`). Pierwsza linia z nazwą Twojej klasy (`Sklep.PoliczCene`, wiersz 42) pokazuje dokładne miejsce, w którym przekazałeś błędne dane.

---

## 🔄 Przepływ try catch finally i zwalnianie zasobów

Gdy wewnątrz bloku `try` wystąpi wyjątek, środowisko CLR natychmiast przerywa wykonywanie pozostałych instrukcji w tym bloku. Następnie sprawdza po kolei bloki `catch` i wchodzi w pierwszy, którego typ pasuje do rzuconego obiektu.

Blok **`finally`** wykonuje się **zawsze**, niezależnie od wyniku bloku `try` i `catch`:

| Scenariusz wykonania bloku `try` | Czy wykona się `catch`? | Czy wykona się `finally`? |
| --- | --- | --- |
| Kod w `try` kończy się bez błędu | Nie | **Tak** |
| Kod w `try` wykonuje instrukcję `return` | Nie | **Tak** (przed wyjściem z metody) |
| W `try` pada wyjątek pasujący do `catch` | **Tak** (pierwszy pasujący) | **Tak** (po zakończeniu `catch`) |
| W `try` pada wyjątek nieobsłużony w `catch` | Nie (leci wyżej na stos) | **Tak** (przed opuszczeniem metody) |

> [!WARNING]
> Kolejność bloków `catch` jest weryfikowana podczas kompilacji. Zawsze umieszczaj typy bardziej szczegółowe nad ogólniejszymi (na przykład `FileNotFoundException` przed `IOException`, a `ArgumentNullException` przed `ArgumentException`). Odwrotna kolejność wywoła **_błąd kompilacji CS0160_**, ponieważ ogólny blok przechwyciłby wszystkie przypadki z klasy pochodnej.

<data-gate>
<data-sortable-list title="Ułóż bloki catch od najbardziej szczegółowego do najbardziej ogólnego (zgodnie z wymogami kompilatora C#)">
  <item data-correct="3">catch (SystemException ex) // klasa bazowa wyjątków środowiska .NET</item>
  <item data-correct="1">catch (FileNotFoundException ex) // konkretny brak pliku pod podaną ścieżką</item>
  <item data-correct="4">catch (Exception ex) // najogólniejsza klasa bazowa wszystkich wyjątków</item>
  <item data-correct="2">catch (IOException ex) // ogólny błąd operacji wejścia/wyjścia i dysku</item>
</data-sortable-list>
</data-gate>

### 🔹 Strumienie Stream, StreamReader i piętrowy blok using

W .NET plik na dysku nie jest odczytywany jak zwykła tablica w pamięci RAM. System operacyjny udostępnia go jako _**`Stream`**_, czyli abstrakcyjny potok bajtów, z którego program czyta dane porcjami.

Jeśli pracujesz z plikiem tekstowym, owijasz strumień w **`StreamReader`**. Ta klasa dekoduje surowe bajty na znaki (domyślnie UTF-8) i udostępnia wygodną metodę `ReadLine()`.

Każdy otwarty strumień rezerwuje w jądrze Windows **uchwyt pliku**. Jeśli przed jego zamknięciem padnie wyjątek, plik pozostanie zablokowany dla innych programów aż do zamknięcia Twojej aplikacji. Klasy zarządzające takimi zasobami implementują interfejs _**`IDisposable`**_ z metodą `Dispose()`.

Otoczenie zasobu blokiem **`using (...)`** gwarantuje wywołanie `Dispose()` nawet przy wyjątku lub wczesnym `return`:

```csharp
try
{
    using (var czytnik = new StreamReader(sciezkaKonfiguracji))
    {
        string pierwszaLinia = czytnik.ReadLine();
        Console.WriteLine("Konfiguracja: " + pierwszaLinia);
    } // Tu niejawnie wywoluje sie czytnik.Dispose() nawet przy wyjatku
}
catch (FileNotFoundException)
{
    Console.WriteLine("Brak pliku konfiguracji: " + sciezkaKonfiguracji);
}
catch (IOException ex)
{
    Console.WriteLine("Blad odczytu dysku: " + ex.Message);
}
```

Gdy jednocześnie otwierasz dwa zasoby (na przykład czytasz z jednego pliku i zapisujesz do drugiego), nie musisz zagnieżdżać podwójnych klamr. W C# układasz wtedy **piętrowy blok `using`**:

```csharp
using (var czytnik = new StreamReader(sciezkaWejsciowa))
using (var pisarz = new StreamWriter(sciezkaWyjsciowa))
{
    string linia = czytnik.ReadLine();
    if (linia != null)
    {
        pisarz.WriteLine(linia.ToUpperInvariant());
    }
}
```

Środowisko zwalnia zasoby w kolejności odwrotnej do ich otwarcia: najpierw wywołuje `pisarz.Dispose()`, a następnie `czytnik.Dispose()`. Nawet jeśli zapis rzuci `IOException`, oba uchwyty zostaną poprawnie zwrócone do systemu Windows.

---

## 🚫 Antywzorce obsługi wyjątków i drzewo decyzyjne

Sama obecność bloku `try / catch` nie czyni programu bezpiecznym. Dwa bardzo częste błędy potrafią zamienić obsługę wyjątków w ukrytą bombę zegarową.

### 🕳️ Antywzorzec 1: Połykanie wyjątków pustym blokiem catch

```csharp
try
{
    ZapiszUstawienia(sciezka, konfiguracja);
}
catch (Exception)
{
    // ZLE: pusty blok ukrywa kazda awarie!
}
```

Pusty `catch (Exception) { }` sprawia, że aplikacja **_połyka wyjątek_** i udaje sukces. Program idzie dalej z pustą konfiguracją albo uszkodzonym stanem, a awaria ujawnia się pięć minut później w zupełnie innym module bez żadnej wskazówki o prawdziwej przyczynie. Łap wyłącznie te typy wyjątków, na które potrafisz świadomie zareagować (zalogować, pominąć zablokowany plik lub poprosić o poprawne dane).

### ✂️ Antywzorzec 2: Zniszczenie stosu wywołań przez throw ex

Czasami musisz zalogować błąd na poziomie bieżącej metody, a potem przekazać go wyżej do warstwy interfejsu użytkownika. Różnica między `throw ex;` a `throw;` jest krytyczna:

```csharp
catch (IOException ex)
{
    LogujBlad(ex.Message);
    throw ex; // ZLE: resetuje StackTrace do tej linii!
}

catch (IOException ex)
{
    LogujBlad(ex.Message);
    throw;    // DOBRZE: zachowuje pelna historie stosu wywolan!
}
```

Instrukcja **_`throw ex;`_** nadpisuje właściwość `StackTrace` i ustawia bieżący blok `catch` jako rzekome źródło błędu. Tracisz w ten sposób numer linii prawdziwej awarii. Samo **`throw;`** bez nazwy zmiennej przekazuje ten sam obiekt dalej z nienaruszonym stosem.

### 🧭 Drzewo decyzyjne: kiedy throw, a kiedy TryParse lub TryGetValue?

Wyjątki służą do sytuacji wyjątkowych, a nie do codziennego sterowania przepływem. Przy podejmowaniu decyzji kieruj się poniższą tabelą:

| Sytuacja w programie | Czy to sytuacja wyjątkowa? | Właściwy mechanizm w C# |
| --- | --- | --- |
| Użytkownik wpisał tekst zamiast liczby w konsoli | Nie (typowe dane wejściowe) | `int.TryParse(tekst, out wynik)` |
| Sprawdzasz, czy klucz istnieje w słowniku | Nie (normalne zapytanie) | `mapa.TryGetValue(klucz, out wartosc)` |
| Wywołujący przekazał `null` lub ujemny rozmiar do metody | Tak (złamanie kontraktu) | Guard Clause + `throw new Argument...` |
| Dysk odmawia dostępu lub plik jest zablokowany | Tak (awaria środowiska) | `try / catch (IOException)` + `using` |

> [!TIP]
> Jeśli sprawdzasz warunek w pętli wykonującej się tysiące razy na sekundę, zawsze wybieraj metody z przedrostkiem `Try` (`TryParse`, `TryGetValue`). Wyjątki rezerwuj dla naruszeń kontraktu i błędów zewnętrznych zasobów.

<data-gate>
<data-connection-matcher title="Dopasuj sytuację awaryjną lub przypadek z kodu do właściwej reakcji w C#">
  <item left="Wywołujący przekazał null zamiast listy do publicznej metody silnika" right="Guard Clause: throw new ArgumentNullException z nazwą parametru"></item>
  <item left="Przeglądarka trzyma wyłączną blokadę na pliku podczas skanowania folderu" right="Obsługa konkretnego catch (IOException) i bezpieczne pominięcie pliku"></item>
  <item left="Użytkownik wpisał litery w polu na numer portu w pętli wejścia" right="Użycie int.TryParse bez rzucania i łapania wyjątków"></item>
  <item left="Zalogowałeś wyjątek dyskowy i chcesz przekazać go wyżej bez utraty StackTrace" right="Ponowne rzucenie przez samo throw; bez nazwy zmiennej"></item>
  <item left="Otwierasz plik przez StreamReader i chcesz zamknąć uchwyt nawet po błędzie" right="Otoczenie strumienia blokiem using (...) wykorzystującym IDisposable"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Zero-Cost Exception Handling w CLR, Stack Unwinding i C++ RAII kontra using w C#</span>
<span class="deep-dive-badge">CLR · C++ RAII · KOMPILATOR ROSLYN</span>
</summary>
<div class="deep-dive-content">

<h4>1. Zero-Cost Exception Handling: dlaczego try nic nie kosztuje, a throw jest bardzo drogi?</h4>
Wielu początkujących programistów obawia się, że samo dodanie bloku `try` spowolni pętlę. Nowoczesny CLR (podobnie jak kompilatory C++ na architekturze x86-64) stosuje model **Zero-Cost Exception Handling**.

Kompilator JIT nie wstawia w kod maszynowy żadnych instrukcji `if (error)` na normalnej ścieżce wykonania (Happy Path). Zamiast tego zapisuje obok kodu metody statyczną tabelę metadanych (**EH Table**, czyli Exception Handling Table) z zakresami adresów instrukcji: „jeśli błąd nastąpi między adresem `0x0040` a `0x0078`, skocz do bloku `catch` pod adresem `0x0090`”. Gdy nie ma błędu, procesor wykonuje **zero dodatkowych instrukcji**.

Koszt pojawia się dopiero w momencie wykonania `throw`:
1. CLR alokuje obiekt wyjątku na stercie i przechodzi przez wszystkie ramki stosu wywołań, aby zbudować napis `StackTrace`.
2. Środowisko przeszukuje tablice EH kolejnych metod w górę stosu (dwuprzebiegowa obsługa wyjątków w Windows SEH).
3. Po znalezieniu pasującego `catch` następuje **rozwijanie stosu** (Stack Unwinding): wykonywane są wszystkie pośrednie bloki `finally`, a lokalne ramki stosu są zwalniane.

Pojedyncze rzucenie i złapanie wyjątku kosztuje zwykle od **20 000 do 100 000 cykli CPU** (dziesiątki mikrosekund). Dlatego wyjątków używa się do rzadkich sytuacji awaryjnych, a nigdy do sterowania zwykłą pętlą.

<h4>2. C++ RAII kontra IDisposable i obniżanie using przez Roslyn</h4>
W **C++** nie ma Garbage Collectora. Zasoby systemowe (uchwyty plików, gniazda sieciowe, blokady wątków) owija się w klasy zgodnie z zasadą **RAII** (Resource Acquisition Is Initialization). Destruktor `~Plik()` jest wywoływany **deterministycznie** przez sam kompilator dokładnie w chwili opuszczenia klamry `}`:
```cpp
void czytaj(const std::string& sciezka) {
    std::ifstream plik(sciezka); // Otwarcie uchwytu w konstruktorze
    if (!plik) throw std::runtime_error("Blad otwarcia");
    // ... odczyt danych ...
} // Kompilator automatycznie wstawia wywolanie ~ifstream() nawet przy wyjatku
```
W **C#** Garbage Collector zwalnia pamięć w nieprzewidywalnym momencie (czasem dopiero po wielu minutach). Gdyby zamknięcie pliku zależało od GC, plik na Windows pozostałby zablokowany na długo po zakończeniu metody.

Dlatego C# wprowadził interfejs `IDisposable` i cukier składniowy `using`. Kompilator **Roslyn** podczas obniżania składni (lowering) zamienia każdy blok `using` dokładnie na konstrukcję `try / finally`:
```csharp
// Twoj kod:
using (var s = File.OpenRead(sciezka))
{
    Przetworz(s);
}

// Kod po obnizeniu przez kompilator Roslyn (to trafia do bajtkodu CIL):
FileStream s = File.OpenRead(sciezka);
try
{
    Przetworz(s);
}
finally
{
    if (s != null)
    {
        ((IDisposable)s).Dispose();
    }
}
```
Dzięki temu C# łączy wygodę Garbage Collectora z deterministycznym zwalnianiem uchwytów systemu operacyjnego.

</div>
</details>

---

## 💻 Zadanie praktyczne: Bezpieczny walidator nazw plików i odporny parser z dziennikiem

W klasie `BezpiecznePliki` zaimplementuj dwie metody:

1. **`WalidujNazwePliku(string nazwa)`** (wzorzec Guard Clause):
   - jeśli `string.IsNullOrWhiteSpace(nazwa)` jest prawdziwe, rzuć `ArgumentException`,
   - jeśli *nazwa* zawiera sekwencję `".."`, znaki separatora katalogów `'/'` lub `'\\'` albo którykolwiek z niedozwolonych znaków nazwy pliku Windows (`':'`, `'*'`, `'?'`, `'"'`, `'<'`, `'>'`, `'|'`), rzuć `ArgumentException` (zdefiniuj jawną tablicę `char[]` i użyj `IndexOfAny`, aby ochrona przed atakiem **_Path Traversal_** działała identycznie na Windows i Linux),
   - dla poprawnej nazwy zwróć `nazwa.Trim()`.
2. **`AnalizujRozmiary(List<string> teksty, List<string> dziennik)`** (osobne bloki `catch` + `finally`):
   - jeśli *teksty* lub *dziennik* ma wartość `null`, rzuć `ArgumentNullException` z poprawną nazwą parametru (`"teksty"` lub `"dziennik"`),
   - przejdź po wszystkich elementach listy *teksty*; jeśli element jest równy `null`, pomiń go bez dopisywania niczego do dziennika (`continue;`),
   - dla każdego niepustego wpisu użyj `try / catch / finally` z wywołaniem `int.Parse(wpis)` (w tym zadaniu celowo stosujemy `int.Parse`, aby przećwiczyć rozdzielenie typów wyjątków oraz gwarancję bloku `finally`):
     - w bloku `try`: jeśli sparsowana liczba jest dodatnia (`> 0`), dodaj ją do sumy typu `long`,
     - w bloku `catch (FormatException)`: dodaj do *dziennik* napis `"FORMAT"`,
     - w bloku `catch (OverflowException)`: dodaj do *dziennik* napis `"OVERFLOW"`,
     - w bloku `finally`: **zawsze** dodaj do *dziennik* napis `"KONIEC"`,
   - zwróć sumę wszystkich poprawnych, dodatnich wartości jako `long`.

<data-gate>
<data-csharp-lab title="Zadanie: Guard Clause, Path Traversal oraz osobne bloki catch i finally" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;

public class BezpiecznePliki
{
    public static string WalidujNazwePliku(string nazwa)
    {
        // Guard Clause: odrzuc pusta nazwe, "..", "/", "\" i niedozwolone znaki Windows
        return "";
    }

    public static long AnalizujRozmiary(List<string> teksty, List<string> dziennik)
    {
        // Guard Clause: sprawdz null dla teksty oraz dziennik (ArgumentNullException)
        // Pomin wpisy null; dla pozostalych uzyj try / catch (FormatException) / catch (OverflowException) / finally
        return 0L;
    }

    static void Main()
    {
        Console.WriteLine("Poprawna nazwa: " + WalidujNazwePliku("  raport.pdf  "));
        var dane = new List<string> { "120", "blad", "-50", null, "880", "99999999999999" };
        var dziennik = new List<string>();
        long suma = AnalizujRozmiary(dane, dziennik);
        Console.WriteLine("Suma poprawnych: " + suma);
        Console.WriteLine("Dziennik: " + string.Join(", ", dziennik));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("WalidujNazwePliku oczyszcza poprawna nazwe i odrzuca puste napisy", () => {
    LabAssert.Equal("raport.pdf", BezpiecznePliki.WalidujNazwePliku("  raport.pdf  "));
    LabAssert.Equal("kopia_2026.tar.gz", BezpiecznePliki.WalidujNazwePliku("kopia_2026.tar.gz"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku(null));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku(""));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("   "));
});
LabAssert.Test("WalidujNazwePliku blokuje Path Traversal i niedozwolone znaki Windows", () => {
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("../windows/system32"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku(@"folder\plik.txt"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("a/b.txt"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("raport:2026.pdf"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("plik*.txt"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("dane?.csv"));
    LabAssert.Throws<ArgumentException>(() => BezpiecznePliki.WalidujNazwePliku("plik|test.txt"));
});
LabAssert.Test("AnalizujRozmiary waliduje null dla obu parametrow i obsluguje pusta liste", () => {
    LabAssert.Throws<ArgumentNullException>(() => BezpiecznePliki.AnalizujRozmiary(null, new List<string>()));
    LabAssert.Throws<ArgumentNullException>(() => BezpiecznePliki.AnalizujRozmiary(new List<string>(), null));
    var dziennik = new List<string>();
    LabAssert.Equal(0L, BezpiecznePliki.AnalizujRozmiary(new List<string>(), dziennik));
    LabAssert.Equal(0, dziennik.Count);
});
LabAssert.Test("AnalizujRozmiary rozdziela FormatException, OverflowException, zawsze wykonuje finally i sumuje jako long", () => {
    var dane = new List<string> { "2000000000", "blad", "-50", null, "1500000000", "99999999999999" };
    var dziennik = new List<string>();
    long wynik = BezpiecznePliki.AnalizujRozmiary(dane, dziennik);
    LabAssert.Equal(3500000000L, wynik);
    string zapisDziennika = string.Join(",", dziennik);
    LabAssert.Equal("KONIEC,FORMAT,KONIEC,KONIEC,KONIEC,OVERFLOW,KONIEC", zapisDziennika);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Gdy piszesz metodę przyjmującą dane z zewnątrz, zastosuj **Guard Clause** na samym jej początku i sprawdzaj kolejność argumentów konstruktorów wyjątków (`ArgumentException` bierze najpierw komunikat, a `ArgumentNullException` i `ArgumentOutOfRangeException` najpierw nazwę parametru).
- Gdy diagnozujesz awarię, czytaj **`StackTrace`** od góry do dołu, a przy przekazywaniu błędu wyżej po zalogowaniu używaj wyłącznie **`throw;`** zamiast niszczącego stos **_`throw ex;`_**.
- Gdy otwierasz plik lub strumień (`Stream`, `StreamReader`), zawsze otaczaj go blokiem **`using (...)`** (lub piętrowym `using` dla wielu zasobów), aby gwarantować wywołanie `Dispose()` nawet przy wyjątku.
- Gdy kod obsługuje typowe, spodziewane dane wejściowe lub zapytania do słownika, wybieraj **`TryParse`** i **`TryGetValue`**; wyjątki oraz konkretne bloki `catch` (ułożone od najbardziej szczegółowego do ogólnego) rezerwuj dla naruszeń kontraktu i błędów zasobów.
