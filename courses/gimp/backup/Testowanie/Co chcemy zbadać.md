# Analiza Architektury i Celów Badania

Badanie interaktywności w systemie **Koala-V** ma na celu optymalizację procesu dydaktycznego poprzez wykorzystanie bogatych komponentów Markdown. Skupiamy się na dwóch głównych aspektach:

## 1. Ergonomia Poznawcza
Badamy, w jaki sposób odpowiednie formatowanie treści (wykorzystując **Alerty**, **Zakładki** i **KaTeX**) wpływa na percepcję trudnych pojęć technicznych. Hipoteza zakłada, że wizualne odseparowanie logiki biznesowej od technicznych szczegółów implementacyjnych redukuje obciążenie poznawcze (Cognitive Load).

## 2. Inżynieria Informacji Zwrotnej
System musi dostarczać użytkownikowi natychmiastowej walidacji jego wiedzy. Składowe badania to:
- **Analiza błędów**: Śledzenie, które opcje w quizach są wybierane najczęściej.
- **Dostępność (A11y)**: Zapewnienie, że interaktywne elementy są w pełni obsługiwane za pomocą klawiatury (`Focus Management`).

> [!IMPORTANT]
> To laboratorium wykorzystuje fizyczne pliki Markdown umieszczone w folderze `/courses/gimp/`, co pozwala na testowanie nowych komponentów przed ich wdrożeniem na produkcyjne repozytoria kursów.
