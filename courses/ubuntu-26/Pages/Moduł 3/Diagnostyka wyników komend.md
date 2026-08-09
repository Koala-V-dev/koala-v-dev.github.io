# Diagnostyka wyników komend

Na egzaminie i w codziennej pracy z systemem Ubuntu nie wygrywa lista komend zapamiętana na pamięć. Liczy się to, czy potrafisz precyzyjnie **wyciągnąć potrzebne informacje** z wyniku polecenia.

Komendy diagnostyczne potrafią zwrócić kilkadziesiąt lub kilkaset linii tekstu. Czasem potrzebujesz wyłącznie końcówki raportu, innym razem pojedynczej frazy lub zapisania dających się zweryfikować plików stanowiących dowód wykonania zadania.

## 🧪 Stacja treningowa: wynik, ostrzeżenie i raport

Pod okiem tutora przejdziesz przez pełny cykl diagnostyczny:

```text
niepełny wynik z ostrzeżeniem -> pełny wynik w less -> zapis do pliku -> tail -> grep -> raport
```

Przeglądarkę `less` zamykasz klawiszem `q`. W widoku `less` działają klawisze nawigacyjne (`PageUp`, `PageDown`, strzałki). Po wyjściu powracasz do czystego prompta.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m3-01-diagnostyka-wynikow.md"></data-terminal-tutor>
</data-gate>

## 🧰 Zestaw komend po tutorze

Ta tabela stanowi podręczne zestawienie poleceń i operatorów używanych do przechwytywania i filtrowania wyników.

| Komenda               | Do czego służy                                                                               | Przykład                              |
| :-------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------ |
| `lshw`                | Wyświetla opis sprzętu (zwykły użytkownik może otrzymać niepełny wynik).                     | `lshw`                                |
| `sudo lshw`           | Wyświetla pełny opis konfiguracyjny sprzętu z uprawnieniami administratora.                  | `sudo lshw`                           |
| `less`                | Otwiera długi strumień tekstu w interaktywnej przeglądarce.                                  | <code>sudo lshw &#124; less</code>    |
| `tail -n LICZBA PLIK` | Wyświetla wybraną liczbę ostatnich linii pliku.                                              | `tail -n 12 adminLSHW`                |
| `grep FRAZA`          | Filtruje strumień i pozostawia wyłącznie linie zawierające wskazaną frazę.                   | `grep product adminLSHW`              |
| <code>&#124;</code>   | Potok: przekazuje wyjście jednej komendy bezpośrednio na wejście drugiej.                    | <code>sudo lshw &#124; less</code>    |
| `>`                   | Przekierowanie: zapisuje wynik komendy do pliku (tworzy nowy plik lub nadpisuje istniejący). | `lshw > LSHW`                         |
| `>>`                  | Dopisywanie: dołącza wynik komendy na końcu istniejącego pliku.                              | `df -h >> dyski.txt`                  |
| `lsblk -f`            | Wyświetla dyski, partycje, systemy plików oraz punkty montowania.                            | `lsblk -f`                            |
| `df -h`               | Wyświetla zajętość zamontowanych systemów plików w czytelnych jednostkach.                   | `df -h`                               |
| `free -h`             | Wyświetla stan pamięci RAM oraz przestrzeni wymiany swap.                                    | `free -h`                             |
| `ps -ef`              | Wyświetla pełną listę aktywnych procesów w formacie gotowym do filtrowania.                  | <code>ps -ef &#124; grep gnome</code> |
| `top`                 | Wyświetla dynamiczną migawkę obciążenia systemu i procesów.                                  | `top`                                 |
| `htop`                | Wyświetla zaawansowaną, czytelną migawkę procesów i wykorzystania zasobów.                   | `htop`                                |

## 🔒 <code>sudo</code> nie jest dekoracją

Gdy narzędzie `lshw` zgłasza w terminalu komunikat:

```text
WARNING: output may be incomplete or inaccurate, you should run this program as super-user.
```

Otrzymujesz jasny sygnał: polecenie wykonało się, ale część danych dotyczących kontrolerów i magistral sprzętowych została zablokowana przez brak uprawnień `root`.

Porównanie wyjścia obu poleceń wyraźnie to obrazuje:

```bash
lshw > LSHW
sudo lshw > adminLSHW
```

Pierwszy plik zawiera zredukowany raport z nagłówkowym ostrzeżeniem, natomiast drugi tworzy kompletny audyt sprzętowy komputera.

## 🔀 Potok i zapis to dwa różne mechanizmy

Potok `|` **nie zapisuje pliku na dysku**. Jego jedyną funkcją jest przelanie wyniku jednej komendy na wejście kolejnego narzędzia:

```bash
sudo lshw | less
```

Powyższe polecenie przekazuje cały długi strumień tekstu wygenerowany przez `sudo lshw` do przeglądarki `less`.

Znak przekierowania `>` służy do tworzenia i nadpisywania pliku:

```bash
grep product adminLSHW > modele.txt
```

W tym przypadku `grep` wybiera wyciąg z pliku `adminLSHW`, a operator `>` tworzy plik `modele.txt` zawierający wyłącznie te wyfiltrowane linie.

Operator `>>` dopisuje dane na końcu wskazanego pliku bez niszczenia jego dotychczasowej zawartości:

```bash
df -h >> dyski.txt
```

Jest to niezastąpiony mechanizm podczas budowania złożonych raportów zbiorczych z kilku komend.

## 👁️ Kiedy używać <code>less</code>, <code>tail</code> oraz <code>grep</code>

- `less` wybierasz wtedy, gdy wynik jest zbyt długi i chcesz go na spokojnie przejrzeć przewijając go w oknie terminala.
- `tail` stosujesz, gdy interesuje Cię wyłącznie końcówka raportu lub logu systemowego.
- `grep` wykorzystujesz do zadania pytania: „wyciągnij tylko te linie, które zawierają konkretny wzorzec”.

## 📊 Wyciąganie kluczowych danych o maszynie

Podczas diagnostyki i audytu stanowiska najważniejsze są precyzyjne dane:

- model komputera lub hybryda środowiska wirtualnego,
- specyfikacja procesora oraz łączna pojemność RAM,
- struktura dysków, partycji i punktów montowania,
- ilość wolnego miejsca na partycji głównej `/`,
- identyfikacja procesu odpowiedzialnego za konkretne działanie systemowe.

Do zebrania tych informacji wystarczy opanowanie poleceń `lshw`, `lsblk`, `df`, `free`, `ps`, `grep` oraz operacji na strumieniach `|`, `>` i `>>`.

## 🚀 Misja: raport diagnostyczny stanowiska

W tej misji utworzysz dedykowany katalog dla raportu i zapiszesz w nim zweryfikowane wyniki poleceń diagnostycznych. Twoim zadaniem jest samodzielny dobór narzędzi w celu przygotowania czytelnego zestawienia stanu stanowiska.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m3-01-raport-diagnostyczny.md"></data-terminal-mission>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Wywołanie `lshw` bez `sudo` działa, ale zwraca ostrzeżenie i zredukowaną liczbę danych o magistralach.
- Wywołanie `sudo lshw` generuje pełny i dokładny audyt sprzętowy.
- Przeglądarka `less` służy do przeglądania długich strumieni tekstowych, a klawisz `q` umożliwia powrót do powłoki.
- Narzędzie `tail` natychmiast wyświetla końcowe linie wskazanego pliku.
- Polecenie `grep` filtruje strumień danych i wyciąga wyłącznie linie pasujące do podanego wzorca.
- Operator potoku `|` łączy komendy w sekwencje, przekazując wynik pierwszej do kolejnej.
- Operator `>` nadpisuje lub tworzy plik, natomiast `>>` dopisuje dane na jego końcu.
- Profesjonalny raport diagnostyczny powinien zawierać zwięzłe i sprawdzalne dane o sprzęcie, dyskach, pamięci oraz procesach.
