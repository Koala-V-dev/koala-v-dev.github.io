# Zasilanie chłodzenie i bezpieczny montaż

Komputer działa na pulpicie, ale wyłącza się pod obciążeniem. Zapisz, jak rozdzielisz problem temperatury od problemu zasilania.

## 🌡️ Obserwuj zanim wymienisz część

Zasilacz dostarcza wymagane napięcia i musi obsłużyć obciążenie komponentów. **Sprawność** określa stosunek mocy oddawanej do pobieranej. Do doboru użyj wymagań producentów, dostępnych złączy oraz zapasu na chwilowe skoki obciążenia. W modularnym zasilaczu stosuj wyłącznie przewody zatwierdzone dla tego modelu.

Radiator odbiera ciepło, pasta termiczna poprawia kontakt, a wentylator pomaga przenieść ciepło do powietrza. **Throttling** oznacza ograniczenie pracy w celu utrzymania dopuszczalnych warunków. Gdy temperatury dochodzą do limitu, zegar może spaść przed wyłączeniem. Wzrost temperatury i spadek taktowania podczas tej samej pracy to trop, który możesz sprawdzić po korekcie chłodzenia.

Przed pracą wewnątrz wyłącz komputer, odłącz zasilanie i stosuj ochronę przed wyładowaniem elektrostatycznym (ESD) zgodnie ze stanowiskiem serwisowym. Trzymaj płytki za krawędzie. Zasilacz pozostaw zamknięty.

## 🔌 Co się dzieje za bezpiecznikiem

Bezpiecznik topikowy włączasz **szeregowo** z chronionym obciążeniem. Prąd płynie przez jego wkładkę. Przy odpowiednio dużym przeciążeniu wkładka nagrzewa się i przerywa obwód. W rzeczywistym bezpieczniku czas zadziałania zależy od prądu. W warsztacie używamy idealizowanego progu **2 mA**, żeby skutek był od razu widoczny. [Charakterystyki czasowo-prądowe bezpieczników](https://www.littelfuse.com/assetdocs/littelfuse-fuseology?assetguid=c81c1a21-b903-44b6-b46d-180c48f7c3c5).

1. Podłącz bezpiecznik między **+ i A**, a rezystor **2 kΩ** między **A i −**. Wstaw baterię. Zmierz **A względem −**. Odczyt powinien być bliski 3 V.
2. **W symulatorze** dodaj wyłącznik równolegle do rezystora, między **A i −**. Zamknij go. Bezpiecznik przerwie dopływ prądu, a miernik w A pokaże 0 V.
3. Otwórz wyłącznik. Napięcie w A pozostanie zerowe, bo wkładka jest przepalona. Wymień bezpiecznik i sprawdź, czy zasilanie wróciło.

<data-breadboard data-scenario="power"></data-breadboard>

## 🧪 Zmierz, jak ustawienie komputera wpływa na chłodzenie

Przeprowadź próbę na sprawnym komputerze. Zmienisz tylko dostęp powietrza. Jeśli komputer stoi w otwartej wnęce biurka, porównaj pracę we wnęce i poza nią. Jeśli używasz laptopa z wlotem od spodu, porównaj płaski twardy blat i stabilną otwartą podstawkę. W obu ustawieniach zostaw wloty i wyloty odsłonięte.

1. W Windows uruchom **HWiNFO w trybie Sensors-only**. Znajdź **CPU Package** na platformie Intel lub **CPU (Tctl/Tdie)** na AMD. Jeśli widzisz wiersz **Thermal Throttling** dla CPU, zapisz jego stan. Wybierz te same czujniki do obu prób. [Nazwy czujników w HWiNFO](https://www.hwinfo.com/forum/threads/cpu-temp-sensors-explanation.5597/).
2. Na pulpicie odczytaj temperaturę początkową. Uruchom **Narzędzia → Test wydajności** w Menedżerze plików 7-Zip na dwie minuty. Użyj tych samych ustawień testu i trybu zasilania w obu próbach. Pod koniec zapisz temperaturę, wynik kompresji i stan ograniczenia termicznego. Zakończ test wcześniej, jeśli komputer traci stabilność.
3. Po zakończeniu wyłącz komputer przed zmianą jego ustawienia. W drugiej próbie zaczekaj, aż temperatura początkowa będzie zbliżona do tej z pierwszej. Powtórz pomiar.

| Ustawienie | Temperatura przed testem | Temperatura pod koniec | Wynik kompresji | Ograniczenie termiczne |
| --- | --- | --- | --- | --- |
| Pierwsze | | | | |
| Drugie | | | | |

Jeśli w drugim ustawieniu procesor jest chłodniejszy przy podobnym wyniku kompresji, po zmianie ustawienia ta sama praca przebiegała przy niższej temperaturze. Jeśli temperatura jest podobna, ale wynik rośnie i znika sygnał ograniczenia termicznego, procesor mógł wykorzystać lepsze warunki do szybszej pracy. Jeżeli różnica jest mała, powtórz próbę przed wyciągnięciem wniosku. Odczyt temperatury CPU i wynik testu pomagają ocenić chłodzenie w tych warunkach. Do rozpoznania problemu z zasilaczem potrzebujesz osobnych pomiarów. [Ograniczenie termiczne według Intel](https://www.intel.com/content/www/us/en/support/articles/000088048/processors.html).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Opór cieplny na dwóch odcinkach</span> <span class="deep-dive-badge">MODEL CIEPLNY</span></summary>
<div class="deep-dive-content">

Tak jak prąd zależy od różnicy napięć i rezystancji, strumień ciepła w uproszczonym modelu zależy od różnicy temperatur i oporu cieplnego. Dla styku procesora z radiatorem zapisujemy $P_{\mathrm{ciepło}}=(T_{\mathrm{CPU}}-T_{\mathrm{rad}})/R_{\mathrm{styk}}$. Opór cieplny mierzymy w kelwinach na wat. Różnica jednego kelwina ma tę samą wielkość co różnica jednego stopnia Celsjusza.

Po ustaleniu temperatur, przy stałej mocy, ta sama ilość ciepła na sekundę przechodzi przez styk i z radiatora do powietrza. Spadki temperatury na obu odcinkach się dodają:

$$T_{\mathrm{CPU}}-T_{\mathrm{ot}} = P\left(R_{\mathrm{styk}}+R_{\mathrm{pow}}\right).$$

Dwa różne zestawy oporów mogą dawać podobną temperaturę CPU. Pomiar w połowie drogi, na radiatorze, ujawnia, na którym odcinku występuje większa różnica temperatur. Na początku testu część energii nagrzewa jeszcze sam procesor i radiator, więc równanie stanu ustalonego nie opisuje przebiegu od pierwszej sekundy.

</div>
</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Gdzie znika moc</span> <span class="deep-dive-badge">ELEKTRONIKA ZASILANIA</span></summary>
<div class="deep-dive-content">

Jeżeli komputer pobiera 400 W z gniazdka, a zasilacz w tym punkcie ma sprawność 90%, komponenty otrzymują 360 W. Różnica 40 W w przybliżeniu zamienia się w ciepło wewnątrz zasilacza. Certyfikat sprawności i znamionowa moc wyjściowa opisują różne wielkości.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przed wymianą podzespołu zestaw objaw z pomiarem. Po zmianie wróć do tego samego obciążenia.

