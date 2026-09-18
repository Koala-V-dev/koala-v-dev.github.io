# M2-01 - Konto operatora

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi samodzielnie utworzyć inne konto lokalne, grupę i audyt.

<data-terminal-mission-scenario id="m2-01-konto-operatora" title="Konto operatora">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin"></dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
  </world>

  <brief>Przygotuj lokalne konto `operator` dla osoby wspierającej pracę przy stacji.<br>
  Konto ma mieć katalog domowy, ustawione hasło i należeć do grupy `wsparcie`.</brief>

  <objective>Doprowadź system do stanu:

- istnieje użytkownik `operator`,
- istnieje katalog `/home/operator`,
- użytkownik `operator` ma ustawione hasło,
- istnieje grupa `wsparcie`,
- `operator` należy do grupy `wsparcie`,
- w terminalu widać audyt konta przez `id operator` albo `groups operator`,
- w terminalu widać wpis nowego konta przez `getent passwd operator`.</objective>

  <assessment min-evidence="2">
    <evidence id="identity-seen" label="Sprawdzono własną tożsamość przed użyciem `sudo`.">
      <expect history-command-contains="whoami,id"></expect>
    </evidence>

    <evidence id="account-db-seen" label="Sprawdzono wpis nowego konta przez `getent`.">
      <expect history-command-contains="getent passwd operator"></expect>
    </evidence>

    <condition id="user-created" label="Istnieje użytkownik `operator` i katalog `/home/operator`.">
      <expect user="operator" home-exists="operator"></expect>
    </condition>

    <condition id="password-set" label="Użytkownik `operator` ma ustawione hasło.">
      <expect password-set="operator"></expect>
    </condition>

    <condition id="group-ready" label="Istnieje grupa `wsparcie`, a `operator` do niej należy.">
      <expect group="wsparcie" user-in-group="operator:wsparcie"></expect>
    </condition>

    <audit id="final-id-audit" label="W terminalu widać audyt konta `operator`.">
      <expect history-command-contains="id operator"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: konto `operator` istnieje, ma katalog domowy, hasło i grupę `wsparcie`.</item>
    <item>Po operacji z `sudo` stan został potwierdzony przez `id` i `getent`.</item>
  </summary>
</data-terminal-mission-scenario>
