# Listy generyczne List i pętla foreach

Tablice `T[]` z poprzedniego modułu są szybkie i zajmują zwarty blok pamięci RAM. Mają jednak jedną sztywną granicę: ich rozmiaru nie zmienisz po utworzeniu. Kiedy skanujesz folder `Pobrane`, nie wiesz z góry, czy na dysku leżą 3 pliki, czy 840.

Ręczne tworzenie nowej tablicy i kopiowanie jej zawartości przy każdym nowym pliku szybko zamieniłoby kod w bałagan. Do danych o zmiennej liczbie elementów w C# służy dynamiczna kolekcja **`List<T>`** z przestrzeni nazw `System.Collections.Generic` oraz pętla **`foreach`**.

---

## 🧩 Co oznacza zapis generyczny z parametrem T

Nawiasy kątowe w nazwie `List<T>` oznaczają _**typ generyczny**_. Symbol `T` działa jak szablon, w miejsce którego podstawiasz konkretny typ przechowywanych danych. Dzięki temu jedna implementacja listy w bibliotece .NET obsługuje liczby całkowite (`List<int>`), napisy (`List<string>`) oraz własne obiekty.

Największą zaletą typów generycznych jest **bezpieczeństwo typów** sprawdzane jeszcze przed uruchomieniem programu. Jeśli utworzysz `List<int>`, kompilator nie pozwoli dodać do niej napisu `"tekst"`. Błąd wyłapiesz od razu podczas kompilacji, a nie dopiero w trakcie działania aplikacji u użytkownika.

Parametr `T` może być również inną kolekcją. Bez trudu zbudujesz listę list, na przykład `List<List<string>>`, która przechowuje wiersze wczytane z pliku CSV albo grupy powiązanych ścieżek.

```csharp
using System.Collections.Generic;

var rozmiary = new List<int> { 120, 450, 80 };
var nazwy = new List<string> { "raport.pdf", "ikona.png" };
var wierszeCsv = new List<List<string>>();
```

---

## 📦 Jak lista rośnie w pamięci RAM

`List<T>` nie jest magiczną strukturą. Pod spodem przechowuje zwykłą tablicę `T[]`. Gdy dodajesz elementy metodą `.Add(...)` i kończy się wolne miejsce, lista automatycznie alokuje nową, **dwukrotnie większą tablicę**, kopiuje do niej stare dane i dopisuje nowy element.

Sprawdź w wizualizatorze, jak zmieniają się **`Count`** (liczba wpisanych elementów) oraz **`Capacity`** (rozmiar wewnętrznej tablicy) przy kolejnych wywołaniach `.Add()`:

<data-csharp-collections-viz></data-csharp-collections-viz>

Zestawienie kolejnych kroków pokazuje różnicę między faktyczną liczbą elementów a zarezerwowanym buforem:

| Operacja | Count | Capacity | Co dzieje się w pamięci RAM? |
| --- | --- | --- | --- |
| `new List<string>()` | `0` | `0` | Pusta lista współdzieli statyczną pustą tablicę bez alokacji |
| 1. wywołanie `.Add(...)` | `1` | `4` | Alokacja pierwszej wewnętrznej tablicy o 4 slotach |
| 4. wywołanie `.Add(...)` | `4` | `4` | Zapis w ostatnim wolnym slocie bez kopiowania |
| 5. wywołanie `.Add(...)` | `5` | `8` | Brak miejsca: nowa tablica (8 slotów), kopiowanie 4 elementów, zapis 5. |
| 9. wywołanie `.Add(...)` | `9` | `16` | Brak miejsca: nowa tablica (16 slotów), kopiowanie 8 elementów, zapis 9. |

> [!TIP]
> Jeśli wiesz z góry, że wczytasz z dysku około 10 000 ścieżek, przekaż tę liczbę do konstruktora: `new List<string>(10000)`. Lista wykona wtedy **dokładnie jedną alokację** zamiast kilkunastu kopiowań tablicy po drodze.

W przeciwieństwie do tablic `T[]`, które mają właściwość `.Length`, w `List<T>` liczbę elementów odczytujesz zawsze przez **`.Count`**. Zwróć uwagę na jeszcze jedną różnicę przy wyjściu poza zakres indeksów. Tablica `T[]` rzuca **_IndexOutOfRangeException_**, natomiast `List<T>` rzuca **_ArgumentOutOfRangeException_** zawsze, gdy indeks jest ujemny albo większy bądź równy `Count` (nawet jeśli wewnętrzne `Capacity` jest większe).

---

## ⚙️ Podstawowe operacje i koszt przesuwania pamięci

Praca z listą sprowadza się do kilku metod, które codziennie wykorzystasz w projektach. Przyjrzyj się operacjom na kolejce zadań serwera:

```csharp
using System.Collections.Generic;

var zadania = new List<string> { "backup", "indeks", "raport" };
zadania.Add("czyszczenie");                 // Koniec listy: Count = 4
zadania.Insert(0, "pilny_alert");           // Początek listy: przesuwa wszystko w prawo
zadania.Remove("indeks");                   // Szuka liniowo i usuwa pierwsze wystąpienie
zadania.RemoveAt(0);                        // Usuwa element spod indeksu 0
bool maRaport = zadania.Contains("raport"); // true
zadania.Sort();                             // Sortuje alfabetycznie w miejscu
```

Nie wszystkie te operacje mają jednak taki sam koszt dla procesora. Wewnętrzna tablica musi pozostać ciągła, bez pustych dziur w środku:

| Operacja | Złożoność | Co robi procesor pod spodem? |
| --- | --- | --- |
| `Add(x)` | **O(1)** (zamortyzowane) | Wpisuje element w pierwszy wolny slot na końcu tablicy |
| `lista[i]` | **O(1)** | Bezpośredni skok pod adres bazowy plus przesunięcie o indeks *i* |
| `Insert(0, x)` | **_O(n)_** | Przesuwa wszystkie istniejące elementy o 1 pozycję w prawo |
| `RemoveAt(0)` | **_O(n)_** | Przesuwa wszystkie pozostałe elementy o 1 pozycję w lewo |
| `Contains(x)` / `Remove(x)` | **_O(n)_** | Sprawdza elementy kolejno od indeksu `0` aż do trafienia |

Usunięcie pierwszego elementu z listy 100 000 wpisów oznacza skopiowanie w pamięci 99 999 elementów. Z kolei dopisanie elementu na koniec przez `Add` albo usunięcie ostatniego przez `RemoveAt(Count - 1)` nie wymaga przesuwania pozostałych danych.

### 🔎 Porównywanie końcówek napisów bez pułapki wielkości liter

Podczas filtrowania nazw plików często sprawdzasz ich rozszerzenie. Zwykłe wywołanie `nazwa.EndsWith(".png")` rozróżnia wielkość liter, więc pominie plik `"ZDJECIE.PNG"` albo `"Baner.Png"`.

Zamiast konwertować każdy napis przez `.ToLower()`, przekazuj do metod napisowych jawny tryb porównania **`StringComparison.OrdinalIgnoreCase`**:

```csharp
string nazwa = "Screen_01.PNG";
bool czyObraz = nazwa.EndsWith(".png", StringComparison.OrdinalIgnoreCase); // true
```

Tryb `OrdinalIgnoreCase` porównuje kody znaków bez narzutu reguł językowych systemu operacyjnego i bez alokowania nowych kopii napisu w pamięci.

---

## 🔗 Semantyka referencyjna listy w pamięci

`List<T>` jest _**typem referencyjnym**_. Oznacza to, że sama zmienna lokalna na stosie nie zawiera wszystkich elementów listy. Przechowuje jedynie adres (referencję) obiektu żyjącego na stercie.

Gdy przypiszesz jedną zmienną listową do drugiej, nie kopiujesz danych. Obie zmienne zaczynają wskazywać na **dokładnie tę samą listę** w pamięci RAM:

```csharp
var a = new List<int> { 1, 2 };
var b = a;      // Kopia samej referencji, nie elementów!
b.Add(3);

// Zarówno a.Count, jak i b.Count wynoszą teraz 3!
```

Dokładnie tak samo działa przekazanie listy jako parametru do metody. Gdy metoda modyfikuje elementy otrzymanej listy (`rozmiary[i] = ...` albo `rozmiary.RemoveAt(i)`), zmiany są natychmiast widoczne u wywołującego. Jeśli potrzebujesz niezależnej kopii elementów, utwórz nową listę za pomocą konstruktora kopiującego:

```csharp
var kopia = new List<int>(a);
kopia.Add(99);
// Lista a nadal ma 3 elementy, a kopia ma 4 elementy
```

---

## 🔁 Pętla foreach kontra pętla for

Gdy chcesz przeczytać każdy element kolekcji od początku do końca, pętla **`foreach`** usuwa ryzyko pomyłki w warunku indeksu (`i <= lista.Count` zamiast `i < lista.Count`):

```csharp
var pingMs = new List<int> { 18, 24, 145, 22, 31 };
long sumaMs = 0;

foreach (int pomiar in pingMs)
{
    sumaMs += pomiar;
}
```

> [!WARNING]
> Wewnątrz pętli `foreach` obowiązują dwa twarde ograniczenia. Po pierwsze zmienna iteracyjna (*pomiar*) jest tylko do odczytu, więc zapis `pomiar = 0;` kończy się **_błędem kompilacji_**. Po drugie nie wolno wywoływać `.Add()`, `.Remove()`, `.RemoveAt()` ani `.Clear()` na przeglądanej liście, ponieważ CLR natychmiast rzuci wyjątek **_InvalidOperationException_**.

### ✂️ Dlaczego usuwanie pętlą for od przodu gubi elementy

Skoro w `foreach` nie wolno usuwać, wielu początkujących sięga po klasyczną pętlę `for` od `0` do `Count - 1`. Prześledźmy krok po kroku, co dzieje się na liście `{ 10, 20, 500, 30 }`, gdy chcemy usunąć wszystkie liczby mniejsze od `100`:

1. **Krok `i = 0`:** odczytujemy `lista[0]`, czyli `10`. Warunek `10 < 100` jest prawdziwy, więc wywołujemy `lista.RemoveAt(0)`.
2. **Przesunięcie w pamięci:** lista kurczy się do `{ 20, 500, 30 }`. Liczba `20` przesuwa się z indeksu `1` na indeks `0`.
3. **Krok `i = 1`:** pętla zwiększa indeks przez `i++`. Odczytujemy `lista[1]`, czyli `500`. Liczba `20` siedząca pod indeksem `0` została **po cichu pominięta**!
4. **Krok `i = 2`:** odczytujemy `30`, usuwamy ją i kończymy pętlę z błędnym wynikiem `{ 20, 500 }`.

Rozwiązaniem bez żadnych obejść jest **pętla `for` od końca** (`i = lista.Count - 1; i >= 0; i--`):

```csharp
var progi = new List<int> { 10, 20, 500, 30 };

for (int i = progi.Count - 1; i >= 0; i--)
{
    if (progi[i] < 100)
    {
        progi.RemoveAt(i);
    }
}
// Wynik: { 500 }
```

Prześledź ten sam zestaw danych od tyłu. Najpierw usuwasz `30` (indeks `3`), potem zostawiasz `500` (indeks `2`), potem usuwasz `20` (indeks `1`), a na końcu `10` (indeks `0`). Usunięcie elementu z tyłu przesuwa wyłącznie elementy już odwiedzone, więc żaden mniejszy indeks nie zmienia swojej pozycji.

| Cel operacji | Zalecana pętla | Dlaczego? |
| --- | --- | --- |
| Odczyt, sumowanie, szukanie maksimum | `foreach` | Brak ręcznego indeksu, najczystszy kod |
| Filtrowanie bez zmiany oryginału | `foreach` + nowa `List<T>` | Nie naruszasz kolekcji podczas iteracji |
| Modyfikacja wartości w miejscu (`lista[i] = ...`) | `for` od `0` do `Count - 1` | Potrzebujesz indeksu *i* do zapisu pod konkretny slot |
| Usuwanie elementów w miejscu | `for` od `Count - 1` do `0` | Usuwanie z tyłu nie przesuwa jeszcze nieodwiedzonych indeksów |

<data-gate>
<data-connection-matcher title="Dopasuj scenariusz pracy z listą do właściwej pętli i techniki">
  <item left="Obliczenie sumy wszystkich rozmiarów plików bez zmiany listy" right="Pętla foreach po liście z akumulatorem typu long"></item>
  <item left="Zbudowanie nowej listy plików PDF bez naruszania listy wejściowej" right="Pętla foreach dopisująca pasujące pozycje przez .Add() do nowej List"></item>
  <item left="Nadpisanie każdego elementu listy nową wartością po rabacie" right="Klasyczna pętla for od 0 do Count - 1 z zapisem lista[i] = ..."></item>
  <item left="Usunięcie z listy w miejscu wszystkich wpisów mniejszych od progu" right="Pętla for od końca (Count - 1 w dół do 0) wywołująca RemoveAt(i)"></item>
  <item left="Wywołanie lista.Remove(x) wewnątrz pętli foreach po tej samej liście" right="Wyjątek InvalidOperationException w czasie działania programu"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Szereg geometryczny podwajania tablicy, pole _version w CLR i Iterator Invalidation w C++</span>
<span class="deep-dive-badge">STRUKTURY DANYCH · CLR · C++</span>
</summary>
<div class="deep-dive-content">

<h4>1. Dowód matematyczny: dlaczego podwajanie bije strategię +1</h4>

Załóżmy, że dodajesz `16 384` elementy do listy. Gdyby `List<T>` powiększała wewnętrzną tablicę tylko o `+1` przy każdym `.Add()`, łączna liczba skopiowanych elementów wyniosłaby:
`1 + 2 + 3 + ... + 16 383 = 16 383 * 16 384 / 2 = 134 209 536` kopiowań (ponad 134 miliony).

Przy podwajaniu pojemności (`4 -> 8 -> 16 -> ... -> 16 384`) kopiowanie następuje wyłącznie przy potęgach dwójki. Łączna liczba skopiowanych elementów to suma skończonego szeregu geometrycznego:
`4 + 8 + 16 + ... + 4096 + 8192 = 16 380` kopiowań.

Ogólnie dla dowolnej liczby `n` będącej potęgą dwójki zachodzi nierówność `n/2 + n/4 + n/8 + ... + 4 < n`. Oznacza to **mniej niż jedno dodatkowe skopiowanie na każdy dodany element**, czyli ponad 8 000 razy mniej pracy niż przy strategii `+1`.

<h4>2. Koszt realokacji i konstruktor z pojemnością</h4>

Mimo że podwajanie jest szybkie, każda realokacja zostawia na stercie starą tablicę, którą musi posprzątać Garbage Collector. Jeśli podasz pojemność w `new List<string>(10000)`, `List<T>` wykona **dokładnie jedną alokację** zamiast trzynastu (`4, 8, 16, ..., 16384`). Oszczędzasz jednocześnie czas procesora i pamięć RAM.

<h4>3. Ukryte pole _version w CLR kontra Undefined Behavior w C++</h4>

Skąd `foreach` w C# wie, że w środku pętli ktoś wywołał `lista.Add(...)`? Wewnątrz `List<T>` znajduje się prywatne pole `private int _version;`. Każda metoda zmieniająca strukturę listy (`Add`, `Remove`, `Insert`, `Clear`, `Sort`) wykonuje `_version++`.

Gdy uruchamiasz `foreach`, kompilator C# obniża pętlę do wywołania struktury `List<T>.Enumerator`, która zapamiętuje numer wersji w momencie startu:

```csharp
// Uproszczony fragment prawdziwej implementacji List<T>.Enumerator w .NET CLR:
public bool MoveNext()
{
    if (_version != _list._version)
    {
        throw new InvalidOperationException("Collection was modified.");
    }
    if (_index < _list._size)
    {
        _current = _list._items[_index];
        _index++;
        return true;
    }
    return false;
}
```

W C++ odpowiednikiem `List<T>` jest `std::vector<T>`. Ze względów wydajnościowych C++ nie prowadzi licznika `_version`. Jeśli wewnątrz pętli po `std::vector` wywołasz `push_back` i wektor zrealokuje bufor w inne miejsce RAM, dotychczasowy iterator staje się **_wiszącym wskaźnikiem_** (Iterator Invalidation):

```cpp
std::vector<int> v = { 1, 2, 3, 4 };
for (auto it = v.begin(); it != v.end(); ++it) {
    v.push_back(99); // Realokacja! 'it' wskazuje teraz na zwolnioną pamięć -> Undefined Behavior!
}
```

W C++ program może w tym miejscu po cichu czytać śmieci z pamięci lub zakończyć się błędem **_Segmentation Fault_**. C# poświęca jedno porównanie dwóch liczb `int` w rejestrze CPU na iterację, aby zagwarantować natychmiastowy, przewidywalny wyjątek zamiast uszkodzenia pamięci.

</div>
</details>

---

## 💻 Zadanie praktyczne: Filtr plików według rozmiaru i rozszerzenia

W klasie `FiltrPlikow` uzupełnij cztery metody operujące na `List<string>` i `List<int>`:

1. **`FiltrujRozszerzenie(List<string> nazwy, string rozszerzenie)`**:
   - zwróć **nową** `List<string>` zawierającą wyłącznie nazwy kończące się na *rozszerzenie* bez rozróżniania wielkości liter (`StringComparison.OrdinalIgnoreCase`),
   - pomiń ewentualne elementy `null` i nie modyfikuj listy wejściowej *nazwy*.
2. **`PoliczLacznyRozmiar(List<int> rozmiaryKb)`**:
   - zsumuj wszystkie elementy pętlą `foreach`,
   - użyj zmiennej akumulatora typu `long`, aby uniknąć przepełnienia zakresu 32-bitowego `int` (maksymalnie `2 147 483 647`).
3. **`ZastosujKompresje(List<int> rozmiaryKb, int procent)`**:
   - użyj pętli `for`, aby zmniejszyć każdy element w miejscu według wzoru bezpiecznego przed przepełnieniem `int`:
     `rozmiaryKb[i] = (int)((long)rozmiaryKb[i] * (100 - procent) / 100);`
   - rzutowanie na `long` jest niezbędne, ponieważ dla dużego pliku (np. `500 000 000 KB`) samo mnożenie `500000000 * 80` przekracza maksymalną wartość `int`,
   - zadbaj o przypadki brzegowe: pusta lista, `procent = 0` (brak zmian) oraz `procent = 100` (wszystkie rozmiary zerują się).
4. **`UsunZaMale(List<int> rozmiaryKb, int minKb)`**:
   - usuń w miejscu z listy *rozmiaryKb* wszystkie elementy ostro mniejsze od *minKb* (`< minKb`),
   - użyj pętli `for` idącej od końca, aby nie zgubić sąsiadujących małych elementów i zachować kolejność pozostałych,
   - elementy równe dokładnie *minKb* mają pozostać na liście.

<data-gate>
<data-csharp-lab title="Zadanie: List<T>, foreach, filtrowanie, kompresja i usuwanie od końca" allow-add-file="false">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;

public class FiltrPlikow
{
    public static List<string> FiltrujRozszerzenie(List<string> nazwy, string rozszerzenie)
    {
        // Utwórz nową List<string> i dodaj pasujące pliki (OrdinalIgnoreCase)
        return new List<string>();
    }

    public static long PoliczLacznyRozmiar(List<int> rozmiaryKb)
    {
        // Zsumuj elementy pętlą foreach jako long
        return 0L;
    }

    public static void ZastosujKompresje(List<int> rozmiaryKb, int procent)
    {
        // Zmniejsz każdy element w miejscu pętlą for (z rzutowaniem na long)
    }

    public static void UsunZaMale(List<int> rozmiaryKb, int minKb)
    {
        // Usuń w miejscu elementy ostro mniejsze od minKb pętlą for od końca
    }

    static void Main()
    {
        var pliki = new List<string> { "screen.PNG", "nota.txt", "avatar.png", "gra.zip" };
        var obrazy = FiltrujRozszerzenie(pliki, ".png");
        Console.WriteLine("Obrazy: " + string.Join(", ", obrazy));

        var rozmiary = new List<int> { 10, 20, 1000, 2000, 50, 500 };
        Console.WriteLine("Lacznie KB: " + PoliczLacznyRozmiar(rozmiary));
        UsunZaMale(rozmiary, 100);
        Console.WriteLine("Po usunieciu < 100 KB: " + string.Join(", ", rozmiary));
        ZastosujKompresje(rozmiary, 20);
        Console.WriteLine("Po kompresji 20%: " + string.Join(", ", rozmiary));
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("FiltrujRozszerzenie dopasowuje wielkosc liter i nie modyfikuje oryginalu", () => {
    var wejscie = new List<string> { "screen.PNG", "nota.txt", "avatar.png", "gra.zip", "BANER.Png" };
    var wynik = FiltrPlikow.FiltrujRozszerzenie(wejscie, ".png");
    LabAssert.Equal(3, wynik.Count);
    LabAssert.Equal("screen.PNG,avatar.png,BANER.Png", string.Join(",", wynik));
    LabAssert.Equal(5, wejscie.Count);
});
LabAssert.Test("FiltrujRozszerzenie obsluguje pusta liste, brak dopasowan i wpisy null", () => {
    var pusta = new List<string>();
    LabAssert.Equal(0, FiltrPlikow.FiltrujRozszerzenie(pusta, ".pdf").Count);
    var zNull = new List<string> { null, "plik.txt", "archiwum.ZIP" };
    var wynik = FiltrPlikow.FiltrujRozszerzenie(zNull, ".zip");
    LabAssert.Equal(1, wynik.Count);
    LabAssert.Equal("archiwum.ZIP", wynik[0]);
});
LabAssert.Test("PoliczLacznyRozmiar sumuje jako long bez przepelnienia int i obsluguje pusta liste", () => {
    LabAssert.Equal(0L, FiltrPlikow.PoliczLacznyRozmiar(new List<int>()));
    var duze = new List<int> { 2000000000, 1000000000, 500000000 };
    LabAssert.Equal(3500000000L, FiltrPlikow.PoliczLacznyRozmiar(duze));
});
LabAssert.Test("ZastosujKompresje dziala w miejscu dla 25%, 0%, 100%, duzych liczb i pustej listy", () => {
    var rozmiary = new List<int> { 1000, 500, 200 };
    FiltrPlikow.ZastosujKompresje(rozmiary, 25);
    LabAssert.Equal("750,375,150", string.Join(",", rozmiary));

    var bezZmian = new List<int> { 420, 80 };
    FiltrPlikow.ZastosujKompresje(bezZmian, 0);
    LabAssert.Equal("420,80", string.Join(",", bezZmian));

    var pelna = new List<int> { 900, 120 };
    FiltrPlikow.ZastosujKompresje(pelna, 100);
    LabAssert.Equal("0,0", string.Join(",", pelna));

    var ogromne = new List<int> { 500000000 };
    FiltrPlikow.ZastosujKompresje(ogromne, 20);
    LabAssert.Equal(400000000, ogromne[0]);

    var pusta = new List<int>();
    FiltrPlikow.ZastosujKompresje(pusta, 50);
    LabAssert.Equal(0, pusta.Count);
});
LabAssert.Test("UsunZaMale usuwa sasiadujace male elementy od konca i zachowuje elementy rowne progowi", () => {
    var dane = new List<int> { 10, 20, 100, 500, 30, 5, 250 };
    FiltrPlikow.UsunZaMale(dane, 100);
    LabAssert.Equal("100,500,250", string.Join(",", dane));

    var wszystkieMale = new List<int> { 1, 2, 3 };
    FiltrPlikow.UsunZaMale(wszystkieMale, 50);
    LabAssert.Equal(0, wszystkieMale.Count);

    var pusta = new List<int>();
    FiltrPlikow.UsunZaMale(pusta, 10);
    LabAssert.Equal(0, pusta.Count);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wybieraj **`List<T>`** zamiast tablicy `T[]`, gdy liczba elementów zmienia się w trakcie działania programu. Liczbę elementów czytaj przez `.Count`, a gdy znasz przybliżoną wielkość z góry, podaj ją w `new List<T>(capacity)`.
- Pamiętaj, że `List<T>` jest typem referencyjnym: przypisanie `var b = a;` kopiuje tylko adres, a niezależną kopię tworzy `new List<T>(a)`. Wyjście poza zakres `0..Count-1` kończy się wyjątkiem **_ArgumentOutOfRangeException_**.
- Unikaj częstych wywołań `Insert(0, x)` i `RemoveAt(0)` na dużych listach, ponieważ każde przesuwa cały blok pamięci w czasie **_O(n)_**.
- Używaj `foreach` do odczytu, sumowania i filtrowania do nowej listy, klasycznego `for` do nadpisywania w miejscu (`lista[i] = ...`), a pętli **`for` od końca** do usuwania elementów w miejscu.
- Nigdy nie dodawaj ani nie usuwaj elementów wewnątrz pętli `foreach` po tej samej liście: licznik `_version` przerwie program wyjątkiem **_InvalidOperationException_**.
