# Rozbudowa wolumenów LVM na żywo

Jednym z najważniejszych powodów stosowania LVM na serwerach produkcyjnych jest możliwość elastycznego zwiększania przestrzeni dyskowej bez przerywania pracy usług (tzw. powiększanie "na żywo" lub "w locie").

---

## 📈 Scenariusz: Kończy się miejsce na partycji /var

Wyobraź sobie, że baza danych zapełniła wolumen `/var` i aplikacja odmawia zapisu. W tradycyjnym partycjonowaniu musiałbyś wyłączyć serwer, sklonować dysk i żmudnie przesuwać sektory. W LVM zrobisz to kilkoma poleceniami na działającym systemie.

---

## 🛠️ Procedura rozbudowy krok po kroku

Załóżmy, że do komputera dodano nowy fizyczny dysk `/dev/sdc` o rozmiarze $100\text{ GB}$.

### Krok 1: Przygotowanie dysku jako wolumenu fizycznego LVM
Inicjalizujemy dysk do współpracy z menedżerem wolumenów:
```bash
pvcreate /dev/sdc
```

### Krok 2: Rozszerzenie grupy wolumenów (VG)
Dodajemy nowo zainicjalizowany wolumen fizyczny do istniejącej grupy wolumenów (załóżmy, że grupa nazywa się `vg_system`):
```bash
vgextend vg_system /dev/sdc
```
Od tego momentu pula wolnej pamięci w grupie wolumenów powiększyła się o dodatkowe $100\text{ GB}$.

### Krok 3: Rozszerzenie wolumenu logicznego (LV)
Zwiększamy rozmiar wolumenu logicznego (np. `/dev/vg_system/lv_var`). Flaga `-r` (lub `--resizefs`) jest kluczowa – automatycznie rozciąga również system plików leżący na wolumenie (działa np. dla Ext4 i XFS):
```bash
lvextend -r -L +50G /dev/vg_system/lv_var
```
Jeśli nie użyłeś flagi `-r`, musisz ręcznie poinstruować system plików, aby dostosował się do nowego rozmiaru wolumenu wirtualnego:
* Dla Ext4: `resize2fs /dev/vg_system/lv_var`
* Dla XFS: `xfs_growfs /var`

---

## 🛠️ Punkt Kontrolny: Rozbudowa LVM
<data-gate>
  <data-quiz>
    <question>
Jakie polecenie (lub flaga) odpowiada za faktyczne rozciągnięcie systemu plików Ext4 na powiększonym wolumenie logicznym?
    </question>
    <options>
      <item correct>Flaga -r w lvextend lub oddzielne polecenie resize2fs</item>
      <item>Polecenie pvmove na fizycznym nośniku</item>
      <item>Ponowne sformatowanie wolumenu poleceniem mkfs.ext4</item>
    </options>

<div data-hint="error">
  Zwróć uwagę, że powiększenie wirtualnej przestrzeni (wolumenu) to nie to samo co rozciągnięcie samej struktury katalogów i plików (systemu plików). Potrzebujesz programu `resize2fs`.
</div>
<div data-hint="success">
  Doskonale! Sam `lvextend` powiększa tylko wirtualny kontener, a system plików wymaga dostosowania poprzez `resize2fs` lub wygodną flagę `-r`.
</div>
  </data-quiz>
</data-gate>
