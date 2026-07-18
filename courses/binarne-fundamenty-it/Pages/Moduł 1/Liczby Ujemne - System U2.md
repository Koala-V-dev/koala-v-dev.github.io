# 🌑 Liczby Ujemne: System U2

W poprzedniej lekcji opanowałeś cztery operacje arytmetyki binarnej — dodawanie, odejmowanie, mnożenie i dzielenie. Ale cała ta arytmetyka działała wyłącznie na **liczbach dodatnich**. Co jeśli wynik odejmowania jest ujemny? Co jeśli chcesz zapisać temperaturę $-15°C$?

Potrzebujemy sposobu, by w świecie samych $0$ i $1$ zakodować **minus**. Rozwiązaniem jest **System U2 (Uzupełnienie do Dwóch)**.

---

## 🎯 Koncepcja "Wagi Znaku"
Umówiono się, że pierwszy bit (najbardziej po lewej) ma **wagę ujemną**. Pozostałe bity są dalej dodatnie.

**Analiza 8-bitowa:**
Wartość bitu na ósmej pozycji wynosi **$-128$**.

Aby zapisać liczbę **$-96$**, musimy połączyć ujemną wagę początku z dodatnimi wagami pozostałych bitów:
$$-128 + 32 = -96$$

| Bit (Waga) | -128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Wartość** | **1** | 0 | **1** | 0 | 0 | 0 | 0 | 0 |

**Zapis binarnie:** `1010 0000`

---

### Zakresy w U2

Dzięki mechanizmowi wag, nasze 8-bitowe pudełko może teraz przechowywać liczby od $-128$ do $+127$:

| Typ | Zakres 8-bitowy | Zakres 16-bitowy |
| :--- | :---: | :---: |
| **UNSIGNED** (bez znaku) | $0$ do $255$ | $0$ do $65535$ |
| **SIGNED / U2** (ze znakiem) | $-128$ do $+127$ | $-32768$ do $+32767$ |

> [!IMPORTANT]
> To te same bity, ta sama pamięć! Jedyna różnica to **sposób interpretacji**. Ciąg `1111 1111` to $255$ w trybie UNSIGNED, ale $-1$ w trybie U2.

---

## 🔧 Jak szybko uzyskać liczbę ujemną? (Metoda Invert + 1)
Choć mechanizm wag (opisany wyżej) najlepiej tłumaczy *dlaczego* U2 działa, w praktyce najczęściej stosuje się szybki algorytm zamiany liczby dodatniej na ujemną:

1. **Zapisz liczbę dodatnią** (np. $5$ to `0000 0101`).
2. **Odwróć wszystkie bity** ($0 \to 1, 1 \to 0$): `1111 1010`.
3. **Dodaj 1**: `1111 1011` $\gets$ To jest $-5$ w systemie U2.

**Sprawdzenie wag:** $-128 + 64 + 32 + 16 + 8 + 0 + 2 + 1 = -5$ ✅

> [!TIP]
> Ta metoda działa w obie strony! Aby uzyskać liczbę dodatnią z ujemnej, zastosujesz ten sam algorytm: Invert + 1.

---

## 🤯 Arytmetyka w U2 — Magia Pudełka

Najpiękniejsza właściwość U2: **dodawanie i odejmowanie działają identycznie** jak w trybie UNSIGNED! Procesor nie musi wiedzieć, czy liczby są ze znakiem czy bez — bity same się „układają".

**Przykład: $5 + (-3) = 2$**

| liczba | zapis $8$-bitowy |
| :--- | :--- |
| $5$ | `0000 0101` |
| $-3$ | `1111 1101` |
| Suma | *`1`* `0000 0010` |

Nadmiarowy bit (dziewiąty) wypada poza pudełko. Zostaje `0000 0010` = $2$. Bingo! 🎯

---

## ⚠️ Najczęstsze błędy (The "Oops" Zone)

Podczas pracy z bitami łatwo o pomyłkę. Oto na co musisz uważać:
*   **Ignorowanie Przepełnienia (Overflow)**: Nadmiarowy bit (dziewiąty) często wypada poza pudełko i w U2 jest to normalne. Prawdziwy błąd (**Overflow**) następuje wtedy, gdy dodasz dwie liczby dodatnie, a wynik wyjdzie ujemny (lub odwrotnie), bo 'przebiłeś' wagę znaku.
*   **Mylenie U2 z "Bitem Znaku"**: System U2 to nie tylko "1 na początku". To system, w którym pierwszy bit ma ujemną wagę. Nie wystarczy zmienić go na 1, by uzyskać liczbę ujemną (stosuj metodę *Invert + 1*).
*   **Dopisywanie zer przy mnożeniu**: Pamiętaj, że dopisujesz tyle zer, ile wynosi **indeks pozycji**, a nie numer porządkowy bita.

---

## 🕹️ Symulator Arytmetyki Binarnej (Tryb U2)

Poniżej masz interaktywny symulator z **włączonym trybem U2**. Przełącz toggle, aby zobaczyć jak te same bity zmieniają swoją interpretację:

<data-binary-arithmetic digits="16" base="2" u2="true"></data-binary-arithmetic>

---

## 🔒 Test: Czy rozumiesz U2?

<data-gate>
  <data-quiz>
    <question>
Jaka jest wartość dziesiętna ciągu `1111 1111` w 8-bitowym systemie U2?
    </question>
    <options>
      <option correct>-1</option>
      <option>255</option>
      <option>-128</option>
      <option>127</option>
    </options>
    <div data-hint="error">
      Przypomnij sobie mechanizm wag U2: najbardziej lewy bit ma wynik wagi **ujemny** ($-128$).  
      Pozostałe są dodatnie, a ich sumowanie z $-128$ da ci mniejszą liczbę ujemną.
    </div>
    <div data-hint="success">
      Dokładnie! Wszystkie bity zapalone w U2 dają $-1$, nie $255$. To jeden z najważniejszych faktów do zapamiętania. 🏆
    </div>
  </data-quiz>
</data-gate>

---

<data-gate>
  <data-quiz>
    <question>
Ciąg bitów `1111 1100` w 8-bitowym systemie U2 reprezentuje liczbę:
    </question>
    <options>
      <option>252</option>
      <option correct>-4</option>
      <option>-128</option>
      <option>124</option>
    </options>
    <div data-hint="error">
      Użyj mechanizmu wag: najbardziej lewy bit ma wartość wagi $-128$.  
      Zsumuj wagi zapalonych bitów i pamiętaj że to U2, NIE unsigned!
    </div>
    <div data-hint="success">
      Mistrz U2! Szybka metoda: odwróć bity → `0000 0011` = $3$, dodaj $1$ → $4$, dodaj minus → $-4$. 🎓
    </div>
  </data-quiz>
</data-gate>

---
