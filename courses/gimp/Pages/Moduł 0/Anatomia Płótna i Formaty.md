# Anatomia Płótna i Formaty

Zanim postawisz pierwszą kreskę, musisz zrozumieć arkusz, na którym pracujesz. Każda decyzja o rozmiarze, gęstości i formacie zapisu to kompromis między **jakością obrazu** a **wydajnością sprzętową**. Błąd na tym etapie to "puste kilobajty" lub, co gorsza, pikseloza, której naprawienie będzie karkołomnym wyzwaniem.

---

## 🎯 Atomy Projektu: PX vs PPI vs DPI

Zanim przejdziemy do rozmiarów, musimy rozbić chaos jednostek, który często prowadzi do katastrof w druku i internecie:

*   **Pixel (px)**: Najmniejsza i niepodzielna jednostka obrazu cyfrowego, „Atom” Twojego projektu.
*   **PPI (Pixels Per Inch)**: Gęstość pikseli "wypalonych" na Twoim ekranie. Im wyższy PPI, tym ostrzejszy obraz widzisz.
*   **Standard Retina**: Nazwa handlowa Apple, która stała się symbolem wysokiej jakości. Oznacza gęstość pikseli na tyle dużą ($300\text{+} \text{ PPI}$), że ludzkie oko z typowej odległości nie jest w stanie odróżnić pojedynczych punktów. Obraz staje się gładki jak wydruk w magazynie.
*   **DPI (Dots Per Inch)**: Gęstość kropli atramentu, które drukarka kładzie na papierze. 

> [!NOTE]
> **Mit Retiny i odległość**: Marketing dąży do standardu $300\text{+} \text{ PPI}$, ale to ma sens głównie w smartfonach, które trzymasz blisko twarzy. Na typowym monitorze biurowym $23.8"$ Full HD ($1920\text{x}1080$) masz ok. **$93\text{ PPI}$**. Czy to znaczy, że obraz jest "nieostry"?
> Nie, ponieważ siedzisz od niego znacznie dalej (ok. $60\text{-}70\text{ cm}$). Twoje oko przestaje widzieć pojedyncze piksele, gdy ich zagęszczenie pasuje do dystansu, z którego patrzysz.

> [!IMPORTANT]
> **Gdzie jest mit 72 DPI?**: W nowoczesnych ekranach (smartfony, TV 4K) stały przelicznik $72\text{ DPI}$ dla Internetu **nie istnieje**.
> To zaszłość z lat $80$. (standard PostScript). Dziś przeglądarka po prostu mapuje piksel pliku na piksel ekranu (lub jego wielokrotność).

> [!NOTE]
> **DPI** w pliku cyfrowym to tylko „podpowiedź” dla drukarki, dla komputera to martwa metadana i stosuje się **PPI**.


## 🕵️‍♂️ Research: Jak rzetelnie sprawdzić PPI (Przewodnik)

Strony takie jak [dpi.lv](https://dpi.lv/) to świetne narzędzia, ale mają jedną, potężną wadę: **przeglądarka internetowa nie wie, jak duży fizycznie jest Twój ekran**. Widzi tylko Twoją rozdzielczość (np. Full HD), więc na starcie „strzela” najpopularniejszą wartość cali laptopów (zwykle $13.3"$).

Aby poznać prawdziwą gęstość swojego sprzętu 😏, wykonaj ten proces:

1.  **Dla Smartfonów**: Sprawdź dokładny model w ustawieniach i wpisz go na [mgsm.pl](https://www.mgsm.pl/). Tam znajdziesz pole „Diagonal” (Przekątna) oraz gotowe wyliczenie PPI.
2.  **Dla Monitorów**: Znajdź model na obudowie i sprawdź na stronie producenta, ile ma dokładnie cali (np. $23.8"$).
3.  **Weryfikacja**: Wejdź na [dpi.lv](https://dpi.lv/) i wpisz te dane **ręcznie**.

> [!CAUTION]
> **Kropka vs Przecinek**: W polach tekstowych kalkulatorów online zawsze używaj kropki (np. `23.8`). Użycie polskiego przecinka (`23,8`) najczęściej wywali błąd `NaN` (Not a Number) lub zresetuje wynik do zera 😅.

### Porównanie w praktyce:
*   **Monitor Stacjonarny** ($23.8"$, $1920\text{x}1080$): **$93\text{ PPI}$**. Duży piksel, patrzymy z daleka.
*   **Współczesny Smartfon** (np. Galaxy A33, $6.4"$, $2400\text{x}1080$): **$411\text{ PPI}$**. Gigantyczne zagęszczenie, piksele są niemal niewidoczne nawet z bliska.

W designie musisz o tym pamiętać – to, co na monitorze wydaje się „duże”, na ekranie telefonu o wysokim PPI może stać się nieczytelnym drobiazgiem.

## 🖥️ Rozdzielczość i Budżet Pikseli

Całkowita liczba pikseli (**_szerokość_** $\times$ **_wysokość_**) to Twój budżet na detale.  
Spójrz na poniższy obrazek, masz na nim przedstawione skalę rozdzielczości w proporcji $16$:$9$ od SD do 8K. 

![Porównanie rozdzielczości SD, HD, FULL HD, 2K QUAD HD, 4K ULTRA HD, 8K ULTRA HD](/courses/gimp/Images/Rozdzielczości.png)

| Standard | Wymiary&nbsp;[px] | Proporcja | Zastosowanie |
| :--- | :--- | :---: | :--- |
| **HD** | $1280\text{x}720$ | $16\text{:}9$ | Per minimum na smartfonach do oglądania filmów, chodź nie jest to obraz jak żyleta. |
| **Full HD** | $1920\text{x}1080$ | $16\text{:}9$ | Obecny standard (aktualnie najlepsza proporcja jakości do ceny i wymaganej mocy obliczeniowej) |
| **4K&nbsp;(UHD)** | $3840\text{x}2160$ | $16\text{:}9$ | Profesjonalna obróbka, wysoka gęstość detali, druk wysokiej jakości. |

### ⚠️ Pułapka Skalowania (Aliasing)
Zawsze pracuj w rozdzielczości **identycznej lub zbliżonej** do docelowej. Jeśli przygotujesz grafikę zbyt małą, przeglądarka ją rozmyje. Jeśli zbyt dużą, algorytm skalowania (interpolacja) podczas renderowania strony może zepsuć cienkie linie (pojawią się przerwy lub artefakty). 

> [!TIP]
> Najbezpieczniej jest trzymać się wartości natywnych (np. $1920\text{px}$ szerokości dla standardu Full HD) lub ich **całkowitych mnożników** np. x2 (pamietasz potęgi dwójki? 😉), aby uniknąć błędów przy przeliczaniu pikseli przez silnik przeglądarki.

<data-gate>
<data-quiz>
<question>
Zaprojektowałeś bardzo szczegółową ikonę z cienkich, jednopikselowych linii. Co się stanie, jeśli pozwolisz przeglądarce drastycznie przeskalować ją w dół (np. o 73%)?
</question>
<options>
<option>Przeglądarka automatycznie pogrubi linie, aby zachować ich widoczność na mniejszym obszarze ekranu.</option>
<option correct>Interpolacja może spowodować "przerywanie" linii lub ich całkowite zniknięcie.</option>
</options>
<div data-hint="error">
Choć software (np. CSS) pozwala na wartości typu `2.5px`, to fizyczna matryca monitora nie potrafi zaświecić "połowy" lampki RGB. System musi wtedy "rozmyć" kolor na sąsiednie piksele (Anti-aliasing), co przy detalach 1px kończy się utratą ostrości i "mlekiem" zamiast żylety.
</div>
<div data-hint="success">
Świetnie! To zjawisko Aliasingu. Przeglądarka musi "uśredniać" piksele, co przy drobnych detalach i liniach 1px kończy się ich wizualną destrukcją. Dlatego projektujemy pod konkretny wymiar!
</div>
</data-quiz>
</data-gate>

---

## 📐 Proporcje i Formaty (Aspect Ratio)

Rama obrazu narzuca narrację. Rozmiar ostateczny można przeskalować, ale proporcji ($9$:$16$ vs $21$:$9$) nie zmienisz bez bolesnych "ucinek" kompozycji.

GIMP oferuje zestaw gotowych standardów rynkowych:
- **Print (Poligrafia)**: A$4$, wizytówki, ulotki (wyrażone w mm/cm).
- **Web & Social**: Ekrany $19$:$9$, posty na Instagram (kwadrat $1$:$1$), tła kanału na YouTube.
- **Ekrany TV/Video**: Miniaturek do filmów na YouTube ($16$:$9$).

> [!WARNING]
> GIMP w szablonach dla *Phone* podaje odwrotną proporcję np.: $19$:$9$ zamiast $9$:$19$. Chociaż standardem jest **_szerokość : wysokość_**, to ten szablon i tak będzie miał poprawną orientację pionową.

![Formatki gimpa](/courses/gimp/Images/formatki_gimp.png)

## 📏 Wybór Frontu Roboczego (Jednostki)

Jednostka miary zmienia sposób, w jaki GIMP myśli o Twoim płótnie:

| Front Roboczy | Jednostka | Dlaczego to ważne? |
| :--- | :--- | :--- |
| **Digital&nbsp;/&nbsp;Ekran** | **Pixels&nbsp;(px)** | Natywne środowisko matryc. 1 piksel w projekcie = 1 piksel na matrycy. |
| **Druk&nbsp;/&nbsp;Offset** | **mm&nbsp;/&nbsp;cm** | Świat fizyczny. Prowadnice chronią projekt przed gilotyną w drukarni. |
| **Typografia** | **Punkt&nbsp;(pt)** | To jedyne miejsce, gdzie liczba **72** ma znaczenie: $1\text{ cal}$ fizycznego wydruku to zawsze **72 punkty**. |

---

<data-gate>
<data-quiz>
<question>
Dostarczasz grafikę na ekran o standardzie Retina ($326\text{ PPI}$). Co musisz zrobić, aby obraz był tam idealnie ostry, a nie rozmyty?
</question>
<options>
<option>Zmienić w menu GIMPa jednostki domyślne z Pixels na PPI, aby "podbić" wirtualną gęstość pliku.</option>
<option correct>Przygotować projekt w znacznie wyższej rozdzielczości (więcej surowych pikseli), aby fizyczna matryca miała z czego wyświetlić detale.</option>
<option>Skalibrować swój monitor do standardu Gamma 2.2, co oszuka system i zwiększy ostrość plików cyfrowych.</option>
</options>
<div data-hint="error">
Pamiętaj: monitora nie obchodzą metadane w Twoim pliku ani ustawienia kolorów. On potrzebuje surowych danych (pikseli), aby wypełnić swoją gęstą siatkę Retina.
</div>
<div data-hint="success">
Brawo! "Retina" wymaga po prostu więcej surowca – czyli pikseli. Żadne magiczne suwaki w menu ani kalibracja barw nie stworzą nowych detali tam, gdzie ich nie ma w rozdzielczości obrazu.
</div>
</data-quiz>
</data-gate>

---

## 📂 Kontenery Danych: Formaty Plików (Eksport)

Format zapisu to "kontener", który decyduje, co z Twojej pracy przetrwa wysyłkę:

<data-tabs>
    <tabs>
        <b>.XCF (Fundament)</b>
        <b>.PNG (Alfa)</b>
        <b>.JPG (Kompresja)</b>
        <b>.WebP (Modern)</b>
    </tabs>
<div>

`.XCF`: Format roboczy (Projekt źródłowy)
Prywatny format GIMPa przeznaczony do pracy nad projektem. **Zawsze pracuj na tym formacie.**
- **Zalety**: Zachowuje warstwy, ścieżki i historię tekstu w formie edytowalnej.
- **_Wada_**: Tylko GIMP go otworzy. Nie nadaje się do wysyłki jako gotowy produkt końcowy.

</div>
<div>

`.PNG`: Król Przezroczystości i Krawędzi
Najlepszy format do eksportu grafik, które pierwotnie były wektorami lub mają przezroczyste tło.
- **Zalety**: Obsługuje **kanał alfa** (przezroczystość). Bezstratny, krawędzie pozostaną "ostre jak żyleta".
- **_Wada_**: Bardzo duża waga pliku przy zdjęciach.

</div>
<div>

`.JPG`: Historyczna Kompresja
Standard "na pożarcie" dla zdjęć, gdzie ludzkie oko wybacza drobne błędy.
- **Zalety**: Bardzo mała waga przy bogatych w detale zdjęciach.
- **_Wada_**: **Brak przezroczystości**. Stratny, uśrednia sąsiednie piksele, przez co każda edycja i zapis `JPG` do tego samego pliku trwale go niszczy (degradacja generacyjna).

</div>
<div>

`.WebP`: Nowoczesny standard opracowany przez **Google**
Następca, który przegonił kompresję rozmiaru `JPG` zachowując zalety `PNG`.
- **Zalety**: Mniejsza waga niż `JPG`, przy jednoczesnej obsługiwaniu przezroczystości. Standard dla nowoczesnych stron WwW.
- **_Wada_**: Bardzo stare przeglądarki mogą wymagać "obejścia", aby go wyświetlić.  
Windowsowski Paint też go nie ogarnia.

</div>
</data-tabs>

---

<data-gate>
<data-quiz>
<question>
Dlaczego profesjonaliści unikają wielokrotnego edytowania i zapisywania tego samego pliku `.JPG`?
</question>
<options>
<option>Z powodu limitu metadanych, format `.JPG` pozwala tylko na $50$ pełnych cykli zapisu zanim zablokuje plik.</option>
<option correct>Przez degradację generacyjną, każdy zapis `.JPG` ponownie kompresuje obraz, kumulując "szumy" i artefakty.</option>
<option>Ponieważ `.JPG` po trzecim zapisie automatycznie usuwa profil kolorów sRGB, co psuje kalibrację.</option>
</options>
<div data-hint="error">
`.JPG` usuwa dane, aby oszczędzić miejsce. Co się stanie, gdy usuniesz kolejne dane z już uproszczonego wcześniej pliku?
</div>
<div data-hint="success">
Dokładnie! To jak kserowanie odbitki z ksero, z każdym cyklem tracisz ostrość i detal.  
Dlatego pracujemy na `.XCF`, a `.JPG` robimy raz, na sam koniec.
</div>
</data-quiz>
</data-gate>

---

Znasz już mapę i atomy swojego płótna. Teraz czas na naukę posługiwania się pędzlem na tym płótnie! 🖼️
