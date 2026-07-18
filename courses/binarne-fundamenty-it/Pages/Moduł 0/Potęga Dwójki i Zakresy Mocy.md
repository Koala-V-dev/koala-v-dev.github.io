# Potęga Dwójki i Zakresy Mocy

Dlaczego Twój smartfon ma $128$ GB pamięci, a nie równe $100$ GB? Dlaczego stare gry miały $256$ kolorów? Wszystko w informatyce kręci się wokół **Potęgi Dwójki**. To nie jest estetyczny wybór – to wynika z fizyki prądu.

## ⚡ Gloryfikacja Dwójki

Każdy dołożony bit (przełącznik) **podwaja** ilość kombinacji, które możesz zapisać. To jest wykładniczy wzrost mocy.

| Bity | Ilość możliwości (od $0$ do ... Wzór $2^n$) | Gdzie używany? |
| :--- | :---: | :--- |
| `1` |  $0$ - $1$ | Wybór wartości logicznej (Boolean - wartość boolowska): <br> TAK / NIE (Prawda / Fałsz)|
| `3` | $0$ - $7$ | Uprawnienia plików w systemach GNU/Linux |
| `4` | $0$ - $15$ | Jedna cyfra systemu HEX - zapis adresów MAC i kolorów |
| `8` | $0$ - $255$ | **Standardowy BAJT** (kolory <span style="color: red">R</span>, <span style="color: green">G</span>, <span style="color: blue">B</span>) |
| `10` | $0$ - $1023$ | Podstawa KILO-bajta |

## 📐 Tablica Mocy (Musisz to znać)

Inżynier IT widząc liczbę $512$, nie myśli o niej jako o "pięciuset dwunastu". Widzi w niej $2^9$.


### 🦸 <em>Tabela mocy:</em>

|Wynik potęgowania| $2048$ |  $1024$ | $512$ | $256$ | $128$ | $64$ | $32$ | $16$ | $8$ | $4$ | $2$ | $1$ |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Potega dwójki| $2^{11}$ | $2^{10}$ | $2^{9}$ | $2^{8}$ | $2^{7}$ | $2^{6}$ | $2^{5}$ | $2^{4}$ | $2^{3}$ | $2^{2}$ | $2^{1}$ | $2^{0}$ |


## 🧠 Zależność 2ⁿ - 1

Zauważyłeś, że maksymalna liczba, jaką możesz zapisać, jest zawsze o $1$ mniejsza niż kolejna potęga?
Jeśli masz 3 bity, możesz zapisać $2^3 = 8$ kombinacji. Ale ponieważ zaczynamy od zera, Twoją największą liczbą jest **7** (`111` w binarnym).  

---

<data-gate>
  <data-quiz>
    <question>
Masz system 10-bitowy. Jaka jest NAJWIĘKSZA liczba dziesiętna, którą możesz w nim zapisać? <br>
    </question>
    <options>
      <option correct>1023</option>
      <option>1024</option>
      <option>1000</option>
      <option>511</option>
    </options>

<div data-hint="error">
  Podpowiedź: wykorzystaj tabelę mocy i zasadę $2^n-1$. Pamiętaj że liczymy od zera, a nie od jeden.
</div>
  </data-quiz>
</data-gate>

## 🕹️ Praktyka: Budowanie Zakresów

Spróbuj poczuć te wagi. Ustaw bit na $1$ tam, gdzie jest to potrzebne, aby uzyskać wynik dziesiętny.

Zbuduj liczbę **85** (używając wag: $64, 32, 16, 8, 4, 2, 1$):

<data-gate>
  <data-number-system target="85" base="2" digits="7">

> [!TIP]
> $64 + 16 + 4 + 1 = 85$. W binarnym to `0101 0101`. Czy widzisz ten rytmiczny wzór?

  </data-number-system>
</data-gate>

A teraz wyzwanie: Zbuduj **$255$**. Co zauważyłeś?

<data-gate>
  <data-number-system target="255" base="2" digits="8">

> [!TIP]
> Wszystkie przełączniki **ON**! To jest limit dla $8$ bitów ($1$ Bajta). Kolejna liczba ($256$) wymagałaby już $9$. bitów!

  </data-number-system>
</data-gate>


# Wyzwanie 6 bram 

---

> Super! 💪😎  
> To teraz samemu pokonaj kolejne $6$ bram:

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Pierwsza brama padła zostało jeszcze pięć! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Druga brama padła zostały jeszcze cztery! 🦾🐨
  </data-number-system>
</data-gate>


<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Trzecia brama padła zostały jeszcze trzy! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Czwarta brama padła zostały jeszcze dwie! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Piąta brama padła została jeszcze jedna! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Ostatnia brama padła! Odblokowałeś kolejną lekcję. 🦾🐨
  </data-number-system>
</data-gate>

---

PS. Jak odświeżysz stronę to te 6 bram może wylosować inne liczby. Powodzenia! 🦾🐨

---
