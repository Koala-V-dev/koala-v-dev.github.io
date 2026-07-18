# Dokumentacja Komponentów Interaktywnych

Współczesna dokumentacja techniczna wymaga przejrzystości. System wspiera komponenty, które ułatwiają porównywanie technologii i separację problemów.

## Porównanie Warstw Systemu
Poniżej znajduje się zestawienie kluczowych warstw naszej aplikacji:

| Warstwa | Odpowiedzialność | Kluczowe technologie |
| :--- | :--- | :--- |
| **Frontend** | Interfejs użytkownika, Renderowanie MD | Vite, Marked, KaTeX, Highlight.js |
| **Backend API** | Logika biznesowa, Autoryzacja | PHP 8.2, Router, SessionManager |
| **Data Layer** | Przechowywanie danych, SQL | MariaDB / MySQL |

## Szczegółowa Konfiguracja
Wykorzystaj zakładki, aby przełączać się między różnymi aspektami konfiguracji środowiska:

<data-tabs>
    <div>
        <h2>Konfiguracja .htaccess</h2>
        Reguły przekierowań dla Apache zapewniające działanie SPA i API:
        ```apache
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^ backend/core/api.php [L]
        ```
    </div>
    <div>
        <h2>Zmienne Środowiskowe (.env)</h2>
        Kluczowe parametry połączenia z bazą danych:
        ```bash
        DB_HOST=127.0.0.1
        DB_NAME=koala_v
        DB_USER=root
        DB_PASS=
        ```
    </div>
</data-tabs>

> [!TIP]
> Zakładki są renderowane rekurencyjnie, co oznacza, że wewnątrz taba możesz używać nagłówków, kodu, a nawet kolejnych komponentów interaktywnych.
