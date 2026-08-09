# M3-01 - Diagnostyka wyników komend

Typ: `terminal-tutor`

Cel: wprowadzić pracę z długim wynikiem komendy diagnostycznej, `less`, `tail`, `grep`, potok i zapis do pliku.

<data-terminal-tutor-scenario id="m3-01-diagnostyka-wynikow" title="Diagnostyka wyników komend">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
          <dir name="Dokumenty"></dir>
          <dir name="Pobrane"></dir>
        </dir>
      </dir>
    </dir>
  </world>

  <step id="lshw-with-warning">
    <teach>Sprawdźmy podstawowe informacje o sprzęcie za pomocą polecenia `lshw`.</teach>
    <command>lshw</command>
    <run>Narzędzie `lshw` odczytuje dane z tabel DMI/SMBIOS oraz magistrali PCI/USB w katalogu `/proc` i `/sys`. Dostęp do niskopoziomowych rejestrów sprzętowych wymaga uprawnień administratora (`root`), dlatego wykonanie komendy bez `sudo` skutkuje komunikatem ostrzegawczym.</run>
    <expect command="lshw" stdout-contains-all="WARNING: you should run this program as super-user.,egzamin-virtualbox,System memory,WARNING: output may be incomplete"></expect>
    <explain>Znakomicie. Polecenie zwróciło dane sprzętowe oraz ostrzeżenie o zredukowanej szczegółowości. To normalny mechanizm kontroli dostępu w systemach Linux.</explain>
  </step>

  <step id="lshw-through-less">
    <teach>Aby wygodnie przejrzeć pełny raport sprzętowy bez zalewania ekranu, przekażmy wynik `sudo lshw` do czytnika `less`. Poprzedzając drugą komendę operatorem potoku `|`. Wyjdziesz z niego klawiszem `q`.</teach>
    <command>sudo lshw | less</command>
    <run>Operator potoku `|` przesyła standardowe wyjście (stdout) komendy `sudo lshw` bezpośrednio na standardowe wejście czytnika `less`. Pozwala to na wygodne przewijanie tekstu w buforze bez użycia myszy.</run>
    <expect command="sudo lshw | less" stdout-contains-all="product: VirtualBox,serial: VirtualBox,logical name: /dev/sda,logical name: enp0s3"></expect>
    <explain>Bardzo dobrze! Podniesienie uprawnień dało pełny opis urządzeń, a przeglądarka `less` umożliwiła czytelny wgląd przed powrotem do prompta.</explain>
  </step>

  <step id="save-user-lshw">
    <teach>Zapiszmy wyjście z `lshw` do pliku `LSHW` za pomocą przekierowania `>`.</teach>
    <command>lshw > LSHW</command>
    <run>Operator przekierowania `>` tworzy wskazany plik (lub nadpisuje istniejący) i kieruje do niego cały strumień wyjściowy. Przechwytywane są również nagłówkowe komunikaty ostrzegawcze.</run>
    <expect exists="LSHW" type="file" file="LSHW" file-contains-all="WARNING: you should run this program as super-user.,egzamin-virtualbox,WARNING: output may be incomplete"></expect>
    <explain>Świetnie. Plik `LSHW` został utworzony. Zawiera podstawowy odczyt wraz ze zgłoszonym w terminalu ostrzeżeniem.</explain>
  </step>

  <step id="save-admin-lshw">
    <teach>Teraz zapiszmy pełny raport administratora z `sudo lshw` do pliku `adminLSHW`.</teach>
    <command>sudo lshw > adminLSHW</command>
    <run>Przekierowanie `>` działa po wygenerowaniu pełnego strumienia przez `sudo lshw`. Powstały plik zawiera szczegółowe dane o numerach seryjnych, magistralach PCI i wolumenach dyskowych.</run>
    <expect exists="adminLSHW" type="file" file="adminLSHW" file-contains-all="product: VirtualBox,serial: VirtualBox-23f4d7c7,product: VBOX HARDDISK,logical name: /dev/sda2"></expect>
    <explain>Znakomicie. Plik `adminLSHW` zawiera pełne metadane sprzętowe bez ostrzeżeń o ograniczeniach dostępu.</explain>
  </step>

  <step id="tail-admin-lshw">
    <teach>Zobaczmy same ostatnie 12 linii pliku `adminLSHW` przy użyciu polecenia `tail -n 12 adminLSHW`.</teach>
    <command>tail -n 12 adminLSHW</command>
    <run>Polecenie `tail` służy do odczytywania określonej liczby linii z końca pliku (domyślnie 10, lub wg flagi `-n`). Jest to standardowy sposób kontroli najnowszych wpisów w logach i raportach.</run>
    <expect command="tail -n 12 adminLSHW" stdout-contains-all="EXT4 volume,logical name: /,VirtualBox USB Tablet"></expect>
    <explain>Doskonale. Wyświetlona końcówka raportu potwierdza obecność woluminu systemowego EXT4 oraz urządzeń wejściowych.</explain>
  </step>

  <step id="grep-products-to-file">
    <teach>Wybierzmy z pliku `adminLSHW` tylko linie ze słowem `product` i zapiszmy je w pliku `modele.txt` poleceniem `grep product adminLSHW > modele.txt`.</teach>
    <command>grep product adminLSHW > modele.txt</command>
    <run>Narzędzie `grep` przeczesuje plik w poszukiwaniu wskazanego wzorca tekstowego (`product`). Przefiltrowany strumień zostaje przekierowany i zapisany do nowego pliku `modele.txt`.</run>
    <expect exists="modele.txt" type="file" file="modele.txt" file-contains-all="VirtualBox,12th Gen Intel(R) Core(TM) i7-12700F,SVGA II Adapter,VBOX HARDDISK"></expect>
    <explain>Świetnie! Zamiast ręcznie przeszukiwać setki linii tekstu, od razu zapisałeś zwięzłą listę wykrytych modeli w pliku `modele.txt`.</explain>
  </step>

  <step id="save-disks">
    <teach>Zapiszmy układ dysków, partycji i systemów plików z `lsblk -f` do pliku `dyski.txt`.</teach>
    <command>lsblk -f > dyski.txt</command>
    <run>Polecenie `lsblk -f` prezentuje drzewiastą strukturę dysków, partycji, punktów montowania oraz unikalne identyfikatory UUID i typy plików (np. EXT4, squashfs).</run>
    <expect exists="dyski.txt" type="file" file="dyski.txt" file-contains-all="loop0,squashfs,sda2,ext4,/"></expect>
    <explain>Znakomicie. Wynik działania `lsblk -f` został zapisany w pliku `dyski.txt`, tworząc pierwszą część zestawienia pamięci masowej.</explain>
  </step>

  <step id="append-space">
    <teach>Dopiszmy informacje o wolnym miejscu z `df -h` na końcu pliku `dyski.txt` za pomocą operatora `>>`.</teach>
    <command>df -h >> dyski.txt</command>
    <run>Użycie operatora `>>` dołącza nowe linie z wyjścia `df -h` na końcu pliku `dyski.txt` bez niszczenia wcześniej zapisanej struktury z `lsblk`.</run>
    <expect file="dyski.txt" file-contains-all="Filesystem,Use%,/dev/sda2,/run/user/1000"></expect>
    <explain>Bardzo dobrze! Plik `dyski.txt` zawiera teraz zarówno strukturę partycji, jak i czytelne zestawienie zajętości przestrzeni.</explain>
  </step>

  <step id="save-memory">
    <teach>Zapiszmy stan pamięci RAM i swap z `free -h` do pliku `pamiec.txt`.</teach>
    <command>free -h > pamiec.txt</command>
    <run>Narzędzie `free` z flagą `-h` (*human-readable*) prezentuje wartości pamięci całkowitej, użytej, wolnej oraz buforów w mebi- i gibibajtach (MiB/GiB).</run>
    <expect exists="pamiec.txt" type="file" file="pamiec.txt" file-contains-all="Mem:,Swap:,1.6Gi,2.0Gi"></expect>
    <explain>Świetnie. Raport pamięci operacyjnej oraz swap trafił do pliku `pamiec.txt`.</explain>
  </step>

  <step id="top-snapshot">
    <teach>Sprawdźmy obciążenie systemu i aktywne procesy za pomocą polecenia `top`.</teach>
    <command>top</command>
    <run>Program `top` jest konsolowym menedżerem zadań w czasie rzeczywistym. Pokazuje średnie obciążenie (*load average*), wykorzystanie CPU, pamięć oraz listę najaktywniejszych procesów.</run>
    <expect command="top" stdout-contains-all="load average,MiB Mem,gnome-shell,ptyxis"></expect>
    <explain>Znakomicie. Zobaczyłeś stop klatkę (w realnym systemie te dane są dynamicznie aktualizowane co 3 sekundy) i zestawienie podsumowujące aktualną konsumpcję zasobów przez procesy.</explain>
  </step>

  <step id="htop-snapshot">
    <teach>Zobaczmy bardziej czytelny podgląd procesów uruchamiając narzędzie `htop`.</teach>
    <command>htop</command>
    <run>Narzędzie `htop` rozwija możliwości `top` o kolorowe paski zużycia rdzeni CPU, pamięci, drzewo procesów oraz wygodniejszą nawigację klawiaturą.</run>
    <expect command="htop" stdout-contains-all="Tasks:,Load average:,gnome-shell,networkd-dispatcher"></expect>
    <explain>Doskonale. Wyświetliłeś zaawansowany podgląd procesów systemowych. To jest dalej stop klatka (w realnym systemie te dane są dynamicznie aktualizowane co 1 sekundę)</explain>
  </step>

  <step id="filter-processes">
    <teach>Przefiltrujmy listę procesów pod kątem słowa `gnome` i zapiszmy wynik w pliku `procesy-gnome.txt` poleceniem `ps -ef | grep gnome > procesy-gnome.txt`.</teach>
    <command>ps -ef | grep gnome > procesy-gnome.txt</command>
    <run>Komenda `ps -ef` pobiera wykaz wszystkich procesów systemowych. Potok `|` przekazuje je do filtrowania w `grep gnome`, a operator `>` tworzy docelowy plik `procesy-gnome.txt`.</run>
    <expect exists="procesy-gnome.txt" type="file" file="procesy-gnome.txt" file-contains-all="egzamin,gnome-shell"></expect>
    <explain>Gratulacje! Zrealizowałeś pełny cykl diagnostyczny: odczyt, filtrowanie przez potok i trwały zapis do pliku.</explain>
  </step>
</data-terminal-tutor-scenario>
