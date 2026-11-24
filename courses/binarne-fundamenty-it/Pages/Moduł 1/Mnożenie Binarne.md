# Mnożenie Binarne

## ✖️ Iloczyny cząstkowe, przesunięcia i sumowanie

Mnożenie binarne składa się z trzech powtarzalnych operacji:
1. **Przemnożenie bitowe (iloczyn cząstkowy)**: każdą cyfrę mnożnej $A$ mnożymy przez bieżący bit mnożnika $B$ ($0 \cdot 0 = 0$, $1 \cdot 0 = 0$, $0 \cdot 1 = 0$, $1 \cdot 1 = 1$, realizowane sprzętowo bramką `AND`).
2. **Przesunięcie w lewo (*bit-shift*, oznaczane symbolem `« k`)**: każda jedynka na pozycji o indeksie $k$ mnożnika przesuwa mnożną w lewo o $k$ pozycji (co w zapisie odpowiada dopisaniu $k$ zer uzupełniających prawą przestrzeń, np. `« 2` oznacza przesunięcie o 2 pozycje i dopisanie dwóch zer: `00`).
3. **Sumowanie iloczynów cząstkowych**: sumujemy wszystkie wygenerowane przesunięte wiersze w pionowym słupku.

Przeanalizuj mnożenie $11_{10}$ (`1011`) przez $5_{10}$ (`101`):

<data-binary-process mode="shift-multiply" a="11" b="5"></data-binary-process>

#### 4 kroki powyższego procesu ($11 \cdot 5 = 55_{10}$, czyli $1011_2 \cdot 101_2$):
1. **Przemnożenie przez bit 0 ($B[0] = 1$)**: Mnożną $A$ mnożymy przez $1$. Brak przesunięcia (waga $2^0$, 0 zer) $\to$ zapisujemy iloczyn cząstkowy: `1011` ($11_{10}$).
2. **Przemnożenie przez bit 1 ($B[1] = 0$)**: Przemnożenie mnożnej $A$ przez $0$ daje zero ($0 \cdot A = 0$) $\to$ wiersz zer pomijamy w dalszym sumowaniu.
3. **Przemnożenie przez bit 2 ($B[2] = 1$) z przesunięciem (`« 2`)**: Zapisujemy $2$ zera wypełniając prawą przestrzeń (przesunięcie w lewo o 2 pozycje: `« 2`, waga $2^2$) i mnożymy $A$ przez $1$ $\to$ zapisujemy iloczyn cząstkowy: `101100` ($44_{10}$).
4. **Sumowanie iloczynów cząstkowych**: Sumujemy niezerowe wiersze cząstkowe ($B[0]$ oraz $B[2]$): $1011_2 + 101100_2 = \mathbf{110111_2}$ ($11 + 44 = 55_{10}$).

> [!IMPORTANT] 🧠 Czy w systemie dwójkowym naprawdę nie ma mnożenia, tylko „przepisywanie”?
> Ponieważ w systemie binarnym każda cyfra mnożnika to wyłącznie $0$ lub $1$, mamy do czynienia ze szczególnym przypadkiem:
> - $1 \cdot A = A$ (wygląda jak „przepisanie” mnożnej $A$),
> - $0 \cdot A = 0$ (wiersz samych zer, który po prostu pomijamy).
>
> Może to rodzić złudne przekonanie, że *„w mnożeniu pisemnym nie mnożymy, a jedynie przepisujemy i dodajemy”*. **To myślenie byłoby zgubne w systemach o wyższej bazie!** W systemie ósemkowym (baza 8) lub szesnastkowym (baza 16) cyfry mnożnika wynoszą np. $3, 7$ czy $\text{E}$. Wtedy każda pozycja wymaga prawdziwego przemnożenia cyfry przez mnożną i obsłużenia przeniesień iloczynu! System binarny to po prostu najprostszy, elegancki przypadek tego samego uniwersalnego algorytmu.

#### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Mnożenie przez 2^k (Shift)</b><b>Sumowanie wielu wierszy</b></tabs>
<div>

_**Mnożenie przez potęgę dwójki**_ odpowiada przesunięciu bitowemu w lewo:
- `x * 2` $\to$ `x << 1` (dopisanie 1 zera)
- `x * 4` $\to$ `x << 2` (dopisanie 2 zer)
- `x * 8` $\to$ `x << 3` (dopisanie 3 zer)

W architekturze x86 i ARM przesunięcie bitowe wykonuje się w jednym cyklu zegara, podczas gdy ogólna instrukcja mnożenia `imul` może wymagać kilku cykli.

</div>
<div>

Gdy w jednej kolumnie sumowanych wierszy częściowych występuje więcej niż jedna jedynka:
- **Dwie jedynki ($1+1$)**: wynik pozycji to $0$, przeniesienie $+1$ do sąsiedniej kolumny.
- **Trzy jedynki ($1+1+1$)**: wynik pozycji to $1$, przeniesienie $+1$ do sąsiedniej kolumny.
- **Cztery jedynki ($1+1+1+1$)**: suma wynosi $4_{10} = 100_2$. Wynik pozycji to $0$, a przeniesienie $+1$ trafia o dwie kolumny w lewo.

> **Procesor w pętli akumulatora sumuje wiersze parami, dodając kolejne wiersze częściowe do sumy bieżącej.**
> **_Nie myl go z akumulatorem elektrycznym magazynującym energię._**
> *Akumulator wykonuje proces akumulacji, czyli gromadzenia wyników częściowych i przechowywania bieżącej sumy obliczeń.*

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Jak mnoży procesor? Mnożnik macierzowy w krzemie (Array Multiplier)</span>
<span class="deep-dive-badge">LOGIKA CYFROWA & KRZEM</span>
</summary>
<div class="deep-dive-content">

Sprzętowy mnożnik macierzowy (*Array Multiplier*) realizuje operację mnożenia w układzie czysto kombinacyjnym za pomocą siatki bramek iloczynu i sumatorów:

1. **Bramki AND jako 1-bitowe mnożniki**: Ponieważ iloczyn bitowy $A \cdot B$ zwraca $1$ tylko wtedy, gdy oba bity są równe $1$, **pojedyncza bramka AND jest w krzemie 1-bitowym mnożnikiem!** Cztery bramki AND generują wszystkie iloczyny cząstkowe ($A_0B_0$, $A_1B_0$, $A_0B_1$, $A_1B_1$).
2. **Przesunięcie w krzemie za darmo (0 ns)**: Zauważ, że w układzie kombinacyjnym przesunięcie wiersza o pozycję nie wymaga żadnej bramki logicznej! To po prostu odpowiednie fizyczne poprowadzenie przewodów przesuniętych o jedno wejście w lewo.
3. **Półsumatory (Half-Adders) sumujące wiersze**: Iloczyny cząstkowe z tej samej kolumny trafiają do znanych Ci z pierwszej sekcji półsumatorów, które wyznaczają ostateczne bity iloczynu ($P_0, P_1, P_2, P_3$).

<data-logic-circuit type="multiplier-2bit"></data-logic-circuit>

Przepływ sygnałów w mnożniku 2-bitowym:
* **Bit $P_0$ (najmłodszy bit iloczynu)**: Pochodzi bezpośrednio z bramki $A_0 \cdot B_0$ (brak konieczności sumowania).
* **Półsumator 1 (HA 1)**: Sumuje bity z pierwszej kolumny przesunięcia ($A_1 \cdot B_0$ oraz $A_0 \cdot B_1$). Wyjście sumy XOR wyznacza bit **$P_1$**, a przeniesienie $C_1$ wędruje do starszej kolumny.
* **Półsumator 2 (HA 2)**: Sumuje iloczyn $A_1 \cdot B_1$ z przychodzącym przeniesieniem $C_1$. Wyjście sumy XOR wyznacza bit **$P_2$**, a wyjście przeniesienia AND to najwyższy bit **$P_3$**.

> [!TIP] Wypróbuj w widgecie:
> Ustaw $A = 3_{10}$ (`11`) oraz $B = 3_{10}$ (`11`). Zobacz, jak wszystkie 4 bramki AND zapalają się na $1$, a oba półsumatory propagują przeniesienia, dając na wyjściu wynik $P_3P_2P_1P_0 = 1001_2 = \mathbf{9_{10}}$!

</div>
</details>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Zastępowanie mnożenia przesunięciami (Strength Reduction)</span>
<span class="deep-dive-badge">C++ & KOMPILATORY</span>
</summary>
<div class="deep-dive-content">

Kompilatory języków C i C++ (GCC, Clang, MSVC) na poziomie optymalizacji przekształcają mnożenie przez stałe znane na etapie kompilacji na sekwencje przesunięć bitowych i dodawania (*strength reduction*).

#### 1. Rozbicie matematyczne (rozdzielność mnożenia)
Liczba $9$ nie jest potęgą dwójki, ale jest sumą najbliższej potęgi ($2^3 = 8$) i reszty ($1$):
$$9 \cdot x = (8 + 1) \cdot x = (2^3 + 1) \cdot x = (x \cdot 2^3) + (x \cdot 1)$$

Ponieważ mnożenie przez potęgę dwójki $2^k$ to przesunięcie bitowe w lewo o $k$ pozycji ($x \ll k$), otrzymujemy:
$$9 \cdot x = (x \ll 3) + x$$

#### 2. Sprawdźmy na konkretnym przykładzie dla $x = 5$:
Cel: obliczyć $5 \cdot 9 = 45_{10}$.
* Zapis binarny liczby $x$: $5_{10} = 101_2$.
* Przesunięcie o 3 bity w lewo ($x \ll 3$): dopisujemy 3 zera, uzyskując $101000_2 = 40_{10}$ (czyli $5 \cdot 8$).
* Brakuje nam jeszcze jednej piątki do dziewięciu, więc dodajemy $+ x$:
  $$101000_2 + 101_2 = 101101_2 = 45_{10}$$
Wynik zgadza się perfekcyjnie!

#### 3. Co generuje kompilator w kodzie maszynowym?

```cpp
uint32_t multiplyBy9(uint32_t x) {
    return x * 9; 
}
```

Kompilator nie użyje powolnej instrukcji mnożenia `imul` (która zajmuje 3-4 cykle zegara procesora). Na architekturze x86/x64 zamieni to na genialną instrukcję adresową `LEA` (*Load Effective Address*):

<strong>Asembler:</strong>
```asm
; RDI przechowuje argument x, EAX zwróci wynik
lea eax, [rdi + rdi*8]   ; Oblicza x + 8*x  co jest równoważne z 9*x, ale taki zapis wykona się w dokładnie 1 cyklu zegara!
ret
```

Układ sprzętowy generujący adresy w procesorze (AGU) potrafi zsumować rejestr bazowy i rejestr indeksowy przeskalowany przez 1, 2, 4 lub 8 w zaledwie **jednym cyklu zegara**. Kompilator sprytnie „oszukuje” procesor, wykonując szybkie mnożenie pod przykrywką obliczania adresu!

</div>
</details>

<data-gate>
  <data-arithmetic-challenge base="2" operation="*" count="2"></data-arithmetic-challenge>
</data-gate>


---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Mnożenie binarne** składa się z trzech operacji elementarnych: iloczynów cząstkowych (bramki AND), przesunięć bitowych (*bit-shift* `<<`) oraz sumowania w pionowym słupku.
- **Mnożenie przez potęgi dwójki ($2^k$)** odpowiada przesunięciu bitowemu w lewo (`x << k`), wykonującemu się w 1 cyklu zegara procesora.
- **Mnożnik macierzowy (*Array Multiplier*)** w krzemie łączy bramki AND (1-bitowe iloczyny) oraz siatkę półsumatorów sumujących wiersze częściowe w układ kombinacyjny.
- **Optymalizacja kompilatora (*Strength Reduction*)**: kompilatory zastępują kosztowne mnożenie przez stałe kombinacją przesunięć i dodawania (np. jednocyklową instrukcją `LEA` w architekturze x86).
