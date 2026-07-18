# Algorytmy, sekwencje i brutalna dosłowność maszyn

Początki nauki programowania bywają trudne. Największą barierą nie jest obcy język, skomplikowana składnia ani matematyka. Pierwszym największym wrogiem jest Twój własny, zoptymalizowany mózg. 

Przez całe życie uczyłeś się polegać na intuicji, wyłapywać podteksty i zakładać, że rozmówca domyśli się reszty. W świecie maszyn i algorytmów musisz być precyzyjny w każdym najmniejszym aspekcie.

> [!NOTE]
> **Złudzenie komunikacji:**  
> Kiedy mówisz znajomemu „zamknij drzwi”, jego mózg automatycznie wykonuje dziesiątki czynności. Nie instruujesz go przecież: 
> - Wstań, 
> - podejdź do drzwi, 
> - wyciągnij rękę, 
> - chwyć klamkę, 
> - pociągnij.
> 
> Twój rozmówca sam uzupełnia brakujące kroki, korzystając z kontekstu kulturowego i fizycznego.
> Komputer jest tego kontekstu całkowicie pozbawiony.

---

## 🍜 Paradoks zupki błyskawicznej

Spróbujmy zaprogramować robota. Jego zadaniem będzie przygotowanie zupki błyskawicznej.

Algorytm krokowy może wyglądać tak:
1. Otwórz zupkę.
2. Zalej wrzątkiem.
3. Poczekaj $3$ minuty i zjedz.

Co zrobi maszyna z tą instrukcją? Ponieważ nie posiada zdrowego rozsądku, zachowa się dosłownie.  
- Polecenie *„Otwórz zupkę”* może dla niej oznaczać rozerwanie opakowania z taką siłą, że makaron rozsypie się po całej kuchni. **Krok wykonany**. 👍
- Następnie maszyna przejdzie do polecenia *„Zalej wrzątkiem”*. Skoro nie zdefiniowałeś użycia miski, robot może wylać wrzącą wodę prosto na podłogę. **Krok wykonany**. 👍
- Na koniec odczeka $3$ minuty i spróbuje skonsumować rozlany płyn z paneli. **Krok wykonany**. 👍

Robot wykonał kod w stu procentach bezbłędnie. To Twoje instrukcje były tragicznie nieprecyzyjne.  
Programowanie to sztuka przewidywania każdego, nawet najbardziej trywialnego stanu rzeczywistości.

---

<data-gate>
  <data-quiz>
    <question>
Co jest największym wyzwaniem podczas pisania instrukcji dla komputera?
    </question>
    <options>
      <item>Szybkie opanowanie skomplikowanych, zaawansowanych teorii matematycznych.</item>
      <item correct>Konieczność precyzyjnego opisania każdego kroku, bez polegania na domysłach.</item>
      <item>Biegła znajomość języka angielskiego w stopniu umożliwiającym pisanie kodu.</item>
    </options>
    <div data-hint="error">
      Zastanów się, dlaczego robot w przykładzie z zupką błyskawiczną wylał wrzątek na podłogę. Czego zabrakło w jego programie?
    </div>
    <div data-hint="success">
      Dokładnie tak! Komputer nie domyśli się niczego sam, musisz opisać każdą operację od A do Z.
    </div>
  </data-quiz>
</data-gate>

---

## 📐 Algorytm: techniczny fundament działania programu

Komputer wykonuje instrukcje w sposób całkowicie mechaniczny, bez interpretowania intencji. Dlatego **algorytm** to nie po prostu „lista kroków”, lecz precyzyjnie określona procedura, którą maszyna wykonuje w sposób jednoznaczny, skończony i przewidywalny.

Każdy poprawny algorytm spełnia cztery kluczowe cechy.

---

1. **Jednoznaczność** (Precyzyjna interpretacja przez maszynę) Instrukcja nie pozostawia marginesu na interpretację. Komputer nie potrafi samodzielnie domyślić się intencji autora.
    - *Na poziomie kodu procesor wykonuje tylko proste instrukcje.* Są to ściśle określone operacje logiczne, matematyczne i manipulacje pamięcią.
> _**Każda niejasność wywołuje natychmiastowy problem.**_ Skończy się to błędem kompilacji lub wykonaniem operacji niezgodnej z oczekiwaniami.

---

2. **Skończoność** (Warunek stopu i fizyczne ograniczenia sprzętu) Proces obliczeniowy musi się zakończyć. Algorytm musi mieć z góry określony punkt, w którym przerywa pracę.
    - *Każda operacja zużywa fizyczne zasoby.* Każdy cykl procesora i każda nowa zmienna w pamięci RAM obciążają komputer.
> _**Brak warunku stopu zawiesza system.**_ Prowadzi to do zapętlenia programu (tzw. **_nieskończonej pętli_**), przepełnienia pamięci operacyjnej i awarii aplikacji.

---

3. **Przetwarzanie danych** (Input → Proces → Output lub zmiana stanu) Algorytm zawsze modyfikuje określone informacje. Pobiera dane na wejściu (*`Input`*), przetwarza je i generuje wynik na wyjściu (*`Output`*).
    - *Efekt nie musi być bezpośrednim zwrotem wartości.* Zmiany mogą zachodzić poprzez modyfikację zmiennych w pamięci, edycję plików czy interakcję z systemem operacyjnym.
> _**Bez transformacji danych kod nie ma sensu.**_ Algorytm musi wywoływać realną zmianę stanu programu.

---

4. **Determinizm** (Przewidywalność działania i skalowania) Te same dane muszą dawać ten sam wynik. Uruchomienie programu z identycznymi parametrami musi zawsze wygenerować identyczny rezultat.
    - *Determinizm umożliwia weryfikację poprawności.* Pozwala to programiście na testowanie kodu i analizowanie jego złożoności obliczeniowej.
> _**Gwarantuje to przewidywalne działanie pod obciążeniem.**_ Dzięki temu wiemy, jak program zachowa się przy obsłudze milionów operacji jednocześnie.

---
## ⏱️ Świadomość czasu: sekwencja i „stan”

Kod jest statycznym tekstem, ale dla komputera po uprzednim zinterpretowaniu lub skompilowaniu staje się dynamicznym procesem sterowanym czasem. 

- **Sekwencja to kolejność, w jakiej procesor wykonuje kolejne bloki instrukcji.** Fizyczny procesor (CPU lub GPU) przetwarza instrukcje pojedynczo. Wykorzystuje wskaźnik instrukcji (*Program Counter*), który wskazuje adres aktualnie wykonywanej instrukcji w pamięci RAM. Po jej wykonaniu, wskaźnik natychmiast przeskakuje do adresu kolejnej instrukcji.
- *Kolejność w kodzie nie oznacza kolejności wykonania*. Edytor pozwala pisać funkcje w dowolnym miejscu pliku. Jednak procesor zawsze realizuje je w ścisłym porządku czasowym, skacząc od adresu do adresu w pamięci i krok po kroku tworząc aktualny **stan** (*state*) programu.
- **Stan to dane w pamięci modyfikowane przez kolejne fazy.** Dobrze obrazuje to potok renderowania grafiki 3D przez układ GPU:
    1. _**Faza geometrii**_: Obliczenie pozycji, skali i obrotu obiektów 3D w przestrzeni oraz mapowanie współrzędnych UV.
    2. _**Faza odrzucania**_ (*Culling*): Określenie, które obiekty znajdują się poza kadrem kamery (karta graficzna pomija niewidoczne elementy, by zaoszczędzić zasoby).
    3. _**Faza teksturowania**_: Nałożenie kolorów i tekstur na podstawie współrzędnych UV na widoczne wielokąty.

GPU nie potrafi oteksturować i pokolorować pikseli obiektu (faza 3), dopóki jego pozycja trójwymiarowa nie zostanie obliczona (faza 1) i zweryfikowana pod kątem widoczności (faza 2).

<data-gate>
<data-sortable-list title="Ułóż prawidłową sekwencję operacji do wykonania przez bankomat">
<item data-correct="2">Wprowadzenie PIN-u. (Zmienia stan: klient jest uwierzytelniony jako właściciel).</item>
<item data-correct="4">Wypłacenie banknotów. (Zmienia stan ostateczny: fizyczna gotówka wydana, wirtualne saldo pomniejszone).</item>
<item data-correct="1">Odczytanie czipa karty. (Buduje nowy stan: system wie, kto stoi przed maszyną).</item>
<item data-correct="3">Sprawdzenie salda. (Zmienia stan: system potwierdza, że konto nie jest puste).</item>
</data-sortable-list>
</data-gate>

---

## ⚔️ Błędy w programowaniu: cztery poziomy awarii

Pisanie kodu nie polega na bezbłędnym przepisywaniu rzeczywistości. Programowanie to przede wszystkim rozwiązywanie problemów. Błędy nie są porażką ani dowodem braku umiejętności, są podstawowym tworzywem, na którym będziesz pracować. Spędzisz większość czasu na ich wyłapywaniu i naprawianiu, wiedząc, że rozwiązanie jednego problemu często stworzy kolejny.

W praktyce programistycznej błędy dzielimy na cztery kategorie odpowiadające warstwom działania systemu.

---

### ❌ Błędy składniowe (<i>syntax errors</i>)

<b>Poziom:</b> **język programowania**

To błędy łamiące zasady gramatyki zapisu. Maszyna nie potrafi zinterpretować takiego kodu, więc natychmiast zatrzymuje proces uruchamiania.

- Kod jest formalnie niepoprawny, więc program w ogóle się nie uruchomi.
- Narzędzia diagnostyczne często wskazują linię tuż za błędem, ponieważ dopiero tam **parser** wykrywa rozsypanie się struktury kodu.
- Naprawa takich błędów jest najprostsza, ponieważ polega jedynie na poprawieniu zapisu.

> To nie jest zły algorytm, to kod, którego komputer nie potrafi przeczytać.

---

> [!IMPORTANT]
> **Parser** - to analiza składniowa kodu przez interpreter lub kompilator.

---

### 🧱 Błędy strukturalne (<i>structural errors</i>)

<b>Poziom:</b> **konstrukcja programu**

Kod jest poprawny składniowo, ale program jest źle zbudowany. Konstrukcja kodu nie spełnia fizycznych wymogów działania systemu.

- Typowe przyczyny to wycieki pamięci, nieprawidłowy przepływ sterowania lub brak obsługi wyjątków.
- Przykłady to funkcja wywołująca samą siebie bez warunku stopu (**_nieskończona rekursja_**), brak zamknięcia plików czy brak bloku *catch* dla fragmentu kodu którego działanie jest niepewne np. operacje na plikach lub przez sieć, co wywoła **_crash aplikacji_**.

> Problemy te wynikają bezpośrednio z projektu konstrukcji kodu, a nie z samej logiki algorytmu.

---

> [!IMPORTANT]
> **Rekursja** lub inaczej **Rekurencja** - to proces, w którym funkcja wywołuje samą siebie.
> **Nieskończona rekursja** - to nieporządany efekt błędnego lub brakującego warunku stopu, co prowadzi do przepełnienia stosów i pamięci.
> Rekurencja jest stosowana do ładnego i zwięzłego zapisu niektórych algorytmów. Jednak wiąże się z nią duże zapotrzebowanie pamięci operacyjnej RAM, ponieważ każdemu wywołaniu funkcji przypisuje się w pamięci nową ramkę stosu, w której przechowywane są lokalne dane oraz adres powrotu do funkcji wywołującej. 

---

### 💣 Błędy logiczne (<i>logical errors</i>)

<b>Poziom:</b> **algorytm**

Kod jest bezbłędny składniowo i strukturalnie, ale algorytm wykonuje zupełnie inne operacje niż te, które zaplanowałeś.

- Typowe przyczyny to złe warunki w instrukcjach warunkowych, błędne obliczenia matematyczne lub zła kolejność wykonywania instrukcji.
- Maszyna wykonuje instrukcje dokładnie tak, jak zostały zapisane, ale ich końcowy sens jest błędny.
- Przez to powstają nieskończone pętle i błędne wyniki, które potrafią pozostać niewykryte w systemie przez lata.

> Debugowanie w praktyce polega głównie na szukaniu błędów logicznych poprzez analizowanie kodu krok po kroku i śledzenie zmian w pamięci.

---

### ⚡ Błędy wykonania (<i>runtime errors</i>)

<b>Poziom:</b> **działanie aplikacji**

Kod jest poprawny pod każdym względem, ale program nie radzi sobie z warunkami fizycznymi środowiska w trakcie pracy.

- Typowe przyczyny to próba dzielenia przez zero, odwołanie do nieistniejącego indeksu w pamięci, nagły brak połączenia sieciowego czy próba odczytu brakującego pliku.
- Błędy te zależą od dostarczonych danych wejściowych, stanu sprzętu oraz zewnętrznych bibliotek.
- Pojawiają się wyłącznie podczas działania aplikacji i wymagają stosowania mechanizmów obronnych w kodzie.

---

<data-gate>
  <data-connection-matcher title="Dopasuj konkretną awarię do odpowiedniej kategorii błędu">
    <div class="cmw-item" data-left="Błąd składniowy (syntax)" data-right="Niezamknięcie cudzysłowu definiującego ciąg tekstu."></div>
    <div class="cmw-item" data-left="Błąd strukturalny (structural)" data-right="Wywołanie funkcji rekurencyjnej bez warunku stopu."></div>
    <div class="cmw-item" data-left="Błąd logiczny (logical)" data-right="Zaksięgowanie pobrania gotówki z konta przed weryfikacją salda."></div>
    <div class="cmw-item" data-left="Błąd wykonania (runtime)" data-right="Próba odczytu pliku z sieci przy nagłym braku połączenia."></div>
  </data-connection-matcher>
</data-gate>

---

### 🧠 Dlaczego ten podział jest ważny?

Odpowiada on czterem warstwom, które poznasz w pseudokodzie, a później w prawdziwych językach programowania:

| Warstwa | Typ błędu | Co się psuje |
|:---|:---|:---|
| Język | Składniowy (*syntax*) | Kod nie może zostać zinterpretowany. |
| Konstrukcja | Strukturalny (*structural*) | Program jest błędnie zbudowany. |
| Algorytm | Logiczny (*logical*) | Program wykonuje niepożądane obliczenia. |
| Wykonanie | Wykonania (*runtime*) | Program nie radzi sobie z rzeczywistością. |

Dzięki temu od początku rozumiesz, gdzie szukać problemu, zamiast modyfikować kod losowo.

---

## 🧩 Dekompozycja

Napisanie gry lub systemu operacyjnego od zera jest niewykonalne jako pojedyncze zadanie. W programowaniu radzimy sobie z tym za pomocą zasady **dziel i zwyciężaj**, czyli **dekompozycji**.

Dekompozycja polega na rozbijaniu dużego tematu na coraz mniejsze, elementarne części. Robimy to tak długo, aż każdy pojedynczy element sprowadzimy do jego logicznej i matematycznej reprezentacji, którą komputer potrafi bezpośrednio przetworzyć.

Wyobraź sobie ruch bohatera w grze platformowej 2D. Na pewno nie będzie to hydraulik z włoskim imieniem. Aby zakodować poruszanie się tą postacią, musimy przetworzyć cztery podstawowe operacje:
1. **Odczyt danych (Input)**: Pobranie stanu klawiatury w celu sprawdzenia, czy gracz wcisnął klawisz <kbd>W</kbd> albo <kbd>  SPACJA  </kbd>.
2. **Aktualizacja stanu (Proces)**: Zwiększenie współrzędnej $y$, czyli wysokości gracza w pamięci RAM.
3. **Weryfikacja reguł (Warunek)**: Sprawdzenie, czy nowa pozycja gracza nie przecina geometrii ściany.
4. **Renderowanie obrazu (Output)**: Przesłanie nowych współrzędnych do pamięci karty graficznej w celu narysowania aktualnej klatki gry.

Po rozbiciu problemu okazuje się, że cała mechanika gry to w rzeczywistości zbiór takich prostych, odizolowanych kroków.

---

> [!IMPORTANT]
> **Dekompozycja** to rozbicie jednego dużego i skomplikowanego zadania na mniejsze, niezależne kroki.
> **Modułowość** to zamknięcie każdego z tych kroków w osobnym, odizolowanym pudełku (funkcji lub pliku). Dzięki temu możesz pisać, testować i poprawiać jeden mały fragment kodu bez obaw, że popsujesz całą resztę programu.

---

## 🕹️ Optymalizacja: inżynieria wydajności kodu

Poprawne działanie programu pod kątem logiki to dopiero połowa sukcesu. Prawdziwym sprawdzianem dla kodu jest jego wydajność. Proces ulepszania algorytmu w celu zmniejszenia zużycia czasu procesora oraz pamięci operacyjnej nazywamy **optymalizacją**.

Wydajność oprogramowania opiera się na dwóch fizycznych zasobach komputera:
- **Złożoność czasowa (czas procesora)**: Każda instrukcja potrzebuje określonej liczby taktów zegara CPU. Niewydajna sekwencja kodu zmusza procesor do wykonywania pustej pracy i generowania zbędnych cykli obliczeniowych.
- **Złożoność pamięciowa (pamięć RAM)**: Każda zadeklarowana zmienna, tablica czy obiekt rezerwują fizyczne komórki pamięci. Brak kontroli nad alokacją danych prowadzi do zapchania RAM-u i drastycznego zwolnienia systemu.

Niewydajny algorytm może działać niezauważalnie przy małej ilości danych. Jednak w rzeczywistych warunkach produkcyjnych, gdzie system przetwarza miliony operacji na sekundę, brak optymalizacji wywołuje natychmiastowe awarie: zawieszenie interfejsu, przekroczenie limitów czasu (*timeout*) lub całkowity crash systemu.

Złota zasada optymalizacji mówi, że najlepszy kod to ten, który realizuje cel przy użyciu minimalnej liczby kroków.

---

### 🗼 Brama logiczna: wyzwanie Wież Hanoi

Wieże Hanoi to klasyczny problem logiczno-matematyczny. Stanowi on idealny sprawdzian Twojej zdolności do projektowania optymalnych rozwiązań. Zadanie polega na przeniesieniu całej wieży z lewego słupka na prawy.

Ta łamigłówka to bezpośrednia symulacja pracy procesora:
- **Każdy ruch to instrukcja**: Jeśli przekładasz krążki chaotycznie w tę i z powrotem, marnujesz ruchy. Twój algorytm wykonuje puste operacje, które zmieniają stan gry, ale nie przybliżają do celu.
- **Koszt błędu rośnie lawinowo**: Matematyczne minimum dla 5 krążków to dokładnie $31$ ruchów ($2^5 - 1$). Każda pomyłka wymusza wykonanie dodatkowych ruchów korygujących, drastycznie wydłużając całą sekwencję.
- **Test optymalności**: Ustawiony jest limit na poziomie $35$ ruchów. Masz margines jedynie $4$ zbędnych operacji. Jeśli przekroczysz ten limit, system zgłosi **_błąd optymalizacji_** i bedziesz musiał zresetować układ, co symuluje awarię spowodowaną wyczerpaniem limitu czasu procesora (cyklu CPU).

Przemyśl strategię i zaplanuj każdy ruch. Sprawdź, czy potrafisz myśleć w sposób zoptymalizowany.

<data-gate>
<data-hanoi-tower disks="5" offset="4"></data-hanoi-tower>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Komputer nie domyśla się intencji.** Jeśli program nie działa, wina leży w braku precyzji instrukcji. Musisz porzucić ludzką intuicję i zacząć opisywać każdy krok z absolutną dosłownością. 🤖
- **Kolejność instrukcji tworzy stan w pamięci.** Program nie jest statycznym tekstem, lecz procesem w czasie. Zawsze sprawdzaj, czy dane, na których chcesz operować, zostały wcześniej poprawnie zapisane w RAM-ie przez wskaźnik instrukcji. 🪪
- **Błędy to Twoje codzienne narzędzie pracy.** Nie zniechęcaj się nimi. Kluczem do szybkiego debugowania jest identyfikacja poziomu awarii (język, konstrukcja, algorytm czy środowisko), co pozwala uniknąć modyfikowania kodu na oślep. 🚨
- **Rozbijaj problemy na mniejsze części.** Nigdy nie próbuj napisać całego programu na raz. Stosuj zasadę dziel i zwyciężaj, a każdy wyodrębniony krok zamykaj w osobnym pudełku, co ułatwi jego niezależne przetestowanie. 📦
- **Wydajność to granica działania programu.** Kod poprawny logicznie może zawiesić komputer, jeśli marnuje cykle CPU na zbędne instrukcje. Zawsze szukaj najkrótszej i najbardziej bezpośredniej drogi do celu. ⚡

