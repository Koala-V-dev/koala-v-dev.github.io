# M2-02 - Katalog projektu

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi ustawić właściciela, grupę i prawa katalogu oraz potwierdzić stan przez listing.

<data-terminal-mission-scenario id="m2-02-katalog-projektu" title="Katalog projektu">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
        </dir>
      </dir>
      <dir name="srv" owner="root" group="root" mode="755">
        <dir name="Projekt-Wsparcie" owner="egzamin" group="egzamin" mode="755">
          <file name="plan.txt" owner="egzamin" group="egzamin" mode="644">Zakres prac wsparcia technicznego.
</file>
        </dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
    <accounts>
      <account name="operator" group="operator" home="/home/operator" groups="operator,wsparcie" password-set="true"></account>
      <account name="gosc" group="gosc" home="/home/gosc" groups="gosc" password-set="true"></account>
    </accounts>
  </world>

  <brief>Katalog `Projekt-Wsparcie` ma zostać przekazany użytkownikowi `operator` i grupie `wsparcie`.<br>
  Dostęp dla pozostałych kont ma zostać odcięty i sprawdzony z osobnej sesji.</brief>

  <objective>Doprowadź katalog `/srv/Projekt-Wsparcie` do stanu:

- właściciel: `operator`,
- grupa: `wsparcie`,
- tryb: `750`,
- w terminalu widać audyt przez `ls -l`,
- w osobnej sesji `operator` może wejść do katalogu,
- konto `gosc` nie może wejść do katalogu.</objective>

  <assessment min-evidence="1">
    <evidence id="before-seen" label="Sprawdzono stan katalogu przed zmianą.">
      <expect history-command-contains="ls -l"></expect>
    </evidence>

    <evidence id="identity-ready" label="Użytkownik `operator` i grupa `wsparcie` istnieją w scenariuszu.">
      <expect user="operator" group="wsparcie"></expect>
    </evidence>

    <condition id="owner-set" label="Katalog `Projekt-Wsparcie` należy do użytkownika `operator`.">
      <expect path-owner="/srv/Projekt-Wsparcie:operator"></expect>
    </condition>

    <condition id="group-set" label="Katalog `Projekt-Wsparcie` ma grupę `wsparcie`.">
      <expect path-group="/srv/Projekt-Wsparcie:wsparcie"></expect>
    </condition>

    <condition id="mode-set" label="Katalog `Projekt-Wsparcie` ma tryb `750`.">
      <expect path-mode="/srv/Projekt-Wsparcie:750"></expect>
    </condition>

    <audit id="final-ls-audit" label="W terminalu widać końcowy audyt przez `ls -l`.">
      <expect history-contains="drwxr-x---,operator,wsparcie,Projekt-Wsparcie"></expect>
    </audit>

    <audit id="operator-session-audit" label="Sprawdzono dostęp z sesji użytkownika `operator`.">
      <expect history-user-command="operator:cd /srv/Projekt-Wsparcie"></expect>
    </audit>

    <audit id="guest-denied-audit" label="Sprawdzono odmowę dostępu dla konta `gosc`.">
      <expect history-user-command="gosc:cd /srv/Projekt-Wsparcie" history-contains="Permission denied"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: katalog `Projekt-Wsparcie` ma właściciela `operator`, grupę `wsparcie` i tryb `750`.</item>
    <item>Najważniejszy wzorzec: właściciel, grupa, prawa i test z właściwej sesji muszą zgadzać się razem.</item>
  </summary>
</data-terminal-mission-scenario>
