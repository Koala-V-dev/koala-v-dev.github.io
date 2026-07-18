# M1-03 - Ślad w logach

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi czytać log pytaniem i użyć `grep` bez potoków.

<data-terminal-mission-scenario id="m1-03-slad-w-logach" title="Ślad w logach">
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

  <brief>Znajdź ślad nieudanego logowania i błędy aktualizatora.<br>
  Użyj `less`, `tail` i `grep`. Potoki zostają na następną lekcję.</brief>

  <objective>Doprowadź do stanu rozpoznania:

- odczytano `syslog`,
- pokazano końcówkę `syslog`,
- w `syslog` znaleziono błędy aktualizatora,
- w `auth.log` znaleziono próby logowania na konto `admin`,
- w historii terminala widać adres `192.168.56.50`.</objective>

  <assessment min-evidence="2">
    <evidence id="syslog-read" label="Odczytano `syslog`.">
      <expect observed-file="/var/log/syslog" history-command-contains="less /var/log/syslog"></expect>
      <nudge after="45s">Najpierw obejrzyj log systemowy: `less /var/log/syslog`.</nudge>
    </evidence>

    <evidence id="syslog-tail" label="Pokazano końcówkę `syslog`.">
      <expect observed-file="/var/log/syslog" history-command-contains="tail"></expect>
      <nudge after="45s">Najnowsze wpisy są na końcu. Użyj `tail -n 8 /var/log/syslog`.</nudge>
    </evidence>

    <condition id="syslog-errors-found" label="Znaleziono błędy w `syslog`.">
      <expect observed-file="/var/log/syslog" history-contains-all="ERROR,archive.ubuntu.local"></expect>
      <nudge after="45s">W `syslog` szukasz błędów aktualizatora. `grep ERROR /var/log/syslog` da konkretny wynik.</nudge>
    </condition>

    <condition id="auth-admin-found" label="Znaleziono próby logowania na konto `admin`.">
      <expect observed-file="/var/log/auth.log" history-contains-all="Failed password,admin"></expect>
      <nudge after="45s">Ślad logowania jest w `auth.log`. Szukaj frazy `Failed password`.</nudge>
    </condition>

    <condition id="source-address-found" label="W historii terminala widać adres `192.168.56.50`.">
      <expect history-contains="192.168.56.50"></expect>
      <nudge after="45s">Wpis o błędzie logowania zawiera adres źródłowy.</nudge>
    </condition>
  </assessment>

  <summary>
    <item>Misja zaliczona: log systemowy i log autoryzacji zostały sprawdzone.</item>
    <item>Masz ślad: konto `admin`, adres `192.168.56.50`, usługa `sshd`.</item>
    <item>Na tym etapie nie liczysz jeszcze wyników potokiem. Najpierw czytasz i filtrujesz.</item>
  </summary>
</data-terminal-mission-scenario>
