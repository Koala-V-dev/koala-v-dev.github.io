# Media transmisyjne - kable i fale

Masz połączyć dwa urządzenia. Dzieli je 8 metrów w jednym pokoju, 90 metrów przez korytarze albo 180 metrów między budynkami. W każdym przypadku przesyłasz bity, ale nie powinieneś automatycznie wybierać tego samego medium.

W poprzedniej lekcji sygnał był fizycznym nośnikiem symboli. Teraz sprawdzisz, jak **miedź**, **światłowód** i **fale radiowe** zmieniają warunki, w których odbiornik rozpoznaje te symbole.

## 🧭 Najpierw wymagania, potem medium

Nie wybieraj kabla na podstawie jednego napisu, na przykład `10 Gb/s`. Najpierw odpowiedz na cztery pytania:

1. Jakiej szybkości bitowej naprawdę potrzebuje łącze?
2. Jaka jest długość całej drogi, razem z przewodami przy urządzeniach i punktami połączeń?
3. Czy w otoczeniu występują silne zakłócenia elektromagnetyczne albo różnice potencjałów między budynkami?
4. Czy urządzenia na obu końcach obsługują wybrane medium i ten sam wariant transmisji?

To ostatnie pytanie jest łatwe do przeoczenia. Sam światłowód nie określa jeszcze szybkości ani zasięgu. Potrzebne są zgodne nadajniki, odbiorniki, złącza oraz parametry całego toru.

## 🧵 Miedź: sygnał różnicowy w skręconych parach

W typowym okablowaniu Ethernet po miedzi informacja jest przenoszona przez pary przewodników. Odbiornik interesuje różnica między sygnałami w parze. Odpowiednia geometria i zrównoważenie pary pomagają ograniczać wpływ zakłóceń wspólnych.

Skręcenie przewodów nie tworzy jednak magicznej bariery. Jakość transmisji zależy również od:

- tłumienia sygnału;
- przesłuchów między parami i sąsiednimi kablami;
- odbić powodowanych niedopasowaniem;
- jakości zakończeń oraz zachowania geometrii par podczas montażu;
- zakłóceń docierających z otoczenia.

### 🏷️ Kategoria nie jest obietnicą dla samego kabla

Nazwy takie jak `Cat 6` i `Cat 6A` opisują klasy właściwości elementów okablowania. O działaniu połączenia decyduje jednak **kanał**, czyli cały tor między urządzeniami, a nie sam odcinek przewodu wyjęty z pudełka.

Przykładowo projekt 10GBASE-T przyjmował obsługę 10 Gb/s do 100 m na odpowiednim czteroparowym kanale klasy F oraz od 55 do 100 m na kanale klasy E. Nie oznacza to, że dowolny przewód z podobną etykietą osiągnie taki wynik po dowolnym montażu.

<info-block>
Praktyczna zasada brzmi: dobierz wariant Ethernet, wymagania kanału i długość jako jeden zestaw. Po instalacji tor powinien zostać sprawdzony zgodnie z wymaganiami, które ma spełniać.
</info-block>

### 🛡️ Ekranowanie pomaga tylko jako część systemu

Ekran może ograniczać sprzęganie zakłóceń, ale jego skuteczność zależy od konstrukcji kabla, złączy, ciągłości ekranu, instalacji i połączeń ochronnych. Sam napis `STP` nie dowodzi, że tor jest lepszy od poprawnie wykonanego toru nieekranowanego.

Jeśli środowisko jest trudne, nie zgaduj na podstawie skrótu. Ustal wymagania środowiskowe i sposób odbioru instalacji.

## 💡 Światłowód: światło też traci jakość

W światłowodzie informacja jest przenoszona przez zmiany sygnału optycznego. Rdzeń prowadzi światło, a płaszcz pomaga utrzymać je w strukturze włókna.

Światłowód ma dwie ważne zalety w porównaniu z miedzianym torem sygnałowym:

- nie przewodzi prądu między końcami łącza;
- samo włókno nie odbiera zakłóceń elektromagnetycznych tak jak metalowy przewodnik.

Nie oznacza to braku ograniczeń. Moc sygnału maleje po drodze, czyli występuje **tłumienie**. Impulsy mogą też rozszerzać się w czasie, czyli ulegać **dyspersji**. Oba zjawiska zmniejszają margines poprawnego odbioru.

### 🔦 Wielomodowy i jednomodowy

W światłowodzie wielomodowym sygnał może rozchodzić się wieloma modami. Różnice ich drogi sprzyjają dyspersji modalnej. Światłowód jednomodowy prowadzi jeden mod i pozwala budować inne klasy zasięgu.

Nie ucz się jednak reguły „wielomodowy ma zawsze X metrów, a jednomodowy Y kilometrów”. Zasięg zależy od konkretnego wariantu warstwy fizycznej, włókna, długości fali, nadajnika, odbiornika, złączy, spawów i zapasu mocy.

Przed zakupem sprawdź wspólnie:

1. wariant interfejsu po obu stronach;
2. typ włókna obsługiwany przez moduły;
3. dopuszczony zasięg oraz budżet strat;
4. zgodność złączy i polaryzacji.

<info-block>
Nigdy nie patrz w niezweryfikowane zakończenie włókna. Sygnał może być niewidoczny dla oka. Stan toru sprawdza się przeznaczonym do tego sprzętem i według procedury bezpieczeństwa.
</info-block>

## 📡 Fale radiowe: medium jest współdzielone

Połączenie bezprzewodowe usuwa kabel między urządzeniem a punktem dostępu, ale nie usuwa medium. Sygnał nadal przechodzi przez fizyczne środowisko, a inne nadajniki mogą korzystać z tego samego lub sąsiedniego zakresu częstotliwości.

Rodzina IEEE 802.11 opisuje zarówno warstwę fizyczną, jak i zasady dostępu do medium. Urządzenie nie może traktować kanału jak prywatnego przewodu. Musi współdzielić czas nadawania i radzić sobie z zakłóceniami, przeszkodami oraz innymi sieciami.

Dlatego szybkość pokazana w nazwie standardu lub panelu urządzenia nie jest tym samym co goodput aplikacji. Na wynik wpływają między innymi:

- szerokość i zajętość kanału;
- odległość, przeszkody i ustawienie anten;
- liczba aktywnych urządzeń;
- wybrany sposób kodowania i liczba strumieni;
- retransmisje oraz narzut protokołów.

Pasmo 6 GHz daje dodatkową przestrzeń dla systemów bezprzewodowych, ale nie jest „zupełnie puste”. Jest pasmem współdzielonym na zasadach określonych przez regulatora, a dostępne zakresy i moce zależą od kraju oraz klasy urządzenia.

## ⚖️ Trzy media, cztery kompromisy

| Pytanie | Miedź | Światłowód | Fale radiowe |
| :--- | :--- | :--- | :--- |
| Czy powstaje fizyczny tor między punktami? | tak | tak | nie w postaci kabla |
| Wrażliwość toru na EMI | zależna od konstrukcji i instalacji | włókno nie przewodzi sygnału elektrycznego | fale mogą być zakłócane przez inne emisje |
| Mobilność urządzenia | mała | mała | duża |
| Co ogranicza zasięg? | parametry całego kanału i wariant transmisji | budżet strat, dyspersja i wariant optyczny | propagacja, regulacje, zakłócenia i projekt radiowy |

Tabela nie wybiera medium za ciebie. Pokazuje, które ryzyko musisz sprawdzić.

## 🛠️ Punkt kontrolny: wybór toru

<data-gate>
  <data-quiz>
    <question>Dwa przełączniki stoją w oddzielnych budynkach, 180 m od siebie. Nie można umieścić urządzenia aktywnego po drodze. Otoczenie zawiera instalacje energetyczne, a projektant chce uniknąć elektrycznego połączenia budynków. Który kierunek projektu najlepiej spełnia te wymagania?</question>
    <options>
      <option>Dłuższy przewód miedziany, ponieważ zwiększenie długości nie zmienia parametrów kanału.</option>
      <option>Ekranowana skrętka, ponieważ ekran zawsze usuwa wpływ odległości i różnic potencjałów.</option>
      <option correct>Światłowód z modułami dobranymi do typu włókna, zasięgu i wymaganego wariantu Ethernet.</option>
      <option>Wi-Fi wybrane wyłącznie na podstawie największej szybkości zapisanej na pudełku.</option>
    </options>
    <div data-hint="error">Sprawdź jednocześnie dystans, brak urządzenia pośredniego, środowisko elektromagnetyczne i potrzebę izolacji elektrycznej.</div>
    <div data-hint="success">Światłowód usuwa metaliczny tor między budynkami. Nadal trzeba dobrać zgodne moduły, włókno i budżet strat.</div>
  </data-quiz>
</data-gate>

## 🧪 Odczytaj wymagania zamiast zgadywać

Wybierz jeden rzeczywisty przewód lub moduł sieciowy, który masz pod ręką albo którego kartę katalogową możesz otworzyć. Zapisz:

1. dokładne oznaczenie elementu;
2. medium i typ złącza;
3. obsługiwany wariant transmisji;
4. warunki podanej szybkości i zasięgu;
5. elementy, które muszą być zgodne po drugiej stronie łącza;
6. informację, której nadal brakuje do zatwierdzenia całego toru.

Jeśli karta podaje tylko największą szybkość, nie masz jeszcze kompletnego projektu. Wynikiem ćwiczenia może być świadomie zapisana luka, a nie wymuszona odpowiedź.

<details>
<summary>Sprawdź kompletność analizy po wykonaniu próby</summary>

Analiza jest kompletna, jeśli każda zaakceptowana wartość ma wskazane miejsce w karcie producenta albo właściwej specyfikacji. Sama nazwa handlowa nie potwierdza wariantu transmisji ani zasięgu.

Dla połączenia przewodowego lub optycznego sprawdź oba końce, medium, złącza, długość całego toru i warunki środowiskowe. Dla radia dopisz warunki kanału, regulacje oraz założenia dotyczące przeszkód i współdzielenia pasma.

Jeśli nie potrafisz potwierdzić zgodności drugiego końca, budżetu strat, dopuszczonej długości albo warunków podanej szybkości, zapisz dokładnie tę lukę. Poprawnym wynikiem jest decyzja „jeszcze nie zatwierdzam”, wraz z nazwą brakującego dowodu.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Medium wybiera się z wymagań.** Szybkość, długość, środowisko i zgodność końców tworzą jeden problem.
- **Kategoria przewodu nie opisuje samodzielnie gotowego łącza.** Liczą się właściwości całego kanału oraz jakość instalacji.
- **Światłowód także ma tłumienie i ograniczony zasięg.** O wyniku decydują włókno, moduły, połączenia, dyspersja i budżet strat.
- **Kanał radiowy jest współdzielony.** Szybkość warstwy fizycznej nie jest gwarancją goodputu aplikacji.
- **Dobra decyzja pozostawia ślad.** Zapisz wymagania, wybrany wariant oraz dane, których jeszcze nie potwierdzono.
