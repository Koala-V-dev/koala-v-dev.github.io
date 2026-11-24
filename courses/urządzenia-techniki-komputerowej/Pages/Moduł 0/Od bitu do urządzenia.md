# Od bitu do urządzenia

W Binarnych Fundamentach IT wejście bramki NOT przyjmowało 0 albo 1. Na płytce to samo wejście jest połączone przewodem z wyjściem innego układu. Można zmierzyć napięcie tego przewodu względem masy. Właśnie od takiego pomiaru zaczyna się przejście od reguł logiki do elektroniki.

## 🔋 Napięcie i prąd w obwodzie

Rozważ baterię 3 V (3-woltową), wyłącznik i rezystor 1 kΩ (1-kiloomowy) połączone szeregowo. Bateria utrzymuje różnicę potencjałów między zaciskami. Tę różnicę nazywamy **napięciem**. V to wolt, jego jednostka. **Prąd** to przepływ ładunku. Jego natężenie mówi, ile ładunku przepływa w jednostce czasu. Jednostką natężenia jest amper (A).

Kiedy wyłącznik jest otwarty, bateria nadal ma około 3 V między zaciskami. Napięcie można też zmierzyć między stykami wyłącznika. W idealnym modelu prąd w obwodzie wynosi wtedy zero. Po zamknięciu wyłącznika powstaje droga przez rezystor od jednego zacisku baterii do drugiego.

![Dwa schematy obwodu. Przy otwartym wyłączniku prąd wynosi 0 mA, a przy zamkniętym 3 mA.](/public/courses/urządzenia-techniki-komputerowej/Images/obwod-otwarty-zamkniety.svg)

## 📏 Co ustala wartość prądu

**Rezystancja** wyraża, jak mocno dany element ogranicza przepływ prądu przy zadanym napięciu. Symbol Ω (grecka litera omega) oznacza om. Przedrostek k (kilo) oznacza tysiąc, więc 1 kΩ to 1000 Ω.

Na zdjęciu są rezystory przewlekane. Dwa druty przechodzą przez otwory w płytce, a kolorowe paski na korpusie kodują m.in. rezystancję.  
![Trzy rezystory osiowe. Każdy ma korpus z kolorowymi paskami i po jednym metalowym wyprowadzeniu z obu stron.](/public/courses/urządzenia-techniki-komputerowej/Images/rezystory-osiowe.png)
*Fotografia. Andy Oakley. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:Cjam-resistors.png).*

W modelu rezystora obowiązuje prawo Ohma. Jeśli zaniedbamy opór baterii i przewodów, całe napięcie źródła przypada na rezystor. Aby obliczyć natężenie $I$, dzielimy napięcie $U$ przez rezystancję $R$.

$$ I = \frac{U}{R} = \frac{3\thinspace \mathrm{V}}{1000\thinspace \Omega} = 3\thinspace \mathrm{mA} $$

Wynik to 3 mA (3 miliampery). Przedrostek m (mili) oznacza jedną tysięczną.

## 🎛️ Pomiar napięcia na wyjściu

Napięcie mierzysz **między dwoma punktami**. Na zdjęciu widać multimetr. Do pomiaru napięcia stałego ustaw pokrętło na **V⎓**. Czarną sondę podłącz do gniazda **COM**, a czerwoną do **VΩmA**, czyli gniazda z literą V. Na pokazanym mierniku do pomiaru baterii 3 V możesz wybrać zakres **20 V⎓**. Wyświetlacz podaje różnicę potencjałów czerwonej sondy względem czarnej. Zamiana sond odwraca znak odczytu.

<img src="/public/courses/urządzenia-techniki-komputerowej/Images/multimetr-dt830d.jpg" width="340" alt="Multimetr cyfrowy DT830D. Pod wyświetlaczem widać pokrętło, a w prawym dolnym rogu gniazda VΩmA i COM.">

*Fot. Ranjithkumar Murugesan. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:DT830D_DIGITAL_MULTIMETER.jpg).*

Gdy dwa rezystory połączysz szeregowo, płynie przez nie ten sam prąd. Z prawa Ohma wynika, że na większym rezystorze spadek napięcia jest większy. **Dzielnik napięcia** wykorzystuje tę zależność. Jego wyjście znajduje się między rezystorami. Gdy mierzysz wyjście względem ujemnego zacisku baterii, widzisz spadek napięcia na rezystorze po stronie tego zacisku.

## 🧰 Jak złożyć dzielnik na płytce stykowej

Pod otworami prawdziwej płytki są metalowe listwy. Dwie nóżki w otworach tej samej listwy są ze sobą połączone. Jeśli włożysz obie nóżki jednego rezystora w tę samą listwę, prąd może go ominąć. Na typowej płytce otwory po obu stronach środkowej szczeliny należą do osobnych listew. Układ szyn zasilających zależy od modelu. [Budowa płytki i widok metalowych listew](https://learn.sparkfun.com/tutorials/how-to-use-a-breadboard/anatomy-of-a-breadboard).

**W warsztacie** każda kolumna to jedna listwa. Na przykład B1, B2 i B3 to trzy otwory tego samego punktu **B**. Kolumny + i − łączą się z zaciskami baterii po podłączeniu jej do gniazda.

### 🔧 Przykład z dwoma rezystorami 1 kΩ

1. **Bez baterii** połącz przewodem **+ z A**, a drugim **C z −**. To doprowadza zasilanie do końców dzielnika.
2. Wstaw rezystor między **A i B**, a drugi między **B i C**. W B zajmą różne otwory, ale będą miały wspólne połączenie. **B jest wyjściem.**
3. Podłącz baterię. Ustaw **V⎓** i przyłóż czarną sondę do **−**. Czerwona sonda na **+** pokaże **3,00 V**. Przełóż ją do **B**. Teraz zobaczysz **1,50 V**, bo dwa jednakowe rezystory dzielą napięcie na pół.

![Przykład dzielnika. Przewód łączy plus z A. Rezystor 1 kΩ łączy A z B, drugi 1 kΩ łączy B z C. Drugi przewód łączy C z minusem. Czerwona sonda mierzy w B, czarna w minusie.](/public/courses/urządzenia-techniki-komputerowej/Images/dzielnik-na-plytce.svg)

## 🧪 Zadanie z pomiarem 1,00 V na wyjściu B

Zbuduj układ z dostępnych rezystorów, który da **1,00 V między B i −**. Jedna możliwość to użycie rezystora **1 kΩ** i **2 kΩ**. Możesz też połączyć kilka rezystorów i uzyskać ten sam podział napięcia.

**Warunek zaliczenia:** w trybie **V⎓** wyświetlacz pokazuje **1,00 V**, gdy czerwona sonda jest połączona elektrycznie z **B**, a czarna z **−**. Zatwierdź pomiar przyciskiem **Sprawdź układ**.

<data-gate>
  <data-breadboard data-scenario="series"></data-breadboard>
</data-gate>

## 🔌 Napięcie sygnału i masa

**Masa (GND)** to punkt odniesienia dla pomiaru napięcia. W naszym obwodzie jest nim ujemny zacisk baterii.

„Na wejściu są **3 V**” oznacza, że między wejściem a masą jest **3 V różnicy**. Gdy dwa układy mają wspólną masę, odbiornik mierzy sygnał względem tego samego punktu co nadajnik.

Porównaj każdy odczyt z zakresem dla przykładowego wejścia.

| Napięcie względem GND       | Przykładowy pomiar | Co gwarantuje dokumentacja |
| --------------------------- | ------------------ | -------------------------- |
| Od 0 do 0,8 V               | 0,3 V              | **0** (stan niski)         |
| Powyżej 0,8 V i poniżej 2 V | 1,4 V              | **Brak gwarancji odczytu** |
| Od 2 do 3,3 V               | 2,9 V              | **1** (stan wysoki)        |

Podczas zmiany stanu napięcie na krótko przechodzi przez zakres pośredni. Granice w tabeli dotyczą tego przykładu. Dla innego układu odczytasz je z jego dokumentacji.


<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Ile zakłócenia wytrzyma połączenie dwóch układów</span> <span class="deep-dive-badge">ELEKTRONIKA CYFROWA</span></summary>
<div class="deep-dive-content">

## 📐 Margines zakłóceń i obciążenie wejścia

Załóżmy, że wyjście w stanie wysokim daje co najmniej 2,7 V, a wejście drugiego układu rozpoznaje stan wysoki od 2,0 V. Różnica 0,7 V to **margines zakłóceń dla stanu wysokiego** w tym przykładzie. Jeżeli napięcie spadnie na wejściu odbiornika o 0,5 V, najgorszy przewidywany wynik to 2,2 V. Jeżeli spadnie o 0,9 V, wyjdzie 1,8 V, poza gwarantowanym zakresem.

Dla stanu niskiego różnicę odejmujesz w drugą stronę. Gdy odbiornik uznaje za zero najwyżej 0,8 V, a nadajnik gwarantuje najwyżej 0,4 V na wyjściu w stanie niskim, zostaje 0,4 V zapasu na wzrost napięcia. Patrz na wartości gwarantowane dla konkretnego zasilania i warunków pracy. Nominalne 3,3 V zasilania nie podaje jeszcze marginesu danego połączenia.

### 🔌 Skąd bierze się spadek po podłączeniu odbiornika

Wyobraź sobie linię podciągniętą do 3,3 V rezystorem 10 kΩ. Przy odłączonym odbiorniku płynie przez niego pomijalnie mały prąd, więc na linii zmierzysz prawie 3,3 V. Podłącz teraz odbiornik, który w uproszczonym modelu zachowuje się jak rezystor 10 kΩ do masy. Oba rezystory są w szeregu. Wypadkowa rezystancja wynosi 20 kΩ, a prąd 0,165 mA. Na każdym rezystorze odkłada się 1,65 V. Tyle wynosi teraz napięcie linii względem masy. Odbiornik z progiem 2 V utracił gwarancję odczytu jedynki, chociaż zasilanie nadal wynosi 3,3 V.

To **dzielnik napięcia**. Napięcie linii $U_{\mathrm{linia}}$ jest napięciem na dolnym rezystorze $R_2$. Zależność wynika z pomnożenia prądu płynącego przez oba rezystory przez $R_2$.

$$ U_{\mathrm{linia}} = U_{\mathrm{zas}}\frac{R_2}{R_1+R_2} $$

Zmiana górnego rezystora $R_1$ z 10 kΩ na 1 kΩ podniesie napięcie do 3,0 V przy tym samym odbiorniku. Zwiększy się jednak prąd, który musi odprowadzić układ, gdy wymusi na linii stan niski. W rzeczywistym projekcie dobór rezystora podciągającego wymaga więc sprawdzenia zarówno napięcia przy jedynce, jak i dopuszczalnego prądu wyjścia przy zerze. Rezystor 10 kΩ do masy był tu świadomie dobranym obciążeniem modelowym. Dla prawdziwego wejścia odczytaj prąd wejściowy z dokumentacji.

</div>
</details>

## <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Napięcie mierzysz między dwoma punktami. Prąd opisuje przepływ ładunku przez element.
- Przy sygnale cyfrowym odbiornik przypisuje stan logiczny do zakresu napięć względem swojego punktu odniesienia.
