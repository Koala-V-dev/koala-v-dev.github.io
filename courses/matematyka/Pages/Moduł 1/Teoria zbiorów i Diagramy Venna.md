# Teoria Zbiorów: Relacje i przestrzenie danych

Do tej pory pracowaliśmy na pojedynczych sygnałach (**1/0**). Teraz wchodzimy na wyższy poziom – zajmiemy się grupami obiektów. 

Teoria zbiorów to podstawa. To na niej opierają się bazy SQL, systemy uprawnień czy systemy typów w Twoim ulubionym języku programowania. Zamiast pytać: „czy ten sygnał jest wysoki?”, będziemy sprawdzać: **„Czy ten element pasuje do mojej grupy?”**.

---

## 📦 Co to jest zbiór?

Zbiór to po prostu worek z unikalnymi elementami. Kolejność nie ma znaczenia, a duplikaty są ignorowane – dodanie czegoś, co już tam jest, nic nie zmienia.

> [!TIP]
> **Idempotentność**: W informatyce dodawanie elementu do zbioru jest operacją idempotentną. Zbiór $\\{1, 2, 2, 3\\}$ to to samo co $\\{1, 2, 3\\}$. System po prostu olewa duplikaty. To Twoja pierwsza linia obrony przed śmieciowymi danymi.

- **Zapis**: Zbiory oznaczamy wielkimi literami ($A, B, \Omega$), a ich zawartość zamykamy w klamrach $\\{ \dots \\}$.
- **Przynależność** (_**$\in$**_): Jeśli element $x$ jest w zbiorze $A$, piszemy $x \in A$. Jeśli go nie ma: $x \notin A$.

<data-gate>
<data-quiz>
  <question>Masz zbiór identyfikatorów $C = \{1, 2, 3\}$. Jak zmieni się liczba elementów tego zbioru po próbie dodania elementu '$2$'?</question>
  <options>
    <option>Wzrośnie do $4$ elementów.</option>
    <option correct>Pozostanie bez zmian ($3$ elementy).</option>
    <option>Zbiór zostanie nadpisany nową wartością.</option>
    <option>Operacja zostanie odrzucona jako błąd krytyczny.</option>
  </options>
  <div data-hint="error">Pamiętaj o zasadzie unikalności. Zbiór nie przechowuje duplikatów.</div>
  <div data-hint="success">Dokładnie. Liczy się obecność typu, a nie liczba wystąpień.</div>
</data-quiz>
</data-gate>

---

## 🌌 Przestrzeń Ω: Granice systemu

Zanim cokolwiek policzysz, musisz ustalić granice. W teorii zbiorów nazywamy to **Przestrzenią $\Omega$** (Omega) — czyli dziedziną, w której porusza się Twój system.

> [!TIP]
> **Koniunkcja Sfer**: Jeśli znasz *Wiedźmina*, potraktuj $\Omega$ jako całe multiwersum. Zbiory $A$ i $B$ to poszczególne sfery (ludzi i elfów). Kiedy się nakładają, mamy część wspólną — potwory przenikające do naszego wymiaru! 

Bez jasnych granic „wszechświata” ($\Omega$) nie wiadomo, co właściwie jest poza zbiorem. Musisz wiedzieć, gdzie kończy się Twoja piaskownica, żeby nie liczyć „wszystkiego we wszechświecie”.

---

## 🎨 Diagramy Venna: Wizualizacja danych

Diagramy Venna to najprostszy sposób, żeby „zobaczyć” relacje między grupami danych, zanim zaczniesz pisać skomplikowany kod SQL czy reguły dostępu.

Każdy region to konkretny stan:
- **Wewnątrz koła $A$**: Obiekty spełniające warunek $A$.
- **Część wspólna ($A \cap B$)**: Obiekty spełniające oba warunki naraz (np. miecze, które są i srebrne, i ostre).
- **Poza kołami (w prostokącie $\Omega$)**: Elementy, które pasują do kontekstu, ale nie do żadnej z grup (np. NPC, który nie jest ani wrogiem, ani sojusznikiem).

> [!IMPORTANT]
> **Dobra rada**: Zanim napiszesz skomplikowany `JOIN` w SQL, narysuj to sobie. Jeśli nie potrafisz tego zwizualizować, Twoja logika biznesowa prawdopodobnie jest mętna i sam się w niej pogubisz.

---

## 📎 Operacje na zbiorach

Operacje na zbiorach to w praktyce bramki logiczne zastosowane do całych grup elementów.

### 🤝 Część wspólna ($A \cap B$) — Iloczyn Logiczny
Zostają tylko te elementy, które należą **jednocześnie** do obu zbiorów. To najbardziej rygorystyczna operacja.

> [!TIP]
> **Analogia: Procedura 2FA**. Wyobraź sobie system wystrzelenia rakiety 🚀. Aby operacja się powiodła ($A \cap B$), potrzebne są dwa klucze przekręcone jednocześnie przez dwóch oficerów. Brak jednego klucza ($x \notin A$ lub $x \notin B$) zabija cały proces. To czysty `AND`.

- **Logika**: $x \in (A \cap B) \iff (x \in A \land x \in B)$

| Symbol | Nazwa | Zapis LaTeX | Operacja SQL |
| :---: | :--- | :--- | :--- |
| $\cap$ | Iloczyn (przekrój) | `\cap` | `INNER JOIN` |

<data-gate>
<data-venn-diagram sets="2" task="A \cap B"></data-venn-diagram>
</data-gate>

### ➕ Unia ($A \cup B$) — Suma Zbiorów
Łączymy wszystko z obu grup. To operacja inkluzywna.

> [!TIP]
> **Analogia: Unia Lubelska**. To scalenie zasobów dwóch mocarstw (Korony i Litwy) w jedną całość. Każdy obywatel należał do unii, jeśli był obywatelem Korony **LUB** Litwy.

- **Logika**: $x \in (A \cup B) \iff (x \in A \lor x \in B)$

| Symbol | Nazwa | Zapis LaTeX | Operacja SQL |
| :---: | :--- | :--- | :--- |
| $\cup$ | Suma zbiorów | `\cup` | `UNION` |

<data-gate>
<data-venn-diagram sets="2" task="A \cup B"></data-venn-diagram>
</data-gate>

### ✂️ Różnica ($A \setminus B$) — Wykluczenie
Zabieramy ze zbioru $A$ wszystko, co ma jakikolwiek związek ze zbiorem $B$. 

> [!TIP]
> **Analogia: Spór o miedzę**. Jeśli sąsiad ($B$) twierdzi, że kawałek Twojego pola ($A$) należy do niego, a sąd mu przyzna rację, musisz ten kawałek „wyciąć”. To, co Ci zostanie, to czysta różnica $A \setminus B$. 

- **Logika**: $x \in (A \setminus B) \iff (x \in A \land x \notin B)$

| Symbol | Nazwa | Zapis LaTeX | Operacja SQL |
| :---: | :--- | :--- | :--- |
| $\setminus$ | Różnica zbiorów | `\setminus` | `EXCEPT` |

<data-gate>
<data-venn-diagram sets="2" task="A \setminus B"></data-venn-diagram>
</data-gate>

### 🕵️‍♂️ Różnica Symetryczna ($A \Delta B$) — Detekcja Rozbieżności
  
Pokazuje elementy, które są **unikalne** dla każdej ze stron. To, co wspólne, ląduje w koszu.

> [!TIP]
> **Analogia: Czystka szpiegów**. Masz dwie agencje wywiadowcze ($A$ i $B$). Ich część wspólna to podwójni agenci. Różnica symetryczna to proces usuwania tych zdrajców – zostają tylko lojaliści pracujący dla jednej ze stron. To czysty **XOR**.

- **Logika**: $x \in (A \Delta B) \iff (x \in A \oplus x \in B)$

| Symbol | Nazwa | Zapis LaTeX | Bramka Logiczna |
| :---: | :--- | :--- | :--- |
| $\Delta$ | Różnica symetryczna | `\Delta` | `XOR` |

<data-gate>
<data-venn-diagram sets="2" task="A \Delta B"></data-venn-diagram>
</data-gate>

---

## 🌑 Wszystko inne ($A'$) — Dopełnienie

Dopełnienie to wszystko w Przestrzeni $\Omega$, co **nie należy** do zbioru $A$. To po prostu operator **NOT**.

> [!TIP]
> **Analogia: Bariera wieku**. Jeśli $\Omega$ to wszyscy ludzie, a zbiór $A$ to niepełnoletni, to dopełnienie $A'$ to osoby, które mogą legalnie kupić alkohol 🍻. Albo jesteś w $A$, albo w $A'$. Trzeciej opcji nie ma.

- **Logika**: $x \in A' \iff \neg(x \in A)$

<data-gate>
<data-venn-diagram sets="3" task="(A')"></data-venn-diagram>
</data-gate>

---

## ⚡ Prawa de Morgana: Negacja Przestrzeni

To tutaj większość inżynierów popełnia błędy przy pisaniu warunków `WHERE` w SQL lub `if` w kodzie. Prawa te mówią, jak zachowuje się negacja (dopełnienie) względem unii i iloczynu.

1.  **Dopełnienie sumy to iloczyn dopełnień**: $(A \cup B)' = A' \cap B'$
2.  **Dopełnienie iloczynu to suma dopełnień**: $(A \cap B)' = A' \cup B'$

**W praktyce**: Jeśli szukasz użytkowników, którzy NIE są (aktywni LUB mają bana), to szukasz osób, które (NIE są aktywne) ORAZ (NIE mają bana).

<data-gate>
<data-venn-diagram sets="2" task="(A \cup B)'"></data-venn-diagram>
</data-gate>

---

## 🏗️ Prawa Rachunku Zbiorów (Twoja optymalizacja)

Znajomość tych zasad pozwala na upraszczanie zapytań i struktur danych:

*   **Idempotentność**: $A \cup A = A$ oraz $A \cap A = A$.
*   **Przemienność**: $A \cup B = B \cup A$. Kolejność łączenia grup nie ma znaczenia.
*   **Łączność**: $(A \cup B) \cup C = A \cup (B \cup C)$. 
*   **Rozdzielność**: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$. Możesz „wnosić” warunki do nawiasu, optymalizując filtry.

---

## 📏 Moc zbioru: Ile danych mamy w środku?

Inżyniera interesuje nie tylko to, co jest w zbiorze, ale też jak duży on jest. **Moc zbioru** (kardynalność) to po prostu liczba jego unikalnych elementów. Oznaczamy ją: $|A|$.

### 🛰️ Problem duplikacji ($|A \cup B|$)
Największy błąd to proste dodawanie liczebności dwóch zbiorów ($|A| + |B|$). Jeśli to zrobisz, elementy z części wspólnej policzysz **podwójnie**.

Musisz odjąć nadmiarowy zestaw części wspólnej:
$$|A \cup B| = |A| + |B| - |A \cap B|$$

**Przykład:**
Masz $100$ użytkowników Linuxa i $80$ użytkowników Windowsa. $30$ osób ma oba systemy (dual boot). Łączna liczba unikalnych osób to:
$$100 + 80 - 30 = 150$$

---

## 📏 Relacje: Element vs Grupa

Musisz odróżniać pojedynczy obiekt od całej struktury:

1. **Należenie ($x \in A$)**: Pojedynczy element jest częścią zbioru.
2. **Zawieranie ($A \subseteq B$)**: Cała grupa $A$ mieści się wewnątrz grupy $B$.

<data-gate>
<data-quiz>
  <question>Jeśli zbiór $A = \{1, 2\}$ oraz $B = \{1, 2, 3\}$, jaka relacja ich łączy?</question>
  <options>
    <option>$A \in B$ (A jest elementem B)</option>
    <option correct>$A \subseteq B$ (A jest podzbiorem B)</option>
    <option>$B \subseteq A$ (B zawiera się w A)</option>
  </options>
  <div data-hint="error">$A$ to kontener, a nie pojedyncza liczba. Czy kontener może być „elementem” bez bycia częścią całości?</div>
  <div data-hint="success">Słusznie. $A$ jest podzbiorem $B$, czyli każdy element $A$ jest też elementem $B$.</div>
</data-quiz>
</data-gate>

---

## 🧬 Zbiór Potęgowy: Uprawnienia i Bitmaski

Zbiór potęgowy $\mathcal{P}(A)$ to wszystkie możliwe podzbiory zbioru $A$. To na tym opierają się systemy uprawnień. Jeśli masz zasoby $\\{R, W, X\\}$, to zbiór potęgowy określa każdą możliwą kombinację dostępu – od braku uprawnień ($\emptyset$) po pełen dostęp.

Liczba tych kombinacji rośnie błyskawicznie: $$|\mathcal{P}(A)| = 2^{|A|}$$

**Zastosowanie: Uprawnienia Systemowe (chmod)**:
W systemach Unix, uprawnienia są modelowane jako sumy zbioru potęgowego (bitmaski):
- $4$ ($100_2$): READ
- $2$ ($010_2$): WRITE
- $1$ ($001_2$): EXECUTE

Suma $7$ ($111_2$) to po prostu unia wszystkich trzech zbiorów uprawnień.

| READ ($4$) | WRITE ($2$) | EXECUTE ($1$) | Wartość | Stan logiczny (Podzbiór) |
| :-: | :-: | :-: | :-: | :--- |
| ❌ | ❌ | ❌ | $0$ | $\emptyset$ (Brak dostępu) |
| ✔️ | ❌ | ❌ | $4$ | $\\{READ\\}$ |
| ✔️ | ✔️ | ❌ | $6$ | $\\{READ, WRITE\\}$ |
| ✔️ | ✔️ | ✔️ | $7$ | $\\{READ, WRITE, EXECUTE\\}$ |

---

## 🔢 Sandbox: Liczenie unikalnych danych

Oblicz liczebność różnicy symetrycznej, pamiętając o usuwaniu części wspólnej.

<data-gate>
<data-math-sandbox mode="result" level="basic" data-steps="1" data-label="🧮 Obliczanie kardynalności">
  <div data-step="1" data-expected="12" data-label="Zbiór $A$ ma $10$ elementów, zbiór $B$ ma $10$ elementów. Mają po $4$ elementy wspólne. <br> Ile unikalnych elementów należy do różnicy symetrycznej ($A \Delta B$)?" data-hint-wrong="20:💡 To suma bez usuwania duplikatów. Różnica symetryczna (\(\Delta\)) to elementy, które są WYŁĄCZNIE w jednym ze zbiorów. Musisz odjąć część wspólną.|16:💡 To unia (\(A \cup B\)). Różnica symetryczna wymaga usunięcia części wspólnej całkowicie z obu zbiorów.|6:💡 To tylko jedna strona różnicy (\(A \setminus B\)). Różnica symetryczna to suma obu takich stron." data-hints='{"LOGIC_ERROR": "💡 Pamiętaj o wzorze: \\\\(|A \\\\Delta B| = |A| + |B| - 2|A \\\\cap B|\\\\). Musisz odjąć część wspólną od obu zbiorów."}'></div>
</data-math-sandbox>
</data-gate>

---

## 🏆 Zastosowanie: NWD i NWW

Dzielniki i wielokrotności to w praktyce operacje na zbiorach czynników pierwszych:
- **NWD** to część wspólna ($\cap$) tych zbiorów.
- **NWW** to unia ($\cup$) wszystkich czynników.

<data-lcm-gcf-venn n1="24" n2="36"></data-lcm-gcf-venn>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- zbiór to struktura unikalnych elementów, a operacje na zbiorach działają jak bramki logiczne,  
- przestrzeń $\Omega$ definiuje granice systemu — bez niej nie ma sensu mówić o dopełnieniach,  
- diagramy Venna pozwalają *zobaczyć* logikę zanim ją zapiszesz,  
- iloczyn ($\cap$), suma ($\cup$), różnica ($\setminus$) i różnica symetryczna ($\Delta$) to odpowiedniki AND, OR, NOT i XOR,  
- prawa de Morgana działają identycznie w logice i w zbiorach,  
- kardynalność ($|A|$) to liczba unikalnych elementów — kluczowa w analizie danych,  
- podzbiory i zbiory potęgowe tworzą fundament systemów uprawnień i bitmask,  
- operacje na zbiorach pozwalają modelować relacje, filtrować dane i optymalizować zapytania SQL.


---

# 🎉 Milestone: Moduł $1$ — Fundamenty Struktur Opanowane!

Przeszedłeś drogę od pojedynczych bitów do pełnych przestrzeni danych.  
Zbudowałeś **logiczny kręgosłup**, na którym opiera się cała informatyka — od procesorów, przez SQL, po systemy uprawnień i kompilatory.

Opanowałeś trzy filary myślenia strukturalnego:

1. **Sygnały i Bramki** — rozumiesz, jak działa logika na poziomie fizycznym i symbolicznym.  
   Potrafisz analizować układy, przewidywać ich zachowanie i optymalizować ścieżki sygnałowe.

2. **Algebra Boole’a** — potrafisz *upraszczać*, *minimalizować* i *refaktoryzować* logikę.  
   Wiesz, czym różni się równość od tożsamości, a implikacja od równoważności.  
   Znasz prawa, które skracają kod i układy o całe gałęzie.

3. **Teoria Zbiorów** — przeszedłeś od wartości do struktur.  
   Rozumiesz unie, przecięcia, różnice, dopełnienia i przestrzeń Ω.  
   Potrafisz modelować relacje, filtrować dane i analizować zbiory tak, jak robi to SQL i systemy typów.

To nie jest „logika szkolna”.  
To jest **język struktur**, który pozwala opisywać, organizować i kontrolować dowolny system danych.


---

Jesteś gotowy na **Moduł $2$ — Algebra i Dowodzenie**. Wchodzimy w abstrakcyjny, algebraicznie świat Kwantyfikatorów ($\forall, \exists$) i rygorystycznego dowodzenia obiektywnej Prawdy. Witaj w świecie dowodów wprost, nie wprost i potężnej indukcji matematycznej... Będzie się działo. 😎 🚀
