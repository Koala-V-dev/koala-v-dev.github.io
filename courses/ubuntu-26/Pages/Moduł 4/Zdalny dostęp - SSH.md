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

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- VM1 jest klientem SSH, a VM2 przyjmuje połączenia dzięki pakietowi `openssh-server`.
- Po zalogowaniu potwierdzasz maszynę i użytkownika poleceniami `hostname` oraz `whoami`.