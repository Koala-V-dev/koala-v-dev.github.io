# Tekst i Media

Mając już gotowy, poprawny szkielet dokumentu, czas zająć się tym, co znajduje się bezpośrednio wewnątrz akapitów. 

W tej lekcji dowiesz się, jak poprawnie formatować tekst i dodawać multimedia tak, aby strona była czytelna dla ludzi oraz w pełni zrozumiała dla systemów komputerowych.

---

## 🔤 Semantyka tekstu: <code>&lt;strong&gt;</code> vs <code>&lt;b&gt;</code>, <code>&lt;em&gt;</code> vs <code>&lt;i&gt;</code>

Pogrubienie i kursywa wyglądają prosto. W HTML mają jednak dwa różne poziomy znaczenia:
- **Tagi prezentacyjne**: opisują efekt wizualny.
- **Tagi semantyczne**: opisują znaczenie tekstu.

Wyszukiwarki, parsery, algorytmy sztucznej inteligencji oraz technologie asystujące odczytują intencję kodu bezpośrednio z użytych tagów oraz atrybutów, a nie z ich wizualnego wyglądu.

### ✅ <code>&lt;strong&gt;</code> oznacza ważność

Tag `<strong>` oznacza, że zawarty tekst ma <strong>krytyczne lub bardzo ważne znaczenie w danym kontekście</strong>.

```html
<p>
    Przed usunięciem konta
    <strong>pobierz kopię swoich danych</strong>.
    Tej operacji nie da się cofnąć.
</p>
```

Użyj go wtedy, gdy pominięcie informacji może doprowadzić do błędu, utraty danych albo złej decyzji. <strong>Nie stosuj <code>&lt;strong&gt;</code> tylko po to, żeby tekst był grubszy</strong>.

### 🎨 <code>&lt;b&gt;</code> oznacza wyróżnienie wizualne

<strong class="tag-stamp tag-stamp--obsolete">Przestarzały (lecz praktyczny)</strong>

Tag `<b>` daje pogrubienie bez dodatkowej semantycznej wagi. Chociaż we współczesnym frontendzie dąży się do oznaczania ważności semantycznej (`<strong>`) lub stylowania w CSS, tag `<b>` jest nadal praktyczny. Nadaje się do nazw własnych, słów kluczowych we wstępie albo terminów, które chcesz wyłapać wzrokiem na ekranie bez narzucania maszynom fałszywej hierarchii ważności.

```html
<p>
    Oprogramowanie <b>Visual Studio Code</b>
    zostało stworzone przez Microsoft.
</p>
```

### ✅ Tag <code>&lt;em&gt;</code> definiuje nacisk semantyczny

Tag <code>&lt;em&gt;</code> (skrót od *emphasis*, czyli nacisk na frazę) stosujemy do słów, które zmieniają sens logiczny całego zdania. Przeniesienie tego tagu na inne słowo całkowicie modyfikuje intencję zapisanego komunikatu.

Spójrz na poniższe przykłady i przeanalizuj różnicę w znaczeniu logicznym:

- Ja <em>nie</em> chcę tam iść. (oznacza zaprzeczenie chęci pójścia)
- <em>Ja</em> nie chcę tam iść. (oznacza, że ktoś inny może iść, ale nie ja)
- Ja nie chcę <em>tam</em> iść. (oznacza chęć pójścia w inne miejsce)

Dla robotów indeksujących wyszukiwarki, translatorów, parserów i modeli językowych to informacja, że to konkretne słowo modyfikuje znaczenie całego zdania. Nie jest to jednak narzędzie do sterowania głosem czytnika ekranu – dla technologii asystujących to przede wszystkim strukturalna informacja o kontraście logicznym.

### 🎨 Tag <code>&lt;i&gt;</code> wyróżnia bez zmiany znaczenia

<strong class="tag-stamp tag-stamp--obsolete">Przestarzały (lecz praktyczny)</strong>

Tag <code>&lt;i&gt;</code> (obecnie *idiomatic text*) służy do oznaczania słów, które różnią się charakterem od otaczającego tekstu, ale ich rola nie modyfikuje sensu logicznego zdania. Mimo że w klasycznym HTML uważano go za przestarzały znacznik czysto prezentacyjny, we współczesnych standardach jego wąskie, idiomatyczne użycie jest w pełni poprawne i praktyczne.

To idealne miejsce na:
- zwroty obcojęzyczne (np. <i>divide et impera</i>),
- tytuły dzieł i publikacji (np. książka <i>Hobbit</i>),
- terminy techniczne lub nazwy plików (np. plik <i>config.json</i>).

Wizualnie oba tagi dają pochylenie tekstu. Semantycznie różnią się jednak intencją: `<em>` zmienia znaczenie logiczne wypowiedzi, a `<i>` oznacza jedynie wydzielony językowo lub konwencjonalnie termin.

### 📊 Porównanie w tabeli

| Tag | Wygląd | Semantyka | Kiedy stosować |
| :--- | :--- | :--- | :--- |
| `<strong>` | Pogrubienie | Ważna lub krytyczna informacja | Instrukcje bezpieczeństwa, ostrzeżenia przed utratą danych |
| `<b>` | Pogrubienie | Wyróżnienie czysto wizualne | Nazwy własne w tekście, słowa kluczowe we wstępie |
| `<em>` | Kursywa | Nacisk semantyczny (emfaza) | Słowa kluczowe zmieniające sens logiczny całego zdania |
| `<i>` | Kursywa | Wyróżnienie idiomatyczne | Tytuły książek, słownictwo obcojęzyczne, nazwy plików |

### 🧪 Rzeczywistość czytania kodu: Ludzie vs Maszyny

W świecie technologii asystujących i nowoczesnego webu musisz patrzeć na semantykę tekstu bez mitów.

Czytniki ekranu (takie jak NVDA czy VoiceOver) przejeżdżają przez tagi `<strong>`, `<em>`, `<b>` i `<i>` jak przez zwykły tekst. Słowo umieszczone wewnątrz `<strong>` brzmi dla słuchacza dokładnie tak samo jak każdy inny wyraz obok. Wynika to z prostej przyczyny: gdyby syntezator mowy zmieniał intonację przy każdym pogrubieniu czy kursywie, słuchanie stron internetowych (gdzie wyróżnienia bywają masowo nadużywane) byłoby dla użytkowników po prostu irytujące i trudne w odbiorze.

Gdzie zatem leży sens stosowania semantyki? Kluczem jest rozdzielenie odbiorców na dwa światy: **ludzi** oraz **maszyny**.

#### Dla człowieka: Wizualne wyróżnienie (Wygląd)

Człowiek czytający stronę potrzebuje punktów skupienia, rytmu i czytelnej struktury graficznej. Robi to za pomocą wzroku. Aby ułatwić mu czytanie (szczególnie osobom z dysleksją czy trudnościami z koncentracją), stosujemy kolory, kontrast i style graficzne (które na produkcji definiujemy za pomocą klas CSS). 

Służy to wyłącznie ludzkiemu oku – ułatwia skanowanie wzrokiem, ale nie niesie wbudowanego, technicznego znaczenia dla kodu strony.

#### Dla maszyn: Semantyka HTML (Intencja Dokumentu)

Roboty indeksujące wyszukiwarki (SEO), ekstraktory treści, systemy podsumowujące (np. wbudowane w przeglądarki tryby czytnika) oraz algorytmy AI nie „widzą” kolorów ani stylów graficznych. Analizują one **czysty kod źródłowy**.

Dla nich użycie `<strong>` oraz `<em>` to jednoznaczny sygnał o intencji autora. Mówisz maszynie: *„Ta fraza to kluczowa reguła, ostrzeżenie przed nieodwracalną akcją lub istotna definicja w strukturze dokumentu”*. Semantyka HTML opisuje znaczenie informacji, a nie wygląd ekranu.

#### Synergia: Wygląd i znaczenie

Te dwa światy nie wykluczają się wzajemnie. Jeśli dany fragment ma być zarówno szybko dostrzeżony przez człowieka, jak i poprawnie zinterpretowany przez maszyny, stosujemy oba rozwiązania: nadajemy mu wagę semantyczną w HTML (np. opakowując w `<strong>`) oraz odpowiedni styl graficzny.

Dzięki temu kod pozostaje maksymalnie czytelny dla czytelnika, a jednocześnie czysty i w pełni zrozumiały dla całego ekosystemu internetu.


---

<data-gate>
  <data-quiz>
    <question>Piszesz dokumentację techniczną. Pojawia się zdanie ostrzegające o nieodwracalnej operacji usunięcia danych. Który tag powinieneś zastosować?</question>
<options>
<item correct>

```html
<strong>
```

</item>
<item>

```html
<em>
```

</item>
<item>

```html
<i>
```

</item>
</options>
    <div data-hint="error">
      Zastanów się, który z tych tagów niesie ze sobą faktyczną wagę semantyczną oznaczającą krytyczne znaczenie dla bezpieczeństwa użytkownika i systemu.
    </div>
    <div data-hint="success">
      Dobrze. <code>&lt;strong&gt;</code> informuje maszyny i systemy operacyjne o wysokiej wadze treści. <code>&lt;b&gt;</code> to wyłącznie efekt wizualny.
    </div>
  </data-quiz>
</data-gate>

---

## 📝 Inne przydatne tagi śródtekstowe

Artykuł techniczny rzadko składa się wyłącznie z akapitów. HTML oferuje tagi dopasowane do specyficznych rodzajów informacji.

### 💬 <code>&lt;blockquote&gt;</code> i <code>&lt;cite&gt;</code> dla cytatów

Znacznik <strong>**`<blockquote>`**</strong> służy do oznaczania *dłuższych cytatów blokowych*. Zazwyczaj w jego stopce (oznaczonej tagiem <strong>**`<footer>`**</strong>) podajemy źródło cytatu za pomocą znacznika <strong>**`<cite>`**</strong>. W strukturze HTML należy odróżnić znacznik `<cite>` od atrybutu `cite`. Atrybut ten (dodawany do elementu `<blockquote>`) jest <strong>**_całkowicie niewidoczny dla czytelnika_**</strong> i ignorowany przez wyszukiwarki pod kątem pozycjonowania (SEO), przez co w praktyce nie ma potrzeby jego stosowania. Prawidłowym podejściem jest użycie samego elementu `<cite>` i zagnieżdżenie w nim standardowego linku `<a>` prowadzącego do źródła:

```html
<!-- NAJLEPSZA PRAKTYKA: Klikalny odnośnik dla ludzi oraz poprawna semantyka dla wyszukiwarek -->
<blockquote>
    <p>Treść powinna być dostępna dla każdego użytkownika.</p>
    <footer>
        Źródło: <cite><a href="https://www.w3.org/WAI/WCAG21/Understanding/">Web Content Accessibility Guidelines (WCAG) 2.1</a></cite>
    </footer>
</blockquote>
```

`<cite>` podobnie jak `<i>` oraz `<em>` renderuje się jako *kursywa*:

![Porównanie tagów cite, i oraz em](/public/courses/web-frontend/Images/porównanie-cite-i-em-oraz-przedstawienie-wszystkie-3-rendery.png)



---

### 💻 Tagi <code>&lt;code&gt;</code> i <code>&lt;pre&gt;</code> dla kodu

Przeglądarki internetowe domyślnie ignorują dodatkowe spacje oraz znaki nowej linii w kodzie HTML. Łączą je w jedną spację. Przy zwykłym tekście to pomaga. Przy kodzie programistycznym jest to jednak <strong>**_poważny problem_**</strong>, ponieważ wcięcia i struktura linii decydują o czytelności.

Rozwiązaniem jest połączenie dwóch tagów.

- **1. Warstwa semantyczna:** Tag `<code>` informuje przeglądarki, czytniki ekranu oraz roboty sieciowe, że dany fragment to kod źródłowy. Sam w sobie nie zachowuje jednak wcięć.
- **2. Warstwa prezentacyjna:** Tag `<pre>` oznacza tekst preformatowany (ang. *preformatted text*). Nakazuje przeglądarce renderować tekst dokładnie tak, jak został wpisany w edytorze kodu. Zachowuje każdy znak nowej linii oraz każdą spację.

Połączenie <code>&lt;pre&gt;</code> oraz <code>&lt;code&gt;</code> jest najbardziej naturalnym sposobem na prezentację bloków kodu:

```html
<p>Metoda <code>querySelector()</code> zwraca pierwszy pasujący element.</p>

<pre><code>function hello(name) {
    return "Cześć, " + name;
}
</code></pre>
```

Dzięki temu kod zachowuje _**idealną strukturę**_ i czytelność. Jest jednocześnie w pełni zrozumiały dla maszyn analizujących naszą stronę.

> [!WARNING]
> Przeglądarki internetowe nie kolorują automatycznie kodu umieszczonego w tagach `<code>`. Jeśli chcesz uzyskać wielokolorowe podświetlanie składni (takie jak w edytorach kodu), musisz zastosować zewnętrzne biblioteki JavaScript (np. `highlight.js` czy `Prism.js`) lub ręcznie otoczyć słowa kluczowe znacznikami `<span>` (które działają jak bezużyteczne semantycznie, liniowe kontenery przeznaczone do stylowania tekstu wewnątrz zdania).

---

### 🏷️ Znacznik <code>&lt;span&gt;</code> (Kontener liniowy)

W poprzedniej lekcji poznałeś znacznik `<div>`, który służy jako uniwersalne pudełko blokowe do grupowania elementów. W tekście jego odpowiednikiem jest znacznik `<span>`.

To element **czysto strukturalny i liniowy** (ang. *inline*). Oznacza to dwie rzeczy:
* Nie posiada żadnego znaczenia semantycznego (nie informuje maszyn o ważności czy typie tekstu).
* Domyślnie nie zmienia wyglądu tekstu (nie pogrubia go ani nie przenosi do nowej linii).

Stosujemy go wyłącznie wtedy, gdy chcemy wydzielić pojedyncze słowo lub fragment zdania, aby w przyszłości móc nadać mu specyficzny styl graficzny (np. zmienić kolor tekstu).

```html
<p>
    W tym zdaniu słowo <span>czerwony</span> ma zachować swój domyślny wygląd, 
    dopóki nie zmienimy jego stylu.
</p>
```

Stanowi to idealne dopełnienie dla tagu `<div>` – `<div>` grupuje całe akapity i sekcje, a `<span>` działa wyłącznie wewnątrz linii tekstu.

---

### 📅 <code>&lt;time&gt;</code> czyli data dla maszyny

W artykule data publikacji może wyglądać po ludzku:

```html
<p>Artykuł opublikowany: <time datetime="2024-01-15">15 stycznia 2024</time></p>
```

Tekst „$15$ stycznia $2024$” jest dla czytelnika. Wartość `2024-01-15` jest dla maszyny.

Format `datetime` korzysta ze standardu _**ISO 8601**_. Najpierw zapisujesz rok, potem miesiąc, potem dzień.

> [!NOTE]
> _**ISO 8601**_ w HTML-u nie oznacza, że użytkownik ma widzieć datę w takim zapisie.
> To format techniczny dla przeglądarek, robotów, wyszukiwarek, kalendarzy i modeli językowych.
> W Polsce naturalny tekst to zwykle „$15$ stycznia $2024$” albo „$15.01.2024$”, ale w atrybucie `datetime` nadal zapisujesz `2024-01-15`.

Przykłady:

- **Pełna data**: `2024-01-15`.
- **Miesiąc**: `2013-01`.
- **Rok**: `2019`.
- **Godzina**: `14:30`.
- **Data i godzina**: `2024-01-15T14:30` (połączone literą `T`).
Zakres dat, taki jak `2024-01-01/2024-12-31`, wygląda jak ISO 8601, ale nie jest dobrym przykładem dla pojedynczego elementu `<time>`. Jeśli opisujesz przedział, zwykle bezpieczniej użyć dwóch elementów `<time>`:

```html
<p>
    Kurs trwa od <time datetime="2024-01-01">1 stycznia 2024</time>
    do <time datetime="2024-12-31">31 grudnia 2024</time>.
</p>
```

Formaty zapisu dat różnią się w zależności od kraju (np. w Polsce stosuje się układ dzień, miesiąc, rok, a w USA miesiąc, dzień, rok). Poniższa mapa pokazuje te różnice na świecie. Właśnie dlatego maszyna potrzebuje jednego, ustandaryzowanego formatu ISO 8601 w atrybucie `datetime`, niezależnie od tego, jak prezentujemy datę użytkownikowi.

![Mapa świata przedstawiająca regionalne formaty zapisu dat.](/public/courses/web-frontend/Images/date-format-map.svg)

> PS. Otwórz ten obraz w nowej karcie, a po najechaniu na niego myszką zobaczysz dymek z nazwą kraju oraz formatem zapisu daty w nim stosowanym. 😉

```html
<p>Facebook uruchomił wersję <code>.onion</code> w
    <time datetime="2014">2014</time> roku.</p>

<p>Spotkanie odbędzie się o
    <time datetime="14:30">wpół do trzeciej</time>.</p>

<p>BBC udostępniło mirror w sieci Tor w
    <time datetime="2019">2019</time> roku.</p>
```

> [!WARNING]
> Zapis daty w elemencie `<time>` z niejednoznacznym lub niepasującym atrybutem `datetime` (np. `datetime="1990"` dla tekstu "lat $90$.") jest **martwy semantycznie**, ponieważ parsery i roboty sieciowe nie będą w stanie poprawnie zinterpretować takiego zapisu. Pamiętaj, że <code>&lt;time&gt;</code> ma sens **tylko wtedy, gdy data jest w pełni jednoznaczna** i poprawnie sformatowana według standardu ISO 8601.

```html
<!-- Niepoprawnie: „lata 90.” to opis epoki, nie jedna data -->
<p>Projekt powstał w <time datetime="1990">latach 90.</time></p>
```

Taki zapis jest <strong>błędny semantycznie</strong>. Kod mówi „$1990$”, ale tekst mówi „cała dekada”.


### 🔤 <code>&lt;abbr&gt;</code> czyli skrót z kontekstem

<strong class="tag-stamp tag-stamp--dead">Martwa semantyka (abbr)</strong>

Tag `<abbr>` (skrót od *abbreviation*) miał w teorii służyć do oznaczania skrótów i akronimów. W praktyce jest to jednak **_znacznik martwy_**. Współczesne wyszukiwarki (SEO), modele językowe (AI) oraz czytniki ekranu całkowicie go ignorują, a domyślny atrybut `title` wywołujący dymek podpowiedzi stwarza ogromne bariery dostępności.

> [!NOTE]
> Atrybut `title` jest atrybutem globalnym. Oznacza to, że możesz dodać go do dowolnego znacznika w HTML. Przeglądarki graficzne wyświetlają jego wartość w formie prostego dymku (ang. *tooltip*) po najechaniu myszką.

#### Dlaczego ten tag i dymek <code>title</code> to ślepa uliczka?

Ukrywanie pełnego wyjaśnienia skrótu w atrybucie `title` to zła praktyka. Dymek ten nie wyświetla się na urządzeniach mobilnych (brak kursora myszy), nie pojawia się przy nawigacji za pomocą klawisza <kbd>Tab</kbd>, a czytniki ekranu domyślnie go ignorują, odczytując sam skrót (np. *„<abbr title="Content Management System">CMS</abbr>”* jako litery C, M, S) na podstawie własnych mechanizmów analizy wielkich liter.

```html
<!-- BŁĘDNIE: Użytkownicy mobilni, klawiaturowi oraz roboty sieciowe nie dowiedzą się, co oznacza skrót CMS -->
<p>
    System <abbr title="Content Management System">CMS</abbr>
    zarządza treścią w panelu administracyjnym.
</p>
```

---

## 🖼️ Obrazy w HTML: znacznik <code>&lt;img&gt;</code>

Do osadzania plików graficznych na stronie służy znacznik `<img src="...">`.

Zgodnie ze standardem **HTML5** poprawna deklaracja grafiki wymaga zdefiniowania wymiarów *`width`* i *`height`* w pikselach (bez jednostki `px`). Pozwala to przeglądarce zarezerwować odpowiedni obszar w układzie strony przed pobraniem pliku. Zapobiega to **skokom układu strony** (ang. *Layout Shift*, efekt rwania stony podczas ładowania).

Dla poprawy wydajności stosujemy atrybut **`loading="lazy"`** (tzw. *lazy loading*). Opóźnia on pobieranie grafiki do momentu zbliżenia się do niej przez użytkownika podczas przewijania. Dodatkowo pozwala na przekierowanie piorytetu pobrania najpierw plików `html`, `css` i `js`.

### 🏷️ Tekst alternatywny: atrybut <code>alt</code>

Każdy znacznik `<img>` musi posiadać atrybut **`alt`** (ang. *alternative text*). <strong>Brak tego atrybutu to kardynalny błąd dostępności</strong>.

Tekst alternatywny pełni trzy kluczowe funkcje:
- **Dla dostępności:** Czytniki ekranu (np. NVDA) odczytują wartość `alt` osobom niewidomym. Bez tego atrybutu program  wygeneruje irytujący i rozpraszający komunikat o grafice bez etykiety.
- **Dla wyszukiwarek (SEO):** Roboty sieciowe analizują `alt`, aby sklasyfikować tematykę obrazu w wynikach wyszukiwania.
- **Jako fallback:** Jeśli plik graficzny nie załaduje się z powodu błędu połączenia, przeglądarka wyświetli w jego miejscu tekst alternatywny.

Wartość atrybutu `alt` dobieramy na podstawie kontekstu grafiki na stronie:

| Rola grafiki | Rekomendowana wartość `alt` | Opis zachowania |
| :--- | :--- | :--- |
| **Grafika dekoracyjna** (np. ozdobna linia) | `alt=""` (pusty atrybut) | Czytnik ekranu całkowicie ją zignoruje. Ozdobniki CSS nie używają `<img>`. |
| **Link graficzny** (np. logo jako odnośnik) | `alt="Strona główna"` | Opisuje cel i kierunek odnośnika, a nie wygląd logotypu. |
| **Zdjęcie produktowe w katalogu** | `alt=""` (pusty atrybut) | Jeśli obok znajduje się widoczny tytuł produktu, pusty `alt` zapobiega redundancji. |
| **Zdjęcie detalu na karcie produktu** | `alt="Zbliżenie na boczne porty USB-C smartfona"` | Opisuje unikalny szczegół, którego brakuje w opisie karty produktu. |

## 🗃️ Konteneryzacja semantyczna: znacznik <code>&lt;figure&gt;</code> i <code>&lt;figcaption&gt;</code>

Standard **WHATWG HTML Living Standard** wprowadza element **`<figure>`** jako kontener na **treść samodzielną** (ang. *self-contained*). Reprezentuje on grupę elementów, którą można wyciąć z głównego tekstu i przenieść w inne miejsce w dokumencie (np. do załącznika na końcu) bez zaburzania logicznej struktury lekcji.

> Znacznik `<figure>` nie jest przypisany wyłącznie do obrazków. Może grupować również fragmenty kodu źródłowego, wykresy i schematy.

Do podpisywania zawartości kontenera służy tag **`<figcaption>`**. Musi on być bezpośrednim dzieckiem elementu `<figure>` (jako pierwszy lub ostatni znacznik).

Zgodnie z wytycznymi [W3C Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/tutorials/images/complex/), przy parowaniu tych elementów precyzyjnie rozdzielamy role opisów, aby uniknąć redundancji w syntezatorach mowy:

```html
<figure>
    <img src="images/architektura-sieci.png" width="640" height="360" loading="lazy" alt="Schemat architektury klient-serwer.">
    <figcaption>
        <strong>Schemat 1: Przepływ danych w architekturze aplikacji internetowej.</strong> 
        Żądanie HTTP wysłane z przeglądarki przechodzi przez zaporę sieciową (Firewall) i trafia do serwera aplikacji (Node.js), który odpytuje bazę danych SQL, a następnie zwraca odpowiedź.
    </figcaption>
</figure>
```

W powyższym kodzie zastosowaliśmy profesjonalny podział ról:
- **Szczegółowy opis techniczny** (droga zapytania przez firewall) znajduje się bezpośrednio w podpisie `<figcaption>`, dzięki czemu każdy uczeń ma do niego dostęp.
- **Atrybut `alt`** na obrazku służy wyłącznie do zwięzłej identyfikacji tematu grafiki, co zapobiega powielaniu wypowiedzi w czytnikach ekranu.

Zgodnie z wytycznymi **WCAG**, jeśli podpis `<figcaption>` całkowicie wyczerpuje opis grafiki, dopuszczalne jest pozostawienie pustego atrybutu `alt=""`. Całkowite pominięcie tego atrybutu (brak zapisu `alt` w kodzie) jest jednak błędem, ponieważ część starszych systemów odczyta wtedy nazwę pliku.

<data-gate>
  <data-quiz>
    <question>Na stronie sklepu internetowego umieszczasz zdjęcie produktu. Jaką wartość atrybutu `alt` zastosować dla fotografii czerwonych sneakersów Nike Air Max 270?</question>
    <options>
<item>

```html
alt=""
```

</item>
<item correct>

```html
alt="Czerwone buty sportowe Nike Air Max 270"
```

</item>
<item>

```html
alt="Zdjęcie produktu numer 4721"
```

</item>
<item>

```html
alt="Obrazek przedstawiający buty"
```

</item>
</options>
    <div data-hint="error">
      Zastanów się, co usłyszy osoba niewidoma. Opis powinien pozwolić jej podjąć świadomą decyzję o tym, co dokładnie znajduje się na zdjęciu produktu.
    </div>
    <div data-hint="success">
      Dobrze. Opisowy `alt` zastępuje wzrokowe postrzeganie zdjęcia. Powinien przekazać cechy kluczowe dla kontekstu strony.
    </div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **`<strong>` to nie pogrubienie, a `<em>` to nie kursywa**: Służą one do oznaczania wagi semantycznej oraz emfazy zdaniowej. Do celów czysto wizualnych stosujesz tagi `<b>` oraz `<i>`.
- **`<span>` to liniowy odpowiednik `<div>`**: Nie posiada znaczenia semantycznego. Służy wyłącznie do grupowania słów wewnątrz tekstu pod przyszłe stylowanie lub np. na potrzeby kolorowania kodu w `<code>`.
- **`<abbr>` i dymki `title` to martwa semantyka**: Współczesne wyszukiwarki, syntezatory mowy i systemy AI całkowicie je ignorują. Każdy skrót najlepiej i najbezpieczniej rozwijać wprost w zwykłym tekście (np. w nawiasie) przy jego pierwszym użyciu.
- **Brak `alt` to błąd i** **_„grafika bez etykiety”_**: Całkowity brak tego atrybutu sprawia, że czytniki ekranu zgłaszają komunikat o braku etykiety. Pusty `alt=""` rezerwujesz wyłącznie dla elementów czysto ozdobnych, które czytnik ma zignorować.
- **`<time>` wymaga formatu ISO 8601**: Atrybut `datetime` musi zawierać jednoznacznie i poprawnie sformatowaną datę, by roboty i parsery mogły ją bezbłędnie zinterpretować.




