# M2-02 - Uprawnienia katalogu

Typ: `terminal-tutor`

Cel: wprowadzić `ls -l`, `chown`, `chmod`, `chgrp` i audyt uprawnień katalogu.

<data-terminal-tutor-scenario id="m2-02-uprawnienia-katalogu" title="Uprawnienia katalogu">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
        </dir>
      </dir>
      <dir name="srv" owner="root" group="root" mode="755">
        <dir name="Projekt" owner="egzamin" group="egzamin" mode="755">
          <file name="plan.txt" owner="egzamin" group="egzamin" mode="644">Zakres prac serwisowych.
</file>
        </dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
    <accounts>
      <account name="technik" group="technik" home="/home/technik" groups="technik,audyt" password-set="true"></account>
    </accounts>
  </world>

  <step id="ls-before">
    <teach>`ls -l` pokazuje prawa, właściciela i grupę. Sprawdź stan katalogu `/srv/Projekt` przed zmianą.</teach>
    <command>ls -l /srv</command>
    <run>Sprawdź obecny stan katalogu `/srv/Projekt`.</run>
    <expect command-family="ls" options-include="l" stdout-contains="Projekt"></expect>
    <explain>Katalog należy jeszcze do `egzamin:egzamin` i ma tryb `755`.</explain>
  </step>

  <step id="chown-project-owner">
    <teach>`chown` zmienia właściciela. Ustaw właściciela na użytkownika `technik` dla katalogu `/srv/Projekt`.</teach>
    <command>sudo chown technik /srv/Projekt</command>
    <run>Ustaw właściciela katalogu.</run>
    <expect command-family="sudo" path-owner="/srv/Projekt:technik"></expect>
    <explain>Właścicielem katalogu jest teraz `technik`. Grupa nadal wymaga osobnej zmiany.</explain>
  </step>

  <step id="chgrp-project">
    <teach>`chgrp` zmienia grupę przypisaną do pliku albo katalogu. Przypisz grupę `audyt` do katalogu `/srv/Projekt`.</teach>
    <command>sudo chgrp audyt /srv/Projekt</command>
    <run>Ustaw grupę katalogu.</run>
    <expect command-family="sudo" path-group="/srv/Projekt:audyt"></expect>
    <explain>Katalog ma właściciela `technik` i grupę `audyt`.</explain>
  </step>

  <step id="chmod-project">
    <teach>`chmod 750` ustawia prawa katalogu: właściciel `rwx`, grupa `r-x`, pozostali `---`.</teach>
    <command>sudo chmod 750 /srv/Projekt</command>
    <run>Ustaw prawa katalogu `/srv/Projekt` na `750`.</run>
    <expect command-family="sudo" path-mode="/srv/Projekt:750"></expect>
    <explain>Pozostali użytkownicy nie mają dostępu do katalogu.</explain>
  </step>

  <step id="ls-after">
    <teach>Po zmianie dostępu sprawdź wynik. Audyt ma pokazać właściciela, grupę i prawa w jednej linii.</teach>
    <command>ls -l /srv</command>
    <run>Sprawdź końcowy stan katalogu `/srv/Projekt`.</run>
    <expect command-family="ls" options-include="l" stdout-contains-all="drwxr-x---,technik,audyt,Projekt"></expect>
    <explain>Stan końcowy jest poprawny: `technik audyt` i prawa `rwxr-x---`.</explain>
  </step>

  <step id="su-technik">
    <teach>`su - technik` otwiera sesję jako użytkownik `technik`. Sprawdź dostęp z konta, które jest właścicielem katalogu.</teach>
    <command>su - technik</command>
    <run>Przełącz sesję na użytkownika `technik`.</run>
    <expect command="su - technik" session-user="technik"></expect>
    <explain>Prompt działa teraz jako `technik`. To osobna sesja w tym terminalu.</explain>
  </step>

  <step id="cd-as-technik">
    <teach>Wejdź do katalogu `/srv/Projekt` jako `technik`.</teach>
    <command>cd /srv/Projekt</command>
    <run>Sprawdź, czy właściciel może wejść do katalogu.</run>
    <expect command="cd /srv/Projekt" cwd="/srv/Projekt"></expect>
    <explain>`technik` może wejść do katalogu, bo właściciel ma `rwx`.</explain>
  </step>

  <step id="exit-technik">
    <teach>`exit` kończy sesję otwartą przez `su` i wraca do poprzedniego użytkownika.</teach>
    <command>exit</command>
    <run>Wróć do sesji użytkownika `egzamin`.</run>
    <expect command="exit" session-user="egzamin"></expect>
    <explain>Jesteś z powrotem jako `egzamin`.</explain>
  </step>
</data-terminal-tutor-scenario>
