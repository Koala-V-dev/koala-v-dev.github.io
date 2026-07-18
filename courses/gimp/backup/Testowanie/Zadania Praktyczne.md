# Przykłady Praktyczne i Zadania

Zadania praktyczne opierają się na analizie kodu i zrozumieniu wzorców projektowych zastosowanych w **Koala-V**.

## Analiza Wzorca Facade
W projekcie zastosowano wzorzec **UIFacade**, aby odizolować operacje na DOM od logiki biznesowej widoków.

**Przykład użycia:**
```javascript
// Tworzenie przycisku w ujednolicony sposób
const btn = UIFacade.createButton("Zapisz", "primary", "button", () => this.save());
actionsContainer.appendChild(btn);
```

## Zadanie dla Badacza
Sprawdź, jak system reaguje na błędy sieciowe w `DataService.js`. Przeanalizuj poniższy fragment kodu:

```javascript
if (response.status === 401) {
    throw new Error("Unauthorized");
}
```

**Pytanie do przemyślenia:**
Czy usunięcie automatycznego przekierowania (`window.location.href`) poprawi UX w przypadku publicznie dostępnych kursów? Odpowiedź znajdziesz w dokumentacji `badanie_kursu`.

> [!NOTE]
> System trackingu automatycznie zarejestruje, jeśli spędzisz więcej niż 30 sekund na analizie powyższego fragmentu kodu.
