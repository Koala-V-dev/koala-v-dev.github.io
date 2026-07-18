# Zrzut komend: diagnostyka maszyny

Ten zestaw odpowiada na pytanie: co system widzi?

Nie diagnozujesz jeszcze konkretnej awarii. Budujesz szybki obraz maszyny.

## Miejsce na dyskach

```bash
df -h
```

Pokazuje zajętość zamontowanych systemów plików.

Patrz przede wszystkim na:

- `Mounted on`, czyli gdzie dany system plików jest podpięty,
- `Use%`, czyli procent zajętości,
- `/`, czyli główny system plików.

## Pamięć RAM i swap

```bash
free -h
```

Pokazuje RAM, cache i swap.

Kolumna `available` jest ważniejsza niż paniczne patrzenie na `free`, bo Linux używa pamięci także jako cache.

## Dyski i partycje

```bash
lsblk
lsblk -f
```

`lsblk` pokazuje urządzenia blokowe: dyski, partycje i punkty montowania.

`lsblk -f` dodaje system plików, etykietę i UUID. To jest bardzo użyteczne przed montowaniem dysków, diagnozą nośników i pracą z `/etc/fstab`.

## Sprzęt

```bash
sudo lshw -short
```

Pokazuje skrócony widok sprzętu: pamięć, procesor, dyski, sieć.

To nie jest komenda do codziennego klikania. To narzędzie do rozpoznania, z czym naprawdę pracujesz.

## Procesy

```bash
top
htop
```

`top` jest dostępny prawie zawsze.

`htop` jest wygodniejszy, ale w prawdziwym systemie może wymagać instalacji pakietu.

W tym kursie oba polecenia pokazują statyczny zrzut, żeby nie udawać pełnoekranowego programu w małym labie.

## Punkt kontrolny: co sprawdza `lsblk`

<data-gate>
  <data-quiz>
    <question>
Która komenda najlepiej pokaże dyski, partycje i punkty montowania?
    </question>
    <options>
      <item>`free -h`, bo pokazuje RAM i swap.</item>
      <item correct>`lsblk`, szczególnie `lsblk -f`, bo pokazuje urządzenia blokowe i montowania.</item>
      <item>`top`, bo pokazuje procesy.</item>
    </options>

<div data-hint="error">
  Szukasz dysków i partycji, więc potrzebujesz widoku urządzeń blokowych.
</div>
<div data-hint="success">
  Tak. `lsblk -f` jest jednym z najważniejszych szybkich rekonesansów przed pracą z dyskami.
</div>
  </data-quiz>
</data-gate>

### Co masz wynieść z tej lekcji

- `df -h` odpowiada, ile miejsca zostało na zamontowanych systemach plików.
- `free -h` odpowiada, jak wygląda pamięć RAM i swap.
- `lsblk -f` pokazuje dyski, partycje, systemy plików i montowania.
- `lshw -short`, `top` i `htop` dają szybki obraz maszyny i procesów.
