# Podstawy systemów liczbowych

Każda liczba przetwarzana przez komputer ma określoną szerokość i granice wynikające z fizycznej budowy rejestrów pamięci. Zrozumienie zapisu dowolnego systemu liczbowego wymaga prześledzenia tego, co dzieje się w momencie wyczerpania dostępnych symboli w danej kolumnie.

---

## 🏗️ System dziesiętny: mechanika kolumn i przeniesienia

W systemie dziesiętnym (**`DEC`**) posługujemy się dziesięcioma symbolami: od $0$ do $9$.  
Każda pozycja liczbowa ma swoją wagę (jedności, dziesiątki, setki). Gdy do największego symbolu na pozycji jedności ($9$) dodamy $1$, kolumna wyczerpuje swój zakres. Zapis w tej kolumnie wraca do najmniejszej wartości $0$, a nadmiar zostaje przekazany do kolumny po lewej stronie jako **przeniesienie** (*carry*):

|  Wynik   |                     Tysiące                      |                      Setki                       |                    Dziesiątki                    | Jedności |
| :------: | :----------------------------------------------: | :----------------------------------------------: | :----------------------------------------------: | :------: |
| **$9$**  | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | **$9$**  |
| **$10$** | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> |                     **$1$**                      | **$0$**  |

---

## ⚠️ Fizyczny licznik i zjawisko overflow

W urządzeniach cyfrowych komórki pamięci nie rozciągają się w nieskończoność. Rejestr sprzętowy ma z góry ustaloną liczbę pozycji.

Spójrz na mechaniczny licznik kilometrów w samochodzie, który posiada $5$ bębnów na pełne kilometry:
![Tarcza zegara samochodowego (Licencja CC0 serwisu Pexels. Autor Luke Miller)](/public/courses/binarne-fundamenty-it/Images/tarcza_zegarqa_samochodowego.jpg)

Gdy pojazd osiągnie stan `99999` i przejedzie kolejny kilometr, wszystkie bębny przekręcają się jednocześnie na `00000`. Urządzenie nie posiada szóstej pozycji na kolejną jedynkę. Ta jedynka wypada poza fizyczny rejestr. W informatyce sytuację, w której wynik działania nie mieści się w przewidzianej liczbie pozycji, nazywamy *przepełnieniem* (**_overflow_**).

---

## 💻 Przejście do bazy 2: najprostszy przełącznik

W systemie dwójkowym (**`BIN`**) dysponujemy wyłącznie dwoma symbolami: $0$ oraz $1$. Zasada przeniesienia działa tu dokładnie tak samo jak w bazie $10$, jednak ze względu na obecność tylko dwóch znaków kaskada przeniesień występuje znacznie częściej:

1. Zaczynamy od stanu $0$.
2. Dodajemy $1 \to$ otrzymujemy $1$ (maksymalny dostępny symbol w bazie $2$).
3. Kolejne dodanie $1$ zeruje aktualną kolumnę ($0$) i otwiera nową pozycję po lewej stronie ($1$). Otrzymujemy zapis $10_2$ (odpowiednik dziesiętnej dwójki).

| Dziesiętnie | Binarnie (3 bity) | Zdarzenie sprzętowe                                                           |
| :---------: | :---------------: | :---------------------------------------------------------------------------- |
|     $1$     |       `001`       | Wpisanie $1$ na pozycji jedności                                              |
|     $2$     |       `010`       | Suma $1+1$: zerowanie pozycji $0$, przeniesienie $1$ na pozycję $1$           |
|     $3$     |       `011`       | Zwykłe dodanie $1$ do pozycji $0$                                             |
|     $4$     |       `100`       | Podwójne przeniesienie: pozycje $0$ i $1$ zerują się, otwiera się pozycja $2$ |

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Fizyczne uzasadnienie bazy 2 w układach scalonych</span>
<span class="deep-dive-badge">FIZYKA KRZEMU</span>
</summary>
<div class="deep-dive-content">

<p>Pierwsze komputery elektroniczne (np. ENIAC z <time datetime="1945">1945 roku</time>) konstruowano z próbą bezpośredniego liczenia w bazie 10. Konstruktorzy szybko zrezygnowali z tego podejścia z dwóch przyczyn fizycznych:</p>

<ul>
  <li><strong>Stabilność napięcia:</strong> Tranzystor krzemowy posiada dwa stabilne stany pracy: odcięcie (brak przepływu prądu, stan logiczny $0$) oraz nasycenie (pełen przepływ prądu, stan logiczny $1$). Aby odróżniać 10 odrębnych cyfr, napięcie zasilania rzędu $1.2\text{ V}$ należałoby podzielić na 10 wąskich pasm po ok. $0.12\text{ V}$. Naturalne fluktuacje termiczne i szumy elektryczne powodowałyby samoczynne przekłamywanie cyfr.</li>
  <li><strong>Elementarna logika:</strong> W układzie dwustanowym całą jednostkę arytmetyczno-logiczną (ALU) buduje się z zaledwie trzech podstawowych bramek logicznych: <code>AND</code>, <code>OR</code> oraz <code>NOT</code>.</li>
</ul>

<div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">
  <div style="flex: 1; min-width: 315px;">
    <data-logic-gate type="AND"></data-logic-gate>
  </div>
  <div style="flex: 1; min-width: 315px;">
    <data-logic-gate type="OR"></data-logic-gate>
  </div>
    <div style="flex: 1; min-width: 315px;">
    <data-logic-gate type="NOT"></data-logic-gate>
  </div>
</div>

<hr>

<p>Wniosek inżynierski: Układ dwustanowy charakteryzuje się najwyższym marginesem odporności na zakłócenia elektryczne.</p>

</div>
</details>

---

## 🧭 Zliczanie ilości a indeksowanie struktur (Offset i Bias)

Gdy liczymy obiekty w świecie fizycznym (np. palce na dłoni), interesuje nas **kardynalność**, czyli łączna liczba elementów. Wtedy naturalne jest liczenie od $1$ do $10$:

![Ilustracja przedstawiająca liczenie na palcach od 1 do 10 oraz indeksowanie od 0 do 9](/public/courses/binarne-fundamenty-it/Images/palce.png)

W architekturze komputerowej oraz w matematyce dyskretnej celem rzadko jest samo zliczenie sztuk. Znacznie częściej wyznaczamy położenie elementu w ciągłym bloku pamięci RAM. W takich zastosowaniach stosuje się model przesunięcia:
- **Offset**: odległość (liczba kroków lub bajtów) od punktu początkowego bufora.
- **Bias**: stałe przesunięcie bazowe dodawane do wartości, ułatwiające operowanie na zakresach bez konieczności ciągłego korygowania o jeden.

Pierwszy element w buforze znajduje się dokładnie w punkcie startowym. Jego przesunięcie względem początku wynosi zero ($offset = 0$). Z tego powodu pierwszy indeks ma wartość `[0]`.

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Arytmetyka wskaźników w C++ i eliminacja instrukcji SUB</span>
<span class="deep-dive-badge">C++ & WSKAŹNIKI</span>
</summary>
<div class="deep-dive-content">

<p>W języku C oraz C++ odwołanie tablicowe <code>tablica[i]</code> jest bezpośrednio tłumaczone przez kompilator na dodawanie wskaźnikowe:</p>

```cpp
int tablica[4] = {10, 20, 30, 40};

// Odwołanie do pierwszego elementu:
int a = tablica[0]; 
int b = *(tablica + 0); // Adres początku bloku + 0 bajtów przesunięcia

// Gdyby tablice indeksowano od 1:
// Kompilator przy każdym odczycie musiałby wstawiać instrukcję odejmowania:
// int c = *(tablica + (i - 1)); // Dodatkowa instrukcja SUB w ALU przy każdej iteracji pętli
```

<p>Wniosek inżynierski: Indeksowanie od zera bezpośrednio odzwierciedla adresowanie sprzętowe i zapobiega marnowaniu cykli procesora na sztuczne korygowanie pozycji w pamięci.</p>

</div>
</details>

---

## 🔒 Weryfikacja: Mechanika przeniesień i granic

<data-gate>
  <data-connection-matcher title="Mechanika Przeniesień i Granic">
    <item left="Licznik 5-cyfrowy: $99999 + 1$" right="`00000` (przepełnienie i utrata najwyższej cyfry)"></item>
    <item left="Baza 2: dodawanie $1_2 + 1_2$" right="Wynik $10_2$ (pozycja $0$, przeniesienie $1$)"></item>
    <item left="Kolejna wartość po $111_2$" right="$1000_2$ (otwarcie czwartej kolumny)"></item>
    <item left="Pierwszy indeks tablicy `[0]`" right="Przesunięcie o $0$ kroków od początku pamięci ($offset = 0$)"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Każda liczba przetwarzana przez komputer zajmuje określoną przestrzeń w rejestrze i podlega ograniczeniom sprzętowym.
- Przepełnienie (*overflow*) pojawia się w momencie, gdy wynik operacji przekracza pojemność zarezerwowanych kolumn pamięci.
- W systemie dwójkowym przeniesienie następuje przy przekroczeniu wartości $1$, otwierając kolejną pozycję po lewej stronie.
- Indeksowanie od zera wynika z mechaniki adresowania pamięci: numer indeksu określa przesunięcie (*offset / bias*) względem początku bufora.
