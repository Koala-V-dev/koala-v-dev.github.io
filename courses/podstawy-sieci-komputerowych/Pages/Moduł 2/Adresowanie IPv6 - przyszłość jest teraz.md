# Adresowanie IPv6 - przyszłość jest teraz

Dwa systemy zapisują adres inaczej:

```
2001:0DB8:0000:0000:0000:ff00:0042:8329
2001:db8::ff00:42:8329
```

Zwykłe porównanie tekstu uzna je za różne. Po rozwinięciu okazuje się, że to ten sam 128-bitowy adres.

W tej lekcji nauczysz się rozwijać, porównywać i zapisywać adres IPv6 w jednej postaci kanonicznej. Dzięki temu nie pomylisz zmiany zapisu ze zmianą urządzenia.

## 🧠 Najpierw policz brakujące grupy

Spójrz na adres:

```
2001:db8::ff00:42:8329
```

Po lewej stronie `::` są dwie grupy. Po prawej są trzy. Pełny adres musi mieć osiem grup po 16 bitów.

Zapisz, ile grup `0000` ukrywa `::`. Nie skracaj jeszcze innych elementów.

## 🧩 Rozwiń adres do ośmiu grup

Adres IPv6 ma 128 bitów. W podstawowym zapisie tekstowym dzielisz go na osiem grup po 16 bitów, zapisanych szesnastkowo.

```
8 grup × 16 bitów = 128 bitów
```

Podwójny dwukropek zastępuje jedną lub więcej pełnych grup zer. Może wystąpić tylko raz, bo przy dwóch takich skrótach nie dałoby się ustalić liczby zer w każdym miejscu.

Dla początkowego adresu brakuje trzech grup:

```
2 grupy zapisane + 3 grupy ukryte + 3 grupy zapisane = 8
```

Postać pełna:

```
2001:0db8:0000:0000:0000:ff00:0042:8329
```

Rozwijanie jest bezpiecznym pierwszym krokiem porównania. Nie musisz zgadywać, co ukrywa `::`.

## ✂️ Zbuduj zapis kanoniczny

RFC 4291 dopuszcza kilka poprawnych zapisów tego samego adresu. RFC 5952 wybiera jeden zalecany zapis kanoniczny, przydatny w logach, dokumentacji i porównaniach.

Wykonaj cztery działania w tej kolejności:

1. rozwiń adres do ośmiu grup;
2. usuń zera stojące na początku każdej grupy, ale pozostaw pojedyncze `0` dla grupy zerowej;
3. zastąp `::` najdłuższy ciąg co najmniej dwóch grup zerowych;
4. przy remisie skróć pierwszy ciąg i użyj małych liter `a` do `f`.

Przykład:

```
pełny:       2001:0DB8:0000:0000:0000:ff00:0042:8329
bez zer:     2001:db8:0:0:0:ff00:42:8329
kanoniczny:  2001:db8::ff00:42:8329
```

Nie używaj `::` do skrócenia pojedynczej grupy `0`. Taki zapis byłby dopuszczalny w elastycznym formacie RFC 4291, ale nie spełnia reguł kanonicznych RFC 5952.

## ⚖️ Odróżnij poprawny zapis od kanonicznego

Poniższe teksty opisują ten sam adres:

```
2001:db8:0:0:1:0:0:1
2001:0db8::1:0:0:1
2001:db8:0:0:1::1
2001:DB8:0000:0000:0001:0000:0000:0001
```

Nie każdy z nich jest zapisem kanonicznym. Po rozwinięciu wszystkich wersji otrzymujesz:

```
2001:0db8:0000:0000:0001:0000:0000:0001
```

Są dwa równie długie ciągi zer. Reguła remisu wybiera pierwszy:

```
2001:db8::1:0:0:1
```

W praktyce najpierw parsuj adres, a dopiero potem porównuj jego wartość. Proste porównanie nieznormalizowanych napisów może dać fałszywą różnicę.

## 🧭 Zachowaj prefiks i strefę

Zapis `/64` nie jest częścią 128-bitowej wartości adresu. Określa liczbę początkowych bitów tworzących prefiks sieci.

```
2001:db8:10:20::7/64
```

Po normalizacji adres nadal ma `/64`. Zmiana na `/48` nie zmienia bitów samego adresu, ale zmienia granicę sieci i może zmienić decyzje o sąsiedztwie oraz routingu.

Adres link-local ma zakres jednego łącza. Ten sam adres `fe80::1` może istnieć na dwóch różnych łączach tego samego hosta. W poleceniu lub interfejsie programu identyfikator strefy wskazuje właściwe łącze:

```
fe80::1%eth0
fe80::1%eth1
```

`%eth0` nie należy do 128-bitowego adresu. Jest kontekstem potrzebnym do rozróżnienia strefy. Nazwa lub numer interfejsu zależy od systemu.

## 🛠️ Punkt kontrolny: wybierz zapis kanoniczny

<data-gate>
  <data-quiz>
    <question>Który zapis jest kanoniczną postacią adresu `2001:0db8:0000:0000:0001:0000:0000:0001` według RFC 5952?</question>
    <options>
      <option>`2001:0db8::1:0:0:1`</option>
      <option correct>`2001:db8::1:0:0:1`</option>
      <option>`2001:db8:0:0:1::1`</option>
      <option>`2001:db8::1::1`</option>
    </options>
    <div data-hint="error">Usuń zera wiodące, znajdź oba ciągi dwóch grup zerowych i przy remisie skróć pierwszy. Podwójny dwukropek może wystąpić tylko raz.</div>
    <div data-hint="success">Oba ciągi zer mają tę samą długość, więc skracany jest pierwszy. Zera wiodące z `0db8` znikają, a litery pozostają małe.</div>
  </data-quiz>
</data-gate>

## 🧪 Uporządkuj wpisy z trzech systemów

Otrzymujesz wpisy:

```
A. 2001:0DB8:0000:0000:0000:0000:0000:0007/64
B. 2001:db8::7/64
C. 2001:db8:0:0::7/48
D. 2001:db8::0:7/64
E. 2001:db8::1::7/64
F. fe80:0000:0000:0000:0000:0000:0000:0001%eth0
G. fe80::1%eth1
```

Dla każdego wpisu przygotuj raport:

```
poprawny składniowo: tak albo nie
osiem rozwiniętych grup
zapis kanoniczny
prefiks lub strefa zachowane osobno
ten sam adres co: ...
dowód różnicy, jeśli adres jest inny
```

Kryteria ukończenia:

- nie porównujesz adresów przed ich rozwinięciem;
- nie mylisz poprawnej alternatywnej postaci z jedyną postacią kanoniczną;
- wykrywasz drugi znak `::` jako błąd składni;
- oddzielasz wartość adresu od długości prefiksu i identyfikatora strefy;
- nie łączysz dwóch adresów link-local z różnych interfejsów w jeden cel operacyjny.

Zmień prefiks wpisu B z `/64` na `/48`. Odpowiedz osobno na dwa pytania: czy zmieniła się 128-bitowa wartość adresu oraz czy konfiguracja sieciowa pozostała równoważna.

<details>
<summary>Sprawdź rozwiązanie po wykonaniu próby</summary>

A, B, C i D rozwijają się do `2001:0db8:0000:0000:0000:0000:0000:0007`. Ich kanoniczny adres to `2001:db8::7`. C ma jednak prefiks `/48`, podczas gdy pozostałe poprawne wpisy mają `/64`. Adres jest ten sam, lecz cała konfiguracja `adres/prefiks` nie jest równoważna.

E jest niepoprawny, ponieważ zawiera dwa wystąpienia `::`. Nie da się jednoznacznie ustalić, ile grup zer ukrywa każde z nich.

F i G mają tę samą 128-bitową wartość adresu `fe80::1`. Nie wskazują jednak tego samego celu operacyjnego: `%eth0` i `%eth1` wybierają różne strefy link-local.

Po zmianie B na `/48` jego 128 bitów nadal odpowiada `2001:db8::7`. Zmienia się granica prefiksu, więc konfiguracja sieciowa nie jest równoważna z wcześniejszym `2001:db8::7/64`.

</details>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Adres IPv6 ma osiem grup po 16 bitów.** `::` uzupełniasz tyloma grupami zer, aby łącznie było ich osiem.
- **Porównanie zaczynasz od rozwinięcia.** Różne napisy mogą opisywać tę samą 128-bitową wartość.
- **Zapis kanoniczny usuwa zera wiodące i wybiera najdłuższy ciąg zer.** Przy remisie skraca pierwszy ciąg i używa małych liter.
- **Prefiks nie jest częścią wartości adresu.** Zmiana `/64` na `/48` zachowuje adres, ale zmienia konfigurację sieciową.
- **Adres link-local potrzebuje kontekstu łącza.** Identyfikator po `%` rozróżnia strefę, a nie zmienia 128 bitów adresu.
