# Miedziana skrętka komputerowa i zarabianie RJ-45

Miedziana skrętka komputerowa (*Twisted Pair*) to najpopularniejsze medium w biurowych sieciach LAN. Składa się z 4 par (8 miedzianych żył) skręconych ze sobą i zakończonych wtykami RJ-45 (8P8C).

<div style="display:flex; justify-content:center; margin: 12px 0;">
  <figure style="margin:0; text-align:center; max-width:340px;">
    <img src="/public/courses/podstawy-sieci-komputerowych/Images/skretka-utp-real.jpg" alt="Przekrój rzeczywistego kabla skrętkowego UTP z czterema parami żył" style="width:100%; border-radius:8px; border:1px solid var(--border-color);" />
    <figcaption style="font-size:0.85em; color:var(--text-muted); margin-top:4px;">Rzeczywista skrętka UTP z widocznymi 4 skręconymi parami żył</figcaption>
  </figure>
</div>

> [!NOTE]  Dlaczego żyły są skręcone?
> Odbiornik stosuje **sygnalizację różnicową** (*Differential Signaling*): mierzy różnicę napięć między żyłami danej pary ($V_+ - V_-$). Zakłócenia elektromagnetyczne (*EMI*) z otoczenia indukują się w obu skręconych żyłach z jednakową fazą i amplitudą, dzięki czemu przy odejmowaniu sygnałów wzajemnie się wygaszają.

---

## 🛡️ Budowa kabla i norma ISO/IEC 11801 (wzór xx/yTP)

Norma ISO/IEC 11801 określa konstrukcję i sposób ekranowania skrętki za pomocą schematu:

![Konstrukcja skrętki komputerowej i oznaczenie ISO/IEC 11801 xx/yTP](/public/courses/podstawy-sieci-komputerowych/Images/skretka-budowa-przekroj.svg)

Aby poprawnie nazwać dowolny kabel skrętkowy, odczytuj jego budowę od zewnątrz do środka według wzoru <b>[ekran całego kabla (xx)] / [ekran pojedynczych par (y)] TP</b>:
1. <b>Płaszcz zewnętrzny:</b> Tworzywo PVC lub LSZH (*Low Smoke Zero Halogen*, bezhalogenowe, nierozprzestrzeniające ognia i niewydzielające żrących gazów w czasie pożaru). Pod płaszczem znajduje się biały sznurek (<b>Ripcord</b>) służący do wzdłużnego rozcinania osłony bez uszkodzenia żył.
2. <b>Pierwszy człon przed ukośnikiem (xx, ekran ogólny całego kabla):</b>
   - **U** (*Unshielded*): brak ekranu wokół całej wiązki.
   - **F** (*Foil*): cała wiązka owinięta wspólną folią aluminiową.
   - **S** (*Screen / Braid*): oplot z miedzianej siatki drucianej wokół całej wiązki.
   - **SF** (*Screen + Foil*): podwójny ekran ogólny złożony z siatki drucianej oraz folii.
3. <b>Drugi człon po ukośniku (y, ekran pojedynczych par):</b>
   - **U** (*Unshielded*): pary bez własnych ekranów.
   - **F** (*Foil*): każda z czterech par owinięta osobną folią aluminiową.
4. <b>Końcówka TP (*Twisted Pair*):</b> Cztery skręcone pary miedziane (pomarańczowa, zielona, niebieska, brązowa). Pomiędzy parami może znajdować się plastikowy separator (<b>Krzyżak / Spline</b>) ograniczający przesłuch zbliżny, a pod ekranem biegnie nieizolowany miedziany drucik (<b>Drain Wire</b>) do uziemienia.

| Konstrukcja kabla (od zewnątrz do środka)                  |   Ekran ogólny (xx)   | Ekran par (y) | Oznaczenie ISO/IEC 11801 |
| :--------------------------------------------------------- | :-------------------: | :-----------: | :----------------------- |
| Sam płaszcz i 4 nieekranowane pary                         |      Brak (`U`)       |  Brak (`U`)   | **U/UTP**                |
| Wspólna folia na całej wiązce, pary bez folii              |      Folia (`F`)      |  Brak (`U`)   | **F/UTP**                |
| Brak ekranu ogólnego, każda para w osobnej folii           |      Brak (`U`)       |  Folia (`F`)  | **U/FTP**                |
| Wspólna folia na wiązce oraz osobna folia na każdej parze  |      Folia (`F`)      |  Folia (`F`)  | **F/FTP**                |
| Oplot z siatki na wiązce oraz osobna folia na każdej parze |     Siatka (`S`)      |  Folia (`F`)  | **S/FTP**                |
| Siatka i folia na wiązce oraz osobna folia na każdej parze | Siatka + Folia (`SF`) |  Folia (`F`)  | **SF/FTP**               |

> [!WARNING] Bezwzględny wymóg uziemienia kabla ekranowanego:
> Kable ekranowane (np. **F/UTP**, **S/FTP**) posiadają pod folią metalowy drucik uziemiający (<b>Drain Wire</b>). Ekran kabla <b>musi zostać uziemiony w patchpanelu szafy RACK</b>.  
> Jeśli kabel ekranowany zostanie wpięty w plastikowe, nieuziemione gniazdo, metalowa folia **_zadziała jak antena odbiorcza_**: wychwyci zakłócenia radiowe z otoczenia i przekaże je prosto do żył transmisyjnych, dając gorszy sygnał niż podstawowy kabel U/UTP.

<data-connection-matcher title="Dopasuj budowę skrętki do standardu ISO/IEC 11801">
  <item left="Brak ekranu ogólnego + pary bez własnych ekranów" right="U/UTP"></item>
  <item left="Wspólna folia na całej wiązce + pary bez własnych ekranów" right="F/UTP"></item>
  <item left="Brak ekranu ogólnego + każda para w osobnej folii" right="U/FTP"></item>
  <item left="Wspólna folia na całej wiązce + każda para w osobnej folii" right="F/FTP"></item>
  <item left="Oplot z siatki na wiązce + każda para w osobnej folii" right="S/FTP"></item>
  <item left="Oplot z siatki i folia na wiązce + każda para w osobnej folii" right="SF/FTP"></item>
</data-connection-matcher>

---

## ⚡ Ewolucja kategorii skrętek (Cat 5e do Cat 8)

Kategoria kabla odzwierciedla pasmo częstotliwościowe, grubość żył oraz obecność wewnętrznych separatorów:

![Ewolucja budowy skrętek od kategorii Cat 5e do Cat 8](/public/courses/podstawy-sieci-komputerowych/Images/skretka-kategorie-ewolucja.svg)

| Kategoria  | Pasmo             | Prędkość znamionowa                                 | Maksymalny zasięg                      | Cechy konstrukcyjne                                                                                                  |
| :--------- | :---------------- | :-------------------------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Cat 5e** | $100\text{ MHz}$  | $1\text{ Gb/s}$                                     | $100\text{ m}$                         | Żyły 24 AWG ułożone luźno w kablu bez separatora.                                                                    |
| **Cat 6**  | $250\text{ MHz}$  | $1\text{ Gb/s}$ ($10\text{ Gb/s}$ do $55\text{ m}$) | $100\text{ m}$ ($55\text{ m}$ dla 10G) | Wewnątrz kabla znajduje się **plastikowy krzyżak (spline)** separujący pary.                                         |
| **Cat 6A** | $500\text{ MHz}$  | $10\text{ Gb/s}$                                    | $100\text{ m}$                         | Grubszy drut 23 AWG, ekranowanie par folią; standard współczesnych biur i zasilania **PoE** (*Power over Ethernet*). |
| **Cat 8**  | $2000\text{ MHz}$ | $25\text{ Gb/s} / 40\text{ Gb/s}$                   | **_30 m_**                             | Pełny podwójny pancerz S/FTP; skrócony zasięg do połączeń Top-of-Rack w centrach danych.                             |

---

## 🔌 Standardy ułożenia żył (rozszycia) we wtyku RJ-45: T568A a T568B

W żargonie sieciowym <b>rozszycie kabla</b> oznacza zdjęcie płaszcza zewnętrznego, rozplecenie par i ułożenie pojedynczych żył w złączu według określonego schematu. Wtyki modułowe oznacza się symbolem <b>xPyC</b>, gdzie <b>P</b> (*Positions*) to liczba wszystkich rowków na żyły, a <b>C</b> (*Contacts*) to liczba faktycznie obsadzonych złotych styków:
- <b>RJ-45 (8P8C):</b> 8 rowków i 8 złotych styków (standard Ethernet).
- <b>RJ-11 (6P4C / 6P2C):</b> 6 rowków, ale tylko 4 lub 2 styki pośrodku (telefonia stacjonarna i ADSL).
- <b>RJ-12 (6P6C):</b> 6 rowków i 6 styków (starsze centrale telefoniczne).

Wtyki RJ-45 (8P8C) zaciska się według dwóch standardów organizacji TIA/EIA:

![Kolejność żył we wtyku RJ-45 w standardzie T568A i T568B](/public/courses/podstawy-sieci-komputerowych/Images/wtyk-rj45-t568a-t568b.svg)

Widok od spodu wtyku (złote styki skierowane do góry, plastikowy zatrzask pod spodem):
- <b>T568A:</b> 1: Biało-Zielony, 2: Zielony, 3: Biało-Pomarańczowy, 4: Niebieski, 5: Biało-Niebieski, 6: Pomarańczowy, 7: Biało-Brązowy, 8: Brązowy.
- <b>T568B (powszechny):</b> 1: Biało-Pomarańczowy, 2: Pomarańczowy, 3: Biało-Zielony, 4: Niebieski, 5: Biało-Niebieski, 6: Zielony, 7: Biało-Brązowy, 8: Brązowy.

Różnica polega wyłącznie na zamianie miejscami pary zielonej z pomarańczową (piny 1-2 z pinami 3-6). Pary niebieska (piny 4-5) oraz brązowa (piny 7-8) leżą na identycznych pinach w obu standardach.

- <b>Kabel prosty:</b> Ten sam standard na obu końcach (zwykle T568B z obu stron; ponad $95\%$ instalacji).
- <b>Kabel krosowany:</b> Jeden koniec w T568A, drugi w T568B. Dawniej służył do bezpośredniego łączenia dwóch komputerów bez switcha.
- <b>Auto-MDIX:</b> Dzisiejsze porty kart sieciowych i switchy automatycznie wykrywają i zamieniają linie nadawcze z odbiorczymi w układzie krzemowym. Dzięki temu zwykły kabel prosty działa zawsze.

### 🧰 Narzędzia i elementy do zarabiania skrętki

| Element                             |                                                                                   Wygląd rzeczywisty                                                                                   | Zastosowanie w warsztacie                                                                                                                                               |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <b>Ściągacz izolacji (stripper)</b> | <img src="/public/courses/podstawy-sieci-komputerowych/Images/ściągacz-izolacji-obrotowy.jpg" alt="Obrotowy ściągacz izolacji do kabli UTP" style="width:140px; border-radius:6px;" /> | Obrotowe narzędzie z ostrzem zakładane na kabel w celu nacięcia i zdjęcia płaszcza zewnętrznego. Zbyt duży docisk grozi nacięciem izolacji pojedynczych żył i zwarciem. |
| <b>Zaciskarka (crimper)</b>         |               <img src="/public/courses/podstawy-sieci-komputerowych/Images/zaciskarka-rj45-real.jpg" alt="Zaciskarka RJ-45" style="width:140px; border-radius:6px;" />                | Narzędzie z gniazdami `8P8C` (RJ-45) i `6P` (RJ-11), obcinakiem do wyrównania żył oraz dociskiem wbijającym złote noże wtyku i blokującym płaszcz.                      |
| <b>Wtyk RJ-45 (8P8C)</b>            |                   <img src="/public/courses/podstawy-sieci-komputerowych/Images/wtyk-rj45-real.jpg" alt="Wtyk RJ-45 8P8C" style="width:140px; border-radius:6px;" />                   | Przezroczysta obudowa z 8 prowadnicami i 8 złotymi stykami IDC. Po włożeniu żył do samego czoła noże zaciskają się na miedzianych przewodnikach.                        |
| <b>Tester par (Master + Remote)</b> |          <img src="/public/courses/podstawy-sieci-komputerowych/Images/tester-sieciowy-real.jpg" alt="Tester par przewodów RJ-45" style="width:140px; border-radius:6px;" />           | Dwumodułowy tester sekwencyjny podający impuls na piny `1–8` w celu wykrycia przerw (*Open*), zwarć (*Short*) oraz zamienionych żył (*Miswire*).                        |

## 🔒 Stanowisko praktyczne: Zarabianie i testowanie kabla UTP

Zbuduj i przetestuj poprawny przewód sieciowy w symulatorze warsztatowym, aby odblokować dalszą część kursu:

<data-gate>
<data-rj45-crimper></data-rj45-crimper>
</data-gate>

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Kabel jako linia transmisyjna, pełny dupleks w DSP i skąd się bierze 100 m</span>
<span class="deep-dive-badge">FIZYKA SYGNAŁÓW & KRZEM PHY</span>
</summary>
<div class="deep-dive-content">

Na poziomie egzaminu kabel to po prostu „rura na bity” o zasięgu $100\text{ m}$. W rzeczywistości inżynierskiej przy setkach megaherców przewód przestaje być zwykłym drutem, a staje się **linią transmisyjną**.

### 1. Dlaczego tani tester zaświeci na zielono, a Gigabit Ethernet i tak nie ruszy? (Split Pairs i $Z_0$)

Zwykły tester par (taki jak w symulatorze powyżej) sprawdza jedynie ciągłość prądu stałego (DC) na pinach `1..8`. Jeśli na obu końcach kabla zamienisz ze sobą żyły `3` i `4` (łącząc `3-3` i `4-4` zgodnie z numeracją), wszystkie 8 diod zapali się po kolei na zielono.

Mimo to sieć Gigabit Ethernet zerwie połączenie lub spadnie do $10\text{ Mb/s}$. Dlaczego? Powstał błąd **Split Pairs** (rozbitych par). Sygnał różnicowy dla pary `3-6` płynie wtedy jedną żyłą z pary zielonej i jedną z pary niebieskiej, które nie są ze sobą skręcone.

Przy częstotliwościach powyżej $100\text{ MHz}$ o zachowaniu kabla decyduje **impedancja falowa**:
$$Z_0 = \sqrt{\frac{L}{C}}$$
gdzie $L$ to indukcyjność na metr kabla, a $C$ to jego pojemność. Skrętka ma $Z_0 = 100\ \Omega$. Rozplątanie żył przy wtyku RJ-45 powyżej $13\text{ mm}$ zmienia lokalnie $L$ i $C$, psując $Z_0$. Powstaje lokalne odbicie fali oraz silny przesłuch zbliżny (**NEXT**).

### 2. Jak 1000BASE-T nadaje i odbiera jednocześnie po tych samych czterech parach?

W starym Ethernecie 100BASE-TX jedna para służyła tylko do nadawania (TX), a druga tylko do odbioru (RX). W **Gigabit Ethernet (1000BASE-T)** wszystkie 4 pary jednocześnie nadają i odbierają w trybie **Full Duplex**.

Jak karta sieciowa rozróżnia cudzy sygnał od własnego na tym samym drucie?
1. **Kodowanie PAM-5:** Zamiast dwóch poziomów napięcia (`0` i `1`), układ PHY wysyła 5 poziomów (`-2 V, -1 V, 0 V, +1 V, +2 V`) z szybkością $125\text{ MBd}$ (**megabodów**). Jeden **bod (Bd)** to jeden symbol (jedna zmiana napięcia) na sekundę, a nie jeden bit. W PAM-5 każdy symbol niesie $2\text{ bity}$ danych (piąty poziom służy do korekcji błędów i kontroli ramki). Dlatego $125\text{ milionów symboli/s} \times 2\text{ bity} = 250\text{ Mb/s}$ na jednej parze, co na 4 parach daje $1000\text{ Mb/s}$.
2. **Kasowanie echa (Echo Cancellation) w DSP:** Układ krzemowy karty dokładnie zna napięcie, które sam w danej chwili wystawia na parę. Procesor DSP na bieżąco odejmuje własny sygnał oraz przesłuch z sąsiednich par od napięcia mierzonego na zaciskach. Zostaje czysty sygnał od drugiego końca kabla.

To także tłumaczy **zróżnicowany skok skrętu** w kablach Cat 6 (np. $15\text{ mm}$, $17\text{ mm}$, $19\text{ mm}$, $21\text{ mm}$). Gdyby dwie pary miały identyczny skok, układałyby się równolegle na całej długości i sprzęgały rezonansowo. Różna gęstość skrętu uśrednia pole magnetyczne na długości kabla niemal do zera, odciążając układ DSP.

### 3. Skąd wzięło się akurat $100\text{ m}$ dla skrętki?

Limit $100\text{ m}$ dla UTP nie wynika z tego, że po $101\text{ m}$ miedziany drut nagle przestaje przewodzić. To kompromis z czasów półdupleksu **CSMA/CD**: nadawca musiał zdążyć wykryć kolizję z najdalszego końca kabla, zanim skończy wysyłać najkrótszą ramkę ($64\text{ bajty} = 512\text{ bitów}$). Przy prędkości sygnału w miedzi rzędu ok. $0{,}66c$ (ok. $200\ 000\text{ km/s}$) czas przelotu w obie strony oraz budżet tłumienia przy $100\text{ MHz}$ ograniczyły segment właśnie do $100\text{ m}$.

</div>
</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Norma **ISO/IEC 11801 (`xx/yTP`)** opisuje osobno ekran całego kabla (`U`, `F`, `S`, `SF`) oraz ekran pojedynczych par (`U`, `F`).
- Kable ekranowane (**F/UTP**, **S/FTP**) bezwzględnie wymagają uziemienia żyły **Drain Wire** w patchpanelu szafy RACK, inaczej ekran zadziała jak antena zbierająca zakłócenia z otoczenia.
- Norma **T568A** i **T568B** różni się wyłącznie zamianą miejscami pary zielonej (piny 1-2 w A, 3-6 w B) z parą pomarańczową (piny 3-6 w A, 1-2 w B), a funkcja **Auto-MDIX** eliminuje konieczność ręcznego doboru kabli krosowanych.
- Maksymalny zasięg skrętki w sieciach Ethernet to **$100\text{ m}$** (z wyjątkiem Cat 8 skróconej do $30\text{ m}$ przy $25/40\text{ Gb/s}$).

---

<details>
<summary>📚 Źródła zdjęć użytych w lekcji (Wikimedia Commons)</summary>

- **Skrętka UTP:** [Wikimedia Commons (UTP_cable.jpg)](https://commons.wikimedia.org/wiki/File:UTP_cable.jpg)
- **Zaciskarka RJ-45:** [Wikimedia Commons (Crimping_tool_TP.jpg)](https://commons.wikimedia.org/wiki/File:Crimping_tool_TP.jpg)
- **Wtyk RJ-45 (8P8C):** [Wikimedia Commons (Uncrimped_rj-45_connector_close-up.jpg)](https://commons.wikimedia.org/wiki/File:Uncrimped_rj-45_connector_close-up.jpg)
- **Tester par RJ-45:** [Wikimedia Commons (Network_cable_tester.jpg)](https://commons.wikimedia.org/wiki/File:Network_cable_tester.jpg)

</details>
