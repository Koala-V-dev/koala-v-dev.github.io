# M4-01 - Reguła testowa UFW

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń rozumie cykl dodania, audytu i usunięcia reguły zapory.

<data-terminal-mission-scenario id="m4-01-regula-testowa-ufw" title="Reguła testowa UFW">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin"></dir>
  </world>

  <brief>Włącz zaporę UFW, dodaj regułę testową `allow 22/tcp`, potwierdź ją w statusie, a potem usuń. Na końcu zapora ma być aktywna bez reguły testowej.</brief>

  <objective>Doprowadź system do stanu:

- UFW jest aktywne,
- reguła `allow 22/tcp` została dodana i była widoczna w terminalu,
- reguła `allow 22/tcp` została usunięta,
- końcowy status zapory został sprawdzony.</objective>

  <assessment min-evidence="2">
    <evidence id="manual-or-status" label="Sprawdzono składnię albo stan początkowy UFW.">
      <expect history-command-contains="ufw status"></expect>
      <nudge after="45s">Zacznij od `sudo ufw status`, żeby wiedzieć, od jakiego stanu startujesz.</nudge>
    </evidence>

    <evidence id="rule-observed" label="Reguła `22/tcp` była widoczna w statusie.">
      <expect history-contains="22/tcp,ALLOW"></expect>
      <nudge after="45s">Po dodaniu reguły uruchom `sudo ufw status`, żeby ją zobaczyć.</nudge>
    </evidence>

    <condition id="firewall-enabled" label="Zapora UFW jest aktywna.">
      <expect ufw-enabled="true"></expect>
      <nudge after="45s">Zapora ma być włączona przez `sudo ufw enable`.</nudge>
    </condition>

    <condition id="test-rule-removed" label="Reguła testowa `allow 22/tcp` nie istnieje w stanie końcowym.">
      <expect ufw-rule-missing="allow:22/tcp" history-command-contains="ufw delete allow 22/tcp"></expect>
      <nudge after="45s">Regułę testową usuń przez `sudo ufw delete allow 22/tcp`.</nudge>
    </condition>

    <audit id="final-status" label="W terminalu widać końcowy status aktywnej zapory.">
      <expect history-command-contains="ufw status" history-contains="Status: active"></expect>
      <nudge after="45s">Po usunięciu reguły jeszcze raz sprawdź `sudo ufw status`.</nudge>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: UFW jest aktywne, a reguła testowa została usunięta po audycie.</item>
    <item>Najważniejszy wzorzec: regułę zapory dodajesz, sprawdzasz i sprzątasz, jeżeli była tylko testem.</item>
  </summary>
</data-terminal-mission-scenario>
