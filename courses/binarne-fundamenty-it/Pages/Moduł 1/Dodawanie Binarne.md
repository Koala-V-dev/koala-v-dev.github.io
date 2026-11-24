# Dodawanie binarne

W układach cyfrowych operacje arytmetyczne podlegają ścisłym regułom krzemu. Rejestry procesora wykonują obliczenia na określonych szerokościach bitowych (np. $8, 16, 32$ lub $64$ bity), gdzie każda operacja elementarna sprowadza się do kombinacji stanów logicznych na pojedynczych liniach danych.

---

## ➕ Mechanizm przeniesienia

W systemie dwójkowym reguły sumowania pojedynczych bitów obejmują cztery podstawowe przypadki:
- $0 + 0 = 0$
- $0 + 1 = 1$
- $1 + 0 = 1$
- $1 + 1 = 0$ (oraz przeniesienie **$1$** do kolumny po lewej stronie)

Gdy suma w danej kolumnie wynosi $2$ lub $3$, następuje **przeniesienie (*carry*)** do kolumny o wyższej wadze, analogicznie do przekroczenia wartości $9$ w systemie dziesiętnym:

<data-binary-process mode="carry-borrow" base="2" operation="+" a="7" b="3"></data-binary-process>

#### Kroki procesu ($7 + 3 = 10_{10}$, czyli $0111_2 + 0011_2$):
1. **Kolumna 0 (najmłodsza, po prawej)**: $1 + 1 = 2_{10}$. W systemie dwójkowym wartość $2$ to $10_2$. Wpisujemy **_0_**, a wartość **$1$** przekazujemy jako przeniesienie $+1$ do kolumny 1.
2. **Kolumna 1 (pełna trójka)**: Składniki to $1 + 1$, a z poprzedniej kolumny przyszło przeniesienie $+1$. Zachodzi **$1 + 1 + 1 = 3_{10}$** ($11_2$). Na tej pozycji wpisujemy **$1$**, a drugą jedynkę przekazujemy jako nowe przeniesienie $+1$ do kolumny 2.
3. **Kolumna 2**: Składniki to $1 + 0$ wraz z przychodzącym przeniesieniem $+1$, co daje $1 + 0 + 1 = 2_{10}$ ($10_2$). Wpisujemy **_0_**, a wartość **$1$** wędruje jako przeniesienie $+1$ do kolumny 3.
4. **Kolumna 3 (najstarsza)**: Składniki to $0 + 0$ wraz z przychodzącym przeniesieniem $+1$, co daje $0 + 0 + 1 = 1_{10}$ ($01_2$). Wpisujemy **$1$**.
5. **Wynik**: Zestawienie kolumn daje liczbę _**$1010_2$**_ ($10_{10}$).

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Układy Half-Adder i Full-Adder w krzemie</span>
<span class="deep-dive-badge">LOGIKA CYFROWA & ALU</span>
</summary>
<div class="deep-dive-content">

Podczas sumowania kolumnowego na poziomie sprzętowym każda pozycja wymaga przetworzenia trzech sygnałów: bitu odjemnika $A$, bitu składnika $B$ oraz sygnału przeniesienia z pozycji poprzedniej ($C_{in}$).

W jednostce arytmetyczno-logicznej (ALU) realizują to dwa komplementarne bloki logiczne: **Półsumator** (*Half-Adder*) oraz **Pełny sumator** (*Full-Adder*).

### 1. Półsumator (Half-Adder): dodawanie dwóch bitów

Półsumator obsługuje wyłącznie dwa bity wejściowe ($A$ i $B$). Nie posiada wejścia na przeniesienie przychodzące, dlatego może samodzielnie przetwarzać jedynie najmłodszą pozycję ($2^0$).

Składa się z dwóch bramek logicznych:
- **Bit sumy ($S$):** Bramka `XOR` ($S = A \oplus B$). Wynik wynosi **$1$**, gdy dokładnie jeden z bitów jest aktywny.
- **Bit przeniesienia ($C$):** Bramka `AND` ($C = A \cdot B$). Sygnał przeniesienia powstaje wyłącznie przy jednoczesnej aktywności obu wejść.

<data-logic-circuit type="half-adder"></data-logic-circuit>

W powyższym obwodzie zmiana stanów $A$ i $B$ ilustruje podział sygnału: przy kombinacji $A=1, B=1$ bramka XOR ustala sumę lokalną na **_0_**, a bramka AND generuje przeniesienie wyjściowe **$C = 1$**, co odpowiada wartości dwójkowej $10_2 = 2_{10}$.

### 2. Pełny sumator (Full-Adder): dodawanie z przeniesieniem

Dla pozycji wyższych niż najmłodsza układ musi uwzględniać trzy bity: $A$, $B$ oraz przeniesienie $C_{in}$.

Układ realizuje się przez kaskadowe połączenie dwóch półsumatorów oraz bramki OR:

<data-logic-circuit type="full-adder"></data-logic-circuit>

Przepływ sygnałów w pełnym sumatorze:
1. **Pierwszy półsumator (HA 1)** sumuje bity $A$ i $B$, generując sumę częściową $S_1$ oraz przeniesienie częściowe $C_1$.
2. **Drugi półsumator (HA 2)** sumuje sygnał $S_1$ z przychodzącym przeniesieniem $C_{in}$, wyznaczając ostateczny bit sumy $S$.
3. **Bramka OR** ustala ostateczne przeniesienie wyjściowe $C_{out}$: jeśli którykolwiek z półsumatorów wygenerował przeniesienie ($C_1 = 1$ lub $C_2 = 1$), sygnał $C_{out} = \mathbf{1}$ trafia do starszej pozycji.

### 3. Skalowalne sumatory wielobitowe (Ripple-Carry Adder)

Wielobitowy sumator procesora powstaje przez szeregowe połączenie bloków pełnych sumatorów:
- **Pozycja najmłodsza ($2^0$)**: wystarcza układ *Half-Adder*, ponieważ nie występuje przeniesienie wejściowe ($C_{in} = 0$).
- **Kolejne pozycje ($2^1, \dots, 2^{N-1}$)**: każdy stopień stanowi układ *Full-Adder*, którego wejście $C_{in}$ jest połączone bezpośrednio z wyjściem $C_{out}$ stopnia poprzedniego.

Sygnał przeniesienia propaguje się wzdłuż łańcucha kolejnych stopni, stąd nazwa układu: **Ripple-Carry Adder** (sumator z przeniesieniem falowym).

Materiały referencyjne:
- [Full Adder 2-bit](https://www.theengineeringprojects.com/2021/01/2-bit-full-adder-using-logic-gates-in-proteus.html)
- [Full Adder 4-bit](https://www.theengineeringprojects.com/2021/01/4-bit-full-adder-using-logic-gates-in-proteus.html)

</div>
</details>

<data-gate>
  <data-arithmetic-challenge base="2" operation="+" count="2"></data-arithmetic-challenge>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Dodawanie binarne** operuje na wagach potęg dwójki: suma $1+1$ generuje bit sumy **_0_** oraz przeniesienie **$1$** (*carry*) do kolejnej kolumny.
- **Półsumator (*Half-Adder*)** składa się z bramki XOR (bit sumy $S$) oraz bramki AND (bit przeniesienia $C$).
- **Pełny sumator (*Full-Adder*)** łączy dwa półsumatory i bramkę OR, umożliwiając przetworzenie trzech bitów jednocześnie ($A$, $B$, $C_{in}$).
- Wielobitowe sumatory procesora (np. *Ripple-Carry Adder*) powstają przez szeregowe przekazywanie sygnału $C_{out}$ do wejścia $C_{in}$ sąsiedniej kolumny.
