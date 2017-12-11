<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Moonrise Kingdom</title>
    <link href="../public/css/home.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Roboto|Roboto+Slab" rel="stylesheet">
</head>
<body>
<?php include "partials/header.php"; ?>
<section>

    <?php
    include('../app/FetchTeams.php');
    $connexion = connectDB();
    $data = getTeams($connexion);
    disconnectDB($connexion);
    ?>

    <div class="custom_composition">
        <div class="close">X</div>
        <p class="count">8 Morpions Left</p>
        <div class="interface">
            <div class="custom_class">
                <img class="spirits predefined_spirit" src="./../public/assets/warrior.png" />
                <img class="add" src="./../public/assets/add.svg"/>
                <div class="taken"></div>
            </div>
            <div class="custom_class">
                <img class="spirits predefined_spirit" src="./../public/assets/archer.png" />
                <img class="add" src="./../public/assets/add.svg"/>
                <div class="taken"></div>
            </div>
            <div class="custom_class">
                <img class="spirits predefined_spirit" src="./../public/assets/mage.png" />
                <img class="add" src="./../public/assets/add.svg"/>
                <div class="taken"></div>
            </div>
            <div class="stats"></div>
        </div>
    </div>

    <div class="teams">
        <div class="team">
            <h1 class="team_header">Team 1</h1>
            <input class="input" type="text" placeholder="Name">
            <div class="colorpicker"></div>
            <input type="button" class="team_creator" value="Create Team">
        </div>
        <div class="team">
            <h1 class="team_header">Team 2</h1>
            <input class="input" type="text" placeholder="Name">
            <div class="colorpicker"></div>
            <input type="button" class="team_creator" value="Create Team">
        </div>
        <div class="assign">
            <div class="dimensions">
                <label for="dimension">Dimension:</label>
                <select id="dimension">
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
            </div>
            <input class="submit" type="button" value="Lets Start">
        </div>
    </div>

    <div class="compositions">
        <div class="choosing">
            <div id="crystal"></div>
            <h1 id="selected_team"></h1>
        </div>
        <div class="selection">
            <?php
            foreach ($data as $team) {
                ?>
                <div class="composition">
                    <?php
                    foreach ($team as $class => $classes) {
                        ?>
                        <div class="class">
                            <img src="<?php echo "./../public/assets/" . $class . ".png"; ?>" />
                            <h1 class="number"><?php echo  "x" . sizeof($classes); ?></h1>
                        </div>
                        <?php
                    }
                    ?>
                </div>
                <?php
            }
            ?>
        </div>
    </div>

</section>
<?php include "partials/footer.php"; ?>
<script src="../public/scripts/home.js"></script>
</body>
</html>