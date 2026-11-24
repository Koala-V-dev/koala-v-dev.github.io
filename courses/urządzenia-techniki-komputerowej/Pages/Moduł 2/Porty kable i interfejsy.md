# Porty kable i interfejsy

Dwa kable mają wtyki USB-C. Jeden ładuje laptop, a drugi dodatkowo przesyła obraz do stacji dokującej. Co wiesz już po zobaczeniu wtyku i co musisz jeszcze sprawdzić?

## 🔌 Dopasuj tor do zadania

Złącze opisuje mechaniczne połączenie. Protokół opisuje sposób wymiany danych. USB-C jest typem złącza. Obsługa prędkości USB, obrazu przez DisplayPort Alt Mode, Thunderbolt i zasilania USB Power Delivery zależy od możliwości urządzeń i kabla. Tak samo slot M.2 na płycie może obsługiwać SATA, PCIe albo oba.

HDMI i DisplayPort służą do przesyłania obrazu i dźwięku. RJ-45 to potoczna nazwa wtyku używanego w Ethernet po skrętce. Prędkość Ethernet zależy m.in. od obu portów i okablowania. Starsze VGA niesie obraz analogowy. Adapter między sygnałem cyfrowym i analogowym wymaga odpowiedniego przetwarzania.

Jeśli telefon ładuje się przez USB, ale komputer nie widzi plików, sprawdź tym samym portem kabel z potwierdzoną transmisją danych, a potem tryb telefonu.

## 🧰 Podłącz monitor i dysk do laptopa

Na stanowisku jest stacja dokująca z wejściem **HOST**, monitor HDMI i SSD USB-C. Uruchom obraz na monitorze i połączenie dysku z szybkością **5 Gb/s**. Możesz wykorzystać stację albo podłączyć oba urządzenia bezpośrednio do laptopa.

Przeciągnij każdą wtyczkę do gniazda lub wybierz ją i wskaż gniazdo przyciskiem. Połącz oba końce przewodu. Jeśli monitor działa, ale SSD pracuje jako **High-Speed**, prześledź kabel od SSD aż do laptopa. Zmień jedno połączenie i porównaj odczyt.

<data-gate>
  <data-usb-bench></data-usb-bench>
</data-gate>

## 🧪 Sprawdź, czy kabel ogranicza łącze dysku

Przygotuj komputer z Windows, zewnętrzny SSD USB obsługujący co najmniej **5 Gb/s** i dwa pasujące kable do przesyłania danych. Jako punkt odniesienia weź kabel dołączony do dysku. Jeśli masz kabel oznaczony jako USB 2.0, użyj go do drugiej próby. W obu próbach podłącz dysk bezpośrednio do tego samego gniazda w komputerze.

1. Otwórz **USB Device Tree Viewer** i podłącz dysk pierwszym kablem. W drzewie po lewej znajdź urządzenie, które właśnie się pojawiło. Po prawej w sekcji **Summary** odczytaj **Device Connection Speed**. Zapisz wynik przy oznaczeniu kabla. [USB Device Tree Viewer](https://www.uwe-sieber.de/usbtreeview_e.html).
2. Wysuń dysk w Windows. Zmień kabel, zostawiając ten sam dysk i port. Po podłączeniu ponownie odszukaj urządzenie w drzewie. Może pojawić się w innej gałęzi, bo szybki i wolniejszy tryb jednego gniazda mają osobne wpisy.
3. Wróć do pierwszego kabla i sprawdź, czy wraca pierwszy odczyt. Przed odłączeniem dysku znów wysuń go w Windows.

| Odczyt dla podłączonego dysku | Co oznacza |
| --- | --- |
| **High-Speed** | Połączenie pracuje w trybie USB 2.0 do 480 Mb/s. |
| **SuperSpeed** | Połączenie pracuje w trybie 5 Gb/s. |
| **SuperSpeedPlus** | Połączenie pracuje w trybie szybszym niż 5 Gb/s. |

Jeśli pierwszy kabel za każdym razem daje **SuperSpeed**, a drugi **High-Speed**, zamiana kabla wystarczyła, żeby zmienić tryb połączenia. Ten wynik pasuje zarówno do sprawnego kabla USB 2.0, jak i do kabla z problemem na szybkich liniach. Jeśli obie próby pokazują **High-Speed**, sprawdź w dokumentacji komputera, które gniazdo obsługuje szybkie USB. Powtórz próbę z kablem odniesienia w tym gnieździe.

## 🖥️ Powtórz pomiar przez stację dokującą

Jeśli masz stację dokującą, wepnij do niej dysk tym samym kablem, dla którego bezpośrednio uzyskałeś **SuperSpeed**. Sprawdź tryb dysku w drzewie. W drugim pomiarze podłącz monitor do stacji i sprawdź, czy działa obraz oraz czy zmienił się odczyt dysku. Jeśli instrukcja stacji wymaga ponownego podłączenia jej do komputera w celu zmiany trybu, najpierw bezpiecznie wysuń dysk.

Przy **DisplayPort Alt Mode** obraz może zajmować część szybkich linii USB-C lub wszystkie. Jeśli zajmuje wszystkie, dla USB pozostają osobne linie USB 2.0. Sam pomiar wykrywa zmianę trybu dysku. Przydział linii sprawdzisz w dokumentacji stacji. [Opis współdzielenia linii DisplayPort i USB](https://www.usb.org/sites/default/files/D2T1-4%20-%20VESA%20DP%20Alt%20Mode%20over%20USB%20Type-C.pdf).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Prędkość łącza i czas kopiowania</span> <span class="deep-dive-badge">TRANSMISJA DANYCH</span></summary>
<div class="deep-dive-content">

Łącze reklamowane jako 5 Gb/s ma surowy budżet 625 MB/s przed narzutem. Przesłanie 10 GB zajęłoby co najmniej 16 s przy wykorzystaniu całego budżetu. Przy pomiarze 250 MB/s zajmuje około 40 s. Porównaj wynik z szybkością źródła, odbiornika i wspólnego toru.

</div>
</details>

---

## <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Sprawdź złącze, protokół, prędkość i zasilanie osobno dla każdego ogniwa.

