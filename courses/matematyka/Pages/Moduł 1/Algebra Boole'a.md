# Algebra Boole'a: Optymalizacja Struktur Logicznych

Bramki logiczne to tylko klocki.  
Prawdziwa inżynieria zaczyna się wtedy, gdy musisz z tych klocków zbudować **wydajny system**.

**Algebra Boole’a** to język refaktoryzacji logiki.  
Pozwala skracać ścieżki sygnałowe, usuwać redundancję i minimalizować liczbę bramek — a to oznacza:

- mniejszy pobór prądu,  
- krótszą ścieżkę krytyczną,  
- szybszy układ,  
- prostszy kod.

To jest dokładnie to, co robią kompilatory, syntezatory HDL i optymalizatory zapytań SQL.

---

## 🔄 Prawo Inwolucji (Usuwanie Redundancji)

Najprostsza forma optymalizacji:  
**podwójna negacja niczego nie zmienia.**

$$\neg(\neg p) \equiv p$$

W elektronice:  
każda negacja to dodatkowa bramka, dodatkowy tranzystor i dodatkowe opóźnienie.  
Dlatego syntezatory logiczne automatycznie usuwają pary negacji.

Na schematach negację poznasz po małym kółku (bubble) na wejściu lub wyjściu bramki.

<data-gate>
<data-math-sandbox level="logic" mode="transcription" data-steps="1" data-label="🪤 Eliminacja redundancji sygnału">
  <div data-step="1" data-expected="p" data-label="Zredukuj inwolucję: $\neg(\neg p)$"></div>
</data-math-sandbox>
</data-gate>

---

## 🧪 Prawa de Morgana (Transformacja Logiki)

To Twój **szwajcarski scyzoryk**.  
Pozwalają zamieniać koniunkcję (AND) na alternatywę (OR) i odwrotnie, co jest kluczowe przy optymalizacji warunków i projektowaniu układów.

- **I prawo**: Negacja iloczynu to suma negacji.
  $$\neg(p \land q) \equiv \neg p \lor \neg q$$

- **II prawo**: Negacja sumy to iloczyn negacji.
  $$\neg(p \lor q) \equiv \neg p \land \neg q$$


## 🛠️ Bramki Uniwersalne: NAND i NOR

Z praw de Morgana wynikają dwie najważniejsze bramki w elektronice cyfrowej. Nazywamy je **bramkami uniwersalnymi**, bo **z samych NAND-ów lub samych NOR-ów można zbudować dowolny układ logiczny** — od prostego NOT aż po pełny procesor.

Dlaczego są tak ważne? Bo każda funkcja logiczna może zostać zredukowana do kombinacji:
- negacji (NOT),
- koniunkcji (AND),
- alternatywy (OR).

Jeśli jakaś bramka potrafi odtworzyć **NOT, AND i OR**, to potrafi odtworzyć *wszystko*.

I właśnie to robią NAND i NOR.

---

### 🧱 Budowanie logiki z NAND ($\neg$ Iloczynu)

<data-logic-gate type="NAND"></data-logic-gate>

#### 1. NOT z NAND  
$$\text{NOT}(p) = \text{NAND}(p, p)$$

| p | NAND(p,p) |
|---|-----------|
| 0 | **1** |
| 1 | **0** |

#### 2. AND z NAND  
$$p \land q = \text{NOT}(\text{NAND}(p, q))$$

| p | q | NAND(p,q) | NOT(...) = AND |
|---|---|-----------|----------------|
| 0 | 0 | 1 | **0** |
| 0 | 1 | 1 | **0** |
| 1 | 0 | 1 | **0** |
| 1 | 1 | 0 | **1** |

#### 3. OR z NAND  
$$p \lor q = \text{NAND}(\text{NAND}(p,p),\ \text{NAND}(q,q))$$

I pełna tablica:

| p | q | NOT(p) | NOT(q) | OR |
|---|---|--------|--------|----|
| 0 | 0 | 1 | 1 | **0** |
| 0 | 1 | 1 | 0 | **1** |
| 1 | 0 | 0 | 1 | **1** |
| 1 | 1 | 0 | 0 | **1** |



<data-gate>
<data-truth-table gate="NAND" header="\neg(p \land q)"></data-truth-table>
</data-gate>

---

### 🧱 Budowanie logiki z NOR ($\neg$ Sumy)

<data-logic-gate type="NOR"></data-logic-gate>

#### 1. NOT z NOR  
Zewrzyj wejścia:

$$\text{NOT}(p) = \text{NOR}(p, p)$$

| p | NOR(p,p) |
|---|----------|
| 0 | **1** |
| 1 | **0** |

#### 2. OR z NOR  
OR to negacja NOR:

$$p \lor q = \text{NOT}(\text{NOR}(p, q))$$

| p | q | NOR(p,q) | OR |
|---|---|----------|----|
| 0 | 0 | 1 | **0** |
| 0 | 1 | 0 | **1** |
| 1 | 0 | 0 | **1** |
| 1 | 1 | 0 | **1** |

#### 3. AND z NOR  
Z prawa de Morgana:

$$p \land q = \text{NOR}(\text{NOR}(p,p),\ \text{NOR}(q,q))$$

| p | q | NOT(p) | NOT(q) | AND |
|---|---|--------|--------|------|
| 0 | 0 | 1 | 1 | **0** |
| 0 | 1 | 1 | 0 | **0** |
| 1 | 0 | 0 | 1 | **0** |
| 1 | 1 | 0 | 0 | **1** |

<data-gate>
<data-truth-table gate="NOR" header="\neg(p \lor q)"></data-truth-table>
</data-gate>

---

### 🧠 Dlaczego procesory kochają NAND?

- NAND jest **tańszy** w produkcji (mniej tranzystorów niż AND + NOT).  
- NAND jest **szybszy** (krótsza ścieżka sygnałowa).  
- NAND jest **stabilniejszy** (łatwiej kontrolować progi napięć).  
- NAND jest **uniwersalny** (możesz zbudować cały CPU z jednego typu bramki).

Dlatego większość nowoczesnych układów logicznych jest fizycznie zbudowana z… **NAND-ów.**

Tak, Twój procesor to w 90% *NAND farm*. 😉

---

## 🔀 Detekcja Różnic: XOR i XNOR

Do tej pory pracowaliśmy na bramkach, które opisują **współwystępowanie** sygnałów (AND, OR) lub ich **odwracanie** (NOT).  
Ale w inżynierii często potrzebujemy czegoś innego:

> **_Nie interesuje mnie, czy sygnały są wysokie._**  
> **Interesuje mnie, czy są takie same, czy różne.**

I tu pojawiają się dwie bramki:

- **XOR** — wykrywa różnicę (sygnały różne → 1)  
- **XNOR** — wykrywa zgodność (sygnały takie same → 1)

To są bramki **porównujące**, a nie „łączące” sygnały.  
Dlatego ich rola jest zupełnie inna niż AND/OR/NAND/NOR.

---

### ⊕ XOR — Alternatywa Wykluczająca (Detektor Różnic)

XOR działa jak **dodawanie modulo 2**:

| p | q | p ⊕ q |
|---|---|--------|
| 0 | 0 | **0** |
| 0 | 1 | **1** |
| 1 | 0 | **1** |
| 1 | 1 | **0** |

Interpretacja:

- sygnały **różne** → wynik **1**  
- sygnały **identyczne** → wynik **0**

Struktura logiczna XOR:

$$p \oplus q \equiv (p \land \neg q) \lor (\neg p \land q)$$

**Gdzie to spotkasz?**

- **ALU** — dodawanie bitów bez przeniesienia  
- **kryptografia** — XOR jest operacją *symetryczną*  
- **kodowanie błędów** — parity bit, CRC, ECC

<data-logic-gate type="XOR"></data-logic-gate>

<data-gate>
<data-truth-table gate="XOR" header="p \oplus q"></data-truth-table>
</data-gate>

---

### ⊙ XNOR — Komparator Logiczny (Detektor Zgodności)

XNOR to zaprzeczenie XOR:

| p | q | p XNOR q |
|---|---|-----------|
| 0 | 0 | **1** |
| 0 | 1 | **0** |
| 1 | 0 | **0** |
| 1 | 1 | **1** |

Interpretacja:

- sygnały **identyczne** → wynik **1**  
- sygnały **różne** → wynik **0**

To sprzętowy odpowiednik operatora `===`:

- porównuje wartość,  
- porównuje stan,  
- porównuje zgodność bitową.

<data-logic-gate type="XNOR"></data-logic-gate>

<data-gate>
<data-truth-table gate="XNOR" header="p \iff q"></data-truth-table>
</data-gate>


---

## 🏹 Relacje Przyczynowe: Implikacja i Równoważność

Do tej pory pracowaliśmy na bramkach, które opisują **co się dzieje**.  
Teraz przechodzimy do operatorów, które opisują **zależności między zdarzeniami**.

To nie są bramki fizyczne — to **relacje logiczne**, które budują:

- reguły biznesowe,  
- warunki w kodzie,  
- systemy eksperckie,  
- automaty sterujące,  
- logikę formalną.

---

### ➤ Implikacja ($p \implies q$)

*„Jeśli $p$, to $q$”.*

To nie jest „strzałka w prawo”.  
To jest **model zależności przyczynowej**.

Formalnie:

$$p \implies q \equiv \neg p \lor q$$

Tablica prawdy:

| p | q | p ⇒ q | Interpretacja |
|---|---|-------|---------------|
| 0 | 0 | **1** | brak warunku → OK |
| 0 | 1 | **1** | brak warunku → OK |
| 1 | 0 | **0** | warunek spełniony, efekt nie → **_BŁĄD_** |
| 1 | 1 | **1** | warunek spełniony, efekt też → OK |

### 🛠️ Punkt Kontrolny: Intuicja inżynierska

<data-gate>
<data-quiz>
  <question>Jeżeli system mówi: „Jeśli czujnik = 1, to uruchom pompę”. Jaka sytuacja jest niedozwolona?</question>
  <options>
    <option>czujnik = 0, pompa = 1</option>
    <option correct>czujnik = 1, pompa = 0</option>
    <option>czujnik = 1, pompa = 1</option>
  </options>
  <div data-hint="error">To sytuacja, w której czujnik się aktywował, ale system nie zareagował.</div>
  <div data-hint="success">Dokładnie! To jedyna sytuacja, w której warunek jest spełniony (czujnik = 1), ale efekt nie następuje (pompa = 0), co łamie regułę implikacji.</div>
</data-quiz>
</data-gate>

---

### ➤ Równoważność ($p \iff q$)

*„$p$ i $q$ mają dokładnie ten sam stan.”*

To jest **komparator logiczny** — sprzętowo realizowany przez XNOR.

Tablica prawdy:

| p | q | p ⇔ q | Interpretacja |
|---|---|-------|---------------|
| 0 | 0 | **1** | zgodne |
| 0 | 1 | **0** | **_różne_** |
| 1 | 0 | **0** | **_różne_** |
| 1 | 1 | **1** | zgodne |

**Zastosowania:**

- walidacja danych,  
- porównywanie sygnałów,  
- wykrywanie błędów,  
- synchronizacja stanów.

---

## 🏗️ Prawa Algebry Boole’a: Narzędzia Optymalizacji

Algebra Boole’a to nie teoria — to **zestaw reguł refaktoryzacji**, które skracają układy i warunki logiczne.

Każde z tych praw pozwala:

- usunąć zbędne bramki,  
- skrócić ścieżkę krytyczną,  
- uprościć kod,  
- zmniejszyć pobór prądu.

---

### 🔹 Neutralność

| Prawo | Znaczenie |
|-------|-----------|
| $p \land 1 \equiv p$ | AND z 1 nic nie zmienia |
| $p \lor 0 \equiv p$ | OR z 0 nic nie zmienia |

**Przykład:**  
`if (x && true)` → `if (x)`

---

### 🔹 Dominacja

| Prawo | Znaczenie |
|-------|-----------|
| $p \lor 1 \equiv 1$ | OR z 1 zawsze daje 1 |
| $p \land 0 \equiv 0$ | AND z 0 zawsze daje 0 |

**Przykład:**  
`x || true` → zawsze `true`

---

### 🔹 Idempotentność

| Prawo | Znaczenie |
|-------|-----------|
| $p \lor p \equiv p$ | powtarzanie OR nic nie daje |
| $p \land p \equiv p$ | powtarzanie AND nic nie daje |

**Przykład:**  
`x && x` → `x`

---

### 🔹 Absorpcja

| Prawo | Znaczenie |
|-------|-----------|
| $p \lor (p \land q) \equiv p$ | OR „połyka” AND |
| $p \land (p \lor q) \equiv p$ | AND „połyka” OR |

**Przykład:**  
`x || (x && y)` → `x`

---

### 🔹 Rozdzielność

| Prawo | Znaczenie |
|-------|-----------|
| $p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$ | rozbijanie AND w OR |
| $p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$ | rozbijanie OR w AND |

**Przykład:**  
`x || (y && z)` → `(x || y) && (x || z)`

To jest fundament minimalizacji układów logicznych.

---

## 🔗 Połącz Pary: Prawa logiczne

<data-gate>
<data-connection-matcher title="Prawa logiczne">
    <item left="Neutralność" right="AND z 1 nic nie zmienia"></item>
    <item left="Dominacja" right="OR z 1 zawsze daje 1"></item>
    <item left="Idempotentność" right="Powtarzanie operacji nic nie zmienia"></item>
    <item left="Rozdzielność" right="AND w OR"></item>
    <item left="Absorpcja" right="OR połyka AND"></item>
    <item left="I Prawo De Morgana" right="Odwrotność iloczynu = iloczyn odwrotności"></item>
    <item left="II Prawo De Morgana" right="Odwrotność sumy = suma odwrotności"></item>
</data-connection-matcher>
</data-gate>
---

## 📚 Specyfikacja Techniczna: Operatory i Symbole

| Operacja | Symbol matematyczny | Bramka | Znaczenie inżynierskie | Kod (JS/C++) |
|---------|----------------------|--------|-------------------------|--------------|
| Negacja | $\neg p$ | NOT | Odwrócenie sygnału | `!p` |
| Koniunkcja | $p \land q$ | AND | Wymagane oba sygnały | `p && q` |
| Alternatywa | $p \lor q$ | OR | Wystarczy jeden sygnał | `p \|\| q` |
| NAND | $\neg(p \land q)$ | NAND | Bramka uniwersalna | `!(p && q)` |
| NOR | $\neg(p \lor q)$ | NOR | Bramka uniwersalna | `!(p \|\| q)` |
| XOR | $p \oplus q$ | XOR | Detekcja różnic | `p ^ q` |
| XNOR | $p \iff q$ | XNOR | Detekcja zgodności | `!(p ^ q)` |
| Implikacja | $p \implies q$ | — | Reguła warunkowa | `!p \|\| q` |
| Równoważność | $p \iff q$ | XNOR | Porównanie stanów | `p === q` |
| Tautologia | $1$ | — | Zawsze prawda | — |
| Sprzeczność | $0$ | — | Zawsze fałsz | — |

> [!CAUTION]
> `^` w JS/C++ to **bitowy XOR**, nie logiczny.

---

## 🪤 Sandbox: Refaktoryzacja Inżynierska

### Zadanie 1  
Zredukuj sygnał:

$$\neg(p \land q) \land p$$

<data-gate>
<data-math-sandbox level="logic" mode="transcription" data-steps="4" data-label="🪤 Minimalizacja Struktur — Zadanie 1">
  <div data-step="1" data-expected="(\neg p \lor \neg q) \land p" data-label="Prawa de Morgana" data-hint-wrong="\land:💡 Prawo de Morgana: negacja koniunkcji zamienia się w alternatywę (\(\lor\)) negacji. Sprawdź operator w nawiasie." data-hints='{"LOGIC_ERROR": "💡 Prawo de Morgana: negacja koniunkcji zamienia się w alternatywę \\\\(\\\\lor\\\\) negacji. Sprawdź operator w nawiasie."}'></div>
  <div data-step="2" data-expected="(\neg p \land p) \lor (\neg q \land p)" data-label="Rozdzielność" data-hint-wrong="\lor:💡 Rozdzielność: zewnętrzny sygnał \(p\) musi zostać rozdzielony (przemnożony) przez oba składniki nawiasu." data-hints='{"LOGIC_ERROR": "💡 Rozdzielność: zewnętrzny sygnał \\\\(p\\\\) musi zostać rozdzielony (przemnożony) przez oba składniki nawiasu."}'></div>
  <div data-step="3" data-expected="0 \lor (\neg q \land p)" data-label="Kolizja: $\neg p \land p \equiv 0$" data-hint-wrong="1:💡 Kolizja! Sygnał \(\neg p \land p\) to sprzeczność — wynik to zawsze 0." data-hints='{"LOGIC_ERROR": "💡 Kolizja! Sygnał \\\\(\\\\neg p \\\\land p\\\\) to sprzeczność — wynik to zawsze 0."}'></div>
  <div data-step="4" data-expected="\neg q \land p" data-label="Eliminacja zera" data-hint-wrong="0:💡 Eliminacja zera: w alternatywie (OR) zero jest elementem neutralnym i można je usunąć." data-hints='{"LOGIC_ERROR": "💡 Eliminacja zera: w alternatywie (OR) zero jest elementem neutralnym i można je usunąć."}'></div>
</data-math-sandbox>
</data-gate>

---

### Zadanie 2  
Zredukuj:

$$(p \land q) \lor (p \land \neg q)$$

<data-gate>
<data-math-sandbox level="logic" mode="transcription" data-steps="3" data-label="🪤 Minimalizacja Struktur — Zadanie 2">
  <div data-step="1" data-expected="p \land (q \lor \neg q)" data-label="Faktoryzacja" data-hint-wrong="\land:💡 Faktoryzacja: wyciągnij \(p\) przed nawias. Wewnątrz zostanie suma (\(\lor\)) pozostałych sygnałów." data-hints='{"LOGIC_ERROR": "💡 Faktoryzacja: wyciągnij \\\\(p\\\\) przed nawias. Wewnątrz zostanie suma \\\\(\\\\lor\\\\) pozostałych sygnałów."}'></div>
  <div data-step="2" data-expected="p \land 1" data-label="Prawo wyłączonego środka" data-hint-wrong="0:💡 Prawo wyłączonego środka: \(q \lor \neg q\) to tautologia — zawsze któryś kanał jest aktywny (1)." data-hints='{"LOGIC_ERROR": "💡 Prawo wyłączonego środka: \\\\(q \\\\lor \\\\neg q\\\\) to tautologia — zawsze któryś kanał jest aktywny (1)."}'></div>
  <div data-step="3" data-expected="p" data-label="Neutralność jedynki" data-hint-wrong="1:💡 Neutralność jedynki: koniunkcja (AND) z 1 nie zmienia stanu sygnału, wynik zależy tylko od \(p\)." data-hints='{"LOGIC_ERROR": "💡 Neutralność jedynki: koniunkcja (AND) z 1 nie zmienia stanu sygnału, wynik zależy tylko od \\\\(p\\\\)."}'></div>
</data-math-sandbox>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Algebra Boole’a to język **optymalizacji logiki**, a nie tylko zestaw symboli.  
- **NAND i NOR** są bramkami uniwersalnymi — zbudujesz z nich dowolny układ, od NOT po pełny procesor.  
- **XOR** wykrywa różnice, **XNOR** wykrywa zgodność — to fundament porównywania bitów i budowy sumatorów.  
- **Implikacja** opisuje zależności przyczynowe, **równoważność** opisuje zgodność stanów — to logika reguł i systemów eksperckich.  
- Prawa Boole’a (neutralność, dominacja, idempotentność, absorpcja, rozdzielność) to **narzędzia refaktoryzacji**, które skracają układy i warunki logiczne.  
- Minimalizacja logiki = **mniej bramek, krótsza ścieżka krytyczna, niższy pobór prądu i prostszy kod**.

---

W kolejnej lekcji przechodzimy do **Teorii Zbiorów** — fundamentu strukturalnego, który pozwala formalnie opisywać przestrzenie danych i relacje między nimi. 🦾🐨
