# Edycja plików w terminalu - nano

W pracy administratora systemów Linux bardzo rzadko będziesz mieć dostęp do graficznego edytora tekstu. Gdy konfigurujesz serwer przez sieć (na przykład za pomocą protokołu SSH), Twoim jedynym oknem na świat jest tekstowa konsola. Dlatego umiejętność sprawnej edycji plików konfiguracyjnych bezpośrednio w terminalu jest jedną z najważniejszych umiejętności praktycznych.

W systemie Ubuntu najpopularniejszym, najprostszym i domyślnie zainstalowanym edytorem konsolowym jest **nano**.

---

## 🛠️ Uruchomienie edytora

Aby otworzyć lub utworzyć nowy plik, wystarczy podać nazwę pliku jako argument do polecenia `nano`:

```bash
nano moj_plik.txt
```

Jeśli plik istnieje, zostanie otwarty do edycji. Jeśli nie istnieje, `nano` utworzy w pamięci pusty bufor, który zostanie zapisany pod podaną nazwą dopiero przy zapisie.

> [!WARNING]
> **Brak uprawnień przy edycji plików systemowych**
> 
> Pliki konfiguracyjne systemu (np. w katalogu `/etc/`) należą do użytkownika `root`. Jeśli otworzysz plik systemowy komendą `nano /etc/hosts` jako zwykły użytkownik, edytor pozwoli Ci pisać i wyświetli komunikat `[ File 'etc/hosts' is unwritable]`, ale przy próbie zapisu pokaże czerwony komunikat błędu: 
> **_[Error writnig /etc/hosts: Permission denied]_** (Brak dostępu do uprawnienia zapisu).
> 
> ![Brak uprawnień przy edycji plików systemowych](/public/courses/ubuntu-26/Images/nano-not-writing.png)
> 
> Aby edytować pliki systemowe, zawsze musisz podnieść uprawnienia za pomocą `sudo`:
> 
> ```bash
> sudo nano /etc/hosts
> ```

---

## 🧭 Nawigacja i pisanie

Po uruchomieniu edytora zobaczysz prosty interfejs:
1. **Górny pasek:** wersja programu nano oraz nazwa edytowanego pliku.
2. **Środek (główny obszar):** miejsce, w którym po prostu wpisujesz tekst za pomocą klawiatury.
3. **Dolny pasek (podpowiedzi):** ściągawka z najważniejszymi skrótami klawiszowymi.

> [!NOTE]
> **Zapomnij o myszce**  
> Inne graficzne edytory pozwalają klikać myszką w dowolnym miejscu. W klasycznych edytorach terminalowych myszka domyślnie nie działa do przesuwania kursora w tekście. Musisz poruszać się wyłącznie strzałkami na klawiaturze. Klawisze <kbd>Page Up</kbd> oraz <kbd>Page Down</kbd> przewijają cały ekran, a <kbd>Home</kbd> i <kbd>End</kbd> przenoszą na początek i koniec linii.

---

## ⌨️ Ściągawka z najważniejszych skrótów

Znak daszka `^` w dolnym pasku podpowiedzi oznacza klawisz **Control** (<kbd>Ctrl</kbd>). Przykładowo, skrót `^O` oznacza kombinację klawiszy <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span>.  
Natomiast skróty oznaczone prefiksem `M-` oznaczają klawisz **Meta** (<kbd>Alt</kbd>). Przykładowo, skrót `M-A` służy do zaznaczania.

### Pozycja, zapis i wyjście

|                                  Skrót                                   | Działanie w nano        | Opis praktyczny                                                                               |
| :----------------------------------------------------------------------: | :---------------------- | :-------------------------------------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span> | **Cur Pos** (*Pozycja*) | Wyświetla w dolnej linii precyzyjną informację o bieżącej linii i kolumnie kursora.           |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>O</kbd></span> | **WriteOut** (*Zapisz*) | Zapisuje zmiany w pliku bez wychodzenia z edytora. System zapyta o potwierdzenie nazwy pliku. |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> | **Exit** (*Wyjście*)    | Zamyka edytor nano. Jeśli dokonałeś zmian, system zapyta, czy chcesz je zapisać.              |

### Tekst: kopiowanie i wklejanie

|                                  Skrót                                   | Działanie w nano               | Opis praktyczny                                                                          |
| :----------------------------------------------------------------------: | :----------------------------- | :--------------------------------------------------------------------------------------- |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>R</kbd></span> | **Read File** (*Wczytaj plik*) | Wkleja zawartość innego pliku w miejscu, w którym aktualnie stoi Twój kursor.            |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>K</kbd></span> | **Cut** (*Wytnij*)             | Wytnie całą linijkę tekstu, na której stoi kursor, zapisując ją do podręcznego bufora.   |
| <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>U</kbd></span> | **Uncut** (*Wklej*)            | Wkleja linijkę z bufora w miejscu kursora. Możesz jej użyć jako prostego "kopiuj-wklej". |

> [!TIP]
> **Bezpieczne wyjście z edytora**  
> Gdy naciśniesz <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> po zmodyfikowaniu pliku, na dole pojawi się pytanie:  
> `Save modified buffer?`  
> - Naciśnij <kbd>Y</kbd> (Yes), aby zatwierdzić zapis. Edytor zapyta o nazwę pliku (możesz ją zmienić lub po prostu kliknąć <kbd>Enter</kbd>, aby nadpisać).  
> - Naciśnij <kbd>N</kbd> (No), aby wyjść bez zapisywania wprowadzonych zmian.  
> - Naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>C</kbd></span>, aby anulować wyjście i wrócić do pisania.
> <hr>
> Wielu administratorów zaczyna od nano, bo w przeciwieństwie do vima, nie trzeba czytać instrukcji obsługi, żeby z niego wyjść bez restartu terminala! 😅

---

## 🔍 Wyszukiwanie tekstu (<code>Ctrl + W</code>)

Konfiguracyjne pliki systemowe potrafią mieć setki linii kodu. Szukanie konkretnej linii wzrokiem jest nieefektywne. 
1. Naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>W</kbd></span>.
2. Wpisz szukaną frazę (np. `PORT`).
3. Naciśnij <kbd>Enter</kbd>. Kursor przeskoczy do pierwszego wystąpienia.
4. Aby wyszukać kolejne wystąpienie tego samego słowa, ponownie naciśnij <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>W</kbd></span> i bez wpisywania tekstu po prostu zatwierdź klawiszem <kbd>Enter</kbd>.

---

## 🧠 Punkt kontrolny: Praca w nano

<data-gate>
  <data-quiz>
    <question>
      Chcesz wyjść z edytora nano po edycji pliku konfiguracyjnego `/etc/resolv.conf`, odrzucając wszystkie wprowadzone zmiany. Jaką sekwencję klawiszy powinieneś wybrać?
    </question>
    <options>
      <item correct>Naciśnij <kbd>Ctrl</kbd> + <kbd>X</kbd>, a następnie na pytanie o zapis bufora odpowiedz klawiszem <kbd>N</kbd>.</item>
      <item>Naciśnij <kbd>Ctrl</kbd> + <kbd>O</kbd>, a następnie wpisz nazwę pustego pliku i wyjdź za pomocą <kbd>Ctrl</kbd> + <kbd>X</kbd>.</item>
      <item>Naciśnij <kbd>Ctrl</kbd> + <kbd>C</kbd>, aby anulować działanie, a potem zamknij okno terminala.</item>
      <item>Wpisz komendę `:q!` na dole ekranu i zatwierdź klawiszem <kbd>Enter</kbd>.</item>
    </options>
    <div data-hint="error">
      Pamiętaj: <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> inicjuje wyjście. Jeśli nie chcesz zapisywać zmian, system musi otrzymać informację „No” (<kbd>N</kbd>).
    </div>
    <div data-hint="success">
      Świetnie! <span style="white-space: nowrap;"><kbd>Ctrl</kbd> + <kbd>X</kbd></span> i klawisz <kbd>N</kbd> to jedyna poprawna metoda na bezpieczne wyjście z nano bez zapisywania zmian w pliku.
    </div>
  </data-quiz>
</data-gate>

---

### <span class="header-koala"><span>🦾</span><span>🐨</span><span>🦾</span></span> Co masz wynieść z tej lekcji:

- **Brak GUI na serwerze:** Edycja plików w terminalu jest podstawową umiejętnością admina.
- **Edycja systemowa:** Aby modyfikować pliki konfiguracyjne w `/etc/`, musisz uruchamiać nano z uprawnieniami roota (`sudo nano`).
- **Skrót Ctrl + X:** To główny wyłącznik edytora, który pyta o chęć zapisu zmian (Y/N).
- **Skrót Ctrl + O:** Pozwala na ręczne wymuszenie zapisu pliku (zrzucenie bufora na dysk).
- **Wyszukiwanie Ctrl + W:** Skrót ten (od angielskiego *Where Is*) ratuje życie w długich plikach konfiguracyjnych.
- **Ruch bez myszy:** Używaj wyłącznie strzałek, Home, End, Page Up i Page Down do poruszania się wewnątrz pliku.
