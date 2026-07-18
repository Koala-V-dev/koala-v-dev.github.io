# Cykl życia procesów i priorytety

Każdy program uruchomiony w systemie Linux staje się procesem. Jądro Linuksa zarządza procesami, przydzielając im czas procesora oraz zasoby pamięci. Zrozumienie stanów procesów oraz sposobu ich szeregowania to klucz do optymalizacji pracy serwera.

---

## 🔄 Cykl życia i stany procesów

Proces w systemie operacyjnym przechodzi przez różne stany:

* **Running / Runnable (R):** Proces aktualnie wykonuje kod na procesorze lub czeka w kolejce harmonogramu (scheduler) na swoją kolej.
* **Sleeping (S / D):** Proces czeka na zdarzenie (np. zakończenie operacji wejścia/wyjścia, sygnał z sieci):
  * **S (Interruptible Sleep):** Proces może zostać przerwany i wybudzony przez sygnał.
  * **D (Uninterruptible Sleep):** Proces czeka na krytyczne zasoby sprzętowe (np. operację zapisu na dysku) i nie reaguje na żadne sygnały (nawet na sygnał natychmiastowego zabicia `SIGKILL`).
* **Zombie (Z):** Proces zakończył działanie, ale jego rodzic (parent process) nie odczytał kodu powrotu (exit status). Zwalnia zasoby pamięci RAM, ale zachowuje wpis w tablicy procesów. Nagromadzenie procesów zombie może zablokować tworzenie nowych programów.

---

## ⚖️ Priorytety procesów: Nice i Renice

Harmonogram jądra przydziela zasoby procesora na podstawie współczynnika uprzejmości (niceness):

* **Skala Nice:** Wartości od **$-20$** (najwyższy priorytet, proces jest najmniej uprzejmy i zabiera czas innym) do **$19$** (najniższy priorytet, proces jest najbardziej uprzejmy i ustępuje miejsca innym). Domyślna wartość to $0$.
* **Narzędzia:**
  * `nice -n -5 program` (uruchom program z podwyższonym priorytetem - wymaga uprawnień roota).
  * `renice -n 10 -p 1234` (zmień priorytet już uruchomionego procesu o PID 1234 na wartość 10).

---

## 🛠️ Punkt Kontrolny: Cykl życia procesów
<data-gate>
  <data-quiz>
    <question>
Czym charakteryzuje się stan procesu oznaczony literą D (Uninterruptible Sleep) w systemie Linux?
    </question>
    <options>
      <item correct>Proces oczekuje na sprzętowe wejście/wyjście (np. odczyt z dysku) i nie może zostać przerwany ani zabity sygnałem SIGKILL.</item>
      <item>Proces został pomyślnie przeniesiony do pamięci swap i oczekuje na całkowity restart serwera.</item>
      <item>Proces zakończył swoje zadanie, ale jego proces nadrzędny uległ zawieszeniu.</item>
    </options>

<div data-hint="error">
  Zwróć uwagę na słowo "Uninterruptible". Taki proces czeka w kolejce jądra bezpośrednio na sygnał ze sterownika sprzętowego.
</div>
<div data-hint="success">
  Znakomicie! Procesy w stanie D blokują obsługę sygnałów do czasu zakończenia fizycznej operacji na dysku lub sieci.
</div>
  </data-quiz>
</data-gate>
