# UFW: Prosta zapora sieciowa na straży serwera

Bezpieczeństwo sieciowe serwera opiera się na kontrolowaniu ruchu przychodzącego i wychodzącego. W systemie Linux za filtrowanie pakietów odpowiada podsystem **Netfilter/Nftables**. Ponieważ konfiguracja surowych reguł iptables jest skomplikowana, Ubuntu dostarcza nakładkę **UFW (Uncomplicated Firewall)**, ułatwiającą zarządzanie regułami zapory.

---

## 🛡️ Podstawowa zasada działania i profilaktyka

Przed włączeniem zapory należy bezwzględnie zdefiniować regułę zezwalającą na ruch SSH. W przeciwnym razie włączenie firewallu natychmiast zerwie Twoje zdalne połączenie z serwerem.

### Złota zasada włączania UFW:
1. **Dopuszczenie SSH:** `sudo ufw allow 22` (lub `sudo ufw allow 2222` jeśli zmieniłeś port).
2. **Włączenie zapory:** `sudo ufw enable`.
3. **Podgląd statusu:** `sudo ufw status verbose`.

---

## ⚙️ Zaawansowane reguły zapory

UFW pozwala na precyzyjne definiowanie reguł stanowych (stateful):

* **Ograniczanie liczby połączeń (Limit):** Chroni serwer przed prostymi próbami ataków DoS lub brute-force:
  ```bash
  sudo ufw limit ssh
  ```
  (reguła ta zablokuje adres IP, jeśli spróbuje on nawiązać $6$ lub więcej połączeń w ciągu ostatnich $30$ sekund).
* **Blokowanie konkretnego adresu IP:**
  ```bash
  sudo ufw deny from 192.168.1.50
  ```
* **Dopuszczanie ruchu tylko na określony port z wybranej podsieci:**
  ```bash
  sudo ufw allow from 192.168.1.0/24 to any port 3306 proto tcp
  ```
  (zezwala na połączenia z bazą danych MySQL tylko z sieci lokalnej).

---

## 📱 Profile Aplikacji (App Profiles)

UFW integruje się z systemowym menedżerem pakietów. Aplikacje mogą dostarczać gotowe profile otwierania portów, które aktywujemy za pomocą ich nazwy technicznej:
* Zobacz dostępne profile: `sudo ufw app list`.
* Zezwól na ruch www: `sudo ufw allow "Nginx Full"`.

---

## 🛠️ Punkt Kontrolny: Zapora sieciowa UFW
<data-gate>
  <data-quiz>
    <question>
Jaka komenda UFW pozwala na zabezpieczenie portu SSH przed szybkim brute-force poprzez ograniczenie liczby połączeń do max 5 na 30 sekund?
    </question>
    <options>
      <item correct>sudo ufw limit ssh</item>
      <item>sudo ufw deny ssh/bruteforce</item>
      <item>sudo ufw allow ssh/rate-limit</item>
    </options>

<div data-hint="error">
  Słowo kluczowe w tym poleceniu oznacza "ograniczać" lub "limitować".
</div>
<div data-hint="success">
  Świetnie! Użycie `ufw limit` to najprostszy sposób na automatyczne wyciszenie spamerów SSH bez konieczności instalowania dodatkowego oprogramowania.
</div>
  </data-quiz>
</data-gate>
