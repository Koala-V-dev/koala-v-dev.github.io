# Drukarka igłowa

Punkt przyjęć potrzebuje oryginału i dwóch kopii formularza w jednym przebiegu. Dlaczego szybka drukarka laserowa może tu przegrać?

## 🔨 Nacisk przenosi informację

Igły uderzają przez taśmę barwiącą w papier. W formularzu samokopiującym nacisk zostawia ślad także na dalszych warstwach. Papier ciągły z otworami może być prowadzony przez traktor, czyli podajnik zaczepiający o perforację. Głowica składa znak z punktów. Liczba igieł, tryb druku i mechanika wpływają na rozdzielczość i szybkość. CPS określa znaki na sekundę w zadanym trybie.

![Commodore MPS-803 widziana z góry. Pod przezroczystą osłoną widać poziomą prowadnicę i karetkę głowicy.](/public/courses/urządzenia-techniki-komputerowej/Images/commodore-mps803.jpg)

*Karetka porusza się w poprzek papieru. Papier przesuwa się w drugim kierunku, między kolejnymi wierszami. Fot. RetroK. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:Commodore_Matrixdrucker_MPS-803.jpg).*

Jeżeli tekst na oryginale jest ciemny, a kopia blada, sprawdź liczbę dopuszczalnych warstw i ustawienie odstępu głowicy. Jeśli wszystkie warstwy są blade, sprawdź także taśmę.

## 🧪 Sprawdź czytelność ostatniej kopii

Przygotuj formularz samokopiujący. Jeśli masz drukarkę igłową, sprawdź w jej instrukcji zgodny typ formularza, maksymalną liczbę warstw i ustawienie dźwigni grubości papieru. Na przykład w **Epson LX-350** formularz z oryginałem i dwiema kopiami ma trzy warstwy, dla których instrukcja podaje pozycję **2**. [Instrukcja Epson LX-350, rozdział Printing on Special Paper](https://files.support.epson.com/pdf/lx350_/lx350_ug.pdf).

1. Ustaw dźwignię i załóż formularz według instrukcji. W bezpiecznym obszarze druku wydrukuj wiersz z danymi próbnymi, np. **ZLECENIE 8036**.
2. Rozdziel warstwy. Porównaj, czy na ostatniej kopii można odróżnić wszystkie cyfry. Jeśli oryginał jest wyraźny, a ostatnia kopia blada, sprawdź ponownie liczbę warstw i pozycję dźwigni. Wymiana taśmy poprawia nanoszenie barwnika na oryginał. Na dalszych warstwach ślad powstaje dzięki naciskowi.
3. Obejrzyj wydruk z bliska, np. przez aparat telefonu. Jeśli w wielu znakach brakuje punktów na tej samej wysokości, wykonaj autotest opisany w instrukcji drukarki. Powtarzalny brak punktów również na wydruku z autotestu pozwala zawęzić problem do mechanizmu drukowania lub jego sterowania.

Jeśli masz tylko formularz, zostaw warstwy złożone i napisz numer długopisem na oryginale. Odczytaj go na ostatniej kopii. W ten sposób zobaczysz działanie nacisku na formularzu, zanim użyjesz drukarki.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Kolumna punktów jako maska</span> <span class="deep-dive-badge">OPERACJE BITOWE</span></summary>
<div class="deep-dive-content">

W [Binarne Fundamenty IT](/courses/binarne-fundamenty-it/) zapis dwójkowy przedstawiał wartość liczby. Tu każda pozycja steruje jedną igłą. Dla pięciu igieł bit 0 może odpowiadać igle na górze. Maska 00001 wtedy daje pojedynczy punkt u góry, a 11111 całą pionową kreskę. W C wyrażenie `1u << i` przesuwa jedynkę na pozycję `i`. Operator `|` pozwala złożyć maskę z kilku igieł, a `&` zachować wyłącznie bity wspólne dla obu argumentów.

```c
unsigned maska = (1u << 1) | (1u << 3);   /* 01010 */
unsigned slad = maska & ~(1u << 3);      /* 00010 */
```

Tylda `~` odwraca bity. Po odwróceniu maski dla igły 3 dostajesz zero na jej pozycji i jedynki wszędzie indziej. Dlatego `&` usuwa tylko jej punkt. Jeśli ta sama igła nie działa w kolejnych kolumnach, na wydruku brakuje punktów na jednej wysokości. [Przykład danych kolumnowych w dokumentacji Epson](https://download4.epson.biz/sec_pubs/pos/reference_en/escpos/esc_asterisk.html).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wybierz druk udarowy, gdy zadanie wymaga nacisku. Potwierdź czytelność ostatniej kopii na docelowym formularzu.

