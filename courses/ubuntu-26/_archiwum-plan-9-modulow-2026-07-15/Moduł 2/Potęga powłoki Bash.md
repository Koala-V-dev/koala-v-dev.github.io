# Potęga powłoki Bash i strumienie

Konsola systemu Linux to nie tylko miejsce do wpisywania poleceń. To potężne środowisko programistyczne, w którym procesy komunikują się za pomocą ujednoliconych strumieni tekstowych. Zrozumienie sposobu przekierowywania tych strumieni to podstawa automatyzacji zadań.

---

## 🌊 Standardowe strumienie i deskryptory plików

Każdy proces uruchamiany w powłoce Bash otrzymuje automatycznie trzy standardowe strumienie (deskryptory plików):

### 0 — Standardowe Wejście (stdin)
* **Cel:** Źródło danych, z którego proces czyta informacje (domyślnie klawiatura).

### 1 — Standardowe Wyjście (stdout)
* **Cel:** Kanał, na który proces wypisuje swoje normalne komunikaty i wyniki (domyślnie ekran terminala).

### 2 — Standardowe Wyjście Błędów (stderr)
* **Cel:** Osobny kanał dedykowany do raportowania błędów i ostrzeżeń. Oddzielenie go od stdout pozwala na zbieranie poprawnych danych do jednego pliku, a komunikatów o błędach do innego (lub ich ignorowanie).

---

## 🛠️ Operatory przekierowań w praktyce

Możemy dowolnie przekierowywać strumienie do plików przy użyciu operatorów powłoki:

* `>` (Zapisz stdout): Nadpisuje plik poprawnym wynikiem polecenia (np. `ls > lista.txt`).
* `>>` (Dopisz stdout): Dopiguje poprawny wynik na koniec pliku (np. `echo "nowy wpis" >> log.txt`).
* `2>` (Zapisz stderr): Zapisuje błędy do określonego pliku (np. `cat brakujacy_plik 2> bledy.log`).
* `&>` (Zapisz stdout i stderr): Przekierowuje oba strumienie jednocześnie do jednego pliku (np. `ping google.com &> ping.log`).
* `2> /dev/null` (Ignorowanie błędów): `/dev/null` to wirtualny "czarny otwór" Linuksa. Wszystko, co tam wyślemy, zostaje bezpowrotnie usunięte. Przydatne do wyciszania niechcianych błędów w skryptach.

---

## 🛠️ Punkt Kontrolny: Strumienie i przekierowania
<data-gate>
  <data-quiz>
    <question>
Jakie polecenie pozwoli uruchomić program skrypt.sh, zapisując jego poprawne wyniki do pliku wynik.txt, a wszelkie błędy całkowicie ignorując?
    </question>
    <options>
      <item correct>./skrypt.sh > wynik.txt 2> /dev/null</item>
      <item>./skrypt.sh 2> wynik.txt 1> /dev/null</item>
      <item>./skrypt.sh &> wynik.txt</item>
    </options>

<div data-hint="error">
  Poprawne wyniki to stdout (deskryptor 1 lub brak cyfry przy przekierowaniu `>`). Błędy to stderr (deskryptor 2). Ignorowanie polega na wysłaniu strumienia do `/dev/null`.
</div>
<div data-hint="success">
  Znakomicie! Przekierowanie `> wynik.txt` zbiera standardowe wyjście, natomiast `2> /dev/null` wycisza strumień błędów.
</div>
  </data-quiz>
</data-gate>
