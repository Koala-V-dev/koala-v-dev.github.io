# Promowanie serwera do roli kontrolera domeny

Wdrożenie usługi **Active Directory Domain Services (AD DS)** przekształca autonomiczny serwer w **Kontroler Domeny (Domain Controller)** – centralną bazę tożsamości, komputerów i uprawnień w przedsiębiorstwie.

---

## 📦 Krok 1: Instalacja roli Active Directory Domain Services

1. W oknie **Menedżer serwera** kliknij: **Zarządzaj -> Dodaj role i funkcje** (lub kafelek na pulpicie powitalnym).
2. Przejdź kreator:
   * Typ instalacji: **Instalacja oparta na rolach lub na funkcjach**.
   * Wybór serwera: zaznacz bieżący serwer (`SERWER-DC`).
   * Role serwera: zaznacz pole wyboru **Usługi domenowe Active Directory (AD DS)**.
   * W wyskakującym oknie kliknij **Dodaj funkcje** (dołączając narzędzia RSAT).
   * Pozostałe ekrany zatwierdź domyślnie i kliknij **Zainstaluj**.

> [!NOTE]
> Sama instalacja roli kopiuje jedynie niezbędne pliki binarne na dysk. Baza danych Active Directory (`NTDS.dit`) powstaje dopiero podczas procedury promowania.

---

## 🌲 Krok 2: Promowanie do roli kontrolera (Nowy las)

Po zakończeniu instalacji na pasku menu Menedżera serwera pojawi się żółty trójkąt z powiadomieniem (Flaga).

1. Kliknij ikonę powiadomienia i wybierz: **Podnieś poziom tego serwera do rangi kontrolera domeny** (*Promote this server to a domain controller*).
2. **Konfiguracja wdrożenia:**
   * Wybierz opcję: **Dodaj nowy las** (*Add a new forest*).
   * Podaj nazwę domeny głównej, np.: `egzamin.local` lub `firma.lan`.

> 📷 Zrzut `ws2025-ad-promowanie-nowy-las.png`: Okno konfiguracji wdrożenia z wybraną opcją Dodaj nowy las i wpisaną nazwą domeny.

3. **Opcje kontrolera domeny:**
   * Poziom funkcjonalności lasu i domeny: pozostaw domyślny (Windows Server 2025 / 2016).
   * Upewnij się, że zaznaczona jest rola **Serwer DNS** oraz **Katalog globalny (GC)**.
   * Wpisz hasło trybu przywracania usług katalogowych (**DSRM**), np. `ZAQ!2wsx`.

4. **Ścieżki bazy danych i weryfikacja:**
   * Pozostaw domyślne ścieżki folderów bazy `NTDS`, plików dziennika oraz folderu `SYSVOL`.
   * Na ekranie sprawdzania wymagań wstępnych upewnij się, że pojawił się komunikat: *Wszystkie testy wymagań wstępnych zostały pomyślnie ukończone*.
5. Kliknij **Zainstaluj**. Po zakończeniu operacji serwer automatycznie uruchomi się ponownie.

---

## 🔍 Weryfikacja po restarcie

Po restarcie ekran logowania zmieni swój format:
* Logujesz się teraz jako administrator domeny: `EGZAMIN\Administrator` z dotychczasowym hasłem.
* W menu **Narzędzia** Menedżera serwera pojawią się nowe przystawki:
  * **Użytkownicy i komputery usługi Active Directory** (`dsa.msc`),
  * **Zarządzanie zasadami grupy** (`gpmc.msc`),
  * **Menedżer DNS** (`dnsmgmt.msc`).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między instalacją binariów roli AD DS a faktycznym promowaniem serwera.
- Tworzenie nowego lasu domenowego i przypisanie nazwy FQDN (np. `egzamin.local`).
- Rolę hasła DSRM (Directory Services Restore Mode) w procedurach odzyskiwania bazy NTDS.
