# Menedżer serwera i konfiguracja kart sieciowych

Serwer w sieci lokalnej musi posiadać stałą tożsamość: niezmienną nazwę komputera oraz statyczny adres IP przypisany do interfejsu świadczącego usługi dla stacji roboczych.

---

## 🎛️ Menedżer serwera (Server Manager)

Po zalogowaniu system automatycznie uruchamia **Menedżer serwera**. To centralna konsola, z poziomu której:
* instalujesz nowe role i funkcje (AD DS, DHCP, DNS, IIS),
* monitorujesz stan usług i zdarzeń systemowych,
* przechodzisz do narzędzi administracyjnych MMC.

W lewym menu wybierz pozycję **Serwer lokalny** (Local Server). W tym widoku znajdziesz podsumowanie bieżącej konfiguracji maszyny.

> 📷 Zrzut `ws2025-server-manager-local.png`: Widok widoku Serwer lokalny w Menedżerze serwera.

---

## 🏷️ Krok 1: Zmiana nazwy serwera

Domyślna nazwa komputera (np. `WIN-A7G8X9K2`) utrudnia zarządzanie w sieci. Zmień ją przed promowaniem do roli kontrolera:

1. W oknie **Serwer lokalny** kliknij aktualną **Nazwę komputera**.
2. W oknie właściwości kliknij przycisk **Zmień...**.
3. Wpisz czytelną nazwę, np.: `SERWER-DC` lub `SRV01`.
4. Zatwierdź i wybierz **Uruchom ponownie później** (najpierw skonfigurujemy adres IP).

---

## 🌐 Krok 2: Statyczny adres IP interfejsu LAN

Serwer nie może pobierać adresu IP z dynamicznej puli, jeśli ma pełnić rolę kontrolera domeny i serwera DNS.

1. Otwórz połączenia sieciowe za pomocą skrótu <kbd class="Win"></kbd> + <kbd>R</kbd> i polecenia:
   ```cmd
   ncpa.cpl
   ```
2. Zmień nazwę interfejsu podłączonego do sieci wewnętrznej na czytelną, np. `LAN`.
3. Kliknij prawym przyciskiem myszy na kartę `LAN` -> **Właściwości**.
4. Wybierz **Protokół internetowy w wersji 4 (TCP/IPv4)** -> **Właściwości**.
5. Wprowadź parametry statyczne:

| Pole | Wartość przykładowa | Znaczenie |
| :--- | :--- | :--- |
| **Adres IP** | `192.168.0.1` | Stały adres serwera w podsieci |
| **Maska podsieci** | `255.255.255.0` | Prefiks `/24` wyznaczający podsieć |
| **Brama domyślna** | *puste* lub adres routera | Brak bramy, jeśli serwer jest izolowany |
| **Preferowany serwer DNS** | `127.0.0.1` | Samodzielne rozwiązywanie nazw przez lokalny DNS |

> [!CAUTION]
> Jako preferowany serwer DNS ustaw adres pętli zwrotnej `127.0.0.1` (lub docelowy adres `192.168.0.1`). Błędny adres DNS uniemożliwi poprawne wdrożenie Active Directory!

6. Zrestartuj serwer, aby zatwierdzić nową nazwę maszyny i parametry sieciowe.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Strukturę konsoli Menedżer serwera i rolę panelu *Serwer lokalny*.
- Zmianę nazwy serwera przed wdrożeniem ról domenowych.
- Konfigurację statycznego adresu IPv4 i pętli zwrotnej DNS dla serwera usług sieciowych.
