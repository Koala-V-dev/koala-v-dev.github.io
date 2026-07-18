# Kontrola uprawnień: Sudo i Visudo

Praca na koncie administratora `root` bezpośrednio na produkcji to poważne ryzyko (błędy w poleceniach mogą zniszczyć system). Program **sudo (superuser do)** pozwala zwykłym użytkownikom wykonywać polecenia z prawami administratora w sposób kontrolowany i audytowalny.

---

## 📄 Plik konfiguracyjny /etc/sudoers

Konfiguracja praw przydzielanych przez `sudo` znajduje się w pliku `/etc/sudoers`.
Tradycyjny wpis pozwalający na pełny dostęp:
```text
kamil    ALL=(ALL:ALL) ALL
```
### Rozbicie konfiguracji:
1. **Kto:** Użytkownik `kamil` (lub `%admin` – grupa admin).
2. **Gdzie (Hosty):** Pierwsze `ALL` określa, na jakich terminalach/hostach reguła obowiązuje.
3. **Jako kto (Użytkownicy:Grupy):** `(ALL:ALL)` oznacza, że polecenie można wywołać jako dowolny użytkownik i grupa w systemie.
4. **Co (Polecenia):** Ostatnie `ALL` (lub lista ścieżek) definiuje dozwolone komendy.

---

## 🛠️ Zabezpieczenie Visudo

Nigdy nie należy edytować pliku `/etc/sudoers` bezpośrednio w edytorze nano czy vim (np. `nano /etc/sudoers`). Popełnienie nawet najmniejszego błędu składniowego (np. brak spacji) zablokuje działanie polecenia `sudo` dla wszystkich użytkowników w systemie, odcinając administratora od możliwości naprawy systemu.

Zamiast tego używamy dedykowanego narzędzia:
```bash
sudo visudo
```
* **Dlaczego visudo?** Otwiera plik w domyślnym edytorze, a przy próbie zapisu **waliduje składnię**. Jeśli wykryje błąd, zapyta, co zrobić i zablokuje zapisanie uszkodzonego pliku na dysku.

---

## 🔬 Nadawanie uprawnień granularnych

Dobrą praktyką bezpieczeństwa jest zasada minimalnych uprawnień. Zamiast dawać pełnego roota, dajemy technikowi prawo wyłącznie do restartowania konkretnej usługi bez pytania o hasło:

Dopisek w `/etc/sudoers`:
```text
technik   ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
```
Od tej pory użytkownik `technik` może wywołać komendę `sudo systemctl restart nginx` bez podawania swojego hasła, ale każda próba wywołania `sudo systemctl stop nginx` zostanie natychmiast zablokowana.

---

## 🛠️ Punkt Kontrolny: Sudo i Visudo
<data-gate>
  <data-quiz>
    <question>
Dlaczego bezwzględnie należy używać polecenia visudo zamiast bezpośredniej edycji pliku /etc/sudoers w zwykłym edytorze tekstu?
    </question>
    <options>
      <item correct>Ponieważ visudo automatycznie weryfikuje składnię pliku przed zapisem, chroniąc system przed całkowitym zablokowaniem dostępu do uprawnień sudo.</item>
      <item>Ponieważ visudo automatycznie szyfruje plik kluczem publicznym SSH.</item>
      <item>Ponieważ zwykły edytor tekstu nie jest w stanie otworzyć plików z katalogu /etc.</item>
    </options>

<div data-hint="error">
  Błąd składniowy w pliku sudoers powoduje awarię całego podsystemu `sudo`. Zastanów się, jak administrator mógłby wtedy uruchomić cokolwiek z prawami roota.
</div>
<div data-hint="success">
  Znakomicie! Walidacja składni w `visudo` to krytyczny mechanizm bezpieczeństwa chroniący przed odcięciem dostępu administracyjnego.
</div>
  </data-quiz>
</data-gate>
