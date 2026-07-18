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
-- Struktura tabeli dla tabeli `course_dependencies`
--

CREATE TABLE `course_dependencies` (
  `course_id` int(11) NOT NULL,
  `required_course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_dependencies`
--

INSERT INTO `course_dependencies` (`course_id`, `required_course_id`) VALUES
(3, 1),
(150, 1),
(151, 1),
(152, 1),
(153, 1),
(154, 1),
(155, 1),
(156, 1),
(157, 1),
(158, 1),
(159, 151),
(160, 159),
(161, 159),
(162, 161),
(163, 150),
(164, 150),
(165, 152),
(165, 164),
(166, 153),
(166, 164),
(167, 154),
(168, 167),
(169, 154),
(170, 169),
(171, 169),
(172, 169),
(173, 169),
(174, 169),
(175, 170),
(176, 175),
(177, 175),
(178, 175),
(179, 167),
(179, 171),
(180, 167),
(180, 171),
(181, 157),
(182, 157),
(183, 167),
(183, 181),
(184, 155),
(185, 184),
(186, 185),
(187, 186),
(188, 186),
(189, 155),
(190, 173),
(190, 186),
(191, 172),
(191, 186),
(191, 187),
(192, 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `course_dependencies`
--
ALTER TABLE `course_dependencies`
  ADD PRIMARY KEY (`course_id`,`required_course_id`),
  ADD KEY `required_course_id` (`required_course_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `course_dependencies`
--
ALTER TABLE `course_dependencies`
  ADD CONSTRAINT `course_dependencies_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_dependencies_ibfk_2` FOREIGN KEY (`required_course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
