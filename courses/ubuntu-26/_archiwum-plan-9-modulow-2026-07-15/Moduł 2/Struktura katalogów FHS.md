# Struktura katalogów i standard FHS

W systemie Linux wszystkie pliki i katalogi wyrastają z jednego punktu centralnego – katalogu głównego, oznaczanego ukośnikiem `/` (root directory). Organizacja tego drzewa jest ściśle zdefiniowana przez standard **FHS (Filesystem Hierarchy Standard)**.

---

## 🗺️ Główne katalogi w standardzie FHS

Każdy folder w systemie ma dedykowane przeznaczenie:

* `/etc` — Pliki konfiguracyjne systemu i usług (tekstowe bazy konfiguracji).
* `/var` — Dane o zmiennej wielkości, w tym logi systemowe (`/var/log`), bazy danych, kolejki pocztowe czy pliki tymczasowe serwerów www.
* `/home` — Katalogi domowe zwykłych użytkowników (ich prywatne pliki i konfiguracje).
* `/root` — Katalog domowy administratora systemu (`root`).
* `/proc` oraz `/sys` — Wirtualne systemy plików. Nie zajmują miejsca na dysku – stanowią okno do jądra systemu, pokazując informacje o procesach (`/proc`) i urządzeniach (`/sys`).

---

## 🔗 UsrMerge: Połączenie binariów

W nowoczesnych dystrybucjach Linux (w tym Ubuntu 26.04 LTS) wdrożono inicjatywę **UsrMerge**. 

* **Co to oznacza?** Tradycyjne katalogi binarne `/bin` (podstawowe programy użytkownika) oraz `/sbin` (programy administracyjne) nie są już osobnymi katalogami na dysku. Stały się one dowiązaniami symbolicznymi (symlinks) wskazującymi odpowiednio na `/usr/bin` oraz `/usr/sbin`.
* **Dlaczego to wprowadzono?** Upraszcza to zarządzanie pakietami, ujednolica strukturę plików wykonywalnych oraz pozwala na łatwiejsze współdzielenie systemu plików (np. zamontowanie całego `/usr` jako read-only w systemach bezdyskowych).

---

## 🛠️ Punkt Kontrolny: Struktura katalogów (FHS)
<data-gate>
  <data-quiz>
    <question>
Gdzie w systemie Ubuntu 26.04 LTS fizycznie znajdują się pliki wykonywalne, jeśli odwołasz się do ścieżki /bin/bash?
    </question>
    <options>
      <item correct>W katalogu /usr/bin/bash, ponieważ /bin jest jedynie dowiązaniem symbolicznym w ramach UsrMerge.</item>
      <item>W katalogu /etc/bin/bash, ponieważ tam system przechowuje konfigurację binarną.</item>
      <item>Na wirtualnym systemie plików /proc/bin/bash, skąd jądro uruchamia procesy.</item>
    </options>

<div data-hint="error">
  Zwróć uwagę na koncepcję UsrMerge. Wszystkie binarne ścieżki zostały zmigrowane i połączone w jednym wspólnym folderze `/usr`.
</div>
<div data-hint="success">
  Świetnie! Dzięki UsrMerge, katalog `/bin` wskazuje bezpośrednio na `/usr/bin`, co ujednolica strukturę binarną całego systemu.
</div>
  </data-quiz>
</data-gate>
