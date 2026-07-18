## Moduł 0: Mechanika Cyfrowego Świata

# Podstawy Systemów liczbowych
# Potęga Dwójki i Zakresy Mocy
# Bity, Bajty i Realne Prędkości
# Systemy Octalny i Hexadecymalny

## Moduł 1: Arytmetyka i Kodowanie

# Arytmetyka Binarna
# Liczby Ujemne - System U2
# Arytmetyka Ósemkowa i Szesnastkowa
# Kodowanie Znaków - ASCII i Matrix
# Wielki Finał - Wyzwania Mistrza Bitów


---

# Podstawy Systemów liczbowych

Większość ludzi traktuje liczby jako "po prostu liczby". W informatyce każda liczba ma swoją **szerokość** i **granicę**. Zanim przejdziemy do zer i jedynek, musimy zrozumieć, co się dzieje, gdy wyczerpiemy pulę dostępnych znaków.

## 🦖 System Dziesiętny: Mechanika Przeniesienia

W systemie dziesiętnym (DEC) mamy 10 symboli: $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$. Kiedy dodajemy $1$ do największego symbolu ($9$), następuje **przeniesienie**.

Spójrz na poniższą tabelę. To jest mechanizm, który znasz z podstawówki, ale spójrz na niego technicznie:

| Tysiące | Setki | Dziesiątki | Jedności | Wynik |
| :---: | :---: | :---: | :---: | :---: |
| <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | 9 | **$9$** |
| <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | 1 | 0 | **$10$** |

Gdy kolumna "Jedności" osiąga limit, zeruje się i wysyła sygnał przeniesienia do kolumny po lewej.

## ⚠️ Przepełnienie: Gdy hardware mówi "STOP"

W komputerze nie masz nieskończonej ilości kolumn. Jeśli Twój procesor ma system $3$-cyfrowy, to liczba **$999$** jest jego absolutnym sufitem. Co się stanie, gdy dodasz do niej $1$?

To zależy od tego, jak zaprojektowano sprzęt. W większości przypadków następuje **Overflow** (przepełnienie).

<data-gate>
  <data-quiz>
    <question>
Mamy fizyczny licznik (jak w starym samochodzie), który ma TYLKO $6$ pól na cyfry. Obecny stan to $999999$. Dodajesz $1$. Jaki będzie FIZYCZNY obraz tego licznika po operacji?
![Tarcza zegara samochodowego](/courses/binarne-fundamenty-it/Images/tarcza_zegarqa_samochodowego.png)
    </question>
    <options>
      <option correct> $000000$. Ponieważ licznik nie ma siódmego pola na kolejną "jedynkę".</option>
      <option> $1000000$. Licznik magicznie stworzy nową kolumnę, aby pomieścić wynik.</option>
    </options>

<div data-hint="error">
  Skup się na słowie "TYLKO $6$ pól". Fizycznie nie widzę tam miejsca na kolejną cyfrę. Co się stanie z bębnami licznika?
</div>
  </data-quiz>
</data-gate>

## 💻 Od 10 do 2: Przeskok Logiczny

W systemie binarnym (**_BIN_**) mamy tylko $2$ symbole: `0` i `1`. Zasada przeniesienia działa identycznie, ale... znacznie częściej.

1. Masz `0`.
2. Dodajesz `1` -> masz `1`. (Limit osiągnięty!)
3. Dodajesz kolejne `1` -> Jedynka się zeruje (`0`) i następuje przeniesienie w lewo (`1`). Wynik: `10` (co w systemie dziesiętnym oznacza $2$).

### Ćwiczenie: Przesunięcia w Binarnym

Spójrz na tabelę i spróbuj samodzielnie "przesunąć" wartości w głowie:

| Dziesiętnie | Binarnie | Co się stało? |
| :---: | :---: | :--- |
| 1 | `001` | Start |
| 2 | `010` | Przeniesienie z jedności do dwójek |
| 3 | `011` | Dodanie jedynki |
| 4 | `100` | Podwójne przeniesienie! |

<data-gate>
  <data-quiz>
    <question>
Jaka będzie następna liczba binarna po `111`? (Pamiętaj o mechanizmie przeniesienia!)
    </question>
    <options>
      <option correct>`1000`</option>
      <option>`112`</option>
      <option>`1111`</option>
      <option>`000`</option>
    </options>

<div data-hint="error">
  Każda kolumna ma już jedynkę (czyli swój limit). Dodanie `1` spowoduje, że pierwsza się wyzeruje i poda przeniesienie dalej. Druga zrobi to samo, trzecia też... Gdzie wyląduje ta ostatnia jedynka?
</div>
  </data-quiz>
</data-gate>

Na koniec chcę abyś popatrzył na poniższe dłonie. Na lewym obrazku palce liczymy normalnie, a na prawym *indeksujemy* je od zera (`0`). Wciąż mamy $10$ palców, ale w informatyce i zaawansowanej matematyce liczenie od zera to standard. 
Kiedyś w pełni zrozumiesz jak to bardzo ułatwia życię i pracę 😎.

![Palce od 1 do 10 i od 0 do 9](/courses/binarne-fundamenty-it/Images/palce.png)

---

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

# Bity, Bajty i Realne Prędkości

Wiesz już, co to jest bit (najmniejszy impuls) i dlaczego informatyka kocha potęgi dwójki. Teraz nauczymy się, jak te bity są pakowane w jednostki, które widzisz na co dzień w smartfonie, na Steamie czy w reklamach internetu.

## 📦 Pakiet w proporcji $1$:$8$

Bity to luźne impulsy. Przesyłanie ich pojedynczo byłoby chaosem. Dlatego informatycy umówili się na standard:  
**_$1$ Bajt_ (_B_) zawsze składa się z _$8$ bitów_ (_b_)**.

To jak pudełko jajek. Możesz mieć $1$ jajko (_bit_), ale sklep (system) sprzedaje i liczy je w całych pudełkach (_Bajtach_).

---

> [!IMPORTANT]
> Zapamiętaj różnicę w zapisie:
> - **b** (małe): bit -> impuls (sieć/światłowód)
> - **B** (duże): Bajt -> waga (dysk/pamięć RAM)

## 📡 Scam czy Matematyka? (Analiza ISP)

Dostawcy internetu (**_ISP_** - *Internet Service Provider*) uwielbiają podawać prędkości w **Mega-bitach** ($Mb/s$). Dlaczego?  
Bo liczba $1000$ $Mb/s$ wygląda $8$ razy potężniej na billboardzie niż $125$ $MB/s$.

Z kolei programy takie jak $Steam$, przeglądarka czy $qBittorrent$, pokazują prędkość w **Mega-Bajtach** ($MB/s$), by zobrazować Ci jak szybko plik "puchnie" na Twoim dysku.

### Wzór na czas oczekiwania do pobrania

Aby dowiedzieć się, jak szybko realnie ściągniesz grę, zawsze wykonaj operację dzielenia:  

_**$$\text{Czas (s)} = \frac{\text{Rozmiar pliku (MB)}}{\text{Prędkość pobierania (MB/s)}}$$**_


### Wzór na prędkość pobierania

Jeśli masz już znaną prędkość pobierania, możesz obliczyć czas oczekiwania do pobrania:  

**_$$\left(\text{Prędkość (MB/s)} = \frac{\text{Rozmiar pliku (MB)}}{\text{Czas (s)}}\right) \div 8 = \text{Prędkość (Mb/s)}$$_**

---

Do ręcznego przeliczania wielkości polegamy na proporcji $1:8$ i operacji dzielenia lub mnożenia, lecz w głowie bywa to uciążliwe.  

Właśnie dlatego informatycy automatyzują proces. Zamiast liczyć ręcznie, wypróbuj poniższy **Symulator ISP**!

<data-transfer-speed></data-transfer-speed>

<data-gate></data-gate>

## 💾 Zagadka Brakującego Miejsca

Kupiłeś kartę pamięci 64 GB, a telefon pokazał 59.6 GB? To wynika z konfliktu systemów:

1. **Ludzki (Producenci - Norma SI)**: Liczą $1 KB$ (Kilobajt) jako $1000$ B. ($1000 = 10^3$)
2. **Binarny (Systemy np. Windows)**: Liczą $1 KB$ jako $1024$ B. ($1024 = 2^{10}$)

Poprawną, współczesną nazwą dla $1024$ B w standardzie IT i systemach takich jak Linux jest **Kibibajt (KiB)**. Jednakże producenci sprzętu trzymają się przedrostka "Kilo" dla $1000$, a Windows ze względów historycznych używa u siebie "KB" lecz realnie pokazując wartość "KiB".

Przy większych jednostkach (GB) ta różnica narasta do kilku procent. To nie błąd dysku – to po prostu inna "miarka".

<data-gate>
  <data-quiz>
    <question>
Dlaczego system operacyjny liczy kilo-bajty jako 1024 bajty, a nie równe 1000?
    </question>
    <options>
      <option correct>Ponieważ 1024 to $2^{10}$, co pozwala procesorowi na bezpośrednie i szybkie adresowanie pamięci bez skomplikowanych konwersji.</option>
      <option>To błąd z przeszłości, którego nikt nie chciał naprawić.</option>
      <option>Producentom zależy, abyśmy widzieli mniejsze liczby.</option>
    </options>

<div data-hint="error">
  Pamiętaj o "gloryfikacji dwójki" z poprzedniej lekcji. Czy procesorowi łatwiej operować na okrągłych dziesiątkach, czy na potęgach dwóch?
</div>
  </data-quiz>
</data-gate>

Teraz, gdy wiesz już, jak ważyć dane i mierzyć ich prędkość, wejdziemy o poziom wyżej. Zobaczysz, jak informatycy skracają sobie te długie ciągi zer i jedynek za pomocą systemów **Octal** i **Hex**.

---

# Systemy Octalny i Hexadecymalny

Binarka jest świetna dla procesora, ale beznadziejna dla człowieka. Liczba $255$ to dla komputera `11111111`. Zapisywanie tego ręcznie to proszenie się o błąd. Dlatego programiści używają "skrótów": 
- systemu ósemkowego (Oct)
- szesnastkowego (Hex).

## 8️⃣ System Octalny (Ósemkowy)

Używa cyfr od **$0$ do $7$**. Każda cyfra ósemkowa to dokładnie **$3$ bity**.
W dzisiejszych czasach używany głównie w systemach Linux do uprawnień plików (np. `chmod 755`).

## 🔟➕6️⃣ System Hexadecymalny (Szesnastkowy)

To król informatyki. Używa 16 znaków: $0-9$ oraz litery $A$ ($10$), $B$ ($11$), $C$ ($12$), $D$ ($13$), $E$ ($14$), $F$ ($15$).

**Jeden znak HEX to dokładnie $4$ bity**. Zatem jeden Bajt ($8$ bitów) to zawsze dwie cyfry HEX (np. `FF` = `1111 1111`). Genialne, prawda?

| HEX | Binarnie | Dziesiętnie |
| :---: | :---: | :---: |
| *__$1$__* | `0001` | $1$ |
| *__$9$__* | `1001` | $9$ |
| _**A**_ | `1010` | $10$ |
| _**F**_ | `1111` | $15$ |

Czy więc *__F__* to *__$15$__*? Nie! To bardzo niebezpieczny skrót myślowy.  
_**F**_ w systemie szesnastkowym ma wartość *$15_{10}$* - po konwersji na system dziesiętny. Lecz gdy przekonwertujesz _**F**_ na system ósemkowy otrzymasz *$17_{8}$*. Uważaj by nie popełnić tego kardynalnego błędu! 😉

## 🎨 Hex w Twoim monitorze

Najczęstszym miejscem, gdzie spotkasz Hexa, są kolory <span style="color: red">R</span><span style="color: green">G</span><span style="color: blue">B</span>. Każdy kolor ma składowe Czerwony, Zielony i Niebieski. Każda z nich ma $8$ bitów zakresu ($0-255$).
Kolor biały to:
- RGB: `(255, 255, 255)`
- HEX: `#FFFFFF`

<data-gate>
  <data-quiz>
    <question>
Kolor czysty zielony w formacie HEX to `#00FF00`.  
Wiedząc, że dwie pierwsze cyfry to kolor Czerwony (Red), dwie kolejne to Zielony (Green), a dwie ostatnie to Niebieski (Blue) – ile bajtów zajmuje zapis tego koloru w pamięci?
    </question>
    <options>
      <option correct>3 bajty. Po jednym bajcie koloru.</option>
      <option>6 bajtów. Bo jest 6 znaków dla kolorów.</option>
      <option>1 bajt. Bo to w sumie tworzy jeden kolor.</option>
    </options>

<div data-hint="error">
  Pamiętaj: 1 znak HEX = $4$ bity. Dwa znaki HEX (jak `FF` lub `00`) = $8$ bitów. Ile par znaków widzisz w kodzie `#00FF00`?
</div>
  </data-quiz>
</data-gate>

## 🔐 Wyliczanie dziesiętnych z systemów ósemkowego i szesnastkowego

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Czapki z głów! 🎓
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Ale ciśniesz! 😎
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już jest wyższa szkoła jazdy! 🚗
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Jest pompa! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Wchodzisz na wyższy level! 🚀
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Matematyczna poezja! ✨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Tak się robi robotę! 🔧🔥
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Elegancko to ogarniasz! 🎩
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Liczby tańczą jak im zagrasz! 💃🕺
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już prawie sztuka! 🎨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Jesteś jak liczbowy ninja! 🥷
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Mistrzostwo świata! 🏆
  </data-number-system>
</data-gate>


<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Jednak dalej pamiętasz binarkę! 🤯
  </data-number-system>
</data-gate>

---

Widzę, że konwersjami binarnymi, ósemkowymi i szesnastkowymi na dziesiętne już cię nie zagnę. 😅  
Lecimy dalej? 🤔 Będzie trudniej, hahahaha! 😆


---

# 🧮 Arytmetyka Binarna

Matematyka, której uczysz się w szkole, jest nieskończona — zawsze możesz dodać kolejną cyfrę, a z lewej strony masz nieskończoną ilość *zer wiodących*, których nie musimy zapisywać. Ale technologia komputerowa jest **deterministyczna i skończona**. Procesor operuje na **pudełkach o sztywnym rozmiarze**, które mają swoje nieprzekraczalne limity.

---

My skupimy się na standardzie **16-bitowym** (typ `short` stosowany np. w C++). Mieści on dokładnie $2^{16} = 65536$ kombinacji. To nasze maksimum, z którego liczby nie mogą uciec.

## ➕ Dodawanie z mechanizmem "Przeniesienia"

Dodawanie binarne opiera się na prostych regułach:

| Działanie | Wynik | 
| :---: | :---: |
| $0 + 0$ | **$0$** |
| $0 + 1$ | **$1$** |
| $1 + 0$ | **$1$** |

 Problem pojawia się wtedy, gdy suma jedynek w kolumnie wynosi $2$ lub $3$. Wtedy następuje **przeniesienie** do kolejnej pozycji, zupełnie jak w dodawaniu słupkowym, gdy suma przekracza $9$ dla systemu dziesiętnego (decymalnego).

| Suma w kolumnie | Wynik | Nowe Przeniesienie |
| :--- | :---: | :---: |
| $1 + 1$ | **$0$** | **$1$** dla kolejnej kolumny po lewej |
| $1 + 1 +$ *$1$ (z przeniesienia)* | **$1$** | **$1$** dla kolejnej kolumny po lewej |
| $0 + 1 +$ *$1$ (z przeniesienia)* | **$0$** | **$1$** dla kolejnej kolumny po lewej |

---

**Przykład (3 + 1):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Tu masz 1 z przeładowania w poprzedniej kolumnie po prawej. &#10;Patrzysz, czy tym razem też zajdzie przeładowanie. &#10;W tym przypadku kolumna nie zawiera choćby jednej jedynki, aby nastąpiło przeładowanie, więc skoro 0+0=0, to wystarczy przepisać jedynkę z poprzedniego przeładowania.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Tu masz 1 z przeładowania w poprzedniej kolumnie po prawej. &#10;Patrzysz, czy tym razem też zajdzie przeładowanie. &#10;Jak w tej kolumnie występuje jedynka, to masz kolejne przeładowanie i teraz to przeładowanie da ci operację 0 + druga wartość, która może być 0 albo 1 i ją przepisujesz jako wynik sumy. &#10;Poniżej widzisz, że zabierając jedynkę do przeładowania, masz ostateczne działanie 0+0, więc wynik to 0 i jedynka do przeniesienia, bo było przeładowanie.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Poniżej widzisz sumę 1 i 1, więc do kolejnej kolumny przenosisz przeładowaną wartość (1), a w wyniku zapisujesz zresetowany licznik (0)">←</span> |
| :--- | :---: | :---: | :---: |
| **Składnik A $(3)_{10}$** | $0$ | $1$ | $1$ |
| **Składnik B $(1)_{10}$** | $0$ | $0$ | $1$ |
| **Wynik $(4)_{10}$** | **$1$** | **$0$** | **$0$** |


<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>
</data-gate>


## ➖ Odejmowanie: Reguła "Niwelowania i Cofania"

Odejmowanie binarne, podobnie jak dziesiętne, opiera się na procesie pożyczania. Najskuteczniejszym sposobem na zrozumienie tego procesu jest **Reguła Niwelowania i Cofania**. 

> [!IMPORTANT]
> Mechanizm ten uruchamia się **wyłącznie wtedy, gdy od cyfry mniejszej odejmujesz większą ($y < x$)**. Jeśli $y \ge x$, odejmowanie jest bezpośrednie i nie generuje długu.

### Jak to działa? (Pełny proces obsługi długu)
Spójrzmy na mechanizm w systemie dziesiętnym, opierając się na zestawie znaków ($0$-$9$), czyli naszym **Liczniku**:

**Przykład A (_$125 - 7$_):**
1. **Jedności**: $5 - 7$. Ponieważ $5 < 7$, niwelujemy część wspólną ($5$), zostaje *$2$ długu*.
2. **Cofanie & Paradoks Pożyczki**: Aby spłacić to $2$, musimy "cofnąć" licznik o jedną pozycję (pożyczka od sąsiada). Sąsiad bierze "rachunek" za przeskok (1) na siebie. To paradoks: pożyczka od sąsiada **zmniejsza** nasz lokalny dług, bo opłaca koszt przeskoku z $0$ na $9$.
3. **Reszta długu**: Po opłaceniu kosztu przeskoku, nasz pozostały dług wynosi już tylko $1$ ($2 - 1 = 1$).
4. **Wynik jedności**: Licznik wskazuje $9$ (nowa pozycja). Odejmujemy resztę długu ($9 - 1$). Wynik: _**$8$**_.
5. **Dziesiątki**: Mieliśmy $2$. Spłacamy sąsiadowi koszt Vouchera za przeskok ($2 - 1$). Wynik: _**$1$**_.
6. **Rachunek końcowy**: _**118**_.

---

**Przykład B (_$48 - 19$_):**
1. **Jedności**: $8 - 9$. Niwelujemy część wspólną ($8$), zostaje *$1$ długu*.
2. **Cofanie & Paradoks**: Pożyczka od sąsiada (1) w całości opłaca koszt przeskoku licznika (1). 
3. **Reszta długu**: Cały dług spłacony ($1 - 1 = 0$).
4. **Wynik jedności**: Licznik po przeskoku wskazuje $9$. Brak reszty długu. Wynik: _**$9$**_.
5. **Dziesiątki**: Mamy $4$. Najpierw regulujemy zadłużenie za pożyczkę ("Voucher") dla jedności ($4 - 1 = 3$). Teraz odejmujemy cyfrę $1$ (z części dziesiętnej liczby $19$). Wynik: _**$2$**_.
6. **Rachunek końcowy**: _**29**_.

---

W systemie binarnym (zestaw znaków $0$-$1$) mechanizm jest identyczny. Cofnięcie licznika (przeskok z $0$ na $1$) zawsze spłaca dokładnie *$1$ długu*.

---

**Reguły bezpośrednie (Brak długu z prawej):**
| Działanie | Wynik | Komentarz |
| :--- | :---: | :--- |
| $0$ - $0$ | **$0$** | - |
| $1$ - $1$ | **$0$** | - |
| $1$ - $0$ | **$1$** | - |
| $0$ - $1$ | **$1$** | Niweluję $0$, zostaje $1$ długu. Licznik cofa się na $1$, co przenosi dług na sąsiada z lewej. |

---

A skoro w ostatnim przypadku ($0-1$) wygenerował się dług dla sąsiada, to popatrz na reguły gry dla zadłużonych. 

**Reguły z długiem (Gdy kolumna otrzymała dług z prawej):**
W tej tabeli najpierw spłacamy "dług przychodzący", a potem sprawdzamy, czy sami musimy pożyczyć od sąsiada z lewej.

| Działanie | Wynik | Czy tworzy nowy dług dla lewego sąsiada? |
| :--- | :---: | :--- |
| $0$ - $0$ **(- dług $1$)** | **$1$** | **TAK** (Cofam licznik na $1$, co spłaca dług) |
| $1$ - $0$ **(- dług $1$)** | **$0$** | **NIE** (1 niweluje dług 1, zostaje 0) |
| $0$ - $1$ **(- dług $1$)** | **$0$** | **TAK** (Niweluję 0, spłacam długu 1. Brakło na odejmowanie 1!) |
| $1$ - $1$ **(- dług $1$)** | **$1$** | **TAK** (1 niweluje 1. Zostaje dług 1. Cofam licznik na 1) |

> [!TIP]
> **W skrócie: Ściąga dla Długu**
> - Jeśli bit = **0** i musisz odjąć **1** → bierzesz pożyczkę → wynik **1**, dług idzie w lewo.
> - Jeśli bit = **1** i masz dług (1) → spłacasz go → wynik **0**, dług wygasa.
> - Jeśli bit = **0** i masz dług (1) → bierzesz pożyczkę, by spłacić dług → wynik **1**, dług idzie w lewo.

### Co gdy brakuje sąsiada? (Wynik Ujemny)
Zauważ, że opisane reguły działają idealnie, dopóki masz "kogoś po lewej", kto może opłacić Twój Voucher na skok w tył licznika. Ale co, gdy $2 - 3$ 🤔?

Wtedy ostatnia jedynka po lewej nie istnieje, by spłacić dług. Procesor musi "przekręcić" wszystkie licznik 🤯, co w świecie bitów oznacza wejście w obszar **liczb ujemnych** (U2). Ale o tym w następnej lekcji 😉.

---

**Przykład (4 − 1):**
Analiza operacji $100 - 001$ ($4 - 1$). Dług wędruje przez kolumny, aż trafi na jedynkę, która może go spłacić.

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Ostatnia faza. Tu dokonujesz odejmowania 1 - 0. Widzisz z poprzednich obliczeń, że twój prawy sąsiad zarzucił na ten róg dług wynoszący 1. Posiadasz jednak do dyspozycji natywne 1 na starcie. Twój zasób jest w stanie opłacić zadaną karę. Spłacasz kwotę długu 1 posiadając swój punkt 1, i pozostajesz z wartością 0 na koncie. Rozliczywszy się, kończysz działanie kolumny wedle wzoru: od Twojego zostawionego 0 schodzi dolne odjęcie równe 0, zejściem tego jest wymiar 0. Koniec długu.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Kolejna kolumna, w której robisz 0 - 0. Zauważasz jednak, że na kolumnie spoczywa też 1 przejętego długu, który zrzuciła wcześniejsza iteracja obok z prawej. Aby spłacić 1 nie mając własnego stanu na liczniku, ponownie zmuszony jesteś rzucić ten ciążący dług z wynoszącą kwotą 1, powielając ten stan w lewo. Sam rzut na kolejnego sąsiada pozwala na cofnięcie sprzętowo licznika do tyłu, wracając oknem cyklu z 0 na pozycję 1. Krok ujęty tą operacją usuwa wymiar Twojego pierwotnego długu wynoszącego okrągłe 1. Skoro zaległość została spłacona w całości u manewru - od odnowionego na 1 progu odejmujesz bazowe wskazywane na spodzie kolumny 0. Przerzucasz na dół wynik tego odcinka: 1.">✅</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Patrzysz na bieżącą kolumnę od prawej strony. Masz polecenie zrzucenia wartości 1 domyślnie startując na 0. Od mniejszej idziesz ku górze na mniejszą, czyli musisz ugiąć i cofnąć licznik. W tym celu bez wahania wymuszasz u następnego lewego sąsiada wygenerowanie przypisanego Ci długu o wymiarze 1. Zabieg ten uiszcza Ci pożądaną odgórną zgodę, i uwarunkowanie do wykonania pełnego cofnięcia we własnym liczniku na dół poniżej kółka podłoża, do cyfry 1. Przez odrzucenia wspólnego pułapu (0) Twoja wartość długu szacuje się na skromne 1. Dodatkowo sam zwrot licznika pod 0 niszczy z racjonalizacji zeszłą cząstkę wymiaru. Zostają z długów uległe okrągłe 0 do obsłużenia długu na czysto, tak wobec tego – od cofniętego licznika zatrzymanego za kółkiem na 1 zrzucasz opór 0. Ostateczny wynik zapisywany z ramienia w pierwszej kolumnie ląduje zrzutem 1.">✅</span> |
| :--- | :---: | :---: | :---: |
| **Odjemna (4)** | 1 | 0 | 0 |
| **Odjemnik (1)** | 0 | 0 | 1 |
| **Wynik (3)** | **0** | **1** | **1** |

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>
</data-gate>

## ✖️ Mnożenie: Reguła "Pozycja = Ilość Zer"

Mnożenie w procesorze to ściśle zdefiniowana procedura przesunięć. Cała logika opiera się na **Indeksie Pozycji** (liczonym od $0$ z prawej strony).

### Twarda Reguła (Shift Rule)
Spójrz na dolną liczbę (mnożnik). Numer pozycji, na której znajdziesz `1`, mówi Ci dokładnie, ile zer dopisujesz do liczby górnej (mnożnej). Pamiętaj – pozycje liczymy od zera, patrząc od prawej strony!

| Pozycja| 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Zapis binarny mnożnej | `0` | `0` | `0` | `1` | `1` | `0` | `1` | `1` |
| Zapis binarny mnożnika | `0` | `0` | `0` | **`1`** | `0` | **`1`** | **`1`** | **`1`** |

> [!IMPORTANT]
> Przesunięcie w mnożeniu opiera się na zdefiniowaniu ilości dopisywania zer do mnożnej względem pozycji, na której stoi jedynka w dolnej liczbie. 

👉 **Wizualizacja przesunięcia (Bit-Shift):**
Wyobraź sobie, że mnożenie to "popychanie" liczby w lewo — dopisujesz zera na końcu:

| Mnożna | Pozycja jedynki | Shift | Wynik |
| :---: | :---: | :---: | :---: |
| `11011` | $0$ | $\xleftarrow{0}$ | `11011` |
| `11011` | $1$ | $\xleftarrow{1}$ | `11011`**`0`** |
| `11011` | $2$ | $\xleftarrow{2}$ | `11011`**`00`** |

---

Dla powyższego przykładu patrzymy najpierw na mnożnik `0001 0111` i widzimy że jedynki występują na pozycjach $0, 1, 2$ i $4$. Zatem uzyskamy cztery przesunięcia i cztery wartości do zsumowania. 

| Pozycja | Wartość mnożnika | Operacja | Wynik mnożnej po przesunieciu do późniejszego zsumowania|
| :---: | :---: | :---: | :---: |
| $0$ | `1` | *__$0001\text{ }1011 \xleftarrow{0}$__* | **$0001\text{ }1011$** |
| $1$ | `1` | *__$0001\text{ }1011 \xleftarrow{1}$__* | **$0011\text{ }011$_$0$_** |
| $2$ | `1` | *__$0001\text{ }1011 \xleftarrow{2}$__* | **$0110\text{ }11$_$00$_** |
| $3$ | `0` | *__$0001\text{ }1011 \xleftarrow{3}$__* | *$0000\text{ }0000$* |
| $4$ | `1` | *__$0001\text{ }1011 \xleftarrow{4}$__* | **$0001\text{ }1011\text{ }$_$0000$_** |
| $5$ | `0` | *__$0001\text{ }1011 \xleftarrow{5}$__* | *$0000\text{ }0000$* |
| $6$ | `0` | *__$0001\text{ }1011 \xleftarrow{6}$__* | *$0000\text{ }0000$* |
| $7$ | `0` | *__$0001\text{ }1011 \xleftarrow{7}$__* | *$0000\text{ }0000$* |

W powyższej tabeli dokonaliśmy przesunięcia w lewo o ilość względem pozycji każdego bitu mnożnej.  
Dla wartości zerowych mnożnika chodź operacja przesunięcia występuje to jej wynik może zostać zignorowany ponieważ matematycznie mnożenie przez zero daje zero. 

Więc ostatecznie mamy cztery wartości do przeprowadzenia trzech operacji dodawania:

1. _**$0001\text{ }1011$**_ + *$0011\text{ }0110$* = `0101 0001`
|| | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| |**`0`** | **`0`** | **`0`** | **`1`** | **`1`** | **`0`** | **`1`** | **`1`**|
| + |_`0`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_|
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| |`0` | `1` | `0` | `1` | `0` | `0` | `0` | `1`|
2. Wynik poprzedniej opercaji dodawania → _**$0101\text{ }0001$**_ + *$0110\text{ }1100$* = `1011 1101`
|| | | | | | | | |
|---|---|---|---|---|---|---|---|---|
| |**`0`** | **`1`** | **`0`** | **`1`** | **`0`** | **`0`** | **`0`** | **`1`**|
| + | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`0`_|
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| |`1` | `0` | `1` | `1` | `1` | `1` | `0` | `1`|
3. Wynik poprzedniej operacji dodawania → _**$1011\text{ }1101$**_ + *$0001\text{ }1011\text{ }0000$* = `0010 0110 1101`
|| | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | **`1`** | **`0`** | **`1`** | **`1`** | **`1`** | **`1`** | **`0`** | **`1`** |
| + | | _`1`_ | _`1`_ | _`0`_ | _`1`_ | _`1`_ | _`0`_ | _`0`_ | _`0`_ | _`0`_ |
|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|<hr>|
| | `1` | `0` | `0` | `1` | `1` | `0` | `1` | `1` | `0` | `1` |

---

To podejście działa zawsze i dla każdej liczby. Procesor po prostu "skanuje" bity mnożnika i dla każdej jedynki generuje odpowiednio przesuniętą wersję liczby, a na końcu wszystko sumuje. ⚡

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

---

Alternatywnie, skoro komputer aby coś obliczyć musi to przekonwertować pierw na zapis binarny i potem wynik zwrócić człowiekowi w zapisie dziesiętnym to Ty możesz zrobić podobnie.

Mając do pomnożenia liczby binarne `0001 1011` i `0001 0111`, dokonaj pierw konwersji i przeprowadź operację mnożenia w systemie dziesiętnym by na koniec wynik spowrotem przekonwertować na zapis binarny.

- `0001 1011` to $27$
- `0001 0111` to $23$
- $27\cdot23 = 621$
- Przekonwertuj wynik spowrotem do zapisu binarnego czyli: `0010 0110 1101`

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>
</data-gate>

## ➗ Dzielenie: Skanowanie po Indeksach

Dzielenie binarne to proces sprawdzania, które przesunięcia dzielnika "mieszczą się" w naszej liczbie. Wyobraź sobie dzielnik jako **szablon** (stempel), który przesuwasz nad dzielną, szukając miejsca na kolejne "wycięcie" (odejmowanie).

### Reguła Przewagi (Czy szablon pasuje?)
Zanim zaczniesz wycinać, procesor mechanicznie sprawdza "czy góra ma przewagę":
1. **Długość**: Liczba z większą ilością cyfr (bez *zer wiodących*) zawsze wygrywa (np. `101` > `11`).
2. **Pierwszy różny bit**: Jeśli są równe, o zwycięstwie decyduje pierwsza różnica od lewej (**1** > **0**).

> [!TIP]
> **Głowa i Ogon**: W informatyce stosujemy nomenklaturę, że maksymalnie lewy znak w fragmencie tekstu to **Głowa** (_**head**_), a maksymalnie prawy znak w tym fragmencie to **Ogon** (_**tail**_). 😉 

### Przykład: Skanowanie krok po kroku (22 ÷ 5)
Dzielimy $22$ przez $5$. Nasz szablon to `101`. Sprawdzamy wszystkie pozycje, zaczynając od największej możliwej:

#### Krok 1: Pierwsza przymiarka
Kładziemy szablon tak, aby jego **Głowa** była maksymalnie na lewo pod dzielną i widzimy że **Ogon** jest na **indeksie $2$**. 

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Dzielna**| `1` | `0` | `1` | `1` | `0` | Wartość początkowa|
| **Szablon**| **`1`** | **`0`** | **`1`** | _`0`_ | _`0`_ | **Ogon na indeksie $2$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `?` | `?` | Aktualny wynik po poniższych operacjach. |

Zobacz na te zera w szablonie. Musimy je dopisać, bo przesunęliśmy nasz szablon o *2*.

- **Decyzja**: Czy Góra ma przewagę (`0001 0110` $\geq$ `0001 0100`)? **TAK**!
- **Wynik**: Na indeksie $2$ gdzie znajduje się ogon wpisujesz pod nim _**$1$**_.
- **Reszta**: Odejmujesz `0001 0110` $-$ `0001 0100` $=$ `0000 0010`. To Twój nowy cel dla kolejnych kroków.

#### Krok 2: Druga przymiarka
Przesuwamy szablon o jedno miejsce w prawo. Teraz jego **Ogon** ląduje na **indeksie $1$**.

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Reszta** |   | `0`  |  `0` | `1` | `0` | Reszta z poprzedniego odejmowania |
| **Szablon**|   | **`1`** | **`0`** | **`1`** | _`0`_ | **Ogon na indeksie $1$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `0` | `?` | Aktualny wynik po poniższych operacjach. |

- **Decyzja**: Czy Góra (reszta `0010`) ma przewagę nad Szablonem (`1010`)? **NIE**.
- **Wynik**: Na indeksie $1$ wyniku wpisujesz _**$0$**_.
- **Reszta**: Bez zmian, nadal masz **`10`**.

#### Krok 3: Trzecia przymiarka
Kładziemy szablon na ostatnim możliwym miejscu. **Ogon** na **indeksie $0$**.

| Indeksy   | $4$ | $3$ | $2$ | $1$ | $0$ | Opis |
| :---      |:-:|:-:|:-:|:-:|:-:| :--- |
| **Reszta** |   |   | `0`  | `1` | `0` | Reszta z poprzedniego odejmowania |
| **Szablon**|   |   | **`1`** | **`0`** | **`1`** | **Ogon na indeksie $0$** |
| <hr> |<hr> |<hr> |<hr> |<hr> |<hr> |<hr> |
| **Wynik**  | `0` | `0` | `1` | `0` | `0` | Aktualny wynik po poniższych operacjach. |

- **Decyzja**: Czy Góra (`0010`) ma przewagę nad Szablonem (`101`)? **NIE**.
- **Wynik**: Na indeksie $0$ wyniku wpisujesz _**$0$**_.

---

**Wynik końcowy:**
- **Iloraz**: `100` (czyli **4**)
- **Reszta ( % - Modulo)**: `10` (czyli **2**)

> [!IMPORTANT]
> To jest czysta mechanika: skanujesz kolejne indeksy, przesuwasz szablon **Ogonem** do pozycji i decydujesz o jednym bicie wyniku.  
> Po każdym "trafieniu" (1) odejmujesz i pracujesz na mniejszej reszcie.

**Algorytm Dzielenia w 4 krokach:**
1. **Ustaw szablon** (dzielnik) maksymalnie w lewo pod dzielną.
2. **Sprawdź przewagę**: Jeśli góra $\ge$ dół → wpisz **1** w wyniku pod ogonem szablonu i odejmij.
3. **Brak przewagi?**: Wpisz **0** w wyniku.
4. **Przesuń szablon** o 1 w prawo i powtarzaj, aż dojdziesz ogonem do indeksu $0$.

<data-gate>
  <data-arithmetic-challenge base="2" operation="/"></data-arithmetic-challenge>
</data-gate>

## 🕹️ Symulator Arytmetyki Binarnej

Poniżej masz interaktywny element w którym możesz przetestować wszelkie kombinacje arytmetyczne dwóch liczb szesnastobitowych:

<data-binary-arithmetic digits="16" base="2" u2="false"></data-binary-arithmetic>

## 🔒 Operacje arytmetyczne w systemie binarnym

Czas na podsumowanie i sprawdzenie wiedzy w praktyce.

<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Dodawać już umiesz. 🙂

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Odejmowanie to dla ciebie nie jest problem. 😎

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="*"></data-arithmetic-challenge>

> [!TIP]
> Oby tak dalej z pomnażaniem. 🤑

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="/"></data-arithmetic-challenge>

> [!TIP]
> Dziel i rządź! 👑

</data-gate>

---

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

# 🎱💎 Arytmetyka Ósemkowa i Szesnastkowa

Znasz już arytmetykę binarną — dodawanie, odejmowanie, mnożenie i dzielenie na zerach i jedynkach. Teraz czas zastosować **te same reguły** w systemach, które informatycy używają na co dzień: **ósemkowym (Octal)** i **szesnastkowym (Hexadecimal)**.

Zasada jest uniwersalna: zmienia się tylko **pojemność licznika**, przy której następuje **Przeładowanie** (gdy suma jest zbyt duża) lub zapotrzebowanie na **Cofnięcie licznika** (gdy od mniejszej cyfry odejmujemy większą).

| System | Cyfry | Limit Licznika | Przeładowanie (koszt z sumy) | Zapożyczenie i Koszt Przrótu (z długu) |
| :--- | :---: | :---: | :---: | :---: |
| Binarny | 0-1 | 1 | $-2$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |
| **Ósemkowy** | 0-7 | 7 | $-8$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |
| **Szesnastkowy** | 0-F | 15 (F) | $-16$ | Sąsiad bierze 1 długu, przewrót kosztuje -1 długu |

## 🎱 System Ósemkowy (Octal)

System ósemkowy był popularny w erze 12-bitowych i 36-bitowych maszyn. Dziś spotkasz go głównie w uprawnieniach systemów Linux (`chmod 755`). Jedna cyfra ósemkowa to **dokładnie 3 bity**.

### ➕ Dodawanie Ósemkowe

System wykorzystuje cyfry $0$-$7$. Gdy suma przekroczy $7$, licznik ulega **Przeładowaniu** (oddajesz $8$ z sumy) i przenosi $1$ do kolejnej kolumny.

**Przykład ($37_8 + 25_8$):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="Suma 3 + 2 = 5, plus 1 z przeładowania z prawej kolumny daje 6. To mieści się w naszym liczniku ($< 8$), więc nie ma kolejnego przeładowania.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="7 + 5 = 12. Suma wykracza poza licznik (maks 7). Oddajesz z sumy jedno pełne przeładowanie (-8), co pozostawia Ci cyfrę 4 w wyniku. Powstało przeładowanie licznika, więc przenosisz 1 w lewo.">←</span> |
| :--- | :---: | :---: |
| **Składnik A** | $3$ | $7$ |
| **Składnik B** | $2$ | $5$ |
| **Wynik** | **$6$** | **$4$** |

Analiza kolumn (od prawej):
- **Jedności**: $7 + 5 = 12$. Ponieważ to więcej niż pomieści licznik: oddajemy $8$ za jedno pełne przeładowanie. Wynik to $12 - 8 = 4$. **Przeładowanie (1)** idzie do kolumny po lewej.
- **Ósemki**: $3 + 2 + 1_{\text{przeładowanie}} = 6$. Ponieważ $6 < 8$, brak kolejnego przeładowania.

Wynik: $64_8$ (sprawdzenie: $31_{10} + 21_{10} = 52_{10}$ = $64_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>
</data-gate>

### ➖ Odejmowanie Ósemkowe

System wykorzystuje **Regułę Niwelowania i Cofania**. Różnica względem układu dziesiętnego polega tylko na tym, że po cofnięciu licznik staje na pozycji **$7$**.

**Przykład ($52_8 - 37_8$):**

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Tu stoisz by operować 5 - 3. Sprawdzasz jednak, że na Twoim obiekcie spoczywa dług 1 wleczony z przeskoku prawej krawędzi. Spłacasz go na starcie pomniejszając górny stan (5 - 1 = 4). Zostajesz z przeliczoną jednością 4. Z czystym kątem na zrzuconej 4 rozliczasz bazowe zadanie przez odjemnik - więc na sam koniec odejmujesz widniejące niżej 3 (4 - 3). Notujesz finalny opad warty 1. Koniec zmartwień o generowanie nadmiernych obciążeń dla sąsiadów z lewej.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Tu od mniejszej cyfry odciągasz 7. Większe od mniejszego u podstawy, więc musi nastąpić ujęcie długu wprawionego w środowisku lewym (lewy sąsiad przejmuje na siebie próg 1 długu wyrównawczego). Zaciągnąwszy u niego pożyczkę bezkarnie cofasz u bazy swój licznik. Określamy w głowie realny wymiar długu niwelując do zera wspólną część (ujemne 7 uszczuplone po spłaceniu górnym 2 to zadłużenie dające 5 długu). Sam bezwarunkowy akt obracania licznika wstecz poniżej bariery 0 na próg maksymalny systemu (czyli cyfrę 7) niweluje i spłaca automatyczną część z całego wygenerowanego długu za to przewrócenie (dług zostaje uszczuplony 5 - 1 = 4). Pamiętając o zadłużeniu 4 zdejmujesz je z wymiaru spoczywającego na cofniętym obwodzie (7), tak po ściągnięciu (7 - 4) zostaje legalnie odzyskana i wpisana cyfra o wariancie 3. W lewą drogę wysłany został jeden proces długu.">✅</span> |
| :--- | :---: | :---: |
| **Odjemna** | $5$ | $2$ |
| **Odjemnik** | $3$ | $7$ |
| **Wynik** | **$1$** | **$3$** |

Analiza kolumn (od prawej):
- **Jedności**: $2 - 7$. **Niwelujemy** nasze $2$, co zostawia nam *$5$ długu*. Ratujemy się pożyczką, więc sąsiad bierze $1$ na swój rachunek, co z kolei pozwala nam cofnąć licznik pod zero na pozycję **$7$**. Przewrót ten kosztuje nas zawsze $1$ długu. Reszta długu wynosi więc $5 - 1 = 4$. Od aktualnej pozycji licznika ($7$) odejmujemy te $4$. Wynik: _**$3$**_.
- **Ósemki**: Masz na liczniku $5$, ale wisi na Tobie dług z tytułu pożyczki ($1$). Spłacasz go: $5 - 1 = 4$. Teraz na czysto od tego $4$ odejmujesz docelowe $3$. Wynik: _**$1$**_.

Wynik: $13_8$ (sprawdzenie: $42_{10} - 31_{10} = 11_{10}$ = $13_8$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="8" operation="-"></data-arithmetic-challenge>
</data-gate>

### 🛡️ Symulator Ósemkowy

Przetestuj dowolne operacje. Zwróć uwagę, jak carry i borrow zachowują się z progiem 8:

<data-binary-arithmetic base="8" digits="6" u2="false"></data-binary-arithmetic>

### ✖️ Mnożenie Ósemkowe

Mnożenie w każdym systemie to proces sumowania wielokrotności liczby oraz poślizgu w lewo (Shift) o pozycję cyfry. Gdy operacji mnożenia podlega zestaw cyfr ($0-7$), należy pilnować momentów przeładowań dla potęgi $8$. 

**Przykład ($25_8 \cdot 14_8$):**
Mnożymy dokładnie tak, jak pod kreską w systemie dziesiętnym, decydując jedynie ile pełnych "pudełek z 8 elementami" możemy spakować.

**Krok 1:** Mnożenie przez pozycję jedności ($4$)
- $4 \cdot 5 = 20_{(decymalnie)}$. Dzieląc to przez limit $8$, mamy $2$ pełne ósemki i pozostaje nam reszta $4$. Przeładowanie (carry) = $2$. Wynik zapisu: **4**.
- $4 \cdot 2 = 8_{(dec)}$. Dodajemy zapisany przelew z poprzedniej pozycji ($+2$). Suma to $10_{(dec)}$.
- $10_{(dec)} \div 8$ = $1$ pełna ósemka i $2$ reszty. Przeładowanie (carry) = $1$. Wynik zapisu: **2**.
- Wynik I cyklu: **$124_8$**

**Krok 2:** Mnożenie przez pozycję ósemek ($1$) + obowiązkowe Puste Przesunięcie (Shift by 1)
- Ogon uzupełniamy o $0$.
- $1 \cdot 5 = 5_{(dec)}$. Poniżej 8, brak paczki. Przeładowanie = 0.
- $1 \cdot 2 = 2_{(dec)}$.
- Wynik II cyklu: **$250_8$**

**Krok 3:** Dodawanie Ósemkowe pod kreską:

|| | | |
|---|---|---|---|
| | $1$ | $2$ | $4$ |
| + | $2$ | $5$ | $0$ |
|<hr>|<hr>|<hr>|<hr>|
| | **$3$** | **$7$** | **$4_8$**|

$( 25_8 \cdot 14_8 = 374_8 \rightarrow 21_{10} \cdot 12_{10} = 252_{10})$

### ➗ Dzielenie Ósemkowe

Dzielenie to procedura "przymierzania mniejszego pudełka do większego", identycznie jak badanie Reguły Przewagi w arytmetyce Binarnej.

**Przykład ($124_8 \div 4_8$):**
- Bierzemy głowę liczby `1` - czwórka się nie mieści (wynik 0). 
- Bierzemy `12_8` do przymiarki. Skoro to ósemki, musisz pamiętać, że `12_8` odpowiada wymiarze dziesiętnemu $1 \cdot 8^1 + 2 = 10_{(10)}$. Ile wpadów `4` zmieścisz w wartości matematycznej 10? Zmieścisz dokładnie dwa rzuty ($2 \cdot 4 = 8_8$).
- Zapisujesz **$2$** jako pierwszą cześć wyniku podzielenia. 
- Odejmujesz: `12_8` - $8_8$. Według zasad cofania z odejmowania: spadek o dwie pozycje w dół. Reszta to `2`.
- Zrzucasz kolejną cyfrę wiersza z góry (`4`) i stykasz do reszty: Przymierzasz dzielnik `4` do liczby `24_8`.
- Wersja matematyczna tej wartości to $2 \cdot 8 + 4 = 20_{(10)}$. Wartość 20 na matematyce mieści `4` perfekcyjnie równe 5 razy ($4 \cdot 5 = 20_{10}$). Twoje dzielenie dziesiętne zamyka wynik resztą u zera, więc konwertujesz wyłowione równe wycinki. Zapisujesz ostatecznie jako dół wyniku: **$5$**.
- Otrzymujesz poprawny wymiar końcowy cykli 1 i 2 -> Wynikiem jest cyfra $2$, potem dopisano $5$: **$25_8$**. To ten sam przypadek co w powyższym mnożeniu!

## 💎 System Szesnastkowy (Hexadecimal)

System szesnastkowy to **absolutny król informatyki**. Znajdziesz go wszędzie: kody kolorów CSS (`#FF5733`), adresy pamięci, instrukcje procesora, hashe kryptograficzne. Ma 16 cyfr: `0-9` oraz `A-F`.

| Znak Hex | A | B | C | D | E | F |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Wartość** | 10 | 11 | 12 | 13 | 14 | 15 |

Jeden znak Hex to **dokładnie 4 bity** (nibble). Dwie cyfry = pełny bajt:
- `00` = $0$, `FF` = $255$, `7F` = $127$

### ➕ Dodawanie Szesnastkowe

Licznik w Hex mieści wartości od $0$ do $15$ (`F`). Gdy suma dobije do $16$, licznik robi pełne **Przeładowanie** i przenosi zsumowane $16$ bajtów jako $1$ do starszej kolumny.

**Przykład ($3A_{16} + 2F_{16}$):**

| Przeniesienie | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="3 + 2 = 5, doliczamy punkt przeładowania z prawej i mamy 6. Wynik spokojnie mieści się w liczniku.">$1$</span> | <span style="color: var(--task-italic-color);font-size: 20px;display: block;height: 30px;" title="A(10) + F(15) = 25. Zdecydowanie przekracza pojemność licznika (maks 15). Koszt pełnego przeładowania to -16 bajtów, zostaje Ci 9! Przenosisz 1 w lewo.">←</span> |
| :--- | :---: | :---: |
| **Składnik A** | $3$ | $A$ |
| **Składnik B** | $2$ | $F$ |
| **Wynik** | **$6$** | **$9$** |

Analiza kolumn (od prawej):
- **Jedności**: $A (10) + F (15) = 25$. Pożera to całkowitą pojemność licznika, więc oddajemy $16$ za jedno pełne **przeładowanie**. W wyniku zostaje reszta: $25 - 16 = 9$. Ślemy **1** do sąsiada.
- **Szesnastki**: $3 + 2 + 1_{\text{przeładowanie}} = 6$. Brak kolejnego przeładowania.

Wynik: $69_{16}$ (sprawdzenie: $58_{10} + 47_{10} = 105_{10}$ = $69_{16}$ ✅)

> [!TIP]
> Gdy litery Cię mylą, po prostu zamień je na wartości dziesiętne ($A=10, B=11...$), wykonaj operację i zamień wynik z powrotem na Hex. Uważaj, by nie popełnić błędu przy cofaniu!

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>
</data-gate>

### ➖ Odejmowanie Szesnastkowe

System operuje dokładnie tą samą logiką powszechną. Jedyna subtelność polega na tym, że po cofnięciu pod 0, licznik ląduje na maksymalnej pozycji: **$F (15)$**.

**Przykład ($B3_{16} - 4E_{16}$):**

| Stan długu | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Operujesz bieżącym zakresem pierwszej kolumny z lewej strony, gdzie od rzędu B (czyli równego w matematyce dziesiętnej 11) odejmowane bazowo będzie cyfra 4. Zobacz jednak precyzyjnie jak z prawej trasy ugięć wkroczył wcześniej doliczony próg do wyrównania (wędrujący dług kwoty 1 po sąsiedzku). Dysponowane przez Ciebie i gotowe z góry 11 naturalnie spłaca twój nieskończony ciąg wymiarów dziesiętnych o wartość jeden i staje się w tym kroku wyzerowanym z zaległości układem naturalnym stojącym na punkcie wymiary 10 (co literowo utożsamia się w powłoce szesnastek literą A). Jesteś czysty przed zapożyczeniami z obwodu prawego i lewego, więc czas przeprowadzić operację pierwotnie bazową. Z punktu 10 zrzucasz w dół do odjęcia podane u spodu dolne 4 jedności, a matematyczny obrachunek owocuje natywną i czystą cyrkulacją wymiaru: u dołu zapisujesz wynikającą na poczet bazy 6, nie wymuszając przy tym dodatkowej awarii zadłużeń.">❌</span> | <span style="color: var(--task-italic-bold-color);font-size:20px;display:block;height:30px;" title="Dokonujesz bezceremonialnego odjęcia potężnej u progu litery E (wartości w systemie natywnym: 14) od ułomnego u dołu, górnego składnika 3. Wobec deficytu wymuszasz roszadę i generujesz jawny ciężar długu względem lewego sąsiada w postaci kwoty jeden (lekką ręką oddalając wymogi długu u lewej strefy modułu). Rozliczamy ten zawiły problem do wyrównania oceniając wytyczne - niwelujesz wspólną część dozwolonej wartości trójki i oszacowujesz, że ze skali bazy po odliczeniu owych posiadanych trzech sztuk zaległość spada i wynosi aktualnie wycinek o masie 11 na zaciągnięty rosnący układ. Z racji, że wziąłeś dług z lewej strony, wolno ci dokonać przeskoku pętli: cofasz bębny pod spód progu u zera twardo osadzając na maksymalnym punkcie domeny F (w rozliczeniu to punktu równy 15). Fakt samego cofnięcia jest nagradzany - pętla pochłania część zadłużenia mianowicie jeden element, zbijając Twój zaległy wymiar ze zdania na pułap natywnych 10. Przeprowadzenie tej części operacji wymusza zdjęcie zadziwiających zaległości: od punktu licznika (litera F = 15) ubywamy spłacając to pozostałe opóźnienie w kwocie 10. Cykliczny obrót 15 - 10 zrzuca 5, więc zapisujemy i pozostawiamy rozwiązanie 5 na tym ujętym module, wynosząc próg jednego pożądanego długu do uregulowania obok.">✅</span> |
| :--- | :---: | :---: |
| **Odjemna** | $B$ | $3$ |
| **Odjemnik** | $4$ | $E$ |
| **Wynik** | **$6$** | **$5$** |

Analiza kolumn (od prawej):
- **Jedności**: $3 - E (14)$. **Niwelujemy** skromne $3$, co zostawia nam koszmarne *$11$ długu*. Wymmuszamy pożyczkę od sąsiada na lewo (sąsiad łapie $1$ długu). To ratuje nas prawem cofnięcia licznika na maksymalną pozycję **$15$**, ale ten przewrót kosztuje nas odpis z długu ($1$). Z $11$ robi się resztka $10$ długu. Odejmujemy resztę od stanu licznika ($15 - 10$) i w wyniku ląduje urocze _**$5$**_.
- **Szesnastki**: Na starcie masz $B (11)$, ale wisisz sąsiadowi ten 1 punkt długu za pożyczkę: $11 - 1 = 10 (A)$. Jesteśmy na czysto jako czyste dziesięć, od którego odejmujemy dolną pozycję: $10 - 4 = 6$. Zostaje _**$6$**_.

Wynik: $65_{16}$ (sprawdzenie: $179_{10} - 78_{10} = 101_{10}$ = $65_{16}$ ✅)

---

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>
</data-gate>

### 🛡️ Symulator Szesnastkowy

Poczuj się jak programista niskopoziomowy. 4 cyfry Hex = idealnie 16 bitów ($16^4 = 2^{16}$):

<data-binary-arithmetic base="16" digits="4" u2="false"></data-binary-arithmetic>

> [!TIP]
> Spójrz na elegancję: każda cyfra Hex odpowiada dokładnie 4 bitom (półbajtowi). Ta matematyczna czystość sprawiła, że Hex wyparł Octal w nowoczesnym programowaniu.

### ✖️ Mnożenie i ➗ Dzielenie Szesnastkowe

System operacji pozostaje ten sam co we wszystkich innych - różnicą są tu wymiar potęg na przeładowania (mod 16 - carry overflow).

**Mnożenie przykładowe ($2A_{16} \cdot B_{16}$)**
Przeliczając litery na stan liczbowy w głowie: Mnożysz $42_{(10)} \cdot 11_{(10)} = 462_{(10)}$.

**Jak się to odbywa manualnie?**
Bierzesz pierwszą część ($B \cdot A$): Wartość to $11 \cdot 10 = 110$ w Dec. 
Dzielisz na paczki Szesnastki: Co składa się w limitze paczek szesnastnicy? Mieścisz tam równo 6 szesnastek ($6 \cdot 16 = 96$). 
Reszta zostająca do zapisu to $14$ - więc zapisujesz literę bazową Hex: **`E`**. Pamiętasz że pod "skrzydłami z boku" wisi paczka 6 pudeł z carry.

Druga fraza to ($B \cdot 2$): $11 \cdot 2 = 22$. 
Doklejasz z puli te zapamiętałe na boku 6 pudeł sumy: $22 + 6 = 28$.
$28$ w limitach pudełek 16 to zaledwie jedno pudełko całej wielkości, z resztkami $12_{(10)}$. Resztka z $12$ to znak **`C`**. 
Przebicie za pełne jedno pudełko zsuwasz w dół jako finalny opusz: **`1`**.
Wynikiem tej partii dodawaniowo-mnożniczej było zatem złożone rozwiązanie bitowe: **`1CE`**

Dzielenie ułamkowe odbywa się dosłownie tą samą zrzutową regułą słupków. Dopasowujesz pozycję (Head i Ogon) największym możliwym mnożnikiem dopasowanym o maskę wartościową z zachowaniem rzeki - wiersz za wierszem ściągając na dół po szczeplach operacyjnych reszt. 

W informatyce i przy tak masowych systemowych rozlokowywaniach - procesory nie operują z zębatek Hexadecymalnych – dekompresują te zapytania na rejestry natychmiastowe Bitów jako poślizgi mnożnicze. Przesunięcie i Suma (Shift and Sum). Wynika to z zasady elegancji i oszczędności nanosekund architektury hardware, na której wszystko i wszyscy stoją.

## 🏁 Wielki Finał: Wyzwania Arytmetyczne

Pokaż, że potrafisz liczyć w obu systemach. Pamiętaj: próg carry to **8** w OCT i **16** w HEX!

<data-gate>
  <data-arithmetic-challenge base="8" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Ósemkowe dodawanie opanowane! 🎱

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="8" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Pożyczanie ósemkowe nie ma przed Tobą tajemnic! 💪

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Hex dodawanie? Dziecinna igraszka! 💎

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="16" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Świat niskopoziomowych operacji stoi przed Tobą otworem! 👑

</data-gate>


---

# 🧩 Kodowanie Znaków: ASCII i Matrix

Wiesz już, jak procesor liczy, jak radzi sobie z minusami i jak operuje w różnych systemach liczbowych. Ale komputer wyświetla litery, emoji i filmy. Jak to możliwe? Odpowiedź brzmi: **Mapowanie** – każdy znak to po prostu **liczba** przypisana do symbolu.

---

## 🚪 Brama Konwersji: Oct i Hex

Zanim pójdziemy dalej, sprawdźmy Twoje umiejętności szybkiego przełączania się między systemami. Rozwiąż te dwa zamki, aby odblokować lekcję o znakach.

<data-gate>
  <data-number-system target="16, 47, 9, 19" base="8" digits="3">
    > [!NOTE]
    > To jest system ósemkowy. Aby uzyskać $16_{10}$, musisz wpisać $20_8$ ($2 \cdot 8 = 16$).
  </data-number-system>
</data-gate>

---

<data-gate>
  <data-number-system target="23, 13, 10, 25" base="16" digits="2">
    > [!NOTE]
    > To jest system szesnastkowy. Podpowiedź: $2 \cdot 16 = 32$. Ile brakuje do $47$? Brakuje $15$. A $15$ w Hex to... ?
  </data-number-system>
</data-gate>

---

## 📜 Tablica ASCII

Informatycy po prostu umówili się, że konkretna liczba oznacza konkretny znak. Ten standard nazywa się **ASCII** (American Standard Code for Information Interchange). Podstawowa tablica ma 7 bitów (128 znaków), ale my używamy wersji 8-bitowej (1 Bajt = 256 znaków).

### Znaki sterujące (0-31)

Pierwsze 32 pozycje to **niewidoczne znaki sterujące** - sygnały dla maszyn, nie dla ludzi:

| Dec | Hex | Nazwa | Co robi? |
| :---: | :---: | :--- | :--- |
| 0 | `00` | `NUL` | Pusty bajt – koniec tekstu w C/C++ |
| 9 | `09` | `TAB` | Tabulacja (wcięcie) |
| 10 | `0A` | `LF` | Nowa linia (Linux/Mac) |
| 13 | `0D` | `CR` | Powrót karetki (Windows: CR+LF) |
| 27 | `1B` | `ESC` | Escape – kolory w terminalu |

> [!TIP]
> Dlaczego Windows używa dwóch znaków na nową linię (`\r\n` = CR+LF), a Linux jednego (`\n` = LF)? To spadek po maszynach do pisania – "Carriage Return" cofał głowicę, "Line Feed" przesuwał papier.

### Znaki drukowalne (32-126)

| Zakres | Dec | Hex | Znaki | Wzorzec |
| :--- | :---: | :---: | :--- | :--- |
| Spacja | 32 | `20` | ` ` |  |
| Cyfry | 48-57 | `30`-`39` | `0`-`9` | Wartość = Dec $-\text{ }48$ |
| Wielkie litery | 65-90 | `41`-`5A` | `A`-`Z` | 26 liter po kolei |
| Małe litery | 97-122 | `61`-`7A` | `a`-`z` | 26 liter po kolei |
| Znaki specjalne | reszta | reszta | `!`, `@`, `#`, `+`, `=`... | Interpunkcja i operatory |

**Pełna tabela najważniejszych znaków:**

| Znak | Dec | Bin | Hex |
| :---: | :---: | :---: | :---: |
| Spacja | 32 | `0010 0000` | `20` |
| `0` | 48 | `0011 0000` | `30` |
| `9` | 57 | `0011 1001` | `39` |
| **A** | 65 | `0100 0001` | `41` |
| **B** | 66 | `0100 0010` | `42` |
| **Z** | 90 | `0101 1010` | `5A` |
| **a** | 97 | `0110 0001` | `61` |
| **b** | 98 | `0110 0010` | `62` |
| **z** | 122 | `0111 1010` | `7A` |

---

## 🕵️ Wzorce Bitowe: Ukryte Reguły

Tablica ASCII nie jest losowa - kryje w sobie eleganckie wzorce bitowe:

### Bit 5: Wielka vs Mała litera

Zauważ, że wielkie **A** ($65$) i małe **a** ($97$) różnią się dokładnie o **$32$**. A $32 = 2^5$, czyli **jeden bit**:

| Litera | Dec | Bin |
| :---: | :---: | :---: |
| **A** | 65 | `0`**`1`**`00 0001` |
| **a** | 97 | `0`**`1`**`10 0001` |

**Bit nr 5** (licząc od $0$ z prawej) działa jak **przełącznik wielkości**:
- Bit 5 = `0` - wielka litera
- Bit 5 = `1` - mała litera

> [!IMPORTANT]
> To nie przypadek! Projektanci ASCII celowo tak ułożyli tablicę, aby zamiana wielkości litery wymagała zmiany **jednego bita**. Procesor robi to jedną instrukcją XOR.

### Cyfry: Zamaskowane wartości

Cyfra `0` ma kod $48$ (`0011 0000`), a `9` ma $57$ (`0011 1001`). Aby uzyskać wartość liczbową cyfry, wystarczy **zamaskować górne 4 bity** (ustawić na `0000`):

| Znak | Bin | Dolne 4 bity | Wartość |
| :---: | :---: | :---: | :---: |
| `0` | `0011` **`0000`** | `0000` | $0$ |
| `5` | `0011` **`0101`** | `0101` | $5$ |
| `9` | `0011` **`1001`** | `1001` | $9$ |

---

## 🕶️ Czytanie Matrixa

Kiedy patrzysz na kod binarny lub szesnastkowy, Twój mózg może zacząć widzieć ukryte słowa. Spróbuj:

<data-gate>
  <data-quiz>
    <question>
Otrzymałeś od serwera ciąg bajtów w systemie szesnastkowym: `42 41 42 41`. Korzystając z powyższej tabelki ASCII, jakie słowo wyświetli komputer?
    </question>
    <options>
      <option correct>BABA</option>
      <option>ABBA</option>
      <option>AAAA</option>
    </options>
    <div data-hint="error">
      Spójrz na tabelkę: `41` (Hex) to 'A', a `42` (Hex) to 'B'. Teraz po prostu przeczytaj te cztery bajty po kolei.
    </div>
  </data-quiz>
</data-gate>

---

<data-gate>
  <data-quiz>
    <question>
Bajt `0100 1000` w ASCII to litera 'H'. Jaki bajt reprezentuje małe 'h'?
    </question>
    <options>
      <option correct>`0110 1000`</option>
      <option>`0100 1001`</option>
      <option>`1100 1000`</option>
    </options>
    <div data-hint="error">
      Przypomnij sobie regułę bitu $5$: aby zamienić wielką literę na małą, ustaw bit $5$ (szósty od prawej) na $1$. `0100 1000` → `0110 1000`.
    </div>
    <div data-hint="success">
      Brawo! Zmiana jednego bita - to właśnie elegancja projektowania ASCII. 🎯
    </div>
  </data-quiz>
</data-gate>

---

## 🗣️ Profesjonalny żargon: Prefixy

Na koniec nauczymy się, jak profesjonaliści zapisują systemy w kodzie, aby się nie pomylić. Zamiast pisać "10 w systemie szesnastkowym", używamy **Przedrostków (Prefixów)**:

| System | Prefix | Przykład | Wartość |
| :--- | :---: | :--- | :---: |
| Binarny | `0b` | `0b10` | $2$ |
| ósemkowy | `0o` | `0o10` | $8$ |
| Szesnastkowy | `0x` | `0x10` | $16$ |

> [!TIP]
> Zapamiętaj `0x`. To najczęstszy zapis w programowaniu, oznaczający system szesnastkowy.

---

## 🌐 Co dalej? Unicode i UTF-8

ASCII obsługuje tylko **128 znaków** - wystarczy dla angielskiego, ale co z polskimi `ą, ć, ę`? Japońskimi kanji? Emoji 🚀?

Standard **Unicode** przypisał numery **ponad 150 000 znakom** ze wszystkich języków świata. A **UTF-8** to sprytny sposób ich kodowania:

| Zakres znaków | Bajty | Przykład |
| :--- | :---: | :--- |
| ASCII (0-127) | 1 bajt | `A` = `0x41` |
| Polskie znaki | 2 bajty | `ą` = `0xC4 0x85` |
| Emoji | 4 bajty | 🎮 = `0xF0 0x9F 0x8E 0xAE` |

> [!NOTE]
> UTF-8 jest **wstecznie kompatybilny** z ASCII - każdy plik ASCII jest jednocześnie poprawnym plikiem UTF-8. To dlatego UTF-8 zdominował internet (ponad 98% stron).

## 📋 Pełne Tabele Kodowania (Ściąga)

<details>
<summary><b>Rozwiń: Zestawienie Podstawowe ASCII (0-127)</b></summary>
Poniżej znajdziesz pocięte dla czytelności bloki całkowitych, oficjalnych znaków natywnych komputerów przyporządkowanych od wartości 0 do 127.

<details>
<summary>Znaki Sterujące (0 - 31)</summary>
Niewidoczne komendy służące historycznie do sterowania dalekopisami i formowaniem druku.

| DEC | HEX | Skrót | Znaczenie |
|---|---|---|---|
| 0 | 00 | NUL | Znak pusty (Null) |
| 1 | 01 | SOH | Początek nagłówka |
| 2 | 02 | STX | Początek tekstu |
| 3 | 03 | ETX | Koniec tekstu |
| 4 | 04 | EOT | Koniec transmisji |
| 5 | 05 | ENQ | Zapytanie |
| 6 | 06 | ACK | Potwierdzenie |
| 7 | 07 | BEL | Dzwonek (Sygnał dźwiękowy) |
| 8 | 08 | BS | Backspace (Cofnięcie) |
| 9 | 09 | HT | Tabulacja pozioma |
| 10 | 0A | LF | Znak nowej linii (Line Feed) |
| 11 | 0B | VT | Tabulacja pionowa |
| 12 | 0C | FF | Nowa strona (Form Feed) |
| 13 | 0D | CR | Powrót karetki (Carriage Return) |
| 14 | 0E | SO | Przesunięcie wyjścia (Shift Out) |
| 15 | 0F | SI | Przesunięcie wejścia (Shift In) |
| 16 | 10 | DLE | Ucieczka łącza danych (Data Link Escape) |
| 17 | 11 | DC1 | Sterowanie urządzeniem 1 (XON) |
| 18 | 12 | DC2 | Sterowanie urządzeniem 2 |
| 19 | 13 | DC3 | Sterowanie urządzeniem 3 (XOFF) |
| 20 | 14 | DC4 | Sterowanie urządzeniem 4 |
| 21 | 15 | NAK | Negatywne potwierdzenie |
| 22 | 16 | SYN | Oczekiwanie synchroniczne |
| 23 | 17 | ETB | Koniec bloku transmisji |
| 24 | 18 | CAN | Anuluj |
| 25 | 19 | EM | Koniec nośnika |
| 26 | 1A | SUB | Zastąpienie |
| 27 | 1B | ESC | Escape (Ucieczka) |
| 28 | 1C | FS | Separator pliku |
| 29 | 1D | GS | Separator grupy |
| 30 | 1E | RS | Separator rekordu |
| 31 | 1F | US | Separator jednostki |
| 127 | 7F | DEL | Usuń (Delete) |
</details>

<details>
<summary>Znaki Specjalne i Interpunkcja</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 32 | 20 | | Spacja |
| 33 | 21 | ! | Wykrzyknik |
| 34 | 22 | " | Cudzysłów |
| 35 | 23 | # | Hashtag (Krzyżyk) |
| 36 | 24 | $ | Znak dolara |
| 37 | 25 | % | Znak procentu |
| 38 | 26 | & | Ampersand (And) |
| 39 | 27 | ' | Apostrof |
| 40 | 28 | ( | Nawias okrągły otwierający |
| 41 | 29 | ) | Nawias okrągły zamykający |
| 42 | 2A | * | Gwiazdka |
| 43 | 2B | + | Znak plus |
| 44 | 2C | , | Przecinek |
| 45 | 2D | - | Łącznik (Minus) |
| 46 | 2E | . | Kropka |
| 47 | 2F | / | Ukośnik (Slash) |
| 58 | 3A | : | Dwukropek |
| 59 | 3B | ; | Średnik |
| 60 | 3C | < | Znak mniejszości |
| 61 | 3D | = | Znak równości |
| 62 | 3E | > | Znak większości |
| 63 | 3F | ? | Znak zapytania |
| 64 | 40 | @ | Małpa (At) |
| 91 | 5B | [ | Nawias kwadratowy otwierający |
| 92 | 5C | \ | Ukośnik odwrotny (Backslash) |
| 93 | 5D | ] | Nawias kwadratowy zamykający |
| 94 | 5E | ^ | Daszek (Potęga) |
| 95 | 5F | _ | Podkreślenie |
| 96 | 60 | ` | Akcent słaby (Backtick) |
| 123 | 7B | { | Nawias klamrowy otwierający |
| 124 | 7C | \| | Pionowa kreska (Pipe) |
| 125 | 7D | } | Nawias klamrowy zamykający |
| 126 | 7E | ~ | Tylda |
</details>

<details>
<summary>Cyfry (48 - 57)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 48 | 30 | 0 | Cyfra Zero |
| 49 | 31 | 1 | Cyfra Jeden |
| 50 | 32 | 2 | Cyfra Dwa |
| 51 | 33 | 3 | Cyfra Trzy |
| 52 | 34 | 4 | Cyfra Cztery |
| 53 | 35 | 5 | Cyfra Pięć |
| 54 | 36 | 6 | Cyfra Sześć |
| 55 | 37 | 7 | Cyfra Siedem |
| 56 | 38 | 8 | Cyfra Osiem |
| 57 | 39 | 9 | Cyfra Dziewięć |
</details>

<details>
<summary>Litery Wielkie (65 - 90)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 65 | 41 | A | Wielka litera A |
| 66 | 42 | B | Wielka litera B |
| 67 | 43 | C | Wielka litera C |
| 68 | 44 | D | Wielka litera D |
| 69 | 45 | E | Wielka litera E |
| 70 | 46 | F | Wielka litera F |
| 71 | 47 | G | Wielka litera G |
| 72 | 48 | H | Wielka litera H |
| 73 | 49 | I | Wielka litera I |
| 74 | 4A | J | Wielka litera J |
| 75 | 4B | K | Wielka litera K |
| 76 | 4C | L | Wielka litera L |
| 77 | 4D | M | Wielka litera M |
| 78 | 4E | N | Wielka litera N |
| 79 | 4F | O | Wielka litera O |
| 80 | 50 | P | Wielka litera P |
| 81 | 51 | Q | Wielka litera Q |
| 82 | 52 | R | Wielka litera R |
| 83 | 53 | S | Wielka litera S |
| 84 | 54 | T | Wielka litera T |
| 85 | 55 | U | Wielka litera U |
| 86 | 56 | V | Wielka litera V |
| 87 | 57 | W | Wielka litera W |
| 88 | 58 | X | Wielka litera X |
| 89 | 59 | Y | Wielka litera Y |
| 90 | 5A | Z | Wielka litera Z |
</details>

<details>
<summary>Litery Małe (97 - 122)</summary>

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 97 | 61 | a | Mała litera a |
| 98 | 62 | b | Mała litera b |
| 99 | 63 | c | Mała litera c |
| 100 | 64 | d | Mała litera d |
| 101 | 65 | e | Mała litera e |
| 102 | 66 | f | Mała litera f |
| 103 | 67 | g | Mała litera g |
| 104 | 68 | h | Mała litera h |
| 105 | 69 | i | Mała litera i |
| 106 | 6A | j | Mała litera j |
| 107 | 6B | k | Mała litera k |
| 108 | 6C | l | Mała litera l |
| 109 | 6D | m | Mała litera m |
| 110 | 6E | n | Mała litera n |
| 111 | 6F | o | Mała litera o |
| 112 | 70 | p | Mała litera p |
| 113 | 71 | q | Mała litera q |
| 114 | 72 | r | Mała litera r |
| 115 | 73 | s | Mała litera s |
| 116 | 74 | t | Mała litera t |
| 117 | 75 | u | Mała litera u |
| 118 | 76 | v | Mała litera v |
| 119 | 77 | w | Mała litera w |
| 120 | 78 | x | Mała litera x |
| 121 | 79 | y | Mała litera y |
| 122 | 7A | z | Mała litera z |
</details>
</details>

<details>
<summary><b>Rozwiń: Zestawienie Polskie (Windows-1250)</b></summary>
Zestawienie tzw. polskich ogonków rozszerzenia tabeli ASCII. 

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 165 | A5 | Ą | Wielka litera A z ogonkiem |
| 185 | B9 | ą | Mała litera a z ogonkiem |
| 198 | C6 | Ć | Wielka litera C z kreską (akcentem ostrym) |
| 230 | E6 | ć | Mała litera c z kreską |
| 202 | CA | Ę | Wielka litera E z ogonkiem |
| 234 | EA | ę | Mała litera e z ogonkiem |
| 163 | A3 | Ł | Wielka litera L z przekreśleniem |
| 179 | B3 | ł | Mała litera l z przekreśleniem |
| 209 | D1 | Ń | Wielka litera N z kreską |
| 241 | F1 | ń | Mała litera n z kreską |
| 211 | D3 | Ó | Wielka litera O z kreską |
| 243 | F3 | ó | Mała litera o z kreską |
| 140 | 8C | Ś | Wielka litera S z kreską |
| 156 | 9C | ś | Mała litera s z kreską |
| 143 | 8F | Ź | Wielka litera Z z kreską |
| 159 | 9F | ź | Mała litera z z kreską |
| 175 | AF | Ż | Wielka litera Z z kropką |
| 191 | BF | ż | Mała litera z z kropką |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Niemieckie (Iso / UTF-8)</b></summary>
Umlauty (przegłosy) i specjalna ligatura używane w języku niemieckim.

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 196 | C4 | Ä | Wielkie A z umlautem (przegłosem) |
| 228 | E4 | ä | Małe a z umlautem |
| 214 | D6 | Ö | Wielkie O z umlautem |
| 246 | F6 | ö | Małe o z umlautem |
| 220 | DC | Ü | Wielkie U z umlautem |
| 252 | FC | ü | Małe u z umlautem |
| 223 | DF | ß | Mała litera Eszett (ostre S) |
| 7838 | 1E9E | ẞ | Wielka litera Eszett (dodana w normie znacznie później) |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Hiszpańskie (Iso / UTF-8)</b></summary>
Znaki akcentowane oraz odwrócona interpunkcja specyficzne dla j. Hiszpańskiego.

| DEC | HEX | Znak | Opis |
|---|---|:---:|---|
| 193 | C1 | Á | Wielka litera A z akcentem |
| 225 | E1 | á | Mała litera a z akcentem |
| 201 | C9 | É | Wielka litera E z akcentem |
| 233 | E9 | é | Mała litera e z akcentem |
| 205 | CD | Í | Wielka litera I z akcentem |
| 237 | ED | í | Mała litera i z akcentem |
| 211 | D3 | Ó | Wielka litera O z akcentem |
| 243 | F3 | ó | Mała litera o z akcentem |
| 218 | DA | Ú | Wielka litera U z akcentem |
| 250 | FA | ú | Mała litera u z akcentem |
| 209 | D1 | Ñ | Wielka litera N z tyldą |
| 241 | F1 | ñ | Mała litera n z tyldą |
| 161 | A1 | ¡ | Odwrócony wykrzyknik |
| 191 | BF | ¿ | Odwrócony znak zapytania |
</details>

<details>
<summary><b>Rozwiń: Zestawienie Japońskie Hiragana / Kanji (Unicode UTF-8)</b></summary>
Skromny wycinek znaków japońskich jako ciekawostka udowadniająca ogromną rozpiętość standardu UTF-8, używanego by móc pokazać każdy alfabet świata na Twoim ekranie używając wielobajtowego zapisu.

| DEC | HEX | Znak | Opis (Romaji) | Typ |
|---|---|:---:|---|---|
| 12354 | 3042 | あ | Litera *A* | Hiragana |
| 12356 | 3044 | い | Litera *I* | Hiragana |
| 12358 | 3046 | う | Litera *U* | Hiragana |
| 12360 | 3048 | え | Litera *E* | Hiragana |
| 12362 | 304A | お | Litera *O* | Hiragana |
| 12363 | 304B | か | Znak *Ka* | Hiragana |
| 12365 | 304D | き | Znak *Ki* | Hiragana |
| 12367 | 304F | く | Znak *Ku* | Hiragana |
| 26085 | 65E5 | 日 | *Dzień / Słońce* (Nichi) | Kanji |
| 26412 | 672C | 本 | *Książka / Korzeń* (Hon) | Kanji |
| 20154 | 4EBA | 人 | *Człowiek* (Hito) | Kanji |
| 26408 | 6728 | 木 | *Drzewo* (Ki) | Kanji |
| 35211 | 898B | 見 | *Widzieć* (Mi) | Kanji |
| 27700 | 6C34 | 水 | *Woda* (Mizu) | Kanji |
| 28779 | 706B | 火 | *Ogień* (Hi) | Kanji |
</details>

<data-ascii-converter></data-ascii-converter>

---

# 🏆 Wielki Finał: Wyzwania Mistrza Bitów

Przeszedłeś przez dwa moduły. Poznałeś systemy liczbowe, bity, bajty, arytmetykę binarną, liczby ujemne, kodowanie znaków i wiele więcej. Czas sprawdzić, czy naprawdę to **czujesz** — nie jako teorię, ale jako narzędzie.

Każde wyzwanie poniżej to **brama**. Otrzymasz tylko powierzchowne podpowiedzi. Żadnego „zgadywania w nieskończoność". Albo wiesz, albo wracasz do lekcji.&nbsp;😈

---

## 🎨 Wyzwanie 1: Kolory w Matrixie

<data-gate>
  <data-quiz>
    <question>
Grafik przysyła Ci kolor CSS: `#FF8800`. Ile dziesiętnie wynosi składowa Zielona (Green) tego koloru? Pamiętaj: format to `#RRGGBB`.
    </question>
    <options>
      <option>255</option>
      <option correct>136</option>
      <option>0</option>
      <option>88</option>
    </options>
    <div data-hint="error">
      Znajdź które znaki hex odpowiadają zielonemu, a potem użyj wag:  
      pierwszy znak $\cdot 16^{\text{waga}}$ + drugi znak $\cdot 16^{\text{waga}}$.  
      Wagi to indexy bitów. Pamietasz jak to było w binarce? Wagi $2^3, 2^2, 2^1, 2^0$. 
    </div>
    <div data-hint="success">
      Właśnie dekodowałeś kolor jak prawdziwy frontend developer! 🎨 Każdy kolor CSS to trzy bajty Hex — Red, Green, Blue. Teraz gdy zobaczysz `#FF8800` w kodzie, od razu wiesz, że to pomarańczowy z pełnym czerwonym, 136/255 zielonym i zerowym niebieskim. To wiedza, którą używa się **codziennie** w web developmencie! 🌐
    </div>
  </data-quiz>
</data-gate>

## 🔢 Wyzwanie 2: Indeksowanie od Zera

<data-gate>
  <data-quiz>
    <question>
Programista mówi: „Element jest na indeksie $3$". Który to element **po kolei** w tablicy, jeśli indeksowanie zaczyna się od $0$?
    </question>
    <options>
      <option>Trzeci</option>
      <option correct>Czwarty</option>
      <option>Piąty</option>
    </options>
    <div data-hint="error">
      Indeksy zaczynają się od $0$! Indeks $0$ = pierwszy, indeks $1$ = drugi, indeks $2$ = trzeci, indeks $3$ = ...?
    </div>
    <div data-hint="success">
      Bingo! 🎯 Indeksowanie od zera to fundament CAŁEGO programowania. Tablice, stringi, piksele na ekranie — wszystko startuje od $0$. Właśnie dlatego uczyłeś się pozycji bitów od $0$ w mnożeniu i dzieleniu. To ta sama koncepcja! To jeden z tych momentów, gdzie „binarny fundament" staje się „programistycznym nawykiem". 🧠
    </div>
  </data-quiz>
</data-gate>

## 🔓 Wyzwanie 3: Uprawnienia Linuxa

<data-gate>
  <data-quiz>
    <question>
Pamietasz że w systemie Linux komenda `chmod` ustawia uprawnienia.  
Liczba $7_8$ w systemie ósemkowym to binarnie `111`. Ile uprawnień (Read, Write, Execute) daje wartość $7_8$?
    </question>
    <options>
      <option>Tylko 1 — pełny dostęp</option>
      <option>2 — odczyt i zapis</option>
      <option correct>3 — wszystkie: odczyt, zapis i wykonanie</option>
    </options>
    <div data-hint="error">
      Każdy bit to jedno uprawnienie: `1` = tak, `0` = nie.  
      Trzy pozycje to po kolei: **R**ead, **W**rite, e**X**ecute. 
    </div>
    <div data-hint="success">
      Tak jest! `rwx` = `111` = $7_8$. Teraz rozumiesz, dlaczego administratorzy serwerów mówią „daj mu 755" — to skrót binarny zapisany w systemie ósemkowym! 🐧 Właściciel dostaje `7` (rwx), grupa `5` (r-x), reszta `5` (r-x). Eleganckie, prawda?
    </div>
  </data-quiz>
</data-gate>

## 🕶️ Wyzwanie 4: Czytanie Matrixa

<data-gate>
  <data-quiz>
    <question>
Przechwycono transmisję sieciową. Oto bajty w Hex: `48 45 4C 4C 4F`.  
Korzystając z poniższych fragmentów z tablicy ASCII, co widzisz?  
[ `4C`=_**L**_, `4F`=_**O**_, `43`=_**C**_, `48`=_**H**_, `45`=_**E**_  ]
    </question>
    <options>
      <option>HELL</option>
      <option correct>HELLO</option>
      <option>HELP</option>
    </options>
    <div data-hint="error">
      Skorzystaj z tablicy ASCII podanej w pytaniu. Każdy bajt Hex to jeden znak. Policz ile masz bajtów i przetłumacz je po kolei.
    </div>
    <div data-hint="success">
      Widzisz Matrixa! 🕶️ To dokładnie tak działają narzędzia do analizy pakietów sieciowych (Wireshark), debuggery i hex edytory. Programiści i hakerzy czytają surowe bajty na co dzień. Ty właśnie dołączyłeś do tego klubu! 💻🔥
    </div>
  </data-quiz>
</data-gate>

## 🧮 Wyzwanie 5: Potęga Dwójki

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Binarny jak zegarek! ⏱️ Czy wiesz, że ten sam mechanizm wag, którego właśnie użyłeś, jest w **każdym przetwornikowi ADC** w mikrofonach, kamerach i czujnikach? Twój telefon zamienia dźwięk na bity dokładnie tą metodą. 🎤➡️🔢

  </data-number-system>
</data-gate>

## ➕ Wyzwanie 6: Arytmetyka Pod Presją

<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Dodawanie binarne to serce procesora! ⚡ Dosłownie **każda** operacja w komputerze (nawet wyświetlanie tej strony) sprowadza się do miliardów takich dodawań na sekundę. Właśnie wykonałeś ręcznie to, co CPU robi 4 miliardy razy na sekundę. Szacun! 🦾

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Fun fact: procesor nie ma osobnego układu do odejmowania! Zamienia odjemnik na U2 (Invert + 1) i... dodaje. Tak, Twoje odejmowanie to tak naprawdę sprytne dodawanie. Mind = blown 🤯

</data-gate>

## 💎 Wyzwanie 7: Hex Jak Zawodowiec

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Hex dodawanie? W jednej ręce! 💎 Gdy będziesz debugował crash dump, analizował firmware mikrokontrolera, albo ręcznie edytował bajty pliku w hex edytorze — ta umiejętność będzie Twoim supermocą. 🦸

</data-gate>

## 🌑 Wyzwanie 8: Notacja U2

<data-gate>
  <data-quiz>
    <question>
W 8-bitowym systemie U2 ciąg `1000 0000` reprezentuje:
    </question>
    <options>
      <option>128</option>
      <option correct>-128</option>
      <option>-1</option>
      <option>0</option>
    </options>
    <div data-hint="error">
      W U2 najbardziej lewy bit ma wagę **ujemną**. Tutaj tylko jeden bit jest zapalony.  
      Pomyśl który to i jaką ma wartość dziesiętnie?
    </div>
    <div data-hint="success">
      System U2 nie ma dla Ciebie tajemnic!🎓
    </div>
  </data-quiz>
</data-gate>

---

## 🎓 Certyfikat Mistrza Bitów

**Gratulacje!** 🎉🎊🏆

Właśnie udowodniłeś, że rozumiesz **fundamenty informatyki** — nie na pamięć, ale mechanicznie. Wiesz, jak procesor liczy, jak zapisuje minus, jak kolory stają się bajtami i jak surowe dane zamieniają się w tekst.

To wiedza, która **nie starzeje się**. Języki programowania przychodzą i odchodzą, frameworki zmieniają się co sezon, ale bity, bajty i systemy liczbowe pozostają **niezmienne od 70 lat**.

### Co umiesz?

| Umiejętność | Gdzie to wykorzystasz? |
| :--- | :--- |
| Konwersje systemów (Bin/Oct/Hex) | Debugowanie, analiza pakietów, low-level programming |
| Arytmetyka binarna (+, −, ×, ÷) | Rozumienie CPU, optymalizacja, algorytmy |
| System U2 (liczby ujemne) | Typy danych w C/C++/Java, overflow bugs |
| Arytmetyka Oct/Hex | Uprawnienia Linux, kody kolorów, adresy pamięci |
| ASCII i kodowanie znaków | Przetwarzanie tekstu, protokoły sieciowe, kryptografia |
| Potęgi dwójki i zakresy | Projektowanie baz danych, alokacja pamięci |

### Dokąd dalej? 🗺️

Twoje binarne fundamenty otwierają **wszystkie ścieżki** w informatyce:

- 🖥️ **Systemy i Sprzęt** — jak procesor wykonuje instrukcje
- 🌐 **Sieci** — jak dane podróżują przez internet
- 🎮 **Programowanie** — Desktop, Web, Gaming, Embedded
- 🎨 **Grafika** — 2D i 3D, shadery, rendering
- 🔒 **Cyberbezpieczeństwo** — kryptografia, reverse engineering
- ⚙️ **DevOps** — automatyzacja, konteneryzacja, CI/CD

**Wybierz swoją ścieżkę!** 🚀

---
