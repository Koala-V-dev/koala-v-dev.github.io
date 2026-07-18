# Bity, Bajty i Realne Prędkości

Wiesz już, co to jest bit (najmniejszy impuls) i dlaczego informatyka kocha potęgi dwójki. Teraz nauczymy się, jak te bity są pakowane w jednostki, które widzisz na co dzień w smartfonie, na Steamie czy w reklamach internetu.

## 📦 Pakiet w proporcji $1$:$8$

Bity to luźne impulsy. Przesyłanie ich pojedynczo byłoby chaosem. Dlatego informatycy umówili się na standard:  
**_$1$ Bajt_ (_B_) zawsze składa się z _$8$ bitów_ (_b_)**.

To jak pudełko jajek. Możesz mieć $1$ jajko (_bit_), ale sklep (system) sprzedaje i liczy je w całych pudełkach (_Bajtach_).

---

> [!IMPORTANT]
> Zapamiętaj różnicę w zapisie:
> - **b** (małe): bit -> impuls (sieć/światłowód)
> - **B** (duże): Bajt -> waga (dysk/pamięć RAM)

## 📡 Scam czy Matematyka? (Analiza ISP)

Dostawcy internetu (**_ISP_** - *Internet Service Provider*) uwielbiają podawać prędkości w **Mega-bitach** ($Mb/s$). Dlaczego?  
Bo liczba $1000$ $Mb/s$ wygląda $8$ razy potężniej na billboardzie niż $125$ $MB/s$.

Z kolei programy takie jak $Steam$, przeglądarka czy $qBittorrent$, pokazują prędkość w **Mega-Bajtach** ($MB/s$), by zobrazować Ci jak szybko plik "puchnie" na Twoim dysku.

### Wzór na czas oczekiwania do pobrania

Aby dowiedzieć się, jak szybko realnie ściągniesz grę, zawsze wykonaj operację dzielenia:  

_**$$\text{Czas (s)} = \frac{\text{Rozmiar pliku (MB)}}{\text{Prędkość pobierania (MB/s)}}$$**_


### Wzór na prędkość pobierania

Jeśli masz już znaną prędkość pobierania, możesz obliczyć czas oczekiwania do pobrania:  

**_$$\left(\text{Prędkość (MB/s)} = \frac{\text{Rozmiar pliku (MB)}}{\text{Czas (s)}}\right) \div 8 = \text{Prędkość (Mb/s)}$$_**

---

Do ręcznego przeliczania wielkości polegamy na proporcji $1:8$ i operacji dzielenia lub mnożenia, lecz w głowie bywa to uciążliwe.  

Właśnie dlatego informatycy automatyzują proces. Zamiast liczyć ręcznie, wypróbuj poniższy **Symulator ISP**!

<data-transfer-speed></data-transfer-speed>

<data-gate></data-gate>

## 💾 Zagadka Brakującego Miejsca

Kupiłeś kartę pamięci 64 GB, a telefon pokazał 59.6 GB? To wynika z konfliktu systemów:

1. **Ludzki (Producenci - Norma SI)**: Liczą $1 KB$ (Kilobajt) jako $1000$ B. ($1000 = 10^3$)
2. **Binarny (Systemy np. Windows)**: Liczą $1 KB$ jako $1024$ B. ($1024 = 2^{10}$)

Poprawną, współczesną nazwą dla $1024$ B w standardzie IT i systemach takich jak Linux jest **Kibibajt (KiB)**. Jednakże producenci sprzętu trzymają się przedrostka "Kilo" dla $1000$, a Windows ze względów historycznych używa u siebie "KB" lecz realnie pokazując wartość "KiB".

Przy większych jednostkach (GB) ta różnica narasta do kilku procent. To nie błąd dysku – to po prostu inna "miarka".

<data-gate>
  <data-quiz>
    <question>
Dlaczego system operacyjny liczy kilo-bajty jako 1024 bajty, a nie równe 1000?
    </question>
    <options>
      <option correct>Ponieważ 1024 to $2^{10}$, co pozwala procesorowi na bezpośrednie i szybkie adresowanie pamięci bez skomplikowanych konwersji.</option>
      <option>To błąd z przeszłości, którego nikt nie chciał naprawić.</option>
      <option>Producentom zależy, abyśmy widzieli mniejsze liczby.</option>
    </options>

<div data-hint="error">
  Pamiętaj o "gloryfikacji dwójki" z poprzedniej lekcji. Czy procesorowi łatwiej operować na okrągłych dziesiątkach, czy na potęgach dwóch?
</div>
  </data-quiz>
</data-gate>

Teraz, gdy wiesz już, jak ważyć dane i mierzyć ich prędkość, wejdziemy o poziom wyżej. Zobaczysz, jak informatycy skracają sobie te długie ciągi zer i jedynek za pomocą systemów **Octal** i **Hex**.
