# Zarządzanie woluminami i limitami dyskowymi (Quota)

Brak kontroli nad przestrzenią dyskową na serwerze plików prowadzi do szybkiego zapełnienia nośników przez użytkowników. Narzędzie **Limitów dyskowych (Quota)** pozwala na sztywne ograniczenie miejsca przydzielonego każdemu pracownikowi.

---

## 💽 Krok 1: Przygotowanie woluminu w Zarządzaniu dyskami

1. Otwórz przystawkę zarządzania dyskami: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   diskmgmt.msc
   ```
2. Na nowo podpiętym dysku wirtualnym zainicjuj styl partycji (GPT).
3. Utwórz nowy wolumin prosty sformatowany w systemie plików **NTFS** i przypisz mu literę (np. `E:` o etykiecie `Dane`).

> [!NOTE]
> Tradycyjne limity dyskowe Windowsa działają wyłącznie na partycjach sformatowanych w systemie **NTFS** i rozliczają zajętość na podstawie właściciela pliku (SID użytkownika).

---

## 🛑 Krok 2: Konfiguracja limitów przydziału (Quota)

1. W Eksploratorze plików kliknij prawym przyciskiem myszy na dysk `E:` -> **Właściwości**.
2. Przejdź do zakładki **Przydział** (Quota) -> kliknij przycisk **Pokaż ustawienia przydziału**.
3. Zaznacz pole: **Włącz zarządzanie przydziałami**.
4. Zaznacz pole: **Odmów miejsca na dysku użytkownikom przekraczającym limit przydziału** (bez tego limit jest tylko ostrzeżeniem).
5. Wybierz opcję: **Ogranicz miejsce na dysku do**:
   * Podaj limit twardy, np.: `1 GB`.
   * Podaj poziom ostrzeżenia, np.: `800 MB`.
6. Zaznacz rejestrowanie zdarzeń:
   * *Rejestruj zdarzenie, gdy użytkownik przekroczy limit*,
   * *Rejestruj zdarzenie, gdy użytkownik przekroczy poziom ostrzeżenia*.

> 📷 Zrzut `ws2025-quota-ustawienia.png`: Okno konfiguracji przydziałów z włączoną odmową zapisu i ustalonymi progami.

---

## 👥 Krok 3: Indywidualne wpisy przydziału

Jeśli konkretny użytkownik (np. grafik lub kierownik) potrzebuje więcej miejsca niż standardowy pracownik:

1. W oknie ustawień przydziału kliknij przycisk **Wpisy przydziału...**.
2. Kliknij: **Przydział -> Nowy wpis przydziału...**.
3. Wskaż konto użytkownika domenowego (np. `knowak`).
4. Ustaw indywidualny limit (np. `5 GB`) nadpisujący regułę ogólną dysku.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między miękkim monitorowaniem a twardą blokadą zapisu (Deny disk space to users exceeding quota limit).
- Zależność mechanizmu Quota od systemu plików NTFS i własności plików.
- Konfigurowanie limitów globalnych dla woluminu oraz wyjątków dla wybranych tożsamości.
