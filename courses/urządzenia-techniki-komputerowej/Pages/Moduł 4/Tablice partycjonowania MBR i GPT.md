# Tablice partycjonowania MBR i GPT

Nowy dysk 3 TB jest widoczny, ale w starym układzie MBR z blokami 512 B nie możesz użyć całej przestrzeni. Która warstwa narzuca to ograniczenie?

## 🗺️ Od dysku do woluminu

Tablica partycji opisuje zakresy bloków na dysku. **Partycja** to jeden z takich zakresów. **Wolumin** to logiczna przestrzeń udostępniona systemowi, często oparta na jednej partycji. Formatowanie tworzy system plików w woluminie. Litera dysku Windows jest punktem dostępu do woluminu. Każdy z tych elementów możesz sprawdzić osobno.

MBR ma cztery główne wpisy. Jeden może wskazywać partycję rozszerzoną z partycjami logicznymi. Przy 32 bitach adresu i bloku 512 B klasyczna granica adresowania to około 2 TiB. GPT używa 64-bitowych adresów LBA oraz głównych i zapasowych struktur z sumami kontrolnymi. W typowej nowej instalacji Windows uruchamianej w trybie UEFI wybiera się GPT.

Wyobraź sobie pusty dysk wirtualny. Po utworzeniu GPT i partycji zakres bloków jest już zapisany w tablicy. Dopiero utworzenie systemu plików i przypisanie punktu dostępu daje wygodne miejsce do zapisu pliku.

## 🧪 Samodzielna próba

Dysk z dokumentami nagle zgłasza nieprzydzielone miejsce. Drugi, fabrycznie pusty dysk, wygląda tak samo. Rozdziel bezpieczny następny krok dla każdego.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Na dysku z danymi wstrzymaj zapisy. Sprawdź identyfikator, stan nośnika i kopię danych. Przy ważnych danych pracuj na kopii sektorowej lub skorzystaj z odzyskiwania. Fabrycznie pusty, potwierdzony nośnik można zainicjalizować i przygotować do zapisu.

</details>

## 🔍 Prześledź partycję od litery dysku do pierwszego bloku

W Windows otwórz **Zarządzanie dyskami** i znajdź wolumin testowy, którego literę znasz. Zanotuj numer fizycznego dysku z dolnego panelu. Na jednym dysku możesz zobaczyć też partycje bez litery. W typowej instalacji UEFI jedna z nich przechowuje pliki startowe, a inna środowisko odzyskiwania.

W PowerShell wpisz numer tego samego dysku zamiast przykładowego **1**. Polecenia tylko odczytują dane. Jeśli system odmawia dostępu, uruchom PowerShell jako administrator na stanowisku, na którym masz takie uprawnienia. [Get-Disk](https://learn.microsoft.com/powershell/module/storage/get-disk) · [Get-Partition](https://learn.microsoft.com/powershell/module/storage/get-partition).

```powershell
$nrDysku = 1
Get-Disk -Number $nrDysku | Select-Object Number, PartitionStyle, LogicalSectorSize
Get-Partition -DiskNumber $nrDysku | Select-Object PartitionNumber, DriveLetter, Offset, Size
```

Znajdź w wynikach literę woluminu testowego. **Offset** podaje położenie początku partycji w bajtach od początku dysku. Podziel tę wartość przez **LogicalSectorSize**, żeby dostać pierwszy LBA partycji. Na przykład przy przesunięciu **1 048 576 B** i blokach **512 B** wynikiem jest **LBA 2048**. Ten sam sposób przeliczania zastosujesz niżej, szukając nagłówków GPT w obrazie sektorowym. Gdy potrzebujesz pustego dysku do samodzielnego założenia partycji, przejdź do [laboratorium zarządzania dyskami w Windows 11](/courses/windows-11/Pages/Moduł%202/Zarządzanie%20dyskami%20i%20partycjami.html).

## 🛠️ Odzyskaj tablicę partycji na kopii obrazu

Na stanowisku jest kopia obrazu dysku archiwum. Po awarii system utracił dostęp do partycji. W GPT **główny nagłówek** znajduje się w LBA 1, a **zapasowy** w ostatnim bloku. Każdy wskazuje własną tablicę wpisów. Poprawne CRC nagłówka pozwala odczytać jego pola. Żeby zaufać samym wpisom, sprawdź także CRC tablicy.

Porównaj zapisane i obliczone CRC obu tablic. Edytor pokazuje po osiem bajtów początku i końca tej samej partycji w obu kopiach. Znajdź zmieniony bajt. Wpisz właściwą wartość albo przeciągnij ją z kopii zapasowej do odpowiedniego pola. Zapisz sektor i sprawdź, czy z partycji da się odczytać **RAPORT.TXT**.

<data-gate>
  <data-gpt-recovery></data-gpt-recovery>
</data-gate>

Edytor zapisuje podane bajty w obrazie i porównuje CRC z wartością zapisaną wcześniej w nagłówku. Otwierając raport, przechodzi od GPT przez katalog FAT12 do klastra pliku. Możesz pobrać obraz przed zmianą i po niej, a potem porównać je w edytorze szesnastkowym. W rzeczywistej naprawie pracuj na kopii sektorowej i zweryfikuj więcej niż jeden plik.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Czytanie little-endian z obrazu</span> <span class="deep-dive-badge">FORMAT GPT</span></summary>
<div class="deep-dive-content">

Nagłówek podstawowy GPT zaczyna się w LBA 1, a jego sygnatura to bajty ASCII `EFI PART`. Przy bloku 512 B szukasz ich od przesunięcia 512. Przy 4096 B od 4096. W czterobajtowym polu little-endian ciąg `00 08 00 00` oznacza 2048, bo drugi bajt ma wagę 256. Sygnatura jest wskazówką, a poprawność struktur sprawdzasz też przez CRC32, sumę kontrolną obliczaną z bajtów. [Układ GPT w specyfikacji UEFI](https://uefi.org/specs/UEFI/2.10/05_GUID_Partition_Table_Format.html).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przed operacją rozpoznaj fizyczny dysk, układ partycji, wolumin i stan danych.

