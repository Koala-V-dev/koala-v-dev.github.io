# Indukcja Matematyczna: Okiełznanie Nieskończoności

Pamiętasz początek kursu i lekcję „Zapis matematyczny”? Twój mózg zareagował wtedy instynktownym **_„NIEBEZPIECZEŃSTWO!”_** na widok tego wzoru. Dziś, wyposażony w rygor logiczny Modułu 2, spojrzysz na niego nie jak na „szkolne zadanie”, ale jak na **model behawioralny systemu** sumującego dane od $1$ do $n$:

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

Wtedy nauczyliśmy się go tylko czytać. Dziś dokonamy jego **Weryfikacji Formalnej**. Udowodnimy ponad wszelką wątpliwość, że ten wzór jest niepodważalną prawdą dla każdego $n \in \mathbb{N}$, od 1 do nieskończoności. 

Zanim jednak uruchomimy ciężką inżynierię dowodową, musimy zrozumieć, jaką **lukę w systemie** wykorzystuje ten wzór.

---

## 💡 Skąd ten wzór? Trik młodego Gaussa

Wyobraź sobie klasę w XVIII wieku. Nauczyciel matematyki, chcąc zająć uczniów na całą godzinę, każe im dodać do siebie wszystkie liczby od $1$ do $100$.

Wszyscy uczniowie mozolnie dodają: $1 + 2 = 3$, $3 + 3 = 6$, $6 + 4 = 10$... po paru minutach każdy gubi się w obliczeniach i zaczyna od nowa. Tymczasem mały, $10$-letni _**Carl Friedrich Gauss**_ po kilku sekundach kładzie na biurku tabliczkę z gotowym, poprawnym wynikiem: **$5050$**.

Jak to zrobił? Zamiast liczyć bezmyślnie po kolei, Gauss zauważył niesamowitą symetrię ukrytą w dodawaniu.  
Rozpisał sobie liczby i zaczął łączyć skrajne wartości w pary:

- Pierwsza z ostatnią: $1 + 100 = 101$
- Druga z przedostatnią: $2 + 99 = 101$
- Trzecia z trzecią od końca: $3 + 98 = 101$
...i tak aż do środka: $50 + 51 = 101$.

<data-gate>
<data-quiz>
  <question>Skoro Gauss łączył $100$ liczb w takie pary i z każdej pary zawsze wychodziło mu $101$, to jakie genialne równanie stworzył, by policzyć całość w kilka sekund?</question>
  <options>
    <option>$100 \cdot 101$</option>
    <option correct>$50 \cdot 101$</option>
    <option>$101 \cdot 101$</option>
  </options>
  <div data-hint="error">Mamy $100$ elementów. Skoro łączymy je w pary po dwa, to ile takich par powstanie? Przemnóż liczbę par przez stałą sumę pojedynczej pary.</div>
  <div data-hint="success">Dokładnie tak! Powstaje $50$ par (połowa wszystkich liczb), a każda para daje sumę $101$. Wynik to $50 \cdot 101 = 5050$.</div>
</data-quiz>
</data-gate>

Zrozumiałeś właśnie intuicję kryjącą się za wzorem na sumę! 😄
Gdy mamy liczby od $1$ do $n$:
- Ostatnia liczba w parze z pierwszą to zawsze $(n + 1)$.
- Ilość takich par to zawsze połowa wszystkich elementów, czyli $\frac{n}{2}$.

Mnożąc te dwie rzeczy, otrzymujesz:
$$ \text{ilość par} \times \text{suma pary} \implies \frac{n}{2} \cdot (n+1) \implies \frac{n(n+1)}{2} $$

## ⚙️ Dlaczego intuicja to za mało? Dowodzenie Nieskończoności

Historia o Gaussie jest genialna i — co ważne — jego wzór działa bezbłędnie dla **każdej** liczby.  
Możesz to zweryfikować dla $n=5$: 
$$\text{Dla } n=5: \frac{5 \cdot (5+1)}{2} = 15$$, co zgadza się z sumą $1+2+3+4+5$. Gdzie więc leży problem?

W tym, że pojedyncze sprawdzenie (nawet dla miliona liczb) to wciąż tylko **poszlaka**, a nie **dowód**. W inżynierii systemów krytycznych nie możesz zakładać, że skoro mechanizm działał przez $100$ dni, to nie wybuchnie $101$-go dnia z powodu specyficznej kaskady błędów. 

Potrzebujesz _**gwarancji procesowej**_, że struktura logiczna Twojego rozwiązania jest nienaruszalna dla każdego możliwego kroku. Do tego służy **Indukcja Matematyczna**: mechanizm, który pozwala dowieść nieskończonej liczby faktów przy użyciu tylko dwóch kroków.

### ⛓️‍💥 Architektura Łańcucha (Domino i Rekurencja)

Indukcja ma swojego potężnego bliźniaka w świecie cyfrowym: **rekurencję**. 

> [!NOTE]
> **Rekurencja** to technika programistyczna, w której funkcja rozwiązuje problem, wywołując samą siebie dla mniejszego zestawu danych, aż dotrze do najprostszego przypadku. Gdy go rozwiąże, lawinowo zacznie zwracać wyniki wstecz, budując finalne rozwiązanie.

To ten sam schemat logiczny:

<data-gate>
<data-connection-matcher>
    <item left="Baza Indukcji (P(1))" right="Przypadek Bazowy (if n==1)"></item>
    <item left="Krok Indukcyjny" right="Wywołanie rekurencyjne (fn(n-1))"></item>
    <item left="Założenie Indukcyjne" right="Wynik z poprzedniego wywołania"></item>
</data-connection-matcher>
</data-gate>

---

1. **Baza (Base Case):** Punkt startowy. Sprawdzasz, czy system działa poprawnie dla najmniejszej możliwej wartości (zazwyczaj $n=1$). Jeśli pierwszy klocek domino nie upadnie, cała reszta jest bezużyteczna.
2. **Krok Przejścia (State Transition):** Sztafeta. Udowadniasz, że jeśli system jest stabilny w dowolnym kroku $k$ (**Założenie**), to Twoja architektura GWARANTUJE, że będzie stabilny również w kroku $k+1$ (**Teza**).

---

<data-gate>
<data-quiz>
  <question>Masz nienaganny matematycznie Krok Przejścia $P(k) \implies P(k+1)$, ale pominąłeś weryfikację Bazy ($n=1$). Co to oznacza dla integralności Twojego dowodu?</question>
  <options>
    <option>System jest stabilny, bo mechanizm „sztafety” gwarantuje ciągłość logiczną.</option>
    <option correct>System jest w stanie krytycznym, brak „punktu zakotwiczenia” unieważnia całą strukturę.</option>
    <option>Dowód jest poprawny, ponieważ krok przejścia zawiera w sobie definicję stanu początkowego.</option>
  </options>
  <div data-hint="error">BŁĄD! To myślenie życzeniowe. Masz świetny „transmiter”, ale nie masz sygnału. To jak kable sieciowe bez podłączonego serwera — infrastruktura przejścia istnieje, ale nie ma czego przesyłać.</div>
  <div data-hint="success">BINGO! W inżynierii nazywamy to błędem „Floating Bridge”. Bez sprawdzenia stanu początkowego, Twój dowód to tylko „obietnica” działania, która nigdy nie została zrealizowana w rzeczywistości. W kodzie skończyłoby się to nieskończoną rekurencją.</div>
</data-quiz>
</data-gate>

---

## 🏗️ Weryfikacja Formalna: Dowód Sumy

Udowodnijmy indukcyjnie wzór Gaussa, aby uzyskać $100\\%$ pewności dla każdego możliwego $n \in \mathbb{N}$.

**Teza P(n):**
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

### Krok 1: Baza Indukcji (Zapalnik)
Sprawdzamy stan dla $n = 1$:
- Lewa strona ($L$): Suma kończy się na pierwszej liczbie: $L = 1$.
- Prawa strona ($P$): Podstawiamy pod wzór: $P = \frac{1(1+1)}{2} = 1$.
**Wniosek:** $L = P$. Baza stoi stabilnie. ✅

### Krok 2: Krok Indukcyjny (Przeniesienie Stanu)
To serce dowodu. Musimy pokazać, że prawdziwość wzoru dla $k$ wymusza jego prawdziwość dla $k+1$.

1. **Założenie Indukcyjne $P(k)$:**
   Przyjmujemy, że wzór działa bezbłędnie dla pewnego $k$:
   $$1 + 2 + \dots + k = \frac{k(k+1)}{2}$$

2. **Teza Indukcyjna $P(k+1)$:**
  Chcemy udowodnić, że po dorzuceniu kolejnego $(k+1)$, suma przyjmie postać wzoru z podstawionym $k+1$\:
  $$1 + 2 + \dots + k + (k+1) = \frac{(k+1)(k+2)}{2}$$

---

### 🪤 Sandbox: Operacja na Stanie Systemu

Zaczynamy od lewej strony Tezy $P(k+1)$. Zauważ, że suma do $(k+1)$ to po prostu suma do $k$ (którą znamy z Założenia) plus ten ostatni element:

$$ \underbrace{1 + 2 + \dots + k}_{\text{To jest nasze } P(k)} + (k+1) \implies \frac{k(k+1)}{2} + (k+1) $$

Twoje zadanie: Sprowadź to wyrażenie do postaci docelowej $\frac{(k+1)(k+2)}{2}$. Wykaż, że mechanizm przejścia działa.

<details>
<summary>🛠️ Arsenał Operacyjny: Słownik Dowodowy</summary>

> [!NOTE]
> *Iniekcja Założenia*: To moment, w którym „wynajmujesz” gotową prawdę z poprzedniego kroku. Zamiast liczyć sumę od $1$ do $k$ od zera, wstawiasz tam gotowy blok (wzór) z Założenia. W inżynierii to jak użycie sprawdzonej biblioteki zamiast pisania wszystkiego od nowa.
> $$\forall x: $$ _**$$\underbrace{P(x)}_{założenie}$$**_ *$\implies$* **$$\underbrace{Q(x)}_{teza}$$**
>  
> *Synchronizacja Mianowników*: W matematyce ułamkowej nie możesz połączyć danych o różnych „częstotliwościach” (mianownikach). Musisz sprowadzić je do wspólnej bazy, aby móc scalić je w jedną strukturę. Robimy to przez „rozszerzenie” (mnożenie przez $1$ w formie $\frac{2}{2}$), co zmienia format, ale nie wartość danych.
> 
> *Konsolidacja / Scalenie*: Ostateczne „uprzątnięcie” wzoru. Połączenie rozproszonych ułamków w jedną, spójną strukturę pod wspólną kreską ułamkową.
> 
> *Ekstrakcja (Faktoryzacja)*: Kluczowy ruch optymalizacyjny. Jeśli masz wyrażenie typu $A \cdot \mathbf{(C+D)} + B \cdot \mathbf{(C+D)}$, to element w nawiasie jest Twoim „wspólnym mianownikiem logicznym”. Możesz go „wyjąć” przed nawias zbiorczy: $\mathbf{(C+D)} \cdot (A+B)$. 
> To dokładnie ten sam mechanizm „zarządzania strukturą”, który stosowałeś przy **Rozdzielności** w Algebrze i przy „wyciąganiu negacji” w **Prawach de Morgana**. Pozwala to uniknąć bałaganu po wymnożeniu.

</details>

> [!IMPORTANT]
> _**Złota Zasada Indukcji: Unikaj Algebraicznego Błota.**_
> Gdy widzisz wyrażenie typu $a(b+1) + x(b+1)$, Twoim pierwszym odruchem może być wymnożenie wszystkiego do postaci wielomianu $ab + a + xb + x$. **_Nie rób tego._**  
> To jak kompilowanie kodu do assemblera, żeby go zrozumieć (stracisz czytelną strukturę 😖). 
> 
> Zamiast tego szukaj „wspólnych klocków” (tutaj: $b+1$). Jeśli wyjmiesz go przed nawias, reszta ($a$ oraz $x$) sama ułoży się w docelową postać tezy: $(b+1)(a+x)$.

<data-gate>
<data-math-sandbox level="algebra" data-steps="4" data-label="Weryfikacja Strukturalna Wzoru Gaussa:">
  <div data-step="1" data-expected="\frac{k(k+1)}{2} + (k+1)" data-label="Iniekcja <strong>Założenia</strong> do struktury Tezy (Krok P(k) + następnik):" 
    data-hint-wrong="1+2+\dots+k+(k+1):💡 To jest lewa strona tezy. Teraz użyj Założenia i wstaw gotowy wzór w miejsce sumy $1+2+...+k$.|1+2+\dots+k:💡 To jest tylko lewa strona Założenia. W tym kroku budujemy P(k+1), więc musisz dodać kolejny wyraz: $(k+1)$.|1+2+\dots+(k+1):💡 To jest lewa strona tezy. Wykorzystaj Założenie, aby zamienić sumę do $k$ na gotowy wzór.|\frac{k(k+1)}{2}:💡 Prawie! To suma do $k$. Musisz dodać jeszcze następny wyraz: $(k+1)$."
    data-hints='{"FORM_MISMATCH": "💡 Podstaw wzór z Założenia za sumę początkową i dodaj $(k+1)$."}'></div>
  <div data-step="2" data-expected="\frac{k(k+1)}{2} + \frac{2(k+1)}{2}" data-label="<strong>Synchronizacja Mianowników</strong> i konsolidacja ułamka:" 
    data-hint-wrong="\frac{k(k+1)+2k+2}{2}:Nie wymnażaj nawiasów! Staraj się utrzymać bloki $(k+1)$, aby ułatwić faktoryzację.|\frac{k(k+1)}{2}+(k+1):💡 Musisz sprowadzić oba wyrazy do wspólnego mianownika (2)."></div>
  <div data-step="3" data-expected="\frac{k(k+1) + 2(k+1)}{2}" data-label="<strong>Scalenie</strong> dwóch ułamków z tym samym mianownikiem w całość:" 
    data-hint-wrong="\frac{k^2+k+2k+2}{2}:💡 Unikaj „algebraicznego błota”. Nie wymnażaj nawiasów, szukaj wspólnego czynnika $(k+1)$."
    data-hints='{"FORM_MISMATCH": "💡 Zapisz sumę ułamków pod jedną kreską ułamkową."}'></div>
  <div data-step="4" data-expected="\frac{(k+1)(k+2)}{2}" data-label="<strong>Ekstrakcja</strong> wspólnego czynnika $(k+1)$ przed nawias:" 
    data-hint-wrong="\frac{k^2+3k+2}{2}:💡 Nie wymnażaj wszystkiego! Zauważ, że masz dwa razy $(k+1)$, wyłącz je przed nawias, a w środku zostanie $(k+2)$."
    data-hints='{"FORM_MISMATCH": "💡 Wyłącz $(k+1)$ przed nawias, aby otrzymać docelową postać tezy."}'></div>
</data-math-sandbox>
</data-gate>

**Dowód zakończony:** Skoro baza $P(1)$ jest prawdziwa, a przejście $P(k) \implies P(k+1)$ zachowuje tę prawdę, to na mocy zasady indukcji wzór jest prawdziwy dla wszystkich liczb naturalnych. <span class="qed-symbol">∎</span>

---

## ⚡ Indukcja w architekturze bitowej: Potęgi Dwójki

Dowód sumy Gaussa to klasyka, ale jako inżynier częściej spotkasz indukcję tam, gdzie liczy się **pamięć i bity**. Udowodnijmy coś, co leży u podstaw adresowania: sumę potęg dwójki.

**Twierdzenie:** Suma kolejnych potęg liczby $2$ (od $2^0$ do $2^n$) jest zawsze o $1$ mniejsza niż kolejna potęga dwójki.
$$\sum_{i=0}^{n} 2^i = 2^{n+1} - 1$$

Przykład dla $n=2$ (3 bity): $1 + 2 + 4 = 7$ (czyli $2^3 - 1$). To dlatego największa liczba na $n$ bitach to zawsze „same jedynki”.

Dla przypomnienia wiedzy z kursu _**Binarne Fundamenty IT**_, oto <em>Tabela mocy</em>🦸:

| Wynik potęgowania| $2048$ |  $1024$ | $512$ | $256$ | $128$ | $64$ | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Potega dwójki| $2^{11}$ | $2^{10}$ | $2^{9}$ | $2^{8}$ | $2^{7}$ | $2^{6}$ | $2^{5}$ | $2^{4}$ | $2^{3}$ | $2^{2}$ | $2^{1}$ | $2^{0}$ |

<data-number-system target="255" base="2" digits="8">

> [!IMPORTANT]
> Wszystkie przełączniki **ON**! To jest limit dla $8$ bitów ($1$ Bajta). Kolejna liczba ($256$) wymagałaby już $9$. bitów!

</data-number-system>


### ⚡ Dowód Systemowy: Dlaczego $2^n - 1$ to limit?

Zauważyłeś pewnie, że największa liczba na 8 bitach to $255$ ($2^8 - 1$). Czy ta zasada jest uniwersalna? Sprawdźmy to indukcją, traktując proces jako **skalowanie rejestru**.

**Baza ($n=1$ bit):**
Na 1 bicie największa liczba to $1$. Wzór: $2^1 - 1 = 1$. Zgadza się. ✅

**Krok Indukcyjny (Skalowanie):**
Załóżmy, że dla rejestru o rozmiarze $k$ wzór działa (maksymalna wartość to $2^k - 1$). Co się stanie, gdy dołożymy kolejny bit o mocy $2^k$?

<details>
<summary> 🧩 Przypomnienie ważnej sekcji z lekcji o Potęgowaniu 😉</summary>
  
## 🧬 Algorytmy Operacyjne: Własności Potęg

W inżynierii rzadko operujemy na surowych wynikach. Kluczem jest **upraszczanie wyrażeń**. Jeśli podstawy są identyczne, możemy zarządzać złożonością poprzez manipulację samym wykładnikiem.

> [!IMPORTANT]
> **Zasada Izolacji:** Własności potęg działają **wyłącznie dla mnożenia i dzielenia**. 
> Próba „łączenia” potęg przy dodawaniu ($a^n + a^m$) to błąd krytyczny — w takim przypadku należy obliczyć wartości osobno lub wyłączyć wspólny czynnik przed nawias.

### 1. Agregacja wykładników (Mnożenie)
Mnożenie potęg o tej samej podstawie to sumowanie ich wykładników:
$$a^n \cdot a^m = a^{n+m}$$
### 2. Redukcja wykładników (Dzielenie)
Dzielenie to różnica wykładników:
$$\frac{a^n}{a^m} = a^{n-m}$$
### 3. Kompozycja wykładników (Potęga potęgi)
Podnoszenie potęgi do potęgi to iloczyn wykładników:
$$(a^n)^m = a^{n \cdot m}$$

> _**BONUS**_
> ### 4. Agregacja podstaw (iloczyn podstaw)
> Mnożenie potęg o tych samych wykładnikach to mnożenie podstaw:
> $$a^n \cdot b^n = (ab)^n$$
> ### 5. Redukcja podstaw (dzielenie podstaw)
> Dzielenie potęg o tych samych wykładnikach to dzielenie podstaw:
> $$\frac{a^n}{b^n} = (\frac{a}{b})^n$$
</details>

Wyobraź sobie to jako **agregację sprzętową**: masz stary rejestr (sumę) i dokładasz do niego nowy komponent (bit). Aby to uprościć, musisz zauważyć, że masz teraz **dwie identyczne potęgi** tego samego stopnia. 

> [!TIP]
> Pamiętaj o fundamentach: $x + x = 2 \cdot x$. W algebrze to najkrótsza droga do zwiększenia wykładnika!

<data-gate>
<data-math-sandbox level="algebra" data-steps="3" data-label="Skalowanie Rejestru ($k \to k+1$):">
  <div data-step="1" data-expected="(2^k - 1) + 2^k" data-label="<strong>Agregacja</strong>: Dodaj moc nowego bitu ($2^k$) do poprzedniego limitu ($2^k - 1$):" 
    data-hint-wrong="2^{k+1}-1:💡 Dobry wynik końcowy, ale najpierw zapisz operację 'stary limit + nowy bit'."></div>
  <div data-step="2" data-expected="2 \cdot 2^k - 1" data-label="<strong>Konsolidacja</strong>: Zgrupuj identyczne potęgi dwójki (zapisz ile ich masz):" 
    data-hint-wrong="2^{k+1}-1:💡 Prawie! Zanim połączysz potęgi, pokaż etap mnożenia przez 2 (czyli $2 \cdot 2^k - 1$).|4^k-1:⚠️ Uważaj! $2^k + 2^k$ to nie $4^k$. To dwie potęgi, czyli $2 \cdot 2^k$."></div>
  <div data-step="3" data-expected="2^{k+1} - 1" data-label="<strong>Optymalizacja</strong>: Zastosuj prawo mnożenia potęg ($2^1 \cdot 2^k$):" 
    data-hint-wrong="2 \cdot 2^k-1:💡 To już masz! Teraz użyj własności $a^n \cdot a^m = a^{n+m}$, aby otrzymać jedną potęgę."></div>
</data-math-sandbox>
</data-gate>

**Finał:** $2 \cdot 2^k - 1 = 2^{k+1} - 1$. 
Właśnie udowodniłeś, że dokładając dowolny bit, zawsze otrzymasz limit postaci „kolejna potęga minus 1”. To matematyczny fundament stabilności systemów liczbowych. <span class="qed-symbol">∎</span>🦾

---

## 🔩 Niezmiennik Pętli: Indukcja w Kodzie

To, co matematycy nazywają indukcją, w inżynierii oprogramowania jest fundamentem **poprawności algorytmicznej**. Kluczowe pojęcie to **Niezmiennik Pętli** (*Loop Invariant*).

Wyobraź sobie sortowanie kart w dłoni (np. *Insertion Sort*). Skąd masz pewność, że po $n$ ruchach karty będą ułożone idealnie?

Musisz polegać na logice indukcyjnej:

1. **Inicjalizacja (Baza):** Pierwsza karta w ręce jest z definicji *posortowana*. To Twój stabilny punkt wyjścia.
2. **Utrzymanie (Krok):** Algorytm gwarantuje, że jeśli lewa część ręki jest posortowana (Założenie), to wstawienie kolejnej karty w odpowiednie miejsce **zachowa ten stan** dla większego zbioru (Teza).
3. **Zakończenie:** Skoro każdy krok utrzymuje porządek, to po przejściu przez wszystkie karty (koniec pętli), cały zbiór musi być posortowany.

To nie jest „nadzieja”, że kod zadziała. To matematyczna pewność, że niezmiennik (porządek) został przeniesiony przez każdą iterację pętli. Przetestuj to poniżej! 🚀


<data-insert-sort-poker></data-insert-sort-poker>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- indukcja matematyczna to mechanizm weryfikacji nieskończonych ciągów zdarzeń,  
- Baza Indukcji ($n=1$) to niezbędny punkt zakotwiczenia całego dowodu,  
- Krok Indukcyjny ($P(k) \implies P(k+1)$) gwarantuje stabilność sztafety logicznej,  
- indukcja i rekurencja to dwie strony tego samego schematu myślenia strukturalnego,  
- technika „wyciągania wspólnego czynnika” chroni przed utonięciem w algebrze,  
- sumowanie potęg dwójki to matematyczny dowód limitów rejestrów bitowych,  
- Niezmiennik Pętli to indukcja stosowana w praktyce do dowodzenia poprawności algorytmów.

---

## 🎉 Milestone: Moduł 2 — Uzbrojenie Logiczne Gotowe!

Gratulacje. Przeszedłeś drogę od intuicji i „zgadywania” do **matematycznej gwarancji niezawodności**. Moduł 2 wyposażył Cię w pancerz logiczny niezbędny do weryfikacji systemów o krytycznym znaczeniu.

### ⚙️ Twój Arsenał Dowodowy:
1.  ✅ **Abstrakcja Algebraiczna**: Zmienna to interfejs, nie wartość. Potrafisz faktoryzować wyrażenia, rozpoznawać wzory skróconego mnożenia jako „prekompilowane snippety” i wyprowadzać relacje strukturalne z algebraicznej budowy liczb.
2.  ✅ **Globalne Kontrakty (Kwantyfikatory)**: Wiesz, że `∀` to `Array.every()` a `∃` to `Array.some()` — i co ważniejsze, że *kolejność kwantyfikatorów decyduje o zależności zmiennych*. Potrafisz formalnie negować kontrakty używając praw de Morgana.
3.  ✅ **Techniki Dowodzenia**: Opanowałeś trzy tryby ataku: dowód wprost (dedukcja liniowa), Reductio ad Absurdum (wejście w „świat na opak” i szukanie sprzeczności) oraz kontrapozycję — refaktoryzację problemu z $n$ wariantów do jednego eleganckiego przypadku.
4.  ✅ **Indukcja i Niezmienniki**: Rozumiesz architekturę Bazy (Anchor Point) i Kroku Przejścia. Wiesz, że indukcja i rekurencja to ten sam schemat logiczny, a Niezmiennik Pętli to matematyczna gwarancja poprawności każdej iteracji Twojego kodu.

> [!TIP]
> **Pancerz gotowy.** Masz fundamenty (Moduł 0), logikę analizy (Moduł 1) i mechanizmy rygorystycznej weryfikacji (Moduł 2). Czas użyć tych narzędzi do rozwiązywania konkretnych problemów.


---

Jesteś gotowy na **Moduł 3 — Równania i Nierówności**. Przechodzimy od dowodzenia ogólnych prawd do wyznaczania konkretnych stanów nieustalonych. Witaj w świecie precyzyjnego rozwiązywania złożonych systemów zależności. 🚀
