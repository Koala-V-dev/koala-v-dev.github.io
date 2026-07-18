# Weryfikacja Wiedzy i Logiki

Komponent `<data-quiz>` pozwala na tworzenie punktów kontrolnych, które sprawdzają zrozumienie architektury systemu.

## Quiz: Mechanizm Autoryzacji

<data-quiz>
    <question>Z jakiego mechanizmu korzysta klasa `AuthMiddleware` w celu wykrycia metod, które nie wymagają logowania?</question>
    <options>
        <option>Ręczne sprawdzanie tablicy adresów URL w configu</option>
        <option correct>Atrybutu PHP `#[NoAuth]` sprawdzanego przez Reflection API</option>
        <option>Pliku `.htaccess` z regułami Allow from all</option>
    </options>
</data-quiz>

## Dlaczego quizy są kluczowe w badaniu?
1. **Aktywne Przypominanie (Active Recall)**: Zmusza mózg do wygenerowania odpowiedzi przed jej zobaczeniem.
2. **Diagnostyka**: Tracking pozwala na wykrycie "wąskich gardeł" w materiale dydaktycznym.

> [!WARNING]
> Jeśli uczeń błędnie odpowie na to samo pytanie wielokrotnie, system powinien zasugerować powrót do sekcji "Analiza Architektury".
