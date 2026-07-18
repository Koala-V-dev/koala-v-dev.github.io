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
    <teach>Uruchom `lshw`. Bez `sudo` komenda działa, ale sama ostrzega, że wynik może być niepełny.</teach>
    <command>lshw</command>
    <run>To normalne zachowanie Ubuntu: zwykły użytkownik dostaje część danych i ostrzeżenie.</run>
    <expect command="lshw" stdout-contains-all="WARNING: you should run this program as super-user.,egzamin-virtualbox,System memory,WARNING: output may be incomplete"></expect>
    <explain>To nie jest błąd składni. `lshw` pokazało dane, ale uczciwie mówi, że pełniejszy odczyt wymaga uprawnień administratora.</explain>
  </step>

  <step id="lshw-through-less">
    <teach>Uruchom pełniejszy odczyt przez `sudo lshw | less`. W widoku `less` przewijasz wynik, a `q` wraca do prompta.</teach>
    <command>sudo lshw | less</command>
    <run>Potok `|` przekazuje wynik `sudo lshw` do `less`.</run>
    <expect command="sudo lshw | less" stdout-contains-all="product: VirtualBox,serial: VirtualBox,logical name: /dev/sda,logical name: enp0s3"></expect>
    <explain>`sudo` daje pełniejszy raport, a `less` pozwala go obejrzeć bez zalania prompta.</explain>
  </step>

  <step id="save-user-lshw">
    <teach>Zapisz niepełny wynik do pliku przez `lshw > LSHW`.</teach>
    <command>lshw > LSHW</command>
    <run>Nie używasz `touch`. Sam zapis `>` tworzy plik, jeżeli go jeszcze nie ma.</run>
    <expect exists="LSHW" type="file" file="LSHW" file-contains-all="WARNING: you should run this program as super-user.,egzamin-virtualbox,WARNING: output may be incomplete"></expect>
    <explain>Plik `LSHW` zawiera także ostrzeżenia, bo zapisałeś dokładnie to, co komenda wypisała na ekran.</explain>
  </step>

  <step id="save-admin-lshw">
    <teach>Zapisz pełniejszy wynik do pliku przez `sudo lshw > adminLSHW`.</teach>
    <command>sudo lshw > adminLSHW</command>
    <run>`sudo` uruchamia odczyt z uprawnieniami administratora. `>` zapisuje wynik do pliku od nowa.</run>
    <expect exists="adminLSHW" type="file" file="adminLSHW" file-contains-all="product: VirtualBox,serial: VirtualBox-23f4d7c7,product: VBOX HARDDISK,logical name: /dev/sda2"></expect>
    <explain>Teraz raport ma więcej danych: BIOS, numer seryjny maszyny wirtualnej, dysk i partycje.</explain>
  </step>

  <step id="tail-admin-lshw">
    <teach>Pokaż końcówkę pełniejszego raportu przez `tail -n 12 adminLSHW`.</teach>
    <command>tail -n 12 adminLSHW</command>
    <run>`tail` czyta koniec pliku. Przy długim raporcie szybko sprawdzasz ostatnie sekcje.</run>
    <expect command="tail -n 12 adminLSHW" stdout-contains-all="EXT4 volume,logical name: /,VirtualBox USB Tablet"></expect>
    <explain>Końcówka raportu pokazuje ostatnie wykryte elementy: wolumin systemowy i urządzenie wejściowe.</explain>
  </step>

  <step id="grep-products-to-file">
    <teach>Wytnij linie z modelami przez `grep product adminLSHW > modele.txt`.</teach>
    <command>grep product adminLSHW > modele.txt</command>
    <run>`grep product` zostawia tylko linie z tekstem `product`, a `>` zapisuje je do pliku.</run>
    <expect exists="modele.txt" type="file" file="modele.txt" file-contains-all="VirtualBox,12th Gen Intel(R) Core(TM) i7-12700F,SVGA II Adapter,VBOX HARDDISK"></expect>
    <explain>Nie przepisujesz całego raportu. Bierzesz tylko linie z modelami.</explain>
  </step>

  <step id="save-disks">
    <teach>Zapisz dyski i systemy plików przez `lsblk -f > dyski.txt`.</teach>
    <command>lsblk -f > dyski.txt</command>
    <run>`lsblk -f` pokazuje urządzenia blokowe, systemy plików i punkty montowania.</run>
    <expect exists="dyski.txt" type="file" file="dyski.txt" file-contains-all="loop0,squashfs,sda2,ext4,/"></expect>
    <explain>W Ubuntu Desktop zobaczysz też pętle `loop` od pakietów snap. Dla dysku systemowego najważniejsze są `sda`, `sda1`, `sda2` i punkt montowania `/`.</explain>
  </step>

  <step id="append-space">
    <teach>Dopisz informacje o miejscu przez `df -h >> dyski.txt`.</teach>
    <command>df -h >> dyski.txt</command>
    <run>`>>` dopisuje wynik na końcu pliku zamiast kasować poprzednią zawartość.</run>
    <expect file="dyski.txt" file-contains-all="Filesystem,Use%,/dev/sda2,/run/user/1000"></expect>
    <explain>Jeden plik może zawierać wynik kilku komend, jeżeli składasz raport.</explain>
  </step>

  <step id="save-memory">
    <teach>Zapisz stan pamięci przez `free -h > pamiec.txt`.</teach>
    <command>free -h > pamiec.txt</command>
    <run>`free -h` pokazuje RAM i swap w czytelnych jednostkach.</run>
    <expect exists="pamiec.txt" type="file" file="pamiec.txt" file-contains-all="Mem:,Swap:,1.6Gi,2.0Gi"></expect>
    <explain>To szybki zapis informacji o RAM i swapie.</explain>
  </step>

  <step id="top-snapshot">
    <teach>Uruchom `top`, żeby zobaczyć migawkę obciążenia i procesów.</teach>
    <command>top</command>
    <run>W prawdziwym terminalu `top` działa interaktywnie. W labie pokazuje statyczną migawkę.</run>
    <expect command="top" stdout-contains-all="load average,MiB Mem,gnome-shell,ptyxis"></expect>
    <explain>`top` pokazuje obciążenie CPU, pamięć i procesy z najważniejszymi kolumnami.</explain>
  </step>

  <step id="htop-snapshot">
    <teach>Uruchom `htop`, żeby porównać czytelniejszy widok procesów.</teach>
    <command>htop</command>
    <run>`htop` pokazuje podobny stan, ale w praktyce jest wygodniejszy do szybkiego przeglądu.</run>
    <expect command="htop" stdout-contains-all="Tasks:,Load average:,gnome-shell,networkd-dispatcher"></expect>
    <explain>`top` i `htop` służą do oglądania procesu i obciążenia, nie do zapisu raportu tekstowego.</explain>
  </step>

  <step id="filter-processes">
    <teach>Zapisz procesy GNOME przez `ps -ef | grep gnome > procesy-gnome.txt`.</teach>
    <command>ps -ef | grep gnome > procesy-gnome.txt</command>
    <run>`ps -ef` daje listę procesów, `grep gnome` zostawia pasujące linie, a `>` zapisuje wynik.</run>
    <expect exists="procesy-gnome.txt" type="file" file="procesy-gnome.txt" file-contains-all="egzamin,gnome-shell"></expect>
    <explain>To ten sam schemat pracy: szeroki wynik, filtr, plik.</explain>
  </step>
</data-terminal-tutor-scenario>
