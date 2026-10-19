# Texture Paint - przekrój drewna i retusz szwu

Na bokach trzonka mamy podłużne włókna. Na jego końcu widzimy drewno przecięte w poprzek, więc ten sam obraz boku przestaje pasować. Poprawimy przekrój i łączenie tylnego narożnika, zachowując wspólny atlas młotka.

Otwórz [wersję z atlasem](/public/courses/blender/Resources/mlotek-09-mapa-do-malowania.blend), zapisz jako `mlotek_v06.blend`. Wybierz File → External Data → Unpack Resources → Use files in current directory (create when necessary). Robocze PNG zapiszemy po malowaniu i ponownie spakujemy do projektu.

## 🪵 Zrozum, jaki kawałek drewna oglądasz

Trzonek nie jest małym pniem z rdzeniem pośrodku. To wąski element wycięty z większego kawałka drewna. Na jego czole mogą być widoczne prawie proste pasma albo fragmenty dużych łuków, których środek wypada daleko poza powierzchnią trzonka. W jesionie rysunek przekroju tworzą również skupienia porów. Nie trzeba obrysowywać każdego przyrostu ciemną kreską.

Przed malowaniem obejrzyj zdjęcia sanded i endgrain w [referencji jesionu](https://www.wood-database.com/white-ash/). Porównaj kierunek struktury, kontrast pasm i barwę. Zdjęcie w powiększeniu pomaga zrozumieć budowę, ale jego mikroskopowego kontrastu nie należy bezkrytycznie przenosić na cały młotek.

Boki i czoło pozostają tym samym drewnem. Zmiana kierunku cięcia nie uzasadnia białej końcówki przy brązowym trzonku. Najpierw dopasujemy barwę, potem strukturę.

## 🖌️ Ogranicz malowanie do końców

Zaznacz trzonek, włącz View → Local View → Toggle Local View lub <kbd>Numpad /</kbd> nad widokiem 3D. Wyłącz podgląd Bevela ikoną monitora. Wejdź w Edit Mode, włącz wybór ścian klawiszem <kbd>3</kbd> i odznacz wszystko. Zaznacz dolną i górną pokrywę trzonka, dodając drugą z przytrzymanym <kbd>Shift</kbd>.

Następnie z listy trybów w lewym górnym rogu widoku wybierz Texture Paint. W nagłówku widoku 3D włącz Face Selection Masking, przycisk maskowania ścian obok listy trybów. Pędzel ma teraz działać tylko na dwóch wybranych pokrywach. Zanim zaczniesz retusz, sprawdź ich zaznaczenie na modelu.

W nagłówku narzędzi Texture Paint rozwiń wybór płótna (Canvas). Ustaw Single Image i wybierz `Mlotek_BaseColor`. W Object Data Properties → UV Maps pozostaw aktywne `UV_Asset`. Wybór obrazu wskazuje, co malujesz, a wybór UV, gdzie trafią pociągnięcia na atlasie. W lewym Image Editorze wyświetl ten sam obraz w trybie Paint. Atlas zawiera również stal, lecz zaznaczenie ścian chroni ją przed przypadkowym zamalowaniem.

![Malowanie wybranego końca na wspólnej mapie młotka](/public/courses/blender/Images/naprawa-paint-czolo-ui.png)

Do oceny koloru użyj Solid → Lighting: Flat → Color: Texture. Ten podgląd oddziela namalowaną barwę od refleksów. Po retuszu obejrzymy materiał także w świetle.

## 🌳 Zachowaj barwę, zmień strukturę

Obróć widok pod dolny koniec. Pędzlem Paint Hard pokryj czoło brązem pobranym z sąsiedniego boku. Omijaj najciemniejsze włókna i najjaśniejsze smugi: szukasz barwy tła drewna. W przykładzie to okolice `AC957E` w polu Hex. To punkt odniesienia dla dostarczonej fotografii, nie uniwersalny kolor przekroju.

Przejdź na Paint Soft, niską Strength około `0.2-0.3`. Dodaj delikatne, nieregularne różnice jasności kolorem zbliżonym do bazy. Zostaw fakturę zamiast jednolitego wypełnienia. Następnie nieco ciemniejszym brązem zaznacz kilka słabych, miejscami przerywanych pasm. Przy tym rozmiarze trzonka wystarczą dwa lub trzy fragmenty, z łagodną krzywizną. Nie dodawaj środka okręgów.

Drobne skupienia ciemniejszych punktów przy pasmach mogą zasugerować pory. Oceniaj je także po oddaleniu: jeśli zamieniają się w czarne piegi, zmniejsz siłę lub cofnij pociągnięcie. Drobny rozmiar pędzla sam w sobie nie gwarantuje wiarygodnego szczegółu.

![Ten sam przekrój przed retuszem i po nim, z wyłączonym wpływem światła na kolor](/public/courses/blender/Images/naprawa-przekroj.png)

Na porównaniu widać również boczne powierzchnie, żeby ocenić zgodność barwy. Nie rozjaśniaj czoła dla samego podkreślenia, że zostało poprawione.

W edytorze 2D dociągnij kolor poza obrys wyspy na około 16 pikseli obrazu, zachowując odstęp od sąsiadów. To **padding**: zapas koloru używany przez filtrowanie tekstury. Rozmiar w pikselach dotyczy obrazu, nie ekranowego rozmiaru pędzla po powiększeniu.

Powtórz pracę na górnym końcu. W złożonym młotku jest schowany w głowicy, więc nie przeznaczaj na niego tyle pracy co na widoczny dolny koniec. Przełącz Canvas na `Mlotek_Roughness`. Maska dwóch końców ma pozostać włączona. Wybierz neutralną szarość o równych kanałach R, G i B około `0.74` i pomaluj końce.

Ta mapa opisuje chropowatość, dlatego nie pobieraj do niej brązu z fotografii drewna. Boki już są matowe; nie tworzymy tu skoku między lakierem a surowym cięciem.

## 🔗 Napraw szew bez rozmazywania drewna

Wyłącz maskę ścian. Ustaw tylny narożnik pośrodku widoku. Zrób krótkie próbne pociągnięcie w poprzek szwu i zobacz, gdzie zapisuje się na atlasie: ciągła kreska na modelu trafia na dwa brzegi wyspy. Szew rozdziela UV, nie powierzchnię siatki. Cofnij próbę <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Z</kbd></span>.

![Próbna kreska przechodzi przez narożnik i trafia na dwa brzegi atlasu](/public/courses/blender/Images/naprawa-paint-szew.png)

Wybierz Clone. Przez <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>LPM</kbd></span> wskaż źródło na pobliskim fragmencie o podobnej barwie i kierunku włókien. Maluj miękko wzdłuż łączenia, zaczynając od Strength około `0.3-0.5`. Dopasowuj miejsce pobrania, zamiast kopiować jedną charakterystyczną smugę przez całą długość trzonka.

![Tylny narożnik przed poprawką i po retuszu](/public/courses/blender/Images/naprawa-szew-retusz.png)

Pracuj tylko na widocznym uskoku. Szeroki Blur mógłby usunąć szew razem z włóknami i pozostawić rozmazany pas. Przełącz płótno na Mlotek_Roughness i sprawdź to samo miejsce w odbiciu. Retuszuj drugą mapę tam, gdzie również ma nieciągłość; poprawka Base Color nie edytuje jej automatycznie.

## 💾 Sprawdź wynik na całym przedmiocie

Włącz Bevel, wyjdź z izolacji i wróć do Material Preview. Obejrzyj dolny koniec, tył i cały młotek. Przekrój powinien różnić się strukturą, a nie wyglądać jak doklejona jasna zaślepka. Poprawiony narożnik ma zachować ostrość włókien.

Zapisz zmienione obrazy przez Image → Save As, następnie Pack Resources i zapisz `.blend`. Nie przemalowujemy mapy Metallic: drewno nadal ma wartość `0`, głowica `1`.

[Pobierz młotek po retuszu](/public/courses/blender/Resources/mlotek-10-przekroj-i-retusz.blend) lub [komplet wspólnych map PNG](/public/courses/blender/Resources/mlotek-atlas-po-retuszu.zip). UV obu części i materiał pozostają wspólne.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Malowanie w 3D może dopasować dwa odległe brzegi UV jednego szwu. Zachowuj kierunek włókien i podobną barwę, a każdą mapę poprawiaj zgodnie z jej rolą. Zapis projektu nie zastępuje zapisu zmienionych obrazów.
