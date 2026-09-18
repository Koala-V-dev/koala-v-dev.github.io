# M0-01 - Pierwsza sesja terminala

Typ: `terminal-tutor`

Cel: wprowadzić `pwd`, `ls`, `ls -la`, `mkdir`, `rmdir`, `cd`, `touch`, `mv` bez zgadywania komend.

<data-terminal-tutor-scenario id="m0-01-pierwsza-sesja" title="Pierwsza sesja terminala">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Dokumenty"></dir>
      <dir name="Muzyka"></dir>
      <dir name="Obrazy"></dir>
      <dir name="Pobrane"></dir>
      <dir name="Pulpit"></dir>
      <dir name="Wideo"></dir>
      <dir name=".config" hidden="true"></dir>
      <file name=".bashrc" hidden="true"># ~/.bashrc</file>
    </dir>
  </world>

  <step id="pwd">
    <teach>Polecenie `pwd` (*print working directory*) zwraca pełną ścieżkę katalogu, w którym aktualnie się znajdujesz. Wywołaj tę komendę, aby określić swój bieżący kontekst roboczy.</teach>
    <command>pwd</command>
    <run>Systemy uniksowe opierają się na względnych ścieżkach dostępu. Ustalenie bieżącej pozycji chroni przed wykonywaniem operacji w niewłaściwym folderze.</run>
    <expect command="pwd" stdout="/home/egzamin"></expect>
    <explain>Bardzo dobrze! Wynik `/home/egzamin` potwierdza, że przebywasz w swoim katalogu domowym, który w prompcie symbolizowany jest przez tyldę (`~`).</explain>
  </step>

  <step id="ls">
    <teach>Narzędzie `ls` (*list*) listuje zawartość katalogu roboczego. Uruchom je, aby wyświetlić listę widocznych plików i folderów.</teach>
    <command>ls</command>
    <run>Domyślny format polecenia wyświetla tylko podstawowe, nieukryte nazwy plików i katalogów, nie ujawniając szczegółowych metadanych.</run>
    <expect command="ls" stdout-contains-all="Dokumenty,Pobrane,Pulpit"></expect>
    <explain>Super. Terminal wyświetlił listę standardowych podkatalogów (np. Dokumenty, Pobrane). Teraz wiesz, co znajduje się w Twoim otoczeniu.</explain>
  </step>

  <step id="ls-la">
    <teach>Flagi `-l` (szeroki format) i `-a` (wszystkie pliki, w tym ukryte) modyfikują działanie listowania. Użyj połączenia `ls -la`, aby odsłonić pełną strukturę katalogu.</teach>
    <command>ls -la</command>
    <run>Pliki ukryte w Linuxie zaczynają się od kropki (np. `.bashrc`). Długi format listowania (`-l`) pokazuje dodatkowo uprawnienia, właściciela, rozmiar pliku oraz datę modyfikacji.</run>
    <expect command-family="ls" options-include="l,a" stdout-contains=".bashrc"></expect>
    <explain>Dokładnie tak! Zobaczyliśmy pliki konfiguracyjne z kropką na początku oraz szczegółowe atrybuty uprawnień w pierwszej kolumnie.</explain>
  </step>

  <step id="mkdir-split">
    <teach>Założenie nowego folderu o nazwie `Notatki o Ubuntu` wymaga polecenia `mkdir` (*make directory*). Wykonaj tę komendę w terminalu.</teach>
    <command>mkdir Notatki o Ubuntu</command>
    <run>Program mkdir tworzy jeden lub więcej katalogów o nazwach podanych jako argumenty. Można w ten sposób zakładać całe struktury w systemie plików.</run>
    <expect command-family="mkdir" creates-more-than="1"></expect>
    <explain>Polecenie zostało przetworzone. Przejdźmy do weryfikacji rezultatów.</explain>
  </step>

  <step id="inspect-split">
    <teach>Weryfikacja stanu środowiska po modyfikacjach to podstawowy krok diagnostyczny. Uruchom polecenie `ls` i przeanalizuj wynik.</teach>
    <command>ls</command>
    <run>Listowanie zawartości katalogu pozwala na bieżąco kontrolować poprawność wykonanych poleceń przed wykonaniem kolejnych operacji.</run>
    <expect command="ls" stdout-contains-created-from="mkdir-split"></expect>
    <explain>Zauważ niespójność. Powłoka systemowa zinterpretowała spacje jako separatory argumentów, tworząc trzy osobne katalogi („Notatki”, „o”, „Ubuntu”) zamiast jednego. Spacja domyślnie rozdziela opcje i parametry komend.</explain>
  </step>

  <step id="cleanup-split">
    <teach>Przed kolejną próbą uporządkuj katalog roboczy. Usuń trzy puste katalogi za pomocą polecenia `rmdir`.</teach>
    <command>rmdir [nazwy katalogów]</command>
    <run>Narzędzie rmdir działa bezpiecznie – usunie folder tylko wtedy, gdy jest on całkowicie pusty, zapobiegając przypadkowej utracie danych.</run>
    <expect command-family="rmdir" removes-created-from="mkdir-split"></expect>
    <explain>Udało się. Ścieżka została wyczyszczona. Teraz możemy przejść do poprawnego sposobu przekazania nazwy ze spacją.</explain>
  </step>

  <step id="mkdir-quoted">
    <teach>Aby przekazać nazwę ze spacjami jako pojedynczy argument, należy ją zabezpieczyć. Utwórz folder, ujmując całą nazwę w cudzysłowy: `mkdir "Notatki o Ubuntu"`.</teach>
    <command>mkdir "Notatki o Ubuntu"</command>
    <run>Cudzysłowy informują interpreter powłoki, że tekst wewnątrz nich ma zostać potraktowany jako jeden ciąg znaków, a nie seria osobnych argumentów.</run>
    <expect command-family="mkdir" creates-one-dir-with-space="true"></expect>
    <explain>Doskonale. Użycie cudzysłowów zmusiło powłokę do zignorowania spacji jako separatorów, dzięki czemu powstał dokładnie jeden katalog.</explain>
  </step>

  <step id="cd-created">
    <teach>Przejdź do nowo utworzonego folderu za pomocą polecenia `cd "Notatki o Ubuntu"` (pamiętaj o cudzysłowach lub użyciu autouzupełniania klawiszem <kbd>Tab</kbd>).</teach>
    <command>cd "Notatki o Ubuntu"</command>
    <run>Polecenie `cd` (*change directory*) zmienia bieżący katalog roboczy powłoki. Podobnie jak przy tworzeniu, nazwa docelowa zawierająca spacje musi być cytowana.</run>
    <expect command-family="cd" cwd-created-from="mkdir-quoted"></expect>
    <explain>Sukces. Zmiana katalogu roboczego jest widoczna w prompcie terminala. Każda komenda bez pełnej ścieżki zadziała teraz w tym miejscu.</explain>
  </step>

  <step id="touch">
    <teach>Wywołaj polecenie `touch komendy.txt`, aby utworzyć nowy, pusty plik w aktualnej lokalizacji.</teach>
    <command>touch komendy.txt</command>
    <run>Podstawowym zadaniem `touch` jest aktualizacja znaczników czasu pliku (daty modyfikacji). Jeśli jednak plik nie istnieje, system automatycznie tworzy nowy, pusty plik o zerowym rozmiarze.</run>
    <expect command-family="touch" exists="./komendy.txt"></expect>
    <explain>Świetnie. Pusty plik tekstowy o nazwie `komendy.txt` został pomyślnie utworzony w nowym katalogu roboczym.</explain>
  </step>

  <step id="mv-rename">
    <teach>Zmień nazwę pliku za pomocą polecenia `mv` z `komendy.txt` na `komendy-podstawowe.txt`.</teach>
    <command>mv komendy.txt komendy-podstawowe.txt</command>
    <run>Narzędzie `mv` (*move*) służy zarówno do przenoszenia plików między katalogami, jak i do zmiany ich nazwy. Decyduje o tym fakt, czy plik docelowy znajduje się w tej samej lokalizacji.</run>
    <expect command-family="mv" missing="./komendy.txt" exists="./komendy-podstawowe.txt"></expect>
    <explain>Prawidłowo! Nazwa pliku została zmieniona na `komendy-podstawowe.txt` bez przenoszenia go do innego folderu.</explain>
  </step>

  <step id="home">
    <teach>Wywołaj polecenie `cd` bez żadnych dodatkowych argumentów, aby powrócić do swojego katalogu domowego.</teach>
    <command>cd</command>
    <run>W systemach Linux uruchomienie `cd` bez podania ścieżki docelowej jest najszybszym sposobem na natychmiastowe przeniesienie się do katalogu domowego zalogowanego użytkownika (zazwyczaj `/home/nazwa_użytkownika`).</run>
    <expect command="cd" cwd="/home/egzamin"></expect>
    <explain>Znakomicie. Sesja terminala zakończyła się powrotem do punktu wyjścia (katalogu domowego `/home/egzamin`).</explain>
  </step>
</data-terminal-tutor-scenario>
