# Zasady Grupy (GPO) - centralna konfiguracja stacji

Zarządzanie zasadami grupy (**GPO** – *Group Policy Object*) pozwala administratorowi na jednoczesne narzucenie konfiguracji systemowej, zabezpieczeń i ograniczeń na setkach komputerów podłączonych do domeny.

---

## 🎯 Architektura: Gdzie podpinamy GPO?

Polisy GPO mogą być linkowane (łączone) na trzech poziomach:
1. **Lokalny komputer:** lokalne zasady `gpedit.msc`.
2. **Domena:** obejmuje wszystkie komputery i użytkowników w całej domenie.
3. **Jednostka Organizacyjna (OU):** obejmuje wyłącznie obiekty znajdujące się w danym OU.

> [!NOTE]
> Kolejność przetwarzania zasad grupy: **Lokalne -> Lokacja -> Domena -> OU** (skrót: **LSDOU**). Zasada przetworzona później **nadpisuje** zasady wcześniejsze w przypadku konfliktu.

---

## 🛠️ Krok 1: Utworzenie i podpięcie GPO pod OU

Zadanie egzaminacyjne: *„Zabroń użytkownikom z jednostki organizacyjnej Magazyn dostępu do Edytora Rejestru”*.

1. Otwórz konsolę zarządzania: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   gpmc.msc
   ```
2. Rozwiń węzeł domeny i odszukaj swoje OU (np. `Magazyn`).
3. Kliknij prawym przyciskiem myszy na OU `Magazyn` -> **Utwórz obiekt zasad grupy w tej domenie i umieść tu łącze...**.
4. Wpisz nazwę polisy: `GPO_Blokada_Rejestru`.

> 📷 Zrzut `ws2025-gpo-nowy-obiekt-ou.png`: Okno tworzenia i łączenia obiektu GPO pod jednostką organizacyjną Magazyn.

---

## 🚫 Krok 2: Konfiguracja blokady edytora rejestru

1. Kliknij prawym przyciskiem myszy na nowo utworzony obiekt `GPO_Blokada_Rejestru` -> **Edytuj...**.
2. W oknie Edytora przejdź do gałęzi użytkownika:
   * **Konfiguracja użytkownika -> Zasady -> Szablony administracyjne -> System**.
3. Odszukaj zasadę: **Zapobiegnij dostępowi do narzędzi do edycji rejestru** (*Prevent access to registry editing tools*).
4. Kliknij dwukrotnie zasadę i wybierz: **Włączone**.
5. W opcjach upewnij się, że opcja *Wyłącz także ciche działanie regedit* jest ustawiona na **Tak**.
6. Kliknij **Zastosuj** i **OK**.

---

## 🖥️ Krok 3: Weryfikacja na stacji roboczej klienta

1. Na stacji roboczej podłączonej do domeny zaloguj się na konto `knowak` (należące do OU `Magazyn`).
2. Wymuś pobranie polis:
   ```cmd
   gpupdate /force
   ```
3. Naciśnij <kbd class="Win"></kbd> + <kbd>R</kbd> i spróbuj uruchomić polecenie:
   ```cmd
   regedit
   ```
4. Oczekiwany dowód: system wyświetla okno błędu z komunikatem:  
   *„Edycja rejestru została wyłączona przez administratora sieci”*.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Hierarchię i kolejność dziedziczenia polis GPO (model LSDOU).
- Tworzenie i linkowanie obiektów zasad grupy do dedykowanych Jednostek Organizacyjnych.
- Różnicę między Konfiguracją komputera (Computer Configuration) a Konfiguracją użytkownika (User Configuration) oraz weryfikację blokad na stacji klienckiej.
