# Lokalne manuale Ubuntu

TerminalLab szuka stron manuala pod adresem:

```text
/public/resources/ubuntu-manual/NAZWA.txt
```

Przykład:

```bash
man adduser
```

wczyta:

```text
public/resources/ubuntu-manual/adduser.txt
```

Pliki warto trzymać w strukturze zbliżonej do `man`: `NAZWA`, `SKŁADNIA`, `OPIS`, `WAŻNE OPCJE`, `PRZYKŁADY`, `UWAGI`. Dzięki temu można przepisać faktyczne dane z Ubuntu, ale objaśnić je po polsku bez rozbijania narracji lekcji.

## Zasada pokrycia

Każda komenda używana w scenariuszu tutora lub misji powinna mieć odpowiadający plik `NAZWA.txt`. Dzięki temu `man NAZWA` może być elementem ćwiczeń, a nie tylko dekoracją terminala.

Dla komend, które mają wiele trybów (`tar`, `ufw`, `ip`, `systemctl`), manual w kursie powinien opisywać tylko zakres faktycznie używany w danym etapie kursu.
