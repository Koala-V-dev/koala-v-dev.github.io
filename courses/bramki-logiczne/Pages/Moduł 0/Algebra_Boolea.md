# Algebra Boole'a: Jądro Systemów Cyfrowych 🧠

W poprzednim kursie zgłębiliśmy sposób zapisu binarnych liczb w pamięci RAM. Ale pamięć to jedno, a **procesowanie** to drugie. Komputer potrafi podjąć decyzję na podstawie jedynek i zer. Aby zrozumieć jak "myśli" maszyna, poznaj **Algebrę Boole'a**.

---

## 👨‍🏫 Matematyka Prawdy i Fałszu

W 1854 roku genialny, samouk-matematyk **George Boole** opublikował dzieło, w którym przedstawił algebrę opartą absolutnie na dwóch wartościach. W jego systemie nie było miejsca na "może", nie było ułamków i liczb ujemnych. Były tylko dwa stany:
* **True (Prawda)** – czyli nasze bezbłędne `1`.
* **False (Fałsz)** – reprezentowane jako `0`.

System oparty na dwóch stanach był po prostu matematyczną ciekawostką... aż do 1937 roku.

## ⚡ Przełączanie Obwodów: Claude Shannon

Młody absolwent MIT, **Claude Shannon**, zrewolucjonizował inżynierię zauważając fenomenalną rzecz: matematyka Boole'a działa **dokładnie tak samo**, jak układ połączeń zwykłych elektrycznych przełączników! Zdefiniował tym samym fundamenty elektroniki cyfrowej.

> [!NOTE] Czym fizycznie jest 0 i 1?
> Współczesne mikroprocesory zbudowane są z miliardów "przełączników" zwanych **tranzystorami**.
> W klasycznej architekturze TTL (Transistor-Transistor Logic):
> - **1 (Stan Wysoki / Prawda):** Obecność napięcia bliskiego zasilaniu (np. ~5V lub ~3.3V).
> - **0 (Stan Niski / Fałsz):** Brak napięcia lub napięcie bliskie masie obwodu (GND, 0V).

Zamiast po prostu "przepuszczać prąd", używając algebry Boole'a możemy kazać tym przełącznikom (tranzystorom) wykonywać realne operacje warunkowe. Zbudujmy bramkę logiczną! Zanim przejdziemy do prawdziwych bramek – pokonaj wyzwanie.

---

<data-gate>
  <data-quiz>
    <question>Kto zauważył, że dwustanową Algebrę Boole'a można idealnie odzwierciedlić na obwodach elektrycznych (stanowiąc fundament budowy komputerów)?</question>
    <options>
      <option correct>Claude Shannon, inżynier z MIT</option>
      <option>George Boole, brytyjski matematyk</option>
      <option>Alan Turing, w Enigmie</option>
      <option>Steve Wozniak z Apple</option>
    </options>
  </data-quiz>
  <div data-hint="error">
    Pamiętaj – to Boole wymyślił matematykę, ale to ktoś znacznie później spiął ją z fizycznym prądem układów! Przeczytaj uważnie nazwisko inżyniera z lat 30-tych.
  </div>
  <div data-hint="success">
    Zgadza się! To jego legendarna Praca Magisterska połączyła dwa światy: matematykę logiki z fizyką elektryczności.
  </div>
  
  <br>

  ## 🎉 Brawo! Witamy w Logice Cyfrowej

  Teraz, znając podstawy, możemy zacząć układać nasze własne wirtualne tranzystory w tzw. **Bramki Logiczne**. Bramki to układy fizyczne potrafiące brać dwa lub więcej prądów (np. dwie jedynki) i odpowiadać określonym wyjściem zgodnie z matematyką Boole'a. 

  W następnej lekcji stworzymy absolutny trzon obliczeń komputerowych. Gotowy? Lecimy budować! 🚀

</data-gate>
