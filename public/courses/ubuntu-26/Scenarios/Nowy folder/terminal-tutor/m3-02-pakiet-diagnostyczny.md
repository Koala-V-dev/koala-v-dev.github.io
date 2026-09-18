# M3-02 - Pakiet diagnostyczny

Typ: `terminal-tutor`

Cel: wprowadzić `tar`, `zip`, `unzip` i audyt zawartości archiwum.

<data-terminal-tutor-scenario id="m3-02-pakiet-diagnostyczny" title="Pakiet diagnostyczny">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/home/egzamin">
      <dir name="Raport">
        <file name="system.txt">df -h
free -h
lsblk -f
</file>
        <file name="procesy.txt">top
htop
</file>
      </dir>
    </dir>
  </world>

  <step id="inspect-report">
    <teach>Zanim pakujesz katalog, sprawdzasz jego zawartość. Archiwum ma przenieść konkretny materiał, nie nadzieję.</teach>
    <command>ls Raport</command>
    <run>Sprawdź zawartość katalogu `Raport`.</run>
    <expect command-family="ls" stdout-contains-all="system.txt,procesy.txt"></expect>
    <explain>Katalog zawiera dwa pliki raportu.</explain>
  </step>

  <step id="man-tar">
    <teach>`man tar` przypomina trzy podstawowe tryby: create, list i extract.</teach>
    <command>man tar</command>
    <run>Otwórz manual komendy `tar`.</run>
    <expect command-family="man" stdout-contains-all="tar,-cf,-tf,-xf"></expect>
    <explain>`tar -cf` tworzy, `tar -tf` listuje, `tar -xf` rozpakowuje.</explain>
  </step>

  <step id="tar-create">
    <teach>`tar -cf raport.tar Raport` tworzy jedno archiwum z katalogu `Raport`.</teach>
    <command>tar -cf raport.tar Raport</command>
    <run>Utwórz archiwum tar katalogu `Raport`.</run>
    <expect command-family="tar" exists="raport.tar"></expect>
    <explain>Powstał plik `raport.tar`.</explain>
  </step>

  <step id="tar-list">
    <teach>`tar -tf` sprawdza zawartość archiwum bez rozpakowywania.</teach>
    <command>tar -tf raport.tar</command>
    <run>Wypisz zawartość archiwum `raport.tar`.</run>
    <expect command-family="tar" stdout-contains-all="Raport/system.txt,Raport/procesy.txt"></expect>
    <explain>Archiwum zawiera oba pliki raportu.</explain>
  </step>

  <step id="zip-create">
    <teach>`zip -r` pakuje katalog do formatu ZIP. `-r` jest potrzebne, bo pakujesz katalog z zawartością.</teach>
    <command>zip -r raport.zip Raport</command>
    <run>Utwórz archiwum ZIP katalogu `Raport`.</run>
    <expect command-family="zip" exists="raport.zip"></expect>
    <explain>Powstał plik `raport.zip`, wygodny do przekazania poza świat Linuksa.</explain>
  </step>

  <step id="unzip">
    <teach>`unzip` rozpakowuje archiwum ZIP do bieżącego katalogu. W ćwiczeniu chodzi o sprawdzenie mechaniki, nie o nadpisywanie pracy.</teach>
    <command>unzip raport.zip</command>
    <run>Rozpakuj `raport.zip`.</run>
    <expect command-family="unzip" history-contains="extracting: Raport/system.txt"></expect>
    <explain>ZIP da się rozpakować, a w historii widać, które pliki zostały wypakowane.</explain>
  </step>
</data-terminal-tutor-scenario>
