# Typy generyczne i własne kolekcje

Wyobraź sobie panel diagnostyczny monitorujący komputer w czasie rzeczywistym. Program zapisuje zużycie pamięci RAM z ostatnich 60 sekund, historię 120 klatek gry albo 20 ostatnich poleceń w terminalu. Zwykła lista `List<T>` rośnie tu bez końca i po kilku godzinach pracy zapełni całą pamięć operacyjną.

Rozwiązaniem jest **bufor cykliczny**: struktura o stałym rozmiarze, która po zapełnieniu nadpisuje najstarszy element. Pierwsza intuicja podpowiada napisanie osobnych klas: `BuforDouble`, `BuforInt` i `BuforString`. Kopiowanie identycznej logiki do kilku plików oznacza jednak potrójne utrzymanie kodu i potrójne ryzyko błędów przy każdej poprawce.

---

## 📦 Dlaczego tablica object zawodzi

Przed wprowadzeniem typów generycznych w C# 2.0 programiści obchodzili powielanie kodu przez użycie typu bazowego `object`. Ponieważ każdy typ w C# dziedziczy po `object`, pojedyncza tablica `object[]` potrafi przechować liczby, napisy oraz obiekty dowolnych klas.

To podejście niesie jednak dwa poważne koszty. Pierwszym jest utrata bezpieczeństwa typów na etapie kompilacji:

```csharp
object[] bufor = new object[3];
bufor[0] = 64.5;
bufor[1] = "blad_czujnika"; // Kompilator akceptuje ten zapis!

double pomiar = (double)bufor[1]; // Wyjatek w trakcie dzialania programu!
```

Kompilator nie zgłasza żadnego błędu, bo dla niego oba elementy mają typ `object`. Dopiero w czasie uruchomienia programu rzutowanie `(double)` rzuca wyjątek **_InvalidCastException_** i zatrzymuje aplikację.

Drugim kosztem jest **_boxing_** (pakowanie typów wartościowych). Liczba `double` normalnie zajmuje 8 bajtów na stosie lub bezpośrednio w tablicy. Włożenie jej do `object[]` zmusza środowisko uruchomieniowe do utworzenia osobnego pudełka na stercie z nagłówkiem obiektu. Przy milionie pomiarów generuje to milion zbędnych alokacji i obciąża Garbage Collector.

> [!IMPORTANT]
> **Typy generyczne** (`<T>`) przenoszą sprawdzanie typów z czasu uruchomienia na czas kompilacji. Jednocześnie przechowują typy wartościowe bez pakowania na stercie.

---

## 🔄 Generyczny bufor cykliczny i zawijanie indeksu

Wewnątrz klasy generycznej umieszczasz **parametr typu** w nawiasach ostrych, najczęściej oznaczony literą `T`. Kompilator traktuje `T` jak pełnoprawny typ: możesz zadeklarować tablicę `T[]`, parametr metody `Dodaj(T element)` oraz typ zwracany `List<T>`.

Sercem bufora cyklicznego jest tablica *_dane* o stałej długości *pojemnosc* oraz wskaźnik zapisu *_indeksZapisu*. Indeks zachowuje się jak wskazówka na tarczy zegara: po osiągnięciu ostatniej pozycji nie wychodzi poza tablicę, lecz zawija się z powrotem na pozycję `0` dzięki operatorowi reszty z dzielenia (`%`).

Prześledź w tabeli działanie bufora o pojemności `3` podczas dodawania pięciu kolejnych pomiarów:

| Krok | Operacja | Tablica przed zapisem | Indeks zapisu | Tablica po zapisie | Count | Kolejność od najstarszego |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `Dodaj(10)` | `[0, 0, 0]` | `0` -> `1` | `[10, 0, 0]` | `1` | `10` |
| 2 | `Dodaj(20)` | `[10, 0, 0]` | `1` -> `2` | `[10, 20, 0]` | `2` | `10, 20` |
| 3 | `Dodaj(30)` | `[10, 20, 0]` | `2` -> `0` | `[10, 20, 30]` | `3` | `10, 20, 30` |
| 4 | `Dodaj(40)` | `[10, 20, 30]` | `0` -> `1` | `[40, 20, 30]` | `3` | `20, 30, 40` |
| 5 | `Dodaj(50)` | `[40, 20, 30]` | `1` -> `2` | `[40, 50, 30]` | `3` | `30, 40, 50` |

Zwróć uwagę na dwie własności widoczne w krokach 4 i 5:

- **Pozycja najstarszego elementu:** dopóki bufor nie jest pełny (`Count < _dane.Length`), najstarszy element leży na indeksie `0`. Po zapełnieniu najstarszy element leży dokładnie pod *_indeksZapisu*, bo to komórka czekająca na nadpisanie.
- **Pozycja najnowszego elementu:** znajduje się o jedną komórkę przed *_indeksZapisu*. Gdy *_indeksZapisu* wynosi `0`, zwykłe odejmowanie dałoby **_indeks ujemny (-1)_**. Aby bezpiecznie cofnąć wskaźnik po okręgu, dodaj długość tablicy przed obliczeniem reszty z dzielenia.

Każde dodanie elementu wykonuje **stałą liczbę operacji** w czasie `O(1)`. Niezależnie od tego, czy bufor mieści 10, czy 10 000 000 próbek, nie przesuwasz istniejących danych w pamięci.

<data-gate>
<data-sortable-list title="Ułóż kolejność kroków podczas dodawania nowego elementu do pełnego bufora cyklicznego">
  <item data-correct="3">Wskaźnik _indeksZapisu przesuwa się o jeden w przód z zawinięciem modulo</item>
  <item data-correct="1">Nowa wartość trafia do tablicy _dane pod aktualny _indeksZapisu, nadpisując najstarszy wpis</item>
  <item data-correct="4">Właściwość Count nie rośnie, ponieważ osiągnęła już maksymalną pojemność tablicy</item>
  <item data-correct="2">Poprzednio drugi najstarszy element staje się teraz najstarszym elementem w buforze</item>
</data-sortable-list>
</data-gate>

---

## 🧩 Wartość domyślna default oraz pułapka porównywania

Pisząc kod generyczny, nie znasz jeszcze docelowego typu `T`. Ta niewiedza blokuje dwie operacje, które w zwykłych klasach wydają się oczywiste: zwracanie `null` oraz porównywanie operatorem `==`.

### 🕳️ Słowo kluczowe default

Załóżmy, że piszesz metodę bezpiecznego odczytu ze stosu `TryPobierzSzczyt(out T wynik)`. Gdy stos jest pusty, musisz przypisać coś do parametru *wynik* przed zwróceniem `false`. Nie możesz jednak napisać `wynik = null;`, bo kompilator odrzuci taki kod: jeśli ktoś utworzy kolekcję dla `int`, typ wartościowy nie przyjmie wartości `null`.

Rozwiązaniem jest operator **`default(T)`**. Zwraca on wyzerowaną wartość dopasowaną do konkretnego typu:

- dla typów liczbowych (`int`, `double`, `decimal`): zwraca `0`,
- dla `bool`: zwraca `false`,
- dla typów referencyjnych (`string`, klasy, tablice): zwraca `null`.

```csharp
public bool TryPobierzPierwszy(out T wynik)
{
    if (_licznik == 0)
    {
        wynik = default(T);
        return false;
    }

    wynik = _elementy[0];
    return true;
}
```

Operator `default(T)` ma jeszcze jedno krytyczne zastosowanie: czyszczenie kolekcji w metodzie `Wyczysc()`. Samo wyzerowanie licznika `Count = 0` nie usuwa starych referencji z wewnętrznej tablicy *_dane*. Jeśli bufor przechowywał duże obiekty, Garbage Collector nie zwolni ich pamięci, dopóki nie nadpiszesz komórek tablicy wartością `default(T)` lub nie wywołasz `Array.Clear(_dane, 0, _dane.Length)`.

> [!WARNING]
> Pozostawienie starych referencji w tablicy po logicznym wyczyszczeniu kolekcji powoduje **_wyciek pamięci_**. Obiekty pozostają osiągalne dla Garbage Collectora, mimo że program już ich nie potrzebuje.

### ⚖️ Dlaczego operator == nie działa na typie T

Próba napisania warunku `if (_dane[i] == szukany)` wewnątrz klasy generycznej zakończy się **_błędem kompilacji CS0019_**. Kompilator nie ma gwarancji, że nieznany typ `T` w ogóle definiuje operator `==` (na przykład własne struktury `struct` domyślnie go nie mają).

Nie powinieneś też wywoływać `szukany.Equals(element)`, bo gdy *szukany* jest równy `null`, program rzuci **_NullReferenceException_**. Kanonicznym narzędziem w C# jest **`EqualityComparer<T>.Default`**:

```csharp
public bool CzyZawiera<T>(T[] tablica, T szukany)
{
    var porownywacz = EqualityComparer<T>.Default;
    for (int i = 0; i < tablica.Length; i++)
    {
        if (porownywacz.Equals(tablica[i], szukany))
            return true;
    }
    return false;
}
```

Klasa `EqualityComparer<T>.Default` automatycznie dobiera najlepszy sposób porównania dla danego typu `T`. Obsługuje bezpiecznie wartości `null`, wykorzystuje interfejs `IEquatable<T>` i unika boxingu typów wartościowych.

---

## 🔒 Ograniczenia where, wiele parametrów i wnioskowanie typu

Domyślnie kompilator wie o typie `T` wyłącznie to, że dziedziczy po `object`. Nie pozwoli Ci więc utworzyć nowej instancji przez `new T()` ani porównać kolejności przez `a.CompareTo(b)`.

### 🎯 Ograniczenia pojedyncze i złożone

Aby poinformować kompilator, jakie możliwości musi posiadać typ `T`, nakładasz ograniczenie **`where`**:

| Ograniczenie | Co gwarantuje kompilatorowi? | Przykładowe typy pasujące |
| --- | --- | --- |
| `where T : IComparable<T>` | Typ `T` ma metodę `CompareTo(T other)` | `int`, `double`, `string`, `DateTime` |
| `where T : class` | Typ `T` jest typem referencyjnym (można przypisać `null`) | `string`, `List<int>`, własne klasy |
| `where T : struct` | Typ `T` jest typem wartościowym (nie może być `null`) | `int`, `double`, `bool`, `DateTime` |
| `where T : new()` | Typ `T` ma publiczny konstruktor bezparametrowy | `List<string>`, `StringBuilder` |

Możesz łączyć wiele wymagań dla jednego typu, oddzielając je przecinkami. Kolejność w klauzuli jest ściśle określona: ograniczenie `class` lub `struct` musi stać na samym początku, a `new()` zawsze na samym końcu:

```csharp
public class Repozytorium<T> where T : class, IComparable<T>, new()
{
    public T UtworzDomyslny()
    {
        return new T();
    }
}
```

Klasy i metody mogą też przyjmować **wiele parametrów typu** naraz, na przykład `<TKlucz, TWartosc>`. Każdy parametr może wtedy otrzymać własną klauzulę `where`:

```csharp
public class WpisPamieciPodrecznej<TKlucz, TWartosc>
    where TKlucz : IEquatable<TKlucz>
    where TWartosc : class
{
    public TKlucz Klucz { get; private set; }
    public TWartosc Wartosc { get; private set; }

    public WpisPamieciPodrecznej(TKlucz klucz, TWartosc wartosc)
    {
        Klucz = klucz;
        Wartosc = wartosc;
    }
}
```

### 🧠 Klasa generyczna a metoda generyczna z wnioskowaniem typu

Istnieje ważna różnica między typem generycznym na poziomie klasy a metodą generyczną w zwykłej klasie. Tworząc obiekt klasy generycznej, musisz jawnie podać typ w nawiasach ostrych: `new BuforCykliczny<double>(5)`.

W przypadku **metody generycznej** kompilator potrafi zastosować _**wnioskowanie typu**_ (Type Inference). Na podstawie typów przekazanych argumentów sam rozpoznaje, czym jest `T`:

```csharp
public static bool CzyPosortowanaRosnaco<T>(T[] tablica) where T : IComparable<T>
{
    if (tablica == null || tablica.Length < 2)
        return true;

    for (int i = 1; i < tablica.Length; i++)
    {
        if (tablica[i - 1].CompareTo(tablica[i]) > 0)
            return false;
    }
    return true;
}
```

Metoda `CompareTo` zwraca liczbę ujemną, gdy pierwszy obiekt jest mniejszy, `0` przy równości oraz dodatnią, gdy jest większy. Wywołując `CzyPosortowanaRosnaco(new int[] { 2, 5, 9 })`, nie musisz dopisywać `<int>`, ponieważ kompilator odczytuje ten typ wprost z przekazywanej tablicy.

<data-gate>
<data-connection-matcher title="Dopasuj potrzebną operację w kodzie generycznym do właściwego mechanizmu C#">
  <item left="Wywołanie a.CompareTo(b) do ustalenia kolejności elementów" right="where T : IComparable&lt;T&gt;"></item>
  <item left="Utworzenie nowego obiektu instrukcją new T()" right="where T : new()"></item>
  <item left="Bezpieczne porównanie równości dwóch wartości typu T z obsługą null" right="EqualityComparer&lt;T&gt;.Default.Equals(a, b)"></item>
  <item left="Przypisanie pustej wartości do parametru out T bez zakładania typu" right="default(T)"></item>
  <item left="Wymuszenie, aby typ T był typem referencyjnym dopuszczającym null" right="where T : class"></item>
</data-connection-matcher>
</data-gate>

---

## 🔗 Interfejs IEnumerable jako most do foreach i LINQ

Własna kolekcja generyczna zyskuje pełną użyteczność dopiero wtedy, gdy współpracuje z pętlą `foreach` oraz z operatorami LINQ, które poznasz w kolejnej lekcji. Aby to osiągnąć, klasa musi zaimplementować interfejs **`IEnumerable<T>`** z przestrzeni `System.Collections.Generic`.

Interfejs `IEnumerable<T>` dziedziczy po starszym, niegenerycznym interfejsie `IEnumerable` z czasów C# 1.0. Dlatego klasa musi dostarczyć dwie metody `GetEnumerator()`:

```csharp
using System.Collections;
using System.Collections.Generic;

public class StalaPara<T> : IEnumerable<T>
{
    private T _pierwszy;
    private T _drugi;

    public StalaPara(T pierwszy, T drugi)
    {
        _pierwszy = pierwszy;
        _drugi = drugi;
    }

    public IEnumerator<T> GetEnumerator()
    {
        yield return _pierwszy;
        yield return _drugi;
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

Słowo kluczowe **`yield return`** zwraca kolejne elementy pojedynczo, bez tworzenia dodatkowej listy w pamięci. Druga metoda przekierowuje starsze wywołania do wersji generycznej. Od tej chwili każdy obiekt `StalaPara<T>` działa bezpośrednio w pętli `foreach` i przyjmuje pełen zestaw zapytań LINQ.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Reified Generics w CLR kontra Type Erasure w Javie i szablony C++</span>
<span class="deep-dive-badge">CLR · JIT · JAVA · C++ TEMPLATES</span>
</summary>
<div class="deep-dive-content">

<h4>1. Trzy architektury typów generycznych w językach przemysłowych</h4>

Choć zapis `List<int>` wygląda podobnie w C#, Javie i C++ (`std::vector<int>`), sposób zamiany kodu na instrukcje procesora i układ w pamięci RAM jest zupełnie inny.

<h4>2. Java: wymazywanie typów (Type Erasure)</h4>

W Javie generyki dodano w 2004 roku (Java 5) z wymogiem wstecznej zgodności ze starszym bajtkodem JVM. Kompilator `javac` sprawdza typy przy kompilacji, a następnie **usuwa parametr `<T>`** i zamienia go na `Object`.

- W bajtkodzie nie istnieje `ArrayList<Integer>`: istnieje wyłącznie surowy `ArrayList` przechowujący referencje `Object`.
- Nie możesz utworzyć `ArrayList<int>`. Każda 4-bajtowa liczba `int` przechodzi **_boxing_** do obiektu `Integer` na stercie (nagłówek obiektu + pole + referencja w tablicy).
- Dla **1 000 000 liczb całkowitych** oznacza to około **20 do 24 MB pamięci** i milion osobnych alokacji, które obciążają Garbage Collector i pogarszają trafienia w pamięć podręczną CPU.

<h4>3. C++: szablony i monomorfizacja (Templates)</h4>

W C++ `template<typename T>` działa w czasie kompilacji jak generator kodu źródłowego. Dla każdego użytego typu `T` kompilator tworzy osobną definicję klasy i osobny kod maszynowy:

```cpp
template<typename T>
class RingBuffer { /* osobna kopia kodu dla int, double, Widget*, Enemy* */ };
```

- Zaleta: zerowy narzut w czasie uruchomienia, ciągły układ pamięci dla typów wartościowych i pełne rozwijanie funkcji przez optymalizator.
- Koszt: użycie `std::vector<T*>` dla 40 różnych klas wskaźników tworzy 40 niemal identycznych kopii kodu maszynowego. Powoduje to **_Code Bloat_**, który wydłuża kompilację i powiększa plik wykonywalny, marnując pamięć podręczną instrukcji (L1i cache).

<h4>4. C# i CLR: generyki zachowane w runtime (Reified Generics)</h4>

Twórcy .NET 2.0 zmodyfikowali maszynę wirtualną CLR oraz bajtkod CIL. Informacja o `<T>` zostaje zapisana w metadanych pliku wykonywalnego i trafia do kompilatora JIT podczas uruchamiania programu. JIT stosuje strategię hybrydową:

- **Dla wszystkich typów referencyjnych** (`List<string>`, `List<object>`) JIT generuje **jeden współdzielony kod maszynowy** (Canonical Sharing). Każda referencja na x86-64 zajmuje dokładnie 8 bajtów, więc instrukcje przesuwania wskaźników są identyczne.
- **Dla każdego typu wartościowego** (`List<int>`, `List<double>`) JIT generuje **wyspecjalizowany kod natywny** dopasowany do dokładnego rozmiaru struktury (4 bajty dla `int`, 8 bajtów dla `double`).

| Cecha | Java (Type Erasure) | C++ (Templates) | C# / CLR (Reified Generics) |
| --- | --- | --- | --- |
| Moment specjalizacji | Czas kompilacji (usunięcie `T`) | Czas kompilacji (monomorfizacja) | Czas uruchomienia (JIT) |
| Pamięć dla 1 000 000 `int` | ok. 20 do 24 MB (boxing) | 4 MB (ciągła tablica) | 4 MB (ciągła tablica) |
| Kopie kodu dla 40 klas ref. | 1 kopia | 40 kopii (**_Code Bloat_**) | 1 współdzielona kopia |
| `typeof(T)` w runtime | Niedostępne (wymazane) | Brak (RTTI ograniczone) | Pełna informacja o typie |

Dla **1 000 000 liczb `int`** w C# `List<int>` powstaje jedna ciągła tablica o rozmiarze dokładnie **4 MB** w RAM, bez boxingu i bez nadmiarowego powielania kodu dla typów referencyjnych.

</div>
</details>

---

## 💻 Zadanie praktyczne (2 pliki): Generyczny bufor cykliczny

W zakładce **`BuforCykliczny.cs`** zaimplementuj klasę `BuforCykliczny<T>` oraz statyczną klasę `NarzedziaGeneryczne`:

1. **Konstruktor `BuforCykliczny(int pojemnosc)`**:
   - dla niepoprawnej pojemności (`<= 0`) rzuć wyjątek `ArgumentOutOfRangeException`,
   - przygotuj wewnętrzną tablicę o zadanym rozmiarze.
2. **Metoda `Dodaj(T element)`**:
   - zapisuje element na bieżącej pozycji zapisu,
   - przesuwa wskaźnik zapisu cyklicznie na kolejną komórkę,
   - aktualizuje `Count` aż do osiągnięcia maksymalnej pojemności.
3. **Metoda `PobierzWszystkie()`**:
   - zwraca nową listę `List<T>` z dokładnie `Count` aktualnymi elementami w kolejności od najstarszego do najnowszego (dla pustego bufora zwraca pustą listę).
4. **Metoda `PobierzNajnowszy()`**:
   - dla pustego bufora rzuca `InvalidOperationException`,
   - w przeciwnym razie zwraca ostatnio dodany element.
5. **Metoda `TryPobierzNajnowszy(out T wynik)`**:
   - dla pustego bufora ustawia *wynik* na wartość domyślną typu `T` i zwraca `false`,
   - dla niepustego bufora przypisuje ostatnio dodany element do *wynik* i zwraca `true`.
6. **Metoda `Zawiera(T szukany)`**:
   - sprawdza wyłącznie wśród `Count` aktualnie przechowywanych elementów, czy bufor zawiera *szukany*,
   - użyj bezpiecznego porównywania generycznego obsługującego również wartość `null`.
7. **Klasa `NarzedziaGeneryczne`**:
   - metoda `Maksimum<TVal>(TVal a, TVal b) where TVal : IComparable<TVal>`: zwraca większą z dwóch wartości (przy równości zwraca *a*),
   - metoda `OgraniczDoZakresu<TVal>(TVal wartosc, TVal min, TVal max) where TVal : IComparable<TVal>`: jeśli *min* jest większe od *max*, rzuca `ArgumentException`; jeśli *wartosc* jest poniżej *min*, zwraca *min*; jeśli powyżej *max*, zwraca *max*; w przeciwnym razie zwraca *wartosc*.

<data-gate>
<data-csharp-lab title="Zadanie: Generyczny BuforCykliczny, default(T), EqualityComparer i where IComparable">
<cs-file name="Program.cs">

```csharp
using System;

class Program
{
    static void Main()
    {
        var historiaRam = new BuforCykliczny<double>(3);
        historiaRam.Dodaj(61.0);
        historiaRam.Dodaj(63.5);
        historiaRam.Dodaj(65.0);
        historiaRam.Dodaj(52.0); // Nadpisuje 61.0

        Console.WriteLine("Liczba probek: " + historiaRam.Count);
        Console.WriteLine("Najnowsza probka: " + historiaRam.PobierzNajnowszy());
        Console.WriteLine("Czy zawiera 61.0: " + historiaRam.Zawiera(61.0));
        Console.WriteLine("Czy zawiera 65.0: " + historiaRam.Zawiera(65.0));
        Console.WriteLine("Historia (od najstarszej): " + string.Join(", ", historiaRam.PobierzWszystkie()));

        double ostatnia;
        if (historiaRam.TryPobierzNajnowszy(out ostatnia))
            Console.WriteLine("TryPobierzNajnowszy: " + ostatnia);

        Console.WriteLine("Max(12, 45) = " + NarzedziaGeneryczne.Maksimum(12, 45));
        Console.WriteLine("Ogranicz(120, 0, 100) = " + NarzedziaGeneryczne.OgraniczDoZakresu(120, 0, 100));
    }
}
```

</cs-file>
<cs-file name="BuforCykliczny.cs">

```csharp
using System;
using System.Collections.Generic;

public class BuforCykliczny<T>
{
    private T[] _dane;
    private int _indeksZapisu;
    public int Count { get; private set; }
    public int Pojemnosc { get { return _dane.Length; } }

    public BuforCykliczny(int pojemnosc)
    {
        // Zwaliduj pojemnosc <= 0 i zaalokuj tablice
        _dane = new T[pojemnosc > 0 ? pojemnosc : 1];
    }

    public void Dodaj(T element)
    {
        // Zapisz element, przesun indeks cyklicznie i zaktualizuj Count
    }

    public List<T> PobierzWszystkie()
    {
        // Zwroc elementy w kolejnosci od najstarszego do najnowszego
        return new List<T>();
    }

    public T PobierzNajnowszy()
    {
        // Dla pustego bufora rzuc InvalidOperationException, inaczej zwroc ostatnio dodany element
        throw new NotImplementedException();
    }

    public bool TryPobierzNajnowszy(out T wynik)
    {
        // Dla pustego bufora ustaw default(T) i zwroc false, inaczej zwroc ostatni element i true
        wynik = default(T);
        return false;
    }

    public bool Zawiera(T szukany)
    {
        // Sprawdz wsrod Count aktualnych elementow za pomoca bezpiecznego porownywania generycznego
        return false;
    }
}

public static class NarzedziaGeneryczne
{
    public static TVal Maksimum<TVal>(TVal a, TVal b) where TVal : IComparable<TVal>
    {
        // Zwroc wiekszy element za pomoca CompareTo
        return a;
    }

    public static TVal OgraniczDoZakresu<TVal>(TVal wartosc, TVal min, TVal max) where TVal : IComparable<TVal>
    {
        // Zwaliduj min > max (ArgumentException) i przytnij wartosc do przedzialu [min, max]
        return wartosc;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("BuforCykliczny<double> zwraca elementy po zapelnieniu oraz po nadpisaniu", () => {
    var b = new BuforCykliczny<double>(3);
    b.Dodaj(10.0);
    b.Dodaj(20.0);
    b.Dodaj(30.0);
    LabAssert.Equal(3, b.Count);
    LabAssert.Equal(30.0, b.PobierzNajnowszy());

    var pelnyBezNadpisania = b.PobierzWszystkie();
    LabAssert.Equal(3, pelnyBezNadpisania.Count);
    LabAssert.Equal(10.0, pelnyBezNadpisania[0]);
    LabAssert.Equal(20.0, pelnyBezNadpisania[1]);
    LabAssert.Equal(30.0, pelnyBezNadpisania[2]);

    b.Dodaj(40.0);
    b.Dodaj(50.0);
    LabAssert.Equal(3, b.Count);
    LabAssert.Equal(50.0, b.PobierzNajnowszy());

    var poNadpisaniu = b.PobierzWszystkie();
    LabAssert.Equal(3, poNadpisaniu.Count);
    LabAssert.Equal(30.0, poNadpisaniu[0]);
    LabAssert.Equal(40.0, poNadpisaniu[1]);
    LabAssert.Equal(50.0, poNadpisaniu[2]);
});

LabAssert.Test("BuforCykliczny obsluguje czesciowe zapelnienie oraz pojemnosc rowna 1", () => {
    var logi = new BuforCykliczny<string>(4);
    logi.Dodaj("ping");
    logi.Dodaj("tracert");
    LabAssert.Equal(2, logi.Count);
    LabAssert.Equal(4, logi.Pojemnosc);
    LabAssert.Equal("tracert", logi.PobierzNajnowszy());

    var lista = logi.PobierzWszystkie();
    LabAssert.Equal(2, lista.Count);
    LabAssert.Equal("ping", lista[0]);
    LabAssert.Equal("tracert", lista[1]);

    var pojedynczy = new BuforCykliczny<int>(1);
    pojedynczy.Dodaj(7);
    LabAssert.Equal(1, pojedynczy.Count);
    LabAssert.Equal(7, pojedynczy.PobierzNajnowszy());
    pojedynczy.Dodaj(42);
    LabAssert.Equal(1, pojedynczy.Count);
    LabAssert.Equal(42, pojedynczy.PobierzNajnowszy());
    LabAssert.Equal(42, pojedynczy.PobierzWszystkie()[0]);
});

LabAssert.Test("TryPobierzNajnowszy zwraca false i default(T) dla pustego bufora oraz true dla niepustego", () => {
    var pustyInt = new BuforCykliczny<int>(3);
    int wynikInt = 999;
    LabAssert.Equal(false, pustyInt.TryPobierzNajnowszy(out wynikInt));
    LabAssert.Equal(0, wynikInt);

    var pustyStr = new BuforCykliczny<string>(2);
    string wynikStr = "stary";
    LabAssert.Equal(false, pustyStr.TryPobierzNajnowszy(out wynikStr));
    LabAssert.Equal(null, wynikStr);

    pustyInt.Dodaj(11);
    pustyInt.Dodaj(22);
    LabAssert.Equal(true, pustyInt.TryPobierzNajnowszy(out wynikInt));
    LabAssert.Equal(22, wynikInt);
});

LabAssert.Test("Zawiera szuka tylko wsrod aktualnych elementow i obsluguje null", () => {
    var liczby = new BuforCykliczny<int>(3);
    liczby.Dodaj(10);
    // Niezapisane sloty w tablicy maja 0, ale Count == 1, wiec 0 nie jest w buforze!
    LabAssert.Equal(false, liczby.Zawiera(0));
    LabAssert.Equal(true, liczby.Zawiera(10));

    liczby.Dodaj(20);
    liczby.Dodaj(30);
    liczby.Dodaj(40); // Nadpisuje 10
    LabAssert.Equal(false, liczby.Zawiera(10));
    LabAssert.Equal(true, liczby.Zawiera(20));
    LabAssert.Equal(true, liczby.Zawiera(40));

    var napisy = new BuforCykliczny<string>(2);
    napisy.Dodaj("ok");
    LabAssert.Equal(false, napisy.Zawiera(null));
    napisy.Dodaj(null);
    LabAssert.Equal(true, napisy.Zawiera(null));
    LabAssert.Equal(true, napisy.Zawiera("ok"));
});

LabAssert.Test("Przypadki brzegowe: niepoprawna pojemnosc i pusty bufor", () => {
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new BuforCykliczny<int>(0));
    LabAssert.Throws<ArgumentOutOfRangeException>(() => new BuforCykliczny<int>(-5));

    var pusty = new BuforCykliczny<int>(3);
    LabAssert.Equal(0, pusty.PobierzWszystkie().Count);
    LabAssert.Throws<InvalidOperationException>(() => pusty.PobierzNajnowszy());
});

LabAssert.Test("NarzedziaGeneryczne.Maksimum dziala dla a < b, a > b oraz a == b", () => {
    LabAssert.Equal(99, NarzedziaGeneryczne.Maksimum(15, 99));
    LabAssert.Equal(99, NarzedziaGeneryczne.Maksimum(99, 15));
    LabAssert.Equal(-2, NarzedziaGeneryczne.Maksimum(-10, -2));
    LabAssert.Equal(7.5, NarzedziaGeneryczne.Maksimum(7.5, 7.5));
    LabAssert.Equal("zeta", NarzedziaGeneryczne.Maksimum("alfa", "zeta"));
    LabAssert.Equal("zeta", NarzedziaGeneryczne.Maksimum("zeta", "alfa"));
});

LabAssert.Test("NarzedziaGeneryczne.OgraniczDoZakresu przycina wartosci i waliduje min > max", () => {
    LabAssert.Equal(0, NarzedziaGeneryczne.OgraniczDoZakresu(-15, 0, 100));
    LabAssert.Equal(100, NarzedziaGeneryczne.OgraniczDoZakresu(250, 0, 100));
    LabAssert.Equal(42, NarzedziaGeneryczne.OgraniczDoZakresu(42, 0, 100));
    LabAssert.Equal(5.0, NarzedziaGeneryczne.OgraniczDoZakresu(5.0, 5.0, 5.0));
    LabAssert.Equal("beta", NarzedziaGeneryczne.OgraniczDoZakresu("alfa", "beta", "delta"));
    LabAssert.Equal("delta", NarzedziaGeneryczne.OgraniczDoZakresu("omega", "beta", "delta"));
    LabAssert.Throws<ArgumentException>(() => NarzedziaGeneryczne.OgraniczDoZakresu(5, 10, 1));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- <strong>Gdy ta sama struktura danych ma działać dla różnych typów:</strong> użyj parametru generycznego `<T>` zamiast `object[]`, aby wykrywać niezgodność typów podczas kompilacji i uniknąć **_boxingu_** na stercie.
- <strong>Gdy musisz zwrócić pustą wartość lub wyczyścić referencje dla nieznanego `T`:</strong> sięgnij po `default(T)` zamiast `null`.
- <strong>Gdy porównujesz równość elementów typu `T`:</strong> używaj `EqualityComparer<T>.Default.Equals(a, b)` zamiast operatora `==`, bo obsługuje bezpiecznie `null` i wszystkie typy wartościowe.
- <strong>Gdy metoda generyczna wymaga wywołania konkretnych operacji na `T`:</strong> dodaj ograniczenie `where` (np. `IComparable<T>` dla `CompareTo` lub `new()` dla konstruktora).
- <strong>Gdy tworzysz własną kolekcję i chcesz używać jej w `foreach` oraz LINQ:</strong> zaimplementuj interfejs `IEnumerable<T>` wraz z jawną metodą `IEnumerator IEnumerable.GetEnumerator()`.
