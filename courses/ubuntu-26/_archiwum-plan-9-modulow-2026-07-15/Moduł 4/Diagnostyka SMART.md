# Diagnostyka dysków i technologia SMART

Zapobieganie awariom sprzętowym to kluczowe zadanie każdego administratora. Technologia **S.M.A.R.T. (Self-Monitoring, Analysis and Reporting Technology)** wbudowana w nowoczesne dyski SSD oraz HDD pozwala na bieżąco monitorować ich parametry pracy i z wyprzedzeniem wykrywać symptomy uszkodzenia nośnika.

---

## 🛠️ Korzystanie ze smartctl w wierszu poleceń

Pakiet `smartmontools` dostarcza konsolowe narzędzie `smartctl`, którym odpytujemy wbudowany kontroler dysku o stan zdrowia.

### 1. Sprawdzenie podstawowego stanu zdrowia dysku
Polecenie zwraca ogólną informację, czy dysk przeszedł test wewnętrzny pomyślnie:
```bash
smartctl -H /dev/sda
```
* **Oczekiwany wynik:** `SMART overall-health self-assessment test result: PASSED`. Zwrócenie statusu `FAILED` oznacza natychmiastową konieczność wykonania backupu i wymiany nośnika.

### 2. Wyświetlenie szczegółowych atrybutów SMART
Dla dysków NVMe lub SATA SSD/HDD polecenie wyświetla listę liczników diagnostycznych:
```bash
smartctl -A /dev/nvme0n1
```
* **Critical Warning:** Wskazuje na krytyczne stany urządzenia (np. przekroczenie temperatury).
* **Percentage Used (dla NVMe):** Procent zużycia fabrycznego limitu zapisu pamięci Flash. Wartość powyżej $100\\%$ wskazuje, że dysk przekroczył gwarantowaną żywotność komórek pamięci.
* **Media and Data Integrity Errors:** Liczba wykrytych nieskorygowanych błędów zapisu/odczytu. Każda wartość powyżej zera wskazuje na uszkodzenie danych.

---

## 🔬 Uruchamianie testów diagnostycznych

Możemy wymusić na dysku przeprowadzenie testów wewnętrznych w tle:
* **Test krótki (Short):** Trwa zazwyczaj około $1 - 2$ minut. Testuje podstawową elektronikę i mechanikę:
  ```bash
  smartctl -t short /dev/sda
  ```
* **Test długi (Long):** Skanuje całą powierzchnię dysku bit po bicie. Może trwać od kilkunastu minut do kilku godzin w zależności od pojemności:
  ```bash
  smartctl -t long /dev/sda
  ```
Wyniki testów odczytujemy za pomocą polecenia: `smartctl -l selftest /dev/sda`.

---

## 🛠️ Punkt Kontrolny: Diagnostyka SMART
<data-gate>
  <data-quiz>
    <question>
Jaka flaga w programie smartctl pozwala odczytać ogólny, podstawowy test zdrowia (self-assessment test) dysku twardego?
    </question>
    <options>
      <item correct>-H (od Health)</item>
      <item>-A (od Attributes)</item>
      <item>-t long (od Test)</item>
    </options>

<div data-hint="error">
  Flaga ta pochodzi od słowa "Health" (Zdrowie) i zwraca najprostszą odpowiedź: PASSED lub FAILED.
</div>
<div data-hint="success">
  Świetnie! Flaga `-H` szybko informuje o stanie krytycznym dysku, co ułatwia automatyzację monitoringu na serwerach.
</div>
  </data-quiz>
</data-gate>
