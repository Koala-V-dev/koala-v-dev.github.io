# Zapora w praktyce

W tej lekcji zapora nie jest jeszcze pełnym tematem serwerowym.

Chodzi o pierwszy, świadomy cykl:

```text
sprawdź stan -> włącz zaporę -> dodaj regułę -> sprawdź -> usuń regułę testową -> sprawdź
```

## Tutor terminala

<data-gate>

<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m4-01-ufw-podstawy.md"></data-terminal-tutor>

</data-gate>

## Misja: reguła testowa

Masz włączyć zaporę, dodać regułę testową dla SSH, potwierdzić stan, a potem usunąć regułę testową.

Na końcu zapora ma zostać aktywna, ale bez reguły `allow 22/tcp`.

<data-gate>

<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m4-01-regula-testowa-ufw.md"></data-terminal-mission>

</data-gate>

## Dlaczego usuwamy regułę?

Bo to Desktop.

Nie ustawiamy trwałej ekspozycji SSH w kursie, który jeszcze nie uczy SSH jako usługi. Uczymy mechaniki i zostawiamy system w stanie uporządkowanym.

### Co masz wynieść z tej lekcji

- Regułę zapory trzeba potwierdzić po dodaniu.
- Testową regułę trzeba umieć usunąć.
- Stan końcowy jest ważniejszy niż sama historia wpisanych komend.
