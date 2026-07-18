# Diagnoza awarii i usługi systemowe

Zanim zaczniesz klikać w systemie, zrozum jedną ważną zasadę. **Windows rzadko psuje się sam z siebie**. 😉

Kiedy aplikacja nagle się zamyka, system resetuje, albo komputer działa wolniej, wielu użytkowników od razu chce formatować dysk. Czasem *Tabula rasa* 📄 ma sens. Ale w pracy administratora ludzie nie chcą tracić swoich danych i skonfigurowanych programów. Musisz wiedzieć, że każde zacięcie i spowolnienie zostawia elektroniczny ślad. System zapisuje te ślady w bazie, którą nazywamy Dziennikiem Zdarzeń.

Menedżer zadań pokazuje tylko małą część informacji. W tej lekcji nauczysz się analizować błędy, które psują Ci *user experience* (**UX**). Poznasz też architekturę usług systemowych i dowiesz się, jak szukać przyczyn problemów.

---

## 🩻 Anatomia awarii i interwencja jądra (Ring 0 vs Ring 3)

Czasem używasz wymagającego programu, jak VirtualBox czy edytor wideo, i nagle program znika. Nie ma żadnego komunikatu o błędzie. Co się stało? 🤔  
Dla użytkownika wygląda to na złośliwość komputera. Dla inżyniera to znak, że zadziałały mechanizmy obronne.

Aplikacje w Windowsie działają w tzw. warstwie użytkownika (Ring 3). Nie mają one bezpośredniego dostępu do sprzętu. System pilnuje ich procesów i danych w ściśle wydzielonych sektorach pamięci RAM.  
Jeśli aplikacja popełni krytyczny błąd, na przykład spróbuje odczytać dane z pamięci, do której nie ma praw, do akcji wkracza jądro systemu (Kernel – Ring 0). Jądro reaguje w ułamku sekundy i *natychmiastowo wymusza zamknięcie niebezpiecznego procesu*.

Windows robi to, aby chronić się przed uszkodzeniem kluczowych plików systemowych. Taki błąd mógłby zatrzymać cały komputer i wywołać Niebieski Ekran Śmierci (*BS***_OD_**). Nagłe zamknięcie programu to obrona, a nie awaria.

Kiedy system zamknie proces, zapisuje krótki raport w Dzienniku Zdarzeń.

Oto najważniejsze numery błędów (Event ID) w Podglądzie Zdarzeń:

* **`1000`** (*Application Error*) – Błąd aplikacji, która po prostu się zamknęła. 🤨
* **`1001`** (*Windows Error Reporting*) – System poinformował, że utworzył raport o błędzie zrzutu pamięci. 🫡
* **`1002`** (*Application Hang*) – Aplikacja przestała odpowiadać (zamroziła się) i Ty ją wymusiłeś. 😉
* **`7031`/`7034`** (*Service Control Manager*) – Usługa systemowa niespodziewanie przestała działać w tle. 😯
* **`41`** (*Kernel Power*) – Problem z zasilaniem lub nagły restart komputera prądem. 😨


<data-tabs>
  <tabs>
    <item>Lokalizacja raportów (Event ID 1000)</item>
    <item>Analiza błędu 0x80000003</item>
    <item>Analiza błędu 0xc0000005</item>
  </tabs>
  <div>

### Lokalizowanie dowodów interwencji Jądra

Aby odczytać dowody awarii, inżynier otwiera narzędzie Podgląd Zdarzeń:
1. Wciśnij skrót <kbd class="Win"></kbd> + <kbd>R</kbd>, wpisz `eventvwr.msc` i naciśnij Enter.
2. Rozwiń folder **Dzienniki systemu Windows** po lewej stronie i wybierz **Aplikacja**.
3. Zaraz po otwarciu zobaczysz tysiące wpisów. Większość to informacje, że wszystko działa dobrze. Musimy je przefiltrować. Kliknij <kbd class="win-menu-btn">Filtruj bieżący dziennik...</kbd> po prawej stronie.
4. W nowym oknie zaznacz poziomy: **Krytyczne** oraz **Błąd**.
5. W polu identyfikatorów wpisz numer `1000`.

Poniższy zrzut ekranu pokazuje wynik filtrowania. Widzisz tam masę błędów powiązanych z `mysqld.exe` (bazą danych XAMPP). Jest to dość typowe zachowanie tej aplikacji. 😅

![Dziennik Zdarzeń Systemu Windows - filtrowanie aplikacji pod kątem zdarzeń o id 1000](/public/courses/windows-11/Images/eventvwr.msc-filtrowanie-zdarzeń-aplikacji-1000.png)

> [!NOTE]
> Zdarzenie **Event ID 1000** to „autopsja” zamkniętej aplikacji. Pozwala jednoznacznie ustalić, który dokładnie komponent lub plik programu wywołał awarię.

  </div>
  <div>

### Wewnętrzny błąd zabezpieczający (Błąd logiki silnika)

```yaml
Nazwa aplikacji powodującej błąd: mysqld.exe
Nazwa modułu powodującego błąd: mysqld.exe
Kod wyjątku: 0x80000003
```

**Analiza Inżynieryjna:**
Tutaj problemem nie jest żaden dodatkowy plik. Zawiódł sam główny program, czyli silnik bazy danych (`mysqld.exe`).
Kod błędu `0x80000003` to tak zwany *Hardcoded Breakpoint*. Oznacza to, że program sam zdecydował się zatrzymać. Mógł na przykład trafić na błąd w strukturze danych, albo niespójność w plikach bazy.
Program celowo „poddał się” i poprosił system o zamknięcie, aby nie nadpisać i nie zniszczyć cennych informacji w tabelach bazy danych.

![Podgląd Zdarzeń Systemu Windows - błąd 0x80000003](/public/courses/windows-11/Images/eventvwr.msc-kod-błędu-0x80000003.png)



  </div>
    <div>

### Naruszenie ochrony pamięci (Błąd biblioteki zewnętrznej)

Często główny program jest w porządku, ale psuje się jeden z jego plików pomocniczych (bibliotek rozszerzających).

```yaml
Nazwa aplikacji powodującej błąd: VirtualBox.exe, wersja: 7.2.4.20995
Nazwa modułu powodującego błąd: Qt6CoreVBox.dll, wersja: 6.8.0.0
Kod wyjątku: 0xc0000005
```

**Analiza Inżynieryjna:**
Program (`VirtualBox.exe`) działał poprawnie. Spróbował jednak użyć biblioteki `Qt6CoreVBox.dll`. Ten plik odpowiada za rysowanie interfejsu w programie.
Biblioteka popełniła błąd i spróbowała zapisać dane w pamięci RAM pod nieprawidłowym adresem. To wywołało kod błędu `0xc0000005` (słynne *Access Violation* - naruszenie dostępu). System Windows natychmiast ubił proces, aby powstrzymać aplikację przed uszkodzeniem pamięci innych programów.

![Podgląd Zdarzeń Systemu Windows - błąd 0x00000005](/public/courses/windows-11/Images/eventvwr.msc-kod-błędu-0x0000005.png)

**Jakie jest rozwiązanie?**
Dzięki temu raportowi wiesz, że winny jest konkretny plik `Qt6CoreVBox.dll`. Wystarczy teraz przeinstalować VirtualBox-a. Najlepiej na nowszą lub inną stabilną wersję.

  </div>
</data-tabs>

<details>
<summary>⚡ Diagnoza na teraz w PowerShell</summary>

Możesz sam sprawdzić swoje błędy z ostatnich 7 dni. Włącz terminal PowerShell i wpisz tę komendę:

```powershell
Get-WinEvent -FilterHashtable @{LogName='Application'; ID=1000; StartTime=(Get-Date).AddDays(-7)} -ErrorAction SilentlyContinue | Select-Object TimeCreated, Message -First 3 | Format-List
```
Zobaczysz wynik podobny do tego:
```xml
TimeCreated : 5.06.2026 14:39:38
Message     : Nazwa aplikacji powodującej błąd: VirtualBox.exe, wersja: 7.2.4.20995, sygnatura czasowa: 0x68f21bca
              Nazwa modułu powodującego błąd: Qt6CoreVBox.dll, wersja: 6.8.0.0, sygnatura czasowa: 0x673e2261
              Kod wyjątku: 0xc0000005
              Przesunięcie błędu: 0x00000000000df375
              Identyfikator procesu błędu:  0x6618
              Czas uruchomienia aplikacji powodującej błąd: 0x1DCF4E7D3433E14
              Faulting ścieżka aplikacji: C:\Program Files\Oracle\VirtualBox\VirtualBox.exe
              Faulting ścieżka modułu: C:\Program Files\Oracle\VirtualBox\Qt6CoreVBox.dll
              Report Id: 2fc8112d-8f06-49d8-8b24-ab6a4e4b029c
              Faulting pełna nazwa pakietu:
              Faulting identyfikator aplikacji względnej dla pakietu:

TimeCreated : 4.06.2026 11:27:02
Message     : Nazwa aplikacji powodującej błąd: mysqld.exe, wersja: 10.4.32.0, sygnatura czasowa: 0x653fa81d
              Nazwa modułu powodującego błąd: mysqld.exe, wersja: 10.4.32.0, sygnatura czasowa: 0x653fa81d
              Kod wyjątku: 0x80000003
              Przesunięcie błędu: 0x0000000000643842
              Identyfikator procesu błędu:  0x1C40
              Czas uruchomienia aplikacji powodującej błąd: 0x1DCF40056F446D6
              Faulting ścieżka aplikacji: c:\xampp\mysql\bin\mysqld.exe
              Faulting ścieżka modułu: c:\xampp\mysql\bin\mysqld.exe
              Report Id: c51a6234-831d-4ad2-bc01-55147aabec4d
              Faulting pełna nazwa pakietu:
              Faulting identyfikator aplikacji względnej dla pakietu:

TimeCreated : 2.06.2026 16:08:02
Message     : Nazwa aplikacji powodującej błąd: VirtualBox.exe, wersja: 7.2.4.20995, sygnatura czasowa: 0x68f21bca
              Nazwa modułu powodującego błąd: Qt6CoreVBox.dll, wersja: 6.8.0.0, sygnatura czasowa: 0x673e2261
              Kod wyjątku: 0xc0000005
              Przesunięcie błędu: 0x00000000000df375
              Identyfikator procesu błędu:  0x390C
              Czas uruchomienia aplikacji powodującej błąd: 0x1DCF2928F27E3B9
              Faulting ścieżka aplikacji: C:\Program Files\Oracle\VirtualBox\VirtualBox.exe
              Faulting ścieżka modułu: C:\Program Files\Oracle\VirtualBox\Qt6CoreVBox.dll
              Report Id: 57ed0041-0354-4db3-b2e2-cb8c43f5ff96
              Faulting pełna nazwa pakietu:
              Faulting identyfikator aplikacji względnej dla pakietu:

```
</details>

<data-gate>
  <data-quiz>
    <question>Dlaczego „nagłe zniknięcie” programu to często mechanizm obronny systemu, a nie zwykły błąd aplikacji?</question>
    <options>
      <item>Ponieważ złośliwe oprogramowanie lub antywirus automatycznie ubija niepodpisane pliki .dll w tle.</item>
      <item correct>Aplikacja z Ringu 3 narusza pamięć, więc Jądro natychmiast ją zabija, by zapobiec awarii BSOD.</item>
      <item>To naturalny efekt wycieku pamięci RAM, gdy zapętlona aplikacja nie może zapisać logów błędu.</item>
    </options>
    <div data-hint="error">
      Zastanów się nad hierarchią systemu. Czy programy same decydują o swojej awarii?
    </div>
    <div data-hint="success">
      Dokładnie! „Wyrzucenie do pulpitu” to obrona. Jądro wymusza zamknięcie programu, a dowód tego znajdziesz w Dzienniku Zdarzeń jako `Event ID 1000`.
    </div>
  </data-quiz>
</data-gate>

---

## 📈 Oś czasu i Monitor Niezawodności

Zamiast zgadywać numery *Event ID*, lepiej spojrzeć na błędy przez pryzmat graficznej osi czasu. W Windowsie ta funkcjonalność działa i rejestruje zdarzenia od momentu zainstalowania systemu. Narzędzie to grupuje awarie według dat i pomaga zidentyfikować problematyczne dni. 

W menu Start wpisz po prostu „niezawodności” i wybierz *„Wyświetl historię niezawodności”*.

![Wykres stabilności systemu z Monitora Niezawodności](/public/courses/windows-11/Images/monitor-niezawodności.png)

Jednak zamiast przełączać się na tryb <kbd class="link-os-windows">Tygodnie</kbd> pozostańmy w domyślnym trybie <kbd class="link-os-windows">Dni</kbd> i zobaczmy co się zepsuło.  
Siódmego czerwca mój komputer miał krytyczny <b>błąd sprzętu</b>:

![Monitor niezawodności wykryty błąd sprzętu](/public/courses/windows-11/Images/monitor-niezawodności-błąd-sprzętu.png)

Kliknij w <kbd class="link-os-windows">Wyświetl szczegóły techniczne</kbd>. Otworzy się poniższy raport:

![Szczegóły techniczne błędu sprzętu](/public/courses/windows-11/Images/monitor-niezawodności-błąd-sprzętu-szczegóły.png)

```yaml
Opis
Problem dotyczący sprzętu spowodował, że system Windows przestał działać poprawnie.

Sygnatura problemu
Nazwa zdarzenia problemu:	LiveKernelEvent
Kod:	193
Parametr 1:	80e
Parametr 2:	ffff838fdf1b40c0
Parametr 3:	ffffbe0ae47a5d20
Parametr 4:	0
Wersja systemu operacyjnego:	10_0_26200
Dodatek Service Pack:	0_0
Produkt:	256_1
Wersja systemu operacyjnego:	10.0.26200.2.0.0.256.48
Identyfikator ustawień regionalnych:	1045

Pliki pomagające opisać problem
WATCHDOG-20260607-1801.dmp
sysdata.xml
WERInternalMetadata.xml
memory.csv
sysinfo.txt
WERInternalRequest.xml

Wyświetl tymczasową kopię tych plików
Ostrzeżenie: Jeśli problem został spowodowany przez wirusa lub inne zagrożenie zabezpieczeń, otwarcie kopii tych plików może zakłócić działanie komputera.
```

Pliki wymienione w powyższym raporcie to standardowe artefakty diagnostyczne generowane przez Windows w momencie awarii:

- `WATCHDOG-20260607-1801.dmp` — zrzut pamięci jądra (kernel-mode), zawierający stan sterowników i struktur systemowych w chwili wystąpienia błędu.
- `sysdata.xml` — szczegółowe dane o konfiguracji systemu i aktywnych komponentach w momencie awarii.
- `WERInternalMetadata.xml` — metadane raportu WER, opisujące kontekst błędu i środowisko wykonawcze.
- `memory.csv` — statystyki wykorzystania pamięci operacyjnej z chwili wystąpienia błędu.
- `sysinfo.txt` — podstawowe informacje o systemie, sprzęcie i wersjach sterowników.
- `WERInternalRequest.xml` — wewnętrzny opis żądania diagnostycznego wygenerowanego przez Windows Error Reporting.

Na tej podstawie możemy przejść do analizy i ustalić, co było bezpośrednią przyczyną błędu.


### Prawda o plikach XML (Zmyłka dla nowicjuszy)
Zauważ, że Monitor wygenerował 6 plików. Z czego większość to dokumenty z końcówką `.xml` (np. `sysdata.xml`). Początkujący często otwierają je w notatniku i tam szukają winnego.
To duży błąd. Te pliki to tylko dane zbiorcze dla Microsoftu. System zapisał tam jaki masz procesor i ile masz pamięci RAM. To zwykła telemetria.

Inżyniera interesuje tylko plik z końcówką `.dmp` (tutaj to `WATCHDOG-20260607-1801.dmp`). To tak zwany **zrzut pamięci** (z ang. *dump*). To skopiowany mały wycinek pamięci RAM z tej jednej sekundy w której doszło do zawieszenia.

> [!NOTE]
> Z pojęciem zrzutu (**dump**) często spotkasz się w bazach danych. Robiąc fizyczną kopię bazy *MySQL*, w terminalu użyjesz następującej składni:
> ```bash
> mysqldump -u root -p --all-databases > backup.sql
> ```

### TDR: Dlaczego system się nie wyłączył?
Kod problemu `193` oznacza słynny **VIDEO_DXGKRNL_LIVEDUMP**. Zobacz, że to zdarzenie typu *LiveKernelEvent* (Zdarzenie na żywo), a nie *BugCheck* (Twardy reset komputera).
Dlaczego to takie ważne? To dowód, że system uratował Cię przed utratą Twojej pracy. Sterownik karty graficznej zamarł i nie odpowiadał. Starszy Windows 7 odciąłby w tym momencie prąd wywołując Niebieski Ekran (*BS***_OD_**).
W nowym systemie włączył się mechanizm **TDR (Timeout Detection and Recovery)**. Jądro systemu zobaczyło, że karta milczy. Wymusiło reset sterownika bezpośrednio w pamięci RAM, zgrało dowody do pliku `.dmp` i go ponownie włączyło. Ty na żywo zobaczyłeś tylko czarne mignięcie monitora i po ułamku sekundy mogłeś wrócić do pracy!

## 🧿 WinDbg narzędzie do odczytu zrzutów awaryjnych
Zwykły Notatnik sobie nie poradzi z plikiem `.dmp`. Wyświetli tylko krzaczki i losowe znaczki. Dlatego że to plik binarny a nie tekstowy.

Musisz pobrać ze sklepu Microsoft Store darmowy program inżynieryjny: **WinDbg** (*Windows Debugger*). To oficjalne narzędzie od twórców z Microsoftu.

![Zrzut ekranu z Microsoft Store pokazujący aplikację WinDbg (Windows Debugger)](/public/courses/windows-11/Images/ms-store-WinDbg.png)

> [!WARNING]
> Po użyciu WinDbg sterownik Realtek (rtf64x64.sys) może wywalić BSOD przy następnym starcie systemu. To błąd sterownika, nie WinDbg.
> Wczesny BSOD przy starcie systemu może spowodować, że BitLocker poprosi o klucz odzyskiwania bo uzna zmianę sprzętu.


1. Uruchom **WinDbg** jako Administrator.
2. Przeciągnij do jego pustego okna plik `WATCHDOG-*.dmp`.
3. Debugger połączy się z serwerem i ściągnie słownik (Symbole). Symbole tłumaczą krzaczki binarne na czytelny tekst.
4. Na dole w pasku poleceń wpisz `!analyze -v` (Analizuj dokładnie) i wciśnij Enter.

![Zrzut ekranu z WinDbg pokazujący analizę pliku .dmp](/public/courses/windows-11/Images/WinDbg-analiza.png)

## 🔍 Jak czytać wynik w WinDbg

WinDbg wygeneruje ogromny raport po wpisaniu komendy.
Nie musisz znać wszystkich pojęć. Wystarczy spojrzeć na kilka konkretnych linijek. One powiedzą Ci dokładnie co zawiodło.

### 1. Nagłówek błędu (Bugcheck Analysis)  
Na samej górze pod gwiazdkami widzisz główny tytuł problemu:

```yaml
VIDEO_DXGKRNL_LIVEDUMP (193)
```

To pierwsza poszlaka. `VIDEO_DXGKRNL_LIVEDUMP` oznacza, że **moduł obsługujący kartę graficzną (`dxgkrnl.sys`)** znalazł problem i wygenerował raport, zanim doszło do fizycznego uszkodzenia karty graficznej.

Zaraz pod tym nagłówkiem możesz zauważyć długą sekcję kluczy i wartości. Zawiera ona detale samego procesu analizy oraz podstawowe atrybuty błędu:

```yaml
KEY_VALUES_STRING: 1

    Key  : Analysis.CPU.mSec
    Value: 1093

    Key  : Analysis.Init.CPU.mSec
    Value: 734

    Key  : Analysis.Version.Ext
    Value: 1.2602.27.2

...

    Key  : Bugcheck.Code.LegacyAPI
    Value: 0x193

    Key  : Bugcheck.Code.TargetModel
    Value: 0x193

    Key  : Dump.Attributes.AsUlong
    Value: 0x18

    Key  : Dump.Attributes.KernelGeneratedTriageDump
    Value: 1

    Key  : Failure.Bucket
    Value: LKD_0x193_dxgkrnl!DxgCreateLiveDumpWithWdLogs2

    Key  : Failure.Hash
    Value: {f51452f1-290a-6a1b-5cf3-c8f949ad9c33}
```

Większość powyższych linijek to tzw. szum informacyjny. Są to wewnętrzne statystyki samego programu WinDbg (np. `Analysis.Elapsed.mSec` to po prostu czas, jaki program spędził na czytaniu pliku). 

Dla inżyniera z całej tej długiej listy liczą się tak naprawdę tylko dwa klucze:
1. **`Bugcheck.Code` (0x193)** – Potwierdza numeryczny kod awarii.
2. **`Failure.Bucket`** – To dokładna „sygnatura zbrodni” (w naszym przypadku `LKD_0x193_dxgkrnl...`). To właśnie ten ciąg znaków kopiuje się i wkleja w wyszukiwarkę internetową, aby szybko znaleźć rozwiązanie problemu.

### 2. Parametry błędu (Bugcheck Code i argumenty)
Niżej znajduje się kod wraz z detalami:

```yaml
BUGCHECK_CODE: 193
BUGCHECK_P1: 80e
```

Kod `193` to symbol zadziałania funkcji **TDR**. Argument `0x80e` informuje nas, że sterownik graficzny po prostu przestał reagować w określonym przez system czasie (zazwyczaj ma dwie sekundy na odpowiedź).

Wiesz już na $100\\%$, że zawinił _**sterownik karty graficznej**_ lub _**przeciążenie GPU**_.

### 3. Proces, który podniósł alarm

```yaml
FAULTING_THREAD:  ffff838fdf1b40c0
PROCESS_NAME:     dwm.exe
```

Proces `dwm.exe` zajmuje się rysowaniem Twojego pulpitu i ikon. Pamiętaj, to nie on jest awarią.
On jako pierwszy zaczął protestować, bo układ karty graficznej nie chciał mu narysować interfejsu. Karta graficzna zignorowała proces, bo była zajęta inną grą, przeglądarką lub operacjami lokalnego LLM (AI). Wtedy obraz na sekundę zamarł.

![Zrzut ekranu z WinDbg pokazujący analizę pliku .dmp](/public/courses/windows-11/Images/WinDbg-analiza2.png)

### 4. Stos wywołań (Stack Trace) 
To najważniejsza sekcja. Tabela pokazuje historię operacji, która doprowadziła do resetu sterownika:

```yaml
STACK_TEXT:  
ffff970a`63c377e0 fffff804`4f6d71d8     : ffff838f`c4e94030 00000000`00000000 00000000`00000000 00000000`0000080e : watchdog!WdpDbgCaptureTriageDump+0xe6
ffff970a`63c37850 fffff804`4f6d3bf8     : ffffbe0a`e47a5d00 00000000`00000193 00000000`0000080e ffff970a`63c378d0 : watchdog!WdDbgReportRecreate+0x108
ffff970a`63c378b0 fffff804`4fac63b2     : ffffbe0a`e47a5d20 ffff970a`63c37aa0 000001fc`f2681134 00000000`c000000d : watchdog!WdDbgReportCreate+0x58
ffff970a`63c37920 fffff804`4fac635b     : ffffbe0a`e47a5d20 ffff970a`63c37aa0 00000000`c000000d fffff804`5381a3d2 : dxgkrnl!DxgCreateLiveDumpWithWdLogs2+0x4a
ffff970a`63c37990 fffff804`4fa1dfb6     : 000000f2`24a7dae0 ffff838f`df1b40c0 ffff838f`df1b40c0 000000f2`24a7de10 : dxgkrnl!DxgCreateLiveDumpWithWdLogs+0x2b
ffff970a`63c379e0 fffff804`bdebc555     : ffff838f`df1b40c0 00000000`00000000 ffff838f`df1b40c0 000001fc`debe3440 : dxgkrnl!NtDxgkPinResources+0x76
ffff970a`63c37a20 00007ffc`9e093f04     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : nt!KiSystemServiceCopyEnd+0x25
000000f2`24a7e958 00000000`00000000     : 00000000`00000000 00000000`00000000 00000000`00000000 00000000`00000000 : 0x00007ffc`9e093f04
```

Jak to prosto odczytać? Patrzymy na końcówki:
```yaml
STACK_TEXT:  
watchdog!WdpDbgCaptureTriageDump+0xe6
watchdog!WdDbgReportRecreate+0x108
watchdog!WdDbgReportCreate+0x58
dxgkrnl!DxgCreateLiveDumpWithWdLogs2+0x4a
dxgkrnl!DxgCreateLiveDumpWithWdLogs+0x2b
dxgkrnl!NtDxgkPinResources+0x76
nt!KiSystemServiceCopyEnd+0x25
0x00007ffc`9e093f04
```
- `watchdog!` — systemowy pies stróżujący wyłapał, że obraz na karcie graficznej się nie odświeża.
- `dxgkrnl!` — jądro próbowało wymusić na karcie odświeżenie pamięci. Bez skutku.
- `nt!KiSystemServiceCopyEnd` - w tym miejscu proces się zakończył.

Ważne: na liście w ogóle nie widać plików gier ani aplikacji. To oznacza, że winny nie leży po stronie zainstalowanych u Ciebie programów. Problem pochodzi z głębokiej warstwy jądra samego sterownika graficznego.

### 5. Winowajca (Symbol, Module)

```yaml
SYMBOL_NAME:  dxgkrnl!DxgCreateLiveDumpWithWdLogs2+4a

MODULE_NAME: dxgkrnl

IMAGE_NAME:  dxgkrnl.sys

IMAGE_VERSION:  10.0.26100.8457
```

To podsumowuje całą analizę.
Błąd wykrzaczył się na pliku `dxgkrnl.sys`. Zatem zamiast niszczyć Ci pracę prądem, system bezpiecznie wykonał proces _**LiveKernelEvent**_, czyli **zrobił zrzut pamięci i zresetował sterownik karty graficznej** bez *BS***_OD_**.

### 6. Identyfikacja błędu (Failure Bucket)

```yaml
FAILURE_BUCKET_ID: LKD_0x193_dxgkrnl!DxgCreateLiveDumpWithWdLogs2
```

To nazwa, którą Microsoft używa u siebie. Dla nas oznacza jedną prostą rzecz:
> **Brakło pamięci VRAM na grafice albo karta liczyła coś zbyt skomplikowanego i nie wyrobiła się w czasie domyślnych maksymalnych 2 sekund.**
## 🧠 Co powinieneś teraz zrobić?

Nie musisz czyścić ani formatować systemu. Winny nie był wirus, ani sam Windows. Przeładowałeś kartę graficzną ciężkimi obliczeniami.

W prawdziwym życiu taki błąd zobaczysz, kiedy:
- włączyłeś ustawienia ultra grafiki w wymagającej grze.
- używasz zbyt dużego modelu Sztucznej Inteligencji u siebie na komputerze.
- Twoja karta ma fizycznie zbyt mało wbudowanej pamięci VRAM.
- otworzyłeś masę programów, które obciążają akcelerację WebGL (np. dużo okien przeglądarki ze skomplikowanymi stronami 3D).

Jak rozwiązać ten problem?
- Odciąż kartę graficzną (wyłącz sprzętowe przyspieszenie przeglądarki).
- Używaj mniejszych modeli w Stable Diffusion lub LLM.
- Otwórz aplikację NVIDIA lub AMD, pobierz nowe sterowniki, ale podczas instalacji zaznacz opcję *„Zresetuj wszystkie ustawienia do domyślnych”*.

![Aktualizacja sterownika Nvidia APP](/public/courses/windows-11/Images/NvidiaAPP-aktualizacja-sterowników.png)

---

### 🟦 Przykład 2: BSOD – Błąd Sterownika Sieciowego

Poprzedni omówiony przypadek to awaria naprawiona w locie (system zrestartował sterownik i uratował sytuację 😎🤙🏻).

Jednak gdy błąd wystąpi w najbardziej uprzywilejowanej warstwie Jądra systemu (**Ring 0**), Windows nie ma już możliwości bezpiecznej naprawy. By chronić sprzęt i dane przed uszkodzeniem, Jądro wymusza natychmiastowe zatrzymanie pracy całego komputera, generuje zrzut awaryjny i wyświetla klasyczny Niebieski Ekran Śmierci (*BS***_OD_**).

Przyjrzyjmy się analizie na przykładzie autentycznego raportu usterki, tym razem wywołanej przez interfejs sieciowy:

#### 1. Nagłówek błędu
```yaml
DRIVER_IRQL_NOT_LESS_OR_EQUAL (d1)
```
Kod `d1` to jeden z najczęstszych powodów BSOD. Oznacza on, że konkretny sterownik sprzętowy spróbował odwołać się do pustego lub chronionego adresu w pamięci RAM. Zazwyczaj to wina zewnętrznego, źle napisanego sterownika (często od sieci, dźwięku lub zewnętrznego zabezpieczenia anty-cheat do gier).

#### 2. Winowajca (Symbol, Module)
Szukamy konkretnego pliku, który wywołał problem:
```yaml
MODULE_NAME: rtf64x64

IMAGE_NAME:  rtf64x64.sys
```
No i oto jest nasz winowajca! 😅  
Plik `rtf64x64.sys` to popularny sterownik karty sieciowej **Realtek** (*Realtek PCIe GbE Family Controller*).

#### 3. Stos wywołań (Stack Trace)
Stos potwierdza sieć jako bezpośredniego winowajcę:
```yaml
STACK_TEXT:  
...
ndis!Ndis::BindEngine::UpdateBindingsWorkItem+0x5a
ndis!ndisFInvokeDetach+0x68
...
rtf64x64+0x51b5
nt!KiPageFault+0x468
rtf64x64+0x51b5
```
Widzisz tu wielokrotne wywołania zaczynające się od `ndis!` (*Network Driver Interface Specification*). To systemowy komponent obsługi interfejsów sieciowych. Współpracował on z wadliwym plikiem `rtf64x64`, co skończyło się ostatecznym błędem w jądrze dostępu do pamięci (`KiPageFault`).

#### 4. Identyfikacja błędu (Failure Bucket)
```yaml
FAILURE_BUCKET_ID:  AV_rtf64x64!unknown_function
```
Sygnatura jasno wskazuje na *AV* (*Access Violation* - naruszenie dostępu do pamięci) wewnątrz sterownika sieciowego.

### 🧠 Co powinieneś teraz zrobić?

Jako inżynier IT wiesz już dokładnie, który moduł sprzętowy zawiódł, a Twoje rozwiązanie będzie precyzyjnie celować w ten jeden układ. Reinstalacja systemu Windows (potocznie „format”) nie rozwiąże problemu, gdyż domyślnie Windows Update zainstaluje ponownie ten sam uszkodzony sterownik.
- Odwiedź oficjalną stronę producenta wadliwej płyty głównej lub laptopa.
- Przejdź do sekcji wsparcia technicznego i pobierz najnowszy sterownik dla zintegrowanej karty sieciowej LAN (Realtek).
- **Uwaga na regresje!** Jeśli zjawisko występuje pomimo instalacji najnowszej aktualizacji, problemem może być niedopracowana nowa wersja oprogramowania od producenta sprzętu. Pobierz wtedy z sekcji archiwum starszą wersję sterownika LAN, która w przeszłości udowodniła Ci już swoją stabilność.

<data-gate>
  <data-connection-matcher title="Dziennik Zdarzeń i Analiza Awarii">
    <div class="cmw-item" data-left="Program nagle znika bez błędu." data-right="Sprawdź Event ID 1000 w gałęzi Aplikacja."></div>
    <div class="cmw-item" data-left="Komputer nagle zgasł bez żadnego ostrzeżenia." data-right="To błąd Kernel-Power (Event ID 41). Sprawdź zasilacz."></div>
    <div class="cmw-item" data-left="Gra zawiesza się na 2 sekundy, ale system działa dalej." data-right="Zadziałał mechanizm TDR. Zresetuj ustawienia karty graficznej."></div>
    <div class="cmw-item" data-left="System wywalił niebieski ekran (BSOD)." data-right="Odczytaj parametr 'Failure Bucket' w programie WinDbg."></div>
  </data-connection-matcher>
</data-gate>

---

## 🤫 Tajemnica svchost.exe i usług w tle

Gdy komputer muli, pewnie odpalasz Menedżer Zadań. Trudno nie zauważyć tam ściany procesów o nazwie `svchost.exe`. Żeby zrozumieć, co one w ogóle robią, musisz poznać mechanikę usług Windows.

Duża część systemu (drukowanie, aktualizacje, zapora sieciowa) to nie są zwykłe programy z okienkami.  
Są to usługi (*Services*). Działają w tle i mają znacznie większe uprawnienia niż to, co sam uruchamiasz.

### Czym jest „Service Host”?

Usługi systemowe to najczęściej pliki `.dll`. Biblioteka sama się nie uruchomi, więc Windows pakuje ją w _**„nosiciela”**_. Tym uniwersalnym kontenerem jest właśnie `svchost.exe` (*Service Host*).

### Magiczna granica pojemności pamięci RAM i grupowanie usług

To, jak Windows zarządza procesami `svchost.exe`, zależy od ilości pamięci RAM. Granicą jest około $3,5\text{ GB}$ pamięci dostępnej dla systemu i wynika to z tego, że z fizycznych $4\text{ GB}$ pamięci RAM, część jest rezerwowana przez kartę graficzną.

<b>Co się dzieje PONIŻEJ minimalnej liczby GB RAM?</b>
Windows agresywnie oszczędza zasoby i upycha kilkanaście usług w jeden proces `svchost.exe`. Na poniższym obrazku widzisz menager zadań i terminal CMD w którym wykonano następującą komendę:
```cmd
tasklist /svc /fi "imagename eq svchost.exe"
```
Jest to maszyna wirtulalna z przydzielonymi $2\text{ GB}$ pamięci RAM. Zaznaczono w niej $9$ procesów `svchost.exe` konteneryzujących usługi i podkreślono najmniejszą grupę z `PID 1064`, która zawiera usługi:
- `AppXSvc`: obsługa aplikacji z Microsoft Store
- `ClipSVC`: obsługa funkcji dynamicznego udostępniania klipów wideo i zdjęć
![Schemat współdzielenia usług a izolacja usług](/public/courses/windows-11/Images/mechanizm-grupowania-usług-dll-w-kantenery-svchost.exe.png)


### Powszechna izolacja usług w procesach svchost.exe

Na mocniejszych sprzętach spełniających minimalne wymagania systemowe Windows 11, Microsoft zmienia taktykę. Windows separuje procesy.

Poniżej widać ten sam test na komputerze z $32\text{ GB}$ RAM. Każda usługa ma tu własny `svchost.exe` np. pierwszy proces z prawej listy `camsvc` to unikalny PID 7068 (*Process ID* - Identyfikator procesu, który jest dynamicznie przydzielany przy jego starcie). Awaria usługi opakowanej w jeden kontener, nie ciągnie za sobą reszty. Im więcej RAM tym komputer lepiej sobie radzi z separacją procesów systemowych. Dlatego Windows zużywa zawsze duże ilości RAMu by pozostać stabilnym.

![Widok wielu niezależnych procesów svchost.exe w Menedżerze Zadań](/public/courses/windows-11/Images/procesy-svchost.exe.png)

Mimo to, część z usług dalej jest grupowana i wynika to z ich obustronnych zależności. Gdy jedna usługa padnie to kolejne mocno związane zależnościami usługi w niekrótkim czasie mogły by próbować wykonać zadania i zapychać **DPS** (*Diagnostic Policy Service* - Usługa zasad diagnostyki). DPS to usługa która ogarnia zgłąszanie i raportowanie różnych błędów oprogramowania zawrówno systemu jaki i innych aplikacji. Nim więcej błędów tym bardziej jest opciążona i możesz to odczuć w gorszum działaniu Windowsa.

Kluczowe grupy usług w svchost.exe
1. `BrokerInfrastructure`, `DcomLaunch`, `PlugPlay`, `Power`, `SystemEventsBroker`: Obsługa ogólnych zdarzeń systemowych i zarządzanie systemem.
2. `BFE`, `mpssvc`: Zarządzanie zaporą sieciową systemu.
3. `OneSyncSvc_127fec05`, `PimIndexMaintenanceSvc_127fec05`, `UnistoreSvc_127fec05`, `UserDataSvc_127fec05`: Obsługa synchronized z kontem microsoft

Tę strukturę widać też bezpośrednio w Menedżerze Zadań po wpisaniu `svchost` w wyszukiwarkę:

![svchost-manager-zadań-filtr-i-rozwiniecie-localServiceNoNetworkFirewall](/public/courses/windows-11/Images/svchost-manager-zadań-filtr-i-rozwiniecie-localServiceNoNetworkFirewall.png)

Procesy grupują w sobie zazwyczaj pojedyncze usługi:
- `Usługa zasad diagnostyki` <span style="text-wrap:nowrap">($27,5\text{ MB}$ RAM)</span>
- `Kondycja systemu Windows i zoptymalizowane środowiska` <span style="text-wrap:nowrap">($22,4\text{ MB}$ RAM)</span>

Przykładem zgrupowania usług jest kontener `localServiceNoNetworkFirewall (2)` <span style="text-wrap:nowrap">($11,6\text{ MB}$ RAM)</span>, który trzyma w sobie dwie usługi zapory sieciowej.

<data-gate>
  <data-quiz>
    <question>Dlaczego kliknięcie „Zakończ zadanie” na obciążającym procesie `svchost.exe` to błąd diagnostyczny?</question>
    <options>
      <item>Wywoła to natychmiastowy twardy reset komputera w celu ochrony Jądra (Ring 0).</item>
      <item correct>Zabijasz tylko pojemnik. Tracisz unikalny numer PID, przez co nie namierzysz winnej usługi w tle.</item>
      <item>Spowoduje to nadpisanie dziennika zdarzeń i usunięcie błędów z Diagnostics-Performance.</item>
    </options>
    <div data-hint="error">
      Czy po usunięciu pojemnika nadal będziesz wiedzieć, co było w środku?
    </div>
    <div data-hint="success">
      Dokładnie! `svchost` to tylko _**„nosiciel”**_. Ubijając go w Menedżerze Zadań, zacierasz jedyny ślad (PID), który pozwoliłby zidentyfikować wadliwą usługę.
    </div>
  </data-quiz>
</data-gate>

---

## 🕵️ Optymalizacja RAM: Zrzucanie zbędnych usług

RAM to zasób. Mniej usług w tle to mniej procesów `svchost.exe`, mniej wybudzeń CPU i więcej wolnej pamięci.  
W Windowsie większość usług działa w tle niezauważalnie — ale wiele z nich można bezpiecznie uśpić lub wyłączyć.

Zarządzanie usługami odbywa się przez przystawkę **Usługi**. 
Wciśnij na klawiaturze skrót <kbd class="Win"></kbd> + <kbd>R</kbd>, po czym wpisz `services.msc` i zatwierdź. 

![services.msc Oculus VR Runtime Service zmiana trybu uruchamiania na ręczny](/public/courses/windows-11/Images/services.msc-Oculus-VR-Runtime-Service-przełączenie-trybu-uruchamiania-na-ręczny.png)

W oknie właściwości każdej usługi możesz ustawić **Typ uruchamiania**:

- <kbd class="win-menu-btn">Automatyczne (opóźnione uruchamianie)</kbd> – startuje z systemem, ale chwilę później.  
- <kbd class="win-menu-btn">Automatyczny</kbd> – startuje natychmiast przy uruchamianiu systemu.  
- <kbd class="win-menu-btn">Ręczny</kbd> – usługa jest uśpiona; system może ją wybudzić tylko wtedy, gdy będzie potrzebna.  
- <kbd class="win-menu-btn">Ręczny (wyzwalane uruchamianie)</kbd> – usługa startuje tylko w reakcji na konkretne zdarzenie (np. podłączenie urządzenia).  
- <kbd class="win-menu-btn">Wyłączony</kbd> – usługa jest zablokowana. System nie może jej uruchomić nawet wtedy, gdy będzie jej potrzebował.

> [!CAUTION]
> <b>Dlaczego najczęściej **„Ręczny”**, a nie **_„Wyłączony”_**?</b>
> Wyłączenie usługi „na sztywno” może spowodować błędy, jeśli inny komponent systemu będzie jej wymagał.  
> Tryb **Ręczny** to bezpieczna izolacja: usługa nie startuje z systemem, ale Windows może ją uruchomić tylko wtedy, gdy naprawdę musi.

Poniżej znajdziesz **wyselekcjonowane i zweryfikowane** usługi, które można bezpiecznie wyłączyć lub uśpić, aby odzyskać zasoby — bez destabilizacji systemu.

---

### 🌐 Sieć i udostępnianie (Usługi Microsoft)

| Usługa | Powód | Zalecenie |
| :--- | :--- | :--- |
| **EapHost** | Uwierzytelnianie 802.1X — używane w sieciach korporacyjnych i uczelnianych. | Disable |
| **dot3svc** | 802.1X dla sieci przewodowych (LAN). W domu zbędne. | Disable |
| **icssvc / SharedAccess** | Udostępnianie połączenia internetowego (Hotspot / ICS). | Disable |
| **wcncsvc** (WPS) | Konfiguracja urządzeń przez WPS — funkcja podatna na ataki brute‑force. | Disable |
| **SSDPSRV / upnphost** | UPnP (automatyczne wykrywanie urządzeń). Jeśli nie używasz DLNA / SmartTV / konsol — zbędne. | Disable |
| **WMPNetworkSvc** | Strumieniowanie DLNA dla Windows Media Player. | Disable |

---

### 🗑️ Aplikacje zewnętrzne i bloatware producentów sprzętu

To tutaj system marnuje najwięcej zasobów. Wiele programów instaluje własne usługi działające 24/7.

| Usługa | Powód | Zalecenie |
| :--- | :--- | :--- |
| **GoogleUpdater** <ul><li>Service</li><li>Internal</li></ul> | Telemetria + cichy updater Chrome. Chrome i tak aktualizuje się sam przy starcie. | Disable |
| **GoogleChromeElevationService** | Niepotrzebne podnoszenie uprawnień dla Chrome. | Disable |
| **Bonjour Service** | Instalowane przez Adobe / gry. Zwykle zbędne. | Manual |
| **GIGABYTE Update Service** | Telemetria + automatyczne aktualizacje sterowników. | Disable |
| **Gservice** | Gigabyte Cloud — zbędne obciążenie CPU. | Disable |
| **EasyTuneEngineService** | Sterowanie wentylatorami / OC. | Zostawić |
| **GIGABYTE Adjust** | Sterowanie LED / RGB. | Zostawić |
| **HwmRecordService** | Monitoring czujników. | Zostawić |

> PS. Nie używaj Chromium. Tylko Firefox 🦊 no i w ostateczności Brave 🦁. Ja osobiście preferuje Firefoxa. 😜
---

### 🖨️ Inne wbudowane usługi

| Usługa | Powód | Zalecenie |
| :--- | :--- | :--- |
| **EFS** | Szyfrowanie plików (nie BitLocker). Jeśli nie używasz — zbędne. | Manual / Disable |
| **Spooler** | Bufor wydruku — wyłącz, jeśli nie masz drukarki. | Manual |
| **Usługi Xbox Live** <ul> <li>XblAuthManager</li><li>XblGameSave</li><li>XboxGipSvc</li><li>XboxNetApiSvc</li></ul> | Telemetria i integracja Xbox. | Manual / Disable |

---

### 📦 Wirtualizacja i Hyper‑V (Microsoft)

**Hyper‑V gryzie się z Oracle VirtualBox** — blokuje mu pełny dostęp do wirtualizacji sprzętowej procesora.  
Jeśli pracujesz w VirtualBox, wyłącz Hyper‑V i jego komponenty.

| Usługa / Funkcja | Powód | Zalecenie |
| :--- | :--- | :--- |
| **HvHost** | Główna usługa Hyper‑V — blokuje VT‑x dla VirtualBox. | Disable |
| **vmic*** (wszystkie) | Telemetria i integracja Hyper‑V. | Disable |
| **HypervisorPlatform** | Włącza natywny hypervisor Windows. | Disable |
| **VirtualMachinePlatform** | Moduły Hyper‑V dla podsystemów. | Disable |
| **Windows Hypervisor Platform** | API Hyper‑V dla aplikacji. | Disable |

> [!NOTE]
> Wyłączenie Hyper‑V wyłącza również **WSL2** (Windows Subsystem for Linux 2).  
> Jeśli potrzebujesz WSL2 — nie wyłączaj Hyper‑V.

> [!TIP]
> Po zmianie ustawień usług oraz wyłączeniu platform Hyper‑V w „Funkcjach systemu Windows”, wykonaj pełny restart.  
> System uruchomi się szybciej, a VirtualBox odzyska pełną wydajność.
> ![Usunięcie Hyper-V w funkcjach systemu Windows](/public/courses/windows-11/Images/wyłącz-funkcję0systemu-windows-hyper-v.png)

<data-gate>
  <data-connection-matcher title="Zarządzanie Usługami i RAM">
    <div class="cmw-item" data-left="VirtualBox zgłasza brak wsparcia dla wirtualizacji sprzętowej 64-bit." data-right="Wyłącz usługi HvHost i platformę Hyper-V."></div>
    <div class="cmw-item" data-left="Chcesz odciążyć sprzęt, ale boisz się uszkodzić system." data-right="Przełączaj zbędne usługi na tryb 'Ręczny', a nie 'Wyłączony'."></div>
    <div class="cmw-item" data-left="Nigdy nie drukujesz żadnych dokumentów z tego komputera." data-right="Zmień tryb usługi 'Spooler' (Bufor wydruku) na Ręczny."></div>
  </data-connection-matcher>
</data-gate>

---

## 🔮 Ciche awarie w sprzęcie

Zarówno procesy `svchost.exe`, jak i zwykłe aplikacje mogą spowalniać komputer.  
Ale największym wyzwaniem dla inżyniera są **mikro‑usterki sprzętowe**, które:

- trwają ułamek sekundy,  
- nie wyświetlają żadnego komunikatu,  
- potrafią wygenerować setki błędów w tle,  
- obciążają usługę DPS (Diagnostic Policy Service),  
- powodują lagi, przycięcia i niestabilność.

---

#### Rozwiązywanie problemów sprzętowych (Event ID 5 – BTHUSB)

Załóżmy, że Twoja bezprzewodowa myszka co chwilę przerywa połączenie.  
Na ekranie — cisza. Zero błędów.

Inżynier robi coś innego:

1. Otwiera **Podgląd zdarzeń** (wciska <kbd class="Win"></kbd> + <kbd>R</kbd> i wpisuje `eventvwr.msc`).
2. Rozwija drzewo logów: <kbd class="win-menu-btn">Dzienniki systemu Windows</kbd> → <kbd class="win-menu-btn">System</kbd>.
3. Używa opcji <kbd class="win-menu-btn">Filtruj bieżący dziennik...</kbd> po prawej stronie i wyłapuje setki błędów **Event ID 5** (źródło: **BTHUSB**).

Ten błąd oznacza:

> *„Sterownik Bluetooth oczekiwał zdarzenia HCI o określonym rozmiarze…”*

Czyli: _**moduł Bluetooth na ułamek sekundy traci kontakt z jądrem systemu**_.

---

#### Dlaczego tak się dzieje?

Windows, zwłaszcza na laptopach, agresywnie oszczędza energię. Odłącza zasilanie portów USB i modułów radiowych, jeśli uzna, że „nic się nie dzieje”. Aktualizacja sterowników nic tu nie zmieni. Musisz **zabronić systemowi usypiania urządzenia**.

---

#### Jak to naprawić?

1. Otwórz **Menedżera urządzeń** (`devmgmt.msc`).  
2. Rozwiń sekcję **Bluetooth**.  
3. Otwórz właściwości modułu radiowego.  
4. Przejdź do zakładki **Zarządzanie energią**.  
5. Odznacz opcję:

> „Zezwalaj komputerowi na wyłączanie tego urządzenia w celu oszczędzania energii”.

![Wyłączenie zarządzania energią modułu Bluetooth na poziomie sprzętowym](/public/courses/windows-11/Images/menedżer-urządzeń-wyłączenie-oszczedzania-energi-na-kontrolerze-bluetooth.png)

Po tej zmianie:

- błędy Event ID 5 znikną,  
- myszka przestanie się rozłączać,  
- DPS przestanie być przeciążony,  
- system odzyska płynność.

---

## ⏱️ Analiza wolnego włączania się systemu

Menedżer zadań pokazuje tylko programy uruchamiane **po zalogowaniu**.  
Ale co jeśli komputer muli zanim zobaczysz ekran logowania? 🤔

Do tego służy ukryty dziennik **Diagnostyki wydajności** (`Diagnostics-Performance`).

- Wciśnij skrót <kbd class="Win"></kbd> + <kbd>R</kbd>, wpisz: `eventvwr.msc` i zatwierdź.
- Przejdź do: `Dziennik aplikacji i usług` → `Microsoft` → `Windows` → `Diagnostics-Performance` i kliknij w *`Działa`*.
![Podgląd zdarzeń - dziennik diagnostyki wydajności](/public/courses/windows-11/Images/eventvwr.msc-_c_Microsoft-Windows-Diagnostics-Performance_Operational.png)

Alternatywnie możesz w oknie **Uruchom** wpisać ścieżkę bezpośrednią:
```cmd
eventvwr.msc /c:Microsoft-Windows-Diagnostics-Performance/Operational
```


Szukamy tam zdarzeń z identyfikatorem **`Event ID 101`**, to dokładne raporty o tym, co konkretnie spowolniło start systemu. Gdy klikniesz w wybrany wpis, w zakładce <kbd class="win-menu-btn">Ogólne</kbd> znajdziesz winny plik oraz liczbę milisekund. 

---

Przeklikiwanie się nawet na filtrze z `Event ID 101`, jest dość upierdliwe zwłaszcza jak zdarzenie aplikacji lub usługi pojawia się w logach kilkanaście razy. Dlatego odaję ci w ręce skrypt PowerShell, który wymaga uprawnień administratora, a pokaże ci 10 najwolniejszych procesów, które spowalniają start Windows 11. 

1. Każdorazowo przed wykonaniem skrypty wyczyść pamięć podręczną zmiennej która jest tablicą asocjacyjną, by wyniki ponownego uruchomienia pozostały świerze:
```powershell
$seen = @{}
```
2. Następnie skopiuj i wklej główny skrypt wyciągający dane:
```powershell
Get-WinEvent -LogName "Microsoft-Windows-Diagnostics-Performance/Operational" | 
    Where-Object Id -eq 101 | 
    ForEach-Object {
        $xml = [xml]$_.ToXml()
        $exeName = ($xml.Event.EventData.Data | Where-Object Name -eq 'Name').'#text'
        $totalTime = ($xml.Event.EventData.Data | Where-Object Name -eq 'TotalTime').'#text'
        
        if (-not $seen[$exeName]) {
            $seen[$exeName] = $true
            [PSCustomObject]@{ Name = $exeName; Time = $totalTime }
        }
    } | Select-Object -First 10 | ForEach-Object {
        Write-Host "Nazwa pliku: $($_.Name)" -ForegroundColor Cyan
        Write-Host "Czas obniż. wydajności: $($_.Time)ms" -ForegroundColor Yellow
        Write-Host "---"
    }
```
<details>
<summary>Wyjaśnienie powyższego skryptu</summary>

Pierwsza komenda wyciągająca z dziennika zdarzeń `Diagnostics-Performance` wszystkie wpisy.
```powershell
Get-WinEvent -LogName "Microsoft-Windows-Diagnostics-Performance/Operational"
```

Pionowa kreska `|` oznacza podawanie wyniku komendy z lewej strony, jako danych wejściowych dla kolejnej komendy z prawej strony.
Wynik poprzedniej komendy z wszystkimi zdarzeniami przechodzi przez kolejną komendę, która filtruje go i wybiera tylko te z identyfikatorem `101`.
```powershell
Where-Object Id -eq 101
```

Następnie w pętli `ForEach-Object` przetwarzamy każdy znaleziony i przefiltrowany wpis.   
W pętli realizowane są komedy:
- `[xml]$_.ToXml()` - parsuje wpis zdarzenia do formatu XML.

- `$exeName = ($xml.Event.EventData.Data | Where-Object Name -eq 'Name').'#text'` — z tego XML-a wyciągamy tekst schowany pod etykietą `Name`, aby dostać nazwę pliku (np. `msedge.exe`).

- `$totalTime = ($xml.Event.EventData.Data | Where-Object Name -eq 'TotalTime').'#text'` — analogicznie wyciągamy wartość parametru `TotalTime` (czas w milisekundach, który zaważył na powolnym starcie).

---
Ten fragment odpowiada za pominiecie wpisów które już istnieją w zmiennej `$seen`:
`if (-not $seen[$exeName]) { $seen[$exeName] = $true; ... }`
Ogranicza wyświetlane wyniki do top $10$ największych problemów:
`Select-Object -First 10`

`Write-Host`... zwraca wynik w konkretnym formacie kolorystycznym i separacją `---` co podnosi czytelność. 👍🏻


</details>

Dzięki temu odczytasz przejrzysty ranking $10$ największych „spowalniaczy” systemu.

![skrypt do badania opóźnienia załadowania systemu](/public/courses/windows-11/Images/skrypt-do-badania-opóźnienia-załadowania-systemu.png)

Na podstawie autentycznego zrzutu, podzielmy tego typu procesy na $5$ logicznych kategorii:

> [!WARNING]
> Ten skrypt wyświetla historyczne wpisy zdarzeń z różnych dni. Zsumowanie tych wszystkich opóźnień (np. 42 sekundy) **_NIE OZNACZA_**, że o tyle wydłużyło się jedno konkretne włączenie komputera! 
> - Po pierwsze, usługi ładują się **równolegle** (w tym samym czasie).
> - Po drugie, część tych opóźnień mogła wystąpić np. miesiąc temu. 
> 
> Warto też pamiętać, że podawany w Menedżerze Zadań parametr *„Czas uruchamiania z systemu BIOS”* dotyczy wyłącznie inicjalizacji samego sprzętu przez płytę główną, zanim Windows w ogóle zacznie się ładować (procedura POST).
> ![Menedżer zadań - autostartem](/public/courses/windows-11/Images/menedżer-zadań-autostart.png)

---

### 🛡️ Grupa 1: Oprogramowanie antywirusowe i zabezpieczenia
```yaml
Nazwa pliku: MsMpEng.exe (13561ms)
Nazwa pliku: Malwarebytes.exe (5937ms)
```
Programy takie jak Windows Defender (`MsMpEng.exe`) wykonują głębokie skanowanie pamięci RAM zanim uruchomią się inne procesy. **To one najczęściej generują kilkunastosekundowe opóźnienia**. Nie jest to błąd, to cena bezpieczeństwa – nie należy z tym walczyć!

---

### 🌐 Grupa 2: Przeglądarki internetowe
```yaml
Nazwa pliku: msedge.exe (6685ms)
Nazwa pliku: firefox.exe (7299ms)
```
Przeglądarki często aktualizują się w tle lub ładują swoje usługi za sprawą funkcji **Startup Boost (Przyspieszenie uruchamiania)**, w której system wrzuca silnik przeglądarki do RAM **zanim** pojawi się pulpit.

**Jak to wyłączyć w Edge?**
1. Wejdź w **Ustawienia → System i wydajność**.
2. Wyłącz „Przyspieszenie uruchamiania” oraz „Kontynuuj uruchamianie rozszerzeń w tle”.

![Konfiguracja systemu Edge w sekcji przyspieszenia operacyjnego na starcie](/public/courses/windows-11/Images/ms-edge-wyłączenie-przyspieszenia-uruchamiania-i-kontynuowania-uruchamiania-rozszerzeń-przeglądarki-w-tle.png)

Po tej zmianie system włączy się szybciej o odczuwalne kilka sekund.

---

### ⚙️ Grupa 3: Wbudowane usługi w tle Windows 11
```yaml
Nazwa pliku: CrossDeviceService.exe (5193ms)
Nazwa pliku: MoUsoCoreWorker.exe (5446ms)
Nazwa pliku: sihost.exe (623ms)
Nazwa pliku: wevtutil.exe (418ms)
```
To naturalne usługi systemu działające w tle:
*   **MoUsoCoreWorker:** proces odpowiadający za sesje Windows Update.
*   **CrossDeviceService:** synchronizacja smartfona z PC (Łącze z telefonem). Jeśli z tego nie korzystasz, rozważ wyłączenie funkcji w ustawieniach systemu.
*   **sihost** i **wevtutil:** podstawowe wczytywanie infrastruktury pulpitu (Shell) i dzienników zdarzeń (Event Viewer). Ich opóźnienie jest całkowicie naturalne i najczęściej ułamkowe.

---

### 🎮 Grupa 4: Oprogramowanie sprzętowe i nakładki
```yaml
Nazwa pliku: NVDisplay.Container.exe (1502ms)
```
To proces należący do pakietu narzędzi graficznych NVIDIA. Zarządza telemetrią oraz nakładką w grze (In-Game Overlay). Opóźnienie na poziomie 1.5 sekundy to norma. Jeśli bardzo Ci na tym zależy, możesz wejść w ustawienia NVIDIA App i wyłączyć **nakładkę w grze**, co symbolicznie skróci proces startowy.

---

### 📦 Grupa 5: Zewnętrzne Autoupdatery
```yaml
Nazwa pliku: updater.exe (7479ms)
```
Programy od zewnętrznych wydawców, które ładują swoje niezależne procesy w tle, upewniając się przed startem pulpitu, że pobrano nowe paczki łatek (często związane z przeglądarkami lub pakietami biurowymi). Warto sprawdzić w Menedżerze Zadań sekcję „Aplikacje autostartu” i zablokować je, aby nie "dusiły" zasobów przy uruchamianiu komputera.

---

<data-gate>
  <data-connection-matcher title="Awarie Ciche i Wydajność">
    <div class="cmw-item" data-left="Myszka Bluetooth ciągle przerywa (Event ID 5)." data-right="Wyłącz oszczędzanie energii dla modułu radiowego w Menedżerze urządzeń."></div>
    <div class="cmw-item" data-left="System startuje odczuwalnie wolniej przez przeglądarkę." data-right="Znajdź Event ID 101 i wyłącz Startup Boost w ustawieniach Edge."></div>
    <div class="cmw-item" data-left="Diagnostics-Performance zgłasza duże opóźnienie dla MsMpEng.exe." data-right="Zignoruj. To naturalne zachowanie skanera RAM Defendera podczas startu."></div>
    <div class="cmw-item" data-left="Brakuje Ci RAM-u na starym laptopie." data-right="Przestaw zbędne usługi (np. telemetrię i aktualizacje producenta) na tryb 'Ręczny'."></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Awaria to obrona (Event ID 1000):** Wyrzucenie do pulpitu bez komunikatu błędu to najczęściej interwencja Jądra (Ring 0). Zamiast reinstalować program, szukaj winnej biblioteki `.dll` w Podglądzie Zdarzeń. 🔍
- **Zrzuty pamięci i TDR:** Krótkie zawieszenia grafiki to działanie mechanizmu TDR. Gdy Jądro musi się zrestartować, powstaje BSOD. Winnego poznasz, czytając parametr `Failure Bucket` w narzędziu WinDbg. 🎯
- **Tajemnica `svchost.exe`:** To tylko uniwersalny nosiciel usług. Zamiast ubijać go na ślepo w menedżerze zadań, zawsze izoluj wadliwą usługę sprawdzając jej unikalny identyfikator PID. 🛡️
- **Świadoma optymalizacja RAM:** Wyłączanie usług w ciemno psuje system. Odciążając sprzęt, przełączaj zbędne usługi na tryb „Ręczny” (np. Spooler czy usługi Xbox). Uważaj też na konflikt platformy Hyper-V (HvHost) z wirtualizacją VirtualBox. ⚡
- **Ukryte opóźnienia sprzętowe:** Do analizy powolnego startu systemu używaj logów `Diagnostics-Performance`. Pozwolą ci one wyłowić procesy w tle (jak Edge Startup Boost) oraz ciche awarie zasilania sprzętu (Event ID 5 dla Bluetooth). 🩺

---

Zrozumiałeś, że awarie nie dzieją się bez powodu, a każde zacięcie zostawia twardy ślad. Wiesz, jak namierzyć winną usługę i odczytać zrzuty pamięci. Z tą wiedzą ruszamy dalej – przed nami bezpośrednie modyfikacje Rejestru Windows i zautomatyzowany Harmonogram Zadań. 🛡️
