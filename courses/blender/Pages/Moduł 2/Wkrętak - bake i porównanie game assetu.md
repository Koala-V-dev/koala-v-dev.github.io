# Wkrętak - bake i porównanie game assetu

Wypalimy materiały i zaokrąglenia high poly na oba przygotowane warianty. LOD0 zachowuje geometrię rowków, LOD1 ma całkowicie gładkie pola chwytu. Porównamy high poly z teksturami, low poly bez normal mapy oraz low poly z normal mapą, w tej samej kamerze i świetle.

Otwórz [LOD0 z UV](/public/courses/blender/Resources/wkretak-LOD0-uv.blend) albo [LOD1 z UV](/public/courses/blender/Resources/wkretak-LOD1-uv.blend). Proces wykonujesz dla każdego osobno. Nie przypisuj drugiemu LOD pierwszej normal mapy tylko dlatego, że oba przedstawiają ten sam przedmiot: mają inną geometrię, UV i bazę normalnych.

## 🎯 Cel wypalania jest na low poly

W Properties otwórz Render Properties i zmień Render Engine na Cycles. Niżej w tej zakładce pojawi się panel Bake.

Zaznacz LOW_Rekojesc i przejdź do Shading. Obie części LOW mają korzystać z tego samego materiału docelowego. W Shader Editor sprawdź jego nazwę w nagłówku, aby nie edytować materiału HIGH.

Dodaj Image Texture przez Add → Search. Kliknij New i utwórz obraz:

| Pole | Wartość |
| --- | --- |
| Name | `Wkretak_LOD1_Normal` lub `Wkretak_LOD0_Normal` |
| Width / Height | `2048` / `2048` |
| Generated Type | Blank |

Po utworzeniu ustaw w Image Texture Color Space: Non-Color. Normal mapa zawiera kierunki, a nie barwy do wyświetlenia. Przeliczenie sRGB zmieniłoby te dane.

Kliknij korpus tego węzła jako ostatni, aby stał się aktywnym celem wypalania. Pozostaw go niepodłączonego. Wybór obrazu w Image Editor służy do oglądania; cel bake wskazuje aktywny Image Texture w materiale LOW.

![Aktywny, niepodłączony obraz docelowy w materiale low poly](/public/courses/blender/Images/wkretak-bake-cel.png)

Na początek wypal rękojeść:

1. W Outlinerze pokaż HIGH_Rekojesc i LOW_Rekojesc, a ukryj oba groty. Nad widokiem 3D odznacz wszystko przez <span style="white-space: nowrap;"><kbd>Alt</kbd> + <kbd>A</kbd></span>.
2. Kliknij nazwę HIGH_Rekojesc w Outlinerze, następnie z przytrzymanym <kbd>Ctrl</kbd> nazwę LOW_Rekojesc. LOW ma być wybrany jako ostatni, aktywny.
3. Sprawdź w Shader Editor, czy materiał aktywnego LOW nadal ma zaznaczony obraz docelowy normal mapy.

**Selected to Active** będzie odczytywać zaznaczone HIGH i zapisywać wynik na aktywnym LOW. Później powtórzymy pracę na parze grotów. Rozdzielenie par zapobiega wypalaniu fragmentu stali na plastiku przy ich styku.

Źródło i cel muszą być w tym samym miejscu. Na ilustracji high poly jest pokazane jako siatka dla czytelności; nie przesuwamy go obok celu.

## 📡 Promienie, cage i margines mają różne zadania

W Render Properties otwórz Bake. Ustaw Bake Type Normal, w Influence wybierz Space Tangent. Pozostaw kierunki kanałów +X, +Y, +Z. Włącz Selected to Active.

W jego rozwinięciu włącz Cage, pozostaw Cage Object puste i ustaw Extrusion około 0.0006 m. Korzystamy z automatycznie rozsuniętej powierzchni celu. To początek promieni szukających high poly, nie głębokość rowków ani siła normal mapy.

![Źródło HIGH, aktywny cel LOW oraz ustawienia bake Selected to Active](/public/courses/blender/Images/wkretak-bake-panel.png)

Dodatnia odległość pozwala rozpocząć szukanie ponad powierzchnią low poly, również tam, gdzie łuk high poly wystaje poza prostą fazę celu. Promień ma trafić w odpowiadający fragment źródła. Zbyt małe rozsunięcie może pominąć fragment wypukłości; zbyt duże może zacząć łapać sąsiednie ściany. Nie zwiększaj go bez końca, gdy problemem jest zły dobór źródła albo układ UV.

W Output wybierz Image Textures i ustaw Margin 8 px. To rozszerzenie wyniku poza granice wysp. Nie przesuwa promieni i nie powiększa detalu w geometrii. Dla przygotowanego atlasu 2048 zostawiliśmy odstępy na takie rozszerzenie.

Włącz Clear Image dla pierwszej pary i kliknij Bake. Obejrzyj wynik, zanim zrobisz pozostałe mapy. Potem odznacz rękojeści, pokaż i wybierz HIGH_Grot, a na końcu LOW_Grot jako aktywny. Aktywny węzeł obrazu jest wspólny, bo obie części używają materiału docelowego. Wyłącz Clear Image i wypal grot do wolnych wysp tego samego obrazu. Pozostawienie Clear usunęłoby wcześniej zapisany chwyt.

![Wypalona tangent normal mapa całego wariantu bez rowków w geometrii](/public/courses/blender/Images/wkretak-normal-atlas.png)

Przełącz jeden z obszarów na Image Editor przez ikonę typu edytora w jego lewym górnym rogu. Z listy obrazów w nagłówku wybierz wypaloną normal mapę. W menu tego edytora wybierz Image → Save As, wskaż katalog tekstur i zapisz PNG. Samo zapisanie pliku blend nie zastępuje zapisu lub spakowania nowo wypalanych obrazów.

## 🪜 Dlaczego pionowa ścianka nie pokazała pełnego rowka

Pierwsza próba na całkowicie gładkim chwycie pokazywała głównie cienką obwódkę. Ściana rowka ustawiona prostopadle do kierunku projekcji ma niemal zerową szerokość w obrazie. Dno jest równoległe do zewnętrznego pola, więc samo w sobie nie oznacza innego kierunku normalnej. Nie da się odzyskać brakującej szerokości przez zwiększenie Strength.

![Bake pionowych ścian oraz wynik po nadaniu skosu w high poly; obie wersje na gładkiej siatce](/public/courses/blender/Images/wkretak-bake-skos.png)

Dlatego w high poly zwęziliśmy dno, zachowując jego głębokość. Ukośna ścianka ma szerokość w projekcji i zapisuje stopniową zmianę kierunku. Low poly nadal pozostaje płaskie. To przykład projektowania źródła pod bake, a nie dokładania losowych podziałów do celu.

Nawet poprawny bake nie odtworzy geometrycznego zasłaniania ani paralaksy głębokiej wnęki. Porównanie z bliska ma pokazać tę granicę, a oddalenie pozwoli ocenić, czy ma ona znaczenie dla małego narzędzia.

## 🗂️ Wypal kolor i właściwości powierzchni

Dla każdej następnej mapy utwórz nowy obraz i aktywny Image Texture w materiale LOW. Dla pierwszej pary włącz Clear, dla drugiej wyłącz. Nie zmieniaj między mapami geometrii, UV ani normalnych celu.

| Obraz | Color Space | Co zapisujemy |
| --- | --- | --- |
| BaseColor | sRGB | Neutralny nośnik tworzywa i kolor odbicia stali, bez światła |
| Roughness | Non-Color | Wartość wejścia Roughness źródłowego materiału |
| Metallic | Non-Color | 0 na tworzywie, 1 na stali |
| Normal | Non-Color | Kierunki z geometrii oraz mikroreliefu high poly |

Roughness wypal przez Bake Type Roughness. Nie renderujemy plamy światła na materiale; zapisujemy właściwość powierzchni, która ma potem reagować na inne oświetlenie.

BaseColor zapisz przez Emission, podobnie jak przy przenoszeniu map młotka. Zacznij od tworzywa: wybierz HIGH_Rekojesc, aby w Shader Editor pracować na jego materiale, a nie na materiale LOW. Dodaj <span style="white-space: nowrap;"><kbd>Shift</kbd> + <kbd>A</kbd></span> → Search → Emission. Połącz wyjście Color neutralnego Color Ramp z wejściem Color Emission.

To rampa przed węzłem Multiply, który nadaje niebieski kolor. Ustaw Strength Emission na 1. Wyjście Emission podłącz do Surface w Material Output, zastępując na chwilę przewód z Principled BSDF. Materiał źródłowy pokaże teraz samą jasność rampy, bez metalicznych refleksów i światła.

Utwórz obraz BaseColor w materiale LOW i zostaw jego Image Texture aktywny, tak jak przy normal mapie. W Bake ustaw Type: Emit. Ponownie zaznacz parę HIGH_Rekojesc i aktywny LOW_Rekojesc, włącz Clear Image i wypal. Następnie na HIGH_Grot podłącz Color jego Color Ramp → Color Emission → Surface Material Output.

Wybierz parę grotów z LOW jako aktywnym, wyłącz Clear Image i wypal do tego samego obrazu. Na końcu w obu materiałach HIGH przywróć przewód BSDF z Principled → Surface Material Output. Tymczasowe węzły Emission możesz zostawić odłączone do późniejszego użycia.

Dlaczego neutralny kolor tworzywa? Zmienność powierzchni zostaje w obrazie, ale wybrany kolor chwytu będzie parametrem shadera. Nie potrzebujemy nowego kompletu map dla czerwonego, żółtego i niebieskiego wkrętaka. Stal zachowa swoje barwy.

Metallic także zapisz przez Emit. W tymczasowym Emission odłącz przewód od wejścia Color, a w próbce koloru ustaw czerń dla tworzywa i biel dla stali. Pozostaw Strength `1`. Dla każdej pary odczytujesz HIGH, zapisujesz na aktywnym LOW; Clear Image włącz tylko dla pierwszej pary. Emit pozwala zapisać tę pojedynczą właściwość bez wpływu oświetlenia. Po wypaleniu przywróć właściwe wyjścia materiałów źródłowych.

![BaseColor, Roughness, Metallic i Normal we wspólnym atlasie](/public/courses/blender/Images/wkretak-cztery-mapy.png)

Nie wypalaj oświetlenia studyjnego do BaseColor. Utrwalony jasny refleks pozostałby na teksturze po obróceniu narzędzia w grze. Ambient occlusion, cienie i oświetlenie to odrębne zagadnienia; normal mapa nie staje się ich zamiennikiem.

## 🔌 Zbuduj materiał docelowy i sprawdź maskę koloru

Wybierz LOW i jego materiał w Shader Editor. Dla każdej zapisanej mapy dodaj Image Texture i wczytaj odpowiedni obraz przez Open albo wybierz go z listy obrazów węzła. Z wyjścia Color obrazu Roughness poprowadź przewód do Roughness Principled, a z Color obrazu Metallic do Metallic.

W obu Image Texture ustaw Non-Color. Obraz Normal, z Non-Color, połącz z Normal Map → Color, Space Tangent, UV Map UV_Asset, Strength 1. Normal wyjściowe węzła połącz z Principled → Normal. Nie podłączaj kolorów RGB normal mapy bezpośrednio do tego wejścia.

![Normal mapa jako dane Non-Color, węzeł Normal Map i wejście shadera](/public/courses/blender/Images/wkretak-normal-wezly.png)

Dodaj Math i wybierz operację Subtract. Górne Value pozostaw bez przewodu, wpisz `1`. Do dolnego Value podłącz Color obrazu Metallic. Wynik to 1 minus metaliczność: na plastiku `1`, na stali `0`.

Dodaj RGB, nazwij go `Kolor tworzywa` i wybierz kolor chwytu. Dodaj Mix Color, wybierz Multiply. Połącz:

- Value z Subtract → Factor Mix.
- Color obrazu neutralnego BaseColor → A Mix.
- Wyjście RGB → B Mix.
- Wynik Mix → Base Color Principled.

W starszym MixRGB wejścia A i B nazywają się Color1 i Color2. Factor określa obszar działania: `1` wykonuje mnożenie, `0` pozostawia kolor z A.

Tam, gdzie maska jest biała, neutralna struktura zostaje pomnożona przez kolor. Tam, gdzie czarna, shader przepuszcza oryginalny kolor stali. Wykorzystujemy więc istniejącą mapę Metallic także do ograniczenia zmiany koloru.

![Maska tworzywa z Metallic i niezależny parametr barwy chwytu](/public/courses/blender/Images/wkretak-tint-wezly.png)

Zmień kolor na czerwony. Metal musi pozostać niezmieniony.

![Zmiana jednego parametru koloru przy tym samym atlasie i niezmienionej stali](/public/courses/blender/Images/wkretak-kolor-game.png)

Jeśli barwi się również grot, sprawdź maskę i wejścia Mix, zamiast przemalowywać stal na kolejnym obrazie.

Zaznacz obie części LOW i połącz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>J</kbd></span>. Ponieważ korzystają z tego samego materiału i wspólnego atlasu, powstaje jeden obiekt z jednym materiałem. Nie spawamy stali z plastikiem: rozłączne, osadzone w sobie części mogą należeć do jednego assetu. HIGH zachowaj osobno i ukryj. W File → External Data wybierz Pack Resources, a obrazy zachowaj również jako osobne PNG do silnika.

## 🔎 Porównaj wygląd, a nie sam licznik trójkątów

Poniższe rendery mają tę samą kamerę, ekspozycję i oświetlenie. High poly korzysta z opisanych materiałów, low poly z wypalonych map. Wariant bez normal mapy nadal ma kolor, Roughness i Metallic; odłączona jest tylko informacja o kierunkach.

![High poly, wariant z rowkami i wariant gładki z wypalonym reliefem](/public/courses/blender/Images/wkretak-high-lod-porownanie.png)

![Gładka siatka: bez normal mapy oraz z wypalonymi rowkami](/public/courses/blender/Images/wkretak-normal-przed-po.png)

Sprawdź również tył i skośny widok. Szew nie może być ukryty wyłącznie dlatego, że front dobrze wygląda. Jeżeli po włączeniu mapy pojawiają się wypukłe dna albo skośne plamy, sprawdź docelowe normalne, triangulację, UV i promienie. Jeżeli wszystkie zagłębienia wyglądają na wypukłe po imporcie, sprawdź konwencję kanału Y normal mapy. Nie naprawiaj każdego z tych problemów zwiększaniem rozdzielczości.

## 📦 Rozdziel master od pliku do gry

Master zachowuje mapy 2048 do dalszej pracy. W paczce do gry są warianty 1024, z porównaniem w tym samym kadrze. Zmniejszenie obu wymiarów o połowę daje cztery razy mniej pikseli. Nie gwarantuje czterokrotnie mniejszego zużycia VRAM: zależy ono też od formatów, kompresji, kanałów i mipmap w silniku.

![Master 2048 oraz wersja 1024 z tej samej kamery](/public/courses/blender/Images/wkretak-2048-1024.png)

W zwykłym kadrze wybierz mniejszą mapę, jeśli zachowuje potrzebny wygląd. Do bardzo bliskiej inspekcji pozostaje master. Nie wyostrzaj normal mapy jak fotografii: przechowuje kierunki. Zmniejszanie i kompresję normal mapy oceniaj na modelu: po imporcie oznacz ją w silniku jako normal mapę, aby była przetwarzana jako kierunki, a nie zwykły obraz koloru.

Dołączona paczka pozwala wybrać dwa sposoby pracy z kolorem:

- W plikach blend pozostają neutralny BaseColor i parametr koloru ograniczony do tworzywa.
- GLB ma niebieski kolor utrwalony w BaseColor i standardowy materiał PBR. Ten prostszy materiał nie przenosi całego grafu węzłów Blendera.

FBX zawiera siatkę, UV, normalne i tangenty, a obrazy są osobnymi plikami. Tangenty opisują kierunek wzdłuż powierzchni używany razem z normalną do odczytu tangent normal mapy. Zgodność tej podstawy między bake i importem wpływa na poprawność odbić.

W paczce są też obrazy z kilkoma danymi zapisanymi w oddzielnych kanałach:

| Wariant | Zawartość | Zastosowanie |
| --- | --- | --- |
| ORM | R: biały, G: Roughness, B: Metallic | Shader odczytujący te trzy kanały w takim układzie |
| Metallic/Smoothness | Metaliczność i gładkość, gdzie Smoothness = 1 - Roughness | Odpowiedni materiał Standard/URP Unity; nie jest to Mask Map HDRP |
| Normal DirectX | Normal mapa z odwróconym zielonym kanałem | Importer lub shader oczekujący przeciwnego kierunku Y |

Kanał R w ORM jest biały, bo nie wypalaliśmy ambient occlusion, czyli przybliżonego zasłaniania otoczenia w zakamarkach. To dane pomocnicze do późniejszej integracji. Sam wybór nazwy pliku nie konfiguruje shadera silnika.

Nazwy LOD0 i LOD1 także nie uruchamiają automatycznego przełączania modeli. W tej części kursu porównujesz dwa warianty; ich podpięcie do systemu LOD należy do etapu importu.

Normal mapa jest w konwencji +Y. Unity i Godot oczekują takiej konwencji; przy imporcie do Unreal sprawdź ustawienie odwrócenia zielonego kanału. Mapy danych importuj jako dane, a normal mapę jako normal mapę, z zachowaniem zgodnych normalnych i tangentów siatki.

Ustawienia silników omówimy na ich rzeczywistym imporcie, zamiast zakładać, że przenoszą cały graf Blendera. Konwencje opisują dokumentacje [Unity](https://docs.unity3d.com/6000.1/Documentation/Manual/StandardShaderMaterialParameterNormalMap.html) i [Godot](https://docs.godotengine.org/en/stable/classes/class_resourceimportertexture.html); opcję odwracania zielonego kanału opisuje [Unreal Interchange](https://dev.epicgames.com/documentation/unreal-engine/interchange-import-reference-in-unreal-engine?lang=en-US).

Pobierz [master LOD0](/public/courses/blender/Resources/wkretak-LOD0-bake.blend), [master LOD1](/public/courses/blender/Resources/wkretak-LOD1-bake.blend), [projekt z oboma LOD i mapami 1024](/public/courses/blender/Resources/wkretak-game-LOD.blend) lub [paczkę game assetu: blend, FBX, GLB i tekstury](/public/courses/blender/Resources/wkretak-game-asset.zip).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

Przy Selected to Active źródłem jest zaznaczone HIGH, a celem aktywne LOW i aktywny obraz jego materiału. Błąd kierunku normal mapy, błąd projekcji i brak pikseli wymagają różnych poprawek. Gotowy plik eksportu trzeba jeszcze sprawdzić w docelowym silniku.
