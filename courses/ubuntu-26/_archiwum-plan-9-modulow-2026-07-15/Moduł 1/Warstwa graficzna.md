# Warstwa graficzna i serwery wyświetlania

W nowoczesnych systemach operacyjnych Linux warstwa graficzna przeszła ogromną ewolucję. Klasyczny serwer wyświetlania **X11 (X Window System)**, rozwijany od lat 80. XX wieku, został zastąpiony przez nowoczesny protokół **Wayland**, który jest domyślnie używany w dystrybucjach Ubuntu 26.04 LTS.

---

## 🆚 Porównanie: Wayland vs X11

Główną różnicą między tymi serwerami jest podejście do bezpieczeństwa i architektury przesyłania obrazu:

### 1. Architektura i wydajność
* **X11:** Działa jako centralny pośrednik. Aplikacje wysyłają żądania rysowania do serwera X, a serwer X decyduje jak i gdzie to narysować, po czym przesyła instrukcje do menedżera kompozycji i sterownika karty graficznej. Powoduje to narzut i opóźnienia.
* **Wayland:** Upraszcza proces. Każda aplikacja rysuje do własnego bufora pamięci w RAM, a kompozytor (np. Mutter w GNOME) bezpośrednio nakłada te bufory na ekran za pomocą sterownika graficznego, eliminując zbędne etapy i efekt rozrywania obrazu (screen tearing).

### 2. Izolacja i bezpieczeństwo
* **X11:** Posiada ogromną wadę architektoniczną pod kątem bezpieczeństwa – brak izolacji aplikacji. Każda aplikacja uruchomiona w serwerze X może swobodnie odpytywać serwer o współrzędne innych okien, przechwytywać naciśnięcia klawiszy (keylogging) lub robić zrzuty ekranu dowolnego innego programu (np. wpisywanego hasła w przeglądarce).
* **Wayland:** Wprowadza ścisłą izolację. Żadna aplikacja nie ma prawa dostępu do bufora innego programu. Przechwytywanie klawiatury lub nagrywanie ekranu wymaga zgody użytkownika i odbywa się za pomocą dedykowanych, bezpiecznych API (np. PipeWire i portale XDG Desktop).

---

## 🛡️ Wayland a bezpieczeństwo stacji roboczej

Izolacja środowiska Wayland ma kluczowe znaczenie przy uruchamianiu niezweryfikowanego oprogramowania (np. w kontenerach lub piaskownicach). Chroni to system przed szkodliwym oprogramowaniem próbującym kraść poufne dane (np. tokeny z otwartych sesji terminala czy loginy wpisywane w menedżerach haseł).

> [!NOTE]
> Starsze aplikacje, które nie wspierają natywnego protokołu Wayland, są uruchamiane na Ubuntu w warstwie kompatybilności **XWayland**. Działają one w izolowanym oknie X11 i nie zagrażają pozostałej części systemu.

---

## 🛠️ Punkt Kontrolny: Warstwa graficzna
<data-gate>
  <data-quiz>
    <question>
Dlaczego protokół Wayland jest uważany za znacznie bezpieczniejszy od serwera X11?
    </question>
    <options>
      <item correct>Wayland izoluje bufory graficzne i dane wejściowe aplikacji, uniemożliwiając innym programom podsłuchiwanie klawiatury (keylogging) czy nieautoryzowane zrzuty ekranu.</item>
      <item>Wayland całkowicie blokuje działanie sterowników własnościowych Nvidia, wymuszając korzystanie wyłącznie z kodu otwartoźródłowego.</item>
      <item>Wayland szyfruje cały obraz przesyłany z karty graficznej do monitora, chroniąc przed fizycznym podsłuchem HDMI.</item>
    </options>

<div data-hint="error">
  Przypomnij sobie wadę architektury X11 związaną z brakiem izolacji okien i globalnym dostępem do zdarzeń klawiatury.
</div>
<div data-hint="success">
  Znakomicie! Izolacja klientów to fundament bezpieczeństwa graficznego w nowoczesnych dystrybucjach Linux.
</div>
  </data-quiz>
</data-gate>
