# Bity specjalne: SUID, SGID i Sticky Bit

Poza tradycyjnymi prawami odczytu, zapisu i wykonania, systemy POSIX oferują trzy bity specjalne, które modyfikują domyślne zachowanie jądra wobec uruchamianych programów oraz tworzonych katalogów.

---

## 🔝 Bit SUID (Set User ID)

* **Jak działa?** Plik wykonywalny z ustawionym bitem SUID uruchamia się z uprawnieniami właściciela pliku, a nie użytkownika, który go aktualnie wywołał.
* **Klasyczny przykład:** Program `/usr/bin/passwd`. Zwykły użytkownik musi mieć możliwość zmiany własnego hasła, co wymaga zapisu nowego hasza w pliku `/etc/shadow`. Jednak zwykły użytkownik nie ma uprawnień zapisu ani odczytu pliku `/etc/shadow`. Program `passwd` ma przypisanego właściciela `root` i ustawiony bit SUID. Dzięki temu, gdy użytkownik uruchamia `passwd`, proces wykonuje się z pełnymi prawami użytkownika `root`, co pozwala na modyfikację bazy haseł.
* **Zagrożenie:** Błędnie napisany program z bitem SUID to krytyczna luka bezpieczeństwa. Jeśli napastnik zdoła zmusić taki proces do wykonania powłoki (np. poprzez przepełnienie bufora), otrzyma bezpośredni dostęp do powłoki roota (eskalacja uprawnień).
* **Zapis:** `s` w miejscu `x` właściciela (np. `-rwsr-xr-x`). Wartość ósemkowa: **$4$** na początku (np. `chmod 4755 plik`).

---

## 👥 Bit SGID (Set Group ID)

* **Dla plików:** Program uruchamia się z uprawnieniami grupy przypisanej do pliku.
* **Dla katalogów (bardzo popularne):** Każdy nowy plik lub katalog utworzony wewnątrz katalogu z ustawionym SGID automatycznie dziedziczy grupę właściciela tego katalogu nadrzędnego, zamiast grupy domyślnej użytkownika, który go utworzył. Ułatwia to współdzielenie zasobów w zespołach.
* **Zapis:** `s` w miejscu `x` grupy. Wartość ósemkowa: **$2$** na początku (np. `chmod 2775 katalog`).

---

## 📌 Bit Lepki (Sticky Bit)

* **Jak działa?** Stosowany do katalogów współdzielonych przez wielu użytkowników (np. katalog `/tmp`). Blokuje możliwość usuwania lub zmiany nazwy plików wewnątrz tego katalogu każdemu, kto nie jest właściciechem danego pliku lub użytkownikiem `root` (nawet jeśli katalog ma pełne uprawnienia zapisu dla wszystkich).
* **Zapis:** `t` na końcu praw (np. `drwxrwxrwt`). Wartość ósemkowa: **$1$** na początku (np. `chmod 1777 katalog`).

---

## 🛠️ Punkt Kontrolny: Bity specjalne
<data-gate>
  <data-quiz>
    <question>
Dlaczego program /usr/bin/passwd musi mieć ustawiony bit specjalny SUID?
    </question>
    <options>
      <item correct>Aby uruchamiający go zwykły użytkownik mógł na czas działania programu zapisać hasło w zabezpieczonym pliku /etc/shadow z prawami administratora root.</item>
      <item>Aby system operacyjny wiedział, że program ten należy uruchomić w graficznej sesji Wayland.</item>
      <item>Aby zablokować innym użytkownikom możliwość podglądania procesu w programie top.</item>
    </options>

<div data-hint="error">
  Zastanów się: do jakiego pliku program `passwd` musi zapisać dane i jakie uprawnienia ma ten plik dla zwykłego użytkownika?
</div>
<div data-hint="success">
  Genialne! SUID tymczasowo podnosi uprawnienia procesu do poziomu właściciela pliku (root), co pozwala na bezpieczną modyfikację plików systemowych.
</div>
  </data-quiz>
</data-gate>
