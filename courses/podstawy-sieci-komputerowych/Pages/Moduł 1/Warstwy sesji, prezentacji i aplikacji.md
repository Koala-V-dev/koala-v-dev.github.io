# Warstwy sesji, prezentacji i aplikacji

Połączenie TCP działa. Serwer odebrał wszystkie bajty, lecz operacja nadal kończy się błędem. Naprawianie kabla albo tablicy routingu niczego już nie rozdzieli.

W tej lekcji wykorzystasz górne warstwy modelu OSI jako trzy pytania diagnostyczne. Sprawdzisz, czy strony rozumieją zapis danych, czy zachowały potrzebny stan rozmowy i czy żądanie ma poprawne znaczenie dla usługi.

## 🧠 Najpierw znajdź pierwszą granicę błędu

Serwer zapisuje trzy niezależne zdarzenia:

```text
A. odebrano komplet bajtów, nie można zdekodować tekstu jako UTF-8
B. tekst i JSON są poprawne, identyfikator sesji wygasł
C. tekst, JSON i sesja są poprawne, operacja "zamknij_okno" nie istnieje
```

Dla każdego zdarzenia zapisz pierwsze pytanie, na które odpowiedź brzmi „nie”:

1. Czy bajty mają uzgodnioną reprezentację?
2. Czy wymiana ma wymagany stan i ciągłość?
3. Czy usługa rozumie znaczenie polecenia?

Nie przypisuj jeszcze numerów warstw. Najpierw rozdziel dowody. Zdarzenie C nie staje się problemem kodowania tylko dlatego, że polecenie jest tekstem.

## 🧱 Trzy warstwy są trzema zakresami pytań

Model OSI opisuje funkcje komunikacji. Nie wymaga, aby każdy program miał osobny moduł dla każdej warstwy.

**Warstwa sesji** dotyczy organizacji dialogu. Obejmuje między innymi ustanowienie kontekstu wymiany, kontrolę dialogu oraz punkty synchronizacji potrzebne do wznowienia pracy.

**Warstwa prezentacji** dotyczy składni i reprezentacji informacji. Odpowiada na pytanie, jak przesyłane bajty zamienić na dane rozumiane po obu stronach. W praktyce mogą to być kodowanie znaków, serializacja, kompresja albo transformacja kryptograficzna.

**Warstwa aplikacji** dotyczy operacji oferowanych przez usługę i znaczenia wiadomości. Określa między innymi, jakie polecenia istnieją, jakich pól wymagają oraz jaki wynik oznacza sukces albo odmowę.

W stosie internetowym te funkcje często znajdują się w jednej bibliotece lub protokole aplikacyjnym. HTTP opisuje znaczenie żądań i odpowiedzi. JSON może opisywać składnię treści. Aplikacja może utrzymywać stan użytkownika za pomocą tokenu. TLS chroni dane między punktami końcowymi. Żaden z tych przykładów nie tworzy prostego mapowania jeden protokół do jednej warstwy OSI.

## 🔍 Dowody tworzą łańcuch

Analizuj komunikację w stałej kolejności:

```text
transport dostarczył bajty
        ↓
ochrona kanału zaakceptowała i odsłoniła dane
        ↓
reprezentacja daje się zdekodować i sparsować
        ↓
kontekst rozmowy jest ważny
        ↓
reguła aplikacji przyjmuje operację
```

Każdy krok opiera się na poprzednim. Poprawny JSON potwierdza składnię dokumentu. Nie potwierdza, że sesja użytkownika nadal jest ważna ani że aplikacja obsługuje wskazaną operację.

Sukces TCP potwierdza uporządkowane dostarczenie strumienia do punktu komunikacji. Nie dowodzi, że odbiorca potrafi zinterpretować bajty.

Dzięki tej kolejności znajdujesz pierwszą niepotwierdzoną granicę i wybierasz następny test. Numer „winnej warstwy” nie zastępuje dowodu.

## 🧾 Reprezentacja zmienia bajty w strukturę

Tekst JSON przesyłany między systemami używa UTF-8. Odbiorca wykonuje co najmniej dwa różne sprawdzenia:

```text
bajty -> znaki UTF-8 -> tokeny i struktura JSON
```

Te dane nie tworzą poprawnego JSON:

```text
{ "temperatura": 21, }
```

Końcowy przecinek narusza gramatykę JSON. Parser nie dochodzi jeszcze do pytania, czy pole `temperatura` jest dozwolone.

Inny dokument może być składniowo poprawny:

```json
{ "temperatura": "bardzo" }
```

Parser zbuduje obiekt i wartość tekstową. Aplikacja może go później odrzucić, jeśli wymaga liczby. To nie jest już błąd gramatyki JSON. Jest to naruszenie reguły danych ustalonej przez konkretną usługę.

## 🔗 Stan rozmowy łączy oddzielne wymiany

HTTP definiuje żądania, których znaczenie można rozumieć osobno. Aplikacje często dodają jednak własny stan: logowanie, koszyk, identyfikator zadania albo punkt wznowienia transferu.

Rozważ dwa poprawne składniowo żądania:

```text
1. rozpocznij import, sesja S7
2. zatwierdź import, sesja S7
```

Drugie żądanie ma sens tylko wtedy, gdy serwer nadal zna stan `S7` i wie, który import ma zatwierdzić. Jeśli kontekst wygasł, ponowne wysłanie tych samych bajtów nie naprawi problemu. Klient musi odtworzyć wymagany stan albo rozpocząć operację zgodnie z regułami usługi.

Nie utożsamiaj sesji aplikacyjnej z połączeniem TCP. Kilka żądań jednej sesji może korzystać z różnych połączeń, a jedno połączenie może przenosić wiele niezależnych żądań.

## ⚙️ Reguła aplikacji nadaje danym znaczenie

Po poprawnym zdekodowaniu i odtworzeniu kontekstu usługa interpretuje polecenie. To tutaj rozstrzyga, czy operacja istnieje, użytkownik ma uprawnienie i wartość mieści się w dozwolonym zakresie.

Przykład:

```json
{ "operacja": "ustaw_temperature", "wartosc": 900 }
```

Dokument może być poprawnym UTF-8 i JSON. Sesja może być aktywna. Sterownik nadal powinien odrzucić wartość spoza bezpiecznego zakresu.

Odpowiedź aplikacji jest dowodem. Kod HTTP `400` może wskazywać, że serwer uważa żądanie za błędne, a `401` oznacza brak ważnych danych uwierzytelniających dla zasobu. Sam kod nie zastępuje jednak opisu błędu i dokumentacji konkretnego API.

## 🛠️ Punkt kontrolny: pierwszy niepotwierdzony krok

<data-gate>
  <data-quiz>
    <question>Serwer potwierdził odbiór pełnego żądania. TLS zakończył się poprawnie, treść została zdekodowana jako UTF-8, parser JSON zbudował obiekt, a identyfikator sesji jest aktywny. Usługa zwraca błąd `nieznana operacja: archiwizuj`. Gdzie znajduje się pierwszy niepotwierdzony krok?</question>
    <options>
      <option>W routingu, ponieważ pakiet trafił do niewłaściwej sieci.</option>
      <option>W reprezentacji, ponieważ każda nieznana wartość oznacza błędny JSON.</option>
      <option>W stanie sesji, ponieważ aktywna sesja zawsze musi zostać utworzona ponownie.</option>
      <option correct>W regule aplikacji, ponieważ składnia i stan zostały potwierdzone, ale usługa nie definiuje takiej operacji.</option>
    </options>
    <div data-hint="error">Nie cofaj diagnozy przed ostatni potwierdzony dowód. Transport, ochrona kanału, reprezentacja i stan sesji przeszły swoje sprawdzenia.</div>
    <div data-hint="success">Pierwszy brak potwierdzenia dotyczy znaczenia polecenia w konkretnej usłudze. Następny test powinien sprawdzić listę obsługiwanych operacji lub kontrakt API.</div>
  </data-quiz>
</data-gate>

## 🧪 Rozdziel cztery odrzucenia

System przyjmuje żądania ustawienia temperatury. Kontrakt wymaga UTF-8, poprawnego JSON, aktywnej sesji oraz liczby od 5 do 35 w polu `wartosc`.

Przeanalizuj cztery raporty:

```text
A. TCP dostarczył dane, dekoder UTF-8 zgłosił niedozwoloną sekwencję bajtów
B. UTF-8 działa, parser otrzymał: { "wartosc": 22, }
C. JSON to { "wartosc": 22 }, ale identyfikator sesji wygasł
D. JSON to { "wartosc": 80 }, sesja jest aktywna
```

Dla każdego raportu zapisz:

1. ostatni potwierdzony krok;
2. pierwszy krok zakończony błędem;
3. jeden test lub zapis, który potwierdzi diagnozę;
4. działanie naprawcze, które nie cofa się do już potwierdzonej warstwy.

Kryteria ukończenia:

- odróżniasz dekodowanie UTF-8 od parsowania JSON;
- poprawny JSON nie wystarcza do uznania wartości `80` za dozwoloną;
- wygasła sesja nie jest awarią TCP;
- proponowany test dotyczy pierwszej niepotwierdzonej granicy;
- nie oceniasz odpowiedzi na podstawie nazw numerów warstw, lecz na podstawie dowodów.

Zmień przypadek B na poprawny JSON bez pola `wartosc`: `{ "tryb": "eco" }`. Ustal, dlaczego błąd przesuwa się z reprezentacji do reguły aplikacyjnej.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W raporcie A ostatnim potwierdzonym krokiem jest dostarczenie bajtów przez TCP. Pierwszy błąd występuje przy dekodowaniu reprezentacji. Log dekodera z pozycją niedozwolonej sekwencji potwierdzi diagnozę. Nadawca powinien wysłać dane w uzgodnionym UTF-8.

W raporcie B dekodowanie UTF-8 działa, ale końcowy przecinek łamie gramatykę JSON. Test parserem zgodnym z RFC 8259 odtworzy błąd. Trzeba poprawić serializację dokumentu, nie sesję ani routing.

W raporcie C reprezentacja jest poprawna. Pierwszy błąd dotyczy stanu rozmowy. Rejestr sesji powinien pokazać czas wygaśnięcia identyfikatora. Klient musi uzyskać ważny kontekst zgodnie z protokołem usługi.

W raporcie D reprezentacja i sesja są poprawne. Wartość `80` narusza regułę aplikacji. Test walidatora kontraktu powinien zwrócić dozwolony zakres od 5 do 35. Zmiana kodowania nie wpłynie na wynik.

Po zmianie raportu B dokument jest poprawnym JSON. Parser zbuduje obiekt, lecz usługa nie znajdzie wymaganego pola `wartosc`. Pierwszy błąd wystąpi więc podczas sprawdzania kontraktu aplikacji, a nie podczas odczytu reprezentacji.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Warstwy od 5 do 7 wyznaczają zakresy pytań.** Nie muszą istnieć jako trzy osobne moduły programu.
- **Reprezentacja odpowiada za odczyt danych.** Poprawne UTF-8 i poprawna składnia JSON są dwoma różnymi dowodami.
- **Stan rozmowy łączy wymiany.** Jego wygaśnięcie nie oznacza awarii połączenia TCP.
- **Aplikacja nadaje operacji znaczenie.** Poprawny dokument może naruszać kontrakt albo regułę usługi.
- **Diagnozę zaczynasz po ostatnim sukcesie.** Następny test dotyczy pierwszej niepotwierdzonej granicy.
