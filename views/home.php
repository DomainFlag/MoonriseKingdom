<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Ancient Empire</title>
    <link href="../public/css/home.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab" rel="stylesheet">
</head>
<body>
<?php include "partials/header.php"; ?>
<section>
    <div class="teams">
        <h1 class="team_header">Team 1</h1>
        <input class="input" type="text" placeholder="Username">
    </div>
    <div class="teams">
        <h1 class="team_header">Team 2</h1>
        <input class="input" type="text" placeholder="Username">
    </div>
    <input class="submit" type="button" value="Lets Start">
</section>
<div>
    <?php
    include('../php/fetchTeams.php');
    $data = getTeams();
    foreach ($data as $team) {
        ?>
        <div>
            <?php
            foreach ($team as $morpion) {
                echo $morpion["class"];
            }
            ?>
        </div>
        <?php
    }
    ?>
</div>
<?php include "partials/footer.php"; ?>
<script src="../public/scripts/home.js"></script>
</body>
</html>