# M2-04 - Kreatory i usuwanie kont

Typ: `terminal-tutor`

Cel: pokazać różnicę między `adduser` i `useradd`, dodać `addgroup`, `deluser`, `groupdel` oraz użycie lokalnego `man`.

<data-terminal-tutor-scenario id="m2-04-kreatory-i-usuwanie-kont" title="Kreatory i sprzątanie kont">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin"></dir>
      </dir>
      <dir name="etc"></dir>
    </dir>
  </world>

  <step id="manual-adduser">
    <teach>`man` daje składnię i opis komendy. W labie strony manuala są lokalnymi plikami tekstowymi, więc można je czytać bez internetu.</teach>
    <command>man adduser</command>
    <run>Otwórz manual komendy `adduser`.</run>
    <expect command-family="man" stdout-contains-all="adduser,SKŁADNIA"></expect>
    <explain>Masz punkt odniesienia: `adduser` to wygodny kreator Debiana/Ubuntu.</explain>
  </step>

  <step id="addgroup">
    <teach>`addgroup` tworzy grupę w stylu debianowego kreatora. To dobra komenda do ręcznej pracy w Ubuntu.</teach>
    <command>sudo addgroup projektanci</command>
    <run>Utwórz grupę `projektanci`.</run>
    <expect command-family="sudo" group="projektanci"></expect>
    <explain>Grupa istnieje i może być użyta do nadawania dostępu wielu kontom.</explain>
  </step>

  <step id="adduser">
    <teach>`adduser` tworzy konto wraz z katalogiem domowym. W prawdziwym terminalu kreator zadałby dodatkowe pytania.</teach>
    <command>sudo adduser anna</command>
    <run>Utwórz użytkownika `anna`.</run>
    <expect command-family="sudo" user="anna" home-exists="anna"></expect>
    <explain>Powstało konto `anna` i katalog `/home/anna`.</explain>
  </step>

  <step id="add-to-group">
    <teach>`usermod -aG grupa użytkownik` dopisuje użytkownika do grupy dodatkowej. `-a` oznacza append, czyli dopisz zamiast nadpisywać listę grup.</teach>
    <command>sudo usermod -aG projektanci anna</command>
    <run>Dopisz `anna` do grupy `projektanci`.</run>
    <expect command-family="sudo" user-in-group="anna:projektanci"></expect>
    <explain>`anna` ma teraz swoją grupę podstawową i dodatkową grupę `projektanci`.</explain>
  </step>

  <step id="audit-anna">
    <teach>Po zmianie konta wykonujesz audyt. `id anna` pokaże UID, GID i grupy.</teach>
    <command>id anna</command>
    <run>Sprawdź stan konta `anna`.</run>
    <expect command-family="id" stdout-contains-all="anna,projektanci"></expect>
    <explain>Wynik potwierdza, że konto istnieje i należy do grupy dodatkowej.</explain>
  </step>

  <step id="manual-useradd">
    <teach>`useradd` jest niższego poziomu. Bez opcji `-m` nie zakłada katalogu domowego, więc sprawdzamy manual przed użyciem.</teach>
    <command>man useradd</command>
    <run>Otwórz manual komendy `useradd`.</run>
    <expect command-family="man" stdout-contains-all="useradd,-m"></expect>
    <explain>Najważniejsza opcja na start to `-m`, bo wymusza utworzenie katalogu domowego.</explain>
  </step>

  <step id="useradd">
    <teach>`useradd -m automat` tworzy konto niskopoziomowo, ale z katalogiem domowym. To forma bliższa automatyzacji.</teach>
    <command>sudo useradd -m automat</command>
    <run>Utwórz konto `automat` przez `useradd -m`.</run>
    <expect command-family="sudo" user="automat" home-exists="automat"></expect>
    <explain>Konto `automat` istnieje i ma katalog `/home/automat`.</explain>
  </step>

  <step id="getent-automat">
    <teach>`getent passwd automat` pokazuje wpis konta widziany przez system.</teach>
    <command>getent passwd automat</command>
    <run>Sprawdź wpis konta `automat`.</run>
    <expect command-family="getent" stdout-contains="/home/automat"></expect>
    <explain>Wpis pokazuje UID, GID, katalog domowy i powłokę.</explain>
  </step>

  <step id="deluser">
    <teach>`deluser --remove-home` usuwa konto i katalog domowy. To właściwe sprzątanie po koncie testowym.</teach>
    <command>sudo deluser --remove-home automat</command>
    <run>Usuń konto `automat` razem z katalogiem domowym.</run>
    <expect command-family="sudo" user-missing="automat" missing="/home/automat"></expect>
    <explain>Konto testowe i jego katalog domowy zostały usunięte.</explain>
  </step>

  <step id="groupdel">
    <teach>`groupdel` usuwa grupę. Najpierw upewniasz się, że grupa nie jest już potrzebna jako podstawa istniejącego konta.</teach>
    <command>sudo groupdel projektanci</command>
    <run>Usuń grupę `projektanci`.</run>
    <expect command-family="sudo" group-missing="projektanci"></expect>
    <explain>Grupa została usunięta, a użytkownik `anna` nie ma już tej grupy dodatkowej.</explain>
  </step>
</data-terminal-tutor-scenario>
