# Synteza: querySelectorAll, forEach i addEventListener

W poprzedniej lekcji zmieniałeś wygląd całej grupy kart po kliknięciu jednego wspólnego przycisku. Co jednak zrobić, gdy na stronie stoi 6 zakładek albo 12 kafelków cennika, a każdy z nich ma reagować osobno na własne kliknięcie?

Nadawanie każdemu kafelkowi osobnego identyfikatora `#kafelek-1`, `#kafelek-2` i kopiowanie dwunastu identycznych bloków `addEventListener` kończy się awarią przy pierwszej zmianie oferty. Wystarczy dopisać trzynasty kafelek w HTML, a kod przestaje go zauważać.

Rozwiązaniem jest połączenie wszystkiego, co opanowałeś w tym module, w jeden fundament interaktywnego front-endu: pętlę `forEach`, która automatycznie podpina zdarzenie `click` do każdego elementu kolekcji.

## 🔗 Dwa poziomy funkcji strzałkowych

Przyjrzyj się uważnie poniższemu wzorcowi. Zapis ten pojawia się w niemal każdej aplikacji webowej, dlatego musisz rozumieć dokładnie, co dzieje się na obu jego poziomach.

```javascript
const przyciski = document.querySelectorAll(".przycisk");

przyciski.forEach((przycisk) => {
  przycisk.addEventListener("click", () => {
    console.log("Kliknięto:", przycisk.textContent);
  });
});
```

Najczęstszym źródłem zamieszania są tu **dwie zagnieżdżone funkcje strzałkowe** `=>`. Wyglądają podobnie, ale działają w zupełnie innych momentach czasu:

- **Poziom 1 (zewnętrzna funkcja w `forEach`):** uruchamia się natychmiast po załadowaniu strony, dokładnie raz dla każdego przycisku w kolekcji. Jej zadaniem nie jest obsługa kliknięcia, lecz **rejestracja nasłuchiwacza** na bieżącym elemencie *przycisk*.
- **Poziom 2 (wewnętrzna funkcja w `addEventListener`):** przy starcie skryptu nie uruchamia się ani razu. Przeglądarka zapisuje ją w pamięci przy konkretnym przycisku i uruchomi dopiero wtedy, gdy użytkownik kliknie ten właśnie przycisk.

> [!IMPORTANT]
> **Model mentalny:** Zewnętrzna pętla `forEach` pracuje jak elektryk, który raz montuje włącznik przy każdej lampie. Wewnętrzna funkcja `addEventListener` to obwód, który zamyka się dopiero wtedy, gdy ktoś naciśnie konkretny włącznik.

## 🔍 Przewidź, sprawdź, wyjaśnij: kolejność logów A i B

Sprawdź swój model mentalny na konkretnym eksperymencie. Na stronie znajdują się dokładnie 4 przyciski z klasą `.opcja`. Uruchamiamy następujący skrypt:

```javascript
const opcje = document.querySelectorAll(".opcja");

opcje.forEach((opcja) => {
  console.log("A");
  opcja.addEventListener("click", () => {
    console.log("B");
  });
});
```

**Krok 1 (Przewidź):** Odpowiedz na dwa pytania, zanim przeczytasz wynik:
1. Co dokładnie pojawi się w konsoli zaraz po załadowaniu strony, zanim cokolwiek klikniesz?
2. Co dopisze się do konsoli, gdy klikniesz drugi przycisk na liście?

**Krok 2 (Obserwuj):**
- Zaraz po załadowaniu strony konsola wypisuje cztery linie: `A`, `A`, `A`, `A`. Litera `B` nie pojawia się ani razu.
- Po kliknięciu drugiego przycisku w konsoli dopisuje się dokładnie jedna linia: `B`. Litera `A` już się nie powtarza.

**Krok 3 (Wyjaśnij):** Podczas ładowania strony pętla `forEach` przeszła przez wszystkie 4 przyciski. W każdej z 4 iteracji natychmiast wykonała `console.log("A")` oraz zapisała funkcję z `console.log("B")` do wykonania na przyszłość.

Gdy użytkownik kliknął drugi przycisk, pętla `forEach` była już dawno zakończona. Przeglądarka uruchomiła wyłącznie wewnętrzną funkcję przypisaną do tego jednego przycisku, dlatego na ekranie pojawiło się pojedyncze `B`.

## 🏷️ Odczyt danych z HTML przez atrybuty data i obiekt dataset

Kiedy użytkownik kliknie kafelek, funkcja wewnętrzna musi wiedzieć, jakie dane należą do tego elementu: opis zakładki, kod produktu albo jego cenę. Wyciąganie liczby z napisu widocznego dla człowieka (na przykład „Dysk SSD 1 TB (299 zł)”) jest kruche i podatne na błędy.

Standard HTML pozwala zapisać czyste dane techniczne bezpośrednio na znaczniku za pomocą własnych atrybutów zaczynających się od przedrostka **`data-`**:

```html
<button class="kafelek" data-nazwa="Dysk SSD 1 TB" data-cena="299">
  Dysk SSD 1 TB (299 zł)
</button>
```

W JavaScripcie przeglądarka zbiera wszystkie atrybuty `data-*` danego elementu w jednym obiekcie _**dataset**_. Nazwa właściwości w *dataset* odpowiada temu, co stoi po `data-`:

```javascript
const kafelek = document.querySelector(".kafelek");

console.log(kafelek.dataset.nazwa); // "Dysk SSD 1 TB"
console.log(kafelek.dataset.cena);  // "299" (uwaga: to jest tekst!)

const cenaLiczba = Number(kafelek.dataset.cena); // 299 (liczba do obliczeń)
```

> [!WARNING]
> **Typ danych w dataset:** Każda wartość odczytana z `el.dataset` ma zawsze typ tekstowy (`string`). Jeśli dodasz `"299" + "150"`, otrzymasz napis `"299150"` zamiast liczby `449`. Przed operacjami arytmetycznymi zawsze zamieniaj wartość przez `Number(el.dataset.cena)`.

Jeśli nazwa atrybutu w HTML zawiera myślnik, na przykład `data-kod-produktu`, JavaScript automatycznie zamienia ją na zapis wielbłądzi: `el.dataset.kodProduktu`.

## 🎯 Wzorzec wyłączności: wyczyść wszystkie, zaznacz kliknięty

W wielu interfejsach (zakładki, menu nawigacji, wybór pojedynczego wariantu) aktywny może być tylko jeden element naraz. Kiedy użytkownik klika nową zakładkę, poprzednia musi stracić wyróżnienie.

Zamiast zapamiętywać w osobnej zmiennej, która zakładka była aktywna wcześniej, stosuje się prosty, dwuetapowy wzorzec wewnątrz funkcji kliknięcia:

```javascript
const zakladki = document.querySelectorAll(".tab");

zakladki.forEach((zakladka) => {
  zakladka.addEventListener("click", () => {
    // Etap 1: zdejmij klasę active ze wszystkich zakładek
    zakladki.forEach((inna) => {
      inna.classList.remove("active");
    });

    // Etap 2: dodaj klasę active wyłącznie klikniętej zakładce
    zakladka.classList.add("active");
  });
});
```

Zwróć uwagę na bezpieczeństwo tego rozwiązania. Metoda `classList.remove("active")` nie zgłasza żadnego błędu, gdy dany element nie ma klasy `active` (po prostu go ignoruje). Dzięki temu po etapie 1 masz gwarancję czystego stanu na całej liście, a po etapie 2 aktywna jest dokładnie jedna zakładka.

<data-gate>
<data-connection-matcher title="Dopasuj fragment kodu do jego roli i momentu wykonania">
  <item left="`document.querySelectorAll('.tab')`" right="Pobiera kolekcję NodeList ze wszystkimi zakładkami na stronie"></item>
  <item left="Zewnętrzna funkcja w `forEach`" right="Uruchamia się raz przy starcie skryptu, aby podpiąć zdarzenia do każdego elementu"></item>
  <item left="Wewnętrzna funkcja w `addEventListener`" right="Czeka w pamięci i uruchamia się dopiero po kliknięciu konkretnego elementu"></item>
  <item left="`el.dataset.opis`" right="Odczytuje wartość tekstową z atrybutu HTML data-opis klikniętego elementu"></item>
  <item left="`tabs.forEach((t) => t.classList.remove('active'))`" right="Czyści stan zaznaczenia ze wszystkich zakładek przed podświetleniem nowej"></item>
  <item left="`Number(el.dataset.cena)`" right="Konwertuje tekst z atrybutu data-cena na liczbę gotową do sumowania"></item>
</data-connection-matcher>
</data-gate>

## 🧪 Ćwiczenie prowadzone: przełącznik zakładek i galeria opisów

Masz gotowy pasek 3 zakładek `.tab`. Każda zakładka niesie własny opis w atrybucie `data-opis`. Poniżej stoi akapit `#opis`.

Uzupełnij ciało funkcji kliknięcia tak, aby po kliknięciu dowolnej zakładki:
1. usunąć klasę `active` ze wszystkich zakładek `.tab` w pętli `forEach`,
2. dodać klasę `active` klikniętej zakładce,
3. wpisać jej opis (`tab.dataset.opis`) do elementu `#opis`.

<data-gate>
<data-code-runner language="javascript" sandbox="dom" title="Przełącznik zakładek z atrybutem data-opis">
<template data-type="html">
<style>
  .tabs-box { font-family: system-ui, sans-serif; padding: 14px; background: #0f172a; color: #f8fafc; border-radius: 10px; }
  .tabs-bar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .tab { padding: 8px 14px; background: #1e293b; color: #cbd5e1; border: 1px solid #334155; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
  .tab.active { background: #2563eb; color: #ffffff; border-color: #60a5fa; }
  #opis { margin: 0; padding: 12px; background: #1e293b; border-left: 4px solid #3b82f6; border-radius: 6px; font-size: 14px; line-height: 1.5; }
</style>
<div class="tabs-box">
  <div class="tabs-bar">
    <button class="tab active" type="button" data-opis="HTML definiuje strukturę dokumentu: nagłówki, akapity, przyciski i formularze.">HTML</button>
    <button class="tab" type="button" data-opis="CSS odpowiada za warstwę wizualną: układ, kolory, odstępy i animacje.">CSS</button>
    <button class="tab" type="button" data-opis="JavaScript steruje logiką, reaguje na zdarzenia użytkownika i modyfikuje drzewo DOM.">JavaScript</button>
  </div>
  <p id="opis">HTML definiuje strukturę dokumentu: nagłówki, akapity, przyciski i formularze.</p>
</div>
</template>
<template data-type="code">
const zakladki = document.querySelectorAll(".tab");
const opisEl = document.querySelector("#opis");

zakladki.forEach((tab) => {
  tab.addEventListener("click", () => {
    // 1. Zdejmij klasę "active" ze wszystkich elementów w kolekcji zakladki

    // 2. Dodaj klasę "active" klikniętemu elementowi tab

    // 3. Wstaw tab.dataset.opis do opisEl.textContent

  });
});
</template>
<template data-type="requirements">
[
  {
    "id": "qsa-tab",
    "text": "Pobiera kolekcję zakładek .tab przez querySelectorAll",
    "type": "regex",
    "pattern": "querySelectorAll\\s*\\(\\s*[\"']\\.tab[\"']\\s*\\)"
  },
  {
    "id": "click-listener",
    "text": "Rejestruje zdarzenie click na każdej zakładce",
    "type": "regex",
    "pattern": "addEventListener\\s*\\(\\s*[\"']click[\"']"
  },
  {
    "id": "remove-active",
    "text": "Czyści klasę active ze wszystkich zakładek metodą classList.remove",
    "type": "regex",
    "pattern": "classList\\.remove\\s*\\(\\s*[\"']active[\"']\\s*\\)"
  },
  {
    "id": "add-active",
    "text": "Dodaje klasę active klikniętej zakładce metodą classList.add",
    "type": "regex",
    "pattern": "classList\\.add\\s*\\(\\s*[\"']active[\"']\\s*\\)"
  },
  {
    "id": "read-dataset",
    "text": "Odczytuje opis z atrybutu data-opis poprzez dataset.opis",
    "type": "regex",
    "pattern": "dataset\\.opis"
  }
]
</template>
</data-code-runner>
</data-gate>

## 🏗️ Projekt końcowy modułu: interaktywny konfigurator kafelkowy

Zanim zaczniesz pisać kod, zapamiętaj dwa szczegóły przydatne w konfiguratorze:

- **Selektor bez spacji** `".kafelek.wybrany"` wybiera wyłącznie elementy, które mają **obie klasy jednocześnie** (ze spacją `".kafelek .wybrany"` szukałby potomka wewnątrz kafelka).
- **Wzorzec lokalnego akumulatora**: zmienną `let suma = 0;` deklaruj zawsze **wewnątrz funkcji przeliczającej**, aby każde kliknięcie zaczynało sumowanie od zera:

```javascript
let suma = 0;
wybrane.forEach((el) => {
  suma += Number(el.dataset.cena);
});
```

Czas połączyć wszystkie poznane techniki w pełny, działający komponent sklepowy. Na stronie stoją 4 kafelki `.kafelek` reprezentujące usługi dodatkowe. Każdy kafelek ma dwa atrybuty: `data-nazwa` oraz `data-cena`.

Twoje zadanie polega na zaprogramowaniu od zera kompletnej logiki konfiguratora:
1. Pobierz wszystkie kafelki `.kafelek`, pole `#podsumowanie` oraz przycisk `#btn-wyczysc`.
2. Podepnij do każdego kafelka (w pętli `forEach`) zdarzenie `click`, które:
   - przełączy klasę `wybrany` na klikniętym kafelku za pomocą `classList.toggle("wybrany")`,
   - pobierze wyłącznie aktualnie wybrane kafelki złożonym selektorem `document.querySelectorAll(".kafelek.wybrany")`,
   - zsumuje ich ceny w pętli `forEach`, pamiętając o rzutowaniu `Number(el.dataset.cena)`,
   - wypisze w `#podsumowanie` liczbę wybranych opcji (`.length`) oraz łączną kwotę w złotych.
3. Podepnij do przycisku `#btn-wyczysc` zdarzenie `click`, które w pętli `forEach` zdejmie klasę `wybrany` ze wszystkich kafelków i wyzeruje `#podsumowanie`.

> [!TIP]
> **Czysta architektura:** Przeliczanie sumy i aktualizację `#podsumowanie` możesz wydzielić do osobnej funkcji pomocniczej (na przykład `aktualizujPodsumowanie()`). Wywołasz ją zarówno po kliknięciu kafelka, jak i po kliknięciu przycisku „Wyczyść wybór”.

<data-gate>
<data-code-runner language="javascript" sandbox="dom" title="Projekt końcowy: Konfigurator kafelkowy">
<template data-type="html">
<style>
  .konf { font-family: system-ui, sans-serif; padding: 14px; background: #0f172a; color: #f8fafc; border-radius: 10px; }
  .konf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 10px; flex-wrap: wrap; }
  .konf-header h3 { margin: 0; font-size: 16px; color: #93c5fd; }
  #btn-wyczysc { padding: 6px 12px; background: #334155; color: #e2e8f0; border: 1px solid #475569; border-radius: 6px; cursor: pointer; font-size: 13px; }
  #btn-wyczysc:hover { background: #475569; }
  .kafelki-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
  .kafelek { padding: 12px; background: #1e293b; border: 2px solid #334155; border-radius: 8px; cursor: pointer; text-align: left; color: #f8fafc; transition: all 0.2s; }
  .kafelek .k-nazwa { display: block; font-weight: 700; font-size: 14px; margin-bottom: 4px; }
  .kafelek .k-cena { display: block; font-size: 13px; color: #94a3b8; }
  .kafelek.wybrany { background: #14532d; border-color: #22c55e; }
  .kafelek.wybrany .k-cena { color: #bbf7d0; font-weight: 600; }
  #podsumowanie { margin: 0; padding: 10px 12px; background: #1e293b; border-radius: 6px; font-weight: 700; color: #fcd34d; font-size: 14px; }
</style>
<div class="konf">
  <div class="konf-header">
    <h3>Konfigurator usług serwisowych</h3>
    <button id="btn-wyczysc" type="button">Wyczyść wybór</button>
  </div>
  <div class="kafelki-grid">
    <button class="kafelek" type="button" data-nazwa="Czyszczenie układu chłodzenia" data-cena="120">
      <span class="k-nazwa">Czyszczenie układu chłodzenia</span>
      <span class="k-cena">120 zł</span>
    </button>
    <button class="kafelek" type="button" data-nazwa="Wymiana pasty termoprzewodzącej" data-cena="80">
      <span class="k-nazwa">Wymiana pasty termoprzewodzącej</span>
      <span class="k-cena">80 zł</span>
    </button>
    <button class="kafelek" type="button" data-nazwa="Montaż dysku SSD NVMe" data-cena="150">
      <span class="k-nazwa">Montaż dysku SSD NVMe</span>
      <span class="k-cena">150 zł</span>
    </button>
    <button class="kafelek" type="button" data-nazwa="Kopia zapasowa danych" data-cena="95">
      <span class="k-nazwa">Kopia zapasowa danych</span>
      <span class="k-cena">95 zł</span>
    </button>
  </div>
  <p id="podsumowanie">Wybrano: 0 | Suma: 0 zł</p>
</div>
</template>
<template data-type="code">
// 1. Pobierz .kafelek (querySelectorAll), #podsumowanie oraz #btn-wyczysc

// 2. Napisz funkcję przeliczającą wszystkie .kafelek.wybrany (pętla forEach + Number(el.dataset.cena))
//    i aktualizującą #podsumowanie (.length oraz suma)

// 3. Dla każdego kafelka w pętli forEach podepnij kliknięcie z classList.toggle("wybrany")
//    i wywołaniem przeliczenia

// 4. Dla #btn-wyczysc zdejmij klasę "wybrany" ze wszystkich kafelków (classList.remove)
//    i zaktualizuj podsumowanie
</template>
<template data-type="requirements">
[
  {
    "id": "qsa-kafelki",
    "text": "Pobiera wszystkie kafelki .kafelek za pomocą querySelectorAll",
    "type": "regex",
    "pattern": "querySelectorAll\\s*\\(\\s*[\"']\\.kafelek[\"']\\s*\\)"
  },
  {
    "id": "foreach-arrow",
    "text": "Używa pętli forEach z funkcją strzałkową",
    "type": "regex",
    "pattern": "\\.forEach\\s*\\([^)]*=>"
  },
  {
    "id": "toggle-wybrany",
    "text": "Przełącza klasę wybrany za pomocą classList.toggle",
    "type": "regex",
    "pattern": "classList\\.toggle\\s*\\(\\s*[\"']wybrany[\"']\\s*\\)"
  },
  {
    "id": "qsa-wybrane",
    "text": "Pobiera wyłącznie zaznaczone kafelki selektorem .kafelek.wybrany",
    "type": "regex",
    "pattern": "querySelectorAll\\s*\\(\\s*[\"']\\.kafelek\\.wybrany[\"']\\s*\\)"
  },
  {
    "id": "dataset-cena",
    "text": "Odczytuje cenę kafelka przez dataset.cena",
    "type": "regex",
    "pattern": "dataset\\.cena"
  },
  {
    "id": "number-cast",
    "text": "Konwertuje cenę z tekstu na liczbę (Number / parseInt / parseFloat)",
    "type": "regex",
    "pattern": "(?:Number|parseInt|parseFloat)\\s*\\("
  },
  {
    "id": "btn-clear",
    "text": "Obsługuje przycisk #btn-wyczysc i zdejmuje klasę wybrany przez classList.remove",
    "type": "regex",
    "pattern": "classList\\.remove\\s*\\(\\s*[\"']wybrany[\"']\\s*\\)"
  },
  {
    "id": "length-count",
    "text": "Wyświetla liczbę wybranych kafelków z użyciem .length",
    "type": "contains",
    "pattern": ".length"
  }
]
</template>
</data-code-runner>
</data-gate>

<details class="deep-dive">
<summary>🔬 Dla dociekliwych: domknięcia w forEach, delegacja zdarzeń i bezpieczeństwo dataset</summary>

<h4>Dlaczego funkcja kliknięcia pamięta właściwy kafelek (domknięcie)</h4>
<p>Gdy pętla <code>forEach</code> kończy swoją pracę przy starcie strony, jej wywołania znikają ze stosu. Mimo to po pięciu minutach, gdy użytkownik kliknie trzeci kafelek, wewnętrzna funkcja strzałkowa dokładnie wie, czym jest zmienna <code>kafelek</code>. Dzieje się tak dzięki mechanizmowi <strong>domknięcia</strong> (closure).</p>
<p>Każda iteracja <code>forEach</code> tworzy osobny zakres lokalny z własną referencją do jednego kafelka. Funkcja przekazana do <code>addEventListener</code> „zamyka” ten zakres w pamięci, więc każdy z 4 przycisków przechowuje powiązanie dokładnie ze swoim węzłem DOM.</p>

<h4>Kiedy wystarczy forEach, a kiedy potrzebna jest delegacja zdarzeń</h4>
<p>Podpinanie osobnego <code>addEventListener</code> w pętli <code>forEach</code> jest wzorcem pierwszego wyboru dla stałych grup liczących od kilku do kilkudziesięciu elementów (zakładki, filtry, kafelki cennika). Kod jest prosty, czytelny i szybki.</p>
<p>W rozbudowanych aplikacjach, gdzie tabela ma 5000 wierszy albo nowe elementy są dopisywane dynamicznie w trakcie działania strony, stosuje się wzorzec zwany <strong>delegacją zdarzeń</strong>: jeden nasłuchiwacz wisi na wspólnym kontenerze rodzicielskim i sprawdza kliknięty cel za pomocą <code>event.target.closest(".kafelek")</code>.</p>

<h4>Bezpieczeństwo danych w atrybutach data-*</h4>
<p>Atrybuty <code>data-cena</code> w HTML są w pełni widoczne i edytowalne w narzędziach deweloperskich przeglądarki. Użytkownik może ręcznie zmienić <code>data-cena="150"</code> na <code>data-cena="1"</code> i zobaczyć na ekranie niższą kwotę. Dlatego w produkcyjnym sklepie JavaScript w przeglądarce odpowiada wyłącznie za wygodny podgląd dla klienta, a końcową cenę zamówienia zawsze wylicza i weryfikuje serwer na podstawie bazy danych.</p>

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wzorzec `elementy.forEach((el) => { el.addEventListener("click", () => { ... }); });` ma dwa różne czasy życia: **zewnętrzna funkcja** rejestruje słuchaczy raz przy starcie, a **wewnętrzna funkcja** uruchamia się dopiero po kliknięciu konkretnego elementu.
- Dane powiązane z elementem (opisy, ceny, identyfikatory) zapisuj w atrybutach `data-*` w HTML i odczytuj przez _**el.dataset**_. Pamiętaj, że wartości z *dataset* są zawsze tekstem, więc przed obliczeniami użyj `Number(...)`.
- Gdy aktywny może być tylko jeden element w grupie, zastosuj dwuetapowy wzorzec: najpierw zdejmij klasę `active` ze wszystkich w pętli `forEach`, a dopiero potem dodaj ją klikniętemu elementowi.
- Gdy użytkownik może zaznaczać wiele opcji naraz, użyj `classList.toggle(...)`, a następnie pobierz aktualny zbiór zaznaczonych złożonym selektorem (na przykład `.kafelek.wybrany`) i przelicz go w pętli `forEach`.

> [!TIP]
> Masz już kompletny fundament manipulacji DOM, zdarzeń, kolekcji i danych w atrybutach `data-*`. Sprawdź swoje umiejętności na większych projektach w [Katalogu zadań praktycznych](/arkusze/?qual=INF.03&tag=JS).
