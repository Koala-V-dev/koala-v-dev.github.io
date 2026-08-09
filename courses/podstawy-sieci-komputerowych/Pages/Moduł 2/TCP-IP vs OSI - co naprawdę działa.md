# TCP-IP vs OSI - co naprawdę działa

Technik mówi: „problem jest na warstwie 3”. Dokumentacja protokołu mówi o warstwie internetowej. Obie wypowiedzi mogą wskazywać ten sam zakres, ale żadna nie jest jeszcze diagnozą.

W poprzednim module używałeś OSI do ograniczania wniosków. Teraz opiszesz ten sam dowód językiem modelu OSI i architektury internetowej, bez udawania dokładnego mapowania każdego protokołu.

## 🧠 Najpierw przetłumacz obserwację

Router zapisuje:

```
ramka została odebrana poprawnie
adres docelowy IP: 203.0.113.20
wynik wyszukania trasy: brak dopasowania i brak trasy domyślnej
segment TCP nie został wysłany
```

Uzupełnij dwa zdania:

```
Język OSI: ostatni potwierdzony zakres to ..., pierwszy brak dowodu dotyczy ...
Język Internetu: warstwa łącza ..., warstwa internetowa ..., transport ...
```

Samo wpisanie „warstwa 3” nie wystarczy. Trzeba zachować informację o odebranej ramce, nieudanym routingu i braku próby TCP.

## 🧱 Modele porządkują inne granice

ISO/IEC 7498-1 opisuje siedmiowarstwowy model odniesienia OSI. Warstwy rozdzielają rodzaje usług i funkcji komunikacyjnych. Model nie jest specyfikacją siedmiu obowiązkowych programów w każdym urządzeniu.

RFC 1122 organizuje wymagania hosta internetowego w czterech warstwach:

```
aplikacja
transport
Internet
łącze
```

Ta architektura grupuje razem funkcje, które OSI rozdziela dokładniej. Nie oznacza to, że trzy warstwy OSI „zniknęły” albo że dwie dolne zawsze tworzą jeden moduł sprzętowy.

Uproszczone przejście między językami wygląda tak:

```
OSI 7, 6, 5      pytania aplikacji, reprezentacji i sesji
        \         zwykle mieszczą się w warstwie aplikacji Internetu

OSI 4            transport
        \         warstwa transportowa Internetu

OSI 3            przekazywanie między sieciami
        \         warstwa internetowa

OSI 2 i 1        lokalne łącze oraz zjawisko fizyczne
        \         warstwa łącza w architekturze hosta internetowego
```

To mapa pytań diagnostycznych, nie rejestr własności protokołów. ARP działa poniżej IP i RFC 1122 omawia go przy warstwie łącza. TLS chroni dane aplikacji, ale nie staje się przez to idealnym odpowiednikiem jednej warstwy OSI. QUIC łączy funkcje transportowe, bezpieczeństwo i obsługę wielu strumieni.

## 🔍 Ten sam dowód, dwa poprawne opisy

W początkowym przypadku ramka dotarła, lecz urządzenie nie znalazło trasy dla adresu IP.

Opis w języku OSI:

```
Zakres łącza ma pozytywny dowód dla tej ramki.
Pierwszy brak powodzenia dotyczy decyzji w zakresie sieciowym.
Zakres transportowy i aplikacyjny nie został jeszcze przetestowany.
```

Opis w języku Internetu:

```
Warstwa łącza dostarczyła ramkę do obsługi.
Warstwa internetowa nie znalazła następnego kroku.
Warstwa transportowa nie otrzymała okazji do wysłania segmentu.
```

Oba opisy zachowują ten sam łańcuch dowodów. Różnią się nazwami granic.

## 🧭 Dobierz model do odbiorcy

Model OSI przydaje się, gdy trzeba rozdzielić wąskie pytania. Na przykład poprawne bajty, poprawna składnia JSON i ważny stan sesji mogą należeć do trzech różnych zakresów analizy.

Architektura internetowa przydaje się, gdy czytasz RFC, dokumentację stosu hosta albo opis zachowania IP, TCP i UDP. Jej warstwa aplikacji obejmuje wiele funkcji, które OSI nazywa osobno.

W rozmowie zespołowej najpierw nazwij obserwację, a potem model:

```
„TCP zostało ustanowione, ale HTTP zwrócił 401.
W języku Internetu transport ma pozytywny dowód, a odpowiedź pochodzi z aplikacji.
W OSI nie wracam już do warstwy fizycznej ani sieciowej.”
```

Warstwa nie jest przyczyną. Jest zakresem, w którym szukasz następnego rozróżniającego dowodu.

## 📚 Sprawdź aktualną specyfikację

Protokół opisuje jego aktualna specyfikacja, a nie miejsce na szkolnym diagramie. Dokument RFC może być standardem internetowym, dokumentem najlepszej praktyki, informacją albo mieć inny status. Sam skrót RFC nie oznacza „obowiązujący standard”.

Sprawdzaj co najmniej:

1. tytuł i numer dokumentu;
2. aktualny status;
3. informację, czy nowszy dokument go zastąpił lub zaktualizował;
4. zakres konkretnego wymagania.

Przykład: współczesną specyfikacją TCP jest RFC 9293, które zastąpiło RFC 793. Aktualną semantykę HTTP opisuje RFC 9110. Stare RFC 2616 zostało zastąpione wcześniej i nie jest aktualną specyfikacją. Zapamiętany numer może prowadzić do poprawnego tematu, ale nieaktualnego dokumentu.

## 🛠️ Punkt kontrolny: zachowaj granicę dowodu

<data-gate>
  <data-quiz>
    <question>Interfejs odebrał poprawną ramkę, lecz wyszukiwanie trasy IP zakończyło się wynikiem `brak trasy`. Nie wysłano segmentu TCP. Który opis zachowuje pełny zakres dowodu?</question>
    <options>
      <option>OSI: awaria wszystkich warstw od 3 do 7. Internet: cały stos TCP/IP nie działa.</option>
      <option correct>OSI: łącze ma dowód, pierwszy błąd dotyczy zakresu sieciowego, transport nie został sprawdzony. Internet: łącze działa dla tej ramki, a warstwa internetowa nie znalazła następnego kroku.</option>
      <option>OSI: skoro ramka dotarła, aplikacja działa. Internet: TCP powinno ominąć tablicę routingu.</option>
      <option>Obu modeli nie można użyć do jednej obserwacji, ponieważ wzajemnie się wykluczają.</option>
    </options>
    <div data-hint="error">Zachowaj osobno dowód pozytywny, pierwszą porażkę i zakres jeszcze nieprzetestowany. Model nie może rozszerzyć obserwacji.</div>
    <div data-hint="success">Opis potwierdza lokalne dostarczenie ramki, lokalizuje porażkę przy decyzji IP i nie przypisuje wyniku nieuruchomionemu transportowi.</div>
  </data-quiz>
</data-gate>

## 🧪 Opisz cztery incydenty w dwóch językach

Dla każdego incydentu przygotuj cztery krótkie pola:

```
obserwacja
ostatni potwierdzony zakres
pierwszy brak powodzenia w OSI i w architekturze Internetu
następny test
```

Incydenty:

```
A. interfejs nie wykrywa stanu łącza
B. ramki dochodzą, ale host nie ma trasy do celu
C. trasa działa, zdalny host aktywnie odrzuca próbę TCP na danym porcie
D. TCP działa, serwer HTTP zwraca 401 z żądaniem uwierzytelnienia
```

Kryteria ukończenia:

- nie opisujesz braku stanu łącza jako błędu HTTP;
- nie uznajesz aktywnej odmowy TCP za dowód awarii kabla;
- odpowiedź HTTP potwierdza działanie wcześniejszego transportu dla tej wymiany;
- w obu modelach zachowujesz tę samą obserwację i granicę wniosku;
- następny test rozdziela co najmniej dwie możliwe przyczyny.

Zmień przypadek D: HTTP zwraca `400`, a parser wskazuje końcowy przecinek w JSON. Warstwa aplikacji Internetu pozostaje tym samym szerokim zakresem. W języku OSI możesz jednak precyzyjniej zapytać o reprezentację przed regułą aplikacji. Zapisz nowy następny test.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W incydencie A nie ma jeszcze dowodu poprawnej transmisji na łączu. W OSI zaczynasz od zakresu fizycznego, a potem łącza. W architekturze Internetu problem mieści się w szerokiej warstwie łącza. Następny test może porównać stan obu końców oraz sygnał na znanym sprawnym porcie.

W incydencie B ramki potwierdzają lokalny zakres łącza. Brak trasy jest pierwszym błędem w zakresie sieciowym OSI i warstwie internetowej. Następny test sprawdza pasujące prefiksy oraz trasę domyślną dla konkretnego celu.

W incydencie C IP dotarło do zdalnego hosta, a aktywna odmowa dotyczy próby TCP. W obu językach pierwszy nowy zakres to transport. Następny test powinien rozdzielić brak procesu nasłuchującego od polityki odrzucającej połączenie.

W incydencie D odpowiedź HTTP dowodzi, że ta wymiana dotarła przez transport do usługi aplikacyjnej. Kod `401` kieruje test do danych uwierzytelniających i reguł dostępu. Nie wracasz do kabla ani routingu bez nowego, sprzecznego dowodu.

Po zmianie D na błąd końcowego przecinka testujesz dokument tym samym parserem JSON po obu stronach i zapisujesz dokładne miejsce błędu. W architekturze internetowej nadal pracujesz w warstwie aplikacji. Model OSI pozwala nazwać węższe pytanie o reprezentację danych.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **OSI i architektura Internetu porządkują granice inaczej.** Możesz opisać nimi ten sam dowód bez zmiany obserwacji.
- **Mapowanie jest przybliżeniem.** Protokół nie musi mieścić się w jednym pudełku szkolnego diagramu.
- **Warstwa wskazuje zakres pytania, nie przyczynę.** Diagnozę opierasz na ostatnim sukcesie i pierwszej porażce.
- **Aktualna specyfikacja rozstrzyga zachowanie protokołu.** Numer RFC trzeba sprawdzić wraz ze statusem i informacją o zastąpieniu.
