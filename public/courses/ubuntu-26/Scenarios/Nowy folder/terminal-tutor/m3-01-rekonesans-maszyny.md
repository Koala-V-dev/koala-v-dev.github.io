# M3-01 - Rekonesans maszyny

Typ: `terminal-tutor`

Cel: wprowadzić `df`, `free`, `lsblk`, `lshw`, `top`, `htop` i lokalne manuale.

<data-terminal-tutor-scenario id="m3-01-rekonesans-maszyny" title="Rekonesans maszyny">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin"></dir>
  </world>

  <step id="man-df">
    <teach>Przed użyciem komendy diagnostycznej warto znać pytanie, na które odpowiada. `man df` pokazuje, że chodzi o systemy plików, nie o surowe dyski.</teach>
    <command>man df</command>
    <run>Otwórz manual komendy `df`.</run>
    <expect command-family="man" stdout-contains-all="df,systemów plików"></expect>
    <explain>`df` odpowiada na pytanie o zajętość zamontowanych systemów plików.</explain>
  </step>

  <step id="df">
    <teach>`df -h` pokazuje zajętość w czytelnych jednostkach. Najszybciej patrzysz na `/` i kolumnę `Use%`.</teach>
    <command>df -h</command>
    <run>Sprawdź zajętość systemów plików.</run>
    <expect command-family="df" stdout-contains-all="Filesystem,Mounted on,/"></expect>
    <explain>Masz obraz miejsca na głównym systemie plików i zamontowanych nośnikach.</explain>
  </step>

  <step id="free">
    <teach>`free -h` pokazuje RAM i swap. Kolumna `available` mówi więcej o realnym zapasie pamięci niż sama kolumna `free`.</teach>
    <command>free -h</command>
    <run>Sprawdź pamięć RAM i swap.</run>
    <expect command-family="free" stdout-contains-all="Mem:,Swap:,available"></expect>
    <explain>System ma pamięć używaną, wolną, cache i swap. To normalne, że Linux używa RAM jako cache.</explain>
  </step>

  <step id="lsblk">
    <teach>`lsblk -f` pokazuje dyski, partycje, systemy plików i punkty montowania.</teach>
    <command>lsblk -f</command>
    <run>Sprawdź urządzenia blokowe z systemami plików.</run>
    <expect command-family="lsblk" stdout-contains-all="NAME,FSTYPE,MOUNTPOINTS"></expect>
    <explain>Widzisz, który nośnik jest systemowy, a który jest podpięty jako dodatkowy.</explain>
  </step>

  <step id="lshw">
    <teach>`lshw -short` daje skrócony obraz sprzętu. Używamy `sudo`, bo część danych sprzętowych wymaga uprawnień administratora.</teach>
    <command>sudo lshw -short</command>
    <run>Wyświetl skrócony obraz sprzętu.</run>
    <expect command-family="sudo" stdout-contains-all="Class,Description,disk,network"></expect>
    <explain>To szybki widok: pamięć, CPU, dyski i sieć.</explain>
  </step>

  <step id="top">
    <teach>`top` pokazuje procesy i obciążenie. W labie dostajesz statyczny zrzut zamiast pełnoekranowego programu.</teach>
    <command>top</command>
    <run>Wyświetl zrzut procesów przez `top`.</run>
    <expect command-family="top" stdout-contains-all="load average,COMMAND"></expect>
    <explain>Masz szybki obraz obciążenia CPU, pamięci i procesów.</explain>
  </step>

  <step id="htop">
    <teach>`htop` jest wygodniejszym widokiem procesów. W prawdziwym Ubuntu może wymagać instalacji pakietu.</teach>
    <command>htop</command>
    <run>Wyświetl zrzut procesów przez `htop`.</run>
    <expect command-family="htop" stdout-contains-all="Tasks,Command"></expect>
    <explain>To ten sam obszar diagnostyki, ale w bardziej czytelnym układzie.</explain>
  </step>
</data-terminal-tutor-scenario>
