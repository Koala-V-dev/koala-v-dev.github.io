# Wielki finał: wyzwania mistrza bitów

Gratulacje - dotarłeś do końca pierwszego modułu. Poznałeś systemy pozycyjne, operacje na bitach, arytmetykę dwójkową, kodowanie liczb ujemnych w systemie U2 oraz reprezentację tekstu za pomocą ASCII i UTF-8. Czas sprawdzić, jak te koncepcje przekładają się na praktyczną pracę.

Poniższe wyzwania to krótkie zadania sprawdzające Twoje zrozumienie tematu. Rozwiąż je wszystkie, aby potwierdzić opanowanie materiału z Modułu 1.

---

## 🎨 Punkt kontrolny: Kolory w Matrixie

<data-gate>
  <data-quiz>
    <question>
Grafik przesyła w specyfikacji kolor zapisany w formacie CSS: `#FF8800`. Ile wynosi dziesiętna wartość składowej zielonej (Green) tego koloru? Pamiętaj, że format zapisu to `#RRGGBB`.
    </question>
    <options>
      <option>255</option>
      <option correct>136</option>
      <option>0</option>
      <option>88</option>
    </options>
    <div data-hint="error">
      Znajdź dwie cyfry hex odpowiadające za kolor zielony (GG). Następnie przelicz wartość `88` z systemu szesnastkowego na dziesiętny: $8 \cdot 16^1 + 8 \cdot 16^0$.
    </div>
    <div data-hint="success">
      Znakomicie! Każdy kolor w formacie CSS to trzy bajty szesnastkowe odpowiadające kolejno za czerwień (Red), zieleń (Green) i niebieski (Blue). Zapis `#FF8800` oznacza pełną intensywność czerwieni ($255_{10}$), średnią zieleni ($136_{10}$) i brak koloru niebieskiego. Ta wiedza jest przydatna na co dzień w pracy z interfejsami webowymi.
    </div>
  </data-quiz>
</data-gate>

---

## 🔢 Punkt kontrolny: Indeksowanie od zera

<data-gate>
  <data-quiz>
    <question>
Programista informuje, że poszukiwany element w tablicy znajduje się pod indeksem $3$. Który to element z kolei, jeżeli indeksowanie tablicy rozpoczyna się od zera ($0$)?
    </question>
    <options>
      <option>trzeci</option>
      <option correct>czwarty</option>
      <option>piąty</option>
    </options>
    <div data-hint="error">
      Indeksy zaczynają się od zera: indeks $0$ to pierwszy element, indeks $1$ to drugi, indeks $2$ to trzeci, a indeks $3$ to...
    </div>
    <div data-hint="success">
      Doskonale! Indeksowanie od zera to fundamentalna zasada w architekturze komputerów i językach programowania. Od zera liczymy pozycje bitów w rejestrach, indeksy elementów w tablicach oraz znaki w łańcuchach tekstowych.
    </div>
  </data-quiz>
</data-gate>

---

## 🐧 Punkt kontrolny: Uprawnienia w systemach Linux

<data-gate>
  <data-quiz>
    <question>
W systemie Linux uprawnienia do plików konfiguruje się m.in. za pomocą kodów ósemkowych. Liczba $7_8$ to binarnie `111`. Ile różnych praw dostępu (odczyt, zapis, wykonanie) nadaje ta wartość?
    </question>
    <options>
      <option>tylko jedno - pełny dostęp</option>
      <option>dwa - odczyt i zapis</option>
      <option correct>trzy - odczyt, zapis oraz wykonanie</option>
    </options>
    <div data-hint="error">
      Każdy bit w trzybitowym ciągu reprezentuje jedno uprawnienie (od lewej do prawej): Read (odczyt), Write (zapis), Execute (wykonanie). Bit ustawiony na `1` włącza dane uprawnienie.
    </div>
    <div data-hint="success">
      Dokładnie tak! Wartość $7_8$ (`111` binarnie) aktywuje wszystkie trzy prawa dostępu (Read, Write, Execute). Stąd bierze się popularne polecenie administratorów `chmod 755` - daje ono właścicielowi pełne prawa ($7_8 = 111$), a grupie i pozostałym użytkownikom jedynie odczyt i wykonanie ($5_8 = 101$).
    </div>
  </data-quiz>
</data-gate>

---

## 🕶️ Punkt kontrolny: Czytanie Matrixa

<data-gate>
  <data-quiz>
    <question>
Podczas analizy ruchu sieciowego przechwycono następujący ciąg bajtów w systemie szesnastkowym: `48 45 4C 4C 4F`. Korzystając z wycinka tablicy ASCII, zdekoduj ukryte słowo.
[ `4C` = L, `4F` = O, `48` = H, `45` = E ]
    </question>
    <options>
      <option>HELL</option>
      <option correct>HELLO</option>
      <option>HELP</option>
    </options>
    <div data-hint="error">
      Przetłumacz każdy z pięciu bajtów szesnastkowych po kolei na odpowiednią literę z podanego zestawu.
    </div>
    <div data-hint="success">
      Brawo! Umiejętność czytania surowych bajtów i kodów szesnastkowych jest niezbędna przy debugowaniu aplikacji, analizie pakietów sieciowych w programach takich jak Wireshark oraz podczas niskopoziomowej analizy bezpieczeństwa.
    </div>
  </data-quiz>
</data-gate>

---

## 🧮 Stacja treningowa: Potęga dwójki

<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Algorytm sumowania wag pozycji binarnych leży u podstaw działania przetworników analogowo-cyfrowych (ADC). To te układy zamieniają fale dźwiękowe z mikrofonu czy obraz z matrycy aparatu na bity przechowywane w pamięci urządzenia.

  </data-number-system>
</data-gate>

---

## ⚡ Stacja treningowa: Arytmetyka pod presją

<data-gate>
  <data-arithmetic-challenge base="2" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Dodawanie binarne to podstawowa funkcja realizowana przez procesor. Wszystkie bardziej skomplikowane operacje programistyczne na najniższym poziomie sprowadzają się do milionów takich elementarnych sumowań na sekundę.

</data-gate>

<data-gate>
  <data-arithmetic-challenge base="2" operation="-"></data-arithmetic-challenge>

> [!TIP]
> Ciekawostka: procesor nie posiada fizycznego, osobnego układu do odejmowania. Zamiast tego zamienia odjemnik na jego reprezentację w kodzie U2 (negacja bitów i dodanie 1), a następnie wykonuje zwykłe dodawanie.

</data-gate>

---

## 💎 Stacja treningowa: Hex jak zawodowiec

<data-gate>
  <data-arithmetic-challenge base="16" operation="+"></data-arithmetic-challenge>

> [!TIP]
> Sprawne dodawanie w systemie szesnastkowym pozwala szybko orientować się w zrzutach pamięci (crash dumps) oraz analizować adresy wskaźników podczas profilowania wydajności aplikacji.

</data-gate>

---

## 🌑 Punkt kontrolny: Notacja U2

<data-gate>
  <data-quiz>
    <question>
W 8-bitowym systemie kodowania liczb ze znakiem (U2), jaka wartość dziesiętna odpowiada ciągowi bitów `1000 0000`?
    </question>
    <options>
      <option>128</option>
      <option correct>-128</option>
      <option>-1</option>
      <option>0</option>
    </options>
    <div data-hint="error">
      Pamiętaj, że w systemie U2 najbardziej lewy bit (MSB) ma wagę ujemną. Dla formatu 8-bitowego waga ta wynosi $-128$. Pozostałe bity to zera.
    </div>
    <div data-hint="success">
      Świetnie! Najbardziej lewy bit na pozycji 7 ma wagę $-128_{10}$. Ponieważ jest to jedyny ustawiony bit w tym ciągu, cała liczba reprezentuje dolną granicę zakresu 8-bitowego systemu U2.
    </div>
  </data-quiz>
</data-gate>

---

## 🎉 Certyfikat mistrza bitów

Wykazałeś się praktycznym zrozumieniem fundamentów działania komputera. Zamiast uczenia się reguł na pamięć, rozumiesz mechanizmy kryjące się za reprezentacją danych liczbowych i tekstowych.

Wiedza ta ma charakter uniwersalny. Podczas gdy języki programowania i frameworki zmieniają się regularnie, podstawowe zasady kodowania danych i arytmetyki binarnej pozostają niezmienne od początku ery komputerów osobistych.

### Przegląd zdobytych umiejętności

| Umiejętność                            | Praktyczne zastosowanie w inżynierii                           |
| :------------------------------------- | :------------------------------------------------------------- |
| Konwersje baz liczbowych (Bin/Oct/Hex) | Analiza protokołów sieciowych, edycja plików binarnych         |
| Arytmetyka binarna i szesnastkowa      | Projektowanie algorytmów, optymalizacja kodu źródłowego        |
| Zapis liczb ujemnych w systemie U2     | Unikanie błędów przepełnienia (overflow)                       |
| Kodowanie znaków (ASCII/UTF-8)         | Przetwarzanie plików tekstowych, internacjonalizacja aplikacji |
| Wykorzystanie potęg dwójki             | Zarządzanie pamięcią podręczną, planowanie struktur danych     |

### Gdzie wykorzystasz tę wiedzę?

Zrozumienie niskopoziomowych fundamentów ułatwia naukę w dowolnym obszarze IT:

- 🖥️ **Architektura komputerów** - analiza sposobu wykonywania instrukcji przez rdzenie CPU.
- 🌐 **Inżynieria sieciowa** - optymalizacja przesyłu pakietów przez protokoły sieciowe.
- 🔌 **Systemy wbudowane (Embedded)** - bezpośrednie programowanie rejestrów mikrokontrolerów.
- 🎨 **Grafika komputerowa** - operacje na kolorach, shaderach i strukturach buforów ekranu.
- 🔒 **Cyberbezpieczeństwo** - analiza kodu maszynowego i badanie podatności oprogramowania.
- ⚙️ **Infrastruktura i DevOps** - zarządzanie uprawnieniami systemowymi i konfiguracja serwerów.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tego modułu:

- Komputery reprezentują wszystkie typy danych (liczby, litery, kolory, instrukcje) za pomocą stanów logicznych $0$ i $1$.
- Systemy ósemkowy (Octal) i szesnastkowy (Hexadecimal) to darmowe w przeliczeniu sprzętowym skróty zapisu binarnego, które grupują bity odpowiednio po 3 i 4.
- Ujemny znak liczby jest uzyskiwany w sprzęcie poprzez przypisanie ujemnej wagi do najbardziej znaczącego bitu (MSB) w notacji U2.
- Współczesny Internet opiera się na kodowaniu UTF-8, które płynnie łączy oszczędność pamięci ASCII dla podstawowych znaków z możliwością zapisu dowolnego symbolu na świecie za pomocą sekwencji wielobajtowych.
