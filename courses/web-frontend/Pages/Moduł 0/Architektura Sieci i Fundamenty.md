# Architektura Sieci i Fundamenty Środowiska Pracy

Praca we frontendzie wymaga poznania specyfiki środowiska uruchomieniowego. Aplikacje webowe w wielu obszarach zastępują tradycyjne oprogramowanie desktopowe. Zanim napiszesz pierwszy znacznik, musisz zrozumieć architekturę środowiska działania kodu.

Twoim głównym środowiskiem uruchomieniowym jest **przeglądarka internetowa**. <strong>To ona odbiera dane z serwera, interpretuje je i renderuje piksele na ekranie użytkownika</strong>.

---

## 🌐 Trzy Warstwy Przepływu Informacji

Zrozumienie sieci wymaga spojrzenia na nią z perspektywy inżyniera. Internet dzieli się na warstwy różniące się dostępnością oraz sposobem indeksowania danych.

### 🔍 1. Surface Web (Widzialna sieć)
To publicznie dostępna warstwa sieci. Zalicza się do niej każda strona, którą mogą znaleźć i zaindeksować automatyczne roboty wyszukiwarek (np. Googlebot).
Do tej warstwy należą:
- Publiczne portale informacyjne i blogi.
- Otwarte profile w mediach społecznościowych.
- Ogólnodostępne oferty sklepów internetowych.

Surface Web stanowi zaledwie kilka procent danych w internecie.

Zarówno Surface Web, jak i Deep Web składają się na *clearnet*. To po prostu zwykły, standardowy internet, z którego korzystasz na co dzień bez specjalnych programów szyfrujących.

### 🔒 2. Deep Web (Głęboka sieć)
To zasoby sieciowe <strong>niedostępne dla robotów indeksujących</strong>. Dostęp do nich wymaga autoryzacji. W tej warstwie dane przesyła się standardowymi protokołami, lecz nie są one publicznie widoczne.
Do Deep Webu zaliczamy:
- Skrzynki e-mail oraz panele bankowości internetowej.
- Medyczne systemy informatyczne i bazy danych pacjentów.
- Wewnętrzne systemy zarządzania treścią (<abbr title="Content Management System">CMS</abbr>).
- Prywatne repozytoria kodu, konta społecznościowe i konta dostępowe do usług online np.: Netflix.

W kontekście architektury sieci, warto rozróżnić pojęcia:
- **Inter***net*: Ogólnodostępna sieć łącząca Surface Web i autoryzowane portale.
- **Intra***net*: Prywatna sieć wewnątrz jednej organizacji, całkowicie zamknięta dla osób z zewnątrz.
- **Extra***net*: Wydzielona część sieci prywatnej udostępniona zewnętrznym partnerom lub klientom.

Dla programistów frontendu Deep Web to główne środowisko pracy. Tworząc aplikacje biznesowe typu **SaaS** (*Software as a Service*), projektuje się interfejsy obsługujące właśnie te zabezpieczone zasoby.

### 🛡️ 3. Dark Web (Ciemna sieć)
To wydzielona i celowo zaszyfrowana część internetu. <strong>Dostęp do niej wymaga specjalnego oprogramowania</strong> (np. przeglądarki _**<abbr title="The Onion Router">Tor</abbr>**_). Komunikacja opiera się na trasowaniu cebulowym, które szyfruje dane i przesyła je przez losowe węzły w celu ukrycia tożsamości użytkowników.

Projekt ten powstał w latach $90.$ w amerykańskim laboratorium _**U.S. Naval Research Laboratory**_ do zabezpieczania komunikacji wojskowej i wywiadowczej. Aby system działał skutecznie, musiał być otwarty dla każdego. Duża liczba zwykłych użytkowników tworzy tak zwany *„szum informacyjny”*, w którym ukrywają się pakiety rządowe.

Całkowita anonimowość przyciąga jednak przestępczość. W Dark Webie działają czarne rynki oferujące broń, nielegalne substancje i zabronione treści. Można tam znaleźć zlecenia dla cyberprzestępców (tzw. „czarnych kapeluszy”) czy płatnych zabójców. Z szyfrowanych kanałów korzystają kartele, mafie oraz grupy zajmujące się handlem ludźmi i organami.

Jednocześnie ta sama technologia stanowi ważne narzędzie w walce o wolność słowa, prawo do prywatności i demokrację. Do pozytywnych zastosowań należą:
- **Bypass cenzury**: Podczas protestów w Iranie w <time datetime="2022">2022</time> roku obywatele omijali blokady dzięki mostkom Tor i technologii _**Snowflake**_ maskującej ruch użytkownika jako zwykłe połączenie wideo.
- **Dostęp do informacji**: Aby dotrzeć do odbiorców w zablokowanych regionach (np. w Chinach czy Rosji), oficjalne lustrzane strony `.onion` uruchomiły m.in. *BBC* (w <time datetime="2019">2019</time> roku) oraz *The New York Times* (w <time datetime="2017">2017</time> roku).
- **Bezpieczeństwo sygnalistów**: Redakcje śledcze (np. *The Guardian*, *The Washington Post*) wdrożyły system _**SecureDrop**_ działający w sieci Tor. Umożliwia on bezpieczne zgłaszanie korupcji i nadużyć.
- **Ochrona przed inwigilacją**: Aktywiści Amnesty International używają bezpiecznego systemu operacyjnego **Tails <abbr title="Operating System">OS</abbr>** (w pełni kierującego ruch przez Tor) do dokumentowania zbrodni wojennych bez ryzyka namierzenia ich lokalizacji.
- **Omijanie blokad społecznościowych**: Facebook uruchomił oficjalną wersję `.onion` w <time datetime="2014">2014</time> roku. Pomaga ona utrzymać kontakt z bliskimi mieszkańcom krajów blokujących media społecznościowe (np. Chin czy Iranu).
- **Bezpieczna poczta**: Dostawca szyfrowanej poczty Proton (dawniej ProtonMail) wdrożył wersję `.onion` w <time datetime="2017">2017</time> roku. Chroni to korespondencję opozycji przed przejęciem przez lokalne służby bezpieczeństwa.
- **Prywatne wyszukiwanie**: Wyszukiwarka DuckDuckGo posiada oficjalny adres w sieci Tor. Umożliwia to wyszukiwanie haseł bez profilowania reklamowego i gromadzenia historii zapytań.
- **Niezależne finansowanie**: Organizacje pozarządowe i charytatywne w państwach autorytarnych używają płatności kryptowalutowych przez sieć Tor, gdy rządy blokują ich tradycyjne konta bankowe.
- **Dostęp do edukacji**: Cyfrowa biblioteka _**Sci-Hub**_ działa zarówno w zwykłym internecie, jak i w sieci Tor. Jej mirror `.onion` zapewnia stabilny i trudny do zablokowania dostęp do publikacji naukowych w krajach z cenzurą lub blokadami <abbr title="Domain Name System">DNS</abbr>. Projekt wyrósł z idei, że wiedza naukowa, tworzona przez badaczy i finansowana ze środków publicznych, nie powinna być traktowana jak luksusowy towar dostępny wyłącznie dla instytucji, które stać na kosztowne subskrypcje.


<details>
<summary>Przykład wykorzystania Sci-Huba</summary>

Wyszukując prace i artykuły naukowe np. przez Google Scholar możesz natrafić na **_paywall_**: strona posiadająca dokument zażąda od ciebie jednorazowej opłaty albo wymusi wykupienie drogiej subskrypcji.

Przykładowo ten artykuł o wypalaniu normal map kosztuje <span itemprop="price" content="37.37">37,37 €</span><span itemprop="priceCurrency" content="EUR"></span> w ramach miesięcznej subskrypcji:
[A measure-driven method for normal mapping and normal map design of 3D models](https://link.springer.com/article/10.1007/s11042-018-6207-y)

Jeżeli potrzebujesz poznać jego treść, kopiujesz link URL strony i wklejasz go w wyszukiwarkę *Sci-Hub*, która załaduje i wyświetli go bez opłat.

</details>

<data-gate>
  <data-quiz>
    <question>Do której warstwy sieci zaliczamy Twoją skrzynkę e-mail oraz konto bankowe?</question>
    <options>
      <option>Surface Web, ponieważ korzystamy z nich za pomocą zwykłej przeglądarki bez specjalnego szyfrowania.</option>
      <option correct>Deep Web, ponieważ dostęp do nich wymaga logowania (autoryzacji) i nie są one widoczne dla wyszukiwarek.</option>
      <option>Dark Web, ponieważ dane te są ukryte przed światem zewnętrznym i chronione hasłem.</option>
    </options>
    <div data-hint="error">Nie do końca. Spróbuj jeszcze raz! Pamiętaj, że kluczowy jest sposób dostępu i indeksowania.</div>
    <div data-hint="success">Dokładnie! Zwykłe logowanie to domena Deep Webu, a nie Dark Webu. 🚀</div>
  </data-quiz>
</data-gate>



## 🔓 Walka o Wolny Dostęp do Wiedzy

Współczesna nauka stoi na paradoksie: badacze tworzą publikacje za publiczne pieniądze, nie otrzymują wynagrodzenia za ich wydanie, a mimo to dostęp do wyników ich pracy jest sprzedawany przez komercyjnych wydawców za setki euro miesięcznie. Dla wielu studentów, nauczycieli, lekarzy czy młodych naukowców jest to bariera nie do pokonania.

Ten system od lat krytykują osoby, które stały się symbolami walki o wolny dostęp do wiedzy:

- **Aaron Swartz**: aktywista, który uważał, że *„wiedza to dziedzictwo ludzkości”*. Jego sprzeciw wobec paywalli doprowadził do procesu, który zniszczył mu życie. W styczniu <time datetime="2013-01">2013</time> roku **_popełnił samobójstwo_** pod presją wieloletniego postępowania i groźby absurdalnie wysokiej kary. Stał się symbolem tego, jak brutalnie potrafi działać system broniący komercyjnych interesów.
- **Alexandra Elbakyan**: twórczyni Sci-Huba, która otwarcie sprzeciwiła się modelowi sprzedaży wiedzy. Jej projekt jest blokowany w wielu krajach, a ona sama jest ścigana prawnie przez największe wydawnictwa naukowe.
- **Cory Doctorow**: pisarz i działacz, który od lat walczy z nadużyciami praw autorskich i z praktykami ograniczającymi dostęp do kultury i nauki.
- **Lawrence Lessig**: prawnik, który stworzył licencje _**Creative Commons**_ i poświęcił życie walce o wolność informacji.

Ci ludzie nie walczyli o „piractwo”. <strong>Walczyli o to, by wiedza, jako fundament rozwoju cywilizacyjnego, była dostępna dla wszystkich</strong>, a nie tylko dla tych, których stać na zapłacenie za dostęp.

> Bo geniusze rodzą się wszędzie: w bogatych krajach i w biednych, w wielkich miastach i w małych miejscowościach, w rodzinach zamożnych i w takich, które ledwo wiążą koniec z końcem. Odbierając im dostęp do wiedzy, ryzykujemy, że utracimy ludzi, którzy mogliby przeskoczyć aktualny konsensus naukowy i popchnąć cywilizację naprzód.
> 
> Dlatego alternatywne kanały, takie jak sieć Tor, są wykorzystywane nie po to, by ukrywać nielegalne treści, lecz po to, by chronić dostęp do wiedzy tam, gdzie jest ona blokowana, cenzurowana lub sprzedawana jak luksusowy produkt.
> 
> Bo jeśli pozwolimy, by wiedza stała się towarem, to zgodzimy się na świat, w którym przyszłość zależy od zasobności portfela, a nie od potencjału ludzkiego umysłu.
> 
> A cywilizacja, która odbiera ludziom możliwość uczenia się, sama odbiera sobie szansę na jutro.
> 
> A internet nie powstał po to, by sprzedawać reklamy. Powstał po to, by uwolnić wiedzę. 
> 
> A każdy znacznik, którego Ty się nauczysz, i każda reguła dostępności, którą Ty wdrożysz, jest cegłą w budowaniu świata, w którym wiedza jest otwarta dla każdego. Świata, w którym dostęp do informacji nie zależy od sprawności fizycznej, ograniczeń zdrowotnych ani barier technicznych.

---

## 📄 Architektura Płaskiego Tekstu

Choć sam internet powstał jako wojskowy projekt <abbr title="Advanced Research Projects Agency Network">ARPANET</abbr>, to sieć *World Wide Web* (WWW), stworzona przez **Tima Berners-Lee** w <abbr title="Europejska Organizacja Badań Jądrowych">CERN</abbr>, od samego początku opierała się na idei otwartej wymiany wiedzy. Twórcy WWW zdecydowali, że strony nie będą skompilowanymi aplikacjami (jak pliki `.exe`), lecz otwartym tekstem. 

Dzięki temu każdy użytkownik na świecie może kliknąć prawym przyciskiem myszy na dowolną stronę, wybrać <kbd class="win-menu-btn">Wyświetl źródło strony</kbd> i sprawdzić, jak została zbudowana. Kod nie jest ukryty, lecz w pełni jawny i dostępny dla każdego.

Zasada jest prosta: wpisujesz adres strony w przeglądarce, wysyła ona żądanie do serwera (zazwyczaj przez bezpieczny protokół <abbr title="Hypertext Transfer Protocol Secure">`HTTPS`</abbr>). W odpowiedzi serwer nie przesyła jednak gotowej, skompilowanej aplikacji w pliku binarnym. Zamiast tego otrzymujesz zwykłe pliki tekstowe z kodem <abbr title="HyperText Markup Language">HTML</abbr>, <abbr title="Cascading Style Sheets">CSS</abbr> i <abbr title="JavaScript">JS</abbr>.

Dzięki temu internet może działać dziś na tych trzech filarach:

| Filar                                                                                    | Cel i znaczenie                                                                                                | Rola płaskiego tekstu                                                                                                                                 |
| :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Uniwersalność** (Cross-platform)                                                       | Strona musi działać na każdym urządzeniu (Windows, Linux, macOS, Android, iOS).                                | Serwer wysyła surowy tekst, a lokalna przeglądarka sama analizuje kod i rysuje interfejs dopasowany do ekranu urządzenia.                             |
| **Wyszukiwarki** (Skuteczność <abbr title="Search Engine Optimization">SEO</abbr>)       | Roboty indeksujące (np. Googlebot) muszą analizować treść strony, aby pozycjonować ją w wynikach wyszukiwania. | Boty nie mają oczu ani zasobów na renderowanie grafiki. Skanują strukturę tagów tekstowych (np. `<h1>`, `<p>`) i na tej podstawie oceniają zawartość. |
| **Dostępność** (Standard <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>) | Osoby z niepełnosprawnościami wzroku lub ruchu muszą mieć pełny dostęp do treści i funkcji stron.              | Oprogramowanie asystujące (np. czytniki ekranu) parsuje tagi tekstowe, przekazując strukturę do syntezatora mowy lub monitora brajlowskiego.          |

> [!NOTE]
> **Parsowanie** (analiza składniowa) to ogólny proces w programowaniu. Polega na pobraniu surowych danych (najczęściej tekstu) i przetłumaczeniu ich na format zrozumiały dla komputera.
> - Stosowany powszechnie do zamiany tekstu `"123"` na liczbę `123` lub formatu <abbr title="JavaScript Object Notation">`JSON`</abbr> na obiekt lub tablicę asocjacyjną.
> - W kontekście przeglądarek **parser** to moduł, który analizuje kod `HTML` i `CSS`, aby zbudować z niego logiczną mapę obiektów strony.

---

## 🏛️ Ewolucja Semantyki: Od Nauki do Interfejsów

Ten logiczny układ i dostępność, które dziś uważamy za standard, nie powstały jednak od razu. Przejście od prostych dokumentów do zaawansowanych interaktywnych stron wymagało lat ewolucji.

Język `HTML` (*HyperText Markup Language*) powstał w szwajcarskim ośrodku badawczym CERN. Jego twórca, _**Tim Berners-Lee**_, zaprojektował go do formatowania raportów naukowych i łączenia ich odnośnikami. Gdy siecią zainteresował się komercyjny biznes, `HTML` musiał zacząć obsługiwać grafikę i skomplikowane układy. Ta ewolucja przeszła przez trzy główne ery, które podsumowuje poniższa tabela:

| Era                                                                                    | Główne założenia techniczne                                                                                                                       | Wpływ na działanie stron                                                                                                    |
| :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| **Era chaosu** (<abbr title="Hypertext Markup Language version 4">`HTML4`</abbr>)      | Układ oparty o tabele `<table>`, brak standardów `CSS` (brak `Flexbox` i `Grid`), tolerowanie błędów składniowych.                                | Powolne ładowanie stron, duże obciążenie procesorów, brak spójności w wyświetlaniu między przeglądarkami.                   |
| **Era restrykcji** (<abbr title="Extensible Hypertext Markup Language">`XHTML`</abbr>) | Ścisłe zasady <abbr title="eXtensible Markup Language">`XML`</abbr> (wymóg zamykania wszystkich tagów, np. `<br />`), brak tolerancji dla błędów. | Każdy drobny błąd składniowy (np. brak cudzysłowu) całkowicie blokował wyświetlanie strony (krytyczne straty w e-commerce). |
| **Złoty środek** (<abbr title="Hypertext Markup Language version 5">`HTML5`</abbr>)    | Tolerancyjny parser (błędy nie blokują stron), wprowadzenie tagów semantycznych (`<header>`, `<nav>`, `<article>`, `<footer>`).                   | Lepsze pozycjonowanie (`SEO`), wysoka dostępność cyfrowa (`WCAG`) i brak blokowania stron przy drobnych pomyłkach.          |

<details>
<summary>Historyczne wersje HTML</summary>

- HTML 1.0 (<time datetime="1991">1991</time>) - Pierwsza wersja HTML, bardzo prosta i podstawowa.
- HTML 2.0 (<time datetime="1995">1995</time>) - Wprowadzenie formularzy i tabel.
- HTML 3.2 (<time datetime="1997">1997</time>) - Dodanie wsparcia dla skryptów i stylów.
- HTML 4.01 (<time datetime="1999">1999</time>) - Wprowadzenie ramek, arkuszy stylów i skryptów.
- XHTML (<time datetime="2000">2000</time>) - Bardziej rygorystyczna wersja HTML oparta na XML.
- HTML5 (<time datetime="2014">2014</time>) - Obecny standard z nowymi elementami semantycznymi, wsparciem dla multimediów i aplikacji webowych.


</details>

---

## ⚙️ Trójpodział Władzy: Silniki Renderujące

Kod `HTML` i `CSS`, niezależnie od tego, jak pięknie i semantycznie go napiszemy, jest dla komputera tylko zbiorem znaków. <strong>Aby ten tekst zamienił się w interaktywny obraz na ekranie, przeglądarka potrzebuje silnika renderującego</strong> (*Rendering Engine*), czyli wewnętrznego serca każdego programu do przeglądania sieci.

Przeglądarki różnią się dodatkami i wyglądem, ale pod maską korzystają z jednego z trzech wiodących silników renderujących:

| Silnik renderujący   | Główne przeglądarki                        | Charakterystyka i wyzwania dla programisty                                                                              |
| :------------------- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Blink** (Chromium) | Google Chrome, Edge, Opera, Brave, Vivaldi | Rozwijany przez Google, dominuje na rynku i narzuca standardy.                                                          |
| **Gecko** (Mozilla)  | Firefox, Tor Browser                       | Otwarty kod chroniący przed monopolem. Stanowi bazę dla projektów stawiających na pełną prywatność (np. `Tor Browser`). |
| **WebKit** (Apple)   | Safari (macOS, iOS)                        | Napędza ekosystem Apple. Na iOS każda przeglądarka musi go używać. Wolniej wdraża nowości.                              |

> [!WARNING]
> **`Manifest V3`** to kontrowersyjny zestaw reguł dla rozszerzeń, który firma Google wprowadziła bezpośrednio do silnika *Chromium*. Ponieważ bazuje na nim ogromna liczba współczesnych przeglądarek, zmiany te dotkną większość użytkowników sieci. Jedyną przeglądarką opartą na tym silniku, w której negatywne skutki zmian (np. ograniczenie blokowania reklam) odczujemy najmniej, jest *Brave*, ponieważ jego twórcy i tak mocno modyfikują kod silnika.
> 
> Twórcy najpopularniejszych przeglądarek współpracują w ramach organizacji W3C (*World Wide Web Consortium*):
> - Google
> - Meta
> - Apple
> - Microsoft
> - Mozilla
> - (pełna lista członków jest na stronie [W3C](https://www.w3.org/Consortium/Member/List))
> 
> Mimo wspólnych działań przyszłość technologiczna standardu rozszerzeń stała się polem bitwy. Najważniejszymi oponentami wobec radykalnych ograniczeń Google są Mozilla (twórcy *Firefoxa*) oraz *DuckDuckGo*. Ich zdaniem <strong>**_`Manifest V3` w obecnej formie to krok wstecz_**</strong>. Ogranicza on możliwości deweloperów, utrudnia skuteczną ochronę prywatności użytkowników oraz drastycznie osłabia działanie zaawansowanych blokerów reklam i skryptów śledzących.

> [!TIP]
> Zanim wdrożysz na stronie nowoczesne rozwiązanie (np. zaawansowaną transformację `CSS` 3D), sprawdź stan jego wsparcia na portalu _**Can I Use**_ (https://caniuse.com/). Wpisanie nazwy technologii wyświetli czytelną tabelę kompatybilności dla każdego silnika.

---

<data-gate>
  <data-connection-matcher title="Połącz silnik renderujący z przeglądarką, w której jest domyślnie używany:">
    <div class="cmw-item" data-left="Blink" data-right="Google Chrome, Edge, Opera, Brave"></div>
    <div class="cmw-item" data-left="Gecko" data-right="Firefox, Tor Browser"></div>
    <div class="cmw-item" data-left="WebKit" data-right="Safari"></div>
  </data-connection-matcher>
</data-gate>

---

## 🖥️ Środowisko pracy i konfiguracja: Visual Studio Code

Plik `HTML` to w rzeczywistości zwykły dokument tekstowy. Teoretycznie mógłbyś napisać cały portal w systemowym Notatniku. W praktyce jednak praca bez profesjonalnego edytora szybko doprowadziłaby do błędów. Brak automatycznych ułatwień sprawia, że zgubienie jednego cudzysłowu może rozsypać układ całej strony, a znalezienie usterki w jednolitym czarnym tekście zajmuje godziny.

Najpopularniejszym edytorem w branży jest darmowy, otwartoźródłowy program **Visual Studio Code ([VS Code](https://code.visualstudio.com/download))** od firmy Microsoft. Zainstaluj go na swoim komputerze, aby przygotować środowisko do nauki.

![Przedstawienie możliwych formatów i platform dla VS Code](/public/courses/web-frontend/Images/VSCode-dla-wszystkich-platform.png)

Warto w instalatorze zaznaczyć wszystkie opcje:

![Przedstawienie opcji instalacji VS Code](/public/courses/web-frontend/Images/VSCode-instalator.png)

Dzięki temu będziemy mogli uruchomić program z dowolnego miejsca w terminalu wpisując komendę `code` lub wybierając z menu kontekstowego <kbd class="win-menu-btn">Open with Code</kbd>. Kliknięcie prawym przyciskiem myszy na plik lub folder otworzy podręczne menu, gdzie znajdziesz bezpośrednią opcję uruchomienia edytora w tej lokalizacji.

![Przedstawienie menu kontekstowego VS Code](/public/courses/web-frontend/Images/VSCode-w-menu-kontekstowym-windows11.png)

Jedyne co na tym etapie warto jeszcze zrobić, to zainstalować dodatek `Live Preview` od firmy Microsoft i zmienić ustawienie aktualizacji podglądu z automatycznego na aktualizację po zapisie pliku. Dzięki temu zyskujesz podwójnie: możesz w czasie rzeczywistym widzieć wprowadzane zmiany bez konieczności przeskakiwania między oknem edytora a przeglądarką, a samo ustawienie eliminuje paniczne odświeżanie strony i wyrabia nawyk regularnego zapisu pliku skrótem <span style="text-wrap: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>.

![Przedstawienie dodatku Live Preview](/public/courses/web-frontend/Images/VSCode-Live-Preview-Microsoft-settings.png)

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **<abbr title="World Wide Web">WWW</abbr> powstało w <abbr title="Europejska Organizacja Badań Jądrowych">CERN</abbr>**: Choć infrastruktura internetowa ma korzenie wojskowe (<abbr title="Advanced Research Projects Agency Network">ARPANET</abbr>), to sieć WWW stworzono do otwartej wymiany wiedzy naukowej w postaci płaskiego tekstu.
- **Płaski tekst to fundament**: Trzy filary sieci (uniwersalność, roboty <abbr title="Search Engine Optimization">SEO</abbr> oraz dostępność <abbr title="Web Content Accessibility Guidelines">WCAG</abbr>) opierają się na jawnym, ustrukturyzowanym kodzie `HTML`.
- **<abbr title="Hypertext Markup Language version 5">`HTML5`</abbr> stawia na semantykę**: Zastąpienie bezpłciowych bloków `<div>` tagami semantycznymi (jak `<header>` czy `<nav>`) to klucz do pozycjonowania stron i walki z wykluczeniem cyfrowym.
- **Przeglądarki różnią się silnikami**: `Blink`, `Gecko` i `WebKit` decydują o tym, jak kod zamienia się w piksele. Zawsze weryfikuj ich kompatybilność na portalu `Can I Use`.
- **`VS Code` to Twoje narzędzie pracy**: Automatyczne formatowanie, kolorowanie składni oraz `Live Preview` chronią Cię przed błędami i drastycznie przyspieszają naukę.

---

Masz już gotowy edytor, znasz techniczne tło internetu i rozumiesz stojącą za nim filozofię. Jeśli zrodził się w Tobie duch wojownika semantyki, czas przekuć tę świadomość w praktykę i ruszyć do prawdziwego kodowania! W następnej lekcji stworzysz swój pierwszy, poprawny semantycznie plik `HTML`!
