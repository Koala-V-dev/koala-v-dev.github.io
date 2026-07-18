# M1-02 - Kopia i odtworzenie

Typ: `terminal-tutor`

Cel: wprowadzić `cp`, różnicę między kopią a przeniesieniem oraz minimalny cykl odtworzenia pliku.

<data-terminal-tutor-scenario id="m1-02-kopia-i-odtworzenie" title="Kopia i odtworzenie">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Projekt">
        <file name="plan.txt">Plan porządkowania:
- zebrać notatki w katalogu Projekt
- zrobić kopię przed usuwaniem
- sprawdzić treść kopii
</file>
      </dir>
      <dir name="Backup"></dir>
    </dir>
  </world>

  <step id="inspect-project">
    <teach>Sprawdź katalog `Projekt`, zanim zrobisz kopię.</teach>
    <command>ls Projekt</command>
    <run>Źródłem pracy jest `Projekt/plan.txt`.</run>
    <expect command-family="ls" stdout-contains="plan.txt"></expect>
    <explain>Plik źródłowy istnieje: `Projekt/plan.txt`.</explain>
  </step>

  <step id="copy-file">
    <teach>Wpisz `cp Projekt/plan.txt Backup/plan.txt`, żeby utworzyć kopię pliku.</teach>
    <command>cp Projekt/plan.txt Backup/plan.txt</command>
    <run>`cp źródło cel` tworzy drugi egzemplarz. Źródło zostaje na miejscu.</run>
    <expect command-family="cp" exists="Backup/plan.txt"></expect>
    <explain>Kopia jest w `Backup/plan.txt`, a oryginał nadal jest w `Projekt/plan.txt`.</explain>
  </step>

  <step id="audit-copy">
    <teach>Wpisz `cat Backup/plan.txt`, żeby sprawdzić treść kopii.</teach>
    <command>cat Backup/plan.txt</command>
    <run>Nazwa pliku nie wystarcza. Sprawdzasz też zawartość.</run>
    <expect command-family="cat" stdout-contains="sprawdzić treść kopii"></expect>
    <explain>Kopia ma właściwą treść. Dopiero teraz nadaje się do odtworzenia.</explain>
  </step>

  <step id="remove-original">
    <teach>Wpisz `rm Projekt/plan.txt`, żeby usunąć oryginał w kontrolowanym ćwiczeniu.</teach>
    <command>rm Projekt/plan.txt</command>
    <run>`rm` usuwa plik. Tutaj masz już sprawdzoną kopię.</run>
    <expect command-family="rm" missing="Projekt/plan.txt"></expect>
    <explain>Oryginał zniknął. Kopia w `Backup` nadal istnieje.</explain>
  </step>

  <step id="restore-original">
    <teach>Wpisz `cp Backup/plan.txt Projekt/plan.txt`, żeby odtworzyć plik do katalogu projektu.</teach>
    <command>cp Backup/plan.txt Projekt/plan.txt</command>
    <run>Odtworzenie to kopiowanie z kopii do miejsca pracy.</run>
    <expect command-family="cp" exists="Projekt/plan.txt"></expect>
    <explain>Plik wrócił do katalogu projektu.</explain>
  </step>

  <step id="audit-restore">
    <teach>Wpisz `cat Projekt/plan.txt`, żeby sprawdzić odtworzony plik.</teach>
    <command>cat Projekt/plan.txt</command>
    <run>Kończysz odczytem treści, nie samym `ls`.</run>
    <expect command-family="cat" stdout-contains="zrobić kopię przed usuwaniem"></expect>
    <explain>Odtworzony plik ma oczekiwaną treść.</explain>
  </step>
</data-terminal-tutor-scenario>
