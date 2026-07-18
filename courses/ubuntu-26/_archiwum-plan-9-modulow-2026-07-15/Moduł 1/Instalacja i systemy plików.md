# Instalacja i systemy plików

Instalacja stacji roboczej z systemem Ubuntu 26.04 LTS Desktop wymaga wyboru odpowiedniego systemu plików. Instalator Ubuntu oferuje różne konfiguracje wykraczające poza standardowy system plików Ext4.

---

## 💾 Wybór systemu plików: Ext4 vs Btrfs vs ZFS

Zrozumienie różnic między systemami plików pozwala zoptymalizować system pod kątem wydajności i bezpieczeństwa danych:

### 1. Ext4 (Fourth Extended Filesystem)
* **Status:** Klasyczny, sprawdzony i stabilny standard.
* **Cechy:** Posiada kronikowanie (journaling), co zapobiega uszkodzeniom struktury plików podczas nagłego zaniku zasilania. Charakteryzuje się niskim narzutem na zasoby sprzętowe, ale nie posiada wbudowanych funkcji kopii migawkowych czy łatwej agregacji dysków.

### 2. Btrfs (B-tree Filesystem)
* **Status:** Nowoczesny system plików oparty na zasadzie **Copy-on-Write (CoW)**.
* **Cechy:** Pozwala na natychmiastowe tworzenie migawek (snapshots) bez utraty wydajności, obsługuje wbudowaną kompresję danych w locie, samoleczenie błędów (self-healing) oraz elastyczne zarządzanie podwolumenami (subvolumes).

### 3. ZFS (Zettabyte Filesystem)
* **Status:** Zaawansowany system plików klasy korporacyjnej.
* **Cechy:** Łączy rolę menedżera wolumenów i systemu plików. Oferuje niesamowitą spójność danych poprzez sumy kontrolne, deduplikację, kompresję oraz sprzętowe zarządzanie macierzami dyskowymi (RAID-Z). Instalator Ubuntu umożliwia eksperymentalną instalację na ZFS bezpośrednio z poziomu interfejsu graficznego.

---

## 🚀 Przebieg instalacji Ubuntu Desktop

Instalator Ubuntu Desktop to graficzny kreator wdrożenia systemu opracowany przez firmę Canonical. Kluczowe kroki podczas instalacji:
1. **Wybór układu partycji:** Wybór między automatycznym partycjonowaniem całego dysku a ręcznym tworzeniem układu.
2. **Konfiguracja sieci:** Statyczne lub dynamiczne przypisywanie parametrów interfejsów bezpośrednio w Netplanie przed instalacją.
3. **Instalacja jądra:** Wybór wersji jądra (General Availability vs HWE).

> [!WARNING]
> Przy instalacji na systemach Btrfs lub ZFS proces rozruchu oraz aktualizacja GRUB są mocno powiązane z konfiguracją podwolumenów. Błędne modyfikacje parametrów montowania w `/etc/fstab` mogą uniemożliwić rozruch stacji roboczej.

---

## 🛠️ Punkt Kontrolny: Instalacja i systemy plików
<data-gate>
  <data-quiz>
    <question>
Jaka jest główna cecha systemów plików działających w oparciu o regułę Copy-on-Write (np. Btrfs)?
    </question>
    <options>
      <item correct>Modyfikowane dane są zapisywane w nowym wolnym miejscu na dysku, co pozwala na natychmiastowe i bezkosztowe tworzenie migawek (snapshots).</item>
      <item>Wymagają one każdorazowego wyłączania kronikowania przed przystąpieniem do zapisu plików.</item>
      <item>Są znacznie wolniejsze od Ext4 i nie obsługują dynamicznego rozszerzania rozmiaru partycji.</item>
    </options>

<div data-hint="error">
  Copy-on-Write (Kopiowanie przy zapisie) polega na tym, że nie nadpisujemy starych bloków danych na żywo, lecz tworzymy ich kopie w wolnym sektorze. Jak to wpływa na powstawanie kopii migawkowych?
</div>
<div data-hint="success">
  Doskonale! Dzięki technologii CoW, systemy Btrfs mogą tworzyć migawki w ułamku sekundy, ponieważ stara wersja danych pozostaje nietknięta w oryginalnym miejscu na dysku.
</div>
  </data-quiz>
</data-gate>
