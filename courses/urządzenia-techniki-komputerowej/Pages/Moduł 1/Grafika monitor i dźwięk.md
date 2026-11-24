# Grafika monitor i dźwięk

Przy monitorze podłączonym przez USB-C albo stację dokującą sprawdź też tor od portu do monitora. Warsztat w lekcji „Porty kable i interfejsy” pokazuje, dlaczego obraz może działać, chociaż jednocześnie spada tryb łącza dysku USB.

Monitor ma 144 Hz, a pulpit działa w 60 Hz. Który odczyt potwierdzi, co faktycznie wysyła komputer?

## 🖥️ Od ramki do ekranu

GPU przelicza i przygotowuje obraz. Oddzielna karta ma zwykle własną pamięć **VRAM**. GPU zintegrowane zwykle korzysta z RAM systemu. **Rozdzielczość** mówi, ile pikseli ma obraz, a **Hz** określa, jak często ekran odświeża obraz. **FPS** mówi, ile klatek przygotowuje źródło w sekundę.

Połączenie obejmuje wyjście GPU, kabel lub adapter, wejście monitora i wybrany tryb. HDMI i DisplayPort mogą też przesyłać dźwięk. Sprawdź w menu monitora bieżący sygnał i porównaj go z ustawieniami systemu. Gdy zniknął dźwięk po podłączeniu monitora, sprawdź, które wyjście audio wybrał system. Przy analogowym audio rozróżnij wyjście słuchawek i wejście mikrofonu.

## 🧪 Ustal, gdzie znika tryb 144 Hz

Masz monitor opisany jako **144 Hz**, ale Windows podaje **60 Hz**. Zanim wymienisz kabel, ustal, czy wyższa częstotliwość jest dostępna przy natywnej rozdzielczości tego monitora.

### 🎛️ Zmierz sygnał na obu końcach

1. Otwórz **Ustawienia → System → Ekran → Ekran zaawansowany**. Jeśli masz kilka ekranów, wybierz badany monitor. Zapisz rozdzielczość aktywnego sygnału i ustawioną częstotliwość.
2. Otwórz menu ekranowe monitora przyciskiem lub joystickiem na obudowie. Jeśli model pokazuje informacje o sygnale, odczytaj **wejście** i bieżący tryb. Sprawdź, czy ekran odbiera ten tryb, który widzisz w Windows. Przy zmiennej częstotliwości monitor może pokazywać chwilową wartość. Do porównania wybierz stałe ustawienie, jeśli jest dostępne.
3. Rozwiń listę odświeżania w Windows. Jeśli widzisz **144 Hz przy natywnej rozdzielczości**, wybierz je i ponownie sprawdź tryb po obu stronach. Gwiazdka przy częstotliwości oznacza, że jej wybór wymaga zmiany bieżącej rozdzielczości. Taki wynik zapisz jako osobny tryb. [Ustawianie częstotliwości odświeżania w Windows](https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-the-refresh-rate-on-your-monitor-in-windows).

### 🔌 Porównaj połączenia

Jeżeli żądanej częstotliwości nie ma na liście, sprawdź w instrukcji monitora, czy obsługuje ją na używanym wejściu. Jeśli masz odpowiedni kabel, wykonaj próbę bez adaptera lub stacji dokującej. Zachowaj ten sam monitor i rozdzielczość. Zapisz, co fizycznie się zmieniło. Jeśli musisz jednocześnie zmienić wyjście GPU i wejście monitora, wniosek dotyczy całego połączenia. Żeby wskazać pojedynczy kabel, powtórz próbę na tych samych portach z drugim kablem.

| Próba | Wyjście GPU i wejście monitora | Kabel lub adapter | Rozdzielczość sygnału | Maks. Hz przy tej rozdzielczości | Odczyt z menu monitora |
| --- | --- | --- | --- | --- | --- |
| Początkowa | | | | | |
| Po zmianie | | | | | |

Jeżeli po zmianie pojawia się 144 Hz, wróć na chwilę do poprzedniego połączenia i sprawdź, czy ograniczenie wraca. Na stanowisku z jednym kablem wystarczy pomiar trybu w Windows i w menu monitora. Wniosek dotyczy wtedy bieżącego sygnału.

### 🔊 Przywróć dźwięk po podłączeniu monitora

Otwórz **Ustawienia → System → Dźwięk**. W sekcji **Wyjście** wybierz urządzenie, z którego chcesz słuchać. Jeśli monitor nie ma głośników, wybierz fizyczne słuchawki lub głośniki. Odtwórz ten sam krótki fragment i potwierdź, skąd dochodzi dźwięk. [Wybór wyjścia audio w Windows](https://support.microsoft.com/en-gb/windows/hardware/audio/fix-sound-or-audio-problems-in-windows).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Budżet danych obrazu</span> <span class="deep-dive-badge">TRANSMISJA OBRAZU</span></summary>
<div class="deep-dive-content">

Odstęp między początkami odświeżeń wynosi $T=1/f$. Przy 60 Hz to około 16,67 ms. Gra przygotowująca 30 klatek na sekundę dostarcza nową klatkę średnio co 33,33 ms, więc ekran może wyświetlać tę samą klatkę przez więcej niż jedno odświeżenie. Jeśli układ podmieni klatkę w trakcie odczytu wierszy, części obrazu mogą pochodzić z różnych klatek. To rozdarcie obrazu, czyli *tearing*. [Tryby prezentacji w dokumentacji DXGI](https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_2/nf-dxgi1_2-idxgiswapchain1-present1).

Dla obrazu $1920 \times 1080$, 24 bitów na piksel i 60 odświeżeń na sekundę strumień aktywnych pikseli wynosi:

$$1920 \cdot 1080 \cdot 24 \cdot 60 = 2\,985\,984\,000\ \mathrm{bit/s}.$$

To około 2,99 Gb/s dla samych aktywnych pikseli. Do oceny fizycznego łącza trzeba uwzględnić m.in. czas poza aktywnym obrazem i sposób kodowania sygnału. Z kolei bufor w pamięci może mieć cztery bajty na piksel i zajmować $1920 \cdot 1080 \cdot 4 = 8\,294\,400$ B przed ewentualnym wyrównaniem wierszy.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Zapisuj aktualną rozdzielczość, odświeżanie, wejście i wyjście. Zmieniaj jeden element toru naraz.

