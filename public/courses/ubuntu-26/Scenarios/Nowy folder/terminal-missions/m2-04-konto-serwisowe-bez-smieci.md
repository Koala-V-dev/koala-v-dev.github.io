# M2-04 - Konto serwisowe bez śmieci

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń umie przygotować konto robocze, zweryfikować je i usunąć zasoby testowe.

<data-terminal-mission-scenario id="m2-04-konto-serwisowe-bez-smieci" title="Konto serwisowe bez śmieci">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin"></dir>
        <dir name="tymczasowy"></dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
    <accounts>
      <account name="tymczasowy" group="testowa" home="/home/tymczasowy" groups="testowa" password-set="false"></account>
    </accounts>
  </world>

  <brief>Masz przygotować konto `raport` do dalszych ćwiczeń i posprzątać konto testowe `tymczasowy` oraz grupę `testowa`.</brief>

  <objective>Doprowadź system do stanu:

- istnieje grupa `operatorzy`,
- istnieje użytkownik `raport` z katalogiem `/home/raport`,
- `raport` ma ustawione hasło i należy do grupy `operatorzy`,
- użytkownik `tymczasowy`, katalog `/home/tymczasowy` i grupa `testowa` nie istnieją,
- w terminalu widać audyt przez `id`, `groups` albo `getent`.</objective>

  <assessment min-evidence="2">
    <evidence id="manual-seen" label="Sprawdzono manual jednej komendy do zarządzania kontami.">
      <expect history-command-contains="man"></expect>
    </evidence>

    <evidence id="audit-before" label="Obejrzano istniejące konto lub grupę testową.">
      <expect history-contains="tymczasowy"></expect>
    </evidence>

    <condition id="operatorzy-created" label="Grupa `operatorzy` istnieje.">
      <expect group="operatorzy"></expect>
    </condition>

    <condition id="raport-created" label="Użytkownik `raport` istnieje i ma katalog domowy.">
      <expect user="raport" home-exists="raport"></expect>
    </condition>

    <condition id="raport-password" label="Konto `raport` ma ustawione hasło.">
      <expect password-set="raport"></expect>
    </condition>

    <condition id="raport-group" label="Konto `raport` należy do grupy `operatorzy`.">
      <expect user-in-group="raport:operatorzy"></expect>
    </condition>

    <condition id="temporary-user-removed" label="Użytkownik `tymczasowy` i jego katalog domowy zostały usunięte.">
      <expect user-missing="tymczasowy" missing="/home/tymczasowy" history-command-contains="deluser"></expect>
    </condition>

    <condition id="temporary-group-removed" label="Grupa `testowa` została usunięta.">
      <expect group-missing="testowa" history-command-contains="groupdel"></expect>
    </condition>

    <audit id="final-account-audit" label="W terminalu widać końcowy audyt konta `raport`.">
      <expect history-contains="raport,operatorzy"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: konto `raport` jest gotowe, a testowe konto i grupa zostały usunięte.</item>
    <item>Najważniejszy wzorzec: konto, hasło, grupa i katalog domowy sprawdzasz jako jeden stan.</item>
  </summary>
</data-terminal-mission-scenario>
