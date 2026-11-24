# Zasady haseł i blokad w domenie

W środowisku domenowym zasady bezpieczeństwa kont nie są konfigurowane lokalnie w `secpol.msc` na stacji, lecz narzucane centralnie dla całej domeny za pomocą obiektu **Default Domain Policy**.

---

## 🏛️ Gdzie żyją domyślne zasady haseł?

W domenie Active Directory zasady haseł i blokad kont są definiowane na samym szczycie drzewa domeny w obiekcie:
* **Default Domain Policy** (Domyślne zasady domeny).

> [!CAUTION]
> Utworzenie nowego GPO z zasadami haseł i podpięcie go pod pojedyncze OU **nie zadziała** dla standardowych kont domenowych! Zwykłe zasady haseł domeny muszą być edytowane w polisie `Default Domain Policy` powiązanej z korzeniem domeny (chyba że wdrażasz zaawansowane zasady haseł *Password Settings Objects - PSO*).

---

## ⚙️ Krok 1: Edycja Default Domain Policy

1. Otwórz konsolę zarządzania zasadami grupy: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   gpmc.msc
   ```
2. Rozwiń: **Las -> Domeny -> [twoja_domena]** (np. `egzamin.local`).
3. Kliknij prawym przyciskiem myszy na obiekt **Default Domain Policy** -> **Edytuj...**.
4. W otwartym Edytorze zarządzania zasadami grupy przejdź do ścieżki:
   * **Konfiguracja komputera -> Zasady -> Ustawienia systemu Windows -> Ustawienia zabezpieczeń -> Zasady konta**.

> 📷 Zrzut `ws2025-gpo-zasady-konta-sciezka.png`: Ścieżka do Zasad konta w Edytorze zarządzania zasadami grupy.

---

## 🔒 Krok 2: Konfiguracja blokady kont (Próg blokady)

Klasyczne zadanie z arkusza egzaminacyjnego: *„Ustaw próg blokady kont po 4 nieudanych próbach logowania”*.

1. W węźle **Zasady konta** wybierz podfolder **Zasady blokowania kont**.
2. Kliknij dwukrotnie zasadę: **Próg blokowania konta** (*Account lockout threshold*).
3. Wpisz wymaganą wartość: `4` nieudane próby logowania.
4. Po zatwierdzeniu system wyświetli okno z zalecanymi wartościami powiązanymi:
   * **Czas trwania blokady konta:** domyślnie `30 minut`,
   * **Wyzeruj licznik blokowania konta po:** domyślnie `30 minutach`.
5. Kliknij **OK**, aby zatwierdzić sugerowane powiązania.

---

## 🔄 Krok 3: Wymuszenie aktualizacji zasad (gpupdate)

Zasady grupy odświeżają się automatycznie w tle co 90 minut. Aby natychmiast zastosować nowe ustawienia na kontrolerze i stacjach klientów:

1. Otwórz wiersz poleceń (`cmd`) lub PowerShell jako Administrator.
2. Wpisz polecenie:
   ```cmd
   gpupdate /force
   ```
3. Oczekiwany dowód: komunikat *Aktualizowanie zasad zakończyło się pomyślnie*.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między lokalnym `secpol.msc` a domenowym `Default Domain Policy` w `gpmc.msc`.
- Konfigurację progu blokowania konta (Account lockout threshold) wraz z czasem zerowania licznika.
- Wymuszanie natychmiastowej replikacji i zastosowania polis za pomocą `gpupdate /force`.
