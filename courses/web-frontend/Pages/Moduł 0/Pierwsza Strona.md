# Pierwsza Strona

Rozpoczynamy pracę z praktyczną strukturą dokumentu HTML. Pierwszym zadaniem będzie utworzenie katalogu odnośników wzorowanego na klasycznym układzie *The Hidden Wiki*. Jest to surowy, tekstowy zbiór linków służący do nawigacji w sieci.

W tym projekcie skupiamy się wyłącznie na strukturze logicznej. Najważniejszym celem jest poprawna <strong>**hierarchia informacji**</strong> oraz odpowiednie zagnieżdżanie tagów.

Twoim zadaniem jest utworzenie w programie VS Code nowego pliku o nazwie `index.html`. Zrobisz to poprzez kliknięcie ikony tworzenia nowego pliku (zaznaczonej fioletową obramówką). Gdyby sekcja boczna została zamknięta, możesz ją ponownie otworzyć klikając ikonę oznaczoną niebieską obramówką lub używając skrótu klawiszowego <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>B</kbd></span>.

![Wycinek z VS Code demonstrujący utworzenie nowego pliku](/public/courses/web-frontend/Images/nowy-plik-index-html.png)

Dlaczego właśnie `index.html`?  

Wyobraź sobie, że wpisujesz w przeglądarce adres `https://example.com`. W tym adresie nie podajesz na końcu nazwy żadnego konkretnego pliku. 

Serwer internetowy musi jednak zdecydować, który plik ma Ci odesłać. Aby to zrobić, wykonuje proste kroki:
1. Otwiera główny folder powiązany z adresem `https://example.com`.
2. Szuka w tym folderze pliku o domyślnej nazwie `index.html`.
3. Automatycznie wyświetla ten plik jako stronę główną portalu.

Gdyby plik nazywał się inaczej (np. `strona.html`), <strong>serwer po wpisaniu samego adresu nie wiedziałby, co otworzyć</strong>. W zależności od jego konfiguracji zobaczymy wtedy błąd `403 Forbidden` (brak uprawnień do wyświetlenia zawartości) lub `404 Not Found` (nie odnaleziono pliku/strony).

W niektórych konfiguracjach serwera skutkuje to wyświetleniem pełnej zawartości folderu na ekranie (tzw. *Directory Listing*). Ilustruje to zrzut ekranu poniżej – brak pliku `index.html` sprawił, że serwer ujawnił wszystkie pliki w tym folderze, w tym <strong>poufne pliki</strong> takie jak `dane_klientów.json` czy prywatny plik `notatka.txt`.

![Wygląd okna przeglądarki w przypadku braku pliku index.html](/public/courses/web-frontend/Images/przykład-gdy-nie-ma-index-html.png)

<data-gate>
  <data-quiz>
    <question>Co grozi serwerowi, na którym w folderze projektu zabraknie domyślnego pliku index.html?</question>
    <options>
      <item>Przeglądarka zablokuje możliwość edycji kodu i wyświetli komunikat o uszkodzeniu struktury projektu.</item>
      <item correct>Serwer wyświetli spis plików (Directory Listing) lub zablokuje do nich dostęp błędem 403 Forbidden.</item>
      <item>Wtyczka Live Preview wyłączy automatyczne odświeżanie strony i wymusi ręczne ładowanie plików.</item>
      <item>System operacyjny serwera automatycznie usunie wszystkie pozostałe dokumenty w tym katalogu.</item>
    </options>
    <div data-hint="error">
      Przyjrzyj się uważnie powyższemu zrzutowi ekranu. Co dokładnie pokazała przeglądarka, gdy serwer nie znalazł domyślnego pliku startowego?
    </div>
    <div data-hint="success">
      Świetnie! Brak index.html to poważna luka bezpieczeństwa, która może ujawnić strukturę plików i poufne dane na serwerze.
    </div>
  </data-quiz>
</data-gate>

> [!TIP]
> Warto wiedzieć, że w przeszłości (w czasach systemu operacyjnego DOS) powszechnie stosowano również rozszerzenie `.htm`. Wynikało to z ograniczenia systemu plików `FAT16`, który pozwalał na nazwy rozszerzeń o maksymalnej długości $3$ znaków (tak zwana zasada `8.3`). <strong>Współczesnym i zalecanym standardem jest rozszerzenie <code>.html</code></strong>.

---

## 💀 Szkielet dokumentu HTML (Boilerplate)

Każdy dokument HTML potrzebuje podstawowej struktury startowej. Szablon ten (zwany *boilerplate*) definiuje parametry techniczne strony, zanim umieścimy na niej właściwą treść.

```html
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tytuł karty</title>
</head>

<body>
    <!-- Tu będziemy budować treść strony -->
</body>

</html>
```

Warto dokładnie zrozumieć rolę każdego elementu w tej strukturze:

- <code>&lt;!DOCTYPE html&gt;</code>: Deklaracja informująca przeglądarkę, że dokument korzysta ze standardu _**HTML5**_. Zapobiega to przejściu przeglądarki w tryb wstecznej kompatybilności (*quirks mode*).
- <code>&lt;html lang="pl"&gt;</code>: Główny kontener dokumentu. Atrybut `lang="pl"` jest <strong>kluczowym wymogiem dostępności (WCAG)</strong>. Pozwala syntezatorom mowy prawidłowo odczytywać polski tekst z odpowiednim akcentem.
- <code>&lt;head&gt;</code>: Sekcja nagłówkowa dokumentu. Informacje tu zawarte (poza tytułem w <code>&lt;title&gt;</code>) nie są bezpośrednio wyświetlane na ekranie. Służy ona do konfiguracji strony, ładowania zasobów oraz komunikacji z wyszukiwarkami.
  - <code>&lt;meta charset="UTF-8"&gt;</code>: Deklaracja kodowania znaków. Gwarantuje prawidłowe wyświetlanie polskich liter diakrytycznych (np. ą, ę, ł, ó, ś, ź, ż).
  - <code>&lt;meta name="viewport" ...&gt;</code>: Konfiguracja okna podglądu (viewport). Informuje przeglądarki na urządzeniach mobilnych, aby dostosowały szerokość strony do fizycznej szerokości ekranu urządzenia i ustawiły początkowe powiększenie na $100\\%$. Zapobiega to nienaturalnemu pomniejszaniu tekstu i renderowaniu strony tak, jakby była wyświetlana na monitorze komputera.
- <code>&lt;body&gt;</code>: Główny kontener treści strony. Tutaj umieszcza się wszystkie elementy, które mają być bezpośrednio widoczne i dostępne dla użytkownika.

Podczas przeglądania kodu różnych stron internetowych możesz zauważyć wiele dodatkowych znaczników `<meta>`. Służą one do przekazywania dodatkowych informacji robotom indeksującym internet, wyszukiwarkom, mediom społecznościowym oraz przeglądarkom.

<details>
<summary>Dodatkowe znaczniki meta stosowane w sieci</summary>

| Znacznik meta | Rola i przeznaczenie                                                       | Przykład zastosowania                                                  |
| :------------ | :------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `description` | Opis strony wyświetlany w wynikach wyszukiwania Google.                    | `<meta name="description" content="Katalog bezpiecznych odnośników.">` |
| `robots`      | Instrukcje dla robotów indeksujących (np. zakaz indeksowania).             | `<meta name="robots" content="noindex, nofollow">`                     |
| `og:title`    | Tytuł wyświetlany podczas udostępniania linku w mediach społecznościowych. | `<meta property="og:title" content="The Hidden Wiki">`                 |
| `og:image`    | Adres obrazka wyświetlanego jako podgląd w social media.                   | `<meta property="og:image" content="https://example.com/preview.jpg">` |

</details>

Gdy będziesz chciał zobaczyć podgląd z zainstalowanej i skonfigurowanej wcześniej wtyczki *`Live Preview`* od firmy Microsoft, kliknij ikonę, którą oznaczyłem fioletową obramówką w prawym górnym rogu.  
Swoją drogą, wyłącz też podpowiedzi AI (patrz obrazek poniżej). Choć bywają wygodne, na początku mogą rozpraszać. Utrudniają też samodzielną naukę składni. Dodatkowo, jeśli model nie zrozumie Twoich intencji, zacznie podsuwać błędny kod. Bywa to naprawdę irytujące. Szczególnie gdy AI zapętli się i proponuje to samo $40$ razy z rzędu 😅.

![Wygląd okna przeglądarki w przypadku braku pliku index.html](/public/courses/web-frontend/Images/VSCode-wyłącz-podpowiedzi-AI.png)

Poniżej pokazuję efekt dwóch pierwszych modyfikacji szablonu startowego (*boilerplate*):
- Na pomarańczowo zaznaczyłem <code>&lt;html lang="en"&gt;</code>, przez co przeglądarka od razu zapytała, czy chcę przetłumaczyć stronę na język polski.
- Na fioletowo zaznaczyłem <code>&lt;title&gt;Tytuł karty&lt;/title&gt;</code> oraz dwa miejsca, w których ten tytuł się wyświetla: kartę podglądu Live Preview oraz kartę samej przeglądarki.

> PS. Możesz też wyłączyć minimapę, klikając na nią prawym przyciskiem myszy (PPM) i odznaczając odpowiednią opcję. Moim zdaniem to zbędny bajer.

![Wygląd okna przeglądarki w przypadku braku pliku index.html](/public/courses/web-frontend/Images/VSCode-wyłącz-minimapę.png)


---

## 🌐 Adresy w przeglądarce: <code>http://127.0.0.1</code> (Live Preview) vs <code>file://</code> (dysk)

Gdy uruchomisz podgląd kodu (np. za pomocą ikony wtyczki *`Live Preview`*), Twoja strona otworzy się pod adresem sieciowym zaczynającym się od `http://127.0.0.1:3000/...`.

Gdybyś jednak otworzył ten sam plik `index.html` bezpośrednio ze swojego dysku twardego (np. klikając na niego dwukrotnie w folderze), w pasku adresu przeglądarki pojawi się ścieżka zaczynająca się od `file:///C:/...`.

Różnica między nimi sprowadza się do sposobu, w jaki przeglądarka pobiera dane:

* **Protokół lokalny (`file:///`)**: Przeglądarka działa jak zwykły odtwarzacz plików na komputerze. Odczytuje kod bezpośrednio z dysku twardego. Adres ten zadziała wyłącznie na Twoim komputerze.
* **Protokół sieciowy (`http://`)**: Wtyczka *`Live Preview`* to w rzeczywistości <strong>*lokalny mini-serwer*</strong>. Kiedy z niej korzystasz, wtyczka uruchamia w tle proces serwera, który udaje, że Twoja strona jest opublikowana w sieci. Przeglądarka łączy się z nim przez protokół sieciowy `HTTP` pod adresem `127.0.0.1` (który wskazuje na Twój własny komputer, czyli tzw. *localhost*).

### Czym są URI oraz URL?

Skoro widzisz już adres w pasku przeglądarki, warto poznać dwa pojęcia, które będą Ci towarzyszyć w całej karierze programistycznej:

* **URI** (*Uniform Resource Identifier*): Ogólny, ujednolicony identyfikator służący do nazywania i wskazywania dowolnego zasobu na świecie (może to być plik na komputerze, książka w bazie danych, czy dokument).
* **URL** (*Uniform Resource Locator*): Szczególny przypadek URI, który oprócz nazwy podaje również dokładną lokalizację zasobu w sieci oraz protokół, za pomocą którego przeglądarka ma się z nim połączyć (np. `http://`, `https://` lub `file://`).

<data-gate>
  <data-connection-matcher title="Połącz adres/konfigurację w przeglądarce z jej faktyczną rolą techniczną:">
    <div class="cmw-item" data-left="<pre><code>http://127.0.0.1:3000/...</code></pre>" data-right="Adres sieciowy lokalnego mini-serwera Live Preview"></div>
    <div class="cmw-item" data-left="<pre><code>file:///C:/...</code></pre>" data-right="URL lokalny wskazujący na bezpośredni plik na dysku"></div>
    <div class="cmw-item" data-left="<pre><code>&amp;lt;meta name=&amp;quot;viewport&amp;quot;...&amp;gt;</code></pre>" data-right="Konfiguracja skalowania strony na smartfonach"></div>
    <div class="cmw-item" data-left="<pre><code>&amp;lt;html lang=&amp;quot;pl&amp;quot;&amp;gt;</code></pre>" data-right="Deklaracja języka kluczowa dla dostępności WCAG"></div>
  </data-connection-matcher>
</data-gate>

---

## 🏗️ Architektura nagłówków (H1 - H6)

Nagłówki służą do określenia hierarchii i struktury znaczeniowej strony (tworzą tak zwane drzewo dokumentu). HTML oferuje sześć poziomów nagłówków: od najważniejszego <code>&lt;h1&gt;</code> do najmniej ważnego <code>&lt;h6&gt;</code>.

Każdy z nich ma określone miejsce w strukturze:
- <code>&lt;h1&gt;</code>: Główny tytuł strony lub podstrony. Powinien odnosić się do unikalnej treści danego widoku (np. tytuł artykułu, strony „Kontakt” czy panelu konta). Błędem jest stosowanie ogólnej nazwy serwisu/logo jako <code>&lt;h1&gt;</code> na każdej podstronie. Na danej podstronie powinien występować dokładnie jeden element tego poziomu. Dopuszcza się użycia <code>&lt;h1&gt;</code> jako nazwy logotypowej serwisu tylko raz na stronie głównej i nie wolno tego powturzyć w obrembie całego projektu.
- <code>&lt;h2&gt;</code>: Główne sekcje (rozdziały) dokumentu.
- <code>&lt;h3&gt;</code>: Podsekcje (podrozdziały) wewnątrz tematów z poziomu <code>&lt;h2&gt;</code>.
- <code>&lt;h4&gt;</code>, <code>&lt;h5&gt;</code>, <code>&lt;h6&gt;</code>: Kolejne, głębsze poziomy podrozdziałów. Rzadko stosowane na prostych stronach wizytówkowych, ale niezbędne w rozbudowanych dokumentacjach, artykułach naukowych czy wielostronicowych instrukcjach.

### 📶 Zasady hierarchii nagłówków (WCAG)

Standardy dostępności cyfrowej (WCAG) oraz pozycjonowanie (SEO) opierają się na dwóch kluczowych zasadach budowania nagłówków:

1. **Zakaz zagnieżdżania:** Nagłówki są elementami blokowymi i nigdy nie powinny być umieszczane jeden wewnątrz drugiego. Zapisujemy je kolejno w kodzie strony. Hierarchia logiczna (że dany temat leży „pod” innym) wynika z numeracji tagu (np. <code>&lt;h3&gt;</code> po <code>&lt;h2&gt;</code>), a nie z fizycznego włożenia jednego tagu do drugiego:

```html
<!-- PRAWIDŁOWA KOLEJNOŚĆ W KODZIE -->
<h2>Wiadomości z ubiegłego świata</h2>
<h3>Biuletyny naukowe</h3>
<h3>Demaskatorzy</h3>

<!-- BŁĘDNY UKŁAD (NIGDY TAK NIE PISZ) -->
<h2>Wiadomości z ubiegłego świata <h3>Biuletyny naukowe</h3></h2>
```

2. **Zakaz pomijania poziomów:** Aby czytniki ekranu dla osób niewidomych mogły poprawnie odczytać strukturę strony, <strong>nie wolno przeskakiwać poziomów w dół</strong> (np. bezpośrednio z <code>&lt;h2&gt;</code> do <code>&lt;h4&gt;</code>, z pominięciem <code>&lt;h3&gt;</code>). Przeglądarka i programy asystujące uznają to za błąd w strukturze i mogą błędnie zinterpretować układ treści.

Poniższa tabela przedstawia poprawność różnych sekwencji nagłówków w dokumencie:

| Sekwencja nagłówków                                                              | Stan         | Wyjaśnienie                                                     |
| :------------------------------------------------------------------------------- | :----------- | :-------------------------------------------------------------- |
| `H1` $\rightarrow$ `H2` $\rightarrow$ `H3`                                       | **Poprawna** | Stopniowe schodzenie w dół o jeden poziom.                      |
| `H1` $\rightarrow$ `H3` $\rightarrow$ `H2`                                       | **_Błędna_** | Pominięto poziom `H2` na początku struktury.                    |
| `H1` $\rightarrow$ `H3` $\rightarrow$ `H4`                                       | **_Błędna_** | Pominięto poziom `H2` podczas pierwszego kroku.                 |
| `H1` $\rightarrow$ `H2` $\rightarrow$ `H3` $\rightarrow$ `H2`                    | **Poprawna** | Powrót do wyższego poziomu `H2` (nowy rozdział) jest dozwolony. |
| `H1` $\rightarrow$ `H2` $\rightarrow$ `H3` $\rightarrow$ `H2` $\rightarrow$ `H4` | **_Błędna_** | Po powrocie do `H2` przeskoczono do `H4` bez poziomu `H3`.      |

Przykładowa, poprawna struktura dokumentu wygląda następująco:

```html
<body>
    <h1>The Hidden Wiki</h1>
    <p>Witaj w katalogu bezpiecznych linków.</p>
    
    <h2>Wiadomości z ubiegłego świata</h2>
    <h3>Biuletyny naukowe</h3>
    <h3>Demaskatorzy</h3>
    
    <h2>Rynki Ekonomiczne</h2>
</body>
```

<strong>Nagłówki stosujemy wyłącznie do budowy logicznej struktury dokumentu.</strong> Na zwykłe bloki tekstu przeznaczony jest znacznik <code>&lt;p&gt;</code>.

<details>
<summary>Ciekawostka: Czy można używać wielu nagłówków H1 oraz tagu <code>&lt;main&gt;</code>?</summary>

Wokół tych elementów narosło wiele mitów wynikających z dawnych wersji specyfikacji HTML:

- **Wielokrotne <code>&lt;h1&gt;</code> na jednej stronie:** Dawniej wczesny projekt HTML5 zakładał tzw. *Document Outline Algorithm*. Teoretycznie pozwalał on na umieszczanie osobnego <code>&lt;h1&gt;</code> wewnątrz każdego elementu <code>&lt;article&gt;</code> czy <code>&lt;section&gt;</code>. Pomysł ten jednak <strong>**_nigdy nie został wdrożony_**</strong> przez twórców przeglądarek ani czytników ekranu. W $2022$ roku oficjalnie wycofano go ze standardu. Dziś zasada jest jedna: stosujemy dokładnie <strong>jeden nagłówek <code>&lt;h1&gt;</code> na stronę</strong>.
- **Logotyp jako <code>&lt;h1&gt;</code>:** Częstym błędem było oznaczanie głównego logo strony w nagłówku jako <code>&lt;h1&gt;</code>. Powodowało to, że na każdej podstronie czytniki ekranu odczytywały nazwę firmy jako najważniejszy tytuł, zamiast faktycznego tytułu artykułu. Współcześnie <code>&lt;h1&gt;</code> rezerwuje się wyłącznie dla unikalnego tytułu danej podstrony.
- **Znacznik <code>&lt;main&gt;</code>:** Ten znacznik reprezentuje unikalną, główną treść strony. Specyfikacja HTML <strong>kategorycznie zabrania stosowania więcej niż jednego widocznego elementu <code>&lt;main&gt;</code></strong> w całym kodzie dokumentu. Stosowanie wielu takich tagów powoduje błąd walidacji i utrudnia nawigację użytkownikom czytników ekranu.

</details>

---

## 🗂️ Struktura list: <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code> i <code>&lt;li&gt;</code>

Listy w języku HTML służą do logicznego grupowania powiązanych ze sobą elementów. Budujemy je na podstawie relacji **„rodzic-dziecko”** (*parent-child*). Rolę rodzica pełni tu znacznik listy (`<ul>` lub `<ol>`), a rolę dziecka reprezentuje znacznik elementu listy (`<li>`).

W specyfikacji HTML obowiązuje jedna kluczowa zasada strukturalna: <strong>bezpośrednim dzieckiem znacznika <code>&lt;ul&gt;</code> lub <code>&lt;ol&gt;</code> może być wyłącznie element <code>&lt;li&gt;</code></strong> (*List Item*).

### 📋 1. Lista nieuporządkowana (<code>&lt;ul&gt;</code>)

`<ul>` (*unordered list*) stosujemy ją, gdy kolejność punktów nie ma znaczenia (np. lista zakupów lub menu nawigacji). Domyślnie przeglądarka wyświetla te elementy z czarnymi kropkami (punktory).

```html
<ul>
    <li>Pierwszy zestaw linków badawczych</li>
    <li>Drugi zbiór danych telemetrycznych</li>
    <li>Materiały prasowe</li>
</ul>
```

### 🔢 2. Lista uporządkowana (<code>&lt;ol&gt;</code>)

`<ol>` (*ordered list*) stosujemy ją, gdy kolejność ma znaczenie (np. rankingi lub instrukcje krok po kroku). Przeglądarka automatycznie ponumeruje takie elementy ($1$, $2$, $3$...).

```html
<ol>
    <li>Pobierz i zainstaluj edytor VS Code</li>
    <li>Stwórz plik o nazwie index.html</li>
    <li>Uruchom podgląd Live Preview</li>
</ol>
```

### ⚠️ Dlaczego poprawne zagnieżdżanie jest ważne?

Jeśli umieścisz inne znaczniki (np. akapit `<p>`) lub zwykły tekst bezpośrednio wewnątrz `<ul>` lub `<ol>`, utworzysz tzw. **„elementy osierocone”** (*orphaned elements*). 

> Pojęcie „sierot” (struktur osieroconych) to uniwersalny problem w inżynierii oprogramowania. W innych środowiskach osierocone procesy, niezwolnione bloki pamięci czy osierocone obiekty prowadzą do **wycieków zasobów** i poważnych błędów logicznych. Z tego powodu w każdym języku programowania dąży się do ich bezwzględnego wykrywania i likwidacji 🪓.

W świecie HTML wizualny efekt posiadania takich osieroconych tagów ilustruje poniższy obrazek. W pierwszej liście tekst akapitu znajduje się prawidłowo wewnątrz elementu `<li>`. W drugiej liście znacznik `<p>` oraz zwykły tekst zostały wstawione bezpośrednio do `<ol>`. 

Przeglądarka nadal aplikuje domyślne marginesy wewnętrzne kontenera `<ol>` (dlatego tekst ma widoczne wcięcie), ale nie potrafi nadać tym elementom markerów liczbowych. Wynika to z faktu, że nie są one otoczone przez wymagany element `<li>`.

Taki kod stwarza też poważne problemy dla czytników ekranu i łamie standardy dostępności WCAG. Pamiętaj: <strong>każdy element listy musi mieć swojego bezpośredniego opiekuna w postaci tagu <code>&lt;li&gt;</code></strong>, a wszelkie osierocone fragmenty muszą zostać usunięte lub prawidłowo opakowane.

![Przedstawienie w MS Edge i Mozilla Firefox render strony oraz inspekcję kodu Gdzie pierwsza lista ol jest numerowana a druga mimo wcięć nie ma markera](/public/courses/web-frontend/Images/Przedstawienie_w_MS_Edge_i_Mozilla_Firefox_render_strony_oraz_inspekcję_kodu_Gdzie_pierwsza_lista_ol_jest_numerowana_a_druga_mimo_wcięć_nie_ma_markera.png)

---

## 🔗 Hiperłącza i atrybuty (<code>&lt;a&gt;</code>)

Podstawą funkcjonowania sieci jest łączenie dokumentów odnośnikami. Służy do tego znacznik kotwicy <code>&lt;a&gt;</code> (*Anchor*).

Sam znacznik nie określa jeszcze celu odnośnika. Do zdefiniowania jego parametrów służą atrybuty. Dla hiperłącza najważniejszym atrybutem jest `href` (*Hypertext Reference*), który wskazuje adres docelowy, czyli wspomniany wcześniej **URL** (np. prowadzący do zewnętrznej witryny internetowej).

```html
<a href="https://sci-hub.in">Otwórz ukryty zasób naukowy</a>
```

### 🧭 Gdzie otwiera się strona? Atrybut target

Domyślnie kliknięcie odnośnika wczytuje nową stronę w tym samym oknie przeglądarki. Możesz zmienić to zachowanie za pomocą atrybutu `target`. Na tym etapie najważniejsze są dwie wartości:

- `_self`: Otwiera stronę w tej samej karcie (jest to zachowanie domyślne, więc nie musisz go wpisywać).
- `_blank`: Otwiera stronę w nowej karcie przeglądarki. Stosuj go, gdy odsyłasz do zewnętrznych portali, aby użytkownik nie opuścił Twojej witryny.

```html
<a href="https://sci-hub.in" target="_blank">Otwórz zasób w nowej karcie</a>
```

> [!NOTE]
> W specyfikacji HTML istnieją jeszcze dwie wartości: `_parent` oraz `_top`. Służą one do pracy z ramkami osadzonymi na stronie (`<iframe>`) i dowiesz się o nich w dalszej części nauki, gdy będziemy omawiać zaawansowane układy stron.

### 📂 Linkowanie plików: Adresy względne i bezwzględne

Odnośnik `<a>` może prowadzić do innych plików w Twoim własnym projekcie. Wskazujemy je na dwa sposoby: za pomocą adresowania **bezwzględnego** lub *względnego*. Wybór metody decyduje o tym, czy linki będą działać po przeniesieniu strony na serwer.

#### 1. Adresowanie bezwzględne

Wskazuje stały, dokładny adres pliku w sieci lub na serwerze. Działa zawsze tak samo, niezależnie od tego, na jakiej podstronie aktualnie się znajdujesz. 

W naszej analogii odpowiada to podaniu pełnego adresu pocztowego: *„Polska, Warszawa, ul. Jasna 10, Hotel Bristol, pokój 305”*. Niezależnie od tego, w jakim miejscu na świecie się znajdujesz, ten adres zawsze zaprowadzi Cię dokładnie do tego samego pokoju.

Mamy tu dwa popularne zapisy w kodzie:

- **Pełny adres URL** (np. `https://domena.pl/kontakt.html`): Wskazuje konkretną domenę w internecie oraz dokładną ścieżkę do pliku.
- **Ścieżka bezwzględna serwera** (np. `/kontakt.html`): Zaczyna się od ukośnika `/`. Ten początkowy ukośnik informuje przeglądarkę: „przejdź bezpośrednio do głównego folderu naszej domeny i tam szukaj pliku `kontakt.html`”.

#### 2. Adresowanie względne (zalecane)

Wskazuje lokalizację pliku względem dokumentu, w którym aktualnie się znajdujesz. Jest to najbardziej uniwersalny i elastyczny sposób.

W naszej analogii: jeśli jesteś już wewnątrz Hotelu Bristol, nie musisz za każdym razem powtarzać pełnego adresu z nazwą kraju i miasta. Wystarczy, że powiesz: *„idź do pokoju 308”* lub *„wejdź piętro wyżej”*. Ta instrukcja działa jednak wyłącznie dlatego, że odnosisz się do miejsca, w którym aktualnie przebywasz.

W kodzie HTML używamy następujących zapisów:

- `kontakt.html` lub `./kontakt.html` (plik znajduje się w tym samym katalogu). Zapis z kropką i ukośnikiem (`./`) jawnie wskazuje na obecny folder. Jest to format zalecany i często wymagany przez platformy hostingowe (np. GitHub Pages).
- `podstrony/kontakt.html` (wejście do podkatalogu `podstrony`).
- `../kontakt.html` (wyjście o poziom wyżej, do folderu nadrzędnego).

#### Protokół HTTP vs FILE: Dlaczego ścieżki bezwzględne mogą nie działać?

Wybór sposobu adresowania ma kluczowe znaczenie w zależności od sposobu uruchamiania strony przez przeglądarkę:

- **Protokół `file:///`** (uruchomienie pliku bezpośrednio z dysku twardego): Ścieżka `/kontakt.html` zostanie zinterpretowana przez przeglądarkę jako odwołanie do głównego katalogu całego dysku komputera (np. `C:\kontakt.html`). Ponieważ pliku tam nie ma, link zwróci błąd.
- **Protokół `http://` / `https://`** (uruchomienie strony przez Live Preview lub serwer internetowy): Ten sam adres `/kontakt.html` poprawnie wskaże na główny folder projektu na serwerze lokalnym (np. `http://127.0.0.1:3000/kontakt.html`).

Aby tworzona strona była w pełni przenośna i działała poprawnie zarówno na Live Preview, jak i po wdrożeniu do sieci, <strong>zaleca się stosowanie adresowania względnego</strong> (np. `./kontakt.html`).

### 📋 Zagnieżdżanie odnośników w listach

Poniższy przykład przedstawia poprawne zagnieżdżenie hiperłączy w strukturze listy:

```html
<h2>Otwarta Biblioteka Akademicka</h2>
<ul>
    <li>
        <a href="https://sci-hub.in">Platforma Danych Naukowych</a>
    </li>
    <li>
        <a href="https://scholar.google.com">Publiczne Analizy Google</a>
    </li>
</ul>
```

W tej strukturze kontenerem głównym jest lista <code>&lt;ul&gt;</code>. Zawiera ona elementy listowe <code>&lt;li&gt;</code>, wewnątrz których osadzono odnośniki <code>&lt;a&gt;</code> z atrybutem `href`. Taka konstrukcja zapewnia pełną zgodność z wytycznymi WCAG i pozwala robotom wyszukiwarek na właściwe indeksowanie powiązań na stronie.

<data-gate>
  <data-quiz>
    <question>Który z poniższych zapisów przedstawia prawidłowe i semantyczne zagnieżdżenie odnośnika w liście?</question>
    <options>
<item>

```html
<ul>
    <a href="...">Link</a>
</ul>
```

</item>
<item correct>

```html
<ul>
    <li>
        <a href="...">Link</a>
    </li>
</ul>
```

</item>
<item>

```html
<a href="...">
    <ul>
        <li>Link</li>
    </ul>
</a>
```

</item>
<item>

```html
<ul>
    <a href="...">
        <li>Link</li>
    </a>
</ul>
```

</item>
    </options>
    <div data-hint="error">
      Zastanów się, jaki znacznik musi być bezpośrednim i jedynym dozwolonym dzieckiem listy <code>&lt;ul&gt;</code> lub <code>&lt;ol&gt;</code> przed umieszczeniem w nim odnośnika.
    </div>
    <div data-hint="success">
      Znakomicie! Bezpośrednim dzieckiem listy może być wyłącznie tag <code>&lt;li&gt;</code>, wewnątrz którego bezpiecznie osadzamy znacznik odnośnika <code>&lt;a&gt;</code>.
    </div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **`index.html` to standard**: To domyślny plik główny w folderze serwera. Jego brak na serwerze grozi błędem `403 Forbidden` lub wyciekiem listy plików (Directory Listing).
- **Boilerplate tworzy szkielet**: Każda strona potrzebuje tagów `<html>`, `<head>`, `<body>` oraz `<meta name="viewport">` do prawidłowego skalowania na urządzeniach mobilnych.
- **Nagłówki budują strukturę**: Używamy poziomów od `<h1>` do `<h6>`. Zgodnie z WCAG, nie zagnieżdżamy ich w sobie, nie pomijamy poziomów w dół i stosujemy dokładnie jeden `<h1>` na stronę.
- **Listy mają sztywne relacje**: Bezpośrednim dzieckiem `<ul>` lub `<ol>` może być wyłącznie element `<li>`.
- **Hiperłącza łączą sieć**: Znacznik `<a>` wskazuje cel za pomocą atrybutu `href`, w którym umieszczamy adres URL (sieciowy lub lokalny).
- **Live Preview to mini-serwer**: Podgląd w VS Code działa pod adresem sieciowym `http://127.0.0.1:3000/...` (protokół HTTP), podczas gdy bezpośrednie uruchomienie pliku z dysku używa lokalnego protokołu `file:///...`.
