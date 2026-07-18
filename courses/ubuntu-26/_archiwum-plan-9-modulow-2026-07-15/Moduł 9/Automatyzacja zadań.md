# Automatyzacja zadań: Cron i systemd timer

Automatyzacja powtarzalnych czynności (takich jak czyszczenie logów, rotacja baz danych czy wykonywanie backupów) to podstawa pracy administratora. W systemie Linux mamy do dyspozycji dwa główne mechanizmy harmonogramowania zadań: klasyczny demon **cron** oraz nowoczesne **timery systemd**.

---

## 📅 Klasyczny harmonogram: Cron

Demon `cron` odczytuje konfiguracje z tabel zadań użytkowników (tzw. `crontab`).

* Edycja tabeli zadań: `crontab -e`.
* Format wpisu (5 gwiazdek):
  ```text
  *  *  *  *  *  /sciezka/do/programu
  │  │  │  │  │
  │  │  │  │  └───── Dzień tygodnia (0 - 6) (Niedziela = 0)
  │  │  │  └──────── Miesiąc (1 - 12)
  │  │  └─────────── Dzień miesiąca (1 - 31)
  │  └──────────────── Godzina (0 - 23)
  └────────────────── Minuta (0 - 59)
  ```
  * *Przykład:* `30 2 * * * /usr/local/bin/backup.sh` (uruchamiaj skrypt codziennie o godzinie 02:30 w nocy).

---

## ⏱️ Nowoczesne timery systemd

Systemd wprowadza jednostki typu `.timer`, które są bardziej elastycznym zamiennikiem crona. Wykorzystanie timera wymaga pary plików: pliku usługi `.service` (definiującego co uruchomić) oraz pliku timera `.timer` (określającego kiedy to zrobić).

Przykładowy plik timera `/etc/systemd/system/backup.timer`:
```ini
[Unit]
Description=Timer do wyzwalania kopii zapasowej

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true
Unit=backup.service

[Install]
WantedBy=timers.target
```

### Dlaczego timery są lepsze od crona?
1. **Lepsza diagnostyka:** Logi z uruchomień trafiają wprost do `journalctl` i są powiązane z konkretną usługą.
2. **Persistent=true:** Jeśli serwer był wyłączony w czasie zaplanowanego uruchomienia (np. o 02:30), systemd uruchomi zadanie natychmiast po włączeniu systemu. Cron w takiej sytuacji po prostu zignorowałby to uruchomienie.
3. **Zależności:** Timer może zależeć od innych jednostek (np. nie uruchamiaj zadania, dopóki sieć lub baza danych nie jest w pełni sprawna).

---

## 🛠️ Punkt Kontrolny: Automatyzacja zadań
<data-gate>
  <data-quiz>
    <question>
Jaka jest główna zaleta stosowania timerów systemd nad klasycznym demonem cron w środowisku serwerowym?
    </question>
    <options>
      <item correct>Integracja z journalctl, obsługa zależności systemowych oraz możliwość natychmiastowego wykonania spóźnionego zadania po rozruchu (Persistent).</item>
      <item>Wyższa prędkość wykonywania kodu skryptów powłoki Bash o połowę.</item>
      <item>Całkowite zwolnienie pamięci RAM podczas wykonywania zadań w tle.</item>
    </options>

<div data-hint="error">
  Zwróć uwagę na to, co się stanie, gdy serwer przejdzie restart w momencie planowanego wyzwolenia zadania.
</div>
<div data-hint="success">
  Świetnie! Timery systemd zapewniają znacznie lepszą kontrolę, diagnostykę i niezawodność wykonywania zadań administracyjnych.
</div>
  </data-quiz>
</data-gate>
