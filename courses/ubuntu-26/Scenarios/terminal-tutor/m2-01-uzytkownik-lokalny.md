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
    <teach>`whoami` pokazuje nazwę użytkownika, który wykonuje komendy w tej sesji.</teach>
    <command>whoami</command>
    <run>Sprawdź aktualnego użytkownika.</run>
    <expect command="whoami" stdout="egzamin"></expect>
    <explain>Komendy wykonuje użytkownik `egzamin`. To ważne przed użyciem `sudo`.</explain>
  </step>

  <step id="id-self">
    <teach>`id` pokazuje UID, GID i grupy. To pełniejsza odpowiedź niż sama nazwa konta.</teach>
    <command>id</command>
    <run>Sprawdź identyfikatory i grupy aktualnego użytkownika.</run>
    <expect command="id" stdout-contains-all="uid=1000,groups="></expect>
    <explain>Wynik pokazuje, że użytkownik ma własny UID i należy do grup. Grupa `sudo` daje prawo użycia `sudo`.</explain>
  </step>

  <step id="adduser">
    <teach>`adduser` tworzy konto lokalne i katalog domowy. Utwórz konto `technik` przez `sudo adduser technik`.</teach>
    <command>sudo adduser technik</command>
    <run>Utwórz użytkownika `technik`.</run>
    <expect command-family="sudo" user="technik" home-exists="technik" password-set="technik" stdout-contains-all="Adding new user,New password:,passwd: password updated successfully"></expect>
    <explain>`adduser` utworzył konto, grupę podstawową, katalog domowy i ustawił hasło w tym samym przebiegu.</explain>
  </step>

  <step id="groupadd">
    <teach>`groupadd` tworzy lokalną grupę. Grupy pozwalają nadawać uprawnienia wielu kontom naraz.</teach>
    <command>sudo groupadd audyt</command>
    <run>Utwórz grupę `audyt`.</run>
    <expect command-family="sudo" group="audyt"></expect>
    <explain>Grupa `audyt` istnieje, ale użytkownik `technik` jeszcze do niej nie należy.</explain>
  </step>

  <step id="usermod">
    <teach>`usermod -aG audyt technik` dopisuje użytkownika `technik` do grupy `audyt`. Opcja `-a` chroni przed nadpisaniem dotychczasowych grup dodatkowych.</teach>
    <command>sudo usermod -aG audyt technik</command>
    <run>Dodaj użytkownika `technik` do grupy `audyt`.</run>
    <expect command-family="sudo" user-in-group="technik:audyt"></expect>
    <explain>`technik` należy teraz do grupy `audyt`.</explain>
  </step>

  <step id="audit-groups">
    <teach>`groups technik` pokazuje grupy użytkownika w krótkiej formie. Sprawdź, czy `technik` należy do `audyt`.</teach>
    <command>groups technik</command>
    <run>Sprawdź grupy użytkownika `technik`.</run>
    <expect command-family="groups" stdout-contains-all="technik,audyt"></expect>
    <explain>Wynik pokazuje nazwę użytkownika i listę jego grup.</explain>
  </step>

  <step id="audit-id">
    <teach>Po zmianie konta robisz audyt. `id technik` pokazuje, czy konto istnieje i jakie ma grupy.</teach>
    <command>id technik</command>
    <run>Sprawdź konto `technik` po zmianach.</run>
    <expect command-family="id" stdout-contains-all="uid=,technik,audyt"></expect>
    <explain>To jest dowód stanu: konto istnieje i należy do grupy `audyt`.</explain>
  </step>

  <step id="audit-getent">
    <teach>`getent passwd technik` czyta bazę kont tak, jak widzi ją system.</teach>
    <command>getent passwd technik</command>
    <run>Sprawdź wpis konta w bazie użytkowników.</run>
    <expect command-family="getent" stdout-contains="/home/technik"></expect>
    <explain>Wpis pokazuje katalog domowy i powłokę użytkownika. To praktyczny podgląd `/etc/passwd` bez ręcznego grzebania w pliku.</explain>
  </step>
</data-terminal-tutor-scenario>
