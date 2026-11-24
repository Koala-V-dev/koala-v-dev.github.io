# Skaner płaski i dokumentowy

![Urządzenie wielofunkcyjne HP OfficeJet Pro 8022e. Nad częścią drukującą znajduje się moduł skanera z podajnikiem dokumentów.](/public/courses/urządzenia-techniki-komputerowej/Images/hp-officejet-pro-8022e.jpg)

*HP OfficeJet Pro 8022e, zdjęcie AntipathyWorld. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:HP_OfficeJet_Pro_8022e.jpg).*

Skan książki jest ostry przy brzegu, ale rozmyty przy grzbiecie. Podniesienie rozdzielczości z 300 do 600 niczego nie naprawiło. Co stało się z obrazem przed utworzeniem pliku?

## 🔍 Od światła do próbek

Skaner oświetla dokument i mierzy odbite światło. W skanerze płaskim dokument leży na szybie, a układ odczytu przesuwa się względem niego. Konstrukcje CCD mogą używać układu luster i obiektywu. Zespół CIS pracuje blisko dokumentu i zwykle ma mniejszą głębię ostrości. Rozdzielczość optyczna wynika z pomiaru, a interpolowana dodaje próbki obliczone z sąsiadów.

**ADF** pobiera luźne arkusze. Tryb duplex odczytuje obie strony, zależnie od konstrukcji w jednym lub kilku przebiegach. Zwarte książki i delikatne materiały układaj na szybie, jeśli instrukcja pozwala. Jeśli na skanach z ADF biegnie stale ta sama pionowa linia, porównaj z szybką próbą na pełnej szybie. Osobny wąski pasek odczytu może wymagać czyszczenia.

**OCR** próbuje zamienić obraz tekstu na znaki, które można przeszukiwać. Przejrzyj wynik, szczególnie cyfry i polskie znaki. Plik PDF może zawierać sam obraz, tekst lub oba.

## 🧪 Która część urządzenia zostawia ślad

Kopia papierowa łączy dwa tory. Najpierw urządzenie odczytuje oryginał, potem drukuje wynik. Wada na kopii mogła powstać na którymkolwiek etapie. Żeby rozdzielić tory, porównaj próby, które omijają różne części urządzenia.

| Próba | Co bierze w niej udział |
| --- | --- |
| Skan z szyby lub z ADF do pliku | Odczyt dokumentu wybraną drogą. Oglądasz plik na ekranie. |
| Raport wybrany na panelu drukarki | Drukowanie strony utworzonej wewnątrz urządzenia. |
| Strona testowa wysłana z komputera | Kolejka, połączenie i drukowanie. |

Zeskanuj do pliku ten sam czysty, luźny arkusz najpierw z szyby, a potem z ADF. Jeśli linia występuje wyłącznie na skanie z podajnika, obejrzyj wąską szybkę ADF. W tym trybie papier przesuwa się nad tym samym miejscem szybki. Drobina na niej może więc zostawić ślad przez całą długość strony. Wyczyść szybkę według instrukcji modelu i powtórz skan tego samego arkusza. Jeśli wada występuje na papierowej kopii, a w obu plikach jej nie widać, wydrukuj raport bezpośrednio z panelu urządzenia. Ten wydruk pozwoli sprawdzić, czy ślad powstaje też wtedy, gdy skaner w ogóle nie pracuje. [Porównanie szyby i ADF w instrukcji HP](https://support.hp.com/ee-en/document/c06432233).

### 🧰 Usuń smugę z podajnika

Przenieś ten sam arkusz na szybę i do podajnika. Obok siebie zobaczysz oba skany. Jeśli smuga występuje tylko w ADF, przeciągnij palcem lub kursorem wzdłuż jego wąskiego paska szyby i powtórz odczyt. Poprzedni skan zmieni się dopiero po ponownym przeskanowaniu kartki.

Z klawiatury wybierz arkusz, potem szybę lub podajnik. Przycisk pod paskiem pozwala przetrzeć całą jego długość.

<data-gate>
  <data-scanner-bench></data-scanner-bench>
</data-gate>

## 📏 Sprawdź, czy 600 dpi ujawnia więcej szczegółów

Połóż na szybie dokument z małym drukiem i drobnymi liniami, na przykład fragment instrukcji z tabelą. Wybierz w aplikacji skanera ten sam obszar i tryb szarości w obu próbach. Zapisz go do PNG lub TIFF najpierw przy **300 dpi**, potem przy **600 dpi**, jeśli urządzenie obsługuje tę rozdzielczość optycznie. Skrót **dpi** w ustawieniach skanera określa, ile punktów przypada na cal. Wyłącz automatyczne kadrowanie, jeśli zmienia obszar między skanami.

1. Odczytaj wymiary obu plików w pikselach. Przy tym samym obszarze 600 dpi daje około dwa razy tyle pikseli w każdej osi.
2. Powiększ widok skanu 300 dpi do 200%, a skan 600 dpi oglądaj przy 100%. Porównaj ten sam fragment w podobnej skali. Sprawdź na przykład, czy da się rozróżnić dwie sąsiednie kreski albo odczytać najmniejszą cyfrę.
3. Wybierz rozdzielczość do wysłania dokumentu. Zanotuj jeden szczegół, który rozstrzygnął wybór, i porównaj wielkość plików. Jeśli oba skany pozwalają odczytać te same informacje, mniejszy plik może wystarczyć.

Przy skanowaniu książki wykonaj dwa skany w tej samej rozdzielczości. W drugim przesuń książkę, tak aby porównywany tekst znalazł się bliżej szyby, jeśli pozwala na to oprawa. Porównaj tekst przy grzbiecie i przy brzegu. Jeśli ostrość poprawia się głównie tam, gdzie papier leży bliżej szyby, masz wskazówkę, że problem powstaje w optyce. Nie dociskaj oprawy na siłę.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Rozmiar obrazu i koszt podwojenia próbkowania</span> <span class="deep-dive-badge">C++ I OBRAZ CYFROWY</span></summary>
<div class="deep-dive-content">

Rozważ osobny wzorzec z dwunastoma parami jasnych i ciemnych pasm na odcinku 0,1 cala. Ma on częstotliwość przestrzenną $f=120$ cykli na cal. Przy $s=150$ próbkach na cal granica Nyquista wynosi $s/2=75$ cykli na cal. W próbkach pojawia się pozorny wolniejszy wzór o częstotliwości $|f-s|=30$ cykli na cal. Stąd około trzy cykle zamiast dwunastu na fragmencie o długości 0,1 cala. To **aliasing**. Interpolacja z 150 do 600 dodaje piksele między już zmierzonymi wartościami, więc zachowuje błędny wzór. Przy 600 rzeczywistych próbkach na cal częstotliwość wzorca mieści się poniżej granicy 300 cykli na cal. [Próbkowanie i aliasing w dokumentacji NI](https://www.ni.com/docs/en-US/bundle/ni-dmm/page/nyquist-theorem_1.html).

Pole 8 × 10 cali przy 300 próbkach na cal daje 2400 × 3000 pikseli. Przy trzech kanałach po 1 B surowa macierz ma 21 600 000 B. Podwojenie rozdzielczości w obu osiach daje cztery razy więcej danych, 86 400 000 B. Rozmiar pliku zależy też od kompresji i metadanych. Dla prostego układu RGB adres kanału czerwonego w C to `3 * (y * width + x)` względem początku tablicy, pod warunkiem braku dodatkowych bajtów na końcu wiersza.

W C++ możesz opisać układ wierszy, przekazując krok w bajtach jako osobny parametr. Współrzędne licz od zera. `std::size_t` to typ bez znaku używany do rozmiarów i indeksów. Funkcja zwraca przesunięcie, czyli liczbę bajtów od początku bufora.

```cpp
#include <cstddef>

std::size_t red_offset(std::size_t x, std::size_t y, std::size_t stride)
{
    return y * stride + x * 3;
}
```

Dla obrazu o szerokości trzech pikseli i kroku wiersza 12 B oblicz przesunięcie czerwieni dla x = 2, y = 1. Dostaniesz 18 B, podczas gdy użycie samej szerokości dałoby 15 B. Przykład zakłada prawidłowe współrzędne, kolejność RGB i rozmiar obliczenia mieszczący się w typie. Przed prawdziwym odczytem programu potrzebne są też granice bufora.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Dobierz tryb do dokumentu, rozdzielczość do wymaganej czytelności, a OCR sprawdzaj na zapisanym tekście.

