# Pakiet diagnostyczny

Po rekonesansie masz wyniki.

Teraz trzeba je potraktować jak materiał roboczy: zebrać w katalogu, spakować i sprawdzić, czy archiwum naprawdę zawiera to, co miało zawierać.

## Tutor terminala

<data-gate>

<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m3-02-pakiet-diagnostyczny.md"></data-terminal-tutor>

</data-gate>

## Misja: spakuj raport

Masz gotowy katalog `Raport`. Twoim zadaniem jest przygotować archiwum tar i ZIP oraz potwierdzić zawartość przynajmniej archiwum tar.

<data-gate>

<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m3-02-spakuj-raport.md"></data-terminal-mission>

</data-gate>

## Sens ćwiczenia

Na realnym systemie archiwum bez weryfikacji potrafi być piękną katastrofą.

Plik `raport.tar` może istnieć, ale zawierać zły katalog. ZIP może powstać bez zawartości katalogu, jeśli zapomnisz `-r`.

Dlatego uczymy się wzorca:

```text
utwórz archiwum -> wypisz zawartość -> dopiero wtedy uznaj pakiet za gotowy
```

### Co masz wynieść z tej lekcji

- Archiwum jest użyteczne dopiero po sprawdzeniu zawartości.
- `tar -tf` jest szybkim audytem bez rozpakowywania.
- `zip -r` jest wymagane przy pakowaniu katalogu.
