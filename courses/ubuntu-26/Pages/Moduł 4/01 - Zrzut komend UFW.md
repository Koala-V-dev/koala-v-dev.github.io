# Zrzut komend: UFW

`ufw` to wygodna zapora Ubuntu.

Nie myśl o niej jak o magicznej ochronie internetu. Myśl prościej:

```text
czy ta maszyna ma przyjmować ruch na dany port?
```

## Status zapory

```bash
sudo ufw status
```

Pokazuje, czy zapora jest aktywna.

Przy aktywnej zaporze zobaczysz także reguły.

```bash
sudo ufw status numbered
```

Pokazuje reguły z numerami. Przydaje się przy sprzątaniu bardziej rozbudowanej konfiguracji.

## Włączenie i wyłączenie

```bash
sudo ufw enable
```

Włącza zaporę.

```bash
sudo ufw disable
```

Wyłącza zaporę.

W realnym systemie nie rób tego odruchowo na zdalnej maszynie. Na serwerze możesz odciąć sobie dostęp, jeżeli najpierw nie przepuścisz SSH.

## Prosta reguła

```bash
sudo ufw allow 22/tcp
```

Dopuszcza ruch TCP na porcie `22`, czyli typowym porcie SSH.

W Desktopie to tylko przykład. Pełny temat SSH będzie sensowny dopiero przy Ubuntu Server.

```bash
sudo ufw deny 22/tcp
```

Dodaje regułę blokującą ruch do tego portu.

## Usunięcie reguły

```bash
sudo ufw delete allow 22/tcp
```

Usuwa konkretną regułę.

Po każdej zmianie sprawdź stan:

```bash
sudo ufw status
```

## Punkt kontrolny: co robi zapora

<data-gate>
  <data-quiz>
    <question>
Co realnie kontroluje zapora UFW w tym module?
    </question>
    <options>
      <item correct>Reguluje, czy ruch przychodzący do usług i portów na maszynie ma być przepuszczany.</item>
      <item>Przyspiesza internet i automatycznie aktualizuje pakiety.</item>
      <item>Zastępuje hasła użytkowników i uprawnienia plików.</item>
    </options>

<div data-hint="error">
  Zapora nie zastępuje kont, haseł ani aktualizacji. Kontroluje ruch sieciowy do usług.
</div>
<div data-hint="success">
  Tak. To podstawowy model: usługa, port, ruch przychodzący, decyzja zapory.
</div>
  </data-quiz>
</data-gate>

### Co masz wynieść z tej lekcji

- `sudo ufw status` pokazuje stan zapory.
- `sudo ufw enable` i `sudo ufw disable` zmieniają stan zapory.
- `sudo ufw allow 22/tcp` dodaje prostą regułę.
- `sudo ufw delete allow 22/tcp` usuwa konkretną regułę.
