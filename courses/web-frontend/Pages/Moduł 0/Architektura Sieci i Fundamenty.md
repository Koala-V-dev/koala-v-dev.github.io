# Architektura Sieci i Fundamenty Środowiska Pracy

Wpisujesz adres strony w pasku przeglądarki i naciskasz <kbd>Enter</kbd>. Po ułamku sekundy na ekranie pojawiają się nagłówki, przyciski i zdjęcia. Skąd komputer wie, do którego serwera na świecie wysłać zapytanie i jak z kilku kilobajtów zwykłego tekstu rysuje interaktywny interfejs?

Zanim napiszesz pierwszy znacznik HTML, musisz poznać środowisko, w którym Twój kod będzie działać. Tym środowiskiem jest **przeglądarka internetowa**. To ona pobiera surowe dane z sieci, analizuje ich strukturę i zamienia je w piksele na ekranie użytkownika.

---

## 🌐 Od adresu URL do odpowiedzi serwera

Każda strona, z której korzystasz, mieszka na zdalnym komputerze nazywanym **serwerem**. Część zasobów w sieci jest publiczna i dostępna dla robotów wyszukiwarek (blogi, sklepy, dokumentacje). Większość aplikacji biznesowych, nad którymi pracują programiści frontendu, działa jednak za ekranem logowania: są to skrzynki pocztowe, panele bankowe oraz systemy zarządzania firmą.

Niezależnie od tego, czy otwierasz otwarty artykuł, czy prywatny panel administracyjny, droga od wpisania adresu *URL* do pobrania strony przebiega według tego samego schematu.

### 🧭 Krok 1: Tłumaczenie nazwy przez DNS

Komputery w sieci nie rozpoznają ludzkich nazw domenowych takich jak `przyklad.pl`. Komunikują się wyłącznie za pomocą numerycznych adresów *IP* (na przykład `93.184.216.34`).

Gdy wciskasz <kbd>Enter</kbd>, przeglądarka odpytuje system _**DNS**_ (Domain Name System). Działa on jak globalna książka telefoniczna: zamienia wpisaną nazwę domeny na konkretny adres *IP* serwera docelowego.

### 📡 Krok 2: Żądanie HTTP i szyfrowanie

Mając adres *IP*, przeglądarka nawiązuje połączenie sieciowe z serwerem. W nowoczesnej sieci połączenie jest szyfrowane za pomocą protokołu **HTTPS**, co chroni przesyłane dane przed podsłuchem po drodze.

Następnie przeglądarka wysyła proste, tekstowe żądanie protokołu *HTTP* z prośbą o konkretny zasób:

```http
GET / HTTP/1.1
Host: przyklad.pl
Accept: text/html
```

- `GET /`: przeglądarka prosi o pobranie głównego dokumentu z serwera.
- `Host: przyklad.pl`: wskazuje dokładną domenę, ponieważ jeden serwer często obsługuje wiele stron naraz.
- `Accept: text/html`: informuje serwer, że klient oczekuje dokumentu HTML.

### 🚦 Krok 3: Kody statusu w odpowiedzi serwera

Serwer przetwarza żądanie i odsyła odpowiedź. Zawsze zaczyna się ona od trzycyfrowego **kodu statusu HTTP**, który natychmiast informuje, czy operacja się powiodła:

| Kod statusu | Nazwa komunikatu | Co wydarzyło się po stronie serwera |
| :--- | :--- | :--- |
| **`200`** | **OK** | Żądanie powiodło się, a serwer przesłał żądany dokument HTML. |
| *`301`* | *Moved Permanently* | Zasób został trwale przeniesiony pod inny adres URL i przeglądarka podąża za przekierowaniem. |
| **_`404`_** | **_Not Found_** | Pod wskazaną ścieżką nie ma żadnego pliku na serwerze (często błąd w adresie lub usunięta podstrona). |
| **_`500`_** | **_Internal Server Error_** | Po stronie kodu serwera wystąpiła krytyczna awaria uniemożliwiająca wygenerowanie odpowiedzi. |

<data-gate>
<data-connection-matcher title="Połącz element cyklu sieciowego lub kod HTTP z jego rzeczywistą rolą">
  <item left="System DNS" right="Tłumaczy nazwę domeny (np. przyklad.pl) na numeryczny adres IP serwera"></item>
  <item left="`200 OK`" right="Serwer odnalazł zasób i przesyła poprawną odpowiedź z kodem strony"></item>
  <item left="`301 Moved Permanently`" right="Trwałe przekierowanie przeglądarki pod nowy adres URL"></item>
  <item left="`404 Not Found`" right="Żądany plik lub ścieżka nie istnieje na serwerze"></item>
  <item left="`500 Internal Server Error`" right="Awaria wewnętrzna skryptu lub aplikacji po stronie serwera"></item>
</data-connection-matcher>
</data-gate>

---

## 📄 Płaski tekst, parser HTML i drzewo DOM

W odpowiedzi na kod `200 OK` serwer nie przesyła gotowego, skompilowanego programu (jak plik `.exe`). Zamiast tego przeglądarka otrzymuje jawny, **płaski tekst** z kodem HTML (HyperText Markup Language), a w kolejnych żądaniach arkusze stylów CSS (Cascading Style Sheets) i skrypty JavaScript (JS).

Ta decyzja projektowa twórcy sieci WWW, _**Tima Bernersa-Lee**_, opiera cały internet na trzech filarach:

| Filar | Problem do rozwiązania | Rola płaskiego tekstu |
| :--- | :--- | :--- |
| **Uniwersalność** | Strona musi działać na Windows, Linux, macOS, Android i iOS. | Serwer wysyła ten sam tekst HTML, a lokalna przeglądarka rysuje interfejs dopasowany do systemu i ekranu. |
| **Wyszukiwarki** (SEO, Search Engine Optimization) | Automaty indeksujące muszą zrozumieć temat i strukturę strony. | Roboty nie oglądają grafiki jak człowiek: skanują znaczniki tekstowe (np. `<h1>`, `<p>`) i oceniają hierarchię treści. |
| **Dostępność** (WCAG, Web Content Accessibility Guidelines) | Osoby z niepełnosprawnością wzroku lub ruchu muszą korzystać z treści. | Czytniki ekranu analizują znaczniki tekstowe i przekazują strukturę do syntezatora mowy lub linijki brajlowskiej. |

### 🌳 Jak parser buduje drzewo DOM

Sam tekst HTML nie potrafi wyświetlić się na ekranie. Gdy strumień bajtów dociera do przeglądarki, uruchamia się **parser HTML**. Jest to moduł, który czyta kod od góry do dołu, rozpoznaje znaczniki otwierające i zamykające, a następnie tworzy z nich żywą hierarchię obiektów w pamięci RAM.

Tę hierarchię obiektów nazywamy _**drzewem DOM**_ (Document Object Model). Każdy znacznik w pliku staje się w pamięci węzłem powiązanym z rodzicem i dziećmi. Dopiero na podstawie tego drzewa oraz stylów CSS silnik przeglądarki oblicza położenie elementów i rysuje gotowy obraz na monitorze.

### 🔮 Przewidywanie: co zrobi parser z niedomkniętym znacznikiem

Zanim przejdziesz dalej, zatrzymaj się na chwilę i przewidź zachowanie przeglądarki. Spójrz na poniższy, błędnie napisany fragment HTML, w którym autor zapomniał zamknąć pierwszy znacznik `<p>`:

```html
<p>Pierwszy akapit opisu.
<h2>Sekcja druga</h2>
<p>Kolejny akapit.</p>
```

> [!IMPORTANT]
> Zdecyduj przed czytaniem dalej: co zrobi przeglądarka z tym kodem? Czy zatrzyma ładowanie i wyświetli komunikat błędu składni, czy włoży nagłówek `<h2>` do wnętrza akapitu `<p>`, czy automatycznie zamknie `<p>` tuż przed `<h2>`?

### 🔎 Obserwacja i wyjaśnienie

Przeglądarka nie zatrzyma ładowania strony i nie wyświetli komunikatu błędu. Parser _**HTML5**_ jest celowo zaprojektowany jako tolerancyjny: gdy napotyka blokowy nagłówek `<h2>` wewnątrz otwartego akapitu `<p>`, automatycznie domyka pierwszy akapit tuż przed nagłówkiem.

W pamięci RAM powstaje więc poprawna struktura trzech sąsiadujących węzłów:

```html
<p>Pierwszy akapit opisu.</p>
<h2>Sekcja druga</h2>
<p>Kolejny akapit.</p>
```

Takie zachowanie chroni użytkowników przed pustym ekranem przy drobnej literówce. Z perspektywy programisty kryje się tu jednak poważne ryzyko diagnostyczne: **_brak komunikatu błędu_** nie oznacza, że kod HTML jest poprawny.

Przy bardziej złożonych pomyłkach (na przykład nieprawidłowo zagnieżdżonych listach lub tabelach) parser potrafi przenieść elementy w zupełnie inne miejsce drzewa DOM, niż spodziewa się autor. Wtedy style CSS lub skrypty JavaScript przestają działać, mimo że „na pierwszy rzut oka” kod wygląda dobrze.

<data-gate>
  <data-sortable-list title="Ułóż etapy pełnego cyklu od wpisania adresu URL do pojawienia się strony na ekranie">
    <item data-correct="4">Parser HTML czyta otrzymany tekst i buduje drzewo obiektów DOM w pamięci RAM</item>
    <item data-correct="2">System DNS tłumaczy nazwę domeny na numeryczny adres IP serwera docelowego</item>
    <item data-correct="1">Użytkownik wpisuje adres URL w pasku przeglądarki i naciska Enter</item>
    <item data-correct="5">Silnik przeglądarki łączy strukturę DOM ze stylami i rysuje piksele na ekranie</item>
    <item data-correct="3">Przeglądarka nawiązuje połączenie HTTPS, wysyła żądanie HTTP GET i odbiera kod 200 OK z treścią HTML</item>
  </data-sortable-list>
</data-gate>

---

## 🔍 Pierwsze kroki w DevTools: podgląd żywego DOM

Skoro parser potrafi samoczynnie modyfikować strukturę błędnego kodu, potrzebujesz narzędzia, które pokaże Ci prawdę o tym, co rzeczywiście istnieje w pamięci przeglądarki. Służą do tego **Narzędzia deweloperskie** (DevTools), wbudowane w każdą nowoczesną przeglądarkę.

Warto rozróżnić dwa zupełnie inne podglądy kodu strony:

- **Wyświetl źródło strony** (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>U</kbd></span>): pokazuje surowy plik tekstowy dokładnie w takiej postaci, w jakiej przyszedł z serwera.
- **Zakładka Elements w DevTools** (<kbd>F12</kbd>): pokazuje żywe **drzewo DOM** zbudowane przez parser po wszystkich automatycznych naprawach i zmianach wykonanych przez skrypty.

Wykonaj teraz krótką inspekcję na tej stronie, aby oswoić się z podstawowym warsztatem diagnostycznym:

1. Naciśnij klawisz <kbd>F12</kbd> (lub kliknij prawym przyciskiem myszy dowolny nagłówek i wybierz <kbd class="win-menu-btn">Zbadaj</kbd>).
2. Otwórz zakładkę *Elements* (w Firefoksie nazywa się *Inspektor*). Rozwijaj małe strzałki przy znacznikach, aby zobaczyć hierarchię rodziców i dzieci w drzewie DOM.
3. Włącz narzędzie wyboru elementu skrótem <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></span> i najedź kursorem na dowolny akapit. Przeglądarka podświetli odpowiadający mu węzeł w drzewie.
4. Przełącz się na zakładkę *Network* (Sieć) i odśwież stronę klawiszem <kbd>F5</kbd>. W kolumnie *Status* zobaczysz prawdziwe kody odpowiedzi HTTP (`200`, `304`), o których czytałeś na początku lekcji.

![Inspektor devTools Firefox](/public/courses/web-frontend/Images/inspektor-firefox.png)

> [!TIP]
> Gdy układ strony zachowuje się inaczej, niż zakładał Twój plik HTML, zawsze sprawdzaj zakładkę *Elements* w DevTools. Tam natychmiast zobaczysz, czy parser nie zamknął lub nie przestawił znacznika w innym miejscu.

---

## ⚙️ Trójpodział władzy: silniki renderujące

Przeglądarki różnią się wyglądem paska kart i dodatkowymi funkcjami, ale pod spodem za parsowanie kodu i rysowanie pikseli odpowiada **silnik renderujący**. Rynek opiera się na trzech głównych silnikach:

| Silnik renderujący | Główne przeglądarki | Charakterystyka z perspektywy programisty |
| :--- | :--- | :--- |
| **Blink** | Google Chrome, Edge, Opera, Brave, Vivaldi | Rozwijany w projekcie Chromium. Dominuje na rynku i najszybciej wdraża nowe propozycje standardów. |
| **Gecko** | Firefox, Tor Browser | Niezależny, otwarty silnik Mozilli. Zapewnia różnorodność technologiczną sieci i chroni przed monopolem jednego silnika. |
| **WebKit** | Safari (macOS, iOS) | Silnik firmy Apple. Na systemie iOS stanowi fundament dla przeglądarek mobilnych i czasem wdraża nowości w innym tempie niż Blink. |

> [!TIP]
> Zanim użyjesz nowoczesnej funkcji HTML lub CSS w projekcie produkcyjnym, sprawdź jej wsparcie w bazie _**Can I Use**_ (`https://caniuse.com/`). Wpisanie nazwy technologii pokaże czytelną tabelę zgodności dla wszystkich trzech silników.

---

## 🖥️ Środowisko pracy: Visual Studio Code

Plik HTML jest zwykłym dokumentem tekstowym, więc teoretycznie da się go napisać nawet w systemowym Notatniku. W praktyce brak kolorowania składni i podpowiedzi bardzo szybko kończy się zgubionym cudzysłowem albo niedomkniętym znacznikiem, którego szukanie w czarnym tekście zajmuje długie minuty.

Standardowym edytorem w branży jest darmowy program **Visual Studio Code** ([VS Code](https://code.visualstudio.com/download)). Zainstaluj wersję dopasowaną do swojego systemu operacyjnego.

![Przedstawienie możliwych formatów i platform dla VS Code](/public/courses/web-frontend/Images/VSCode-dla-wszystkich-platform.png)

Podczas instalacji na systemie Windows zaznacz opcje dodania programu do menu kontekstowego oraz ścieżki systemowej *PATH*:

![Przedstawienie opcji instalacji VS Code](/public/courses/web-frontend/Images/VSCode-instalator.png)

Dzięki temu otworzysz dowolny folder z projektem w sekundę: z terminala poleceniem `code .` albo prawym przyciskiem myszy przez opcję <kbd class="win-menu-btn">Open with Code</kbd>.

![Przedstawienie menu kontekstowego VS Code](/public/courses/web-frontend/Images/VSCode-w-menu-kontekstowym-windows11.png)

Na koniec doinstaluj rozszerzenie *Live Preview* od firmy Microsoft (ikona klocków po lewej stronie edytora). W ustawieniach dodatku przełącz odświeżanie podglądu na aktualizację po zapisie pliku.

Taka konfiguracja daje podwójną korzyść: widzisz wynik swojej pracy obok kodu bez ciągłego przełączania okien, a jednocześnie wyrabiasz solidny nawyk zapisywania zmian skrótem <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>.

![Przedstawienie dodatku Live Preview](/public/courses/web-frontend/Images/VSCode-Live-Preview-Microsoft-settings.png)

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Dlaczego przeglądarka nie czeka na cały plik (strumień 14 KB, stos parsera i koszt przebudowy drzewa)</span>
<span class="deep-dive-badge">TCP IW10 · STREAMING PARSER · RENDER PIPELINE</span>
</summary>
<div class="deep-dive-content">

<h4>1. Mit „najpierw pobieram cały plik, potem go wyświetlam”</h4>

Większość początkujących wyobraża sobie ładowanie strony jak pobieranie pliku `.zip`: najpierw musi przyjść 100% danych, a dopiero potem przeglądarka zaczyna pracę. W rzeczywistości silnik przeglądarki działa **strumieniowo** i zaczyna budować drzewo DOM w chwili, gdy z gniazda sieciowego spłynie pierwszy pakiet bajtów.

W protokole TCP nowe połączenie nie wysyła od razu całego dokumentu naraz, lecz zaczyna od tzw. **początkowego okna przeciążenia** (*Initial Congestion Window*, standardowo `IW10` = 10 segmentów po ~1460 bajtów, czyli **około 14 KB** po kompresji). Jeśli nagłówek `<head>` i krytyczna góra Twojej strony zmieszczą się w pierwszych 14 KB odpowiedzi, przeglądarka dostanie je w **jednym obiegu sieciowym** (1 RTT) i zacznie rysować stronę, zanim serwer zdąży w ogóle wysłać resztę pliku. Każdy nadmiarowy kilobajt wrzucony bezmyślnie na początek dokumentu wypycha właściwą treść do kolejnego obiegu sieci.

<h4>2. Dlaczego jeden błąd w 5. linii zmienia strukturę w 200. linii (Stos Otwartych Elementów)</h4>

Parser HTML5 nie „przelatuje wzrokiem” całego pliku naraz. Czyta strumień bajtów od początku do końca i utrzymuje w pamięci RAM **stos otwartych elementów** (*Stack of Open Elements*). Każdy otwierający znacznik odkłada nowy węzeł na wierzchołek stosu, a zamykający zdejmuje go ze stosu.

To zmienia sposób myślenia o błędach w HTML:
- Jeśli zapomnisz zamknąć `<div>` w 5. linii, element pozostaje na stosie aż do końca dokumentu. Wszystkie kolejne sekcje strony (nawet 200 linii niżej) zostają w pamięci RAM podpięte jako **dzieci tego niedomkniętego kontenera**, mimo że w edytorze wyglądają na osobne bloki.
- Jeśli natomiast wstawisz blokowy `<h2>` wewnątrz otwartego `<p>`, reguła specyfikacji **WHATWG §13.2.6.4.7** wymusza natychmiastowe zdjęcie `<p>` ze stosu przed wstawieniem `<h2>`.

Dlatego **źródło strony (<span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>U</kbd></span>) to tylko Twoje intencje**, a dopiero zakładka *Elements* w DevTools pokazuje rzeczywisty wynik pracy tego stosu w pamięci RAM.

<h4>3. Co zatrzymuje budowanie strony: Render-Blocking CSS kontra Parser-Blocking JS</h4>

Kiedy strumień bajtów płynie do parsera, dwa rodzaje zasobów potrafią całkowicie zatrzymać potok:

- **Arkusz CSS blokuje renderowanie (Render-Blocking):** parser buduje DOM dalej, ale silnik wstrzymuje narysowanie pikseli na ekranie do czasu zbudowania pełnego drzewa reguł **CSSOM**. Powód jest prosty: ostatnia linijka pliku `.css` może zmienić rozmiar i kolor każdego elementu z początku strony, więc rysowanie przed przeczytaniem całego CSS wywołałoby gwałtowne przeskoki obrazu.
- **Zwykły `<script>` blokuje sam parser (Parser-Blocking):** gdy parser trafia na synchroniczny skrypt, musi **zatrzymać czytanie HTML**, pobrać kod JS i go wykonać, ponieważ skrypt może w locie dopisać lub usunąć węzły DOM. Aby nie marnować czasu sieci podczas takiego przestoju, przeglądarki uruchamiają w tle drugi, lekki wątek (**Preload Scanner**), który wybiega w przód po surowym strumieniu bajtów i z wyprzedzeniem zleca pobieranie obrazów oraz stylów znalezionych dalej w pliku.

<h4>4. Dlaczego jedna zmiana w CSS kosztuje 16 ms, a inna ułamek milisekundy</h4>

Gotowe drzewa DOM i CSSOM łączą się w **Render Tree**, po czym silnik wykonuje kolejno trzy etapy: **Layout** (obliczenie współrzędnych i wymiarów każdego pudełka w pikselach), **Paint** (namalowanie kolorów, tekstu i cieni na warstwach) oraz **Composite** (złożenie gotowych warstw na karcie graficznej GPU).

Zmiana właściwości wpływającej na geometrię (na przykład `width`, `height`, `font-size`) wymusza przeliczenie **Layoutu** dla całej kaskady sąsiednich elementów (*Reflow*) i ponowne malowanie (*Repaint*). Natomiast zmiana właściwości obsługiwanych bezpośrednio przez kompozytor GPU (takich jak `transform` czy `opacity`) omija całkowicie etapy Layout i Paint. Właśnie ta różnica architektoniczna decyduje o tym, czy animacja na stronie działa płynnie w 60 do 144 klatkach na sekundę, czy zacina się na słabszym telefonie.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Cykl sieciowy**: DNS zamienia domenę na adres IP, przeglądarka wysyła żądanie HTTP, a serwer odpowiada kodem statusu (`200` sukces, `301` przekierowanie, **_`404`_** brak pliku, **_`500`_** błąd serwera).
- **Źródło a drzewo DOM**: serwer wysyła płaski tekst HTML, ale przeglądarka wyświetla żywe drzewo obiektów zbudowane przez parser.
- **Tolerancyjny parser**: brak komunikatu błędu nie gwarantuje poprawności kodu, bo przeglądarka mogła sama przestawić niedomknięte znaczniki.
- **Diagnostyka w DevTools**: gdy układ strony zachowuje się nieoczekiwanie, otwórz <kbd>F12</kbd> i porównaj zakładkę *Elements* (żywy DOM) oraz *Network* (kody HTTP) ze swoim kodem.
- **Silniki i edytor**: sprawdzaj wsparcie technologii dla `Blink`, `Gecko` i `WebKit` na *Can I Use*, a codzienny kod pisz w `VS Code` z wtyczką *Live Preview*.
