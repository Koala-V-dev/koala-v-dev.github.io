# M3-01 - Raport stanu

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi zebrać minimalny obraz maszyny z kilku komend diagnostycznych.

<data-terminal-mission-scenario id="m3-01-raport-stanu" title="Raport stanu">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin"></dir>
  </world>

  <brief>Masz zebrać szybki raport stanu maszyny: miejsce na dyskach, RAM, urządzenia blokowe, sprzęt i procesy.</brief>

  <objective>W terminalu ma być widoczny zestaw dowodów:

- wynik `df -h`,
- wynik `free -h`,
- wynik `lsblk` albo `lsblk -f`,
- wynik `lshw -short`,
- wynik `top` albo `htop`,
- przynajmniej jeden manual otwarty przez `man`.</objective>

  <assessment min-evidence="2">
    <evidence id="manual-used" label="Użyto `man` do sprawdzenia składni lub sensu komendy.">
      <expect history-command-contains="man"></expect>
      <nudge after="45s">Przed rekonesansem sprawdź przynajmniej jedną komendę przez `man`, np. `man lsblk`.</nudge>
    </evidence>

    <evidence id="storage-seen" label="Sprawdzono zajętość systemów plików.">
      <expect history-command-contains="df" history-contains="Mounted on"></expect>
      <nudge after="45s">Miejsce na zamontowanych systemach plików pokaże `df -h`.</nudge>
    </evidence>

    <condition id="memory-seen" label="Sprawdzono RAM i swap.">
      <expect history-command-contains="free" history-contains="Swap:"></expect>
      <nudge after="45s">RAM i swap sprawdzisz przez `free -h`.</nudge>
    </condition>

    <condition id="block-devices-seen" label="Sprawdzono dyski, partycje i montowania.">
      <expect history-command-contains="lsblk" history-contains="MOUNTPOINTS"></expect>
      <nudge after="45s">Do dysków i partycji użyj `lsblk -f`.</nudge>
    </condition>

    <condition id="hardware-seen" label="Sprawdzono skrócony obraz sprzętu.">
      <expect history-command-contains="lshw" history-contains="Description"></expect>
      <nudge after="45s">Skrócony obraz sprzętu pokaże `sudo lshw -short`.</nudge>
    </condition>

    <condition id="processes-seen" label="Sprawdzono procesy i obciążenie.">
      <expect history-command-contains="top"></expect>
      <nudge after="45s">Procesy pokaże `top` albo `htop`.</nudge>
    </condition>
  </assessment>

  <summary>
    <item>Misja zaliczona: w terminalu jest minimalny raport stanu maszyny.</item>
    <item>Najważniejszy wzorzec: diagnostyka zaczyna się od sprawdzenia faktów, nie od zgadywania przyczyny.</item>
  </summary>
</data-terminal-mission-scenario>
