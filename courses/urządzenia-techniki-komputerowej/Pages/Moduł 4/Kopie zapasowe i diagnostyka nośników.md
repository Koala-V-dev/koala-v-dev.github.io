# Kopie zapasowe i diagnostyka nośników

Dysk zgłasza błędy odczytu. Program oferuje benchmark i naprawę systemu plików. Jaki jest koszt błędnej decyzji, jeśli na dysku jest jedyny egzemplarz pracy?

## 🛟 Odzysk przed pomiarem

S.M.A.R.T. i logi zdrowia NVMe dostarczają informacji o stanie nośnika, zależnie od urządzenia. Odczyt błędów, ostrzeżeń lub temperatury zestaw z objawem i wcześniejszym stanem. Zielony status sam w sobie nie gwarantuje poprawnego działania.

Gdy pojawiają się błędy i dane są ważne, ogranicz zapis. Zweryfikuj kopie i wybierz bezpieczne odzyskanie. Jeśli dysk przestaje odpowiadać albo wydaje niepokojące dźwięki, wstrzymaj kolejne próby i rozważ profesjonalny odzysk. Przy sprawnym nośniku test logiczny systemu plików i test wydajności rozwiązują różne problemy.

Kopia jest użyteczna, gdy da się ją odtworzyć. Przygotuj osobną kopię pliku na drugim nośniku. Odtwórz do nowego katalogu, otwórz plik i porównaj zawartość. Kopie w kilku lokalizacjach zmniejszają ryzyko jednej wspólnej awarii.

W warsztacie RAID odbudowa przywracała nadmiarowość dla **obecnego stanu macierzy**. Jeżeli skasujesz folder i macierz prawidłowo zapisze tę zmianę, odbudowa odtworzy stan po skasowaniu. Żeby odzyskać folder, potrzebujesz wersji zapisanej przed operacją. W karcie serwisowej odnotuj godzinę usunięcia, godzinę dostępnej kopii i miejsce, w którym sprawdzisz odtworzone dane.

## 🧪 Odtwórz wersję projektu sprzed błędnej zmiany

Pracuj na własnych plikach ćwiczeniowych. Przygotuj na komputerze folder **Projekt** z plikiem tekstowym **stan.txt** i zdjęciem. Drugi nośnik, na przykład pendrive, będzie przechowywał kopie. Na nim utwórz katalog **Kopia**.

1. W pliku tekstowym wpisz „Wersja pierwsza”. Skopiuj cały **Projekt** na pendrive do **Kopia\01**. Zapisz godzinę ukończenia kopii.
2. Zmień treść na „Wersja druga” i wykonaj osobną kopię do **Kopia\02**. Zapisz jej godzinę. Bezpiecznie wysuń pendrive.
3. Wprowadź celowy błąd w pliku tekstowym i przenieś folder **Projekt** do folderu **Po-incydencie**. Zanotuj godzinę incydentu. W tej próbie odzyskiwanie zaczynasz od razu.
4. Podłącz pendrive. Wybierz ostatnią kopię sprzed błędnej zmiany i odtwórz z niej cały **Projekt** do osobnego folderu **Odtworzone**. Otwórz oba pliki. Potwierdź, że tekst zawiera oczekiwaną wersję, zdjęcie się otwiera, a folder po incydencie nadal jest dostępny do porównania. Zanotuj godzinę zakończenia kontroli.

Czas od ukończenia wybranej kopii do incydentu opisuje, jak daleko cofasz stan projektu. Czas od rozpoczęcia odzyskiwania do sprawdzenia plików mówi, ile trwało przywrócenie w tej próbie. Jeśli pracownia wymaga utraty najwyżej 90 minut pracy (**RPO**) i wznowienia pracy w 30 minut (**RTO**), porównaj oba wyniki osobno z ich limitami.

W tej próbie każda kopia jest pełna. Przy kopiach przyrostowych narzędzie może potrzebować pełnej kopii i kolejnych przyrostów aż do wybranego punktu. Wybierz punkt odzyskiwania sprzed incydentu, bo późniejszy przyrost może już obejmować błędną zmianę lub usunięcie. [Odtwarzanie kopii przyrostowych w dokumentacji IBM](https://www.ibm.com/docs/en/psfa/7.1.0?topic=command-incremental-restoration).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Integralność i trwałość operacji</span> <span class="deep-dive-badge">SYSTEMY PLIKÓW</span></summary>
<div class="deep-dive-content">

Funkcja skrótu mapuje zawartość na stałej długości wynik. Porównanie SHA-256 kopii z zapisanym wynikiem źródła pozwala wykryć przypadkową zmianę z bardzo wysoką skutecznością. Wynik zależy od treści, więc skrót identycznego pliku w dwóch katalogach jest taki sam. Dla aplikacji przyjęcie zapisu przez system może oznaczać przyjęcie do bufora. Trwałość po utracie zasilania wymaga udokumentowanej synchronizacji właściwej dla platformy i całego toru zapisu.

W PowerShellu porównaj zawartość kopii i odtworzonego pliku. Podstaw literę pendrive'a i ścieżki do pliku tekstowego z ćwiczenia. `-LiteralPath` oznacza dokładną ścieżkę. Nawiasy wybierają z wyniku polecenia sam skrót `Hash`.

```powershell
$skrotKopii = (Get-FileHash -LiteralPath 'E:\Kopia\02\Projekt\stan.txt' -Algorithm SHA256).Hash
$skrotOdtworzonego = (Get-FileHash -LiteralPath '.\Odtworzone\Projekt\stan.txt' -Algorithm SHA256).Hash
$skrotKopii -eq $skrotOdtworzonego
```

Wynik `True` potwierdza zgodność z wybraną kopią. Czas lub opis kopii odpowiada na inne pytanie: czy wybrano właściwą wersję. [Dokumentacja polecenia Get-FileHash](https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/get-filehash).

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Chroń jedyny egzemplarz danych przed naprawą lub pomiarem. Potwierdź kopię próbą odtworzenia.

