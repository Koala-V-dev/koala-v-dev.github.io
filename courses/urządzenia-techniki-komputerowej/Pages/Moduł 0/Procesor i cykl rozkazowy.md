# Procesor i cykl rozkazowy

W inwerterze zmiana wejścia zmieniała wyjście. W procesorze obwód może też zachować wynik i użyć go w następnym kroku. Przy odczycie czujnika procesor musi pobrać wartość, porównać ją z progiem i zdecydować, czy włączyć wentylator. Każdy z tych kroków wymaga wykonania instrukcji.

## 🧠 Od instrukcji do wyniku

**Rdzeń** wykonuje instrukcje programu. **Rejestry** przechowują bieżące wartości robocze. **ALU** wykonuje operacje arytmetyczne i logiczne. Licznik rozkazów wskazuje adres instrukcji do pobrania w uproszczonym modelu.

Po pobraniu rozkazu jego kod jest dostępny do zdekodowania. **Dekodowanie** ustala operację i źródła danych. Wykonanie zmienia stan, na przykład zapisuje wynik w rejestrze lub wybiera następny adres. W rzeczywistych procesorach różne etapy kilku instrukcji mogą trwać równocześnie. [Przykład ścieżki danych procesora w MIT Computation Structures](https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c13/c13s1/).

## ⏱️ Taktowanie i czas wykonania

**GHz** mierzy miliardy taktów na sekundę. Na czas pracy wpływa też ilość pracy wykonywana w takcie, oczekiwanie na dane oraz możliwość podziału zadania między rdzenie. Wątek programu to ciąg pracy, który system może przydzielić do wykonania. Dwa wątki sprzętowe jednego rdzenia współdzielą część jego zasobów.

W klasycznym modelu von Neumanna instrukcje i dane korzystają ze wspólnej pamięci. Model harwardzki je rozdziela. W praktyce rdzeń może mieć osobne pamięci podręczne dla instrukcji i danych przy wspólnej przestrzeni pamięci głównej.

## 🧪 Ile wątków przyspiesza to zadanie

Komputer może długo rozpakowywać archiwum, choć w Menedżerze zadań ogólne użycie procesora wygląda na niskie. Sprawdź, czy obciążenie rozkłada się na cały procesor i ile daje uruchomienie większej liczby wątków.

### 🖥️ Odczytaj budowę procesora

Naciśnij <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Esc</kbd>. W **Wydajność → Procesor** zanotuj model, liczbę **rdzeni** i **procesorów logicznych**. Kliknij wykres prawym przyciskiem i wybierz **Zmień wykres na → Procesory logiczne**. Każde pole pokazuje obciążenie jednego procesora logicznego. System może przenosić ten sam wątek między nimi, więc kilka pól ze śladami aktywności jeszcze nie dowodzi, że zadanie pracowało równolegle. [Widok procesorów logicznych w dokumentacji Microsoft](https://learn.microsoft.com/en-us/troubleshoot/windows-server/support-tools/support-tools-task-manager).

### 📦 Zmierz tę samą pracę

Otwórz **Menedżer plików 7-Zip**. W menu **Narzędzia** wybierz **Test wydajności** (ang. *Tools → Benchmark*). Test przygotowuje własne dane i pokazuje osobno szybkość kompresji i dekompresji LZMA. Wynik podaje przepustowość, więc wyższa wartość oznacza szybsze wykonanie danego etapu. [Format 7z i metoda LZMA](https://www.7-zip.org/7z.html).

1. Ustaw **jeden wątek** i zanotuj rozmiar słownika. Gdy zakończą się trzy przebiegi, zapisz szybkość z wiersza wyniku w obu kolumnach. Równocześnie obserwuj wykres procesorów logicznych.
2. Ustaw **dwa wątki** i powtórz pomiar z tym samym słownikiem i tą samą liczbą przebiegów. Na laptopie zachowaj ten sam tryb zasilania. Jeśli komputer udostępnia tylko jeden procesor logiczny, wykonaj pierwszy pomiar i opisz to ograniczenie.
3. Porównaj szybkości osobno dla kompresji i dekompresji. Jeśli różnica jest mała, ponów próbę z jednym wątkiem i sprawdź, czy uzyskasz podobny wynik jak na początku.

| Liczba wątków | Szybkość kompresji | Szybkość dekompresji | Co zmieniło się na wykresach |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |

Jeśli dekompresja wzrosła z 40 do 68 MB/s, przyspieszenie wynosi $68/40=1{,}7$. Taki wynik wystarcza do porównania tych dwóch ustawień na badanym komputerze. Jeśli w rzeczywistym archiwum praca nadal trwa długo, zmierz też aktywność dysku. Test LZMA i kopiowanie plików na nośnik obciążają inne części stacji. Pomiar temperatury i taktowania wykonasz w lekcji [Diagnostyka sprzętowa w Windows 11](/courses/windows-11/Pages/Moduł%204/Diagnostyka%20sprzętowa.html).

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Dwa rozkazy i zależność</span> <span class="deep-dive-badge">ASEMBLER x86</span></summary>
<div class="deep-dive-content">

W zapisie zbliżonym do asemblera x86 `mov eax, 7` ustawia 32-bitowy rejestr, a `add eax, 5` daje 12. Drugie działanie potrzebuje wyniku pierwszego. Dwa dodawania na niezależnych danych mogą się nakładać, jeśli pozwala na to rdzeń. Dla stałego taktowania model czasu to liczba instrukcji razy średnia liczba taktów na instrukcję, podzielona przez częstotliwość. W dwóch programach ta średnia może być różna.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Porównuj czas i warunki wykonania konkretnej pracy. Z samego zegara nie wyliczysz wydajności.

