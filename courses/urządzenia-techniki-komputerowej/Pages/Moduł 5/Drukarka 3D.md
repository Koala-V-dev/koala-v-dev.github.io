# Drukarka 3D

Prototyp pęka w poprzek warstw, chociaż w programie wyglądał poprawnie. Jak orientacja modelu może zmienić wynik?

## 🧱 Plik, warstwa i materiał

Model cyfrowy trafia do **slicera**, który dzieli go na warstwy i przygotowuje dane dla urządzenia. W FFF drukarka podaje filament, topi go w głowicy i układa ścieżki. W SLA laser utwardza ciekłą żywicę. W innych drukarkach żywicznych robi to obraz wyświetlany na całej warstwie. W SLS laser spaja materiał proszkowy. Każda metoda ma inne wymagania dotyczące materiału, podpór i obróbki.

![Prusa Mini podczas drukowania. Szpula filamentu stoi po prawej, głowica jest po lewej nad płaskim stołem, na którym powstaje biały element.](/public/courses/urządzenia-techniki-komputerowej/Images/prusa-mini.jpg)

*W Prusie Mini filament biegnie ze szpuli przez układ podawania do głowicy. Głowica układa ścieżki na stole i na wcześniej położonych warstwach. RAIL P (RAIL.PHOTOGRAPHY) / CC0 / Wikimedia Commons. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:Prusa_Mini.jpg).*

Przy FFF orientacja zmienia kierunek warstw względem obciążenia. Zmienia też potrzebę podpór i jakość powierzchni. Obejrzyj podgląd slicera, zanim wydrukujesz. Wybierz wysokość warstwy w granicach zalecanych dla konfiguracji. Więcej warstw może poprawić wygląd pochyłych powierzchni, ale zwykle wydłuża druk.

Stosuj instrukcję urządzenia dotyczącą gorących elementów, ruchu i wentylacji. Przy żywicach obowiązują procedury ochrony i utylizacji z instrukcji materiału.

## 🛠️ Obróć uchwyt i znajdź warstwę bez oparcia

Zaimportuj [model uchwytu L](/public/courses/urządzenia-techniki-komputerowej/Images/uchwyt-l.obj) w **PrusaSlicerze**. Wybierz profil drukarki FFF, materiał i wysokość warstwy 0,20 mm. Zachowaj te ustawienia w obu próbach. Wystarczy podgląd, więc ćwiczenie wykonasz także bez drukarki. [Import modelu i narzędzia orientacji w PrusaSlicerze](https://help.prusa3d.com/article/first-print-with-prusaslicer-3-0-0_1079761?product=prusaslicer).

1. Ustaw uchwyt pionowo, z poziomym ramieniem u góry. Wyłącz podpory i potnij model. W podglądzie znajdź pierwszą warstwę, na której pojawia się długie ramię. Porównaj ją z poprzednią i wskaż odcinek, który zaczynałby się nad pustką. Włącz automatyczne podpory i potnij ponownie. Sprawdź, czy pod tym odcinkiem pojawiły się ścieżki podpór.
2. Wróć do przygotowania. Użyj **Place on Face** i połóż uchwyt na szerokiej bocznej powierzchni w kształcie litery L. Wyłącz podpory, potnij i przejdź do podglądu pierwszej warstwy. Jeśli cała litera L jest widoczna od razu, pozostałe warstwy mają pod sobą poprzednie warstwy uchwytu.
3. Porównaj szacowany czas i ilość filamentu dla pozycji pionowej z podporami oraz leżącej bez podpór. Jeżeli siła rozciąga pionowe ramię wzdłuż jego długości, prześledź w obu pozycjach, czy działa wzdłuż płaszczyzn warstw, czy próbuje je rozdzielić.

Szacunek slicera pomaga wybrać orientację do próby. Wytrzymałość sprawdzisz na wydrukowanej próbce z tego samego materiału i z tymi samymi ustawieniami. [Orientacja i wytrzymałość w dokumentacji Prusa](https://help.prusa3d.com/article/modeling-with-3d-printing-in-mind_164135?product=core-one) · [Ustawienia podpór](https://help.prusa3d.com/article/support-material_1698).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Od wysokości modelu do warstw</span> <span class="deep-dive-badge">G-CODE</span></summary>
<div class="deep-dive-content">

W uproszczonym przykładzie warstwy mają stałą wysokość $h$. Dla elementu o wysokości $H=20\thinspace\mathrm{mm}$ i $h=0{,}25\thinspace\mathrm{mm}$ dostajemy $H/h=80$ warstw, a dla $h=0{,}20\thinspace\mathrm{mm}$ wychodzi 100. Przy mniejszym kroku potrzeba więcej przejść głowicy. Czas nie rośnie dokładnie w stosunku 100/80, bo długości ścieżek, prędkości i czas chłodzenia mogą się różnić. Polecenie `G1 X20 Y10` w typowym kontekście pozycjonowania bezwzględnego zleca ruch liniowy do współrzędnych. To jeden z elementów sterowania, obok trybu jednostek, temperatury i posuwu.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Orientację i ustawienia oceniaj w podglądzie warstw oraz na próbce sprawdzanej w docelowym kierunku obciążenia.

