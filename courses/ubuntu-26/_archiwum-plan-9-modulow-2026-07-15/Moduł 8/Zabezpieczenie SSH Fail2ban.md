# Fail2ban: Automatyczna defensywa serwera

Ręczne analizowanie logów i blokowanie adresów IP agresorów jest niewydajne. Narzędzie **Fail2ban** automatyzuje ten proces – skanuje logi systemowe (np. błędy logowania w usłudze SSH) i na bazie zdefiniowanych reguł automatycznie blokuje adresy IP atakujących w systemowej zaporze sieciowej.

---

## ⚙️ Architektura działania Fail2ban

Fail2ban opiera się na trzech pojęciach:
1. **Filtry (Filters):** Wzorce wyrażeń regularnych (regex), które określają, jak wygląda nieudana próba logowania w logu (np. wzorzec wyszukujący "Failed password for...").
2. **Akcje (Actions):** Definicja tego, co Fail2ban ma zrobić po wykryciu ataku (np. dopisać IP do reguły ufw deny, wysłać e-mail administratorowi).
3. **Areszty (Jails):** Połączenie filtra z akcją dla danej usługi.

---

## 🛠️ Konfiguracja aresztu dla SSH

Nigdy nie edytujemy domyślnego pliku `/etc/fail2ban/jail.conf`. Wszystkie własne ustawienia wpisujemy do pliku lokalnego `/etc/fail2ban/jail.local`.

Przykładowa konfiguracja aresztu dla usługi SSH w `/etc/fail2ban/jail.local`:
```ini
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3
findtime = 10m
bantime = 1h
banaction = ufw
```

### Wyjaśnienie parametrów:
* **maxretry = 3:** Adres IP zostanie zablokowany po wykryciu $3$ nieudanych prób logowania.
* **findtime = 10m:** Czas, w jakim te $3$ próby muszą nastąpić (np. w ciągu ostatnich $10$ minut).
* **bantime = 1h:** Czas trwania blokady (np. $1$ godzina). Jeśli ustawimy wartość $-1$, adres zostanie zablokowany na stałe.
* **banaction = ufw:** Akcja blokująca. Fail2ban automatycznie doda regułę blokującą do zapory UFW.

---

## 🔍 Zarządzanie stanem blokad

Do interakcji z Fail2ban służy polecenie `fail2ban-client`:
* Sprawdź status aresztów: `sudo fail2ban-client status`.
* Sprawdź zablokowane adresy IP w areszcie sshd: `sudo fail2ban-client status sshd`.
* Ręczne odblokowanie (unban) niesłusznie zablokowanego adresu IP:
  ```bash
  sudo fail2ban-client set sshd unbanip 192.168.1.50
  ```

---

## 🛠️ Punkt Kontrolny: Defensywa z Fail2ban
<data-gate>
  <data-quiz>
    <question>
Który parametr w pliku jail.local definiuje czas trwania automatycznej blokady adresu IP po wykryciu próby włamania?
    </question>
    <options>
      <item correct>bantime</item>
      <item>findtime</item>
      <item>maxretry</item>
    </options>

<div data-hint="error">
  Parametr ten bezpośrednio odnosi się do angielskiego słowa określającego banicję lub blokadę (ban time).
</div>
<div data-hint="success">
  Świetnie! Parametr `bantime` pozwala określić czas trwania aresztu (np. w minutach `m`, godzinach `h` lub sekundach).
</div>
  </data-quiz>
</data-gate>
