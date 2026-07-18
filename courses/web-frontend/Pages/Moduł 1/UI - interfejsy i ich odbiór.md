# UI — Interfejsy i ich Odbiór

Przeglądarka to przestrzeń, w której użytkownik styka się z Twoim kodem. Jego mózg w ułamku sekundy ocenia układ ekranu – reaguje na światło, odległości i kolory. CSS pozwala Ci kontrolować tę pierwszą reakcję i zarządzać uwagą odbiorcy.

Jako deweloper budujesz drogę między człowiekiem a bazą danych. Jeśli ten układ będzie chaotyczny, użytkownik po prostu zamknie stronę. Dlatego przed napisaniem pierwszej reguły stylu warto poznać podstawy ludzkiej percepcji.

---

## 👁️ Psychologia Percepcji: Jak Mózg Oszczędza Energię

Ludzki mózg dąży do minimalizowania wydatku energii. Ewolucja zaprogramowała nas tak, by oszczędzać siły na przetwarzaniu bodźców z otoczenia. W kontekście projektowania oprogramowania ten wysiłek umysłowy nazywamy **obciążeniem poznawczym** (*cognitive load*). To całkowity nakład pracy, jaki użytkownik musi włożyć w odczytanie układu strony i wykonanie na niej zadania.

Obciążenie to dzielimy na trzy rodzaje:

- *Wysiłek wrodzony* (<i>intrinsic</i>) – wynika ze stopnia trudności samego tematu. Przykładem jest analiza skomplikowanego wykresu giełdowego. Deweloper ma na to minimalny wpływ.
- **_Wysiłek zewnętrzny_** (<i>extraneous</i>) – wynika ze złego sposobu prezentacji informacji. Powstaje przez nieczytelne czcionki, brak kontrastu czy chaos na stronie. Ten rodzaj obciążenia musisz zredukować do zera.
- **Wysiłek właściwy** (<i>germane</i>) – to energia potrzebna na przyswojenie wiedzy i zrozumienie logiki aplikacji. Dobry układ interfejsu ułatwia ten proces.

> Gdy zmuszasz czytelnika do domyślania się, gdzie ma kliknąć, jego mózg szybko się męczy. Wtedy użytkownik po prostu zamknie kartę.

## 🛠️ Punkt Kontrolny: Rodzaje obciążenia
<data-quiz>
    <question>Który rodzaj obciążenia poznawczego deweloper musi bezwzględnie zredukować do zera poprzez czytelny układ strony?</question>
    <options>
        <option>Wysiłek wrodzony (intrinsic)</option>
        <option correct>Wysiłek zewnętrzny (extraneous)</option>
        <option>Wysiłek właściwy (germane)</option>
    </options>
    <div data-hint="success">
        ✅ Zgadza się! Wysiłek zewnętrzny wynika bezpośrednio ze złej prezentacji informacji (np. chaosu wizualnego) i to deweloper odpowiada za jego eliminację.
    </div>
    <div data-hint="error">
        ❌ Niestety nie. Wysiłek ten wynika z chaotycznego układu i nieczytelnych elementów, na które deweloper ma bezpośredni wpływ. Spróbuj jeszcze raz.
    </div>
</data-quiz>

### 📐 Prawa Gestalt: Naturalne Porządkowanie Przestrzeni

Mózg automatycznie organizuje chaos w spójne grupy. Zasady te, znane jako prawa Gestalt, wynikają bezpośrednio z mechanizmów ewolucyjnych. Na ekranie komputera podświadomie grupujemy obiekty według tych samych reguł:

- **Zasada Bliskości** (*Proximity*) – elementy leżące blisko siebie postrzegamy jako powiązane logicznie. W projektowaniu interfejsów wdrażasz to za pomocą marginesów. Margines pod nagłówkiem sekcji musi być znacznie mniejszy niż margines nad nim.
<div aria-hidden="true" style="display: flex; background-color: var(--background-color); border: 3px solid var(--border-color); margin: -5px auto 20px; width: 300px; justify-content: center;">
<p style="display: flex; flex-direction: column; margin: 10px 20px; align-items: center;"><span style="margin-bottom: -10px;">[Grupa A]</span>
<span style="margin-bottom: -10px;">● ●  ● ●</span>
<span>● ●  ● ●</span>
</p>
<p style="display: flex; flex-direction: column; margin: 10px 20px; align-items: center;"><span style="margin-bottom: -10px;">
[Grupa B]</span>
<span style="margin-bottom: -10px;">● ●  ● ●</span>
<span>● ●  ● ●</span>
</p>
</div>

- **Zasada Podobieństwa** (*Similarity*) – obiekty o zbliżonym kształcie, kolorze lub rozmiarze traktujemy jako pełniące tę samą rolę. Przykładowo, zielony kolor przycisku akcji powinien konsekwentnie oznaczać zatwierdzenie.

<div aria-hidden="true" style="display: flex; background-color: var(--background-color); border: 3px solid var(--border-color); margin: -5px auto 20px; width: 300px; height:100px; justify-content: center;">
<span style="position: relative;bottom: 2px;left: 63px;transform: rotate(45deg);color: red;">◆</span> <span style="position: relative;bottom: 17px;left: 62px;transform: rotate(179deg);color: green;">▲</span> <span style="position: relative;bottom: -34px;left: 46px;transform: rotate(45deg);color: blue;">●</span> <span style="position: relative;bottom: -58px;left: 30px;transform: rotate(45deg);color: green;">▲</span>
<span style="position: relative;bottom: -64px;left: 24px;transform: rotate(45deg);color: red;">◆</span> <span style="position: relative;bottom: -32px;left: 72px;transform: rotate(269deg);color: green;">▲</span> <span style="position: relative;bottom: -44px;left: -12px;transform: rotate(55deg);color: red;">◆</span> <span style="position: relative;bottom: -18px;left: -7px;transform: rotate(45deg);color: green;">▲</span>
<span style="position: relative;bottom: -23px;left: -42px;transform: rotate(31deg);color: red;">◆</span> <span style="position: relative;bottom: -37px;left: -6px;transform: rotate(323deg);color: green;">▲</span> <span style="position: relative;bottom: -26px;left: -50px;transform: rotate(322deg);color: red;">◆</span> <span style="position: relative;bottom: 2px;left: -82px;transform: rotate(45deg);color: green;">▲</span>
</div>

- **Zasada Ciągłości** (*Continuity*) – wzrok woli podążać wzdłuż gładkich, nieprzerwanych linii. Ułożenie pól formularza wzdłuż jednej osi ułatwia szybkie skanowanie wzrokiem.

<div aria-hidden="true" style="display: flex; background-color: var(--background-color); border: 3px solid var(--border-color); margin: -5px auto 20px; width: 300px; height: 100px;flex-direction: column;align-items: center;justify-content: center;">
<p style="margin: 0;padding: 0;line-height: 1;">●</p>
<p style="margin: 0;padding: 0;line-height: 1;">●</p>
<p style="margin: 0;padding: 0;line-height: 1;">● ● ● ● ●</p>
<p style="margin: 0;padding: 0;line-height: 1;">●</p>
<p style="margin: 0;padding: 0;line-height: 1;">●</p>
</div>

- **Zasada Domknięcia** (*Closure*) – mózg dąży do postrzegania niepełnych kształtów jako całości. Wykorzystujemy to przy poziomym przewijaniu karuzeli produktów – lekkie przycięcie ostatniej karty informuje, że lista ciągnie się dalej.
<div aria-hidden="true" style="display: flex;background-color: var(--background-color);border: 3px solid var(--border-color);margin: -5px auto 20px;width: 300px;height: 100px;flex-direction: column;align-items: center;justify-content: center;padding-top: 9px;overflow: hidden;">
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
<p style="margin: 0;padding: 0;line-height: 1;">● ─── </p>
</div>

- **Zasada Wspólnego Losu** (*Common Fate*) – elementy poruszające się w tym samym kierunku i tempie uznajemy za grupę o wspólnej funkcji. Przykładem są spójnie rozwijające się panele menu harmonijkowego.
<div aria-hidden="true" style="display: flex;background-color: var(--background-color);border: 3px solid var(--border-color);margin: auto;width: 300px;height: 100px;flex-direction: column;align-items: center;justify-content: center;">
<p style="display: flex;justify-content: space-between;width: 200px;"><span>●➔  ●➔</span><span>(Grupa 1)</span></p>
<p style="display: flex;justify-content: space-between;width: 200px;
"><span>●➘  ●➘</span><span>(Grupa 2)</span></p>
</div>

## 🔗 Połącz Pary: Prawa percepcji
<data-connection-matcher title="Dopasuj Prawa Gestalt do ich praktycznych zastosowań w interfejsie">
    <div class="cmw-item" data-left="Zasada Bliskości" data-right="Mniejszy margines pod nagłówkiem sekcji niż nad nim."></div>
    <div class="cmw-item" data-left="Zasada Podobieństwa" data-right="Spójne używanie koloru zielonego dla przycisków potwierdzenia."></div>
    <div class="cmw-item" data-left="Zasada Domknięcia" data-right="Ucięcie ostatniego kafelka w poziomej karuzeli produktów."></div>
    <div class="cmw-item" data-left="Zasada Ciągłości" data-right="Ułożenie pól formularza wzdłuż jednej pionowej osi."></div>
</data-connection-matcher>

### ⚙️ Prawa Decyzyjne w HCI

Projektowanie interfejsów to nie tylko estetyka. Opiera się ono na psychologicznych i matematycznych zasadach interakcji człowieka z komputerem (*Human-Computer Interaction*, **HCI**). Te reguły pozwalają dostosować przestrzeń ekranu do ograniczeń naszego umysłu. Warto poznać trzy najważniejsze z nich:

-   _**Prawo Millera**_ mówi, że w pamięci krótkotrwałej potrafimy utrzymać jednocześnie tylko około $7$ ($+/-$ $2$) elementów. Z tego powodu menu nawigacyjne nie powinno wyświetlać 15 linków obok siebie. Zbyt rozbudowaną strukturę należy podzielić na kategorie lub ukryć rzadziej używane opcje, aby nie przeciążyć pamięci roboczej odbiorcy.

<div aria-hidden="true" style="display: flex; flex-direction: column; background-color: var(--background-color); border: 3px solid var(--border-color); margin: 10px auto 20px; width: 300px; padding: 12px; gap: 10px; font-size: 11px; align-items: center;">
  <div style="display: flex; flex-wrap: wrap; gap: 4px; border: 1px dashed red; padding: 6px; width: 100%; justify-content: center;">
    <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span> <span>[link]</span>
  </div>
  <div style="display: flex; gap: 10px; border: 1px dashed green; padding: 6px; width: 100%; justify-content: space-around;">
    <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;"><strong>Kat A</strong><span>[link]</span><span>[link]</span></div>
    <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;"><strong>Kat B</strong><span>[link]</span><span>[link]</span></div>
    <div style="display: flex; flex-direction: column; gap: 2px; align-items: center;"><strong>Kat C</strong><span>[link]</span><span>[link]</span></div>
  </div>
</div>

-   _**Prawo Hicka**_ określa czas potrzebny na podjęcie decyzji. Rośnie on wraz z liczbą i złożonością dostępnych opcji. Im więcej przycisków i linków użytkownik widzi jednocześnie, tym dłużej zwleka z wyborem. Dlatego rozbudowane formularze rejestracyjne dzieli się na kilka prostych kroków. Wyświetlenie $30$ pól na jednym ekranie po prostu zniechęci odbiorcę.

<div aria-hidden="true" style="display: flex; background-color: var(--background-color); border: 3px solid var(--border-color); margin: 10px auto 20px; width: 300px; padding: 12px; gap: 20px; font-size: 11px; justify-content: center;">
  <div style="border: 1px dashed red; padding: 6px; display: flex; flex-direction: column; gap: 4px; width: 45%; align-items: center;">
    <span>9 opcji na raz:</span>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;">
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
      <span style="border: 1px solid var(--border-color); padding: 1px; text-align: center;">■</span>
    </div>
  </div>
  <div style="border: 1px dashed green; padding: 6px; display: flex; flex-direction: column; gap: 4px; width: 45%; align-items: center; justify-content: center;">
    <span>Krok 1 z 2:</span>
    <div style="display: flex; gap: 6px;">
      <span style="border: 1px solid var(--border-color); padding: 2px 4px;">TAK</span>
      <span style="border: 1px solid var(--border-color); padding: 2px 4px;">NIE</span>
    </div>
  </div>
</div>

- _**Prawo Fittsa**_ – czas potrzebny na wskazanie celu zależy od jego odległości i rozmiaru. Im mniejszy i dalszy obiekt, tym trudniej w niego trafić. W projektowaniu mobilnym oznacza to, że <strong>**każdy** element klikalny musi mieć minimalny obszar interakcji wynoszący `48px` na `48px`</strong>. Nie musisz powiększać całego interfejsu, wystarczy zadbać o strefę interakcji z elementem. Przyciski o krytycznym znaczeniu biznesowym takie jak „Kup teraz” powinny być fizycznie większe, aby kusić do kliknięcia i skracać czas decyzji.

<div aria-hidden="true" style="display: flex; flex-direction: column; background-color: var(--background-color); border: 3px solid var(--border-color); margin: 10px auto 20px; width: 300px; padding: 12px; gap: 12px; font-size: 11px;">
  <!-- Zły układ -->
  <div style="border: 1px dashed red; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px; position: relative;">
    <div style="font-weight: bold; color: red; font-size: 10px; margin-bottom: 2px;">Źle (Trudny wybór i ryzyko błędu)</div>
    <span style="font-size: 9px; color: var(--text-muted);">Zapisz się do newslettera:</span>
    <input type="text" value="email@przyklad.com" disabled style="background: var(--input-bg-color, #1e1e1e); color: var(--text-color, #ffffff); border: 1px solid var(--border-color); padding: 4px; font-size: 9px; width: 100%; border-radius: 3px;" />
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
      <button disabled style="background: #ef4444; color: white; border: none; padding: 8px 12px; font-size: 10px; font-weight: bold; border-radius: 4px; cursor: not-allowed; width: 65%;">ANULUJ (Wielkie)</button>
      <button disabled style="background: #22c55e; color: white; border: none; padding: 2px 4px; font-size: 8px; border-radius: 2px; cursor: not-allowed;">Zapisz</button>
    </div>
  </div>

  <!-- Dobry układ -->
  <div style="border: 1px dashed green; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px; position: relative;">
    <div style="font-weight: bold; color: green; font-size: 10px; margin-bottom: 2px;">Dobrze (Intuicyjny i bezpieczny cel)</div>
    <span style="font-size: 9px; color: var(--text-muted);">Zapisz się do newslettera:</span>
    <input type="text" value="email@przyklad.com" disabled style="background: var(--input-bg-color, #1e1e1e); color: var(--text-color, #ffffff); border: 1px solid var(--border-color); padding: 4px; font-size: 9px; width: 100%; border-radius: 3px;" />
    <div style="display: flex; flex-direction: column; gap: 6px; align-items: center; margin-top: 4px; width: 100%;">
      <button disabled style="background: #22c55e; color: white; border: none; padding: 10px; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: not-allowed; width: 100%;">ZAPISZ SIĘ (Wielki cel)</button>
      <span style="font-size: 8px; color: var(--text-muted); cursor: not-allowed; text-decoration: underline;">pomiń ten krok</span>
    </div>
  </div>
</div>

### 👁️ Trajektorie Wzroku: Wzorce F oraz Z

Badania okulograficzne (eye-tracking) pokazują, że nie czytamy stron internetowych słowo w słowo jak tradycyjnej książki. Wzrok szybko skacze po ekranie w poszukiwaniu punktów zaczepienia. Projektanci wyróżniają dwa główne schematy tego ruchu:

Wzorzec **F** (*F-Shape Pattern*) dominuje na stronach z dużą ilością tekstu, takich jak blogi czy dokumentacje techniczne. Użytkownik najpierw czyta górną linijkę poziomo, potem schodzi niżej i wykonuje krótszy ruch w bok, a na koniec omiata wzrokiem lewą krawędź akapitów pionowo w dół. Jednolity blok tekstu bez nagłówków, pogrubień i list zostanie w większości zignorowany.

<div aria-hidden="true" style="display: flex; flex-direction: column; background-color: var(--background-color); border: 3px solid var(--border-color); margin: 10px auto 20px; width: 300px; padding: 12px; gap: 8px; font-size: 10px; position: relative;">
  
  <div style="font-weight: bold; border-bottom: 1px solid var(--border-color); padding-bottom: 4px; color: var(--text-muted);">Makieta artykułu (Wzorzec F)</div>
  <div style="position: relative; display: flex; flex-direction: column; gap: 6px; padding: 4px 0;">
    <div style="display: flex; align-items: center; gap: 6px;">
      <div style="background: #930000;height: 17px;width: 85%;border-radius: 2px;position: relative;">
        <span style="position: absolute;right: 4px;top: -1px;font-size: 9px;color: #ffffff;font-weight: bold;font-family: var(--font-family-verdana);">[1] Główny nagłówek</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; margin-top: 4px;">
      <div style="background: #935f00;height: 13px;width: 55%;border-radius: 2px;position: relative;">
        <span style="position: absolute;right: 4px;top: -1.5px;font-size: 8.5px;color: white;font-weight: bold;font-family: var(--font-family-verdana);">[2] Podtytuł</span>
      </div>
    </div>
    <div style="display: flex; gap: 6px; margin-top: 4px; position: relative;">
      <div style="background: gold;width: 19px;height: 42px;border-radius: 2px;position: relative;">
        <span style="position: absolute;bottom: 2px;left: 1px;font-size: 9px;color: black;font-weight: bold;font-family: var(--font-family-verdana);">[3]</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
        <div style="background: var(--border-color); height: 5px; width: 80%;"></div>
        <div style="background: var(--border-color); height: 5px; width: 75%;"></div>
        <div style="background: var(--border-color); height: 5px; width: 90%;"></div>
        <div style="background: var(--border-color); height: 5px; width: 40%;"></div>
      </div>
    </div>
  </div>
</div>

Wzorzec **Z** (*Z-Shape Pattern*) pojawia się na stronach wizualnych i powitalnych (landing pages), gdzie ilość tekstu jest minimalna. Wzrok porusza się od lewego górnego rogu (zazwyczaj logo) do prawego (przycisk nawigacji), schodzi po skosie do dolnego lewego narożnika, a na koniec przesuwa się w prawo. Najważniejszy element akcji (przycisk **CTA**) powinien znajdować się na końcu tej ścieżki.

<div aria-hidden="true" style="display: flex; flex-direction: column; background-color: var(--background-color); border: 3px solid var(--border-color); margin: 10px auto 20px; width: 300px; padding: 12px; gap: 8px; font-size: 10px; position: relative;">
  <!-- Top Bar (Header) -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; position: relative; z-index: 2;">
    <span style="font-weight: bold; background: var(--accent-color, #3b82f6); color: white; padding: 2px 6px; border-radius: 4px;">[1] LOGO</span>
    <span style="color: var(--text-muted); background: var(--bg-layer-3, #334155); padding: 2px 6px; border-radius: 4px;">[2] Nawigacja</span>
  </div>
  <!-- Content Area (Diagonal path) -->
  <div style="height: 65px; position: relative; z-index: 1; display: flex; justify-content: center; align-items: center;">
    <svg style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;"><defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill="orange"></polygon></marker></defs><line x1="240" y1="5" x2="40" y2="55" stroke="orange" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrowhead)"></line>
</svg>
<span style="font-size: 9px; color: var(--text-muted); text-align: center; max-width: 60%; line-height: 1.2;">Skanowanie nagłówka i grafik po skosie</span>
</div>
<div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 6px; position: relative; z-index: 2;">
    <span style="color: var(--text-muted)">[3] Informacje pomocnicze</span>
    <span style="background: green; color: white; padding: 4px 8px; font-weight: bold; border-radius: 4px;">[4] PRZYCISK CTA ➔</span>
  </div>
</div>

> [!NOTE]
> Przycisk **CTA** (*Call To Action*) powinien znajdować się na końcu ścieżki wzroku. Jest to element, który ma skłonić użytkownika do podjęcia określonej akcji, np. zakupu produktu, zapisania się do newslettera czy wypełnienia formularza.

## 🔗 Połącz Pary: Prawa HCI i trajektorie wzroku
<data-connection-matcher title="Dopasuj Prawa HCI oraz wzorce wzrokowe do ich charakterystyki">
    <div class="cmw-item" data-left="Prawo Millera" data-right="Podział 15 linków w menu na 3 logiczne grupy."></div>
    <div class="cmw-item" data-left="Prawo Hicka" data-right="Podział długiego formularza rejestracji na 3 mniejsze kroki."></div>
    <div class="cmw-item" data-left="Prawo Fittsa" data-right="Powiększenie przycisku Kup Teraz i umieszczenie go w zasięgu kciuka."></div>
    <div class="cmw-item" data-left="Wzorzec F" data-right="Skanowanie długiego artykułu głównie po jego lewej krawędzi."></div>
    <div class="cmw-item" data-left="Wzorzec Z" data-right="Ruch wzroku po skosie od prawego górnego rogu do dolnej sekcji strony."></div>
</data-connection-matcher>

---

## 🏛️ Ewolucja Estetyki: Cyfrowe Mosty i Trójwymiarowa Przestrzeń

Przejście od tradycyjnych, fizycznych narzędzi do wirtualnych interfejsów wymagało rewolucji w naszej percepcji. Aby użytkownicy mogli intuicyjnie korzystać z komputerów, projektanci musieli zbudować pomosty łączące świat fizyczny z cyfrowym. Ta historia to ciągłe poszukiwanie równowagi między naśladowaniem rzeczywistości a czystą funkcjonalnością:

-   *Skeuomorfizm* to dosłowne naśladowanie fizycznych materiałów i właściwości w przestrzeni ekranu.
-   *Flat Design* (płaski design) to skrajna redukcja trójwymiarowości na rzecz czystej geometrii i kolorów.
-   _**Semi-Flat & Elewacja**_ to nowoczesny kompromis warstwowości i cieni ułatwiający orientację przestrzenną.

### 🗃️ Era Skeuomorfizmu: Fizyczny Świat wewnątrz Ekranu

Przez pierwsze dwie dekady powszechnego internetu na ekranach panował skeuomorfizm. Nurt ten polegał na wiernym kopiowaniu tekstur, cieni i fizyki przedmiotów z codziennego życia.

Przyciski na stronach miały wyraźny połysk, trójwymiarową wypukłość i głębokie cienie. Miało to sugerować, że element można fizycznie wcisnąć. Aplikacje na telefonach wyglądały jak małe przedmioty leżące na biurku. Dyktafon udawał magnetofon szpulowy z metalowymi klawiszami, kalendarz miał fakturę przeszywanej skóry, a aplikacja do czytania prezentowała wirtualne, drewniane półki na książki.

Skeuomorfizm nie powstał z braku wyobraźni projektantów. Pełnił ważną rolę edukacyjną. W czasach, gdy ekrany dotykowe były nowością, nasz mózg potrzebował wskazówek z fizycznego świata. Te wizualne podpowiedzi nazywamy **afordancjami** (*affordances*). Widząc cień pod przyciskiem, podświadomie rozumiałeś, że ten element zareaguje na kliknięcie. Widząc ikonę papierowego kosza na śmieci, od razu wiedziałeś, gdzie lądują usuwane pliki.

<iframe src="/public/resources/web-site-preview/skeuomorficzny.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu skeuomorficznego na przykładowej stronie" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 🗺️ Flat Design: Brutalne Spłaszczenie i jego Konsekwencje

Gdy użytkownicy nauczyli się już obsługiwać ekrany, skeuomorfizm zaczął ciążyć. Tekstury skóry, drewna i metalu stały się wizualnym szumem, który odciągał uwagę od samej treści strony. W okolicach <time datetime="2013">$2013$</time> roku nadeszła radykalna reakcja. Czyli Flat Design (płaski design), którego symbolem stały się systemy Windows 8 oraz iOS 7.

Projektanci odrzucili wszelkie cienie, gradienty, zaokrąglenia i faktury. Interfejsy stały się płaskimi plakatami graficznymi złożonymi z czystych kafelków, jaskrawych kolorów i minimalistycznej typografii. Wszystko miało być cyfrowe, bez udawania fizycznego świata.

Nurt ten popadł jednak w skrajność. Przez całkowite usunięcie cieni i głębi interfejsy straciły czytelność. Użytkownicy zaczęli gubić się na stronach. Przyciski wyglądały tak samo jak zwykłe nagłówki czy bloki tekstowe. Brak wskazówek przestrzennych sprawił, że interfejsy stały się trudne w obsłudze.

Usunięcie głębi doprowadziło do zjawiska zwanego _**mystery meat navigation**_ (dosł. nawigacja po tajemniczym mięsie 😧) Trzeba było klikać na oślep w losowe napisy, aby sprawdzić, co jest linkiem. Sklepy internetowe odnotowały wtedy drastyczne spadki sprzedaży, ponieważ klienci nie potrafili znaleźć koszyka zakupowego ani przycisku finalizacji płatności.

<iframe src="/public/resources/web-site-preview/flat-design.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu Flat Design i interaktywna symulacja zakupów" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### ⚖️ Współczesny Kompromis: Warstwy, Cienie i Światło

Dzisiejsze interfejsy to dojrzałe podsumowanie obu tych skrajności. Współczesny web design nie naśladuje już drewna i metalu, ale nie zmusza nas też do patrzenia na idealnie płaski świat. Zamiast tego traktujemy ekran jak przestrzeń architektoniczną.

Głównym narzędziem projektanta stały się cienie i **elewacja** (*elevation*). Elementy na stronie są czyste i płaskie, ale leżą na różnych wysokościach względem tła. Karty produktów, okna modalne czy panele boczne rzucają delikatne, rozproszone cienie. Dzięki temu mózg natychmiast rozumie, że element położony „wyżej” (rzucający większy cień) jest ważniejszy, interaktywny i leży nad treścią pod spodem. Ta hierarchia przestrzenna, którą w kodzie kontrolujemy za pomocą osi `z-index`, pozwala oczom błyskawicznie uporządkować strukturę strony.

Projektanci chętnie stosują również efekty takie jak **glassmorphism**, czyli symulację matowego, półprzezroczystego szkła. Pozwala to na wyświetlanie okien dialogowych bez całkowitego odcinania użytkownika od kontekstu strony pod spodem. Mózg widzi rozmyte kształty w tle i wie, gdzie się znajduje, co zmniejsza dezorientację przestrzenną.

<iframe src="/public/resources/web-site-preview/material.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu semi-flat / Material Design z warstwami i cieniami" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

## 🎨 Estetyka jako Język Emocji i Tożsamości

Za pomocą CSS decydujesz o charakterze i wyrazie swojej strony. Estetyka to nie tylko wygląd. To komunikat o tym, kogo chcesz przyciągnąć, jak bardzo profesjonalnie chcesz brzmieć i jakie emocje chcesz wywołać w użytkowniku.

### 📐 Minimalizm: Cisza Wizualna i Redukcja Szumu

Minimalizm to domyślny styl nowoczesnego biznesu, systemów bankowych i narzędzi pracy typu **SaaS** (*Software as a Service*). Wywodzi się bezpośrednio z założeń niemieckiej szkoły Bauhaus oraz szwajcarskiego projektowania modernistycznego.

W minimalizmie głównym elementem projektu staje się **wolna przestrzeń** (tzw. *whitespace* lub *negative space*) oraz rygorystycznie dobierana typografia. Zamiast ilustracji, ozdobnych grafik i zbędnych linii dekoracyjnych, to krój pisma, jego grubość i czyste odległości między elementami budują cały interfejs.

Projektując minimalistycznie, skracasz czas potrzebny na wykonanie zadania. Minimalizm wysyła jasny komunikat: „Twój czas i Twoje dane są tutaj najważniejsze, dlatego usunęliśmy wszystko, co mogłoby Cię rozpraszać”. Nurt ten wymaga jednak ogromnej precyzji. Przy braku ozdobników każdy błąd – nawet przesunięcie marginesu o dwa piksele – staje się od razu widoczny.

<iframe src="/public/resources/web-site-preview/minimalizm.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu minimalistycznego opartego o wolną przestrzeń i typografię" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 🧱 Brutalizm: Surowy Głos Autentyczności

Brutalizm to bezkompromisowa reakcja na sterylną, powtarzalną estetykę korporacyjnych stron. Nazwa tego nurtu nawiązuje do architektury opartej na surowym, nieobrobionym betonie (*béton brut*) oraz do wczesnego, dzikiego wyglądu internetu z lat dziewięćdziesiątych.

Strona brutalistyczna celowo odrzuca ugrzecznione zasady współczesnego projektowania. Zamiast zaokrągleń i miękkich cieni otrzymujesz tu grube, czarne obramowania o szerokości kilku pikseli. Kolory są jaskrawe i podstawowe, wyjęte prosto z domyślnej palety systemowej. Czcionki często mają stałą szerokość znaków (*monospace*), co kojarzy się z pisaniem kodu bezpośrednio w terminalu. Układ elementów celowo ignoruje symetrię siatki, sprawiając wrażenie niedokończonego lub wręcz topornego.

Popularność brutalizmu wynika z jego autentyczności. Pokazuje, że strona została napisana czystym, surowym kodem przez człowieka o wyrazistej tożsamości, a nie wygenerowana z gotowego szablonu marketingowego. Brutalizm doskonale sprawdza się na stronach artystów, festiwali, niezależnych projektów oraz w portfolio programistów, którzy chcą podkreślić swój charakter i techniczną niezależność.

<iframe src="/public/resources/web-site-preview/brutalizm.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu brutalistycznego z surowymi ramkami i kontrastową kolorystyką" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 🦾 Cyberpunk i Neon-Futurism: Świat Maszyn i Nocy

Cyberpunk i neonowy futuryzm nawiązują do świata zaawansowanej technologii, dystopijnej przyszłości i cyfrowego podziemia. Styl ten opiera się na koncepcji technologii bliskiej człowiekowi, ale też surowej i bezwzględnej.

Głównym motywem są tutaj głębokie czernie i ciemnoszare tła, które naśladują ekrany wojskowych konsol diagnostycznych lub klimat nocnego miasta. Akcenty kolorystyczne to wyłącznie jaskrawe, świecące neony: 

<div style="
    background-color: #05050a;
    width: fit-content;
    padding: 10px 25px 10px 10px;
    border: 2px solid #ff007f;
    box-shadow: 0 0 10px rgba(255, 0, 127, 0.4);
    margin: 10px 0;
">
<ul style="
    list-style: square;
    margin-left: 15px;
    font-family: monospace;
">
<li style="color: #00f2fe; text-shadow: 0 0 8px #00f2fe; font-weight: bold; margin-bottom: 4px;">magnetyczny cyjan</li>
<li style="color: #ff007f; text-shadow: 0 0 8px #ff007f; font-weight: bold; margin-bottom: 4px;">agresywna magenta</li>
<li style="color: #39ff14; text-shadow: 0 0 8px #39ff14; font-weight: bold;">toksyczna zieleń</li>
</ul>
</div>

Elementy interfejsu często otoczone są delikatnymi, rozświetlonymi poświatami (*neon glow*), a całe tło przecinają cienkie linie pomocnicze, siatki gridów oraz drobne znaczniki przypominające celowniki lub wykresy.

Ten styl natychmiast buduje atmosferę zaawansowania technicznego i cyfrowej dominacji. Jest to świetny wybór dla systemów monitorowania sieci, gier przeglądarkowych, paneli administratorskich oraz stron powiązanych z cyberbezpieczeństwem.

<iframe src="/public/resources/web-site-preview/cyberpunk.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Wizualna prezentacja stylu cyberpunkowego z neonowymi akcentami" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

---

## 🎮 UI jako Narzędzie Immersji: Lekcje z Gier Wideo

Gry wideo to najbardziej rozwinięty obszar projektowania interfejsów. Tam _**UI**_ (*User Interface*) nie służy tylko do suchego przekazywania danych. Jego głównym celem jest wciągnięcie gracza w wirtualny świat, aby zapomniał o istnieniu monitora. Sposób, w jaki twórcy gier zarządzają uwagą, uczy nas budowania emocji za pomocą układów graficznych.

W projektowaniu gier interfejsy dzielimy na cztery główne kategorie:

- _**Diegetyczne**_ (*diegetic*) – elementy, które fizycznie istnieją w świecie gry. Postać w grze widzi je i słyszy dokładnie tak samo jak gracz.
- _**Niediegetyczne**_ (*non-diegetic*) – klasyczne paski zdrowia i liczniki nałożone płasko na ekran tzw. **HUD** (*Head-Up Display*). Postać w grze nie ma pojęcia o ich istnieniu.
- _**Przestrzenne**_ (*spatial*) – informacje wyświetlane w przestrzeni trójwymiarowej gry (np. strzałki nawigacji na asfalcie), ale niebędące fizycznymi obiektami. Postać ich nie widzi.
- _**Meta**_ (*meta UI*) – elementy nałożone na ekran, które naśladują stan bohatera (np. plamy krwi na ekranie przy braku zdrowia).

### 🎒 Interfejs Diegetyczny: Kiedy Ekran Znika

Interfejs diegetyczny stanowi szczyt budowania klimatu. Każdy element informacyjny jest częścią wirtualnego świata, a bohater wchodzi z nim w interakcję w czasie rzeczywistym.

Absolutnym wzorem takiego podejścia jest seria horrorów *Dead Space*. Twórcy całkowicie zrezygnowali z tradycyjnych pasków zdrowia czy liczników amunicji w rogach monitora. Poziom zdrowia bohatera, Isaaca Clarke'a, wyświetla się jako świecący pasek wbudowany bezpośrednio w kręgosłup kombinezonu. Poziom tlenu w próżni pokazuje się na plecach, a licznik pozostałych naboi to mały hologram wyświetlany bezpośrednio nad celownikiem broni.

Kiedy otwierasz ekwipunek, przed twarzą bohatera pojawia się fizyczny hologram. Co najważniejsze, gra nie zatrzymuje się wtedy. Bohater patrzy na ten hologram w czasie rzeczywistym, a gracz wraz z nim. Jeśli z ciemnego korytarza wyskoczy przeciwnik, trzeba walczyć, mając wciąż otwarte okno przedmiotów. Brak sztucznych ramek sprawia, że lęk przed zagrożeniem staje się namacalny.

<iframe src="/public/resources/web-site-preview/dead-space.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Prezentacja diegetycznego interfejsu z gry Dead Space zintegrowanego z kombinezonem" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 📟 Pip-Boy w Fallout: Fizyczność Informacji

W serii *Fallout* interfejs statystyk, mapy i zadań został zaprojektowany jako fizyczne urządzenie *Pip-Boy 3000*. Jest to masywny komputer naręczny noszony przez bohatera.

Kiedy otwiera się menu, postać podnosi rękę przed twarz. Gracz patrzy wtedy na zakrzywiony, monochromatyczny ekran kineskopowy. Widoczne są poziome linie odświeżania zielonego fosforu, delikatne migotanie światła przy przełączaniu zakładek oraz słychać mechaniczne kliknięcia starych przełączników.

Twórcy gry wzięli nudną bazę danych (listę przedmiotów i statystyk) i zamienili ją w fizyczny przedmiot. Ten interfejs nie jest idealnie czysty i przezroczysty. Jest toporny, ciężki i mechaniczny. Dzięki temu doskonale buduje atmosferę postapokaliptycznego świata, w którym technologia zatrzymała się w latach pięćdziesiątych ubiegłego wieku.

<iframe src="/public/resources/web-site-preview/pip-boy 3000.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Prezentacja fizycznego urządzenia Pip-Boy z serii Fallout" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### 🎸 Persona 5: UI jako Serce Stylu

Studio Atlus przy projektowaniu gry *Persona 5* wybrało inną drogę. Zamiast ukrywać interfejs w świecie gry, uczyniło z niego główną atrakcję i wizualny motor napędowy całego tytułu.

Interfejs w tej grze jest agresywny, dynamiczny i buntowniczy. Dominują w nim trzy kontrastowe kolory: głęboka czerń, czysta biel i krzykliwa czerwień. Przyciski menu nie leżą na prostej, nudnej siatce. Są porozrzucane pod różnymi kątami, zniekształcone i przypominające wycinki z anarchistycznych gazet lub punkowe plakaty z lat osiemdziesiątych. Każde przełączenie ekranu to płynna animacja, w której sylwetki postaci przecinają przestrzeń.

Ten interfejs krzyczy przy każdym ruchu. Buduje tempo rozgrywki, podnosi tętno gracza i sprawia, że nawet proste wybieranie opcji w walce daje ogromną satysfakcję. Udowadnia to, że interfejs użytkownika może być samodzielnym dziełem sztuki.

<iframe src="/public/resources/web-site-preview/persona-5.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Prezentacja dynamicznego i agresywnego interfejsu z gry Persona 5" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

### ✍️ Disco Elysium: Melancholia Tekstu

Użyta w tej grze typografia, stonowane kolory (beże, brązy, czernie) i akwarelowe portrety postaci w tle tworzą melancholijny i refleksyjny nastrój. Interfejs nie rywalizuje z opowiadaną historią, lecz staje się jej fizyczną formą. Wpływa to na to, jak gracz czyta dialogi – wolniej, z większym skupieniem, chłonąc każde słowo niczym w klasycznej powieści kryminalnej.


<iframe src="/public/resources/web-site-preview/disco-elysium.html" width="600" height="1100" style="border: 3px solid #ccc;width: 100%;" title="Prezentacja tekstopisarstwa i melancholijnego interfejsu z gry Disco Elysium" sandbox="allow-same-origin allow-scripts" referrerpolicy="strict-origin-when-cross-origin" loading="lazy"></iframe>

## 🔗 Połącz Pary: Kierunki w projektowaniu i rodzaje interfejsów
<data-connection-matcher title="Dopasuj style estetyczne i rodzaje interfejsów do ich opisu">
    <div class="cmw-item" data-left="Skeuomorfizm" data-right="Dosłowne naśladowanie faktury skóry, drewna oraz głębokich cieni fizycznych przycisków."></div>
    <div class="cmw-item" data-left="Flat Design" data-right="Całkowite usunięcie cieni i gradientów, co może prowadzić do zjawiska mystery meat navigation."></div>
    <div class="cmw-item" data-left="Elewacja (Material)" data-right="Traktowanie ekranu jako warstwowej przestrzeni architektonicznej z cieniem o różnej wielkości."></div>
    <div class="cmw-item" data-left="Brutalizm" data-right="Surowy styl z grubymi czarnymi ramkami, czcionkami o stałej szerokości i jaskrawymi barwami systemowymi."></div>
    <div class="cmw-item" data-left="Cyberpunk" data-right="Dominacja czerni i ciemnoszarych teł przecinanych liniami gridu oraz neonowymi kolorami z poświatą."></div>
    <div class="cmw-item" data-left="Interfejs diegetyczny" data-right="Ręczny detektor ruchu, na który postać musi fizycznie spojrzeć, rozmywając widok na otoczenie."></div>
</data-connection-matcher>

---

## 🌊 Skąd pochodzi CSS i dlaczego to ma znaczenie

W <time datetime="1991-08-06">$1991$</time> roku Tim Berners-Lee wydał HTML bez żadnego standardu wyglądu. Wczesne przeglądarki renderowały nagłówki i przyciski po swojemu, przez co ten sam plik HTML wyglądał inaczej w każdym programie. Budowanie spójnych interfejsów było loterią.

W <time datetime="1994-12-17">1994</time> roku Håkon Wium Lie i Bert Bos zaproponowali rozwiązanie: **`CSS`** (*Cascading Style Sheets* – Kaskadowe Arkusze Stylów).

Nazwa „kaskadowość” oznacza, że ostateczny wygląd strony spływa z trzech źródeł jednocześnie:
1. **Domyślnych stylów przeglądarki** (`user agent stylesheet`), które są stosowane automatycznie do każdego elementu.
2. **Preferencji użytkownika** (np. powiększona czcionka, wysoki kontrast, ciemny motyw systemowy).
3. **Reguł napisanych przez dewelopera**.

Gdy te źródła nakładają się na ten sam element, kaskada rozstrzyga konflikty według określonych priorytetów. To celowy projekt – otwarty internet miał nie należeć wyłącznie do deweloperów, lecz dopasowywać się do potrzeb czytelnika.



---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Zasady projektowania są święte (****_GIGA WAŻNE!_****):** Prawa HCI (Hicka, Fittsa, Millera) oraz wzorce skanowania wzrokowego (F, Z) to twarde reguły psychologii percepcji, które musisz bezwzględnie zapamiętać i stosować na każdej stronie. Stylizacja to inżynieria uwagi i zarządzanie wysiłkiem umysłowym użytkownika.
- **Różnorodność stylów to narzędzie, nie reguła:** Estetyka (minimalizm, brutalizm, cyberpunk, skeuomorfizm) to sposób na budowanie tożsamości i emocjonalnej więzi z użytkownikiem. Nie musisz uczyć się cech tych stylów na pamięć – musisz jednak rozumieć, jak wpływają one na odbiór strony.
- **Hierarchia przestrzenna to podstawa UX:** Współczesne interfejsy opierają się na warstwowości, cieniach i elewacji, co pozwala mózgowi instynktownie porządkować informacje i odróżniać elementy interaktywne od statycznych.
- **CSS to kaskada:** Wygląd elementu zależy od przeglądarki, użytkownika i deweloperów. Ta struktura chroni dostępność i otwartość sieci dla każdego użytkownika.

