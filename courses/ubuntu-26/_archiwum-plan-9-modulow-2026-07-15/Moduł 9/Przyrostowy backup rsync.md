# Przyrostowy backup za pomocą rsync

Kopie zapasowe to jedyny ratunek w przypadku awarii sprzętowej lub ataku ransomware. Dobry system backupu powinien być szybki i zajmować minimalną ilość miejsca. W środowisku Linux idealnym narzędziem do tego celu jest **rsync**, który pozwala na tworzenie wydajnych kopii przyrostowych.

---

## 🛠️ Podstawy rsync i zachowanie metadanych

Program `rsync` synchronizuje pliki między dwoma katalogami lokalnymi lub zdalnymi za pomocą protokołu SSH. Przesyła tylko te części plików, które uległy zmianie (delta transfer), co drastycznie oszczędza pasmo sieciowe.

Podstawowe polecenie synchronizacji z zachowaniem uprawnień i linków:
```bash
rsync -aHAXx --delete /home/kamil/ /mnt/backup/kamil/
```

### Wyjaśnienie kluczowych flag:
* `-a` (archive): Bardzo ważny tryb archiwum. Włącza rekurencję oraz zachowuje czas modyfikacji, właściciela, grupę oraz podstawowe prawa dostępu.
* `-H` (hard-links): Zachowuje twarde dowiązania.
* `-A` (acls): Kopiuje zaawansowane listy kontroli dostępu ACL.
* `-X` (xattrs): Kopiuje atrybuty rozszerzone plików.
* `-x` (one-file-system): Zapobiega przechodzeniu przez granice systemów plików (np. nie skopiuje zamontowanego pod `/home/kamil/mnt` zewnętrznego dysku sieciowego NFS).
* `--delete`: Usuwa z katalogu docelowego te pliki, które zostały usunięte w katalogu źródłowym (tworzy lustrzaną kopię).

---

## 🔄 Wydajny backup przyrostowy: --link-dest

Aby nie kopiować niepotrzebnie gigabajtów niezmienionych danych każdego dnia, rsync pozwala na tworzenie kopii przyrostowych z wykorzystaniem **twardych linków (hard links)**.

```bash
rsync -a --delete --link-dest=/mnt/backup/wczoraj /home/kamil/ /mnt/backup/dzis
```

* **Jak to działa?** Rsync porównuje pliki w `/home/kamil` z wczorajszą kopią w `/mnt/backup/wczoraj`. Jeśli plik nie uległ zmianie, rsync nie kopiuje go na dysk. Zamiast tego tworzy w `/mnt/backup/dzis` twardy link wskazujący na ten sam sektor na dysku, co wczorajsza kopia. Pliki zmienione lub nowe są kopiowane fizycznie.
* **Efekt:** Każdy dzienny folder wygląda jak pełny backup, ale fizycznie zajmuje na dysku tylko tyle miejsca, ile wynosi suma nowych i zmodyfikowanych plików z danego dnia.

---

## 🛠️ Punkt Kontrolny: Backup rsync
<data-gate>
  <data-quiz>
    <question>
Jaka flaga w poleceniu rsync pozwala na tworzenie kopii przyrostowych poprzez tworzenie twardych linków do plików z poprzedniego backupu?
    </question>
    <options>
      <item correct>--link-dest</item>
      <item>--delete</item>
      <item>-H</item>
    </options>

<div data-hint="error">
  Parametr ten określa ścieżkę przeznaczenia (destination) do porównania i tworzenia dowiązań (link).
</div>
<div data-hint="success">
  Świetnie! Opcja `--link-dest` pozwala tworzyć w pełni funkcjonalne kopie przyrostowe o minimalnym narzucie na przestrzeń dyskową.
</div>
  </data-quiz>
</data-gate>
