# Programowanie Obiektowe (WASM & JS)

Kompilatory operujące przed bramą serwerową (czyli natywny JavaScript, CPython uruchomiony w WebAssembly oraz Uniter dla PHP) w teorii powinny radzić sobie ze strukturami obiektowymi (dziedziczenie, polimorfizm itp.). Sprawdźmy to!

## JavaScript (ES6 Classes)
Wykorzystuje natywny silnik przeglądarki (V8 w Chrome / SpiderMonkey w Firefox), więc nie ma dla niego kodu JavaScriptowego nie do udźwignięcia.

<data-playground language="javascript">
// @file Animal.js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} wydaje dźwięk.`);
  }
}

// @file Dog.js
// W środowisku uczelnianym klasa zostanie magicznie dołączona :)
class Dog extends Animal {
  speak() {
    console.log(`${this.name} szczeka: Woof! 🐶`);
  }
}

// @file main.js
const reksio = new Dog('Reksio');
reksio.speak();
</data-playground>

## Python (Pyodide)
Python ładujący się po protokole WebAssembly (około 10MB waży ten wirtualny kontener ładujący się raz przy odpaleniu platformy ucznia). Pozwala na używanie pełnej obiektowości Pythona i zewnętrznych bibliotek.

<data-playground language="python">
# @file Employee.py
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

# @file Manager.py
from Employee import Employee

class Manager(Employee):
    def __init__(self, name, salary, bonus):
        super().__init__(name, salary)
        self.bonus = bonus
        
    def calculate_total_pay(self):
        return self.salary + self.bonus

# @file main.py
from Manager import Manager

m = Manager("Alicja Hinc", 15000, 5000)
print(f"Menedżer: {m.name}")
print(f"Baza: {m.salary} PLN | Premia: {m.bonus} PLN")
print(f"Łącznie do wypłaty: {m.calculate_total_pay()} PLN")
</data-playground>

## PHP (Uniter JS Engine)
Uniter to biblioteka NPM odpalająca tokenizator, parsująca drzewo AST i ewaluująca PHP bez użycia prawdziwego silnika Zend. W teorii stare dobre klasy powinny działać. Może być nieco problematyczny z rzutowaniem typów. 

<data-playground language="php">
// @file Car.php
<?php
class Car {
    public $brand;
    public $speed;

    public function __construct($brandName) {
        $this->brand = $brandName;
        $this->speed = 0;
    }

    public function accelerate($value) {
        $this->speed = $this->speed + $value;
    }

    public function getInfo() {
        return "Auto " . $this->brand . " pędzi z predkoscia " . $this->speed . " km/h";
    }
}

// @file app.php
<?php
$auto = new Car("Koala Motors P1");
$auto->accelerate(50);
$auto->accelerate(30);

echo "Stan pojazdu:\n";
echo $auto->getInfo() . "\n";
?>
</data-playground>

## C++ (Wandbox API)

Wymaga silnika typu g++ by zbudować pliki obiektowe i je zlinkować. Kod z funkcji `main` to nasz punkt wejścia. Silnik sam zidentyfikuje w którym pliku znajduje się punkt wejścia i przeorganizuje źródła pod linker.

<data-playground language="cpp">
// @file Student.h
#include <string>
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

// @file main.cpp
#include <iostream>
#include "Student.h"

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

## C# (Wandbox API)

Środowisko .NET w formie API. Wymaga przynajmniej jednego pliku z klasą mającą metodę `Main()`. Nasz analizator domyśli się od którego pliku powinien poprosić kompilator mono o egzekucję.

<data-playground language="csharp">
// @file Student.cs
public class Student {
    public string Name { get; set; }
    public double Grade { get; set; }
}

// @file Program.cs
using System;
using System.Linq;
using System.Collections.Generic;

class Program {
    static void Main() {
        var students = new List<Student> {
            new Student { Name = "Anna", Grade = 4.5 },
            new Student { Name = "Jan", Grade = 3.8 },
            new Student { Name = "Maria", Grade = 5.0 }
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
