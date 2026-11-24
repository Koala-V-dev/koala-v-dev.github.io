# Diagnostyka stacji roboczej

Komputer nie pokazuje obrazu po dołożeniu SSD i przełożeniu RAM. Możesz wrócić do ostatniej znanej konfiguracji. Jak udokumentujesz próbę, żeby po wyniku było wiadomo, czego się nauczyłeś?

## 🛠️ Zgłoszenie, hipoteza i jeden test

Zapisz, co zmieniło się tuż przed problemem. Sprawdź objaw od zewnątrz. Czy monitor ma zasilanie i właściwe wejście? Czy przewód prowadzi do odpowiedniego wyjścia? Czy wskaźnik płyty sygnalizuje konkretny etap? Odczytaj znaczenie wskaźnika w instrukcji modelu.

Jeżeli objaw pojawił się po dwóch zmianach, wróć do działającej konfiguracji przy odłączonym zasilaniu i zachowaniu ESD. Potem wprowadź jedną zmianę na raz. Zapisz stan, działanie, wynik i kolejną decyzję. Przy dysku z ważnymi danymi unikaj prób zapisujących dane przed ustaleniem stanu kopii.

Dowodem może być zdjęcie etykiety części, odczyt konfiguracji, wynik testu pamięci, strona testowa drukarki lub przywrócony plik. Dobierz dowód do hipotezy.

### 💾 Ślad rozruchu w karcie serwisowej

Jeśli pojawia się menu UEFI, a zamiast systemu startuje narzędzie z USB, użyj procedury z lekcji „UEFI i start systemu”. Zapisz trzy obserwacje osobno: **czy firmware widzi SSD**, **który wpis był wybrany** i **co uruchomiło się po próbie**. Wpisz „nie sprawdzono”, jeśli danej obserwacji brakuje.

Przykładowy zapis po jednorazowej próbie: „SSD widoczny. Wybrano menedżer startu systemu z SSD. Pojawił się ekran logowania”. Ten ślad uzasadnia porównanie domyślnej kolejności startu z jednorazowym wyborem. Jeżeli zamiast ekranu logowania pojawił się komunikat o braku programu EFI, zapisz komunikat i sprawdź wpis rozruchowy oraz dostępność pliku. Przed zmianami na nośniku ustal stan kopii danych.

## 🧰 Laboratorium odczytu w Windows 11

Potrzebujesz działającego komputera lub maszyny wirtualnej z Windows 11. W maszynie wirtualnej odczytasz urządzenia widoczne dla systemu gościa. Jeżeli pracujesz na papierze, użyj danych przykładowych poniżej.

1. Otwórz Menedżer urządzeń. Wybierz napęd dyskowy i zapisz model oraz stan widoczny we właściwościach.
2. Otwórz Zarządzanie dyskami. Dla dysku systemowego zapisz numer dysku, układ partycji i pojemność. Wybierz wolumin z literą i zapisz jego system plików. Korzystaj wyłącznie z odczytu. Gdy narzędzie zaproponuje inicjalizację dysku, anuluj ją.
3. W raporcie rozdziel informacje o urządzeniu, mapie partycji i woluminie. Wyjaśnij, dlaczego poprawny stan urządzenia nie wystarcza do potwierdzenia rozruchu systemu.

**Dane przykładowe:** urządzenie „Virtual Disk” działa poprawnie. Dysk 0 ma 64 GiB i używa GPT. Na dysku są partycja systemowa EFI i wolumin C: o rozmiarze 62 GiB w NTFS.

**Dowód wykonania:** oddaj trzy wiersze, po jednym dla urządzenia, dysku i woluminu. W przykładzie model „Virtual Disk” jest informacją o urządzeniu, GPT i 64 GiB opisują dysk, a NTFS i 62 GiB dotyczą woluminu C:. Do potwierdzenia rozruchu potrzebujesz m.in. dowodu, że firmware znalazło i uruchomiło program startowy. Jeśli masz dostęp do stanowiska, zestaw odczyt z lekcjami „Zarządzanie sprzętem i sterownikami” oraz „Zarządzanie dyskami i partycjami” w [Windows 11](/courses/windows-11/).

## 🧪 Samodzielna próba

Po powrocie do poprzedniej konfiguracji komputer startuje. Po dołożeniu SSD wstaje. Po przełożeniu modułów znów nie pokazuje obrazu i płyta wskazuje RAM. Zapisz hipotezę i kolejny test, który rozdzieli usterkę modułu od problemu obsady.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Zacznij od zalecanej obsady i parametrów domyślnych. Przetestuj każdy moduł osobno w tym samym zalecanym slocie. Jeżeli oba tam działają, sprawdź zalecaną konfigurację pary. Jeśli jeden regularnie zawodzi w tym samym slocie i warunkach, podejrzenie pada na moduł.

W karcie serwisowej zapisuj oznaczenie modułu i gniazda osobno. Gdy ten sam moduł działa w A2, ale zawodzi w B2 przy tych samych ustawieniach, zmienia się podejrzany tor. Porównaj tę parę obserwacji z przypadkami z warsztatu w lekcji „Pamięć DDR i kanały”.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Jaki wynik obali hipotezę</span> <span class="deep-dive-badge">DIAGNOSTYKA</span></summary>
<div class="deep-dive-content">

Dobra próba rozróżnia przewidywania. Jeśli podejrzewasz uszkodzony slot, dwa znane sprawne moduły powinny zachować się podobnie w tym slocie, a inaczej w sprawnym. Jeśli wynik zależy od jednego modułu w każdym slocie, dane lepiej pasują do uszkodzenia modułu. Wynik zależny od pary może wskazywać ustawienia kontrolera albo konfigurację kanałów.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Przed testem zapisz dwa możliwe wyniki i decyzję dla każdego. Przywróć działanie i zweryfikuj je próbą końcową.

