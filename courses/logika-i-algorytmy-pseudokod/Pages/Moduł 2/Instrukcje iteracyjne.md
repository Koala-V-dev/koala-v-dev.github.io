# Instrukcje Iteracyjne: Czystrzy przepływ

Programowanie opiera się na automatyzacji. Jeśli musisz wykonać tę samą czynność wielokrotnie, nie powtarzasz tych samych linijek kodu. Komputer doskonale radzi sobie z powtarzalnymi zadaniami. Służą do tego **instrukcje iteracyjne**, powszechnie nazywane pętlami.

> [!IMPORTANT]
> **Zasada DRY (Don't Repeat Yourself)**
> Unikaj powielania tych samych fragmentów kodu metodą kopiuj-wklej. Wyobraź sobie, że po napisaniu takiego zduplikowanego kodu klient nagle zażąda zmiany jednej funkcji. Czeka Cię wtedy skrajnie upierdliwe poprawianie kodu w $100$, $200$, a nawet $1000$ miejscach jednocześnie. 😫
> Powtarzające się bloki kodu należy zawsze wydzielać do osobnych struktur.

> [!NOTE]
> **Pojęcie refaktoryzacji** (_**Refactoring**_)
> Refaktoryzacja to proces modyfikacji kodu źródłowego, który poprawia jego strukturę, czytelność oraz wydajność bez zmiany zewnętrznego działania programu. Pomaga to utrzymać czystość i łatwość rozbudowy aplikacji w przyszłości.

---

## 🕰️ Prehistoria Pętli: Instrukcja skoku (<code>GOTO</code>)

Przed wprowadzeniem nowoczesnych pętli strukturalnych programiści stosowali instrukcję skoku bezwarunkowego: `GOTO` (*idź do*). Wymagała ona zdefiniowania w kodzie etykiety, do której program natychmiast przenosił wykonywanie instrukcji.

```cmd
etykieta START:
WYPISZ "Wykonujemy krok!"
GOTO START
```

Konstrukcja ta była bardzo zbliżona do fizycznego działania procesora (instrukcji `JMP` w asemblerze). Jednak nadużywanie `GOTO` prowadziło do powstawania kodu o skomplikowanej strukturze, w której przepływ sterowania był trudny do prześledzenia. Zjawisko to określa się jako **_spaghetti code_**.

W $1968$ roku *Edsger W. Dijkstra* opublikował słynny artykuł [„Go To Statement Considered Harmful”](https://bioinfo.uib.es/~joemiro/teach/material/escritura/gotoharmfulCol.pdf). Publikacja ta zapoczątkowała powszechne przejście na paradygmat **programowania strukturalnego**. Wprowadzono zamknięte, czytelne pętle, które całkowicie wyparły instrukcję `GOTO`.

<details>
<summary><b>Dla dociekliwych: Manifest Dijkstry – dlaczego GOTO musiało zginąć?</b></summary>

Poniżej znajdziesz opracowanie słynnego listu **„Go To Statement Considered Harmful”** opublikowanego w marcu $1968$ roku w „Communications of the ACM”. Ten krótki tekst zmienił na zawsze historię programowania i dał początek programowaniu strukturalnemu.

---

> Przez lata obserwowałem, że jakość programistów maleje wraz z rosnącym zagęszczeniem instrukcji `GOTO` w ich kodzie. Doszedłem do wniosku, że instrukcja skoku ma katastrofalne skutki i powinna zostać usunięta ze wszystkich języków wysokiego poziomu.

Dijkstra zauważył, że ludzki mózg doskonale radzi sobie ze zrozumieniem rzeczy statycznych (jak tekst na kartce), ale jest bardzo słaby w wyobrażaniu sobie procesów dynamicznych, czyli tego, jak program zmienia się w czasie, gdy jest wykonywany przez procesor.

Dlatego jako mądrzy programiści powinniśmy zrobić wszystko, aby zniwelować przepaść między **statycznym kodem** (tym, co widzimy w edytorze) a **dynamicznym procesem** (tym, co robi komputer). Im łatwiej z kodu wywnioskować, w którym momencie czasu znajduje się program, tym lepiej.

**Problem lokalizacji:**  
Jeśli program nie ma `GOTO`, śledzenie jego stanu jest banalne. Wiemy dokładnie, w której linijce jesteśmy. Gdy wchodzimy do funkcji, możemy śledzić to na stosie wywołań. Gdy wchodzimy w pętlę, dodajemy po prostu „indeks dynamiczny”, co oznacza, że wiemy np. o „czwartym powtórzeniu pętli”. Dzięki temu dokładnie wiemy, co program w danej chwili robi i dlaczego.

> Rozumiemy wartość zmiennej tylko w kontekście tego, jak przebiegał proces. Jeśli liczymy ludzi w pokoju zwiększając zmienną `n`, to wartość `n` ma sens tylko wtedy, gdy wiemy, na jakim etapie programu jesteśmy. 

**Niszczycielska siła GOTO:**  
Dijkstra udowadnia, że nieokiełznane używanie instrukcji `GOTO` niszczy ten porządek. Przez możliwość skoku z dowolnego miejsca do dowolnego miejsca, całkowicie tracimy pojęcie o tym, *jak program dotarł do tego punktu*. Znalezienie „współrzędnych” określających, gdzie w czasie znajduje się proces, staje się potwornie trudne.

To właśnie z powodu tego listu branża IT porzuciła `GOTO` i wprowadziła konstrukcje strukturalne, takie jak znane Ci pętle `WHILE` i `FOR`, które w sposób bezpieczny zamykają kod w przewidywalnych ramach.

---
</details>

---

## 🏗️ Anatomia Pętli i Warunki Kontrolne

Każda prawidłowo zaprojektowana pętla musi opierać się na trzech podstawowych elementach:

1. **Inicjalizacja (stan początkowy):** Ustalenie wartości startowej zmiennej sterującej, na przykład `Krok = 1`.
2. **Warunek stopu:** Warunek logiczny sprawdzany przed każdym cyklem pętli. Jeśli warunek staje się fałszywy, pętla kończy działanie.
3. **Modyfikacja stanu (inkrementacja lub dekrementacja):** Zmiana wartości licznika wewnątrz pętli. Brak modyfikacji licznika uniemożliwi osiągnięcie warunku stopu. Modyfikację wykonujemy poprzez:
   - **Inkrementację** (zwiększanie wartości): `Krok = Krok + 1` lub `Krok++`.
   - **Dekrementację** (zmniejszanie wartości): `Krok = Krok - 1` lub `Krok--`.

> [!WARNING]
> Po raz kolejny wspomnę o **_Nieskończonej pętli (Infinite Loop)_** (to jeden z najpoważniejszych błędów logicznych, skutkujący zablokowaniem wątku aplikacji lub przepełnieniem pamięci). Najczęściej wynika z braku **degradacji stanu** lub z wiecznie prawdziwego warunku stopu, na przykład `1 > 0`.
> 
> Możliwe, że już to pojąłeś, ale _**infinite loop**_ zdarza się każdemu, więc warto o nim przypominać! 😅

---

## 🔠 Konwencja indeksowania: Tajemnica zmiennych <code>i</code>, <code>j</code>, <code>k</code>

Z pewnością spotkasz się z tym, że zmienna sterująca (licznik) w pętli nazywa się po prostu literą `i`.  
Dlaczego nie `licznik`, `krok` czy `x`?

Jest to powszechna **konwencja programistyczna**, mająca swoje korzenie w:
- **Słowie** *„Index”* / *„Iterator”*: Litera `i` jest po prostu skrótem od tych pojęć.
- **Historii** (język Fortran): W jednym z najstarszych języków o nazwie Fortran, istniała zasada, według której zmienne zaczynające się od liter `I, J, K, L, M, N` były *domyślnie* traktowane przez kompilator jako liczby całkowite (Integer), bez konieczności deklaracji! 

Skoro główna pętla wykorzystuje `i`, co w przypadku, gdy wewnątrz jednej pętli chcemy stworzyć drugą (tzw. zagnieżdżenie)? Zgodnie z tradycją bierze się po prostu kolejne litery z alfabetu:
- Zewnętrzna pętla: `i`
    - Pętla zagnieżdżona wewnątrz niej: `j`
        - Głębokie zagnieżdżenie (rzadko używane): `k`

---

## 🔢 Pętla DLA (<code>FOR</code>)

Pętlę `DLA` stosujemy wtedy, gdy przed uruchomieniem iteracji **znamy dokładną liczbę powtórzeń**. Wszystkie trzy elementy (inicjalizacja, warunek stopu oraz modyfikacja stanu) są zapisane w jednej linijce nagłówka pętli.

Licznik `i` jest modyfikowany automatycznie przy każdym obiegu.

<data-gate>
<data-pseudocode-runner>
<pre>
WYPISZ "Zaczynamy odliczanie!"

DLA i OD 1 DO 5
    WYPISZ "Obieg pętli numer:"
    WYPISZ i
KONIEC DLA

WYPISZ "Koniec pętli DLA"
</pre>
</data-pseudocode-runner>
</data-gate>

---

## ⏳ Pętla DOPÓKI (<code>WHILE</code>)

Pętlę `DOPÓKI` wykorzystujemy wtedy, gdy **nie znamy z góry liczby powtórzeń**. Wykonywanie kodu jest uzależnione od spełnienia określonego warunku (np. dopóki plik nie zostanie pobrany lub dopóki użytkownik nie kliknie przycisku).

Należy pamiętać o ręcznym aktualizowaniu warunku wewnątrz pętli, aby zapobiec pętli nieskończonej.

<data-gate>
<data-pseudocode-runner>
<pre>
punktyZycia = 3

DOPÓKI punktyZycia > 0
    WYPISZ "Gracz jest w trakcie walki..."
    WYPISZ "Gracz otrzymuje obrażenia! (-1)"
    punktyZycia = punktyZycia - 1
KONIEC DOPÓKI

WYPISZ "Koniec gry! Brak punktów życia."
</pre>
</data-pseudocode-runner>
</data-gate>

---

## 🔁 Pętla z Warunkiem na Końcu: Dwie Interpretacje

W tradycyjnej pętli `DOPÓKI` warunek sprawdzany jest na samym początku. Jeśli jest on fałszywy przed pierwszym uruchomieniem, kod wewnątrz pętli nie wykona się ani razu.

Gdy jednak przenosimy sprawdzenie warunku na **sam koniec** pętli, świat programowania dzieli się na dwie zupełnie odmienne filozofie logiczne. Ta sama pętla z warunkiem na końcu posiada dwie wykluczające się interpretacje:

### 1. Klasa „Do-While” (Wykonuj DOPÓKI)
Większość współczesnych języków programowania (z rodziny C) realizuje podejście typu **„do-while”** (wykonuj, dopóki...).
- **Logika:** Pętla powtarza się tak długo, jak warunek jest **prawdziwy** (`true`). Kończy działanie, gdy warunek stanie się fałszywy (`false`).
- **Język naturalny:** „Pij wodę, dopóki jesteś spragniony”.

### 2. Klasa „Repeat-Until” (Powtarzaj AŻ)
Języki oparte na czytelności oraz szkolne pseudokody realizują podejście typu **„repeat-until”** (powtarzaj, aż...).
- **Logika:** Pętla powtarza się tak długo, jak warunek jest **fałszywy** (`false`). Kończy działanie, gdy warunek zostanie spełniony i stanie się prawdziwy (`true`).
- **Język naturalny:** „Pij wodę, aż ugasisz pragnienie”.

Zobacz zestawienie tych dwóch światów programistycznych:

| Klasa „DOPÓKI Prawda” (Do-While / While) | Klasa „AŻ Prawda / DOPÓKI Fałsz” (Repeat-Until / Until) |
| :--- | :--- |
| **Pętla kręci się, gdy warunek = `true`.**<br>*Kończy bieg, gdy warunek = `false`.* | **Pętla kręci się, gdy warunek = `false`.**<br>*Kończy bieg, gdy warunek = `true`.* |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" width="24" height="24" class="logo"> **C++** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/delphi/delphi-original.svg" width="24" height="24" class="logo"> **Pascal / Delphi** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="24" height="24" class="logo"> **JavaScript (JS)** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" width="24" height="24" class="logo"> **Ruby** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" width="24" height="24" class="logo"> **PHP** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lua/lua-original.svg" width="24" height="24" class="logo"> **Lua** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" width="24" height="24" class="logo"> **C#** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg" width="24" height="24" class="logo"> **Bash (Linux shell)** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" width="24" height="24" class="logo"> **Java** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg" width="24" height="24" class="logo"> **Perl** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg" width="24" height="24" class="logo"> **Swift** | <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/VB.NET_Logo.svg" width="24" height="24" class="logo"> **Visual Basic** |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" width="24" height="24" class="logo"> **Go (Golang)** | <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24" style="vertical-align: middle;"><path d="M30 40 L10 64 L30 88 M98 40 L118 64 L98 88 M75 25 L53 103" stroke="#2563eb" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg> **Pseudokod szkolny** |

> [!CAUTION]
> **Pułapka dla programistów C++, PHP, Java oraz JavaScript!**
> W pseudokodzie instrukcja `AŻ` (ang. *Until*) jest bezpośrednim zaprzeczeniem logiki `do-while`. Pętla zakończy działanie w momencie, gdy warunek po słowie `AŻ` da wynik prawdziwy (zostanie spełniony). Różnica ta jest tak nieintuicyjna dla osób z nawykami z języków C-podobnych, że mylą się w tym punkcie nawet deweloperzy z wieloletnim stażem!

<data-gate>
<data-pseudocode-runner>
<pre>
proby = 5

POWTARZAJ
    WYPISZ "Próba logowania..."
    proby = proby + 1
AŻ proby >= 3

WYPISZ "Logowanie zakończone (sukces lub blokada konta)."
</pre>
</data-pseudocode-runner>
</data-gate>

**Dlaczego pętla wykonała się tylko raz? Prześledźmy to krok po kroku:**
- **Inicjalizacja:** Zmienna `proby` na starcie otrzymuje wartość `5`.
- **Pierwsze uruchomienie:** Kod wewnątrz pętli wykonuje się bez sprawdzania warunku. Wypisuje komunikat i zwiększa wartość `proby` do `6`.
- **Sprawdzenie warunku:** Dopiero po wykonaniu instrukcji program sprawdza warunek `AŻ proby >= 3` (czyli `AŻ 6 >= 3`).
- **Zakończenie:** Ponieważ warunek `6 >= 3` daje wynik prawdziwy (cel został osiągnięty), pętla natychmiast kończy swoje działanie.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Ewolucja struktur:** Instrukcja `GOTO` została zastąpiona przez nowoczesne pętle, co zapobiega powstawaniu nieczytelnego kodu typu **_spaghetti code_**.
- **Nazewnictwo iteratorów:** Nazwy `i`, `j`, `k` to tradycyjny skrót od słów *Index* i *Iterator*, wywodzący się z reguł języka Fortran.
- **Modyfikacja licznika:** Pętle wymagają kontrolowania zmiany stanu licznika, aby zapobiec zablokowaniu programu w pętli nieskończonej.
- **Pętla DLA (FOR):** Służy do realizacji z góry określonej liczby powtórzeń.
- **Pętla DOPÓKI (WHILE):** Wykonuje się dopóki określony warunek logiczny jest spełniony.
- **Pętla z warunkiem na końcu:** Gwarantuje przynajmniej jedno wykonanie bloku kodu. W językach C-podobnych działa dopóki warunek jest spełniony (`do-while`), natomiast w pseudokodzie i Pascalu kończy bieg w momencie spełnienia warunku (`repeat-until`).
