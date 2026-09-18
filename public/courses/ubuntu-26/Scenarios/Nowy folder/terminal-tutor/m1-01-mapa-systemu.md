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
    <teach>Odczytanie tożsamości systemu operacyjnego wymaga podglądu pliku konfiguracyjnego `/etc/os-release` za pomocą polecenia `cat`.</teach>
    <command>cat /etc/os-release</command>
    <run>Plik `/etc/os-release` zawiera zestaw zmiennych środowiskowych opisujących dystrybucję (np. nazwę kodową, wersję LTS oraz identyfikator). Jest to uniwersalny standard przyjęty przez większość dystrybucji Linux.</run>
    <expect command-family="cat" stdout-contains-all="PRETTY_NAME,Ubuntu 26.04 LTS,VERSION_ID,VERSION_CODENAME=resolute,ID=ubuntu"></expect>
    <explain>Doskonale. Z zawartości pliku wynika jasno, że pracujesz na systemie Ubuntu 26.04 LTS (Resolute Raccoon).</explain>
  </step>

  <step id="hostname-cat">
    <teach>Nazwa sieciowa maszyny zapisana jest w pliku `/etc/hostname`. Wyświetl jego zawartość za pomocą narzędzia `cat`.</teach>
    <command>cat /etc/hostname</command>
    <run>Plik `/etc/hostname` jest wczytywany przez system podczas rozruchu. Zmiana jego zawartości po ponownym uruchomieniu zmienia sieciowy identyfikator komputera.</run>
    <expect command-family="cat" stdout="ubuntu"></expect>
    <explain>Świetnie. Plik zwrócił wartość `ubuntu` – to podstawowa nazwa sieciowa przypisana do tego środowiska.</explain>
  </step>

  <step id="hostname-command">
    <teach>Bieżącą nazwę maszyny można odczytać bezpośrednio poleceniem `hostname`, bez odwoływania się do ścieżki pliku.</teach>
    <command>hostname</command>
    <run>Narzędzie `hostname` odpytuje jądro systemu o aktualnie ustawioną nazwę węzła (nodename). Służy nie tylko do odczytu, ale z odpowiednimi uprawnieniami również do tymczasowej zmiany nazwy.</run>
    <expect command="hostname" stdout="ubuntu"></expect>
    <explain>Znakomicie! Otrzymaliśmy ten sam wynik: `ubuntu`. Odczyt ze wskazanego pliku ujawnia konfigurację na dysku, a polecenie daje błyskawiczny wgląd z pamięci systemowej.</explain>
  </step>
</data-terminal-tutor-scenario>
