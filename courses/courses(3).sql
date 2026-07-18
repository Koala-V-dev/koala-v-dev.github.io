-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2026 at 07:15 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `koala_v`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `total_modules` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `category` varchar(50) DEFAULT 'General',
  `is_visible` tinyint(1) DEFAULT 0,
  `type` enum('main','article','tutorial','laboratory','community_note') DEFAULT 'main',
  `moderation_status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `author_id`, `name`, `description`, `slug`, `img`, `total_modules`, `created_at`, `category`, `is_visible`, `type`, `moderation_status`) VALUES
(1, 3, 'Binarne Fundamenty IT', 'Opanuj systemy liczbowe od podstaw, by potężnie usprawnić swoje wejście w inżynierię systemów, logikę programowania na bitach oraz obliczanie masek sieciowych (IP).', 'binarne-fundamenty-it', 'binarne-fundamenty-it.webp', 2, '2026-03-02 18:36:31', 'General', 1, 'main', 'approved'),
(3, 2, 'Binarne Fundamenty IT', NULL, 'badanie_kursu', NULL, 2, '2026-03-03 15:32:00', 'General', 0, 'main', 'pending'),
(150, 3, 'Podstawy Sieci Komputerowych', NULL, 'podstawy-sieci', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(151, 3, 'Bramki Logiczne', NULL, 'bramki-logiczne', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(152, 3, 'System Windows 11 (Desktop)', NULL, 'windows-11', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(153, 3, 'Ubuntu 24.04 (Desktop)', NULL, 'ubuntu-linux', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(154, 3, 'Struktury Danych i Typy Zmiennych', NULL, 'struktury-danych', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(155, 3, 'Grafika 2D (Podstawy Gimpa)', NULL, 'gimp', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(156, 3, 'Licencje IT i Prawa Autorskie', NULL, 'licencje', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(157, 3, 'Pakiety Office (MS Word)', NULL, 'word', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(158, 3, 'Markdown', NULL, 'markdown', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(159, 3, 'Urządzenia Techniki (UTK): CPU i GPU', NULL, 'cpu-gpu', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(160, 3, 'Architektura PC: RAM i Dyski', NULL, 'ram-dyski', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(161, 3, 'Urządzenia Peryferyjne', NULL, 'peryferia', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(162, 3, 'Drukarki i Skanery', NULL, 'drukarki', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(163, 3, 'Topologie Sieciowe', NULL, 'topologie', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(164, 3, 'Usługi i Porty Sieciowe', NULL, 'uslugi-porty', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(165, 3, 'System Windows Server', NULL, 'windows-server', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(166, 3, 'System Ubuntu Server', NULL, 'ubuntu-server', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(167, 3, 'Bazy Danych SQL (Relacyjne)', NULL, 'bd-sql', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(168, 3, 'Bazy Danych NoSQL', NULL, 'bd-nosql', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(169, 3, 'Logika i Algorytmy (Pseudokod)', NULL, 'algorytmy', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(170, 3, 'Język JavaScript', NULL, 'js', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(171, 3, 'Język PHP', NULL, 'php', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(172, 3, 'Język C++', NULL, 'cpp', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(173, 3, 'Język C#', NULL, 'csharp', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(174, 3, 'Język Python', NULL, 'python', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(175, 3, 'Wzorce UI/UX i WCAG', NULL, 'ui-ux', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(176, 3, 'React', NULL, 'react', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(177, 3, 'Vue', NULL, 'vue', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(178, 3, 'Angular', NULL, 'angular', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(179, 3, 'Laravel', NULL, 'laravel', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(180, 3, 'Symfony', NULL, 'symfony', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(181, 3, 'MS Excel', NULL, 'excel', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(182, 3, 'MS PowerPoint', NULL, 'powerpoint', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(183, 3, 'MS Access', NULL, 'access', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(184, 3, 'Grafika Raster/Wektor (Affinity lub Krita)', NULL, 'grafika-adv', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(185, 3, 'Skala, Rysunek i Cieniowanie', NULL, 'szkic', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(186, 3, 'Blender 3D (Podstawy)', NULL, 'blender', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(187, 3, 'Malowanie i wypalanie Tekstur 3D', NULL, 'teksturowanie', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(188, 3, 'Rigging modeli 3D', NULL, 'rigging', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(189, 3, 'Obróbka Wideo i Dźwięku', NULL, 'wideo', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(190, 3, 'Silnik Unity', NULL, 'unity', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(191, 3, 'Silnik Unreal Engine 5 (UE5)', NULL, 'ue5', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved'),
(192, 3, 'Malware (Wstęp do CyberSec)', NULL, 'malware', NULL, 0, '2026-03-09 20:12:54', 'General', 1, 'main', 'approved');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=193;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
