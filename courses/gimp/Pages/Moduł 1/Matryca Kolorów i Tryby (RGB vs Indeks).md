# Matryca Kolorów i Tryby (RGB vs Indeks)
Zrozumienie jak system kalkuluje kolor to fundament obróbki rastrowej. Ekran nie "widzi" barwy, widzi ciąg zer i jedynek (pamiętasz kurs Binarne Fundamenty IT? 😉) przypisanych do zestawu współrzędnych pikseli $(X,Y)$ na matrycy.  
Brak tej wiedzy skutkuje klasycznym problemem amatorów: "dlaczego mój zielony pędzel nagle maluje na szaro?".  
Ty ją poznasz 😎.

---

## 🎨 Przestrzenie Barw (Profile Kolorystyczne)

Programy graficzne definiują barwy w zamkniętych matematycznych ramach (przestrzeniach).

*   **RGB (Red, Green, Blue)**: Tryb ekranowy (addytywny). Monitor fizycznie emituje światło, więc kolory dodają się do bieli. Masz pełną kontrolę nad napięciem subpikseli. Jest to natywny obszar projektowania Web i wideo.
*   **CMYK (Cyan, Magenta, Yellow, Key/Black)**: Tryb drukarski (subtraktywny). Papier absorbuje światło. Zmieszanie wszystkich farb daje "brudny" pigment. CMYK ma **drastycznie węższy gamut (paletę)** w porównaniu do RGB.  
    > [!NOTE]
    > GIMP natywnie pracuje w RGB. Symulacja CMYK odbywa się przez profile kolorów, a profesjonalne przygotowanie do druku często wymaga wtyczek lub zewnętrznych programów.

Oto praktyczne wyzwanie, które pokaże Ci tę różnicę "na żywo". Twoim zadaniem jest dopasowanie kolorów w dwóch różnych systemach.

<data-gate>

<data-color-gamut></data-color-gamut>

</data-gate>

*   **Tryb Indeksowany (Indexed)**: Format narzucający twardy limit barw (najczęściej max 256). Skonstruowany we wczesnych latach internetu (m.in. dla formatu `.gif`) w celu agresywnego zbijania wagi pliku. Paleta jest zablokowana w tzw. "Color Map".

Gimp pozwala na pracę w trzech trybach: `RGB`, `Odcienie szarości` i `Indeksowany...`.  
Poniżej masz obraz z menu GIMP-a, gdzie możesz zmienić tryb pracy oraz okno konwersji domyślnego RGB dla nowego projektu w tryb indeksowany.

![Tryby Kolorów](/courses/gimp/Images/tryby_kolorów.png)

> [!CAUTION]
> **Zablokowany pędzel:** Jeśli pobierzesz grafikę sprzętowo zapisaną jako obraz Indeksowany i spróbujesz użyć pędzla o jaskrawo pomarańczowym odcieniu, ślad na płótnie przyjmie barwę brązową lub szarą. Twój odcień po prostu nie istnieje w narzuconej matrycy pliku. Obejście wymaga siłowego przełączenia architektury dokumentu: *`Obraz` -> `Tryb`*.

## 💻 Głębia Bitowa (Bit Depth) i Banding

Głębia definiuje ilość bitów przeznaczonych na zapis informacji tonalnej pojedynczego kanału (R, G lub B) wewnątrz jednego piksela. Im wyższa wartość bitowa, tym subtelniejsze przejścia można zapisać w pamięci systemowej, kosztem radykalnego obciążenia pamięci RAM.

| Głębia na Kanał | Rozróżniana Paleta Barw | Zastosowanie i Koszt Obliczeniowy |
|:---|:---|:---|
| **8-bit Integer** | $16.7$ Milionów Barw ($2^8 = 256$ odcieni na R/G/B) 🙂 | Standard rynkowy (.jpg, .png). Minimalne narzuty CPU/RAM. Podatny na urywanie jasności. |
| **16-bit Integer** | $281$ Bilionów Barw ($2^{16} = 65\text{ }536$ odcieni na RGB) 😮 | Standard fotomontaży i fotografii wysokiej jakości. Likwiduje problem pasmowania (bandingu). |
| **32-bit Float** | Nieskończoność (brak sztywnych limitów) 🤯 | Ekstremalne środowisko HDR (High Dynamic Range). Potężny narzut przeliczeniowy. |

**Zjawisko Bandingu (Pasmowania):**
Gdy generujesz bardzo płynny, ciemny gradient, a pracujesz w trybie $8$-bit, fizycznie brakuje Ci dostępnych odcieni. System nie ma "szufladki" na kolor pomiędzy odcieniem $120$ a $121$, więc tworzy twardy przeskok.  
Banding bardzo łatwo wytworzyć stosując przezroczystość i wymuszając mieszanie kolorów w trybie $8$-bit natrafisz na wartości z zbyt dużym przeskokiem. Dokładnie tak jak na obrazku poniżej.

![Banding przedstawiony na gradiencie radialnym odcieni szarości](/courses/gimp/Images/banding.png)

> [!TIP]
> Jeśli podczas pracy widzisz "pasy" na gradientach, w GIMPie przejdź do: `Obraz -> Precyzja` i podbij wartość z `8-bit` do `16-bit integer`. Otworzy to bufor pozwalający na utrwalenie detali przejść, pod warunkiem zasobnego stanowiska komputerowego.

---

## 🧰 Zarządzanie w Przyborniku (Toolbox)
Twoje "podręczne" centrum koloru znajduje się w Przyborniku. Zwróć uwagę na układ ikon:

*   **Kolor Pierwszoplanowy i Drugoplanowy**: To dwa nakładające się kwadraty. Ten w **lewym górnym rogu** (FG - *Foreground*) to Twój aktualny kolor pędzla. Ten w **prawym dolnym rogu** (BG - *Background*) służy m.in. do wypełnień i gradientów.
*   **Zamiana Kolorów (Ikona strzałki)**: Pozwala błyskawicznie zamienić miejscami barwę FG i BG. Najczęściej używane przy szybkim poprawianiu błędów maską.
*   **Reset (Małe czarno-białe kwadraciki)**: Znajdują się pod głównymi polami. Ich kliknięcie natychmiast przywraca domyślną konfigurację: *Czarna* barwa FG i *Biała* barwa BG.

![Interfejs zarządzania kolorem w Przyborniku oraz główne okno edycji](/courses/gimp/Images/zmiana_aktywnego_koloru.png)

## 🎨 Okno "Zmiana aktywnego koloru"
Gdy otworzysz główne okno edycji (zaznaczone na niebiesko powyżej), otrzymujesz dostęp do precyzyjnych narzędzi sterowania sygnałem:

1.  **Zapis HTML (HEX)**: Pole edycyjne na samym dole. To Twój most komunikacyjny z deweloperem – tutaj wklejasz precyzyjne kody barw, które muszą się zgadzać co do bita w gotowym produkcie. Sprytny algorytm GIMPa pozwala na wklejenie kodu zarówno jako `FF5500`, jak i `#FF5500`. Jeśli dodasz hashtag, program sam go usunie przy zatwierdzaniu.
2.  **Probówka Systemowa (Ikona monitora)**: Znajduje się **bezpośrednio po prawej stronie pola HEX**. Pozwala pobrać kolor z **dowolnego miejsca na Twoim ekranie** – nawet spoza okna GIMPa (np. kolor z ikonki innego programu lub strony WwW).
3.  **Skale i Rozdzielczość**:
    *   **0-100**: Skala procentowa (bezwzględna moc sygnału).
    *   **0-255**: Skala 8-bitowa. Dla dewelopera jest kluczowa, bo odpowiada fizycznemu zapisowi jednego bajta na kanał barwny w pamięci RAM.
4.  **Systemy Selekcji (HSV i LCh)**:
    *   **HSV** (Barwa, Nasycenie, Jasność) – model najprostszy w obsłudze.
    *   **LCh** (Jasność, Chroma, Barwa) – model oparty na percepcji oka.
    > [!WARNING]
    > **Różowe/puste fragmenty w LCh:** Jeśli w tej zakładce zobaczysz jaskrawo różowe obszary, oznacza to, że dany kolor jest _**poza gamutem Twojego monitora**_. Matematycznie on istnieje i *ludzkie oko mogłoby go zobaczyć* (np. w naturze, przy bardzo silnym świetle lub neonach), ale Twoja matryca nie jest w stanie wygenerować fizycznie tak "soczystej" lub jasnej barwy. LCh to model oparty na percepcji, więc pokazuje "pełną prawdę" o wzroku, obnażając przy tym słabość sprzętu.
5.  **Radio Input i Pionowy Suwak**: Kropki obok liter (R,G,B,H,S,V) decydują o tym, który parametr sterujesz za pomocą **pionowej, wąskiej belki** (tuż obok głównego kwadratu wyboru). Jeśli wybierzesz `H` (Hue), na pasku wybierasz "kolor tęczy", a w kwadracie jego nasycenie i jasność.
6.  **Historia Kolorów**: Pasek na samym dole przechowuje **_maksymalnie $12$ ostatnio zapisanych barw_**. Musisz ręcznie kliknąć przycisk **`+`** *(Dodaj bieżący kolor do historii)*. Dodanie $13$-stego koloru spowoduje usunięcie najstarszego wpisu z końca kolejki.

---

<data-gate>
<data-quiz>
<question>
Masz zadanie stworzyć grafikę na tło strony WwW. Programista prosi Cię o kolor "Głęboki błękit" i podaje kod `#0000FF`. Jakie barwy będą emitować subpiksele Twojego monitora?
</question>
<options>
<option>Wszystkie subpiksele (R, G, B) będą świecić z mniejszą mocą, aby uzyskać ciemny odcień.</option>
<option correct>Tylko subpiksel niebieski (B) będzie świecił z pełną mocą (FF), a czerwony (R) i zielony (G) pozostaną całkowicie wygaszone (00).</option>
<option>To kod dla drukarki, więc subpiksele w ogóle nie biorą udziału w generowaniu tego koloru.</option>
</options>
<div data-hint="error">
Spójrz na strukturę kodu HEX: #RRGGBB. Jakie wartości stoją na pozycjach odpowiadających za kolory Red i Green, a jaka na pozycji Blue?
</div>
<div data-hint="success">
Perfekcyjnie! Pamiętasz system szesnastkowy z poprzedniego kursu – FF to maksymalne wysterowanie, a 00 to brak sygnału. To jest właśnie "czysty niebieski".
</div>
</data-quiz>
</data-gate>

## 📑 Pozostałe Metody Wyboru (Zakładki)
GIMP oferuje alternatywne interfejsy ukryte pod zakładkami na górze okna:

![Dodatkowe zakładki zmiany aktywnego koloru](/courses/gimp/Images/zakładki_zmiany_aktywnego_koloru.png)

*   **Zakładka CMYK**: Numeryczna symulacja ilości pigmentów farbiarskich (C, M, Y, K). Służy do szacowania "zużycia tuszu" przed drukiem.
*   **Zakładka Akwarele (Watercolors)**: Interfejs dla artystów. Wyobraź sobie, że masz czysty pędzel i kliknięciem nabierasz odrobinę barwy z palety, która miesza się z aktualną bazą. Dłuższe przytrzymanie "pobiera" więcej koloru. Uważaj – łatwo tu przedobrzyć i skończyć z "czarną breją"!
*   **Zakładka Kółko/Trójkąt (Wheels)**: Wizualna reprezentacja przestrzeni barwnej. Na zewnętrznym pierścieniu wybierasz barwę, a wewnątrz trójkąta jej parametry.
*   **Zakładka Paleta**: Daje szybki dostęp do zapisanych zestawów barw (swatches). Jest kluczowa przy pracy w **trybie indeksowanym**, gdzie musisz trzymać się sztywno określonej listy barw.

---

<data-gate>
<data-quiz>
<question>
Pracujesz nad makietą aplikacji, korzystając ze standardowej 8-bitowej przestrzeni roboczej. Po wyrenderowaniu gładkiego, ciemnego tła z cieniem pojawiają się wyraźne okręgi twardych odcięć między tonacjami (tzw. banding). Jak zniwelować to zjawisko z poziomu architektury projektu?
</question>
<options>
<option>Nałożenie delikatnego filtru rozmycia (Gaussian Blur) na wadliwy obszar wymusi nadpisanie interpolacji pikselowej i wygładzenie krawędzi tonalnych.</option>
<option correct>Zmiana precyzji obrazu (Image Precision) z 8-bitów na 16-bitów (lub wyżej), co znacząco poszerzy dostępny bufor przejść tonalnych do milionów zmiennych zamiast 256.</option>
<option>Przekonwentowanie przestrzeni roboczej z RGB do trybu CMYK pozwala uruchomić dodatkowy algorytm czarnego kanału mieszającego tony cieni.</option>
</options>
<div data-hint="error">
Pomyśl o problemie jak o braku odpowiedniej rozdzielczości barwnej. Potrzebujesz więcej "szufladek" w pamięci by poukładać wartości barw skali pośredniej z twardego odcięcia pędzla.
</div>
</data-quiz>
</data-gate>

---

## 🧪 Modele Mieszania Barw: Addytywny vs Subtraktywny

W grafice komputerowej poruszamy się między światłem (ekran) a pigmentem (druk). Sprawdź na poniższym symulatorze, jak drastycznie różnią się te dwa światy:

> [!TIP]
> Kolor nie jest "stałą" cechą przedmiotu – to Twoja **biologiczna interpretacja fal światła**. Światło o różnych długościach i częstotliwościach wpada do oka, gdzie jest wyłapywane przez **trzy rodzaje czopków** (L, M, S – reagujące na czerwień, zieleń i błękit). Twój mózg miksuje te trzy sygnały, tworząc miliony barw. 
> 
> System RGB (monitor) bezpośrednio oszukuje te trzy receptory, świecąc im prosto... he he, w "oczy". 
> Farby (druk) działają inaczej: farba pochłania część fal, a to, co widzisz, to "resztki" odbite od pigmentu.
> *   **Model Addytywny (RGB)**: To mieszanie "światła". Gdy dodajesz kolejne kolory, obraz staje się jaśniejszy. Suma wszystkich daje czystą biel. To domena Twojego monitora.
> *   **Model Subtraktywny (CMY)**: To mieszanie "farby". Każdy kolejny pigment "zabiera" (odejmuje) światło odbite od kartki. Suma wszystkich daje ciemną, niemal czarną plamę. To domena druku.

<data-color-mixing mode="additive"></data-color-mixing>

## 🎡 Koło Barw i Harmonia Pro

Piękno projektu często wynika z matematyki ukrytej w Kole Barw. GIMP pozwala Ci wybierać kolory w różnych systemach, ale to Ty musisz zdecydować, które z nich będą do siebie pasować. 

Skorzystaj z poniższego **zaawansowanego generatora**, aby przetestować klasyczne **schematy harmoniczne** z uwzględnieniem nasycenia i jasności. W przeciwieństwie do prostych kół, ten widget generuje pełną, **12-elementową paletę** (odcienie, tony i tinty) dla każdego schematu:

- Monochromatyczne (*Monochromatic*): Pojedynczy kolor.
- Dopełniające (*Complementary*): Dwa kolory przeciwległe.
- Pokrewne (*Analogous*): Trzy kolory leżące obok siebie.
- Triada (*Triad*): Trzy kolory a między nimi są po trzy kolory odstępu.
- Rozszczepione (*Split*): Jeden kolor i dwa po jego przeciwnej stronie.
- Tetrada (*Tetradic*): Cztery kolory (dwie pary przeciwległe).


<data-color-harmony></data-color-harmony>

*   **Manipulacja HSV**: Zmieniając nasycenie (S) i jasność (V) koloru dominującego, wpływasz na całą grupę barw, zachowując ich matematyczną relację.
*   **Warianty Tonalne**: Dla każdego schematu (np. Triady) system automatycznie dobiera jaśniejsze i ciemniejsze warianty, tworząc gotowy warsztat pracy projektanta.
*   **Tryb Monochromatyczny**: Idealny do budowania głębi przy użyciu jednego koloru. Generuje paletę 12 profesjonalnych odcieni wybranej barwy.

> [!TIP]
> Pokrewne kolory z ustawieniem `S: 45%` | `V: 66%` da ci paletę idealnie stonowaną kolorystykę stosowaną w paletkach do makijażu.


---
