# Potęga dwójki i zakresy wartości

Dlaczego smartfon ma $128$ GB pamięci, a nie równe $100$ GB? Dlaczego paleta kolorów ma $256$ stopni? W cyfrowym świecie wszystko opiera się na **potędze dwójki**. Każdy kolejny bit dodany do rejestru podwaja liczbę dostępnych kombinacji ($2^N$).

![Wykres wzrostu potęgi 2](/public/courses/binarne-fundamenty-it/Images/wykres-wzrostu-potegi-2.png)

---

## 🏗️ Wzrost potęg dwójki

W informatyce na określonych szerokościach bitowych opiera się większość standardów sprzętowych i programistycznych:

| Bity ($n$) | Liczba kombinacji ($2^n$) | Zakres wartości (od zera) | Praktyczne zastosowanie                               |
| :--------: | :-----------------------: | :-----------------------: | :---------------------------------------------------- |
|    `1`     |            $2$            |        $0$ do $1$         | Wartość logiczna `bool` (`true` / `false`)            |
|    `3`     |            $8$            |        $0$ do $7$         | Uprawnienia plików Linux (`rwx`)                      |
|    `4`     |           $16$            |        $0$ do $15$        | Cyfra szesnastkowa, półbajt (*nibble*)                |
|    `8`     |           $256$           |       $0$ do $255$        | **Standardowy bajt** (`uint8_t`, składowa koloru RGB) |
|    `16`    |         $65\ 536$         |     $0$ do $65\ 535$      | Zakres portów sieciowych TCP/UDP (`uint16_t`)         |
|    `32`    |    $4\ 294\ 967\ 296$     | $0$ do $4\ 294\ 967\ 295$ | Przestrzeń adresowa IPv4 oraz pamięć RAM 32-bit       |

> [!NOTE]
> Ponieważ liczenie w komputerze zawsze rozpoczyna się od zera ($0$), maksymalna wartość liczbowa zapisana na $n$ bitach wynosi zawsze **_$2^n - 1$_**. Dla $3$ bitów jest to $7$ ($2^3 - 1$), a dla pełnego bajtu $8$-bitowego jest to $255$ ($2^8 - 1$).

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Skąd wynikała bariera 4 GB RAM w architekturze 32-bitowej?</span>
<span class="deep-dive-badge">ARCHITEKTURA PAMIĘCI</span>
</summary>
<div class="deep-dive-content">

<p>Płyta główna i procesor 32-bitowy posiadają dokładnie 32 fizyczne linie adresowe na szynie pamięci. Oznacza to, że procesor może wygenerować maksymalnie $2^{32}$ unikalnych kombinacji sygnałów:</p>

```cpp
// 32 bity wyznaczają maksymalny adres bajtu pamięci RAM:
uint32_t maxAdres = 0xFFFFFFFF; // 2^32 - 1 = 4 294 967 295 bajtów (dokładnie 4 GB)
```

<p>Nawet jeśli płyta główna posiadała fizycznie więcej gniazd na kości pamięci, magistrala 32-bitowa nie miała możliwości przesłania adresu powyżej wartości $4\text{ GB}$. W architekturze 64-bitowej wskaźnik w C++ (<code>void*</code>) zajmuje 8 bajtów, co rozszerza przestrzeń adresową do $2^{64}$ bajtów.</p>

<p>Liczba fizycznych ścieżek magistrali adresowej procesora definiuje maksymalny rozmiar pamięci operacyjnej, do której procesor ma bezpośredni dostęp.</p>

</div>
</details>

---

## ⚙️ Rozkład liczby na potęgi dwójki (metoda wag)

Aby przeliczyć liczbę dziesiętną na zapis binarny, sprawdzamy kolejne potęgi dwójki od największej do najmniejszej:
1. Jeśli potęga mieści się w bieżącej reszcie $\to$ wpisujemy bit `1` i odejmujemy tę potęgę od reszty.
2. Jeśli potęga się nie mieści $\to$ wpisujemy bit `0`, a reszta pozostaje bez zmian.

Przeanalizuj rozkład liczby $45_{10}$ na 6 bitach (wagi: $32, 16, 8, 4, 2, 1$):

<data-binary-process mode="weights" target="45" bits="6"></data-binary-process>

### 🔍 Kroki powyższego procesu:
1. **Waga $32$ ($2^5$)**: $45 \ge 32 \to$ bit = **`1`**, nowa reszta: $45 - 32 = \mathbf{13}$.
2. **Waga $16$ ($2^4$)**: $13 < 16 \to$ waga się nie mieści, bit = **`0`**, reszta bez zmian: $\mathbf{13}$.
3. **Waga $8$ ($2^3$)**: $13 \ge 8 \to$ bit = **`1`**, nowa reszta: $13 - 8 = \mathbf{5}$.
4. **Waga $4$ ($2^2$)**: $5 \ge 4 \to$ bit = **`1`**, nowa reszta: $5 - 4 = \mathbf{1}$.
5. **Waga $2$ ($2^1$)**: $1 < 2 \to$ waga się nie mieści, bit = **`0`**, reszta bez zmian: $\mathbf{1}$.
6. **Waga $1$ ($2^0$)**: $1 \ge 1 \to$ bit = **`1`**, nowa reszta: $1 - 1 = \mathbf{0}$.
* **Wynik**: _**$101101_2$**_ ($32 + 8 + 4 + 1 = 45$).

### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Mała liczba (19 na 5 bitach)</b><b>Duża liczba (178 na 8 bitach)</b><b>Sama potęga dwójki (64)</b></tabs>
<div>

Rozkład liczby $19_{10}$ na 5 bitach (wagi: $16, 8, 4, 2, 1$):
- $19 \ge 16 \to$ bit `1`, nowa reszta: $19 - 16 = 3$
- $3 < 8 \to$ bit `0`
- $3 < 4 \to$ bit `0`
- $3 \ge 2 \to$ bit `1`, nowa reszta: $3 - 2 = 1$
- $1 \ge 1 \to$ bit `1`, reszta: $0$
- Wynik: $\mathbf{10011_2}$ ($16 + 2 + 1 = 19$).

</div>
<div>

Rozkład liczby $178_{10}$ na 8 bitach (pełen bajt):
- Wagi: $128, 64, 32, 16, 8, 4, 2, 1$
- $178 \ge 128 \to$ bit `1` (reszta $50$)
- $50 < 64 \to$ bit `0`
- $50 \ge 32 \to$ bit `1` (reszta $18$)
- $18 \ge 16 \to$ bit `1` (reszta $2$)
- $2 < 8 \to$ bit `0`, $2 < 4 \to$ bit `0`
- $2 \ge 2 \to$ bit `1` (reszta $0$)
- $0 < 1 \to$ bit `0`
- Wynik: $\mathbf{10110010_2}$ ($128 + 32 + 16 + 2 = 178$).

</div>
<div>

Gdy rozkładamy liczbę będącą dokładną potęgą dwójki (np. $64_{10}$):
- Waga $64$ pokrywa całą wartość: $64 - 64 = 0$.
- Wszystkie mniejsze pozycje otrzymują zera.
- Wynik na 7 bitach: $\mathbf{1000000_2}$.
- Każda potęga dwójki ma w zapisie binarnym **dokładnie jedną jedynkę** i same zera po prawej stronie.

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Jednocyklowy test potęgi dwójki w C++ dla buforów kołowych</span>
<span class="deep-dive-badge">C++ & OPTYMALIZACJA</span>
</summary>
<div class="deep-dive-content">

W buforach kołowych (silniki gier, kolejki sieciowe) rozmiar bufora ustawia się zawsze na **potęgę dwójki** ($1024, 2048, 4096$).

Dzięki temu zamiast dodatkowego działania modulo (`%`), zawijanie indeksu wykonuje się w jednym cyklu zegara: `indeks & (rozmiar - 1)`.

Warunkiem działania tego triku jest rozmiar będący potęgą dwójki. W C++ sprawdza to jednolinijkowa funkcja:

```cpp
bool isPowerOfTwo(uint32_t size) {
    return (size > 0) && ((size & (size - 1)) == 0);
}
```

Zasada działania opiera się na tym, jak potęga dwójki układa się w bitach.

Każda potęga dwójki ma w zapisie binarnym **dokładnie jedną jedynkę**, a za nią same zera (np. liczba $8$ to `1000`).

Gdy odejmiemy od niej jeden, ta jedynka zeruje się, a wszystkie pozycje po prawej stają się jedynkami (liczba $7$ to `0111`).

Gdy przyłożymy do nich operację `size & (size - 1)` (bramka AND bit po bicie):

```text
  1 0 0 0   (8)
& 0 1 1 1   (7)
---------
  0 0 0 0   (wynik: 0)
```

Na każdej pozycji spotyka się `1 & 0` albo `0 & 1`. Bramka AND dla różnych bitów zawsze daje zero, więc cała wartość zostaje wyzerowana.

Operator `== 0` porównuje otrzymany wynik z zerem. Ponieważ `0 == 0`, lewa strona równa się prawej i funkcja zwraca **_prawdę_** (`true`).

Dla liczby, która nie jest potęgą dwójki, jedynki nie znikną całkowicie:

```text
  0 1 1 0   (6)
& 0 1 0 1   (5)
---------
  0 1 0 0   (wynik: 4)
```

Wynik to $4$, więc porównanie `4 == 0` daje **_fałsz_** (`false`).

Początkowy warunek `size > 0` zabezpiecza przed zerem: dla zera operacja dałaby wynik zero i fałszywie przeszła test, a zero nie jest potęgą dwójki.

[Obczaj ten artykuł „Check for Power of 2” na GeeksforGeeks](https://www.geeksforgeeks.org/dsa/program-to-find-whether-a-given-number-is-power-of-2/)

</div>
</details>

---

## 🔒 Weryfikacja: Potęgi dwójki i granice sprzętowe

<data-gate>
  <data-connection-matcher title="Potęgi Dwójki i Granice Sprzętowe">
    <item left="Pojemność $1$ bajta ($8$ bitów)" right="Zakres od $0$ do $255$ ($256$ stanów)"></item>
    <item left="Typ 16-bitowy (`uint16_t`)" right="Maksymalna wartość $65\ 535$ ($2^{16} - 1$)"></item>
    <item left="Rejestr 32-bitowy (IPv4 / RAM)" right="Dokładnie $4\ 294\ 967\ 296$ stanów ($2^{32}$)"></item>
    <item left="Maksymalna wartość na $N$ bitach" right="Zawsze $2^N - 1$ (wynika z indeksowania od $0$)"></item>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Trening: Budowanie wag i wartości w rejestrze

Ustaw bity na właściwych pozycjach, aby uzyskać zadaną wartość dziesiętną:

<data-gate>
  <data-number-system target="85" base="2" digits="7">

> [!TIP]
> $64 + 16 + 4 + 1 = 85$. W systemie binarnym na 7 bitach otrzymasz naprzemienny wzór: `1010101`.

  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system target="255" base="2" digits="8">

> [!TIP]
> Gdy wszystkie 8 bitów jest zapalonych, osiągasz limit $1$ bajta: $255$. Zapisanie kolejnej wartości ($256$) wymagałoby już 9 bitu.

  </data-number-system>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Każdy dodatkowy bit podwaja przestrzeń możliwych wartości ($2^N$).
- Maksymalna wartość dla $N$ bitów wynosi $2^N - 1$, ponieważ liczenie w architekturze komputerowej zawsze rozpoczyna się od zera.
- Jeden standardowy bajt ($8$ bitów) pozwala na zapisanie $256$ stanów: od $0$ do $255$.
- Rozkład liczby dziesiętnej na postać binarną polega na sukcesywnym odejmowaniu największych mieszczących się wag potęg dwójki.
