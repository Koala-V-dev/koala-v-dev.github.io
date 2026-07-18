# Rodzaje funkcji: Iniekcja, Surjekcja i Bijekcja

Większość uczniów traktuje te nazwy jak niepotrzebny, matematyczny żargon. Jednak dla inżyniera te trzy pojęcia to fundamenty **teorii informacji** i **projektowania systemów**. Zanim przejdziemy do wzorów, musimy zrozumieć, dlaczego w ogóle potrzebujemy tak dziwnych słów i skąd się wzięły.

Nazwy te zawdzięczamy grupie francuskich matematyków działających pod pseudonimem **Nicolas Bourbaki**. Sięgnęli oni do łaciny (*jacere* – rzucać), aby opisać, w jaki sposób elementy jednego zbioru są „wrzucane” do drugiego.

---

## 🏛️ Problem Odwracalności: Dlaczego to w ogóle istnieje?

Wyobraź sobie, że budujesz system przesyłania danych. Masz wejście $x$, które przechodzi przez proces $f(x)$ i daje wynik $y$. Kluczowe pytanie brzmi: **Czy znając tylko $y$, jesteś w stanie bezbłędnie odtworzyć $x$?**

Jeśli Twoim procesem jest $f(x) = x + 10$, odpowiedź brzmi: tak (wystarczy odjąć $10$).
Jeśli jednak procesem jest $f(x) = x^2$, a wynik to $y=16$, masz problem. Na wejściu mogło być $4$ lub $-4$.  
System „zgubił” informację o znaku. Aby opisać te różnice w zachowaniu systemów, Bourbaki wprowadził trzy rygorystyczne standardy.

---

## 🎯 Iniekcja: Strażnik Tożsamości (In-jacere)

Łacińskie *in* (do/wewnątrz) połączone z *jacere* daje nam „wstrzykiwanie”. W iniekcji każdy element dziedziny jest „wstrzykiwany” w unikalne miejsce w przeciwdziedzinie. Nie ma mowy o tym, by dwa różne wejścia trafiły w ten sam cel.

W bazach danych iniekcja to fundament **kluczy głównych (Primary Keys)**. Gwarantuje ona unikalność. Wyobraź sobie, że funkcja tworząca ID dla użytkowników nie jest iniekcją. Wtedy dwie różne osoby mogłyby otrzymać ten sam identyfikator. To doprowadziłoby do krytycznego błędu w systemie.

### Dowodzenie przez „odwracanie kota ogonem” 🐈
Udowodnienie iniekcji wymaga wykazania, że *„różne daje różne”*. Jednak znacznie łatwiej operuje się na równościach niż na nierównościach. Tu wracamy do **prawa kontrapozycji** z Modułu $2$.  
Zamiast udowadniać $x_1 \neq x_2 \implies f(x_1) \neq f(x_2)$, udowadniamy tezę równoważną:
$$f(x_1) = f(x_2) \implies x_1 = x_2$$

Załóżmy, że wyniki są identyczne. Jeśli z tego logicznie wyniknie, że wejścia też były identyczne — mamy dowód. W takim systemie nie ma kolizji.

### 🛠️ Punkt Kontrolny: Analiza kolizji
<data-quiz>
    <question>Spróbujmy dowieść iniekcji dla $f(x) = x^2$ za pomocą kontrapozycji. Zaczynamy od założenia $x_1^2 = x_2^2$. Po wyciągnięciu pierwiastka otrzymujemy równanie $|x_1| = |x_2|$. Dlaczego to NIE dowodzi iniekcji?</question>
    <options>
        <option>Bo kwadrat liczby rzeczywistej zawsze daje wynik nieujemny.</option>
        <option correct>Bo równość modułów $|x_1|=|x_2|$ nie gwarantuje równości $x_1=x_2$.</option>
        <option>Bo dziedzina funkcji kwadratowej musi być ograniczona do dodatnich.</option>
    </options>
    <div data-hint="error">Pamiętaj o rygorze: dowód musi kończyć się wynikiem $x_1 = x_2$. Jeśli wynik dopuszcza sytuację, w której $x_1$ i $x_2$ są różne, iniekcja zostaje złamana.</div>
    <div data-hint="success">Dokładnie! „Odwrócenie kota ogonem” obnażyło prawdę: istnieją dwa różne argumenty, które „wpadają” w ten sam wynik. To jest właśnie kolizja informacji.</div>
</data-quiz>

---

## 🌊 Surjekcja: Strażnik Pokrycia (Sur-jacere)

Francuskie *sur* oznacza „na” lub „ponad”. Surjekcja to funkcja, która „rzuca” elementy tak gęsto, że pokrywa **całą** wyznaczoną przeciwdziedzinę $Y$. 

> [!NOTE]
> **Przeciwdziedzina $Y$** to zbiór wszystkich wartości, które mogą pojawić się jako wynik funkcji. Nie jest to zbiór liczb, do których funkcja ma prawo się odnosić, ale zbiór wszystkich wartości, jakie funkcja może zwrócić.
> **Dziedzina** $X$ to zbiór wszystkich wartości, które mogą pojawić się jako argument funkcji. 
> **Zbiór wartości $ZW_f$** to zbiór wszystkich wartości, które faktycznie pojawiają się jako wynik funkcji.


Pamiętasz pojęcie **Zbioru Wartości** ($ZW_f$) z poprzedniej lekcji? 🧐  
Funkcja jest surjekcją (czyli jest mapowaniem „na” zbiór $Y$) wtedy i tylko wtedy, gdy:
$$ZW_f = Y$$

W inżynierii surjekcja oznacza brak „martwego kodu”. Wyobraź sobie system, który może zwracać błędy o kodach od $1$ do $5$. Jeśli Twój algorytm generuje tylko kody $1$ i $2$, to funkcja nie jest surjekcją. Reszta kodów ($3, 4, 5$) to martwa część interfejsu. Marnujesz zasoby swojego oprogramowania na coś czego i tak nie użyjesz. To nie optymalne, zwłaszcza na urządzeniach embedded gdzie każda komórka pamięci jest na wagę złota.😕

### 🪤 Sandbox: Formalny zapis Surjekcji

W systemach rygorystycznych surjekcję zapisujemy za pomocą kwantyfikatorów. Twoja intuicja może podpowiadać zapis `Dla każdego y istnieje x...`, ale matematyka (i kompilatory) wymagają wskazania **gdzie** te elementy żyją. 

Użyjemy definicji ze zbiorami: $y \in Y$ (element z przeciwdziedziny) oraz $x \in X$ (element z dziedziny).

<data-gate>
<data-math-sandbox level="quantifiers" data-steps="1">
  <div 
    data-step="1" 
    data-expected="\forall y \in Y \exists x \in X : f(x) = y" 
    data-label="Zdefiniuj surjekcję: Dla każdego $y$ ze zbioru $Y$ istnieje $x$ ze zbioru $X$ taki, że $f(x)=y$:"
    data-hint-wrong="\forall y \exists x : f(x) = y:Prawie! Ale musisz określić 'przestrzeń' dla zmiennych. Dopisz \in Y oraz \in X, aby system wiedział, w których zbiorach szukać danych.">
  </div>
</data-math-sandbox>
</data-gate>

PS.: Ten zapis dla większości ludzi jest nie zrozumiały, a Ty go potrafiłeś zapisać. 😏  
„Jestem Bogiem  
Uświadom to sobie, sobie  
Ty też jesteś Bogiem  
Tylko wyobraź to sobie, sobie” - Pezet  

[Paktofonika - Jestem Bogiem](https://www.youtube.com/watch?v=u3HeJFr01T0)

---

## 💎 Bijekcja: Idealny Interfejs (Bi-jacere)

Przedrostek *bi-* oznacza dwoistość. Bijekcja to sytuacja, w której system jest **jednocześnie** iniekcją i surjekcją. Każdy $x$ ma swój unikalny $y$, a każde $y$ jest wykorzystane.

W informatyce bijekcję nazywamy często **izomorfizmem** (z greckiego: *isos* – równy, *morphe* – kształt). Oznacza to, że zbiory $X$ i $Y$ mają identyczną strukturę, a funkcja jest jedynie „tłumaczem” między nimi.

Bijekcja to jedyny typ funkcji, który jest **w pełni odwracalny**. Dzięki niej możemy stworzyć funkcję $f^{-1}$ (funkcję odwrotną), która działa jak idealne „Cofnij”. 
- **Szyfrowanie symetryczne** (np. AES): Musi być bijekcją, by odbiorca mógł odzyskać dane.
- **Konwersja systemów liczbowych** (np. DEC $\leftrightarrow$ BIN): To bijekcja. Nie tracimy informacji, zmieniamy tylko system zapisu (interfejs).

---

### 💻 Analiza Systemowa: Rodzaje funkcji w kodzie

W nowoczesnych językach programowania rzadko używamy słowa „surjekcja”, ale codziennie korzystamy z tych koncepcji w **Systemach Typów**.

- **`Dictionary<Key, Value>` (C#) / `std::map` (C++)**: Mechanizm ten wymusza, aby mapowanie kluczy na wartości było **iniekcją**. Próba dodania drugiego takiego samego klucza kończy się błędem kolizji.
- **`Enum` (Java/TypeScript)**: Jeśli funkcja zwraca typ `Enum`, a my obsłużyliśmy w `switch` całe możliwe studium przypadków (case study), to traktujemy tę funkcję jako surjekcję na zbiór wartości tego typu.
- **Mapowanie bezstratne (np. `AutoMapper`)**: Dążymy do tego, by mapowanie obiektów DTO na encje bazodanowe było bijekcją.

> [!NOTE]
> **DTO** (*Data Transfer Object*) to obiekt służący do przenoszenia danych między warstwami aplikacji, np. między API a logiką domenową, albo między logiką domenową a bazą danych.

---

### 🔗 Połącz Pary: Analiza bezpieczeństwa systemu

Zastosuj zdobytą intuicję do oceny dwóch mechanizmów, które spotkasz w każdej aplikacji webowej.

<data-gate>
<data-connection-matcher title="Analiza architektury danych">
    <item left="Funkcja Hashująca (np. SHA-256)" right="Brak iniekcji (możliwe kolizje) — celowo nieodwracalna." />
    <item left="Szyfrowanie (np. RSA)" right="Bijekcja — musi być odwracalna, by odczytać wiadomość." />
    <item left="Konwersja obrazu do skali szarości" right="Surjekcja (używamy wszystkich odcieni), ale brak iniekcji." />
    <item left="Logowanie (Login → UserID)" right="Musi być iniekcją — jeden login to dokładnie jeden użytkownik." />
</data-connection-matcher>
</data-gate>

---

Pewnie już widzisz, jak bardzo informatyka jest powiązana z matematyką. 😊

Zrozumienie tych trzech rzutowań pozwala Ci świadomie decydować, kiedy Twój algorytm może pozwolić sobie na stratę informacji, a kiedy musi być rygorystycznym, odwracalnym interfejsem. W następnej lekcji zobaczymy, jak te zasady realizuje w praktyce **funkcja liniowa**. 🚀
