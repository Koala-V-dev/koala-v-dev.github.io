# Zdalne zarządzanie drugą maszyną przez SSH

VM1 i VM2 komunikują się już przez sieć wewnętrzną VirtualBoxa.  
Terza musmy dokończyć konfigurację z racji że są to importy tej samej maszyny wirtualnej to musimy dokonać zmian by się w tym nie pogóbić.

Wystarczy że zmodyfikujemy nazy sieciowe czyli hostname i dodamy dedykowanych nowych użytkowników:
- VM1:
  - Nazwa hosta: vm1
  - Użytkownik: egza-vm1
- VM2:
  - Nazwa hosta: vm2
  - Użytkownik: egza-vm2


Na początek zmieńmy nazwy sieciowych na takie, żeby się nie pogubić w wirtualnym środowisku.

```bash
sudo nano /etc/hostname
```
i potem zweryfikujemy to komendą:
```bash
hostname
```
Jak widzisz wynik się nie zgadza ponieważ jądro go nie zastosowało musisz więc zrestartować system.

```bash
reboot
```

Alternatywnie musiałbyś zrestartować usługę `systemd-hostnamed`:
```bash
sudo systemctl restart systemd-hostnamed
```
Lub jeszcze inaczej. Możesz ustawić nazwę hosta i odrazu się zastopsuje.
```bash
hostnamectl hostname vm1
```

![Konfiguracja hostname i dodanie użytkowników na obu maszynach](/public/courses/ubuntu-26/Images/hostname-konfig-for-ssh.png)

## 📦 Instalacja serwera SSH na VM2

Każdy system desktopowy powinien mieć domyślnie zainstalowanego kilenta ssh.
Dlatego na VM2 musimy doinstalować pakiet `openssh-server`, który nie jest domyślnie zainstalowany.

```bash
sudo apt install openssh-server -y
```
> Opcja `-y` pomija pytania o potwierdzenie instalacji pakietów.

Po instalacji sprawdź usługę:

```bash
systemctl status ssh
```

Jeżeli wykonasz powyższą komendę na VM1, gdzie pakiet `openssh-server` nie powinien być zainstalowany, otrzymasz komunikat:
**_Unit ssh.service could not be found._**

![Weryfikacja statusu usługi ssh server](/public/courses/ubuntu-26/Images/status-ssh-desktop.png)

Natomiast na VM2, gdzie zainstalowałeś pakiet `openssh-server`, zobaczysz wynik działania usługi. Przykładowe pola:

- `Active: inactive (dead)`: serwer SSH jest zainstalowany, ale aktualnie nie działa.
- `Loaded: ... disabled; preset: enabled`: usługa jest domyślnie wyłączona (disabled).
Ten drugi „preset: enabled” oznacza jedynie, że pakiet ma domyślną możliwość startu przy uruchamianiu systemu.

Aby uruchomić usługę i jednocześnie włączyć jej automatyczny start przy bootowaniu systemu, wpisz:

```bash
sudo systemctl enable --now ssh
```
Po wykonaniu tej komendy status powinien być w pełni „na zielono”, czyli:
- Active: **active (running)**
- Loaded i preset: **enabled**

![Status serwera SSH na VM2 po uruchomieniu](/public/courses/ubuntu-26/Images/status-usługi-ssh-server.png)



## 🔐 Pierwsze połączenie z VM1

Aby połączyć się z jakąś maszyną na której jest zainstalowny server ssh użyj polecenia:

```bash
ssh [UŻYTKOWNIK]@[IP_ADDRESS]
```

W naszym przypadku bedzie to:
```bash
ssh egza-vm2@192.168.50.20
```

Podczas pierwszego połączenia klient nie zna jeszcze klucza hosta VM2. Wyświetli odcisk klucza i zapyta, czy ufasz tej maszynie.

Wpisz `yes` i wciśnij klawisz <kbd>Enter</kbd>. Klient zapisze klucz hosta w `~/.ssh/known_hosts` na VM1.

Następnie podaj hasło konta z VM2. Podczas wpisywania hasła terminal nie wyświetla znaków ani gwiazdek.

![Pierwsze połączenie z VM1 do VM2](/public/courses/ubuntu-26/Images/połączenie-ssh-z-drugą-maszyną.png)

Po zalogowaniu prompt może wyglądać prawie tak samo jak lokalny. Sprawdź więc **gdzie jesteś**:

```bash
hostname
whoami
ip -br address
```

Zakończ sesję poleceniem:

```bash
exit
```

---

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Matematyka kryptograficzna SSH: Krzywe Eliptyczne Ed25519 vs RSA i wymiana kluczy ECDH</span><span class="deep-dive-badge">Cryptography & SSH Protocol</span></summary>

Protokół SSHv2 (*Secure Shell*) rozwiązuje fundamentalny problem kryptografii: jak dwa nieznające się komputery mogą przez podsłuchiwaną sieć ustanowić tajny, wspólny klucz szyfrowania symetrycznego AES bez przesyłania żadnego hasła przez kabel?

### 1. Wymiana kluczy Diffie-Hellman na Krzywych Eliptycznych (ECDH)
Nawiązanie połączenia SSH rozpoczyna się od protokołu **ECDH** (*Elliptic Curve Diffie-Hellman*):
1. Serwer i klient uzgadniają parametry krzywej eliptycznej oraz punkt bazowy $G$.
2. Klient generuje losowy klucz prywatny $a$ i wysyła serwerowi klucz publiczny $A = a \cdot G$.
3. Serwer generuje losowy klucz prywatny $b$ i wysyła klientowi klucz publiczny $B = b \cdot G$.
4. Klient oblicza wspólny sekret: $S = a \cdot B = a \cdot (b \cdot G)$.
5. Serwer oblicza identyczny sekret: $S = b \cdot A = b \cdot (a \cdot G)$.

Podsłuchujący w sieci widzi punkty $A$ i $B$, ale z powodu trudności problemu logarytmu dyskretnego na krzywych eliptycznych (ECDLP) nie jest w stanie odtworzyć wartości $a$, $b$ ani wspólnego sekretu $S$. Z sekretu $S$ obie strony wyprowadzają symetryczny klucz AES-256-GCM, którym szyfrowana jest cała dalsza sesja terminala.

### 2. Dlaczego Ed25519 zamiast przestarzałego RSA-2048?
Tradycyjne klucze RSA opierają się na trudności faktoryzacji wielkich liczb pierwszych ($n = p \cdot q$):
- Aby zapewnić 128-bitowy poziom bezpieczeństwa, klucz RSA musi mieć długość aż **$3072\ \text{bity}$**.
- Generowanie podpisu RSA jest powolne i podatne na ataki czasowe (*Timing Attacks*).

Nowoczesny standard **Ed25519** (oparty na skręconej krzywej Edwardsa) oferuje ten sam poziom bezpieczeństwa przy kluczu o długości zaledwie **$256\ \text{bitów}$** (32 bajty):
$$x^2 + y^2 = 1 + d \cdot x^2 y^2 \quad \text{nad ciałem skończonym } \mathbb{F}_{2^{255}-19}$$
gdzie $d = -\frac{121665}{121666}$.

Zalety inżynierskie Ed25519:
- Stały czas wykonania instrukcji (*Constant Time*): całkowita odporność na ataki typu side-channel badające czas odpowiedzi procesora.
- Ekstremalna szybkość: weryfikacja podpisu wymaga ułamka milisekundy na procesorze x86_64.
- Krótkie odciski palców klucza, łatwe do weryfikacji przez człowieka w pliku `known_hosts`.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Architektura klient-serwer:** Maszyna łącząca się jest klientem SSH (`ssh`), natomiast maszyna zdalna wymaga działającego demona `sshd` (pakiet `openssh-server`).
- **Weryfikacja tożsamości hosta:** Przy pierwszym połączeniu klient weryfikuje odcisk klucza publicznego serwera i zapisuje go w `~/.ssh/known_hosts`, co chroni przed atakami typu Man-in-the-Middle (MITM).
- **Zarządzanie usługą ssh:** Włączenie automatycznego startu i natychmiastowe uruchomienie realizuje polecenie `sudo systemctl enable --now ssh`.
- **Weryfikacja sesji:** Po zalogowaniu należy zawsze potwierdzić tożsamość i maszynę za pomocą poleceń `hostname`, `whoami` oraz `ip -br address`.
- **Kryptografia Ed25519:** Nowoczesne klucze oparte na krzywych eliptycznych oferują wyższe bezpieczeństwo i stały czas wykonania w porównaniu do klasycznego RSA.