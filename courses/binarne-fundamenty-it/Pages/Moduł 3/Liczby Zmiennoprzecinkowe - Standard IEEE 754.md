# Liczby Zmiennoprzecinkowe: Standard IEEE 754

Do tej pory poznawałeś liczby całkowite: $0, 1, 2, -5$. W codziennej pracy z komputerem potrzebujemy jednak ułamków (np. $3{,}14$ albo $0{,}001$) oraz liczb o ogromnych rozmiarach.
- $\mathbb{N}$ - *natürliche* **Zahlen** (liczby naturalne): $\{ 0, 1, 2, 3, \ldots \}$
- $\mathbb{Z}$ - *ganze* **Zahlen** (liczby całkowite): $\{ \ldots, -3, -2, -1, 0, 1, 2, 3, \ldots \}$
- $\mathbb{Q}$ - *rationale* **Zahlen** (liczby wymierne): $\{ \frac{a}{b} \text{ takich, że } a, b \in \mathbb{Z} \text{ i } b \neq 0 \}$

---

## 🔬 Jak komputer dzieli bity w liczbie ułamkowej (32-bit float)

Ponieważ w krzemowej pamięci procesora nie ma fizycznego przecinka, inżynierowie stworzyli standard **IEEE 754**, który pozwala zapisać liczbę ułamkową za pomocą standardowych bitów.

W formacie 32-bitowym (**`float`**) komputer dzieli pamięć na trzy niezależne strefy:

| Strefa              | Liczba bitów | Za co odpowiada?                                                               |
| :------------------ | :----------: | :----------------------------------------------------------------------------- |
| **Znak ($S$)**      |  **1 bit**   | Określa znak: **_0_** to liczba dodatnia ($+$), a **1** to liczba ujemna ($-$) |
| **Wykładnik ($E$)** | **8 bitów**  | Rząd wielkości: określa, gdzie ma znaleźć się przecinek (jak duża jest liczba) |
| **Mantysa ($M$)**   | **23 bity**  | Precyzja: przechowuje same cyfry liczby ułamkowej                              |

Zamiast trzymać przecinek w sztywnym miejscu, komputer przesuwa go zależnie od wartości wykładnika. Stąd wzięła się nazwa: **liczba zmiennoprzecinkowa** (*floating-point*).

### 💡 Czym właściwie jest mantysa?

Pomyśl o znanej ze szkoły notacji naukowej. Gdy zapisujesz wielką liczbę $123\ 000$ w postaci:

$$1{,}23 \cdot 10^5$$

Rozbijasz ją na dwa niezależne elementy:
- **Mantysa ($1{,}23$)**: przechowuje same znaczące cyfry (precyzję liczby: jedynkę, dwójkę i trójkę).
- **Wykładnik ($10^5$)**: określa rząd wielkości, czyli o ile pozycji przesunąć przecinek.

W komputerze zachodzi dokładnie ten sam proces, tylko z potęgami dwójki ($2^E$). Mantysa przechowuje same bity wartości, a wykładnik wskazuje procesorowi, w którym miejscu postawić przecinek.

---

## 🧮 Float czy Double: Dwa standardy precyzji

W programowaniu spotkasz dwa główne typy liczb zmiennoprzecinkowych:

| Nazwa typu                      |  Szerokość w pamięci   | Dokładność dziesiętna | Zastosowanie                                     |
| :------------------------------ | :--------------------: | :-------------------: | :----------------------------------------------- |
| **float** (pojedyncza precyzja) | **32 bity** (4 bajty)  |    ok. **7 cyfr**     | Grafika 3D, gry komputerowe, uczenie maszynowe   |
| **double** (podwójna precyzja)  | **64 bity** (8 bajtów) |  ok. **15-17 cyfr**   | Domyślny typ w programowaniu, obliczenia naukowe |

---

## ⚠️ Trzy wartości specjalne w pamięci procesora

Standard IEEE 754 rezerwuje specjalne kombinacje bitów na sytuacje awaryjne:

1. **Znakowane zero ($+0$ oraz $-0$)**:
   Wykładnik i mantysa są zerami. Znak informuje, z której strony zbliżaliśmy się do zera.
2. **Nieskończoność ($+\infty$ oraz $-\infty$)**:
   Pojawia się na przykład wtedy, gdy program spróbuje podzielić liczbę przez zero ($1{,}0 / 0{,}0$).
3. **NaN (Not a Number - Nie jest liczbą)**:
   Pojawia się w wyniku operacji niedozwolonych matematycznie, na przykład przy dzieleniu zera przez zero ($0{,}0 / 0{,}0$) lub pierwiastkowaniu liczby ujemnej.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Obciążenie wykładnika (bias 127) i ukryta jedynka w mantysie</span>
<span class="deep-dive-badge">MATEMATYKA IEEE 754</span>
</summary>
<div class="deep-dive-content">

Dla inżyniera projektującego koprocesory arytmetyczne (FPU) kluczowe są dwa mechanizmy standardu IEEE 754:

#### 1. Ukryta jedynka (Implicit bit)
Każda liczba znormalizowana ma postać $1{,}xxxx_2 \times 2^E$. Ponieważ pierwszą cyfrą przed przecinkiem jest zawsze jedynka, nie marnuje się na nią miejsca w pamięci RAM. W 23 bitach pola mantysy zapisuje się wyłącznie bity po przecinku, dzięki czemu efektywna precyzja wynosi 24 bity.

#### 2. Obciążenie cechy (Bias = 127)
Wykładnik musi obsługiwać zarówno potęgi dodatnie (np. $2^{+10}$), jak i ujemne (np. $2^{-10}$). Zamiast komplikować układ dodatkowym kodem U2, standard dodaje do wykładnika stałą wartość 127:
$$\text{Zapisany wykładnik} = \text{Rzeczywista potęga} + 127$$
Dzięki temu wykładnik jest zawsze liczbą nieujemną, co pozwala procesorowi porównywać rzędy wielkości liczb zmiennoprzecinkowych za pomocą zwykłych, szybkich komparatorów liczb całkowitych.

#### 3. Dlaczego 0.1 + 0.2 nie daje idealnego 0.3?
Ułamek dziesiętny $0{,}1$ w systemie binarnym ma postać nieskończoną ($0{,}0001100110011\dots_2$). Ponieważ mantysa ma skończoną liczbę bitów, komputer musi uciąć ogon ułamka, co wywołuje mikroskopijny błąd zaokrąglenia na 17. miejscu po przecinku.

</div>
</details>

---

## 🔒 Weryfikacja: Standard IEEE 754

<data-gate>
  <data-connection-matcher title="Weryfikacja: Standard IEEE 754">
    <item left="Pole znaku (1 bit)" right="Stan 0 oznacza plus, stan 1 oznacza minus"></item>
    <item left="Format 32-bitowy (float)" right="Oferuje około 7 cyfr precyzji dziesiętnej"></item>
    <item left="Format 64-bitowy (double)" right="Oferuje około 15-17 cyfr precyzji dziesiętnej"></item>
    <item left="Wartość NaN (Not a Number)" right="Wynik operacji niedozwolonej (np. 0 podzielone przez 0)"></item>
    <item left="Przechowywanie cen w bankowości" right="Liczby całkowite w groszach lub centach"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Standard IEEE 754 dzieli 32 bity liczby float na trzy części: 1 bit znaku, 8 bitów wykładnika oraz 23 bity mantysy.
- Typ `float` (32 bity) zapewnia precyzję około 7 cyfr, a typ `double` (64 bity) około 16 cyfr dziesiętnych.
- Stany specjalne to znakowane zero ($\pm 0$), nieskończoność ($\pm\infty$) oraz **NaN** (wynik operacji niedozwolonej).
- Liczby zmiennoprzecinkowe są zapisem przybliżonym, dlatego w finansach zawsze stosuje się liczby całkowite.
