# Udostępnianie plików w sieci Linux za pomocą NFS

Protokół **NFS (Network File System)** to standard sieciowego systemu plików stworzony z myślą o wydajnej komunikacji w środowiskach czysto linuksowych. Pozwala na montowanie zdalnych zasobów dyskowych w taki sposób, jakby znajdowały się one fizycznie na lokalnym komputerze.

---

## 🛠️ Konfiguracja serwera NFS

Na maszynie udostępniającej zasoby (serwerze) instalujemy pakiet `nfs-kernel-server` i definiujemy udostępniane foldery w pliku `/etc/exports`.

Przykładowy wpis w `/etc/exports`:
```text
/mnt/dane_nfs  192.168.1.0/24(rw,sync,no_subtree_check,no_root_squash)
```

### Wyjaśnienie opcji w nawiasie:
* **rw (read-write):** Pozwala klientom na odczyt i zapis w udostępnianym katalogu.
* **sync:** Wymusza natychmiastowy zapis zmian na dysku serwera przed potwierdzeniem operacji klientowi, co zapobiega utracie danych w razie awarii zasilania.
* **no_subtree_check:** Wyłącza sprawdzanie, czy żądany plik znajduje się w poddrzewie wolumenu. Poprawia to wydajność i stabilność połączenia.
* **no_root_squash:** Domyślnie NFS mapuje konto administratora `root` klienta na konto o najniższych uprawnieniach (`nobody`). Ustawienie `no_root_squash` pozwala lokalnemu rootowi klienta zachować pełne prawa roota na udostępnianym zasobie serwera.

Po zmianach w pliku konfiguracyjnym należy przeładować tabelę eksportów:
```bash
sudo exportfs -arv
```

---

## 🔌 Montowanie zasobu u klienta

Na maszynie klienckiej instalujemy pakiet `nfs-common`, tworzymy punkt montowania i podpinamy zdalny zasób:
```bash
sudo mount -t nfs 192.168.1.100:/mnt/dane_nfs /mnt/lokalny_nfs
```
(gdzie `192.168.1.100` to adres IP serwera NFS).

---

## 🛠️ Punkt Kontrolny: Udostępnianie NFS
<data-gate>
  <data-quiz>
    <question>
Która z opcji w pliku /etc/exports pozwala użytkownikowi root na kliencie zachować uprawnienia administratora na udostępnionym udziale serwera?
    </question>
    <options>
      <item correct>no_root_squash</item>
      <item>root_squash</item>
      <item>rw</item>
    </options>

<div data-hint="error">
  Domyślnie NFS zabezpiecza serwer poprzez mapowanie konta roota (tzw. squashing). Aby to wyłączyć, należy użyć opcji z zaprzeczeniem `no_`.
</div>
<div data-hint="success">
  Doskonale! Opcja `no_root_squash` pozwala na zachowanie pełni praw administracyjnych przez klienta, co jest przydatne np. w klastrach obliczeniowych.
</div>
  </data-quiz>
</data-gate>
