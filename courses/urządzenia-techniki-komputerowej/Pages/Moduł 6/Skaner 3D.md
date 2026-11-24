# Skaner 3D

Skan błyszczącej części ma dziury, a brakująca powierzchnia jest ważna dla dopasowania. Czy zagęszczenie siatki w programie może potwierdzić jej kształt?

## 📐 Od pomiarów do geometrii

**Chmura punktów** to zbiór zmierzonych lub odtworzonych pozycji. **Siatka** łączy wierzchołki w ściany. Tekstura opisuje wygląd powierzchni. Skaner może zbierać dane z różnych ujęć i łączyć je we wspólnym układzie współrzędnych.

W triangulacji laserowej położenie obserwowanego śladu lasera pozwala wnioskować o głębokości. Światło strukturalne wykorzystuje znany wzór i jego obraz na obiekcie. Fotogrametria rozpoznaje odpowiadające sobie fragmenty na zdjęciach wykonanych z różnych punktów. Odblaski, przezroczystość i zasłonięte obszary utrudniają pomiar. Zmiana oświetlenia, kąta, metody albo dopuszczone przygotowanie powierzchni mogą poprawić dane.

Gdy celem jest pasowanie, dodaj wymiar odniesienia i sprawdź gotowy model niezależnym pomiarem. Domknięcie dziury w siatce daje oszacowanie, którego nie należy traktować jako pomiaru.

## 📷 Odsłoń fragment, którego brakuje na zdjęciu

Połóż na stole matowy przedmiot z wyraźnymi szczegółami, na przykład pudełko z nadrukiem. Wybierz dwa miejsca na nadruku, które łatwo rozpoznać. Jedno z nich częściowo zasłoń stojącą z przodu kartką. Przedmiot i kartka zostają w miejscu przez całą próbę.

1. Zrób zdjęcie z lewej, a potem z prawej. Na obu zdjęciach znajdź niezasłonięty szczegół. Sprawdź, czy na obu widać też drugi punkt. Zapisz, które zdjęcia tworzą parę dla każdego punktu.
2. Zrób kolejne zdjęcie pod takim kątem, żeby odsłonić drugi punkt, ale nadal widzieć część tego samego nadruku co na jednym z wcześniejszych zdjęć. Znajdź nową parę dla odsłoniętego punktu. Jeżeli pozostaje widoczny tylko na jednym ujęciu, zrób jeszcze jedno zdjęcie z sąsiedniej pozycji.
3. Obróć się z aparatem wokół przedmiotu i wskaż powierzchnię, której wciąż nie widać w żadnym ujęciu. Zaplanuj, skąd zrobisz zdjęcia tej części i jaki fragment wspólny pozwoli je dopasować do pozostałych.

Powiększenie pierwszego zdjęcia nie odsłoni fragmentu zasłoniętego kartką. Właśnie dlatego przy fotogrametrii trzeba zaplanować ujęcia z różnych kierunków, które częściowo się pokrywają. Przy fotografowaniu całego przedmiotu przechodź wokół niego małymi krokami i zachowaj stałe oświetlenie. [Zbieranie zdjęć do fotogrametrii w dokumentacji Meshroom](https://meshroom-manual.readthedocs.io/en/latest/capturing/capturing.html).

## 📏 Sprawdź skalę gotowego skanu

Jeśli masz skaner 3D lub gotową rekonstrukcję fotografowanego przedmiotu, zmierz fizycznie jeden łatwo dostępny odcinek. Użyj jego długości do ustawienia skali modelu. Potem sprawdź **dwa inne wymiary**, na przykład szerokość przeciwległej ściany i rozstaw dwóch otworów. Jeśli ściany się zgadzają, a jeden otwór pozostaje za mały, zanotuj lokalną rozbieżność i obejrzyj zdjęcia, na których widać jego krawędź. Dalsze przeskalowanie całego modelu zmieni również wymiary ścian.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Prosty model głębi stereo</span> <span class="deep-dive-badge">GEOMETRIA</span></summary>
<div class="deep-dive-content">

Dla skalibrowanych, wyrównanych obrazów współrzędne poziome punktu różnią się o $d$ pikseli. Gdy rozstaw kamer wynosi $B$, a ogniskowa $f$ jest wyrażona w pikselach, podobieństwo trójkątów daje $d=fB/Z$. Rozwiązując względem głębokości, otrzymujesz

$$ Z=\frac{fB}{d}. $$

W modelu dla $f=800\thinspace\mathrm{px}$, $B=0{,}10\thinspace\mathrm{m}$ i $Z=2\thinspace\mathrm{m}$ różnica wynosi 40 px. Odczyt 39 px daje około 2,051 m. Po podwojeniu rozstawu różnica rośnie do 80 px, a odczyt 79 px daje około 2,025 m.

Dla niewielkiego błędu $\Delta d$ można oszacować jego wpływ z pochodnej funkcji $Z(d)$. Przy danym rozstawie i ogniskowej błąd głębokości rośnie w przybliżeniu z kwadratem głębokości:

$$ |\Delta Z| \approx \frac{fB}{d^2}|\Delta d| = \frac{Z^2}{fB}|\Delta d|. $$

Większy rozstaw ogranicza ten błąd, jeśli obie kamery nadal widzą punkt i można poprawnie dopasować jego obrazy. Kartka w ćwiczeniu pokazuje, kiedy ten warunek przestaje obowiązywać.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Planuj nakładające się ujęcia, kontroluj skalę i oddziel powierzchnię zmierzoną od zrekonstruowanej.

