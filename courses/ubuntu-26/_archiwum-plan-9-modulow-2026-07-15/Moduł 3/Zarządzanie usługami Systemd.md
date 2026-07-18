# Zarządzanie usługami i systemd

Systemd to nadrzędny menedżer systemu i usług (init daemon) w Ubuntu. Odpowiada za sekwencyjne lub równoległe uruchamianie demonów systemowych, monitorowanie ich stanu oraz zbieranie logów za pomocą binarnego dziennika zdarzeń.

---

## ⚙️ Jednostki (Units) systemd i plik usługi

Struktura działania systemd opiera się na plikach jednostek (`unit files`), znajdujących się w katalogu `/etc/systemd/system/` (konfiguracja administratora) lub `/lib/systemd/system/` (domyślne pliki pakietów).

Oto schemat prostego, napisanego od zera pliku usługi `/etc/systemd/system/moj_demon.service`:

```ini
[Unit]
Description=Moj wlasny demon monitorujacy
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/moj_skrypt.sh
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Wyjaśnienie kluczowych sekcji:
* **After=network.target:** Zależność. Usługa zostanie uruchomiona dopiero po zainicjalizowaniu sieci.
* **ExecStart:** Ścieżka do skryptu lub programu, który ma zostać uruchomiony.
* **Restart=on-failure:** Automatyczne wznawianie pracy. Jeśli program zakończy się błędem, systemd automatycznie go zrestartuje.
* **WantedBy=multi-user.target:** Definiuje cel rozruchu (target), w którym usługa ma być aktywna (odpowiednik runlevelu 3 – tryb konsolowy wieloużytkownikowy).

---

## 🔍 Logowanie zdarzeń: journalctl

Tradycyjne pliki tekstowe logów są zastępowane przez binarny dziennik systemd. Narzędzie `journalctl` pozwala na zaawansowane filtrowanie komunikatów bez potrzeby ręcznego parsowania:

* `journalctl -u moj_demon.service` (pokaż logi wygenerowane wyłącznie przez wybraną usługę).
* `journalctl -f` (śledź logi na żywo w czasie rzeczywistym).
* `journalctl -p err` (pokaż tylko błędy o priorytecie ERROR i wyższym).
* `journalctl --since "1 hour ago"` (pokaż logi z ostatniej godziny).

---

## 🛠️ Punkt Kontrolny: Zarządzanie systemd
<data-gate>
  <data-quiz>
    <question>
Gdzie administrator powinien umieścić napisany przez siebie plik usługi systemd (.service), aby system wczytał go priorytetowo?
    </question>
    <options>
      <item correct>/etc/systemd/system/</item>
      <item>/lib/systemd/system/</item>
      <item>/var/log/systemd/</item>
    </options>

<div data-hint="error">
  Zgodnie ze standardem FHS, katalog `/etc` służy do konfiguracji administratora lokalnego, natomiast `/lib` przechowuje pliki dostarczone przez pakiety.
</div>
<div data-hint="success">
  Świetnie! Katalog `/etc/systemd/system/` to właściwe miejsce na konfiguracje i nadpisywanie domyślnych usług.
</div>
  </data-quiz>
</data-gate>
