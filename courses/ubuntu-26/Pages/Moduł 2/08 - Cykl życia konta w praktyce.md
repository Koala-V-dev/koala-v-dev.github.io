# Cykl życia konta w praktyce

Konto użytkownika nie jest jedną komendą.

W praktyce administracyjnej jest cykl:

```text
sprawdź dokumentację -> utwórz konto/grupę -> ustaw dostęp -> zweryfikuj -> usuń rzeczy testowe
```

W tym ćwiczeniu zobaczysz różnicę między kontem tworzonym wygodnym kreatorem i kontem tworzonym niskopoziomowo.

## Tutor terminala

<data-gate>

<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m2-04-kreatory-i-usuwanie-kont.md"></data-terminal-tutor>

</data-gate>

## Misja: konto serwisowe bez śmieci

Masz przygotować konto do późniejszego zbierania raportów, a jednocześnie usunąć konto i grupę testową.

To jest mały model pracy administratora: nie tylko tworzysz nowy stan, ale też sprzątasz stan tymczasowy.

<data-gate>

<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m2-04-konto-serwisowe-bez-smieci.md"></data-terminal-mission>

</data-gate>

## Po co to przed Ubuntu Server?

Na serwerze konta techniczne, grupy robocze i katalogi usług są codziennością.

Jeżeli teraz rozumiesz, że `useradd` bez `-m` może nie stworzyć katalogu domowego, później nie będziesz traktować błędów usług jak magii. Będziesz sprawdzać stan: konto, katalog, grupę, hasło, uprawnienia.

### Co masz wynieść z tej lekcji

- Tworzenie konta kończy się dopiero po audycie przez `id`, `groups` albo `getent`.
- `useradd -m` ma inny efekt niż samo `useradd`.
- Sprzątanie kont testowych jest częścią pracy, nie dodatkiem po fakcie.
