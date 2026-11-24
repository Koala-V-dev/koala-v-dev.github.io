# Drukarka laserowa

Tekst wychodzi ostry, lecz toner schodzi przy lekkim potarciu zimnej kartki. Który etap procesu odpowiada za przytwierdzenie proszku?

## ⚡ Od ładunku do trwałego wydruku

![Drukarka laserowa HP LaserJet P1102w. Z przodu widać dolny podajnik papieru, a u góry miejsce odbioru wydruków.](/public/courses/urządzenia-techniki-komputerowej/Images/hp-laserjet-p1102w.webp)

W tym modelu papier wchodzi od przodu i wychodzi u góry. Zaznacz na wydruku krawędź, która wyszła pierwsza. To odniesienie do pomiaru odstępu plamek w kierunku przesuwu papieru. *Fot. MSDN.WhiteKnight. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:HP_LaserJet_P1102w.jpg).*

1. Układ ładuje bęben światłoczuły.
2. Laser zmienia lokalny ładunek, tworząc obraz utajony. W pokrewnej konstrukcji naświetla go listwa LED.
3. Toner tworzy widoczny obraz na bębnie.
4. Układ przenosi toner na papier, czasem z udziałem pasa transferowego.
5. Zespół utrwalania, czyli fuser, wykorzystuje ciepło i nacisk.
6. Układ czyści powierzchnię do następnego cyklu.

Toner widoczny na kartce sugeruje, że obraz przeszedł przynajmniej przez transfer. Sprawdź zgodność nośnika i ustawiony typ papieru. Te parametry wpływają na warunki utrwalania. Jeśli problem powtarza się na zalecanym papierze przy prawidłowych ustawieniach, skieruj urządzenie do serwisu według dokumentacji.

Gdy plamka pojawia się na kopii z urządzenia wielofunkcyjnego, wydrukuj raport z jego panelu. Raport powstaje bez skanowania oryginału i bez zadania wysłanego z komputera. Jeśli plamka powtarza się również na nim, zmierz odległość między odpowiadającymi sobie punktami dwóch kolejnych śladów w kierunku przesuwu papieru. Zanotuj model urządzenia i rodzaj papieru razem z pomiarem. Te dane przydadzą się w warsztacie diagnostyki druku i skanu w lekcji o skanerze dokumentowym.

## 🛠️ Zmierz ślady i wykonaj wydruk kontrolny

Na wydruku powtarza się ta sama plama. Przesuń dwa znaczniki na wysokość sąsiednich plam. Z klawiatury ustawiasz je strzałkami, a klawiszami Page Up i Page Down przesuwasz je o 10 mm. Porównaj zmierzony odstęp z tabelą dla modelu ćwiczeniowego.

| Powtarzalny odstęp | Zespół |
| --- | --- |
| 75 mm | Bęben |
| 94 mm | Zespół utrwalania |

Otwórz pokrywę i wstaw zapasowy zespół do jego komory. Możesz go przeciągnąć lub wybrać i wskazać komorę. Zamknij pokrywę i wydrukuj stronę kontrolną. Na rzeczywistej drukarce użyj tabeli producenta dla konkretnego modelu oraz jego procedury wymiany. [Diagnostyka odstępów między powtarzającymi się śladami według HP](https://support.hp.com/us-en/document/ish_2603350-2603306-16).

<data-gate>
  <data-laser-bench></data-laser-bench>
</data-gate>

## 🧪 Samodzielna próba

Plamka pojawia się co 38 mm wzdłuż kartki także na stronie testowej drukarki. Jaki mechanizm sugeruje stały odstęp? Jakiego dowodu potrzebujesz przed wskazaniem konkretnej części?

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Podejrzewaj element obracający się w cyklu druku. Porównaj odstęp z tabelą powtarzalnych wad dla konkretnego modelu. Ten sam objaw może pochodzić z różnych rolek lub bębna.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Od śladu do średnicy</span> <span class="deep-dive-badge">GEOMETRIA</span></summary>
<div class="deep-dive-content">

Jeśli jeden punkt rolki pozostawia jeden ślad na obrót bez poślizgu, 38 mm to jej obwód, a średnica wynosi około 38 / π = 12,1 mm. Obliczenie zawęża podejrzenie. Różna prędkość powierzchni albo inna droga transferu zmienia zależność. [Proces obrazowania w instrukcji serwisowej HP LaserJet 1022](https://h10032.www1.hp.com/ctg/Manual/c00631427.pdf).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Powiąż wadę z etapem ładowania, naświetlania, transferu, utrwalania lub czyszczenia. Potwierdź trop stroną testową.

