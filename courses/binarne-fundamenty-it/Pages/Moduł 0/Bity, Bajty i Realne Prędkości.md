# Bity, bajty i realne prędkości

Pojedynczy bit to najmniejsza jednostka informacji: przyjmuje stan $0$ (brak ładunku / stan niski) albo $1$ (obecność ładunku / stan wysoki). Komórki pamięci można zobrazować wytłaczanką na jajka - każde gniazdo przechowuje dokładnie jeden bit informacji zależnie od tego, czy fizycznie znajduje się w nim element:

![Wytłaczanka jako analogia komórek pamięci: obecność elementu oznacza stan 1, puste gniazdo oznacza 0](/public/courses/binarne-fundamenty-it/Images/jajka.jpg)

W architekturze komputerowej pojedynczy bit rzadko występuje samodzielnie. Podstawową adresowalną porcją danych jest **bajt ($1\text{ B}$), który składa się z ośmiu bitów ($8\text{ b}$)**.

---

## 📦 Proporcja 1 do 8: znaczenie wielkości litery

Wielkość litery w skrócie jednostki określa jej typ:
- **$b$ (mała litera)** = **bit**. Określa przepustowość łączy sieciowych i magistral transmisyjnych (np. światłowód $800\text{ Mb/s}$).
- **$B$ (wielka litera)** = **bajt** ($8$ bitów). Określa rozmiar plików, nośników danych i pamięci RAM (np. plik $100\text{ MB}$).

### ⚡ Przepustowość łącza a prędkość pobierania

Dostawcy internetu podają przepustowość w megabitach na sekundę ($Mb/s$). Aplikacje pobierające pliki (np. przeglądarka, Steam) prezentują prędkość w megabajtach na sekundę ($MB/s$).

Dzieląc wartość łącza przez $8$, otrzymujemy maksymalną teoretyczną prędkość transferu (w warunkach idealnych, bez uwzględnienia narzutu protokołów i opóźnień sieci):

$$\text{Maksymalny transfer teoretyczny} = \frac{800\text{ Mb/s}}{8} = \mathbf{100\text{ MB/s}}$$

Gdy w aplikacji widzisz pobieranie $50\text{ MB/s}$, to Twoje łącze przesyła $50 \times 8 = \mathbf{400\text{ Mb/s}}$ danych.

---

## 💾 Zagadka pojemności dysków: standard SI a IEC

Po zakupie pendrive'a o pojemności $64\text{ GB}$ system Windows wyświetla jedynie $57.2\text{ GB}$ dostępnego miejsca:

![Pendrive SanDisk 64 GB i okna właściwości w Windows 11](/public/courses/binarne-fundamenty-it/Images/sandisk-64GB.png)

Rozbieżność ta wynika ze stosowania dwóch różnych układów miar:
1. **Standard dziesiętny SI (producenci dysków)**: potęgi tysiąca ($10^3$):
   $1\text{ GB} = 10^9\text{ bajtów} = 1\ 000\ 000\ 000\text{ bajtów}$.
  > **SI**: *System Internacional* - System międzynarodowy jednostek miar

2. **Standard dwójkowy IEC (systemy operacyjne)**: potęgi liczby $1024$ ($2^{10}$):
   $1\text{ GiB} = 1024^3\text{ bajtów} = 1\ 073\ 741\ 824\text{ bajty}$.
  > **IEC**: *International Electrotechnical Commission* - Międzynarodowa Komisja Elektrotechniczna

Gdy nominalne $64\ 000\ 000\ 000$ bajtów podzielimy przez $1024^3$, otrzymujemy $59.6\text{ GiB}$. Po odliczeniu przestrzeni zarezerwowanej na tablicę partycji i system plików (np. exFAT) dla użytkownika zostaje dokładnie **$57.2\text{ GiB}$** (czyta się: **pięćdziesiąt siedem i dwie dziesiąte _gibibajta_**). Windows wyświetla tę wartość ze skrótem „GB” (czyta się: _Gigabajt_), co wprowadza wrażenie utraty pamięci.

### Różnice w prezentacji pojemności:

<data-tabs>
<tabs><b>Pendrive 64 GB w Windows</b><b>Pendrive 64 GB w Linux / macOS</b><b>Dysk 1 TB (1000 GB vs 931 GiB)</b></tabs>
<div>

W systemie Windows:
- System przelicza bajty dwójkowo, dzieląc przez $1024^3$.
- Realna pojemność użytkowa po sformatowaniu wynosi ok. $57.2\text{ GiB}$.
- Interfejs podpisuje wynik jako „GB”, mieszając miarę dwójkową z symbolem dziesiętnym.

</div>
<div>

W systemach Ubuntu oraz macOS:
- Nowoczesne menedżery plików przeliczają pojemność dziesiętnie przez $1000^3$.
- Ten sam pendrive jest wyświetlany w systemie jako **$62\text{ GB}$** (z uwzględnieniem miejsca zajętego przez system plików).
- W konsoli Linuksa polecenie `df -H` podaje miarę dziesiętną ($62\text{ G}$), a polecenie `lsblk` miarę dwójkową ($57.3\text{ G}$).

</div>
<div>

W przypadku dysku o pojemności $1\text{ TB}$:
- Producent dostarcza $1\ 000\ 000\ 000\ 000$ bajtów ($10^{12}$).
- Dzielenie przez $1024^3$ (zamiana na GiB) daje: $\frac{10^{12}}{1073741824} \approx \mathbf{931.3\text{ GiB}}$.
- Różnica wynosi niemal $69\text{ GB}$, co stanowi około $7\%$ nominalnej pojemności nośnika.

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Skąd wynika podział na świat potęg dwójki (1024) i dziesiątki (1000)?</span>
<span class="deep-dive-badge">ARCHITEKTURA & FIZYKA</span>
</summary>
<div class="deep-dive-content">

Rozbieżność między przedrostkami kilo ($1000$) a kibi ($1024$) wynika ze zderzenia dwóch odmiennych domen inżynierii sprzętowej:

| Cecha konstrukcyjna      | Domena przestrzenna (RAM i Rejestry)                                                                    | Domena czasowa (Sieć i Telekomunikacja)                                                                   |
| :----------------------- | :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Fizyczny obiekt**      | Krzemowa macierz wierszy i kolumn                                                                       | Przewód miedziany, światłowód, fala radiowa                                                               |
| **Mechanizm wyboru**     | $N$ fizycznych linii adresowych magistrali                                                              | Ciągły strumień impulsów taktowany w czasie                                                               |
| **Standard jednostek**   | **IEC** ($2^{10} = 1024$)                                                                               | **SI** ($10^3 = 1000$)                                                                                    |
| **Dlaczego taka baza?**  | $10$ linii binarnych daje dokładnie $1024$ stany. Obcięcie do $1000$ marnowałoby $24$ adresy w krzemie. | Zegar kwarcowy taktuje w hercach: $1\text{ GHz} = 10^9$ taktów na sekundę (fizyczna sekunda z układu SI). |
| **Jednostki w praktyce** | $\text{KiB}, \text{MiB}, \text{GiB}$ (np. pamięć RAM $16\text{ GiB}$)                                   | $\text{kb/s}, \text{Mb/s}, \text{Gb/s}$ (np. światłowód $1\text{ Gb/s} = 10^9\text{ b/s}$)                |

Skąd wziął się ten konflikt w praktyce?

**1. Zapożyczenie przedrostka przez programistów (lata 60. i 70.)**

W architekturze pamięci RAM każda kolejna linia adresowa podwaja dostępną przestrzeń. Dziesięć linii daje $2^{10} = 1024$ komórki. Ponieważ liczba $1024$ była bliska $1000$, pierwsi inżynierowie zapożyczyli grecki przedrostek *kilo-* ze standardu metrycznego. Wtedy błąd wynosił zaledwie $2.4\%$, więc nikomu to nie przeszkadzało. Dopiero przy gigabajtach różnica urosła do ponad $7\%$, a przy terabajtach do prawie $10\%$.

**2. Dlaczego producenci dysków nie przeszli na potęgi dwójki?**

Talerz dysku HDD czy nośnik SSD nie mają binarnej siatki adresowej magistrali procesora. Dane zapisuje się w ciągłych sektorach. Zgodnie z międzynarodowym układem miar SI przedrostek *giga-* oznacza dokładnie $10^9$. Ponadto dla producenta oznacza to wymierną oszczędność: wyprodukowanie dysku $1\text{ TB}$ ($10^{12}$ bajtów) wymaga o niemal **$100\text{ GB}$ mniej fizycznego nośnika** niż dostarczenie $1\text{ TiB}$ ($1024^4$ bajtów).

**3. Dlaczego Windows wciąż pisze „GB”, dzieląc przez 1024?**

W pierwszych procesorach x86 dzielenie przez $1024$ wykonywało się natychmiast za pomocą przesunięcia bitowego w rejestrze (`>> 10`), podczas gdy dzielenie przez $1000$ wymagało kosztownej operacji arytmetycznej. Całe jądro MS-DOS i wczesnego Windowsa oparto na potęgach dwójki. 

Gdy organizacja IEC w 1998 roku uregulowała nazewnictwo i wprowadziła przedrostki dwójkowe (*kibi*, *mebi*, *gibi*), Microsoft zdecydował się ich nie wprowadzać, aby zachować zgodność ze starym API i nie dezorientować użytkowników. Inne systemy poszły inną drogą: macOS od wersji 10.6 przelicza pojemności dziesiętnie, a Linux w narzędziach systemowych jawnie rozróżnia miary **GB** od **GiB**.

</div>
</details>

---

## 🔒 Weryfikacja: Przeliczenia przepustowości i pojemności

<data-gate>
  <data-connection-matcher title="Przeliczenia Przepustowości i Pojemności">
    <item left="Rozmiar $1\text{ B}$ ($1$ bajt)" right="Dokładnie $8\text{ b}$ ($8$ bitów)"></item>
    <item left="Łącze światłowodowe $800\text{ Mb/s}$" right="Maksymalnie $100\text{ MB/s}$ transferu ($800 / 8$)"></item>
    <item left="Łącze światłowodowe $1\text{ Gb/s}$ ($1000\text{ Mb/s}$)" right="Maksymalnie $125\text{ MB/s}$ transferu ($1000 / 8$)"></item>
    <item left="Pobieranie $50\text{ MB/s}$ w aplikacji" right="Obciążenie łącza rzędu $400\text{ Mb/s}$ ($50 \times 8$)"></item>
  </data-connection-matcher>
</data-gate>

---

## 🧪 Laboratorium: symulator prędkości transferu

<data-gate>
  <data-transfer-speed></data-transfer-speed>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Jeden bajt ($1\text{ B}$) składa się dokładnie z $8$ bitów ($8\text{ b}$).
- Przepustowość sieci podaje się w bitach na sekundę ($Mb/s$), natomiast transfer w aplikacjach w bajtach na sekundę ($MB/s$).
- Przelicznik $1\text{ B} = 8\text{ b}$ wyznacza maksymalną teoretyczną prędkość pobierania ($Mb/s \div 8 = MB/s$).
- Różnica między nominalną a wyświetlaną pojemnością dysków wynika ze zderzenia przedrostków dziesiętnych SI ($1000$) z dwójkowymi IEC ($1024$) oraz narzutu systemu plików.
