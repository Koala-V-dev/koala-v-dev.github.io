# M1-02 - Odzyskaj plan

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi odtworzyć utracony plik z kopii i potwierdzić treść.

<data-terminal-mission-scenario id="m1-02-odzyskaj-plan" title="Odzyskaj plan">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Projekt"></dir>
      <dir name="Backup">
        <file name="plan.txt">Plan porządkowania:
- zebrać notatki w katalogu Projekt
- zrobić kopię przed usuwaniem
- sprawdzić treść kopii
</file>
      </dir>
    </dir>
  </world>

  <brief>Plik `Projekt/plan.txt` zniknął. W katalogu `Backup` została kopia.<br>
  Odtwórz plik do projektu i potwierdź jego treść.</brief>

  <objective>Doprowadź system do stanu:

- istnieje `Projekt/plan.txt`,
- istnieje `Backup/plan.txt`,
- odtworzony plik zawiera frazę `zrobić kopię przed usuwaniem`,
- w terminalu widać audyt katalogu `Projekt` i odczyt treści pliku.</objective>

  <assessment min-evidence="2">
    <evidence id="project-seen" label="Sprawdzono katalog `Projekt`.">
      <expect observed-path="/home/egzamin/Projekt"></expect>
    </evidence>

    <evidence id="backup-seen" label="Sprawdzono katalog `Backup`.">
      <expect observed-path="/home/egzamin/Backup"></expect>
    </evidence>

    <condition id="file-restored" label="Plik `Projekt/plan.txt` został odtworzony.">
      <expect exists="/home/egzamin/Projekt/plan.txt" file="/home/egzamin/Projekt/plan.txt" file-contains-all="zrobić kopię przed usuwaniem"></expect>
    </condition>

    <condition id="backup-left" label="Kopia `Backup/plan.txt` nadal istnieje.">
      <expect exists="/home/egzamin/Backup/plan.txt" file="/home/egzamin/Backup/plan.txt" file-contains-all="sprawdzić treść kopii"></expect>
    </condition>

    <audit id="final-project-audit" label="W terminalu widać audyt katalogu `Projekt`.">
      <expect observed-path="/home/egzamin/Projekt" history-contains="plan.txt"></expect>
    </audit>

    <audit id="final-content-audit" label="W terminalu widać treść odtworzonego pliku.">
      <expect observed-file="/home/egzamin/Projekt/plan.txt" history-contains="zrobić kopię przed usuwaniem"></expect>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: plik został odtworzony z kopii, a kopia źródłowa nadal istnieje.</item>
    <item>Kopia, odtworzenie i audyt treści są jednym cyklem.</item>
  </summary>
</data-terminal-mission-scenario>
