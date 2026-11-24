# Serwer DNS - strefy wyszukiwania do przodu i wstecz

Usługa **DNS (Domain Name System)** jest sercem sieci komputerowej i Active Directory. Odpowiada za tłumaczenie przyjaznych nazw domenowych (`stacja01.egzamin.local`) na adresy IP (`192.168.0.3`) oraz odwrotnie.

---

## 🧭 Dwa kierunki wyszukiwania DNS

1. **Strefa wyszukiwania do przodu (Forward Lookup Zone):**
   * Pytanie: *„Jaki adres IP ma komputer `serwer-dc.egzamin.local`?”*
   * Odpowiedź: `192.168.0.1` (Rekord typu **A** lub **AAAA**).
2. **Strefa wyszukiwania wstecznego (Reverse Lookup Zone):**
   * Pytanie: *„Jaka nazwa komputera kryje się pod adresem IP `192.168.0.1`?”*
   * Odpowiedź: `serwer-dc.egzamin.local` (Rekord wskaźnika **PTR**).

---

## 🔄 Krok 1: Tworzenie strefy wyszukiwania wstecznego

Podczas instalacji Active Directory strefa do przodu tworzy się automatycznie. Strefę wsteczną musisz utworzyć samodzielnie:

1. Otwórz Menedżer DNS: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   dnsmgmt.msc
   ```
2. Rozwiń węzeł serwera -> kliknij prawym przyciskiem na **Strefy wyszukiwania wstecznego** -> **Nowa strefa...**.
3. **Typ strefy:** Wybierz **Strefa podstawowa** (Primary Zone) oraz zaznacz: *Przechowuj strefę w usłudze Active Directory*.
4. **Identyfikator sieci:**
   * Wpisz pierwsze trzy oktety swojej sieci, np.: `192.168.0`.
   * System automatycznie utworzy nazwę strefy: `0.168.192.in-addr.arpa`.
5. **Aktualizacje dynamiczne:** Zezwalaj tylko na bezpieczne aktualizacje dynamiczne (zalecane dla AD).

> 📷 Zrzut `ws2025-dns-strefa-wsteczna.png`: Okno kreatora nowej strefy z wpisanym identyfikatorem sieci 192.168.0.

---

## 📝 Krok 2: Dodawanie rekordów zasobów (A, CNAME, PTR)

1. Rozwiń swoją strefę do przodu (np. `egzamin.local`).
2. Kliknij prawym przyciskiem myszy w pustym polu -> **Nowy host (A lub AAAA)...**.
   * **Nazwa:** np. `drukarka`
   * **Adres IP:** `192.168.0.200`
   * Zaznacz pole: **Utwórz skojarzony rekord wskaźnika (PTR)** – system automatycznie doda wpis do strefy wstecznej!
3. **Tworzenie aliasu (CNAME):**
   * Kliknij prawym przyciskiem myszy -> **Nowy alias (CNAME)...**.
   * **Nazwa aliasu:** `www`
   * **W pełni kwalifikowana nazwa domeny (FQDN) dla hosta docelowego:** wskaż `serwer-dc.egzamin.local`.

---

## 🧪 Krok 3: Test działania (nslookup)

W wierszu poleceń (`cmd`) wykonaj dwa testy diagnostyczne:

1. Test wyszukiwania do przodu:
   ```cmd
   nslookup drukarka.egzamin.local
   ```
2. Test wyszukiwania wstecznego:
   ```cmd
   nslookup 192.168.0.200
   ```
Oczekiwany dowód: oba polecenia zwracają sparowane wartości bez komunikatów o braku strefy (*Non-existent domain*).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę w działaniu strefy Forward Lookup vs Reverse Lookup (`in-addr.arpa`).
- Typy rekordów DNS: A (Host IPv4), PTR (Wskaźnik odwrotny) i CNAME (Alias).
- Diagnostykę rozwiązywania nazw za pomocą wbudowanego narzędzia `nslookup`.
