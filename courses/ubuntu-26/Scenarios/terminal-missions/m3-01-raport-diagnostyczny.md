# M3-01 - Raport diagnostyczny stanowiska

Typ: `terminal-mission`

Cel: samodzielnie przygotować pliki z informacją o stanowisku.

<data-terminal-mission-scenario id="m3-01-raport-diagnostyczny" title="Raport diagnostyczny stanowiska">
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

  <brief>Przygotuj katalog `Raport-INF02` i zapisz w nim dane o stanowisku.<br>
  Raport ma pokazać sprzęt, dyski, pamięć oraz proces związany z obsługą sieci.</brief>

  <objective>Doprowadź do stanu:

- istnieje katalog `Raport-INF02`,
- `sprzet.txt` zawiera modele sprzętu wyciągnięte z raportu `lshw`,
- `dyski.txt` zawiera układ dysków i dopisaną informację o zajętości,
- `pamiec.txt` zawiera RAM i swap,
- `proces-siec.txt` zawiera proces `networkd-dispatcher`,
- w historii widać użycie potoku i zapisu do pliku.</objective>

  <assessment min-evidence="2">
    <evidence id="report-dir" label="Utworzono katalog raportu.">
      <expect exists="Raport-INF02" type="dir"></expect>
    </evidence>

    <condition id="hardware-report" label="Zapisano modele sprzętu.">
      <expect exists="Raport-INF02/sprzet.txt" type="file" file="Raport-INF02/sprzet.txt" file-contains-all="VirtualBox,Intel(R) Core,SVGA II Adapter,VBOX HARDDISK"></expect>
    </condition>

    <condition id="disk-report" label="Zapisano dyski i zajętość miejsca.">
      <expect exists="Raport-INF02/dyski.txt" type="file" file="Raport-INF02/dyski.txt" file-contains-any-set="sda2,ext4,Filesystem,Use%;sda,sda1,sda2,/dev/sda2,40%,/"></expect>
    </condition>

    <condition id="memory-report" label="Zapisano informacje o pamięci.">
      <expect exists="Raport-INF02/pamiec.txt" type="file" file="Raport-INF02/pamiec.txt" file-contains-all="Mem:,Swap:"></expect>
    </condition>

    <condition id="network-process" label="Zapisano proces sieciowy.">
      <expect exists="Raport-INF02/proces-siec.txt" type="file" file="Raport-INF02/proces-siec.txt" file-contains-all="networkd-dispatcher,root"></expect>
    </condition>

    <audit id="pipe-and-redirect" label="Użyto potoku i zapisu do pliku.">
      <expect history-command-contains="|" exists="Raport-INF02/dyski.txt" type="file" file="Raport-INF02/dyski.txt" file-contains-any-set="sda2,ext4,Filesystem,Use%;sda,sda1,sda2,/dev/sda2,40%,/"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Raport gotowy: sprzęt, dyski, pamięć i proces obsługi sieci są zapisane w plikach.</item>
    <item>Użyte narzędzia: `lshw`, `lsblk`, `df`, `free`, `ps`, `grep`, `|`, `>` i `>>`.</item>
  </summary>
</data-terminal-mission-scenario>
