# Materiały i cieniowanie młotka

Druga lekcja modułu 1: Material Preview, dwa osobne materiały Principled, Base Color, Metallic, Roughness, wpływ otoczenia i poprawa cieniowania przez Shade Smooth oraz Bevel Harden Normals. Bez tekstur obrazowych, słojów i zużycia; te wymagają kolejnego etapu.

Trzonek: A66F3F sRGB, Metallic 0, Roughness 0.55. Głowica: B8BDC2 sRGB, Metallic 1, Roughness 0.28. Kolory przeliczone na liniowe wartości shaderów i sprawdzone.

6 rzeczywistych ilustracji z Blender 5.2.2: oznaczone przyciski i parametry, dwa porównania w identycznych kadrach (chropowatość 0.08/0.75 i cieniowanie przed/po), wynik. Oświetlenie podglądu forest.exr, bez lamp i świata sceny.

Wynik: mlotek-02-materialy.blend. Geometria bazowa, położenie, parenting oraz pozycje wierzchołków po Bevel bez zmian. Dwa lokalne materiały, brak wymaganych zewnętrznych obrazów i bibliotek. Test ponownego Append całej kolekcji do pustej sceny z materiałami i ustawieniami wygładzania przeszedł.

Nie zastosowano Shade Auto Smooth: w tej instalacji tworzył odwołanie do biblioteki Essentials. Shade Smooth z Harden Normals osiąga cel tej lekcji bez dodatkowego modyfikatora i zależności.

Źródła: https://docs.blender.org/manual/fr/5.2/render/shader_nodes/shader/principled.html ; https://docs.blender.org/manual/id/5.2/scene_layout/object/editing/shading.html ; https://docs.blender.org/manual/en/4.2/editors/3dview/display/shading.html . Zachowanie i wynik potwierdzone w zainstalowanym Blenderze 5.2.2.

Dalszy krok: szwy UV, unwrap i checker na tym samym młotku, potem kierunek słojów i lokalne zróżnicowanie powierzchni.
