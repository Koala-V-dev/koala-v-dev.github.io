# Inżynierskie potoki i filtry

Jedną z najpiękniejszych koncepcji systemów Unix/Linux jest filozofia tworzenia małych, wyspecjalizowanych programów, które można łączyć ze sobą jak klocki. Narzędziem służącym do tego połączenia jest operator potoku `|` (pipe).

---

## 🔗 Operator potoku (|)

Potok przekierowuje standardowe wyjście (stdout) pierwszego programu bezpośrednio na standardowe wejście (stdin) drugiego programu. Dzięki temu dane płyną przez łańcuch poleceń bez konieczności zapisywania plików pośrednich na dysku.

Przykład: `ls -la /etc | grep "conf"` (pobierz listę plików w `/etc` i przefiltruj ją, zostawiając tylko wiersze zawierające frazę "conf").

---

## 🛠️ Inżynierskie narzędzia filtracji tekstu

Oto zestaw narzędzi, z których każdy administrator korzysta na co dzień do analizowania logów w czasie rzeczywistym:

### 1. grep
Służy do wyszukiwania wzorców (w tym wyrażeń regularnych) w tekście.
* *Przykład:* `grep -i "error" /var/log/syslog` (wyszukaj frazę "error" bez względu na wielkość liter).

### 2. cut
Wycinanie kolumn z tekstu na podstawie zdefiniowanego separatora.
* *Przykład:* `cut -d: -f1,7 /etc/passwd` (wybierz pierwszą i siódmą kolumnę z pliku passwd, używając `:` jako separatora).

### 3. sed (Stream Editor)
Edytor strumieniowy do szybkiej zamiany tekstu.
* *Przykład:* `sed 's/false/true/g' plik.txt` (zamień wszystkie wystąpienia słowa "false" na "true").

### 4. awk
Potężny język programowania do zaawansowanego przetwarzania tekstu i generowania raportów.
* *Przykład:* `awk '{print $1, $9}' /var/log/nginx/access.log` (wypisz pierwszy i dziewiąty parametr z logów Nginxa, czyli adres IP i kod statusu HTTP).

### 5. xargs
Konwertuje strumień wejściowy na argumenty wywołania innego polecenia.
* *Przykład:* `find . -name "*.log" | xargs rm` (znajdź pliki z rozszerzeniem log i przekaż je jako parametry do polecenia usunięcia `rm`).

---

## 🛠️ Punkt Kontrolny: Filtrowanie potoków
<data-gate>
  <data-quiz>
    <question>
Jakie polecenie pozwoli wyodrębnić wyłącznie unikalne adresy IP (pierwsza kolumna) z pliku logów serwera Nginx /var/log/nginx/access.log?
    </question>
    <options>
      <item correct>awk '{print $1}' /var/log/nginx/access.log | sort | uniq</item>
      <item>cut -d' ' -f2 /var/log/nginx/access.log | grep -i "ip"</item>
      <item>xargs print $1 /var/log/nginx/access.log | uniq -c</item>
    </options>

<div data-hint="error">
  Musisz najpierw pobrać pierwszą kolumnę (za pomocą awk lub cut), posortować ją (aby te same adresy znalazły się obok siebie) i odsiać duplikaty programem `uniq`.
</div>
<div data-hint="success">
  Genialne! Użycie `awk` do wydobycia pierwszej kolumny, posortowanie danych za pomocą `sort` oraz wyeliminowanie powtórzeń przez `uniq` to klasyczny linuksowy potok inżynierski.
</div>
  </data-quiz>
</data-gate>
