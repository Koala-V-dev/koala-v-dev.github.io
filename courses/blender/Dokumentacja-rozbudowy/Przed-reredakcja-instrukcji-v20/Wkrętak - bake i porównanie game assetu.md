# Wkrętak - bake i porównanie game assetu

Wypalimy materiały i zaokrąglenia high poly na oba przygotowane warianty. **LOD0 zachowuje geometrię rowków, LOD1 ma całkowicie gładkie pola chwytu.** Porównamy high poly z teksturami, low poly bez normal mapy oraz low poly z normal mapą, w tej samej kamerze i świetle.

Otwórz [LOD0 z UV](/public/courses/blender/Resources/wkretak-LOD0-uv.blend) albo [LOD1 z UV](/public/courses/blender/Resources/wkretak-LOD1-uv.blend). Proces wykonujesz dla każdego osobno. Nie przypisuj drugiemu LOD pierwszej normal mapy tylko dlatego, że oba przedstawiają ten sam przedmiot: mają inną geometrię, UV i bazę normalnych.

## 🎯 Cel wypalania jest na low poly

Ustaw Render Engine **Cycles**. Obie części LOW korzystają z jednego materiału docelowego i wspólnie rozłożonego UV_Asset. W Shader Editor tego materiału dodaj **Image Texture → New**, z rozmiarem **2048 × 2048**. Nazwij obraz np. Wkretak_LOD1_Normal i ustaw Color Space **Non-Color**.

Zaznacz węzeł Image Texture tak, aby był aktywny. **Nie podłączaj go na czas pierwszego bake do Normal ani Base Color.** Aktywny węzeł wskazuje obraz docelowy, a nie źródło wyglądu. Pomylenie tych ról może skończyć się pustym obrazem albo wypalaniem nie tego materiału.

![Aktywny, niepodłączony obraz docelowy w materiale low poly](/public/courses/blender/Images/wkretak-bake-cel.png)

Na początek wypalamy tylko rękojeść. Odznacz wszystko, pokaż HIGH_Rekojesc i LOW_Rekojesc, zaznacz **HIGH**, a potem z Shift **LOW jako aktywne**. Nie zaznaczaj grotów. Później zrobimy drugą parę. To zapobiega trafianiu promieni w niewłaściwą część przy styku stali z plastikiem.

Źródło i cel muszą być w tym samym miejscu. Na ilustracji high poly jest pokazane jako siatka dla czytelności; nie przesuwamy go obok celu.

## 📡 Promienie, cage i margines mają różne zadania

W Render Properties otwórz **Bake**. Ustaw Bake Type **Normal**, w Influence wybierz **Space Tangent**. Pozostaw kierunki kanałów **+X, +Y, +Z**. Włącz **Selected to Active**.

W jego rozwinięciu włącz **Cage**, pozostaw Cage Object puste i ustaw **Extrusion około 0.0006 m**. Korzystamy z automatycznie rozsuniętej powierzchni celu. To początek promieni szukających high poly, nie głębokość rowków ani siła normal mapy.

![Źródło HIGH, aktywny cel LOW oraz ustawienia bake Selected to Active](/public/courses/blender/Images/wkretak-bake-panel.png)

Dodatnia odległość pozwala rozpocząć szukanie ponad powierzchnią low poly, również tam, gdzie łuk high poly wystaje poza prostą fazę celu. Promień ma trafić w odpowiadający fragment źródła. Zbyt małe rozsunięcie może pominąć fragment wypukłości; zbyt duże może zacząć łapać sąsiednie ściany. Nie zwiększaj go bez końca, gdy problemem jest zły dobór źródła albo układ UV.

W Output wybierz Image Textures i ustaw **Margin 8 px**. To rozszerzenie wyniku poza granice wysp. Nie przesuwa promieni i nie powiększa detalu w geometrii. Dla przygotowanego atlasu 2048 zostawiliśmy odstępy na takie rozszerzenie.

Włącz **Clear Image** dla pierwszej pary i kliknij Bake. Obejrzyj wynik, zanim zrobisz pozostałe mapy. Potem odznacz rękojeści, pokaż i wybierz HIGH_Grot, a na końcu LOW_Grot jako aktywny. Aktywny węzeł obrazu jest wspólny, bo obie części używają materiału docelowego. **Wyłącz Clear Image** i wypal grot do wolnych wysp tego samego obrazu. Pozostawienie Clear usunęłoby wcześniej zapisany chwyt.

![Wypalona tangent normal mapa całego wariantu bez rowków w geometrii](/public/courses/blender/Images/wkretak-normal-atlas.png)

Zapisz obraz przez **Image → Save As**. Samo zapisanie pliku blend nie zastępuje zapisu lub spakowania nowo wypalanych obrazów.

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

**Roughness** wypal przez Bake Type Roughness. Nie renderujemy plamy światła na materiale; zapisujemy właściwość powierzchni, która ma potem reagować na inne oświetlenie.

**BaseColor** zapisz przez Emission, podobnie jak przy przenoszeniu map młotka. Na materiale HIGH dodaj tymczasowo Emission i podłącz do niego kolor, który chcesz utrwalić. Na tworzywie pobierz **neutralny Color Ramp przed mnożeniem przez niebieski kolor**. Na stali pobierz jej Color Ramp. Emission podłącz do Material Output, ustaw Bake Type Emit, wypal obie pary, a potem przywróć połączenie Principled BSDF z Output na HIGH.

Dlaczego neutralny kolor tworzywa? Zmienność powierzchni zostaje w obrazie, ale wybrany kolor chwytu będzie parametrem shadera. Nie potrzebujemy nowego kompletu map dla czerwonego, żółtego i niebieskiego wkrętaka. Stal zachowa swoje barwy.

**Metallic** także zapisz przez Emit: na czas wypalania tworzywa Emission ma kolor czarny, na stali biały. Emit pozwala zapisać tę pojedynczą właściwość bez wpływu oświetlenia. Po wypaleniu przywróć właściwe wyjścia materiałów źródłowych.

![Cztery rzeczywiście wypalone obrazy we wspólnym atlasie](/public/courses/blender/Images/wkretak-cztery-mapy.png)

Nie wypalaj oświetlenia studyjnego do BaseColor. Utrwalony jasny refleks pozostałby na teksturze po obróceniu narzędzia w grze. Ambient occlusion, cienie i oświetlenie to odrębne zagadnienia; normal mapa nie staje się ich zamiennikiem.

## 🔌 Zbuduj materiał docelowy i sprawdź maskę koloru

Roughness i Metallic podłącz do odpowiadających im wejść Principled. Obraz Normal, z Non-Color, połącz z **Normal Map → Color**, Space Tangent, UV Map **UV_Asset**, Strength **1**. Normal wyjściowe węzła połącz z Principled → Normal. Nie podłączaj kolorów RGB normal mapy bezpośrednio do tego wejścia.

![Normal mapa jako dane Non-Color, węzeł Normal Map i wejście shadera](/public/courses/blender/Images/wkretak-normal-wezly.png)

Dla koloru użyj **Math → Subtract**, ustaw pierwszą wartość 1, do drugiej podłącz Metallic. Wynik to maska tworzywa: biały na plastiku, czarny na stali. W **Mix Color/Multiply** podaj ją jako Factor, neutralny BaseColor jako pierwszy kolor, a węzeł RGB **Kolor tworzywa** jako drugi. Wynik podłącz do Base Color.

Tam, gdzie maska jest biała, neutralna struktura zostaje pomnożona przez kolor. Tam, gdzie czarna, shader przepuszcza oryginalny kolor stali. To konkretne zadanie maski, nie kolejna tekstura dodana bez powodu.

![Maska tworzywa z Metallic i niezależny parametr barwy chwytu](/public/courses/blender/Images/wkretak-tint-wezly.png)

Zmień kolor na czerwony. Metal musi pozostać niezmieniony.

![Zmiana jednego parametru koloru przy tym samym atlasie i niezmienionej stali](/public/courses/blender/Images/wkretak-kolor-game.png)

Jeśli barwi się również grot, sprawdź maskę i wejścia Mix, zamiast przemalowywać stal na kolejnym obrazie.

Zaznacz obie części LOW i połącz **Ctrl+J**. Ponieważ korzystają z tego samego materiału i wspólnego atlasu, powstaje jeden obiekt z jednym materiałem. Nie spawamy stali z plastikiem: rozłączne, osadzone w sobie części mogą należeć do jednego assetu. HIGH zachowaj osobno i ukryj. W File → External Data wybierz **Pack Resources**, a obrazy zachowaj również jako osobne PNG do silnika.

## 🔎 Porównaj wygląd, a nie sam licznik trójkątów

Poniższe rendery mają tę samą kamerę, ekspozycję i oświetlenie. High poly korzysta z opisanych materiałów, low poly z wypalonych map. Wariant bez normal mapy nadal ma kolor, Roughness i Metallic; odłączona jest tylko informacja o kierunkach.

![High poly, wariant z rowkami i wariant gładki z wypalonym reliefem](/public/courses/blender/Images/wkretak-high-lod-porownanie.png)

![Gładka siatka: bez normal mapy oraz z wypalonymi rowkami](/public/courses/blender/Images/wkretak-normal-przed-po.png)

Sprawdź również tył i skośny widok. Szew nie może być ukryty wyłącznie dlatego, że front dobrze wygląda. Jeżeli po włączeniu mapy pojawiają się wypukłe dna albo skośne plamy, sprawdź docelowe normalne, triangulację, UV i promienie. Jeżeli wszystkie zagłębienia wyglądają na wypukłe po imporcie, sprawdź konwencję kanału Y normal mapy. Nie naprawiaj każdego z tych problemów zwiększaniem rozdzielczości.

## 📦 Rozdziel master od pliku do gry

Master zachowuje mapy **2048** do dalszej pracy. W paczce do gry są warianty **1024**, z porównaniem w tym samym kadrze. Zmniejszenie obu wymiarów o połowę daje cztery razy mniej pikseli. Nie gwarantuje czterokrotnie mniejszego zużycia VRAM: zależy ono też od formatów, kompresji, kanałów i mipmap w silniku.

![Master 2048 oraz wersja 1024 z tej samej kamery](/public/courses/blender/Images/wkretak-2048-1024.png)

W zwykłym kadrze wybierz mniejszą mapę, jeśli zachowuje potrzebny wygląd. Do bardzo bliskiej inspekcji pozostaje master. Nie wyostrzaj normal mapy jak fotografii: przechowuje kierunki. Przy przygotowaniu mniejszej wersji normalne zostały ponownie znormalizowane.

W **GLB** kolor niebieski jest już utrwalony w przenośnym BaseColor, a standardowy materiał PBR zawiera pozostałe mapy. W projektach blend pozostaje neutralny obraz i maskowany parametr koloru. W paczce znajdziesz oba obrazy: neutralny do własnego shadera oraz niebieski do prostego materiału. Są także warianty danych: **ORM** z R=1, G=Roughness, B=Metallic, mapa **Metallic/Smoothness** dla workflow Standard/URP Unity oraz normal mapa z odwróconym zielonym kanałem dla konwencji DirectX. Kanał R w ORM jest biały: nie udajemy wypalonego AO. Smoothness jest tu obliczone jako 1-Roughness; mapa Standard/URP nie jest automatycznie Mask Mapą HDRP. To dwa warianty koloru na tym samym układzie UV, nie dwa różne atlasy geometrii.

FBX zawiera siatkę, UV, normalne i tangenty, a obrazy są osobno. Import shadera zależy od silnika. GLB ma osadzony podglądowy materiał, lecz same nazwy LOD0 i LOD1 nie konfigurują automatycznego przełączania poziomów w grze.

Normal mapa jest w konwencji **+Y**. Unity i Godot oczekują takiej konwencji; przy imporcie do Unreal sprawdź ustawienie odwrócenia zielonego kanału. Mapy danych importuj jako dane, a normal mapę jako normal mapę, z zachowaniem zgodnych normalnych i tangentów siatki. Ustawienia silników omówimy na ich rzeczywistym imporcie, zamiast zakładać, że przenoszą cały graf Blendera. Konwencje opisują dokumentacje [Unity](https://docs.unity3d.com/6000.1/Documentation/Manual/StandardShaderMaterialParameterNormalMap.html) i [Godot](https://docs.godotengine.org/en/stable/classes/class_resourceimportertexture.html); opcję odwracania zielonego kanału opisuje [Unreal Interchange](https://dev.epicgames.com/documentation/unreal-engine/interchange-import-reference-in-unreal-engine?lang=en-US).

Pobierz [master LOD0](/public/courses/blender/Resources/wkretak-LOD0-bake.blend), [master LOD1](/public/courses/blender/Resources/wkretak-LOD1-bake.blend), [projekt z oboma LOD i mapami 1024](/public/courses/blender/Resources/wkretak-game-LOD.blend) lub [paczkę game assetu: blend, FBX, GLB i tekstury](/public/courses/blender/Resources/wkretak-game-asset.zip).
