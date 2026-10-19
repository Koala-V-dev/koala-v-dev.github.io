# Start i mapa interfejsu

Otwierasz Blendera i widzisz wiele ikon. Nie musisz ich teraz poznawać wszystkich. W tej lekcji znajdziesz pięć miejsc, które pozwolą Ci wybrać obiekt, obejrzeć go i odczytać jego właściwości. Na końcu samodzielnie wybierzesz kamerę oraz wrócisz do sześcianu.

## 🖥️ Zacznij od zwykłej sceny

Uruchom Blendera. W ekranie powitalnym wybierz **General**, jeżeli tworzysz nowy plik. Gdy scena już jest otwarta, kliknij poza ekranem powitalnym. Do tej próby potrzebujesz zwykłej sceny początkowej.

W standardowej scenie są trzy obiekty: `Cube`, `Camera` i `Light`. Bryła pośrodku to sześcian. Pozostałe dwa obiekty służą do renderowania obrazu; do naszego pierwszego modelowania nie musisz ich ustawiać.

![Mapa interfejsu: oznaczone obszary pracy, lista obiektów, właściwości, oś czasu i zakładki](/public/courses/blender/Images/m00-ui.png)

1. **3D Viewport** to obszar oglądania i edycji sceny. Na razie najwięcej czasu spędzisz tutaj.
2. **Outliner** to lista obiektów. Nazwa na liście pozwala wybrać obiekt nawet wtedy, gdy trudno trafić w niego w widoku.
3. **Properties** zawiera ustawienia. Pionowy pasek ikon zmienia ich kategorię. Nie myl tego edytora z listą obiektów nad nim.
4. **Timeline** pokazuje czas animacji. W pierwszych ćwiczeniach możesz zostawić ją w spokoju.
5. **Workspaces**, np. Layout i Modeling, to przygotowane układy edytorów. Nie są kolejnymi krokami obowiązkowego kreatora.

Układ możesz później dostosować. Jeżeli Twój jest inny, zacznij od zakładki `Layout`. Nie przełączaj teraz każdego panelu, żeby szukać identycznych proporcji okien jak na ilustracji.

## 🖱️ Zaznacz i potwierdź wybór

1. Kliknij lewym przyciskiem nazwę `Cube` w Outlinerze.
2. Sprawdź pomarańczowy obrys sześcianu i zaznaczoną nazwę na liście.
3. Kliknij `Camera` w Outlinerze. Obrys powinien przejść na kamerę.
4. Kliknij `Cube`, żeby wrócić do sześcianu.

Pomarańczowy obrys nie jest zmianą materiału. Pokazuje zaznaczenie. W scenie z wieloma częściami aktywny obiekt decyduje o tym, czyje właściwości oglądasz.

Jeśli kliknięcie w widoku nie wybiera tego, czego oczekujesz, użyj listy. Nie trzeba wyostrzać celności myszy, by ruszyć dalej.

## 📐 Otwórz panel Item

Najedź kursorem na 3D Viewport i naciśnij <kbd>N</kbd>. Po prawej stronie tego obszaru otworzy się boczny panel. Wybierz zakładkę **Item**. To panel wewnątrz widoku, nie osobny edytor Properties.

![Panel Item: zakładka Item, wartości Scale i wymiary Dimensions zaznaczone na zrzucie](/public/courses/blender/Images/m00-item.png)

Odczytaj `Location`, `Rotation` i `Scale`. W standardowym sześcianie skala wynosi po 1 na każdej osi. `Dimensions` opisuje rozmiar obiektu; domyślny sześcian ma bok 2 jednostek sceny. Zapis jednostek zależy od konfiguracji sceny. W kolejnych ćwiczeniach ustawimy metry.

Nie zmieniaj jeszcze wszystkich liczb. Ta próba ma pokazać, gdzie wrócisz, gdy potrzebny będzie pomiar. Ponowne <kbd>N</kbd> zamyka panel.

## 🔎 Dlaczego skrót czasem nie działa

Wiele skrótów zależy od obszaru pod kursorem. Jeśli <kbd>N</kbd> naciskasz nad Outlinerem, nie oczekuj otwarcia panelu w widoku 3D. Przenieś kursor nad siatkę i spróbuj ponownie.

Nie musisz klikać pustego miejsca przed każdym skrótem. Takie kliknięcie może zmienić zaznaczenie. Najpierw wystarczy położenie kursora.

Jeśli widzisz tylko jeden wielki edytor, mógł zostać zmaksymalizowany. Nad tym edytorem naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>Space</kbd></span>, aby przełączyć maksymalizację obszaru.

## 🧪 Samodzielna próba

Wybierz `Light` przez Outliner, odszukaj ją w widoku i wróć do `Cube`. Następnie otwórz Item i odczytaj skalę sześcianu. Nie korzystaj z kolejności kliknięć z poprzedniego ćwiczenia.

Próba jest ukończona, gdy zaznaczenie na liście i w widoku dotyczy tego samego obiektu, a umiesz odróżnić Item od Properties. Nie musisz znać funkcji ikon światła.

<details>
<summary>Gdy wynik się nie zgadza</summary>

Jeżeli w Item widać parametry innego obiektu, wróć do zaznaczenia `Cube` w Outlinerze. Jeśli panel się nie otwiera, umieść kursor nad 3D Viewport. Obrys kamery lub lampy może wyglądać jak druciana konstrukcja: to normalny sposób przedstawienia tych obiektów.

</details>

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wybierasz obiekt na liście i potwierdzasz zaznaczenie w scenie.
- Odczytujesz transformacje w panelu Item.
- Gdy skrót nie działa, sprawdzasz obszar pod kursorem przed szukaniem awarii programu.
