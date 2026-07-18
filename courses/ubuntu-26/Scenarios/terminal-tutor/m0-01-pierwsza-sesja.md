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
    <teach>Wpisz `pwd`, żeby pokazać pełną ścieżkę bieżącego katalogu.</teach>
    <command>pwd</command>
    <run>To pierwszy odruch przed pracą na plikach: sprawdzasz, gdzie jesteś.</run>
    <expect command="pwd" stdout="/home/egzamin"></expect>
    <explain>Jesteś w `/home/egzamin`. Prompt skraca tę ścieżkę do `~`, bo to katalog domowy użytkownika `egzamin`.</explain>
  </step>

  <step id="ls">
    <teach>Po ustaleniu miejsca wpisz `ls`, żeby zobaczyć zawartość katalogu domowego.</teach>
    <command>ls</command>
    <run>Krótkie listowanie daje same nazwy. Nie pokazuje jeszcze ukrytych wpisów ani uprawnień.</run>
    <expect command="ls" stdout-contains-all="Dokumenty,Pobrane,Pulpit"></expect>
    <explain>Widzisz zwykłe katalogi użytkownika. Ten widok jest szybki, ale nie pokazuje plików ukrytych ani uprawnień.</explain>
  </step>

  <step id="ls-la">
    <teach>Wpisz `ls -la`, żeby zobaczyć ukryte wpisy i szczegóły katalogu domowego.</teach>
    <command>ls -la</command>
    <run>`-a` pokazuje nazwy od kropki, a `-l` dodaje szczegóły wpisów.</run>
    <expect command-family="ls" options-include="l,a" stdout-contains=".bashrc"></expect>
    <explain>`-a` odsłania nazwy zaczynające się od kropki. `-l` dodaje typ wpisu, uprawnienia, właściciela, grupę, czas modyfikacji i nazwę.</explain>
  </step>

  <step id="mkdir-split">
    <teach>Wpisz `mkdir Notatki o Ubuntu` bez cudzysłowu. To celowy błąd, który pokaże, jak spacja dzieli argumenty.</teach>
    <command>mkdir Notatki o Ubuntu</command>
    <run>Dla człowieka to jedna nazwa. Dla powłoki to kilka osobnych argumentów po `mkdir`.</run>
    <expect command-family="mkdir" creates-more-than="1"></expect>
    <explain>Powstało kilka katalogów, bo powłoka potraktowała każdy wyraz po `mkdir` jako osobny argument.</explain>
  </step>

  <step id="inspect-split">
    <teach>Wpisz `ls`, żeby sprawdzić, co faktycznie powstało po poprzedniej komendzie.</teach>
    <command>ls</command>
    <run>Po zmianie w katalogach nie zakładasz sukcesu. Sprawdzasz stan.</run>
    <expect command="ls" stdout-contains-created-from="mkdir-split"></expect>
    <explain>To nie jest błąd `mkdir`. To efekt składni powłoki: spacja rozdziela argumenty.</explain>
  </step>

  <step id="cleanup-split">
    <teach>Usuń puste katalogi z poprzedniego kroku komendą `rmdir` i podaj ich nazwy po spacji.</teach>
    <command>rmdir [nazwy katalogów]</command>
    <run>`rmdir` usuwa tylko puste katalogi, więc pasuje do sprzątania po źle podanej nazwie.</run>
    <expect command-family="rmdir" removes-created-from="mkdir-split"></expect>
    <explain>`rmdir` usuwa tylko puste katalogi. To bezpieczniejszy ruch niż sięganie od razu po usuwanie rekurencyjne.</explain>
  </step>

  <step id="mkdir-quoted">
    <teach>Wpisz `mkdir "Notatki o Ubuntu"`, żeby utworzyć jeden katalog z nazwą zawierającą spacje.</teach>
    <command>mkdir "Notatki o Ubuntu"</command>
    <run>Cudzysłów sprawia, że cała nazwa trafia do `mkdir` jako jeden argument.</run>
    <expect command-family="mkdir" creates-one-dir-with-space="true"></expect>
    <explain>Teraz powstał jeden katalog, bo cała nazwa została przekazana jako jeden argument.</explain>
  </step>

  <step id="cd-created">
    <teach>Wejdź do utworzonego katalogu komendą `cd "Notatki o Ubuntu"` albo wpisz początek nazwy i użyj <kbd>Tab</kbd>.</teach>
    <command>cd "Notatki o Ubuntu"</command>
    <run>Przy `cd` nazwa ze spacjami też musi być jednym argumentem.</run>
    <expect command-family="cd" cwd-created-from="mkdir-quoted"></expect>
    <explain>Prompt zmienił ścieżkę. Od teraz komendy działają wewnątrz utworzonego katalogu.</explain>
  </step>

  <step id="touch">
    <teach>Wpisz `touch komendy.txt`, żeby utworzyć pusty plik w bieżącym katalogu.</teach>
    <command>touch komendy.txt</command>
    <run>Jeżeli nie podajesz ścieżki, plik powstaje tam, gdzie wskazuje prompt.</run>
    <expect command-family="touch" exists="./komendy.txt"></expect>
    <explain>`touch` utworzył pusty plik. Gdyby plik już istniał, komenda zaktualizowałaby jego czas modyfikacji.</explain>
  </step>

  <step id="mv-rename">
    <teach>Wpisz `mv komendy.txt komendy-podstawowe.txt`, żeby zmienić nazwę pliku.</teach>
    <command>mv komendy.txt komendy-podstawowe.txt</command>
    <run>Gdy źródło i cel są w tym samym katalogu, `mv` działa jak zmiana nazwy.</run>
    <expect command-family="mv" missing="./komendy.txt" exists="./komendy-podstawowe.txt"></expect>
    <explain>W katalogu został ten sam plik, ale pod nową nazwą: `komendy-podstawowe.txt`</explain>
  </step>

  <step id="home">
    <teach>Wpisz samo `cd`, żeby wrócić do katalogu domowego.</teach>
    <command>cd</command>
    <run>`cd` bez argumentu wraca do domu bieżącego użytkownika.</run>
    <expect command="cd" cwd="/home/egzamin"></expect>
    <explain>Jesteś z powrotem w katalogu domowym.</explain>
  </step>
</data-terminal-tutor-scenario>
