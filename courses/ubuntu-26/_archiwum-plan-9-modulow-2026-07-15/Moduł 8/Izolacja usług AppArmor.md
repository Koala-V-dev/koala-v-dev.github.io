# AppArmor: Piaskownica i izolacja usług

Nawet jeśli zabezpieczysz sieć zaporą, a SSH kluczami, wciąż istnieje ryzyko, że napastnik wykorzysta podatność typu 0-day w serwerze www (np. Apache czy Nginx). System **AppArmor** zapobiega rozprzestrzenianiu się ataku poprzez nałożenie na programy ścisłych profili bezpieczeństwa (piaskownic).

---

## 🛡️ Rola AppArmor w systemie Ubuntu

AppArmor to moduł bezpieczeństwa jądra Linuksa (LSM - Linux Security Module). Działa w oparciu o **profile**, które definiują, do jakich plików, katalogów, portów i uprawnień systemowych dany program ma dostęp.

* **Przykład:** Profil AppArmor dla serwera Nginx pozwala mu na odczyt plików konfiguracyjnych w `/etc/nginx/`, odczyt stron www w `/var/www/` i nasłuchiwanie na portach $80$ i $443$. Jeśli haker przejmie kontrolę nad procesem Nginx, AppArmor zablokuje mu próbę odczytania pliku `/etc/shadow` lub uruchomienia skryptu w `/tmp`, nawet jeśli przejęty proces Nginx działał z uprawnieniami roota!

---

## ⚙️ Tryby działania profili

Każdy profil AppArmor może działać w jednym z dwóch trybów:

### 1. Enforce (Wymuszanie)
* **Działanie:** System aktywnie blokuje wszelkie próby naruszenia reguł zdefiniowanych w profilu i zapisuje informacje o zdarzeniu w logach systemowych.

### 2. Complain (Skarga / Monitorowanie)
* **Działanie:** System pozwala programowi na wykonywanie zabronionych operacji, ale zapisuje każde naruszenie zasad w logach. Tryb ten służy do testowania nowych profili i diagnozowania, czy profil nie zakłóca normalnego działania aplikacji.

---

## 🛠️ Diagnostyka i sterowanie AppArmor

Przydatne narzędzia administracyjne:
* Sprawdź status profili: `sudo aa-status`. Pokazuje, ile profili jest załadowanych i które procesy działają w trybie wymuszania (enforced).
* Przełącz profil w tryb monitorowania: `sudo aa-complain /usr/sbin/nginx`.
* Przełącz profil w tryb aktywnego blokowania: `sudo aa-enforce /usr/sbin/nginx`.

---

## 🛠️ Punkt Kontrolny: Izolacja z AppArmor
<data-gate>
  <data-quiz>
    <question>
Jak zachowuje się system operacyjny wobec programu, którego profil AppArmor działa w trybie Complain?
    </question>
    <options>
      <item correct>Zezwala na wykonanie zabronionej operacji, ale rejestruje naruszenie profilu w logach systemowych.</item>
      <item>Całkowicie blokuje działanie programu i natychmiast kończy jego proces.</item>
      <item>Uruchamia program w wirtualnej maszynie typu Hyper-V.</item>
    </options>

<div data-hint="error">
  Słowo "Complain" oznacza "narzekać/skarżyć się". System nie stawia fizycznego oporu, a jedynie dokumentuje złamanie zasad w logach `/var/log/audit/audit.log`.
</div>
<div data-hint="success">
  Znakomicie! Tryb `Complain` jest nieoceniony podczas debugowania i dopasowywania reguł bezpieczeństwa dla niestandardowych wdrożeń.
</div>
  </data-quiz>
</data-gate>
