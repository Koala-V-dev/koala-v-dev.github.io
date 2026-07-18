# Matematyka w Inżynierii Oprogramowania

System wspiera zaawansowane renderowanie matematyczne za pomocą KaTeX, co pozwala na tworzenie kursów z zakresu algorytmiki i uczenia maszynowego.

## Metryki Wydajności
W analizie wydajności systemów rozproszonych często korzystamy z rozkładu normalnego (Gaussa) do modelowania czasów odpowiedzi.

Gęstość prawdopodobieństwa rozkładu normalnego wyraża się wzorem:

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

Dzięki zapisu inline możemy wspomnieć o odchyleniu standardowym $\sigma$ oraz średniej $\mu$ bezpośrednio w tekście, zachowując wysoką czytelność.

## Implementacja w JS
Renderowanie odbywa się poprzez detekcję symboli `$` oraz `$$` w przetworzonym HTML. Kluczowe jest zapewnienie, że KaTeX uruchamia się PO wstrzyknięciu treści do DOM:

```javascript
renderMathInElement(container, {
    delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
    ]
});
```

> [!CAUTION]
> Upewnij się, że wzory blokowe są otoczone pustymi liniami w Markdownie dla poprawnego rozpoznania przez parser bloków.
