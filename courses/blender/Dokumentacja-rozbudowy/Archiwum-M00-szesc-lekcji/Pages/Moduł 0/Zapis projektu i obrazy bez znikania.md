# Zapis projektu i obrazy bez znikania

Model otwiera się poprawnie, ale etykieta znika. Tak było z jedną z butelek autora: obraz przeciągnięto z przeglądarki, a zapisane odwołanie prowadziło do folderu tymczasowego. W czasie sesji obraz był widoczny. Po ponownym otwarciu nie było już pliku źródłowego.

W tej lekcji sprawdzisz różnicę między zapisaniem projektu a dostarczeniem jego zewnętrznych obrazów. Użyjesz gotowego stołu z testowym obrazem. Model pozostaje ten sam przed i po pakowaniu.

## 💾 Zapisuj etapy, do których potrafisz wrócić

Własną półkę zapisz przez File → Save As jako `polka_v01.blend`. Dalsze zmiany tego pliku zapisujesz przez File → Save lub <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>. Przed większą zmianą użyj nowej nazwy, np. `polka_v02.blend`.

Po pierwszym zapisie sprawdź nazwę w tytule okna. Samo wpisanie nazwy bez zatwierdzenia okna zapisu nie zapisuje projektu. Plik `.blend1`, który może pojawić się obok, jest kopią poprzedniego stanu zależną od ustawień zapisu. Nie traktuj go jako jedynej kopii zapasowej.

Otwórz zapisany plik przez File → Open. Jeśli pojawi się pytanie o niezapisane zmiany, najpierw zapisz je, jeżeli chcesz je zachować. Nie wybieraj odruchowo odrzucenia zmian.

## 🖼️ Przygotuj prawdziwą zależność obrazu

Pobierz do jednego folderu dwa pliki:

- [Stół z zewnętrznym obrazem](/public/courses/blender/Resources/m00-05-zaleznosci-start.blend).
- [Obraz testowy etykieta-kurs.png](/public/courses/blender/Resources/etykieta-kurs.png).

Nie zmieniaj nazwy PNG. Otwórz `.blend`. Na blacie jest materiał z węzłem Image Texture wskazującym obraz przez ścieżkę `//etykieta-kurs.png`. Początkowe `//` oznacza ścieżkę względem folderu pliku `.blend`.

W trybie Solid możesz nadal widzieć szary model. Aby obejrzeć materiał, wybierz **Material Preview**, jedną z kulek w prawym górnym rogu widoku. Przy pierwszym przełączeniu daj programowi chwilę na przygotowanie podglądu.

![Materiał testowy na tym samym stole; wskazany przycisk podglądu materiału](/public/courses/blender/Images/m00-packed-table.png)

Zielony obraz testowy jest dołączony do materiału blatu. Pozwala łatwo sprawdzić, czy po przeniesieniu projektu nadal odczytywany jest zasób obrazu. Pełne budowanie materiałów i UV będzie późniejszym tematem.

## 📦 Spakuj zasób i sprawdź, co się zmieniło

Wybierz **File → External Data → Pack Resources**. Następnie zapisz plik pod nową nazwą `stol_spakowany.blend`. Pakowanie dołącza obsługiwane zasoby do `.blend`; zapis utrwala tę zmianę na dysku.

![Menu External Data z zaznaczonym poleceniem Pack Resources](/public/courses/blender/Images/m00-pack-menu.png)

Po pakowaniu porównaj liczbę części stołu, ich kształt, wymiary i materiał. Powinny pozostać bez zmian. Pack Resources zmienia sposób przechowywania zasobu obrazu, a nie geometrię obiektu.

Obrazu, którego Blender już nie potrafi odczytać, nie odzyskasz samym Pack Resources. Najpierw znajdź właściwy plik i przywróć odwołanie, a dopiero potem pakuj. Jeśli plik zaginął, potrzebna jest jego kopia lub ponowne pobranie ze źródła.

## 🧳 Próba przeniesienia

1. W Eksploratorze utwórz nowy, pusty folder testowy.
2. Skopiuj do niego wyłącznie `stol_spakowany.blend`, bez PNG.
3. Zamknij ten projekt i otwórz kopię z nowego folderu.
4. Sprawdź ten sam stół i materiał w Material Preview.

Możesz porównać z [plikiem kontrolnym po pakowaniu](/public/courses/blender/Resources/m00-05-zaleznosci-spakowane.blend). Obraz powinien działać również bez PNG obok. Ten test jest mocniejszym dowodem niż to, że materiał był widoczny bezpośrednio po kliknięciu pakowania.

Pakowanie do `.blend` nie jest eksportem gotowej gry. Silnik może wymagać osobnych tekstur i konkretnego materiału. W tej lekcji testujemy przenośność projektu Blendera.

## 🧪 Samodzielna próba

Otwórz ponownie wersję startową, z obrazem obok. Zapisz własną kopię i spakuj zasoby. Przenieś tylko `.blend` do drugiego pustego folderu i ponownie otwórz. Warunki ukończenia: pięć części stołu, działający obraz i brak konieczności wskazania starej ścieżki.

<details>
<summary>Gdy obraz nie wrócił</summary>

Sprawdź kolejno: czy PNG działał przed pakowaniem, czy po Pack Resources zapisałeś `.blend`, czy otworzyłeś właśnie zapisaną kopię i czy oglądasz Material Preview. Różowy materiał może wskazywać brakującą teksturę, ale sam szary wygląd w Solid nie dowodzi braku obrazu.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Zapisujesz projekt i sprawdzasz go po ponownym otwarciu.
- Odróżniasz plik zewnętrzny od zasobu spakowanego w `.blend`.
- Pack Resources zachowuje model; poprawność potwierdzasz próbą przeniesienia.
