# Zbiory liczbowe i operacje arytmetyczne: Fundamenty Logiki

Zanim zaczniemy budować złożone struktury danych czy algorytmy, musimy zrozumieć fundament: czym właściwie jest liczba w systemie logicznym? To nie tylko cyfra na ekranie — to konkretna **idea**, którą musimy umieć zarządzać.

## 🛠️ Punkt Kontrolny: Idea vs Znak

<data-gate>
<data-quiz>
  <question>Masz przed sobą obrazek z pięcioma jabłkami. Czym w matematyce jest cyfra $5$?</question>
  <options>
    <option>Jedynym poprawnym znakiem graficznym dla tej ilości.</option>
    <option correct>Symbolem idei ilości, która istnieje niezależnie od zapisu.</option>
    <option>Wynikiem konkretnego równania.</option>
  </options>
  <div data-hint="error">Oddziel „interfejs” (znak) od „logiki” (znaczenia).</div>
  <div data-hint="success">Dokładnie. Symbol to tylko etykieta. Pamiętasz Kość z Ishango? Tam symbolem były nacięcia, a idea ilości była ta sama.</div>
</data-quiz>
</data-gate>

---

Większość z nas tabliczkę mnożenia zapamiętała na pamięć, jak wierszyk (np. $7 \cdot 8 = 56$).  
W tej lekcji zrobimy krok dalej. Zobaczysz, **skąd te wyniki się biorą** — żebyś nie musiał „wierzyć na słowo” i nie musiał powtarzać za klasykiem z internetu, że:  
[$6 \cdot 6$ to jest najgorsze — by BDOES](https://www.youtube.com/watch?v=mQaQiuIm--4). 😉

---

## 🏗️ Liczby Naturalne: Fundament Liczenia

To podstawowy zbiór, od którego wszystko się zaczyna. Służy do liczenia obiektów, które możemy wskazać palcem:

$$\mathbb{N} = \\{0, 1, 2, 3, 4, 5, \ldots\\}$$

> [!NOTE]
> Czy $0$ jest liczbą naturalną?  
> W matematyce szkolnej bywa różnie, ale w informatyce (i w tym kursie) przyjmujemy, że **TAK** ($0 \in \mathbb{N}$).  
> Zero to stan początkowy, pusty licznik — niezbędny w każdym systemie.
>
> *Ciekawostka językowa:* Niemcy nazywają ten zbiór *natürliche* **Zahlen**. Stąd oznaczenie $\mathbb{N}$.

---

## ⚙️ Dodawanie: Akumulacja Stanów

Dodawanie to najbardziej pierwotna operacja łączenia ilości. Możemy je opisać trzema żelaznymi zasadami:

1. _**PRZEMIENNOŚĆ**_: $a + b = b + a$  
2. _**ŁĄCZNOŚĆ**_: $(a + b) + c = a + (b + c)$  
3. _**ELEMENT NEUTRALNY**_: $a + 0 = a$  

Zero działa jak *bypass* — nie zmienia stanu sumy.

## 🔗 Połącz Pary: Własności Dodawania

<data-gate>
<data-connection-matcher>
    <item left="$12 + 4 = 4 + 12$" right="PRZEMIENNOŚĆ"></item>
    <item left="$(2+3)+8 = 2+(3+8)$" right="ŁĄCZNOŚĆ"></item>
    <item left="$99 + 0 = 99$" right="ELEMENT NEUTRALNY"></item>
</data-connection-matcher>
</data-gate>

---

## ⚖️ Odejmowanie: Inwersja i Rozszerzenie Systemu

Odejmowanie to operacja odwrotna (*inwersja*) do dodawania:

$$a - b = x \quad \iff \quad x + b = a$$

Szukamy liczby, która „naprawi” różnicę.

Problem pojawia się, gdy chcemy odjąć więcej, niż mamy (np. $3 - 7$).  
W zbiorze liczb naturalnych ($\mathbb{N}$) takie działanie _**nie ma wyniku**_.

Żeby system się nie „wywalił”, musimy go rozszerzyć o stany ujemne.  
Formalnie oznacza to przejście do zbioru **liczb całkowitych**:

$$\mathbb{N} \subset \mathbb{Z}$$

> Powyższy zapis oznacza że zbiór liczb naturalnych zawiera się w zbiorze liczb całkowitych.

<details>
<summary>Zbiory liczb z niemieckiego</summary>

- $\mathbb{N}$ – *natürliche* **Zahlen** (liczby naturalne): $\\{0, 1, 2, 3, \ldots\\}$
- $\mathbb{Z}$ – *ganze* **Zahlen** (liczby całkowite): $\\{\ldots, -3, -2, -1, 0, 1, 2, 3, \ldots\\}$
- $\mathbb{Q}$ – *rationale* **Zahlen** (liczby wymierne): $?$
- $\mathbb{R}$ – *reelle* **Zahlen** (liczby rzeczywiste): $?$
- $\mathbb{C}$ – *komplexe* **Zahlen** (liczby zespolone): $?$

Reszty dowiesz się, gdy będziemy musieli ich użyć 😉.

</details>

---

## 🛠️ Punkt Kontrolny: Zbiory Liczbowe

Jeżeli na koncie masz $100$ zł, a płacisz $150$ zł, to „brakuje” Ci $50$ zł.

<data-gate>
<data-quiz>
  <question>Rozwiązanie problemu $100 - 150 = ?$ w spójnym systemie logicznym wymaga:</question>
  <options>
    <option>Zamiany liczb miejscami, żeby „wyszło dodatnie”.</option>
    <option correct>Rozszerzenia zbioru liczbowego o liczby ujemne (dług).</option>
    <option>Wprowadzenia jednorazowej poprawki dla tego konkretnego zakupu.</option>
  </options>
  <div data-hint="error">Inżynieria nie lubi wyjątków. Chcemy jednej, uniwersalnej zasady dla każdego odejmowania.</div>
  <div data-hint="success">Właśnie tak. Przechodzimy do zbioru $\mathbb{Z}$, gdzie wynik $-50$ jest w pełni poprawny.</div>
</data-quiz>
</data-gate>

---

## ⚙️ Mnożenie: Skrót Operacyjny (Skalowanie)

Mnożenie to nic innego jak **zoptymalizowane dodawanie**.  
Zamiast pisać $4 + 4 + 4$, piszemy:

$$3 \cdot 4$$

Mnożenie dziedziczy cechy dodawania, ale ma inny element neutralny:

| Właściwość | Dodawanie | Mnożenie |
| :--- | :---: | :---: |
| _**PRZEMIENNOŚĆ**_ | $a + b = b + a$ | $a \cdot b = b \cdot a$ |
| _**ŁĄCZNOŚĆ**_ | $(a+b)+c = a+(b+c)$ | $(a \cdot b) \cdot c = a \cdot (b \cdot c)$ |
| _**ELEMENT NEUTRALNY**_ | $a + \textcolor{#ff0003}{0} = a$ | $a \cdot \textcolor{#ff0003}{1} = a$ |

## 🛠️ Punkt Kontrolny: Element Neutralny

<data-gate>
<data-quiz>
  <question>Co się stanie, jeśli pomnożysz dowolną wartość przez $0$ (element neutralny dodawania)?</question>
  <options>
    <option>Wartość nie zmieni się (zostanie taka sama).</option>
    <option correct>Wartość zostanie wyzerowana (anihilacja).</option>
    <option>System zgłosi błąd krytyczny.</option>
  </options>
  <div data-hint="error">Zero jest neutralne przy dodawaniu, ale nie przy mnożeniu.</div>
  <div data-hint="success">Poprawnie. Mnożenie przez $0$ oznacza „dodaj tę wartość zero razy”. Wynik to pustka.</div>
</data-quiz>
</data-gate>

---

## 🔬 Rozdzielność: Synchronizacja Operacji

To jedno z najważniejszych praw w inżynierii matematycznej.  
Pozwala **rozbić duży problem na mniejsze, łatwiejsze do policzenia segmenty** — dokładnie tak, jak robi to każdy dobry algorytm.

$$a \cdot (b + c) = a \cdot b + a \cdot c$$

Przykład z życia:  
Chcesz kupić 3 zestawy, w których jest kawa (2 zł) i ciastko (5 zł).

Możesz policzyć cenę zestawu:

- $3 \cdot 7 = 21$

Albo rozbić problem na mniejsze części:

- $3 \cdot 2 + 3 \cdot 5 = 6 + 15 = 21$

Wynik jest identyczny — ale druga metoda pokazuje **dlaczego** działa.  
To właśnie rozdzielność: matematyczny odpowiednik „divide and conquer”.


## 🛠️ Punkt Kontrolny: Rozdzielność Mnożenia

<data-gate>
<data-quiz>
  <question>Ile wynosi $5 \cdot 0$ i dlaczego?</question>
  <options>
    <option>5 — bo mnożenie nie powinno nic zmieniać.</option>
    <option correct>0 — bo mnożenie to wielokrotne dodawanie.</option>
    <option>0 — bo tak kazała pani w szkole.</option>
  </options>
  <div data-hint="error">Wróć do definicji mnożenia jako skrótu dodawania. 🫤</div>
  <div data-hint="success">Dokładnie. Definicja mnożenia nie pozostawia złudzeń.</div>
</data-quiz>
</data-gate>

---

## ⚖️ Dzielenie: Dekonstrukcja Mnożenia

Dzielenie to proces „odkręcania” mnożenia:

$$12 \div 3 = x \quad \iff \quad x \cdot 3 = 12$$

### ⚠️ Krytyczny Błąd Systemu: Dzielenie przez Zero

W arytmetyce klasycznej dzielenie przez zero jest **operacją niedozwoloną**.  
Nie dlatego, że „tak po prostu jest”, ale dlatego, że **psuje to logikę systemu**:

- **$5 \div 0$** — nie istnieje żadna liczba, która po pomnożeniu przez $0$ dałaby $5$ (brak rozwiązania).  
- **$0 \div 0$** — każda liczba pomnożona przez $0$ daje $0$, więc istnieje nieskończenie wiele „kandydatów” (brak jednoznaczności).

> [!WARNING]
> Dzielenie przez zero w kodzie zazwyczaj kończy się błędem `DivisionByZeroException`.  
> Zawsze sprawdzaj mianownik!

---

## 🔗 Połącz Pary: Synteza Logiczna

<data-gate>
<data-connection-matcher title="Dopasuj operacje do ich mechanizmów odwrotnych i elementów neutralnych">
    <item left="Dodawanie (+)" right="Odejmowanie (−)"></item>
    <item left="Mnożenie (·)" right="Dzielenie (÷)"></item>
    <item left="Element neutralny dodawania" right="Zero (0)"></item>
    <item left="Element neutralny mnożenia" right="Jedynka (1)"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- liczby to idee, a symbole to tylko interfejs,  
- $\mathbb{N}$ i $\mathbb{Z}$ to podstawowe zbiory liczbowe,  
- dodawanie ma trzy kluczowe własności,  
- odejmowanie wymaga rozszerzenia zbioru liczb,  
- mnożenie to wielokrotne dodawanie,  
- rozdzielność upraszcza obliczenia,  
- dzielenie jest odwrotnością mnożenia,  
- dzielenie przez zero jest nielogiczne i niedozwolone.

---

Znasz już fundamenty operacji w zbiorach $\mathbb{N}$ i $\mathbb{Z}$.  
Kolejnym krokiem będzie nauka optymalizacji — poznamy **NWW** i **NWD**, które przygotują nas do wejścia w świat ułamków i liczb wymiernych ($\mathbb{Q}$). 🚀