# Eksplorator Plików Windows 11

Eksplorator plików to Twoja **baza operacyjna** w systemie. 

Uruchamiasz go skrótem <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>E</kbd></span> i w ułamku sekundy zyskujesz dostęp do każdego dysku, pliku i folderu. To podstawowe narzędzie dla Ciebie jako technika.

---

## 🧭 Anatomia Eksploratora

Eksplorator plików dzieli się na logiczne obszary z dedykowanymi funkcjami:

<data-gate>
  <data-hotspot image="/courses/windows-11/Images/eksplorator-pliku-anatomia.png">
    <hotspot x="10" y="45" title="Panel boczny (lewy)">Drzewo nawigacji. Zapewnia szybki dostęp do ulubionych folderów, dysków lokalnych, podłączonych nośników USB i zasobów sieciowych.</hotspot>
    <hotspot x="73" y="8" title="Pasek adresu">Pokazuje aktualną ścieżkę. Klikając na nazwę katalogu, przeniesiesz się do niego, a klikając w wolną przestrzeń na końcu, zmienisz tryb na pole tekstowe (możesz edytować ścieżkę).</hotspot>
    <hotspot x="50" y="15" title="Menu wyświetlania">Tu zmienisz sposób prezentacji plików. Możesz np. włączyć wyświetlanie rozszerzeń plików (jak `.txt` czy `.exe`) oraz podejrzeć ukryte elementy.</hotspot>
    <hotspot x="15" y="15" title="Pasek wstążki (górny)">Narzędzia kontekstowe. Zmieniają się dynamicznie w zależności od tego, czy pracujesz z dokumentem, zdjęciem, archiwum ZIP czy jesteś właśnie na świeżej płycie CD/DVD (wtedy pojawia się narzędzie do nagrywania).</hotspot>
    <hotspot x="60" y="55" title="Obszar główny">Serce aplikacji. Wyświetla listę plików w aktualnie otwartym katalogu.</hotspot>
    <hotspot x="30" y="98" title="Pasek stanu (dolny)">Podsumowanie. Wyświetla całkowitą liczbę elementów w folderze oraz rozmiar aktualnie zaznaczonych plików.</hotspot>
    <hotspot x="90" y="18" title="Szczegóły wybranego elementu">Dostarcza danych o zaznaczonym pliku lub folderze - rozmiarze, dacie utworzenia i typie elementu.</hotspot>
  </data-hotspot>
</data-gate>

> [!TIP]
> **Hack Power-Usera:** Kliknij w **pasek adresu** (zmieni się w edytowalne pole tekstowe) i wpisz w nim słowo `cmd` lub `powershell`. Po wciśnięciu <kbd>Enter</kbd> otworzysz konsolę z lokalizacją folderu, w którym właśnie jesteś! 
> Oszczędność czasu. 🤯

---

## 📂 Kluczowe Ścieżki Systemowe

Poniższe lokalizacje to techniczne fundamenty Windowsa:

<data-tabs>
    <tabs>
        <b>🖥️ Pliki Systemowe</b>
        <b>📟 Dane Aplikacji</b>
        <b>👤 Profile Użytkownika</b>
    </tabs>
<div>

| Ścieżka | Co tu znajdziesz? |
| :--- | :--- |
| `C:\Windows` | Główne zasoby operacyjne systemu |
| `C:\Windows\System32` | Fundamentalne pliki binarne, biblioteki DLL i narzędzia CLI dla środowiska $64$-bitowego |
| `C:\Windows\SysWOW64` | Biblioteki $32$-bitowe utrzymywane dla kompatybilności wstecznej w systemach $64$-bitowych |
| `C:\Windows\Temp` | Miejsce dla plików tymczasowych procesów i instalatorów o zasięgu globalnym |

> [!CAUTION]
> Absolutnie niczego nie kasuj ręcznie w `C:\Windows\System32`. Usunięcie zaledwie jednego, krytycznego pliku systemowego potrafi bezpowrotnie odebrać Tobie możliwość korzystania z środowiska. 
> **PS. Dopiero w Windows 11 usunięcie tego katalogu zostało zablokowane.** 😅

</div>
<div>

| Ścieżka | Co tu znajdziesz? |
| :--- | :--- |
| `C:\Program Files` | Oprogramowanie zainstalowane w nowszej architekturze $64$-bitowej |
| `C:\Program Files (x86)` | Instalacje starszego oprogramowania $32$-bitowego |
| `C:\ProgramData` | **(Ukryty!)** Cache i ustawienia globalne współdzielone przez wszystkie konta użytkowników |
| `%TEMP%` | Zmienna środowiskowa przypisana do osobistego folderu `Temp` dla aktualnie zalogowanego konta |

> [!TIP]
> Zamiast przebijać się przez drzewo dysku i ukryty folder AppData, wpisz po prostu **`%TEMP%`** w pasku adresu i wciśnij Enter. Eksplorator automatycznie rozwiąże tę zmienną środowiskową i otworzy profilowy folder z plikami tymczasowymi. To pierwsze miejsce, do którego zaglądasz przy ręcznym sprzątaniu cache'u i śmieci pozostawionych przez crashe niedomkniętych aplikacji.

> [!IMPORTANT]
> Folder `AppData` jest **domyślnie niewidoczny**. 
> Aby go włączyć: w menu **Wyświetl** → **Pokaż** → **Ukryte elementy**.

</div>
<div>

| Ścieżka | Co tu znajdziesz? |
| :--- | :--- |
| `C:\Users\` | Główny kontener przechowujący foldery przypisane do każdego utworzonego konta użytkownika |
| `C:\Users\[nazwa]\Desktop` | Pliki z pulpitu konkretnego profilu |
| `C:\Users\[nazwa]\Documents` | Domyślne miejsce dla dokumentów tekstowych i zapisów |
| `C:\Users\[nazwa]\Downloads` | Domyślny folder dla plików ściągniętych z przeglądarki internetowej |
| `C:\Users\[nazwa]\AppData` | **(Ukryty!)** Indywidualne ustawienia oprogramowania i cache dla tego profilu |

> [!IMPORTANT]
> Folder `AppData` jest **domyślnie niewidoczny**. 
> Aby go włączyć: w menu **Wyświetl** → **Pokaż** → **Ukryte elementy**.

</div>
</data-tabs>

---

## 🔗 Skróty klawiszowe Eksploratora

Ogranicz klikanie myszką. Administratorzy w środowisku graficznym najszybciej operują przy użyciu kombinacji klawiszowych.

Oto $8$ kolejnych, absolutnych fundamentów Twojego warsztatu:

| Skrót | Działanie w Eksploratorze |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd> | Klasyczne skróty „Wróć” i „Dalej” poruszające się w historii odwiedzonych podfolderów |
| <kbd>Alt</kbd> + <kbd>↑</kbd> | Wejście jeden szczebel wyżej w drzewie głównym katalogów dyskowych |
| <kbd>F2</kbd> | Natychmiastowa aktywacja trybu edycji nazwy zaznaczonego obiektu |
| <kbd>F5</kbd> | Wymuszenie odświeżenia zawartości folderu |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd></span> | Błyskawiczne utworzenie nowego folderu bez klikania w prawy przycisk myszy |
| <kbd>Ctrl</kbd> + <kbd>W</kbd> | Zamknięcie aktualnie wybranej karty / okna |
| <kbd>Delete</kbd> | Przeniesienie plików do systemowego wirtualnego śmietnika (Kosz) przed ich bezpiecznym skasowaniem |
| <kbd>Shift</kbd> + <kbd>Delete</kbd> | **Bezpowrotne usunięcie plików z dysku** omijające zupełnie system Kosza |

> [!WARNING]
> Uważaj. Klawisz skrótowy <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>Delete</kbd></span> jest bezwzględny. Ominięcie ratunkowego mechanizmu wirtualnego Kosza z reguły eliminuje plik bezpowrotnie. 

---

## 👁️ Sztuka analizy widoków

Sposób prezentacji zawartości przyspiesza skanowanie dziesiątek plików przy diagnostyce. Prawy przycisk myszy w pustej przestrzeni i z menu podręcznego wybierz **Widok**:

| Typ widoku | Praktyczne zastosowanie |
| :--- | :--- |
| **Szczegóły** | Widok tabelaryczny. Umożliwia kliknięcie w nagłówek kolumny, aby natychmiast posortować setki plików według daty modyfikacji, rozmiaru lub rozszerzenia. |
| **Lista** | Zagęszcza układ do samych nazw bez zbędnych detali. |
| **Duże ikony** | Generuje miniatury zawartości. Przydatne w pracy ze grafiką i wideo bez konieczności ich otwierania. |
| **Kafelki** | Zwykła miniatura połączona z podstawowymi metadanymi pliku (nazwa, rozmiar). |

---

## 🔍 Wyszukiwanie w Eksploratorze

Pasek wyszukiwania (w górnym prawym rogu okna) obsługuje tak zwane **filtry techniczne**. Zamiast wpisywać część nazwy pliku, możesz przefiltrować wyniki mechanicznie na znacznie wyższym poziomie zarządzania:

| Filtr | Działanie |
| :--- | :--- |
| `*.pdf` | Pokaże wszystkie pliki z rozszerzeniem `.pdf` w danym folderze |
| `*.log datemodified:>2024` | Przefiltruje pliki z rozszerzeniem logu do tych z $2024$ lub nowszych |
| `size:>100mb` | Zwróci same pliki o wadze przekraczającej $100 \text{ MB}$ przestrzeni dyskowej |
| `kind:picture` | Przefiltruje surowce i skupi się na grafice cyfrowej |

> [!TIP]
> Do natychmiastowego technicznego wyszukiwania ogromnych ilości informacji rozrzuconych na całym dysku stosuje się program **[Everything](https://www.voidtools.com/)** (bezpłatny, do użytku niekomercyjnego/komercyjnego). Moduł oprogramowania ignoruje skomplikowane i oporne systemowe procesy, błyskawicznie wyświetlając poszukiwane pakiety plików. To popularny standard wśród inżynierów!
> Działa zdecydowanie szybciej niż wbudowana wyszukiwarka Eksploratora plików Windows. 🚀

---

## 🔗 Finał: Diagnoza wiedzy o operowaniu Eksploratorem

<data-gate>
  <data-connection-matcher title="Funkcjonalność Nawigacyjna">
    <div class="cmw-item" data-left="Rozpoczęcie szybkiej i natychmiastowej edycji ścieżki dostępu do katalogu" data-right="Pojedyncze kliknięcie kursorem bezpośrednio w wolną strefę paska adresu"></div>
    <div class="cmw-item" data-left="Bezwzględne wyrzucenie pliku z pominięciem procedury buforowania i wirtualnego kosza na pliki" data-right="Kombinacja klawiszy <kbd>Shift</kbd> + <kbd>Delete</kbd>"></div>
    <div class="cmw-item" data-left="Ręczne wpisywanie polecenia nakazującego wyselekcjonowanie dużych plików po wielkości w $\text{MB}$ i $\text{GB}$. Np. $10\text{ MB}$" data-right="Polecenie wielkości <code>size:>10MB</code> wpisane w pasek technicznej wyszukiwarki plików"></div>
    <div class="cmw-item" data-left="Rozpoczęcie wykonywania środowiskowych operacji skryptowych od razu ze sparowaniem z aktualnym otworzonym folderem docelowym" data-right="Wpisanie <code>cmd</code> albo <code>powershell</code> w kliknięty i aktywny pasek adresu"></div>
  </data-connection-matcher>
</data-gate>

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Strumienie alternatywne NTFS (Alternate Data Streams - ADS) i strefa Zone.Identifier</span><span class="deep-dive-badge">NTFS Internals & Security</span></summary>

W systemie plików NTFS plik nie jest prostym, pojedynczym ciągiem bajtów. Każdy plik w NTFS to kontener atrybutów, który może posiadać wiele niezależnych strumieni danych (**Alternate Data Streams - ADS**).

### 1. Domyślny strumień vs strumienie nazwane
Gdy tworzysz plik `notatka.txt`, dane tekstowe lądują w nienazwanym strumieniu głównym (reprezentowanym w strukturze MFT jako atrybut `$DATA`).
Możesz jednak dołączyć do tego samego pliku ukryty, nazwany strumień danych za pomocą dwukropka:
```cmd
echo "To jest jawny tekst" > notatka.txt
echo "To jest ukryty tajny raport" > notatka.txt:tajne.txt
```
Gdy sprawdzisz rozmiar pliku `notatka.txt` w Eksploratorze plików lub poleceniem `dir`, Windows pokaże tylko rozmiar pierwszego strumienia! Drugi strumień jest całkowicie niewidoczny dla standardowych narzędzi graficznych.

### 2. Mechanizm Mark-of-the-Web (Zone.Identifier)
Dlaczego Windows 11 wyświetla ostrzeżenie SmartScreen przy otwieraniu plików pobranych z internetu?
Gdy przeglądarka (Edge, Chrome, Firefox) pobiera plik `program.exe`, automatycznie tworzy na dysku ukryty strumień alternatywny:
```text
program.exe:Zone.Identifier
```
Wewnątrz tego strumienia zapisany jest tekst w formacie INI:
```ini
[ZoneTransfer]
ZoneId=3
ReferrerUrl=https://zaufana-strona.pl/
HostUrl=https://zaufana-strona.pl/program.exe
```
Wartość `ZoneId=3` oznacza strefę internetową (*URLZONE_INTERNET*). Jądro Windows oraz powłoka Eksploratora sprawdzają obecność tego strumienia przed uruchomieniem każdego pliku. Kliknięcie we właściwościach pliku przycisku *„Odblokuj”* (lub wykonanie w PowerShell komendy `Unblock-File program.exe`) po prostu bezpowrotnie usuwa strumień `:Zone.Identifier`.

### 3. Inspekcja strumieni w PowerShell i C++
W konsoli PowerShell możesz wylistować wszystkie ukryte strumienie dowolnego pliku:
```powershell
Get-Item .\plik.exe -Stream *
```
W języku C/C++ do otwarcia konkretnego strumienia służy standardowa funkcja Win32 API:
```c
HANDLE hStream = CreateFileW(
    L"C:\\Dane\\plik.exe:Zone.Identifier",
    GENERIC_READ, FILE_SHARE_READ, NULL,
    OPEN_EXISTING, 0, NULL
);
```

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Eksplorator plików:** do szybkiej nawigacji po systemie używaj paska adresu, w którym możesz nie tylko wpisać katalog docelowy ale wręcz odpalić stamtąd terminal po wpisaniu komendy powłoki (`cmd`, `powershell`). 🚀
- **Skróty ułatwiające pracę:** poruszaj się po plikach bez ciągłego ruszania dłonią w stronę myszki, wspieraj się błyskawiczną klawiaturą (<kbd>Alt</kbd>+<kbd>↑</kbd>, zmiana nazwy z <kbd>F2</kbd>). ⌨️
- **Sortowanie i analiza:** widok „Szczegóły” pozwala błyskawicznie uporządkować tysiące plików jednym kliknięciem w nagłówek kolumny (np. po dacie modyfikacji lub rozmiarze). 🧹
