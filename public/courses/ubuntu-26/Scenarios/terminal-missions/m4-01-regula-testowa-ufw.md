# M4-01 - Wymiana reguły SSH bez utraty dostępu

Typ: `terminal-mission`

Cel: Zastąpić nieaktualną regułę SSH bez tworzenia przerwy w dostępie administracyjnym i bez naruszenia pozostałych reguł zapory.

<data-terminal-mission-scenario id="m4-01-regula-testowa-ufw" title="Wymiana reguły SSH">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin"></dir>
    <firewall enabled="true">
      <rule action="allow" target="from 192.168.50.30 to any port 22 proto tcp"></rule>
      <rule action="allow" target="443/tcp"></rule>
    </firewall>
  </world>

  <brief>VM1 otrzymała nowy adres `192.168.50.10`. Aktywna zapora VM2 nadal zezwala na SSH ze starego adresu `192.168.50.30`. Serwis HTTPS na `443/tcp` musi pozostać dostępny.<br><br>Zmień zakres dostępu SSH bez chwili, w której nie istnieje żadna poprawna reguła administracyjna. Usuń nieaktualny wpis po numerze z bieżącej listy.</brief>

  <objective>Doprowadź zaporę do stanu:

- UFW pozostaje aktywne,
- SSH jest dozwolone z `192.168.50.10`,
- reguła SSH dla `192.168.50.30` nie istnieje,
- reguła `443/tcp` pozostaje bez zmian,
- stan końcowy został sprawdzony.</objective>

  <assessment min-evidence="2">
    <evidence id="initial-audit" label="Przed zmianą wyświetlono numerowaną listę wszystkich reguł.">
      <expect history-command-order="ufw status numbered;ufw allow from 192.168.50.10"></expect>
    </evidence>

    <evidence id="safe-replacement" label="Nową regułę SSH dodano przed usunięciem starej.">
      <expect history-command-order="ufw allow from 192.168.50.10 to any port 22 proto tcp;ufw delete"></expect>
    </evidence>

    <condition id="firewall-enabled" label="Zapora UFW pozostaje aktywna.">
      <expect ufw-enabled="true"></expect>
    </condition>

    <condition id="new-ssh-rule" label="SSH jest dozwolone z nowego adresu VM1.">
      <expect ufw-rule="allow:from 192.168.50.10 to any port 22 proto tcp"></expect>
    </condition>

    <condition id="old-ssh-rule-removed" label="Nieaktualna reguła SSH została usunięta.">
      <expect ufw-rule-missing="allow:from 192.168.50.30 to any port 22 proto tcp" history-command-pattern="ufw delete"></expect>
    </condition>

    <condition id="https-preserved" label="Reguła HTTPS pozostała bez zmian.">
      <expect ufw-rule="allow:443/tcp"></expect>
    </condition>

    <audit id="final-status" label="Po usunięciu starej reguły ponownie sprawdzono numerowaną listę.">
      <expect history-command-order="ufw delete;ufw status numbered" history-contains="Status: active,22/tcp,192.168.50.10,443/tcp"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: nowy adres VM1 ma dostęp do SSH, a stary wpis został usunięty.</item>
    <item>Reguła HTTPS pozostała bez zmian. Nowe zezwolenie SSH powstało przed usunięciem poprzedniego.</item>
  </summary>
</data-terminal-mission-scenario>
