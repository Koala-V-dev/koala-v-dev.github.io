# Integracja z systemami Windows za pomocą Samba

W sieciach o strukturze mieszanej (gdzie obok systemów Linux pracują stacje robocze z systemem Windows) standardowy protokół NFS nie wystarcza. Do udostępniania plików i drukarek używa się oprogramowania **Samba**, które implementuje protokół **SMB (Server Message Block)** wykorzystywany przez systemy Windows.

---

## 🛠️ Konfiguracja serwera Samba

Po zainstalowaniu pakietu `samba`, główna konfiguracja udziałów odbywa się w pliku `/etc/samba/smb.conf`.

Przykładowa definicja zabezpieczonego udziału sieciowego:
```ini
[dane_wspolne]
   path = /srv/samba/dane
   browsable = yes
   writable = yes
   guest ok = no
   valid users = @smbgroup
   create mask = 0775
   directory mask = 0775
```

### Wyjaśnienie dyrektyw:
* **[dane_wspolne]:** Nazwa udziału widoczna w sieci (np. pod ścieżką `\\serwer\dane_wspolne` w Eksploratorze Windows).
* **browsable = yes:** Udział jest widoczny na liście zasobów sieciowych.
* **writable = yes:** Użytkownicy z uprawnieniami mogą zapisywać i modyfikować pliki.
* **guest ok = no:** Zablokowanie dostępu anonimowego (gościa).
* **valid users = @smbgroup:** Dostęp mają wyłącznie członkowie grupy systemowej `smbgroup`.
* **create mask / directory mask:** Domyślne uprawnienia nadawane nowo tworzonym plikom i katalogom.

---

## 👥 Mapowanie tożsamości i hasła Samby

Samba posiada osobną bazę haseł i kont, która musi być zsynchronizowana z użytkownikami Linuksa. Sam fakt istnienia konta w `/etc/passwd` nie daje mu dostępu do udziałów SMB.

### Krok 1: Dodaj użytkownika systemowego do bazy Samby
```bash
sudo smbpasswd -a kamil
```
(system poprosi o zdefiniowanie hasła dostępu do sieci).

### Krok 2: Uruchomienie i włączenie usługi
Aby zmiany weszły w życie, restartujemy demona SMB:
```bash
sudo systemctl restart smbd
```

---

## 🛠️ Punkt Kontrolny: Integracja z Windows (Samba)
<data-gate>
  <data-quiz>
    <question>
Jakie polecenie pozwala administratorowi dodać lokalnego użytkownika Linuksa do bazy autoryzacyjnej serwera Samba?
    </question>
    <options>
      <item correct>sudo smbpasswd -a nazwa_uzytkownika</item>
      <item>sudo useradd -g samba nazwa_uzytkownika</item>
      <item>sudo net share -add nazwa_uzytkownika</item>
    </options>

<div data-hint="error">
  Jest to program powiązany z hasłami Samby (`smbpasswd`) z flagą dodawania (`-a` od add).
</div>
<div data-hint="success">
  Znakomicie! Polecenie `smbpasswd -a` rejestruje użytkownika w bazie Samby, umożliwiając mu logowanie się do udziałów z poziomu systemów Windows.
</div>
  </data-quiz>
</data-gate>
