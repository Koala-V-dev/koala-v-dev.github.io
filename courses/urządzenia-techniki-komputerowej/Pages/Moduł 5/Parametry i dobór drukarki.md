# Parametry i dobór drukarki

Masz obraz szeroki na 1200 pikseli. Ktoś obiecuje, że wydruk będzie ostry, bo drukarka ma 1200 DPI. Jaką informację o planowanym wydruku trzeba jeszcze znać?

## 📏 Punkty, piksele i strony

**PPI** mówi, ile pikseli obrazu przypada na cal docelowego wymiaru. **DPI** opisuje gęstość punktów urządzenia. Urządzenie może potrzebować wielu punktów do oddania jednego koloru obrazu. Wydruk o szerokości 4 cali z obrazu 1200 px ma 300 PPI materiału wejściowego. Na szerokości 8 cali zostaje 150 PPI.

**PPM** to strony na minutę w zadanych warunkach. Porównuj tryb, kolor, druk jednostronny lub dwustronny i czas do pierwszej strony. Duplex oznacza druk po obu stronach. Dla kosztów porównaj cenę materiałów z ich wydajnością przy porównywalnym pokryciu. W kosztach eksploatacji mogą wystąpić także bęben, pojemnik na zużyty materiał i papier.

W kolejnych lekcjach wybór wynika z zadania. Formularz wielowarstwowy potrzebuje nacisku, etykieta wymaga trwałości odpowiedniej do użycia, a szybki druk biurowy zależy od obciążenia i kosztu strony.

## 🖨️ Uruchomienie i strona testowa

Wybierz jedno połączenie zgodne z instrukcją. Przy USB potwierdź, że system wykrył urządzenie. Przy drukarce sieciowej potwierdź właściwe urządzenie, np. porównując adres z raportem konfiguracji wydrukowanym z panelu. Dodaj urządzenie w systemie i sprawdź domyślny format papieru oraz duplex.

Najpierw wydrukuj raport bezpośrednio z urządzenia. Następnie wyślij z komputera jedną krótką stronę testową. **Kolejka wydruku** przechowuje zadania oczekujące na obsługę. Gdy raport lokalny wychodzi, a zadanie z komputera pozostaje w kolejce, sprawdź wstrzymanie kolejki, wybraną drukarkę i połączenie. Po poprawce potwierdź, że nowa strona wychodzi z właściwego urządzenia.

## 💰 Ile kosztuje cały nakład

Dwie drukarki laserowe spełniają wymagania biura. Drukują na tym samym papierze, a podane ceny i wydajności są przykładowe. Obie mają wkład startowy w cenie urządzenia.

- **Oferta A** kosztuje 400 zł. Wkład startowy wystarcza na 500 stron, a nowy wkład z bębnem kosztuje 150 zł i wystarcza na 1000 stron.
- **Oferta B** kosztuje 750 zł. Wkład startowy wystarcza na 1000 stron, a nowy toner kosztuje 120 zł i wystarcza na 2500 stron. Osobny bęben kosztuje 250 zł. Pierwszy jest w cenie i wystarcza na 8000 stron.

Dla **3500 stron** w ofercie A po wykorzystaniu wkładu startowego zostaje 3000 stron, czyli trzy wkłady po 150 zł. Koszt wynosi **850 zł**. W B zostaje 2500 stron, czyli jeden toner za 120 zł. Koszt wynosi **870 zł**. Przy **3501 stronach** obie oferty wymagają kolejnego pełnego wkładu. A kosztuje wtedy **1000 zł**, B **990 zł**. Przy 8001 stronach w ofercie B dochodzi zakup bębna, nawet jeśli toner wciąż wystarcza.

### 🧾 Porównaj dwie rzeczywiste oferty

Wybierz dwie drukarki odpowiadające temu samemu zadaniu, np. miesięczny druk czarno-białych dokumentów A4 z dupleksem. Określ liczbę stron na rok. W instrukcji lub specyfikacji każdego modelu odszukaj **symbol wkładu w zestawie, jego wydajność, symbol wkładu kupowanego później i jego wydajność**. Sprawdź, czy bęben stanowi część wkładu. Jeśli jest osobny, odczytaj jego wydajność i sprawdź, czy pierwszy jest już zamontowany.

Zapisz ceny urządzeń i materiałów z tej samej daty, w tej samej walucie i w kwotach brutto. Policz liczbę pełnych wkładów i bębnów, które trzeba kupić w ciągu roku. Zapisz łączny koszt oraz element, którego zakup wypada najbliżej planowanego nakładu. Jeśli brakuje wydajności wkładu startowego, oznacz tę pozycję jako niepotwierdzoną i sprawdź, jak zmieni się wynik przy zakupie jednego wkładu więcej.

W przykładzie płacisz za pełne wkłady, a pozostały toner zachowujesz do następnego zadania. Papier i pozostałe wydatki pomijamy. Przed zakupem sprawdź osobno wydajność wkładu w pudełku i wkładu kupowanego później. Deklarowana wydajność tonera pochodzi z określonego testu, więc rzeczywisty nakład zależy m.in. od treści i trybu drukowania. [Metoda pomiaru wydajności wkładów według ISO/IEC](https://www.iso.org/standard/88924.html) · [Przykładowy raport dla wkładu startowego HP](https://h20195.www2.hp.com/v2/GetDocument.aspx?docname=4AA7-9045ENW).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Dlaczego koszt rośnie skokami</span> <span class="deep-dive-badge">MATEMATYKA</span></summary>
<div class="deep-dive-content">

Jeśli nakład wynosi $n$ stron, wkład startowy wystarcza na $s$, a każdy następny na $y$, liczbę dodatkowych wkładów obliczysz przez zaokrąglenie w górę:

$$ K = \left\lceil\frac{\max(0,n-s)}{y}\right\rceil. $$

Po odjęciu wydajności wkładu startowego dzielisz pozostały nakład przez wydajność kolejnego. Nawet ułamek potrzebnego wkładu oznacza zakup całej sztuki. Dla oferty A wzrost z 3500 do 3501 zmienia liczbę dodatkowych wkładów z 3 na 4. Dla B liczba wkładów rośnie wtedy z 1 na 2. Porównanie samych średnich cen strony pomija oba te skoki oraz cenę startu.

</div>
</details>

## 🧪 Samodzielna próba

Wydruk ma szerokość 6 cali, plik ma 900 px. Policz PPI. Ile pikseli potrzebujesz dla 300 PPI przy tym samym rozmiarze?

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

900/6 = 150 PPI. Potrzebujesz 1800 px źródła. Samo podbicie liczby pikseli przez interpolację nie przywróci szczegółów, których w pliku nie ma.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Raster i półtony</span> <span class="deep-dive-badge">PRZETWARZANIE OBRAZU</span></summary>
<div class="deep-dive-content">

W uproszczonym rastrze 4 × 4 pola na odcień szarości możesz wypełnić od 0 do 16 pól. Otrzymujesz 17 nominalnych poziomów pokrycia, ale komórka zajmuje 4 punkty w każdej osi. Przy 600 DPI przypada 150 komórek na cal. Rzeczywiste metody rozmieszczania punktów mogą rozkładać błąd na sąsiadów i wykorzystywać różne wielkości kropli.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Dobierz mechanizm do medium i zadania. Gęstość pikseli źródła wylicz z fizycznego rozmiaru wydruku.

