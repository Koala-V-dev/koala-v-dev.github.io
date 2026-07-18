# Wyrażenia Algebraiczne: Architektura Uniwersalnych Wzorców

W Module $0$ przyjąłeś „Złoty Wzór” na NWW jako gotową funkcję:
$$\text{NWW}(a, b) = \frac{a \cdot b}{\text{NWD}(a, b)}$$

Dzisiaj wejdziemy „pod maskę” tego mechanizmu. Zapomnij o traktowaniu liczb jako sztywnych wartości. Zacznij postrzegać je jako **struktury**. Algebra nie jest po prostu „matematyką z literkami”, tylko *tworzeniem uniwersalnych wzorców*. To Twoje szablony działające bez względu na to, co wstawisz na pod sygnaturę.

---

## 🏗️ Zmienna jako Kontener i Kontrakt ($x$)

W kodzie zmienna to adres w pamięci. W algebrze litera $x$ to **kontener na nieskończoność**. 

W Module $0$ opanowaliśmy notację (alfabet). Algebra to pierwszy poziom logiki systemowej zbudowany na tym alfabecie. Jej siła tkwi w *abstrakcji*. Jeśli udowodnimy coś dla $x$, mechanizm zadziała dla każdej liczby z zadeklarowanej **dziedziny**.

> [!TIP]
> Traktuj zmienną jak interfejs (*Interface*). 
> Nie interesuje nas konkretna implementacja (wartość), ale kontrakt: jak dany element zachowuje się w relacji z resztą systemu.

---

## ⛓️ Liczba jako Wielomian: System Agnostic

To kluczowy most łączący arytmetykę z architekturą systemów. Każda liczba to w rzeczywistości ukryte wyrażenie algebraiczne: **Wielomian**.

Liczba $123$ w zapisie pozycyjnym to po prostu „kod źródłowy”:
$$123 = \textcolor{#ff0001}{1 \cdot 10^2} + \textcolor{#ff0002}{2 \cdot 10^1} + \textcolor{#ff0003}{3 \cdot 10^0} = \textcolor{#ff0001}{100} + \textcolor{#ff0002}{20} + \textcolor{#ff0003}{3}$$

Zamień podstawę systemu ($10$) na zmienną $x$, a otrzymasz uniwersalną strukturę funkcji wielomianowej:
$$f(x) = \textcolor{#ff0001}{1}\textcolor{#ff0004}{x^2} + \textcolor{#ff0002}{2}\textcolor{#ff0004}{x} + \textcolor{#ff0003}{3}$$

Dzięki tej abstrakcji Twój wzór staje się **niezależny od systemu** (*System Agnostic*):
- $x=10$ — system dziesiętny.
- $x=2$ — system binarny (podstawa logiki z Modułu $1$).
- $x=16$ — system heksadecymalny.

Algebra pozwala badać właściwości „liczbowości” jako takiej, zanim zdecydujemy, w jakim systemie ją wykorzystamy.

---

## 🪚 Budowa Wyrażeń: Komponenty Systemu

W algebrze operujemy na trzech typach komponentów, które tworzą architekturę wzoru:

1.  **Zmienne ($x, y, a, b$)**: Twoje wejścia (Inputy).
2.  **Współczynniki**: Liczby stojące przy zmiennych (np. w $5x$ to $5$). To **wzmocnienie sygnału** danej zmiennej.
3.  **Stałe**: Wartości bez zmiennych (np. $+6$). To „bias”, czyli stały parametr przesunięcia Twojego wzorca.

_**Typy struktur:**_
- *Jednomian*: Najprostszy „atom” obliczeniowy (np. $3x^2$), oparty wyłącznie na mnożeniu.
- *Suma algebraiczna*: Wielomian (np. $x + 5$). Jednomiany połączone operatorami dodawania lub odejmowania (logiczne `OR` dla struktur).

---

## ⚙️ Refaktoryzacja: Redukcja wyrazów podobnych

Podobnie jak w kodzie, w algebrze dążymy do minimalizacji długu technicznego.  
Ten proces to *redukcja wyrazów podobnych* jest podstawą do czytelniejszego zapisu matematycznego i fragmentów kodu.

**Wyrazy podobne** to kontenery tego samego typu (te same zmienne w tych samych potęgach). Tylko one mogą być ze sobą agregowane. Próba dodania $x^2$ do $x$ to błąd niedopasowania typów (*Type Mismatch*), ponieważ są to różne wymiary danych.

Przykład czystej refaktoryzacji:
$$\textcolor{#ff0001}{2x^2} + \textcolor{#ff0002}{3x} + \textcolor{#ff0001}{5x^2} - \textcolor{#ff0002}{x} \quad = \quad \textcolor{#ff0001}{(2 + 5) x^2} + \textcolor{#ff0002}{(3 - 1) x} \quad = \quad \textcolor{#ff0001}{7x^2} + \textcolor{#ff0002}{2x}$$

### 🛠️ Punkt Kontrolny: Konsolidacja danych
<data-gate>
<data-quiz>
    <question>Zredukuj wyrażenie: $4a - 2b + 3a + 5b$</question>
    <options>
        <option correct>$7a + 3b$</option>
        <option>$a + 3b$</option>
        <option>$10ab$</option>
    </options>
    <div data-hint="success">Prawidłowo! Sumujemy $a$ do $a$ oraz $b$ do $b$. Zmienne o różnych nazwach są dla siebie „niekompatybilne” — nie wiemy, co jest w środku, więc nie możemy ich połączyć.</div>
    <div data-hint="error">Pamiętaj: możesz agregować tylko kontenery tego samego typu. <br> $a$ nie jest kompatybilne z $b$ na poziomie dodawania. <br> Musisz zachować naturę każdego jednomianu, jeżeli przedrostkiem jest minus to wartość musi pozostać ujemna.</div>
</data-quiz>
</data-gate>

---

## ⚡ Rozdzielność: Dystrybucja sygnału

Mnożenie $(a+b)(c+d)$ to proces przesyłania sygnału z każdego elementu jednej struktury do każdego elementu drugiej. W inżynierii nazywamy to rygorem „każdy z każdym”. Jest to iloczyn kartezjański wyrażony za pomocą wyrażeń algebraicznych.

$$(\textcolor{#ff0001}{a} + \textcolor{#ff0002}{b})(\textcolor{#ff0003}{c} + \textcolor{#ff0004}{d}) = \textcolor{#ff0001}{a}\textcolor{#ff0003}{c} + \textcolor{#ff0001}{a}\textcolor{#ff0004}{d} + \textcolor{#ff0002}{b}\textcolor{#ff0003}{c} + \textcolor{#ff0002}{b}\textcolor{#ff0004}{d}$$

### 🪤 Sandbox: Rozwijanie struktury

<data-gate>
<data-math-sandbox level="algebra" data-label="Iloczyn dwóch jednomianów: $(x + 2)(x + 3)$">
  <div 
    data-step="1" 
    data-expected="x^2 + 3x + 2x + 6" 
    data-label="Krok 1: Rozwiń nawiasy (dystrybucja sygnału)"
    data-hints='{"FORM_MISMATCH": "💡 Nie skracaj obliczeń. Pokaż wszystkie 4 składniki: \\\\(x^2 + 3x + 2x + 6\\\\).", "STRUCTURE_MISMATCH": "💡 Wymagana forma to suma 4 składników."}'>
  </div>
  <div 
    data-step="2" 
    data-expected="x^2 + 5x + 6" 
    data-label="Krok 2: Zredukuj wyrazy podobne"
    data-hints='{"FORM_MISMATCH": "💡 Zredukuj środkowe wyrazy: \\\\(3x + 2x = 5x\\\\).", "STRUCTURE_MISMATCH": "💡 Wymagana forma: \\\\(x^2 + 5x + 6\\\\)."}'>
  </div>
</data-math-sandbox>
</data-gate>

---

## 🏗️ Faktoryzacja: Izolacja struktur

To proces odwrotny do mnożenia, kluczowy przy debugowaniu struktur matematycznych. Szukasz **wspólnego czynnika** i izolujesz go przed nawiasem.

**Inżynierskie korzyści faktoryzacji:**
1.  **Optymalizacja**: Zamiast mnożyć coś $n$ razy, wykonujesz jedno mnożenie na sumie.
2.  **Upraszczanie relacji**: Bez faktoryzacji nie skrócisz ułamka ani nie rozwiążesz równania. To wyciąganie wspólnego kodu do oddzielnej metody.

Przykład:
$$6x + 9 = 3(2x + 3)$$

Wyciągnięcie trójki pozwala zobaczyć czystą strukturę wewnętrzną wyrażenia.

> [!TIP]
> Faktoryzacja jest kluczowa w analizie funkcji. Dla $f(x) = x^2 + 2x$, faktoryzacja do postaci $f(x) = x(x + 2)$ natychmiast ujawnia **punkty krytyczne** (miejsca zerowe): $x=0$ i $x=-2$. Bez tego system pozostaje „czarną skrzynką”.
> W programowaniu wyciągnięcie wspólnych operacji do funkcji poprawia czytelność i pozwala na bezpieczne modyfikacje, obniżając ryzyko błędu typu *regression*.

---

## 🧵 Wzory Skróconego Mnożenia: Snippety Optymalizacyjne

W kodzie używasz snippetów, by nie pisać wszystkiego od zera. W matematyce takimi snippetami są **wzory skróconego mnożenia**. To prekompilowane transformacje, które pozwalają pominąć mozolne mnożenie krok po kroku.

1.  **Kwadrat sumy**: $(a+b)^2 = a^2 + 2ab + b^2$
2.  **Kwadrat różnicy**: $(a-b)^2 = a^2 - 2ab + b^2$
3.  **Różnica kwadratów**: $(a-b)(a+b) = a^2 - b^2$

> [!WARNING]
> **Zbrodnia na logice**: Nigdy nie pisz $(a+b)^2 = a^2 + b^2$. To błąd niszczący integralność danych. Całkowicie pomijasz **interakcję** między zmiennymi ($2ab$). W systemach dynamicznych takie pominięcie to prosta droga do katastrofy.

W inżynierii nie wierzymy na słowo. Każdy wzór musi przejść testy jednostkowe (dowód operacyjny). Oto rozbicie struktur:

### ✔️ Rozbicie kwadratu sumy
$$(a+b)^2 = (a+b)(a+b) = \textcolor{#ff0001}{a(a+b)} + \textcolor{#ff0002}{b(a+b)} = \textcolor{#ff0001}{a^2}\textcolor{#ff0004}{+ ab + ba}\textcolor{#ff0002}{+b^2} = \textcolor{#ff0001}{a^2} + \textcolor{#ff0004}{2ab} + \textcolor{#ff0002}{b^2}$$

### ✔️ Rozbicie różnicy kwadratów
$$(a-b)(a+b) = \textcolor{#ff0001}{a(a+b)} - \textcolor{#ff0002}{b(a+b)} = \textcolor{#ff0001}{a^2} \textcolor{#ff0004}{+ ab -ba} \textcolor{#ff0002}{- b^2} = \textcolor{#ff0001}{a^2} - \textcolor{#ff0002}{b^2}$$

### ✔️ Rozbicie kwadratu różnicy
$$(a-b)^2 = (a-b)(a-b) = \textcolor{#ff0001}{a(a-b)} - \textcolor{#ff0002}{b(a-b)} = \textcolor{#ff0001}{a^2}\textcolor{#ff0004}{-ab -ba}\textcolor{#ff0002}{+ b^2} = \textcolor{#ff0001}{a^2} - \textcolor{#ff0004}{2ab} + \textcolor{#ff0002}{b^2}$$

> [!IMPORTANT]
> Zauważ: $ab$ i $ba$ to ten sam sygnał (przemienność mnożenia z Modułu $0$).
> Dlatego w wielu przypadkach dokonujemy agregacji jeżeli mają ten sam znak lub redukcji jeżeli mają różne znaki przedrostkowe.

### ✔️ Rozbicie różnicy sześcianów
$$(a-b)(a^2+ab+b^2) = \textcolor{#ff0001}{a(a^2+ab+b^2)} - \textcolor{#ff0002}{b(a^2+ab+b^2)} = \textcolor{#ff0001}{a^3}\textcolor{#ff0003}{+a^2b}\textcolor{#ff0004}{+ab^2} \textcolor{#ff0003}{-ba^2}\textcolor{#ff0004}{-ab^2}\textcolor{#ff0002}{-b^3} = \textcolor{#ff0001}{a^3} - \textcolor{#ff0002}{b^3}$$

### ✔️ Rozbicie sumy sześcianów
$$(a+b)(a^2-ab+b^2) = \textcolor{#ff0001}{a(a^2-ab+b^2)} + \textcolor{#ff0002}{b(a^2-ab+b^2)} = \textcolor{#ff0001}{a^3}\textcolor{#ff0003}{-a^2b}\textcolor{#ff0004}{+ab^2} \textcolor{#ff0003}{+ba^2}\textcolor{#ff0004}{-ab^2}\textcolor{#ff0002}{+b^3} = \textcolor{#ff0001}{a^3} + \textcolor{#ff0002}{b^3}$$

### 🛠️ Punkt Kontrolny: Rozpoznawanie wzorca
<data-gate>
<data-quiz>
    <question>Zwiń wyrażenie $x^2 - 6x + 9$ do postaci kwadratu różnicy.</question>
    <options>
        <option correct>$(x - 3)^2$</option>
        <option>$(x - 9)^2$</option>
        <option>$(x + 3)^2$</option>
    </options>
    <div data-hint="success">Brawo! Rozpoznałeś wzorzec (*Pattern Recognition*): $a=x$, $b=3$, a środkowy wyraz to $2 \cdot x \cdot 3 = 6x$. System został pomyślnie skompresowany.</div>
    <div data-hint="error">Zwróć uwagę na środkowy wyraz: musi on pasować do schematu $2 \cdot a \cdot b$. Pamiętaj też o znaku minus, który wskazuje na różnicę.</div>
</data-quiz>
</data-gate>

---

## 📦 Algebraiczna Geneza NWW: Inżynieria Struktur

Wróćmy do obietnicy z początku lekcji. Aby zrozumieć, dlaczego „Złoty Wzór” w ogóle istnieje, musimy przeprowadzić **inżynierię odwrotną**. 

$$\text{NWW}(a, b) = \frac{a \cdot b}{\text{NWD}(a, b)}$$

W Module $1$ operowaliśmy na zbiorach. Tutaj każdą liczbę traktujemy jako **multizbiór czynników pierwszych** — to jej unikalna sygnatura, zestaw "cegieł", z których jest zbudowana.

Spójrzmy na architekturę liczb $a=4$ oraz $b=6$:
- $a = 4 \rightarrow \mathbf{\\{2, 2\\}}$
- $b = 6 \rightarrow \mathbf{\\{2, 3\\}}$

**Analiza sygnału:**
- **NWD** to **iloczyn części wspólnej** (*Intersection*) tych struktur. To, co łączy oba systemy. Dla $4$ i $6$: $\\{2\\}$.
- **NWW** to **unia multizbiorów czynników** (*Union*). Najmniejsza struktura, która zawiera w sobie komplety czynników obu liczb. Dla $4$ i $6$: $\\{2, 2, 3\\} = 12$.

W wizualizacji diagramu Venna sprawa jest prosta: **moc części wspólnej** ($|A \cap B|$) jest graficznie wydzielona. Widzimy dokładnie jedną "instancję" wspólnego czynnika, co pozwala bezbłędnie wyznaczyć NWW.

<data-lcm-gcf-venn n1="4" n2="6"></data-lcm-gcf-venn>

### ❓ Hipoteza: Redundantne scalenie czynników pierwszych

Ale co się stanie, gdy przejdziemy na „surową” algebrę i spróbujemy po prostu pomnożyć obie liczby?

Przeanalizujmy ponownie proces „składania” liczb $a=4$ oraz $b=6$:
- Zbiór czynników liczby $4$: $A = \mathbf{\\{2, 2\\}}$
- Zbiór czynników liczby $6$: $B = \mathbf{\\{2, 3\\}}$
- Część wspólna ($\text{NWD}$): $\mathbf{\\{2\\}}$

Zastanówmy się, co uzyskamy, gdy w algebrze **całkowicie zignorujemy moc części wspólnej** (czyli fakt, że czynnik wspólny występuje w obu strukturach). Scalając te zbiory „na surowo”, otrzymamy zestaw: $\\{2, 2, 2, 3\\}$.  
Arytmetycznie:

$$\textcolor{#ff0001}{(2 \cdot 2)} \cdot \textcolor{#ff0002}{(2 \cdot 3)} = \textcolor{#ff0001}{4} \cdot \textcolor{#ff0002}{6} = 24$$

Jednak wiemy, że $\text{NWW}(4, 6) = 12$. Jak uzyskać $12$ z powyższego wyniku?  
Najprościej jest podzielić wynik iloczynu przez $2$:
$$\text{NWW}(a, b) = \frac{4 \cdot 6}{2} = 12$$

_**Test Hipotezy**_: Sprawdźmy, czy dzielenie iloczynu zawsze przez $2$ zadziała dla innych liczb, np. $a=6, b=9$:
$$\frac{6 \cdot 9}{2} = 27$$

**_Błąd!_** $\text{NWW}(6, 9) = 18$. Pierwsza próba nie powiodła się, ale wynik $27$ i oczekiwane $18$ to wielokrotności liczby $9$. Co oznacza że przestrzeliliśmy o dokładnie jedną wielokrotność.

### 🔭 Obserwacja empiryczna (Analiza Danych)

Zestawmy przypadki, by wyłapać prawidłowość między iloczynem, NWW i NWD:

| Liczby $(a, b)$ | Czynniki $a$ | Czynniki $b$ | **NWD** | **NWW** | Iloczyn $a \cdot b$ |
| :---: | :--- | :--- | :---: | :---: | :---: |
| $(4, 6)$ | $\\{2, 2\\}$ | $\\{2, 3\\}$ | $2$ | $12$ | $24$ |
| $(6, 9)$ | $\\{2, 3\\}$ | $\\{3, 3\\}$ | $3$ | $18$ | $54$ |
| $(12, 4)$ | $\\{2, 2, 3\\}$ | $\\{2, 2\\}$ | $4$ | $12$ | $48$ |
| $(7, 5)$ | $\\{7\\}$ | $\\{5\\}$ | $1$ | $35$ | $35$ |

**Widzisz to?** 🧐  
W każdym przypadku iloczyn liczb jest dokładnie równy iloczynowi ich NWD i NWW:
$$\text{NWD}(a, b) \cdot \text{NWW}(a, b) = a \cdot b$$

To odkrycie to punkt zwrotny. Zamiast zgadywać to odkryliśmy powtarzalną prawidłowość, która pozwala nam na zapisanie jej wzorem uniwersalnym.  

### ⚙️ Proces Przekształcenia: Od obserwacji do wzoru

Skoro wiemy, że relacja jest stała, możemy wykorzystać algebrę do stworzenia „interfejsu” dla dowolnej niewiadomej. Jeśli potrzebujemy wyznaczyć **NWW**, musimy odizolować tę zmienną, dzieląc obie strony równania przez **NWD**:

1. **Równanie bazowe**: $\text{NWD} \cdot \text{NWW} = a \cdot b$
2. **Izolacja NWW**: $$\frac{\text{NWD} \quad \cdot \quad \text{NWW}}{\text{NWD}} = \frac{a \cdot b}{\text{NWD}}$$
3. **Wynik po uproszczeniu**: $$\frac{\cancel{\text{NWD}}^1 \quad  \cdot \quad \text{NWW}}{\cancel{\text{NWD}}_1} = \frac{a \cdot b}{\text{NWD}} \quad \Rightarrow \quad\text{NWW} = \frac{a \cdot b}{\text{NWD}}$$

To, co właśnie zrobiliśmy, to bezpośrednie przeniesienie **Zasady włączeń i wyłączeń** z Modułu $1$ na grunt multiplikatywny. Porównaj te dwa światy:

| Teoria Zbiorów <span style="text-wrap: nowrap;">(Moc $\|...\|$</span>) | Algebra (Wartość produktu) | Dlaczego tak? |
| :--- | :--- | :--- |
| Suma $\|A\| + \|B\|$ | Iloczyn $a \cdot b$ | Mnożąc liczby, sumujemy ich „zasoby” (czynniki). |
| Różnica $- \|A \cap B\|$ | Dzielenie przez $\text{NWD}$ | Aby usunąć duplikat informacji, musimy go odjąć (lub podzielić). |
| Wynik $\|A \cup B\|$ | Wynik $\text{NWW}$ | To unikalny zestaw czynników bez redundancji. |

### 💎 Krystalizacja: Uniwersalne API

Dzięki tej analizie wyprowadzamy wzory, które stają się naszymi **systemowymi API**:

$$ \mathbf{\text{NWW} = \frac{a \cdot b}{\text{NWD}}} \quad \text{oraz} \quad \mathbf{\text{NWD} = \frac{a \cdot b}{\text{NWW}}} $$

To jest siła algebry: przeszliśmy od błędu redundancji, przez testowanie hipotez, aż do matematycznego dowodu relacji. Stworzyliśmy narzędzie, które nie potrzebuje diagramu Venna, by podać poprawny wynik dla dowolnych danych.

---

## ⚠️ System Integrity: Niebezpieczne Operacje

W inżynierii danych błędy logiczne są groźniejsze niż błędy składni, bo działają po cichu. W algebrze najwięcej „zbrodni” popełnia się przy operacjach z dzieleniem.

### 🛑 Pułapka 1: Kasowanie stanów (Dzielenie przez zmienną)
Spójrz na równanie: $x^2 = 3x$.  
Kusi Cię, aby „skrócić” obie strony przez $x$ 😏? 
Zróbmy to: $$\frac{x^2}{x} = \frac{3x}{x} \implies x = 3$$

> [!CAUTION]
> Dzielenie przez $x$ jest dopuszczalne **tylko wtedy, gdy $x \neq 0$**. Skracając bez tego zastrzeżenia, narzuciłeś systemowi warunek, którego nie było w specyfikacji, i tym samym „skasowałeś” rozwiązanie $x=0$. W logice stanów (Moduł $1$) to tak, jakbyś usunął stan `false` z systemu, zostawiając tylko `true`. Twój system stałby się upośledzony i niekompletny.

**✔️ Poprawna metoda: Faktoryzacja**
Zamiast dzielić, przenieś wszystko na jedną stronę (pamiętaj by przenieść ze zmianą znaku) i wyciągnij czynnik przed nawias. Dzięki temu zachowasz wszystkie stany zmiennej:
$$x^2 - 3x = 0 \implies x(x - 3) = 0 \implies \mathbf{x = 0 \lor x = 3}$$

---

### 🛑 Pułapka 2: „Dziura” w systemie (Ukryta Dziedzina)

To najbardziej podstępna usterka. Weźmy ułamek:
$$ \frac{x^2 - 16}{x - 4} $$

Zanim cokolwiek uprościsz, musisz sprawdzić **Dziedzinę** (walidacja wejścia). Tutaj mianownik nie może być zerem (`DivideByZeroException`):
$$ x - 4 \neq 0 \implies \mathbf{x \neq 4} $$

Liczba $4$ jest więc **punktem zakazanym**. Teraz wykonajmy skracanie:
$$ \frac{(x - 4)(x + 4)}{x - 4} = \frac{(\cancel{x-4}^1)(x + 4)}{\cancel{x - 4}_1} = x + 4 $$

> [!CAUTION]
> Mógłbyś pomyśleć, że $$\frac{x^2 - 16}{x - 4}$$ to po prostu to samo co $x + 4$... **To fundamentalny błąd logiczny.**  
> 
> #### Analiza sprzeczności (Runtime Crash):
> 1.  _**Oryginał ($L$)**_: Dla $x = 4$ otrzymasz $\frac{0}{0} \rightarrow$ *Undefined Behavior* (nie zdefiniowana wartość). 😖
> 2.  _**Uproszczenie ($P = x + 4$)**_: Dla $x = 4$ otrzymasz $8$. Udajesz, że wszystko jest OK. 😒
> 
> Skoro $L(4) = \text{undefined}$, a $P(4) = 8$, to twierdzenie $L = P$ jest **_nieprawdą_**. Algebra musi być strażnikiem prawdy, a nie kreatywnym księgowym „ukrywającym” błędy pod maską uproszczenia. 😡
> 
> **Wniosek?** Nawet jeśli „problem” (mianownik) zniknął z zapisu, **zakaz dla $x = 4$ nadal obowiązuje**. Zawsze sprawdzaj dziedzinę na surowych danych. Inaczej Twój wynik poda wartość tam, gdzie system powinien wywalić błąd. 🥸

---

## 🛠️ Finał: Refaktoryzacja Systemowa

Twoim ostatnim zadaniem jest optymalizacja poniższego wyrażenia. Wykorzystaj wzory skróconego mnożenia i wyciąganie przed nawias, aby uzyskać najczystszy kod matematyczny:

<data-math-sandbox level="algebra" data-label="Optymalizacja struktury: $\frac{x^2 - 6x + 9}{x^2 - 9}$">
  <div 
    data-step="1" 
    data-expected="(x-3)^2" 
    data-label="Skompresuj licznik za pomocą wzoru skróconego mnożenia ($x^2 - 6x + 9$):"
    data-hints='{"FORM_MISMATCH": "💡 Zwiń trójmian korzystając ze wzoru na kwadrat różnicy: \\((x-3)^2\\).", "STRUCTURE_MISMATCH": "💡 Oczekiwany format to potęga dwumianu: \\((x-3)^2\\)."}'>
  </div>
  <div 
    data-step="2" 
    data-expected="(x-3)(x+3)" 
    data-label="Rozłóż mianownik na czynniki ($x^2 - 9$):"
    data-hints='{"ALGEBRA_SIGN_ERROR": "💡 Prawie! Uważaj na znaki – wzór na różnicę kwadratów wymaga przeciwnych znaków w nawiasach: \\((x-3)(x+3)\\).", "FORM_MISMATCH": "💡 Użyj wzoru na różnicę kwadratów: \\(x^2 - 3^2 = (x-3)(x+3)\\).", "STRUCTURE_MISMATCH": "💡 Oczekiwany format to iloczyn nawiasów: \\((x-3)(x+3)\\)."}'>
  </div>
  <div 
    data-step="3" 
    data-expected="\\frac{x-3}{x+3}" 
    data-label="Skróć wspólny czynnik i podaj wynik w postaci ułamka:"
    data-hints='{"FORM_MISMATCH": "💡 Skróć czynnik \\((x-3)\\) w liczniku i mianowniku. Pozostanie ułamek \\(\\frac{x-3}{x+3}\\).", "STRUCTURE_MISMATCH": "💡 Oczekiwany format to skrócony ułamek: \\(\\frac{x-3}{x+3}\\)."}'>
  </div>
</data-math-sandbox>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- liczba to uniwersalna struktura (wielomian), a nie tylko sztywna wartość,  
- zmienna to interfejs definiujący zachowanie w systemie,  
- jednomiany i sumy to klocki budulcowe „kodu matematycznego”,  
- redukcja wyrazów podobnych to proces czyszczenia długu technicznego (refaktoryzacja),  
- faktoryzacja pozwala izolować wspólny kod i wykrywać punkty krytyczne systemu,  
- wzory skróconego mnożenia to snippety optymalizujące operacje na strukturach,  
- relacja NWW i NWD opiera się na stałym kontrakcie: $a \cdot b = \text{NWD} \cdot \text{NWW}$,  
- zawsze pilnuj dziedziny ułamka, by uniknąć błędów typu *Undefined Behavior*.

---

## 🚀 Po co to inżynierowi?

Wszystko, co robisz w algebrze, to fundament pod **Równania** i **Analizę Funkcjonalną**. Biegłość w refaktoryzacji to:

- **Optymalizacja procesora**: Uproszczenie wzoru to mniej instrukcji w `runtime`.
- **Grafika 3D**: Każdy ruch kamery w Unreal Engine to operacje na macierzach i wyrażeniach algebraicznych.
- **Big Data**: Rozpoznawanie wzorców (Pattern Matching) w miliardach rekordów opiera się na strukturach, które właśnie poznałeś.

---

W kolejnej lekcji wejdziemy w **Kwantyfikatory**. Dowiesz się, jak za pomocą dwóch symboli narzucić rygor logiczny na całe zbiory danych. 🚀
