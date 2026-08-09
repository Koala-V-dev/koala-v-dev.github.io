# M4-01 - Bezpieczny cykl pracy z UFW

Typ: `terminal-tutor`

Cel: Dodać regułę SSH ograniczoną do VM1 przed aktywacją UFW, a następnie przećwiczyć kontrolowane dodanie i usunięcie reguły testowej.

<data-terminal-tutor-scenario id="m4-01-ufw-podstawy" title="Bezpieczny cykl pracy z UFW">
  <world user="egzamin" host="ubuntu" cwd="/home/egzamin" default-mtime="1999-05-30 21:37">
    <dir path="/">
      <dir name="home">
        <dir name="egzamin"></dir>
      </dir>
      <dir name="etc">
        <dir name="ufw">
          <file name="ufw.conf">ENABLED=no
LOGLEVEL=low
</file>
        </dir>
      </dir>
    </dir>
  </world>

  <step id="check-initial-status">
    <teach>Wpisz `sudo ufw status`, aby odczytać bieżący stan zapory.</teach>
    <command>sudo ufw status</command>
    <run>Pierwszy wynik pokazuje stan zapory przed ćwiczeniem. Wynik końcowy pokaże stan po wykonaniu poleceń.</run>
    <expect command="sudo ufw status" stdout-contains-all="Status: inactive"></expect>
    <explain>Wynik `Status: inactive` oznacza, że UFW nie filtruje obecnie ruchu. Konfigurację reguł można jednak przygotować przed aktywacją zapory.</explain>
  </step>

  <step id="allow-ssh-before-enable">
    <teach>Dodaj regułę SSH dla VM1 poleceniem `sudo ufw allow from 192.168.50.10 to any port 22 proto tcp`.</teach>
    <command>sudo ufw allow from 192.168.50.10 to any port 22 proto tcp</command>
    <run>Adres źródłowy ogranicza dostęp do hosta `192.168.50.10`. Port `22` i protokół `tcp` wskazują usługę SSH, ale jej nie uruchamiają.</run>
    <expect command="sudo ufw allow from 192.168.50.10 to any port 22 proto tcp" stdout-contains-all="Rule added"></expect>
    <explain>Komunikat `Rule added` potwierdza zapisanie wyjątku dla SSH z VM1. Zapora pozostaje nieaktywna, więc reguła zacznie filtrować ruch dopiero po jej włączeniu.</explain>
  </step>

  <step id="enable-ufw">
    <teach>Aktywuj zaporę poleceniem `sudo ufw enable`.</teach>
    <command>sudo ufw enable</command>
    <run>UFW zastosuje wszystkie zapisane reguły i skonfiguruje automatyczne uruchamianie zapory wraz z systemem.</run>
    <expect command="sudo ufw enable" stdout-contains-all="Firewall is active and enabled on system startup"></expect>
    <explain>Zapora filtruje już ruch. Wcześniej dodany wyjątek pozwala zestawiać nowe połączenia SSH z adresu VM1.</explain>
  </step>

  <step id="add-test-rule">
    <teach>Dodaj regułę testową poleceniem `sudo ufw allow 8080/tcp`.</teach>
    <command>sudo ufw allow 8080/tcp</command>
    <run>Zezwolenie w zaporze nie uruchamia usługi. Połączenie z portem `8080` zadziała tylko wtedy, gdy jakiś proces będzie na nim nasłuchiwał.</run>
    <expect command="sudo ufw allow 8080/tcp" stdout-contains-all="Rule added"></expect>
    <explain>Reguła `8080/tcp` została dopisana do konfiguracji. Istniejące reguły pozostały bez zmian.</explain>
  </step>

  <step id="verify-active-rules">
    <teach>Wyświetl reguły poleceniem `sudo ufw status numbered` i odczytaj numer wpisu `8080/tcp`.</teach>
    <command>sudo ufw status numbered</command>
    <run>Numery reguł nie są stałymi identyfikatorami. Po usunięciu wpisu kolejne pozycje mogą otrzymać inne numery.</run>
    <expect command="sudo ufw status numbered" stdout-contains-all="Status: active,22/tcp,ALLOW IN,192.168.50.10,8080/tcp"></expect>
    <explain>Lista pokazuje wszystkie zapisane reguły. Każdy numer wskazuje jeden konkretny wpis, także wtedy, gdy kilka reguł dotyczy tego samego portu.</explain>
  </step>

  <step id="delete-test-rule">
    <teach>Odczytaj numer reguły `8080/tcp` z listy. Wpisz `sudo ufw delete NUMER`, zastępując `NUMER` odczytaną liczbą.</teach>
    <command>sudo ufw delete 2</command>
    <run>Numer wybiera dokładnie jeden wpis. Przed usunięciem zawsze odśwież listę, ponieważ numery zmieniają się po usunięciu reguły.</run>
    <expect stdout-contains-all="Rule deleted" ufw-rule-missing="allow:8080/tcp"></expect>
    <explain>Reguła `8080/tcp` została usunięta. Wszystkie pozostałe reguły zachowały swój zakres i działanie.</explain>
  </step>

  <step id="final-status-check">
    <teach>Wpisz `sudo ufw status numbered`. Potwierdź aktywną zaporę, regułę SSH dla połączenia `192.168.50.10` i brak wpisu `8080/tcp`.</teach>
    <command>sudo ufw status numbered</command>
    <run>Komunikat po usunięciu opisuje wykonaną operację. Dopiero ponowny odczyt statusu pokazuje pełny stan konfiguracji.</run>
    <expect command="sudo ufw status numbered" stdout-contains-all="Status: active,22/tcp,ALLOW IN,192.168.50.10" ufw-rule="allow:from 192.168.50.10 to any port 22 proto tcp" ufw-rule-missing="allow:8080/tcp"></expect>
    <explain>UFW działa. Lista zawiera wszystkie pozostałe reguły, a wpis `8080/tcp` nie jest już obecny.</explain>
  </step>
</data-terminal-tutor-scenario>
