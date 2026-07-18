# Zrzut komend: archiwa `tar`, `zip`, `unzip`

Kopiowanie plików jest dobre na początek.

Gdy chcesz przekazać cały katalog raportów, konfiguracji albo logów, wygodniej zrobić archiwum.

## Archiwum tar

```bash
tar -cf raport.tar Raport
```

Tworzy archiwum `raport.tar` z katalogu `Raport`.

```bash
tar -tf raport.tar
```

Pokazuje zawartość archiwum bez rozpakowywania.

```bash
tar -xf raport.tar
```

Rozpakowuje archiwum do bieżącego katalogu.

## ZIP

```bash
zip -r raport.zip Raport
```

Tworzy archiwum ZIP z katalogu `Raport`.

Opcja `-r` oznacza przejście przez katalog i jego zawartość.

```bash
unzip raport.zip
```

Rozpakowuje archiwum ZIP.

## Kiedy `tar`, a kiedy `zip`

`tar` jest naturalny w świecie Linuksa, szczególnie przy katalogach, uprawnieniach i pracy serwerowej.

`zip` jest wygodny, gdy archiwum ma trafić do osoby albo systemu spoza Linuksa.

## Punkt kontrolny: sprawdzanie archiwum

<data-gate>
  <data-quiz>
    <question>
Po co uruchomić `tar -tf raport.tar` po utworzeniu archiwum?
    </question>
    <options>
      <item>Żeby automatycznie usunąć katalog źródłowy po spakowaniu.</item>
      <item correct>Żeby sprawdzić, co faktycznie trafiło do archiwum, bez rozpakowywania go.</item>
      <item>Żeby zmienić archiwum tar w archiwum zip.</item>
    </options>

<div data-hint="error">
  `-t` w tym kontekście służy do listowania zawartości archiwum.
</div>
<div data-hint="success">
  Tak. Archiwum bez sprawdzenia zawartości jest tylko założeniem.
</div>
  </data-quiz>
</data-gate>

### Co masz wynieść z tej lekcji

- `tar -cf` tworzy archiwum tar.
- `tar -tf` listuje zawartość archiwum.
- `tar -xf` rozpakowuje archiwum.
- `zip -r` pakuje katalog do ZIP, a `unzip` go rozpakowuje.
