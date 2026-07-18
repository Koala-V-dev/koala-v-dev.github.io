# Piaskownica Kodu

## JavaScript — Twoje pierwsze eksperymenty

Przetestuj poniższy kod bezpośrednio w przeglądarce. 
Kliknij **▶ Uruchom**, aby zobaczyć wynik.

<data-playground language="javascript">
// Typy danych w JavaScript
const liczba = 42;
const tekst = "Koala-V";
const tablica = [1, 2, 3, 4, 5];

console.log("Liczba:", liczba);
console.log("Typ:", typeof liczba);
console.log("Tekst:", tekst);
console.log("Tablica:", tablica);
console.log("Suma:", tablica.reduce((a, b) => a + b, 0));
</data-playground>

> [!TIP]
> Mozesz edytowac kod w edytorze i uruchomic go ponownie!

## JavaScript — Funkcje i petle

<data-playground language="javascript">
// FizzBuzz
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) console.log(i + ": FizzBuzz");
    else if (i % 3 === 0) console.log(i + ": Fizz");
    else if (i % 5 === 0) console.log(i + ": Buzz");
    else console.log(i);
  }
}

fizzBuzz(20);
</data-playground>

## SQL — Zapytania do bazy danych

Piaskownica SQL dzialajaca w przegladarce (WebAssembly SQLite).

<data-playground language="sql">
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  grade REAL,
  class TEXT
);

INSERT INTO students VALUES (1, 'Anna Kowalska', 4.5, '2A');
INSERT INTO students VALUES (2, 'Jan Nowak', 3.8, '2B');
INSERT INTO students VALUES (3, 'Maria Wisniewska', 5.0, '2A');
INSERT INTO students VALUES (4, 'Piotr Zielinski', 4.2, '2B');
INSERT INTO students VALUES (5, 'Katarzyna Wojcik', 4.8, '2A');

SELECT name, grade, class 
FROM students 
WHERE class = '2A' 
ORDER BY grade DESC;
</data-playground>

## PHP — Interpreter w przegladarce

PHP uruchamiany kliencko przez **phpruntime** (Uniter).

<data-playground language="php">
<?php
$students = array(
    array('name' => 'Anna', 'grade' => 4.5),
    array('name' => 'Jan', 'grade' => 3.8),
    array('name' => 'Maria', 'grade' => 5.0)
);

$sum = 0;
for ($i = 0; $i < count($students); $i++) {
    $sum = $sum + $students[$i]['grade'];
}
$average = $sum / count($students);

// Proste obciecie ulamka do celow demonstracyjnych (bez uzycia round)
$avgInt = (int)$average;
$avgDec = (int)(($average - $avgInt) * 100);
echo "Srednia ocen: " . $avgInt . "." . $avgDec . "\n";

for ($i = 0; $i < count($students); $i++) {
    $s = $students[$i];
    if ($s['grade'] >= 4.0) {
        echo $s['name'] . ": " . $s['grade'] . " - Zdal\n";
    } else {
        echo $s['name'] . ": " . $s['grade'] . " - Poprawka\n";
    }
}
?>
</data-playground>

## Python — Pelny CPython w przegladarce

Python 3.11 przez **Pyodide** (CPython WebAssembly).

<data-playground language="python">
students = [
    {"name": "Anna", "grade": 4.5},
    {"name": "Jan", "grade": 3.8},
    {"name": "Maria", "grade": 5.0},
]

best = [s for s in students if s["grade"] >= 4.0]

print(f"Najlepsi ({len(best)}/{len(students)}):")
for s in best:
    print(f"  {s['name']}: {s['grade']}")

average = sum(s["grade"] for s in students) / len(students)
print(f"\nSrednia: {average:.2f}")
</data-playground>

## C++ — Tablice, wskazniki, funkcje, cmath

C++ przez **JSCPP** — iostream, cmath, wskazniki, tablice, rekurencja.

<data-playground language="cpp">
#include <iostream>
#include <vector>

using namespace std;

class Student {
public:
    string name;
    vector<float> grades;

    Student(string n, vector<float> g) : name(n), grades(g) {}

    float getAverage() const {
        if (grades.empty()) return 0.0f;
        float sum = 0;
        for (float g : grades) sum += g;
        return sum / grades.size();
    }
};

int main() {
    vector<Student> class2A = {
        Student("Anna", {4.5, 5.0, 4.0}),
        Student("Jan", {3.0, 3.5, 4.0}),
        Student("Maria", {5.0, 5.0, 5.0})
    };

    cout << "--- Dziennik Klasy 2A ---" << endl;
    for (const auto& student : class2A) {
        cout << student.name << " - Srednia: " << student.getAverage() << endl;
    }

    return 0;
}
</data-playground>

## C# — Wykonywanie w chmurze

C# skompilowany bezpośrednio na backendzie platformy. Obsługuje w pełni LINQ oraz programowanie zorientowane obiektowo.

<data-playground language="csharp">
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var students = new List<(string Name, double Grade)> {
            ("Anna", 4.5), ("Jan", 3.8), ("Maria", 5.0)
        };

        var best = students.Where(s => s.Grade >= 4.0)
                           .OrderByDescending(s => s.Grade);

        Console.WriteLine("Ranking najlepszych:");
        foreach (var s in best) {
            Console.WriteLine($"  {s.Name}: {s.Grade}");
        }
    }
}
</data-playground>

