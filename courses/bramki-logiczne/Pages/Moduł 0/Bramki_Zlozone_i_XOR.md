# Bramki Złożone i potężny XOR 🧩

Znamy już podstawowe układy AND, OR i NOT. Jednak budowanie skomplikowanych procesorów używając tylko trzech rodzajów cegiełek jest potwornie nieefektywne. W technologii liczy się ułożenie tranzystorów tak blisko siebie jak to fizycznie możliwe – tu decyduje fizyka (efekty kwantowe). Często taniej jest zbudować układy wysoce złożone, używając ich samych bez dodatków.

---

## 🚫 NAND i NOR: Negacja na Wejściu

Pamiętasz negację NOT z małym "kółeczkiem" na rysunku? Inżynierzy stwierdzili "A co jeśli przykleimy kółeczko prosto na końcu innej bramki?". Powstały w ten sposób Inwertery złożone! 

> [!TIP] Bramki Uniwersalne (Universal Gates)
> To niewiarygodne, ale cały Komputer Lotu Misji Apollo 11 (AGC - użyty do lądowania na księżycu) opierał się konstrukcyjnie tylko i wyłącznie na jednym rzędzie identycznych 3 drutowych części z **bramek NOR**! Jeśli połączymy ze sobą określoną liczbę bramek NAND lub określonej liczby bramek NOR, jesteśmy w stanie sztucznie uzyskać **KWALITATYWNIE KAŻDĄ INNĄ BRAMKĘ ZNANEGO WSZECHŚWIATA** (Wliczając XOR, NOT, AND, OR). Twierdzenie to wywodzi się z praw matematyka De Morgana.

- **NAND (Not AND)** – To iloczyn logiczny AND, ale sfabrykowany jako negacja. Zwróci `0` jedynie wtedy, gdy oba jego wejścia będą `1`. Dla absolutnie każdej innej mieszanki wymusza na wyjście `1`. (Matematycznie: `~ (A * B)`).
- **NOR (Not OR)** – To alternatywa OR na sterydach negacji. By na wyjście "wypluć" jedynkę stawia arcy-trudny warunek – zwróci `1` TYLKO i WYŁĄCZNIE wtedy, gdy OBA jej wejścia będą podpite fałszem `0`. W każdym innym przypadku dławi prąd.  (Matematycznie: `~ (A + B)`).

---

## ⚔️ XOR: Złoty Standard Wykluczania (Exclusive OR)

Matematyczny zapis: `Z = A ⊕ B`. (Kółko z plusem w środku).

Spotkajcie królową szyfrowania i informatyki militarnej. Bramka XOR od setek lat wykorzystywana jest w zaawansowanej elektronice i kryptografii (tworzenie kluczy jednorazowych i hashy bit-flippingowych, chociażby w systemach SSL/TLS opartych o standard AES).

XOR podejmuje idealnie bezkompromisową, symetryczną decyzję operacyjną zwaną **Alternatywą Wykluczającą**.
Zwróci absolutną Prawdę (`1`) TYLKO WTEDY, gdy wejścia na jej "szpilkach" A i B się od siebie **RÓŻNIĄ**: 
- Podasz `0` na szpilkę A i podasz prąd `1` na B = WYJŚCIE 1. 
- Zrobisz odwrotnie (1 i 0) = WYJŚCIE 1.

Jeśli dostanie zgodność (Nieważne czy stanem niskim na obu jako 0 i 0, czy wysokim 1 i 1) – w milisekundę **WYKASUJE** prąd w procesorze sprowadzając stan Z na `0`. 

XOR jest idealna do **odejmowania lub dodawania binarnego** (połówkowy sumator). Stanowi potęgę algorytmiki z instrukcjami w Assemblerze potrafiącymi używać `XOR EAX, EAX` by wyzerować rejestry i zmniejszyć zasoby RAM operacji, bo dwa te same argumenty dają bezwzględnie równe 0.

---

## 🧠 Wyzwanie: Test Tablicy Prawdy!

Gdy inżynierowie chcą upewnić się, jak dany układ zachowa się przy różnych wariantach zasilania z VCC, tworzą tzw. **Tabele Prawdy**. Analizują wszystkie skrajności. Udowodnij wiedzę budując tabelę dla bramki NAND w locie, korzystając ze zrobionego przed momentem widgetu! Pamiętaj, czym charakteryzuje się odwrócony dławik...

<data-gate>
  <data-truth-table gate="NAND"></data-truth-table>
  
  <br>

  <div data-hint="success">
    Moduł zaliczony brawurowo! Logika NAND i NOR może płatać figle głowie. Bramki logiczne to Twój informatyczny fundament. W niedalekiej przyszłości z tych cegiełek będziesz mógł zaprojektować całą pamięć, cache lub licznik binarnego CPU dla ALU. Wracaj do drzewka umiejętności i rozwijaj się dalej! 🏆
  </div>
</data-gate>
