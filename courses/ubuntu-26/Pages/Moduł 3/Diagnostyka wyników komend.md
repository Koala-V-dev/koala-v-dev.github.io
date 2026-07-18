# Diagnostyka wyników komend

Na egzaminie i w pracy z Ubuntu nie wygrywa lista komend zapamiętana na sucho. Liczy się to, czy umiesz wyciągnąć konkret z wyniku polecenia.

Komendy diagnostyczne potrafią oddać kilkadziesiąt linii. Czasem potrzebujesz tylko końcówki. Czasem jednej frazy. Czasem pliku z wynikiem, bo masz pokazać dowód wykonania zadania.

W tej lekcji pracujesz na danych o maszynie:

- sprzęt i urządzenia,
- dyski i systemy plików,
- pamięć,
- procesy.

Nie diagnozujesz jeszcze awarii usług. Najpierw uczysz się obsługi wyniku.

## Tutor: wynik, ostrzeżenie i raport

Tutor prowadzi przez typowy przebieg:

```text
niepełny wynik z warningiem -> pełny wynik w less -> zapis do pliku -> tail -> grep -> raport
```

`lshw` bez `sudo` działa, ale ostrzega, że wynik może być niepełny. To ważny sygnał diagnostyczny, a nie ozdobnik.

`less` zamykasz klawiszem `q`. W prawdziwym terminalu w widoku `less` działają strzałki, PageUp i PageDown. Po wyjściu wracasz do prompta.

<data-gate>
<data-terminal-tutor src="/public/courses/ubuntu-26/Scenarios/terminal-tutor/m3-01-diagnostyka-wynikow.md"></data-terminal-tutor>
</data-gate>

## Zestaw komend po tutorze

| Komenda | Do czego służy | Przykład |
| :--- | :--- | :--- |
| `lshw` | pokazuje opis sprzętu, ale jako zwykły użytkownik może dać niepełny wynik | `lshw` |
| `sudo lshw` | pokazuje pełniejszy opis sprzętu | `sudo lshw` |
| `less` | otwiera długi wynik do przewijania | <code>sudo lshw &#124; less</code> |
| `tail -n LICZBA PLIK` | pokazuje końcówkę pliku | `tail -n 12 adminLSHW` |
| `grep FRAZA` | zostawia tylko linie z frazą | `grep product adminLSHW` |
| <code>&#124;</code> | przekazuje wynik jednej komendy do drugiej | <code>sudo lshw &#124; less</code> |
| `>` | zapisuje wynik do pliku od nowa | `lshw > LSHW` |
| `>>` | dopisuje wynik na końcu pliku | `df -h >> dyski.txt` |
| `lsblk -f` | pokazuje dyski, partycje, systemy plików i punkty montowania | `lsblk -f` |
| `df -h` | pokazuje zajętość zamontowanych systemów plików | `df -h` |
| `free -h` | pokazuje RAM i swap | `free -h` |
| `ps -ef` | pokazuje procesy w formacie do filtrowania | <code>ps -ef &#124; grep gnome</code> |
| `top` | pokazuje migawkę obciążenia systemu | `top` |
| `htop` | pokazuje czytelniejszą migawkę procesów | `htop` |

## `sudo` nie jest dekoracją

Jeżeli `lshw` mówi:

```text
WARNING: output may be incomplete or inaccurate, you should run this program as super-user.
```

to masz konkretną informację: komenda działa, ale część danych może być ukryta przed zwykłym użytkownikiem.

Wtedy porównujesz:

```bash
lshw > LSHW
sudo lshw > adminLSHW
```

Pierwszy plik pokazuje wynik zwykłego użytkownika razem z ostrzeżeniem. Drugi plik pokazuje pełniejszy raport.

## Potok i zapis to dwie różne rzeczy

Potok `|` nie zapisuje pliku. Potok przekazuje wynik dalej.

```bash
sudo lshw | less
```

Ta komenda bierze długi wynik `sudo lshw` i przekazuje go do `less`.

Znak `>` zapisuje wynik do pliku:

```bash
grep product adminLSHW > modele.txt
```

Tu `grep` filtruje zapisany raport, a `>` zapisuje przefiltrowane linie do pliku `modele.txt`.

`>>` działa inaczej: dopisuje wynik na końcu istniejącego pliku. Przydaje się, gdy jeden raport składasz z kilku komend.

## Kiedy `less`, kiedy `tail`, kiedy `grep`

`less` jest do długiego wyniku, który chcesz obejrzeć bez zalania prompta.

`tail` jest do końcówki pliku. Przy raporcie sprzętowym pozwala szybko sprawdzić ostatnie sekcje bez przewijania całości.

`grep` jest do pytania: "pokaż tylko linie z tym słowem". Nie szukasz wzrokiem po całym ekranie, tylko każesz terminalowi wyciąć niepotrzebne linie.

## Co warto umieć wyciągnąć o maszynie

Na poziomie podstawowym sens mają konkretne dane:

- model maszyny albo środowisko wirtualne,
- procesor i ilość pamięci,
- dyski, partycje i punkty montowania,
- wolne miejsce,
- proces, który pasuje do sprawdzanego objawu.

Do tego nie potrzebujesz od razu narzędzi serwerowych. Wystarczą `lshw`, `lsblk`, `df`, `free`, `ps`, `top`, `htop`, `less`, `tail`, `grep` i zapis do pliku.

## Misja: raport diagnostyczny stanowiska

W misji tworzysz katalog raportu i zapisujesz w nim wyniki komend. To nie jest przepisywanie tutora. Masz dobrać te same narzędzia do innego celu: zostawić sprawdzalne pliki z informacją o stanowisku.

<data-gate>
<data-terminal-mission src="/public/courses/ubuntu-26/Scenarios/terminal-missions/m3-01-raport-diagnostyczny.md"></data-terminal-mission>
</data-gate>

---

### Co masz wynieść z tej lekcji:

- `lshw` bez `sudo` działa, ale może dać niepełny wynik i ostrzeżenie.
- `sudo lshw` daje pełniejszy raport sprzętu.
- `less` służy do przewijania długiego wyniku, a `q` wraca do prompta.
- `tail` szybko pokazuje końcówkę pliku.
- `grep` filtruje wynik po frazie.
- Potok `|` przekazuje wynik do kolejnej komendy.
- `>` zapisuje wynik od nowa, a `>>` dopisuje wynik do pliku.
- Raport diagnostyczny ma zawierać konkret: sprzęt, dyski, pamięć, miejsce i procesy.
