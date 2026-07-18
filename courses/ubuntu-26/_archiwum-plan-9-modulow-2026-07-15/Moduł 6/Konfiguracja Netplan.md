# Netplan: Nowoczesna konfiguracja sieci

W dystrybucjach Ubuntu klasyczna konfiguracja interfejsów w `/etc/network/interfaces` została zastąpiona przez menedżer **Netplan**. Umożliwia on deklaratywne opisywanie stanu sieci za pomocą czytelnych plików struktury **YAML**.

---

## 📄 Struktura pliku YAML Netplana

Pliki konfiguracyjne Netplana znajdują się w katalogu `/etc/netplan/` (np. `01-netcfg.yaml`). 

Przykładowa konfiguracja interfejsu ze statycznym adresem IP oraz DNS:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.1.150/24
      nameservers:
        addresses:
          - 8.8.8.8
          - 1.1.1.1
      routes:
        - to: default
          via: 192.168.1.1
```

### Wyjaśnienie słów kluczowych:
* **renderer:** Definiuje silnik wykonawczy. Zazwyczaj `networkd` (dla serwerów bez GUI) lub `NetworkManager` (dla stacji roboczych z desktopem).
* **ethernets:** Sekcja zawierająca konfigurację fizycznych kart sieciowych (np. karty `enp0s3`).
* **dhcp4:** Ustawienie `no` wyłącza dynamiczne pobieranie adresu IPv4 z serwera DHCP.
* **addresses:** Lista przypisanych adresów IP wraz z maską podsieci w formacie CIDR (np. `/24` odpowiada masce `255.255.255.0`).
* **nameservers:** Adresy serwerów DNS.
* **routes:** Definicja bramy domyślnej (routing).

---

## 🛠️ Stosowanie i testowanie zmian: Tryb bezpieczny

Ponieważ błędna konfiguracja sieci na zdalnym serwerze (np. w chmurze AWS) odetnie Cię od dostępu SSH, Netplan posiada wbudowany tryb bezpieczny zatwierdzania zmian.

### Krok 1: Przetestuj konfigurację
Zamiast bezpośrednio stosować parametry, uruchom:
```bash
sudo netplan try
```
* **Jak to działa?** Netplan nakłada nową konfigurację i uruchamia odliczanie (domyślnie $120$ sekund). Jeśli w tym czasie nie klikniesz klawisza Enter (ponieważ np. straciłeś połączenie z serwerem), Netplan automatycznie przywróci poprzednie, działające ustawienia sieci.

### Krok 2: Ostateczne zastosowanie
Jeśli połączenie nie zostało zerwane i konfiguracja działa poprawnie, zatwierdź zmiany na stałe:
```bash
sudo netplan apply
```

> [!WARNING]
> Pliki YAML są niezwykle wrażliwe na wcięcia. Używaj wyłącznie spacji (nigdy tabulatorów!) do budowania drzewa wcięć. Nawet pojedyncza nadmiarowa spacja uniemożliwi sparsowanie pliku.

---

## 🛠️ Punkt Kontrolny: Konfiguracja Netplan
<data-gate>
  <data-quiz>
    <question>
Jaka komenda pozwala bezpiecznie przetestować nowe ustawienia sieciowe w Netplanie z opcją automatycznego rollbacku w razie utraty połączenia?
    </question>
    <options>
      <item correct>sudo netplan try</item>
      <item>sudo netplan apply</item>
      <item>sudo netplan generate</item>
    </options>

<div data-hint="error">
  Słowo to oznacza po angielsku "spróbuj" lub "przetestuj".
</div>
<div data-hint="success">
  Doskonale! Polecenie `netplan try` to kluczowa komenda zapobiegająca odcięciu od zdalnego serwera przy pomyłkach w konfiguracji sieci.
</div>
  </data-quiz>
</data-gate>
