# Bity, bajty i realne prędkości

Wiesz już, czym jest bit oraz dlaczego informatyka bazuje na potęgach dwójki. Teraz zobaczysz, jak bity są łączone w większe jednostki. Spotykasz je codziennie w telefonie, na platformach z grami czy w ofertach dostawców internetu.

---

## 📦 Pakiet w proporcji jeden do ośmiu

Pojedyncze bity to elementarne impulsy. Przesyłanie ich pojedynczo w systemach komputerowych byłoby nieefektywne. Z tego powodu wprowadzono standard: <strong>jeden **bajt** (oznaczany jako *B*) zawsze składa się z **ośmiu bitów** (oznaczanych jako *b*)</strong>.

Można to porównać do opakowania jajek. Pojedyncze jajko to *bit*. Sklep sprzedaje je jednak w całych wytłaczankach, czyli *bajtach*.
![Przedstawienie bajtu jako opakowania jajek reprezentujących 5 bitów](/public/courses/binarne-fundamenty-it/Images/jajka.jpg)

> [!IMPORTANT]
> Zapamiętaj różnicę w oznaczeniach:
> - **b** (mała litera) oznacza bit. Stosuje się go przy określaniu przepustowości sieci (np. światłowodu).
> - **B** (wielka litera) oznacza bajt. Służy do określania pojemności dysków oraz pamięci RAM.

---

## 💾 Zagadka brakującej pojemności dysku

Kupujesz pendrive o pojemności $64$ GB, a Twój telefon lub komputer po podłączeniu pokazuje jedynie $57.2$ GB wolnego miejsca? Nie jest to wada fabryczna. Wynika to z zastosowania dwóch różnych miar przez producentów sprzętu oraz systemy operacyjne.

![Pendrive SanDisk 64 GB i okna właściwości w Windows 11](/public/courses/binarne-fundamenty-it/Images/sandisk-64GB.png)

---

### ⚖️ Różnica w definicjach przedrostków

Problem tkwi w tym, jak definiujemy przedrostki kilo, mega i giga:

1. **System dziesiętny (Norma SI — używany przez producentów sprzętu)**:
   Bazą jest liczba $10$. Przedrostki rosną o potęgi tysiąca ($10^3$):
   - $1\text{ KB}$ (kilobajt) = $1000\text{ bajtów}$ ($10^3$)
   - $1\text{ MB}$ (megabajt) = $1\ 000\ 000\text{ bajtów}$ ($10^6$)
   - $1\text{ GB}$ (gigabajt) = $1\ 000\ 000\ 000\text{ bajtów}$ ($10^9$)

2. **System dwójkowy (używany przez architekturę komputerów)**:
   Bazą jest liczba $2$. Przedrostki rosną o potęgi liczby $1024$ ($2^{10}$):
   - $1\text{ KiB}$ (kibibajt) = $1024\text{ bajty}$ ($2^{10}$)
   - $1\text{ MiB}$ (mebibajt) = $1024\text{ KiB} = 1\ 048\ 576\text{ bajtów}$ ($2^{20}$)
   - $1\text{ GiB}$ (gibibajt) = $1024\text{ MiB} = 1\ 073\ 741\ 824\text{ bajtów}$ ($2^{30}$)

---

### 🧮 Matematyczny dowód na „brakujące” miejsce

W teorii producent nośnika podaje pojemność w standardzie dziesiętnym:
$$\text{Pojemność nominalna} = 64\text{ GB} = 64\ 000\ 000\ 000\text{ bajtów}$$

Gdyby system operacyjny otrzymał dokładnie tyle bajtów, po podzieleniu przez $1024^3$ (czyli zamianie na gibibajty) pokazałby:
$$\frac{64\ 000\ 000\ 000\text{ B}}{1024 \times 1024 \times 1024} \approx 59.6\text{ GiB}$$

Dlaczego więc na zrzucie ekranu powyżej system Windows wyświetla pojemność **$57.2$ GB**?

Na tę różnicę składają się **dwa czynniki**:
1. **Narzut sprzętowo-systemowy**: Producenci podają pojemność surowych kości pamięci. Po sformatowaniu nośnika część przestrzeni jest rezerwowana na tablicę partycji, strukturę systemu plików (np. exFAT) oraz kontroler pamięci flash (zarządzanie uszkodzonymi blokami). W efekcie realna pojemność użytkowa tego pendrive'a to dokładnie **`61 525 196 800` bajtów** (czyli ok. $61.5$ GB).
2. **Konwersja na jednostki dwójkowe**: Windows bierze tę realną pojemność w bajtach i dzieli ją przez $1024^3$:

$$\textcolor{#ff0001}{\text{Pojemność w GiB}} = \frac{\textcolor{#ff0002}{61\ 525\ 196\ 800\text{ B}}}{\textcolor{#ff0003}{1024 \times 1024 \times 1024}} = \textcolor{#ff0001}{57.2998046875\text{ GiB}} \approx \textcolor{#ff0004}{57.2\text{ GiB}}$$

Ponieważ Windows błędnie podpisuje tę wartość skrótem „GB” zamiast „GiB”, użytkownik widzi komunikat o pojemności $57.2$ GB.

---

### ⚖️ Różnice między systemami operacyjnymi

Systemy operacyjne prezentują te informacje w różny sposób, co widać na zrzutach ekranu tego samego pendrive'a:

- **Windows**: oblicza pojemność dwójkowo (dzieląc przez $1024^3$), co daje $57.2$ GiB, ale na ekranie błędnie podpisuje tę wartość jednostką „GB” (sugerując system dziesiętny).
- **macOS** oraz **GNU/Linux (graficzne menedżery plików, np. w Ubuntu)**: obliczają pojemność dziesiętnie (dzieląc przez $1000^3$). Dlatego w systemie Ubuntu ten sam pendrive jest widoczny w narzędziach jako **$62$ GB**.
- **Narzędzia konsolowe Linux**: stosują skrócony zapis do jednej litery „G”, ale ich baza obliczeń zależy od polecenia. Przykładowo, polecenie `df -H` (dziesiętne) wyświetla rozmiar partycji jako **$62\text{ G}$**, podczas gdy polecenie `lsblk` (dwójkowe) pokazuje **$57.3\text{ G}$**.


![Pendrive SanDisk 64 GB w Ubuntu 26.04](/public/courses/binarne-fundamenty-it/Images/sanddisk-64GB-ubuntu26.04.png)

---

<data-gate>
  <data-quiz>
    <question>
Dlaczego system operacyjny Windows przelicza kilobajty jako 1024 bajty, zamiast przyjąć równe 1000?
    </question>
    <options>
      <option correct>Ponieważ 1024 to $2^{10}$, co pozwala procesorowi na bezpośrednie i szybkie adresowanie pamięci bez skomplikowanych konwersji.</option>
      <option>To błąd z przeszłości, którego nikt nie chciał naprawić.</option>
      <option>Producentom zależy, abyśmy widzieli mniejsze liczby.</option>
    </options>
<div data-hint="error">
  Weź pod uwagę, jak działa procesor. Czy dla komputera naturalniejsze są okrągłe wartości dziesiętne, czy potęgi dwójki?
</div>
  </data-quiz>
</data-gate>

---

## ⚖️ Megabity a megabajty: marketing czy scam?

Dostawcy internetu (<strong>**ISP**</strong>, od ang. *Internet Service Provider*) podają prędkości w megabitach na sekundę ($Mb/s$), opierając się na systemie dziesiętnym ($1\text{ Mb} = 10^6\text{ bitów}$). Na plakacie reklamowym wartość $1000\text{ Mb/s}$ wygląda znacznie lepiej niż $125\text{ MB/s}$.

Z kolei większość aplikacji pobierających pliki (np. Steam czy przeglądarka) wyświetla prędkość pobierania w megabajtach na sekundę ($MB/s$).

---

### 📡 Wyjątek: prędkości przesyłu danych

Warto wiedzieć, że w przypadku **prędkości przesyłu danych** (przepustowość sieci, magistrale PCIe, standardy SATA) przedrostki zawsze oznaczają wartości **dziesiętne**.
Łącze o prędkości $1\text{ Gb/s}$ (gigabit na sekundę) przesyła dokładnie $1\ 000\ 000\ 000$ bitów na sekundę, a nie $1\ 073\ 741\ 824$ bity. Wynika to z faktu, że transmisja sieciowa opiera się na ciągłym sygnale fizycznym w czasie, a nie na adresowaniu komórek pamięci.

---

### 🧮 Wzór na czas pobierania

Aby dowiedzieć się, ile potrwa pobieranie pliku, użyj następującego wzoru:

$$\textcolor{#ff0001}{\text{Czas (s)}} = \frac{\textcolor{#ff0002}{\text{Rozmiar pliku (MB)}}}{\textcolor{#ff0003}{\text{Prędkość pobierania (MB/s)}}}$$

---

### 🧰 Konwersja jednostek prędkości (uproszczona)

W podstawowych wyliczeniach przyjmujemy prostą proporcję $1\text{ B} = 8\text{ b}$. Aby przeliczyć dziesiętną prędkość łącza ($Mb/s$) na megabajty na sekundę ($MB/s$), dzielimy ją przez $8$:

$$\textcolor{#ff0003}{\text{Prędkość (MB/s)}} = \frac{\textcolor{#ff0004}{\text{Prędkość (Mb/s)}}}{8}$$

I odwrotnie: aby zamienić megabajty na megabity, mnożymy wartość przez $8$:

$$\textcolor{#ff0004}{\text{Prędkość (Mb/s)}} = \textcolor{#ff0003}{\text{Prędkość (MB/s)}} \times 8$$

> [!TIP]
> **Gdzie tkwi haczyk w rzeczywistości?**
> Powyższy wzór zakłada uproszczone przeliczenie dziesiętne ($1000\text{ Mb/s} \div 8 = 125\text{ MB/s}$). Jednak systemy operacyjne i aplikacje (np. Steam) obliczają rozmiar pobieranych plików dwójkowo (czyli w mebibajtach na sekundę, $MiB/s$).
> Z tego powodu łącze $1000\text{ Mb/s}$ wyświetli w aplikacji maksymalną prędkość około $119.2\text{ MB/s}$ (czyli $125\ 000\ 000\text{ B/s} \div 1024^2$), a nie pełne $125\text{ MB/s}$.

 Czas na praktykę w laboratorium transferu danych. Twoim zadaniem jest obliczenie czasu pobierania pliku przy danej przepustowości łącza. Wykorzystaj powyższe uproszczone wzory i uzupełnij brakujące pola w poniższym ćwiczeniu:

---

<data-gate>
  <data-transfer-speed></data-transfer-speed>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Jeden bajt ($1\text{ B}$) składa się z $8$ bitów ($8\text{ b}$). Pamiętaj o wielkości liter w oznaczeniach.
- Prędkość pobierania w aplikacjach podawana jest w megabajtach na sekundę ($MB/s$), podczas gdy dostawcy internetu reklamują prędkość w megabitach ($Mb/s$).
- Różnica w wolnej przestrzeni (np. nominalne $64\text{ GB}$ na pendrive vs $57.2\text{ GB}$ widoczne w Windows) wynika z narzutu systemu plików oraz różnicy między miarą dziesiętną ($1\text{ KB} = 1000\text{ B}$) a dwójkową ($1\text{ KiB} = 1024\text{ B}$).
