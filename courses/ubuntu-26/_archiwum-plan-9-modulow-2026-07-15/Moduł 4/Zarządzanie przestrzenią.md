# Zarządzanie przestrzenią z LVM i LUKS

Tradycyjne partycjonowanie dysków twardych ma jedną zasadniczą wadę: trudno jest zmienić rozmiar partycji po jej utworzeniu. Standard **LVM (Logical Volume Manager)** rozwiązuje ten problem, wprowadzając elastyczną warstwę abstrakcji nad fizycznymi nośnikami, a **LUKS (Linux Unified Key Setup)** zabezpiecza te dane przed nieautoryzowanym fizycznym dostępem poprzez pełne szyfrowanie.

---

## 🧱 Architektura LVM: PV, VG i LV

LVM dzieli przestrzeń dyskową na trzy logiczne warstwy:

### 1. Physical Volumes (PV) — Wolumeny Fizyczne
To fizyczne dyski lub partycje (np. `/dev/sda2`, `/dev/nvme0n1p3`), które zostały zainicjalizowane do użytku przez LVM za pomocą polecenia `pvcreate`.

### 2. Volume Groups (VG) — Grupy Wolumenów
To wirtualne pule pamięci masowej łączące ze sobą jeden lub więcej Wolumenów Fizycznych (PV). Grupa wolumenów zachowuje się jak jeden wielki dysk wirtualny.

### 3. Logical Volumes (LV) — Wolumeny Logiczne
To wirtualne partycje wydzielone z Grupy Wolumenów (VG). Na wolumenach logicznych tworzy się systemy plików (np. Ext4, Btrfs) i montuje je w drzewie katalogów Linuksa. Ich rozmiar można dynamicznie zmieniać na żywo.

---

## 🔒 Pełne szyfrowanie dysku z LUKS

**LUKS** to standard szyfrowania dysków twardych w systemie Linux. Zapewnia ochronę danych na wypadek fizycznej kradzieży sprzętu lub dysków.

* **Jak działa LUKS?** Warstwa szyfrująca działa bezpośrednio pod menedżerem wolumenów (LVM na LUKS) lub nad nim (LUKS na LVM). Podczas rozruchu GRUB2 prosi o podanie hasła dekodującego nagłówek LUKS, a po jego poprawnym wprowadzeniu odszyfrowuje klucz główny i przekazuje dostęp do LVM.
* **Integracja:** W Ubuntu szyfrowanie można łatwo wdrożyć z poziomu instalatora Subiquity, wybierając opcję LVM z szyfrowaniem.

> [!IMPORTANT]
> Utrata hasła LUKS oznacza bezpowrotną utratę dostępu do wszystkich danych zgromadzonych na wolumenach logicznych. W systemach produkcyjnych klucze odzyskiwania powinny być przechowywane w bezpiecznym zewnętrznym archiwum.

---

## 🛠️ Punkt Kontrolny: Zarządzanie przestrzenią (LVM i LUKS)
<data-gate>
  <data-quiz>
    <question>
Jaka jest hierarchiczna kolejność warstw abstrakcji LVM, zaczynając od fizycznego dysku w kierunku montowanego systemu plików?
    </question>
    <options>
      <item correct>Fizyczny nośnik (Physical Volume) $\rightarrow$ Grupa wolumenów (Volume Group) $\rightarrow$ Wolumen logiczny (Logical Volume)</item>
      <item>Grupa wolumenów (Volume Group) $\rightarrow$ Wolumen logiczny (Logical Volume) $\rightarrow$ Fizyczny nośnik (Physical Volume)</item>
      <item>Wolumen logiczny (Logical Volume) $\rightarrow$ Fizyczny nośnik (Physical Volume) $\rightarrow$ Grupa wolumenów (Volume Group)</item>
    </options>

<div data-hint="error">
  Najpierw inicjalizujesz surowy nośnik jako fizyczny (PV). Następnie łączysz je w pulę (VG). Z tej puli wykrawasz partycje wirtualne (LV).
</div>
<div data-hint="success">
  Świetnie! Ta trójwarstwowa struktura pozwala administratorom dowolnie rozszerzać wolumeny logiczne na bazie wolnego miejsca z grupy wolumenów.
</div>
  </data-quiz>
</data-gate>
