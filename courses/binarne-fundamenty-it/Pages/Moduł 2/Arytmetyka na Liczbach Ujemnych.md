# Arytmetyka na Liczbach Ujemnych

Kod U2 pozwala na zunifikowanie operacji dodawania i odejmowania w jednostce arytmetyczno-logicznej procesora (ALU). Dzięki ujemnej wadze najstarszego bitu ten sam sprzętowy sumator wielobitowy realizuje oba działania bez konieczności przełączania na osobne obwody odjemników.

---

## ⚡ Realizacja odejmowania za pomocą sumatora

W architekturze krzemowej operację odejmowania $A - B$ sprowadza się do dodania liczby przeciwnej:

$$A - B = A + (-B)_{U2} = A + (\neg B + 1)$$

Przeanalizujmy operację $5 - 3 = 2$ w rejestrze 8-bitowym:
- Liczba $+5$ w kodzie binarnym: `0000 0101`
- Liczba $-3$ w kodzie U2 (inwersja trójki `1111 1100` i dodanie jedynki): `1111 1101`

Krokowe sumowanie w 8-bitowym sumatorze (+5 oraz -3):

<data-binary-process mode="carry-borrow" base="2" operation="+" a="5" b="253" bits="8"></data-binary-process>

#### Kroki procesu sumowania w kodzie U2 na przykładzie 5 + (-3) = +2:
1. **Składniki operacji w rejestrze 8-bitowym**:
   - Składnik $A$ ($+5$): `0000 0101`
   - Składnik $B$ ($-3$ w U2): `1111 1101`
2. **Kaskada przeniesień**:
   - Kolumny od prawej do lewej sumują bity z uwzględnieniem przeniesień.
   - Na 7. pozycji (najstarszy bit znaku) zachodzi sumowanie: $0 + 1 + 1\text{ (przeniesienie)} = 2_{10}$ ($10_2$). Wpisujemy **_0_**, a jedynka wędruje jako przeniesienie na 8. pozycję (poza format 8-bitowy).
3. **Odrzucenie bitu przeniesienia (Carry Drop)**:
   - Dziewiąty bit przeniesienia wykracza poza 8-bitowy rejestr procesora. Procesor odnotowuje go we fladze przeniesienia **CF** (*Carry Flag*), lecz rejestr wynikowy zachowuje wyłącznie 8 młodszych bitów.
4. **Wynik w rejestrze**:
   - Wektor wynikowy wynosi `0000 0010`, czyli dziesiętne **$+2$**. Sumator zrealizował odejmowanie przy użyciu standardowego dodawania bez konieczności angażowania obwodów pożyczek.

---

## ⚠️ Detekcja Przepełnienia (Overflow Flag - OF) vs Przeniesienie (Carry Flag - CF)

W kodzie U2 pojawienie się bitu przeniesienia poza rejestr (*Carry*) jest zjawiskiem naturalnym i nie świadczy o błędzie wyniku.

Błąd przepełnienia zakresu (**_Overflow_**) występuje w sytuacji, gdy **wynik operacji przekracza pojemność formatu bitowego**, co prowadzi do zakłócenia bitu znaku.

W formacie 8-bitowym U2 dopuszczalny zakres wynosi od $-128$ do $+127$:
- Rozważmy dodanie dwóch liczb dodatnich: $+100$ oraz $+50$:
  $$100 + 50 = 150_{10}$$
- Liczba $150$ wymaga wagi $128$. Na pozycji 7 w kodzie U2 waga ta ma jednak znak ujemny ($-128$).
- Po zsumowaniu bitowym otrzymujemy wektor `1001 0110`:
  $$-128 + 16 + 4 + 2 = \mathbf{-106}$$

Suma dwóch liczb dodatnich dała wynik ujemny. W rejestrze procesora zapala się sprzętowa flaga przepełnienia **_OF (Overflow Flag)_**.

### Sprzętowa reguła wyznaczania flagi OF w krzemie
Jednostka ALU wyznacza stan flagi przepełnienia za pomocą jednej bramki XOR badającej przeniesienie wchodzące na najstarszy bit oraz przeniesienie wychodzące z tego bitu:

$$OF = C_{in}(MSB) \oplus C_{out}(MSB)$$

Gdy przeniesienie wpadło na pozycję znaku, ale z niej nie wyszło (lub odwrotnie), nastąpiło przepełnienie arytmetyczne formatu ze znakiem.

---

## 🕹️ Laboratorium arytmetyki U2

Przetestuj dodawanie i odejmowanie w symulatorze. Obserwuj zachowanie najstarszego bitu znaku przy przejściach przez zero oraz sytuacje przepełnienia zakresu:

<data-binary-arithmetic digits="16" base="2" u2="true"></data-binary-arithmetic>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Flagi procesora (EFLAGS), niezdefiniowane zachowanie w C++ i arytmetyka nasycona</span>
<span class="deep-dive-badge">ARCHITEKTURA ALU & C++</span>
</summary>
<div class="deep-dive-content">

Rejestr stanu procesora (np. `RFLAGS` w x86-64) rejestruje stan ostatniej operacji wykonanej przez ALU:

- **CF** (*Carry Flag*): sygnalizuje przeniesienie poza rejestr. Jest flagą błędu dla arytmetyki **unsigned**.
- **OF** (*Overflow Flag*): sygnalizuje przepełnienie zakresu wagowego. Jest flagą błędu dla arytmetyki **signed U2**.
- **SF** (*Sign Flag*): przyjmuje kopię najstarszego bitu wyniku (stan **$1$** oznacza wynik ujemny).
- **ZF** (*Zero Flag*): zapala się, gdy wszystkie bity rejestru wynikowego mają wartość **0**.

#### Instrukcje skoków warunkowych a interpretacja flag

Kompilator tłumaczy operatory porównania (`<`, `>`, `<=`, `>=`) na odrębne instrukcje skoku warunkowego w zależności od tego, czy porównywane dane są traktowane jako liczby ze znakiem, czy bez znaku:
- **Dla liczb bez znaku (unsigned)**: procesor wykonuje rozkazy `JB` (*Jump if Below*) lub `JA` (*Jump if Above*), które sprawdzają wyłącznie stan flagi przeniesienia **CF** (*Carry Flag*).
- **Dla liczb ze znakiem (signed U2)**: procesor wykonuje rozkazy `JL` (*Jump if Less*) lub `JG` (*Jump if Greater*), które sprawdzają relację flagi znaku **SF** (*Sign Flag*) oraz flagi przepełnienia **OF** (*Overflow Flag*) poprzez warunek $SF \neq OF$.

#### Konsekwencje w standardzie C i C++: Niezdefiniowane zachowanie (<span class="color-blue">Undefined Behavior</span>)

W językach C i C++ przepełnienie liczby ze znakiem (*signed overflow*) stanowi **Undefined Behavior** (UB).

##### Źródło błędnego wzorca detekcji: <span class="color-blue">x + 1 &lt; x</span>

Na poziomie rejestrów procesora przekroczenie wartości maksymalnej w kodzie U2 powoduje sprzętowe zawinięcie (*wraparound*) i zmianę bitu znaku. Dla typu 8-bitowego ze znakiem (`int8_t`):
- Maksymalna wartość wynosi **$x = 127$** (`0111 1111₂`).
- Dodanie jedynki generuje w rejestrze ciąg `1000 0000₂`, czyli wartość **$-128$**.

W asemblerze relacja $-128 < 127$ jest spełniona. Z tego względu w kodzie wyższego poziomu bywa stosowana próba weryfikacji zakresu po wykonaniu operacji:

```cpp
if (x + 1 < x) {
    // próba reakcji na przepełnienie
}
```

##### Mechanizm eliminacji warunku przez optymalizator

Standard C i C++ definiuje przepełnienie typu ze znakiem jako operację niedozwoloną. Kompilator przyjmuje aksjomat, że w poprawnym programie przepełnienie nie zachodzi, a relacja $x + 1 > x$ jest zawsze prawdziwa.

W fazie optymalizacji kompilator traktuje warunek `x + 1 < x` jako tożsamościowo fałszywy i usuwa całą instrukcję warunkową z wygenerowanego pliku binarnego. Zabezpieczenie przestaje istnieć w kodzie maszynowym.

Prawidłowa weryfikacja wymaga sprawdzenia granicy przed wykonaniem dodawania:

```cpp
if (x > INT_MAX - 1) {
    // obsługa błędu przed przekroczeniem zakresu
}
```

Dla typów bez znaku (`unsigned`, np. `uint8_t`) standard gwarantuje arytmetykę modulo $2^N$ (*wraparound*), dlatego tam kompilator zachowuje sprawdzanie relacji.

#### Arytmetyka nasycona (<span class="color-blue">Saturation Arithmetic</span>) w instrukcjach wektorowych SIMD

W przetwarzaniu sygnałów audio, wideo i grafiki 3D zawinięcie wartości przy przepełnieniu prowadziłoby do drastycznych artefaktów (np. zmiana maksymalnej bieli `255` na czerń `0` po dodaniu jednostki).

W instrukcjach wektorowych procesora (np. SSE, AVX, ARM NEON) stosuje się _**arytmetykę nasyconą**_:
- Przy przekroczeniu górnej granicy rejestr przyjmuje maksymalną dopuszczalną wartość (np. $+127$ dla 8 bitów),
- Przy przekroczeniu dolnej granicy rejestr zatrzymuje się na wartości minimalnej (np. $-128$).
Dzięki temu operacje miksowania próbek dźwiękowych nie generują trzasków wynikających z przeskoku znaku.

</div>
</details>

---

## 🔒 Weryfikacja: Arytmetyka U2 i zachowanie sprzętu

<data-gate>
  <data-connection-matcher title="Zasady Arytmetyki U2 i Przepełnienia">
    <item left="Sprzętowe odejmowanie: `A - B`" right="Dodanie liczby ujemnej: `A + (-B)`"></item>
    <item left="Wypadający bit przeniesienia poza rejestr" right="Prawidłowe w U2 (rejestr go ignoruje)"></item>
    <item left="Suma `+100` i `+50` w 8 bitach" right="Wynik `-106` (błąd przepełnienia formatu)"></item>
    <item left="Dodanie liczby dodatniej i ujemnej" right="Nigdy nie wywoła błędu przepełnienia"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Procesor nie wymaga osobnego układu odjemnika: odejmowanie wykonuje standardowy sumator poprzez dodanie liczby w kodzie U2 ($A + \neg B + 1$).
- Przeniesienie wyjściowe (*Carry Flag* - CF) w arytmetyce U2 nie oznacza błędu logicznego.
- Przepełnienie (*Overflow Flag* - OF) występuje, gdy suma liczb o tym samym znaku przekracza dopuszczalny zakres formatu bitowego ($OF = C_{in} \oplus C_{out}$).
- Standardy języków niskopoziomowych traktują przepełnienie signed jako błąd niezdefiniowany (UB), podczas gdy typy unsigned podlegają przewidywalnemu zawijaniu modulo.
