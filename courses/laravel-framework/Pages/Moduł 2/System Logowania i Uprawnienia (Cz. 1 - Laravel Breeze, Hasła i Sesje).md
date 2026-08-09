# System Logowania i Uprawnienia (Cz. 1 - Laravel Breeze, Hasła i Sesje)

Witaj w pierwszej części drugiego modułu kursu Laravel 11+.

Jako Twój mentor przeprowadzę Cię przez najpopularniejsze ekosystemowe rozwiązanie do uwierzytelniania w Laravel: **Laravel Breeze**. Dowiesz się, jak bezpiecznie pracować z sesjami, ciasteczkami oraz jak funkcja **Argon2id / Bcrypt** zabezpiecza hasła użytkowników przed złamaniem.

---

## 🎓 Krok 1: Architektura Uwierzytelniania w Laravel

W Laravel system rejestracji i logowania opiera się na **Guardach** (strażnikach sesji) oraz **Providerach** (dostawcach użytkowników z bazy danych):

```mermaid
graph TD
    User["1. Użytkownik przesyła formularz logowania (email + password)"] -->|POST /login z tokenem @csrf| Controller[AuthenticatedSessionController]
    Controller -->|2. Weryfikacja danych| FormReq[LoginRequest]
    FormReq -->|3. Wywołanie Auth::attempt()| Guard["Guard Sesji (SessionGuard)"]
    Guard -->|4. Odczyt użytkownika z bazy| Provider["User Provider (Eloquent User)"]
    
    Provider -->|5. password_verify(password, hash)| HashCheck{Czy hasło poprawne?}
    HashCheck -->|Prawda| SessionGen["6. Wygenerowanie nowego ID Sesji (session()->regenerate())"]
    HashCheck -->|Fałsz| ErrRedirect["Błąd: Podane dane są nieprawidłowe"]
```

---

## 🎓 Krok 2: Instalacja i Anatomia Laravel Breeze

Laravel Breeze to oficjalny pakiet startowy, który generuje wszystkie kontrolery, widoki Blade i trasy uwierzytelniania.

W terminalu wykonujemy polecenia Composera i Artisana:

```bash
composer require laravel/breeze --dev
php artisan breeze:install blade
php artisan migrate
```

### Pliki wygenerowane przez Breeze:
- **`routes/auth.php`:** Zawiera wszystkie trasy uwierzytelniania (`/login`, `/register`, `/logout`, `/forgot-password`).
- **`app/Http/Controllers/Auth/`:** Dedykowane kontrolery dla rejestracji i sesji.
- **`resources/views/auth/`:** Szablony Blade formularzy zgodne ze standardami WCAG 2.1.

---

## 🛠️ Warsztat z Mentorem: Analiza Logiki Logowania (`LoginRequest.php`)

Przeanalizujmy, jak Laravel zabezpiecza proces logowania przed atakami typu **Brute Force (Zgadywanie haseł)** z użyciem **Rate Limitera**:

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

final class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Weryfikacja danych logowania i ochrona przed Brute Force
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // Proba zalogowania uzytkownika z uzyciem metody Auth::attempt()
        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            // Rejestrujemy nieudana probe w Rate Limiterze
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // Czyszczenie licznika prob po udanym logowaniu
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Sprawdza, czy przekroczono limit 5 nieudanych prob logowania
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return strtolower($this->input('email')).'|'.$this->ip();
    }
}
```

### 🔍 Rozbicie składni linia po linii (Od Mentora):

- **`Auth::attempt(['email' => $email, 'password' => $password])`** — Główna metoda uwierzytelniająca. Automatycznie wyszukuje użytkownika po adresie e-mail i weryfikuje podane hasło w postaci czystej z zakodowanym haszem w bazie danych.
- **`session()->regenerate()`** — **Kluczowe zabezpieczenie przed atakiem Session Fixation!** Regeneruje identyfikator sesji natychmiast po zalogowaniu.
- **`RateLimiter::tooManyAttempts(..., 5)`** — Blokuje dalsze próby logowania z podanego adresu IP na 60 sekund po 5 nieudanych próbach.

---

## 🛠️ Interaktywna Weryfikacja Umiejętności: Bezpieczeństwo Logowania

Sprawdź swoje zrozumienie mechanizmów auth w Laravel — połącz metodę z jej funkcją w architekturze:

<data-connection-matcher title="Połącz metody uwierzytelniania w Laravel z ich rolą w architekturze">
    <div class="cmw-item" data-left="Auth::attempt()" data-right="Pobiera uzytkownika i weryfikuje hasło z uzyciem password_verify()"></div>
    <div class="cmw-item" data-left="$request->session()->regenerate()" data-right="Regeneruje identyfikator sesji chroniąc przed atakiem Session Fixation"></div>
    <div class="cmw-item" data-left="RateLimiter::tooManyAttempts()" data-right="Blokuje konto po 5 nieudanych próbach logowania chroniąc przed Brute Force"></div>
    <div class="cmw-item" data-left="Hash::make($password)" data-right="Bezpieczne haszowanie hasła algorytmem Bcrypt / Argon2id przed zapisem do bazy"></div>
</data-connection-matcher>

---

### <span class="header-koala"><span>🦾</span><span>Executive Summary</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Twórz system logowania poleceniem **`php artisan breeze:install blade`**.
- Metoda **`Auth::attempt()`** automatycznie weryfikuje hasło i zarządza sesją.
- Zawsze wywołuj **`session()->regenerate()`** po zalogowaniu dla ochrony przed atakiem **Session Fixation**.
