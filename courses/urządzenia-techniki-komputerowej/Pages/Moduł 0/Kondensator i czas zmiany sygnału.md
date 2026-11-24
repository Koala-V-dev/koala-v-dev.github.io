# Kondensator i czas zmiany sygnału

W dzielniku z poprzedniej lekcji dwa jednakowe rezystory dawały na wyjściu B około **1,50 V**. Gdy dolny rezystor zastąpisz rozładowanym kondensatorem, miernik po włączeniu zasilania pokaże najpierw prawie **0 V**, a potem napięcie zacznie rosnąć w stronę **3 V**. Sprawdzisz, ile czasu wyjście potrzebuje, żeby przekroczyć **2 V**, czyli przykładowy próg stanu wysokiego z poprzedniej lekcji.

## ⚡ Co gromadzi kondensator

Kondensator ma dwie przewodzące okładki oddzielone izolatorem. Po podłączeniu źródła na okładkach gromadzi się ładunek o przeciwnych znakach. Między okładkami powstaje pole elektryczne. **Pojemność** mówi, jaki ładunek przypada na jednostkę napięcia. Jednostką pojemności jest farad (F). Kondensator użyty w warsztacie ma **470 µF** (470 mikrofaradów).

![Kondensatory elektrolityczne w kilku obudowach, m.in. metalowe cylindry i małe prostopadłościenne elementy.](/public/courses/urządzenia-techniki-komputerowej/Images/kondensatory-elektrolityczne.jpg)

Na jednym ze srebrnych cylindrów u góry widać oznaczenia **35 V** i **470 µF**. Pierwsze podaje napięcie znamionowe, drugie pojemność 470 mikrofaradów. Przedrostek µ (mikro) oznacza jedną milionową. Wiele kondensatorów elektrolitycznych ma oznaczoną biegunowość. Sposób oznaczenia zależy od typu i obudowy, więc sprawdzaj opis konkretnego elementu. *Fot. Elcap. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:Electrolytic_capacitors-P1090328.JPG).*

Podłącz rozładowany kondensator do źródła 3 V przez rezystor. W chwili zamknięcia wyłącznika prawie całe napięcie źródła przypada na rezystor, więc prąd jest największy. W miarę ładowania rośnie napięcie na kondensatorze i maleje napięcie na rezystorze. Z prawa Ohma wynika, że prąd maleje. Po wystarczająco długim czasie napięcie na kondensatorze zbliża się do 3 V, a prąd ładowania do zera.

## 🔌 Po co kondensator jest przy układzie scalonym

Gdy bramki w układzie zmieniają stany, przez krótki czas mogą potrzebować więcej prądu. Ścieżki zasilania mają własne właściwości elektryczne, więc napięcie przy układzie może chwilowo spaść. Kondensator odsprzęgający, umieszczony blisko pinów zasilania, dostarcza część ładunku lokalnie. Po zmianie stanu zasilanie uzupełnia ładunek. Dlatego położenie małego kondensatora względem układu ma znaczenie.

Ta sama zdolność do przechowywania ładunku powróci w lekcji o RAM. Tam kondensator będzie częścią uproszczonego modelu komórki pamięci. W zasilaniu interesuje nas podtrzymanie napięcia, a w pamięci odróżnienie dwóch stanów odczytu.

## 🛠️ Naładuj kondensator na płytce

Do płytki, przewodów i multimetru z poprzedniej lekcji dołóż **kondensator elektrolityczny 470 µF** (6,3 V lub więcej), rezystory **10 kΩ i 22 kΩ**, wyłącznik do płytki i koszyk na dwie baterie AA. Do rozładowania użyjesz rezystora **1 kΩ**. Czas zmierzysz stoperem w telefonie.

Przy odłączonych bateriach znajdź na obudowie kondensatora pasek z minusami. Oznacza ujemną nóżkę. Na płytce wybierz osobne listwy na punkty **A** i **B**. Nóżki i przewody, które mają się spotkać w B, włóż do różnych otworów tej samej listwy.

| Element | Gdzie podłączyć |
| --- | --- |
| Wyłącznik | Między plusem baterii i A |
| Rezystor 22 kΩ | Między A i B |
| Kondensator 470 µF | Nóżka dodatnia w B, ujemna na minusie baterii |
| Multimetr w trybie V⎓ | Czerwona sonda w B, czarna na minusie baterii |

![Schemat ładowania. Bateria, wyłącznik i rezystor zasilają kondensator, a multimetr jest podłączony równolegle do kondensatora.](/public/courses/urządzenia-techniki-komputerowej/Images/ladowanie-rc-multimetr.svg)

1. Podłącz koszyk przy otwartym wyłączniku. Zamknij wyłącznik i uruchom stoper. Obserwuj, jak napięcie rośnie. Zanotuj czas, w którym miernik pierwszy raz pokaże co najmniej **2 V**.
2. Otwórz wyłącznik i odłącz koszyk. Zostaw sondy. Przyłóż rezystor **1 kΩ** między B i minus. Obserwuj spadek napięcia. Gdy odczyt spadnie poniżej **0,10 V**, usuń rezystor rozładowujący.
3. Zmień rezystor między A i B na **10 kΩ**. Podłącz koszyk, zamknij wyłącznik i powtórz pomiar. Porównaj oba czasy. Zmieniał się jeden element, więc możesz zobaczyć wpływ rezystancji na szybkość ładowania.

Przy baterii 3 V spodziewaj się około 11 sekund z rezystorem 22 kΩ i około 5 sekund z rezystorem 10 kΩ. Na rzeczywisty wynik wpływają m.in. napięcie baterii, tolerancja kondensatora i tempo odświeżania miernika. [Ładowanie i rozładowanie obwodu RC](https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits).

### 🧪 Ten sam pomiar w warsztacie

Jeśli nie masz części pod ręką, złóż ten sam obwód na wirtualnej płytce. Gniazdo baterii zasila kolumny **+** i **−**. Multimetr pokazuje napięcie i czas od ostatniej zmiany obwodu. Dobierz rezystor tak, żeby po włączeniu napięcie na rozładowanym kondensatorze osiągnęło **2 V między 4. a 7. sekundą**. Przed powtórką rozładuj kondensator tak jak na fizycznej płytce. Po siódmej sekundzie zatwierdź pomiar.

<data-gate>
  <data-breadboard data-scenario="timed-rc"></data-breadboard>
</data-gate>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Przewidź czas przekroczenia 2 V</span> <span class="deep-dive-badge">ELEKTRONIKA ANALOGOWA</span></summary>
<div class="deep-dive-content">

Dla rozładowanego kondensatora po zamknięciu wyłącznika napięcie rośnie zgodnie z zależnością

$$ U_C(t) = U_{\mathrm{zas}}\left(1-e^{-t/(RC)}\right). $$

Iloczyn $RC$ to stała czasowa. Dla $R=10\thinspace\mathrm{k}\Omega$ i $C=470\thinspace\mathrm{µF}$ wynosi $4{,}7\thinspace\mathrm{s}$. Po takim czasie kondensator osiąga około 63% napięcia baterii. Przy zasilaniu 3 V jest to około 1,9 V.

Aby znaleźć chwilę przekroczenia 2 V, podstaw $U_C=2\thinspace\mathrm{V}$ i $U_{\mathrm{zas}}=3\thinspace\mathrm{V}$. Otrzymasz $e^{-t/(RC)}=1/3$, a stąd

$$t=RC\ln(3)\approx5{,}16\thinspace\mathrm{s}.$$

Dla 22 kΩ czas rośnie w stosunku $22/10$, czyli do około 11,4 s. Zmierzony stosunek czasów możesz porównać z tym przewidywaniem, używając tego samego kondensatora i tych samych baterii.

</div>
</details>

## <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Napięcie na kondensatorze zależy od zgromadzonego ładunku. Przy ładowaniu przez rezystor zmienia się w czasie.
- Kondensator przy zasilaniu układu może przez krótki czas dostarczać ładunek, którego potrzebują przełączające się obwody.

[Ładowanie i rozładowanie obwodu RC w OpenStax](https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits).

