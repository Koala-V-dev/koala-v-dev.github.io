# Rejestr źródeł kursu

Data kontroli: 2026-07-26

| Zakres | Twierdzenie kontrolowane | Źródło pierwotne | Zastosowanie |
| --- | --- | --- | --- |
| Event Loop | zadania, punkty kontrolne mikrozadań i możliwości renderowania nie tworzą prostego, stałego cyklu trzech faz | [HTML Living Standard, Event loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops) | Moduł 0, lekcja 1 |
| Animation frames | callbacki `requestAnimationFrame` są uruchamiane w procesie aktualizacji renderowania | [HTML Living Standard, Animation frames](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames) | Moduł 2, lekcja 3 |
| Fetch | odpowiedź HTTP i błąd sieciowy są odrębnymi wynikami przetwarzania | [Fetch Standard](https://fetch.spec.whatwg.org/) | Moduł 0, lekcja 3 |
| Reducer | czysty reducer wyprowadza wynik z argumentów, nie mutuje stanu i nie wykonuje efektów | [Redux Fundamentals, Rules of Reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#rules-of-reducers) | Moduł 1, lekcja 1 |
| Proxy i Reflect | Proxy przechwytuje określone metody wewnętrzne obiektu i musi zachować ich niezmienniki | [ECMAScript Language Specification, Proxy Objects](https://tc39.es/ecma262/multipage/reflection.html#sec-proxy-objects) | Moduł 1, lekcja 2 |
| Idempotencja HTTP | proponowany nagłówek może wspierać odporne ponawianie `POST` i `PATCH`, lecz dokument pozostaje Internet-Draft | [IETF HTTPAPI, Idempotency-Key draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/) | Moduł 1, lekcja 3 |
| Dostępność | obowiązującą rekomendacją jest WCAG 2.2 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Moduły 0 i 3 |
| Disclosure | kontrolka rozwijająca używa przycisku i aktualizuje `aria-expanded` | [WAI-ARIA APG, Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) | Moduł 0, lekcja 2 |
| Dialog | modal utrzymuje fokus wewnątrz, obsługuje Escape i przywraca logiczny fokus | [WAI-ARIA APG, Dialog Modal Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Moduł 3, lekcja 1 |
| Natywny dialog | `showModal()` umieszcza dialog w top layer i czyni tło inertnym | [W3C Technique H102](https://www.w3.org/WAI/WCAG22/Techniques/html/H102.html) | Moduł 3, lekcja 1 |
| Custom Elements | prawidłowa nazwa ma więcej ograniczeń niż sam myślnik | [HTML Living Standard, Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) | Moduł 3, lekcja 3 |
| Vite | aktualne polecenie startowe i wymagania Node.js | [Vite, Getting Started](https://vite.dev/guide/) | Moduł 2, lekcja 1 |
| npm | dokładne drzewo instalacji zapisuje lockfile | [npm, package-lock.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/) | Moduł 2, lekcja 1 |
| npm | `npm ci` wymaga zgodnego lockfile i nie aktualizuje go | [npm, npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/) | Moduł 2, lekcja 1 |
| Pomiar DOM | `getBoundingClientRect()` wyznacza prostokąt elementu zgodnie z algorytmem CSSOM View | [CSSOM View Module](https://www.w3.org/TR/cssom-view-1/#dom-element-getboundingclientrect) | Moduł 2, lekcja 2 |
| Ograniczony ruch | `reduce` oznacza prośbę o ograniczenie nieistotnego ruchu | [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion) | Moduł 2, lekcja 3 |
| Przyczyna błędu | konstruktor `Error` może zachować pierwotną przyczynę przez opcję `cause` | [ECMAScript Language Specification, InstallErrorCause](https://tc39.es/ecma262/multipage/fundamental-objects.html#sec-installerrorcause) | Moduł 3, lekcja 2 |

Każda informacja zależna od wersji wymaga ponownej kontroli przed zmianą statusu kursu na `published`.
