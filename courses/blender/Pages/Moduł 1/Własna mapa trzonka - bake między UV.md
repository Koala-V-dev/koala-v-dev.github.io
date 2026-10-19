# Własna mapa trzonka - bake między UV

Teraz przeniesiemy wygląd młotka do własnego atlasu. Trzonek i głowica dostaną wspólny układ UV oraz jeden zestaw Base Color, Roughness i Metallic. Dzięki temu retusz nie rozbije assetu na niezależne przestrzenie tekstur.

Otwórz [młotek z drewnem z poprzedniej lekcji](/public/courses/blender/Resources/mlotek-08-drewno.blend), zapisz jako `mlotek_v05.blend`. Potrzebujesz wersji z jesionem i matowym wykończeniem z poprzedniej lekcji.

## 🗺️ Oddziel miejsce odczytu od miejsca zapisu

Obecne UV trzonka wskazuje fragment fotografii o odpowiedniej skali. Docelowy atlas potrzebuje miejsca dla wszystkich powierzchni młotka. Samo przepakowanie istniejących współrzędnych przesunęłoby rysunek na modelu.

W Object Mode zaznacz trzonek. W Object Data Properties → UV Maps istniejący układ nazwij `UV_Drewno`, jeśli jeszcze tego nie zrobiłeś. W Shader Editorze dodaj UV Map, wybierz `UV_Drewno` i połącz jego UV z wejściami Vector obu obrazów źródłowych. To jawnie określa, skąd materiał czyta fotografię.

Przyciskiem + w UV Maps utwórz kopię i nazwij UV_Asset. Zaznacz jej wiersz i włącz przy niej ikonę aparatu: ma być aktywnym układem docelowym do bake i domyślnym odczytem przyszłych map.

![Aktywny wiersz UV_Asset i aparat wskazują docelowy układ](/public/courses/blender/Images/naprawa-uv-cel.png)

Powtórz utworzenie `UV_Asset` na głowicy. Jej stary układ nazwij `UV_Stal`. Obrazy stali mają nadal czytać UV_Stal przez węzeł UV Map. Nowy atlas nie może zmienić kierunku ani skali śladów obróbki.

W Object Mode zaznacz obie części, wejdź w Edit Mode i zaznacz całą siatkę. Nad UV Editorem wybierz <kbd>A</kbd>, następnie UV → Average Islands Scale i Pack Islands. W opcjach <kbd>F9</kbd> wyłącz Rotate, ustaw Margin Method: Fraction, Margin `0.015`.

![Wspólny atlas z UV obu części, bez nakładania ich na siebie](/public/courses/blender/Images/naprawa-atlas-uv.png)

Oczekujesz dziewięciu wysp: trzech trzonka i sześciu głowicy. Wszystkie mieszczą się w 0-1, nie zachodzą na siebie i mają odstępy. Dwa obiekty nie dostają osobnego prawa do tych samych pikseli: będą czytać ten sam obraz. Materiały nadal mają wyglądać jak wcześniej, bo fotografia czyta `UV_Drewno`.

## 🔥 Zapisz Base Color bez światła i bez utraty stali

**Bake** zapisuje wynik materiału w pikselach docelowego UV. W tym przypadku chcemy sam parametr Base Color, bez cieni i refleksów. Użyjemy tymczasowego Emission.

Dlaczego nie Diffuse? Dla drewna wypiek Diffuse/Color może działać, lecz metal o Metallic `1` nie ma takiej samej składowej rozproszonej. W tym zadaniu uzyskalibyśmy czarną głowicę zamiast jej Base Color. Emission pozwoli zapisać wskazany kolor niezależnie od metaliczności i lamp.

Zaznacz tylko trzonek. W jego materiale:

1. Dodaj Emission i połącz z jego wejściem Color tę samą fotografię, która zasila Base Color. Strength pozostaw `1`.
2. Tymczasowo połącz wyjście Emission z Material Output → Surface. Zachowaj Principled i jego połączenia, żeby później do niego wrócić.
3. Dodaj niepodłączony Image Texture → New: `Mlotek_BaseColor`, `2048 × 2048`, Blank, Alpha wyłączone, sRGB. Kliknij ten węzeł jako ostatni: jest celem zapisu, nie źródłem materiału.

![Odczyt ze źródłowego UV, tymczasowe Emission i niepodłączony obraz docelowy](/public/courses/blender/Images/naprawa-bake-wezly.png)

W materiale głowicy dodaj Emission i połącz z jego Color tę samą fotografię Metal009, która zasila Base Color. Strength `1`, wyjście do Surface. Dodaj Image Texture i wybierz ten sam istniejący `Mlotek_BaseColor`, bez tworzenia obrazu z kolejnym numerem. Ten węzeł również ma być aktywny w swoim materiale.

W zakładce z kluczem wyłącz działanie modyfikatorów obu części w renderze ikoną aparatu w ich nagłówkach. Cycles używa stanu renderowania, więc samo wyłączenie monitora podglądu nie wystarczy. Wypiekamy do UV siatki bazowej; fazy zostają edytowalne. Nie wyłączaj samych obiektów w renderze.

W Render Properties ustaw Cycles, sekcja Bake: Type Emit, Selected to Active wyłączone, Margin 16 px. Zaznacz tylko głowicę, włącz Clear Image w Output i kliknij Bake. Następnie zaznacz tylko trzonek, wyłącz Clear Image i wypiecz drugi raz. Drugi wypiek dopisuje drewno bez kasowania stali.

![Ustawienia Emission oraz Clear Image wyłączone przed drugim wypiekiem](/public/courses/blender/Images/naprawa-bake-panel.png)

W Image Editorze zapisz obraz PNG. Musisz zobaczyć zarówno beżowe wyspy drewna, jak i szare, teksturowane wyspy głowicy. Sama poprawna nazwa pliku nie potwierdza poprawnego bake.

## ✨ Wypiecz Roughness i Metallic

Przywróć Principled BSDF → Material Output, Surface w obu materiałach. W każdym dodaj Image Texture wskazujący ten sam nowy obraz `Mlotek_Roughness`, 2048 × 2048, Non-Color. Ustaw te węzły jako aktywne cele.

Wybierz Bake Type Roughness. Powtórz dwa wypieki: głowica z Clear Image, następnie trzonek bez Clear Image. Obraz ma zawierać ciemniejsze wyspy stali i jaśniejsze drewna. Zachowujemy również wynik Map Range z poprzedniej lekcji, nie sam surowy obraz źródłowy.

Utwórz analogicznie wspólny `Mlotek_Metallic`, Non-Color. Dla tego obrazu użyj ponownie Emission: odłącz przewód fotografii od wejścia Color tymczasowego Emission. Bez tego połączenie nadal sterowałoby kolorem. W próbce Color ustaw biel dla głowicy, czerń dla trzonka, Strength `1`. Wyjście Emission połącz z Surface w Material Output i wybierz Bake Type Emit.

Wypiecz głowicę z czyszczeniem i trzonek bez czyszczenia. Zapisz oba nowe PNG. Mapa Metallic wskazuje, które piksele należą do metalu; nie jest regulatorem połysku drewna.

![Trzy mapy tego samego atlasu: kolor, chropowatość i metaliczność](/public/courses/blender/Images/naprawa-atlas-mapy.png)

## 🔗 Zbuduj jeden materiał młotka

PBR, Physically Based Rendering, oznacza opis materiału przez właściwości powierzchni używane do obliczania światła. W naszym materiale obrazy przechowują barwę, chropowatość i metaliczność, a oświetlenie sceny dopiero wyznacza widoczne odbicia. Dzięki temu tekstury nie wymagają przemalowania po zmianie lampy.

Przywróć Principled BSDF → Surface na obu materiałach źródłowych. Zaznacz trzonek i otwórz Material Properties. Kliknij X obok nazwy materiału, aby odłączyć go od trzonka, a następnie New. Nazwij nowy materiał `Mlotek_PBR`.

Zaznacz głowicę. Z listy materiałów obok jej nazwy wybierz ten sam `Mlotek_PBR`, zamiast tworzyć drugi o podobnej nazwie. Obie części mają odczytywać te same obrazy, lecz przez własne wyspy wspólnego atlasu. Dodaj trzy Image Texture i połącz:

- `Mlotek_BaseColor`, sRGB → Base Color;
- `Mlotek_Roughness`, Non-Color → Roughness;
- `Mlotek_Metallic`, Non-Color → Metallic.

Puste wejścia Vector korzystają z aktywnego `UV_Asset` na każdej części. Usuń z tego materiału tymczasowe Emission. Włącz ponownie modyfikatory w renderze. Wróć do Material Preview: stal ma odbijać otoczenie, drewno pozostać matowe.

![Wspólny materiał PBR obu części młotka](/public/courses/blender/Images/naprawa-atlas-material.png)

Zapisz PNG, wykonaj Pack Resources i zapisz `.blend`. [Wynik lekcji](/public/courses/blender/Resources/mlotek-09-mapa-do-malowania.blend) zawiera wspólny atlas i materiał. Stare UV zachowują źródłowy odczyt; aktywne pozostaje `UV_Asset`.

Bake zmienił organizację danych, nie powinien zmienić wyglądu. Jeśli zniknął wcześniej wypalony fragment, sprawdź Clear Image przy drugim wypieku. Jeśli przesunął się rysunek drewna, sprawdź UV Map → UV_Drewno przy źródłowych obrazach. Jeśli nowy atlas jest pusty, sprawdź aktywny Image Texture w materiale wypalanej części.

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Źródłowe UV wskazuje, skąd materiał czyta obraz, a docelowe UV, gdzie bake zapisze wynik. Aktywny Image Texture wskazuje obraz zapisu. Przy dopisywaniu kolejnej części wyłącz Clear Image, żeby zachować pierwszy wypiek.
