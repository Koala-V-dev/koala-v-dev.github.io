# Systemy Octalny i Hexadecymalny

Binarka jest świetna dla procesora, ale beznadziejna dla człowieka. Liczba $255$ to dla komputera `11111111`. Zapisywanie tego ręcznie to proszenie się o błąd. Dlatego programiści używają "skrótów": 
- systemu ósemkowego (Oct)
- szesnastkowego (Hex).

## 8️⃣ System Octalny (Ósemkowy)

Używa cyfr od **$0$ do $7$**. Każda cyfra ósemkowa to dokładnie **$3$ bity**.
W dzisiejszych czasach używany głównie w systemach Linux do uprawnień plików (np. `chmod 755`).

## 🔟➕6️⃣ System Hexadecymalny (Szesnastkowy)

To król informatyki. Używa 16 znaków: $0-9$ oraz litery $A$ ($10$), $B$ ($11$), $C$ ($12$), $D$ ($13$), $E$ ($14$), $F$ ($15$).

**Jeden znak HEX to dokładnie $4$ bity**. Zatem jeden Bajt ($8$ bitów) to zawsze dwie cyfry HEX (np. `FF` = `1111 1111`). Genialne, prawda?

| HEX | Binarnie | Dziesiętnie |
| :---: | :---: | :---: |
| *__$1$__* | `0001` | $1$ |
| *__$9$__* | `1001` | $9$ |
| _**A**_ | `1010` | $10$ |
| _**F**_ | `1111` | $15$ |

Czy więc *__F__* to *__$15$__*? Nie! To bardzo niebezpieczny skrót myślowy.  
_**F**_ w systemie szesnastkowym ma wartość *$15_{10}$* - po konwersji na system dziesiętny. Lecz gdy przekonwertujesz _**F**_ na system ósemkowy otrzymasz *$17_{8}$*. Uważaj by nie popełnić tego kardynalnego błędu! 😉

## 🎨 Hex w Twoim monitorze

Najczęstszym miejscem, gdzie spotkasz Hexa, są kolory <span style="color: red">R</span><span style="color: green">G</span><span style="color: blue">B</span>. Każdy kolor ma składowe Czerwony, Zielony i Niebieski. Każda z nich ma $8$ bitów zakresu ($0-255$).
Kolor biały to:
- RGB: `(255, 255, 255)`
- HEX: `#FFFFFF`

<data-gate>
  <data-quiz>
    <question>
Kolor czysty zielony w formacie HEX to `#00FF00`.  
Wiedząc, że dwie pierwsze cyfry to kolor Czerwony (Red), dwie kolejne to Zielony (Green), a dwie ostatnie to Niebieski (Blue) – ile bajtów zajmuje zapis tego koloru w pamięci?
    </question>
    <options>
      <option correct>3 bajty. Po jednym bajcie koloru.</option>
      <option>6 bajtów. Bo jest 6 znaków dla kolorów.</option>
      <option>1 bajt. Bo to w sumie tworzy jeden kolor.</option>
    </options>

<div data-hint="error">
  Pamiętaj: 1 znak HEX = $4$ bity. Dwa znaki HEX (jak `FF` lub `00`) = $8$ bitów. Ile par znaków widzisz w kodzie `#00FF00`?
</div>
  </data-quiz>
</data-gate>

## 🔐 Wyliczanie dziesiętnych z systemów ósemkowego i szesnastkowego

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Czapki z głów! 🎓
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Ale ciśniesz! 😎
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już jest wyższa szkoła jazdy! 🚗
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Jest pompa! 🦾🐨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Wchodzisz na wyższy level! 🚀
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Matematyczna poezja! ✨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Tak się robi robotę! 🔧🔥
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Elegancko to ogarniasz! 🎩
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Liczby tańczą jak im zagrasz! 💃🕺
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> To już prawie sztuka! 🎨
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="8" digits="3">

> [!TIP]
> Jesteś jak liczbowy ninja! 🥷
  </data-number-system>
</data-gate>

<data-gate>
  <data-number-system base="16" digits="2">

> [!TIP]
> Mistrzostwo świata! 🏆
  </data-number-system>
</data-gate>


<data-gate>
  <data-number-system base="2" digits="8">

> [!TIP]
> Jednak dalej pamiętasz binarkę! 🤯
  </data-number-system>
</data-gate>

---

Widzę, że konwersjami binarnymi, ósemkowymi i szesnastkowymi na dziesiętne już cię nie zagnę. 😅  
Lecimy dalej? 🤔 Będzie trudniej, hahahaha! 😆


---
