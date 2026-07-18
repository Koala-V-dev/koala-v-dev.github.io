# Zapis matematyczny: Alfabet i Składnia Wszechświata

W poprzedniej lekcji zobaczyłeś, że matematyka to nie tylko „liczenie”, ale przede wszystkim **język**.  
A skoro to język, musimy poznać jego alfabet i składnię — zanim zaczniemy budować bardziej złożone konstrukcje.

Zacznijmy od przypomnienia kluczowego rozróżnienia:

## 🔗 Połącz Pary: Idea vs Interfejs

<data-gate>
<data-connection-matcher>
    <item left="Liczba" right="Abstrakcyjna idea ilości"></item>
    <item left="Symbol (np. '5')" right="Umowny znak graficzny"></item>
    <item left="Kość z Ishango" right="Przedhistoryczny zapis (nacięcia)"></item>
</data-connection-matcher>
</data-gate>

---

Spójrz na ten chiński napis: 数学很有趣  
(*<span style="padding-right: 2px;">sù</span><span style="padding-right: 6px;">xué</span><span style="padding-right: 6px;">hěn</span><span style="padding-right: 2px;">yǒu</span><span>qù</span>*).  
Wygląda obco, a oznacza po prostu: „Matematyka jest interesująca”.

Większość oporów przed matematyką wynika z **nieznajomości symboli**, a nie z trudności samej treści.  
Gdy widzisz poniższy wzór, Twój mózg może krzyczeć: **_„NIEBEZPIECZEŃSTWO!”_**

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

Spokojnie. To tylko zdanie zapisane w innym alfabecie. Za chwilę nauczysz się je czytać płynnie. 😉

---

## 🏗️ Zmienne: Pudełka z etykietą

Zmienna to **pudełko**, w którym przechowujesz konkretną wartość.  
Zamiast pisać „ta liczba, o której właśnie myślimy”, piszemy po prostu $x$.

*   $x = 5$ → *W pudełku o nazwie „x” znajduje się liczba 5.*
*   $a = 3, b = 7$ → *Dwa pudełka: w „a” jest 3, w „b” jest 7.*

Dlaczego używamy liter?  
Bo chcemy opisywać **ogólne zasady**, a nie tylko pojedyncze przypadki.  
Zapis „$\textcolor{#ff0001}{a} + \textcolor{#ff0002}{b} = \textcolor{#ff0002}{b} + \textcolor{#ff0001}{a}$” mówi nam, że dodawanie jest przemienne — i ta zasada działa dla dowolnych wartości, jakie włożysz do tych pudełek.

> [!TIP]
> W programowaniu działa to identycznie. `let x = 5;` w JavaScript to dokładnie to samo, co $x = 5$ w matematyce.

---

## ⚙️ Operatory: Czasowniki matematyki

Jeśli zmienne to rzeczowniki, to **operatory** są czasownikami — mówią procesorowi (lub Twojemu mózgowi), co dokładnie ma zrobić z danymi:

| Symbol | Funkcja | Przykład |
| :---: | :--- | :--- |
| $+$ | Agregacja (Dodaj) | $3 + 2 = 5$ |
| $-$ | Redukcja (Odejmij) | $7 - 4 = 3$ |
| $\cdot$ lub $\times$ (`*`) | Skalowanie (Pomnóż) | $3 \cdot 4 = 12$ |
| $\div$ lub $\frac{a}{b}$ lub `/` | Segmentacja (Podziel) | $10 \div 2 = 5$ |
| $x^n$ lub `^` | Eksponencjacja (Potęga) | $3^2 = 9$ |
| $=$ lub `==` | Deklaracja równoważności | $2 + 3 = 5$ |
| $\neq$ lub `!=` | Negacja równości | $3 \neq 4$ |
| $<, >$ | Porównanie | $3 < 5$ |

> [!IMPORTANT]
> Znak $=$ to nie „rozkaz obliczenia”. To **stwierdzenie faktu**, że lewa strona ma dokładnie taką samą wartość jak prawa.

---

## 🛠️ Punkt Kontrolny: Odczytaj zapis

<data-gate>
<data-quiz>
  <question>Co w praktyce oznacza zapis $a \neq 0$?</question>
  <options>
    <option>Zmienna „a" musi być równa zero.</option>
    <option correct>Zmienna „a" może przyjąć dowolną wartość, byle nie zero.</option>
    <option>Zmienna „a" jest mniejsza od zera.</option>
  </options>
  <div data-hint="error">Symbol $\neq$ to przekreślone równa się. Oznacza negację.</div>
  <div data-hint="success">Dokładnie. $a \neq 0$ spotkasz wszędzie tam, gdzie dzielenie przez zero mogłoby „wysypać” system.</div>
</data-quiz>
</data-gate>

---

## 🏗️ Hierarchia Parsowania: Kolejność Działań

Aby zapis był jednoznaczny dla każdego odbiorcy (i procesora), matematyka stosuje rygorystyczny protokół kolejności wykonywania działań.  
Brak nawiasów wymusza standardowy priorytet:

1. **Nawiasy** $(\dots)$ — priorytet krytyczny.  
2. **Potęgi i Pierwiastki** $x^n, \sqrt{x}$ — operacje kumulatywne.  
3. **Mnożenie i Dzielenie** $\cdot, /$ — operacje skalujące.  
4. **Dodawanie i Odejmowanie** $+, -$ — operacje liniowe.

> [!NOTE]
> W krajach anglosaskich używa się skrótu **PEMDAS**.  
> W polskiej inżynierii możemy zapamiętać to jako rytmiczne **NP‑MD‑DO** (*enpi emdi duu* 😅) — Nawiasy, Potęgi, Mnożenie/Dzielenie, Dodawanie/Odejmowanie, czyli kolejność wykonywania działań.

---

## 🛠️ Punkt Kontrolny: Kolejność działań

<data-gate>
<data-quiz>
  <question>Oblicz wynik wyrażenia: $2 + 3 \cdot (4 - 1)^2$</question>
  <options>
    <option>45</option>
    <option>75</option>
    <option correct>29</option>
    <option>11</option>
  </options>
  <div data-hint="error">Zastosuj **NP-MD-DO**.<br>Najpierw nawias $(3)$, potem potęga $(3^2=9)$, potem mnożenie $(3 \cdot 9)$ i na końcu dodawanie.</div>
  <div data-hint="success">Świetnie. Precyzyjne parsowanie to podstawa unikania błędów w obliczeniach i kodzie.</div>
</data-quiz>
</data-gate>

---

## 🧰 Indeksy i greckie litery: Etykiety dla zaawansowanych

Gdy w systemie mamy setki zmiennych, sam alfabet łaciński przestaje wystarczać.  
Wtedy inżynierowie sięgają po **indeksy** i **litery greckie**.

**Indeksy** to numery seryjne zmiennych:
* $x_1, x_2, x_3$ → trzy różne zmienne z tej samej serii.  
* $a_n$ → zmienna o numerze $n$ (np. ostatni element ciągu).

**Alfabet grecki** to po prostu dodatkowy zestaw etykiet:

| Symbol | Nazwa | Typowe zastosowanie |
| :---: | :--- | :--- |
| $\pi$ | Pi | Koła, sfery, stałe geometryczne |
| $\Delta$ | Delta | Zmiana (przyrost) wartości |
| $\Sigma$ | Sigma | Sumowanie (agregacja danych) |
| $\alpha, \beta, \gamma$ | Kąty | Geometria, rotacje |

---

## 🛠️ Punkt Kontrolny: Odczytaj zapis z indeksem

<data-gate>
<data-quiz>
  <question>Co oznacza zapis $x_3 = 7$?</question>
  <options>
    <option>Musisz pomnożyć x przez 3.</option>
    <option>To skrót od x do potęgi trzeciej.</option>
    <option correct>Trzecia zmienna z serii „x” ma wartość 7.</option>
  </options>
  <div data-hint="error">Mała cyfra u dołu to indeks — etykieta porządkowa, a nie działanie arytmetyczne.</div>
  <div data-hint="success">Tak jest. Indeksy to podstawa przy pracy z tablicami danych.</div>
</data-quiz>
</data-gate>

---

## 🔬 Iteracyjna Suma: Dekonstrukcja Pętli $\Sigma$

Wróćmy do „strasznego” wzoru z początku lekcji.  
Rozłóżmy go na czynniki jak moduły w kodzie:

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

* $\sum$ (Sigma) → „zsumuj wszystko, co następuje”.  
* $i=1$ → „Zacznij od licznika $i$ równego $1$”.  
* $n$ → „Skończ, gdy licznik $i$ osiągnie wartość $n$”.  
* $i$ → „W każdej iteracji dodaj aktualną wartość $i$”.

To nic innego jak **pętla for** w języku matematyki.  
Całość mówi: „Suma wszystkich liczb od 1 do $n$ wynosi tyle, co ułamek po prawej stronie”.

---

## 🛠️ Punkt Kontrolny: Oblicz sigmę

<data-gate>
<data-quiz>
  <question>Jaki jest wynik działania $$\sum_{i=1}^{6} i$$?</question>
  <options>
    <option>10</option>
    <option correct>21</option>
    <option>15</option>
  </options>
  <div data-hint="error">Musisz dodać wszystkie liczby: $1 + 2 + 3 + 4 + 5 + 6$.</div>
  <div data-hint="success">Dokładnie tak. Rozwiązałeś sigmę, której większość ludzi boi się bez powodu! 🤪</div>
</data-quiz>
</data-gate>

---

## 🛠️ Punkt Kontrolny: Suma stałej vs Suma indeksu

> [!CAUTION]
> **Pułapka stałej:** Jeśli za znakiem $\Sigma$ stoi stała liczba (np. 5), a nie zmienna $i$, to po prostu dodajesz tę samą wartość tyle razy, ile wskazuje zakres.  
> Przykład: $\sum_{i=1}^{3} 5 = 5 + 5 + 5 = 15$.

<data-gate>
<data-quiz>
  <question>Oblicz wartość wyrażenia: $$\sum_{i=1}^{4} 2$$</question>
  <options>
    <option>10</option>
    <option correct>8</option>
    <option>4</option>
  </options>
  <div data-hint="error">Po prawej stronie masz stałą 2. Dodaj ją do siebie 4 razy.</div>
  <div data-hint="success">Zgadza się. To kluczowe rozróżnienie, którego będziemy używać przy analizie algorytmów.</div>
</data-quiz>
</data-gate>

---

## 🪤 Sandbox: Zapisz to sam!

Sprawdźmy Twoją biegłość w „pisaniu” matematyki.  
Zwróć uwagę na indeksy i operatory.

<data-gate>
<data-math-sandbox mode="transcription" expected="x_1 + x_2 = y" level="basic" palette="index,plus,eq">
Suma pierwszej i drugiej wartości z serii $x$ jest równa zmiennej $y$.
</data-math-sandbox>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- zapis matematyczny to język z własną składnią i alfabetem,  
- zmienne to etykiety (pudełka) na wartości, a nie „magiczne literki”,  
- operatory pełnią rolę czasowników — mówią, co zrobić z danymi,  
- kolejność działań (NP‑MD‑DO) gwarantuje jednoznaczność obliczeń,  
- indeksy i litery greckie to narzędzia do pracy z większymi strukturami,  
- symbol $\Sigma$ to matematyczna pętla — iteracja zapisana w skrócie,  
- matematyka nie jest trudna — trudne są tylko nieznane symbole.

---

Umiesz czytać język matematyki.  
Czas go **użyć**.  
W następnej lekcji odkryjemy, dlaczego dodawanie jest przemienne, skąd wzięło się mnożenie i co się stanie, gdy spróbujesz odjąć większą liczbę od mniejszej. 🔢🚀