# Rekonesans maszyny w praktyce

W tej lekcji nie „naprawiasz komputera”.

Uczysz się zrobić pierwszy, powtarzalny rekonesans. Po takim rekonesansie można dopiero mówić sensownie: brakuje miejsca, brakuje RAM, dysk jest zamontowany inaczej niż zakładaliśmy, procesy zjadają zasoby.

## Tutor terminala

<data-gate>

<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m3-01-rekonesans-maszyny.md"></data-terminal-tutor>

</data-gate>

## Misja: raport stanu

Masz zebrać minimalny raport stanu maszyny.

Nie liczy się kolejność. Liczy się, czy w terminalu widać sensowny zestaw dowodów.

<data-gate>

<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m3-01-raport-stanu.md"></data-terminal-mission>

</data-gate>

## Dlaczego to jest ważne

Na serwerze bardzo często zaczynasz od pytań:

```text
czy dysk jest pełny?
czy system widzi właściwy nośnik?
czy RAM realnie się skończył?
czy jakiś proces obciąża maszynę?
```

Bez tych odpowiedzi możesz godzinę grzebać w złym miejscu.

### Co masz wynieść z tej lekcji

- Rekonesans to nie losowe odpalanie komend.
- `df`, `free`, `lsblk`, `lshw`, `top` i `htop` tworzą szybki obraz maszyny.
- Wynik komendy jest dowodem, który można później wkleić do raportu albo zgłoszenia.
