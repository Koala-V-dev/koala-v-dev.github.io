# M2-02 - Uprawnienia katalogu

Typ: `terminal-tutor`

Cel: wprowadzić `ls -l`, `chown`, `chmod`, `chgrp` i audyt uprawnień katalogu.

<data-terminal-tutor-scenario id="m2-02-uprawnienia-katalogu" title="Uprawnienia katalogu">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin">
        </dir>
      </dir>
      <dir name="srv" owner="root" group="root" mode="755">
        <dir name="Projekt" owner="egzamin" group="egzamin" mode="755">
          <file name="plan.txt" owner="egzamin" group="egzamin" mode="644">Zakres prac serwisowych.
</file>
        </dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
    <accounts>
      <account name="technik" group="technik" home="/home/technik" groups="technik,audyt" password-set="true"></account>
    </accounts>
  </world>

  <step id="ls-before">
    <teach>Weryfikacja praw dostępu i własności zasobów wymaga użycia długiej formy listowania. Wykonaj `ls -l /srv`, aby przeprowadzić wstępny audyt katalogu `/srv/Projekt`.</teach>
    <command>ls -l /srv</command>
    <run>Opcja `-l` w poleceniu `ls` wyświetla tzw. metadane zasobu: typ, prawa dostępu dla trzech klas użytkowników, liczbę dowiązań, nazwę właściciela, nazwę grupy właścicielskiej, rozmiar w bajtach oraz datę ostatniej modyfikacji.</run>
    <expect command-family="ls" options-include="l" stdout-contains="Projekt"></expect>
    <explain>Bardzo dobrze. Z listingu wynika, że katalog `Projekt` należy obecnie do konta `egzamin` oraz grupy `egzamin` i posiada domyślny tryb dostępu `755` (`rwxr-xr-x`).</explain>
  </step>

  <step id="chown-project-owner">
    <teach>Zmiana własności katalogu wymaga narzędzia `chown` (*change owner*). Ustaw konto `technik` jako właściciela ścieżki `/srv/Projekt` z użyciem `sudo`.</teach>
    <command>sudo chown technik /srv/Projekt</command>
    <run>Polecenie `chown` przyjmuje nazwę nowego właściciela oraz ścieżkę do zasobu. Modyfikacja własności zasobów należących do innych użytkowników lub zlokalizowanych w katalogach systemowych (np. `/srv`) wymaga uprawnień administratora (`sudo`).</run>
    <expect command-family="sudo" path-owner="/srv/Projekt:technik"></expect>
    <explain>Świetnie. Właściciel zasobu został pomyślnie zmieniony na użytkownika `technik`. Grupa właścicielska pozostaje jeszcze bez zmian.</explain>
  </step>

  <step id="chgrp-project">
    <teach>Przypisanie grupy właścicielskiej odbywa się za pomocą polecenia `chgrp` (*change group*). Przypisz grupę `audyt` do katalogu `/srv/Projekt`.</teach>
    <command>sudo chgrp audyt /srv/Projekt</command>
    <run>Polecenie `chgrp` służy wyłącznie do zmiany grupy przypisanej do zasobu. Alternatywnie można użyć składni łączonej `chown użytkownik:grupa ścieżka`, aby zmienić oba podmioty w jednym wywołaniu.</run>
    <expect command-family="sudo" path-group="/srv/Projekt:audyt"></expect>
    <explain>Znakomicie! Katalog `/srv/Projekt` ma teraz ustalonego właściciela (`technik`) oraz dedykowaną grupę właścicielską (`audyt`).</explain>
  </step>

  <step id="chmod-project">
    <teach>Ograniczenie praw dostępu wykonasz narzędziem `chmod`. Ustaw tryb ósemkowy `750` dla katalogu `/srv/Projekt`, aby przyznać pełny dostęp właścicielowi, odczyt i wejście grupie oraz odebrać prawa wszystkim pozostałym.</teach>
    <command>sudo chmod 750 /srv/Projekt</command>
    <run>Cyfry w trybie ósemkowym reprezentują kolejno uprawnienia dla Właściciela (`7` = `rwx`), Grupy (`5` = `r-x`) i Pozostałych (`0` = `---`). Dla katalogów flaga wykonywania `x` (wartość 1) odpowiada za możliwość wejścia do katalogu.</run>
    <expect command-family="sudo" path-mode="/srv/Projekt:750"></expect>
    <explain>Doskonale! Prawa zostały skonfigurowane w trybie `750` (`drwxr-x---`). Pozostali użytkownicy systemu stracili możliwość wglądu do katalogu.</explain>
  </step>

  <step id="ls-after">
    <teach>Wykonaj ponowny audyt za pomocą `ls -l /srv`, aby potwierdzić prawidłowe zapisanie nowych uprawnień i własności w systemie plików.</teach>
    <command>ls -l /srv</command>
    <run>Audyt końcowy pozwala potwierdzić, że wskaźniki własności i maski praw zostały prawidłowo zapisane w węźle indeksowym (inode) systemu plików.</run>
    <expect command-family="ls" options-include="l" stdout-contains-all="drwxr-x---,technik,audyt,Projekt"></expect>
    <explain>Potwierdzone! Wynik w jednej linii pokazuje `drwxr-x--- technik audyt Projekt`. Konfiguracja jest kompletna.</explain>
  </step>

  <step id="su-technik">
    <teach>Przetestowanie dostępu z perspektywy nowego właściciela wymaga przełączenia tożsamości. Otwórz nową sesję powłoki jako użytkownik `technik` za pomocą polecenia `su - technik`.</teach>
    <command>su - technik</command>
    <run>Polecenie `su -` (*substitute user*) uruchamia interaktywną powłokę logowania wskazanego konta, ładując jego pełne środowisko i zmienne systemowe z katalogu domowego.</run>
    <expect command="su - technik" session-user="technik"></expect>
    <explain>Świetnie! Znalazłeś się w osobnej sesji powłoki uruchomionej z prawami i tożsamością użytkownika `technik`.</explain>
  </step>

  <step id="cd-as-technik">
    <teach>Będąc w sesji użytkownika `technik`, przejdź do katalogu `/srv/Projekt`.</teach>
    <command>cd /srv/Projekt</command>
    <run>System operacyjny sprawdza prawa dostępu podczas próby wejścia. Właściciel posiada prawo `x` (wartość 1 w cyfrze 7), co umożliwia udany przejazd do wnętrza folderu.</run>
    <expect command="cd /srv/Projekt" cwd="/srv/Projekt"></expect>
    <explain>Sukces! Ponieważ użytkownik `technik` jest właścicielem katalogu i posiada prawa `rwx`, dostęp został pomyślnie przyznany.</explain>
  </step>

  <step id="exit-technik">
    <teach>Zakończ sesję pomocniczą poleceniem `exit`, aby powrócić do swojego konta głównego.</teach>
    <command>exit</command>
    <run>Polecenie `exit` kończy bieżący proces powłoki (zakończenie sesji `su`) i przywraca poprzednią powłokę użytkownika `egzamin`.</run>
    <expect command="exit" session-user="egzamin"></expect>
    <explain>Gratulacje! Powróciłeś do konta głównego. Całe laboratorium dotyczące zarządzania własnością i uprawnieniami zostało zakończone pomyślnie.</explain>
  </step>
</data-terminal-tutor-scenario>
