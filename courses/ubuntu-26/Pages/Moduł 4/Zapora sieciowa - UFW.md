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

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Pod maską: Od iptables do nftables i maszyn wirtualnych eBPF w jądrze Linuksa</span><span class="deep-dive-badge">Kernel Packet Filtering & eBPF</span></summary>

UFW to zaledwie przyjazna dla człowieka nakładka w języku Python. Pod spodem jądro Linuksa przetwarza każdy przychodzący pakiet sieciowy w ultrawydajnym silniku reguł.

### 1. Ewolucja podsystemu filtrowania jądra
Przez dekady podsystemem zapory sieciowej był **`iptables`** (oparty na hakach *Netfilter*). Posiadał on jednak wady architektoniczne: każda zmiana reguły wymagała zrzucenia i ponownego załadowania całej tablicy reguł w pamięci jądra.

Współczesne systemy (w tym Ubuntu 24.04/26.04) jako backend dla UFW wykorzystują **`nftables`**:
- Nftables traktuje jądro jako maszynę wirtualną wykonującą miniaturowy kod bajtowy.
- Reguły są reprezentowane jako zestawy wyrażeń: sprawdź nagłówek TCP $\to$ sprawdź port docelowy $\to$ podejmij akcję `ACCEPT` lub `DROP`.
- Zmiany reguł są w pełni **atomowe**: dodanie lub usunięcie portu nie przerywa trwających połączeń TCP.

```
   Pakiet sieciowy z karty sieciowej (struct sk_buff)
                       │
                       ▼
             Haki jądra Netfilter:
   [ PREROUTING ] ──> [ INPUT ] ──> Aplikacja (np. sshd)
                            │
                      Maszyna nftables / eBPF:
                      1. Czy proto == TCP? (TAK)
                      2. Czy dport == 22? (TAK)
                      3. Czy src == 192.168.50.10? (TAK)
                      ==> Werdykt: NF_ACCEPT
```

### 2. Rewolucja eBPF (Extended Berkeley Packet Filter)
Tradycyjna zapora sieciowa sprawdza pakiet dopiero po tym, jak sterownik karty sieciowej przekaże go do stosu sieciowego jądra i zaalokuje strukturę `struct sk_buff`.

Nowoczesne środowiska wysokiej wydajności (np. Cloudflare, Meta) stosują technologię **eBPF**:
- Administrator kompiluje kod w C do kodu bajtowego eBPF i wstrzykuje go bezpośrednio do jądra.
- Program eBPF jest weryfikowany pod kątem bezpieczeństwa pamięci (*in-kernel verifier*), a następnie tłumaczony w locie (JIT) na natywny kod maszynowy x86_64.
- Program może zostać podpięty pod warstwę **XDP** (*eXpress Data Path*) w samym sterowniku karty sieciowej: niepożądane pakiety są odrzucane w ułamku nanosekundy, zanim jądro zdąży w ogóle zaalokować dla nich pamięć RAM!

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **UFW** filtruje ruch na podstawie reguł i polityk domyślnych.
- Krótkie reguły otwierają lub blokują dostęp dla portów i protokołów.
- Klauzula `from IP` w pełnej składni precyzyjnie ogranicza dostęp do zaufanego źródła.
- Lista `status numbered` pozwala usuwać konkretne wpisy na podstawie ich numeru indeksu.
