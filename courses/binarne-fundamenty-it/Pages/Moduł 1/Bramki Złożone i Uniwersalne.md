# Bramki Złożone i Uniwersalne: XOR, XNOR, NAND, NOR

Łącząc podstawowe bramki NOT, AND i OR, inżynierowie tworzą cztery kluczowe **bramki złożone**: **XOR**, **XNOR**, **NAND** oraz **NOR**.

---

## 🔀 Bramka XOR (Exclusive-OR)

Bramka **XOR** to **detektor różnicy**. Wyjście osiąga stan wysoki **1** tylko wtedy, gdy sygnały na wejściach różnią się od siebie:

<data-logic-gate type="XOR" id="gate-xor"></data-logic-gate>

<data-gate>
<data-truth-table gate="XOR" data-label="Tabela prawdy: Bramka XOR"></data-truth-table>
</data-gate>

---

## ⚖️ Bramka XNOR

Bramka **XNOR** to odwrócony XOR, czyli **detektor zgodności**. Wyjście osiąga stan wysoki **1** tylko wtedy, gdy oba wejścia są w tym samym stanie:

<data-logic-gate type="XNOR" id="gate-xnor"></data-logic-gate>

<data-gate>
<data-truth-table gate="XNOR" data-label="Tabela prawdy: Bramka XNOR"></data-truth-table>
</data-gate>

---

## 🏭 Bramka NAND

Bramka **NAND** (*Not-AND*) to odwrócony AND. Daje stan niski **_0_** tylko w jednym przypadku: gdy oba wejścia są aktywne (**1**):

<data-logic-gate type="NAND" id="gate-nand"></data-logic-gate>

<data-gate>
<data-truth-table gate="NAND" data-label="Tabela prawdy: Bramka NAND"></data-truth-table>
</data-gate>

> [!NOTE]
> Bramka NAND jest **bramką uniwersalną**: z samych bramek NAND da się zbudować dowolną inną bramkę logiczną (NOT, AND, OR, XOR).

---

## 🛡️ Bramka NOR

Bramka **NOR** (*Not-OR*) to odwrócony OR. Zwraca stan wysoki **1** tylko wtedy, gdy oba wejścia są w stanie niskim **_0_**:

<data-logic-gate type="NOR" id="gate-nor"></data-logic-gate>

<data-gate>
<data-truth-table gate="NOR" data-label="Tabela prawdy: Bramka NOR"></data-truth-table>
</data-gate>

> [!NOTE]
> Podobnie jak NAND, bramka NOR jest drugą bramką uniwersalną.

---

## 🔒 Weryfikacja: Rozpoznaj zachowanie bramek

<data-gate>
<data-connection-matcher title="Weryfikacja: Bramki Złożone">
    <item left="Bramka XOR" right="Stan 1 gdy wejścia się różnią (detektor różnicy)"></item>
    <item left="Bramka XNOR" right="Stan 1 gdy wejścia są identyczne (detektor zgodności)"></item>
    <item left="Bramka NAND" right="Stan 0 tylko przy dwóch jedynkach (odwrócony AND)"></item>
    <item left="Bramka NOR" right="Stan 1 tylko przy dwóch zerach (odwrócony OR)"></item>
    <item left="Bramka AND" right="Stan 1 tylko gdy oba wejścia są aktywne"></item>
    <item left="Bramka NOT" right="Odwrócenie sygnału (inwerter)"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Bramka XOR** to detektor różnicy: wyjście przyjmuje stan **1**, gdy wejścia różnią się od siebie.
- **Bramka XNOR** to detektor zgodności: wyjście przyjmuje stan **1**, gdy oba wejścia są w tym samym stanie.
- **Bramka NAND** zwraca **_0_** tylko przy dwóch jedynkach i jest bramką uniwersalną.
- **Bramka NOR** zwraca **1** tylko przy dwóch zerach i jest drugą bramką uniwersalną.
