# Płyta główna i zgodność podzespołów

Procesor pasuje fizycznie do gniazda, ale komputer może nie wystartować. Przed zakupem ustal, która informacja potwierdzi obsługę tego konkretnego modelu.

## 🧩 Cztery sprawdzenia przed montażem

**Płyta główna** łączy podzespoły i zapewnia im złącza. **Chipset** to zestaw funkcji obsługujących część połączeń i urządzeń. Część linii PCIe i kontroler RAM mogą być bezpośrednio w procesorze. Do każdej planowanej części sprawdź:

1. Format płyty oraz miejsce w obudowie, w tym długość karty graficznej i wysokość chłodzenia.
2. Gniazdo CPU, listę obsługiwanych modeli i minimalną wersję firmware dla rewizji płyty.
3. Typ RAM, obsadę slotów oraz ograniczenia pojemności i szybkości.
4. Złącza dysków i kart. Instrukcja wyjaśnia, czy obsadzenie jednego slotu wyłącza inne złącze.

Przykład z instrukcji ASUS TUF Gaming Z490-Plus (Wi-Fi). Gniazdo M.2_1 współdzieli połączenie z SATA6G_2, a port SATA6G_2 zostaje wyłączony, gdy M.2_1 pracuje w trybie SATA. Sam fakt, że moduł ma format M.2, nie wystarcza do przewidzenia skutku. Sprawdź, którego trybu używa moduł i którego portu dotyczy przypis. [Instrukcja płyty ASUS](https://dlcdnets.asus.com/pub/ASUS/mb/LGA1200/TUF_GAMING_Z490-PLUS_%28WI-FI%29/E17047_TUF_GAMING_Z490-PLUS_WI-FI_UM_v3_WEB.pdf).

## 🧰 Zamontuj SSD i zachowaj dostęp do HDD

Na płycie z przykładu HDD zajmuje port **SATA6G_2**. Masz dołożyć moduł **M.2 SATA 2280**. Znajdź oba gniazda M.2 na rysunku płyty w instrukcji. Sprawdź przypisy do tabeli **Storage** i zaplanuj montaż tak, żeby HDD nadal działał. **2280** oznacza 22 mm szerokości i 80 mm długości. Tak samo oznaczony moduł PCIe ma te same wymiary, ale korzysta z innego interfejsu. [Instrukcja ASUS TUF Gaming Z490-Plus (Wi-Fi), tabela Storage i rysunek płyty](https://dlcdnets.asus.com/pub/ASUS/mb/LGA1200/TUF_GAMING_Z490-PLUS_%28WI-FI%29/E17047_TUF_GAMING_Z490-PLUS_WI-FI_UM_v3_WEB.pdf).

| Wybrane gniazdo | Co stanie się z dotychczasowymi portami SATA |
| --- | --- |
| **M.2_1** | Moduł SATA wyłączy **SATA6G_2**. Przewód HDD trzeba przełożyć do wolnego portu, którego instrukcja nie wyłącza. |
| **M.2_2** | Obsada gniazda wyłączy **SATA6G_5** i **SATA6G_6**. HDD w **SATA6G_2** może zostać, ale trzeba sprawdzić, czy dyski zajmują porty 5 i 6. |

### 🧪 Uruchom płytę z trzema nośnikami

Na płycie **Archiwum** jest w SATA6G_2, a **Kopia** w SATA6G_5. Dodaj SSD M.2 SATA i zachowaj dostęp do obu HDD. Wybierz gniazdo, osadź w nim moduł, a w razie potrzeby przełóż wtyk przewodu danych HDD. Zasilanie obu HDD jest już podłączone. Uruchom komputer i sprawdź listę urządzeń w UEFI.

Elementy możesz przeciągać lub wybierać przyciskiem i wskazywać złącze. Jeśli któregoś dysku brakuje, wyłącz komputer, wróć do połączeń i ponów próbę.

<data-gate>
  <data-disk-installation></data-disk-installation>
</data-gate>

### 🔧 Wykonaj montaż na stanowisku

Użyj dysku testowego i instrukcji **swojej** płyty. Przed zmianą zapisz z UEFI modele wykrytych dysków. Wyłącz komputer i odłącz zasilanie. Prześledź przewód danych HDD aż do płyty i odczytaj oznaczenie portu przy złączu. Porównaj je z rysunkiem w instrukcji. Na tej podstawie wybierz gniazdo M.2 i zdecyduj, czy trzeba przełożyć przewód.

Ustaw punkt mocowania na długość modułu zgodnie z instrukcją. Wsuń moduł w gniazdo zgodnie z położeniem wycięcia, opuść go na mocowanie i zabezpiecz. Po uruchomieniu wejdź do UEFI i porównaj modele wykrytych dysków ze spisem sprzed montażu. Sprawdź, czy do listy doszedł SSD i czy nadal jest na niej HDD.

Jeśli SSD się pojawił, a HDD zniknął, odłącz zasilanie i jeszcze raz sprawdź oznaczenie portu oraz przypis o współdzieleniu. Jeżeli oba dyski są widoczne, ale komputer nie startuje z poprzedniego systemu, sprawdź wpis rozruchowy w lekcji o UEFI. Widoczność dysku i wybór systemu weryfikujesz na osobnych ekranach.

## 🔧 Gdy potrzebna jest aktualizacja firmware

Nowy CPU jest na liście od wersji firmware 1.30, a płyta ma 1.10. Producent opisuje aktualizację wymagającą działającego, obsługiwanego CPU. Dobierz bezpieczną kolejność prac.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Przy działającym starym procesorze potwierdź rewizję płyty i zastosuj instrukcję aktualizacji producenta. Po aktualizacji sprawdź wersję, dopiero potem zamień CPU. Jeśli brak działającego procesora, wybierz egzemplarz z odpowiednią wersją albo skorzystaj z usługi aktualizacji.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Linie PCIe i wspólne połączenie</span> <span class="deep-dive-badge">ARCHITEKTURA PCIe</span></summary>
<div class="deep-dive-content">

W modelu z dwoma urządzeniami za tym samym łączem 4 GB/s każde może osobno żądać 3 GB/s. Przy jednoczesnych transferach w tym samym kierunku łączny ruch przez wspólne łącze nie przekroczy 4 GB/s, nawet jeśli oba lokalne sloty dają więcej. Sprawdź diagram blokowy płyty i zaznacz wspólny odcinek drogi.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Zgodność potwierdzaj dla modelu, rewizji, konfiguracji slotów i wersji firmware.

