# Uprawnienia sieciowe Share i zabezpieczenia NTFS

Zarządzanie dostępem do plików w systemach Windows opiera się na dwóch niezależnych warstwach uprawnień: **Uprawnieniach sieciowych (Share)** oraz **Uprawnieniach NTFS (Zabezpieczenia)**. Zrozumienie ich wzajemnej relacji to absolutny fundament bezpieczeństwa i stały punkt arkuszy egzaminacyjnych.

---

## ⚖️ Zasada najbardziej restrykcyjnego uprawnienia

Gdy użytkownik łączy się z folderem przez sieć (np. `\\SERWER-DC\Dane`), system weryfikuje obie warstwy:

$$\text{Efektywne uprawnienie} = \text{Najbardziej restrykcyjne z pary (Share, NTFS)}$$

* Jeśli Share daje `Pełną kontrolę`, a NTFS daje tylko `Odczyt` $\rightarrow$ użytkownik może **tylko odczytywać**.
* Jeśli Share daje `Odczyt`, a NTFS daje `Modyfikację` $\rightarrow$ użytkownik może **tylko odczytywać**.

> [!TIP]
> **Złoty standard inżynieryjny (oraz klucz do egzaminu):**  
> Na poziomie udziału sieciowego (**Share**) nadaj grupie `Wszyscy` uprawnienie `Pełna kontrola` (lub `Zmień`), a całe rzeczywiste, precyzyjne sterowanie dostępem realizuj na poziomie uprawnień **NTFS (zakładka Zabezpieczenia)**!

---

## 📂 Krok 1: Utworzenie i udostępnienie folderu

1. Na dysku `C:\` utwórz nowy folder, np. `C:\WSPOLNY`.
2. Kliknij prawym przyciskiem myszy na folder -> **Właściwości**.
3. Przejdź do zakładki **Udostępnianie** -> kliknij przycisk **Zaawansowane udostępnianie...**.
4. Zaznacz pole: **Udostępnij ten folder**.
5. Kliknij przycisk **Uprawnienia**:
   * Zaznacz grupę `Wszyscy`.
   * Zaznacz pole wyboru **Pełna kontrola** (Zezwalaj).
   * Zatwierdź przyciskiem **OK**.

> 📷 Zrzut `ws2025-share-uprawnienia-wszyscy.png`: Okno Uprawnienia udziału z zaznaczoną Pełną kontrolą dla grupy Wszyscy.

---

## 🛡️ Krok 2: Wyłączenie dziedziczenia i uprawnienia NTFS

Teraz ustawimy właściwe zabezpieczenia na systemie plików NTFS.

1. W oknie właściwości folderu przejdź do zakładki **Zabezpieczenia** -> kliknij przycisk **Zaawansowane**.
2. **Wyłączenie dziedziczenia:**
   * Na dole okna kliknij przycisk **Wyłącz dziedziczenie**.
   * Wybierz opcję: **Konwertuj uprawnienia odziedziczone na uprawnienia jawne dla tego obiektu** (lub usuń wszystkie, jeśli chcesz budować listę od zera).
3. **Konfiguracja listy kontroli dostępu (ACL):**
   * Usuń standardowe wpisy dające uprawnienia domyślnym użytkownikom.
   * Kliknij **Dodaj** -> **Wybierz podmiot zabezpieczeń**:
     * Wpisz `Administratorzy` -> uprawnienie: **Pełna kontrola**.
     * Wpisz docelową grupę (np. `serwis` lub `Użytkownicy`) -> uprawnienie: **Modyfikacja** lub **Zapis / Odczyt i wykonanie**.
4. Zatwierdź wszystkie okna przyciskiem **Zastosuj** i **OK**.

---

## 🧪 Krok 3: Test z poziomu stacji roboczej

1. Na stacji roboczej zaloguj się na konto zwykłego użytkownika z grupy `serwis`.
2. Otwórz Eksplorator plików i w pasku adresu wpisz ścieżkę UNC:
   ```cmd
   \\SERWER-DC\WSPOLNY
   ```
3. Zweryfikuj uprawnienia:
   * Spróbuj utworzyć nowy plik tekstowy (sukces – uprawnienie do zapisu).
   * Zaloguj się na konto spoza grupy `serwis` i spróbuj otworzyć ten sam zasób (odmowa dostępu).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między zakładką *Udostępnianie* (Share) a zakładką *Zabezpieczenia* (NTFS).
- Zasadę wyznaczania uprawnień efektywnych (reguła najbardziej restrykcyjnego wpisu).
- Procedurę bezpiecznego wyłączania dziedziczenia uprawnień NTFS w zaawansowanych właściwościach folderu.
