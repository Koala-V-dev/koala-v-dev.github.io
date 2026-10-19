# Wymiary i pierwsza półka warsztatowa

Zrobisz prostą deskę półki o szerokości 120 cm, głębokości 30 cm i grubości 4 cm. To jeszcze nie kompletna półka z mocowaniem. Ten mały projekt pozwoli Ci połączyć odczyt wymiarów, położenie i skalę bez walki ze skomplikowaną siatką.

## 📏 Ustal jednostki przed wpisywaniem wymiarów

Zacznij od nowej sceny General. W edytorze **Properties** wybierz zakładkę **Scene**, rozwiń **Units** i ustaw `Unit System: Metric` oraz `Unit Scale: 1`. Jeśli nie możesz znaleźć tej zakładki, możesz zacząć od [pliku z ustawionymi jednostkami](/public/courses/blender/Resources/m00-01-start.blend). Nie zmieniaj Unit Scale tylko po to, żeby model zaczął wyglądać na mniejszy.

![Ustawienia sceny: Unit System Metric i Unit Scale 1](/public/courses/blender/Images/m00-units.png)

Przy tych ustawieniach w polach długości możesz wpisywać np. `1.2 m`, `30 cm` i `4 cm`. Używaj kropki dziesiętnej jak w pokazanych polach. Po zatwierdzeniu Blender może przeliczyć zapis na metry. Jednostka w polu mówi więcej niż pozorna wielkość obiektu na ekranie.

## 🧱 Zmień wymiary sześcianu

Wybierz `Cube` i sprawdź Object Mode. Otwórz Item klawiszem <kbd>N</kbd>. Dwuklik w pole **Dimensions X** pozwoli wpisać wartość; zatwierdź ją przez <kbd>Enter</kbd>. W ten sam sposób ustaw pozostałe pola:

| Pole | Wpisz | Znaczenie w tej scenie |
| --- | --- | --- |
| Dimensions X | `1.2 m` | Szerokość deski |
| Dimensions Y | `30 cm` | Głębokość |
| Dimensions Z | `4 cm` | Grubość |
| Location X | `0` | Środek deski w osi X |
| Location Y | `0` | Środek deski w osi Y |
| Location Z | `1.4 m` | Wysokość środka deski |

Nie wpisuj tych liczb w Scale. Scale jest mnożnikiem, a Dimensions rozmiarem. Po zmianie wymiarów przez Object Mode skala będzie niejednostkowa i jest to oczekiwany stan pośredni.

![Deska przed Apply Scale: oznaczone wymiary, położenie i mnożniki skali](/public/courses/blender/Images/m00-shelf-before.png)

Wykadruj deskę przez Frame Selected. Jeżeli znika w cienkiej kresce, obróć widok: możesz patrzeć prawie wzdłuż jej grubości. Najpierw sprawdź wymiary, zamiast losowo zwiększać skalę.

## 🎯 Środek obiektu i dolna powierzchnia

Pomarańczowa kropka to **Origin**, punkt odniesienia obiektu. Dla tego sześcianu pozostał na środku. Location Z=1.4 m ustawia środek, nie dolną powierzchnię.

Przy grubości 0.04 m dolna powierzchnia jest na wysokości `1.4 - 0.02 = 1.38 m`, a górna na `1.42 m`. To przyda się zaraz przy ustawianiu nóg stołu. Nie trzeba teraz przesuwać Origin.

Znacznik z krzyżykiem w środku sceny to **3D Cursor**. Nowo dodawane obiekty zwykle pojawiają się w jego położeniu. To inny element niż Origin deski. Na razie zostaw kursor w początku świata.

## ✅ Zastosuj skalę i zapisz pierwszy wynik

W Object Mode wybierz Object → Apply → Scale. Odczytaj ponownie Dimensions i Location. Żadna z tych wartości nie powinna zmienić się przez tę operację, a Scale ma teraz wynosić (1,1,1).

![Półka po Apply Scale: ten sam kształt i wymiary, skala jednostkowa](/public/courses/blender/Images/m00-shelf-after.png)

W Outlinerze zmień nazwę `Cube` na `Polka`: dwuklik w nazwę lub <kbd>F2</kbd> przy zaznaczonym obiekcie. Wybierz File → Save As, wskaż swój folder `projekty` i zapisz `polka_v01.blend`. Obsługę obrazów dołączanych do pliku przećwiczysz w następnej lekcji.

Możesz porównać wynik z [plikiem kontrolnym półki](/public/courses/blender/Resources/m00-04-polka-wynik.blend). Nie musisz mieć identycznego ustawienia kamery roboczej.

## 🧪 Samodzielna próba

Zapisz kopię jako `polka_v02.blend`. Zmień deskę na szerokość 80 cm, głębokość 25 cm i grubość 3 cm. Jej dolna powierzchnia ma znaleźć się dokładnie na wysokości 1.2 m. Sam oblicz wysokość środka. Zastosuj skalę i sprawdź wynik od przodu oraz z góry.

<details>
<summary>Sprawdź wymiary i wysokość środka</summary>

Dimensions powinno wynosić (0.8,0.25,0.03) m. Połowa grubości to 0.015 m, więc Location Z=1.215 m. Scale po zastosowaniu ma wynosić (1,1,1). Jeśli dolna powierzchnia trafiła na 1.185 m, ustawiłeś na 1.2 m środek zamiast spodu. To różnica interpretacji punktu odniesienia, a nie błąd precyzji programu.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wpisujesz wymiary fizyczne w Dimensions i kontrolujesz jednostki.
- Rozróżniasz Origin i 3D Cursor.
- Wyznaczasz środek obiektu na podstawie wymaganej wysokości jego powierzchni.
