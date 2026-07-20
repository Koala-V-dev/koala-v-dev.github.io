# Potęga dwójki i zakresy wartości

Dlaczego smartfon ma $128$ GB pamięci, a nie równe $100$ GB? Dlaczego stare gry wyświetlały $256$ kolorów? Wszystko w informatyce kręci się wokół <strong>**potęgi dwójki**</strong>. Nie jest to kwestia estetyki, lecz bezpośrednia konsekwencja fizyki prądu i działania tranzystorów.

## 🏗️ Dlaczego komputery używają potęg dwójki

Każdy kolejny bit (przełącznik) <strong>*podwaja*</strong> liczbę kombinacji, które można zapisać. Daje to wykładniczy przyrost liczby dostępnych stanów.

| Bity | Liczba kombinacji (Wzór: $2^n$) | Zakres wartości (od zera) | Gdzie jest używany?                                              |
| :--- | :-----------------------------: | :-----------------------: | :--------------------------------------------------------------- |
| `1`  |               $2$               |        $0$ do $1$         | Wybór wartości logicznej: TAK lub NIE                            |
| `3`  |               $8$               |        $0$ do $7$         | Uprawnienia plików w systemach Linux                             |
| `4`  |              $16$               |        $0$ do $15$        | Cyfra szesnastkowa, zapis adresów MAC                            |
| `8`  |              $256$              |       $0$ do $255$        | <strong>**Standardowy bajt**</strong> (np. składowe kolorów RGB) |
| `10` |             $1024$              |       $0$ do $1023$       | Podstawa kilobajta ($1$ KB)                                      |

![Wykres wzrostu potęgi 2](/public/courses/binarne-fundamenty-it/Images/wykres-wzrostu-potegi-2.png)

## 🧠 Tablica potęg dwójki

Inżynier oprogramowania widząc liczbę $512$, rzadko myśli o niej jako o zwykłej wartości dziesiętnej. Widzi w niej przede wszystkim wartość $2^9$.

| Wynik potęgowania |  $2048$  |  $1024$  |  $512$  |  $256$  |  $128$  |  $64$   |  $32$   |  $16$   |   $8$   |   $4$   |   $2$   |   $1$   |
| :---------------- | :------: | :------: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: | :-----: |
| Potęga dwójki     | $2^{11}$ | $2^{10}$ | $2^{9}$ | $2^{8}$ | $2^{7}$ | $2^{6}$ | $2^{5}$ | $2^{4}$ | $2^{3}$ | $2^{2}$ | $2^{1}$ | $2^{0}$ |

### 🏗️ Maksymalna wartość: zależność $2^n - 1$

Maksymalna wartość, jaką można zapisać na określonej liczbie bitów, jest zawsze o $1$ mniejsza niż kolejna potęga dwójki. 
Gdy dysponujesz trzema bitami, masz do dyspozycji $2^3 = 8$ kombinacji. Ponieważ jednak liczenie zaczyna się od zera, największą zapisaną liczbą będzie **7** (`111` w systemie binarnym).

---

<data-gate>
  <data-quiz>
    <question>
Dysponujesz systemem 10-bitowym. Jaka jest największa liczba dziesiętna, którą możesz w nim zapisać?
    </question>
    <options>
      <option correct>1023</option>
      <option>1024</option>
      <option>1000</option>
      <option>511</option>
    </options>

<div data-hint="error">
  Skorzystaj z tabeli potęg oraz wzoru $2^n - 1$. Pamiętaj, że indeksowanie rozpoczyna się od zera.
</div>
  </data-quiz>
</data-gate>

## ⚙️ Metoda działania: jak przeliczyć liczbę dziesiętną na binarną?

Aby ręcznie przeliczyć liczbę dziesiętną na binarną (bez zgadywania), najwygodniej posłużyć się **metodą odejmowania wag** (największych mieszczących się potęg dwójki).

### Algorytm krok po kroku:
1. Znajdź w tabeli potęg dwójki największą wartość, która jest **mniejsza lub równa** Twojej liczbie dziesiętnej.
2. Ustaw bit na tej pozycji na `1`.
3. Odejmij tę potęgę od swojej liczby.
4. Spójrz na pozostałą resztę. Przejdź do kolejnej niższej pozycji bitowej:
   - Jeśli aktualna potęga dwójki **mieści się** w reszcie, ustaw bit na `1` i odejmij tę potęgę od reszty.
   - Jeśli aktualna potęga dwójki **nie mieści się** w reszcie, ustaw bit na `0` i przejdź do kolejnej pozycji po prawej.
5. Powtarzaj te kroki, aż dojdziesz do pozycji $2^0$ (waga 1).

### 📖 Przykład: przeliczamy liczbę $45$ na zapis binarny
Budujemy tabelę dla 6 bitów (wagi od lewej: $32, 16, 8, 4, 2, 1$):
* Nasza liczba to $45$. Największa potęga dwójki mieszcząca się w $45$ to $32$.  
  Ustawiamy pozycję dla wagi $32$ na _**`1`**_. Zostaje nam reszta: $45 - 32 = 13$.
* Kolejna waga to $16$. Czy $16$ mieści się w pozostałej reszcie $13$? **_Nie_**.  
  Ustawiamy pozycję dla wagi $16$ na _**`0`**_. Reszta bez zmian: $13$.
* Kolejna waga to $8$. Czy $8$ mieści się w $13$? **Tak**.  
  Ustawiamy pozycję dla wagi $8$ na _**`1`**_. Nowa reszta: $13 - 8 = 5$.
* Kolejna waga to $4$. Czy $4$ mieści się w $5$? **Tak**.  
  Ustawiamy pozycję dla wagi $4$ na _**`1`**_. Nowa reszta: $5 - 4 = 1$.
* Kolejna waga to $2$. Czy $2$ mieści się w $1$? **_Nie_**.  
  Ustawiamy pozycję dla wagi $2$ na _**`0`**_. Reszta bez zmian: $1$.
* Ostatnia waga to $1$. Czy $1$ mieści się w $1$? **Tak**.  
  Ustawiamy pozycję dla wagi $1$ na _**`1`**_. Koniec działania (reszta wynosi 0).

**Otrzymany wynik:**
* `101101` binarnie ($32 + 8 + 4 + 1 = 45$).

---

## 🔎 Budowanie zakresów wartości

Przeanalizuj wagi poszczególnych pozycji. Ustaw bity na $1$ na właściwych miejscach, aby uzyskać zadaną wartość dziesiętną.
Spróbuj zbudować liczbę $85$ (korzystając z wag: $64, 32, 16, 8, 4, 2, 1$):

<data-gate>
  <data-number-system target="85" base="2" digits="7">

> [!TIP]
> $64 + 16 + 4 + 1 = 85$. W systemie binarnym (na 7 bitach) otrzymasz wartość `1010101`. Czy dostrzegasz ten naprzemienny wzór?

  </data-number-system>
</data-gate>

---

Kolejne zadanie: spróbuj zbudować wartość $255$. Co możesz zaobserwować po włączeniu wszystkich pozycji?

<data-gate>
  <data-number-system target="255" base="2" digits="8">

> [!TIP]
> Gdy wszystkie przełączniki są włączone, osiągasz limit dla 8 bitów (czyli 1 bajta). Zapisanie kolejnej wartości ($256$) wymagałaby już dziewiątego bitu.

  </data-number-system>
</data-gate>

---

## 🧪 Trening: wyzwanie sześciu bram

Czas na samodzielny trening. Spróbuj poprawnie ustawić wartości dla kolejnych sześciu bram:

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Pierwsza brama pokonana, zostało jeszcze pięć. 🦾
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Druga brama pokonana, zostały jeszcze cztery. 🦾
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Trzecia brama pokonana, zostały jeszcze trzy. 🦾
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Czwarta brama pokonana, zostały jeszcze dwie. 🦾
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Piąta brama pokonana, została jeszcze jedna. 🦾
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Ostatnia brama pokonana! Kolejna lekcja stoi otworem. 🦾
  </data-number-system>
</data-gate>

> [!NOTE]
> Po odświeżeniu strony wartości w bramach mogą zostać wylosowane ponownie.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Każdy dodatkowy bit podwaja przestrzeń możliwych wartości (wzrost wykładniczy).
- Maksymalna wartość dla $n$ bitów wynosi $2^n - 1$, ponieważ liczenie w systemach komputerowych zawsze rozpoczyna się od zera.
- Jeden standardowy bajt ($8$ bitów) pozwala na zapisanie $256$ wartości: od $0$ do $255$.

