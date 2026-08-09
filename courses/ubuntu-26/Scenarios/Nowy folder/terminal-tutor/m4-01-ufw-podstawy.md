# M4-01 - UFW podstawy

Typ: `terminal-tutor`

Cel: wprowadzić `ufw status`, `ufw enable`, `ufw allow`, `ufw delete` i audyt stanu zapory.

<data-terminal-tutor-scenario id="m4-01-ufw-podstawy" title="UFW podstawy">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin"></dir>
  </world>

  <step id="man-ufw">
    <teach>`man ufw` daje składnię podstawowych operacji zapory. W tym module używamy tylko małego, bezpiecznego wycinka.</teach>
    <command>man ufw</command>
    <run>Otwórz manual komendy `ufw`.</run>
    <expect command-family="man" stdout-contains-all="ufw,SKŁADNIA"></expect>
    <explain>Manual pokazuje status, włączanie, reguły i usuwanie reguł.</explain>
  </step>

  <step id="status-initial">
    <teach>`sudo ufw status` pokazuje, czy zapora jest aktywna. Na starcie labu jest nieaktywna.</teach>
    <command>sudo ufw status</command>
    <run>Sprawdź stan zapory.</run>
    <expect command-family="sudo" stdout-contains="Status: inactive"></expect>
    <explain>Zapora jest nieaktywna. To stan, który trzeba znać przed zmianą reguł.</explain>
  </step>

  <step id="enable">
    <teach>`sudo ufw enable` włącza zaporę. Na zdalnym serwerze najpierw trzeba przemyśleć dostęp SSH; tutaj pracujemy lokalnie w labie.</teach>
    <command>sudo ufw enable</command>
    <run>Włącz zaporę.</run>
    <expect command-family="sudo" ufw-enabled="true"></expect>
    <explain>Zapora jest aktywna.</explain>
  </step>

  <step id="allow-ssh">
    <teach>`sudo ufw allow 22/tcp` dopuszcza ruch TCP na porcie 22. To przykład portu SSH, ale pełny temat SSH zostaje na kurs serwerowy.</teach>
    <command>sudo ufw allow 22/tcp</command>
    <run>Dodaj regułę testową dla portu `22/tcp`.</run>
    <expect command-family="sudo" ufw-rule="allow:22/tcp"></expect>
    <explain>Reguła została dodana.</explain>
  </step>

  <step id="status-rule">
    <teach>Po zmianie reguł zawsze robisz audyt przez `status`.</teach>
    <command>sudo ufw status</command>
    <run>Sprawdź aktywną zaporę i reguły.</run>
    <expect command-family="sudo" stdout-contains-all="Status: active,22/tcp,ALLOW"></expect>
    <explain>W statusie widać aktywną zaporę i regułę dla `22/tcp`.</explain>
  </step>

  <step id="delete-rule">
    <teach>`sudo ufw delete allow 22/tcp` usuwa konkretną regułę. To ważne przy sprzątaniu po testach.</teach>
    <command>sudo ufw delete allow 22/tcp</command>
    <run>Usuń regułę testową.</run>
    <expect command-family="sudo" ufw-rule-missing="allow:22/tcp"></expect>
    <explain>Reguła testowa została usunięta.</explain>
  </step>

  <step id="status-final">
    <teach>Kończysz audytem. Zapora ma zostać aktywna, ale bez testowej reguły.</teach>
    <command>sudo ufw status</command>
    <run>Sprawdź końcowy stan zapory.</run>
    <expect command-family="sudo" ufw-enabled="true" ufw-rule-missing="allow:22/tcp" stdout-contains="Status: active"></expect>
    <explain>Stan końcowy jest uporządkowany: zapora działa, a reguła testowa nie została zostawiona.</explain>
  </step>
</data-terminal-tutor-scenario>
