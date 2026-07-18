# Logarytm — pogoń za wykładnikiem

### 🏎️ Rozgrzewka: Co tu pasuje?
Matematyka to gra w uzupełnianie brakujących elementów. Spójrz na poniższe równanie i spróbuj odgadnąć liczbę pod znakiem zapytania:

$$2^? = 8$$

<data-gate>
<data-quiz>
  <question>Jaka liczba powinna znaleźć się w miejscu pytajnika?</question>
  <options>
    <option>4 (bo $2 \cdot 4 = 8$)</option>
    <option correct>3 (bo $2 \cdot 2 \cdot 2 = 8$)</option>
    <option>16 (bo $2^4 = 16$)</option>
  </options>
  <div data-hint="error">Uważaj! Potęgowanie to nie mnożenie. Szukamy liczby dwójek, które po pomnożeniu przez siebie dadzą 8.</div>
  <div data-hint="success">Bingo! $2^3 = 8$. Właśnie obliczyłeś swój pierwszy logarytm w pamięci, nawet o tym nie wiedząc.</div>
</data-quiz>
</data-gate>

---

## 🔍 Czym właściwie jest logarytm?

Do tej pory znałeś dwie operacje "odwracające" potęgowanie. Jeśli mamy bazę, wykładnik i wynik:

$$\text{Podstawa}^{\text{Wykładnik}} = \text{Wynik}$$
$$2^3 = 8$$

To możemy zapytać o dwie różne rzeczy:

1. **O Wynik:** $2^3 = ?$ (To jest **potęgowanie**) $\to 8$
2. **O Podstawę:** $?^3 = 8$ (To jest **pierwiastkowanie**) $\to \sqrt[3]{8} = 2$
3. **O Wykładnik:** $2^{?} = 8$ (To jest właśnie **LOGARYTMOWANIE!**)

Logarytm to po prostu **pytanie o wykładnik**. Zamiast pisać $2^? = 8$, matematycy piszą:

$$\log_{2}{8} = 3$$

Co czytamy jako: *"Logarytm przy podstawie 2 z liczby 8 wynosi 3"*.

> [!IMPORTANT]
> Logarytm odpowiada na pytanie: **"Do jakiej potęgi muszę podnieść podstawę, aby otrzymać wynik?"**

---

## 🛠️ Warsztat: Twoje pierwsze logarytmy

Spróbuj obliczyć poniższe przykłady. Pamiętaj: szukasz potęgi!

<data-gate>
<data-math-worksheet difficulty="easy">
    <item question="\log_{3}{9}" answer="2" hint="3 do której potęgi daje 9?" />
    <item question="\log_{5}{125}" answer="3" hint="5 \cdot 5 = 25, a 25 \cdot 5 = ?" />
    <item question="\log_{10}{1000}" answer="3" hint="Ile zer ma tysiąc?" />
    <item question="\log_{2}{16}" answer="4" hint="2 \cdot 2 \cdot 2 \cdot 2 = ?" />
</data-math-worksheet>
</data-gate>

---

## ⚠️ Ograniczenia: Czy wszystko da się zalogarytmować?

Logarytmowanie, podobnie jak dzielenie przez zero, ma swoje zasady bezpieczeństwa. Spójrz na definicję: $\log_{a}{b} = c$.

1. **Podstawa $a$ musi być dodatnia ($a > 0$) i różna od $1$ ($a \neq 1$).** 
   - Dlaczego nie 1? Bo $1$ do dowolnej potęgi to zawsze $1$. Nie dałoby się uzyskać innego wyniku.
2. **Liczba logarytmowana $b$ musi być dodatnia ($b > 0$).**
   - Nie da się podnieść dodatniej liczby do żadnej potęgi tak, aby otrzymać liczbę ujemną lub zero.

---

## 🏆 Wyzwanie: Logarytmy "z haczykiem"

Czy potrafisz wyjść poza proste liczby całkowite? Pamiętaj o zasadach potęgowania, które poznałeś w Module 0!

<data-gate>
<data-math-worksheet difficulty="medium">
    <item question="\log_{2}{1}" answer="0" hint="Dowolna liczba (oprócz 0) do potęgi 0 daje...?" />
    <item question="\log_{7}{7}" answer="1" hint="Do której potęgi podnieść 7, żeby zostało 7?" />
    <item question="\log_{4}{2}" answer="0.5" hint="Pierwiastek z 4 to 2. Jaki wykładnik odpowiada pierwiastkowi?" />
    <item question="\log_{2}{0.5}" answer="-1" hint="Ułamek to potęga ujemna." />
</data-math-worksheet>
</data-gate>

---

## 🔗 Pomost do IT
W informatyce logarytm pojawia się wszędzie tam, gdzie **dzielimy problem na pół**. 
- Jeśli masz listę 1024 elementów i szukasz czegoś metodą binarną (dzieląc na pół), to znajdziesz to w maksymalnie 10 krokach. 
- Dlaczego? Bo $\log_{2}{1024} = 10$. 

Złożoność obliczeniowa $O(\log n)$ to "Święty Graal" wydajności algorytmów. Ale o tym dowiesz się więcej w kursie **Logika i Algorytmy**.
