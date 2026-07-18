# Środowisko Graficzne Windows 11

Instalacja za nami – Twoim oczom ukazał się pulpit Windows 11. Czas go opanować. Jako profesjonalista musisz odnaleźć się w interfejsie graficznym (GUI), by móc błyskawicznie poruszać się po systemie, nie tracąc czasu. 💪

> [!NOTE]
> **GUI vs CLI:**
> - **GUI** (*Graphical User Interface*) – graficzne okna, ikony, mysz. Intuicyjne, przyjazne dla oka, ale nierzadko wolniejsze przy zaawansowanych lub powtarzalnych zadaniach.
> - **CLI** (*Command Line Interface*) – tekstowy wiersz poleceń. Wymaga znajomości składni, ale zapewnia najwyższą szybkość i pozwala na automatyzację skryptami.
> 
> Dobry technik IT opanowuje **oba** te środowiska. 

---

## ⚡ Power Skróty – Twoja Nowa Supermoc

Skróty klawiszowe oszczędzają tysiące kliknięć dziennie. Znając poniższą bazę, poruszasz się po systemie wielokrotnie szybciej:

| Skrót | Akcja | Po co? |
| :--- | :--- | :--- |
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>E</kbd></span> | Otwiera **Eksplorator plików** | Zarządzanie plikami i katalogami na dyskach|
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span> | Otwiera **Ustawienia systemu** | Natychmiastowy dostęp do konfiguracji |
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>R</kbd></span> | Okno **Uruchamianie** (Run) | Wywoływanie programów i ukrytych katalogów (np. `%appdata%`) |
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>X</kbd></span> | **Menu zaawansowane** (Power Menu) | Panel dla narzędzi administracyjnych (alternatywa dla prawokliku na Start) |
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>L</kbd></span> | **Zablokuj ekran** | Zabezpiecza sesję (UWAGA: blokuje, ale NIE wylogowuje! 😤) |
| <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>←</kbd> / <kbd>→</kbd></span> | **Snap** przypina okna do krawędzi | Szybsze rozłożenie wielu okien na Twoich ekranach |

> [!TIP]
> **Trick admina:** Wciśnij <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>X</kbd></span>, a następnie na klawiaturze wciśnij <kbd>A</kbd>. Otworzysz w ten sposób **Terminal z uprawnieniami Administratora** bez ani jednego kliknięcia myszką. ⚡🤯

---

<data-gate>
  <data-quiz>
    <question>
Siedzisz przy komputerze w biurze i musisz **błyskawicznie zablokować ekran**, aby nikt nie przejął sesji po Twoim wyjściu z pokoju. Jaki skrót klawiszowy zastosujesz?
    </question>
    <options>
      <item correct><kbd class="Win"></kbd> + <kbd>L</kbd></item>
      <item><kbd class="Win"></kbd> + <kbd>D</kbd></item>
      <item><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Del</kbd></item>
      <item><kbd class="Win"></kbd> + <kbd>X</kbd></item>
    </options>
    <div data-hint="error">
      Nie no, pomyśl. 
    </div>
    <div data-hint="success">
      Dokładnie tak! Błyskawiczne odcięcie dostępu. Ekran logowania wymaga podania PINu, ale wszystkie Twoje otwarte programy i karty przeglądarki cierpliwie czekają w tle na Twój powrót.
    </div>
  </data-quiz>
</data-gate>

---

## 🎨 Pasek Zadań i pozycjonowanie

Windows 11 przeniósł domyślnie przycisk Start na **środek paska zadań** – mocno wzorując się na systemach Apple'a i modyfikacjach Linuxa. Jeżeli zależy Ci na klasycznym układzie, powrót do tradycji zajmuje dosłownie chwilę:

1. Wciśnij <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>I</kbd></span> (otwarcie Ustawień).
2. Wybierz sekcję **Personalizacja**, a następnie **Pasek zadań**.
3. Rozwiń **Zachowania paska zadań**.
4. Zmień **Wyrównanie paska zadań** na `Do lewej`.

> [!TIP]
> W systemie Windows 11 w wersji `24H2` i nowszych, Microsoft wbudował ten przełącznik natywnie, oszczędzając nam grzebania w kluczach rejestru, co było koniecznością w pierwszych wydaniach Jedenastki!

---

## 🗂️ Eksplorator Plików – Drzewo Katalogów

Po wciśnięciu <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>E</kbd></span> masz przed sobą pełen widok Eksploratora. To na nim opiera się cała struktura organizacyjna logiki dyskowej.

Kluczowe lokalizacje, w których zawsze będziesz szukać śladów oprogramowania:

| Ścieżka | Co tam znajdziesz? |
| :--- | :--- |
| `C:\Users\[nazwa]\Desktop` | Prywatny pulpit – czyli pliki luźno rozsypane na tapecie użytkownika |
| `C:\Users\[nazwa]\Documents` | Dokumenty – domyślny kontener na pliki robocze |
| `C:\Users\[nazwa]\AppData` | **Ukryty folder!** Tutaj aplikacje przechowują swoje dane konfiguracyjne i pamięć podręczną |
| `C:\Windows\System32` | Podstawa systemu – biblioteki DLL, pliki jądra i narzędzia CLI |
| `C:\Program Files` | Oprogramowanie $64$-bitowe instalowane na komputerze |
| `C:\Program Files (x86)` | Kompatybilność wsteczna – starsze programy $32$-bitowe |

> [!IMPORTANT]
> `AppData` jest domyślnie **niewidoczny**. Żeby go odkryć: w górnym menu Eksploratora kliknij **Wyświetl** → **Pokaż** → **Ukryte elementy**. 
> To jest jedno z pierwszych ustawień, które musisz zmienić. Chcesz widzieć rozszerzenia plików (np. `.ini`, `.php`, `.html`, `.exe`, `.cpp` czy `.dll`). Dodatkowo złośliwe oprogramowanie często ma na sobie atrybut ukryty. 👾 
> ![Ukryte foldery i pliki z rozszerzeniami w Eksploratorze plików](/public/courses/windows-11/Images/dodatkowe-opcje-w-eksploratorze-plików.webp)

---


<data-gate>
  <data-connection-matcher title="Zarządzanie Środowiskiem">
    <div class="cmw-item" data-left="Okno Eksploratora plików do zarządzania dyskami" data-right='<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>E</kbd></span>'></div>
    <div class="cmw-item" data-left="Błyskawiczne wywołanie Menu zaawansowanego (Power Menu)" data-right='<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>X</kbd></span>'></div>
    <div class="cmw-item" data-left="Ochrona sesji na żywo poprzez zablokowanie ekranu użytkownika" data-right='<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>L</kbd></span>'></div>
    <div class="cmw-item" data-left="Domyślnie ukryte miejsce instalacji plików konfiguracyjnych apek" data-right="Katalog AppData w profilu <code>C:\Users\</code>"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Błyskawiczne operacje:** środowisko graficzne obsługuje się najszybciej skrótami klawiszowymi (np. <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>E</kbd></span> dla Eksploratora czy <span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>L</kbd></span> do natychmiastowej blokady). 🔒
- **Struktura katalogów:** domyślnym miejscem, gdzie oprogramowanie zrzuca pamięć podręczną i prywatne ustawienia, jest niewidoczny dla amatorów folder – `AppData`. 🗂️
- **Dostęp administratora z klawiatury:** najszybszym sposobem na uruchomienie konsoli z uprawnieniami administratora jest menu zaawansowane startu (<span style="white-space: nowrap;"><kbd class="Win"></kbd> + <kbd>X</kbd></span>, a następnie <kbd>A</kbd>). ⚡ 

---

Pulpit opanowany, a podstawowe skróty zapamiętane.  
W następnym module otworzymy w końcu Eksplorator plików i przejdziemy do codziennej obsługi systemu. 🏄‍♂️
