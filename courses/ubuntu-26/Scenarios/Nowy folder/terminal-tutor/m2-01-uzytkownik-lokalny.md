# M2-01 - Użytkownik lokalny

Typ: `terminal-tutor`

Cel: wprowadzić `whoami`, `id`, `groups`, `sudo adduser`, `groupadd`, `usermod -aG`, `getent`.

<data-terminal-tutor-scenario id="m2-01-uzytkownik-lokalny" title="Użytkownik lokalny">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin"></dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
  </world>

  <step id="whoami">
    <teach>Wyznaczanie uprawnień i granic wykonania poleceń w powłoce wymaga znajomości aktywnej tożsamości. Uruchom narzędzie `whoami`, aby odczytać nazwę aktualnie zalogowanego konta.</teach>
    <command>whoami</command>
    <run>Polecenie `whoami` odpytuje system operacyjny o nazwę użytkownika przypisaną do bieżącego procesu powłoki. Jest to najszybszy sposób na potwierdzenie swojej tożsamości roboczej.</run>
    <expect command="whoami" stdout="egzamin"></expect>
    <explain>Świetnie! Wynik `egzamin` wskazuje Twoją bieżącą nazwę użytkownika. To ważne ustalenie przed wykonywaniem jakichkolwiek poleceń z podniesionymi uprawnieniami.</explain>
  </step>

  <step id="id-self">
    <teach>Pełna identyfikacja konta obejmuje numeryczny identyfikator użytkownika (UID), grupę główną (GID) oraz grupy dodatkowe. Wywołaj polecenie `id`, aby wyświetlić te metadane.</teach>
    <command>id</command>
    <run>Każdy użytkownik w systemach typu Linux posiada numeryczny identyfikator UID oraz należy do co najmniej jednej grupy (GID). Należność do grupy `sudo` decyduje o możliwości podnoszenia uprawnień administracyjnych.</run>
    <expect command="id" stdout-contains-all="uid=1000,groups="></expect>
    <explain>Znakomicie. Zauważ, że Twoje konto ma UID 1000 i należy do grupy `sudo`, co daje Ci prawo zarządzania systemem.</explain>
  </step>

  <step id="adduser">
    <teach>Tworzenie nowych kont lokalnych odbywa się za pomocą narzędzia `adduser`. Uruchom komendę `sudo adduser technik`, aby utworzyć konto oraz jego katalog domowy.</teach>
    <command>sudo adduser technik</command>
    <run>Narzędzie `adduser` jest przyjaznym skryptem wysokiego poziomu w Ubuntu. W jednym przebiegu tworzy konto, wyznacza katalog domowy w `/home/`, kopiuje pliki startowe ze szkieletu `/etc/skel` oraz wymusza ustawienie bezpiecznego hasła.</run>
    <expect command-family="sudo" user="technik" home-exists="technik" password-set="technik" stdout-contains-all="Adding new user,New password:,passwd: password updated successfully"></expect>
    <explain>Doskonale! Nowe konto lokalne `technik` zostało utworzone wraz ze swoim prywatnym katalogiem domowym `/home/technik`.</explain>
  </step>

  <step id="groupadd">
    <teach>Grupy pozwalają sprawnie nadawać uprawnienia dostępu wielu użytkownikom jednocześnie. Utwórz nową grupę lokalną za pomocą polecenia `sudo groupadd audyt`.</teach>
    <command>sudo groupadd audyt</command>
    <run>Polecenie `groupadd` rejestruje nową grupę w pliku `/etc/group`, przydzielając jej unikalny numeryczny identyfikator GID. W tym momencie grupa jest pusta i czeka na przypisanie członków.</run>
    <expect command-family="sudo" group="audyt"></expect>
    <explain>Świetnie. Grupa `audyt` została utworzona w systemie i jest gotowa do przypisywania kont.</explain>
  </step>

  <step id="usermod">
    <teach>Przypisanie użytkownika do grupy dodatkowej wymaga polecenia `usermod` z flagami `-aG` potem nazwę grupy i nazwy użytkowników, których chcesz przypisać do tej grupy. Flaga `-a` (*append*) chroni przed usunięciem konta z dotychczasowych grup.</teach>
    <command>sudo usermod -aG audyt technik</command>
    <run>Pominięcie opcji `-a` (np. użycie samego `-G`) spowodowałoby zastąpienie całej listy dotychczasowych grup dodatkowych wyłącznie nowo wskazaną grupą! Jest to jeden z najczęstszych i najbardziej niebezpiecznych błędów w konfiguracji uprawnień.</run>
    <expect command-family="sudo" user-in-group="technik:audyt"></expect>
    <explain>Bardzo dobrze! Użytkownik `technik` został bezpiecznie dopisany do grupy `audyt` bez utraty przynależności do swojej grupy głównej.</explain>
  </step>

  <step id="audit-groups">
    <teach>Szybką weryfikację przynależności wybranego konta do grup umożliwia polecenie `groups technik`. Wywołaj je, aby przeprowadzić pierwszy audyt.</teach>
    <command>groups technik</command>
    <run>Narzędzie `groups` odczytuje relacje użytkownika z grupami z systemowych plików bazy danych i przedstawia je w czystej, czytelnej formie tekstowej.</run>
    <expect command-family="groups" stdout-contains-all="technik,audyt"></expect>
    <explain>Potwierdzone! Wynik wyraźnie pokazuje, że konto `technik` należy do grupy własnej oraz do grupy dodatkowej `audyt`.</explain>
  </step>

  <step id="audit-id">
    <teach>Szczegółowy audyt numerycznych identyfikatorów UID, GID oraz grup dodatkowych wykonasz poleceniem `id technik`.</teach>
    <command>id technik</command>
    <run>Polecenie `id` dla podanej nazwy użytkownika zwraca pełną strukturę uprawnień tożsamościowych przechowywaną w jądrze i bazach systemowych.</run>
    <expect command-family="id" stdout-contains-all="uid=,technik,audyt"></expect>
    <explain>Znakomicie. Komenda zwróciła pełne dane tożsamości konta `technik`, w tym przynależność do grupy `audyt` z odpowiednim numerem GID.</explain>
  </step>

  <step id="audit-getent">
    <teach>Odczytanie oficjalnego wpisu z bazy kont systemowych bez bezpośredniej edycji pliku umożliwia polecenie `getent passwd technik`.</teach>
    <command>getent passwd technik</command>
    <run>Narzędzie `getent` (*get entry*) odpytuje biblioteki NSS (Name Service Switch). Umożliwia bezpieczny podgląd wpisu konta w `/etc/passwd` oraz z zewnętrznych baz (np. LDAP).</run>
    <expect command-family="getent" stdout-contains="/home/technik"></expect>
    <explain>Gratulacje! Wpis w bazie potwierdza nazwę konta, UID, GID, ścieżkę katalogu domowego `/home/technik` oraz domyślną powłokę `/bin/bash`.</explain>
  </step>
</data-terminal-tutor-scenario>
