# Narzędzia rysownicze i wypełnianie

Opanowanie koloru to teoria, ale to rysowanie buduje formę. W GIMPie linię możesz stworzyć na dziesiątki sposobów – od technicznie idealnych "schodków" po malarskie, miękkie smugi. Kluczem do profesjonalizmu jest zrozumienie, co dzieje się na krawędzi Twojego pędzla.

W tym module opanujesz "Wielką Piątkę":
1. **Ołówek** (Pencil)
2. **Pędzel** (Brush)
3. **Gradient** (Gradient)
4. **Gumka** (Eraser)
5. **Wypełnianie kubłem** (Bucket Fill)

![Interfejs narzędzi rysowniczych i wypełniania](/courses/gimp/Images/narzedzia_rysowania_i_malowania.png)

## ✏️ Ołówek vs Pędzel: Aliasing vs Antialiasing

Choć oba narzędzia służą do stawiania kresek, różni je fundamentalna matematyka krawędzi na siatce kwadratowych pikseli.

*   **Ołówek (Pencil)**: To narzędzie **Aliasingowe**. Piksel jest albo w 100% zamalowany, albo wcale. Powoduje to powstawanie charakterystycznych "schodków" na łukach. Idealny do pixel-artu 👾.
*   **Pędzel (Brush)**: Narzędzie **Antialiasingowe**. GIMP sprytnie dodaje półprzezroczyste piksele na krawędziach, by wygładzić przejście. Z daleka linia wygląda na idealnie gładką, ale w dużym przybliżeniu zobaczysz delikatne rozmycie.

![Pędzel i ołówek](/courses/gimp/Images/porównanie_ołówka_z_pędzlem.png)

### Czym jest Antialiasing?
To technika "oszukiwania" oka. Ponieważ ekrany składają się z kwadratowych pikseli, nie da się na nich narysować idealnego skosu, który nie będzie schodkowy. Antialiasing wypełnia puste miejsca pośrednimi kolorami, tworząc iluzję płynności obrazu.  
Na poniższym obrazku widać literę `e` z włączonym i wyłączonym antialiasingiem oraz jak wygląda w powiększeniu.

![Anti-aliasing i aliasing](/courses/gimp/Images/anti-aliasing_vs_aliasing.png)

<data-gate>
<data-quiz>
<question>
Tworzysz ikonę w stylu retro Pixel-Art (rozmiar 32x32 piksele). Którego narzędzia powinieneś użyć, aby krawędzie były idealnie ostre, bez żadnych półprzezroczystych pikseli?
</question>
<options>
<option>Pędzla, ponieważ z natury dąży do idealnej gładkości linii.</option>
<option correct>Ołówka, ponieważ jako narzędzie aliasingowe gwarantuje twarde, czyste krawędzie pikseli.</option>
<option>Obu zamiennie, ponieważ w tak małej skali oko ludzkie i tak nie zauważy różnicy.</option>
</options>
<div data-hint="error">
Zastanów się, które narzędzie kładzie kolor w systemie "wszystko albo nic" (100% koloru lub 0%).
</div>
<div data-hint="success">
Dokładnie tak! W Pixel-arcie każdy piksel musi być pod Twoją pełną kontrolą, bez "samowolki" GIMP-a w wygładzaniu krawędzi.
</div>
</data-quiz>
</data-gate>

## 🛠️ Opcje Narzędzia

Panel pod przybornikiem to zestawienie zasad działania wybranego narzędzia. Na początku definiujesz krycie czyli przezroczystość tekstury pędzla, którą wybierasz z pola niżej. Są to tak zwane brush-e.

Oto podstawowe parametry:
1.  **Rozmiar (Size)**: Szerokość i wysokość wybranej tekstury pędzla z zachowaniem proporcji.
2.  **Proporcje (Aspect ratio)**: Pozwala spłaszczyć lub rozciągnąć teksturę pędzla (np. do kaligrafii).
3.  **Kąt (Angle)**: Obraca teksturę pędzla.
4.  **Odstępy (Spacing)**: Pędzel to seria stempli. Przy 1% linia jest ciągła. Przy 50% zobaczysz wyraźne odstępy między śladami.
5.  **Twardość (Hardness)**: Decyduje o "rozmyciu" krawędzi. 100% to ostra krawędź, 0% to miękka mgiełka.
6.  **Siła (Force)**: (nie dotyczy ołówka) Decyduje o "nacisku". Przy małej sile kolor jest blady, ale ponowne malowanie w tym samym miejscu (po puszczeniu i wciśnięciu myszki) dodaje kolejną, nową warstwę koloru.

---

Wszystkie te wartości to liczby zmiennoprzecinkowe więc możesz wpisać daną wartość lub zmieniać je klawiszami strzałek lub scrollem (kółkiem) myszy.  
> Wybierz brush gwiazdy a następnie zmieniaj parametry proporcji i kąta obserwując jak twój pędzel nad płótnem się zmienia.

---

![Ustawienia narzedzia pedzla](/courses/gimp/Images/ustawinia_narzedzia_pędzla.png)

<data-gate>
<data-quiz>
<question>
Twoja linia pędzla wygląda jak "sznur koralików" (widzisz pojedyncze kółeczka zamiast gładkiej kreski). Który parametr powinieneś zmniejszyć, aby linia stała się ciągła?
</question>
<options>
<option>Twardość (Hardness).</option>
<option correct>Odstępy (Spacing).</option>
<option>Rozmiar (Size).</option>
</options>
<div data-hint="error">
Pamiętaj, że pędzel w GIMPie to nie ciągły strumień, ale seria powtarzających się obrazków. Co decyduje o dystansie między nimi?
</div>
<div data-hint="success">
Brawo! Zrozumienie, że linia to "gęsty stempel", to klucz do opanowania cyfrowego malarstwa.  
Ustawienie blisko $1\\%$ sprawi, że "stemple" pędzla będą bardzo gęsto obok siebie.
</div>
</data-quiz>
</data-gate>

### 🚀 Opcje Zaawansowane

Niektóre funkcje wydają się zagadkowe, ale dają ciekawe możliwości:

*   **Dynamika (Dynamics)**: Łączy zachowanie pędzla z ruchem myszy lub naciskiem tabletu.
    - **Opcje kolorów**: Pozwalają pędzlowi "zmieniać kolor w trakcie jazdy" na podstawie wybranego gradientu. Np. zaczynasz kreskę czerwoną, a kończysz niebieską.
*   **Drganie (Jitter)**: Rozrzucanie śladów pędzla wokół punktu kursora (efekt sprayu).
*   **Płynne rysowanie (Flow)**: Symuluje bezwładność pędzla. Brush nie nadąża za kursorem, co pozwala rysować idealnie gładkie łuki (Quality i Weight).
*   **Zablokowanie pędzla do widoku (Lock brush to view)**: Standardowo $50$px to $50$px na obrazku. Gdy przybliżasz obraz, pedzel ma stały rozmiar pikseli. Po włączeniu tej opcji, gdy bedziesz się przybliżać to pedzel bedzie się pomniejszał. Przykładowo po dwukrotnym przybliżeniu z włączoną tą opcją pędzel zmieni swój rozmiar z 50px na $25$px, a gdy oddalisz trzykrotnie to pędzel zmieni swój rozmiar z aktualnych $25$px na $75$px. 
*   ** Przyrostowe (Incremental)**: 
    - *WYŁACZONE*: Przy kryciu $30\\%$ ciągły ruch myszką nie ciemnieje.
    - *WŁĄCZONE*: Każde "najechanie" na własny ślad w jednym ruchu sumuje kolor ($30\\%$ + $30\\%$...).
*   **Rozszerz warstwy (Expand Layers)**: GIMP automatycznie powiększa warstwę, jeśli wyjedziesz pędzlem poza jej obecne granice. Płótno podstawowe nie będzie powiększane, to się tyczy tylko przypadków warstw mniejszych niż przestrzeń malarska.

## ⭐ Przykład: Kolorowe Gwiazdy

| Ustawienie | Wartość |
| --- | --- |
| Brush | gwiazdka |
| rozmiar | $61.00$ |
| Proporcje | $0.50$ |
| Kąt | $55.00$ |
| Odstęp | $97.0$ |

Aby uzyskać efekt jak niżej, włącz dynamikę i wybierz **Random Color**. Aby zastosować pełną gamę *Hue*, wybierz gradient `Full Saturation Spectrum CW`.

![Przykład ustawienia pędzla do rysowania gwiazdek w różnych kolorach](/courses/gimp/Images/przykład_ustawienia_pędzla_do_rysowania_gwiazdek_w_różnych_kolorach.png)

<data-gate>
<data-quiz>
<question>
Pracujesz nad bardzo drobnym detalem oka postaci przy 800% powiększeniu. Chcesz, aby pędzel nie zasłaniał Ci połowy ekranu, lecz zachował stałą, precyzyjną wielkość względem Twojego wzroku. Co aktywujesz?
</question>
<options>
<option>Płynne rysowanie (Flow).</option>
<option correct>Zablokowanie pędzla do widoku (Lock brush to view).</option>
<option>Przyrostowe (Incremental).</option>
</options>
<div data-hint="error">
Szukamy opcji, która "odkleja" rozmiar pędzla od skali obrazka i wiąże go ze skalą ekranu monitora.
</div>
<div data-hint="success">
Dokładnie! To świetne narzędzie do retuszu drobnych szczegółów bez konieczności ciągłej zmiany rozmiaru pędzla suwakiem.
</div>
</data-quiz>
</data-gate>

## 🌈 Gradienty

Wybierając narzędzie gradientu otrzymasz do dyspozycji okno z jego ustawieniami. W oknie tym możesz wybrać rodzaj gradientu z puli gotowych i go zmodyfikować.
Wybierając jeden z dostępnych kształtów:

- *Liniowy*: <img src="/courses/gimp/Images/gradienty/liniowy.png" alt="Gradient liniowy" style="border-radius: 0;margin: -4px;max-width: none;">
- *Dwuliniowy*: <img src="/courses/gimp/Images/gradienty/dwuliniowy.png" alt="Gradient dwuliniowy" style="border-radius: 0;margin: -4px;max-width: none;">
- *Promienisty*: <img src="/courses/gimp/Images/gradienty/promienisty.png" alt="Gradient promienisty" style="border-radius: 0;margin: -4px;max-width: none;">
- *Prostokątny*: <img src="/courses/gimp/Images/gradienty/prostokątny.png" alt="Gradient prostokątny" style="border-radius: 0;margin: -4px;max-width: none;">
- *Stożkowy (symetryczny)*: <img src="/courses/gimp/Images/gradienty/stożek_symetryczny.png" alt="Gradient stożkowy symetryczny" style="border-radius: 0;margin: -4px;max-width: none;">
- *Stożkowy (asymetryczny)*: <img src="/courses/gimp/Images/gradienty/stożek_asymetryczny.png" alt="Gradient stożkowy asymetryczny" style="border-radius: 0;margin: -4px;max-width: none;">
- *Rozlany (kąt)*: <img src="/courses/gimp/Images/gradienty/rozlany_kąt.png" alt="Gradient rozlany kąt" style="border-radius: 0;margin: -4px;max-width: none;">
- *Rozlany (sfera)*: <img src="/courses/gimp/Images/gradienty/rozlany_sfera.png" alt="Gradient rozlany sfera" style="border-radius: 0;margin: -4px;max-width: none;">
- *Rozlany (dół)*: <img src="/courses/gimp/Images/gradienty/rozlany_dół.png" alt="Gradient rozlany dol" style="border-radius: 0;margin: -4px;max-width: none;">
- *Spiralny (w prawo)*: <img src="/courses/gimp/Images/gradienty/spiralny_w_prawo.png" alt="Gradient spiralny w prawo" style="border-radius: 0;margin: -4px;max-width: none;">
- *Spiralny (w lewo)*: <img src="/courses/gimp/Images/gradienty/spiralny_w_lewo.png" alt="Gradient spiralny w lewo" style="border-radius: 0;margin: -4px;max-width: none;">

Rysując linię określasz kierunek początkowy i końcowy gradientu. Na tej lini masz też rąbki które jak klikniesz to możesz zmienić kolor przesunąć je w wzdłuż linii lub usunąć. Klikając na samą linię możesz dodać kolejne rąbki.

![Gradient liniowy z opcją usuwania przerwy](/courses/gimp/Images/gradient_z_usuwaniem_przery.png)

Spróbuj przy użyciu gradientu wytworzyć podobny obraz jak poniżej:

![Gradient karmelowej spirali](/courses/gimp/Images/gradient_karmelowej_spirali.png)

## 🧽 Gumka: Spisek

Gumka to w rzeczywistości **_Pędzel_**! Wszystkie programy grafiki rastrowej nas oszukują 😮.  
"Gumka"... w zależności czy warstwa posiada Kanał Alfa zachowuje się inaczej.

*   **Jeśli warstwa posiada Kanał Alfa**, gumka robi "dziury" (przezroczystość).
*   **Jeśli warstwa NIE posiada Kanału Alfa**, gumka maluje aktualnym kolorem tła.

Klikając prawym przyciskiem na warstwę w panelu warstw, zobaczysz opcje dotyczące Kanału Alfa.

![Kanał alfa warstwy](/courses/gimp/Images/kalan_alfa_warstwy.png)

<data-gate>
<data-quiz>
<question>
Używasz gumki na nowej warstwie, ale zamiast robić "dziury" do zdjęcia pod spodem, gumka maluje na biało. Co musisz zrobić, aby zaczęła działać poprawnie?
</question>
<options>
<option>Zmienić kolor narzędzia na przezroczysty.</option>
<option correct>Dodać Kanał Alfa do warstwy (prawym przyciskiem na warstwę -> Dodaj kanał alfa).</option>
<option>Użyć Ołówka zamiast Gumki.</option>
</options>
<div data-hint="error">
Zastanów się, co decyduje o tym, czy warstwa w ogóle "rozumie" pojęcie przezroczystości.
</div>
<div data-hint="success">
Świetnie! Bez Kanału Alfa warstwa jest jak kartka papieru. Możesz ją zamazać, ale nie możesz w niej zrobić "przezroczystej dziury".
</div>
</data-quiz>
</data-gate>

## 🪣 Wypełnianie: Dlaczego to nie działa?

Narzędzie **Wypełnianie kubłem** (Bucket Fill) to najczęstszy powód frustracji. Wszystko rozbija się o dwa filary:

### 1. Próg (Threshold)
Decyduje, jak bardzo podobne muszą być piksele, by GIMP je zamalował.
- **Niski (np. $15$)**: Wypełnia tylko niemal identyczny kolor. Zostawia "brudne" brzegi przy antyaliasingu.
- **Wysoki (np. $150$)**: Zamaluje połowę obrazka, ignorując różnice w cieniu.

Poniżej masz przykład jak działa progowanie wypełnienia:

> [!NOTE]
> Zauważ że aby praktycznie pozbyć się białego prześwitu poprzedniej warstwy przy pędzlu `2. Hardness 075` musiałem ustawić progowanie wypełnienia na $150$.

![Progowanie wypełnienia](/courses/gimp/Images/progowanie_wypełnienia.png)

### 2. Próbkowanie (Sample)
- **Próbkuj wszystkie warstwy (Sample Merged)**: Pozwala "wykrywać kształty" na wszystkich warstwach, ale wypełniać tylko tą aktywną. Możesz mieć kontur na jednej warstwie, a kolorować na czystej pod nią!

Poniżej na obrazku masz przedstawiony przykład wykorzystania samplingu.  
Przygotowano trzy warstwy:
- Warstwa z fioletowym tłem
- Warstwa z czarną otwartą kreską ala litera `c`
- Warstwa z białą otwartą kreską ala litera `u`, której krawędź wizualnie domyka czarną kreskę
Na najwyższej (chodź kolejność nie ma znaczenia), aktywnej warstwie i włączonym `Próbkowanie wszystkich warstw` zamalowałem na zielono obszar zamknięty przy pomocy liter `c` i `u`.

![Próbkowanie do wypełnienia kolorem](/courses/gimp/Images/próbkowanie_do_wypełnienia.png)

<data-gate>
<data-quiz>
<question>
Masz czarny kontur postaci na jednej warstwie. Chcesz wypełnić jego środek kolorem na nowej, pustej warstwie, ale po kliknięciu "kubłem" zalewa się cały ekran. Jaka funkcja pomoże GIMP-owi "zobaczyć" kontur z pozostałych warstw?
</question>
<options>
<option>Zwiększenie progu (Threshold).</option>
<option correct>Próbkuj wszystkie warstwy (Sample Merged).</option>
<option>Antialiasing pędzla.</option>
</options>
<div data-hint="error">
Problem polega na tym, że na aktywnej (pustej) warstwie nie ma żadnych granic. Jak zmusić narzędzie do szukania granic na innych warstwach?
</div>
<div data-hint="success">
Brawo! To jedna z najważniejszych funkcji przy profesjonalnym kolorowaniu rysunków i komiksów.
</div>
</data-quiz>
</data-gate>

---

Mam nadzieję że bardziej rozjaśniłem, a niżeli zamieszałem w głowie 😅.  
Było już wspomniane o warstwach i jak sam widzisz nie da się ich przemilczeć, więc w następnej lekcji je omówimy 😉.
