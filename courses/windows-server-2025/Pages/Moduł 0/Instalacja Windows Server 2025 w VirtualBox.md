# Instalacja Windows Server 2025 w VirtualBox

Przygotowanie maszyny wirtualnej pod środowisko serwerowe wymaga przydzielenia odpowiednich zasobów oraz wyboru właściwego wariantu instalacji systemu Windows Server.

---

## 🛠️ Wymagania i parametry maszyny wirtualnej

Przed uruchomieniem instalatora przygotuj maszynę w VirtualBox o następujących parametrach:

| Parametr | Minimalna zalecana wartość | Rola w środowisku testowym |
| :--- | :--- | :--- |
| **RAM** | `4096 MB` (4 GB) | Płynne działanie usług AD DS i DNS bez swapowania |
| **Procesor** | `2 vCPU` | Stabilna praca wielowątkowa |
| **Dysk twardy** | `60 GB` (VDI, dynamiczny) | Miejsce na system, logi i bazę NTDS |
| **Karta sieciowa 1** | `Wewnętrzna sieć (Internal Network)` | Izolowane środowisko LAN do obsługi klientów |
| **Karta sieciowa 2** | `NAT` (opcjonalnie) | Wyjście w świat do aktualizacji pakietów |

> [!NOTE]
> Upewnij się, że w ustawieniach maszyny w zakładce **System -> Płyta główna** włączona jest obsługa **EFI** (zalecana dla Windows Server 2022/2025).

---

## 💿 Przebieg instalacji systemu

Uruchom maszynę z podpiętym obrazem ISO Windows Server 2025.

1. **Wybór języka i układu klawiatury:**
   - Wybierz język polski (lub angielski) oraz układ klawiatury **Polski (programisty)**.

2. **Wybór edycji instalacyjnej:**

> [!IMPORTANT]
> Zawsze wybieraj opcję **Środowisko pulpitu (Desktop Experience)**, jeśli zamierzasz korzystać z graficznych narzędzi administracyjnych (Menedżer serwera, przystawki MMC). Opcja domyślna bez tego dopisku zainstaluje wersję Server Core (wyłącznie czarny wiersz poleceń).

3. **Wariant instalacji:**
   - Wybierz: **Niestandardowa: tylko zainstaluj system Windows (zaawansowane)**.
   - Wskaż nieprzydzielony dysk i zatwierdź przyciskiem **Dalej**.

> 📷 Zrzut `ws2025-instalacja-edycja.png`: Ekran wyboru edycji Windows Server 2025 z podświetloną pozycją Desktop Experience.

---

## 🔑 Pierwsze logowanie i hasło administratora

Po zakończeniu kopiowania plików i restarcie system poprosi o ustalenie hasła dla wbudowanego konta **Administrator**:

* Hasło musi spełniać reguły złożoności (min. 8 znaków, wielka litera, mała litera, cyfra, znak specjalny), np.: `ZAQ!2wsx`.

Aby zalogować się do systemu w VirtualBoxie:
* Użyj menu: **Wejście -> Klawiatura -> Wstaw Ctrl+Alt+Del** (lub skrótu klawisza hosta <kbd>Host</kbd> + <kbd>Del</kbd>).

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Różnicę między wersją *Server Core* a wersją ze *Środowiskiem pulpitu*.
- Właściwą konfigurację zasobów w VirtualBox dla maszyny serwerowej.
- Zabezpieczenie konta wbudowanego Administratora hasłem spełniającym domyślne zasady złożoności.
