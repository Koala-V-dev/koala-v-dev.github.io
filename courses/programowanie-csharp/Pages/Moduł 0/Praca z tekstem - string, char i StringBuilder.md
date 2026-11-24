# Praca z tekstem - string, char i StringBuilder

Jeśli spróbujesz zaszyfrować literę `'Y'`, dodając do niej `3`, komputer nie zwróci `'B'`, lecz znak ukośnika `'\\'`. Jeśli z kolei będziesz sklejać znaki w pętli operatorem `+=`, zbudowanie krótkiego tekstu o długości 50 000 znaków zmusi program do skopiowania **_2 500 000 000 bajtów (2,5 GB)_** pamięci RAM.

Oba problemy wynikają z tego, jak C# przechowuje znaki i napisy w pamięci. Gdy poznasz mechanizm kodowania znaków, niemutowalność napisów i klasę `StringBuilder`, połączysz całą wiedzę z Modułu 0 w pierwszy kompletny program do pobrania: **`CipherForge.exe`**.

---

## 🔤 Elementarz typów string i char

W C# pojedynczy znak ma typ **`char`** i zapisuje się go w apostrofach, na przykład `'A'` lub `'7'`. Ciąg znaków ma typ **`string`** i zapisuje się go w cudzysłowach, na przykład `"KOD"`.

Do pojedynczego znaku w napisie dostajesz się przez indeks w nawiasach kwadratowych. Indeksowanie zawsze zaczyna się od **`0`** i kończy na **`Length - 1`**:

```csharp
string nazwa = "KOD";
int dlugosc = nazwa.Length; // 3
char pierwszy = nazwa[0];   // 'K'
char ostatni = nazwa[2];    // 'D'
```

Próba odczytu `nazwa[3]` lub `nazwa[-1]` natychmiast przerywa program wyjątkiem **_IndexOutOfRangeException_**.

### 🕳️ Puste napisy: null, "" oraz same spacje

Napis w C# może przyjmować trzy różne stany, które łatwo pomylić:

| Wartość | Co oznacza? | Wynik `.Length` |
| :---: | --- | :---: |
| `null` | Brak obiektu w pamięci | **_NullReferenceException_** |
| `""` | Istniejący, pusty napis | `0` |
| `"   "` | Napis zawierający same spacje | `3` |

Zamiast ręcznie sprawdzać `tekst == null || tekst.Length == 0`, używaj gotowych metod ochronnych:
- **`string.IsNullOrEmpty(tekst)`** zwraca `true` dla `null` oraz `""`,
- **`string.IsNullOrWhiteSpace(tekst)`** zwraca `true` dla `null`, `""` oraz samych spacji i znaków nowej linii.

### 🛠️ Przydatne metody string i char

| Operacja | Przykład | Wynik |
| --- | --- | --- |
| Zamiana wielkości liter | `"Koala".ToLower()`, `"Koala".ToUpper()` | `"koala"`, `"KOALA"` |
| Usunięcie spacji z brzegów | `"  admin  ".Trim()` | `"admin"` |
| Sprawdzenie obecności fragmentu | `"CipherForge".Contains("Forge")` | `true` |
| Wycinek napisu | `"CipherForge".Substring(0, 6)` | `"Cipher"` |
| Klasyfikacja znaku | `char.IsLower(c)`, `char.IsUpper(c)`, `char.IsDigit(c)` | `true` lub `false` |

### 🔍 Przewidź wynik: niemutowalność string

Zatrzymaj się na chwilę i przewidź, co dokładnie wypisze konsola po uruchomieniu tego kodu:

```csharp
string haslo = "  admin  ";
haslo.Trim();
Console.WriteLine("[" + haslo + "]");
```

Konsola wypisze **`[  admin  ]`** ze spacjami na obu końcach!

Dzieje się tak, ponieważ typ `string` w C# jest **niemutowalny**. Raz utworzonego napisu w pamięci RAM nie da się zmienić w miejscu. Zapis `haslo[0] = 'X';` to **_błąd kompilacji_**.

Metoda `Trim()` (a także `ToLower()`, `ToUpper()` i `Substring()`) nigdy nie modyfikuje oryginalnej zmiennej. Tworzy w pamięci **nowy napis** i go zwraca. Jeśli nie przypiszesz wyniku z powrotem, nowy napis natychmiast znika:

```csharp
haslo = haslo.Trim(); // dopiero teraz zmienna haslo ma wartosc "admin"
```

> [!WARNING]
> Wywołanie `tekst.Trim();` lub `tekst.ToLower();` bez przypisania wyniku do zmiennej nie zmienia zawartości *tekst*. Zawsze zapisuj wynik: `tekst = tekst.Trim();`.

---

## 🔢 Kodowanie ASCII, UTF-16 i arytmetyka char

Wewnątrz pamięci RAM komputer nie przechowuje rysunków liter, lecz liczby całkowite. Standard **ASCII** przypisuje liczby od `0` do `127` znakom alfabetu angielskiego, cyfrom i podstawowym symbolom.

W języku C# typ `char` zajmuje dokładnie **2 bajty** w kodowaniu **UTF-16**. Dla pierwszych 128 znaków kody UTF-16 są identyczne z tabelą ASCII, a pozostałe wartości pozwalają zapisywać polskie znaki diakrytyczne oraz symbole z innych alfabetów.

<data-ascii-converter initial="A"></data-ascii-converter>

Litery alfabetu angielskiego leżą w tabeli jedna za drugą bez przerw:
- `'A'` ma kod `65`, a `'Z'` ma kod `90`,
- `'a'` ma kod `97`, a `'z'` ma kod `122`,
- `'0'` ma kod `48`, a `'9'` ma kod `57`.

Ponieważ `char` jest w pamięci liczbą, możesz sprawdzać przynależność znaku do alfabetu angielskiego warunkami `c >= 'A' && c <= 'Z'` oraz `c >= 'a' && c <= 'z'`. To bezpieczniejsze dla szyfru Cezara niż `char.IsUpper(c)`, ponieważ `char.IsUpper('Ż')` również zwraca `true`, a odjęcie `'A'` od polskiej litery `'Ż'` wyszłoby daleko poza zakres `0..25`.

Dlatego dodanie `3` do `'Y'` (`89`) daje kod `92`, czyli znak `'\\'`. Aby po literze `'Z'` zawinąć wynik z powrotem na początek alfabetu (`'A'`), sprowadzamy literę do zakresu `0..25`, dodajemy przesunięcie modulo `26`, a potem wracamy do kodów liter:

```csharp
char litera = 'Y';
int klucz = 3;
int przesuniecie = ((klucz % 26) + 26) % 26;    // 3
int pozycja = litera - 'A';                     // 89 - 65 = 24
int nowaPozycja = (pozycja + przesuniecie) % 26; // (24 + 3) % 26 = 1
char wynik = (char)('A' + nowaPozycja);         // (char)(65 + 1) = 'B'
```

### 🔄 Dlaczego normalizacja klucza ma podwójne modulo?

W C# operator `%` dla liczby ujemnej zwraca **resztę ujemną**: `-3 % 26` wynosi `-3`, a nie `23`. Gdybyś użył tej wartości w przesunięciu dla litery `'A'` (pozycja `0`), otrzymałbyś `0 + (-3) = -3` i wyszedł przed alfabet!

Wzór **`((klucz % 26) + 26) % 26`** bezpiecznie sprowadza każdy klucz do zakresu `0..25`:

| Wartość *klucz* | Krok 1: `klucz % 26` | Krok 2: `+ 26` | Krok 3: `% 26` | Efekt |
| :---: | :---: | :---: | :---: | --- |
| `3` | `3` | `29` | **`3`** | Szyfrowanie o `3` w prawo |
| `-3` | `-3` | `23` | **`23`** | Deszyfrowanie o `3` w lewo (`'B' -> 'Y'`) |
| `29` | `3` | `29` | **`3`** | Pełny obrót `26` + przesunięcie o `3` |

<data-caesar-wheel></data-caesar-wheel>

---

## 🧱 Budowanie napisów w pętli: StringBuilder

Skoro `string` jest niemutowalny, co dzieje się przy `wynik += c;` w pętli? W każdym obiegu środowisko uruchomieniowe rezerwuje w RAM nowy, o jeden znak dłuższy napis. Kopiuje do niego całą dotychczasową treść, dopisuje nowy znak i porzuca starą kopię.

Porzuconymi obiektami w C# zajmuje się automatyczny sprzątacz pamięci zwany _**Garbage Collectorem**_. Gdy w pętli dopisujesz pojedynczy znak 50 000 razy (jeden `char` to 2 bajty), program kopiuje $2 \times (1 + 2 + \dots + 50\,000)$ bajtów:

| Metoda dla 50 000 znaków | Liczba nowych obiektów | Skopiowana pamięć RAM | Praca Garbage Collectora |
| --- | :---: | :---: | --- |
| `string wynik = ""; wynik += c;` | `50 000` obiektów | **_2 500 000 000 bajtów (2,5 GB)_** | Częste pauzy czyszczenia pamięci |
| `StringBuilder sb = new StringBuilder(); sb.Append(c);` | kilkanaście buforów | ok. **100 KB** | Minimalny narzut, ułamek milisekundy |

Klasa **`StringBuilder`** z przestrzeni nazw `System.Text` trzyma wewnętrzny, modyfikowalny bufor znaków. Słowo kluczowe **`new`** tworzy w pamięci nowy obiekt takiego bufora (szczegółowo poznasz je w module o obiektowości). Dopisujesz znaki metodą `.Append(...)`, a na końcu zamieniasz całość na zwykły `string` metodą `.ToString()`.

Przykład użycia `StringBuilder` do odwrócenia napisu:

```csharp
using System.Text;

string wejscie = "KOALA";
StringBuilder sb = new StringBuilder(wejscie.Length);

for (int i = wejscie.Length - 1; i >= 0; i--)
{
    sb.Append(wejscie[i]);
}

string odwrocony = sb.ToString(); // "ALAOK"
```

<data-gate>
<data-connection-matcher title="Dopasuj operację na napisach C# do jej skutku w pamięci RAM">
  <item left="string s = null; int x = s.Length;" right="Rzuca wyjątek NullReferenceException (brak obiektu w pamięci)"></item>
  <item left="string kod = &quot;abc&quot;; kod.ToUpper();" right="Zmienna kod nadal ma wartość &quot;abc&quot; (niemutowalność bez przypisania)"></item>
  <item left="wynik += c; (50 000 razy w pętli)" right="Kopiuje ok. 2,5 GB RAM i przeciąża Garbage Collector"></item>
  <item left="sb.Append(c); ... sb.ToString();" right="Dopisuje znaki do modyfikowalnego bufora w ok. 100 KB RAM"></item>
</data-connection-matcher>
</data-gate>

---

## 🔐 Wzorzec czterech flag i entropia Shannona

W poprzedniej lekcji poznałeś wzorzec flagi boolowskiej w pętli. Wykorzystamy go teraz do oceny siły hasła.

Aby oszacować, jak trudno złamać hasło metodą siłową, sprawdzamy, z jak dużej **puli znaków** korzystał autor hasła. Tworzymy przed pętlą cztery flagi startujące od `false`:
- *maMale* (małe litery `char.IsLower(c)`),
- *maWielkie* (wielkie litery `char.IsUpper(c)`),
- *maCyfry* (cyfry `char.IsDigit(c)`),
- *maSymbole* (wszystkie pozostałe znaki).

W jednej pętli `for` po znakach hasła ustawiamy odpowiednie flagi na `true`. Po pętli sumujemy rozmiar puli *pula*:
- jeśli *maMale*: dodaj `26`,
- jeśli *maWielkie*: dodaj `26`,
- jeśli *maCyfry*: dodaj `10`,
- jeśli *maSymbole*: dodaj `10`.

Siłę hasła wyraża w bitach **entropia Shannona**:

$$H = L \cdot \log_2(N)$$

Gdzie $L$ to długość hasła (`haslo.Length`), a $N$ to rozmiar puli (`pula`). W C# logarytm o podstawie `2` oblicza gotowa metoda `Math.Log(pula, 2)`.

Policzmy to ręcznie dla hasła `"Kot99"`:
1. Długość hasła: `L = 5`.
2. Znaki w haśle: wielka `'K'` (`maWielkie = true`), małe `'o'`, `'t'` (`maMale = true`), cyfry `'9'` (`maCyfry = true`), brak symboli (`maSymbole = false`).
3. Rozmiar puli: `pula = 26 + 26 + 10 = 62`.
4. Entropia: `5 * Math.Log(62, 2)` daje około **`29,77` bita**.

> [!TIP]
> Każdy dodatkowy bit entropii **podwaja** liczbę kombinacji, które musi sprawdzić program łamiący hasło. Wydłużenie hasła z 8 do 16 znaków zwiększa jego odporność znacznie bardziej niż samo dopisanie jednego wykrzyknika.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Stack Buffer Overflow w C (char* i \0), String Interning w CLR oraz One-Time Pad</span>
<span class="deep-dive-badge">C STACK · CLR INTERN · KRYPTOGRAFIA</span>
</summary>
<div class="deep-dive-content">

<h4>1. Napisy char* w C, bajt zerowy \0 i podatność Stack Buffer Overflow</h4>

W języku C napis nie przechowuje własnej długości. Jest wskaźnikiem na pierwszy bajt w pamięci, a jego koniec wyznacza bajt zerowy `'\0'`. Aby poznać długość napisu, funkcja `strlen` musi skanować pamięć bajt po bajcie, aż natrafi na zero.

Klasyczna funkcja `strcpy(bufor, wejscie)` kopiuje bajty w ślepo, bez sprawdzania rozmiaru docelowej tablicy:

```c
void przetworzHaslo(const char* wejscie) {
    char bufor[16];          // 16 bajtow na stosie funkcji
    strcpy(bufor, wejscie);  // wejscie o dlugosci 40 bajtow nadpisuje stos!
}
```

Na stosie wywołań x86-64 bezpośrednio za tablicą `bufor[16]` leży zapisany **8-bajtowy adres powrotu (RIP)**, pod który procesor wraca po zakończeniu funkcji. Jeśli atakujący poda 40-bajtowy tekst, `strcpy` nadpisze adres powrotu adresem własnego kodu. To klasyczna podatność **_Stack Buffer Overflow_**.

W C# obiekt `string` na stercie ma 4-bajtowe pole `_stringLength` tuż przed znakami UTF-16. Odczyt `.Length` trwa jeden cykl, a przy każdym indeksowaniu `tekst[i]` środowisko CLR sprawdza zakres i rzuca **_IndexOutOfRangeException_** zamiast nadpisywać sąsiednią pamięć.

<h4>2. String Interning w środowisku CLR</h4>

Ponieważ napisy `string` w C# są niemutowalne, dwa fragmenty programu używające tego samego literału `"ADMIN"` nie muszą trzymać w pamięci dwóch kopii. Środowisko CLR utrzymuje na stercie wspólną tablicę zwaną **Intern Pool**:

```csharp
string a = "ADMIN";
string b = "ADMIN";
bool tenSamAdres = object.ReferenceEquals(a, b); // true!
```

Gdyby `string` był mutowalny, zmiana `a[0] = 'X'` po cichu zmieniłaby także zmienną `b` w zupełnie innym miejscu programu. Niemutowalność gwarantuje bezpieczeństwo współdzielenia napisów.

<h4>3. Kryptografia Shannona i dowód One-Time Pad</h4>

Szyfr Cezara ma zaledwie 25 nietrywialnych kluczy, więc komputer łamie go w mikrosekundy. Jeśli jednak zastąpisz stałe przesunięcie prawdziwie losowym kluczem o długości równej samej wiadomości, użytym dokładnie raz i łączonym operacją bitową `XOR`:

```text
Wiadomosc M:  01000001  ('A')
Klucz     K:  10110110  (losowy bajt)
Szyfrogram C: 11110111  (M XOR K)
Deszyfracja:  11110111 XOR 10110110 = 01000001 ('A')
```

Otrzymujesz szyfr **One-Time Pad**. W 1949 roku Claude Shannon udowodnił matematycznie, że dla dowolnego przechwyconego szyfrogramu istnieje klucz zamieniający go w każdą możliwą wiadomość tej samej długości z takim samym prawdopodobieństwem. Jest to jedyny znany szyfr nie do złamania nawet przy nieskończonej mocy obliczeniowej, pod warunkiem że klucz nigdy nie zostanie użyty drugi raz.

</div>
</details>

---

## 💻 Projekt Modułu 0: CipherForge.exe

Zbuduj swój pierwszy pobieralny program konsolowy **`CipherForge.exe`**, implementując dwie metody statyczne w klasie **`CipherEngine`**:

1. **`SzyfrujCezara(string tekst, int klucz)`**:
   - użyj **`StringBuilder`** do zbudowania wyniku,
   - znormalizuj klucz wzorem `int przesuniecie = ((klucz % 26) + 26) % 26;`, aby obsłużyć klucze dodatnie, ujemne (deszyfrowanie) oraz większe od `26`,
   - przesuwaj wielkie litery `'A'..'Z'` w obrębie wielkich liter, małe litery `'a'..'z'` w obrębie małych liter, a pozostałe znaki (spacje, cyfry, znaki interpunkcyjne) przepisuj bez zmian.
2. **`ObliczEntropie(string haslo)`**:
   - jeśli `string.IsNullOrEmpty(haslo)`, zwróć `0.0`,
   - użyj wzorca **czterech flag boolowskich** w pętli `for`:
     - małe litery (`char.IsLower(c)`): `+26` do puli,
     - wielkie litery (`char.IsUpper(c)`): `+26` do puli,
     - cyfry (`char.IsDigit(c)`): `+10` do puli,
     - pozostałe znaki specjalne: `+10` do puli,
   - zwróć **`haslo.Length * Math.Log(pula, 2)`**.

W metodzie `Main()` przygotowaliśmy dwa tryby działania. W przeglądarce uruchamia się automatyczna prezentacja wyników. Po kliknięciu **⬇ Pobierz .exe** i uruchomieniu pliku na Windows 11 otwiera się pełne interaktywne menu z pętlą `do-while`, instrukcją `switch` i `Console.ReadLine()` (a `int.Parse(...)` zamienia wpisany tekst klucza na liczbę całkowitą `int`).

<data-gate>
<data-csharp-lab title="Projekt Modułu 0: CipherForge (Szyfr Cezara + Entropia Hasła)" allow-add-file="false" exe-name="CipherForge.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Globalization;
using System.Text;

public class CipherEngine
{
    public static string SzyfrujCezara(string tekst, int klucz)
    {
        // TODO: Znormalizuj klucz: int przesuniecie = ((klucz % 26) + 26) % 26;
        // Uzyj StringBuilder do przesuniecia liter 'A'-'Z' oraz 'a'-'z', inne znaki przepisz bez zmian
        return "";
    }

    public static double ObliczEntropie(string haslo)
    {
        // TODO: Dla pustego lub null zwroc 0.0
        // Uzyj 4 flag boolowskich: male (+26), wielkie (+26), cyfry (+10), symbole (+10)
        // Zwroc haslo.Length * Math.Log(pula, 2)
        return 0.0;
    }
}

class Program
{
    static void Main()
    {
        if (Console.IsInputRedirected)
        {
            string tekst = "Attack at Dawn 2026!";
            string zaszyfrowany = CipherEngine.SzyfrujCezara(tekst, 3);
            string odszyfrowany = CipherEngine.SzyfrujCezara(zaszyfrowany, -3);
            string haslo = "K0ala!Forge#99";
            double entropia = CipherEngine.ObliczEntropie(haslo);

            Console.WriteLine("=== CIPHERFORGE v1.0 (TRYB DEMO) ===");
            Console.WriteLine("Tekst jawny:  " + tekst);
            Console.WriteLine("Szyfrogram:   " + zaszyfrowany);
            Console.WriteLine("Odszyfrowany: " + odszyfrowany);
            Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "Entropia hasla: {0:F1} bitow", entropia));
            return;
        }

        string wybor;
        do
        {
            Console.WriteLine("\n=== CIPHERFORGE v1.0 ===");
            Console.WriteLine("1. Szyfruj tekst (Cezar)");
            Console.WriteLine("2. Deszyfruj tekst (Cezar)");
            Console.WriteLine("3. Sprawdz entropie hasla");
            Console.WriteLine("0. Wyjdz");
            Console.Write("Wybor: ");
            wybor = Console.ReadLine();

            switch (wybor)
            {
                case "1":
                    Console.Write("Podaj tekst: ");
                    string jawny = Console.ReadLine();
                    Console.Write("Podaj klucz (liczba calkowita): ");
                    int kluczSzyfr = int.Parse(Console.ReadLine());
                    Console.WriteLine("Szyfrogram: " + CipherEngine.SzyfrujCezara(jawny, kluczSzyfr));
                    break;
                case "2":
                    Console.Write("Podaj szyfrogram: ");
                    string tajny = Console.ReadLine();
                    Console.Write("Podaj klucz (liczba calkowita): ");
                    int kluczDeszyfr = int.Parse(Console.ReadLine());
                    Console.WriteLine("Odszyfrowany: " + CipherEngine.SzyfrujCezara(tajny, -kluczDeszyfr));
                    break;
                case "3":
                    Console.Write("Podaj haslo do oceny: ");
                    string haslo = Console.ReadLine();
                    double bity = CipherEngine.ObliczEntropie(haslo);
                    Console.WriteLine(string.Format(CultureInfo.InvariantCulture, "Entropia: {0:F1} bitow", bity));
                    break;
                case "0":
                    Console.WriteLine("Do zobaczenia!");
                    break;
                default:
                    Console.WriteLine("Nieznana opcja. Wybierz 0, 1, 2 lub 3.");
                    break;
            }
        } while (wybor != null && wybor != "0");
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("SzyfrujCezara poprawnie szyfruje z zachowaniem wielkosci liter i znakow specjalnych", () => {
    LabAssert.Equal("Dwwdfn dw Gdzq 2026!", CipherEngine.SzyfrujCezara("Attack at Dawn 2026!", 3));
    LabAssert.Equal("Cde Zab 99!", CipherEngine.SzyfrujCezara("Zab Wxy 99!", 3));
});
LabAssert.Test("SzyfrujCezara obsluguje klucze ujemne (deszyfrowanie) oraz wieksze niz 26", () => {
    LabAssert.Equal("Attack at Dawn 2026!", CipherEngine.SzyfrujCezara("Dwwdfn dw Gdzq 2026!", -3));
    LabAssert.Equal("Dwwdfn dw Gdzq 2026!", CipherEngine.SzyfrujCezara("Attack at Dawn 2026!", 29));
    LabAssert.Equal("Zab Wxy 99!", CipherEngine.SzyfrujCezara("Cde Zab 99!", -29));
    LabAssert.Equal("Bez Zmian!", CipherEngine.SzyfrujCezara("Bez Zmian!", 0));
});
LabAssert.Test("ObliczEntropie poprawnie ocenia puste, slabe, srednie i silne hasla", () => {
    LabAssert.Equal(0.0, CipherEngine.ObliczEntropie(""));
    LabAssert.Equal(0.0, CipherEngine.ObliczEntropie(null));

    double slabe = CipherEngine.ObliczEntropie("123456"); // 6 * log2(10) ~= 19.93
    LabAssert.True(Math.Abs(slabe - 19.93) < 0.05, "Dla '123456' oczekiwano ~19.93 bita, otrzymano: " + slabe);

    double srednie = CipherEngine.ObliczEntropie("Haslo2026"); // 9 * log2(62) ~= 53.59
    LabAssert.True(Math.Abs(srednie - 53.59) < 0.05, "Dla 'Haslo2026' oczekiwano ~53.59 bita, otrzymano: " + srednie);

    double silne = CipherEngine.ObliczEntropie("K0ala!Forge#99"); // 14 * log2(72) ~= 86.38
    LabAssert.True(Math.Abs(silne - 86.38) < 0.05, "Dla 'K0ala!Forge#99' oczekiwano ~86.38 bita, otrzymano: " + silne);
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:
- Typ `string` jest niemutowalny: każda metoda przetwarzająca napis (`Trim`, `ToLower`, `Substring`) zwraca nowy napis, który musisz przypisać do zmiennej.
- Zawsze sprawdzaj pusty lub brakujący tekst metodą `string.IsNullOrEmpty` albo `string.IsNullOrWhiteSpace`, zanim odwołasz się do jego indeksów `0..Length - 1`.
- Do budowania napisów w pętli używaj klasy **`StringBuilder`** (`.Append()` i `.ToString()`) zamiast operatora `+=`, aby uniknąć kopiowania gigabajtów pamięci RAM.
- Normalizacja `((klucz % 26) + 26) % 26` bezpiecznie zamienia dowolny klucz dodatni lub ujemny na przesunięcie w zakresie `0..25`.
