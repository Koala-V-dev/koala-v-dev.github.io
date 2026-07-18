# Hardening i zabezpieczenie usługi SSH

Protokół **SSH (Secure Shell)** służy do zdalnego zarządzania serwerami Linux. Ponieważ port SSH ($22$) jest nieustannie skanowany przez boty w poszukiwaniu podatności i słabych haseł, odpowiednie zabezpieczenie (hardening) tej usługi to bezwzględny obowiązek każdego administratora.

---

## 🔑 Klucze asymetryczne: Zapomnij o hasłach

Najbezpieczniejszym sposobem autoryzacji jest użycie pary kluczy kryptograficznych: **klucza prywatnego** (który zostaje na Twoim komputerze) oraz **klucza publicznego** (który wgrywasz na serwer).

### Krok 1: Wygeneruj parę kluczy na stacji roboczej
Zalecamy stosowanie nowoczesnego i wysoce bezpiecznego algorytmu **Ed25519**:
```bash
ssh-keygen -t ed25519 -C "admin@moj_serwer"
```

### Krok 2: Prześlij klucz publiczny na serwer
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub uzytkownik@adres_ip_serwera
```
Polecenie to automatycznie dopisze Twój klucz publiczny do pliku `~/.ssh/authorized_keys` na profilu użytkownika na serwerze.

---

## 🔒 Hardening pliku sshd_config

Konfiguracja demona SSH znajduje się w pliku `/etc/ssh/sshd_config`. Aby zabezpieczyć usługę, zmodyfikuj poniższe wpisy (używając uprawnień roota):

```text
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
```

### Wyjaśnienie dyrektyw:
* **Port 2222:** Zmiana domyślnego portu z $22$ na niestandardowy (np. $2222$) drastycznie zmniejsza liczbę automatycznych skanów i ataków brute-force (tzw. "security through obscurity", które stanowi dobrą pierwszą linię obrony przed masowymi botami).
* **PermitRootLogin no:** Całkowity zakaz logowania bezpośrednio na konto `root`. Logujesz się jako zwykły użytkownik, a uprawnienia podnosisz przez `sudo`.
* **PasswordAuthentication no:** Wyłączenie logowania tradycyjnym hasłem. Od tego momentu dostęp uzyska wyłącznie posiadacz autoryzowanego klucza prywatnego.
* **MaxAuthTries 3:** Maksymalna liczba prób autoryzacji w ramach jednej sesji przed rozłączeniem.

---

## 🛠️ Punkt Kontrolny: Hardening SSH
<data-gate>
  <data-quiz>
    <question>
Która dyrektywa w pliku /etc/ssh/sshd_config całkowicie uniemożliwi botom próby łamania haseł użytkowników metodą brute-force poprzez sieć?
    </question>
    <options>
      <item correct>PasswordAuthentication no</item>
      <item>PermitRootLogin no</item>
      <item>PubkeyAuthentication yes</item>
    </options>

<div data-hint="error">
  Musisz całkowicie wyłączyć możliwość podawania tradycyjnych haseł tekstowych podczas logowania SSH, wymuszając logowanie kluczami.
</div>
<div data-hint="success">
  Doskonale! Ustawienie `PasswordAuthentication no` wyłącza obsługę haseł, sprawiając, że ataki brute-force stają się fizycznie niemożliwe do wykonania.
</div>
  </data-quiz>
</data-gate>
