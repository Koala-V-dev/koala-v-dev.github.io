# Uprawnienia tradycyjne i listy kontroli dostępu ACL

Standard bezpieczeństwa POSIX definiuje uprawnienia do plików i katalogów w sposób uproszczony, przypisując prawa do trzech podmiotów. Gdy to nie wystarcza, z pomocą przychodzą zaawansowane listy kontroli dostępu **ACL (Access Control Lists)**.

---

## 🧮 Tradycyjne uprawnienia POSIX i zapis ósemkowy

Każdy plik posiada przypisane prawa odczytu (**r**ead), zapisu (**w**rite) oraz wykonania e**x**ecution) dla trzech poziomów:
1. **Owner (u):** Właściciel pliku.
2. **Group (g):** Grupa przypisana do pliku.
3. **Others (o):** Wszyscy inni użytkownicy systemu.

### Zapis ósemkowy uprawnień:
Przypisujemy wartości liczbowe do praw: `r=4`, `w=2`, `x=1`. Sumujemy wartości dla każdego poziomu:
* **755** (`rwxr-xr-x`): Właściciel ma pełne prawa ($4+2+1=7$), Grupa i Inni mogą odczytywać i uruchamiać ($4+0+1=5$).
* **644** (`rw-r--r--`): Właściciel może czytać i pisać ($4+2=6$), Grupa i Inni tylko czytać ($4$).
* **600** (`rw-------`): Tylko właściciel ma dostęp do pliku.

Polecenie zmiany uprawnień: `chmod 755 plik.sh`.

---

## 📑 Listy kontroli dostępu ACL (POSIX ACL)

Tradycyjne uprawnienia uniemożliwiają przydzielenie uprawnień dla czwartego podmiotu (np. chcemy dać pełne prawa właścicielowi, odczyt dla grupy głównej, ale dodatkowo chcemy dać prawo zapisu dla jednego, konkretnego użytkownika spoza grupy). Do tego służy pakiet `acl`.

### 1. Odczyt uprawnień ACL
Do sprawdzenia precyzyjnych uprawnień służy polecenie `getfacl`:
```bash
getfacl dokument.txt
```

### 2. Nadawanie i modyfikacja praw ACL
Służy do tego polecenie `setfacl`.
* Daj użytkownikowi `kamil` prawo do zapisu i odczytu pliku:
  ```bash
  setfacl -m u:kamil:rw dokument.txt
  ```
* Daj grupie `technicy` prawo do odczytu pliku:
  ```bash
  setfacl -m g:technicy:r dokument.txt
  ```
* Usuń wszystkie uprawnienia ACL z pliku, wracając do standardowych praw POSIX:
  ```bash
  setfacl -b dokument.txt
  ```

---

## 🛠️ Punkt Kontrolny: Uprawnienia i ACL
<data-gate>
  <data-quiz>
    <question>
Jakie polecenie pozwoli nadać użytkownikowi o nazwie marek pełne prawa rwx do katalogu /data za pomocą listy ACL?
    </question>
    <options>
      <item correct>setfacl -m u:marek:rwx /data</item>
      <item>chmod 777 u:marek /data</item>
      <item>setfacl -x u:marek:rwx /data</item>
    </options>

<div data-hint="error">
  Do modyfikacji ACL używasz polecenia `setfacl` z flagą `-m` (modify). Format określania użytkownika to `u:nazwa_uzytkownika:uprawnienia`.
</div>
<div data-hint="success">
  Doskonale! Polecenie `setfacl -m u:marek:rwx` modyfikuje listę ACL, przydzielając precyzyjne uprawnienia wybranemu użytkownikowi bez modyfikacji praw grupy głównej.
</div>
  </data-quiz>
</data-gate>
