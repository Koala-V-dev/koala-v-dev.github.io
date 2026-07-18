# Przygotowanie ISO — Środowisko Rozruchowe

W pracy inżyniera systemowego zamiast tracić godziny na debugowanie ekstremalnie zużytego środowiska, często optymalnym wyborem jest dekompozycja i odbudowa od nowa — *tabula rasa* (czysta karta) 📖. 

Pierwszym krokiem jest utworzenie środowiska rozruchowego. 🥸

---

## 🛑 Skąd pobrać obraz systemu (ISO)?

<div class="cross-knowledge" id="iso-note">

> [!NOTE]
> **ISO** to rozszerzenie pliku, które pochodzi od standardu $\text{ISO }9660$ i opisuje sposób zapisu danych na nośnikach optycznych. W praktyce jest to plik, który zawiera obraz struktury płyt. Możesz go wypalić lub zamontować. 
> <hr>
> Jest to zamknięty w jednym pliku instalator, a gdy uruchomisz go w systemie, zostanie on zamontowany tak, jakby została włożona fizyczna płyta CD/DVD do napędu.
</div>

Najbezpieczniejszym z perspektywy oficjalnego źródła jest zawsze **witryna Microsoftu**, jednak w środowisku serwisowym doskonałą i powszechnie cenioną alternatywą są zweryfikowane polskie archiwa takie jak **`basewin.pl`** oraz **`winiso.pl`**. 

Serwisy te często udostępniają oryginalne obrazy z kanału *Unified Update Platform* (**UUP**) wzbogacone o zintegrowane łatki odblokowujące wymogi instalacyjne (tzw. obrazy `No-TPM` / `No-SecureBoot`).

---

### 🌐 Pobieranie od Microsoftu
W przypadku *Microsoftu*:
1. Otwórz stronę [Pobieranie oprogramowania Microsoft](https://www.microsoft.com/pl-pl/software-download/windows11).
2. Przewiń stronę do sekcji **Pobierz obraz dysku Windows 11 (ISO)** wybierz opcję z listy rozwijanej i kliknij pobierz. 
3. Po weryfikacji żądania pojawi się kolejna sekcja z wyborem języka. Wybierz język (Polski) i zatwierdź.
4. Po kolejnej weryfikacji będziesz mieć sekcję do pobrania pliku ISO.  
  *(Jeżeli chcesz aby ktoś pobrał plik i dasz mu link, to musi on kliknąć w link w ciągu $24$ godzin od jego wygenerowania, inaczej link wygaśnie.)*
5. Pobierzesz wersję $64$-bitową (Windows 11 nie występuje już na rynku w przestarzałej wersji $32$-bitowej).

---

### 📂 Alternatywne biblioteki (WinISO / BaseWin)
W przypadku [WinISO.pl](https://winiso.pl) lub [BaseWin.pl](https://basewin.pl):
- Musisz znaleźć interesującą cię wersję Windows 11 i pobrać.  
- (W przypadku BaseWin.pl pobierzesz archiwum `.rar`, więc musisz mieć zainstalowany [WinRAR](https://www.win-rar.com/start.html?&L=0).)

> [!TIP]
> Wymagany jest w miarę szybki internet. Niemodyfikowany obraz `.iso` zajmuje blisko $8\text{ GB}$. Uruchom pobieranie i bądź cierpliwy. ☕

---

## 🔑 Architektura Wymagań Sprzętowych (Zmora Płyt Głównych)

Premiera Windows 11 wywołała kontrowersje ze względu na drastyczne podniesienie wymagań sprzętowych, w szczególności tych dotyczących modułów bezpieczeństwa kryptograficznego. Instalator (`WinPE`) automatycznie przerywa proces wdrożenia na maszynach, które nie przechodzą walidacji sprzętowej.

| Wymaganie   | Minimalna specyfikacja         | Realna rekomendacja                         |
| ----------- | ------------------------------ | ------------------------------------------- |
| Procesor    | $1 GHz$, $2$ rdzenie, $64-bit$ | $2 GHz$, $4$ rdzenie, $64-bit$              |
| Pamięć RAM  | $4 GB$                         | $8 GB$ (absolutne minimum), zalecam $16 GB$ |
| Dysk twardy | $64 GB$                        | $128 GB$ (np. NVMe SSD)                     |
| TPM         | Wersja $2.0$                   | Wersja $2.0$                                |
| Firmware    | **UEFI z Secure Boot**         | **UEFI z Secure Boot**                      |
| Karta graf. | Kompatybilna z DirectX $12$    | Kompatybilna z DirectX $12$                 |

W kwestii procesorów warto wspomnieć o architekturze hybrydowej (wprowadzonej m.in. w procesorach Intel od $12$. generacji „Alder Lake”), która dzieli rdzenie na **wydajnościowe** (_**P-cores**_) oraz **efektywne/energooszczędne** (_**E-cores**_). 

Windows 11 natywnie wspiera ten podział dzięki zoptymalizowanemu **schedulerowi** (planista zadań), który blisko współpracuje ze sprzętową technologią *Thread Director*. System dynamicznie mapuje wątki tła o niskim priorytecie (np. usługi indeksowania, Windows Defender) na rdzenie `E-cores`, zwalniając pełną przepustowość `P-cores` dla procesów pierwszoplanowych. Rozwiązuje to problem „zagłodzenia” głównych aplikacji przez ciężkie usługi systemowe w tle.

---

### ⚙️ Koprocesor Kryptograficzny (TPM 2.0)

*Trusted Platform Module (TPM)* to mikrokontroler kryptograficzny osadzony bezpośrednio na płycie głównej lub zintegrowany z architekturą procesora (tzw. firmware TPM). Pełni on rolę izolowanej, sprzętowej enklawy bezpieczeństwa. Zamiast „sejfu”, inżynierowie traktują TPM jako komponent wykonujący zaufane operacje pierwotne:
- generowanie i sprzętowe przechowywanie kluczy asymetrycznych dla systemów szyfrowania wolumenów (np. BitLocker),
- separacja poświadczeń uwierzytelniania biometrycznego i sprzętowego (architektura infrastruktury Windows Hello),
- weryfikacja integralności łańcucha rozruchu (tzw. *Measured Boot*), która we współpracy z Secure Boot gwarantuje, że do pamięci ładowany jest wyłącznie autoryzowany, niemodyfikowany kod (ochrona przed 👾 **_rootkitami_**).

Wersja $2.0$ wprowadziła obsługę algorytmu `SHA-256`. Stanowi to absolutny wymóg dla Windows 11, ponieważ system wykorzystuje TPM jako rdzenny fundament dla architektury *VBS (Virtualization-Based Security)*. Zamiast ufać oprogramowaniu (np. antywirusom) działającemu w przestrzeni użytkownika, system weryfikuje bezpieczeństwo własnego jądra, opierając się na sprzętowej izolacji.

> [!TIP]
> Jeśli środowisko instalacyjne `WinPE` przerwie proces wdrażania na etapie walidacji wymagań, uruchom ponownie stację roboczą i przed załadowaniem **bootloadera** systemu Windows, zainicjuj interfejs konfiguracyjny UEFI (domyślnie klawisz: <kbd>Delete</kbd> lub <kbd>F2</kbd>).
> Odszukaj parametr odpowiedzialny za programową emulację TPM przez procesor: **`fTPM` (platforma AMD)** lub **`PTT` (platforma Intel)**. Zmień jego stan logiczny na `Enabled` i ponów proces rozruchu z dysku instalacyjnego.

---

## 🛠️ Punkt Kontrolny: Wymagania brzegowe

Zrozumienie blokad sprzętowych i logiki dostarczania paczek systemowych.

<data-gate>
  <data-quiz>
    <question>
Jakie są minimalne wymagania dotyczące ilości pamięci RAM oraz miejsca na dysku, aby móc poprawnie uruchamiać wersję systemu Windows 11?
    </question>
    <options>
      <option>$16 GB$ RAM i $128 GB$ miejsca na dysku</option>
      <option correct>$4 GB$ RAM i $64 GB$ miejsca na dysku</option>
      <option>$8 GB$ RAM i $32 GB$ miejsca na dysku</option>
    </options>
    <div data-hint="error">
      W pytaniu jest mowa o minimalnych wymaganiach brzegowych, które pozwalają uruchomić system.
    </div>
    <div data-hint="success">
      Brawo! Windows 11 jest bardziej wymagający niż jego poprzednicy w architekturze pamięciowej.
    </div>
  </data-quiz>
</data-gate>

---

## 💾 Deploy: Tworzenie instalacyjnego pendrive'a

<div class="cross-knowledge" id="rufus-ventoy">

Mając pobrany obraz $\text{ISO}$, nie możemy go po prostu „skopiować” na pendrive. Musimy stworzyć tzw. **nośnik bootowalny** (*rozruchowy*), czyli taki, który zostanie wykryty przez bootloader BIOS/UEFI. 

Mamy do dyspozycji dwa świetne i darmowe rozwiązania:  
**Rufus** (klasyka) lub **Ventoy** (nowoczesna wygoda wirtualizacji $\text{ISO}$).

<data-tabs>
<tabs>
    <b>Rufus</b>
    <b>Ventoy</b>
</tabs>
<div>

**[Rufus](https://rufus.ie/pl/)** to niewielki program do tworzenia bootowalnych dysków USB.  

> [!NOTE]
> *Co oznacza "Portable"?* Wersja przenośna programu to taka, której nie musisz tradycyjnie instalować w systemie operacyjnym. Aplikacja działa bezpośrednio z pobranego pliku lub wypakowanego folderu, a swoje ustawienia zazwyczaj zapisuje lokalnie. Dzięki temu program nie „wrasta” w Windowsa i nie modyfikuje głęboko rejestru systemowego.

**Przygotowanie pendrive'a w Rufusie:**
1. Podłącz pendrive (uwaga: **_wszystkie dane na nim zostaną usunięte!_**).
2. Uruchom program Rufus.
3. W sekcji **Urządzenie** wybierz swój podłączony pendrive.
4. Kliknij **Wybierz** i wskaż pobrany wcześniej plik $\text{ISO}$ Windowsa 11.
5. Upewnij się, że **Schemat partycjonowania** to _**GPT**_, a **Dysk docelowy** to _**UEFI (bez CSM)**_.
    - Możesz też zmienić **Nazwę woluminu** na bardziej opisową.
    > _**GPT**_: **GUID Partition Table** - nowocześniejszy standard partycjonowania dysków, który oferuje większą elastyczność i obsługę dużych dysków powyżej $2$ TB.
    > _**UEFI (bez CSM)**_: **Unified Extensible Firmware Interface** - nowoczesny firmware, który zastąpił starszy BIOS. Obsługuje partycje GPT i zapewnia szybsze uruchamianie systemu.
    > _**CSM**_: **Compatibility Support Module** - moduł umożliwiający uruchamianie starszych systemów operacyjnych w trybie BIOS, co nie jest potrzebne w przypadku Windows 11.
6. Kliknij **_Start_** i poczekaj na ukończenie *flashowania* i nagrywania obrazu $\text{ISO}$ na nośnik USB.
![Okno programu Rufus z ustawionymi parametrami dla Windows 11 (GPT, UEFI) przed kliknięciem Start](/public/courses/windows-11/Images/okno_programu_rufus_z_wybraną_konfiguracją_pod_iso_windows11.webp)

> [!TIP]
> Podczas tworzenia nośnika Windows 11, program domyślnie wyświetli specjalne okienko *"Windows User Experience"*. Pozwala ono „w locie” usunąć wymóg `TPM 2.0` i `Secure Boot`. Możesz też ustawić automatyczne stworzenie lokalnego konta administratora z podaną nazwą użytkownika i wyłączyć zbieranie danych telemetrycznych. 
> ![Okno popup Rufusa z opcjami User Experience - zaznaczone ominięcie TPM/Secure Boot/Microsoft Account](/public/courses/windows-11/Images/okno_popup_rufusa_z_opcjami_user_experience_zaznaczone_ominięcie_tpm_secure_boot_microsoft_account.webp)

</div>
<div>

**[Ventoy](https://www.ventoy.net/en/download.html)** to zupełnie inna klasa oprogramowania (Chainloader). Instalujesz go na dysku USB tylko raz.

Największą przewagą Ventoy jest **brak konieczności formatowania nośnika** przy zmianie obrazu. Mając jeden pojemny pendrive, możesz umieścić na nim dziesiątki plików $\text{ISO}$ — np. instalatory Windows 11, serwerowe edycje dystrybucji Linux oraz środowiska diagnostyczne — po prostu je kopiując. 

Po zbootowaniu z USB, Ventoy wyświetli listę wszystkich obecnych na dysku obrazów $\text{ISO}$ i po dokonaniu wyboru zainicjuje wskazany system, emulując w locie sprzętowy napęd optyczny.

**Jak przygotować pendrive z Ventoy:**
1. Pobierz archiwum `.zip` programu Ventoy i rozpakuj je.
2. Uruchom plik *`Ventoy2Disk.exe`*.
3. Wybierz swój pendrive (uwaga: **_ta czynność całkowicie go sformatuje!_**).
4. Kliknij **Install** (Zainstaluj).
   ![Aplikacja Ventoy2Disk z wybranym pendrivem i przyciskiem Install](/public/courses/windows-11/Images/instalacja_Ventoy.webp)
5. Po instalacji, otwórz *Ten Komputer*. Ventoy podzielił pendrive na dwa obszary:
   - **`Ventoy`** (zazwyczaj format `exFAT`) – to Twoja główna, potężna przestrzeń. Tu będziesz wrzucać pliki instalacyjne $\text{ISO}$.
   - **`VTOYEFI`** (zaledwie $32\text{ MB}$ w `FAT32`) – to partycja rozruchowa z bootloaderem. Windows bardzo często samoistnie przypisze jej literę i pokaże ją obok, mimo że powinna być ukryta. **_Pamiętaj: nic na nią nie wrzucasz i absolutnie jej nie modyfikujesz!_**
 ![Dysk Ventoy w Eksploratorze plików i w przystawce zarządzania dyskami](/public/courses/windows-11/Images/ventoy_partycje.webp)
6. **Po prostu skopiuj plik ISO Windows 11** i wklej na ten nośnik. To wszystko!

</div>
</data-tabs>

</div>

---

## 🔗 Połącz Pary: Komponenty instalatora

Przetestuj zrozumienie zależności środowiska przed przystąpieniem do operacji z wirtualizacją.

<data-gate>
<data-connection-matcher title="Architektura Rozruchowa">
    <item left="Wielość obrazów `.iso` na jednym nośniku pendrive" right="Ventoy"></item>
    <item left="Fizyczne wyodrębnienie struktury $\text{ISO}$ i paczek instalacyjnych na dysk USB" right="Rufus"></item>
    <item left="Sprzętowy klucz kryptograficzny na płycie głównej" right="TPM 2.0"></item>
    <item left="Oficjalne źródło niemodyfikowanych obrazów $\text{ISO}$" right="Witryna Microsoftu"></item>
</data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- $\text{ISO}$ to zamknięty, skompresowany system plików zawierający instalator gotowy do wdrożenia,
- serwisy zewnętrzne jak *basewin.pl* mogą dostarczać nośniki z wbudowanymi obejściami wymagań sprzętowych,
- Windows 11 twardo weryfikuje zabezpieczenia sprzętowe procesów w tle (`TPM 2.0` i `UEFI` z `Secure Boot`),
- proces tworzenia nośnika instalacyjnego w Rufusie to głęboka modyfikacja dysku USB pozwalająca wstrzyknąć parametry omijania wymagań sprzętowych,
- Ventoy eliminuje potrzebę ciągłego formatowania pendrive'a za pomocą ukrytej logiki *Chainloadera*.

---

W następnej lekcji poznamy zasady wirtualizacji instalacji i wejdziemy w środowisko VirtualBox. 🚀
