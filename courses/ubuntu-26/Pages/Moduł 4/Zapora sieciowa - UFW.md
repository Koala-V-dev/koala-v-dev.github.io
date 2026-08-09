# Zapora sieciowa - UFW

**UFW** (*Uncomplicated Firewall*) zarządza regułami zapory Netfilter w Linuksie, kontrolując ruch na podstawie kierunku, adresu IP, portu i protokołu.

## 🚀 Stacja treningowa: podstawowe reguły UFW

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m4-01-ufw-podstawy.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw narzędzi: komendy UFW

| Polecenie                   | Działanie                                            | Przykład                   |
| :-------------------------- | :--------------------------------------------------- | :------------------------- |
| `sudo ufw status`           | Pokazuje stan UFW.                                   | `sudo ufw status`          |
| `sudo ufw status verbose`   | Wyświetla stan, domyślne polityki i aktywne reguły.  | `sudo ufw status verbose`  |
| `sudo ufw status numbered`  | Wyświetla reguły z numeracją indeksów.               | `sudo ufw status numbered` |
| `sudo ufw show added`       | Pokazuje reguły zdefiniowane przed aktywacją zapory. | `sudo ufw show added`      |
| `sudo ufw allow PORT/PROTO` | Otwiera port dla wskazanego protokołu.               | `sudo ufw allow 443/tcp`   |
| `sudo ufw deny PORT/PROTO`  | Blokuje ruch na wskazanym porcie.                    | `sudo ufw deny 23/tcp`     |
| `sudo ufw enable`           | Włącza zaporę.                                       | `sudo ufw enable`          |
| `sudo ufw disable`          | Wyłącza zaporę.                                      | `sudo ufw disable`         |
| `sudo ufw delete NUMER`     | Usuwa regułę o wskazanym numerze.                    | `sudo ufw delete 3`        |

## ⚙️ Składnia reguły ograniczonej do adresu

Pełna reguła precyzuje źródło, cel, port i protokół:

```bash
sudo ufw allow from 192.168.50.10 to any port 22 proto tcp
```

| Fragment             | Znaczenie                                 |
| :------------------- | :---------------------------------------- |
| `allow`              | Zezwala na ruch.                          |
| `from 192.168.50.10` | Określa adres źródłowy IP.                |
| `to any`             | Dotyczy wszystkich interfejsów lokalnych. |
| `port 22`            | Port docelowy.                            |
| `proto tcp`          | Protokół transportowy.                    |

## 🎯 Misja: wymiana reguły SSH

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m4-01-regula-testowa-ufw.md"></data-terminal-mission>
</data-gate>


---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **UFW** filtruje ruch na podstawie reguł i polityk domyślnych.
- Krótkie reguły otwierają lub blokują dostęp dla portów i protokołów.
- Klauzula `from IP` w pełnej składni precyzyjnie ogranicza dostęp do zaufanego źródła.
- Lista `status numbered` pozwala usuwać konkretne wpisy na podstawie ich numeru indeksu.
