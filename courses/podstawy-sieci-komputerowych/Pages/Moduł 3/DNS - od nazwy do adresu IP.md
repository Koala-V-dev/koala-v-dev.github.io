# DNS - od nazwy do adresu IP

Dwa zapytania o tę samą nazwę mogą zakończyć się pustą sekcją odpowiedzi. W jednym przypadku nazwa nie istnieje. W drugim istnieje, ale nie ma danych żądanego typu. Sam napis „brak odpowiedzi” zaciera tę różnicę.

W tej lekcji odczytasz pytanie, status, łańcuch odpowiedzi i dane o pamięci podręcznej. Na tej podstawie wskażesz pierwszą granicę, którą warto sprawdzić dalej.

## 🧠 Najpierw nazwij pytanie

Resolver nie pyta po prostu o `api.example`. Pytanie zawiera trzy elementy:

```
QNAME:  api.example.
QTYPE:  A
QCLASS: IN
```

`QNAME` to nazwa. `QTYPE` określa rodzaj szukanych danych. `A` dotyczy adresu IPv4, a `AAAA` adresu IPv6. `QCLASS` ma tutaj wartość `IN`.

Odpowiedź na pytanie o `A` nie rozstrzyga, czy istnieje rekord `AAAA`. Zawsze przepisz całe pytanie przed interpretacją wyniku.

## 📩 Czytaj status razem z treścią

Porównaj trzy skrócone ślady.

```
A. pytanie: api.example. IN A
   status: NOERROR
   odpowiedź: api.example. 120 IN A 192.0.2.44

B. pytanie: api.example. IN AAAA
   status: NOERROR
   odpowiedź: pusta
   authority: example. 300 IN SOA ...

C. pytanie: brak.example. IN A
   status: NXDOMAIN
   odpowiedź: pusta
   authority: example. 300 IN SOA ...
```

W A rozwiązywanie zakończyło się pozytywną odpowiedzią dla żądanego typu.

W B status `NOERROR` nie zgłasza braku nazwy. Pusta odpowiedź wraz z danymi strefy oznacza tutaj brak danych typu `AAAA` dla tej nazwy. Taki wynik bywa nazywany `NODATA`. Nazwa może nadal mieć rekord `A`.

W C `NXDOMAIN` oznacza, że według autorytatywnej odpowiedzi pytana nazwa nie istnieje w tej przestrzeni nazw. To nie jest skrót od „serwer nie odpowiedział”.

## 🔗 Alias przedłuża rozwiązywanie

Odpowiedź może skierować resolver do kolejnej nazwy:

```
pytanie: api.example. IN A
status: NOERROR

api.example.   180 IN CNAME edge.example.
edge.example.   90 IN A     192.0.2.44
```

`CNAME` mówi, że `api.example` jest aliasem `edge.example`. Resolver kontynuuje rozwiązywanie dla nazwy docelowej. W tym śladzie łańcuch kończy się rekordem `A`, więc wynik jest pozytywny.

W raporcie zachowaj oba kroki. Zapisanie wyłącznie `api.example = 192.0.2.44` ukrywa granicę, na której łańcuch mógłby się później przerwać.

## 🧭 Resolver wykonuje pracę za klienta

Klient zwykle wysyła pytanie do resolvera rekurencyjnego. Resolver może odpowiedzieć z pamięci podręcznej albo szukać danych, przechodząc przez delegacje do serwera autorytatywnego.

```
klient -> resolver rekurencyjny -> delegacje -> serwer autorytatywny
       <- gotowa odpowiedź       <-
```

Ten zapis pokazuje role, nie gwarantuje jednej fizycznej trasy. Dla diagnozy ważne jest, od którego serwera pochodzi obserwowana odpowiedź oraz czy resolver korzystał z pamięci.

`SERVFAIL` oznacza, że resolver nie zdołał ukończyć przetwarzania. Nie dowodzi, że pytana nazwa nie istnieje. Timeout mówi jeszcze mniej: w miejscu obserwacji nie pojawiła się odpowiedź w oczekiwanym czasie.

Po `SERVFAIL` albo timeout sprawdź ten sam zestaw `QNAME`, `QTYPE`, `QCLASS` w innym punkcie. Porównanie lokalnego resolvera z innym resolverem lub odpowiedzią autorytatywną może zawęzić granicę awarii.

## ⏳ TTL opisuje pozostały czas pamięci

Resolver może zachować odpowiedź przez czas wynikający z TTL. Wartość widoczna w odpowiedzi z pamięci zwykle maleje.

```
09:00 resolver zapisuje: api.example. A 192.0.2.44, TTL 300
09:02 administrator zmienia rekord na 192.0.2.55
09:04 ten resolver nadal może zwrócić 192.0.2.44
09:05 stary wpis osiąga granicę swojego czasu przechowywania
```

To nie jest globalne „rozchodzenie się” zmiany jednym zegarem. Różne resolvery mogły zapisać poprzednią odpowiedź w różnym czasie. Dlatego przy rozbieżnych adresach zapisz respondera i pozostały TTL, zamiast ogłaszać ogólny problem z propagacją.

Także odpowiedzi negatywne mogą być przechowywane. Dane `SOA` w odpowiedzi negatywnej pomagają określić czas takiego przechowania. Powtórzenie pytania do tego samego resolvera nie musi więc ponownie dotrzeć do serwera autorytatywnego.

## 🧾 Użyj stałego raportu

Dla każdego śladu wypełnij:

```
pytanie: nazwa, typ, klasa
odpowiadający serwer i status
łańcuch odpowiedzi
dowód pamięci i pozostały TTL
najsilniejszy wniosek
wniosek, którego nie wolno wyciągnąć
następny test zmieniający jeden warunek
```

Nie zaczynaj od czyszczenia pamięci. Najpierw zachowaj dowód: starą wartość, respondera i TTL. Dopiero potem wybierz test, który odróżni pamięć lokalnego resolvera od danych autorytatywnych.

## 🛠️ Punkt kontrolny: przejdź przez alias

<data-gate>
  <data-quiz>
    <question>Zapytanie `api.example. IN A` otrzymało status `NOERROR` oraz odpowiedzi `api.example. 180 IN CNAME edge.example.` i `edge.example. 90 IN A 192.0.2.44`. Który wniosek jest najlepiej uzasadniony?</question>
    <options>
      <option>Nazwa `api.example` nie istnieje, ponieważ nie ma bezpośredniego rekordu `A`.</option>
      <option correct>Rozwiązywanie zakończyło się adresem IPv4 przez alias; w raporcie trzeba zachować oba rekordy i ich TTL.</option>
      <option>Rekord `CNAME` dowodzi, że resolver ominął pamięć podręczną.</option>
      <option>Adres `192.0.2.44` będzie ważny przez 180 sekund.</option>
    </options>
    <div data-hint="error">Prześledź nazwę po rekordzie `CNAME`. Osobne TTL dotyczą osobnych danych i nie ujawniają same w sobie źródła odpowiedzi.</div>
    <div data-hint="success">Łańcuch łączy pytaną nazwę z nazwą docelową i jej adresem. Zachowanie obu kroków pozwala później wskazać miejsce przerwania.</div>
  </data-quiz>
</data-gate>

## 🧪 Zlokalizuj pierwszą niepewną granicę

Przygotuj stały raport dla każdego wyniku:

```
A. pytanie: www.example. IN A
   status: NOERROR
   odpowiedzi:
   www.example. 120 IN CNAME edge.example.
   edge.example. 60 IN A 192.0.2.80

B. pytanie: www.example. IN AAAA
   status: NOERROR
   odpowiedź: pusta
   authority: example. 300 IN SOA ...

C. pytanie: missing.example. IN A
   status: NXDOMAIN
   odpowiedź: pusta
   authority: example. 300 IN SOA ...

D. pytanie: www.example. IN A
   resolver lokalny: timeout
```

Kryteria ukończenia:

- raport zawsze zawiera pełne pytanie;
- `NOERROR` z pustą odpowiedzią dla `AAAA` nie staje się automatycznie `NXDOMAIN`;
- `NXDOMAIN` nie jest opisywany jako timeout;
- alias i nazwa docelowa pozostają osobnymi krokami;
- TTL ogranicza czas przechowania danych, a nie obiecuje chwili globalnej aktualizacji;
- następny test zmienia jeden punkt obserwacji albo jeden typ pytania.

Zmień D: inny resolver zwraca dla tego samego pytania `NOERROR` i adres `192.0.2.80`. Zaktualizuj hipotezę. Zapisz, co już potwierdzono, czego nadal nie wiadomo i jaki test rozdzieli problem lokalnego resolvera od drogi do jego serwerów nadrzędnych.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A odpowiedź jest pozytywna. `www.example` prowadzi przez alias `edge.example` do adresu `192.0.2.80`. TTL aliasu i adresu są osobne. Ślad nie dowodzi, czy dane pochodziły z pamięci, jeśli nie ma dodatkowej informacji o responderze i sposobie uzyskania odpowiedzi.

W B istnieje negatywna odpowiedź dla żądanego typu `AAAA`, ale status nie stwierdza braku nazwy. Najbliższy test to pytanie o `A` tej samej nazwy albo porównanie odpowiedzi autorytatywnej, zależnie od diagnozowanego objawu.

W C autorytatywna odpowiedź `NXDOMAIN` stwierdza brak pytanej nazwy. Dane `SOA` pozwalają resolverowi przechować wynik negatywny. Nie wynika z tego niedostępność całej strefy ani wszystkich nazw pod `example`.

W D timeout potwierdza tylko brak widocznej odpowiedzi od lokalnego resolvera w czasie próby. Trzeba sprawdzić, czy zapytanie dotarło do niego, czy resolver odpowiada na inne nazwy oraz czy potrafi skontaktować się z kolejnym punktem rozwiązywania.

Po zmianie D poprawna odpowiedź z innego resolvera pokazuje, że dla tego pytania istnieje osiągalna droga do danych DNS poza lokalnym punktem. Zwiększa to prawdopodobieństwo problemu lokalnego resolvera, jego pamięci albo jego drogi do serwerów nadrzędnych. Nie rozstrzyga jeszcze której z tych przyczyn. Wyślij identyczne pytanie bezpośrednio do lokalnego resolvera, zachowaj log jego obsługi i porównaj jego zapytanie wychodzące z odpowiedzią od serwera nadrzędnego. Pierwsza granica, na której znika zgodna para pytanie i odpowiedź, staje się miejscem dalszego pomiaru.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **DNS odpowiada na dokładne pytanie.** Nazwa, typ i klasa wyznaczają znaczenie wyniku.
- **Status czytasz z sekcjami odpowiedzi.** `NOERROR` bez danych typu różni się od `NXDOMAIN`.
- **CNAME tworzy kolejny krok.** Zachowaj alias, nazwę docelową i osobne TTL.
- **`SERVFAIL` i timeout nie dowodzą braku nazwy.** Wymagają porównania punktów obserwacji.
- **TTL ogranicza przechowanie odpowiedzi.** Nie jest zegarem globalnej propagacji.
