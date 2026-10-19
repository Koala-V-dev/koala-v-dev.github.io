# Nawigacja i odzyskiwanie widoku

Podczas oglądania modelu łatwo oddalić się tak, że zostaje sama siatka podłoża. To nie znaczy, że obiekt zniknął. Nauczysz się obracać widok, sprawdzać rzuty i wracać do zaznaczonego obiektu bez przesuwania samego modelu.

Możesz pracować na domyślnym sześcianie albo [pliku startowym](/public/courses/blender/Resources/m00-01-start.blend). Plik kontrolny ma ustawione jednostki metryczne. Przed jego otwarciem zapisz własną pracę, jeśli chcesz do niej wrócić.

## 🧭 Widok to nie transformacja modelu

Zaznacz `Cube` przez Outliner. Otwórz Item klawiszem <kbd>N</kbd> i odczytaj Location. Zapamiętaj wartości albo zrób zrzut. Teraz wykonaj trzy ruchy nad 3D Viewport:

| Czynność | Sterowanie myszą | Co obserwujesz |
| --- | --- | --- |
| Obrót widoku | Przytrzymaj środkowy przycisk i przeciągnij | Inne strony tej samej bryły |
| Przesunięcie widoku | Shift i środkowy przycisk, przeciągnięcie | Przesunięcie kadru |
| Przybliżenie | Kółko myszy | Większy lub mniejszy obraz obiektu |

Po każdym ruchu sprawdź Location. Wartości obiektu pozostają takie same. <strong>Zmiana kadru nie zmienia położenia modelu w scenie.</strong> Nie myl tego z operacją Move, którą wprowadzimy później.

Mysz nie ma środkowego przycisku? Skorzystaj z przycisków po prawej stronie widoku: lupa służy do przybliżania, dłoń do przesuwania. Przeciąganie manipulatora osi w narożniku obraca widok. Na ilustracji zaznaczono miejsca tych elementów.

![Prawy narożnik widoku: manipulator osi, lupa i dłoń do nawigacji](/public/courses/blender/Images/m00-navigation.png)

## 📏 Sprawdź model bez perspektywicznego skrótu

Naciśnij <kbd>Numpad 1</kbd>, aby ustawić widok od przodu. <kbd>Numpad 3</kbd> ustawia widok z prawej, a <kbd>Numpad 7</kbd> z góry. To klawisze bloku numerycznego, nie cyfry nad literami.

![Widok Front Orthographic, podpis widoku i kierunki osi zaznaczone na rzeczywistym zrzucie](/public/courses/blender/Images/m00-front.png)

W rzucie od przodu oglądasz płaszczyznę XZ i patrzysz wzdłuż osi Y. W prawym rzucie oglądasz YZ, a z góry XY. Przód obiektu artystycznego może być umówiony inaczej; nazwa widoku mówi o układzie sceny.

Rzut ortogonalny nie pomniejsza dalekich fragmentów tak jak perspektywa. Dlatego pomaga porównywać obrys z rysunkiem technicznym. Perspektywa przydaje się do oceny przestrzennej bryły. <kbd>Numpad 5</kbd> przełącza te sposoby projekcji.

Bez numpada wybierz **View → Viewpoint → Front**, Right lub Top w menu nad widokiem. Możesz również klikać odpowiednie końce osi manipulatora. Nie musisz włączać Emulate Numpad: zmienia ono znaczenie cyfr, których użyjemy do wyboru części siatki.

## 🛟 Zgub obiekt i znajdź go ponownie

1. Przesuń widok tak, aby sześcian znalazł się poza kadrem. Nie usuwaj obiektu.
2. W Outlinerze wybierz `Cube`.
3. Najedź nad 3D Viewport i wybierz **View → Frame Selected** albo <kbd>Numpad .</kbd>.
4. Sprawdź, czy wrócił sześcian oraz czy jego Location pozostało bez zmian.

Frame Selected kadruje zaznaczenie. Jeżeli zaznaczyłeś kilka obiektów odległych od siebie, program próbuje zmieścić je wszystkie. Wtedy wróć do wyboru samego `Cube`.

**Frame All**, zwykle pod <kbd>Home</kbd>, obejmuje wszystkie obiekty. To inna operacja. Daleki obiekt pomocniczy może sprawić, że właściwy model wygląda po niej na bardzo mały.

## 🧪 Samodzielna próba

Wybierz kamerę w Outlinerze i wykadruj ją przez Frame Selected. Obejrzyj ją z dwóch stron, potem wróć do sześcianu i ustaw rzut z góry. Sprawdź, czy ruch widoku zmienił Location któregokolwiek obiektu.

Warunki ukończenia: potrafisz wrócić do obiektu z listy, rozpoznać podpis widoku i uzyskać rzut z góry również przez menu. Nie oceniaj tempa tej próby.

<details>
<summary>Sprawdź wynik i typowy problem</summary>

Nawigacja nie zmienia transformacji. Jeśli model naprawdę się przesunął, mogłeś uruchomić Move zamiast Pan. Cofnij tę zmianę przez Ctrl+Z i spróbuj ponownie. Jeśli Frame Selected nie działa, sprawdź zaznaczenie oraz obszar pod kursorem. Wyłączony Num Lock może wpływać na działanie klawiatury numerycznej.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oglądasz obiekt bez zmieniania jego położenia.
- Używasz rzutów do kontroli proporcji i perspektywy do oceny bryły.
- Odzyskujesz widok przez zaznaczenie w Outlinerze i Frame Selected.
