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
