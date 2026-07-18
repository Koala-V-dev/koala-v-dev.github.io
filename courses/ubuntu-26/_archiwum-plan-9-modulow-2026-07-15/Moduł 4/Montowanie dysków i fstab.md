# Montowanie dysków i konfiguracja fstab

W systemie Linux nowe nośniki nie otrzymują automatycznie liter napędów (jak `C:` czy `D:` w Windowsie). Zamiast tego muszą zostać podpięte pod określony katalog w głównym drzewie plików. Proces ten nazywamy **montowaniem**.

---

## 🛠️ Montowanie ręczne i plik /etc/fstab

Do jednorazowego zamontowania partycji służy polecenie `mount` (np. `mount /dev/sdb1 /mnt/dane`). Aby partycje były montowane automatycznie przy każdym rozruchu, konfigurujemy plik `/etc/fstab`.

Przykładowy wpis w `/etc/fstab`:
```text
UUID=a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d  /mnt/bezpieczny  ext4  defaults,noexec,nosuid,nodev  0  2
```

### Anatomia wpisu:
1. **Identyfikator urządzenia:** Zamiast nietrwałych nazw urządzeń (np. `/dev/sdb1`, które mogą ulec zmianie po przepięciu portu na płycie głównej), używamy stałego unikalnego identyfikatora **UUID**.
2. **Punkt montowania:** Katalog docelowy (np. `/mnt/bezpieczny`).
3. **Typ systemu plików:** np. `ext4`, `xfs`, `btrfs`.
4. **Opcje montowania:** Flagi sterujące zachowaniem systemu plików.
5. **Dump:** Parametr dla programu kopii zapasowej (zazwyczaj ustawiony na $0$).
6. **Fsck:** Kolejność sprawdzania dysku przy starcie systemu ($1$ dla głównej partycji `/`, $2$ dla pozostałych partycji, $0$ wyłącza sprawdzanie).

---

## 🔒 Flagi bezpieczeństwa w opcjach montowania

Dla dysków przenośnych lub folderów przechowujących wyłącznie dane użytkowników (np. `/home`) zaleca się ograniczenie uprawnień za pomocą flag bezpieczeństwa:

* **noexec:** Blokuje możliwość uruchamiania jakichkolwiek plików wykonywalnych z poziomu tego systemu plików. Zapobiega to bezpośredniemu odpaleniu pobranych z sieci złośliwych skryptów.
* **nosuid:** Ignoruje bity SUID i SGID na tym wolumenie, co chroni przed eskalacją uprawnień do konta roota przez spreparowane pliki wykonywalne.
* **nodev:** Blokuje interpretowanie plików znakowych lub blokowych urządzeń (znajdujących się zazwyczaj w `/dev`). Chroni to przed próbami ominięcia zabezpieczeń systemu poprzez ręczne tworzenie plików urządzeń dyskowych.

---

## 🛠️ Punkt Kontrolny: Montowanie i fstab
<data-gate>
  <data-quiz>
    <question>
Która z opcji montowania w pliku /etc/fstab uniemożliwi uruchomienie programu wykonywalnego na danym wolumenie, nawet jeśli posiada on uprawnienia chmod +x?
    </question>
    <options>
      <item correct>noexec</item>
      <item>nosuid</item>
      <item>nodev</item>
    </options>

<div data-hint="error">
  Skrót ten pochodzi bezpośrednio od angielskiego słowa określającego wykonywanie/uruchamianie plików (execution).
</div>
<div data-hint="success">
  Świetnie! Flaga `noexec` to bardzo proste i zarazem potężne narzędzie podnoszące bezpieczeństwo serwera lub stacji roboczej.
</div>
  </data-quiz>
</data-gate>
