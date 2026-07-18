# Zrzut komend: adduser, useradd i sprzątanie kont

W Ubuntu spotkasz dwa style narzędzi.

`adduser` i `addgroup` są wygodne, debianowe i bardziej „ludzkie”. Nadają się do ręcznej pracy w terminalu.

`useradd` i `groupadd` są niższego poziomu. Są krótsze, mniej rozmowne i częściej pasują do skryptów, bo robią dokładnie to, co wynika z opcji.

## Dwie drogi tworzenia konta

```bash
sudo adduser technik
```

Tworzy konto przez kreator. W typowym Ubuntu dostajesz katalog domowy, grupę podstawową i serię pytań.

```bash
sudo useradd technik
```

Tworzy wpis konta, ale bez opcji `-m` nie zakłada katalogu domowego.

```bash
sudo useradd -m technik
```

Tworzy konto i katalog domowy. To jest najważniejsza różnica, którą trzeba świadomie kontrolować.

## Grupy: addgroup i groupadd

```bash
sudo addgroup audyt
```

Debianowy wariant do ręcznej pracy.

```bash
sudo groupadd audyt
```

Niskopoziomowy wariant. Dobry, gdy budujesz powtarzalną instrukcję albo skrypt.

## Sprzątanie po kontach testowych

```bash
sudo deluser --remove-home testowy
```

Usuwa konto i jego katalog domowy.

```bash
sudo groupdel testowa
```

Usuwa grupę. Nie usuwaj grupy w ciemno, jeśli nadal jest używana jako grupa podstawowa istniejącego użytkownika.

## Manual bez zgadywania

```bash
man adduser
man useradd
man deluser
```

W tym kursie `man` czyta lokalne strony z katalogu:

```text
/public/resources/ubuntu-manual
```

Dzięki temu najpierw masz strukturę prawdziwego manuala, a dopiero potem polskie objaśnienie w lekcji.

## Punkt kontrolny: kreator kontra narzędzie niskopoziomowe

<data-gate>
  <data-quiz>
    <question>
Dlaczego `sudo useradd test` może utworzyć konto bez katalogu `/home/test`?
    </question>
    <options>
      <item correct>Bo `useradd` jest niskopoziomowe i katalog domowy wymaga zwykle opcji `-m`.</item>
      <item>Bo `useradd` zawsze tworzy tylko grupy, a nie użytkowników.</item>
      <item>Bo Ubuntu blokuje katalogi domowe dla wszystkich kont tworzonych przez terminal.</item>
    </options>

<div data-hint="error">
  Porównaj `adduser` z `useradd -m`. W jednym przypadku kreator robi więcej domyślnie, w drugim jawnie sterujesz opcjami.
</div>
<div data-hint="success">
  Tak. To jest praktyczna różnica między wygodnym kreatorem a narzędziem dobrym do automatyzacji.
</div>
  </data-quiz>
</data-gate>

### Co masz wynieść z tej lekcji

- `adduser` i `addgroup` są wygodnymi narzędziami Debiana/Ubuntu.
- `useradd` i `groupadd` są niższego poziomu i wymagają większej świadomości opcji.
- `deluser --remove-home` usuwa konto razem z katalogiem domowym.
- `groupdel` ma sens dopiero po sprawdzeniu, czy grupa nie jest nadal potrzebna.
