# Podstawowe Bramki Logiczne 🔌

Witaj w architekturze układów cyfrowych! W poprzedniej lekcji poznaliśmy "przełączniki" czyli **Tranzystory**. W dzisiejszych mikroprocesorach korzystamy z setek miliardów mikroskopijnych tranzystorów układanych w tzw. bramki.

> [!IMPORTANT] Architektura TTL i CMOS
> Bramki buduje się fizycznie poprzez odpowiednie poprowadzenie prądu przez "wafle" krzemowe naszpikowane tranzystorami (technologia np. CMOS). Bramka otrzymuje prąd wejściowy (na nóżkach **A** i **B**), oraz napięcie referencyjne. Gdy warunek bramki zostanie spełniony, przepuszcza ona na **Wyjście (Z)** sygnał 1. Gdy nie jest spełniony - wypuszcza równe 0.

Czas poznać potężną Trójcę, z której zbudowane są wszystkie serwery, smartfony i algorytmy AI świata.

---

## 🛑 Bramka AND (Koniunkcja / Iloczyn Logiczny)

Matematyczny zapis: `Z = A * B` lub `Z = A ∧ B`.

Bramka **AND (Oraz)** to surowy perfekcjonista. Wymaga, żeby **Wszystkie** jej wejścia były w stanie wymuszonym (1), by na wyjściu Z również pojawiła się jedynka. W każdym innym przypadku (gdy cokolwiek jest zerem) dławi sygnał dając 0.

Wyobraź sobie dwa włączniki światła połączone *szeregowo* na jednym przewodzie do żarówki. Jeśli wciśniesz tylko pierwszy - "pstryczek" poleci przez prąd, ale w drugim włączniku natrafi na blokadę. Żarówka się zaświeci TYLKO WTEDY, gdy oba włączniki są "włączone" (zwarte).

Przeanalizuj to empirycznie. Wciśnij oba guziki poniższej symulacji:
<data-logic-gate type="AND"></data-logic-gate>

---

## 🚦 Bramka OR (Alternatywa / Suma Logiczna)

Matematyczny zapis: `Z = A + B` lub `Z = A ∨ B`.

Bramka **OR (Lub)** jest niezwykle łagodna dla napięcia. Aby oddać `1` na wyjściu zadowoli się *Ktokolwiek*. 
Aby prąd przepłynął wystarczy jej **chociaż Jedno** uruchomione wejście. Naturalnie, puści prąd jeśli włączysz oba, ale wystarczy jedna jedynka w oceanie zer by obudzić tę bramkę do działania (jak połączenie **równoległe** obu włączników żarówek w dwóch osobnych rurach od tej samej rzeki).

<data-logic-gate type="OR"></data-logic-gate>

---

## ⛔ Bramka NOT (Negator / Inwerter)

Matematyczny zapis: `Z = ~A` lub `Z = A'` lub nadkreślenie litery A.

Bramka **NOT (Nie)** nie służy do "łączenia" warunków w parę. Ona po prostu, klasycznym, rzemieślniczym sposobem odbija dany argument na jego przeciwieństwo. Odwraca on logikę dodatnią na ujemną.
* Wejście 1 generuje na Wyjściu 0.
* Wejście 0 pobudza bramkę - bierze zasilanie od strony płyty głównej (VCC) i wysyła na wyjście 1!

W elektronice (schematach płytek PCB) negację oznacza się charakterystycznym małym "kółeczkiem" wpinanym do układu. Czasem dodaje się kółeczka od razu na wyjściu innych bramek by zrobić inwerter.

<data-logic-gate type="NOT"></data-logic-gate>

---

## Weryfikacja Umiejętności

Czas sprawdzić swoją logikę przed przejściem do trudniejszych obwodów.

<data-gate>
  <data-quiz>
    <question>Kiedy bramka AND wypuści na swoje wyjście wartość logiczną False (0)?</question>
    <options>
      <option correct>Zawsze, kiedy chociaż na jednym z jej wejść pojawi się 0 (brak napięcia).</option>
      <option>Tylko i wyłącznie wtedy, gdy stan obu wejść będzie wynosił 0 (brak napięcia na A i B).</option>
      <option>Kiedy na jedno wejście podamy 1, a na drugie podamy 1.</option>
      <option>Nigdy. Bramka AND zawsze wymusza Prawdę (1), by przepuścić prąd przez procesor.</option>
    </options>
  </data-quiz>

  <div data-hint="error">
    Pamiętaj zasadę połączenia szeregowego. Jak płynie woda jeśli zamkniesz rurę w połowie drogi, i tak samo - co jeśli zamkniesz ją na początku? Bramka AND jest bezlitosna, dławi prąd za każdym razem, gdy spotka 0.
  </div>
  <div data-hint="success">
    Fenomenalnie! Rozumienie zachowania bramek to podstawa informatyki i matematyki pod kątem algorytmów (if A and B and C and D).
  </div>
  <br>

  Czysta wiedza architektoniczna. Znając zachowanie tych trzech podzespołów powoli otwiera ci się brama (sic!) do zrozumienia logiki programistycznej. 
  Poczuj moc jedynek i zer w przechodzeniu na ich połączenia w Lekcji 3: bramki Złożone i XOR!
</data-gate>

