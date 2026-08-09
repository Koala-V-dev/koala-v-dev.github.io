# Warstwa fizyczna i łącza danych

Dioda portu świeci, ale komputer nadal nie odbiera danych. Czy przewód działa? Czy przełącznik wie, gdzie wysłać ramkę? A może te dwa pytania dotyczą innych dowodów?

W poprzedniej lekcji model OSI pomagał ograniczyć wniosek. Teraz zastosujesz tę regułę na styku warstwy fizycznej i łącza danych. Po lekcji odróżnisz stan łącza od poprawnej wymiany ramek oraz przewidzisz decyzję przełącznika po każdej odebranej ramce.

## 🧠 Najpierw przewidź dwa skutki

Trzy komputery są podłączone do jednego przełącznika:

```text
port 1: komputer A, MAC A1:A1:A1:A1:A1:A1
port 2: komputer B, MAC B2:B2:B2:B2:B2:B2
port 3: komputer C, MAC C3:C3:C3:C3:C3:C3
```

Przełącznik ma tylko jeden wpis:

```text
A1:A1:A1:A1:A1:A1 -> port 1
```

Komputer B wysyła z portu 2 ramkę do komputera A.

Zapisz dwie odpowiedzi:

1. Jaki wpis pojawi się w tablicy przełącznika?
2. Którym portem ramka opuści przełącznik?

Jeśli w obu odpowiedziach użyłeś adresu docelowego, połączyłeś dwie różne decyzje. Źródło zmienia tablicę, a cel wybiera dalszą drogę.

## 🔌 Stan łącza nie jest stanem ramki

Warstwa fizyczna przenosi sygnał. Wcześniej rozdzieliłeś bit, symbol i mierzalne zjawisko fizyczne. Ethernet może wykorzystywać skrętkę, światłowód lub inne media. Jego część fizyczna, nazywana **PHY**, określa sposób kodowania i odbioru sygnału.

Warstwa łącza otrzymuje z niższego poziomu odtworzony strumień i rozpoznaje w nim **ramki**. Ramka ma granice oraz informacje sterujące potrzebne do lokalnej wymiany.

Dlatego obserwacje tworzą kolejne, coraz mocniejsze dowody:

```text
wykryty stan łącza
    ↓
odebrano strumień możliwy do zdekodowania
    ↓
rozpoznano poprawną ramkę
    ↓
wykonano decyzję przekazania
```

Czytaj sekwencję od góry. Każdy niższy krok wymaga czegoś więcej. Świecąca dioda nie potwierdza, że przełącznik odebrał poprawną ramkę. Poprawna ramka nie potwierdza z kolei działania IP ani aplikacji.

<strong>**Stan `link up` jest dowodem fizycznym o ograniczonym zakresie.**</strong> Nie zamieniaj go w ogólne „połączenie działa”.

## 📦 Ramka daje przełącznikowi dwa różne adresy

Do ćwiczenia z przełączaniem wystarczy uproszczony obraz ramki Ethernet:

```text
[ adres docelowy | adres źródłowy | typ/długość | dane | FCS ]
```

- **Adres docelowy** mówi, do którego odbiorcy lub grupy jest skierowana ramka.
- **Adres źródłowy** wskazuje nadawcę tej ramki.
- *Typ lub długość* pomaga zinterpretować dalszą zawartość zgodnie z użytym formatem.
- **FCS** zawiera wynik cyklicznej kontroli nadmiarowej, czyli CRC. Odbiornik wykonuje to samo obliczenie i może wykryć, że odebrane bity nie tworzą poprawnej ramki.

FCS wykrywa uszkodzenie. Nie naprawia ramki i nie nakazuje Ethernetowi ponownej transmisji. Ewentualne odzyskanie danych zależy od innych mechanizmów.

Adresy używane w typowym Ethernecie mają 48 bitów. Zapis `A1:A1:A1:A1:A1:A1` jest wygodny w symulacji, lecz nie służy do rozpoznawania producenta. Współczesne zasady przydziału obejmują różne długości prefiksów, adresy lokalnie administrowane oraz adresy zmieniane dla prywatności. Reguła „pierwsze trzy oktety zawsze oznaczają producenta” jest zbyt szeroka.

## 🔀 Uczenie i przekazywanie to osobne kroki

Przełącznik odbiera ramkę na jednym porcie. Następnie wykonuje uproszczoną sekwencję:

1. Sprawdza, czy ramka nadaje się do dalszego przetwarzania.
2. Uczy się **adresu źródłowego** i wiąże go z portem wejściowym.
3. Szuka **adresu docelowego** w tablicy przekazywania.
4. Przekazuje, zalewa albo filtruje ramkę zależnie od wyniku wyszukiwania.

W ćwiczeniach zakładamy jeden lokalny segment logiczny, wszystkie porty w stanie przekazywania i brak dodatkowych polityk. Prawdziwy przełącznik uwzględnia także podział na logiczne segmenty nazywane VLAN-ami oraz stan portu.

### 🎯 Cel znany na innym porcie

Jeśli tablica wskazuje port celu, przełącznik wysyła ramkę przez ten port. Nie kopiuje jej bez potrzeby na pozostałe porty.

```text
ramka wchodzi portem 2: źródło B, cel A
tablica przed: A -> port 1

uczenie: B -> port 2
wyszukanie celu: A -> port 1
działanie: przekaż portem 1
```

To rozwiązanie początkowego problemu. Adres źródłowy B zmienił tablicę. Adres docelowy A wybrał port wyjściowy.

### 🌊 Cel jeszcze nieznany

**Unicast** oznacza ramkę skierowaną do jednego odbiorcy. Jeśli jej docelowego adresu nie ma w tablicy, przełącznik nie zna jednego właściwego portu. W typowym działaniu wysyła kopię na uprawnione porty tego samego segmentu poza portem wejściowym. To **zalewanie nieznanego unicastu**.

Zalewanie nie oznacza awarii. Pozwala dotrzeć do celu, zanim przełącznik nauczy się jego położenia.

```text
ramka wchodzi portem 1: źródło A, cel B
tablica przed: pusta

uczenie: A -> port 1
wyszukanie celu: brak B
działanie: wyślij kopie portami 2 i 3
```

Komputer B może przyjąć ramkę. Komputer C zobaczy ją na swoim łączu, lecz jego interfejs nie powinien przekazać wyżej ramki skierowanej wyłącznie do B.

Przełącznik nie uczy się położenia B z pola docelowego. Nauczy się go dopiero po odebraniu ramki, w której B wystąpi jako źródło.

### 🚫 Cel znany na porcie wejściowym

Kilka urządzeń może znajdować się za tym samym portem, na przykład za kolejnym przełącznikiem. Jeśli cel i źródło są znane przez port wejściowy, wysłanie ramki z powrotem tym portem nie ma sensu. Przełącznik filtruje taką ramkę.

## 🔁 Tablica opisuje ostatnio zaobserwowane źródła

Dynamiczny wpis nie jest wieczystą prawdą o sieci. Urządzenie może zostać przepięte, a nieużywany wpis może się zestarzeć.

Gdy przełącznik odbierze ramkę z już znanego źródła na innym porcie, aktualizuje powiązanie. Czas starzenia zależy od standardu, urządzenia i konfiguracji. Nie używaj liczby 300 sekund jako prawa Ethernetu.

Adres rozgłoszeniowy `FF:FF:FF:FF:FF:FF` jest adresem docelowym grupy. Przełącznik nie uczy się go jako źródła przypisanego do portu. W uproszczonej sieci rozsyła ramkę rozgłoszeniową na pozostałe uprawnione porty.

## 🛠️ Punkt kontrolny: źródło zmienia port

<data-gate>
  <data-quiz>
    <question>Tablica zawiera wpisy A → port 1 oraz B → port 2. Ramka ze źródłem A i celem B przychodzi teraz portem 3. Co zrobi przełącznik w opisanym uproszczonym modelu?</question>
    <options>
      <option>Wyśle ramkę portem 1, ponieważ stary wpis A wskazuje ten port.</option>
      <option correct>Zaktualizuje A → port 3, a następnie wyśle ramkę do B portem 2.</option>
      <option>Zapisze B → port 3, ponieważ adres docelowy służy do uczenia tablicy.</option>
      <option>Zaleje wszystkie porty, ponieważ każda zmiana portu źródła usuwa całą tablicę.</option>
    </options>
    <div data-hint="error">Rozdziel dwa pola ramki. Źródło aktualizuje tablicę na podstawie portu wejściowego. Cel służy do wyboru portu wyjściowego.</div>
    <div data-hint="success">Przełącznik obserwuje A jako źródło na porcie 3, więc aktualizuje wpis. Znany cel B nadal wskazuje port 2 i tam trafia ramka.</div>
  </data-quiz>
</data-gate>

## 🧪 Przeprowadź trzy ramki przez przełącznik

Przełącznik ma pustą tablicę. Komputery A, B i C są podłączone odpowiednio do portów 1, 2 i 3. Wszystkie należą do jednego segmentu logicznego.

Przetwórz kolejno:

```text
1. A wysyła ramkę do B.
2. B odpowiada ramką do A.
3. C wysyła ramkę do B.
```

Dla każdej ramki zapisz:

1. port wejściowy;
2. wpis dodany albo zaktualizowany na podstawie źródła;
3. wynik wyszukania celu;
4. port lub porty wyjściowe;
5. pełną tablicę po wykonaniu decyzji.

Kryteria ukończenia:

- po pierwszej ramce tablica zna A, ale jeszcze nie zna B;
- pierwsza ramka jest zalewana portami 2 i 3;
- odpowiedź B uczy przełącznik wpisu B i trafia tylko portem 1;
- trzecia ramka uczy wpisu C i trafia do znanego B tylko portem 2;
- potrafisz wyjaśnić, dlaczego odebranie ramki przez niezamierzony port podczas zalewania nie oznacza, że każdy host przyjmie ją do dalszego przetwarzania.

Zmień teraz jeden warunek: przed trzecią ramką usuń wpis B wskutek starzenia. Oblicz ponownie tylko krok trzeci. Jeśli wynik się nie zmienił, wróć do różnicy między znanym i nieznanym celem.

<details>
<summary>Sprawdź rozwiązanie po zapisaniu wszystkich stanów</summary>

1. `A → B` wchodzi portem 1. Przełącznik zapisuje `A → 1`. Nie zna B, więc wysyła kopie portami 2 i 3.
2. `B → A` wchodzi portem 2. Przełącznik zapisuje `B → 2`. Zna A, więc wysyła ramkę tylko portem 1.
3. `C → B` wchodzi portem 3. Przełącznik zapisuje `C → 3`. Zna B, więc wysyła ramkę tylko portem 2.

Po trzech krokach tablica zawiera `A → 1`, `B → 2` oraz `C → 3`.

Jeżeli wpis B zestarzał się przed krokiem trzecim, cel jest ponownie nieznany. Ramka `C → B` zostaje wtedy wysłana portami 1 i 2, a tablica po tej ramce nadal nie odzyska wpisu B. B musi pojawić się jako źródło kolejnej odebranej ramki.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Stan łącza i poprawna ramka są różnymi dowodami.** `Link up` nie potwierdza dostarczenia danych do IP ani aplikacji.
- **Źródło służy do uczenia.** Przełącznik wiąże źródłowy adres MAC z portem wejściowym.
- **Cel służy do przekazywania.** Znany cel wybiera port, a nieznany unicast powoduje zalewanie uprawnionych portów poza wejściowym.
- **Tablica zmienia się z ruchem.** Wpis może zostać zaktualizowany po zmianie portu albo usunięty wskutek starzenia.
- **FCS wykrywa uszkodzenie ramki.** Nie naprawia jej i nie dowodzi działania protokołów wyższych warstw.
