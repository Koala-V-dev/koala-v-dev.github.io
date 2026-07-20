# Instalacja i Pierwsze Uruchomienie

_**GIMP**_ (*GNU Image Manipulation Program*) oparty jest na filozofii wolnego oprogramowania z ekosystemu **_GNU_**. Masz do niego pełny, darmowy dostęp i możesz go używać bez opłat licencyjnych ("haraczu") dla korporacji.

Pamiętaj, aby pobierać program wyłącznie z autoryzowanego źródła:  
**Oficjalny kanał dystrybucji:** [www.gimp.org](https://www.gimp.org/downloads/)

---

## 🛠️ Pierwsza Konfiguracja (Personalizacja)

Uruchomienie GIMP 3.0.8 powoduje wyświetlenie dwóch okien. Skupmy się na tym mniejszym.  
Pierwsze uruchomienie to domyślna karta **Welcome**. Jeżeli utworzysz nowy projekt, to kolejne uruchomienia będą na karcie **Create**.  
Popatrzmy na zakładkę **Personalize**. 

![Okienko powitalne programu GIMP 3.0.8](/courses/gimp/Images/welcome_gimp.png)

Na start zaleca się:
- **Color scheme (Dark Colors)**: Motyw ciemny znacząco odciąża wzrok, eliminując "jarzenie" białego tła interfejsu, co jest kluczowe przy wielogodzinnej pracy.
- **Use symbolic icons if available**: Włącz tę opcję, aby uzyskać **Ikony Monochromatyczne**. Jaskrawe kolory w przyborniku podświadomie zakłamują Twoją percepcję barw w edytowanym zdjęciu (zjawisko kontrastu symultanicznego).
- **Grupy narzędzi**: Domyślnie GIMP grupuje podobne narzędzia. Jeśli wolisz mieć wszystko "na wierzchu" bez rozwijania list, **wyłącz** przełącznik "Grupy narzędzi".
- **Merge menu and title bar (requires restart)**: Ta opcja bedzie wymagała ponownego uruchomienia programu. Na poniższym obrazie demonstruję jak wygląda interfejs górnej belki z wyłączoną opcją na górze oraz z włączoną opcją na dole. 

![Porównanie: Narzędzia zgrupowane (góra) vs. rozgrupowane (dół)](/courses/gimp/Images/interface_pierwsze_ustawienie.png)

---

## 👁️ Ergonomia i Optyka: Dlaczego to ważne?

Wybór motywu interfejsu to nie tylko kwestia estetyki, ale przede wszystkim biologii Twojego oka i jasności otoczenia. To drugie jest szczególnie kluczowe w budowaniu twojej preferencji.  
U mnie preferencja do ciemnego motywu jest silniejsza ze względu na większą częstotliwość kontaktu z ekranami w godzinach wieczornych i nocnych oraz światłowstręt 🧛.

<data-tabs>
    <tabs>
        <b>🎨 Obiektywizm Barw</b>
        <b>🌙 Komfort Nocny</b>
        <b>👓 Dostępność i Optyka</b>
    </tabs>

<div>
Percepcja barwy jest procesem względnym — mózg interpretuje kolor w odniesieniu do otoczenia. Intensywne, nasycone elementy interfejsu mogą zaburzać ocenę barw na obrazie, co wynika z mechanizmu **kontrastu symultanicznego**. Oko i mózg automatycznie „kompensują” kolory, aby utrzymać równowagę w polu widzenia.

> [!IMPORTANT]
> Neutralne, nienasycone ikony minimalizują wpływ otoczenia na percepcję barw. Dzięki temu użytkownik ocenia kolorystykę obrazu zgodnie z faktycznymi wartościami zapisanymi w pliku, a nie z subiektywnym wrażeniem wynikającym z tła interfejsu.
</div>

<div>
W ciemnym otoczeniu źrenica rozszerza się, aby wpuścić więcej światła. Gdy ekran jest bardzo jasny, dochodzi do gwałtownych zmian średnicy źrenicy przy każdym przeniesieniu wzroku między monitorem a otoczeniem. Taka adaptacja wzrokowa zwiększa zmęczenie i może prowadzić do tzw. **olśnienia kontrastowego**.

> [!TIP]
> Zaleca się stosowanie delikatnego, rozproszonego oświetlenia za monitorem (tzw. bias lighting). Zmniejsza ono różnicę luminancji między ekranem a otoczeniem, stabilizuje pracę źrenicy i poprawia komfort widzenia podczas długotrwałej pracy.
</div>

<div>
Przy **astygmatyzmie** światło nie ogniskuje się w jednym punkcie, lecz wzdłuż linii, co powoduje rozmycie i zjawisko **halacji** — jasne elementy na ciemnym tle mogą wyglądać na „rozlane”, otoczone poświatą lub promieniujące. Efekt ten nasila się przy wysokim kontraście i dużej jasności.

> [!NOTE]
> Aby zmniejszyć halację, warto stosować motywy o umiarkowanym kontraście (np. ciemnoszare tło zamiast czarnego) oraz unikać nadmiernej jasności ekranu, szczególnie w warunkach słabego oświetlenia.
</div>

</data-tabs>

## ⚒️ Przygotowanie stanowiska: diagnostyka Twojego „płótna”
GIMP jest już zainstalowany, ale zanim postawisz pierwszą kreskę, musisz zaufać swojemu monitorowi.  
Monitor to Twoje jedyne okno na świat projektu. Jeżeli przekłamuje jasność lub barwy, Twoja praca będzie wyglądać inaczej na każdym innym ekranie.

Współczesna grafika opiera się na dwóch dominujących technologiach matryc, które różnie reagują na światło:
*   **Matryce IPS**: Standard w pracy graficznej. Oferują świetne kąty widzenia, ale cierpią na tzw. „IPS Glow” — czerń nigdy nie jest w nich idealnie czarna, lecz lekko świecąca.
*   **Matryce OLED**: Nowoczesny standard mobilny i premium. Tutaj piksel potrafi się całkowicie wyłączyć, dając „nieskończoną czerń”, co jednak często prowadzi do problemu *Black Crush* (zalewania detali w cieniach).

Poniższy test pozwoli wizualnie ocenić, czy ekran nie gubi detali i czy jego ustawienia są zbliżone do **Gamma 2.2**.

> [!IMPORTANT]
> To diagnostyka wizualna, a nie kalibracja. Dokładna kalibracja wymaga kolorymetru i dedykowanego programu, który mierzy ekran oraz tworzy profil ICC. GIMP może później korzystać z systemowego profilu monitora w ustawieniach zarządzania kolorem.

<data-calibration></data-calibration>

## 📒 Jak sprawdzić monitor w 4 krokach:
1.  **Fundament Jasności (Test Gamma):** To najważniejszy krok. Twoim celem jest uzyskanie płynnej krzywej jasności.  
Patrz na koło **_CEL:2.2_** (możesz zmrużyć oczy lub użyć funkcji rozmycia). Jeśli koło wyróżnia się na tle wzoru, Twój monitor „przypala” lub „gasi” średnie tony. Uzyskanie idealnej krzywej gamma może okazać się bardzo trudne, ale warto zbliżyć się do ideału 😉.
2.  **Odcięcie Czerni (Cienie):** Tutaj zobaczysz różnicę między technologiami matryc. _**OLED**_ wyłącza piksele, a _**IPS**_ zmniejsza natężenie podświetlenia. 
    - Na _**OLED**_ próbka V:2 powinna zniknąć, a `V:8` być widoczna dopiero po zbliżeniu twarzy. 
    - Na _**IPS**_ czerń zawsze będzie lekko „świecić”, więc `V:8` powinien być dostrzegalny z odległości około $20cm$.  
3.  **Czystość Świateł:** Graficy często przesadzają z kontrastem, tracąc detale w chmurach czy na białych ubraniach. Próbka `V:254` musi być ledwo odróżnialna od bieli. Jeśli zlewa się całkowicie to musisz zmniejszyć kontrast.  
Musisz czuć granicę między „białym” a „prawie białym” 🌫️.
4.  **Neutralność Barwna (Balans Bieli):** Twoje oczy szybko przyzwyczajają się do błędu (np. zbyt żółtego ekranu). Spójrz na szarą rampę. Jeśli widzisz tam jakikolwiek zafarb (róż, cyjan, zieleń), użyj ustawień <span class="color-box"><span class="R">R</span><span class="G">G</span><span class="B">B</span></span> w menu monitora, by go „wyzerować”.

> [!tip]
> **Zasada 30 minut:** Nigdy nie kalibruj monitora tuż po włączeniu. Matryca musi się „rozgrzać” (osiągnąć stabilność termiczną), co zazwyczaj trwa około pół godziny. Dopiero wtedy kolory stają się wiarygodne.

---

<data-gate>
<data-quiz>
<question>
Z jakiego powodu profesjonalni graficy najczęściej wybierają monochromatyczne (szare) ikony interfejsu zamiast ich kolorowych wersji?
</question>
<options>
<option>Kolorowe ikony mają negatywny wpływ na czas renderowania pędzli przez procesor graficzny podczas pracy w 8K.</option>
<option correct>Jaskrawe kolory przybornika obniżają zdolność ludzkiego oka do obiektywnego oceniania barw w samym projekcie.</option>
<option>Ikony monochromatyczne zajmują znacznie mniejszą ilość pamięci operacyjnej RAM podczas długotrwałych sesji.</option>
</options>
<div data-hint="error">
Skup uwagę na naturalnej aklimatyzacji gałki ocznej. Kontrasty w strefie UI zakłamują postrzeganie kolorów przy faktycznym projekcie na którym będziesz operować.
</div>
</data-quiz>
</data-gate>

---
Monochromatyczność i ciemny motyw to fundament profesjonalnego stanowiska. A jak reagują Twoje oczy? 😎
