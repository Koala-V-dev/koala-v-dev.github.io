# Zarządzanie Oprogramowaniem

Zarządzanie oprogramowaniem to coś więcej niż bezmyślne klikanie <kbd class="win-installer-btn">Dalej</kbd> w kreatorach instalacji. Jako administrator musisz rozumieć, jak system operacyjny ewidencjonuje aplikacje, gdzie przechowuje ich konfigurację i jak skutecznie radzić sobie z pozostałościami po deinstalacji.

---

## 🔍 Trzy Sposoby na Instalację Aplikacji

W systemie Windows 11 masz do dyspozycji trzy główne drogi wdrażania oprogramowania, z których każda odpowiada na inne potrzeby środowiskowe i biznesowe:

<data-tabs>
    <tabs>
        <b>📦 Microsoft Store</b>
        <b>🌐 Instalatory (.exe / .msi)</b>
        <b>💻 Winget (CLI)</b>
    </tabs>
    <div>

### Microsoft Store
Zintegrowany z systemem cyfrowy sklep z aplikacjami weryfikowanymi przez Microsoft.

**Zalety:**
- **Automatyczne aktualizacje** realizowane w tle bez udziału użytkownika.
- Każda aplikacja przechodzi analizę bezpieczeństwa przed publikacją.
- **Bezpieczne usuwanie** – aplikacje działają w odizolowanym środowisku (sandbox), nie śmiecąc w systemie plików i rejestrze.

**Wady:**
- Ograniczona dostępność specjalistycznego oprogramowania.
- Domyślnie sugeruje logowanie kontem Microsoft (choć darmowe aplikacje można pobierać bez niego).

*Szybkie wywołanie:* Wciśnij <kbd class="Win"></kbd> i wpisz `Store`.

</div>
<div>

### Tradycyjne instalatory
Klasyczna metoda pobierania dedykowanych plików wykonywalnych ze stron producentów.

**Główne formaty paczek:**
- **`.exe`** (Executable) – plik wykonywalny zawierający autorski instalator stworzony przez programistów danej aplikacji (np. instalator Chrome czy VirtualBox).
- **`.msi`** (Windows Installer Package) – ustrukturyzowany format instalacyjny Microsoftu, będący standardem w sieciach korporacyjnych. Umożliwia cichą instalację w tle i masową dystrybucję na stacje robocze za pomocą Zasad Grupy (GPO) w domenie Active Directory.

> [!WARNING]
> Pobieraj instalatory **wyłącznie z oficjalnych witryn producentów**. Pierwsze wyniki wyszukiwania w Google to często opłacone reklamy oszustów, którzy podmieniają oryginalne pliki na wersje ze wstrzykniętym złośliwym oprogramowaniem!

</div>
<div>

### Winget (Menedżer pakietów)
Wbudowane w Windows systemowe narzędzie CLI do zarządzania aplikacjami, działające analogicznie do menedżerów pakietów znanych z dystrybucji Linux (np. `apt`).

Najważniejsze polecenia w konsoli:
```ps
winget search vlc            # Wyszukaj aplikację w repozytorium
winget install VLC.VLC       # Zainstaluj wybrany pakiet
winget list                  # Wyświetl listę zainstalowanych programów
winget upgrade --all         # Zaktualizuj wszystkie zainstalowane aplikacje
winget uninstall VLC.VLC     # Odinstaluj program z systemu
```

> [!TIP]
> **Winget** to potężne ułatwienie przy konfiguracji nowego komputera. Zamiast ręcznie pobierać instalatory z przeglądarki, możesz przygotować prosty skrypt instalujący cały zestaw potrzebnych aplikacji w tle za jednym zamachem. ☕

</div>
</data-tabs>

---

<data-gate>
  <data-quiz>
    <question>Konfigurujesz salę szkoleniową i musisz zainstalować 15 podstawowych programów (Chrome, 7-Zip, VLC itp.) na każdym z komputerów. Które podejście będzie najbardziej efektywne?</question>
    <options>
      <item correct>Skrypt z komendami `winget install`, który automatycznie wdroży całe oprogramowanie w tle.</item>
      <item>Skopiowanie folderów zainstalowanych programów z `C:\Program Files` na pendrive'a i wklejenie ich na nowe stacje.</item>
      <item>Pobranie instalatora każdego programu z osobna przez przeglądarkę i ręczne przeklikanie kreatorów.</item>
    </options>
    <div data-hint="error">
Ręczna instalacja na wielu komputerach to ogromna strata czasu. Z kolei samo skopiowanie plików z Program Files nie utworzy wymaganych wpisów w rejestrze systemowym ani powiązań plików, przez co programy nie będą działać. Użyj wbudowanego narzędzia CLI.
    </div>
    <div data-hint="success">
Doskonale! Winget pozwala na pełną automatyzację procesu wdrożenia oprogramowania, oszczędzając administratorowi godzin ręcznej pracy.
    </div>
  </data-quiz>
</data-gate>

---

## 🗑️ Deinstalacja Aplikacji – Usuwanie pozostałości

Standardowe usunięcie programu z poziomu wbudowanych narzędzi Windows często pozostawia w systemie sporo śmieci – plików tymczasowych oraz osieroconych wpisów w rejestrze.

Do podstawowych, systemowych metod usuwania oprogramowania należą:

### 1. Nowoczesne Ustawienia (GUI)
<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span> → **Aplikacje** → **Zainstalowane aplikacje** → kliknij ikonę trzech kropek **⋯** przy wybranej pozycji → **Odinstaluj**.

### 2. Klasyczny aplet Panelu Sterowania (GUI)
<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>R</kbd></span> → wpisz `appwiz.cpl` → kliknij prawym przyciskiem myszy na program → **Odinstaluj**.  
Ten tradycyjny widok jest wciąż w pełni funkcjonalny w Windows 11.

### 3. Konsola systemowa (CLI)
```cmd
winget uninstall [ID_aplikacji]
```

> [!NOTE]
> Standardowe deinstalatory celowo pozostawiają pliki konfiguracyjne i klucze rejestru użytkownika na wypadek, gdybyś zdecydował się zainstalować program ponownie w przyszłości. Jeśli chcesz całkowicie wyczyścić system ze śladów po usuniętej aplikacji, musisz ręcznie usunąć jej pozostałości z:
> - Profilu użytkownika: `C:\Users\[nazwa]\AppData`
> - Edytora rejestru: klucze w gałęziach `HKEY_CURRENT_USER\Software\` oraz `HKEY_LOCAL_MACHINE\SOFTWARE\`

Jeżeli wbudowane mechanizmy zawodzą lub aplikacja pozostawiła po sobie duży śmietnik, administratorzy wspomagają się narzędziami firm trzecich, takimi jak **Revo Uninstaller** lub **Geek Uninstaller**, które automatycznie skanują rejestr i strukturę plików w poszukiwaniu osieroconych obiektów.

---

<data-gate>
  <data-quiz>
    <question>Użytkownik odinstalował uszkodzony program przez systemowe Ustawienia. Po ponownej instalacji aplikacja nadal pamięta stare, wadliwe ustawienia i wciąż nie działa. Co jest tego przyczyną?</question>
    <options>
      <item correct>Standardowa deinstalacja usuwa tylko pliki programu. Pliki konfiguracyjne w folderze `%AppData%` oraz wpisy w rejestrze HKCU pozostały nienaruszone.</item>
      <item>Dysk SSD korzysta z buforowania sprzętowego i automatycznie przywraca skasowane konfiguracje oprogramowania.</item>
      <item>Ustawienia programów są trwale zapisywane w module TPM płyty głównej, co uniemożliwia ich usunięcie.</item>
    </options>
    <div data-hint="error">
Standardowy deinstalator nie usuwa prywatnych plików użytkownika. Ustawienia profilu w AppData oraz rejestrze celowo przetrwały procedurę deinstalacji z myślą o ułatwieniu ponownej konfiguracji w przyszłości.
    </div>
    <div data-hint="success">
Dokładnie tak. Aby naprawić aplikację, musisz ręcznie wyczyścić jej pozostałości z profilu użytkownika w folderze AppData lub skorzystać z dedykowanego narzędzia czyszczącego.
    </div>
  </data-quiz>
</data-gate>

---

## 🔄 Windows Update – Aktualizacje Systemowe

Bezpieczeństwo i stabilność stacji roboczej zależą bezpośrednio od regularnego wdrażania aktualizacji systemowych.  
Za ten proces w systemie odpowiada usługa Windows Update.

Szybki dostęp do konfiguracji aktualizacji:
<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span> → **Windows Update**

Aktualizacje w systemie Windows dzielą się na kilka kluczowych kategorii o różnym przeznaczeniu:

| Typ aktualizacji | Rola w systemie | Częstotliwość wdrażania |
| :--- | :--- | :--- |
| **Quality Update** | Małe pakiety skupione na bezpieczeństwie. Łatają nowo odkryte podatności oraz krytyczne błędy w kodzie systemu. | Raz w miesiącu (tzw. `Patch Tuesday`) |
| **Feature Update** | Duże pakiety instalacyjne podnoszące wersję systemu (Build) i wprowadzające nowe funkcje. | Raz w roku. |
| **Driver Update** | Certyfikowane i podpisane cyfrowo przez Microsoft sterowniki do podzespołów komputera. | Zależnie od wydań producentów sprzętu. |
| **Definition Update** | Nowe definicje zagrożeń i wzorców złośliwego oprogramowania dla antywirusa Microsoft Defender. | Nawet kilka razy na dobę w tle. |

> [!IMPORTANT]
> **Patch Tuesday** to kluczowe pojęcie w świecie systemów Windows. Oznacza drugi wtorek każdego miesiąca – dzień, w którym Microsoft rutynowo publikuje zbiorcze aktualizacje bezpieczeństwa (Quality Updates). Jest to stały punkt w kalendarzu każdego administratora IT przy planowaniu okien serwisowych i testowaniu stabilności maszyn w firmie.

---

## 🏪 Autostart – Diagnoza wydajności rozruchu

Nadmiar aplikacji uruchamiających się automatycznie po zalogowaniu drastycznie wydłuża czas rozruchu profilu i niepotrzebnie obciąża zasoby procesora oraz pamięci RAM zaraz po uruchomieniu komputera.

Zarządzanie autostartem z poziomu nowoczesnych Ustawień:
<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span> → **Aplikacje** → **Uruchamianie**

Alternatywna i bardziej szczegółowa metoda z poziomu Menedżera Zadań:
1. Wciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd></span> (Menedżer Zadań).
2. Przejdź do sekcji **Aplikacje startowe** (ikona prędkościomierza w panelu bocznym).

W Menedżerze Zadań nie musisz działać po omacku. System operacyjny monitoruje zachowanie programów podczas rozruchu i prezentuje te dane w kolumnie **Wpływ na uruchamianie** (wartości: *Wysoki*, *Średni*, *Niski*, *Brak*). Wyłączenie automatycznego uruchamiania dla aplikacji o statusie *Wysoki* daje natychmiastowo odczuwalne przyspieszenie działania systemu po zalogowaniu.

---

<data-gate>
  <data-quiz>
    <question>Komputer użytkownika uruchamia się bardzo wolno po zalogowaniu – ikony pulpitu doczytują się z dużym opóźnieniem. Od jakiej czynności w Menedżerze Zadań powinieneś zacząć diagnostykę?</question>
    <options>
      <item correct>Sortuję listę aplikacji startowych po kolumnie „Wpływ na uruchamianie” i wyłączam te o statusie „Wysoki”, które nie są krytyczne do pracy.</item>
      <item>Wyłączam losowe usługi systemowe Microsoftu, licząc na to, że system zacznie działać szybciej.</item>
      <item>Wyłączam wszystkie procesy na liście bez wyjątku, włącznie ze sterownikami dźwięku i karty graficznej.</item>
    </options>
    <div data-hint="error">
Wyłączanie losowych usług systemowych lub krytycznych sterowników sprzętowych może doprowadzić do niestabilności komputera. Skorzystaj z wbudowanych wskaźników wpływu aplikacji na czas rozruchu, które system przygotował do analizy.
    </div>
    <div data-hint="success">
Dokładnie tak! Uporządkowanie listy pod kątem wskaźnika wpływu na rozruch i wyłączenie zbędnych procesów (np. komunikatorów czy updaterów) to najszybsza droga do uzdrowienia autostartu.
    </div>
  </data-quiz>
</data-gate>

---

## 🔗 Finał: Narzędzia w praktyce administratora

Zweryfikuj swoją wiedzę o zarządzaniu oprogramowaniem i aktualizacjami w systemie. Dopasuj problem do optymalnego narzędzia lub rozwiązania:

<data-gate>
  <data-connection-matcher title="Zarządzanie Aplikacjami">
    <div class="cmw-item" data-left="Masowa instalacja programów z wiersza poleceń w pełni automatycznie" data-right="Menedżer pakietów Winget"></div>
    <div class="cmw-item" data-left="Klasyczny panel deinstalacji programów uruchamiany z poziomu okna Uruchom" data-right="Komenda <code>appwiz.cpl</code>"></div>
    <div class="cmw-item" data-left="Wolny start profilu użytkownika po zalogowaniu do systemu" data-right="Wyłączenie zbędnych procesów w autostarcie"></div>
    <div class="cmw-item" data-left="Pozostawienie śladów (plików/kluczy rejestru) po deinstalacji programu" data-right="Skanowanie za pomocą Revo Uninstaller"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Automatyzacja wdrożeń:** menedżer pakietów `winget` to najlepsze narzędzie do masowej instalacji oprogramowania bez przeklikiwania kreatorów w GUI. 📦
- **Głębokie oczyszczanie:** wbudowane deinstalatory celowo zostawiają pliki konfiguracyjne w folderze `AppData` użytkownika – aby trwale pozbyć się aplikacji, konieczne jest ręczne czyszczenie lub użycie specjalistycznych narzędzi (np. Geek Uninstaller). 🧹
- **Optymalizacja startu:** w Menedżerze Zadań analizuj wskaźnik „Wpływ na uruchamianie”, by szybko zidentyfikować i wyłączyć programy blokujące płynne logowanie użytkownika. 📟

---

Skoro sposoby instalacji i zarządzania oprogramowaniem mamy za sobą, to ruszamy z ustawieniami systemowymi! 🐨

