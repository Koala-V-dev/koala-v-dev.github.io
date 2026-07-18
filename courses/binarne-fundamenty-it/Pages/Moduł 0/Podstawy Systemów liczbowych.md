# Podstawy Systemów liczbowych

Większość ludzi traktuje liczby jako "po prostu liczby". W informatyce każda liczba ma swoją **szerokość** i **granicę**. Zanim przejdziemy do zer i jedynek, musimy zrozumieć, co się dzieje, gdy wyczerpiemy pulę dostępnych znaków.

## 🦖 System Dziesiętny: Mechanika Przeniesienia

W systemie dziesiętnym (DEC) mamy 10 symboli: $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$. Kiedy dodajemy $1$ do największego symbolu ($9$), następuje **przeniesienie**.

Spójrz na poniższą tabelę. To jest mechanizm, który znasz z podstawówki, ale spójrz na niego technicznie:

| Tysiące | Setki | Dziesiątki | Jedności | Wynik |
| :---: | :---: | :---: | :---: | :---: |
| <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | 9 | **$9$** |
| <span style="color: var(--text-muted);">0</span> | <span style="color: var(--text-muted);">0</span> | 1 | 0 | **$10$** |

Gdy kolumna "Jedności" osiąga limit, zeruje się i wysyła sygnał przeniesienia do kolumny po lewej.

## ⚠️ Przepełnienie: Gdy hardware mówi "STOP"

W komputerze nie masz nieskończonej ilości kolumn. Jeśli Twój procesor ma system $3$-cyfrowy, to liczba **$999$** jest jego absolutnym sufitem. Co się stanie, gdy dodasz do niej $1$?

To zależy od tego, jak zaprojektowano sprzęt. W większości przypadków następuje **Overflow** (przepełnienie).

<data-gate>
  <data-quiz>
    <question>
Mamy fizyczny licznik (jak w starym samochodzie), który ma TYLKO $6$ pól na cyfry. Obecny stan to $999999$. Dodajesz $1$. Jaki będzie FIZYCZNY obraz tego licznika po operacji?
![Tarcza zegara samochodowego](/public/courses/binarne-fundamenty-it/Images/tarcza_zegarqa_samochodowego.webp)
    </question>
    <options>
      <option correct> $000000$. Ponieważ licznik nie ma siódmego pola na kolejną "jedynkę".</option>
      <option> $1000000$. Licznik magicznie stworzy nową kolumnę, aby pomieścić wynik.</option>
    </options>

<div data-hint="error">
  Skup się na słowie "TYLKO $6$ pól". Fizycznie nie widzę tam miejsca na kolejną cyfrę. Co się stanie z bębnami licznika?
</div>
  </data-quiz>
</data-gate>

## 💻 Od 10 do 2: Przeskok Logiczny

W systemie binarnym (**_BIN_**) mamy tylko $2$ symbole: `0` i `1`. Zasada przeniesienia działa identycznie, ale... znacznie częściej.

1. Masz `0`.
2. Dodajesz `1` -> masz `1`. (Limit osiągnięty!)
3. Dodajesz kolejne `1` -> Jedynka się zeruje (`0`) i następuje przeniesienie w lewo (`1`). Wynik: `10` (co w systemie dziesiętnym oznacza $2$).

### Ćwiczenie: Przesunięcia w Binarnym

Spójrz na tabelę i spróbuj samodzielnie "przesunąć" wartości w głowie:

| Dziesiętnie | Binarnie | Co się stało? |
| :---: | :---: | :--- |
| 1 | `001` | Start |
| 2 | `010` | Przeniesienie z jedności do dwójek |
| 3 | `011` | Dodanie jedynki |
| 4 | `100` | Podwójne przeniesienie! |

<data-gate>
  <data-quiz>
    <question>
Jaka będzie następna liczba binarna po `111`? (Pamiętaj o mechanizmie przeniesienia!)
    </question>
    <options>
      <option correct>`1000`</option>
      <option>`112`</option>
      <option>`1111`</option>
      <option>`000`</option>
    </options>

<div data-hint="error">
  Każda kolumna ma już jedynkę (czyli swój limit). Dodanie `1` spowoduje, że pierwsza się wyzeruje i poda przeniesienie dalej. Druga zrobi to samo, trzecia też... Gdzie wyląduje ta ostatnia jedynka?
</div>
  </data-quiz>
</data-gate>

Na koniec chcę abyś popatrzył na poniższe dłonie. Na lewym obrazku palce liczymy normalnie, a na prawym *indeksujemy* je od zera (`0`). Wciąż mamy $10$ palców, ale w informatyce i zaawansowanej matematyce liczenie od zera to standard. 
Kiedyś w pełni zrozumiesz jak to bardzo ułatwia życię i pracę 😎.

![Palce od 1 do 10 i od 0 do 9](/public/courses/binarne-fundamenty-it/Images/palce.webp)

---
