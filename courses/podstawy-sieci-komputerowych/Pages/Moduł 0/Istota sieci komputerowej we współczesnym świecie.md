# Istota sieci komputerowej we współczesnym świecie

Z kursu o fundamentach binarnych wiesz, jak komputer przetwarza bity w pamięci RAM i na szynach płyty głównej. Tam odległości liczy się w milimetrach, a sygnał taktowany jest wspólnym zegarem kwarcowym procesora.

Gdy wyprowadzasz bity poza obudowę komputera i przesyłasz je kablem na odległość kilkunastu metrów, stajesz przed trzema fizycznymi problemami:
1. <b>Brak wspólnego zegara:</b> Nadawca i odbiorca pracują na osobnych oscylatorach. Odbiornik musi wyznaczyć początek i koniec każdego bitu wyłącznie na podstawie zmian napięcia w przewodzie.
2. <b>Szum i zakłócenia:</b> W kablu nie ma idealnych zer i jedynek. Płynący prąd podlega tłumieniu, odbiciom na złączach i zakłóceniom elektromagnetycznym z otoczenia.
3. <b>Adresowanie w medium współdzielonym:</b> Jeśli do jednego toru podłączysz więcej niż dwie maszyny, odbiornik musi wiedzieć, które bity są przeznaczone dla niego, a które należy zignorować.

---

## 🧱 Cztery role w architekturze teleinformatycznej

Aby uporządkować przepływ danych, w teleinformatyce wprowadzono ścisły podział odpowiedzialności między cztery elementy:

| Rola w sieci               | Zadanie inżynieryjne                                                                     | Przykłady sprzętowe                                              | Identyfikator                            |
| :------------------------- | :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------- | :--------------------------------------- |
| **Host**                   | Tworzy, przetwarza i odbiera dane użytkownika. Posiada pełny stos sieciowy od L1 do L7.  | Serwer bazy danych, stacja robocza, laptop, kamera IP, smartfon. | Adres logiczny IP + port aplikacji       |
| **Przełącznik** (*Switch*) | Przekazuje ramki wewnątrz jednej sieci lokalnej (*LAN*) na podstawie adresów fizycznych. | Switch zarządzalny w szafie RACK, przełącznik biurkowy.          | Tablica adresów fizycznych MAC           |
| **Router**                 | Wyznacza trasę pakietów między różnymi, odseparowanymi sieciami logicznymi.              | Router brzegowy, brama domyślna, router szkieletowy ISP.         | Tablica routingu IP                      |
| **Medium transmisyjne**    | Fizyczny nośnik niosący uformowany sygnał od nadajnika do odbiornika.                    | Skrętka miedziana, włókno światłowodowe, fale radiowe.           | Zjawisko fizyczne (V / fotony / fala EM) |

> [!IMPORTANT]
> <b>Host</b> jest punktem startowym lub docelowym transmisji. 
> <b>Urządzenia pośredniczące</b> (przełączniki i routery) nie wytwarzają danych użytkownika. Ich zadaniem jest analiza nagłówków i bezzwłoczne przesłanie cudzego pakietu dalej.

> [!TIP]
> **V** - volt, czyli jednostka napięcia elektrycznego w układach prądu stałego i zmiennego.
> **EM** - elektromagnetyczne fale radiowe
> **EMI** - electromagnetic interference, czyli zakłócenia elektromagnetyczne 

---

## 🔀 Komutacja obwodów a komutacja pakietów

Dlaczego współczesne sieci komputerowe nie korzystają z infrastruktury tradycyjnej telefonii stacjonarnej?

Odpowiedź kryje się w różnicy między <b>ciągłym strumieniem głosu</b> a <b>skokowym ruchem generowanym przez programy komputerowe</b>. Przeanalizuj interaktywny schemat obu architektur:

<data-gate>
  <data-hotspot image="/courses/podstawy-sieci-komputerowych/Images/komutacja-obwodow-vs-pakietow.svg">
    <hotspot x="8" y="36" title="Host A w telefonii (Nadawca)">
W **komutacji obwodów** (*Circuit Switching*) przed przesłaniem pierwszego bajtu centrala telefoniczna musi zestawić fizyczny tor kablowy na całej trasie od nadawcy do odbiorcy. Ten odcinek przewodu zostaje zablokowany na wyłączność.
    </hotspot>
    <hotspot x="25" y="43" title="Przerwanie kabla (Pojedynczy punkt awarii)">
Zarezerwowana linia jest sztywna. Jeśli w trakcie trwania sesji nastąpi fizyczne uszkodzenie kabla (czerwony znak **_✕_** na schemacie), **_transmisja ulega natychmiastowemu zerwaniu_**. Żadna stacja nie może dynamicznie ominąć uszkodzenia, a niewykorzystane łącza sąsiadujące pozostają zablokowane.
    </hotspot>
    <hotspot x="66" y="30" title="Router 1 i zasada Store-and-Forward">
W **komutacji pakietów** (*Packet Switching*) dane są cięte na małe porcje: <b>P1, P2, P3</b>. Router 1 działa w trybie **Store-and-Forward**: odbiera cały pakiet do bufora pamięci RAM, weryfikuje sumę kontrolną CRC (czy bity nie uległy przekłamaniu) i dopiero wtedy wystawia go na łącze wyjściowe.
    </hotspot>
    <hotspot x="72" y="52" title="Router 3 i trasa alternatywna dla P3">
Pakiety P1 i P2 powędrowały górnym łączem przez Router 2. Gdy górny tor uległ przeciążeniu lub awarii, Router 1 natychmiast skierował pakiet <b>P3</b> trasą dolną przez **Router 3**. Sieć pakietowa jest odporna na awarie pojedynczych węzłów.
    </hotspot>
    <hotspot x="88" y="40" title="Host B (Odbiorca)">
Host B odbiera pakiety docierające różnymi ścieżkami, układa je w prawidłowej kolejności na podstawie numerów sekwencyjnych w nagłówku i rekonstruuje pierwotny plik lub zapytanie.
    </hotspot>
  </data-hotspot>
</data-gate>

### 📊 Porównanie parametrów transmisyjnych

<data-tabs>
  <tabs>
    <b>☎️ Komutacja obwodów (PSTN)</b>
    <b>🌐 Komutacja pakietów (IP / Ethernet)</b>
    <b>👾 Skutki w inżynierii sieci</b>
  </tabs>
  <div>

| Cecha systemu                 | Wartość techniczna w telefonii obwodowej                                                             |
| :---------------------------- | :--------------------------------------------------------------------------------------------------- |
| <b>Rezerwacja pasma</b>       | **_Stała na wyłączność_** na cały czas trwania połączenia.                                           |
| <b>Efektywność w ruchu PC</b> | **_Poniżej 1%_**. Komputer wysyła zapytanie w ułamku sekundy, a przez resztę czasu kabel stoi pusty. |
| <b>Reakcja na awarię toru</b> | **_Zerwanie sesji_**. Konieczność ponownego zestawiania całego połączenia od zera.                   |
| <b>Buforowanie w węzłach</b>  | **_Brak_**. Węzły to proste przełączniki mechaniczne lub elektryczne. Brak pamięci RAM na pakiety.   |

  </div>
  <div>

| Cecha systemu              | Wartość techniczna w sieci pakietowej                                                                                |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| <b>Wykorzystanie łącza</b> | **Statystyczne zwielokrotnienie**. Pakiety tysięcy stacji przeplatają się na jednym kablu.                           |
| <b>Odporność na awarie</b> | **Dynamiczny routing**. Pakiety automatycznie omijają uszkodzony węzeł zapasową ścieżką.                             |
| <b>Tryb pracy routera</b>  | **Store-and-Forward**. Buforowanie w RAM, weryfikacja sumy kontrolnej CRC i kolejkowanie.                            |
| <b>Obsługa przeciążeń</b>  | Pakiety czekają w kolejce bufora (*FIFO/QoS*). Przy przepełnieniu bufora router odrzuca nadmiar (**_Packet Drop_**). |

  </div>
  <div>

Dlaczego ta wiedza jest kluczowa w praktyce?
- <b>Pojawienie się opóźnień (Jitter):</b> Ponieważ pakiety mogą czekać w kolejkach routerów lub biec alternatywnymi trasami, czas dotarcia kolejnych porcji danych nie jest idealnie stały. Wymaga to stosowania buforów odtwarzania w transmisjach audio/wideo.
- <b>Ryzyko utraty pakietu:</b> W komutacji obwodów gwarantowane jest pasmo. W sieci pakietowej przy przeciążeniu portu switcha lub routera pakiety są bezpowrotnie upuszczane (**_Packet Drop_**), a za ich ewentualne ponowienie odpowiada protokół transportowy (*TCP*).

  </div>
</data-tabs>

---

## 📡 Zasada niezależności medium (Media Independence)

Jednym z najważniejszych założeń architektury sieciowej jest _**całkowita izolacja pakietu logicznego od nośnika fizycznego**_.

Spójrz na architekturę przedstawioną na poniższym schemacie:

![Zasada niezależności medium w transmisji IP](/public/courses/podstawy-sieci-komputerowych/Images/niezaleznosc-medium.svg)

### 📦 Jeden nienaruszony pakiet logiczny L3
W górnej części schematu widzisz logiczny pakiet wygenerowany przez system operacyjny. Posiada on:
- <b>Nagłówek IP:</b> zawiera unikalny 32-bitowy (*IPv4*) lub 128-bitowy (*IPv6*) adres źródłowy i docelowy.
- <b>Nagłówek warstwy czwartej (L4):</b> porty aplikacji (np. *TCP port 443* - *`HTTPS`* dla bezpiecznej strony WWW).
- <b>Dane użytkownika (Payload):</b> treść pliku, zapytanie bazy danych lub fragment obrazu.

Format tego pakietu jest **identyczny**, niezależnie od tego, jakim torem fizycznym zostanie przesłany.

### 🔌 Cztery typy medium transmisyjnego
W dolnej części schematu karta sieciowa (**NIC** - *Network Interface Card*) tłumaczy ten sam ciąg bitów na skrajnie różne zjawiska fizyczne:

1. **Miedź** (*Ethernet na skrętce Cat 5e/6*):  
   Bity są kodowane jako różnica poziomów napięć elektrycznych między skręconymi żyłami. Zasięg wynosi ściśle do $100\text{ m}$. Ograniczeniem jest tłumienie rezystancyjne miedzi oraz podatność na indukowanie **_zakłóceń elektromagnetycznych_** (*EMI*).
2. **Światłowód** (*włókno szklane SMF / MMF*):  
   Bity stają się impulsami fotonów emitowanymi przez diodę lub laser. Zasięg wynosi od $500\text{ m}$ (wielomodowy) do ponad $40\text{ km}$ (jednomodowy). Ponieważ szkło kwarcowe jest izolatorem, światłowód cechuje się **zerową podatnością na zakłócenia elektromagnetyczne** (*0 EMI*).
3. **Fale radiowe** (*Wi-Fi 2.4 / 5 / 6 GHz oraz 5G*):  
   Bity modulują amplitudę, częstotliwość i fazę fali elektromagnetycznej rozchodzącej się w powietrzu. Nośnik jest otwarty i współdzielony, a zasięg zależy od tłumienia ścian i przeszkód ($15 - 100\text{ m}$).
4. **Gołębie pocztowe** (*Oficjalny standard IETF RFC 1149*):  
   Pakiet zapisany w postaci heksadecymalnej zostaje wydrukowany na małym zwoju papieru i przyczepiony do nóżki ptaka (*IP over Avian Carriers*). W <time datetime="2001-04-28T20:00:00">2001</time> roku norweska grupa entuzjastów BLUG przeprowadziła udaną transmisję `RFC 1149`: wysłano 9 pakietów na dystansie 5 km, osiągając opóźnienie (RTT) rzędu $3000 - 6000\text{ sekund}$ przy utracie **_55% pakietów_**. Mimo absurdalności nośnika, **zasady protokołu IP zostały w 100% zachowane**.


---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Jak system operacyjny odbiera milion pakietów na sekundę (DMA i bufory)</span>
<span class="deep-dive-badge">KERNEL & HARDWARE</span>
</summary>
<div class="deep-dive-content">

Gdy do portu karty sieciowej dociera milion pakietów na sekundę, obsługa każdego z nich osobnym przerwaniem zablokowałaby procesor (*CPU*). Wszystkie współczesne systemy operacyjne (Linux, Windows, macOS/BSD) rozwiązują ten problem w ten sam sposób:

1. <b>Bezpośredni zapis do RAM (DMA):</b>  
   Po zamianie sygnału na bajty karta sieciowa używa kontrolera **DMA** (*Direct Memory Access*), aby zapisać odebraną ramkę bezpośrednio do pamięci RAM pod adresem z pierścieniowej tablicy deskryptorów (**RX Ring Buffer**), bez angażowania CPU.

2. <b>Odbiór paczkami (redukcja przerwań):</b>  
   Po zapisaniu paczki ramek karta zgłasza pojedyncze przerwanie, a sterownik odbiera z bufora całą partię danych naraz w trybie odpytywania (*polling*): w Linuksie odpowiada za to mechanizm **NAPI**, w Windows sterownik **NDIS** (DPC / *Interrupt Moderation*), a w macOS/BSD kolejka **netisr**. Chroni to procesor przed tzw. burzą przerwań (*Interrupt Storm*).

3. <b>Przesuwanie wskaźnika zamiast kopiowania bajtów:</b>  
   W pamięci jądra ramka otrzymuje lekki deskryptor (w Linuksie `struct sk_buff`, w Windows `NET_BUFFER`, a w macOS/BSD `mbuf`):
   ```c
   struct sk_buff {
       unsigned char *head;  // Początek zaalokowanego bufora pamięci
       unsigned char *data;  // Aktualny nagłówek przetwarzanej warstwy
       unsigned char *tail;  // Koniec właściwych danych
       unsigned char *end;   // Koniec bufora
   };
   ```
   Gdy pakiet przechodzi z warstwy 2 (L2) do warstwy 3 (L3) w stosie TCP/IP jądra, przesuwany jest tylko wskaźnik `data` o długość nagłówka Ethernetu (np. `skb_pull(skb, ETH_HLEN)` w Linuksie lub `NdisAdvanceNetBufferDataStart` w Windows). Zmiana samego adresu we wskaźniku kosztuje procesor jedną prostą operację, więc kolejne warstwy czytają wprost z bufora zapisanego wcześniej przez DMA, bez obciążania CPU kopiowaniem bajtów.

</div>
</details>

---

## 🔒 Weryfikacja: Role i mechanizmy transmisji

Dopasuj pojęcie lub zjawisko do jego roli w architekturze sieci:

<data-gate>
  <data-connection-matcher title="Role elementów w komunikacji sieciowej">
    <item left="Host" right="Tworzy lub odbiera dane, posiada własny adres IP i stos protokołów"></item>
    <item left="Router" right="Przekazuje pakiety między różnymi sieciami na podstawie tablicy routingu"></item>
    <item left="Komutacja pakietów" right="Dzieli dane na porcje i pozwala tysiącom stacji współdzielić jedno łącze"></item>
    <item left="Tryb Store-and-Forward" right="Router buforuje pakiet w RAM, weryfikuje sumę CRC i wysyła dalej"></item>
    <item left="Zasada niezależności medium" right="Ten sam pakiet IP może być kodowany jako prąd, światło lub fala radiowa"></item>
    <item left="Komutacja obwodów" right="Rezerwuje całą ścieżkę fizyczną na wyłączność, marnując pasmo w ruchu skokowym"></item>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Host jest źródłem lub celem transmisji, natomiast urządzenia pośredniczące (przełącznik L2, router L3) analizują nagłówki i kierują cudze dane do celu.
- Komutacja pakietów wyparła komutację obwodów, ponieważ ruch generowany przez komputery ma charakter skokowy, a podział na pakiety umożliwia statystyczne zwielokrotnienie pasma na wspólnym łączu.
- Routery działają w trybie Store-and-Forward: odbierają cały pakiet, sprawdzają integralność sumą kontrolną CRC i dopiero wtedy przekazują go najbliższym wolnym łączem.
- Zasada niezależności medium gwarantuje, że zmiana nośnika fizycznego (miedź, światłowód, fale radiowe) nie wymaga żadnych zmian w strukturze logicznego pakietu IP ani w aplikacji użytkownika.
