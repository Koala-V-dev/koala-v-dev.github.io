# Funkcje (Podprogramy): Level Up!

Wiesz już, że kod wykonywany jest liniowo, a maszyna bezwzględnie przestrzega sekwencji instrukcji. W module o pętlach poznałeś zasadę _**DRY**_ (*Don't Repeat Yourself*), która chroni Cię przed powtarzaniem operacji w jednym, konkretnym miejscu pliku.

Pętle są jednak niewystarczające, gdy określony wzorzec obliczeniowy musi zostać wywołany w wielu różnych, oddalonych od siebie miejscach dużego programu.

W tej lekcji wkraczamy na kolejny poziom **programowania strukturalnego** (którego fundamenty poznałeś przy okazji omawiania pętli i rezygnacji z instrukcji `GOTO`). Dowiesz się, jak dzielić program na mniejsze, niezależne bloki zwane **funkcjami** (podprogramami), aby skutecznie zapanować nad czytelnością i strukturą kodu.

---

## 🧮 Problem powtarzalności kodu

Zanim zbudujesz własną funkcję, musisz zrozumieć problem, który wymusił jej powstanie. Wyobraź sobie, że tworzysz grę RPG w stylu _**World of Warcraft**_ lub _**Path of Exile**_. 

Bohater posiada na pasku skrótów (w GUI - *Graphical User Interface*) ikony różnych czarów (np. Kula Ognia, Lodowy Pocisk, Wyładowanie). Kiedy gracz naciska przycisk skrótu, gra musi:
1. Sprawdzić, czy gracz ma odpowiednią ilość Many.
2. Obliczyć obrażenia czaru uwzględniając statystyki bohatera (np. Inteligencji). 
```php
Obrażenia = ObrażeniaBazowe + Inteligencja * Skalowanie
```
3. Wyrenderować efekt i wypisać informacje w konsoli.

Początkujący programista napisze obsługę każdego czaru osobno, powielając ten sam schemat:

```php
// --- Kod Kuli Ognia (Przycisk 1) ---
JEŻELI Mana >= 20 TO
    Mana = Mana - 20
    Obrazenia = 50 + Inteligencja * 1.5
    WYPISZ "Rzucono Kulę Ognia! Obrażenia: " + Obrazenia
KONIEC JEŻELI

// --- Kod Lodowego Pocisku (Przycisk 2) ---
JEŻELI Mana >= 15 TO
    Mana = Mana - 15
    Obrazenia = 40 + Inteligencja * 1.2
    WYPISZ "Rzucono Lodowy Pocisk! Obrażenia: " + Obrazenia
KONIEC JEŻELI

// --- Kod Wyładowania (Przycisk 3) ---
JEŻELI Mana >= 30 TO
    Mana = Mana - 30
    Obrazenia = 60 + Inteligencja * 1.8
    WYPISZ "Rzucono Wyładowanie! Obrażenia: " + Obrazenia
KONIEC JEŻELI
```

 Ten kod działa. Jednak wyobraź sobie, że podczas rozwoju gry decydujesz się dodać nowy mechanizm: **miksturę wzmocnienia czarów**, która zwiększa wszystkie obrażenia magiczne o $20\\%$ 
```php
Obrazenia = Obrazenia * 1.2
```

Więc teraz musisz do każdego czaru doklikać taką linijkę sprawdzającą, czy mikstura została zażyta oraz czy dalej działa, i wtedy ewentualnie wzmocnić wynik obrażeń o $20\\%$:
```php
JEŻELI wzmocnienie TO
    Obrazenia = Obrazenia * 1.2
KONIEC JEŻELI
```

> [!NOTE]
> **Redundancja (Nadmiarowość)**
> Redundancją w programowaniu nazywamy powielanie tej samej logiki lub kodu w wielu różnych miejscach. Sprawia to, że kod staje się podatny na błędy: każda najmniejsza zmiana wymaga odnalezienia i ręcznej edycji wszystkich skopiowanych fragmentów. Jeśli zapomnisz o jednym z nich, w aplikacji powstanie błąd logiczny.

---

## 🎯 Koncepcja podprogramu: Definicja a Wywołanie

Rozwiązaniem problemu redundancji jest wyodrębnienie powtarzalnego bloku kodu do tzw. **podprogramu**, powszechnie nazywanego **funkcją**.

Z punktu widzenia komputera, używanie funkcji opiera się na dwóch odrębnych krokach:

1. **Definicja (Zadeklarowanie):** To stworzenie szablonu (przepisu) na daną czynność i zapisanie go w pamięci. Definiując funkcję, opisujemy krok po kroku co ma się wydarzyć, ale **nie uruchamiamy** jeszcze tych instrukcji. To jak wpisanie nowego czaru do księgi zaklęć.
2. **Wywołanie (Uruchomienie):** To nakazanie procesorowi, aby fizycznie wykonał instrukcje z zapisanego szablonu. Wskaźnik instrukcji (*Program Counter*) przerywa wtedy czytanie głównego kodu, wykonuje skok pod adres funkcji w pamięci RAM, wykonuje cały zapisany tam algorytm, a po jego zakończeniu wraca do wcześniejszej linii głównego programu.

---

## 🚪 Budowa funkcji: Parametry i argumenty (Interfejs komunikacyjny)

Aby funkcja mogła obsługiwać różne przypadki (np. różne czary o innych kosztach many i obrażeniach), nie może opierać się na sztywno wpisanych wartościach. Uelastyczniamy ją, wprowadzając zmienne wejściowe.

W programowaniu bardzo wyraźnie odróżniamy puste szablony od rzeczywistych danych:
- **Parametry (Definicja):** To nazwy zmiennych zadeklarowane w nawiasach podczas tworzenia funkcji. Reprezentują one puste miejsca, które dopiero zostaną wypełnione. To jak puste otwory w maszynie.
- **Argumenty (Wywołanie):** To konkretne wartości (np. liczby lub teksty), które przesyłasz do funkcji w momencie jej wywołania. To surowiec, który wrzucasz do maszyny.

Spójrz na ostateczną, scentralizowaną wersję systemu rzucania czarów w naszym pseudokodzie:

<data-gate>
<data-pseudocode-runner>
<pre>
// DEKLARACJA (Definiujemy cztery parametry wejściowe)
FUNKCJA RzucCzar(nazwaCzaru, kosztMany, obrazeniaBazowe, skalowanie)
    JEŻELI mana >= kosztMany TO
        mana = mana - kosztMany
        obrazenia = obrazeniaBazowe + inteligencja * skalowanie
        JEŻELI wzmocnienie TO
            obrazenia = obrazenia * 1.2
        KONIEC JEŻELI
        WYPISZ "Użyto: " + nazwaCzaru + "! Obrażenia: " + obrazenia
    KONIEC JEŻELI
KONIEC FUNKCJI

// Bohater
mana = 50
inteligencja = 10
wzmocnienie = true

// WYWOŁANIE (Przekazujemy konkretne argumenty jako dane)
RzucCzar("Kula Ognia", 20, 50, 1.5)
RzucCzar("Lodowy Pocisk", 15, 40, 1.2)
RzucCzar("Wyładowanie", 30, 60, 1.8)
</pre>
</data-pseudocode-runner>
</data-gate>

Dzięki takiemu podejściu uzyskaliśmy **jedno scentralizowane źródło prawdy**. Jeśli w przyszłości zechcesz dodać efekt działania nowej mikstury wzmacniającej, dopiszesz tę logikę wyłącznie wewnątrz jednej, małej funkcji `RzucCzar()`. Zmiana ta automatycznie obejmie wszystkie czary na pasku skrótów!

<data-gate>
  <data-connection-matcher title="Usystematyzuj wiedzę o interfejsach funkcji:">
    <div class="cmw-item" data-left="Parametry" data-right="Puste szablony zmiennych (np. `KosztMany`, `ObrazeniaBazowe`) określające, jakich danych potrzebuje funkcja."></div>
    <div class="cmw-item" data-left="Argumenty" data-right="Konkretne pakiety danych (np. `20`, `50`), przesyłane do funkcji w momencie jej uruchomienia."></div>
    <div class="cmw-item" data-left="Definicja" data-right="Skonstruowanie schematu funkcji i zapisanie go w pamięci (przepis, który jeszcze nie działa)."></div>
    <div class="cmw-item" data-left="Wywołanie" data-right="Fizyczne nakazanie procesorowi wykonania kodu zapisanego pod adresem funkcji."></div>
  </data-connection-matcher>
</data-gate>

---

## 🛡️ Zasięg zmiennych (Scope) i Kopiowanie Wartości

Uruchamiając powyższy kod w symulacji krok po kroku, na pewno zauważysz dziwne zachowanie: chociaż na ekranie wypisywane są kolejne użycia czarów, to nasza globalna zmienna `mana` na samym dole cały czas wynosi `50` i nie ulega zmniejszeniu!

To nie błąd Krokera – to fundamentalna zasada bezpieczeństwa w programowaniu. Działają tu dwa powiązane ze sobą mechanizmy: **zbieżność nazw (shadowing)** oraz **kopiowanie wartości (pass-by-value)**.

### 1. Zbieżność nazw (Shadowing)
W programie głównym zdefiniowaliśmy zmienną `mana = 50`. Wewnątrz funkcji również użyliśmy słowa `mana`. Dla komputera są to jednak **dwie całkowicie inne zmienne**, leżące w innych szufladach pamięci RAM:
- **Zmienna globalna (`mana`):** Żyje w głównym programie i jest widoczna wszędzie.
- **Zmienna lokalna (`mana`):** Zostaje stworzona wewnątrz funkcji `RzucCzar` wyłącznie na potrzeby jej wywołania. Istnienie zmiennej lokalnej tymczasowo „zasłania” zmienną globalną o tej samej nazwie.

### 2. Kopiowanie wartości (Pass by Value)
Języki programowania domyślnie przekazują argumenty liczbowe lub tekstowe jako kopie. Funkcja `RzucCzar` nie dostała dostępu do oryginalnej komórki pamięci, w której leży globalna `mana`. Dostała jedynie jej kserokopię o wartości `50`. Modyfikując ją (`mana = mana - kosztMany`), funkcja zmienia swoją własną, lokalną kopię, podczas gdy oryginał w programie głównym pozostaje nietknięty. Jest to zachowanie bezpieczne, bo chroni program przed przypadkowym zniszczeniem danych.

### 3. Czas życia zmiennych lokalnych
Zmienne lokalne i parametry żyją wyłącznie w trakcie wykonywania funkcji. Po napotkaniu instrukcji `KONIEC FUNKCJI` cała lokalna szuflada pamięci zostaje natychmiast opróżniona i usunięta z pamięci RAM. W symulacji Krokera możesz zaobserwować to na własne oczy: po zakończeniu czaru, lokalne zmienne po prostu znikają ze stosu!

Dzięki tej izolacji programiści mogą bezpiecznie używać tych samych popularnych nazw (jak `i` czy `wynik`) w różnych funkcjach bez ryzyka, że kod jednego programu nadpisze zmienne drugiego.

---

## 🖨️ Procedury (Void) kontra Funkcje Zwracające

Skoro funkcja pracuje jedynie na kopiach i niszczy swoje zmienne lokalne po zakończeniu pracy, jak możemy przekazać zmieniony stan (np. nową wartość many) z powrotem do głównego programu?

Do tego służy podział podprogramów na dwie klasy:

1. **Procedury bez zwrotu (Typ Void)**
Są to sekwencje instrukcji wywołujące w systemie zmianę stanu (np. usunięcie pliku, nawiązanie połączenia, lub wypisanie czegoś na ekranie za pomocą `WYPISZ`). Procedura kończy pracę i ginie – nie generuje na swoim końcu żadnej wartości wyjściowej, którą program mógłby wykorzystać do dalszych obliczeń. Nasza funkcja `RzucCzar` w obecnej formie jest właśnie taką procedurą.

2. **Funkcje Zwracające (Typ Return)**
Działają jak linie produkcyjne, które mają przetworzyć surowiec i wypluć gotowy produkt. Na ich końcu zawsze widnieje instrukcja **`ZWRÓĆ`**. Przekazuje ona obliczoną wartość (np. liczbę lub tekst) z powrotem do programu głównego.

Największym błędem początkujących programistów jest utożsamianie instrukcji wyjścia wizualnego (`WYPISZ`) ze zwrotem wartości (`ZWRÓĆ`). 
- `WYPISZ` to wysłanie paczki na ekran monitora. Procesor nigdy już jej nie odzyska i nie wykorzysta do dalszych obliczeń.
- `ZWRÓĆ` to dostarczenie wyliczonej wartości dokładnie w to miejsce w pamięci, z którego wywołano funkcję.

Jeśli chcielibyśmy zaktualizować manę bohatera po rzuceniu czaru, musielibyśmy napisać funkcję zwracającą nową wartość many i przypisać ją w programie głównym:

```php
FUNKCJA ObliczNowaMane(aktualnaMana, koszt)
    ZWRÓĆ aktualnaMana - koszt
KONIEC FUNKCJI

// Użycie w programie głównym:
mana = ObliczNowaMane(mana, 20)
```

---

## 🧱 Dekompozycja i Jedna Odpowiedzialność (SOLID)

W profesjonalnym środowisku inżynierowie kierują się zbiorem zasad znanych jako **SOLID**. Pierwsza litera tego akronimu to _**Single Responsibility Principle**_ (Zasada Jednej Odpowiedzialności). 

Reguła ta głosi, że każda funkcja powinna odpowiadać wyłącznie za jeden, ściśle zdefiniowany mechanizm. Modułowość kodu to nie tylko redukcja duplikatów, ale przede wszystkim unikanie nierozerwalnych, monstrualnych zrostów logicznych, których nie da się testować w izolacji.

Wyobraź sobie, że ktoś zaprojektował następujący podprogram:  
```php
FUNKCJA PobierzUzytkownika_SprawdzHaslo_IWyslijEmail(ID)
```

Złamał on całkowicie zasadę jednej odpowiedzialności. Ten kod jest nieweryfikowalny i wysoce niebezpieczny dla integralności systemu:
- Jeśli zewnętrzny serwer pocztowy ulegnie awarii (zgłaszając **_błąd wykonania_**), cała funkcja zawiesi się i zablokuje proces logowania, mimo że hasło klienta było całkowicie poprawne!
- Nie możemy ponownie użyć tego mechanizmu w sytuacji, w której chcemy jedynie poprosić użytkownika o potwierdzenie hasła przed usunięciem konta.

Stosując modułową atomizację, rozdziela się te zadania na oddzielne kroki:

```php
DaneKonta = PobierzUzytkownika(ID)
CzyZgodne = ZweryfikujHaslo(DaneKonta, "sekretne_haslo")

JEŻELI CzyZgodne TO
    WyslijPowiadomienie(DaneKonta)
KONIEC JEŻELI
```

Każda z tych trzech funkcji wykonuje w systemie perfekcyjnie tylko jedno zadanie. W przypadku awarii sieci, błąd wyrzuci wyłącznie procedura pocztowa, co pozwala aplikacji bezpiecznie sfinalizować uwierzytelnienie klienta.

---

## 📚 Anatomia Stosu Wywołań (Call Stack)

Skoro funkcje tworzą hermetyczne bańki, czy możemy wywołać kolejną funkcję z wnętrza aktualnie działającej funkcji? 

Tak. Architektura procesora obsługuje tzw. zagnieżdżenia za pomocą zaawansowanej struktury zwanej stosem wywołań (*Call Stack*). Zasada działania przypomina układanie brudnych talerzy w zlewie (mechanizm <b>LIFO</b> – *Last In, First Out*).
- System wykonuje główny program (stół). Nagle napotyka rozkaz wywołania **Funkcji A**.
- Usypia stół, zapisuje zakładkę w pamięci, a na górze układa pierwszy talerz (**Funkcja A**). 
- Jeśli **Funkcja A** zawoła w środku _**Funkcję B**_, to procesor usypia również **Funkcję A**, a na samą górę stosu dokłada nowy talerz (_**Funkcja B**_).
- Ponieważ maszyna potrafi czytać tylko to, co leży na samym wierzchu – bezwzględnie musi zakończyć i zniszczyć _**Funkcję B**_, zrzucić ją ze stosu, i dopiero wtedy odsłania uśpioną **Funkcję A**, do której przesyła wyliczony wynik.

Przeanalizuj z bliska poniższą symulację. Zwróć szczególną uwagę na panel Pamięci RAM. Gdy maszyna skacze w głąb struktury, zmienne powołane w programie głównym znikają z wokandy roboczej. Na ich miejsce rodzą się parametryczne zmienne izolowane ze specjalną etykietą `(Lokalna)`.

<data-gate>
<data-pseudocode-runner expected-output="Ostateczny wynik wynosi:">
<pre>
FUNKCJA Podwoj(Wartosc)
    WynikLokalny = Wartosc * 2
    ZWRÓĆ WynikLokalny
KONIEC FUNKCJI

FUNKCJA Dodaj_i_Podwoj(X, Y)
    SumaTymczasowa = X + Y
    Ostatecznie = Podwoj(SumaTymczasowa)
    ZWRÓĆ Ostatecznie
KONIEC FUNKCJI

Baza = 10
Modyfikator = 5
Rezultat = Dodaj_i_Podwoj(Baza, Modyfikator)

WYPISZ "Ostateczny wynik wynosi:"
WYPISZ Rezultat
</pre>
</data-pseudocode-runner>
</data-gate>

<data-gate>
  <data-sortable-list title="Ułóż prawidłowo etapy cyklu życia Call Stacka dla powyższego algorytmu:">
    <item data-correct="2">Rozbudzona funkcja *`Dodaj_i_Podwoj`* wylicza sumę na swoich lokalnych zmiennych i wywołuje Funkcję **`Podwoj`**, ponownie usypiając samą siebie.</item>
    <item data-correct="4">Z najwyższego punktu stosu, ukończona Funkcja **`Podwoj`** zwalnia całą swoją pamięć lokalną, a maszyna cofa się powracając w głąb do *`Dodaj_i_Podwoj`*.</item>
    <item data-correct="1">Główny program inicjuje wywołanie zewnętrznej funkcji *`Dodaj_i_Podwoj`* i natychmiast zostaje wstrzymany (uśpiony) przez maszynę na samym dole stosu.</item>
    <item data-correct="5">Funkcja *`Dodaj_i_Podwoj`* wykonuje komendę _**`ZWRÓĆ`**_, ulega całkowitemu zniszczeniu i zrzuca finałową liczbę wprost do rozbudzonego programu głównego.</item>
    <item data-correct="3">Umieszczona na samym szczycie nowa Funkcja **`Podwoj`** jest przetwarzana przez procesor wewnątrz własnej, hermetycznej bańki pamięci.</item>
  </data-sortable-list>
</data-gate>

---

## ⚖️ Fotokopia kontra Dokument (Wartość a Referencja)

Mechanizmy wstrzykiwania argumentów do wnętrza funkcji stanowią jeden z najważniejszych etapów nauki oprogramowania. Musisz zawsze odpowiedzieć sobie na pytanie: czy moja funkcja dostała do ręki oryginał, czy jedynie kopię danych?

Jak dowiedziałeś się z sekcji o zasięgu zmiennych, domyślne zachowanie komputera dla typów prostych to **kopiowanie wartości** (*Pass-by-Value*). Aby lepiej zrozumieć różnicę między kopiowaniem a referencją, porównajmy oba podejścia:

1. **Typy proste (Przekazywanie przez Wartość):**
Zmienne przechowujące pojedyncze liczby czy teksty ważą bardzo mało. Podczas wywołania funkcji procesor po prostu wykonuje ich szybką **kserokopię**. Jeśli funkcja zmodyfikuje tę wartość, oryginał w programie głównym pozostaje nietknięty i bezpieczny.

2. **Typy złożone (Przekazywanie przez Referencję / *Pass-by-Reference*):**
Wyobraź sobie tablicę złożoną z miliona wpisów. Tworzenie jej kopii przy każdym wywołaniu funkcji zabiłoby wydajność i szybko zapchało pamięć RAM. Dlatego typy złożone (jak tablice czy obiekty) nie są kopiowane. Zamiast tego funkcja otrzymuje **referencję** – czyli wskaźnik (link) do oryginalnego miejsca w pamięci.
Przypomina to udostępnienie komuś linku do dokumentu na Dysku Google. Funkcja nie traci czasu na kopiowanie danych. Pamiętaj jednak: jeśli funkcja za pomocą tego linku usunie lub zmodyfikuje jakiś wpis, zmiana ta natychmiast dotknie Twój oryginalny zbiór danych!

## 🔬 Dowód empiryczny (Wartość a Referencja)

Aby zobaczyć ten proces w praktyce, przeanalizuj poniższą symulację. Tworzymy w niej funkcję `ZniszczDane`, która przypisuje swoim dwóm parametrom wartość `999`. 

Do funkcji przesyłamy:
- Zwykłą zmienną liczbową (`TestLiczby = 5`) – przekazywaną jako **kopia wartości** (*Pass-by-Value*).
- Tablicę (`TestTablicy = [100, 200, 300]`) – przekazywaną jako **referencja** (*Pass-by-Reference*).

Uruchom Krokera krok po kroku i zaobserwuj stan pamięci oraz wyjście w konsoli. Zwróć uwagę, że:
- Zmienna `TestLiczby` opiera się destrukcji i zachowuje wartość `5` (ponieważ funkcja zmodyfikowała jedynie jej tymczasową fotokopię).
- Z tablicy `TestTablicy` trwale znika pierwsza wartość `100` i zostaje zastąpiona przez `999` (ponieważ funkcja otrzymała bezpośredni link do oryginalnego adresu w pamięci).

<data-gate>
<data-pseudocode-runner>
<pre>
FUNKCJA ZniszczDane(ZwyklaLiczba, CiezkaTablica)
    ZwyklaLiczba = 999
    CiezkaTablica[0] = 999
KONIEC FUNKCJI

TestLiczby = 5
TestTablicy = [100, 200, 300]

ZniszczDane(TestLiczby, TestTablicy)

WYPISZ "Liczba chroniona fotokopią:"
WYPISZ TestLiczby

WYPISZ "Pierwszy indeks tablicy po modyfikacji linku:"
WYPISZ TestTablicy[0]
</pre>
</data-pseudocode-runner>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Unikanie duplikacji (Zasada DRY):** Funkcje są rozwinięciem zasady *Don't Repeat Yourself*. Centralizują kod w jednym miejscu, dzięki czemu ewentualna zmiana mechaniki (np. dodanie mikstury wzmacniającej czary) wymaga modyfikacji tylko jednego szablonu zamiast dziesiątek rozproszonych przycisków.
- **Definicja a Wywołanie:** Samo zadeklarowanie funkcji (definicja) to tylko zapisanie przepisu w pamięci. Dopiero wywołanie funkcji (podanie jej nazwy z argumentami) zmusza procesor do skoku pod jej adres i wykonania obliczeń.
- **Odizolowany Zasięg (Scope):** Każda funkcja to zamknięty obszar pamięci. Zmienne lokalne i parametry żyją tylko w trakcie jej działania i znikają ze stosu po zakończeniu obliczeń, co chroni program przed kolizjami nazw zmiennych.
- **Wypisanie a Zwrot (Void a Return):** Procedury bez zwrotu (*Void*) tylko zmieniają stan lub wypisują dane na ekranie (`WYPISZ`), natomiast funkcje zwracające (*Return*) przesyłają wyliczoną wartość (`ZWRÓĆ`) z powrotem do programu głównego, umożliwiając dalsze operacje matematyczne.
- **Kserokopia kontra Link:** Typy proste są przekazywane jako kopia wartości, więc ich modyfikacja w funkcji nie wpływa na zmienne na zewnątrz. Typy złożone (jak tablice) przekazujemy przez referencję (link do pamięci), przez co funkcja może trwale zmienić ich zawartość.
