# M3-02 - Spakuj raport

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi przygotować i zweryfikować archiwum z katalogu raportu.

<data-terminal-mission-scenario id="m3-02-spakuj-raport" title="Spakuj raport">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Raport">
        <file name="system.txt">Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p2   58G   18G   37G  33% /
</file>
        <file name="pamiec.txt">Mem: 7.8Gi used 2.1Gi available 5.2Gi
</file>
        <file name="dyski.txt">nvme0n1
|-nvme0n1p1 /boot/efi
`-nvme0n1p2 /
</file>
      </dir>
    </dir>
  </world>

  <brief>W katalogu `Raport` leżą wyniki rekonesansu. Przygotuj archiwum tar i ZIP, a tar zweryfikuj przez listowanie zawartości.</brief>

  <objective>Doprowadź system do stanu:

- istnieje `raport.tar`,
- istnieje `raport.zip`,
- archiwum tar zostało sprawdzone przez `tar -tf`,
- w terminalu widać, że w archiwum są pliki `system.txt`, `pamiec.txt` i `dyski.txt`.</objective>

  <assessment min-evidence="2">
    <evidence id="source-seen" label="Sprawdzono zawartość katalogu `Raport`.">
      <expect observed-path="/home/egzamin/Raport" history-contains="system.txt,pamiec.txt,dyski.txt"></expect>
    </evidence>

    <evidence id="manual-used" label="Sprawdzono manual `tar` albo `zip`.">
      <expect history-command-contains="man"></expect>
    </evidence>

    <condition id="tar-created" label="Utworzono archiwum `raport.tar`.">
      <expect exists="raport.tar"></expect>
    </condition>

    <condition id="zip-created" label="Utworzono archiwum `raport.zip`.">
      <expect exists="raport.zip"></expect>
    </condition>

    <audit id="tar-listed" label="Sprawdzono zawartość archiwum tar.">
      <expect history-command-contains="tar -tf" history-contains="Raport/system.txt,Raport/pamiec.txt,Raport/dyski.txt"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: raport został spakowany do tar i ZIP, a zawartość tar została sprawdzona.</item>
    <item>Najważniejszy wzorzec: archiwum bez audytu zawartości nie jest gotowym pakietem.</item>
  </summary>
</data-terminal-mission-scenario>
