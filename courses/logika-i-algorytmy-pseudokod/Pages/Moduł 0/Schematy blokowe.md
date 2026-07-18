# Schematy blokowe: Kodowanie obrazkami na kartce

Powiedzmy sobie brutalnie szczerze. W codziennej pracy typowego programisty (tzw. „klepacza kodu”) rzadko kto wyciąga linijkę i rysuje formalne schematy blokowe przed zakodowaniem prostego formularza kontaktowego na stronę WwW. Jeśli masz w głowie gotową wizję i znasz środowisko, po prostu siadasz do klawiatury i piszesz.

Jednak prędzej czy później w życiu każdego inżyniera przychodzi taki moment, w którym próba pisania kodu „z głowy” kończy się katastrofą. Może to być system fizyki kolizji w grze 3D, drzewo umiejętności postaci w RPG, albo algorytm grafowy wyznaczający optymalną trasę np. dla pojazdów autonomicznych. Kiedy liczba zmiennych i rozgałęzień przekracza możliwości Twojej pamięci krótkotrwałej, zamykasz edytor. Wyciągasz zwykły zeszyt A4 i zaczynasz szkicować twardą architekturę układu.

Doskonałym i niedocenianym pozornie narzędziem do tego jest _**paint**_. Dzięki niemu jesteś w stanie szybko zwizualizować swój cel i możliwe rozwiązania, a czasem nawet dostrzec błędy w swoim rozumowaniu. 😉

**Schemat blokowy** to uniwersalny wzorzec projektowy, swoisty *blueprint* (plan budowy), za pomocą którego mapujemy fizyczny przepływ prądu przez układy logiczne procesora. Dla elektroniki i oprogramowania nie ma znaczenia, czy na końcu przetłumaczysz ten diagram na język <span style="text-wrap: nowrap;">C++</span>, Pythona, czy JavaScript. Logika pozostaje ta sama.


Za chwilę przedstawię Ci fundamentalne instrukcje stosowane w programowaniu i realizowane przez procesor (*`CPU`*).

---

## 🔣 Język wizualny: Alfabet procesora

Komputer to fizyczna maszyna, która pomimo całej swojej złożoności, operuje zaledwie w kilku podstawowych trybach. Te instrukcje są oparte na bazie tranzystorów i bramek logicznych, dzięki czemu procesor jest w stanie wykonać 4 fundamentalne operacje. W schemacie blokowym reprezentujemy je figurami geometrycznymi.

1.  **`[Owal]`** (*Start / Koniec*)
    *Fizyczny obwód maszyny musi zostać wybudzony i zgaszony.* Program nie istnieje w próżni. Kiedy klikasz ikonę aplikacji dwukrotnie, system operacyjny przekazuje sterowanie do węzła `START`. Potem realizowane są poszczególne instrukcje programu, aż dojdzie do węzła `KONIEC`. Potem wszelkie zarezerwowane zasoby są zwracane do systemu operacyjnego.

2.  **`[Równoległobok]`** (*Wejście / Wyjście*)
    *Procesor sam w sobie jest głuchy i ślepy.* Potrafi on przyjąć na wejściu (`input`) dane, przetwarzać miliardy liczb w swoim krzemowym wnętrzu, ale nikt się o tym nie dowie, dopóki nie zostanie wywołana instrukcja wyjścia (`output`). Ten pochyły prostokąt symbolizuje interakcję `I/O` z pozostałymi elementami układu / podzespołami urządzenia.
    - **`input`**: klawiatura, mysz, mikrofon, czujnik, joystick, odczyt z pliku.
    - **`output`**: monitor, głośniki, drukarka, zapis do pliku.

3.  **`[Prostokąt]`** (*Proces i Pamięć Operacyjna*)
    *Miejsce zarządzania pamięcią i operacjami arytmetyczno-logicznymi na zaalokowanych danych.* To w tym klocku fizyczna Jednostka Arytmetyczno-Logiczna (**ALU** - *Arithmetic Logic Unit*) wewnątrz procesora wykonuje operacje (np. `x = x + 10`). To również ten kształt służy do rezerwowania podpisanych szufladek w szybkiej pamięci RAM, czyli tzw. _**Zmiennych**_. Każdy prostokąt to zmiana stanu w układzie nerwowym maszyny.

4.  **`[Romb]`** (*Węzeł Decyzyjny i Ewaluacja*)
    *Fundament tak zwanej sztucznej inteligencji.* To jedyne miejsce na całym diagramie, w którym nasza maszyna wydaje się „myśleć”. Zadaje zamknięte pytanie logiczne (np. „Czy użytkownik ma więcej niż 18 lat?”). Procesor ocenia stan pamięci i wypluwa tylko jedną z dwóch wartości: $1$ (`Prawda` / **TAK**) lub $0$ (`Fałsz` / **_NIE_**). W tym miejscu prąd rozgałęzia się, a oprogramowanie wybiera jedną z dostępnych ścieżek.

Zanim przejdziesz dalej, upewnij się, że ten „alfabet” płynie w Twojej krwi. Połącz pojęcia w odpowiednie pary:

<data-gate>
  <data-connection-matcher title="Rozpoznaj kształty i fundamenty, za które odpowiadają">
    <div class="cmw-item" data-left="Prostokąt" data-right="Zarządzanie komórkami RAM i obliczenia matematyczne."></div>
    <div class="cmw-item" data-left="Romb" data-right="Instrukcja warunkowa i rozwidlenie logiki maszyny."></div>
    <div class="cmw-item" data-left="Owal" data-right="Uruchomienie i zamknięcie programu."></div>
    <div class="cmw-item" data-left="Równoległobok" data-right="Komunikacja z peryferiami: pobranie danych z klawiatury lub wyświetlanie ich na ekranie."></div>
  </data-connection-matcher>
</data-gate>

---

## 📦 Filar 1: Sekwencja i modyfikacja Pamięci RAM (Prostokąt)

Najprostszą architekturą w informatyce jest tzw. *wykonywanie liniowe*. Oznacza to, że procesor czyta węzły jak książkę: sekwencyjnie, krok po kroku, z góry na dół, nigdy się nie zatrzymując i nie patrząc wstecz. 

Jednak aby cokolwiek obliczyć, maszyna musi posiadać robocze „brudnopisy”. Służą do tego **Zmienne**. Zmienna to nic innego jak wycinek fizycznego krzemu w układzie RAM, któremu nadajemy ludzką nazwę (np. `a`), by móc swobodnie w nim czytać i nadpisywać tam dane. Procesor przekłada tę etykietę na faktyczną lokalizację w pamięci RAM i operuje na napięciu w danej szufladce (`0x2137BACA`). 

<details>
  <summary>🔍 Jak działają adresy w pamięci RAM? (Dla dociekliwych)</summary>

  Adresy w pamięci RAM nie bez powodu zapisujemy w formacie zaczynającym się od **`0x`** (np. `0x2137BACA`). 
  
  **Co oznacza ten zapis?**
  - _**`0x`**_: To standardowy prefiks informujący procesor i programistę: *„Uwaga, liczba za mną jest zapisana w systemie szesnastkowym (heksadecymalnym), a nośnikiem wartości nie jest system dziesiętny”*.
  - **`2137BACA`**: To konkretna liczba w systemie szesnastkowym (gdzie cyfry to od `0` do `9` oraz litery od `A` do `F`, odpowiadające wartościom $10 – 15$).

  **Dlaczego system szesnastkowy, a nie dziesiętny lub dwójkowy?**
  Komputer pod maską myśli wyłącznie w systemie binarnym (zera i jedynki). Zapisywanie adresów binarnie (np. `00100001001101111011101011001010`) byłoby nieczytelne dla człowieka. Z kolei system szesnastkowy idealnie kompresuje dane binarne: **jedna cyfra szesnastkowa odpowiada dokładnie 4 bitom (półbajtowi)**. Dzięki temu długi ciąg zer i jedynek możemy zapisać jako krótki, 8-znakowy kod dla architektury 32-bitowej (lub 16-znakowy dla 64-bitowej).

  **Szufladki i adresy**
  Wyobraź sobie pamięć RAM jako gigantyczny regał z miliardami ponumerowanych szufladek:
  1. Każda szufladka (komórka pamięci) mieści dokładnie **$1'-\text{ bajt}$** ($8\text{ bitów}$) danych.
  2. Każda szufladka ma swój unikalny, niezmienny numer – to jest właśnie **adres pamięci** (np. `0x2137BACA`).
  3. Kiedy tworzysz w programie zmienną `a = 10`, system operacyjny przydziela jej wolną szufladkę (lub kilka sąsiednich, jeśli typ danych wymaga więcej miejsca), zapisuje tam wartość `10` za pomocą stanów napięcia elektrycznego (odpowiednika zer i jedynek) i wiąże Twoją ludzką etykietę `a` z tym konkretnym adresem. Od tej pory nie musisz pamiętać adresu `0x2137BACA` – za każdym razem, gdy używasz zmiennej `a`, komputer wie, do której szufladki ma zajrzeć!
</details>


Poniższy schemat _**deklaruje**_ dwie zmienne `a` oraz `b` i _**inicjalizuje**_ ich wartości. Następnie deklaruje trzecią zmienną `suma`, której wartość jest wynikiem sumowania wartości komórek pamięci RAM `a` i `b`. Ostatecznie Równoległobok wyświetla predefiniowany komunikat z wartością zmiennej `suma`. 

<data-gate>
<data-flowchart data-steps='[
  {"id": "s", "type": "start", "text": "START", "next": "o1"},
  {"id": "o1", "type": "operation", "text": "a ← 10", "set": {"a": 10}, "next": "o2"},
  {"id": "o2", "type": "operation", "text": "b ← 5", "set": {"b": 5}, "next": "o3"},
  {"id": "o3", "type": "operation", "text": "suma ← a + b", "set": {"suma": 15}, "next": "io1"},
  {"id": "io1", "type": "io", "text": "Wypisz: suma", "print": "Wynik dodawania: 15", "next": "stop"},
  {"id": "stop", "type": "stop", "text": "KONIEC"}
]'>
</data-flowchart>
</data-gate>

> [!IMPORTANT]
> **Deklaracja**: operacja dotycząca stworzenia zmiennej. Jest to proces rezerwowania miejsca w pamięci RAM i nadawania mu nazwy referencyjnej (etykiety) po której będzie można odwoływać się do danej komórki w pamięci RAM.
> 
> **Inicjalizacja**: operacja dotycząca przypisania wartości dla danej zmiennej. Jest to proces nadpisywania wartości w zarezerwowanej komórce pamięci RAM.


---

## 🔀 Filar 2: Architektura Rozgałęzień i logika <code>IF</code> (Romb)

Zwykłe operatory arytmetyczne są niezwykle potężne, ale linearne. Nie potrafią one modyfikować kierunku ruchu logiki w zależności od otoczenia. Maszyna staje na intelektualnym rozdrożu *wyłącznie* wtedy, gdy w układzie ALU procesora napotka instrukcję węzła decyzyjnego. 

W kodowaniu nazywamy tę strukturę instrukcją `IF` (_**Jeżeli**_). To moment, w którym komputer zagląda do pamięci RAM, bierze zapisaną tam wartość, przeprowadza weryfikację (np. nierówność algebraiczna) i mechanicznie wypuszcza prąd jedną z dwóch wykluczających się dróg: **TAK** albo **NIE**.

W poniższym schemacie blokowym zadeklarowano zmienną wiek i od razu zainicjalizowano jej wartość jako $15$. W kolejnym kroku napotyka węzeł warunkowy, który decyduje, czy zadeklarowany warunek w tym momencie jest prawdziwy czy fałszywy.  
Dla $15 \geq 18$ warunek jest fałszywy, dlatego dalszy krok działania algorytmu przejdzie po węźle fałszu (**_NIE_**) do instrukcji wyświetlenia komunikatu o treści *„Odmowa dostępu. Masz tylko {wiek} lat.”*.

<data-gate>
<data-flowchart data-steps='[
  {"id": "start", "type": "start", "text": "START", "next": "op1"},
  {"id": "op1", "type": "operation", "text": "wiek ← 15", "set": {"wiek": 15}, "next": "cond1"},
  {"id": "cond1", "type": "condition", "text": "Czy wiek ≥ 18?", "eval": "wiek >= 18", "yes": "op2", "no": "op3"},
  {"id": "op2", "type": "io", "text": "Wypisz: Wchodzisz!", "print": "Zatwierdzono. Twój wiek to {wiek} lat.", "next": "stop"},
  {"id": "op3", "type": "io", "text": "Wypisz: Odmowa!", "print": "Odmowa dostępu. Masz tylko {wiek} lat.", "next": "stop"},
  {"id": "stop", "type": "stop", "text": "KONIEC"}
]'>
</data-flowchart>
</data-gate>

---

## 🔄 Filar 3: Cykl życia maszyny i Iteracja (Pętla)

Jeśli oprogramowanie szło by zawsze liniowo z góry na dół, byłoby tragicznie nieefektywne. Po ułamku sekundy aplikacja dotarłaby do ostatniego węzła (**Koniec**), po czym wyłączyłaby się. 

Dlaczego gry wideo działają w trybie ciągłym, skanując wciskanie klawiszy? Dlaczego serwery WwW kręcą się dzień i noc w oczekiwaniu na wizytę użytkownika? Sekret tkwi w **cyklach maszynowych**, potocznie zwanych **Pętlami iteracyjnymi**.

Na schemacie blokowym nie ma specjalnego kształtu pętli. Osiągamy ten mechanizm łącząc ze sobą węzeł decyzyjny (Romb) ze ścieżką powrotną, która ignoruje liniowość i zrzuca wskaźnik wykonania *z powrotem na wcześniejszą instrukcję*. W ten sposób zmuszamy komputer do wielokrotnego powtarzania danego fragmentu kodu.

W tym wszystkim ważny jest warunek, dla którego pętla ma wykonać kolejną iterację, oraz jego ciągła zmiana, by uniknąć pętli nieskończonej.

Poniższy przykład uproszczonego bankomatu do wypłacania banknotów o nominale $20$ zł ma za zadanie zobrazować Ci mechanizm pętli. Jak widzisz, na początku zadeklarowano zmienną saldo i zainicjalizowano jej wartość jako $50$ (PLN). W kolejnym kroku napotykamy romb, który decyduje, czy aktualny stan zmiennej saldo jest większy lub równy $20$. Już w tym momencie powinieneś zauważyć, że to nie jest zwykły `IF`, lecz warunek pętli, a w ciele pętli wykonują się operacje zmiany wartości i wypisania komunikatu. Węzły będą realizowane dopóki warunek jest prawdziwy (nazywamy to iteracją) – w momencie gdy warunek stanie się fałszywy, proces algorytmu przejdzie do wykonania następnych instrukcji z węzła **_NIE_**.

<data-gate>
<data-flowchart data-steps='[
  {"id": "s", "type": "start", "text": "START", "next": "o1"},
  {"id": "o1", "type": "operation", "text": "saldo ← 50", "set": {"saldo": 50}, "next": "c1"},
  {"id": "c1", "type": "condition", "text": "saldo ≥ 20?", "eval": "saldo >= 20", "yes": "o2", "no": "o3"},
  {"id": "o2", "type": "operation", "text": "saldo ← saldo - 20", "set": {"saldo": "saldo - 20"}, "next": "io1"},
  {"id": "io1", "type": "io", "text": "Wypisz: saldo", "print": "Wypłata 20 PLN. Aktualne saldo: {saldo}", "next": "c1"},
  {"id": "o3", "type": "io", "text": "Wypisz: BLOKADA", "print": "Zatrzymanie układu wydawania. Zbyt mało środków.", "next": "stop"},
  {"id": "stop", "type": "stop", "text": "KONIEC"}
]'></data-flowchart>
</data-gate>

> [!CAUTION]
> **_Nieskończona pętla – gdy potęga iteracji wymyka się spod kontroli_**  
> Instrukcja iteracyjna to jedno z najpotężniejszych narzędzi w programowaniu.  
> **A z wielką mocą pętli wiąże się wielka odpowiedzialność za jej zakończenie.**
> 
> Spójrz na przykład bankomatu:  
> Program sprawdza warunek *„`czy saldo ≥ 20`”*.  
> Jeśli programista zapomni o operacji `saldo ← saldo - 20`, saldo **nigdy się nie zmieni**.
> 
> Dla maszyny sytuacja wygląda tak:  
> - saldo = 50 → warunek prawdziwy → wypłata → powrót  
> - saldo = 50 → warunek prawdziwy → wypłata → powrót  
> - saldo = 50 → warunek prawdziwy → wypłata → powrót  
> - ...
> 
> Komputer nie posiada intuicji.  
> Wykona setki tysięcy iteracji w milisekundowych odstępach, aż:  
> - wyczerpie czas procesora,  
> - zapcha pamięć,  
> - zawiesi proces,  
> - a w skrajnych przypadkach doprowadzi do awarii całej maszyny.
> 
> To właśnie klasyczna **nieskończona pętla** — algorytm, który nigdy nie osiąga stanu końcowego, bo jego warunek nigdy nie może zostać obalony.
> 
> _**Fundamentalna zasada architektury:**_  
> Każda pętla musi zawierać operację, która w pewnym momencie doprowadzi do zakończenia iteracji.  
> Pętla bez degradacji stanu nie jest błędem — jest **_zagrożeniem konstrukcyjnym_**, które potrafi zniszczyć cały proces obliczeniowy.



---

## 🏗️ Specyfikacja wymagań: Odliczanie do zera

Znasz już podstawy: stan w pamięci, instrukcje warunkowe oraz działanie pętli.  
Czas sprawdzić, czy potrafisz przełożyć tę wiedzę na **realny schemat blokowy**, który wykonuje powtarzalną operację aż do osiągnięcia stanu końcowego.

Twoim zadaniem jest zbudowanie prostego algorytmu odliczającego od `10` do `0`.  
Poniżej znajdziesz wymagania, które musi spełniać poprawny układ:

1. **Inicjalizacja stanu:**  
   Zacznij od operacji (prostokąt), która tworzy zmienną `odliczanie` i ustawia jej wartość początkową na `10`.

2. **Warunek pętli:**  
   Użyj węzła decyzyjnego (romb), aby sprawdzać:  
   *Czy `odliczanie` > 0?*  
   To jest warunek sterujący pętlą.

3. **Aktualizacja stanu:**  
   Jeśli warunek jest prawdziwy (`TAK`), wykonaj operację zmniejszającą wartość zmiennej:  
   `odliczanie = odliczanie - 1`  
   Następnie wróć ścieżką do warunku, tworząc pełny cykl iteracyjny.

4. **Wyjście z pętli:**  
   Jeśli warunek jest fałszywy (`NIE`), przejdź do węzła wyjścia (równoległobok) i wypisz komunikat:  
   `"BOOM!"`  
   (dokładnie taki, bez dodatkowych znaków).

5. **Zakończenie algorytmu:**  
   Po wypisaniu komunikatu algorytm musi przejść do czerwonego węzła `KONIEC`.  
   Brak poprawnego zakończenia jest błędem strukturalnym — symulator przerwie działanie.

Po zbudowaniu schematu kliknij **▶ Uruchom**, aby sprawdzić poprawność.  
Lekcja zostanie zaliczona tylko wtedy, gdy zmienna `odliczanie` osiągnie wartość `0`, a w konsoli pojawi się komunikat `"BOOM!"`.

<data-gate>
<data-flowchart-builder expected-var="odliczanie:0" expected-output="BOOM!"></data-flowchart-builder>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

#### 1. Co powinieneś wiedzieć (Teoria) 🧠
- **Schemat blokowy** to uniwersalny, wizualny plan działania algorytmu. Jest w $100\\%$ niezależny od wybranego języka programowania (C++, Python, JS).
- Każda figura geometryczna ma przypisaną stałą rolę logiczną:
  - **Owal**: Kontroluje cykl życia programu (`START`/`KONIEC`).
  - **Równoległobok**: Odpowiada za operacje wejścia/wyjścia (`I/O`), czyli komunikację z użytkownikiem lub plikami.
  - **Prostokąt**: Wykonuje operacje matematyczne i zarządza pamięcią RAM (alokacja zmiennych).
  - **Romb**: Reprezentuje węzeł decyzyjny (instrukcję warunkową), rozwidlając przepływ na ścieżkę **`TAK`** lub **_`NIE`_**.
- Zmienne w programie to nazwane „szufladki” o konkretnych adresach w fizycznej pamięci RAM. Adresy te zapisujemy szesnastkowo za pomocą standardowego prefiksu _**`0x`**_ (np. `0x2137BACA`).

#### 2. Co powinieneś umieć (Praktyka) 🛠️
- Odróżniać **deklarację** zmiennej (rezerwowanie i nazywanie miejsca w pamięci) od jej **inicjalizacji** (przypisanie początkowej wartości).
- Śledzić przepływ logiki i poprawnie czytać kolejno wykonywane instrukcje.
- Tworzyć pętle iteracyjne, dbając o **degradację stanu** (modyfikację zmiennej wpływającej na warunek), aby w kontrolowany sposób przerwać pętlę i nie dopuścić do zawieszenia programu (nieskończona pętla).

#### 3. Następny krok 💻
Wizualne schematy blokowe świetnie tłumaczą zasady działania procesora na początku nauki. W praktyce inżynierskiej są one jednak zbyt obszerne i nieporęczne. Dlatego następnym krokiem każdego programisty jest zapisanie tej samej logiki za pomocą zwięzłego, ustrukturyzowanego tekstu – czyli **Pseudokodu**.

