# Zapora i ekspozycja usług

Na desktopie zapora często wydaje się tematem serwerowym.

To błąd.

Nie dlatego, że masz od razu budować reguły dla każdej usługi, tylko dlatego, że musisz rozumieć prostą zależność:

```text
usługa nasłuchuje -> port jest osiągalny -> zapora może ten ruch przepuścić albo zablokować
```

W Ubuntu najwygodniejszym startem jest `ufw`, czyli prosta warstwa nad regułami zapory.

## Granica tego modułu

W kursie Desktop uczymy się:

- sprawdzić stan zapory,
- włączyć i wyłączyć UFW,
- dodać prostą regułę,
- usunąć prostą regułę,
- rozumieć, że reguła ma sens dopiero w kontekście usługi.

Nie robimy jeszcze pełnej administracji serwerowej.

SSH, wystawianie usług, profile aplikacji, porty usług i diagnostyka nasłuchu trafią szerzej do kursu Ubuntu Server.
