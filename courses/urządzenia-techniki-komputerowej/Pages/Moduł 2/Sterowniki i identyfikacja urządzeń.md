# Sterowniki i identyfikacja urządzeń

Karta sieciowa pojawia się jako nieznane urządzenie. Co mówi to o połączeniu ze sprzętem, a czego jeszcze nie potwierdza?

## 🪪 Rozpoznanie sprzętu i działanie funkcji

System odczytuje identyfikatory urządzeń po ich wykryciu. Na PCI identyfikatory producenta i urządzenia bywają pokazane jako `VEN_` i `DEV_`. System dopasowuje sterownik. Widoczny identyfikator oznacza, że zaszła przynajmniej część komunikacji. Brak działającego interfejsu sieciowego wymaga dalszej weryfikacji.

Zapisz identyfikator i kod błędu w narzędziu systemowym. Porównaj model z dokumentacją komputera lub karty. Korzystaj z pakietu producenta zgodnego z systemem. Po zmianie sterownika sprawdź funkcję, np. czy interfejs nawiązuje połączenie z tym samym znanym przewodem i przełącznikiem.

Gdy urządzenie w ogóle znika, sprawdź zasilanie, połączenie i wykrycie przez firmware tam, gdzie sprzęt jest przez nie pokazywany.

## 🧪 Samodzielna próba

Po aktualizacji sterownika karta jest widoczna, ale nie łączy się z siecią. Inny komputer działa na tym samym kablu i porcie. Podaj następny test i wynik, który wzmocni podejrzenie aktualizacji.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

Zapisz wersję i kod błędu, po czym przywróć poprzedni zatwierdzony sterownik. Jeśli na tym samym sprzęcie i kablu wróci połączenie, masz dowód zależności od wersji.

</details>

<details class="deep-dive">
<summary><span class="deep-dive-title">🔬 Rejestry urządzenia i kolejność operacji</span> <span class="deep-dive-badge">PROGRAMOWANIE SYSTEMOWE</span></summary>
<div class="deep-dive-content">

Urządzenie może udostępnić rejestry pod adresami w przestrzeni CPU. To MMIO, czyli dostęp do wejścia i wyjścia przez mapowane adresy. Odczyt może mieć skutki uboczne, a zwykłe operacje na pamięci C nie opisują wszystkich wymagań sterownika. Używa się funkcji dostępu właściwych platformie. Zapis polecenia po przygotowaniu danych wymaga zachowania kolejności widzianej przez urządzenie.

</div>
</details>

---

## 🧭 Reguła serwisowa

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Zapisz identyfikator, kod i wersję przed zmianą. Po zmianie sprawdź rzeczywistą funkcję.

