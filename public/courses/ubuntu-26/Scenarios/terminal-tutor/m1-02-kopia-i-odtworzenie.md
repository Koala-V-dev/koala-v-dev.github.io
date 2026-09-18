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
    <teach>Przed wykonaniem kopii zapasowej zweryfikuj zawartość katalogu źródłowego `Projekt` za pomocą polecenia `ls`.</teach>
    <command>ls Projekt</command>
    <run>Pierwszym krokiem każdej bezpiecznej operacji na plikach jest upewnienie się, że plik źródłowy faktycznie istnieje w podanej ścieżce relatywnej.</run>
    <expect command-family="ls" stdout-contains="plan.txt"></expect>
    <explain>Bardzo dobrze. Na liście znajduje się plik `plan.txt` – to Twój oryginał roboczy, który będziemy zabezpieczać.</explain>
  </step>

  <step id="copy-file">
    <teach>Utwórz kopię pliku w katalogu `Backup` za pomocą narzędzia `cp` (*copy*), podając jako pierwszy argument plik źródłowy (`Projekt/plan.txt`), a jako drugi docelowy (`Backup/plan.txt`).</teach>
    <command>cp Projekt/plan.txt Backup/plan.txt</command>
    <run>Polecenie `cp` kopiuje dane blok po bloku do nowej lokalizacji. W przeciwieństwie do `mv`, plik źródłowy pozostaje nienaruszony.</run>
    <expect command-family="cp" exists="Backup/plan.txt"></expect>
    <explain>Świetnie. Plik został skopiowany. Od tego momentu w systemie istnieją dwa niezależne egzemplarze pliku.</explain>
  </step>

  <step id="audit-copy">
    <teach>Weryfikacja samej obecności pliku nie gwarantuje poprawności danych. Wyświetl zawartość kopii zapasowej za pomocą narzędzia `cat Backup/plan.txt`.</teach>
    <command>cat Backup/plan.txt</command>
    <run>Audyt spójności to kluczowy nawyk administracyjny. Przeczytanie nagłówka lub zawartości daje pewność, że plik nie został uszkodzony ani zaciągnięty jako pusty.</run>
    <expect command-family="cat" stdout-contains="sprawdzić treść kopii"></expect>
    <explain>Znakomicie! Treść w katalogu `Backup` jest w 100% zgodna z oryginałem. Kopia jest zweryfikowana.</explain>
  </step>

  <step id="remove-original">
    <teach>W celach ćwiczebnych symulujemy awarię i utratę danych. Wywołaj polecenie `rm Projekt/plan.txt`, aby usunąć plik roboczy z projektu.</teach>
    <command>rm Projekt/plan.txt</command>
    <run>Narzędzie `rm` (*remove*) natychmiast wykasowuje wskaźnik do pliku w systemie plików. Ponieważ terminal nie ma kosza, usunięcie pliku jest operacją nieodwracalną bez wcześniej przygotowanej kopii.</run>
    <expect command-family="rm" missing="Projekt/plan.txt"></expect>
    <explain>Oryginał został usunięty. W tym momencie projekt stracił swój plik roboczy, ale posiadamy bezpieczny backup.</explain>
  </step>

  <step id="restore-original">
    <teach>Przeprowadź procedurę odzyskiwania danych. Przywróć plik z katalogu `Backup` do `Projekt`, używając ponownie narzędzia `cp`.</teach>
    <command>cp Backup/plan.txt Projekt/plan.txt</command>
    <run>Procedura odtwarzania (disaster recovery) polega na przekopiowaniu zweryfikowanego pliku z bezpiecznego miejsca z powrotem do ścieżki roboczej aplikacji lub projektu.</run>
    <expect command-family="cp" exists="Projekt/plan.txt"></expect>
    <explain>Doskonale! Plik został pomyślnie skopiowany z kopii zapasowej z powrotem do katalogu roboczego.</explain>
  </step>

  <step id="audit-restore">
    <teach>Zakończ procedurę awaryjną pełnym audytem odzyskanego pliku za pomocą polecenia `cat Projekt/plan.txt`.</teach>
    <command>cat Projekt/plan.txt</command>
    <run>Każdy proces odtwarzania systemu lub danych uważany jest za zakończony sukcesem dopiero po potwierdzeniu odczytu danych w środowisku docelowym.</run>
    <expect command-family="cat" stdout-contains="zrobić kopię przed usuwaniem"></expect>
    <explain>Gratulacje! Odzyskany plik posiada kompletną treść. Cykl tworzenia kopii i przywracania danych został zakończony sukcesem.</explain>
  </step>
</data-terminal-tutor-scenario>
