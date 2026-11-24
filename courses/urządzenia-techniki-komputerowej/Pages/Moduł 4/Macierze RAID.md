# Macierze RAID

Cztery dyski po 2 TB mają pomieścić ponad 4 TB i przetrwać awarię jednego dysku. Które układy spełniają oba warunki?

## 🧮 Paski lustra i parzystość

**Striping** rozdziela kolejne porcje danych między dyski. **Lustro** trzyma ich kopie na osobnych dyskach. **Parzystość** pozwala odtworzyć brakujące dane z informacji o całym pasku.

| Poziom | Minimum dysków | Pojemność dla jednakowych dysków | Tolerancja awarii |
| --- | --- | --- | --- |
| RAID 0 | 2 | wszystkie dyski | żadna |
| RAID 1, dwie kopie | 2 | pojemność jednego dysku w parze | jeden dysk w parze |
| RAID 5 | 3 | pojemność wszystkich poza jednym | jeden dysk |
| RAID 6 | 4 | pojemność wszystkich poza dwoma | dwa dyski |
| RAID 10, pary luster | 4 | połowa sumy | co najmniej jeden, więcej przy zachowaniu dysku w każdej parze |

Przy jednakowych dyskach 2 TB RAID 5 daje teoretycznie 6 TB przed narzutami, RAID 6 i 10 po 4 TB. W układach z różnymi dyskami przyjmij do prostych obliczeń wielkość najmniejszego członka. Po awarii układ może pracować w stanie zdegradowanym. Odbudowa ponownie wykorzystuje pozostałe dyski. Usunięty plik może zniknąć ze wszystkich kopii w macierzy, dlatego potrzebujesz osobnej kopii zapasowej.

## 🧪 Odczytaj plik z macierzy po awarii dysku

Użyj maszyny wirtualnej z Linuksem, narzędziem **mdadm** i trzema pustymi dyskami wirtualnymi na macierz RAID 5. Dysk systemowy maszyny zostaje osobno. Przygotuj czwarty pusty dysk wirtualny do odbudowy. Pracuj wyłącznie wewnątrz maszyny, bez przekazywania jej dysków hosta. Przed utworzeniem macierzy rozpoznaj wszystkie urządzenia przez **lsblk**. Poniższe nazwy są przykładowe. [Instrukcja mdadm](https://manpages.debian.org/trixie/mdadm/mdadm.8.en.html).

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
# Przykład po potwierdzeniu, że vdb, vdc i vdd to puste dyski ćwiczeniowe.
sudo mdadm --create /dev/md0 --level=5 --raid-devices=3 /dev/vdb /dev/vdc /dev/vdd
cat /proc/mdstat
```

1. Po zakończeniu synchronizacji utwórz system plików na **macierzy** poleceniem `sudo mkfs.ext4 /dev/md0`. Utwórz katalog `/mnt/raid-lab` i zamontuj w nim macierz przez `sudo mount /dev/md0 /mnt/raid-lab`. Skopiuj tam własny plik testowy przez `sudo cp`. Oblicz jego SHA-256 przez `sha256sum` i zachowaj wynik poza macierzą.
2. Wyświetl `sudo mdadm --detail /dev/md0`. Z listy aktywnych członków wybierz jeden dysk ćwiczeniowy. Dla **vdc** oznaczenie awarii i usunięcie z macierzy wykonasz poleceniem `sudo mdadm /dev/md0 --fail /dev/vdc --remove /dev/vdc`. Odczytaj stan macierzy. Odmontuj system plików i zamontuj go ponownie, żeby kolejny odczyt nie korzystał z poprzedniej kopii pliku w pamięci podręcznej. Ponownie oblicz SHA-256 pliku. Zapisz, czy nadal można go odczytać i czy skrót się zgadza.
3. Dodaj pusty dysk zastępczy, np. `sudo mdadm /dev/md0 --add /dev/vde`, po potwierdzeniu jego nazwy w **lsblk**. W **/proc/mdstat** obserwuj odbudowę. Gdy dobiegnie końca, sprawdź liczbę aktywnych członków i jeszcze raz porównaj skrót pliku.

| Etap | Stan macierzy | Aktywne dyski | SHA-256 pliku |
| --- | --- | --- | --- |
| Przed awarią | | | |
| Po utracie jednego dysku | | | |
| Po odbudowie | | | |

Zgodny skrót po awarii oznacza, że macierz nadal udostępnia treść sprawdzanego pliku. Odbudowa przywraca nadmiarowość. W RAID 5 awaria drugiego członka przed zakończeniem odbudowy przekracza tolerancję układu. W RAID 10 z parami **1 i 2** oraz **3 i 4** utrata dysków 1 i 3 zostawia po kopii w każdej parze. Utrata dysków 1 i 2 usuwa obie kopie jednej części danych. [Stany macierzy Linux MD](https://docs.kernel.org/admin-guide/md.html).

## 📏 Dobierz pojemność i tolerancję awarii

Masz 6 dysków po 4 TB i potrzebujesz co najmniej 15 TB przed narzutem. Układ ma przetrwać awarię dowolnych dwóch dysków. Wybierz poziom i policz pojemność.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

RAID 6 daje (6 - 2) × 4 TB = 16 TB. RAID 10 dałby 12 TB, a utrata dwóch dysków z jednej pary może uniemożliwić odczyt.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Odzyskiwanie brakującego bajtu przez XOR</span> <span class="deep-dive-badge">ALGEBRA BOOLEA</span></summary>
<div class="deep-dive-content">

W modelowym pasku `A = 0x39`, `B = 0xA5`, a parzystość `P = A ^ B = 0x9C`. Jeśli zabraknie B, `0x39 ^ 0x9C` daje `0xA5`. Wynika to z reguł `x ^ x = 0` i `x ^ 0 = x`. Jedno równanie XOR nie określi dwóch nieznanych bajtów. RAID 6 potrzebuje dwóch niezależnych informacji nadmiarowych. Przy przerwanym zapisie osobnym problemem jest zgodność parzystości z danymi. [Dokumentacja bufora RAID w Linux MD](https://docs.kernel.org/driver-api/md/raid5-cache.html).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oblicz pojemność i sprawdź konkretne kombinacje awarii. Oddziel odporność na awarię od możliwości odzyskania skasowanego pliku.

