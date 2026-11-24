# Podstawowe Bramki Logiczne

Na najniższym poziomie sprzętowym procesor operuje wyłącznie na dwóch stanach fizycznych:

- **1** (*High / True*): obecność napięcia zasilania ($V_{DD}$). Obwód jest aktywny.
- **_0_** (*Low / False*): brak napięcia, zwarcie z masą ($0\text{ V}$, poziom GND). Obwód jest nieaktywny.

Cała logika komputera powstaje z łączenia miniaturowych przełączników w **bramki logiczne**. Poznaj trzy elementarne klocki cyfrowego świata.

---

## 🔄 Inwersja (NOT)

Inwerter (*NOT*) odwraca sygnał wejściowy na stan przeciwny:

$\neg \mathbf{1} =$ **_$0$_** $\qquad \neg$ **_$0$_** $= \mathbf{1}$

- Operator w kodzie: `!` (w operacjach bitowych: `~`)
- Podasz prąd (**1**), na wyjściu pojawi się masa (**_0_**). Odłączysz prąd (**_0_**), na wyjściu pojawi się napięcie (**1**).

<data-logic-gate type="NOT"></data-logic-gate>

<data-gate>
<data-truth-table gate="NOT" data-label="Tabela prawdy: Inwerter (NOT)"></data-truth-table>
</data-gate>

---

## 🤝 Koniunkcja (AND)

Koniunkcja (*AND*) to sprzętowy odpowiednik obwodu szeregowego.

Prąd popłynie (**1**) tylko wtedy, gdy włączysz PIERWSZY **I** DRUGI włącznik. Wyłączenie któregokolwiek włącznika przerywa obwód, dając stan niski (**_0_**):

$\mathbf{1} \land \mathbf{1} = \mathbf{1} \qquad \mathbf{1} \land$ **_$0$_** $=$ **_$0$_**

- Operator w kodzie: `&&` (w operacjach bitowych: `&`)
- Wyjście osiąga stan **1** wyłącznie przy jednoczesnej aktywności obu wejść.

<data-logic-gate type="AND"></data-logic-gate>

<data-gate>
<data-truth-table gate="AND" data-label="Tabela prawdy: Iloczyn (AND)"></data-truth-table>
</data-gate>

---

## 🛤️ Alternatywa (OR)

Alternatywa (*OR*) reprezentuje obwód równoległy.

Prąd popłynie (**1**), gdy włączysz PIERWSZY **LUB** DRUGI włącznik (albo oba naraz). Wyjście gaśnie do zera (**_0_**) tylko wtedy, gdy oba włączniki są rozłączone:

**_$0$_** $\lor \mathbf{1} = \mathbf{1} \qquad \mathbf{1} \lor \mathbf{1} = \mathbf{1}$

- Operator w kodzie: `||` (w operacjach bitowych: `|`)
- Wyjście osiąga stan **1**, gdy co najmniej jedno wejście jest aktywne.

<data-logic-gate type="OR"></data-logic-gate>

<data-gate>
<data-truth-table gate="OR" data-label="Tabela prawdy: Suma (OR)"></data-truth-table>
</data-gate>

---

## 🪤 Sprawdzian: Analiza sygnałów złożonych

Gdy sygnał przechodzi przez kilka połączonych bramek, obowiązuje kolejność działań:
1. **Najpierw negacja ($\neg$)**: odwracasz sygnał za inwerterem.
2. **Następnie iloczyn ($\land$) lub suma ($\lor$)**: łączysz uzyskane stany.

Przeanalizuj zachowanie dwóch obwodów:
- **Obwód 1 ($1 \land \neg 1$)**: najpierw inwersja $\neg 1 =$ **_$0$_**, a potem iloczyn $1 \land 0 =$ **_$0$_**.
- **Obwód 2 ($1 \lor \neg 1$)**: najpierw inwersja $\neg 1 =$ **_$0$_**, a potem suma $1 \lor 0 = \mathbf{1}$.

<data-gate>
<data-math-sandbox level="logic" mode="result" data-steps="2" data-label="🪤 Analiza sygnałów złożonych">
  <div data-step="1" data-expected="0" data-label="Wyznacz stan układu: $1 \land \neg 1$" data-hint-wrong=" :💡 Priorytet operatorów: najpierw inwersja \(\neg 1 = 0\), następnie iloczyn \(1 \land 0 = 0\)." data-hints='{"LOGIC_ERROR": "💡 Priorytet operatorów: najpierw inwersja \\\\(\\\\neg 1 = 0\\\\), następnie iloczyn \\\\(1 \\\\land 0 = 0\\\\)."}'></div>
  <div data-step="2" data-expected="1" data-label="Wyznacz stan układu: $1 \lor \neg 1$" data-hint-wrong=" :💡 Układ równoległy: sygnał na gałęzi głównej wynosi 1, więc wyjście przyjmuje stan 1." data-hints='{"LOGIC_ERROR": "💡 Układ równoległy: sygnał na gałęzi głównej wynosi 1, więc wyjście przyjmuje stan 1."}'></div>
</data-math-sandbox>
</data-gate>

---

## 🔒 Weryfikacja: Połącz poziomy logiczne i zachowania bramek

<data-gate>
<data-connection-matcher title="Weryfikacja: Logika Stanów Dyskretnych">
    <item left="Potencjał VDD (np. 3.3V)" right="Stan wysoki: 1 (True)"></item>
    <item left="Potencjał masy GND (0V)" right="Stan niski: 0 (False)"></item>
    <item left="Bramka NOT (Inwerter)" right="Odwrócenie stanu: wyjście przeciwne do wejścia"></item>
    <item left="Bramka AND (Iloczyn)" right="Stan 1 tylko przy jednoczesnej aktywności obu wejść"></item>
    <item left="Bramka OR (Suma)" right="Stan 1 gdy co najmniej jedno wejście jest aktywne"></item>
    <item left="Układ szeregowy przełączników" right="Odpowiednik działania bramki AND"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Logika cyfrowa operuje na dwóch stabilnych stanach fizycznych: **1** ($V_{DD}$) oraz **_0_** (GND).
- Bramka NOT realizuje logiczną inwersję (odwraca sygnał na przeciwny).
- Bramka AND wymaga jednoczesnej aktywności obu wejść (obwód szeregowy).
- Bramka OR wymaga aktywności co najmniej jednego wejścia (obwód równoległy).
- W układach złożonych obowiązuje priorytet: najpierw inwersja (NOT), a następnie iloczyn (AND) i suma (OR).
