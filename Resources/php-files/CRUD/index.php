<?php

declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <form method="POST" id="new-task">
        <label for="new_task_name">Nazwa zadania</label>
        <input type="text" name="new_task_name" id="new_task_name">
        <button name="action" value="create">Utwórz nowe zadanie</button>
    </form>

    <table>
        <thead>
            <th>Nr.</th>
            <th>Nazwa zadania</th>
            <th>Status zadania</th>
            <th>Akcje</th>
        </thead>
        <tbody>
            <form method="POST">
                <tr>
                    <td>1.</td>
                    <td> <input type="text" name="new_task_name" id="new_task_name" value="Wypić kawę"></td>
                    <td>
                        <label class="hit-area">
                            <input type="checkbox" name="done" id="task_1" checked>
                        </label>
                    </td>
                    <td>
                        <button name="action" value="update">Aktualizuj</button>
                        <button name="action" value="delete">Usuń</button>
                    </td>
                    <input type="hidden" name="id" value="1">
                </tr>
            </form>
        </tbody>
    </table>

</body>

</html>