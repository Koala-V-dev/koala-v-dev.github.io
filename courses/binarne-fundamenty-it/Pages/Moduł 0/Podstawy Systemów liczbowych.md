# Podstawy systemów liczbowych

Większość ludzi traktuje liczby jako „po prostu liczby”. W informatyce jest inaczej: <strong>każda liczba ma swoją **szerokość** oraz **granicę**</strong>. Zanim przejdziemy do zer i jedynek, musimy zobaczyć, co się dzieje, gdy wyczerpiemy pulę dostępnych znaków.

---

## 🏗️ System dziesiętny: mechanika przeniesienia

W systemie dziesiętnym (zwanym również <strong>_**DEC**_</strong> - skrót od *decimal*) mamy do dyspozycji dziesięć symboli: od $0$ do $9$.  
Kiedy dodajemy $1$ do największego z nich ($9$), na danej pozycji brakuje miejsca. Wtedy <strong>następuje **przeniesienie** do sąsiedniej kolumny</strong>.

Spójrz na poniższą tabelę. To mechanizm, który znasz z podstawówki, ale spójrz na niego z perspektywy technicznej:

| **_Wynik_** |                     Tysiące                      |                      Setki                       |                    Dziesiątki                    | Jedności |
| :---------: | :----------------------------------------------: | :----------------------------------------------: | :----------------------------------------------: | :------: |
|  **_$9$_**  | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> |   $9$    |
| **_$10$_**  | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> |                       $1$                        |   $0$    |

Gdy kolumna „Jedności” osiąga swój limit, zeruje się i jednocześnie wysyła sygnał przeniesienia do sąsiedniej kolumny po lewej stronie.

---

## ⚠️ Przepełnienie: gdy sprzęt mówi „STOP”

W komputerze nie ma miejsca na nieskończoną liczbę kolumn. Każda komórka pamięci ma swoje ograniczenia. Jeśli procesor operuje na liczbach maksymalnie trzycyfrowych, to wartość $999$ jest jego absolutną granicą. Co się stanie, gdy dodasz do niej $1$?

To zależy od konstrukcji sprzętu. W większości przypadków <strong>następuje wtedy **_przepełnienie_** (ang. *overflow*)</strong>.

<data-gate>
  <data-quiz>
    <question>
Jako przykład posłuży nam fizyczny licznik kilometrów w starym samochodzie, który ma tylko $4$ pola na cyfry. Obecny stan to $9999$. Co się stanie, gdy przejedziesz kolejny kilometr i dodasz $1$? Jaki będzie fizyczny stan licznika?
![Tarcza zegara samochodowego](/public/courses/binarne-fundamenty-it/Images/tarcza_zegarqa_samochodowego.jpg)
<!-- Licencja CC0 serwisu Pexels. Zdjęcie dodane przez Luke Miller: https://www.pexels.com/pl-pl/zdjecie/zblizenie-predkosciomierza-samochodu-zabytkowego-32725800/ -->
    </question>
    <options>
      <option>$10000$. powstanie nowa kolumna, aby pomieścić wynik.</option>
      <option correct>$0000$. Licznik nie ma piątego pola na kolejną „jedynkę”.</option>
    </options>

<div data-hint="error">
  Skup się na ograniczeniu: licznik ma dokładnie $4$ pola. Nie ma tam miejsca na piątą cyfrę. Co stanie się z bębnami po osiągnięciu maksymalnej wartości?
</div>
<div data-hint="success">
  Dobrze! Dokładnie tak. W fizycznym świecie mechanizm resetuje się do zera, gdy osiągnie swój limit. W świecie cyfrowym procesor ignoruje dodatkową jedynkę, co jest podstawą działania arytmetyki modularnej. 🎯
</div>
  </data-quiz>
</data-gate>

---

## 💻 Od 10 do 2: Przeskok Logiczny

W systemie dwójkowym, nazywanym również binarnym (<strong>_**BIN**_</strong>), mamy do dyspozycji tylko dwa symbole: `0` i `1`. Zasada przeniesienia działa tu dokładnie tak samo jak w systemie dziesiętnym, ale występuje znacznie częściej.

1. Zaczynasz od wartości `0`.
2. Dodajesz `1` i otrzymujesz `1`. To jest maksymalny symbol w tym systemie.
3. Gdy dodasz kolejną `1`, pierwsza pozycja się zeruje (`0`), a jedynka przechodzi na nową pozycję po lewej (`1`).  
   Otrzymujesz wynik `10` (odpowiednik dziesiętnej dwójki).

---

### 🧪 Ćwiczenie: przesunięcia w systemie binarnym

Spójrz na poniższe zestawienie i spróbuj przeanalizować te przesunięcia:

| Dziesiętnie | Binarnie | Co się stało?                   |
| :---------: | :------: | :------------------------------ |
|     $1$     |  `001`   | Stan początkowy                 |
|     $2$     |  `010`   | Przeniesienie na wyższą pozycję |
|     $3$     |  `011`   | Zwykłe dodanie jedynki          |
|     $4$     |  `100`   | Podwójne przeniesienie          |

<data-gate>
  <data-quiz>
    <question>
Jaka będzie następna liczba binarna po wartości `111`? Pamiętaj o mechanizmie przeniesienia.
    </question>
    <options>
      <option correct>`1000`</option>
      <option>`112`</option>
      <option>`1111`</option>
      <option>`000`</option>
    </options>

<div data-hint="error">
  Każda kolumna ma już maksymalną wartość. Dodanie `1` spowoduje lawinowe przeniesienie we wszystkich kolumnach od prawej do lewej. Gdzie ostatecznie pojawi się nowa jedynka?
</div>
<div data-hint="success">
  Dokładnie! Gdy wszystkie pozycje osiągną `1`, nowa wartość tworzy kolejną kolumnę po lewej, zerując poprzednie. To jest serce arytmetyki binarnej.
</div>
  </data-quiz>
</data-gate>

---

Spójrz na poniższą ilustrację. Lewa strona pokazuje klasyczne liczenie od jedynki, a prawa przedstawia <strong>**indeksowanie** od zera (`0`)</strong>. W obu przypadkach mamy dziesięć palców, jednak w informatyce i matematyce dyskretnej liczenie od zera jest standardem. Ułatwia to adresowanie pamięci komputera oraz pracę z tablicami danych.

![Ilustracja przedstawiająca liczenie na palcach od 1 do 10 oraz indeksowanie od 0 do 9](/public/courses/binarne-fundamenty-it/Images/palce.png)

> [!TIP]
>  _**Dlaczego indeksy zaczynają się od zera?**_
> 
> W indeksowaniu komputerowym numer elementu oznacza przesunięcie względem początku (_**$bias$, $offset$**_).
> *Indeks* nie jest „numerem w kolejności”, tylko liczbą kroków od startu.
> 
> Indeks $0$ → przesunięcie o $0$ od początku → pierwszy element
> Indeks $1$ → przesunięcie o $1$ od początku → drugi element
> Indeks $n$ → przesunięcie o $n$ od początku
> Dzięki temu *indeks* = _**$bias$**_, więc nie trzeba wykonywać mentalnego „minus jeden”, jak przy liczeniu od $1$.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- W informatyce liczby nie są abstrakcją. Każda z nich zajmuje ściśle określoną przestrzeń w pamięci (szerokość) i posiada swój limit.
- <strong>Błąd **_przepełnienia_** (ang. *overflow*)</strong> pojawia się w momencie próby zapisu wartości wykraczającej poza maksymalny limit danej zmiennej.
- Liczenie i indeksowanie od zera (`0`) to standard w programowaniu, ułatwiający zarządzanie pamięcią oraz strukturami danych.

---
