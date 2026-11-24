# Pamięć DDR i kanały

Dwa moduły po 8 GiB mogą dać identyczną pojemność przy różnej przepustowości. Zanim przełożysz moduły, wskaż informację, której szukasz w instrukcji.

## 🧮 Pojemność i przepustowość

Moduł DIMM jest płytką z układami pamięci. Generacje DDR różnią się elektrycznie i mechanicznie. DDR4 i DDR5 wymagają zgodnych slotów oraz kontrolera pamięci. **Kanał** jest drogą wymiany danych z pamięcią. Jeśli obsadzisz dwa kanały zgodnie z instrukcją, kontroler może wykorzystywać je równolegle.

![Dwa moduły DIMM ze złotymi stykami. W rzędzie styków każdego modułu widać przerwę, która pasuje do występu w gnieździe.](/public/courses/urządzenia-techniki-komputerowej/Images/dimm-wyciecie-ddr2.jpg)

*Zdjęcie pokazuje starsze moduły DDR2. W DDR4 obowiązuje ta sama zasada dopasowania wycięcia do występu, ale położenie wycięcia jest inne. Fot. SaltyCruton. [Oryginał i licencja CC0 1.0](https://commons.wikimedia.org/wiki/File:DDR2_DIMM_Memory.jpg).*

W przykładowej płycie instrukcja zaleca A2 i B2 dla dwóch modułów. A1 i A2 należą do tego samego kanału. Zmiana z A1/A2 na A2/B2 zachowuje pojemność, ale może zwiększyć przepustowość. Nazwy i zalecenia sprawdź dla własnej płyty.

**MT/s** oznacza miliony transferów na sekundę. SPD przechowuje dane o module. Profil XMP albo EXPO może włączyć parametry wyższe niż domyślne. Przy błędach pamięci wróć do ustawień domyślnych i porównaj stabilność.

## 🧪 Przygotuj 16 GiB w dwóch kanałach

Stanowisko ma płytę DDR4 i trzy moduły po 8 GiB. Dobierz dwa pasujące moduły i obsadź gniazda zalecane dla tej płyty. Porównaj wycięcie na stykach modułu z występem w gnieździe. Otwórz zatrzask przed wsunięciem. W symulatorze możesz przeciągnąć moduł albo wybrać go i wskazać gniazdo.

Uruchom komputer. UEFI pokaże wykrytą pojemność i liczbę aktywnych kanałów. Jeśli widzisz 16 GiB w jednym kanale, porównaj oznaczenia obsadzonych gniazd. Przed zmianą wyłącz komputer.

<data-gate>
  <data-dimm-bench></data-dimm-bench>
</data-gate>

## 🧰 Zamontuj parę modułów i sprawdź obsadę

Na płycie z czterema gniazdami masz zamontować dwa zgodne moduły. Zanim otworzysz obudowę, ustal dokładny model płyty i znajdź w jej instrukcji rysunek obsady **dwóch DIMM-ów**. Na **ASUS TUF Gaming Z490-Plus (Wi-Fi)** producent wskazuje **DIMM_A2 i DIMM_B2**. Dla jednego modułu wskazuje **DIMM_A2**. Odczytaj oznaczenia nadrukowane przy gniazdach. Kolor plastiku zależy od konstrukcji. [Instrukcja ASUS, strona 1-5](https://dlcdnets.asus.com/pub/ASUS/mb/LGA1200/TUF_GAMING_Z490-PLUS_%28WI-FI%29/E17047_TUF_GAMING_Z490-PLUS_WI-FI_UM_v3_WEB.pdf).

1. Wyłącz komputer i odłącz przewód zasilający. Otwórz zatrzaski wskazanych gniazd. Trzymaj moduł za krawędzie i dopasuj wycięcie w listwie styków do występu w gnieździe.
2. Wsuń moduł pionowo, równomiernie naciskając oba końce. Sprawdź, czy siedzi równo i czy ruchome zatrzaski się domknęły. W razie oporu sprawdź kierunek i typ modułu przed ponowną próbą.
3. Podłącz zasilanie i wejdź do UEFI. Porównaj wykrytą pojemność oraz obsadzone sloty z planem. Jeśli firmware pokazuje tylko sumę, skontroluj położenie modułów na płycie po odłączeniu zasilania. [Montaż DIMM i kontrola w UEFI według ASUS](https://www.asus.com/ph/support/faq/1047257/).

| Zapis z odbioru stanowiska | Twój odczyt |
| --- | --- |
| Model płyty i strona instrukcji | |
| Gniazda zalecane i rzeczywiście obsadzone | |
| Pojemność obu modułów z etykiet | |
| Łączna pojemność wykryta przez UEFI | |

Jeśli na etykietach jest po 8 GiB, a UEFI wykrywa 8 GiB łącznie, zatrzymaj odbiór. Odłącz zasilanie i sprawdź osadzenie obu modułów. Jeżeli objaw zostaje, przetestuj oba moduły **kolejno w tym samym gnieździe zalecanym dla pojedynczej kości**. Zapisz, czy brak wykrycia zmienia się razem z modułem. Jeśli oba osobno działają, wróć do zalecanej obsady pary i sprawdź drugi tor. Wykrycie obu modułów potwierdza montaż. Stabilność przy ustawionej szybkości potwierdzasz osobnym testem pamięci. [Procedura izolowania błędów MemTest86](https://www.memtest86.com/troubleshooting.htm).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Od transferu do bajtów</span> <span class="deep-dive-badge">ARCHITEKTURA PAMIĘCI</span></summary>
<div class="deep-dive-content">

Dla modelowego kanału o łącznej szerokości danych 64 bity jeden transfer niesie 8 B. Przy 3200 MT/s daje to 25,6 GB/s teoretycznie, a dwa takie kanały dają 51,2 GB/s. Opóźnienia poleceń, odświeżanie i wzorzec dostępu zmniejszają osiągany wynik.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Sprawdź typ modułów, obsadę kanałów i stabilność pod obciążeniem. Po każdej zmianie porównaj wynik.

