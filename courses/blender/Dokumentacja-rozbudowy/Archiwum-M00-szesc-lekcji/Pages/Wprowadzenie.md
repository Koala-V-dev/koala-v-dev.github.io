# Wprowadzenie

W tym kursie będziesz budować przedmioty, które da się wykorzystać w grze. Zaczniesz od kilku brył. Z czasem przygotujesz własną siatkę, UV, tekstury, kolizję i wersje modelu dopasowane do odległości kamery. Efekt sprawdzisz w Unity, Unreal Engine 5 i Godot.

Pierwszy stół będzie prosty. Nie musi wyglądać jak przedmiot z wysokobudżetowej gry. Ma pozwolić Ci zapanować nad widokiem, wymiarami i plikami. Jakość będziemy podnosić w kolejnych przejściach przez cały proces, zamiast wymagać od Ciebie wszystkich umiejętności naraz.

## 🧭 Jak pracować z lekcjami

Czytaj jeden etap, wykonuj go w Blenderze i porównuj z ilustracją. Zrzut pokazuje stan do sprawdzenia, a nie obraz do bezmyślnego odtworzenia. Numer przy opcji odsyła do opisu pod ilustracją. Możesz otworzyć obraz w nowej karcie i powiększyć.

Po demonstracji dostaniesz podobny przypadek do samodzielnego wykonania. Dopiero po próbie otwórz podpowiedź. Jeśli wynik jest inny, zacznij od sprawdzenia aktywnego obiektu, trybu pracy i ostatniej zmiany. Nie musisz od razu zaczynać całego projektu od nowa.

Wykonywanie po kolei skrótów z pamięci nie jest warunkiem postępu. Ważniejsze, żebyś potrafił znaleźć operację i ocenić jej skutek. Skróty przyspieszą pracę po kilku powtórzeniach.

## 🛠️ Przygotuj stanowisko

Materiał tej partii wykonano w <strong>Blenderze 5.2.2 LTS na Windows</strong>, z angielskim interfejsem i standardowym mapowaniem Blender. Instalacja z Microsoft Store jest odpowiednia. Własne mapowanie lub ustawienia Industry Compatible mogą zmieniać skróty; w tekście podajemy również nazwy operacji.

Przygotuj mysz z kółkiem i środkowym przyciskiem. Na laptopie możesz korzystać z przycisków nawigacji w widoku. Brak numpada nie blokuje ćwiczeń. Opcje alternatywne znajdziesz w lekcji o nawigacji.

Utwórz folder `Blender-kurs`, a w nim `projekty`, `tekstury` i `eksport`. Na początek pracuj na lokalnych plikach. Od lekcji o zależnościach będziemy świadomie przenosić całe paczki.

## 🧱 Pierwsza partia i dalsza droga

Aktualny moduł 0 prowadzi przez sześć lekcji: interfejs, nawigację, obiekt i siatkę, wymiary półki, zapis z obrazami oraz samodzielny stół. Każda ma zrzuty i zadanie z kryteriami ukończenia. Pliki kontrolne nie zastępują własnej próby.

Dalsza przebudowa obejmuje topologię i cieniowanie, referencje, UV, pierwszy import do silników, hard surface, bake i PBR. Potem powstaną moduły środowiska, optymalizacji i specjalizacje. Gotowe bazy i AI pojawią się po sprawdzianie samodzielnego wykonania oraz naprawy assetu. Te dalsze moduły są planem; nie są jeszcze gotowymi lekcjami.

Jeśli wracasz z Blendera 2.7, poświęć czas na pierwszą lekcję. Rozmieszczenie edytorów i podstawowy sposób zaznaczania mogły się zmienić względem Twoich dawnych ustawień. Umiejętność czytania bryły nadal będzie przydatna.

## ✅ Co będzie oznaczało dobry wynik

Oceniaj model w warunkach zadania. Na początku wystarczy poprawny wymiar, przewidywalna edycja i projekt, który da się ponownie otworzyć. Później dojdą jakość powierzchni, tekstury, koszt i test w silniku. Sam atrakcyjny render nie potwierdza wszystkich tych rzeczy.

Nie mierzymy teraz czasu. Zapisz raczej, gdzie się zatrzymałeś i jak rozpoznałeś przyczynę. To z takich obserwacji zbudujesz później sprawny sposób pracy.

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Możesz zrobić prosty, niedoskonały model i mieć poprawny wynik pierwszego ćwiczenia.
- Porównujesz stan po czynności, a potem próbujesz podobnego zadania samodzielnie.
- Pełny asset ocenisz również po imporcie do silnika; dojdziemy do tego stopniowo.
