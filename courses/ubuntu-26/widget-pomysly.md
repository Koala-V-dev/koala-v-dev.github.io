# Widget: data-permission-lab — wnioski i specyfikacja koncepcyjna

## Dlaczego ten widget ma sens

Model uprawnień w Linuksie jest czytany przez ucznia jako abstrakcyjna notacja
zanim zobaczy jej skutki. Quiz z pytaniem "co znaczy 755?" działa na pamięć, nie
na rozumienie. Terminal-mission zakłada, że uczeń zna już składnię `chmod`.

Brakuje warstwy pośredniej: **eksploracja skutków przed zapamiętaniem składni**.

---

## Cel dydaktyczny

Uczeń eksperymentuje myszką — ustawia uprawnienia i sprawdza, co to oznacza dla
konkretnego użytkownika. Nie zapamiętuje schematu. Rozumie model.

Pytanie, które widget ma odpowiedzieć przez interakcję, nie przez tekst:

> Jeżeli plik ma `rw-r-----`, a Marta jest w grupie właściciela — co może z nim zrobić?

---

## Mechanizm

### Panel pliku/katalogu
- Ścieżka, ikona (plik / katalog / plik wykonywalny), właściciel, grupa.
- Trzy wiersze uprawnień z przełącznikami r / w / x:
  - właściciel (user)
  - grupa (group)
  - pozostali (other)
- Na żywo: wyświetla notację symboliczną (`rw-r-----`) i ósemkową (`640`).

### Panel testowania
- Uczeń wybiera tożsamość testową: "Jan (właściciel)", "Marta (należy do grupy)", "Gość (inna grupa)".
- Uczeń klika akcję: **Odczytaj** / **Zapisz** / **Uruchom**.
- Widget odpowiada natychmiastowym wynikiem:
  - ✅ `Dozwolone — Jan ma uprawnienie w` lub
  - ❌ `Odmowa dostępu — Gość nie ma żadnego uprawnienia`
- Wynik jest wyjaśniony jednym zdaniem mechanizmu, nie komunikatem błędu systemu.

### Tryb scenariuszowy
Oprócz swobodnej eksploracji scenariusz może zadać konkretny cel:

> "Ustaw uprawnienia tak, żeby Jan mógł pisać, wszyscy mogli czytać, nikt nie mógł uruchomić."

Widget waliduje stan uprawnień i emituje `unlocked` po osiągnięciu celu.

---

## Przypadki specjalne do implementacji

### Notacja 4-cyfrowa (SUID, SGID, Sticky bit)

Apache i inne usługi systemowe używają czterech cyfr, np. `2755`.
Uczeń zobaczy to przy pierwszym `ls -la /usr/bin/` lub diagnozie usługi.

Czwarta cyfra (specjalne bity):

| Bit       | Wartość | Skrót | Znaczenie                                              |
|-----------|---------|-------|--------------------------------------------------------|
| SUID      | 4       | `s`   | Plik uruchamia się z prawami właściciela, nie wywołującego |
| SGID      | 2       | `s`   | Plik/katalog dziedziczy grupę właściciela               |
| Sticky    | 1       | `t`   | Katalog: usuwa tylko właściciel pliku (np. `/tmp`)      |
| (brak)    | 0       | –     | Brak bitów specjalnych                                  |

Widget powinien umożliwiać włączenie/wyłączenie tych bitów i natychmiast
pokazywać zapis `ls -la` z literą `s` lub `t` na właściwej pozycji.

**Przykład który należy wytłumaczyć**: `rwsr-xr-x` (SUID na pliku wykonywalnym)
→ każdy uruchamia, ale program działa z prawami właściciela (klasyczny `passwd`).

**Przykład sticky**: `rwxrwxrwt` na katalogu `/tmp`
→ wszyscy mogą pisać, ale nikt nie usunie cudzego pliku.

### Katalog vs plik

Uprawnienie `x` ma inne znaczenie dla katalogu (możliwość wejścia `cd`)
niż dla pliku (możliwość uruchomienia). Widget powinien to rozróżniać w komunikatach.

---

## Czego widget NIE robi

- Nie jest emulatorem terminala.
- Nie uczy składni `chmod` bezpośrednio — ta pojawia się po eksploracji, w Tutorze.
- Nie sprawdza ACL (za wcześnie na tym etapie kursu).
- Nie symuluje `sudo` — uprawnienia roota to osobna lekcja.

---

## Miejsce w kursie

Rozdział 3: Tożsamość, dane i granice dostępu.

Sekwencja:

1. **data-permission-lab** — eksploracja modelu bez składni.
2. **data-terminal-tutor** — `chmod`, `chown` z wyjaśnieniem.
3. **data-terminal-mission** — zadanie operacyjne: ustaw właściwe prawa, zweryfikuj.
4. **data-quiz** — punkt kontrolny: mechanizm, nie pamięć notacji.

---

## Tag

```html
<data-permission-lab src="/public/courses/ubuntu-26/Scenarios/permissions/model-rwx.md">
</data-permission-lab>
```

---

*Dokument roboczy. Aktualizować przed implementacją.*

---

# Pozostałe widgety — decyzje i zakres

## `data-process-stream-model`

Wizualny model relacji: proces jako blok z portami `stdin` / `stdout` / `stderr`.
Uczeń manipuluje połączeniami (pipe, redirect, /dev/null) i widzi jak zmienia się model.
Nie wpisuje komendy — rozumie relację przestrzenną zanim zacznie ją zapisywać.

**Zakres**: ✅ Desktop — fundament rozdziału 1 (potoki, przekierowania).

**Czego NIE jest**: nie animacja konkretnego potoku, nie budowanie potoku.
To model konceptualny — jeden widget, jedna idea.

---

## `data-package-layer` — odłożony

Koncepcja: apt → pliki w systemie → unit systemd → proces.
Pokazuje cztery warstwy instalacji jednocześnie.

**Problem zakresu**: warstwy 1–2 (apt → pliki) są Desktopowe.
Warstwa 3–4 (unit systemd → usługa) należy do Server.

Desktop użytkownik nie instaluje nginx ani apache,
więc nie ma kontekstu dlaczego to ważne.

**Decyzja**: odłożony do przyszłego kursu Ubuntu Server.
W Desktop kursie można zasygnalizować istnienie warstwy usług bez budowania wokół niej widgetu.

---

## Tabela zakresów

| Widget | Zakres | Rozdział | Status |
|--------|--------|----------|--------|
| `data-permission-lab` | ✅ Desktop | 3 | Do implementacji |
| `data-process-stream-model` | ✅ Desktop | 1 | Do implementacji po #1 |
| `data-package-layer` | ⚠️ Głównie Server | — | Odłożony do kursu Server |
