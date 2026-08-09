# Czym jest Node.js, npm i bundler Vite (Cz. 2 - Bundler Vite, Dev Server i HMR w Praktyce)

Witaj w drugiej części modułu poświęconego narzędziom deweloperskim we front-endzie.

W poprzedniej lekcji poznałeś środowisko Node.js i menedżer npm. Dzisiaj jako Twój mentor omówię z Tobą działanie najnowocześniejszego bundlera na świecie: **Vite**. Poznasz technologię **Hot Module Replacement (HMR)** oraz proces budowania zoptymalizowanej paczki produkcyjnej.

---

## 🎓 Krok 1: Dlaczego Vite zastąpił tradycyjne bundlery?

Dawniej, w czasach Webpacka, uruchomienie serwera deweloperskiego w dużym projekcie wymagało skompletowania i połączenia w jeden plik tysięcy modułów. Uruchamianie serwera trwało nawet 2 minuty, a każda zmiana w kodzie wymagała ponownego przeliczenia pliku.

**Vite** zrewolucjonizował ten proces dzięki wykorzystaniu **natywnych modułów ES6 (`import`/`export`)** w nowoczesnych przeglądarkach:

```mermaid
graph TD
    subgraph StareBundlery["Stare Bundlery (Webpack / Parcel)"]
        WebpackSrc[Wszystkie pliki źródłowe] --> WebpackBundle[Wielka kompilacja całego projektu w pamięci]
        WebpackBundle --> WebpackServer[Serwer Deweloperski (Bardzo wolny start)]
    end

    subgraph ViteArchitecture["Nowoczesny Bundler Vite"]
        ViteServer[Serwer Deweloperski Vite (Błyskawiczny start w 100ms)] -->|Zwraca tylko zamówiony plik| Browser[Przeglądarka ładuje pliki przez natywny ES import]
    end
```

- **Błyskawiczny start:** Vite nie kompiluje całej aplikacji na start. Serwer uruchamia się w ułamku sekundy, a przeglądarka pobiera z niego tylko ten plik, który w danym momencie wyświetla na ekranie.
- **Pre-bundling w Go/esbuild:** Zależności z `node_modules` są wstępnie przetwarzane niezwykle szybkim kompilatorem napisanym w języku Go (`esbuild`), działającym 100x szybciej od narzędzi pisanych w JavaScript!

---

## 🎓 Krok 2: Czym jest Hot Module Replacement (HMR)?

Wyobraź sobie, że wypełniasz skomplikowany formularz w aplikacji. Zauważasz literówkę w tytule nagłówka i poprawiasz plik `.js`.

W tradycyjnym środowisku cała strona ulega odświeżeniu, a Ty **tracisz wszystkie wpisane dane w formularzu**.

Dzięki mechanizmowi **Hot Module Replacement (HMR)** w Vite, po zapisaniu pliku w edytorze podmieniany jest **wyłącznie ten jeden zmodyfikowany moduł w przeglądarce**, bez przeładowywania karty i bez utraty stanu aplikacji!

---

## 🛠️ Warsztat z Mentorem: Tworzenie i Uruchamianie Projektu Vite

Wykonajmy krok po kroku komendy tworzące lekki projekt produkcyjny:

```bash
# 1. Tworzymy nowy projekt z szablonym czystego JavaScriptu
npx create-vite moj-projekt-vite --template vanilla

# 2. Przechodzimy do folderu i instalujemy zależności
cd moj-projekt-vite
npm install

# 3. Uruchamiamy serwer deweloperski
npm run dev
```

### Przegląd wygenerowanych skryptów w `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- **`npm run dev`:** Uruchamia lekki serwer pod adresem `http://localhost:5173/` z włączoną obsługą HMR.
- **`npm run build`:** Kompiluje kod do wersji produkcyjnej. Generuje czyste, zminifikowane pliki HTML/CSS/JS w folderze **`dist/`**, gotowe do wgrania na serwer Apache/Nginx.
- **`npm run preview`:** Uruchamia serwer podglądu wygenerowanej w folderze `dist/` paczki produkcyjnej.

---

## 🛠️ Interaktywne Wyzwanie Procesu Budowania Vite (Sortable List)

Ułóż w odpowiedniej chronologicznej kolejności kroki cyklu życia projektu od tworzenia do publikacji produkcyjnej:

<data-sortable-list title="Ułóż kolejność etapów pracy z bundlerem Vite">
  <item data-correct="2">Uruchomienie serwera deweloperskiego poleceniem npm run dev i praca z HMR</item>
  <item data-correct="1">Utworzenie projektu poleceniem npx create-vite i instalacja paczek przez npm install</item>
  <item data-correct="3">Wygenerowanie zoptymalizowanej paczki produkcyjnej w folderze dist/ poleceniem npm run build</item>
  <item data-correct="4">Wgranie wygenerowanych zawartości folderu dist/ na serwer produkcyjny Apache lub Nginx</item>
</data-sortable-list>

---

### <span class="header-koala"><span>🦾</span><span>Executive Summary</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Vite** wykorzystuje natywne moduły ES6 i serwer oparty na `esbuild` dla błyskawicznego startu.
- **Hot Module Replacement (HMR)** podmienia zmienione pliki w locie bez utraty stanu aplikacji.
- Skrypty **`npm run dev`** służą do pracy lokalnej, a **`npm run build`** generuje paczkę w folderze `dist/`.
