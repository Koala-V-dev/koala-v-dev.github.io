# Bezpieczne administrowanie - protokół SSH i szyfrowanie asymetryczne

Historyczny protokół Telnet przesyłał wszystkie polecenia, nazwy użytkowników i hasła otwartym tekstem przez port 23, przez co każdy sniffer w sieci lokalnej (np. Wireshark) mógł przechwycić dane uwierzytelniające. Protokół **SSH** (*Secure Shell*, RFC 4251, port TCP 22) eliminuje ten problem, tworząc szyfrowany tunel kryptograficzny w oparciu o algorytm wymiany kluczy Diffie-Hellmana oraz uwierzytelnianie kluczami asymetrycznymi. Po tej lekcji będziesz umiał wygenerować parę kluczy Ed25519, skonfigurować logowanie bezhasłowe do serwera Linux oraz zabezpieczyć demona `sshd` przed atakami brute-force.

## 🔐 Laboratorium kluczy SSH Ed25519 i utwardzania sshd

Wygeneruj parę kluczy, skopiuj klucz publiczny na serwer, przetestuj wpływ błędnych uprawnień POSIX (`777/644`) oraz wykrywanie podmiany klucza hosta (`known_hosts`):

<data-ssh-auth-lab></data-ssh-auth-lab>

![Bezpieczny kanał SSH i autoryzacja asymetryczna](/public/courses/podstawy-sieci-komputerowych/Images/ssh-kryptografia-i-uwierzytelnianie.svg)

---

## 🔍 Co trzeba odczytać przed zmianą

Sprawdź, czy na serwerze usługa SSH jest aktywna oraz jaki port TCP zajmuje.

Na serwerze **Linux**:

```bash
sudo systemctl status ssh || sudo systemctl status sshd
ss -tlpn 'sport = :22'
```

Na stacji klienta (Windows / Linux) sprawdź, czy w katalogu domowym istnieją już wygenerowane klucze:

Na systemie **Windows (PowerShell)**:

```powershell
Test-Path "$HOME\.ssh\id_ed25519"
```

Na systemie **Linux**:

```bash
ls -la ~/.ssh/
```

> [!NOTE]
> W kryptografii asymetrycznej SSH:
> - **Klucz prywatny (`id_ed25519`):** Pozostaje **wyłącznie** na Twoim komputerze. Musi mieć restrykcyjne uprawnienia (odczyt tylko dla właściciela). Jeśli klucz wycieknie, każdy może zalogować się na Twój serwer.
> - **Klucz publiczny (`id_ed25519.pub`):** Może być bezpiecznie przekazywany publicznie. Kopiuje się go na serwer docelowy do pliku `~/.ssh/authorized_keys`.

---

## ⚙️ Zmiana istniejącej konfiguracji

Zrealizujmy procedurę wdrożenia bezpiecznego logowania kluczem Ed25519 (nowoczesny, szybki algorytm oparty na krzywych eliptycznych, zalecany zamiast przestarzałego RSA):

### 🔑 Krok 1: Wygenerowanie pary kluczy na stacji roboczej klienta

W terminalu klienta (PowerShell lub Linux Bash):

```bash
ssh-keygen -t ed25519 -C "admin@stanowisko-dev"
```

*(Wciśnij Enter, aby zaakceptować domyślną ścieżkę w `~/.ssh/id_ed25519`. Opcjonalnie podaj hasło passphrase chroniące klucz).*

### 📤 Krok 2: Skopiowanie klucza publicznego na serwer

Z poziomu systemu **Linux**:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub administrator@192.168.10.2
```

Z poziomu systemu **Windows (PowerShell)**:

```powershell
Get-Content "$HOME\.ssh\id_ed25519.pub" | ssh administrator@192.168.10.2 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

### 🛡️ Krok 3: Utwardzenie konfiguracji serwera (`/etc/ssh/sshd_config`)

Po potwierdzeniu działania klucza wyłącz podatne na ataki słownikowe logowanie tradycyjnym hasłem oraz bezpośredni dostęp na konto `root`.

W pliku `/etc/ssh/sshd_config` na serwerze odnajdź i zmień:

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Test składni konfiguracji serwera SSH przed restartem:

```bash
sudo sshd -t
```

Jeśli polecenie nie zwraca żadnego błędu, składnia jest poprawna. Zastosuj zmiany:

```bash
sudo systemctl restart ssh
```

---

## 🚀 Uruchomienie i test z klienta

Zaloguj się na serwer ze stacji roboczej:

```bash
ssh administrator@192.168.10.2
```

Oczekiwany dowód połączenia bez pytania o hasło użytkownika:

```text
Authenticated to 192.168.10.2 ([192.168.10.2]:22) using "publickey".
Welcome to Ubuntu 24.04 LTS ...
administrator@serwer:~$ 
```

Weryfikacja tożsamości serwera w pliku `~/.ssh/known_hosts`:
Przy pierwszym logowaniu SSH wyświetliło odcisk klucza serwera (Host Key Fingerprint). Po zaakceptowaniu odcisk został utrwalony w pliku `~/.ssh/known_hosts`. Jeśli ktoś spróbuje podmienić serwer w sieci (atak Man-in-the-Middle), klient natychmiast zablokuje połączenie z ostrzeżeniem:
`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`.

---

## 🛠️ Samodzielna próba

Klasycznym błędem podczas konfiguracji SSH jest odmowa logowania kluczem (`Permission denied (publickey)`), spowodowana zbyt luźnymi uprawnieniami do katalogu `~/.ssh` lub pliku `authorized_keys` w systemie Linux (demon `sshd` odrzuca klucze ze względów bezpieczeństwa, jeśli inni użytkownicy systemu mają prawo zapisu do tych plików).

Twoje zadanie:
1. Sprawdź i ustaw poprawne uprawnienia POSIX na serwerze:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
2. Na stacji roboczej klienta uruchom połączenie SSH w trybie szczegółowej diagnostyki (Verbose):
   ```bash
   ssh -vvv administrator@192.168.10.2
   ```
3. Zidentyfikuj w logach moment, w którym klient oferuje klucz `Offering public key: ... ED25519` oraz serwer akceptuje podpis `Server accepts key`.

Kryteria ukończenia:
- Klient łączy się bezpośrednio przy użyciu klucza asymetrycznego bez podawania hasła tekstowego.
- Uprawnienia na serwerze uniemożliwiają innym użytkownikom modyfikację pliku `authorized_keys`.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Polecenie sprawdzające uprawnienia na serwerze:
```bash
ls -ld ~/.ssh && ls -l ~/.ssh/authorized_keys
```

Poprawny wynik:
```text
drwx------ 2 administrator administrator 4096 ~/.ssh
-rw------- 1 administrator administrator  102 ~/.ssh/authorized_keys
```

Jeśli na stacji z systemem Windows pojawi się błąd `Permissions for 'id_ed25519' are too open`, zresetuj uprawnienia pliku klucza prywatnego, usuwając dziedziczenie i przyznając pełną kontrolę wyłącznie Twojemu użytkownikowi.

</details>

---

## 🔒 Sprawdzenie wiedzy: Klucze i zabezpieczenia SSH

<data-gate>
  <data-connection-matcher title="Połącz plik lub dyrektywę SSH z jej funkcją bezpieczeństwa">
    <div class="cmw-item" data-left="~/.ssh/id_ed25519" data-right="Klucz prywatny klienta: podpisuje wyzwanie serwera, nie opuszcza stacji"></div>
    <div class="cmw-item" data-left="~/.ssh/authorized_keys (chmod 600)" data-right="Lista zaufanych kluczy publicznych po stronie serwera"></div>
    <div class="cmw-item" data-left="~/.ssh/known_hosts" data-right="Odciski kluczy serwerów chroniące przed atakiem Man-in-the-Middle"></div>
    <div class="cmw-item" data-left="PasswordAuthentication no" data-right="Wyłącza logowanie hasłem w sshd_config przeciw botom brute-force"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Autoryzacja kluczem:** Serwer nie przechowuje Twojego sekretu: wysyła losowe wyzwanie (challenge), które klient podpisuje swoim kluczem prywatnym, a serwer weryfikuje to kluczem publicznym z `authorized_keys`.
- **Rola known_hosts:** Plik chroni przed podsłuchem i podmianą serwera (MITM). Zmiana klucza hosta na serwerze bez wiedzy administratora jest krytycznym sygnałem alarmowym.
- **Utwardzenie sshd:** Wyłączenie `PasswordAuthentication` oraz `PermitRootLogin` blokuje ponad 99% automatycznych botów skanujących Internet w poszukiwaniu łatwych celów.
