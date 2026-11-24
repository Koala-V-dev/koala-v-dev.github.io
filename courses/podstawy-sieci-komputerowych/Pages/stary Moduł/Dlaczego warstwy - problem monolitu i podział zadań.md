# Dlaczego warstwy - problem monolitu i podział zadań

Gdy przełączasz komputer z kabla Ethernet na Wi-Fi, otwarte strony i aktywne połączenia działają dalej bez zamykania aplikacji. Jest to możliwe dzięki podziałowi komunikacji sieciowej na niezależne **warstwy**.

---

## 🧩 Zasada separacji warstw

![Architektura monolityczna vs Model warstwowy](/public/courses/podstawy-sieci-komputerowych/Images/monolit-vs-warstwy.svg)

W architekturze monolitycznej kod aplikacji musiałby bezpośrednio sterować napięciem na karcie sieciowej. Wymiana przewodu na światłowód lub Wi-Fi oznaczałaby konieczność przepisania każdego programu.

Podział warstwowy izoluje zadania:
1. **Jedna warstwa, jedno zadanie:** Warstwa fizyczna przesyła bity, warstwa sieciowa wyznacza trasę po IP, a aplikacja obsługuje dane użytkownika.
2. **Komunikacja wyłącznie przez interfejs (API):** Warstwa wyższa przekazuje dane warstwie leżącej bezpośrednio pod nią (np. przez systemowe gniazdo *Socket API*), nie ingerując w szczegóły sprzętowe.

Sprawdź w symulatorze, które elementy systemu przestają działać przy zmianie sprzętu lub protokołu w architekturze monolitycznej i warstwowej:

<data-osi-stack-lab mode="monolith"></data-osi-stack-lab>

---

## 🌐 Organizacje standaryzujące sieci (INF.02)

Aby sprzęt różnych producentów współpracował w jednej sieci, reguły przesyłania danych są jawne i ustandaryzowane.

![Kto tworzy standardy sieciowe? Podział ról w ekosystemie IT](/public/courses/podstawy-sieci-komputerowych/Images/instytucje-standaryzujace.svg)

| Organizacja | Zakres odpowiedzialności | Przykładowe standardy |
| :--- | :--- | :--- |
| **IEEE** | Normy sprzętowe, elektryczne, radiowe (warstwa 1 i 2) | `802.3` (Ethernet), `802.11` (Wi-Fi), `802.1Q` (VLAN) |
| **IETF** | Specyfikacje protokołów Internetu w dokumentach **RFC** | RFC 791 (IPv4), RFC 793 (TCP), RFC 9110 (HTTP) |
| **ISO** | Międzynarodowe normy teoretyczne | Norma ISO 7498 (7-warstwowy model OSI) |
| **IANA / ICANN** | Globalne rejestry adresów i nazw | Pule IPv4/IPv6, numery portów, domeny główne (`.pl`, `.com`) |

---

<details class="deep-dive">
<summary>
<span class="deep-dive-title">🔬 Pod maską: Granica Socket API w systemie operacyjnym (Ring 3 vs Ring 0)</span>
<span class="deep-dive-badge">SYSTEMY OPERACYJNE & C</span>
</summary>
<div class="deep-dive-content">

Aplikacja działająca w przestrzeni użytkownika (*User Space*, Ring 3 procesora) nie ma uprawnień do zapisywania rejestrów karty sieciowej.

1. Program wywołuje funkcję systemową z biblioteki standardowej, np. `send(sockfd, buf, len, 0)`.
2. Procesor wykonuje instrukcję `syscall` i przełącza uprawnienia na tryb jądra (*Kernel Space*, Ring 0).
3. Jądro kopiuje dane do struktury bufora (`sk_buff` w Linuksie), dokłada nagłówki TCP oraz IP i przekazuje gotowy pakiet sterownikowi aktualnie aktywnej karty sieciowej (Ethernet lub Wi-Fi).

</div>
</details>

---

## 🔒 Sprawdzenie wiedzy: Architektura warstwowa

<data-gate>
  <data-connection-matcher title="Połącz organizację lub mechanizm z zakresem odpowiedzialności">
    <div class="cmw-item" data-left="IEEE (802.3 / 802.11)" data-right="Standardy warstwy fizycznej i łącza danych (Ethernet, Wi-Fi)"></div>
    <div class="cmw-item" data-left="IETF (dokumenty RFC)" data-right="Specyfikacje protokołów IP, TCP, UDP i HTTP"></div>
    <div class="cmw-item" data-left="IANA / ICANN" data-right="Rejestry pul adresów IP, portów oraz domen DNS"></div>
    <div class="cmw-item" data-left="Socket API (jądro OS)" data-right="Interfejs oddzielający kod aplikacji od sterownika karty"></div>
  </data-connection-matcher>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- Separacja warstw sprawia, że wymiana kabla, karty sieciowej lub standardu łączności nie wymaga modyfikacji aplikacji użytkownika.
- Warstwy komunikują się wyłącznie przez ustandaryzowane interfejsy (np. *Socket API*).
- **IEEE** definiuje standardy L1/L2 (802.3 Ethernet, 802.11 Wi-Fi), **IETF** publikuje protokoły w dokumentach **RFC**, a **IANA/ICANN** zarządza pulami IP, portów i domen głównych.
