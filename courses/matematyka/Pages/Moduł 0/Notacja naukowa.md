# Notacja naukowa — Standaryzacja Skali i Normalizacja Danych

W inżynierii i naukach ścisłych operujemy na wartościach o ekstremalnej rozpiętości — od nanosekund w architekturze procesorów po eksabajty w globalnych bazach danych. Tradycyjny zapis dziesiętny z dziesiątkami zer jest nieefektywny i podatny na błędy ludzkie (tzw. *off-by-one errors*). 

Rozwiązaniem jest **notacja naukowa** — ustandaryzowany protokół zapisu, który oddziela precyzję liczby od jej skali.

---

## 🔭 Normalizacja Danych: Postać Standardowa

Zamiast operować na surowych zerach, każdą wartość sprowadzamy do znormalizowanej postaci:
**$$a \cdot 10^n$$**

Gdzie parametry wejściowe to:
- **Mantysa ($a$)** — precyzja liczby. Musi spełniać warunek: $1 \le a < 10$ (dokładnie jedna cyfra niezerowa przed przecinkiem).
- **Wykładnik ($n$)** — skala (rząd wielkości). Liczba całkowita określająca, o ile miejsc przesunięto punkt dziesiętny.

### 🧭 Bencharki skali (od makro do subatomu)

1. _**Prędkość światła ($c$)**_  
$$c = 299 \ 792 \ 458 \ \text{m/s} \approx 3 \cdot 10^{8}\ \text{m/s}$$  
*Skala:* makro, kosmiczna  
**Interpretacja:** to tempo, w jakim informacja może przemieszczać się w próżni. Jedna z największych liczb, jakie pojawiają się w fizyce klasycznej.

---

2. _**Czas cyklu CPU ($1 GHz$)**_  
$$t = 0.000000001\ \text{s} = 1 \cdot 10^{-9}\ \text{s}$$  
*Skala:* nano  
**Interpretacja:** jeden takt procesora $1 GHz$ trwa $1$ nanosekundę. To pokazuje, jak ekstremalnie szybkie są współczesne układy cyfrowe — $1$ miliard operacji na sekundę.

---

3. _**Masa elektronu ($m_e$)**_  
$$m_e = 0.00000000000000000000000000091 \ \text{kg} \approx 9.1 \cdot 10^{-31}\ \text{kg}$$  
*Skala:* subatomowa  
**Interpretacja:** jedna z najmniejszych liczb, jakie pojawiają się w fizyce. Elektron jest tak lekki, że jego masa jest praktycznie pomijalna w skali makro.


---

## ⚖️ Protokół Balansu: Przesunięcie Przecinka (Kommaverschiebung)

Notacja naukowa opiera się na **zasadzie zachowania wartości**. Każda zmiana mantysy musi zostać skompensowana zmianą wykładnika w przeciwnym kierunku. To mechanizm „naczyń połączonych”.

> [!IMPORTANT]
> **Wykładnik ujemny ($10^{-n}$)** nie zmienia znaku liczby na ujemny! Jest to jedynie informacja o skali ułamkowej — liczba znajduje się blisko zera, ponieważ podstawa $10$ trafiła do mianownika.

| Kierunek przesunięcia przecinka | Operacja na mantysie | Kompensacja wykładnika $n$ | Przykład inżynierski |
| :--- | :--- | :--- | :--- |
| **W lewo** ⬅️ | Zmniejszenie wartości | **Zwiększenie ($+1$)** | $299\ 000 \to 2.99 \cdot 10^5$ |
| **W prawo** ➡️ | Zwiększenie wartości | **Zmniejszenie ($-1$)** | $0.00008 \to 8 \cdot 10^{-5}$ |

### Tabela Mapowania Skali ($a = 2.5$):

| Wykładnik $n$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mnożnik** | $10^{-3}$ | $10^{-2}$ | $10^{-1}$ | $10^{0}$ | $10^{1}$ | $10^{2}$ | $10^{3}$ |
| **Wartość ($a \cdot 10^n$)** | $0.0025$ | $0.025$ | $0.25$ | $2.5$ | $25$ | $250$ | $2500$ |

---

## 🚀 Stacja Treningowa: Normalizacja do Standardu

Wykonaj konwersję surowych danych na znormalizowaną postać naukową. Pamiętaj o zachowaniu precyzji mantysy:

<data-gate>
  <data-math-worksheet type="power-scientific" count="1" difficulty="easy" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
  <data-math-worksheet type="power-scientific" count="2" difficulty="medium" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

<data-gate>
  <data-math-worksheet type="power-scientific" count="3" difficulty="hard" data-validation-mode="structural"></data-math-worksheet>
</data-gate>

---

## ⌨️ Kodowanie Zapisu: Składnia LaTeX

Aby Twoja dokumentacja techniczna i raporty były czytelne dla innych inżynierów (oraz systemów AI), musisz biegle posługiwać się standardem `LaTeX`. To „kod źródłowy” matematyki.

| Element | Składnia LaTeX | Reprezentacja |
| :--- | :--- | :--- |
| **Mnożenie** | `\cdot` | $a \cdot b$ |
| **Ułamek** | `\frac{a}{b}` | $$\frac{1}{2}$$ |
| **Potęga** | `a^{n}` | $2^{10}$ |
| **Pierwiastek** | `\sqrt[n]{x}` | $\sqrt[3]{8}$ |
| **Notacja naukowa** | `a \cdot 10^{n}` | $6.62 \cdot 10^{-34}$ |

<details>
<summary>🛠️ Zaawansowane Formaty Zapisu</summary>

*   **Wykładniki złożone**: `10^{-n+1}` (używaj klamer `{}` dla grup znaków).
*   **Balansowanie nawiasów**: `\left( \frac{a}{b} \right)` (dynamiczne dopasowanie wysokości).
*   **Indeksy dolne**: `x_{min}` (np. dla stałych fizycznych).

</details>

---

## 🪤 Finał Modułu: Optymalizacja Arki Danych

Fundamenty zostały położone. Twoim ostatnim zadaniem w Module $0$ jest przygotowanie **Arki Danych** dla transferu do Głównego Rdzenia Logicznego (Moduł $1$). Musisz zsynchronizować parametry klastra tak, aby przesunąć dane bez strat precyzji.

> [!NOTE]
> Przypomnienie jednostek: **Bajt** ($B$) to podstawowa komórka adresowalna, składająca się z 8 **bitów** ($b$).
> $1B = 8b$

### ⚙️ Manifest Arki (Specyfikacja Techniczna):
System wymaga synchronizacji następujących parametrów:
- **Pakiety Wejściowe**: Struktury typu **A** ($1.2 \cdot 10^4\text{ B}$) oraz **B** ($1.8 \cdot 10^4\text{ B}$).
- **Infrastruktura**: Rozmiar SuperSektora musi być **NWW** mantys obu pakietów przy zachowaniu skali $10^4$.
- **Klaster**: Arka agreguje dokładnie $2^3$ SuperSektorów.

<data-gate>
<data-math-sandbox level="basic" data-steps="5" data-label="🪤 Optymalizacja Arki Danych">
  <div data-step="1" data-expected="3.6 \cdot 10^4" data-label="1. Wyznacz rozmiar SuperSektora jako NWW mantys ($1.2$ i $1.8$) przy zachowaniu rzędu wielkości $10^4$." data-hint-wrong="10:💡 Znajdź NWW dla surowych wartości mantys (12 i 18), a następnie przywróć przecinek. Pamiętaj o zachowaniu skali \(10^4\)." data-hints='{"LOGIC_ERROR": "💡 Znajdź NWW dla surowych wartości mantys (12 i 18), a następnie przywróć przecinek. Pamiętaj o zachowaniu skali \(10^4\)."}'></div>
  <div data-step="2" data-expected="28.8 \cdot 10^4" data-label="2. Skalowanie: Pomnóż rozmiar sektora przez liczbę jednostek w klastrze ($2^3$)." data-hint-wrong="28:💡 Wykonaj proste mnożenie mantysy przez 8 (\(2^3\)). Nie przejmuj się jeszcze brakiem normalizacji." data-hints='{"LOGIC_ERROR": "💡 Wykonaj proste mnożenie mantysy przez 8 (\(2^3\)). Nie przejmuj się jeszcze brakiem normalizacji."}'></div>
  <div data-step="3" data-expected="2.88 \cdot 10^5" data-label="3. Normalizacja: Przekształć wynik do poprawnej notacji naukowej (mantysa < 10)." data-hint-wrong="28:💡 Mantysa musi być w przedziale \([1, 10)\). Przesuń przecinek w lewo i zrównoważ to zwiększeniem wykładnika o 1." data-hints='{"SCIENTIFIC_SCALE": "💡 Mantysa musi być w przedziale \([1, 10)\). Przesuń przecinek w lewo i zrównoważ to zwiększeniem wykładnika o 1."}'></div>
  <div data-step="4" data-expected="\frac{2.88 \cdot 10^5}{10^6}" data-label="4. Raport Wydajności: Zapisz ułamek porównujący pojemność Arki do miliona bajtów ($10^6$)." data-hint-wrong="frac:💡 Zastosuj składnię LaTeX \(\frac{licznik}{mianownik}\). Porównaj znormalizowany wynik do miliona (\(10^6\))." data-hints='{"LOGIC_ERROR": "💡 Zastosuj składnię LaTeX \\\\(\\\\frac{licznik}{mianownik}\\\\). Porównaj znormalizowany wynik do miliona \\\\(10^6\\\\)."}'></div>
  <div data-step="5" data-expected="28.8\%" data-validation="result" data-label="5. Finalna Weryfikacja: Wyraź tę pojemność jako procent miliona bajtów. Pamiętaj o symbolu %!" data-hint-wrong="%:💡 Skróć potęgi 10 i zamień ułamek na procenty. Pamiętaj: \(2.88 \cdot 10^5 / 10^6 = 0.288\). Dodaj symbol %." data-hints='{"LOGIC_ERROR": "💡 Skróć potęgi 10 i zamień ułamek na procenty. Pamiętaj: \(2.88 \\\\cdot 10^5 / 10^6 = 0.288\). Dodaj symbol %."}'></div>
</data-math-sandbox>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- notacja naukowa oddziela precyzję liczby (mantysę) od jej skali (wykładnika),  
- mantysa musi spełniać warunek $1 \le a < 10$,  
- przesunięcie przecinka wymaga kompensacji wykładnika (zasada balansu),  
- wykładnik ujemny oznacza skalę ułamkową, a nie liczbę ujemną,  
- notacja naukowa eliminuje błędy przy dużych i małych liczbach,  
- normalizacja danych jest kluczowa w fizyce, informatyce i inżynierii,  
- LaTeX to standard zapisu matematyki w dokumentacji technicznej.


---

# 🎉 Milestone: Moduł $0$ — Język Matematyki Opanowany!

Przeszedłeś pełną ścieżkę od intuicyjnego liczenia do świadomego modelowania danych.  
Opanowałeś fundamenty, które stanowią **system operacyjny matematyki**:

1. **Abstrakcja i Modelowanie** — rozróżniasz ideę od symbolu.  
2. **Składnia i Notacja** — potrafisz czytać i pisać matematycznie.  
3. **Struktury Liczbowe** — rozumiesz logikę zbiorów $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$.  
4. **Operacje Arytmetyczne** — znasz ich sens, własności i ograniczenia.  
5. **Podzielność i Synchronizacja** — NWD, NWW, modularność.  
6. **Skalowanie** — potęgi, pierwiastki, notacja naukowa.  
7. **Normalizacja Danych** — potrafisz oddzielić precyzję od skali.

To nie jest „matematyka szkolna”.  
To jest **język inżynierii**, którego będziesz używać w każdym kolejnym module.

---

**To dopiero początek.** Właśnie skalibrowałeś swój mikroskop i teleskop. W następnym module $1$ użyjemy ich, aby zajrzeć w głąb samej Prawdy. 🚀