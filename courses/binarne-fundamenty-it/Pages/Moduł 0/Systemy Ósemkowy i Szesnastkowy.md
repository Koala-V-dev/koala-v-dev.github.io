# Systemy ósemkowy i szesnastkowy

Zapis binarny jest naturalnym formatem pracy układów cyfrowych, lecz ciągi wielu bitów (np. `11111111`) są trudne do szybkiego odczytu i weryfikacji przez człowieka. Z tego względu w inżynierii oprogramowania stosuje się dwa skrócone formaty bazujące na grupowaniu bitów:
- **Paczka 3-bitowa ($2^3 = 8$)** $\to$ jedna cyfra w **systemie ósemkowym** (*oktalnym*).
- **Paczka 4-bitowa ($2^4 = 16$)** $\to$ jeden znak w **systemie szesnastkowym** (*heksadecymalnym* / _**HEX**_).

---

## 8️⃣ System ósemkowy (oktalny) - paczki 3-bitowe

W systemie ósemkowym operujemy cyframi od **$0$ do $7$**. Każda cyfra ósemkowa odpowiada dokładnie **trzem bitom** o lokalnych wagach **_$4, 2, 1$_**.

Grupowanie wykonujemy od prawej strony do lewej (od najmłodszego bitu do najstarszego):

<data-binary-process mode="grouping" base="8" target="53"></data-binary-process>

#### Kroki powyższego procesu:
1. **Grupa 1 (najmłodsze bity, po prawej)**: Bity `[1 0 1]`. Sumujemy aktywne wagi: $1 \cdot 4 + 0 \cdot 2 + 1 \cdot 1 = 5$.
2. **Grupa 2 (kolejne bity w lewo)**: Bity `[1 1 0]`. Sumujemy aktywne wagi: $1 \cdot 4 + 1 \cdot 2 + 0 \cdot 1 = 6$.
3. **Wynik**: Zestawienie odczytanych cyfr daje liczbę _**$65_8$**_.

### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Dopełnienie zerem</b><b>Odwrotność: OCT na BIN</b><b>Uprawnienia w standardzie POSIX</b></tabs>
<div>

Gdy łączna liczba bitów nie dzieli się przez $3$ (np. `11010`), lewa skrajna grupa jest niepełna. Uzupełniamy ją zerami wiodącymi:
- Zapis początkowy: `11010` (5 bitów)
- Po dopełnieniu: `011 010` (6 bitów w dwóch pełnych trójkach)
- Prawa grupa: `010` $\to 0 \cdot 4 + 1 \cdot 2 + 0 \cdot 1 = 2$
- Lewa grupa: `011` $\to 0 \cdot 4 + 1 \cdot 2 + 1 \cdot 1 = 3$
- Wynik: $32_8$.

</div>
<div>

Każdą cyfrę ósemkową rozpisujemy na 3 bity:
- Konwersja liczby $73_8$ na zapis binarny:
- Cyfra $7$ $\to$ wagi $4+2+1$ $\to$ `111`.
- Cyfra $3$ $\to$ wagi $2+1$ $\to$ `011` (pozycja wagi 4 otrzymuje zero).
- Połączenie obu grup daje ciąg $111011_2$.

</div>
<div>

W systemach uniksowych polecenie `chmod 755 plik.txt` stosuje zapis ósemkowy. Każda z trzech cyfr reprezentuje uprawnienia dla kolejno: właściciela, grupy oraz pozostałych użytkowników.

Poszczególne bity odpowiadają wagom:
- **$r$ (read / odczyt)** = waga $4$ (`100`)
- **$w$ (write / zapis)** = waga $2$ (`010`)
- **$x$ (execute / wykonanie)** = waga $1$ (`001`)

Złożenie wag tworzy cyfrę ósemkową:
- `7` ($4+2+1$) $\to$ prawa `rwx` (odczyt, zapis i wykonanie).
- `5` ($4+0+1$) $\to$ prawa `r-x` (odczyt oraz wykonanie bez zapisu).
Wartość `755` oznacza pełne uprawnienia właściciela (`7`) oraz prawo odczytu i uruchamiania dla grupy i pozostałych (`55`).

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Sprawdzanie uprawnień w standardzie POSIX i C</span>
<span class="deep-dive-badge">POSIX & C</span>
</summary>
<div class="deep-dive-content">

<p>W standardzie POSIX (m.in. jądro Linux) uprawnienia pliku w strukturze i-węzła (<code>inode-&gt;i_mode</code>) są przechowywane jako 16-bitowa liczba całkowita. Stałe uprawnień w nagłówku <code>&lt;sys/stat.h&gt;</code> definiuje się w zapisie ósemkowym:</p>

```c
// Nagłówek <sys/stat.h> - stałe w zapisie ósemkowym:
#define S_IRUSR 00400  // Odczyt właściciela (Read USR)
#define S_IWUSR 00200  // Zapis właściciela (Write USR)
#define S_IXUSR 00100  // Wykonanie właściciela (eXecute USR)

#define S_IRGRP 00040  // Odczyt grupy (Read GRP)
#define S_IROTH 00004  // Odczyt pozostałych (Read OTH)
```

<p><strong>1. Co oznacza nazwa stałej <code>S_IRUSR</code>?</strong></p>
<ul>
  <li><code>S_</code> = <strong>S</strong>tat (funkcja i struktura <code>struct stat</code> odczytująca stan pliku).</li>
  <li><code>I</code> = <strong>I</strong>node (i-węzeł przechowujący metadane pliku w systemie plików).</li>
  <li><code>R</code> / <code>W</code> / <code>X</code> = <strong>R</strong>ead (odczyt), <strong>W</strong>rite (zapis), e<strong>X</strong>ecute (wykonanie).</li>
  <li><code>USR</code> / <code>GRP</code> / <code>OTH</code> = <strong>USR</strong> (właściciel), <strong>GRP</strong> (grupa), <strong>OTH</strong> (pozostali użytkownicy).</li>
</ul>

<p><strong>2. Dlaczego literał ma 5 cyfr i dlaczego odczyt właściciela to pozycja trzecia (<code>00400</code>)?</strong></p>
<p>W języku C prefiks <code>0</code> oznacza zapis ósemkowy. Każde 3 bity tworzą jedną cyfrę ósemkową o lokalnych wagach <code>4, 2, 1</code> (co odpowiada dokładnie prawom <code>r, w, x</code>):</p>

```text
 0      0           4            0          0
 |      |           |            |          |
 |      |           |            |          +---> INNI (OTH)       : prawa rwx innych użytkowników
 |      |           |            +--------------> GRUPA (GRP)      : prawa rwx grupy
 |      |           +---------------------------> WŁAŚCICIEL (USR) : prawa rwx właściciela
 |      +---------------------------------------> BITY SPECJALNE   : SUID (4), SGID (2), Sticky (1)
 +----------------------------------------------> PREFIKS JĘZYKA C : informuje kompilator o bazie 8
```

<p>Ponieważ trójka bitów właściciela (USR) znajduje się na trzeciej pozycji od prawej strony, to właśnie na tej pozycji umieszcza się wagę uprawnienia:</p>
<ul>
  <li>waga <strong>4</strong> (bit odczytu <code>r</code>, binarnie <code>100</code>) $\to$ <code>00400</code>,</li>
  <li>waga <strong>2</strong> (bit zapisu <code>w</code>, binarnie <code>010</code>) $\to$ <code>00200</code>,</li>
  <li>waga <strong>1</strong> (bit wykonania <code>x</code>, binarnie <code>001</code>) $\to$ <code>00100</code>.</li>
</ul>

<p><strong>3. Czym są bity specjalne (SUID, SGID, Sticky bit)?</strong></p>
<p>Druga cyfra od lewej (czwarta od prawej) obsługuje uprawnienia specjalne. Podobnie jak prawa <code>rwx</code>, korzysta ona z lokalnych wag <strong>$4, 2, 1$</strong>:</p>
<ul>
  <li><strong>SUID (Set User ID) - waga $4$ (<code>04000</code>):</strong> proces uruchamia się z uprawnieniami właściciela pliku (zazwyczaj <code>root</code>), a nie użytkownika, który go wywołał. Klasyczny przykład: polecenie <code>/usr/bin/passwd</code> musi zapisać nowe hasło do chronionego pliku <code>/etc/shadow</code>, więc wykonuje się tymczasowo jako root.</li>
  <li><strong>SGID (Set Group ID) - waga $2$ (<code>02000</code>):</strong> dla katalogów sprawia, że wszystkie nowo utworzone pliki automatycznie dziedziczą grupę tego katalogu, ułatwiając pracę zespołową we wspólnych folderach.</li>
  <li><strong>Sticky bit - waga $1$ (<code>01000</code>):</strong> w katalogu ze sticky bitem (np. <code>/tmp</code> z prawami <code>1777</code>) każdy może tworzyć pliki, ale usunąć dany plik może <strong>wyłącznie jego właściciel</strong> lub root. Zapobiega to kasowaniu cudzych danych we wspólnych katalogach.</li>
</ul>
<p>Gdy plik nie wymaga praw specjalnych (dotyczy to zdecydowanej większości plików), ta pozycja wynosi <code>0</code> (stąd zapis <code>00755</code>).</p>

<p><strong>4. Jak procesor weryfikuje uprawnienie za pomocą operatora <code>&amp;</code> (AND)?</strong></p>

```c
// Weryfikacja prawa odczytu dla właściciela pliku:
if (inode->i_mode & S_IRUSR) {
    // Dostęp do odczytu przyznany
}
```

<p>Załóżmy, że plik ma uprawnienia <code>755</code> (w zapisie ósemkowym <code>00755</code>). Sprawdzenie prawa odczytu właściciela polega na bitowym iloczynie:</p>

```text
  inode->i_mode:    00755 (ósemkowo) = ... 111 101 101 (binarnie)
& S_IRUSR:         00400 (ósemkowo) = ... 100 000 000 (binarnie)
-----------------------------------------------------------------
  wynik:           00400 (ósemkowo) = ... 100 000 000 (niezerowy -> prawda)
```

<p>Operator <code>&amp;</code> zeruje wszystkie bity oprócz bitu badanego przez maskę. Jeśli badany bit w uprawnieniach wynosi 1, wynik jest niezerowy i warunek <code>if</code> zostaje spełniony.</p>

<p>Model uprawnień oparty na oktetach <code>rwx</code> dotyczy systemów zgodnych z POSIX (m.in. Linux, macOS). System Windows NT korzysta z list kontroli dostępu (ACL - <em>Access Control Lists</em>), w których prawa definiuje się per identyfikator bezpieczeństwa (SID) użytkownika.</p>

</div>
</details>

### 🧪 Trening: Przeliczanie na system ósemkowy

Ustaw cyfry ósemkowe ($0-7$) na odpowiednich pozycjach wag ($64, 8, 1$), aby uzyskać wylosowaną wartość dziesiętną:

<data-gate>
  <data-number-system target="27,35,43,51,59" base="8" digits="3">

> [!TIP]
> Dla wartości poniżej $64$ najstarsza pozycja ($8^2 = 64$) wynosi $0$. Podziel liczbę całkowicie przez $8$, aby wyznaczyć cyfrę ósemek ($8^1$), a reszta z dzielenia trafi na pozycję jednostek ($8^0 = 1$).

  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system target="83,111,157,219,305" base="8" digits="3">

> [!TIP]
> Wyznacz liczbę pełnych $64$ (waga $8^2$), następnie z pozostałej części wyznacz liczbę ósemek (waga $8^1$), a resztę końcową wpisz na pozycji jednostek ($8^0 = 1$).

  </data-number-system>
</data-gate>

---

## 🧮 System szesnastkowy (HEX) - paczki 4-bitowe (nibble)

System szesnastkowy opiera się na bazie $16 = 2^4$. Jedna cyfra szesnastkowa odpowiada dokładnie **czterem bitom** (półbajt, ang. *nibble*). Dwa znaki szesnastkowe opisują dokładnie jeden bajt ($8$ bitów, od `00` do `FF`).

Zbiór symboli obejmuje cyfry od $0$ do $9$ oraz litery od $A$ do $F$:

|        Znak HEX        |  `A`   |  `B`   |  `C`   |  `D`   |  `E`   |  `F`   |
| :--------------------: | :----: | :----: | :----: | :----: | :----: | :----: |
|   Wartość dziesiętna   |  $10$  |  $11$  |  $12$  |  $13$  |  $14$  |  $15$  |
| Zapis binarny (4 bity) | `1010` | `1011` | `1100` | `1101` | `1110` | `1111` |

Każda czwórka bitów ma lokalne wagi pozycji: **_$8, 4, 2, 1$_**.

<data-binary-process mode="grouping" base="16" target="163"></data-binary-process>

#### Kroki powyższego procesu:
1. **Grupa 1 (najmłodsze bity, po prawej)**: Bity `[0 0 1 1]`. Sumujemy aktywne wagi: $0 \cdot 8 + 0 \cdot 4 + 1 \cdot 2 + 1 \cdot 1 = 3$.
2. **Grupa 2 (starsze bity, po lewej)**: Bity `[1 0 1 0]`. Sumujemy aktywne wagi: $1 \cdot 8 + 0 \cdot 4 + 1 \cdot 2 + 0 \cdot 1 = 10 \to \text{A}$.
3. **Wynik**: Zestawienie odczytanych znaków daje liczbę _**$\text{A3}_{16}$**_.

### Inne przykłady i przypadki:

<data-tabs>
<tabs><b>Kolory RGB w HEX</b><b>Adresy pamięci w C++</b><b>Rozwijanie potęgowe</b></tabs>
<div>

W standardzie barw RGB piksel składa się z trzech składowych: czerwonej (<span class="color-box"><span class="R">R</span></span>), zielonej (<span class="color-box"><span class="G">G</span></span>) i niebieskiej (<span class="color-box"><span class="B">B</span></span>). Intensywność każdej składowej mieści się w przedziale od $0$ do $255$ ($1$ bajt = $8$ bitów).

Dwa znaki HEX opisują dokładnie jeden bajt danej składowej:
- Czysta czerwień: `#FF0000` $\to$ Czerwień: `FF` ($255$), Zieleń: `00` ($0$), Błękit: `00` ($0$).
- Kolor biały: `#FFFFFF` $\to$ wszystkie składowe maksymalne ($255, 255, 255$).
- Kolor czarny: `#000000` $\to$ wszystkie składowe wygaszone ($0, 0, 0$).

Zapis szesnastkowy pozwala przedstawić $24$ bity koloru w zwięzłym ciągu $6$ znaków.

</div>
<div>

W językach C i C++ adresy komórek pamięci RAM prezentowane są w postaci szesnastkowej:

```cpp
#include <iostream>

int main() {
    int x = 42;
    std::cout << &x; // np. 0x7ffd5e2a
    return 0;
}
```

Operator `&` pobiera adres fizyczny zmiennej `x` w pamięci RAM. Prefiks `0x` informuje o notacji szesnastkowej. Ponieważ architektura pamięci operuje na bajtach, a każdy bajt to dokładnie dwie cyfry szesnastkowe, zapis HEX odzwierciedla granice bajtów i słów maszynowych bez zbędnych przeliczeń.

</div>
<div>

Konwersję z systemu szesnastkowego na dziesiętny bez rozpisywania na bity wykonujemy przez sumowanie iloczynów cyfr i potęg liczby 16 ($16^0 = 1$, $16^1 = 16$, $16^2 = 256$):

Przeliczenie liczby $\text{1A}_{16}$:
- Pozycja 0 (waga $16^0 = 1$): znak $\text{A}$ ($10_{10}$) $\to 10 \cdot 1 = 10$
- Pozycja 1 (waga $16^1 = 16$): znak $1$ $\to 1 \cdot 16 = 16$
- Suma: $16 + 10 = 26_{10}$.

</div>
</data-tabs>

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Pakowanie koloru RGBA do 32-bitowego rejestru</span>
<span class="deep-dive-badge">C++ & PAMIĘĆ GRAFIKI</span>
</summary>
<div class="deep-dive-content">

W silnikach graficznych i pamięci wideo kolor pojedynczego piksela jest przechowywany w jednej 32-bitowej liczbie (`uint32_t`, czyli $4$ bajty).

Rejestr ten dzieli się na $4$ równe przedziały po $8$ bitów: trzy na kolor bazowy (<span class="color-box"><span class="R">R</span><span class="G">G</span><span class="B">B</span></span>) oraz jeden na przezroczystość (Alpha - <span class="color-box"><span class="A">A</span></span>):


<table>
<tr> 
  <td>Bity w rejestrze:</td><td align="center">[ 31 .. 24 ] </td><td align="center">[ 23 .. 16 ]</td><td align="center">[ 15 .. 8 ]</td><td align="center">[ 7 .. 0 ]</td>
</tr>
<tr> 
  <td>Kanały:</td><td align="center"><span class="color-box"><span class="R">R</span></span></td><td align="center"><span class="color-box"><span class="G">G</span></span></td><td align="center"><span class="color-box"><span class="B">B</span></span></td><td align="center"><span class="color-box"><span class="A">A</span></span></td>
</tr>
<tr> 
  <td>Wartość HEX:</td><td align="center">0xFF</td><td align="center">0x00</td><td align="center">0xFF</td><td align="center">0xFF</td>
</tr>
<tr> 
  <td>Złożony piksel:</td><td align="center" colspan="4">0xFF00FFFF</td>
</tr>
</table>


Ponieważ każda składowa koloru mieści się w zakresie od $0$ do $255$, w zapisie szesnastkowym odpowiadają jej **dokładnie dwie cyfry HEX** (jeden bajt).

W kodzie C/C++ sklejanie czterech bajtów w jedno słowo 32-bitowe realizuje prosta operacja bitowa:

```cpp
uint32_t packRGBA(uint32_t r, uint32_t g, uint32_t b, uint32_t a) {
    return (r << 24) | (g << 16) | (b << 8) | a;
}

// Kolor fioletowy: R=255 (0xFF), G=0 (0x00), B=255 (0xFF), Alpha=255 (0xFF)
uint32_t pixel = packRGBA(0xFF, 0x00, 0xFF, 0xFF); // Wynik: 0xFF00FFFF
```

Co dokładnie robią te symbole bitowe?

- `<<` to **operator przesunięcia bitowego w lewo** (w tym kontekście nie ma nic wspólnego z wypisywaniem do konsoli przez `std::cout`). Przesuwa bity danej składowej w lewo na jej docelowe miejsce w rejestrze:
  - `r << 24` przesuwa bajt czerwieni o 24 bity w lewo, na pozycje $31-24$.
  - `g << 16` przesuwa bajt zieleni o 16 bitów w lewo, na pozycje $23-16$.
  - `b << 8` przesuwa bajt błękitu o 8 bitów w lewo, na pozycje $15-8$.
  - `a` nie jest przesuwane i pozostaje na najmłodszych pozycjach $7-0$.

- `|` to **bramka OR (bitowa suma)**. Łączy przygotowane bajty w jedną całość. Ponieważ każdy kolor zajmuje inny fragment rejestru, a pozostałe jego bity są zerami, operacja `|` składa je w jedno 32-bitowe słowo bez wzajemnego nadpisywania.

Dzięki temu zamiast przesyłać do karty graficznej $4$ osobne zmienne, procesor wysyła jedno 32-bitowe słowo maszynowe wprost do bufora klatki.

</div>
</details>

---

### 🧪 Trening: Przeliczanie na system szesnastkowy

Ustaw znaki szesnastkowe ($0-\text{F}$) na pozycjach wag ($16, 1$), aby uzyskać wylosowaną wartość dziesiętną:

<data-gate>
  <data-number-system target="26,42,58,74,90" base="16" digits="2">

> [!TIP]
> Podziel liczbę całkowicie przez $16$, aby ustalić starszą cyfrę (wagę $16^1$). Reszta z dzielenia trafia na pozycję jednostek ($16^0$). Wartości od $10$ do $15$ zapisuj literami $\text{A}-\text{F}$.

  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system target="163,175,190,205,255" base="16" digits="2">

> [!TIP]
> Dla wyższych wartości bajtowych ($> 160$) starsza cyfra szesnastkowa to co najmniej $\text{A}$ ($10 \times 16 = 160$). Pamiętaj o mapowaniu: $\text{A}=10, \text{B}=11, \text{C}=12, \text{D}=13, \text{E}=14, \text{F}=15$.

  </data-number-system>
</data-gate>

---

## 🔒 Weryfikacja: Grupowanie bitów i odruchy bazowe

<data-gate>
  <data-connection-matcher title="Grupowanie Bitów i Odruchy Bazowe">
    <item left="Paczka 3-bitowa ($2^3 = 8$)" right="Jedna cyfra ósemkowa (od $0$ do $7$)"></item>
    <item left="Paczka 4-bitowa ($2^4 = 16$)" right="Jeden znak szesnastkowy (półbajt / nibble)"></item>
    <item left="Dwa znaki HEX (np. $\text{FF}$)" right="Dokładnie $1\text{ B}$ ($8\text{ b}$ / $256$ kombinacji)"></item>
    <item left="Wartość $10_{10}$ w bazie 16" right="Znak $\text{A}$ (zastępuje zapis dwucyfrowy)"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- System ósemkowy (baza 8) grupuje bity po 3, a system szesnastkowy (baza 16) po 4.
- W systemie szesnastkowym wartości od $10$ do $15$ są reprezentowane literami od $A$ do $F$.
- Dwa znaki HEX odpowiadają dokładnie jednemu bajtowi ($8$ bitów), co czyni ten system idealnym m.in. do zapisu kolorów w formacie RGB lub adresów pamięci.
