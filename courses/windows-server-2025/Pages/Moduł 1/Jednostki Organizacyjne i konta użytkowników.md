# Jednostki Organizacyjne i konta użytkowników

Organizacja zasobów w domenie Active Directory opiera się na hierarchii **Jednostek Organizacyjnych (OU)**, w których umieszczamy konta pracowników, grupy oraz komputery.

---

## 📁 Czym jest Jednostka Organizacyjna (OU)?

**OU** (*Organizational Unit*) to logiczny kontener w drzewie domeny. Pełni dwie kluczowe funkcje:
1. **Porządkową:** odwzorowuje strukturę firmy (działy: *Księgowość*, *Magazyn*, *Zarząd*).
2. **Administracyjną:** umożliwia podpinanie dedykowanych polis GPO oraz delegowanie uprawnień administratorom pomocniczym.

> [!NOTE]
> Standardowy folder `Users` w domenie to zwykły kontener ogólny, a nie jednostka organizacyjna. **Nie można podpiąć obiektu GPO bezpośrednio pod folder `Users`**. Dlatego tworzymy własne OU!

---

## 🏗️ Krok 1: Tworzenie Jednostki Organizacyjnej

1. Otwórz przystawkę: <kbd class="Win"></kbd> + <kbd>R</kbd> -> wpisz:
   ```cmd
   dsa.msc
   ```
2. Rozwiń węzeł domeny (np. `egzamin.local`).
3. Kliknij prawym przyciskiem myszy na nazwę domeny -> **Nowy -> Jednostka organizacyjna**.
4. Wpisz nazwę jednostki (np. `Magazyn` lub `Pracownicy`).
5. Upewnij się, że zaznaczona jest opcja **Chroń kontener przed przypadkowym usunięciem**.

> 📷 Zrzut `ws2025-ad-nowe-ou.png`: Okno tworzenia jednostki organizacyjnej w dsa.msc z zaznaczoną ochroną przed przypadkowym usunięciem.

---

## 👤 Krok 2: Tworzenie konta użytkownika w OU

1. Kliknij prawym przyciskiem myszy na nowo utworzone OU (np. `Magazyn`) -> **Nowy -> Użytkownik**.
2. Wypełnij dane identyfikacyjne:
   * **Imię i nazwisko:** np. `Katarzyna Nowak`
   * **Nazwa logowania użytkownika:** np. `knowak` (to login używany przy logowaniu do stacji).
3. Kliknij **Dalej** i ustaw parametry hasła:

| Opcja | Kiedy stosować? | Typowe wymaganie egzaminu |
| :--- | :--- | :--- |
| **Użytkownik musi zmienić hasło przy następnym logowaniu** | Nowy pracownik otrzymuje hasło startowe i sam wybiera własne | Częste |
| **Użytkownik nie może zmienić hasła** | Konta serwisowe, kioski, komputery publiczne | Zależnie od treści zadania |
| **Hasło nigdy nie wygasa** | Konta techniczne, skrypty | Tylko w uzasadnionych przypadkach |
| **Konto jest wyłączone** | Przygotowane z wyprzedzeniem przed zatrudnieniem | - |

4. Wpisz hasło spełniające zasady złożoności (np. `zaq1@WSX`) i zakończ pracę kreatora.

---

## 👥 Krok 3: Tworzenie grup i przypisywanie członkostwa

Grupy służą do masowego nadawania uprawnień do folderów sieciowych.

1. W wybranym OU kliknij: **Nowy -> Grupa**.
2. Nazwa grupy: np. `serwis` lub `magazynierzy`.
3. Typ grupy: **Zabezpieczenia** (Security), Zakres: **Globalny**.
4. Dodaj użytkownika do grupy:
   * Otwórz właściwości utworzonego użytkownika `knowak` -> zakładka **Członek grupy**.
   * Kliknij **Dodaj...**, wpisz nazwę grupy `serwis` i zatwierdź przyciskiem **Sprawdź nazwy**.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między kontenerem domyślnym a Jednostką Organizacyjną (OU) pod kątem GPO.
- Tworzenie kont użytkowników w dedykowanych OU z poprawnym loginem (User Logon Name).
- Konfigurację flag haseł (wymuszenie zmiany vs zakaz zmiany) oraz przypisywanie użytkowników do grup zabezpieczeń.
