# Wojna formatów: APT vs Snap

Zarządzanie oprogramowaniem w dystrybucji Ubuntu opiera się obecnie na dwóch równoległych ekosystemach: tradycyjnym menedżerze pakietów **APT (Advanced Package Tool)** oraz nowoczesnym formacie kontenerowym **Snap**. Oba podejścia różnią się architekturą dostarczania oprogramowania.

---

## 📦 System pakietów APT (.deb)

Tradycyjny i najbardziej zakorzeniony system pakietów w rodzinie systemów Debian:
* **Jak działa?** Pakiety `.deb` zawierają pliki programu oraz metadane opisujące ich zależności.
* **Współdzielenie bibliotek:** Jeśli program A i program B wymagają biblioteki C, system pobiera bibliotekę C tylko raz i instaluje ją w systemie globalnie. Zmniejsza to zapotrzebowanie na miejsce na dysku, ale może prowadzić do "piekła zależności" (dependency hell), gdy dwa programy wymagają różnych, niekompatybilnych wersji tej samej biblioteki.

---

## 🔲 Format Snap (squashfs & loop devices)

Opracowany przez Canonical uniwersalny format kontenerowy:
* **Jak działa?** Aplikacja Snap zawiera w sobie program oraz absolutnie wszystkie wymagane biblioteki pomocnicze. Działa w odizolowanej piaskownicy (sandbox), chronionej przez AppArmor i filtry systemowe.
* **Architektura dyskowa:** Pakiety Snap są dystrybuowane jako skompresowane obrazy systemu plików **SquashFS**. Podczas instalacji system montuje te obrazy jako wirtualne urządzenia pętli zwrotnej (`loop devices`). Możesz to zaobserwować, wpisując w konsoli polecenie `lsblk`.
* **Zalety i wady:** Rozwiązuje problem konfliktów wersji i ułatwia aktualizacje (rolling release), ale aplikacje zużywają znacznie więcej przestrzeni dyskowej i mogą uruchamiać się nieco wolniej przy pierwszym starcie.

---

## 🛠️ Punkt Kontrolny: Pakiety APT i Snap
<data-gate>
  <data-quiz>
    <question>
W jaki sposób pakiety Snap są montowane i widoczne w strukturze blokowej systemu Ubuntu?
    </question>
    <options>
      <item correct>Jako skompresowane obrazy SquashFS, zamontowane w trybie tylko do odczytu jako urządzenia pętli zwrotnej (loop devices).</item>
      <item>Jako dynamiczne bazy danych SQL rozpakowywane bezpośrednio w pamięci RAM.</item>
      <item>Jako surowe archiwa ZIP rozpakowywane każdorazowo do katalogu tymczasowego /tmp przy uruchomieniu.</item>
    </options>

<div data-hint="error">
  Zwróć uwagę na polecenie `lsblk` i typ SquashFS. Pakiety te nie są fizycznie rozpakowywane na dysku, lecz montowane "w locie".
</div>
<div data-hint="success">
  Świetnie! System montuje aplikacje Snap jako wirtualne pętle zwrotne (loop), co pozwala na pełną izolację plików i ich niezmienność.
</div>
  </data-quiz>
</data-gate>
