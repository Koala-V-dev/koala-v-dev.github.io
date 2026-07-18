# Użytkownicy i bazy tożsamości

W systemie Linux tożsamość użytkowników i powiązane z nimi uprawnienia są zarządzane za pomocą tekstowych baz danych. Dwa najważniejsze pliki odpowiedzialne za logowanie i weryfikację uprawnień to `/etc/passwd` oraz `/etc/shadow`.

---

## 👥 Struktura pliku /etc/passwd

Plik `/etc/passwd` jest publicznie czytelny dla wszystkich użytkowników systemu (posiada uprawnienia 644). Zawiera podstawowe metadane o kontach:
```text
kamil:x:1001:1001:Kamil Zbrzezniak:/home/kamil:/bin/bash
```

### Wyjaśnienie kolumn (oddzielonych `:`):
1. **Nazwa użytkownika:** `kamil`
2. **Hasło:** Litera `x` wskazuje, że hasło jest zaszyfrowane i znajduje się w bezpiecznym pliku `/etc/shadow`.
3. **UID (User ID):** Unikalny identyfikator użytkownika ($0$ zarezerwowane dla root, wartości $\ge 1000$ dla zwykłych użytkowników).
4. **GID (Group ID):** Identyfikator głównej grupy użytkownika.
5. **Gecos:** Dane opisowe (imię, nazwisko, pokój).
6. **Katalog domowy:** Ścieżka do katalogu użytkownika (np. `/home/kamil`).
7. **Domyślna powłoka:** Powłoka uruchamiana po zalogowaniu (np. `/bin/bash` lub `/usr/sbin/nologin` dla kont systemowych).

---

## 🔒 Bezpieczeństwo haseł: /etc/shadow

Plik `/etc/shadow` jest chroniony i może być odczytywany wyłącznie przez konto roota (uprawnienia 600 lub 000). Zawiera zahaczone hasła oraz politykę ich wygasania:
```text
kamil:$y$j9T$SaltString$HashValue:19820:0:90:7:::
```

### Budowa hasza hasła:
Hasz hasła zaczyna się od identyfikatora algorytmu kryptograficznego:
* `$1$` — MD5 (przestarzały)
* `$6$` — SHA-512 (klasyczny standard)
* `$y$` — **yescrypt** (nowoczesny, odporny na masowe łamanie za pomocą GPU/ASIC standard wprowadzony domyślnie w Ubuntu).
Po identyfikatorze algorytmu następuje **sól (salt)** – losowy ciąg znaków unikalny dla każdego hasła. Sól chroni przed atakami za pomocą tabel tęczowych (rainbow tables), sprawiając, że identyczne hasła dwóch użytkowników generują zupełnie inne hasze końcowe.

---

## 🚩 Pedagogiczne wyzwanie CTF: Złamanie zabezpieczeń własnego serwera

Aby zrozumieć znaczenie silnych haseł oraz rolę soli kryptograficznej, przeprowadzimy kontrolowany atak słownikowy.

### 🎮 Scenariusz laboratoryjny:
Załóżmy, że uzyskałeś nieautoryzowany odczyt pliku `/etc/shadow` serwera i znalazłeś następujący hasz testowego konta:
`student:$6$yZ827$JmQ7E93k/m9nQ8e7f8e8g8...`

1. **Przygotowanie pliku:** Zapisz ten hasz do pliku `hasz.txt` na swojej maszynie testowej.
2. **Atak słownikowy za pomocą John the Ripper:** Uruchom program John, podając przygotowany słownik popularnych słów:
   ```bash
   john --wordlist=/usr/share/wordlists/rockyou.txt hasz.txt
   ```
3. **Wynik:** Jeśli hasło było proste (np. `haslo123`), program złamie je w ułamku sekundy.

### 🧠 Wnioski edukacyjne:
* Dlaczego sól jest ważna? Ponieważ zmusza program łamiący do każdorazowego obliczania hasza dla każdego hasła ze słownika w połączeniu z unikalną solą, drastycznie spowalniając cały proces.
* Jak chronić system? Stosować skomplikowane hasła i nowoczesne haszowanie typu `yescrypt`.

---

## 🛠️ Punkt Kontrolny: Bazy tożsamości
<data-gate>
  <data-quiz>
    <question>
Jaki nowoczesny algorytm haszowania haseł (odporny na łamanie GPU/ASIC) jest domyślnie stosowany w pliku /etc/shadow w systemie Ubuntu 26.04 LTS?
    </question>
    <options>
      <item correct>yescrypt ($y$)</item>
      <item>MD5 ($1$)</item>
      <item>SHA-512 ($6$)</item>
    </options>

<div data-hint="error">
  Jest to algorytm oznaczany literą `y`, stworzony specjalnie w celu utrudnienia masowego łamania haseł na układach graficznych.
</div>
<div data-hint="success">
  Znakomicie! Domyślne wykorzystanie algorytmu `yescrypt` znacząco podnosi odporność bazy haseł na ataki słownikowe i brute-force.
</div>
  </data-quiz>
</data-gate>
