# M1-01 - Pakiet orientacyjny

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi porównać notatkę instalacyjną ze stanem systemu.

<data-terminal-mission-scenario id="m1-01-pakiet-orientacyjny" title="Pakiet orientacyjny">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
          <dir name="Dokumenty"></dir>
          <dir name="Pobrane">
            <file name="notatka-instalacyjna.txt">Maszyna po instalacji:
system: Ubuntu 26.04 LTS (Resolute Raccoon)
host: ubuntu
</file>
          </dir>
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
    </dir>
  </world>

  <brief>W `Pobrane` leży notatka po instalacji maszyny.<br>
  Sprawdź, czy zapisane tam dane zgadzają się z rzeczywistym systemem.</brief>

  <objective>Doprowadź do stanu rozpoznania:

- odczytano notatkę `Pobrane/notatka-instalacyjna.txt`,
- odczytano `/etc/os-release`,
- w terminalu widać `Ubuntu 26.04 LTS (Resolute Raccoon)`,
- sprawdzono nazwę komendą `hostname`.</objective>

  <assessment min-evidence="2">
    <evidence id="install-note-read" label="Odczytano notatkę instalacyjną.">
      <expect observed-file="/home/egzamin/Pobrane/notatka-instalacyjna.txt" history-contains="Resolute Raccoon,host: ubuntu"></expect>
    </evidence>

    <evidence id="os-release-read" label="Odczytano wersję Ubuntu.">
      <expect observed-file="/etc/os-release" history-contains="Ubuntu 26.04 LTS,Resolute Raccoon,VERSION_ID,resolute"></expect>
    </evidence>

    <condition id="hostname-command-used" label="Sprawdzono nazwę komendą `hostname`.">
      <expect history-command="hostname" history-contains="ubuntu"></expect>
    </condition>
  </assessment>

  <summary>
    <item>Misja zaliczona: notatka instalacyjna zgadza się ze stanem systemu.</item>
    <item>Zakres jest celowo wąski: `cat` do krótkich plików i `hostname` do szybkiej nazwy komputera.</item>
    <item>To jest ten sam typ sprawdzenia, który robisz przed użyciem poradnika, zgłoszeniem problemu albo opisaniem środowiska.</item>
  </summary>
</data-terminal-mission-scenario>
