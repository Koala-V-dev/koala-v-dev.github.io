# Projekt FolderTidy - Porządkowacz plików i detektor duplikatów SHA-256

Otwórz swój folder `Downloads` na Windows 11. Po kilku miesiącach normalnej pracy leżą tam setki przypadkowych plików: zrzuty ekranu, faktury PDF, archiwa ZIP, instalatory oraz kopie tego samego dokumentu (`umowa.pdf`, `umowa (1).pdf`, `umowa (2).pdf`).

Jeśli spróbujesz szukać duplikatów po nazwie, przeoczysz identyczne pliki zapisane jako `foto.png` i `wakacje_kopia.png`. Jeśli z kolei porównasz każdy plik z każdym bajt po bajcie, dla 2 000 plików program wykona aż **1 999 000 porównań** i zamrozi dysk na długie minuty.

Rozwiązaniem używanym w profesjonalnych narzędziach dyskowych jest połączenie kryptograficznego odcisku palca _**SHA-256**_ ze słownikiem `Dictionary<K, V>`, strumieniowym odczytem w blokach `using` oraz odporną na błędy pętlą `try / catch`. Te elementy połączysz teraz w gotowy program konsolowy **`FolderTidy.exe`**.

---

## 🧬 Architektura potoku FolderTidy i SHA-256

Kryptograficzna funkcja skrótu **SHA-256** zamienia dowolny plik (niezależnie czy ma 10 bajtów, czy 10 GB) na stały, 64-znakowy ciąg szesnastkowy. Dwa pliki identyczne bajt w bajt dają zawsze ten sam skrót. Zmiana choćby jednego bitu generuje całkowicie inny wynik.

Dzięki temu `FolderTidy` nie porównuje par plików. Zamiast niemal dwóch milionów operacji dla 2 000 plików, program wykonuje dokładnie **2 000 obliczeń skrótu** i **2 000 operacji w słowniku** w pięciu uporządkowanych etapach:

| Etap potoku | Struktura lub mechanizm C# | Zadanie etapu |
| --- | --- | --- |
| 1. Walidacja ścieżki i wejścia | `Directory.Exists` + Guard Clauses | Odrzuca nieistniejące foldery i parametry `null` przed startem pracy |
| 2. Skanowanie katalogu | `Directory.GetFiles` + `try / catch` | Wczytuje ścieżki; pojedynczy zablokowany plik nie przerywa analizy |
| 3. Kategoryzacja i hashowanie | `Path.GetExtension`, `using (SHA256)`, `using (File.OpenRead)` | Rozpoznaje kategorię i strumieniowo wylicza 64-znakowy skrót SHA-256 |
| 4. Grupowanie duplikatów | `Dictionary<string, List<string>>` | Zbiera nazwy plików o identycznym skrócie i filtruje grupy z `Count > 1` |
| 5. Raport i kalkulacja SSD | Arytmetyka `long` i formatowanie konsoli | Wyświetla kategorie, wykryte kopie i dokładną liczbę bajtów do odzyskania |

<data-gate>
<data-sortable-list title="Ułóż pięć etapów potoku przetwarzania FolderTidy we właściwej kolejności wykonania">
  <item data-correct="4">Grupowanie nazw plików o tym samym skrócie w słowniku i wybranie grup z Count > 1</item>
  <item data-correct="1">Walidacja wybranej ścieżki katalogu oraz sprawdzenie argumentów Guard Clauses</item>
  <item data-correct="5">Obliczenie zmarnowanych bajtów jako long i wyświetlenie podsumowania dla użytkownika</item>
  <item data-correct="2">Wczytanie listy plików z dysku w pętli osłoniętej blokami try / catch</item>
  <item data-correct="3">Strumieniowe obliczenie skrótu SHA-256 dla każdego pliku w podwójnym bloku using</item>
</data-sortable-list>
</data-gate>

---

## 🔍 Przypadki brzegowe Path.GetExtension i klocki Program.cs

Silnik `TidyEngine.cs` współpracuje z warstwą wejścia/wyjścia w `Program.cs`. Zanim napiszesz kod silnika, sprawdź dokładnie zachowanie biblioteki standardowej na nietypowych danych.

### 📂 Przypadki brzegowe metody Path.GetExtension

Metoda **`Path.GetExtension(nazwaPliku)`** z przestrzeni `System.IO` wyciąga rozszerzenie z nazwy lub ścieżki. W praktyce zwraca wyniki, które łatwo mogą zaskoczyć:

| Wartość *nazwaPliku* | Wynik `Path.GetExtension` | Dlaczego to ma znaczenie w `KategoryzujPlik`? |
| --- | --- | --- |
| `"tapeta_4k.PNG"` | `".PNG"` | Zawiera kropkę i zachowuje wielkie litery: słownik wymaga `StringComparer.OrdinalIgnoreCase` |
| `"archiwum.tar.gz"` | `".gz"` | Zwraca wyłącznie ostatni segment po ostatniej kropce |
| `"brak_rozszerzenia"` | `""` | Zwraca pusty napis, nie `null`; słownik go nie znajdzie, więc trafi do `"Inne"` |
| `""` lub `"   "` | `""` | Bezpiecznie odrzucone przez `string.IsNullOrWhiteSpace` na wejściu |
| `null` | `null` | Przekazanie `null` do `Dictionary.TryGetValue` rzuciłoby **_`ArgumentNullException`_**, więc Guard Clause jest obowiązkowy |

### 🧱 Cztery klocki warstwy systemowej w Program.cs

Plik `Program.cs` jest gotową otoczką dla systemu Windows 11. Wykorzystuje cztery narzędzia .NET, z którymi będziesz często pracować w aplikacjach narzędziowych:

- **`BitConverter.ToString(hash)`**: zamienia 32-bajtową tablicę zwróconą przez `SHA256` na napis szesnastkowy rozdzielony myślnikami (na przykład `"A1-0F-3C..."`). Wywołanie `.Replace("-", "").ToLowerInvariant()` oczyszcza go do standardowego, 64-znakowego formatu.
- **`Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)`**: pobiera ścieżkę bieżącego konta Windows (na przykład `C:\Users\Jan`) bez wpisywania nazwy użytkownika na sztywno. `Path.Combine` bezpiecznie dokleja do niej `"Downloads"`.
- **`new FileInfo(plik).Length`**: odczytuje rozmiar pliku w bajtach bezpośrednio z metadanych systemu plików jako 64-bitowy **`long`**, dzięki czemu poprawnie obsługuje obrazy ISO i filmy większe niż 2 GB.
- **`Console.IsInputRedirected`**: sprawdza, czy program działa w zautomatyzowanej piaskownicy przeglądarki (wejście przekierowane), czy w prawdziwym oknie terminala na Windows 11. Dzięki temu ten sam kod przechodzi testy w kursie i działa interaktywnie po pobraniu pliku `FolderTidy.exe`.

Kluczowa metoda hashowania w `Program.cs` czyta plik strumieniowo, nie ładując go w całości do pamięci RAM:

```csharp
using System.IO;
using System.Security.Cryptography;

static string ObliczSha256(string sciezka)
{
    using (var sha = SHA256.Create())
    using (var stream = File.OpenRead(sciezka))
    {
        byte[] hash = sha.ComputeHash(stream);
        return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
    }
}
```

> [!IMPORTANT]
> Piętrowy blok `using` zwalnia najpierw uchwyt pliku NTFS (*stream*), a następnie zasoby algorytmu kryptograficznego (*sha*). W pętli skanującej `Program.cs` każde wywołanie `ObliczSha256` jest dodatkowo osłonięte osobnymi blokami `catch` na **_`IOException`_** oraz **_`UnauthorizedAccessException`_**, aby zablokowany plik nie zatrzymał analizy całego dysku.

---

## 🧮 Grupowanie w słowniku i wzór na odzysk miejsca SSD

Dwie pozostałe metody silnika (`ZnajdzDuplikaty` oraz `PoliczZmarnowaneBajty`) operują już wyłącznie na czystych słownikach w pamięci, bez dotykania dysku. Taki podział ułatwia testowanie logiki w izolacji.

### 🗂️ Krok po kroku: budowanie Dictionary<string, List<string>>

Na wejściu otrzymujesz mapę *mapaPlikDoHash*, w której kluczem jest nazwa pliku, a wartością jego skrót SHA-256. Aby odnaleźć duplikaty, musisz **odwrócić tę relację**: skrót staje się kluczem w nowym słowniku pomocniczym, a wartością staje się lista wszystkich plików o tym skrócie.

Prześledź ten algorytm na pięciu krokach:
1. Sprawdź Guard Clause: jeśli *mapaPlikDoHash* ma wartość `null`, rzuć `ArgumentNullException("mapaPlikDoHash")`.
2. Utwórz słownik pomocniczy `Dictionary<string, List<string>>`, który połączy każdy napotkany skrót z listą nazw plików.
3. Dla każdej pary `(klucz, wartosc)` z *mapaPlikDoHash* sprawdź przez `TryGetValue`, czy dla danego skrótu istnieje już lista. Jeśli nie istnieje, utwórz `new List<string>()` i zapisz ją pod tym skrótem.
4. Dopisz nazwę pliku do pobranej lub nowo utworzonej listy.
5. Na końcu przejdź po wszystkich listach w `Values` słownika pomocniczego i dodaj do listy wynikowej wyłącznie te grupy, dla których `grupa.Count > 1`.

### 💾 Wzór na zmarnowane bajty i bezpieczny odczyt TryGetValue

Wszystkie pliki w jednej grupie duplikatów mają identyczny skrót SHA-256, więc mają dokładnie ten sam rozmiar w bajtach. Ponieważ w każdej grupie musisz zachować **1 oryginał**, miejsce możliwe do odzyskania to rozmiar pozostałych `Count - 1` kopii:

$$\text{zmarnowaneBajtyDlaGrupy} = (\text{grupa.Count} - 1) \times \text{rozmiarPliku}$$

Dla przykładu: jeśli w folderze leżą 3 identyczne kopie obrazu filmu po `2 000 000 000` bajtów każda, zostawiasz 1 oryginał i odzyskujesz `(3 - 1) * 2 000 000 000L = 4 000 000 000L` bajtów.

W metodzie `PoliczZmarnowaneBajty` możesz wywołać swoją własną metodę `ZnajdzDuplikaty(mapaPlikDoHash)`, aby nie powielać logiki grupowania. Następnie dla każdej wykrytej grupy odczytaj rozmiar pliku z *mapaPlikDoRozmiaru* za pomocą **`TryGetValue`**.

> [!WARNING]
> Unikaj dwóch pułapek w `PoliczZmarnowaneBajty`:
> 1. Zawsze sumuj bajty w zmiennej typu `long` (zamiast `int`), ponieważ już 2,15 GB duplikatów spowoduje **_przepełnienie typu `int`_**.
> 2. Nie odczytuj rozmiaru przez indeksator `mapaPlikDoRozmiaru[nazwa]`. Jeśli dla któregoś pliku zabraknie wpisu w mapie rozmiarów, indeksator rzuci **_`KeyNotFoundException`_**. Bezpieczny `TryGetValue` pozwala pominąć brakujący wpis bez przerywania kalkulacji.

<data-gate>
<data-connection-matcher title="Dopasuj problem z prawdziwego systemu Windows 11 do właściwego mechanizmu w FolderTidy">
  <item left="Przeglądarka trzyma wyłączną blokadę NTFS na pobieranym pliku .crdownload" right="Przechwycenie IOException w pętli skanowania i zwiększenie licznika pominiętych"></item>
  <item left="Użytkownik ma w Downloads obraz ISO systemu o rozmiarze 4,7 GB" right="Strumieniowe czytanie przez File.OpenRead z buforem 4 KB zamiast File.ReadAllBytes"></item>
  <item left="Plik systemowy lub folder innego konta zwraca kod odmowy dostępu (ERROR_ACCESS_DENIED)" right="Przechwycenie UnauthorizedAccessException bez przerywania skanowania reszty katalogu"></item>
  <item left="Trzeba zwolnić zarówno uchwyt pliku w jądrze Windows, jak i zasoby algorytmu SHA-256" right="Piętrowy blok using (SHA256) oraz using (File.OpenRead) z gwarantowanym Dispose()"></item>
</data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Efekt lawinowy SHA-256, paradoks urodzin (2^128), limit LOH 2 GB w CLR i blokady NTFS</span>
<span class="deep-dive-badge">KRYPTOGRAFIA · PAMIĘĆ CLR · NTFS</span>
</summary>
<div class="deep-dive-content">

<h4>1. Efekt lawinowy (Avalanche Effect) w algorytmie SHA-256</h4>
Algorytm SHA-256 dzieli dane wejściowe na bloki po 512 bitów (64 bajty) i przepuszcza każdy blok przez 64 rundy operacji bitowych (rotacje, przesunięcia, XOR, dodawanie modulo $2^{32}$) z użyciem stałych wyprowadzonych z ułamkowych części pierwiastków kwadratowych i sześciennych pierwszych 64 liczb pierwszych.

Dzięki temu zmiana **jednego jedynego bitu** w pliku o rozmiarze 1 GB powoduje kaskadową zmianę średnio **50% bitów** w wynikowym 256-bitowym skrócie. Dwa niemal identyczne pliki dają skróty wyglądające jak całkowicie niezależny szum losowy.

<h4>2. Paradoks urodzin: dlaczego granica kolizji to 2^128, a nie 2^256?</h4>
Dla 256-bitowego skrótu istnieje $2^{256}$ możliwych wartości. Mogłoby się wydawać, że aby trafić na dwa różne pliki o tym samym skrócie (kolizję), trzeba przetestować około $2^{255}$ plików. W rzeczywistości działa tu **paradoks urodzin**: gdy szukasz dowolnej pary kolizyjnej (a nie kolizji z konkretnym plikiem), liczba par rośnie kwadratowo wraz z liczbą plików.

W grupie zaledwie **23 osób** szansa, że dwie mają urodziny tego samego dnia roku (365 dni), przekracza 50%, ponieważ $\sqrt{365} \approx 19$. Analogicznie dla SHA-256 próg 50% szansy na przypadkową kolizję wynosi w przybliżeniu $\sqrt{2^{256}} = 2^{128} \approx 3,4 \cdot 10^{38}$ plików. Gdyby każdy z 8 miliardów ludzi na Ziemi generował miliard plików na sekundę przez 13,8 miliarda lat (wiek Wszechświata), łączna liczba plików wyniosłaby zaledwie około $3,5 \cdot 10^{36}$, czyli wciąż 100 razy za mało, by zbliżyć się do progu kolizji.

<h4>3. Dlaczego File.ReadAllBytes na pliku 4 GB kończy się OutOfMemoryException?</h4>
Próba policzenia skrótu przez `sha.ComputeHash(File.ReadAllBytes("obraz_4gb.iso"))` zawiedzie natychmiast, nawet jeśli Twój komputer ma 32 GB pamięci RAM:
- W .NET każdy obiekt o rozmiarze co najmniej **85 000 bajtów** trafia na osobną stertę **LOH** (Large Object Heap), której Garbage Collector domyślnie nie przesuwa. Częste alokowanie wielomegabajtowych tablic powoduje silną fragmentację pamięci RAM.
- Jeszcze ważniejsze jest twarde ograniczenie architektury CLR: pojedyncza tablica `byte[]` nie może przekroczyć około **2 GB** (`int.MaxValue` indeksów, dokładny limit wynosi około `2 147 483 591` bajtów), nawet na 64-bitowym systemie Windows 11.

Porównanie zużycia pamięci przy hashowaniu pliku obrazu ISO o rozmiarze 4 GB:

| Podejście w C# | Rozmiar bufora w RAM | Liczba porcji odczytu | Zachowanie dla pliku 4 GB |
| --- | --- | --- | --- |
| `File.ReadAllBytes(sciezka)` | 4 294 967 296 B (4 GB) | 1 | Natychmiastowy **_`OutOfMemoryException`_** |
| `using (File.OpenRead(sciezka))` | 4 096 B (4 KB) | 1 048 576 | Działa płynnie, zużywa poniżej 1 MB RAM |

Wewnątrz `sha.ComputeHash(stream)` środowisko .NET utrzymuje jeden niewielki bufor (4 096 lub 8 192 bajtów) i w pętli przekazuje kolejne bloki do funkcji kompresji SHA-256:
```csharp
// Uproszczony schemat tego, co ComputeHash(Stream) robi pod spodem:
byte[] bufor = new byte[4096];
int przeczytano;
while ((przeczytano = stream.Read(bufor, 0, bufor.Length)) > 0)
{
    sha.TransformBlock(bufor, 0, przeczytano, null, 0);
}
sha.TransformFinalBlock(bufor, 0, 0);
```

<h4>4. Blokady plików NTFS i flagi FileShare w jądrze Windows</h4>
W systemie plików NTFS jądro Windows kontroluje współbieżny dostęp do każdego pliku za pomocą maski uprawnień współdzielenia (`FileShare.None`, `FileShare.Read`, `FileShare.ReadWrite`). Gdy przeglądarka w folderze `Downloads` właśnie zapisuje pobierany plik `.crdownload` albo antywirus otworzył instalator z wyłączną blokadą (`FileShare.None`), wywołanie `File.OpenRead` dostaje z jądra Windows kod błędu Win32 `ERROR_SHARING_VIOLATION` (kod 32), który CLR zamienia na **_`IOException`_**.

Podobnie pliki systemowe lub należące do innego konta zwracają `ERROR_ACCESS_DENIED` (kod 5), czyli **_`UnauthorizedAccessException`_**. Dlatego pętla skanująca w `Program.cs` osłania pojedynczy plik blokiem `try / catch`, zliczając pominięte pozycje zamiast przerywać analizę całego dysku.

</div>
</details>

---

## 💻 Projekt Modułu 2: Zbuduj i pobierz FolderTidy (2 pliki)

Przełącz zakładkę edytora na **`TidyEngine.cs`** i uzupełnij trzy metody silnika:

1. **`KategoryzujPlik(string nazwaPliku)`**:
   - dla `null` lub pustej/białej nazwy zwróć `"Inne"`,
   - wyciągnij rozszerzenie przez `Path.GetExtension(nazwaPliku)`,
   - zmapuj je przez `Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)`:
     - `.png`, `.jpg`, `.webp` -> `"Obrazy"`,
     - `.pdf`, `.docx`, `.txt` -> `"Dokumenty"`,
     - `.zip`, `.7z`, `.rar` -> `"Archiwa"`,
     - `.exe`, `.msi` -> `"Instalatory"`,
     - wszystko inne -> `"Inne"`.
2. **`ZnajdzDuplikaty(Dictionary<string, string> mapaPlikDoHash)`**:
   - jeśli `mapaPlikDoHash == null`, rzuć `ArgumentNullException("mapaPlikDoHash")`,
   - pogrupuj nazwy plików o identycznym skrócie w `Dictionary<string, List<string>>`,
   - zwróć `List<List<string>>` zawierającą **wyłącznie grupy mające więcej niż 1 plik** (`grupa.Count > 1`).
3. **`PoliczZmarnowaneBajty(Dictionary<string, string> mapaPlikDoHash, Dictionary<string, long> mapaPlikDoRozmiaru)`**:
   - jeśli którykolwiek z parametrów jest `null`, rzuć `ArgumentNullException`,
   - oblicz łączną liczbę bajtów, które można odzyskać na dysku SSD, zostawiając **1 oryginał** z każdej grupy duplikatów i sumując rozmiar pozostałych kopii (`(grupa.Count - 1) * rozmiar`),
   - rozmiar pliku pobieraj bezpiecznie przez **`TryGetValue`** (jeśli brakuje wpisu w *mapaPlikDoRozmiaru*, nie rzucaj `KeyNotFoundException`, tylko pomiń taki plik i nie doliczaj go do sumy),
   - zwróć wynik jako `long`.

Po zaliczeniu wszystkich testów kliknij przycisk pobierania pliku wykonywalnego. Uruchomiony na Windows 11 **`FolderTidy.exe`** pozwoli Ci nacisnąć Enter dla domyślnego folderu `Downloads` albo wpisać własną ścieżkę, przeskanuje pliki w trybie tylko do odczytu (niczego nie usuwa!) i poczeka na naciśnięcie Enter przed zamknięciem okna.

<data-gate>
<data-csharp-lab title="Projekt Modułu 2: FolderTidy (SHA-256 + Kategoryzator + Kalkulator odzysku SSD)" exe-name="FolderTidy.exe">
<cs-file name="Program.cs">

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;

class Program
{
    static string ObliczSha256(string sciezka)
    {
        using (var sha = SHA256.Create())
        using (var stream = File.OpenRead(sciezka))
        {
            byte[] hash = sha.ComputeHash(stream);
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
        }
    }

    static void PrzeskanujKatalog(string katalog)
    {
        Console.WriteLine("\nSkanowany katalog: " + katalog);

        var hashe = new Dictionary<string, string>();
        var rozmiary = new Dictionary<string, long>();
        var licznikKat = new Dictionary<string, int>();
        int pominiete = 0;

        string[] pliki;
        try
        {
            pliki = Directory.GetFiles(katalog);
        }
        catch (IOException ex)
        {
            Console.WriteLine("Blad odczytu katalogu: " + ex.Message);
            return;
        }
        catch (UnauthorizedAccessException)
        {
            Console.WriteLine("Brak uprawnien do odczytu katalogu: " + katalog);
            return;
        }

        foreach (string plik in pliki)
        {
            try
            {
                string nazwa = Path.GetFileName(plik);
                string kat = TidyEngine.KategoryzujPlik(nazwa);
                int ile;
                licznikKat.TryGetValue(kat, out ile);
                licznikKat[kat] = ile + 1;

                hashe[nazwa] = ObliczSha256(plik);
                rozmiary[nazwa] = new FileInfo(plik).Length;
            }
            catch (IOException)
            {
                pominiete++;
            }
            catch (UnauthorizedAccessException)
            {
                pominiete++;
            }
        }

        Console.WriteLine("\nPodsumowanie kategorii:");
        foreach (var para in licznikKat)
            Console.WriteLine("  - {0,-14}: {1} plikow", para.Key, para.Value);

        var grupy = TidyEngine.ZnajdzDuplikaty(hashe);
        long doOdzyskania = TidyEngine.PoliczZmarnowaneBajty(hashe, rozmiary);
        double doOdzyskaniaMb = doOdzyskania / (1024.0 * 1024.0);

        Console.WriteLine("\nWykryte grupy duplikatow SHA-256: " + grupy.Count + " (pominieto zablokowanych: " + pominiete + ")");
        Console.WriteLine(string.Format("Miejsce do odzyskania na SSD: {0} B ({1:F2} MB)", doOdzyskania, doOdzyskaniaMb));
        foreach (var g in grupy)
            Console.WriteLine("  [DUPLIKAT] " + string.Join(" == ", g));
    }

    static void Main()
    {
        Console.WriteLine("=== FOLDERTIDY v1.2 (Skaner kategorii i duplikatow SHA-256) ===");

        if (Console.IsInputRedirected)
        {
            var demoHash = new Dictionary<string, string>
            {
                { "foto.png", "aaa111" },
                { "foto (1).png", "aaa111" },
                { "notatki.pdf", "bbb222" }
            };
            var demoRozmiar = new Dictionary<string, long>
            {
                { "foto.png", 2500000L },
                { "foto (1).png", 2500000L },
                { "notatki.pdf", 420000L }
            };
            var dups = TidyEngine.ZnajdzDuplikaty(demoHash);
            long zmarnowane = TidyEngine.PoliczZmarnowaneBajty(demoHash, demoRozmiar);
            Console.WriteLine("Wykryte grupy duplikatow (demo): " + dups.Count);
            Console.WriteLine("Kategoria foto.png: " + TidyEngine.KategoryzujPlik("foto.png"));
            Console.WriteLine("Zmarnowane bajty (demo): " + zmarnowane);
            Console.WriteLine("Pobierz FolderTidy.exe, aby przeskanowac swoj folder Downloads na Windows 11!");
            return;
        }

        string domyslny = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
        if (!Directory.Exists(domyslny))
            domyslny = Directory.GetCurrentDirectory();

        while (true)
        {
            Console.WriteLine("\nDomyslny katalog: " + domyslny);
            Console.Write("Wpisz sciezke katalogu lub nacisnij Enter dla domyslnego: ");
            string wpis = Console.ReadLine();
            string katalog = string.IsNullOrWhiteSpace(wpis) ? domyslny : wpis.Trim().Trim('"');

            if (!Directory.Exists(katalog))
            {
                Console.WriteLine("Podany katalog nie istnieje: " + katalog);
                continue;
            }

            PrzeskanujKatalog(katalog);

            Console.Write("\nCzy chcesz przeskanowac inny katalog? (t/n): ");
            string decyzja = Console.ReadLine();
            if (decyzja == null || !decyzja.Trim().Equals("t", StringComparison.OrdinalIgnoreCase))
                break;
        }

        Console.WriteLine("\nNacisnij Enter, aby zakonczyc...");
        Console.ReadLine();
    }
}
```

</cs-file>
<cs-file name="TidyEngine.cs">

```csharp
using System;
using System.Collections.Generic;
using System.IO;

public static class TidyEngine
{
    public static string KategoryzujPlik(string nazwaPliku)
    {
        // Guard Clause dla null/bialych znakow, Path.GetExtension i slownik z OrdinalIgnoreCase
        return "Inne";
    }

    public static List<List<string>> ZnajdzDuplikaty(Dictionary<string, string> mapaPlikDoHash)
    {
        // Guard Clause dla null
        // Pogrupuj pliki po wartosci hash w Dictionary<string, List<string>>
        // i zwroc wylacznie grupy z Count > 1
        return new List<List<string>>();
    }

    public static long PoliczZmarnowaneBajty(
        Dictionary<string, string> mapaPlikDoHash,
        Dictionary<string, long> mapaPlikDoRozmiaru)
    {
        // Guard Clause dla null (oba parametry)
        // Uzyj bezpiecznego TryGetValue dla mapaPlikDoRozmiaru (bez KeyNotFoundException)
        // Zostaw 1 oryginal z kazdej grupy duplikatow i zsumuj rozmiar pozostalych kopii (long)
        return 0L;
    }
}
```

</cs-file>
<cs-tests>

```csharp
LabAssert.Test("KategoryzujPlik rozpoznaje rozszerzenia oraz obsluguje null, tar.gz i brak rozszerzenia", () => {
    LabAssert.Equal("Obrazy", TidyEngine.KategoryzujPlik("tapeta_4k.PNG"));
    LabAssert.Equal("Dokumenty", TidyEngine.KategoryzujPlik("zadanie.pdf"));
    LabAssert.Equal("Archiwa", TidyEngine.KategoryzujPlik("backup.7z"));
    LabAssert.Equal("Instalatory", TidyEngine.KategoryzujPlik("installer.EXE"));
    LabAssert.Equal("Inne", TidyEngine.KategoryzujPlik("archiwum.tar.gz"));
    LabAssert.Equal("Inne", TidyEngine.KategoryzujPlik("plik_bez_rozszerzenia"));
    LabAssert.Equal("Inne", TidyEngine.KategoryzujPlik(null));
    LabAssert.Equal("Inne", TidyEngine.KategoryzujPlik("   "));
});
LabAssert.Test("ZnajdzDuplikaty grupuje wylacznie duplikaty (Count > 1) i waliduje null", () => {
    LabAssert.Throws<ArgumentNullException>(() => TidyEngine.ZnajdzDuplikaty(null));
    LabAssert.Equal(0, TidyEngine.ZnajdzDuplikaty(new Dictionary<string, string>()).Count);

    var mapa = new Dictionary<string, string> {
        { "a.png", "hash1" },
        { "kopia_a.png", "hash1" },
        { "b.pdf", "hash2" },
        { "c.zip", "hash3" },
        { "c_old.zip", "hash3" },
        { "c_copy.zip", "hash3" }
    };
    var grupy = TidyEngine.ZnajdzDuplikaty(mapa);
    LabAssert.Equal(2, grupy.Count);
    int laczniePlikow = grupy[0].Count + grupy[1].Count;
    LabAssert.Equal(5, laczniePlikow);
});
LabAssert.Test("PoliczZmarnowaneBajty zostawia 1 oryginal na grupe i liczy jako long bez przepelnienia", () => {
    LabAssert.Throws<ArgumentNullException>(() => TidyEngine.PoliczZmarnowaneBajty(null, new Dictionary<string, long>()));
    LabAssert.Throws<ArgumentNullException>(() => TidyEngine.PoliczZmarnowaneBajty(new Dictionary<string, string>(), null));

    var mapaHash = new Dictionary<string, string> {
        { "film.mkv", "h_film" },
        { "film (1).mkv", "h_film" },
        { "film (2).mkv", "h_film" },
        { "raport.pdf", "h_pdf" },
        { "foto.png", "h_foto" },
        { "foto_kopia.png", "h_foto" }
    };
    var mapaRozmiar = new Dictionary<string, long> {
        { "film.mkv", 2000000000L },
        { "film (1).mkv", 2000000000L },
        { "film (2).mkv", 2000000000L },
        { "raport.pdf", 500000L },
        { "foto.png", 1500000L },
        { "foto_kopia.png", 1500000L }
    };
    // 2 kopie filmu (4 000 000 000 B) + 1 kopia foto (1 500 000 B) + 0 dla unikalnego raport.pdf
    LabAssert.Equal(4001500000L, TidyEngine.PoliczZmarnowaneBajty(mapaHash, mapaRozmiar));
});
LabAssert.Test("PoliczZmarnowaneBajty obsluguje brakujacy wpis w mapaPlikDoRozmiaru przez TryGetValue i brak duplikatow", () => {
    var mapaHash = new Dictionary<string, string> {
        { "brak1.bin", "h_brak" },
        { "brak2.bin", "h_brak" },
        { "foto.png", "h_foto" },
        { "foto_kopia.png", "h_foto" }
    };
    var mapaRozmiar = new Dictionary<string, long> {
        { "foto.png", 1000L },
        { "foto_kopia.png", 1000L }
    };
    LabAssert.Equal(1000L, TidyEngine.PoliczZmarnowaneBajty(mapaHash, mapaRozmiar));

    var unikalneHash = new Dictionary<string, string> {
        { "a.txt", "h1" },
        { "b.txt", "h2" }
    };
    var unikalneRozmiar = new Dictionary<string, long> {
        { "a.txt", 1000L },
        { "b.txt", 2000L }
    };
    LabAssert.Equal(0L, TidyEngine.PoliczZmarnowaneBajty(unikalneHash, unikalneRozmiar));
});
```

</cs-tests>
</data-csharp-lab>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Gdy musisz wykrywać duplikaty wśród setek lub tysięcy plików, zamień porównywanie par na jeden przebieg z **SHA-256** i grupowanie w **`Dictionary<string, List<string>>`**.
- Gdy przetwarzasz pliki o nieznanym rozmiarze, zawsze czytaj je strumieniowo przez **`using (var stream = File.OpenRead(sciezka))`** zamiast `File.ReadAllBytes`, aby uniknąć limitu 2 GB w pamięci CLR i zwalniać uchwyty NTFS.
- Gdy pobierasz rozszerzenie przez `Path.GetExtension`, pamiętaj o `null`, pustym napisie i wielkości liter (`StringComparer.OrdinalIgnoreCase`), a przy odczycie rozmiarów z mapy stosuj **`TryGetValue`** oraz typ **`long`** zamiast `int`.
- Gdy tworzysz samodzielny program `.exe` dla Windows, osłaniaj operacje dyskowe blokami `catch (IOException)` oraz `catch (UnauthorizedAccessException)` i zapewnij użytkownikowi interaktywny wybór ścieżki z zatrzymaniem okna na końcu.
