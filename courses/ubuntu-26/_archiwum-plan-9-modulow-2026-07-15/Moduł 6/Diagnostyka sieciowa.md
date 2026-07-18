# Diagnostyka sieciowa nowej generacji

W nowoczesnych systemach Linux przestarzałe polecenia sieciowe z pakietu `net-tools` (takie jak `ifconfig`, `route` czy `netstat`) zostały oficjalnie uznane za wycofane (deprecated). Zastąpiono je nowym, szybszym i bardziej zwięzłym pakietem **iproute2**.

---

## 🛠️ Nowoczesne zamienniki poleceń sieciowych

Poznaj nowoczesne odpowiedniki klasycznych poleceń diagnostycznych:

### 1. Podgląd adresów IP (Zastępuje ifconfig)
Wyświetla przypisane adresy sieciowe na wszystkich aktywnych interfejsach:
```bash
ip a
```
(skrót od `ip address show`). Pozwala szybko zidentyfikować nazwy kart (np. `eth0`, `enp0s3`) i ich adresy IPv4/IPv6.

### 2. Tabela routingu (Zastępuje route -n)
Pokazuje bramy sieciowe i trasy pakietów:
```bash
ip r
```
(skrót od `ip route show`). Wiersz zaczynający się od `default via...` wskazuje bramę domyślną, przez którą pakiety opuszczają sieć lokalną w kierunku internetu.

### 3. Analiza nasłuchujących portów (Zastępuje netstat -tulpn)
Wyświetla aktywne gniazda sieciowe, porty oraz procesy, które z nich korzystają:
```bash
ss -tulpn
```
* **Co oznaczają flagi?**
  * `-t` — tylko połączenia TCP.
  * `-u` — tylko połączenia UDP.
  * `-l` — pokaż gniazda nasłuchujące (listening).
  * `-p` — wyświetl PID i nazwę programu korzystającego z gniazda (wymaga sudo).
  * `-n` — wyświetlaj numery portów i adresy IP bezpośrednio w formie liczbowej (zamiast próbować tłumaczyć je na nazwy usług, np. port 80 zamiast "http").

---

## 🛠️ Diagnostyka warstwy DNS

Do rozwiązywania nazw domenowych używamy narzędzia `nslookup` lub nowszego `dig`.
* **Przykładowe sprawdzenie:** `dig google.com` (zwraca pełną odpowiedź serwera DNS wraz z czasem odpowiedzi).

---

## 🛠️ Punkt Kontrolny: Diagnostyka sieciowa
<data-gate>
  <data-quiz>
    <question>
Które polecenie pakietu iproute2 pozwala sprawdzić listę nasłuchujących portów TCP i UDP wraz z nazwami programów (PID), które je otworzyły?
    </question>
    <options>
      <item correct>sudo ss -tulpn</item>
      <item>ip a show tcp</item>
      <item>netstat -tulpn</item>
    </options>

<div data-hint="error">
  Polecenie to zastępuje przestarzały program `netstat` i składa się z dwóch liter `s`.
</div>
<div data-hint="success">
  Świetnie! Komenda `ss` (Socket Statistics) w połączeniu z odpowiednimi flagami i uprawnieniami sudo to najlepszy sposób na audyt otwartych portów serwera.
</div>
  </data-quiz>
</data-gate>
