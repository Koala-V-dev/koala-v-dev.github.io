# Młotek i osobny asset

Pierwsza lekcja modułu 1 kontynuuje zatwierdzoną ścieżkę: jeden model narzędzia przed materiałami, UV i importem. Loop Cut kształtuje trzonek, Extrude głowicę; Bevel pozostaje edytowalnym modyfikatorem. Model jest jeszcze przed materiałami i UV.

Dwie równorzędne kolekcje sceny: Stol_warsztatowy i Mlotek. Głowica jest dzieckiem trzonka, młotek nie jest dzieckiem stołu. Wszystkie 20 siatek stołu i ich transformacje zachowane.

Zapisano scenę stol-09-mlotek.blend oraz samodzielny mlotek-01-model.blend. Rzeczywisty test Copy Objects, nowy projekt, usunięcie obiektów startowych, Paste Objects i zapis. Samodzielny plik ma dwa obiekty, jedną kolekcję, jednostki Metric, origin dolnego końca trzonka w początku świata, lokalne siatki i parenting bez zależności od stołu. Następnie test wczytania kolekcji przez API Append do innej pustej sceny: obie części, parenting, geometria i modyfikatory zachowane; żadnych wymaganych bibliotek zewnętrznych.

7 autentycznych zrzutów, panel Bevel z oznaczeniami. Sprawdzone zamknięte siatki po modyfikatorach i oparcie narzędzia na blacie (odstęp poniżej 0.05 mm).

Źródło: https://docs.blender.org/manual/en/5.2/files/linked_libraries/link_append.html . Zachowanie sprawdzone w Blenderze 5.2.2.

Kolejny etap: materiały i cieniowanie tego samego młotka, następnie UV i tekstury.
