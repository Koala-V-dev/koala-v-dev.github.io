# M1-01 - Identyfikacja systemu

Typ: `terminal-tutor`

Cel: odczytać nazwę i wersję Ubuntu oraz nazwę komputera.

<data-terminal-tutor-scenario id="m1-01-mapa-systemu" title="Identyfikacja systemu">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
          <dir name="Dokumenty"></dir>
          <dir name="Pobrane"></dir>
          <dir name="Pulpit"></dir>
          <dir name="Raporty"></dir>
          <file name=".profile" hidden="true"># ~/.profile
export LANG=pl_PL.UTF-8
</file>
          <file name=".bashrc" hidden="true"># ~/.bashrc
export HISTSIZE=2000
export EDITOR=nano
</file>
        </dir>
      </dir>
      <dir name="etc">
        <file name="os-release">PRETTY_NAME="Ubuntu 26.04 LTS"
NAME="Ubuntu"
VERSION_ID="26.04"
VERSION="26.04 LTS (Resolute Raccoon)"
VERSION_CODENAME=resolute
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
UBUNTU_CODENAME=resolute
LOGO=ubuntu-logo
</file>
        <file name="hostname">ubuntu
</file>
        <file name="hosts">127.0.0.1 localhost
127.0.1.1 ubuntu
</file>
      </dir>
      <dir name="usr"></dir>
      <dir name="bin"></dir>
      <dir name="tmp"></dir>
    </dir>
  </world>

  <step id="os-release-cat">
    <teach>Wpisz `cat /etc/os-release`, żeby odczytać nazwę i wersję systemu.</teach>
    <command>cat /etc/os-release</command>
    <run>Ten plik przydaje się przy instalacji pakietów, zgłaszaniu problemu i sprawdzaniu, czy poradnik dotyczy tej wersji Ubuntu.</run>
    <expect command-family="cat" stdout-contains-all="PRETTY_NAME,Ubuntu 26.04 LTS,VERSION_ID,VERSION_CODENAME=resolute,ID=ubuntu"></expect>
    <explain>Wynik mówi, że lab działa na Ubuntu 26.04 LTS. To konkretna informacja o systemie, nie lista katalogów.</explain>
  </step>

  <step id="hostname-cat">
    <teach>Wpisz `cat /etc/hostname`, żeby odczytać nazwę komputera z pliku systemowego.</teach>
    <command>cat /etc/hostname</command>
    <run>Plik jest krótki. Do takiego odczytu `cat` jest wystarczający.</run>
    <expect command-family="cat" stdout="ubuntu"></expect>
    <explain>`/etc/hostname` zawiera nazwę komputera zapisaną w konfiguracji.</explain>
  </step>

  <step id="hostname-command">
    <teach>Wpisz `hostname`, żeby sprawdzić bieżącą nazwę komputera krótszą komendą.</teach>
    <command>hostname</command>
    <run>`hostname` pokazuje nazwę bez podawania ścieżki do pliku.</run>
    <expect command="hostname" stdout="ubuntu"></expect>
    <explain>Wynik jest ten sam: `ubuntu`. Plik pokazuje miejsce zapisu, a komenda daje szybki odczyt.</explain>
  </step>
</data-terminal-tutor-scenario>
