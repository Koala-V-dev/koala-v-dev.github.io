# M1-03 - Czytanie plików i logów

Typ: `terminal-tutor`

Cel: wprowadzić `less`, `tail` i `grep` dopiero wtedy, gdy lekcja dotyczy dłuższego tekstu i logów.

<data-terminal-tutor-scenario id="m1-03-czytanie-logow" title="Czytanie plików i logów">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
          <dir name="Dokumenty"></dir>
          <dir name="Pobrane"></dir>
        </dir>
      </dir>
      <dir name="var">
        <dir name="log">
          <file name="syslog">1999-05-30 21:36:58 ubuntu systemd[1]: Starting user session for egzamin.
1999-05-30 21:37:00 ubuntu systemd[1]: Started user session for egzamin.
1999-05-30 21:37:03 ubuntu NetworkManager[712]: INFO device enp0s3 connected.
1999-05-30 21:37:04 ubuntu NetworkManager[712]: INFO connectivity check passed.
1999-05-30 21:37:09 ubuntu gdm-password][981]: INFO session opened for user egzamin.
1999-05-30 21:37:14 ubuntu gnome-shell[1102]: INFO extension ubuntu-dock loaded.
1999-05-30 21:37:18 ubuntu tracker-miner[1180]: INFO indexing /home/egzamin/Dokumenty.
1999-05-30 21:38:02 ubuntu apt-helper[1401]: INFO checking archive.ubuntu.local.
1999-05-30 21:38:12 ubuntu updater[1440]: ERROR repository metadata expired.
1999-05-30 21:38:24 ubuntu updater[1440]: INFO retry scheduled in 60 seconds.
1999-05-30 21:39:03 ubuntu systemd[1]: Started daily apt download activity.
1999-05-30 21:39:31 ubuntu snapd[802]: INFO refresh check started.
1999-05-30 21:40:05 ubuntu updater[1440]: ERROR mirror timeout for archive.ubuntu.local.
1999-05-30 21:40:21 ubuntu NetworkManager[712]: INFO DNS server set to 10.0.2.3.
1999-05-30 21:40:44 ubuntu cups[1600]: INFO printer queue empty.
1999-05-30 21:41:08 ubuntu gnome-shell[1102]: WARNING extension tiling-popup disabled by user.
1999-05-30 21:41:37 ubuntu apt-helper[1401]: INFO retrying archive.ubuntu.local.
1999-05-30 21:42:06 ubuntu updater[1440]: ERROR retry failed for archive.ubuntu.local.
1999-05-30 21:42:30 ubuntu systemd[1]: Started log rotation check.
1999-05-30 21:43:01 ubuntu tracker-miner[1180]: INFO indexing finished.
</file>
          <file name="auth.log">1999-05-30 21:36:58 ubuntu gdm-password][981]: pam_unix(gdm-password:session): session opened for user egzamin
1999-05-30 21:38:44 ubuntu sudo: egzamin : TTY=pts/0 ; PWD=/home/egzamin ; USER=root ; COMMAND=/usr/bin/apt update
1999-05-30 21:38:44 ubuntu sudo: pam_unix(sudo:session): session opened for user root by egzamin(uid=1000)
1999-05-30 21:39:20 ubuntu sudo: pam_unix(sudo:session): session closed for user root
1999-05-30 21:41:55 ubuntu sshd[1551]: Invalid user admin from 192.168.56.50 port 51102
1999-05-30 21:42:01 ubuntu sshd[1551]: Failed password for invalid user admin from 192.168.56.50 port 51102 ssh2
1999-05-30 21:42:05 ubuntu sshd[1551]: Failed password for invalid user admin from 192.168.56.50 port 51103 ssh2
1999-05-30 21:42:06 ubuntu sshd[1551]: Connection closed by invalid user admin 192.168.56.50 port 51103
1999-05-30 21:43:12 ubuntu gdm-password][981]: pam_unix(gdm-password:session): session closed for user egzamin
</file>
        </dir>
      </dir>
    </dir>
  </world>

  <step id="less-syslog">
    <teach>Wpisz `less /var/log/syslog`, żeby przeczytać dłuższy log systemowy bez edycji pliku.</teach>
    <command>less /var/log/syslog</command>
    <run>To pierwszy krok z logiem. Najpierw oglądasz układ wpisów, jeszcze bez filtrowania.</run>
    <expect command-family="less" stdout-contains-all="NetworkManager,updater,ERROR,WARNING"></expect>
    <explain>Wpis logu ma czas, nazwę hosta, proces i komunikat. Jeden plik miesza informacje, ostrzeżenia i błędy.</explain>
  </step>

  <step id="tail-log">
    <teach>Wpisz `tail -n 8 /var/log/syslog`, żeby zobaczyć osiem ostatnich zdarzeń z logu systemowego.</teach>
    <command>tail -n 8 /var/log/syslog</command>
    <run>Przy logach często zaczynasz od końca pliku, bo tam są najnowsze wpisy.</run>
    <expect command-family="tail" stdout-contains-all="WARNING extension tiling-popup,ERROR retry failed,indexing finished"></expect>
    <explain>Końcówka logu pokazuje najnowszy błąd aktualizatora, ostrzeżenie z GNOME i późniejsze wpisy informacyjne.</explain>
  </step>

  <step id="grep-error">
    <teach>Wpisz `grep ERROR /var/log/syslog`, żeby zostawić tylko błędy z logu systemowego.</teach>
    <command>grep ERROR /var/log/syslog</command>
    <run>`grep` filtruje tekst. Nie naprawia problemu. Zawęża wynik do linii pasujących do pytania.</run>
    <expect command-family="grep" stdout-contains-all="repository metadata expired,mirror timeout,retry failed"></expect>
    <explain>Zostały trzy wpisy błędów. Wszystkie dotyczą aktualizacji i mirrora `archive.ubuntu.local`.</explain>
  </step>

  <step id="grep-auth-failed">
    <teach>Wpisz `grep "Failed password" /var/log/auth.log`, żeby znaleźć nieudane logowania.</teach>
    <command>grep "Failed password" /var/log/auth.log</command>
    <run>Zdarzenia logowania sprawdzasz w `auth.log`, bo to log autoryzacji.</run>
    <expect command-family="grep" stdout-contains-all="Failed password,admin,192.168.56.50,51102,51103"></expect>
    <explain>Widać dwie próby na konto `admin` z adresu `192.168.56.50`. Masz konto, adres, usługę `sshd`, czas i port.</explain>
  </step>
</data-terminal-tutor-scenario>
