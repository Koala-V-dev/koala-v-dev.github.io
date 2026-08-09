# Node, npm i Vite z powtarzalną instalacją

Projekt działa na komputerze autora, ale instalacja w CI kończy się błędem. Zamiast zmieniać losowe pakiety, trzeba ustalić, które wejście środowiska jest inne.

Po tej lekcji przygotujesz projekt Vite, którego wersje i instalację można sprawdzić oraz powtórzyć.

## 🧠 Najpierw postaw hipotezę

Repozytorium zawiera:

```text
package.json
package-lock.json
src/
```

Lokalnie wykonano `npm install`. CI uruchamia `npm ci` i zgłasza, że lockfile nie zgadza się z `package.json`.

Który plik należy najpierw porównać ze zmianami w `package.json`? Nie proponuj jeszcze usunięcia `package-lock.json`. Jego niezgodność jest dowodem, nie śmieciem.

## 🧭 Model: trzy warstwy środowiska

```text
Node.js
└─ uruchamia npm i narzędzia
   └─ npm odtwarza drzewo z package-lock.json
      └─ Vite uruchamia i buduje aplikację
```

Każda warstwa odpowiada na inne pytanie.

`node --version` sprawdza środowisko uruchomieniowe. `npm --version` sprawdza menedżer pakietów. `npm ci` sprawdza, czy deklaracje i lockfile pozwalają na zamrożoną instalację.

Aktualny przewodnik Vite wymaga Node.js `20.19+` albo `22.12+`. Szablon może wymagać wersji wyższej, dlatego komunikat narzędzia ma pierwszeństwo przed zapamiętaną liczbą.

## 🔬 Utwórz i sprawdź projekt

W pustym katalogu wykonaj:

```bash
node --version
npm --version
npm create vite@latest panel-zamowienia -- --template vanilla
cd panel-zamowienia
npm install
npm run dev
```

Po zatrzymaniu serwera sprawdź trzy artefakty:

```text
package.json       deklarowane zależności i skrypty
package-lock.json  dokładnie rozwiązane drzewo
node_modules/      lokalnie zainstalowane pliki
```

Do repozytorium trafiają dwa pierwsze. `node_modules` jest wynikiem instalacji, nie źródłem projektu.

W czystej kopii repozytorium użyj:

```bash
npm ci
npm run build
```

`npm ci` wymaga lockfile. Gdy deklaracje są z nim sprzeczne, kończy pracę błędem zamiast po cichu przepisać blokadę.

## 🛠️ Punkt kontrolny: wybierz naprawę przyczyny

<data-gate>
  <data-quiz>
    <question>Dodano zależność ręcznie do `package.json`, ale nie zaktualizowano `package-lock.json`. Co należy zrobić w kontrolowanym środowisku deweloperskim?</question>
    <options>
      <option>Wyłączyć `npm ci` w CI.</option>
      <option correct>Uruchomić właściwą instalację, zweryfikować zmianę lockfile i zatwierdzić oba pliki.</option>
      <option>Dodać `node_modules` do repozytorium.</option>
    </options>
    <div data-hint="error">Celem jest uzgodnione wejście instalacji, a nie ominięcie kontroli.</div>
    <div data-hint="success">Lockfile rejestruje rozwiązane wersje i pozwala CI wykryć nieuzgodnioną zmianę.</div>
  </data-quiz>
</data-gate>

## 🧪 Zdiagnozuj raport środowiska

Funkcja otrzymuje raport. Zwróć pierwszą konkretną czynność diagnostyczną.

Przyjmij dla ćwiczenia minimalną wersję Node `20.19.0`. To próg bieżącej głównej wersji Vite w dniu redakcji kursu, nie reguła na zawsze.

<data-gate>
  <data-code-runner language="javascript" title="Wybierz następny krok diagnostyczny">
    <template data-type="code">
function diagnoseEnvironment(report) {
  return 'unknown';
}
    </template>
    <template data-type="requirements">
      [
        {
          "id": "node-too-old",
          "text": "Najpierw wykrywana jest niezgodna wersja Node",
          "type": "test-case",
          "functionName": "diagnoseEnvironment",
          "input": [{"node":"18.20.0","hasLock":true,"lockMatches":true}],
          "expected": "upgrade-node"
        },
        {
          "id": "missing-lock",
          "text": "Brak lockfile ma własną diagnozę",
          "type": "test-case",
          "functionName": "diagnoseEnvironment",
          "input": [{"node":"22.12.0","hasLock":false,"lockMatches":false}],
          "expected": "create-lock"
        },
        {
          "id": "node-22-too-old",
          "text": "Sama główna wersja 22 nie wystarcza poniżej progu 22.12",
          "type": "test-case",
          "functionName": "diagnoseEnvironment",
          "input": [{"node":"22.0.0","hasLock":true,"lockMatches":true}],
          "expected": "upgrade-node"
        },
        {
          "id": "stale-lock",
          "text": "Niezgodny lockfile nie jest traktowany jak poprawna instalacja",
          "type": "test-case",
          "functionName": "diagnoseEnvironment",
          "input": [{"node":"22.12.0","hasLock":true,"lockMatches":false}],
          "expected": "sync-lock"
        },
        {
          "id": "ready",
          "text": "Zgodne wejścia pozwalają uruchomić npm ci",
          "type": "test-case",
          "functionName": "diagnoseEnvironment",
          "input": [{"node":"20.19.0","hasLock":true,"lockMatches":true}],
          "expected": "run-npm-ci"
        }
      ]
    </template>
  </data-code-runner>
</data-gate>

<details>
<summary>Sprawdź rozwiązanie po samodzielnej próbie</summary>

```javascript
function diagnoseEnvironment(report) {
  const [major, minor] = report.node.split('.').map(Number);
  const supported =
    (major === 20 && minor >= 19) ||
    (major === 22 && minor >= 12) ||
    major > 22;

  if (!supported) return 'upgrade-node';
  if (!report.hasLock) return 'create-lock';
  if (!report.lockMatches) return 'sync-lock';
  return 'run-npm-ci';
}
```

Wersji nie porównuj jako zwykłych napisów. W produkcji użyj parsera semver i zakresu deklarowanego przez projekt.

</details>

## 🔄 Odtwórz projekt bez pamięci lokalnej

Sklonuj projekt do nowego katalogu. Nie kopiuj `node_modules`. Uruchom `npm ci`, testy i `npm run build`.

Kryterium: potrafisz wskazać wersje Node i npm, commit lockfile oraz wynik budowania. Sam komunikat „u mnie działa” nie jest dowodem powtarzalności.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Diagnozuj osobno Node, npm, lockfile i Vite.
- Traktuj `package-lock.json` jako wejście odtwarzalnej instalacji.
- Potwierdzaj środowisko przez czystą instalację i produkcyjny build.
