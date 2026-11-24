# Słowniki Dictionary i tablice haszujące

Wyobraź sobie, że analizujesz 50 000 wpisów z dziennika serwera. Dla każdego wpisu chcesz natychmiast znaleźć przypisaną regułę albo policzyć, ile razy dany identyfikator pojawił się w logach. Gdybyś za każdym razem przeszukiwał zwykłą listę `List<T>` od początku, program wykonałby ponad miliard porównań.

Rozwiązaniem jest **`Dictionary<TKey, TValue>`**: _**tablica haszująca**_, która zamienia dowolny **klucz** na przypisaną mu **wartość** w jednym bezpośrednim skoku do pamięci. Czas wyszukiwania pozostaje stały niezależnie od tego, czy słownik przechowuje 10, czy 1 000 000 wpisów.

---

## 🔑 Jak słownik znajduje wartość bez przeszukiwania pętli

Kiedy pytasz słownik o klucz `"linux"`, C# nie przegląda wpisów po kolei. Najpierw wylicza z klucza liczbę całkowitą metodą `GetHashCode()`, wyznacza resztę z dzielenia przez liczbę kubełków (`buckets.Length`) i od razu zagląda pod ten konkretny indeks:

| Krok | Co robi `Dictionary<string, string>`? | Przykład dla klucza `"linux"` (7 kubełków) |
| --- | --- | --- |
| 1. Skrót klucza | Wywołuje `comparer.GetHashCode("linux")` i zeruje bit znaku | `hash = 1 482 910 315` |
| 2. Wybór kubełka | Oblicza `indeks = hash % 7` | `1 482 910 315 % 7 = 5` |
| 3. Odczyt | Skacze wprost do kubełka nr `5`, sprawdza `Equals` i zwraca wartość | `"System operacyjny"` |

Zamiast 50 000 porównań w pętli program wykonuje jedno obliczenie skrótu i jedno sprawdzenie kubełka. W słowniku **`Dictionary<TKey, TValue>`** obowiązują dwie podstawowe zasady:

- **Klucze muszą być unikalne:** ponowne wywołanie `.Add("linux", ...)` dla istniejącego już klucza kończy się wyjątkiem **_ArgumentException_**.
- **Wartości mogą się powtarzać:** różne klucze (na przykład `"ubuntu"` i `"fedora"`) mogą wskazywać na tę samą wartość `"Linux"`.

---

## 🛡️ Bezpieczny odczyt TryGetValue, pułapka null i default(T)

Jeśli spróbujesz odczytać nieistniejący klucz indekserem `slownik["nieznany"]`, program natychmiast przerwie działanie wyjątkiem **_KeyNotFoundException_**. Bezpieczny odczyt niepewnego klucza wykonujesz zawsze metodą **`TryGetValue`**:

```csharp
using System;
using System.Collections.Generic;

var opisyTagow = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    { "csharp", "Jezyk obiektowy na platforme .NET" },
    { "sql", "Jezyk zapytan do baz danych" },
    { "git", "System kontroli wersji" }
};

string opis;
if (!opisyTagow.TryGetValue("CSHARP", out opis))
{
    opis = "Brak opisu tagu";
}
// opis == "Jezyk obiektowy na platforme .NET"
```

Przekazanie **`StringComparer.OrdinalIgnoreCase`** do konstruktora sprawia, że słownik traktuje `"csharp"`, `"CSHARP"` i `"CSharp"` jako ten sam klucz. Wylicza dla nich identyczny skrót i porównuje je bez rozróżniania wielkości liter.

> [!WARNING]
> W `Dictionary<TKey, TValue>` klucz nigdy nie może mieć wartości `null`. Zarówno odczyt `slownik[null]`, jak i bezpieczne z pozoru wywołanie `slownik.TryGetValue(null, out wynik)` rzucają natychmiast wyjątek **_ArgumentNullException_**. Zanim zapytasz słownik o napis z zewnątrz, sprawdź najpierw `if (string.IsNullOrEmpty(klucz))`.

### ⚙️ Co wpisuje parametr out gdy klucza brakuje

Metoda `TryGetValue` zwraca `bool` i zawsze inicjalizuje zmienną przekazaną przez `out`. Gdy klucza nie ma w słowniku, zmienna `out` otrzymuje _**wartość domyślną typu**_ `default(TValue)`:

- dla typów liczbowych (`int`, `long`, `double`) jest to `0`,
- dla `bool` jest to `false`,
- dla typów referencyjnych (`string`, `List<string>`) jest to `null`.

Ta mechanika jest niezwykle przydatna w słownikach liczbowych `Dictionary<string, int>`, ponieważ brakujący klucz od razu daje `0`. Jednak w słowniku `Dictionary<string, List<string>>` wynik `out lista` przy braku klucza wynosi `null`, więc próba wywołania `lista.Add(...)` bez utworzenia listy rzuci **_NullReferenceException_**.

### 📊 Wzorzec licznika wystąpień i różnica zapisu przez []

Dzięki temu, że `TryGetValue` wpisuje `0` dla nieistniejącego klucza, budowanie histogramów częstości wymaga zaledwie kilku linii kodu:

```csharp
var tagi = new List<string> { "sql", "git", "SQL", "csharp", "git", "git" };
var licznik = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

foreach (string tag in tagi)
{
    int ile;
    licznik.TryGetValue(tag, out ile); // Gdy klucza brak, ile dostaje 0
    licznik[tag] = ile + 1;            // Zapis [] dodaje nowy klucz lub nadpisuje stary
}
// Wynik: "sql" -> 2, "git" -> 3, "csharp" -> 1
```

Zapamiętaj różnicę między odczytem a zapisem przez nawiasy kwadratowe:

- **Odczyt** `int x = licznik[klucz];` rzuca **_KeyNotFoundException_**, gdy klucza nie ma.
- **Zapis** `licznik[klucz] = wartosc;` nigdy nie rzuca wyjątku o duplikacie: tworzy nowy wpis albo nadpisuje istniejący.

> [!TIP]
> Gdy budujesz stałą tabelę mapowań (na przykład rozszerzenia plików na kategorie), nie twórz nowego słownika wewnątrz metody przy każdym wywołaniu. Zapisz go raz jako pole klasy `private static readonly Dictionary<string, string>`, aby uniknąć wielokrotnych alokacji pamięci.

---

## 🔄 Iteracja po słowniku i porównanie z HashSet

Gdy chcesz przejrzeć wszystkie pary zgromadzone w słowniku, używasz pętli `foreach` z typem **`KeyValuePair<TKey, TValue>`** (albo słowem kluczowym `var`). Każdy element ma dwie właściwości tylko do odczytu: `.Key` oraz `.Value`.

```csharp
foreach (KeyValuePair<string, int> para in licznik)
{
    Console.WriteLine(para.Key + ": " + para.Value);
}

// Gdy potrzebujesz wyłącznie kluczy lub wyłącznie wartości:
foreach (string klucz in licznik.Keys)
{
    Console.WriteLine("Klucz: " + klucz);
}

foreach (int wartosc in licznik.Values)
{
    Console.WriteLine("Liczba wystapien: " + wartosc);
}
```

Podobnie jak w `List<T>`, modyfikowanie słownika (dodawanie lub usuwanie kluczy) wewnątrz `foreach` przerywa program wyjątkiem **_InvalidOperationException_**. Nie polegaj też na kolejności wpisów po usunięciach: tablica haszująca optymalizuje szybkość dostępu, a nie porządek alfabetyczny.

### 🎯 Kiedy zamiast Dictionary wybrać HashSet

Często nie potrzebujesz powiązania klucza z wartością. Chcesz jedynie szybko sprawdzać, czy dany adres IP, identyfikator lub słowo już się pojawiło, albo odfiltrować duplikaty.

Wtedy właściwą kolekcją jest **`HashSet<T>`** z tej samej przestrzeni nazw `System.Collections.Generic`. Działa na identycznym mechanizmie haszowania (wyszukiwanie `Contains` w czasie **O(1)**), ale przechowuje wyłącznie unikalne elementy bez marnowania pamięci na zbędne wartości:

```csharp
var odwiedzone = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
bool pierwszy = odwiedzone.Add("10.0.0.1"); // true: nowy element
bool duplikat = odwiedzone.Add("10.0.0.1"); // false: element juz istnieje, brak wyjatku!
```

<data-gate>
<data-connection-matcher title="Dopasuj operację na kolekcji haszującej do jej dokładnego zachowania">
  <item left="string x = slownik['brak'];" right="Rzuca wyjątek KeyNotFoundException"></item>
  <item left="slownikInt.TryGetValue('brak', out ile);" right="Zwraca false i ustawia zmienną ile na wartość domyślną 0"></item>
  <item left="slownik.Add('istniejacyKlucz', 'nowa');" right="Rzuca wyjątek ArgumentException z powodu duplikatu klucza"></item>
  <item left="slownik.TryGetValue(null, out wynik);" right="Rzuca wyjątek ArgumentNullException, bo klucz nie może być null"></item>
  <item left="zbiorHashSet.Add('istniejacyElement');" right="Zwraca false i nie modyfikuje zbioru (bez wyjątku)"></item>
</data-connection-matcher>
</data-gate>

---

## 🗂️ Wzorzec grupowania w słowniku list

Jednym z najważniejszych wzorców w codziennym programowaniu jest grupowanie elementów według wspólnej cechy: **`Dictionary<string, List<string>>`**. Wyobraź sobie dziennik serwera, w którym każdy wpis ma poziom ważności (`"INFO"`, `"WARN"`, `"ERROR"`) oraz treść komunikatu. Chcemy zebrać wszystkie komunikaty osobno dla każdego poziomu.

Prześledź krok po kroku, dlaczego sama próba dopisania do listy nie wystarczy:

1. Pobierasz kategorię wpisu, na przykład *poziom* równy `"ERROR"`.
2. Pytasz słownik: `if (!grupy.TryGetValue(poziom, out lista))`.
3. Jeśli to **pierwszy wpis** dla `"ERROR"`, metoda zwraca `false`, a *lista* ma wartość `null`. Musisz wtedy utworzyć nową pustą listę `lista = new List<string>();` i zapisać ją w słowniku pod kluczem `"ERROR"`: `grupy[poziom] = lista;`.
4. Na końcu zawsze dopisujesz element: `lista.Add(komunikat);`.

```csharp
var wpisy = new List<string>
{
    "INFO:Start serwera",
    "ERROR:Brak polaczenia z baza",
    "INFO:Otwarto port 8080",
    "WARN:Wysokie zuzycie RAM",
    "ERROR:Timeout zapytania SQL"
};

var grupyLogow = new Dictionary<string, List<string>>(StringComparer.OrdinalIgnoreCase);

foreach (string wpis in wpisy)
{
    int dwukropek = wpis.IndexOf(':');
    string poziom = wpis.Substring(0, dwukropek);
    string tresc = wpis.Substring(dwukropek + 1);

    List<string> lista;
    if (!grupyLogow.TryGetValue(poziom, out lista))
    {
        lista = new List<string>();
        grupyLogow[poziom] = lista;
    }

    lista.Add(tresc);
}
```

Zwróć uwagę na linijkę `lista.Add(tresc);` przy drugim komunikacie `"ERROR"`. Nie musisz ponownie wpisywać `grupyLogow[poziom] = lista;`. Ponieważ `List<string>` jest typem referencyjnym, zmienna lokalna *lista* oraz wpis wewnątrz *grupyLogow* wskazują na **ten sam obiekt na stercie**. Ten wzorzec wykorzystasz także w końcowym projekcie `FolderTidy` do porządkowania plików według kategorii.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Płaska tablica Entry[] w CLR vs std::unordered_map w C++, liczby pierwsze i kontrakt GetHashCode</span>
<span class="deep-dive-badge">TABLICE HASZUJĄCE · PAMIĘĆ CPU · C++</span>
</summary>
<div class="deep-dive-content">

<h4>1. Architektura buckets[] i entries[] w .NET kontra std::unordered_map w C++</h4>

Ponieważ `GetHashCode()` zwraca 32-bitową liczbę całkowitą (około 4,29 miliarda możliwości), a różnych napisów istnieje nieskończenie wiele (zasada szufladkowa Dirichleta), dwa różne klucze mogą trafić do tego samego kubełka. Taką sytuację nazywamy **kolizją**.

W C++ standard wymusza na `std::unordered_map`, aby adresy elementów w pamięci nie zmieniały się po rehashowaniu (pointer stability). Z tego powodu implementacje C++ alokują każdy wpis jako osobny węzeł listy jednokierunkowej (`new Node`) rozrzucony w losowych miejscach sterty. Przejście po kolizjach oznacza skakanie po wskaźnikach i kosztowne pudła w pamięci podręcznej CPU (Cache Misses).

`Dictionary<TKey, TValue>` w .NET robi to inaczej: przechowuje wszystkie wpisy w **jednej, ciągłej tablicy struktur `Entry[]`**:

```csharp
// Uproszczona struktura wewnetrzna .NET Dictionary<TKey, TValue>:
private struct Entry
{
    public int hashCode; // 31-bitowy skrot (bez bitu znaku), -1 gdy slot jest wolny
    public int next;     // Indeks kolejnego wpisu w tym samym kubelku (-1 = koniec lancucha)
    public TKey key;
    public TValue value;
}

private int[] buckets;   // Przechowuje indeks pierwszego Entry w danym kubelku (-1 = pusty)
private Entry[] entries; // Plaska, zwarta tablica wpisow przyjazna dla cache L1/L2 CPU
```

Dzięki temu łańcuchowanie kolizji odbywa się przez indeksy `int` wewnątrz jednej tablicy bez żadnego `new Node` na element. Procesor pobiera sąsiednie wpisy jednym blokiem do linii cache (64 bajty), co wyraźnie przyspiesza wyszukiwanie i iterację.

<h4>2. Dlaczego rozmiary tablicy kubełków w .NET to liczby pierwsze</h4>

W klasie `HashHelpers` w .NET znajduje się statyczna tablica rozmiarów kubełków:
`3, 7, 11, 17, 23, 29, 37, 47, 59, 71, 89, 107, 131, 163, 197, 239, 293, 353...`

Wyobraź sobie, że kluczami są adresy pamięci albo identyfikatory podzielne przez 8 (`8, 16, 24, 32, 40...`). Gdyby rozmiar tablicy kubełków był potęgą dwójki, na przykład `16`, to reszta z dzielenia `klucz % 16` przyjmowałaby **wyłącznie wartości `0` oraz `8`**. Pozostałe 14 kubełków stałoby puste, a wszystkie dane spiętrzyłyby się w dwóch długich łańcuchach. Dzielenie modulo przez **liczbę pierwszą** (na przykład `17`) nie ma wspólnych dzielników z potęgami dwójki, więc rozrzuca wielokrotności 8 równomiernie po wszystkich kubełkach.

<h4>3. Współczynnik wypełnienia i koszt rehashowania</h4>

Gdy liczba elementów w `entries[]` zrówna się z rozmiarem tablicy (współczynnik wypełnienia osiąga 100%), słownik wybiera kolejną liczbę pierwszą około dwukrotnie większą. Alokuje nowe `buckets[]` oraz `entries[]` i dla każdego wpisu oblicza `entry.hashCode % newSize`. Zapisany w `Entry` skrót pozwala uniknąć ponownego wywoływania `GetHashCode()`. Tak jak w `List<T>`, jeśli znasz docelową liczbę kluczy (na przykład 20 000), przekaż ją do konstruktora: `new Dictionary<string, int>(20000)`.

<h4>4. Żelazny kontrakt GetHashCode() i Equals()</h4>

Jeśli kiedykolwiek użyjesz własnej klasy jako klucza w `Dictionary`, musisz przestrzegać dwóch reguł:

1. Jeśli `a.Equals(b)` zwraca `true`, to `a.GetHashCode()` **musi** być równe `b.GetHashCode()`. Złamanie tej zasady sprawia, że `TryGetValue` zagląda do innego kubełka niż ten, do którego wstawiono obiekt, i zwraca `false` mimo istnienia równego klucza.
2. Pola biorące udział w obliczaniu `GetHashCode()` muszą być **niezmienne** (immutable). Jeśli wstawisz obiekt do słownika, a potem zmienisz jego pole wpływające na hash, obiekt zostanie uwięziony w starym kubełku:

```csharp
var klucz = new Punkt(10, 20);
slownik[klucz] = "Start";
klucz.X = 99; // Zmiana pola zmienia GetHashCode()!
// slownik.ContainsKey(klucz) zwroci teraz FALSE: wpis zginal w starym kubelku!
```

Właśnie dlatego typ `string` w C# jest niezmienny (immutable): jego `GetHashCode()` nigdy nie zmieni się po wstawieniu klucza do tablicy haszującej.

</div>
</details>

---

## 💻 Zadanie praktyczne: Silnik kategoryzacji, zliczania i grupowania plików

W klasie `AnalizatorRozszerzen` uzupełnij pole `MapaRozszerzen` oraz trzy metody:

1. **Pole statyczne `MapaRozszerzen`**:
   - zadeklarowane jako `private static readonly Dictionary<string, string>` z porównywarką `StringComparer.OrdinalIgnoreCase`,
   - uzupełnij mapowanie:
     - `.png`, `.jpg`, `.webp` na `"Obrazy"`,
     - `.pdf`, `.docx`, `.txt` na `"Dokumenty"`,
     - `.zip`, `.7z`, `.rar` na `"Archiwa"`,
     - `.exe`, `.msi` na `"Instalatory"`.
2. **`PobierzKategorie(string rozszerzenie)`**:
   - użyj `MapaRozszerzen` oraz `TryGetValue`,
   - jeśli *rozszerzenie* jest `null`, puste lub nie ma go w mapie, zwróć `"Inne"` (pamiętaj o ochronie przed **_ArgumentNullException_**).
3. **`ZliczKategorie(List<string> rozszerzenia)`**:
   - zwróć `Dictionary<string, int>`, w którym kluczem jest nazwa kategorii, a wartością liczba jej wystąpień na liście wejściowej,
   - dla pustej listy zwróć pusty słownik; elementy `null` lub puste traktuj tak jak `PobierzKategorie` (wliczaj do `"Inne"`).
4. **`GrupujPoKategorii(List<string> nazwyPlikow)`**:
   - zwróć `Dictionary<string, List<string>>` grupujący nazwy plików według ich kategorii,
   - dla każdej niepustej nazwy wyznacz rozszerzenie przez `Path.GetExtension(nazwa)` (na przykład dla `"raport.PDF"` zwraca `".PDF"`, a dla `"README"` zwraca `""`), następnie pobierz kategorię metodą `PobierzKategorie`,
   - pomiń wpisy `null` oraz puste napisy `""`; pliki bez rozszerzenia (jak `"README"`) mają trafić do kategorii `"Inne"`,
   - zachowaj kolejność plików w ramach każdej grupy.

<data-gate>
<data-csharp-lab title="Zadanie: Dictionary, TryGetValue, licznik i grupowanie plików" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.IO;

public class AnalizatorRozszerzen
{
    private static readonly Dictionary<string, string> MapaRozszerzen =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            // Uzupełnij mapowania rozszerzeń na kategorie:
            // Obrazy, Dokumenty, Archiwa, Instalatory
        };

    public static string PobierzKategorie(string rozszerzenie)
    {
        // Sprawdź null/pusty napis i odczytaj kategorię przez TryGetValue z MapaRozszerzen
        return "Inne";
    }

    public static Dictionary<string, int> ZliczKategorie(List<string> rozszerzenia)
    {
        // Zlicz wystąpienia każdej kategorii w Dictionary<string, int>
        return new Dictionary<string, int>();
    }

    public static Dictionary<string, List<string>> GrupujPoKategorii(List<string> nazwyPlikow)
    {
        // Wyciągnij rozszerzenie przez Path.GetExtension i pogrupuj nazwy w Dictionary<string, List<string>>
        return new Dictionary<string, List<string>>();
    }

    static void Main()
    {
        var ext = new List<string> { ".png", ".JPG", ".pdf", ".zip", ".mp3" };
        var raport = ZliczKategorie(ext);
        foreach (KeyValuePair<string, int> para in raport)
        {
            Console.WriteLine(para.Key + ": " + para.Value);
        }

        var pliki = new List<string> { "logo.PNG", "umowa.pdf", "avatar.webp", "README" };
        var grupy = GrupujPoKategorii(pliki);
        foreach (KeyValuePair<string, List<string>> grupa in grupy)
        {
            Console.WriteLine(grupa.Key + " -> " + string.Join(", ", grupa.Value));
        }
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("PobierzKategorie rozpoznaje rozszerzenia niezaleznie od wielkosci liter", () => {
    LabAssert.Equal("Obrazy", AnalizatorRozszerzen.PobierzKategorie(".PNG"));
    LabAssert.Equal("Obrazy", AnalizatorRozszerzen.PobierzKategorie(".webp"));
    LabAssert.Equal("Dokumenty", AnalizatorRozszerzen.PobierzKategorie(".pdf"));
    LabAssert.Equal("Dokumenty", AnalizatorRozszerzen.PobierzKategorie(".DOCX"));
    LabAssert.Equal("Archiwa", AnalizatorRozszerzen.PobierzKategorie(".7Z"));
    LabAssert.Equal("Instalatory", AnalizatorRozszerzen.PobierzKategorie(".Msi"));
});
LabAssert.Test("PobierzKategorie bezpiecznie obsluguje nieznane rozszerzenia, null i pusty napis", () => {
    LabAssert.Equal("Inne", AnalizatorRozszerzen.PobierzKategorie(".iso"));
    LabAssert.Equal("Inne", AnalizatorRozszerzen.PobierzKategorie(""));
    LabAssert.Equal("Inne", AnalizatorRozszerzen.PobierzKategorie(null));
});
LabAssert.Test("ZliczKategorie zlicza wszystkie kategorie oraz obsluguje null i pusta liste", () => {
    var pusty = AnalizatorRozszerzen.ZliczKategorie(new List<string>());
    LabAssert.Equal(0, pusty.Count);

    var lista = new List<string> { ".png", ".JPG", ".pdf", ".zip", ".mp3", ".webp", null, "", ".EXE", ".rar" };
    var wynik = AnalizatorRozszerzen.ZliczKategorie(lista);
    LabAssert.Equal(5, wynik.Count);
    LabAssert.Equal(3, wynik["Obrazy"]);
    LabAssert.Equal(1, wynik["Dokumenty"]);
    LabAssert.Equal(2, wynik["Archiwa"]);
    LabAssert.Equal(1, wynik["Instalatory"]);
    LabAssert.Equal(3, wynik["Inne"]);
});
LabAssert.Test("GrupujPoKategorii grupuje nazwy plikow, zachowuje kolejnosc i pomija null oraz puste napisy", () => {
    var puste = AnalizatorRozszerzen.GrupujPoKategorii(new List<string>());
    LabAssert.Equal(0, puste.Count);

    var pliki = new List<string>
    {
        "screen.PNG",
        null,
        "raport.pdf",
        "",
        "avatar.jpg",
        "backup.7Z",
        "README",
        "setup.exe",
        "notatki.TXT"
    };
    var grupy = AnalizatorRozszerzen.GrupujPoKategorii(pliki);
    LabAssert.Equal(5, grupy.Count);
    LabAssert.Equal("screen.PNG,avatar.jpg", string.Join(",", grupy["Obrazy"]));
    LabAssert.Equal("raport.pdf,notatki.TXT", string.Join(",", grupy["Dokumenty"]));
    LabAssert.Equal("backup.7Z", string.Join(",", grupy["Archiwa"]));
    LabAssert.Equal("setup.exe", string.Join(",", grupy["Instalatory"]));
    LabAssert.Equal("README", string.Join(",", grupy["Inne"]));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wybieraj **`Dictionary<TKey, TValue>`**, gdy potrzebujesz szybkiego wyszukiwania po kluczu w czasie **O(1)** zamiast liniowego przeszukiwania listy, oraz **`HashSet<T>`**, gdy przechowujesz wyłącznie zbiór unikalnych wartości.
- Zawsze odczytuj niepewne klucze przez **`TryGetValue`**, aby uniknąć **_KeyNotFoundException_**, i pamiętaj o wcześniejszym sprawdzeniu `null`, bo `TryGetValue(null, out ...)` rzuca **_ArgumentNullException_**.
- Dla kluczy tekstowych przekazuj do konstruktora `StringComparer.OrdinalIgnoreCase`, a stałe tabele mapowań trzymaj w polu `private static readonly Dictionary<...>`.
- Zapis `slownik[klucz] = wartosc` bezpiecznie wstawia nowy klucz albo nadpisuje istniejący; przy grupowaniu `Dictionary<string, List<string>>` zainicjalizuj nową listę za pierwszym razem, gdy `TryGetValue` zwróci `false` i wpisze `null`.
- Po słowniku iteruj pętlą `foreach` z `KeyValuePair<TKey, TValue>` (albo po `.Keys` i `.Values`), nie modyfikując struktury słownika w trakcie pętli.
