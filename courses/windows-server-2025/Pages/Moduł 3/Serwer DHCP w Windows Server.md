# Serwer DHCP w Windows Server

Rola **DHCP Server** w systemie Windows Server automatyzuje proces dystrybucji adresacji IPv4, masek podsieci, bram domyślnych oraz serwerów DNS dla wszystkich komputerów w sieci lokalnej.

---

## 📦 Krok 1: Instalacja roli i autoryzacja w Active Directory

1. W oknie **Menedżer serwera** kliknij: **Zarządzaj -> Dodaj role i funkcje**.
2. Zaznacz rolę: **Serwer DHCP** i dokończ instalację.
3. **Autoryzacja w domenie:**
   * Po instalacji kliknij ikonę powiadomienia (Flaga) -> **Zakończ konfigurację serwera DHCP**.
   * W kreatorze kliknij **Zatwierdź** (Authorize), aby zarejestrować serwer DHCP w usłudze Active Directory.

> [!IMPORTANT]
> W środowisku domenowym system Windows Server **nie uruchomi usługi DHCP**, jeśli nie zostanie ona autoryzowana w Active Directory. To zabezpieczenie przed podpinaniem nieautoryzowanych serwerów DHCP przez złośliwych użytkowników (Rogue DHCP Server).

---

## 🚰 Krok 2: Tworzenie i konfiguracja nowego zakresu (Scope)

1. Otwórz przystawkę: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   dhcpmgmt.msc
   ```
2. Rozwiń węzeł serwera -> kliknij prawym przyciskiem myszy na **IPv4** -> **Nowy zakres...**.
3. **Nazwa zakresu:** np. `LAN_Biuro`.
4. **Zakres adresów IP i maska:**
   * Początkowy adres IP: np. `192.168.0.10`
   * Końcowy adres IP: np. `192.168.0.100`
   * Długość: `24`, Maska: `255.255.255.0`

> 📷 Zrzut `ws2025-dhcp-zakres-ip.png`: Ekran podawania puli adresów IP w kreatorze nowego zakresu.

5. **Wykluczenia (Exclusions):**
   * Podaj adresy wyjęte z dystrybucji (np. zarezerwowane na drukarki sieciowe lub routery): od `192.168.0.1` do `192.168.0.9`.
6. **Czas trwania dzierżawy (Lease Duration):**
   * Domyślnie `8 dni` (na egzaminie często zmieniany np. na `2 godziny` lub `1 dzień`).
7. **Opcje DHCP:**
   * **Brama domyślna (Router):** adres routera LAN (np. `192.168.0.1`).
   * **Serwer DNS:** adres kontrolera domeny (np. `192.168.0.1`).
   * **Domena nadrzędna:** np. `egzamin.local`.
8. Wybierz opcję: **Tak, chcę teraz uaktywnić ten zakres**.

---

## 📌 Krok 3: Zastrzeżenia adresów IP (Reservations)

Dla urządzeń, które muszą zawsze otrzymać ten sam adres IP (np. drukarka sieciowa):

1. W konsoli DHCP rozwiń utworzony zakres -> kliknij prawym przyciskiem na folder **Zastrzeżenia** -> **Nowe zastrzeżenie...**.
2. Wypełnij pola:
   * **Nazwa zastrzeżenia:** `Drukarka-Magazyn`
   * **Adres IP:** `192.168.0.200`
   * **Adres MAC:** adres fizyczny karty w formacie ciągłym (np. `00155D010A2B`)
   * Typy obsługiwanych protokołów: **Oba (DHCP i BOOTP)**.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Mechanizm autoryzacji serwera DHCP w Active Directory.
- Tworzenie zakresu (Scope), ustalanie puli, wykluczeń i czasu dzierżawy.
- Konfigurację opcji sieciowych (brama 003, DNS 006) oraz statycznych zastrzeżeń po adresie MAC.
