# Logika Stanów Dyskretnych: Bramki i Operatory

Logika w inżynierii to nie filozofia.  
To **mechanika sygnałów** — zero romantyzmu, czysta binarna rzeczywistość.

W Module $0$ nauczyłeś się mówić językiem matematyki.  
W Module $1$ nauczysz się **myśleć jak procesor**.

Każde zdanie, warunek, trigger, filtr, predykat czy reguła biznesowa można sprowadzić do dwóch stanów:

- **$1$** — TRUE / High (docelowe napięcie prądu np. $3.3V$ lub $5V$)
- **$0$** — FALSE / Low (prawie lub całkowity brak napięcia np $0V$ lub $1.3V$)

To jest fundament całej informatyki: od SQL-a, przez elektronikę, po kompilatory.

---

## 🔄 Inwersja (NOT)

Inwersja to najprostsza transformacja sygnału.  
Odwraca jego stan — nic więcej, nic mniej.

- **Notacja matematyczna**: $\neg p$  
- **W kodzie**: `!p`  
- **Zasada**: wyjście jest przeciwne do wejścia

$$\neg 1 = 0 \qquad \neg 0 = 1$$

<data-logic-gate type="NOT"></data-logic-gate>

<data-gate>
<data-math-sandbox level="logic" mode="result" data-steps="2" data-label="🪤 Inwersja sygnału">
  <div data-step="1" data-expected="0" data-label="Wyznacz stan sygnału po inwersji: $\neg 1$" data-hint-wrong=" :💡 Inwerter (NOT) działa jak logiczne lustro — stan wysoki ($1$) musi zostać odwrócony do zera." data-hints='{"LOGIC_ERROR": "💡 Inwerter (NOT) działa jak logiczne lustro — stan wysoki ($1$) musi zostać odwrócony do zera."}'></div>
  <div data-step="2" data-expected="1" data-label="Wyznacz stan sygnału po inwersji: $\neg 0$" data-hint-wrong=" :💡 Skoro na wejściu masz brak sygnału (0), inwerter musi go wygenerować na wyjściu jako stan wysoki (1)." data-hints='{"LOGIC_ERROR": "💡 Skoro na wejściu masz brak sygnału (0), inwerter musi go wygenerować na wyjściu jako stan wysoki (1)."}'></div>
</data-math-sandbox>
</data-gate>

<data-gate>
<data-truth-table gate="NOT" data-label="Tabela prawdy: Inwerter (NOT)"></data-truth-table>
</data-gate>

---

## 🤝 Koniunkcja (AND)

Koniunkcja to **bramka szeregowa**.  
Jeśli którakolwiek część układu wejścia jest wyłączona to na wyjściu nie będzie stanu $1$.

- **Notacja matematyczna**: $A \land B$  
- **W kodzie**: `&&`  
- **Zasada**: wynik jest $1$ tylko wtedy, gdy *oba* wejścia są $1$

$$1 \land 1 = 1 \qquad 1 \land 0 = 0$$

<data-logic-gate type="AND"></data-logic-gate>

<data-gate>
<data-math-sandbox level="logic" mode="result" data-steps="2" data-label="🪤 Iloczyn logiczny">
  <div data-step="1" data-expected="1" data-label="Wyznacz stan wyjściowy: $1 \land 1$" data-hint-wrong=" :💡 Bramka AND (szeregowa) przepuszcza sygnał tylko, gdy oba wejścia są aktywne ($1 \land 1 = 1$)." data-hints='{"LOGIC_ERROR": "💡 Bramka AND (szeregowa) przepuszcza sygnał tylko, gdy oba wejścia są aktywne ($1 \land 1 = 1$)."}'></div>
  <div data-step="2" data-expected="0" data-label="Wyznacz stan wyjściowy: $1 \land 0$" data-hint-wrong=" :💡 Wystarczy jeden przerwany przewodnik (0), aby cały układ szeregowy przestał przewodzić." data-hints='{"LOGIC_ERROR": "💡 Wystarczy jeden przerwany przewodnik (0), aby cały układ szeregowy przestał przewodzić."}'></div>
</data-math-sandbox>
</data-gate>

<data-gate>
<data-truth-table gate="AND" data-label="Tabela prawdy: Iloczyn (AND)"></data-truth-table>
</data-gate>

---

## 🛤️ Alternatywa (OR)

Alternatywa to **bramka równoległa**.  
Wystarczy jedna aktywna ścieżka, by sygnał przeszedł.

- **Notacja**: $A \lor B$  
- **W kodzie**: `||`  
- **Zasada**: wynik jest $1$ wtedy, gdy *co najmniej jedno* wejście jest $1$

$$0 \lor 1 = 1 \qquad 1 \lor 1 = 1$$

<data-logic-gate type="OR"></data-logic-gate>

<data-gate>
<data-math-sandbox level="logic" mode="result" data-steps="2" data-label="🪤 Suma logiczna">
  <div data-step="1" data-expected="1" data-label="Wyznacz stan wyjściowy: $0 \lor 1$"></div>
  <div data-step="2" data-expected="1" data-label="Wyznacz stan wyjściowy: $1 \lor 1$"></div>
</data-math-sandbox>
</data-gate>

<data-gate>
<data-truth-table gate="OR" data-label="Tabela prawdy: Suma (OR)"></data-truth-table>
</data-gate>

---

## ⚖️ Semantyka symboli: = vs ≡ vs ⇔

To jest miejsce, gdzie $90\\%$ ludzi myli znaczenie tych symboli.  
> Zapamiętaj że te symbole **_NIE są zamienne_**.

### 1. Równość ($=$)  
Porównanie *konkretnych wartości*.  
Prawda tylko jeżeli wartość lewej strony jest taka sama jak prawej ($L=P$).  
W innym przypadku przekreślamy symbol równości ($L \neq P$). 

### 2. Tożsamość / równoważność tautologiczna ($\equiv$)  
Dwa wyrażenia mają **identyczną tablicę prawdy**.  
Używane przy refaktoryzacji i optymalizacji układów.

### 3. Równoważność logiczna ($\iff$)  
Spójnik wewnątrz formuły.  
Zdanie jest prawdziwe, gdy oba składniki mają ten sam stan.

> [!NOTE]
> **Tautologia** — formuła, która jest prawdziwa dla *każdej* kombinacji wartości wejściowych.

---

## 💻 Implementacja: Logika w Kodzie

Oto jak przełożyć notację matematyczną na standardy programistyczne (JS, C++, Rust):

| Symbol | Nazwa | Operator | Sens inżynierski |
| :--- | :--- | :--- | :--- |
| $x = v$ | Przypisanie | `=` | Mutacja stanu |
| $L = P$ | Porównanie | `==` | Porównanie wartości |
| $L \equiv P$ | Tożsamość | `===` | Porównanie wartości i typów |
| $\land$ | Koniunkcja | `&&` | AND |
| $\lor$ | Alternatywa | `\|\|` | OR |
| $\neg$ | Inwersja | `!` | Odwrócenie stanu |

---

## 🪤 Sandbox: Analiza układów złożonych

<data-gate>
<data-math-sandbox level="logic" mode="result" data-steps="2" data-label="🪤 Analiza sygnałów złożonych">
  <div data-step="1" data-expected="0" data-label="Wyznacz stan układu: $1 \land \neg 1$" data-hint-wrong=" :💡 Przeanalizuj priorytet: najpierw inwersja $\neg 1$, potem koniunkcja. Masz $1 \land 0$. Czy taki układ może przewodzić?" data-hints='{"LOGIC_ERROR": "💡 Przeanalizuj priorytet: najpierw inwersja $\neg 1$, potem koniunkcja. Masz $1 \land 0$. Czy taki układ może przewodzić?"}'></div>
  <div data-step="2" data-expected="1" data-label="Wyznacz stan układu: $1 \lor \neg 1$" data-hint-wrong=" :💡 To układ równoległy. Nawet jeśli jedna ścieżka ($\neg 1 = 0$) jest zablokowana, sprawdź czy główny kanał (1) zapewnia napięcie na wyjściu." data-hints='{"LOGIC_ERROR": "💡 To układ równoległy. Nawet jeśli jedna ścieżka ($\neg 1 = 0$) jest zablokowana, sprawdź czy główny kanał (1) zapewnia napięcie na wyjściu."}'></div>
</data-math-sandbox>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- logika operuje na dwóch stanach: $0$ i $1$,  
- NOT odwraca sygnał, AND go filtruje, OR zapewnia redundancję,  
- symbole $=$, $\equiv$, $\iff$ mają różne znaczenia i nie wolno ich mylić,  
- logika matematyczna i logika w kodzie to ten sam system zapisany innymi symbolami,  
- bramki logiczne to fundament elektroniki, SQL-a, sterowników i kompilatorów.

---

W kolejnej lekcji wejdziesz w **Algebrę Boole’a** — język, który pozwala *upraszczać*, *optymalizować* i *refaktoryzować* układy logiczne.  
Poznasz bramki NAND, NOR, XOR i XNOR — prawdziwe konie pociągowe współczesnych procesorów. 🚀
