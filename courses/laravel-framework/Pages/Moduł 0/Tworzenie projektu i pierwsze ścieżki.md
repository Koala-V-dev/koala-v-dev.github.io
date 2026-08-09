# Tworzenie projektu i pierwsze ścieżki w Laravel

Witaj w zaawansowanym kursie **Laravel 11+**. Laravel to najpopularniejszy na świecie framework języka PHP, używany przez największe firmy do budowania wydajnych, bezpiecznych i skalowalnych aplikacji internetowych.

W tej lekcji nauczysz się tworzyć nowy projekt Laravel, poznasz strukturę katalogów oraz opanujesz mechanizm **Routingu (zarządzania ścieżkami URL)**.

Zbudujemy **Mini-projekt 1: Dynamiczny Kalkulator Usług w Laravel Routing**.

---

## 🧠 Model mentalny: Jak działa Laravel?

Gdy użytkownik wpisuje w przeglądarce adres `http://localhost/uslugi/5`, zapytanie przechodzi przez centralny punkt wejścia:

```mermaid
graph LR
    User[Przeglądarka / Klient] -->|Zapytanie HTTP GET| PublicIndex[public/index.php]
    PublicIndex -->|Przekazanie do| Router[routes/web.php]
    Router -->|Dopasowanie ścieżki /uslugi/{id}| Controller["Kontroler / Funkcja Callback"]
    Controller -->|Zwrócenie wyniku| Response[Czysty Odpowiedź HTTP HTML/JSON]
```

1. **`public/index.php`:** Jedyny publicznie dostępny plik na serwerze Apache/Nginx. Uruchamia cały framework.
2. **`routes/web.php`:** Centralny plik routingu dla stron WWW. Definiuje, jak serwer ma zareagować na podany adres URL.

---

## ⚙️ Krok 1: Tworzenie nowego projektu Laravel 11

Aby utworzyć nowy projekt Laravel w swoim środowisku, otwórz terminal w folderze `C:\xampp\htdocs\` i wpisz polecenie Composera:

```bash
composer create-project laravel/laravel moj-portal
```

Po zakończeniu instalacji przejdź do folderu i uruchom wbudowany serwer deweloperski Artisan:

```bash
cd moj-portal
php artisan serve
```

Twój projekt jest teraz dostępny pod adresem: `http://127.0.0.1:8000/`.

---

## ⚙️ Krok 2: Anatomia pliku `routes/web.php` i rozbicie składni

Otwórz plik `routes/web.php` w swoim edytorze kodu. Zdefiniujemy w nim pierwsze ścieżki aplikacji:

```php
<?php

use Illuminate\Support\Facades\Route;

// 1. Podstawowa ścieżka dla strony głównej
Route::get('/', function () {
    return 'Witaj w nowej aplikacji Laravel 11!';
});

// 2. Ścieżka z parametrem dynamicznym i walidacją regex
Route::get('/kalkulator/{kwota}/{procent}', function (float $kwota, float $procent) {
    $podatek = $kwota * ($procent / 100);
    $suma = $kwota + $podatek;

    return "
        <h1>Kalkulator Usług Laravel</h1>
        <p>Kwota bazowa: <strong>{$kwota} PLN</strong></p>
        <p>Stawka podatku: <strong>{$procent}%</strong></p>
        <p>Podatek: <strong>{$podatek} PLN</strong></p>
        <hr>
        <p>Do zapłaty: <strong>{$suma} PLN</strong></p>
    ";
})->whereNumber('kwota')->whereNumber('procent')->name('calculator.calculate');
```

### 🔍 Wyjaśnienie składni Laravel Routing od zera:

- **`use Illuminate\Support\Facades\Route;`** — Import fasady `Route`, która udostępnia statyczne metody do definiowania ścieżek.
- **`Route::get('/sciezka', function() { ... })`** — Definiuje obsługę żądania HTTP GET. Pierwszy argument to adres URL, a drugi to funkcja anonimowa (Callback), która wykonuje się po wejściu na ten adres.
- **`{kwota}` i `{procent}`** — Parametry dynamiczne w ścieżce URL. Laravel automatycznie wyciąga je z adresu (np. `/kalkulator/1000/23`) i przekazuje do zmiennych `$kwota` i `$procent` w funkcji.
- **`->whereNumber('kwota')`** — Ochrona i walidacja ścieżki! Laravel zaakceptuje ten adres wyłącznie wtedy, gdy parametr `{kwota}` jest liczbą.
- **`->name('calculator.calculate')`** — Nazwana ścieżka. Pozwala na bezpieczne odwoływanie się do tej ścieżki w szablonach bez podawania URL-a na sztywno (`route('calculator.calculate')`).

---

## 🎯 🛠️ Mini-projekt 1: Testowanie Kalkulatora w Laravel

1. Upewnij się, że polecenie `php artisan serve` działa w terminalu.
2. Otwórz przeglądarkę i wpisz adres:
   `http://127.0.0.1:8000/kalkulator/2500/23`
3. Na ekranie zobaczysz błyskawicznie przeliczony wynik usługi!
4. Spróbuj wpisać adres z literami: `http://127.0.0.1:8000/kalkulator/abc/23`. Laravel automatycznie zwróci błąd `404 Not Found`, ponieważ parametr `abc` nie przeszedł walidacji `whereNumber()`!

---

## 🛠️ Diagnostyka i rozwiązywanie problemów

<data-gate>
  <data-quiz>
    <question>
      Jaka jest rola polecenia "php artisan serve" w środowisku deweloperskim Laravel?
    </question>
    <options>
      <item>Tworzy automatyczną kopię zapasową bazy danych MySQL.</item>
      <item correct>Uruchamia wbudowany lekki serwer deweloperski PHP pod adresem http://127.0.0.1:8000, pozwalając na szybkie testowanie aplikacji bez ręcznej konfiguracji VirtualHost w Apache.</item>
      <item>Zmniejsza rozmiar obrazów w folderze public/.</item>
    </options>
    <div data-hint="error">
      Zastanów się: co pozwala Ci przeglądać stronę pod adresem `http://127.0.0.1:8000` bez włączania Apache w XAMPP? Wbudowany serwer Artisan!
    </div>
    <div data-hint="success">
      Wspaniale! `php artisan serve` to najszybszy sposób na uruchomienie aplikacji Laravel na komputerze programisty.
    </div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>Executive Summary</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Nowy projekt tworzysz poleceniem **`composer create-project laravel/laravel moj-projekt`**.
- Ścieżki stron WWW definiujesz w pliku **`routes/web.php`** za pomocą metody **`Route::get()`**.
- Używaj parametrów dynamicznych **`{param}`**, nazwania ścieżek **`->name()`** oraz walidacji **`->whereNumber()`**.
