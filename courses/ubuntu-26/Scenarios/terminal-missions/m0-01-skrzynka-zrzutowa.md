# M0-01 - Skrzynka zrzutowa

Typ: `terminal-mission`

Cel: sprawdzić, czy uczeń potrafi odczytać stan katalogów, poprawnie obsłużyć nazwę ze spacją, przenieść istniejący plik i zweryfikować efekt.

Uczeń powinien znać przed tą misją: `pwd`, `ls`, `ls -la`, `mkdir`, `cd`, `touch`, `rmdir`, `mv`, podstawy cytowania nazw ze spacjami.

<data-terminal-mission-scenario id="m0-01-skrzynka-zrzutowa" title="Skrzynka zrzutowa">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Dokumenty"></dir>
      <dir name="Pobrane">
        <file name="komendy.txt">pwd
ls
cd
mkdir
mv
</file>
        <file name="zrzut-terminala.txt">egzamin@ubuntu:~$ mkdir Analiza terminala
egzamin@ubuntu:~$ ls
Analiza Dokumenty Muzyka Obrazy Pobrane Pulpit terminala Wideo
</file>
      </dir>
      <dir name="Muzyka"></dir>
      <dir name="Obrazy"></dir>
      <dir name="Pulpit"></dir>
      <dir name="Wideo"></dir>
      <dir name="Analiza"></dir>
      <dir name="terminala"></dir>
      <file name=".bashrc" hidden="true"># ~/.bashrc</file>
    </dir>
  </world>

  <brief>Ktoś próbował utworzyć katalog `Analiza terminala`, ale nie zabezpieczył spacji. W katalogu domowym zostały dwa puste katalogi: `Analiza` i `terminala`.<br>
  W `Pobrane` leży oryginalny plik `komendy.txt` oraz zrzut sesji pokazujący, skąd wziął się problem.</brief>

  <objective>Doprowadź katalog domowy do takiego stanu:

- istnieje jeden katalog `/home/egzamin/Analiza terminala`,
- oryginalny plik `komendy.txt` z `Pobrane` leży w tym katalogu,
- przypadkowe katalogi `/home/egzamin/Analiza` i `/home/egzamin/terminala` zniknęły,
- na końcu w terminalu widać sprawdzenie katalogu domowego i katalogu docelowego.</objective>

  <assessment min-evidence="2">
    <evidence id="home-seen" label="Sprawdzono katalog domowy przed zmianami.">
      <expect observed="/home/egzamin"></expect>
      <nudge after="45s">Najpierw zobacz stan katalogu domowego. Bez tego łatwo naprawić nie ten katalog.</nudge>
    </evidence>

    <evidence id="downloads-seen" label="Sprawdzono zawartość katalogu `Pobrane`.">
      <expect observed-path="/home/egzamin/Pobrane"></expect>
      <nudge after="45s">Plik źródłowy już istnieje w `Pobrane`. Nie twórz pustej podróbki w katalogu docelowym.</nudge>
    </evidence>

    <condition id="target-dir" label="Istnieje katalog `/home/egzamin/Analiza terminala`.">
      <expect exists="/home/egzamin/Analiza terminala" type="dir"></expect>
      <nudge after="45s">Nazwa zawiera spację. Powłoka musi dostać ją jako jeden argument.</nudge>
    </condition>

    <condition id="original-file-moved" label="Oryginalny `komendy.txt` przeniesiono do katalogu docelowego.">
      <expect exists="/home/egzamin/Analiza terminala/komendy.txt" missing="/home/egzamin/komendy.txt" missing-all="/home/egzamin/Pobrane/komendy.txt" file="/home/egzamin/Analiza terminala/komendy.txt" file-contains-all="pwd,ls,cd,mkdir,mv"></expect>
      <nudge after="45s">Pusty plik o dobrej nazwie nie zalicza zadania. Trzeba przenieść istniejący plik z `Pobrane`.</nudge>
    </condition>

    <condition id="stray-dirs-removed" label="Usunięto puste katalogi `Analiza` i `terminala`.">
      <expect missing-all="/home/egzamin/Analiza,/home/egzamin/terminala"></expect>
      <nudge after="45s">To puste katalogi po źle zapisanej nazwie. Usuń je, ale nie ruszaj katalogu docelowego.</nudge>
    </condition>

    <audit id="final-home-audit" label="Zweryfikowano katalog domowy po zmianach.">
      <expect observed="/home/egzamin" missing-all="/home/egzamin/Analiza,/home/egzamin/terminala"></expect>
      <nudge after="45s">Po zmianach sprawdź katalog domowy. Terminal ma pokazać, że przypadkowe katalogi zniknęły.</nudge>
    </audit>

    <audit id="final-target-audit" label="Zweryfikowano katalog `/home/egzamin/Analiza terminala`.">
      <expect observed-path="/home/egzamin/Analiza terminala" exists="/home/egzamin/Analiza terminala/komendy.txt"></expect>
      <nudge after="45s">Na końcu obejrzyj katalog docelowy. Wynik komendy ma potwierdzić stan pliku.</nudge>
    </audit>
  </assessment>

  <summary>
    <item>Misja zaliczona: katalog domowy jest uporządkowany, a oryginalny plik trafił do właściwego miejsca.</item>
    <item>Wzorzec pracy: rozpoznanie, operacja, audyt.</item>
  </summary>
</data-terminal-mission-scenario>
