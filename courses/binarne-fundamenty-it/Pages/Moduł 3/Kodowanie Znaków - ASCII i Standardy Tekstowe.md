# Kodowanie Znaków: ASCII i Standardy Tekstowe

W pamięci komputera nie ma liter, słów ani kolorów - istnieją wyłącznie liczby.

Aby komputer mógł wyświetlić na ekranie tekst, każdemu znakowi przypisuje się unikalny numer w tabeli. Taki system przyporządkowania nazywamy **kodowaniem znaków** (*character encoding*).

---

## 🔤 Tabela ASCII: Fundament tekstu w komputerze

Standard **ASCII** powstał w <time data="1963-03">1963 roku</time> i zdefiniował kody dla pierwszych **128 znaków** (od $0$ do $127$). Mieści się w 7 bitach, a w pełnym bajcie najstarszy bit ma zawsze wartość **_0_**.

Oto jak wygląda pełna tablica znaków ASCII:

![Tabela kodów ASCII](/public/courses/binarne-fundamenty-it/Images/tablica-ascii.png)

### Cztery punkty orientacyjne, które warto zapamiętać:
W codziennej pracy programisty i na egzaminach (INF.03/INF.04) nie trzeba uczyć się całej tabeli na pamięć. Wystarczy pamiętać cztery liczby:

| Grupa znaków                     | Kod dziesiętny (DEC) | Kod szesnastkowy (HEX) | Przykład                    |
| :------------------------------- | :------------------: | :--------------------: | :-------------------------- |
| **Spacja**                       |        **32**        |         `0x20`         | Najmniejszy znak drukowalny |
| **Cyfry `'0' ... '9'`**          |    **48 ... 57**     |    `0x30 ... 0x39`     | Cyfra `'0'` ma kod 48       |
| **Wielkie litery `'A' ... 'Z'`** |    **65 ... 90**     |    `0x41 ... 0x5A`     | Litera `'A'` ma kod 65      |
| **Małe litery `'a' ... 'z'`**    |    **97 ... 122**    |    `0x61 ... 0x7A`     | Litera `'a'` ma kod 97      |

### Sprytny trik bitowy: Różnica 32
Zwróć uwagę na różnicę między wielką a małą literą:
- Wielkie `'A'` = **65** (`0100 0001`)
- Małe `'a'` = **97** (`0110 0001`)

Różnica wynosi dokładnie **32** ($2^5$). To oznacza, że wielka i mała litera różnią się tylko jednym bitem: na piątej pozycji. Zmiana tego jednego bitu zamienia wielką literę na małą.

---

## 🕹️ Sprawdź znak: Interaktywny konwerter ASCII

Wpisz dowolny znak z klawiatury w poniższym polu i zobacz jego kod w systemie dziesiętnym, szesnastkowym i binarnym:

<data-ascii-converter></data-ascii-converter>

---

## 🌐 128 znaków to za mało, więc używamy UTF-8

Tabela ASCII powstała w USA i zawierała wyłącznie litery alfabetu angielskiego. Nie było w niej miejsca na polskie litery (`ą, ć, ę, ł, ń, ó, ś, ź, ż`), inne języki europejskie, cyrylicę ani pismo azjatyckie.

Gdy dodano 8. bit (dający 256 znaków), każdy kraj stworzył własną stronę kodową:
- W Polsce Windows używał standardu **Windows-1250**, a Linux i sieć standardu **ISO-8859-2**.
- Skutek: gdy otwierałeś plik tekstowy z Windowsa na Linuxie, zamiast polskich liter pojawiały się nieczytelne „krzaczki”.

### Rozwiązanie: Standard UTF-8
Aby rozwiązać ten problem raz na zawsze, stworzono standard **UTF-8**. Może on zapisywać znaki za pomocą **od 1 do 4 bajtów**:

| Liczba bajtów | Przeznaczenie                              | Przykłady                                             |
| :-----------: | :----------------------------------------- | :---------------------------------------------------- |
|  **1 bajt**   | Podstawowe znaki alfabetu angielskiego     | `A`, `b`, `5`, `$`, spacja ($100%$ zgodności z ASCII) |
|  **2 bajty**  | Polskie litery i inne alfabety europejskie | `ą`, `ć`, `ę`, `ł`, litery z cyrylicy, greki          |
|  **3 bajty**  | Pismo chińskie, japońskie, arabskie        | Znaki Kanji, Hiragana, pismo hebrajskie               |
|  **4 bajty**  | Nowoczesne piktogramy i rzadkie symbole    | **Emoji** (np. 🚀, 💻, 😀, 🎮)                            |

Dzięki temu tekst w języku angielskim zajmuje tyle samo miejsca co w ASCII (1 bajt na znak), a polskie litery i emoji działają poprawnie na każdym urządzeniu i systemie na świecie.

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Jak procesor rozpoznaje długość znaku w UTF-8? Prefiksy bitowe</span>
<span class="deep-dive-badge">FORMAT DANYCH & UTF-8</span>
</summary>
<div class="deep-dive-content">

Gdy procesor odczytuje strumień bajtów UTF-8 z dysku lub karty sieciowej, rozpoznaje liczbę bajtów danego znaku na podstawie pierwszych bitów:

- **1 bajt (ASCII)**: zaczyna się od zera: `0xxxxxxx`.
- **2 bajty**: pierwszy bajt zaczyna się od dwóch jedynek: `110xxxxx`, a kolejny od: `10xxxxxx`.
- **3 bajty**: pierwszy bajt zaczyna się od trzech jedynek: `1110xxxx`, a kolejne dwa od: `10xxxxxx`.
- **4 bajty**: pierwszy bajt zaczyna się od czterech jedynek: `11110xxx`, a kolejne trzy od: `10xxxxxx`.

Wszystkie kolejne bajty wielobajtowego znaku mają prefiks `10...`. Jeśli podczas transmisji sieciowej zgubi się pojedynczy bajt, program nie rozsypuje całego dokumentu, lecz natychmiast odnajduje początek kolejnego poprawnego znaku.

</div>
</details>

---

## 🔒 Weryfikacja: Kodowanie tekstu

<data-gate>
  <data-connection-matcher title="Weryfikacja: Standardy Kodowania Znaków">
    <item left="Kod ASCII spacji" right="Wartość dziesiętna 32"></item>
    <item left="Kod ASCII litery `A`" right="Wartość dziesiętna 65"></item>
    <item left="Kod ASCII cyfry `0`" right="Wartość dziesiętna 48"></item>
    <item left="Różnica między `A` a `a`" right="Dokładnie 32 (bit na 5. pozycji)"></item>
    <item left="Liczba bajtów dla Emoji w UTF-8" right="4 bajty na znak"></item>
    <item left="Polskie litery w UTF-8" right="Zapisywane na 2 bajtach"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Standard ASCII przypisuje $128$ znakom kody od $0$ do $127$ (7 bitów).
- Trzy klucze pamięciowe to `0` (48), `A` (65) oraz `a` (97).
- Wielka i mała litera w ASCII różnią się dokładnie o 32, czyli o jeden bit na piątej pozycji.
- Standard UTF-8 zastąpił dawne strony kodowe i zapisuje znaki na zmiennej liczbie bajtów: od 1 bajtu (ASCII) przez 2 bajty (polskie znaki) aż po 4 bajty (emoji).
