# UEFI i start systemu

UEFI pokazuje nowy SSD, a ekran zgłasza brak systemu. Co komputer już umie zrobić, skoro wyświetla model dysku?

## 🚦 Od zasilania do programu rozruchowego

Po włączeniu firmware inicjalizuje sprzęt i wykonuje wstępne kontrole, określane w praktyce jako POST. W trybie UEFI menedżer rozruchu wybiera wpis i uruchamia aplikację EFI, zwykle program rozruchowy systemu. Typowa instalacja przechowuje pliki startowe na partycji systemowej EFI, w skrócie ESP. W starszym trybie BIOS kod startowy może być pobrany z pierwszego sektora.

**Secure Boot** weryfikuje zaufanie do uruchamianych komponentów rozruchu. **TPM** udostępnia m.in. pomiary i ochronę kluczy. Przy zmianie ustawień startu na zaszyfrowanym komputerze najpierw ustal dostępność klucza odzyskiwania. Utrata wpisu rozruchowego i awaria dysku wymagają innych działań.

## 🔍 Co potwierdza każdy odczyt

| Obserwacja | Co już wiesz | Co sprawdzić dalej |
| --- | --- | --- |
| SSD jest na liście urządzeń | Firmware wykryło dysk. | Czy zapisany wpis startu wskazuje dostępny program EFI? |
| Nazwa systemu jest w menu startu | Firmware ma wpis rozruchowy. | Czy wybranie wpisu rzeczywiście uruchamia wskazany program? |
| Uruchomiło się narzędzie z USB | Wystartował program z USB. | Czy system uruchomi się po jednorazowym wybraniu SSD? |

Wpis w menu może pozostać zapisany po wyjęciu dysku. Może też wskazywać ścieżkę do pliku, który przestał istnieć. Dlatego sprawdzaj listę urządzeń i próbę uruchomienia wpisu osobno.

## 🧪 Uruchom komputer z pendrive'a na jeden raz

Przygotuj **zwykły pendrive z plikami** i **sprawdzony pendrive rozruchowy Windows 11**. Na stanowisku potrzebujesz działającego systemu i dostępu do jednorazowego menu startowego. Jeśli masz przygotować nośnik rozruchowy, użyj osobnego, pustego pendrive'a. Przygotowanie kasuje jego zawartość. [Instrukcja przygotowania nośnika w kursie Windows 11](/courses/windows-11/Pages/Moduł%200/Przygotowanie%20ISO.html#rufus-ventoy) · [Tworzenie nośnika według Microsoft](https://support.microsoft.com/en-gb/windows/deployment/install-upgrade/create-installation-media-for-windows).

### 🔌 Sprawdź, co płyta widzi

1. Podłącz zwykły pendrive. W Windows sprawdź, czy da się otworzyć jego katalog. Uruchom ponownie komputer i wywołaj **jednorazowe menu startowe** klawiszem opisanym w instrukcji swojego modelu. W pokazanym przez ASUS interfejsie opcję **Boot Menu** można otworzyć klawiszem <kbd>F8</kbd> po wejściu do UEFI. [Menu rozruchu w instrukcji ASUS](https://www.asus.com/global/support/faq/1013017/).
2. Zapisz, czy pendrive pojawił się na liście. Jeśli firmware ma osobną listę urządzeń USB, odczytaj również ją. Widoczność w Windows potwierdza, że system odczytuje urządzenie. Widoczność na liście USB potwierdza wykrycie przez firmware. Wpis startowy sprawdzasz w menu rozruchu.
3. Wyłącz komputer. W tym samym porcie podłącz sprawdzony nośnik rozruchowy. Wróć do jednorazowego menu. Odczytaj nazwę, wybierz wpis z USB i zatrzymaj próbę na pierwszym ekranie instalatora. Pojawienie się ekranu jest dowodem, że program rozruchowy z USB wystartował.

### 📝 Potwierdź powrót do rozruchu z dysku

Wyłącz komputer z ekranu startowego instalatora i odłącz nośnik. Włącz komputer normalnie i potwierdź powrót do systemu na SSD. W menu jednorazowym wybór dotyczył pojedynczego uruchomienia. W całej próbie pozostaw zapisane ustawienia rozruchu, Secure Boot i partycje bez zmian.

| Próba | Odczyt nośnika w Windows | Wpis w menu startowym | Wynik po uruchomieniu |
| --- | --- | --- | --- |
| Zwykły pendrive | | | |
| Nośnik rozruchowy | | | |
| Po odłączeniu USB | | | |

Jeśli sprawdzony nośnik rozruchowy nie pojawia się w menu, przełóż go do innego portu i powtórz próbę. Jeśli wpis jest widoczny, lecz wybór wraca do menu, zanotuj komunikat i sprawdź ten sam pendrive na drugim zgodnym stanowisku. W pierwszym przypadku sprawdzasz drogę od portu do wykrycia urządzenia. W drugim masz już wpis i sprawdzasz możliwość uruchomienia programu.

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 BootOrder to uporządkowana lista</span> <span class="deep-dive-badge">FIRMWARE UEFI</span></summary>
<div class="deep-dive-content">

Firmware UEFI może przechowywać wpisy `Boot0001`, `Boot0002` i listę `BootOrder` w nieulotnych zmiennych. Jeśli lista ma kolejność 0002, 0001, domyślnie pierwszy jest wpis 0002. Zmienna `BootNext` pozwala spróbować wskazanego wpisu jako pierwszego tylko przy następnym rozruchu. Firmware usuwa tę zmienną przed przekazaniem sterowania aplikacji. Jeżeli próba się nie powiedzie, menedżer może przejść do zwykłej listy. Dlatego narzędzie z USB na ekranie może być skutkiem wcześniejszego błędu SSD. [Model menedżera rozruchu w specyfikacji UEFI 2.11](https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Oddziel widoczność nośnika, wybór programu startowego i uruchomienie systemu.

