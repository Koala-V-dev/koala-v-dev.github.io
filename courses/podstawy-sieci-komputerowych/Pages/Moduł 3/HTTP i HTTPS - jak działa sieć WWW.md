# HTTP i HTTPS - jak działa sieć WWW

Komunikat „strona nie działa” nie wskazuje jeszcze miejsca awarii. Nazwa mogła nie zostać rozwiązana. Połączenie mogło się nie otworzyć. TLS mógł odrzucić certyfikat. Serwer mógł też odebrać żądanie HTTP i odpowiedzieć `404`.

W tej lekcji znajdziesz ostatnią zakończoną granicę wymiany. Potem wybierzesz test, który sprawdza następną granicę, zamiast zgadywać z samego objawu.

## 🧭 Zacznij od zamierzonego URI

Klient ma pobrać:

```
https://app.example/report?id=42
```

Z URI wynikają dane potrzebne w kolejnych krokach:

```
schemat:   https
authority: app.example
ścieżka:   /report
query:     id=42
```

`https` oznacza, że przed wysłaniem żądania HTTP klient ustanawia zabezpieczone połączenie z serwerem uprawnionym do obsługi tej nazwy. Sam adres IP nie zastępuje authority. Pod jednym adresem mogą działać różne witryny.

## 🪜 Szukaj ostatniej zakończonej granicy

Dla badanego wariantu HTTP/1.1 przez TLS i TCP kolejność obserwacji jest taka:

```
1. DNS zwraca adres dla app.example
2. TCP ustanawia połączenie z adresem i portem
3. TLS uwierzytelnia serwer i ustanawia chroniony kanał
4. klient wysyła żądanie HTTP
5. klient odbiera odpowiedź HTTP
```

HTTP/2 zmienia sposób kodowania wiadomości, a HTTP/3 korzysta z QUIC. Nadal możesz pytać o tę samą granicę semantyczną: czy wysłano żądanie i czy odebrano odpowiadającą mu odpowiedź.

Rozważ ślad:

```
DNS: app.example -> 192.0.2.40
TCP: połączenie ustanowione
TLS: certificate_unknown
HTTP request: nie wysłano
```

Najsilniejszy wniosek: klient doszedł do negocjacji TLS, ale nie zaakceptował uwierzytelnienia serwera. W tym śladzie nie ma żądania HTTP, więc nie wolno przypisać wyniku metodzie, ścieżce ani kodowi statusu.

Następny test powinien dotyczyć TLS: porównaj nazwę oczekiwaną przez klienta, przedstawiony certyfikat, jego okres ważności i zbudowany łańcuch zaufania. Ponowienie żądania inną metodą HTTP niczego jeszcze nie sprawdza.

## ✉️ Żądanie wskazuje działanie i cel

Po poprawnym TLS klient może wysłać:

```
GET /report?id=42 HTTP/1.1
Host: app.example
Accept: application/json
```

Do diagnozy zachowaj trzy elementy:

```
metoda:    GET
target:    /report?id=42
authority: app.example
```

Metoda opisuje zamierzone działanie. Target wskazuje zasób w obrębie wybranego serwera. W HTTP/1.1 pole `Host` przenosi authority i pozwala serwerowi wybrać właściwą witrynę.

Zmiana samego adresu IP bez zachowania właściwej nazwy może skierować żądanie do innej konfiguracji TLS albo innego wirtualnego hosta. Dlatego raport „IP odpowiada” nie potwierdza jeszcze obsługi zamierzonego URI.

## 📬 Odpowiedź jest dowodem dotarcia do HTTP

Serwer odpowiada:

```
HTTP/1.1 301 Moved Permanently
Location: /reports/42
Content-Length: 0
```

Finalna odpowiedź HTTP potwierdza, że dla tej wymiany klient wysłał żądanie, a odpowiedź wróciła. `301` mówi, że zasób ma nowy stały identyfikator wskazany przez `Location`.

Nie oznacza jeszcze, że żądanie pod nowy URI zakończy się sukcesem. Przekierowanie tworzy następną wymianę, którą trzeba zapisać osobno.

## 🔎 Interpretuj status z polami i żądaniem

Nie ucz się zakresów kodów jako gotowych diagnoz. Odczytaj finalny status razem z metodą, targetem, authority i polami potrzebnymi dla tego statusu.

```
GET /private HTTP/1.1
Host: app.example

HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="reports"
```

`401` oznacza, że żądanie nie ma ważnych danych uwierzytelniających dla wskazanego zasobu. Pole `WWW-Authenticate` przekazuje co najmniej jedno wyzwanie. Nie zakładaj, czy tokenu brakuje, wygasł, czy został odrzucony, dopóki nie zbadasz danych żądania i zasad serwera.

```
GET /report HTTP/1.1
Host: app.example

HTTP/1.1 404 Not Found
```

`404` mówi, że serwer nie znalazł bieżącej reprezentacji zasobu albo nie chce ujawnić, że taki zasób istnieje. To odpowiedź HTTP, a więc nie jest dowodem awarii DNS, TCP ani TLS w tej wymianie.

```
GET /health HTTP/1.1
Host: app.example

HTTP/1.1 503 Service Unavailable
Retry-After: 120
```

`503` oznacza chwilową niemożność obsługi żądania. `Retry-After` podaje sugestię, kiedy klient może spróbować ponownie. Ten wynik nie dowodzi, że host jest wyłączony. Właśnie otrzymałeś od niego odpowiedź HTTP, bezpośrednio albo przez pośrednika.

## 🧾 Prowadź jeden raport granic

Dla każdej próby zapisz:

```
zamierzone URI
ostatnia zakończona granica
metoda, target i authority, jeśli żądanie wysłano
finalny status i rozstrzygające pola, jeśli odpowiedź odebrano
najsilniejszy wniosek
wniosek, którego nie wolno wyciągnąć
następny test zmieniający jeden warunek
```

Jeśli nie widzisz odpowiedzi HTTP, nie wpisuj kodu statusu z domysłu. Jeśli widzisz `404`, nie cofaj diagnozy do „brak sieci”. Raport ma zatrzymać rozumowanie dokładnie na granicy potwierdzonej śladem.

## 🛠️ Punkt kontrolny: zatrzymaj się przed HTTP

<data-gate>
  <data-quiz>
    <question>Ślad pokazuje poprawną odpowiedź DNS, ustanowione TCP, błąd weryfikacji certyfikatu TLS i brak wysłanego żądania HTTP. Który wniosek jest najlepiej uzasadniony?</question>
    <options>
      <option>Serwer HTTP zwrócił `404`, ale klient ukrył odpowiedź.</option>
      <option correct>Wymiana zatrzymała się podczas TLS; trzeba zbadać nazwę, certyfikat i łańcuch zaufania, a nie metodę lub ścieżkę HTTP.</option>
      <option>DNS zwrócił zły adres, ponieważ każdy błąd certyfikatu pochodzi z DNS.</option>
      <option>Zmiana `GET` na `POST` pozwoli sprawdzić certyfikat.</option>
    </options>
    <div data-hint="error">Najpierw wskaż ostatnią granicę potwierdzoną śladem. Bez wysłanego żądania serwer HTTP nie mógł odpowiedzieć na jego metodę i target.</div>
    <div data-hint="success">Połączenie dotarło do TLS, ale chroniony kanał nie został zaakceptowany. Następny test powinien rozdzielić przyczyny weryfikacji certyfikatu.</div>
  </data-quiz>
</data-gate>

## 🧪 Zbuduj raport dla pięciu prób

Każdy przypadek dotyczy URI `https://app.example` i zaczyna się od poprawnego DNS.

```
A. TCP: odmowa połączenia
   TLS: nie rozpoczęto
   HTTP: nie wysłano

B. TLS: zakończony poprawnie
   GET /old, Host: app.example
   301 Moved Permanently, Location: /new

C. TLS: zakończony poprawnie
   GET /private, Host: app.example
   401 Unauthorized, WWW-Authenticate: Bearer realm="reports"

D. TLS: zakończony poprawnie
   GET /report, Host: app.example
   404 Not Found

E. TLS: zakończony poprawnie
   GET /health, Host: app.example
   503 Service Unavailable, Retry-After: 120
```

Kryteria ukończenia:

- odmowa TCP nie otrzymuje wymyślonego kodu HTTP;
- błąd TLS nie jest nazywany odpowiedzią aplikacji;
- `301` prowadzi do osobnego testu nowego URI;
- `401` jest interpretowane z `WWW-Authenticate`, bez zgadywania przyczyny odrzucenia danych;
- `404` nie staje się dowodem braku hosta;
- `503` potwierdza odpowiedź HTTP mimo chwilowej niedostępności usługi;
- następny test zmienia jedną granicę albo jedną część żądania.

Zmień D: to samo połączenie i ścieżka z `Host: files.example` otrzymują `200 OK`. Zaktualizuj hipotezę i zaproponuj test, który sprawdzi wybór wirtualnego hosta bez zmiany ścieżki.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

W A ostatnim pozytywnym dowodem jest odpowiedź DNS. Odmowa TCP pochodzi z granicy transportowej. Nie ma podstaw do oceny certyfikatu, metody ani zasobu. Następny test może porównać właściwy port na tym samym adresie albo ten sam port z miejsca, które powinno mieć dostęp.

W B serwer HTTP odpowiedział przekierowaniem. Pole `Location` wskazuje `/new`, ale wynik tej drugiej wymiany nie jest jeszcze znany. Następny test zachowuje authority oraz metodę odpowiednią dla nowego URI i zapisuje kolejną odpowiedź osobno.

W C żądanie dotarło do HTTP, lecz nie ma ważnych danych uwierzytelniających dla zasobu. Wyzwanie wskazuje schemat Bearer i realm. Następny test powinien porównać obecność oraz akceptację danych uwierzytelniających, nie dostępność sieci.

W D odpowiedź `404` dotyczy `GET /report` dla `app.example`. Nie dowodzi braku procesu serwera ani braku całego hosta. Sprawdź konfigurację routingu zasobu albo kontrolowany, znany target na tym samym authority.

W E serwer lub pośrednik zwrócił finalną odpowiedź HTTP `503`. Pole `Retry-After: 120` sugeruje ponowienie po 120 sekundach. Równoległy test znanego lekkiego zasobu może rozdzielić niedostępność tej usługi od szerszej niedostępności aplikacji.

Po zmianie D różnica między `404` dla `app.example` i `200` dla `files.example` przy tej samej ścieżce oraz połączeniu wskazuje na wybór konfiguracji według authority. Nie dowodzi jeszcze błędnej konfiguracji konkretnego komponentu. Powtórz oba żądania z zachowaniem tego samego adresu, portu, metody i ścieżki, zmieniając tylko `Host`, oraz sprawdź log routingu wirtualnych hostów. Jeśli używasz HTTPS w nowym połączeniu, zachowaj też prawidłową nazwę dla TLS.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Najpierw znajdź ostatnią zakończoną granicę.** DNS, transport, TLS i HTTP dostarczają innych dowodów.
- **HTTPS wymaga poprawnego TLS przed żądaniem.** Błąd certyfikatu nie jest kodem statusu HTTP.
- **Żądanie zachowuje metodę, target i authority.** Ten sam adres IP może obsługiwać różne witryny.
- **Status czytasz z żądaniem i polami odpowiedzi.** `301`, `401`, `404` i `503` nie są diagnozami całej sieci.
- **Następny test zmienia jeden warunek.** Dzięki temu zawęża granicę zamiast tylko powtarzać objaw.
