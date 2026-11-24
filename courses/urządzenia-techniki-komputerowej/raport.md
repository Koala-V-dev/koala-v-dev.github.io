# Karta kursu i przegląd przed pilotażem

**Stan po uwagach do pierwszej wersji:** otwarcie ma trzy nowe lekcje napisane od podstaw. Kolejność prowadzi od obwodu i poziomów logicznych przez kondensator i czas zmiany napięcia do tranzystora MOSFET, bramki CMOS i układu scalonego. Usunięto poprzednie ćwiczenia ze skanerem z otwarcia. Dalsze moduły pozostają materiałem do przebudowy.

## Cel i dowód wykonania

Po Binarnych Fundamentach IT uczeń przenosi znajomość jednostek, HEX, ASCII, XOR i modulo na dobór urządzeń, pamięci i diagnozę. W finale oddaje pięć wierszy karty serwisowej. Każdy zawiera decyzję, parametr i sposób potwierdzenia wyniku. Minimalny wynik samokontroli wynosi 12 z 15 punktów przy zachowaniu jedynej kopii danych.

Druga część finału sprawdza prowadzenie sprawy serwisowej. Uczeń prowadzi dziennik odczytów i zmian, a następnie wskazuje po jednym dowodzie dla wykrycia HDD, rozruchu domyślnego, odtworzenia próbki oraz różnicy między skanem z szyby a skanem z podajnika. Model umożliwia różne kolejności niezależnych prób. Wpis w karcie oddziela potwierdzoną obserwację od dalszej diagnostyki.

Dla INF.02 zakres bezpośredni obejmuje konfigurację i eksploatację sprzętu i peryferiów. Dla INF.03 przewidziano transfer jednostek, obrazów i plików. Dla INF.04 transfer dotyczy buforów, reprezentacji i testowania. Zaawansowane przykłady mają objaśnienia przy pierwszym użyciu.

## Kolejność dalszej przebudowy

1. Po obwodach i CMOS przejść od bramek do przechowywania stanu, zegara, rejestru i wykonania rozkazu. Później porównać DRAM, SRAM i flash na poziomie komórki i skutków dla systemu.
2. Prześledzić zasilanie, rozruch oraz topologię połączeń płyty. Omówić pomiar sygnału, zgodność poziomów, łącza i komunikację kontrolera z procesorem w tej kolejności.
3. Rozwinąć urządzenia według wielkości, którą mierzą lub wytwarzają. Obraz i dźwięk, wejście użytkownika, pamięci masowe, druk i skan wymagają zdjęć urządzeń, schematów mechanizmu i wyjaśnienia przepływu danych.
4. Zastosować poznane mechanizmy do diagnostyki zasilania, startu, pamięci, przechowywania i urządzeń zewnętrznych. Powiązać odczyty z Windows z warstwą, którą faktycznie mierzą.

Nowe lekcje i dalsza przebudowa korzystają z dokumentacji technicznej oraz źródeł pierwotnych.

## Rejestr źródeł

Źródła sprawdzono 7 listopada 2026 r. Liczby w ćwiczeniach opisują modele dydaktyczne. Przy doborze komponentów i materiałów obowiązuje dokumentacja konkretnego egzemplarza.

| Temat | Źródło pierwotne i zakres |
| --- | --- |
| Elektronika | [OpenStax, prawo Ohma](https://openstax.org/books/university-physics-volume-2/pages/9-4-ohms-law), [OpenStax, obwody RC](https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits), [MIT, CMOS](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c3/c3s1/). Napięcie, prąd, ładowanie kondensatora i przełączanie inwertera. |
| Zdjęcie urządzenia | [HP OfficeJet Pro 8022e, AntipathyWorld, CC0 1.0](https://commons.wikimedia.org/wiki/File:HP_OfficeJet_Pro_8022e.jpg). |
| Kwalifikacje | [CKE, technik informatyk](https://bip.cke.gov.pl/attachments/download/8553) i [technik programista](https://bip.cke.gov.pl/attachments/download/8580), formuła 2019. Rozdzielenie zakresu sprzętowego od tworzenia aplikacji. |
| Rozruch i dyski | [UEFI 2.10, menedżer rozruchu](https://uefi.org/specs/UEFI/2.10/03_Boot_Manager.html) oraz [struktury GPT](https://uefi.org/specs/UEFI/2.10/05_GUID_Partition_Table_Format.html). Lista startowa, położenie nagłówka, adresowanie i kontrola CRC. |
| DMA, SSD, RAID | [Linux DMA API](https://docs.kernel.org/core-api/dma-api-howto.html), [NVM Express Base Specification](https://nvmexpress.org/specification/nvm-express-base-specification/), [Linux MD RAID 4/5/6](https://docs.kernel.org/driver-api/md/raid5-cache.html). Mapowanie DMA, kolejki i spójność zapisu parzystości. |
| Systemy plików | [Microsoft Win32, porównanie funkcji](https://learn.microsoft.com/en-us/windows/win32/fileio/filesystem-functionality-comparison), [specyfikacja exFAT](https://learn.microsoft.com/en-us/windows/win32/fileio/exfat-specification), [Linux ext4](https://docs.kernel.org/admin-guide/ext4.html). Limity plików, uprawnienia i tryby dziennika. |
| Druk i skan | [HP LaserJet 1022, instrukcja serwisowa](https://h10032.www1.hp.com/ctg/Manual/c00631427.pdf), [Zebra, tryby termiczne](https://support.zebra.com/article/000016650), [Epson DS-320, dokumentacja CIS i duplex](https://files.support.epson.com/docid/cpd5/cpd52026/source/scanners/source/specifications/references/ds320/spex_general_scanner_ds320.html). Przebieg obrazowania i przykłady konstrukcji, bez uogólniania parametrów modelu. |
| Druk atramentowy i igłowy | [Epson, opis głowic piezo i termicznych](https://files.support.epson.com/pdf/600q__/600q__ti.pdf), [Epson FX-890, formularze wielowarstwowe](https://epson.com/For-Work/Printers/Impact-Dot-Matrix/FX-890-Impact-Printer/p/C11C524001). Mechanizm wyrzutu kropli i przykład drukarki udarowej. |
| Złącza i identyfikacja | [USB-IF, możliwości kabli USB-C](https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf), [Microsoft, identyfikatory sprzętu](https://learn.microsoft.com/en-us/windows-hardware/drivers/install/hardware-ids). Rozdzielenie kształtu złącza od protokołu i dopasowanie sterownika. |
| Laboratorium | [Microsoft, Zarządzanie dyskami i VHD](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/manage-virtual-hard-disks). Ćwiczenie UTK używa odczytu, a procedura tworzenia pustego VHD należy do Windows 11. |

## Połączenie z Windows 11

| Przepisz do UTK jako model sprzętowy | Zachowaj w Windows 11 jako laboratorium |
| --- | --- |
| Z „Zarządzania dyskami i partycjami” wydziel HDD, SSD, M.2, LBA, MBR/GPT, systemy plików i obliczanie RAID. Te zagadnienia mają już osobne lekcje w UTK. | Inicjalizacja pustego VHD/VHDX, przypisywanie liter, DiskPart, Storage Spaces i sprawdzanie woluminu. Uczeń ma najpierw nazwać warstwy poznane w UTK, potem odczytać je w systemie. |
| Z „Diagnostyki sprzętowej” wydziel interpretację kanałów, MT/s, temperatury, S.M.A.R.T. i różnicy między IOPS a transferem. | Zachowaj obsługę CPU-Z, GPU-Z i CrystalDiskInfo oraz porównanie pomiarów w stałych warunkach. Benchmark zapisujący dane wykonuj na osobnym nośniku testowym. |
| Z „Zarządzania sprzętem i sterownikami” wydziel model identyfikatora, firmware, sterownika i kontrolera. Z „Przygotowania ISO” wydziel UEFI, kolejność startu, Secure Boot i rolę TPM. | Zachowaj Menedżer urządzeń, przywracanie sterownika i instalację w maszynie wirtualnej. Ochronę kluczy i procedury BitLockera zostaw w „Szyfrowaniu danych”. |
| Ucz w UTK doboru kopii i próby odzysku po awarii. | Zachowaj procedury tworzenia i odtwarzania kopii w „Kopiach zapasowych i ochronie danych”. |

Wspólny przebieg ćwiczenia: rozpoznaj podzespół w UTK → potwierdź konfigurację w Windows 11 → zapisz pomiar lub próbę odzysku w karcie finałowej UTK.

## Weryfikacja techniczna

- Audyt struktury w obu trybach i kompilacja offline przeszły dla 28 lekcji. Wygenerowany spis wskazuje wszystkie lekcje i stronę wprowadzenia.
- Jest zaliczył 865 testów w 99 zestawach po umieszczeniu pamięci podręcznej w katalogu roboczym.
- Chromium załadował wygenerowane strony i lokalne zasoby. Sprawdzono otwieranie odpowiedzi i deep-dive klawiszem Enter oraz szerokość 375 px na lekcjach o RAID, skanerze płaskim i w finale.
- Laboratoria mają dane przykładowe. Ich przebiegu na fizycznych peryferiach i w graficznych narzędziach Windows nie potwierdzono. Polecenia odczytu Storage odrzucono w środowisku testowym z powodu braku dostępu do CIM.

## Próba uczniowska

Co najmniej pięciu uczniów po Binarnych Fundamentach IT rozwiązuje finał i przypadki transferowe bez podpowiedzi. Zapisz punkty, błędy zagrażające danym, miejsca przerwania pracy i obciążenie w skali 1–7. Wymagania projektu to co najmniej 80% uczestników z wynikiem co najmniej 80%, mediana obciążenia do 4 i krytyczny błąd u najwyżej jednej osoby. Próba nie została przeprowadzona.

