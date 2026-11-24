# Ukryte udziały administracyjne i biznesowe ($)

W środowiskach korporacyjnych nie wszystkie zasoby sieciowe powinny być widoczne podczas przeglądania otoczenia sieciowego. Mechanizm znaku dolara (`$`) pozwala na tworzenie udziałów ukrytych.

---

## 💵 Magia znaku $ na końcu nazwy udziału

Dodanie znaku `$` na końcu nazwy zasobu sieciowego informuje usługę serwera (SMB), że ten zasób **nie ma być rozgłaszany** podczas przeglądania sieci:

* Zwykły udział: `\\SERWER-DC\Dokumenty` $\rightarrow$ widoczny na liście zasobów serwera.
* Ukryty udział: `\\SERWER-DC\Dokumenty$` $\rightarrow$ **niewidoczny** na liście; aby się połączyć, użytkownik musi znać dokładną ścieżkę i wpisać ją ręcznie.

---

## 🏛️ Domyślne udziały administracyjne Windowsa

Każdy system Windows automatycznie tworzy wbudowane udziały ukryte z dolarem dla celów zarządzania:

| Udział administracyjny | Ścieżka lokalna | Przeznaczenie |
| :--- | :--- | :--- |
| `C$`, `D$` | `C:\`, `D:\` | Pełny dostęp do korzenia każdego dysku (tylko dla Administratorów) |
| `ADMIN$` | `C:\Windows` | Zdalne zarządzanie systemem, instalacja oprogramowania |
| `IPC$` | - | Komunikacja międzyprocesowa, uwierzytelnianie |
| `NETLOGON` / `SYSVOL` | `C:\Windows\SYSVOL\...` | Replikacja skryptów logowania i szablonów GPO (widoczne w domenie) |

Możesz podejrzeć wszystkie aktywne udziały w wierszu poleceń za pomocą komendy:
```cmd
net share
```

---

## 🛠️ Krok po kroku: Tworzenie biznesowego udziału ukrytego

Zadanie egzaminacyjne: *„Utwórz folder `C:\WSPOLNY` i udostępnij go pod ukrytą nazwą `wspolny$`”*.

1. Kliknij prawym przyciskiem myszy na folder `C:\WSPOLNY` -> **Właściwości**.
2. Zakładka **Udostępnianie** -> **Zaawansowane udostępnianie...**.
3. Zaznacz: **Udostępnij ten folder**.
4. W polu **Nazwa udziału** wpisz dokładnie:
   ```text
   wspolny$
   ```
5. Kliknij przycisk **Uprawnienia** i ustaw wymagane prawa sieciowe (np. `Wszyscy - Pełna kontrola`).
6. Zatwierdź przyciskiem **Zastosuj** i **OK**.

> 📷 Zrzut `ws2025-udzial-ukryty-dolar.png`: Pole nazwy udziału z wpisaną wartością wspolny$.

---

## 🔍 Weryfikacja działania ukrycia

1. Na stacji roboczej otwórz Eksplorator plików i wpisz sam adres serwera:
   ```cmd
   \\SERWER-DC
   ```
   Folder `wspolny$` **nie wyświetla się na liście**.
2. Teraz wpisz pełną ścieżkę bezpośrednią:
   ```cmd
   \\SERWER-DC\wspolny$
   ```
   Zasób otwiera się natychmiast bez przeszkód.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę w zachowaniu serwera SMB przy nazwach zakończonych znakiem `$`.
- Listę domyślnych udziałów administracyjnych (`C$`, `ADMIN$`, `IPC$`) i polecenie `net share`.
- Tworzenie i poprawne mapowanie ukrytych folderów sieciowych na stacjach klienckich.
